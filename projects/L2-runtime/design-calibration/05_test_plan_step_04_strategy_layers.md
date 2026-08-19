# L2-runtime 05 测试方案 Step 4：测试策略与分层

> 对应 SOP：`standards/document/测试方案讨论流程_SOP.md` Step 4
> 回填位置：正式 `05-测试方案.md` §4
> 输入：Step 3 的 37 个切口与正式 `03` 技术层/Flow
> 状态：`completed_continuous_authorized`

## 1. 本步取舍与 SOP 回答

| 问题 | 结论 |
|---|---|
| 哪些问题必须在 unit 发现？ | value/object construction、policy、all 31 state transitions、closed enum、config parsing/validation、redaction pure rule。 |
| 哪些在 service 验证？ | one application operation、UoW write set、reservation/replay、external call ordering、typed recovery、query zero-write。 |
| 哪些依赖 integration/fault？ | repository CAS/unique/inbox/outbox/lease/cursor、commit unknown、adapter spy、worker ACK、job page atomicity。物理产品未选时只证明 logical contract。 |
| 哪些需要 contract/entry？ | 17/12/6/6/7 DTO/envelope/error mapping、Api/Worker/Jobs facade dispatch、dependency compatibility。 |
| 哪些需要 local E2E？ | 五个能力闭环和 loop 跨 capability 的最小聚合，只复用 owning raw cases，不替代底层。 |
| 哪些才进入 positive qualification？ | owner contract、selected real adapter/profile、implementation、real environment 和 independent evidence 全部具备的外部正向路径；当前 blocked。 |

历史分层以已废弃的状态分母和进程内配置变更为底层输入，且把 E2E/positive lane 与本地证明混在同一金字塔。当前分层将 static/compile checks 作为横切门禁，将 external positive qualification 置于独立 lane。

## 2. 测试分层图：L2-runtime 风险前移结构

```text
                    [positive qualification]
                 owner contract + real adapter
                     currently blocked
                              |
                  [local capability E2E]
              aggregate refs; no new truth oracle
                              |
              [entry / worker / job execution]
            facade, ACK, lease/page, profile isolation
                              |
                 [integration / fault]
          UoW, CAS, inbox/outbox, lease/cursor, unknown
                              |
                    [service tests]
        one operation, write set, call order, recovery action
                              |
                  [contract tests]
       17/12/6/6/7 DTO/envelope/error/Port compatibility
                              |
                     [unit tests]
       objects/policies/SM-01~31/config/redaction/determinism

  [static / compile / source / dependency / forbidden-material checks]
         cross all layers and cannot be replaced by E2E
```

关键说明：

- 每个风险在最早拥有 formal oracle 的层级发现；上层只验证协作，不重测或改写底层 truth。
- local E2E 是 same-run aggregate，不拥有 case，也不能掩盖底层失败或 blocked dependency。
- deterministic fake 只存在于明确 TestFake/CI lane；不能进入 positive qualification。
- static checks 验证依赖方向、forbidden material、source trace 和 artifact integrity，不证明运行语义成功。

## 3. 分层职责表

| Layer | 主要目标 | 典型输入 / oracle | 触发时机候选 | 失败姿态 |
|---|---|---|---|---|
| `unit` | construction/invariant/state/policy/determinism | canonical structs/enums/state matrices/config rules | PR | P0 fail blocks |
| `contract` | DTO/envelope/Port/error schema 与 identity | `03` §§6~7/11、Core candidate refs | PR/main | mismatch/unknown variant blocks |
| `service` | one operation semantic + UoW/call order/replay | `03` §8 Flow/write set/recovery | PR/main | semantic failure blocks |
| `integration_fault` | logical repositories/adapters/worker/job failure windows | §§10/12、spy/fault store | main/nightly | P0 deterministic failure blocks；infra error重跑后仍阻断 |
| `entry_worker_job` | facade/authority/profile/ACK/lease/page | §6.8.6、§7、§13、`04` profile | main/nightly | direct I/O/fake leak/early ACK blocks |
| `local_e2e` | 五闭环 + loop 的最小聚合 | owning case raw references from same run | main/release-design | 任一 child非 pass则 aggregate 不 pass |
| `positive_qualification` | real external owner interoperability | frozen owner contract + real adapter/profile/environment | future independent gate | 当前 `blocked_dependency/not_runnable` |
| `static_check` | dependency/source/redaction/denominator/evidence integrity | manifests/source graph/artifact schema | every gate | hard failure blocks；不允许 waiver 自动 pass |

## 4. Cut 到最早层级映射

