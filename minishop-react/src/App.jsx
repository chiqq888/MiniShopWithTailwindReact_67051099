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
import { getProducts } from "./models/productModel";

function App() {
  const products = getProducts();
  const [cart, setCart] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [cartOpen, setCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(""), 2800);
    return () => clearTimeout(timer);
  }, [notice]);

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
