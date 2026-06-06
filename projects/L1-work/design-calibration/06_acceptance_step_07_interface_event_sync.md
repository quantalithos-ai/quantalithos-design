# Step 7. 定义接口、事件与跨仓同步验收

> 本文件是 `projects/L1-work/06-验收标准.md` 的 Step 7 中间产物。
> 本步把 API、Event、Job 和跨仓依赖类型转成可裁决的验收门禁。
> 本步不重新定义 DTO 字段、event topic、job input / output 或下游实现。

## 1. Step 状态

- 状态: `[x] 已确认`
- 对应 SOP: `standards/document/验收标准讨论流程_SOP.md` Step 7
- 回填章节: `projects/L1-work/06-验收标准.md` §7 接口、事件与跨仓同步验收
- 生成日期: 2026-06-04

## 2. 本步输入

| 输入 | 内容 | 本步使用方式 |
|---|---|---|
| `01-架构设计.md` §3 / §5 / §8 | 唯一编译期依赖、上下游关系、运行期 / 事件 / handoff 协作 | 跨仓依赖类型判断 |
| `02-概要设计.md` §7 | Command、Query、Inbound Consumer、Outbound Event、Operations Job 骨架 | 接口类别和边界来源 |
| `03-详细设计.md` §7 / §8 | 18 Command、8 Query、7 Inbound Consumer、9 Outbound Event、6 Operations Job 和函数级 flow | 正式协议名和处理流来源 |
| `05-测试方案.md` §3.3 / §6.2~§6.5 / §8.2 / §13 | 协议测试检查表、TC / EV 证据、依赖协作方式、报告路径 | 验收证据来源 |
| Step 6 中间产物 | 数据边界、query / projection / job no-write、唯一编译期依赖 | 本步接口和同步红线前置 |

已确认结论:

```text
P0 接口验收必须覆盖 18 Command、8 Query、7 Inbound Event Consumer、10 Outbound Event 和 6 Operations Job。
除 core-contracts 外,跨仓协作不得要求源码或 package 直接依赖。
下游仓未就绪时,用 fake adapter、controlled replay、event dump、handoff marker 和 report evidence 验接缝,不得伪装成真实下游验收通过。
```

## 3. SOP 问题回答

### 3.1 每个 P0 Command / Query 如何验收?

Command 验收按正式协议名逐项裁决,必须同时证明:

1. contract DTO / envelope 与 `03-详细设计.md` §7 的协议入口一致。
2. handler validation、metadata / idempotency、service flow、UoW、audit / trace / outbox / projection stale 口径成立。
3. duplicate 返回 stored result,conflict / reject / invalid path 不写 accepted truth。
4. 证据能回指 `TC-WORK-*`、`EV-WORK-*` 和固定 `reports/runs/<run_id>/evidence-index.md`。

Query 验收按 8 个正式 Query 逐项裁决,必须同时证明:

1. contract DTO / QueryMetadata 与正式 Query 入口一致。
2. 授权、missing、not visible、empty、stale、failed / rebuilding surface 成立。
3. Query 不写 truth、audit、outbox、idempotency、freshness marker 或 projection state。
4. 证据来自 `TC-WORK-QUERY-001`~`008` 和 `EV-WORK-QUERY-001`~`008`。

### 3.2 每个 P0 Event 如何证明可消费 / 可重放?

Inbound Event Consumer 必须证明 envelope、event id、source ref、dedup key、payload digest、source mapping、dead-letter / quarantine 或 marker 口径成立。重复 event 不得重复写 snapshot / marker,malformed / unsupported 输入不得进入业务 truth。

Outbound Event 必须证明事件只来自 committed truth、outbox 或 projection state;payload 只含 ref、state、safe summary 和 trace context;不携带相邻仓正文。可消费 / 可重放证据不要求真实下游仓完成,但必须包含 fake publisher、event dump schema scan、outbox replay 或 controlled subscriber 证据。

### 3.3 每个 P0 Job 如何证明幂等和恢复?

Operations Job 必须证明:

| Job 验收点 | 裁决口径 |
|---|---|
| input / scope | job id、run metadata、scope、operator / system actor 合法;invalid input 为 job-level reject |
| batch / retry | batch 边界、retry 次数、partial failure、failed marker 可见 |
| no-write | outbox publish、projection rebuild、snapshot refresh、reconciliation、handoff 不反写业务 truth |
| rerun | 同一 run / scope 重跑不产生重复 truth、重复 handoff 或重复 publication |
| report | job report、failure reason、safe log、redaction status 写入固定 `<run_id>` 路径 |

### 3.4 跨仓同步成功标准是什么?

跨仓同步成功不是“下游仓真实完成业务动作”,而是 `L1-work` 在本轮 P0 范围内把协作契约稳定暴露并产生可复核证据:

| 同步类型 | 成功标准 |
|---|---|
| 编译期依赖 | 仅 `core-contracts` 可作为 package / path dependency,contract compile 和版本兼容通过 |
| 运行期依赖 | resolver / adapter / handoff seam 能表达 success、unresolved、unavailable、failed marker,且不保存外部正文 |
| 事件协作依赖 | inbound replay、dedup、dead-letter / marker、outbound outbox publish / failure / replay 证据成立 |
| 下游消费 | SDK / workspace / member-service / observability / archive 可通过 fake subscriber、event dump、handoff report 验接缝 |

