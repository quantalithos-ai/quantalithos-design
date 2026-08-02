# Step 19. 整理正式详细设计文档

> 对应 SOP: `standards/document/详细设计讨论流程_SOP.md` Step 19
> 书写规范: `standards/document/详细设计书写规范.md`
> 回填章节: `projects/L4-sandbox/03-详细设计.md`
> 生成日期: 2026-07-09
> 状态: completed_current_closeout_v7.9
> 所属流程: `03_ddd_calibration_flow.md`
> 本 Step 口径: 本步只把 Step 1~18 已完成的详细设计校准结论装配为正式 `03-详细设计.md`,并更新详细设计 flow 与项目台账。本步不创建目标实现仓、不创建 implementation ledger、不创建 planned boundary skeleton、不写代码、不写真实测试结果、run_id、evidence alias、验收签署或 commit boundary。

---

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 19 整理正式详细设计文档 |
| 当前状态 | DesignReopen current reassembly 已完成；正式 `03` 为 current 设计基线 |
| 输入基线 | `03_ddd_step_01_upstream_boundary.md` through `03_ddd_step_18_risks_open_questions.md` |
| 输出文件 | `projects/L4-sandbox/design-calibration/03_ddd_step_19_formal_document_assembly.md`;`projects/L4-sandbox/03-详细设计.md` |
| 停审方式 | 本 Step 与下游 `04~07` 静态传播均已完成；当前停在设计链 closeout，不进入实现 |

---

## 2. 本步目标

本 Step 将 `03` Step 1~18 已确认的详细设计校准结论装配为正式 `03-详细设计.md`。正式文档采用 `详细设计书写规范.md` 的 18 章主链,作为实现者阅读入口、跨 Step 索引和正式边界声明。

正式 `03` 的职责是:

- 固定 `L4-sandbox` 的正式详细设计入口和章节主链。
- 每章列出具体 `design-calibration` 校准来源和延伸阅读入口。
- 汇总目标实现仓、workspace 多 crate 布局、七模块主轴、对象 / port / protocol / flow / state / persistence / error / idempotency / config / observability / test cut / handoff / risk 结论。
- 保留可落码级关键表,但不复制 Step 6~10 的全部字段级对象契约、trait 签名、DTO schema、逐接口 flow 和状态矩阵全集。
- 明确当正式 `03` 摘要不足以落码时,实现者必须读取对应 Step 文件;读取后仍不闭合时暂停回设计修正,不得自行补 schema、状态、port、配置、测试证据或 phase boundary。

本步不做:

- 不进入 `04-配置设计.md`。
- 不补写 `05/06/07`。
- 不创建 implementation ledger 或 planned boundary skeleton。
- 不伪造目标实现仓存在、真实测试结果、run_id、evidence alias、验收签署或 commit。

---

## 3. 本步输入

