import type { StatsResult, Weapon, ArmorItem, Skill } from '../types'

export function calcStats(
  equipment: Partial<Record<string, string>>,
  skills: Skill[],
  data: { weapons: Weapon[]; armor: ArmorItem[] }
): StatsResult {
  const res: StatsResult = {
    health: 100,
    stamina: 100,
    mana: 20,
    protection: 0,
    resistances: {},
    impactResist: 0,
    staminaCostReduction: 0,
    manaCostReduction: 0,
    moveSpeed: 0,
    coldResist: 0,
    heatResist: 0,
    pouch: 0,
    damageBonuses: {},
  }

  Object.values(equipment).forEach(name => {
    if (!name) return
    const a = data.armor.find(x => x.name === name)
    if (a) {
      res.protection += a.protection ?? 0
      res.impactResist += a.resistances?.impact ?? 0
      res.staminaCostReduction += a.stamina_cost_reduction ?? 0
      res.manaCostReduction += a.mana_cost_reduction ?? 0
      res.moveSpeed += a.move_speed ?? 0
      res.coldResist += a.cold_resist ?? 0
      res.heatResist += a.heat_resist ?? 0
      res.pouch += a.pouch ?? 0
      for (const [k, v] of Object.entries(a.resistances ?? {})) {
        if (v && k !== 'impact') res.resistances[k] = (res.resistances[k] ?? 0) + v
      }
    }
    const w = data.weapons.find(x => x.name === name)
    if (w?.damage_stats?.base_damage) {
      for (const [k, v] of Object.entries(w.damage_stats.base_damage)) {
        res.damageBonuses[k] = (res.damageBonuses[k] ?? 0) + v
      }
    }
  })

  skills.forEach(s => {
    const txt = s.effects ?? ''
    const m = txt.match(/([+-])(\d+)\s*(health|stamina|mana)/i)
    if (m) {
      const key = m[3].toLowerCase() as 'health' | 'stamina' | 'mana'
      res[key] += parseInt(m[2]) * (m[1] === '-' ? -1 : 1)
    }
    const prot = txt.match(/([+-])(\d+)\s*protection/i)
    if (prot) res.protection += parseInt(prot[2]) * (prot[1] === '-' ? -1 : 1)
  })

  return res
}

export function meetsRequirement(req: string | null, stats: StatsResult): boolean {
  if (!req) return true
  const m = req.match(/(\d+)\s*(health|stamina|mana)/i)
  if (!m) return true
  const need = parseInt(m[1])
  const key = m[2].toLowerCase() as 'health' | 'stamina' | 'mana'
  return stats[key] >= need
}
