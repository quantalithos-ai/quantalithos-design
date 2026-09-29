# Step 7. 设计测试数据

> 对应 SOP：`standards/document/测试方案讨论流程_SOP.md` Step 7
> 正式回填：`05-测试方案.md` §7
> 日期：2026-09-13
> 状态：`completed / data_planned_with_formal_vector_blockers / continue_authorized`

## 1. Step 状态与 Step 内计划

| 项 | 结论 |
|---|---|
| 目标 | 为 Step 6 的全部 P0 TC 定义可重复构造、可隔离、可清理且不伪造 authority 的数据前置 |
| 输入 | Step 6；03 对象/DTO/state/store/error/idempotency；04 config/redaction |
| gate_status | `completed / data_planned_with_formal_vector_blockers` |
| gate_reason | 全部 TC 族都有逻辑数据集或具名 formal conformance vector blocker；无人工造数或真实 secret/body 依赖 |
| next_allowed_action | 创建并完成 Step 8 |
| source_files | 05 Step 6；03 Step 06/08/10～13/16；04 §7～12/14 |

| 计划项 | 产物 | 状态 | 完成门禁 |
|---|---|---|---|
| 抽取基础/负向/并发/恢复数据 | §6.1 | done | 对象、协议、source、effect、restore、config、report 全覆盖 |
| TC 族映射 | §6.2 | done | 所有 Step 6 TC family 可反查 dataset |
| test double 权限边界 | §6.3 | done | fake 不造 owner proof/finality/readiness |
| 构造、隔离、清理 | §6.4～6.5 | done | 可重复、单变异、run-scoped、无手工清理 |
| 数据停审与跨审计 | §6.6～6.7 | done | 无污染、替身冲突或 positive fake |

## 2. 本步输入与事实边界

| 输入 | 数据需求 |
|---|---|
| 26 objects / 18 states | checked builders、rehydrate、合法/非法 edge、corruption fixture |
| 3C/5Q/5E/17J | envelope、payload、view/page、receipt、report、claim/fence、complete replay |
| UoW/idempotency/effect | key/input/result、fault point、barrier、commit knowledge、probe observation |
| 8 source classes | owner-specific authority/version/fence/coverage 与 Auxiliary/Material 分类 |
| 55 config keys | 12 域的 valid candidate、single-mutation invalid candidate、profile/identity pinning |
| security/report | synthetic canary、safe signal capture、run-scoped raw/report pairing |

这里的 `test_run_ref` 仅是未来测试基础设施的隔离概念，不是已经生成的真实 `<run_id>`，也不能进入生产 DTO、operation key/input digest、Bundle digest 或业务 schema。数据集名称是设计标识，不证明 fixture 文件或 seed 已存在。

## 3. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 哪些基础数据必须存在？ | run namespace、typed protocol、CP1～CP6 objects/states、read snapshot、source authority、manifest/assessment/effect/restore、operation/result、config、safe output。 |
| 哪些边界/异常/并发/恢复数据？ | single-field invalid、missing/wrong kind、L/L+1、stale/mismatch、same/different、missing result、CAS/range/fence race、commit unknown、mapping drift、partial、redaction canary。 |
| 如何隔离？ | `test_run_ref` 为最高测试隔离层，二级使用 case/ref/operation/source/bundle/plan/config identity；并发用例内部持有 barrier，不靠随机 runner。 |
| 如何清理？ | pure value drop；每 case 新 fake instance；controlled store 删除已校验的 run namespace；fault/barrier reset；canary capture 删除/zeroize。 |
| external 使用何种 double？ | negative/failure/调用顺序可用 typed fake/stub；formal positive 必须由 owner-versioned conformance vector 或真实接缝提供，当前 blocked。 |
| P0 数据是否稳定构造？ | 本地场景是；外部正向以 formal vector 缺失明确 blocked，不能临时 JSON 造成功。 |
| 哪些需独立数据集？ | invalid protocol、owner authority 缺失、Auxiliary elevation、manifest difference、effect unknown、restore partial、fault/race、invalid config、leak corpus、broken report pairing。 |
| 是否通过逐切口停审？ | 是；见 §6.6。 |
| 是否有污染/清理/替身问题？ | 未发现 unresolved；durable/real cleanup 仍随 provider 合同 blocked。 |

## 4. Historical material 诊断与改动前后对比

