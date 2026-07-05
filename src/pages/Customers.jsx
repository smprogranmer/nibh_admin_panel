import { useState } from 'react'
import { MdSearch, MdPersonAdd, MdEmail, MdPhone, MdLocationOn } from 'react-icons/md'

const customers = [
    { id: 1, name: 'Fatima Al-Hassan', email: 'fatima@email.com', phone: '+966 55 123 4567', city: 'Riyadh', orders: 12, spent: 1840, joined: '2023-03-15', status: 'VIP' },
    { id: 2, name: 'Mariam Khalid', email: 'mariam@email.com', phone: '+971 50 234 5678', city: 'Dubai', orders: 8, spent: 1120, joined: '2023-06-22', status: 'Regular' },
    { id: 3, name: 'Aisha Noor', email: 'aisha@email.com', phone: '+966 56 345 6789', city: 'Jeddah', orders: 15, spent: 2400, joined: '2022-11-10', status: 'VIP' },
    { id: 4, name: 'Sara Al-Rashid', email: 'sara@email.com', phone: '+971 52 456 7890', city: 'Abu Dhabi', orders: 4, spent: 480, joined: '2024-01-05', status: 'New' },
    { id: 5, name: 'Nour Mahmoud', email: 'nour@email.com', phone: '+965 60 567 8901', city: 'Kuwait City', orders: 6, spent: 720, joined: '2023-09-18', status: 'Regular' },
    { id: 6, name: 'Hind Al-Farsi', email: 'hind@email.com', phone: '+974 33 678 9012', city: 'Doha', orders: 9, spent: 1350, joined: '2023-05-30', status: 'Regular' },
    { id: 7, name: 'Layla Yousef', email: 'layla@email.com', phone: '+966 57 789 0123', city: 'Riyadh', orders: 21, spent: 3780, joined: '2022-07-14', status: 'VIP' },
    { id: 8, name: 'Reem Al-Sayed', email: 'reem@email.com', phone: '+968 92 890 1234', city: 'Muscat', orders: 2, spent: 280, joined: '2024-04-20', status: 'New' },
    { id: 9, name: 'Dana Hassan', email: 'dana@email.com', phone: '+973 36 901 2345', city: 'Bahrain', orders: 5, spent: 650, joined: '2023-12-01', status: 'Regular' },
    { id: 10, name: 'Nadia Al-Amin', email: 'nadia@email.com', phone: '+966 58 012 3456', city: 'Jeddah', orders: 11, spent: 1540, joined: '2023-02-28', status: 'VIP' },
]

const statusStyles = {
    VIP: 'bg-gold/20 text-gold-dark',
    Regular: 'bg-blue-100 text-blue-700',
    New: 'bg-emerald-100 text-emerald-700',
}

const avatarColors = [
    'bg-gold/20 text-gold-dark', 'bg-blue-100 text-blue-700', 'bg-rose-100 text-rose-700',
    'bg-emerald-100 text-emerald-700', 'bg-violet-100 text-violet-700', 'bg-orange-100 text-orange-700',
]

const filters = ['All', 'VIP', 'Regular', 'New']



