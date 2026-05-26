# L3-method-library 03-详细设计校准流程

> 本文件是 `projects/L3-method-library/03-详细设计.md` 的 SOP 校准工作台。
> 它记录每个 Step 的中间产物位置、状态和回填章节。
> 本目录中的内容是中间产物,不替代正式 `03-详细设计.md`。

---

## 一、执行依据

| 类型 | 文档 |
|---|---|
| 详细设计书写规范 | `standards/document/详细设计书写规范.md` |
| 详细设计讨论 SOP | `standards/document/详细设计讨论流程_SOP.md` |
| 中间产物规范 | `standards/document/设计文档讨论中间产物规范.md` |
| Rust 编码规范 | `standards/coding/rust.md` |
| 当前需求文档 | `projects/L3-method-library/00-需求文档.md` |
| 当前架构设计 | `projects/L3-method-library/01-架构设计.md` |
| 当前概要设计 | `projects/L3-method-library/02-概要设计.md` |
| 待校准详细设计 | `projects/L3-method-library/03-详细设计.md` |

---

## 二、状态总览

```text
[ ] 未开始
[~] 讨论中
[x] 已确认
```

| Step | 状态 | 主题 | 中间产物 | 回填章节 |
|---|---|---|---|---|
| Step 1 | [x] | 确认概要设计输入边界 | `03_ddd_step_01_input_boundary.md` | §1 与上游文档的关系声明 / §17 风险与待确认事项 |
| Step 2 | [x] | 明确本轮实现范围和非范围 | `03_ddd_step_02_scope.md` | §2 本次详细设计目标与范围 |
| Step 3 | [x] | 收稳编码规范、语言 / runtime、仓库约束 | `03_ddd_step_03_runtime_constraints.md` | §3 实现约束与编码规范承接 |
| Step 4 | [x] | 收稳实现单元与文件布局 | `03_ddd_step_04_module_layout.md` | §4 实现单元与文件布局 |
| Step 5 | [x] | 定义模块实现契约主轴 | `03_ddd_step_05_module_contracts.md` | §5 模块实现契约 |
| Step 6 | [x] | 逐模块定义对象实现契约 | `03_ddd_step_06_object_contracts.md` | §5 模块实现契约 / §6 全局对象 / Trait / API 索引 |
| Step 7 | [x] | 逐模块定义 Trait / Port / Adapter 契约 | `03_ddd_step_07_trait_port_adapter.md` | §5 模块实现契约 / §6 全局对象 / Trait / API 索引 |
| Step 8 | [x] | 定义 API / Command / Query / Event / Job 协议契约 | `03_ddd_step_08_protocol_contracts.md` | §7 API / Command / Query / Event / Job 协议契约 |
| Step 9 | [x] | 逐接口定义函数级处理流 | `03_ddd_step_09_function_flows.md` | §8 逐接口函数级处理流 |
| Step 10 | [x] | 定义状态机与转换矩阵 | `03_ddd_step_10_state_machine.md` | §9 状态机与转换矩阵 |
| Step 11 | [x] | 定义持久化、事务与一致性契约 | `03_ddd_step_11_persistence_tx_consistency.md` | §10 数据持久化、事务与一致性契约 |
| Step 12 | [x] | 定义错误模型、异常分支与恢复口径 | `03_ddd_step_12_errors_recovery.md` | §11 错误模型、异常分支与恢复口径 |
| Step 13 | [x] | 定义并发、幂等与重入保护 | `03_ddd_step_13_concurrency_idempotency.md` | §12 并发、幂等与重入保护 |
| Step 14 | [x] | 定义配置引用与外部依赖绑定 | `03_ddd_step_14_config_dependencies.md` | §13 配置引用与外部依赖绑定 |
| Step 15 | [x] | 定义可观测性与审计埋点契约 | `03_ddd_step_15_observability_audit.md` | §14 可观测性与审计埋点契约 |
| Step 16 | [x] | 定义测试切口与最小验证清单 | `03_ddd_step_16_test_cut.md` | §15 测试切口与最小验证清单 |
| Step 17 | [x] | 收口详细设计到实施计划的承接清单 | `03_ddd_step_17_implementation_handoff.md` | §16 详细设计到实施计划的承接清单 |
| Step 18 | [x] | 风险与待确认事项 | `03_ddd_step_18_risks_open_questions.md` | §17 风险与待确认事项 |
| Step 19 | [x] | 整理正式详细设计文档 | `03_ddd_step_19_formal_document_assembly.md` | 全文 / §18 参考 |

---

## 三、本轮校准总目标

本轮不是继续扩写现有 `03-详细设计.md`,而是把它校准成可以 1:1 还原实现契约的模块级设计文档。

目标输出:

```text
1. 03 按模块实现契约组织,不把对象和函数堆成全局清单
2. 03 明确每个模块的对象、trait、API、处理流、状态机、持久化、错误和测试切口
3. 03 形成可直接驱动实施计划和编码的承接清单
4. 03 的每个 Step 都先形成中间产物,再回填正式文档
```

---

## 四、中间产物模板约束

- 每个 Step 必须先形成中间产物,不得直接改正式 `03-详细设计.md`
- 每个 Step 必须逐项回答 SOP 的“应问的问题”
- 每个 Step 必须包含当前文档问题诊断和改动前后对比
- 所有 ASCII 图必须使用 `text` 代码块并附关键说明
- Step 状态从 `[~]` 改为 `[x]` 后,才能进入下一 Step
- 未确认事项不得写成正式详细设计结论
- 每个 Step 的中间产物必须遵循 `standards/document/设计文档讨论中间产物规范.md` 的固定十段结构

---

## 五、执行纪律

- 不直接在正式 `03-详细设计.md` 中保留讨论过程
- 不把概要设计中的轮廓口径直接当成实现契约
- 不把未确认的实现细节写成已收稳结论
- 不在详细设计里重新发明概要设计主语
- 不在 Step 未确认时推进到下一 Step
