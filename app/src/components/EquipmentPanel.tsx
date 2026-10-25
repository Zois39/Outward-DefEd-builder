import { useState, useMemo } from 'react'
import type { Weapon, ArmorItem, EquipmentSlot } from '../types'
import { img } from '../data/loader'
import { useBuildStore } from '../store/useBuildStore'
import { useTooltip } from '../hooks/useTooltip'

interface Props {
  weapons: Weapon[]
  armor: ArmorItem[]
}

const SLOT_DEFS: { id: EquipmentSlot; label: string; accepts: 'weapon' | 'armor' }[] = [
  { id: 'head', label: 'Head', accepts: 'armor' },
  { id: 'chest', label: 'Chest', accepts: 'armor' },
  { id: 'legs', label: 'Legs', accepts: 'armor' },
  { id: 'back', label: 'Back', accepts: 'armor' },
  { id: 'weapon_main', label: 'Main', accepts: 'weapon' },
  { id: 'weapon_off', label: 'Off', accepts: 'weapon' },
  { id: 'accessory1', label: 'Acc 1', accepts: 'armor' },
  { id: 'accessory2', label: 'Acc 2', accepts: 'armor' },
  { id: 'accessory3', label: 'Acc 3', accepts: 'armor' },
  { id: 'accessory4', label: 'Acc 4', accepts: 'armor' },
]

export default function EquipmentPanel({ weapons, armor }: Props) {
  const { equipment, setEquipment } = useBuildStore()
  const [pickerSlot, setPickerSlot] = useState<EquipmentSlot | null>(null)
  const [pickerQuery, setPickerQuery] = useState('')
  const tooltip = useTooltip()

  const getItem = (slot: EquipmentSlot) => {
    const name = equipment[slot]
    if (!name) return null
    const w = weapons.find(x => x.name === name)
    if (w) return { name: w.name, image: w.local_image, desc: w.description }
    const a = armor.find(x => x.name === name)
    if (a) return { name: a.name, image: a.local_image, desc: a.description }
    return { name, image: null }
  }

  const pickerItems = useMemo(() => {
    if (!pickerSlot) return []
    const def = SLOT_DEFS.find(d => d.id === pickerSlot)!
    const q = pickerQuery.toLowerCase()
    if (def.accepts === 'weapon') {
      return weapons.filter(w => !q || w.name.toLowerCase().includes(q))
    }
    const slotMap: Record<string, string[]> = {
      head: ['head'],
      chest: ['chest'],
      legs: ['legs'],
      back: ['backpack'],
      accessory1: ['necklace', 'ring', 'accessory'],
      accessory2: ['necklace', 'ring', 'accessory'],
      accessory3: ['necklace', 'ring', 'accessory'],
      accessory4: ['necklace', 'ring', 'accessory'],
    }
    const slots = slotMap[pickerSlot] ?? []
    return armor.filter(a => slots.includes(a.slot) && (!q || a.name.toLowerCase().includes(q)))
  }, [pickerSlot, pickerQuery, weapons, armor])

  return (
    <div>
      <div className="equipment-grid">
        {SLOT_DEFS.map(def => {
          const item = getItem(def.id)
          return (
            <div
              key={def.id}
              className={`equip-slot ${item ? 'filled' : ''}`}
              onClick={() => { setPickerSlot(def.id); setPickerQuery('') }}
              onMouseEnter={e =>
                item &&
                tooltip.show(e, (
                  <div>
                    <h4>{item.name}</h4>
                    <div>{item.desc}</div>
                  </div>
                ))
              }
              onMouseLeave={tooltip.hide}
              onTouchStart={e =>
                item &&
                tooltip.show(e, (
                  <div>
                    <h4>{item.name}</h4>
                    <div>{item.desc}</div>
                  </div>
                ))
              }
            >
              {item && (
                <button
                  className="clear-btn"
                  onClick={e => {
                    e.stopPropagation()
                    setEquipment(def.id, null)
                  }}
                >
                  ×
                </button>
              )}
              {item?.image && <img src={img(item.image)} alt="" loading="lazy" />}
              <div className="slot-label">{def.label}</div>
              {item && <div className="item-name">{item.name}</div>}
            </div>
          )
        })}
      </div>

      {pickerSlot && (
        <div className="modal-overlay" onClick={() => setPickerSlot(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ color: 'var(--gold)', fontSize: 14, whiteSpace: 'nowrap' }}>
                {SLOT_DEFS.find(d => d.id === pickerSlot)?.label}
              </h3>
              <input
                className="search-input"
                style={{ flex: 1, margin: 0 }}
                placeholder="Search..."
                value={pickerQuery}
                onChange={e => setPickerQuery(e.target.value)}
                autoFocus
              />
              <button className="btn" onClick={() => setPickerSlot(null)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="item-grid">
                {pickerItems.map(item => {
                  const isW = 'weapon_type' in item
                  const image = isW
                    ? (item as Weapon).local_image
                    : (item as ArmorItem).local_image
                  return (
                    <div
                      key={item.name}
                      className="item-card"
                      onClick={() => {
                        setEquipment(pickerSlot, item.name)
                        setPickerSlot(null)
                      }}
                    >
                      {image && <img src={img(image)} alt="" loading="lazy" />}
                      <div className="ic-name">{item.name}</div>
                      {!isW && (item as ArmorItem).set_name && (
                        <div style={{ fontSize: 10, color: 'var(--gold)' }}>
                          {(item as ArmorItem).set_name}
                        </div>
                      )}
                    </div>
                  )
                })}
                {pickerItems.length === 0 && (
                  <div style={{ color: 'var(--dim)', padding: 20 }}>No items found</div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {tooltip.visible && (
        <div className="tooltip" style={{ left: tooltip.x, top: tooltip.y }}>
          {tooltip.content}
        </div>
      )}
    </div>
  )
}
