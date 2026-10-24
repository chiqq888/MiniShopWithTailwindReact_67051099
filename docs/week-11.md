# Week 11 — Advanced UI & Tailwind Components

พัฒนาบน branch `week-11` ต่อจาก Week 10 โดยใช้ React JSX, Vite, React Router เดิม, Tailwind CSS v4, DaisyUI 5.7.50 และ JSON Server 0.17.4

## เข้าใช้งานและเปิดเซิร์ฟเวอร์

ทำงานในโฟลเดอร์ `minishop-react` ติดตั้งด้วย `npm install` แล้วเปิดสอง Terminal: `npm run api` และ `npm run dev` เปิด URL ของ Vite → Profile → **Switch to Admin**

- `/admin` redirect ไป `/admin/dashboard`
- `/admin/dashboard` แสดงสรุปจาก API และสินค้า 5 รายการแรก
- `/admin/products` แสดงตารางและจัดการสินค้าใน Modal
- **View Store** กลับไป `/` โดยยังใช้ State ตะกร้าและโปรไฟล์เดิมระหว่างเปลี่ยนหน้า

## โครงสร้างและการทำงานของโค้ด

`main.jsx` คง BrowserRouter เพียงตัวเดียว อ่านธีมจาก localStorage ก่อน render ส่วน `App.jsx` แยก nested routes เป็น Layout ของหน้าร้านและ AdminLayout ทำให้ Navbar/Sidebar ของ Admin ใช้ร่วมกันทั้ง Dashboard และ Products ผ่าน Outlet และแสดงหน้าปัจจุบันด้วย NavLink

`Dashboard.jsx` ใช้ `getProducts()` จาก `services/productApi.js` ทุกครั้งที่เข้าหน้า ไม่ใช้ข้อมูลคงที่จาก Model การเรียกครั้งแรกมี AbortController สำหรับกรณีออกจากหน้าหรือ React StrictMode ส่วน Retry เรียก API ใหม่โดยไม่รีเฟรชทั้งเว็บ

Summary คำนวณจากสินค้าทุกแถว: จำนวนรายการ, ผลรวมราคา, จำนวน category ที่ไม่ว่างและไม่ซ้ำกัน ตารางใช้ `slice(0, 5)` จึงไม่จำกัดข้อมูลที่นำไปคำนวณ เมื่อเกิด Loading/Error จะแสดงขีดแทนค่าที่อาจล้าสมัย และเมื่อไม่มีสินค้าจะแสดง 0 พร้อม Empty State

`ProductManagement.jsx` คงฟังก์ชัน GET/POST/PUT/DELETE เดิม ใช้ Controlled Inputs สำหรับ `name`, `price`, `category`, `icon`, `description` โดยหมวดหมู่เลือกได้ Computer, Audio, Fashion, Gadget; icon และ description เว้นว่างได้ ชื่อถูก trim และราคาต้องเป็นตัวเลขมากกว่า 0 ก่อนส่ง API

Add เปิดฟอร์มว่าง ราคาเว้นว่าง หมวดหมู่ Computer และไอคอนเริ่มต้น 📦 ส่วน Edit เก็บสินค้าทั้งรายการและนำค่าเดิมมาแสดง เมื่อส่ง PUT ใช้ `{ ...editingProduct, ...fields }` เพื่อรักษาฟิลด์อื่นที่ไม่ได้แก้ไขและส่งราคาเป็น number การปิด Modal จะล้างฟอร์ม/สถานะแก้ไข บันทึกสำเร็จจึงปิดและโหลดตารางใหม่ หาก API ล้มเหลวจะเก็บฟอร์มพร้อม Error ไว้ให้ลองใหม่

ระหว่างบันทึกจะปิดปุ่มและ fieldset รวมถึงกัน Escape/การปิดหน้าต่าง ใช้ ref ล็อกการส่งซ้ำทันที การลบมี native confirmation ก่อนส่ง DELETE และอัปเดตตารางเมื่อสำเร็จ การโหลดตารางล้มเหลวหลัง CRUD แยกจาก Error ของการบันทึก จึงไม่ทำให้ผู้ใช้ส่งสินค้าซ้ำเพราะเข้าใจว่าบันทึกไม่สำเร็จ

