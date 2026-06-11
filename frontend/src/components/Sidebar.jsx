import React from 'react'
import { NavLink } from 'react-router-dom'

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <h2 style={{marginTop:0}}>CRM</h2>
      <nav style={{marginTop:20,display:'flex',flexDirection:'column',gap:10}}>
        <NavLink to="/" end style={({isActive})=>({color:isActive?'#fff':'#9aa6c0',textDecoration:'none'})}>Dashboard</NavLink>
        <NavLink to="/customers" style={({isActive})=>({color:isActive?'#fff':'#9aa6c0',textDecoration:'none'})}>Customers</NavLink>
        <NavLink to="/invoices" style={({isActive})=>({color:isActive?'#fff':'#9aa6c0',textDecoration:'none'})}>Invoices</NavLink>
        <NavLink to="/payments" style={({isActive})=>({color:isActive?'#fff':'#9aa6c0',textDecoration:'none'})}>Payments</NavLink>
      </nav>
    </aside>
  )
}

export default Sidebar
