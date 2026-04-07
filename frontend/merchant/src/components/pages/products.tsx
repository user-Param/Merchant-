"use client";

import { useState, useEffect } from "react";
import { useProducts } from "@/hooks/use-api";
import { useError } from "@/context/error-context";

const Products = () => {
  const { products, loading, error, createProduct, deleteProduct } = useProducts();
  const { showError } = useError();

  const [isAdding, setIsAdding] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<"name" | "price" | "stock">("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const [newProduct, setNewProduct] = useState({
    name: "",
    category: "",
    price: 0,
    stock: 0,
  });

  const itemsPerPage = 10;

  // ✅ Reset page when products change
  useEffect(() => {
    setCurrentPage(1);
  }, [products.length]);

  if (loading) return <div className="p-6">Loading products...</div>;
  if (error) return <div className="p-6">Error loading products</div>;

  // ✅ SORT FIRST
  const sortedProducts = [...products].sort((a, b) => {
    let compareVal = 0;

    if (sortBy === "name") {
      compareVal = a.name.localeCompare(b.name);
    } else if (sortBy === "price") {
      compareVal = Number(a.price) - Number(b.price);
    } else if (sortBy === "stock") {
      compareVal = Number(a.stock) - Number(b.stock);
    }

    return sortOrder === "asc" ? compareVal : -compareVal;
  });

  // ✅ PAGINATION
  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);

  const paginatedProducts = sortedProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // ✅ CLEAN PAGINATION LOGIC
  const getVisiblePages = () => {
    const maxVisible = 5;

    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = start + maxVisible - 1;

    if (end > totalPages) {
      end = totalPages;
      start = Math.max(1, end - maxVisible + 1);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  const handleAdd = async () => {
    if (!newProduct.name.trim()) return showError("Product name is required");
    if (!newProduct.category.trim()) return showError("Category is required");
    if (newProduct.price <= 0) return showError("Price must be greater than 0");
    if (newProduct.stock < 0) return showError("Stock cannot be negative");

    const exists = products.some(
      (p) => p.name.toLowerCase() === newProduct.name.toLowerCase()
    );
    if (exists) return showError("Product already exists");

    try {
      await createProduct(newProduct);
      setIsAdding(false);
      setNewProduct({ name: "", category: "", price: 0, stock: 0 });
    } catch (err) {
      showError(err instanceof Error ? err.message : "Failed to create product");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteProduct(id);
    } catch (err) {
      showError(err instanceof Error ? err.message : "Delete failed");
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
            type="text"
            placeholder="Product Name"
            className="w-full border p-2 rounded"
            value={newProduct.name}
            onChange={(e) =>
              setNewProduct({ ...newProduct, name: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Category"
            className="w-full border p-2 rounded"
            value={newProduct.category}
            onChange={(e) =>
              setNewProduct({ ...newProduct, category: e.target.value })
            }
          />
          <div className="flex gap-4">
            <input
              type="number"
              placeholder="Price"
              className="w-full border p-2 rounded"
              value={newProduct.price || ""}
              onChange={(e) =>
                setNewProduct({
                  ...newProduct,
                  price: Number(e.target.value) || 0,
                })
              }
            />
            <input
              type="number"
              placeholder="Stock"
              className="w-full border p-2 rounded"
              value={newProduct.stock || ""}
              onChange={(e) =>
                setNewProduct({
                  ...newProduct,
                  stock: Number(e.target.value) || 0,
                })
              }
            />
          </div>

          <button
            onClick={handleAdd}
            className="w-full bg-green-600 text-white px-4 py-2 rounded"
          >
            Save Product
          </button>
        </div>
      )}
      <div className="bg-white rounded-xl shadow p-4">
        <div className="flex justify-between mb-4">
          <h2>Products ({products.length})</h2>
          <p className="text-sm text-gray-500">
            Page {currentPage} of {totalPages || 1}
          </p>
        </div>

        <table className="w-full text-left">
          <thead>
            <tr className="border-b text-sm text-gray-500">
              <th onClick={() => setSortBy("name")} className="cursor-pointer">
                Name
              </th>
              <th>Category</th>
              <th onClick={() => setSortBy("price")} className="cursor-pointer">
                Price
              </th>
              <th onClick={() => setSortBy("stock")} className="cursor-pointer">
                Stock
              </th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {paginatedProducts.map((p) => (
              <tr key={p.product_id} className="border-b hover:bg-gray-50">
                <td className="py-2">{p.name}</td>
                <td>{p.category}</td>
                <td>₹{p.price}</td>
                <td>{p.stock}</td>
                <td>
                  <button
                    onClick={() => handleDelete(p.product_id)}
                    className="text-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {totalPages > 0 && (
          <div className="flex justify-center items-center gap-2 mt-4">
            <button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className="px-2 py-1 bg-gray-100 rounded"
            >
              First
            </button>

            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-2 py-1 bg-gray-100 rounded"
            >
              Prev
            </button>

            {getVisiblePages().map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1 rounded ${
                  page === currentPage
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100"
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-2 py-1 bg-gray-100 rounded"
            >
              Next
            </button>

            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
              className="px-2 py-1 bg-gray-100 rounded"
            >
              Last
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;