`AdminModal.jsx` ใช้ native dialog ร่วมกับคลาส DaisyUI `modal`/`modal-box` เพื่อจัดการ focus และปิดด้วย Cancel, Escape หรือพื้นที่ว่าง จำกัดความสูงตาม `100dvh` และเลื่อนภายในได้ แยกจาก `Modal.jsx` ของ Cart จึงคงตะกร้าเดิมไว้ การตรวจ Chrome พบว่าต้องตั้ง focus หลัง `showModal()` อย่างชัดเจนเพื่อรองรับ StrictMode และจัดการคลิกพื้นที่ padding ของ dialog เพิ่มเติม ซึ่งแก้เรียบร้อยก่อนทดสอบรอบสุดท้าย

`ThemeToggle.jsx` เปลี่ยน `data-theme` ของ html และบันทึก `minishop-theme` รองรับกรณี browser ปิดการใช้ localStorage ส่วน Admin ใช้สี `base-*` และสไตล์ `.admin-shell` เพื่อคงมุมโค้ง 15px/ฟอนต์ IBM Plex Sans Thai Looped หน้าร้านมี `data-theme="light"` ของตัวเองเพื่อคงรูปลักษณ์เดิมเมื่อกลับจาก Admin ธีมมืด

`productApi.js` ยังใช้ `http://localhost:3001/products` เป็นค่าเริ่มต้น และรองรับ `VITE_PRODUCT_API_URL` สำหรับ API ต่างพอร์ต ตรวจ HTTP Error, response แบบ array และรองรับ AbortSignal

## ข้อมูลเดิมและการสำรอง

เก็บสินค้าทั้ง 3 รายการโดยไม่แก้ชื่อ/ราคา และเพิ่ม `category: "Computer"`:

| สินค้า | ราคา |
| --- | ---: |
| Laptop | 25,000 |
| Keyboard | 1,500 |
| Monitor | 6,500 |

ค่าตั้งต้นของ Dashboard จึงเป็น **3 รายการ / ฿33,000.00 / 1 หมวดหมู่**

- [สำรอง Week 10 ก่อนเพิ่ม category](week-11/db.week-10.backup.json)
- [สำรอง Week 11 ก่อนทดลอง CRUD](week-11/db.before-crud.json)

การทดสอบใช้ JSON Server จริงบนพอร์ต 13001 กับสำเนาฐานข้อมูล และ Vite บนพอร์ต 15173 ซึ่งตั้ง `VITE_PRODUCT_API_URL` ไปยัง API ทดสอบ เพื่อไม่รบกวนเซิร์ฟเวอร์เดิม ทุกรายการทดสอบใช้ชื่อขึ้นต้น Week 11 ลบทิ้งหลังตรวจ CRUD และตรวจเทียบว่าสินค้าเดิมยังครบ ไฟล์ `minishop-react/db.json` ไม่ถูกแก้ระหว่างการทดสอบ

หน้าร้าน Home, Products, Product Detail และ Cart ยังคงใช้สินค้าคงที่จาก `models/productModel.js` ตามโครงสร้าง Week 10 จึงแยกจากสินค้าใน Admin

## ผลทดสอบจริง

ทดสอบวันที่ **24 ตุลาคม 2026 (Asia/Bangkok)** ด้วย Chrome headless ผ่าน Playwright บน Windows ผ่าน **17 กลุ่มทดสอบ** ดูเวลาและข้อมูลที่บันทึกจริงใน [test-results.json](week-11/test-results.json) และ [สคริปต์ทดสอบ](week-11/verify.cjs)

