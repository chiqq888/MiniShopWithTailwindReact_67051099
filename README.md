# MiniShop React Lab Week 11

ต่อยอด MiniShop จาก Week 10 ด้วย **Advanced UI & Tailwind Components**: ใช้ DaisyUI ร่วมกับ Tailwind CSS v4 สร้างพื้นที่ Admin ที่มี Dashboard, Product Management, Modal Form และธีม Light/Dark โดยคงหน้าร้านและตะกร้าเดิมไว้

ดูขั้นตอนและผลทดสอบที่ตรวจจริงใน [รายงาน Week 11](docs/week-11.md) และอ่านพื้นฐาน REST API ของงานเดิมได้ใน [คู่มือ Week 10](docs/week-10.md)

## ติดตั้งและเปิดโปรเจกต์

ใช้ Node.js 22.12.0 หรือใหม่กว่า พร้อม npm จากโฟลเดอร์หลักของ repository:

```bash
cd minishop-react
npm install
```

เปิด Terminal สองหน้าต่าง โดยทั้งสองอยู่ในโฟลเดอร์ `minishop-react`

Terminal 1 เปิด JSON Server ซึ่งอ่านและเขียน `db.json` ที่พอร์ต 3001:

```bash
npm run api
```

Terminal 2 เปิด React / Vite:

```bash
npm run dev
```

