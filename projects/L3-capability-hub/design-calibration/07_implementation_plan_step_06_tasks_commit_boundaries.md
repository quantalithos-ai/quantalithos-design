# L3-capability-hub 07 实施计划 Step 6：任务、代码批次与提交边界

> 对应 SOP: `standards/document/实施计划讨论流程_SOP.md` Step 6
> 书写规范: `standards/document/实施计划书写规范.md` §3.2~§4.6
> 中间产物规范: `standards/document/设计文档讨论中间产物规范.md`
> 可落码性标准: `standards/document/设计真相源闭环与可落码性标准.md` §九
> 台账规范: `standards/document/代码实施台账与门禁规范.md`
> 回填章节: `projects/L3-capability-hub/07-实施计划.md` §6
> 输入: Step 5 `PH-01`~`PH-11`、Step 4 交付物池、正式 `03/04/05/06`
> 创建日期: 2026-07-26
> 当前模式: full-restart / continuous execution

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 6 拆分阶段任务、编写顺序与提交边界 |
| 当前状态 | completed_continuous_execution |
| phase 输入 | `PH-01`~`PH-11`，来自 Step 5 |
| candidate boundary 数量 | 26 个，`commit-01-a`~`commit-11-b`，包含独立的 `commit-03-c` accepted service vertical slice |
| 直接编码 authority | 正式 `03-详细设计.md` 与指定 `03_ddd_step_*` exact source |
| test/acceptance authority | 正式 `05-测试方案.md`、`06-验收标准.md`；Step 7 继续细化 |
| implementation ledger | project and 26 boundary ledgers are present; current facts are maintained by the implementation-repository ledger |
| target implementation repo | `/home/aris/Projects/quantalithos-capability-hub` established; PH-01 handoff recorded |
| unresolved upstream blocker | `0` |
| 下一动作 | Step 7 绑定 exact TC/DS/EV、suite、gate、artifact/report 和 AC/VETO 门禁 |

## 2. 本步输入与 SOP 问题回答

| 输入 | 用途 | 结论 |
|---|---|---|
| Step 5 phase 表 | boundary 必须属于唯一 phase 并遵守依赖 | 26 个 boundary 按 phase 顺序编号；`commit-03-c` 独立承载 identity/registry accepted service vertical slice |
| `03` Step 6~17 | exact object/field/Port/protocol/flow/state/TX/binding source | 不在本 Step 重写 schema |
| `04` Step 6~12 | config/profile/source/activation/failure binding | config boundary 只落已定义 key/source |
| `05` Step 3~14 | test cuts、dataset、environment、suite、evidence | 每个 boundary 有 targeted test seed，Step 7 再定 exact selector |
| `06` Step 5~14 | AC/VF/VETO、release、risk、handoff | boundary 只前置规避，不生成 verdict |
| 可落码性标准 §九 | 设计闭环和经验复核清单 | 适用项逐 boundary 记录；缺口必须 `wait_design` |
| 代码实施台账规范 | ledger、Gate、planned skeleton 规则 | 当前只定义 hook，不伪造实现事实 |

本步回答：

1. **每个阶段有哪些实施动作？** 由 `IMPL-<phase>-<nn>` 任务表和 boundary 表定义，任务以“建立/接入/验证/收口”动作命名。
2. **代码按什么顺序写？** 每个 boundary 均遵循 `contracts -> domain -> application -> infra/fake -> entry -> targeted tests`；report boundary 例外地按 `raw schema -> parser -> builder -> audit`。
3. **哪些内容必须同提交？** 同一可验证增量所需的 public carrier、owner、service、fake parity 和最小测试必须同提交；跨 truth owner、后续 protocol family 或真实外部产品必须分开。
4. **何时不能提交？** 目标仓未建立、Design/Scope/Worktree/Build/Test/Evidence Gate 未通过、scope 越界、设计闭环缺口或真实 evidence 未生成时不得 commit。
5. **是否有过大批次？** 26 个 boundary 再按 2~4 个代码批次切分；单批目标 100~300 行，预计超过 300 行必须拆，超过 500 行禁止。
6. **如何处理实现中发现的设计缺口？** 当前 boundary 置 `blocked`，`next_allowed_action=wait_design`，回写 owning `03/04/05/06`，更新 baseline 后重新审计；实现端不得自行补字段、Port、state、mapper、config 或 evidence schema。

## 3. 通用实施顺序与门禁

### 3.1 代码写入顺序

| 顺序 | 层 | 当前允许动作 | 当前禁止动作 |
|---:|---|---|---|
| 1 | `crates/contracts` | 落 exact public type、metadata/ref、codec、DTO、variant/payload Rustdoc | 自造 mirror type、把 domain private type 暴露到 wire |
| 2 | `crates/domain` | 落 truth object、state guard、policy、invariant、closed error | 读 config、repository、transport 或 external body |
| 3 | `crates/application` | 落 Port、UoW、idempotency、service input/output、flow orchestration | 使用 private finder、第二 authority、字符串分类错误 |
| 4 | `crates/infra` | 落 repository/fake/controlled/disabled adapter、config binding、builder | 新增未设计 Port、把 sibling 加入 Cargo、从 raw body 推 truth |
| 5 | `crates/api` / `crates/worker` / `crates/jobs` | 只调用 application facade，维护 entry-owned lifecycle | 直接读 repository、直接改 domain、生成 metadata/trace/id |
| 6 | `tests/` / `scripts/` | 落 targeted fixture、negative case、gate/check/report contract | static passed、latest alias、跨 run 拼接、删失败 raw |

### 3.2 每个 boundary 的通用开工前设计闭环

| 复核项 | 必须确认 | 失败动作 |
|---|---|---|
| 字段与 support carrier | 每个必填字段、reason、summary、ref-set、kind、status 有正式来源和 owner | `wait_design`，回写 `03` |
| DTO 构造 | request/event/job 能构造 exact service input；result/receipt/report 能完整 replay | `wait_design`，不得 placeholder |
| typed-ref kind | kind/variant、owner crate/file、集合排序/去重/empty 语义闭合 | `wait_design`，不得 local alias |
| Port/repository | method、key、return、version、missing/conflict、UoW 顺序与 fake/durable parity闭合 | `wait_design` |
| state/transition | 当前 boundary 只实现 current variants；reserved/future 明确排除；illegal 有 oracle | `wait_design` |
| metadata/idempotency | metadata authority、canonical digest、reserve、stored result/receipt/report、winner read闭合 | `wait_design` |
| query surface | visibility resolver、page/empty seed、marker/degraded mapper、read-only call order闭合 | `wait_design` |
| event/job surface | snapshot/capture、receipt、frozen plan、target/final report 和 public schema闭合 | `wait_design` |
| config binding | key/source/profile/activation/failure、Disabled/Missing/Unavailable映射闭合 | 回写 `04` |
| evidence materialization | raw schema、run root、report builder、digest/pairing/redaction source闭合 | 回写 `05/06` |
| phase boundary | 不依赖后续 phase 的 service、state、job、report 或 evidence | 调整 boundary 或回写设计 |

### 3.3 通用提交前 Gate

