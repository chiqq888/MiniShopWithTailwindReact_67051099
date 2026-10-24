import ProductCatalog from "../components/ProductCatalog";
import { getProducts } from "../models/productModel";

function Products({ onAddToCart, onViewDetail }) {
  return (
    <div className="pt-10 sm:pt-14">
      <ProductCatalog
        products={getProducts()}
        onAddToCart={onAddToCart}
        onViewDetail={onViewDetail}
      />
    </div>
  );
}

export default Products;
