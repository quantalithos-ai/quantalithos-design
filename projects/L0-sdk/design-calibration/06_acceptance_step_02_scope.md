# L0-sdk 06 验收标准 Step 2: 验收目标与范围

> 本文件是 `projects/L0-sdk/06-验收标准.md` 的 Step 2 中间产物。
> 本步定义本轮验收裁决什么、不裁决什么,并明确 P0 / P1 / P2 的验收范围。
> 本步不修改正式 `06-验收标准.md`。

---

## 1. Step 状态

| 项 | 内容 |
|---|---|
| Step | Step 2 |
| 主题 | 明确验收目标与范围 |
| 状态 | 已确认 |
| 正式回填位置 | `06-验收标准.md` §2 |
| 是否修改正式 `06-验收标准.md` | 否 |

---

## 2. 本步输入

| 输入 | 当前状态 | 本步使用方式 |
|---|---|---|
| `06_acceptance_step_01_input_boundary.md` | 已确认 | 继承新版 `00~05` 为事实源、旧 `06` 不作为事实源的边界 |
| `00-需求文档.md` §4 / §7 / §9 / §10 / §14 | 已完成 | 提取目标、非目标、核心能力闭环、F-001~F-010、BR-001~BR-014 和一票否决方向 |
| `01-架构设计.md` §4 / §8 / §9 / §10 / §13 / §14 | 已完成 | 提取 official client access layer、依赖方向、数据所有权、关键交互、横切关注和演进边界 |
| `03-详细设计.md` §2 / §7 / §8 / §9 / §15 | 已完成 | 提取 P0 展开范围、协议 / 函数流、正式状态集合和最小测试切口 |
| `04-配置设计.md` §3 / §7 / §8 / §11 / §12 | 已完成 | 提取 P0 配置控制面、敏感配置、fail-fast / fail-closed 和测试验收承接口径 |
| `05-测试方案.md` §2 / §6 / §13 / §14 | 已完成 | 提取 P0 测试范围、TC / EV 证据编号、reports / artifacts 路径和残余风险 |

---

## 3. SOP 问题回答

### 3.1 本轮验收的核心裁决目标是什么?

本轮验收的核心裁决目标是判断 L0-sdk 的 P0 官方三语言客户端接入层闭环是否成立,并判断交付物是否可以进入下一阶段。

验收不裁决“是否已经完成全平台所有服务客户端和公共 registry 生产发布”,而裁决以下目标:

| 裁决目标 | 说明 | 主要证据来源 |
|---|---|---|
| 上游 truth 稳定承接成立 | SDK 只消费 `L0-core` / `L0-bus` truth,形成派生视图和语义基线,不生成第二 truth | `TC-SDK-CONTRACT-*`、`EV-SDK-CONTRACT-001` |
| 三语言 official client 概念一致成立 | Rust / Python / TypeScript 的核心概念、错误、trace、redaction 和 event view 语义一致 | `TC-SDK-SEMANTIC-*`、`TC-SDK-SMOKE-*`、`EV-SDK-SEMANTIC-001`、`EV-SDK-SMOKE-001` |
| 最小平台能力接入成立 | local package candidate、quickstart / docs、formal API 或 fake / fixture boundary 下的最小 service capability 可运行 | `TC-SDK-BOUNDARY-*`、`TC-SDK-DOCS-*`、`EV-SDK-BOUNDARY-001`、`EV-SDK-DOCS-001` |
| bus event client view 边界成立 | SDK 提供事件客户端体验,但不重新定义 delivery、retry、DLQ、replay 或 bus runtime truth | `TC-SDK-EVENT-*`、`EV-SDK-EVENT-001` |
| 横切默认安全成立 | error mapping、trace propagation、redaction、credential protection、fake marker guard 默认生效 | `TC-SDK-TRACE-*`、`TC-SDK-SECURITY-*`、`EV-SDK-TRACE-001`、`EV-SDK-SECURITY-001` |
| package candidate 和证据门禁成立 | candidate 状态、evidence result、redaction status、report ref 和 stable gate 可裁决 | `TC-SDK-CANDIDATE-*`、`TC-SDK-SMOKE-*`、`EV-SDK-CANDIDATE-001` |
| 兼容与 deprecated 演进成立 | breaking / migration / deprecated lifecycle 形成可追溯判断,不得单语言漂移 | `TC-SDK-COMPAT-*`、`EV-SDK-COMPAT-001` |
| 配置和证据路径成立 | P0 profile、strict JSON、secret ref、forbidden toggle、artifacts / reports / acceptance handoff 不破坏验收 | config cases、`reports/runs/<run_id>`、`reports/acceptance/*` |

