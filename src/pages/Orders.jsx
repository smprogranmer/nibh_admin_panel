import { useEffect, useMemo, useState } from "react";
import { MdSearch, MdExpandMore, MdVisibility } from "react-icons/md";
import { getOrders, upgradeOrderStatus } from "../utilits/api/orderService";

const statusStyles = {
  Delivered: "bg-emerald-100 text-emerald-700",
  Processing: "bg-blue-100 text-blue-700",
  Shipped: "bg-amber-100 text-amber-700",
  Pending: "bg-orange-100 text-orange-700",
  Cancelled: "bg-rose-100 text-rose-700",
};

const statuses = [
  "All",
  "Delivered",
  "Processing",
  "Shipped",
  "Pending",
  "Cancelled",
];

// const orderStats = [
//   { label: "Total Orders", value: "1,074", color: "text-foreground" },
//   { label: "Delivered", value: "681", color: "text-emerald-600" },
//   { label: "Processing", value: "142", color: "text-blue-600" },
//   { label: "Shipped", value: "198", color: "text-amber-600" },
//   { label: "Pending", value: "38", color: "text-orange-600" },
//   { label: "Cancelled", value: "15", color: "text-rose-600" },
// ];

const Orders = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showProductsDropdown, setShowProductsDropdown] = useState(false);
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  console.log("selectedOrder", selectedOrder);

  // const filtered = orders.filter((o) => {
  //   const searchText = search.toLowerCase();

  //   const matchSearch =
  //     o.orderId?.toLowerCase().includes(searchText) ||
  //     o.shippingDetails?.firstName?.toLowerCase().includes(searchText) ||
  //     o.shippingDetails?.lastName?.toLowerCase().includes(searchText) ||
  //     o.shippingDetails?.email?.toLowerCase().includes(searchText);

  //   // মূল পরিবর্তন এখানে: orderProducts অ্যারের ভেতরে কোনো একটি প্রোডাক্টের স্ট্যাটাস মিললেই সেটি দেখাবে
  //   const matchStatus =
  //     statusFilter === "All" ||
  //     (o.orderProducts &&
  //       o.orderProducts.some(
  //         (product) =>
  //           product.status?.toLowerCase() === statusFilter.toLowerCase(),
  //       ));

  //   return matchSearch && matchStatus;
  // });

  // ১. প্রতিটি অর্ডারের সাথে তার প্রোডাক্টগুলো যুক্ত করে একটি ফ্ল্যাট লিস্ট তৈরি করা
  // সরাসরি orders অ্যারে ফিল্টার করুন
  // ১. শুধু orderProducts গুলোকে আলাদা করে একটি ফ্ল্যাট লিস্ট বানিয়ে নিন
  // ফ্ল্যাট করার সময় মূল অর্ডারটি সাথে যুক্ত করে দিন
  const allOrderProducts = orders.flatMap((order) => {
    return (order.orderProducts || []).map((product) => ({
      ...product, // প্রোডাক্টের সব ফিল্ড (name, price, status ইত্যাদি)
      orderId: order.orderId,
      shippingDetails: order.shippingDetails,
      totalPrice: order.totalPrice,
      createdAt: order.createdAt,
    }));
  });

  console.log("allOrderProducts", allOrderProducts);
  // ২. সেগুলোকে ফিল্টার করুন (যদি সার্চ বা স্ট্যাটাস ফিল্টার করতে চান)
  const filteredProducts = allOrderProducts.filter((product) => {
    const searchText = search.toLowerCase();
    const matchSearch = product.name?.toLowerCase().includes(searchText);

    const matchStatus =
      statusFilter === "All" ||
      product.status?.toLowerCase() === statusFilter.toLowerCase();

    return matchSearch && matchStatus;
  });

  const updateStatus = async (orderId, orderData) => {
    // setOrders((prev) =>
    //   prev.map((o) => (o.id === id ? { ...o, status: newStatus } : o)),
    // );
    // if (selectedOrder?.id === id) {
    //   setSelectedOrder((prev) =>
    //     prev ? { ...prev, status: newStatus } : prev,
    //   );
    // }

    console.log(orderId, orderData);

    try {
      const data = await upgradeOrderStatus(orderId, orderData);

      console.log("Fetched orders:", data);

      setOrders(data.orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const orderStats = useMemo(() => {
    // orders না থাকলে বা খালি থাকলে ডিফল্ট ০ দেখাবে
    if (!orders || orders.length === 0) {
      return [
        { label: "Total Orders", value: 0, color: "text-foreground" },
        { label: "Delivered", value: 0, color: "text-emerald-600" },
        { label: "Processing", value: 0, color: "text-blue-600" },
        { label: "Shipped", value: 0, color: "text-amber-600" },
        { label: "Pending", value: 0, color: "text-orange-600" },
        { label: "Cancelled", value: 0, color: "text-rose-600" },
      ];
    }

    // সব প্রোডাক্টের স্ট্যাটাস বের করা
    const allStatuses = orders.flatMap((order) =>
      (order.orderProducts || []).map((product) =>
        product.status?.toLowerCase(),
      ),
    );

    return [
      {
        label: "Total Orders",
        value: orders.length.toLocaleString(), // যেমন: 1,074
        color: "text-foreground",
      },
      {
        label: "Delivered",
        value: allStatuses.filter((s) => s === "delivered").length,
        color: "text-emerald-600",
      },
      {
        label: "Processing",
        value: allStatuses.filter((s) => s === "processing").length,
        color: "text-blue-600",
      },
      {
        label: "Shipped",
        value: allStatuses.filter((s) => s === "shipped").length,
        color: "text-amber-600",
      },
      {
        label: "Pending",
        value: allStatuses.filter((s) => s === "pending").length,
        color: "text-orange-600",
      },
      {
        label: "Cancelled",
        value: allStatuses.filter((s) => s === "cancelled").length,
        color: "text-rose-600",
      },
    ];
  }, [orders]); // orders চেঞ্জ হলেই এই হিসাবটি স্বয়ংক্রিয়ভাবে আপডেট হবে

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getOrders();

        console.log("Fetched orders:", data);

        setOrders(data.orders);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="space-y-5">
      {/* Summary strip */}
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
        {orderStats.map((s) => (
          <div
            key={s.label}
            className="rounded-xl border border-border bg-card p-3 text-center"
          >
            <p className={`text-xl font-heading font-bold ${s.color}`}>
              {s.value}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-1.5 flex-wrap">
          {statuses.map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                statusFilter === s
                  ? "bg-primary text-primary-foreground"
                  : "bg-card border border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm text-muted-foreground">
          <MdSearch className="h-4 w-4 shrink-0" />
          <input
            type="text"
            placeholder="Search orders..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent outline-none placeholder:text-muted-foreground text-foreground w-44"
          />
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground">
                  No
                </th>
                <th className="px-4 py-1 text-left text-xs font-semibold text-muted-foreground">
                  Product
                </th>
                <th
                  className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground
                 "
                >
                  Size
                </th>
                {/* <th className="px-5 py-3 text-right text-xs font-semibold text-muted-foreground">
                  Quantity
                </th> */}
                <th className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground ">
                  Qty
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {allOrderProducts.map((order, index) => (
                <tr
                  key={order.orderId}
                  onClick={() => setSelectedOrder(order)}
                  className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
                >
                  <td className="px-5 py-3 font-mono text-xs text-foreground font-medium">
                    {index + 1}
                  </td>
                  <td className="px-5 py-3">
                    <img
                      src={order.image}
                      alt={order.name}
                      className="h-8 w-8 rounded object-cover mr-2 inline-block"
                    />
                  </td>
                  <td className="px-5 py-3 text-foreground font-semibold">
                    {order.size}
                  </td>
                  <td className="px-5 py-3 text-foreground font-semibold">
                    {order.quantity}
                  </td>
                  <td className="px-1 py-3">
                    <div
                      className="relative inline-block"
                      onClick={(e) => e.stopPropagation()}
                      
                    >
                      {console.log("order.status", order.status)}
                      <select
                        value={order.status}
                        onChange={(e) => {
                          updateStatus(order.orderId, {
                            productId: order._id,
                            status: e.target.value,
                          });
                        }}
                        className={`appearance-none rounded-full pl-2.5 pr-6 py-0.5 text-xs 
                          font-medium cursor-pointer border-0 outline-none ${statusStyles[order.status]}`}
                      >
                        {statuses
                          .filter((s) => s !== "All")
                          .map((s) => (
                            <option key={s} value={s.toLowerCase()}>
                              {s}
                            </option>
                          ))}
                      </select>
                      <MdExpandMore className="pointer-events-none absolute right-1.5 top-1/2 -translate-y-1/2 h-3 w-3" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="border-t border-border px-5 py-3 flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            Showing {allOrderProducts.length} of {orders.length} orders
          </p>
          <div className="flex gap-1">
            <button className="rounded border border-border px-3 py-1 text-xs text-muted-foreground hover:bg-muted">
              Prev
            </button>
            <button className="rounded border border-border bg-primary px-3 py-1 text-xs text-primary-foreground">
              1
            </button>
            <button className="rounded border border-border px-3 py-1 text-xs text-muted-foreground hover:bg-muted">
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Order detail modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-card border border-border shadow-2xl">
            <div className="flex items-center justify-between border-b border-border px-6 py-4">
              <h3 className="font-heading text-lg font-semibold text-foreground">
                Order - {selectedOrder.orderId}
              </h3>
              <span
                className={`rounded-full px-2.5 py-0.5 text-xl uppercase text-red-600 font-medium ${statusStyles[selectedOrder.status]}`}
              >
                {selectedOrder.status}
              </span>
            </div>
            <div className="px-6 py-5 space-y-3">
              {[
                {
                  label: "Order Date",
                  value: selectedOrder.createdAt
                    ? selectedOrder.createdAt
                        .substring(0, 10)
                        .split("-")
                        .reverse()
                        .join("-")
                    : "",
                },
                { label: "orderId", value: selectedOrder.orderId },
                { label: "Email", value: selectedOrder.shippingDetails?.email },
                {
                  label: "Customer",
                  value:
                    selectedOrder.shippingDetails?.firstName +
                    " " +
                    selectedOrder.shippingDetails?.lastName,
                },
                { label: "Phone", value: selectedOrder.shippingDetails?.phone },
              ].map(({ label, value }) => (
                <div
                  key={label}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="text-muted-foreground">{label}</span>
                  <span className="font-medium text-foreground">{value}</span>
                </div>
              ))}

              {/* --- Products Dropdown Section --- */}
              <div className="border-t pt-2">
                <button
                  onClick={() => setShowProductsDropdown(!showProductsDropdown)}
                  className="w-full flex items-center justify-between text-sm font-medium py-1.5 text-foreground hover:text-primary transition-colors"
                >
                  <span className="text-muted-foreground">
                    {/* Products Details ({selectedOrder.orderProducts.length}) */}
                    Item Details
                  </span>
                  <span>{showProductsDropdown ? "▲ Hide" : "▼ View"}</span>
                </button>

                {/* Dropdown Content */}
                {showProductsDropdown && (
                  <div
                    // key={index}
                    className="flex items-center gap-2 text-xs bg- h-20 p-2 rounded"
                  >
                    <img
                      src={selectedOrder.image}
                      alt={selectedOrder.name}
                      className=" w-16 h-16 rounded object-cover"
                    />
                    <div className="flex-1 h-18">
                      <p className="font-medium text-sm">
                        {selectedOrder.name}
                      </p>
                      <p className="text-muted-foreground text-sm">
                        Qty: {selectedOrder.quantity} x {selectedOrder.price} --{" "}
                        {selectedOrder.size}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Total Price */}
              <div className="flex items-center justify-between text-sm border-t pt-2">
                <span className="text-muted-foreground">Total</span>
                <span className="font-medium text-lg text-foreground">
                  {selectedOrder.totalPrice}/-
                </span>
              </div>
            </div>
            <div className="border-t border-border px-6 py-4 flex justify-end">
              <button
                onClick={() => setSelectedOrder(null)}
                className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
