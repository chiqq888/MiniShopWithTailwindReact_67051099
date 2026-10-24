# MiniShop React — Week 9–11

เว็บไซต์ร้านค้าตัวอย่างสำหรับฝึกพัฒนาด้วย React รวมงาน **Week 9, Week 10 และ Week 11** ไว้ที่ branch `main` โดยใช้โค้ดล่าสุดจาก **Week 11** และแยกเอกสารแต่ละสัปดาห์ไว้ใน `docs/`

## สรุปงานแต่ละสัปดาห์

### Week 9 — Routing และ Product Model

- แบ่งหน้า Home, Products, Product Detail, About, Profile และหน้า 404 ด้วย React Router v6
- ใช้ Layout ร่วมกันผ่าน `Outlet` และเปลี่ยนหน้าด้วย `Link`, `NavLink` และ `useNavigate()`
- อ่านสินค้าตัวอย่าง 20 รายการจาก `productModel.js` พร้อมค้นหา กรองหมวดหมู่ เรียงราคา และดูรายละเอียดตาม ID
- ใช้ตะกร้าร่วมกันระหว่างหน้า และแก้ไขชื่อกับอีเมลตัวอย่างในหน้า Profile พร้อมดูสรุปตะกร้า

อ่าน [รายละเอียด Week 9](docs/week-9.md)

### Week 10 — REST API และ CRUD

- เพิ่มหน้า `/admin/products` สำหรับอ่าน เพิ่ม แก้ไข และลบสินค้า ผ่าน JSON Server
- แยก API Service สำหรับ `GET`, `POST`, `PUT` และ `DELETE` โดยบันทึกข้อมูลลง `db.json`
- ตรวจชื่อสินค้าและราคาก่อนบันทึก ยืนยันก่อนลบ และแสดง Loading, Error, Retry กับ Empty State
- แยกข้อมูล Admin ที่มาจาก API ออกจากข้อมูลคงที่ของหน้าร้าน

อ่าน [รายละเอียด Week 10 พร้อม Request/Response และหลักฐานทดสอบ](docs/week-10.md) และ [โครงสร้างโปรเจกต์ใน Week 10](docs/architecture.md)

### Week 11 — Admin Dashboard และ Advanced UI

- แยกพื้นที่ Admin ด้วย Navbar, Sidebar และ nested routes พร้อมทางเข้า **Profile → Switch to Admin**
- เพิ่ม Dashboard สรุปจำนวนสินค้า ผลรวมราคา จำนวนหมวดหมู่ และตารางสินค้า 5 รายการแรกจาก API
- ใช้ DaisyUI ร่วมกับ Tailwind CSS ปรับฟอร์มเพิ่มและแก้ไขสินค้าเป็น Modal พร้อมฟิลด์ category, icon และ description
- สลับธีม Light/Dark และจดจำธีมใน `localStorage` พร้อมปรับ Layout ให้รองรับ Desktop และ Mobile

อ่าน [รายละเอียด Week 11 พร้อมผลทดสอบและภาพหลักฐาน](docs/week-11.md)

เอกสาร Week 9 และ Week 10 อธิบายพฤติกรรมของงานในสัปดาห์นั้น ส่วนวิธีรันและเส้นทางด้านล่างอ้างอิงโค้ด Week 11 ที่ใช้บน `main`

## ติดตั้งและรันโค้ดล่าสุด

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

## ข้อมูลและเทคโนโลยี

- **หน้าร้านและตะกร้า:** ใช้สินค้าคงที่จาก `minishop-react/src/models/productModel.js` ซึ่งบันทึกข้อมูลตัวอย่างจาก Fake Store API
- **Dashboard และ Product Management:** ใช้ `minishop-react/src/services/productApi.js` ติดต่อ JSON Server ที่อ่านและเขียน `minishop-react/db.json` การทำ CRUD ใน Admin จึงมีผลกับข้อมูล Admin เท่านั้น
- **การเก็บสถานะ:** ตะกร้าและโปรไฟล์อยู่ใน React State และเริ่มใหม่เมื่อรีเฟรช ธีมเก็บใน `localStorage` ส่วนสินค้า Admin บันทึกใน `db.json`
- **เทคโนโลยีหลัก:** React 19, React Router v6, Vite 8, Tailwind CSS 4, DaisyUI 5, JSON Server 0.17.4 และ ESLint

โปรเจกต์นี้ใช้เพื่อการศึกษา ยังไม่มีระบบเข้าสู่ระบบหรือการตรวจสิทธิ์ Admin และไม่มีการชำระเงินจริง

## ผู้จัดทำ

- **ชื่อ:** Ratchatapong Atteephok
- **รหัสนักศึกษา:** 67051099
- **สถาบัน:** สถาบันเทคโนโลยีพระจอมเกล้าเจ้าคุณทหารลาดกระบัง (KMITL)
