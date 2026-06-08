import React, { useEffect, useState } from 'react'
import { getCustomers, deleteCustomer } from '../services/api'
import CustomerTable from '../components/CustomerTable'
import { useNavigate } from 'react-router-dom'

const Customers = () => {
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [q, setQ] = useState('')
  const navigate = useNavigate()

  const load = async () => {
    setLoading(true)
    try {
      const res = await getCustomers({ q })
      setCustomers(res.data.data.rows || res.data.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const handleDelete = async (id) => {
    if (!confirm('Delete customer?')) return
    await deleteCustomer(id)
    load()
  }

  return (
    <div>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <h1>Customers</h1>
        <div>
          <button className="btn" onClick={() => navigate('/customers/add')}>Add Customer</button>
        </div>
      </div>

      <div className="search">
        <input placeholder="Search name or email" value={q} onChange={(e)=>setQ(e.target.value)} />
        <button className="btn ghost" onClick={load}>Search</button>
      </div>

      <div className="card">
        {loading ? 'Loading...' : <CustomerTable data={customers} onEdit={(c)=>navigate(`/customers/${c.customer_id}/edit`)} onDelete={handleDelete} />}
      </div>
    </div>
  )
}

export default Customers
