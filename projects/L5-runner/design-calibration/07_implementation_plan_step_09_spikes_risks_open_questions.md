# Step 9. 定义 Spike、风险与待确认事项

> 对应 SOP：`standards/document/实施计划讨论流程_SOP.md` Step 9  
> 书写规范：`standards/document/实施计划书写规范.md` §5.9  
> 上游输入：`07` Step 1～8、`03-详细设计.md` §13～§17、`04-配置设计.md` §14、`05` Step 14、`06` Step 13  
> 回填章节：未来正式 `projects/L5-runner/07-实施计划.md` §9  
> 执行方式：`full-restart + single-agent-serial`

## 1. Step 状态与事实边界

| 项 | 当前值 |
|---|---|
| `current_document` | `07-实施计划.md` calibration |
| `current_step` | `Step 9` |
| `current_module` | `spikes_risks_open_questions` |
| `status` | `completed / self_reviewed` |
| `gate_status` | `pass_for_step_10` |
| `gate_reason` | 已将需要先验证的技术/契约点、会阻塞 phase 或 boundary 的风险、每项有截止点的待确认事项、上游回写触发器和 P0 不可绕过红线分开登记；当前所有实例仍为 planned/blocked/waiting，未执行 Spike、未接受风险。 |
| `formal_07_write_allowed` | `false_until_step_13_assembly` |
| `implementation_write_allowed` | `false` |
| `test_execution_allowed` | `false` |
| `implementation_ledger_allowed` | `false_until_step_13_assembly` |
| `commit_required` | `false` |
| `next_allowed_action` | 创建并完成 `07_implementation_plan_step_10_rollback_change_control.md`；完成后停审 |

本 Step 只定义未来实施期间的 Spike、风险和待确认事项。Spike ID、risk ID、open-question ID、截止点、输出路径和责任角色都是计划合同；它们不表示仓库、工具、人员、环境、run、artifact、report、evidence、risk acceptance、verdict、signoff 或 readiness 已存在。

## 2. 本步输入、输出与非目标

### 2.1 输入基线

| 输入 | 本 Step 承接内容 | 使用限制 |
|---|---|---|
| `07` Step 1～4 | 实施输入资格、范围、阅读门禁和交付物 | 不扩大 07 范围，不关闭 blocker |
| `07` Step 5～6 | 六个 phase、18 个 commit boundary、依赖顺序和 boundary 复核点 | Spike 不新增 phase，不把对象/文件拆成阶段 |
| `07` Step 7 | suite/CUT/TC、AC/AR/TX/NFA/VETO、artifact/report/evidence 门禁 | 风险必须回指现有 gate，不新增验收 authority |
| `07` Step 8 | 依赖、profile、环境、fake/controlled/disabled 和 unavailable 处理 | 不把候选环境或 fake 写成 ready |
| `03-详细设计.md` §13～§17 | 配置依赖、观测、test-cut、实施前置和持续 blocker | 设计缺口必须回写 03，不在 Spike 中补 schema |
| `04_config_step_14_risks_open_questions.md` | 配置风险、future trigger、whole-document/fail-closed 规则 | 不新增 profile、配置 key 或默认值 |
| `05_test_plan_step_14_regression_risks.md` | 回归触发、残余风险、不可接受项和 06/07 承接 | 不执行回归，不填写实际接受人 |
| `06_acceptance_step_13_risk_acceptance.md` | 风险资格、角色分离、期限、撤销/重开和未接受语义 | 风险登记不等风险接受，不得覆盖 VETO |

### 2.2 本步输出

- Spike 表：每项有目的、影响 phase/boundary、明确输出、依赖、截止点、当前状态和失败动作。
- 风险表：区分 blocker、implementation risk、acceptance/operations residual；每项绑定影响、缓解、触发器、截止点和责任角色。
- 待确认事项表：不使用“后续确认”，每项有 owner/authority、影响和最迟关闭点。
- 上游设计回写触发矩阵：字段/DTO/state/port、配置、测试/证据、验收和实施计划分别回到其 truth source。
- Spike/风险停审与跨 phase/boundary 审计，明确何时 `wait_design`、`blocked`、`not_run` 或重新建立 baseline。

### 2.3 非目标

- 不执行 Spike，不创建 demo、脚本、报告、fixture、实现仓、baseline 或测试实例。
- 不选择语言、runtime、GUI/CLI、process、packaging、store/backend、锁、迁移、SDK 方法、transport、topic、算法、平台命令或生产阈值。
- 不把 Spike 输出预先写成“通过”，不把风险登记写成 accepted，不以用户、设计者或实现者替代有权限的风险接受角色。
- 不用风险签字替代 required positive seam、实现、测试、evidence、VETO 清除或 owner truth。

## 3. SOP 问题回答

