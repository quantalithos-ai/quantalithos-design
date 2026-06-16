# Step 12. 错误模型、异常分支与恢复口径

> 对应正式文档章节: `03-详细设计.md` 第 11 章 错误模型、异常分支与恢复口径
> 当前状态: Step 12 error / recovery 已完成;12.0~12.5 均已写入;等待用户审核后进入 Step 13 concurrency / idempotency
> 本文件性质: 详细设计 Step 12 中间产物,不是正式 `03-详细设计.md`
> 执行纪律: 本 Step 只在当前批次写当前批次内容;不得提前生成后续 Step 文件;不得直接修改正式 `03-详细设计.md`

---

## 1. 12.0 framework / input boundary / batch plan

### 1.1 当前批次状态

| 项 | 状态 |
|---|---|
| 当前 Step | Step 12 error / recovery |
| 当前批次 | 12.0 framework / input boundary / batch plan |
| 当前结论 | 已建立 Step 12 目标、输入边界、SOP 初答、错误建模红线、分批计划和 Step 11 handoff 承接表 |
| 本批是否定义最终错误 enum / public mapping | 否。本批只搭框架;具体错误类型、映射、异常分支和恢复口径从 12.1 起逐批展开 |
| 下一批 | 12.1 error layering and type taxonomy |
| 停审要求 | 用户审核通过 12.0 后进入 12.1;若审核发现需要新增 object、port、DTO、state、store 或 replay surface,先回 Step 6~11 闭口 |

### 1.2 Step 12 总体目标

Step 12 的目标是把 Step 6 的对象错误、Step 7 的 port failure、Step 8 的 protocol rejection / receipt / report surface、Step 9 的异常分支、Step 10 的非法状态迁移和 Step 11 的事务一致性失败收束成可实现的错误模型。

实现侧必须能从本 Step 判断:

- 错误属于 domain、application、port、API entry、worker entry、jobs entry 还是 infra adapter。
- 错误对 command、query、inbound event、callback、outbox publish、handoff delivery、operations job 分别如何映射。
- 错误是否可重试、不可重试、需要人工介入或只能作为 degraded / not-visible / delayed surface 暴露。
- 事务失败、version conflict、unique conflict、duplicate replay、stored result missing、外部依赖不可用、forbidden body persistence attempt 应如何处理。
- 哪些异常可以写 stored rejected generic shell、typed command rejected envelope、typed receipt、job report、marker / issue / audit / trace,哪些异常必须停在 entry pre-dispatch,不得写入 application store。

本 Step 不定义 HTTP status 数字、RPC code 数字、具体 retry/backoff 参数、broker ack/dead-letter 绑定、配置项名称、日志/指标字段、测试用例 ID 或实施 commit boundary。这些分别由 Step 13~16、配置设计和实施计划承接。

### 1.3 本步输入

| 输入 | 当前状态 | 本 Step 用途 |
|---|---|---|
| `03_ddd_step_06_object_contracts.md` | 已完成并已审核通过 | 提供 object / state / policy / factory / helper 的错误来源、body-free 边界和字段闭环 |
| `03_ddd_step_07_trait_port_adapter_contracts.md` | 已完成并已审核通过 | 提供 repository、resolver、publisher、handoff、UoW、idempotency、stored result、entry facade 和 fake/durable failure surface |
| `03_ddd_step_08_protocol_contracts.md` | 已完成并已审核通过 | 提供 command/query/event/callback/job 的 public rejection、receipt、report、disposition 和 replay surface |
| `03_ddd_step_09_function_flows.md` | 已完成并已审核通过 | 提供逐接口异常分支、rollback 点、duplicate replay、query no-write、job no-repair 和 side-effect 隔离规则 |
| `03_ddd_step_10_state_matrix.md` | 已完成;等待用户审核后已进入 Step 11/12 | 提供非法状态迁移占位、terminal / retryable / failed / degraded / entry 状态边界 |
| `03_ddd_step_11_persistence_transaction_consistency.md` | 已完成;等待用户审核后进入 Step 12 | 提供 logical store、transaction boundary、optimistic conflict、stored replay missing、commit unknown 和 fake/durable parity handoff |
| `standards/document/详细设计讨论流程_SOP.md` Step 12 | 当前标准 | 规定错误类型表、错误映射表、异常分支处理表和恢复口径表 |
| `standards/document/设计真相源闭环与可落码性标准.md` | 当前标准 | 约束错误模型不得私补 schema/port/state,不得用错误映射掩盖字段来源或 replay surface 缺口 |
| `projects/L1-governance/design-calibration/03_ddd_step_12_error_recovery.md` | 粒度参考 | 只参考组织方式和表格粒度,不复制 governance 业务错误内容 |

### 1.4 SOP 问题初答

| SOP 问题 | 12.0 初答 |
|---|---|
| 每个模块有哪些错误类型 | 12.1 展开。初步分层为 domain invariant / transition error、application orchestration error、port failure、protocol rejection / query surface、worker disposition、job run / item issue、infra runtime assembly failure。 |
| 哪些错误映射到 HTTP / RPC / Event 失败 | 12.2 展开。Step 12 只定义 public error family / disposition,不定义具体 HTTP/RPC 数字;query not-visible / degraded 不等同普通 command error。 |
| 哪些错误可重试、不可重试、需要人工介入 | 12.1~12.4 展开。version conflict、temporary dependency unavailable、in-flight duplicate 通常可重试;invalid request、domain rejected、forbidden body、same key different digest 不可原样重试;stored replay missing、commit unknown、consistency defect、forbidden persisted body 需要人工或运维介入。 |
| 事务失败、并发冲突、重复请求、外部依赖失败如何处理 | 12.3~12.4 展开。事务内失败 rollback;duplicate same digest 只读 stored result/receipt/report;different digest 返回 conflict;external temporary failure 进入 delayed/degraded/failed marker/report,不得反写真相。 |
| 哪些异常需要写审计、日志或事件 | 12.4 展开。accepted truth / marker / job report 按 Step 9/11 写入;entry pre-dispatch、not-visible query、invalid envelope、unsupported schema、forbidden body persistence attempt 不写 accepted trace/outbox。日志、指标和安全审计字段留 Step 15。 |

### 1.5 当前材料诊断

| 材料 / 倾向 | 风险 | Step 12 处理 |
|---|---|---|
| Step 10 用 `IdentityDomainError::InvalidStateTransition` / `ApplicationError::InvalidStateTransition` 作为占位 | 占位不能直接变成最终 public error;否则 retryability 和 protocol family 会漂移 | 12.1 先定义错误层级,12.2 再按 command/query/event/job 映射 |
| Step 11 明确 duplicate replay 不重跑 mutation/job | 若 stored result/receipt/report missing 时临时重建,会破坏 replay 真相源 | 12.3 定义 replay missing / wrong-kind 为独立错误与人工恢复口径 |
| Query no-write 已在 Step 9/11 固定 | 若 query missing/stale 时自动 rebuild/refresh,会违反事务边界 | 12.2/12.4 固定 query surface priority: not-visible、missing、degraded、empty、stale-visible 都不写修复 |
| Consumer/callback/job 存在 delayed、quarantined、noop、partial failed 等 public surface | 若统一写成 rejected,会丢失可重试和 receipt/report replay 语义 | 12.2/12.3 按协议族区分 worker receipt、callback receipt 和 job report issue |
| Outbox/handoff failure 不回滚 accepted truth | 若把 publish/deliver failure 映射成 command accepted rollback,会破坏 Step 11 side-effect 隔离 | 12.4 固定 marker/report-only recovery |
| Forbidden body boundary 横跨 resolver、consumer、handoff、repository | 若错误处理只 redaction 不 reject/quarantine,可能把 raw body 留在 fake/durable | 12.1/12.4 定义 forbidden body persistence attempt 的安全错误和恢复口径 |

### 1.6 设计取舍

| 方案 | 结论 | 理由 |
|---|---|---|
| 一次性写完整错误全集 | 不采用 | Step 12 横跨 command/query/event/job/entry/infra,一次写完容易把 protocol mapping、recovery 和 Step 13 幂等优先级混在一起 |
| 只写通用 `InternalError` / `ValidationError` | 不采用 | SOP 要求能回指模块、协议或处理流,且必须区分 retryable / non-retryable / manual |
| 按 error enum 文件组织 | 不采用为主轴 | 当前是设计校准文档,应先按错误层级和 flow family 闭环;最终文件归属留 Step 17 / implementation plan |
| 先搭 12.0 框架,再分批写 12.1~12.5 | 采用 | 与 identity Step 10/11 和 governance Step 12 粒度一致,便于逐批停审 |
| 在 Step 12 新增 stored result kind / receipt field / repository method 补缺口 | 不采用 | Step 12 只能映射已有 truth source;发现 surface 缺失必须回 Step 6~11 |
| 在 Step 12 定义具体 HTTP status / backoff 参数 | 不采用 | 这些属于 adapter/config/runtime/test 绑定,分别由 Step 14~16 承接 |

### 1.7 Step 12 分批计划

| 批次 | 主题 | 输出 | 停审重点 | 状态 |
|---|---|---|---|---|
| 12.0 | framework / input boundary / batch plan | Step 12 目标、输入、SOP 初答、诊断、红线、分批计划、Step 11 handoff 承接 | 是否不提前定义错误全集;是否承接 Step 11 7.6.3 | 已完成 |
| 12.1 | error layering and type taxonomy | domain/application/port/protocol/worker/job/infra 错误类型表,含 retryability 和 owner | 错误类型是否回指 Step 6/7/10/11;是否没有新增 schema | 已完成 |
| 12.2 | public mapping by protocol family | command、query、consumer、callback、publisher、handoff、job、entry 的对外映射表 | query surface priority;worker/job disposition;entry pre-dispatch no-store | 已完成 |
| 12.3 | exception branches by flow family | Step 9 flow family 的异常分支处理表,含检测位置、rollback、stored replay、receipt/report | duplicate no-rerun;version/unique conflict;commit unknown | 已完成 |
| 12.4 | recovery / audit / marker rules | retryable / terminal / manual recovery 表,以及 trace/audit/outbox/handoff/report 写入规则 | recovery 不反写真相;forbidden body 不落盘;side-effect failure 隔离 | 已完成 |
| 12.5 | cross-step closure / Step 13 handoff | Step 6~11 闭环审计、open item closure、Step 13~16 handoff、回填草稿 | 是否足够实现错误处理代码;是否无 unresolved blocker | 已写入,待审核 |

### 1.8 Step 12 写入红线

| 红线 | 禁止做法 | 正确处理 |
|---|---|---|
| 不私补 schema | 为错误映射新增 stored result kind、receipt field、job report field、issue marker、DTO 字段 | 暂停并回 Step 6/8/11 闭口 |
| 不私补 port | 为恢复路径新增 repository read/write、resolver outcome、publisher classification、handoff callback lookup | 暂停并回 Step 7/9/11 闭口 |
| 不私补状态 | 为 retry/dead-letter/manual recovery 新增 state variant 或 transition helper | 暂停并回 Step 6/10 闭口 |
| 不把 query 变写入 | query degraded/missing/stale 时写 projection/reference repair、stored result 或 audit success | 返回 query surface;修复由 job/maintenance flow 承接 |
| 不重跑 duplicate | stored replay missing 时重跑 command、consumer、callback 或 job body | 返回 replay consistency error;人工恢复 |
| 不保存 forbidden body | 为排错把 raw request/event/source/receipt/archive/config/log body 保存到 fake/durable | reject/quarantine/strip,并写 body-free issue marker if flow allows |
| 不混淆 entry 与 application outcome | API/worker/job entry valid 或 dispatch target found 被当成 accepted command/receipt/report | entry pre-dispatch failure 不写 application store;application accepted 只能来自 facade result |
| 不用错误字符串判定业务状态 | 从 adapter error message、ref 字符串、fake 私有 map 推断 invalid/unavailable/permanent | 必须使用 Step 7/8 已定义的 typed outcome 或正式 failure classification |

### 1.9 Step 11 handoff 承接表

