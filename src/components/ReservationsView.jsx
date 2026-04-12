// ReservationsView.jsx — Liste + FAB "+" pour nouvelle réservation

export default function ReservationsView({ bookings, onCancel, onNewBooking }) {
  // onNewBooking : () => setView('terrains') — passé depuis App.jsx

  if (bookings.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16 text-center pb-28 sm:pb-16">
        <div className="text-5xl mb-4">📋</div>
        <h2 className="text-xl font-black text-gray-900 font-display mb-2">Aucune réservation</h2>
        <p className="text-gray-500 text-sm mb-6">Vos réservations apparaîtront ici après confirmation.</p>
        <button
          onClick={onNewBooking}
          className="bg-green-500 hover:bg-green-600 active:scale-[.98] text-white font-bold px-6 py-3 rounded-xl transition-all text-sm"
        >
          Réserver une session →
        </button>
      </div>
    )
  }

  const total = bookings.reduce((s, b) => s + b.price, 0)

  return (
    // pb-28 sur mobile pour bottom tab bar
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 pb-28 sm:pb-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-black text-gray-900 font-display">Mes Réservations</h1>
        <span className="text-xs font-bold text-gray-400 bg-gray-100 px-3 py-1.5 rounded-full">
          {bookings.length} rés.
        </span>
      </div>

      <div className="space-y-3">
        {bookings.map(b => (
          <div
            key={b.id}
            className="bg-white rounded-2xl border border-gray-100 p-4 flex items-center gap-3 shadow-sm"
          >
            {/* Avatar */}
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center shrink-0 text-lg">
              👤
            </div>

            {/* Infos */}
            <div className="flex-1 min-w-0">
              <p className="font-bold text-gray-900 text-sm truncate">{b.name}</p>
              <p className="text-xs text-gray-500 capitalize truncate">{b.dateLabel}</p>
              <p className="text-xs text-gray-400">{b.time}</p>
            </div>

            {/* Montant + Annuler */}
            <div className="text-right shrink-0">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Montant</p>
              <p className="text-base font-black text-gray-900">{b.price}$</p>
              <button
                onClick={() => onCancel(b.id)}
                className="mt-1 text-xs text-red-400 hover:text-red-600 font-semibold transition-colors min-h-[28px] px-1"
              >
                Annuler
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Total */}
      <div className="mt-5 bg-gray-900 rounded-2xl p-4 flex items-center justify-between">
        <span className="text-gray-400 font-medium text-sm">Total engagé</span>
        <span className="text-white font-black text-xl">{total.toFixed(1)}$</span>
      </div>

      {/* FAB — bouton flottant "+" pour nouvelle réservation (mobile) */}
      <button
        onClick={onNewBooking}
        className="sm:hidden fixed right-4 z-30 w-14 h-14 bg-green-500 hover:bg-green-600 active:scale-95 text-white text-2xl rounded-full shadow-lg flex items-center justify-center transition-all"
        style={{ bottom: 'max(80px, calc(64px + env(safe-area-inset-bottom)))' }}
        aria-label="Nouvelle réservation"
      >
        +
      </button>
    </div>
  )
}
