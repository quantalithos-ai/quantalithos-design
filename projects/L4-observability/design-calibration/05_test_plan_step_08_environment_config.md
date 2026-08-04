# L4-observability 05-测试方案 Step 08 · 测试环境与配置矩阵

## Step 状态

| 字段 | 当前值 |
|---|---|
| 文档 / Step | `05-测试方案 / Step 08 设计测试环境与配置矩阵` |
| mode | `full-restart` |
| status | `completed_current_with_inherited_affected_open` |
| current_module | `all` |
| direct_input | current Step 07：82 个 dataset、99/99 TC、27+1 状态 corpus、16 切口数据停审 |
| historical_material | 旧 87 行稿把环境设计写成废弃 log/metric/trace/audit 对象摘要，且未区分 lane/profile/instance/依赖类型，已全量替换，不继承 |
| environment contract / instance | `defined / not_established` |
| implementation / pipeline / test execution | `not_started / nonexistent / not_run` |
| real run_id / artifact / evidence / result | `absent_by_design` |
| new_upstream_blocker | `none` |
| inherited_blocker | I05 schema/binding、J06 H13 与其余 affected 保持开放 |
| next_allowed_action | 读取 Step 09 标准与 current suite/case/environment 输入，设计自动化和 CI/CD 门禁 |

## 1. 本步输入与采用方式

| 输入 | Current 状态 | 本 Step 采用内容 |
|---|---|---|
| 测试方案 SOP Step 08 / 书写规范 §5.8 | current standard | local/CI/integration/staging、依赖类型、协作方式、配置可定位、不可用处置和拓扑图门禁 |
| `01-架构设计.md` §8 | current formal | `L0-core` 唯一 compile dependency；其余 sibling 只走 runtime/event/handoff/read seam |
| `03-详细设计.md` §5~§15 | current formal | repository/UoW、resolver、publisher、entry、Job、claim/fence、external phase 与 product-neutral port |
| `04-配置设计.md` §5~§14 | current formal | 6 条 environment lane、3 个 runtime class、61 ENV、23 域、13-stage assembly、25 failure、availability/history |
| Step 04 | completed current | L1~L9 测试层级及 isolated/durable/entry/integration/static 验证职责 |
| Step 06 | completed current | 99 TC、60 exact protocol、27+1 state、UoW/Consumer/Job/external phase |
| Step 07 | completed current | 82 dataset、builder/fake/durable/read-only 方式、隔离和清理 |
| L1-governance / L1-artifact Step 08 | 粒度参考 | 环境矩阵、依赖分类、数据映射、不可用处理和停审结构；不复制其 profile/业务依赖 |
| workspace reality check | current local fact | `quantalithos-core/crates/contracts/Cargo.toml` 存在；`quantalithos-observability`、目标 CI/config/scripts 和 6 lane instance 不存在 |

## 2. SOP 问题回答

| SOP 问题 | Current 回答 |
|---|---|
| local / CI / integration / staging 分别测什么 | local 与 CI 各分 isolated 和 durable integration；staging 只承载 RuntimeLike release rehearsal。production 是操作语境，不是测试通过的替代。test/replay 是用途轴，不是 profile |
| 每个环境依赖哪些服务 | isolated 只需 formal fake/in-memory/controlled harness；integration 需要 durable store、schema/UoW/CAS/fence、restart 和 selected nonprod adapter；RuntimeLike 需要 approved durable/endpoint/secret/entry，但实例当前均未建立 |
| 哪些配置影响结果 | explicit runtime class、technical mode、4 store binding、digest/idempotency/projection/execution、5 external root、12 event target、handoff/export catalog、16/14/9/9 entry set、schema/source/safety和13-stage activation |
| 哪些依赖使用 fake/mock | 当前不使用 ad hoc mock。LocalTest 可用 formal Fake/Controlled/Disabled；IntegrationLike 只用 Controlled/Endpoint/Disabled；RuntimeLike 只用 Endpoint/Disabled。Repository fake必须通过同一 conformance contract |
| 环境不可用如何处理 | required precondition 缺失即 lane `blocked/not_run`，不得切换低等级 lane、InMemory、Fake、current binding或空成功；预期 unavailable case只有命中 exact typed surface 才可通过 |
| 哪些依赖允许 path dependency | 只有 `quantalithos-core/crates/contracts` 对应 `core-contracts`；当前 manifest 确认存在，但目标实现仓不存在，未实际添加 dependency |
| 哪些是 runtime/event collaboration | Bus、Identity、Governance、Artifact、Runtime、Sandbox、Archive、SDK/Console、report/GRC/alert及外部产品全部经 formal event/ref/resolver/query/handoff/export seam；禁止 sibling package dependency |
| P0 环境是否可定位 | 设计位置可定位为 `ENV-LCL-ISO/INT` 与 `ENV-CI-ISO/INT`；RuntimeLike rehearsal为 `ENV-STG-RT`。实例、pipeline和execution仍为未建立，不得写 ready/pass |

## 3. Historical 诊断与 current 取舍

### 3.1 旧材料诊断

