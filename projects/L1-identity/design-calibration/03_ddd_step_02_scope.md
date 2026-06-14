# Step 2. 明确本轮实现范围和非范围

> 对应 SOP: `standards/document/详细设计讨论流程_SOP.md` Step 2
> 回填章节: `03-详细设计.md` §2 本次详细设计目标与范围
> 生成日期: 2026-06-11
> 状态: Step 2 已完成,已审核通过

---

## 1. Step 状态 + Step 内计划

本 Step 只回答新版 `03-详细设计.md` 的实现契约范围和非范围,不展开编码规范、文件布局、对象字段、trait 签名、协议 schema、处理流、状态矩阵或事务细节。

| 计划项 | 状态 | 产物位置 |
|---|---|---|
| 读取 Step 1 上游边界和新版 `02` 目标 / 范围 / 承接清单 | 已完成 | §2 |
| 回答 Step 2 SOP 问题 | 已完成 | §3 |
| 诊断旧 `03` 和当前材料的范围问题 | 已完成 | §4 |
| 形成改动前后对比 | 已完成 | §5 |
| 明确采用 / 不采用的范围划分方案 | 已完成 | §6 |
| 输出详细设计目标表 | 已完成 | §7.1 |
| 输出实现范围表 | 已完成 | §7.2 |
| 输出非范围表 | 已完成 | §7.3 |
| 输出阶段 / boundary 风险表 | 已完成 | §7.4 |
| 形成正式 `03` §2 回填草稿 | 已完成 | §9 |
| 更新 `03_ddd_calibration_flow.md` 状态 | 已完成 | `03_ddd_calibration_flow.md` |

---

## 2. 本步输入

| 输入 | 当前状态 | 本步用途 |
|---|---|---|
| `03_ddd_step_01_upstream_boundary.md` | 已审核通过 | 确认新版 `03` 只承接新版 `00/01/02` 和已审核概要中间产物 |
| `02-概要设计.md` §2 | 已收稳 | 提供概要设计目标、范围、非范围和设计深度口径 |
| `02-概要设计.md` §5~§9 | 已收稳 | 提供 8 个主要组成部分、对象索引、接口骨架、处理流和状态主语 |
| `02-概要设计.md` §10~§13 | 已收稳 | 提供异常边界、配置影响、详细设计承接清单和风险 |
| `详细设计讨论流程_SOP.md` Step 2 | 最新流程标准 | 规定本步必须输出目标表和非范围表 |
| `详细设计书写规范.md` §2 / §3 | 最新书写标准 | 规定正式 `03` 的目标 / 范围章节边界 |
| `设计文档讨论中间产物规范.md` | 最新中间产物标准 | 规定 Step 内计划、问题回答、诊断、取舍和回填草稿结构 |

---

## 3. SOP 问题回答

### 3.1 本轮详细设计必须覆盖哪些模块?

本轮 `03` 必须覆盖新版 `02` 已收稳的 8 个主要组成部分在代码层的实现契约:

- 身份锚定与成员真相。
- 全局生命周期。
- 角色能力摘要。
- 身份生涯记录。
- 记忆引用关系。
- 身份事实消费与追溯。
- 派生维护与对账。
- 身份事实传播与外部交接。

同时必须覆盖 `02` 已收稳的实现分层:

- Inbound / Operations。
- Application Services。
- Domain Model。
- Ports / Persistence / Projection / Outbox。

这些名称在 Step 2 只作为范围主语。具体 crate、module、file、trait、adapter、service 和 runner 安放留给 Step 3~5。

### 3.2 本轮必须定义哪些对象、接口、事件、job 和状态机?

本轮 `03` 必须把 `02` 已收稳的对象、接口、事件、job 和状态主语展开为可实现契约。

必须覆盖的对象范围:

- `GlobalMember`, `IdentityAnchorState`, `IdentityAnchorPolicy`。
- `GlobalLifecycleState`, `LifecycleTransitionPolicy`, `HighRiskLifecycleGuard`。
- `RoleCapabilitySummary`, `RoleCapabilitySourceSnapshot`, `RoleCapabilitySourcePolicy`。
- `CareerRecord`, `CareerAppendPolicy`。
- `MemoryReference`, `MemoryReferenceState`, `MemoryReferencePolicy`。
- `MemberSummaryView`, `IdentityTraceRecord`, `AuditTrail`, `VisibilityPolicy`。
- `ProjectionState`, `ReferenceResolutionState`, `ReconciliationPolicy`, `ReconciliationReport`。
- `IdentityOutboxRecord`, `TraceHandoffIntent`, `OutboxState`, `HandoffState`, `OutboundEventPolicy`, `HandoffPolicy`。