| 输入 | 状态 | 用途 |
|---|---|---|
| `03_ddd_step_01_upstream_boundary.md` | 已完成 | 上游关系、旧 `03` historical material 定位和正式输入边界 |
| `03_ddd_step_02_scope.md` | 已完成 | 目标、范围、非范围和实现者可完成范围 |
| `03_ddd_step_03_constraints.md` | 已完成 | Rust、源码语言、依赖、提交规范和目标仓前置检查 |
| `03_ddd_step_04_file_layout.md` | 已完成 | workspace、crate、package、binary 和 planned 文件布局 |
| `03_ddd_step_05_module_contracts.md` | 已完成 | 七模块主轴、职责、依赖方向和归属门禁 |
| `03_ddd_step_06_object_contracts.md` | 已完成 | 对象、字段、函数、状态 enum、invariant、非 core carrier 和字段 / 状态审计 |
| `03_ddd_step_07_trait_port_adapter_contracts.md` | 已完成 | service facade、repository、UoW、resolver、backend、handoff、publisher、idempotency、stored result、runtime builder 和 fake parity |
| `03_ddd_step_08_protocol_contracts.md` | 已完成 | 10 Command、13 Query、9 Inbound Consumer、13 Outbound Event、10 Operations Job 协议 |
| `03_ddd_step_09_function_flows.md` | 已完成 | 55 个函数级 flow、事务顺序、side effect、no-write、no-rollback 和 job no-repair |
| `03_ddd_step_10_state_matrix.md` | 已完成并定向回查 | 30 个 owner-level 状态机、31 个 Step 10 enum entries、39 个 Step 6 shared declarations、正式状态名和非法迁移口径 |
| `03_ddd_step_11_persistence_transaction_consistency.md` | 已完成 | logical store、repository 语义、UoW、version、cursor、projection、relay 和 stored replay |
| `03_ddd_step_12_error_recovery.md` | 已完成 | 错误 taxonomy、异常分支、恢复 / 不恢复口径、dead-letter、quarantine 和 no-write / no-repair violation |
| `03_ddd_step_13_concurrency_idempotency.md` | 已完成 | 并发、幂等键、digest、duplicate replay、expected version、race guard 和 fake / durable parity |
| `03_ddd_step_14_config_external_binding.md` | 已完成 | config owner、runtime builder、adapter binding、外部依赖、inbound / outbound binding 和禁止配置化边界 |
| `03_ddd_step_15_observability_audit.md` | 已完成 | runtime log、metric、audit trace、relay / handoff marker、job report、diagnostic issue 和 redaction |
| `03_ddd_step_16_test_cuts.md` | 已完成 | 模块、接口、状态机、一致性 / 幂等 / 并发、错误 / 配置 / 观测测试切口 |
| `03_ddd_step_17_implementation_handoff.md` | 已完成 | 实施承接清单、前置阅读、字段 / DTO / Query / 状态 / phase boundary 预复核 |
| `03_ddd_step_18_risks_open_questions.md` | 已完成 | 风险、待确认事项、阻塞转换规则和 historical material / blocker 台账 |
| `projects/L4-sandbox/00-需求文档.md` | current baseline | 正式需求边界 |
| `projects/L4-sandbox/01-架构设计.md` | current baseline | 正式架构边界 |
| `projects/L4-sandbox/02-概要设计.md` | current baseline | 正式概要输入 |
| 旧 `projects/L4-sandbox/03-详细设计.md` | historical material | 只用于确认旧主线被重建替换,不得继承 |

---

## 4. 装配策略

| 正式章节 | 校准来源 | 装配策略 |
|---|---|---|
| 1. 与上游文档的关系声明 | Step 1 | 声明正式 `00/01/02` 为输入,旧 `03` 只作 historical material |
| 2. 本次详细设计目标与范围 | Step 2 | 汇总目标、覆盖范围、非范围和实现者可完成范围 |
| 3. 实现约束与编码规范承接 | Step 3 | 汇总 Rust、源码英文、git / commit、唯一编译期依赖和禁止依赖 |
| 4. 实现单元与文件布局 | Step 4 | 摘录 workspace 多 crate、package / crate / binary、planned 文件布局和 path dependency |
| 5. 模块实现契约 | Step 5~7 | 以 `contracts/domain/application/infra/api/worker/jobs` 七模块为主轴,汇总对象 / port / adapter / 错误 / 测试切口 |
| 6. 全局对象 / Trait / API 索引 | Step 6~8 | 提供对象、port 和协议索引,不新增设计判断 |
| 7. API / Command / Query / Event / Job 协议契约 | Step 8 | 固定 55 个协议 surface、shared carrier、page / receipt / report / authority / stored replay 规则 |
| 8. 逐接口函数级处理流 | Step 9 | 固定 55 个 flow inventory、共享模板和硬边界 |
| 9. 状态机与转换矩阵 | Step 10 | 汇总 30 个 owner-level 状态机、31 个 Step 10 enum entries、39 个 shared declarations、状态矩阵规则和非法迁移口径 |
| 10. 数据持久化、事务与一致性契约 | Step 11 | 汇总数据所有权、logical store、repository、UoW、cursor、projection、relay 和 fake parity |
| 11. 错误模型、异常分支与恢复口径 | Step 12 | 汇总错误类型、映射、异常分支和恢复 / 禁止恢复 |
| 12. 并发、幂等与重入保护 | Step 13 | 汇总并发场景、idempotency key、digest、duplicate replay 和重入保护 |
| 13. 配置引用与外部依赖绑定 | Step 14 | 汇总配置读取边界、config section、外部依赖和跨仓 Rust 依赖 |
| 14. 可观测性与审计埋点契约 | Step 15 | 汇总 log、metric、audit、trace、diagnostic 和 redaction |
| 15. 测试切口与最小验证清单 | Step 16 | 汇总模块、协议、状态、一致性、错误、配置、观测测试切口 |
| 16. 详细设计到实施计划的承接清单 | Step 17 | 汇总实施承接、前置阅读、跨文档复核和 `07` 审计输入 |
| 17. 风险与待确认事项 | Step 18 | 汇总风险、待确认事项和进入实现前 blocker 转换规则 |
| 18. 参考 | Step 1~19 + standards | 固定正式引用索引 |