| Gate | 必须有的执行记录 | 未通过处理 |
|---|---|---|
| Design Gate | project ledger、current boundary、required reads、design baseline | `wait_design` |
| Scope Gate | touched path 与 allowed scope 对比；无后续 boundary 内容 | 拆 staged scope |
| Worktree Gate | 初始 status、用户改动隔离、无 destructive cleanup | 修正 staging，不回滚用户改动 |
| Build Gate | `cargo fmt --check`、受影响 package `cargo check`、必要的 rustdoc/clippy | `fix_gate_failure` |
| Test Gate | 当前 boundary targeted suite、negative/replay/no-write 等测试 | 不得提交 |
| Evidence Gate | 适用时显式 `run_id`、raw/report/digest/pairing/redaction | 缺失为 pending/blocked，不造 pass |
| Commit Gate | staged file、diff、message、whitespace、required checks | 不得 commit |
| Handoff Gate | boundary ledger、真实 commit（仅实现期）、下一 boundary 和 blocker | 设计期保持 planned |

### 3.4 代码批次规模规则

- 每个 `BATCH-*` 是可独立编译或可独立运行 targeted test 的小增量。
- 单批目标为 100~300 行；预计超过 300 行拆为多个批次，超过 500 行不得作为单批。
- 状态矩阵、事务/commit resolution、幂等/重入、redaction、跨仓 binding、Job terminalization 和 evidence builder 必须独立批次。
- 测试不能全部推迟到 phase 末尾；每个 boundary 至少有一批最小测试或静态检查与代码同提交。

## 4. Boundary 总表

| Boundary | Phase | 一句话目标 | 主要 capability/protocol | 允许修改面（设计口径） | 明确禁止 | 批次数 |
|---|---|---|---|---|---|---:|
| `commit-01-a` | PH-01 | 建立七 member workspace 与唯一编译依赖骨架 | layout/dependency | root Cargo、七 crate skeleton、package/lib/binary naming、workspace checks | 业务 DTO、config values、domain/service | 3 |
| `commit-01-b` | PH-01 | 建立 strict config、script、artifact/report 根契约 | config/evidence baseline | profiles、loader shell、scripts、path/schema checks | 真实 run/evidence、业务实现 | 3 |
| `commit-02-a` | PH-02 | 建立 public contracts、shared carrier 和 closed error/ref foundation | 250 public types 的基础层 | contracts refs/metadata/errors/shared shells/codec tests | truth object、service、adapter | 3 |
| `commit-02-b` | PH-02 | 建立 domain state/policy/invariant foundation | 43+7 objects 的公共规则层 | domain policies、state guards、pure tests | application UoW、repository、external truth | 3 |
| `commit-02-c` | PH-02 | 建立 application Port/UoW/idempotency/repository shell | 36 Port、22 repository/110 methods skeleton | application carriers、UoW、reserve/replay shell、fakes | concrete business service、entry runtime | 4 |
| `commit-03-a` | PH-03 | 建立 identity/access-review contracts/domain | C01~C04、Q01~Q03 | identity/review types/state/factory/pure tests | registry/descriptor/approval truth | 3 |
| `commit-03-b` | PH-03 | 建立 registry contracts/domain | C05~C08、Q04~Q06 | registry state/visibility/history/domain tests | allowlist/runtime/cache/listing semantics | 3 |
| `commit-03-c` | PH-03 | 完成 identity/registry accepted service vertical slice | C01~C08、Q01~Q06、same-UoW | service/repository fake/API facade/stored result/trace/capture | descriptor/relation/exposure/query mutation | 4 |
| `commit-04-a` | PH-04 | 建立 descriptor/risk/secret-safe contracts/domain | C09~C12、Q07~Q10 | descriptor state、safe summary、typed secret ref、pure tests | secret value/provider runtime/body | 3 |
| `commit-04-b` | PH-04 | 完成 external adapter descriptor service seam | C09~C12、external refs/9 Port subset | resolver/adapter fake、service、config binding、API read/write slice | MCP/A2A/API execution、route/quota/cost/retry | 4 |
| `commit-05-a` | PH-05 | 建立 governance seam/method relation contracts/domain | C13~C17、Q11~Q14、I01~I02 source types | relation state、safe result/asset refs、body-free guards | approval/Policy truth、method body/source | 3 |
| `commit-05-b` | PH-05 | 完成 governance/method relation services and controlled resolvers | C13~C17、Q11~Q14、resolver/fake | service/UoW/relation repositories/controlled seam | inbound worker loop、external body、approval mutation | 4 |
| `commit-06-a` | PH-06 | 建立 exposure/visibility contracts/domain | C18~C21、Q15~Q19 | exposure/applicability/state/policy guards | runtime allow/deny、SDK client/cache | 3 |
| `commit-06-b` | PH-06 | 完成 controlled consumer view and server exposure service | C18~C21、Q15~Q19、J02 read input | visibility resolver、view material/fake、API facade | query-triggered repair、runtime execution、marketplace listing | 4 |
| `commit-07-a` | PH-07 | 建立 trace/impact contracts/domain/service | C22~C23、Q20~Q23、I03 | trace/impact/change/revision/source symmetry | audit body、acceptance evidence、observer truth | 4 |
| `commit-07-b` | PH-07 | 建立 canonical reference contracts/resolvers/services | C24~C26、Q29~Q33、I04~I06 | typed ref/state/sidecar/resolver/fake | external body、downstream truth、implicit string parsing | 4 |
| `commit-08-a` | PH-08 | 建立 query/page/visibility response foundation | all Q shared shells | page/cursor/marker/empty/degraded DTO and read ports | query mutation、refresh job、new marker kind | 3 |
| `commit-08-b` | PH-08 | 完成 core capability query surfaces | Q01~Q19 | identity/registry/descriptor/relation/exposure queries and no-write tests | Query write/UoW/reserve/capture | 4 |
| `commit-08-c` | PH-08 | 完成 trace/reference/directory/material query surfaces | Q20~Q33 | trace/impact/reference/directory/export/report read surfaces | job refresh, event publish, truth repair | 4 |
| `commit-09-a` | PH-09 | 完成 inbound receipt/intake and worker source seam | I01~I06 | public inbound DTO, header-first gate, receipt store, dedup, worker lifecycle | core truth owner merge、payload body logging | 4 |
| `commit-09-b` | PH-09 | 完成 outbound snapshot/capture/collaboration seam | O01~O10 | event DTO, source snapshot, capture, mapper, worker continuation | local delivery state/queue/DLQ/transport truth | 4 |
| `commit-10-a` | PH-10 | 建立 public Job protocol/journal/report foundation | J01~J08 | job DTO、metadata、frozen plan、journal、typed response/report | generic execute、job business mutation | 4 |
| `commit-10-b` | PH-10 | 完成 derived/material/reconciliation job family | J01~J07 | target selection、read material refresh、immutable report、safe issue | current truth repair、scope rescan、listing/marketplace | 4 |
| `commit-10-c` | PH-10 | 完成 event/report/recovery job and replay behavior | J08 plus job replay | terminalization、replay、handoff/export seam、failure recovery | release verdict、blind retry、recursive entry | 4 |
| `commit-11-a` | PH-11 | 建立 raw/report/evidence index and audit builders | 189 TC/DS/EV、10 suites、9 checks | machine artifact schema、report generators、pairing/redaction/no-static | static pass、cross-run join、acceptance signoff | 4 |
| `commit-11-b` | PH-11 | 建立 release smoke and acceptance handoff shell | 5 gates、VETO、AC/VF handoff | final human verdict、risk auto-acceptance、real signoff | 3 |

Boundary ID、phase归属和顺序在后续正式 `07` 中保持稳定。若实现期发现需要新增或拆分 boundary，必须先受控回写 Step 6/正式 `07`，再创建新 ledger；不得在实现仓临时使用未登记 ID。

## 5. 阶段任务、代码批次与 boundary 执行登记

### 5.1 Phase 任务表

