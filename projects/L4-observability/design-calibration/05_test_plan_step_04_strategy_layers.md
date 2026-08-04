# L4-observability 05-测试方案 Step 04：制定测试策略与分层

## Step 状态

| 字段 | 当前值 |
|---|---|
| project | `L4-observability` |
| document | `05-测试方案.md` |
| step | `04 / 制定测试策略与分层` |
| mode | `full-restart` |
| status | `completed_current_design_record` |
| gate_status | `pass` |
| next_allowed_action | `start_current_05_step_05` |
| formal_document_write | `not_allowed_until_step_15` |
| source_baseline | current `00~04` plus current Step 01~03 |
| test_execution | `not_run` |
| evidence | `planned_only`; no real alias or run id |
| commit | not required; no commit requested |

本文件重建了未来草稿中的测试分层结论。原 Step 04 草稿只有粗粒度层级表，未说明风险为什么必须在某一层被发现，
也没有消费 Step 03 的 60 个协议、27 个正式状态和 inherited affected。原草稿仅作为 historical material，
不作为 current 结论来源。

## 1. 本步输入

| 输入 | 具体内容 | 本步用途 |
|---|---|---|
| `standards/document/测试方案讨论流程_SOP.md` Step 04 | unit/service/integration/API/worker/E2E 分层问题、测试金字塔和失败阻断要求 | 固定本步问题和输出结构 |
| `standards/document/测试方案书写规范.md` §四、§三.3 | 表格/ASCII 图规则、正式章节边界和校准来源规则 | 固定可回填形式 |
| `05_test_plan_step_03_test_objects_cuts.md` | 七模块、60 个 exact protocol、27 个 state owner、技术协调状态、P0 切口 | 分层覆盖输入 |
| current `03-详细设计.md` §5~§17 | module/port/protocol/flow/state/UoW/error/concurrency/config/telemetry | 确认风险发现位置 |
| current `04-配置设计.md` §6~§13 | `LocalTest`、`IntegrationLike`、`RuntimeLike`、13-stage assembly、historical binding、redline | 固定环境和 builder 层级 |
| Step 01~02 | 输入边界、P0/P1/P2/Forbidden | 固定阻断级别和非范围 |

## 2. SOP 问题回答

| SOP 问题 | 当前回答 | 设计依据 |
|---|---|---|
| 哪些问题必须在 unit 层发现 | typed ref/enum/schema 的 owner、required field、canonical codec、body-free 字段、domain factory/policy、单个 state transition、错误分类的 exhaustive 映射 | `03` §5~§7、§9、§11、Step 16 |
| 哪些问题必须在 service 层发现 | Command/Consumer/Job 的 exact 编排、reserve/replay/conflict、accepted UoW 顺序、Query zero-write、report fold、claim/fence 和错误映射 | `03` §8、§10~§13、exact-flow cards |
| 哪些问题必须依赖 repository/adapter 集成 | fake/durable parity、CAS/version/cursor、append-only、rollback visibility、historical binding、stable token/probe、external phase | `03` §10~§14 |
| 哪些问题需要 API/worker/jobs entry 测试 | route/metadata/DTO mapping、header-before-payload、ack-after-commit、runner facade-only、least-authority capability | `03` §5、§7~§8、§13 |
| 哪些场景需要 release gate | cross-crate dependency、forbidden material scan、redaction-before-serialization、report/evidence provenance、五个核心能力纵切和 VETO 红线 | `00` VF、`01` §8、`03` §14~§17、`04` §11~§13 |
| 是否把所有高风险推给 E2E | 不允许。能在 contract/domain/service/static 层确定的风险必须在较早层阻断；E2E/release 只验证跨边界组合，不替代局部断言 | 测试 SOP §2.3、Step 04 执行约束 |
| 下游 affected 如何分层 | 对未闭合的上游 schema/binding/owner，只测试 fail-closed、zero-write、disabled/manual surface；positive runtime path 保留 `conditional/blocked`，不把 controlled test 当真实成功 | Step 03 §10、project ledger inherited blockers |

## 3. 当前文档问题诊断

