# Step 5. 设计实施阶段与依赖顺序

> 对应 SOP: `standards/document/实施计划讨论流程_SOP.md` Step 5
> 回填章节: `07-实施计划.md` §5 实施阶段与依赖顺序

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 5 设计实施阶段与依赖顺序 |
| 当前状态 | 已完成,按用户授权自动进入后续 Step |
| 输入基线 | Step 4 交付物清单、新版 `03/05/06`、implementation handoff、flow / state / persistence / test / acceptance 输入 |
| 输出文件 | `projects/L1-identity/design-calibration/07_implementation_plan_step_05_phases_dependencies.md` |
| 正式文档状态 | 本 Step 不修改正式 `07-实施计划.md` |
| 停审方式 | 自动停审:PH 阶段、依赖顺序、可验证增量和跨 phase 审计已列出;commit boundary 留给 Step 6 |

## 2. 本步目标

把 Step 4 的交付物组织为按依赖推进的阶段化可验证功能增量,并解释为什么必须按这个顺序实施。

本 Step 只回答:

- 最小可运行 / 可测试纵切是什么。
- 哪些阶段必须先于其他阶段。
- 每个 phase 完成后能验证什么。
- 哪些 phase 可以局部并行,哪些不能并行。
- 每个 phase 是否含有后续 phase 才会提供的对象、协议、flow、状态或证据依赖。

本 Step 不定义 commit boundary、BATCH、具体代码批次、测试命令、run id、提交 message 或正式 `07` 正文。

## 3. 本步输入

| 输入 | 状态 | 本 Step 用途 |
|---|---|---|
| `07_implementation_plan_step_04_deliverables.md` | 已完成 | 提供代码、协议、状态、测试、脚本、报告、配置和非交付物清单 |
| `03-详细设计.md` §16 | 已装配 | 提供 implementation handoff、开工前检查和可落码审计输入 |
| `03_ddd_step_17_implementation_handoff.md` | 已完成 | 提供 implementable contract inventory、阅读矩阵和 `07` boundary audit 输入 |
| `03_ddd_step_05_module_contracts.md` | 已完成 | 提供 workspace crate 依赖方向和模块职责 |
| `03_ddd_step_08_protocol_contracts.md` | 已完成 | 提供 Command / Query / Consumer / Outbound / Job 协议族依赖 |
| `03_ddd_step_09_function_flows.md` | 已完成 | 提供 command/query/consumer/outbound/job flow 顺序和 cross-flow audit |
| `03_ddd_step_10_state_matrix.md` | 已完成 | 提供状态迁移 owner、query no-write、job no-repair 和 terminal/replay 边界 |
| `03_ddd_step_11_persistence_transaction_consistency.md` | 已完成 | 提供 logical store、version、UoW、stored replay 和 fake parity 依赖 |
| `03_ddd_step_16_test_cuts.md` | 已完成 | 提供最小测试切口和分层验证入口 |
| `05-测试方案.md` | Draft / Step 15 assembled | 提供 P0 blocking suite、gate 图、scripts、TC / EV 映射 |
| `06-验收标准.md` | 已审核通过 | 提供 EV、AC、VETO、evidence integrity 和 acceptance report 依赖 |
| 实施计划 SOP / 书写规范 | 当前标准 | 决定 phase 粒度、可验证增量和跨 phase 审计输出 |

## 4. 模块计划 / 模块目录

