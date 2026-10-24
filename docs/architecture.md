# โครงสร้างและการทำงานของ MiniShop

เอกสารนี้อ้างอิงโครงสร้างจาก branch `week-10` ก่อนเพิ่ม AdminLayout, Dashboard และ Modal ใน Week 11 ดูโครงสร้างล่าสุดใน [รายละเอียด Week 11](week-11.md) และภาพรวมใน [README หลัก](../README.md)

MiniShop เป็นเว็บร้านค้าตัวอย่างที่ใช้ React, React Router และ Tailwind CSS มีหน้าดูสินค้า ค้นหา กรองหมวดหมู่ เรียงราคา รายละเอียดสินค้า ตะกร้า โปรไฟล์ และหน้าจัดการสินค้าผ่าน REST API

## โครงสร้าง Frontend

ไฟล์แอปพลิเคชันอยู่ในโฟลเดอร์ `minishop-react`:

| ไฟล์หรือโฟลเดอร์ | หน้าที่ |
| --- | --- |
| `src/main.jsx` | สร้าง React root และครอบแอปด้วย `BrowserRouter` |
| `src/App.jsx` | กำหนดเส้นทางและเก็บ State ร่วมของตะกร้า โปรไฟล์ และข้อความแจ้งผล |
| `src/components/Layout.jsx` | จัด Navbar, พื้นที่เนื้อหา `Outlet` และ Footer ให้ทุกหน้า |
| `src/components/ProductCatalog.jsx` | ค้นหาจากชื่อ กรองหมวดหมู่ และเรียงราคาสินค้า |
| `src/components/Cart.jsx` | แสดงรายการ จำนวน และยอดรวมในตะกร้า |
| `src/pages/` | หน้าจอที่จับคู่กับแต่ละเส้นทาง |
| `src/models/productModel.js` | ข้อมูลตัวอย่างและฟังก์ชันอ่านสินค้าสำหรับหน้าร้าน |
| `src/services/productApi.js` | ส่งคำขอ HTTP สำหรับหน้าจัดการสินค้า |
| `db.json` | เก็บข้อมูลสินค้าของ JSON Server |

`App.jsx` วางเส้นทางไว้ภายใน `Layout` เมื่อเปลี่ยน URL React Router จะแสดงหน้าที่ตรงกันใน `Outlet` โดยใช้ Navbar และ Footer ร่วมกัน

| เส้นทาง | หน้าที่ |
| --- | --- |
| `/` | หน้าแรกและรายการสินค้า |
| `/products` | หน้ารวมสินค้าพร้อมค้นหาและตัวกรอง |
| `/products/:id` | รายละเอียดสินค้าตาม ID |
| `/admin/products` | เพิ่ม อ่าน แก้ไข และลบสินค้าผ่าน API |
| `/profile` | แสดงและแก้ไขข้อมูลโปรไฟล์ |
| `/about` | ข้อมูลเกี่ยวกับ MiniShop |
| เส้นทางอื่น | แสดงหน้าไม่พบข้อมูล |

ตะกร้าอยู่ใน State ของ `App` จึงใช้ร่วมกันระหว่างหน้าได้ ปุ่มเพิ่มสินค้าจะเพิ่มจำนวนของรายการเดิมหากมี ID ตรงกัน ปุ่มลดจำนวนจะนำรายการออกเมื่อจำนวนเหลือศูนย์ และ `Cart` คำนวณยอดรวมจากราคา × จำนวนของแต่ละรายการ ข้อมูลตะกร้าและโปรไฟล์เก็บในหน่วยความจำของหน้าเว็บ การรีเฟรชจะคืนค่าเริ่มต้น

## แหล่งข้อมูลสินค้า

โปรเจกต์มีข้อมูลสินค้าสองชุดที่ทำงานแยกกัน:

| ส่วนของแอป | แหล่งข้อมูล | รูปแบบข้อมูล |
| --- | --- | --- |
| หน้าแรก รายการสินค้า รายละเอียด และตะกร้า | `src/models/productModel.js` | `id`, `title`, `price`, `description`, `category`, `image`, `rating` |
| หน้าจัดการสินค้า | `http://localhost:3001/products` ผ่าน JSON Server | `id`, `name`, `price` |

หน้าร้านอ่านข้อมูลด้วย `getProducts()` และ `getProductById(id)` จาก Model ส่วนหน้าจัดการอ่านและบันทึกผ่าน API Service การแก้ข้อมูลในหน้าจัดการจึงมีผลกับ `db.json` และตารางจัดการสินค้า โดยยังไม่มีการซิงก์เข้าข้อมูลของหน้าร้าน

JSON Server อ่าน resource จากชื่อ property ใน `db.json` เช่น:

```json
{
  "products": [
    { "id": 1, "name": "Laptop", "price": 25000 }
  ]
}
```

คำสั่ง `npm run api` เปิด API ที่พอร์ต `3001` ส่วน `npm run dev` เปิด Frontend ผ่าน Vite รายการที่เพิ่ม แก้ไข หรือลบผ่าน API จะถูกบันทึกลง `db.json` และคงอยู่หลังเปิด JSON Server ใหม่

## API Service และ HTTP Method

`src/services/productApi.js` รวม URL, Method, Headers, Request Body และการอ่าน Response ไว้ที่เดียว หน้า `ProductManagement.jsx` จึงเรียกฟังก์ชันตามงานที่ต้องการได้โดยไม่ต้องเขียน `fetch()` ซ้ำ

| ฟังก์ชัน | Method และเส้นทาง | การทำงาน |
| --- | --- | --- |
| `getProducts(options)` | `GET /products` | อ่านสินค้าทั้งหมด รองรับ `AbortSignal` |
| `createProduct(product)` | `POST /products` | เพิ่มสินค้าและให้ Server สร้าง ID |
| `updateProduct(id, product)` | `PUT /products/:id` | แทนข้อมูลสินค้าทั้งรายการตาม ID |
| `deleteProduct(id)` | `DELETE /products/:id` | ลบสินค้าตาม ID |

`POST` และ `PUT` ตั้ง Header `Content-Type: application/json` และใช้ `JSON.stringify()` แปลง object เป็น Request Body เมื่อได้รับ Response จะตรวจ `response.ok` ก่อนอ่าน JSON เพราะ `fetch()` ไม่โยน Error อัตโนมัติเมื่อ Server ตอบ HTTP 404 หรือ 500 ถ้าสถานะไม่สำเร็จ Service จะโยน Error พร้อม HTTP status ให้หน้าแสดงข้อความ ส่วน `DELETE` ไม่ต้องอ่าน Response Body จึงรองรับการตอบสำเร็จแบบไม่มีข้อมูล เช่น HTTP 204

### ตัวอย่างการเพิ่ม อ่าน แก้ไข และลบ

ตัวอย่างนี้ใช้สินค้า Mouse และสมมติว่า Server สร้าง ID `4` ให้ ค่า ID จริงขึ้นอยู่กับข้อมูลใน API

เพิ่มสินค้า:

```http
POST /products HTTP/1.1
Host: localhost:3001
Content-Type: application/json

{ "name": "Mouse", "price": 450 }
```

Response ตัวอย่าง:

```http
HTTP/1.1 201 Created
Content-Type: application/json

{ "name": "Mouse", "price": 450, "id": 4 }
```

อ่านรายการด้วย `GET /products` จะได้ HTTP `200 OK` พร้อม array ของสินค้า เช่น:

```json
[
  { "id": 1, "name": "Laptop", "price": 25000 },
  { "id": 4, "name": "Mouse", "price": 450 }
]
```

แก้ไขด้วย `PUT /products/4` โดยส่งข้อมูลทั้งรายการ:

```json
{ "id": 4, "name": "Mouse", "price": 490 }
```

