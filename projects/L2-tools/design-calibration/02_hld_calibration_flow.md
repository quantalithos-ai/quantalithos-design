# L2-tools 02 概要设计全量重启校准流程

> 创建日期: 2026-08-05
> 状态: 02_completed_stop_review
> 当前模式: full-restart / single-agent-serial
> 正式文档目标: `projects/L2-tools/02-概要设计.md`
> 项目级台账: `design-calibration/project_execution_ledger.md`
> 当前直接基线: 已完成的正式 `00-需求文档.md` 与 `01-架构设计.md`
> 历史材料口径: 旧 README 与旧正式 `02/03/05/06` 仅用于差异和污染审计，不提供现行对象、接口、状态或实现事实。

---

## 1. 文档级恢复点

| 当前 Step | 当前模块 | gate_status | gate_reason | next_allowed_action | source_files |
|---|---|---|---|---|---|
| Step 14 completed stop review | `formal_document_assembly:completed_stop_review` | `blocked` | 正式 02 已仅依据 Step 1~13 停审结论按固定 14 章重建，装配后全链审计通过；当前只由用户审阅门禁阻塞文档切换。 | `wait_user_review_before_03`；不得继续修改正式 02，不得创建 03 flow 或 Step 产物。 | `02_hld_step_14_formal_document_assembly.md`；正式 `../02-概要设计.md`；Step 1~13 主控与 Step 6 六附录。 |

## 2. 执行纪律

- 本流程只负责 `L2-tools` 的 `02-概要设计.md` full-restart；不实现代码，不进入 03。
- 每次恢复先读 `project_execution_ledger.md`，再读本 flow、当前 Step 与全部前序 Step。
- Step 1~14 严格串行；每个 Step 先读标准和上游、回答 SOP 问题、诊断旧材料、形成取舍，再写结构化中间产物。
- Step 5~9 以主要组成部分为小循环主轴，逐部分完成 `capability -> 对象候选 -> 关键对象 -> 接口 -> 处理流 -> 状态 -> 停审`，最后做跨部分闭环审计。
- Step 6 的正式关键对象必须逐对象成节；字段带概要级类型，成员 / 工厂函数参数使用 `TypeName param_name`，但不写完整 schema、完整签名、DDL 或实现代码。
- Step 7 可点名 L2 自有接口 / 事件 / Job 骨架；对外 owner 未闭口的接口只能写 boundary port 与 blocked contract，不得伪造上游事件、route、provider 或协议。
- Step 8 的 P0 Command、改写本地状态的外部输入和影响一致性的 Job 必须有处理流；图只表达概要处理骨架。
- Step 9 必须区分本地正式状态、外部引用评估状态、本地 handoff attempt 与外部 delivery / execution / observation 状态。
- 正式 `02-概要设计.md` 只能在 Step 14 删除旧正文后，依据 Step 1~13 的已停审结论按固定 14 章整体重建。
- `L2T-UP-001~009` 必须持续开放；可完成逻辑轮廓，但不得将 authorization、Sandbox、Observability、Core、SDK、measurement 缺口润色为 ready。
- 禁止伪造实现 commit、run_id、测试结果、真实 evidence alias、验收签署、发布或 readiness。
- 用户已授权连续完成全部 02，因此 Step 内门禁通过后可串行进入下一 Step；正式 02 完成后必须停审，不进入 03。
- 当前无 commit 授权，不提交。

## 3. 公共必读与效力

| 文档 | 用途 | 效力 / 状态 |
|---|---|---|
| `standards/document/设计文档编写通则.md` | 通用层次、图表和事实纪律。 | standard / read |
| `standards/document/设计文档讨论中间产物规范.md` | 三层台账、Step 产物和恢复门禁。 | standard / read |
| `standards/document/设计真相源闭环与可落码性标准.md` | owner、consumer、handoff、failure、evidence 与落码闭环。 | standard / read |
| `standards/document/全局项目依赖关系与裁剪规则.md` | Core compile、Hub/Sandbox/Runtime runtime、Bus/Observability event 裁剪。 | standard / read |
| `standards/document/概要设计讨论流程_SOP.md` | Step 1~14 的固定顺序、问题与门禁。 | standard / read |
| `standards/document/概要设计书写规范.md` | 正式 14 章强骨架、对象 / 接口 / 流程 / 状态粒度。 | standard / read |
| `projects/L2-tools/00-需求文档.md` | 功能、规则、数据、接口、NFR、风险与验收直接需求基线。 | current formal baseline |
| `projects/L2-tools/01-架构设计.md` | 架构单元、写权、运行角色、依赖、数据与交互直接结构基线。 | current formal baseline |
| 六条指定上游正式链 `00~07` | Hub、Sandbox、Observability、Core、Bus、SDK 当前 owner / seam 输入。 | current workspace input；开放缺口不视为 ready |
| `L1-governance`、`L1-artifact`、`L3-method-library`、`L3-capability-hub` 已完成 02 | 粒度、逐对象卡片、小循环和装配审计参考。 | calibration sample；不构成 L2 事实来源 |

## 4. Step 总流程计划

