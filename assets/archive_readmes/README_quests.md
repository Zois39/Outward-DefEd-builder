# Outward Complete Database

Полная база данных фракций, квестов и наград игры Outward.

## Источник
- **Wiki**: outward.wiki.gg
- **Дата сбора**: 2026-10-25

## Состав базы

### Файлы данных

1. **data.json** - единый файл со всеми данными
2. **factions.json** - 4 основные фракции
   - The Blue Chamber Collective
   - The Heroic Kingdom of Levant
   - The Holy Mission of Elatt
   - Sorobor Academy
3. **quests.json** - 59 квестов
4. **quest_chains.json** - цепочки квестов по фракциям
5. **rewards.json** - 29 записей наград
6. **exclusivity_map.json** - карта взаимоисключений фракций

### Папка images/
- 63 изображения (гербы фракций, иконки квестов)

## Структура данных

### Фракция (faction)
```json
{
  "id": "blue_chamber_collective",
  "name": "The Blue Chamber Collective",
  "description": "...",
  "lore": "...",
  "image_url": "...",
  "headquarters": "Berg",
  "locations": ["Chersonese", "Enmerkar Forest"],
  "key_npcs": ["Cyril Turnbull", "Rissa Aberdeen"],
  "unique_quests": ["Mixed Legacies", "Ash Giants"],
  "unique_rewards": {
    "skills": ["Ancestors' Memories"],
    "items": ["Crimson Plate Set"]
  },
  "mutually_exclusive_with": ["The Heroic Kingdom of Levant", "..."],
  "faction_exclusive": true,
  "source_url": "..."
}
```

### Квест (quest)
```json
{
  "id": "mixed_legacies",
  "name": "Mixed Legacies",
  "description": "...",
  "quest_type": "faction_exclusive",
  "faction": "The Blue Chamber Collective",
  "image_url": "...",
  "locations": ["Berg"],
  "quest_giver": "Rissa Aberdeen",
  "requirements": [],
  "previous_quests": [],
  "next_quests": [],
  "outcomes": [...],
  "rewards": {
    "items": [{"quantity": 3, "name": "Bouillon du Predateur"}],
    "silver": 100,
    "experience": 0,
    "reputation": {}
  },
  "source_url": "..."
}
```

## Механики игры

### Взаимоисключение фракций
Игрок может присоединиться только к ОДНОЙ из четырех фракций:
- The Blue Chamber Collective
- The Heroic Kingdom of Levant
- The Holy Mission of Elatt
- Sorobor Academy

Выбор фракции навсегда закрывает доступ к квестам и наградам других фракций.

### Типы квестов
- **faction_exclusive** - уникальные квесты фракций
- **main** - основные сюжетные квесты
- **side** - побочные квесты

## Статистика

- **Фракций**: 4
- **Квестов**: 59
- **Наград**: 29 записей
- **Изображений**: 63

## Проверка соответствия

Все данные проверены на соответствие с outward.wiki.gg:
- ✓ Фракции (4/4 корректно)
- ✓ Фракционные квесты (13/13 корректно)
- ✓ Цепочки квестов
- ✓ Взаимоисключения фракций
