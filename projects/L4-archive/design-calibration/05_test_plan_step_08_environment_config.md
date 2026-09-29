# Step 8. 设计测试环境与配置矩阵

> 对应 SOP：`standards/document/测试方案讨论流程_SOP.md` Step 8
> 正式回填：`05-测试方案.md` §8
> 日期：2026-09-13
> 状态：`completed / environments_located_with_real_seams_blocked / continue_authorized`

## 1. Step 状态与 Step 内计划

| 项 | 结论 |
|---|---|
| 目标 | 将 Step 6/7 的用例与数据绑定到环境、6 个正式 profile、依赖分类和 55-key 配置覆盖 |
| 输入 | Step 6～7；正式 01 依赖分类；正式 03 §13；正式 04 §5～12 |
| gate_status | `completed / environments_located_with_real_seams_blocked` |
| gate_reason | P0 local/CI/controlled/replay 与 required-but-blocked real-seam 均可定位；未把 profile/fake 写成真实 readiness |
| next_allowed_action | 创建并完成 Step 9 |
| source_files | 05 Step 6～7；01 §8；03 §13/15；04 §5～12/14 |

| 计划项 | 产物 | 状态 | 完成门禁 |
|---|---|---|---|
| 环境与拓扑 | §6.1～6.2 | done | local/CI/controlled/replay/real-seam/release review 明确 |
| 依赖分类 | §6.3 | done | compile/runtime/event/ref/adapter/fake 不混同 |
| profile/config | §6.4～6.6 | done | 6 profiles 与 12 域/55 keys 全覆盖 |
| 数据与不可用姿态 | §6.7～6.8 | done | dataset 有环境；blocked/infra_failed 不伪 pass |
| 停审与跨审计 | §6.9 | done | 无 sibling path 越界、production fake 或 secret 假设 |

## 2. 本步输入与环境语义

| 名称 | 测试语义 | 不表示 |
|---|---|---|
| `local-dev` | schema/domain/service 快速反馈与安全负向 | 正式 evidence 或 integration ready |
| `ci-test` | deterministic automated local contract/fake/fault | durable/provider/owner conformance |
| `integration-like` | controlled adapter、slot、route、unknown mapping | production-like 或真实 commit |
| `operations-replay` | pinned identity、partial、probe/reconcile、replay | current config 重建历史或 external finality |
| `staging-like` | future formal real-seam selected run | 当前 P1/P2；合同缺失时仍 blocked |
| `production-like` | future production boundary | 当前不运行、不产 readiness |

P0 required external positive 不因 profile 被降级；它们在 `staging-like` 的执行状态仍为 `blocked`，直到 owner/provider/durable 合同、配置、数据和环境齐备。

## 3. SOP 问题回答

| 问题 | 回答 |
|---|---|
| local/CI/integration/staging 分别测什么？ | local 纯逻辑/快速负向；CI deterministic 全 P0 local；integration-like controlled seam/fault；operations-replay unknown/partial；staging-like formal real seam；production-like future。 |
| 依赖哪些服务？ | local store/UoW、authority/visibility、6 external business seams、event input、safe telemetry/report tools；具体 provider 未选。 |
| 哪些配置影响结果？ | 全部 12 域/55 keys，尤其 profile/assembly、exact slots、source/receiver maps、codec/cursor、budgets、redaction/telemetry。 |
| 哪些用 fake？ | 仅 test profiles 的 local store、negative authority/visibility、external outcome、event envelope、clock/ID、capture；production builder 永不 fallback。 |
| 环境不可用如何处理？ | 预期故障场景可断言；意外不可用为 `infrastructure_failed`；formal seam 缺前置为 `blocked`，均不能 pass。 |
| 哪些是 compile dependency？ | 仅重新核验后的 Core shared contracts candidate；其余不是 path/package dependency。 |
| runtime/event 如何协作？ | L1/source/workspace/artifact/observability/storage/security/receiver 用 runtime/ref/adapter；Bus/producer 用 event；测试用 formal vector/replay/fake，分类显式。 |

## 4. Historical material 诊断与改动前后对比

