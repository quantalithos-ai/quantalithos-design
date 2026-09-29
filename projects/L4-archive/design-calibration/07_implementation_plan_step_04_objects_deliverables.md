# Step 4. 抽取实施对象与交付物

> 对应 SOP：`standards/document/实施计划讨论流程_SOP.md` Step 4
> 日期：2026-09-14
> 状态：`completed / planned_surface_closed / continue_authorized`

## 1. Step 状态与开工确认

| 项 | 结论 |
|---|---|
| 当前 Step | Step 4：抽取实施对象与交付物 |
| 输入 | Step 3 前置条件与阅读矩阵；正式 `03-详细设计.md` §4～§16；正式 `04/05/06` |
| 输出 | 按功能交付面的实施对象表、交付物表、非交付物表和跨仓交付边界 |
| 已读取专项材料 | `03_ddd_step_04_units_file_layout.md`、`03_ddd_step_05_module_contracts.md`、`03_ddd_step_06_object_contracts.md`、`03_ddd_step_07_trait_port_adapter_contracts.md`、`03_ddd_step_08_protocol_contracts.md`、`03_ddd_step_16_test_cuts.md`；`05` §3/§9/§13；`06` §5～§10 |
| 当前模式 | `full-restart / single-agent-serial / continuous_authorization` |
| gate_status | `pass_with_blockers`（允许继续 Step 5；不授权创建实现仓或写代码） |
| gate_reason | 交付面可由正式 03/05/06 追溯；目标仓、durable/external seam、真实脚本和证据仍未具备，相关交付保持 planned/blocked |
| next_allowed_action | `create_and_complete_step_05_phases_dependencies` |

## 2. Step 内计划

- [x] 从正式 03 的六个技术 role 与八个 application service 提取实施交付面。
- [x] 按功能纵切区分 code、protocol、persistence、config、test、script、evidence 和文档同步。
- [x] 建立 26 objects、30/32 surfaces、18 states、55 keys、102 TC、19 EV 的承接索引，不复制完整 schema。
- [x] 为每个交付面指定来源、未来落点、完成判定上限和 blocker。
- [x] 建立 source-authority matrix，显式标明 `L1-workspace=Auxiliary`。
- [x] 列出禁止交付物、跨仓交付和实现仓不存在时的处理。
- [x] 完成回填草稿、自检并同步 flow/project ledger。

复杂度判断：对象数量大但交付判断按“功能交付面”收敛；使用 role 表、能力交付表、证据交付表和非交付表四块，不把 26 个对象拆成 26 个实施阶段。

## 3. SOP 问题回答

| 问题 | 回答 | 依据 |
|---|---|---|
| 本轮新增/修改哪些代码模块？ | 未来目标仓的 `contracts`、`domain`、`application`、`infra`、`api`、`worker` 六个 role；只实施正式 03 已确认的文件和依赖方向。 | `03` §4～§5；Step 4 calibration |
| 哪些协议/作业/适配器属于交付？ | 3 Command、5 Query、5 Inbound Consumer、17 Operations Job 的 typed DTO/handler/runner；7 business/local port families 的 contract、controlled/fail-closed adapter seam。 | `03` §7～§8、§16；`05` §3 |
| 哪些测试必须交付？ | 18 CUT 对应的测试切口、102 个唯一 TC、26 个逻辑 DS、13 suites 的实现入口；真实执行和 EV instance 不在本 Step 形成。 | `05` §3/§6/§7/§9/§13 |
| 哪些配置/脚本/报告属于交付？ | 12 domain/55 P0 key 的严格绑定代码、14 planned scripts 的参数/路径能力、raw/report 生成能力；真实配置值、secret、run 和报告实例不交付。 | `04` §7～§11；`05` §9/§13 |
| 哪些上游对象不应成为 Archive 交付？ | identity、conversation、work、process、governance、artifact、workspace、observability 的业务真相、正文、授权和后端；只交付 typed ref/material/decision/receiver seam。 | `00` §11～§12；`01` §5/§8；`03` §1 |
| 哪些交付物跨仓？ | 仅通过 runtime/event/ref/adapter/fake 的协作合同和 handoff 记录；Core contracts 是唯一待核验 compile candidate。不存在跨仓代码提交或共享数据库交付。 | `03` §3/§13；`06` §6/§7 |
| 如何判定完成？ | 以当前 boundary 的代码/测试/证据门禁为准；`planned` 不等于 implemented，fake 不等于 formal，静态 report 不等于 EV。 | 实施计划规范 §4.6/§4.7.2；`06` §3/§10 |

