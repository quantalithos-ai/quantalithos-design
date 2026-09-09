# Step 7. 设计测试数据

> 对应 SOP：`standards/document/测试方案讨论流程_SOP.md` Step 7  
> 回填章节：`05-测试方案.md` §7

## 1. Step 状态

| 项目 | 结论 |
|---|---|
| 状态 | completed / data_planned_with_authority_boundary |
| 输入 | Step6 的 59 个用例；03 对象/DTO/state/store；04 配置 |
| 输出 | 19 个数据集、构造/隔离/清理规则、TC族映射、替身边界 |
| 事实边界 | 未创建 fixture 文件、seed、真实数据、数据库或 evidence |

## 2. 本步目标与输入

目标是让每个 P0 用例有可重复的数据前置，同时保证测试数据不会伪造 owner authority。数据集是逻辑设计名，不是已存在目录或文件。

| 输入 | 用途 |
|---|---|
| Step6 §7.1~7.5 | 59 个用例的前置、操作和断言 |
| 03 Step6-A/B/C | typed IDs/version、16 对象、外部未闭合 slot |
| 03 Step7~10 | port、DTO、state、receipt、snapshot |
| 03 Step11~13 | logical store、commit fault、key/digest、并发 |
| 03 Step14/15、04 | cursor/limits/config/secret/redaction |

## 3. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 基础数据有哪些？ | test run namespace、typed contract、16 对象/状态、partition/projection/local/recovery snapshot、operation/source/gap/commit records。 |
| 边界/异常/并发/恢复数据？ | wrong-kind、missing metadata、撤权、duplicate/conflict、gap/unknown、逐写点故障、双写竞争、phase/basis变化、cursor篡改、超限、redaction canary。 |
| 如何隔离？ | 每次计划运行使用唯一 `test_run_id` 作为测试基础设施隔离标识；业务 key 再按 actor/scope/partition/generation/operation/event 分区。`test_run_id` 不进入生产 DTO/digest。 |
| 如何清理？ | 纯内存 drop instance；文件/本地 store 用 run-scoped namespace 删除；事务型 durable 未来用显式 namespace cleanup，不依赖测试回滚证明业务 rollback。 |
| fake/stub/real-like 如何选？ | test-only fake 可返回局部数据或明确失败分类；不得正向构造未闭合 owner proof/schema。真实 conformance vector/real-like seam 当前 blocked。 |
| 每个 TC 是否有数据集？ | 59 个用例按 17 族全部映射；见 §7.2。 |
| 哪些必须独立负向数据？ | authority missing/revoked、forbidden body/secret、invalid DTO/cursor/config、gap/unknown、race/fault、over-limit，均不复用 happy dataset。 |

## 4. 当前材料问题诊断

| 首稿问题 | 风险 | 修正 |
|---|---|---|
| 仅四个粗粒度数据集 | 59 TC 无法定位前置和清理 | 建立 19 个职责互斥数据集 |
| “typed actor/scope/ref”可能被误读为 owner allow | fake 伪造授权 | 明确外部正向只能由正式 conformance vector 提供 |
| 清理“待实现仓确认” | 无可执行隔离规则 | 固定 run namespace / instance reset / explicit cleanup |
| 未映射所有 TC 族 | 存在人工造数风险 | 17 族逐项映射 |
| 故障数据与 happy 数据混合 | 错误断言可能被既有状态掩盖 | 独立 fault/race/negative corpus |

## 5. 改动前后对比

| 维度 | 之前 | 本步后 |
|---|---|---|
| 数据集 | 4 个大类 | 19 个逻辑数据集 |
| authority | 禁止语句 | 可/不可由 fake 构造的明确矩阵 |
| 隔离 | 未定 | test_run_id + 业务键双层隔离 |
| 清理 | 待定 | 按数据载体给确定规则 |
| 用例映射 | 少量 | 59 TC 的 17 族全覆盖 |

## 6. 测试数据设计取舍

1. `test_run_id` 只是测试基础设施命名空间，不是 `run_id` 执行事实，也不进入 workspace 生产 schema；本轮不生成实际值。
2. ID builder 使用显式、确定的合法 UUIDv4 字节表，保证可重复且类型隔离；不冒充生产 CSPRNG 验证。
3. 时间只用于技术测试调度，不能用于 source freshness/order；source 版本关系必须来自正式 comparator 或 blocked vector。
4. fake store 可以验证编排/故障分类，但不能证明 durable isolation、重启或 commit unknown 最终性。
5. leak corpus 只用明显的 synthetic canary，永不使用真实 credential、业务正文或生产数据。

