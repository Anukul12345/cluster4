import React from "react";
import ProductCard from "./ProductCard";

function ProductList({ products }) {
  if (!products.length) return <p>No products to display.</p>;

  return (
    <div style={{
      display: "flex",
      flexWrap: "wrap",
      gap: "16px",
      justifyContent: "center"
    }}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

export default ProductList;