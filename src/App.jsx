import { Suspense, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router'
import Loader from './components/Loader'
import Home from './pages/Home'

function App() {

  return (
    <BrowserRouter>
      {/* <Navbar /> */}
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route path="/" element={<Home />} />
          {/* 
          <Route path="/product/:slug" element={<ProductOverview />} />
          <Route path="/" element={<ProtectedRoute />}></Route>
          <Route path="/cart" element={<Cart />} />
          <Route path="/hijab" element={<Hijab />} />
          <Route path="/my-orders" element={<MyOrder />} />
          <Route path="/checkout" element={<CheckOut />} />
          <Route path="/borka" element={<Borka />} />
          <Route path="/abaya" element={<Abaya />} />
          <Route path="/signUp" element={<SingUp />} />
          <Route path="/signIn" element={<Login />} /> */}
          {/* <Route path="/admin" element={<Admin />} /> */}
          {/* <Route path="/invoice" element={<PurchaseReceipt />} /> */}
        </Routes>
      </Suspense>
    </BrowserRouter>    
  )
}

export default App