| 模块 | 目标 | 输入 | 输出 | 停审门禁 |
|---|---|---|---|---|
| M1 阶段拆分原则 | 固定 phase 不按对象 / 文件拆,而按可验证功能增量拆 | SOP Step 5、书写规范 §3.1~§3.2、Step 4 | 阶段设计原则 | 不提前写 commit boundary;不写单对象 phase |
| M2 候选阶段与依赖图 | 从交付物和 flow 依赖抽出 PH-01~PH-08 | Step 4、Step 9 cross-flow、Step 10 state audit | 阶段依赖图和阶段总表 | 每个 phase 至少有一个可验证门禁 |
| M3 可验证增量说明 | 为每个 PH 写功能增量、输入、输出、不包含和验证方式 | `03/05/06` | PH 可验证增量表 | 每个 phase 不依赖未来 phase 的正式 surface 才能停审 |
| M4 阶段顺序理由和并行性 | 说明为什么按该顺序推进,哪些可局部并行 | 模块依赖、protocol/flow/state/persistence/test 依赖 | 依赖理由和并行性表 | 不能让 entry/job/evidence 先于 contracts/service/fake surface |
| M5 Phase 停审与跨 phase 审计 | 检查对象 / 协议 / 状态 / 事务 / 测试 / evidence 闭环 | Step 17 handoff、`05/06` | Phase 停审记录和跨 phase 审计表 | blocker 不得标通过;未定义 commit boundary 不得伪装完成 |
| M6 回填与影响判定 | 形成正式 `07` §5 回填草稿和后续 Step 影响 | 本 Step M1~M5 | 回填草稿、影响判定、进入下一步条件 | Step 6 才拆 commit boundary |

### 4.1 模块停审记录

| 模块 | 结论 | 说明 |
|---|---|---|
| M1 | 通过 | 阶段按可验证功能增量拆分,不是按文件 / 对象拆分 |
| M2 | 通过 | PH-01~PH-08 覆盖 workspace、contracts/domain、application/infra、command、query、consumer、operations、entry/config、evidence/release |
| M3 | 通过 | 每个 PH 均列出功能增量、输入、输出、不包含和验证方式 |
| M4 | 通过 | 依赖顺序从 compile surface 到 service/fake,再到 entry/job/evidence |
| M5 | 通过 | Phase 停审和跨 phase 审计未发现必须回写的 blocker |
| M6 | 通过 | 回填草稿只写阶段与依赖,不写 commit boundary 或 BATCH |

## 5. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 最小可运行或可测试的纵切是什么? | 最小纵切不是完整业务入口,而是 PH-02 的 contracts/domain/state 可编译可测基座,再到 PH-03 的 application/infra fake/UoW/idempotency 基座。第一个业务可验证纵切是 PH-04 command write path。 |
| 哪些阶段必须先于其他阶段? | workspace / dependency / contracts 必须先于 domain/application;application port/UoW/fake 必须先于 command/query/consumer/job;service flows 必须先于 API/worker/jobs entry;lower suite 必须先于 release/evidence。 |
| 哪些风险或跨仓依赖需要前置? | 编译期依赖 boundary、workspace 迁移、body-free public contracts、idempotency/stored replay、fake parity 和 config fail-fast 需要前置。真实产品 selected-run 不阻塞 P0。 |
| 每个阶段完成后能验证什么? | PH-01 验证 workspace/dependency skeleton;PH-02 验证 contracts/domain/state;PH-03 验证 application ports/UoW/fake parity;PH-04 验证 command accepted/rejected/duplicate;PH-05 验证 query no-write/read model;PH-06 验证 consumer/callback/outbound material;PH-07 验证 operations job/report replay/no truth repair;PH-08 验证 entry/config/scripts/evidence/release closure。 |
| 是否存在按对象拆分而不可验证的阶段? | 不采用。对象族只作为 phase 内交付物,不单独形成“实现全部对象”这类 phase。 |
| 哪些阶段可以并行,哪些不能并行? | PH-02 内 contracts 与 domain 可按 crate 并行但必须同一状态/typed ref 口径;PH-04~PH-06 可在 PH-03 后按不同 flow family 局部并行;PH-07 依赖 outbox/handoff/reference/projection foundations,不能先于 PH-04~PH-06;PH-08 必须在 lower suite surface 可运行后收口。 |
| 每个 phase 是否有明确功能增量、输入、输出、测试门禁和验收门禁? | 是,见 §9.3。具体 GATE 编号留 Step 7;本 Step 只列门禁类型和 suite/EV/AC/VETO 方向。 |
| 每个 phase 是否包含只能由后续 phase 提供的对象、协议、flow、状态或证据? | 当前阶段表按依赖排序避免该问题。若 Step 6 拆 commit boundary 时发现某 boundary 依赖后续才实现的 surface,必须调整 boundary 或回写设计。 |
| 所有 phase 完成后依赖顺序、风险前置、外部依赖和验收覆盖是否通过跨 phase 审计? | 当前通过。P0 只依赖 formal port / fake / controlled / disabled parity;真实产品 selected-run 留 Step 8 / Step 9 residual。 |

## 6. 当前文档问题诊断

| 位置 | 当前问题 | 本 Step 处理 |
|---|---|---|
| Step 4 交付物 | 交付物已列出,但尚未排序 | 本 Step 转为 PH-01~PH-08 依赖链 |
| `03` implementation handoff | 明确要求按 phase / boundary 审计,但未定义 phase | 本 Step 定义 phase,Step 6 再拆 boundary |
| `05` suite 图 | PR/main/nightly/release gate 有顺序,但未绑定实施 phase | 本 Step 将 lower suite 和 release/evidence 分阶段 |
| 状态 / persistence / idempotency | 依赖 application port/fake 基座,不能晚于业务 flow 才补 | PH-03 前置 |
| Entry / jobs / scripts | 容易过早实现 shell,但缺 application facade 和 stored report 时不可验证 | PH-07~PH-08 后置 |
| P1 / P2 real-like | 可能被误设为 P0 phase | 本 Step 不设 P0 phase;后续 Step 9 记录 residual |

## 7. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 实施组织 | 只有交付物清单 | 8 个 PH 阶段和依赖顺序 | 交付物需要可执行顺序 |
| 最小纵切 | 不明确 | PH-02/PH-03 打基座,PH-04 成为首个业务写链纵切 | command write path 依赖 typed refs、state、ports、UoW、fake |
| Query / consumer / job 顺序 | 容易并列 | query 在 command 后,consumer/outbound 在 command/query 后,job 在维护/传播 surface 后 | 避免 query rebuild、consumer hidden create、job no-report |
| Evidence 交付 | 可能最后临时补 | PH-08 专门收口 scripts/report/evidence/release | `05/06` 要求 raw artifact/report pairing |
| 真实产品能力 | 可能混入阶段 | 不设 P0 phase | P0 只验 formal seam 和 fake/controlled parity |

## 8. 设计取舍

| 议题 | 可选方案 | 取舍 |
|---|---|---|
| 是否先做全部 contracts/domain | A. 全部对象一次性;B. contracts/domain/state 作为可测试基座 | 采用 B。PH-02 必须可跑 `contract-domain-fast` 子集,不是无限扩大对象清单 |
| 是否先实现 API/worker/job shell | A. 先入口;B. 先 application facade / fake runtime | 采用 B。入口层必须经 facade,否则会诱导绕过 ports / UoW / stored replay |
| 是否把 query 与 command 同阶段 | A. 同阶段;B. command accepted write path 先,query no-write 后 | 采用 B。query 需要 stable projection/read/visibility surface,不能反向创建 truth |
| 是否把 consumer 与 command 同阶段 | A. 同阶段;B. consumer/callback 在 command/read 基座后 | 采用 B。consumer 需要 receipt replay、reference sidecar、target missing no-create 和 outbox material |
| 是否把 operations job 早做 | A. 早做 runner;B. 待 projection/reference/outbox/handoff/report surface 后 | 采用 B。job no-repair、stored report replay 和 item refs 依赖前序 surface |
| 是否把 evidence 脚本最后做 | A. 最后补;B. 最终 phase 专门收口,但 Step 7 提前嵌入 boundary | 采用 B。PH-08 收口正式脚本/report/evidence,Step 7 仍会把门禁嵌入各 boundary |

## 9. 结构化中间产物

### 9.1 阶段依赖图: L1-identity 实施阶段顺序

