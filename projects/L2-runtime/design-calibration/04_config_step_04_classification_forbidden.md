# L2-runtime 04 配置设计 Step 4：配置分类与禁止配置化边界

> 创建日期：2026-08-17
> 状态：`done`
> 当前模块：`classification / forbidden_invariants`
> 回填位置：正式 `04-配置设计.md` 第 4 章

## 1. Step 开工确认

| 检查 | 结论 |
|---|---|
| 当前恢复点 | Step 4；Step 1~3 已通过 |
| 输入 | 5 control planes、12 domains、03 state/UoW/security/owner invariants |
| 本步输出 | 分类表、逐域分类、禁止项、变更流程、停审和跨分类审计 |
| 禁止 | 不列具体 leaf/default/source；不把 fixed variant 暴露为伪配置 |

## 2. SOP 问题回答

### 2.1 当前有哪些配置类别

| 类别 | 含义 | 示例域 | P0 生效方式 | 风险 |
|---|---|---|---|---|
| `bootstrap` | 决定 schema、entry composition 和 source identity | CFG-01 | startup | 错误 facade/entry 暴露 |
| `bounded-policy` | 在静态不变量内选择有限策略或上限 | CFG-02~10 | startup snapshot | 扩权、fail-open、容量无界 |
| `dependency-posture` | 声明 external slot 的负向/候选绑定姿态 | CFG-11 | startup builder | 把 Candidate 误当 ready |
| `operations-control` | 控制有界 job page 是否可候选及其技术边界 | CFG-12 | startup job registry | 重复 effect、lease/cursor 漂移 |
| `opaque-reference` | body-free contract/schema/redaction/blocker identity | CFG-05/09/11/12 | startup | owner/secret/path 泄漏 |
| `test-only` | deterministic finite fake composition | CFG-01/11 | TestFake startup | 污染非测试 profile |
| `static-derived` | typed field 由设计不变量或 exact key 派生，不是外部 leaf | 多域 | build-time design | 误开放后绕过安全规则 |

Runtime P0 没有 raw `secret` 配置类别，也没有 `debug` 开关。诊断必须 body-free 且不能放宽行为；如未来需要 credential ref 或 debug 配置，必须先重新审计 owner、安全和 03 carrier。

### 2.2 哪些允许热更新

P0 全部不允许 hot/reload。所有外部 JSON leaf 在 startup 装配后冻结；operation 捕获 snapshot ref，进程生命周期内 `current_snapshot` 不变。P1 变更是“验证新 document -> 停止旧进程/阻止新入口 -> 使用新 snapshot 重启”，不是 in-process mutation。

### 2.3 哪些只能启动读取

CFG-01~12 全部 startup。job request、command/query/event 输入中的 scope/limit/cursor 不是配置覆盖，只能在已验证 global profile 内收窄当前 operation。

### 2.4 哪些规则禁止配置化

owner、dependency category、domain state、UoW ordering、CAS、append-only、idempotency identity、Unknown fence、checkpoint proof、body/secret boundary、fake/readiness、event/outbox/projection truth 和 external retry safety 均禁止配置化。详见 §4。

### 2.5 禁止项如需改变走什么流程

- owner/责任/依赖方向变化：重开 00/01/02/03，必要时 ADR。
- typed field/enum/Port/flow/state/UoW 变化：重开 03，再重开 04。
- source/load/reload/schema 变化：至少重开 03 composition contract、04、05、06、07、09。
- upstream external truth 变化：先由 owner 正式闭合，再更新 Runtime ref/adapter contract；不能仅改配置。
- numeric production threshold：需有正式 baseline/decision source，再重开 04/05/06；不能从 demo 提升。

## 3. 配置分类表

| 类别 | 外部 JSON 可出现 | 允许值性质 | 是否可 hot | 无效姿态 |
|---|---:|---|---:|---|
| bootstrap | 是 | exact schema/profile/environment enum | 否 | startup fail-fast |
| bounded-policy | 是 | closed enum、opaque ref、显式有限数值 | 否 | startup fail-fast/affected path Blocked |
| dependency-posture | 是 | Required/Optional + Disabled/Blocked/Candidate + refs | 否 | invalid candidate fail-fast；valid Blocked stays blocked |
| operations-control | 是 | Disabled/Blocked/Candidate + positive bounds | 否 | invalid fail-fast；explicit Blocked not runnable |
| opaque-reference | 是 | typed body-free identity only | 否 | malformed/owner/schema mismatch fail-fast/block |
| test-only | 只允许 isolated fixture binding | finite fake ref/posture，不进普通 document raw secret | 否 | non-CI/TestFake fail-fast |
| static-derived | 否 | exact Rust enum/field derived from key/design | 不适用 | matching external key is `ForbiddenKey` |

## 4. 禁止配置化清单

