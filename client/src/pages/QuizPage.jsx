// Trang "Chọn tour giúp tôi" (/quiz): dành cho khách chưa biết đi đâu.
// Trả lời 5 câu hỏi ngắn -> server chấm điểm các tour còn chỗ theo sở thích -> hiện tour hợp nhất.
// Không cần đăng nhập. Chỉ dùng dữ liệu tour thật trong database (không gọi AI).
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import TourImage from "../components/TourImage.jsx";
import { useRequest } from "../hooks/useRequest.js";
import { request } from "../services/authApi.js";
import { formatPrice } from "../utils/format.js";
import { bookingDate, checkoutPath } from "../utils/booking.js";
import { useCompare } from "../context/CompareContext.js";
import "../styles/quiz.css";

// Câu 1: đi cùng ai. guests = số khách cần đủ chỗ; bonus = tag cộng thêm điểm.
const companions = [
  { id: "solo", icon: "🎒", label: "Một mình", hint: "Tự do khám phá theo ý mình", guests: 1, bonus: ["phiêu lưu", "nhiếp ảnh"] },
  { id: "couple", icon: "💑", label: "Cặp đôi", hint: "Lãng mạn, riêng tư", guests: 2, bonus: ["nghỉ dưỡng", "biển"] },
  { id: "family", icon: "👨‍👩‍👧", label: "Gia đình", hint: "Đi cùng ba mẹ, trẻ nhỏ", guests: 4, bonus: ["gia đình"] },
  { id: "friends", icon: "🧑‍🤝‍🧑", label: "Nhóm bạn", hint: "Vui, đông, nhiều trải nghiệm", guests: 5, bonus: ["phiêu lưu", "ẩm thực"] },
];

// Câu 2: phong cách chuyến đi (chọn tối đa 3). tags khớp với tag của tour trong database.
const vibes = [
  { id: "beach", icon: "🏖️", label: "Biển xanh, nắng vàng", tags: ["biển"] },
  { id: "mountain", icon: "⛰️", label: "Núi rừng, thiên nhiên", tags: ["núi", "thiên nhiên"] },
  { id: "culture", icon: "🏯", label: "Văn hóa, lịch sử", tags: ["văn hóa", "lịch sử"] },
  { id: "food", icon: "🍜", label: "Ăn ngon, đặc sản", tags: ["ẩm thực"] },
  { id: "adventure", icon: "🧗", label: "Khám phá, mạo hiểm", tags: ["phiêu lưu", "hang động"] },
  { id: "relax", icon: "🌴", label: "Nghỉ ngơi, thư giãn", tags: ["nghỉ dưỡng"] },
  { id: "river", icon: "🛶", label: "Sông nước miệt vườn", tags: ["sông nước"] },
  { id: "photo", icon: "📸", label: "Săn ảnh đẹp", tags: ["nhiếp ảnh"] },
];
const MAX_VIBES = 3;

// Câu 3: số ngày tối đa. Câu 4: ngân sách tối đa mỗi người. null = không giới hạn.
const durations = [
  { id: "weekend", icon: "🌙", label: "Cuối tuần", hint: "2–3 ngày", days: 3 },
  { id: "short", icon: "🗓️", label: "Vài ngày", hint: "4–5 ngày", days: 5 },
  { id: "week", icon: "✈️", label: "Cả tuần", hint: "Tối đa 7 ngày", days: 7 },
  { id: "any", icon: "🤷", label: "Chưa chắc", hint: "Bao lâu cũng được", days: null },
];
const budgets = [
  { id: "save", icon: "💵", label: "Tiết kiệm", hint: "Dưới 3 triệu / người", budget: 3000000 },
  { id: "mid", icon: "💳", label: "Vừa phải", hint: "Đến 6 triệu / người", budget: 6000000 },
  { id: "high", icon: "💎", label: "Thoải mái hơn", hint: "Đến 10 triệu / người", budget: 10000000 },
  { id: "any", icon: "✨", label: "Không giới hạn", hint: "Miễn là chuyến đi đáng nhớ", budget: null },
];

// Câu 5: khu vực. Danh sách lấy từ database; tải lỗi thì dùng danh sách mặc định.
const regionIcons = { "Miền Bắc": "🏔️", "Miền Trung": "🏝️", "Miền Nam": "🌅", "Tây Nguyên": "☕" };
const fallbackRegions = ["Miền Bắc", "Miền Trung", "Miền Nam", "Tây Nguyên"];

const steps = ["Bạn đi cùng ai?", "Bạn mong chờ điều gì?", "Bạn có bao nhiêu ngày?", "Ngân sách mỗi người?", "Bạn muốn đi miền nào?"];
const emptyAnswers = { companion: null, vibes: [], duration: null, budget: null, region: null };

// Một thẻ lựa chọn (radio hoặc checkbox) trông như nút lớn có biểu tượng.
function Choice({ type = "radio", name, checked, onChange, icon, label, hint, disabled }) {
  return (
    <label className={`quiz-choice${checked ? " is-checked" : ""}${disabled ? " is-disabled" : ""}`}>
      <input type={type} name={name} checked={checked} onChange={onChange} disabled={disabled} />
      <span className="quiz-choice-icon" aria-hidden="true">{icon}</span>
      <span className="quiz-choice-text"><strong>{label}</strong>{hint && <small>{hint}</small>}</span>
    </label>
  );
}