| Step | 输出文件 | 主题 | 状态 | 前序依赖 | 核心输出 | 完成门禁 |
|---:|---|---|---|---|---|---|
| 1 | `02_hld_step_01_upstream_boundary.md` | 上游输入边界 | `done` | 正式 00/01 完成且用户授权 | 上游映射、不再回答 / 必须回答、blocked 输入 | 稳定输入与开放 seam 已分层，允许进入范围讨论。 |
| 2 | `02_hld_step_02_goals_scope.md` | 目标与范围 | `done` | Step 1 | 目标、非范围、概要深度 | 七项结构目标、非范围与深度口径已收稳。 |
| 3 | `02_hld_step_03_constraints.md` | 约束条件 | `done` | Step 1~2 | 上游、层次、结构、事实约束 | 24 条门禁可逐章判定，允许进入代码主体。 |
| 4 | `02_hld_step_04_code_subject_framework.md` | 代码主体框架 | `done` | Step 1~3 | 架构到代码主体映射、实现分层、关键判断 | 六主体族与实现层已分开，external ports 状态诚实。 |
| 5 | `02_hld_step_05_components_boundary.md` | 主要组成部分 | `done` | Step 1~4 | 组成部分、capability、候选对象线索、接缝 | 六部分停审与跨部分审计通过，41 个候选可驱动 Step 6。 |
| 6 | `02_hld_step_06_key_objects.md` + 分部分附录 | 关键对象轮廓 | `done` | Step 4~5 | 逐对象字段 / 状态 / 函数骨架与禁止事项 | 41 对象独立成节，反查与跨对象审计通过。 |
| 7 | `02_hld_step_07_api_interface_skeleton.md` | API / 接口骨架 | `done` | Step 5~6 | Command、Query、Consumer、Event、Job、Port | 六部分停审、IB 追溯和跨接口审计通过。 |
| 8 | `02_hld_step_08_processing_flows.md` | 关键处理流 | `done` | Step 5~7 | 通用路径、P0 独立流、覆盖与停审 | 12 个流族覆盖全部接口，跨流审计通过。 |
| 9 | `02_hld_step_09_state_machine.md` | 状态机 | `done` | Step 5~8 | 状态族、迁移、传播与禁止迁移 | 六部分逐项停审与跨状态审计通过；外部状态未并入本地。 |
| 10 | `02_hld_step_10_exceptions_boundaries.md` | 异常与边界 | `done` | Step 5~9 | 关键异常场景与概要处理 | 六部分、流族、状态红线和 blocker 覆盖通过；未写错误码大全。 |
| 11 | `02_hld_step_11_configuration_impact.md` | 配置影响 | `done` | Step 4~10 | 影响类型、禁止配置化边界、03 承接 | 配置只影响装配，25 条 domain / safety 红线不可配置化。 |
| 12 | `02_hld_step_12_detailed_design_handoff.md` | 详细设计承接 | `done` | Step 4~11 | 已收稳主语、03 展开项、blocked boundary | 全量承接、blocked condition 与回退规则通过。 |
| 13 | `02_hld_step_13_risks_open_questions.md` | 风险与待确认 | `done` | Step 1~12 | 设计风险、问题、blocker 映射 | 风险 / 问题分离，保守挂起与实际阻塞点完整。 |
| 14 | `02_hld_step_14_formal_document_assembly.md` | 正式文档装配 | `completed_stop_review` | Step 1~13 | 重建正式 14 章与全链审计 | 14 章、14 来源块、41 对象、接口 `13/11/5/4/4`、处理流、六状态族与连续编号终审通过；当前停在用户审阅门。 |

## 5. Step 5~9 主要组成部分小循环顺序

| 顺序 | 主要组成部分候选 | 来源架构单元 | 当前结论状态 |
|---:|---|---|---|
| 1 | 工具合同身份、定义与演进 | `A1/S1` | `completed / pass` |
| 2 | Capability Binding 与受控来源 | `A2/P2` | `completed / pass` |
| 3 | 规范调用与受理 | `A3/P5` | `completed / pass` |
| 4 | 执行前置与条件交接 | `A4/P3/P4` | `completed / pass` |
| 5 | Outcome、审计与安全交接 | `A5/P4/P6` | `completed / pass` |
| 6 | 引用维护、受控读取与派生 | `S2/S3/P1~P6` | `completed / pass` |

## 6. 开放 blocker 继承

| Blocker | 02 当前允许收敛 | 02 禁止声明 |
|---|---|---|
| `L2T-UP-001~002` | Authorization 消费逻辑位置、fail-closed、引用评估与 blocked port。 | Owner、source matrix、taxonomy、decision schema、freshness 规则或正向 ready。 |
| `L2T-UP-003~004` | L2 adapter / handoff / source-ref / local attempt / gap 的逻辑对象与 port。 | Sandbox mapping、receipt、DLQ、feedback、cleanup 合同和实际可执行路径。 |
| `L2T-UP-005~007` | Body-free safe material、本地 submission attempt / gap 与 event collaboration port。 | Tools-specific producer/source/event route、observed/delivered/readiness 或 immutable commit baseline。 |
| `L2T-UP-008` | Core-only compile authority、共享类别占位和 boundary ref。 | Tools-specific 类型、字段、package / crate authority。 |
| `L2T-UP-009` | 服务端合同和 future consumer 边界。 | 现成 SDK client、语言 wrapper、coverage 或联调事实。 |

## 7. 当前 next_allowed_action

```text
current_document = 02-概要设计.md
document_status = 02_completed_stop_review
current_step = Step 14 formal_document_assembly completed_stop_review
current_module = formal_document_assembly:completed_stop_review
gate_status = blocked
gate_reason = final full-chain audit passed and formal 02 is complete; only the explicit user review gate blocks transition to 03; L2T-UP-001~009 remain open without blocking logical overview completion
next_allowed_action = wait_user_review_before_03
future_step_files_allowed = false
formal_document_write_allowed = false
next_formal_document_allowed = false
commit_required = false
```
