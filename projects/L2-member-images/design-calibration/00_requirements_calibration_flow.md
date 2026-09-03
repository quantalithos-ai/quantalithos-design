# L2-member-images 00 需求文档 full-restart 校准流程

> 创建日期: 2026-08-21
> 当前模式: `full-restart`
> 当前文档: `projects/L2-member-images/00-需求文档.md`
> 项目级台账: `design-calibration/project_execution_ledger.md`
> 历史材料: 旧 README、旧正式 `00/01/02/03/05/06` 只作后置污染审计输入
> 正式切换纪律: 本流程完成 Step 17 后立即停审;未经用户再次明确确认不得进入 `01-架构设计.md`

## 1. 当前恢复点

| 当前 Step | 当前模块 | gate_status | gate_reason | next_allowed_action | source_files |
|---|---|---|---|---|---|
| Step 17 正式文档装配 | `formal_00_stop_review` | stop_review | 旧正式 00 已删除并从空骨架按六批重建;16 章来源、18 组正式编号、owner / seam / pending、20 行主矩阵和 historical 污染审计通过 | 等待用户再次明确确认;不得创建 01 flow、修改正式 01 或进入 01 Step | `00-需求文档.md`;`00_req_step_17_formal_document_assembly.md`;`00_requirements_calibration_flow.md`;`project_execution_ledger.md` |

## 2. 执行纪律

- 严格按 Step 1 -> Step 17 串行推进;总计划可以完整列出,未来 Step 文件只能在前序 Step 通过后创建。
- 每个 Step 文件必须保留 Step 内计划、输入、SOP 问题回答、问题诊断、前后对比、设计取舍、结构化产物、回填草稿、待确认事项和进入下一步条件。
- Step 7 固定能力节点;Step 8~14 按同一能力节点逐个完成故事、功能、规则、数据、接口、质量和验收停审,再由 Step 16 做跨能力追溯审计。
- 正式 `00-需求文档.md` 只在 Step 17 依据 Step 1~16 已闭合结论重建;Step 17 不现场新增需求结论。
- 需求阶段只写外部可见行为、归属、约束和可判断结果,不写代码目录、数据库表、Rust 类型、API 路径、具体 CI / registry 产品或部署拓扑。
- 所有依赖必须标明 `compile` / `runtime` / `event` / `ref` / `adapter` / `fake`;只有经核验的 `L0-core` shared contract 才可能成为 compile dependency。
- 兄弟仓 `L2-member` / `L2-member-service` 未停审内容只作 pending 输入;任何 exact schema、positive readiness 或已交付事实都不得从中推导。
- 不生成或声称实现仓、implementation commit、run_id、artifact digest、report、evidence alias、测试结果、verdict、signoff 或 readiness。
- 每次写入后执行局部结构、编号、来源和污染检查;单次 patch 控制在可审查范围内。

## 3. 公共必读与读取状态

