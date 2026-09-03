// Pulse'em - Embedded Biometric & Longevity Protocols Library
window.PULSEEM_PROTOCOLS = [
  {
    "id": "zone2_longevity",
    "name": "Zone 2 & Cellular Longevity",
    "category": "Preventative Health",
    "desc": "80% aerobic base building, time-restricted eating (16:8), high parasympathetic HRV restoration, and deep sleep architecture.",
    "defaults": {
      "trainingStrainTrimp": 380,
      "autonomicRecoveryHrv": 85,
      "metabolicFuelingPercent": 100,
      "autophagyScore": 88,
      "longevityScore": 125,
      "lockMode": "recovery"
    },
    "submodules": [
      { "id": "m1", "name": "Zone 2 Aerobic Base (4x45m)", "category": "Cardio", "target": "130-140 BPM", "status": "active" },
      { "id": "m2", "name": "Autophagy Fasting Window (16h)", "category": "Metabolism", "target": "16h Fasted", "status": "active" },
      { "id": "m3", "name": "Deep Sleep & Cold Room", "category": "Recovery", "target": "1.8h Deep", "status": "active" },
      { "id": "m4", "name": "Omega-3 & Polyphenol Stack", "category": "Biomarker", "target": "hsCRP < 0.5", "status": "active" }
    ]
  },
  {
    "id": "hyrox_athlete",
    "name": "Elite Hybrid / HYROX Competitor",
    "category": "High Performance",
    "desc": "Heavy lactate threshold training, sled push volume, high carbohydrate fueling (6g/kg), and active recovery protocols.",
    "defaults": {
      "trainingStrainTrimp": 850,
      "autonomicRecoveryHrv": 72,
      "metabolicFuelingPercent": 145,
      "autophagyScore": 45,
      "longevityScore": 95,
      "lockMode": "strain"
    },
    "submodules": [
      { "id": "m1", "name": "Threshold Intervals & Sled Work", "category": "Cardio", "target": "850 TRIMP", "status": "active" },
      { "id": "m2", "name": "High-Glycogen Fueling Protocol", "category": "Metabolism", "target": "3800 kcal", "status": "active" },
      { "id": "m3", "name": "Contrast Hydrotherapy & Sauna", "category": "Recovery", "target": "20m @ 85C", "status": "active" },
      { "id": "m4", "name": "Creatine Monohydrate & Tart Cherry", "category": "Biomarker", "target": "5g Daily", "status": "active" }
    ]
  },
  {
    "id": "executive_circadian",
    "name": "Desk Executive Circadian Reset",
    "category": "Cognitive & Stress",
    "desc": "Sedentary risk mitigation, morning sunlight optical entrainment, micro-walks, and evening blue-light filtration.",
    "defaults": {
      "trainingStrainTrimp": 260,
      "autonomicRecoveryHrv": 60,
      "metabolicFuelingPercent": 85,
      "autophagyScore": 70,
      "longevityScore": 90,
      "lockMode": "longevity"
    },
    "submodules": [
      { "id": "m1", "name": "Morning Lux Entrainment", "category": "Circadian", "target": "10k Lux @ 7AM", "status": "active" },
      { "id": "m2", "name": "Zone 1 Micro-Workouts (Hourly)", "category": "Cardio", "target": "8k Steps", "status": "active" },
      { "id": "m3", "name": "Magnesium Glycinate & L-Theanine", "category": "Recovery", "target": "400mg Night", "status": "active" },
      { "id": "m4", "name": "Zero Screens 90m Pre-Bed", "category": "Recovery", "target": "10:30 PM Sleep", "status": "active" }
    ]
  },
  {
    "id": "fasting_autophagy",
    "name": "Prolonged Fasting & Autophagy",
    "category": "Autophagy & Fasting",
    "desc": "36-hour periodic water fast with electrolyte balancing, light walking, and mTOR suppression.",
    "defaults": {
      "trainingStrainTrimp": 180,
      "autonomicRecoveryHrv": 90,
      "metabolicFuelingPercent": 40,
      "autophagyScore": 145,
      "longevityScore": 140,
      "lockMode": "fuel"
    },
    "submodules": [
      { "id": "m1", "name": "36h Water & Electrolyte Fast", "category": "Metabolism", "target": "Ketones > 2.0", "status": "active" },
      { "id": "m2", "name": "Autonomic Coherence Breathwork", "category": "Recovery", "target": "0.1 Hz Pace", "status": "active" },
      { "id": "m3", "name": "Gentle Nature Walking", "category": "Cardio", "target": "5k Easy Steps", "status": "active" },
      { "id": "m4", "name": "Bone Broth Re-Feeding Protocol", "category": "Metabolism", "target": "Gentle Protein", "status": "active" }
    ]
  }
];
