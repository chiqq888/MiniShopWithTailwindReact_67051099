# MiniShop React Lab Week 10

เว็บไซต์ร้านค้าตัวอย่างที่ต่อยอดจาก Week 9 ด้วยหน้าจัดการสินค้าผ่าน REST API โดยใช้ React, React Router v6, Tailwind CSS และ JSON Server สำหรับเพิ่ม อ่าน แก้ไข และลบข้อมูลสินค้า (CRUD)

อ่าน [คำอธิบาย Week 10 พร้อมตัวอย่าง Request/Response และขั้นตอนทดสอบ](docs/week-10.md) สำหรับอธิบายโค้ดและเตรียมส่งงาน

## ฟีเจอร์

- เปิด `Manage Products` ที่ `/admin/products` เพื่อจัดการสินค้าผ่าน REST API
- เพิ่มสินค้า แก้ไขด้วย `PUT` และยืนยันก่อนลบ พร้อมโหลดรายการล่าสุดจาก API หลังบันทึก
- ตรวจชื่อสินค้าที่ห้ามว่างและราคาที่ต้องมากกว่า 0 ก่อนส่งข้อมูล
- แสดง Loading, Error พร้อมปุ่มลองใหม่ และ Empty State เมื่อ API ไม่มีสินค้า
- เก็บข้อมูลหน้าจัดการสินค้าใน `minishop-react/db.json` ผ่าน JSON Server
- แสดงสินค้า รูปภาพ ชื่อ ราคา หมวดหมู่ และคะแนนรีวิวจาก Fake Store API
- ค้นหาสินค้าจากชื่อ โดยไม่แยกตัวพิมพ์เล็กและตัวพิมพ์ใหญ่
- กรองสินค้าตามหมวดหมู่เดิมที่บันทึกจาก API และเลือก `All` เพื่อแสดงทุกหมวดหมู่
- เรียงราคาจากน้อยไปมากหรือมากไปน้อยผ่าน dropdown
- เปิด `View Detail` เพื่อดูชื่อ ราคา รายละเอียด และ Rating ของสินค้า
- เพิ่มสินค้าลงตะกร้า เพิ่มหรือลดจำนวน ลบสินค้า และแสดงราคารวม
- แสดง Empty State เมื่อค้นหาไม่พบสินค้า พร้อมปุ่มกลับไปดูสินค้าทั้งหมด
- แสดงภาพแบนเนอร์แบบสไลด์ พร้อมปุ่มก่อนหน้า ถัดไป เลือกภาพ และหยุดสไลด์อัตโนมัติ
- รองรับการแสดงผลบนมือถือ แท็บเล็ต และคอมพิวเตอร์
- แสดงข้อมูลผู้จัดทำผ่าน Profile ใน Footer

## เทคโนโลยีที่ใช้

| เทคโนโลยี | การใช้งาน |
| --- | --- |
| React 19 และ JavaScript (JSX) | สร้าง Component และจัดการ State กับ Event |
| React Router v6 | กำหนดเส้นทางและเปลี่ยนหน้าภายใต้ Layout ร่วมกัน |
| Vite 8 | รันโปรเจกต์ระหว่างพัฒนาและ build ไฟล์สำหรับนำไปใช้งาน |
| Tailwind CSS 4 | ตกแต่งหน้าเว็บและจัด layout ให้รองรับหลายขนาดหน้าจอ |
| Fake Store API | แหล่งข้อมูลตัวอย่างที่ดึงมาบันทึกไว้ในโปรเจกต์ระหว่างพัฒนา |
| JSON Server 0.17.4 | จำลอง REST API ที่พอร์ต 3001 และบันทึกข้อมูลลง `db.json` |
| ESLint | ตรวจข้อผิดพลาดและการใช้โค้ดตามกฎที่กำหนด |
| IBM Plex Sans Thai Looped | ฟอนต์ภาษาไทยและภาษาอังกฤษของหน้าเว็บ |

## สิ่งที่ต้องติดตั้ง