// Chuyển câu trả lời thành query string cho API /recommendations/quiz.
function toQuery(answers) {
  const companion = companions.find((c) => c.id === answers.companion);
  const tags = vibes.filter((v) => answers.vibes.includes(v.id)).flatMap((v) => v.tags);
  const days = durations.find((d) => d.id === answers.duration)?.days;
  const budget = budgets.find((b) => b.id === answers.budget)?.budget;
  const params = new URLSearchParams({ guests: String(companion?.guests ?? 1) });
  if (tags.length) params.set("tags", tags.join(","));
  if (companion?.bonus.length) params.set("bonus", companion.bonus.join(","));
  if (days) params.set("days", String(days));
  if (budget) params.set("budget", String(budget));
  if (answers.region && answers.region !== "any") params.set("region", answers.region);
  return params.toString();
}

// Phần kết quả: tour hợp nhất nổi bật, các tour còn lại xếp lưới.
function QuizResults({ query, guests, onRestart, onCompare }) {
  const [retry, setRetry] = useState(0);
  const result = useRequest(`${query}#${retry}`, (signal) => request(`/recommendations/quiz?${query}`, { signal }));
  if (result.error) {
    return (
      <div className="state-box" role="alert">
        <p>{result.error.message}</p>
        <button className="button button-secondary" type="button" onClick={() => setRetry((n) => n + 1)}>Thử lại</button>
      </div>
    );
  }
  if (!result.data) return <p className="quiz-loading" role="status">Đang tìm những chuyến đi hợp với bạn…</p>;

  const { items, relaxed } = result.data;
  if (!items.length) {
    return (
      <div className="state-box">
        <h2>Hiện chưa có tour còn đủ chỗ</h2>
        <p>Thử giảm số người đi cùng hoặc quay lại sau nhé.</p>
        <button className="button button-primary" type="button" onClick={onRestart}>Làm lại từ đầu</button>
      </div>
    );
  }
  const [best, ...others] = items;
  return (
    <div className="quiz-results">
      {relaxed.length > 0 && (
        <p className="quiz-relaxed" role="status">
          Chưa có tour khớp hoàn toàn, nên mình đã nới <strong>{relaxed.join(", ")}</strong> để gợi ý những lựa chọn gần nhất.
        </p>
      )}
      <article className="quiz-best">
        <div className="quiz-best-media">
          <TourImage tour={best} />
          {best.matched_tags.length > 0 && <span className="quiz-match">Hợp {best.match_percent}%</span>}
        </div>
        <div className="quiz-best-body">
          <p className="section-kicker">LỰA CHỌN HỢP NHẤT</p>
          <h2>{best.title}</h2>
          <p className="quiz-meta">{best.destination} · {best.region} · {best.duration_days} ngày · Đi {bookingDate(best.start_date)}</p>
          {best.matched_tags.length > 0 && (
            <ul className="quiz-tags" aria-label="Điểm hợp với bạn">{best.matched_tags.map((tag) => <li key={tag}>✓ {tag}</li>)}</ul>
          )}
          <p className="quiz-summary">{best.summary}</p>
          <div className="quiz-best-bottom">
            <div><small>Giá từ</small><strong>{formatPrice(best.price_from)}</strong><small> / người</small></div>
            <div className="quiz-actions">
              <Link className="button button-primary" to={checkoutPath(best.id, best.departure_id, guests)}>Chọn lịch này</Link>
              <Link className="button button-secondary" to={`/tours/${best.id}`}>Xem hành trình</Link>
            </div>
          </div>
        </div>
      </article>

      {others.length > 0 && (
        <>
          <h2 className="quiz-others-title">Có thể bạn cũng thích</h2>
          <div className="quiz-grid">
            {others.map((tour) => (
              <article className="quiz-card" key={tour.id}>
                <div className="quiz-card-media">
                  <TourImage tour={tour} />
                  {tour.matched_tags.length > 0 && <span className="quiz-match">Hợp {tour.match_percent}%</span>}
                </div>
                <div className="quiz-card-body">
                  <p className="quiz-meta">{tour.destination} · {tour.duration_days} ngày</p>
                  <h3><Link to={`/tours/${tour.id}`}>{tour.title}</Link></h3>
                  {tour.matched_tags.length > 0 && <p className="quiz-card-tags">{tour.matched_tags.join(" · ")}</p>}
                  <p className="quiz-card-price"><strong>{formatPrice(tour.price_from)}</strong> / người</p>
                  <Link className="button button-secondary" to={checkoutPath(tour.id, tour.departure_id, guests)}>Chọn lịch đi {bookingDate(tour.start_date)}</Link>
                </div>
              </article>
            ))}
          </div>
        </>
      )}

      <div className="quiz-restart">
        {items.length >= 2 && <button className="button button-primary" type="button" onClick={() => onCompare(items)}>So sánh các tour này ⇄</button>}
        <button className="button button-secondary" type="button" onClick={onRestart}>↺ Làm lại câu hỏi</button>
        <Link className="button button-dark" to="/recommendations">Hỏi thêm trợ lý AI ✦</Link>
      </div>
    </div>
  );
}

