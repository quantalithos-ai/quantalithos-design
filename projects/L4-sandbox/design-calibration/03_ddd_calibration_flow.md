# L4-sandbox 03 详细设计全量重启校准流程

> 创建日期: 2026-07-08
> 状态: completed_current_closeout_v7.9
> 当前模式: full-restart / targeted DesignReopen regression
> 设计仓: `/home/aris/Projects/quantalithos-design`
> 项目目录: `projects/L4-sandbox`
> 正式文档目标: `projects/L4-sandbox/03-详细设计.md`
> 项目级台账: `design-calibration/project_execution_ledger.md`
> 本轮口径: 正式 `00-需求文档.md`、`01-架构设计.md`、`02-概要设计.md` 是当前详细设计直接上游；Step 6~10 DesignReopen、Step 11~18 定向回查和 Step 19 重装配均已完成设计静态收口。正式 `03-详细设计.md` 已恢复为 current 设计基线；原始旧版 `03`、README 和本文被 EOF override 覆盖的中间恢复快照只作 historical material。

---

## 1. 文档级恢复点

| 当前 Step | 当前模块 | gate_status | gate_reason | next_allowed_action | source_files |
|---|---|---|---|---|---|
| Step 19 | `current_formal_reassembly` | completed_design_static_only | Step 6~10 回归、Step 11~18 定向回查、actor authority 修复和正式 `03` 重装配均已完成；无新 L1/L2 blocker。 | 固定设计 baseline 后关闭 `CB-SBX-01A` activation prerequisites；不得据此进入实现、测试或验收。 | `03_ddd_step_19_formal_document_assembly.md`;`03-详细设计.md`;`project_execution_ledger.md`;`implementation_execution_ledger.md`;`/tmp/L4-sandbox_design_reopen_accelerated_execution_plan.md` |

---

## 2. 执行纪律

本流程只负责 `L4-sandbox` 的 `03-详细设计.md` full-restart。执行时必须按详细设计 SOP 一个 Step 一个 Step 推进。

固定纪律:

- 每次恢复先读取 `project_execution_ledger.md`,再读取本文档,再读取当前 Step 文件。
- 正式 `03-详细设计.md` 只在 Step 19 `整理正式详细设计文档` 时重建;Step 1~18 不改正式 `03`。
- 旧 `README.md`、旧 `03-详细设计.md`、旧 `05-测试方案.md`、旧 `06-验收标准.md` 和缺失的 `04/07` 只能在当前 Step 独立结论形成后做差异审计或下游缺口登记,不得作为新版详细设计真相源直接继承。
- flow 可以一次列出 Step 1~19,但不得提前创建尚未到达的 Step 中间产物文件。
- 当前 Step 文件必须记录 Step 开工确认、Step 内计划、SOP 问题回答、旧材料诊断、取舍、结构化中间产物、回填草稿、待确认事项和进入下一步条件。
- Step 7回归按完整current产物停审；同一产物内的A/B/C/D任务连续执行，每项完成后立即更新`/tmp`计划。L1主流程写到exact可落码，L2保障只写最小契约，L3过程只写Gate轮廓；安全关键异常不得降级。
- 每次用户确认只推进一个当前 Step;不得跨 Step 合并。
- 详细设计必须以模块实现契约为主轴;Step 5 以后按模块 / 协议族 / 接口 / 状态机小循环推进,不得退回全仓总表式生成。
- 详细设计阶段不得写实施排期、commit boundary、真实 run_id、真实 evidence alias、真实测试结果、验收签署或实现完成结论。
- 对 `L4-sandbox` 必须持续闭合 execution environment identity、resource limits、filesystem / network / process boundary、tool/runtime launch policy execution、artifact capture、observability hooks、failure classification、cleanup / lease / reaper、security redlines。
- 不得把 tools semantic execution、runtime agent loop、member lifecycle orchestration、artifact truth、observability store 或 policy definition / approval / allowlist / capability truth 混进 sandbox。
- 单次写入以 100~300 行为宜;该限制只约束单次 patch / 写入批次,不限制 Step 文件或正式文档最终长度。

---

## 3. 权威输入与处理口径

| 输入 | 当前状态 | 本轮使用方式 |
|---|---|---|
| `projects/L4-sandbox/00-需求文档.md` | current_reviewed_baseline | 作为详细设计需求边界,承接 execution isolation truth ownership、C-SBX-1~5、FR / BR / AC / VF、数据归属、接口依赖、NFR 和零容忍红线。 |
| `projects/L4-sandbox/01-架构设计.md` | current_architecture_baseline_reviewed_for_03_start | 作为详细设计架构边界,承接独立 truth center、依赖方向、数据所有权、一致性分层、运行承载、fail-closed、capture / handoff 分层、cleanup guard 和 redline containment。 |
| `projects/L4-sandbox/02-概要设计.md` | current_formal_baseline_reviewed_for_03_start | 作为详细设计直接输入,承接代码主体框架、6 个主要组成部分、关键对象轮廓、6 类接口骨架、关键处理流、6 组状态机、异常边界、配置影响和回退规则。 |
| `projects/L4-sandbox/design-calibration/02_hld_step_12_detailed_design_handoff.md` | current_explanatory_input | 用于理解 `02` 如何把稳定输入移交给 `03`;若与正式 `02` 冲突,以正式 `02` 为准。 |
| `projects/L4-sandbox/design-calibration/02_hld_step_13_risks_open_questions.md` | current_explanatory_input | 用于识别 `03/04/05/06/07` 仍需闭口的风险和待确认事项;不得替代正式 `02`。 |
| `projects/L4-sandbox/03-详细设计.md` | current_formal_baseline_v7.9 | 已从 Step 6~18 current source 完成 Step 19 重装配；current port、actor authority 与 `30 / 31 / 39` 状态库存已闭合。 |
| `projects/L4-sandbox/04-配置设计.md` | current_formal_baseline_v7.9 | 已完成受影响配置 owner、binding、validator 和禁止配置化边界的定向重验。 |
| `projects/L4-sandbox/05-测试方案.md` / `06-验收标准.md` | current_formal_baseline_v7.9 | 已完成设计清单与验收映射的定向重验；测试未执行，验收仍 `NotEntered`。 |
| `projects/L4-sandbox/07-实施计划.md` | current_formal_baseline_v7.9 | Step 13、implementation ledger 和 32 件 planned boundary skeleton 已完成设计静态装配；不构成实现授权，`CB-SBX-01A` 仍为 `blocked / activation_gate / wait_design`。 |

---

## 4. Step 总任务表

| Step | 输出文件 | 主题 | 状态 | gate_status | next_allowed_action | 完成门禁 |
|---:|---|---|---|---|---|---|
| 1 | `03_ddd_step_01_upstream_boundary.md` | 确认概要设计输入边界 | historical_reviewed_unaffected_input | retained_for_regression | 只作为当前回归的已确认上游输入读取。 | 原完成内容未被本次粒度问题影响。 |
| 2 | `03_ddd_step_02_scope.md` | 明确本轮实现范围和非范围 | historical_reviewed_unaffected_input | retained_for_regression | 只作为当前回归的已确认范围输入读取。 | 原完成内容未被本次粒度问题影响。 |
| 3 | `03_ddd_step_03_constraints.md` | 收稳编码规范、语言 / runtime、仓库约束 | historical_reviewed_unaffected_input | retained_for_regression | 只作为当前回归的已确认约束输入读取。 | 原完成内容未被本次粒度问题影响。 |
| 4 | `03_ddd_step_04_file_layout.md` | 收稳实现单元与文件布局 | historical_reviewed_targeted_writeback_6r03_batch_7 | retained_with_targeted_writeback | 作为已确认布局输入；batch 7只定向补充`refs.rs`承接shared finite enum / marker职责。 | 七crate、planned文件集合、Cargo依赖与业务owner未变；Step 4 / Step 6 current contracts path差集为0。 |
| 5 | `03_ddd_step_05_module_contracts.md` | 定义模块实现契约主轴 | historical_reviewed_unaffected_input | retained_for_regression | 作为 Step 6 回归直接输入,不得自行改模块 owner。 | 原七模块主轴保留;若对象回归发现 owner 冲突,必须登记 blocker 后回退,不得静默改写。 |
| 6 | `03_ddd_step_06_object_contracts.md` + regression 分件 | 逐模块定义对象实现契约 | current_regression_completed | passed_design_static_audit | 作为 current object / owner / shared declaration 真相源。 | `6R-M0~07`全部完成，69 /69 registry 与下游 current amendment 已闭合。 |
| 7 | `03_ddd_step_07_trait_port_adapter_contracts.md` + regression分件 | 逐模块定义 Trait / Port / Adapter 契约 | current_regression_completed | passed_design_static_audit | 作为 current callable、port、adapter 与 outcome owner 真相源。 | `7R-01~07`和 C4/C5/B4/B5 完成；42 /42 entry、13 /13 relay 与 current capture / handoff / publisher owner 闭合。 |
| 8 | `03_ddd_step_08_protocol_contracts.md` | 定义 API / Command / Query / Event / Job 协议契约 | current_targeted_revalidation_completed | passed_design_static_audit | 作为 55 protocol 与 actor/source authority 真相源。 | 独立 schema、field source、mapping、stored replay 闭合；Sandbox 私有 `Maintenance` authority 已删除。 |
| 9 | `03_ddd_step_09_function_flows.md` | 逐接口定义函数级处理流 | current_targeted_revalidation_completed | passed_design_static_audit | 作为 55 个函数级 flow 的 current 真相源。 | 逐协议调用、事务顺序、副作用、same-attempt recovery、no-rollback / no-write 闭合。 |
| 10 | `03_ddd_step_10_state_matrix.md` | 定义状态机与转换矩阵 | current_regression_completed | passed_design_static_audit | 作为 current canonical state inventory 真相源。 | 30 owner-level state machines、31 Step 10 enum entries、39 Step 6 shared declarations 已闭合。 |
| 11 | `03_ddd_step_11_persistence_transaction_consistency.md` | 定义持久化、事务与一致性契约 | current_targeted_revalidation_completed | passed_design_static_audit | 保持 current store / UoW / mapping。 | 受 capture、handoff、publisher 和状态库存影响的契约已定向回查。 |
| 12 | `03_ddd_step_12_error_recovery.md` | 定义错误模型、异常分支与恢复口径 | current_targeted_revalidation_completed | passed_design_static_audit | 保持 current error / retry / recovery。 | 安全关键 unknown、same-attempt inspect、no-rollback 和 actor failure 已定向回查。 |
| 13 | `03_ddd_step_13_concurrency_idempotency.md` | 定义并发、幂等与重入保护 | current_targeted_revalidation_completed | passed_design_static_audit | 保持 current key / replay / race contract。 | 受影响 attempt、stored replay、version 与 race contract 已定向回查。 |
| 14 | `03_ddd_step_14_config_external_binding.md` | 定义配置引用与外部依赖绑定 | current_targeted_revalidation_completed | passed_design_static_audit | 保持 current binding / validator contract。 | current port owner 与 ordinary hook 绑定已定向回查。 |
| 15 | `03_ddd_step_15_observability_audit.md` | 定义可观测性与审计埋点契约 | current_targeted_revalidation_completed | passed_design_static_audit | 保持 current hook、redaction 与 diagnostic contract。 | `actor_kind`、ordinary hook、attempt marker 与低基数字段已定向回查。 |
| 16 | `03_ddd_step_16_test_cuts.md` | 定义测试切口与最小验证清单 | current_targeted_revalidation_completed | passed_design_static_audit | 作为正式 `05` 的 detailed-design test cut 输入。 | `STA-031`及 current port / state 切口已传播；未生成测试结果。 |
| 17 | `03_ddd_step_17_implementation_handoff.md` | 收口详细设计到实施计划的承接清单 | current_targeted_revalidation_completed | passed_design_static_audit | 作为正式 `07` 的 handoff 输入。 | implementation handoff 索引已定向回查，不引用失效正向摘要。 |
| 18 | `03_ddd_step_18_risks_open_questions.md` | 风险与待确认事项 | current_targeted_revalidation_completed | passed_design_static_audit | 保留真实 activation blocker 与 DesignReopen 条件。 | 内部 granularity / actor / state blocker 已关闭；实现 activation blocker 继续开放。 |
| 19 | `03_ddd_step_19_formal_document_assembly.md` | 整理正式详细设计文档 | current_formal_reassembly_completed | completed_design_static_only | 正式 `03` 作为 current 设计入口；后续只能固定 baseline 并处理 activation prerequisites。 | 正式 `03` 已从 current Step 1~18 重装配并完成静态一致性回查。 |

