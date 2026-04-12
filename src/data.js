// ─── Calcul des dates dynamiques ─────────────────────────────────────────────
function nextWeekday(dayIndex) {
  const today = new Date()
  const current = today.getDay()
  let diff = dayIndex - current
  if (diff <= 0) diff += 7
  const d = new Date(today)
  d.setDate(today.getDate() + diff)
  return d
}

function fmt(date) {
  return date.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })
}

function fmtShort(date) {
  return date.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' }).toUpperCase()
}

const thursdayDate = nextWeekday(4) // jeudi
const saturdayDate = nextWeekday(6) // samedi

// Règle métier : après jeudi 20h → sessions samedi basculent semaine suivante
const now = new Date()
const isSaturdayClosed = now.getDay() === 4 && now.getHours() >= 20

const satDisplay = isSaturdayClosed
  ? (() => { const d = new Date(saturdayDate); d.setDate(d.getDate() + 7); return d })()
  : saturdayDate

export const SESSIONS = [
  {
    id: 'thu-cours',
    day: 'JEUDI',
    dateLabel: fmtShort(thursdayDate),
    dateObj: thursdayDate,
    time: '10:00 - 11:00',
    title: 'Cours Jeudi (1h)',
    description: 'Session technique limitée à 4 joueurs.',
    price: 7.5,
    totalSpots: 4,
    bookedCount: 0,
  },
  {
    id: 'sat-cours-1',
    day: 'SAMEDI',
    dateLabel: fmtShort(satDisplay),
    dateObj: satDisplay,
    time: '10:00 - 11:30',
    title: 'Cours N°1 (1h30)',
    description: 'Session technique sur le Court Panoramique.',
    price: 11.5,
    totalSpots: 4,
    bookedCount: 1,
  },
  {
    id: 'sat-cours-2',
    day: 'SAMEDI',
    dateLabel: fmtShort(satDisplay),
    dateObj: satDisplay,
    time: '10:00 - 11:00',
    title: 'Cours N°2 (1h)',
    description: 'Session de jeu sur le Court N°2.',
    price: 7.5,
    totalSpots: 4,
    bookedCount: 0,
  },
]

// Réservations de démonstration
export const DEMO_BOOKINGS = [
  { id: 'b1', name: 'jacques Martin', sessionId: 'sat-cours-1', dateLabel: fmt(satDisplay), time: '10:00 - 11:30', price: 11.5, whatsapp: '' },
  { id: 'b2', name: 'Alban Peytavin', sessionId: 'sat-cours-1', dateLabel: fmt(satDisplay), time: '10:00 - 11:30', price: 11.5, whatsapp: '' },
  { id: 'b3', name: 'Yannick BEAUVILLAIN', sessionId: 'sat-cours-1', dateLabel: fmt(satDisplay), time: '10:00 - 11:30', price: 11.5, whatsapp: '' },
]

export const COURT = {
  name: 'The Padelist Achrafieh',
  subtitle: 'Achrafieh High-End',
  badge: 'Panoramique',
  feature: 'Tapis WPT',
  rating: 5,
  priceRange: '7.5-12$ / Pers',
  image: '/padel.jpg',
}

export const GUIDE_STEPS = [
  { num: '01', title: 'Choix du Terrain', desc: "Sélectionnez 'The Padelist Achrafieh'." },
  { num: '02', title: 'Session & Court', desc: 'Choisissez entre le Jeudi (1h) ou le Court N°1 (1h30) / N°2 (1h) le samedi.' },
  { num: '03', title: 'WhatsApp', desc: 'Indispensable pour recevoir les infos du match.' },
  { num: '04', title: 'Confirmation', desc: 'Annulation possible via votre compte.' },
]

export const GUIDE_TRANSCRIPT = `"Bienvenue sur PadelPlus ! Pour réserver, choisissez votre session : le Jeudi pour un cours d'1h à 7.5$, ou le Samedi avec le Court N°1 (1h30) ou le Court N°2 (1h). Notez que pour le samedi, les réservations basculent sur la semaine suivante dès le jeudi soir. Entrez votre nom et votre WhatsApp, confirmez, et retrouvez votre reçu dans l'onglet 'Réservations'. À bientôt sur le court !"`

export const ADMIN_PIN = '1234'