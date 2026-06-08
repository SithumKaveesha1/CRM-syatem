import React, { useEffect, useState } from 'react'
import { getInvoices, deleteInvoice } from '../services/api'
import InvoiceTable from '../components/InvoiceTable'
import { useNavigate } from 'react-router-dom'

const Invoices = () => {
  const [invoices, setInvoices] = useState([])
  const [loading, setLoading] = useState(true)
  const [q, setQ] = useState('')
  const navigate = useNavigate()

  const load = async () => {
    setLoading(true)
    try {
      const res = await getInvoices({ invoice_no: q })
      setInvoices(res.data.data.rows || res.data.data)
    } catch (err) {
      console.error(err)
    } finally { setLoading(false) }
  }

  useEffect(()=>{load()}, [])

  const handleDelete = async (id) => {
    if (!confirm('Delete invoice?')) return
    await deleteInvoice(id)
    load()
  }

  return (
    <div>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <h1>Invoices</h1>
        <button className="btn" onClick={()=>navigate('/invoices/add')}>Add Invoice</button>
      </div>

      <div className="search">
        <input placeholder="Search invoice number" value={q} onChange={(e)=>setQ(e.target.value)} />
        <button className="btn ghost" onClick={load}>Search</button>
      </div>

      <div className="card">
        {loading ? 'Loading...' : <InvoiceTable data={invoices} onEdit={(i)=>navigate(`/invoices/${i.invoice_id}/edit`)} onDelete={handleDelete} />}
      </div>
    </div>
  )
}

export default Invoices