| 历史材料问题 | 对测试策略的影响 | current 处理 |
|---|---|---|
| 旧 `05` 使用相邻项目协议、旧状态和旧产品栈 | 会把不存在的接口或产品集成推入测试分层 | 只消费 current `00~04` 和 Step 03 exact inventory |
| 原 Step 04 仅列 unit/service/integration/release 名称 | 无法判断 60 协议、27 状态和 no-write 风险的发现位置 | 建立风险到层级的双向矩阵 |
| 原稿将配置 profile 写成 `local-dev`/`operations-replay` | 与 current `LocalTest`、`IntegrationLike`、`RuntimeLike` 冲突 | 测试环境只使用 current profile 名 |
| 原稿把外部集成写成真实产品验证 | 越过 product-neutral adapter 和未建立 target reality 边界 | 使用 fake/durable conformance、controlled seam、historical binding probe |
| 原稿把 evidence/report gate 写成可执行结果 | 会伪造真实测试或 evidence | 只定义 gate 输入/输出契约，状态保持 `planned/not_run` |

## 4. 测试分层图

#### 测试分层图: L4-observability 风险发现路径

```text
[Contract / Schema Unit]
        |
        v
[Domain Unit / Static Ownership Scan]
        |
        v
[Application Service-flow]
        |
        +--------------------+
        v                    v
[Repository / Adapter]  [API / Worker / Jobs Entry]
        |                    |
        +---------+----------+
                  v
       [Cross-module Integration]
                  |
                  v
 [Static Redline + Report Provenance Checks]
                  |
                  v
       [Release Smoke / Acceptance Handoff]
```

关键说明:

- 图表达风险从局部契约到跨边界组合的发现位置，不表达实现仓当前已有代码或真实环境已经运行。
- `Query` 的 strict no-write、redaction 和 dependency boundary 同时有 service/static 断言；release gate 只是最终汇总，不是唯一发现点。
- `I05`、`J06` 等 affected path 的正向运行测试不能由 controlled seam 升级为真实成功；它们只进入 fail-closed 或 conditional lane。
- 任何层级失败都必须保留 typed failure、raw artifact/report 规划和后续验收引用位置，具体证据在后续 Step 13 定义。

## 5. 测试层级总表

| 层级 ID | 层级 | 主要目标 | 典型对象/风险 | 执行时机 | P0 失败处理 | 不可替代的更高层验证 |
|---|---|---|---|---|---|---|
| `L1-CONTRACT` | contract/schema unit | 证明 public carrier、协议、secondary type 和 serialization 闭合 | 60 协议 name/metadata/body/variant、typed ref owner、schema version、body-free DTO | 每次 public contract 或 schema 改动；PR | 阻断 | flow order、UoW 和真实 port parity |
| `L2-DOMAIN` | domain unit/static ownership | 证明 domain 自有事实、policy、状态和不变量 | 27 state owner、factory、非法/terminal/reserved transition、无外部依赖 | 每次 domain/state/policy 改动；PR | 阻断 | persistence atomicity、entry capability |
| `L3-SERVICE` | application service-flow | 证明跨对象编排和错误/幂等/只读边界 | Command/Consumer/Job exact flow、UoW 顺序、Query zero-write、report fold、claim/fence | 每次 application/flow/error 改动；PR/main | 阻断 | fake/durable 和 entry envelope |
| `L4-REPOSITORY` | repository contract | 证明持久化 port 在 fake/durable 中语义一致 | unique/CAS/version/cursor/append-only/rollback/reservation/claim | repository/UoW 改动；PR/main | 阻断 | application authorization和跨仓 phase |
| `L5-ADAPTER` | adapter contract | 证明外部接缝只返回 typed safe outcome，历史绑定不可漂移 | resolver、publisher、handoff/export、stable token/probe、Disabled/Unavailable/Degraded | adapter/config 改动；main/integration | 阻断 affected 相关 suite；不伪造外部成功 | 外部真实系统行为不在 current 范围 |
| `L6-ENTRY` | API/worker/jobs entry | 证明入口只做解析、映射、dispatch 和安全动作 | API facade-only、worker header-before-payload/ack-after-commit、job runner facade-only | entry/route/registration 改动；PR/main | 阻断 | service/adapter 内部语义 |
| `L7-INTEGRATION` | cross-module integration | 证明 accepted UoW、outbox、projection、staged Job、split phase 的组合闭环 | write set 原子性、stored snapshot publication、rebuild no-repair、external finalize | 关键 flow 或 port 组合改动；main/nightly | 阻断 | 单个类型不变量和静态扫描 |
| `L8-STATIC-REDLINE` | static/schema/dependency scan | 证明代码和产物没有越过架构/安全红线 | only-core compile dependency、forbidden body/secret、entry capability、report provenance、no static pass | 每个 PR/main/release | 阻断；VETO 候选 | 动态状态转换和故障恢复 |
| `L9-RELEASE` | release smoke/handoff | 证明五个核心能力跨入口可组合，报告可交接 | ingest、audit/evidence、signal、read/query、retention/rebuild/no-write | release candidate；真实 run 才能产生 evidence | 阻断发布准备 | 不能替代所有 unit/service suite |

