# L3-method-library 00 需求 Step 17: 整理正式文档

> 创建日期: 2026-06-15
> 状态: completed
> 当前模式: full-restart
> 本轮口径: 只装配 Step 1~16 已确认结论,不新增需求。
> 正式产物: `projects/L3-method-library/00-需求文档.md`
> 项目级台账: `design-calibration/project_execution_ledger.md`
> 文档级 flow: `design-calibration/00_requirements_calibration_flow.md`

---

## 0. Step 开工确认

| 项目 | 记录 |
|---|---|
| Step | Step 17 整理正式文档 |
| 输出文件 | `design-calibration/00_req_step_17_formal_document_assembly.md`;`00-需求文档.md` |
| 已读取通用规范 | yes:`设计文档讨论中间产物规范.md`;`设计真相源闭环与可落码性标准.md` |
| 已读取 SOP / 书写规范 | yes:`需求文档讨论流程_SOP.md` Step 17;`需求文档书写规范.md` 模板和评审清单 |
| 已读取前序输入 | yes:`00_req_step_01_upstream_relation.md`~`00_req_step_16_traceability_matrix.md` |
| 已读取项目输入 | yes:旧 `00_req_step_17_formal_document_assembly.md`;旧 `projects/L3-method-library/00-需求文档.md` |
| 当前模式 | full-restart |
| 进入条件 | pass |
| next_allowed_action | Step 17 已完成,可将 `00-需求文档.md` 作为后续 `01-架构设计.md` 输入。 |

---

## 1. Step 内计划

| 模块 | 状态 | 产物 | gate_status | next_allowed_action |
|---|---|---|---|---|
| 必读文档读取 | done | 必读文档摘要 | pass | 进入装配骨架搭建。 |
| 装配骨架搭建 | done | 正式文档章节清单 | pass | 进入校准来源映射。 |
| 校准来源映射 | done | 章节来源表 | pass | 进入正文装配。 |
| 正文装配 | done | `00-需求文档.md` | pass | 进入旧稿替换审计。 |
| 旧稿替换审计 | done | 替换口径说明 | pass | 进入自检与停审。 |
| 自检与停审 | done | 自检表 / 后续入口 | pass | 允许进入后续 `01-架构设计.md`。 |

---

## 2. 必读文档

| 文档 | 读取结论 | 对 Step 17 的影响 |
|---|---|---|
| `需求文档讨论流程_SOP.md` Step 17 | Step 17 只做重组与润色,不新增未经讨论的新结论;发现缺口必须回对应 Step。 | 正式文档只使用 Step 1~16 已确认结论。 |
| `需求文档书写规范.md` 模板 / 评审清单 | 正式文档必须列出校准来源和延伸阅读,章节结构按正式需求目录组织。 | 1~16 章均保留具体校准来源块。 |
| `00_req_step_01_upstream_relation.md`~`00_req_step_16_traceability_matrix.md` | Step 1~16 已完成,且 Step 16 已完成追溯矩阵审计。 | 作为正式文档唯一装配来源。 |
| 旧 `00-需求文档.md` | 旧稿仍有旧 US/FR/NFR 编号和旧矩阵。 | 不局部修补,整体替换为本轮正式文档。 |

---

## 3. 装配规则

| 规则 | 本轮执行 |
|---|---|
| 只整理已确认结论 | 正式文档只使用 Step 1~16 的回填草稿、结构化中间产物和停审结论。 |
| 每章标注校准来源 | 正式 1~16 章均列出对应 `design-calibration/00_req_step_*`。 |
| 不继承旧稿实现口径 | 旧正式文档中的 API 名、event 名、fingerprint、snapshot、outbox、P95、Given/When/Then 等不进入新版正式正文。 |
| 统一当前编号 | 正式文档采用当前 US-ML-001~011、FR-ML-001~009、FR-ML-E-001~004、BR-ML-001~022、NFR 16 条和 Step 16 当前矩阵。 |
| 保留待确认项边界 | Qualification / CapabilityDefinition、外围增强、governance 强依赖、artifact 核心消费、SDK/console、性能数值等继续挂在第 15 章。 |
| 保持需求层粒度 | 不写数据库表、Rust struct、repository、port、handler、事务、协议 schema、代码目录或测试脚本。 |