| 旧内容 | 冲突 / 缺口 | Current 处置 |
|---|---|---|
| `NormalizedLogRecord`、`MetricPoint`、`TraceSpanRecord`、`AuditEventProjection` | 已被 current owner/schema 淘汰；不是 environment subject | 删除；环境只绑定 current protocol/owner/dataset/config |
| local-dev / ci-test / operations-replay 作为 profile | 与 formal `LocalTest/IntegrationLike/RuntimeLike` 冲突 | lane 与 profile 分层；test/replay降为用途轴 |
| “环境已准备”式 pass | 没有 target repo、config、CI、store、endpoint、credential 或 run | contract可定义；instance保持`not_established`，verification保持`not_run/not_evaluated` |
| 不区分 compile/runtime/event | 容易给 sibling 加 path/Cargo dependency | 逐依赖对象建立全局类型与协作方式表 |
| fake/real-like 泛称 | 未绑定 profile legality、formal outcome或清理 | 只使用 formal Fake/Controlled/Endpoint/Disabled 与 durable-like conformance |
| 未映射 current dataset | 环境无法承接99 TC | 82 dataset按 isolated/durable/recovery/static/runtime rehearsal分组映射 |
| staging/production 省略 | 无法表达 RuntimeLike 红线与残余风险 | 保留 lane契约，但不声称instance或evidence存在 |

### 3.2 设计取舍

| 议题 | 采用 | 放弃 | 理由 |
|---|---|---|---|
| 环境与 profile | 6 条 document lane显式映射3个formal runtime class | 从host/branch/CI名称推profile | profile进入typed config，lane只组织验证语境 |
| P0 主环境 | `ENV-CI-ISO` + `ENV-CI-INT`，本地对应lane供调试 | 单一万能CI环境 | isolated可确定性验证，durable lane证明restart/UoW/capability |
| store验证 | shared conformance先跑InMemory/Fake，再在Durable重复关键语义 | fake通过即证明durable正确 | atomicity/CAS/fence/restart不能由private map替代 |
| 外部接缝 | formal controlled outcomes + endpoint capability分层 | 依赖真实 sibling源码或always-success mock | 验证seam semantics且保持dependency pruning |
| replay/resume | 在IntegrationLike/RuntimeLike Job场景读取stored plan/snapshot/binding | 新建operations replay profile/source | replay不改变配置schema或历史identity |
| staging/prod | 定义RuntimeLike precondition与forbidden组合 | 写成已准备或当前P0 pass前置 | 当前缺产品、拓扑、credential、runbook与真实证据 |
| feature flag | 只使用formal enabled sets/catalog/mode；无泛化flag | 配置关闭redaction/no-write/UoW/token等invariant | 安全与truth红线不可配置化 |
| unavailable | original lane fail/blocked/not-run | fallback低等级lane并记pass | 防止环境故障污染evidence truth |

## 4. 概念分层与真实性状态

### 4.1 四层概念

| 层 | 示例 | 是否进入 typed root | 规则 |
|---|---|---|---|
| environment word | local、CI、test、staging、prod | 否 | 标准讨论词，不可推断profile |
| document lane | `ENV-LCL-ISO` 等6项 | 否 | 组织candidate owner、依赖、验证职责和真实性状态 |
| runtime class | `LocalTest/IntegrationLike/RuntimeLike` | 是 | 必须显式配置并通过formal mode matrix |
| adapter/store/technical mode | InMemory/Durable、Fake/Controlled/Endpoint/Disabled、Fixed/System、Deterministic/Runtime | 是 | 只能使用formal enum及其profile组合 |

`operations replay`、fault injection、restart、release rehearsal是测试用途，不是第四种runtime class。Lane ID不得进入
domain state、Job run identity、evidence alias或验收结论。

### 4.2 Workspace 与环境现实

| 对象 | Current reality | 允许声明 | 禁止声明 |
|---|---|---|---|
| `quantalithos-core/crates/contracts/Cargo.toml` | `present` | 唯一compile dependency path可定位 | 已在目标仓成功编译 |
| `/home/aris/Projects/quantalithos-observability` | `absent` | `07`需先做target reality/init boundary | implementation/tests/config存在 |
| target Cargo/workspace/modules | `absent` | planned implementation precondition | crate graph已闭合 |
| local/CI strict JSON candidates | `absent` | schema/source contract已定义 | config artifacts已建立 |
| CI pipeline/gate scripts | `absent` | Step09可定义planned producer | suite已运行或阻断生效 |
| durable store/schema/UoW adapter | `not_selected/not_evaluated` | IntegrationLike required capability明确 | durability/atomicity已证明 |
| nonprod endpoint/transport/secret provider | `not_selected/not_evaluated` | controlled/endpoint precondition明确 | adapter已连通 |
| staging/production topology | `not_established` | RuntimeLike语义和stop rule明确 | release/production ready |
| run/artifact/report/evidence | `absent` | 只能在真实执行后创建 | lane定义等于执行证据 |

## 5. 六条 environment lane 矩阵

