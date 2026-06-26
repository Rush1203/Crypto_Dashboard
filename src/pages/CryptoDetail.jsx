import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import CryptoChart from '../components/CryptoChart'
import { API, fmt, fmtB } from '../utils/format'

export default function CryptoDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [info, setInfo] = useState(null)

  useEffect(() => {
    axios.get(`${API}/coins/${id}?localization=false&tickers=false&community_data=false&developer_data=false`)
      .then((res) => setInfo(res.data))
  }, [id])

  if (!info) return (
    <div className="flex items-center justify-center gap-3 py-20 text-gray-400 text-sm">
      <div className="w-6 h-6 border-2 border-gray-200 border-t-indigo-500 rounded-full animate-spin" />
      Loading…
    </div>
  )

  const md = info.market_data || {}
  const up = (md.price_change_percentage_24h || 0) >= 0

  const stats = [
    ['Market cap', fmtB(md.market_cap?.usd)],
    ['24h volume', fmtB(md.total_volume?.usd)],
    ['All-time high', '$' + fmt(md.ath?.usd)],
    ['All-time low', '$' + fmt(md.atl?.usd)],
    ['Circulating supply', (md.circulating_supply || 0).toLocaleString('en-US', { maximumFractionDigits: 0 })],
    ['Max supply', md.max_supply ? md.max_supply.toLocaleString('en-US', { maximumFractionDigits: 0 }) : '∞'],
  ]

  return (
    <div>
      <button onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 mb-5 px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-600 text-sm text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer">
        ← Back
      </button>

      <div className="flex items-start gap-4 mb-5">
        <img src={info.image?.large} alt={info.name} className="w-14 h-14 rounded-full flex-shrink-0" />
        <div>
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{info.name}</h1>
            <span className="text-sm text-gray-400 dark:text-gray-500">{info.symbol?.toUpperCase()}</span>
            {info.market_cap_rank && (
              <span className="px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-xs text-gray-500 dark:text-gray-400 font-medium">
                #{info.market_cap_rank}
              </span>
            )}
          </div>
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold text-gray-900 dark:text-gray-100">${fmt(md.current_price?.usd)}</span>
            <span className={`text-base font-semibold ${up ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500 dark:text-red-400'}`}>
              {up ? '+' : ''}{fmt(md.price_change_percentage_24h)}% 24h
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-5">
        {stats.map(([label, val]) => (
          <div key={label} className="stat-card">
            <div className="text-xs text-gray-400 dark:text-gray-500 mb-1">{label}</div>
            <div className="text-base font-semibold text-gray-900 dark:text-gray-100">{val}</div>
          </div>
        ))}
      </div>

      <CryptoChart coinId={id} />

      {info.description?.en && (
        <div className="card p-5">
          <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3">About {info.name}</h2>
          <div
            className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed [&_a]:text-indigo-600 dark:[&_a]:text-indigo-400"
            dangerouslySetInnerHTML={{ __html: info.description.en.split('. ').slice(0, 5).join('. ') + '.' }}
          />
        </div>
      )}
    </div>
  )
}
