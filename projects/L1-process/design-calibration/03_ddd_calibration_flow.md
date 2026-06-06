# L1-process 03 详细设计校准工作台

> 对应 SOP: `standards/document/详细设计讨论流程_SOP.md`
> 中间产物规范: `standards/document/设计文档讨论中间产物规范.md`
> 可落码性标准: `standards/document/设计真相源闭环与可落码性标准.md`
> 目标正式文档: `projects/L1-process/03-详细设计.md`
> 创建日期: 2026-06-05
> 当前状态: Step 1~19 已完成;正式 03 已装配

---

## 1. 本轮目标

按详细设计 SOP 将新版 `00-需求文档.md`、`01-架构设计.md`、`02-概要设计.md` 转译成可以 1:1 实现的 `03-详细设计.md`。

旧版 `03-详细设计.md` 已按重建纪律删除。旧主线口径包括 `ProcessTemplate`、`WaitingGateState`、旧 MQ topic、旧 table draft 和旧 15 章结构,只保留在 git 历史中作为问题诊断输入,不得作为新版详细设计真相源。

---

## 2. 权威输入

| 输入 | 权威级别 | 用途 |
|---|---|---|
| `projects/L1-process/00-需求文档.md` | 正式上游 | 仓定位、需求边界、数据归属、业务规则、验收红线 |
| `projects/L1-process/01-架构设计.md` | 正式上游 | 系统边界、依赖方向、数据所有权、一致性和通信方式 |
| `projects/L1-process/02-概要设计.md` | 直接输入 | 代码主体框架、主要组成部分、对象轮廓、接口骨架、处理流、状态机 |
| `projects/L1-process/design-calibration/02_hld_*` | 解释性输入 | 理解概要设计结论来源;若与正式 `02` 冲突,以正式 `02` 为准 |
| `projects/L1-process/03-详细设计.md` | 待重建 | 正式详细设计入口;只能由本轮 `03_ddd_step_*` 中间产物装配 |

---

## 3. Step 状态表

| Step | 主题 | 中间产物 | 状态 |
|---|---|---|---|
| Step 1 | 确认概要设计输入边界 | `03_ddd_step_01_upstream_boundary.md` | [x] 已完成 |
| Step 2 | 明确本轮实现范围和非范围 | `03_ddd_step_02_scope.md` | [x] 已完成 |
| Step 3 | 收稳编码规范、语言 / runtime、仓库约束 | `03_ddd_step_03_constraints.md` | [x] 已完成 |
| Step 4 | 收稳实现单元与文件布局 | `03_ddd_step_04_file_layout.md` | [x] 已完成 |
| Step 5 | 定义模块实现契约主轴 | `03_ddd_step_05_module_contracts.md` | [x] 已完成 |
| Step 6 | 逐模块定义对象实现契约 | `03_ddd_step_06_object_contracts.md` | [x] 已完成 |
| Step 7 | 逐模块定义 Trait / Port / Adapter 契约 | `03_ddd_step_07_trait_port_adapter_contracts.md` | [x] 已完成 |
| Step 8 | 定义 API / Command / Query / Event / Job 协议契约 | `03_ddd_step_08_protocol_contracts.md` | [x] 已完成 |
| Step 9 | 定义逐接口函数级处理流 | `03_ddd_step_09_function_flows.md` | [x] 已完成 |
| Step 10 | 定义状态机与转换矩阵 | `03_ddd_step_10_state_matrix.md` | [x] 已完成 |
| Step 11 | 定义持久化、事务与一致性契约 | `03_ddd_step_11_persistence_transaction_consistency.md` | [x] 已完成 |
| Step 12 | 定义错误模型、异常分支与恢复口径 | `03_ddd_step_12_error_recovery.md` | [x] 已完成 |
| Step 13 | 定义并发、幂等与重入保护 | `03_ddd_step_13_concurrency_idempotency.md` | [x] 已完成 |
| Step 14 | 定义配置引用与外部依赖绑定 | `03_ddd_step_14_config_external_binding.md` | [x] 已完成 |
| Step 15 | 定义可观测性与审计埋点契约 | `03_ddd_step_15_observability_audit.md` | [x] 已完成 |
| Step 16 | 定义测试切口与最小验证清单 | `03_ddd_step_16_test_cuts.md` | [x] 已完成 |
| Step 17 | 收口详细设计到实施计划的承接清单 | `03_ddd_step_17_implementation_handoff.md` | [x] 已完成 |
| Step 18 | 风险与待确认事项 | `03_ddd_step_18_risks_open_questions.md` | [x] 已完成 |
| Step 19 | 整理正式详细设计文档 | `03_ddd_step_19_formal_document_assembly.md` | [x] 已完成 |

---

## 4. 执行纪律

- 每个 Step 独立生成中间产物,不得合并 Step。
- 每个 Step 完成后更新本工作台状态。
- 正式 `03-详细设计.md` 必须在 Step 19 由已完成的 Step 中间产物装配,不得直接从旧文档修补。
- 每个正式章节必须引用具体 `design-calibration/03_ddd_step_*.md` 校准来源。
- 对象契约、协议契约、处理流、状态机、幂等和测试切口必须执行 `设计真相源闭环与可落码性标准.md`。
- 若正式 `03` 与校准 Step 冲突,以正式 `03` 为准;若正式 `03` 是摘要且无法明确字段、schema 或处理规则,读取对应校准 Step;读取后仍不清楚时暂停回 Step 19 修正文档,不得交给实现者自行选边。
- 旧 `03-详细设计.md` 中仍适用的事实必须通过新版 `00/01/02` 或本轮 Step 中间产物重新进入,不得直接继承。