### 3.2 P0/P1/P2 验收范围如何划分?

| 优先级 | 验收含义 | 当前裁决方式 |
|---|---|---|
| P0 | 当前 SDK 核心闭环必须通过的范围 | 任一 P0 主线失败即不通过或触发一票否决 |
| P1 | 真实服务覆盖、真实 credential provider、公共发布等后续生产化或扩展能力 | 当前只验接缝、unsupported / pending / ref-only、风险登记或明确非前置 |
| P2 | 远程配置、hot reload、MCP、REST / GraphQL、REPL、offline cache 等生态增强 | 当前不裁决实现完成度,只要求不得被 P0 依赖或误声明 |
| Forbidden | 会破坏 SDK 边界或安全红线的行为 | 必须阻断通过;不得用风险接受覆盖 |

P0 是本轮验收的硬范围。P1 / P2 不是本轮通过的前置条件,但如果 P1/P2 功能以绕过 P0 红线的方式出现,例如 raw secret 泄漏、fake success 被标成 production supported、query 写 truth,则按一票否决处理。

### 3.3 哪些下游能力只验接缝?

L0-sdk 是官方客户端接入层,必须验对外接入体验和接缝,但不替上游或下游仓裁决完整产品能力。

| 外部 / 下游能力 | 当前只验接缝 | 不裁决完整实现 |
|---|---|---|
| `L0-core` | SDK 使用共享契约、ErrorCode、TraceContext、metadata、envelope 的引用和派生视图一致性 | core 自身契约定义、事件目录和错误码治理 |
| `L0-bus` | SDK 使用 bus event semantic、publish / subscription boundary 和 event client view | bus runtime、delivery、retry、DLQ、replay、tap 的执行 |
| L1/L2/L3/L4 formal APIs | SDK formal API adapter 接口、unsupported / stale / fake boundary 口径和最小 service capability call | 服务端业务规则、领域状态机和生产 SLA |
| fake / fixture endpoint | quickstart、docs example、candidate validation 和最小接入可运行,且保留 fake marker | fake 结果不得验收为 production supported |
| L5 / L6 产品与 runtime / automation | package consumption、示例接入和 API shape 可用 | 产品 UI、runtime loop、下游业务流程 |
| public registry / release platform | P0 不依赖公共发布;只验 local package candidate 和 candidate evidence | crates.io / PyPI / npm 发布、签名、回滚和运营 |
| credential provider / KMS / Vault | credential ref-only、raw secret forbidden、fail-closed | 真实 provider 集成、轮换和运维 |

### 3.4 哪些非范围会影响最终结论?

非范围不会直接导致“不通过”,但会影响最终结论是否可以写成“通过”还是“有条件通过”,以及是否需要在验收结论中附风险说明。

| 非范围 | 对最终结论的影响 | 处理方式 |
|---|---|---|
| public registry 正式发布 | 不阻断 P0;若对外宣称 production release 已完成,必须另行验收 | 默认进入残余风险 |
| production formal API endpoint 全集 | 不阻断 P0;若缺少最小 formal / fake boundary 则阻断 | 服务能力覆盖扩展阶段 |
| real credential provider | 不阻断 P0;但 raw secret 或 unredacted credential 触发一票否决 | 安全 / 运维专项 |
| remote config / hot reload / admin override | 不阻断 P0;启用后必须 rejected / unsupported | 配置 P1/P2 设计 |
| MCP / REST / GraphQL / REPL / offline cache | 不阻断 P0;进入主线前必须重新裁剪需求 | 生态增强阶段 |
| fixed performance threshold | 不阻断 P0;但明显成为最小接入瓶颈会影响结论 | 后续性能专项补阈值 |
| full L1/L2/L3/L4 client coverage | 不阻断 P0;当前只证明最小接入和封装边界 | 按 formal API 稳定度分批纳入 |

### 3.5 哪些范围项可能成为一票否决?

一票否决项来自需求、测试方案和安全边界。Step 11 会正式展开,本步先识别候选范围。

| 候选一票否决项 | 触发条件 | 关联范围 |
|---|---|---|
| core / bus 双 truth | SDK 定义替代 proto / DTO / ErrorCode / TraceContext / CloudEvents schema 或 bus delivery / retry / DLQ / replay truth | truth consumption / event client |
| 三语言语义漂移 | Rust / Python / TypeScript 核心概念、错误、trace、redaction 或 event view 含义不一致 | semantic baseline / package surface |
| 最小可验证接入不可运行 | 没有 local package candidate,或没有 formal API / fake / fixture target 支撑 quickstart / smoke | service boundary / docs / candidate |
| redaction / credential protection 失效 | raw secret、credential value、payload body、production request / response body 进入错误、日志、evidence、reports 或 artifacts | boundary policies / evidence |
| fake success 污染 production | fake / fixture 结果被标记为 production supported 或支撑 stable production coverage | boundary adapter / candidate gate |
| 未验证 candidate 进入 `Stable` | freshness、evidence、redaction、compatibility 任一条件不满足却标记 stable | package candidate / state machine |
| 配置绕过安全或状态门禁 | 配置关闭 redaction / credential 下限、绕过 evidence / compatibility gate、启用 unsupported remote config | config control plane |
| Query / projection / runtime call 写 truth | 只读接口、projection rebuild 或 runtime boundary call 改写 SDK truth | query / projection / runtime boundary |

### 3.6 哪些验收范围必须使用详细设计正式字段、状态或接口名?

凡是进入 §5~§8 的 P0 验收项,必须使用 `03-详细设计.md` 的正式名称,不得使用旧版 `06` 的 codegen / wrapper / subscription / release manifest 口语名替代。

| 类型 | 必须使用的正式名称 | 适用验收范围 |
|---|---|---|
| 状态 enum | `SnapshotFreshnessState`、`CapabilitySupportState`、`PackageCandidateStatus`、`EvidenceResult`、`EvidenceRedactionStatus`、`CompatibilityDecisionState`、`DeprecatedApiLifecycleState` | 状态机、一致性、candidate、evidence、compatibility、deprecated 验收 |
| Command API | `UpdateSdkSemanticBaseline`、`RefreshDerivedBindingView`、`InvokeServiceCapability`、`PublishBusEvent`、`RecordCompatibilityDecision`、`DeprecateSdkApi` | 功能、接口、事务和错误验收 |
| Query API | `GetSdkCapabilitySummary`、`GetUpstreamVersionRefs`、`GetSnapshotFreshness`、`GetServiceClientView`、`GetEventClientView`、`ReadServiceCapability`、`OpenEventSubscription`、`GetPackageCandidateStatus`、`GetVerificationEvidence`、`GetCompatibilityDecision`、`ListDeprecatedApis`、`GetMigrationGuideRef` | 只读边界、projection、query 不反写 truth 验收 |
| Event / Consumer | `ConsumeCoreContractChanged`、`ConsumeBusSemanticChanged`、`ConsumeFormalApiChanged`、`ConsumeValidationRunFinished`、`SdkSemanticBaselineChangedEvent`、`PackageCandidateGeneratedEvent`、`VerificationEvidenceRecordedEvent` | 跨仓同步、event 协作和 evidence 验收 |
| Operations Job | `CheckUpstreamFreshness`、`GeneratePackageCandidate`、`BuildLanguagePackages`、`RunCrossLanguageSmoke`、`ValidateDocsExamples`、`CheckCompatibility`、`VerifyBoundaryPolicies`、`RebuildSdkProjections` | candidate、docs、smoke、compatibility、boundary、projection 验收 |

---

## 4. 当前文档问题诊断

| 问题 | 表现 | 风险 | 本步处理 |
|---|---|---|---|
| 旧 `06` 验收范围跟随旧 codegen / wrapper / subscription / release 线 | 仍把 binding、wrapper、subscription、release manifest 作为主要验收主语 | 与新版 official client access layer、candidate、evidence、compatibility、config 主线断链 | 本步改为 P0 official SDK 闭环范围 |
| P0 / P1 / P2 未稳定区分 | 公共 registry、生产 endpoint、TS transport、internal-python split 等容易混入 P0 | 验收范围失控 | 本步明确 P0 硬范围、P1 接缝、P2 非范围 |
| 配置验收缺失 | 旧 `06` 没有 strict JSON、profile、secret ref、forbidden toggle、fail-fast / fail-closed | 配置可能绕过安全和状态门禁 | 本步将配置控制面纳入 P0 范围 |
| 状态和接口名称可能漂移 | 旧文档用泛化 release / smoke / wrapper 表达 | 实现者无法 1:1 落码或验收 | 本步要求 P0 验收使用 `03` 正式 enum / API / Job 名称 |
| 非范围对结论影响不清 | 旧文档只列“不验 registry 内部”,缺少风险承接 | 可能误判 P1 缺失为 P0 不通过,或反向误声明已交付 | 本步定义非范围如何进入 Step 13 |

---

## 5. 改动前后对比

| 维度 | 改动前 | 改动后 | 价值 |
|---|---|---|---|
| 核心裁决目标 | 验旧 binding / wrapper / subscription / release 是否成立 | 验 P0 official SDK 三语言接入闭环是否成立 | 与新版 `00~05` 对齐 |
| 优先级 | 未稳定区分 P0 / P1 / P2 | P0 硬裁决,P1 接缝,P2 残余风险,Forbidden 阻断 | 可裁决 |
| 下游能力 | 容易把 core、bus、服务仓、registry 作为 SDK 验收对象 | 只验 SDK 消费接缝和边界,完整产品归属外部仓 | 防止越界 |
| 状态 / 接口 | 使用旧口语名和泛化场景 | 使用 `03` 正式 enum、Command、Query、Event、Job 名称 | 支撑 1:1 实现 |
| 非范围 | 只列不验 | 明确影响最终结论和风险接受 | 支撑 Step 13 |
| 一票否决 | 不完整 | 提前识别双 truth、语义漂移、泄漏、fake 污染、未验证 stable、配置绕过、只读写 truth | 支撑 Step 11 |

---

## 6. 验收设计取舍

### 6.1 是否把 public registry 正式发布纳入当前验收

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| A. 纳入当前 P0 验收 | 更接近最终发行 | 超出当前需求和测试范围,会把 release ops 阻塞为 P0 |
| B. 当前只验 local package candidate、artifact metadata、smoke 和 evidence,public registry 进入 P1/P2 风险 | 范围清晰,可交付 | 公网分发风险后置 | 采用 |
| C. 完全不提 public registry | 文档更短 | 后续容易误认为已覆盖 | 不采用 |

