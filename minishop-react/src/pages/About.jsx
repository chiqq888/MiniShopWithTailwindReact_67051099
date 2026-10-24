import { Link } from "react-router-dom";
import Icon from "../components/Icon";
import backpack from "../assets/hero-backpack-cutout.png";
import { getProducts } from "../models/productModel";

const features = [
  { icon: "search", title: "เจอของที่ใช่ได้ง่ายขึ้น", text: "ค้นหาจากชื่อ เลือกหมวดหมู่ที่สนใจ แล้วเรียงราคาเพื่อเปรียบเทียบในแบบของคุณ" },
  { icon: "documents", title: "รู้จักก่อนเลือก", text: "ดูรายละเอียด ราคา และคะแนนรีวิวของสินค้าได้ครบในหน้าเดียว" },
  { icon: "cart", title: "เก็บสิ่งที่ชอบไว้ด้วยกัน", text: "เพิ่มสินค้าลงตะกร้า ปรับจำนวน และดูยอดรวมได้ระหว่างเลือกดูสินค้า" },
];

function About() {
  const products = getProducts();
  const categoryCount = new Set(products.map((product) => product.category)).size;

  return (
    <section className="py-10 sm:py-14" aria-labelledby="about-title">
      <div className="mb-7 flex items-center justify-between gap-4 text-[11px] tracking-[2px] text-shop-muted">
        <p>GET TO KNOW MINISHOP</p>
        <span className="hidden sm:inline">LESS NOISE. MORE EVERYDAY.</span>
      </div>

      <div className="grid overflow-hidden rounded-shop border border-shop-border bg-[#ededed] md:grid-cols-[1.2fr_1fr]">
        <div className="p-7 sm:p-10 lg:p-12">
          <span className="inline-flex items-center gap-2 text-xs text-[#666]">
            <span className="size-1.5 rounded-full bg-shop-ink" /> เกี่ยวกับ MiniShop
          </span>
          <h1 id="about-title" className="mt-6 text-4xl leading-[1.3] font-semibold tracking-[-1.5px] sm:text-5xl">
            ของที่ชอบ.<br />ในพื้นที่ที่เรียบง่าย<span className="text-[#999]">.</span>
          </h1>
          <p className="mt-5 max-w-lg text-sm leading-8 text-[#666]">
            บางครั้ง สิ่งที่ทำให้วันธรรมดาดีขึ้นก็เป็นแค่ของชิ้นเล็ก ๆ
            MiniShop รวมของใช้ เทคโนโลยี และไลฟ์สไตล์ไว้ด้วยกัน
            ให้คุณค่อย ๆ เลือกสิ่งที่เข้ากับทุกวันของตัวเอง
          </p>
          <Link to="/products" className="mt-7 inline-flex min-h-11 items-center gap-6 rounded-shop bg-shop-ink px-5 py-3 text-sm text-white transition-colors hover:bg-[#454545]">
            สำรวจสินค้าทั้งหมด <span aria-hidden="true">↗</span>
          </Link>
        </div>
        <div className="relative grid min-h-[280px] place-items-center bg-shop-surface p-8">
          <span className="absolute top-6 left-7 text-[10px] tracking-[2px] text-shop-muted">MADE FOR YOUR EVERYDAY</span>
          <img src={backpack} alt="กระเป๋าเป้สีเบจสำหรับใช้ในชีวิตประจำวัน" className="h-64 w-full object-contain sm:h-80" />
          <span className="absolute right-7 bottom-6 text-[10px] tracking-[2px] text-shop-muted">SIMPLE / USEFUL / EVERYDAY</span>
        </div>
      </div>

      <div className="my-8 grid grid-cols-3 divide-x divide-shop-border rounded-shop border border-shop-border bg-white py-6 sm:my-10 sm:py-8">
        {[{ value: products.length, label: "สินค้าที่รอให้ค้นพบ" }, { value: categoryCount, label: "หมวดหมู่ให้เลือกดู" }, { value: "01", label: "พื้นที่รวมสิ่งที่ชอบ" }].map(({ value, label }) => (
          <div key={label} className="px-2 text-center">
            <p className="text-3xl font-medium tracking-tight sm:text-4xl">{value}</p>
            <p className="mt-2 text-[10px] text-shop-muted sm:text-xs">{label}</p>
          </div>
        ))}
      </div>

      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <p className="text-[11px] tracking-[2px] text-shop-muted">SMALL DETAILS, BETTER EXPERIENCE</p>
          <h2 className="mt-2 text-2xl font-medium">เลือกดูได้ ในจังหวะของคุณ</h2>
        </div>
        <span className="hidden text-xs text-shop-muted sm:block">เรียบง่ายตั้งแต่เริ่มดู จนเจอสิ่งที่ชอบ</span>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {features.map(({ icon, title, text }, index) => (
          <article key={title} className="rounded-shop border border-shop-border bg-white p-6 sm:p-7">
            <div className="mb-6 flex items-center justify-between">
              <span className="grid size-11 place-items-center rounded-shop bg-shop-surface"><Icon name={icon} /></span>
              <span className="text-xs text-[#aaa]">0{index + 1}</span>
            </div>
            <h3 className="text-lg font-medium">{title}</h3>
            <p className="mt-3 text-sm leading-7 text-shop-muted">{text}</p>
          </article>
        ))}
      </div>

      <div className="mt-8 grid gap-6 rounded-shop border border-shop-border p-6 sm:mt-10 sm:p-8 md:grid-cols-[1fr_1.5fr] md:gap-12">
        <div>
          <p className="text-[11px] tracking-[2px] text-shop-muted">A LITTLE BACKSTORY</p>
          <h2 className="mt-2 text-xl font-medium">จากการเรียนรู้<br />สู่ร้านค้าเล็ก ๆ บนเว็บ</h2>
        </div>
        <div className="text-sm leading-8 text-shop-muted">
          <p>MiniShop เป็นโปรเจกต์ฝึกพัฒนาเว็บไซต์ด้วย React ตั้งแต่การจัดหน้าร้าน ไปจนถึงการค้นหาและตะกร้าสินค้า โดยตั้งใจให้ทุกส่วนใช้งานต่อกันได้อย่างเป็นธรรมชาติ</p>
          <p className="mt-3">สินค้าทั้งหมดเป็นข้อมูลตัวอย่างจาก Fake Store API ที่บันทึกไว้ในโปรเจกต์ คุณสามารถทดลองเลือกสินค้าและจัดตะกร้าได้ โดยไม่มีการสั่งซื้อหรือชำระเงินจริง</p>
          <Link to="/profile" className="mt-4 inline-flex items-center gap-3 font-medium text-shop-ink underline underline-offset-4">ไปโปรไฟล์ของฉัน <span aria-hidden="true">↗</span></Link>
        </div>
      </div>
    </section>
  );
}

export default About;
