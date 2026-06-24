import { Suspense, useState } from 'react'
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router'
import Loader from './components/Loader'
import Home from './pages/Dashborad'
import Sidebar from './components/Sidebar'
import AdminLayout from './components/AdminLayout'

function App() {

  return (
    <BrowserRouter>
      <Suspense fallback={<Loader />}>
        <Routes path="/" element={<AdminLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          {/* <Route path="products" element={<Products />} />
          <Route path="orders" element={<Orders />} />
          <Route path="customers" element={<Customers />} />
          <Route path="categories" element={<Categories />} />
          <Route path="settings" element={<Settings />} /> */}
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

export default App
