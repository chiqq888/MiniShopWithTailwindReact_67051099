# MiniShop React

เว็บไซต์ร้านค้าตัวอย่างสำหรับฝึกพัฒนาด้วย React ครอบคลุมการดูสินค้า ค้นหาและกรองสินค้า จัดการตะกร้า แก้ไขโปรไฟล์ และจัดการสินค้าผ่าน REST API พร้อม Dashboard สำหรับ Admin ออกแบบให้รองรับทั้งมือถือ แท็บเล็ต และคอมพิวเตอร์

## ฟีเจอร์หลัก

### หน้าร้าน

- หน้าแรกพร้อมแบนเนอร์สไลด์และสินค้าแนะนำ
- แสดงสินค้าตัวอย่าง 20 รายการ พร้อมรูปภาพ ราคา หมวดหมู่ และคะแนนรีวิว
- ค้นหาจากชื่อ กรองตามหมวดหมู่ เรียงราคาจากน้อยไปมากหรือมากไปน้อย และล้างตัวกรอง
- ดูรายละเอียดสินค้าตาม ID พร้อมเพิ่มลงตะกร้า และแสดงสถานะเมื่อไม่พบสินค้าหรือผลการค้นหา
- เพิ่มสินค้า ปรับจำนวน ลบสินค้า และคำนวณยอดรวมในตะกร้าที่ใช้ร่วมกันระหว่างหน้า
- แก้ไขชื่อและอีเมลตัวอย่างในหน้า Profile พร้อมดูสรุปตะกร้าปัจจุบัน
- เปลี่ยนหน้าด้วย React Router ภายใต้ Layout ร่วมกัน พร้อมหน้า About และหน้า 404

### ระบบ Admin

- เข้าใช้งานจาก **Profile → Switch to Admin** พร้อม Navbar, Sidebar และปุ่ม **View Store** สำหรับกลับหน้าร้าน
- Dashboard แสดงจำนวนสินค้า ผลรวมราคาแต่ละรายการ จำนวนหมวดหมู่ และตารางสินค้า 5 รายการแรกจาก API
- อ่าน เพิ่ม แก้ไข และลบสินค้าผ่าน JSON Server โดยแยกการเรียก API ไว้ใน Service
- ใช้ Modal ร่วมกันสำหรับเพิ่มและแก้ไขสินค้า รองรับชื่อ ราคา หมวดหมู่ ไอคอน และรายละเอียด
- ตรวจชื่อและราคาที่มากกว่า 0 ก่อนบันทึก ยืนยันก่อนลบ และแสดง Loading, Error, Retry กับ Empty State
- สลับธีม Light/Dark ของ Admin และจดจำธีมใน `localStorage`

## เทคโนโลยีที่ใช้

| เทคโนโลยี | การใช้งาน |
| --- | --- |
| React 19 และ JavaScript (JSX) | สร้าง Component และจัดการ State กับ Event |
| React Router v6 | กำหนดเส้นทางและแยก Layout หน้าร้านกับ Admin |
| Vite 8 | เปิด development server และ build โปรเจกต์ |
| Tailwind CSS 4 และ DaisyUI 5 | ตกแต่งหน้าเว็บและสร้าง UI ที่รองรับหลายขนาดหน้าจอ |
| JSON Server 0.17.4 | จำลอง REST API และบันทึกข้อมูลสินค้า Admin |
| ESLint | ตรวจโค้ดตามกฎที่กำหนด |
| IBM Plex Sans Thai Looped | ฟอนต์ภาษาไทยและภาษาอังกฤษ |

## ติดตั้งและรันโปรเจกต์

ใช้ Node.js 22.12.0 หรือใหม่กว่า พร้อม npm จากโฟลเดอร์หลักของ repository:

```bash
cd minishop-react
npm install
```

เปิด Terminal สองหน้าต่าง โดยทั้งสองอยู่ในโฟลเดอร์ `minishop-react`

Terminal 1 เปิด JSON Server:

```bash
npm run api
```

Terminal 2 เปิด React / Vite:

```bash
npm run dev
```

