# L4-observability 07-实施计划 Step 06：阶段任务、代码批次与提交边界

> 对应 SOP：`standards/document/实施计划讨论流程_SOP.md` Step 6
> 对应书写规范：`standards/document/实施计划书写规范.md` §5.6
> 依赖标准：`standards/document/设计真相源闭环与可落码性标准.md` §九、`standards/document/代码实施台账与门禁规范.md`
> 文档性质：设计讨论中间产物。所有 boundary 在本 Step 仅为 planned design；不授权实现，不产生 commit/hash/run/artifact/report/evidence/verdict/signoff。

## 1. Step 状态

| 项 | 当前值 |
|---|---|
| project | `L4-observability` |
| document | `07-实施计划` |
| step | `Step 06 / 阶段任务拆分、编写顺序与提交边界` |
| mode | `full-restart` |
| status | `completed_current_step_06` |
| current module | `task-batch-boundary-and-experience-review` |
| upstream | current Step 01~05；current formal `03/04/05/06` |
| planned boundary count | `16`：`commit-01-a` ~ `commit-08-b` |
| current boundary | 设计阶段无 implementation current boundary；Step 13 才初始化 `commit-01-a` |
| design gate | `pass_with_affected_open` |
| implementation handoff | `blocked_until_current_07_completion_and_boundary_audit` |
| new upstream blocker | `none` |
| inherited affected | 12 项逐 boundary 绑定；不以本 Step 关闭 |
| next allowed action | `continue_to_step_07` |
| current commit | 不需要；用户未要求提交 |

## 2. Step 内计划与执行记录

| 计划项 | 产物 | 状态 | 完成门禁 |
|---|---|---|---|
| 读取 Step 05 phase 和 current 03/05/06 实现输入 | boundary 输入基线 | done | phase、protocol、state、test、acceptance 入口可定位 |
| 选择 boundary 粒度 | 粒度判断 | done | 每个 boundary 可一句话描述、独立 review/verify/rollback |
| 定义每个 boundary 的任务和代码批次 | task/batch matrix | done | 高风险逻辑不与无关功能混批，单批超过 300 行需拆分 |
| 定义 allowed/forbidden scope 与实施台账字段 | boundary gate matrix | done | 16 个 planned boundary 均有 ledger path、checks、Commit/Handoff Gate |
| 逐 boundary 设计闭环与经验复核 | closure/review register | done | 适用项有来源和结论；affected 只保留 blocker/controlled |
| 跨 boundary 审计、回填草稿、自检 | cross-boundary audit | done | 无越界、孤儿 protocol、重复提交或证据错配 |

## 3. 通用编写顺序与代码批次规则

每个 boundary 遵循以下顺序；若某层不属于该 boundary，必须在 boundary 记录中写明 `not_applicable`，不得由实现者自由跳层：

```text
public contract / owner / fixture
  -> domain object / state / policy
  -> application input / port / UoW / idempotency
  -> service flow / repository or controlled adapter
  -> API / worker / jobs entry mapping
  -> targeted test and static check
  -> boundary ledger gate review
```

代码批次规则：

1. 普通批次目标为约 100~300 行；预计超过 300 行必须拆分，超过 500 行禁止作为单批。
2. UoW 顺序、commit-unknown、幂等、redaction、Query zero-write、outbox snapshot、claim/fence、external phase 和 evidence provenance 必须独立批次或有独立可复核任务。
3. 测试与实现同一可验证增量提交；不得把所有测试留到 PH-08。
4. `planned` boundary 可以列出 future output，但不允许把 gate 标为 `pass`。
5. 每个 boundary 的 implementation ledger 预期路径为 `design-calibration/implementation-boundaries/<boundary_id>.md`；Step 13 才创建 current skeleton。

## 4. Boundary 总矩阵

| boundary | phase | 一句话可验证增量 | 主要协议/对象 | 预计批次 | 关键门禁 |
|---|---|---|---|---:|---|
| `commit-01-a` | PH-01 | 建立目标仓 workspace、七 crate manifest 和 only-core dependency 形状 | workspace、Cargo、crate/file owner | 3 | target/worktree、Cargo metadata、dependency/static |
| `commit-01-b` | PH-01 | 建立 strict config profile shell、script roots 和 run/report path contract | config、5 scripts、artifact/report roots | 3 | config parse、path/CLI dry-run、no-latest |
| `commit-02-a` | PH-02 | 闭合 contracts public refs、metadata、DTO、protocol wrapper 和 error surface | 16 C、14 Q、9 I、12 E、9 J public carriers | 4 | contract compile/test、owner scan、wire/body-free |
| `commit-02-b` | PH-02 | 闭合 domain state/policy/history/guard carrier 和 technical state | 27+1 state、domain records/policies | 4 | state matrix、factory、error/persistence field closure |
| `commit-03-a` | PH-03 | 打通 intake/redaction/correlation/safe signal application accepted flow | C01~C04、I01、I03、receipt/safety/correlation/signal | 4 | UoW/idempotency/redaction/correlation |
| `commit-03-b` | PH-03 | 打通 API/worker intake entry 与 Consumer completion 的 controlled surface | I01~I03、C01~C04 entry、ack/retry/dead-letter | 4 | pre-parse、completion、write spy、I05 controlled |
| `commit-04-a` | PH-04 | 闭合 audit/evidence/gap domain、append-only record 和 committed storage | C05/C06/C13/C14、E04/E05/E08/E09 | 4 | append order、digest/visibility/gap、body-free |
| `commit-04-b` | PH-04 | 打通 audit/evidence/query read surface 与 immutable event snapshot | Q05/Q06、E04/E05/E08/E09 | 3 | query read carrier、provenance、no-write |
| `commit-05-a` | PH-05 | 闭合 safe log/metric/trace projection、rollup、marker 和 derived event | C04、E03/E10/E11/E12、signal/read model domain | 4 | low-cardinality、freshness source、projection rebuild source |
| `commit-05-b` | PH-05 | 打通 14 Query、diagnostic/read model 和 strict zero-write mapping | Q01~Q14、read/diagnostic/peripheral views | 4 | all query no-write、visibility/absence/degraded |
| `commit-06-a` | PH-06 | 闭合 report handoff、evidence-index input、authenticity、retention/protection contracts | C07~C10、C15~C16、E06/E07、handoff/retention | 4 | immutable input、no verdict、hold/protection |
| `commit-06-b` | PH-06 | 打通 9 Job 的 plan/claim/fence/item/report/replay 与 rebuild/no-write | J01~J09、E11/E12、maintenance | 5 | UoW/recovery/commit unknown/J06 controlled |
| `commit-07-a` | PH-07 | 完成 strict runtime builder、profile activation 和 API/worker/jobs assignment | config/runtime、entry slices、registrars | 4 | complete-or-error、least authority、profile legality |
| `commit-07-b` | PH-07 | 完成 redaction/metric/dependency/report static gate orchestration | 5 scripts/checks、telemetry hooks | 3 | static denylist、same-run, nonzero |
| `commit-08-a` | PH-08 | 接通 9 primary suites、run-scoped raw artifact 和 report generator | 99 TC/82 DS/9 suites/6 lanes | 4 | same-run provenance、artifact completeness |
| `commit-08-b` | PH-08 | 生成 acceptance/review handoff、VETO/risk/open-issues shell | `reports/acceptance`/`reports/review` | 3 | no static pass、review required、three-value decision |