| Lane / runtime class | 用途 | 依赖服务与全局类型 | 测试协作方式 | 关键配置 | 数据策略 | Current 状态 / 风险 |
|---|---|---|---|---|---|---|
| `ENV-LCL-ISO` / `LocalTest` | 本地contract/domain/service/fault调试和最小手动P0 | compile:`core-contracts`;runtime:InMemory/Fake/Controlled/Disabled | formal fake/controlled；无required network | developer strict JSON；InMemory或explicit Durable；Fixed/Deterministic可用 | canonical/negative/state/UoW fake/sentinel subset；namespace cleanup | contract defined；instance absent；不能证明durability或生成正式evidence |
| `ENV-LCL-INT` / `IntegrationLike` | 本地durable adapter、restart、entry、external phase调试 | compile:`core-contracts`;runtime:Durable + nonprod controlled/endpoint；event:fixture/controlled transport | durable-like/Controlled/Endpoint/Disabled；禁止Fake/InMemory | integration strict JSON；System/Runtime；selected locator必须解析 | persistence/claim/outbox/job/external/config datasets；verified namespace cleanup | adapter/product未选；not_run；失败不得fallback ISO |
| `ENV-CI-ISO` / `LocalTest` | deterministic blocking P0 contract/domain/service/redline/fake conformance | compile:`core-contracts`;runtime:isolated fake infra；event:fixture envelope | formal fake/controlled + deterministic barriers/failpoints | suite strict JSON；InMemory；CI-safe ENV；禁production credential | 82 dataset中除required real durable/runtime lanes外全部可在此做semantic baseline | pipeline/config/scripts absent；planned only；不得写CI pass |
| `ENV-CI-INT` / `IntegrationLike` | blocking durable UoW/CAS/fence/restart/catalog/capability integration | compile:`core-contracts`;runtime:Durable nonprod services；event:controlled/endpoint transport | durable conformance + Controlled/Endpoint/Disabled | suite integration JSON；System/Runtime；schema/capability/secret fail closed | UoW unknown、CAS/fence、restart/history、external intent、activation dataset | services/capability未核验；not_run；fake通过不能替代 |
| `ENV-STG-RT` / `RuntimeLike` | release rehearsal、managed binding、RuntimeLike forbidden-combination与selected-run | compile:`core-contracts`;runtime:approved Durable/Endpoint；event:real-like nonprod boundary | Endpoint/Disabled only；不得fixture/Fake/Controlled | release-managed strict JSON + deployment ENV；managed locator | 仅de-identified selected dataset / body-free canary；不使用synthetic shortcut | instance/product/credential/topology未建立；not_evaluated；不计当前P0 pass |
| `ENV-PRD-RT` / `RuntimeLike` | 正式operations/resume/old binding语义；不是自动化测试环境 | compile:`core-contracts`;runtime:production Durable/Endpoint；event/handoff:approved boundary | approved Endpoint/Disabled only | operations strict JSON；production locator；stored old binding only | 禁止ordinary synthetic fixture；未来production-safe canary/runbook决定 | instance/runbook/evidence未建立；不执行；不能作为本轮测试或验收事实 |

### 5.1 Formal profile / mode 合法组合

| Runtime class | Store / clock / ID | External mode | Current result |
|---|---|---|---|
| `LocalTest` | InMemory或Durable；Fixed或System；Deterministic或Runtime | Fake/Controlled/Disabled | 合法；仍必须通过same logical conformance |
| `LocalTest + Endpoint` | 任意 | Endpoint | `InvalidConfiguration` |
| `IntegrationLike` | Durable + System + Runtime | Controlled/Endpoint/Disabled | 合法；必须验证descriptor/schema/UoW/restart/capability |
| `IntegrationLike + InMemory/Fake/Fixed/Deterministic` | 非法 | 任意 | `InvalidConfiguration` |
| `RuntimeLike` | Durable + System + Runtime | Endpoint/Disabled | 合法candidate；selected binding/secret/capability必须完整 |
| `RuntimeLike + InMemory/Fake/Controlled/Fixed/Deterministic` | 非法 | 任意 | `InvalidConfiguration` |

### 5.2 环境拓扑

```text
                         [quantalithos-core / core-contracts]
                                      ^
                                      | [compile]
                                      |
  [strict config candidate] -> [observability runtime builder]
            [runtime]                  |
                                       | [runtime]
              +------------------------+------------------------+
              |                        |                        |
              v                        v                        v
      [API / Query entry]      [Consumer / outbox]       [Job / scheduler]
              |                        |                        |
              +------------------------+------------------------+
                                       |
                                       v [runtime]
                          [repositories / UoW / claims]
                                       |
                   +-------------------+-------------------+
                   |                                       |
                   v [event]                               v [runtime]
      [Bus / source-owner fixture or endpoint]   [safe resolvers / probes]
                   |                                       |
                   +-------------------+-------------------+
                                       |
                                       v [handoff/runtime]
                        [publisher / report / export target]

  Identity / Governance / Artifact / Runtime / Sandbox / Archive /
  SDK / Console / report / GRC / alert systems:
    -> [runtime], [event] or [handoff] collaboration only
    -> never a compile dependency of observability core
```

## 6. 测试依赖类型与协作方式判定

