import React from 'react'
import { useState } from 'react'
// import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Header from './Header'

import { Outlet } from 'react-router'

const AdminLayout = () => {

    const [sidebarOpen, setSidebarOpen] = useState(true)
    console.log(sidebarOpen)
    console.log("LSKJDFLKSAJDFLKJ")

    return (
        <div className="flex h-screen overflow-hidden bg-background">
            {/* Sidebar */}
            <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            {/* Mobile overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-20 bg-charcoal/40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Main content */}
            <div className="flex flex-1 flex-col overflow-hidden">
                <Header onMenuClick={() => setSidebarOpen((prev) => !prev)} />
                <main className="flex-1 overflow-y-auto p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    )

}

export default AdminLayout