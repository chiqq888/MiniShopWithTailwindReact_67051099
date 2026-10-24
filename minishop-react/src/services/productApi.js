const API_URL = "http://localhost:3001/products";

async function readResponse(response, readBody = true) {
  // fetch ไม่โยน Error เมื่อได้ 404/500 จึงต้องตรวจ response.ok เอง
  if (!response.ok) {
    throw new Error(
      `เรียก API ไม่สำเร็จ (HTTP ${response.status}${response.statusText ? ` ${response.statusText}` : ""})`,
    );
  }

  // DELETE อาจสำเร็จโดยไม่ส่งข้อมูลกลับมา เช่น HTTP 204
  if (response.status === 204 || !readBody) return null;

  return response.json();
}

// GET อ่านรายการสินค้า โดยยกเลิกคำขอได้ผ่าน AbortSignal
export async function getProducts(options = {}) {
  const response = await fetch(API_URL, { signal: options.signal });
  return readResponse(response);
}

// POST ส่งสินค้าใหม่เป็น JSON ให้เซิร์ฟเวอร์สร้าง id
export async function createProduct(product) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(product),
  });
  return readResponse(response);
}

// PUT ส่งข้อมูลสินค้าทั้งรายการไปแทนข้อมูลของ id ที่เลือก
export async function updateProduct(id, product) {
  const response = await fetch(`${API_URL}/${encodeURIComponent(id)}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(product),
  });
  return readResponse(response);
}

// DELETE ลบสินค้าตาม id
export async function deleteProduct(id) {
  const response = await fetch(`${API_URL}/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
  return readResponse(response, false);
}