| 依赖对象 | 全局依赖类型 | 是否允许 target package dependency | P0 / selected-run 协作方式 | 覆盖数据 / TC主轴 | 不可替代的事实 |
|---|---|---|---|---|---|
| `L0-core/core-contracts` | compile | 是；路径已定位 | future target path/package dependency；当前仅design reference | 全部 typed ref/metadata/schema TC | target compile仍未执行 |
| `L0-bus` | event collaboration | 否 | fixture envelope、controlled consumer transport、publisher endpoint capability | metadata/source-version/outbox/I01/E01~E12 | broker/ack/DLQ真实性需INT/RT实例 |
| `L1-identity` | runtime/event | 否 | actor/subject safe ref、I03 fixture或controlled event、resolver outcome | ref/source-version/reference snapshot | identity lifecycle/authorization truth |
| `L1-governance` | runtime/event | 否 | body-free audit/evidence context、I04、safe resolver | audit/evidence/handoff dataset | governance decision/policy truth |
| `L1-artifact` | runtime/event | 否 | C06 body-free ref、I05 pre-parse disabled gate；positive binding待上游 | evidence positive C06；I05 blocked dataset | artifact/evidence body与I05 schema |
| `L2-runtime` | runtime/event | 否 | safe signal summary I06、controlled source snapshot | signal/correlation/source-version | execution/run/success truth |
| `L4-sandbox` | runtime/event | 否 | safe/quarantine signal I07、controlled summary | signal/safety/gap | sandbox control/execution truth |
| `L4-archive` | runtime/handoff | 否 | I08 feedback fixture、J07 controlled delivery、body-free receipt | handoff/external intent/outcome | archive acceptance/package truth |
| report consumer / GRC | runtime/handoff | 否 | I09/J08 product-neutral controlled target | peripheral/export/availability | verdict/signoff/compliance truth |
| `L0-sdk` / `L5-console` | runtime/read | 否 | Q01~Q14 public read surface/capability contract | read/no-write/truth comparison | UI state或SDK cache truth |
| alert/anomaly/analysis | runtime/read | 否 | safe signal/diagnostic read fixture、sink spy | telemetry schema/recursion/no-write | alert ack或dashboard health truth |
| store/secret/transport products | runtime technical | 否，product SDK仅future infra boundary审计后可考虑 | Fake/Controlled/Endpoint descriptors behind current ports | UoW/config/availability/activation | product health不证明operation成功 |
| dependency/history corpus | local tooling | 不适用 | read-only manifest/module/document content digest | `DEP/HIST/OWN/NW` static TC | 不修改源码造fixture |

只有第一行允许跨仓compile edge。现有 governance/identity/bus/sdk 仓是否存在不改变此分类；repo present不等于
允许Cargo/path dependency，repo absent也不授权复制其contracts或自造shadow DTO。

## 7. 测试主题到 environment lane

| 测试主题 | Required semantic lane | Required durable / positive lane | RuntimeLike selected lane | 能证明 | 不能证明 |
|---|---|---|---|---|---|
| contract/ref/DTO/digest/state/policy | `ENV-CI-ISO` | none | none | finite schema、legal/illegal state、body-free | store/transport/runtime ready |
| Command/Consumer service/UoW order/fault | `ENV-CI-ISO` | `ENV-CI-INT` for production adapter boundary | none current | flow、rollback model、fake parity；durable atomicity after INT run | fake通过即durable通过 |
| 14 Query no-write | `ENV-CI-ISO` | `ENV-CI-INT` read fence/corruption | optional STG read canary later | exact surface、zero write、committed view | online repair或source truth |
| 9 Consumer mapping/completion | `ENV-CI-ISO` structural | `ENV-CI-INT` transport/commit/ack | STG selected when established | preparse ordering、typed outcome、durable completion | I05 positive或broker SLA |
| 12 Event snapshot/publication | `ENV-CI-ISO` stored-byte contract | `ENV-CI-INT` durable outbox/token/probe | STG selected endpoint later | immutable snapshot、same token、unknown handling | subscriber acceptance/business result |
| 9 Job plan/claim/report/resume | `ENV-CI-ISO` semantic/fault | `ENV-CI-INT` durable claim/restart/history | STG resume rehearsal later | immutable plan、fresh fence、fold/replay | J06 H13 positive或production recoverability |
| external handoff/export | `ENV-CI-ISO` finite outcomes | `ENV-CI-INT` controlled/endpoint capability | STG selected effect later | prepare/call/finalize、same token、manual | Delivered=verdict/signoff |
| config source/profile/assembly | `ENV-CI-ISO` parser/redline/failpoint | `ENV-CI-INT` descriptor/secret/capability | `ENV-STG-RT` forbidden mode + managed binding later | all-or-error、no fallback、mode legality | current staging ready |
| redaction/telemetry/dependency | `ENV-CI-ISO` | `ENV-CI-INT` sink/store output scan | STG scan later if established | no forbidden material、no recursion/non-core edge | sink health=truth |
| performance/capacity/SLO | none current | dedicated workload-bearing INT environment later | RuntimeLike representative environment later | 仅在Step10定义方法/threshold source后可测 | local single sample或旧P95数字 |

I05 positive、J06 positive和真实 external capability不存在可替代lane。Blocked lane在ISO/INT可验证fail-closed，不能
通过换成RuntimeLike、fixture body或手工事件来关闭upstream blocker。

## 8. Formal 配置到测试矩阵

### 8.1 配置域与关键切口