| ID | 禁止项 | 03/架构依据 | 为什么不能开放 | 改变流程 |
|---|---|---|---|---|
| NC-L2R-001 | Runtime/Tools/Hub/Method/Sandbox/Governance/Obs/Memory truth owner | 01 owner map；03 §1 | 配置不能转移写权 | 重开 00/01/03 |
| NC-L2R-002 | compile/runtime/event/ref/adapter/fake dependency category | 01/03 dependency rules | 防伪装 package 依赖 | ADR + 01/03 |
| NC-L2R-003 | actor/scope/authority identity creation | `EntryAuthority`/`RuntimeScope` | 配置不是身份或授权来源 | entry owner + 03 |
| NC-L2R-004 | child scope strict subset/read containment | `ChildScopeRule`/`ReadScopeRule` | 防 scope expansion | 00/03 security reopen |
| NC-L2R-005 | append-only history、strict sequence | persistence invariant | 防审计历史改写 | 01/03 |
| NC-L2R-006 | expected-version CAS/no LWW | concurrency contract | 防丢更新/跨版本合并 | 03 |
| NC-L2R-007 | operation identity/digest/permanent uniqueness | idempotency contract | expiry 不得允许第二事实 | 03 |
| NC-L2R-008 | record candidate/attempt before external call | UoW-1/T2/T3 | 防未知 effect 无 fence | 03 |
| NC-L2R-009 | Unknown/CommitUnknown 禁止普通 retry | error/recovery state | 防重复外部副作用 | 00/03 |
| NC-L2R-010 | prepared/pending 不等 committed；matching receipt proof | checkpoint contract | 配置不能制造 durable fact | upstream CP + 03 |
| NC-L2R-011 | local outcome first；handoff 独立 | outcome/handoff owner | 外部 ack 不改 local outcome | 01/03 |
| NC-L2R-012 | ack/delivery/accepted/observed/evidence 分层 | event/handoff contract | 防 false positive truth | upstream owner + 03 |
| NC-L2R-013 | projection 只读 committed history、不反写 domain | projection contract | 防 read model 成第二真相 | 01/03 |
| NC-L2R-014 | late/duplicate/out-of-order event 不 reverse-write | inbox/event state | 防旧事实覆盖新事实 | 03 |
| NC-L2R-015 | raw prompt/result/body/secret/hidden reasoning 禁止进入 local truth/log/audit | body-free boundary | 防泄漏和 shadow body | security + 03 |
| NC-L2R-016 | provider endpoint/route/credential/quota/cost/billing | model owner boundary | 不归 Runtime | owning adapter design |
| NC-L2R-017 | tool execution/Sandbox isolation-cleanup/approval/registry/method body/durable memory body | upstream owner boundary | 不归 Runtime | owning project formal chain |
| NC-L2R-018 | fake 仅 TestFake + CI；fake/design/ping 不等 readiness | adapter contract | 防伪造 qualification | 03/05/06 |
| NC-L2R-019 | `Ready` state/activation | adapter state registry | 设计不存在该 variant | upstream qualification + design reopen |
| NC-L2R-020 | direct Runtime Sandbox slot/Port | canonical action topology | 唯一正向 seam 是 InvocationCaller | 01/03 reopen |
| NC-L2R-021 | slot/job identity、13/7 exact inventory | closed sets | 防 alias/extra/missing | 03/04 schema version |
| NC-L2R-022 | job operation and retry posture | `JobOperation`/`JobRetryPolicy` | 防配置放宽副作用重试 | 03 |
| NC-L2R-023 | lease required、live epoch/cursor atomicity | job state contract | 防无 lease/stale actor | 03 |
| NC-L2R-024 | handoff eligibility base rule | `LocalOutcomeAndBodyFreeMaterial` | 防把 accepted/observed 当 eligibility | 03 |
| NC-L2R-025 | recovery stable source/unknown posture | stable requirement/unknown policy | 防 unknown resume | 03 |
| NC-L2R-026 | action isolation/unknown policy和最低 guard set | guard profile invariant | 防本地 allow/fail-open | 03 |
| NC-L2R-027 | context stable ordering和 mandatory unsafe source 不可省略 | composition invariant | 防非确定性/安全省略 | 03 |
| NC-L2R-028 | retention cleanup 不删除 permanent domain proof | persistence invariant | cleanup 不是 truth deletion | 03 |
| NC-L2R-029 | in-process hot/reload、remote/admin override | Step 2 lifecycle scope | 03 无相应 command/flow/state | 重开 03~09 |
| NC-L2R-030 | implementation/test/evidence/verdict/readiness status | truth-source standard | 配置文件不是事实证明 | actual lifecycle only |

## 5. Static-derived 字段

下列 typed field 仍存在于 `RuntimeConfigSnapshot`，但不作为 JSON leaf；assembler 必须按 exact rule 构造，external document 出现同义 key 时返回 `ForbiddenKey`。

