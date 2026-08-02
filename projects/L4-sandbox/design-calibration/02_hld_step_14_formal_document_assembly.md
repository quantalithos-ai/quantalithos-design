# Step 14. 整理正式概要设计文档

> 对应 SOP: `standards/document/概要设计讨论流程_SOP.md` Step 14
> 回填章节: `projects/L4-sandbox/02-概要设计.md` 全文
> 生成日期: 2026-07-08
> 状态: completed_current_closeout
> 最近定向装配: 2026-08-01 (`v7.9-closeout`)
> 所属流程: `02_hld_calibration_flow.md`
> 本 Step 口径: 只装配 Step 1~13 已确认结论,不新增概要判断。

> Current-source note: 下文原始 Step 14 装配记录保留为 historical assembly record；本文件物理 EOF 的
> `v7.9-closeout` 定向装配记录是唯一 current 结论。

---

## 1. Step 开工确认

| 检查项 | 结论 |
|---|---|
| 用户是否已确认进入 Step 14 | 是。用户已在 Step 13 审查点后明确回复“同意”。 |
| 项目级台账是否允许进入 Step 14 | 是。`project_execution_ledger.md` 已记录 Step 13 `pass_wait_review`,用户确认后允许进入 Step 14。 |
| 文档级 flow 是否允许进入 Step 14 | 是。`02_hld_calibration_flow.md` 已记录 Step 13 `completed_wait_user_review`,Step 14 只等正式装配。 |
| 是否已读取概要 SOP Step 14 | 是。Step 14 只允许整理正式文档,不得新增未经讨论结论。 |
| 是否已读取概要书写规范正式结构 | 是。正式文档必须采用 14 章结构并逐章标注校准来源。 |
| 是否发现阻塞 Step 14 的上游 blocker | 否。仍存在后续 `04` / `07` 缺失和产品 / 协议待确认,但不阻塞正式 `02` 装配。 |

---

## 2. 本步目标

把 `02_hld_step_01_upstream_boundary.md` 到 `02_hld_step_13_risks_open_questions.md` 已确认的概要结论,按 `standards/document/概要设计书写规范.md` 的 14 章正式结构装配为新版 `projects/L4-sandbox/02-概要设计.md`。

本步只做重组、摘录、压缩、术语统一、交叉引用统一和章节回填。不新增对象、接口、状态、产品、配置 key、测试结论、实施 boundary、真实 evidence alias、run_id、commit 或验收签署。

---

## 3. 本步输入

| 输入 | 状态 | 用途 |
|---|---|---|
| `project_execution_ledger.md` | 已读取 | 确认项目恢复点、文档切换门禁和后续停止审查规则。 |
| `02_hld_calibration_flow.md` | 已读取 | 确认 Step 1~13 状态、Step 14 输出和旧材料处理口径。 |
| `02_hld_step_01_upstream_boundary.md` | 已完成 | 回填 §1。 |
| `02_hld_step_02_goals_scope.md` | 已完成 | 回填 §2。 |
| `02_hld_step_03_constraints.md` | 已完成 | 回填 §3。 |
| `02_hld_step_04_code_subject_framework.md` | 已完成 | 回填 §4。 |
| `02_hld_step_05_components_boundary.md` | 已完成 | 回填 §5。 |
| `02_hld_step_06_key_objects.md` 及对象附录 | 已完成 | 回填 §6。 |
| `02_hld_step_07_api_interface_skeleton.md` | 已完成 | 回填 §7。 |
| `02_hld_step_08_processing_flows.md` | 已完成 | 回填 §8。 |
| `02_hld_step_09_state_machine.md` | 已完成 | 回填 §9。 |
| `02_hld_step_10_exceptions_boundaries.md` | 已完成 | 回填 §10。 |
| `02_hld_step_11_configuration_impact.md` | 已完成 | 回填 §11。 |
| `02_hld_step_12_detailed_design_handoff.md` | 已完成 | 回填 §12。 |
| `02_hld_step_13_risks_open_questions.md` | 已完成 | 回填 §13。 |
| 正式 `00-需求文档.md` 与 `01-架构设计.md` | 已完成且已确认 | 作为正式概要设计直接上游基线。 |
| 旧 `README.md` / 旧 `02-概要设计.md` | historical_material | 仅用于污染诊断,不得直接继承旧结论。 |
| `L1-artifact` / `L1-governance` Step 14 示例 | 已读取 | 参考装配粒度、正式章节组织和 Step 14 中间产物结构。 |

