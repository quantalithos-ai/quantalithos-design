# Step 6. 设计测试场景与用例矩阵

> 对应 SOP：`standards/document/测试方案讨论流程_SOP.md` Step 6
> 回填章节：`05-测试方案.md` §6

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 6 测试场景与用例矩阵 |
| 当前状态 | `completed / pass_with_upstream_blockers` |
| 原则 | 以测试切口为小循环，先契约再场景；不把后续 phase 结果提前写入当前断言 |
| 停审结论 | 所有 P0 切口有正向/负向/边界/一致性或恢复用例候选 |

## 2. 用例设计规则

| 规则 | 具体要求 |
|---|---|
| 设计回指 | 每个用例回指 `03` 正式对象、协议、状态、flow 或 `04` 配置契约 |
| 正负成组 | P0 切口至少有 accepted/可判定上限和 reject/blocked/unknown 负向 |
| 状态命名 | 只使用 `03` §9 正式状态；不引入 `ready`、`healthy` 等万能状态 |
| Query | 必须断言不 reserve、不 begin write UoW、不 refresh/rebuild/repair/append/publish |
| Job | 必须断言只推进已提交 work，不创建 intent/decision/generation/new effect key |
| unknown | timeout、commit unknown、缺 feedback 保留原 stable key，进入 hold/gap/reconcile |
| 证据 | 先使用 `EV-CAND-*` 候选族；正式 EV 与 run 绑定留 Step 13 |

## 3. 用例批次表

| 批次 | 测试切口 | 场景类型 | 优先级 | 数据前置 | 候选证据族 | 停审 |
|---|---|---|---|---|---|---|
| B1 | contracts / domain / state | roundtrip、invariant、合法/非法迁移 | P0 | protocol + object fixtures | `EV-CAND-CONTRACT/DOMAIN/STATE-*` | pass |
| B2 | 10 Command | accepted、reject、duplicate、conflict、rollback | P0 | command seed + UoW fault | `EV-CAND-CMD-*` | pass |
| B3 | 6 Query | visible、missing、not-visible、degraded、no-write | P0 | projection/history/session fixtures | `EV-CAND-QUERY-*` | pass |
| B4 | 5 Consumer | accepted marker、duplicate、unsupported、late/gap | P0 | envelope + source snapshot fixtures | `EV-CAND-CONSUMER-*` | pass |
| B5 | material + 7 Job | immutable payload、report、partial、replay、no truth repair | P0 | outbox/job/replay fixtures | `EV-CAND-MATERIAL/JOB-*` | pass |
| B6 | consistency / idempotency / recovery | same/different digest、race、unknown、rollback | P0 | fault + concurrent fixtures | `EV-CAND-IDEMP/RECOVERY-*` | pass |
| B7 | config / redaction / dependency | profile、strict JSON、no-output、dependency scan | P0 | config/artifact corpus | `EV-CAND-CONFIG/REDACTION/ARCH-*` | pass |

## 4. Contract / Domain / State 用例族

| 用例 ID | 场景 | 前置 / 操作 | 预期与断言 | 自动化 |
|---|---|---|---|---|
| `TC-CONTRACT-001` | typed ref / metadata roundtrip | 构造合法 Command、Query、Consumer、Job | 反序列化后双锚、scope、correlation、schema/version 保持；Query 不携带 idempotency key | 是 |
| `TC-CONTRACT-002` | required metadata 缺失 | 删除 actor、scope、source 或 idempotency key | 返回结构性 reject；不 begin mutation UoW、不调用 domain/adapter | 是 |
| `TC-CONTRACT-003` | unsupported version | 将 Consumer envelope version 改为未支持值 | 返回 `UnsupportedVersion`；不 parse payload、不保存 snapshot、不 mark stale | 是 |
| `TC-CONTRACT-004` | same key different digest | 复用 operation key 改变稳定 DTO 字段 | 返回 `IdempotencyConflict` 或等价 conflict；不覆盖原 reservation | 是 |
| `TC-DOMAIN-001` | 双锚与 scope invariant | 构造合法/不一致 `ProjectMemberRef` + `GlobalMemberRef` | 合法对象建立；不一致、非项目或缺 source 被 reject | 是 |
| `TC-DOMAIN-002` | body-free invariant | 向 ref/snapshot/material 注入外部 body、secret、manifest | `ExternalBodyRejected` / fail-closed；无对象、无 sidecar | 是 |
| `TC-DOMAIN-003` | readiness non-transitive | 令 assembly `Complete` 但 required binding `Blocked` | readiness 不得变 `Ready`；保留 blocked/not-ready basis | 是 |
| `TC-STATE-001` | 合法状态主线 | 对每个正式状态轴执行一条主线迁移 | 仅允许矩阵中 writer 迁移；revision / reason / source 完整 | 是 |
| `TC-STATE-002` | 非法 / terminal 迁移 | 对 terminal 或跨轴状态调用错误 transition | 返回正式错误；不写 accepted history/material/outbox/stored success | 是 |
| `TC-STATE-003` | 旧世代反馈 | current generation 后提交 old generation feedback | 只形成 late/unknown/gap/history；current 不变 | 是 |

