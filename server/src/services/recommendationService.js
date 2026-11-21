// Gợi ý tour bằng truy vấn SQL theo bộ lọc của khách (không dùng AI).
import pool from '../db/pool.js';
import { check, integer } from './adminCommon.js';

// Đọc và kiểm tra bộ lọc: ngân sách (VND/người), số ngày tối đa, số khách, khu vực, sở thích (tag).
// Bỏ trống thì không lọc theo tiêu chí đó; số khách mặc định là 1.
export function readFilters(raw = {}) {
  check(raw && typeof raw === 'object' && !Array.isArray(raw), 'Bộ lọc chưa hợp lệ.');
  const budget = raw.budget === '' || raw.budget == null ? null : raw.budget;
  const days = raw.days === '' || raw.days == null ? null : raw.days;
  const guests = raw.guests == null || raw.guests === '' ? 1 : raw.guests;
  check(budget === null || integer(budget, 1, 999999999999), 'Ngân sách phải là số nguyên dương (VND/người).');
  check(days === null || integer(days, 1, 60), 'Số ngày tối đa từ 1 đến 60.');
  check(integer(guests, 1, 20), 'Số khách từ 1 đến 20.');
  const region = raw.region ?? '', interest = raw.interest ?? '';
  check(typeof region === 'string' && region.length <= 50 && typeof interest === 'string' && interest.length <= 30, 'Khu vực hoặc sở thích chưa hợp lệ.');
  return { budget: budget === null ? null : Number(budget), days: days === null ? null : Number(days), guests: Number(guests), region: region.trim(), interest: interest.trim() };
}

// Lấy tối đa 12 tour, mỗi tour kèm lịch đi rẻ nhất còn đủ chỗ cho số khách.
// JOIN LATERAL: với mỗi tour, chạy một truy vấn con để chọn đúng 1 lịch phù hợp nhất.
// limit: số tour tối đa (mặc định 12 cho trang Tư vấn AI; quiz lấy rộng hơn để tự chấm điểm).
export async function recommend(filters, limit = 12) {
  // Hard filters in SQL. The model cannot add unpublished/sold-out tours to this list.
  const { rows } = await pool.query(`
    SELECT t.id,t.title,t.description,t.duration_days,t.departure_location,t.image_url,t.tags,
      d.name AS destination,d.region,td.id AS departure_id,to_char(td.start_date,'YYYY-MM-DD') AS start_date,
      td.price_per_person::text AS price_from,(td.capacity-td.seats_booked) AS seats_left
    FROM tours t JOIN destinations d ON d.id=t.destination_id
    JOIN LATERAL (
      SELECT dep.* FROM tour_departures dep WHERE dep.tour_id=t.id AND dep.status='scheduled'
        AND dep.start_date>CURRENT_DATE AND dep.capacity-dep.seats_booked >= $1
        AND ($2::numeric IS NULL OR dep.price_per_person <= $2)
      ORDER BY dep.price_per_person,dep.start_date,dep.id LIMIT 1
    ) td ON true
    WHERE t.status='active' AND ($3::int IS NULL OR t.duration_days <= $3)
      AND ($4='' OR d.region=$4) AND ($5='' OR $5=ANY(t.tags))
    ORDER BY td.price_per_person,td.start_date,t.id LIMIT $6`,
    [filters.guests, filters.budget, filters.days, filters.region, filters.interest, limit]);
  // Thay mô tả đầy đủ bằng bản tóm tắt 650 ký tự (gửi cho AI ngắn gọn hơn).
  return rows.map(({ description, ...tour }) => ({ ...tour, summary: description.slice(0, 650) }));
}

// Các lựa chọn cho bộ lọc: danh sách khu vực và tag của các tour đang bán.
export async function recommendationOptions() {
  const [regions, interests] = await Promise.all([
    pool.query("SELECT DISTINCT d.region FROM destinations d JOIN tours t ON t.destination_id=d.id WHERE t.status='active' ORDER BY d.region"),
    pool.query("SELECT DISTINCT unnest(tags) AS tag FROM tours WHERE status='active' ORDER BY tag"),
  ]);
  return { regions: regions.rows.map(x => x.region), interests: interests.rows.map(x => x.tag) };
}

