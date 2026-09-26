# Step 19. 正式 `03-详细设计.md` 装配校准

> 本文件是 Step 19 的装配中间产物。它定义正式文档如何从 Step 1～18 校准结果重建，不是正式详细设计正文。
> 本步采用 `full-restart`：旧正式 `03-详细设计.md`、README 和 draft 只作为 `historical_material`，不得复制其章节、类型、状态或实现假设。

## 1. Step 状态与装配门禁

| 项目 | 状态 |
|---|---|
| 当前 Step | `19 / formal_assembly / full_restart` |
| Step 状态 | `completed / stop_review` |
| `gate_status` | `formal_stop_review` |
| 正式 03 写入 | `closed`；只有用户明确授权回流才可重开 |
| 正式 04～07 | 不允许创建或修改 |
| 实现仓 / implementation ledger / boundary skeleton | 不创建 |
| 测试、artifact、report、evidence、verdict、signoff、readiness | 不创建、不运行、不声称 |
| 完成动作 | 已进入 `formal_stop_review`；等待用户明确授权 04 |

## 2. 正式章节主链与唯一校准来源

| 正式章节 | 主要校准来源 | 装配内容边界 |
|---|---|---|
| §1 与上游文档关系 | `03_ddd_step_01_upstream_boundary.md` | 只承接 00/01/02 与 owner 边界，不重定义需求/架构。 |
| §2 目标与范围 | `03_ddd_step_02_scope.md` | 实现契约目标、P0/P1 与非范围。 |
| §3 实现约束 | `03_ddd_step_03_coding_runtime_constraints.md` | TypeScript/ESM、Node-compatible、strict、依赖/提交/安全约束。 |
| §4 单元与文件布局 | `03_ddd_step_04_units_file_layout.md` | single package、planned tree、feature-first/layer-within-feature、adapter/composition 边界。 |
| §5 模块实现契约 | `03_ddd_step_05_module_contracts_axis.md`、`03_ddd_step_06_object_contracts.md`、`03_ddd_step_07_trait_port_adapter_contracts.md` | 五 feature、29 对象、port/repository/UoW、adapter matrix；正文只收口，不复制诊断过程。 |
| §6 全局索引 | Step 6/7/8 的 inventory | 29 对象、port、adapter、10/13/3/3 协议索引。 |
| §7 协议契约 | `03_ddd_step_08_protocol_contracts.md` | closed DTO/envelope/result/view/page/receipt/job schemas；Outbound Event N/A。 |
| §8 函数级处理流 | `03_ddd_step_09_function_flows.md` | 29 独立 flow、调用顺序、UoW/effect/unknown/禁止副作用。 |
| §9 状态机 | `03_ddd_step_10_state_matrix.md` | 17 状态主语、正式值、合法/非法迁移。 |
| §10 持久化/事务 | `03_ddd_step_11_persistence_transaction_consistency.md` | logical stores、version/UoW、atomic visibility、commit ambiguity、append-only provenance。 |
| §11 错误/恢复 | `03_ddd_step_12_error_recovery.md` | error family、known/unknown、quarantine、recovery matrix。 |
| §12 并发/幂等 | `03_ddd_step_13_concurrency_idempotency.md` | namespaced keys、digest、locks、reentry、duplicate replay。 |
| §13 配置/依赖 | `03_ddd_step_14_config_dependencies.md` | typed config/capability snapshot、runtime composition、hard safety rules。 |
| §14 观测/审计 | `03_ddd_step_15_observability_audit.md` | closed telemetry、redaction、durable traceability、sink isolation。 |
| §15 测试切口 | `03_ddd_step_16_test_cuts.md` | 10 Command、13 Query、3 Consumer、3 Job、17 state、consistency/error/config/obs cuts。 |
| §16 实施承接 | `03_ddd_step_17_implementation_handoff.md` | 十类闭环、阅读清单、07 boundary 输入；不定义 phase。 |
| §17 风险/待确认 | `03_ddd_step_18_risks_open_questions.md` | blocker、责任方、未确认前姿态。 |
| §18 参考 | Step 1～18 实际读取材料 | 只列真实使用的设计/规范文件。 |

