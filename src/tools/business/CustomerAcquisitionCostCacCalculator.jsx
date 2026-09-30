import { useState } from 'react'
import { Field, Msg, CopyBtn } from '../../components/ui.jsx'

export default function CustomerAcquisitionCostCacCalculator() {
  const [adSpend, setAdSpend] = useState('15000')
  const [salesSalaries, setSalesSalaries] = useState('20000')
  const [newCustomers, setNewCustomers] = useState('140')
  const [res, setRes] = useState(null)
  const [err, setErr] = useState('')

  const calc = () => {
    try {
      
      const ad = parseFloat(adSpend), sal = parseFloat(salesSalaries), cust = parseFloat(newCustomers)
      if (isNaN(ad) || isNaN(sal) || isNaN(cust) || cust <= 0 || ad < 0 || sal < 0) return setErr('Enter valid expenses and customer count.')
      setErr('')
      const totalCost = ad + sal
      const cac = totalCost / cust
      setRes({ val: `CAC: $${cac.toFixed(2)} per customer (Total Spend: $${totalCost.toLocaleString()} for ${cust} customers)`, copyText: `CAC: $${cac.toFixed(2)} per customer. Total Spend: $${totalCost}` })
    
    } catch (e) {
      setErr(e.message || 'Calculation error.')
    }
  }

  const reset = () => { setAdSpend('15000'); setSalesSalaries('20000'); setNewCustomers('140'); setRes(null); setErr('') }

  return (
    <div>
      <div className="row">
        
        
        <Field label="Marketing & Ad Spend ($)">
          <input type="number"  value={adSpend} onChange={(e) => setAdSpend(e.target.value)} placeholder="" />
        </Field>
        <Field label="Sales Salaries & Commissions ($)">
          <input type="number"  value={salesSalaries} onChange={(e) => setSalesSalaries(e.target.value)} placeholder="" />
        </Field>
        <Field label="New Customers Acquired">
          <input type="number"  value={newCustomers} onChange={(e) => setNewCustomers(e.target.value)} placeholder="" />
        </Field>
      </div>
      <div className="actions" style={{ marginTop: '1rem' }}>
        <button className="btn" onClick={calc}>Calculate / Process</button>
        <button className="btn ghost" onClick={reset}>Reset</button>
      </div>
      <Msg>{err}</Msg>
      {res && (
        <div className="out" role="status" style={{ marginTop: '1rem' }}>
          {typeof res === 'string' ? (
            <p>Result: <strong>{res}</strong></p>
          ) : (
            <div>
              <p>Result: <strong>{res.val}</strong></p>
            </div>
          )}
          <CopyBtn text={typeof res === 'string' ? res : (res.copyText || JSON.stringify(res))} />
        </div>
      )}
    </div>
  )
}