เปิด [MiniShop](http://localhost:5173) และตรวจ [ข้อมูล API](http://localhost:3001/products) หาก Vite เลือกพอร์ตอื่น ให้ใช้ URL ที่ Terminal แสดง

โดยปกติไม่ต้องตั้ง environment เพิ่ม หากต้องใช้ API คนละพอร์ต ให้คัดลอก `.env.example` เป็น `.env.local` ใน `minishop-react` แล้วแก้ `VITE_PRODUCT_API_URL` ให้เป็น URL รายการสินค้าเต็ม เช่น `http://localhost:3002/products` จากนั้นเปิด Vite ใหม่

| คำสั่งภายใน `minishop-react` | หน้าที่ |
| --- | --- |
| `npm run dev` | เปิด development server |
| `npm run api` | เปิด JSON Server 0.17.4 พร้อมเฝ้าดู `db.json` |
| `npm run lint` | ตรวจโค้ดด้วย ESLint |
| `npm run build` | สร้างไฟล์เว็บใน `dist` |
| `npm run preview` | ดูเว็บจากผล build |

## เข้าใช้งาน Admin

1. เปิดไอคอน **Profile** บน Navbar หน้าร้าน หรือไปที่ `/profile`
2. กด **Switch to Admin** เพื่อเปิด `/admin/dashboard`
3. เลือก **Dashboard** หรือ **Products** จาก Sidebar และกด **View Store** เพื่อกลับหน้าร้าน

`/admin` จะ redirect ไป `/admin/dashboard` ส่วนเมนู Manage Products เดิมย้ายจาก Navbar หน้าร้านมาอยู่ใน Admin แล้ว การสลับพื้นที่นี้เป็นตัวอย่างสำหรับใบงาน ยังไม่มีระบบเข้าสู่ระบบหรือการตรวจสิทธิ์ Admin

| เส้นทาง | เนื้อหาและ Layout |
| --- | --- |
| `/` | Home ภายใต้ Layout หน้าร้าน |
| `/products` | ค้นหา กรอง และเรียงสินค้าหน้าร้าน |
| `/products/:id` | รายละเอียดสินค้าและเพิ่มลงตะกร้า |
| `/about` | ข้อมูลร้าน |
| `/profile` | แก้ไขข้อมูลบัญชีตัวอย่าง สรุปตะกร้า และทางเข้า Admin |
| `/admin/dashboard` | สรุปสินค้าจาก API ภายใต้ AdminLayout |
| `/admin/products` | จัดการสินค้าและ Modal Form ภายใต้ AdminLayout |

มี `BrowserRouter` เพียงตัวเดียวใน `main.jsx` และใช้ `Outlet` แสดงหน้าลูกของแต่ละ Layout ส่วน Sidebar ใช้ `NavLink` แสดงเมนูปัจจุบัน

## Dashboard และ Product Management

Dashboard อ่านสินค้าทั้งหมดจาก API เพื่อคำนวณ **Total Products** (จำนวนรายการ), **Product Value** (ผลรวมราคาแต่ละรายการ) และ **Categories** (จำนวนหมวดหมู่ที่ไม่ซ้ำกัน) พร้อมตาราง 5 รายการแรกและลิงก์ไปหน้าจัดการสินค้า เมื่อกลับเข้าหน้า Dashboard จะอ่านข้อมูลใหม่ รองรับ Loading, Error พร้อม Retry และ Empty State

หน้า Products แสดงตาราง DaisyUI `table table-zebra` พร้อม Badge หมวดหมู่ ปุ่ม **Add Product** เปิด Modal ว่าง และ **Edit** เปิด Modal เดียวกันพร้อมข้อมูลเดิม ฟอร์มใช้ Controlled Inputs และมีฟิลด์ดังนี้:

| ฟิลด์ | เงื่อนไข |
| --- | --- |
| `name` | ตัดช่องว่างหัวท้าย และต้องไม่ว่างหรือมีแต่ช่องว่าง |
| `price` | ต้องเป็นตัวเลขที่มากกว่า 0 และส่งเป็นชนิด number |
| `category` | เลือก `Computer`, `Audio`, `Fashion` หรือ `Gadget` |
| `icon` | ข้อมูลเสริม เว้นว่างได้ |
| `description` | ข้อมูลเสริม เว้นว่างได้ |

การบันทึกใช้ `POST` สำหรับสินค้าใหม่และ `PUT` สำหรับการแก้ไข โดยรวมข้อมูลเดิมด้วย `{ ...editingProduct, ...ข้อมูลจากฟอร์ม }` ก่อนส่ง จึงเก็บฟิลด์อื่นที่ไม่ได้แก้ไขไว้ด้วย ปุ่มบันทึกถูกปิดระหว่างรอ API เพื่อป้องกันการส่งซ้ำ

เมื่อบันทึกสำเร็จ Modal จะปิด ล้างสถานะฟอร์ม และโหลดตารางใหม่ หาก API ล้มเหลวจะเก็บ Modal และข้อมูลที่กรอกไว้พร้อมข้อความ Error ปุ่ม **Cancel** ปิดโดยไม่บันทึก และ **Delete** ต้องยืนยันก่อนส่งคำขอลบ Modal เลื่อนเนื้อหาภายในได้เมื่อความสูงเกินหน้าจอ

## ธีมและการแสดงผล

ใช้ DaisyUI v5 ผ่าน `@plugin "daisyui";` ใน `src/index.css` ร่วมกับ Tailwind CSS v4 และคง `@theme` เดิมไว้ ฝั่ง Admin ใช้คลาส `navbar`, `btn`, `card`, `table`, `input`, `select`, `modal`, `badge`, `alert` และ `breadcrumbs` พร้อมสี `base-100`, `base-200`, `base-content` และ `base-300`

ปุ่มสลับธีมบน Navbar ของ Admin เปลี่ยน `data-theme` ของ `document.documentElement` ระหว่าง `light`/`dark` และบันทึกใน `localStorage` ด้วย key **`minishop-theme`** เพื่ออ่านกลับเมื่อเปิดหน้าใหม่หรือรีเฟรช

รักษาฟอนต์ **IBM Plex Sans Thai Looped**, มุมโค้งหลัก **15px** และรูปแบบ minimal ของ MiniShop โดยใช้ custom breakpoints เดิม: `xs=361px`, `sm=541px`, `md=801px`, `lg=1101px`, `xl=1600px` บนหน้าจอเล็ก Sidebar อยู่เหนือเนื้อหา ตารางเลื่อนแนวนอนภายใน Container และ Summary Cards ปรับจำนวนคอลัมน์ตามพื้นที่

## แหล่งข้อมูลและโครงสร้าง

ข้อมูล Admin และหน้าร้านแยกกันตามโครงสร้างเดิม: **Dashboard และ Product Management ใช้ `getProducts()` จาก `services/productApi.js`** ติดต่อ JSON Server ส่วน **Home, Products, Product Detail และ Cart ใช้ข้อมูลคงที่จาก `models/productModel.js`** ซึ่งเก็บสินค้าตัวอย่างจาก [Fake Store API](https://fakestoreapi.com/products) ดังนั้น CRUD ใน Admin ยังไม่เปลี่ยนสินค้าหน้าร้าน

`db.json` คงสินค้าเดิม Laptop, Keyboard และ Monitor โดยเพิ่มหมวดหมู่ `Computer` ให้ทั้งสามรายการ สินค้าใหม่สามารถเลือกหมวดหมู่อื่นจากฟอร์มได้

ไฟล์ในตารางต่อไปนี้อยู่ภายในโฟลเดอร์ `minishop-react`

| ไฟล์ | หน้าที่ |
| --- | --- |
| `package.json` และ `package-lock.json` | Dependencies และคำสั่ง React, API, lint และ build |
| `src/main.jsx` | เริ่ม React, BrowserRouter, ฟอนต์, CSS และคืนค่าธีมก่อน render |
| `src/App.jsx` | Routes หน้าร้าน/แอดมิน และ State บัญชีกับตะกร้า |
| `src/index.css` | Tailwind, DaisyUI, custom theme และสไตล์ Admin |
| `src/components/Layout.jsx` | Navbar, Footer และ Outlet หน้าร้าน โดยคงธีมสว่างของร้านเดิม |
| `src/components/AdminLayout.jsx` | Navbar Admin, Sidebar, View Store และ Outlet |
| `src/components/ThemeToggle.jsx` | สลับธีมและบันทึกค่าที่เลือก |
| `src/components/Navbar.jsx` | เมนูหน้าร้าน Profile และปุ่มตะกร้า |
| `src/pages/Profile.jsx` | ข้อมูลบัญชี สรุปตะกร้า และ Switch to Admin |
| `src/pages/Dashboard.jsx` | สรุปข้อมูล API และตาราง 5 รายการแรก |
| `src/pages/ProductManagement.jsx` | ตารางสินค้า Validation และ CRUD ผ่าน API |
| `src/components/AdminModal.jsx` | Modal เพิ่ม/แก้ไขสินค้า ใช้สีตามธีมและเลื่อนภายในได้ |
| `src/components/Modal.jsx` และ `src/components/Cart.jsx` | Modal ตะกร้าและการปรับจำนวนสินค้าเดิม |
| `src/services/productApi.js` | GET, POST, PUT, DELETE และตรวจ HTTP Error |
| `.env.example` | ตัวอย่าง URL ของ API สำหรับกรณีใช้เซิร์ฟเวอร์คนละพอร์ต |
| `db.json` | ข้อมูลสินค้า JSON Server ที่ CRUD เปลี่ยนจริง |
| `src/models/productModel.js` | ข้อมูลคงที่ของหน้าร้าน พร้อมฟังก์ชันอ่านสินค้า |
| `src/pages/Home.jsx`, `Products.jsx`, `ProductDetail.jsx` | หน้าร้านเดิมพร้อมค้นหา กรอง เรียง และดูรายละเอียด |

## สำรองข้อมูลและตรวจสอบงาน

- [สำรองข้อมูล Week 10 ก่อนเพิ่มหมวดหมู่](docs/week-11/db.week-10.backup.json)
- [สำรองข้อมูล Week 11 ก่อนทดลอง CRUD](docs/week-11/db.before-crud.json)
- [รายงานขั้นตอน ผลทดสอบ และข้อจำกัดที่ตรวจพบ](docs/week-11.md)

ควรสำรอง `minishop-react/db.json` ก่อนทดลอง CRUD และใช้ชื่อสินค้าทดสอบแยกจากสินค้าเดิม ข้อมูลบัญชีและตะกร้าเก็บใน React State จึงเริ่มใหม่เมื่อรีเฟรช ส่วนธีมบันทึกใน localStorage และข้อมูลสินค้า Admin บันทึกใน `db.json`

## เอกสารอ้างอิง

- [ติดตั้ง DaisyUI กับ Vite](https://daisyui.com/docs/install/vite/)
- [การตั้งค่าธีม DaisyUI](https://daisyui.com/docs/themes/)
- [JSON Server 0.17.4](https://github.com/typicode/json-server/tree/v0.17.4)

## ผู้จัดทำ

- **ชื่อ:** Ratchatapong Atteephok
- **รหัสนักศึกษา:** 67051099
- **สถาบัน:** สถาบันเทคโนโลยีพระจอมเกล้าเจ้าคุณทหารลาดกระบัง (KMITL)
