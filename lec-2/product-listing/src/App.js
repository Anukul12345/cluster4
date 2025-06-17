import React, { useState } from "react";
import SearchBar from "./SearchBar";
import ProductList from "./ProductList";

function App() {
  const [products, setProducts] = useState([]);
  const [sortOption, setSortOption] = useState("");

  const handleSearch = async (query) => {
    if (!query.trim()) {
      alert("Search field cannot be empty!");
      return;
    }
    const res = await fetch(`https://dummyjson.com/products/search?q=${query}`);
    const data = await res.json();
    setProducts(data.products);
  };

  let sortedProducts = [...products];
  if (sortOption === "price-asc") {
    sortedProducts.sort((a, b) => a.price - b.price);
  } else if (sortOption === "price-desc") {
    sortedProducts.sort((a, b) => b.price - a.price);
  } else if (sortOption === "rating-asc") {
    sortedProducts.sort((a, b) => a.rating - b.rating);
  } else if (sortOption === "rating-desc") {
    sortedProducts.sort((a, b) => b.rating - a.rating);
  }

  return (
    <div>
      <h1>Product Listing</h1>
      <SearchBar onSearch={handleSearch} />
      <select value={sortOption} onChange={e => setSortOption(e.target.value)}>
        <option value="">Sort By</option>
        <option value="price-asc">Price: Low to High</option>
        <option value="price-desc">Price: High to Low</option>
        <option value="rating-asc">Rating: Low to High</option>
        <option value="rating-desc">Rating: High to Low</option>
      </select>
      <ProductList products={sortedProducts} />
    </div>
  );
}

export default App;