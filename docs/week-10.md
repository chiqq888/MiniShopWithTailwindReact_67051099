# Week 10: RESTful API Integration

เอกสารนี้อธิบายโค้ดและผลทดสอบของ branch `week-10` ในสัปดาห์นั้น โค้ดล่าสุดบน `main` ใช้ Week 11 ซึ่งย้ายทางเข้า Admin ไปที่ Profile → Switch to Admin และใช้ Modal สำหรับฟอร์ม ดูภาพรวมและวิธีรันปัจจุบันที่ [README หลัก](../README.md)

งานนี้ต่อยอด MiniShop ด้วยหน้าจัดการสินค้าที่ `/admin/products` ซึ่งเพิ่ม อ่าน แก้ไข และลบข้อมูลผ่าน REST API ได้ เปิดจากเมนู `Manage Products` บน Navbar

## 1. ภาพรวมการทำงาน

```text
ProductManagement.jsx
  → เรียกฟังก์ชันใน services/productApi.js
  → fetch ส่ง HTTP Request ไป http://localhost:3001/products
  → JSON Server อ่านหรือแก้ db.json
  → ส่ง HTTP Response กลับมาเป็น JSON
  → React อัปเดต State และแสดงผลใหม่
```

ไฟล์หลักอยู่ในโฟลเดอร์ `minishop-react`:

| ไฟล์ | ทำหน้าที่อะไร |
| --- | --- |
| `db.json` | เก็บข้อมูลสินค้าของ Mock API |
| `package.json` | มีคำสั่ง `npm run api` และ dependency ของ JSON Server |
| `src/services/productApi.js` | รวมการเรียก API และตรวจ HTTP Error |
| `src/pages/ProductManagement.jsx` | แสดงฟอร์มและตาราง จัดการ State และ Event |
| `src/App.jsx` | เพิ่ม Route `/admin/products` ภายใต้ Layout เดิม |
| `src/components/Navbar.jsx` | เพิ่มเมนู `Manage Products` |
| `vite.config.js` | ให้ Vite ข้ามการเฝ้าดู `db.json` เพื่อไม่รีโหลดทั้งหน้าเมื่อ API บันทึกข้อมูล |

หน้าร้าน Home, Products, Product Detail และตะกร้าจาก Week 9 ยังอ่าน `src/models/productModel.js` ตามเดิม ใบงานให้หน้าใหม่ใช้ API Service โดยไม่แก้ Model เดิม สินค้าที่เพิ่มในหน้าจัดการจึงยังไม่ปรากฏในหน้าร้าน

## 2. วิธีรันสอง Server

เปิด Terminal ที่โฟลเดอร์หลักของ repository แล้วติดตั้ง dependency:

```bash
cd minishop-react
npm install
```

Terminal 1 รัน API:

```bash
npm run api
```