---

## 5. 文档级 blocker 台账

| Blocker ID | Step | 状态 | 描述 | 处理口径 |
|---|---|---|---|---|
| SBX-DDD-GRANULARITY-REOPEN-001 | Step 6~19 | resolved_for_design_static_closeout | historical Step 6~10 粒度不足曾使下游 current 效力失效。 | Step 6~10 回归、Step 11~18 定向回查、Step 19 重装配及正式 `04~07` 传播均已完成；不等于实现或测试完成。 |
| SBX-DDD-GRANULARITY-STEP6-001 | Step 6 | resolved_review_confirmed_consumed_by_7r_m0 | 原Step 6存在对象真相分散、Guard缺exact contract、transition helper缺失、typed-ref kind未闭合、status漂移和中文Rustdoc不足。 | `6R-M0~07`已完成、静态差集为0并获用户确认；current authority由Step 7消费。 |
| SBX-DDD-GRANULARITY-STEP7-INPUT-001 | Step 7 / `7R-01` | resolved_in_7r_01_wait_review | historical facade引用16个未定义`*Input`。 | `7R-01A~D`已闭合42/42 exact carrier、field source、optionality、error、typed output和DTO source requirement；若Step 8不能机械映射则重开。 |
| SBX-DDD-GRANULARITY-STEP7-DISPATCH-001 | Step 7 / `7R-01`,`7R-06` | resolved_for_design_static_closeout | historical 13 Query、9 Consumer、10 Job曾被压成3 /2 /1个method。 | service 42 /42 与 entry adapter 双向映射已闭合，string / topic dispatch 正向路径为0。 |
| SBX-DDD-GRANULARITY-STEP7-REF-001 | Step 7 / `7R-02` | resolved_in_7r_02d | historical callable使用opaque ref和旧version wrapper。 | `7R-02A~D`已闭合named ref/core `Version`、stored replay和bounded index正向路径；transient carrier不生成第二身份。 |
| SBX-DDD-GRANULARITY-STEP7-OUTCOME-001 | Step 7 / `7R-03`,`7R-05` | resolved_for_design_static_closeout | historical capture / handoff / publisher 缺 finite outcome owner 与 durable / fake parity。 | current `CaptureCollectionPort`、`HandoffTargetDeliveryPort`、`SandboxEventPublisherPort` 和 application-owned outcome 已闭合。 |
| SBX-DDD-GRANULARITY-STEP7-READ-001 | Step 7 / `7R-04` | resolved_for_design_static_closeout | historical read / maintenance 缺 exact index、bundle key、body input 和 whole-group writer。 | 13 Query 与 maintenance exact surface 已闭合，Query 保持 zero-write。 |
| SBX-DDD-GRANULARITY-STEP7-ENTRY-001 | Step 7 / `7R-06` | resolved_for_design_static_closeout | historical entry mapper 丢 selector / status / result / receipt / report 关系。 | API / Worker / Jobs 42 entry mapping 和 7 /12 /17 error mapping 已闭合。 |
| SBX-DDD-ACTOR-AUTHORITY-6R05-001 | Step 8 regression | resolved_for_design_static_closeout | historical Step 8 定义不存在的 `Maintenance` actor kind 并允许 operator-scoped jobs。 | current protocol 直接承接 core `ActorKind::{Human,AiMember,System,Integration}`；P0 worker / job 为 `System` only，trusted source 由 `source_ref` 与 envelope / source gate 证明。 |
| SBX-DDD-VIEW-OWNER-6R03-001 | Step 6 / `6R-03` batch 6 | resolved_in_6r03_batch_6_revalidated_batch_7 | capture / handoff view初稿引用domain-only二级类型，会导致`contracts -> domain`反向依赖。 | 10个support declarations统一为contracts canonical owner，constructor error与view字段已对齐；duplicate / missing与反向public field dependency均为0，batch 7复核未回归。 |
| SBX-DDD-CONTRACTS-FILE-6R03-001 | Step 4 / Step 6 / `6R-03` batch 7 | resolved_in_6r03_batch_7 | Step 4 planned contracts职责与Step 6 shared registry曾残留未规划kind / status / marker路径。 | 已统一由既有`refs.rs`承接shared finite enum / marker；current path差集为0，禁止实现者自行新增module。 |
| SBX-DDD-STATE-INVENTORY-6R03-001 | Step 10 / Step 16 /正式`05~07` / `CB-SBX-12A` | resolved_for_design_static_closeout | `HandoffTargetProgressStatus` 使 historical 29-state /30-enum 清单失效。 | current 30 owner-level state machines /31 Step 10 enum entries /39 shared declarations 已传播到 Step 16、正式 `05~07` 和 planned `CB-SBX-12A`。 |
| SBX-DDD-BOOT-001 | Step 1 | resolved_for_step_1 | L4-sandbox 原缺当前重启状态下的 `03` 详细设计校准 flow。 | 本文件已创建。 |
| SBX-DDD-HIST-001 | Step 1 | contained_as_historical_material | 旧 `03-详细设计.md` 仍以五部分主线、旧对象族、旧目录树、command / tool / provider bridge、artifact / conversation / observability 混层和旧写作提示为核心。 | Step 1 已记录为 historical material / pollution risk;后续所有对象、接口、flow、状态、配置和测试契约均从正式 `00/01/02` 重建。 |
| SBX-DDD-SCOPE-001 | Step 2 | resolved_for_step_2 | 旧 `03` 与正式 `02` 的范围主线不一致,且 `04/05/06/07` 缺口容易诱导 `03` 越界写配置、测试、验收或实施内容。 | Step 2 已把本轮详细设计覆盖范围、非范围、下游文档归属和实现者可完成代码范围显式化。 |
| SBX-DDD-CONSTRAINT-001 | Step 3 | resolved_for_step_3 | 旧 README / 旧 `03` 的 Docker/gVisor、旧目录树、provider bridge、audit evidence、旧性能数字和相邻仓依赖线索容易回流为当前详细设计技术约束。 | Step 3 已重新收稳 Rust、源码英文、`core-contracts` 唯一编译期依赖、运行期 / 事件协作隔离、安全外部边界和目标实现仓前置检查;旧技术与目录线索仅作 historical material。 |
| SBX-DDD-LAYOUT-001 | Step 4 | resolved_for_step_4 | 旧 `03` 的单 crate `src/` 目录树、旧 `session/isolation/command/output/control` 五段结构和旧 backend / projection / config 布局容易回流为当前文件布局。 | Step 4 已按正式 `02` 的代码主体、运行单元和 Step 3 约束重建 workspace 多 crate planned layout;旧目录树仅作 historical material。 |
| SBX-DDD-MODULE-001 | Step 5 | resolved_for_step_5 | 旧 `03` 的五段对象主线、旧单 crate 模块和旧 `command/tool/provider bridge` 容易回流为当前详细设计模块主轴,或把正式 `02` 的 6 个业务主要组成部分误拆成 6 个 crate。 | Step 5 已按 Step 4 workspace member 固定 `contracts/domain/application/infra/api/worker/jobs` 七个实现模块,并把 6 个业务组成部分映射为跨模块业务主语;旧模块主轴仅作 historical material。 |
| SBX-DDD-OBJECT-001 | Step 6 | resolved_for_step_6 | 旧 `03` 的旧对象族、概要对象轮廓和非 core helper 容易回流为全局对象清单,或导致 application / infra / entry stable carrier 在 Step 7+ 被临时补写。 | Step 6 已按模块 capability 推导对象契约,闭口 shared carrier、domain truth、application idempotency / stored result、infra adapter outcome 和 entry shell,并输出字段来源审计、状态闭环审计和 Step 7 承接清单。 |
| SBX-DDD-PORT-001 | Step 7 | resolved_for_step_7 | Step 6 已闭口对象能力,但若不定义 exact trait / port / adapter callable surface,后续 Step 8~11 和 implementation 会自行补 repository、resolver、backend、handoff、publisher、idempotency、stored result 或 entry 调用规则。 | Step 7 已按模块闭口 application port owner、service facade、truth / projection / relay / idempotency repositories、external adapter ports、runtime builder、entry adapter、fake parity 和跨模块接缝审计。 |
| SBX-DDD-PROTOCOL-001 | Step 8 | resolved_for_step_8 | Step 7 已闭口 callable surface,但若不定义 public protocol DTO、query view / page / marker、consumer receipt、outbound payload、job report 和 stored replay surface,后续 Step 9~13 与 implementation 会自行补 schema、receipt、report 或 duplicate replay 规则。 | Step 8 已按 Command、Query、Inbound Event Consumer、Outbound Event、Operations Job 五个协议族闭口 request / response / payload / receipt / report schema、字段来源、错误映射、幂等审计、stored replay、协议族停审和跨协议 public surface 审计。 |
| SBX-DDD-FLOW-001 | Step 9 | resolved_for_step_9 | Step 8 已闭口协议 surface,但若不定义函数级调用链、UoW / cursor / stored result 顺序、query no-write、consumer receipt、relay no-rollback、job report replay 和 side-effect inventory,后续 Step 10~13 与 implementation 会自行补 flow 或事务边界。 | Step 9 已按五个批次闭口 55 个协议 flow 覆盖、共享事务模板、错误映射、状态 / 事件副作用、测试切口和跨 flow 审计。 |
| SBX-DDD-FLOW-QUERY-001 | Step 11 | contained_by_step_11_current_callable_boundary | Step 8 部分 query selector 比 Step 7 读取面更细,若在 flow 中直接支持会诱导实现自造 finder / index repository。 | Step 11 已定义 logical index 和维护义务,但 current callable surface 未开放的 selector 仍返回 `Validation` / `MissingProjection` / `Degraded`;不得扫描 storage 或拼 ref。 |
| SBX-DDD-STATE-001 | Step 10 | resolved_for_step_10 | Step 6 已闭口状态 enum 且 Step 9 已列状态副作用,但若不定义状态主语筛选、状态族、允许 / 禁止迁移、触发函数、非法转换和 query/job/relay 边界,后续 Step 11~13 与 implementation 会自行补状态规则或混写全局状态机。 | Step 10 已按 intake/identity/reference、boundary/capability/handle/lease、policy/high-risk、run/capture/handoff、failure/control/cleanup/redline、read/projection/derived/reconciliation、relay、idempotency/stored replay/entry/job/adapter 技术状态闭口状态矩阵,并把 persistence/index、error/recovery、idempotency 和 config handoff 显式列出。 |
| SBX-DDD-PERSIST-001 | Step 11 | resolved_for_step_11 | Step 7~10 已闭口 callable surface、flow 和状态矩阵,但若不定义持久化 shape、transaction order、version / cursor、rollback visibility、projection index 和 stored replay,implementation 会自行选择 storage / UoW / fake 语义。 | Step 11 已闭口 logical store、repository 语义、事务边界、一致性策略、index current boundary、projection rebuild、relay publish 和 fake/durable parity。 |
| SBX-DDD-ERROR-001 | Step 12 | resolved_for_step_12 | Step 6~11 已出现 public error、flow 异常、非法转换、adapter outcome、duplicate missing result 和 transaction failure,若不统一错误模型,implementation 会自行补错误 variant 或把精确错误退化成泛化失败。 | Step 12 已闭口错误 taxonomy、错误映射、异常分支、恢复口径、审计 / report surface 和禁止行为。 |
| SBX-DDD-CONCURRENCY-001 | Step 13 | resolved_for_step_13 | Step 8~12 已出现 idempotency、duplicate replay、expected version、stored result、consumer receipt、job report、retry 和 no-write/no-rollback 口径,若不统一并发与幂等策略,implementation 会自行补 key schema、retry identity 或重入规则。 | Step 13 已闭口并发场景、幂等键、request digest、same-key duplicate / conflict / in-flight / failed record、expected version、重复事件 / job、重入保护和 fake/durable parity。 |
| SBX-DDD-CONFIG-001 | Step 14 | resolved_for_step_14 | Step 3/4/7/8/11/13 已出现 config owner、runtime builder、adapter availability、topic binding、job retry/retention、idempotency retention 和 sibling dependency 裁剪口径,若不统一配置引用与外部依赖绑定,implementation 会自行补 config schema、adapter wiring 或 Cargo dependency。 | Step 14 已闭口配置读取边界、配置引用表、config section 到代码绑定、禁止配置化边界、外部依赖绑定、inbound / outbound event binding、跨仓 Rust 依赖和 runtime builder 装配顺序。 |
| SBX-DDD-OBSERVABILITY-001 | Step 15 | resolved_for_step_15 | Step 6~14 已分别定义 trace、protocol、flow、transaction、error、idempotency 和 config,但缺少统一 log / metric / audit 埋点契约,实现侧可能自行把日志、audit、report、handoff、diagnostic 混用。 | Step 15 已按 runtime log、metric、`SandboxAuditTrace`、relay marker、handoff marker、job report、diagnostic issue 分层闭口。 |
| SBX-DDD-OBS-HIST-001 | Step 15 | contained_as_historical_material | 旧 README / 旧 `03` 的 audit event、observability hint、Docker/gVisor log、provider bridge 和 artifact evidence 线索可能误导为当前观测事实。 | Step 15 未继承旧观测事件或后端日志口径,只按正式 `00/01/02` 和 Step 6~14 重建。 |
| SBX-DDD-TEST-001 | Step 16 | resolved_for_step_16 | Step 5~15 已定义模块、协议、flow、状态、事务、错误、幂等、配置和观测契约,但缺少统一最小测试入口,实现侧可能只测 happy path。 | Step 16 已输出模块、接口、状态机、一致性 / 幂等 / 并发、错误 / 配置 / 观测测试切口。 |
| SBX-DDD-TEST-HIST-001 | Step 16 | contained_as_historical_material | 旧 `05-测试方案.md` 和旧 README 的 backend / Docker / 性能 / 审计测试线索可能回流为当前 Step 16 真实测试结论。 | Step 16 未继承旧测试结果或旧用例,只按当前 Step 5~15 契约重建测试入口。 |
| SBX-DDD-HANDOFF-001 | Step 17 | resolved_for_step_17 | Step 1~16 已定义详细设计契约,但若不显式收口到 `07` 的承接清单,implementation plan 可能复制字段 / DTO / flow / 状态表形成第二真相源或遗漏前置阅读。 | Step 17 已输出实施承接清单、实施前置阅读、实施前检查、跨文档一致性复核、命名一致性和回填草稿。 |
| SBX-DDD-HANDOFF-PHASE-001 | Step 17 | resolved_by_scope | Step 17 容易被误读为正式 `07` 或实现移交通过结论。 | Step 17 明确不写 phase / commit boundary、implementation ledger、planned skeleton、排期或任务拆分;正式移交仍由 `07` 完成。 |
| SBX-DDD-HANDOFF-REPO-001 | Step 17 / implementation Activation | open_before_first_boundary | 目标实现仓 `/home/aris/Projects/quantalithos-sandbox` 当前未发现。 | 不阻塞详细设计回归;DesignReopen 与下游重验关闭后,仍须在 `CB-SBX-01A` Activation 前确认目标仓策略和初始 worktree,当前不得创建实现代码。 |
| SBX-DDD-RISK-001 | Step 18 | resolved_for_step_18 | Step 17 已列出未进入实施事项,但尚未形成正式风险 / 待确认表。 | Step 18 已输出风险表、待确认事项表和阻塞转换规则。 |
| SBX-DDD-RISK-FORMAL-001 | Step 19 | historical_resolved_formal_reassembly_pending | 原 Step 19 已创建中间产物、重建正式 `03` 并经用户确认;该历史事实保留,但当前 baseline 效力被 DesignReopen 失效。 | 等待 Step 6~18 回归 /影响回查均确认后重新执行 Step 19 装配与审查;旧正式 `03` 不得作为当前 implementation baseline。 |
| SBX-DDD-RISK-CONTRACTS-001 | Step 6 / 8 / implementation Activation | open_before_affected_boundary | `6R-01` 已确认当前工作区 `core-contracts` exact type 可检索，但目标实现仓的 exact revision / compatibility 尚未固定。 | 不阻塞当前 Step 6 设计；实现 Activation 前仍须在目标仓复核 exact revision，若缺失则登记真实上游 blocker，不得由实现者临时发明。 |
| SBX-IMP-BOUNDARY-POLICY-CYCLE-001 | downstream `07` Step 6 writeback | resolved_by_07_step_6_writeback | `BoundaryRequirementSet` factory、Boundary command / port / flow原消费后序policy snapshot / decision,使PH-05依赖PH-06。 | 已回写Step 6 /7 /8 /9 /11 /14 /16 /17及正式`03`,固定Boundary只消费accepted context、active identity、显式五维requirements、generation-scoped profile / template和capability;Policy后序消费typed requirement ref。 |
| SBX-IMP-LEASE-RUN-GUARD-001 | downstream `07` Step 6 writeback | resolved_by_07_step_6_writeback | Run虽引用handle / lease,但原缺exact repository reads和对象级active / expiry guard,可能诱发latest scan或按current config重算lease window。 | 已补`get_isolation_handle_with_version`、`get_lease_with_version`、`require_active_for_boundary`、`require_active_for_handle`并回写正式`03`;Run沿exact refs只读持久化lease并结合Accepted policy启动backend。 |
| SBX-DOC-GAP-TEST-001 | downstream | historical_resolved_revalidation_pending | 正式 `05-测试方案.md` 已在测试 Step 15 重建并经用户确认;当前因详细设计 DesignReopen 待定向重验。 | 保留原审查事实和无 runtime 结果边界;正式 `03` 重装配后只重验受影响 test contract、trace 和 gate。 |
| SBX-DOC-GAP-ACCEPT-001 | downstream | historical_resolved_revalidation_pending | 正式 `06-验收标准.md` 已在验收 Step 15 重建并经用户确认;当前因详细设计 DesignReopen 待定向重验。 | 保留原审查事实和 `NotEntered` runtime 状态;正式 `03/05` 重验后只重验受影响 AC、VETO、evidence 和裁决入口。 |
| SBX-DOC-GAP-001 | downstream | historical_resolved_revalidation_pending | 正式 `04-配置设计.md` 已在配置 Step 15 重建并经用户确认;当前因详细设计 DesignReopen 待定向重验。 | 正式 `03` 重装配后只重验受影响 config owner、binding、validator 和 redline,不得提前改正式 `04`。 |
| SBX-DOC-GAP-002 | downstream | historical_resolved_revalidation_pending | 正式 `07-实施计划.md`、implementation ledger 和 32 件 planned boundary skeleton 已在 Step 13 创建并经用户确认;当前 implementation authority 被 DesignReopen 阻塞。 | 保留 skeleton 和历史审查事实;完成 `03~06` 定向重验后重验受影响 boundary,关闭前 `CB-SBX-01A` 保持 `blocked / wait_design`。 |

