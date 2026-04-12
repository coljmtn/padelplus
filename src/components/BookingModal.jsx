// BookingModal.jsx — Bottom sheet mobile, badges urgence, WhatsApp post-réservation

import { useState, useEffect } from 'react'

// ── Badge places disponibles ────────────────────────────────────────────────
function SpotsBadge({ available, total }) {
  if (available <= 0)
    return <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-700">COMPLET</span>
  if (available === 1)
    return <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-700 animate-pulse">⚡ Dernière place !</span>
  if (available === 2)
    return <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-orange-100 text-orange-700">⚡ 2 places restantes</span>
  return <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">{available} places</span>
}

// ── Card session sélectionnable ─────────────────────────────────────────────
function SessionCard({ session, selected, onClick }) {
  const available = session.totalSpots - session.bookedCount
  const isFull = available <= 0

  return (
    <button
      onClick={() => !isFull && onClick(session)}
      disabled={isFull}
      className={`w-full text-left p-4 rounded-2xl border-2 transition-all ${
        isFull
          ? 'border-gray-100 bg-gray-50 opacity-50 cursor-not-allowed'
          : selected
          ? 'border-green-500 bg-green-50 shadow-sm'
          : 'border-gray-100 bg-gray-50 hover:border-gray-200 active:scale-[.98] cursor-pointer'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
            {session.dateLabel} • {session.time}
          </p>
          <p className={`font-bold text-base leading-tight ${selected ? 'text-green-700' : 'text-gray-900'}`}>
            {session.title}
          </p>
          <p className="text-xs text-gray-500 mt-0.5">{session.description}</p>
          <div className="mt-2">
            <SpotsBadge available={available} total={session.totalSpots} />
          </div>
        </div>
        <div className="text-right shrink-0">
          <p className="text-2xl font-black text-gray-900">
            {session.price}<span className="text-sm font-normal text-gray-500">$</span>
          </p>
        </div>
      </div>
    </button>
  )
}

// ── Écran de succès post-réservation ───────────────────────────────────────
function SuccessScreen({ booking, session, onClose }) {
  const waText = encodeURIComponent(
    `✅ Réservation confirmée !\n\n🎾 ${session.title}\n📅 ${session.dateLabel} · ${session.time}\n💵 ${session.price}$\n\nÀ bientôt sur le court !`
  )
  const waLink = `https://wa.me/?text=${waText}`

  // Haptic feedback
  useEffect(() => {
    if (navigator.vibrate) navigator.vibrate([50, 30, 80])
  }, [])

  return (
    <div className="text-center py-4 px-2">
      <div className="text-5xl mb-4">✅</div>
      <h3 className="text-xl font-black text-gray-900 font-display mb-1">Réservation confirmée !</h3>
      <p className="text-gray-500 text-sm mb-1">{booking.name}</p>
      <p className="text-sm font-semibold text-green-700 mb-1">{session.title}</p>
      <p className="text-xs text-gray-400 mb-5">{session.dateLabel} · {session.time} · {session.price}$</p>

      <a
        href={waLink}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3.5 rounded-2xl transition-all active:scale-[.98] mb-3 text-sm"
      >
        <span className="text-lg">💬</span>
        Partager sur WhatsApp
      </a>
      <button
        onClick={onClose}
        className="w-full text-gray-500 font-medium py-2 text-sm hover:text-gray-700 transition-colors"
      >
        Fermer
      </button>
    </div>
  )
}

// ── Modal principal ─────────────────────────────────────────────────────────
export default function BookingModal({ session, sessions, onConfirm, onClose }) {
  const [step, setStep] = useState(1)
  const [selectedSession, setSelectedSession] = useState(null)
  const [name, setName] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [error, setError] = useState('')
  const [confirmed, setConfirmed] = useState(null) // { name, session }

  function handleNext() {
    if (!selectedSession) { setError('Veuillez sélectionner une session.'); return }
    setError('')
    setStep(2)
  }

  function handleConfirm() {
    if (!name.trim()) { setError('Veuillez entrer votre nom.'); return }
    if (!whatsapp.trim()) { setError('Veuillez entrer votre numéro WhatsApp.'); return }
    setError('')
    const booking = { name: name.trim(), whatsapp: whatsapp.trim() }
    setConfirmed({ booking, session: selectedSession })
    onConfirm(selectedSession, name.trim(), whatsapp.trim())
  }

  return (
    // Overlay : items-end sur mobile → bottom sheet, items-center sur desktop → dialog centré
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-black/50 backdrop-blur-sm"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className={`bg-white w-full max-w-lg max-h-[92vh] flex flex-col
        rounded-t-3xl sm:rounded-3xl shadow-2xl
        transition-all duration-300 ease-out`}
      >
        {/* Drag handle — mobile only */}
        <div className="sm:hidden flex justify-center pt-3 pb-1 shrink-0">
          <div className="w-10 h-1 bg-gray-200 rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-start justify-between px-6 pt-4 pb-4 border-b border-gray-100 shrink-0">
          <div>
            <h2 className="text-xl font-black text-gray-900 font-display">
              {confirmed
                ? 'Confirmée !'
                : step === 1
                ? 'Planning Hebdomadaire'
                : 'Vos Coordonnées'}
            </h2>
            {!confirmed && (
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-0.5">
                Étape {step} sur 2
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition-colors text-sm shrink-0"
          >
            ✕
          </button>
        </div>

        {/* Body scrollable */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">

          {/* ── Succès ── */}
          {confirmed && (
            <SuccessScreen
              booking={confirmed.booking}
              session={confirmed.session}
              onClose={onClose}
            />
          )}

          {/* ── Étape 1 : sélection session ── */}
          {!confirmed && step === 1 && (
            <>
              <div className="bg-orange-50 border border-orange-200 rounded-2xl p-3.5 flex gap-3">
                <span className="text-lg shrink-0">🚨</span>
                <p className="text-xs font-bold text-orange-700 uppercase tracking-wide leading-relaxed">
                  Les réservations samedi ferment chaque jeudi soir.
                  Sessions affichées = prochaines disponibles.
                </p>
              </div>
              {sessions.map(s => (
                <SessionCard
                  key={s.id}
                  session={s}
                  selected={selectedSession?.id === s.id}
                  onClick={setSelectedSession}
                />
              ))}
            </>
          )}

          {/* ── Étape 2 : coordonnées ── */}
          {!confirmed && step === 2 && (
            <>
              {/* Résumé session */}
              <div className="bg-gray-900 rounded-2xl p-4 flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Résumé</p>
                  <p className="text-white font-bold">{selectedSession.title}</p>
                  <p className="text-green-400 text-sm mt-0.5">
                    {selectedSession.dateLabel} • {selectedSession.time}
                  </p>
                </div>
                <span className="text-2xl">🎾</span>
              </div>

              {/* Formulaire */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                    Votre Nom
                  </label>
                  {/* autoComplete="name" → suggestion iOS trousseau */}
                  <input
                    type="text"
                    placeholder="Prénom Nom"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    autoComplete="name"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100 transition-all text-base"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                    WhatsApp
                  </label>
                  {/* inputMode="tel" → clavier numérique iOS */}
                  <input
                    type="tel"
                    inputMode="tel"
                    placeholder="+961 XX XXX XXX"
                    value={whatsapp}
                    onChange={e => setWhatsapp(e.target.value)}
                    autoComplete="tel"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100 transition-all text-base"
                  />
                </div>
              </div>
            </>
          )}

          {error && !confirmed && (
            <p className="text-red-500 text-xs font-medium">{error}</p>
          )}
        </div>

        {/* Footer boutons */}
        {!confirmed && (
          <div
            className="px-6 py-4 border-t border-gray-100 space-y-2 shrink-0"
            style={{ paddingBottom: 'max(16px, env(safe-area-inset-bottom))' }}
          >
            {step === 1 ? (
              <button
                onClick={handleNext}
                className="w-full bg-green-500 hover:bg-green-600 active:scale-[.98] text-white font-bold py-3.5 rounded-2xl transition-all text-base"
              >
                Suivant →
              </button>
            ) : (
              <>
                <button
                  onClick={handleConfirm}
                  className="w-full bg-green-500 hover:bg-green-600 active:scale-[.98] text-white font-bold py-3.5 rounded-2xl transition-all text-base"
                >
                  Confirmer ma place ({selectedSession?.price}$)
                </button>
                <button
                  onClick={() => { setStep(1); setError('') }}
                  className="w-full text-gray-500 hover:text-gray-700 font-medium py-2 text-sm transition-colors"
                >
                  ← Retour
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