เปิด [MiniShop](http://localhost:5173) และตรวจ [ข้อมูล API](http://localhost:3001/products) หาก Vite เลือกพอร์ตอื่น ให้ใช้ URL ที่ Terminal แสดง

หากต้องใช้ API คนละพอร์ต ให้คัดลอก `minishop-react/.env.example` เป็น `.env.local` ในโฟลเดอร์เดียวกัน แล้วแก้ `VITE_PRODUCT_API_URL` เป็น URL รายการสินค้าเต็ม เช่น `http://localhost:3002/products` จากนั้นเปิด Vite ใหม่

| คำสั่งภายใน `minishop-react` | หน้าที่ |
| --- | --- |
| `npm run dev` | เปิด development server |
| `npm run api` | เปิด JSON Server 0.17.4 ที่พอร์ต 3001 |
| `npm run lint` | ตรวจโค้ดด้วย ESLint |
| `npm run build` | สร้างไฟล์เว็บใน `dist` |
| `npm run preview` | ดูเว็บจากผล build |

## เส้นทางหลัก

| เส้นทาง | หน้าที่ |
| --- | --- |
| `/` | หน้าแรกและสินค้าแนะนำ |
| `/products` | ค้นหา กรอง และเรียงสินค้าหน้าร้าน |
| `/products/:id` | รายละเอียดสินค้าและเพิ่มลงตะกร้า |
| `/about` | ข้อมูลร้าน |
| `/profile` | แก้ไขข้อมูลบัญชีตัวอย่าง สรุปตะกร้า และ Switch to Admin |
| `/admin` | เปลี่ยนไป `/admin/dashboard` |
| `/admin/dashboard` | สรุปสินค้าจาก API |
| `/admin/products` | ตารางสินค้าและ Modal สำหรับ CRUD |

## โครงสร้างโปรเจกต์

ไฟล์แอปพลิเคชันอยู่ภายในโฟลเดอร์ `minishop-react`

| ไฟล์หรือโฟลเดอร์ | หน้าที่ |
| --- | --- |
| `src/main.jsx` | เริ่ม React, BrowserRouter, ฟอนต์ และธีม |
| `src/App.jsx` | กำหนด Routes และ State ร่วมของตะกร้ากับโปรไฟล์ |
| `src/components/` | Component ที่ใช้ประกอบหน้าร้านและ Admin เช่น Layout, Navbar, Cart และ Modal |
| `src/pages/` | หน้า Home, Products, Product Detail, Profile, Dashboard และ Product Management |
| `src/models/productModel.js` | ข้อมูลสินค้าคงที่และฟังก์ชันอ่านสินค้าสำหรับหน้าร้าน |
| `src/services/productApi.js` | เรียก API ด้วย GET, POST, PUT และ DELETE พร้อมตรวจ HTTP Error |
| `src/index.css` | ตั้งค่า Tailwind CSS, DaisyUI และรูปแบบของโปรเจกต์ |
| `db.json` | ข้อมูลสินค้า Admin ที่ JSON Server อ่านและเขียน |
| `.env.example` | ตัวอย่างการตั้งค่า URL ของ API |

## ข้อมูลและการเก็บสถานะ

- **หน้าร้านและตะกร้า:** ใช้สินค้าคงที่จาก `minishop-react/src/models/productModel.js` ซึ่งบันทึกข้อมูลตัวอย่างจาก Fake Store API
- **Dashboard และ Product Management:** ใช้ `minishop-react/src/services/productApi.js` ติดต่อ JSON Server ที่อ่านและเขียน `minishop-react/db.json` การทำ CRUD ใน Admin จึงมีผลกับข้อมูล Admin เท่านั้น
- **การเก็บสถานะ:** ตะกร้าและโปรไฟล์อยู่ใน React State และเริ่มใหม่เมื่อรีเฟรช ธีมเก็บใน `localStorage` ส่วนสินค้า Admin บันทึกใน `db.json`

โปรเจกต์นี้ใช้เพื่อการศึกษา ยังไม่มีระบบเข้าสู่ระบบหรือการตรวจสิทธิ์ Admin และไม่มีการชำระเงินจริง

## ผู้จัดทำ

- **ชื่อ:** Ratchatapong Atteephok
- **รหัสนักศึกษา:** 67051099
- **สถาบัน:** สถาบันเทคโนโลยีพระจอมเกล้าเจ้าคุณทหารลาดกระบัง (KMITL)

## เอกสารแต่ละสัปดาห์

โค้ดปัจจุบันบน `main` ใช้เวอร์ชันล่าสุดจาก Week 11 เอกสารด้านล่างแยกรายละเอียดและพัฒนาการของแต่ละสัปดาห์

- [Week 9 — Routing และ Product Model](docs/week-9.md)
- [Week 10 — REST API และ CRUD](docs/week-10.md) พร้อม [โครงสร้างโปรเจกต์ใน Week 10](docs/architecture.md)
- [Week 11 — Admin Dashboard และ Advanced UI](docs/week-11.md)
