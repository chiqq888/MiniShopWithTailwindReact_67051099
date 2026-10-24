import Icon from "./Icon";

function Toast({ message, onClose }) {
  let visibility = "pointer-events-none opacity-0";
  if (message) visibility = "pointer-events-auto opacity-100";

  return (
    <div
      className={`fixed bottom-6 left-1/2 z-10 flex w-max max-w-[calc(100%-32px)] -translate-x-1/2 items-center gap-3 rounded-shop bg-shop-ink px-5 py-3.5 text-sm text-white shadow-[0_10px_35px_#0002] ${visibility}`}
      role="status"
      aria-live="polite"
    >
      {message && (
        <>
          <Icon name="cart" white />
          <span className="max-w-[600px] truncate">{message}</span>
          <button
            className="rounded-shop bg-transparent text-xl text-white"
            aria-label="ปิดข้อความ"
            onClick={onClose}
          >
            ×
          </button>
        </>
      )}
    </div>
  );
}
export default Toast;
