export interface Skill {
  name: string
  description: string
  effects: string
  tier: 1 | 2 | 3 | 0
  tier_label: string
  parent_class: string
  skill_type: string
  subtype: string
  mana_cost: string
  stamina_cost: string
  health_cost: string
  cooldown: string
  damage: string
  trainer: string
  location: string
  cost: string
  costs_breakthrough: boolean
  unlock_requirement: string
  requires_skill: string | null
  local_image: string | null
  source_url: string
}

export interface SkillClass {
  name: string
  teacher: string
  location: string
  is_dlc: boolean
  has_breakthrough: boolean
  local_image: string | null
  skill_counts: { tier1: number; tier2: number; tier3: number }
}

export interface Weapon {
  name: string
  description: string
  weapon_type: string
  handedness: string
  damage_stats?: {
    base_damage: Record<string, number>
    impact: number
    attack_speed: number
    stamina_cost: number
  }
  block_stats?: { block_power?: number; impact_resistance?: number }
  durability: number
  weight: number
  requirements: string | null
  special_effects: string | null
  dlc: string
  set: string | null
  local_image: string | null
}

export interface ArmorItem {
  name: string
  description: string
  slot: 'head' | 'chest' | 'legs' | 'backpack' | string
  resistances: Record<string, number | null>
  protection: number | null
  weight: number
  cold_resist: number | null
  heat_resist: number | null
  stamina_cost_reduction: number | null
  mana_cost_reduction: number | null
  move_speed: number | null
  pouch: number | null
  set_name: string | null
  local_image: string | null
}

export type EquipmentSlot =
  | 'head' | 'chest' | 'legs' | 'back'
  | 'weapon_main' | 'weapon_off'
  | 'accessory1' | 'accessory2' | 'accessory3' | 'accessory4'

export interface BuildState {
  name: string
  level: number
  theorycraft: boolean
  attributes: { health: number; stamina: number; mana: number }
  skills: string[]
  equipment: Partial<Record<EquipmentSlot, string>>
  breakthroughsUsed: number
}

export interface StatsResult {
  health: number
  stamina: number
  mana: number
  protection: number
  resistances: Record<string, number>
  impactResist: number
  staminaCostReduction: number
  manaCostReduction: number
  moveSpeed: number
  coldResist: number
  heatResist: number
  pouch: number
  damageBonuses: Record<string, number>
}
