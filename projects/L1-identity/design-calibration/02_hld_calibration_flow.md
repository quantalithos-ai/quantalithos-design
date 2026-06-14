# L1-identity 概要设计校准工作台

> 对应正式文档: `projects/L1-identity/02-概要设计.md`
> 对应 SOP: `standards/document/概要设计讨论流程_SOP.md`
> 书写规范: `standards/document/概要设计书写规范.md`
> 中间产物规范: `standards/document/设计文档讨论中间产物规范.md`
> 当前目标: 按最新版概要设计 SOP 重写 `L1-identity` 的 `02-概要设计.md`
> 当前状态: Step 14 已审核通过;`02-概要设计.md` 已完成

---

## 1. 本轮重写原则

- 新版 `02` 只承接当前 `00-需求文档.md`、`01-架构设计.md` 和对应需求 / 架构中间产物。
- 旧版 `02-概要设计.md`、旧 `02_hld_step_*` 中间产物和旧实现口径只作为历史问题诊断输入,不得直接进入新版正式结论。
- 现有 `03/04/05/06/07` 不作为新版 `02` 上游;它们后续必须接受新版 `02` 约束并重新复核。
- 正式 `02-概要设计.md` 只能在 Step 14 从已审核的 Step 1~13 中间产物装配,不得边讨论边直接补正式正文。
- 每个 Step 必须维护 Step 内计划,并保留 SOP 问题回答、当前材料诊断、改动前后对比、设计取舍、结构化中间产物、复杂度判断、回填草稿、待确认事项和进入下一步条件。
- Step 5~9 必须按主要组成部分逐个小循环推进,不得一次性生成全仓对象、接口、处理流或状态总表。
- 每完成一个 Step 必须停审;用户审核通过后再进入下一 Step。

---

## 2. 稳定输入

| 输入 | 当前状态 | 本轮使用方式 |
|---|---|---|
| `projects/L1-identity/00-需求文档.md` | 已有新版草稿 | 需求输入;若用户后续判定不稳,立即回退 |
| `projects/L1-identity/01-架构设计.md` | 已有新版草稿 | 架构输入;若用户后续判定不稳,立即回退 |
| `projects/L1-identity/design-calibration/00_req_step_*.md` | 已有需求校准产物 | 需求追溯与旧口径诊断来源 |
| `projects/L1-identity/design-calibration/01_arch_step_*.md` | 已有架构校准产物 | 架构追溯与旧口径诊断来源 |
| `standards/document/概要设计讨论流程_SOP.md` | 最新概要设计流程标准 | Step 1~14 执行依据 |
| `standards/document/概要设计书写规范.md` | 最新正式文档结构标准 | Step 14 装配依据 |
| `standards/document/设计文档讨论中间产物规范.md` | 最新中间产物标准 | Step 文件结构、计划和未来 Step 落盘纪律 |
| `standards/document/设计真相源闭环与可落码性标准.md` | 最新闭环复核标准 | 防止后续详细设计和实现阶段脑补 |
| 旧 `02-概要设计.md` / 旧 `02_hld_step_*` | 已废弃 | 仅作为历史问题诊断输入;文件存在不代表当前 Step 已完成 |

---

## 3. 总流程计划

> 注意:旧 `02_hld_step_02_*` 到 `02_hld_step_14_*` 文件虽然仍可能存在,但当前状态以本表为准。未来 Step 到达时才允许逐个替换对应文件。

