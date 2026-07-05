import { useState } from 'react'
import { MdSearch, MdExpandMore, MdVisibility } from 'react-icons/md'

const allOrders = [
  { id: '#ORD-1042', customer: 'Fatima Al-Hassan', email: 'fatima@email.com', product: 'Classic Black Abaya', qty: 1, amount: 120, date: '2024-12-10', status: 'Delivered', city: 'Riyadh' },
  { id: '#ORD-1041', customer: 'Mariam Khalid', email: 'mariam@email.com', product: 'Embroidered Dubai Abaya', qty: 2, amount: 390, date: '2024-12-10', status: 'Processing', city: 'Dubai' },
  { id: '#ORD-1040', customer: 'Aisha Noor', email: 'aisha@email.com', product: 'Pearl Butterfly Abaya', qty: 1, amount: 160, date: '2024-12-09', status: 'Shipped', city: 'Jeddah' },
  { id: '#ORD-1039', customer: 'Sara Al-Rashid', email: 'sara@email.com', product: 'Chiffon Open Abaya', qty: 1, amount: 110, date: '2024-12-09', status: 'Delivered', city: 'Abu Dhabi' },
  { id: '#ORD-1038', customer: 'Nour Mahmoud', email: 'nour@email.com', product: 'Linen Casual Abaya', qty: 2, amount: 180, date: '2024-12-08', status: 'Pending', city: 'Kuwait City' },
  { id: '#ORD-1037', customer: 'Hind Al-Farsi', email: 'hind@email.com', product: 'Velvet Occasion Abaya', qty: 1, amount: 240, date: '2024-12-08', status: 'Delivered', city: 'Doha' },
  { id: '#ORD-1036', customer: 'Layla Yousef', email: 'layla@email.com', product: 'Gold Thread Abaya', qty: 1, amount: 320, date: '2024-12-07', status: 'Shipped', city: 'Riyadh' },
  { id: '#ORD-1035', customer: 'Reem Al-Sayed', email: 'reem@email.com', product: 'Silk Luxe Abaya', qty: 1, amount: 280, date: '2024-12-07', status: 'Processing', city: 'Muscat' },
  { id: '#ORD-1034', customer: 'Dana Hassan', email: 'dana@email.com', product: 'Floral Printed Abaya', qty: 3, amount: 315, date: '2024-12-06', status: 'Cancelled', city: 'Bahrain' },
  { id: '#ORD-1033', customer: 'Nadia Al-Amin', email: 'nadia@email.com', product: 'Cotton Everyday Abaya', qty: 2, amount: 170, date: '2024-12-06', status: 'Delivered', city: 'Jeddah' },
]

const statusStyles = {
  Delivered: 'bg-emerald-100 text-emerald-700',
  Processing: 'bg-blue-100 text-blue-700',
  Shipped: 'bg-amber-100 text-amber-700',
  Pending: 'bg-orange-100 text-orange-700',
  Cancelled: 'bg-rose-100 text-rose-700',
}

const statuses = ['All', 'Delivered', 'Processing', 'Shipped', 'Pending', 'Cancelled']

const orderStats = [
  { label: 'Total Orders', value: '1,074', color: 'text-foreground' },
  { label: 'Delivered', value: '681', color: 'text-emerald-600' },
  { label: 'Processing', value: '142', color: 'text-blue-600' },
  { label: 'Shipped', value: '198', color: 'text-amber-600' },
  { label: 'Pending', value: '38', color: 'text-orange-600' },
  { label: 'Cancelled', value: '15', color: 'text-rose-600' },
]

const Orders = () => {

      const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [orders, setOrders] = useState(allOrders)
  const [selectedOrder, setSelectedOrder] = useState(null)

  const filtered = orders.filter((o) => {
    const matchSearch =
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.customer.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'All' || o.status === statusFilter
    return matchSearch && matchStatus
  })

  const updateStatus = (id, newStatus) => {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status: newStatus } : o)))
    if (selectedOrder?.id === id) {
      setSelectedOrder((prev) => prev ? { ...prev, status: newStatus } : prev)
    }
  }


  return (
    <div className="space-y-5">
      {/* Summary strip */}
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
        {orderStats.map((s) => (
          <div key={s.label} className="rounded-xl border border-border bg-card p-3 text-center">
            <p className={`text-xl font-heading font-bold ${s.color}`}>{s.value}</p>
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
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-card border border-border text-muted-foreground hover:text-foreground'
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
                <th className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground">Order ID</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground">Customer</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground hidden md:table-cell">Product</th>
                <th className="px-5 py-3 text-right text-xs font-semibold text-muted-foreground">Amount</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground hidden lg:table-cell">Date</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground">Status</th>
                <th className="px-5 py-3 text-right text-xs font-semibold text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((order) => (
                <tr key={order.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="px-5 py-3 font-mono text-xs text-foreground font-medium">{order.id}</td>
                  <td className="px-5 py-3">
                    <p className="font-medium text-foreground">{order.customer}</p>
                    <p className="text-xs text-muted-foreground">{order.city}</p>
                  </td>
                  <td className="px-5 py-3 text-muted-foreground hidden md:table-cell">{order.product}</td>
                  <td className="px-5 py-3 text-right font-semibold text-foreground">SAR {order.amount}</td>
                  <td className="px-5 py-3 text-muted-foreground text-xs hidden lg:table-cell">{order.date}</td>
                  <td className="px-5 py-3">
                    <div className="relative inline-block">
                      <select
                        value={order.status}
                        onChange={(e) => updateStatus(order.id, e.target.value)}
                        className={`appearance-none rounded-full pl-2.5 pr-6 py-0.5 text-xs font-medium cursor-pointer border-0 outline-none ${statusStyles[order.status]}`}
                      >
                        {statuses.filter((s) => s !== 'All').map((s) => (
                          <option key={s} value={s}>{s}</option>
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
          <p className="text-xs text-muted-foreground">Showing {filtered.length} of {orders.length} orders</p>
          <div className="flex gap-1">
            <button className="rounded border border-border px-3 py-1 text-xs text-muted-foreground hover:bg-muted">Prev</button>
            <button className="rounded border border-border bg-primary px-3 py-1 text-xs text-primary-foreground">1</button>
            <button className="rounded border border-border px-3 py-1 text-xs text-muted-foreground hover:bg-muted">Next</button>
          </div>
        </div>
      </div>

      {/* Order detail modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-card border border-border shadow-2xl">
            <div className="flex items-center justify-between border-b border-border px-6 py-4">
              <h3 className="font-heading text-lg font-semibold text-foreground">Order {selectedOrder.id}</h3>
              <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusStyles[selectedOrder.status]}`}>
                {selectedOrder.status}
              </span>
            </div>
            <div className="px-6 py-5 space-y-3">
              {[
                { label: 'Customer', value: selectedOrder.customer },
                { label: 'Email', value: selectedOrder.email },
                { label: 'City', value: selectedOrder.city },
                { label: 'Product', value: selectedOrder.product },
                { label: 'Quantity', value: String(selectedOrder.qty) },
                { label: 'Total', value: `SAR ${selectedOrder.amount}` },
                { label: 'Order Date', value: selectedOrder.date },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between text-sm">
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
  )
}

export default Orders