| Step 11 handoff item | 12.x 承接位置 | 本 Step 处理方向 |
|---|---|---|
| invalid domain transition | 12.1 / 12.2 | 定义 domain/application 错误类型、protocol mapping 和 retryability |
| version conflict | 12.1 / 12.3 | 定义 optimistic conflict public surface 和 retry guidance,不覆盖 stale version |
| unique conflict | 12.1 / 12.3 | 区分 duplicate replay、formal unique conflict、no-op 和 domain rejected |
| stored result missing / wrong kind | 12.1 / 12.3 / 12.4 | 定义 replay consistency error,不得 rerun 或从 current truth 重构 |
| same idempotency key different digest | 12.1 / 12.2 / 12.3 | 定义 command/API/worker/job conflict surface,原 result authoritative |
| repository unavailable / commit unknown | 12.1 / 12.3 / 12.4 | 定义 dependency unavailable、commit unknown 和 idempotency-check recovery |
| query not-visible/missing/degraded/empty/stale-visible | 12.2 / 12.4 | 定义 query surface priority、redaction 和 no-write recovery |
| source/basis/reference unavailable or invalid | 12.1 / 12.2 / 12.4 | 按 command/consumer/job 区分 rejected、dependency unavailable、delayed、quarantined、failed marker |
| consumer unsupported/forbidden/quarantined/delayed/noop | 12.2 / 12.3 | 定义 worker receipt disposition 与 replay surface |
| callback missing target / invalid receipt | 12.2 / 12.3 / 12.4 | 定义 callback rejected/failure receipt;no delivered without formal attempt + receipt |
| publisher / handoff adapter failure | 12.2 / 12.4 | 定义 retryable/permanent/skipped/unsupported issue mapping;不回滚 accepted truth |
| projection/reference/report consistency defect | 12.1 / 12.2 / 12.4 | 定义 degraded/failed/manual recovery language;job/report only,不修 truth |
| entry pre-dispatch failure | 12.2 / 12.3 | 定义 no UoW / no stored result / no receipt / no job report 的 entry surface |
| forbidden body persistence attempt | 12.1 / 12.4 | 定义 security/rejection/quarantine/strip 规则和 fake/durable parity |

### 1.10 12.0 stop-review record

| 审查项 | 结论 | 说明 |
|---|---|---|
| 是否只写 12.0 范围 | 通过 | 本批只搭框架,未写最终错误 enum 或 protocol mapping 细则 |
| 是否承接 SOP Step 12 | 通过 | 已覆盖错误类型表、映射表、异常分支表、恢复口径表的后续批次 |
| 是否承接 Step 11 7.6.3 | 通过 | 已逐项映射到 12.1~12.4 |
| 是否修改正式 `03-详细设计.md` | 未修改 | 正式文档留 Step 19 装配 |
| 是否新增上游未定义 schema/port/state | 未新增 | 发现缺口时必须回 Step 6~11 |
| 是否提前定义 Step 13/14/15/16 内容 | 未提前 | retry priority、config/transport、observability、test ID 均只做 handoff |

---

## 2. 12.1 error layering and type taxonomy

### 2.1 当前批次状态

| 项 | 状态 |
|---|---|
| 当前批次 | 12.1 error layering and type taxonomy |
| 当前结论 | 已定义 contracts、domain、application、port、protocol、worker、job、entry、infra 九层错误 taxonomy,并标明 owner、触发来源、retryability 和 public surface 承接位置 |
| 本批是否定义完整协议映射 | 否。12.1 只定义内部分类和已有 public surface;command/query/event/job/entry 的逐场景映射留 12.2 |
| 本批是否新增 error enum / DTO / port / state | 否。只引用 Step 6~11 已出现的错误类型名、disposition、outcome、state kind 和 issue marker |
| 下一批 | 12.2 public mapping by protocol family |

### 2.2 错误层级总览

```text
contracts typed constructor / protocol DTO validation
  -> ContractError or IdentityProtocolRejection surface

domain factory / policy / transition guard
  -> IdentityDomainError

application service orchestration
  -> ApplicationError taxonomy class

application port / infra adapter / UoW / idempotency / stored replay
  -> ApplicationError taxonomy class or typed safe outcome

api / worker / jobs entry validation
  -> entry validation / dispatch surface, before application facade

protocol response / worker receipt / job report
  -> public surface defined in Step 8
```

| Layer | Owner | May create | Must not create |
|---|---|---|---|
| contracts constructor | `identity-contracts` | `ContractError`, `IdentityProtocolValidationIssueRef`, public rejection/query/receipt/job surface | domain transition, repository error, raw transport status |
| domain object / policy | `identity-domain` | `IdentityDomainError` from invariant, policy, forbidden transition or body-free guard | repository lookup, protocol response, outbox publish, audit entry |
| application service | `identity-application` | `ApplicationError` taxonomy class, accepted/rejected/query/receipt/job assembly decision | raw storage/adapter body, private fake recovery, direct transport ack |
| application port | `identity-application` trait + `identity-infra` implementation | typed port failure or typed safe outcome, mapped into application taxonomy | new business truth, hidden resolver lookup, body persistence |
| API entry | `identity-api` | API entry validation / dispatch failure before facade, or command/query public surface after facade | stored result on pre-dispatch failure, repository direct call |
| worker entry | `identity-worker` | worker entry validation / dispatch failure before facade, or consumer/callback receipt after facade | consumer receipt on pre-dispatch failure, payload hash dedupe fallback |
| jobs entry | `identity-jobs` | job entry validation / dispatch failure before facade, or job response/report after facade | job report on pre-dispatch failure, repository scan fallback |
| infra runtime | `identity-infra` | runtime assembly / adapter availability issue, `ApplicationError` from port calls | fake success for disabled/unavailable adapter, raw secret/log/body |

### 2.3 Contracts and protocol construction errors

| 错误类型 / surface | 所属模块 | 触发条件 | 是否可重试 | 对外承接 |
|---|---|---|---|---|
| `ContractError` | `identity-contracts` typed constructors | typed ref、timestamp、reason、basis、marker、page cursor 等 public value 构造输入非法或缺 required value | 否,调用方必须修正输入 | API/worker/job entry validation issue;command 可映射为 `IdentityProtocolRejectionKind::InvalidRequest` |
| `IdentityProtocolValidationIssueRef` / set | `identity-contracts::protocol` | entry/protocol validation 需要 body-free issue marker | 取决于 issue kind,12.2 分类 | 搭配 `IdentityProtocolRejection`、entry validation、consumer receipt issue、job report issue |
| `IdentityProtocolRejectionKind::InvalidRequest` | Step 8 public protocol | request/envelope/page/body marker 缺失、字段组合非法、route/body mismatch | 否 | command/API rejected surface;是否 stored 留 12.3/Step 13 |
| `IdentityProtocolRejectionKind::ForbiddenBody` | Step 8 public protocol | raw request/event/source/archive/receipt/config/log body 试图进入 identity surface 或 persisted material | 否;安全问题需要人工确认 | command/consumer/job rejected/quarantined surface;12.4 定义 persistence attempt recovery |
| `IdentityProtocolRejectionKind::UnsupportedVersion` | Step 8 public protocol | schema version 不受当前 contracts 支持 | 否,直到协议升级或 producer 降级 | command/API rejection or worker `UnsupportedVersion`;transport binding 留 Step 14 |
| `IdentityProtocolRejectionKind::Disabled` | Step 8 public protocol | entry/adapter/feature 被正式 disabled marker 阻止 | 否,直到配置变更 | API rejected/query disabled/job rejected;配置 owner 留 Step 14 |

### 2.4 Domain error taxonomy

`IdentityDomainError` 是 domain 层唯一错误 owner 名。12.1 不新增 Rust enum variant 全集,只把 Step 6/10 已出现的 guard 和状态矩阵错误归入可实现分类;最终代码可按这些 taxonomy class 命名,但不得脱离 Step 6 object/state/policy。

| 错误类别 | 所属模块 | 触发条件 | 是否可重试 | 对外承接 |
|---|---|---|---|---|
| Identity invariant violation | `identity-domain` object factory / method | member/source/reason/basis/evidence/trace/handoff/report 等必填字段缺失或组合不可能成立 | 否,除非调用方补齐输入 | application `InvalidRequest` / `PolicyDenied`;12.2 按协议族映射 |
| Invalid state transition | `identity-domain` state / policy | Step 10 矩阵未允许的 from->to、terminal state 再迁移、retryable/terminal 混用 | 否,需要重新读取状态或提交新合法操作 | command `Conflict` / `PolicyDenied`;consumer/job item failed;12.2 细化 |
| Policy denied | `identity-domain` policy | anchor reuse、query write guard、lifecycle explicit command guard、high-risk basis invalid、source untrusted、append-only violation、handoff receipt guard | 通常否;外部状态改变后可重新发起 | `IdentityProtocolRejectionKind::PolicyDenied` 或 worker/job rejected item |
| Required basis/source/evidence missing | `identity-domain` guard with Step 7 resolver input | high-risk lifecycle basis missing、role source/evidence/safe summary missing、work/memory source material missing | 取决于是否可由 resolver/producer 补齐 | rejected、quarantined、delayed 或 degraded;12.2 按 flow family 固定 |
| External dependency unavailable as domain input | `identity-domain` policy input state | resolver 已返回 typed unavailable/stale/unresolved summary,当前操作不能 accepted active truth | 是,在 dependency 恢复或 refresh 后 | command dependency unavailable,consumer delayed,job retryable failed,query degraded |
| Forbidden external body/material | `identity-domain` body-free policy | Project/Work/Memory/Archive/Governance/adapter raw body 或 unsafe diagnostic 被传给 truth/report/handoff | 否;安全/边界缺陷 | `ForbiddenBody`、quarantine、job failed/manual issue |
| Report-only repair violation | `identity-domain::reconciliation` / maintenance policy | projection/reference/reconciliation job 尝试修 core identity truth 或 external truth | 否,设计/实现错误 | job failed/manual consistency defect;不得自动 retry |

### 2.5 Application orchestration error taxonomy

`ApplicationError` 是 application / port failure 的内部统一 owner 名。Step 7 只固定各 port 返回 `ApplicationError`,没有给出完整 Rust enum variant;本表定义实现必须支持的 taxonomy class,后续若代码落成 enum,variant 必须保持这些分类的可判别性。

| 错误类别 | 所属模块 | 触发条件 | 是否可重试 | 对外承接 |
|---|---|---|---|---|
| Invalid application request | `identity-application` facade/service | facade 已被调用,但 operation context、request marker、scope、page、actor、idempotency key、typed input 仍不满足 application 前置条件 | 否 | command/job rejected,worker rejected/quarantined;pre-dispatch 同类错误仍属于 entry layer |
| Not found | `identity-application` service | command target truth、required source snapshot、handoff intent、outbox record、report 等 required owned object 不存在 | 通常否;async view/report missing 可走 degraded | command `NotFound`;query `Missing`;job failed item |
| Not visible / authorization denied | `identity-application::visibility` / policy | read actor/consumer 不能读取目标,或 command actor 不被授权 | 否 | query `NotVisible`;command `PolicyDenied`;不得用 empty/missing 掩盖 |
| Domain rejected | `identity-application` domain mapping | domain invariant / policy / invalid transition 返回 `IdentityDomainError` | 通常否 | `PolicyDenied` / `Conflict` / worker receipt rejected / job failed item |
| Optimistic version conflict | repository save/update through application | loaded `IdentityVersion` stale;expected_version mismatch | 是,重新读取后可重试 | command conflict,consumer delayed/conflict,job retryable or failed item;12.3 固定 |
| Formal unique conflict | repository create / unique lookup | member/source/summary/relation/outbox/result/report formal unique key 冲突 | 取决于是 duplicate 还是非法冲突 | duplicate/noop/conflict;12.3 定义优先级 |
| Idempotency conflict | idempotency reserve | same operation + channel + key 已存在且 digest 不同 | 否,必须换 key 或重放原请求 | `DuplicateConflict`;worker/job rejected;Step 13 定完整矩阵 |
| Idempotency in-flight | idempotency reserve | same operation + channel + key + digest 正在处理中且未 complete | 是,稍后重试 | delayed / temporarily unavailable surface;Step 13 定等待/过期 |
| Duplicate replay consistency defect | stored replay | idempotency completed/rejected-stored 但 stored result、typed receipt、job report missing 或 wrong kind | 否,人工介入 | replay consistency error;不得重跑 mutation/job |
| Dependency unavailable | application port / resolver / store | repository、resolver、publisher、handoff、runtime dependency temporary unavailable,且未形成 typed business outcome | 是 | adapter unavailable/degraded/delayed/retryable failed |
| Commit status unknown | UoW commit | commit 返回 unknown,可能已写也可能未写 | 不可盲重试;先按 idempotency/stored result 检查 | temporarily unavailable/manual reconciliation;12.4 recovery |
| Consistency defect | application invariant / store | projection index corrupt、reference sidecar missing、forbidden body persisted、payload marker missing、cursor/version/key 混用 | 否,人工/运维介入 | degraded/job failed/manual issue;不得 silent success |