## 5. Boundary 详细任务、批次与范围

### 5.1 `commit-01-a`：workspace 与依赖骨架

| 任务 | 顺序 | 实施动作 | 输出 | 完成判定 |
|---|---:|---|---|---|
| `IMPL-01A-01` | 1 | 确认/创建目标仓并记录 dirty baseline | target repo reality record | 目标仓路径、用户改动、git identity 检查可复查 |
| `IMPL-01A-02` | 2 | 建立 workspace、7 个 member、package/crate/binary 命名 | Cargo manifests、crate lib/main skeleton | metadata 与 `03` §4 一致 |
| `IMPL-01A-03` | 3 | 接入唯一 `core-contracts` path candidate 并执行依赖扫描 | lock/metadata snapshot | 除 core 外无 sibling compile edge |
| batch | 目标 | 预计规模 | 验证/提交 |
|---|---|---|---|
| `BATCH-01A-01` | target/worktree/git reality record | <=100 lines | worktree gate，归入 boundary |
| `BATCH-01A-02` | workspace/Cargo skeleton | 100~250 lines | fmt/check/metadata，归入 boundary |
| `BATCH-01A-03` | dependency/static baseline | <=150 lines | dependency check，归入 boundary |

Allowed scope：目标仓根 manifest、`crates/{contracts,domain,application,infra,api,worker,jobs}/` skeleton、必要 Cargo metadata。
Forbidden scope：业务 DTO、domain state implementation、service/repository、config values、scripts、reports、source truth。

### 5.2 `commit-01-b`：配置与报告路径骨架

| 任务 | 顺序 | 实施动作 | 输出 | 完成判定 |
|---|---:|---|---|---|
| `IMPL-01B-01` | 1 | 建立 typed root/profile parser shell | config module/fixtures | unknown/type/range/mode mismatch fail closed |
| `IMPL-01B-02` | 2 | 建立 gate/report/check script entry shell | 5 planned scripts | 参数和 nonzero contract 可 dry-run |
| `IMPL-01B-03` | 3 | 建立 canonical raw/report/acceptance/review path guard | path validator | 禁止 `latest`、project nested root、跨 run join |
| batch | 目标 | 预计规模 | 验证/提交 |
|---|---|---|---|
| `BATCH-01B-01` | profile/schema/parser shell | 100~250 lines | config redline |
| `BATCH-01B-02` | script CLI/path shell | 100~250 lines | help/dry-run/path checks |
| `BATCH-01B-03` | failure/provenance shell tests | <=200 lines | same-run/no-latest checks |

Allowed scope：`crates/infra/src/config.rs`、runtime-independent config fixtures、`scripts/{gates,reports,checks}/` shell、planned root validation。
Forbidden scope：真实 provider/DB/bus、业务 config fallback、验收 report、真实 run/evidence。

### 5.3 `commit-02-a`：public contracts 与 protocol carrier

| 任务 | 顺序 | 实施动作 | 输出 | 完成判定 |
|---|---:|---|---|---|
| `IMPL-02A-01` | 1 | 闭合 refs/metadata/digest/cursor/visibility/freshness/error owner | typed contracts | 每个 required ref 有唯一 owner/kind/rehydrate |
| `IMPL-02A-02` | 2 | 实现 16 Command 与 14 Query request/result/view/page wrapper | public DTO | request 可 lossless 构造，optional/absence 语义明确 |
| `IMPL-02A-03` | 3 | 实现 9 Consumer、12 Event、9 Job envelope/payload/report wrapper | protocol carriers | schema/version/source/binding 字段不重复、不含 body |
| `IMPL-02A-04` | 4 | 建立 contract fixtures/static owner scan | contract tests | 60 exact protocol 无 orphan/duplicate secondary type |
| batch | 目标 | 预计规模 | 验证/提交 |
|---|---|---|---|
| `BATCH-02A-01` | refs/metadata/error | 100~300 lines，必要时按 refs/error 拆分 | contract unit |
| `BATCH-02A-02` | Command/Query carriers | 需拆分为 command 与 query 两批 | protocol tests |
| `BATCH-02A-03` | Consumer/Event/Job carriers | 需拆分为三协议族批次 | protocol tests/static map |
| `BATCH-02A-04` | body-free/owner/serialization checks | <=250 lines | redaction/owner checks |

Allowed scope：`crates/contracts/src/**` 及 contracts tests/fixtures。
Forbidden scope：domain transition、application port/service、repository、entry handler、任何相邻仓 type shadow copy。

### 5.4 `commit-02-b`：domain state 与 policy carrier

