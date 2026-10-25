Outward — база данных классов, тиров и навыков
Источник: https://outward.wiki.gg (MediaWiki API)
Дата сбора: 2026-10-25

СТРУКТУРА
- classes.json        — 13 классов/деревьев навыков (8 базовых + 5 DLC)
- tiers.json          — механики тиров (Tier 1/2/3 + Special)
- skills_tier1.json   — 55 базовых навыков (50–100 серебра, без прорыва)
- skills_tier2.json   — 11 Breakthrough-навыков (costs_breakthrough: true)
- skills_tier3.json   — 38 продвинутых навыков (требуют Tier 2 в дереве)
- skills_special.json — 60 особых навыков (тренеры, квесты, фракции)
- data.json           — единый файл со всеми данными
- images/             — 177 иконок (skill_*.png, class_*.png)

МЕХАНИКА ПРОРЫВА (Breakthrough)
- У персонажа всего 3 очка прорыва; изучение Tier 2 тратит 1 очко навсегда.
- Tier 3 открывается только после взятия Tier 2 в том же дереве.
- Парные Tier 3 навыки (стоящие рядом в дереве) взаимоисключающи.
- Weapon Master и Specialist (DLC The Three Brothers) Breakthrough не имеют —
  все навыки доступны после разблокировки учителя (покупаются за Conqueror's Medals).

ПОЛЯ НАВЫКОВ
name, description, effects, tier, parent_class, skill_type, subtype,
image_url, local_image, requirements, consumes, mana_cost, stamina_cost,
health_cost, cooldown, durability_cost, damage, multipliers, trainer,
location, cost, unlock_requirement, requires_skill, costs_breakthrough, source_url

ПРОВЕРКИ
✓ У всех Tier 2 стоит costs_breakthrough: true
✓ У всех Tier 3 указан unlock_requirement со ссылкой на Tier 2
✓ requires_skill сохранён из поля prereq вики (может ссылаться на навык, квест или NPC)