### 2.6 Port and adapter failure taxonomy

| 错误类别 / outcome | 所属模块 | 触发条件 | 是否可重试 | 对外承接 |
|---|---|---|---|---|
| Repository typed missing | repository ports | `get_*` / lookup 返回 `None` 或 required sidecar missing | 取决于 caller | query missing/degraded;command not found;job failed item |
| Repository version conflict | repository save/update ports | `expected_version` 与 stored version 不一致 | 是 after reload | application optimistic conflict |
| Repository unique conflict | repository create/save ports | formal PK/unique key 冲突 | 取决于 idempotency/duplicate/source-noop 分类 | duplicate/conflict/noop;12.3 固定 |
| Repository unavailable | repository/UoW port | durable/fake store unavailable 或 transaction begin 失败 | 是 | dependency unavailable / delayed / retryable failed |
| Repository serialization/body boundary failure | repository adapter | stored surface 无法序列化、反序列化或发现 forbidden body | 否,人工介入 | consistency defect / forbidden body recovery |
| `IdempotencyReserveOutcome::ReplayAvailable` | Step 7 idempotency repo | same operation/channel/key/digest completed and has stored result ref | 不需要重试 | duplicate replay path,不得重跑 mutation |
| `IdempotencyReserveOutcome::Conflict` | Step 7 idempotency repo | same key different digest | 否 | duplicate conflict |
| `IdempotencyReserveOutcome::InFlight` | Step 7 idempotency repo | same key/digest reserved but not completed | 是 | delayed / retry later |
| Resolver invalid/unrecognized typed outcome | external resolver ports | resolver 成功返回 body-free invalid/unrecognized/untrusted summary | 否,除非 source 修正 | policy denied / quarantine / failed reference |
| Resolver unavailable typed outcome | external resolver ports | resolver 成功返回 unavailable/stale/unresolved summary | 是 | dependency unavailable / delayed / degraded / retryable failed |
| Resolver call failure as `ApplicationError` | external resolver ports | adapter wiring、runtime、timeout、store、serialization 失败,未形成 business outcome | 是或人工,按 class | application dependency unavailable or consistency defect;不得从 error string 推断 state |
| `OutboxPublishOutcome::Published` | publisher port | publisher accepted body-free outbox payload marker | 不适用 | outbox `Published`;不代表 downstream consumed |
| `OutboxPublishOutcome::RetryableFailed` | publisher port | publisher failure classified retryable with safe issue | 是 | outbox `RetryableFailed`;job retryable/partial |
| `OutboxPublishOutcome::PermanentlyFailed` / `UnsupportedTopic` | publisher port | permanent publish failure or unsupported topic binding | 否,直到 design/config/source 修正 | outbox `Failed`;manual issue |
| `OutboxPublishOutcome::SkippedByPolicy` | publisher/outbound policy | policy skip with safe issue | 否,除非新 operation | outbox `SkippedByPolicy`;not silent delete |
| `HandoffDeliveryOutcome::Delivered` | handoff port | delivery completed with formal attempt and receipt marker | 不适用 | handoff `Delivered`;不代表 raw receipt persisted |
| `HandoffDeliveryOutcome::RetryableFailed` | handoff port | delivery attempt failed retryably with issue marker | 是 | handoff `RetryableFailed`;job retryable/partial |
| `HandoffDeliveryOutcome::PermanentlyFailed` | handoff port | delivery attempt failed permanently with issue marker | 否,直到 target/config 修正 | handoff `Failed`;manual issue |
| `HandoffDeliveryOutcome::CancelledByPolicy` / `UnsupportedTarget` | handoff target/policy | no delivery attempt or target unsupported;safe issue present | 否,除非 new operation/config | handoff `Cancelled`;not failed without attempt |

### 2.7 Public protocol surface taxonomy

| Surface | 所属模块 | 触发条件 | 是否可重试 | 12.2 映射范围 |
|---|---|---|---|---|
| `IdentityCommandOutcome::Accepted` | contracts / API | application command accepted and committed stored result/effect | 不适用 | command accepted response |
| `IdentityCommandOutcome::Rejected` + `IdentityProtocolRejection` | contracts / API | application-level command rejection or replayable rejected surface | 取决于 rejection kind | command rejected mapping and stored rejected scope |
| `IdentityQueryDisposition::Visible` / `Redacted` | contracts / query | visibility allowed;redaction may hide fields | 不适用 | query success/redaction surface |
| `IdentityQueryDisposition::NotVisible` | contracts / query | visibility denied | 否 | not-visible priority;body/items empty |
| `IdentityQueryDisposition::Degraded` / `StaleVisible` / `Rebuilding` | contracts / query | dependency/view/reference/report incomplete,stale or rebuilding | 通常稍后可读;query 不重试写 | degraded/stale-visible priority |
| `IdentityQueryDisposition::Empty` / `Missing` | contracts / query | true empty set or target/lookup missing | 通常否 | empty vs missing vs not-visible priority |
| `IdentityQueryDisposition::Disabled` | contracts / query | feature/entry/adapter disabled | 否直到配置变更 | disabled query surface |
| `IdentityConsumerOutcome::Accepted` | contracts / worker | application consumer/callback accepted and saved typed receipt | 不适用 | worker receipt accepted |
| `IdentityConsumerOutcome::DuplicateReplayed` | contracts / worker | stored typed receipt replayed | 不适用 | duplicate no-rerun |
| `IdentityConsumerOutcome::Rejected` | contracts / worker | application-level event/callback rejected | 否 | rejected receipt/dead-letter mapping |
| `IdentityConsumerOutcome::Quarantined` | contracts / worker | unsafe/manual-review source,forbidden material or untrusted relation requiring operator decision | 否 until manual action | quarantine receipt |
| `IdentityConsumerOutcome::DelayedRetry` | contracts / worker | transient dependency/version/in-flight condition | 是 | retryable worker receipt;transport retry binding later |
| `IdentityConsumerOutcome::Noop` | contracts / worker | source duplicate or already reflected marker with no new mutation | 不适用 | stored noop receipt |
| `IdentityConsumerOutcome::UnsupportedVersion` | contracts / worker | schema version unsupported | 否 until producer/consumer upgrade | unsupported receipt/dead-letter binding |
| `IdentityJobResultKind::Succeeded` / `Partial` / `Failed` / `Noop` / `RetryableFailed` | contracts/domain application helper | job service completed report assembly with result kind and item refs | retry only for retryable class | job report/result mapping |
| `DuplicateReplayed` job disposition | contracts job response surface | stored job report replayed | 不适用 | wrapper disposition;not report state |
| `Rejected` job disposition | contracts job response surface | job request/application rejected | 否 unless caller fixes request | rejected job mapping;stored rejected scope later |

### 2.8 Entry, runtime and dispatch failure taxonomy

| 错误类别 / state | 所属模块 | 触发条件 | 是否可重试 | 对外承接 |
|---|---|---|---|---|
| API `RejectedAtEntry` | API entry validation | route/request marker/actor/metadata/page/idempotency validation failed before facade | 否,caller fixes request | API entry failure;no UoW/no stored command result |
| API `NotRoutable` | API route catalog | route missing,disabled or surface mismatch before facade | 否 until route/config fixed | API entry failure;no application rejection |
| API `RuntimeUnavailable` | API runtime precheck | runtime failed/not assembled/required adapter disabled before dispatch | 是 or config fix | API entry runtime failure;no stored result |
| Worker `UnrecognizedBinding` | worker entry validation | event binding not in formal catalog | 否 until binding/config update | worker entry failure;no consumer receipt unless application reached |
| Worker `MissingDedupeKey` | worker entry validation | dedupe key absent before facade | 否 for same event;producer/config fix | worker entry failure;no payload hash fallback |
| Worker `InvalidEnvelopeMarker` | worker entry validation | envelope marker invalid/unsafe before facade | 否 | worker entry failure;body not persisted |
| Worker `RuntimeUnavailable` | worker runtime precheck | runtime not dispatchable before facade | 是 | worker entry runtime failure;no business receipt |
| Job `UnknownJob` | jobs entry validation | job name absent from formal catalog | 否 until config/bin fixed | job entry failure;no job report |
| Job `InvalidScope` / `InvalidCursor` | jobs entry validation | job scope/cursor marker invalid before facade | 否,caller fixes input | job entry failure;no scan fallback/no report |
| Job `MissingIdempotencyKey` | jobs entry validation | job idempotency key absent before facade | 否,caller fixes input | job entry failure;no stored job report |
| `IdentityEntryDispatchKind::SkippedRejectedAtEntry` | shared entry dispatch | entry validation failed;facade not called | 不适用 | no application store writes |
| `IdentityEntryDispatchKind::SkippedRuntimeUnavailable` | shared entry dispatch | runtime unavailable;facade not called | 是 after runtime recovery | no application store writes |
| `IdentityEntryDispatchKind::FailedBeforeApplication` | shared entry dispatch | dispatch target catalog/guard failed before facade | 通常人工/config | no direct repository/adapter fallback |
| Runtime assembly `Failed` / `Degraded` | infra runtime | config/port/adapter wiring missing,invalid,or degraded | failed needs config fix;degraded may run limited flows | entry/runtime issue surface;not business accepted |
| Adapter availability `Unavailable` / `Disabled` / `Degraded` | infra adapter availability | adapter health/mode prevents or limits attempt | unavailable retry;disabled config fix | dependency unavailable/disabled/degraded;no fake success |

### 2.9 Retryability classes

| Retryability class | Meaning | Examples | 禁止事项 |
|---|---|---|---|
| NonRetryableInput | Same request/event/job will fail until caller changes input or schema | invalid request、forbidden body、unsupported version、missing required idempotency key、invalid scope/cursor | automatic retry loop with same payload |
| NonRetryablePolicy | Business/domain policy denies operation under current truth | anchor reuse、invalid lifecycle transition、invalid basis for action、untrusted source、append-only violation | storing as retryable dependency failure |
| RetryAfterReload | local stale read/conflict may succeed after reload | optimistic version conflict、formal in-flight idempotency same digest | overwrite current value or rerun duplicate mutation |
| RetryAfterDependencyRecovery | temporary external/store/adapter unavailability may succeed later | resolver unavailable、repository unavailable、publisher retryable failed、handoff retryable failed、runtime degraded/unavailable | marking permanent failed without safe issue |
| ReplayOnly | duplicate path must only read stored surface | idempotency replay available、stored consumer receipt/job report replay | recompute from current truth/store scan |
| ManualRecovery | data/design/runtime consistency requires operator intervention | stored result missing/wrong-kind、commit unknown after failed idempotency check、forbidden persisted body、projection index corrupt | silent degraded success or auto repair from query |
| NotApplicable | success/noop/visibility surface does not need retry | query visible/not-visible,consumer noop,job noop,outbox published,handoff delivered | treating visibility/noop as failure |

### 2.10 12.1 stop-review record

| 审查项 | 结论 | 说明 |
|---|---|---|
| 是否只写 12.1 范围 | 通过 | 只定义错误层级和 taxonomy,未写完整 command/query/event/job 映射表 |
| 是否引用已有 truth source | 通过 | 只使用 Step 6~11 已出现的 `ContractError`、`IdentityDomainError`、`ApplicationError`、Step 8 public surface、Step 10 entry/runtime states 和 Step 7 outcomes |
| 是否新增 schema/port/state | 未新增 | `ApplicationError` 只作为 taxonomy class,不新增具体 Rust enum variant |
| 是否区分 retryability | 通过 | §2.9 固定 non-retryable、retry after reload、retry after dependency、replay-only、manual recovery |
| 是否保持 query no-write / duplicate no-rerun | 通过 | query surface 与 replay consistency defect 均明确不得触发修复或重跑 |
| 是否可以进入 12.2 | 可以 | 下一批按协议族把 taxonomy 映射到 public surface |