```text
[PH-01 workspace / dependency / skeleton]
  | enables compile and crate boundaries
  v
[PH-02 contracts / domain / state foundation]
  | enables typed protocol and domain invariant tests
  v
[PH-03 application ports / UoW / fake runtime foundation]
  | enables service flow and repository parity tests
  v
[PH-04 command write path vertical slices]
  | produces accepted truth, trace, outbox, stale, stored result
  v
[PH-05 query / read model / visibility slices]
  | proves read-only consumption and degraded surfaces
  v
[PH-06 inbound / callback / outbound material slices]
  | proves receipt replay and accepted-only propagation material
  v
[PH-07 operations job / propagation / maintenance slices]
  | proves job report replay, no truth repair, publish/deliver/retry
  v
[PH-08 entry / config / scripts / evidence release closure]
  | proves API/worker/jobs entry, config redline, reports and acceptance handoff
```

关键说明:

- 图表达阶段依赖顺序,不表达函数调用链。
- 每个 phase 后续在 Step 6 拆 commit boundary。
- GATE 编号留 Step 7;本 Step 只绑定 suite / EV / AC / VETO 方向。
- PH-08 不是“最后才测试”;前序每个 phase 都有测试门禁。PH-08 收口正式 gate runner、report generator、evidence index 和 release smoke。

### 9.2 阶段总表

| 阶段编号 | 阶段名称 | 实施目标 | 依赖阶段 | 核心交付物 | 阶段门禁方向 |
|---|---|---|---|---|---|
| PH-01 | Workspace / dependency / skeleton | 建立可编译 workspace、crate、dependency boundary 和空入口骨架 | 无 | root Cargo、7 crate skeleton、allowed dependency declaration、basic lint/format hooks | compile / format / dependency boundary early check |
| PH-02 | Contracts / domain / state foundation | 落 public refs/DTO shell、domain truth/state/policy 和状态 transition helper | PH-01 | contracts DTO/ref/view/job shell、domain objects、formal state enums/helpers | `contract-domain-fast`;`EV-ID-CONTRACT-001`;`EV-ID-STATE-001` |
| PH-03 | Application ports / UoW / fake runtime foundation | 落 application port surface、UoW/id/clock/idempotency/stored replay scaffold、infra fake parity | PH-02 | `ports.rs`、result/idempotency helpers、fake repositories/adapters/runtime | `infra-runtime-fake`;`EV-ID-IDEMP-001`;config smoke subset |
| PH-04 | Command write path vertical slices | 落 6 Command accepted/rejected/duplicate/conflict 写链 | PH-03 | command DTO mapping、command service、truth save、trace/audit/outbox/stale/effect/stored result | `service-flow-fast`;`EV-ID-CMD-001`;VETO-ID-001/004 |
| PH-05 | Query / read model / visibility slices | 落 14 Query visibility-first、stable lookup、no-write 和 degraded surface | PH-04 | query service、read visibility resolver、member summary/projection read、query views | `service-flow-fast`;`EV-ID-QUERY-001`;VETO-ID-002 |
| PH-06 | Inbound / callback / outbound material slices | 落 5 Consumer/Callback、typed receipt replay、reference sidecar、10 accepted-only outbound material | PH-05 | worker-facing consumer services、receipt envelopes、outbox payload markers、source/reference handling | `entry-worker-job`;`operations-replay-core` subset;`EV-ID-CONSUMER-001`;`EV-ID-OUTBOX-001` |
| PH-07 | Operations job / propagation / maintenance slices | 落 6 Operations Job、stored job report replay、projection/reference/report maintenance、publish/deliver/retry | PH-06 | maintenance/propagation services、job report assembly、outbox/handoff state updates、jobs runner | `operations-replay-core`;`entry-worker-job`;`EV-ID-JOB-001`;VETO-ID-005 |
| PH-08 | Entry / config / scripts / evidence release closure | 收口 API/worker/jobs entry,config redline,gate/report/check scripts,release smoke,evidence and acceptance handoff | PH-07 | entry binaries、runtime config、scripts/gates/reports/checks、artifact/report writers、acceptance reports | `config-redline`;`dependency-boundary`;`redaction-boundary`;`report-generation-audit`;`release-main-smoke`;all EV/VETO |

### 9.3 PH-01 可验证增量说明