下表把 Step 5 的能力增量转译为实施动作。`IMPL-*` 是计划身份，不是实现记录；完成判定在真实实现期由 boundary ledger 和执行证据填写。

| Phase | 任务编号 | 顺序 | 实施动作 | 输入 | 设计期输出 | 实现期完成判定 |
|---|---|---:|---|---|---|---|
| PH-01 | `IMPL-01-01` | 1 | 核对目标仓、workspace、Rust toolchain、git identity 和用户改动隔离 | Step 3；`03` §3~§4 | preflight checklist contract | 目标仓根、版本和 baseline 由实现 agent 真实记录 |
| PH-01 | `IMPL-01-02` | 2 | 建立七 member Cargo layout 与唯一 `core-contracts` path dependency | `03` §4、§13.11 | root/member manifest scope | dependency and naming checks pass |
| PH-01 | `IMPL-01-03` | 3 | 建立 strict profile/config loader shell 与 binding path | `04` §3~§11 | config loader and failure contract | config smoke and forbidden-key checks pass |
| PH-01 | `IMPL-01-04` | 4 | 建立 run-scoped artifact/report roots、script/check shell 与 ledger handoff paths | `05` §9、§13；ledger standard | path/schema contract | explicit-run dry-run passes; no evidence fact inferred |
| PH-02 | `IMPL-02-01` | 1 | 建立 public refs、metadata、closed error、codec 和 shared carrier surface | `03` §5~§8 | contracts foundation | public declaration/Rustdoc scan and contract tests pass |
| PH-02 | `IMPL-02-02` | 2 | 建立 domain object support、state guards、policy/invariant foundation | `03` §6、§10 | domain foundation | pure state/invariant tests pass |
| PH-02 | `IMPL-02-03` | 3 | 建立 application Port、repository、UoW、idempotency、stored-result and fake shell | `03` §7、§11~§13 | application foundation | method/return/UoW parity is verified |
| PH-03 | `IMPL-03-01` | 1 | 落 identity/access-review contracts、state and pure rules | C01~C04 source | identity contract slice | source and state checks pass |
| PH-03 | `IMPL-03-02` | 2 | 落 registry contracts、visibility/history rules and pure tests | C05~C08 source | registry contract slice | current/history and visibility rules pass |
| PH-03 | `IMPL-03-03` | 3 | 完成 identity/registry accepted service vertical slice | C01~C08、Q01~Q06、TX source | service/fake/facade slice | same-UoW, duplicate and no-write checks pass |
| PH-04 | `IMPL-04-01` | 1 | 落 adapter descriptor、risk、secret-safe summary contracts/domain | C09~C12、Q07~Q10 | descriptor contract slice | body-free and typed-secret checks pass |
| PH-04 | `IMPL-04-02` | 2 | 完成 external adapter descriptor resolver/service seam | external Port/config source | controlled/disabled adapter slice | failure mapping and config binding checks pass |
| PH-05 | `IMPL-05-01` | 1 | 落 governance seam、method relation、safe ref and body-free guards | C13~C17、I01~I02 | relation contract slice | owner and body-free checks pass |
| PH-05 | `IMPL-05-02` | 2 | 完成 relation service、UoW、controlled resolver and fake parity | relation Ports/flows | service seam slice | no approval/method-body write checks pass |
| PH-06 | `IMPL-06-01` | 1 | 落 formal exposure、applicability、visibility contracts/domain | C18~C21 | exposure contract slice | source-symmetric state checks pass |
| PH-06 | `IMPL-06-02` | 2 | 完成 controlled consumer view and SDK server exposure service seam | Q15~Q19、J02 read input | view/exposure slice | no runtime decision or client cache checks pass |
| PH-07 | `IMPL-07-01` | 1 | 落 trace、impact、change/revision and source-symmetry contracts/domain | C22~C23、I03 | trace contract slice | trace/history/capture source checks pass |
| PH-07 | `IMPL-07-02` | 2 | 完成 canonical reference state/ref resolver and body-free services | C24~C26、I04~I06 | reference slice | typed kind, sidecar and missing semantics pass |
| PH-08 | `IMPL-08-01` | 1 | 建立 shared query/page/cursor/marker/read-port surface | all Query shared source | query foundation | no-write contract tests pass |
| PH-08 | `IMPL-08-02` | 2 | 完成 identity/registry/descriptor/relation/exposure query services | Q01~Q19 | core query slice | resolver-first and no-write checks pass |
| PH-08 | `IMPL-08-03` | 3 | 完成 trace/reference/directory/export/material query services | Q20~Q33 | extended read slice | freshness/degraded/body-free checks pass |
| PH-09 | `IMPL-09-01` | 1 | 完成 inbound header-first intake、receipt、dedup and worker source seam | I01~I06 | inbound collaboration slice | receipt replay and no-reverse-write checks pass |
| PH-09 | `IMPL-09-02` | 2 | 完成 outbound immutable snapshot/capture/mapper/collaboration continuation | O01~O10 | outbound collaboration slice | A/B/C and post-commit failure checks pass |
| PH-10 | `IMPL-10-01` | 1 | 建立 public Job DTO、journal、frozen plan、report and replay carrier | J01~J08 | job foundation | job schema/Rustdoc checks pass |
| PH-10 | `IMPL-10-02` | 2 | 完成 derived/material/reconciliation job family | J01~J07 | derived job slice | target terminal and no-truth-repair checks pass |
| PH-10 | `IMPL-10-03` | 3 | 完成 event/report/recovery job and replay behavior | J08、TX/idempotency source | recovery slice | terminalization and duplicate replay checks pass |
| PH-11 | `IMPL-11-01` | 1 | 建立 raw schema、report builders、evidence index and audit checks | `05` §9、§13 | evidence builder contract | same-run pairing/no-static rules are executable |
| PH-11 | `IMPL-11-02` | 2 | 建立 release smoke、VETO、acceptance/review handoff shell | `06` §10~§15 | handoff document contract | generated drafts are reviewable and never default pass |

### 5.2 Boundary 批次登记

每个 boundary 的 `BATCH-*` 是编写和局部验证单位；多个批次只有在共同组成一个可验证增量时才归入同一提交。预计超过 300 行的工作必须继续拆分，超过 500 行不得作为单批。