export default function QuizPage() {
  const navigate = useNavigate();
  const { replace } = useCompare();
  // step: câu đang hỏi (0–4); bằng steps.length nghĩa là đang xem kết quả.
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState(emptyAnswers);
  const options = useRequest("options", (signal) => request("/recommendations/options", { signal }));
  const regions = options.data?.regions?.length ? options.data.regions : fallbackRegions;

  const set = (key, value) => setAnswers((current) => ({ ...current, [key]: value }));
  const toggleVibe = (id) => setAnswers((current) => ({
    ...current,
    vibes: current.vibes.includes(id) ? current.vibes.filter((v) => v !== id) : [...current.vibes, id].slice(0, MAX_VIBES),
  }));
  // Mỗi câu phải có câu trả lời mới đi tiếp được (câu 2 cần ít nhất 1 lựa chọn).
  const answered = [answers.companion, answers.vibes.length > 0, answers.duration, answers.budget, answers.region][step];
  const finished = step >= steps.length;
  const restart = () => { setAnswers(emptyAnswers); setStep(0); };
  const guests = companions.find((c) => c.id === answers.companion)?.guests ?? 1;
  function compareResults(items) {
    const selected = items.slice(0, 3);
    replace(selected);
    navigate(`/compare?ids=${selected.map((tour) => tour.id).join(",")}`);
  }

  function next(event) {
    event.preventDefault();
    if (answered) setStep((s) => s + 1);
  }

  return (
    <>
      <Header />
      <main className="quiz-page">
        <section className="quiz-hero">
          <div className="container">
            <p className="section-kicker">CHƯA BIẾT ĐI ĐÂU?</p>
            <h1>{finished ? "Những chuyến đi dành cho bạn." : "Trả lời 5 câu hỏi, chúng tôi chọn tour giúp bạn."}</h1>
            <p>{finished ? "Xếp hạng theo sở thích của bạn, chỉ gồm các lịch còn đủ chỗ." : "Mất chưa tới một phút. Không cần đăng nhập."}</p>
          </div>
        </section>

        <div className="container quiz-body">
          {finished ? (
            <QuizResults query={toQuery(answers)} guests={guests} onRestart={restart} onCompare={compareResults} />
          ) : (
            <form className="quiz-card-step" onSubmit={next} aria-labelledby="quiz-question">
              {/* Thanh tiến độ */}
              <div className="quiz-progress" aria-label={`Câu ${step + 1} trên ${steps.length}`}>
                <span style={{ width: `${((step + 1) / steps.length) * 100}%` }} />
              </div>
              <p className="quiz-step-count">Câu {step + 1} / {steps.length}</p>
              <h2 id="quiz-question" key={step} className="quiz-question">{steps[step]}</h2>

              <fieldset className="quiz-choices" key={`choices-${step}`}>
                <legend className="sr-only">{steps[step]}</legend>
                {step === 0 && companions.map((c) => (
                  <Choice key={c.id} name="companion" checked={answers.companion === c.id} onChange={() => set("companion", c.id)} icon={c.icon} label={c.label} hint={c.hint} />
                ))}
                {step === 1 && vibes.map((v) => (
                  <Choice key={v.id} type="checkbox" name="vibes" checked={answers.vibes.includes(v.id)} onChange={() => toggleVibe(v.id)} icon={v.icon} label={v.label}
                    disabled={!answers.vibes.includes(v.id) && answers.vibes.length >= MAX_VIBES} />
                ))}
                {step === 2 && durations.map((d) => (
                  <Choice key={d.id} name="duration" checked={answers.duration === d.id} onChange={() => set("duration", d.id)} icon={d.icon} label={d.label} hint={d.hint} />
                ))}
                {step === 3 && budgets.map((b) => (
                  <Choice key={b.id} name="budget" checked={answers.budget === b.id} onChange={() => set("budget", b.id)} icon={b.icon} label={b.label} hint={b.hint} />
                ))}
                {step === 4 && [...regions, "any"].map((r) => (
                  <Choice key={r} name="region" checked={answers.region === r} onChange={() => set("region", r)}
                    icon={r === "any" ? "🧭" : regionIcons[r] || "📍"} label={r === "any" ? "Đâu cũng được" : r} hint={r === "any" ? "Để chúng tôi chọn giúp" : undefined} />
                ))}
              </fieldset>
              {step === 1 && <p className="quiz-hint">Chọn tối đa {MAX_VIBES} điều bạn thích ({answers.vibes.length}/{MAX_VIBES}).</p>}

              <div className="quiz-nav">
                <button className="button button-secondary" type="button" disabled={step === 0} onClick={() => setStep((s) => s - 1)}>← Quay lại</button>
                <button className="button button-primary" type="submit" disabled={!answered}>
                  {step === steps.length - 1 ? "Xem tour hợp với tôi ✦" : "Tiếp tục →"}
                </button>
              </div>
            </form>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