## 6. 七模块到测试层级映射

本节中的旧 gate 名称仅是原测试稿的 `historical_layer_mapping`，不属于 current automation contract。
current automation 只认 Step 09 定义的 `S-OBS-*` suite；历史名称不得作为 CLI 参数、报告目录或 gate
状态值继续使用。一个模块可以有多个 secondary check，但每个 exact `TC-OBS-*` 仍只有一个 primary suite。

| 模块 | 必须覆盖的层级 | 主要切口 | 层级选择理由 | historical gate 映射 | current primary suite / checks |
|---|---|---|---|---|---|
| `contracts` | `L1-CONTRACT`、`L8-STATIC-REDLINE` | protocol roundtrip、typed ref isolation、secondary type exhaustive、body-free schema | 字段/variant/owner 可在编译和 schema 层确定；禁止等到运行时才发现 | `historical: contract-domain-fast` | `S-OBS-CONTRACT-DOMAIN`; `S-OBS-STATIC-REDLINE` 为 secondary |
| `domain` | `L2-DOMAIN`、`L8-STATIC-REDLINE` | factory/policy、state/history pairing、no external dependency | 不变量和 owner 必须独立于 repository/config；非法 transition 必须无副作用 | `historical: contract-domain-fast` | `S-OBS-CONTRACT-DOMAIN`; `S-OBS-STATIC-REDLINE` 为 secondary |
| `application` | `L3-SERVICE`、`L7-INTEGRATION` | command/consumer UoW order、query no-write、job plan/finalize、typed error mapping | 顺序、同一 UoW 和 stored replay 只有 service/组合层可观察 | `historical: service-flow-fast` | `S-OBS-SERVICE-FLOW`; 组合断言进入 `S-OBS-REPOSITORY-CONFORMANCE` 或 `S-OBS-RECOVERY-REPLAY` |
| `infra` repository/UoW | `L4-REPOSITORY`、`L7-INTEGRATION` | fake/durable parity、CAS/cursor、rollback visibility、claim/fence | port 语义需要两个实现对照；单元 fake 不能证明 durable 行为 | `historical: repository-conformance` | `S-OBS-REPOSITORY-CONFORMANCE`; recovery 断言进入 `S-OBS-RECOVERY-REPLAY` |
| `infra` resolver/publisher/delivery | `L5-ADAPTER`、`L7-INTEGRATION`、`L8-STATIC-REDLINE` | typed availability、historical binding、same-token probe、forbidden material | 外部 body/secret 和 phase 关系必须在 seam 上验证；不测外部产品真相 | `historical: adapter-boundary` | `S-OBS-RECOVERY-REPLAY`; `S-OBS-TELEMETRY-SAFETY` / `S-OBS-STATIC-REDLINE` 为 secondary |
| `infra` config/runtime | `L4-REPOSITORY`、`L5-ADAPTER`、`L8-STATIC-REDLINE` | profile matrix、strict source winner、13-stage totality、old work pinning | builder 的 complete-or-error 和 profile redline 是跨模块配置风险 | `historical: config-redline` | `S-OBS-CONFIG-REDLINE`; `S-OBS-STATIC-REDLINE` 为 secondary |
| `api` | `L6-ENTRY`、`L3-SERVICE` | route/metadata/DTO/error mapping、facade-only | 入口越权能力可由 dependency/spy 直接检查，业务结果仍由 service 负责 | `historical: entry-capability` | `S-OBS-ENTRY-CAPABILITY`; service 语义由 `S-OBS-SERVICE-FLOW` 覆盖 |
| `worker` | `L6-ENTRY`、`L3-SERVICE`、`L7-INTEGRATION` | header/schema/producer gate、ack after commit、outbox snapshot | transport action 与 local outcome 必须分离，组合层验证 commit/ack 顺序 | `historical: consumer-boundary` | `S-OBS-ENTRY-CAPABILITY`; UoW/replay 断言进入 `S-OBS-SERVICE-FLOW` / `S-OBS-RECOVERY-REPLAY` |
| `jobs` | `L6-ENTRY`、`L3-SERVICE`、`L7-INTEGRATION` | immutable plan、claim/fence、report fold、external phase | runner 只负责边界，job service 负责 durable coordination，组合层验证不丢 item | `historical: operations-replay` | `S-OBS-RECOVERY-REPLAY`; entry facade 由 `S-OBS-ENTRY-CAPABILITY` 覆盖 |

