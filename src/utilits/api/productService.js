// src/api/productService.js
import axiosInstance from "./axiosInstance";

export const getProducts = async () => {
  
  try {
    const response = await axiosInstance.get("/products");
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
}

export const createProduct = async (productDetails) => {

  const formData = new FormData();

  // Append product details to FormData
  Object.keys(productDetails).forEach((key) => {

    if (key !== "images") {
      formData.append(key, productDetails[key]);
    }
  });

  if (productDetails.images && productDetails.images.length > 0) {
    const imageFiles = Array.from(productDetails.images);

    console.log("imageFiles", imageFiles)

    imageFiles.forEach((image, index) => {
      formData.append(`images`, image);
    });

  }

  console.log("productDetails", productDetails)

  const response = await axiosInstance.post("/products/new", formData, {
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
  formData.append("description", data.description);

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