| 任务 | 顺序 | 实施动作 | 输出 | 完成判定 |
|---|---:|---|---|---|
| `IMPL-02B-01` | 1 | 实现 receipt/safety/correlation/signal/audit/evidence domain objects | domain truth-side objects | factory required fields 与 safety/body-free invariant 闭合 |
| `IMPL-02B-02` | 2 | 实现 handoff/retention/protection/gap/degraded/read/reference objects | guard/read objects | state owner 与 condition fields 可持久化/读取 |
| `IMPL-02B-03` | 3 | 实现 maintenance/job/report/outbox/idempotency technical carriers | technical objects | technical state 不升级为业务 truth |
| `IMPL-02B-04` | 4 | 实现 policy/error/history record helpers | domain tests | legal/illegal/terminal/reserved transition 与 error mapping 对齐 |
| batch | 目标 | 预计规模 | 验证/提交 |
|---|---|---|---|
| `BATCH-02B-01` | observation/safety objects | 需拆分 intake 与 signal | state/factory tests |
| `BATCH-02B-02` | audit/handoff/retention/read objects | 需拆分 audit 与 guard/read | state/policy tests |
| `BATCH-02B-03` | job/technical objects | 100~300 lines | technical state tests |
| `BATCH-02B-04` | transition/error/history closure | 高风险独立批次 | state matrix/error tests |

Allowed scope：`crates/domain/src/**`、domain unit tests。
Forbidden scope：concrete infra、source truth adapter、API/worker/jobs route、跨 crate second state owner。

### 5.5 `commit-03-a`：intake/redaction/correlation application flow

| 任务 | 顺序 | 实施动作 | 输出 | 完成判定 |
|---|---:|---|---|---|
| `IMPL-03A-01` | 1 | 闭合 intake input assembly、redaction port、operation context/digest | application inputs/ports | source/purpose/actor/idempotency/digest 来源唯一 |
| `IMPL-03A-02` | 2 | 实现 C01~C04 accepted/reject/quarantine/delayed flow | service façade slice | accepted write set、history/result/outbox 顺序固定 |
| `IMPL-03A-03` | 3 | 实现 duplicate/conflict/in-flight/commit-unknown probe | idempotency/UoW path | 不二写、不换 key、不重算 result |
| `IMPL-03A-04` | 4 | 绑定 TC/AC/redaction/telemetry assertions | service tests | safe signal 不含 raw body、telemetry 不反写 truth |
| batch | 目标 | 预计规模 | 验证/提交 |
|---|---|---|---|
| `BATCH-03A-01` | input/port/context/digest | 高风险，单独批次 | design closure + contract/service compile |
| `BATCH-03A-02` | accepted UoW/service | 需按 intake 与 signal 拆分 | flow/UoW tests |
| `BATCH-03A-03` | idempotency/unknown/recovery | 高风险独立批次 | UoW/idempotency suite |
| `BATCH-03A-04` | redaction/telemetry assertions | <=250 lines | telemetry safety tests |

Allowed scope：`crates/application/src/{inputs,ports,unit_of_work,idempotency,digest,*intake*,*signal*,errors}.rs` 及相关 domain/contract tests。
Forbidden scope：API route、worker ack、I05 positive decode、external provider、source truth write。

### 5.6 `commit-03-b`：intake entry 与 Consumer completion

| 任务 | 顺序 | 实施动作 | 输出 | 完成判定 |
|---|---:|---|---|---|
| `IMPL-03B-01` | 1 | API Command metadata/request mapping | API intake handlers | route 不推断 source/actor/operation |
| `IMPL-03B-02` | 2 | I01~I03 envelope pre-parse/schema/producer map | worker consumer surface | validation 顺序和 fail-closed 完整 |
| `IMPL-03B-03` | 3 | ack-after-commit、duplicate、unknown completion 和 dead-letter mapping | worker completion adapter | commit unknown 无默认 ack/retry |
| `IMPL-03B-04` | 4 | I05 disabled/controlled slot fixture | controlled negative path | 未闭合 owner 时不 parse/ack/write |
| batch | 目标 | 预计规模 | 验证/提交 |
|---|---|---|---|
| `BATCH-03B-01` | API request/response mapping | <=250 lines | entry capability tests |
| `BATCH-03B-02` | Consumer validation/producer static map | 需按 envelope 与 operation 拆分 | consumer tests |
| `BATCH-03B-03` | completion/ack/retry/dead-letter | 高风险独立批次 | commit-unknown/recovery tests |
| `BATCH-03B-04` | I05 controlled/disabled | <=150 lines | affected negative lane |

Allowed scope：`crates/api/src/{command_handlers,routes,errors}.rs`、`crates/worker/src/consumers.rs` 及 exact tests。
Forbidden scope：I05 positive schema/producer invention、direct repository/UoW in worker、source write、Job runner。

### 5.7 `commit-04-a`：audit/evidence/gap committed storage

| 任务 | 顺序 | 实施动作 | 输出 | 完成判定 |
|---|---:|---|---|---|
| `IMPL-04A-01` | 1 | audit/evidence/gap input/source resolver closure | typed source map | owner/digest/purpose/visibility/gap source 可追溯 |
| `IMPL-04A-02` | 2 | append-only domain records and repository/UoW staging | storage ports/fake | accepted record 与 projection 同一 commit boundary |
| `IMPL-04A-03` | 3 | C05/C06/C13/C14 service flow and events E04/E05/E08/E09 | application slice | body-free, no source truth write, exact effect set |
| `IMPL-04A-04` | 4 | hash/cursor/revision/conflict/recovery tests | audit suite | cursor/source version 不由 time/row id 猜测 |
| batch | 目标 | 预计规模 | 验证/提交 |
|---|---|---|---|
| `BATCH-04A-01` | source/visibility/gap carriers | <=250 lines | design closure |
| `BATCH-04A-02` | append record/repository/UoW | 高风险，独立批次 | persistence/UoW tests |
| `BATCH-04A-03` | audit/evidence service/event snapshot | 需拆分 service 与 event | audit/evidence tests |
| `BATCH-04A-04` | hash/cursor/recovery | <=250 lines | consistency/recovery tests |

Allowed scope：domain audit/evidence/gap files、application audit/evidence service/ports、infra owned observation/audit stores、E04/E05/E08/E09 snapshot tests。
Forbidden scope：evidence body、external audit truth、final verdict、query repair、retention cleanup。

### 5.8 `commit-04-b`：audit/evidence read surface