| 旧材料/问题 | 风险 | 处置 |
|---|---|---|
| 固定 S3/MinIO、cold tier、7 年 seed | 私造 provider/governance truth | 不进入数据集；仅 opaque ref 和 failure vector |
| 真实对话/Artifact/审计正文样本 | 越权保存与泄漏 | 只用 synthetic marker 或 owner-approved body-free vector |
| 单一 happy archive fixture | 掩盖 partial/unknown/owner isolation | source/effect/restore negative 分离 |
| cleanup 依赖 DB truncate | backend 未选且目标过宽 | run namespace drop；真实 cleanup 合同 blocked |
| 随机 ID/clock | 复现困难并污染 digest 断言 | typed deterministic test blocks；时间不替代 owner version/fence |

| 维度 | 改动前 | 改动后 |
|---|---|---|
| 数据组织 | 用例口头前置 | 26 个职责互斥逻辑数据集 |
| authority | fake 可返回 success | 正向只接受 versioned formal vector；negative fake 有界 |
| 隔离 | 未定义 | test run + business typed key 双层 |
| 负向 | 修改 happy 对象后复用 | single-mutation corpus 独立且不共享可变 state |
| 清理 | 人工/待定 | 按载体确定 drop/reset/delete；durable future blocked |

## 5. 测试数据设计取舍

1. builder 必须显式填写所有 required 字段，禁止 `Default` 补 authority、version/fence/coverage、decision、effect key、digest、budget 或 visibility。
2. 合法对象只经正式 checked factory 构造；非法持久数据必须标 `corruption fixture`，期待 fail-closed，而不是当作可达业务状态。
3. typed ID 使用固定、按类型分区的测试字节块；不得跨 ref 类型复用或冒充生产随机性证明。
4. source 版本/水位只在同一 owner 的正式 comparator/vector 内解释；时间戳、数组序号与其他 owner opaque version 不能替代。
5. scripted fake store 可测调用序、CAS 分类和 rollback 语义，不证明 durable isolation、restart 或 Unknown 最终性。
6. canary 使用显然虚构值；不得复制真实 credential、密钥、正文、endpoint、provider response 或生产数据。

## 6. 结构化中间产物

### 6.1 测试数据集表