### 3.5 下游未就绪时如何验接缝?

下游未就绪时,验收不得等待或假定下游实现完成,也不得把 fake success 写成 production success。

| 下游状态 | P0 验收方式 | 不得做 |
|---|---|---|
| 下游仓未实现 | 使用 contract fixture、fake adapter、event dump schema scan、controlled replay | 不要求源码依赖或真实调用 |
| 下游服务不可用 | 返回 unavailable / failed marker,保留 Work truth 和 outbox / handoff 状态 | 不补造外部 truth,不 silent success |
| event bus 未接入真实环境 | fake publisher + replay bundle + publish failure injection | 不把 bus 加为 compile dependency |
| observability / archive 未就绪 | fake handoff adapter + safe handoff report | 不保存全局日志正文或 archive package body |

### 3.6 跨仓验收项分别属于哪些依赖类型?

本轮依赖类型按 `05-测试方案.md` §8.2 承接:

| 类型 | 对象 | 验收方式 |
|---|---|---|
| `[compile]` | `core-contracts` | package dependency / contract compile / baseline 兼容 |
| `[runtime]` | identity、method、process、governance、artifact、runtime、observability、archive、store、clock、id generator | resolver / adapter / handoff fake 或 controlled adapter |
| `[event]` | L0-bus、identity、conversation、method、process、governance、artifact、runtime、workspace / SDK 消费 | envelope fixture、dedup、dead-letter、outbox publish、replay、event dump scan |

### 3.7 每类依赖应使用什么验收证据?

证据按依赖类型选取,不按源码依赖选取。

| 依赖类型 | 正确证据 | 错误要求 |
|---|---|---|
| `[compile]` | dependency report、contract compile report、core baseline | 要求所有 sibling 仓 path dependency |
| `[runtime]` | adapter contract report、fake seed、resolver outcome、failed marker、safe log | 要求直接 import 下游 domain / infra |
| `[event]` | event envelope fixture、dedup report、dead-letter / quarantine report、outbox replay、event dump scan | 要求真实 bus 和全部 consumer 已上线 |
| handoff | handoff marker、handoff report、redaction scan、rerun idempotency report | 要求 observability / archive 保存真实正文 |

### 3.8 每个验收项能否回指正式协议字段、状态名和测试证据?

本步只使用 `03-详细设计.md` §7 已列出的正式协议名和 `05-测试方案.md` 已定义的 `TC-WORK-*` / `EV-WORK-*`。若后续发现某个 protocol、event、job、状态或字段无法回指正式设计,验收标准不得在 §7 自行补定义,必须暂停并回写 `03-详细设计.md` 或 `05-测试方案.md`。

## 4. 当前文档问题诊断

| 位置 | 当前问题 | 影响 | 本步处理 |
|---|---|---|---|
| 旧 `06-验收标准.md` | 接口验收只写“API 可用”一类泛化条件 | 无法判定 18 Command / 8 Query 是否逐项成立 | 逐协议名重建接口门禁 |
| 旧 `06-验收标准.md` | Event / Job 与跨仓同步混写 | 无法区分 inbound、outbound、job 和 downstream seam | 按 Consumer / Event / Job / dependency 类型拆分 |
| 旧 `06-验收标准.md` | 下游同步容易被理解为真实下游完成 | 会扩大 P0 范围,并诱发源码依赖 | 明确 P0 验接缝而非验下游完整实现 |
| 当前 `03` / `05` | 已有正式协议清单和证据族 | 可作为本步真相源 | 本步承接,不新增协议 |
| Step 6 | 已确认唯一编译期依赖和 no-write 红线 | 本步必须继承 | 跨仓验收表中加入依赖类型约束 |

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 接口覆盖 | 泛化 API / 查询可用 | 18 Command、8 Query 全量点名 | 防止遗漏正式入口 |
| Event 覆盖 | 未区分 inbound / outbound | 7 Consumer 和 9 Outbound Event 分别验收 | 消费、发布、重放证据不同 |
| Job 覆盖 | 只写后台任务 | 6 Operations Job 逐项绑定 OPS 证据 | Job 必须证明幂等和恢复 |
| 跨仓同步 | 容易要求真实下游 | 按 `[compile]` / `[runtime]` / `[event]` / handoff 验接缝 | 对齐依赖裁剪 |
| 证据来源 | 泛化报告 | `TC-WORK-*`、`EV-WORK-*`、`reports/runs/<run_id>/evidence-index.md` | 可复核 |

## 6. 验收裁决取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A: 只按 Command / Query / Event / Job 五类写总门禁 | 简短 | 不能证明每个正式入口已覆盖 | 不采用 |
| 方案 B: 按正式协议名逐项列明,但通过条件按同族复用 | 覆盖完整,证据清晰 | 表较长 | 采用 |
| 方案 C: 把下游真实验收也纳入 P0 | 看似端到端完整 | 扩大本仓范围,破坏依赖裁剪,阻塞 P0 | 不采用 |

推荐方案 B。

原因:

- Step 7 的主要风险是协议漏项和跨仓依赖类型误判。
- 验收标准必须点名正式接口,但不应重复写 DTO 字段。
- 下游同步验收应验证接缝和证据,不能把下游仓完成度变成本仓 P0 前置。

## 7. 结构化中间产物

### 7.1 Command 接口验收表

| 验收项 ID | 接口 / 事件 / 下游 | 全局依赖类型 | 协作方式 | 通过条件 | 失败条件 | 证据来源 |
|---|---|---|---|---|---|---|
| `IF-WORK-CMD-001` | `CreateProject` | `[compile] core-contracts` + 本仓 runtime | API -> application -> domain -> repository | DTO / metadata / idempotency / UoW / trace / audit / outbox 成立;duplicate 返回 stored result | 缺 idempotency 进入写路径;duplicate 创建第二 Project / Backlog | `TC-WORK-CORE-001`;`TC-WORK-CORE-004`;`EV-WORK-CORE-001`;`EV-WORK-CORE-004` |
| `IF-WORK-CMD-002` | `UpdateProjectLifecycle` | `[compile] core-contracts` + 本仓 runtime | API -> application -> domain -> repository | 生命周期合法转换、version 匹配、trace / audit / outbox / projection stale 成立 | 非法转换成功;reject path 写 truth / outbox | `TC-WORK-CORE-003`;`EV-WORK-CORE-003` |
| `IF-WORK-CMD-003` | `UpdateBacklogAvailability` | `[compile] core-contracts` + 本仓 runtime | API -> application -> domain -> repository | maintenance lock / unlock / archive 口径成立,影响后续 formal work guard | lock 失效导致新增 WorkItem 成功;维护状态不可追溯 | `TC-WORK-FORMAL-003`;`EV-WORK-FORMAL-003`;`EV-WORK-CORE-*` |
| `IF-WORK-CMD-004` | `AssignProjectMember` | `[runtime] identity resolver` | API -> member resolver -> application -> repository | GlobalMember ref / capability snapshot 保存,ProjectMember truth 成立 | resolver unavailable 写 accepted member truth;保存 identity body | `TC-WORK-MEMBER-001`~`003`;`EV-WORK-MEMBER-001`~`003` |
| `IF-WORK-CMD-005` | `UpdateProjectMemberResponsibility` | `[runtime] identity resolver` | API -> application -> domain state transition | responsibility 合法变化和 Released 后拒绝恢复成立 | ProjectMember 接管 identity 生命周期;Released 后非法恢复成功 | `TC-WORK-MEMBER-004`;`EV-WORK-MEMBER-004` |
| `IF-WORK-CMD-006` | `CreateWorkItem` | `[runtime] source / method resolver` | API -> formal work policy -> repository | Formal WorkItem 加入 Backlog,source ref / safe summary / outbox 成立 | 外部事件或 forbidden body 直接创建 Work truth | `TC-WORK-FORMAL-001`~`004`;`EV-WORK-FORMAL-001`~`004` |
| `IF-WORK-CMD-007` | `CreateChildWorkItem` | `[runtime] source / method resolver` | API -> parent validation -> repository | 合法 root parent 下 child 成立,仍为正式工作 | 非法 parent 成功;child 退化为 execution step | `TC-WORK-FORMAL-005`;`EV-WORK-FORMAL-005` |
| `IF-WORK-CMD-008` | `UpdateWorkItemLifecycle` | `[runtime] artifact / evidence resolver` | API -> evidence policy -> domain state transition | work lifecycle 合法推进,完成依据 ref 可接受 | missing / rejected evidence 仍完成;保存 evidence body | `TC-WORK-DEP-005`;`TC-WORK-FORMAL-*`;`EV-WORK-DEP-005`;`EV-WORK-FORMAL-*` |
| `IF-WORK-CMD-009` | `RequestWorkPromotion` | `[runtime] conversation / runtime source resolver` | API -> promote service -> repository | `PromoteResultState::PendingReview`,不创建 Work truth | request 阶段创建 WorkItem;保存 runtime / ImplementationPlan 正文 | `TC-WORK-PROMOTE-001`;`TC-WORK-PROMOTE-004`;`EV-WORK-PROMOTE-001`;`EV-WORK-PROMOTE-004` |
| `IF-WORK-CMD-010` | `ReviewWorkPromotion` | `[runtime] source resolver` | API -> promote review -> optional work creation | accept / reject 显式记录;accept 后创建或绑定 WorkItem;并发 single-winner | reject 创建 WorkItem;并发 review 多赢家;正文入仓 | `TC-WORK-PROMOTE-002`;`TC-WORK-PROMOTE-003`;`TC-WORK-PROMOTE-005`;`EV-WORK-PROMOTE-*` |
| `IF-WORK-CMD-011` | `LinkWorkDependency` | 本仓 runtime | API -> formal work scope resolver -> dependency graph policy -> repository | dependency 连接正式 Work,history / trace / outbox 成立;graph project scope 来自 `get_formal_work_scope(downstream)`;标脏 downstream project-board / member-work | cycle 成功;非 formal work 成为 dependency endpoint;从 `FormalWorkRef` 字符串私自推 project | `TC-WORK-DEP-001`;`TC-WORK-DEP-002`;`EV-WORK-DEP-001`;`EV-WORK-DEP-002` |
| `IF-WORK-CMD-012` | `UpdateWorkDependencyState` | `[runtime] evidence resolver` | API -> formal work scope resolver -> dependency state transition | `DependencyTarget::Active` 推进 `Proposed -> Active`;terminal targets 推进 `Active -> Satisfied / Waived / Cancelled`;terminal 后不可 reopen;downstream relation views stale | Active target 未覆盖;terminal reopen 成功;缺 evidence / reason 或 reason kind mismatch 仍满足;未解析 stale scope | `TC-WORK-DEP-003`;`EV-WORK-DEP-003` |
| `IF-WORK-CMD-013` | `OpenWorkBlocker` | 本仓 runtime + optional governance ref | API -> formal work scope resolver -> blocker policy -> repository | blocker ref、cause ref、history、trace、outbox 成立;blocked project-board / member-work stale | blocker 替代 governance decision truth;缺 cause 成功;未解析 blocked work scope | `TC-WORK-DEP-004`;`EV-WORK-DEP-004` |
| `IF-WORK-CMD-014` | `ResolveWorkBlocker` | `[runtime] artifact / governance evidence resolver` | API -> formal work scope resolver -> evidence policy -> state transition | verified evidence ref 后 resolve,可追溯;blocked relation views stale | missing / rejected evidence resolve 成功;保存 evidence body;未解析 blocked work scope | `TC-WORK-DEP-005`;`EV-WORK-DEP-005` |
| `IF-WORK-CMD-015` | `OpenIteration` | `[runtime] process timebox resolver` | API -> iteration policy -> repository | Iteration Planning,保存 timebox ref,不改 process truth | process timing 直接打开 Iteration;缺 ref 仍成功 | `TC-WORK-ITER-001`;`EV-WORK-ITER-001` |
| `IF-WORK-CMD-016` | `CommitIterationScope` | 本仓 runtime | API -> commitment policy -> repository | candidates 均来自 formal work,iteration / commitment / work marks 同 UoW | 非 formal candidate commit 成功;partial truth 写入 | `TC-WORK-ITER-002`;`TC-WORK-ITER-003`;`EV-WORK-ITER-002`;`EV-WORK-ITER-003` |
| `IF-WORK-CMD-017` | `UpdateIterationCommitment` | 本仓 runtime | API -> commitment changeset -> repository | commitment change record、projection stale、version 匹配 | 调整原因缺失;version conflict 后写 truth | `TC-WORK-ITER-004`;`EV-WORK-ITER-004` |
| `IF-WORK-CMD-018` | `UpdateIterationLifecycle` | 本仓 runtime + process ref | API -> iteration state transition | close / cancel 合法,非法 reopen reject | reopen terminal 成功;改变 process truth | `TC-WORK-ITER-005`;`EV-WORK-ITER-005` |

说明:

- `IF-WORK-*` 是 Step 7 本地验收门禁 ID,不是新增需求级 `AC-WORK-*`。
- Command result 证据必须进入固定 `<run_id>` 的 evidence index。

### 7.2 Query 接口验收表

| 验收项 ID | 接口 / 事件 / 下游 | 全局依赖类型 | 协作方式 | 通过条件 | 失败条件 | 证据来源 |
|---|---|---|---|---|---|---|
| `IF-WORK-QUERY-001` | `GetProjectWorkFacts` | 本仓 runtime | API -> query service -> truth / trace read | visible、missing、not visible surface 成立;no-write | 不可见泄露 truth;query 写 truth / trace | `TC-WORK-QUERY-001`;`EV-WORK-QUERY-001` |
| `IF-WORK-QUERY-002` | `GetBacklog` | 本仓 runtime | API -> query service -> backlog read / projection | page / empty surface 和 page token 正确;不触发 formalize | 查询隐式创建 Backlog / WorkItem | `TC-WORK-QUERY-002`;`EV-WORK-QUERY-002` |
| `IF-WORK-QUERY-003` | `GetWorkItem` | 本仓 runtime | API -> query service -> work read | WorkItem / child terminal state 正常可见,无 external body | 拉取或返回 artifact / runtime 正文 | `TC-WORK-QUERY-003`;`EV-WORK-QUERY-003` |
| `IF-WORK-QUERY-004` | `ListMemberWork` | 本仓 runtime + projection | API -> query service -> projection read | stale / rebuilding / failed surface 可见,不触发 rebuild | stale 时自动 rebuild 或写 projection state | `TC-WORK-QUERY-004`;`EV-WORK-QUERY-004` |
| `IF-WORK-QUERY-005` | `GetIterationSummary` | 本仓 runtime + projection | API -> query service -> iteration / projection read | present、missing、stale surface 成立 | 查询改变 commitment 或 projection state | `TC-WORK-QUERY-005`;`EV-WORK-QUERY-005` |
| `IF-WORK-QUERY-006` | `SearchWork` | 本仓 runtime + search projection | API -> query service -> search projection | criteria / failed projection surface 成立,结果只含 refs / safe summary | search index 成为 truth 或返回 raw body | `TC-WORK-QUERY-006`;`EV-WORK-QUERY-006` |
| `IF-WORK-QUERY-007` | `GetWorkTrace` | 本仓 runtime | API -> query service -> trace read | page / empty / not visible surface、trace subject、page token 正确 | trace query 写 audit / outbox 或替代 observability | `TC-WORK-QUERY-007`;`EV-WORK-QUERY-007` |
| `IF-WORK-QUERY-008` | `GetProjectBoardView` | 本仓 runtime + projection | API -> query service -> board projection | board / rebuilding / missing surface 成立 | 查询 enqueue `DerivedWorkViewChanged` 或反写 truth | `TC-WORK-QUERY-008`;`EV-WORK-QUERY-008` |

