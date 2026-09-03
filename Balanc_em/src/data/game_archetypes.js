// Balanc'em - Embedded Game Mechanics & RPG Combat Archetypes Library
window.BALANCEM_ARCHETYPES = [
  {
    "id": "soulslike_boss",
    "name": "Soulslike Boss / Heavy Knight",
    "category": "Action RPG & Souls",
    "desc": "Massive effective health pool, slow high-impact poise breaking hits, heavy stamina drain, and strict iframe dodge windows.",
    "defaults": {
      "damagePerSecondDps": 780,
      "effectiveHealthPoolEhp": 18500,
      "resourceCostCooldown": 85,
      "skillCeilingApm": 90,
      "mobilitySpeed": 35,
      "criticalMultiplier": 1.5,
      "lockMode": "ehp"
    },
    "submodules": [
      { "id": "m1", "name": "Colossal Greatsword Slam", "type": "Heavy Attack", "powerScore": 92 },
      { "id": "m2", "name": "Full Plate Armor & Poise", "type": "Defense", "powerScore": 95 },
      { "id": "m3", "name": "Stamina Recovery Delay", "type": "Resource", "powerScore": 60 },
      { "id": "m4", "name": "Telegraphed Windup Window", "type": "Mechanic", "powerScore": 75 }
    ]
  },
  {
    "id": "hero_assassin",
    "name": "Competitive Hero Assassin",
    "category": "Hero Shooter / MOBA",
    "desc": "Ultra-fast burst damage, low health pool (glass cannon), instant mobility reset, and 240 APM execution requirement.",
    "defaults": {
      "damagePerSecondDps": 1650,
      "effectiveHealthPoolEhp": 1800,
      "resourceCostCooldown": 40,
      "skillCeilingApm": 260,
      "mobilitySpeed": 110,
      "criticalMultiplier": 2.5,
      "lockMode": "dps"
    },
    "submodules": [
      { "id": "m1", "name": "Shuriken Fan & Headshot Burst", "type": "Primary DPS", "powerScore": 96 },
      { "id": "m2", "name": "Swift Strike Dash Reset", "type": "Mobility", "powerScore": 88 },
      { "id": "m3", "name": "Deflect Parry Reaction", "type": "Survival", "powerScore": 82 },
      { "id": "m4", "name": "Dragonblade Ultimate Melee", "type": "Ultimate", "powerScore": 98 }
    ]
  },
  {
    "id": "mmo_holy_tank",
    "name": "MMORPG Holy Trinity Tank",
    "category": "MMORPG & Raids",
    "desc": "80% passive damage reduction, low sustained DPS, active shield block mitigation, and raid positioning mechanics.",
    "defaults": {
      "damagePerSecondDps": 220,
      "effectiveHealthPoolEhp": 32000,
      "resourceCostCooldown": 110,
      "skillCeilingApm": 75,
      "mobilitySpeed": 25,
      "criticalMultiplier": 1.2,
      "lockMode": "ehp"
    },
    "submodules": [
      { "id": "m1", "name": "Shield Wall Invulnerability", "type": "Mitigation", "powerScore": 99 },
      { "id": "m2", "name": "Taunt & Threat Generation", "type": "Aggro", "powerScore": 90 },
      { "id": "m3", "name": "Holy Consecration Ground", "type": "Area Control", "powerScore": 65 },
      { "id": "m4", "name": "Party Damage Redirection", "type": "Utility", "powerScore": 85 }
    ]
  },
  {
    "id": "roguelike_glass_cannon",
    "name": "Roguelike Magic Glass Cannon",
    "category": "Roguelike & Deckbuilder",
    "desc": "Exponential spell synergy, screen-clearing AoE firestorms, zero armor, and high mana attrition.",
    "defaults": {
      "damagePerSecondDps": 2400,
      "effectiveHealthPoolEhp": 950,
      "resourceCostCooldown": 140,
      "skillCeilingApm": 180,
      "mobilitySpeed": 70,
      "criticalMultiplier": 3.0,
      "lockMode": "dps"
    },
    "submodules": [
      { "id": "m1", "name": "Meteor Cascade AoE", "type": "Burst Spell", "powerScore": 98 },
      { "id": "m2", "name": "Ignite Stack Synergies", "type": "DoT Multiplier", "powerScore": 94 },
      { "id": "m3", "name": "Mana Burn Battery", "type": "Resource Cost", "powerScore": 88 },
      { "id": "m4", "name": "Teleport Blink Escape", "type": "Mobility", "powerScore": 70 }
    ]
  }
];