| SBX-ACC-STATE-NAME-001 | Step 10 formal assembly / downstream acceptance Step 8 | resolved_by_acceptance_step_8_writeback | 正式`03`§9.4在Step 19装配时把canonical `Preparing`转写为`Pending`,误把`FailureClassificationStatus::Classified`接入run状态机;§15.3还使用了非正式`Publishing`、不存在的reconciliation `Pending -> Completed`及其他口语状态。 | 验收Step 8已按`03_ddd_step_10_state_matrix.md`§12~§19回写正式§9.4 /§15.3全表,并在Step 10中间产物记录回查;不改变原canonical状态契约。 |

---

## 6. 当前 next_allowed_action

```text
current_document = 03-详细设计.md
current_step = Step 7 regression / 7R-02B owner reachability audit in progress
current_batch = 7R-02B mutable truth repositories
step_status = reopened_content_in_progress
batch_status = in_progress
gate_status = content_in_progress
current_module = application persistence ports
current_object = mutable truth repository contract
step_6_status = review_confirmed_consumed_by_7R_M0
historical_step_7 = reviewed_invalidated_by_design_reopen
§16.10 = completed_and_consumed
application_registry = 8/8 families_closed
checked_deserialize = 3/3
application_error_detail_mapping = 41/41_exact_once
api_error_mapping = 7/7_exact_once
worker_error_mapping = 12/12_exact_once
jobs_error_mapping = 17/17_exact_once
adapter_kind = 18/18
activation_kind = 2/2_required_or_disabled
availability_coverage = 18/18
infra_error_mapping = 18/18_exact_once
named_types = 28/28
support_families = 13/13
registry_mappings = 15/15
forward_methods = 10/10
entry_object_file_owner = 13/13_unique
entry_field_source = 16/16_closed
entry_constructor_accessor_family = 13/13_closed
historical_consumer_delta = 16/16_registered
historical_actor_authority_conflict = registered_for_step_8_regression
new_l1_l2_blocker = 0
registry_rows = 69/69
canonical_sources = 5/5
module_owners = 7/7
handoff_groups = 15/15_allocated
entry_callable_target = 42/42
outbound_relay_target = 13/13
input_blocker = resolved_in_7r_01_wait_review
step_7_internal_blockers = 5/6_open_with_owner
current_callable_defined = 42/42
typed_identity_allocator = 54/54
canonical_named_ref_join = 52/52
mutable_owner_join = 20/20
logical_repository_root = 19/19
repository_trait = 19/19
repository_method = 57/57
same_uow_group = 21/21
application_callable_mutable_join = 42/42
query_mutable_write = 0/13
ref_blocker = in_progress_wait_7r_02b_02d
next_allowed_action = close_19_root_method_owner_reachability
formal_03_status = historical_reviewed_invalidated_by_design_reopen
downstream_04_07_status = historical_reviewed_revalidation_pending
implementation = CB-SBX-01A blocked / wait_design
```