| 旧口径 | 问题 | 当前处置 |
|---|---|---|
| Docker + PostgreSQL + MinIO/S3 固定环境 | provider/实现仓尚未选 | 删除产品名；按 capability slot 与 controlled/formal seam |
| “staging 用 mock 即 E2E” | fake 不证明 authority/finality | integration-like 与 formal real-seam 永久分离 |
| 真实 secret/endpoint 写配置样例 | 安全且无 authority | 只用 opaque locator ref；明文禁止 |
| sibling repo path dependency | 把 runtime/ref/event 冒充 compile | 仅核验 Core candidate；其他全部禁止 |
| environment unavailable=skip | 可制造伪 pass | blocked/infrastructure_failed 明确不通过 |

| 项 | 改动前 | 改动后 |
|---|---|---|
| 环境 | 产品容器列表 | 风险层 + profile + capability topology |
| 配置覆盖 | 少量变量 | 12 域/55 key 逐域总数与测试矩阵 |
| external | mock success | formal vector/real seam blocked + local negative |
| release | “测试环境通过” | fixed-run raw/report review，当前未运行 |

## 5. 测试环境设计取舍

1. profile 是配置姿态，不是部署拓扑、产品选择或 readiness。
2. `integration-like` 可以使用 controlled/failure adapters，但不能产生 owner/provider conformance EV。
3. `staging-like` 承载 P0 required formal positive 与 P1 hardening；当前 blocker 不使 P0 requiredness 消失。
4. `production-like` 只保留 future boundary，不运行测试、不接 fixture、不允许 fake。
5. 具体 CI vendor、容器编排、DB/object-store/KMS 产品、endpoint、secret、命令和数值均不在本 Step 决定。

## 6. 结构化中间产物

### 6.1 环境矩阵

| 环境 | 用途 | 依赖服务 | 全局依赖类型 | 测试协作方式 | 配置/profile | 数据策略 | 风险/状态 |
|---|---|---|---|---|---|---|---|
| local unit/service | contract/domain/application 快速验证 | Core candidate、in-memory store、negative doubles | compile candidate + fake | builder/fake/spy | `local-dev` | DS RUN/CONTRACT/CP/negative | planned；非正式 evidence |
| CI deterministic | 全 P0 local/negative/fault/static | isolated store、all test doubles、capture、graph/report fixtures | compile + fake/ref | fixture/fake/fault/generated scan | `ci-test` | 全本地 DS；per-case instance | planned；harness失败=`infrastructure_failed` |
| controlled integration | slot/adapter/route/UoW mapping、unknown | capability-limited store/adapters | runtime/ref/adapter/fake | controlled outcomes + formal vector when available | `integration-like` | SOURCE/EXTERNAL/EVENT NEG + config | planned negative；positive blocked |
| replay/recovery | duplicate/partial/commit unknown/probe/pinning | replay store/read model、fixed intent/report | runtime/ref/adapter | event/artifact replay + controlled probe | `operations-replay` | OPERATION/FAULT/RACE/REPORT | planned；durable finality blocked |
| formal real-seam | owner/source/governance/crypto/storage/receiver/durable conformance | formally approved exact capabilities | runtime/event/ref/adapter; Core compile only | real-like/formal vector/real service | `staging-like` | owner/provider run namespace | required but blocked |
| production boundary | future production-safe validation | production approved services | runtime/event/ref/adapter | real only, no fixture/fake | `production-like` | future runbook | not_run/future；不产当前结论 |
| evidence/release review | raw→report→EV integrity/redaction/VETO | report/check tools + fixed run outputs | local tool/ref | generated outputs + human/Agent review | exact run profile pinned | DS REPORT/REDACTION | planned；不产生验收 verdict |

### 6.2 环境拓扑图：L4-archive 测试接缝

```text
                    [Core shared contracts candidate]
                                  |
                              [compile]
                                  v
 [API 3C+5Q] ---> [Archive services + 26 objects] <--- [Worker 5E+17J]
                          |             |
                      [runtime]     [runtime]
                          v             v
                 [Archive store/UoW] [exact adapter slots]
                          ^             ^
                    [fake/durable]   [adapter + ref]
                          |             |
          [CI/control/replay fixtures]  +--> L1 owners/workspace/artifact/observability
                                        +--> governance/integrity/storage/receivers

 trusted producers --[event]--> inbound consumer boundary
 evidence tools ----[ref]-----> fixed-run raw/report outputs
```

