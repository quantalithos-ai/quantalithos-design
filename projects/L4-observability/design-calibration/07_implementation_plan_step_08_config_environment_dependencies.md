# L4-observability 07-实施计划 Step 08：配置、环境与外部依赖准备

> 对应 SOP：`standards/document/实施计划讨论流程_SOP.md` Step 8
> 对应书写规范：`standards/document/实施计划书写规范.md` §5.8
> 直接输入：current Step 03、Step 05~07、`01-架构设计.md`、`03-详细设计.md`、`04-配置设计.md`、`05-测试方案.md`
> 文档性质：设计讨论中间产物。本文定义 future readiness contract，不声称任何目标仓、CI、store、bus、provider 或 RuntimeLike 实例已建立。

## 1. Step 状态

| 项 | 当前值 |
|---|---|
| project | `L4-observability` |
| document | `07-实施计划` |
| step | `Step 08 / 配置、环境与外部依赖准备` |
| mode | `full-restart` |
| status | `completed_current_step_08` |
| current module | `config-environment-external-dependency-readiness` |
| target repo reality | `/home/aris/Projects/quantalithos-observability` absent |
| compile dependency reality | `/home/aris/Projects/quantalithos-core/crates/contracts` present；package=`core-contracts`；crate=`core_contracts` |
| runtime/event reality | Bus/identity/governance 等部分仓存在；artifact/runtime/sandbox/archive/capability 等部分仓不存在；均不构成 Cargo dependency |
| environment reality | local/CI/INT/RuntimeLike instance 与 runner 均未核验或未建立 |
| design gate | `pass_with_reality_preconditions` |
| new upstream blocker | `none` |
| inherited affected | 12 项保持 open/controlled/conditional |
| next allowed action | `continue_to_step_09` |
| current commit | 不需要；用户未要求提交 |

## 2. Step 内计划与执行记录

| 计划项 | 产物 | 状态 | 完成门禁 |
|---|---|---|---|
| 读取 config/profile/activation/current dependency rules | 配置与依赖基线 | done | 3 profile、6 lane、13 stages、25 failure 和 dependency type 可定位 |
| 核验本机 repo/path reality | reality inventory | done | target/core/adjacent repo存在性不被猜测 |
| 定义外部依赖与 fake 边界 | dependency/fake matrix | done | compile/runtime/event/handoff 分类清楚 |
| 映射 phase/boundary readiness | phase/boundary matrix | done | 每个 boundary 有检查方式和不可用处置 |
| 审计配置不变量和 affected | cross-readiness audit | done | config不改变truth/redaction/no-write/phase；affected不关闭 |

## 3. 输入权威与历史诊断

| 输入 | Current 结论 | Historical/冲突处置 |
|---|---|---|
| `04-配置设计.md` | `ValidatedObservabilityConfig`、10 sections、61 ENV、3 profile、6 lane、`VAL-S01~S13`、13-stage complete-or-error、25 failures | 旧 local-dev/ci-test/operations-replay 别名、产品默认和hot reload不继承 |
| `03-详细设计.md` | 七 crate、only-core compile dependency、product-neutral ports/adapters、five façades、least-authority entry | 不引入具体产品 SDK、DDL、endpoint、topic或provider正文 |
| `05-测试方案.md` | lane/profile真实性、82 DS、9 suite和canonical artifact/report root | 环境未建立保持 not_run/not_evaluated，不以低等级替代 |
| Step 03 | target/worktree/git/dependency/script/ledger前置 | Step 13创建current ledger后才能授权实现 |
| 旧 Step 08 / README | `historical_material` | TimescaleDB/Grafana/Prometheus/OTel collector/P95/retention days不进入P0前置 |

## 4. 配置准备基线

### 4.1 Source 与 schema

