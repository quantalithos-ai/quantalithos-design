# L5-sync 架构 Step 16 · 正式文档装配

## 1. Step 状态

| 字段 | 内容 |
|---|---|
| 状态 | `completed / formal_stop_review` |
| 对应 SOP | `架构设计讨论流程_SOP.md` Step 16 |
| 输入 | Step 1~15 已停审中间产物、架构书写规范 18 章主链 |
| 输出 | full-restart 重建 `projects/L5-sync/01-架构设计.md` |
| 完成后 | `formal_stop_review`；等待用户明确授权 02 |

## 2. Step 内计划

- [x] 核对项目级、文档级、Step/模块级三层写入门禁。
- [x] 建立 18 章来源映射、术语表和正式装配规则。
- [x] 完成 Step 5/7/8/9/12/15 的停审汇总与跨架构单元总审计。
- [x] 删除旧正式 01，按 18 章骨架 full-restart 重建。
- [x] 逐章写入收口结论和具体 calibration 来源，不新增分析。
- [x] 完成章节/owner/依赖/数据/通信/横切/ADR/blocker/事实诚实审计。
- [x] 更新 flow/ledger 为 `formal_stop_review`。

## 3. 本步输入与三层门禁

| 门禁 | 检查 | 结果 |
|---|---|---|
| 项目级 | 用户已明确“继续完成全部 01”；只修改 `projects/L5-sync/`；不进入 02/实现/测试/commit | pass |
| 文档级 | Flow Step 1~15 全部 `done/pass_with_upstream_blockers` | pass |
| Step/模块级 | 每步均有问题回答、诊断、取舍、结构化产物、回填、自检；单元级停审完成 | pass |
| blocker | `SYNC-UP-001~010` 仍开放且有保守挂起口径 | pass_with_blockers |
| 事实边界 | 无实现、run、test result、artifact、report、evidence、verdict、signoff、readiness | pass |

## 4. SOP 问题回答

### 4.1 已确认结论如何回填？

Step 1 支撑 §1/§3/§16；Step 2 支撑 §2/§3；Step 3~14 分别支撑职责、系统上下文、限界上下文、容器、依赖、数据、交互、技术、取舍、横切、演进、风险；Step 15 支撑 §16/§17；本 Step 支撑 §18 和装配审计。

### 4.2 哪些结论需拆分到多章？

Owner truth 不转移、status no-write、dirty protection、handoff/decision 分层、provenance/redaction、blocker 真实性会分别出现在约束、职责、数据、交互、横切、风险和追溯中，但每章只表达其本章语义，不机械重复。

### 4.3 术语和编号如何统一？

统一使用 `L5-sync`、local sync session、working copy、source binding、local applied cursor、conflict、checkpoint、handoff attempt、transport ACK、Review decision、provenance relation、archive posture、owner snapshot/ref；需求编号沿用 `CP-SYNC`、`FR-SYNC`、`BR-SYNC`、`AC-SYNC`、`VETO-SYNC`，风险沿用 `AR-SYNC` 和 `SYNC-UP`。

### 4.4 哪些内容继续保留为风险？

SDK surface、source authority、permission/posture matrix、handoff/probe、idempotency、metadata schema、Git mapping、cursor/comparator/gap、LFS/浅克隆/GUI、dirty/path contract 均保留 pending/blocked；不得在整理中润色成已支持。

### 4.5 参考如何收口？

§18 只列正式 00、Step 1~16、标准和专项上游正式 01/必要台账；ADR 候选在 §17、追溯在 §16，不在参考章重复决策内容。

## 5. 当前文档问题诊断与 full-restart 决策

旧正式 01 使用 17 节旧结构，缺“与上游文档关系声明”和逐章 calibration 来源；把 Rust/Tauri、JSON metadata、Git LFS、浅克隆、固定 SLA、旧服务 API、ReviewSubmission truth 和 ADR-0008/0009 当现行结论；还混入上线策略、回滚与监控实施内容。因此不能局部修补，必须删除旧文件后按当前 18 章结构重建。

## 6. 设计取舍

| 方案 | 结论 | 理由 |
|---|---|---|
| A. 在旧 01 上局部替换 | 不采用 | 历史结构与技术污染广泛，难以证明清除。 |
| B. 删除旧文件，按 Step 1~15 收口结论重建 18 章 | 采用 | 满足 full-restart、来源追溯和事实诚实。 |
| C. 机械拼接所有 Step | 不采用 | 过程和结果结构不同，会把诊断/停审搬入正文。 |

## 7. 章节来源映射

