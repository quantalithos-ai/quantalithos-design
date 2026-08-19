# L2-runtime 04 配置设计 Step 6：环境与入口 Profile 矩阵

> 创建日期：2026-08-17
> 状态：`done`
> 当前模块：`environment / entry_profile_matrix`
> 回填位置：正式 `04-配置设计.md` 第 6 章

## 1. Step 开工确认

| 检查 | 结论 |
|---|---|
| 当前恢复点 | Step 6；Step 1~5 已通过 |
| 输入 | one-document source、`RuntimeProfileKind`、13 slots、7 jobs、fake/redaction boundaries |
| 本步输出 | environment matrix、entry matrix、组合 gate、差异测试输入 |
| 禁止 | 不把 environment 写成 readiness，不选择部署拓扑或 credential source |

## 2. SOP 问题回答

### 2.1 local/CI/test/staging/prod 是否适用

使用四个 validation class：`local_contract`、`ci_contract`、`integration_candidate`、`production_candidate`。不建立单独 `test`（由 CI/TestFake 覆盖）或 `staging` readiness class；部署平台可把某环境实例映射到 `integration_candidate`，但映射不产生 readiness。

### 2.2 每个环境来源是什么

均使用 Step 5 的 one selected strict JSON。CI TestFake 可以从 isolated fixture source 选择同一 schema 的 document；其他环境不允许 fixture source。环境 class 不改变 source precedence。

### 2.3 每个环境依赖哪些外部服务

配置只验证 slot posture，不枚举/选择服务实例。local 可将外部 slot Disabled/Blocked；CI TestFake 可显式绑定 finite fakes；integration/production candidate 只有在 formal contract/schema 和实现期 qualification 输入存在时才允许 `Candidate`，否则保持 Blocked。

### 2.4 敏感配置如何处理

所有环境都禁止 raw credential、endpoint、route、quota、cost 和 provider secret。CI fixture 也不能含真实秘密。实际 credential injection 由 owning adapter/deployment security boundary 处理，不进入 Runtime snapshot。

### 2.5 哪些差异进入测试验收

unknown key/type/cross-field/secret forbidden 在四环境一致；差异集中在允许 entry、fake、external Candidate 和 positive entry requirement。测试必须覆盖所有允许/禁止组合和“candidate 不等 readiness”。

## 3. 两条正交轴

```text
environment validation class
  local_contract | ci_contract | integration_candidate | production_candidate
                            X
entry profile
              Api | Worker | Jobs | TestFake
                            |
                            v
          source + slot + job + fake validation
                            |
                            v
          one immutable RuntimeConfigSnapshot
```

`environment_class` 只存在于 raw `profile` 和 validator context；不进入 `RuntimeConfigSnapshot`。`entry_profile` 映射 `RuntimeProfile.kind`，决定 builder 暴露的 facade。两轴不能互相替代。

## 4. Environment class 矩阵

| environment class | 用途 | source | allowed entries | external posture | fake | 状态含义 |
|---|---|---|---|---|---|---|
| `local_contract` | 本地 schema/domain/application/negative composition | selected local document | Api/Worker/Jobs | Disabled/Blocked；Candidate 仅在 formal refs 完整但仍无 readiness | 禁止 auto-bind | planned local contract posture |
| `ci_contract` | deterministic contract/state/flow/failure tests | isolated fixture-selected document | TestFake only | explicit finite fake bindings；仍需 exact slot config | 允许 finite fake | planned test posture only |
| `integration_candidate` | formal upstream contract 候选集成装配 | reviewed selected document | Api/Worker/Jobs | Candidate only with contract/schema/blocker closure input；otherwise Blocked | 禁止 | planned/blocked candidate |
| `production_candidate` | 未来生产候选的 strict validation/build preparation | reviewed selected document | Api/Worker/Jobs | Candidate additionally waits implementation/deployment qualification；otherwise Blocked | 严禁 | planned/blocked candidate |

禁止 environment literal：`ready`、`integration_ready`、`staging_ready`、`production_ready`、`live`。unknown enum 必须 fail-fast。

## 5. Entry profile 矩阵

| entry | exact default authorities | required local capabilities | conditional external slots | job posture | 禁止 |
|---|---|---|---|---|---|
| `api` | `command_api`,`query_api`,`internal_loop` | clock/ID/digest/UoW/reservation/all local truth repos/config/visibility | governance/definition/source/memory/capability/materializer/model/invocation/child/checkpoint/handoff/projection per exposed operation | all 7 Disabled | worker ACK、scheduler、fake auto-bind |
| `worker` | `inbound_event_worker`,`continuation_worker`,`internal_loop` | clock/ID/digest/UoW/inbox/history/target repos/config/ACK mapper | source/model/invocation/child/handoff/publisher according to event/continuation | all 7 Disabled | API route、direct repo mutation、scheduler |
| `jobs` | `operations_job`,`internal_loop` | clock/digest/UoW/lease/job state/local repos/config | exact slots required by each Candidate job | each job explicit Disabled/Blocked/Candidate | unleased page、scheduler/container ownership |
| `test_fake` | nonempty explicit subset of six authorities | deterministic complete local fake set | explicitly named finite fake/blocked slots | explicit finite test set | production/integration use、readiness claim |

默认 authorities 是 fail-closed exposure set，不允许 JSON 增加与 entry 不兼容的 authority；JSON 可在默认集合内进一步收窄，但不能为空且不能移除该 profile 必需的 `internal_loop`。

