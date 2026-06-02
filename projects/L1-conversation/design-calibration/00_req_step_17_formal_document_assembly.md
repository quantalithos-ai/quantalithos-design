# Step 17. 正式整理为 00-需求文档

> 对应 SOP: `standards/document/需求文档讨论流程_SOP.md` Step 17
> 回填章节: `00-需求文档.md` 全文
> 生成日期: 2026-06-01
> 状态: 已完成

---

## 1. 本步目标

将 Step 1~Step 16 已确认的中间产物整理为正式 `00-需求文档.md`。本步只做收口和格式整理,不新增需求、不新增规则、不新增接口细节。

---

## 2. 本步输入

| 输入 | 用途 |
|---|---|
| `00_req_step_01_upstream_relation.md` | 回填 §1 与上游文档的关系声明 |
| `00_req_step_02_position_boundary.md` | 回填 §2 本仓定位与边界 |
| `00_req_step_03_problem_context.md` | 回填 §3 背景与问题定义 |
| `00_req_step_04_goals_non_goals.md` | 回填 §4 目标与非目标 |
| `00_req_step_05_users_roles.md` | 回填 §5 用户与角色 |
| `00_req_step_06_consumers_dependencies.md` | 回填 §6 使用方与依赖 |
| `00_req_step_07_core_capability_loop.md` | 回填 §7 核心能力闭环 |
| `00_req_step_08_user_stories.md` | 回填 §8 用户故事 |
| `00_req_step_09_functional_requirements.md` | 回填 §9 功能需求 |
| `00_req_step_10_rules_boundary_constraints.md` | 回填 §10 业务规则与边界约束 |
| `00_req_step_11_data_requirements_ownership.md` | 回填 §11 数据需求与数据归属 |
| `00_req_step_12_interfaces_dependencies.md` | 回填 §12 接口与依赖 |
| `00_req_step_13_non_functional_requirements.md` | 回填 §13 非功能需求 |
| `00_req_step_14_acceptance_criteria.md` | 回填 §14 验收标准 |
| `00_req_step_15_risks_open_questions.md` | 回填 §15 风险与待确认事项 |
| `00_req_step_16_traceability_matrix.md` | 回填 §16 需求追溯矩阵 |

---

## 3. 整理原则

- 删除旧 `00-需求文档.md`,再按新文件标准重建。
- 正式章节必须逐章标注校准来源和延伸阅读。
- 正式正文只保留收口结论,不复制每个 Step 的讨论过程、改动前后对比和方案取舍。
- 需求层不写数据库表结构、Rust 结构体、handler 伪代码、事务实现、repository / service / adapter / port 组织方式。
- 修正 Step 10 回填草稿与 Step 16 追溯矩阵的规则编号断裂,确保 `BR-CONV-013` 到 `BR-CONV-021` 在正式规则表中存在。

---

## 4. 输出结构

正式 `00-需求文档.md` 使用以下主链:

```text
1. 与上游文档的关系声明
2. 本仓定位与边界
3. 背景与问题定义
4. 目标与非目标
5. 用户与角色
6. 使用方与依赖
7. 核心能力闭环
8. 用户故事
9. 功能需求
10. 业务规则与边界约束
11. 数据需求与数据归属
12. 接口与依赖
13. 非功能需求
14. 验收标准
15. 风险与待确认事项
16. 需求追溯矩阵
```

---

## 5. 复核项

| 检查项 | 结果 |
|---|---|
| 每章是否有具体 `design-calibration` 来源 | 通过 |
| 是否删除旧文档后按新文件标准重建 | 通过 |
| 是否仍残留旧版“Conversation 四形态 + Turn 五 kind + AG-UI 17”作为需求主线 | 未残留为主线,仅作为旧输入线索处理 |
| 是否把 Chat / Workspace / Bridges / Runtime / Governance / Artifact / Identity 职责写入 Conversation 真相 | 未写入 |
| Step 10 规则编号与 Step 16 追溯矩阵是否闭合 | 通过 |
| 是否新增中间产物未确认之外的新需求 | 未新增 |

---

## 6. 本章结论

Step 17 已完成。正式 `00-需求文档.md` 已从旧版大而全文档切换为按新版需求 SOP 生成的需求基线,可以作为后续 `01-架构设计.md` 校准输入。
