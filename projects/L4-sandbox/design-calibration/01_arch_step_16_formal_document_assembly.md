# Step 16. 整理正式文档

> 对应 SOP: `standards/document/架构设计讨论流程_SOP.md` Step 16
> 回填章节: `projects/L4-sandbox/01-架构设计.md` 全文
> 生成日期: 2026-07-08
> 状态: completed_wait_user_review
> 所属流程: `01_architecture_calibration_flow.md`
> 本 Step 口径: 只装配 Step 1~15 已确认结论,不新增架构判断。

---

## 1. Step 开工确认

| 检查项 | 结论 |
|---|---|
| 用户是否已确认进入 Step 16 | 是。用户已在 Step 15 审查点后回复“同意”。 |
| 项目级台账是否允许进入 Step 16 | 是。`project_execution_ledger.md` 记录 Step 15 已 pass_wait_review,用户确认后可进入 Step 16。 |
| 文档级 flow 是否允许进入 Step 16 | 是。`01_architecture_calibration_flow.md` 记录 Step 16 等待 Step 15 审查确认。 |
| 是否已读取架构 SOP Step 16 | 是。Step 16 只允许整理正式文档,不得新增未经讨论结论。 |
| 是否已读取架构书写规范正式结构 | 是。正式文档必须采用 18 章结构并逐章标注校准来源。 |
| 是否发现阻塞 Step 16 的上游 blocker | 否。仍存在后续 `04` / `07` 缺失和产品 / 协议待确认,但不阻塞正式 `01` 装配。 |

---

## 2. 本步目标

把 `01_arch_step_01_requirement_baseline.md` 到 `01_arch_step_15_adr_traceability.md` 已确认的架构结论,按 `standards/document/架构设计书写规范.md` 的 18 章正式结构装配为新版 `projects/L4-sandbox/01-架构设计.md`。

本步只做重组、摘录、压缩、术语统一、交叉引用统一和章节回填。不新增 API、schema、状态机、event payload、数据库、配置 key、测试指标、实施 boundary、真实 ADR 编号、evidence alias、run_id 或验收签署。

---

## 3. 本步输入

| 输入 | 状态 | 用途 |
|---|---|---|
| `project_execution_ledger.md` | 已读取 | 确认项目恢复点、文档切换门禁和后续停止审查规则。 |
| `01_architecture_calibration_flow.md` | 已读取 | 确认 Step 1~15 状态、Step 16 输出和旧材料处理口径。 |
| `01_arch_step_01_requirement_baseline.md` | 已完成 | 回填 §1、§3 和 §16。 |
| `01_arch_step_02_goals_constraints.md` | 已完成 | 回填 §2、§3。 |
| `01_arch_step_03_responsibility_boundary.md` | 已完成 | 回填 §4。 |
| `01_arch_step_04_system_context.md` | 已完成 | 回填 §5。 |
| `01_arch_step_05_bounded_context_subdomains.md` | 已完成 | 回填 §6。 |
| `01_arch_step_06_container_deployment.md` | 已完成 | 回填 §7。 |
| `01_arch_step_07_dependency_direction.md` | 已完成 | 回填 §8。 |
| `01_arch_step_08_data_ownership_consistency.md` | 已完成 | 回填 §9。 |
| `01_arch_step_09_interactions_communication.md` | 已完成 | 回填 §10。 |
| `01_arch_step_10_technology_choices.md` | 已完成 | 回填 §11。 |
| `01_arch_step_11_alternatives_tradeoffs.md` | 已完成 | 回填 §12。 |
| `01_arch_step_12_cross_cutting_concerns.md` | 已完成 | 回填 §13。 |
| `01_arch_step_13_evolution_path.md` | 已完成 | 回填 §14。 |
| `01_arch_step_14_risks_open_questions.md` | 已完成 | 回填 §15。 |
| `01_arch_step_15_adr_traceability.md` | 已完成 | 回填 §16、§17。 |
| 正式 `00-需求文档.md` | 已完成且已确认 | 作为正式架构设计直接需求基线。 |
| 旧 `README.md` / 旧 `01-架构设计.md` | historical_material | 仅用于污染诊断,不得直接继承旧结论。 |
| `L1-artifact` / `L1-governance` Step 16 示例 | 已读取 | 参考装配粒度和 Step 16 中间产物结构。 |

