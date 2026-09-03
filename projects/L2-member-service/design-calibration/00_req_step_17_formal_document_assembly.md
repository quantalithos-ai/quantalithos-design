# Step 17. 正式文档装配

## 1. 当前状态

| 当前模块 | gate_status | gate_reason | next_allowed_action | source_files |
|---|---|---|---|---|
| `formal_00_complete_stop_review` | pass | 正式 00 已按 Step 01~16 重建为 16 章；终审已刷新两项兄弟正式 00；来源、编号、表格、边界、pending、历史污染和非伪造静态审计全部通过 | 等待用户评审；未经明确确认不得进入 01 | `project_execution_ledger.md`;`00_requirements_calibration_flow.md`;`00_req_step_01_upstream_relation.md`~`00_req_step_16_traceability_matrix.md`;正式 `00-需求文档.md` |

- 创建日期：2026-08-22
- 当前模式：full-restart
- 目标文件：`projects/L2-member-service/00-需求文档.md`
- 停审纪律：正式 00 完成后立即停审，未经用户明确确认不得进入 01
- 提交纪律：不提交 commit

## 2. 三层门禁

| 门禁层级 | 输入 | 判断 | gate_status |
|---|---|---|---|
| 项目级 | `project_execution_ledger.md`、MSVC-UP 台账 | 当前恢复点为 Step 17；开放项不阻塞需求成文，只阻塞受影响 positive lane | pass |
| 文档级 | `00_requirements_calibration_flow.md` | Step 01~16 全部 pass；Step 17 是唯一允许动作 | pass |
| Step / 模块级 | `00_req_step_01_*`~`00_req_step_16_*` | 结构化产物、回填草稿、自检和能力级停审完整；Step 16 无孤儿 / 串线 | pass |

## 3. 装配计划

| 批次 | 正式内容 | 校准来源 | 状态 |
|---:|---|---|---|
| A | 元信息、阅读导航、第 1~4 章 | Step 01~04 | done |
| B | 第 5~8 章 | Step 05~08 | done |
| C | 第 9~12 章 | Step 09~12 | done |
| D | 第 13~16 章、终检与停审台账 | Step 13~16 | done |

每一批只重组已确认结论；若发现缺口必须回退对应 Step，不能在正式正文现场补需求。

## 4. 正式章节来源映射

| 正式章节 | 具体校准来源 | 正式正文承载范围 |
|---:|---|---|
| 1 与上游文档的关系声明 | `design-calibration/00_req_step_01_upstream_relation.md` | authority、主题承接、并行 / historical 声明 |
| 2 本仓定位与边界 | `design-calibration/00_req_step_02_position_boundary.md` | 一句话定位、非职责、边界对象、控制面分层 |
| 3 背景与问题定义 | `design-calibration/00_req_step_03_problem_context.md` | 当前结构性问题、影响与范围 |
| 4 目标与非目标 | `design-calibration/00_req_step_04_goals_non_goals.md` | G-MS / NG-MS 与项目型-only 总则 |
| 5 用户与角色 | `design-calibration/00_req_step_05_users_roles.md` | 人类 / 系统角色及目标 |
| 6 使用方与依赖 | `design-calibration/00_req_step_06_consumers_dependencies.md` | 内外依赖、裁剪、类型、禁止和 path 结论 |
| 7 核心能力闭环 | `design-calibration/00_req_step_07_core_capability_loop.md` | C-MS-1~5、闭环图、能力层级 |
| 8 用户故事 | `design-calibration/00_req_step_08_user_stories.md` | US-MS-001~015 / E01~E04 |
| 9 功能需求 | `design-calibration/00_req_step_09_functional_requirements.md` | FR-MS-001~012 / E01~E04、I/O / 失败摘要 |
| 10 业务规则与边界约束 | `design-calibration/00_req_step_10_business_rules_boundaries.md` | BR-MS-001~050 与节点映射 |
| 11 数据需求与数据归属 | `design-calibration/00_req_step_11_data_ownership.md` | D-MS-001~037 / E01~E04、四类归属和复用 |
| 12 接口与依赖 | `design-calibration/00_req_step_12_interfaces_dependencies.md` | IB-MS-001~017 / E01~E04、外部依赖边界与 seam 总则 |
| 13 非功能需求 | `design-calibration/00_req_step_13_non_functional_requirements.md` | NFR-MS-001~020、六类检查和量化门禁 |
| 14 验收标准 | `design-calibration/00_req_step_14_acceptance_criteria.md` | AC-MS-001~039、VF-MS-001~009 与 pending 限制 |
| 15 风险与待确认事项 | `design-calibration/00_req_step_15_risks_open_questions.md`;`design-calibration/project_execution_ledger.md` | R-MS-001~013、Q-MS-001~011、blocker 分层和 MSVC-UP 状态 |
| 16 需求追溯矩阵 | `design-calibration/00_req_step_16_traceability_matrix.md` | 16 行主矩阵、漏项检查和追溯结论 |

