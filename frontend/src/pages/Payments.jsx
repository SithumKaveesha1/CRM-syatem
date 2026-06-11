import React, { useEffect, useState } from 'react'
import { getPayments, createPayment } from '../services/api'

const Payments = () => {
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ invoice_id: '', amount: '' })

  const load = async () => {
    setLoading(true)
    try {
      const res = await getPayments()
      setPayments(res.data.data.rows || res.data.data)
    } catch (err) { console.error(err) } finally { setLoading(false) }
  }

  useEffect(()=>{load()}, [])

  const submit = async (e) => {
    e.preventDefault()
    await createPayment({ ...form, amount: Number(form.amount) })
    setForm({ invoice_id: '', amount: '' })
    load()
  }

  return (
    <div>
      <h1>Payments</h1>
      <div className="card">
        <form onSubmit={submit} style={{display:'flex',gap:8,alignItems:'center'}}>
          <input placeholder="Invoice ID" value={form.invoice_id} onChange={(e)=>setForm({...form,invoice_id:e.target.value})} />
          <input placeholder="Amount" value={form.amount} onChange={(e)=>setForm({...form,amount:e.target.value})} />
          <button className="btn" type="submit">Add</button>
        </form>
      </div>

      <div className="card">
        {loading ? 'Loading...' : (
          <table className="table">
            <thead><tr><th>#</th><th>Invoice ID</th><th>Amount</th><th>Date</th></tr></thead>
            <tbody>
              {payments.map((p, i)=> (
                <tr key={p.payment_id}><td>{i+1}</td><td>{p.invoice_id}</td><td>${Number(p.amount).toFixed(2)}</td><td>{p.payment_date}</td></tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

export default Payments