### 7.3 Inbound Event Consumer 验收表

| 验收项 ID | 接口 / 事件 / 下游 | 全局依赖类型 | 协作方式 | 通过条件 | 失败条件 | 证据来源 |
|---|---|---|---|---|---|---|
| `IF-WORK-CONSUMER-001` | `ConsumeIdentityMemberChanged` from `L1-identity` | `[event]` + `[runtime]` | event replay -> dedup -> snapshot / marker | capability snapshot / reference state 或 dead-letter 成立;duplicate 不重复 snapshot | 修改 GlobalMember truth;重复 event 重复写 accepted snapshot | `TC-WORK-MEMBER-001`;`TC-WORK-MEMBER-002`;`EV-WORK-MEMBER-*` |
| `IF-WORK-CONSUMER-002` | `ConsumeMethodDefinitionChanged` from `L3-method-library` | `[event]` + `[runtime]` | event replay -> method snapshot / marker | definition ref / snapshot / stale marker 成立,不保存定义正文 | method body 入仓;直接改 Work truth | `TC-WORK-FORMAL-002`;`TC-WORK-QUERY-006`;`EV-WORK-FORMAL-*`;`EV-WORK-QUERY-006` |
| `IF-WORK-CONSUMER-003` | `ConsumeConversationWorkContextChanged` from `L1-conversation` | `[event]` + `[runtime]` | event replay -> source ref / pending marker | source reference 或 pending formalize marker 成立;digest mismatch -> unresolved | conversation fact 直接成为 WorkItem | `TC-WORK-FORMAL-002`;`TC-WORK-PROMOTE-001`;`EV-WORK-FORMAL-*`;`EV-WORK-PROMOTE-001` |
| `IF-WORK-CONSUMER-004` | `ConsumeProcessTimingChanged` from `L1-process` | `[event]` + `[runtime]` | event replay -> timebox reference state | process timing snapshot / reference state 成立 | process event 直接 open / close Iteration | `TC-WORK-ITER-001`;`TC-WORK-QUERY-005`;`EV-WORK-ITER-001`;`EV-WORK-QUERY-005` |
| `IF-WORK-CONSUMER-005` | `ConsumeGovernanceDecisionChanged` from `L1-governance` | `[event]` + `[runtime]` | event replay -> governance ref / marker | decision ref / summary / marker 成立,missing -> dead-letter | 生成 governance truth 或直接改 dependency / blocker truth | `TC-WORK-DEP-003`;`TC-WORK-DEP-005`;`EV-WORK-DEP-*` |
| `IF-WORK-CONSUMER-006` | `ConsumeArtifactEvidenceChanged` from `L1-artifact` | `[event]` + `[runtime]` | event replay -> evidence ref / snapshot state | verified / rejected / stale / failed marker 成立 | evidence event 直接 complete work;artifact body 入仓 | `TC-WORK-DEP-005`;`TC-WORK-FORMAL-004`;`EV-WORK-DEP-005`;`EV-WORK-FORMAL-004` |
| `IF-WORK-CONSUMER-007` | `ConsumeRuntimePromoteRequested` from `L2-runtime` | `[event]` + `[runtime]` | event replay -> pending promote intake | source reference 和 pending promote intake 成立,必须走 review | runtime event 直接创建 child WorkItem 或保存 runtime progress body | `TC-WORK-PROMOTE-001`;`TC-WORK-PROMOTE-004`;`EV-WORK-PROMOTE-001`;`EV-WORK-PROMOTE-004` |

### 7.4 Outbound Event 验收表

