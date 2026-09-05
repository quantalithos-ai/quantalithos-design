# Step 11. 定义一票否决项

> 对应 SOP：standards/document/验收标准讨论流程_SOP.md Step 11
> 回填章节：06-验收标准.md §11
> 粒度参考：projects/L1-governance/design-calibration/06_acceptance_step_11_veto.md

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 11 定义一票否决项 |
| 当前状态 | 已完成；本轮连续授权并保留独立停审记录 |
| 输入基线 | 00 VF-L2M-001~009；00 AC-L2M-019~026；03 §5、§7、§9~§15；Step 6、8、10 |
| 输出文件 | projects/L2-member/design-calibration/06_acceptance_step_11_veto.md |

## 2. 本步目标

固定任何情况下都不得通过或有条件通过的架构、数据、安全、证据和事实等级问题。VETO 必须能回指正式红线、检查证据和 report path，且不能被风险接受覆盖。

## 3. 本步输入

| 输入 | 用途 |
|---|---|
| 00 VF-L2M-001~009 | 需求级一票否决候选 |
| 03 §5、§7、§9~§15 | 模块、协议、状态、事务、错误、配置、观测红线 |
| Step 6 | 数据边界与架构红线 |
| Step 8 | 状态 / 事务 / 一致性失败 |
| Step 10 | 证据真实性与 redaction gate |

## 4. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 哪些失败直接不通过？ | 核心主链断裂、错主语放行、member 自建 / 反写 foreign truth、forbidden body / secret 泄露、external success 伪装、任意外联、非 Core package、fake / blocked 伪通过、关键事实不可回链。 |
| 否决项来源是什么？ | 00 的 VF-L2M-001~009，并由 03 的 owner / state / protocol / redaction / dependency 契约具体化。 |
| 如何检查？ | 使用真实 contract / domain / service / entry / dependency / redaction / replay / report artifact 和 reports/runs/<run_id>、reports/acceptance/veto-checklist.md；设计阶段不产生实例。 |
| 是否允许风险接受？ | 不允许。VETO 命中只能是“不通过”；不能用 residual、owner 口头确认或 P1 unavailable 覆盖。 |
| 是否覆盖全部 P0 红线？ | 是，Step 6 的 AC-L2M-019~026、Step 8 一致性门禁、Step 10 证据门禁均至少关联一个 VETO。 |

## 5. 当前文档问题诊断

| 问题 | 处理 |
|---|---|
| 旧 06 只有三条抽象红线 | 改为 9 条稳定 VF，逐条给出触发条件、检查方式和路径 |
| 旧文档没有证据真实性否决 | 增加 planned / blocked / fake / static evidence 伪通过 VETO |
| VETO 与风险接受边界不清 | 明确 VETO / S / redaction / dependency / evidence integrity 不可接受 |

## 6. 改动前后对比

| 项 | 旧口径 | 新口径 |
|---|---|---|
| 否决项 | 可审计 / 可追踪 / 可裁剪口号 | VF-L2M-001~009 稳定条件与证据闭环 |
| 检查方式 | model review / trace 泛称 | 固定 TC / EV / artifact / report / checklist |
| 风险接受 | 未说明 | VETO 明确不可覆盖 |

## 7. 验收裁决取舍

| 议题 | 方案 | 结论 |
|---|---|---|
| VETO 是否允许有条件通过 | 允许 / 禁止 | 禁止 |
| fake / blocked 是否可作 VETO 未触发证据 | 可以直接写 / 仅可作为 disposition | 仅可作为 blocked / not_run 事实，不能证明未触发 |
| 缺少 artifact 时是否默认未触发 | 默认未触发 / 不可裁决 | 不可裁决，不能通过 |

## 8. 结构化中间产物

### 8.1 一票否决项表