| 任务 | 顺序 | 实施动作 | 输出 | 完成判定 |
|---|---:|---|---|---|
| `IMPL-04B-01` | 1 | Q05/Q06 request/view/page/read carrier | query contracts/use site | same committed boundary、visibility and absence totality |
| `IMPL-04B-02` | 2 | query repository/read fence and response mapper | query façade | Query 不保存、刷新、rebuild 或写 audit |
| `IMPL-04B-03` | 3 | E04/E05 snapshot publication mapping | stored event output | event payload only from committed snapshot |
| batch | 目标 | 预计规模 | 验证/提交 |
|---|---|---|---|
| `BATCH-04B-01` | Q05/Q06 read DTO/carrier | <=250 lines | query contract tests |
| `BATCH-04B-02` | read fence/visibility/mapper | 高风险独立批次 | query no-write/read consistency |
| `BATCH-04B-03` | event snapshot/read provenance | <=200 lines | event/provenance checks |

Allowed scope：`crates/contracts/src/{queries,views}.rs` 的 audit/evidence surface、application read façade/ports、API query mapping、event snapshot tests。
Forbidden scope：new public query family、read-triggered repair、source body、acceptance verdict。

### 5.9 `commit-05-a`：signal projection 与 derived event

| 任务 | 顺序 | 实施动作 | 输出 | 完成判定 |
|---|---:|---|---|---|
| `IMPL-05A-01` | 1 | safe log/metric/trace schema、label allowlist、trace propagation | contracts/domain telemetry carriers | schema/low-cardinality/redaction 规则闭合 |
| `IMPL-05A-02` | 2 | signal projection/rollup/read-model marker | projection stores/domain policy | Fresh 只有完整 committed source/fence |
| `IMPL-05A-03` | 3 | E03/E10/E11/E12 derived snapshot builders | event/outbox payload source | 不从 current truth 重建 payload |
| `IMPL-05A-04` | 4 | recursion/sink failure/retention separation tests | telemetry suite | sink failure 不改变 owner truth |
| batch | 目标 | 预计规模 | 验证/提交 |
|---|---|---|---|
| `BATCH-05A-01` | telemetry schema/allowlist | <=250 lines | metric/redaction static tests |
| `BATCH-05A-02` | projection/rollup/marker | 高风险独立批次 | projection tests |
| `BATCH-05A-03` | event snapshot builder | <=250 lines | snapshot/digest tests |
| `BATCH-05A-04` | recursion/sink/retention guard | <=200 lines | fault/no-write tests |

Allowed scope：domain signal/projection/telemetry files、infra telemetry recorder/projection stores、E03/E10/E11/E12 source snapshot。
Forbidden scope：raw signal body、high-cardinality labels、telemetry-to-command loop、backend retention policy、business execution truth。

### 5.10 `commit-05-b`：14 Query 与 diagnostic zero-write

| 任务 | 顺序 | 实施动作 | 输出 | 完成判定 |
|---|---:|---|---|---|
| `IMPL-05B-01` | 1 | Q01~Q14 selector/request source map and view carrier | query input/response | all variants/absence/page cardinality explicit |
| `IMPL-05B-02` | 2 | composite read bundles/read fence/visibility/freshness mapper | query façade | same-snapshot read proof，failure totality |
| `IMPL-05B-03` | 3 | diagnostic/read-model/peripheral assembler | API query surface | no writer/UoW/reservation/refresh/rebuild |
| `IMPL-05B-04` | 4 | exhaustive write spies and stale/degraded/unknown tests | query suite | 14/14 zero-write and no fallback |
| batch | 目标 | 预计规模 | 验证/提交 |
|---|---|---|---|
| `BATCH-05B-01` | selector/response schemas | 需按 point/page 分批 | query contract tests |
| `BATCH-05B-02` | read bundles/visibility/freshness | 高风险，独立批次 | read fence/no-write |
| `BATCH-05B-03` | API mapper/diagnostic | <=300 lines | entry/query tests |
| `BATCH-05B-04` | exhaustive negative and write-spy corpus | <=250 lines | `TC-OBS-NW-001`/degraded tests |

Allowed scope：all Query contract/use/read application modules、API query handlers、read-only infra stores/fakes、query tests。
Forbidden scope：any save/append/mark stale/refresh/rebuild/reserve call; hidden-to-missing conversion; page fallback.

### 5.11 `commit-06-a`：handoff、retention 与 protection contracts/services

| 任务 | 顺序 | 实施动作 | 输出 | 完成判定 |
|---|---:|---|---|---|
| `IMPL-06A-01` | 1 | EvidenceIndexInput、handoff、authenticity、retention/protection public carrier | contracts/views | immutable input and body-free origin fields |
| `IMPL-06A-02` | 2 | C07~C10/C15~C16 domain/service flow | handoff/guard façade | readiness/visibility/gap/hold semantics exact |
| `IMPL-06A-03` | 3 | E06/E07 snapshot and marker lifecycle | event source | Delivered/Released not verdict/cleanup |
| `IMPL-06A-04` | 4 | report/retention/no-delete tests | targeted suite | active reference conflict and redaction closed |
| batch | 目标 | 预计规模 | 验证/提交 |
|---|---|---|---|
| `BATCH-06A-01` | handoff/evidence/authenticity carriers | 100~300 lines | contract tests |
| `BATCH-06A-02` | retention/protection carrier/policy | <=250 lines | state/policy tests |
| `BATCH-06A-03` | service/event lifecycle | 需拆分 handoff 与 retention | service/UoW tests |
| `BATCH-06A-04` | no-verdict/no-delete evidence assertions | <=200 lines | report/retention tests |

Allowed scope：handoff/evidence index/authenticity/retention/protection contracts/domain/application and E06/E07 source.
Forbidden scope：real evidence alias、final acceptance verdict、source cleanup、external delivery call、J06 implementation。

### 5.12 `commit-06-b`：Jobs、rebuild/replay 与 recovery