| 验收项 ID | 接口 / 事件 / 下游 | 全局依赖类型 | 协作方式 | 通过条件 | 失败条件 | 证据来源 |
|---|---|---|---|---|---|---|
| `IF-WORK-EVENT-001` | `ProjectChanged` | `[event]` | outbox -> fake publisher -> replay / dump scan | payload 来自 Project truth,可发布 / 失败标记 / 重放 | 携带 workspace / process 正文;发布失败回滚 truth | `TC-WORK-CORE-*`;`TC-WORK-OPS-001`;`EV-WORK-CORE-*`;`EV-WORK-OPS-001` |
| `IF-WORK-EVENT-002` | `BacklogChanged` | `[event]` | outbox -> fake publisher -> replay / dump scan | payload 来自 Backlog truth,包含 backlog ref、project ref、state 和 maintenance reason | 复用 ProjectChanged 导致 backlog reason/state 缺失;携带 workspace / process 正文 | `TC-WORK-CORE-*`;`TC-WORK-FORMAL-003`;`TC-WORK-OPS-001`;`EV-WORK-CORE-*`;`EV-WORK-FORMAL-003`;`EV-WORK-OPS-001` |
| `IF-WORK-EVENT-003` | `ProjectMemberChanged` | `[event]` | outbox -> fake publisher -> replay / dump scan | payload 只含 member ref、responsibility state、trace context | 改变 identity truth;携带 identity body | `TC-WORK-MEMBER-*`;`TC-WORK-OPS-001`;`EV-WORK-MEMBER-*`;`EV-WORK-OPS-001` |
| `IF-WORK-EVENT-004` | `WorkItemChanged` | `[event]` | outbox -> fake publisher -> replay / dump scan | payload 只含 formal work ref、work state、source refs | 携带 plan / artifact / runtime body | `TC-WORK-FORMAL-*`;`TC-WORK-PROMOTE-*`;`TC-WORK-OPS-001`;`EV-WORK-FORMAL-*`;`EV-WORK-PROMOTE-*`;`EV-WORK-OPS-001` |
| `IF-WORK-EVENT-005` | `PromoteResultRecorded` | `[event]` | outbox -> fake publisher -> replay / dump scan | promote result state、source ref、created work ref 可消费 / 可重放 | reject path 创建 WorkItem;携带 source body | `TC-WORK-PROMOTE-*`;`TC-WORK-OPS-001`;`EV-WORK-PROMOTE-*`;`EV-WORK-OPS-001` |
| `IF-WORK-EVENT-006` | `WorkDependencyChanged` | `[event]` | outbox -> fake publisher -> replay / dump scan | relation ref / state / affected work refs 可消费 / 可重放 | 传播 governance body 或制造 dependency truth | `TC-WORK-DEP-*`;`TC-WORK-OPS-001`;`EV-WORK-DEP-*`;`EV-WORK-OPS-001` |
| `IF-WORK-EVENT-007` | `WorkBlockerChanged` | `[event]` | outbox -> fake publisher -> replay / dump scan | blocker ref / state / evidence ref 可消费 / 可重放 | 携带 evidence body;缺 evidence 仍 resolve | `TC-WORK-DEP-004`;`TC-WORK-DEP-005`;`TC-WORK-OPS-001`;`EV-WORK-DEP-*`;`EV-WORK-OPS-001` |
| `IF-WORK-EVENT-008` | `IterationChanged` | `[event]` | outbox -> fake publisher -> replay / dump scan | iteration ref / commitment summary / trace context 可消费 | 让 process 反写 commitment;携带 process body | `TC-WORK-ITER-*`;`TC-WORK-OPS-001`;`EV-WORK-ITER-*`;`EV-WORK-OPS-001` |
| `IF-WORK-EVENT-009` | `WorkTraceAvailable` | `[event]` + handoff | outbox / handoff marker -> fake subscriber | trace subject ref、trace ref、handoff ref 可消费 / 可重放 | 替代全局 observability 或携带 raw log body | `TC-WORK-QUERY-007`;`TC-WORK-OPS-005`;`EV-WORK-QUERY-007`;`EV-WORK-OPS-005` |
| `IF-WORK-EVENT-010` | `DerivedWorkViewChanged` | `[event]` | projection state -> outbox -> fake publisher | view ref、freshness state、cursor 可消费 / 可重放 | 派生变化被当作新 truth;query 触发 enqueue | `TC-WORK-QUERY-004`;`TC-WORK-QUERY-008`;`TC-WORK-OPS-002`;`EV-WORK-QUERY-*`;`EV-WORK-OPS-002` |

### 7.5 Operations Job 验收表

| 验收项 ID | 接口 / 事件 / 下游 | 全局依赖类型 | 协作方式 | 通过条件 | 失败条件 | 证据来源 |
|---|---|---|---|---|---|---|
| `IF-WORK-JOB-001` | `PublishWorkOutbox` | `[event]` | job runner -> outbox -> fake publisher | success -> Published;partial failure -> Failed;rerun 幂等 | 发布失败回滚 truth;重复 publish 产生重复事实 | `TC-WORK-OPS-001`;`EV-WORK-OPS-001` |
| `IF-WORK-JOB-002` | `RebuildWorkProjections` | 本仓 runtime | job runner -> projection store | Rebuilding -> Fresh,只从 committed truth 重建 | projection 反推 truth;query 触发 rebuild | `TC-WORK-OPS-002`;`EV-WORK-OPS-002` |
| `IF-WORK-JOB-003` | `RefreshExternalReferenceSnapshots` | `[runtime] resolver` | job runner -> resolver fakes -> snapshots | success 更新 snapshot;failure 写 marker;last good preserved | 复制外部正文;resolver failure 造 truth | `TC-WORK-OPS-003`;`EV-WORK-OPS-003` |
| `IF-WORK-JOB-004` | `RunWorkReconciliation` | 本仓 runtime | job runner -> read-only report | 生成 reconciliation report,不自动修复 truth / projection / outbox | report job 修改业务 truth 或覆盖 outbox | `TC-WORK-OPS-004`;`EV-WORK-OPS-004` |
| `IF-WORK-JOB-005` | `PrepareWorkTraceHandoff` | `[runtime] observability handoff` | job runner -> fake handoff adapter -> report | success 写 handoff marker;failure 写 failed refs;safe report | 保存 observability raw body;rerun 重复 handoff | `TC-WORK-OPS-005`;`EV-WORK-OPS-005` |
| `IF-WORK-JOB-006` | `PrepareArchiveHandoff` | `[runtime] archive handoff` | job runner -> fake archive adapter -> report | success 写 archive marker;failure 进入 report;rerun 幂等 | 保存 archive package body;失败 silent success | `TC-WORK-OPS-006`;`EV-WORK-OPS-006` |

