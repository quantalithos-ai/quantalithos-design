# quantalithos-artifact

> **仓使命**:制品域服务 —— Artifact(16 kind)+ ArtifactRelation(7 kind)+ Baseline + DatasetArtifact。一切可审计产出的承载者。

---

## 仓定位

- **层**:L1 六域服务层
- **技术栈**:Rust + PostgreSQL + 多后端内容存储(Git / S3 / inline / external URL)

---

## 主要对齐

- **ISO 15288 SoI / System Element**(Artifact 作为 SoI 组成部分)
- **ISO 9001 §7.5 Documented Information**
- **ISO 25010**(quality_tags 9 特性 + 31 子特性)
- **ISO 24748-2 Baseline**(冻结语义)
- **ISO 25012**(数据质量模型,DatasetArtifact)
- **ISO 42001 §A.7**(数据治理,DatasetArtifact)

---

## 关键依赖

### 上游
- `quantalithos-core` / `quantalithos-bus`
- 外部:PG + Git 服务器(code) + S3/MinIO(文档/数据) + 向量库(语义检索)

### 下游(订阅本仓事件)
- `quantalithos-work`(WorkItem 状态联动)
- `quantalithos-governance`(AIIA / SoA 双身份)
- `quantalithos-process`(Activity outputs)
- `quantalithos-archive`(归档)
- `quantalithos-observability`

---

## 目录结构

```
quantalithos-artifact/
├── Cargo.toml
├── src/
│   ├── domain/             Artifact / ArtifactRelation / Baseline / DatasetArtifact
│   ├── lineage/            GetLineage 血缘查询(递归 CTE)
│   ├── rpc/                ArtifactService 实现
│   ├── content/            多后端内容适配(Git / S3 / inline / URL)
│   ├── hash/               内容 hash 校验(防篡改)
│   ├── subscriptions/
│   └── infra/
├── migrations/             4 聚合 + 关系表 + Outbox
├── tests/
└── .github/workflows/
```

---

## 维护纪律

对齐 `子项目遵循规范清单.md` AR 条目:
- **AR1** 状态机只进不退(approved 后内容不可变)
- **AR2** 16 种 kind 硬枚举,新 kind 走 ADR
- **AR3** ArtifactRelation 7 种关系硬枚举
- **AR4** Baseline 成员 pin 到具体版本 + hash
- **AR5** quality_tags 使用 25010 的 9 特性 + 31 子特性
- **AR6** DatasetArtifact 的 data_provenance 必填
- **AR7** 禁止物理删除(只能 archived)

**27 条不变量(INV-1 到 INV-27)** 覆盖四类对象。

---

## 详细设计参考

- `domain/artifact/README.md`(1060 行)
- `architecture/proto-draft/artifact/v1/artifact_service.proto`
- `methodology/standards-discussion/ISO-25010.md`(质量标签)
- `methodology/standards-discussion/ISO-IEC-IEEE-24748-2.md`(Baseline)

---

## 开放问题

内容存储统一抽象 / GDPR 物理删除 / 血缘查询性能 / 质量标签自动化 / Dataset 版本化 / 跨项目复用。

---

## 性能目标

- Artifact 写入 P95 < 200ms(不含内容上传)
- GetLineage(深度 5) P95 < 500ms
- hash 校验(每次 approve) < 50ms
- 支撑 5000w Artifact × 1.5 亿 Relation

---

## 安全

- 内容 hash 定期核对(每日扫描)
- 不一致触发 `artifact.content_tampered` critical 事件
- baselined 内容跨区域异地备份
