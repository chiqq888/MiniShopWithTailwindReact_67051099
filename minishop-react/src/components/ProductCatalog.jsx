import { useState } from "react";
import Icon from "./Icon";
import ProductList from "./ProductList";

function ProductCatalog({
  products,
  onAddToCart,
  onViewDetail,
}) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("default");

  const categories = ["All"];
  for (const product of products) {
    if (!categories.includes(product.category))
      categories.push(product.category);
  }

  function resetFilters() {
    setSearch("");
    setCategory("All");
    setSort("default");
  }

  function matchesFilters(product) {
    const matchesSearch = product.title
      .toLowerCase()
      .includes(search.trim().toLowerCase());
    const matchesCategory = category === "All" || product.category === category;
    return matchesSearch && matchesCategory;
  }

  const filteredProducts = products.filter(matchesFilters);
  if (sort === "asc") filteredProducts.sort((a, b) => a.price - b.price);
  if (sort === "desc") filteredProducts.sort((a, b) => b.price - a.price);

  function getCategoryCount(item) {
    if (item === "All") return products.length;
    return products.filter((product) => product.category === item).length;
  }

  function getCategoryClass(item) {
    if (category === item) return "border-shop-ink bg-shop-ink text-white";
    return "border-[#e0e0e0] bg-white text-[#696969] hover:bg-[#f4f4f4]";
  }

  function renderProducts() {
    if (filteredProducts.length === 0) {
      return (
        <div className="rounded-shop border border-dashed border-[#cfcfcf] bg-white px-5 py-[65px] text-center">
          <Icon
            name="search"
            className="mx-auto mb-[15px] size-[45px] opacity-50"
          />
          <h3 className="text-xl font-medium">ไม่พบสินค้าที่ค้นหา</h3>
          <p className="mt-[7px] mb-[22px] text-sm text-shop-muted">
            ลองใช้คำค้นอื่น หรือเลือกหมวดหมู่ทั้งหมด
          </p>
          <button
            type="button"
            onClick={resetFilters}
            className="
              inline-flex min-h-[46px] items-center justify-center gap-3
              rounded-shop border border-shop-ink bg-shop-ink px-[18px] py-2.5
              font-medium text-white transition-colors duration-200
              hover:bg-[#454545] motion-reduce:transition-none
            "
          >
            ดูสินค้าทั้งหมด
          </button>
        </div>
      );
    }
    return (
      <ProductList
        products={filteredProducts}
        onAddToCart={onAddToCart}
        onViewDetail={onViewDetail}
      />
    );
  }

  return (
    <section
      id="catalog"
      className="scroll-mt-6"
      aria-labelledby="catalog-title"
    >
      <div className="mb-[23px] flex items-end justify-between gap-[15px]">
        <div>
          <p className="text-[11px] font-medium tracking-[2px] text-[#717171]">
            FIND YOUR NEXT FAVORITE
          </p>
          <h2
            id="catalog-title"
            className="mt-1.5 text-2xl font-medium sm:text-[27px]"
          >
            สินค้าทั้งหมด{" "}
            <span className="ml-2 inline-block min-w-[30px] rounded-lg bg-[#e8e8e8] text-center align-middle text-[13px] leading-[26px]">
              {products.length}
            </span>
          </h2>
        </div>
        <p className="hidden text-sm text-shop-muted sm:block">
          ของที่ชอบ ในแบบที่เป็นคุณ
        </p>
      </div>

      <div className="rounded-shop border border-[#e3e3e3] bg-white p-4 sm:p-[22px]">
        <div className="flex flex-col gap-3.5 md:flex-row md:gap-[18px]">
          <div className="flex min-w-0 flex-1 items-center gap-2 rounded-shop border border-shop-border bg-[#fafafa] px-2.5 sm:gap-3 sm:px-[15px]">
            <Icon name="search" />
            <input
              className="w-full min-w-0 border-0 bg-transparent py-[13px] text-sm text-shop-ink placeholder:text-[#858585] sm:text-base"
              type="search"
              aria-label="ค้นหาสินค้า"
              placeholder="ค้นหาสินค้า เช่น Backpack, Shirt..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
          <label className="flex items-center justify-between gap-2.5 text-sm whitespace-nowrap text-[#777]">
            <span>เรียงตาม</span>
            <span className="relative min-w-0 flex-1 md:w-[245px] md:flex-none">
              <select
                className="w-full min-w-0 appearance-none rounded-shop border border-shop-border bg-white py-[13px] pr-11 pl-[15px] text-sm text-[#303030]"
                aria-label="เรียงราคาสินค้า"
                value={sort}
                onChange={(event) => setSort(event.target.value)}
              >
                <option value="default">แนะนำสำหรับคุณ</option>
                <option value="asc">Sort Price Low → High</option>
                <option value="desc">Sort Price High → Low</option>
              </select>
              <svg
                className="pointer-events-none absolute top-1/2 right-4 size-3.5 -translate-y-1/2 text-[#303030]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </span>
          </label>
        </div>
        <div
          className="mt-[18px] flex flex-wrap gap-2 sm:gap-2.5"
          role="group"
          aria-label="กรองหมวดหมู่สินค้า"
        >
          {categories.map((item) => (
            <button
              key={item}
              className={`group flex items-center gap-2 rounded-shop border px-[11px] py-2 text-xs sm:gap-3 sm:px-3.5 sm:text-sm ${getCategoryClass(item)}`}
              aria-pressed={category === item}
              onClick={() => setCategory(item)}
            >
              <span className="leading-none">
                {item === "All" ? "All · ทั้งหมด" : item}
              </span>
              <span className="inline-flex h-5 min-w-5 shrink-0 items-center justify-center text-[11px] leading-none tabular-nums text-[#929292] group-aria-pressed:text-[#bfbfbf]">
                <span className="inline-block translate-y-0.5">
                  {getCategoryCount(item)}
                </span>
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex min-h-[66px] items-center justify-between text-[13px] text-shop-muted">
        <p aria-live="polite">
          แสดง{" "}
          <strong className="text-shop-ink">{filteredProducts.length}</strong>{" "}
          จาก {products.length} รายการ
        </p>
        {(search || category !== "All" || sort !== "default") && (
          <button
            className="rounded-shop p-[7px] text-[13px] text-[#5d5d5d] underline underline-offset-4"
            onClick={resetFilters}
          >
            ล้างตัวกรอง ↺
          </button>
        )}
      </div>
      {renderProducts()}
    </section>
  );
}
export default ProductCatalog;