## 7. 结构化中间产物

### 7.1 测试数据集表

| 数据集 | 用途 | 构造方式 | 隔离键 | 清理方式 | 关联 TC |
|---|---|---|---|---|---|
| DS-WS-RUN-001 | 所有数据的隔离壳 | 计划 runner 生成 test_run_id + deterministic ID block | test_run_id | drop namespace/instance | 全部 |
| DS-WS-CONTRACT-001 | 合法14入口DTO、typed IDs/versions/digest | public/test-only builders按03字段显式构造 | test_run_id+case | 无持久化，drop value | CONTRACT-* |
| DS-WS-CONTRACT-NEG-001 | missing/unknown/wrong-kind/Strong | 从合法值单字段变异，保留变异标签 | test_run_id+case+mutation | drop value | CONTRACT-*、PAGE-* |
| DS-WS-SCOPE-001 | scope selector与失败分类 | selector + fake port仅返回ContractBlocked/Unavailable/mismatch | actor+scope case | reset fake | SCOPE-002/003 |
| DS-WS-AUTH-BLOCKED-001 | 正式scope/visibility/attention正向向量占位 | 只能由owner发布的版本化conformance vector加载 | owner+contract version | owner-defined cleanup | SCOPE-001、VIS-001、INBOX-001/003；blocked |
| DS-WS-PARTITION-001 | partition/current/empty状态 | WorkspacePartition/Generation/Projection合法builder | partition+generation | drop store namespace | QRY/LOCAL/REC |
| DS-WS-PROJECTION-001 | source slice/coverage/inbox/read view组合 | 仅用已闭合局部类型；proof型成功值等正式vector | partition+generation+view | drop store namespace | QRY/SRC/STATE |
| DS-WS-LOCAL-001 | absent/present、多stream、override/preferences | LocalAttentionState/ReadCursor builders | partition+principal+stream | drop store namespace | QRY-002/003、LOCAL-* |
| DS-WS-RECOVERY-001 | 九attempt状态、role/safety、invalidation | 每状态合法builder和单字段非法变体 | partition+attempt+generation | drop store namespace | QRY-005、REC-*、STATE-* |
| DS-WS-RECORD-001 | operation/source/baseline/gap/commit记录 | typed key/digest/result bindings，终局与缺行分开 | business key+commit attempt | drop store namespace | SRC/IDEM/TXN/QRY-004 |
| DS-WS-EVENT-BLOCKED-001 | owner change/invalidation/baseline/replay正向 | 只能加载owner+bus正式schema/order/proof vector | owner+stream+event+schema | provider-defined | SRC-001/002/004/006、REC-002；blocked |
| DS-WS-FAULT-001 | store/port/sink各阶段故障 | deterministic fault schedule：before/after named call/commit response loss | test_run_id+fault point | reset schedule | SRC-005、TXN-*、SEC-002 |
| DS-WS-RACE-001 | local双写、cutover/invalidation/fanout竞态 | barriers控制read-after/commit-before时序 | partition+barrier case | release/reset barrier | REC-003/005、TXN-002/003 |
| DS-WS-CURSOR-001 | page plaintext/key ring/tamper corpus | fixed axes；synthetic 32-byte keys；逐wire段变异 | key id+query binding | zeroize/drop test material | PAGE-* |
| DS-WS-CONFIG-001 | 四profile合法结构与L边界 | 显式所有required项，数值符号L按case生成 | profile+case digest | drop value | CONFIG-*、RES-* |
| DS-WS-CONFIG-NEG-001 | missing/unknown/type/relation/fake-production | 从合法结构一次变异 | profile+mutation | drop value | CONFIG-* |
| DS-WS-REDACTION-001 | 安全输出与泄漏canary | synthetic raw-body/token/DSN/secret/proof/ID marker | test_run_id+signal | delete isolated capture | SEC-001/003 |
| DS-WS-DEPENDENCY-001 | manifest/import/composition graph | 实现后由源码元数据生成，不手填成功结果 | source revision/check case | no persistent state | DEP-*、BOUND-* |
| DS-WS-RESOURCE-001 | L、L+1、oversized集合/bytes | 根据测试profile读取L后生成exact/over输入 | profile+resource+case | drop value/namespace | RES-* |

### 7.2 用例族到数据前置映射