## 7. `S7-02B` Current Completion Override

> 本节位于本文物理末尾，是校准流程对当前恢复点的唯一current override（2026-07-26）。前文的
> `content_in_progress`块保留为审计轨迹；它不再表示`S7-02B`尚未完成。

本轮已完成`S7-02B` mutable truth repository owner reachability：19/19 logical roots、19/19 repository traits、
57/57 `get/create/save` methods、21/21 same-UoW groups、42/42 application callables和29/29 fresh reservation owners均已
通过静态差集审计；Query mutable write保持0/13。projection/derived first materialization、reference initial branch、capture
`C*`逐row语义、failure/cleanup/orphan安全kernel、relay finalized-draft gate和idempotency fresh-reservation gate均已写入
current calibration source。

当前状态是`completed_wait_user_review`，不是Step 7整体完成。`REF-001`仍等待`7R-02C/02D`的immutable、stored和index
join；未发现新的上游L1/L2 blocker。用户确认前不进入`7R-02C`，不进入Step 8，不改正式`03~07`，不激活`CB-SBX-01A`。

```text
current_document = 03-详细设计.md
current_step = Step 7 regression / 7R-02B completed_wait_user_review
current_batch = 7R-02B mutable truth repositories
batch_status = completed_wait_user_review
gate_status = user_review_pending
completed_task = S7-02B
next_task = S7-02C immutable / audit / relay repository
next_allowed_action = wait_user_review_before_7R_02C
mutable_owner_join = 20/20
logical_repository_root = 19/19
repository_trait = 19/19
repository_method = 57/57
same_uow_group = 21/21
application_callable_join = 42/42
query_mutable_write = 0/13
fresh_idempotency_owner = 29/29
ref_blocker = open_wait_7r_02c_02d
step_8 = blocked_by_step_7_regression
formal_03_07 = historical_reviewed_revalidation_pending
implementation = CB-SBX-01A blocked / wait_design
real_test_execution = not_started
real_evidence_created = no
commit_required = no
```

## Historical-Position Recovery Draft (superseded): `7R-04A-A3-2-S3-P4` completed, user review pending

本节位于 flow 物理 EOF，是当前恢复权威。`A3-2-S3-P4` 已完成三个 safety writer 的具名 method、typed whole-group
inspection、`Committed/FullyAbsent/Indeterminate` 判定顺序、durable/fake parity 与 S3 static audit；正式 `03`、实现和
Step 7 blocker ruling 继续冻结。前部 P3/P4 working material 仅作 historical-position 追溯。

```text
current_plan_version = v6.5-active
current_document = 03-详细设计.md
current_step = Step 7 regression / 7R-04A
current_sub_batch = 7R-04A-A3-2-S3 safety status-view writers completed_wait_user_review
current_internal_task = A3-2-S3 user review gate after P4
gate_status = content_completed_wait_user_review
a3_1_writer_necessity_inventory = completed
a3_2_status_view_writers = in_progress_s1_s2_s3_completed_wait_user_review
a3_2_s1_shared_authorization_transaction = completed
a3_2_s2_execution_boundary_policy_capture_handoff = completed
a3_2_s3_failure_cleanup_redline = completed_wait_user_review
a3_2_s3_p1_failure_control = completed
a3_2_s3_p2_cleanup = completed
a3_2_s3_p3_redline = completed
a3_2_s3_p4_methods_inspection_parity_audit_sync = completed
a3_2_s4_eight_family_total_audit = pending
a3_3_projection_derived_comparison_writers = pending
a3_4_existing_owner_and_consistency_audit = pending
a4_read_blocker_closure = pending
status_view_family_payload_total = 8/8
safety_named_writer_methods = 3/3
safety_whole_group_inspection_keys = 3/3
safety_owner_inspection_branches = 3/3
safety_durable_fake_parity_obligations = 18/18
cleanup_exact_version_owner = generic_target_expectation_only
cleanup_index_exact_version_duplicate = 0
misplaced_p2_p3_current_anchor = 0
query_writer_use = 0/13
public_callable_count = 42/42_unchanged
open_blockers = SBX-DDD-GRANULARITY-STEP7-READ-001|SBX-DDD-GRANULARITY-STEP7-OUTCOME-001
existing_implementation_gate = BLK-SBX-CANONICAL-001
new_l1_l2_blocker = 0
formal_03_writeback = forbidden
step_8 = blocked_by_step_7_regression
implementation = CB-SBX-01A blocked / wait_design
real_test_execution = not_started
real_evidence_created = no
acceptance_signoff = no
commit_required = no
next_allowed_action = wait_user_review_before_A3_2_S4
```

## Historical-Position Recovery Draft (superseded by physical EOF): `7R-04A-A3-2-S4` completed, user review pending

本节曾位于 flow 物理 EOF，现由本文物理 EOF的同名 current override 取代。用户已确认消费 S3 复核门，S4 已完成八类
status-view staged writer 的总量审计和四层恢复同步；本轮停在 A3-2 用户复核门，不自动进入 A3-3、A3-4、A4、Step 8 或正式
`03` 回填。

```text
current_plan_version = v6.6-active
current_document = 03-详细设计.md
current_step = Step 7 regression / 7R-04A
current_sub_batch = 7R-04A-A3-2 status-view staged writers completed_wait_user_review
current_internal_task = A3-2-S4 eight-family total audit review gate
gate_status = content_completed_wait_user_review
a3_1_writer_necessity_inventory = completed
a3_2_status_view_writers = completed_wait_user_review
a3_2_s1_shared_authorization_transaction = completed
a3_2_s2_execution_boundary_policy_capture_handoff = completed
a3_2_s3_failure_cleanup_redline = completed
a3_2_s4_eight_family_total_audit = completed
a3_3_projection_derived_comparison_writers = pending
a3_4_existing_owner_and_consistency_audit = pending
a4_read_blocker_closure = pending
query_write_provenance = 13/13_unique
status_view_writer_families = 8/8
status_view_named_writer_methods = 8/8
status_view_whole_group_inspection_keys = 8/8
status_view_unique_source_owners = 8/8
status_view_durable_fake_parity_obligations = 18/18_design_only
a3_materialization_writer_closure = 8/11
a3_remaining_materialization_writers = projection|derived|comparison
existing_writer_reuse = reconciliation|audit
query_writer_use = 0/13
public_callable_count = 42/42_unchanged
generic_status_writer = 0
generic_inspector_port = 0
runtime_family_dispatch = 0
cleanup_index_exact_version_duplicate = 0
redline_non_exact_selector = 0
open_blockers = SBX-DDD-GRANULARITY-STEP7-READ-001|SBX-DDD-GRANULARITY-STEP7-OUTCOME-001
existing_implementation_gate = BLK-SBX-CANONICAL-001
new_l1_l2_blocker = 0
formal_03_writeback = forbidden
step_8 = blocked_by_step_7_regression
implementation = CB-SBX-01A blocked / wait_design
real_test_execution = not_started
real_evidence_created = no
acceptance_signoff = no
commit_required = no
next_required_reads = current_artifact_101|step7_control_current|step7_repositories_MUT_G20_G21|step6_projection_derived_comparison_current|step7_cross_audit
next_allowed_action = wait_user_review_before_A3_3
```

