import React from 'react'

export default function Sparkline({ data, up }) {
  if (!data || data.length < 2) return null
  const pts = data.slice(-20)
  const min = Math.min(...pts), max = Math.max(...pts), range = max - min || 1
  const W = 80, H = 32
  const points = pts.map((v, i) => `${(i / (pts.length - 1)) * W},${H - ((v - min) / range) * H}`).join(' ')
  return (
    <svg width={W} height={H} style={{ display: 'block' }}>
      <polyline points={points} fill="none" stroke={up ? '#10b981' : '#ef4444'} strokeWidth="1.5" />
    </svg>
  )
}