---

## 4. Step 内计划

| 顺序 | 动作 | 状态 |
|---:|---|---|
| 1 | 重读项目级台账、架构 flow、Step 15、正式 `00`、架构 SOP Step 16 和书写规范 18 章结构。 | done |
| 2 | 复核 Step 1~15 的结构化中间产物,确认可回填结论和待确认项。 | done |
| 3 | 创建本 Step 16 中间产物,记录正式装配依据、旧文档诊断、章节回填和总审计。 | done |
| 4 | 按 18 章结构整体重建正式 `01-架构设计.md`。 | done |
| 5 | 将本 Step 文件、架构 flow 和项目台账更新到 `01` completed_wait_user_review。 | done |
| 6 | 验证没有创建 `02` calibration,没有伪造 ADR / evidence / run_id / commit / 测试结果。 | done |

---

## 5. SOP 问题回答

| SOP 问题 | 本步回答 |
|---|---|
| 哪些已确认结论应分别回填到哪些正式章节? | 见 §9.2 章节回填表。正式文档使用 18 章结构,每章只承接对应 Step 已完成结论。 |
| 哪些结论需要拆分吸收到多个章节,而不是机械复制? | Step 1 同时支撑来源声明、约束和追溯;Step 2 同时支撑背景、目标、约束和非目标;Step 8 的数据分层会在 §9 / §10 / §13 交叉使用;Step 15 同时支撑 §16 与 §17。 |
| 哪些术语、编号或交叉引用需要统一? | 统一使用 execution isolation truth、execution environment identity、coherent boundary、policy execution decision、capture fact、handoff fact、failure classification、cleanup guard、redline containment、read-only derived material、`L0-core` 唯一编译期依赖等术语。 |
| 哪些内容仍应继续保留为风险或待确认? | 后端产品组合、policy source 矩阵、allowlist 粒度、handoff ack、材料保留、failure taxonomy、协议 / event / schema、DB / object store / OTel / secrets / GRC、seccomp / AppArmor / cap-drop、SLO 和 implementation boundary。 |
| 参考项如何收口? | §18 只列正式参考来源和用途,不重复 §1 来源声明、§16 追溯矩阵或 §17 ADR 索引。 |
| Step 5 / 7 / 8 / 9 / 12 / 15 是否已停审? | 是。上下文、依赖、数据、交互、横切和 ADR / 追溯均已有停审记录和跨边界审计。 |
| 是否存在职责、依赖、数据、通信、横切或追溯断裂? | 未发现 unresolved 冲突。后续未闭合项均保留在 §15 风险与待确认事项中。 |

---

## 6. 当前文档问题诊断

| 位置 | 当前表现 | 问题 | 本步处理 |
|---|---|---|---|
| 旧 `01-架构设计.md` 元信息 | 旧 Draft,旧日期,旧项目定位写成“统一 SandboxService + Docker / gVisor / future Firecracker backend” | 与当前 Step 1~15 机制级架构结论冲突。 | 整体替换旧正文,不继承旧元信息。 |
| 旧业务背景 / 成功指标 | 直接写 Docker `<1s`、gVisor `<2s`、kill `<500ms`、allowlist `<5ms` 等旧数字 | 缺正式负载模型和当前验收证据。 | 放入待确认 / 后续测试验收口径,不写成当前硬指标。 |
| 旧系统边界 | 混入 capability-hub allowlist、observability audit sink、SRE、SDK、具体后端 | 把外部 truth、产品设施和运行依赖混入 sandbox 架构事实。 | 按 Step 4 / 7 重建为 context / policy / backend / material / bus 边界。 |
| 旧上下文 / 子域 | 以 Sandbox API / Backends / Limits / Policy Gate / Audit 等旧组件命名 | 偏实现和产品导向,不足以表达 capture / cleanup / redline truth。 | 按 Step 5 的核心子域、支撑子域、本地索引 / 投影 / 引用重建。 |
| 旧技术选型 | Docker/gVisor、RPC/SDK、allowlist lookup、audit emitter、fallback、seccomp/AppArmor 等过早硬化 | 违反 Step 10 产品级选型后置。 | 只保留机制级技术选择,产品和 profile 进入待确认 / 后续设计。 |
| 旧 ADR / 风险 | 未按当前需求追溯重建 | 无法证明架构决定来源。 | 按 Step 15 的“未建立”ADR 候选索引和追溯矩阵装配。 |