---

## 3. 12.2 public mapping by protocol family

### 3.1 当前批次状态

| 项 | 状态 |
|---|---|
| 当前批次 | 12.2 public mapping by protocol family |
| 当前结论 | 已把 12.1 taxonomy 映射到 command、query、consumer/callback、outbox/handoff、job、entry 的 Step 8/10 public surface |
| 本批是否新增 public disposition / DTO 字段 | 否。只使用 `IdentityCommandOutcome`、`IdentityProtocolRejectionKind`、`IdentityQueryDisposition`、`IdentityConsumerOutcome`、`IdentityJobRunDisposition`、`IdentityJobResultKind` 和 Step 10 entry validation/dispatch state |
| 本批是否定义 Step 13 幂等优先级 | 否。same key/different digest、in-flight、rejected result 是否 stored、expiry 等仅映射 surface,完整优先级留 Step 13 |
| 下一批 | 12.3 exception branches by flow family |

### 3.2 Mapping principles

| 原则 | 正式口径 |
|---|---|
| Entry first | API / worker / jobs entry pre-dispatch failure 只返回 entry surface;不得写 stored result、consumer receipt、job report、truth、trace、outbox |
| Application outcome only after facade | 只有 application facade 被调用并返回结果后,才可产生 command rejection、query surface、consumer receipt 或 job report |
| Query is not command error | query not-visible / missing / degraded / stale / empty 使用 `IdentityQuerySurface`,不使用 `IdentityProtocolRejection` |
| Accepted-only effect | command accepted 才有 `IdentityCommandEffectPublicSummary.accepted_cursor_ref`、trace/outbox/stale refs;rejected/entry failure 不生成 accepted effect |
| Stored rejected is limited | `IdentityCommandOutcome::Rejected` 不自动意味着 stored rejected generic shell 或 typed command rejected envelope;可 replay rejected 范围由 12.3/Step 13 固定 |
| Worker receipt is application-level | `IdentityConsumerReceipt` 只在 consumer/callback application flow reached 后生成;worker entry failure 不伪造成 `Rejected` receipt |
| Job report is application-level | `IdentityJobRunReport` / `IdentityJobReportSurface` 只由 application job service 生成;job entry failure 不保存 failed report |
| Propagation failure is marker/report only | publisher/handoff failure 不回滚 accepted truth;只映射 outbox/handoff state、safe issue、job report/result |
| Body-free issue | 所有 rejection、degraded、receipt、job issue 只带 safe refs/markers,不得带 raw request/event/source/adapter/receipt/log body |

### 3.3 Command mapping

Command public surface 只能是 `IdentityCommandOutcome::Accepted(IdentityCommandResponse<T>)` 或 `IdentityCommandOutcome::Rejected(IdentityProtocolRejection)`。Entry pre-dispatch failure 不进入本表,见 §3.9。

| Error taxonomy / condition | Public surface | Rejection kind / fields | Retryability | Stored/effect rule |
|---|---|---|---|---|
| fresh command accepted and committed | `Accepted(response)` | response has `result_ref`, typed result, accepted effect summary | NotApplicable | save accepted stored result/effect;trace/audit/outbox/stale per Step 9/11 |
| duplicate same key/digest with stored accepted command envelope | `Accepted(response)` replay | same typed result/effect from `IdentityCommandAcceptedResultEnvelope` | ReplayOnly | load generic stored shell + `IdentityCommandAcceptedResultEnvelope`;no mutation/no new trace/outbox |
| request/DTO/marker invalid after application reached | `Rejected(rejection)` | `InvalidRequest` with issue refs | NonRetryableInput | no truth/effect;stored rejected only if 12.3/Step 13 says replayable |
| forbidden body detected in request/material | `Rejected(rejection)` | `ForbiddenBody` with safe issue refs | NonRetryableInput / ManualRecovery if persisted | no truth/effect;must not persist body |
| command actor/policy/domain guard denied | `Rejected(rejection)` | `PolicyDenied` unless conflict-specific mapping applies | NonRetryablePolicy | no accepted effect;replayable rejected scope later |
| command target truth missing | `Rejected(rejection)` | `NotFound` | NonRetryableInput | no create unless command is formal create flow |
| invalid domain transition / terminal state conflict | `Rejected(rejection)` | `Conflict` or `PolicyDenied`;use `Conflict` when current stored state is the blocker | RetryAfterReload or NonRetryablePolicy depending matrix row | rollback;no accepted effect |
| optimistic version conflict | `Rejected(rejection)` | `Conflict` | RetryAfterReload | rollback;caller reloads |
| same idempotency key different digest | `Rejected(rejection)` | `DuplicateConflict` | NonRetryableInput | original record/result authoritative;no mutation |
| unsupported command schema version after application reached | `Rejected(rejection)` | `UnsupportedVersion` | NonRetryableInput until upgrade | no mutation |
| required resolver/source/basis temporary unavailable | `Rejected(rejection)` | `AdapterUnavailable` with optional degraded marker | RetryAfterDependencyRecovery | no accepted active truth |
| feature/adapter disabled before application-level command decision | `Rejected(rejection)` only if facade reached;otherwise entry surface | `Disabled` | NonRetryableInput until config change | no accepted effect |
| stored result missing on duplicate replay | no successful command outcome;surface is replay consistency failure in 12.3 | not mapped as fresh `Rejected` unless Step 13 defines replayable error shell | ManualRecovery | do not rerun command |
| commit status unknown | no accepted success reported unless stored accepted generic shell + typed command envelope are later found | `AdapterUnavailable`/temporary failure shell in 12.3/12.4 | ManualRecovery / idempotency check | do not claim accepted without stored result and typed envelope |

### 3.4 Query mapping and priority

Query public surface uses `IdentityQueryResponse<T>` / `IdentityPageResponse<T>` with `IdentityQuerySurface`. Query never opens a write UoW, never writes stored result, never repairs projection/reference/audit/report/outbox/handoff.

Priority rule for a single target:

```text
entry pre-dispatch failure
  > Disabled
  > NotVisible
  > Degraded caused by visibility dependency missing/unavailable
  > Missing required target/ref/view
  > Rebuilding
  > StaleVisible
  > Redacted
  > Empty
  > Visible
```

For paged reads, per-item not-visible/redacted/degraded decisions must be applied before page assembly. If the whole page target is not visible, return `NotVisible` with empty items. If some loaded items are missing/degraded, return `Degraded` or `StaleVisible` with safe partial items and degraded marker from `IdentityQueryMaterialDegradationMapper`;do not repair or silently drop without marker. For `ListCareerRecordsFlow` and `ListMemoryReferencesFlow`, item missing / member mismatch after list must use the dedicated Step 7 mapper methods `career_record_item_missing_after_list(...)`, `career_record_item_invalid_member(...)`, `memory_reference_item_missing_after_list(...)`, or `memory_reference_item_invalid_member(...)`;the query service must not reuse trace/audit mapper methods or synthesize markers. For operations reads, projection state ref mismatch, reference owner mismatch, reference sidecar degraded, reconciliation report scope/list defects, outbox item/selector defects and handoff fake-delivered defects must use the dedicated Step 7 operations mapper methods;the query service must not reuse member/trace/audit methods or classify from repository errors.

| Error taxonomy / condition | Query disposition | Body/items rule | Retryability | Write rule |
|---|---|---|---|---|
| read visible and fresh | `Visible` | body `Some` or items may be non-empty | NotApplicable | no write |
| read visible but fields must be hidden | `Redacted` | body/items contain only allowed fields | NotApplicable | no write |
| visibility denied | `NotVisible` | body `None`;items empty | NonRetryablePolicy | no write;do not reveal found/missing |
| visibility resolver/access summary unavailable | `Degraded` | body/items empty or safe partial if allowed | RetryAfterDependencyRecovery | no default visible;no decision creation unless Step 9 already did |
| required truth/view/report/outbox/handoff target missing | `Missing` | body `None`;items empty | usually NonRetryableInput | no create/rebuild |
| true visible collection empty | `Empty` | body `None` or items empty | NotApplicable | no write |
| projection/report rebuild in progress or unavailable state says rebuilding | `Rebuilding` | body `None`;items empty | RetryAfterDependencyRecovery | no rebuild from query |
| projection/reference/report stale but visible | `StaleVisible` | stale body/partial items allowed with freshness/degraded marker | RetryAfterDependencyRecovery | no mark fresh |
| member summary stale/degraded but missing freshness marker | `Degraded` | body empty or safe partial with marker from `IdentityQueryMaterialDegradationMapper.member_summary_view_missing_freshness(...)` | ManualRecovery if persisted material defect;dependency retry if projection rebuild later supplies marker | no projection state read;no marker synthesis;no resolver marker reuse |
| projection/reference/report/outbox/handoff sidecar/material missing or partial item missing | `Degraded` | body/items safe partial or empty with marker from dedicated `IdentityQueryMaterialDegradationMapper` operations method when detected after a valid access summary | ManualRecovery if consistency defect;dependency retry if unavailable | no repair;no service-side marker synthesis |
| adapter/feature disabled for read surface | `Disabled` | body `None`;items empty | NonRetryableInput until config change | no write |
| page cursor invalid | entry validation failure,not query surface | no query response body | NonRetryableInput | no facade call if caught pre-dispatch |

### 3.5 Consumer and callback mapping

Inbound consumer and callback application flows return `IdentityConsumerReceipt`. Callback flows reuse the receipt surface, but stored result kind must distinguish normal consumer receipt from handoff callback receipt as fixed in Step 7/8/11.

| Error taxonomy / condition | `IdentityConsumerOutcome` | Required refs/markers | Retryability | Store rule |
|---|---|---|---|---|
| fresh accepted consumer/callback mutation or marker update | `Accepted` | receipt ref, stored result ref, trace/outbox refs as applicable | NotApplicable | save typed receipt envelope + stored shell + idempotency complete in same UoW |
| same key/digest stored typed receipt exists | `DuplicateReplayed` | stored result ref;replayed receipt body-free refs | ReplayOnly | no payload parse/reapply;no new mutation |
| invalid typed payload / policy denied / target mismatch | `Rejected` | safe issue refs | NonRetryableInput / Policy | application-level rejected receipt if facade reached;no accepted truth |
| forbidden body in payload/material | `Rejected` or `Quarantined` | safe issue refs;body-free marker only | NonRetryableInput / ManualRecovery | never save raw body;quarantine when manual review needed |
| source untrusted / manual review required / missing relation where flow forbids create | `Quarantined` | safe issue refs | ManualRecovery or source correction | save typed receipt only if application-level outcome |
| transient repository/resolver/version/in-flight dependency | `DelayedRetry` | safe issue refs | RetryAfterDependencyRecovery / RetryAfterReload | no accepted mutation unless branch explicitly marker-only;transport retry binding Step 14 |
| source duplicate / already reflected marker / no new state | `Noop` | stored result ref;optional trace refs if Step 9 requires marker | NotApplicable | replayable no-op receipt;no duplicate mutation |
| unsupported payload schema version after application reached | `UnsupportedVersion` | issue refs | NonRetryableInput until upgrade | typed receipt if classified application outcome;entry unsupported may stop earlier per §3.9 |
| stored typed receipt missing/wrong kind on duplicate | no valid `IdentityConsumerReceipt` replay;12.3 replay consistency failure | issue/recovery surface later | ManualRecovery | do not replay by parsing payload or generic shell |

Worker entry failures before facade do not produce `IdentityConsumerReceipt`. They map to entry validation/dispatch surfaces in §3.9 and transport ack/retry/dead-letter binding remains Step 14.

### 3.6 Outbox publish mapping

Outbox publish is an operations job/application flow over existing `IdentityOutboxRecord`. It maps publisher outcomes to outbox state and job report issue refs;it never changes accepted command truth.

