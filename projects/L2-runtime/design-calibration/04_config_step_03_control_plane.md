# L2-runtime 04 配置设计 Step 3：配置控制面与配置域

> 创建日期：2026-08-17
> 状态：`done`
> 当前模块：`control_plane / domain_partition`
> 回填位置：正式 `04-配置设计.md` 第 3 章

## 1. Step 开工确认

| 检查 | 结论 |
|---|---|
| 当前恢复点 | Step 3；Step 1~2 已通过 |
| 输入 | 12-root 范围、03 typed snapshot/builder/entry contract、架构 owner 边界 |
| 本步只回答 | 配置从哪里进入、由谁读取、控制哪些模块、拆成哪些域 |
| 本步不回答 | 具体 leaf、默认值、来源优先级、环境矩阵、加载算法 |
| 禁止 | 不创建 Step 4，不写正式 04，不新增 shadow config owner |

## 2. SOP 问题回答

### 2.1 配置从哪些来源读取

P0 只有一个 entry-selected project-local strict JSON document。`entry_profile` 可由一个 allow-listed entry selector 作一致性断言，source locator 可由一个 allow-listed locator selector 提供；两者不构成任意环境变量覆盖层。静态 typed derivation 用于 key identity、fixed invariant 和 safe negative posture，不是第二份 JSON。TestFake fixture 仅在 isolated CI TestFake composition 中替代外部 adapter realization，不覆盖生产候选 JSON。

### 2.2 唯一装配入口是什么

raw bytes 只能进入 `infra::config` composition root。该入口依次执行 source attribution、strict parse、exact-root validation、typed mapping、cross-field validation、snapshot identity/summary assembly，然后把 `RuntimeConfigSnapshot` 交给 `RuntimeBuilder`。任何 application service、domain object、repository、adapter 或 job runner 都不得直接读取 file/env。

### 2.3 哪些模块读取配置

| 读取者 | 允许读取 | 禁止读取 |
|---|---|---|
| config source/loader | raw bytes、body-free source ref、entry selector | domain/repository truth、raw credential |
| config parser/validator | 12-root candidate、typed vocabulary | external availability、network/DB |
| snapshot assembler/store | validated typed values、redacted fingerprint | raw document/path/env value |
| `RuntimeBuilder` | whole immutable snapshot + injected dependencies | raw source、dynamic owner discovery |
| application operation | captured snapshot ref + relevant typed profile | file/env、current mutable global after capture |
| job runner | captured snapshot + exact `JobControl` | scheduler/cadence/container state |
| entry facade | `RuntimeProfileKind` exposure result | policy mutation、adapter qualification |
| domain | method argument中的 typed policy only | config Port、source/env/file I/O |

### 2.4 配置控制哪些行为，不控制哪些不变量

配置可以收窄 entry surface、resource bounds、freshness、eligible policy variants、negative/candidate slot posture 和 bounded job page controls。配置不能创建 actor/scope/authority，不能改变 truth owner、状态机、事务顺序、permanent uniqueness、Unknown fence、record-before-call、projection read-only 或 upstream fact。

### 2.5 配置变化影响哪些下游

- 05：parser/validator/cross-field/builder/entry/operation-capture 的测试矩阵。
- 06：strict schema、安全 forbidden、profile/slot/job、startup atomicity 的否决门禁。
- 07：config module/type/error/fixture/file boundary 和实现顺序。
- 09：source locator、文件权限、credential injection、发布/rollback/restart 和 alert routing。

### 2.6 配置控制面应拆成哪些域

严格拆为 12 个顶层域，与 `RuntimeConfigSnapshot` 的 profile/9 policy/slot/job 所有权 1:1 对齐；不增加 `limits/secrets/observability/providers/storage/runtime/common/misc` 等 shadow 或泛化域。

## 3. 配置来源链图：L2-runtime 配置进入 typed snapshot

```text
[entry-selected config source ref]
                |
                v
      [one strict JSON document]
                |
                v
 [duplicate-aware exact parser]
                |
                v
 [12-domain typed candidate]
                |
                v
 [type + cross-field + forbidden validation]
                |
                v
 [immutable RuntimeConfigSnapshot]
                |
                v
 [RuntimeBuilder dependency validation]
                |
       +--------+--------+
       |        |        |
      Api     Worker    Jobs

[TestFake fixture/finite fakes]
                |
                +--> only TestFake + ci_contract composition
```

关键说明：