| Boundary | Batch 顺序 | 批次目标与输出 | 预计规模 | 最小检查种子 |
|---|---|---|---|---|
| `commit-01-a` | `BATCH-01-A1..A3` | manifest/layout -> seven member skeletons -> dependency/name/static checks | 100~300 each | fmt, workspace check, dependency scan |
| `commit-01-b` | `BATCH-01-B1..B3` | config schema shell -> root/script shell -> path and forbidden-static checks | 100~300 each | config smoke, script dry-run, path check |
| `commit-02-a` | `BATCH-02-A1..A3` | typed refs/metadata -> closed errors/shared carriers -> codec/Rustdoc fixtures | 100~300 each | contracts check, Rustdoc scan, contract tests |
| `commit-02-b` | `BATCH-02-B1..B3` | state families -> policies/invariants -> pure negative tests | 100~300 each | domain check, state tests, body-boundary scan |
| `commit-02-c` | `BATCH-02-C1..C4` | Port declarations -> UoW/transaction shell -> idempotency/stored result -> fake parity | 100~300 each | application check, TX/idempotency tests |
| `commit-03-a` | `BATCH-03-A1..A3` | identity DTO/ref -> review state/rules -> pure fixtures | 100~300 each | contract/domain fast seed |
| `commit-03-b` | `BATCH-03-B1..B3` | registry DTO/ref -> lifecycle/visibility -> history/current tests | 100~300 each | contract/domain fast seed |
| `commit-03-c` | `BATCH-03-C1..C4` | service inputs -> same-UoW service -> fake/repository parity -> facade and focused tests | 100~300 each | service-flow, repository/TX, replay seed |
| `commit-04-a` | `BATCH-04-A1..A3` | descriptor contract -> risk/secret-safe domain -> body-free tests | 100~300 each | contract/domain, redaction seed |
| `commit-04-b` | `BATCH-04-B1..B4` | adapter source/descriptor resolver -> controlled/disabled fake -> service/config binding -> API seam tests | 100~300 each | service-flow, config, redaction |
| `commit-05-a` | `BATCH-05-A1..A3` | seam refs/results -> relation state/guards -> no-body tests | 100~300 each | contract/domain, responsibility scan |
| `commit-05-b` | `BATCH-05-B1..B4` | relation service inputs -> UoW/repository -> controlled resolver/fake -> inbound-facing service tests | 100~300 each | service-flow, TX, redaction |
| `commit-06-a` | `BATCH-06-A1..A3` | exposure DTO -> applicability/visibility state -> pure boundary tests | 100~300 each | contract/domain, state seed |
| `commit-06-b` | `BATCH-06-B1..B4` | view material -> resolver/assembler -> server exposure facade -> freshness/no-runtime tests | 100~300 each | service-flow, query no-write, binding |
| `commit-07-a` | `BATCH-07-A1..A4` | trace carrier -> impact/revision -> source symmetry/capture relation -> redaction tests | 100~300 each | service-flow, TX, redaction |
| `commit-07-b` | `BATCH-07-B1..B4` | typed reference DTO -> resolution state -> resolver/fake -> inbound/job read symmetry tests | 100~300 each | contract/domain, reference, consistency |
| `commit-08-a` | `BATCH-08-A1..A3` | page/cursor -> marker/empty/degraded -> read-port and no-write fixtures | 100~300 each | contracts/query DTO, no-write seed |
| `commit-08-b` | `BATCH-08-B1..B4` | Q01~Q06 -> Q07~Q10 -> Q11~Q14 -> Q15~Q19 services/tests | 100~300 each | service-flow, no-write, visibility |
| `commit-08-c` | `BATCH-08-C1..C4` | Q20~Q23 -> Q24~Q28 -> Q29~Q33 -> material/report read tests | 100~300 each | service-flow, material, redaction |
| `commit-09-a` | `BATCH-09-A1..A4` | envelope/header -> receipt store -> dedup/replay -> worker lifecycle/negative tests | 100~300 each | entry-inbound, replay, redaction |
| `commit-09-b` | `BATCH-09-B1..B4` | event envelope -> immutable snapshot/capture -> mapper/collaboration facade -> worker continuation/failure tests | 100~300 each | outbound, replay, redaction |
| `commit-10-a` | `BATCH-10-A1..A4` | job input -> journal/checkpoint -> frozen plan/target -> result/report carriers | 100~300 each | contracts, job protocol, Rustdoc |
| `commit-10-b` | `BATCH-10-B1..B4` | J01~J02 -> J03~J05 -> J06~J07 -> report/terminal tests | 100~300 each | operations replay, checkpoint, no-repair |
| `commit-10-c` | `BATCH-10-C1..C4` | J08 input -> recovery/capture bind -> duplicate/reentry -> failure terminalization tests | 100~300 each | operations replay, TX, idempotency |
| `commit-11-a` | `BATCH-11-A1..A4` | raw schemas -> suite/report builders -> check/pairing/redaction -> evidence index audit | 100~300 each | report generation, no-static, redaction |
| `commit-11-b` | `BATCH-11-B1..B3` | release gate shell -> VETO/handoff drafts -> review/open-issue/risk schema checks | 100~300 each | release smoke, VETO audit, path audit |

### 5.3 Boundary required reads、scope 与提交前置登记

下表是 boundary ledger 的设计期输入。实现 agent 开工时必须把每一项转换为具体文件/章节读取记录；`required_checks` 只是 Step 6 的种子，精确命令、case、evidence contract 在 Step 7 收稳。

| Boundary | Required reads（正式来源） | Allowed scope（设计口径） | Forbidden scope | Required checks seed |
|---|---|---|---|---|
| `commit-01-a` | `03` §3~§4; DDD Step 3~4; Step 3 preread | root Cargo、7 member manifests/skeletons、naming/dependency checks | business DTO、config values、service | fmt;workspace;dependency;Rustdoc path |
| `commit-01-b` | `04` §3~§11; `05` §9/§13; Config Step 6/9 | profile/loader shell、scripts/gates/checks/reports path schema | real run/evidence、business code | config smoke;path;script dry-run |
| `commit-02-a` | `03` §5~§8; DDD Steps 6/8/12 | contracts refs/metadata/errors/shared codec and fixtures | domain truth, adapter, entry | contract check;Rustdoc;codec |
| `commit-02-b` | `03` §6/§10; DDD Steps 6/10/12 | domain state/policy/invariant/error support and pure tests | repository/UoW/config/external truth | domain check;state pairs;body scan |
| `commit-02-c` | `03` §7/§11~§13; DDD Steps 7/9/11/13 | application Ports/repositories/UoW/idempotency/fakes | concrete capability service/entry | app check;TX;idempotency |
| `commit-03-a` | `03` C01~C04 exact sections; DDD Steps 6/8/9/10 | identity/review contract/domain files and pure tests | registry/descriptor/approval | contract-domain;state |
| `commit-03-b` | `03` C05~C08 exact sections; DDD Steps 6/8/9/10 | registry contract/domain/history/visibility files | allowlist/runtime/cache/listing | contract-domain;state/history |
| `commit-03-c` | `03` C01~C08/Q01~Q06 flows; Steps 7/9/11/13 | service, repository fake, same-UoW facade, stored result, trace/capture tests | later descriptor/relation/exposure; query mutation | service-flow;TX;replay;no-write |
| `commit-04-a` | `03` C09~C12/Q07~Q10; DDD Steps 6/8/10 | descriptor/risk/secret-safe contract/domain and tests | provider body/secret value/runtime | contract-domain;redaction |
| `commit-04-b` | `03` adapter Ports/binding; `04` external slots/failure | resolver, controlled/disabled adapter, service/config/API seam | MCP/A2A/API execution;route/quota/cost/retry | service-flow;config;redaction |
| `commit-05-a` | `03` C13~C17/Q11~Q14/I01~I02; DDD Steps 6/8/10 | seam/relation refs/state/guards/body-free tests | approval/Policy truth/method body | contract-domain;responsibility |
| `commit-05-b` | relation service flows/Ports/TX; `04` source bindings | service/UoW/relation repos/controlled resolver/fake | inbound loop/approval mutation/external body | service-flow;TX;redaction |
| `commit-06-a` | `03` C18~C21/Q15~Q19; DDD Steps 6/8/10 | exposure/applicability/visibility contracts/domain | runtime allow/deny/SDK client/cache | contract-domain;state |
| `commit-06-b` | visibility/view flows/Ports; `04` activation rules | view material/resolver/assembler/API facade | query repair/runtime execution/marketplace | service-flow;no-write;binding |
| `commit-07-a` | `03` C22~C23/Q20~Q23/I03; DDD Steps 6/7/9/11/15 | trace/impact/revision/source symmetry and safe tests | raw audit/evidence/backend truth | service-flow;TX;redaction |
| `commit-07-b` | `03` C24~C26/Q29~Q33/I04~I06; reference Steps | typed refs/state/resolver/fake and symmetry tests | external body/downstream truth/string parsing | contract-domain;reference;consistency |
| `commit-08-a` | all Query shared cards; DDD Step 8/9 | page/cursor/marker/read ports/fixtures | new marker kind/query mutation/refresh job | contracts;no-write |
| `commit-08-b` | Q01~Q19 exact flows/ports/states | core query services/assemblers/API query tests | UoW/reserve/capture/query repair | service-flow;no-write;visibility |
| `commit-08-c` | Q20~Q33 exact flows/material sources | extended query/material/report read surfaces | job refresh/event publish/truth repair | service-flow;material;redaction |
| `commit-09-a` | I01~I06 cards/flows; DDD Step 8/9/13/14 | inbound DTO/header gate/receipt/dedup/worker lifecycle | core truth merge/payload body logging | entry-inbound;replay;redaction |
| `commit-09-b` | O01~O10 cards/flows; capture/collaboration Ports | event DTO/snapshot/capture/mapper/facade/continuation | delivery queue/DLQ/retry/transport truth | outbound;replay;redaction |
| `commit-10-a` | J01~J08 cards/flows; DDD Step 6/8/11/13 | job DTO/journal/frozen plan/result/report shell | generic execute/business mutation | contracts;job protocol;Rustdoc |
| `commit-10-b` | J01~J07 exact flows/report/state/TX | target selection/material refresh/report/recovery issue | core truth repair/scope rescan/listing | operations;checkpoint;no-repair |
| `commit-10-c` | J08 flow; replay/TX/error recovery sources | terminalization/replay/capture bind/handoff/export seam | release verdict/blind retry/recursive entry | operations;TX;idempotency |
| `commit-11-a` | `05` §9/§13; `06` §10/§11; evidence calibration | raw/report/index/check builders and audits | static pass/cross-run join/acceptance signoff | report;redaction;dependency;no-static |
| `commit-11-b` | `05` §13/§14; `06` §11~§15 | release smoke/VETO/handoff/risk/open-issue shell | final human verdict/risk auto-acceptance/real signoff | release;VETO;handoff dry-run |