---

## 4. Step 内计划

| 顺序 | 动作 | 状态 |
|---:|---|---|
| 1 | 重读项目级台账、概要 flow、Step 13、正式 `00/01`、概要 SOP Step 14 和书写规范 14 章结构。 | done |
| 2 | 复核 Step 1~13 的结构化中间产物,确认可回填结论和待确认项。 | done |
| 3 | 创建本 Step 14 中间产物,记录正式装配依据、旧文档诊断、章节回填和总审计。 | done |
| 4 | 按 14 章结构整体重建正式 `02-概要设计.md`。 | done |
| 5 | 将本 Step 文件、概要 flow 和项目台账更新到 `02` completed_wait_user_review。 | done |
| 6 | 验证没有启动 `03`,没有伪造 commit / evidence / run_id / 测试结果。 | done |

---

## 5. SOP 问题回答

| SOP 问题 | 本步回答 |
|---|---|
| 哪些已确认结论应分别回填到哪些正式章节? | 见 §9.2 章节回填表。正式文档使用 14 章结构,每章只承接对应 Step 已完成结论。 |
| 哪些结论需要拆分吸收到多个章节,而不是机械复制? | Step 1 同时支撑来源声明和旧材料降级;Step 4 同时支撑代码主体、实现分层和后续运行单元承接口径;Step 8~10 的 flow / state / exception 需要交叉引用但不互相替代。 |
| 哪些术语、编号或交叉引用需要统一? | 统一使用 execution isolation truth、execution environment identity、coherent boundary、policy execution decision、capture fact、handoff fact、failure classification、cleanup guard、redline containment、read-only derived support 等术语。 |
| 哪些内容仍应继续保留为风险或待确认? | backend 组合、capability matrix、policy source 矩阵、allowlist / profile 粒度、handoff ack、retention、failure taxonomy、产品选型、SLO 数字、`04/07` 缺口。 |
| 参考项如何收口? | §14 只列正式参考来源和用途,不重复 §1 来源声明或 §13 风险挂起表。 |
| Step 4~13 是否已停审? | 是。代码主体、组成部分、对象、接口、flow、状态、异常、配置和承接清单均已有停审记录和跨边界审计。 |
| 是否存在职责、接口、状态或风险断裂? | 未发现 unresolved 冲突。后续未闭口项均保留在 §13 风险与待确认事项中。 |

---

## 6. 当前文档问题诊断

| 位置 | 当前表现 | 问题 | 本步处理 |
|---|---|---|---|
| 旧 `02-概要设计.md` 元信息 | 旧 Draft,旧日期,旧“新人理解 / 命令执行器 / 五段主线”叙事 | 与当前 Step 1~13 结论冲突,且把解释型材料写成正式主线 | 整体替换旧正文,不继承旧元信息 |
| 旧主线 | 旧文档以 session / command / output / 运维控制为主 | 缺 execution environment identity、policy fail-closed、handoff ownership、cleanup guard、redline containment | 按 6 个主要组成部分和 14 章主链重建 |
| 旧对象词 | `SandboxExecution` / `SandboxSession` / `SandboxCommand` / `SandboxPolicy` / `SandboxOutput` | 容易混入 runtime、tools、policy source、artifact truth | 全部降级为 historical material,用新版对象主语替换 |
| 旧后端与旧数字 | Docker / gVisor / Firecracker、allowlist、旧 P95 / SLA | 把产品和阈值误写成当前概要事实 | 后置到待确认 / 后续文档,正文只保留抽象边界与角色 |
| 旧异常叙事 | “后端失败 / cleanup 脚本 / replay”单线解释 | 非 happy path 被调用方或运维补偿吞掉 | 按 failure / cleanup / redline 正式主语重组 |

---

## 7. 改动前后对比