## 4. 当前材料问题诊断

| 问题 | 影响 | 处理 |
|---|---|---|
| 旧 README/草稿按 snapshot/index/provider 描述交付 | 会把 historical 对象、供应商和期限带入实现面 | 只保留为 historical；按当前 CP/role/port 重新抽取 |
| 26 对象容易被误写成 26 个独立任务/提交 | 失去纵切和事务闭环，导致测试/回退不可审查 | 对象只作为交付内容，阶段按可验证能力拆分 |
| external adapter 与 local contract 混在同一完成判定 | fake 结果可能冒充 owner/storage finality | 将 local/controlled/formal 交付成熟度分层，正向 external 保持 blocked |
| 证据脚本可能被误认为已生成证据 | 会产生静态 EV 或 readiness 污染 | 交付“脚本能力/索引壳”与“真实 fixed-run EV”分开 |
| `L1-workspace` 投影易被当成 canonical | 会破坏 source-authority matrix | 所有交付表固定 `WorkspaceProjection/Auxiliary`，不提供 fallback |

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 理由 |
|---|---|---|---|
| 交付组织 | 以对象/文件罗列 | 以六 role + 功能交付面 + 验证交付面组织 | 便于形成可验证 phase |
| 外部能力 | 可能被写成 provider implementation | typed slot、controlled double、formal seam 三态 | 保留 fail-closed |
| 测试/证据 | “补测试、出报告”泛化 | exact CUT/TC/DS/suite/script/EV 分母与成熟度 | 可审查、可回溯 |
| 跨仓关系 | sibling repo 名称可能成为 package 依赖 | 关系类型单独列出，只有 Core candidate 可编译期核验 | 防止依赖倒置 |

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 按 26 对象逐项交付 | 易统计 | 事务、协议、测试被拆散，无法形成纵切 | 不采用 |
| 按六 CP 各建独立服务 | 直观 | CP 是能力轴，不是 crate/部署边界 | 不采用 |
| 按六 role + 功能纵切交付 | 与 03 文件和依赖一致，可绑定测试门禁 | 需要跨 role 的 boundary 表 | 采用 |
| 先交 provider，再补本地契约 | 可能快速看到外部调用 | provider/authority 未闭合且会污染 domain | 禁止 |

## 7. 结构化中间产物

### 7.1 六 role 实施对象面

| role | planned 落点 | 实施对象/能力 | 允许依赖 | 完成判定上限 |
|---|---|---|---|---|
| `contracts` | `crates/contracts` | 2 个跨层正式对象、typed refs/context、3C/5Q/5E/17J DTO、safe views、receipt/report/error | 仅核验 Core symbols | local contract tests；不含 owner schema |
| `domain` | `crates/domain` | 24 个 Archive-owned 对象、18 状态、多轴不变量、纯 factory/transition | `contracts` | domain tests；不含 I/O/config/provider |
| `application` | `crates/application` | 8 services、7 port families、UoW、reservation/result、claim/checkpoint、effect orchestration | `domain` + `contracts` | controlled service-flow；durable/external blocked |
| `infra` | `crates/infra` | store/adapter slots、config reader、runtime builder、typed failure mapping、fake/controlled registration | application/domain/contracts | binding/availability tests；不选 provider |
| `api` | `crates/api` | 3 Command、5 Query 薄 handler、safe response/disposition mapping | application/contracts | entry/no-write tests；不绑定 HTTP/RPC |
| `worker` | `crates/worker` | 5 Consumer、17 Job、claim/fence/checkpoint、bounded runner/shutdown | application/contracts；composition 使用 infra | entry/replay tests；不创建 outbound publisher |

### 7.2 功能交付面

| 交付面 | 具体内容 | 正式来源 | 未来落点 | 当前状态/上限 |
|---|---|---|---|---|
| admission/coordination | request、job、stage、operation context、reservation、完整 stored result | `03` §5.2/§7.1/§8.2/§10～§12 | contracts/domain/application | local planned；不代表业务批准 |
| source capture | 8 source class binding、selector、version/fence、coverage、finding、partial/stale/missing/conflicting | `03` §7.3/§7.5；`05` AUTHORITY | application/infra/worker | owner positive blocked |
| Bundle closure | bundle/manifest/entry/closure、declared-vs-actual exact set、immutable revision、seal guard | `03` §7.4/§9/§10 | domain/application | local closure planned；不由 storage 推导 |
| assessment | verification/compatibility assessment、fixed input、typed finding、target isolation | `03` §7.2/§8.3/§9 | domain/application/infra | algorithm/key/schema pending |
| placement/lifecycle | placement/retrieval、governance decision binding、intent/effect/correlation、probe/reconcile | `03` §7.3/§8.5/§9～§12 | application/infra/worker | external commit blocked |
| restore | request/plan/item/material/handoff/outcome/compensation、per-owner isolation | `03` §7.5/§8.5/§9～§12 | domain/application/worker | receiver blocked |
| safe query | 5 no-write Query、visibility、provenance、page/cursor、degraded/NotAvailable | `03` §7.2/§8.3/§14；`05` QUERY | api/application | cursor/visibility pending |
| config/runtime | 12 domains/55 keys、required slot freeze、strict source/assembly/failure/redaction | `04` §3～§11 | infra | values/provider absent |
| test/evidence | 18 CUT、102 TC、26 DS、13 suites、5 gates、14 scripts、19 EV family | `05` §3/§6/§9/§13 | tests/scripts/reports | all instances 0 |

### 7.3 26 对象的交付分组索引

| 分组 | 对象范围 | 交付要求 | 不得推导 |
|---|---|---|---|
| CP1 request/job | `DeclaredArchiveScope`、`ArchiveRequest`、`ArchiveJob`、`ArchiveJobStageRecord` | admission、stage、reservation、replay 具备同源输入 | 不推导 project lifecycle |
| CP2 source | `ArchiveSourceBinding`、`CaptureAttempt`、`CaptureCoverage`、`SourceCaptureFinding` | 每 source typed authority、version/fence/coverage | 不以 workspace 补 canonical |
| CP3 bundle | `ArchiveBundle`、`BundleManifest`、`ManifestEntry`、`ManifestClosure`、`ClosureFinding` | exact closure、revision、seal basis | 不以 storage/verification 反推 closure |
| CP4 assessment | `VerificationAssessment`、`CompatibilityAssessment`、`VerificationFinding` | fixed target/input、Unknown/Unsupported/IntegrityFailed | 不私造算法/digest/signature |
| CP5 lifecycle | `ArchivePlacement`、`GovernanceDecisionRef`、`LifecycleExecution`、`ExternalActionRecord` | intent-before-effect、typed outcome、独立状态轴 | 不决定 retention/hold/delete |
| CP6 restore | `RestoreRequest`、`RestorePlan`、`RestoreItem`、`RestoreHandoff`、`HandoffOutcome`、`CompensationRecord` | owner-specific material/handoff/outcome | 不直接写 owner DB 或推导 restored |

### 7.4 Source-authority matrix（实施交付边界）

| source class | 真相 owner | Archive 允许交付 | Archive 禁止交付 | formal 前姿态 |
|---|---|---|---|---|
| identity | `L1-identity` | typed snapshot/export/ref、version/fence/coverage binding | identity schema、成员真相、授权 | blocked (`AR-UP-001`) |
| conversation | `L1-conversation` | owner-approved material/ref | conversation 正文/索引 | blocked (`AR-UP-001`) |
| work | `L1-work` | lifecycle/source ref、restore receiver seam | archived/dissolved/restored 决定 | blocked (`AR-UP-002`) |
| process | `L1-process` | process source material/ref | process 状态或执行权 | blocked (`AR-UP-001`) |
| governance | `L1-governance` | current decision/hold/delete opaque ref | policy、期限、风险接受裁决 | blocked (`AR-UP-003`) |
| artifact | `L1-artifact` | artifact ref、approved material/lineage ref | Artifact 正文/血缘真相 | blocked (`AR-UP-006`) |
| workspace | `L1-workspace` | `WorkspaceProjection` 标为 `Auxiliary` | canonical fallback、owner replacement | blocked (`AR-UP-008`) |
| observability | `L4-observability` | 脱敏 audit/evidence material/ref | audit chain/backend truth | blocked (`AR-UP-007`) |

