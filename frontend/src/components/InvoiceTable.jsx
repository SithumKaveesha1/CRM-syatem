import React from 'react'

const InvoiceTable = ({ data = [], onEdit, onDelete }) => {
  return (
    <table className="table">
      <thead>
        <tr>
          <th>#</th>
          <th>Invoice No</th>
          <th>Customer ID</th>
          <th>Total</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {data.map((i, idx) => (
          <tr key={i.invoice_id}>
            <td>{idx + 1}</td>
            <td>{i.invoice_no}</td>
            <td>{i.customer_id}</td>
            <td>${Number(i.total_amount).toFixed(2)}</td>
            <td>{i.status}</td>
            <td>
              <button className="btn ghost" onClick={() => onEdit(i)}>Edit</button>
              <button className="btn" style={{marginLeft:8}} onClick={() => onDelete(i.invoice_id)}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default InvoiceTable