### 7.6 跨仓依赖类型与验收方式映射表

| 对象 | 类型 | 验收方式 | 不得要求 | 证据 |
|---|---|---|---|---|
| `core-contracts` | `[compile]` | package dependency / contract compile / baseline 兼容 | 无 | dependency report、contract compile report |
| `L0-bus` | `[event]` | fake publisher、event envelope fixture、outbox replay、publish failure injection | path dependency、真实 bus 必须上线 | `EV-WORK-OPS-001`;event dump scan |
| `L1-identity` | `[runtime]` / `[event]` | fake member resolver、identity event replay、capability snapshot evidence | identity domain / infra 直接依赖 | `EV-WORK-MEMBER-*` |
| `L1-conversation` | `[runtime]` / `[event]` | fake source resolver、conversation source ref、context event replay | conversation fact body 入仓 | `EV-WORK-FORMAL-*`;`EV-WORK-PROMOTE-*` |
| `L3-method-library` | `[runtime]` / `[event]` | fake method definition resolver、method event replay | method definition body 入仓 | `EV-WORK-FORMAL-*`;`EV-WORK-QUERY-006` |
| `L1-process` | `[runtime]` / `[event]` | fake timebox resolver、process timing replay | process 反写 Backlog / Iteration truth | `EV-WORK-ITER-*`;`EV-WORK-QUERY-005` |
| `L1-governance` | `[runtime]` / `[event]` | fake governance / evidence resolver、decision replay | governance decision body 入仓或反写 Work | `EV-WORK-DEP-*` |
| `L1-artifact` | `[runtime]` / `[event]` | fake artifact evidence resolver、evidence replay、redaction scan | artifact / ImplementationPlan body 入仓 | `EV-WORK-DEP-005`;`EV-WORK-FORMAL-004`;`EV-WORK-CFG-*` |
| `L2-runtime` | `[runtime]` / `[event]` | fake runtime result resolver、runtime promote replay | runtime progress / tool invocation 入仓 | `EV-WORK-PROMOTE-*` |
| `L0-sdk` / `L1-workspace` / member-service | `[event]` / downstream consumer | event dump、fake subscriber、query contract surface | 下游完整实现阻塞 P0 | `EV-WORK-QUERY-*`;`EV-WORK-OPS-001` |
| `L4-observability` | `[runtime]` handoff | fake trace handoff adapter、safe handoff report | 全局日志正文入仓 | `EV-WORK-OPS-005`;`EV-WORK-NFR-005` |
| `L4-archive` | `[runtime]` handoff | fake archive handoff adapter、archive marker report | archive package body 入仓 | `EV-WORK-OPS-006`;`EV-WORK-NFR-005` |
| Work store / projection / idempotency / outbox | 本仓 runtime | in-memory store、temp dir、failure injection | 复用上一 run 数据 | `EV-WORK-CORE-*`;`EV-WORK-OPS-*`;`EV-WORK-NFR-004` |
| clock / id generator | 本仓 runtime | deterministic fake | 真实时间导致不可复核证据 | suite report、snapshot digest |

### 7.7 协议到证据映射

| 协议组 | 正式入口 | 测试用例 | 证据族 | 固定报告入口 |
|---|---|---|---|---|
| Command / core | `CreateProject`、`UpdateProjectLifecycle`、`UpdateBacklogAvailability` | `TC-WORK-CORE-*`;`TC-WORK-FORMAL-003` | `EV-WORK-CORE-*`;`EV-WORK-FORMAL-003` | `reports/runs/<run_id>/evidence-index.md` |
| Command / member | `AssignProjectMember`、`UpdateProjectMemberResponsibility` | `TC-WORK-MEMBER-*` | `EV-WORK-MEMBER-*` | `reports/runs/<run_id>/evidence-index.md` |
| Command / formal work | `CreateWorkItem`、`CreateChildWorkItem`、`UpdateWorkItemLifecycle` | `TC-WORK-FORMAL-*`;`TC-WORK-DEP-005` | `EV-WORK-FORMAL-*`;`EV-WORK-DEP-005` | `reports/runs/<run_id>/evidence-index.md` |
| Command / promote | `RequestWorkPromotion`、`ReviewWorkPromotion` | `TC-WORK-PROMOTE-*` | `EV-WORK-PROMOTE-*` | `reports/runs/<run_id>/evidence-index.md` |
| Command / dependency | `LinkWorkDependency`、`UpdateWorkDependencyState`、`OpenWorkBlocker`、`ResolveWorkBlocker` | `TC-WORK-DEP-*` | `EV-WORK-DEP-*` | `reports/runs/<run_id>/evidence-index.md` |
| Command / iteration | `OpenIteration`、`CommitIterationScope`、`UpdateIterationCommitment`、`UpdateIterationLifecycle` | `TC-WORK-ITER-*` | `EV-WORK-ITER-*` | `reports/runs/<run_id>/evidence-index.md` |
| Query | 8 Query | `TC-WORK-QUERY-001`~`008` | `EV-WORK-QUERY-001`~`008` | `reports/runs/<run_id>/evidence-index.md` |
| Inbound Consumer | 7 Consumer | `MEMBER` / `FORMAL` / `PROMOTE` / `DEP` / `ITER` / `QUERY` 相关用例 | 同族 `EV-WORK-*` | `reports/runs/<run_id>/evidence-index.md` |
| Outbound Event | 10 Event | `CORE` / `MEMBER` / `FORMAL` / `PROMOTE` / `DEP` / `ITER` / `OPS` 相关用例 | 同族 `EV-WORK-*` + `EV-WORK-OPS-001` | `reports/runs/<run_id>/evidence-index.md` |
| Operations Job | 6 Job | `TC-WORK-OPS-001`~`006` | `EV-WORK-OPS-001`~`006` | `reports/runs/<run_id>/evidence-index.md` |

