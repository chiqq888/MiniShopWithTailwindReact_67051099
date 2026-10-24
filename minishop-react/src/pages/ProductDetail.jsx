import { useNavigate, useParams } from "react-router-dom";
import ProductImage from "../components/ProductImage";
import Icon from "../components/Icon";
import { getProductById } from "../models/productModel";

function ProductDetail({ onAddToCart }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = getProductById(id);

  const continueShopping = (
    <button
      type="button"
      onClick={() => navigate("/products")}
      className="inline-flex min-h-11 items-center justify-center rounded-shop border border-shop-border bg-white px-[18px] py-2.5 text-sm transition-colors hover:bg-shop-surface motion-reduce:transition-none"
    >
      Continue Shopping
    </button>
  );

  if (!product) {
    return (
      <section className="py-20 text-center">
        <h1 className="text-2xl font-medium">Product not found</h1>
        <p className="mt-3 text-shop-muted">ไม่พบสินค้าที่ต้องการ</p>
        <div className="mt-6">{continueShopping}</div>
      </section>
    );
  }

  function handleAddToCart() {
    onAddToCart(product);
  }

  return (
    <section className="py-10 sm:py-14" aria-labelledby="product-title">
      <div className="mb-6">{continueShopping}</div>
      <p className="mb-6 text-sm text-shop-muted">รายละเอียดสินค้า</p>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-[30px]">
        <div
          className="
            flex h-60 min-w-0 items-center justify-center overflow-hidden rounded-shop
            bg-shop-surface p-[30px] sm:h-[350px]
          "
        >
          <ProductImage
            image={product.image}
            name={product.title}
          />
        </div>

        <div>
          <span className="text-[10px] font-medium tracking-[.5px] text-[#7b7b7b] sm:text-[11px]">
            {product.category}
          </span>

          <h1 id="product-title" className="my-2.5 text-[22px] font-medium leading-[1.5]">
            {product.title}
          </h1>

          <div className="inline-flex items-center gap-[5px] text-[10px] text-[#656565] sm:text-xs">
            <Icon name="star" className="size-3 sm:size-3.5" />
            <strong>{product.rating?.rate ?? "—"}</strong>
            <span>({product.rating?.count ?? 0} รีวิว)</span>
          </div>

          <p className="my-3.5 text-[30px] font-semibold">${product.price}</p>

          <p className="my-2 text-xs leading-[1.9] text-[#666]">
            {product.description}
          </p>

          <button
            type="button"
            onClick={handleAddToCart}
            className="
              mt-[17px] inline-flex min-h-[46px] w-full items-center justify-center gap-3
              rounded-shop border border-shop-ink bg-shop-ink px-[18px] py-2.5
              font-medium text-white transition-colors duration-200
              hover:bg-[#454545] motion-reduce:transition-none
            "
          >
            <Icon name="cart" white />
            Add to Cart
          </button>
        </div>
      </div>

      <p className="mt-6 border-t border-[#e4e4e4] pt-4 text-[11px] leading-[1.8] text-[#808080]">
        ข้อมูล และราคาไม่ใช่ของจริง เป็นข้อมูลจาก Fake Store API
      </p>
    </section>
  );
}

export default ProductDetail;
