import { Link } from "react-router-dom";
import Hero from "../components/Hero";
import ShopStats from "../components/ShopStats";
import ProductList from "../components/ProductList";

function Home({ products, cartCount, onOpenCart, onAddToCart, onViewDetail }) {
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
      <section id="catalog" className="scroll-mt-6" aria-labelledby="featured-title">
        <div className="mb-6 flex items-center justify-between gap-4">
          <h2 id="featured-title" className="text-2xl font-medium">Featured Products</h2>
          <Link to="/products" className="text-sm underline underline-offset-4">
            ดูสินค้าทั้งหมด
          </Link>
        </div>
        <ProductList
          products={products.slice(0, 4)}
          onAddToCart={onAddToCart}
          onViewDetail={onViewDetail}
        />
      </section>
    </>
  );
}

export default Home;
