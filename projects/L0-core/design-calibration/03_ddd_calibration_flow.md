# L0-core 03-详细设计校准流程

> 本文件是 `projects/L0-core/03-详细设计.md` 的 SOP 校准工作台。
> 它记录每个 Step 的中间产物位置、状态和回填章节。
> 本目录中的内容是中间产物,不替代正式 `03-详细设计.md`。
>
> 本轮状态说明:
> - 旧版 `03-详细设计.md` 基于旧 `02-概要设计.md` 的共享 primitive / ID / Ref / DTO 口径,不再作为正式详细设计主线。
> - 本轮详细设计以新版 `00-需求文档.md`、`01-架构设计.md`、`02-概要设计.md` 为输入。
> - 每个 Step 必须先形成中间产物,确认后再进入下一 Step;正式 `03-详细设计.md` 在 Step 19 统一整理。

---

## 一、执行依据

| 类型 | 文档 |
|---|---|
| 详细设计书写规范 | `standards/document/详细设计书写规范.md` |
| 详细设计讨论 SOP | `standards/document/详细设计讨论流程_SOP.md` |
| 中间产物规范 | `standards/document/设计文档讨论中间产物规范.md` |
| 当前需求文档 | `projects/L0-core/00-需求文档.md` v0.2.0 |
| 当前架构设计 | `projects/L0-core/01-架构设计.md` v0.2.0 |
| 当前概要设计 | `projects/L0-core/02-概要设计.md` v0.2.0 |
| 待校准详细设计 | `projects/L0-core/03-详细设计.md` |

---

## 二、状态总览

```text
[ ] 未开始
[~] 讨论中
[x] 已确认
```

| Step | 状态 | 主题 | 中间产物 | 回填章节 |
|---|---|---|---|---|
| Step 1 | [x] | 确认概要设计输入边界 | `03_ddd_step_01_upstream_boundary.md` | §1 与上游文档的关系声明 |
| Step 2 | [x] | 明确本轮实现范围和非范围 | `03_ddd_step_02_scope.md` | §2 本次详细设计目标与范围 |
| Step 3 | [x] | 收稳编码规范、语言 / runtime、仓库约束 | `03_ddd_step_03_coding_runtime_constraints.md` | §3 实现约束与编码规范承接 |
| Step 4 | [x] | 收稳实现单元与文件布局 | `03_ddd_step_04_units_file_layout.md` | §4 实现单元与文件布局 |
| Step 5 | [x] | 定义模块实现契约主轴 | `03_ddd_step_05_module_contracts_axis.md` | §5 模块实现契约 |
| Step 6 | [x] | 逐模块定义对象实现契约 | `03_ddd_step_06_object_contracts.md` | §5 / §6 |
| Step 7 | [x] | 逐模块定义 Trait / Port / Adapter 契约 | `03_ddd_step_07_trait_port_adapter_contracts.md` | §5 / §6 |
| Step 8 | [x] | 定义 API / Command / Query / Event / Job 协议契约 | `03_ddd_step_08_protocol_contracts.md` | §7 / §6 |
| Step 9 | [x] | 逐接口定义函数级处理流 | `03_ddd_step_09_function_flows.md` | §8 |
| Step 10 | [x] | 定义状态机与转换矩阵 | `03_ddd_step_10_state_matrix.md` | §9 |
| Step 11 | [x] | 定义持久化、事务与一致性契约 | `03_ddd_step_11_persistence_transaction_consistency.md` | §10 |
| Step 12 | [x] | 定义错误模型、异常分支与恢复口径 | `03_ddd_step_12_error_recovery.md` | §11 |
| Step 13 | [x] | 定义并发、幂等与重入保护 | `03_ddd_step_13_concurrency_idempotency.md` | §12 |
| Step 14 | [x] | 定义配置引用与外部依赖绑定 | `03_ddd_step_14_config_dependencies.md` | §13 |
| Step 15 | [x] | 定义可观测性与审计埋点契约 | `03_ddd_step_15_observability_audit.md` | §14 |
| Step 16 | [x] | 定义测试切口与最小验证清单 | `03_ddd_step_16_test_slices.md` | §15 |
| Step 17 | [x] | 收口详细设计到实施计划的承接清单 | `03_ddd_step_17_implementation_handoff.md` | §16 |
| Step 18 | [x] | 风险与待确认事项 | `03_ddd_step_18_risks_open_questions.md` | §17 |
| Step 19 | [x] | 整理正式详细设计文档 | `03_ddd_step_19_formal_document_assembly.md` | 全文 |

---

## 三、本轮校准总目标

本轮不是继续扩写旧版 `03-详细设计.md`,而是基于已经收稳的新版 `00/01/02`,把 L0-core 的详细设计校准成可以 1:1 指导实现的代码实现契约。

目标输出:

```text
1. 03 只承接需求、架构和概要设计结论,不重新定义它们。
2. 03 按新版 18 章主链组织。
3. 03 以模块实现契约为主轴,而不是把所有对象 / trait / 函数堆到全局章节。
4. 03 明确文件布局、对象、trait、API、event、job、处理流、状态矩阵、持久化、事务、错误、幂等、配置、审计和测试切口。
5. 03 中所有 Rust struct / enum / enum variant / trait / public function 必须有 Rustdoc 风格中文注释。
6. 03 必须强到让另一个 agent 可以按文档在目标仓中还原实现。
```

---

## 四、执行纪律

- 每个 Step 必须先形成中间产物,不得直接改正式 `03-详细设计.md`。
- 每个 Step 必须逐项回答 SOP 的“应问的问题”。
- 每个 Step 必须包含当前文档问题诊断和改动前后对比。
- 每个 Step 如涉及图示,必须遵守详细设计 ASCII 图统一格式。
- Step 状态从 `[~]` 改为 `[x]` 后,才能进入下一 Step。
- 未确认事项不得写成正式详细设计契约。
- 允许参考已收稳的其他子项目详细设计方法、结构、图表风格和中间产物组织方式,但不能机械搬运其他子项目的业务对象、接口、状态机和职责结论。
- 如果详细设计过程中发现概要设计对象名、接口名、处理流或状态机需要改动,必须回退到对应概要设计 Step,不能在详细设计中静默改名。
