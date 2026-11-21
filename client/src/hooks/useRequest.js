// Hook tải dữ liệu dùng chung cho các trang.
// key: chuỗi đại diện cho "lần tải" (ví dụ `${page}:${retry}`). Đổi key thì tải lại;
//      truyền null để chưa tải.
// load(signal): hàm trả về Promise dữ liệu, nhận AbortSignal để hủy khi rời trang.
// Kết quả gắn với key, nên khi key đổi thì data/error cũ tự ẩn, loading = true,
// không cần gọi setState đồng bộ trong effect để reset.
import { useEffect, useEffectEvent, useState } from "react";

export function useRequest(key, load) {
  const [state, setState] = useState({ key: null, data: undefined, error: null });
  // useEffectEvent: luôn dùng phiên bản load mới nhất mà không làm effect chạy lại.
  const run = useEffectEvent((signal) => load(signal));

  useEffect(() => {
    if (key === null) return undefined;
    const controller = new AbortController();
    run(controller.signal).then(
      (data) => { if (!controller.signal.aborted) setState({ key, data, error: null }); },
      (error) => { if (!controller.signal.aborted) setState({ key, data: undefined, error }); },
    );
    return () => controller.abort();
  }, [key]);

  const current = key !== null && state.key === key;
  return {
    data: current ? state.data : undefined,
    error: current ? state.error : null,
    loading: key !== null && !current,
  };
}