// ===== Chọn tour bằng câu hỏi (quiz) =====
// Dành cho khách chưa biết đi đâu: trả lời vài câu hỏi, hệ thống chấm điểm từng tour.

// So sánh tag không phân biệt hoa thường và cách gõ dấu (NFC).
const normalizeTag = (value) => String(value).normalize('NFC').trim().toLowerCase();

// Đọc danh sách tag dạng "biển,nghỉ dưỡng". Tối đa 8 tag, mỗi tag tối đa 30 ký tự.
function readTags(raw, label) {
  if (raw == null || raw === '') return [];
  check(typeof raw === 'string' && raw.length <= 300, `${label} chưa hợp lệ.`);
  const tags = [...new Set(raw.split(',').map(normalizeTag).filter(Boolean))];
  check(tags.length <= 8 && tags.every((tag) => tag.length <= 30), `${label} chưa hợp lệ.`);
  return tags;
}

// Đọc câu trả lời quiz từ query string.
// tags: sở thích chính (mỗi tag khớp +3 điểm); bonus: gợi ý theo người đi cùng (mỗi tag khớp +1 điểm).
export function readQuiz(raw = {}) {
  check(raw && typeof raw === 'object' && !Array.isArray(raw), 'Câu trả lời chưa hợp lệ.');
  const filters = readFilters({ budget: raw.budget, days: raw.days, guests: raw.guests, region: raw.region });
  return { filters, tags: readTags(raw.tags, 'Sở thích'), bonus: readTags(raw.bonus, 'Gợi ý bổ sung') };
}

// Các mức nới lỏng khi không có tour nào khớp đủ điều kiện, theo thứ tự ưu tiên.
const relaxSteps = [
  { key: 'days', label: 'số ngày' },
  { key: 'budget', label: 'ngân sách' },
  { key: 'region', label: 'khu vực', empty: '' },
];

// Chấm điểm và trả về tối đa 6 tour phù hợp nhất.
// Điều kiện cứng (còn chỗ, số khách...) vẫn lọc bằng SQL; sở thích chỉ dùng để xếp hạng.
export async function quizMatch({ filters, tags, bonus }) {
  let current = { ...filters, interest: '' };
  const relaxed = [];
  let candidates = await recommend(current, 60);
  // Không có tour nào: nới dần số ngày, ngân sách, khu vực rồi tìm lại.
  for (const step of relaxSteps) {
    if (candidates.length) break;
    const emptyValue = step.empty ?? null;
    if (current[step.key] === emptyValue) continue;
    current = { ...current, [step.key]: emptyValue };
    relaxed.push(step.label);
    candidates = await recommend(current, 60);
  }

  const maxScore = tags.length * 3 + bonus.filter((tag) => !tags.includes(tag)).length || 1;
  const scored = candidates
    .map((tour) => {
      const tourTags = new Set((tour.tags || []).map(normalizeTag));
      const matched = tags.filter((tag) => tourTags.has(tag));
      const matchedBonus = bonus.filter((tag) => tourTags.has(tag) && !matched.includes(tag));
      const score = matched.length * 3 + matchedBonus.length;
      return { ...tour, matched_tags: [...matched, ...matchedBonus], score, match_percent: Math.round((score / maxScore) * 100) };
    })
    // Điểm cao lên trước; bằng điểm thì tour rẻ hơn lên trước (thứ tự SQL đã sắp theo giá).
    .sort((a, b) => b.score - a.score);
  // Có tour khớp sở thích thì bỏ các tour 0 điểm; không có tour nào khớp thì vẫn gợi ý theo giá.
  const matching = scored.filter((tour) => tour.score > 0);
  const items = (matching.length ? matching : scored).slice(0, 6);

  return { items, relaxed, filters: current };
}