## 7. 五类协议族分层映射

### 7.1 Command `C01~C16`

| 分层 | 必须验证 | 代表协议 | 失败时观察面 |
|---|---|---|---|
| `L1-CONTRACT` | exact command variant、typed input、metadata、result/error carrier、required field | 全部 `C01~C16` | 构造/编码失败；不进入 application |
| `L2-DOMAIN` | owner factory、policy guard、合法/非法 state transition | `C02`、`C09`、`C13`、`C15`、`C16` | typed domain error；无 state/history/outbox |
| `L3-SERVICE` | reserve/replay/conflict、accepted UoW、cursor 和 result ordering | 全部 `C01~C16` | rollback/commit-unknown probe；不重复 mutation |
| `L4-REPOSITORY` | unique/CAS/append/cursor/rollback visibility | `C01`、`C05`、`C12`、`C15` | fake/durable mismatch 阻断 |
| `L5-ADAPTER` | resolver/body-free/effect preparation/historical binding | `C01`、`C06`、`C11`、`C14`、`C16` | unavailable/blocked/manual；禁止 current fallback |
| `L7-INTEGRATION` | owner + history + stale/outbox + stored result same-UoW | `C01`、`C05`、`C07`、`C12`、`C16` | zero partial effect |
| `L8-STATIC-REDLINE` | no source write、no body/secret、no external truth | 全部 mutation commands | VETO candidate |

### 7.2 Query `Q01~Q14`

| 分层 | 必须验证 | 代表范围 | 失败时观察面 |
|---|---|---|---|
| `L1-CONTRACT` | selector/page/view/error/degraded carrier、cardinality、visibility/freshness enum | 全部 `Q01~Q14` | typed malformed/invalid cursor |
| `L3-SERVICE` | same committed read boundary、relation validation、strict zero-write | 全部 `Q01~Q14` | missing/not-visible/stale/degraded；不 begin write UoW |
| `L4-REPOSITORY` | read facet/cursor/version/order parity | `Q02`、`Q05`、`Q09`、`Q13`、`Q14` | corrupt relation/ordering fail closed |
| `L5-ADAPTER` | 明确不调用 resolver refresh/external delivery；仅消费 stored safe surface | `Q06`、`Q07`、`Q12`、`Q13` | unavailable surface，不触发修复 |
| `L6-ENTRY` | route/metadata/page input mapping、no write capability | 全部 query entry | facade/authorization mismatch |
| `L8-STATIC-REDLINE` | query module 无 writer dependency、无 refresh/rebuild/save 调用 | 全部 `Q01~Q14` | VETO candidate |

### 7.3 Inbound Consumer `I01~I09`

| 分层 | 必须验证 | 代表范围 | affected 规则 |
|---|---|---|---|
| `L1-CONTRACT` | envelope/header/schema/producer/payload/receipt/action carrier | 全部 `I01~I09` | 未闭合 payload/binding 只能解析前拒绝 |
| `L3-SERVICE` | header-before-payload、reserve/source event、local landing、commit/ack action mapper | 全部 `I01~I09` | unknown completion 无默认 action |
| `L4-REPOSITORY` | secondary uniqueness、source version、local UoW rollback | `I01`、`I02`、`I05`、`I08` | fake/durable parity |
| `L5-ADAPTER` | producer binding、body-free resolver、transport-safe binding | `I03~I09` | `I05` positive path blocked/conditional |
| `L6-ENTRY` | worker callback、unsupported schema 不 parse、不 ack、不写 | 全部 consumer entry | entry capability gate |
| `L7-INTEGRATION` | accepted local landing + authorized event snapshot + ack-after-commit | `I01`、`I05`、`I08`、`I09` | no source/downstream truth write |

