# quantalithos-observability

> **仓使命**:OTel Collector + 不可变审计日志(append-only + 哈希链)+ 指标聚合 + DORA/EBM/42001 指标仪表板。三红线"可审计性"的技术载体。

---

## 仓定位

- **层**:L4 基础设施层
- **技术栈**:Rust + TimescaleDB(时间序列 + 指标)+ 对象存储(审计冷存)

---

## 主要对齐

- **OTel GenAI 语义约定**(核心)
- **W3C Trace Context**(trace 贯穿)
- **ISO 42001 §9.1**(监视测量)
- **ISO 9001 §7.5 记录型 Documented Information**
- **三红线可审计性 / 可追溯性**(技术载体)
- **DORA 四指标 + EBM 四维度**

---

## 核心职责

- **审计事件**:append-only + 哈希链防篡改
- **trace 聚合**:从跨域事件重建完整 trace tree
- **指标**:bus 自身 / 各 L1 服务的 Prometheus 指标
- **日志聚合**:结构化日志归集
- **查询 API**:按 Artifact/Turn/Activity/Gate 反向血缘查询
- **告警规则引擎**:4 类默认告警(见 bus-draft §八)

---

## 关键依赖

### 上游
- `quantalithos-core` / `quantalithos-bus`(全量 tap 订阅)
- 外部:TimescaleDB / 对象存储 / Prometheus / Grafana / OTel Collector

### 下游
- **所有 L1/L2/L3/L4 服务**(发 OTel 指标 / 日志 / trace)
- `quantalithos-console`(指标仪表板数据源)
- `quantalithos-governance`(审计链)

---

## 目录结构

```
quantalithos-observability/
├── Cargo.toml
├── src/
│   ├── audit_chain/         哈希链 + append-only
│   ├── trace_reconstruction/
│   ├── metrics/
│   ├── log_aggregator/
│   ├── lineage_api/         血缘反向查询
│   ├── dora_ebm/
│   ├── rpc/
│   └── infra/
├── migrations/              审计表 + 指标表
├── config/otel-collector/
├── dashboards/              Grafana 导入用
└── .github/workflows/
```

---

## 维护纪律

对齐 `子项目遵循规范清单.md` OB 条目:
- **OB1** 审计事件存储 append-only(数据库层强约束)
- **OB2** 哈希链保护,断链检测 + 报警
- **OB3** OTel Span 遵循 GenAI 语义约定
- **OB4** 支持从 Artifact/Turn/Activity/Gate 反向血缘查询
- **OB5** 支持 DORA + EBM 基线指标
- **OB6** 查询 API 有读权限控制

---

## 详细设计参考

- `product/六域模型.md` §九.1 观测横切
- `architecture/标准对齐全景图.md` observability 对齐
- `methodology/standards-discussion/ISO-42001.md` §9.1

---

## 开放问题

- 审计冷存策略(7 年合规 / 10 年监管 / 永久)
- 哈希链分片策略(单链 vs 按 tenant/按 domain 多链)
- OTel Collector 选型(upstream / vector / fluent)

---

## 性能

- 审计事件写入延迟 P95 < 50ms
- 哈希链验证 10w 条 < 5s
- 血缘查询 P95 < 500ms
- 指标聚合 Prometheus scrape 15s 间隔