---

## 7. 改动前后对比

| 项 | 改动前 | 改动后 |
|---|---|---|
| 正式来源 | 旧 Draft + 旧 README 口径 | Step 1~15 calibration + 正式 `00` |
| 章节结构 | 旧结构,不符合当前 18 章主链 | 按架构书写规范 18 章重建 |
| 校准来源 | 无逐章来源块 | 每章开头标注具体 Step 文件和延伸阅读 |
| 架构核心 | SandboxService / backend adapters / allowlist / audit event | 独立 execution isolation truth + 正式入口 + coherent boundary + policy fail-closed + capture / cleanup / redline |
| 产品口径 | Docker/gVisor/Firecracker/local_process 等进入主线 | 抽象 isolation backend contract,产品后置 |
| 非 happy path | 主要作为异常 / 运维主题 | failure / control / cleanup / reaper / redline 作为一等架构事实 |
| 追溯 | 旧文档无当前追溯矩阵 | §16 追溯矩阵 + §17 ADR 候选索引 |

---

## 8. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 在旧 `01` 上局部替换 | 改动小 | 旧后端、旧指标、旧接口和旧组件名容易残留 | 不采用 |
| 删除旧正文后按 18 章重建 | 来源干净,逐章可追溯 | 装配篇幅较大 | 采用 |
| 机械复制 Step 1~15 全量表格 | 信息最完整 | 正式文档过长且不利于审查 | 不采用;正式正文压缩,详表保留在 calibration |
| 在 Step 16 顺手补 API / schema / config / SLO | 看起来更可落码 | 违反 Step 16 不新增结论和文档顺序 | 不采用 |

---

## 9. 结构化中间产物

### 9.1 正式文档重组结论

正式 `01-架构设计.md` 应整体替换旧 Draft。新版文档以正式 `00-需求文档.md` 为直接基线,用 18 章结果结构承接 Step 1~15 已确认结论。正文保留足够可落码粒度的架构单元、依赖规则、数据归属、交互类别、机制级选型、风险、追溯和 ADR 候选,但不写下游概要 / 详细 / 配置 / 测试 / 实施阶段才应闭口的对象、协议、字段、产品、阈值或 boundary skeleton。

### 9.2 章节回填表

| 正式章节 | 来源 Step | 回填内容 | 整理口径 |
|---|---|---|---|
| §1 与上游文档的关系声明 | Step 1 | 正式 `00` 承接、上游边界、旧材料排除 | 不重新定义需求 |
| §2 业务背景与驱动力 | Step 2 | 背景、驱动力、架构目标 | 不继承旧性能数字 |
| §3 约束条件 | Step 1 / Step 2 | 需求基线、硬约束、不可变约束、可接受取舍、非目标 | 不写 schema / API / 配置 |
| §4 职责边界 | Step 3 | 做 / 不做 / 易混淆职责和边界红线 | 防止混入 tools / runtime / member / artifact / observability / policy truth |
| §5 系统边界与上下文 | Step 4 | 上下文图、输入 / 输出面、依赖失效降级 | 不写接口名、事件名、后端产品 |
| §6 限界上下文与子域划分 | Step 5 | 核心子域、支撑子域、本地索引 / 投影 / 引用、统一语言 | 不写代码模块 |
| §7 容器 / 部署架构 | Step 6 | 运行承载图、运行单元、部署关系、运行红线 | 不锁产品和部署参数 |
| §8 依赖方向与层间约束 | Step 7 | 依赖角色、层间约束、依赖裁剪、禁止依赖 | `L0-core` 唯一编译期依赖 |
| §9 数据所有权与一致性策略 | Step 8 | truth / snapshot / ref / forbidden body、一致性策略 | 不写 DDL / repository / cache |
| §10 关键交互与通信方式 | Step 9 | 关键交互、同步 / 异步 / 后台通信方式、失败语义 | 不写 event payload / topic / DTO |
| §11 关键技术选型 | Step 10 | 机制级技术选择和当前不采用口径 | 不硬化 Docker/gVisor/Firecracker/DB/OTel/SLO |
| §12 备选方案与取舍 | Step 11 | 主线方案、路径比较、取舍说明 | 不做产品横评 |
| §13 横切关注点 | Step 12 | 安全、审计、可观测、韧性、性能、配置约束 | 不写监控字段 / profile / config key |
| §14 演进路线 | Step 13 | 当前主线、可接受债务、不可接受债务、触发条件 | 不写实施排期 |
| §15 风险与待确认事项 | Step 14 | 风险表、待确认事项、处理口径 | 不把待确认项润色为定论 |
| §16 需求追溯矩阵 | Step 15 | 需求到架构承接、漏项检查 | 不新增孤儿判断 |
| §17 ADR 索引 | Step 15 | ADR 决策候选索引和停审记录 | ADR 编号均为“未建立” |
| §18 参考 | Step 1~15 / 规范 | 正式参考清单 | 不重复追溯和 ADR |