| 配置面 | Current 规则 | 准备/检查 | 失败处理 |
|---|---|---|---|
| ordinary source | `SRC-DECL < one strict JSON < 61 allowlisted ENV` | parser fixture + exact ENV registry | invalid winner拒绝whole candidate；不fallback低层 |
| root schema | `profile` + `technical/boundary/safety/stores/digest/idempotency/projection/execution/external/entries` | typed candidate roundtrip/unknown-field test | unknown/duplicate/alias/type/range错误=`InvalidConfiguration` |
| sensitive | root只持typed opaque ref；secret/material只在adapter private memory | resolver/serialization/output spies | 缺required locator=`SensitiveReferenceUnavailable`；不输出material |
| history | old Job/outbox/intent/preparation读取stored config/binding/token | restart/historical fixture | missing old binding=manual/unavailable；不读current config替代 |
| safety | forbidden body、redaction、truth owner、no-write、dependency不能配置关闭 | redline corpus + static checks | 任一 bypass 是hard blocker/VF |

### 4.2 Runtime class 与 lane

| Lane/profile | 合法 store/clock/external mode | Current reality | 不可用时处理 |
|---|---|---|---|
| `ENV-LCL-ISO` / `LocalTest` | InMemory或Durable；System/Runtime或Fixed/Deterministic；Fake/Controlled/Disabled | contract defined；instance not established | local not_run；不能证明durability或release evidence |
| `ENV-LCL-INT` / `IntegrationLike` | Durable + System/Runtime；Controlled/Endpoint/Disabled | not evaluated | local INT blocked/not_run；不fallback ISO |
| `ENV-CI-ISO` / `LocalTest` | InMemory；CI-safe Fake/Controlled/Disabled；禁production credential | pipeline absent | required subset blocked/not_run；不生成empty/static artifact |
| `ENV-CI-INT` / `IntegrationLike` | Durable + System/Runtime；Controlled/Endpoint/Disabled | services/schema/capability not verified | INT rows blocked/not_run；fake结果不能替代 |
| `ENV-STG-RT` / `RuntimeLike` | Durable + System/Runtime；Endpoint/Disabled；managed locator | instance/topology/credential absent | `not_evaluated`；不能用CI、fixture或截图填充 |
| `ENV-PRD-RT` / `RuntimeLike` | production Durable/Endpoint/Disabled + stored historical binding | out of scope/unestablished | 本轮不执行；不构成验收事实 |

`LocalTest + Endpoint`、`IntegrationLike + InMemory/Fake/Fixed/Deterministic`、`RuntimeLike + InMemory/Fake/Controlled/Fixed/Deterministic` 均是 `InvalidConfiguration`。`Disabled` 只适用于正式 optional exact surface，不把 required capability 缺失变成成功。

### 4.3 `VAL-S01~S13` 与 assembly

```text
source capture -> strict parse -> required/canonical/profile/redline validation
  -> config identity -> private resolution -> store qualification
  -> technical/external/availability builders -> five facade composition
  -> API/worker/jobs least-authority slices -> BuiltObservabilityRuntime
  -> prepare-all -> totality -> arm-all
```

任一阶段失败必须 reverse cleanup 并保持 zero exposed partial runtime。builder ready 不等于 activated；activation、drain、rollback、retirement和审计由host/control boundary另行执行。Worker/jobs不能获得raw root、locator、private registry、repository、UoW或concrete adapter。

## 5. 本机仓库与工具 Reality inventory

