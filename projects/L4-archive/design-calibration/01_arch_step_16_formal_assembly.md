# 01 架构 Step 16：正式文档装配

## 1. Step 状态与计划

状态：`completed / pass_with_upstream_blockers / stop_review`；模式：`full-restart + single-agent-serial`；对应架构 SOP Step 16。

### Step 内计划

- [x] 读取项目 ledger、01 flow、Step 1~15 与正式 00。
- [x] 确认 Step 5/7/8/9/12/15 的逐单元/逐决定停审均已通过。
- [x] 回答 18 章落位、术语、引用、未确认项和参考收口问题。
- [x] 诊断旧 01 的结构、来源、技术栈、SLA、真相与恢复污染。
- [x] 形成章节装配映射、写入前检查与跨单元预审。
- [x] 删除旧 `01-架构设计.md` 后，分批重建 18 章正式正文。
- [x] 审计章节、图表、引用、编号、依赖、所有权、状态与追溯。
- [x] 更新本文、flow 和项目 ledger 为 `formal / stop_review`。

## 2. 本步输入

- `01_arch_step_01_requirements_baseline.md` 至 `01_arch_step_15_adr_traceability.md`。
- `01_architecture_calibration_flow.md` 与 `project_execution_ledger.md`。
- 正式 `00-需求文档.md`。
- 架构 SOP Step 16、架构书写规范 18 章结构和图表规则。

输入门禁：Step 1~15 均已完成；U1~U6 在 Step 5/7/8/9/12 已逐单元停审，ADR-AR-001~008 已逐决定停审；`AR-UP-001~009` 与 `AR-ARCH-001` 保持 open，但不阻塞保守正式架构装配。

## 3. SOP 问题回答

1. 如何回填？Step 1→§1/3/15/16，Step 2→§2/3，Step 3→§4，Step 4→§5，Step 5→§6，Step 6→§7，Step 7→§8，Step 8→§9，Step 9→§10，Step 10→§11，Step 11→§12，Step 12→§13，Step 13→§14，Step 14→§15，Step 15→§16/17；§18 从正式标准与已使用上游中克制筛选。
2. 哪些结论跨章？source authority 同时约束 §4/5/6/8/9/10/13；多轴状态约束 §6/9/10/11/13；owner handoff 约束 §4/5/9/10/11/15/17。各章从同一已停审结论按本章职责重述，不机械复制。
3. 哪些术语统一？统一使用 U1~U6、Archive-owned truth、owner-approved snapshot/export、projection、ref、manifest/closure、verification/compatibility、storage/lifecycle execution、owner-specific handoff、commit-unknown。
4. 哪些仍不得写成定论？所有精确 schema、provider、algorithm、key/KMS、tier、retention period、receiver protocol、workload/SLA 和 SDK compile 方向。
5. 参考如何收口？仅保留正式需求、全局依赖规则、专项正式上游和两份架构标准；README、旧 01 与 draft 不进入正式参考。

## 4. 历史材料诊断与前后对比

| 维度 | 旧 01 | 新装配来源 | 处置 |
|---|---|---|---|
| 章节结构 | 17 章并混入上线策略/评审 checklist | 架构规范固定 18 章 | 删除旧文件重建，不局部修补 |
| 真相 | 六域 Bundle/Compliance/Restore 容易升格 | Step 3/5/8 的 owner boundary | 仅保留 Archive-owned material/execution truth |
| 依赖 | domain/application/infra、SDK/L1/provider 混层 | Step 7 六类关系 | 只允许核验 Core contract 成为 compile candidate |
| 技术 | Rust/PG/S3/Glacier/hash/signature 固定 | Step 10 架构机制 | 产品、算法、部署选择不继承 |
| 治理 | 默认 7 年、自动 purge、local policy | Step 3/8/12/14 | 只消费正式 decision，缺失 fail-closed |
| 恢复 | archived→active、project.restored | Step 5/8/9/15 | owner-specific material/handoff，无上游直写 |
| 成功与证据 | 5/2 分钟、99.9%、100%、待填追溯 | Step 12/14/15 | 无 baseline 不承诺，不伪造结果/证据 |

## 5. 装配取舍