| Config family / exact subject | 影响环境与行为 | 关联数据集 | 关联 TC | 失败 / stop rule |
|---|---|---|---|---|
| `profile` + technical modes | 3 runtime class与clock/ID legality | `CONFIG-PROFILES`,`CONFIG-REDLINE` | `CFG-001~003/006` | implicit/unknown/illegal combination whole candidate reject |
| source `DECL < JSON < ENV` + 61 ENV | effective candidate、invalid winner、identity | `CONFIG-PROFILES`,`CONFIG-REDLINE`,`HISTORY-CORPUS` | `CFG-001/002/006`,`HIST-001/002` | no lower-source/lane fallback |
| `boundary.*` + schema/source allowlist | preparse body/page/query timeout/producer gate | `META(-NEG)`,`CONFIG-REDLINE`,`SENTINEL` | `QRY-002/003`,`EVD-004`,`CFG-002/006` | reject before parse/UoW；timeout zero-write |
| five safety policy refs | redaction/label/correlation/visibility/body-free scanner | `SENTINEL`,`READ-SURFACE`,`SIGNAL`,`EVIDENCE-NEG` | `RED-001~004`,`SIG-002/006`,`EVD-002` | selected policy unresolved fail closed；no bypass |
| four store mode/binding + schema/UoW | owner/projection/idempotency/Job durability | `UOW-*`,`CAS-CURSOR`,`CLAIM-FENCE`,`COMMIT-UNKNOWN` | `UOW-001~008`,`REB-003/004`,`CFG-001/005` | capability mismatch blocks runtime；no InMemory fallback |
| digest/idempotency | same/conflict replay、old readable material、intent retention | `DIGEST`,`IDEMPOTENCY`,`COMMIT-UNKNOWN` | `ING-003/004`,`UOW-003/004`,`NFR-003` | missing/mismatch result fail/manual；old profile retained |
| projection limits/freshness | capture/closure/batch/read freshness | `READ-*`,`JOB-PLAN(-NEG)`,`GAP` | `DEG-001~005`,`REB-001/002`,`CFG-002` | overflow whole plan fail；no false Fresh |
| execution claim/retry/budget | lease/heartbeat/fence/max plan/timeout/retry | `CLAIM-FENCE`,`JOB-*`,`RECOVERY-CLASS` | `REB-002~004`,`UOW-007/008`,`NFR-003` | timeout not abort proof；Unknown no blind retry |
| five external root objects | resolver/publisher/handoff/export/availability modes | `EXTERNAL-*`,`AVAILABILITY`,`SENSITIVE-REF` | `EVD-002~004`,`RPT-003/004`,`EXT-002`,`CFG-005` | exact family/capability/secret failure；no alternate target |
| 12 outbound target catalog | accepted UoW snapshot到historical effect binding | `OUTBOX(-CORRUPT)`,`EXTERNAL-INTENT` | `UOW-006/007`,`DEP-003` | incomplete/duplicate target before exposure；old no reroute |
| report/export target catalogs | handoff/export exact target与phase | `HANDOFF(-NEG)`,`PERIPHERAL`,`EXTERNAL-*` | `RPT-002~004`,`EXT-001/002`,`NW-004` | unavailable isolated；receipt不是verdict |
| 16 Command / 14 Query enabled sets | static API registration与least-authority slice | `META`,`DEPENDENCY-CORPUS`,`ACTIVATION-FAULT` | `DEP-002`,`DIA-004`,`CFG-004` | unknown/duplicate/map gap fail group |
| 9 Consumer catalog | producer/schema/transport/actor totality | `META(-NEG)`,`AVAILABILITY`,`ACTIVATION-FAULT` | `EVD-004`,`DEP-003`,`CFG-004/005` | I05 absent保持disabled；no broad subscription |
| 9 Job enabled/schedule catalogs | registration、dispatch、snapshot，不生成input/actor | `JOB-PLAN(-NEG)`,`ACTIVATION-FAULT` | `REB-002/004/005`,`CFG-004/005` | missing dependency blocks exact job；不伪造Job request |
| 13-stage assembly / activation/history | complete runtime、revoke/join、old snapshot/binding | `ACTIVATION-FAULT`,`JOB-RESUME`,`SENSITIVE-REF` | `CFG-004/005`,`RPT-004`,`UOW-007` | zero partial root；old binding missing manual |

表中短名均展开为 `DS-OBS-*`。配置 family 改变的是测试参数和能力前置，不得改变 protocol/state/UoW/redaction/
truth/no-write 断言。`04` hard range是validator contract，不是Step10性能或验收阈值。

### 8.2 25 个 config failure 到环境处置

| Failure range | Lane验证 | Expected environment behavior | 禁止 |
|---|---|---|---|
| `CFG-FAIL-01~07` source/validation/identity/locator | ISO必测；INT/RT selected locator追加 | whole candidate fail，old lifecycle不变，safe private error | partial candidate、lower source、other locator/fake |
| `CFG-FAIL-08~12` store/adapter/catalog/registrar | ISO structural；INT durable/capability；RT future rehearsal | no runtime exposure；prepare/arm failure revoke/join all | process mutex/InMemory替代、partial active root |
| `CFG-FAIL-13~16` Disabled/unavailable/commit/external unknown | ISO finite outcomes；INT real capability | exact Disabled/Unavailable/Degraded/Unknown；probe/manual | fake/no-op success、ack guess、blind retry/new token |
| `CFG-FAIL-17~23` activation/drain/history/migration/rollback/audit | INT restart/history；RT future managed lane | stop/reconcile/retain old reader or binding；blocked/manual | pointer flip、kill=rollback、current route、date-only retire |
| `CFG-FAIL-24` telemetry recursion | ISO/INT sink failure | suppress bounded recursion；operation outcome unchanged | telemetry drives business retry/truth |
| `CFG-FAIL-25` target reality absent | all current lanes | boundary `not_established/not_run/not_evaluated` | design claims ready/pass |

