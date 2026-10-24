import Hero from "../components/Hero";
import ShopStats from "../components/ShopStats";

function Home({ products, cartCount, onOpenCart, children }) {
  return (
    <>
      <div className="mt-[26px] mb-[26px] flex items-center justify-between gap-4 sm:mt-[38px]">
        <div>
          <p className="text-[11px] font-medium tracking-[2px] text-[#717171]">
            YOUR EVERYDAY, SIMPLIFIED
          </p>
          <h1 className="mt-[7px] text-xl font-medium tracking-[-.5px] sm:text-2xl">
            เลือกสิ่งที่ใช่ ให้ทุกวันของคุณ
          </h1>
        </div>
        <span className="hidden text-[11px] tracking-[2px] text-[#777] md:inline">
          MINISHOP / 2026
        </span>
      </div>
      <Hero />
      <ShopStats products={products} cartCount={cartCount} onOpenCart={onOpenCart} />
      {children}
    </>
  );
}

export default Home;