| 项目/路径 | 类型 | 本机状态 | Current 引用方式 | 不可用时处理 |
|---|---|---|---|---|
| `/home/aris/Projects/quantalithos-observability` | target implementation repo | absent | PH-01/`commit-01-a`唯一允许确认/创建 | 当前implementation blocked；不得在设计仓写代码 |
| `/home/aris/Projects/quantalithos-core/crates/contracts` | compile dependency | present | `core-contracts = { path = "../quantalithos-core/crates/contracts" }`候选；Rust import=`core_contracts` | 目标仓创建后复核路径、version、public type；不匹配则blocked |
| `quantalithos-bus` | event collaboration | present | transport/consumer/publisher adapter/event seam | 不写Cargo path；不可用时fixture/Controlled或blocked by requiredness |
| identity/governance/process/work | runtime/ref/event collaborators | present | typed ref/safe summary/event/resolver fake | 不写Cargo path；不读取/写入业务正文 truth |
| artifact | runtime/evidence collaborator | absent | I05 typed evidence context/runtime seam | I05 positive保持blocked；不得本地发明schema/binding |
| capability-hub/runtime/sandbox/archive | runtime/ref/event/handoff collaborators | absent | product-neutral adapter、Disabled/Unavailable、controlled fixture | positive product/runtime path blocked/not_evaluated；核心边界不得假绿 |
| SDK/console/report/GRC/external products | downstream/runtime consumers | mixed/未选择 | handoff/export/read-only adapter | 不作为P0硬前置或truth source；未选择显式unsupported/disabled |
| Rust/Cargo/git/shell tools | implementation tools | target repo内未核验 | Step 03前置命令和boundary required checks | `commit-01-a`开工先核验；缺失则pause |

路径存在不等于 capability 可用；相邻仓缺失也不授权 shadow DTO、source body copy或编译期依赖。只有 `core-contracts` 能进入 Cargo。

## 6. External dependency preparation

| Dependency family | 依赖类型 | 使用阶段 | 所需最小输入 | Fake/Controlled/Endpoint 边界 | 不可用时处置 |
|---|---|---|---|---|---|
| source observation/audit material | event/runtime | PH-03~04 | body-free envelope、producer/schema、safe refs/context | LocalTest fixture/Controlled；INT Endpoint可选 | required consumer缺绑定则slot不激活；I05保持blocked |
| identity/governance/artifact context | runtime/event | PH-03~04 | typed ref、safe summary、visibility/gap | 不复制owner body；fake只返回formal outcome | unavailable/rejected/gap；不补造truth |
| runtime/sandbox signal | runtime/event | PH-03~05 | safe signal summary/correlation/availability | Controlled/Endpoint按profile | explicit unavailable/degraded；无raw runtime result |
| event publisher / bus | event collaboration | PH-04~07 | committed immutable event snapshot、binding/token | LocalTest Fake；INT Controlled/Endpoint；RT Endpoint | pending/failed/dead-letter/manual；不重建payload |
| reference resolver | runtime | PH-04~06 | body-free snapshot outcome、source position | fake/controlled可测parity | unresolved/unavailable/gap；不保存external body |
| report/archive handoff | runtime/handoff | PH-06~08 | immutable preparation/input、visibility/retention/no-write readiness | fake/controlled仅formal outcome；RT Endpoint | blocked/manual/failed；Delivered非verdict |
| external audit/peripheral export | runtime/handoff | PH-06~08 | local preparation/view/consumer + stable token/binding | product-neutral；未知先probe | unsupported/unknown/manual；不盲重试/换target |
| store/UoW backend | runtime infrastructure | PH-03~07 | schema、atomic UoW、CAS/cursor/fence/claim capabilities | LocalTest InMemory；INT/RT Durable | capability mismatch fail-fast；不降级mutex/InMemory |
| telemetry sink/APM/metrics backend | runtime optional | PH-05~08 | safe schema/finite labels/body-free output | optional Disabled或profile-legal adapter | sink failure不改业务结果、不触发truth/retry |

## 7. Phase 级准备矩阵