## 5. Command 用例矩阵（10 个）

| 用例 ID | Command | accepted / 正向上限 | 负向与边界 | 关键断言 |
|---|---|---|---|---|
| `TC-INTENT-001` | `AcceptHostIntentCommand` | 双锚、source、scope 合法，形成 `Accepted` intent | 缺双锚/source/scope、非项目、重复/冲突 | intent + history/material/result 同 UoW；不隐式建 host |
| `TC-DECISION-001` | `DecideHostOrchestrationCommand` | accepted intent + current 版本形成 `Committed` decision | intent 未 accepted、version conflict、无动作/重复 | 只写 decision sidecar；不宣称 host/action success |
| `TC-QUAL-001` | `ResolveHostQualificationCommand` | identity/work 可用，其他 seam 形成 safe result | source stale/unavailable/placeholder/冲突 | `Resolved/Partial/Blocked/Unknown` 按来源；不得 fallback ready |
| `TC-ASSEMBLY-001` | `CoordinateHostAssemblyCommand` | required item set 冻结并写 assembly/readiness | 缺 item、重复 item、generation mismatch | `Complete` 与 readiness 独立；缺项不 ready |
| `TC-GENERATION-001` | `EstablishHostGenerationCommand` | committed decision + single-active guard 建立一代 host | current pointer race、无 decision、重复 | 只有一个 current；不创建容器/进程/Runtime truth |
| `TC-ACTION-001` | `PrepareHostActionCommand` | 生成稳定 `ExternalEffectKey` 和 `Prepared` attempt | target/generation mismatch、key conflict、二次 prepare | prepare 前无 external call；同 key 可 replay |
| `TC-REG-001` | `AcceptHostRegistrationCommandPlaceholder` | safe registration ref/fingerprint 可用时建立 local shell | Member/credential pending、raw body、跨实例、重放 | 未闭合返回 blocked/waiting；不宣称 ready/reachable |
| `TC-SESSION-001` | `MaintainHostSessionCommandPlaceholder` | accepted registration + safe endpoint 形成 session shell | Runtime association unavailable、endpoint stale、重复 | session 只为 host 壳；不创建 Runtime run/turn/checkpoint |
| `TC-RECOVERY-001` | `DecideHostRecoveryCommand` | current host + assessment/failure + control source 形成 decision | basis stale、control pending、非法 action、重复 | recovery decision 显式；不执行 Runtime recovery |
| `TC-CLOSE-001` | `CloseHostCommand` | local closure、关联失效、cleanup attempt 同 UoW | 无 current、causality 缺失、cleanup key conflict、commit unknown | local closed 不等于 external cleanup complete；原 key 保留 |

共同负向用例族：`TC-CMD-NEG-001` invalid request no UoW；`TC-CMD-NEG-002` duplicate same digest exact replay；`TC-CMD-NEG-003` expected revision conflict；`TC-CMD-NEG-004` sidecar/result/outbox failure rollback；`TC-CMD-NEG-005` forbidden body reject。

## 6. Query 用例矩阵（6 个）