| 输入 | 用途 | 状态 / 约束 |
|---|---|---|
| `设计文档编写通则.md` | full-restart、正式正文、图表和可落码纪律 | read |
| `设计文档讨论中间产物规范.md` | 三层台账、Step 结构、写入门禁 | read |
| `设计真相源闭环与可落码性标准.md` | owner 唯一、pending / blocker、实现不得补口 | read |
| `全局项目依赖关系与裁剪规则.md` | Layer 3 并行窗口和本仓依赖裁剪 | read |
| `需求文档讨论流程_SOP.md` | Step 1~17 顺序与能力小循环 | read |
| `需求文档书写规范.md` | 正式 00 章节、编号和追溯格式 | read |
| `architecture/adr/0005-member-image-per-role.md` | nightly、一 Role 一镜像、映射 owner、pin、禁 `latest` | read;只继承 Accepted 裁决,不继承无独立 authority 的清单 / 数字 / 产品 |
| `projects/L2-runtime/00~07` | runtime / live state / checkpoint 边界 | read;设计链 closed stop review,实现 not_started |
| `projects/L2-tools/00~07` | tool identity / contract / invocation 边界 | read;设计链 closed stop review,实现 blocked / not_started |
| `projects/L3-method-library/00~07` + ledger | RoleDefinition 与 Role -> image variant 定义来源 | read;正式 mapping owner 可引用,exact consumer surface 与当前 dirty / implementation blocker 不得伪装 immutable readiness |
| `projects/L1-artifact/00~07` + ledger | Artifact truth、版本、血缘、baseline、正式消费引用 | read;07 等待审查,实现事实不得推导,image handoff 条件 pending |
| `projects/L4-sandbox/00~07` + ledger | 隔离边界与镜像供应链排除项 | read;设计闭合但 baseline / 实现未就绪 |
| `projects/L0-core/00~07` | shared contract 类别 authority | read;未发现 image-specific 已确权 schema |
| `projects/L1-governance/00~07` | 分层和主要组成部分粒度参考 | read;只借鉴方法,不复制治理领域事实 |
| `projects/L2-member/` 当前台账 / 校准材料 | 被装配 member 产物与运行边界线索 | read;正式 00 repair blocked,pending only |
| `projects/L2-member-service/` 当前台账 / Step 1~8 | pinned image ref / manifest 消费方向 | read;正式 00 未装配,pending only |
| `draft/README.md`、`draft/01~05` | 用户已确认的 pre-00 推演 | read;approved historical input,仍须逐 Step 独立核验 |
| 本仓旧 README / 旧正式 `00/01/02/03/05/06` | 污染与差异审计 | historical_material;只在独立结论形成后读取 |

## 4. Step 总任务表

| Step | 输出文件 | 主题 | 状态 | gate_status | next_allowed_action | 完成门禁 |
|---:|---|---|---|---|---|---|
| 1 | `00_req_step_01_upstream_relation.md` | 与上游文档的关系声明 | done | pass | allow_step_02 | authority / pending / historical 分层,且不提前写能力合同 |
| 2 | `00_req_step_02_position_boundary.md` | 本仓定位与边界 | done | pass | allow_step_03 | 拥有 / 消费 / 禁止拥有真相边界唯一 |
| 3 | `00_req_step_03_problem_context.md` | 背景与问题定义 | done | pass | allow_step_04 | 问题与方案分离,无旧数字污染 |
| 4 | `00_req_step_04_goals_non_goals.md` | 目标与非目标 | done | pass | allow_step_05 | 目标可判断,非目标有 owner |
| 5 | `00_req_step_05_users_roles.md` | 用户与角色 | done | pass | allow_step_06 | 人类角色 / 系统消费者 / 权限 owner 分离 |
| 6 | `00_req_step_06_consumers_dependencies.md` | 使用方与依赖 | done | pass | allow_step_07 | 裁剪表、类型表、禁止表、ASCII 图与 path 判定齐全 |
| 7 | `00_req_step_07_core_capability_loop.md` | 核心能力闭环 | done | pass | allow_step_08 | 能力节点有顺序、进入 / 退出条件和 owner 边界 |
| 8 | `00_req_step_08_user_stories.md` | 用户故事 | done | pass | allow_step_09 | 故事逐节点停审且无孤儿 / 串线 |
| 9 | `00_req_step_09_functional_requirements.md` | 功能需求 | done | pass | allow_step_10 | 外部可见行为逐节点承接故事 |
| 10 | `00_req_step_10_business_rules_boundaries.md` | 业务规则与边界约束 | done | pass | allow_step_11 | 规则有来源 / 挂载且不进入实现校验 |
| 11 | `00_req_step_11_data_ownership.md` | 数据需求与数据归属 | done | pass | allow_step_12 | truth / snapshot / ref / forbidden 正确分层,本地 derived conclusion 归 truth |
| 12 | `00_req_step_12_interfaces_dependencies.md` | 接口与依赖 | done | pass | allow_step_13 | 能力接口与外部依赖可回指,无 schema / route 私造 |
| 13 | `00_req_step_13_non_functional_requirements.md` | 非功能需求 | done | pass | allow_step_14 | NFR-MI-001~022 均有能力 / 目标来源、判断口径和 Step 14 承接主题;六类总审通过 |
| 14 | `00_req_step_14_acceptance_criteria.md` | 验收标准 | done | pass | allow_step_15 | AC-MI-001~030 覆盖五类来源、正负向 / 依赖失败和外围边界;VETO-MI-001~007 可追溯且不过宽 |
| 15 | `00_req_step_15_risks_open_questions.md` | 风险与待确认事项 | done | pass | allow_step_16 | R-MI-001~010、MI-UP-001~009、Q-MI-001~004 性质、影响和挂起上限清晰,无脑补关闭 |
| 16 | `00_req_step_16_traceability_matrix.md` | 需求追溯矩阵 | done | pass | allow_step_17 | 核心 / 外围主矩阵与补充矩阵覆盖全部编号;无孤儿、重复、owner 串线、新需求或 pending readiness 泄漏 |
| 17 | `00_req_step_17_formal_document_assembly.md` | 正式文档装配 | done | stop_review | wait_for_user_explicit_confirmation_before_01 | 正式 00 只含 Step 1~16 已闭合结论;16 章来源、编号、pending、owner、依赖类型和污染审计通过 |