- 该图表达逻辑来源与装配顺序，不表达文件路径、启动命令、容器挂载或具体 parser crate。
- selector 只能选择 source 或断言 entry profile，不能按 env 任意覆盖 leaf。
- `RuntimeConfigSnapshot` 是唯一运行时 typed config；raw candidate 不进入 application/domain。
- builder 的 `Bound` 不是 readiness；外部 slot 即使 `Candidate` 仍需实现期 qualification。
- P0 每个进程只发布启动 snapshot；不存在图中未画出的在线 reload 分支。

## 4. 配置控制面

| ID | 控制面 | 作用 | 对应 03 模块 | P0 | 禁止越界 |
|---|---|---|---|---:|---|
| CP-01 | source/schema bootstrap | source attribution、format/schema/profile identity | infra config + entry | 是 | path/command/deployment truth |
| CP-02 | runtime policy | 9 typed policy 的可选值和边界 | domain policy + application services | 是 | domain truth/state transition |
| CP-03 | dependency posture | 13 external slot 的 requirement/activation/ref/blocker | builder + external Ports/adapters | 是 | owner readiness/route/secret |
| CP-04 | operations control | 7 job 的 activation/lease/page/attempt | jobs/lease/job-state | 是 | scheduler/cadence/member lifecycle |
| CP-05 | lifecycle safety | parse/validate/publish/failure/change/audit/rollback | infra config/builder/safe observation seam | 是 | observability backend/evidence |

## 5. 十二个配置域

| ID | 顶层域 | 唯一 typed owner/target | 允许控制 | 禁止控制 | 主要读取者 |
|---|---|---|---|---|---|
| CFG-01 | `profile` | `config_schema_version` + `RuntimeProfileKind`; environment class loader-only | schema、entry、validation environment | readiness、process topology | loader/builder/entry |
| CFG-02 | `scope` | `RuntimeScopeProfile` | exact entry authorities、child/read policy | actor/scope creation、containment放宽 | admission/query/delegation |
| CFG-03 | `context` | `ContextCompositionProfile` | segment/weight/omission/order/freshness | raw body、mandatory unsafe omission | context/model |
| CFG-04 | `working_memory` | `WorkingMemoryProfile` | window count、compaction trigger、stale handling | durable body/index/retention/delete | context/J03 |
| CFG-05 | `model_decision` | `ModelDecisionProfile` | purposes、logical selection bounds、semantic ref、context requirement | provider/product/route/secret/quota/cost | model service/builder |
| CFG-06 | `action_guard` | `ActionGuardProfile` | required guards、effect allow-list、freshness | local approval/execution/unknown allow | action service |
| CFG-07 | `delegation` | `DelegationProfile` | enabled、depth/turn/action/context/duration upper bounds | child/member/container lifecycle、scope expansion | delegation service |
| CFG-08 | `checkpoint_recovery` | `CheckpointRecoveryProfile` | allowed recovery modes | stable/unknown invariant、fence closure、physical commit | recovery/J04/J05 |
| CFG-09 | `handoff_projection` | `HandoffProjectionProfile` | projection page/freshness/redaction ref | local outcome eligibility invariant、delivery/observed | handoff/query/J01/J06 |
| CFG-10 | `idempotency` | `IdempotencyProfile` | four cleanup retentions、digest schema | permanent uniqueness、exactly-once | operation/inbox/job cleanup |
| CFG-11 | `adapter_slots` | `AdapterSlotConfigSet` | exact 13 requirement/activation/ref/schema/blocker | endpoint/secret/Ready/Sandbox shadow slot | builder/adapters |
| CFG-12 | `jobs` | `JobControlSet` | exact 7 activation/partition/lease/page/attempt | operation identity、retry posture、scheduler/cadence | job runner/service |

## 6. Typed assembly ownership

```text
profile.entry_profile ---------------------> RuntimeProfile.kind
scope..idempotency ------------------------> RuntimeProfile.<same_name>
each policy root.version ------------------> RuntimePolicyVersionSet.<same_name>
adapter_slots.<canonical_key> -------------> AdapterSlotConfigSet.<same_name>
jobs.<canonical_key> ----------------------> JobControlSet.<same_name>
profile.config_schema_version -------------> RuntimeConfigSnapshot.config_schema_version
profile.environment_class -----------------> validation context only; not persisted
validated source identity -----------------> ConfigValidationSummary.source_fingerprint
```

No second policy set, generic map, dynamic slot registry, arbitrary job registry or global limits object is permitted.

