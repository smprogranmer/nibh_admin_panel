import axiosInstance from "./axiosInstance";

export const getOrders = async () => {
  const response = await axiosInstance.get("/orders");
  return response.data;
};

export const upgradeOrderStatus = async (orderId, updateData) => {
  console.log(orderId, updateData);
  const response = await axiosInstance.put(
    `/orders/upgrade-status/${orderId}`,
    updateData
  );
  return response.data;
};
