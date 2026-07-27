# 00 需求文档 Step 17 · 整理正式文档

> 项目: `L3-capability-hub`
> 文档: `00-需求文档.md`
> Step: 17 `整理正式文档`
> 执行模式: full-restart
> 当前状态: `completed_stop_review`
> 当前恢复点: 正式 `00-需求文档.md` 已按 Step 1~16 已确认结论重建,等待用户确认是否进入 `01-架构设计.md`

---

## 1. Step 开工确认

| 门禁 | 状态 | 说明 |
|---|---|---|
| 用户确认进入 Step 17 | pass | 用户已在 Step 16 停审后回复“同意”。 |
| 项目级台账允许装配 | pass | 装配前 `project_execution_ledger.md` 的恢复点为 Step 16 completed stop review,用户已确认进入 Step 17;装配完成后已更新为 `wait_user_review_to_01_architecture`。 |
| 文档级 flow 允许装配 | pass | 装配前 `00_requirements_calibration_flow.md` 已显示 Step 1~16 全部完成并等待 Step 17;装配完成后已更新为 `00_completed_stop_review`。 |
| Step 1~16 中间产物可用 | pass | `00_req_step_01_upstream_relation.md` 至 `00_req_step_16_traceability_matrix.md` 均已完成并停审。 |
| 正式文档不新增结论 | pass | 本步只重组、摘录和润色 Step 1~16 结构化中间产物与回填草稿。 |
| 旧正式文档不直接继承 | pass | 旧 `00-需求文档.md` 仅作为 historical material 差异审计输入。 |
| 不实现代码 / 不提交 commit | pass | 当前只修改设计文档和 calibration 台账,不生成实现提交、run_id、测试证据或验收签署。 |

---

## 2. 必读文档清单

### 2.1 标准与规范

| 文档 | 读取范围 | 用途 |
|---|---|---|
| `standards/document/设计文档编写通则.md` | 正式文档装配、真相源优先级、禁止装配新增结论 | 确认正式 `00` 是设计基线,不写讨论记录和未确认结论。 |
| `standards/document/设计文档讨论中间产物规范.md` | 正式文档可追溯、写入前检查、full-restart 历史材料处理 | 确认每章必须追溯到具体中间产物,旧材料不得直接回流。 |
| `standards/document/设计真相源闭环与可落码性标准.md` | 真相源闭环、可落码粒度 | 确认 Step 9 以后正式章节不能压缩成摘要。 |
| `standards/document/全局项目依赖关系与裁剪规则.md` | `L3-capability-hub` 全局依赖裁剪 | 确认 `L0-core` 编译期依赖候选、`L0-bus` 事件协作和相邻仓边界。 |
| `standards/document/需求文档讨论流程_SOP.md` | Step 17 | 确认 Step 17 只做重组与润色,不新增未经讨论的新需求。 |
| `standards/document/需求文档书写规范.md` | §2.2、§2.3、正式结构 | 确认正式文档 16 章结构和每章校准来源写法。 |

### 2.2 上游与参考

| 文档 | 用途 |
|---|---|
| `projects/L3-method-library/00-需求文档.md` | 校验 method asset body 与 capability-method relation 的边界。 |
| `projects/L1-governance/00-需求文档.md` | 校验 governance approval / policy truth 与 capability governance seam 的边界。 |
| `projects/L0-sdk/00-需求文档.md` | 校验 SDK client / package 与服务端 exposure boundary 的边界。 |
| `projects/L1-governance/00-需求文档.md` 正式文档粒度 | 参考正式需求文档的表格密度和回填方式。 |
| `projects/L3-method-library/00-需求文档.md` 正式文档粒度 | 参考 L3 相邻项目的边界与追溯写法。 |
| `projects/L0-sdk/00-需求文档.md` 正式文档粒度 | 参考 SDK exposure 相关章节的边界表达。 |

### 2.3 当前项目输入

| 文档 | 当前处理 |
|---|---|
| `projects/L3-capability-hub/README.md` | historical material,只保留 MCP / A2A / API 集成线索。 |
| 旧 `projects/L3-capability-hub/00-需求文档.md` | historical material,旧 Provider Contract、Cost、QueryCapabilities、KMS、Policy 30s、marketplace 等不继承。 |
| `design-calibration/00_req_step_01_upstream_relation.md` ~ `00_req_step_16_traceability_matrix.md` | 当前正式文档唯一装配输入。 |

---

## 3. 正式章节装配计划