| 项 | 内容 |
|---|---|
| 功能增量 | 从旧单 crate reality 迁移到可编译 Rust workspace skeleton,建立 crate dependency boundary 和唯一编译期 sibling dependency 口径 |
| 输入 | Step 3 前置检查、Step 4 file layout、Step 5 module contracts、目录组织规范、Rust 规范 |
| 输出 | root `Cargo.toml`、7 个 crate skeleton、API/worker/jobs binary skeleton、workspace dependency shape、basic README / module docs |
| 不包含 | 业务 DTO 字段、domain object、application service、repository implementation、entry handler、测试证据正式生成 |
| 验证方式 | workspace compile / format、manifest dependency scan、crate naming scan、no architecture-level code name leak |
| 停审门禁 | workspace 形态与 Step 4 file layout 一致;非 core sibling business compile dependency 不存在 |

### 9.4 PH-02 可验证增量说明

| 项 | 内容 |
|---|---|
| 功能增量 | 建立 public contracts、domain truth/state/policy 和正式状态 helper,使 contracts/domain/state 可独立测试 |
| 输入 | Step 6 object contracts、Step 8 protocol shell、Step 10 state matrix、Step 16 module/command test cuts |
| 输出 | typed refs、metadata、command/query/event/job/view/receipt/error shell、domain truth objects、state enum、policy/guard、domain errors |
| 不包含 | application orchestration、repository/UoW、adapter、entry handler、stored replay implementation |
| 验证方式 | `contract-domain-fast` 子集: DTO roundtrip、body-free schema、domain factory invariant、state transition guard |
| 停审门禁 | public contracts 不依赖 domain/application/infra;domain 不依赖 application/infra/entry;状态名与 Step 10 一致 |

### 9.5 PH-03 可验证增量说明

| 项 | 内容 |
|---|---|
| 功能增量 | 建立 application-owned port surface、UoW、id/clock/cursor、idempotency/stored replay scaffold 和 fake runtime parity,为 flow 实现提供可测底座 |
| 输入 | Step 7 port contracts、Step 11 persistence semantics、Step 13 idempotency input、Step 16 infra/runtime cuts |
| 输出 | `ports.rs`、operation context factory、UoW manager、cursor assigner、id generator、idempotency helpers、stored result repository shell、fake repositories/adapters/runtime |
| 不包含 | 6 Command 全部业务 flow、14 Query、consumer/callback、operations job body、entry HTTP/worker/job runner 完整实现 |
| 验证方式 | `infra-runtime-fake` 子集: version/unique/rollback/stored replay/reference/projection/outbox/handoff fake parity |
| 停审门禁 | fake 使用正式 port surface;不得 private map 补 lookup;query/job 后续不会需要未定义 port 才能落码 |

### 9.6 PH-04 可验证增量说明

| 项 | 内容 |
|---|---|
| 功能增量 | 落 6 Command 的 write path,证明 accepted/rejected/duplicate/conflict 可通过 same-UoW 写入 truth、trace/audit/outbox/stale/effect/stored result |
| 输入 | PH-02~PH-03、Step 8 command protocols、Step 9 command flows、Step 10 truth states、Step 11 transaction order |
| 输出 | command service、command DTO mapping、domain policy orchestration、truth repository usage、accepted effect/stored result、command tests |
| 不包含 | query read model完整入口、worker consumer、job runner、release evidence scripts |
| 验证方式 | `service-flow-fast` command family;`EV-ID-CMD-001`;redaction scan subset;VETO-ID-001/004 representative evidence |
| 停审门禁 | duplicate replay 不重跑 mutation;high-risk lifecycle missing basis 不 accepted;accepted side effects 同 UoW |

### 9.7 PH-05 可验证增量说明

| 项 | 内容 |
|---|---|
| 功能增量 | 落 14 Query 和 read model / visibility surface,证明 query 只读、visibility-first、stable lookup、missing/not-visible/degraded/stale/empty priority 正确 |
| 输入 | PH-04、Step 8 query protocols、Step 9 query flows、Step 7 read/projection/reference/report ports、Step 10 read/projection states |
| 输出 | query service、read visibility resolver usage、summary/projection/reference/report/outbox/handoff read surface、query no-write tests |
| 不包含 | consumer/callback mutation、outbox publish、projection rebuild、reference refresh、reconciliation generation |
| 验证方式 | `service-flow-fast` query family;`EV-ID-QUERY-001`;write-audit no-write evidence |
| 停审门禁 | query missing/stale 不 rebuild / refresh / repair;not visible 不泄漏 existence;no UoW / idempotency / stored result write |