| Step | 主题 | 输入文件 | 输出文件 | 前序依赖 | 当前状态 | 完成门禁 | 下一步许可 |
|---|---|---|---|---|---|---|---|
| Step 1 | 确认上游输入边界 | 新版 `00/01`、需求 / 架构中间产物、概要 SOP / 规范 | `02_hld_step_01_upstream_boundary.md` | 无 | 已完成 | 上游承接、本文不再回答 / 必须回答、输入风险已明确 | 已获用户审核,允许进入 Step 2 |
| Step 2 | 明确本仓设计目标与当前范围 | Step 1、`00` 目标 / 能力 / 非目标、`01` 架构目标 / 约束 | `02_hld_step_02_goals_scope.md` | Step 1 | 已完成 | 概要设计目标、非范围和深度口径可指导后续章节 | 已获用户审核,允许进入 Step 3 |
| Step 3 | 收稳约束条件 | Step 1~2、`00` 业务规则 / VETO、`01` 约束 | `02_hld_step_03_constraints.md` | Step 2 | 已完成 | 约束能作为 Step 4~11 的章节门禁 | 已获用户审核,允许进入 Step 4 |
| Step 4 | 代码主体框架映射 | Step 2~3、`01` 限界上下文 / 运行承载 / 依赖方向 | `02_hld_step_04_code_subject_framework.md` | Step 3 | 已完成 | 代码主体、运行承载和架构模块映射稳定 | 已获用户审核,允许进入 Step 5 |
| Step 5 | 主要组成部分、职责与边界 | Step 4、`00` 核心能力、`01` 职责 / 数据边界 | `02_hld_step_05_components_boundary.md` | Step 4 | 已完成 | 每个主要组成部分职责、非职责、候选对象入口和停审记录闭合 | 已获用户审核,允许进入 Step 6 |
| Step 6 | 关键对象轮廓 | Step 5、对象候选池、核心能力 | `02_hld_step_06_key_objects.md` | Step 5 | 已完成 | 每个关键对象能回指主要组成部分 capability,字段 / 函数保持概要粒度 | 已获用户审核,允许进入 Step 7 |
| Step 7 | API / 接口骨架 | Step 5~6、需求接口依赖、架构通信方式 | `02_hld_step_07_api_interface_skeleton.md` | Step 6 | 已完成 | Command / Query / Event / Job / 外部接缝分类和目标对象闭合 | 已获用户审核,允许进入 Step 8 |
| Step 8 | 关键处理流 / 重要函数数据流 | Step 5~7、核心能力闭环 | `02_hld_step_08_processing_flows.md` | Step 7 | 已完成 | 每条关键流能回指入口、对象、接缝和状态方向 | 已获用户审核,允许进入 Step 9 |
| Step 9 | 状态定义与状态流转 | Step 6~8、生命周期 / 引用 / 投影 / handoff 状态线索 | `02_hld_step_09_state_machine.md` | Step 8 | 已完成 | 状态集合、触发来源、非法方向和后续详细矩阵承接闭合 | 已获用户审核,允许进入 Step 10 |
| Step 10 | 异常与边界场景轮廓 | Step 3、Step 8~9、风险 / VETO | `02_hld_step_10_exceptions_boundaries.md` | Step 9 | 已完成 | 边界破坏、来源不可用、duplicate、stale、forbidden body 等场景覆盖 | 已获用户审核,允许进入 Step 11 |
| Step 11 | 配置影响轮廓 | Step 4~10、配置不可越界约束 | `02_hld_step_11_configuration_impact.md` | Step 10 | 已完成 | 只识别配置影响和禁止配置化边界,不写配置项清单 | 已获用户审核,允许进入 Step 12 |
| Step 12 | 详细设计承接清单 | Step 4~11 | `02_hld_step_12_detailed_design_handoff.md` | Step 11 | 已完成 | 交给 `03` 的对象、port、DTO、flow、状态、持久化和风险边界明确 | 已获用户审核,允许进入 Step 13 |
| Step 13 | 设计风险与待确认事项 | Step 1~12 | `02_hld_step_13_risks_open_questions.md` | Step 12 | 已完成 | 风险与待确认事项未被写成已闭口结论 | 已获用户审核,允许进入 Step 14 |
| Step 14 | 整理正式概要设计文档 | Step 1~13、概要书写规范 | `02_hld_step_14_formal_document_assembly.md` 与 `../02-概要设计.md` | Step 13 | 已完成 | 正式 `02` 每章有校准来源,无新增未确认结论 | 已获用户审核;可进入新版 `03` 校准 |

---

## 4. Step 内统一执行模板

每个 `02_hld_step_*` 文件必须按以下结构落盘:

1. Step 状态 + Step 内计划
2. 本步输入
3. SOP 问题回答
4. 当前材料 / 旧文档问题诊断
5. 改动前后对比
6. 设计取舍
7. 结构化中间产物
8. 复杂度判断 / 是否拆主要组成部分或附录
9. 回填草稿
10. 待确认事项
11. 进入下一步条件

Step 5~9 必须额外包含主要组成部分小循环计划和停审记录。若一个 Step 的内容超过单文件可审查规模,先写主控文件,再在当前 Step 到达后按组成部分创建附录;不得提前创建未来 Step 文件。

---

## 5. 当前必须额外盯住的事项

| 编号 | 事项 | 来源 | 当前处理 |
|---|---|---|---|
| HLD-WATCH-001 | 旧 `02` 已被用户判定不完善,不得局部修补 | 用户当前指令 | 本轮从 Step 1 重写 |
| HLD-WATCH-002 | 旧 Step 2~14 文件存在不代表当前完成 | 未来 Step 不得提前批量落盘标准 | 流程状态以本文件为准 |
| HLD-WATCH-003 | Step 5~9 必须按主要组成部分小循环推进 | 概要 SOP v0.10~v0.12 | 后续每个相关 Step 必须停审 |
| HLD-WATCH-004 | `ProjectMember`、`RoleDefinition` body、memory body、runtime body、credential 不得进入 identity 概要主语 | `00/01` 边界与 VETO | Step 3~10 强制复核 |
| HLD-WATCH-005 | 现有 `04-配置设计.md` 不得反向约束新版 `02` | 当前 flow 和 `01` watch | Step 11 只识别配置影响轮廓 |
| HLD-WATCH-006 | 新版 `02` 未完成前不得继续新版 `03` | 详细设计上游前提 | 已删除误建的 `03_ddd_calibration_flow.md` |

---

## 6. 当前执行状态

| 项 | 状态 |
|---|---|
| 正式 `02-概要设计.md` | 已按 Step 14 装配为 14 章正式概要设计,并已获用户审核通过 |
| 当前完成 Step | Step 14 整理正式概要设计文档 |
| 当前下一步 | 可按详细设计 SOP 建立新版 `03` 校准工作台 |
| 是否创建 / 替换未来 Step 文件 | `02` 已完成 Step 1~14;未进入 `03` |
| 旧 `02_hld_step_02~14` 如何处理 | 已在对应 Step 到达时逐个替换为新版中间产物 |
