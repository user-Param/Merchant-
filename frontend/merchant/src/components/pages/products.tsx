"use client";

import { useState } from "react";
import { useProducts } from "@/hooks/use-api";
import { useError } from "@/context/error-context";

interface Product {
  product_id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
}

const Products = () => {
  const { products, loading, error, createProduct, deleteProduct } = useProducts();
  const { showError } = useError();
  const [isAdding, setIsAdding] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: "", category: "", price: 0, stock: 0 });

  if (loading) {
    return <div className="p-6">Loading products...</div>;
  }

  if (error) {
    return <div className="p-6">Error loading products</div>;
  }

  const handleAdd = async () => {
    try {
      await createProduct(newProduct);
      setIsAdding(false);
      setNewProduct({ name: "", category: "", price: 0, stock: 0 });
    } catch (err) {
      showError(err instanceof Error ? err.message : 'Failed to create product');
    }
  };

  const handleDelete = async (productId: string) => {
    try {
      await deleteProduct(productId);
    } catch (err) {
      showError(err instanceof Error ? err.message : 'Failed to delete product');
    }
  };

  return (
    <div className="flex-1 p-6 bg-gray-50 min-h-screen space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Products</h1>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          {isAdding ? "Cancel" : "Add Product"}
        </button>
      </div>

      {isAdding && (
        <div className="bg-white rounded-xl shadow p-4 space-y-4">
          <input
            placeholder="Product Name"
            className="w-full border p-2 rounded"
            value={newProduct.name}
            onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
          />
          <input
            placeholder="Category"
            className="w-full border p-2 rounded"
            value={newProduct.category}
            onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
          />
          <div className="flex gap-4">
            <input
              type="number"
              placeholder="Price"
              className="w-full border p-2 rounded"
              value={newProduct.price}
              onChange={(e) => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
            />
            <input
              type="number"
              placeholder="Stock"
              className="w-full border p-2 rounded"
              value={newProduct.stock}
              onChange={(e) => setNewProduct({ ...newProduct, stock: Number(e.target.value) })}
            />
          </div>
          <button onClick={handleAdd} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
            Save Product
          </button>
        </div>
      )}

      <div className="bg-white rounded-xl shadow p-4 overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b text-gray-500 text-sm">
              <th className="py-2">Product Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={String(p.product_id)} className="border-b hover:bg-gray-50 transition">
                <td className="py-3 font-medium">{String(p.name)}</td>
                <td>{String(p.category)}</td>
                <td>₹{Number(p.price)}</td>
                <td>{Number(p.stock)} units</td>
                <td>
                  <button
                    onClick={() => handleDelete(String(p.product_id))}
                    className="text-red-600 hover:text-red-800"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Products;