### 7.5 测试、脚本和证据交付面

| 交付类型 | exact 分母/路径 | 未来完成判定 | 当前限制 |
|---|---|---|---|
| test cuts | 18 CUT、102 `TC-AR-*`、26 `DS-AR-*` | 每个 boundary 有可发现测试入口与 negative coverage | 未执行，实例为 0 |
| suites/gates | 13 suites、5 gates | 脚本能按 profile/run 参数执行并返回非零失败 | scripts 尚未创建 |
| scripts | `scripts/gates`（5）、`scripts/reports`（3）、`scripts/checks`（6） | 参数、root、redaction、link、blocked lane 语义可检查 | 不生成静态 pass |
| raw artifacts | `artifacts/test/<run_id>` | 真实 runner 写 `context/case/suite/evidence-index` | 当前无 run/artifact |
| reports | `reports/runs/<run_id>`、`reports/acceptance`、`reports/review` | 只从同 run raw 生成，人/Agent 审查 acceptance | 当前无 report/EV |
| formal handoff | 19 EV families、10 VETO、06 package | fixed-run、owner closure、具名 review 后才可送验 | 所有 formal lane blocked |

### 7.6 非交付物与跨仓出口

| 非交付物 | owning project/边界 | 处理 |
|---|---|---|
| owner canonical truth、正文、授权和状态 | 各 L1 truth owner / governance | 只记录 typed ref/material/decision/receiver seam；缺失即 blocked |
| provider SDK、对象存储产品、KMS/secret truth、压缩/codec 产品 | 基础设施/security/records owner | 只交付 adapter slot 与 typed outcome；不选产品 |
| outbound event/outbox/publisher/topic/delivery | `L0-bus`/Archive architecture；`AR-HLD-Q-001` | 当前完全不交付；若解锁必须回退 02～06 |
| SDK client/cache、UI、marketplace、runtime/tools/sandbox | 下游产品/runtime owner | 不建 crate、不加依赖 |
| 部署 runbook、容量/RTO/RPO、真实验收签署 | 未来运维/06 | 只留 planned 输入，不生成实例 |

## 8. 回填草稿

正式 `07` §4 应说明：实施对象按六 role 和功能纵切组织；26 对象、8 service、7 port、30/32 surface、18 state 是可追溯交付分母而非任务列表；交付包含 typed contract/domain/application/infra/api/worker、测试/脚本/报告能力及受控 seam；所有 source authority、workspace Auxiliary、owner restore、governance、provider、SDK、outbound、UI 和真实验收均列为非交付或 blocked；每项完成判定受对应 boundary gate 与证据成熟度约束。

## 9. 待确认事项与事实边界

| 事项 | 影响 | 当前姿态 |
|---|---|---|
| target repo / source baseline | 全部 code 交付 | absent；只能 planned/blocked |
| Core contract exports/lock | contracts 编译闭环 | pending；由 PH-01 核验 |
| source/decision/material/receiver contracts | CP2/CP5/CP6 正向交付 | 12 upstream blockers 保持开放 |
| codec/cursor/durable store/config values/telemetry | local production parity | 6 local pending 保持开放 |
| scripts/report/evidence actual output | 05/06 handoff | planned capability only；实例 0 |

## 10. 自检与进入下一步条件

- [x] 交付面按功能而非按对象/文件拆分。
- [x] 六 role、26 objects、8 services、7 ports、30/32、18 states 和测试/证据分母可回溯。
- [x] source-authority matrix 区分 owner truth、workspace Auxiliary、artifact/evidence material。
- [x] compile/runtime/event/ref/adapter/fake 分类未被交付表混淆。
- [x] 非交付物、跨仓出口和 outbound blocked 边界明确。
- [x] 完成判定没有使用实现、测试或 evidence 事实。
- [x] 连续授权允许 Step 5；implementation/test/commit 仍禁止。

`gate_status = pass_with_blockers`; `next_allowed_action = create_and_complete_step_05_phases_dependencies`。