| Typed field | 派生规则 |
|---|---|
| `RuntimeScopeProfile.child_scope_rule` | always `StrictSubset` |
| `RuntimeScopeProfile.read_scope_rule` | always `ContainedOrReadOnly` |
| `ContextCompositionProfile.ordering_policy` | always `MandatoryThenStableSource` |
| `ActionGuardProfile.required_guard_kinds` | exact five: Governance/CapabilityExposure/ToolContract/IsolationRequirement/SourceFreshness |
| `ActionGuardProfile.isolation_policy` | always `RequiredForExternalSideEffect` |
| `ActionGuardProfile.unknown_policy` | always `BlockAndFence` |
| action freshness unknown disposition | always `Reject` |
| `CheckpointRecoveryProfile.stable_source_requirement` | always `CommittedCheckpointAndClosedFence` |
| `CheckpointRecoveryProfile.unknown_posture` | always `ManualReviewOrReconcile` |
| `HandoffProjectionProfile.handoff_eligibility` | always `LocalOutcomeAndBodyFreeMaterial` |
| handoff view freshness `unknown_disposition` | always `ReturnExplicitDegraded` |
| idempotency cleanup invariant | cleanup never erases permanent uniqueness/domain proof |
| `AdapterSlotConfig.slot` | derived from one of 13 exact object keys |
| `JobControl.operation` | derived from one of 7 exact object keys |
| `JobControl.retry_policy` | exact per-job mapping from §7/03 §13.4 |

## 6. 逐配置域分类边界

| 域 | 适用类别 | 不适用类别 | 域内禁止项 | 更新方式 |
|---|---|---|---|---|
| CFG-01 profile | bootstrap | test-only除 TestFake selector | readiness/deploy/source body | startup |
| CFG-02 scope | bounded-policy + static-derived | dependency/operations | identity、containment rule override | startup |
| CFG-03 context | bounded-policy + static-derived | dependency/test secret | raw body、stable order override、fail-open omission | startup |
| CFG-04 working_memory | bounded-policy | durable dependency | durable body/index/delete/retention | startup |
| CFG-05 model_decision | bounded-policy + opaque-reference | provider setting | route/secret/quota/cost/raw body | startup |
| CFG-06 action_guard | bounded-policy + static-derived | local approval | guard removal、unknown allow、isolation bypass | startup |
| CFG-07 delegation | bounded-policy | lifecycle | scope/budget expansion、member/container | startup |
| CFG-08 checkpoint_recovery | bounded-policy + static-derived | physical storage | fence close、commit proof、unknown retry | startup |
| CFG-09 handoff_projection | bounded-policy + opaque-reference + static-derived | external truth | delivery/observed/eligibility override | startup |
| CFG-10 idempotency | bounded-policy | truth deletion | permanent uniqueness expiry | startup |
| CFG-11 adapter_slots | dependency-posture + opaque-reference + test-only | provider config | Ready/endpoint/secret/Sandbox alias | startup |
| CFG-12 jobs | operations-control + opaque-reference + static-derived | scheduler config | cadence/lifecycle/retry selector | startup |

## 7. 停审与跨分类审计

| 审计项 | 结果 | 说明 |
|---|---|---|
| 12 域均有适用/不适用类别 | pass | 无 `misc/runtime/common` 泛化类别 |
| fixed single variant 未伪装为配置 | pass | 12 个 policy/safety typed values or invariants 静态派生 |
| owner/state/UoW/security 红线完整 | pass | NC-L2R-001~030 |
| hot/reload 边界一致 | pass | P0 全 startup-only |
| test fake 隔离 | pass | 只 TestFake + CI |
| P1/P2 未污染 P0 | pass | online source/reload unsupported |
| no 03 contract change | pass | 分类只决定 external exposure |

## 8. 当前问题诊断、改动前后与取舍

historical Step 4 只列了 18 个宽泛禁止项，并把若干固定 policy 当成可填写的 JSON 值。当前版本把 30 条红线映射到 owner/state/UoW/security/job/config lifecycle，并引入 `static-derived` 分类，避免“只能填 true/固定字符串”的布尔安全开关。

## 9. 对 03 的影响判定

| 配置结论 | 是否影响 03 | 影响类型 | 03 回写位置 | 处理状态 |
|---|---:|---|---|---|
| fixed policy fields不作为 JSON leaf | 否 | serialization exposure | typed fields仍由 assembler 构造 | 无回写 |
| action guard exact five + reject/fence static | 否 | 既有安全不变量 | 03 §6/13 | 无回写 |
| job operation/retry key-derived | 否 | 既有 exact mapping | 03 §13.4 | 无回写 |
| no P0 reload/hot | 否 | scope restriction | future reopen | 无回写 |

## 10. 回填草稿与下一门禁

正式 §4 写入分类表、NC-L2R-001~030、static-derived 表和逐域分类边界。不得把 fixed derived 字段重新列为外部配置项。

```text
step_04 = done
gate_status = pass
gate_reason = classifications_and_30_forbidden_invariants_closed
next_allowed_action = delete_and_rebuild_step_05_sources_precedence
formal_04_write_allowed = false
commit_required = false
```
