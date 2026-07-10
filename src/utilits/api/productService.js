// src/api/productService.js
import axiosInstance from "./axiosInstance";

export const createProduct = async (data) => {
  const formData = new FormData();
  formData.append("name", data.name);
  formData.append("sku", data.sku);  formData.append("category", data.category);
  formData.append("price", data.price);
  formData.append("stock", data.stock);

  if (data.photo && data.photo.length > 0) {
    formData.append("photo", data.photo[0]); // single image
  }

  const response = await axiosInstance.post("/products", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const updateProduct = async (id, data) => {
  const formData = new FormData();
  formData.append("name", data.name);
  formData.append("sku", data.sku);
  formData.append("category", data.category);
  formData.append("price", data.price);
  formData.append("stock", data.stock);

  if (data.photo && data.photo.length > 0) {
    formData.append("photo", data.photo[0]);
  }

  const response = await axiosInstance.put(`/products/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const deleteProduct = async (id) => {
  const response = await axiosInstance.delete(`/products/${id}`);
  return response.data;
};