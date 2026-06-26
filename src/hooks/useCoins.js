import { useState, useEffect } from 'react'
import axios from 'axios'
import { API } from '../utils/format'

export default function useCoins() {
  const [coins, setCoins] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    axios
      .get(`${API}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=true&price_change_percentage=24h,7d`)
      .then((res) => { setCoins(res.data); setLoading(false) })
      .catch((err) => { setError(err.message); setLoading(false) })
  }, [])

  return { coins, loading, error }
}