| 数据集 | 用途 / 构造 | 隔离键 | 清理 | 关联 TC |
|---|---|---|---|---|
| `DS-AR-RUN-001` | planned test namespace、fixed clock/typed ID blocks | `test_run_ref` | drop whole namespace/instance | 全部 |
| `DS-AR-CONTRACT-001` | 全 30 入口与 view/receipt/report 合法 DTO builders | run+protocol+case | drop values | CONTRACT；C/Q/E/J |
| `DS-AR-CONTRACT-NEG-001` | 对合法 DTO 做 one-field missing/wrong kind/unsupported/private field mutation | run+protocol+mutation | drop values | CONTRACT-002～004；entry negative |
| `DS-AR-CP1-001` | scope/request/job/stage 的合法与非法 builder | request/job/version | drop object/store instance | OBJECT-001；STATE-001～003；COMMAND |
| `DS-AR-CP2-001` | binding/attempt/coverage/finding；partial/stale/missing/conflict | source+attempt+fence | drop namespace | OBJECT-002；STATE-004～005；E02/J02～04 |
| `DS-AR-CP3-001` | Bundle/manifest/entry/closure/finding exact set 与 differences | bundle+revision+entry | drop namespace | OBJECT-003；STATE-006；J05～06 |
| `DS-AR-CP4-001` | verification/compatibility assessment by fixed input/target | bundle+assessment+target | drop namespace | OBJECT-004；STATE-007；Q03/J07～08 |
| `DS-AR-CP5-001` | placement/retrieval/lifecycle/action/decision ref 轴组合 | bundle revision+effect target | drop namespace | OBJECT-005；STATE-008～011；C03/E03～04/J09～12 |
| `DS-AR-CP6-001` | restore request/plan/item/handoff/outcome/compensation multi-owner | plan revision+owner+item | drop namespace | OBJECT-006；STATE-012～015；C02/E05/J13～17 |
| `DS-AR-STATE-NEG-001` | 每个状态终态复活、skip、wrong target 与非法 edge | state subject+edge | drop values | STATE-001～018 |
| `DS-AR-READ-001` | coherent committed read snapshots、visibility allowed/denied/revoked、pages | actor+read model+snapshot | new read store per case | QUERY-001～005；SECURITY-002 |
| `DS-AR-CURSOR-001` | selector/principal/visibility/snapshot/order/mapping axes 与 tamper corpus | cursor case+mapping ref | drop/zeroize synthetic material | QUERY continuation；CONFIG cursor |
| `DS-AR-SOURCE-FORMAL-001` | owner-versioned conformance vectors for 8 source classes | owner+contract/schema version | owner-defined | AUTHORITY/source positive；当前 blocked |
| `DS-AR-SOURCE-NEG-001` | unavailable/missing/mismatch/Auxiliary/ref-not-body/coverage conflict | source class+negative tag | reset fake/drop | AUTHORITY；E02/J02～04 |
| `DS-AR-EVENT-FORMAL-001` | trusted producer/versioned envelope and delivery vectors | producer+schema+event | provider-defined | E01～E05 positive；当前 blocked |
| `DS-AR-EVENT-NEG-001` | envelope invalid/unsupported/duplicate/late/wrong correlation | event+mutation | reset receipt store | CONSUMER-001～005 |
| `DS-AR-OPERATION-001` | Reserved/Completed/Conflict + complete result/receipt/report/key/input | namespace+channel+operation+key | drop store instance | IDEMP；all write entries |
| `DS-AR-FAULT-001` | deterministic named fault before/after read/save/commit/port/probe | run+case+fault point | reset schedule; assert no hook | UOW/EFFECT/JOB/OBSERVE |
| `DS-AR-RACE-001` | barriers for same-key/CAS/range/fence/late outcome | subject+barrier case | release/reset barrier | UOW/IDEMP/RESTORE |
| `DS-AR-EXTERNAL-FORMAL-001` | governance/integrity/storage/receiver typed conformance vectors | capability+binding/version | owner/provider-defined | external positive；当前 blocked |
| `DS-AR-EXTERNAL-NEG-001` | unavailable/NotDispatched/MayHaveDispatched/ACK/NotFound/mismatch | slot+effect+negative tag | reset adapter | EFFECT/J09～17/VETO |
| `DS-AR-CONFIG-001` | 12 domains/55 keys valid profile candidates with opaque refs | profile+config revision | drop values | CONFIG-001/003/004；RESOURCE |
| `DS-AR-CONFIG-NEG-001` | missing/unknown/duplicate/type/range/cross-field/invalid winner/fake-production | profile+one mutation | drop values | CONFIG-001～004 |
| `DS-AR-REDACTION-001` | synthetic raw body/token/key/digest/location/selector/provider canaries | run+signal+canary | isolated capture delete/zeroize | SECURITY/OBSERVE/REPORT |
| `DS-AR-DEPENDENCY-001` | future generated Cargo/import/config surface graph, not handwritten pass | source revision+check | no persistent state | DEPENDENCY-001～002/VETO |
| `DS-AR-REPORT-001` | complete and deliberately broken raw/report/index pairs, fixed synthetic run refs | run+suite+case | delete isolated tree | REPORT-001～002/VETO-005 |

### 6.2 TC 族到数据前置映射

| TC 族 | 主要数据集 | 构造方式 | double / real-like | 清理 |
|---|---|---|---|---|
| CONTRACT | CONTRACT/CONTRACT-NEG | full valid vector→single mutation | none | drop values |
| OBJECT/STATE | CP1～CP6/STATE-NEG | checked factory + corruption-only rehydrate vector | external proof positive blocked | drop/new store |
| COMMAND | CONTRACT/CP1/CP5/CP6/OPERATION/FAULT | envelope builder + exact local truth + failure schedule | authority/governance negative stub；positive blocked | new store/reset |
| QUERY | READ/CURSOR/CP1～CP6 | coherent snapshot + current visibility + write/effect spy | read/visibility negative fake | new store/drop |
| CONSUMER | EVENT-FORMAL/EVENT-NEG/CP2/CP5/CP6/OPERATION | versioned envelope or one-field invalid/late vector | real event blocked；receipt fake local | reset/drop |
| JOB J01～J06 | CP1～CP3/SOURCE/OPERATION/FAULT/RACE | fixed target + claim/fence + report seed | source formal positive blocked | new store/reset |
| JOB J07～J12 | CP4/CP5/EXTERNAL/FAULT | assessment/effect intent and typed observations | capability/provider positive blocked | new store/reset |
| JOB J13～J17 | CP6/SOURCE/EXTERNAL/OPERATION/FAULT/RACE | multi-owner plan/item/effect/compensation | owner/receiver positive blocked | new store/reset |
| UOW/IDEMP | OPERATION/FAULT/RACE/REPORT | stored result relation + deterministic barrier/fault | fake store local；durable blocked | drop instance/reset |
| AUTHORITY/RESTORE | SOURCE-FORMAL/SOURCE-NEG/CP6/EXTERNAL | per-owner versioned vector or negative typed outcome | formal positive blocked | owner-defined or reset |
| CONFIG/RESOURCE | CONFIG/CONFIG-NEG | explicit 55-key candidate + L/L+1 generated from profile | missing capability stubs | drop values |
| SECURITY/OBSERVE | REDACTION/READ/FAULT | synthetic canary + isolated capture + sink fault | controlled capture sink | delete/zeroize/reset |
| DEPENDENCY | DEPENDENCY | source-derived graph/config surface after implementation | none | no state |
| REPORT/VETO | REPORT + representative datasets | complete/broken pairs; representative boundary vectors | no static success fixture | delete isolated tree |