必须覆盖的接口范围:

- 6 个 Command。
- 14 个 Query。
- 5 个 Inbound Event Consumer。
- 10 类 canonical outbound event material。
- 6 个 Operations Job。

必须覆盖的状态范围:

- core truth state、summary / source marker、append-only surface、reference marker、query surface、projection marker、reference resolution marker、report marker、outbox marker、handoff marker。

### 3.3 哪些能力属于 P1 / 后续阶段,不应在本轮展开?

以下能力不进入本轮详细设计的 P0 实现契约:

- 完整认证、授权裁决 truth、session、credential 和 secret 管理。
- `ProjectMember`、Project、WorkItem、RoleDefinition、CapabilityDefinition、memory body、archive package、runtime identity 等相邻仓 truth / body。
- UI、运营控制台、人工审批台和可视化报表页面。
- release 级性能阈值、可用性数字、容量估算和压测目标。
- P1 real-like 环境、跨仓端到端压测、生产迁移计划。
- 自动 remediation、自动修复相邻仓 truth、自动重写历史记录。

这些能力可以在 `03` 中作为边界或风险被引用,但不得展开为 identity-owned P0 对象、接口或 schema。

### 3.4 哪些内容属于测试方案、实施计划、配置设计或运维手册?

以下内容不由本 Step 或正式 `03` 主体替代:

- 配置 profile、env key、JSON 文件全集、加载优先级、secret resolution 和 profile matrix 归 `04-配置设计.md`。
- 测试矩阵、suite 编排、覆盖率策略、性能 evidence、验收样本和 release gate 归 `05-测试方案.md` / `06-验收标准.md`。
- phase、commit boundary、提交顺序、实现任务拆分、门禁命令和交付批次归 `07-实施计划.md`。
- 部署拓扑、告警阈值、故障处置、值班流程和运行手册归运维文档。

`03` 只给这些下游文档提供实现契约输入,不写下游文档本身。

### 3.5 实现者拿到本文后,应能完成哪些代码范围?

实现者拿到已完成的新版 `03` 后,应能在目标实现仓完成:

- 按文件布局创建 crate / module / package / binary / test module。
- 按对象契约定义 struct、enum、value object、policy、service helper 和 domain errors。
- 按 trait / port / adapter 契约定义 repository、UoW、resolver、publisher、handoff、report writer、clock / id / metadata provider 和 fake 等价语义。
- 按协议契约定义 Command / Query / Event / Job / Handoff DTO、result、envelope、receipt、report 和 marker。
- 按函数级 flow 实现 accepted、rejected、duplicate、conflict、degraded、failed、partial 和 no-write 分支。
- 按状态矩阵实现状态迁移、forbidden transition、guard、side effect 和 public marker。
- 按持久化 / 并发 / 幂等契约实现 repository、transaction、cursor、version、idempotency、stored result、duplicate replay、trace / audit / outbox / projection stale 顺序。
- 按测试切口补 domain、protocol、service-flow、fake runtime、query no-write、forbidden body、idempotency、projection、outbox / handoff 和 report-only 的最小验证。

---

## 4. 当前材料 / 旧文档问题诊断

| 材料 / 倾向 | 问题 | 本轮处理 |
|---|---|---|
| 旧 `03` 直接混写对象、API、schema 和实现口径 | 缺少“本轮覆盖什么 / 不覆盖什么”的边界层,容易把旧对象或旧 schema 直接带入 | 旧 `03` 不继承;Step 2 先冻结范围 |
| `02` 已列出很多对象和接口 | 如果 Step 2 不分范围,后续 Step 6~10 容易把概要对象索引误当完整实现清单 | Step 2 明确这些只是必须展开的范围主语,不是字段 / 函数结论 |
| 现有 `04/05/06/07` 早于新版 `03` | 容易反向把旧配置 profile、旧测试阈值或旧 commit boundary 写进详细设计 | Step 2 明确它们不是新版 `03` 上游 |
| 概要第 13 章列出多个未闭口项 | 若 Step 2 把它们写成已定契约,后续实现会继续遇到 blocker | Step 2 只把它们列为必须闭口的详细设计范围和风险 |
| 用户要求逐 Step 审核 | 如果 Step 2 继续展开 Step 3~5 内容,会破坏审核粒度 | 本 Step 不创建未来 Step 文件,完成后停审 |