## 5. 当前 blocker / pending 注册表

| ID | Owner / 来源 | 当前状态 | 当前处理 |
|---|---|---|---|
| `MI-UP-001` | `L2-member-service` | sibling_formal_00_not_closed | 只固定供给方向;manifest / variant / ref exact 消费合同 pending |
| `MI-UP-002` | `L2-member` / runtime | sibling_repair_and_contract_pending | member 产物形态和兼容检查 owner pending |
| `MI-UP-003` | `L3-method-library` | mapping_owner_closed_consumer_surface_pending | 固定映射 owner 和禁止源码依赖;exact 查询 / 快照合同 pending |
| `MI-UP-004` | `L0-core` | image_specific_schema_pending | 只引用 shared category,不本地 shadow |
| `MI-UP-005` | `L0-bus` / Core | inbound_event_schema_pending | 只固定按需消费方向;不可验证事件不得形成构建意图 |
| `MI-UP-006` | governance / method / memory / workspace owner | seed_source_owner_pending | 本仓只承接 seed template ref / placement,不拥有语义正文 |
| `MI-UP-007` | `L1-artifact` | owner_closed_image_handoff_pending | 复用正式 `ConsumableArtifactReference`;image handoff 条件 / schema pending |
| `MI-UP-008` | `L4-sandbox` | future_consumption | 加固基础镜像不进入当前核心主链 |
| `MI-UP-009` | `L0-bus` / Core | outbound_event_authority_absent | 不定义构建 / 发布出站事件 |
| `Q-MI-001` | governance / 本仓 | open | 特殊只读 / 收缩 variant 后续确认 |
| `Q-MI-002` | 本仓 / SRE | open | 多架构是否成为 variant 维度后续确认 |
| `Q-MI-003` | infra / 04 | open | builder / registry / evidence 产品只在后续配置绑定 |
| `Q-MI-004` | security / governance / artifact | open | BOM / 扫描 / 签名等具体 evidence kind 与门禁优先级待 authority |

## 6. 当前 next_allowed_action

```text
current_document = 00-需求文档.md
current_step = Step 17
current_module = formal_00_stop_review
gate_status = stop_review
next_allowed_action = wait_for_user_explicit_confirmation_before_01
future_step_files_allowed = false_until_user_explicit_confirmation
formal_00_write_allowed = false_unless_review_reopens_00
next_formal_document_allowed = false_until_user_explicit_confirmation
implementation_allowed = false
commit_required = false
```