---

## 5. SOP 问题回答

| SOP 问题 | 本步回答 |
|---|---|
| 正式文档是否按书写规范章节主链组织 | 是。正式 `03-详细设计.md` 使用 18 章主链,且每章均有校准来源和延伸阅读。 |
| 第 5 章是否以模块为主轴 | 是。第 5 章以 `contracts/domain/application/infra/api/worker/jobs` 七模块展开职责、文件、对象族、port / adapter、错误和测试切口。 |
| 对象、trait、协议、处理流、状态机是否互相可回指 | 是。正式第 5~10 章提供对象、port、protocol、flow、state、repository 的交叉索引;字段级细节回指 Step 6~11。 |
| 字段闭环、DTO 构造闭环、状态闭环和 phase boundary 是否通过复核 | 已按 Step 17 预复核通过。正式实现前仍要求 `07` 对正式 `03/04/05/06/07` 逐 phase / commit boundary 重复核。 |
| 其他 agent 是否可以按本文 1:1 实现代码 | 可以以正式 `03` 为入口,按每章来源读取对应 Step 文件后落码。若对应 Step 仍不足,必须暂停回设计,不得实现侧自由补字段、schema、状态、配置或测试证据。 |
| 是否有内容误放到测试方案、实施计划、配置设计或运维手册 | 未误放。正式 `03` 只保留代码实现契约和最小测试切口;完整配置、测试、验收、phase / commit、部署和运维留给后续正式文档。 |
| 本文是否明确提供给 `07` 交付实现前整体审计所需输入 | 是。第 16 章列出 `07` 必须审计的对象、协议、flow、状态、持久化、错误、幂等、配置、观测、测试切口和 blocker 回流输入。 |

---

## 6. 正式装配修正

| 项 | 修正口径 |
|---|---|
| 旧正式 `03` 主线 | 已被重建替换。旧“五段对象 / 单 crate / provider bridge / artifact body / observability store / Docker-gVisor 硬选型”只保留为 historical material,不得进入新版实现。 |
| 正式章节数 | 采用新版书写规范 18 章结构,不沿用旧“15 节结构”。 |
| 协议数量 | 正式 `03` 统一为 10 Command、13 Query、9 Inbound Consumer、13 Outbound Event、10 Operations Job,总计 55 个需要 flow 覆盖的协议。 |
| 模块主轴 | 正式 `03` 使用 7 个 workspace member / module,不是 6 个业务组成部分拆 crate,也不是旧五段对象拆 module。 |
| 字段级契约落点 | 字段 / DTO / trait / flow / state 全量契约仍以 Step 6~10 为真相源;正式 `03` 作为入口和关键摘要,不制造第二真相源。 |
| 目标实现仓 | `/home/aris/Projects/quantalithos-sandbox` 当前未确认存在,继续作为 `07` implementation precheck,不得在正式 `03` 写成已存在事实。 |
| 下游文档 | 正式 `04~07` 已完成 full-restart 装配和 DesignReopen 定向传播；测试仍未执行，验收仍 `NotEntered`。 |
| 实施材料 | implementation ledger 与 32 /32 planned boundary skeleton 已由正式 `07` 创建；`CB-SBX-01A` 仍 blocked，目标实现仓文件、脚本或代码均未创建。 |

---

## 7. 自检清单

| 检查项 | 结果 | 说明 |
|---|---|---|
| 承接概要设计 | [x] | 正式 `03` 承接正式 `00/01/02` 与 Step 1~18。 |
| 每章保留校准来源入口 | [x] | 18 个正式章节均列出具体 Step 文件。 |
| 按模块展开 | [x] | 第 5 章以七模块为主轴。 |
| 文件路径明确 | [x] | 第 4 / 5 章列出 workspace、crate、binary 和关键文件组。 |
| 对象字段有类型和注释 | [x] | 字段级完整契约位于 Step 6,正式第 5 / 6 章索引并要求读取。 |
| 函数签名有参数类型和返回类型 | [x] | port / repository 签名位于 Step 7,formal §5 / §6 / §8 给入口。 |
| 每个关键协议有处理流 | [x] | 55 个协议由 Step 8 / 9 覆盖。 |
| 状态机和事务边界明确 | [x] | Step 10 / 11 覆盖,正式 §9 / §10 汇总。 |
| 字段闭环和 DTO 构造闭环通过 | [x] | Step 17 预复核通过,正式 §16 要求 `07` 重复核。 |
| 状态、测试、验收和实施 phase 使用同一套正式名称 | [x] | 当前 `03` 使用 Step 10 / 16 名称;后续 `05/06/07` 必须继续承接。 |
| phase boundary 没有引用未来对象或证据 | [x] | 本文不定义 phase / commit boundary,不伪造实现证据。 |
| 已为 `07` 提供交付实现前闭环审计输入 | [x] | 正式 §16 提供输入清单。 |
| 测试切口明确 | [x] | 正式 §15 承接 Step 16。 |
| 未越界创建实现事实 | [x] | ledger / skeleton 只是 planned 设计产物；未创建目标仓代码、run、evidence、验收或 commit 事实。 |

