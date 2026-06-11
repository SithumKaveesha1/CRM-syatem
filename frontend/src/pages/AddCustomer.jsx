import React, { useState } from 'react'
import { createCustomer } from '../services/api'
import { useNavigate } from 'react-router-dom'

const AddCustomer = () => {
  const [form, setForm] = useState({ full_name: '', email: '', phone: '', address: '' })
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const validate = () => {
    if (!form.full_name) return 'Name required'
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) return 'Invalid email'
    if (!/^\+?[0-9\-\s]{6,20}$/.test(form.phone)) return 'Invalid phone'
    return null
  }

  const submit = async (e) => {
    e.preventDefault()
    const v = validate()
    if (v) return setError(v)
    await createCustomer(form)
    navigate('/customers')
  }

  return (
    <div>
      <h1>Add Customer</h1>
      <div className="card">
        {error && <div style={{color:'red'}}>{error}</div>}
        <form onSubmit={submit}>
          <div className="form-row">
            <div className="field">
              <label>Name</label>
              <input value={form.full_name} onChange={(e)=>setForm({...form,full_name:e.target.value})} />
            </div>
            <div className="field">
              <label>Email</label>
              <input value={form.email} onChange={(e)=>setForm({...form,email:e.target.value})} />
            </div>
          </div>
          <div className="form-row">
            <div className="field">
              <label>Phone</label>
              <input value={form.phone} onChange={(e)=>setForm({...form,phone:e.target.value})} />
            </div>
            <div className="field">
              <label>Address</label>
              <input value={form.address} onChange={(e)=>setForm({...form,address:e.target.value})} />
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

export default AddCustomer