| 项 | 改动前 | 改动后 |
|---|---|---|
| 正式来源 | 旧 Draft + 旧 README 口径 | Step 1~13 calibration + 正式 `00/01` |
| 章节结构 | 旧结构,不符合当前 14 章主链 | 按概要书写规范 14 章重建 |
| 校准来源 | 无逐章来源块 | 每章开头标注具体 Step 文件和延伸阅读 |
| 概要核心 | 会话 / 命令 / 输出 / 运维旧叙事 | execution isolation truth + code subject map + 六个组成部分 +并行状态机 |
| 产品口径 | Docker / gVisor / Firecracker / allowlist 等进入主线 | 抽象 backend / policy / handoff / cleanup 接缝,产品后置 |
| 非 happy path | 主要作为异常或运维主题 | failure / cleanup / redline 作为一等概要主语 |
| 承接能力 | 旧文档难以直接交给 `03` | §12 明确稳定输入、继续展开方向和回退规则 |

---

## 8. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 在旧 `02` 上局部修补 | 改动小 | 旧对象词、旧主线和旧后端容易残留 | 不采用 |
| 删除旧正文后按 14 章重建 | 来源干净,逐章可追溯 | 装配篇幅较大 | 采用 |
| 机械复制 Step 1~13 全量表格 | 信息最全 | 正式文档过重,不利于审查 | 不采用;正式正文压缩,详表留在 calibration |
| 在 Step 14 顺手补 DTO / schema / config / test / implementation | 看起来更完整 | 违反 Step 14 不新增结论和文档顺序 | 不采用 |

---

## 9. 结构化中间产物

### 9.1 正式概要设计文档重组结论

正式 `02-概要设计.md` 应整体替换旧 Draft。新版文档以后续正式 `00-需求文档.md` 与 `01-架构设计.md` 为直接基线,用 14 章结果结构承接 Step 1~13 已确认结论。正文保留足够可落码粒度的代码主体、组成部分、关键对象、接口骨架、处理流、状态机、异常边界、配置影响和详细设计承接,但不写 `03~07` 才应闭口的 exact object contract、schema、产品、阈值或实施 boundary。

### 9.2 章节回填表

| 正式章节 | 来源 Step | 回填内容 | 整理口径 |
|---|---|---|---|
| §1 与上游文档的关系声明 | Step 1 | 正式 `00/01` 承接、上游边界、旧材料降级 | 不重新定义需求或架构 |
| §2 本次设计目标与范围 | Step 2 | 设计目标、非范围和当前设计深度 | 不提前写详细设计契约 |
| §3 约束条件 | Step 3 | 结构性约束和不可越界红线 | 不写 schema / API / 配置项 |
| §4 代码主体框架总览 | Step 4 | 双轴组织、代码主体组、实现分层和运行单元承接口径 | 不写目录路径 |
| §5 主要组成部分、职责与边界 | Step 5 | 六个正式组成部分、非职责和交互关系 | 不展开字段 / 函数 |
| §6 关键对象轮廓 | Step 6 | 对象分类总表和关键锚点对象说明 | 详细对象卡片留在 calibration |
| §7 API / 接口骨架 | Step 7 | 六类接口、关键命令 / 查询 / consumer / job / port | 不写 DTO 或 payload |
| §8 关键处理流 / 重要函数数据流 | Step 8 | 通用处理流和六类 flow family | 不写 repository / UoW 调用链 |
| §9 状态定义与状态流转 | Step 9 | 六组并行状态机和关键传播 | 不复制全量矩阵 |
| §10 异常与边界场景轮廓 | Step 10 | 关键异常路径和边界场景 | 不写错误码、重试参数、补偿脚本 |
| §11 配置影响轮廓 | Step 11 | 配置影响分层和禁止配置化边界 | 不写 key / 默认值 / env var |
| §12 详细设计承接清单 | Step 12 | 稳定输入、继续展开方向和回退规则 | 不写开发任务 |
| §13 设计风险与待确认事项 | Step 13 | 风险表、待确认表和阻塞转换规则 | 不把挂起项润色成定论 |
| §14 参考 | Step 14 | 正式参考清单 | 不重复追溯和过程材料 |

### 9.3 术语统一表

