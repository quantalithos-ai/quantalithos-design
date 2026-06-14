# L1-identity 详细设计校准工作台

> 对应正式文档: `projects/L1-identity/03-详细设计.md`
> 对应 SOP: `standards/document/详细设计讨论流程_SOP.md`
> 书写规范: `standards/document/详细设计书写规范.md`
> 中间产物规范: `standards/document/设计文档讨论中间产物规范.md`
> 可落码性标准: `standards/document/设计真相源闭环与可落码性标准.md`
> 当前目标: 按最新版详细设计 SOP 重写 `L1-identity` 的 `03-详细设计.md`
> 当前状态: Step 19.5 final self-check / validation / closure 已写入;等待用户最终审核

---

## 1. 本轮重写原则

- 新版 `03` 直接承接已审核通过的新版 `02-概要设计.md`,并继续参考当前 `00-需求文档.md`、`01-架构设计.md` 和对应需求 / 架构 / 概要中间产物。
- 旧版 `03-详细设计.md`、旧实现口径、旧对象名、旧 API、旧 schema、旧状态机和旧性能数字只作为历史问题诊断输入,不得直接进入新版正式结论。
- 现有 `04/05/06/07` 不作为新版 `03` 上游;它们后续必须接受新版 `03` 约束并重新复核。
- 正式 `03-详细设计.md` 只能在 Step 19 从已审核的 Step 1~18 中间产物装配,不得边讨论边直接补正式正文。
- 每个 Step 必须维护 Step 内计划,并保留 SOP 问题回答、当前材料诊断、改动前后对比、设计取舍、结构化中间产物、复杂度判断、回填草稿、待确认事项和进入下一步条件。
- Step 6 必须按模块从 capability / 功能推导对象、字段、函数、状态和不变量;不得一次性生成无功能来源的全局对象清单。
- Step 7~10 必须按模块 / 协议族 / 接口 / 状态机小循环停审,再做跨模块闭环审计。
- 每完成一个 Step 必须停审;用户审核通过后再进入下一 Step。

---

## 2. 稳定输入

| 输入 | 当前状态 | 本轮使用方式 |
|---|---|---|
| `projects/L1-identity/00-需求文档.md` | 已有新版草稿 | 需求输入;若用户后续判定不稳,立即回退 |
| `projects/L1-identity/01-架构设计.md` | 已有新版草稿 | 架构输入;若用户后续判定不稳,立即回退 |
| `projects/L1-identity/02-概要设计.md` | Step 14 已审核通过 | 详细设计直接输入 |
| `projects/L1-identity/design-calibration/02_hld_step_*.md` | 已完成概要中间产物 | 解释概要结论来源;若与正式 `02` 冲突,以正式 `02` 为准 |
| `standards/document/详细设计讨论流程_SOP.md` | 最新详细设计流程标准 | Step 1~19 执行依据 |
| `standards/document/详细设计书写规范.md` | 最新正式文档结构标准 | Step 19 装配依据 |
| `standards/document/设计文档讨论中间产物规范.md` | 最新中间产物标准 | Step 文件结构、计划和未来 Step 落盘纪律 |
| `standards/document/设计真相源闭环与可落码性标准.md` | 最新闭环复核标准 | Step 6~17 可落码闭环复核依据 |
| 旧 `03-详细设计.md` | 已废弃 | 仅作为历史问题诊断输入;不得直接继承 |
| 现有 `04/05/06/07` | 早于新版 `02/03` | 不作为新版 `03` 上游;后续需按新版 `03` 复核 |

---

## 3. 总流程计划

> 注意:未来 Step 文件只能在当前 Step 到达时创建、替换或改写。总流程可以一次性规划,但不得提前批量落盘未来 Step 文件。

