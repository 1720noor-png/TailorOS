// Pure calculation logic for the Shopping tools. Every function throws Error(message) on bad input.
import { opt, sum, pct } from './calc.js'

const anyData = (r, keys) => keys.some((k) => String(r[k] ?? '').trim() !== '')

export function salesTax(amount, rate, mode) {
  if (!(amount >= 0)) throw new Error('Enter an amount of 0 or more.')
  if (!(rate >= 0 && rate <= 100)) throw new Error('Tax rate must be between 0 and 100.')
  if (mode === 'remove') { const net = amount / (1 + rate / 100); return { net, tax: amount - net, gross: amount } }
  const tax = (amount * rate) / 100
  return { net: amount, tax, gross: amount + tax }
}

export function tip(bill, tipPct, people, roundUp) {
  if (!(bill >= 0)) throw new Error('Enter a bill amount of 0 or more.')
  if (!(tipPct >= 0 && tipPct <= 100)) throw new Error('Tip must be between 0 and 100 percent.')
  if (!Number.isInteger(people) || people < 1 || people > 100) throw new Error('Number of people must be a whole number from 1 to 100.')
  const exact = bill + (bill * tipPct) / 100
  const perExact = exact / people
  const per = roundUp ? Math.ceil(perExact - 1e-9) : perExact
  const total = roundUp ? per * people : exact
  return { tip: total - bill, total, per, tipPct: bill > 0 ? ((total - bill) / bill) * 100 : tipPct, rounded: !!roundUp }
}

export function splitEqual(total, tipPct, people) {
  if (!(total >= 0)) throw new Error('Enter a bill total of 0 or more.')
  if (!(tipPct >= 0 && tipPct <= 100)) throw new Error('Tip must be between 0 and 100 percent.')
  if (!Number.isInteger(people) || people < 2 || people > 100) throw new Error('Number of people must be a whole number from 2 to 100.')
  const tipAmt = (total * tipPct) / 100
  const grand = total + tipAmt
  return { tip: tipAmt, grand, per: grand / people }
}

// people: [{name, own}] ; shared, tax: amounts; tipPct: percent of the pre-tax subtotal.
export function splitItems(people, shared, tax, tipPct) {
  const rows = people.filter((p) => anyData(p, ['name', 'own']))
  if (rows.length < 2) throw new Error('Add at least two people.')
  const own = rows.map((p, i) => {
    const v = opt(p.own, 0)
    if (!(v >= 0)) throw new Error(`Amount for person ${i + 1} must be 0 or more.`)
    return v
  })
  if (!(shared >= 0)) throw new Error('Shared items must be 0 or more.')
  if (!(tax >= 0)) throw new Error('Tax must be 0 or more.')
  if (!(tipPct >= 0 && tipPct <= 100)) throw new Error('Tip must be between 0 and 100 percent.')
  const n = rows.length
  const subs = own.map((o) => o + shared / n)
  const subtotal = sum(subs)
  if (subtotal <= 0) throw new Error('Enter at least one amount.')
  const out = rows.map((p, i) => {
    const t = (tax * subs[i]) / subtotal
    const tp = (subs[i] * tipPct) / 100
    return { name: p.name.trim() || `Person ${i + 1}`, own: own[i], share: shared / n, tax: t, tip: tp, total: subs[i] + t + tp }
  })
  return { rows: out, subtotal, tax, tip: (subtotal * tipPct) / 100, grand: subtotal + tax + (subtotal * tipPct) / 100 }
}

const UNITS = {
  g: { dim: 'weight', f: 1 }, kg: { dim: 'weight', f: 1000 }, oz: { dim: 'weight', f: 28.349523125 }, lb: { dim: 'weight', f: 453.59237 },
  ml: { dim: 'volume', f: 1 }, l: { dim: 'volume', f: 1000 }, 'fl oz': { dim: 'volume', f: 29.5735295625 }, gal: { dim: 'volume', f: 3785.411784 },
  each: { dim: 'count', f: 1 },
}
export const UNIT_NAMES = Object.keys(UNITS)
const BASE = { weight: { size: 100, label: 'per 100 g', altSize: 1000, altLabel: 'per kg' }, volume: { size: 100, label: 'per 100 ml', altSize: 1000, altLabel: 'per litre' }, count: { size: 1, label: 'per item', altSize: null, altLabel: '' } }