| SOP 问题 | Runner 收口回答 |
|---|---|
| 哪些技术点需要先做 Spike？ | 只对会改变设计闭环、依赖边界、状态/事务语义、配置装配、Consumer/Job 安全边界或 evidence 生成方式的点做 Spike：目标仓/authority 核验、Core/SDK surface compatibility、strict config builder、local store guarantee、Artifact/Governance qualification、Sandbox/Runtime/platform effect/readback、redaction/handoff、Consumer header-first/event-zero、Job report/replay、same-run report/evidence pairing 和 selected-run preflight。 |
| 哪些风险会阻塞 phase？ | 目标仓/技术 authority、字段/DTO/state/port 闭环、required local guarantee、strict config、L0-sdk exact surface、Artifact/Governance/Sandbox/Runtime/平台/Observability public seam、redaction、Consumer header contract、Job claim/report、same-run evidence pair 和 fixed-run/baseline 缺失均会阻塞相应 phase；不能由实现者现场替代。 |
| 哪些待确认会影响 boundary 或 gate？ | 每个 boundary 的 design closure、compile/runtime/event 分类、config source/profile、store guarantee、upstream slot contract、Consumer schema、Job scheduler/claim、report reviewer、baseline/fixed run、GRC/retention 和 target-tier 要求都可能改变提交前 gate 或验收分母，必须在对应 boundary 开工前关闭。 |
| 每个 Spike 的输出是什么？ | 必须是可审查的 compatibility matrix、decision/closure record、negative fixture set、dry-run report、call/write/redaction scan、state/effect/recovery matrix 或 gate checklist；只有口头结论不算完成。输出不得伪造真实 run 或 evidence。 |
| 每个风险如何处理、截止点是什么？ | blocker 触发当前 phase/boundary 停止并 `wait_design`/`blocked`；implementation risk 必须在对应 Commit Gate 前消除或回写；operations/acceptance residual 只能在正式 target tier、fixed run、VETO clear 和有权限的实际接受后进入 06 裁决。截止点固定到 `PH-*`、`commit-ph-*` 或 release handoff，不使用无限期“后续”。 |
| 哪些风险必须回写上游？ | 任何新增/改变字段、DTO、enum、状态迁移、port、error、metadata、idempotency、store guarantee、config key/profile、TC/CUT/suite/data/evidence schema、AC/VETO/NFA、phase/boundary 或 owner contract 的风险都必须回写拥有真相源的文档；不能只在实现计划或代码中解决。 |

## 4. 当前文档问题诊断、改动前后与设计取舍

### 4.1 问题诊断

| 诊断项 | 风险 | 本 Step 处理 |
|---|---|---|
| 目标实现仓与技术 authority 缺失 | PH-01 可能被迫临时选择目录、命令或语言 | 设为 blocker 和 SP-RUN-001；关闭前不移交实现 |
| L0-core/L0-sdk 目录存在但 exact surface 未核验 | 目录存在被误判为可编译/可运行 | 设 SP-RUN-002；要求 package/export/version/error/redaction/trace 兼容矩阵 |
| local store/cache guarantees 未定 | UoW、幂等、commit-unknown、重启和清理无法证明 | 设 SP-RUN-004；只允许先核 required guarantee，不选 backend |
| 上游 owner seam 分散且正向 blocked | 实现者可能复制 private DTO/transport 或本地批准 | 分别登记 Artifact/Governance、Sandbox/Runtime/platform、Observability/Archive 风险和 re-open 触发 |
| Consumer/Job 的副作用红线容易被统一框架吞掉 | payload/ACK/owner repair/replay 可能被误写为成功 | 设独立 SP-RUN-008/009 与 VETO 触发 |
| 报告和 evidence 可能被静态生成或跨 run 拼接 | 产生假 evidence、假 handoff 或假 readiness | 设 SP-RUN-010；要求 raw→report→check→evidence same-run 链和缺失保真 |
| 风险 acceptance 与 blocker 容易混淆 | 通过签字掩盖实现/环境缺口 | 继承 06 eligibility；当前所有风险未接受，VETO/S/P0 required 不可接受 |

### 4.2 改动前后对比

| 项 | 之前 | Step 9 后 |
|---|---|---|
| 不确定性 | 分散在 03/04/05/06 和 Step 8 | 按 Spike、blocker/risk/residual、open question 三类集中登记 |
| Spike 口径 | 可能把探索当实现 | 每项必须有可审查输出和 boundary 截止点，不产生实现事实 |
| 风险截止 | 容易写成“后续确认” | 每项绑定 phase、boundary、gate 或 handoff，未关闭即阻断 |
| 设计回写 | 实现期可能临时补 schema | 明确 03/04/05/06/07 与上游 owner 的回写入口和重审动作 |
| 风险接受 | 可能把 blocker 当 residual | VETO/S/P0 required 永不可接受；其他 residual 也未实际接受 |

### 4.3 设计取舍

| 方案 | 优点 | 风险/代价 | 结论 |
|---|---|---|---|
| 把所有未知都做成 Spike | 表面保守 | Spike 变成没有截止的第二实施流 | 不采用 |
| 只对可能改变 gate/边界/证据的未知做 Spike | 聚焦、可审查 | 需要在 boundary 开工前重新扫描 | 采用 |
| 允许实现者用 mock 自行闭合上游 | 快速得到绿色结果 | 伪造 owner truth 和 integration readiness | 不采用 |
| 用风险接受代替缺失实现或 required seam | 可绕过阻塞 | 破坏 VETO/验收完整性 | 不采用 |
| 只在 phase 结束时处理风险 | 文档少 | 返工晚、boundary 可能已越界 | 不采用；在 boundary 开工前检查 |

## 5. 结构化中间产物

### 5.1 Spike 表

