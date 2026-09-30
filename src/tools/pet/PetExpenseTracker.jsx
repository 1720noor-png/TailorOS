import { useState } from 'react'
import { Field, CopyBtn, download } from '../../components/ui.jsx'

export default function PetExpenseTracker() {
  const [expenses, setExpenses] = useState([
    { id: 1, name: 'Premium Dog Food (Monthly)', category: 'Food', cost: 65 },
    { id: 2, name: 'Vet Wellness Check & Vaccines', category: 'Vet / Medical', cost: 180 },
    { id: 3, name: 'Grooming Session', category: 'Grooming', cost: 55 },
    { id: 4, name: 'Chew Toys & Leash', category: 'Toys / Supplies', cost: 30 },
  ])

  const [newName, setNewName] = useState('')
  const [newCat, setNewCat] = useState('Food')
  const [newCost, setNewCost] = useState('')

  const addExpense = (e) => {
    e.preventDefault()
    if (!newName.trim() || !newCost) return
    setExpenses((prev) => [
      ...prev,
      { id: Date.now(), name: newName.trim(), category: newCat, cost: Number(newCost) || 0 },
    ])
    setNewName('')
    setNewCost('')
  }

  const removeExpense = (id) => {
    setExpenses((prev) => prev.filter((item) => item.id !== id))
  }

  const totalCost = expenses.reduce((acc, curr) => acc + curr.cost, 0)

  const fmt = (n) => '$' + n.toFixed(2)

  const reportText = `Pet Expense Tracker Report
-----------------------------------------
Total Expenses Tracked: ${fmt(totalCost)}

Breakdown:
${expenses.map((e) => `• [${e.category}] ${e.name}: ${fmt(e.cost)}`).join('\n')}`

  return (
    <div className="tool-body">
      <form onSubmit={addExpense} className="row" style={{ marginBottom: '1.2rem' }}>
        <Field label="Expense Item Name">
          <input
            type="text"
            placeholder="e.g. Flea Medication"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
        </Field>
        <Field label="Category">
          <select value={newCat} onChange={(e) => setNewCat(e.target.value)}>
            <option value="Food">Food & Treats</option>
            <option value="Vet / Medical">Vet & Medical</option>
            <option value="Grooming">Grooming & Hygiene</option>
            <option value="Toys / Supplies">Toys & Gear</option>
            <option value="Boarding / Care">Boarding / Pet Sitting</option>
          </select>
        </Field>
        <Field label="Cost ($)">
          <input
            type="number"
            min="0"
            step="0.01"
            placeholder="0.00"
            value={newCost}
            onChange={(e) => setNewCost(e.target.value)}
          />
        </Field>
        <div style={{ display: 'flex', alignItems: 'end', marginBottom: '0.8rem' }}>
          <button type="submit" className="btn">
            ➕ Add Expense
          </button>
        </div>
      </form>

      <div className="out">
        <div>Total Expenses: <strong>{fmt(totalCost)}</strong></div>
        <div className="hint" style={{ marginTop: '0.4rem' }}>
          Items Tracked: {expenses.length}
        </div>
      </div>

      <div className="scroll" style={{ marginTop: '1rem' }}>
        <table className="tbl">
          <thead>
            <tr>
              <th>Expense Description</th>
              <th>Category</th>
              <th>Cost ($)</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((e) => (
              <tr key={e.id}>
                <td><strong>{e.name}</strong></td>
                <td>{e.category}</td>
                <td>{fmt(e.cost)}</td>
                <td>
                  <button
                    type="button"
                    className="btn ghost"
                    style={{ color: 'var(--bad)', borderColor: 'var(--bad)' }}
                    onClick={() => removeExpense(e.id)}
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="actions" style={{ marginTop: '1rem' }}>
        <CopyBtn text={reportText} label="Copy Expense Report" />
        <button type="button" className="btn ghost" onClick={() => download('pet-expenses.txt', reportText)}>
          Download (.txt)
        </button>
      </div>
    </div>
  )
}
