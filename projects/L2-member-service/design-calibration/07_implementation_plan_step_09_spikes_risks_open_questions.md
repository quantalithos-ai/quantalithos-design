# Step 9. 定义 Spike、风险与待确认事项

> 对应 SOP：standards/document/实施计划讨论流程_SOP.md Step 9
> 本步状态：completed / pass_with_upstream_blockers
> 回填目标：正式 07-实施计划.md §9

## Step 状态

| 项 | 结论 |
|---|---|
| gate_status | completed / pass_with_upstream_blockers |
| current_module | spikes_risks_open_questions |
| next_allowed_action | Step 10 rollback_pause_change_control |
| implementation_allowed | false |

## 本步输入

Step 1 的输入 blocker、Step 5 phase/boundary 顺序、Step 8 依赖矩阵，以及 03/04/05/06 的高风险切口。

## SOP 问题回答

Spike 只针对会影响设计闭环、boundary、门禁或证据真实性的事项；每个 Spike 必须有可审查输出和截止 boundary。风险按 blocker、P0 residual、P1/P2 future 分类；待确认事项必须绑定 owner、截止点和未关闭姿态。目标仓不存在、exact contract 缺失、redaction leak、dependency 越界、静态 evidence、Query 写入、Job 修复 truth 等事项都是硬 blocker，不得以“后续确认”继续编码。

## 当前文档问题诊断

旧计划常把“技术调研”列成无截止点的待办，或把未闭合合同留给实现者决定。这里将 Spike 限定为设计门禁输出，将开放项绑定到具体 boundary 和回写目标。

## 改动前后对比

| 方面 | 改动前 | 改动后 |
|---|---|---|
| Spike | 泛化调研，无输出 | 每项有 dry-run / matrix / checklist |
| 风险 | 只写描述 | 绑定影响 phase、owner、处理和截止点 |
| 待确认 | 无期限 | blocker / waiting / residual + 明确触发 |

## 设计取舍

- 不把真实 provider 探索当成 P0 实现前置，除非其结果改变 boundary 或 gate。
- 对跨仓合同采用“合同闭合 Spike”，不由本仓复制对端模型。
- 所有 P1/P2 只进入 residual/future，不改变 P0 完成条件。

## 结构化中间产物

### Spike 表

| ID | Spike | 影响 boundary | 输出 | 截止点 | 失败姿态 |
|---|---|---|---|---|---|
| SP-MS-001 | target repo bootstrap dry-run | commit-01-a | workspace/path/naming checklist | PH-01 开工前 | blocked / wait_design |
| SP-MS-002 | config profile 与 builder negative smoke | commit-01-b | parse/validation report | commit-01-b 提交前 | config gate failed |
| SP-MS-003 | local UoW/CAS/idempotency crash-window dry-run | commit-02-c | write-set / replay checklist | commit-02-c 开工前 | 回写 03 |
| SP-MS-004 | member/images/runtime/sandbox mapper seam review | commit-02-b、03-b、05-a | typed mapper matrix | 对应 boundary 开工前 | blocked / placeholder |
| SP-MS-005 | cursor separation与projection rebuild dry-run | commit-06-a/b | source/cursor/rebuild matrix | commit-06-b 开工前 | no-write/cursor blocker |
| SP-MS-006 | Core/Bus candidate与feedback-layer dry-run | commit-07-a/b | envelope/receipt gap list | commit-07-a 开工前 | event integration blocked |
| SP-MS-007 | job stored report duplicate replay | commit-07-c | selector/report replay checklist | commit-07-c 开工前 | job gate failed |
| SP-MS-008 | report generator no-static-evidence dry-run | commit-08-a/b | pairing/audit dry-run report | commit-08-a 提交前 | release blocked |

### 风险表

| ID | 风险 | 等级 | 影响 | 处理 | 截止 |
|---|---|---|---|---|---|
| R-MS-001 | 目标实现仓 absent | blocker | 全部代码 boundary | 创建或等待；不在设计仓写源码 | commit-01-a |
| R-MS-002 | Core/Bus exact schema/receipt 未闭合 | blocker | PH-07/08 正向集成 | candidate、local marker、fail-closed | commit-07-a |
| R-MS-003 | Member/Images/Runtime/Sandbox mapper 未闭合 | blocker | PH-02~05 正向 seam | typed ref/safe summary/blocked | 对应 boundary |
| R-MS-004 | cursor exact type 与 lease 产品未闭合 | blocker | PH-02/06/07 consistency | 保持语义分离，回写 03 | commit-06-b |
| R-MS-005 | durable store / publisher / observability backend 未锁定 | P0 evidence blocker / P1 product residual | rollback、delivery、运维证据 | fake + selected-run residual | PH-08 |
| R-MS-006 | 配置默认值、credential owner、policy transfer owner 未闭合 | blocker | config/readiness/recovery | 04 typed binding + blocked | 相关 boundary |
| R-MS-007 | static evidence 或 raw body 泄漏 | VETO | 送验不可裁决 | redaction/report audit hard stop | PH-08 |
| R-MS-008 | Query 写入或 Job truth repair | VETO | 架构红线破坏 | 立即暂停并回写 03/05/06 | 任一发现即停 |

### 待确认事项表

| OQ | 内容 | owner | 截止点 | 未确认前 |
|---|---|---|---|---|
| OQ-MS-001 | Core compile target 与 shared crate | L0-core / design owner | PH-01 | 不写真实 path dependency |
| OQ-MS-002 | L0-sdk 准确 target / self-test | L0-sdk | PH-01/08 | 不宣称 compile/readiness |
| OQ-MS-003 | Member register/heartbeat exact contract | L2-member | PH-03/04 | placeholder/waiting |
| OQ-MS-004 | Images pinned manifest/digest consumer contract | L2-member-images | PH-02/03 | qualification blocked |
| OQ-MS-005 | Runtime host/session trigger surface | L2-runtime | PH-03/07 | session/feedback unknown |
| OQ-MS-006 | Sandbox bind/release caller与字段 | L4-sandbox | PH-02/05 | local attempt + gap |
| OQ-MS-007 | policy transfer与credential owner | Governance/Identity/design owner | PH-02/03 | opaque ref + blocked |
| OQ-MS-008 | durable store、DLQ、observability provider | infra/ops owner | PH-06~08 | fake/selected residual |

### 跨风险审计

| 审计项 | 结论 |
|---|---|
| 每个 Spike 有输出与截止点 | pass-designed |
| blocker 绑定 boundary | pass-designed |
| P1/P2 未误入 P0 | pass-designed |
| 设计回写目标明确 | pass-designed |

## 回填草稿

正式 §9 应采用 Spike、风险、OQ 三表，明确 hard blocker 和截止点；不得使用“后续确认”作为无期限继续条件。

## 待确认事项

本步列出的 OQ 需由对应 owner 在 implementation activation 前重新确认；当前均未被本轮设计仓代为关闭。

## 进入下一步条件

Spike、风险和 OQ 均有 owner、输出/处理与截止点，允许进入 Step 10 回退、暂停与变更控制。
