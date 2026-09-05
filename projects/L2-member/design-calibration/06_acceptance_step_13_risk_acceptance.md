# Step 13. 定义风险接受与遗留项

> 对应 SOP：standards/document/验收标准讨论流程_SOP.md Step 13
> 回填章节：06-验收标准.md §13
> 粒度参考：projects/L1-governance/design-calibration/06_acceptance_step_13_risk_acceptance.md

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 13 定义风险接受与遗留项 |
| 当前状态 | 已完成；本轮连续授权并保留独立停审记录 |
| 输入基线 | 05 §14；Step 11 VETO；Step 12 缺陷 / 放行；项目 blocker 台账 |
| 输出文件 | projects/L2-member/design-calibration/06_acceptance_step_13_risk_acceptance.md |

## 2. 本步目标

定义哪些 residual 可以支撑“有条件通过”、哪些事项绝不能接受、每项风险必须具备哪些责任和证据字段。风险接受不是关闭 blocker，也不能替代 P0 设计 / 实现 / 证据。

## 3. 本步输入

| 输入 | 用途 |
|---|---|
| 05 §14.3 | L2M-UP / DDD / scope / performance / retention residual |
| Step 11 | VF-L2M-001~009 不可接受 |
| Step 12 | S/A/B 和放行规则 |
| project_execution_ledger.md §5 | 持续 blocker、owner 和当前处理 |

## 4. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 哪些风险可支持有条件通过？ | 不影响 P0 member-local truth / security / evidence 的 P1 selected seam unavailable、P2 future、无硬阈值性能 sample、长期 retention 或已限制的非 P0 A/B residual。 |
| 哪些不能接受？ | VETO、S、P0 AC 失败、redaction / dependency / evidence integrity、错主语、foreign truth 反写、Query / Job 越权、duplicate 分叉、缺 run / artifact / report；影响 P0 的 DDD gap 也不能接受。 |
| 接受人是谁？ | 由真实验收中的业务 / Owner、架构、测试、实施、运维 / 安全责任人逐项填写；本轮不伪造姓名。 |
| 后续动作和截止是什么？ | 每项必须有 issue / plan / ADR / owner-contract follow-up 及 date 或 trigger；没有则不能作为有条件通过依据。 |
| 是否同步到实施计划？ | 是。可接受 residual、阻塞项和关闭条件必须进入 07 的 planned / blocked / waiting ledger；当前不进入 07。 |

## 5. 当前文档问题诊断

| 问题 | 处理 |
|---|---|
| 旧 06 风险表只有“接受人”角色泛称 | 增加 risk_id、scope、impact、evidence、owner、acceptor、deadline / trigger、follow-up |
| 上游 blocker 易被写成已接受 | 明确 risk acceptance 不关闭 blocker；若影响 P0 仍必须不通过 / 暂停 |
| P1/P2 和 P0 缺口混在一起 | 分类：可接受 residual、条件性 residual、不可接受 blocker |

## 6. 改动前后对比

| 项 | 旧口径 | 新口径 |
|---|---|---|
| 风险接受 | TL / 架构“后续处理” | 逐项证据、责任人、接受人、期限和跟踪入口 |
| blocker | 可模糊延期 | 不关闭；影响 P0 时不得条件通过 |
| VETO | 未说明 | 明确绝不接受 |

## 7. 验收裁决取舍

| 议题 | 方案 | 结论 |
|---|---|---|
| 上游 seam 未闭合是否都可接受 | 都可 / 按 P0/P1 范围判定 | 按范围；P1 可 residual，P0 所需则阻断 |
| DDD helper gap 是否可接受 | 可 / 不可作为 P0 通过依据 | 不可；必须修复或正式裁剪对应 P0 surface |
| 无硬性能阈值 | 阻断 / 允许 sample residual | 允许 sample residual，但不得宣称达到 SLO |

## 8. 结构化中间产物

### 8.1 风险 / 遗留项表