| Cut | Primary layer | 必要 companion | 上层不得替代 |
|---|---|---|---|
| 01 VOCAB | unit + contract | static forbidden scan | handler smoke |
| 02 LOOP | unit + service | fault lease/wakeup/continuation | local E2E |
| 03~07 admission/run/plan/context/memory | unit + service | UoW/repository fault | capability aggregate |
| 08~09 model binding/decision | unit + service | adapter/event fault | real provider test |
| 10~14 action/delegation/feedback/reflection | unit + service | adapter/worker/inbox fault | Tools/child positive |
| 15~20 checkpoint/recovery/outcome/handoff/projection/source | unit + service | adapter/event/job/fault | external backend positive |
| 21 Commands | contract + service | entry mapper | generic command smoke |
| 22 Queries | contract + service | read-capability spy | API smoke |
| 23 inbound Events | contract + worker | inbox/ACK fault | broker delivery |
| 24 outbound Events | contract + integration | outbox/publisher spy | downstream observed |
| 25 Jobs | service + job | lease/page/cursor fault | scheduler smoke |
| 26~28 States | unit | service transition-source check | aggregate transition test |
| 29 local Ports | contract + integration | commit/fault spy | in-memory happy path only |
| 30 external Ports | contract + adapter | blocked/fake/zero-call + future positive | fake accepted response |
| 31 UoW | service + fault | raw write/call journal | final state only |
| 32 replay/concurrency | unit + fault | multi-actor/epoch/digest fixture | sequential replay only |
| 33 errors | unit + contract + service | public redaction/static scan | generic error smoke |
| 34 config schema | unit/config | static inventory | builder success |
| 35 config runtime | config/service/fault | entry/profile/dependency | generic configuration smoke |
| 36 observation/security | unit + static + service | serialization/output scan | Obs backend |
| 37 entry/dependency | contract + entry + static | profile/fake/source manifest | product E2E |

## 5. 每层 oracle 与替身规则

| 对象 | 可用替身 | 替身必须记录 | 禁止推导 |
|---|---|---|---|
| clock/ID/digest | fixed deterministic fake | seed/input/output/call count | production entropy/readiness |
| repository/UoW | logical fault-capable store | read/write/CAS/UoW/commit journal | physical durability/isolation |
| external owner Port | finite scripted fake/spy/BlockedAdapter | exact request digest/order/outcome/blocker | owner internal state/success/readiness |
| Bus/event | inbox/outbox/publisher spy + replay fixture | envelope/source/order/ID/digest/receipt | route/delivery/DLQ/observed |
| deployment cold replacement | controller state fake | candidate/prior facts/validation/switch posture | real rollout/rollback success |
| positive integration | no substitute | real contract/profile/environment/source refs | fake-as-positive |

## 6. 阻断、flake 与不可运行口径

| 状况 | 处理 | 是否可计 pass |
|---|---|---:|
| deterministic assertion failure | product defect；保留 raw，阻断 | no |
| manifest/selector 为空或少分母 | invalid test execution，阻断 | no |
| runner/namespace/cleanup failure | `infra_error`；诊断后新 run | no |
| timing-dependent/flaky | 不重跑抹除；记录 first failure，修复 determinism | no |
| external blocker open | positive case `blocked_dependency/not_runnable`；local/negative照常执行 | no for positive；不影响独立 local pass |
| fake/spy returns accepted | 只验证 Runtime finite branch | no external pass |
| test skipped/filtered | missing denominator，阻断 | no |
| static check only | 只证明对应静态红线 | no semantic pass |

## 7. 正式 §4 回填草稿

测试采用风险前移的 unit、contract、service、integration/fault、entry/worker/job、local E2E 六层结构，另设横切 static checks 和独立 positive qualification lane。31 个状态主体与配置纯规则在 unit 层闭合；48 个 public protocol/job 在 contract/service/entry 层保留独立 identity；UoW、CAS、inbox/outbox、lease/cursor、external-call unknown 在 fault 层验证。local E2E 只聚合相同 run 的 owning raw cases，不创建新 oracle。

开放 external seam 的 fake/blocked test 只验证 Runtime local branch、调用次数和 fail-closed 姿态。真实 positive qualification 必须等待 owner contract、selected real adapter/profile、implementation 和独立环境证据，当前统一为 blocked，不得由重试、skip 或 fake accepted 提升。

## 8. Step 4 停审

| 审计项 | 结论 |
|---|---|
| 37 cuts 均有 primary layer | pass |
| 31 states 保持 unit 独立 identity | pass |
| 48 protocol/job 不由 E2E 替代 | pass |
| UoW/call order 有 journal/fault layer | pass |
| static 与 semantic truth 分离 | pass |
| positive integration 与 fake 分离 | pass |
| flake/skip/empty denominator 不计 pass | pass |
| unresolved layering conflict | 0 |

```text
step_status = completed_continuous_authorized
next_step = Step 5
formal_05_write_allowed = false_until_step_15
```
