import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { API, fmt } from '../utils/format'

const RANGES = [[1, '1D'], [7, '7D'], [30, '1M'], [90, '3M'], [365, '1Y']]

export default function CryptoChart({ coinId }) {
  const [data, setData] = useState([])
  const [days, setDays] = useState(7)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    axios.get(`${API}/coins/${coinId}/market_chart?vs_currency=usd&days=${days}`)
      .then((res) => {
        const prices = res.data.prices.map(([t, p]) => ({
          time: days <= 1
            ? new Date(t).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            : new Date(t).toLocaleDateString([], { month: 'short', day: 'numeric' }),
          price: p,
        }))
        setData(prices)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [coinId, days])

  const up = data.length > 1 && data[data.length - 1].price >= data[0].price
  const color = up ? '#10b981' : '#ef4444'

  return (
    <div className="card p-5 mb-4">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">Price chart</span>
        <div className="flex gap-1">
          {RANGES.map(([d, l]) => (
            <button key={d} onClick={() => setDays(d)}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors border-0 cursor-pointer
                ${days === d ? 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
              {l}
            </button>
          ))}
        </div>
      </div>
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-6 h-6 border-2 border-gray-200 border-t-indigo-500 rounded-full animate-spin" />
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={data} margin={{ top: 4, right: 8, left: 8, bottom: 0 }}>
            <defs>
              <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.15} />
                <stop offset="95%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="time" tick={{ fontSize: 11, fill: '#9ca3af' }} tickLine={false} axisLine={false} interval="preserveStartEnd" />
            <YAxis domain={['auto', 'auto']} tick={{ fontSize: 11, fill: '#9ca3af' }} tickLine={false} axisLine={false}
              tickFormatter={(v) => '$' + (v >= 1000 ? (v / 1000).toFixed(1) + 'k' : v.toFixed(2))} />
            <Tooltip contentStyle={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 8, fontSize: 12 }} formatter={(v) => ['$' + fmt(v), 'Price']} />
            <Area type="monotone" dataKey="price" stroke={color} strokeWidth={2} fill="url(#chartGrad)" dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}
