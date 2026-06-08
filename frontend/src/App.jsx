import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Customers from './pages/Customers'
import AddCustomer from './pages/AddCustomer'
import EditCustomer from './pages/EditCustomer'
import Invoices from './pages/Invoices'
import AddInvoice from './pages/AddInvoice'
import EditInvoice from './pages/EditInvoice'
import Payments from './pages/Payments'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'

const App = () => {
  return (
    <div className="app">
      <Sidebar />
      <div className="main">
        <Navbar />
        <div className="container">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/customers/add" element={<AddCustomer />} />
            <Route path="/customers/:id/edit" element={<EditCustomer />} />
            <Route path="/invoices" element={<Invoices />} />
            <Route path="/invoices/add" element={<AddInvoice />} />
            <Route path="/invoices/:id/edit" element={<EditInvoice />} />
            <Route path="/payments" element={<Payments />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </div>
    </div>
  )
}

export default App
