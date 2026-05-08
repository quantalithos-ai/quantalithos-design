# quantalithos-method-library

> **仓使命**:**Method Content 存储与分发** —— SPEM 2.0 方法资产(TaskDefinition / RoleDefinition / WorkProductDefinition / ProcessTemplate)+ AIPolicy + 生命周期模型目录。

---

## 仓定位

- **层**:L3 方法能力层
- **同层兄弟**:capability-hub
- **技术栈**:Rust + PostgreSQL + 对象存储(Method Content 包)

---

## 主要对齐

- **SPEM 2.0 整套**(Method Content Package / TaskDefinition / RoleDefinition / WorkProductDefinition / MethodPlugin)
- **ISO 24748-2**(8 种生命周期模型目录)
- **ISO 29110 Deployment Package**(资产分发格式)
- **CMMI Practice Area**(模板清单)
- **ISO 42001 §5.2**(AI Policy 存储)

---

## 核心职责

- **Method Content 管理**:RoleDefinition / CapabilityDefinition / TaskDefinition 等
- **ProcessTemplate 源**:8 种 Template 家族 + 自定义;process 仓同步索引
- **AIPolicy 存储**:组织级 AI 政策的源数据(governance 引用)
- **Role → image_variant 映射**:member-service 查询用
- **版本管理**:Method Content semver;breaking 走 v2 + ADR
- **资产分发**:Marketplace 上架 / 下载的资产包组装

---

## 关键依赖

### 上游
- `quantalithos-core` / `quantalithos-bus` / `quantalithos-sdk`
- 外部:PG + 对象存储

### 下游
- `quantalithos-process`(Template 同步)
- `quantalithos-identity`(Role spec_source 查询)
- `quantalithos-member-service`(image_variant 查询)
- `quantalithos-governance`(AIPolicy 源 + Policy 发布链路)
- `quantalithos-marketplace`(资产上架 / 购买)

---

## 目录结构

```
quantalithos-method-library/
├── Cargo.toml
├── src/
│   ├── method_content/     Role / Task / WorkProduct / Capability 定义
│   ├── process_templates/  8 种家族 + 自定义
│   ├── ai_policies/        AIPolicy 存储
│   ├── deployment_package/ 29110 DP 组装与解压
│   ├── versioning/
│   ├── rpc/
│   └── infra/
├── migrations/
├── seeds/                  初始 9 个 Role + 8 个 Template
└── .github/workflows/
```

---

## 维护纪律

对齐 `子项目遵循规范清单.md` ML 条目:
- **ML1** Method Content 按 SPEM 2.0 结构组织
- **ML2** ProcessTemplate 版本化,publish 后不可修改
- **ML3** 八种 Template 家族对齐 24748-2
- **ML4** Role 定义包含 image_variant 字段
- **ML5** AIPolicy 存储 + 组织 / 项目级 override
- **ML6** 资产分发格式兼容 29110 DP

---

## 详细设计参考

- `methodology/standards-discussion/SPEM-2.0.md`(Method Content 概念基础)
- `methodology/standards-discussion/ISO-IEC-IEEE-24748-2.md`(8 种模型)
- `methodology/standards-discussion/ISO-IEC-29110.md`(DP 格式)
- `product/六域模型.md` §九.3 方法库横切

---

## 开放问题

- Method Content 的 DSL / schema 与 process 仓的 BPMN graph 如何对齐转换(双向)
- 自定义 Role 的上架流程是否与 Marketplace 融合
- AIPolicy DSL 与 governance Policy DSL 的关系(同源?)

---

## 种子数据(初始)

### 初始 9 个 Role
assistant / tech-lead / backend-dev / frontend-dev / qa / ux / devops / auditor / observer

### 初始 8 个 ProcessTemplate
waterfall / v-model / incremental / evolutionary / iterative / spiral / agile(scrum/kanban/safe) / devops
