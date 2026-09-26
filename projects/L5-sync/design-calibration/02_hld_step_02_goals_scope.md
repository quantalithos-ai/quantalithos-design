# Step 2. 明确本仓设计目标与当前范围

## 1. Step 状态与计划

- 模式：`full-restart + single-agent-serial`；前序 Step 1 已通过并保留上游 blocker。
- `gate_status=pass_with_upstream_blockers`；`formal_fill_allowed=step14_only`。
- 本步只收稳概要设计要回答的结构和深度，不提前正式化对象、接口或状态。

### Step 内计划

1. 回读 Step 1、正式 00 的目标/FR/AC 与正式 01 的五部分/演进上限。
2. 回答范围、深度、非范围和详细设计分工问题。
3. 形成设计目标、非范围、当前深度和能力优先级表。
4. 执行需求覆盖、架构一致性、blocker 与越层检查。
5. 形成正式 §2 回填草稿后更新 flow/台账。

## 2. 本步输入

| 输入 | 采用内容 |
|---|---|
| Step 1 §7 | 稳定输入、受阻输入、owner 映射和完成上限 |
| 正式 00 §4、§7、§9、§14~16 | `G-SYNC`、`CP-SYNC`、`FR-SYNC`、`AC/VETO-SYNC` 与追溯范围 |
| 正式 01 §6~14 | 五个业务组成部分、分层、关键通信、横切和 E1 概要目标 |
| 概要 SOP Step 2 / 书写规范 §2 | 目标、非范围和设计深度输出格式 |

## 3. SOP 问题回答

1. **最主要收稳哪些结构？** 收稳五个业务组成部分到代码主体的映射、本地关键对象与逻辑 metadata 主题、CLI/application/port/adapter 接口骨架、核心命令和维护路径的处理流、状态归属与恢复/冲突语义。
2. **停在什么深度？** 每个关键对象有类型化字段/状态/成员与工厂函数骨架；每个核心接口有类型化参数、结果、读写边界和 owner；核心写路径有可审计流程图；但不写完整签名、实现体、物理 schema、协议 payload、错误码全集或事务/锁细节。
3. **哪些属于范围？** `clone`、`pull`、`status`、`push-review`，显式选择/权限检查、binding/metadata、增量/全量 materialization、冲突/人工决定、resume/probe、posture invalidation、diagnostic/provenance，以及 SDK/Git/filesystem/local store/observability adapter 边界。
4. **哪些不进入范围？** 自动 Git 操作、平台 truth mutation、批量预取/多工作副本比较/归档浏览等外围能力、GUI/Tauri、LFS/浅克隆支持承诺、上游内部协议与任何实现/运行事实。
5. **哪些留给详细设计？** 真实模块目录与语言映射、完整 trait/function/DTO/error、metadata 物理 schema/迁移事务/锁、CLI flag/exit code、SDK 映射、Git 命令白名单、文件原子算法、配置键、测试用例矩阵和 evidence 采集实现。

## 4. 当前文档问题诊断

旧 02 以跨端 `SyncTask` 和 fanout/resync 为设计中心，既没有对应当前五个业务组成部分，也没有形成当前本地工作区主线所需的代码主体、对象、CLI、adapter、冲突/恢复和 handoff 结构。其固定 SLA 和接口名超出当前输入证据，无法作为本轮范围基线。

## 5. 改动前后对比

| 改动前 | 改动后 |
|---|---|
| 范围围绕跨端同步任务和状态一致性 | 范围围绕平台来源到本地 working copy 再到 Review handoff 的受控闭环 |
| 核心接口与 owner truth 混层 | 明确 CLI/application/local truth/owner ports/Git-fs adapters 各自层级 |
| 未定义概要与详细设计的边界 | 以类型化骨架和流程/状态为上限，物理实现与真实协议交 03 |
| 历史技术选择被默认为当前范围 | LFS、浅克隆、GUI/Tauri 全部保持 pending/非范围 |