| 任务 | 顺序 | 实施动作 | 输出 | 完成判定 |
|---|---:|---|---|---|
| `IMPL-06B-01` | 1 | J01~J09 immutable plan/input digest/report/ref carrier | job contracts/application input | exact target/config snapshot/report owner |
| `IMPL-06B-02` | 2 | claim/fence/item UoW and report fold | job technical stores/services | stale fence, duplicate terminal replay and partial outcomes exact |
| `IMPL-06B-03` | 3 | J02/J03/J05/J06/J09 derived rebuild/replay/no-write | maintenance façade | only observation-derived material; H13 controlled |
| `IMPL-06B-04` | 4 | external prepare/call/finalize same-token controlled adapter | effect/recovery seam | unknown probe/manual, no blind retry/new token |
| `IMPL-06B-05` | 5 | jobs entry/report/exit mapping tests | jobs binaries/tests | facade-only entry, no direct store/adapter |
| batch | 目标 | 预计规模 | 验证/提交 |
|---|---|---|---|
| `BATCH-06B-01` | job public carriers/report ref | <=300 lines | job contract tests |
| `BATCH-06B-02` | claim/fence/item UoW | 高风险，按 claim 与 report fold 拆分 | recovery/UoW tests |
| `BATCH-06B-03` | derived rebuild/replay/no-write | 高风险独立批次 | rebuild/no-write tests |
| `BATCH-06B-04` | external phase/recovery | 高风险独立批次 | controlled external tests |
| `BATCH-06B-05` | jobs entry mapping | <=250 lines | entry-worker-job suite |

Allowed scope：`crates/jobs/src/**`、application job/maintenance modules、job technical infra stores、controlled external seam、J01~J09 tests。
Forbidden scope：source truth repair/delete、H13 positive fabrication、direct adapter/repository from jobs entry、terminal item re-execution。

### 5.13 `commit-07-a`：runtime builder 与 entry activation

| 任务 | 顺序 | 实施动作 | 输出 | 完成判定 |
|---|---:|---|---|---|
| `IMPL-07A-01` | 1 | 13-stage config/runtime assembly | runtime builder | complete-or-error，no silent fallback |
| `IMPL-07A-02` | 2 | capability/availability descriptors and fake/durable/controlled/disabled parity | infra adapters | health 不等于 operation success |
| `IMPL-07A-03` | 3 | API/worker/jobs least-authority assignment and registrars | entry runtime | one matching slice，failure revoke/join all |
| `IMPL-07A-04` | 4 | activation/config/dependency tests | runtime suite | profile/mode legality and no reverse dependency |
| batch | 目标 | 预计规模 | 验证/提交 |
| `BATCH-07A-01` | config/runtime builder | 需按 stages 拆批 | config/runtime tests |
| `BATCH-07A-02` | descriptors/adapters | <=300 lines | availability/parity |
| `BATCH-07A-03` | entry assignment/registrars | 高风险独立批次 | activation fault tests |
| `BATCH-07A-04` | profile/dependency static checks | <=200 lines | config/dependency suite |

Allowed scope：`crates/infra/src/runtime_builder.rs`、config/adapters、API/worker/jobs runtime assignment and registrar wiring。
Forbidden scope：generic runtime aggregate、downcast/Clone locator、cross-profile handle reuse、new protocol/state、non-core Cargo path。

### 5.14 `commit-07-b`：静态安全与边界 gates

| 任务 | 顺序 | 实施动作 | 输出 | 完成判定 |
|---|---:|---|---|---|
| `IMPL-07B-01` | 1 | redaction scan and forbidden material corpus | `check_redaction.sh` | raw/secret/hash escape/provider detail all nonzero |
| `IMPL-07B-02` | 2 | metric label and telemetry schema check | `check_metric_labels.sh` | only declared low-cardinality labels |
| `IMPL-07B-03` | 3 | dependency boundary and report provenance check | `check_dependency_boundary.sh` + report audit | non-core edge/`latest`/static pass rejected |
| batch | 目标 | 预计规模 | 验证/提交 |
|---|---|---|---|
| `BATCH-07B-01` | redaction scanner | <=250 lines | redaction corpus |
| `BATCH-07B-02` | metric scanner | <=200 lines | metric corpus |
| `BATCH-07B-03` | dependency/provenance scanner | <=250 lines | static boundary/report tests |

Allowed scope：`scripts/checks/**`、telemetry check inputs、static manifests and report check adapters。
Forbidden scope：source/truth/artifact mutation by scanner、success synthesis、changing design IDs to satisfy scanner。

### 5.15 `commit-08-a`：suite、artifact 和 run report generator

| 任务 | 顺序 | 实施动作 | 输出 | 完成判定 |
|---|---:|---|---|---|
| `IMPL-08A-01` | 1 | 99 TC/82 DS/9 suite/6 lane/3 profile manifest join | test manifest | no orphan/duplicate and exact lane/profile binding |
| `IMPL-08A-02` | 2 | gate runner and raw artifact materialization | `run_ci_gate.sh` + raw structure | same run root, failure retained, no default success |
| `IMPL-08A-03` | 3 | report generator and candidate linkage | `generate_reports.sh` + run reports | report only folds same-run raw inputs |
| `IMPL-08A-04` | 4 | report/provenance audit tests | audit output | missing/corrupt/`latest` input nonzero |
| batch | 目标 | 预计规模 | 验证/提交 |
|---|---|---|---|
| `BATCH-08A-01` | manifest join/index | 100~300 lines，必要时按 TC/DS 与 suite 拆分 | static test |
| `BATCH-08A-02` | gate/raw writer | 高风险独立批次 | artifact contract |
| `BATCH-08A-03` | report/candidate generator | 高风险独立批次 | report generation |
| `BATCH-08A-04` | provenance failure audit | <=250 lines | report audit |

Allowed scope：test manifests/support、`scripts/gates/run_ci_gate.sh`、`scripts/reports/generate_reports.sh`、raw/run report schema and tests。
Forbidden scope：真实 acceptance verdict、static evidence alias、cross-run aggregation、修改被测 source/artifact 以通过 gate。

### 5.16 `commit-08-b`：acceptance/review handoff shell

| 任务 | 顺序 | 实施动作 | 输出 | 完成判定 |
|---|---:|---|---|---|
| `IMPL-08B-01` | 1 | 生成 acceptance handoff/veto/open-issues input | `reports/acceptance/*.md` shell | same-run path and unresolved status preserved |
| `IMPL-08B-02` | 2 | risk-acceptance conditional input and review notes contract | risk/review shell | no owner/signoff => remains open |
| `IMPL-08B-03` | 3 | release smoke/report handoff audit | handoff checks | 31 AC/24 NFR/10 VF source links complete; no final decision |
| batch | 目标 | 预计规模 | 验证/提交 |
|---|---|---|---|
| `BATCH-08B-01` | handoff/veto/open issue templates | <=250 lines | report schema check |
| `BATCH-08B-02` | risk/review input | <=200 lines | conditional/no-signoff checks |
| `BATCH-08B-03` | release/handoff provenance audit | <=250 lines | release/report audit |

