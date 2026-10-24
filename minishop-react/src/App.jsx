import { useEffect, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import About from "./pages/About";
import Profile from "./pages/Profile";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import ProductManagement from "./pages/ProductManagement";
import NotFound from "./pages/NotFound";
import Cart from "./components/Cart";
import Toast from "./components/Toast";
import { getProducts } from "./models/productModel";

function App() {
  const navigate = useNavigate();
  const products = getProducts();
  const [cart, setCart] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [cartOpen, setCartOpen] = useState(false);
  const [notice, setNotice] = useState("");
  const [user, setUser] = useState({ name: "MiniShop User", email: "user@example.com" });

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
  function viewDetail(product) {
    navigate(`/products/${product.id}`);
  }
  function closeNotice() {
    setNotice("");
  }

  function saveUser(profile) {
    setUser(profile);
    setNotice("บันทึกข้อมูลโปรไฟล์แล้ว");
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

  return (
    <>
      <Routes>
        <Route element={<Layout cartCount={cartCount} onOpenCart={openCart} />}>
          <Route
            index
            element={
              <Home
                products={products}
                cartCount={cartCount}
                onOpenCart={openCart}
                onAddToCart={addToCart}
                onViewDetail={viewDetail}
              />
            }
          />
          <Route path="about" element={<About />} />
          <Route path="admin/products" element={<ProductManagement />} />
          <Route
            path="products"
            element={
              <Products onAddToCart={addToCart} onViewDetail={viewDetail} />
            }
          />
          <Route
            path="products/:id"
            element={<ProductDetail onAddToCart={addToCart} />}
          />
          <Route
            path="profile"
            element={<Profile user={user} onSaveUser={saveUser} cart={cart} cartCount={cartCount} onOpenCart={openCart} />}
          />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
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