## 6. 设计取舍

- 本轮优先闭合 P0 安全闭环而非外围便利能力；只有显式选择、保护本地修改、可恢复与不绕 Gate 成立后，才允许后续扩展。
- 为满足后续可落码性，从 Step 5 起点名 CLI、模块、对象、逻辑 metadata、ports/adapters、状态与测试切口；同时用 `planned contract` 语义避免把名称伪装成已存在代码。
- 允许在上游 blocker 下定义负向路径和保守类型，但不把正向 owner 合同写死；受阻接口必须显式给出 `blocked/unsupported/needs-action` 结果。
- 外围能力 `FR-SYNC-013~015` 只保留演进接缝与禁止弱化门禁，不形成当前 P0 可实现承诺。

## 7. 结构化中间产物

### 7.1 设计目标

| ID | 目标 | 本轮收稳结果 | 交给详细设计的结果 |
|---|---|---|---|
| `HLD-SYNC-G01` | 固定业务结构与代码主体 | 五部分与正交实现分层、主体/模块映射、依赖方向 | 目录、crate/package、constructor 与 wiring |
| `HLD-SYNC-G02` | 闭合显式选择与本地 binding | selection/access、working-copy、owner ref 和 metadata 逻辑模型 | SDK DTO 映射、路径规范化、持久化事务 |
| `HLD-SYNC-G03` | 闭合只读 status 与安全 materialization | query no-write、source plan、dirty/path/gap gate、cursor finalize | Git/fs 命令、原子 apply、锁和错误映射 |
| `HLD-SYNC-G04` | 闭合冲突与恢复 | conflict/checkpoint/manual decision、resume/probe、unknown outcome 状态 | 比较算法、恢复步骤、幂等存储和故障注入 |
| `HLD-SYNC-G05` | 闭合 Review handoff 语义 | frozen candidate、attempt/transport/probe/decision ref 分层 | Governance SDK 精确协议和重试/探测映射 |
| `HLD-SYNC-G06` | 建立可落码 CLI/API 骨架 | `clone/pull/status/push-review` 及维护/query 接口、typed input/result | flag、exit code、serialization、CLI UX 文案 |
| `HLD-SYNC-G07` | 建立 metadata 与 provenance 骨架 | `.qs-sync` 逻辑文档/记录主题、generation/integrity/migration 边界 | 物理文件布局、schema version、migration/retention 实现 |
| `HLD-SYNC-G08` | 固定 adapter 安全面 | SDK、Git、filesystem、metadata、clock/id、diagnostics ports | 真实 client/library 选择、命令白名单与 adapter 测试 |
| `HLD-SYNC-G09` | 形成设计交接和验证边界 | 详细设计承接、配置影响、测试切口、fake/evidence 上限 | 完整测试矩阵、fixture、运行与证据计划 |

### 7.2 当前范围

| 范围主题 | 当前必须覆盖 | 受阻时的概要姿态 |
|---|---|---|
| CLI 主路径 | `clone`、`pull`、`status`、`push-review` | 明确命令存在的语义骨架，不承诺真实 binary/flags |
| 选择与访问 | project/version/source/target/operation 显式语境、owner checks | unknown/stale/denied/archived → blocked |
| working copy / metadata | 初始化、绑定、读取、完整性、显式迁移/重绑边界 | schema/migration 不明 → needs-action |
| source materialization | 全量初始化、增量 plan、路径映射、apply、cursor finalize | comparator/gap/source authority 不明 → blocked |
| conflict/recovery | dirty/untracked、source/mapping/metadata/path 冲突、checkpoint、resume/probe | 无安全决定或等价证明 → manual/probe-required |
| review handoff | candidate inspection/freeze、attempt、call、probe、decision read | handoff 合同不明 → prepared/blocked，不报告 accepted |
| posture/provenance/diagnostic | snapshot freshness、归档/撤销失效、不可伪造来源链、脱敏输出 | owner/diagnostic unavailable 不改变业务 truth |
| adapters/tests | SDK/Git/fs/store/diagnostic ports、contract/negative/failure test cuts | fake 只证明本地行为，不证明真实集成 |