## 9. Environment 到 82 个 dataset 的承载矩阵

| Dataset group | Primary lane | Additional required lane | 使用方式 | 清理 / 隔离 |
|---|---|---|---|---|
| harness/ref/meta/digest/source-version | `ENV-CI-ISO` | INT仅做wire/transport parity | deterministic value/builders | value drop + namespace reset |
| intake/correlation/signal/audit/evidence | `ENV-CI-ISO` | `ENV-CI-INT` accepted durable UoW | owner builders + formal resolver outcome | transaction rollback/verified namespace delete |
| read/diagnostic/handoff/retention/gap | `ENV-CI-ISO` | INT read fence/corruption/restart | committed facet + policy fake + durable seed | read/owner namespace cleanup |
| UoW/failpoint/idempotency/CAS/cursor | `ENV-CI-ISO` semantic | `ENV-CI-INT` mandatory for durable boundary | shared conformance + one-stage fault/ambiguity | rollback/probe/verified cleanup |
| outbox/corruption/recovery/write spies | `ENV-CI-ISO` | INT durable snapshot/publisher/probe | stored bytes + adapter-level corruption + least-authority spies | mandatory corrupt delete + fake reset |
| Job plan/item/claim/report/resume | `ENV-CI-ISO` semantic/fault | `ENV-CI-INT` mandatory for claim/restart/history | immutable plan + fenced item + report fold | join workers；execution/claim/report cleanup |
| external intent/outcome/J06/peripheral | `ENV-CI-ISO` finite controlled | INT controlled/endpoint capability；STG selected later | prepare/call/finalize + same token/probe/manual | intent retained through assertion then cleanup |
| config profiles/redline/activation/availability | `ENV-CI-ISO` all combinations | INT descriptor/secret；STG RuntimeLike later | strict candidate + failpoint/registrar/capability fake | teardown/revoke/join/private handle zero |
| sensitive/sentinel/schema/dependency/history/truth/evidence-design | `ENV-CI-ISO` | INT/RT output scan only when established | synthetic isolated corpus + read-only content digest | sentinel delete；source corpus read-only |
| 28 state datasets | `ENV-CI-ISO` | INT owner persistence/CAS subsets | formal factory/member sequence | value/owner namespace cleanup |

RuntimeLike selected-run不得直接复用 `DS-OBS-SENTINEL-001` 的synthetic credential/body为真实provider material。可复用的
是schema、assertion与de-identified body-free canary contract，不是fixture secret或fake handle。

## 10. 环境不可用与跨 lane fallback

| 环境 / 依赖不可用场景 | Current disposition | 是否可计对应 TC pass | Evidence / truth rule |
|---|---|---|---|
| target repo或test binary不存在 | Step09/`07` producer boundary blocked；不执行 | 否 | 只能记design precondition absent |
| `core-contracts` path不可用/不兼容 | compile gate fail | 否 | 不复制shadow contract |
| `ENV-LCL-ISO` candidate/fake binding缺失 | local assembly fail-fast | 否 | 不用hard-coded object绕过loader |
| `ENV-CI-ISO` pipeline/config/fixture缺失 | suite not runnable / infra defect | 否 | 不生成empty artifact或static pass |
| expected fake unavailable/degraded case | exact typed outcome与zero-forbidden-effect断言成立 | 仅该negative TC可通过 | unavailable不是环境整体成功 |
| `ENV-LCL/CI-INT` durable store/schema/UoW能力不足 | original INT lane blocked/fail | 否 | 不切ISO/InMemory/Fake记pass |
| controlled/endpoint selected binding或secret解析失败 | `SensitiveReferenceUnavailable` / construction fail | 否 | 不切其他target/credential/lane |
| post-assembly runtime dependency unavailable | exact Unavailable/Degraded/Blocked | 仅预期failure-mapping TC可通过 | 不升级Accepted/Delivered/Fresh |
| commit outcome unknown | read-only probe；仍unknown则manual | 仅unknown handling TC可通过 | 不ack success或same-input blind retry |
| external outcome unknown/unsupported | retain intent/token/material；probe/manual | 仅phase/recovery TC可通过 | 不换token/binding/material |
| historical binding缺失 | stop before call；manual/unavailable | 仅missing-history negative TC可通过 | 不读current route/config |
| I05 schema/binding缺失 | exact slot disabled/preparse stop | `EVD-004/CFG-005` negative可通过 | positive I05不能通过 |
| J06 H13缺失 | controlled Blocked/manual | `REB-005` negative可通过 | positive/Completed不能通过 |
| `ENV-STG-RT` instance unavailable | selected-run `not_evaluated` | 不计当前P0 pass | 记录residual/precondition，不伪执行 |
| `ENV-PRD-RT` unavailable | operations precondition absent | 不适用当前测试 | 不以production health或缺席推acceptance |
| cleanup/teardown失败 | suite/environment contaminated；阻断后续可信执行 | 否 | 保留safe namespace诊断并执行授权清理 |

