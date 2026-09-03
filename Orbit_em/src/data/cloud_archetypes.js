// Orbit'em - Embedded Cloud Infrastructure Archetypes Library
window.ORBITEM_ARCHETYPES = [
  {
    "id": "saas_edge_mvp",
    "name": "B2B SaaS Edge-First MVP",
    "category": "Startup & Web",
    "desc": "Single-region edge-first serverless architecture with Supabase Postgres, Vercel edge runtime, and Stripe billing.",
    "defaults": {
      "monthlyBudget": 450,
      "availabilitySla": 99.9,
      "p99LatencyMs": 45,
      "computeCapacity": 40,
      "opsComplexity": 35,
      "securityCompliance": 65,
      "lockMode": "budget"
    },
    "submodules": [
      { "id": "m1", "name": "Vercel Edge API / SSR", "category": "Compute", "costShare": 120, "tier": "Serverless", "status": "active" },
      { "id": "m2", "name": "Supabase Managed Postgres", "category": "Database", "costShare": 150, "tier": "Managed", "status": "active" },
      { "id": "m3", "name": "Cloudflare CDN & WAF", "category": "Networking", "costShare": 80, "tier": "Edge", "status": "active" },
      { "id": "m4", "name": "Stripe & Resend Webhooks", "category": "Integration", "costShare": 100, "tier": "SaaS", "status": "active" }
    ]
  },
  {
    "id": "fintech_core_soc2",
    "name": "FinTech Core (PCI-DSS & SOC2)",
    "category": "Enterprise & Finance",
    "desc": "Multi-AZ AWS Aurora PostgreSQL with hardware security module (AWS KMS HSM), isolated VPC, and Kafka event streaming.",
    "defaults": {
      "monthlyBudget": 6500,
      "availabilitySla": 99.99,
      "p99LatencyMs": 15,
      "computeCapacity": 120,
      "opsComplexity": 130,
      "securityCompliance": 98,
      "lockMode": "sla"
    },
    "submodules": [
      { "id": "m1", "name": "AWS Aurora Multi-AZ Cluster", "category": "Database", "costShare": 2400, "tier": "Multi-AZ", "status": "active" },
      { "id": "m2", "name": "EKS Private Compute Fleet", "category": "Compute", "costShare": 1800, "tier": "Kubernetes", "status": "active" },
      { "id": "m3", "name": "Apache Kafka Managed Bus", "category": "Messaging", "costShare": 1200, "tier": "Event-Driven", "status": "active" },
      { "id": "m4", "name": "CloudTrail & GuardDuty HSM", "category": "Security", "costShare": 1100, "tier": "Zero-Trust", "status": "active" }
    ]
  },
  {
    "id": "ai_gpu_inference",
    "name": "AI / LLM GPU Inference Fleet",
    "category": "Machine Learning",
    "desc": "High-throughput GPU inference cluster with vLLM TensorRT-LLM, Qdrant vector database, and S3 model weight caching.",
    "defaults": {
      "monthlyBudget": 18500,
      "availabilitySla": 99.95,
      "p99LatencyMs": 28,
      "computeCapacity": 220,
      "opsComplexity": 175,
      "securityCompliance": 85,
      "lockMode": "latency"
    },
    "submodules": [
      { "id": "m1", "name": "4x NVIDIA H100 / A100 Nodes", "category": "Compute", "costShare": 11000, "tier": "Bare-Metal GPU", "status": "active" },
      { "id": "m2", "name": "Qdrant Distributed Vector DB", "category": "Database", "costShare": 3200, "tier": "Vector Lake", "status": "active" },
      { "id": "m3", "name": "FastAPI Async Gateway", "category": "Compute", "costShare": 1800, "tier": "Async Cluster", "status": "active" },
      { "id": "m4", "name": "S3 High-IOPS Model Cache", "category": "Storage", "costShare": 2500, "tier": "Tier-0 NVMe", "status": "active" }
    ]
  },
  {
    "id": "realtime_game_relay",
    "name": "Real-Time Game Server Fleet",
    "category": "Gaming & XR",
    "desc": "Agones Kubernetes dedicated game server fleet with global UDP WebSockets, FleetIQ autoscaling, and tickrate optimization.",
    "defaults": {
      "monthlyBudget": 9200,
      "availabilitySla": 99.99,
      "p99LatencyMs": 8,
      "computeCapacity": 180,
      "opsComplexity": 160,
      "securityCompliance": 80,
      "lockMode": "latency"
    },
    "submodules": [
      { "id": "m1", "name": "Agones Global Game Pods", "category": "Compute", "costShare": 4500, "tier": "Tickrate 64Hz", "status": "active" },
      { "id": "m2", "name": "Global Accelerator UDP Edge", "category": "Networking", "costShare": 2200, "tier": "Anycast Edge", "status": "active" },
      { "id": "m3", "name": "Redis In-Memory State Cluster", "category": "Database", "costShare": 1500, "tier": "Sub-ms RAM", "status": "active" },
      { "id": "m4", "name": "Matchmaking Nexus Gateway", "category": "Compute", "costShare": 1000, "tier": "HNSW Vector", "status": "active" }
    ]
  },
  {
    "id": "global_ecommerce_flash",
    "name": "Global E-Commerce Flash Sale",
    "category": "Retail & Web",
    "desc": "DynamoDB Global Tables with distributed rate limiting, edge caching, and automated autoscaling for 500k RPM traffic spikes.",
    "defaults": {
      "monthlyBudget": 12000,
      "availabilitySla": 99.999,
      "p99LatencyMs": 18,
      "computeCapacity": 190,
      "opsComplexity": 140,
      "securityCompliance": 92,
      "lockMode": "sla"
    },
    "submodules": [
      { "id": "m1", "name": "DynamoDB Global Tables", "category": "Database", "costShare": 4200, "tier": "Global Active", "status": "active" },
      { "id": "m2", "name": "Cloudfront Edge Lambda", "category": "Networking", "costShare": 3800, "tier": "Edge Workers", "status": "active" },
      { "id": "m3", "name": "SQS Order Ingestion Queue", "category": "Messaging", "costShare": 1800, "tier": "FIFO Queue", "status": "active" },
      { "id": "m4", "name": "Stripe Enterprise Webhook", "category": "Integration", "costShare": 2200, "tier": "PCI Level 1", "status": "active" }
    ]
  },
  {
    "id": "iot_telemetry_lake",
    "name": "IoT Fleet Telemetry Data Lake",
    "category": "IoT & Big Data",
    "desc": "EMQX MQTT broker ingesting 100k msg/sec into Apache ClickHouse with Parquet cold storage on S3 Glacier.",
    "defaults": {
      "monthlyBudget": 3800,
      "availabilitySla": 99.9,
      "p99LatencyMs": 65,
      "computeCapacity": 85,
      "opsComplexity": 95,
      "securityCompliance": 75,
      "lockMode": "budget"
    },
    "submodules": [
      { "id": "m1", "name": "EMQX Distributed MQTT Cluster", "category": "Networking", "costShare": 1400, "tier": "MQTT 5.0", "status": "active" },
      { "id": "m2", "name": "Apache ClickHouse Analytics", "category": "Database", "costShare": 1500, "tier": "Columnar DB", "status": "active" },
      { "id": "m3", "name": "S3 Glacier Cold Storage", "category": "Storage", "costShare": 500, "tier": "Cold Archive", "status": "active" },
      { "id": "m4", "name": "Grafana Enterprise Dashboards", "category": "Monitoring", "costShare": 400, "tier": "Observability", "status": "active" }
    ]
  }
];
