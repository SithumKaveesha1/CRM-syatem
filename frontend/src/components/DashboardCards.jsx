import React from 'react'
import { formatLKR } from '../utils/currency'

const Card = ({ title, value }) => (
  <div className="card">
    <div className="muted">{title}</div>
    <div style={{fontSize:20,fontWeight:700}}>{value}</div>
  </div>
)

const DashboardCards = ({ totals }) => {
  return (
    <div className="grid">
      <Card title="Total Customers" value={totals.totalCustomers ?? 0} />
      <Card title="Total Invoices" value={totals.totalInvoices ?? 0} />
      <Card title="Total Revenue" value={formatLKR(totals.totalRevenue ?? 0)} />
      <Card title="Outstanding" value={formatLKR(totals.outstanding ?? 0)} />
    </div>
  )
}

export default DashboardCards