Allowed scope：acceptance/review report input generators and handoff validation。
Forbidden scope：填写真实接受人、签署、verdict、EV alias、run id 或把缺失证据改为 passed。

## 6. 每个 boundary 的通用开工前设计闭环复核

以下九项是每个 boundary 的 mandatory checklist。Step 13 装配的正式 `07` 会引用本表和逐 boundary 复核表；实现 agent 只能二次核验，不能补口。

| 复核项 | 必须确认 | 未通过处理 |
|---|---|---|
| 字段闭环 | 当前 boundary 会构造/保存/返回的 required fields 均有正式 owner、source、optional 语义和 persisted coverage | 回写 `03/04`，boundary blocked |
| DTO 构造闭环 | request/event/job -> metadata/context -> domain factory/service input 的字段能 lossless 构造 | 回写 `03`，不得 handler 私补 |
| 状态闭环 | state variant、initial、transition、terminal/reserved、condition fields、error mapping 与 `03/05/06` 一致 | 回写 `03/05/06` |
| ref identity 闭环 | ref kind、mint/rehydrate、lookup key、scope relation、replacement identity 有唯一 source | boundary blocked，禁止从 time/row/string 派生 |
| validation truth 闭环 | 每个存在性、scope、version、visibility、digest、binding 检查有 exact truth source/port/error | 回写 source map；禁止 fake scan/default |
| metadata/idempotency/UoW | actor/context/digest/key/reservation/result/ref、accepted write set、commit/rollback/unknown probe 有完整顺序 | 高风险项独立复核；失败即 blocked |
| projection/rebuild | projection、stale/fresh marker 有 committed source、bounded replay 和 no-write boundary | 回写 `03`/`05`；禁止 current read 修复 |
| artifact materialization | 当前 batch 的 test/raw/report 产物有 exact path、run identity、failure semantics | 回写 `05/06`；禁止静态 evidence |
| phase boundary | 不调用后续 phase 对象/结果/证据；deferred surface 有 named carve-out | 调整 boundary 或 design blocker |

## 7. 逐 boundary 设计者经验复核

经验复核来源为可落码标准 §九的字段/DTO、callable surface、shared type、flow chain、state、metadata/idempotency、projection、artifact 和 observability 经验项。`通过`只表示设计闭环已具备，绝不表示代码或测试已通过。

| boundary | 涉及设计面 | 适用经验项与正式来源 | 不适用项及具体理由 | 设计结论/处理 |
|---|---|---|---|---|
| `commit-01-a` | workspace、crate、dependency、file owner | shared type/import、phase boundary、artifact path；`03` §3~§4/§16，Step 03 | domain state、idempotency、projection rebuild 不适用，尚未实现业务 flow | 通过设计；target repo reality 是 implementation blocker |
| `commit-01-b` | config、script、artifact/report path | config binding、artifact materialization、path identity；`04` §6~§13、`05` §9、Step 03 | domain factory/state 不适用；本 boundary 不构造业务对象 | 通过 planned；禁止 `latest`/默认成功 |
| `commit-02-a` | public DTO、ref、protocol、error | field/DTO/ref identity、public secondary owner、shared type、artifact carrier；`03` §6~§7、§11、§16 | UoW/rebuild/consumer completion 不适用；尚无写 flow | 通过设计；任何 owner/use gap 阻塞 |
| `commit-02-b` | domain object/state/policy/history | field/state/error/history、factory persisted coverage、domain guard source；`03` §5~§6、§9、§11 | external effect/evidence report generator 不适用；不接外部 phase | 通过设计；27+1 state 不得新增 alias |
| `commit-03-a` | Command、UoW、idempotency、redaction、telemetry | flow chain、metadata/idempotency、accepted side-effect、redaction-before-serialization；`03` §8、§10~§14 | Query read bundle、job claim/fence 不适用；后续 boundary owner | 通过 with affected；UoW/recovery affected 维持 open |
| `commit-03-b` | API/Consumer、schema、producer binding、completion | callable surface、pre-parse ordering、consumer receipt、unknown completion；`03` §7.4、§8.4、`05` §9 | job report/rebuild 不适用；I05 positive 被 carve out | controlled；I05/schema/binding 和 completion affected 不得关闭 |
| `commit-04-a` | append-only、audit/evidence、gap、event | accepted side-effect、body-free snapshot、cursor/version、truth ownership；`03` §8~§11、§14 | Query composite bundle不适用；由 04-b/05-b 承接 | 通过 with affected；evidence body/owner gap blocked |
| `commit-04-b` | Query read、visibility、event snapshot | Query DTO/read carrier、visibility source、projection identity、outbox snapshot；`03` §7.3、§8.3、§10、`06` §5 | job claim/external retry不适用 | 通过设计；read source 不得跨时间拼接 |
| `commit-05-a` | telemetry、projection、rollup、derived event | observability layering、projection rebuild source、low-cardinality/redaction、event source；`03` §10、§14 | API selector/Job report不适用 | 通过 with affected；telemetry 不生成 authority |
| `commit-05-b` | 14 Query、diagnostic、zero-write | Query status/visibility/freshness、same-boundary carrier、read-only flow；`03` §7.3、§8.3、§15 | accepted mutation/UoW writer不适用，且必须禁止 | 通过；任何 writer call 或 fallback 都是 blocker |
| `commit-06-a` | handoff、evidence index、retention/protection | target/intent/output/marker ref roles、immutable input、state/recovery、no verdict；`03` §7/§9~§13、`06` §3~§4 | job item claim不适用；由 06-b 承接 | affected open；report ref/secondary type 需 owner closure |
| `commit-06-b` | Job、claim/fence、UoW、external phase、rebuild | public job surface、metadata/idempotency、claim/fence、recovery、projection rebuild、external token；`03` §8、§10~§13 | API route/query response不适用 | conditional；H13/external/recovery/report affected 保持 open |
| `commit-07-a` | config runtime、entry assignment、adapter | config cannot alter invariant、activation atomicity、least-authority callable、dependency direction；`03` §13、`04` §9~§11 | domain object factory不适用；前序 owner 已闭合 | blocked_until_target_reality；不允许 generic runtime/fallback |
| `commit-07-b` | static gates、telemetry safety、dependency/evidence | artifact/report provenance、redaction、observability/no-write、dependency scan；`03` §14~§16、`05` §9、`06` §3 | domain persistence transition不适用 | planned；scanner 不修改输入或生成 pass |
| `commit-08-a` | test manifest、suite、artifact/report | minimum test cut、artifact materialization、same-run path、candidate maturity；`05` §3~§10、`06` §3 | source object schema不适用；实现已由前序 boundary提供 | planned_not_run；缺 lane/runner 保持 blocked |
| `commit-08-b` | acceptance/review/evidence handoff | AC/VF provenance、three-value decision、risk acceptance、review/signoff separation；`06` §4、§11~§14 | code UoW/domain factory不适用 | planned_not_evaluated；不得填写真实 verdict/signoff |