| 编号 | 类型 | 描述与问题 | 影响阶段 / boundary | 必须输出 | 依赖与失败动作 | 截止点 | 当前状态 |
|---|---|---|---|---|---|---|---|
| `SP-RUN-001` | bootstrap/authority spike | 核验目标 Runner 仓、语言/runtime/入口 authority、manifest/worktree 和逻辑模块到物理布局的映射；不自行创建仓 | PH-01 / `commit-ph-01-a` | authority decision record、目标仓/manifest 检查清单、physical-layout blocker record | 依赖用户/架构 authority；失败即 `RUN-DDD-001/002` blocked，停止 PH-01 | `commit-ph-01-a` 开工前 | `blocked / not_run` |
| `SP-RUN-002` | compatibility spike | 核验 L0-core/L0-sdk 的正式 package/export/version、Runner-facing client、error/redaction/trace/metadata surface 和兼容边界 | PH-01/02/03/04/06；`01-a`、`02-c`、`03-b`、`04-b`、`06-a` | compile/runtime compatibility matrix、dependency-boundary scan contract、unsupported/error mapping checklist | 依赖 L0 owner；exact surface 缺失保持 `RUN-UP-008`，相关 lane `blocked/not_run` | `commit-ph-02-c` 开工前 | `blocked / waiting` |
| `SP-RUN-003` | configuration spike | 在不选技术栈的前提下验证 strict whole-document、四 profile、七域 cross-field、configured/enabled/ready 和 no-fallback 语义 | PH-01；`commit-ph-01-b` | schema/validation matrix、invalid-document corpus、builder/readiness decision record | 依赖实现 authority 和 04 truth；失败即 fail-fast/回写 04，不进入 PH-02 | `commit-ph-01-b` 提交前 | `planned / blocked` |
| `SP-RUN-004` | durability/UoW spike | 仅验证 required guarantees：version/atomicity/locking/migration/corruption/commit-unknown/restart/cleanup；不选 backend | PH-01/03/05；`01-b`、`03-b`、`03-d`、`05-b/c` | guarantee matrix、fault/restart scenarios、decision/closure list | 依赖 `RUN-DDD-003` authority；缺口保持 builder/affected boundary `blocked`，不得用 in-memory 冒充 product durable | `commit-ph-03-b` 开工前 | `blocked / waiting` |
| `SP-RUN-005` | authority/material spike | 对 Artifact locator/source、Governance approval/baseline、integrity/qualification 分轴做 controlled semantic conformance | PH-02/06；`commit-ph-02-b/c`、`06-a` | adapter slot matrix、blocked/unknown/expired/revoked/conflict vectors、Complete/Verified/Qualified assertion set | 依赖 `RUN-UP-001/002/008`；正向 contract 未到只做 negative lane，不能请求 Sandbox | `commit-ph-02-c` 开工前 | `blocked / waiting` |
| `SP-RUN-006` | effect/recovery spike | 验证 Sandbox/Runtime/platform 的 request→effect→readback→local result 顺序、lease/cleanup/protection、Unknown/RecoveryCase/no-replay | PH-03/06；`commit-ph-03-b/c`、`06-a` | state/effect/readback/recovery matrix、guard/lease/cleanup fault vectors、manual-review checklist | 依赖 `RUN-UP-003/004/007`；缺 seam 只保留 Unknown/Blocked，禁止 ACK/PID/port shortcut | `commit-ph-03-c` 开工前 | `blocked / waiting` |
| `SP-RUN-007` | safe-surface/redaction spike | 验证 bounded preview/diagnosis/handoff safe fields、visibility/freshness/source 和 all-or-nothing redaction | PH-04/06；`commit-ph-04-a/b`、`06-b` | forbidden-field corpus、safe view construction checklist、redaction/handoff receipt pairing report shape | 依赖 `RUN-UP-005`；policy/sink 缺失即 no-content/Blocked，不生成 evidence | `commit-ph-04-b` 提交前 | `blocked / waiting` |
| `SP-RUN-008` | consumer-boundary spike | 验证 header-first schema/version/dedup/readiness、Blocked/Unsupported/Rejected/Quarantined/Duplicate 以及 payload/ACK/cursor 零调用 | PH-05；`commit-ph-05-a/d` | call/write trace assertions、static event/outbox/topic=0 scan、negative envelope corpus | 依赖正式 Consumer/transport seam；未授权只允许 negative，不能 parse/hash/store/ACK | `commit-ph-05-a` 提交前 | `blocked / waiting` |
| `SP-RUN-009` | job/replay spike | 验证五类 local-only Job 的 claim/checkpoint/report/idempotency/duplicate、generation guard、no-owner-repair/no-replay | PH-03/05；`commit-ph-03-c`、`05-b/c` | job terminal matrix、fault/replay cases、stored report duplicate review | 依赖 local store/operations authority；缺失则 `planned/blocked`，不把 report 升级业务 truth | `commit-ph-05-c` 开工前 | `blocked / waiting` |
| `SP-RUN-010` | evidence/report spike | 用脱敏、明确标记的 synthetic raw shape 验证 raw→suite→check→report→slot/index 的 same-run、digest、pairing、redaction 和 no-static 规则 | PH-01/05/06；`commit-ph-01-b`、`05-d`、`06-b` | dry-run report、pairing/link/no-static audit、缺失/blocked/incomplete fixture 记录 | 依赖 report/tool authority；无真实 raw 时只能验证能力合同，不创建 EV 实例 | `commit-ph-05-d` 提交前 | `planned / blocked` |
| `SP-RUN-011` | cross-platform/resource spike | 验证 platform resource/port conflict/unknown/unsupported taxonomy、用户可见安全提示和清理责任，不锁 OS 命令或数值 | PH-03/06；`commit-ph-03-a`、`06-a` | platform capability matrix、conflict/unknown vectors、responsibility decision record | 依赖 `RUN-UP-007`；taxonomy 未闭合保持 Unknown/Blocked，禁止 allocation claim | `commit-ph-03-a` 提交前 | `blocked / waiting` |
| `SP-RUN-012` | selected-run preflight spike | 验证 approved config/provider、immutable baseline、fixed run、required checks、review role 和 product/GRC 前置是否可逐项判定 | PH-06；`commit-ph-06-a/b` | preflight checklist、blocked reason mapping、handoff/review responsibility matrix | 依赖 `RUN-OPS-001/002`、`RUN-DOC-003`；任一缺失 `baseline_blocked/not_run` | `commit-ph-06-a` 开工前 | `blocked / waiting` |