---

## 5. 改动前后对比

| 项 | 改动前 | 改动后 |
|---|---|---|
| `03` 范围 | 旧稿范围混杂,可能继承旧对象 / API / schema | 新版 `03` 明确覆盖 `02` 的 P0 identity 实现契约全链路 |
| P0 / 后续阶段 | 旧稿没有把 P1、测试、配置、实施、运维边界分清 | Step 2 明确非范围归属 |
| 对象和接口 | 旧稿可能把概要对象名直接当实现契约 | Step 2 只确认必须展开哪些对象和接口,字段 / 函数后移 |
| 下游文档关系 | 旧下游文档可能反向约束详细设计 | 新版 `03` 不承接旧 `04/05/06/07`,只向后输出实现契约 |
| 审核节奏 | 旧稿一次性正文式推进 | 当前每个 Step 独立产物,Step 2 完成后停审 |

---

## 6. 设计取舍

| 方案 | 结论 | 理由 |
|---|---|---|
| 只覆盖 command 写路径,query / job / propagation 留到后续 | 不采用 | `02` 已把 query no-write、job report-only、outbox / handoff 后置列为核心边界;不进入 `03` 会导致实现契约断链 |
| 把配置、测试、验收和实施也写成 `03` 完整章节 | 不采用 | 详细设计只输出实现契约输入;下游文档有独立 SOP 和书写规范 |
| 以 `02` 的 8 个主要组成部分和接口骨架作为本轮 P0 范围 | 采用 | 范围与已审核概要一致,不会在 `03` 中新增业务主语 |
| 在 Step 2 细化所有对象字段和 DTO | 不采用 | 字段、函数、schema 和状态迁移属于 Step 6~10,提前展开会破坏 Step 粒度 |
| 把 `04/05/06/07` 作为范围输入 | 不采用 | 它们早于新版 `02/03`,只能后续按新版 `03` 复核 |

---

## 7. 结构化中间产物

### 7.1 详细设计目标表

| 目标 | 说明 | 交付给实现者的结果 |
|---|---|---|
| 收稳 P0 identity 实现契约 | 把 `02` 的 identity truth center 轮廓转成代码可落地的对象、接口、状态、事务和错误契约 | 实现者不需要自行猜字段、函数、状态、port 或 phase boundary |
| 收稳模块与依赖边界 | 把 8 个主要组成部分和实现分层转成 crate / module / file / dependency 关系 | 实现者可按模块创建代码,避免跨层反向依赖 |
| 收稳对象实现契约 | 为 truth、state、policy、reference、projection、trace、audit、report、outbox、handoff 定义字段、函数和不变量 | 实现者可 1:1 定义 domain / contract 类型 |
| 收稳 port / adapter 契约 | 定义 repository、resolver、publisher、handoff、report writer、clock / id / metadata provider 和 fake 等价语义 | 实现者可实现 application service 和 infra fake / durable adapter |
| 收稳 public protocol | 定义 Command / Query / Consumer / Event / Job / Handoff 的 request、response、envelope、receipt、report 和 marker | 实现者可实现 handler、DTO、serialization 和 duplicate replay surface |
| 收稳函数级 flow | 为每个 Command、Query、Consumer、Job、publish / handoff flow 定义调用链、事务边界、错误和 side effect | 实现者可按 flow 写 service 和测试 |
| 收稳状态与一致性 | 定义状态矩阵、persistence、cursor、version、idempotency、stored result、trace / audit / outbox / projection stale 顺序 | 实现者可避免 accepted path 和 duplicate replay 的设计缺口 |
| 收稳下游交付输入 | 给 `04/05/06/07` 输出明确的配置、测试、验收和实施承接材料 | 下游文档可按新版 `03` 复核,不反向约束本轮 |

### 7.2 本轮实现范围表

