# quantalithos-archive

> **仓使命**:项目归档 / 恢复 —— 跨六域打包 + 合规证据集成 + 长期冷存 + 可恢复的运行时重建。

---

## 仓定位

- **层**:L4 基础设施层
- **同层兄弟**:sandbox / observability
- **技术栈**:Rust + 对象存储(S3 / MinIO)+ PostgreSQL(索引)

---

## 主要对齐

- **ISO 9001 §7.5**(长期保留)
- **ISO 42001 §7.5 + SoA + AIIA**(归档包必含)
- **ISO 24748-2 Conformance Claim**(Tailored Conformance 声明格式)
- **ISO/IEC/IEEE 12207 Information Management + Configuration Management**
- **ISO 15288 SoI 血缘完整性**

---

## 核心职责

- **ArchiveBundle 组装**:项目 archived/dissolved 时跨六域打包
  - identity slice(GlobalMember + career)
  - work slice(Project + ProjectMember + WorkItem + Iteration)
  - conversation slice(Conversation + Turn 历史)
  - process slice(Instance + Activity + Checkpoint)
  - governance slice(Gate + Policy + Control + AIIA + SoA)
  - artifact slice(Artifact + Baseline + 血缘)
  - observability slice(审计链条摘要)
- **合规声明**:ComplianceDeclaration 生成(遵循 24748-2 格式)
- **签名 + 哈希**:ArchiveBundle 防篡改
- **冷存迁移**:hot / warm / cold 分层
- **恢复(Restore)**:把归档包还原为运行时(project.restored 链路)
- **保留策略执行**:按 governance.RetentionPolicy 到期自动处理

---

## 关键依赖

### 上游
- `quantalithos-core` / `quantalithos-bus`
- **所有 L1 六域服务**(读取数据组装)
- `quantalithos-observability`(审计链条)
- 外部:对象存储(S3 / MinIO / Glacier)+ PG

### 下游
- `quantalithos-work`(project.archived/dissolved/restored 源)
- `quantalithos-governance`(ComplianceDeclaration Gate)
- `quantalithos-console`(归档管理 UI)

---

## 目录结构

```
quantalithos-archive/
├── Cargo.toml
├── src/
│   ├── bundle/             ArchiveBundle 组装
│   ├── slices/             六域 slice 各自的 collector
│   ├── compliance/         Conformance Claim 生成(24748-2)
│   ├── storage/            hot / warm / cold tier
│   ├── restore/            Restore 逆向重建
│   ├── retention/          RetentionPolicy 执行
│   ├── rpc/
│   └── infra/
├── migrations/             bundle index + retention schedules
└── .github/workflows/
```

---

## 维护纪律

对齐 `子项目遵循规范清单.md` AV 条目:
- **AV1** ArchiveBundle 包含六域切片 + 42001 SoA + 24748-2 Conformance Claim
- **AV2** 归档包签名 + 哈希,防篡改
- **AV3** 支持 Restore 操作
- **AV4** 归档保留周期符合合规要求(可配置)
- **AV5** 归档不丢 Reasoning trace(42001 可解释性)

---

## 详细设计参考

- `domain/work/README.md` §6.3 场景 C(归档链路)
- `domain/governance/README.md` §2.5(AIIA)+ §2.6(SoA)
- `methodology/standards-discussion/ISO-IEC-IEEE-24748-2.md` §5.4 Conformance Claim

---

## 开放问题

- 物理删除 vs 永久保留(GDPR 场景,`domain/artifact` Q2)
- Restore 的时间窗口限制(`domain/work` Q5)
- Bundle 跨版本兼容(老归档包如何在新系统里恢复)
- 冷存选型(S3 Glacier / Tape / 自建)

---

## 性能

- 归档组装 1 个大项目(500 WorkItem / 10 Baseline)< 5 分钟
- Restore 小项目 < 2 分钟
- hot → warm → cold 迁移按月批处理