| Publisher / policy outcome | Outbox state / job surface | Retryability | Required marker | Forbidden mapping |
|---|---|---|---|---|
| `OutboxPublishOutcome::Published` | outbox `Published`;job `Succeeded` or `Partial` depending other items | NotApplicable | `OutboxDeliveryAttemptRef` | downstream consumed / command accepted |
| `RetryableFailed` | outbox `RetryableFailed`;job `RetryableFailed` if no success,or `Partial` with issue | RetryAfterDependencyRecovery | `OutboxDeliveryIssueRef`, optional attempt | rollback accepted truth |
| `PermanentlyFailed` | outbox `Failed`;job `Failed` or `Partial` with issue | ManualRecovery/config/source fix | `OutboxDeliveryIssueRef` | retryable without config/design change |
| `UnsupportedTopic` | outbox `Failed`;job failed/partial issue | ManualRecovery/config fix | `OutboxDeliveryIssueRef` | service builds fallback topic |
| `SkippedByPolicy` | outbox `SkippedByPolicy`;job `Noop` or `Partial` depending selection | NonRetryablePolicy | `OutboxDeliveryIssueRef` | silent delete |
| topic binding unavailable before outcome | job `RetryableFailed` / `Partial` issue;outbox remains loaded state unless Step 9 branch updates retryable marker | RetryAfterDependencyRecovery | maintenance issue / safe issue | mark published |
| outbox stored record missing | job `Failed` item or query `Missing` depending caller | NonRetryableInput / ManualRecovery if index defect | safe issue | recreate outbox from current truth |

### 3.7 Handoff delivery / callback mapping

Handoff delivery job and callback both update `TraceHandoffIntent` / `HandoffState` only through formal attempt、receipt、issue markers. `Delivered` requires `HandoffAttemptRef` and `HandoffReceiptRef`;request sent、HTTP 2xx、adapter ok、job log success are not enough.

| Handoff outcome / condition | Handoff state / receipt/job surface | Retryability | Required marker | Forbidden mapping |
|---|---|---|---|---|
| `HandoffDeliveryOutcome::Delivered` | handoff `Delivered`;job `Succeeded`/`Partial`;callback receipt `Accepted` when callback path | NotApplicable | attempt + receipt marker | store receipt body |
| `RetryableFailed` | handoff `RetryableFailed`;job `RetryableFailed` or `Partial` | RetryAfterDependencyRecovery | attempt + issue marker | retryable failure without attempt |
| `PermanentlyFailed` | handoff `Failed`;job `Failed` or `Partial` | ManualRecovery/config/target fix | attempt + issue marker | rollback trace/audit truth |
| `CancelledByPolicy` | handoff `Cancelled`;job `Noop`/`Partial` issue | NonRetryablePolicy | issue marker | failed without attempt |
| `UnsupportedTarget` | handoff `Cancelled`;job failed/partial issue | ManualRecovery/config fix | issue marker | service builds fallback target |
| callback target missing or mismatched | callback receipt `Rejected` or `Quarantined` if facade reached | NonRetryableInput / ManualRecovery | safe issue refs | mark delivered |
| callback receipt invalid/forbidden body | callback receipt `Rejected`/`Quarantined` | NonRetryableInput / ManualRecovery | safe issue refs | save raw receipt body |
| stored callback receipt missing/wrong kind on duplicate | replay consistency failure in 12.3 | ManualRecovery | issue later | replay as normal consumer receipt |

### 3.8 Operations job mapping

Job public response uses `IdentityJobResponse<T>` with `IdentityJobReportSurface` after application job service reached. `IdentityJobRunDisposition::DuplicateReplayed` and `Rejected` are wrapper dispositions,not `IdentityJobResultKind`.

| Error taxonomy / condition | Public job disposition / report kind | Retryability | Store rule |
|---|---|---|---|
| job completed all selected items | `Completed` / `IdentityJobResultKind::Succeeded` | NotApplicable | save job report + stored result + idempotency complete |
| some selected items succeeded and some failed/skipped/degraded | `Partial` / `Partial` | depends on issue refs | save all item refs and issue refs;duplicate replays saved report |
| no successful item or unrecoverable boundary failure after application job start | `Failed` / `Failed` | ManualRecovery unless issue says dependency retry | save failed report only if application reached and report assembly allowed |
| dependency failure classified retryable | `RetryableFailed` / `RetryableFailed` | RetryAfterDependencyRecovery | save retryable issue refs;retry schedule Step 14 |
| deterministic no pending/stale/retryable target | `Noop` / `Noop` | NotApplicable | save no-op report;no fake success refs |
| same key/digest stored report exists | `DuplicateReplayed` wrapper over stored report | ReplayOnly | load stored job report;do not rescan repositories |
| job request invalid after facade reached | `Rejected` wrapper;no `IdentityJobResultKind` unless 12.3/Step 13 defines replayable rejected report | NonRetryableInput | no job report unless application-level rejected report is explicitly allowed |
| same key different digest | `Rejected` / duplicate conflict surface | NonRetryableInput | original result authoritative;no job body |
| stored job report missing/wrong kind on duplicate | replay consistency failure in 12.3 | ManualRecovery | do not rerun job |

### 3.9 Entry pre-dispatch mapping

Entry mapping is intentionally separate from application protocol mapping. If facade was not called, there is no application result and no application replay material.

| Entry family | Validation / dispatch state | Public/runner surface | Store rule | Step 14/15 handoff |
|---|---|---|---|---|
| API | `RejectedAtEntry` | API entry validation failure with safe issue refs | no UoW,no stored command result,no trace/outbox | transport status / logging later |
| API | `NotRoutable` | API route not found/disabled surface | no facade,no stored result | route/config binding later |
| API | `RuntimeUnavailable` / `SkippedRuntimeUnavailable` | API runtime unavailable surface | no command/query result stored | runtime recovery/config later |
| API | `FailedBeforeApplication` | dispatch guard/catalog failure surface | no repository/adapter fallback | alert/log later |
| Worker | `UnrecognizedBinding` | worker entry failure;no consumer receipt | no UoW,no stored receipt,no reference update | ack/dead-letter policy later |
| Worker | `MissingDedupeKey` | worker entry failure;no consumer receipt | no payload hash fallback,no stored receipt | retry/dead-letter policy later |
| Worker | `InvalidEnvelopeMarker` | worker entry failure;body not persisted | no stored receipt/no payload body | security log later |
| Worker | `RuntimeUnavailable` / `SkippedRuntimeUnavailable` | worker runtime unavailable surface | no application receipt | retry binding later |
| Worker | `FailedBeforeApplication` | dispatch guard/catalog failure | no resolver/repository fallback | alert/log later |
| Jobs | `UnknownJob` | job entry failure | no job report,no stored job result | process exit/status later |
| Jobs | `InvalidScope` / `InvalidCursor` | job entry failure | no scan fallback,no report | config/input correction later |
| Jobs | `MissingIdempotencyKey` | job entry failure | no report,no stored result | caller fixes input |
| Jobs | `RuntimeUnavailable` / `SkippedRuntimeUnavailable` | job runtime unavailable | no job report | retry/scheduler binding later |
| Jobs | `FailedBeforeApplication` | dispatch guard/catalog failure | no direct repository scan | alert/log later |

### 3.10 12.2 stop-review record

| 审查项 | 结论 | 说明 |
|---|---|---|
| 是否只写 12.2 范围 | 通过 | 只写 public mapping,未写 12.3 flow exception order 或 Step 13 幂等矩阵 |
| 是否只使用已有 public surface | 通过 | 映射均落到 Step 8/10 已有 outcome/disposition/state |
| 是否保持 entry/application 分离 | 通过 | pre-dispatch 明确 no UoW/no stored result/no receipt/no job report |
| 是否保持 query no-write | 通过 | query mapping 明确 no create/rebuild/refresh/repair |
| 是否保持 duplicate no-rerun | 通过 | command/consumer/job replay missing 均留 12.3 consistency failure,不得重跑 |
| 是否可以进入 12.3 | 可以 | 下一批按 Step 9 flow family 写检测位置、rollback、stored replay和异常分支 |

---

## 4. 12.3 exception branches by flow family

### 4.1 当前批次状态

| 项 | 状态 |
|---|---|
| 当前批次 | 12.3 exception branches by flow family |
| 当前结论 | 已按 entry、command、query、consumer/callback、outbox/handoff、maintenance job 和 shared replay/transaction failure 写清异常检测位置、UoW/rollback/no-write、stored replay、receipt/report 规则 |
| 本批是否定义 Step 13 幂等完整矩阵 | 否。same key/same digest、same key/different digest、in-flight、stored missing/wrong-kind 只固定异常分支和 no-rerun;锁、expiry、优先级留 Step 13 |
| 本批是否定义 Step 14 retry/backoff/ack | 否。只标 retryable / non-retryable / manual;transport ack、dead-letter、schedule 留 Step 14 |
| 下一批 | 12.4 recovery / audit / marker rules |

### 4.2 Shared exception rules

| Exception | Detection position | UoW / rollback rule | Public surface | Stored / replay rule |
|---|---|---|---|---|
| entry pre-dispatch validation failure | API/worker/jobs entry validator before facade | no UoW;no rollback needed | entry surface from Step 10/12.2 | no stored result,receipt,job report,truth,trace,outbox |
| dispatch target/guard failure before application | entry dispatch guard before facade call | no UoW | `FailedBeforeApplication` entry surface | no fallback direct repository/adapter call |
| idempotency same key/same digest replay available | application reserve before mutation/job body | no new mutation UoW beyond replay read | replay stored command/receipt/job surface | load stored typed surface;no resolver/repository mutation |
| idempotency same key/different digest | application reserve | rollback reserved attempt if any;no mutation | duplicate conflict / rejected surface from 12.2 | original digest/result authoritative |
| idempotency in-flight | application reserve | no mutation | delayed / temporary failure surface | Step 13 defines waiting/expiry;do not parse/reapply payload |
| stored result missing / wrong kind | duplicate replay after idempotency points to stored ref | no mutation;no repair write in replay path | replay consistency failure;manual recovery in 12.4 | never rerun command/consumer/job or reconstruct from current truth |
| optimistic version conflict | repository save/update with expected version | rollback current UoW staged writes | conflict / delayed / job failed item depending flow | no overwrite;caller reloads via same repository |
| formal unique conflict | repository append/create | rollback current write unless classified source noop/replay | conflict / noop / rejected per flow | no silent overwrite;Step 13 defines duplicate priority |
| repository unavailable before commit | port call before commit | rollback staged UoW if opened | dependency unavailable / delayed / retryable failed | no accepted success |
| commit status unknown | UoW commit | cannot assume rollback or success | temporary/unknown surface;manual/idempotency check recovery | do not report success unless stored result/report/receipt is found |
| rollback failure | UoW rollback | local state uncertain | consistency defect/manual recovery | no retry loop that may duplicate mutation |
| forbidden body persistence attempt | constructor/repository/adapter boundary | reject before save;rollback if inside UoW | `ForbiddenBody` / quarantine / consistency defect | fake and durable must not keep raw body |

### 4.3 API / worker / jobs entry branches

| Entry family | Exception branch | Detection position | Required handling | Forbidden handling |
|---|---|---|---|---|
| API | route not routable / disabled | route catalog before facade | return API entry failure surface | infer command/query from path string |
| API | request marker / actor / page / idempotency invalid | entry validator before facade | return `RejectedAtEntry` entry surface | save `CommandRejected` stored result |
| API | runtime unavailable before dispatch | runtime assembly / dispatch guard | return runtime entry surface | create command/query application result |
| API | target guard failed before facade | dispatch guard | return `FailedBeforeApplication`;safe issue only | direct repository/publisher/handoff fallback |
| Worker | unrecognized binding | binding catalog before payload dispatch | return worker entry failure;transport mapping later | parse payload to guess consumer |
| Worker | missing dedupe key | envelope/dedupe extractor before facade | return worker entry failure | hash payload body to invent key |
| Worker | invalid envelope marker / unsafe marker | envelope validator | return worker entry failure;do not persist body | store invalid raw envelope for replay |
| Worker | runtime unavailable before dispatch | runtime guard | return worker runtime surface | create `IdentityConsumerReceipt` |
| Jobs | unknown job | job catalog before facade | return job entry failure | run fallback script or infer binary name |
| Jobs | invalid scope/cursor | job entry validator | return job entry failure | scan all store or reset cursor unless Step 9/14 permits |
| Jobs | missing idempotency key | job entry validator | return job entry failure | use run ref/time/cursor as idempotency key |
| Jobs | runtime unavailable before dispatch | runtime guard | return job runtime surface | save failed `IdentityJobRunReport` |