### 6.3 Test double 权限边界

| double | 允许返回/模拟 | 禁止 | 证明上限 |
|---|---|---|---|
| Archive store fake | staged UoW、CAS/read-set/fence、typed fault/Unknown 分类、complete result round-trip | 声称 durable isolation/restart/finality 或替代 production store | local orchestration only |
| Authority/visibility negative stub | denied/missing/revoked/unavailable/unknown | 自造 allow decision、actor authority 或 visibility proof | fail-closed only |
| Source export double | local request shape、call order、unavailable/mismatch/partial | 自造 owner snapshot/schema/version/fence/coverage success | positive blocked by owner vector |
| Governance double | missing/stale/conflicting/hold/unavailable | 自造 retention/delete/risk decision 或有效期 | negative only |
| Integrity/compatibility double | blocked/unknown/unsupported/integrity-failed/mismatch | 自造 algorithm/key/signature/schema authority 或 Verified | negative/classification only |
| Storage double | NotDispatched/MayHaveDispatched/ACK/NotFound/unavailable/mismatch | 声称 durable commit/location/tier/retrievability | effect orchestration only |
| Restore receiver double | unavailable/mismatch/partial/rejected/unknown | 自造 receiver commit、owner import 或 restoration success | per-owner negative only |
| Event double | envelope validation/dedup/unsupported/late | 自造 trusted producer/delivery truth/schema | local consumer mapping only |
| telemetry capture | 捕获 safe output、模拟 sink drop/failure | 保存真实 secret/body；作为 audit backend/truth | non-interference/redaction only |
| cursor test codec | local axis/tamper/mapping tests | 声称 production algorithm/key rotation/security | local contract only |

### 6.4 数据构造规则

1. 每个 case 从 immutable baseline builder 开始；负向只改变一个主要轴并携带 mutation tag，组合攻击单独建 table row。
2. `None` 与 empty、missing 与 hidden、Unknown 与 Failed、ACK 与 commit、ref 与 body、Auxiliary 与 Canonical 必须用不同 typed fixtures，不能用同一 magic value。
3. same/same 完整复用 canonical semantic tuple；same/different 只改变一个语义字段；trace/time/request/run/attempt 变化作为不影响 digest 的对照。
4. state vector 按 Step 10 的正式 From/To 生成；无法由 factory 到达的非法 stored state 必须显式标 corruption，不通过 private field hack 伪装合法业务输入。
5. multi-source/multi-owner 数据始终保留 total target set、stable ordinal 和每项独立 outcome；partial resume 另建新 operation key + unresolved subset + prior report ref。
6. L/L+1 从 `DS-AR-CONFIG-001` 的 typed positive bound 读取；本文件不填数值，不用数组截断冒充 Complete。
7. formal conformance vector 必须含 owner/provider、contract/schema version、适用 target、失败语义和 provenance；缺一项则 dataset unavailable/blocked。
8. raw canary 只进入 isolated capture，不能写入 Archive truth、共享 artifact、报告或日志；测试结束必须 zeroize/delete。

### 6.5 隔离与清理规则

| 载体 | 隔离 | 清理 | 失败姿态 |
|---|---|---|---|
| pure builder/value | 每 case 新对象，typed ID block 不交叉 | drop；synthetic key zeroize | 不影响其他 case |
| in-memory fake store | 每 case 新实例；table rows 不共享 mutable namespace | drop whole instance，不逐表删除 | 残留即 suite fail |
| controlled local store | 预解析并校验 `test_run_ref` namespace；禁止空/root/shared target | finally 删除 exact namespace | cleanup fail 留报告并阻断后续复用 |
| fault/barrier | case 独占 schedule/channel | reset/release并断言无 pending hook | 残留时禁止下一 case |
| cursor/key/canary | case-scoped synthetic material | zeroize/drop/delete isolated capture | 禁止复制到 report |
| formal vector/real-like | owner/provider 规定 namespace 与 cleanup API | 只按正式合同清理 | 当前 blocked；不得用 transaction rollback猜 finality |
| report tree | synthetic fixed run namespace | 删除 exact isolated tree | pairing/cleanup failure 可审查且不造 EV |