| กลุ่มทดสอบ | ผล |
| --- | --- |
| Profile → Switch to Admin, `/admin` redirect, Sidebar active และแยก Layout | ผ่าน |
| Dashboard ค่าเริ่มต้นจาก API 3 / 33,000 / 1 | ผ่าน |
| Loading ทั้ง Dashboard/Products โดยหน่วง GET จริง | ผ่าน |
| ชื่อว่าง/ช่องว่าง ราคาเว้นว่าง/0/ติดลบ และพิมพ์ตัวอักษรในช่อง number | ผ่าน ไม่ส่ง POST |
| Cancel, Escape, คลิกพื้นที่ว่าง ไม่บันทึก เปิด Add ใหม่ฟอร์มว่าง และ focus กลับปุ่มเดิม | ผ่าน |
| POST สินค้า Wireless Mouse 450 บาทครบทุกฟิลด์ และบล็อกส่งซ้ำระหว่างรอ | ผ่าน ส่ง POST ครั้งเดียว |
| Dashboard หลังเพิ่ม | ผ่าน 4 / 33,450 / 2 |
| Edit แสดงค่าเดิม PUT เปลี่ยนราคา 450 → 490 และรักษาฟิลด์เสริมที่ไม่ได้แก้ | ผ่าน ตรวจ payload และข้อมูล API |
| Dashboard หลังแก้ราคา | ผ่าน 4 / 33,490 / 2 |
| Delete กดยกเลิกยังอยู่ กดยืนยันหายจากตาราง/API | ผ่าน Dashboard กลับเป็น 3 / 33,000 / 1 |
| บันทึกหมวดหมู่ทั้งสี่ และเว้น icon/description ว่าง | ผ่าน |
| Empty State จริงทั้งสองหน้า และ Dashboard ค่า 0 | ผ่าน |
| มีข้อมูลจริง 7 รายการ แสดงเฉพาะ 5 แถวแรก แต่คำนวณครบทั้ง 7 | ผ่าน 7 / 33,040 / 2 |
| หยุด process API จริงทั้งหน้า Dashboard/Products แล้วเปิดกลับและกด Retry | ผ่าน |
| หยุด API ขณะ Modal เปิด แล้วบันทึก | ผ่าน แสดง Error คงค่าทุกช่อง เปิด API กลับแล้วบันทึกซ้ำได้ |
| จำลอง response HTTP 500 สำหรับ PUT/DELETE | ผ่าน คงฟอร์ม/สินค้า และแจ้ง Error |
| Light/Dark เปลี่ยนสี, localStorage, รีเฟรช, เปิดแท็บใหม่ใน browser context เดียวกัน | ผ่าน |
| Desktop 1440 × 1000 และ Mobile 393 × 852 px ทั้งสองธีม: Dashboard/Products/Modal | ผ่าน ไม่มีหน้าเว็บล้นแนวนอน ตารางเลื่อนภายใน Modal อยู่ใน viewport และเลื่อนได้ |
| หน้าร้าน Home/Products/Detail/Profile ที่ Desktop 1440 × 1000 และ Mobile 393 × 852 px และ View Store | ผ่าน |
| ค้นหา/ไม่พบสินค้า/กรอง/เลือกเรียงราคา/Detail/เพิ่ม Cart/เพิ่มลดจำนวน/ลบ/Profile save | ผ่าน |
| React runtime errors และตรวจข้อมูลเดิมหลังทดสอบ | ไม่พบ error และข้อมูลเดิมตรงกับ backup |
| `npm run lint` | ผ่าน exit 0 |
| `npm run build` | ผ่าน exit 0 |

Mobile 393 × 852 px วาง Sidebar ด้านบนตาม custom breakpoint `md=801px` และ Summary เป็น 1 คอลัมน์ ส่วน Desktop 1440 × 1000 px วาง Sidebar ด้านข้างและ Summary เป็น 3 คอลัมน์ ปุ่ม Edit/Delete อยู่ในตารางที่เลื่อนแนวนอนได้ และตรวจคลิก Edit หลังเลื่อนไปยังคอลัมน์ปุ่มแล้ว

### ภาพหลักฐาน

ถ่ายภาพใหม่หลังเอาลูกศรตกแต่ง เงาปุ่มสีดำ และแอนิเมชัน popup ออก โดยแทนภาพ Week 11 เดิมทั้งหมด เหลือเฉพาะ **Desktop 1440 × 1000 px** และ **Mobile 393 × 852 px** ภาพมีขนาดตรงกับ viewport และไม่ได้ถ่ายแบบเต็มหน้า เนื้อหาแนวตั้ง ตาราง และ Modal อาจต้องเลื่อนเพื่อดูทั้งหมด