### 5.4 子功能分组与提交时机

同一 boundary 内的子功能只有在共同形成一个可验证增量、共享同一 truth owner、并能由同一组门禁验证时才同提交。表中的“可提交”是未来实现期条件，不是本轮已发生的 commit。

| Boundary | 必须同提交的子功能 | 同提交理由 | 提交时机 | 必须分开的内容 |
|---|---|---|---|---|
| `commit-01-a` | workspace manifest、7 member skeleton、dependency/name checks | 共同形成可预检的工程骨架 | layout、checks 和 diff 均通过后 | profiles、业务 contracts、domain/service |
| `commit-01-b` | config loader shell、script/root contract、path checks | 共同形成 strict tooling/evidence baseline | dry-run 和 path schema 检查通过后 | real run、业务代码、真实 evidence |
| `commit-02-a` | refs、metadata、closed errors、shared codec、Rustdoc fixtures | public carrier 必须与其 kind/error/codec 同步 | contracts/static checks 通过后 | domain truth、Port、adapter |
| `commit-02-b` | state guards、policy/invariant、domain errors、pure tests | 共同形成不依赖 infra 的 domain foundation | state/invariant negative checks 通过后 | UoW、repository、config |
| `commit-02-c` | Ports、repositories、UoW、idempotency、stored result、fakes | application shell 只有整体具备 replay/transaction 语义才可验证 | application/TX checks 通过后 | concrete capability service、entry runtime |
| `commit-03-a` | identity/access-review contract、domain state、pure tests | identity 与 review 的 source/transition 规则同一增量 | contract-domain checks 通过后 | registry and later capability families |
| `commit-03-b` | registry contract、visibility/history rules、pure tests | registry current/history/visibility 必须一起闭合 | contract-domain checks 通过后 | accepted service and query mutation |
| `commit-03-c` | identity/registry service、fake parity、same-UoW facade、stored result、focused tests | 首个 accepted vertical slice 必须同时验证 owner、UoW、replay 和 entry facade | service/TX/replay/no-write checks 通过后 | descriptor/relation/exposure and query repair |
| `commit-04-a` | descriptor/risk/secret-safe contracts、domain guards、redaction tests | body-free descriptor boundary必须从 contract 到 guard 一致 | contract-domain/redaction checks 通过后 | adapter execution and provider truth |
| `commit-04-b` | descriptor resolver、controlled/disabled adapter、service、config/API seam | 外部接入合同只有 resolver、failure mapping 和 config binding齐全才可验证 | service/config/redaction checks 通过后 | MCP/A2A/API execution and delivery lifecycle |
| `commit-05-a` | seam/ref contracts、relation states、body-free guards、negative tests | governance/method relation 的引用和非拥有边界共同构成可验证增量 | contract-domain/responsibility checks 通过后 | approval mutation and method body |
| `commit-05-b` | relation service、UoW/repositories、controlled resolver/fake、service tests | relation accepted path必须同时验证 typed ref、persistence 和 external seam | service/TX/redaction checks 通过后 | worker loop and external body |
| `commit-06-a` | exposure/applicability/visibility contracts、state guards、pure tests | exposure source与visibility semantics必须同一 domain baseline | contract-domain/state checks 通过后 | runtime enforcement and SDK client |
| `commit-06-b` | view material、resolver/assembler、server exposure facade、freshness tests | controlled view需要 source、material、facade 同时闭合 | service/no-write/binding checks 通过后 | query-triggered repair and marketplace |
| `commit-07-a` | trace/impact/revision contracts、source symmetry、safe tests | trace/impact 的 source、revision、capture 对称不可拆成孤立 DTO | service/TX/redaction checks 通过后 | raw audit/evidence backend |
| `commit-07-b` | typed reference contracts、resolution state、resolver/fake、symmetry tests | reference identity、state和resolver missing semantics共同形成 body-free边界 | contract/reference/consistency checks 通过后 | external body and downstream truth |
| `commit-08-a` | page/cursor/marker DTO、read ports、no-write fixtures | 所有 query family 共享的 response contract需先稳定 | contract/query/no-write checks 通过后 | query services and refresh jobs |
| `commit-08-b` | Q01~Q19 services、visibility resolver、assemblers、no-write tests | core query family必须统一 read-only call order和marker来源 | service/no-write/visibility checks 通过后 | Q20~Q33 material/report surfaces |
| `commit-08-c` | Q20~Q33 services、material readers、freshness/redaction tests | extended read surfaces共享 derived/body-free/read-only约束 | service/material/redaction checks 通过后 | job refresh and event publication |
| `commit-09-a` | inbound envelope、header gate、receipt/dedup store、worker lifecycle、tests | inbound replay与receipt owner必须在同一 collaboration seam | entry/replay/redaction checks 通过后 | outbound delivery state and core truth merge |
| `commit-09-b` | outbound event、snapshot/capture、mapper/facade、worker continuation、failure tests | post-commit A/B/C 和 source snapshot必须成套验证 | outbound/replay/redaction checks 通过后 | queue/DLQ/retry/transport truth |
| `commit-10-a` | job DTO、journal/checkpoint、frozen plan、target/result/report carriers | public job surface必须先具备可重放的 typed shell | contract/job/Rustdoc checks 通过后 | job business mutation and release verdict |
| `commit-10-b` | J01~J07 target selection、material refresh、immutable report、terminal tests | derived job family共享 no-truth-repair 与 target terminal semantics | operations/checkpoint/no-repair checks 通过后 | J08 event repair and release |
| `commit-10-c` | J08 recovery、capture bind、reentry/idempotency、terminalization tests | recovery job必须把 failure classification、replay和handoff一起审查 | operations/TX/idempotency checks 通过后 | blind retry, recursive entry, acceptance verdict |
| `commit-11-a` | raw schema、report builders、checks、pairing/redaction/evidence index | evidence provenance只有 raw到report到index全链路才可审计 | report/no-static/redaction/dependency checks 通过后 | human signoff and risk acceptance |
| `commit-11-b` | release smoke、VETO/handoff drafts、review/open-issue/risk schemas | release boundary只提供可审查输入，不改变业务 truth | release/VETO/dry-run checks 通过后 | final verdict, automatic risk acceptance, real signature |

