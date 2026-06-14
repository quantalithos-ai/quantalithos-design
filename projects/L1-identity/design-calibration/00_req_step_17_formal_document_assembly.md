# Step 17. 正式整理为 `00-需求文档.md`

> 对应 SOP: `standards/document/需求文档讨论流程_SOP.md` Step 17
> 回填章节: `00-需求文档.md` 全文
> 生成日期: 2026-06-10

---

## 1. Step 状态 + Step 内计划

- 状态: 已完成
- 本步目标: 说明正式 `00-需求文档.md` 如何从 Step 1~16 装配,并给出正式文档复核门禁。
- 复杂度判断: 正式 `00` 已具备新版 16 章结构和校准来源,本步不新增需求结论;只做装配规则、章节映射和完成检查。

| 子步骤 | 产物 | 状态 |
|---|---|---|
| 读取 Step 1~16 中间产物 | 输入表 | 已完成 |
| 回答正式装配问题 | SOP 问题回答表 | 已完成 |
| 诊断正式文档和校准链可能不一致处 | 当前文档问题诊断表 | 已完成 |
| 比较装配前后 | 改动前后对比表 | 已完成 |
| 记录装配取舍 | 设计取舍表 | 已完成 |
| 输出章节映射和完成检查 | 结构化中间产物 | 已完成 |
| 提供正式文档处理草稿 | 回填草稿 | 已完成 |
| 明确后续 01~07 门禁 | 待确认事项、进入下一步条件 | 已完成 |

---

## 2. 本步输入

| 输入 | 使用方式 |
|---|---|
| `00_req_step_01_upstream_relation.md` | 装配 §1 |
| `00_req_step_02_position_boundary.md` | 装配 §2 |
| `00_req_step_03_problem_context.md` | 装配 §3 |
| `00_req_step_04_goals_non_goals.md` | 装配 §4 |
| `00_req_step_05_users_roles.md` | 装配 §5 |
| `00_req_step_06_consumers_dependencies.md` | 装配 §6 |
| `00_req_step_07_core_capability_loop.md` | 装配 §7 |
| `00_req_step_08_user_stories.md` | 装配 §8 |
| `00_req_step_09_functional_requirements.md` | 装配 §9 |
| `00_req_step_10_business_rules_boundaries.md` | 装配 §10 |
| `00_req_step_11_data_ownership.md` | 装配 §11 |
| `00_req_step_12_interfaces_dependencies.md` | 装配 §12 |
| `00_req_step_13_non_functional_requirements.md` | 装配 §13 |
| `00_req_step_14_acceptance_criteria.md` | 装配 §14 |
| `00_req_step_15_risks_open_questions.md` | 装配 §15 |
| `00_req_step_16_traceability_matrix.md` | 装配 §16 |
| 当前 `projects/L1-identity/00-需求文档.md` | 复核正式文档是否已覆盖新版校准链 |

---

## 3. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 是否保留旧 `00-需求文档.md` 结构 | 不保留旧结构。正式文档按新版 16 章结构组织。 |
| 是否新增中间产物之外的新需求 | 否。正式文档只整理 Step 1~16 已确认结论。 |
| 是否保留旧性能和技术栈承诺 | 否。旧性能数字和技术栈进入风险 / 待确认,不作为新版 `00` 基线。 |
| 是否引用已有 `04-配置设计.md` | 不作为新版 `00` 依据;待新版 `01`~`03` 稳定后复核。 |
| 正式章节如何追溯 | 每章开头列具体 `design-calibration/00_req_step_*` 校准来源。 |
| 后续文档如何使用正式 `00` | 后续 `01`~`07` 必须以正式 `00` 和对应 Step 中间产物作为需求来源,不得直接继承旧设计。 |

---

## 4. 当前文档问题诊断

| 项 | 当前表现 | 诊断 | 处理 |
|---|---|---|---|
| 正式 `00` 结构 | 已是 16 章结构 | 与新版需求书写方向一致 | 保留并按新校准链复核 |
| 校准来源 | 每章已有 `design-calibration/00_req_step_*` | 来源存在,但旧中间产物之前偏薄 | 已通过 Step 1~16 增厚 |
| 编号体系 | `G-ID`、`C-ID`、`US-ID`、`FR-ID`、`BR-ID`、`AC/VETO-ID` 已稳定 | 不需要重编号 | 保留 |
| 正式正文内容 | 已覆盖主线 | 需确认无中间产物之外的新需求 | Step 17 后检查 |
| 旧 `01/02/03` | 已存在较详细内容 | 可能早于新版校准链 | 后续需逐份复核 |