## EOF Current Recovery Override: `7R-04A-A3-2-S4` completed, user review consumed

本节位于 flow 物理 EOF，是当前唯一恢复权威。`A3-2-S4` 已完成八类 status-view staged writer 总量审计，用户已确认继续；
下一允许批次为 `A3-3`，但本覆盖本身不宣称 `A3-3` 已形成任何内容。正式 `03`、Step 8 与 implementation 仍不授权。

```text
current_plan_version = v6.6-active
current_document = 03-详细设计.md
current_step = Step 7 regression / 7R-04A
current_sub_batch = 7R-04A-A3-2 completed; A3-3 authorized_not_started
current_internal_task = A3-3 prerequisites read and boundary extraction
gate_status = in_progress
a3_1_writer_necessity_inventory = completed
a3_2_status_view_writers = completed
a3_2_s4_eight_family_total_audit = completed
a3_3_projection_derived_comparison_writers = authorized_not_started
a3_4_existing_owner_and_consistency_audit = pending
a4_read_blocker_closure = pending
status_view_writer_families = 8/8
a3_materialization_writer_closure = 8/11
a3_remaining_materialization_writers = projection|derived|comparison
query_writer_use = 0/13
public_callable_count = 42/42_unchanged
open_blockers = SBX-DDD-GRANULARITY-STEP7-READ-001|SBX-DDD-GRANULARITY-STEP7-OUTCOME-001
existing_implementation_gate = BLK-SBX-CANONICAL-001
new_l1_l2_blocker = 0
formal_03_writeback = forbidden
step_8 = blocked_by_step_7_regression
implementation = CB-SBX-01A blocked / wait_design
real_test_execution = not_started
real_evidence_created = no
acceptance_signoff = no
commit_required = no
next_required_reads = current_artifact_101|step7_control_current|step7_repositories_MUT_G20_G21|step6_projection_derived_comparison_current|step7_cross_audit
next_allowed_action = read_A3_3_prerequisites_then_write_projection_only
```

## EOF Current Recovery Override: `7R-04A-A3-3-P1` projection writer completed, user review pending

本节位于 flow 物理 EOF，是当前恢复权威。`A3-3-P0` 与 projection writer 已完成，当前停在 P1 用户复核门；不得自动进入
derived、comparison、A3-4、A4、Step 8、正式 `03` 或 implementation。

```text
current_plan_version = v6.7-active
current_document = 03-详细设计.md
current_step = Step 7 regression / 7R-04A
current_sub_batch = 7R-04A-A3-3-P1 projection whole-group writer completed_wait_user_review
current_internal_task = A3-3-P1 user review gate after projection writer
gate_status = content_completed_wait_user_review
a3_2_status_view_writers = completed
a3_2_s4_eight_family_total_audit = completed
a3_3_p0_prerequisite_read = completed
a3_3_p1_projection_writer = completed_wait_user_review
a3_3_p2_derived_writer = pending
a3_3_p3_comparison_writer = pending
a3_3_p4_static_audit_sync = pending
a3_3_projection_derived_comparison_writers = in_progress_wait_user_review
a3_4_existing_owner_and_consistency_audit = pending
a4_read_blocker_closure = pending
a3_materialization_writer_closure = 9/11_design_only
projection_named_writer_methods = 1/1
projection_whole_group_inspection_keys = 1/1
projection_unique_source_owners = 1/1
projection_durable_fake_parity_obligations = 9/9_design_only
query_writer_use = 0/13
public_callable_count = 42/42_unchanged
open_blockers = SBX-DDD-GRANULARITY-STEP7-READ-001|SBX-DDD-GRANULARITY-STEP7-OUTCOME-001
existing_implementation_gate = BLK-SBX-CANONICAL-001
new_l1_l2_blocker = 0
formal_03_writeback = forbidden
step_8 = blocked_by_step_7_regression
implementation = CB-SBX-01A blocked / wait_design
real_test_execution = not_started
real_evidence_created = no
acceptance_signoff = no
commit_required = no
next_required_reads = current_artifact_102_103|step7_control_current|step7_repositories_MUT_G21|step6_derived_current|step7_cross_audit
next_allowed_action = wait_user_review_before_A3_3_P2
```

## EOF Current Recovery Override: `7R-04A-A3-3-P2` derived prerequisite read in progress

本节位于 flow 物理 EOF，是当前唯一恢复权威。P1 用户复核门已消费，当前只授权读取 derived current contracts 并编写
`A3-3-P2`；不得借此进入 comparison、P4、A3-4、A4、Step 8、正式 `03` 或 implementation。

```text
current_plan_version = v6.7-active
current_document = 03-详细设计.md
current_step = Step 7 regression / 7R-04A
current_sub_batch = 7R-04A-A3-3-P2 derived prerequisite_read
current_internal_task = A3-3-P2 derived prerequisite read then derived writer only
gate_status = in_progress
a3_2_status_view_writers = completed
a3_3_p0_prerequisite_read = completed
a3_3_p1_projection_writer = completed
a3_3_p2_derived_writer = in_progress
a3_3_p3_comparison_writer = pending
a3_3_p4_static_audit_sync = pending
a3_3_projection_derived_comparison_writers = in_progress
a3_4_existing_owner_and_consistency_audit = pending
a4_read_blocker_closure = pending
a3_materialization_writer_closure = 9/11_design_only
projection_named_writer_methods = 1/1
projection_whole_group_inspection_keys = 1/1
projection_unique_source_owners = 1/1
projection_durable_fake_parity_obligations = 9/9_design_only
query_writer_use = 0/13
public_callable_count = 42/42_unchanged
open_blockers = SBX-DDD-GRANULARITY-STEP7-READ-001|SBX-DDD-GRANULARITY-STEP7-OUTCOME-001
existing_implementation_gate = BLK-SBX-CANONICAL-001
new_l1_l2_blocker = 0
formal_03_writeback = forbidden
step_8 = blocked_by_step_7_regression
implementation = CB-SBX-01A blocked / wait_design
real_test_execution = not_started
real_evidence_created = no
acceptance_signoff = no
commit_required = no
next_required_reads = current_artifact_102_103|step7_control_current|step7_repositories_MUT_G21|step6_derived_current|step7_service_job9|step7_cross_audit
next_allowed_action = read_A3_3_P2_prerequisites_then_write_derived_only
```

## EOF Current Recovery Override: `7R-04A-A3-3-P2` derived writer completed, user review pending

本节追加于物理 EOF，是当前 flow 恢复权威。P2 已完成 derived Inspect/Preview/Trend 的 seven-phase whole-group writer、
first/existing reachability、state/materialization/current-binding 原子 stage、commit-unknown inspection、有限错误与
durable/fake parity 设计。新增 carrier 均为 application-private，复用既有 call context、
`SandboxIdempotencyRecordRef`、`JobRunId` 与 `SandboxTransactionRef`；没有新增无 owner identity。正式 `03`、P3、P4、
A3-4、A4、Step 8 与 implementation 继续冻结。

```text
current_plan_version = v6.8-active
current_document = 03-详细设计.md
current_step = Step 7 regression / 7R-04A
current_sub_batch = 7R-04A-A3-3-P2 derived whole-group writer completed_wait_user_review
current_internal_task = A3-3-P2 user review gate after derived writer
gate_status = content_completed_wait_user_review
a3_2_status_view_writers = completed
a3_3_p0_prerequisite_read = completed
a3_3_p1_projection_writer = completed
a3_3_p2_derived_writer = completed_wait_user_review
a3_3_p3_comparison_writer = pending
a3_3_p4_static_audit_sync = pending
a3_3_projection_derived_comparison_writers = in_progress_wait_user_review
a3_4_existing_owner_and_consistency_audit = pending
a4_read_blocker_closure = pending
a3_materialization_writer_closure = 10/11_design_only
derived_named_writer_methods = 1/1
derived_closed_write_phases = 7/7
derived_supported_kinds = 3/3
derived_whole_group_inspection_keys = 1/1
derived_unique_source_owners = 1/1
derived_durable_fake_parity_obligations = 12/12_design_only
derived_query_writer_use = 0
derived_core_truth_writes = 0
derived_failure_classification_create = 0
derived_unowned_scope_or_identity_types = 0
query_writer_use = 0/13
public_callable_count = 42/42_unchanged
open_blockers = SBX-DDD-GRANULARITY-STEP7-READ-001|SBX-DDD-GRANULARITY-STEP7-OUTCOME-001
existing_implementation_gate = BLK-SBX-CANONICAL-001
new_l1_l2_blocker = 0
formal_03_writeback = forbidden
step_8 = blocked_by_step_7_regression
implementation = CB-SBX-01A blocked / wait_design
real_test_execution = not_started
real_evidence_created = no
acceptance_signoff = no
commit_required = no
next_required_reads = current_artifact_102_103_104|step6_comparison_current|step7_comparison_reader_current|step7_control_current|step7_cross_audit
next_allowed_action = wait_user_review_before_A3_3_P3
```

## EOF Current Recovery Override: `7R-04A-A3-3-P3` comparison writer completed, user review pending

本节追加于 flow 物理 EOF，是当前唯一恢复权威。P3 已完成 comparison whole-group writer 的边界、selector、四成员持久化
slice、first/replacement、CAS、commit-unknown inspection 与 durable/fake parity 设计；当前停在 P3 用户复核门。不得自动
进入 P4、A3-4、A4、Step 8、正式 `03` 或 implementation。