## 3. 装配规则

1. 正式文档每章开头必须有具体 `design-calibration/...` 校准来源块和延伸阅读说明。
2. 正式正文只写收口结论；SOP 问答、旧材料诊断、方案取舍、模块停审和过程日志留在 calibration。
3. 类型、字段、状态、函数、协议、flow 和错误不得在正式正文另造同义名；如需压缩，必须保留可回指的 exact 名称。
4. 对外 owner 只写 ref/snapshot/decision layer；Sync 不拥有 Project、Artifact、Baseline、Review Gate、Workspace projection、Archive 或 Git remote truth。
5. `blocked/unsupported/needs_action/unknown/probe_required/quarantined/not_applicable` 必须作为真实设计姿态保留；不得写成 ready/success。
6. 不写真实实现、commit、run、测试结果、artifact、report、evidence、verdict、signoff 或 readiness。
7. 不创建 implementation ledger 或 boundary skeleton；这些只能在正式 07。

## 4. 装配批次

| 批次 | 章节 | 状态 |
|---|---|---|
| 19.1 | 文档元信息、§1～§4 | completed |
| 19.2 | §5～§6 模块、对象、port、索引 | completed |
| 19.3 | §7～§9 协议、flow、状态 | completed |
| 19.4 | §10～§15 persistence、error、concurrency、config、observability、tests | completed |
| 19.5 | §16～§18 handoff、risks、references | completed |
| 19.6 | 全文静态审计、污染扫描、diff check、停审回写 | completed |

## 5. 正式文档静态审计结果

| 审计项 | 结果 | 结论 |
|---|---|---|
| 主链完整 | pass | 存在 §1～§18，顺序与详细设计书写规范一致。 |
| 校准可追溯 | pass | 18 个正式章节各有具体 calibration 来源；不存在泛指替代。 |
| 模块主轴 | pass | §5 按五 feature 组织；技术层未成为第六业务 owner。 |
| 对象闭环 | pass | 29 对象能回指 Step 6，并有 Step 7/8/9/10/16 消费者。 |
| 协议闭环 | pass | 10 Command、13 Query、3 Consumer、3 Job exact 名称齐全；Outbound Event=`not_applicable`。 |
| Query no-write | pass | 13 Query 不持有 UoW/write/lock/probe/diagnostic emit capability。 |
| 状态闭环 | pass | 17 状态主语的 exact enum/value 与 Step 10/16 一致；非法迁移可回指。 |
| 一致性闭环 | pass | expected version、idempotency identity/digest/result carrier、UoW 与 commit unknown 口径一致。 |
| ownership | pass | Git commit/ACK/telemetry/job report 未被升格为 Artifact/Baseline/accepted/evidence/readiness。 |
| 风险真实 | pass_with_blockers | `SYNC-UP-001~010`、`SYNC-LOCAL-001~005` 与 04/05/06/07 未建状态保持显式。 |
| full-restart | pass | `SyncTask`、Rust/Tauri、LFS、浅克隆、GUI 只在 historical/not-applicable/禁止语境出现。 |
| 写入范围 | pass | 本 Step 只回写正式 03、本文件、03 flow 与项目台账；未写 04～07 或实现仓。 |
| Markdown/diff | pass | `git diff --check -- projects/L5-sync/` 无错误；未运行代码或测试。 |

## 6. 实际停审状态

装配与静态审计已通过：

```text
current_document = 03-详细设计.md
current_step = 19
current_module = formal_assembly / full_restart
gate_status = formal_stop_review
formal_03_status = formal / stop_review
formal_03_write_allowed = closed
implementation_write_allowed = false
test_execution_allowed = false
commit_required = false
next_allowed_action = wait_for_user_authorization_before_step_04
```

任何上游 blocker 都必须继续出现在正式 §17 和项目台账；`formal_stop_review` 不等于 readiness 或实现授权。