export function unitPrices(rows) {
  const items = []
  rows.forEach((r, i) => {
    if (!anyData(r, ['name', 'price', 'qty'])) return
    const price = Number(String(r.price).trim() === '' ? NaN : r.price)
    const qty = Number(String(r.qty).trim() === '' ? NaN : r.qty)
    if (!(price >= 0)) throw new Error(`Row ${i + 1}: enter a price of 0 or more.`)
    if (!(qty > 0)) throw new Error(`Row ${i + 1}: quantity must be greater than 0.`)
    const u = UNITS[r.unit]
    if (!u) throw new Error(`Row ${i + 1}: choose a unit.`)
    const base = qty * u.f
    const b = BASE[u.dim]
    items.push({ name: r.name.trim() || `Item ${i + 1}`, price, qty, unit: r.unit, dim: u.dim, per: (price / base) * b.size, alt: b.altSize ? (price / base) * b.altSize : null })
  })
  if (!items.length) throw new Error('Enter at least one item with a price and quantity.')
  return ['weight', 'volume', 'count'].filter((d) => items.some((x) => x.dim === d)).map((d) => {
    const list = items.filter((x) => x.dim === d).sort((a, b) => a.per - b.per)
    const best = list[0].per
    return { dim: d, label: BASE[d].label, altLabel: BASE[d].altLabel, compare: list.length > 1, items: list.map((x, i) => ({ ...x, best: i === 0 && list.length > 1, morePct: best > 0 ? ((x.per - best) / best) * 100 : 0 })) }
  })
}

// rows: [{name, price, ship, disc}] ; taxPct applies to the discounted price (not to shipping).
export function comparePrices(rows, taxPct) {
  if (!(taxPct >= 0 && taxPct <= 100)) throw new Error('Tax must be between 0 and 100 percent.')
  const items = []
  rows.forEach((r, i) => {
    if (!anyData(r, ['name', 'price', 'ship', 'disc'])) return
    const price = Number(String(r.price).trim() === '' ? NaN : r.price)
    if (!(price >= 0)) throw new Error(`Option ${i + 1}: enter a price of 0 or more.`)
    const ship = opt(r.ship, 0), disc = opt(r.disc, 0)
    if (!(ship >= 0)) throw new Error(`Option ${i + 1}: shipping must be 0 or more.`)
    if (!(disc >= 0 && disc <= 100)) throw new Error(`Option ${i + 1}: discount must be between 0 and 100.`)
    const after = price * (1 - disc / 100)
    const tax = (after * taxPct) / 100
    items.push({ name: r.name.trim() || `Option ${i + 1}`, price, disc, after, tax, ship, final: after + tax + ship })
  })
  if (items.length < 2) throw new Error('Enter prices for at least two options to compare.')
  items.sort((a, b) => a.final - b.final)
  const best = items[0].final
  return items.map((x, i) => ({ ...x, best: i === 0, more: x.final - best, morePct: best > 0 ? ((x.final - best) / best) * 100 : 0 }))
}

// rows: [{name, price, qty, type:'Need'|'Want'}]
export function shopBudget(budget, rows) {
  if (!(budget > 0)) throw new Error('Enter a budget greater than 0.')
  const items = []
  rows.forEach((r, i) => {
    if (!anyData(r, ['name', 'price', 'qty'])) return
    const price = Number(String(r.price).trim() === '' ? NaN : r.price)
    const qty = opt(r.qty, 1)
    if (!(price >= 0)) throw new Error(`Row ${i + 1}: enter a price of 0 or more.`)
    if (!(qty > 0)) throw new Error(`Row ${i + 1}: quantity must be greater than 0.`)
    items.push({ name: r.name.trim() || `Item ${i + 1}`, type: r.type, cost: price * qty })
  })
  if (!items.length) throw new Error('Add at least one item with a price.')
  const needs = sum(items.filter((x) => x.type === 'Need').map((x) => x.cost))
  const wants = sum(items.filter((x) => x.type !== 'Need').map((x) => x.cost))
  const total = needs + wants
  const room = budget - needs
  const fits = []
  let acc = 0
  for (const w of items.filter((x) => x.type !== 'Need')) if (acc + w.cost <= room + 1e-9) { fits.push(w.name); acc += w.cost }
  return { items, needs, wants, total, remaining: budget - total, used: pct(total, budget), room, fits, fitsCost: acc }
}

// Shared by the gift and grocery planners. rows: [{<labelKey>, planned, spent, ...extra}]; extra fields are kept.
function plan(budget, rows, labelKey, what) {
  if (!(budget > 0)) throw new Error('Enter a budget greater than 0.')
  const items = []
  rows.forEach((r, i) => {
    if (!anyData(r, [labelKey, 'planned', 'spent'])) return
    const planned = opt(r.planned, 0), spent = opt(r.spent, 0)
    if (!(planned >= 0)) throw new Error(`Row ${i + 1}: planned amount must be 0 or more.`)
    if (!(spent >= 0)) throw new Error(`Row ${i + 1}: spent amount must be 0 or more.`)
    const label = String(r[labelKey] ?? '').trim()
    if (!label) throw new Error(`Row ${i + 1}: enter a ${what} name.`)
    items.push({ ...r, label, planned, spent, left: planned - spent, over: spent > planned })
  })
  if (!items.length) throw new Error(`Add at least one ${what}.`)
  const planned = sum(items.map((x) => x.planned)), spent = sum(items.map((x) => x.spent))
  return { items, planned, spent, unallocated: budget - planned, remaining: budget - spent, usedPct: pct(spent, budget), plannedPct: pct(planned, budget) }
}
export const giftPlan = (budget, rows) => plan(budget, rows, 'who', 'recipient')
export const groceryPlan = (budget, rows) => plan(budget, rows, 'cat', 'category')
