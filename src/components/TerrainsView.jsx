// TerrainsView.jsx — Card pleine largeur sur mobile, héro optimisé

import { COURT } from '../data.js'

function Stars({ n }) {
  return (
    <span className="flex gap-0.5">
      {Array.from({ length: n }).map((_, i) => (
        <svg key={i} className="w-3.5 h-3.5 text-yellow-400 fill-current" viewBox="0 0 20 20">
          <path d="M10 1l2.4 7.4H20l-6.2 4.5 2.4 7.4L10 16l-6.2 4.3 2.4-7.4L0 8.4h7.6z" />
        </svg>
      ))}
    </span>
  )
}

function CourtCard({ court, onReserve }) {
  return (
    // w-full sur mobile, max-w-sm sur desktop
    <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow w-full sm:max-w-sm">
      {/* Image */}
      <div className="relative h-52 overflow-hidden">
        <img
          src={court.image}
          alt={court.name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <span className="absolute top-3 left-3 bg-black/50 backdrop-blur-sm text-white text-xs font-semibold px-2.5 py-1 rounded-full">
          {court.badge}
        </span>
        <span className="absolute bottom-3 right-3 bg-green-500 text-white text-sm font-bold px-3 py-1 rounded-full">
          {court.priceRange}
        </span>
      </div>

      {/* Infos */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-bold text-gray-900 text-base leading-tight">{court.name}</h3>
          <Stars n={court.rating} />
        </div>
        <p className="text-xs text-gray-500 mb-3">{court.subtitle}</p>
        <div className="flex items-center gap-2 mb-4">
          <span className="bg-gray-100 text-gray-600 text-xs font-semibold px-2.5 py-1 rounded-full uppercase tracking-wide">
            {court.feature}
          </span>
        </div>
        {/* Bouton pleine largeur, hauteur tactile 48px minimum */}
        <button
          onClick={onReserve}
          className="w-full bg-green-500 hover:bg-green-600 active:scale-[.98] text-white font-bold py-3.5 rounded-xl transition-all text-sm min-h-[48px]"
        >
          Réserver maintenant
        </button>
      </div>
    </div>
  )
}

export default function TerrainsView({ sessions, onReserve, setView }) {
  return (
    // pb-24 sur mobile pour ne pas être caché par la bottom bar
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-8 pb-28 sm:pb-8">
      {/* Hero */}
      <div className="relative rounded-3xl overflow-hidden h-64 sm:h-80 shadow-lg">
        <img
          src="/beirut.jpg"
          alt="Beyrouth Achrafieh"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl sm:text-4xl">🇱🇧</span>
            <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight font-display drop-shadow">
              THE PADELIST
            </h1>
          </div>
          <p className="text-green-400 font-display font-bold tracking-[0.25em] sm:tracking-[0.3em] text-base sm:text-xl uppercase mb-5">
            Achrafieh Courts
          </p>
          <button
            onClick={() => setView('guide')}
            className="bg-white/95 hover:bg-white active:scale-[.97] text-gray-900 font-semibold px-6 py-2.5 rounded-full shadow-lg transition-all flex items-center gap-2 text-sm min-h-[44px]"
          >
            <span className="text-xs">▶</span>
            Voir le Guide Vidéo
          </button>
        </div>
      </div>

      {/* Sessions disponibles */}
      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-4">Sessions Disponibles</h2>
        {/* Sur mobile : card pleine largeur. Sur desktop : flex avec max-w-sm */}
        <div className="flex flex-col sm:flex-row sm:flex-wrap gap-4">
          <CourtCard court={COURT} onReserve={onReserve} />
        </div>
      </div>
    </div>
  )
}
