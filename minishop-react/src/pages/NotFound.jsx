import { Link } from "react-router-dom";

function NotFound() {
  return (
    <section className="py-20 text-center">
      <h1 className="text-2xl font-medium">404 — ไม่พบหน้าที่ต้องการ</h1>
      <Link to="/" className="mt-4 inline-block underline underline-offset-4">
        กลับหน้าหลัก
      </Link>
    </section>
  );
}

export default NotFound;
