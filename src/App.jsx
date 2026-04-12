// App.jsx — Routeur principal avec support mobile complet

import { useState, useEffect } from 'react'
import { SESSIONS, DEMO_BOOKINGS } from './data.js'
import Navbar from './components/Navbar.jsx'
import TerrainsView from './components/TerrainsView.jsx'
import GuideView from './components/GuideView.jsx'
import ReservationsView from './components/ReservationsView.jsx'
import AdminView from './components/AdminView.jsx'
import BookingModal from './components/BookingModal.jsx'

export default function App() {
  const [view, setView] = useState('terrains')
  const [sessions, setSessions] = useState(() => SESSIONS.map(s => ({ ...s })))
  const [bookings, setBookings] = useState(() => DEMO_BOOKINGS.map(b => ({ ...b })))
  const [bookingModal, setBookingModal] = useState(null)
  const [toast, setToast] = useState(null)

  // Fermeture modale par Escape
  useEffect(() => {
    const handler = e => { if (e.key === 'Escape') setBookingModal(null) }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  // Toast auto-dismiss
  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 3500)
    return () => clearTimeout(t)
  }, [toast])

  function handleBook(session, name, whatsapp) {
    const newBooking = {
      id: 'b' + Date.now(),
      name,
      whatsapp,
      sessionId: session.id,
      dateLabel: session.dateLabel,
      time: session.time,
      price: session.price,
    }
    setBookings(prev => [...prev, newBooking])
    setSessions(prev =>
      prev.map(s =>
        s.id === session.id ? { ...s, bookedCount: s.bookedCount + 1 } : s
      )
    )
    // On ne ferme PAS le modal ici — BookingModal affiche l'écran de succès
    setView('reservations')
  }

  function handleCancel(bookingId) {
    const b = bookings.find(b => b.id === bookingId)
    if (!b) return
    setBookings(prev => prev.filter(x => x.id !== bookingId))
    setSessions(prev =>
      prev.map(s =>
        s.id === b.sessionId ? { ...s, bookedCount: Math.max(0, s.bookedCount - 1) } : s
      )
    )
    setToast('❌ Réservation annulée.')
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar view={view} setView={setView} />

      <main className="flex-1">
        {view === 'terrains' && (
          <TerrainsView
            sessions={sessions}
            onReserve={s => setBookingModal(s)}
            setView={setView}
          />
        )}
        {view === 'guide' && (
          <GuideView onBack={() => setView('terrains')} />
        )}
        {view === 'reservations' && (
          <ReservationsView
            bookings={bookings}
            onCancel={handleCancel}
            onNewBooking={() => {
              setView('terrains')
              // Petit délai pour ouvrir le modal après la navigation
              setTimeout(() => setBookingModal(sessions[0]), 50)
            }}
          />
        )}
        {view === 'admin' && (
          <AdminView
            bookings={bookings}
            sessions={sessions}
            onCancel={handleCancel}
          />
        )}
      </main>

      {/* Modal de réservation */}
      {bookingModal && (
        <BookingModal
          session={bookingModal}
          sessions={sessions}
          onConfirm={handleBook}
          onClose={() => setBookingModal(null)}
        />
      )}

      {/* Toast */}
      {toast && (
        <div
          className="fixed left-1/2 -translate-x-1/2 z-50 animate-slideUp"
          style={{ bottom: 'max(80px, calc(72px + env(safe-area-inset-bottom)))' }}
        >
          <div className="bg-gray-900 text-white px-5 py-3 rounded-2xl shadow-xl text-sm font-medium whitespace-nowrap">
            {toast}
          </div>
        </div>
      )}

      {/* Footer — caché sur mobile (remplacé par bottom bar) */}
      <footer className="hidden sm:block text-center text-xs text-gray-400 py-5 border-t border-gray-100">
        © 2025 PadelPlus 🇱🇧. Beyrouth, Achrafieh.
      </footer>
    </div>
  )
}