| 正式术语 | 统一含义 | 禁止混写 |
|---|---|---|
| execution isolation truth | sandbox 独立拥有的受控执行隔离事实 | ToolInvocationResult、ExecutionInstance、SandboxBinding、Artifact truth、observability store |
| execution environment identity | 一次 sandbox 执行环境身份和责任链绑定 | GlobalMember / actor lifecycle truth |
| coherent boundary | resource / filesystem / network / process / workspace / mount 作为一组成立 | 单一后端能力、弱测试路径或 fallback |
| policy execution decision | sandbox 对给定 launch / isolation policy 的执行裁定事实 | policy definition、approval、allowlist、capability truth |
| capture fact / handoff fact | sandbox 捕获材料与显式交接事实 | formal artifact truth、runtime result truth、observability store truth |
| failure classification / control fact | deny、timeout、backend failure、capture failure、kill、cleanup 等稳定失败 / 控制事实 | runtime business failure、operator UI state |
| cleanup guard / reaper | cleanup 前材料 / 调查保护和孤儿环境回收 | SRE 私有脚本或调用方兜底 |
| redline containment | 安全红线的保守收束与调查交接 | advisory-only event 或 UI 提示 |
| read-only derived support | projection / inspect / preview / trend / comparison / reconciliation 等只读 / 可重建面 | 核心 truth 写源或成功前置 |

### 9.4 交叉引用结论

| 引用位置 | 引用目标 | 作用 |
|---|---|---|
| §1 | 正式 `00/01`;Step 1 | 明确概要承接来源和旧材料排除 |
| §3 | Step 3;§13 | 把结构约束与后续风险挂起分层 |
| §4 | Step 4;§5;§12 | 说明代码主体不是最终职责表,并为详细设计运行单元承接预留入口 |
| §5 | §4;Step 5 | 让组成部分继续作为对象、接口、flow 和状态的共同回指主语 |
| §6~§9 | Step 6~9 | 保持对象、接口、flow、状态四章一一回指,不机械复制 |
| §10 | Step 8~10 | 异常只解释主线变化,不重建第二套 flow 或状态 |
| §11 | Step 3;Step 8~11 | 保持“配置影响承载,不改写语义”口径 |
| §12 | Step 4~11 | 把稳定输入交给 `03`,同时绑定回退规则 |
| §13 | Step 13 | 保留风险与挂起项,不在正式文档中消解 |

### 9.5 跨章节总审计表

| 审计来源 | 审计对象 | 结论 |
|---|---|---|
| Step 4 / Step 5 | 代码主体与主要组成部分 | pass |
| Step 6 / Step 7 | 对象与接口骨架映射 | pass |
| Step 8 / Step 9 | flow 与状态机触发关系 | pass |
| Step 10 | 异常边界与状态主线 | pass |
| Step 11 / Step 12 | 配置边界与详细设计承接 | pass |
| Step 13 | 风险 / 待确认与正式章节挂起 | pass |
| 旧材料污染审计 | 旧对象词、旧后端、旧 allowlist、旧性能数字、旧主线 | contained_as_historical_material |
| 下游文档缺口 | `04-配置设计.md`;`07-实施计划.md` | open_downstream_not_blocking_02 |

### 9.6 正式文档整理结论

正式 `projects/L4-sandbox/02-概要设计.md` 已可按 Step 1~13 结论重建。重建后必须停在 `02` 审查点,不得自动创建 `03_ddd_calibration_flow.md` 或 `03` Step 文件。`03-详细设计.md` 只有在用户审查并明确确认正式 `02` 后,才能按详细设计 SOP 启动。

---

## 10. 回填草稿

本 Step 的正式回填对象是 `projects/L4-sandbox/02-概要设计.md` 全文。正式文档按 §9.2 的 14 章回填表装配,每章开头写入具体校准来源和延伸阅读。回填时不复制所有 Step 过程性问题回答、旧材料诊断和停审表;这些内容继续保留在 `design-calibration` 中。

---

## 11. 待确认事项处理建议

| 待确认事项 | 当前处理 |
|---|---|
| backend 组合、profile、数字阈值、产品选型 | 保留在正式 §13,后续 `03/04/05/06/07` 或 ADR 再闭口。 |
| DTO / payload / port / state / storage 契约 | 交给 `03`,不得在 Step 14 私补。 |
| handoff receipt、retention、cleanup release、investigation 回链 | 保留在正式 §13,后续 `03/04/05/06` 闭口。 |
| `04` / `07` 缺失 | 作为 downstream doc gap 保留,不阻塞 `02` 完成;进入对应文档时按 SOP 创建。 |

---

## 12. 自检与进入下一步条件

