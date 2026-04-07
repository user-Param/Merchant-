import { useState, useEffect } from 'react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api/v1';
const STORE_ID = process.env.NEXT_PUBLIC_STORE_ID || 'store_001';

interface Product {
  id: string;
  name: string;
  [key: string]: unknown;
}

interface Order {
  id: string;
  status: string;
  [key: string]: unknown;
}

interface Customer {
  id: string;
  name: string;
  email: string;
  [key: string]: unknown;
}

interface AuthUser {
  store_id: string;
  name: string;
  email: string;
  token?: string;
}

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/products`, {
        headers: { 'x-store-id': STORE_ID },
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setProducts(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const createProduct = async (product: Omit<Product, 'product_id'>) => {
    const response = await fetch(`${API_BASE_URL}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-store-id': STORE_ID },
      body: JSON.stringify(product),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error((errorData as Record<string, unknown>).message ? String((errorData as Record<string, unknown>).message) : 'Failed to create product');
    }
    await fetchProducts();
  };

  const updateProduct = async (productId: string, product: Product) => {
    const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'x-store-id': STORE_ID },
      body: JSON.stringify(product),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error((errorData as Record<string, unknown>).message ? String((errorData as Record<string, unknown>).message) : 'Failed to update product');
    }
    await fetchProducts();
  };

  const deleteProduct = async (productId: string) => {
    const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
      method: 'DELETE',
      headers: { 'x-store-id': STORE_ID },
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error((errorData as Record<string, unknown>).message ? String((errorData as Record<string, unknown>).message) : 'Failed to delete product');
    }
    await fetchProducts();
  };

  return { products, loading, error, createProduct, updateProduct, deleteProduct, refetch: fetchProducts };
}

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchOrders = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/orders`, {
        headers: { 'x-store-id': STORE_ID },
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setOrders(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const createOrder = async (order: Order) => {
    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-store-id': STORE_ID },
      body: JSON.stringify(order),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error((errorData as Record<string, unknown>).message ? String((errorData as Record<string, unknown>).message) : 'Failed to create order');
    }
    await fetchOrders();
  };

  const updateStatus = async (orderId: string, status: string) => {
    const response = await fetch(`${API_BASE_URL}/orders/${orderId}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'x-store-id': STORE_ID },
      body: JSON.stringify({ status }),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error((errorData as Record<string, unknown>).message ? String((errorData as Record<string, unknown>).message) : 'Failed to update order status');
    }
    await fetchOrders();
  };

  return { orders, loading, error, createOrder, updateStatus, refetch: fetchOrders };
}

export function useCustomers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchCustomers = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/customers`, {
        headers: { 'x-store-id': STORE_ID },
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setCustomers(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const createCustomer = async (customer: Omit<Customer, 'id'>) => {
    const response = await fetch(`${API_BASE_URL}/customers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-store-id': STORE_ID },
      body: JSON.stringify(customer),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error((errorData as Record<string, unknown>).message ? String((errorData as Record<string, unknown>).message) : 'Failed to create customer');
    }
    await fetchCustomers();
  };

  const deleteCustomer = async (customerId: string) => {
    const response = await fetch(`${API_BASE_URL}/customers/${customerId}`, {
      method: 'DELETE',
      headers: { 'x-store-id': STORE_ID },
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error((errorData as Record<string, unknown>).message ? String((errorData as Record<string, unknown>).message) : 'Failed to delete customer');
    }
    await fetchCustomers();
  };

  return { customers, loading, error, createCustomer, deleteCustomer, refetch: fetchCustomers };
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(false);

  const login = async (email: string, password: string): Promise<AuthUser> => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!response.ok) throw new Error('Invalid credentials');
      const data = await response.json();
      localStorage.setItem('merchant_token', data.token);
      localStorage.setItem('merchant_store_id', data.store_id);
      setUser(data);
      return data;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string): Promise<AuthUser> => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      if (!response.ok) throw new Error('Registration failed');
      const data = await response.json();
      return data;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('merchant_token');
    localStorage.removeItem('merchant_store_id');
    setUser(null);
  };

  const checkAuth = () => {
    const token = localStorage.getItem('merchant_token');
    const storeId = localStorage.getItem('merchant_store_id');
    if (token && storeId) {
      setUser({ store_id: storeId, name: '', email: '' });
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return { user, loading, login, register, logout };
}