| หน้า / สถานะ | Desktop 1440 × 1000 | Mobile 393 × 852 |
| --- | --- | --- |
| Dashboard Light | [เปิดภาพ](week-11/desktop-dashboard-light.png) | [เปิดภาพ](week-11/mobile-dashboard-light.png) |
| Dashboard Dark | [เปิดภาพ](week-11/desktop-dashboard-dark.png) | [เปิดภาพ](week-11/mobile-dashboard-dark.png) |
| Products Light | [เปิดภาพ](week-11/desktop-products-light.png) | [เปิดภาพ](week-11/mobile-products-light.png) |
| Products Dark | [เปิดภาพ](week-11/desktop-products-dark.png) | [เปิดภาพ](week-11/mobile-products-dark.png) |
| Modal Light | [เปิดภาพ](week-11/desktop-modal-light.png) | [เปิดภาพ](week-11/mobile-modal-light.png) |
| Modal Dark | [เปิดภาพ](week-11/desktop-modal-dark.png) | [เปิดภาพ](week-11/mobile-modal-dark.png) |
| Profile หน้าร้านหลังกลับจากธีมมืด | [เปิดภาพ](week-11/desktop-storefront-profile.png) | [เปิดภาพ](week-11/mobile-storefront-profile.png) |

ภาพสถานะทดสอบเพิ่มเติมใช้ขนาด Desktop 1440 × 1000 px:

- CRUD: [Create](week-11/desktop-03-created.png), [Dashboard หลังเพิ่ม](week-11/desktop-04-dashboard-after-create.png), [Update](week-11/desktop-05-updated.png), [Delete](week-11/desktop-06-deleted.png)
- Validation/Empty: [Validation](week-11/desktop-02-validation.png), [Dashboard ว่าง](week-11/desktop-07-empty-dashboard.png), [Products ว่าง](week-11/desktop-08-empty-products.png)
- API Error: [Dashboard เมื่อหยุด API](week-11/desktop-09-api-stopped-dashboard.png), [Products เมื่อหยุด API](week-11/desktop-10-api-stopped-products.png), [คงข้อมูลฟอร์มเมื่อบันทึกล้มเหลว](week-11/desktop-11-save-error-retains-form.png)

### รันทดสอบซ้ำ

สคริปต์เป็นเครื่องมือเสริม ไม่จำเป็นต่อการเปิดเว็บ ต้องมี Chrome และติดตั้ง Playwright ใน `minishop-react` หรือกำหนด environment `MINISHOP_PLAYWRIGHT` เป็น path โมดูล Playwright ที่มีอยู่แล้ว เช่นเครื่องทดสอบนี้ใช้โมดูลจาก runtime ที่เตรียมไว้

หากต้องติดตั้งเพื่อทดสอบโดยไม่แก้ package/lockfile ของโปรเจกต์:

```bash
cd minishop-react
npm install --no-save --package-lock=false playwright
cd ..
node docs/week-11/verify.cjs
```

ต้องให้พอร์ต 13001 และ 15173 ว่าง สคริปต์จะเปิด/ปิดเฉพาะเซิร์ฟเวอร์ที่สร้างเอง ใช้สำเนาของ backup ก่อน CRUD บันทึกภาพ/ผลทดสอบ และลบไฟล์ฐานข้อมูลสำเนาเมื่อจบ ส่วน `npm run lint` และ `npm run build` รันแยกจากโฟลเดอร์ `minishop-react`

## ขอบเขตที่ยังไม่ได้ตรวจ

ยังไม่ได้ทดสอบบนอุปกรณ์มือถือจริง, Safari/Firefox หรือคีย์บอร์ดเสมือนบนมือถือ การตรวจ Responsive เป็นการปรับ viewport ของ Chrome บน Windows และ HTTP 500 ใช้ response จำลอง ส่วนการหยุด/เปิด API และ CRUD ใช้ JSON Server จริง การเลือกเรียงราคาหน้าร้านตรวจว่า control ทำงานต่อได้ แต่ไม่ได้เทียบลำดับสินค้าทุกแถวกับราคาในชุดทดสอบนี้

ยังไม่มีระบบ authentication/authorization เพราะปุ่ม Switch to Admin เป็นทางเข้า UI ของงานใบนี้ ข้อมูลตะกร้าและโปรไฟล์ยังเก็บใน React State และเริ่มใหม่เมื่อ refresh ตามของเดิม
