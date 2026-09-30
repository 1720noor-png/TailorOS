import { useState } from 'react'

export default function MonthlyBudgetPlanner() {
  const [monthlyIncome, setMonthlyIncome] = useState(4000)
  const [savingsGoal, setSavingsGoal] = useState(800)

  const [expenses, setExpenses] = useState([
    { id: 1, name: 'Rent / Mortgage', category: 'Fixed', amount: 1500 },
    { id: 2, name: 'Utilities & Bills', category: 'Fixed', amount: 250 },
    { id: 3, name: 'Groceries', category: 'Variable', amount: 500 },
    { id: 4, name: 'Dining & Entertainment', category: 'Variable', amount: 350 },
    { id: 5, name: 'Transport / Fuel', category: 'Variable', amount: 200 }
  ])

  const addExpense = () => {
    setExpenses((prev) => [...prev, { id: Date.now(), name: '', category: 'Variable', amount: 0 }])
  }

  const updateExpense = (id, field, val) => {
    setExpenses((prev) => prev.map((e) => (e.id === id ? { ...e, [field]: field === 'amount' ? parseFloat(val) || 0 : val } : e)))
  }

  const removeExpense = (id) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id))
  }

  const incomeNum = parseFloat(monthlyIncome) || 0
  const savingsNum = parseFloat(savingsGoal) || 0

  const totalFixed = expenses.filter((e) => e.category === 'Fixed').reduce((sum, e) => sum + e.amount, 0)
  const totalVariable = expenses.filter((e) => e.category === 'Variable').reduce((sum, e) => sum + e.amount, 0)
  const totalExpenses = totalFixed + totalVariable

  const remainingIncome = incomeNum - totalExpenses - savingsNum

  // 50/30/20 Rule comparison
  const targetNeeds = incomeNum * 0.5
  const targetWants = incomeNum * 0.3
  const targetSavings = incomeNum * 0.2

  return (
    <div className="panel">
      <h2>Monthly Budget & Savings Planner</h2>
      <p className="hint">Plan monthly income, fixed and variable expenses, savings targets, and 50/30/20 budget allocations.</p>

      <div className="row">
        <div className="field">
          <span>Monthly Net Income ($)</span>
          <input type="number" step={100} value={monthlyIncome} onChange={(e) => setMonthlyIncome(e.target.value)} />
        </div>

        <div className="field">
          <span>Target Monthly Savings ($)</span>
          <input type="number" step={50} value={savingsGoal} onChange={(e) => setSavingsGoal(e.target.value)} />
        </div>
      </div>

      <h3>Monthly Expense Items</h3>
      <ul className="items">
        {expenses.map((exp) => (
          <li key={exp.id} className="item">
            <input
              type="text"
              value={exp.name}
              onChange={(e) => updateExpense(exp.id, 'name', e.target.value)}
              placeholder="Expense Name (e.g. Rent)"
              style={{ flex: 2 }}
            />
            <select value={exp.category} onChange={(e) => updateExpense(exp.id, 'category', e.target.value)} style={{ flex: 1 }}>
              <option value="Fixed">Fixed Need</option>
              <option value="Variable">Variable Want</option>
            </select>
            <input
              type="number"
              value={exp.amount}
              onChange={(e) => updateExpense(exp.id, 'amount', e.target.value)}
              placeholder="Amount ($)"
              style={{ flex: 1 }}
            />
            <button className="btn ghost" style={{ color: 'var(--bad)' }} onClick={() => removeExpense(exp.id)}>✕</button>
          </li>
        ))}
      </ul>
      <button className="btn ghost" onClick={addExpense}>+ Add Expense Item</button>

      <div className="out" style={{ marginTop: '1.5rem' }}>
        <h3>Budget Summary</h3>
        <div className="row" style={{ marginBottom: '1rem' }}>
          <div>Monthly Income: <strong>${incomeNum.toLocaleString()}</strong></div>
          <div>Total Expenses: <strong>${totalExpenses.toLocaleString()}</strong></div>
          <div>Savings Goal: <strong>${savingsNum.toLocaleString()}</strong></div>
          <div>
            Remaining Discretionary:{' '}
            <strong style={{ color: remainingIncome >= 0 ? 'var(--ok)' : 'var(--bad)' }}>
              ${remainingIncome.toLocaleString()}
            </strong>
          </div>
        </div>

        <h4>50/30/20 Ideal Rule Benchmark</h4>
        <div className="row">
          <div>Needs (50% Target: ${targetNeeds}): <strong>${totalFixed}</strong></div>
          <div>Wants (30% Target: ${targetWants}): <strong>${totalVariable}</strong></div>
          <div>Savings (20% Target: ${targetSavings}): <strong>${savingsNum}</strong></div>
        </div>
      </div>
    </div>
  )
}