| 用例 ID | Query | 可见主线 | 负向 / 边界 | no-write 断言 |
|---|---|---|---|---|
| `TC-QUERY-001` | `QueryCurrentHostDecision` | 返回 decision safe slice / freshness | missing、not-visible、stale、store unavailable | 不创建 decision、不 refresh、不写 audit |
| `TC-QUERY-002` | `QueryHostAssemblyReadiness` | 返回每轴 qualification/assembly/readiness | gap、unknown、not-visible、stale | 不调用 resolver、不重新评估 |
| `TC-QUERY-003` | `QueryHostAccessSession` | 返回 redacted registration/endpoint/session | endpoint stale/invalidated、association blocked | 不接受 registration、不建 association |
| `TC-QUERY-004` | `QueryHostHealthFailure` | 返回 signal/assessment/failure/recovery safe summary | no signal、late/stale、unknown、unavailable | 不重评估、不创建 recovery |
| `TC-QUERY-005` | `QuerySafeHostFacts` | 返回 projection/material safe view | projection stale/rebuilding/degraded/unavailable、empty | 不 rebuild、不修复、不反写 source |
| `TC-QUERY-006` | `QueryHostHistory` | 返回 append-only page + opaque cursor | empty、invalid cursor、not-visible | 不追加 history；page cursor 不作 revision |
| `TC-QUERY-NEG-001` | 代表 Query write audit | 对所有 Query 注入 write spy | write UoW、reservation、refresh、rebuild、append、publish 任一发生即失败 | 是 |

## 7. Consumer 用例矩阵（5 个）

| 用例 ID | Consumer | accepted local write | 负向 / 边界 | 关键断言 |
|---|---|---|---|---|
| `TC-CONSUMER-001` | `QualificationSourceChangedConsumerPlaceholder` | 写 safe source snapshot、stale marker、receipt | unsupported version、source unavailable、duplicate | 不写 intent/decision/ready |
| `TC-CONSUMER-002` | `HostActionOutcomeConsumerPlaceholder` | matching effect key/attempt/generation 写 outcome/association | unknown key、old generation、digest conflict | 不创建新 attempt、不覆盖 current |
| `TC-CONSUMER-003` | `HostHealthSignalConsumerPlaceholder` | capture signal、mark assessment due、receipt | duplicate、late、stale、invalid | accepted signal 不等于 healthy/recovery |
| `TC-CONSUMER-004` | `HostCleanupFeedbackConsumerPlaceholder` | matching cleanup key 写 outcome/residual | timeout、target mismatch、duplicate | 不写 external cleanup complete、不换 key |
| `TC-CONSUMER-005` | `HostHandoffFeedbackConsumerPlaceholder` | 只更新一个 target/layer marker | 层级跳跃、target mismatch、unknown/gap | 不由 submitted 推导 delivered/observed/accepted |

## 8. Material / Job 用例矩阵

| 用例 ID | 对象 / Job | 正向 | 负向 / 边界 | 关键断言 |
|---|---|---|---|---|
| `TC-MATERIAL-001` | `HostFactMaterialEventCandidate` | 从 committed local change 生成 immutable body-free payload/outbox | source cursor 未确认、payload/body 不安全、append failure | 不从 current truth 现查现组包；失败整体 rollback |
| `TC-JOB-001` | `DispatchPendingHostActionsJob` | dispatch prepared attempt，保留 effect key | 双 worker、carrier unavailable、unknown | 只推进 attempt，不新建 decision/generation |
| `TC-JOB-002` | `EvaluateDueHostHealthJob` | accepted signal → assessment/failure report | stale/gap、partial item failure | 不隐式 recovery |
| `TC-JOB-003` | `ProgressPendingHostCleanupJob` | cleanup attempt 进入 safe result/unknown/gap | release timeout、same-key race | 不声明 external cleanup complete |
| `TC-JOB-004` | `ReconcileHostResidualsJob` | safe summary 比对并形成 finding/case/report | summary unavailable/body rejected、version conflict | 不改 sibling/backend truth |
| `TC-JOB-005` | `PublishHostFactOutboxJob` | 读取 stored payload，写 submission marker/handoff | payload missing、dual publisher、permanent failure | 不回查 current truth；submitted 不等于 delivered |
| `TC-JOB-006` | `RebuildSafeHostProjectionJob` | committed source → projection/view | older cursor、material missing、rebuild failure | 不反写 source；保持 stale/degraded/unavailable |
| `TC-JOB-007` | `ReconcileHostHandoffGapsJob` | 同 key/target 建 bounded retry 或 waiting link | key mismatch、feedback unknown、重复 | 不换 key 盲重放、不声明 accepted |
| `TC-JOB-NEG-001` | Job shared no-truth-repair | 对每类 job 开 write spy | intent/decision/generation/new key 或 source truth 写入即失败 | 是 |