### 7.3 非范围

| 非范围 | 留给哪一层 / 原因 |
|---|---|
| Project、ProjectMember、Artifact、Baseline、Review Gate/Decision、Workspace projection、Archive、Git remote truth 的创建或内部模型 | 各正式 owner；永不转入 Sync |
| 自动 merge、rebase、push、stash、覆盖或自动冲突决策 | 明确禁止，不属于未来详细设计选项 |
| 上游真实 method/endpoint/DTO/error/event payload | owner 合同闭合后由 03 映射；02 不脑补 |
| 完整代码目录、语言语法、函数实现、DDL、事务/锁算法 | `03-详细设计.md` |
| 配置 key、默认值、优先级、环境变量、JSON/YAML 示例 | `04-配置设计.md`；02 只给影响类别 |
| 测试用例全集、真实运行、报告、artifact、evidence、coverage/readiness | `05/06/07` 与实际实施；本轮仅定义切口和证据上限 |
| 批量预取、多工作副本比较、归档浏览 | 后续演进；只保留不会削弱逐来源门禁的接缝 |
| Git LFS、浅克隆、GUI/Tauri 支持 | `SYNC-UP-009` pending；需正式需求、compatibility/workload 证据 |
| 固定性能/SLA 数字 | 等待权威 workload 与测试设计，不继承旧 02 |

### 7.4 当前阶段设计深度口径

```text
架构模块 / 五个业务组成部分
  -> 命名代码主体与实现分层
  -> 关键对象的类型化字段、状态、行为与工厂骨架
  -> Command / Query / Consumer / Event / Job / Port / Adapter 骨架
  -> P0 写路径与有一致性影响路径的流程图
  -> 本地状态归属、允许/禁止迁移与传播
  -> 异常、配置影响、测试切口、证据边界与 03 承接

停止于：完整实现签名、物理 schema、协议 payload、配置键、测试运行事实之前。
```

### 7.5 核心与外围优先级

| 优先级 | 能力 | 本轮要求 |
|---|---|---|
| P0 | explicit select/access、clone/bind、status、pull、conflict/recovery、push-review | 对象/API/流/状态/异常全部可追溯 |
| P1 | metadata inspect/migrate/rebind、unknown probe、posture invalidation、安全诊断 | 明确维护接口与负向边界；正向受 owner 合同约束 |
| P2 | 批量预取、跨副本比较、归档浏览、GUI/LFS/shallow | 不正式化为当前支持能力，只列演进/待确认 |

## 8. 回填草稿

正式 §2 将摘录设计目标表、当前范围、非范围和深度口径。正文明确：所有代码主体和接口名称是概要设计合同，不代表磁盘已有实现；上游受阻路径仍必须返回保守姿态。

延伸阅读入口指向本文件的“设计目标”“当前范围”“非范围”“当前阶段设计深度口径”。

## 9. 待确认事项

- `SYNC-UP-001~010` 不改变本轮结构目标，但限制受影响正向路径可交给 03/实现的程度。
- P2 能力仅在正式需求、owner 合同和支持证据到位后回流 Step 2 重审；不得直接在 03 或实现层扩张。

## 10. 进入下一步条件

- [x] 目标逐项指向可审查概要产物与详细设计输入。
- [x] 范围覆盖正式 00 的 P0 能力和正式 01 的五部分。
- [x] 非范围明确归属，没有以“以后再看”掩盖 owner 或安全边界。
- [x] 设计深度满足可落码骨架要求但未进入实现级细节。
- [x] 上游 blocker 和 P2 历史选择未被升格为承诺。

结论：`gate_status=pass_with_upstream_blockers`；允许进入 Step 3。此结论仅为文档静态自检。
