"use client";

import { useEffect, useState } from "react";

type Product = {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
};

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulated API call
    setTimeout(() => {
      setProducts([
        { id: 1, name: "Premium Hoodie", category: "Apparel", price: 1200, stock: 45 },
        { id: 2, name: "Wireless Headphones", category: "Electronics", price: 2500, stock: 12 },
        { id: 3, name: "Leather Wallet", category: "Accessories", price: 450, stock: 89 },
      ]);
      setLoading(false);
    }, 500);
  }, []);

  if (loading) {
    return <div className="p-6">Loading products...</div>;
  }

  return (
    <div className="flex-1 p-6 bg-gray-50 min-h-screen space-y-6">
      <h1 className="text-2xl font-bold">Products</h1>

      <div className="bg-white rounded-xl shadow p-4 overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b text-gray-500 text-sm">
              <th className="py-2">Product Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-b hover:bg-gray-50 transition">
                <td className="py-3 font-medium">{p.name}</td>
                <td>{p.category}</td>
                <td>₹{p.price}</td>
                <td>{p.stock} units</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Products;