| 正式章节 | 装配来源 | 装配策略 |
|---|---|---|
| §1 与上游文档的关系声明 | Step 1 | 保留来源映射和收束说明,明确旧材料定位。 |
| §2 本仓定位与边界 | Step 2 | 保留一句话定义、非职责和边界对象。 |
| §3 背景与问题定义 | Step 3 | 保留业务背景、问题表、业务 / 技术问题分类。 |
| §4 目标与非目标 | Step 4 | 保留目标、非目标和范围收束。 |
| §5 用户与角色 | Step 5 | 保留角色表和角色分类;不生成权限矩阵。 |
| §6 使用方与依赖 | Step 6 | 保留内部仓依赖、外部依赖、依赖裁剪、禁止依赖和 path dependency 判断。 |
| §7 核心能力闭环 | Step 7 | 保留 C-CH-1~5、闭环图、能力层级划分和功能回填锚点。 |
| §8 用户故事 | Step 8 | 保留核心故事、外围增强故事、边界外排除和故事映射。 |
| §9 功能需求 | Step 9 | 保留 `FR-CH-001~016`、`FR-CH-E01~E07`、功能映射和边界外排除。 |
| §10 业务规则与边界约束 | Step 10 | 保留 `BR-CH-001~037`、`BR-CH-E001`、规则类型和规则映射。 |
| §11 数据需求与数据归属 | Step 11 | 保留真相 / 快照 / 引用 / 禁止保存正文四类数据和功能 / 规则映射。 |
| §12 接口与依赖 | Step 12 | 保留能力级接口、依赖边界、接口类型、依赖类型和功能映射;不写 API / DTO / schema。 |
| §13 非功能需求 | Step 13 | 保留 `NFR-CH-001~020`、类别适用性、映射和旧指标取舍。 |
| §14 验收标准 | Step 14 | 保留 `AC-CH-001~037`、`VF-CH-001~013` 和验收映射;不写测试步骤或签署。 |
| §15 风险与待确认事项 | Step 15 | 保留风险、待确认项、当前不阻塞 / 后续阻塞和处理口径。 |
| §16 需求追溯矩阵 | Step 16 | 保留主追溯矩阵、跨能力审计、漏项检查和追溯结论。 |

---

## 4. 每章校准来源映射

| 正式章节 | 校准来源 | 延伸阅读指向 |
|---|---|---|
| §1 | `design-calibration/00_req_step_01_upstream_relation.md` | “结构化中间产物”“当前文档问题诊断”“设计取舍” |
| §2 | `design-calibration/00_req_step_02_position_boundary.md` | “结构化中间产物”“当前文档问题诊断”“设计取舍” |
| §3 | `design-calibration/00_req_step_03_problem_context.md` | “结构化中间产物”“当前文档问题诊断”“设计取舍” |
| §4 | `design-calibration/00_req_step_04_goals_non_goals.md` | “结构化中间产物”“当前文档问题诊断”“设计取舍” |
| §5 | `design-calibration/00_req_step_05_users_roles.md` | “结构化中间产物”“当前文档问题诊断”“设计取舍” |
| §6 | `design-calibration/00_req_step_06_consumers_dependencies.md` | “结构化中间产物”“依赖裁剪图”“旧材料差异审计” |
| §7 | `design-calibration/00_req_step_07_core_capability_loop.md` | “结构化中间产物”“功能回填映射结论” |
| §8 | `design-calibration/00_req_step_08_user_stories.md` | “按能力节点组织的用户故事结论”“结构化中间产物”“跨能力故事审计” |
| §9 | `design-calibration/00_req_step_09_functional_requirements.md` | “结构化中间产物”“功能依赖结论” |
| §10 | `design-calibration/00_req_step_10_business_rules_boundaries.md` | “结构化中间产物”“跨能力规则审计”“旧规则重裁映射” |
| §11 | `design-calibration/00_req_step_11_data_ownership.md` | “结构化中间产物”“跨能力数据审计”“旧材料重裁映射” |
| §12 | `design-calibration/00_req_step_12_interfaces_dependencies.md` | “结构化中间产物”“跨能力接口审计”“旧材料重裁映射” |
| §13 | `design-calibration/00_req_step_13_non_functional_requirements.md` | “结构化中间产物”“Step 14 验收承接方向” |
| §14 | `design-calibration/00_req_step_14_acceptance_criteria.md` | “结构化中间产物”“跨能力验收审计” |
| §15 | `design-calibration/00_req_step_15_risks_open_questions.md` | “结构化中间产物”“旧材料差异审计”“自检与停审” |
| §16 | `design-calibration/00_req_step_16_traceability_matrix.md` | “结构化中间产物”“接口 / 依赖追溯审计”“漏项检查表” |