Spike 完成不等于实现完成或验收通过；每项必须先经设计/依赖 owner review，再允许受影响 boundary 进入下一门禁。若 Spike 结果要求新增字段、状态、port、配置或测试分母，必须触发 §5.4 的回写和重开流程。

### 5.2 风险表

| 编号 | 类型 | 风险描述 | 影响阶段 / boundary / gate | 处理方式与未确认前姿态 | 责任/确认角色（候选） | 截止点 | 当前状态 |
|---|---|---|---|---|---|---|---|
| `R-RUN-001` | blocker | 目标实现仓不存在，语言/runtime/shell/process/packaging 未获 authority | PH-01、全部 boundary；Design/Toolchain Gate | 不创建、不伪造；关闭前只保留逻辑计划，停止实现移交 | 架构 authority、实施负责人、用户 | PH-01 / `01-a` 开工前 | `blocked` |
| `R-RUN-002` | blocker | local store/cache、locking、migration、atomicity、corruption、restart guarantee 未定 | PH-01/03/05；UOW/IDM/JOB/cleanup gates | 只保留 required guarantees；builder/affected lane Blocked，不以 in-memory 代 product durable | 架构/infra/安全 authority | `03-b` 开工前 | `blocked` |
| `R-RUN-003` | blocker | L0-core/L0-sdk exact package/export/version/client/error/redaction/trace surface 未核验 | PH-01/02/03/04/06；dependency/controlled gates | SDK-first；不写 path/package/method，不复制 SDK/private implementation；相关 lane blocked/not_run | L0-core/L0-sdk owner、架构 | `02-c` 开工前 | `pending / blocked` |
| `R-RUN-004` | blocker | Artifact Release locator/manifest/integrity/revoke/expire consumption contract 不完整 | PH-02/06；AC-001～004、VETO-001/002 | selection/acquisition/qualification 仅 negative/blocked；不本地批准、读内部表或用 cache 补 authority | Artifact owner、验收 authority | `02-c` 开工前 | `blocked` |
| `R-RUN-005` | blocker | Governance approved/baselined chain、scope、expiry/revoke/conflict 不完整 | PH-02/06；AC-001～004、VETO-001/002 | `Pending/Blocked/Stale/Unknown`；不以历史 decision、用户选择或 UI 代替 approval | Governance owner、验收 authority | `02-c` 开工前 | `blocked` |
| `R-RUN-006` | blocker | Sandbox request/lease/control/cleanup/orphan/reaper/readback seam 未闭合 | PH-03/06；AC-005～009、VETO-003/006/007 | semantic adapter + controlled negative；Accepted/Confirmed 不升级，Unknown 冻结并 RecoveryCase | Sandbox owner、Runtime owner、平台 authority | `03-c` 开工前 | `blocked` |
| `R-RUN-007` | blocker | Runtime safe status/result/recovery read surface 未闭合，平台资源 taxonomy 未统一 | PH-03/04/06；OWN/RES/REC、VETO-003/006 | 不以 PID/port/ACK/log 推导 Running/outcome；Conflict/Unknown/Blocked 保真 | Runtime/platform/Sandbox owner | `03-a/b` 开工前 | `blocked` |
| `R-RUN-008` | risk | profile、environment、slot readiness 或 configured/enabled/ready 被混淆，或 fake 污染 non-test | PH-01/02/06；CFG/CONTROLLED/SECURITY | strict whole-document、profile isolation、per-slot markers；触发 fail-fast/Blocked，不能 fallback | 配置/安全/测试负责人 | `01-b` 提交前 | `planned / blocked` |
| `R-RUN-009` | blocker | Query/read-model/refresh/reconcile/probe 发生写入或创建 identity | PH-04；GATE-05、AR/VETO-005 | 静态 call/write audit 和 no-write tests；命中立即停止并回写 03/05/06 | 应用/读模型/安全 reviewer | `04-c` 提交前 | `planned / blocked` |
| `R-RUN-010` | blocker | Consumer 解析 payload、计算 hash、写 owner cursor、ACK 或出现 Runner outbound event | PH-05；GATE-06、VETO-005/011 | 只允许 header-first negative/strict stored Duplicate；event/outbox/publisher/topic=0；命中不可风险接受 | worker/SDK/event owner、架构 | `05-a` 提交前 | `planned / blocked` |
| `R-RUN-011` | blocker | Job owner repair、自动 replay/resend/reclaim/resume、claim/checkpoint/report 语义丢失 | PH-03/05；GATE-07、TX-007、VETO-007 | local-only、generation/claim guard、stored report first；Unknown/Blocked 不压成 Failed/Partial | operations/infra/安全 reviewer | `05-c` 提交前 | `planned / blocked` |
| `R-RUN-012` | blocker | raw body/secret/path/URL/PID/port/stack/upstream正文进入 view、log、report、artifact 或 handoff | PH-04～06；GATE-09/10、VETO-008/011/012 | forbidden corpus、redaction fail-closed、无 raw fallback；命中停止且全量复核 | 安全/Observability owner、测试 reviewer | `04-b` 起每个相关 boundary | `planned / blocked` |
| `R-RUN-013` | blocker | 静态 evidence、跨 run 拼接、缺 raw/report pair、digest/source mismatch 或 cleanup 残留被当成完整 | PH-01/05/06；GATE-10/11/12、VETO-011/012 | same-run pairing/link/cleanup/no-static checks；缺失为 incomplete/blocked，不生成 EV/handoff | 测试工具/验收/实施负责人 | `05-d`、`06-b` 提交前 | `planned / blocked` |
| `R-RUN-014` | blocker | target tier 所需 baseline、fixed run、环境、GRC/review authority、retention/SLO 不存在 | PH-06；G-RUN-CONTROLLED/STAGING/RELEASE | `baseline_blocked/not_run`；不生成 verdict/signoff/readiness，不用风险签字代替实现 | 产品/运维/GRC/验收 authority | `06-a` 开工前 | `blocked` |
| `R-RUN-015` | risk | 设计 baseline、05/06 分母或 07 gate 在 boundary 期间变化，导致旧 mapping 失效 | PH-01～06；全部 boundary | 开工前重读 truth source；变更触发 selected/full regression、新 baseline；不覆盖旧 run | 设计/测试/验收负责人 | 每个 boundary 开工前 | `planned / waiting` |
| `R-RUN-016` | risk | 断线、休眠、跨平台资源冲突或 cleanup 失败被用户界面压成成功/可继续 | PH-03/04/06；AC-006～009、NFA、VETO-003/006 | typed Unknown/Conflict/RecoveryCase、safe next step、no replay/no destructive fallback；按平台 authority 重开 | 产品体验/平台/Sandbox/Runtime owner | `03-c`、`06-a` 前 | `blocked / waiting` |
| `R-RUN-017` | residual | Archive/外围诊断不可用影响附加视图或交接，但不应改变 core run/cleanup truth | PH-04/06；AC-010/011 | peripheral Blocked/Degraded；明确不计 core pass，也不由本地 package 替代 Archive truth | Archive/Observability owner、产品 | `04-b`、`06-b` 前 | `waiting / blocked` |
| `R-RUN-018` | residual | 生产容量、SLO、retention、真实 integration/GRC 和跨平台产品 rehearsal 无 authority | PH-06；NFA-008、release/handoff | 只保留 exploratory/measurement candidate；进入 06 前需正式 authority、方法、期限和有权接受人 | 产品/架构/运维/验收 | release handoff 前 | `blocked / not_accepted` |