## 11. 环境 / 配置停审记录

### 11.1 六 lane 停审

| Lane | 用途可定位 | Profile/mode合法 | Dependency/secret前置 | 数据与清理 | 真实性状态 | 结论 |
|---|---|---|---|---|---|---|
| `ENV-LCL-ISO` | yes；本地isolated/manual | LocalTest合法组合明确 | no required network；Fake无credential | Step07 subset + namespace reset | `not_established/not_run` | pass_design_location |
| `ENV-LCL-INT` | yes；本地durable/restart | IntegrationLike严格组合 | durable/nonprod selected material required | persistence/Job/external + verified cleanup | `not_established/not_run` | pass_design_location_with_precondition |
| `ENV-CI-ISO` | yes；blocking semantic baseline | LocalTest/InMemory/Fake/Controlled | CI-safe only；prod credential VETO | 82 dataset semantic coverage + teardown | pipeline absent / not_run | pass_planned_location |
| `ENV-CI-INT` | yes；blocking durable/capability | IntegrationLike/Durable | schema/UoW/restart/secret/capability required | durable subset + restart cleanup | service absent / not_run | pass_planned_location_with_precondition |
| `ENV-STG-RT` | yes；future release rehearsal | RuntimeLike Endpoint/Disabled | managed store/secret/transport required | selected de-identified canary later | instance absent / not_evaluated | pass_contract_only |
| `ENV-PRD-RT` | yes；operations semantics only | RuntimeLike Endpoint/Disabled | production ownership/runbook required | no ordinary synthetic fixture | instance absent / not_evaluated | pass_contract_only |

### 11.2 配置和依赖停审

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| lane/profile/mode分层 | pass | 只有3个formal runtime class；未恢复旧profile或新增replay class |
| 配置可定位 | pass | current `04` canonical root、61 ENV、strict source和23域可回指 |
| compile dependency | pass | 仅`core-contracts`；实际manifest present但target compile未运行 |
| runtime/event/handoff dependency | pass | 每项均有formal fixture/controlled/endpoint/ref/query/handoff seam |
| sibling source dependency | pass | none；repo存在不授权Cargo edge |
| P0 isolated environment | pass_design | local/CI lane可定位；pipeline/instance仍absent |
| P0 durable environment | pass_design_with_precondition | INT lane前置完整；store/service未选且not_run |
| RuntimeLike environment | pass_contract_only | forbidden组合和managed前置明确；实例未建立 |
| config failure handling | pass | 25 failure分组映射，无silent/cross-lane fallback |
| dataset mapping | pass | 82 dataset按9组映射lane，清理策略承接Step07 |
| external fake fidelity | pass | same port/outcome/token/probe；fake不证明endpoint能力 |
| I05/J06 | pass_with_blocker_open | negative lane可定位；positive lane不存在且不伪造 |
| environment evidence | pass | lane ID不是run/evidence；未创建artifact/report/result |

## 12. 跨环境 / 配置审计

| 审计项 | 结论 | 约束 / 修正 |
|---|---|---|
| standard local/CI/test/integration/staging是否都有解释 | pass | test/replay是用途；local/CI各ISO/INT；staging映射RuntimeLike |
| prod是否被误当测试profile | no | 只保留operations contract与precondition |
| environment是否推断runtime class | no | explicit `profile` required；lane/host/branch不参与 |
| environment是否改变schema/source priority | no | 所有lane共享root与DECL<JSON<ENV |
| LocalTest是否被写成durability证明 | no | Durable仅conformance variant；restart/capability仍需INT |
| IntegrationLike失败是否fallback ISO/Fake | no | original lane fail/blocked；证据不跨lane替代 |
| RuntimeLike是否允许fixture/Fake/Controlled | no | candidate reject/VETO |
| Disabled是否绕过required dependency | no | 只允许formal optional exact surface |
| selected secret失败是否fallback | no | whole candidate/adapter construction fail |
| environment是否关闭redaction/no-write/UoW/fence/token | no | 不存在该配置面；任意出现即VETO |
| Query是否因环境允许write/repair | no | 14/14 all lanes strict no-write |
| replay/resume是否读current config | no | exact stored plan/snapshot/binding/token only |
| external health是否升级truth | no | availability是runtime observation，不是Accepted/Delivered/Fresh |
| non-core compile edge | none | dependency corpus负责future gate |
| dataset是否带真实secret/body | none | synthetic sentinel隔离；RT lane禁止其作为provider material |
| environment不可用是否可伪pass | no | 只有预期typed failure TC可通过，lane整体仍not ready |
| staging/prod instance是否已建立 | no | explicitly `not_established/not_evaluated` |
| pipeline/test是否已运行 | no | target/pipeline/scripts不存在；仅planned design |
| unresolved environment design conflict | none | instance/product/capability缺失均有唯一后续owner，不破坏Step08设计闭口 |

## 13. 对上游与下游的影响判定