| TC 族 | 主要数据集 | fixture/builder/seed | 替身类别 | 清理 |
|---|---|---|---|---|
| CONTRACT-001~003 | CONTRACT / CONTRACT-NEG | typed builders + single mutation | none；owner canonical positive blocked | drop values |
| SCOPE-001~003 | SCOPE / AUTH-BLOCKED / PARTITION | selector/failure fake；正式vector | failure stub；positive real-like blocked | reset fake/drop namespace |
| VIS-001~003 | AUTH-BLOCKED / PROJECTION | current/revoked vectors | negative fake只返回拒绝；positive blocked | reset/drop |
| QRY-001~006 | PARTITION / PROJECTION / LOCAL / RECOVERY / RECORD / CURSOR | coherent snapshots + seven-write spy | read fake；owner positive blocked | new store per case |
| SRC-001~006 | EVENT-BLOCKED / RECORD / FAULT / PROJECTION | formal event vector + classification/fault schedule | local classifier fake；real event blocked | reset/drop |
| INBOX-001~003 | AUTH-BLOCKED / EVENT-BLOCKED / PROJECTION / LOCAL | explicit attention vector；negative no-attention input | negative local;positive blocked | drop |
| LOCAL-001~004 | PARTITION / LOCAL / AUTH-BLOCKED | absent/present/multi-stream builders | relation/visibility positive blocked | new store per case |
| REC-001~006 | RECOVERY / EVENT-BLOCKED / RACE / FAULT | state builders + formal baseline vector + barrier | local state fake;baseline blocked | drop/reset |
| STATE-001~003 | PROJECTION / LOCAL / RECOVERY / RECORD | parameterized from/to/combination | proof-positive blocked | drop values |
| TXN-001~003 | RECORD / FAULT / RACE | named write-set snapshots/fault schedule | fake store controlled;durable blocked | new instance/drop |
| IDEM-001~003 | RECORD / EVENT-BLOCKED | same/different digest stored records | local store fake;bridge proof blocked | new instance/drop |
| PAGE-001~002 | CURSOR / CONTRACT-NEG | per-axis and wire mutation builders | local test codec | zeroize/drop |
| CONFIG-001~003 | CONFIG / CONFIG-NEG | explicit profiles + single mutation | missing capability stub | drop values |
| SEC-001~003 | REDACTION / FAULT | synthetic canary + capture sink | controlled sink | delete capture/reset |
| DEP-001~002 | DEPENDENCY | generated manifest/import graph | none | no cleanup |
| RES-001~003 | RESOURCE / CONFIG | L/L+1 builders | controlled adapter | drop values/namespace |
| BOUND-001~003 | DEPENDENCY + all representative local sets | port spies + persisted-field enumeration | all outbound/write spies | new instance/drop |

### 7.3 Test double 权限边界

| Double | 允许返回/模拟 | 禁止 | 受影响状态 |
|---|---|---|---|
| ScopeResolverPort failure stub | ContractBlocked、ScopeUnavailable、mismatch | 任意字符串构造成正式 OwnerScopeResolution | 正向 WS-UP-005 blocked |
| VisibilityPort negative stub | missing/conflict/revoked/unavailable | 自造 allow decision/ref/validity证明 | 正向 WS-UP-003 blocked |
| OwnerReadPort failure/local shape stub | unavailable、限额、调用顺序；已正式发布vector的回放 | 任意 JSON删字段后当 safe source | 正向 WS-UP-001 blocked |
| AttentionResolverPort negative stub | Unknown、missing/unavailable | 自造 attention identity/lifecycle/read relation | 正向 WS-UP-004 blocked |
| SourceEventPort classifier double | 已闭合本地分支调用与显式失败 | 自造 event identity/cursor/comparator/replay proof | WS-UP-002/007 blocked |
| RecoverySourcePort double | budget/调用顺序/失败 | 自造 baseline coverage/continuation/bridge | recovery正向 blocked |
| Workspace store fake | 原子调用、CAS、write-set、fault/unknown分类 | 声称durable isolation/restart/unknown最终性 | WS-LOCAL-001 blocked |
| Cursor test codec/material | 本地wire/tamper/axis/zero-write | 声称第三方crypto/MSRV/CSPRNG/轮换已验证 | WS-LOCAL-003 blocked |
| telemetry capture | 捕获安全测试输出和故障 | 保存真实secret/body或充当业务审计truth | local planned |

### 7.4 构造规则

