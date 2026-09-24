# L5-runner 04 配置设计校准流程

> 对应 SOP：`standards/document/配置设计讨论流程_SOP.md`
> 中间产物规范：`standards/document/设计文档讨论中间产物规范.md`
> 书写规范：`standards/document/配置设计书写规范.md`
> 目标正式文档：`projects/L5-runner/04-配置设计.md`
> 启动模式：`full-restart + single-agent-serial`
> 本轮授权：用户已明确要求“现在完成全部 04”；覆盖 Step 1～15，完成正式 04 后停审，不进入 05。
> 参考框架：`projects/L1-governance` 与 `projects/L5-console` 的 04 配置校准粒度；不迁移其领域配置语义。

## 1. 执行纪律与恢复点

- 只修改 `projects/L5-runner/` 下的 04 正式文档、配置 calibration 中间产物和项目台账。
- 当前 agent 独立串行完成；不创建、调用或委派任何 sub-agent、worker、team 或并行代理。
- 严格遵守 `00 → 01 → 02 → 03 → 04 → 05 → 06 → 07`；本 flow 只处理 04。
- 04 严格执行 Step 1 → Step 2 → Step 3 → Step 4 → Step 5 → Step 6 → Step 7 → Step 8 → Step 9 → Step 10 → Step 11 → Step 12 → Step 13 → Step 14 → Step 15。
- 每个 Step 独立生成中间产物、问题回答、诊断、取舍、结构化结论、回填草稿、影响判定和自检；完成后同步本 flow 与项目台账。
- 未来 Step 文件只能在该 Step 真正开始时创建；本 flow 的总计划可以提前列出全部 Step。
- 正式 `04-配置设计.md` 只允许在 Step 15 full-restart 装配；装配前不写正式正文。
- 不实现代码、不创建实现台账或 boundary skeleton、不执行项目测试、不生成 baseline/commit/run_id/artifact/report/evidence/verdict/signoff/readiness、不提交 commit。
- 未闭合的上游合同只可进入 `blocked`、`pending`、`disabled`、`unknown` 或 `reserved`，不能被配置值伪造成 ready。

## 2. 当前恢复点

| 当前文档 | 当前 Step | 当前模块 | gate_status | gate_reason | next_allowed_action | source_files |
|---|---|---|---|---|---|---|
| `04-配置设计.md` | Step 15 | `formal_assembly:completed_stop_review` | `stop_review_required` | 正式 15 章已 full-restart 装配并通过来源、41项输入、8个strict JSON、跨域、03影响、历史污染和事实诚实审计；`RUN-DOC-001`关闭，其余blocker保留。 | 等待用户审查正式 04；未经明确确认不得进入 05 | Step 1～15、正式04、配置书写规范、flow/ledger |

## 3. 总流程计划与状态台账

| Step | 主题 | 输出文件 | 前序门禁 | 状态 | gate_status | 完成门禁 / blocker | next_allowed_action |
|---:|---|---|---|---|---|---|---|
| 1 | 确认配置输入边界 | `04_config_step_01_upstream_boundary.md` | 03 已停审；用户授权进入 04 | `completed / pass / self_reviewed` | `pass_for_step_02` | 输入权威、历史材料、必须回答/不再回答问题和 03 影响初判完成 | 进入 Step 2 |
| 2 | 明确配置设计目标、范围和非范围 | `04_config_step_02_scope.md` | Step 1 pass | `completed / pass / self_reviewed` | `pass_for_step_03` | P0/P1/P2、范围/非范围、下游去向和 03 影响完成 | 进入 Step 3 |
| 3 | 建立配置控制面总览 | `04_config_step_03_control_plane.md` | Step 2 pass | `completed / pass / self_reviewed` | `pass_for_step_04` | 来源链、唯一装配入口、读取模块、七个配置域和跨控制面审计完成 | 进入 Step 4 |
| 4 | 定义配置分类与禁止配置化边界 | `04_config_step_04_categories_boundaries.md` | Step 3 pass | `completed / pass / self_reviewed` | `pass_for_step_05` | 配置类别、更新方式、逐域禁止项和跨分类审计已完成 | 开始 Step 5 |
| 5 | 定义配置来源、优先级与冲突处理 | `04_config_step_05_sources_priority_conflicts.md` | Step 4 pass | `completed / pass / self_reviewed` | `pass_for_step_06` | 单一文档、selector/ref/fixture 隔离、七域来源和冲突审计已完成 | 开始 Step 6 |
| 6 | 定义环境、部署 profile 与配置矩阵 | `04_config_step_06_environment_profiles_matrix.md` | Step 5 pass | `completed / pass / self_reviewed` | `pass_for_step_07` | 四 profile、依赖/敏感/跨平台/恢复矩阵和跨 profile 审计已完成 | 开始 Step 7 |
| 7 | 定义配置项清单 | `04_config_step_07_config_items.md` | Step 6 pass | `completed / pass / self_reviewed` | `pass_for_step_08` | 七域配置项、严格 JSON demos、失败策略和跨项审计已完成 | 开始 Step 8 |
| 8 | 定义敏感配置与密钥管理 | `04_config_step_08_sensitive_secrets.md` | Step 7 pass | `completed / pass / self_reviewed` | `pass_for_step_09` | sensitive refs、解析/最小暴露、轮换、审计和零泄露审计已完成 | 开始 Step 9 |
| 9 | 定义配置加载、校验与生效机制 | `04_config_step_09_loading_validation_activation.md` | Step 8 pass | `completed / pass / self_reviewed` | `pass_for_step_10` | source snapshot、strict parse、type/cross-field/forbidden validate、builder/exposure 和 failure mapping 已完成 | 开始 Step 10 |
| 10 | 定义配置变更、审计与回滚 | `04_config_step_10_change_audit_rollback.md` | Step 9 pass | `completed / pass / self_reviewed` | `pass_for_step_11` | 变更角色/风险、评审、safe audit、new assembly、rollback/recovery和跨变更审计已完成 | 开始 Step 11 |
| 11 | 定义失效模式与降级 / fail-fast 策略 | `04_config_step_11_failure_degradation.md` | Step 10 pass | `completed / pass / self_reviewed` | `pass_for_step_12` | missing/invalid/unavailable/expired/drift/failure 的影响、行为、观测和测试切口已完成 | 开始 Step 12 |
| 12 | 定义测试、验收、实施与运维承接 | `04_config_step_12_downstream_handoff.md` | Step 11 pass | `completed / pass / self_reviewed` | `pass_for_step_13` | 05/06/07/09 输入、门禁、证据边界和不重复定义项已完成 | 开始 Step 13 |
| 13 | 定义配置迁移、废弃与演进 | `04_config_step_13_migration_deprecation_evolution.md` | Step 12 pass | `completed / pass / self_reviewed` | `pass_for_step_14` | schema/version、add/rename/deprecate/remove、兼容窗口和迁移失败策略已完成 | 开始 Step 14 |
| 14 | 定义风险与待确认事项 | `04_config_step_14_risks_open_questions.md` | Step 13 pass | `completed / pass / self_reviewed` | `pass_for_step_15` | 风险、待确认、blocker、03影响总审计和Step15装配门禁已完成 | 开始 Step 15 |
| 15 | 正式配置设计装配 | `04_config_step_15_formal_document_assembly.md` | Step 14 pass + 用户授权 | `completed / pass / self_reviewed` | `stop_review_required` | 15章、来源回指、跨域、03影响、历史污染和事实审计均完成 | 停审，等待用户 review 后再考虑 05 |

