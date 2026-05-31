# L0-sdk 06 验收标准 Step 7: 接口、事件与跨仓同步验收

> 本文件是 `projects/L0-sdk/06-验收标准.md` 的 Step 7 中间产物。
> 本步定义 Command、Query、Inbound Event、Outbound Event、Operations Job 和跨仓接缝的验收门禁。
> 本步不修改正式 `06-验收标准.md`。

---

## 1. Step 状态

| 项 | 内容 |
|---|---|
| Step | Step 7 |
| 主题 | 定义接口、事件与跨仓同步验收 |
| 状态 | 已确认 |
| 正式回填位置 | `06-验收标准.md` §7 |
| 是否修改正式 `06-验收标准.md` | 否 |

---

## 2. 本步输入

| 输入 | 当前状态 | 本步使用方式 |
|---|---|---|
| `01-架构设计.md` §8 / §10 | 已完成 | 提取编译期、运行期、事件协作和下游 package 消费边界 |
| `02-概要设计.md` §7 / §8 | 已完成 | 提取 Command / Query / Event / Job 骨架和主要处理流 |
| `03-详细设计.md` §7 / §8 / §13 | 已完成 | 提取协议总表、公共 DTO、字段闭环、处理流和跨仓依赖绑定 |
| `05-测试方案.md` §5 / §6 / §8 / §13 | 已完成 | 提取 `TC-SDK-*`、`EV-SDK-*`、环境依赖和 reports / artifacts |
| `06_acceptance_step_05_function_gate.md` | 已确认 | 继承功能门禁到接口、事件和 job 的映射 |
| `06_acceptance_step_06_boundary_gate.md` | 已确认 | 继承只读不反写、forbidden body、P1/P2 不污染 P0 的边界红线 |

---

## 3. SOP 问题回答

### 3.1 每个 P0 Command / Query 如何验收?

L0-sdk P0 不提供 HTTP / RPC server。同步入口验收对象是 Rust DTO、Rust client method 或 CLI command 到 application service 的处理链。

| 协议族 | 验收口径 | 关键证据 |
|---|---|---|
| 6 个 Command API | DTO 字段闭环、`CommandMetadata.idempotency_key`、validation、UoW、outbox、audit / evidence 和错误映射符合 `03` | `TC-SDK-CONTRACT-*`、`TC-SDK-SEMANTIC-*`、`TC-SDK-BOUNDARY-*`、`TC-SDK-EVENT-*`、`TC-SDK-COMPAT-*` |
| 12 个 Query API | Query 不写 truth,不触发 projection rebuild,stale / missing / unsupported 有明确 marker 或错误 | read-only tests、`TC-SDK-CONTRACT-*`、`TC-SDK-CANDIDATE-*`、`TC-SDK-COMPAT-*` |
| Rust client method | `ServiceClient::call`、`ServiceClient::read`、`EventClient::publish`、`EventClient::open_subscription` 不绕过 application service 和 boundary guard | `TC-SDK-BOUNDARY-*`、`TC-SDK-EVENT-*` |
| CLI command | CLI 只能作为 DTO / job input 入口,不得成为额外业务 truth | CLI / contract / config evidence |

### 3.2 每个 P0 Event 如何证明可消费 / 可重放?

Inbound Event 必须证明可重复消费且不生成重复 truth。Outbound Event 必须证明基于已提交 SDK truth 发布,失败时保留 retryable evidence,且 event payload 不携带 raw body 或 secret。

| Event 方向 | 协议 | 验收口径 |
|---|---|---|
| Inbound | `ConsumeCoreContractChanged` | core contract changed 可更新 version ref / stale marker;duplicate event 幂等;不复制 core truth |
| Inbound | `ConsumeBusSemanticChanged` | bus semantic changed 可更新 event view / stale marker;不生成 bus runtime truth |
| Inbound | `ConsumeFormalApiChanged` | formal API changed 可更新 service view / capability status;服务仓源码不进入 SDK |
| Inbound | `ConsumeValidationRunFinished` | runner result 可转成 `VerificationEvidence`;unredacted / failed / skipped 不支撑 verified / stable |
| Outbound | 6 个 `sdk.*.v1` event | 只传播 committed SDK fact、state ref、evidence ref、digest、summary 和 marker;不携带 forbidden body |
| Replay / reconsume | inbound event / outbound event evidence | 固定 `<run_id>` 下可通过 fixture replay 或 in-memory sink 复核 |

### 3.3 每个 P0 Job 如何证明幂等和恢复?

Operations Job 的验收不要求真实调度系统完整上线,但必须证明 job input、job_run_id、item key、partial success、每 item 事务边界和 evidence 输出成立。

| Job | 验收口径 | 关键证据 |
|---|---|---|
| `CheckUpstreamFreshness` | 检查 core / bus / formal API source freshness;不可用时 stale / pending / dependency error,不伪造 truth | `TC-SDK-CONTRACT-*` |
| `GeneratePackageCandidate` | 仅 fresh views 和合法 baseline 可生成 candidate;重复 job 幂等 | `TC-SDK-CANDIDATE-*` |
| `BuildLanguagePackages` | Rust / Python / TypeScript artifact metadata attached;`Built` 不成为 candidate 状态 | `TC-SDK-CANDIDATE-002` |
| `RunCrossLanguageSmoke` | smoke result 可写 redacted evidence;skipped 不当 passed | `TC-SDK-SMOKE-*` |
| `ValidateDocsExamples` | docs example 运行结果写 evidence;失败阻断 stable | `TC-SDK-DOCS-*` |
| `CheckCompatibility` | compatibility decision 合法;requires migration 必须有 migration ref | `TC-SDK-COMPAT-*` |
| `VerifyBoundaryPolicies` | redaction、credential、fake marker、forbidden body guard 有证据 | `TC-SDK-SECURITY-*` |
| `RebuildSdkProjections` | 受控 rebuild 只更新 projection,不写 truth;失败留下 stale / failed marker | consistency / recovery evidence |

### 3.4 跨仓同步成功标准是什么?

跨仓同步成功不是“所有上下游仓都实现完”,而是 L0-sdk 自身的输入、输出和边界接缝可被固定证据证明。

| 协作对象 | 成功标准 |
|---|---|
| `L0-core` | `core-contracts` path dependency 或正式 contract package 可编译;SDK 使用 core ErrorCode、TraceContext、Metadata、Envelope,不复制 truth |
| `L0-bus` | `bus-contracts` path dependency 或正式 contract package可编译;SDK 只消费 bus event semantics 和 boundary view,不实现 bus runtime |
| L1/L2/L3/L4 service repos | SDK 通过 formal API / fake / fixture / projection 接缝证明最小 service capability;不写 Cargo path 依赖服务仓 |
| fake / fixture endpoint | 支撑 quickstart、docs、smoke、candidate validation;fake marker 保留且不支撑 production stable |
| 下游产品 / runtime / third-party | 通过 package surface、docs、smoke 和 migration ref 证明可消费;不要求下游产品完整实现 |
| public registry | 当前不作为 P0;local candidate、artifact metadata 和 smoke evidence 足以裁决 P0 |

### 3.5 下游未就绪时如何验接缝?

下游未就绪不应阻断 L0-sdk P0,但必须用 fixture、fake、contract test、local runner 或 package smoke 证明接缝。

| 下游未就绪对象 | 当前验收替代方式 | 不允许的误判 |
|---|---|---|
| L1/L2/L3/L4 service repos | formal API fixture、fake endpoint、capability snapshot | 要求服务仓源码直接参与 SDK P0 验收 |
| bus runtime | bus semantic fixture、fake bus boundary、event replay | 把 bus delivery / retry / DLQ / replay runtime truth 纳入 SDK |
| public registry | local package candidate、local install、package smoke | registry 不可用导致 P0 不通过 |
| real credential provider | credential ref fixture、raw secret negative case | 真实 KMS / Vault 未接入导致 P0 不通过 |
| downstream product / runtime | docs runner、package surface smoke、fake consumer | 要求产品 UI 或 runtime loop 完整上线 |

### 3.6 跨仓验收项分别属于哪类依赖?

L0-sdk 的 P0 编译期依赖是 `L0-core` 和 `L0-bus` 的 contracts。服务仓、fake endpoint、runner、artifact store、registry 和下游产品均不得被误写成 SDK 源码 truth。

| 验收对象 | 全局依赖类型 | 验收方式 |
|---|---|---|
| `L0-core contracts` | 编译期依赖 | Cargo path dependency / contract compile / dependency snapshot |
| `L0-bus contracts` | 编译期依赖 + 事件协作 | Cargo path dependency / bus semantic fixture / boundary adapter evidence |
| L1/L2/L3/L4 formal APIs | 运行期依赖 | formal API / fake / fixture / capability snapshot |
| fake / fixture endpoint | 运行期依赖 | fake marker、boundary receipt、docs / smoke evidence |
| source / runner / package builder / artifact store | 运行期依赖 | adapter tests、runner result、artifact digest、report ref |
| SDK outbound events | 事件协作依赖 | outbox event schema、in-memory sink、publish failure evidence |
| downstream packages / docs consumers | 下游 package / 运行期消费 | package install smoke、docs runner、migration guide ref |

### 3.7 每类依赖应使用什么验收证据?

| 依赖类型 | 正确证据 | 错误证据 |
|---|---|---|
| 编译期依赖 | Cargo path dependency、lockfile / dependency snapshot、contract compile test | 手写同名 DTO 或复制 core / bus schema |
| 运行期依赖 | adapter port test、fake / fixture integration、config summary、dependency unavailable evidence | 强制真实服务仓、KMS、registry 成为 P0 前置 |
| 事件协作依赖 | event fixture、consumer replay、outbox sink、schema validation、idempotency evidence | 要求上下游仓源码直接依赖 SDK |
| 下游 package 消费 | local install、language surface smoke、docs runner、migration guide ref | 要求 public registry 或产品 UI 完整上线 |

### 3.8 每个验收项能否回指正式协议字段、状态名和测试证据?

必须能。进入正式 `06` 时,本章每个验收项至少回指一个 `03` 正式协议名、一个 `05` 测试用例族和一个 `EV-SDK-*` 或 report 证据。

---

## 4. 当前文档问题诊断

| 问题 | 表现 | 风险 | 本步处理 |
|---|---|---|---|
| SDK 旧验收容易把协议写成 HTTP / RPC server | 旧文档没有强调 P0 不提供 server | 实现者可能误建 gateway 或 REST 层 | 本步固定 Rust DTO / client / CLI / Event / Job 形态 |
| Python / TypeScript 容易被误写成第二套协议 truth | package surface 有自身语言形态 | 三语言语义漂移 | 本步规定 Python / TypeScript 由 package surface、smoke 和 docs 验证承接 |
| 跨仓依赖类型容易混淆 | core / bus / service repos / registry / product 都被叫依赖 | 可能错误要求服务仓源码或 public registry 成为 P0 前置 | 本步按编译期、运行期、事件协作、下游 package 消费拆开 |
| Event 可消费 / 可重放证据不清 | 只说发布事件,没有证明 idempotency / replay | 事件协作不可审计 | 本步要求 event idempotency、fixture replay 和 sink evidence |
| Job 幂等和恢复边界容易遗漏 | job 被当成批处理黑盒 | partial success、skipped、stale、artifact orphan 无法裁决 | 本步单列 8 个 Operations Job 门禁 |

---

## 5. 改动前后对比

| 维度 | 改动前 | 改动后 | 价值 |
|---|---|---|---|
| 接口门禁 | 泛称 SDK client / release API 可用 | Command、Query、Inbound Event、Outbound Event、Job 分别裁决 | 可定位 |
| 协议形态 | 可能误写成 HTTP / RPC server | Rust DTO / client method / CLI / Event / one-shot Job | 与 `03` 一致 |
| 跨仓依赖 | 容易要求下游完整实现 | 编译期、运行期、事件协作、下游 package 消费分开 | 不越界 |
| 证据来源 | smoke / docs 泛称 | contract compile、boundary receipt、event sink、job evidence、reports / artifacts | 可追溯 |
| 下游未就绪 | 可能阻断 P0 | 使用 fixture、fake、local runner、package smoke 验接缝 | 可交付 |

---

## 6. 验收设计取舍

### 6.1 是否逐个接口写验收项

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| A. 每个 Command / Query / Event / Job 全部逐条展开 | 最细 | 表格过长,且 Query / Event / Job 有通用门禁 |
| B. 按协议族写门禁,关键协议列入通过条件 | 可读且可裁决 | 需要在证据中保持协议清单完整 | 采用 |
| C. 只写“接口全部通过” | 简短 | 不可审计 | 不采用 |

### 6.2 是否要求下游仓真实实现参与 P0 验收

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| A. 要求全部下游真实实现 | 端到端更真实 | 当前范围越界,会阻塞 SDK P0 |
| B. 当前使用 fixture / fake / contract / package smoke 验接缝 | 范围清晰,可验证 | 下游产品体验后续验收 | 采用 |
| C. 完全不验下游接缝 | 文档简单 | 无法证明 SDK 最小接入成立 | 不采用 |

### 6.3 是否把 public registry 作为 P0 前置

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| A. 作为 P0 前置 | 更接近最终分发 | 与当前 P0 local candidate 冲突 |
| B. 当前 P0 用 local package candidate + smoke,public registry 作为 P1/P2 risk | 符合设计和测试基线 | 公共发布风险后置 | 采用 |
| C. 完全不提 public registry | 简洁 | 后续风险不透明 | 不采用 |

---

## 7. 结构化中间产物

### 7.1 接口 / 事件 / 同步验收表

| 验收项 ID | 接口 / 事件 / 下游 | 全局依赖类型 | 协作方式 | 通过条件 | 失败条件 | 证据来源 |
|---|---|---|---|---|---|---|
| AC-IF-001 | 6 个 Command API | 本仓同步入口 | Rust DTO / CLI / client -> application service | DTO、metadata、idempotency、validation、UoW、outbox、error mapping 均符合 `03` | route / DTO 缺字段;幂等失效;错误映射错误;写入无 evidence / audit | `TC-SDK-CONTRACT-*`、`TC-SDK-SEMANTIC-*`、`TC-SDK-COMPAT-*` |
| AC-IF-002 | 12 个 Query API | 只读消费边界 | Rust DTO / CLI / client -> query service | Query 不写 truth,不触发 rebuild;stale / missing / unsupported 有 marker | Query 写 UoW;自动补写 truth;stale 当 current | query tests、projection evidence |
| AC-IF-003 | Rust client method | 本仓运行期入口 | client facade -> application service / boundary port | `ServiceClient` / `EventClient` 不绕过 boundary guard,返回 ref-only result / diagnostic ref | client method 直接写 truth;返回 raw body;绕过 redaction / credential policy | `TC-SDK-BOUNDARY-*`、`TC-SDK-EVENT-*` |
| AC-IF-004 | 4 个 Inbound Event Consumer | 事件协作依赖 | event fixture / replay -> application service | event idempotency 成立;duplicate 不重复 truth;source failure 不写 local truth | duplicate 生成新 truth;unredacted validation result 被接受;core / bus truth 被复制 | `TC-SDK-CONTRACT-*`、`TC-SDK-SECURITY-003` |
| AC-IF-005 | 6 个 Outbound Event | 事件协作依赖 | committed SDK truth -> outbox sink | topic / schema 可验证;只携带 ref、status、digest、summary 和 marker;publish failure retryable | 未提交 truth 发布;schema 破坏;event 泄漏 forbidden body | outbox sink evidence、`EV-SDK-SECURITY-001` |
| AC-IF-006 | 8 个 Operations Job | 运行期入口 | job JSON input -> one-shot job binary | job_run_id、item key、partial success、evidence output 和 idempotency 可审计 | job 重跑重复副作用;skipped 当 passed;artifact orphan 对外可见 | `TC-SDK-CANDIDATE-*`、`TC-SDK-DOCS-*`、`TC-SDK-SMOKE-*` |
| AC-IF-007 | `L0-core` contracts | 编译期依赖 | Cargo path dependency / contract compile | core contracts 可编译;SDK 不复制 ErrorCode / TraceContext / Metadata truth | 手写同名 DTO;复制 core schema;dependency snapshot 缺失 | dependency snapshot、`TC-SDK-CONTRACT-*` |
| AC-IF-008 | `L0-bus` contracts / semantic | 编译期依赖 + 事件协作 | Cargo path dependency + event semantic fixture / boundary adapter | bus contracts 可编译;event view 消费 bus semantic;不实现 bus runtime | SDK 生成 delivery / retry / DLQ / replay truth;bus runtime 不可用阻断 P0 | dependency snapshot、`TC-SDK-EVENT-*` |
| AC-IF-009 | L1/L2/L3/L4 service boundaries | 运行期依赖 | formal API / fake / fixture / capability snapshot | 最小 service capability 可运行;unsupported / fake marker 有证据;不源码依赖服务仓 | 要求服务仓源码依赖;full coverage 被误声明;fake success 污染 production | `TC-SDK-BOUNDARY-*`、risk acceptance |
| AC-IF-010 | 下游 package / docs consumers | 下游 package / 运行期消费 | local install / docs runner / package smoke | Rust / Python / TypeScript package surface 可消费;docs / smoke 证据存在 | public registry 缺失阻断 P0;产品 UI / runtime loop 被要求上线 | `TC-SDK-DOCS-*`、`TC-SDK-SMOKE-*` |

### 7.2 跨仓依赖类型与验收方式映射表

| 依赖类型 | L0-sdk 对象 | 验收证据 | 不得要求 |
|---|---|---|---|
| 编译期依赖 | `L0-core contracts`、`L0-bus contracts` | Cargo path dependency、contract compile、dependency snapshot | 不得复制 core / bus DTO,不得直接依赖 L1/L2/L3/L4 服务仓源码 |
| 运行期依赖 | formal API、fake endpoint、runner、artifact store、package builder | adapter tests、fake / fixture integration、config summary、dependency unavailable evidence | 不得要求真实 endpoint、KMS、registry 作为当前 P0 前置 |
| 事件协作依赖 | inbound changed events、validation finished、SDK outbox events | event fixture、in-memory sink、idempotency evidence、schema validation | 不得要求上下游仓源码直接依赖 SDK |
| 下游 package 消费 | Rust / Python / TypeScript package surface、docs examples、migration guide | local install、language surface smoke、docs runner、migration guide ref | 不得要求 public registry 或产品 UI 完整上线 |

### 7.3 接口与跨仓协作验收图

图类型: 接口与跨仓协作图

图标题: L0-sdk P0 接口、事件与依赖验收边界

```text
L0-core contracts ----[compile]----+
                                   v
                            L0-sdk contracts/domain
                                   ^
L0-bus contracts -----[compile]----+
        |
        +--[event semantic fixture / boundary]--> EventClientView

formal API / fake endpoint
        --[runtime]--> ServiceClient / BoundaryPort
                       -> application service
                       -> SDK truth + evidence + outbox

runner / builder / docs tool
        --[runtime]--> Operations Job
                       -> package candidate / evidence / reports

SDK outbox
        --[event]--> in-memory sink / fake downstream consumer

Rust / Python / TypeScript consumers
        --[package]--> local package candidate + docs / smoke
```

关键说明:

- `L0-core` 和 `L0-bus` contracts 是当前 P0 编译期跨仓依赖。
- L1/L2/L3/L4 服务仓走 formal API、fake endpoint 或 capability snapshot,不作为 Cargo path dependency。
- public registry 和产品 UI 不作为 P0 前置,当前用 local package candidate、docs runner 和 smoke 证明可消费。
- Event payload 和 report 只能携带 ref、status、digest、summary 和 marker,不能携带 forbidden body。

---

## 8. 回填草稿

> 校准来源：
> - `design-calibration/06_acceptance_step_07_interface_sync_gate.md`
>
> 延伸阅读：
> - 建议继续阅读上述中间产物的“接口 / 事件 / 同步验收表”“跨仓依赖类型与验收方式映射表”和“接口与跨仓协作验收图”小节,了解本章如何区分接口门禁、事件协作和跨仓依赖类型。

L0-sdk 的 P0 接口验收以 `AC-IF-001`~`AC-IF-010` 为裁决入口。P0 不提供 HTTP / RPC server,同步入口采用 Rust DTO、Rust client method 或 CLI command 到 application service 的处理链;异步入口采用 Inbound Event topic、Operations Job JSON input 和 SDK outbox event。Python / TypeScript package surface 通过 candidate、docs、smoke 和 language surface 验证承接,不拥有第二套 protocol truth。

Command API 必须证明 DTO、metadata、idempotency、validation、UoW、outbox、error mapping 均符合 `03-详细设计.md`;Query API 必须证明只读语义成立,不得写 truth 或自动 rebuild projection truth。Inbound Event Consumer 必须证明 event idempotency 成立,重复事件不生成重复 truth。Outbound Event 必须证明只基于已提交 SDK truth 发布,topic / schema 可验证,且 event payload 不携带 forbidden body。

Operations Job 必须证明 job_run_id、item key、partial success、evidence output 和幂等可审计。Job 重跑不得产生重复副作用,skipped 不得当作 passed,artifact orphan 不得对外可见。

跨仓验收必须区分依赖类型。`L0-core contracts` 和 `L0-bus contracts` 是 P0 编译期依赖,通过 Cargo path dependency、contract compile 和 dependency snapshot 验收。Formal API、fake endpoint、runner、artifact store 和 package builder 是运行期依赖,当前 P0 通过 adapter test、fixture、config summary 和 unavailable evidence 验收。SDK outbound events 是事件协作依赖,通过 fixture、sink、schema 和 idempotency evidence 验收。Rust / Python / TypeScript package 消费通过 local install、docs runner、smoke 和 migration guide ref 验收,不要求 public registry 或产品 UI 完整上线。

---

## 9. 待确认事项

当前没有阻塞进入 Step 8 的待确认事项。

| 事项 | 方案 | 建议 | 原因 |
|---|---|---|---|
| 是否逐个 Command / Query / Event / Job 全量展开 | A. 全量逐条;B. 按协议族门禁并列完整清单;C. 只写接口通过 | 采用 B | 能保持可读性,同时保留协议清单和证据追溯 |
| 下游未就绪是否阻断 P0 | A. 阻断;B. 使用 fixture / fake / package smoke 验接缝;C. 不验下游接缝 | 采用 B | L0-sdk 不替下游验完整产品,但必须证明最小接入成立 |
| public registry 是否作为 P0 前置 | A. 是;B. 否,当前用 local package candidate;C. 完全不提 | 采用 B | 与 `03` 和 `05` 的 P0 默认可验证路径一致 |

---

## 10. 进入下一步条件

| 条件 | 状态 |
|---|---|
| P0 Command / Query 验收口径已定义 | 已满足 |
| P0 Inbound / Outbound Event 验收口径已定义 | 已满足 |
| P0 Operations Job 幂等和恢复验收口径已定义 | 已满足 |
| 跨仓同步成功标准已定义 | 已满足 |
| 下游未就绪时的接缝验收方式已定义 | 已满足 |
| 编译期 / 运行期 / 事件协作 / 下游 package 消费依赖已区分 | 已满足 |
| 每类依赖的正确证据与错误证据已定义 | 已满足 |
| 正式 `06-验收标准.md` 未被修改 | 已满足 |

结论: 可以进入 Step 8,定义状态机、事务与一致性验收。