其中 `R-RUN-001~007`、`R-RUN-009~014` 是实施或 required gate blocker；`R-RUN-008/015/016` 在未关闭时也可阻断受影响 boundary；`R-RUN-017/018` 不能支持当前 core pass，且未发生任何风险接受。风险登记不改变 05/06 raw 状态，也不关闭 `RUN-UP-*`、`RUN-DDD-*` 或 `RUN-OPS-*`。

### 5.3 待确认事项表

| 编号 | 类型 | 待确认事项 | 影响阶段 / boundary | 需要确认方（候选） | 未确认前处理 | 最迟关闭点 | 当前状态 |
|---|---|---|---|---|---|---|---|
| `OQ-RUN-001` | open-question | 目标实现仓由谁创建、初始 baseline 如何建立、用户改动如何登记 | PH-01 / `01-a` | 用户、架构/实施 authority | 不创建仓、不填 hash、不移交实现 | `01-a` 开工前 | `open / blocked` |
| `OQ-RUN-002` | open-question | 语言、runtime、GUI/CLI shell、process、packaging 与有效编码规范 | PH-01 / `01-a` | 架构 authority、用户 | 只保留逻辑模块和条件性命令；不写物理路径 | `01-a` 开工前 | `open / blocked` |
| `OQ-RUN-003` | open-question | L0-core/L0-sdk 是否有正式 Runner-facing package/export、版本和兼容支持 | PH-01/02/04 / `02-c` | L0-core/L0-sdk owner | dependency candidate only；相关 positive lane blocked | `02-c` 开工前 | `open / pending` |
| `OQ-RUN-004` | open-question | local store/cache 的 backend、locking、migration、atomicity、corruption/restart guarantee | PH-01/03/05 / `03-b` | 架构/infra/安全 authority | 只写 guarantee；不写 DDL/path/backend | `03-b` 开工前 | `open / blocked` |
| `OQ-RUN-005` | open-question | Artifact locator/transport/integrity/revoke 与 Governance authority 的正式 public seam、scope 和错误语义 | PH-02 / `02-c` | Artifact/Governance/L0-sdk owner | Blocked/Stale/Unknown；不本地批准/验证 | `02-c` 开工前 | `open / blocked` |
| `OQ-RUN-006` | open-question | Sandbox request/lease/control/cleanup/orphan/reaper 与 Runtime readback 的 Runner-facing contract | PH-03 / `03-b/c` | Sandbox/Runtime owner | Unknown + RecoveryCase；不 replay/resend/reclaim | `03-c` 开工前 | `open / blocked` |
| `OQ-RUN-007` | open-question | 跨平台 host resource/port conflict、allocation、cleanup 和用户可见提示的责任边界 | PH-03/06 / `03-a`、`06-a` | 平台/Sandbox/产品 authority | Unknown/Conflict/Unsupported；不锁 OS 技术和数字 | `03-a` 开工前 | `open / blocked` |
| `OQ-RUN-008` | open-question | Observability safe diagnosis、redaction、handoff receipt、visibility/freshness/retention 的正式接缝 | PH-04/06 / `04-b` | Observability/安全 owner | bounded redacted surface；receipt 不等 evidence | `04-b` 开工前 | `open / blocked` |
| `OQ-RUN-009` | open-question | planned Consumer 的 header/schema/version/dedup/receipt 责任；确认 Runner outbound event=0 | PH-05 / `05-a` | L0-bus/SDK/event owner、架构 | header-first negative only；不 parse/hash/ACK | `05-a` 开工前 | `open / blocked` |
| `OQ-RUN-010` | open-question | 五个 Job 的 claim/checkpoint/replay/report 运行责任与 scheduler/operations authority | PH-05 / `05-b/c` | operations/infra authority | local-only planned；无 owner repair/replay | `05-c` 开工前 | `open / blocked` |
| `OQ-RUN-011` | open-question | 04 配置文档 selector、entry-local 参数、profile source 和 sensitive resolver 的实际 authority | PH-01/02 / `01-b` | 配置/架构/安全 owner | strict whole-document；禁止 env/CLI leaf override | `01-b` 提交前 | `open / blocked` |
| `OQ-RUN-012` | open-question | scripts/gates/checks/reports 的技术 authority、命令参数、scanner availability 和 report reviewer | PH-01/05/06 / `05-d` | 实施/测试/安全/验收 owner | 只保留逻辑合同；未核验不执行 | `05-d` 提交前 | `open / waiting` |
| `OQ-RUN-013` | open-question | target-tier、immutable baseline、fixed run、environment identity、GRC/review role 和 evidence retention | PH-06 / `06-a/b` | 产品/运维/GRC/验收 authority | `baseline_blocked/not_run`；不生成 handoff/verdict | `06-a` 开工前 | `open / blocked` |
| `OQ-RUN-014` | open-question | NFA/SLO/capacity/retention 的 workload、阈值、测量方法和是否 hard gate | PH-06 / release gate | 产品/架构/运维/验收 | 不填历史/README 数值；保持 exploratory/blocked | release handoff 前 | `open / blocked` |
| `OQ-RUN-015` | open-question | Archive 视图/恢复引用是否属于本轮 selected scope，以及其不影响 core success 的边界 | PH-04/06 / `04-b`、`06-b` | Archive/产品/验收 authority | peripheral Disabled/Blocked；不扩大 P0 | `04-b` 提交前 | `open / waiting` |
| `OQ-RUN-016` | open-question | 每个 boundary 的 design review、independent evidence review、risk/disposition owner 和权限来源 | PH-01～06 / 各 boundary | 项目/安全/测试/验收 authority | 角色未确认则不能 handoff/accept；不自签 | 对应 boundary Gate 前 | `open / waiting` |