| VETO ID | 否决项 | 正式来源 | 检查证据 / report path | 触发后裁决 |
|---|---|---|---|---|
| VF-L2M-001 | C1~C4 任一核心能力不成立，或 member 退化为透明转发 / 第二 Runtime 决策 owner | 00 AC-001~004、03 §5~§8 | EV-L2M-SMOKE-*、SERVICE-*；reports/runs/<run_id>/suites/local-smoke.md | 不通过 |
| VF-L2M-002 | 无效 / 冲突主语或语境被放行，以 GlobalMember / Workspace view 代执行主语，或 unknown 规则 fail open | 00 AC-006/010/019、03 §5/§9 | EV-L2M-CONTRACT-*、DOMAIN-*；contract-domain-fast.md | 不通过 |
| VF-L2M-003 | member 自建裁决 truth，或反写 Runtime / Governance / Conversation / Identity / Work / Bus / Observability truth | 00 AC-020/022/023、03 §5/§10 | EV-L2M-DEPENDENCY-*、SERVICE-*、PROJECTION-* | 不通过 |
| VF-L2M-004 | 入站正文 raw 持久化 / 投递，或运行结果、hidden reasoning、secret、definition body 进入记录 / 出站 / 观测 | 00 AC-025、03 §7/§14 | EV-L2M-REDACTION-*；redaction-check.md | 不通过 |
| VF-L2M-005 | delivery / observed / accepted、host acceptance / session / health 写成本地 truth，或 external failure 逆写本地事实 | 00 AC-003/008/013/020、03 §10~§12 | EV-L2M-ENTRY-*、REPLAY-*；service-flow-fast.md | 不通过 |
| VF-L2M-006 | 暴露通用外部监听面或任意直连 provider / MCP / A2A / API；正式 seam 不属于此条件 | 00 AC-020/029、03 §3/§5/§13 | EV-L2M-DEPENDENCY-*；dependency-boundary.md | 不通过 |
| VF-L2M-007 | 非 Core sibling 进入 package，或 pending host / Runtime / member-specific schema / route / rule / non-project subject 被伪装闭口 | 00 AC-026、03 §3/§7/§13 | EV-L2M-DEPENDENCY-*、OWNER-*；dependency-boundary.md | 不通过 |
| VF-L2M-008 | fake / planned / blocked / not_run 被伪装成 positive integration、evidence、verdict、signoff 或 readiness | 00 AC-033、05 §13 | EV-L2M-REPORT-*；report-audit.md、veto-checklist.md | 不通过 |
| VF-L2M-009 | 交互事实来源、结论或变化不能回链正式需求 / owner | 00 AC-004/014/021、03 §14 | EV-L2M-SERVICE-*、REPORT-*；evidence-index.md | 不通过 |

### 8.2 VETO 证据闭环矩阵

| VETO | 至少需要的真实证据 | 不足时 |
|---|---|---|
| VF-L2M-001 | local smoke + domain/service result + failure reason | 不可裁决 |
| VF-L2M-002 | double-anchor negative、unknown fence、contract report | 不通过或不可裁决 |
| VF-L2M-003 | dependency scan、no-write / no-repair、owner boundary report | 不通过或不可裁决 |
| VF-L2M-004 | redaction raw scan、artifact/report scan | 直接不通过 |
| VF-L2M-005 | state layering、feedback / unknown replay evidence | 不通过或不可裁决 |
| VF-L2M-006 | dependency / listener / adapter boundary scan | 直接不通过 |
| VF-L2M-007 | Core-only compile、candidate inventory、blocked seam report | 直接不通过 |
| VF-L2M-008 | artifact/report pairing、EV provenance、handoff review | 不通过或不可裁决 |
| VF-L2M-009 | trace / source / purpose / result chain | 不通过或不可裁决 |

### 8.3 VETO 停审与跨覆盖审计

| 审计项 | 结论 | 说明 |
|---|---|---|
| 9 条 VF 全部有正式来源 | 通过 | 来源为 00 AC/VF 与 03 契约 |
| 每条 VF 有检查证据与 path | 通过（规划） | 实例待真实执行 |
| VETO 不可被 risk acceptance 覆盖 | 通过 | Step 13 继续约束 |
| P0 红线无孤儿 | 通过 | AC-019~026、NFR、evidence 均有映射 |
| 缺 artifact 不默认未触发 | 通过 | 缺证据即不可裁决 |

## 9. 回填草稿

正式 §11 应写入 VF-L2M-001~009 表、检查路径、触发后“不通过”规则和不可风险接受说明。

## 10. 待确认事项

| 事项 | 影响 | 当前处理 |
|---|---|---|
| VETO checklist 审查人 | 真实验收 | 执行时指定 |
| 具体 scan 工具 | 实施细节 | 不在 06 固定产品 |
| owner selected-run 证据 | P1 seam | 不能覆盖 P0 VETO |

## 11. 进入下一步条件

- [x] VF-L2M-001~009 全部可检查且有正式来源。
- [x] VETO 与风险接受边界清楚。
- [x] 缺证据、静态证据和伪通过的处理可判定。