- 采用 18 章规范结构和每章具体 calibration 来源块，不保留旧章节编号或“上线策略”主章。
- 图仅回填已在 Step 4/5/6/7 停审的四类 ASCII 图；数据和交互使用表格，避免新增流程/时序误读。
- source-authority matrix、依赖六类和恢复失败姿态保留足够架构粒度，但不提前写 DTO、字段、路由、topic、表或函数。
- blocker 同时进入 §15 和相关章节边界语句；不因正式装配把 pending 润色为 ready。

## 6. 章节装配映射

| 正式章节 | 主要校准来源 | 装配内容 |
|---|---|---|
| §1 | Step 1 | 正式来源与收束声明 |
| §2~3 | Step 1~2 | 背景、目标、约束、取舍、非目标 |
| §4~5 | Step 3~4 | 职责、红线、系统上下文与失效 |
| §6 | Step 5 | U1~U6、关系与统一语言 |
| §7 | Step 6 | 运行承载角色和部署边界 |
| §8 | Step 7 | 依赖角色、裁剪、分类、禁止依赖和 AR-ARCH-001 |
| §9 | Step 8 | 逐类 source authority、数据归属与一致性 |
| §10 | Step 9 | 场景、通信类型、失败/补偿边界 |
| §11~12 | Step 10~11 | 架构机制与路径级取舍 |
| §13 | Step 12 | 六类横切及 U1~U6 适用性 |
| §14 | Step 13 | 事实驱动演进和债务上限 |
| §15 | Step 14 | 风险、待确认和完成上限 |
| §16~17 | Step 15 | 需求追溯、漏项边界与 ADR 索引 |
| §18 | Step 1/15 | 经筛选的正式参考材料 |

## 7. 跨单元装配预审

| 审计面 | 预审结果 |
|---|---|
| 职责 | U1~U6 owner 唯一，read/verify 是组合面，不新增第七真相单元。 |
| 依赖 | 外部能力均经 seam；runtime/event/ref/adapter/fake 不进入 package dependency。 |
| 数据 | L1 truth、workspace projection、Artifact material/ref、audit material 清楚分层。 |
| 通信 | sync admission/read、background work、async feedback、owner receiver handoff 与一致性相符。 |
| 横切 | 安全、审计、可观测、韧性、性能/容量、配置/变更均有 U1~U6 落点。 |
| ADR/追溯 | A1~A9、F-AR-001~009、BR-AR-001~012 与 ADR-AR-001~008 无孤儿。 |

## 8. 写入前门禁

```text
project_gate = pass_for_01_step_16_only
document_flow_gate = step_16_completed
step_gate = assembly_and_static_audit_complete
historical_01_was_replaced = true
formal_write_allowed = false_except_review_fixes
new_architecture_conclusions_allowed = false
next_document_02_allowed = true_by_explicit_user_authorization
```

## 9. 正式装配后静态审计

| 审计项 | 结果 |
|---|---|
| 章节与来源 | 正式正文具备规范要求的 §1~§18；18 章均引用具体 calibration 文件，引用均存在。 |
| 图表 | 系统上下文、上下文关系、运行承载和依赖图均来自已停审 Step；无裸图、空图或实现时序图。 |
| 真相与恢复 | source-authority matrix 区分 L1 truth、workspace projection、Artifact material/ref 与 audit material；恢复只经 owner receiver handoff。 |
| 依赖 | compile/runtime/event/ref/adapter/fake 分层保留；`L0-sdk` 冲突仍为 `AR-ARCH-001`，未伪装为 compile ready。 |
| 状态与未知 | closure/integrity/compatibility/storage/handoff 分轴；partial/stale/missing/conflicting/unsupported-version/integrity-failed/commit-unknown 均保持 fail-closed。 |
| 污染 | 未继承 Rust/PostgreSQL/S3/Glacier、默认保留期、分钟级/可用率 SLA、直接 owner 写入或 readiness 声明。 |
| 追溯 | F-AR-001~009、BR-AR-001~012、NFR 和 blocker 均有落点；ADR-AR-001~008 无孤儿。 |

`AR-UP-001~009` 与 `AR-ARCH-001` 原样保留，不阻塞保守架构停审，但阻塞相关精确协议和正向成功结论。

```text
gate_status = pass_with_upstream_blockers
formal_document_status = formal / stop_review
next_allowed_action = 仅在用户明确授权后启动 02；本轮用户已明确授权连续完成全部 02
implementation_write_allowed = false
commit_required = false
```