| 范围项 | 覆盖内容 | 后续主要 Step |
|---|---|---|
| 实现约束与仓库约束 | 语言 / runtime、编码、Rustdoc、目录规范、sibling repo path dependency、禁止依赖 | Step 3 |
| 实现单元与文件布局 | crate / module / binary / test module、domain / application / contracts / infra / operations 安放 | Step 4 |
| 模块实现契约主轴 | 8 个主要组成部分如何映射到模块 ownership 和依赖方向 | Step 5 |
| 对象实现契约 | `02` §6 的 28 个对象 / state / policy / marker / record 的字段、函数、状态和不变量 | Step 6 |
| Trait / Port / Adapter 契约 | repository、UoW、resolver、publisher、handoff、projection、report、metadata、clock、id generator、fake 等价语义 | Step 7 |
| API / Command / Query / Event / Job 协议 | 6 Command、14 Query、5 Consumer、10 outbound material、6 Job、handoff receipt / report marker | Step 8 |
| 逐接口函数级处理流 | accepted / rejected / duplicate / conflict / no-write / degraded / failed / partial / retry flow | Step 9 |
| 状态机与转换矩阵 | anchor、lifecycle、role summary/source、career、memory、query surface、projection、reference、report、outbox、handoff | Step 10 |
| 持久化、事务和一致性 | schema ownership、repository save/load、unique key、cursor、version、append-only、transaction order | Step 11 |
| 错误和恢复 | public rejection、pending basis、not visible、redacted、stale、degraded、retryable failed、failed、partial | Step 12 |
| 并发、幂等与重入 | idempotency key、request digest、stored result、duplicate replay、consumer dedupe、job cursor | Step 13 |
| 配置引用和外部绑定 | runtime config shell、validated config 注入点、adapter binding、禁配红线、config evidence 输入 | Step 14 |
| 可观测性与审计 | runtime log / metric、business trace / audit / handoff 分层、safe diagnostic、forbidden body guard | Step 15 |
| 测试切口 | domain、protocol、service-flow、fake runtime、query no-write、forbidden body、idempotency、projection、outbox / handoff | Step 16 |
| 实施承接 | 给 `07` 的 phase / commit boundary 审计输入、前置阅读矩阵和阻塞条件 | Step 17 |
| 风险与待确认 | 未闭口项、回退规则、阻塞范围和未确认前处理方式 | Step 18 |
| 正式文档装配 | 从 Step 1~18 已审核产物装配正式 `03` | Step 19 |

### 7.3 非范围表

| 非范围 | 留给哪一层 / 哪份文档 | 本轮不进入的原因 |
|---|---|---|
| 需求目标、用户故事、功能需求、验收标准重写 | `00-需求文档.md` | Step 1 已确认这些不是 `03` 任务 |
| 系统上下文、限界上下文、架构方案取舍 | `01-架构设计.md` | `03` 只承接架构边界,不重裁定架构 |
| 新增 / 删除 / 合并 `02` 的主要组成部分 | 回退 `02` Step 5 | 组成部分是概要层业务主语 |
| 新增 P0 Command / Query / Consumer / Job 类别 | 回退 `02` Step 7 | 接口分类会改变处理流、状态和测试 |
| 配置文件全集、profile matrix、env key、secret loading | `04-配置设计.md` | `03` 只定义 config shell 和 binding point |
| 完整测试矩阵、suite 编排、验收 evidence、性能阈值 | `05-测试方案.md` / `06-验收标准.md` | `03` 只定义测试切口和最小验证入口 |
| phase / commit boundary、开发排期、提交计划 | `07-实施计划.md` | `03` 只输出实施承接清单 |
| 部署拓扑、告警阈值、故障处置流程 | 运维文档 | 不属于实现契约 |
| 认证、账号、session、credential、secret truth | 相邻能力或安全基础设施 | `L1-identity` 不拥有这些 truth |
| Project / WorkItem / ProjectMember truth | `L1-work` | identity 只保存 source marker / safe summary |
| RoleDefinition / CapabilityDefinition body | `L3-method-library` | identity 只保存 body-free summary / evidence ref |
| memory body、embedding、archive package、receipt body、runtime body、raw log | 相邻仓或外部系统 | forbidden body 边界,不得进入 identity truth / event / trace / report |
| 自动 remediation / 自动修复相邻仓 truth | 后续 P1 或外部系统 | 本轮只做 report-only finding 和 marker |

### 7.4 阶段 / boundary 风险表