### 9.8 PH-06 可验证增量说明

| 项 | 内容 |
|---|---|
| 功能增量 | 落 5 Inbound Event Consumer / Callback 和 10 Outbound material,证明 source/callback 处理、receipt replay、reference sidecar、accepted-only outbox material 与 body-free payload 成立 |
| 输入 | PH-04~PH-05、Step 8 inbound/outbound protocols、Step 9 consumer/callback/outbound flows、Step 11 reference/outbox semantics |
| 输出 | consumer service、callback handling、typed receipt envelope、reference sidecar update、outbox payload marker、outbound material tests |
| 不包含 | publisher job、handoff delivery job、retry job、release gate scripts |
| 验证方式 | `entry-worker-job` consumer subset;`operations-replay-core` outbox material subset;`EV-ID-CONSUMER-001`;`EV-ID-OUTBOX-001`;redaction checks |
| 停审门禁 | unsupported/delayed/quarantined 不写 accepted marker;duplicate receipt replay 不重跑 payload;outbound material 只来自 accepted facts |

### 9.9 PH-07 可验证增量说明

| 项 | 内容 |
|---|---|
| 功能增量 | 落 6 Operations Job、maintenance / propagation services、stored job report replay、projection/reference/report maintenance、publish/deliver/retry no truth repair |
| 输入 | PH-06、Step 8 job protocols、Step 9 operations job flows、Step 10 projection/reference/report/outbox/handoff/job states、Step 11 stored job report semantics |
| 输出 | maintenance service、propagation service、job report assembly/repository、job runner facade、outbox/handoff update,projection/reference/report job handling |
| 不包含 | final release evidence handoff、P1 selected-run、production schedule/backoff productization |
| 验证方式 | `operations-replay-core`;`entry-worker-job` job subset;`EV-ID-JOB-001`;`EV-ID-IDEMP-001`;VETO-ID-005 |
| 停审门禁 | duplicate job reads stored report;job body no rerun;reconciliation report-only;publish/deliver failure does not rollback accepted truth |

### 9.10 PH-08 可验证增量说明

| 项 | 内容 |
|---|---|
| 功能增量 | 收口 API/worker/jobs entry、runtime config/profile、gate/report/check scripts、run-scoped artifacts/reports、evidence index、acceptance handoff 和 release smoke |
| 输入 | PH-07、`04` config design、`05` automation/evidence、`06` acceptance gates、Step 3 scripts/artifact/report path rules |
| 输出 | API/worker/jobs binaries ready for formal gates、runtime builder/config redline,gate/report/check scripts,release smoke,redaction/dependency/report audit,evidence index,acceptance reports |
| 不包含 | real-like selected-run as P0、production capacity、UI/dashboard、runbook |
| 验证方式 | `config-redline`;`dependency-boundary`;`redaction-boundary`;`report-generation-audit`;`release-main-smoke`;all EV / VETO evidence references |
| 停审门禁 | no `latest`;raw artifact/report pairing complete;static evidence pass impossible;VETO checklist can be generated from fixed run evidence |

### 9.11 阶段顺序理由表

| 顺序 | 理由 |
|---|---|
| PH-01 before all | workspace / dependency / crate boundary 是任何 Rust code 和 dependency check 的前置 |
| PH-02 before PH-03 | application ports and fake runtime need typed refs、state enums、domain errors and public DTO shell |
| PH-03 before PH-04 | command flow needs UoW/id/clock/repository/idempotency/stored result and fake parity |
| PH-04 before PH-05 | read models / query surface need accepted truth and projection stale/effect surfaces to be meaningful |
| PH-05 before PH-06 | consumer/callback missing/no-create and outbound visibility/read effects require query/read/visibility boundary clarity |
| PH-06 before PH-07 | operations publish/retry/deliver jobs need saved outbox/handoff/reference/receipt material from command/consumer/callback |
| PH-07 before PH-08 | release/evidence closure needs all lower service, entry, job and report surfaces to generate actual artifacts |