| Step | 主题 | 输入文件 | 输出文件 | 前序依赖 | 当前状态 | 完成门禁 | 下一步许可 |
|---|---|---|---|---|---|---|---|
| Step 1 | 确认概要设计输入边界 | 新版 `00/01/02`、概要承接清单、详细设计 SOP / 规范 | `03_ddd_step_01_upstream_boundary.md` | 无 | 已完成 | 上游承接、本文不再回答 / 必须回答、输入风险已明确 | 已审核通过;进入 Step 2 |
| Step 2 | 明确本轮实现范围和非范围 | Step 1、`02` 目标 / 承接清单 / 风险 | `03_ddd_step_02_scope.md` | Step 1 | 已完成 | 实现契约目标、非范围和阶段边界清楚 | 已审核通过;进入 Step 3 |
| Step 3 | 收稳编码规范、语言 / runtime、仓库约束 | Step 2、编码规范、仓库约束、sibling repo 线索 | `03_ddd_step_03_constraints.md` | Step 2 | 已完成 | 编码、rustdoc、依赖和仓库约束可指导文件布局 | 已审核通过;进入 Step 4 |
| Step 4 | 收稳实现单元与文件布局 | Step 2~3、`02` 代码主体框架、目录组织规范 | `03_ddd_step_04_file_layout.md` | Step 3 | 已完成 | 实现者可据此创建目录、crate、module 和文件 | 已审核通过;进入 Step 5 |
| Step 5 | 定义模块实现契约主轴 | Step 4、`02` 主要组成部分 / 分层 | `03_ddd_step_05_module_contracts.md` | Step 4 | 已完成 | 模块职责、对外暴露和依赖方向稳定 | 已审核通过;进入 Step 6 |
| Step 6 | 逐模块定义对象实现契约 | Step 5、`02` 关键对象、处理流、状态线索 | `03_ddd_step_06_object_contracts.md` | Step 5 | 已完成 | 每个对象字段、函数、状态和不变量可 1:1 实现 | 已审核通过;进入 Step 7 |
| Step 7 | 逐模块定义 Trait / Port / Adapter 契约 | Step 6、接口和外部接缝 | `03_ddd_step_07_trait_port_adapter_contracts.md` | Step 6 | 已完成 | 读取面 / 保存面 / fake 等价语义支撑后续协议和 flow | 已审核通过;进入 Step 8 |
| Step 8 | 定义 API / Command / Query / Event / Job 协议契约 | Step 6~7、`02` 接口骨架 | `03_ddd_step_08_protocol_contracts.md` | Step 7 | 已完成并已审核通过 | DTO / event / job schema 与 domain 构造闭环 | 已进入 Step 9 |
| Step 9 | 逐接口定义函数级处理流 | Step 6~8、`02` 处理流 | `03_ddd_step_09_function_flows.md` | Step 8 | 已完成并已审核通过 | 每条 flow 可回指对象、port、协议、状态和事务边界;跨 flow 审计无新增 blocker | 已进入 Step 10 |
| Step 10 | 定义状态机与转换矩阵 | Step 6~9、`02` 状态轮廓 | `03_ddd_step_10_state_matrix.md` | Step 9 | 已完成并已审核通过 | 状态集合、迁移、禁止方向、错误映射和测试切口闭合 | 已进入 Step 11 |
| Step 11 | 定义持久化、事务与一致性契约 | Step 6~10 | `03_ddd_step_11_persistence_transaction_consistency.md` | Step 10 | 已完成并已审核通过 | schema、repository、transaction、cursor、version 和一致性闭合 | 已进入 Step 12 |
| Step 12 | 定义错误模型、异常分支与恢复口径 | Step 8~11、`02` 异常边界 | `03_ddd_step_12_error_recovery.md` | Step 11 | 已完成并已审核通过 | public rejection / degraded / failed / retryable surface 闭合 | 已进入 Step 13 |
| Step 13 | 定义并发、幂等与重入保护 | Step 8~12 | `03_ddd_step_13_concurrency_idempotency.md` | Step 12 | 已完成并已审核通过 | idempotency、duplicate replay、stored result、UoW 和锁语义闭合 | 已进入 Step 14 |
| Step 14 | 定义配置引用与外部依赖绑定 | Step 3、Step 7~13、`02` 配置影响 | `03_ddd_step_14_config_external_binding.md` | Step 13 | 已完成并已审核通过 | runtime config shell、adapter binding 和禁配红线闭合 | 已进入 Step 15 |
| Step 15 | 定义可观测性与审计埋点契约 | Step 8~14 | `03_ddd_step_15_observability_audit.md` | Step 14 | 已完成并已审核通过 | runtime log / metric、business trace / audit / handoff、runtime/config/adapter redaction 和 Step 16 handoff 分层闭合 | 已进入 Step 16 |
| Step 16 | 定义测试切口与最小验证清单 | Step 6~15 | `03_ddd_step_16_test_cuts.md` | Step 15 | 已完成并已审核通过 | 每个模块 / 协议 / 状态 / 一致性边界有最小测试入口 | 已进入 Step 17 |
| Step 17 | 收口详细设计到实施计划的承接清单 | Step 1~16 | `03_ddd_step_17_implementation_handoff.md` | Step 16 | 已完成并已审核通过 | 07 可据此做 phase / commit boundary 审计 | 已进入 Step 18 |
| Step 18 | 风险与待确认事项 | Step 1~17 未闭口项 | `03_ddd_step_18_risks_open_questions.md` | Step 17 | 已完成并已审核通过 | 风险 / 待确认不被写成已闭口契约 | 已进入 Step 19 |
| Step 19 | 整理正式详细设计文档 | Step 1~18、详细设计书写规范 | `03_ddd_step_19_formal_document_assembly.md` 与 `../03-详细设计.md` | Step 18 | 19.5 已写入,等待用户最终审核 | 正式 `03` 每章有校准来源,无新增未确认契约 | 审核通过后复核 `04/05/06/07` |

