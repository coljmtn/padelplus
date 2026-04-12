// AdminView.jsx — PIN avec clavier numérique, safe area, padding bottom tab

import { useState } from 'react'
import { ADMIN_PIN } from '../data.js'

function PinGate({ onUnlock }) {
  const [pin, setPin] = useState('')
  const [error, setError] = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    if (pin === ADMIN_PIN) { onUnlock() }
    else { setError(true); setPin('') }
  }

  return (
    <div className="max-w-xs mx-auto px-4 py-16 text-center pb-28 sm:pb-16">
      <div className="text-4xl mb-4">🔐</div>
      <h2 className="text-xl font-black text-gray-900 font-display mb-1">Accès Admin</h2>
      <p className="text-gray-500 text-sm mb-6">Entrez votre code d'accès.</p>
      <form onSubmit={handleSubmit} className="space-y-3">
        {/* inputMode="numeric" + pattern → clavier numérique sur iOS */}
        <input
          type="password"
          inputMode="numeric"
          pattern="[0-9]*"
          placeholder="Code PIN"
          value={pin}
          onChange={e => { setPin(e.target.value); setError(false) }}
          className={`w-full bg-gray-50 border-2 rounded-xl px-4 py-3.5 text-center text-lg font-bold tracking-widest focus:outline-none transition-all min-h-[52px] ${
            error ? 'border-red-300 focus:border-red-400' : 'border-gray-200 focus:border-green-400'
          }`}
          maxLength={6}
          autoFocus
        />
        {error && <p className="text-red-500 text-xs font-medium">Code incorrect. Réessayez.</p>}
        <button
          type="submit"
          className="w-full bg-green-500 hover:bg-green-600 active:scale-[.98] text-white font-bold py-3.5 rounded-xl transition-all min-h-[52px]"
        >
          Accéder
        </button>
      </form>
      <p className="text-gray-300 text-xs mt-4">Code démo : 1234</p>
    </div>
  )
}

function StatCard({ label, value, sub, color = 'green' }) {
  const colors = {
    green:  'bg-green-50 border-green-100 text-green-700',
    blue:   'bg-blue-50 border-blue-100 text-blue-700',
    orange: 'bg-orange-50 border-orange-100 text-orange-700',
  }
  return (
    <div className={`rounded-2xl border p-4 ${colors[color]}`}>
      <p className="text-xs font-bold uppercase tracking-wider opacity-70 mb-1">{label}</p>
      <p className="text-3xl font-black">{value}</p>
      {sub && <p className="text-xs mt-1 opacity-60">{sub}</p>}
    </div>
  )
}

export default function AdminView({ bookings, sessions, onCancel }) {
  const [unlocked, setUnlocked] = useState(false)

  if (!unlocked) return <PinGate onUnlock={() => setUnlocked(true)} />

  const totalRevenue = bookings.reduce((s, b) => s + b.price, 0)
  const totalSpots   = sessions.reduce((s, s2) => s + s2.totalSpots, 0)
  const booked       = sessions.reduce((s, s2) => s + s2.bookedCount, 0)

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 pb-28 sm:pb-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-gray-900 font-display">Tableau de bord</h1>
          <p className="text-gray-500 text-xs mt-0.5">The Padelist Achrafieh — Semaine en cours</p>
        </div>
        <button
          onClick={() => setUnlocked(false)}
          className="text-xs text-gray-400 hover:text-red-500 font-medium transition-colors px-2 py-1"
        >
          Déconnexion
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <StatCard label="Réservations" value={bookings.length} color="green" />
        <StatCard label="Revenus" value={`${totalRevenue.toFixed(0)}$`} color="blue" />
        <StatCard
          label="Remplissage"
          value={`${Math.round((booked / totalSpots) * 100)}%`}
          sub={`${booked}/${totalSpots} places`}
          color="orange"
        />
      </div>

      {/* Sessions */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-6 shadow-sm">
        <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Sessions</p>
        <div className="space-y-3">
          {sessions.map(s => {
            const available = s.totalSpots - s.bookedCount
            const pct = (s.bookedCount / s.totalSpots) * 100
            return (
              <div key={s.id}>
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-semibold text-gray-700 truncate pr-3">{s.title}</p>
                  <span className="text-xs text-gray-400 shrink-0">{s.bookedCount}/{s.totalSpots}</span>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      pct >= 100 ? 'bg-red-400' : pct >= 75 ? 'bg-orange-400' : 'bg-green-400'
                    }`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Liste réservations */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-50">
          <p className="text-xs font-black text-gray-400 uppercase tracking-widest">
            Toutes les réservations
          </p>
        </div>
        {bookings.length === 0 ? (
          <p className="text-center text-gray-400 text-sm py-8">Aucune réservation</p>
        ) : (
          <div className="divide-y divide-gray-50">
            {bookings.map(b => (
              <div key={b.id} className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition-colors">
                <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-sm shrink-0">
                  👤
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 text-sm truncate">{b.name}</p>
                  <p className="text-xs text-gray-400 capitalize truncate">
                    {b.dateLabel} • {b.time}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-black text-gray-900 text-sm">{b.price}$</p>
                  <button
                    onClick={() => onCancel(b.id)}
                    className="text-xs text-red-400 hover:text-red-600 font-medium transition-colors min-h-[24px]"
                  >
                    Annuler
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