### 5.5 Boundary 开工前设计闭环复核

以下结论是设计者移交前的复核结论。`pass-designed` 表示正式来源和责任边界已给出；它不等于实现期 `Design Gate = pass`。实现 agent 仍须基于当前 design baseline 二次校验。

| Boundary | 字段/DTO/状态 | Port/事务/幂等 | Query/Event/Job/Evidence 专项 | phase boundary | 设计期结论 |
|---|---|---|---|---|---|
| `commit-01-a` | schema不适用；member命名来自 `03` §4 | dependency edge and workspace source closed | artifact materialization deferred to `01-b` | 不写业务对象 | pass-designed |
| `commit-01-b` | config/path schema来自 `04/05`，不新增业务字段 | loader failure path only; no UoW | raw root/report root and no-static contract closed | 不写真实 evidence | pass-designed |
| `commit-02-a` | public ref/metadata/error/carrier source来自 `03` Step 6/8/12；结构体与嵌套字段必须完整英文 Rustdoc | no persistence owner yet | codec and typed-ref kind source must be checked | 不写 capability state | pass-designed |
| `commit-02-b` | 43 object support与state/policy source来自 `03` Step 6/10 | pure domain only; no repository | no query/event/job material | 不读 config/adapter | pass-designed |
| `commit-02-c` | service carrier/stored surface来自 `03` Step 7/11~13 | Port signatures, UoW order, reserve/replay and fake parity must be exact | query/event/job implementations deferred | 不提前接 entry | pass-designed |
| `commit-03-a` | C01~C04 fields, review state and invalid branches source closed | application surface deferred to `03-c` | no query material beyond contract seed | 不写 registry | pass-designed |
| `commit-03-b` | C05~C08 lifecycle/visibility/history source closed | repository methods consumed only in `03-c` | no allowlist/cache/listing inference | 不写 descriptor | pass-designed |
| `commit-03-c` | service inputs/result/receipt/ref source must map 1:1 to `03` flows | same-UoW, expected-version, idempotency and stored result closed | Q read surface is no-write; trace/capture only declared side effects | no later family | pass-designed |
| `commit-04-a` | descriptor/risk/secret-safe fields and enum variants source closed; nested fields documented | domain only | redaction source in `05` must be linked | no provider body | pass-designed |
| `commit-04-b` | adapter descriptor input/output and failure variants source closed | resolver/service/fake uses declared Ports and config binding | no external execution/report | no route/quota/cost owner | pass-designed |
| `commit-05-a` | relation/ref/safe summary fields and body-free marker source closed | domain relation transitions only | inbound types are source contracts, not worker loop | no approval/method body | pass-designed |
| `commit-05-b` | relation service DTO/result/receipt source closed | UoW, relation repo and controlled resolver parity required | I01/I02 worker entry deferred to `09-a` | no external truth mutation | pass-designed |
| `commit-06-a` | exposure/applicability/visibility state source closed | domain guards only | view material deferred to `06-b`; no runtime decision | no SDK client | pass-designed |
| `commit-06-b` | view fields, freshness/degraded marker and exposure source map closed | resolver/read material/service calls exact Ports | J02 only read input; no job implementation | no query repair | pass-designed |
| `commit-07-a` | trace/impact/revision/capture fields source closed | transaction and source symmetry from `03` Step 11/13/15 | redaction and observation are safe projections, not truth | no evidence verdict | pass-designed |
| `commit-07-b` | typed ref kind, resolution state, sidecar and empty/missing semantics closed | resolver/fake/durable parity and version rules closed | I04~I06 source contracts only; J07 later | no external body | pass-designed |
| `commit-08-a` | shared page/marker/empty schema source closed | read ports only; no UoW/reserve | Query no-write call order closed | no new marker kind | pass-designed |
| `commit-08-b` | Q01~Q19 DTO/view/marker mapping source closed | resolver-first, read-only and fake/durable parity | no refresh/rebuild/event | no mutation from query | pass-designed |
| `commit-08-c` | Q20~Q33 material/report view fields and safe markers source closed | read material ports and source version rules closed | report read only; no job repair | no event publish | pass-designed |
| `commit-09-a` | inbound envelope/receipt/rejection fields source closed | typed receipt save/get, dedup key and UoW order closed | header-first, body-free and replay behavior closed | no core truth merge | pass-designed |
| `commit-09-b` | event payload/snapshot/capture/intent fields source closed | capture and collaboration Port outcomes/fake parity closed | A/B/C, post-commit failure and redaction closed | no delivery lifecycle | pass-designed |
| `commit-10-a` | all public Job input/result/journal/report carriers source closed; every public field/variant/payload requires Rustdoc | journal/UoW/idempotency surface closed before runner | job report is typed and replayable | no generic execute | pass-designed |
| `commit-10-b` | J01~J07 target/plan/report fields and terminal variants closed | target selection/checkpoint/report persistence closed | no truth repair; no nested Command | no release verdict | pass-designed |
| `commit-10-c` | J08 recovery/error/terminalization fields source closed | commit resolution, replay and capture bind source closed | handoff/export is safe seam only | no recursive entry/blind retry | pass-designed |
| `commit-11-a` | machine artifact JSON schema and evidence index fields source closed in `05/06` | no business UoW; builder input provenance closed | raw/report/digest/pairing/redaction/no-static closed | no acceptance verdict | pass-designed |
| `commit-11-b` | release/VETO/handoff/risk/open-issue fields source closed in `06` | no mutation of business truth | human review and signoff are downstream contracts | no real signoff | pass-designed |

### 5.6 Commit boundary 经验复核

经验复核依据 `设计真相源闭环与可落码性标准.md` §九。每行列出当前 boundary 的设计面、适用项、不适用项及证据位置；不适用不是省略，而是明确排除理由。设计者在移交前负责完成，设计修复后必须重复核；实现 agent 只做二次校验并回报差异。

