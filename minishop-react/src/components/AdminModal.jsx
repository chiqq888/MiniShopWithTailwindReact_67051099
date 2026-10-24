import { useEffect, useId, useRef } from "react";

// แยกจาก Modal ของ Cart เพื่อใช้ DaisyUI และสีตามธีมในฝั่ง Admin
export default function AdminModal({ title, children, onClose, busy = false }) {
  const dialogRef = useRef(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialog.showModal();
    // React autofocus อาจทำงานก่อน dialog เปิด โดยเฉพาะ StrictMode
    dialog.querySelector("input, select, textarea")?.focus();
    return () => {
      dialog.close();
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  return (
    <dialog
      ref={dialogRef}
      className="modal p-4 text-base-content backdrop:bg-black/50"
      aria-labelledby={titleId}
      onCancel={(event) => {
        event.preventDefault();
        if (!busy) onClose();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget && !busy) onClose();
      }}
    >
      <div className="modal-box max-h-[calc(100dvh-32px)] w-full max-w-xl overflow-y-auto rounded-shop border border-base-300 bg-base-100 p-5 sm:p-7">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <p className="mb-2 text-[10px] tracking-[2px] text-base-content/60">MINISHOP / PRODUCT DETAILS</p>
            <h2 id={titleId} className="text-2xl font-semibold tracking-tight">{title}</h2>
          </div>
          <button type="button" className="btn btn-ghost btn-square shrink-0 text-2xl" disabled={busy} onClick={onClose} aria-label="Close modal">×</button>
        </div>
        {children}
      </div>
      <div className="modal-backdrop">
        <button type="button" onClick={onClose} disabled={busy} aria-label="Close modal backdrop" tabIndex={-1} />
      </div>
    </dialog>
  );
}