| 风险 / 遗留项 | 当前 P0 影响 | 可否作为条件通过依据 | 后续动作 | owner / acceptor | 截止 |
|---|---|---|---|---|---|
| L2M-UP-001 host / IPC / credential exact contract | host positive selected-run；local boundary 可独立验 | 仅在 host positive 明确为 P1 时可 residual | 关闭 owner contract并运行 selected seam | member-service / identity owner；acceptor 待填 | <date-or-trigger> |
| L2M-UP-002 image release / compatibility | image / assembly selected-run | 仅 P1 scope 可 residual | 固定 manifest / compatibility / handoff并重验 | member-images owner；acceptor 待填 | <date-or-trigger> |
| L2M-UP-003 Runtime entry mapping | positive Runtime admission | 若发布范围要求真实 Runtime，则不可接受；仅 local P0 时可 residual | 固定 trigger / EntryAuthority mapping | Runtime owner；acceptor 待填 | <date-or-trigger> |
| L2M-UP-004 Runtime handoff / feedback | result / outbound / observation positive seam | 条件性；不得宣称 delivered / observed | 固定 source family / feedback contract并 selected-run | Runtime / Bus owner；acceptor 待填 | <date-or-trigger> |
| L2M-UP-005 member event schema / 24 candidate | 当前 P0 只要求 non-materialization | 可作为“事件发布不在本轮”的 residual；不得配置事件设施 | Core / Bus 正式合同后重开 03~06 | Core / Bus owner；acceptor 待填 | <date-or-trigger> |
| L2M-UP-006 credential / identity anchor | CP01 positive proof | 若 P0 admission 需要真实 proof 则不可接受 | 固定 owner / ref / validation contract | identity / host owner；acceptor 待填 | <date-or-trigger> |
| L2M-UP-007 screening taxonomy | positive allow lane | unknown / stale negative 可验；真实 allow 若为 P0 则不可接受 | 固定 safe result / taxonomy source | governance / security owner；acceptor 待填 | <date-or-trigger> |
| L2M-UP-008 non-project subject | 当前明确 future | 可 residual，前提是所有非项目 subject fail closed | 架构 /需求正式定义前保持拒绝 | architecture owner；acceptor 待填 | <date-or-trigger> |
| L2M-DDD-001 target repo / implementation missing | 无交付 / 无证据 | 不可；正式验收无法进入 | 实施授权后建立实现基线 | implementation owner | before acceptance |
| L2M-DDD-002 physical Store / UoW | durable / crash claim | logical P0 可 residual；若要求 durable readiness 则不可 | 选定产品并运行 durable qualification | architecture / implementation owner | <date-or-trigger> |
| L2M-DDD-003~007、scope_supersede_gap | 影响正式 receipt / CP04~CP07 / scope transition | 影响 P0 的 lane 不可接受 | 回开 owning Step，补 helper / schema / version后全量复验 | member design owner | before affected P0 acceptance |
| workload / SLO authority | 无硬性能结论 | 可 residual | 固定 workload、环境和阈值后 benchmark | product / QA / SRE | <date-or-trigger> |
| real-like compatibility | P1 产品行为 | 可 residual | owner-approved selected-run | release owner | <date-or-trigger> |
| evidence retention / archive | 长期审计 | 可 residual，验收期证据仍须完整 | 运维文档固定保留期 / 介质 | operations / compliance | <date-or-trigger> |

### 8.2 不可风险接受项

| 项 | 原因 |
|---|---|
| VF-L2M-001~009 | 一票否决不得覆盖 |
| S 级缺陷 | 破坏 P0 truth、安全、一致性或证据 |
| redaction / dependency / evidence integrity failure | 硬门禁 |
| 缺固定 run、artifact / report pair、VETO checklist | 验收不可裁决 |
| Query / Job / projection / report 反写 source truth | owner boundary 破坏 |
| external accepted / delivered / observed / healthy / ready 伪装 | truth layering 破坏 |
| 影响 P0 的 DDD helper / schema / version 缺口 | 无法 1:1 实现或验证 |

### 8.3 risk-acceptance 文件必填字段

| 字段 | 必填 | 说明 |
|---|---|---|
| risk_id | 是 | 稳定 ID |
| scope | 是 | P1 / P2 / future / non-P0 defect |
| impact | 是 | 对验收 / 下一阶段影响 |
| acceptance_reason | 是 | 为什么不影响 P0 |
| evidence_refs | 是 | 证明其为 residual 而非 VETO |
| owner | 是 | 后续动作责任人 |
| acceptor | 是 | 风险接受人 |
| deadline_or_trigger | 是 | 截止日期或触发条件 |
| follow_up_ref | 是 | issue / implementation plan / ADR / owner contract |

### 8.4 风险接受停审

| 审计项 | 结论 |
|---|---|
| 可接受 residual 与 P1/P2/future 匹配 | 通过 |
| VETO / S / P0 evidence gap 不可接受 | 通过 |
| owner / acceptor / deadline / follow-up 必填 | 通过 |
| blocker 未被标记关闭 | 通过 |
| 07 承接要求已定义但未提前进入 07 | 通过 |

## 9. 回填草稿

正式 §13 应写入 residual 表、不可接受项和 risk-acceptance 必填字段；明确当前所有接受人、期限和 evidence 仍待真实验收填写。

## 10. 待确认事项

| 事项 | 影响 | 当前处理 |
|---|---|---|
| 各 residual 的真实 acceptor | 有条件通过 | 未填写则不得有条件通过 |
| 哪些 owner seam 被提升为 P0 | 基线与 gate | 正式送验范围中明确 |
| 07 planned boundary | 后续实施 | 完成 06 后停审，等待用户授权 |

## 11. 进入下一步条件

- [x] 所有 residual 有分类和处理口径。
- [x] 不可接受项与 VETO / S / P0 红线一致。
- [x] 有条件通过所需的责任、证据和期限字段完整。