| 正式章节 | 主要校准来源 |
|---|---|
| §1 | `01_arch_step_01_requirements_baseline.md` |
| §2 | `01_arch_step_02_arch_goals_constraints.md` |
| §3 | `01_arch_step_01_requirements_baseline.md`、`01_arch_step_02_arch_goals_constraints.md` |
| §4 | `01_arch_step_03_responsibility_boundary.md` |
| §5 | `01_arch_step_04_system_context.md` |
| §6 | `01_arch_step_05_bounded_context.md` |
| §7 | `01_arch_step_06_container_deployment.md` |
| §8 | `01_arch_step_07_dependency_direction.md` |
| §9 | `01_arch_step_08_data_ownership_consistency.md` |
| §10 | `01_arch_step_09_interactions_communication.md` |
| §11 | `01_arch_step_10_technology_choices.md` |
| §12 | `01_arch_step_11_alternatives_tradeoffs.md` |
| §13 | `01_arch_step_12_cross_cutting.md` |
| §14 | `01_arch_step_13_evolution_roadmap.md` |
| §15 | `01_arch_step_14_risks_open_questions.md` |
| §16 / §17 | `01_arch_step_15_adr_traceability.md` |
| §18 | 本文件 |

## 8. 跨架构单元总审计表（装配前）

| 审计维度 | Selection & Access | Working Copy & Metadata | Source Materialization | Conflict & Recovery | Review Handoff & Provenance | 跨单元结论 |
|---|---|---|---|---|---|---|
| 职责 | eligibility/gate | local binding/state | safe source apply | pause/recover/probe | candidate handoff/ref | 无重叠 |
| 依赖 | SDK owner checks | local store + Git/fs observation | SDK source + apply ports | local state/probe | SDK governance | 无反向/私有 seam |
| 数据 | selection/check association | binding/cursor/mapping | attempt/applied range | conflict/checkpoint | attempt/transport/probe/provenance | 外部 truth 均为 ref/snapshot |
| 通信 | sync owner query | local atomic I/O | sync/read + resumable work | local/manual/probe | prepare/call/probe/read | ACK/decision 分离 |
| 横切 | fail-closed | integrity/path/secret | dirty/progress | no blind retry | redaction/audit | 无遗漏 |
| ADR/追溯 | `ADR-SYNC-C02` | `ADR-SYNC-C03`、`ADR-SYNC-C04`、`ADR-SYNC-C07`、`ADR-SYNC-C08` | `ADR-SYNC-C03`、`ADR-SYNC-C07` | `ADR-SYNC-C04`、`ADR-SYNC-C05` | `ADR-SYNC-C05`、`ADR-SYNC-C06`、`ADR-SYNC-C08` | 无孤儿 |

总审计结论：职责、依赖、数据所有权、通信、横切和 ADR/需求追溯之间没有 unresolved 冲突；未闭合上游合同保持 blocker，不写成正式定论。

## 9. 正式装配规则

- 正式正文只承载收口结论；不写问题回答、历史污染诊断、停审过程或执行计划。
- 每章开头列具体 calibration 来源和延伸阅读。
- 所有图使用 `text` 代码块并附 2~5 条说明。
- 不锁 Rust/Tauri、Git library、metadata schema、API/DTO/event、LFS/浅克隆、固定 SLA。
- 不创建 02 flow、implementation ledger、boundary skeleton 或 commit。

## 10. 正式装配终审结果

| 审计项 | 结果 |
|---|---|
| 章节结构 | pass；正式 `01-架构设计.md` 为 §1~§18，顺序与书写规范一致。 |
| calibration 来源 | pass；18 个正式章节各有具体来源文件和延伸阅读，不使用目录级泛指。 |
| 正式编号 | pass；CP/FR/BR/AC/VETO/AR/ADR 均使用全限定 `*-SYNC-*` 编号，无旧 US/ADR-0008/0009 污染。 |
| 职责与 owner | pass；Project、Artifact、Baseline、Review Gate、Workspace projection、Archive、Git remote truth 均未转移给 Sync。 |
| 依赖分类 | pass；编译期、运行期、运行期本地、telemetry 和事件协作已分离；runtime/event 未冒充 package dependency。 |
| 数据与一致性 | pass；local truth、external snapshot/ref、Git observation/ref、forbidden body 和 local/external consistency 已分层。 |
| 交互与恢复 | pass；同步 owner seam、可续本地工作、probe/manual 和失败降级闭合；无自动 merge/rebase/push/stash 或盲重放。 |
| 技术与演进 | pass；Rust/Tauri、LFS、浅克隆、daemon、直接 bus、固定 schema/SLA 均未被写成当前支持事实。 |
| ADR 与追溯 | pass；`ADR-SYNC-C01~C08` 全为 `candidate / not established` 语义，需求主轴无孤儿；精确合同缺口仍显示。 |
| blocker | pass_with_upstream_blockers；`SYNC-UP-001` 至 `SYNC-UP-010` 均显式保留为 `pending/blocked`。 |
| 事实诚实 | pass；未声明实现、commit、run、测试结果、artifact、report、evidence、verdict、signoff 或 readiness 已存在。 |
| 静态检查 | pass；18 章/18 来源块/18 延伸阅读、16 个 Step 文件、成对代码围栏、正式引用文件存在性和 `git diff --check -- projects/L5-sync` 均通过。 |
| 下游门禁 | pass；未创建 02 flow、implementation ledger 或 boundary skeleton，下一动作只能等待用户明确授权 02。 |

终审结论：Step 16 完成，正式 01 进入 `formal_stop_review`。该结论只证明文本装配和静态一致性通过；不关闭任何上游 blocker，也不产生实现、测试或评审事实。