## 8. Boundary Gate Matrix（planned）

| boundary | ledger file | allowed scope摘要 | forbidden scope摘要 | required checks | Commit Gate | Handoff Gate |
|---|---|---|---|---|---|---|
| `commit-01-a` | `implementation-boundaries/commit-01-a.md` | workspace/Cargo/7 crate skeleton | business implementation/config/scripts | worktree、fmt、check、dependency、diff | staged manifest only、message、whitespace | real hash、checks、blockers、next `01-b` |
| `commit-01-b` | `implementation-boundaries/commit-01-b.md` | config shell/scripts/roots | provider/business flow/real evidence | config parse、CLI/path、no-latest | staged config/scripts only | hash、run status、next `02-a` |
| `commit-02-a` | `implementation-boundaries/commit-02-a.md` | contracts/ref/protocol/error | domain/service/entry | contract suite、owner/wire/body-free | contract scope/message/diff | hash、test output、next `02-b` |
| `commit-02-b` | `implementation-boundaries/commit-02-b.md` | domain objects/state/policy | infra/entry/source truth | domain/state/error/persisted fields | domain scope/message/diff | hash、test output、next `03-a` |
| `commit-03-a` | `implementation-boundaries/commit-03-a.md` | intake/signal application/UoW/idempotency | API/worker/external | service/UoW/idempotency/redaction | exact application scope | hash、TC/status/blockers、next `03-b` |
| `commit-03-b` | `implementation-boundaries/commit-03-b.md` | API intake/consumer completion | I05 positive/new Job/direct store | entry/consumer/unknown completion | entry scope/message/diff | hash、affected status、next `04-a` |
| `commit-04-a` | `implementation-boundaries/commit-04-a.md` | audit/evidence/gap append/storage/events | body/external truth/query repair | audit/UoW/body-free/cursor | storage/event scope | hash、test/report refs、next `04-b` |
| `commit-04-b` | `implementation-boundaries/commit-04-b.md` | Q05/Q06/read/event projection | writer/refresh/acceptance | query/no-write/provenance | read scope/message | hash、next `05-a` |
| `commit-05-a` | `implementation-boundaries/commit-05-a.md` | signal/projection/telemetry/events | raw/high-cardinality/authority | signal/metric/redaction/rebuild source | projection scope | hash、next `05-b` |
| `commit-05-b` | `implementation-boundaries/commit-05-b.md` | Q01~Q14/read/diagnostic | any writer/repair/fallback | exhaustive query/no-write/visibility | query scope | hash、next `06-a` |
| `commit-06-a` | `implementation-boundaries/commit-06-a.md` | handoff/evidence/retention/protection | verdict/cleanup/external call | handoff/retention/no-verdict | handoff scope | hash、next `06-b` |
| `commit-06-b` | `implementation-boundaries/commit-06-b.md` | J01~J09/rebuild/recovery/controlled effect | source repair/H13 positive/direct adapter | job/UoW/fence/recovery/no-write | job scope | hash、affected report、next `07-a` |
| `commit-07-a` | `implementation-boundaries/commit-07-a.md` | runtime/config/entry assignment | generic runtime/fallback/new schema | config/activation/dependency/entry | runtime scope | hash、profile results、next `07-b` |
| `commit-07-b` | `implementation-boundaries/commit-07-b.md` | static gates/checks | modifying inputs/success synthesis | redaction/metric/dependency/report | scripts scope | hash、check outputs、next `08-a` |
| `commit-08-a` | `implementation-boundaries/commit-08-a.md` | test manifest/gate/raw/report | static evidence/verdict/cross-run | suite/artifact/report provenance | test/script scope | hash、run status、next `08-b` |
| `commit-08-b` | `implementation-boundaries/commit-08-b.md` | acceptance/review input shell | real signoff/verdict/alias | handoff/VF/risk/provenance | report scope | hash、review status、handoff only |

### 8.1 通用 Commit Gate

每个 boundary 提交前必须确认：

1. staged 文件只属于该 boundary allowed scope，用户已有不相关改动不被加入。
2. `git diff --cached --check`、必要的 `cargo fmt --check`、`cargo check` 和该 boundary required tests 已执行，失败材料保留。
3. commit message 使用英文 `type(scope): subject`；body 按子功能分组，footer 与 evidence/report 引用只写真实存在的输入。
4. 不写伪造 hash、run id、evidence alias、passed、verdict 或 signoff。
5. 完成后由实现台账回写真实 hash、门禁状态、未跑测试、remaining blocker 和下一 boundary；设计仓本 Step 不填这些事实。

### 8.2 通用 Handoff Gate

Handoff 必须包含 design baseline、实际实现仓路径、当前 boundary 状态、允许的下一动作、required checks 结果、剩余 affected/blocker、未运行测试和下一 boundary。任一设计闭环未通过时 `gate_status=blocked`、`next_allowed_action=wait_design`，实现 agent 不得自行改 schema/port/state/phase。

## 9. Commit boundary 停审记录