คำสั่งนี้เรียก `json-server --watch db.json --port 3001` จากนั้นเปิด [รายการสินค้าแบบ JSON](http://localhost:3001/products) เพื่อตรวจว่า API พร้อมทำงาน

Terminal 2 เปิดใหม่และเข้าโฟลเดอร์ `minishop-react` แล้วรัน React:

```bash
cd minishop-react
npm run dev
```

เปิด [Product Management](http://localhost:5173/admin/products) หาก Vite เลือกพอร์ตอื่น ให้ใช้พอร์ตที่ Terminal แสดง

โปรเจกต์เลือกใช้ JSON Server `0.17.4` แบบตรึงเวอร์ชัน เพื่อให้คำสั่ง `--watch` และพฤติกรรมของ Mock API คงที่ตาม [เอกสาร JSON Server v0.17.4](https://github.com/typicode/json-server/tree/v0.17.4) PDF ที่ได้รับมีข้อความว่าจะกำหนดเวอร์ชัน แต่ไม่มีตัวอย่างคำสั่งหรือเลขเวอร์ชันปรากฏอยู่ จึงเลือกเวอร์ชันนี้สำหรับโปรเจกต์

ข้อมูลเริ่มต้นที่ใช้:

```json
{
  "products": [
    { "id": 1, "name": "Laptop", "price": 25000 },
    { "id": 2, "name": "Keyboard", "price": 1500 },
    { "id": 3, "name": "Monitor", "price": 6500 }
  ]
}
```

ใบงานระบุว่า `/products/1` ต้องคืน Laptop ส่วนชื่อและราคาของ seed ที่เหลือเป็นข้อมูลตัวอย่างที่โปรเจกต์กำหนด

JSON ต้องใช้ double quotes ไม่มี comment และไม่มี comma หลังรายการสุดท้าย การเรียก POST, PUT หรือ DELETE เปลี่ยนไฟล์ `db.json` จริง แม้ปิดแล้วเปิด Server ใหม่ ข้อมูลที่บันทึกจะยังอยู่ ควรสำรองไฟล์ก่อนทดลองลบหรือแก้ข้อมูลเริ่มต้น หากใช้ PowerShell สามารถสำรองจากโฟลเดอร์ `minishop-react` ได้ด้วย:

```powershell
Copy-Item -LiteralPath db.json -Destination db.backup.json
```

## 3. HTTP Method และ URL

| Method | URL ตัวอย่าง | ความหมาย | ฟังก์ชันใน Service |
| --- | --- | --- | --- |
| GET | `/products` | อ่านสินค้าทั้งหมด | `getProducts()` |
| GET | `/products/1` | อ่านสินค้าที่มี ID 1 เพียงรายการเดียว | ทดลองเปิดผ่าน Browser |
| POST | `/products` | เพิ่มสินค้าใหม่ ให้ Server สร้าง ID | `createProduct(product)` |
| PUT | `/products/4` | ส่งข้อมูลสินค้าทั้งรายการเพื่อแทนที่รายการ ID 4 | `updateProduct(id, product)` |
| DELETE | `/products/4` | ลบสินค้าที่มี ID 4 | `deleteProduct(id)` |

`GET /products` คืน array ของสินค้าทั้งหมด ส่วน `GET /products/1` คืน object เดียว ID เป็นตัวระบุรายการ ทำให้แก้ไขหรือลบสินค้าได้แน่นอน แม้ชื่อสินค้าจะซ้ำกัน ข้อมูลที่ API ส่งกลับเป็น JSON โดย Browser อาจจัดรูปแบบให้อ่านง่าย ไม่ใช่หน้า HTML ของ React

`PUT` ใช้แทนข้อมูลทั้งรายการ ส่วน `PATCH` ใช้แก้บาง field เช่นส่งเฉพาะ `{ "price": 490 }` งานนี้ใช้ PUT ตามใบงาน โดยตอนแก้ไขส่ง `{ ...editingProduct, name, price }` เพื่อคง ID และ field เดิมทั้งหมดไว้พร้อมข้อมูลที่แก้

## 4. ทำไมต้องแยก API Service

`src/services/productApi.js` รวม URL, HTTP Method, headers, การแปลง JSON และการตรวจ response ไว้ที่เดียว หน้า React จึงเรียกเพียง `getProducts()` หรือ `createProduct()` และเน้นการแสดงผลกับการจัดการฟอร์ม หากเปลี่ยน URL ของ API ในภายหลัง ก็แก้ที่ Service ได้

ขั้นตอนสำคัญของ `fetch()`:

1. `await fetch(...)` ส่ง Request และรอ Response จาก Server
2. ตรวจ `response.ok` ว่า HTTP status อยู่ในช่วงสำเร็จหรือไม่ ถ้าไม่สำเร็จให้ `throw new Error(...)`
3. ใช้ `response.json()` อ่าน JSON จาก Response กลับมาเป็นค่า JavaScript

เมื่อส่ง POST หรือ PUT จะมี `Content-Type: application/json` และ `JSON.stringify(product)` เพื่อแปลง JavaScript object ให้เป็น JSON string ใน request body ส่วน DELETE ไม่จำเป็นต้องส่ง body และ Service รองรับ response ที่ไม่มี body เช่น HTTP 204

`fetch()` โยน error เมื่อการเชื่อมต่อล้มเหลว แต่ไม่ได้โยน error อัตโนมัติเมื่อ Server ตอบ 404 หรือ 500 จึงต้องตรวจ `response.ok` เองและส่ง error ให้หน้าแสดงข้อความ

| เรื่อง | fetch | Axios |
| --- | --- | --- |
| การติดตั้ง | มีใน Browser | ต้องติดตั้งเพิ่ม |
| อ่าน JSON | เรียก `response.json()` | โดยทั่วไปอ่านจาก `response.data` |
| HTTP status ไม่สำเร็จ | ต้องตรวจ `response.ok` | ปฏิเสธ Promise โดยปริยาย |

ใบงานนี้ใช้ fetch เพื่อฝึกอ่าน HTTP Request และ Response โดยตรง

## 5. React State และ useEffect

State คือข้อมูลที่ React ใช้สร้างหน้าจอ เมื่อเรียก setter เช่น `setProducts(data)` React จะ render ใหม่ด้วยข้อมูลล่าสุด

| State | หน้าที่ |
| --- | --- |
| `products` | รายการสินค้าที่ได้จาก API |
| `form` | ชื่อและราคาที่กรอกอยู่ในฟอร์ม |
| `editingProduct` | สินค้าที่เลือกแก้ หรือ `null` เมื่อกำลังเพิ่ม |
| `loading`, `loadError` | สถานะและข้อผิดพลาดตอนอ่านรายการสินค้า |
| `saving`, `deletingId` | สถานะตอนบันทึกหรือลบ เพื่อป้องกันการกดซ้ำ |
| `formErrors`, `actionError`, `notice` | ข้อความ validation, ข้อผิดพลาด และแจ้งผลสำเร็จ |

`useEffect(..., [])` เริ่มอ่านรายการเมื่อเข้าหน้าครั้งแรก ใช้ `AbortController` ยกเลิก request เมื่อออกจากหน้า เพื่อไม่อัปเดตหน้าที่เลิกใช้งานแล้ว

การทำงานของปุ่มต่าง ๆ:

1. กรอกข้อมูลแล้วกด `Add Product` จะเรียก `handleSubmit()` และป้องกัน form reload ด้วย `event.preventDefault()`
2. ตัดช่องว่างหัวท้ายชื่อด้วย `trim()` และแปลงราคาเป็นตัวเลข ถ้าชื่อว่าง ราคาว่าง ไม่ใช่ตัวเลข หรือราคาไม่มากกว่า 0 จะแสดงข้อความและไม่เรียก API
3. ถ้า `editingProduct` เป็น `null` ให้ POST สินค้าใหม่ ถ้ามีสินค้าที่เลือกอยู่ให้ PUT ตาม ID นั้น
4. ปุ่ม `Edit` นำข้อมูลสินค้ามาใส่ฟอร์ม เปลี่ยนปุ่มบันทึกเป็น `Save Changes` และมีปุ่มยกเลิกการแก้ไข
5. ปุ่ม `Delete` เรียก `window.confirm()` ก่อน ถ้ากดยกเลิกจะไม่ลบ ถ้ายืนยันจึงส่ง DELETE
6. หลังเพิ่ม แก้ไข หรือลบสำเร็จ `loadProducts()` จะ GET รายการใหม่ เพื่อให้ตารางตรงกับข้อมูลที่ Server บันทึก

Loading แสดงระหว่างรอข้อมูล Error แสดงเมื่ออ่านข้อมูลไม่สำเร็จพร้อมปุ่มลองใหม่ และ Empty State แสดงเมื่ออ่านสำเร็จแต่ได้ array ว่าง ทั้งสามสถานะทำให้ผู้ใช้เข้าใจว่ากำลังรอ เกิดปัญหา หรือยังไม่มีสินค้า

## 6. ตัวอย่าง Request/Response

ตัวอย่างด้านล่างตรงกับ Request/Response ที่บันทึกจากการทดสอบจริง โดยเริ่มจาก seed 3 รายการ ดูข้อมูลที่จับได้ใน [test-results.json](week-10/test-results.json) ครั้งนี้ Server สร้าง ID 4 ให้ Mouse; ID อาจต่างออกไปหากมีการเพิ่มข้อมูลก่อนแล้ว

### เพิ่ม Mouse ราคา 450 บาท

เมื่อกด `Add Product` หน้า React เรียก `createProduct({ name: "Mouse", price: 450 })` และส่ง Request:

```http
POST /products HTTP/1.1
Host: localhost:3001
Content-Type: application/json

{
  "name": "Mouse",
  "price": 450
}
```

Response ที่ได้:

```http
HTTP/1.1 201 Created
Content-Type: application/json; charset=utf-8

{
  "name": "Mouse",
  "price": 450,
  "id": 4
}
```

Request ระบุว่าต้องการสร้างสินค้าใหม่พร้อมชื่อและราคา ส่วน Response ยืนยันการสร้างด้วย status `201 Created` และคืนสินค้าที่มี ID ที่ Server สร้างให้ จากนั้นหน้าเรียก GET อีกครั้งและแสดง Mouse ในตาราง

### แก้ Mouse เป็น 490 บาท

Mouse ได้ ID 4 จากการเพิ่มก่อนหน้า เมื่อกด `Edit` แก้ราคา แล้วกด `Save Changes` จะส่งข้อมูลทั้งรายการ:

```http
PUT /products/4 HTTP/1.1
Host: localhost:3001
Content-Type: application/json

{
  "name": "Mouse",
  "price": 490,
  "id": 4
}
```

Response ที่ได้:

```http
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8

{
  "name": "Mouse",
  "price": 490,
  "id": 4
}
```

Server ตอบ `200 OK` และคืนข้อมูลล่าสุด ส่วน React โหลดรายการใหม่เพื่อแสดงราคา 490 บาท

## 7. ขั้นตอนทดสอบและหลักฐานสำหรับส่ง

ทดสอบวันที่ 24 ตุลาคม 2026 ด้วย Chrome และ JSON Server บนเครื่อง ผ่านการตรวจ 15 กรณี พร้อม `npm run lint` และ `npm run build` ดูรายการตรวจและ HTTP status จริงใน [test-results.json](week-10/test-results.json) ภาพหลักฐานอยู่ในโฟลเดอร์ `docs/week-10`

| กรณี | ขั้นตอน | ผลที่ตรวจพบ | ภาพหลักฐาน |
| --- | --- | --- | --- |
| Create | กรอก Mouse ราคา 450 แล้วกด Add Product | ผ่าน: POST ตอบ 201, ได้ ID 4 และ Mouse ปรากฏในตาราง | [01-create.png](week-10/01-create.png) |
| Read | เปิด `http://localhost:3001/products` | ผ่าน: GET ตอบ 200, JSON และ db.json มี Mouse; รีเฟรชหน้ายังอยู่ | [02-read.png](week-10/02-read.png) |
| Update | Edit Mouse เปลี่ยนราคาเป็น 490 แล้ว Save Changes | ผ่าน: PUT ตอบ 200, ตารางและ API แสดงราคา 490 | [03-update.png](week-10/03-update.png) |
| Delete | กด Delete ของ Mouse และยืนยัน | ผ่าน: DELETE ตอบ 200, Mouse หายจากตาราง/JSON/db.json และ GET ID 4 ตอบ 404 | [04-delete.png](week-10/04-delete.png) |
| Validation | ลองชื่อที่มีแต่ช่องว่าง และราคา 0 แยกกรณี | ผ่าน: แสดงข้อความ ไม่มี POST/PUT/DELETE ถูกส่ง และข้อมูลเดิมไม่เปลี่ยน | [05-validation.png](week-10/05-validation.png) |
| Loading | หน่วง GET จริงไว้ชั่วคราวผ่านเครื่องมือทดสอบ | ผ่าน: แสดงกำลังโหลดและปิดปุ่มฟอร์มก่อนแสดงรายการ | [06-loading.png](week-10/06-loading.png) |
| Error | จำลองการเชื่อมต่อล้มเหลวใน Browser จากนั้นคืนการเชื่อมต่อและกดลองใหม่ | ผ่าน: แสดงข้อผิดพลาดและลองใหม่กลับมาอ่าน API จริงได้ | [07-error.png](week-10/07-error.png) |
| Empty | จำลอง GET ที่ตอบ array ว่าง โดยไม่ลบ seed จริง | ผ่าน: แสดงยังไม่มีสินค้า และโหลดใหม่กลับมาแสดงข้อมูลจริงได้ | [08-empty.png](week-10/08-empty.png) |
| Mobile | เปิดหน้าจัดการที่ความกว้าง 390px | ผ่าน: หน้าไม่ล้นจอ ตารางเลื่อนแนวนอนในกรอบได้ | [09-mobile.png](week-10/09-mobile.png) |

ตรวจผ่านเพิ่มเติม: ยกเลิกแก้ไขหรือยกเลิกยืนยันลบแล้วข้อมูลยังเหมือนเดิม; จำลอง HTTP 500 แล้วแสดง Error; จำลอง POST/PUT ล้มเหลวแล้วข้อมูลที่กรอกยังอยู่; จำลอง DELETE ล้มเหลวแล้วรายการไม่หาย; หน้าร้านและตะกร้า Week 9 ยังทำงาน ไม่มี JavaScript exception ใน Browser หลังทดสอบคืน db.json เป็น seed เดิม 3 รายการ

พบและแก้ปัญหาระหว่างทดสอบ: เมื่อ JSON Server เขียน db.json เดิม Vite จะรีโหลดทั้งหน้า ทำให้ State และข้อความแจ้งผลหาย จึงตั้ง `server.watch.ignored` ให้ข้าม `**/db.json` ใน vite.config.js ตอนนี้ API จัดการไฟล์ฐานข้อมูล ส่วน React ใช้ loadProducts() อ่านรายการล่าสุดโดยไม่รีโหลดทั้งหน้า

## 8. สิ่งที่ส่ง

- [Source Code ของ Week 10](https://github.com/chiqq888/MiniShopWithTailwindReact_67051099/tree/week-10) สำหรับดูโค้ดในสัปดาห์นั้น
- [db.json](../minishop-react/db.json)
- ภาพ CRUD ทั้ง 4 Operation ตามลิงก์ในตาราง พร้อมภาพ validation และสถานะต่าง ๆ ที่ใช้ประกอบการตรวจ
- คำอธิบาย Request/Response อย่างน้อย 1 กรณี ใช้ตัวอย่างในหัวข้อ 6 ประกอบกับผลทดสอบจริง
- อธิบายได้ว่า GET อ่าน, POST เพิ่ม, PUT แทนข้อมูลรายการเดิม และ DELETE ลบ