---

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 中间产物粒度 | Step 文件约 50~120 行,结构不统一 | Step 1~17 均有十段结构和 Step 内计划 | 对齐 governance 粒度和最新 SOP |
| 正式装配依据 | 正式正文相对完整但解释链不足 | 正式正文由更完整的 Step 产物支撑 | 提高可追溯性 |
| 后续使用 | 可能直接引用旧 `00/01/02` | 明确 `00` 和 `design-calibration/00` 为需求入口 | 防止旧设计反向约束 |
| 未闭口事项 | 分散 | Step 15 汇总,Step 16 要求后续回指 | 防止实现脑补 |
| 配置设计 | 已有 `04` | 标记为需在新版 `03` 后复核 | 避免文档链错位 |

---

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A: 删除正式 `00` 并完全重写 | 最彻底 | 当前正式 `00` 已较好覆盖新版主线,完全重写风险较高 | 不采用 |
| 方案 B: 先增厚校准链,再复核正式 `00` 是否需要局部同步 | 保留已稳定编号和正文,补齐来源 | 需要严格检查是否存在未来源结论 | 采用 |
| 方案 C: 只更新 Step 17,不补 Step 1~16 | 快 | 无法解决 identity 与 governance 粒度差距 | 不采用 |

---

## 7. 结构化中间产物

### 7.1 正式文档章节映射

| 正式章节 | 校准来源 |
|---|---|
| §1 与上游文档的关系声明 | `00_req_step_01_upstream_relation.md` |
| §2 本仓定位与边界 | `00_req_step_02_position_boundary.md` |
| §3 背景与问题定义 | `00_req_step_03_problem_context.md` |
| §4 目标与非目标 | `00_req_step_04_goals_non_goals.md` |
| §5 用户与角色 | `00_req_step_05_users_roles.md` |
| §6 使用方与依赖 | `00_req_step_06_consumers_dependencies.md` |
| §7 核心能力闭环 | `00_req_step_07_core_capability_loop.md` |
| §8 用户故事 | `00_req_step_08_user_stories.md` |
| §9 功能需求 | `00_req_step_09_functional_requirements.md` |
| §10 业务规则与边界约束 | `00_req_step_10_business_rules_boundaries.md` |
| §11 数据需求与数据归属 | `00_req_step_11_data_ownership.md` |
| §12 接口与依赖 | `00_req_step_12_interfaces_dependencies.md` |
| §13 非功能需求 | `00_req_step_13_non_functional_requirements.md` |
| §14 验收标准 | `00_req_step_14_acceptance_criteria.md` |
| §15 风险与待确认事项 | `00_req_step_15_risks_open_questions.md` |
| §16 需求追溯矩阵 | `00_req_step_16_traceability_matrix.md` |

### 7.2 完成检查

| 检查项 | 结论 |
|---|---|
| 正式文档是否按 16 章结构生成 | 通过 |
| 每章是否有具体校准来源 | 通过 |
| 是否引入未确认新需求 | 待最终 diff / grep 检查 |
| 是否保留旧实现口径为正式结论 | 待最终 diff / grep 检查 |
| 是否保留旧编号体系 | 通过 |
| 是否需要立刻重写 `04-配置设计.md` | 不在本步,待新版 `03` 完成后复核 |

### 7.3 后续文档门禁

| 后续动作 | 门禁 |
|---|---|
| 进入 `01-架构设计.md` 复核 | 必须引用正式 `00` 和 `00_req_step_*` |
| 进入 `02-概要设计.md` 复核 | 对象和流程必须回指 `FR-ID`、`BR-ID`、数据归属和接口边界 |
| 进入 `03-详细设计.md` | protocol、object、state、flow、port、transaction 和 tests 必须 1:1 回指需求和概要 |
| 复核 `04-配置设计.md` | 必须在新版 `03` 对象和 port 稳定后执行 |
| 编写 `07-实施计划.md` | 每笔 commit boundary 必须做 1:1 可落码性复核 |

---

## 8. 回填草稿

```md
本文由 `design-calibration/00_req_step_01_upstream_relation.md` 至 `design-calibration/00_req_step_16_traceability_matrix.md` 装配而来。后续 `01`~`07` 文档必须以本文和对应中间产物作为需求来源;如果后续对象、字段、DTO、flow、job、config item、test case 或 commit boundary 无法回指本文的能力、功能、规则、数据、接口或验收,应暂停并回到对应设计 step 补齐讨论。
```

---

## 9. 待确认事项

| 编号 | 待确认事项 | 当前处理 |
|---|---|---|
| OQ-ID-S17-001 | 正式 `00` 是否需要局部同步新版 Step 1~16 细节 | 通过最终复核决定 |
| OQ-ID-S17-002 | 旧 `01/02/03` 是否全部重写还是局部复核 | 后续任务决定 |
| OQ-ID-S17-003 | 已有 `04-配置设计.md` 是否保留或重写 | 待新版 `03` 完成后复核 |

---

## 10. 进入下一步条件

Step 1~16 已可作为正式 `00` 的完整校准来源。完成正式文档复核、格式检查和残留关键词检查后,可以把 `L1-identity` 需求层视为本轮重校准完成。