| Phase | 开工所需配置/环境/依赖 | Readiness check | 不成立时 |
|---|---|---|---|
| PH-01 | target路径、Rust/Cargo/git、core candidate、strict JSON/ENV/script roots | repo/worktree/toolchain/metadata/path/parser dry-run | blocked；只允许创建/修正骨架 |
| PH-02 | LocalTest config、InMemory/Fake/Controlled constructors、contract corpus | `VAL-S01~S09` + contract build | design/config gap回写；不需要外部实例 |
| PH-03 | redaction/correlation policies、UoW fake、I01~I03 registration | safety ref resolution、consumer static map、write spy | required binding缺失不激活；I05不前移 |
| PH-04 | audit/evidence stores、resolver outcome、outbox snapshot | store qualification、body-free resolver、event binding | owner/body/store capability缺失blocked |
| PH-05 | projection/read stores、metric allowlist、telemetry sink availability | read fence/freshness source、metric/static checks | optional sink可degraded；read truth不能fallback |
| PH-06 | handoff/retention/job stores、claim/fence、external intent/binding | Durable INT capability、stored snapshot/token、controlled outcome | J06/external positive保持blocked/conditional |
| PH-07 | complete config、all façade、entry catalogs/registrars | `VAL-S01~S13`、prepare-all/arm-all、profile legality | zero partial activation；whole runtime失败 |
| PH-08 | runner、required lane、same-run roots、review roles | 9 suite manifest、99/82 join、report/check dry-run | missing lane/input为blocked/not_run/not_evaluated |

## 8. Boundary 配置/依赖检查

| Boundary | Required readiness | Check | Failure action |
|---|---|---|---|
| `commit-01-a` | target/worktree/toolchain/core path/workspace names | metadata/check/dependency scan | pause或修workspace；不写业务代码 |
| `commit-01-b` | root schema、61 ENV、3 profile、script/canonical roots | config/path/CLI/no-latest dry-run | whole candidate/script blocked |
| `commit-02-a` | shared refs/protocol不需external body | contract/owner/body-free checks | schema缺口回设计 |
| `commit-02-b` | LocalTest constructors/state/policy无config authority | domain/config-independent tests | domain依赖config/adapter即blocked |
| `commit-03-a` | safety policies、UoW/idempotency fake、clock/ID | service/UoW/redaction tests | missing policy/source blocked |
| `commit-03-b` | consumer catalog/schema/producer/actor map | entry/registration/completion checks | slot disabled/blocked；不broad subscribe |
| `commit-04-a` | audit/evidence store和resolver/outbox descriptors | store/UoW/body-free tests | capability/owner mismatch blocked |
| `commit-04-b` | read store/fence/visibility source | no-write/read consistency tests | no fallback/repair |
| `commit-05-a` | signal/projection store、allowlist、sink availability | projection/metric/redaction checks | optional sink degraded；schema finding blocked |
| `commit-05-b` | 14 Query repository bundle/freshness/availability | query exhaustive writer-spy | missing source不是empty success |
| `commit-06-a` | handoff/retention/evidence/historical binding inputs | immutable/no-verdict/protection tests | blocked/manual；不交付外部调用 |
| `commit-06-b` | job store/claim/fence/report/external intent | recovery/INT/no-write checks | unavailable capability保持blocked/conditional |
| `commit-07-a` | all validated bindings/facades/slices/registrars | 13-stage/profile/activation/entry tests | revoke/join all；zero partial runtime |
| `commit-07-b` | source/config/artifact/report manifest inputs | three static checks + provenance failure corpus | scanner input缺失返回nonzero |
| `commit-08-a` | actual suite runner、lane、artifact/report writable roots | gate/report dry-run + same-run join | not_run/blocked；不生成static pass |
| `commit-08-b` | acceptance/review templates和责任角色 | schema/provenance/review-state audit | draft/open；不得自动verdict/signoff |

## 9. Environment unavailable handling

| 情形 | Future 状态 | 可继续范围 | 禁止替代 |
|---|---|---|---|
| target repo absent | `blocked` | 仅 `commit-01-a` bootstrap | 在design仓或别的仓实现 |
| core path/package/type不匹配 | `blocked` | 记录差异并回设计/上游 | vendor copy、shadow type、non-core fallback |
| CI ISO pipeline absent | `not_run/blocked` | 本地设计/runner开发可继续 | empty artifact/static pass |
| durable INT unavailable | `blocked/not_run` | ISO semantic tests可独立记录 | ISO/InMemory升级为durable pass |
| STG RuntimeLike absent | `not_evaluated` | P0 design、ISO/INT和handoff初稿可继续 | CI/Controlled/截图冒充RT evidence |
| optional adapter unavailable | `Disabled/Unavailable/Degraded` | 不受影响核心面可继续 | no-op success、first target fallback |
| required adapter/capability unavailable | `blocked`或typed unavailable | fail-closed/negative case | silent Disabled/Fake |
| old binding不可解析 | `manual/unavailable` | 保留old material和open issue | current binding/reroute/重建token |
| external result unknown | `indeterminate/manual` | same-token probe/finalize-only | blind retry/new token/新target |
| telemetry sink failure | typed degraded + safe counter | 业务flow继续原结果 | telemetry控制truth/retry/acceptance |

