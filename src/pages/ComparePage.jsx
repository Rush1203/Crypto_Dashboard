import React, { useState, useEffect, useMemo } from 'react'
import axios from 'axios'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import useCoins from '../hooks/useCoins'
import { API, fmt, fmtB } from '../utils/format'

const RANGES = [[7, '7D'], [30, '1M'], [90, '3M'], [365, '1Y']]
const COLOR_A = '#4f46e5'
const COLOR_B = '#0ea5e9'

function useChartData(idA, idB, days) {
  const [dataA, setDataA] = useState([])
  const [dataB, setDataB] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!idA || !idB) return
    setLoading(true)
    const get = (id, set) => axios.get(`${API}/coins/${id}/market_chart?vs_currency=usd&days=${days}`).then((r) => set(r.data.prices || []))
    Promise.all([get(idA, setDataA), get(idB, setDataB)]).finally(() => setLoading(false))
  }, [idA, idB, days])

  const merged = useMemo(() => {
    const len = Math.min(dataA.length, dataB.length)
    if (!len) return []
    const baseA = dataA[0][1], baseB = dataB[0][1]
    return dataA.slice(0, len).map(([t, pA], i) => ({
      time: new Date(t).toLocaleDateString([], { month: 'short', day: 'numeric' }),
      A: parseFloat((((pA - baseA) / baseA) * 100).toFixed(2)),
      B: parseFloat((((dataB[i][1] - baseB) / baseB) * 100).toFixed(2)),
    }))
  }, [dataA, dataB])

  return { merged, loading }
}