### 7.8 接口证据图

#### 接口证据图: Protocol / Dependency / Evidence

```text
Protocol surface
  -> 18 Command
  -> 8 Query
  -> 7 Inbound Consumer
  -> 9 Outbound Event
  -> 6 Operations Job
        |
        v
Evidence
  -> TC-WORK-* / EV-WORK-*
  -> artifacts/test/<run_id>/...
  -> reports/runs/<run_id>/evidence-index.md

Cross-repo dependency
  -> [compile] core-contracts only
  -> [runtime] resolver / adapter / handoff seam
  -> [event] envelope / dedup / outbox / replay
```

关键说明:

- P0 接口验收必须覆盖每个正式入口名。
- 下游未就绪时验接缝和证据,不验下游完整业务完成。
- 任一非 core sibling 仓进入 package dependency,即进入 Step 11 一票否决候选。

## 8. 验收输入影响判定

| 验收结论 | 是否影响上游设计 / 测试 | 影响类型 | 回写位置 | 处理状态 |
|---|---|---|---|---|
| 确认 18 Command、8 Query、7 Consumer、10 Event、6 Job 均进入接口 / 事件 / 同步验收门禁 | 否 | 协议验收承接 | 无 | 无回写 |
| 确认跨仓验收按 `[compile]` / `[runtime]` / `[event]` / handoff 区分证据 | 否 | 依赖裁剪承接 | 无 | 无回写 |
| 确认下游未就绪时使用 fake / replay / event dump / handoff report 验接缝 | 否 | 验收范围裁剪 | 无 | 无回写 |
| 确认本步不新增协议字段、topic、job schema 或测试用例 | 否 | 文档边界 | 无 | 无回写 |

说明:

```text
本步没有改变需求、设计或测试方案。
本步只把已确认的协议入口、依赖类型和测试证据转成可裁决验收门禁。
```

## 9. 回填草稿

正式 `06-验收标准.md` §7 建议采用以下结构:

```text
7. 接口、事件与跨仓同步验收
  7.1 Command 接口验收
  7.2 Query 接口验收
  7.3 Inbound Event Consumer 验收
  7.4 Outbound Event 可消费 / 可重放验收
  7.5 Operations Job 幂等与恢复验收
  7.6 跨仓依赖类型与同步证据
```

正文草稿:

```text
本章用于裁决 `L1-work` 的 public protocol、event 协作、operations job 和跨仓同步接缝是否成立。验收必须覆盖 `03-详细设计.md` §7 固定的 18 个 Command、8 个 Query、7 个 Inbound Event Consumer、10 个 Outbound Event 和 6 个 Operations Job。

接口、事件与 job 验收不得使用详细设计未定义的字段、状态、topic 或 job schema。跨仓协作必须按依赖类型选择证据:编译期依赖只允许 `core-contracts`;运行期依赖验 resolver / adapter / handoff 接缝;事件协作依赖验 envelope、dedup、publish、failure、replay 和 projection 证据。下游未就绪时,本章只裁决接缝和证据,不要求下游仓完整实现。
```

## 10. 待确认事项

无阻塞进入 Step 8 的待确认事项。

后续 Step 必须继续收口:

- Step 8 将状态机、事务、UoW、idempotency、outbox 和 consistency 失败口径转成验收门禁。
- Step 10 将 event / job / handoff 的 audit、safe log、redaction 和 evidence index 完整性转成证据门禁。
- Step 11 将协议漏项、非 core compile dependency、event 正文泄露和 query / job 反写纳入一票否决裁决。

## 11. 进入下一步条件

- [x] 每个 P0 Command / Query 都有验收口径。
- [x] 每个 P0 Event 都有可消费 / 可重放证据口径。
- [x] 每个 P0 Job 都有幂等和恢复验收口径。
- [x] 跨仓同步成功标准已经定义。
- [x] 下游未就绪时的接缝验收方式已经定义。
- [x] 依赖类型和证据方式已经区分。
- [x] 每个验收项均回指正式协议名和测试证据。
- [x] 用户审核并确认本 Step。