`test_run_ref` 只参与测试基础设施路径/namespace，不参与生产 operation key/input digest、public cursor、Bundle manifest/digest、source fence 或 receiver effect key。并行执行仅在所有隔离键无交集时允许；同 key/source/bundle/plan/sink 的竞态由单个 case 内 barrier 控制。

### 6.6 数据集 / CUT 停审

| CUT group | 可重复构造 | 隔离/清理 | double 边界 | 结论 |
|---|---|---|---|---|
| CONTRACT/OBJECT/STATE | 是 | value/case/new store | external truth不伪造 | pass |
| COMMAND/QUERY | local 是 | operation/read snapshot | authority positive blocked | pass_with_formal_vectors |
| CONSUMER/JOB | local negative/flow 是 | event/job/claim | real event/source/provider blocked | pass_with_blockers |
| UOW/IDEMP/EFFECT | local fault 是 | store instance/barrier/effect | durable/finality blocked | pass_with_blockers |
| AUTHORITY/RESTORE | negative/partial 是 | owner/source/plan/item | formal positive blocked | pass_with_blockers |
| CONFIG/RESOURCE | 是 | profile/config case | numeric authority pending | pass_with_pending_thresholds |
| SECURITY/OBSERVE | 是 | isolated capture/sink | backend/evidence blocked | pass |
| DEPENDENCY/REPORT | planned generated/isolated fixtures | source revision/run tree | no handwritten success | pass_as_planned |

### 6.7 跨数据隔离 / 清理审计

| 审计项 | 结论 | 修正/上限 |
|---|---|---|
| Step 6 TC 族可反查 | 通过 | 所有 family 均映射 dataset；无人工造数 |
| happy/negative 混用 | 无 | NEG/FAULT/RACE/REDACTION/REPORT-broken 独立 |
| owner positive fake | 无 | formal vector 缺失即 blocked |
| mutable state 跨 case | 无 | 每 case 新实例/namespace |
| cleanup 范围 | 明确 | exact run namespace；禁止 broad target |
| production schema 污染 | 无 | test_run_ref/mutation tag 不进入生产 DTO/digest |
| real secret/body/data | 禁止 | synthetic canary only |
| durable cleanup/finality | 未伪造 | 随 `AR-03-LOCAL-003`/provider blocked |

## 7. 复杂度判断

26 个逻辑数据集按 protocol、六 CP、source/event/effect、operation/fault/race、config/security/report 分组，足以覆盖 Step 6 的 TC 家族；不固定实现文件或 builder API。Step 8 再决定哪些 dataset 可在哪个环境出现，不能因 local fixture 存在而把 real-seam profile 标为可用。

## 8. 回填草稿

正式 §7 应保留数据集表、TC 族映射、test-double 权限边界、构造/隔离/清理规则及审计。必须声明：逻辑 DS、`test_run_ref`、formal vector 均为 planned；owner/provider conformance vector 缺失时正向测试保持 blocked，synthetic canary 不得进入共享 evidence。

## 9. 对上游设计的影响与待确认

| 项 | 结论 |
|---|---|
| 03/04 回写缺口 | 无；现有 constructors、protocol、store/port 与 config 足以描述数据需求 |
| 新 blocker | 无 |
| 持续阻塞 | owner/source/event/governance/integrity/storage/receiver vectors、durable cleanup/finality、numeric authority |
| 后续承接 | environment/profile→Step 8；suite/script→Step 9；evidence retention/redaction→Step 13 |

## 10. 进入 Step 8 门禁

- [x] 全部 P0 TC 族有可重复 dataset 或明确 formal-vector blocker。
- [x] negative/boundary/concurrency/recovery 数据与 happy data 分离。
- [x] 隔离键、清理方式、double 权限和禁止真实数据边界明确。
- [x] 无人工造数、真实 secret/body、production schema 污染或 fake authority closure。
- [x] 逐 CUT 数据停审与跨数据审计无 unresolved 冲突。
- [x] 允许进入 Step 8。
