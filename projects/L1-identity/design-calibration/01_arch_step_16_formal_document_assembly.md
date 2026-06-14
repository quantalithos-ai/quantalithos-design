# Step 16. 整理正式文档

> 对应 SOP: `standards/document/架构设计讨论流程_SOP.md` Step 16
> 回填章节: `01-架构设计.md` 全文
> 生成日期: 2026-06-11
> 状态: 已完成

---

## 1. 本步目标

把 Step 1 ~ Step 15 已完成的 `L1-identity` 架构结论按 `架构设计书写规范.md` 的 18 章正式结构整理为 `01-架构设计.md`。

本步只做重组、摘录、压缩、术语统一、编号统一和交叉引用统一,不新增前序 Step 未收敛的新架构结论。

---

## 2. 本步输入

| 输入 | 状态 | 用途 |
|---|---|---|
| `01_arch_step_01_requirement_baseline.md` | 已完成 | 提供需求基线、硬约束和追溯前置 |
| `01_arch_step_02_goals_constraints.md` | 已完成 | 提供业务驱动力、架构目标、约束、取舍和非目标 |
| `01_arch_step_03_responsibility_boundary.md` | 已完成 | 提供职责边界、做 / 不做和边界红线 |
| `01_arch_step_04_system_context.md` | 已完成 | 提供系统上下文图、上下游关系和降级口径 |
| `01_arch_step_05_bounded_context_subdomains.md` | 已完成 | 提供核心子域、支撑上下文、本地索引 / 投影 / 引用层和统一语言 |
| `01_arch_step_06_container_deployment.md` | 已完成 | 提供运行承载、容器 / 部署图和运行关系 |
| `01_arch_step_07_dependency_direction.md` | 已完成 | 提供依赖方向、跨仓裁剪、依赖类型和禁止依赖 |
| `01_arch_step_08_data_ownership_consistency.md` | 已完成 | 提供数据归属、一致性策略和数据边界 |
| `01_arch_step_09_interactions_communication.md` | 已完成 | 提供关键交互、通信方式和失败口径 |
| `01_arch_step_10_technology_choices.md` | 已完成 | 提供关键技术机制和当前不采用口径 |
| `01_arch_step_11_alternatives_tradeoffs.md` | 已完成 | 提供当前主线、替代路径和取舍 |
| `01_arch_step_12_cross_cutting_concerns.md` | 已完成 | 提供安全、审计、可观测、韧性、性能和配置横切约束 |
| `01_arch_step_13_evolution_path.md` | 已完成 | 提供演进路线、可接受债务和触发条件 |
| `01_arch_step_14_risks_open_questions.md` | 已完成 | 提供风险、待确认事项和阻塞判断 |
| `01_arch_step_15_adr_traceability.md` | 已完成 | 提供需求追溯矩阵、漏项检查和 ADR 候选索引 |
| `架构设计书写规范.md` | 已收稳 | 提供正式 18 章结构和校准来源块要求 |
| 旧 `01-架构设计.md` | 已被新版正式文档替换 | 仅作为历史诊断;正式文档已删除旧内容后重建 |

---

## 3. SOP 问题回答

### 3.1 哪些已确认结论应分别回填到哪些正式章节？

Step 1 支撑来源承接、约束条件和需求追溯矩阵。Step 2 回填业务背景与驱动力、约束条件。Step 3 ~ Step 15 分别回填职责边界、系统上下文、限界上下文、容器 / 部署、依赖方向、数据所有权、关键交互、关键技术机制、备选方案、横切关注点、演进路线、风险与待确认、需求追溯和 ADR 索引。参考章节只收纳正式参考材料,不承接新的架构判断。

### 3.2 哪些结论需要拆分吸收到多个章节,而不是机械复制？

需求基线拆分到 §1、§3 和 §16。平台级身份 truth center 同时支撑职责边界、限界上下文、数据所有权、关键技术机制、备选方案、ADR 和需求追溯。GlobalMember / ProjectMember 分层同时支撑职责边界、系统上下文、依赖方向和数据所有权。truth / snapshot / reference / forbidden body separation 同时支撑数据所有权、依赖方向、关键技术机制、风险和追溯。`L0-core` 唯一编译期依赖同时支撑依赖方向、技术机制、横切配置和实施约束。

### 3.3 哪些术语、编号或交叉引用需要统一？

正式文档统一使用 `L1-identity`、`平台级 AI 员工身份真相仓`、`平台级成员身份真相核心`、`GlobalMember / ProjectMember 分层`、`身份侧角色能力摘要`、`生涯记录`、`memory refs`、`身份事实消费与追溯`、`本地索引 / 投影 / 引用层`、`truth / snapshot / reference / forbidden body separation`、`L0-core 唯一编译期依赖候选` 等术语。旧技术栈、旧 API、旧表名、旧事件名、旧性能数字和旧对象名只作为历史诊断,不得回流为正式主线。

