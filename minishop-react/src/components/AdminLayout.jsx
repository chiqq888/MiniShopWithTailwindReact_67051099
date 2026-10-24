import { Link, NavLink, Outlet } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";

const adminLinks = [
  { to: "/admin/dashboard", label: "Dashboard", icon: "dashboard" },
  { to: "/admin/products", label: "Products", icon: "products" },
];

function AdminIcon({ name, className = "size-5" }) {
  return (
    <svg aria-hidden="true" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      {name === "dashboard" ? (
        <>
          <rect x="3" y="3" width="7" height="7" rx="1.5" />
          <rect x="14" y="3" width="7" height="7" rx="1.5" />
          <rect x="3" y="14" width="7" height="7" rx="1.5" />
          <rect x="14" y="14" width="7" height="7" rx="1.5" />
        </>
      ) : (
        <>
          <path d="m12 3 9 5v9l-9 5-9-5V8l9-5Z" />
          <path d="m3 8 9 5 9-5m-9 5v9M7.5 5.5l9 5" />
        </>
      )}
    </svg>
  );
}

function AdminLayout() {
  return (
    <div className="admin-shell min-h-screen bg-base-200 text-base-content">
      <header className="border-b border-base-300 bg-base-100">
        <div className="navbar mx-auto max-w-[1440px] min-h-20 flex-wrap justify-between gap-3 px-4 py-3 lg:px-8">
          <Link to="/admin/dashboard" className="flex min-h-11 items-center gap-2 text-sm font-semibold tracking-[-.4px] sm:text-lg" aria-label="MiniShop Admin Dashboard">
            <span className="grid size-8 shrink-0 place-items-center rounded-full bg-neutral text-neutral-content">
              <AdminIcon name="products" className="size-[18px]" />
            </span>
            MiniShop Admin
          </Link>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link to="/" className="btn btn-outline min-h-11 border-base-300 bg-base-100 px-3 text-xs font-medium text-base-content hover:border-base-content hover:bg-base-200 sm:px-4 sm:text-sm">
              View Store
            </Link>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-[1440px] items-start gap-5 px-4 py-6 md:grid-cols-[220px_minmax(0,1fr)] md:gap-6 lg:px-8 lg:py-8">
        <aside className="rounded-shop border border-base-300 bg-base-100 p-3 md:p-4">
          <p className="mb-4 hidden px-3 text-[10px] tracking-[2px] text-base-content/60 md:block">ADMIN WORKSPACE</p>
          <nav aria-label="Admin navigation">
            <ul className="menu w-full flex-row gap-2 p-0 md:flex-col">
              {adminLinks.map(({ to, label, icon }) => (
                <li key={to} className="min-w-0 flex-1 md:flex-none">
                  <NavLink
                    to={to}
                    className={({ isActive }) => `flex min-h-11 items-center justify-center gap-2 rounded-shop px-3 py-3 text-sm transition-colors md:justify-start ${isActive ? "bg-neutral text-neutral-content hover:bg-neutral hover:text-neutral-content" : "text-base-content hover:bg-base-200"}`}
                  >
                    <AdminIcon name={icon} />
                    {label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
          <p className="mt-6 hidden border-t border-base-300 px-3 pt-5 text-xs leading-6 text-base-content/60 md:block">จัดการข้อมูลสินค้าและดูภาพรวมของ MiniShop ได้ที่นี่</p>
        </aside>
        <main className="min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