| Boundary | 涉及设计面 | 适用经验项与结论 | 明确不适用理由 | 证据位置 | 处理/责任 |
|---|---|---|---|---|---|
| `commit-01-a` | workspace/dependency/path | path baseline、typed-ref owner scope、phase boundary: pass-designed | state/idempotency/query/event/job/evidence不写业务实现 | `03` §3~§4、Step 3~4 | 设计者复核；实现前再读 |
| `commit-01-b` | config/artifact path | config binding、artifact materialization、machine artifact schema、phase boundary: pass-designed | domain truth、history、query marker、job report未进入本 boundary | `04` §3~§11、`05` §9/§13 | 设计者复核；脚本实际运行留给实现期 |
| `commit-02-a` | contracts/ref/error/codec | support carrier、typed-ref kind、ref identity、DTO/Rustdoc: pass-designed | repository/UoW、projection、outbox、job terminalization尚未实现 | `03` §5~§8; DDD Steps 6/8/12 | 设计者复核；缺口 `wait_design` |
| `commit-02-b` | domain/state/policy | 字段、状态、factory、public target、body-free boundary: pass-designed | metadata/idempotency、query/read model、event capture、artifact builder不适用 | `03` §6/§10; DDD Steps 6/10/12 | 设计者复核；纯领域边界 |
| `commit-02-c` | ports/UoW/repository/idempotency | Port/repository、transaction、metadata、idempotency、fake parity: pass-designed | concrete query/event/job protocol和report material尚未进入 | `03` §7/§11~§13 | 设计者复核；实现前确认签名 |
| `commit-03-a` | identity/review command/state | field、DTO、state、validation truth、history source: pass-designed | registry service、query no-write、outbound capture、job report不属于 contract/domain边界 | `03` C01~C04; Steps 6/8/9/10 | 设计者复核 |
| `commit-03-b` | registry command/state/history | field、state、current/history、visibility、ref identity: pass-designed | runtime allowlist、cache、listing、job repair不适用且被禁止 | `03` C05~C08; Steps 6/8/9/10 | 设计者复核 |
| `commit-03-c` | accepted command/query/service/TX | DTO source map、same-UoW、idempotency/replay、stored result、history/capture、query no-write: pass-designed | descriptor/relation/exposure、inbound/outbound/job/evidence builder属于后续 boundary | `03` C01~C08/Q01~Q06; Steps 7/9/11/13 | 设计者复核；缺口回写 `03` |
| `commit-04-a` | descriptor/body-free/redaction | field、DTO、state、secret-safe ref、redaction: pass-designed | provider execution、route/quota/cost/retry、job/projection不适用 | `03` C09~C12; `05` redaction | 设计者复核 |
| `commit-04-b` | adapter/config/failure | config binding、adapter failure outcome、typed ref、body-free snapshot: pass-designed | external transport lifecycle、publisher/job/report不适用 | `03` adapter binding; `04` external slots | 设计者复核；selected product仍 deferred |
| `commit-05-a` | governance seam/method relation | relation field/state、ref identity、body-free/redaction、owner separation: pass-designed | approval truth、method body、outbound delivery、job report不适用 | `03` C13~C17/I01~I02 | 设计者复核 |
| `commit-05-b` | relation service/inbound source | DTO source map、Port/UoW、stored receipt precursor、validation truth: pass-designed | worker lifecycle、external body、approval mutation明确禁止 | `03` relation flows/Ports/TX | 设计者复核 |
| `commit-06-a` | exposure/visibility/state | field/state、visibility applicability、source-symmetric guard、phase boundary: pass-designed | query material、runtime enforcement、SDK client/cache不适用 | `03` C18~C21; Steps 6/10 | 设计者复核 |
| `commit-06-b` | view/material/query/exposure | query visibility、material source、public read-model identity、no-write、config binding: pass-designed | refresh job、event publish、marketplace listing不适用 | `03` Q15~Q19/J02 input; `04` activation | 设计者复核 |
| `commit-07-a` | trace/impact/capture/redaction | accepted subject identity、history/trace、source symmetry、redaction、metadata: pass-designed | acceptance evidence、observer backend truth、job report不适用 | `03` C22~C23/I03; Step 15 | 设计者复核 |
| `commit-07-b` | references/resolution/inbound source | ref identity、typed sidecar version、resolver return symmetry、missing/degraded/consistency: pass-designed | external body、downstream truth、job execution不适用 | `03` C24~C26/Q29~Q33/I04~I06 | 设计者复核 |
| `commit-08-a` | query shell/read port | query response、page empty seed、marker source、no-write call order: pass-designed | truth mutation、projection rebuild、event/job lifecycle不适用 | `03` Query cards; Step 8/9 | 设计者复核 |
| `commit-08-b` | core query/projection read | query visibility、material degraded mapper、public read identity、no-write、fake/durable parity: pass-designed | UoW/reserve/capture/query repair被明确排除 | `03` Q01~Q19; `05` query cuts | 设计者复核 |
| `commit-08-c` | extended query/material/report read | projection lookup、material source、redaction、artifact/report read-only: pass-designed | job refresh、event publish、truth repair不适用 | `03` Q20~Q33; `05` derived/report cuts | 设计者复核 |
| `commit-09-a` | inbound/receipt/worker | entry context、stored receipt typed save/get、idempotency/dedup、header-first、redaction: pass-designed | outbound capture、local delivery state、core truth owner merge不适用 | `03` I01~I06; Step 13/14 | 设计者复核 |
| `commit-09-b` | outbound/event/capture/worker | immutable snapshot、capture source、adapter outcome、post-commit、redaction、replay: pass-designed | local queue/DLQ/retry/transport truth、new truth mutation不适用 | `03` O01~O10; Step 15 | 设计者复核 |
| `commit-10-a` | job public protocol/journal | public job surface、job schema/Rustdoc、journal/checkpoint、idempotency/replay: pass-designed | target business mutation、report builder execution、release verdict不适用 | `03` J01~J08; Step 11/13 | 设计者复核 |
| `commit-10-b` | derived/material/reconciliation jobs | maintenance job output、projection rebuild input、terminalization、no-truth-repair、policy summary: pass-designed | event repair J08、acceptance/report release不适用 | `03` J01~J07; Step 9/11/12 | 设计者复核 |
| `commit-10-c` | recovery/event/report job | commit resolution、replay、capture bind、adapter outcome、safe terminalization: pass-designed | blind retry、recursive entry、final human verdict不适用 | `03` J08; Step 12 error/recovery | 设计者复核 |
| `commit-11-a` | evidence/raw/report/check | machine artifact schema、artifact materialization、same-run pairing、redaction、no-static、provenance: pass-designed | business state/Port/UoW、human signoff不适用 | `05` §9/§13; `06` §10/§11 | 设计者复核；真实 run 未产生 |
| `commit-11-b` | release/VETO/handoff/review | evidence completeness、VETO source、handoff provenance、risk schema、phase closure: pass-designed | final verdict、risk auto-acceptance、real signature由 `06`/验收方负责 | `06` §11~§15 | 设计者复核；不生成 signoff |

### 5.7 粒度判断与 boundary 停审

