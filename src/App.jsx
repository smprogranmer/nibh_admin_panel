import { Suspense } from 'react'
import './App.css'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router'
import Loader from './components/Loader'
import Dashboard from './pages/Dashborad'
import AdminLayout from './components/AdminLayout'
import Products from './pages/Products'
import Orders from './pages/Orders'
import Customers from './pages/Customers'
import Settings from './pages/Settings'

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<Loader />}>
        {/* 1. Use <Routes> normally without attributes */}
        <Routes>
          {/* 2. Nest your routes inside a parent layout <Route> */}
          <Route path="/" element={<AdminLayout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="orders" element={<Orders />} />
            <Route path="products" element={<Products />} />  
            <Route path="customers" element={<Customers/>} /> 
              <Route path="settings" element={<Settings />} />         
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

export default App