### 3.4 哪些内容仍应继续保留为风险或待确认,不能润色成定论？

Role / capability 来源协议、memory / archive carrier 与 handoff、governance 高风险 lifecycle basis、visibility / privacy 字段级裁剪、P0 performance / availability baseline、既有 `04-配置设计.md` 的复核结果、full event sourcing 是否作为后续主体范式,都必须继续保留为风险或待确认,不能在正式 `01` 中写成已关闭结论。

### 3.5 参考项应如何收口,不与 ADR 或追溯重复？

参考章节只保留正式参考材料和用途说明,包括当前需求文档、需求校准中间产物、架构 SOP、架构书写规范、全局依赖裁剪规则和上游产品 / 架构材料。ADR 候选保留在 §17,需求到架构的承接关系保留在 §16,参考章节不重复追溯矩阵或 ADR 索引。

---

## 4. 正式文档重组结论

正式 `01-架构设计.md` 采用 `架构设计书写规范.md` 的 18 章主链:

```text
1. 与上游文档的关系声明
2. 业务背景与驱动力
3. 约束条件
4. 职责边界
5. 系统边界与上下文
6. 限界上下文与子域划分
7. 容器 / 部署架构
8. 依赖方向与层间约束
9. 数据所有权与一致性策略
10. 关键交互与通信方式
11. 关键技术选型
12. 备选方案与取舍
13. 横切关注点
14. 演进路线
15. 风险与待确认事项
16. 需求追溯矩阵
17. ADR 索引
18. 参考
```

本次正式文档重建结论:

- 旧 `01-架构设计.md` 删除旧内容后重建,不在旧结构上局部修补。
- 每个正式章节开头必须放置 `校准来源` 和 `延伸阅读` 块。
- 正式章节正文优先摘录对应 Step 的结构化结论,完整审计表和停审记录保留在具体中间产物。
- 风险、待确认、ADR 候选和参考材料各归其位,不混章。
- 正式文档不新增 Step 1 ~ Step 15 未确认的新架构判断。

---

## 5. 章节回填结论

| 正式章节 | 主要来源 | 回填内容 | 处理口径 |
|---|---|---|---|
| §1 与上游文档的关系声明 | Step 1 | 上游来源、承接主题、本文细化范围 | 只写来源和承接,不重写需求基线全文 |
| §2 业务背景与驱动力 | Step 2 | 结构性驱动力和架构目标 | 不继承旧性能数字 |
| §3 约束条件 | Step 1 / Step 2 | 架构硬约束、不可变约束、取舍、非目标 | 不写协议、对象字段或实现细节 |
| §4 职责边界 | Step 3 | 做 / 不做、易混淆职责、边界红线 | 不进入系统上下文或子域划分 |
| §5 系统边界与上下文 | Step 4 | 系统上下文图、上下游表、降级口径 | 只表达正式上下文对象 |
| §6 限界上下文与子域划分 | Step 5 | 核心子域、支撑上下文、本地影子层、统一语言 | 不写代码目录或实现模块 |
| §7 容器 / 部署架构 | Step 6 | 运行承载图、运行单元、部署关系 | 不锁定技术产品 |
| §8 依赖方向与层间约束 | Step 7 | 层间约束、依赖倒置、跨仓裁剪、禁止依赖 | 明确 `L0-core` 是唯一编译期依赖候选 |
| §9 数据所有权与一致性策略 | Step 8 | 数据归属、一致性策略、数据边界 | 不写字段、DDL 或事务实现 |
| §10 关键交互与通信方式 | Step 9 | 交互场景、通信方式判断、失败口径 | 不写 API / event / topic / DTO |
| §11 关键技术选型 | Step 10 | 关键技术机制、不采用口径、技术边界 | 机制级选型,不是产品清单 |
| §12 备选方案与取舍 | Step 11 | 当前主线、方案比较、取舍说明 | 不重新打开已排除职责 |
| §13 横切关注点 | Step 12 | 横切约束、主线映射、不进入项 | 不写监控配置或安全手册 |
| §14 演进路线 | Step 13 | 演进阶段、债务、触发条件、不演进项 | 不写项目排期 |
| §15 风险与待确认事项 | Step 14 | 风险表、待确认事项表、处理口径 | 不把待确认润色为定论 |
| §16 需求追溯矩阵 | Step 15 | 需求追溯矩阵、漏项检查、范围说明 | 不新增孤儿架构判断 |
| §17 ADR 索引 | Step 15 | ADR 决策候选索引、范围说明 | 不伪造正式 ADR 文件 |
| §18 参考 | Step 1 / Step 15 / 规范 | 正式参考材料清单 | 不重复来源声明、追溯矩阵或 ADR 索引 |