关键说明：

- 只有经重新核验的 Core shared contract 可形成编译期边；图不承诺当前 package path 已可用。
- L1、workspace、artifact、observability、storage 和 receiver 都不进入 Archive Cargo graph。
- `[fake]` 只存在于 local/CI/controlled test assembly，不能进入 production builder 或关闭 blocker。
- event arrival/ACK、adapter response、profile Ready、报告存在都不等于业务 commit 或 readiness。

### 6.3 测试依赖类型与协作方式

| 对象 | 实际关系 | path dependency | 测试协作 | 关键风险 |
|---|---|---:|---|---|
| `L0-core` shared contract | compile candidate | 仅核验 package/symbol/无环后允许 | exact version contract | 未核验不得假定 |
| `L0-bus` / inbound producers | event/runtime | 否 | envelope fixture、event replay、formal Bus seam | ACK/delivery 不等 local/external commit |
| identity/conversation/work/process | runtime + ref/adapter | 否 | negative stub、owner formal vector/real seam | `AR-UP-001/002` |
| governance | runtime + ref/adapter/event | 否 | decision negative vectors；formal conformance blocked | `AR-UP-003` |
| artifact | runtime + ref/adapter | 否 | ref/body boundary fixture；formal material vector blocked | `AR-UP-006` |
| workspace | runtime + ref/adapter | 否 | Auxiliary fixture only | `AR-UP-008`;不得补 canonical |
| observability | runtime + ref/adapter/event | 否 | safe capture/negative material；formal handoff blocked | `AR-UP-007` |
| integrity/signing/schema capability | runtime + adapter | 否 | typed negative outcomes；formal vector blocked | `AR-UP-004` |
| archive storage | runtime + adapter | 否 | controlled effect/probe；formal commit blocked | `AR-UP-005` |
| restore receivers | runtime + adapter/ref | 否 | per-owner negative/outcome; formal receiver blocked | `AR-UP-009` |
| `L0-sdk`/Console/Sync | downstream runtime/adapter/ref | 否 | public contract consumer checks after direction closure | `AR-ARCH-001` |
| test fakes | fake/test-only | 否 | isolated test assembly | 永不生产 fallback |
| report/redaction/dependency tools | local tool/ref | 不适用 | generated scan from source/run outputs | 静态表不能造证据 |

### 6.4 六个 profile 测试矩阵

| profile | store/UoW | authority/source | integrity/storage/lifecycle | receiver/inbound | observability | 允许结论 |
|---|---|---|---|---|---|---|
| `local-dev` | in-memory/test-only；无能力则 blocked | negative/deterministic test seam | fake blocked/negative，不造 Verified/commit | fake negative/optional local envelope | safe local capture，不是 evidence | local contract only |
| `ci-test` | isolated deterministic store/fault | exact per-class negative vectors | typed negative/unknown/probe mapping | per-owner/inbound fixture | redaction canary + sink failure | deterministic local P0 |
| `integration-like` | controlled durable-like，能力缺失 blocked | runtime/ref/adapter/formal vector when available | capability/effect/probe seam | exact owner/family route seam | safe telemetry/material ref blocked | seam semantics only |
| `operations-replay` | pinned replay state/UoW semantics | stored refs/coverage，禁止 current owner body | stored assessment/action/effect identity | pinned receiver/handoff | redacted replay signal | replay/reconcile only |
| `staging-like` | future approved durable | formal owner contracts | approved crypto/storage/governance | formal receivers/Bus | formal safe sink/material | required positive currently blocked |
| `production-like` | future production | formal required | formal required | formal required | formal required | current no-run/no-readiness |

### 6.5 55-key 配置覆盖登记