---

## 8. 进入后续文档条件

| 条件 | 状态 | 说明 |
|---|---|---|
| 正式 `03-详细设计.md` 已按 18 章主链装配 | 通过 | 本 Step 已重建正式 `projects/L4-sandbox/03-详细设计.md`。 |
| 每章校准来源明确 | 通过 | 每章开头均列出具体中间产物。 |
| 旧 `03` 旧主线已移除 | 通过 | 正式 `03` 已重建为新版七模块 /55 协议 /30 owner-level 状态机口径。 |
| 未把风险写成已确认契约 | 通过 | §17 保留 open downstream / implementation precheck。 |
| 下游静态传播 | 通过 | 正式 `04~07` 已完成 current 定向回查；下一合法动作是固定设计 baseline 并关闭 `CB-SBX-01A` activation prerequisites。 |

---

## 9. DesignReopen 正式重装配覆盖（`v7.9-closeout`）

本节是物理 EOF 的 current 裁决，覆盖本文前述 `29` 状态机、下游文档缺失和实施材料未创建等历史装配快照。Step 7
outcome owner 与 Step 10 状态库存已完成设计静态重审，正式 `03` 只允许从以下 current source 回填；不从旧正式文档、README
或本文件被覆盖段落反向恢复旧 port、outcome 或计数。

| 装配面 | current canonical 结论 | 正式落点 |
|---|---|---|
| capture callable | `CaptureCollectionPort::{collect_capture, inspect_capture}` | 正式 `03` §5~§8 |
| handoff callable | `HandoffTargetDeliveryPort::{deliver, inspect_same_attempt}` | 正式 `03` §5~§8 |
| historical invalid surface | `ExecutionCapturePort`;`MaterialHandoffPort`;`ObservabilityMaterialPort`;`MaterialHandoffAdapterOutcome`;generic adapter outcome | 只保留为 `historical_material`，不得出现在 current 正向索引 |
| handoff opening | command UoW 创建 source material、target plan、attempt/progress 与 `HandoffFact`；opening 不直接调用 delivery adapter | 正式 `03` §8 |
| publisher | 消费已提交 frozen relay bundle 与 exact attempt；每 attempt 最多一次 external call；unknown 只 inspect same attempt；失败不回滚 source truth | 正式 `03` §5、§8、§10、§14 |
| ordinary observability hook | post-return / post-inspection、body-free、低基数、失败隔离；不改 truth、UoW、identity、retry、public result 或 stored replay | 正式 `03` §5、§14 |
| 状态库存 | 30 owner-level state machines；31 个 Step 10 canonical status enum entries；39 个 Step 6 shared status declarations | 正式 `03` §1、§5、§9、§15~§17 |
| 稳定新增测试槽 | `STA-031 = HandoffTargetProgressStatus`；不重编号 `STA-001~030` | 正式 `05~07` 与 `CB-SBX-12A` |
| 下游正式文档 | 正式 `04~07` 已存在并完成 full-restart 装配 | 正式 `03` §16~§18 |
| 实施材料 | implementation ledger 与 32 /32 planned boundary skeleton 已存在 | 正式 `03` §16~§18；正式 `07` |

### 9.1 下游设计库存增量

新增 `STA-031` 是一条 P0-C 设计用例，不改变 55 protocol、38 typed error、14 family、16 suite、7 gate 或 32 boundary。
因此 current 静态库存必须机械传播为：

```text
state_test_inventory = STA-001..STA-031
total_tc_design_inventory = 254
p0_c_design_inventory = 237
p0_q_design_inventory = 13
conditional_design_inventory = 4
p0_design_inventory = 250
```

上述数字仅表示设计清单，未执行任何测试，也未形成 run、evidence、review、验收或签署事实。

### 9.2 重装配门禁