---

## 4. Step 内统一执行模板

每个 `03_ddd_step_*` 文件必须按以下结构落盘:

1. Step 状态 + Step 内计划
2. 本步输入
3. SOP 问题回答
4. 当前材料 / 旧文档问题诊断
5. 改动前后对比
6. 设计取舍
7. 结构化中间产物
8. 复杂度判断 / 是否拆模块、协议族、接口或附录
9. 回填草稿
10. 待确认事项
11. 进入下一步条件

Step 6 必须额外包含逐模块 capability -> 对象 -> 字段 / 函数 / 状态 / 不变量的推导链。Step 7~10 必须额外包含按模块 / 协议族 / 接口 / 状态机的小循环计划和停审记录。

---

## 5. 当前必须额外盯住的事项

| 编号 | 事项 | 来源 | 当前处理 |
|---|---|---|---|
| DDD-WATCH-001 | 旧 `03` 是旧草稿,不得局部修补 | 旧文档诊断 | 本轮从 Step 1 重写 |
| DDD-WATCH-002 | 新版 `02` 的第 12 / 13 章是直接输入 | `02-概要设计.md` | Step 1 明确承接和风险 |
| DDD-WATCH-003 | Step 6 不得一次性生成全仓对象总表 | 详细设计 SOP v0.12、闭环标准 v0.34 | Step 6 必须按模块 capability 小循环 |
| DDD-WATCH-004 | Step 7~10 不得退回总表式生成 | 详细设计 SOP v0.13 | 每组停审后再跨模块审计 |
| DDD-WATCH-005 | sibling repo shared type 必须实际可检索 | 闭环标准 v0.41 | Step 3 / Step 7 / Step 8 复核 |
| DDD-WATCH-006 | accepted truth cursor、subject mapper、projection lookup、snapshot typed read 等经验必须前置复核 | 闭环标准 v0.42~v0.59 | Step 7~13 逐项闭合 |
| DDD-WATCH-007 | 现有 `04/05/06/07` 不得反向约束新版 `03` | `02` 风险与当前 flow | 后续需按新版 `03` 复核 |

---

## 6. 当前执行状态

| 项 | 状态 |
|---|---|
| 正式 `03-详细设计.md` | 第 1~18 章已装配并完成 Step 19.5 全文自检和 closure |
| 当前完成 Step | Step 19.5 final self-check / validation / closure |
| 当前下一步 | 等待用户最终审核;审核通过后复核 `04/05/06/07` |
| 是否创建 / 替换未来 Step 文件 | 已创建当前 Step 19 文件 |
| 旧 `03` 如何处理 | 视为 legacy draft;只作为问题诊断输入 |