### 4.4 Command flow branches

| Branch | Detection position | UoW / rollback | Public surface | Stored / side-effect rule |
|---|---|---|---|---|
| duplicate replay available | idempotency reserve before domain mutation | do not execute mutation branch | typed stored accepted/rejected command envelope | no new truth/trace/audit/outbox/stale/effect |
| same key/different digest | idempotency reserve | no mutation;rollback if record was marked conflict in same UoW only as Step 13 defines | `DuplicateConflict` | original stored surface authoritative |
| idempotency in-flight | reserve | no mutation | temporary/delayed conflict surface | no stored command result |
| request/domain guard rejected before any truth save | service/domain policy | rollback UoW if opened | `InvalidRequest` / `PolicyDenied` / `Conflict` / `NotFound` | stored rejected only if 12.3/Step 13 classifies replayable;no trace/outbox |
| resolver unavailable before accepted truth | resolver port / typed summary | rollback UoW | `AdapterUnavailable` with degraded issue | no accepted active truth;no stale projection |
| resolver invalid/untrusted summary | resolver typed outcome / domain guard | rollback UoW | `PolicyDenied` or `InvalidRequest` depending source | no accepted active truth |
| optimistic version conflict on truth/save | repository save/update | rollback all staged writes | `Conflict` | no partial truth/effect/stored result |
| unique conflict on create/append | repository create/save | rollback unless classified no-op by flow | `Conflict` or policy rejection | no second append/outbox/effect |
| stored accepted shell or typed envelope save fails | stored result repository before commit | rollback whole accepted UoW | dependency/consistency failure | accepted truth must not commit without replay surface |
| idempotency complete fails | idempotency repository before commit | rollback whole accepted UoW | dependency/consistency failure | no committed accepted truth without completed replay guard |
| commit fails / unknown | UoW commit | do not report accepted unless durable stored result confirms | commit unknown / temporary failure | recovery in 12.4;no duplicate rerun |

### 4.5 Query flow branches

| Branch | Detection position | UoW rule | Public surface | Forbidden handling |
|---|---|---|---|---|
| entry request/page invalid | API entry before facade | no UoW | entry failure | query service repair/write |
| visibility access summary missing/unavailable | visibility repository/resolver | no UoW | `Degraded` or `NotVisible` per 12.2 priority | default visible |
| visibility denied | visibility policy | no UoW | `NotVisible` | return `Empty` / `Missing` to hide access |
| target truth missing | repository read | no UoW | `Missing` | create member/lifecycle/summary |
| stable view lookup missing | projection repository lookup | no UoW | `Missing` / `Degraded` per query type | synthesize view ref or rebuild view |
| projection/reference/report stale | loaded state/view | no UoW | `StaleVisible` / `Degraded` | mark fresh or refresh reference |
| partial item missing in page | item load after list | no UoW | `Degraded` with safe partial result and dedicated `IdentityQueryMaterialDegradationMapper` method for the item family;`ReadIdentityTrace` ByMember/ByMemberAndChangeKind first-missing uses `resolve_trace_member_page_read(...)` page access as mapper input;operations reads use the matching projection/reference/report/outbox/handoff mapper method and valid operations access summary | silently drop without marker, reuse wrong mapper family, synthesize marker, or repair |
| repository unavailable | read port | no UoW | `Degraded` / disabled/runtime surface | save diagnostic row |
| page cursor invalid after facade | page mapper / repository page input | no UoW | degraded/invalid request surface per entry/application boundary | use truth cursor/job cursor as fallback |

### 4.6 Consumer and callback branches

| Branch | Detection position | UoW / rollback | Receipt surface | Stored / side-effect rule |
|---|---|---|---|---|
| duplicate replay available | idempotency reserve | no payload reapply | `DuplicateReplayed` | load typed consumer/callback receipt envelope |
| same key/different digest | idempotency reserve | no mutation | `Rejected` / conflict issue | original receipt authoritative |
| idempotency in-flight | reserve | no mutation | `DelayedRetry` | no payload parse beyond safe marker |
| unsupported schema as application outcome | envelope schema after facade reached | UoW only if saving typed receipt is classified outcome | `UnsupportedVersion` | safe issue only;no truth |
| forbidden body/material | typed payload/material guard or repository body boundary | rollback if inside UoW | `Rejected` / `Quarantined` | no raw payload/receipt/archive body |
| source untrusted/manual review | source resolver/domain policy | rollback accepted mutation;may save quarantine receipt if branch classified outcome | `Quarantined` | no active truth unless Step 9 branch says pending marker |
| transient resolver/repository unavailable | resolver/repository port | rollback accepted mutation | `DelayedRetry` | no partial active truth |
| duplicate source/no new state | domain/source duplicate guard | UoW only for replayable noop receipt if Step 9 branch says so | `Noop` | no second career/memory/source append |
| target missing/mismatch in callback | callback target lookup/policy | rollback state update | `Rejected` / `Quarantined` | no delivered/archived/migrated state |
| receipt envelope save fails | stored result/receipt repository | rollback whole application outcome | dependency/consistency failure | no idempotency complete without typed receipt |
| commit unknown | UoW commit | no receipt success unless typed receipt found | temporary/unknown surface | recovery in 12.4 |

### 4.7 Outbox publish and handoff delivery branches

| Flow | Branch | Detection position | UoW / rollback | Report / state rule |
|---|---|---|---|---|
| outbox publish | duplicate replay available | job idempotency reserve | no publish call | replay stored job report |
| outbox publish | outbox record missing | outbox repository load/list item | job UoW may save failed report if application job reached | report failed item;do not recreate outbox |
| outbox publish | topic binding unavailable | topic binding port | rollback item update or save retryable report branch per Step 9 | no `Published` |
| outbox publish | publisher retryable failed | publisher outcome | save outbox `RetryableFailed` + job issue | accepted truth unchanged |
| outbox publish | publisher permanent/unsupported | publisher outcome | save outbox `Failed` + job issue | no retryable unless new config/source |
| outbox publish | publish state version conflict | outbox update expected_version | rollback item update;record job issue when report branch permits | no overwrite |
| handoff delivery | handoff intent missing | handoff repository load/list item | job report failed item | do not create intent |
| handoff delivery | target resolution unavailable | target port | retryable job/report branch | no delivered |
| handoff delivery | delivered without attempt/receipt marker | domain guard | rollback item update | `Delivered` forbidden |
| handoff delivery | retryable/permanent outcome | delivery outcome | save `RetryableFailed` or `Failed` with required markers | no raw receipt/body |
| handoff delivery | unsupported target/cancelled policy | target/policy outcome | save `Cancelled` with issue marker | not `Failed` without attempt |
| retry propagation | selected terminal state | repository selection/state guard | skip or report issue,depending Step 9 branch | never retry terminal Published/Delivered/Failed/Cancelled/Skipped |

### 4.8 Projection / reference / reconciliation job branches

| Flow | Branch | Detection position | UoW / rollback | Report / recovery rule |
|---|---|---|---|---|
| rebuild projection | duplicate replay available | job idempotency reserve | no rebuild/list | replay stored report |
| rebuild projection | projection state/view missing | projection repository load/lookup | save failed/partial job report if application job reached | no query-side rebuild;no truth repair |
| rebuild projection | source cursor missing/stale | projection cursor/source read | save failed item/report | no cursor fabrication from timestamp/page |
| rebuild projection | writer unsupported | projection writer/mapper | save failed item/report | no private writer |
| refresh reference | reference state missing | reference repository list/load | save failed reference item/report | no create bundle unless Step 9 target says so |
| refresh reference | resolver unavailable typed outcome | resolver returned body-free unavailable | save reference unavailable/failed state if Step 9 branch owns state update;report retryable issue | no local truth delete |
| refresh reference | resolver call failure as `ApplicationError` | resolver port failed without business outcome | rollback state update;report dependency issue | do not infer invalid/unavailable from error string |
| refresh reference | sidecar save version conflict | reference repository update | rollback item update;report conflict issue | no source version as expected_version |
| reconciliation | finding/report material invalid | report assembly policy | rollback report item or save failed report branch | no raw diagnostic/remediation body |
| reconciliation | drift found | reconciliation policy | save report/finding only | no repair of identity/external truth |
| any job | stored job report save fails | job report repository | rollback job UoW | no public job success |
| any job | commit unknown | UoW commit | do not report job success unless stored report found | recovery in 12.4 |

### 4.9 Replay consistency defect branches

| Replay source | Missing / wrong-kind condition | Required branch | Forbidden branch |
|---|---|---|---|
| command accepted result | idempotency points to stored result but generic shell or `IdentityCommandAcceptedResultEnvelope` missing/wrong kind,command variant mismatch,or effect missing | return replay consistency failure;manual recovery wording in 12.4 | reload truth and rebuild response |
| command rejected result | idempotency points to stored rejected but generic shell or `IdentityCommandRejectedResultEnvelope` missing/wrong kind | replay consistency failure | rerun validation/domain guard |
| consumer receipt | stored shell exists but typed `IdentityConsumerReceiptEnvelope` missing/wrong kind | replay consistency failure | parse original event/payload |
| handoff callback receipt | callback stored shell points to wrong receipt kind | replay consistency failure | treat as normal consumer receipt |
| job report | stored `JobReport` shell exists but `IdentityJobRunReport` missing/wrong kind | replay consistency failure | rescan projection/reference/outbox/handoff |
| outbox/handoff item refs in job report | report exists but item refs inconsistent/missing | consistency defect;manual recovery | recompute item refs for duplicate replay |

### 4.10 Commit / rollback failure branches

| Branch | Detection position | Required behavior | Forbidden behavior |
|---|---|---|---|
| begin UoW failed | UoW manager before staged writes | dependency unavailable / delayed / retryable failed depending flow | continue with non-transactional writes |
| rollback after pre-commit failure succeeds | UoW rollback | return mapped failure;no staged material visible | expose staged cursor/stored ref |
| rollback itself fails | UoW rollback | consistency defect/manual recovery;do not retry blindly | assume clean rollback and rerun mutation |
| commit returns definite failure before durable write | UoW commit | no success;caller may retry per dependency classification | report accepted/receipt/job success |
| commit status unknown | UoW commit | report unknown/temporary surface;operator/idempotency check in 12.4 | repeat operation without checking stored result |
| commit succeeds but post-commit external side effect later fails | publisher/handoff/worker outside accepted command | preserve accepted truth;record side-effect marker/report in its own flow | roll back accepted truth |

### 4.11 12.3 stop-review record

| 审查项 | 结论 | 说明 |
|---|---|---|
| 是否只写 12.3 范围 | 通过 | 只写 flow-family 异常分支,未写 Step 13 幂等完整矩阵或 Step 14 transport binding |
| 是否覆盖 Step 11 handoff critical items | 通过 | version conflict、unique conflict、stored missing/wrong-kind、commit unknown、entry failure、forbidden body 均已入表 |
| 是否保持 no-write / no-rerun | 通过 | query no-write、duplicate replay no-rerun、entry no-store 均明确 |
| 是否保持 side-effect failure isolation | 通过 | outbox/handoff failure 只写 marker/report,不回滚 accepted truth |
| 是否可以进入 12.4 | 可以 | 下一批写 recovery / audit / marker rules 和人工恢复措辞 |

---

## 5. 12.4 recovery / audit / marker rules

### 5.1 当前批次状态

| 项 | 状态 |
|---|---|
| 当前批次 | 12.4 recovery / audit / marker rules |
| 当前结论 | 已定义 retryable、terminal/manual、query degraded、stored replay defect、forbidden body、outbox/handoff marker、projection/reference/report consistency 的恢复口径和可写/不可写 material |
| 本批是否定义 retry/backoff schedule | 否。仅定义是否可重试和由哪个 stored marker/report 暴露;具体 schedule、max attempts、worker ack/dead-letter 留 Step 14 |
| 本批是否定义 logs/metrics 字段 | 否。只定义哪些 safe refs/markers 可被 Step 15 观测;具体日志/指标/告警字段留 Step 15 |
| 下一批 | 12.5 cross-step closure / Step 13 handoff |

### 5.2 Recovery classes