## 7. 配置域停审记录

| 域 | 来源控制面 | 允许/禁止边界 | 03 anchor | 停审结论 |
|---|---|---|---|---|
| CFG-01 | CP-01/05 | schema/entry/env validation；no readiness/deploy | snapshot/profile kind | pass |
| CFG-02 | CP-02 | authority allow-list；no identity/scope expansion | scope profile | pass |
| CFG-03 | CP-02 | composition bounds；no raw body/fail-open | context profile | pass |
| CFG-04 | CP-02/04 | working window only；no durable owner | memory profile/J03 | pass |
| CFG-05 | CP-02/03 | provider-neutral bounds/ref；no provider settings | model profile/slots | pass |
| CFG-06 | CP-02/03 | guard requirements；no truth creation | action profile | pass |
| CFG-07 | CP-02/03 | child upper bounds；no lifecycle | delegation profile | pass |
| CFG-08 | CP-02/04 | mode subset；stable/fence static | recovery profile/J04/J05 | pass |
| CFG-09 | CP-02/03/04 | page/freshness/redaction；no delivery/observed | handoff profile/J01/J06 | pass |
| CFG-10 | CP-02/05 | cleanup durations/digest；no uniqueness expiry | idempotency profile | pass |
| CFG-11 | CP-03/05 | exact posture/ref；no endpoint/Ready | slot set/builder | pass |
| CFG-12 | CP-04/05 | bounded pages；operation/retry static | job set/runner | pass |

## 8. 跨控制面审计

| 审计项 | 结论 | 修正/理由 |
|---|---|---|
| control overlap | pass | activation only in slot/job; policy roots do not duplicate it |
| numeric owner | pass | context/memory/delegation/handoff/idempotency/job each owns consumed value; no limits root |
| observation duplication | pass | redaction在 CFG-09，event/handoff posture在 CFG-11；不建 observability root |
| secret/provider leakage | pass | CP-03 stores only opaque non-secret contract/schema refs |
| raw source readers | pass | only infra config reads raw source |
| dynamic map | pass | 12 roots/13 slots/7 jobs all closed structs |
| test fake contamination | pass | fixture branch only TestFake + CI |
| detailed-design impact | pass | every domain maps existing exact typed owner |

## 9. 当前问题诊断、改动前后与取舍

| 维度 | historical Step 3 | 当前 Step 3 |
|---|---|---|
| source chain | file + broad env override | one document + selector/assertion only |
| lifecycle | implied reload | startup-only P0 |
| owner | second policy/limits carriers | one `RuntimeProfile`, exact slot/job sets |
| readers | 未明确 raw reader prohibition | only infra config reads raw source |
| environment | 混入 runtime truth | validation context only |

选择 closed roots/structs 而非 map，是为了让 duplicate、unknown、missing、alias 和 field-to-type 映射可静态测试；选择 key-derived slot/job identity，是为了消除对象内 identity 与 key 不一致的可能。

## 10. 对 03 的影响判定

| 配置结论 | 是否影响 03 | 影响类型 | 03 回写位置 | 处理状态 |
|---|---:|---|---|---|
| raw source 只在 infra config | 否 | layering clarification | 03 §4/13 已允许 | 无回写 |
| 12 roots 1:1 typed assembly | 否 | serialization mapping | 03 §13 | 无回写 |
| environment class 不进入 snapshot | 否 | loader validation context | 不适用 | 无回写 |
| slot/job identity 由 exact key 派生 | 否 | external JSON mapping | existing enum/set | 无回写 |
| no reload branch P0 | 否 | lifecycle scope | future reopen only | 无回写 |

## 11. 回填草稿与下一门禁

正式 §3 应包含来源链图、CP-01~05、CFG-01~12、typed assembly mapping 和 raw-reader prohibition；不能写具体 JSON leaf、路径或实现 crate choice。

| 下一步条件 | 结果 |
|---|---|
| 来源链/装配入口清楚 | pass |
| 12 域均有允许/禁止/03 anchor/读取者 | pass |
| 域停审完成 | pass |
| 跨控制面无重复 owner | pass |
| 无 03 待回写或上游 readiness fabrication | pass |

```text
step_03 = done
gate_status = pass
gate_reason = five_control_planes_and_twelve_exact_domains_closed
next_allowed_action = delete_and_rebuild_step_04_classification_forbidden
formal_04_write_allowed = false
commit_required = false
```