- Node.js เวอร์ชัน 22.12.0 หรือใหม่กว่า พร้อม npm
- เชื่อมต่ออินเทอร์เน็ตสำหรับติดตั้ง dependencies และโหลดรูปสินค้าจาก URL ภายนอก

## วิธีติดตั้งและรัน

ดาวน์โหลดหรือ clone โปรเจกต์ แล้วเปิด Terminal ที่โฟลเดอร์หลักซึ่งมีไฟล์ `README.md` และโฟลเดอร์ `minishop-react`

```bash
cd minishop-react
npm install
```

เปิด Terminal สองหน้าต่าง โดยทั้งสองอยู่ในโฟลเดอร์ `minishop-react`

Terminal 1 เปิด Mock API:

```bash
npm run api
```

Terminal 2 เปิด React / Vite:

```bash
npm run dev
```

เปิด [หน้าจัดการสินค้า](http://localhost:5173/admin/products) และตรวจ [ข้อมูล JSON จาก API](http://localhost:3001/products) หาก Vite ใช้พอร์ตอื่น ให้ใช้ URL ที่ Terminal แสดงแล้วต่อท้าย `/admin/products`

โปรเจกต์เลือกตรึง JSON Server เป็น `0.17.4` เพื่อใช้คำสั่ง `json-server --watch db.json --port 3001` ตาม [เอกสารรุ่นนี้](https://github.com/typicode/json-server/tree/v0.17.4) ส่วนตัวอย่างคำสั่งและเลขเวอร์ชันใน PDF ที่ได้รับไม่ปรากฏ จึงไม่ได้อ้างว่าเลขนี้ระบุอยู่ในใบงาน

### คำสั่งอื่น

รันคำสั่งต่อไปนี้ภายในโฟลเดอร์ `minishop-react`

| คำสั่ง | การทำงาน |
| --- | --- |
| `npm run dev` | เปิด development server |
| `npm run api` | เปิด JSON Server และเฝ้าดู `db.json` ที่พอร์ต 3001 |
| `npm run lint` | ตรวจโค้ดด้วย ESLint |
| `npm run build` | สร้างไฟล์สำหรับนำไปใช้งานในโฟลเดอร์ `dist` |
| `npm run preview` | เปิดดูผลลัพธ์หลังจากรัน `npm run build` |

## วิธีใช้งาน

สำหรับ Week 10 ให้เปิดเมนู `Manage Products` กรอกชื่อและราคาแล้วกด `Add Product` กด `Edit` เพื่อนำข้อมูลเดิมมาแก้แล้วกด `Save Changes` หรือกด `Delete` และยืนยันเพื่อลบสินค้า ตารางจะอ่านข้อมูลจาก API ใหม่หลังทำรายการสำเร็จ ดูขั้นตอน Mouse 450 → 490 → ลบได้ใน [คู่มือ Week 10](docs/week-10.md)

หน้าร้านและตะกร้าจาก Week 9 ยังใช้งานได้ตามเดิม:

1. เปิดหน้าเว็บเพื่อดูรายการสินค้าจากข้อมูลในโปรเจกต์
2. พิมพ์ชื่อสินค้าในช่องค้นหา หรือเลือกหมวดหมู่เพื่อกรองรายการ
3. เลือกการเรียงราคาจาก dropdown และใช้ปุ่ม `ล้างตัวกรอง` เพื่อกลับไปดูรายการทั้งหมด
4. กด `View Detail` หรือรูปสินค้าเพื่อไปหน้า `/products/:id` และกด `Continue Shopping` เพื่อกลับไป `/products`
5. กด `Add to Cart` เพื่อเพิ่มสินค้า จำนวนสินค้าในตะกร้าจะเพิ่มขึ้นตามจำนวนชิ้น
6. กดปุ่มตะกร้าที่ Navbar เพื่อดูรายการ ปรับจำนวน ลบสินค้า และดูราคารวม

## ไฟล์และ Component หลัก

ไฟล์ต่อไปนี้อยู่ภายในโฟลเดอร์ `minishop-react`

| ไฟล์ | หน้าที่ |
| --- | --- |
| `src/main.jsx` | จุดเริ่มต้นของ React และนำเข้า CSS กับฟอนต์ |
| `src/App.jsx` | กำหนด Routes อ่านสินค้าจาก Model และจัดการ State ของตะกร้าและ Toast |
| `db.json` | ข้อมูลสินค้าของ Mock API เริ่มต้นด้วย Laptop, Keyboard และ Monitor |
| `src/services/productApi.js` | รวม `fetch()` สำหรับ GET, POST, PUT และ DELETE พร้อมตรวจ `response.ok` |
| `src/pages/ProductManagement.jsx` | หน้า `/admin/products` จัดการฟอร์ม ตาราง Loading, Error, Empty State และ CRUD |
| `src/models/productModel.js` | เก็บข้อมูลสินค้าตัวอย่างทั้งหมด พร้อม `getProducts()` และ `getProductById(id)` |
| `src/components/Navbar.jsx` | แสดงชื่อร้าน ลิงก์ Home, Products, Manage Products, About และ Profile พร้อมปุ่มตะกร้าและจำนวนสินค้า |
| `src/components/Layout.jsx` | ใช้ Navbar และ Footer ร่วมกันทุกหน้า และใช้ `Outlet` แสดงหน้าที่ตรงกับ Route |
| `src/components/ProductCatalog.jsx` | ค้นหา กรองหมวดหมู่ เรียงราคา และแสดง Empty State เมื่อไม่พบสินค้า |
| `src/components/ProductList.jsx` | วนแสดงรายการ ProductCard และส่งข้อมูลผ่าน Props |
| `src/components/ProductCard.jsx` | แสดงสินค้าแต่ละรายการและปุ่มเพิ่มลงตะกร้ากับดูรายละเอียด |
| `src/pages/Home.jsx` | หน้า `/` พร้อม Hero และ Featured Products 4 รายการ |
| `src/pages/About.jsx` | หน้า `/about` แสดงข้อมูลร้าน |
| `src/pages/Products.jsx` | หน้า `/products` แสดงสินค้าทั้งหมด 20 รายการ พร้อมค้นหา กรอง และเรียงราคา |
| `src/pages/ProductDetail.jsx` | หน้า `/products/:id` ค้นหาสินค้าด้วย `getProductById(id)` และมีปุ่ม Continue Shopping; แสดง Product not found เมื่อไม่พบ ID |
| `src/pages/Profile.jsx` | หน้า `/profile` แสดงบัญชีผู้ใช้งานตัวอย่าง แก้ไขชื่อและอีเมล พร้อมสรุปตะกร้าปัจจุบัน; ข้อมูลเริ่มใหม่เมื่อรีเฟรชหน้า |
| `src/pages/NotFound.jsx` | หน้า 404 สำหรับ URL ที่ไม่ตรงกับ Route |
| `src/components/Cart.jsx` | แสดงรายการสินค้า จำนวน และราคารวมในตะกร้า |
| `src/components/Hero.jsx` | แสดงภาพแบนเนอร์แบบสไลด์ |
| `src/components/Footer.jsx` และ `src/components/Profile.jsx` | แสดงข้อมูลผู้จัดทำที่ท้ายหน้าเว็บ |
| `src/index.css` | ตั้งค่า Tailwind CSS ฟอนต์ สี และรูปแบบพื้นฐาน |

## การเปลี่ยนหน้าด้วย React Router

- `Link` สร้างลิงก์เปลี่ยนหน้าโดยไม่โหลดเว็บไซต์ใหม่ เช่น ลิงก์ดูสินค้าทั้งหมดไปยัง `/products` ส่วน `NavLink` ใช้สร้างลิงก์ที่ตรวจสถานะหน้าปัจจุบันได้ เช่น เมนูใน Navbar และลิงก์ไอคอน Profile ซึ่งเปิดในแท็บใหม่ได้ตามปกติ
- `useNavigate()` คืนฟังก์ชันสำหรับสั่งเปลี่ยนหน้าจากโค้ด เช่น ปุ่ม `Continue Shopping` เรียก `navigate("/products")` เพื่อกลับไปหน้ารายการสินค้า
- `useParams()` อ่านค่าพารามิเตอร์จาก URL ตาม Route เช่น `/products/:id` เมื่อเปิด `/products/3` จะได้ `id` เป็น string `"3"` แล้วส่งให้ `getProductById(id)` แปลงเป็นตัวเลขก่อนค้นหาใน Model

## แหล่งข้อมูลสินค้าและความต่อเนื่องจาก Week 9

หน้า `/admin/products` อ่านและแก้ข้อมูลผ่าน JSON Server ซึ่งบันทึกไว้ใน `minishop-react/db.json` ส่วนหน้า Home, Products, Product Detail และตะกร้ายังคงใช้ `productModel.js` ตามงาน Week 9 เพื่อทำตามใบงานที่ให้หน้าใหม่ใช้ API Service โดยไม่แก้ Model เดิม ดังนั้นการเพิ่มสินค้าในหน้าจัดการยังไม่เพิ่มสินค้าลงหน้าร้านเดิม

ข้อมูลสินค้าทั้งหมด 20 รายการนำมาจาก [Fake Store API](https://fakestoreapi.com/products) ครั้งเดียวระหว่างพัฒนาเมื่อวันที่ 24 ตุลาคม 2026 และบันทึกเป็นข้อมูลตัวอย่างไว้ใน `minishop-react/src/models/productModel.js` โดยรักษา `id`, `title`, `price`, `description`, `category`, `image` และ `rating` ตามข้อมูลที่ API ส่งกลับ

`getProducts()` ใน Model คืนรายการสินค้าทั้งหมด ส่วน `getProductById(id)` แปลง ID เป็นตัวเลขก่อนค้นหา จึงรองรับ ID แบบ string จาก URL และคืน `undefined` เมื่อไม่พบสินค้า `App.jsx` อ่านข้อมูลหน้าร้านจาก Model โดยตรง จึงไม่ต้องรอ fetch สำหรับหน้าร้าน ส่วน `getProducts()` ใน API Service เป็นอีกฟังก์ชันหนึ่งที่ใช้โดยหน้าจัดการสินค้าและมี Loading, Error กับ Retry

รูปภาพยังใช้ URL ภายนอกเดิมจากฟิลด์ `image` และโหลดผ่านเครือข่าย โดย `ProductImage` ยังคงแสดงภาพสำรองเมื่อโหลดรูปไม่สำเร็จ หากค้นหาแล้วไม่มีสินค้าที่ตรงกัน จะแสดงข้อความ `ไม่พบสินค้าที่ค้นหา`

## หมายเหตุ

- การเพิ่ม แก้ไข หรือลบผ่าน API จะเปลี่ยน `minishop-react/db.json` จริง ควรสำรองไฟล์ก่อนทดลองที่ต้องการเก็บข้อมูลเดิม
- โปรเจกต์นี้เป็นร้านค้าตัวอย่างเพื่อการศึกษา ใช้ข้อมูลและราคาตัวอย่างจาก API และไม่มีการชำระเงินจริง
- ข้อมูลตะกร้าเก็บใน React State เมื่อรีเฟรชหน้าเว็บ ตะกร้าจะเริ่มต้นใหม่
- ชื่อหมวดหมู่สร้างจากฟิลด์ `category` ของข้อมูลที่บันทึกไว้ใน Model

## การส่งงาน Week 10

- [Source Code บน branch week-10](https://github.com/chiqq888/MiniShopWithTailwindReact_67051099/tree/week-10) ต้อง push การเปลี่ยนแปลงในเครื่องก่อน ลิงก์จึงจะแสดงงานล่าสุด
- [db.json](minishop-react/db.json)
- [คำอธิบาย Request/Response และลิงก์ภาพทดสอบ CRUD](docs/week-10.md)

## ผู้จัดทำ

- **ชื่อ:** Ratchatapong Atteephok
- **รหัสนักศึกษา:** 67051099
- **สถาบัน:** สถาบันเทคโนโลยีพระจอมเกล้าเจ้าคุณทหารลาดกระบัง (KMITL)