### 7.4 Outbound Event `E01~E12`

| 分层 | 必须验证 | 代表范围 | 失败边界 |
|---|---|---|---|
| `L1-CONTRACT` | event variant/version/payload/binding/cursor schema | 全部 `E01~E12` | encoder/schema mismatch rollback |
| `L3-SERVICE` | accepted local post-state 才能生成 event snapshot | 全部 event producer | rejected/rollback 无 event |
| `L4-REPOSITORY` | outbox append、immutable bytes、publication marker CAS | `E01`、`E05`、`E08`、`E12` | snapshot corruption/duplicate marker |
| `L5-ADAPTER` | publisher exact binding、same token、probe/finalize | `E01~E12` via J01 | provider response 不等于 local Published |
| `L7-INTEGRATION` | source UoW 与 outbox atomicity、J01 stored snapshot publication | `E01`、`E04`、`E06`、`E12` | 不读取 current truth 重建 |
| `L8-STATIC-REDLINE` | payload 无 body/secret/provider response，event 不拥有 source truth | 全部 event | VETO candidate |

### 7.5 Operations Job `J01~J09`

| 分层 | 必须验证 | 代表范围 | 失败边界 |
|---|---|---|---|
| `L1-CONTRACT` | job input/plan/report/item/outcome typed carrier | 全部 `J01~J09` | missing report ref/invalid plan |
| `L2-DOMAIN` | state owner / item outcome transition和终态封存 | `J02`、`J03`、`J05`、`J06` | blocked/manual，不伪造成功 |
| `L3-SERVICE` | immutable plan、claim/fence、item UoW、report fold、duplicate replay | 全部 `J01~J09` | partial/typed failure |
| `L4-REPOSITORY` | claim/CAS/fence/progress/report durability | 全部 jobs | fake/durable parity |
| `L5-ADAPTER` | J01/J07/J08 external phase, same-token probe, historical binding | `J01`、`J07`、`J08` | external unknown/manual |
| `L6-ENTRY` | one-shot parser/dispatch/report/exit；无 direct adapter/repository | 全部 job entry | facade-only violation |
| `L7-INTEGRATION` | staged job cross-store closure、no source repair、terminal replay | `J01`、`J02`、`J06`、`J07`、`J09` | no partial/fabricated report |

## 8. 状态和一致性分层映射

### 8.1 27 个正式 state owner

| 状态族 | 正式 owner 数 | 首要层级 | 组合层级 | 必须验证的共同断言 |
|---|---:|---|---|---|
| observation truth/safety | 6 | `L2-DOMAIN` | `L3-SERVICE`/`L7-INTEGRATION` | factory、合法/非法 transition、history pairing、body-free state |
| handoff/retention/gap | 7 | `L2-DOMAIN` | `L3-SERVICE`/`L7-INTEGRATION` | block/hold/gap 显式表达、禁止 source repair、outbox/stale side effect |
| read/reference/maintenance | 8 | `L2-DOMAIN` + `L4-REPOSITORY` | `L3-SERVICE`/`L7-INTEGRATION` | Query 不推进 state、snapshot version/current-head uniqueness、rebuild derived-only |
| propagation/idempotency/report | 6 | `L2-DOMAIN`/`L4-REPOSITORY` | `L3-SERVICE`/`L7-INTEGRATION` | append-only publication、same-token retry、reservation result、report fold |
| **合计** | **27** |  |  | `ObservationJobPlanItemState` 另列为技术协调状态 |

正式状态名以 current `03` §9 和 `03_ddd_step_10_state_matrix.md` 为唯一来源。`Accepted`、`DuplicateReplayed`、
`ObservationCommandOutcome`、`ObservationConsumerOutcome`、`ObservationJobOutcome`、availability snapshot 和 entry
carrier 不计入 lifecycle owner；测试分层不得为它们创建第二套 transition repository。