| 检查项 | current 结论 |
|---|---|
| Step 7 C4/C5/B4/B5 | `completed_design_static_only` |
| `SBX-DDD-GRANULARITY-STEP7-OUTCOME-001` | `resolved_for_design_static_closeout` |
| Step 10 canonical inventory | `30 / 31 / 39` 已固定 |
| 正式 `03~07` 传播 | `completed_design_static_only`；由项目台账物理 EOF 记录 |
| `CB-SBX-12A` 传播 | 已更新 planned contract；boundary 未激活 |
| actor authority | Sandbox 私有 `Maintenance` / `TrustedSource` kind 已从 current 正向协议删除；worker / job 为 core `ActorKind::System` only |
| 新 L1/L2 blocker | 0 |
| 实现、测试、provider conformance、evidence、验收、commit | 均未开始 / 未形成 |

```text
current_plan_version = v7.9-closeout
current_document = 03-详细设计.md
current_step = Step 19 DesignReopen formal reassembly
formal_03_writeback = completed_design_static_only
downstream_static_revalidation = completed_04_through_07
implementation = CB-SBX-01A blocked / activation_gate / wait_design
commit_required = no
next_allowed_action = fixed_design_baseline_then_close_01A_activation_prerequisites
```

## 10. Formal `03` writeback result

| 检查面 | 回填结果 |
|---|---|
| current ports | `CaptureCollectionPort`、`HandoffTargetDeliveryPort`、`SandboxEventPublisherPort` 已进入正式索引与 flow |
| capture | `CaptureFactStatus` 无 `Pending`，`CaptureFact::record(...)` 创建即定格 |
| handoff | opening 保存 fixed target plan + complete progress set，delivery call = 0；per-target attempt-before-call / same-attempt recovery 已进入 persistence 和 test cut |
| relay | frozen committed bundle + exact attempt，success=`Published`，unknown 不猜状态，source truth 不回滚 |
| ordinary hook | post-return / post-inspection、body-free、低基数、failure isolated |
| inventories | 30 owner-level state machines / 31 Step 10 enum entries / 39 shared declarations |
| downstream status | 正式 `04~07`、implementation ledger 和 32 /32 boundary skeleton 的存在性已如实回填 |

```text
formal_03_writeback = completed_design_static_only
downstream_static_revalidation = completed_04_through_07
actor_authority_regression = resolved_for_design_static_closeout
implementation_started = no
tests_executed = no
evidence_created = no
acceptance_entered = no
commit_required = no
```

## 11. Final technical-baseline assembly authorization (`DC-03`)

正式 `03` 获准增加精确实现绑定，不改变既有业务契约：

- Rust/core：edition `2024`、rust-version `1.93`、toolchain `1.93.0`、resolver `2`、local `core-contracts` required
  revision `ef0d24941fe6e00c24d423ac330347e6e1acb2da`。
- canonical artifact：`serde_json_canonicalizer = "=0.3.2"`、`serde_json = "=1.0.145"` + `float_roundtrip`、
  `sha2 = "=0.10.9"`，唯一 writer/verifier、strict duplicate-key parse、自摘要排除和 exact-byte verification。
- Shell：Bash `>=5.2`、strict mode/IFS/umask/locale、ShellCheck `0.10.0`、`0/2/3/4/5/6/>=7` 状态映射。

以上均为设计选择；target dependency resolution、fixture、syntax/lint 和 build 尚未运行。

```text
assembly_authorization = DC-04_formal_03_exact_technical_binding
subject_contract_reopen = no
activation_verification = not_started
next_allowed_action = update_formal_03_then_continue_authorized_closeout
```

## 12. DC-06 current-truth audit repair authorization

Step 17发现正式§16.3仍写历史`01A wait_design`，§16.4仍把已由正式`04`闭合的raw config合同写为未闭口。
允许只修正这两处current disposition；主体详细设计和库存不变。

```text
assembly_authorization = DC-06_formal_03_current_truth_repair
subject_contract_reopen = no
config_contract_status = resolved_by_downstream_design
boundary_route = blocked|activation_gate|handoff
next_allowed_action = update_formal_03_current_disposition_only
```

## 13. PHYSICAL EOF DC-06 final audit disposition

前述授权已被正式 `03` 精确消费：§16.3 的 current Boundary 路由已更新为
`blocked / activation_gate / handoff`，§16.4 的配置合同状态已更新为 `resolved_by_downstream_design`。详细设计主体与
30/31/39、64 等库存均未改变。

```text
dc_06_assembly_disposition = exact_formal_delta_completed
formal_03_delta = section_16_3_boundary_route|section_16_4_config_disposition
subject_contract_reopen = no
inventory_changed = no
runtime_fact_created = no
design_audit_status = completed_design_static_only
```
