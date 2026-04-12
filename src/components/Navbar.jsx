// Navbar.jsx — Desktop header + Bottom tab bar sur mobile

const NAV_ITEMS = [
  { id: 'terrains',     label: 'Terrains',     icon: '🎾' },
  { id: 'guide',        label: 'Guide',        icon: '📖' },
  { id: 'reservations', label: 'Réservations', icon: '📋' },
  { id: 'admin',        label: 'Admin',        icon: '⚙️' },
]

export default function Navbar({ view, setView }) {
  return (
    <>
      {/* ── Header top (logo + nav desktop) ── */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => setView('terrains')}
            className="flex items-center gap-2.5 cursor-pointer"
          >
            <div className="w-9 h-9 bg-green-500 rounded-xl flex items-center justify-center shadow-sm">
              <span className="text-white font-bold text-sm font-display">P+</span>
            </div>
            <span className="text-xl font-bold tracking-tight text-gray-800 font-display">
              PadelPlus
            </span>
          </button>

          {/* Navigation desktop uniquement (caché sur mobile) */}
          <nav className="hidden sm:flex items-center gap-1">
            {NAV_ITEMS.filter(i => i.id !== 'admin').map(({ id, label }) => (
              <button
                key={id}
                onClick={() => setView(id)}
                className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                  view === id
                    ? 'text-green-600 bg-green-50'
                    : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'
                }`}
              >
                {label}
              </button>
            ))}
            <span className="w-px h-4 bg-gray-200 mx-1" />
            <button
              onClick={() => setView('admin')}
              className={`px-3 py-1.5 rounded-lg text-xs uppercase tracking-widest font-bold transition-all ${
                view === 'admin'
                  ? 'text-green-600 bg-green-50'
                  : 'text-gray-300 hover:text-gray-500'
              }`}
            >
              Admin
            </button>
          </nav>
        </div>
      </header>

      {/* ── Bottom tab bar mobile uniquement ── */}
      <nav
        className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur border-t border-gray-100"
        style={{ paddingBottom: 'max(8px, env(safe-area-inset-bottom))' }}
      >
        <div className="grid grid-cols-4">
          {NAV_ITEMS.map(({ id, label, icon }) => (
            <button
              key={id}
              onClick={() => setView(id)}
              className={`flex flex-col items-center justify-center gap-1 py-2 transition-all active:scale-95 min-h-[56px] ${
                view === id ? 'text-green-600' : 'text-gray-400'
              }`}
            >
              <span className={`text-xl leading-none ${view === id ? 'scale-110' : ''} transition-transform`}>
                {icon}
              </span>
              <span className={`text-[10px] font-semibold leading-none ${
                view === id ? 'text-green-600' : 'text-gray-400'
              }`}>
                {label}
              </span>
              {view === id && (
                <span className="absolute bottom-0 w-8 h-0.5 bg-green-500 rounded-full" />
              )}
            </button>
          ))}
        </div>
      </nav>
    </>
  )
}
