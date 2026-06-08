import React from 'react'

const CustomerTable = ({ data = [], onEdit, onDelete }) => {
  return (
    <table className="table">
      <thead>
        <tr>
          <th>#</th>
          <th>Name</th>
          <th>Email</th>
          <th>Phone</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {data.map((c, i) => (
          <tr key={c.customer_id}>
            <td>{i + 1}</td>
            <td>{c.full_name}</td>
            <td>{c.email}</td>
            <td>{c.phone}</td>
            <td>
              <button className="btn ghost" onClick={() => onEdit(c)}>Edit</button>
              <button className="btn" style={{marginLeft:8}} onClick={() => onDelete(c.customer_id)}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default CustomerTable
