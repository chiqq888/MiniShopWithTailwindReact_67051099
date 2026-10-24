import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

function Layout({ cartCount, onOpenCart }) {
  return (
    <div data-theme="light" className="flex min-h-screen flex-col">
      <a
        className="fixed -top-20 left-5 z-20 rounded-shop bg-shop-ink p-3 text-white focus:top-2.5"
        href="#main"
      >
        ข้ามไปยังเนื้อหา
      </a>
      <Navbar cartCount={cartCount} onOpenCart={onOpenCart} />
      <main id="main" className="mx-auto w-[90%] max-w-[1320px] flex-1">
        <Outlet />
      </main>
      <div className="mx-auto w-[90%] max-w-[1320px]">
        <Footer />
      </div>
    </div>
  );
}

export default Layout;