### 5.4 上游设计回写与重开触发矩阵

| 触发条件 | 必须回写的 truth source | 必须同步的 07 产物 | 禁止的临时处理 |
|---|---|---|---|
| Command/Query/Consumer/Job 输入无法构造对象、view、receipt 或 report | `03-详细设计.md` 对应 object/protocol/flow/state Step | Step 6 boundary、Step 7 CUT/TC/gate、Step 9 Spike/risk | 实现者新增字段、默认值、字符串 ref 或隐式转换 |
| 新增/改变 state、transition、Unknown、RecoveryCase、claim/checkpoint 或 no-replay 语义 | `03` 状态、错误/恢复、UoW/幂等章节；必要时 06 | 受影响 phase/boundary、VETO/TX/AC mapping | 仅在代码中兼容旧状态，或把 Unknown 压成 Failed |
| 新 slot、profile、source、limit、feature、readiness 或 sensitive field | `04-配置设计.md` 及其 calibration | Step 8 matrix、Step 7 CFG/SECURITY gate、受影响 boundary | leaf override、hot reload、LKG、历史默认值或 fake product fallback |
| TC/CUT/suite/data/environment/evidence schema、分母或 blocker 分类变化 | `05-测试方案.md` 及 calibration | Step 7 gate matrix、phase/boundary owner、Step 9 risk | 直接改 07 映射、删除 blocked TC 或跨 run 补 evidence |
| AC/AR/TX/NFA/VETO、target tier、entry/exit、risk eligibility 变化 | `06-验收标准.md` 及 calibration | Step 7 mappings、Step 9 risk/residual、后续 Step 12 | 手写 verdict、风险签字绕过 VETO、降低 target tier 不重建 baseline |
| phase、commit boundary、required read、gate、ledger 或 handoff scope 变化 | 07 flow、相应 Step calibration、项目台账 | current step、next action、受影响 boundary table | 在正式 07 前创建 implementation ledger/skeleton 或跨 phase 偷渡 |
| Owner public contract/version/error/redaction/lease/transport 到达 | 对应上游项目正式文档及其台账；再回写 Runner 03/04/05/06 | SP 结果、dependency matrix、selected boundary 和回归 trigger | 复制 private implementation、猜 DTO/API 或直接关闭 blocker |