export default function ComparePage() {
  const { coins } = useCoins()
  const [coinA, setCoinA] = useState('bitcoin')
  const [coinB, setCoinB] = useState('ethereum')
  const [days, setDays] = useState(30)
  const { merged, loading } = useChartData(coinA, coinB, days)

  const a = coins.find((c) => c.id === coinA)
  const b = coins.find((c) => c.id === coinB)

  const rows = [
    { label: 'Price (USD)', va: a?.current_price, vb: b?.current_price, fmt: (v) => '$' + fmt(v), higher: true },
    { label: '24h change', va: a?.price_change_percentage_24h, vb: b?.price_change_percentage_24h, fmt: (v) => (v >= 0 ? '+' : '') + fmt(v) + '%', higher: true },
    { label: '7d change', va: a?.price_change_percentage_7d_in_currency, vb: b?.price_change_percentage_7d_in_currency, fmt: (v) => (v >= 0 ? '+' : '') + fmt(v) + '%', higher: true },
    { label: 'Market cap', va: a?.market_cap, vb: b?.market_cap, fmt: fmtB, higher: true },
    { label: '24h volume', va: a?.total_volume, vb: b?.total_volume, fmt: fmtB, higher: true },
    { label: 'Circ. supply', va: a?.circulating_supply, vb: b?.circulating_supply, fmt: (v) => fmtB(v)?.replace('$', ''), higher: false },
    { label: 'All-time high', va: a?.ath, vb: b?.ath, fmt: (v) => '$' + fmt(v), higher: true },
    { label: 'ATH % change', va: a?.ath_change_percentage, vb: b?.ath_change_percentage, fmt: (v) => (v >= 0 ? '+' : '') + fmt(v) + '%', higher: true },
  ]

  const CoinSelect = ({ label, val, set, color, coin }) => (
    <div className="card p-5">
      <div className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">{label}</div>
      <select value={val} onChange={(e) => set(e.target.value)} className="select mb-3">
        {coins.map((c) => <option key={c.id} value={c.id}>{c.name} ({c.symbol.toUpperCase()})</option>)}
      </select>
      {coin && (
        <div className="flex items-center gap-3 mt-3">
          <img src={coin.image} alt={coin.name} className="w-9 h-9 rounded-full" />
          <div>
            <div className="font-semibold text-sm text-gray-900 dark:text-gray-100">{coin.name}</div>
            <div className="text-lg font-bold mt-0.5" style={{ color }}>${fmt(coin.current_price)}</div>
            <div className={`text-xs font-medium ${(coin.price_change_percentage_24h || 0) >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500 dark:text-red-400'}`}>
              {(coin.price_change_percentage_24h || 0) >= 0 ? '+' : ''}{fmt(coin.price_change_percentage_24h)}% 24h
            </div>
          </div>
        </div>
      )}
    </div>
  )

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">Compare coins</h1>
      <p className="text-sm text-gray-400 dark:text-gray-500 mb-5">Side-by-side metrics and normalized price performance</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
        <CoinSelect label="Coin A (indigo)" val={coinA} set={setCoinA} color={COLOR_A} coin={a} />
        <CoinSelect label="Coin B (sky)" val={coinB} set={setCoinB} color={COLOR_B} coin={b} />
      </div>

      {/* Metrics */}
      <div className="card overflow-hidden mb-4">
        <div className="grid grid-cols-3 px-5 py-3 bg-gray-50 dark:bg-gray-700/50 border-b border-gray-100 dark:border-gray-700">
          <div className="text-right text-xs font-semibold text-indigo-600 dark:text-indigo-400">{a?.name || coinA}</div>
          <div className="text-center text-xs font-medium text-gray-400 dark:text-gray-500">Metric</div>
          <div className="text-left text-xs font-semibold text-sky-500 dark:text-sky-400">{b?.name || coinB}</div>
        </div>
        {rows.map(({ label, va, vb, fmt: fmtFn, higher }) => {
          const aWins = va != null && vb != null && (higher ? va > vb : va < vb)
          const bWins = va != null && vb != null && (higher ? vb > va : vb < va)
          return (
            <div key={label} className="grid grid-cols-3 px-5 py-3 border-t border-gray-100 dark:border-gray-700 text-sm">
              <div className={`text-right font-medium ${aWins ? 'text-emerald-600 dark:text-emerald-400' : bWins ? 'text-gray-400 dark:text-gray-500' : 'text-gray-900 dark:text-gray-100'}`}>
                {va != null ? fmtFn(va) : '—'}{aWins ? ' ↑' : ''}
              </div>
              <div className="text-center text-xs text-gray-400 dark:text-gray-500 flex items-center justify-center">{label}</div>
              <div className={`text-left font-medium ${bWins ? 'text-emerald-600 dark:text-emerald-400' : aWins ? 'text-gray-400 dark:text-gray-500' : 'text-gray-900 dark:text-gray-100'}`}>
                {vb != null ? fmtFn(vb) : '—'}{bWins ? ' ↑' : ''}
              </div>
            </div>
          )
        })}
      </div>

      {/* Normalized chart */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">Normalized performance (% from start)</span>
          <div className="flex gap-1">
            {RANGES.map(([d, l]) => (
              <button key={d}
                onClick={() => setDays(d)}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors border-0 cursor-pointer
                  ${days === d ? 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
                {l}
              </button>
            ))}
          </div>
        </div>
        <div className="flex gap-4 mb-3">
          <div className="flex items-center gap-1.5 text-xs font-medium text-gray-600 dark:text-gray-300">
            <div className="w-5 h-0.5 rounded" style={{ background: COLOR_A }} />{a?.name || coinA}
          </div>
          <div className="flex items-center gap-1.5 text-xs font-medium text-gray-600 dark:text-gray-300">
            <div className="w-5 h-0.5 rounded" style={{ background: COLOR_B }} />{b?.name || coinB}
          </div>
        </div>
        {loading || !merged.length ? (
          <div className="flex items-center justify-center h-60">
            <div className="w-6 h-6 border-2 border-gray-200 border-t-indigo-500 rounded-full animate-spin" />
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={merged} margin={{ top: 4, right: 8, left: 8, bottom: 0 }}>
              <XAxis dataKey="time" tick={{ fontSize: 11, fill: '#9ca3af' }} tickLine={false} axisLine={false} interval="preserveStartEnd" />
              <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} tickLine={false} axisLine={false} tickFormatter={(v) => v.toFixed(1) + '%'} />
              <Tooltip
                contentStyle={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 8, fontSize: 12 }}
                formatter={(v, name) => [v.toFixed(2) + '%', name === 'A' ? (a?.name || coinA) : (b?.name || coinB)]} />
              <Line type="monotone" dataKey="A" stroke={COLOR_A} strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="B" stroke={COLOR_B} strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  )
}