## 6. Environment x entry 组合 gate

| environment \ entry | Api | Worker | Jobs | TestFake |
|---|---|---|---|---|
| local_contract | allowed negative/candidate composition | allowed negative/candidate composition | allowed；jobs explicit posture | forbidden |
| ci_contract | forbidden | forbidden | forbidden | required/allowed |
| integration_candidate | allowed but positive paths may remain blocked | allowed but positive paths may remain blocked | allowed but jobs may remain blocked | forbidden |
| production_candidate | allowed but not ready | allowed but not ready | allowed but not ready | forbidden |

`allowed` 仅表示配置组合可通过该维度检查；最终仍需 local dependency、slot/job cross-field 和 builder validation。

## 7. Slot posture 矩阵

| Slot category | local | CI TestFake | integration candidate | production candidate |
|---|---|---|---|---|
| required local repository/technical dependency | must be present; not in adapter slots | deterministic fake local set | must be present | must be present and qualified by implementation process |
| open upstream external slot | Blocked/Disabled | explicit finite fake or Blocked | Blocked until contract/schema close | Blocked until contract + implementation qualification |
| `Candidate` external slot | ref/schema complete; still no readiness | fake binding only | may attempt qualification | may enter builder candidate; no readiness |
| fake adapter | forbidden | allowed exact fake registry | forbidden | forbidden |
| `Ready` | forbidden | forbidden | forbidden | forbidden |

## 8. Job posture 矩阵

| Job | Api | Worker | Jobs/local | Jobs/integration/production | TestFake |
|---|---|---|---|---|---|
| rebuild safe views | Disabled | Disabled | Disabled/Blocked | Candidate only with projection/history contract | finite candidate/blocked test |
| refresh source snapshots | Disabled | Disabled | Disabled/Blocked | Candidate only with source resolver | finite candidate/blocked test |
| compact working memory | Disabled | Disabled | Disabled/Candidate if local stores complete | Candidate if local stores qualified | finite candidate test |
| resume eligible runs | Disabled | Disabled | Disabled/Blocked | Candidate only after CP contract + closed fence path qualification | negative/reconcile test |
| reconcile unknown effects | Disabled | Disabled | Disabled/Blocked | Candidate only with status-only owner seams | finite status fake |
| reconcile handoff gaps | Disabled | Disabled | Disabled/Blocked | Candidate only with handoff status/ack seam | finite ack/gap fake |
| publish runtime outbox | Disabled | Disabled | Disabled/Blocked | Candidate only with exact event publisher contract | exact-payload fake |

Api/Worker profiles require all job controls present as exact closed objects but activation must be `Disabled`; this preserves one schema without exposing runners.

## 9. Sensitive/secret 与 observation 差异

| 检查 | local | CI | integration | production |
|---|---|---|---|---|
| raw secret/provider route | forbidden | forbidden | forbidden | forbidden |
| full source locator in log | forbidden | forbidden | forbidden | forbidden |
| opaque contract/schema/redaction ref | allowed selected document | synthetic non-secret ref | reviewed typed ref | reviewed typed ref |
| observation backend config | absent | fake sink external to snapshot | external seam only | external seam only |
| evidence/readiness claim | forbidden | forbidden | forbidden | forbidden |

## 10. 差异测试和验收输入

| ID | 场景 | 预期 |
|---|---|---|
| PM-01 | CI + non-TestFake | startup reject |
| PM-02 | TestFake + non-CI | startup reject |
| PM-03 | any non-TestFake + fake binding | `FakeBindingForbidden` |
| PM-04 | Api/Worker + any Candidate job | cross-field reject |
| PM-05 | Jobs + Candidate job + required slot Blocked | explicit job Blocked or candidate reject；不得运行 |
| PM-06 | integration Candidate slot without contract/schema | startup reject |
| PM-07 | production Candidate with design file/ping only | remains unqualified; no readiness |
| PM-08 | unknown/readiness-labelled environment | enum reject |
| PM-09 | raw secret in any environment | security reject |
| PM-10 | allowed authorities expand profile default | cross-field reject |
| PM-11 | request/job value narrows snapshot | accept current operation only |
| PM-12 | request/job value exceeds snapshot | reject current operation |

## 11. 当前问题诊断、取舍与 03 影响

historical Step 6 把 `Candidate` 与 profile/environment 关系写得过于宽松，并没有规定 Api/Worker 必须把 7 job 明确 Disabled。当前矩阵把 schema presence、entry exposure、job runner exposure、fake isolation 和 external qualification 分开。

| 配置结论 | 是否影响 03 | 影响类型 | 03 回写位置 | 处理状态 |
|---|---:|---|---|---|
| environment loader-only | 否 | validation context | 04 专属 | 无回写 |
| profile exact authority defaults and subset | 否 | external mapping to existing enum | 03 §6.8/13 | 无回写 |
| Api/Worker jobs exact but Disabled | 否 | config cross-field | existing JobControlSet | 无回写 |
| Candidate never readiness | 否 | existing state semantics | 03 SM-17 | 无回写 |

## 12. 回填草稿与下一门禁

正式 §6 写入两轴图、4 environment、4 entry、4x4 gate、slot/job/security matrices 和 PM-01~12。不得写实例名、path、credential、deployment command 或 readiness。

```text
step_06 = done
gate_status = pass
gate_reason = environment_entry_slot_job_fake_matrix_closed
next_allowed_action = delete_and_rebuild_step_07_items_and_annexes
formal_04_write_allowed = false
commit_required = false
```