## 5. 装配纪律

- 正式正文只承载收口结论，不写 SOP 问题、诊断过程、方案比较、节点停审过程或历史差异明细。
- 每章开头列出具体校准来源和建议继续阅读的小节。
- 术语统一为：control plane、host truth、host session 壳、runtime session / run 外部引用、execution handoff、ProjectMemberRef 执行主语、GlobalMemberRef 身份锚、body-free、pending / blocked / waiting / degraded / unknown / fail closed。
- 编号集合只使用已确认的 G-MS / NG-MS / C-MS / US-MS / FR-MS / BR-MS / D-MS / IB-MS / NFR-MS / AC-MS / VF-MS / R-MS / Q-MS / MSVC-UP。
- 不写 API path、RPC 方法、Command、DTO、proto、事件 schema、字段、port、handler、repository、outbox、事务、重试、数据库、框架、产品或部署实现。
- 不声明实现仓、commit、run_id、测试结果、artifact、report、evidence、verdict、signoff 或 readiness。
- `L2-member` 与 `L2-member-images` 正式 00 均已停审；只消费需求级 owner / supply 分工。Member、Member Images 双方 exact contract 与正向联调继续 pending。

## 6. 预期编号与结构审计集

| 集合 | 预期 |
|---|---|
| 正式章节 | 1~16，顺序唯一，每章一个校准来源块 |
| 目标 / 非目标 | G-MS-001~005；NG-MS-001~012 |
| 能力 | C-MS-1~5 |
| 用户故事 | US-MS-001~015；US-MS-E01~E04 |
| 功能 | FR-MS-001~012；FR-MS-E01~E04 |
| 规则 | BR-MS-001~050 |
| 数据 | D-MS-001~037；D-MS-E01~E04 |
| 接口 | IB-MS-001~017；IB-MS-E01~E04 |
| NFR | NFR-MS-001~020 |
| 验收 / 否决 | AC-MS-001~039；VF-MS-001~009 |
| 风险 / 待确认 | R-MS-001~013；Q-MS-001~011 |
| 上游条件 | MSVC-UP-001~009（002 / 003 需求级边界已停审、详细合同 pending；001 / 004~008 open / pending；009 current-scope resolved） |

## 7. 后置审计清单

| 检查项 | 当前状态 |
|---|---|
| 旧正式 00 已删除并依据 Step 01~16 重建 | pass |
| 16 章齐全且每章有具体来源 / 延伸阅读 | pass（16 章 / 16 来源块） |
| ID 集合与校准材料一致，无未定义或历史编号 | pass（全部预期集合连续且唯一） |
| Markdown 表列数和 heading 顺序一致 | pass（16 章顺序、16 行六列追溯、全表列数一致） |
| pending / blocker / resolved 状态无误报 | pass（002 / 003 需求级边界已停审、详细合同 pending；001 / 004~008 open / pending；009 current-scope resolved） |
| historical API / 数字 / 产品仅出现在否定或背景语境 | pass |
| 无实现、测试、证据、验收结果或 readiness 事实 | pass |
| `git diff --check` 通过且改动仅在本项目 | pass（本任务写入限定 `projects/L2-member-service/`；工作树其他并行变动未触碰） |
| flow / ledger 切到 `formal_00_complete_stop_review` | pass |

## 8. 停审结论

```text
document_status = formal_00_complete_stop_review
gate_status = pass
next_allowed_action = wait_for_user_review
next_formal_document_allowed = false
```

正式 00 的完成只代表需求文档装配与静态审计通过，不代表任何正向合同、实现、测试、验收或 readiness 已完成。