เมื่อสำเร็จ Server ตอบ HTTP `200 OK` พร้อม object ที่แก้ไขแล้ว หน้าเว็บส่ง `{ ...editingProduct, name, price }` เพื่อคง ID และ field เดิมของรายการไว้ในคำขอ PUT

ลบด้วย `DELETE /products/4` โดยไม่ส่ง Body เมื่อสำเร็จ JSON Server ตอบ HTTP `200 OK` และรายการ ID `4` จะไม่อยู่ในผลของ `GET /products` อีก

## State และการทำงานของหน้าจัดการสินค้า

`ProductManagement.jsx` เก็บข้อมูลหน้าจอด้วย `useState()` เมื่อเรียก setter React จะ render หน้าจอใหม่ตามค่าล่าสุด

| State | หน้าที่ |
| --- | --- |
| `products` | รายการสินค้าที่อ่านจาก API |
| `form` | ชื่อและราคาที่ผู้ใช้กำลังกรอก |
| `editingProduct` | รายการที่เลือกแก้ไข หรือ `null` สำหรับการเพิ่มสินค้า |
| `loading`, `loadError` | สถานะและข้อผิดพลาดของการอ่านรายการ |
| `saving`, `deletingId` | สถานะระหว่างบันทึกหรือลบ |
| `formErrors` | ข้อความตรวจข้อมูลแต่ละช่อง |
| `actionError`, `notice` | ข้อผิดพลาดของการบันทึกหรือลบ และข้อความแจ้งผลสำเร็จ |

เมื่อเปิดหน้า `useEffect(..., [])` จะเรียก `getProducts()` และใช้ `AbortController` ยกเลิกคำขอหากออกจากหน้าก่อนโหลดเสร็จ หลังเพิ่ม แก้ไข หรือลบสำเร็จ `loadProducts()` จะอ่านรายการจาก API ใหม่เพื่อให้ตารางแสดงข้อมูลที่ Server บันทึก

ฟอร์มใช้ร่วมกันสำหรับเพิ่มและแก้ไขสินค้า การกด `Edit` จะนำข้อมูลลงฟอร์มและกำหนด `editingProduct` จากนั้นปุ่ม `Save Changes` จะเรียก PUT ตาม ID ส่วนปุ่ม `Add Product` เรียก POST เมื่อยังไม่ได้เลือกรายการแก้ไข การยกเลิกแก้ไขจะล้างฟอร์มและกลับสู่โหมดเพิ่มสินค้า การกด `Delete` จะแสดง `window.confirm()` ก่อนส่งคำขอลบ

ก่อนบันทึก หน้าเว็บตัดช่องว่างหัวท้ายชื่อด้วย `trim()` และแปลงราคาเป็นตัวเลข ชื่อต้องไม่ว่าง ส่วนราคาต้องกรอกเป็นตัวเลขที่มีค่าจำกัดและมากกว่า 0 หากข้อมูลไม่ผ่าน จะแสดงข้อความใต้ช่องและไม่ส่งคำขอ API หากคำขอบันทึกล้มเหลว ข้อมูลที่กรอกจะยังอยู่เพื่อให้แก้ไขหรือลองใหม่ได้

ระหว่างอ่าน บันทึก หรือลบ จะปิดปุ่มที่เกี่ยวข้องเพื่อป้องกันการกดซ้ำ หน้ารายการแยกการแสดงผลเป็นกำลังโหลด โหลดไม่สำเร็จพร้อมปุ่มลองใหม่ รายการว่าง และตารางสินค้า ทำให้แยกได้ว่ากำลังรอข้อมูลหรือยังไม่มีรายการ

## การตั้งค่า Vite

`vite.config.js` กำหนด `server.watch.ignored` เป็น `['**/db.json']` เพื่อให้การเขียนข้อมูลของ JSON Server ไม่กระตุ้นให้ Vite รีโหลดทั้งหน้า การแสดงรายการล่าสุดจึงเกิดจาก `loadProducts()` และการอัปเดต React State โดยข้อมูลที่กำลังกรอกและข้อความแจ้งผลยังอยู่บนหน้าจอ