### 9.3 术语统一表

| 正式术语 | 统一含义 | 禁止混写 |
|---|---|---|
| execution isolation truth | sandbox 独立拥有的受控执行隔离事实 | ToolInvocationResult、ExecutionInstance、SandboxBinding、Artifact、observability store |
| execution environment identity | 一次 sandbox 执行环境身份和责任链绑定 | GlobalMember / actor lifecycle truth |
| coherent boundary | resource / filesystem / network / process / workspace boundary 作为一组成立 | 单一后端能力、弱测试路径或 fallback |
| policy execution decision | sandbox 对给定 launch / isolation policy 的执行裁定事实 | policy DSL、approval、allowlist、capability truth |
| capture fact / handoff fact | sandbox 捕获材料和显式交接事实 | formal artifact truth、evidence truth、observability store |
| failure classification / control fact | timeout、deny、kill、capture failure、backend failure、resource exceeded 等稳定分类和控制事实 | runtime business failure、runner retry state |
| cleanup guard / reaper | cleanup 前材料 / 调查 / 安全交接保护和孤儿环境回收 | SRE 私有脚本或调用方兜底 |
| redline containment | escape-like / 越权访问 / 安全红线的保守收束和调查交接 | advisory-only event 或 UI 提示 |
| read-only derived material | inspect / preview / trend / backend comparison 等只读派生材料 | 核心 truth 写源或验收签署来源 |

### 9.4 交叉引用结论

| 引用位置 | 引用目标 | 作用 |
|---|---|---|
| §1 | 正式 `00`;Step 1 | 明确架构承接来源和旧材料排除 |
| §3 | Step 1 / Step 2 / §15 | 把硬约束、取舍和待确认项分层 |
| §6 | §4 / §5 | 从职责和系统上下文推导内部语义结构 |
| §8 | §4 / §5 / §6 / §9 | 依赖方向保护职责、上下文和数据所有权 |
| §9 | §4 / §6 / §10 / §13 | 数据归属支撑交互、一致性和横切安全 |
| §10 | §7 / §9 / §11 | 通信方式承接运行承载、数据一致性和技术机制 |
| §12 | §2~§11 | 方案取舍只比较已形成的路径级方案 |
| §15 | §3 / §8 / §9 / §10 / §13 / §14 | 风险和待确认事项保留为后续门禁 |
| §16 | Step 15 | 说明需求、架构承接和漏项检查 |
| §17 | Step 15 | 索引长期架构决策候选 |
| §18 | Step 16 | 收口正式参考材料 |

### 9.5 跨架构单元总审计表

