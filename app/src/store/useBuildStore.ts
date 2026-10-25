import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { BuildState, EquipmentSlot } from '../types'

interface BuildStore extends BuildState {
  toggleSkill: (name: string, isBreakthrough: boolean) => void
  setEquipment: (slot: EquipmentSlot, item: string | null) => void
  setLevel: (l: number) => void
  setTheorycraft: (b: boolean) => void
  setName: (n: string) => void
  reset: () => void
  exportJSON: () => string
  importJSON: (s: string) => boolean
}

const initial: BuildState = {
  name: 'New Build',
  level: 1,
  theorycraft: false,
  attributes: { health: 100, stamina: 100, mana: 20 },
  skills: [],
  equipment: {},
  breakthroughsUsed: 0,
}

export const useBuildStore = create<BuildStore>()(
  persist(
    (set, get) => ({
      ...initial,
      toggleSkill: (name, isBreakthrough) =>
        set(s => {
          if (s.skills.includes(name)) {
            return {
              skills: s.skills.filter(x => x !== name),
              breakthroughsUsed: s.breakthroughsUsed - (isBreakthrough ? 1 : 0),
            }
          }
          if (!s.theorycraft && s.skills.length >= s.level) return s
          if (isBreakthrough && !s.theorycraft && s.breakthroughsUsed >= 3) return s
          return {
            skills: [...s.skills, name],
            breakthroughsUsed: s.breakthroughsUsed + (isBreakthrough ? 1 : 0),
          }
        }),
      setEquipment: (slot, item) =>
        set(s => ({ equipment: { ...s.equipment, [slot]: item } })),
      setLevel: l => set({ level: Math.min(50, Math.max(1, l)) }),
      setTheorycraft: b => set({ theorycraft: b }),
      setName: n => set({ name: n }),
      reset: () => set(initial),
      exportJSON: () => JSON.stringify(get(), null, 2),
      importJSON: s => {
        try {
          const d = JSON.parse(s)
          if (typeof d !== 'object' || d === null) return false
          set({ ...initial, ...d })
          return true
        } catch {
          return false
        }
      },
    }),
    { name: 'outward-build-v1' }
  )
)