```text
current_plan_version = v6.9-active
current_document = 03-详细设计.md
current_step = Step 7 regression / 7R-04A
current_sub_batch = 7R-04A-A3-3-P3 comparison whole-group writer completed_wait_user_review
current_internal_task = A3-3-P3 user review gate after comparison writer
gate_status = content_completed_wait_user_review
a3_2_status_view_writers = completed
a3_3_p0_prerequisite_read = completed
a3_3_p1_projection_writer = completed
a3_3_p2_derived_writer = completed
a3_3_p3_comparison_writer = completed_wait_user_review
a3_3_p4_static_audit_sync = pending
a3_3_projection_derived_comparison_writers = in_progress_wait_user_review
a3_4_existing_owner_and_consistency_audit = pending
a4_read_blocker_closure = pending
a3_materialization_writer_closure = 11/11_design_only
comparison_named_writer_methods = 1/1
comparison_authorized_source_channels = 2/2
comparison_formal_target_proof = 1/1
comparison_unique_writer_owner = 1/1
comparison_logical_store_members = 4/4
comparison_whole_group_inspection_keys = 1/1
comparison_durable_fake_parity_obligations = 12/12_design_only
comparison_new_mutable_roots = 0
comparison_new_same_uow_groups = 0
comparison_query_writer_use = 0
comparison_identity_or_cursor_allocation_in_writer = 0
comparison_external_call_in_writer = 0
comparison_source_truth_writes = 0
comparison_unowned_scope_or_identity_types = 0
query_writer_use = 0/13
public_callable_count = 42/42_unchanged
open_blockers = SBX-DDD-GRANULARITY-STEP7-READ-001|SBX-DDD-GRANULARITY-STEP7-OUTCOME-001
existing_implementation_gate = BLK-SBX-CANONICAL-001
new_l1_l2_blocker = 0
formal_03_writeback = forbidden
step_8 = blocked_by_step_7_regression
implementation = CB-SBX-01A blocked / wait_design
real_test_execution = not_started
real_evidence_created = no
acceptance_signoff = no
commit_required = no
next_required_reads = current_artifact_105|step7_repositories_current|step7_control_current|step7_cross_audit|current_recovery_ledgers
next_allowed_action = wait_user_review_before_A3_3_P4
```

## EOF Current Recovery Override: `7R-04A-A3-3-P4` static audit completed, user review pending

本节追加于 flow 物理 EOF，是当前唯一恢复权威。P4 已完成三类 writer 横向静态审计；A3-4、A4、Step 8、正式 `03` 与
implementation 继续冻结。

```text
current_plan_version = v7.0-active
current_document = 03-详细设计.md
current_step = Step 7 regression / 7R-04A
current_sub_batch = 7R-04A-A3-3-P4 three-family static audit completed_wait_user_review
current_internal_task = A3-3-P4 user review gate after projection/derived/comparison audit
gate_status = content_completed_wait_user_review
a3_2_status_view_writers = completed
a3_3_p0_prerequisite_read = completed
a3_3_p1_projection_writer = completed
a3_3_p2_derived_writer = completed
a3_3_p3_comparison_writer = completed
a3_3_p4_static_audit_sync = completed_wait_user_review
a3_3_projection_derived_comparison_writers = completed_wait_user_review
a3_4_existing_owner_and_consistency_audit = pending
a4_read_blocker_closure = pending
a3_materialization_writer_closure = 11/11_design_only
three_family_named_writer_methods = 3/3
three_family_whole_group_inspection_keys = 3/3
three_family_unique_writer_owners = 3/3
three_family_formal_target_proofs = 3/3
three_family_stage_only_commit_boundary = 3/3
three_family_family_specific_write_sets = 3/3
three_family_version_cas_rules = 3/3
three_family_unknown_branches = 3/3
three_family_durable_fake_parity_obligations = 33/33_design_only
projection_derived_comparison_common_negative_audit = 15/15_design_only
projection_commit_unknown_historical_conflict = corrected_by_current_shared_rule
projection_private_inspection_visibility = application_private_only
comparison_new_mutable_roots = 0
comparison_new_same_uow_groups = 0
comparison_query_writer_use = 0
query_writer_use = 0/13
public_callable_count = 42/42_unchanged
open_blockers = SBX-DDD-GRANULARITY-STEP7-READ-001|SBX-DDD-GRANULARITY-STEP7-OUTCOME-001
existing_implementation_gate = BLK-SBX-CANONICAL-001
new_l1_l2_blocker = 0
formal_03_writeback = forbidden
step_8 = blocked_by_step_7_regression
implementation = CB-SBX-01A blocked / wait_design
real_test_execution = not_started
real_evidence_created = no
acceptance_signoff = no
commit_required = no
next_required_reads = current_artifact_106|step7_repositories_current|step7_control_current|step7_cross_audit|current_recovery_ledgers
next_allowed_action = wait_user_review_before_A3_4
```

## EOF Current Recovery Override: `7R-04A-A3-4` completed, user review pending

本节追加于 flow 物理 EOF，是当前唯一恢复权威。A3-4 已完成 existing reconciliation/audit owner 的字段、消费者、
事务、Version/CAS、commit-unknown、parity 与禁止重复定义审计；A3 已完成内容并等待用户复核。未经确认不得进入 A4、
Step 8、正式 `03` 回填或 implementation。

```text
current_plan_version = v7.1-active
current_document = 03-详细设计.md
current_step = Step 7 regression / 7R-04A
current_sub_batch = 7R-04A-A3-4 existing owner reuse and consistency audit completed_wait_user_review
current_internal_task = A3-4 user review gate after existing owner consistency audit
gate_status = content_completed_wait_user_review
a3_2_status_view_writers = completed
a3_3_projection_derived_comparison_writers = completed
a3_4_existing_owner_and_consistency_audit = completed_wait_user_review
a3_outcome_writer_boundary = completed_wait_user_review
a4_read_blocker_closure = pending
a3_materialization_writer_closure = 11/11_design_only
reconciliation_existing_owner = 1/1
audit_existing_owner = 1/1
audit_append_read_paths = 3/3|2/2
materialization_source_consumer_closure = 11/11
a3_4_durable_fake_parity_obligations = 20/20_design_only
a3_4_negative_audit = 16/16_design_only
mutable_logical_roots = 19/19_unchanged
same_uow_groups = 21/21_unchanged
query_writer_use = 0/13
public_callable_count = 42/42_unchanged
open_blockers = SBX-DDD-GRANULARITY-STEP7-READ-001|SBX-DDD-GRANULARITY-STEP7-OUTCOME-001
existing_implementation_gate = BLK-SBX-CANONICAL-001
new_l1_l2_blocker = 0
formal_03_writeback = forbidden
step_8 = blocked_by_step_7_regression
implementation = CB-SBX-01A blocked / wait_design
real_test_execution = not_started
real_evidence_created = no
acceptance_signoff = no
commit_required = no
next_required_reads = current_artifact_107|step7_service_facade_job10|step7_repositories_current|step7_control_current|step7_cross_audit|current_recovery_ledgers
next_allowed_action = wait_user_review_before_A4
```

## EOF Current Recovery Override: `7R-04A-A4-P1` completed, P2 in progress

A4-P1 已完成 13 个 Query 的正向 owner/source/reader/consumer total audit，当前进入 A4-P2 反向覆盖审计；正式
`03-详细设计.md` 继续冻结。A4-P2 只审计 9 个 maintenance reader、11 个 materialization surface 与全局 registry，
不自动进入 Step 8。

```text
current_plan_version = v7.2-active
current_document = 03-详细设计.md
current_step = Step 7 regression / 7R-04A
current_sub_batch = 7R-04A-A4-P2 reverse maintenance/materialization/global registry audit
current_internal_task = A4-P2 reverse coverage audit
current_artifact = 03_ddd_step_07_read_maintenance_surfaces.md
gate_status = in_progress
a4_p1_query_positive_audit = completed
a4_p2_reverse_surface_audit = in_progress
a4_p3_read_blocker_ruling_and_sync = pending
query_positive_owner_source_reader_consumer = 13/13_design_only
query_field_layer_closure = 104/104_design_only
query_missing_owner_source_reader_consumer = 0/13
query_duplicate_owner = 0
query_reader_alias = 0
query_writer_use = 0/13
existing_maintenance_reader = 9/9_preserved
materialization_source_consumer_closure = 11/11
mutable_logical_roots = 19/19_unchanged
same_uow_groups = 21/21_unchanged
public_callable_count = 42/42_unchanged
open_blockers = SBX-DDD-GRANULARITY-STEP7-READ-001|SBX-DDD-GRANULARITY-STEP7-OUTCOME-001
new_l1_l2_blocker = 0
formal_03_writeback = forbidden
step_8 = blocked_by_step_7_regression
implementation = CB-SBX-01A blocked / wait_design
real_test_execution = not_started
real_evidence_created = no
acceptance_signoff = no
commit_required = no
next_required_reads = current_artifact_108|maintenance_selector_registry|materialization_owner_registry|repository_root_uow_registry|callable_registry
next_allowed_action = complete_A4_P2_reverse_audit_only
```

## EOF Current Recovery Override: `7R-04A-A4-P2` completed, user review pending

本节是 flow 物理 EOF 的 current recovery authority。A4-P2 已完成 9 个 maintenance reader、11 个 materialization surface、
19 个 logical root、21 个 same-UoW group 和 42 个 application callable 的反向设计静态审计。正式 `03-详细设计.md`、Step 8、
实现仓和所有运行事实继续冻结；本节不代表编译、测试、provider、run、evidence、验收或 commit 已发生。

```text
current_plan_version = v7.3-active
current_document = 03-详细设计.md
current_step = Step 7 regression / 7R-04A
current_sub_batch = 7R-04A-A4-P2 reverse maintenance/materialization/global registry audit completed_wait_user_review
current_internal_task = A4-P3 READ-001 ruling and recovery-source synchronization
current_artifact = 03_ddd_step_07_read_maintenance_surfaces.md
gate_status = content_completed_wait_user_review
a4_p1_query_positive_audit = completed
a4_p2_reverse_surface_audit = completed
a4_p3_read_blocker_ruling_and_sync = pending_user_review
query_positive_owner_source_reader_consumer = 13/13_design_only
query_field_layer_closure = 104/104_design_only
query_missing_owner_source_reader_consumer = 0/13
query_duplicate_owner = 0
query_reader_alias = 0
query_writer_use = 0/13
existing_maintenance_reader = 9/9_preserved
maintenance_reader_job_consumer = 9/9
maintenance_reader_orphan = 0
maintenance_reader_duplicate = 0
maintenance_reader_reconciliation_use = 0/1
materialization_source_consumer_closure = 11/11
materialization_writer_duplicate_owner = 0
mutable_logical_roots = 19/19
repository_method_reachability = 57/57
same_uow_groups = 21/21
new_same_uow_group = 0
public_callable_count = 42/42_unchanged
new_public_callable = 0
new_public_status_or_stored_kind = 0
new_l1_l2_blocker = 0
open_blockers = SBX-DDD-GRANULARITY-STEP7-READ-001|SBX-DDD-GRANULARITY-STEP7-OUTCOME-001
existing_implementation_gate = BLK-SBX-CANONICAL-001
formal_03_writeback = forbidden
step_8 = blocked_by_step_7_regression
implementation = CB-SBX-01A blocked / wait_design
real_test_execution = not_started
real_evidence_created = no
acceptance_signoff = no
commit_required = no
next_required_reads = current_artifact_109|step7_control_current|step7_flow_current|project_ledger_current|implementation_ledger_current|reopen_plan_current
next_allowed_action = wait_user_review_before_A4_P3
```

