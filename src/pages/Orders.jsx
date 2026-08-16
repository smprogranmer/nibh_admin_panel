import { useEffect, useState } from "react";
import { MdSearch, MdExpandMore, MdVisibility } from "react-icons/md";
import { getOrders } from "../utilits/api/orderService";

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

const orderStats = [
  { label: "Total Orders", value: "1,074", color: "text-foreground" },
  { label: "Delivered", value: "681", color: "text-emerald-600" },
  { label: "Processing", value: "142", color: "text-blue-600" },
  { label: "Shipped", value: "198", color: "text-amber-600" },
  { label: "Pending", value: "38", color: "text-orange-600" },
  { label: "Cancelled", value: "15", color: "text-rose-600" },
];

const Orders = () => {
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

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  console.log(selectedOrder);

  const filtered = orders.filter((o) => {
    console.log("Filtering order:", o); // Debugging line to check the order being filtered
    const searchText = search.toLowerCase();

    const matchSearch =
      o.orderId?.toLowerCase().includes(searchText) ||
      o.shippingDetails?.firstName?.toLowerCase().includes(searchText) ||
      o.shippingDetails?.lastName?.toLowerCase().includes(searchText) ||
      o.shippingDetails?.email?.toLowerCase().includes(searchText);

    const matchStatus = statusFilter === "All" || o.status === statusFilter;

    return matchSearch && matchStatus;
  });

  const updateStatus = (id, newStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status: newStatus } : o)),
    );
    if (selectedOrder?.id === id) {
      setSelectedOrder((prev) =>
        prev ? { ...prev, status: newStatus } : prev,
      );
    }
  };

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
                  Order ID
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground">
                  Customer
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground hidden md:table-cell">
                  Product
                </th>
                <th className="px-5 py-3 text-right text-xs font-semibold text-muted-foreground">
                  Amount
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground hidden lg:table-cell">
                  Date
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground">
                  Status
                </th>
                <th className="px-5 py-3 text-right text-xs font-semibold text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((order) => (
                <tr
                  key={order.orderId}
                  className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
                >
                  <td className="px-5 py-3 font-mono text-xs text-foreground font-medium">
                    {order.orderId}
                  </td>
                  <td className="px-5 py-3">
                    <p className="font-medium text-foreground">
                      
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {order.shippingDetails?.firstName} {order.shippingDetails?.lastName}
                    </p>
                  </td>
                  <td className="px-5 py-3 text-muted-foreground hidden md:table-cell">
                  {order.orderProducts?.length  || 0}
                  </td>
                  <td className="px-5 py-3 text-right font-semibold text-foreground">
                    {order.totalPrice}
                  </td>
                  <td className="px-5 py-3 text-muted-foreground text-xs hidden lg:table-cell">
                    {order.createdAt ? order.createdAt.substring(0, 10) : ""}
                  </td>
                  <td className="px-5 py-3">
                    <div className="relative inline-block">
                      <select
                        value={order.status}
                        onChange={(e) => updateStatus(order.id, e.target.value)}
                        className={`appearance-none rounded-full pl-2.5 pr-6 py-0.5 text-xs font-medium cursor-pointer border-0 outline-none ${statusStyles[order.status]}`}
                      >
                        {statuses
                          .filter((s) => s !== "All")
                          .map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                      </select>
                      <MdExpandMore className="pointer-events-none absolute right-1.5 top-1/2 -translate-y-1/2 h-3 w-3" />
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex justify-end">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="rounded p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                      >
                        <MdVisibility className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="border-t border-border px-5 py-3 flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            Showing {filtered.length} of {orders.length} orders
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
                Order {selectedOrder.orderId}
              </h3>
              <span
                className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusStyles[selectedOrder.status]}`}
              >
                {selectedOrder.status}
              </span>
            </div>
            <div className="px-6 py-5 space-y-3">
              {[
                { label: "Customer", value: selectedOrder.customer },
                { label: "Email", value: selectedOrder.email },
                { label: "City", value: selectedOrder.city },
                { label: "Product", value: selectedOrder.product },
                { label: "Quantity", value: String(selectedOrder.qty) },
                { label: "Total", value: `SAR ${selectedOrder.amount}` },
                { label: "Order Date", value: selectedOrder.date },
              ].map(({ label, value }) => (
                <div
                  key={label}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="text-muted-foreground">{label}</span>
                  <span className="font-medium text-foreground">{value}</span>
                </div>
              ))}
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