1. 每个 builder 显式填写所有 required 字段；禁止 `Default` 隐式补 scope、proof、version、expected、budget 或安全状态。
2. 合法对象必须经正式 factory/public constructor；测试不得通过反序列化/private field hack 构造“不可达合法状态”。非法 stored-data 用例需明确标 corruption fixture，并期待 InvariantViolation 安全映射。
3. 每个负向数据集只做一个主要变异，断言失败原因可定位；组合攻击另建 table-driven case，不复用已污染对象。
4. ID 固定字节块按类型分段，绝不跨类型复用同一 builder return；生成碰撞作为专门 store conflict 输入。
5. version 使用 0/1/n/u64::MAX 等明确边界；不以 cursor、时间戳或数组位置替代正式 version。
6. same-key replay 复用完整 key+digest；conflict 只变一个 digest 输入字段；trace/request ID 变化不得改变 digest。
7. source/event/baseline 成功数据只接受带 owner/version/schema 标识的正式 conformance vector，加载前校验版本；缺向量即 blocked。

### 7.5 隔离与清理规则

| 载体 | 隔离规则 | 清理规则 | 失败时要求 |
|---|---|---|---|
| pure value/builder | 每case新对象，不共享可变实例 | case结束drop/zeroize synthetic key | 清理失败不产生业务影响 |
| in-memory fake store | 每case新实例；table case不得共享 namespace | drop整个实例，不逐行猜依赖顺序 | 任意残留使suite失败而非继续 |
| local file/store controlled integration | test_run_id命名目录/schema；启动前拒绝非测试目标 | suite finally显式删除该namespace | 输出清理失败；不得扩大删除目标 |
| future durable/real-like | provider确认的run namespace和cleanup API | 按provider合同清理并留planned cleanup result | 当前blocked，不能用transaction rollback代替unknown终局 |
| fault/barrier doubles | case id独占schedule/channel | 每casereset且断言无pending hook | 残留hook使后续case禁止运行 |
| capture/leak corpus | 单独隔离目录/内存buffer，只含synthetic canary | scan后删除/zeroize | 不复制到共享artifact或报告 |

测试并行只能在隔离键无交集时启用；同 partition、operation key、event key、key ring 或 capture sink 的并发用例由该用例内部显式控制，不交给随机 runner 调度。

### 7.6 测试数据停审记录

| 数据集/切口 | 可重复构造 | 隔离键 | 清理明确 | 替身边界 | 结论 |
|---|---|---|---|---|---|
| contracts/object/state | 是 | case/type | 是 | owner proof不伪造 | pass_with_external_slots |
| query/local | 是 | actor/scope/partition | 是 | current allow positive blocked | pass_with_external_slots |
| source/Inbox | local negative是 | owner/stream/event/generation | 是 | formal event/attention blocked | pass_with_blockers |
| recovery/transaction/idempotency | local state/fault是 | partition/attempt/key | 是 | baseline/durable终局blocked | pass_with_blockers |
| cursor/config/resource | 是 | profile/key/case | 是 | crypto/product blocked | pass_with_external_slots |
| security/dependency/boundary | 是（实现元数据未来生成） | run/signal/revision | 是 | 无真实数据 | pass_as_planned |

### 7.7 跨数据隔离与清理审计

| 审计项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 59 TC 是否均可回指数据集 | pass；17族全部映射 |
| 人工临时造数 | none；均由builder/vector/generated metadata |
| happy/negative是否隔离 | pass；NEG、FAULT、RACE、REDACTION独立 |
| 外部替身是否一致 | pass；只允许失败/local mechanism，正向正式vector blocked |
| 清理是否明确 | pass；drop instance/namespace/reset/delete |
| 业务key是否含test_run_id | no；run仅基础设施隔离，不污染digest/schema |
| 真实secret/正文/生产数据 | prohibited；只用synthetic canary |
| durable cleanup | pending WS-LOCAL-001，不伪造 |
| fixture重复 | 未发现逻辑重复；共享builder不共享可变state |

## 8. 对 03/04 的影响判定

现有 constructors、port和逻辑存储足以描述数据需求；未新增生产字段、状态或配置。正式 conformance vector 需求是既有 WS-UP 接缝的测试承接，不在05定义其schema；durable cleanup是WS-LOCAL-001实施前置。

## 9. 回填草稿

正式 §7 回填数据集表、TC族映射、test-double边界、构造/隔离/清理规则。必须声明逻辑数据集和 test_run_id 都是计划设计，不是已创建fixture或真实run。

## 10. 待确认事项与进入下一步条件

- fixture文件名/builder API留07实施计划；本步不创建实现 skeleton。
- owner conformance vectors、durable cleanup、crypto product保持blocked；无新增 blocker。
- 59 TC均有可重复数据设计或明确blocked正式vector，跨数据审计无冲突。
- Step7通过，允许进入Step8环境与配置矩阵。