## EOF Current Recovery Override: `7R-04A-A4-P3` completed, `READ-001` resolved, user review pending

本节是文档级 flow 的物理 EOF current authority。A4-P3 已消费 read artifact §110 并完成 `READ-001` 的设计静态裁决；
它不授权 Step 8、正式文档回填、实现、测试或提交。前文 `READ-001=open` 的状态均为历史执行快照。

| item | current result |
|---|---|
| A4-P1 | `[x]`；13/13 Query positive chain，104/104 field closure，design-only |
| A4-P2 | `[x]`；9/9 reader，11/11 materialization，19/19 root，21/21 UoW，42/42 callable reverse audit |
| A4-P3 | `[x]`；`READ-001` ruling、evidence matrix、recovery-source synchronization completed |
| A4 total read audit | completed_wait_user_review；当前停在用户复核门 |
| `READ-001` | `resolved_in_7r_04a_design_static_only` |
| `OUTCOME-001` | `open_wait_s7_03c_s7_05` |
| implementation gate | `BLK-SBX-CANONICAL-001` open；`CB-SBX-01A blocked / wait_design` |

```text
current_plan_version = v7.4-active
current_document = 03-详细设计.md
current_step = Step 7 regression / 7R-04A
current_sub_batch = 7R-04A-A4-P3 READ-001 ruling and recovery-source synchronization completed_wait_user_review
current_internal_task = none; wait user review before next Step 7 owner
current_artifact = 03_ddd_step_07_read_maintenance_surfaces.md
gate_status = content_completed_wait_user_review
a4_p1_query_positive_audit = completed
a4_p2_reverse_surface_audit = completed
a4_p3_read_blocker_ruling_and_sync = completed_wait_user_review
query_positive_owner_source_reader_consumer = 13/13_design_only
query_field_layer_closure = 104/104_design_only
query_missing_owner_source_reader_consumer = 0/13
query_duplicate_owner = 0
query_reader_alias = 0
query_writer_use = 0/13
existing_maintenance_reader = 9/9_preserved
maintenance_reader_job_consumer = 9/9
maintenance_reader_orphan = 0
maintenance_reader_duplicate = 0
maintenance_reader_reconciliation_use = 0/1
materialization_source_consumer_closure = 11/11
mutable_logical_roots = 19/19
repository_method_reachability = 57/57
same_uow_groups = 21/21
public_callable_count = 42/42_unchanged
new_public_callable = 0
new_l1_l2_blocker = 0
resolved_blockers = SBX-DDD-GRANULARITY-STEP7-RELAY-001|SBX-DDD-GRANULARITY-STEP7-JOBS-FINALIZE-001|SBX-DDD-GRANULARITY-STEP7-DISPATCH-001|SBX-DDD-GRANULARITY-STEP7-ENTRY-001|SBX-DDD-GRANULARITY-STEP7-READ-001
open_blockers = SBX-DDD-GRANULARITY-STEP7-OUTCOME-001
read_blocker_status = resolved_in_7r_04a_design_static_only
existing_implementation_gate = BLK-SBX-CANONICAL-001
step_7_total_gate = blocked_by_existing_owner_blockers
formal_03_writeback = forbidden
step_8 = blocked_by_step_7_regression
implementation = CB-SBX-01A blocked / wait_design
real_test_execution = not_started
real_evidence_created = no
acceptance_signoff = no
commit_required = no
next_required_reads = step7_outcome_current|step7_control_current|step7_cross_audit_current|project_execution_ledger_current|implementation_ledger_current|reopen_plan_current
next_allowed_action = wait_user_review_before_next_step7_owner
```

## EOF Current Recovery Override: `7R-05-B1` completed, user review pending

用户确认已消费 `7R-04A-A4-P3` review gate，并按既有 owner 顺序启动 `7R-05`。B1 已完成中间产物，B2 未自动开始；正式 `03`、Step 8 和实现继续冻结。

```text
current_plan_version = v7.5-active
current_document = 03-详细设计.md
current_step = Step 7 regression / 7R-05
current_batch = S7-05 infra adapter / fake parity
current_sub_batch = 7R-05-B1 completed_wait_user_review
current_internal_task = B1 user review gate before common durable/fake semantics
current_artifact = 03_ddd_step_07_infra_adapters_fake_parity.md
gate_status = content_completed_wait_user_review
consumed_review_gates = S7-03C-B1-E|7R-04A-A4-P3
completed_internal_batches = 7R-05-B1
pending_internal_batches = 7R-05-B2,7R-05-B3,7R-05-B4,7R-05-B5
read_blocker_status = resolved_in_7r_04a_design_static_only
open_blockers = SBX-DDD-GRANULARITY-STEP7-OUTCOME-001
outcome_blocker_status = open_wait_7r_05_b2_b5
new_l1_l2_blocker = 0
step_7_total_gate = blocked_by_outcome_owner_in_progress
formal_03_writeback = forbidden
step_8 = blocked_by_step_7_regression
implementation = CB-SBX-01A blocked / wait_design
real_test_execution = not_started
real_evidence_created = no
acceptance_signoff = no
commit_required = no
next_required_reads = current_7r_05_artifact|capture_handoff_current|lifecycle_current|repository_uow_current|step7_control_current
next_allowed_action = wait_user_review_before_7r_05_b2
```

## EOF Current Recovery Override: `7R-05-B2` review consumed, `7R-05-B3` in progress

用户本次“继续”消费了 B2 review gate。按 Step 7 小循环规则，当前只进入 `7R-05-B3`，先写方法级 parity 中间产物；不进入
B4、Step 8、正式 `03` 或 implementation。

```text
current_plan_version = v7.5-active
current_document = 03-详细设计.md
current_step = Step 7 regression / 7R-05
current_batch = S7-05 infra adapter / fake parity
current_sub_batch = 7R-05-B3 capture/handoff/observability per-method parity in_progress
current_module = capture method group
consumed_review_gate = 7R-05-B2
completed_internal_batches = 7R-05-B1,7R-05-B2
pending_internal_batches = 7R-05-B3,7R-05-B4,7R-05-B5
gate_status = in_progress
gate_reason = B3 method groups not yet fully audited
open_blockers = SBX-DDD-GRANULARITY-STEP7-OUTCOME-001
new_l1_l2_blocker = 0
formal_03_writeback = forbidden
step_8 = blocked_by_step_7_regression
implementation = CB-SBX-01A blocked / wait_design
real_test_execution = not_started
real_evidence_created = no
commit_required = no
next_allowed_action = write_7r_05_b3_capture_method_group
source_files = 03_ddd_step_07_infra_adapters_fake_parity.md;03_ddd_step_07_capture_handoff_publisher_observability.md;03_ddd_step_07_trait_port_adapter_contracts.md;03_ddd_step_07_service_facades_inputs_outputs.md;设计文档讨论中间产物规范.md;详细设计讨论流程_SOP.md
```

## EOF Current Recovery Override: `7R-05-B3-C1` completed, `C2` in progress

本节是详细设计校准 flow 的物理 EOF 当前恢复点。C1 已完成 capture 方法组的设计静态审计，当前仅允许继续 handoff
方法组；不得越过 B3 进入 B4、Step 8、正式文档或 implementation。

```text
current_plan_version = v7.5-active
current_document = 03-详细设计.md
current_step = Step 7 regression / 7R-05
current_batch = S7-05 infra adapter / fake parity
current_sub_batch = 7R-05-B3 capture/handoff/observability per-method parity in_progress
current_internal_task = 7R-05-B3-C2 handoff method group
completed_internal_tasks = 7R-05-B3-C1
pending_internal_tasks = 7R-05-B3-C2|7R-05-B3-C3|7R-05-B3-C4|7R-05-B3-C5
gate_status = in_progress
gate_reason = capture parity closed statically; handoff/publisher/ordinary-hook parity pending
open_blockers = SBX-DDD-GRANULARITY-STEP7-OUTCOME-001
new_l1_l2_blocker = 0
formal_03_writeback = forbidden
step_8 = blocked_by_step_7_regression
implementation = CB-SBX-01A blocked / wait_design
real_test_execution = not_started
real_evidence_created = no
acceptance_signoff = no
commit_required = no
next_allowed_action = write_7r_05_b3_handoff_method_group
```

## EOF Current Recovery Override: `7R-05-B3-C2` completed, `C3` current

本节是详细设计校准 flow 的物理 EOF 当前恢复点。C2 handoff `deliver` / `inspect_same_attempt` 的 durable/fake parity 已完成设计
静态审计；C3 先执行 legacy material/observability 负向审计的来源读取门，不进入 C4、B4、Step 8、正式 `03` 或 implementation。