| 结论 | 上游影响 | Current 处置 | 下游 owner |
|---|---|---|---|
| 6 lane继续映射existing 3 profile | 无 | 不新增enum/field/source | Step09 suite placement |
| `core-contracts` path present | 无 | 不修改Cargo；target reality后再核验compatibility | `07` bootstrap/compile boundary |
| target repo/CI/environment absent | 无上游设计blocker，但阻塞真实执行 | 保持not_established/not_run；不创建假artifact | Step09 planned producer + `07` implementation |
| durable product/schema/capability未选 | 无当前上游变更 | fake验证logical contract；INT boundary未证明即blocked | `07` store/capability spike |
| I05/J06 positive lane缺失 | inherited blocker | 只保留negative controlled environment | upstream owners + `06/07` |
| exact suite/gate/script/path未固定 | 无 | 本Step只固定environment contract | Step09 |
| workload/SLO environment未定义 | 无 | current保持not_evaluated，不沿用旧P95/throughput | Step10 + `06/07` |

## 14. 正式 `05` §8 回填草稿

正式正文应按下列顺序装配本 Step 的 current 结论：

1. environment word、6条document lane、3个runtime class和formal mode的四层分离。
2. 6条lane的用途、依赖类型、协作方式、关键配置、数据策略、真实性状态与风险。
3. 环境拓扑和逐依赖对象的compile/runtime/event/handoff判定；只允许`core-contracts` compile edge。
4. 测试主题到ISO/INT/RuntimeLike lane，以及config family/failure/dataset到环境的映射。
5. unavailable、unknown、historical binding、I05/J06和cross-lane fallback规则。
6. lane停审与跨环境审计；明确contract defined不等于instance ready或test passed。

正式正文不得恢复 `local-dev/ci-test/operations-replay` 作为profile，不得声称target repo、pipeline、durable store、
endpoint、staging/prod、artifact、run、evidence或测试结果已建立。

## 15. 待确认事项

| 事项 | Current 决定 | 最迟 owner |
|---|---|---|
| target repo/workspace/test binary | absent；真实测试不可执行 | `07` bootstrap boundary |
| CI provider/job/container/service topology | 不在Step08发明；只定义lane prerequisite | Step09 planned gate + `07` CI boundary |
| durable store/schema/migration/cleanup command | product未选；logical conformance + verified namespace rule | `07` store spike/boundary |
| transport/broker/ack/DLQ/endpoint | current只用formal controlled seam；真实能力未评估 | `07` transport/Consumer boundary |
| secret provider/credential/topology | ordinary config只持locator；实例和权限未建立 | `07` sensitive/RuntimeLike boundary |
| staging/prod workload和selected-run | current not_evaluated | Step10/`06/07` |
| I05 canonical payload/producer binding | open_upstream_internal；无positive environment | L1-artifact + `07` |
| J06 H13 owner | open_controlled；无positive environment | H13 owner + `06/07` |
| suite/gate/script/artifact/report path | 本Step不固定 | Step09/13 + `07` |

## 16. 进入下一步条件

- [x] local/CI/test/integration/staging/prod均有current解释，未创造第四个runtime class。
- [x] 6条lane均有用途、依赖、协作方式、配置、数据、风险与真实性状态。
- [x] compile/runtime/event/handoff依赖逐项判定；仅`core-contracts`允许path/package dependency。
- [x] 99 TC / 16切口的主要测试主题已映射ISO/INT/RuntimeLike证明层级。
- [x] 82 dataset已按环境分组，隔离与清理继续承接Step07。
- [x] formal配置主轴与25个failure已映射环境处置，无cross-lane silent fallback。
- [x] P0自动化和人工环境在设计上可定位；实际instance/pipeline/test明确为not established/not run。
- [x] I05/J06及其余affected未被fake/环境选择伪关闭。
- [x] 未修改正式`05`，未实现代码/环境/CI，未创建真实run/artifact/report/evidence/result/verdict/signoff/commit。

Step 08 gate 为 `pass_current_design_location_with_inherited_affected_open`。下一允许动作是读取测试方案 SOP Step09、
书写规范§5.9、current Step03~08、planned script contract与`04` environment/config，重建自动化和CI/CD门禁。

## 17. 参考

- `standards/document/测试方案讨论流程_SOP.md` Step 08
- `standards/document/测试方案书写规范.md` §5.8
- `standards/document/全局项目依赖关系与裁剪规则.md`
- `projects/L4-observability/01-架构设计.md` §8
- `projects/L4-observability/03-详细设计.md` §5~§15
- `projects/L4-observability/04-配置设计.md` §5~§14
- `projects/L4-observability/design-calibration/04_config_step_06_environment_profiles_matrix.md`
- `projects/L4-observability/design-calibration/04_config_step_12_downstream_handoff.md`
- `projects/L4-observability/design-calibration/05_test_plan_step_04_strategy_layers.md`
- `projects/L4-observability/design-calibration/05_test_plan_step_06_cases.md`
- `projects/L4-observability/design-calibration/05_test_plan_step_07_test_data.md`
- `projects/L1-governance/design-calibration/05_test_plan_step_08_environment_config.md`
- `projects/L1-artifact/design-calibration/05_test_plan_step_08_environment_config.md`