const Customers = () => {
    const [search, setSearch] = useState('')
    const [filter, setFilter] = useState('All')
    const [selected, setSelected] = useState(null)

    const filtered = customers.filter((c) => {
        const matchSearch =
            c.name.toLowerCase().includes(search.toLowerCase()) ||
            c.email.toLowerCase().includes(search.toLowerCase()) ||
            c.city.toLowerCase().includes(search.toLowerCase())
        const matchFilter = filter === 'All' || c.status === filter
        return matchSearch && matchFilter
    })
    return (
        <div className="space-y-5">
            {/* Summary cards */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[
                    { label: 'Total Customers', value: '3,842', color: 'text-foreground' },
                    { label: 'VIP Members', value: '284', color: 'text-gold-dark' },
                    { label: 'Regular', value: '2,918', color: 'text-blue-600' },
                    { label: 'New (This Month)', value: '128', color: 'text-emerald-600' },
                ].map((s) => (
                    <div key={s.label} className="rounded-xl border border-border bg-card p-4 text-center">
                        <p className={`text-2xl font-heading font-bold ${s.color}`}>{s.value}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
                    </div>
                ))}
            </div>

            {/* Toolbar */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex gap-1.5 flex-wrap">
                    {filters.map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${filter === f
                                    ? 'bg-primary text-primary-foreground'
                                    : 'bg-card border border-border text-muted-foreground hover:text-foreground'
                                }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm text-muted-foreground">
                        <MdSearch className="h-4 w-4 shrink-0" />
                        <input
                            type="text"
                            placeholder="Search customers..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="bg-transparent outline-none placeholder:text-muted-foreground text-foreground w-40"
                        />
                    </div>
                    <button className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity">
                        <MdPersonAdd className="h-4 w-4" />
                        Add Customer
                    </button>
                </div>
            </div>

            {/* Customer grid */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {filtered.map((customer, idx) => (
                    <div
                        key={customer.id}
                        className="rounded-xl border border-border bg-card p-5 cursor-pointer hover:shadow-md hover:border-gold/30 transition-all"
                        onClick={() => setSelected(customer)}
                    >
                        <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                                <div className={`h-10 w-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${avatarColors[idx % avatarColors.length]}`}>
                                    {customer.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                                </div>
                                <div>
                                    <p className="font-medium text-foreground text-sm">{customer.name}</p>
                                    <p className="text-xs text-muted-foreground">{customer.email}</p>
                                </div>
                            </div>
                            <span className={`rounded-full px-2 py-0.5 text-xs font-medium shrink-0 ${statusStyles[customer.status]}`}>
                                {customer.status}
                            </span>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground mt-3">
                            <span className="flex items-center gap-1">
                                <MdLocationOn className="h-3 w-3" />
                                {customer.city}
                            </span>
                            <span>{customer.orders} orders</span>
                            <span className="font-semibold text-foreground ml-auto">SAR {customer.spent.toLocaleString()}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Detail modal */}
            {selected && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/50 p-4">
                    <div className="w-full max-w-md rounded-2xl bg-card border border-border shadow-2xl">
                        <div className="flex items-center justify-between border-b border-border px-6 py-4">
                            <h3 className="font-heading text-lg font-semibold text-foreground">Customer Profile</h3>
                            <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusStyles[selected.status]}`}>
                                {selected.status}
                            </span>
                        </div>
                        <div className="px-6 py-5">
                            <div className="flex items-center gap-4 mb-5">
                                <div className="h-14 w-14 rounded-full bg-gold/20 flex items-center justify-center text-lg font-bold text-gold-dark">
                                    {selected.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                                </div>
                                <div>
                                    <p className="font-heading text-base font-semibold text-foreground">{selected.name}</p>
                                    <p className="text-xs text-muted-foreground">Member since {selected.joined}</p>
                                </div>
                            </div>
                            <div className="space-y-3">
                                {[
                                    { icon: MdEmail, label: selected.email },
                                    { icon: MdPhone, label: selected.phone },
                                    { icon: MdLocationOn, label: selected.city },
                                ].map(({ icon: Icon, label }) => (
                                    <div key={label} className="flex items-center gap-2.5 text-sm text-muted-foreground">
                                        <Icon className="h-4 w-4 shrink-0 text-gold-dark" />
                                        <span>{label}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-5 grid grid-cols-2 gap-3">
                                <div className="rounded-xl bg-muted p-3 text-center">
                                    <p className="font-heading text-xl font-bold text-foreground">{selected.orders}</p>
                                    <p className="text-xs text-muted-foreground mt-0.5">Total Orders</p>
                                </div>
                                <div className="rounded-xl bg-muted p-3 text-center">
                                    <p className="font-heading text-xl font-bold text-foreground">SAR {selected.spent.toLocaleString()}</p>
                                    <p className="text-xs text-muted-foreground mt-0.5">Total Spent</p>
                                </div>
                            </div>
                        </div>
                        <div className="border-t border-border px-6 py-4 flex justify-end">
                            <button
                                onClick={() => setSelected(null)}
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

export default Customers