### 8.2 状态测试层级规则

| 行为 | 必须先在何层发现 | 组合层验证 | 禁止替代 |
|---|---|---|---|
| factory 缺失/wrong-owner/body-bearing 输入 | `L1-CONTRACT` + `L2-DOMAIN` | accepted flow negative | 只在 API 参数校验发现 |
| 合法 transition | `L2-DOMAIN` | service/UoW side effect | 只看日志或最终 query |
| 非法/terminal/reserved transition | `L2-DOMAIN` | rollback/no side effect | 把 outcome 当 state |
| state + native history pairing | `L2-DOMAIN` | `L3-SERVICE`/`L7-INTEGRATION` | 手工检查数据库偶然行 |
| CAS/version/fence | `L4-REPOSITORY` | concurrent service/job | sleep 或 process lock |
| external phase | `L5-ADAPTER` | J07/J08 integration | 把 prepare/deliver/finalize 合并 |
| Query no-write | `L3-SERVICE` + `L8-STATIC-REDLINE` | API/query integration | miss 时 inline repair |

### 8.3 技术协调状态

`ObservationJobPlanItemState` 在 `L2-DOMAIN` 验证有限 transition，在 `L3-SERVICE` 验证 plan/report/fence 顺序，
在 `L4-REPOSITORY` 验证 durable claim/CAS，在 `L7-INTEGRATION` 验证 item outcome fold。它不能被用来替代任何正式
业务状态，也不能让 `Running` 变成 process-memory heartbeat。

## 9. 横切风险到层级映射

| 风险 ID | 风险主题 | 首要层级 | 必须叠加层级 | 最小断言 | P0 阻断 |
|---|---|---|---|---|---|
| `RISK-OBS-BODY` | raw body/secret/credential/provider body 泄漏 | `L1-CONTRACT`/`L8-STATIC-REDLINE` | `L3-SERVICE`/`L5-ADAPTER`/`L9-RELEASE` | serialization 前 redaction；public/report/telemetry 无 forbidden field | 是 |
| `RISK-OBS-TRUTH-WRITE` | query/rebuild/report/export/consumer 反写业务 truth | `L3-SERVICE` | `L6-ENTRY`/`L7-INTEGRATION`/`L8-STATIC-REDLINE` | writer call set 为空或只限 observation-owned store；violation explicit | 是 |
| `RISK-OBS-UOW` | partial commit、cursor/history/outbox 顺序错误 | `L3-SERVICE` | `L4-REPOSITORY`/`L7-INTEGRATION` | one accepted effect set；rollback 无可见 partial；cursor 先于 cursor-bound records | 是 |
| `RISK-OBS-IDEMPOTENCY` | duplicate/conflict/in-flight second writer | `L3-SERVICE` | `L4-REPOSITORY`/`L7-INTEGRATION` | same digest replay stored result；different digest conflict；no rerun | 是 |
| `RISK-OBS-CONCURRENCY` | CAS/version/claim/fence race | `L4-REPOSITORY` | `L3-SERVICE`/`L7-INTEGRATION` | one winner、stale writer rejected、terminal item sealed | 是 |
| `RISK-OBS-EXTERNAL-PHASE` | wrong target、换 token、blind retry、phase collapse | `L5-ADAPTER` | `L3-SERVICE`/`L7-INTEGRATION` | immutable binding、same-token probe、known-success finalize-only | 是 |
| `RISK-OBS-CONFIG` | partial runtime/profile bypass/current fallback | `L5-ADAPTER`/`L8-STATIC-REDLINE` | `L6-ENTRY`/`L7-INTEGRATION` | 13-stage complete-or-error；RuntimeLike 禁 fake/control；old work pinning | 是 |
| `RISK-OBS-DEPENDENCY` | non-core compile dependency/entry capability越权 | `L8-STATIC-REDLINE` | `L1-CONTRACT`/`L6-ENTRY` | only core contract compile edge；minimal private slice | 是 |
| `RISK-OBS-EVIDENCE` | static passed、fake run/evidence/verdict/signoff | `L8-STATIC-REDLINE` | `L7-INTEGRATION`/`L9-RELEASE` | artifact -> report -> index；candidate IDs only until real run | 是 |
| `RISK-OBS-RECURSION` | self-observation recursion / telemetry as authority | `L3-SERVICE`/`L8-STATIC-REDLINE` | `L9-RELEASE` | instrumentation suppression and finite recursion guard；telemetry不驱动业务状态 | 是 |

