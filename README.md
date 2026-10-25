# Outward Database

Единый структурированный репозиторий данных по игре **Outward** (источник: outward.wiki.gg).
Собран: 2026-10-26

## Состав

| Раздел | Описание |
|--------|----------|
| `weapons` | Оружие и щиты — 449 записей: 338 melee, 42 ranged, 36 magical, 33 shields (6 JSON, 416 изображений) |
| `armor` | Броня и сеты — items/sets/categories + иконки (6 JSON, 343 изображений) |
| `consumables` | Расходники и крафт — еда, зелья, аммуниция, инструменты + рецепты крафта (9 JSON, 224 изображений) |
| `quests` | Квесты, фракции, награды — 59 квестов, 4 фракции, цепочки, награды (6 JSON, 63 изображений) |
| `skills` | Классы и навыки — 13 классов, тиры 1/2/3 + special (7 JSON, 177 изображений) |
| `effects` | Статус-эффекты и атрибуты — attributes, damage_types, set_bonuses, status_effects (6 JSON, 172 изображений) |

## Структура

```
outward-database/
├── README.md                  # этот файл
├── data/raw/<section>/        # исходные JSON (только чтение)
├── assets/images/<section>/   # иконки PNG/JPG
├── assets/archive_readmes/    # оригинальные README из архивов
└── reports/inventory.md       # отчёт инвентаризации
```

## Соглашения

- Все пути в полях `local_image` — относительно корня репозитория.
- `null` в `local_image` означает, что иконка отсутствует в исходных данных wiki (10 записей).
- Имена файлов приведены к ASCII (3 файла транслитерированы).

## Использование

```python
import json
weapons = json.load(open('data/raw/weapons/weapons_melee.json'))
```
