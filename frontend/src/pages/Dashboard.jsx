import React, { useEffect, useState } from 'react'
import DashboardCards from '../components/DashboardCards'
import { getTotals } from '../services/api'

const Dashboard = () => {
  const [totals, setTotals] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const res = await getTotals()
        setTotals(res.data.data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return (
    <div>
      <h1>Dashboard</h1>
      {loading ? <div className="card">Loading...</div> : <DashboardCards totals={totals} />}
      {error && <div className="card">Error: {error}</div>}
    </div>
  )
}

export default Dashboard
