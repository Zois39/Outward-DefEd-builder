# Outward Weapons Database

Complete weapon database from Outward Wiki (outward.wiki.gg)

## Structure

```
outward_weapons_unified/
├── data.json                 # All 449 weapons with metadata
├── weapons_melee.json        # 338 melee weapons
├── weapons_ranged.json       # 42 ranged weapons
├── weapons_magical.json      # 36 magical weapons
├── shields.json              # 33 shields
├── weapon_categories.json    # Category descriptions
└── images/
    ├── weapons/              # 416 weapon icons
    └── shields/              # 33 shield icons
```

## Weapon Fields

| Field | Description |
|-------|-------------|
| `name` | Weapon name |
| `description` | In-game description |
| `weapon_type` | sword, axe, mace, spear, halberd, dagger, fist, bow, pistol, staff, chakram, shield |
| `category_class` | Original wiki class |
| `handedness` | one_handed, two_handed, off_handed |
| `damage_stats` | Base damage by type, impact, attack speed, stamina cost, reach |
| `block_stats` | For shields: block power, impact resistance |
| `durability` | Weapon durability |
| `weight` | Carry weight |
| `price` | Buy/sell prices |
| `crafting_recipe` | Ingredients and station |
| `upgrade_paths` | Legacy chest upgrades |
| `special_effects` | Status effects inflicted |
| `dlc` | Base game or DLC name |
| `set` | Equipment set name |
| `image` | Image filename |
| `image_url` | Full wiki URL |
| `local_image` | Local path in archive |
| `source_url` | Wiki page URL |
| `source_category` | craftable, loot_or_legacy |

## Damage Types

- `physical` - Standard damage
- `fire` - Fire damage
- `frost` - Frost damage
- `lightning` - Lightning damage
- `ethereal` - Ethereal damage
- `decay` - Decay damage

## Categories

| Category | Count |
|----------|-------|
| Melee | 338 |
| Ranged | 42 |
| Magical | 36 |
| Shields | 33 |
| **Total** | **449** |

## DLC Distribution

| DLC | Count |
|-----|-------|
| Base Game | 199 |
| The Three Brothers | 168 |
| The Soroboreans | 82 |

## Source

- **Wiki**: outward.wiki.gg
- **API**: MediaWiki API
- **Verified**: October 2026