---

## 5. 旧正式文档差异审计

| 旧内容 | 当前处理 | 正式文档落点 |
|---|---|---|
| 旧定位写作 MCP Server 注册表 + A2A Node Directory + Provider Contract + 白名单 / 配额 / 成本记账 | 重裁为 capability identity、registry、adapter descriptor、governance seam、method relation、formal exposure | §2、§7、§9 |
| `Provider Contract` 包含 API key、quota、route、cost、failover | 只保留 adapter descriptor 线索;secret / provider runtime / cost 禁止进入 truth | §4、§9、§10、§11、§14 |
| `QueryCapabilities` / provider lookup / allow-deny | 重裁为 formal exposure / controlled consumer view;不保留旧接口名和执行裁决 | §9、§10、§12、§16 |
| governance Policy 下发刷新白名单 | 重裁为 governance result ref / safe summary / seam relation;不继承 Policy truth 或 30s 指标 | §6、§10、§11、§13、§14 |
| Cost Accounting / CostRecord / 成本覆盖率 | 排除为 cost / billing / finance ledger historical conflict | §4、§10、§11、§13、§14、§15 |
| KMS / Vault / 明文 key grep | 重裁为 secret ref / safe summary 和禁止 secret 正文;不生成 KMS 实现目标 | §10、§11、§13、§14 |
| marketplace metadata / listing | 降为只读生态发现外围增强;listing / transaction / pricing / fulfillment 排除 | §8、§9、§10、§11、§12 |
| runtime / tools 必经 hub 执行 | 排除为 execution 边界;runtime/tools 只消费能力接入事实 | §2、§6、§10、§12、§14 |
| 旧 Given-When-Then、验收签署、测试证据 | 不进入需求正式文档;后续 `05/06` 重新设计,且不得伪造 evidence | §14、§15 |

---

## 6. 正式文档写入门禁

| 检查项 | 结果 | 说明 |
|---|---|---|
| 每章是否有具体校准来源 | pass | §1~§16 均列出具体 `design-calibration/00_req_step_*` 文件。 |
| 是否新增 Step 1~16 未确认结论 | pass | 正式内容来自结构化中间产物和回填草稿。 |
| 是否保留可落码粒度 | pass | Step 9 以后保留 FR、BR、数据归属、接口边界、NFR、AC / VF 和追溯矩阵。 |
| 是否写入 API / DTO / event schema / state / repository / handler | pass | 需求层只写能力级接口和边界,具体设计后移 `01~07`。 |
| 是否写入实现 commit、run_id、真实 evidence alias 或测试结果 | pass | 未写入任何实现或验收签署证据。 |
| 是否沿用旧正式文档冲突内容 | pass | 冲突口径均作为 historical material 或 risk 处理。 |
| 是否允许进入 `01-架构设计.md` | fail until user confirms | Step 17 完成后必须停审,等待用户确认。 |

---

## 7. 回填 / 装配策略

1. 正式 `00-需求文档.md` 采用 `需求文档书写规范.md` 建议的 16 章结构。
2. 每章开头按规范写入“校准来源”和“延伸阅读”,并指向具体 Step 文件。
3. 表格内容以 Step 1~16 的结构化中间产物为准,必要时压缩重复解释,但不压缩核心编号、边界和追溯关系。
4. 旧正式文档、README 和旧 `01/02/03/05/06` 只作为 historical material,不得作为当前正式结论来源。
5. 对后续文档仍需闭合的 API、DTO、状态机、配置、测试证据和 implementation boundary,在 §15 作为待确认 / 后续设计暂存,不得在需求层现场补齐。

---

## 8. 自检与停审

| 检查项 | 结果 | 说明 |
|---|---|---|
| Step 17 中间产物已创建 | pass | 本文件已创建。 |
| 正式 `00-需求文档.md` 已重建 | pass | 正式文档按 16 章结构重写。 |
| flow 已更新 | pass | `00_requirements_calibration_flow.md` 更新到 Step 17 / `00_completed_stop_review`。 |
| 项目台账已更新 | pass | `project_execution_ledger.md` 更新到 `00-需求文档.md` completed stop review。 |
| 上游 blocker | none | 未发现阻塞进入 `01-架构设计.md` 的上游 blocker;旧材料冲突仍作为 historical material / risk 管控。 |
| 当前是否需要提交 | 否 | 未经用户明确要求不得提交。 |
| 下一步 | 等待用户确认后读取 `01-架构设计.md` 对应 SOP / 书写规范与上游 `00-需求文档.md` | 不得自动跨入 `01`。 |