| 检查项 | 结果 |
|---|---|
| 是否只装配 Step 1~13 已确认结论 | pass |
| 是否按 14 章正式结构组织 | pass |
| 是否每章都有具体校准来源块 | pass |
| 是否保留待确认项而未润色为定论 | pass |
| 是否未新增 DTO / schema / 产品 / 配置 / 测试 / 实施结论 | pass |
| 是否未伪造 commit、evidence、run_id 或验收签署 | pass |
| 是否未进入 `03` | pass |

当前进入下一步条件: 等待用户审查正式 `02-概要设计.md`;用户确认后才允许启动 `03-详细设计.md` full-restart。

---

## 13. PHYSICAL EOF Current Assembly: `v7.9-closeout`

### 13.1 装配原因与输入门禁

正式 `02` 的主体、14章结构和已审查概要判断保持不变。DesignReopen关闭后只出现两类需要回填的可验证差异：

1. capture / handoff / relay的正向port名称必须与正式`03` current contract lock一致。
2. §13不能继续把已形成的正式`04`、正式`07`、implementation ledger和32件planned skeleton写成缺失。

本次已先读取更新后的`02_hld_step_13_risks_open_questions.md` §15、正式`03~07`、
`03_ddd_step_07_capture_handoff_publisher_observability.md`和
`07_implementation_plan_step_13_formal_document_assembly.md`。没有发现需要回退Step 4~12、更改概要主体或重开上游`00/01`的差异。

### 13.2 定向装配清单

| 正式位置 | 写入动作 | 来源 | 禁止扩展 |
|---|---|---|---|
| 文首current-source note | 声明旧generic port仅是historical material | Step 7 current owner source | 不把详细DTO / outcome复制到概要 |
| §4 / §7正向port索引 | 固定`CaptureCollectionPort`、`HandoffTargetDeliveryPort`、`SandboxEventPublisherPort` | 正式`03` current contract lock | 不新增第四个material delivery owner |
| §13.1风险 | 将“设计文档未闭口”更新为“绕过current contract或Activation gate” | Step 13 §15 | 不声称Activation已通过 |
| §13.2待确认 | 将material dead-letter排除，dead-letter只保留给relay | Step 13 §15；正式`03` state / error contract | 不改变relay状态机 |
| §13.3当前状态 | 文档链标为已形成，列出仍开放的Activation前置 | implementation ledger blocker register | 不填真实baseline、仓、run或evidence |

### 13.3 装配自检

| 检查项 | 结果 |
|---|---|
| 正式`02`仍为14章且未重写主体边界 | pass |
| 所有新结论均可追溯到更新后的Step 13或正式`03~07` | pass |
| 旧port未出现在正式`02`正向接口索引 | pass |
| material handoff未使用`DeadLetter` | pass |
| 文档完成与实现Activation已明确分离 | pass |
| 未伪造commit、run、测试、evidence、review或签署 | pass |

```text
step_status = completed_current_closeout
formal_02_status = reviewed_baseline_with_v7.9_targeted_current_source_writeback
formal_structure = unchanged_14_chapters
new_upstream_blocker = none
implementation = CB-SBX-01A blocked / activation_gate / wait_design
next_allowed_action = keep_design_flow_closed_then_use_project_and_implementation_ledgers
commit_required = no
```

## 14. Final technical-baseline assembly authorization (`DC-03`)

Step 15 技术决策不改变概要对象或主流程。正式 `02` 只需在实现承接处锁定：Rust edition `2024`、rust-version
`1.93`、exact toolchain `1.93.0`、resolver `2`、唯一 sibling compile dependency `core-contracts` 及 required core
revision。canonical/Shell 的算法细节继续由 `03/05/07` 承接。

```text
assembly_authorization = DC-04_formal_02_baseline_summary
subject_design_reopen = no
implementation_validation = not_started
next_allowed_action = update_formal_02_then_continue_authorized_closeout
```

## 15. PHYSICAL EOF DC-06 final audit disposition

Step 17 已反向审计正式 `02` 的主体、port、flow、状态轮廓和 Rust/core baseline 摘要。DC-06 没有发现需要修改概要
主体或正式正文的新差异；DC-04 的技术基线摘要回填保持有效。

```text
dc_06_assembly_disposition = audit_only_no_formal_delta
formal_02_delta_in_dc_06 = none
subject_design_reopen = no
implementation_validation = not_started
design_audit_status = completed_design_static_only
```
