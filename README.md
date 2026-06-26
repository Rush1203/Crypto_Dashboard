# CryptoDash

A real-time cryptocurrency dashboard built with React. Track market data, compare coins, and maintain a personal watchlist — with full dark mode support.

## Features

- **Market Overview** — Live stats: total market cap, coins tracked, 24h gainers/losers
- **Search & Filter** — Filter coins by name or symbol
- **Coin Detail Pages** — Drill into individual coin data
- **Compare** — Side-by-side comparison of selected coins
- **Watchlist** — Save and track your favorite coins
- **Dark Mode** — Toggle light/dark theme, persisted via Redux
- **Responsive Layout** — Full-width, mobile-friendly UI

## Tech Stack

| Layer            | Tool                          |
|-------------------|--------------------------------|
| UI Library        | React                         |
| Build Tool        | Vite                          |
| Routing           | React Router v6               |
| State Management  | Redux Toolkit / React-Redux   |
| Styling           | Tailwind CSS                  |
| Data Source       | [CoinGecko API](https://www.coingecko.com/en/api) (free tier, no API key required) |



## Routes

| Path         | Page             | Description                          |
|--------------|------------------|---------------------------------------|
| `/`          | HomePage         | Market stats, search, coin table     |
| `/coin/:id`  | CryptoDetail     | Detailed view for a single coin      |
| `/compare`   | ComparePage      | Compare coins side-by-side           |
| `/watchlist` | WatchlistPage    | User's saved/watchlisted coins       |

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm or yarn

### Installation

```bash
git clone <your-repo-url>
cd cryptodash
npm install
```