### 6.2 是否把 full service client coverage 纳入当前验收

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| A. 全量验收 L1/L2/L3/L4 client | 覆盖面最大 | 依赖大量未稳定 formal API,与当前 P0 最小接入不符 |
| B. 只验 formal API / fake boundary 最小接入和封装边界 | 可证明 SDK 闭环,不越界 | 后续需要分批扩展服务 coverage | 采用 |
| C. 完全不验服务接入 | 文档简单 | 无法证明 SDK 最小可用 | 不采用 |

### 6.3 是否把正式 enum / API 名称纳入范围章节

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| A. 在 Step 2 就列出正式名称约束 | 后续 Step 5~8 不容易漂移 | 本章略长 | 采用 |
| B. 留到 Step 8 状态机再列 | 状态章节更集中 | 功能和接口验收可能提前使用旧名 |
| C. 不列正式名称 | 简洁 | 实现 agent 容易遇到文档冲突 | 不采用 |

---

## 7. 结构化中间产物

### 7.1 验收范围表

| 验收范围项 | 类型 | 优先级 | 裁决目标 | 非范围 / 说明 |
|---|---|---|---|---|
| core / bus truth consumption | 功能 / 架构边界 | P0 | SDK 只消费上游 truth 并形成派生视图 | 不测试 core / bus 自身实现 |
| SDK semantic baseline and derived views | 功能 / 一致性 | P0 | baseline、snapshot freshness、concept map 和 derived view 一致 | 不重新命名对象和状态 |
| Rust / Python / TypeScript package surface | 三语言接入 | P0 | 三语言概念一致,local package candidate 可安装 | 不要求公共 registry 发布 |
| formal API / fake boundary minimum access | 最小接入 | P0 | 最小 service capability call 可运行,unsupported / fake marker 正确 | 不宣称全量 production service coverage |
| bus event client view | 事件客户端 | P0 | event client 只封装 bus 语义,不定义 bus runtime truth | 不测试 bus runtime delivery |
| boundary policies | 安全 / 横切 | P0 | error、trace、redaction、credential、fake marker、forbidden body guard 生效 | 不执行 auth / governance 决策 |
| package candidate and verification evidence | candidate / evidence | P0 | candidate 状态、evidence result、redaction status、report ref 和 stable gate 可裁决 | 不测试公网发布运营 |
| compatibility and deprecated governance | 演进 | P0 | breaking、migration、deprecated lifecycle 可阻断或放行 | 不定义完整 release ops |
| runtime config and profile validation | 配置 / 安全 | P0 | strict JSON、P0 profile、secret ref、forbidden toggle、fail-fast / fail-closed 成立 | 不支持 hot reload、admin override、remote config |
| reports / artifacts / acceptance evidence path | 证据门禁 | P0 | `artifacts/test/<run_id>`、`reports/runs/<run_id>`、`reports/acceptance` 可裁决 | 不把实际日志粘贴进验收标准 |
| production formal API endpoint | 运行期接缝 | P1 | 当前只验 ref / pending / unsupported / fake boundary 口径 | 不验生产 endpoint 全集 |
| real credential provider | 安全接缝 | P1 | 当前只验 credential ref-only 和 raw secret forbidden | 不接入 KMS / Vault 产品实现 |
| public registry publish | 发布专项 | P1/P2 | 当前只确认缺失不阻断 P0 | 不测试 crates.io / PyPI / npm 发布 |
| remote config / hot reload / admin override | 配置增强 | P2 | 当前只验启用后 rejected / unsupported | 不测试在线变更一致性 |
| MCP / REST / GraphQL / REPL / offline cache | 生态增强 | P2 | 当前只确认缺失不影响核心闭环 | 进入主线前需重新裁剪 |
| full L1/L2/L3/L4 client coverage | 服务覆盖扩展 | P1/P2 | 当前只测最小 formal / fake boundary | 不测试全量领域 API |

### 7.2 验收目标表

