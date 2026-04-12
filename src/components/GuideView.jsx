import { useState, useEffect, useRef } from 'react'
import { GUIDE_STEPS, GUIDE_TRANSCRIPT } from '../data.js'

export default function GuideView({ onBack }) {
  const [timeLeft, setTimeLeft] = useState(60)
  const [running, setRunning] = useState(false)
  const intervalRef = useRef(null)

  useEffect(() => {
    if (running && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(t => {
          if (t <= 1) { setRunning(false); return 0 }
          return t - 1
        })
      }, 1000)
    }
    return () => clearInterval(intervalRef.current)
  }, [running, timeLeft])

  function toggleTimer() {
    if (timeLeft === 0) { setTimeLeft(60); setRunning(true) }
    else setRunning(r => !r)
  }

  const mm = String(Math.floor(timeLeft / 60)).padStart(2, '0')
  const ss = String(timeLeft % 60).padStart(2, '0')
  const progress = ((60 - timeLeft) / 60) * 100

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 animate-fadeIn">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-black text-gray-900 font-display">Didactiel Utilisateur</h1>
        <p className="text-gray-500 text-sm mt-1">Apprenez à réserver votre place en 60 secondes.</p>
      </div>

      {/* Retour */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-green-600 font-medium mb-6 transition-colors"
      >
        ← Retour à l'accueil
      </button>

      {/* Guide interactif — minuteur */}
      <div className="bg-gray-900 rounded-3xl overflow-hidden mb-6">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Guide Interactif</span>
          </div>

          {/* Timer */}
          <div className="flex items-center justify-between mb-4">
            <span className="text-5xl font-black text-white font-display tabular-nums">
              {mm}:{ss}
            </span>
            <button
              onClick={toggleTimer}
              className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${
                running
                  ? 'bg-orange-500 hover:bg-orange-600 text-white'
                  : timeLeft === 0
                  ? 'bg-green-500 hover:bg-green-600 text-white'
                  : 'bg-white text-gray-900 hover:bg-gray-100'
              }`}
            >
              {running ? '⏸ Pause' : timeLeft === 0 ? '↺ Rejouer' : '▶ Démarrer'}
            </button>
          </div>

          {/* Barre de progression */}
          <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-green-500 rounded-full transition-all duration-1000"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Transcript */}
        <div className="border-t border-gray-700/50 p-6">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">
            Transcription du Guide
          </p>
          <p className="text-gray-300 text-sm leading-relaxed italic">{GUIDE_TRANSCRIPT}</p>
        </div>
      </div>

      {/* 4 étapes */}
      <div className="bg-white rounded-3xl border border-gray-100 p-6 mb-6 shadow-sm">
        <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-5">Les 4 Étapes</p>
        <div className="grid sm:grid-cols-2 gap-4">
          {GUIDE_STEPS.map(step => (
            <div key={step.num} className="flex gap-3">
              <div className="w-9 h-9 bg-green-50 border-2 border-green-200 rounded-xl flex items-center justify-center shrink-0">
                <span className="text-green-700 font-black text-sm font-display">{step.num}</span>
              </div>
              <div>
                <p className="font-bold text-gray-900 text-sm">{step.title}</p>
                <p className="text-xs text-gray-500 mt-0.5">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Règle d'or */}
      <div className="bg-amber-50 border border-amber-200 rounded-3xl p-5">
        <p className="font-black text-amber-800 text-sm mb-2">⚠️ Règle d'Or</p>
        <p className="text-amber-700 text-sm leading-relaxed">
          Pour les sessions du samedi, toute inscription après le{' '}
          <strong>Jeudi soir (20h00)</strong> est automatiquement reportée à la{' '}
          <strong>semaine suivante</strong>. Planifiez en conséquence !
        </p>
      </div>
    </div>
  )
}