## 9. 一致性 / 幂等 / 恢复用例矩阵

| 用例 ID | 场景 | 断言 |
|---|---|---|
| `TC-IDEMP-001` | same key + same digest | 精确 replay stored outcome/receipt/report；无第二次 transition 或外部调用 |
| `TC-IDEMP-002` | same key + different digest | stable conflict；不覆盖 reservation，不写 sidecar |
| `TC-IDEMP-003` | in-flight reservation | delayed/blocked；不产生第二 writer/generation/effect |
| `TC-IDEMP-004` | stored result missing | consistency defect；不从 current truth 重算 |
| `TC-IDEMP-005` | commit unknown | 查询原 key/result，进入 reconcile；不盲重放 |
| `TC-IDEMP-006` | rollback unknown | safe diagnostic/manual recovery marker；不返回 accepted |
| `TC-IDEMP-007` | old generation feedback | late/unknown/gap；current 不变 |
| `TC-IDEMP-008` | dual dispatcher/publisher | single winner；另一方 reload/skip |
| `TC-IDEMP-009` | projection old cursor | older cursor no-op；新状态不被覆盖 |
| `TC-IDEMP-010` | handoff layer inference | 每层需 owner feedback；unknown/gap 不越级 |

## 10. Config / Redaction / Dependency 用例矩阵

| 用例 ID | 场景 | 断言 |
|---|---|---|
| `TC-CONFIG-001` | P0 profile valid | `local-dev` / `ci-test` / `integration-like` / `operations-replay` 可按 `04` 语义装配 |
| `TC-CONFIG-002` | strict JSON invalid | unknown field、duplicate/alias、尾逗号、错误 type/range 被 fail-fast |
| `TC-CONFIG-003` | source priority | `code defaults < strict JSON file < environment variables`；高优先级非法不 fallback |
| `TC-CONFIG-004` | profile isolation | `deterministic_fixture.*` 仅 ci-test / operations-replay；其他 profile 启用即 reject |
| `TC-CONFIG-005` | builder partial binding | required store / resolver / publication binding 缺失时不暴露 facade |
| `TC-CONFIG-006` | static boundary | `query_write_repair=true`、删除 deny class、关闭 fixture guard 等均 reject |
| `TC-REDACTION-001` | forbidden output corpus | secret/body/manifest/endpoint/stack/broker body 注入 artifact/report/log | 扫描失败即 gate fail；不回显注入值 |
| `TC-REDACTION-002` | low-cardinality metrics | raw host/member/actor/effect/idempotency/URL 不作为 label |
| `TC-REDACTION-003` | audit refs-only | history/material/handoff/report 仅 safe refs、state、reason、cursor |
| `TC-ARCH-001` | dependency boundary | 非 Core / SDK sibling 不出现在 compile graph；runtime/event/ref/adapter/fake 保持分类 |

## 11. 用例停审与跨用例审计

| 审计项 | 结论 | 修正 |
|---|---|---|
| P0 用例有断言点 | pass | 每行明确字段、状态、marker、错误或 no-write |
| 只测 happy path | pass | 所有批次包含负向 / 边界 / 恢复 |
| phase 越界 | pass | 不把 delivered/observed/accepted 或 Runtime result 写成当前本地结果 |
| 证据 ID 冲突 | pass | 本步只用 `EV-CAND-*` 族，正式 EV 后移 |
| 10/6/5/1/7 分母 | pass | 未引入伪造 outbound event family |
| sibling blocker 误写 ready | pass | positive ceiling 明确 blocked/waiting/unknown |

## 12. 回填草稿与进入条件

正式 §6 应按上述切口和用例族收口，保留代表性 TC、前置、操作、预期、断言、自动化候选和候选证据族；完整批次与停审记录留在本文件。

- [x] 每个 P0 切口至少有正向 / 负向候选。
- [x] Query no-write、Job no-truth-repair、unknown key preservation 已单列。
- [x] 可进入 Step 7。