| Boundary | 一句话描述 | 粒度 | 可独立 review | 可独立验证/回退 | 停审结论 |
|---|---|---|---|---|---|
| `commit-01-a` | 七 member workspace and dependency skeleton | 适中 | 是 | 是 | pass-designed |
| `commit-01-b` | strict config/script/evidence path baseline | 适中 | 是 | 是 | pass-designed |
| `commit-02-a` | public contract foundation | 适中 | 是 | 是 | pass-designed |
| `commit-02-b` | domain state/policy foundation | 适中 | 是 | 是 | pass-designed |
| `commit-02-c` | application Port/UoW/idempotency shell | 适中偏大，已拆四批 | 是 | 是 | pass-designed |
| `commit-03-a` | identity/access-review contract/domain | 适中 | 是 | 是 | pass-designed |
| `commit-03-b` | registry contract/domain | 适中 | 是 | 是 | pass-designed |
| `commit-03-c` | identity/registry accepted service slice | 适中偏大，服务与前置面同 boundary | 是 | 是 | pass-designed |
| `commit-04-a` | descriptor/risk/secret-safe contract/domain | 适中 | 是 | 是 | pass-designed |
| `commit-04-b` | external adapter descriptor service seam | 适中偏大，已拆四批 | 是 | 是 | pass-designed |
| `commit-05-a` | governance/method relation contract/domain | 适中 | 是 | 是 | pass-designed |
| `commit-05-b` | relation service/controlled resolver seam | 适中偏大，已拆四批 | 是 | 是 | pass-designed |
| `commit-06-a` | exposure/visibility contract/domain | 适中 | 是 | 是 | pass-designed |
| `commit-06-b` | controlled view/server exposure service | 适中偏大，已拆四批 | 是 | 是 | pass-designed |
| `commit-07-a` | trace/impact service foundation | 适中偏大，已拆四批 | 是 | 是 | pass-designed |
| `commit-07-b` | canonical reference resolver/service | 适中偏大，已拆四批 | 是 | 是 | pass-designed |
| `commit-08-a` | shared query/read contract foundation | 适中 | 是 | 是 | pass-designed |
| `commit-08-b` | core capability query surfaces | 适中偏大，按 query family 拆批 | 是 | 是 | pass-designed |
| `commit-08-c` | trace/reference/directory/material queries | 适中偏大，按 query family 拆批 | 是 | 是 | pass-designed |
| `commit-09-a` | inbound receipt/intake worker seam | 适中偏大，按 lifecycle 拆批 | 是 | 是 | pass-designed |
| `commit-09-b` | outbound snapshot/capture collaboration seam | 适中偏大，按 A/B/C 拆批 | 是 | 是 | pass-designed |
| `commit-10-a` | public Job protocol/journal foundation | 适中 | 是 | 是 | pass-designed |
| `commit-10-b` | derived/material/reconciliation jobs | 适中偏大，按 job family 拆批 | 是 | 是 | pass-designed |
| `commit-10-c` | recovery/replay/event job | 适中偏大，按 terminal/replay 拆批 | 是 | 是 | pass-designed |
| `commit-11-a` | raw/report/evidence audit builders | 适中偏大，按 builder/check 拆批 | 是 | 是 | pass-designed |
| `commit-11-b` | release smoke and acceptance handoff shell | 适中 | 是 | 是 | pass-designed |

### 5.8 跨 boundary 审计

| 审计项 | 结论 | 说明 |
|---|---|---|
| boundary coverage | pass-designed | 26 个 boundary 覆盖 PH-01~PH-11；每个都有稳定 ID、目标和批次 |
| dependency order | pass-designed | PH-01 -> PH-07 线性闭环，PH-08/PH-09 共享 PH-07 基线后汇合 PH-10 |
| commit-03-c correction | pass-designed | identity/registry accepted service vertical slice 独立存在，不与 registry domain boundary 混淆 |
| task/batch mapping | pass-designed | 每个 `IMPL-*` 至少对应一个 boundary；每个 boundary 有 3~4 个批次种子 |
| scope leakage | pass-designed | runtime execution、tools execution、approval truth、method body、marketplace、provider truth、SDK client/cache均被排除 |
| query no-write | pass-designed | Query contract、service、test和后续 material/job 分离；不得从 Query 触发 UoW/reserve/repair |
| event ownership | pass-designed | local snapshot/capture 与 external collaboration 分开；不引入 delivery queue/DLQ/retry truth |
| job ownership | pass-designed | Job 只处理 frozen plan、derived/material/report/recovery；不修核心 truth、不隐式触发 Command |
| evidence ownership | pass-designed | PH-01 只建路径合同，PH-11 才汇总真实 raw/report；不跨 run、不静态 passed |
| Rustdoc coverage | pass-designed | 每个未来 public declaration、struct field、enum variant/payload、trait/method/callable均受门禁覆盖；嵌套字段注释不可遗漏 |
| fake/durable parity | pass-designed | 每个需要持久化的 boundary 都要求 fake 与 declared Port/UoW/missing/conflict 语义一致 |
| batch size | pass-designed | 单批目标 100~300 行，>300 拆分，>500 禁止；高风险 TX/idempotency/redaction/evidence 独立批次 |
| test duplication/gap | pending Step 7 | Step 6 只有 checks seed；精确 TC/DS/EV owner 由 Step 7 完成 |
| implementation ledger timing | pass-designed | 真实 implementation ledger 与 26 个 skeleton 延迟至 T068/T069，不伪造执行记录 |
| unresolved upstream design blocker | 0 | 当前未发现需要回写 `00~06` 的设计 blocker；目标仓缺失是 implementation prerequisite |

## 6. 回填草稿

> 校准来源：
> - `design-calibration/07_implementation_plan_step_06_tasks_commit_boundaries.md` §5.1~§5.8

正式 `07-实施计划.md` §6 应承接以下稳定结论：PH-01~PH-11 共拆为 26 个候选 commit boundary。每个 boundary 以可验证能力增量描述，拥有 `IMPL-*` 任务、`BATCH-*` 编写顺序、required reads、allowed/forbidden scope、required checks、同提交子功能、Commit Gate、Handoff Gate 和设计者经验复核。写入顺序固定为 `contracts -> domain -> application -> infra/fake -> entry -> targeted tests/evidence`；report/evidence boundary 按 `raw schema -> parser/builder -> audit` 顺序执行。

`commit-03-c` 必须保持独立，专门承载 identity/registry accepted service vertical slice；不能把服务、same-UoW、stored result、trace/capture 或 facade 退回 `commit-03-b`，也不能由实现 agent临时并入后续 descriptor/relation/exposure。每个 boundary 的设计闭环结论仅表示设计期可移交；实现期必须重新通过 Design/Scope/Worktree/Build/Test/Evidence/Commit/Handoff Gate。任何字段、DTO、Port、状态、mapper、config、evidence schema或phase boundary缺口都必须 `wait_design` 并回写 owning source。

本 Step 不创建真实 implementation commit、run、artifact、report、evidence、acceptance verdict、risk acceptance或signoff；T068/T069 在正式 `07` 完成后创建预实施台账和 26 个 planned skeleton。

## 7. 待确认事项与进入 Step 7 条件

| 事项/条件 | 状态 | 处理 |
|---|---|---|
| 26 个 boundary ID、phase 归属和顺序稳定 | pass-designed | 后续 Step 7~13不得无受控回写改变；新增/拆分需同步 formal 07 和 ledger skeleton |
| 每个 phase 有实施任务 | pass-designed | `IMPL-01-*`~`IMPL-11-*` 已列 |
| 每个 boundary 有批次、scope、required reads、提交时机 | pass-designed | §5.2~§5.4 已列 |
| 每个 boundary 有字段/DTO/状态/Port/证据/phase 闭环复核 | pass-designed | §5.5 已列；实现前仍需二次校验 |
| 每个 boundary 有经验复核及不适用理由 | pass-designed | §5.6 已列；blocker必须回写标准/设计 |
| 每个 boundary 有停审与跨 boundary 审计 | pass-designed | §5.7~§5.8 已列 |
| 精确 TC/DS/EV、suite、gate、check、command 尚未绑定 | pending Step 7 | 下一步逐 boundary 映射，不在本 Step 猜执行结果 |
| 目标实现仓 | implementation prerequisite | `/home/aris/Projects/quantalithos-capability-hub` established; historical prerequisite resolved |
| commit required now | authorized_pending_repair_anchor | commit only the capability-hub design repair; no implementation commit or PH-02 activation |

## 8. Step 6 完成记录

| 项目 | 状态 |
|---|---|
| Step 6 设计产物 | completed_continuous_execution; historical prerequisite facts synchronized |
| phase task coverage | 11/11 |
| boundary coverage | 26/26 |
| boundary closure review | 26/26 `pass-designed`；无 unresolved upstream design blocker |
| experience review | 26/26 已记录适用项与不适用理由 |
| implementation facts | 0；未声明代码、测试、run、evidence、commit或signoff |
| next step | Step 7 测试与验收门禁嵌入 |
