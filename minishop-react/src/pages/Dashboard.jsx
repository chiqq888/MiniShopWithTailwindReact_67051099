import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getProducts } from "../services/productApi";

const priceFormatter = new Intl.NumberFormat("th-TH", {
  style: "currency",
  currency: "THB",
});

function errorMessage(error) {
  if (error instanceof TypeError) {
    return "เชื่อมต่อ API ไม่สำเร็จ กรุณาตรวจสอบว่าเปิด npm run api ที่พอร์ต 3001 แล้ว";
  }
  return error.message || "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง";
}

function numericPrice(price) {
  const value = Number(price);
  return Number.isFinite(value) ? value : 0;
}

function Dashboard() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [requestVersion, setRequestVersion] = useState(0);

  // อ่าน API ใหม่ทุกครั้งที่เข้าหน้านี้ เพื่อให้ค่าตรงกับ CRUD ในหน้า Products
  useEffect(() => {
    const controller = new AbortController();
    getProducts({ signal: controller.signal })
      .then((data) => {
        if (!Array.isArray(data)) throw new Error("ข้อมูลสินค้าจาก API ไม่ถูกต้อง");
        if (!controller.signal.aborted) setProducts(data);
      })
      .catch((error) => {
        if (!controller.signal.aborted) setLoadError(errorMessage(error));
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [requestVersion]);

  function retryLoad() {
    if (loading) return;
    setLoading(true);
    setLoadError("");
    setRequestVersion((current) => current + 1);
  }

  // ใช้ข้อมูลทุกแถวจาก API คำนวณสรุป ส่วนตารางแสดงเพียง 5 รายการแรก
  const productValue = products.reduce((total, product) => total + numericPrice(product.price), 0);
  const categoryCount = new Set(
    products.map((product) => product.category?.trim()).filter(Boolean),
  ).size;
  const unavailable = loading || Boolean(loadError);
  const summaries = [
    { label: "Total Products", value: products.length, detail: "สินค้าทั้งหมดในระบบ" },
    { label: "Product Value", value: priceFormatter.format(productValue), detail: "ผลรวมราคาสินค้าทุกรายการ" },
    { label: "Categories", value: categoryCount, detail: "หมวดหมู่สินค้าที่มีอยู่" },
  ];

  return (
    <section className="min-w-0" aria-labelledby="dashboard-title" aria-busy={loading}>
      <nav aria-label="Breadcrumb" className="breadcrumbs mb-5 text-sm text-base-content/65">
        <ul>
          <li><Link to="/admin">Admin</Link></li>
          <li aria-current="page">Dashboard</li>
        </ul>
      </nav>

      <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="mb-2 text-[11px] tracking-[2px] text-base-content/55">YOUR STORE, AT A GLANCE.</p>
          <h1 id="dashboard-title" className="text-3xl font-semibold tracking-tight sm:text-4xl">Dashboard</h1>
          <p className="mt-3 text-sm text-base-content/65">ภาพรวมสินค้าและหมวดหมู่ของ MiniShop จากข้อมูล API ปัจจุบัน</p>
        </div>
        <Link to="/admin/products" className="btn btn-neutral rounded-shop">Manage Products</Link>
      </div>

      <div className="mb-7 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        {summaries.map((summary) => (
          <article key={summary.label} className="card min-w-0 rounded-shop border border-base-300 bg-base-100">
            <div className="card-body gap-2 p-5 sm:p-6">
              <h2 className="text-sm font-medium text-base-content/65">{summary.label}</h2>
              <p className="break-words text-3xl font-semibold tracking-tight tabular-nums">{unavailable ? "—" : summary.value}</p>
              <p className="text-xs text-base-content/55">{summary.detail}</p>
            </div>
          </article>
        ))}
      </div>

      <div className="card min-w-0 overflow-hidden rounded-shop border border-base-300 bg-base-100">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-base-300 px-5 py-4 sm:px-6">
          <div>
            <h2 className="text-lg font-medium">Product Overview</h2>
            <p className="mt-1 text-xs text-base-content/60">สินค้า 5 รายการแรกในระบบ</p>
          </div>
          <Link to="/admin/products" className="btn btn-ghost btn-sm rounded-shop">View all products</Link>
        </div>

        {loading ? (
          <div role="status" className="flex items-center justify-center gap-3 px-5 py-16 text-sm text-base-content/65">
            <span aria-hidden="true" className="loading loading-spinner loading-sm" />กำลังโหลดภาพรวมสินค้า…
          </div>
        ) : loadError ? (
          <div className="p-5 sm:p-6">
            <div role="alert" className="alert alert-error rounded-shop">
              <div className="min-w-0">
                <h3 className="font-medium">โหลด Dashboard ไม่สำเร็จ</h3>
                <p className="mt-1 text-sm">{loadError}</p>
              </div>
            </div>
            <button type="button" onClick={retryLoad} className="btn btn-outline mt-4 rounded-shop">Retry / ลองใหม่</button>
          </div>
        ) : products.length === 0 ? (
          <div className="px-5 py-14 text-center">
            <h3 className="font-medium">ยังไม่มีสินค้าในระบบ</h3>
            <p className="mt-2 text-sm text-base-content/65">เพิ่มสินค้ารายการแรกเพื่อเริ่มดูภาพรวมร้าน</p>
            <Link to="/admin/products" className="btn btn-neutral mt-5 rounded-shop">Add Product</Link>
          </div>
        ) : (
          <div className="overflow-x-auto" role="region" aria-label="ตารางภาพรวมสินค้า เลื่อนแนวนอนเพื่อดูข้อมูลทั้งหมด" tabIndex={0}>
            <table className="table table-zebra min-w-[480px]">
              <caption className="sr-only">ชื่อ หมวดหมู่ และราคาของสินค้า 5 รายการแรกจาก API</caption>
              <thead className="text-base-content/65">
                <tr>
                  <th scope="col" className="px-5 py-4 sm:px-6">ชื่อสินค้า</th>
                  <th scope="col" className="py-4">หมวดหมู่</th>
                  <th scope="col" className="px-5 py-4 text-right sm:px-6">ราคา (บาท)</th>
                </tr>
              </thead>
              <tbody>
                {products.slice(0, 5).map((product) => (
                  <tr key={product.id}>
                    <th scope="row" className="max-w-[260px] break-words whitespace-normal px-5 py-5 font-medium sm:px-6">{product.name}</th>
                    <td className="py-5"><span className="badge badge-ghost whitespace-nowrap">{product.category || "Uncategorized"}</span></td>
                    <td className="whitespace-nowrap px-5 py-5 text-right tabular-nums sm:px-6">{priceFormatter.format(numericPrice(product.price))}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}

export default Dashboard;
