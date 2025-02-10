import { create } from "zustand";

// Define types for Product and the state
export type Product = {
  _id: string;
  name: string;
  price: string;
  image: string;
};

interface ProductState {
  products: Product[];
  setProducts: (products: Product[]) => void;
  fetchProducts: () => Promise<void>;
  createProduct: (
    newProduct: Product
  ) => Promise<{ success: boolean; message: string }>;
  deleteProduct: (
    productId: string
  ) => Promise<{ success: boolean; message: string }>;
  updateProduct: (
    productId: string,
    updatedProduct: Product
  ) => Promise<{ success: boolean; message: string }>;
}

export const useProductStore = create<ProductState>((set) => ({
  products: [],
  setProducts: (products: Product[]) => set({ products }),
  fetchProducts: async () => {
    const res = await fetch("/api/products");
    const data = await res.json();
    set({ products: data.data });
  },
  createProduct: async (newProduct: Product) => {
    if (!newProduct.name || !newProduct.price || !newProduct.image) {
      return { success: false, message: "Please fill all fields ..." };
    }
    const res = await fetch("/api/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newProduct),
    });
    const data = await res.json();
    set((state) => ({
      products: [...state.products, data.data],
    }));
    return { success: true, message: "Product created successfully" };
  },
  deleteProduct: async (productId: string) => {
    const res = await fetch(`/api/products/${productId}`, {
      method: "DELETE",
    });
    const data = await res.json();
    if (data.success) {
      set((state) => ({
        products: state.products.filter((product) => product._id !== productId),
      }));
      return { success: true, message: data.message };
    }
    return { success: false, message: "Failed to delete product" };
  },
  updateProduct: async (productId: string, updatedProduct: Product) => {
    if (
      !updatedProduct.name ||
      !updatedProduct.price ||
      !updatedProduct.image
    ) {
      return { success: false, message: "Please fill all fields ..." };
    }
    const res = await fetch(`/api/products/${productId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedProduct),
    });
    const data = await res.json();
    if (data.success) {
      set((state) => ({
        products: state.products.map((product) =>
          product._id === productId ? updatedProduct : product
        ),
      }));
      return { success: true, message: data.message };
    }
    return { success: false, message: "Failed to update product" };
  },
}));