### 5.5 风险状态和停止规则

```text
open / planned
      | prerequisite or authority missing
      v
blocked / waiting  ---->  wait_design (truth source conflict or missing schema)
      |
      | approved Spike output + required review
      v
mitigating / recheck
      |
      +--> cleared_for_boundary (仅设计/依赖门禁，不等实现 pass)
      +--> reopened (baseline/seam/scope/authority 变化)
```

规则：

- `blocker` 未关闭时，受影响 boundary 不得提交或 handoff；只允许已定义的独立 negative lane。
- Spike 无明确输出、输出与 truth source 冲突或 reviewer 未确认时，保持 `blocked/waiting`。
- 设计冲突必须 `wait_design` 并回写 owning document；不得在风险表中自行选边。
- 上游 seam 到达后不自动清除风险：先重读、回写、建立新 baseline、更新 05/06 mapping，再按 Step 14 回归规则执行。
- 任何 VETO、P0 truth/security/dependency/config/evidence integrity finding 均不可通过风险接受；需修复并新 run。
- residual 只有在 06 eligibility、target-tier evidence、VETO clear、有权限 acceptor、明确 scope/期限/触发/closure 后才可进入实际风险裁决；当前没有任何实际接受记录。

## 6. Spike、风险和待确认事项停审与跨 phase/boundary 审计

### 6.1 停审记录

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 每个 Spike 是否有明确、可审查输出 | `pass`（计划层） | 12 项均要求矩阵、decision record、fixture、scan 或 dry-run report；当前均未执行 |
| Spike 是否绑定 phase、boundary 和截止点 | `pass` | §5.1 每项有影响范围和最迟关闭点 |
| blocker、implementation risk、residual 是否分离 | `pass` | §5.2 明确分类；当前 residual 仍 `not_accepted` |
| 风险是否有缓解、触发和截止点 | `pass` | 18 项均有处理与 gate/phase 截止 |
| 待确认事项是否长期悬空 | `pass` | 16 项均绑定 boundary、phase 或 release handoff；未关闭即 blocked/waiting |
| 设计回写触发是否完整 | `pass` | §5.4 覆盖 03/04/05/06/07 和上游 owner |
| 是否允许用 fake、风险签字或历史技术关闭 blocker | `pass` | 明确禁止；保持 SDK-first、no-private、no-fallback |

### 6.2 Phase 覆盖审计

| Phase | 主要 Spike | 主要风险 | 必须在进入下一阶段前关闭/处理 |
|---|---|---|---|
| `PH-01` | SP-001/002/003/004/010 | R-001/002/003/008/013/015 | 仓/authority、strict config、工具/路径和 evidence contract；否则停在 PH-01 |
| `PH-02` | SP-002/005 | R-003/004/005/008/015 | exact selector、Artifact/Governance/integrity seam；否则仅 negative/blocked |
| `PH-03` | SP-004/006/009/011 | R-002/006/007/011/016 | effect/readback/guard/lease/recovery/store；否则 Unknown/RecoveryCase |
| `PH-04` | SP-007/010 | R-003/007/009/012/017 | safe field/redaction/visibility/no-write/handoff；否则 blocked/no-content |
| `PH-05` | SP-008/009/010 | R-002/010/011/012/013 | header-first, local Job, report/check/event-zero；否则 negative/local-only |
| `PH-06` | SP-002/005/006/007/010/012 | R-003/004/005/006/007/013/014/018 | public seams、baseline、fixed run、GRC/review、same-run evidence；否则 `baseline_blocked/not_run` |

### 6.3 Boundary 覆盖审计

| Boundary 组 | 关键风险/Spike | 停止条件 |
|---|---|---|
| `commit-ph-01-a/b` | SP-001～004、R-001～003/008/013/015 | authority、config、tool/path 或 dependency 未闭合 |
| `commit-ph-02-a/b/c` | SP-002/005、R-003～005/008 | selector/qualification/SDK seam 未闭合或 fake 绕过 |
| `commit-ph-03-a/b/c/d` | SP-004/006/009/011、R-002/006/007/009/011/016 | state/effect/readback/store/guard/recovery 缺口，或 Accepted/Confirmed shortcut |
| `commit-ph-04-a/b/c` | SP-007/010、R-007/009/012/013/017 | safe field/redaction/no-write/read-section/pairing 缺口 |
| `commit-ph-05-a/b/c/d` | SP-008/009/010、R-002/010～013 | payload/ACK/cursor/owner repair/event/report/static evidence finding |
| `commit-ph-06-a/b` | SP-002/005/006/007/010/012、R-003～007/013/014/018 | authority/baseline/fixed run/review/pairing/retention 缺失 |

