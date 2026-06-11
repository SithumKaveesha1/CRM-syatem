import React, { useEffect, useState } from 'react'
import { getCustomer, updateCustomer } from '../services/api'
import { useNavigate, useParams } from 'react-router-dom'

const EditCustomer = () => {
  const { id } = useParams()
  const [form, setForm] = useState({ full_name: '', email: '', phone: '', address: '' })
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const load = async () => {
      const res = await getCustomer(id)
      setForm(res.data.data)
      setLoading(false)
    }
    load()
  }, [id])

  const submit = async (e) => {
    e.preventDefault()
    await updateCustomer(id, form)
    navigate('/customers')
  }

  if (loading) return <div className="card">Loading...</div>

  return (
    <div>
      <h1>Edit Customer</h1>
      <div className="card">
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

export default EditCustomer