## 10. 测试时机与阻断策略

| 触发点 | 必跑层级/套件 | 适用变更 | 阻断规则 |
|---|---|---|---|
| PR contract/domain | `L1-CONTRACT`、`L2-DOMAIN`、相关 static scan | public DTO、state、policy、ref、schema | 任一 P0 失败阻断合并 |
| PR service | `L3-SERVICE`、受影响 `L4-REPOSITORY` | flow、UoW、error、idempotency、query | P0 flow/no-write 失败阻断 |
| main integration | `L4-REPOSITORY`、`L5-ADAPTER`、`L6-ENTRY`、`L7-INTEGRATION` | ports、runtime、entry、consumer/job/event | affected path 按 conditional/blocked 裁决；已承诺的 positive path 失败阻断 |
| nightly/replay | `L7-INTEGRATION`、故障注入、fake/durable parity | recovery、race、rebuild、retention、external phase | 未产生真实结果前不得写 release pass |
| release candidate | `L8-STATIC-REDLINE`、`L9-RELEASE`、report-generation audit | 全仓边界、五能力纵切、证据交接 | redline/VETO candidate 直接阻断送验 |

## 11. P0 切口分层覆盖停审

| P0 切口组 | 设计来源 | 首要层级已明确 | 组合层级已明确 | phase/affected 边界 | 结论 |
|---|---|---|---|---|---|
| contracts protocol/ref/schema | `03` §5.1、§6、§7 | `L1-CONTRACT` | `L3-SERVICE` | I05 payload 缺口只做 pre-parse fail-closed | pass |
| domain state/policy | `03` §5.2、§9 | `L2-DOMAIN` | `L3-SERVICE`/`L7-INTEGRATION` | 27 owner；技术状态单独 | pass |
| command/consumer UoW | `03` §8、§10~§13 | `L3-SERVICE` | `L4`/`L7` | 保留 `R06-F-AFFECT-UOW-01` | pass |
| query no-write | `03` §7.3、§8.3、§14.9 | `L3-SERVICE`/`L8` | `L6`/`L7` | 不因 miss/stale 触发 repair | pass |
| repository parity | `03` §10~§13 | `L4-REPOSITORY` | `L7` | fake 不得额外成功 | pass |
| external phase/binding | `03` §11、§13~§14 | `L5-ADAPTER` | `L7` | J07/J08 positive conditional；same-token only | pass |
| config/runtime | `03` §13、`04` §6~§13 | `L5`/`L8` | `L6`/`L7` | profile exact；RuntimeLike 禁 fake/control | pass |
| api/worker/jobs capability | `03` §5、§7~§8 | `L6-ENTRY` | `L3`/`L7` | entry 不持有 writer/adapter越权能力 | pass |
| telemetry/redaction/evidence | `03` §14~§15、`00` VF | `L8-STATIC` | `L3`/`L5`/`L9` | candidate evidence only；不伪造 alias/run | pass |

## 12. 跨层审计

| 审计项 | 结论 | 处理 |
|---|---|---|
| 每个 Step 03 P0 切口至少有一个测试层级 | pass | 七模块、协议族、状态/一致性/安全/依赖全部映射 |
| 高风险是否被不恰当地推到 E2E | pass | 局部不变量前移到 contract/domain/service/static |
| Query 是否存在隐藏 writer 层 | pass | service write spy + static dependency 双门禁 |
| fake 是否被当成 durable 证明 | pass | repository contract 要求 fake/durable parity |
| 外部产品是否被错误纳入 current scope | pass | adapter contract/controlled seam；无 vendor truth |
| affected 是否被测试方案关闭 | no | 只形成 planned cut；I05/J06 等 positive path conditional/blocked |
| 层级名称、profile、状态名是否与 current 基线一致 | pass | 使用 `L1~L9`、`LocalTest/IntegrationLike/RuntimeLike`、`03` exact names |
| 测试执行/evidence/run_id 是否真实存在 | not_run | 后续 Step 仅定义计划和路径 |