### 9.12 并行性与禁止并行表

| Phase | 可局部并行 | 不可并行 / 禁止前置 |
|---|---|---|
| PH-01 | crate skeleton、manifest、basic module docs 可并行 | 不得在 skeleton 未固定时写业务 implementation |
| PH-02 | contracts DTO shell 与 domain policy 可并行,但需共享 typed ref/state vocabulary | 不得让 domain 依赖 application/infra |
| PH-03 | application port traits 与 infra fake implementation 可按 port family 并行 | fake 不得先私造 port 或 lookup |
| PH-04 | 6 Command 可按业务族分批并行,共享 command discipline | 不得在 UoW/stored replay scaffold 未完成前落 accepted write path |
| PH-05 | query family 可按 core/read/maintenance/propagation read 分批 | 不得在 command truth/read basis 未完成前做 synthetic query |
| PH-06 | consumer/callback 与 outbound material 可在 shared receipt/outbox marker 后并行 | 不得让 worker 直连 store 或让 outbound material 来自 query/job |
| PH-07 | rebuild/refresh/reconcile/publish/deliver/retry 可按 service family 分批 | 不得让 job runner 在 application facade 前直连 repo/adapter |
| PH-08 | scripts、entry binaries、report generation 可分流 | 不得用静态 pass 或缺 raw artifact 的 report 进入 acceptance |

### 9.13 Phase 停审记录

| Phase | 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|---|
| PH-01 | 是否只建立 workspace/dependency/skeleton,不写业务 schema | 通过 | 无 |
| PH-02 | contracts/domain/state 是否可独立验证且不依赖未来 application/infra | 通过 | 无 |
| PH-03 | application port/fake/UoW/idempotency 是否为后续 flow 提供正式 surface | 通过 | 无 |
| PH-04 | command write path 是否不依赖未来 query/consumer/job/evidence | 通过 | 无 |
| PH-05 | query/read surface 是否只读且不依赖未来 rebuild/refresh/job | 通过 | 无 |
| PH-06 | consumer/callback/outbound material 是否不依赖未来 publisher job 成功 | 通过 | publish/deliver 正式执行留 PH-07 |
| PH-07 | operations job 是否只维护 projection/reference/report/outbox/handoff/report,不修 core truth | 通过 | release evidence 留 PH-08 |
| PH-08 | final gate/evidence 是否等待 lower suite 和 job surface 完成 | 通过 | 无 |

### 9.14 跨 phase 依赖闭环审计表

| 审计项 | 结论 | 缺口 / 修正 |
|---|---|---|
| phase 是否按可验证功能增量组织 | 通过 | 未按对象 / 文件拆 phase |
| contracts/domain/application/infra 依赖方向 | 通过 | PH-01~PH-03 前置 crate boundary 和 port/fake foundation |
| protocol / flow 依赖 | 通过 | command -> query -> consumer/outbound -> operations job 顺序与 Step 9 flow 依赖一致 |
| state / persistence / idempotency 依赖 | 通过 | PH-02~PH-03 前置状态、UoW、version、stored replay |
| query no-write | 通过 | PH-05 专门验证,且不依赖 PH-07 rebuild/refresh |
| job no truth repair | 通过 | PH-07 专门验证,依赖前序 material / report surface |
| body-free / redaction | 通过 | PH-02 起即纳入 contract body-free;PH-08 release redaction 收口 |
| dependency boundary | 通过 | PH-01 前置,PH-08 release check 收口 |
| evidence / report integrity | 通过 | 前序 suite 逐步产物化,PH-08 生成 final report/audit/acceptance |
| P1/P2 误入 P0 | 通过 | 真实产品 selected-run、capacity、UI、runbook 不设 P0 phase |
| 是否存在必须回写设计的 phase blocker | 通过 | 当前未发现;Step 6 boundary 细拆时继续审计 |