| boundary | 一句话描述 | 独立 review/verify/rollback | 子功能是否同一增量 | 结论 |
|---|---|---|---|---|
| `commit-01-a` | workspace/dependency skeleton | yes | yes | pass_with_target_blocker |
| `commit-01-b` | config/script/path shell | yes | yes | pass |
| `commit-02-a` | public contract carrier | yes | yes | pass |
| `commit-02-b` | domain state carrier | yes | yes | pass_with_affected_open |
| `commit-03-a` | intake accepted flow | yes | yes | pass_with_uow_affected |
| `commit-03-b` | entry/consumer completion | yes | yes | pass_with_i05_controlled |
| `commit-04-a` | audit/evidence append flow | yes | yes | pass_with_affected_open |
| `commit-04-b` | audit/evidence read surface | yes | yes | pass |
| `commit-05-a` | signal/projection telemetry | yes | yes | pass_with_affected_open |
| `commit-05-b` | all query zero-write | yes | yes | pass |
| `commit-06-a` | handoff/retention protection | yes | yes | pass_with_affected_open |
| `commit-06-b` | job/rebuild/recovery | yes | yes | conditional_open_affected |
| `commit-07-a` | runtime/entry activation | yes | yes | pass_with_target_blocker |
| `commit-07-b` | static gates/checks | yes | yes | pass_planned |
| `commit-08-a` | suite/raw/report generation | yes | yes | pass_planned_not_run |
| `commit-08-b` | acceptance/review handoff shell | yes | yes | pass_planned_not_evaluated |

## 10. 跨 boundary 粒度、依赖和门禁审计

| 审计项 | 结论 | 修正/约束 |
|---|---|---|
| boundary 是否过粗 | no | 高风险 UoW、Query zero-write、job fence、external phase、provenance 已独立批次/门禁 |
| boundary 是否过细 | no | 每个 boundary 是可验证功能增量，不按单文件/单函数拆分 |
| 是否跨 phase 混入 | no known conflict | 由 phase 总表和 allowed/forbidden scope 双重约束 |
| public contract 是否先于 service | pass | PH-02 先闭 contracts/domain，后续 boundary 消费 |
| Query 是否依赖 writer | no | PH-05/`commit-05-b` 明确 zero-write |
| Event 是否有 committed snapshot source | pass | `commit-04-a/b`、`05-a`、`06-a` 绑定 source UoW |
| Job 是否有 report/ref/fence owner | conditional | `S08-JOB-REPORT-REF-OWNER-01`、`S08-M1-SECONDARY-TYPE-OWNER-01` 保持 affected |
| I05/J06 positive 是否被误报完成 | no | `commit-03-b`/`06-b` 仅 controlled/blocked |
| artifact/report 是否有 same-run identity | pass_design | `commit-08-a/b` 只规划，真实 run 未执行 |
| future skeleton 是否提前授权实现 | no | 全部 boundary 未来状态 `planned/wait_until_current` |
| 12 inherited affected 是否逐 boundary 可定位 | pass | 见 §11 |

## 11. Inherited affected 到 boundary 的绑定

| affected | 主要 boundary | 当前实施动作 | 禁止 |
|---|---|---|---|
| `S08-E-I05-PAYLOAD-SCHEMA-01` | `commit-03-b`、`08-a` | pre-parse fail-closed、controlled fixture、blocked positive | 发明 payload schema/DTO |
| `S08-E-I05-PRODUCER-EVENT-BINDING-01` | `commit-03-b`、`07-a` | static slot disabled/unavailable | broad subscription/任选 event |
| `R06.6-F2-H13-UPSTREAM` | `commit-06-b`、`08-b` | J06 Blocked/manual，保留 gap/report | 伪造 H13 completion/result |
| `R06-F-AFFECT-UOW-01` | `commit-03-a`、`04-a`、`06-b` | exact order、rollback、commit-unknown probe | Clone/reload/partial success |
| `S08-RECOVERY-CLASS-OWNER-01` | `commit-03-a`、`06-b` | 消费既有 recovery class，缺 owner 则 blocked | 新建 retry enum/default |
| `R07-EXTERNAL-PHASE-LINK-01` | `commit-06-b`、`07-a` | prepare/call/finalize controlled seam | 换 token/binding |
| `R07-EXTERNAL-PHASE-RETRY-ACCOUNTING-01` | `commit-06-b` | unknown probe/manual、known success finalize-only | blind retry |
| `S08-CONSUMER-OUTBOX-SURFACE-01` | `commit-03-b` | snapshot/no-write/conditional completion | 默认 ack/outbox |
| `S08-CONSUMER-INDETERMINATE-COMPLETION-01` | `commit-03-b`、`06-b` | unknown completion preserved | default action |
| `S08-JOB-REPORT-REF-OWNER-01` | `commit-06-a`、`06-b` | owner closure before positive job/report | alias/wrapper/String fallback |
| `S08-M1-SECONDARY-TYPE-OWNER-01` | `commit-02-a`、`06-a` | declaration/use/static owner check | duplicate secondary type |
| `03-RPR-S09-PER-FLOW` | all flow boundaries, especially `03-a/04-a/05-b/06-b` | 60 exact flow per-boundary audit | family summary代替 flow proof |

## 12. 回填草稿

正式 `07` §6 回填 16 个 boundary 的一语目标、阶段任务、编写顺序、代码批次、allowed/forbidden scope、required checks、Commit/Handoff Gate 和 affected 绑定。正式正文可以引用本 Step 的通用设计闭环复核和经验复核，但不得新增本文件未确认的 boundary、协议、状态或测试结果。Step 13 完成时全部 boundary skeleton 一次性预创建；只把 `commit-01-a` 设为 implementation current，其余保持 `planned/wait_until_current`。

## 13. Step 自检与进入下一步条件

| 检查项 | 结论 |
|---|---|
| 每个 phase 是否有任务、批次、提交边界 | pass |
| 每个 boundary 是否可一句话描述、独立 review/verify/rollback | pass |
| 每个 boundary 是否有 allowed/forbidden scope、required checks、Commit/Handoff Gate | pass |
| 是否覆盖字段/DTO/state/ref/validation/UoW/idempotency/projection/artifact/phase 复核 | pass |
| 是否逐 boundary 完成经验复核并保留具体不适用理由 | pass |
| 是否把高风险逻辑拆为独立批次 | pass |
| 是否把 12 affected 显式绑定且未关闭 | pass_with_affected_open |
| 是否创建/激活 implementation ledger 或真实 boundary | no；Step 13 才创建 |
| 是否伪造 commit/hash/run/test/evidence/verdict/signoff | no |
| new upstream blocker | none |
| gate_status | `pass_with_affected_open` |
| next_allowed_action | `continue_to_step_07` |
