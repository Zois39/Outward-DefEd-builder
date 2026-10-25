import type { Skill, SkillClass, Weapon, ArmorItem } from '../types'

const BASE = import.meta.env.BASE_URL

async function fetchJSON<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}data/${path}`)
  if (!res.ok) throw new Error(`Failed to load ${path}: ${res.status}`)
  return res.json() as Promise<T>
}

export interface GameData {
  skills: Skill[]
  classes: SkillClass[]
  weapons: Weapon[]
  armor: ArmorItem[]
}

let cache: GameData | null = null

export async function loadGameData(): Promise<GameData> {
  if (cache) return cache
  const [t1, t2, t3, ts, classes, melee, ranged, magical, shields, armor] =
    await Promise.all([
      fetchJSON<Skill[]>('skills/skills_tier1.json'),
      fetchJSON<Skill[]>('skills/skills_tier2.json'),
      fetchJSON<Skill[]>('skills/skills_tier3.json'),
      fetchJSON<Skill[]>('skills/skills_special.json'),
      fetchJSON<SkillClass[]>('skills/classes.json'),
      fetchJSON<{ weapons: Weapon[] }>('weapons/weapons_melee.json'),
      fetchJSON<{ weapons: Weapon[] }>('weapons/weapons_ranged.json'),
      fetchJSON<{ weapons: Weapon[] }>('weapons/weapons_magical.json'),
      fetchJSON<{ weapons: Weapon[] }>('weapons/shields.json'),
      fetchJSON<ArmorItem[]>('armor/armor_items.json'),
    ])
  cache = {
    skills: [...t1, ...t2, ...t3, ...ts],
    classes,
    weapons: [...melee.weapons, ...ranged.weapons, ...magical.weapons, ...shields.weapons],
    armor,
  }
  return cache
}

export function img(path: string | null): string | undefined {
  if (!path) return undefined
  return `${BASE}${path}`
}