## 13. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 只做 unit + E2E | 表面简单 | UoW、CAS、entry capability 和 adapter phase 无明确发现位置 | 拒绝 |
| 按 crate 各写一套独立测试 | 容易分工 | 跨协议族/跨 store 的共享不变量重复且容易漏 | 拒绝；保留 shared conformance 但不替代 exact flow |
| 风险驱动的九层分配 | 每个风险在最早可观察层阻断，并保留跨模块组合验证 | suite/fixture 数量较多，需要后续矩阵维护 | 采用 |
| 用 release smoke 覆盖所有 P0 | 接近用户路径 | 失败定位慢，无法证明字段/状态/顺序细节 | 拒绝；release 只做最终组合门禁 |
| 用 controlled external seam 宣称成功 | 可先跑通 | 会把设计条件化误写为真实事实 | 拒绝；controlled 仅验证接口和 fail-closed/phase 规则 |

## 14. 回填草稿

正式 `05-测试方案.md` §4 应承载以下收口结论：测试采用九层风险驱动分层，从 `L1-CONTRACT`、`L2-DOMAIN`、
`L3-SERVICE`、`L4-REPOSITORY`、`L5-ADAPTER`、`L6-ENTRY`、`L7-INTEGRATION`、`L8-STATIC-REDLINE` 到
`L9-RELEASE`。七模块、五类协议族、27 个 state owner、UoW/幂等/并发/配置/安全/证据风险均有首要层级和
组合层级；P0 失败阻断对应 gate。Query strict no-write、redaction-before-serialization、only-core dependency、
historical binding 和 no-source-repair 必须同时通过 service/static/integration 适用门禁。I05 canonical payload/binding
和 J06 H13 positive path 保持 conditional/blocked，不以 controlled test 生成真实成功证据。

## 15. 待确认事项与 inherited blocker

| ID | 事项 | 当前处理 | 影响 |
|---|---|---|---|
| `S08-E-I05-PAYLOAD-SCHEMA-01` | I05 canonical payload/schema/encoder/registration 未由上游闭合 | `open_upstream_internal`;仅允许 pre-parse fail-closed | I05 positive lane blocked |
| `S08-E-I05-PRODUCER-EVENT-BINDING-01` | I05 producer event binding 未闭合 | `open_upstream_internal`;slot 不激活/不 ack/不写 | I05 positive lane conditional |
| `R06.6-F2-H13-UPSTREAM` | J06 H13 owner/positive replay record 未闭合 | `open_controlled`;只设计 blocked/manual/no-fabrication | J06 positive lane blocked |
| `R06-F-AFFECT-UOW-01` | accepted UoW 顺序仍需下游逐 flow 传播 | `step07_surface_closed_downstream_open` | service/integration gate 必须保留 exact order |
| `S08-RECOVERY-CLASS-OWNER-01` | recovery mapper owner/totality affected | 保持 open | error mapping gate conditional |
| target reality | 实现仓/真实 adapter/physical store 未核实 | `not_established` | 不阻断 design record，不形成执行证据 |

## 16. 进入下一步条件

- [x] Step 03 全部 P0 测试切口均有首要层级和至少一个组合层级。
- [x] 测试分层图、层级表和七模块/协议/状态映射可回填正式 §4。
- [x] P0 分层停审和跨层审计无结构性 unresolved 冲突。
- [x] inherited affected 未被误关闭，conditional/blocked 语义保留。
- [x] 本步未写测试执行结果、真实 evidence、run_id、verdict 或 signoff。

## 17. 参考

- `standards/document/测试方案讨论流程_SOP.md` Step 04
- `standards/document/测试方案书写规范.md` §三、§四
- `standards/document/设计文档讨论中间产物规范.md`
- `projects/L4-observability/design-calibration/05_test_plan_step_03_test_objects_cuts.md`
- `projects/L4-observability/design-calibration/03_ddd_step_09_exact_flow_cards.md`
- `projects/L4-observability/design-calibration/03_ddd_step_10_state_matrix.md`
- `projects/L4-observability/design-calibration/03_ddd_step_16_test_cuts.md`
- `projects/L4-observability/03-详细设计.md` §5~§17
- `projects/L4-observability/04-配置设计.md` §6~§13