```text
current_plan_version = v7.6-active
current_document = 03-详细设计.md
current_step = Step 7 regression / 7R-05
current_batch = S7-05 infra adapter / fake parity
current_sub_batch = 7R-05-B3 capture/handoff/observability per-method parity in_progress
current_internal_task = 7R-05-B3-C3 legacy material/observability negative audit (source-read gate)
completed_internal_tasks = 7R-05-B1|7R-05-B2|7R-05-B3-C1|7R-05-B3-C2
pending_internal_tasks = 7R-05-B3-C3|7R-05-B3-C4|7R-05-B3-C5|7R-05-B4|7R-05-B5
gate_status = in_progress
gate_reason = C2 design-static parity complete; C3-C5 and B4-B5 remain open
open_blockers = SBX-DDD-GRANULARITY-STEP7-OUTCOME-001
read_blocker_status = resolved_in_7r_04a_design_static_only
new_l1_l2_blocker = 0
formal_03_writeback = forbidden
step_8 = blocked_by_step_7_regression
implementation = CB-SBX-01A blocked / wait_design
real_test_execution = not_started
real_evidence_created = no
acceptance_signoff = no
commit_required = no
next_required_reads = 详细设计讨论中间产物规范.md|详细设计讨论流程_SOP.md|03_ddd_step_07_capture_handoff_publisher_observability.md|03_ddd_step_07_trait_port_adapter_contracts_regression_control.md|03_ddd_step_07_infra_adapters_fake_parity.md|project_execution_ledger.md|implementation_execution_ledger.md
next_allowed_action = read_7r_05_b3_c3_sources_then_write_legacy_negative_audit
```

## EOF Current Recovery Override: `7R-05-B3-C3` completed, user review gate

这是当前详细设计校准 flow 的唯一有效恢复点。C3 只完成设计静态审计和中间产物收口；用户未复核前不得进入 C4。C4、C5、B4、
B5、Step 8、正式 `03` 和 implementation 均保持冻结。

```text
current_plan_version = v7.7-active
current_document = 03-详细设计.md
current_step = Step 7 regression / 7R-05
current_batch = S7-05 infra adapter / fake parity
current_sub_batch = 7R-05-B3 capture/handoff/observability per-method parity completed_wait_user_review
current_internal_task = 7R-05-B3-C3 legacy material/observability negative audit completed_wait_user_review
completed_internal_tasks = 7R-05-B1|7R-05-B2|7R-05-B3-C1|7R-05-B3-C2|7R-05-B3-C3
pending_internal_tasks = 7R-05-B3-C4|7R-05-B3-C5|7R-05-B4|7R-05-B5
gate_status = content_completed_wait_user_review
gate_reason = C3 static closure complete; explicit user review required before publisher seam
open_blockers = SBX-DDD-GRANULARITY-STEP7-OUTCOME-001
outcome_blocker_status = open_wait_7r_05_b3_c4_b5
read_blocker_status = resolved_in_7r_04a_design_static_only
new_l1_l2_blocker = 0
new_public_callable = 0
new_public_status_or_stored_kind_or_repository_or_identity = 0/0/0/0
formal_03_writeback = forbidden
step_8 = blocked_by_step_7_regression
implementation = CB-SBX-01A blocked / wait_design
real_test_execution = not_started
provider_conformance = not_started
real_evidence_created = no
acceptance_signoff = no
commit_required = no
next_required_reads = current_7r_05_c3_artifact|current_capture_handoff_source|current_step7_control|current_project_ledger|current_implementation_ledger|current_reopen_plan
next_allowed_action = wait_user_review_before_7r_05_b3_c4
```

## PHYSICAL EOF Current Recovery Override: DesignReopen static closeout (`v7.8`)

用户已明确取消本轮剩余逐Step停审并授权一次性收口。Step 7 C4/C5/B4/B5 与 Step 10 canonical inventory均完成设计静态复核；当前只允许同步正式`03~07`、ledger和planned boundary,不进入实现。

```text
current_plan_version = v7.8-closeout
current_document = 03-详细设计.md
current_step = Step 19 DesignReopen reassembly and downstream propagation
step_7_outcome_blocker = resolved_for_design_static_closeout
step_10_state_inventory = completed_30_state_machines_31_step10_enums_39_shared_declarations
state_inventory_blocker = resolved_after_downstream_static_revalidation
formal_03_writeback = allowed_and_in_progress
new_l1_l2_blocker = 0
implementation = CB-SBX-01A blocked / wait_design
real_test_execution = not_started
provider_conformance = not_started
real_evidence_created = no
acceptance_signoff = no
commit_required = no
next_required_reads = 03_ddd_step_19_formal_document_assembly.md|03-详细设计.md|04-配置设计.md|05-测试方案.md|06-验收标准.md|07-实施计划.md|implementation_execution_ledger.md
next_allowed_action = complete_design_only_downstream_reassembly
```

## PHYSICAL EOF Current Recovery Override: formal `03` current contract closed

正式 `03-详细设计.md` 已按 DesignReopen current source 完成设计静态回填：capture、per-target handoff、publisher、ordinary
observability hook、`30 / 31 / 39` 状态库存与既存下游材料状态均已收口。这里的 `closed` 仅指设计文档一致性，不表示实现、
测试、provider conformance、evidence 或验收完成。

```text
current_plan_version = v7.8-closeout
current_document = 03-详细设计.md
current_step = Step 19 DesignReopen formal reassembly completed
step_7_outcome_blocker = resolved_for_design_static_closeout
step_10_state_inventory = completed_30_state_machines_31_step10_enums_39_shared_declarations
formal_03_writeback = completed_design_static_only
downstream_static_revalidation = in_progress_04_through_07
implementation = CB-SBX-01A blocked / activation_gate / wait_design
real_test_execution = not_started
provider_conformance = not_started
real_evidence_created = no
acceptance_signoff = no
commit_required = no
next_required_reads = 04_config_step_03_control_plane.md|04_config_calibration_flow.md|04-配置设计.md
next_allowed_action = propagate_current_binding_to_04
```

## PHYSICAL EOF Current Recovery Override: `v7.9-closeout`

本节是本 flow 的唯一 current 恢复点，覆盖前述 Step 7 等待审查和 `v7.8` 下游传播中间状态。用户已授权本轮一次性完成剩余
设计收口；以下结论只表示设计静态完成，不表示实现、测试、provider conformance、evidence、验收或 commit 已发生。

```text
current_plan = /tmp/L4-sandbox_design_reopen_accelerated_execution_plan.md
current_plan_version = v7.9-closeout
current_document = 03-详细设计.md
current_step = Step 19 current formal reassembly completed
current_module = formal_document_closeout
design_status = completed_current_closeout
step_7_outcome_blocker = resolved_for_design_static_closeout
actor_authority_blocker = resolved_for_design_static_closeout
step_10_state_inventory = completed_30_owner_state_machines_31_step10_enum_entries_39_shared_declarations
formal_03_writeback = completed_design_static_only
downstream_static_revalidation = completed_04_through_07
current_contract_lock = CaptureCollectionPort|HandoffTargetDeliveryPort|SandboxEventPublisherPort|ordinary_observability_hook
historical_only_names = ExecutionCapturePort|MaterialHandoffPort|ObservabilityMaterialPort|MaterialHandoffAdapterOutcome|generic_adapter_outcome
new_l1_l2_blocker = 0
current_boundary = CB-SBX-01A
implementation = blocked|activation_gate|wait_design
implementation_repo_exists = no
real_test_execution = not_started
provider_conformance = not_started
real_evidence_created = no
acceptance_signoff = no
commit_required = no
next_required_reads = project_execution_ledger.md|implementation_execution_ledger.md|07-实施计划.md|CB-SBX-01A.md
next_allowed_action = fixed_design_baseline_then_close_01A_activation_prerequisites
```

## PHYSICAL EOF Current Recovery Override: final design closure calibration (`DC-03`)

本节覆盖此前所有恢复快照，授权 Step 19 消费 Step 14/15 最终裁决。`03` 的 schema、port、state、flow、UoW、
error、idempotency 与 owner machine 不重开；本轮只回填 Rust/core、canonical artifact、Shell/lint 精确技术绑定及
Activation 验证边界。

```text
current_plan = /tmp/L4-sandbox_final_design_closure_execution_plan.md
current_plan_version = v1.0
current_document = 03-详细设计.md
current_step = Step 19 post-closeout technical baseline backfill authorized
flow_status = completed_current_closeout_pending_DC-04_formal_backfill
subject_contract_reopen = no
technical_binding_source = 07_implementation_plan_step_15_technical_baseline_decisions.md
next_allowed_action = DC-04_backfill_formal_03_technical_baseline
commit_required = no
```

## PHYSICAL EOF Current Override: `DC-06` current-truth repair authorized

```text
current_plan = /tmp/L4-sandbox_final_design_closure_execution_plan.md
current_document = 03-详细设计.md
current_step = Step 19 final static audit repair
flow_status = current_truth_repair_authorized
subject_contract_reopen = no
formal_delta = section_16_3_boundary_route|section_16_4_config_disposition
current_boundary_status = blocked|activation_gate|handoff
config_contract_status = resolved_by_downstream_design
implementation_started = no
real_test_execution = not_started
real_evidence_created = no
acceptance_signoff = no
next_allowed_action = update_formal_03_current_disposition_only
commit_required = no
```

## PHYSICAL EOF Current Override: `DC-06` completed, `DC-07` current

```text
current_plan = /tmp/L4-sandbox_final_design_closure_execution_plan.md
current_document = 03-详细设计.md
current_step = DC-06 current-truth repair and final audit completed
flow_status = completed_design_static_only
formal_delta = section_16_3_boundary_route|section_16_4_config_disposition
design_conclusion = design_closed_ready_for_baseline_publication
project_current_document = 07-实施计划.md
project_current_step = Step 18 baseline publication disposition
current_dc_task = DC-07
design_baseline = not_fixed
current_boundary_status = blocked|activation_gate|handoff
implementation_started = no
real_test_execution = not_started
real_evidence_created = no
acceptance_signoff = no
next_allowed_action = DC-07_record_baseline_publication_disposition
commit_required = no
```

## PHYSICAL EOF Current Override: `DC-07` disposition completed

```text
current_plan = /tmp/L4-sandbox_final_design_closure_execution_plan.md
current_document = 03-详细设计.md
current_step = DC-07 baseline publication disposition consumed
flow_status = completed_design_static_only
project_design_status = closed_without_baseline_publication
completed_dc_tasks = DC-00|DC-01|DC-02|DC-03|DC-04|DC-05|DC-06|DC-07
project_current_design_task = none
design_conclusion = design_closed_ready_for_baseline_publication
design_baseline = not_fixed
baseline_publication_disposition = completed_without_publication
baseline_publication_status = not_published
commit_authorization = absent
current_boundary_status = blocked|activation_gate|handoff
implementation_started = no
real_test_execution = not_started
real_evidence_created = no
acceptance_signoff = no
next_allowed_action = wait_explicit_commit_authorization
commit_required = no
```
