import { useEffect, useRef, useState } from "react";
import Icon from "../components/Icon";
import {
  createProduct,
  deleteProduct,
  getProducts,
  updateProduct,
} from "../services/productApi";

const emptyForm = { name: "", price: "" };
const priceFormatter = new Intl.NumberFormat("th-TH", {
  style: "currency",
  currency: "THB",
});
const buttonClass = "inline-flex min-h-11 items-center justify-center gap-2 rounded-shop border border-shop-border bg-white px-4 py-2 text-sm transition-colors hover:bg-shop-surface";
const inputClass = "mt-2 w-full rounded-shop border border-shop-border bg-white px-4 py-3 text-sm placeholder:text-[#999] disabled:bg-shop-surface";

function errorMessage(error) {
  if (error instanceof TypeError) {
    return "เชื่อมต่อ API ไม่สำเร็จ กรุณาตรวจสอบว่าเปิด npm run api ที่พอร์ต 3001 แล้ว";
  }
  return error.message || "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง";
}

function ProductManagement() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingProduct, setEditingProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [actionError, setActionError] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const [notice, setNotice] = useState("");
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const nameInputRef = useRef(null);
  const busy = loading || saving || deletingId !== null;

  // โหลดครั้งแรก และยกเลิก request เมื่อออกจากหน้า (รองรับ StrictMode ด้วย)
  useEffect(() => {
    const controller = new AbortController();
    getProducts({ signal: controller.signal })
      .then((data) => {
        if (!controller.signal.aborted) setProducts(data);
      })
      .catch((error) => {
        if (!controller.signal.aborted) setLoadError(errorMessage(error));
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, []);

  // อ่านรายการใหม่หลังเพิ่ม/แก้ไข/ลบ เพื่อให้ตารางตรงกับข้อมูลใน API
  async function loadProducts() {
    setLoading(true);
    setLoadError("");
    try {
      setProducts(await getProducts());
    } catch (error) {
      setLoadError(errorMessage(error));
    } finally {
      setLoading(false);
    }
  }

  function resetForm() {
    setForm(emptyForm);
    setEditingProduct(null);
    setFormErrors({});
    setActionError("");
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setFormErrors((current) => ({ ...current, [name]: "" }));
    setNotice("");
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (busy) return;
    const name = form.name.trim();
    const price = Number(form.price);
    const errors = {};
    if (!name) errors.name = "กรุณากรอกชื่อสินค้า";
    if (!form.price.trim() || !Number.isFinite(price) || price <= 0) {
      errors.price = "กรุณากรอกราคาที่มากกว่า 0 บาท";
    }
    setFormErrors(errors);
    setNotice("");
    setActionError("");
    if (Object.keys(errors).length) return;

    setSaving(true);
    try {
      if (editingProduct) {
        // PUT ส่งข้อมูลทั้งรายการ พร้อมเก็บฟิลด์เดิมที่ไม่ได้อยู่ในฟอร์ม
        await updateProduct(editingProduct.id, { ...editingProduct, name, price });
      } else {
        await createProduct({ name, price });
      }
      const message = editingProduct ? `บันทึกการแก้ไข ${name} แล้ว` : `เพิ่ม ${name} แล้ว`;
      resetForm();
      setNotice(message);
      await loadProducts();
    } catch (error) {
      setActionError(errorMessage(error));
    } finally {
      setSaving(false);
    }
  }

  function handleEdit(product) {
    setEditingProduct(product);
    setForm({ name: product.name, price: String(product.price) });
    setFormErrors({});
    setNotice("");
    setActionError("");
    nameInputRef.current?.focus();
  }

  async function handleDelete(product) {
    if (busy || !window.confirm(`ต้องการลบสินค้า "${product.name}" ใช่หรือไม่?`)) return;
    setDeletingId(product.id);
    setActionError("");
    setNotice("");
    try {
      await deleteProduct(product.id);
      if (editingProduct?.id === product.id) resetForm();
      setNotice(`ลบ ${product.name} แล้ว`);
      await loadProducts();
    } catch (error) {
      setActionError(errorMessage(error));
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <section className="py-10 sm:py-14" aria-labelledby="management-title">
      <div className="mb-7 flex items-center justify-between gap-4 text-[11px] tracking-[2px] text-shop-muted">
        <p>MINISHOP / MANAGEMENT</p>
        <span className="hidden sm:inline">YOUR PRODUCTS, IN ONE PLACE.</span>
      </div>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-5">
        <div>
          <h1 id="management-title" className="text-3xl font-semibold tracking-tight sm:text-4xl">Product Management</h1>
          <p className="mt-3 text-sm text-shop-muted">จัดการสินค้า เพิ่มรายการใหม่ หรือปรับข้อมูลให้เป็นปัจจุบัน</p>
        </div>
        <span className="inline-flex min-h-11 items-center gap-2 rounded-shop border border-shop-border bg-white px-4 text-xs">
          <Icon name="box" className="size-[18px]" />
          {loading || loadError ? "รายการสินค้า" : `${products.length} รายการ`}
        </span>
      </div>

      {notice && <p role="status" className="mb-5 rounded-shop border border-[#bdd5c5] bg-[#f0f7f2] px-5 py-3 text-sm text-[#245b39]">{notice}</p>}
      {actionError && <p role="alert" className="mb-5 rounded-shop border border-[#e9c3c3] bg-[#fff5f5] px-5 py-3 text-sm text-[#9c3030]">{actionError}</p>}

      <div className="grid items-start gap-6 lg:grid-cols-[330px_minmax(0,1fr)]">
        <aside className="rounded-shop border border-shop-border bg-white p-6 sm:p-7">
          <div className="mb-6 flex items-center justify-between gap-3">
            <h2 className="text-lg font-medium">{editingProduct ? "แก้ไขสินค้า" : "เพิ่มสินค้าใหม่"}</h2>
            <span className="grid size-9 place-items-center rounded-shop bg-shop-surface"><Icon name="box" className="size-5" /></span>
          </div>
          <form onSubmit={handleSubmit} noValidate aria-label={editingProduct ? "แก้ไขสินค้า" : "เพิ่มสินค้า"}>
            <fieldset disabled={busy || Boolean(loadError)} className="space-y-5">
              <div>
                <label htmlFor="product-name" className="text-sm font-medium">ชื่อสินค้า</label>
                <input ref={nameInputRef} id="product-name" name="name" value={form.name} onChange={handleChange} placeholder="เช่น Mouse" required aria-invalid={Boolean(formErrors.name)} aria-describedby={formErrors.name ? "name-error" : undefined} className={inputClass} />
                {formErrors.name && <p id="name-error" role="alert" className="mt-2 text-xs text-[#9c3030]">{formErrors.name}</p>}
              </div>
              <div>
                <label htmlFor="product-price" className="text-sm font-medium">ราคา (บาท)</label>
                <input id="product-price" name="price" type="number" min="0.01" step="0.01" value={form.price} onChange={handleChange} placeholder="0.00" required aria-invalid={Boolean(formErrors.price)} aria-describedby={formErrors.price ? "price-error" : undefined} className={inputClass} />
                {formErrors.price && <p id="price-error" role="alert" className="mt-2 text-xs text-[#9c3030]">{formErrors.price}</p>}
              </div>
              <button type="submit" className="flex min-h-11 w-full items-center justify-center rounded-shop bg-shop-ink px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-[#454545]">
                {saving ? "กำลังบันทึก…" : editingProduct ? "Save Changes" : "Add Product"}
              </button>
              {editingProduct && <button type="button" onClick={resetForm} className={`${buttonClass} w-full`}>ยกเลิกการแก้ไข</button>}
            </fieldset>
          </form>
        </aside>

        <div className="min-w-0 overflow-hidden rounded-shop border border-shop-border bg-white" aria-busy={loading}>
          <div className="flex items-center justify-between gap-3 border-b border-shop-border px-5 py-4 sm:px-6">
            <h2 className="text-lg font-medium">รายการสินค้า</h2>
            <button type="button" className={buttonClass} disabled={busy} onClick={loadProducts}>โหลดใหม่ <span aria-hidden="true">↻</span></button>
          </div>
          {loading ? (
            <div role="status" className="px-6 py-16 text-center text-sm text-shop-muted">กำลังโหลดสินค้า…</div>
          ) : loadError ? (
            <div role="alert" className="px-6 py-12 text-center">
              <h3 className="font-medium text-[#9c3030]">โหลดสินค้าไม่สำเร็จ</h3>
              <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-shop-muted">{loadError}</p>
              <button type="button" className={`${buttonClass} mt-5`} onClick={loadProducts}>ลองใหม่</button>
            </div>
          ) : products.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <span className="mx-auto grid size-14 place-items-center rounded-full bg-shop-surface"><Icon name="box" className="size-7" /></span>
              <h3 className="mt-4 font-medium">ยังไม่มีสินค้า</h3>
              <p className="mt-2 text-sm text-shop-muted">เริ่มเพิ่มสินค้ารายการแรกผ่านฟอร์มได้เลย</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[480px] text-left text-sm">
                <caption className="sr-only">สินค้าที่จัดการผ่าน REST API</caption>
                <thead className="bg-shop-surface text-xs text-shop-muted">
                  <tr><th scope="col" className="px-5 py-3 font-medium sm:px-6">ID</th><th scope="col" className="px-3 py-3 font-medium">ชื่อสินค้า</th><th scope="col" className="px-3 py-3 text-right font-medium">ราคา (บาท)</th><th scope="col" className="px-5 py-3 text-right font-medium sm:px-6">จัดการ</th></tr>
                </thead>
                <tbody className="divide-y divide-shop-border">
                  {products.map((product) => (
                    <tr key={product.id} className={editingProduct?.id === product.id ? "bg-[#f5f5f5]" : ""}>
                      <td className="px-5 py-5 text-xs tabular-nums text-shop-muted sm:px-6">{product.id}</td>
                      <th scope="row" className="max-w-[240px] break-words px-3 py-5 font-medium">{product.name}</th>
                      <td className="whitespace-nowrap px-3 py-5 text-right tabular-nums">{priceFormatter.format(product.price)}</td>
                      <td className="px-5 py-4 sm:px-6">
                        <div className="flex justify-end gap-2">
                          <button type="button" className={buttonClass} disabled={busy} onClick={() => handleEdit(product)} aria-label={`Edit ${product.name}`}>Edit</button>
                          <button type="button" className={`${buttonClass} text-[#9c3030] hover:bg-[#fff5f5]`} disabled={busy} onClick={() => handleDelete(product)} aria-label={`Delete ${product.name}`}>{deletingId === product.id ? "กำลังลบ…" : "Delete"}</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default ProductManagement;
