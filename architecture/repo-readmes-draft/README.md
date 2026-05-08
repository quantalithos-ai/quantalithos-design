# repo-readmes-draft — 26 仓种子 README

> **文档定位**:段 3 第四件。26 个独立仓库的**种子 README**,段 3 末拆仓时每份作为对应新仓的首次 commit。
>
> **与其他草案的分工**:
> - `proto-draft/` — core 仓的 proto 内容
> - `bus-draft/` — bus 仓的接口与语义
> - `sdk-draft/` — sdk 仓的客户端设计
> - **本目录** — **全部 26 仓**的顶层说明(含上述三仓及其他 23 仓)
>
> **每份 README 的骨架**:
> 1. 仓使命(一句话)
> 2. 所属层 + 同层兄弟仓
> 3. 主要对齐标准 / ADR
> 4. 关键依赖(上游 / 下游)
> 5. 目录结构草案
> 6. 构建 / 测试 / 发布链路
> 7. 维护纪律(子项目遵循规范清单条目)
> 8. 指向 design 仓的详细设计
> 9. 开放问题 / 待决策
>
> 每份约 120 行,26 份合计 ~3000 行。

---

## 目录总览

### L0 共享契约层(3 仓)

- [L0-core](L0-core/README.md) — Proto + CloudEvents schema
- [L0-bus](L0-bus/README.md) — Event Bus 抽象 + 多后端适配
- [L0-sdk](L0-sdk/README.md) — 三语言 client

### L1 六域服务层(6 仓)

- [L1-identity](L1-identity/README.md) — GlobalMember / Role / Capability
- [L1-conversation](L1-conversation/README.md) — Conversation / Turn
- [L1-work](L1-work/README.md) — Project / ProjectMember / WorkItem / Iteration
- [L1-process](L1-process/README.md) — Template / Profile / Instance / Activity
- [L1-governance](L1-governance/README.md) — Gate / Policy / Control / AIIA / SoA / Nonconformity
- [L1-artifact](L1-artifact/README.md) — Artifact / Baseline / DatasetArtifact

### L2 Member 运行层(5 仓)

- [L2-member](L2-member/README.md) — Member Process(Rust 门面)
- [L2-runtime](L2-runtime/README.md) — Runtime Process(Python 大脑)
- [L2-tools](L2-tools/README.md) — Tools monorepo
- [L2-member-images](L2-member-images/README.md) — Docker 镜像 CI
- [L2-member-service](L2-member-service/README.md) — 容器编排

### L3 方法能力层(2 仓)

- [L3-capability-hub](L3-capability-hub/README.md) — MCP + A2A + Provider
- [L3-method-library](L3-method-library/README.md) — SPEM Method Content

### L4 基础设施层(3 仓)

- [L4-sandbox](L4-sandbox/README.md) — 代码执行隔离
- [L4-observability](L4-observability/README.md) — OTel + 审计链
- [L4-archive](L4-archive/README.md) — 项目归档 / 恢复

### L5 UI 层(5 仓)

- [L5-chat](L5-chat/README.md) — Chat 客户端
- [L5-runner](L5-runner/README.md) — Runner App
- [L5-console](L5-console/README.md) — Console 管理后台
- [L5-sync](L5-sync/README.md) — Sync CLI
- [L5-website](L5-website/README.md) — Website

### L6 生态层(2 仓)

- [L6-bridges](L6-bridges/README.md) — 外部平台桥接
- [L6-marketplace](L6-marketplace/README.md) — 资产市场

---

## 使用方式

段 3 末拆仓时:

1. 创建 26 个独立 git 仓库(`quantalithos-<name>`)
2. 每个新仓第一次 commit 就是本目录对应 `README.md` 的内容(略作路径调整)
3. design 仓的 `domain/*/README.md` + `architecture/*-draft/` 作为独立仓的详细设计参考

本目录与独立仓的 README 之间保持一致性:
- 本目录为源(设计期)
- 独立仓 README 为影(实施期)
- breaking 修改同步(通过 PR + ADR)
