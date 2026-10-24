import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import AdminModal from "../components/AdminModal";
import { createProduct, deleteProduct, getProducts, updateProduct } from "../services/productApi";

const categories = ["Computer", "Audio", "Fashion", "Gadget"];
const emptyForm = { name: "", price: "", category: "Computer", icon: "📦", description: "" };
const priceFormatter = new Intl.NumberFormat("th-TH", { style: "currency", currency: "THB" });

function errorMessage(error) {
  if (error instanceof TypeError) return "เชื่อมต่อ API ไม่สำเร็จ กรุณาตรวจสอบว่าเปิด npm run api ที่พอร์ต 3001 แล้ว";
  return error.message || "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง";
}

export default function ProductManagement() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingProduct, setEditingProduct] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [actionError, setActionError] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const [notice, setNotice] = useState("");
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  // ล็อกทันทีเพื่อกัน request ซ้ำก่อน React render รอบถัดไป
  const mutationRef = useRef(false);
  const busy = loading || saving || deletingId !== null;

  useEffect(() => {
    const controller = new AbortController();
    getProducts({ signal: controller.signal })
      .then((data) => { if (!controller.signal.aborted) setProducts(data); })
      .catch((error) => { if (!controller.signal.aborted) setLoadError(errorMessage(error)); })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, []);

  // อ่าน API ใหม่หลัง CRUD และแยก error การโหลดออกจาก error การบันทึก
  async function loadProducts() {
    setLoading(true);
    setLoadError("");
    try { setProducts(await getProducts()); }
    catch (error) { setLoadError(errorMessage(error)); }
    finally { setLoading(false); }
  }

  function resetModal() {
    setModalOpen(false);
    setEditingProduct(null);
    setForm(emptyForm);
    setFormErrors({});
    setActionError("");
  }

  function closeModal() {
    if (!mutationRef.current) resetModal();
  }

  function openAddModal() {
    resetModal();
    setNotice("");
    setModalOpen(true);
  }

  function handleEdit(product) {
    setEditingProduct(product);
    setForm({
      name: product.name ?? "", price: String(product.price ?? ""),
      category: product.category || "Computer", icon: product.icon ?? "", description: product.description ?? "",
    });
    setFormErrors({});
    setNotice("");
    setActionError("");
    setModalOpen(true);
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setFormErrors((current) => ({ ...current, [name]: "" }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (busy || mutationRef.current) return;
    const name = form.name.trim();
    const price = Number(form.price);
    const errors = {};
    if (!name) errors.name = "กรุณากรอกชื่อสินค้า";
    if (!form.price.trim() || !Number.isFinite(price) || price <= 0) errors.price = "กรุณากรอกราคาที่มากกว่า 0 บาท";
    if (!categories.includes(form.category)) errors.category = "กรุณาเลือกหมวดหมู่สินค้า";
    setFormErrors(errors);
    setActionError("");
    if (Object.keys(errors).length) {
      event.currentTarget.elements.namedItem(Object.keys(errors)[0])?.focus();
      return;
    }

    mutationRef.current = true;
    setSaving(true);
    try {
      const fields = { name, price, category: form.category, icon: form.icon.trim(), description: form.description.trim() };
      if (editingProduct) {
        // PUT แทนทั้งรายการ: เก็บฟิลด์เดิมก่อนทับด้วยค่าที่แก้ และส่ง price เป็น number
        await updateProduct(editingProduct.id, { ...editingProduct, ...fields });
      } else { await createProduct(fields); }
      const message = editingProduct ? `บันทึกการแก้ไข ${name} แล้ว` : `เพิ่ม ${name} แล้ว`;
      resetModal();
      setNotice(message);
      await loadProducts();
    } catch (error) {
      // เก็บ Modal และค่าที่กรอกไว้ให้ลองใหม่ได้เมื่อ API กลับมา
      setActionError(errorMessage(error));
    } finally {
      mutationRef.current = false;
      setSaving(false);
    }
  }

  async function handleDelete(product) {
    if (busy || mutationRef.current || !window.confirm(`ต้องการลบสินค้า "${product.name}" ใช่หรือไม่?`)) return;
    mutationRef.current = true;
    setDeletingId(product.id);
    setActionError("");
    setNotice("");
    try {
      await deleteProduct(product.id);
      setNotice(`ลบ ${product.name} แล้ว`);
      await loadProducts();
    } catch (error) { setActionError(errorMessage(error)); }
    finally { mutationRef.current = false; setDeletingId(null); }
  }

  return (
    <section className="space-y-6" aria-labelledby="management-title">
      <nav className="breadcrumbs text-sm text-base-content/65" aria-label="Breadcrumb">
        <ul><li><Link to="/admin">Admin</Link></li><li aria-current="page">Products</li></ul>
      </nav>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="mb-2 text-[10px] tracking-[2px] text-base-content/60">YOUR CATALOG, IN ONE PLACE</p>
          <h1 id="management-title" className="text-3xl font-semibold tracking-tight sm:text-4xl">Product Management</h1>
          <p className="mt-3 text-sm text-base-content/70">เพิ่มสินค้าใหม่ หรือปรับข้อมูลให้เป็นปัจจุบัน</p>
        </div>
        <button type="button" className="btn btn-primary" onClick={openAddModal} disabled={busy || Boolean(loadError)}><span aria-hidden="true">＋</span> Add Product</button>
      </div>
      {notice && <p role="status" className="alert alert-success alert-soft text-sm">{notice}</p>}
      {actionError && !modalOpen && <p role="alert" className="alert alert-error alert-soft text-sm">{actionError}</p>}
      <div className="card min-w-0 overflow-hidden rounded-shop border border-base-300 bg-base-100" aria-busy={loading}>
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-base-300 p-5">
          <div className="flex items-center gap-3"><h2 className="text-lg font-medium">รายการสินค้า</h2>{!loading && !loadError && <span className="badge badge-ghost">{products.length} รายการ</span>}</div>
          <button type="button" className="btn btn-ghost" disabled={busy} onClick={loadProducts}>โหลดใหม่</button>
        </div>
        {loading ? (
          <div role="status" className="flex items-center justify-center gap-3 p-12 text-sm text-base-content/70"><span className="loading loading-spinner loading-sm" aria-hidden="true" />กำลังโหลดสินค้า…</div>
        ) : loadError ? (
          <div role="alert" className="space-y-4 p-6"><div className="alert alert-error alert-soft"><div><h3 className="font-medium">โหลดสินค้าไม่สำเร็จ</h3><p className="mt-2 text-sm">{loadError}</p></div></div><button type="button" className="btn btn-outline" onClick={loadProducts}>Retry / ลองใหม่</button></div>
        ) : products.length === 0 ? (
          <div className="px-6 py-14 text-center"><p aria-hidden="true" className="text-3xl text-base-content/50">◇</p><h3 className="mt-4 font-medium">ยังไม่มีสินค้า</h3><p className="mt-2 text-sm text-base-content/70">เริ่มเพิ่มสินค้ารายการแรกด้วยปุ่ม Add Product</p><button type="button" className="btn btn-outline mt-5" onClick={openAddModal}>เพิ่มสินค้ารายการแรก</button></div>
        ) : (
          <div className="overflow-x-auto" tabIndex={0} role="region" aria-label="ตารางจัดการสินค้า เลื่อนแนวนอนได้">
            <table className="table table-zebra min-w-[640px]">
              <caption className="sr-only">สินค้าจาก REST API พร้อมปุ่มแก้ไขและลบ</caption>
              <thead className="text-base-content/65"><tr><th scope="col">สินค้า</th><th scope="col">หมวดหมู่</th><th scope="col" className="text-right">ราคา (บาท)</th><th scope="col" className="text-right">จัดการ</th></tr></thead>
              <tbody>{products.map((product) => (
                <tr key={product.id}>
                  <th scope="row" className="max-w-[260px] font-medium"><div className="flex items-center gap-3"><span className="grid size-10 shrink-0 place-items-center overflow-hidden rounded-shop bg-base-200" aria-hidden="true">{product.icon || "◇"}</span><div className="min-w-0"><span className="block wrap-anywhere">{product.name}</span><span className="mt-1 block text-xs font-normal text-base-content/60">ID: {product.id}</span></div></div></th>
                  <td><span className="badge badge-outline whitespace-nowrap">{product.category || "ไม่ระบุ"}</span></td>
                  <td className="text-right whitespace-nowrap tabular-nums">{priceFormatter.format(product.price)}</td>
                  <td><div className="flex justify-end gap-2"><button type="button" className="btn btn-sm btn-outline" disabled={busy} onClick={() => handleEdit(product)} aria-label={`Edit ${product.name}`}>Edit</button><button type="button" className="btn btn-sm btn-error btn-soft" disabled={busy} onClick={() => handleDelete(product)} aria-label={`Delete ${product.name}`}>{deletingId === product.id ? "กำลังลบ…" : "Delete"}</button></div></td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        )}
      </div>
      {modalOpen && (
        <AdminModal title={editingProduct ? "Edit Product" : "Add Product"} busy={saving} onClose={closeModal}>
          <p className="mb-5 text-sm text-base-content/70">กรอกข้อมูลสินค้า ช่องที่มี * จำเป็นต้องระบุ</p>
          {actionError && <p role="alert" className="alert alert-error alert-soft mb-5 text-sm">{actionError}</p>}
          <form onSubmit={handleSubmit} noValidate aria-label={editingProduct ? "แก้ไขสินค้า" : "เพิ่มสินค้า"} aria-busy={saving}>
            <fieldset disabled={saving} className="space-y-5">
              <div>
                <label htmlFor="product-name" className="mb-2 block text-sm font-medium">ชื่อสินค้า / Name *</label>
                <input autoFocus id="product-name" name="name" className="input input-bordered" value={form.name} onChange={handleChange} placeholder="เช่น Wireless Mouse" required aria-invalid={Boolean(formErrors.name)} aria-describedby={formErrors.name ? "name-error" : undefined} />
                {formErrors.name && <p id="name-error" role="alert" className="mt-2 text-sm text-error">{formErrors.name}</p>}
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="product-price" className="mb-2 block text-sm font-medium">ราคา / Price (บาท) *</label>
                  <input id="product-price" name="price" type="number" min="0.01" step="any" className="input input-bordered" value={form.price} onChange={handleChange} placeholder="0.00" required aria-invalid={Boolean(formErrors.price)} aria-describedby={formErrors.price ? "price-error" : undefined} />
                  {formErrors.price && <p id="price-error" role="alert" className="mt-2 text-sm text-error">{formErrors.price}</p>}
                </div>
                <div>
                  <label htmlFor="product-category" className="mb-2 block text-sm font-medium">หมวดหมู่ / Category *</label>
                  <select id="product-category" name="category" className="select select-bordered" value={form.category} onChange={handleChange} required aria-invalid={Boolean(formErrors.category)} aria-describedby={formErrors.category ? "category-error" : undefined}>{categories.map((category) => <option key={category}>{category}</option>)}</select>
                  {formErrors.category && <p id="category-error" role="alert" className="mt-2 text-sm text-error">{formErrors.category}</p>}
                </div>
              </div>
              <div>
                <label htmlFor="product-icon" className="mb-2 block text-sm font-medium">ไอคอน / Icon <span className="font-normal text-base-content/60">(ไม่บังคับ)</span></label>
                <input id="product-icon" name="icon" className="input input-bordered" value={form.icon} onChange={handleChange} placeholder="เช่น 🖱️" aria-describedby="icon-hint" />
                <p id="icon-hint" className="mt-2 text-xs text-base-content/60">ใช้อีโมจิหรือข้อความสั้น ๆ แทนสินค้า</p>
              </div>
              <div>
                <label htmlFor="product-description" className="mb-2 block text-sm font-medium">รายละเอียด / Description <span className="font-normal text-base-content/60">(ไม่บังคับ)</span></label>
                <textarea id="product-description" name="description" className="textarea textarea-bordered min-h-24" rows={3} value={form.description} onChange={handleChange} placeholder="รายละเอียดเพิ่มเติมของสินค้า" />
              </div>
              <div className="modal-action flex-wrap border-t border-base-300 pt-5">
                <button type="button" className="btn btn-outline" onClick={closeModal}>Cancel</button>
                <button type="submit" className="btn btn-primary">{saving ? <><span className="loading loading-spinner loading-sm" aria-hidden="true" />กำลังบันทึก…</> : editingProduct ? "Save Changes" : "Add Product"}</button>
              </div>
            </fieldset>
          </form>
        </AdminModal>
      )}
    </section>
  );
}
