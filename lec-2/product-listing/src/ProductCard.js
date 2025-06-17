import React from "react";

function ProductCard({ product }) {
  return (
    <div style={{
      border: "1px solid #ddd",
      borderRadius: "8px",
      padding: "16px",
      margin: "12px",
      width: "220px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      background: "#fff"
    }}>
      <img
        src={product.thumbnail}
        alt={product.title}
        style={{ width: "120px", height: "120px", objectFit: "cover", borderRadius: "6px" }}
      />
      <h3 style={{ margin: "12px 0 4px 0", fontSize: "1.1rem" }}>{product.title}</h3>
      <p style={{ margin: "0 0 8px 0", color: "#888" }}>{product.brand}</p>
      <p style={{ fontWeight: "bold", fontSize: "1.1rem" }}>${product.price}</p>
    </div>
  );
}

export default ProductCard;