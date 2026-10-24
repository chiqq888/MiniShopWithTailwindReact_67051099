import { useState } from "react";
import { Link } from "react-router-dom";
import Icon from "../components/Icon";
import userIcon from "../assets/user-rounded-svgrepo-com.svg";

function Profile({ user, onSaveUser, cart, cartCount, onOpenCart }) {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const currency = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

  function saveProfile(event) {
    event.preventDefault();
    onSaveUser({ name: name.trim(), email: email.trim() });
  }

  return (
    <section className="py-10 sm:py-14" aria-labelledby="profile-title">
      <div className="mb-7 flex items-center justify-between text-[11px] tracking-[2px] text-shop-muted">
        <p>YOUR MINISHOP SPACE</p><span>MY ACCOUNT</span>
      </div>
      <div className="grid items-start gap-6 lg:grid-cols-[340px_minmax(0,1fr)] lg:gap-8">
        <aside className="overflow-hidden rounded-shop border border-shop-border bg-white lg:self-stretch">
          <div className="relative flex min-h-[260px] flex-col items-center justify-center bg-shop-ink px-6 py-10 text-white">
            <span className="absolute top-5 left-6 text-[10px] tracking-[2px] text-white/50">YOUR PROFILE</span>
            <div className="grid size-28 place-items-center rounded-full border border-white/25 bg-white/5">
              <img src={userIcon} alt="" className="size-16 brightness-0 invert" />
            </div>
            <p className="mt-5 max-w-full text-center text-xl font-medium wrap-anywhere">{user.name}</p>
            <span className="mt-2 text-xs text-white/60">บัญชีตัวอย่าง</span>
          </div>
          <div className="p-6">
            <p className="text-[11px] tracking-[2px] text-shop-muted">ACCOUNT OVERVIEW</p>
            <dl className="mt-5 space-y-5 text-sm">
              <div><dt className="text-xs text-shop-muted">ชื่อที่แสดง</dt><dd className="mt-1 font-medium wrap-anywhere">{user.name}</dd></div>
              <div><dt className="text-xs text-shop-muted">อีเมล</dt><dd className="mt-1 wrap-anywhere">{user.email}</dd></div>
              <div className="border-t border-shop-border pt-5"><dt className="text-xs text-shop-muted">สถานะบัญชี</dt><dd className="mt-2 inline-flex rounded-full bg-shop-surface px-3 py-1 text-xs">โหมดทดลองใช้งาน</dd></div>
            </dl>
            <p className="mt-6 text-xs leading-6 text-shop-muted">ทดลองแก้ไขข้อมูลและจัดตะกร้าของคุณได้ ข้อมูลจะอยู่ระหว่างใช้งานเว็บและเริ่มใหม่เมื่อรีเฟรชหน้า</p>
          </div>
        </aside>
        <div className="min-w-0">
          <div className="rounded-shop border border-shop-border bg-white p-6 sm:p-9">
            <p className="text-[11px] tracking-[2px] text-shop-muted">PERSONAL INFORMATION</p>
            <h1 id="profile-title" className="mt-3 text-3xl font-semibold tracking-[-1px] sm:text-4xl">โปรไฟล์ของฉัน<span className="text-[#aaa]">.</span></h1>
            <p className="mt-3 text-sm leading-7 text-shop-muted">พื้นที่เล็ก ๆ สำหรับข้อมูลของคุณ และสิ่งที่เลือกไว้ใน MiniShop</p>
            <form onSubmit={saveProfile} className="mt-7">
              <div className="grid gap-5 sm:grid-cols-2">
                <label className="block text-sm">ชื่อที่แสดง
                  <input value={name} onChange={(event) => setName(event.target.value)} required maxLength={60} pattern=".*\S.*" autoComplete="nickname" className="mt-2 min-h-11 w-full rounded-shop border border-shop-border bg-shop-surface px-4 py-3 text-sm" />
                </label>
                <label className="block text-sm">อีเมล
                  <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required autoComplete="email" className="mt-2 min-h-11 w-full rounded-shop border border-shop-border bg-shop-surface px-4 py-3 text-sm" />
                </label>
              </div>
              <div className="mt-6 flex flex-wrap items-center gap-4">
                <button type="submit" className="min-h-11 rounded-shop bg-shop-ink px-5 py-3 text-sm text-white transition-colors hover:bg-[#454545]">บันทึกข้อมูล</button>
                <p className="text-xs text-shop-muted">ข้อมูลตัวอย่างสำหรับทดลองใช้งาน</p>
              </div>
            </form>
          </div>
          <div className="mt-7 rounded-shop border border-shop-border bg-white p-6 sm:p-9">
            <div className="flex items-center justify-between gap-4">
              <div><p className="text-[11px] tracking-[2px] text-shop-muted">YOUR SHOPPING BAG</p><h2 className="mt-2 text-xl font-medium">ตะกร้าของคุณ</h2></div>
              <span className="grid size-11 shrink-0 place-items-center rounded-shop bg-shop-surface"><Icon name="cart" /></span>
            </div>
            <dl className="mt-6 grid grid-cols-3 divide-x divide-shop-border">
              {[{ label: "รายการ", value: cart.length }, { label: "จำนวนชิ้น", value: cartCount }, { label: "ยอดรวม", value: currency.format(total) }].map(({ label, value }) => (
                <div key={label} className="min-w-0 px-2 text-center first:pl-0 last:pr-0"><dt className="text-xs text-shop-muted">{label}</dt><dd className="mt-2 text-lg font-medium wrap-anywhere sm:text-2xl">{value}</dd></div>
              ))}
            </dl>
            <p className="mt-6 text-sm leading-7 text-shop-muted">{cartCount > 0 ? "สิ่งที่คุณเลือกไว้ยังอยู่ในตะกร้า เปิดดูเพื่อปรับจำนวนหรือจัดรายการต่อได้เลย" : "ตะกร้ายังว่างอยู่ ลองเลือกสิ่งที่ชอบจากหน้าร้าน แล้วกลับมาดูสรุปได้ที่นี่"}</p>
            <button type="button" onClick={onOpenCart} className="mt-5 min-h-11 rounded-shop border border-shop-border bg-white px-5 py-3 text-sm transition-colors hover:bg-shop-surface">เปิดตะกร้า</button>
          </div>
        </div>
      </div>
      <div className="mt-8 flex flex-col justify-between gap-5 rounded-shop border border-shop-border bg-[#ededed] p-6 sm:flex-row sm:items-center sm:p-8">
        <div><p className="text-[11px] tracking-[2px] text-shop-muted">FIND YOUR NEXT FAVORITE</p><h2 className="mt-2 text-xl font-medium">มีอะไรที่ถูกใจอีกไหม?</h2><p className="mt-2 text-sm text-shop-muted">กลับไปเลือกดูสินค้า แล้วเก็บสิ่งที่ชอบไว้ในตะกร้า</p></div>
        <Link to="/products" className="inline-flex min-h-11 shrink-0 items-center justify-center gap-6 self-start rounded-shop bg-shop-ink px-5 py-3 text-sm text-white transition-colors hover:bg-[#454545] sm:self-auto">เลือกดูสินค้า <span aria-hidden="true">↗</span></Link>
      </div>
    </section>
  );
}

export default Profile;
