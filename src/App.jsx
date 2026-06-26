import React, { useEffect } from 'react'
import { Routes, Route, NavLink, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { toggleTheme } from './redux/themeSlice'
import HomePage from './pages/HomePage'
import CryptoDetail from './pages/CryptoDetail'
import ComparePage from './pages/ComparePage'
import WatchlistPage from './pages/WatchlistPage'

export default function App() {
  const darkMode = useSelector((s) => s.theme.darkMode)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
  }, [darkMode])

  const navClass = ({ isActive }) =>
    `px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
      isActive
        ? 'bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400'
        : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700'
    }`

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors">
      <header className="sticky top-0 z-50 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2.5 cursor-pointer select-none" onClick={() => navigate('/')}>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-sm font-bold">
            B
          </div>
          <span className="text-base font-semibold hidden sm:block">CryptoDash</span>
        </div>

        <nav className="flex gap-1">
          <NavLink to="/" end className={navClass}>Market</NavLink>
          <NavLink to="/compare" className={navClass}>Compare</NavLink>
          <NavLink to="/watchlist" className={navClass}>Watchlist</NavLink>
        </nav>

        <button onClick={() => dispatch(toggleTheme())} className="btn text-xs px-3 py-1.5">
          {darkMode ? 'Light' : 'Dark'}
        </button>
      </header>

      <main className="w-full px-4 sm:px-6 py-6">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/coin/:id" element={<CryptoDetail />} />
          <Route path="/compare" element={<ComparePage />} />
          <Route path="/watchlist" element={<WatchlistPage />} />
        </Routes>
      </main>
    </div>
  )
}