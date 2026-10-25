import { useState, useMemo } from 'react'
import type { Skill, StatsResult } from '../types'
import { img } from '../data/loader'
import { useBuildStore } from '../store/useBuildStore'

interface Props {
  stats: StatsResult
  allSkills: Skill[]
}

export default function StatsPanel({ stats, allSkills }: Props) {
  const [tab, setTab] = useState<'stats' | 'skills' | 'effects'>('stats')
  const { skills: selectedSkills, level } = useBuildStore()

  const selected = useMemo(
    () => allSkills.filter(s => selectedSkills.includes(s.name)),
    [allSkills, selectedSkills]
  )

  const StatRow = ({ label, value, suffix = '' }: { label: string; value: number; suffix?: string }) => (
    <div className="stat-row">
      <span>{label}</span>
      <span className={`val ${value < 0 ? 'neg' : ''}`}>
        {value > 0 && !['Stamina Cost', 'Mana Cost'].includes(label) ? '+' : ''}
        {value}{suffix}
      </span>
    </div>
  )

  return (
    <div>
      <div className="tabs">
        {(['stats', 'skills', 'effects'] as const).map(t => (
          <div
            key={t}
            className={`tab ${tab === t ? 'active' : ''}`}
            onClick={() => setTab(t)}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </div>
        ))}
      </div>

      {tab === 'stats' && (
        <div>
          <div className="stat-section">
            <h3>Core</h3>
            <StatRow label="Health" value={stats.health} />
            <StatRow label="Stamina" value={stats.stamina} />
            <StatRow label="Mana" value={stats.mana} />
          </div>
          <div className="stat-section">
            <h3>Defense</h3>
            <StatRow label="Protection" value={stats.protection} />
            <StatRow label="Impact Resist" value={stats.impactResist} />
            {Object.entries(stats.resistances).map(([k, v]) => (
              <StatRow
                key={k}
                label={`${k.charAt(0).toUpperCase() + k.slice(1)} Resist`}
                value={v}
              />
            ))}
          </div>
          <div className="stat-section">
            <h3>Modifiers</h3>
            <StatRow label="Stamina Cost" value={-stats.staminaCostReduction} suffix="%" />
            <StatRow label="Mana Cost" value={-stats.manaCostReduction} suffix="%" />
            <StatRow label="Move Speed" value={stats.moveSpeed} suffix="%" />
            <StatRow label="Cold Protection" value={stats.coldResist} />
            <StatRow label="Heat Protection" value={stats.heatResist} />
            <StatRow label="Pouch Bonus" value={stats.pouch} />
          </div>
          {Object.keys(stats.damageBonuses).length > 0 && (
            <div className="stat-section">
              <h3>Weapon Damage</h3>
              {Object.entries(stats.damageBonuses).map(([k, v]) => (
                <StatRow key={k} label={k.charAt(0).toUpperCase() + k.slice(1)} value={v} />
              ))}
            </div>
          )}
        </div>
      )}

      {tab === 'skills' && (
        <div>
          <div style={{ fontSize: 12, color: 'var(--dim)', marginBottom: 8 }}>
            {selected.length} skill{selected.length !== 1 ? 's' : ''} selected
          </div>
          {selected.map(s => (
            <div
              key={s.name}
              style={{
                display: 'flex', gap: 8, alignItems: 'center',
                padding: '8px 0', borderBottom: '1px solid #3a2f1e',
              }}
            >
              <img
                src={img(s.local_image)}
                alt=""
                style={{ width: 36, height: 36, borderRadius: 4 }}
                loading="lazy"
              />
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 14 }}>{s.name}</div>
                <div style={{ fontSize: 11, color: 'var(--dim)' }}>
                  {s.parent_class} · {s.tier_label}
                </div>
              </div>
            </div>
          ))}
          {selected.length === 0 && (
            <div style={{ color: 'var(--dim)', padding: 20, textAlign: 'center' }}>
              No skills selected
            </div>
          )}
        </div>
      )}

      {tab === 'effects' && (
        <div>
          <div className="stat-section">
            <h3>Equipment Effects</h3>
            {stats.protection === 0 && stats.impactResist === 0 &&
             Object.keys(stats.resistances).length === 0 ? (
              <div style={{ color: 'var(--dim)', fontSize: 12 }}>No passive effects</div>
            ) : (
              <>
                {stats.protection > 0 && <StatRow label="Protection" value={stats.protection} />}
                {stats.impactResist > 0 && <StatRow label="Impact Resist" value={stats.impactResist} />}
                {Object.entries(stats.resistances).map(([k, v]) => (
                  <StatRow key={k} label={`${k} resist`} value={v} />
                ))}
              </>
            )}
          </div>
          <div className="stat-section">
            <h3>Skill Effects</h3>
            {selected.filter(s => s.effects).map(s => (
              <div
                key={s.name}
                style={{ fontSize: 12, padding: '6px 0', borderBottom: '1px solid #3a2f1e' }}
              >
                <b style={{ color: 'var(--gold)' }}>{s.name}:</b>{' '}
                <span style={{ color: 'var(--dim)' }}>{s.effects}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="stat-section">
        <h3>Progression (Level {level})</h3>
        <div className="timeline">
          {Array.from({ length: 50 }, (_, i) => i + 1).map(n => (
            <div key={n} className={`timeline-dot ${n <= level ? 'filled' : ''}`}>
              {n}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