| Recovery class | Meaning | Allowed persisted material | Must not persist |
|---|---|---|---|
| NoStoreEntryFailure | failure before application facade | entry validation/dispatch surface only | stored result、receipt、job report、truth、trace、audit、outbox、handoff |
| RollbackOnly | application flow opened UoW but failed before committed outcome | no staged material visible after rollback | partial truth、cursor、stored result、effect、receipt、job report |
| ReplayOnly | idempotency duplicate found stored surface | command generic shell + typed command envelope/effect、typed receipt、job report already persisted | rerun mutation/job,read current truth to rebuild result |
| RetryableMarker | dependency/version/publisher/handoff failure can be retried by formal flow | safe issue marker、outbox/handoff retryable state、job report issue,or delayed receipt if application outcome | raw adapter/source/error body |
| TerminalMarker | current record/intent/report is terminal for this operation | failed/skipped/cancelled state,issue refs,job report item refs | flip terminal state to pending without formal new operation |
| ManualRecovery | consistency/security defect needs operator or durable repair | safe issue refs,failed/degraded query/job/report surface | automatic query repair,duplicate rerun,body persistence |
| ReadSurfaceOnly | query exposes current state without writes | `IdentityQuerySurface` disposition,degraded/freshness/visibility marker | UoW,stored result,repair trace/audit/outbox |
| ReportOnly | maintenance/reconciliation records findings but does not repair truth | `ReconciliationReport`,finding/issue refs,job report | member/lifecycle/role/career/memory truth repair |

### 5.3 Write permission matrix

| Scenario | May write | Must not write |
|---|---|---|
| API / worker / jobs entry pre-dispatch failure | no application store;entry surface only | stored result、typed receipt、job report、truth、trace、audit、outbox、projection/reference repair |
| command accepted | truth,truth cursor,trace,audit,outbox,projection stale,effect,generic stored accepted shell,typed accepted envelope,idempotency complete | publisher delivery result,external body,raw request |
| command rejected before accepted truth | generic stored rejected shell + typed rejected envelope only if replayable by 12.3/Step 13 | truth,accepted cursor,success trace/outbox/stale/effect |
| query degraded/missing/stale/not-visible | query response surface only | UoW,stored result,trace/audit append,projection rebuild,reference refresh |
| consumer/callback accepted | identity-owned truth/reference/marker,trace/outbox/stale if flow requires,typed receipt,stored shell,idempotency complete | raw event body,receipt body,external owner truth |
| consumer/callback delayed/quarantined/noop/rejected as application outcome | typed receipt,stored shell,safe issue refs,optional marker trace only if Step 9 branch requires | active truth unless branch explicitly owns it,raw payload |
| outbox publish failure | outbox state/issue marker,job report issue/item refs,stored job result | accepted command truth rollback,downstream consumed truth |
| handoff delivery failure | handoff state/attempt/issue marker,job report issue/item refs,stored job/callback receipt | raw target path,receipt body,Delivered without receipt |
| projection/reference/reconciliation job issue | projection/reference/report state or report item refs as owned by job,job report issue | core identity truth repair,external truth repair |
| stored replay missing/wrong-kind | safe consistency issue/report surface only if caller context has such surface | rerun operation,reconstruct result from current truth,overwrite stored result |
| forbidden body persistence attempt | reject/quarantine/strip before save;safe issue marker where flow allows | raw request/event/source/archive/receipt/config/log body in fake or durable |

### 5.4 Retryable recovery rules

| Condition | Recovery owner | Public surface | Persisted marker/report | Retry rule boundary |
|---|---|---|---|---|
| optimistic version conflict | caller/application retry after reload | command `Conflict`,consumer delayed/conflict,job item issue | none unless job report owns failed item | reload through same repository;no overwrite |
| idempotency in-flight same digest | Step 13 idempotency policy | delayed/temporary surface | idempotency record remains reserved | wait/expiry details Step 13 |
| repository/resolver temporary unavailable before accepted outcome | application service | `AdapterUnavailable`,`DelayedRetry`,job `RetryableFailed`,query `Degraded` | safe issue marker if available;job report if job reached | schedule/backoff Step 14 |
| publisher retryable failed | publish job | outbox `RetryableFailed`;job `RetryableFailed` or `Partial` | `OutboxDeliveryIssueRef`,job issue | only retry `RetryableFailed` records |
| handoff retryable failed | handoff job | handoff `RetryableFailed`;job `RetryableFailed` or `Partial` | `HandoffIssueRef`,attempt marker,job issue | only retry `RetryableFailed` intents |
| runtime temporarily unavailable before dispatch | entry/runtime owner | entry runtime unavailable surface | entry/runtime safe issue only | no application store;retry after runtime recovery |
| query stale visible | query caller / maintenance job later | `StaleVisible` | no query write;existing freshness marker only | rebuild/refresh through formal job |

### 5.5 Terminal and manual recovery rules

| Condition | Recovery class | Public surface | Required operator/developer action | Forbidden recovery |
|---|---|---|---|---|
| stored result missing/wrong-kind | ManualRecovery | replay consistency failure / degraded job/query surface | inspect durable stored result/idempotency stores and restore or invalidate via formal maintenance procedure | rerun command/consumer/job |
| typed receipt envelope missing | ManualRecovery | replay consistency failure | restore receipt envelope or mark idempotency record inconsistent through formal repair | parse original event/callback body |
| job report missing/wrong-kind | ManualRecovery | replay consistency failure | restore `IdentityJobRunReport` or mark run inconsistent | rescan projection/reference/outbox/handoff |
| commit status unknown and stored surface not found | ManualRecovery | temporary/unknown failure surface | inspect UoW/idempotency/stored result before retrying | blindly retry mutation with same inputs |
| forbidden body already persisted | ManualRecovery / security defect | consistency/security issue | remove body through approved durable repair and audit via Step 15 process | continue serving raw body or copy it into issue text |
| projection lookup/index corrupt | ManualRecovery | query `Degraded` / job failed issue | rebuild index through formal maintenance/admin procedure | query scans store or creates view ref |
| reference sidecar inconsistent with bundle version | ManualRecovery | query/job degraded/failed issue | repair tracked reference bundle and sidecar under formal versioned write | use source version as optimistic version |
| outbox `Failed` / `SkippedByPolicy` | TerminalMarker | outbox state query/job report | create new formal operation if republish is required | flip terminal record back to pending |
| handoff `Failed` / `Cancelled` / `Delivered` | TerminalMarker | handoff state query/job report | create new formal intent/operation if future delivery is required | retry terminal intent |
| reconciliation drift finding | ReportOnly | reconciliation report/finding | separate command/owner action may repair truth | job auto-repairs truth |

### 5.6 Query degraded recovery rules

| Query condition | Query surface | Later recovery owner | Query must not |
|---|---|---|---|
| not visible | `NotVisible` | authorization/config/read policy owner outside query | reveal found/missing or write audit success |
| missing truth | `Missing` | caller creates/updates via command if valid | create truth from query |
| missing projection view ref | `Missing` / `Degraded` | projection rebuild job or accepted write path that creates view | synthesize view ref |
| stale projection | `StaleVisible` / `Degraded` | rebuild projection job | mark fresh or rebuild inline |
| reference unavailable/stale | `Degraded` / `StaleVisible` | reference refresh job or source owner | call external resolver from query |
| partial trace/audit item missing | `Degraded` with safe partial | trace/audit consistency repair outside query | recreate trace/audit item |
| report missing/corrupt | `Missing` / `Degraded` | job/report maintenance owner | rerun report generation from query |
| outbox/handoff state missing | `Missing` / `Degraded` | propagation/job/report owner | publish/deliver from query |

### 5.7 Forbidden body recovery rules

| Detection point | Required handling | Allowed marker | Forbidden handling |
|---|---|---|---|
| contracts typed constructor | reject value construction | validation issue ref if protocol path exists | keep raw value for later mapping |
| domain body-free policy | return domain/application rejection | `ForbiddenBody` or safe policy issue | downgrade to redaction while saving body |
| resolver returns forbidden body | reject resolver outcome or quarantine application receipt | safe issue marker,source/ref marker | store resolver body in reference sidecar |
| consumer/callback payload contains forbidden material | reject/quarantine if application reached;entry failure if envelope invalid before facade | receipt issue refs | save raw payload/receipt/archive package |
| repository detects body before save | fail save and rollback UoW | consistency/security issue marker if caller surface exists | silently strip in durable but keep in fake |
| fake contains raw body for assertion | implementation blocker | none | use test-only side store |

### 5.8 Trace, audit, outbox and report write rules

| Flow result | Trace | Audit | Outbox | Projection/reference marker | Stored replay | Job/report |
|---|---|---|---|---|---|---|
| command accepted | write accepted trace when Step 9 flow requires | append body-free audit when flow requires | create pending accepted-only outbox when payload exists | mark affected projection stale | save accepted command result/effect | not applicable |
| command rejected | no success trace | no accepted audit | no outbox | no stale marker | save rejected only if replayable by Step 13 | not applicable |
| query any surface | no write | no write | no write | no repair/write | no stored result | no report |
| consumer/callback accepted | write accepted/marker trace as Step 9 requires | append audit only if flow owns audit | create outbox only for accepted canonical material | truth/reference/projection marker as flow owns | save typed receipt + stored shell | not applicable |
| consumer/callback delayed/quarantined/noop/rejected | marker trace only if Step 9 branch explicitly requires | no accepted audit unless branch owns marker audit | no accepted outbox unless branch owns canonical material | no active truth marker unless branch owns it | save typed receipt if application outcome | not applicable |
| outbox publish job | no new accepted truth trace | no accepted command audit | update outbox state only | no projection repair | save job report stored result | save item refs/issues |
| handoff delivery job/callback | marker trace if flow requires | no raw delivery audit body | no accepted command outbox unless callback flow owns it | update handoff marker only | save job/callback stored surface | save item refs/issues |
| maintenance/reconciliation job | no accepted truth trace | no truth audit repair | no outbox from findings | projection/reference/report state as job owns | save job stored result | save report/finding/issue refs |
| entry failure | no write | no write | no write | no write | no write | no write |

### 5.9 Fake / durable recovery parity

| Parity rule | Durable requirement | Fake requirement |
|---|---|---|
| rollback visibility | staged rows/cursors/results invisible after rollback | same staged/committed split |
| missing stored replay | returns same replay consistency failure | no mutation rerun shortcut |
| query degraded | returns same query disposition from same missing/stale inputs | no query rebuild or private store scan |
| forbidden body | rejects/strips before persistence according to same boundary | no raw body retained for tests |
| outbox/handoff retryable | controlled outcome updates same state/issue markers | fake cannot mark Published/Delivered unless outcome has required marker |
| terminal states | terminal outbox/handoff/job states not retried by fake runner | same selection filters as durable |
| manual recovery defects | fake exposes consistency defect surface | no auto-repair map |

### 5.10 12.4 stop-review record

| 审查项 | 结论 | 说明 |
|---|---|---|
| 是否只写 12.4 范围 | 通过 | 只写 recovery / audit / marker rules,未写 retry/backoff、ack/dead-letter、log/metric 字段或测试 ID |
| 是否覆盖 retryable / manual / terminal recovery | 通过 | §5.4 和 §5.5 分开定义 |
| 是否覆盖 query degraded no-write | 通过 | §5.6 明确后续 owner 和 query 禁止行为 |
| 是否覆盖 forbidden body | 通过 | §5.7 固定 reject/quarantine/rollback 和 fake/durable 一致 |
| 是否覆盖 outbox/handoff/projection/reference/report recovery | 通过 | §5.4~§5.9 覆盖 marker/report-only 恢复 |
| 是否新增 schema/port/state | 未新增 | 只使用 Step 6~11 既有 marker、state、report、stored surface |
| 是否可以进入 12.5 | 可以 | 下一批做 cross-step closure 和 Step 13 handoff |

---

## 6. 12.5 cross-step closure / Step 13 handoff

### 6.1 当前批次状态

| 项 | 状态 |
|---|---|
| 当前批次 | 12.5 cross-step closure / Step 13 handoff |
| 当前结论 | Step 12 已完成:12.1~12.4 覆盖错误层级、public mapping、异常分支和恢复/marker 规则;所有 Step 11 handoff item 已闭合 |
| 本批是否新增错误类型 / public surface / port / state | 否。只做覆盖审计、open item closure、Step 13~16 handoff 和正式文档回填草稿 |
| 下一步 | DDD Step 13 concurrency / idempotency |

