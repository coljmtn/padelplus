import { useState, useEffect } from 'react'
import {
  collection, onSnapshot, addDoc, deleteDoc,
  doc, serverTimestamp
} from 'firebase/firestore'
import { db } from './firebase.js'
import { SESSIONS } from './data.js'
import Navbar from './components/Navbar.jsx'
import TerrainsView from './components/TerrainsView.jsx'
import GuideView from './components/GuideView.jsx'
import ReservationsView from './components/ReservationsView.jsx'
import AdminView from './components/AdminView.jsx'
import BookingModal from './components/BookingModal.jsx'

export default function App() {
  const [view, setView] = useState('terrains')
  const [sessions, setSessions] = useState(() => SESSIONS.map(s => ({ ...s })))
  const [bookings, setBookings] = useState([])
  const [bookingModal, setBookingModal] = useState(null)
  const [toast, setToast] = useState(null)
  const [loading, setLoading] = useState(true)

  // ── Écoute temps réel des réservations Firestore ──────────────────────────
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'bookings'), snapshot => {
      const data = snapshot.docs.map(d => ({ id: d.id, ...d.data() }))
      setBookings(data)

      // Recalculer les compteurs — uniquement les réservations à venir
      // On compare la date ISO de la session avec aujourd'hui (minuit)
      const todayMidnight = new Date()
      todayMidnight.setHours(0, 0, 0, 0)

      setSessions(SESSIONS.map(s => ({
        ...s,
        bookedCount: data.filter(b =>
          b.sessionId === s.id &&
          b.sessionDate &&
          new Date(b.sessionDate) >= todayMidnight
        ).length
      })))

      setLoading(false)
    })
    return () => unsub()
  }, [])

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

  // ── Créer une réservation dans Firestore ──────────────────────────────────
  async function handleBook(session, name, whatsapp) {
    try {
      // sessionDate stockée en ISO (YYYY-MM-DD) pour filtrage par date
      const sessionDate = session.dateObj instanceof Date
        ? session.dateObj.toISOString().split('T')[0]
        : new Date(session.dateObj).toISOString().split('T')[0]

      await addDoc(collection(db, 'bookings'), {
        name,
        whatsapp,
        sessionId: session.id,
        sessionTitle: session.title,
        sessionDate,           // ← date ISO de la session (ex: "2026-04-19")
        dateLabel: session.dateLabel,
        time: session.time,
        price: session.price,
        createdAt: serverTimestamp(),
      })
      setBookingModal(null)
      setView('reservations')
    } catch (err) {
      console.error('Erreur réservation:', err)
      setToast('❌ Erreur lors de la réservation. Réessayez.')
    }
  }

  // ── Annuler une réservation dans Firestore ────────────────────────────────
  async function handleCancel(bookingId) {
    try {
      await deleteDoc(doc(db, 'bookings', bookingId))
      setToast('❌ Réservation annulée.')
    } catch (err) {
      console.error('Erreur annulation:', err)
      setToast('❌ Erreur lors de l\'annulation.')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-4xl mb-3">🎾</div>
          <p className="text-gray-500 text-sm">Chargement...</p>
        </div>
      </div>
    )
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

      {bookingModal && (
        <BookingModal
          session={bookingModal}
          sessions={sessions}
          onConfirm={handleBook}
          onClose={() => setBookingModal(null)}
        />
      )}

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

      <footer className="hidden sm:block text-center text-xs text-gray-400 py-5 border-t border-gray-100">
        © 2025 PadelPlus 🇱🇧. Beyrouth, Achrafieh.
      </footer>
    </div>
  )
}
