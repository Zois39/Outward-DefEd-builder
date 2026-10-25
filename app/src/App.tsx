import { useEffect, useState, useMemo } from 'react'
import { loadGameData, type GameData } from './data/loader'
import { calcStats } from './utils/calculator'
import { useBuildStore } from './store/useBuildStore'
import SkillTree from './components/SkillTree'
import EquipmentPanel from './components/EquipmentPanel'
import StatsPanel from './components/StatsPanel'

type Tab = 'skills' | 'equip' | 'stats'

export default function App() {
  const [data, setData] = useState<GameData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<Tab>('equip')
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 900)

  const {
    name, level, theorycraft, skills, equipment,
    setLevel, setTheorycraft, setName, reset, exportJSON, importJSON,
  } = useBuildStore()

  useEffect(() => {
    loadGameData().then(setData).catch(e => setError(String(e)))
    const onResize = () => setIsMobile(window.innerWidth <= 900)
    window.addEventListener('resize', onResize)
    window.addEventListener('orientationchange', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
      window.removeEventListener('orientationchange', onResize)
    }
  }, [])

  const stats = useMemo(() => {
    if (!data) return null
    const selectedSkills = data.skills.filter(s => skills.includes(s.name))
    return calcStats(equipment, selectedSkills, data)
  }, [data, skills, equipment])

  if (error) return <div className="loading">Error: {error}</div>
  if (!data || !stats)
    return (
      <div className="loading">
        <div className="spinner" />
        Loading Outward data...
      </div>
    )

  const handleExport = () => {
    const json = exportJSON()
    // iOS Safari: use Web Share API if available, fallback to download
    if (navigator.share) {
      const file = new File([json], `${name.replace(/\s+/g, '_')}.json`, { type: 'application/json' })
      navigator.share({ files: [file] }).catch(() => {})
    } else {
      const blob = new Blob([json], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${name.replace(/\s+/g, '_')}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }
  }

  const handleImport = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'
    input.onchange = async () => {
      const f = input.files?.[0]
      if (!f) return
      const text = await f.text()
      if (!importJSON(text)) alert('Invalid build file')
    }
    input.click()
  }

  return (
    <div>
      <header className="app-header">
        <h1>⚔ Outward Builder</h1>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Build name..."
        />
        <div className="header-controls">
          <label style={{ fontSize: 13, color: 'var(--dim)', display: 'flex', alignItems: 'center', gap: 4 }}>
            Lv
            <input
              type="number"
              min={1}
              max={50}
              value={level}
              onChange={e => setLevel(parseInt(e.target.value) || 1)}
              style={{
                width: 52, background: 'var(--panel)', color: 'var(--gold)',
                border: '1px solid var(--brown)', borderRadius: 4,
                padding: '6px 4px', fontSize: 14, textAlign: 'center',
              }}
            />
          </label>
          <button
            className={`btn ${theorycraft ? 'active' : ''}`}
            onClick={() => setTheorycraft(!theorycraft)}
          >
            Theory
          </button>
          <button className="btn" onClick={handleExport}>⤓</button>
          <button className="btn" onClick={handleImport}>⤒</button>
          <button className="btn danger" onClick={() => { if (confirm('Reset?')) reset() }}>
            ✕
          </button>
        </div>
      </header>

      <div className="main-grid">
        <div className="panel">
          <h2>Skill Trees</h2>
          {(!isMobile || activeTab === 'skills') && (
            <SkillTree skills={data.skills} classes={data.classes} />
          )}
        </div>

        <div className="panel">
          <h2>Equipment</h2>
          {(!isMobile || activeTab === 'equip') && (
            <EquipmentPanel weapons={data.weapons} armor={data.armor} />
          )}
        </div>

        <div className="panel">
          <h2>Stats</h2>
          {(!isMobile || activeTab === 'stats') && (
            <StatsPanel stats={stats} allSkills={data.skills} />
          )}
        </div>
      </div>

      {isMobile && (
        <div className="ios-tabbar">
          <button
            className={`btn ${activeTab === 'skills' ? 'active' : ''}`}
            onClick={() => setActiveTab('skills')}
          >
            Skills
          </button>
          <button
            className={`btn ${activeTab === 'equip' ? 'active' : ''}`}
            onClick={() => setActiveTab('equip')}
          >
            Equipment
          </button>
          <button
            className={`btn ${activeTab === 'stats' ? 'active' : ''}`}
            onClick={() => setActiveTab('stats')}
          >
            Stats
          </button>
        </div>
      )}
    </div>
  )
}