### 6.2 Step 6~11 -> Step 12 coverage audit

| 输入来源 | Step 12 覆盖位置 | 结论 | 说明 |
|---|---|---|---|
| Step 6 object/state/policy error owners | 12.1 domain taxonomy,12.2 command/consumer/job mapping | 通过 | `IdentityDomainError`、forbidden body、invalid transition、policy denied、missing source/basis/evidence 均有分类和 surface |
| Step 6 query/read/degraded markers | 12.2 query mapping,12.4 query degraded recovery | 通过 | not-visible、missing、empty、degraded、stale-visible、rebuilding、disabled 均用 `IdentityQuerySurface`;query no-write |
| Step 6 outbox/handoff states | 12.2 outbox/handoff mapping,12.3 branches,12.4 marker recovery | 通过 | retryable/permanent/skipped/unsupported/delivered/failed/cancelled 均有 marker/report-only 恢复 |
| Step 6 application helper / replay objects | 12.1 application taxonomy,12.3 replay consistency branches | 通过 | generic stored shell、typed command envelope、typed receipt、job report missing/wrong-kind 不重跑 |
| Step 7 port failure surfaces | 12.1 port taxonomy,12.3 branch tables | 通过 | repository、UoW、idempotency、resolver、publisher、handoff、runtime failure 均分类 |
| Step 7 fake/durable parity | 12.4 fake/durable recovery parity | 通过 | version、unique、stored replay、query degraded、forbidden body、outbox/handoff terminal 均有 parity rule |
| Step 8 public protocol surface | 12.2 public mapping by protocol family | 通过 | command、query、consumer/callback、job、entry 都只使用 Step 8/10 既有 surface |
| Step 9 function flow error branches | 12.3 exception branches by flow family | 通过 | entry、command、query、consumer/callback、publish/handoff、maintenance job、commit/rollback 均覆盖 |
| Step 10 state matrix handoff | 12.1~12.4 | 通过 | invalid transition、terminal/retryable、entry/application separation、job no truth repair 均承接 |
| Step 11 persistence/transaction handoff | 12.2~12.4 | 通过 | version/unique conflict、stored replay defect、commit unknown、query no-write、forbidden body、marker/report-only recovery 均承接 |

### 6.3 Step 11 handoff item closure

| Handoff item | Closure status | Step 12 location |
|---|---|---|
| invalid domain transition | 已闭合 | §2.4,§3.3,§4.4 |
| version conflict | 已闭合 | §2.5,§3.3,§4.2,§4.4,§5.4 |
| unique conflict | 已闭合 | §2.5,§4.2,§4.4,§5.5 |
| stored result missing / wrong kind | 已闭合 | §2.5,§3.3,§4.9,§5.5 |
| idempotency same key different digest | 已闭合 | §2.5,§3.3,§3.8,§4.2 |
| repository unavailable / commit unknown | 已闭合 | §2.5,§4.10,§5.4,§5.5 |
| query not-visible/missing/degraded/empty/stale-visible | 已闭合 | §3.4,§4.5,§5.6 |
| source/basis/reference unavailable or invalid | 已闭合 | §2.4,§3.3,§3.5,§5.4 |
| consumer unsupported/forbidden/quarantined/delayed/noop | 已闭合 | §3.5,§4.6,§5.8 |
| callback missing target / receipt invalid | 已闭合 | §3.7,§4.6,§5.8 |
| publisher / handoff adapter failure | 已闭合 | §3.6,§3.7,§4.7,§5.4,§5.5 |
| projection/reference/report consistency defect | 已闭合 | §3.4,§4.8,§5.5,§5.6 |
| entry pre-dispatch failure | 已闭合 | §3.9,§4.3,§5.3 |
| forbidden body persistence attempt | 已闭合 | §2.3,§3.5,§4.2,§5.7 |

### 6.4 Step 13 handoff

Step 13 must start from these Step 12 constraints:

| Step 13 topic | Must carry from Step 12 | Must not introduce |
|---|---|---|
| concurrency resources | version conflict,unique conflict and terminal state conflict taxonomy | last-write-wins,source version as optimistic version |
| command idempotency | same key/same digest replay from stored generic shell + typed command envelope;different digest duplicate conflict;stored shell/envelope missing no-rerun | rebuilding response from current truth |
| consumer/callback idempotency | typed receipt envelope required for replay;unsupported/quarantined/delayed/noop only replay if saved as application outcome | parsing original event/callback body on duplicate |
| job idempotency | stored `IdentityJobRunReport` required;duplicate replay does not rerun job or rescan item refs | job report reconstruction from current repository state |
| in-flight duplicate | no second writer while same operation/channel/key/digest reserved | concurrent second mutation/job body |
| commit unknown | must check idempotency/stored surface before any retry | blind retry with new key or compensating mutation |
| query repeated reads | query remains no idempotency/no-write | query idempotency record,trace append,projection repair |
| outbox/handoff retry | only retry retryable marker states through formal job | retry terminal failed/skipped/delivered/cancelled states |
| forbidden body | body-free digest/stored replay;no raw body in issue/replay material | digest or replay based on raw payload persistence |

Step 13 should read at least:

- `03_ddd_step_06_object_contracts.md`: `IdentityOperationContext`, `IdentityRequestDigest`, `IdentityIdempotencyRecord`, `StoredIdentityOperationResult`, `IdentityConsumerReceiptEnvelope`, `IdentityJobRunReport`.
- `03_ddd_step_07_trait_port_adapter_contracts.md`: `IdentityIdempotencyRepository`, `IdentityStoredResultRepository`, `IdentityJobReportRepository`, `Versioned<T>`, repository expected version ports.
- `03_ddd_step_08_protocol_contracts.md`: command metadata/digest, inbound event idempotency key, callback receipt, job metadata/idempotency key, replayable public surfaces.
- `03_ddd_step_09_function_flows.md`: reserve / duplicate / accepted / rejected / receipt / job report flow order.
- `03_ddd_step_10_state_matrix.md`: idempotency state, stored result kind, job result kind, terminal/retryable states.
- `03_ddd_step_11_persistence_transaction_consistency.md`: same-UoW save result then complete idempotency, transaction visibility, stored replay no-rerun.
- This Step 12 file: error taxonomy, public mapping, exception branches and recovery classes.

### 6.5 Step 14~16 handoff

| Downstream Step | Must carry from Step 12 | Must not introduce |
|---|---|---|
| Step 14 configuration / deployment | retryable vs terminal classification, entry/runtime disabled/unavailable mapping, adapter availability boundary, outbox/handoff retryable marker owner | config that changes domain invariant,disabled/fake success,route/topic/target direct repository binding |
| Step 15 observability / audit | safe issue refs,trace/audit/outbox/handoff/job report refs,body-free diagnostics,commit unknown/manual recovery classes | raw request/event/config/adapter/receipt/log body in diagnostic material |
| Step 16 tests | public mapping,exception branches,recovery redlines,query no-write,entry no-store,duplicate no-rerun,fake/durable parity | tests that use private fake stores,raw body assertions,query repair or duplicate rerun |
| Step 17 implementation handoff | error owner taxonomy,public surface mapping,branch/recovery tables | implementation commit boundary that silently adds schema/port/state |

### 6.6 Open item closure table

| 编号 | 结论 | 后续 |
|---|---|---|
| `DDD-S12-OPEN-001` | 已闭合 | 12.1 定义 taxonomy 和 retryability |
| `DDD-S12-OPEN-002` | 已闭合 | 12.2 定义 public mapping by protocol family |
| `DDD-S12-OPEN-003` | 已闭合 | 12.3 定义 replay/conflict/commit unknown exception branches |
| `DDD-S12-OPEN-004` | 已闭合 | 12.4 定义 projection/reference/report/outbox/handoff marker/report-only recovery |
| `DDD-S12-OPEN-005` | 已闭合 | 12.4 定义 forbidden body recovery and fake/durable parity |
| `DDD-S12-OPEN-006` | 已闭合 | Step 12 可进入 Step 13;Step 13 必须按 §6.4 handoff 启动 |

### 6.7 Step 12 completion review

| 审查项 | 结论 | 说明 |
|---|---|---|
| 是否完成 Step 12 所有批次 | 通过 | 12.0~12.5 均已写入 |
| 是否足够实现错误处理代码 | 通过 | 错误层级、public mapping、异常分支、恢复/marker 规则齐全 |
| 是否新增上游未定义 schema/port/state | 未新增 | 所有 surface 均来自 Step 6~11 |
| 是否保持 query no-write | 通过 | 12.2~12.4 均固定 query surface only |
| 是否保持 duplicate no-rerun | 通过 | stored missing/wrong-kind 统一是 replay consistency defect |
| 是否保持 entry/application 分离 | 通过 | entry pre-dispatch no-store,application result only after facade |
| 是否保持 body-free boundary | 通过 | forbidden body recovery and fake/durable parity 已闭合 |
| 是否完成 Step 13 handoff | 通过 | §6.4 给出 Step 13 输入和禁止事项 |
| 是否直接修改正式 `03` | 未修改 | 正式文档留 Step 19 |

---

## 7. 回填草稿

正式 `03-详细设计.md` 第 11 章后续可按下列结构装配:

```md
## 11. 错误模型、异常分支与恢复口径

本章定义 L1-identity 的 domain/application/port/protocol/worker/job/infra 错误层级、对外映射、异常分支、恢复口径和审计/事件写入规则。错误处理必须遵守 query no-write、duplicate no-rerun、accepted-only side effect、body-free diagnostics 和 fake/durable parity。

### 11.1 Error layering and type taxonomy
### 11.2 Public mapping by protocol family
### 11.3 Exception branches by flow family
### 11.4 Recovery, audit and marker rules
### 11.5 Cross-step error/recovery audit
```

本草稿只作为 Step 19 装配输入,当前不写入正式 `03-详细设计.md`。

---

## 8. 待确认事项

| 编号 | 事项 | 所属批次 | 当前处理 |
|---|---|---|---|
| DDD-S12-OPEN-001 | `IdentityDomainError` / `ApplicationError` / protocol rejection / worker receipt / job issue 的错误层级和 owner 是否完整 | 12.1 | 已闭合;§2.2~§2.9 定义 taxonomy 和 retryability |
| DDD-S12-OPEN-002 | command/query/event/callback/job/entry 的 public mapping 是否能覆盖 Step 8 surface | 12.2 | 已闭合;§3.3~§3.9 按协议族映射 |
| DDD-S12-OPEN-003 | duplicate replay missing/wrong-kind、version conflict、unique conflict、commit unknown 的异常分支是否闭合 | 12.3 | 已闭合;§4.2~§4.10 固定分支和禁止行为 |
| DDD-S12-OPEN-004 | projection/reference/report/outbox/handoff failure 的 recovery 是否不反写真相 | 12.4 | 已闭合;§5.4~§5.9 固定 marker/report-only recovery |
| DDD-S12-OPEN-005 | forbidden body persistence attempt 是否有安全错误和 fake/durable parity 规则 | 12.4 | 已闭合;§5.7 和 §5.9 固定 body-free recovery |
| DDD-S12-OPEN-006 | Step 12 是否可以进入 Step 13 concurrency / idempotency | 12.5 | 已闭合;§6.4 给出 Step 13 handoff |

---

## 9. 进入下一步条件

进入 DDD Step 13 前必须满足:

- 用户审核通过 Step 12 error / recovery。
- Step 13 只写 concurrency / idempotency / reentry protection,不得新增 Step 12 之外的 public error mapping。
- Step 13 必须承接 §6.4:command、consumer/callback、job 的 idempotency key/digest/replay/in-flight/commit unknown/no-rerun 规则。
- Step 13 不得让 query 写 idempotency、trace、audit、stored result、projection repair 或 reference refresh。
- Step 13 不得用 database unique key 替代 application stored replay;unique key 只能作为并发保护的一部分。
- 若 Step 13 发现缺少 idempotency key、digest input、stored result/receipt/report replay surface 或 repository expected-version source,必须暂停并回 Step 6~12 闭口。