| 配置域 | key 数 | 逐键测试范围 | 关联 TC/环境 | 失败姿态 |
|---|---:|---|---|---|
| `profile` | 3 | name有限集合、schema支持、config identity唯一/冲突 | CONFIG-001/002/004；all profiles | whole candidate reject |
| `assembly` | 3 | exact registry/surface/optional totality、required freeze | CONFIG-003；CI/integration | no facade |
| `stores` | 3 | local store/context/worker control binding、UoW/CAS/probe/fence capability | UOW/CONFIG；CI/replay | assembly/surface blocked |
| `sources` | 8 | 每个 SourceClass exact binding；workspace/observability分类、selected target requiredness | AUTHORITY/CONFIG；CI/integration/staging | target-specific blocked；no fallback |
| `authority_visibility` | 3 | authority/visibility/redaction refs与 current decision | QUERY/SECURITY/CONFIG | not available/fail-fast |
| `integrity_compatibility` | 3 | exact capability/target registry、unknown/unsupported/mismatch | JOB-007/008、CONFIG | assessment blocked/unknown |
| `storage_lifecycle` | 4 | storage、decision、schedule、result retention refs；schedule不授权 | C03/J09～12、CONFIG | no dispatch/cleanup |
| `restore_receivers` | 2 | per-owner total map与schema/version | J13～17、RESTORE/CONFIG | owner item blocked |
| `inbound` | 2 | finite family/schema/trust map、unknown quarantine | CONSUMER/CONFIG | no subscribe/no ACK success |
| `operation_cursor` | 4 | operation codec/input digest与public/private cursor mapping分离 | IDEMP/QUERY/CONFIG | mutation/continuation blocked |
| `budgets` | 17 | positive bound、timeout/retry/probe/lease关系、L/L+1、job-run pinning | RESOURCE/UOW/JOB；CI/replay | fail-fast/partial/Unknown；no default |
| `observability` | 3 | telemetry finite mode、safe sink、material handoff | OBSERVE/SECURITY/CONFIG | invalid fail-fast；sink drop；handoff blocked |
| 合计 | 55 | 每键 valid + absent/invalid/冲突（按 requiredness）并覆盖 cross-field | `TC-AR-CONFIG-001～004` | 无 silent fallback/partial assembly |

### 6.6 Cross-field / source / activation 测试

| 组合 | 必须验证 | 禁止结果 |
|---|---|---|
| profile × fake/fixture | fake只在 test profiles；staging/production发现即拒绝 | production fallback fake |
| exposed surface × required slots | begin时required set冻结；每个surface exact totality | 构建后删required、marker冒handle |
| source/owner/family maps | selected set全覆盖且唯一；wrong target失败 | first-match/all-owner/workspace fallback |
| ENV winner × JSON | R2 winner完整 type/range/cross-field 校验 | 非法高优先级回退低值 |
| config identity × old work | operation/job/effect/plan使用stored pinned identity | current config重建历史 |
| budget × result completeness | 超限显式 partial/blocked/continuation | 截断后 Complete/Sealed |
| retry/probe × dispatch knowledge | MayHaveDispatched先probe；缺预算保持Unknown/manual | blind retry |
| decision/schedule × lifecycle | ref仅定位正式决定；dispatch前current recheck | schedule/ref自行授权删除 |
| telemetry × truth | enabled/disabled/failure均不改业务UoW/Query写集 | sink创建audit truth或改变结果 |
| activation | P0 cold: startup/new assembly/job-run-start/entry-local | hot/reload/LKG/dynamic replacement |

### 6.7 环境到数据集矩阵

| 环境 | 可用数据集 | 明确不可用 | 清理/隔离 |
|---|---|---|---|
| local | RUN/CONTRACT/CP/STATE-NEG/READ/local CONFIG/negative | formal source/event/external vectors | per-case value/store drop |
| CI | 所有 local、OPERATION/FAULT/RACE/REDACTION/DEPENDENCY/REPORT | formal positive/finality | run namespace + reset/zeroize |
| controlled integration | SOURCE/EVENT/EXTERNAL NEG、formal vectors仅在验证元数据完整时、CONFIG | 未闭合 real commit/authority | exact scenario namespace/adapter reset |
| replay | OPERATION/FAULT/RACE/CP2～6/REPORT、pinned refs | current owner body/current config replacement | replay namespace cleanup |
| formal real seam | SOURCE/EVENT/EXTERNAL FORMAL + provider cleanup contract | 缺 owner/version/schema/cleanup 任一项 | provider-approved run namespace；当前 blocked |
| evidence review | REPORT/REDACTION/DEPENDENCY + fixed run outputs | latest/cross-run/static evidence | isolated fixed-run tree |