---

## 6. 术语统一结论

| 正式术语 | 统一含义 | 禁止替代表达 |
|---|---|---|
| `L1-identity` | 平台级 AI 员工身份真相仓 | auth、runtime、member-service、workspace profile |
| 平台级成员身份真相核心 | 本仓唯一核心子域 | 账号、session、ProjectMember、display name |
| GlobalMember / ProjectMember 分层 | 平台级成员身份与项目内承担事实分离 | 让 identity 拥有 ProjectMember truth |
| 身份侧角色能力摘要 | identity 保存的来源引用、摘要、证据和状态 | RoleDefinition / CapabilityDefinition body |
| 生涯记录 | 成员跨项目长期经历的 identity 侧追加记录 | Project / WorkItem truth |
| memory refs | 成员与外部 memory / archive 的 ref-only 关系 | memory body、embedding、archive package |
| 身份事实消费与追溯 | 下游读取、订阅和审计身份变化的边界 | 下游反写 identity truth |
| 本地索引 / 投影 / 引用层 | 为稳定消费、降级显示、判断和追溯保留的影子结构 | 外部来源仓正文副本 |
| truth / snapshot / reference / forbidden body separation | 数据归属和一致性主机制 | 外部正文统一复制进 identity |

---

## 7. 交叉引用结论

| 引用类型 | 正式写法 | 约束 |
|---|---|---|
| 校准来源 | `design-calibration/01_arch_step_xx_*.md` | 每章必须列出具体文件 |
| 延伸阅读 | 指向中间产物的“结构化中间产物”“回填草稿”“待确认事项” | 不能只写“详见 design-calibration” |
| 上游需求 | `00-需求文档.md` 与需求中间产物 | 不重复抄写需求全文 |
| 上游稳定材料 | `product/*`、`architecture/*`、`standards/document/*` | 只说明架构承接关系 |
| ADR | “ADR 候选” | 不伪造已落地 ADR 文件编号 |

---

## 8. 正式文档重建执行结论

- 已删除旧 `projects/L1-identity/01-架构设计.md` 的占位内容并重建正式正文。
- 已按 `架构设计书写规范.md` 的 18 章主链装配新版 `projects/L1-identity/01-架构设计.md`。
- 已按章节写入正式文档,每章保留具体校准来源块和延伸阅读。
- 已确认正式文档不把旧 `02/04`、旧 API、旧 table、旧 event、旧性能数字或实现目录写回架构结论。
- 已确认 Step 14 / Step 15 的待确认事项仍保留为风险和后续闭口入口,未在正式正文中润色成定论。

## 8.1 跨架构单元总审计表

| 审计项 | 结论 | 说明 |
|---|---|---|
| 职责重叠 | 通过 | `L1-identity` 只拥有平台级成员身份 truth;ProjectMember、RoleDefinition、memory body、runtime body、governance decision truth 均保持外部归属。 |
| 依赖方向冲突 | 通过 | 正式文档保留 `L0-core` 唯一编译期依赖候选和外部来源 dependency inversion,未引入业务仓源码依赖。 |
| 数据所有权冲突 | 通过 | truth / snapshot / reference / forbidden body separation 在 §9 保持一致,未让 projection、event、report 或 query 反写 truth。 |
| 通信方式冲突 | 通过 | 同步 accepted 判断、异步 accepted fact propagation 和后台 report-only 维护边界清楚,未使用同步 fan-out 或跨仓事务作为 accepted 条件。 |
| 横切约束遗漏 | 通过 | 安全 / 隐私、visibility、审计、可观测、韧性、性能、配置和幂等均在 §13 承接,且不下沉到产品配置。 |
| ADR / 需求追溯断裂 | 通过 | §16 / §17 只装配 Step 15 已完成的追溯和 ADR 索引,未新增无来源架构决定。 |
| 待确认事项误闭口 | 通过 | `OQ-ID-001`~`OQ-ID-006` 仍作为后续 `03/04/05/06/07` 闭口入口。 |

---

## 9. 待确认事项

本步不新增架构待确认事项。正式文档中的待确认事项仅承接 Step 14 和 Step 15 已收稳内容。

---

## 10. 进入下一步条件

- 已形成正式文档重组结论。
- 已形成章节回填结论。
- 已形成术语统一结论。
- 已形成交叉引用结论。
- 已完成跨架构单元总审计。
- 已删除旧正式文档占位内容并重建正式 `01-架构设计.md`。
- Step 16 已完成;新版 `01-架构设计.md` 可作为后续 `02~07` 的架构基线。