| 风险 | 影响范围 | 当前处理 |
|---|---|---|
| sibling repo 真实类型不存在或命名不一致 | Step 3 / 7 / 8 的 typed refs、metadata、event envelope | Step 3 读取实际仓库;不可自行定义上游声称存在的类型 |
| 外部 source summary 字段来源未闭口 | role capability、career、memory、governance basis | Step 7 / 8 / 9 / 12 必须补 resolver / DTO / error surface |
| cursor、version、id generator 责任未闭口 | accepted transaction、projection refresh、outbox、duplicate replay | Step 6 / 7 / 11 / 13 必须定义生成责任和 fake 等价 |
| subject / audit / trace / handoff target 映射未闭口 | trace、audit、outbox、handoff、query visibility | Step 6 / 7 / 9 / 15 必须定义 canonical mapper 或读取面 |
| projection lookup 和 affected views 未闭口 | query no-write、projection stale、rebuild job | Step 7 / 9 / 11 必须定义正式 lookup port 或生成规则 |
| rejected / degraded / stored result surface 未闭口 | command reject、query degraded、duplicate replay | Step 8 / 12 / 13 必须定义 public surface 和 persistence 口径 |
| fake / controlled adapter 伪成功 | outbox publish、handoff delivered、source resolver | Step 14 / 16 必须定义 adapter mode 语义和测试证据 |
| 旧 `04/05/06/07` 与新版 `03` 冲突 | 下游配置、测试、验收、实施计划 | 新版 `03` 完成后复核下游,不得反向约束当前设计 |

---

## 8. 复杂度判断 / 是否拆分

本 Step 只定义范围边界,不需要拆子文件或附录。

后续 Step 需要拆分和小循环:

- Step 6 必须按 8 个主要组成部分逐模块推导 capability -> object -> field / function / state / invariant。
- Step 7 必须按模块逐组定义 port / adapter,每组完成后停审或记录自动审核状态。
- Step 8 必须按 Command、Query、Consumer、Outbound Event、Operations Job、Handoff 协议族分组。
- Step 9 必须按每条接口 flow 独立展开。
- Step 10 必须按状态主语逐个展开矩阵。

当前不创建 Step 3~19 的未来文件。

---

## 9. 回填草稿

正式 `03-详细设计.md` §2 后续应回填:

### 2.1 本次详细设计目标

本次详细设计覆盖 `L1-identity` P0 identity truth center 的实现契约,目标是把新版 `02-概要设计.md` 已收稳的 8 个主要组成部分、对象索引、接口骨架、处理流和状态主语,展开为可 1:1 落码的模块、文件、对象、trait、DTO、flow、状态、事务、错误、幂等、配置绑定、观测和测试切口。

### 2.2 本次详细设计范围

本次范围包括实现约束、文件布局、模块实现契约、对象契约、Trait / Port / Adapter 契约、API / Command / Query / Event / Job 协议、逐接口 flow、状态矩阵、持久化事务、错误恢复、并发幂等、配置引用、观测审计、测试切口、实施承接和风险闭口。

### 2.3 非范围

本次不重写需求、架构、概要结论,不编写配置 profile 全集、测试矩阵、验收阈值、实施 commit boundary 或运维手册,不接管认证 / 授权 / ProjectMember / RoleDefinition / memory body / archive package / runtime body 等相邻仓 truth 或 forbidden body。

正式正文要等 Step 19 统一装配,当前不直接回填。

---

## 10. 待确认事项

| 待确认 | 影响 | 当前处理 |
|---|---|---|
| 是否认可本轮 `03` 覆盖 `02` 已收稳的全部 P0 identity 实现契约 | 若不认可,需明确删减哪些组成部分、接口或状态主语,并可能回退 `02` | 当前按全量 P0 范围承接 |
| 是否认可配置、测试、验收、实施和运维只接收 `03` 输出,不反向约束当前 Step | 若不认可,旧下游口径会影响新版详细设计 | 当前不承接旧 `04/05/06/07` |
| 是否认可 P1 / 后续能力不在本轮展开 | 若不认可,需要回退需求 / 概要重新定义范围 | 当前只保留为边界或风险 |

---

## 11. 进入 Step 3 的条件

进入 Step 3 前必须满足:

- 用户审核通过本 Step 的详细设计目标表。
- 用户确认 8 个主要组成部分、6 Command、14 Query、5 Consumer、10 outbound material、6 Job 均属于本轮 `03` P0 实现契约范围。
- 用户确认非范围归属清楚,不会在 Step 3~19 中被写成 identity-owned 契约。
- 用户确认旧 `04/05/06/07` 不作为新版 `03` 的上游约束。
