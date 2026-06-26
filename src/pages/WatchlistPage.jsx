import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toggleWatch } from '../redux/watchlistSlice'
import useCoins from '../hooks/useCoins'
import Sparkline from '../components/Sparkline'
import { fmt } from '../utils/format'

export default function WatchlistPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { coins } = useCoins()
  const watchlistIds = useSelector((s) => s.watchlist.ids)
  const watched = coins.filter((c) => watchlistIds.includes(c.id))

  if (!watched.length) return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="text-5xl mb-4 opacity-20">☆</div>
      <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-2">No saved coins yet</h2>
      <p className="text-sm text-gray-400 dark:text-gray-500 max-w-xs leading-relaxed">
        Hit "☆ Save" on any coin in the Market table to track it here.
      </p>
    </div>
  )

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">Watchlist</h1>
      <p className="text-sm text-gray-400 dark:text-gray-500 mb-5">
        {watched.length} saved coin{watched.length !== 1 ? 's' : ''}
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {watched.map((coin) => {
          const up = (coin.price_change_percentage_24h || 0) >= 0
          const up7 = (coin.price_change_percentage_7d_in_currency || 0) >= 0
          return (
            <div key={coin.id}
              className="card p-4 cursor-pointer hover:border-indigo-400 dark:hover:border-indigo-600 hover:shadow-sm transition-all"
              onClick={() => navigate(`/coin/${coin.id}`)}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <img src={coin.image} alt={coin.name} className="w-8 h-8 rounded-full" />
                  <div>
                    <div className="font-semibold text-sm text-gray-900 dark:text-gray-100 leading-tight">{coin.name}</div>
                    <div className="text-xs text-gray-400 dark:text-gray-500">{coin.symbol.toUpperCase()}</div>
                  </div>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); dispatch(toggleWatch(coin.id)) }}
                  className="w-6 h-6 flex items-center justify-center rounded border border-gray-200 dark:border-gray-600 text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 hover:border-red-300 transition-colors text-xs cursor-pointer"
                  title="Remove">
                  ✕
                </button>
              </div>

              <div className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-0.5">${fmt(coin.current_price)}</div>
              <div className={`text-xs font-medium mb-3 ${up ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500 dark:text-red-400'}`}>
                {up ? '+' : ''}{fmt(coin.price_change_percentage_24h)}% 24h
              </div>

              <Sparkline data={coin.sparkline_in_7d?.price} up={up7} />

              <div className="flex items-center gap-1.5 mt-2 pt-2 border-t border-gray-100 dark:border-gray-700">
                <span className="text-xs text-gray-400 dark:text-gray-500">7d</span>
                <span className={`text-xs font-medium ${up7 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500 dark:text-red-400'}`}>
                  {up7 ? '+' : ''}{fmt(coin.price_change_percentage_7d_in_currency || 0)}%
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
