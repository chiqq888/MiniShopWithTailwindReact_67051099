import { useEffect, useRef, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import Icon from "./Icon";
import profileIcon from "../assets/user-circle-svgrepo-com.svg";

const links = [
  { to: "/", label: "Home" },
  { to: "/products", label: "Products" },
  { to: "/admin/products", label: "Manage Products" },
  { to: "/about", label: "About" },
];

function Navbar({ cartCount, onOpenCart }) {
  const headerRef = useRef(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const floatingShadow = isScrolled ? "shadow-lg shadow-black/10" : "";

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setIsScrolled(!entry.isIntersecting);
    });
    observer.observe(headerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <>
    <div ref={headerRef} className="absolute top-0 h-16 w-px pointer-events-none" aria-hidden="true" />
    <header
      className={`sticky top-0 z-30 flex min-h-16 flex-wrap items-center justify-between gap-2 border-b px-[max(5%,calc((100vw-1320px)/2))] py-2 sm:flex-nowrap ${
        isScrolled
          ? "pointer-events-none border-transparent bg-transparent"
          : "border-[#e5e5e5] bg-white"
      }`}
    >
      <Link
        className={`flex min-h-11 items-center gap-2 text-xl font-semibold tracking-[-.5px] ${isScrolled ? "invisible" : ""}`}
        to="/"
        aria-label="MiniShop กลับหน้าหลัก"
      >
        <span className="grid size-8 place-items-center rounded-full bg-[#202020]">
          <Icon name="box" className="size-[18px]" white />
        </span>
        <span>
          MiniShop
          <sup className="ml-0.5 align-top text-[9px] leading-[2.5]">®</sup>
        </span>
      </Link>
      <nav
        aria-label="เมนูหลัก"
        className="pointer-events-auto order-last flex w-full flex-wrap justify-center gap-2 sm:order-none sm:ml-auto sm:w-auto"
      >
        {links.map(({ to, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            className={({ isActive }) =>
              `flex min-h-11 items-center justify-center rounded-shop border px-3 py-[7px] text-xs transition-colors motion-reduce:transition-none ${
                isActive
                  ? "border-shop-ink bg-shop-ink text-white"
                  : "border-shop-border bg-white text-shop-ink hover:bg-shop-surface"
              } ${floatingShadow}`
            }
          >
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="pointer-events-auto ml-auto flex shrink-0 items-center gap-2 sm:ml-0">
        <button
          className={`flex min-h-11 items-center gap-2 rounded-shop border border-shop-border bg-white px-3 py-[7px] text-xs transition-colors hover:bg-shop-surface motion-reduce:transition-none ${floatingShadow}`}
          aria-label={`เปิดตะกร้า ${cartCount} ชิ้น`}
          onClick={onOpenCart}
        >
          <Icon name="cart" className="size-[18px]" />
          <span className="hidden leading-none md:inline">ตะกร้า</span>
          <span
            className="inline-flex h-5 min-w-5 shrink-0 items-center justify-center rounded-md bg-shop-ink px-1 text-[11px] leading-none tabular-nums text-white"
            aria-live="polite"
          >
            <span className="inline-block translate-y-0.5">{cartCount}</span>
          </span>
        </button>
        <NavLink
          to="/profile"
          aria-label="Profile"
          title="Profile"
          className={({ isActive }) =>
            `grid size-11 place-items-center rounded-shop border transition-colors motion-reduce:transition-none ${
              isActive
                ? "border-shop-ink bg-shop-ink"
                : "border-shop-border bg-white hover:bg-shop-surface"
            } ${floatingShadow}`
          }
        >
          {({ isActive }) => (
            <img
              src={profileIcon}
              alt=""
              className={`size-7 ${isActive ? "brightness-0 invert" : ""}`}
            />
          )}
        </NavLink>
      </div>
    </header>
    </>
  );
}
export default Navbar;