### 6.8 环境不可用处理

| 场景 | 分类 | 处理 | 能否 pass |
|---|---|---|---:|
| local/CI config或harness意外不可用 | `infrastructure_failed` | 产失败结构，修复后重跑 | 否 |
| controlled dependency按case预期Unavailable | expected negative | 断言 typed disposition、zero forbidden effect | 仅该负向case可通过 |
| controlled dependency意外Unavailable | `infrastructure_failed`/failed | 不把它当预期 negative | 否 |
| formal owner/provider合同/数据/环境缺失 | `blocked` | 保存 blocker ID、缺失条件和证明上限 | 否 |
| staging/production未安排 | `not_run`/pending | 进入 residual/entry gate | 否 |
| cleanup失败或namespace不安全 | `infrastructure_failed` | 禁止后续复用/执行；保留安全诊断 | 否 |
| evidence/reporter缺raw输入 | failed/blocked | 不生成正式 EV/verdict | 否 |

### 6.9 环境 / 配置停审与跨审计

| 审计项 | 结论 | 缺口/上限 |
|---|---|---|
| 六 profiles 可定位 | 通过 | staging/production仍 future/blocked |
| 12 域/55 keys 全覆盖 | 通过 | 数值/真实ref不在本文生成 |
| compile/runtime/event/ref/adapter/fake | 通过 | Core candidate仍须实施前重核；SDK冲突保留 |
| sibling path dependency | 无 | L1/workspace/artifact/observability均禁止 |
| production fake/secret/body | 无 | profile isolation与opaque ref |
| P0 external requiredness | 保留 | formal positive为P0+blocked，不降级 |
| data→environment | 通过 | 每个 DS 类有允许环境/清理 |
| unavailable→false pass | 无 | blocked/infra_failed/not_run均非pass |
| provider/CI vendor/route/endpoint假设 | 无 | 留后续正式 owner/09 运维边界 |

## 7. 复杂度判断

采用“7 类环境 + 6 profile + 12 配置域/55 key + cross-field”四层矩阵，既逐项覆盖配置又避免复制 55 行正式 schema。正式 §8 可保留域级计数，并明确完整逐键真相仍在正式 04 §7；若未来 04 key 改变，必须触发本矩阵重审。

## 8. 回填草稿

正式 §8 应保留环境矩阵与拓扑、依赖分类、profile 表、55-key 域级覆盖、cross-field、数据映射和不可用姿态。核心结论：profile 不等环境/ready；runtime/event/ref/adapter/fake 不得伪装 compile；external P0 positive 在 formal real-seam 环境 required-but-blocked；任何 unexpected unavailable、cleanup failure 或 missing raw evidence 都不能 pass。

## 9. 对上游设计的影响与待确认

| 项 | 结论 |
|---|---|
| 03/04 回写缺口 | 无；环境严格使用 04 的 6 profiles、12 domains、55 keys 与 cold activation |
| 新 blocker | 无 |
| 持续 blocker | 12 upstream + 6 local；尤其 Core package核验、formal vectors、durable/provider、numeric authority |
| Step 9 输入 | suite/gate/script必须使用本 Step environment/profile，且不能发明未登记 config key/CLI |

## 10. 进入 Step 9 门禁

- [x] P0 local/CI/controlled/replay 和 formal real-seam 环境可定位。
- [x] 6 profiles、12 配置域、55 keys 与 cross-field/activation 均有测试入口。
- [x] compile/runtime/event/ref/adapter/fake 分类完整，无 sibling path 越界。
- [x] formal positive、environment unavailable、cleanup/evidence failure 不会伪 pass。
- [x] 环境与数据、配置、blocker 双向映射通过。
- [x] 允许进入 Step 9。