| 审计来源 | 审计对象 | 结论 |
|---|---|---|
| Step 5 context pass | 核心子域、支撑子域、本地索引 / 投影 / 引用层 | pass |
| Step 7 dependency pass | 核心语义、编排 / 承接、外部接缝、本地影子、技术承载 | pass |
| Step 8 data pass | truth / snapshot / ref / forbidden body 与一致性策略 | pass |
| Step 9 interaction pass | 同步、异步、后台路径和失败降级口径 | pass |
| Step 12 cross-cutting pass | 安全、审计、可观测、韧性、性能、配置约束 | pass |
| Step 15 ADR / trace pass | 需求追溯、漏项检查、ADR 候选和停审记录 | pass |
| 旧材料污染审计 | Docker/gVisor/Firecracker、SandboxService、旧事件、旧 P95、fallback、profile | contained_as_historical_material |
| 下游文档缺口 | `04-配置设计.md`;`07-实施计划.md` | open_downstream_not_blocking_01 |

### 9.6 正式文档整理结论

正式 `projects/L4-sandbox/01-架构设计.md` 可以按 Step 1~15 结论重建。重建后必须停在 `01` 审查点,不得自动创建 `02_hld_calibration_flow.md` 或 `02` Step 文件。`02-概要设计.md` 只有在用户审查并明确确认后,才能读取概要设计 SOP 和书写规范后启动。

---

## 10. 回填草稿

本 Step 的正式回填对象是 `projects/L4-sandbox/01-架构设计.md` 全文。正式文档将按 §9.2 的 18 章回填表装配,每章开头写入具体校准来源和延伸阅读。回填时不得复制所有 Step 过程性问题回答、旧材料诊断和停审表;这些内容继续保留在 `design-calibration` 中。

---

## 11. 待确认事项处理建议

| 待确认事项 | 当前处理 |
|---|---|
| 后端组合、profile、SLO、产品选型 | 保留在正式 §15,后续 `04/05/06/07` 或 ADR 再闭口。 |
| API / RPC / SDK / port / DTO / event / state / storage | 保留在正式 §15,后续 `02/03` 闭口。 |
| handoff ack、材料保留、大材料治理、cleanup guard 细节 | 保留在正式 §15,后续 `03/04/05/06` 闭口。 |
| 正式 ADR 文件 | §17 只写候选索引,不伪造 ADR 编号、评审状态或文件。 |
| `04` / `07` 缺失 | 作为 downstream doc gap 保留,不阻塞 `01` 完成;进入对应文档时按 SOP 创建。 |

---

## 12. 自检与进入下一步条件

| 检查项 | 结果 |
|---|---|
| 是否只装配 Step 1~15 已确认结论 | pass |
| 是否按 18 章正式结构组织 | pass |
| 是否每章都有具体校准来源块 | pass |
| 是否保留待确认项而未润色为定论 | pass |
| 是否未新增 API / schema / 状态机 / 配置 / 测试 / 实施结论 | pass |
| 是否未伪造 ADR、evidence、run_id、验收签署或 commit | pass |
| 是否未进入 `02` | pass |

当前进入下一步条件: 等待用户审查正式 `01-架构设计.md`;用户确认后才允许启动 `02-概要设计.md` full-restart。

## 13. Post-closeout disposition assembly (`DC-03`)

后续用户确认和 `02~07` 正式设计已消费本 Step 的历史 review gate。允许在正式 `01` 追加 current disposition，明确
API/port/schema/state/storage 等由 `02/03` 解决，配置/测试/验收/实施由 `04~07` 解决，真实 provider、资格、CI、review
仍属 Activation；不得重开架构边界或把后续实现细节反向写成架构职责。

```text
assembly_authorization = DC-04_formal_01_current_disposition_only
historical_review_gate = consumed
historical_document_gaps = resolved_by_downstream_design
architecture_semantics_changed = no
runtime_fact_created = no
next_allowed_action = update_formal_01_then_continue_authorized_closeout
```

## 14. PHYSICAL EOF DC-06 final audit disposition

Step 17 已反向审计正式 `01` 的 current architecture boundary、下游解析和 Activation 分类。DC-06 没有发现需要修改
架构职责、依赖方向或正式正文的新差异；DC-04 的 current disposition 回填保持有效。

```text
dc_06_assembly_disposition = audit_only_no_formal_delta
formal_01_delta_in_dc_06 = none
architecture_semantics_changed = no
runtime_fact_created = no
design_audit_status = completed_design_static_only
```
