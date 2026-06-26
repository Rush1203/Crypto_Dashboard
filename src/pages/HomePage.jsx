import React, { useState, useMemo } from 'react'
import useCoins from '../hooks/useCoins'
import CryptoTable from '../components/CryptoTable'
import Toast from '../components/Toast'
import { fmtB } from '../utils/format'

export default function HomePage() {
  const { coins, loading, error } = useCoins()
  const [search, setSearch] = useState('')
  const [toast, setToast] = useState(null)

  const filtered = useMemo(() =>
    coins.filter((c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.symbol.toLowerCase().includes(search.toLowerCase())
    ), [coins, search])

  const totalMcap = coins.reduce((s, c) => s + (c.market_cap || 0), 0)
  const gainers = coins.filter((c) => c.price_change_percentage_24h > 0).length

  if (error) return <div className="p-10 text-center text-red-500 text-sm">Failed to load data. Check your connection.</div>

  const statCards = [
    { label: 'Total market cap', value: fmtB(totalMcap), sub: 'Top 100 coins', color: '' },
    { label: 'Coins tracked', value: coins.length, sub: 'By market cap', color: '' },
    { label: 'Gainers (24h)', value: gainers, sub: `Out of ${coins.length}`, color: 'text-emerald-600 dark:text-emerald-400' },
    { label: 'Losers (24h)', value: coins.length - gainers, sub: `Out of ${coins.length}`, color: 'text-red-500 dark:text-red-400' },
  ]

  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        {statCards.map(({ label, value, sub, color }) => (
          <div key={label} className="stat-card">
            <div className="text-xs text-gray-400 dark:text-gray-500 mb-1">{label}</div>
            <div className={`text-2xl font-semibold ${color || 'text-gray-900 dark:text-gray-100'}`}>{value}</div>
            <div className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{sub}</div>
          </div>
        ))}
      </div>

      <input className="input mb-4" placeholder="Search by name or symbol…" value={search} onChange={(e) => setSearch(e.target.value)} />

      {loading ? (
        <div className="flex items-center justify-center gap-3 py-16 text-gray-400 text-sm">
          <div className="w-5 h-5 border-2 border-gray-200 border-t-indigo-500 rounded-full animate-spin" />
          Loading coins…
        </div>
      ) : (
        <CryptoTable coins={filtered} onToast={setToast} />
      )}

      {toast && <Toast message={toast} onDone={() => setToast(null)} />}
    </div>
  )
}