---

## 4. 正式章节来源表

| 正式章节 | 校准来源 |
|---|---|
| 1. 与上游文档的关系声明 | `design-calibration/00_req_step_01_upstream_relation.md` |
| 2. 本仓定位与边界 | `design-calibration/00_req_step_02_position_boundary.md` |
| 3. 背景与问题定义 | `design-calibration/00_req_step_03_problem_context.md` |
| 4. 目标与非目标 | `design-calibration/00_req_step_04_goals_non_goals.md` |
| 5. 用户与角色 | `design-calibration/00_req_step_05_users_roles.md` |
| 6. 使用方与依赖 | `design-calibration/00_req_step_06_consumers_dependencies.md` |
| 7. 核心能力闭环 | `design-calibration/00_req_step_07_core_capability_loop.md` |
| 8. 用户故事 | `design-calibration/00_req_step_08_user_stories.md` |
| 9. 功能需求 | `design-calibration/00_req_step_09_functional_requirements.md` |
| 10. 业务规则与边界约束 | `design-calibration/00_req_step_10_business_rules_boundaries.md` |
| 11. 数据需求与数据归属 | `design-calibration/00_req_step_11_data_ownership.md` |
| 12. 接口与依赖 | `design-calibration/00_req_step_12_interfaces_dependencies.md` |
| 13. 非功能需求 | `design-calibration/00_req_step_13_non_functional_requirements.md` |
| 14. 验收标准 | `design-calibration/00_req_step_14_acceptance_criteria.md` |
| 15. 风险与待确认事项 | `design-calibration/00_req_step_15_risks_open_questions.md` |
| 16. 需求追溯矩阵 | `design-calibration/00_req_step_16_traceability_matrix.md` |

---

## 5. 旧稿替换审计

| 旧稿内容 | 新版处理 |
|---|---|
| 旧 US-ML-001~010、FR-ML-001~007、FR-ML-E-001~003 | 新版采用 Step 8~9 和 Step 16 当前编号:US-ML-001~011、FR-ML-001~009、FR-ML-E-001~004。 |
| Qualification 作为旧 P0 主线 | 新版保留为待确认事项,不纳入核心功能、核心数据和专项验收。 |
| API / RPC / Command / Event 名 | 新版只写能力接口与事件协作能力边界。 |
| fingerprint、snapshot、outbox、audit record 字段 | 新版只保留版本稳定、变化可追溯和消费一致性保护需求。 |
| P95、QPS、缓存命中率、PG 等技术指标 | 新版只保留需求层判断口径,具体数值待后续 05/06 或设计细化。 |
| Given/When/Then 测试步骤 | 新版只写验收条件,不写测试步骤。 |

---

## 6. 自检与停审

| 检查项 | 结论 | 说明 |
|---|---|---|
| 正式章节是否都有校准来源 | 通过 | 1~16 章均有来源块。 |
| 是否新增未经讨论的新结论 | 未发现 | 正文来自 Step 1~16。 |
| 是否同步当前编号体系 | 通过 | 已使用当前 US/FR/BR/NFR/追溯矩阵。 |
| 是否保留待确认事项 | 通过 | Step 15 待确认项进入正式第 15 章。 |
| 是否删除旧实现口径 | 通过 | 未继承旧 API、event、fingerprint、snapshot、outbox、P95 或测试步骤。 |
| 是否可进入后续设计 | 通过 | 正式 `00-需求文档.md` 已重建。 |

---

## 7. 完成结论

`L3-method-library` 的 `00-需求文档.md` 已按全量重启口径重新装配。后续 `01-架构设计.md` 必须以新版正式需求文档和 `design-calibration/00_req_step_*` 中间产物为输入,不得回退继承旧需求稿中的实现化口径。
