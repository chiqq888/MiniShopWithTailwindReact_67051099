import { useEffect, useState } from "react";
import { Link, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import About from "./pages/About";
import ProfilePage from "./pages/ProfilePage";
import ProductCatalog from "./components/ProductCatalog";
import ProductDetail from "./components/ProductDetail";
import Cart from "./components/Cart";
import Toast from "./components/Toast";

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reload, setReload] = useState(0);
  const [cart, setCart] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [cartOpen, setCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    let active = true;

    async function loadProducts() {
      try {
        const response = await fetch("https://fakestoreapi.com/products", {
          signal: controller.signal,
        });
        if (!response.ok) throw new Error("ไม่สามารถโหลดข้อมูลได้");

        const data = await response.json();
        if (!Array.isArray(data)) throw new Error("ข้อมูลสินค้าไม่ถูกต้อง");
        if (active) setProducts(data);
      } catch {
        if (active) setError("ไม่สามารถโหลดข้อมูลได้");
      } finally {
        if (active) setLoading(false);
      }
    }
    loadProducts();
    return () => {
      active = false;
      controller.abort();
    };
  }, [reload]);

  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(""), 2800);
    return () => clearTimeout(timer);
  }, [notice]);

  function retry() {
    setError("");
    setLoading(true);
    setReload((value) => value + 1);
  }

  function openCart() {
    setCartOpen(true);
  }
  function closeCart() {
    setCartOpen(false);
  }
  function closeDetail() {
    setSelectedProduct(null);
  }
  function closeNotice() {
    setNotice("");
  }

  function addToCart(product) {
    setCart(function (items) {
      const exists = items.some((item) => item.id === product.id);
      if (!exists) return [...items, { ...product, quantity: 1 }];

      return items.map(function (item) {
        if (item.id === product.id)
          return { ...item, quantity: item.quantity + 1 };
        return item;
      });
    });
    setCartCount((count) => count + 1);
    setNotice(`เพิ่ม ${product.title} ลงตะกร้าแล้ว`);
  }

  function changeQuantity(id, delta) {
    setCart(function (items) {
      const updatedItems = items.map(function (item) {
        if (item.id === id) return { ...item, quantity: item.quantity + delta };
        return item;
      });
      return updatedItems.filter((item) => item.quantity > 0);
    });
    setCartCount((count) => count + delta);
  }

  function removeItem(item) {
    setCart((items) => items.filter((product) => product.id !== item.id));
    setCartCount((count) => count - item.quantity);
  }

  const catalog = (
    <ProductCatalog
      products={products}
      loading={loading}
      error={error}
      onRetry={retry}
      onAddToCart={addToCart}
      onViewDetail={setSelectedProduct}
    />
  );

  return (
    <>
      <Routes>
        <Route element={<Layout cartCount={cartCount} onOpenCart={openCart} />}>
          <Route
            index
            element={
              <Home products={products} cartCount={cartCount} onOpenCart={openCart}>
                {catalog}
              </Home>
            }
          />
          <Route path="about" element={<About />} />
          <Route
            path="products"
            element={
              <div className="pt-10 sm:pt-14">
                <h1 className="mb-6 text-2xl font-medium">Products</h1>
                {catalog}
              </div>
            }
          />
          <Route path="profile" element={<ProfilePage />} />
          <Route
            path="*"
            element={
              <section className="py-20 text-center">
                <h1 className="text-2xl font-medium">404 — ไม่พบหน้าที่ต้องการ</h1>
                <Link to="/" className="mt-4 inline-block underline underline-offset-4">
                  กลับหน้าหลัก
                </Link>
              </section>
            }
          />
        </Route>
      </Routes>
      {selectedProduct && (
        <ProductDetail
          product={selectedProduct}
          onClose={closeDetail}
          onAddToCart={addToCart}
        />
      )}
      {cartOpen && (
        <Cart
          items={cart}
          cartCount={cartCount}
          onClose={closeCart}
          onChangeQuantity={changeQuantity}
          onRemove={removeItem}
        />
      )}
      <Toast message={notice} onClose={closeNotice} />
    </>
  );
}
export default App;