## 4. 权威输入与使用上限

| 输入 | 当前用途 | 使用上限 |
|---|---|---|
| 正式 `00-需求文档.md` | Runner 定位、能力闭环、安全、数据边界、环境差异和验收红线 | 不重写需求，不把配置结果写成验收通过 |
| 正式 `01-架构设计.md` | 依赖裁剪、owner 边界、SDK-first、技术中立和跨平台约束 | 不通过配置选择架构、平台或私有实现 |
| 正式 `02-概要设计.md` | 配置影响轮廓、组成部分、端口/状态/错误和禁止配置化边界 | 不新增对象、port、DTO 或函数流 |
| 正式 `03-详细设计.md` §13 | 配置读取点、逻辑 builder、store/cache/adapter/job/观测绑定和禁止边界 | 只展开来源、优先级、profile、值语义、校验、生效和失效；会改变代码契约的结论必须回写 03 |
| `03_ddd_step_14_config_dependencies.md` | 字段级配置绑定、依赖类型、装配顺序和 blocker | 不把占位类型伪造成 exact endpoint、backend 或 SDK method |
| `03_ddd_step_17_implementation_handoff.md`、Step 18 | 实施前置、下游承接、风险和未确认事项 | 不创建 implementation ledger 或 readiness |
| `05-测试方案.md`、`06-验收标准.md` | 仅作历史/方向扫描；两份尚未按新版 03/04 复核 | 不反向定义配置项、默认值或证据 |
| 上游专项正式文档及必要台账 | 核验公开 seam 与成熟度 | 不猜 Runner-facing exact contract |

## 5. 持续 blocker 与安全口径

| ID | 影响 04 的范围 | 未闭合前配置口径 |
|---|---|---|
| `RUN-UP-001~008` | Artifact/Governance/Sandbox/Runtime/Observability/Archive/平台/SDK positive seam | 只允许 opaque binding ref、能力姿态和负向处理；不得声明 enabled=ready |
| `RUN-DDD-001` | 目标实现仓不存在 | 不写真实路径、manifest、部署文件或 package key |
| `RUN-DDD-002` | language/runtime/shell/process/packaging 未定 | 配置只写技术中立语义；不选 Rust/Tauri/Docker 等 |
| `RUN-DDD-003` | store/cache 原子性、locking、migration、corruption 未定 | 只写能力要求、逻辑 binding 和 fail-closed，不写 backend/DSN/path |
| `RUN-DOC-001` | 正式 04 缺失 | 已由 Step 15 成功生成正式 `04-配置设计.md` 而关闭；不代表实现或 readiness |
| `RUN-DOC-002~003` | 05/06 尚未新版化、07 尚未生成 | 只提供承接输入，不提前生成测试/验收/实施证据 |
| `RUN-OPS-001~002` | durable observability/SLO 与真实 integration 环境未定 | 只保留 safe marker/test-only fake 边界，不声明 production evidence |

## 6. 终态模板（Step 15 完成后回填）

```text
current_document = 04-配置设计.md
current_step = 15
current_module = formal_assembly:completed_stop_review
gate_status = stop_review_required
formal_status = completed_with_upstream_blockers
next_allowed_action = wait_for_user_review_of_04
formal_04_write_allowed = completed_formal_stop_review
formal_05_write_allowed = false
implementation_write_allowed = false
test_execution_allowed = false
commit_required = false
```