## 10. 对上游 / 下游文档的影响判定

| 结论 | 是否影响上游 / 下游 | 影响类型 | 处理状态 |
|---|---|---|---|
| 当前 phase 顺序未新增设计契约 | 否 | 承接 `03/05/06` | 无需回写 |
| PH-01~PH-08 将成为 Step 6 commit boundary 的父级 | 是 | 下游实施计划结构 | Step 6 按 phase 拆 boundary |
| GATE 编号和测试门禁尚未正式定义 | 是 | Step 7 输入 | Step 7 绑定 suite / EV / AC / VETO |
| 配置、环境和 external dependency 将由 PH-08 收口但需更细准备 | 是 | Step 8 输入 | Step 8 继续拆 profile / adapter / artifact roots |
| P1/P2 / residual 仍需记录 | 是 | Step 9 输入 | Step 9 分类风险和待确认 |
| 正式 `07` §5 待回填 | 是 | Step 13 正式装配 | 本 Step 只提供回填草稿 |

## 11. 回填草稿

> 校准来源:
> - `design-calibration/07_implementation_plan_step_05_phases_dependencies.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“模块计划 / 模块目录”“阶段依赖图”“阶段总表”“PH-xx 可验证增量说明”“阶段顺序理由表”和“跨 phase 依赖闭环审计表”小节,了解实施阶段如何从交付物清单、详细设计 flow/state/persistence 和测试验收门禁收敛。

正式 `07-实施计划.md` §5 应回填:

- 本轮实施分为 PH-01~PH-08 八个阶段。
- PH-01 建立 workspace / dependency / skeleton。
- PH-02 建立 contracts / domain / state foundation。
- PH-03 建立 application ports / UoW / fake runtime foundation。
- PH-04 落 command write path vertical slices。
- PH-05 落 query / read model / visibility slices。
- PH-06 落 inbound / callback / outbound material slices。
- PH-07 落 operations job / propagation / maintenance slices。
- PH-08 收口 entry / config / scripts / evidence release closure。
- 各阶段按 workspace -> contracts/domain -> application/infra -> command -> query -> consumer/outbound -> operations job -> release/evidence 依赖推进。
- 真实产品 selected-run、production capacity、UI/dashboard 和 runbook 不作为 P0 phase。

## 12. 待确认事项

| 待确认事项 | 影响 | 当前处理 |
|---|---|---|
| 目标实现仓旧单 crate 迁移成本是否要求单独 phase | 影响 PH-01 / Step 6 commit boundary | 当前 PH-01 覆盖 skeleton / migration readiness;Step 6 再细拆 |
| PH-04 command 是否需要再按业务族拆子阶段 | 影响 commit boundary 粒度 | Step 6 拆 commit boundary 时决定 |
| PH-06 consumer/callback 与 outbound material 是否合阶段过大 | 影响 Step 6 boundary | 当前为同一 phase,Step 6 可拆多个 boundary |
| PH-07 operations job 是否需要按 maintenance / propagation 分两个 phase | 影响阶段粒度 | 当前合为 PH-07,因为都依赖 job report replay;Step 6 可细拆 |
| Report generator 是否应更早实现最小壳 | 影响 Step 7 / Step 8 | Step 7 嵌入门禁时可前置最小 report shell,但 PH-08 才 final closure |

## 13. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| 阶段依赖图已列出 | 通过 | 见 §9.1 |
| 阶段总表已列出 | 通过 | 见 §9.2 |
| 每个 phase 有可验证增量说明 | 通过 | 见 §9.3~§9.10 |
| 阶段顺序理由已说明 | 通过 | 见 §9.11 |
| 并行性与禁止前置已说明 | 通过 | 见 §9.12 |
| Phase 停审已完成 | 通过 | 见 §9.13 |
| 跨 phase 依赖审计已完成 | 通过 | 见 §9.14 |
| 未提前定义 commit boundary / BATCH | 通过 | 留给 Step 6 |
| 可进入 Step 6 | 通过 | 下一步:拆分阶段任务、编写顺序与提交边界 |
