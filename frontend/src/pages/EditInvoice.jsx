import React, { useEffect, useState } from 'react'
import { getInvoice, updateInvoice } from '../services/api'
import { useNavigate, useParams } from 'react-router-dom'

const EditInvoice = () => {
  const { id } = useParams()
  const [form, setForm] = useState({ invoice_no: '', customer_id: '', invoice_date: '', total_amount: '' })
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(()=>{
    const load = async()=>{
      const res = await getInvoice(id)
      setForm(res.data.data)
      setLoading(false)
    }
    load()
  },[id])

  const submit = async (e) => {
    e.preventDefault()
    await updateInvoice(id, form)
    navigate('/invoices')
  }

  if (loading) return <div className="card">Loading...</div>

  return (
    <div>
      <h1>Edit Invoice</h1>
      <div className="card">
        <form onSubmit={submit}>
          <div className="form-row">
            <div className="field">
              <label>Invoice No</label>
              <input value={form.invoice_no} onChange={(e)=>setForm({...form,invoice_no:e.target.value})} />
            </div>
            <div className="field">
              <label>Customer ID</label>
              <input value={form.customer_id} onChange={(e)=>setForm({...form,customer_id:e.target.value})} />
            </div>
          </div>
          <div className="form-row">
            <div className="field">
              <label>Invoice Date</label>
              <input type="date" value={form.invoice_date?.split?.('T')?.[0]||''} onChange={(e)=>setForm({...form,invoice_date:e.target.value})} />
            </div>
            <div className="field">
              <label>Total Amount</label>
              <input value={form.total_amount} onChange={(e)=>setForm({...form,total_amount:e.target.value})} />
            </div>
          </div>
          <div style={{marginTop:12}}>
            <button className="btn" type="submit">Save</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditInvoice
