import { useState, useMemo } from 'react'
import type { Skill, SkillClass } from '../types'
import { img } from '../data/loader'
import { useBuildStore } from '../store/useBuildStore'
import { useTooltip } from '../hooks/useTooltip'

interface Props {
  skills: Skill[]
  classes: SkillClass[]
}

export default function SkillTree({ skills, classes }: Props) {
  const [query, setQuery] = useState('')
  const [openClass, setOpenClass] = useState<string | null>(classes[0]?.name ?? null)
  const [filterClass, setFilterClass] = useState<string | null>(null)
  const { skills: selected, toggleSkill, level, theorycraft, breakthroughsUsed } = useBuildStore()
  const tooltip = useTooltip()

  const filtered = useMemo(() => {
    let list = skills
    if (filterClass) list = list.filter(s => s.parent_class === filterClass)
    if (query) {
      const q = query.toLowerCase()
      list = list.filter(s =>
        s.name.toLowerCase().includes(q) ||
        s.effects?.toLowerCase().includes(q) ||
        s.subtype?.toLowerCase().includes(q)
      )
    }
    return list
  }, [skills, query, filterClass])

  const byClass = useMemo(() => {
    const map = new Map<string, Skill[]>()
    filtered.forEach(s => {
      const arr = map.get(s.parent_class) ?? []
      arr.push(s)
      map.set(s.parent_class, arr)
    })
    const tierOrder = (t: number) => (t === 0 ? 4 : t)
    map.forEach(arr => arr.sort((a, b) => tierOrder(a.tier) - tierOrder(b.tier)))
    return map
  }, [filtered])

  const skillPointsUsed = selected.length
  const pointsLeft = theorycraft ? Infinity : level - skillPointsUsed

  const handleSkillTap = (skill: Skill, canAfford: boolean) => {
    if (!canAfford) return
    toggleSkill(skill.name, skill.costs_breakthrough)
  }

  const tooltipContent = (skill: Skill) => (
    <div>
      <h4>{skill.name}</h4>
      <div>{skill.description}</div>
      {skill.effects && <div style={{ marginTop: 6 }}>{skill.effects}</div>}
      <div className="tt-meta">
        {skill.skill_type} {skill.subtype && `· ${skill.subtype}`}
        {skill.mana_cost && ` · ${skill.mana_cost} Mana`}
        {skill.stamina_cost && ` · ${skill.stamina_cost} Stam`}
        {skill.cooldown && ` · CD ${skill.cooldown}`}
        <br />Trainer: {skill.trainer} ({skill.location})
        {skill.cost && ` · Cost: ${skill.cost} silver`}
      </div>
    </div>
  )

  return (
    <div>
      <input
        className="search-input"
        placeholder="Search skills..."
        value={query}
        onChange={e => setQuery(e.target.value)}
      />
      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 10 }}>
        <button
          className={`btn ${filterClass === null ? 'active' : ''}`}
          style={{ padding: '4px 10px', fontSize: 12 }}
          onClick={() => setFilterClass(null)}
        >
          All
        </button>
        {classes.map(c => (
          <button
            key={c.name}
            className={`btn ${filterClass === c.name ? 'active' : ''}`}
            style={{ padding: '4px 10px', fontSize: 12 }}
            onClick={() => setFilterClass(c.name)}
          >
            {c.name}
          </button>
        ))}
      </div>

      <div style={{ fontSize: 12, color: 'var(--dim)', marginBottom: 8 }}>
        Points:{' '}
        <b style={{ color: pointsLeft < 0 ? 'var(--red)' : 'var(--gold)' }}>
          {skillPointsUsed}{theorycraft ? ' / ∞' : ` / ${level}`}
        </b>
        {'  '}| Breakthroughs:{' '}
        <b style={{ color: breakthroughsUsed >= 3 ? 'var(--red)' : 'var(--gold)' }}>
          {breakthroughsUsed} / 3
        </b>
      </div>

      {classes.map(cls => {
        const list = byClass.get(cls.name)
        if (!list || list.length === 0) return null
        const isOpen = filterClass === cls.name || openClass === cls.name || query.length > 0
        return (
          <div key={cls.name} className="class-block">
            <div
              className="class-header"
              onClick={() => setOpenClass(isOpen ? null : cls.name)}
            >
              <img src={img(cls.local_image)} alt="" />
              <div>
                <div style={{ fontSize: 13, color: 'var(--gold)' }}>{cls.name}</div>
                <div style={{ fontSize: 11, color: 'var(--dim)' }}>
                  {cls.teacher} — {cls.location}
                </div>
              </div>
              {cls.is_dlc && <span className="dlc-tag">DLC</span>}
            </div>
            {isOpen &&
              list.map(skill => {
                const isSel = selected.includes(skill.name)
                const isT2 = skill.costs_breakthrough
                const canAfford = theorycraft || pointsLeft > 0 || isSel
                return (
                  <div
                    key={skill.name}
                    className={`skill-row ${isSel ? 'selected' : ''} ${!canAfford ? 'locked' : ''}`}
                    onClick={() => handleSkillTap(skill, canAfford)}
                    onMouseEnter={e => tooltip.show(e, tooltipContent(skill))}
                    onMouseLeave={tooltip.hide}
                    onTouchStart={e => tooltip.show(e, tooltipContent(skill))}
                  >
                    <img src={img(skill.local_image)} alt="" loading="lazy" />
                    <div className="skill-info">
                      <div className="skill-name">{skill.name}</div>
                      <div className="skill-meta">
                        {skill.skill_type}
                        {skill.subtype ? ` · ${skill.subtype}` : ''}
                        {skill.mana_cost ? ` · ${skill.mana_cost} Mana` : ''}
                      </div>
                    </div>
                    <span
                      className={`tier-badge ${skill.tier === 2 ? 't2' : skill.tier === 3 ? 't3' : ''}`}
                    >
                      {skill.tier === 0 ? 'SP' : `T${skill.tier}`}
                    </span>
                  </div>
                )
              })}
          </div>
        )
      })}

      {tooltip.visible && (
        <div className="tooltip" style={{ left: tooltip.x, top: tooltip.y }}>
          {tooltip.content}
        </div>
      )}
    </div>
  )
}
