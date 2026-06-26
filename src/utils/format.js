export const API = 'https://api.coingecko.com/api/v3'

export const fmt = (n, d = 2) =>
  n != null ? Number(n).toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d }) : '—'

export const fmtB = (n) => {
  if (!n) return '—'
  if (n >= 1e12) return '$' + (n / 1e12).toFixed(2) + 'T'
  if (n >= 1e9)  return '$' + (n / 1e9).toFixed(2)  + 'B'
  if (n >= 1e6)  return '$' + (n / 1e6).toFixed(2)  + 'M'
  return '$' + fmt(n)
}