## 7. 回填草稿（未来正式 `07-实施计划.md` §9）

正式 §9 应保留以下结构：

1. **Spike 表**：承接 §5.1；每项列出输出、影响 phase/boundary、依赖、截止点和 `planned/blocked/waiting` 状态。
2. **风险表**：承接 §5.2；至少保留 `RUN-DDD-*`、`RUN-UP-*`、`RUN-OPS-*` 影响、Runner 专属 VETO/副作用风险、缓解和截止点。
3. **待确认事项表**：承接 §5.3；每项有 authority/owner、未确认前动作和最迟关闭点，禁止“后续确认”。
4. **设计回写与重开规则**：承接 §5.4～§5.5；任何 schema/state/config/test/acceptance/phase 变化必须先回写真相源并重审受影响 boundary。
5. **事实边界**：正式正文必须说明 Spike 未执行、风险未接受、目标仓/环境/baseline/run/evidence/verdict/signoff/readiness 未创建。

正式 §9 不应写入具体人员、日期、工单、commit hash、run_id、artifact digest、测试结果或风险签署。

## 8. 待确认与持续 blocker 摘要

| blocker/待确认组 | 当前影响 | 状态 | 后续重开入口 |
|---|---|---|---|
| `RUN-DDD-001~003` | 实现仓、技术栈、durable store 和物理测试无法启动 | `blocked` | SP-001/004；PH-01、`01-a`/`03-b` |
| `RUN-UP-001~008` | 正向 Artifact/Governance/Sandbox/Runtime/Obs/Archive/platform/SDK seam 无法证明 | `blocked/pending` | SP-002/005/006/007/011；相关 `02-c`～`06-a` |
| `RUN-OPS-001~002` | SLO/capacity/retention、真实 integration/GRC 和 release lane 无法裁决 | `blocked` | SP-012；PH-06、`06-a/b` |
| `RUN-DOC-003` | 正式 07/implementation ledger/boundary skeleton 尚未创建 | `open/blocking` | Step 13 full-restart；本 Step 不提前创建 |
| `05/06` truth source 变化 | 可能使 gate、TC、AC/VETO 和 evidence mapping 失效 | `waiting` | 先更新 owner 文档，再重审 Step 7/9 及受影响 boundary |

## 9. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| Spike 表完整且每项有明确输出 | `pass` | 12 项均有可审查输出和截止点 |
| blocker、risk、residual 分类清楚 | `pass` | 实施阻塞、边界风险和未来运维/验收 residual 分离 |
| 风险均绑定 phase/boundary/gate 和处理方式 | `pass` | 18 项均有影响、缓解、触发和截止点 |
| 待确认事项均有确认方和截止点 | `pass` | 16 项无无限期“后续确认” |
| 上游回写和重开规则明确 | `pass` | 03/04/05/06/07 与 owner seam 均有入口 |
| P0 红线不可由风险接受绕过 | `pass` | VETO/S/required positive、truth/security/evidence integrity 不可接受 |
| 当前未执行/未接受事实保真 | `pass` | Spike、risk acceptance、run、artifact/report/evidence、verdict/signoff/readiness 均未发生 |
| 可进入 Step 10 | `pass_for_step_10` | 下一步创建并完成 `07_implementation_plan_step_10_rollback_change_control.md`；正式 07、implementation ledger、boundary skeleton 仍禁止提前创建 |

## 10. Step 自审记录

| 自审项 | 结论 | 说明 |
|---|---|---|
| 是否只承接 00～06、Step 5～8 和上游 blocker | `pass` | 未新增业务需求、对象、协议、状态、配置或验收 authority |
| 是否参考可落码粒度并避免按文件拆 phase | `pass` | Spike/risk 绑定 capability/phase/boundary，不按源码文件拆分 |
| 是否保留 Runner 专属红线 | `pass` | no latest、SDK-first、no private、Query no-write、Consumer header-first/no-ACK、Job no-repair、event=0、same-run evidence |
| 是否区分 planned/blocked/waiting 与 executed/accepted | `pass` | 当前所有 Spike 未执行、风险未接受 |
| 是否满足 Step 文件独立结构 | `pass` | 状态、输入、SOP、诊断、对比、取舍、结构化产物、回填、待确认、门禁均存在 |

## 11. Step 结论与门禁

```text
current_document = 07-实施计划.md
current_step = 9
current_module = spikes_risks_open_questions
gate_status = completed / pass / self_reviewed
gate_reason = Spike、blocker/risk/residual、待确认事项、上游回写触发、phase/boundary 停止条件和风险接受边界已闭合；所有 Spike 未执行、风险未接受，目标仓、技术 authority、外部正向 seam、baseline、run 和证据实例仍保持 blocked/waiting/not_created。
next_allowed_action = create_and_complete_07_step_10_rollback_change_control
formal_07_write_allowed = false_until_step_13_assembly
implementation_ledger_allowed = false_until_step_13_assembly
implementation_write_allowed = false
test_execution_allowed = false
commit_required = false
```
