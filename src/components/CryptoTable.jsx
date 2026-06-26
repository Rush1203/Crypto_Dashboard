import React, { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { toggleWatch } from '../redux/watchlistSlice'
import Sparkline from './Sparkline'
import { fmt, fmtB } from '../utils/format'

const SORTS = [['market_cap', 'Market cap'], ['price', 'Price'], ['change', '24h change'], ['volume', 'Volume']]

export default function CryptoTable({ coins, onToast }) {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const watchlist = useSelector((s) => s.watchlist.ids)
  const [sort, setSort] = useState('market_cap')

  const sorted = useMemo(() => {
    const c = [...coins]
    if (sort === 'price') c.sort((a, b) => b.current_price - a.current_price)
    else if (sort === 'change') c.sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h)
    else if (sort === 'volume') c.sort((a, b) => b.total_volume - a.total_volume)
    return c
  }, [coins, sort])

  const handleWatch = (e, coin) => {
    e.stopPropagation()
    const saved = watchlist.includes(coin.id)
    dispatch(toggleWatch(coin.id))
    onToast(saved ? `Removed ${coin.name} from watchlist` : `Saved ${coin.name} to watchlist`)
  }

  return (
    <div className="card overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 dark:border-gray-700">
        <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">All coins</span>
        <div className="flex gap-1.5 flex-wrap">
          {SORTS.map(([k, l]) => (
            <button key={k} onClick={() => setSort(k)}
              className={`btn text-xs py-1 px-2.5 ${sort === k ? 'btn-active' : ''}`}>{l}</button>
          ))}
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm min-w-[780px]">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-700/50">
              {['#', 'Coin', 'Price', '24h', '7d', 'Market cap', 'Volume (24h)', '7d chart', ''].map((h) => (
                <th key={h} className="px-4 py-2.5 text-left text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.map((coin, i) => {
              const up24 = (coin.price_change_percentage_24h || 0) >= 0
              const up7 = (coin.price_change_percentage_7d_in_currency || 0) >= 0
              const saved = watchlist.includes(coin.id)
              return (
                <tr key={coin.id} onClick={() => navigate(`/coin/${coin.id}`)}
                  className="border-t border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/40 cursor-pointer transition-colors">
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center justify-center min-w-[28px] h-5 px-1.5 rounded bg-gray-100 dark:bg-gray-700 text-xs text-gray-500 dark:text-gray-400 font-medium">
                      {coin.market_cap_rank || i + 1}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <img src={coin.image} alt={coin.name} className="w-7 h-7 rounded-full flex-shrink-0" />
                      <div>
                        <div className="font-medium text-gray-900 dark:text-gray-100 text-sm whitespace-nowrap">{coin.name}</div>
                        <div className="text-xs text-gray-400 dark:text-gray-500">{coin.symbol.toUpperCase()}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-900 dark:text-gray-100">${fmt(coin.current_price)}</td>
                  <td className={`px-4 py-3 ${up24 ? 'up' : 'down'}`}>{up24 ? '+' : ''}{fmt(coin.price_change_percentage_24h)}%</td>
                  <td className={`px-4 py-3 ${up7 ? 'up' : 'down'}`}>{up7 ? '+' : ''}{fmt(coin.price_change_percentage_7d_in_currency || 0)}%</td>
                  <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{fmtB(coin.market_cap)}</td>
                  <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{fmtB(coin.total_volume)}</td>
                  <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}><Sparkline data={coin.sparkline_in_7d?.price} up={up7} /></td>
                  <td className="px-4 py-3" onClick={(e) => handleWatch(e, coin)}>
                    <button className={`whitespace-nowrap text-xs px-2.5 py-1 rounded-md border transition-colors cursor-pointer
                      ${saved ? 'bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border-amber-300 dark:border-amber-700'
                               : 'border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
                      {saved ? '★ Saved' : '☆ Save'}
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