| 验收目标 | 通过条件摘要 | 失败条件摘要 |
|---|---|---|
| P0 official SDK 闭环成立 | F-001~F-010 均有通过证据,且无一票否决 | 任一 P0 主线缺失或证据不可用 |
| 数据与架构边界成立 | SDK 只拥有 client truth、candidate、evidence、compatibility,上游只作 ref / snapshot | core / bus / service / auth / UI / runtime truth 被 SDK 重定义 |
| 三语言一致性成立 | Rust / Python / TypeScript 语义一致,语言表达可 idiomatic | 任一语言核心概念、错误、trace、redaction 或 event view 漂移 |
| 最小接入成立 | package candidate、quickstart、docs、formal / fake boundary smoke 可运行 | 无 candidate、无验证目标或 fake marker 污染 production |
| 安全与证据成立 | redaction、credential protection、reports / artifacts scan 和 acceptance handoff 可追溯 | raw secret / raw body 泄漏或证据链缺失 |
| 残余风险可接受 | P1/P2 非范围有接受人、后续动作和期限 | 无 owner、无期限、误声明已交付 |

### 7.3 非范围影响表

| 非范围 | 是否阻断 P0 | 是否进入最终结论 | 后续位置 |
|---|---|---|---|
| public registry 正式发布 | 否 | 是,作为 release / operations risk | §13 |
| production formal API endpoint 全集 | 否 | 是,作为 service coverage risk | §13 |
| real credential provider | 否 | 是,但 raw secret 泄漏触发一票否决 | §9 / §11 / §13 |
| remote config / hot reload / admin override | 否 | 是,启用后应 rejected / unsupported | §9 / §13 |
| MCP / REST / GraphQL / REPL / offline cache | 否 | 是,作为生态增强风险 | §13 |
| fixed performance threshold | 否 | 是,说明当前只保留测量点 | §9 / §13 |
| full L1/L2/L3/L4 client coverage | 否 | 是,作为服务覆盖风险 | §13 |

---

## 8. 回填草稿

> 校准来源：
> - `design-calibration/06_acceptance_step_02_scope.md`
>
> 延伸阅读：
> - 建议继续阅读上述中间产物的“验收范围表”“验收目标表”和“非范围影响表”小节,了解本章如何划分 P0 / P1 / P2 验收范围。

本轮验收的核心目标是裁决 L0-sdk 的 P0 官方三语言客户端接入层闭环是否成立。P0 范围包括 core / bus truth consumption、SDK semantic baseline、derived binding view、Rust / Python / TypeScript package surface、formal API / fake boundary minimum access、bus event client view、boundary policies、package candidate、verification evidence、compatibility and deprecated governance、runtime config validation 和 reports / artifacts / acceptance evidence path。

本轮不把 public registry 正式发布、production formal API endpoint 全集、real credential provider、remote config、hot reload、admin override、MCP、REST / GraphQL、REPL、offline cache 和 full L1/L2/L3/L4 client coverage 作为 P0 通过前置。上述能力只作为 P1/P2 接缝、风险或后续专项处理。

凡是进入功能、接口、状态或一致性验收的 P0 项,必须使用 `03-详细设计.md` 的正式 enum、Command、Query、Event 和 Job 名称,不得继续沿用旧版 codegen / wrapper / subscription / release manifest 口语名。

---

## 9. 待确认事项

- 是否接受本轮验收以 P0 official SDK 三语言接入闭环为核心,不把 public registry 正式发布作为 P0。
- 是否接受 full service client coverage 只作为 P1/P2 后续服务覆盖风险,当前只验 formal API / fake boundary 最小接入。
- 是否接受后续 Step 5~8 必须使用 `03-详细设计.md` 的正式状态、接口、事件和 job 名称。

---

## 10. 进入下一步条件

- [x] 验收范围可裁决。
- [x] P0 / P1 / P2 / Forbidden 处理口径明确。
- [x] 下游能力只验接缝的边界明确。
- [x] 非范围及残余风险承接位置明确。
- [x] 一票否决候选范围明确。
- [x] 正式字段、状态和接口名使用规则明确。