## 10. 依赖与配置停审 / 跨项审计

| 审计项 | 结果 | 处理 |
|---|---|---|
| only-core compile dependency | pass_design；本机candidate present | target创建后复核，不能预填build pass |
| non-core sibling Cargo edge | 0 allowed | Bus/identity/governance/artifact等均runtime/event/handoff |
| profile/lane身份 | 3/6不变 | 无local-dev等alias进入current |
| complete-or-error | 13/13 stage承接 | partial façade/entry/runtime禁止暴露 |
| fake/controlled是否越过profile | 0 allowed | RT禁止Fake/Controlled/InMemory/Fixed/Deterministic |
| external product是否硬前置/truth source | 0 | product-neutral seam + explicit availability |
| required lane是否允许fallback | 0 | blocked/not_run/not_evaluated保留 |
| config是否改变redaction/no-write/truth | 0 | 无debug/emergency/profile豁免 |
| target/env readiness是否伪造成ready | no | reality状态显式记录 |
| inherited affected是否关闭 | no | 12项进入Step09风险绑定 |
| new upstream blocker | none | 可进入Step09 |

## 11. Inherited affected readiness binding

| Affected group | Readiness 影响 | Current 处置 |
|---|---|---|
| I05 schema/producer | artifact producer和consumer registration owner缺失 | slot disabled/blocked；不解析positive body |
| H13/J06 | external replay capability/owner缺失 | controlled Blocked/manual；无positive endpoint/result |
| UoW/recovery | atomicity/recovery implementation proof未建立 | fake/INT门禁均保留；不可默认classification |
| external phase/retry | endpoint/token/probe/accounting reality未建立 | controlled finite outcomes；unknown不盲重试 |
| consumer outbox/completion | per-consumer positive surface仍affected | registration/completion fail-closed；不默认ack |
| report ref/secondary owner | owner/mint/use positive proof未建立 | contract/static owner check；无alias/String fallback |
| per-flow proof | 60 exact flow只有设计closure | target实现后逐boundary生成proof |

## 12. 正式 `07` §8 回填草稿

正式 §8 应保留source/schema/profile规则、6 lane真实性、13-stage complete-or-error、only-core dependency、runtime/event/handoff dependency family、fake/controlled/disabled边界、phase/boundary readiness和不可用状态表。不得复制61项ENV或全部25 failure明细；这些由正式 `04` 提供。

## 13. Step 自检

| 检查项 | 结论 |
|---|---|
| 外部依赖是否显式分类并有检查/失败动作 | pass |
| repo类依赖是否记录本地路径和现实 | pass |
| 是否只把编译期依赖写为Cargo candidate | pass |
| fake/mock/controlled/disabled使用边界是否明确 | pass |
| phase/boundary准备是否与Step05~07一致 | pass |
| 是否伪造环境、provider、run或测试ready | no |
| gate_status | `pass_with_reality_preconditions` |
| next_allowed_action | `continue_to_step_09` |

## 14. 参考

- `projects/L4-observability/04-配置设计.md` §3~§14
- `projects/L4-observability/05-测试方案.md` §8~§10
- `projects/L4-observability/design-calibration/07_implementation_plan_step_03_prerequisites_reading.md`
- `projects/L4-observability/design-calibration/07_implementation_plan_step_07_test_acceptance_gates.md`
- `standards/document/全局项目依赖关系与裁剪规则.md`
