# Step 6. 定义数据边界与架构红线验收

> 对应 SOP：standards/document/验收标准讨论流程_SOP.md Step 6
> 回填章节：06-验收标准.md §6
> 粒度参考：projects/L1-governance/design-calibration/06_acceptance_step_06_data_arch_redlines.md

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 6 定义数据边界与架构红线验收 |
| 当前状态 | 已完成；本轮连续授权并保留独立停审记录 |
| 输入基线 | Step 5；00 §10~§12、§14；01 §4/§8/§9；03 §5、§10、§13、§14；05 §5/§6/§13 |
| 输出文件 | projects/L2-member/design-calibration/06_acceptance_step_06_boundary_gate.md |

## 2. 本步目标

把数据所有权、local-truth-first、foreign truth 禁止事项、Query / projection / Job no-repair、body-free、依赖裁剪和 P1 防污染转成可检查的架构红线。红线失败时的裁决必须与 VF-L2M-001~009 一致。

## 3. 本步输入

| 输入 | 用途 |
|---|---|
| 00 §10~§12、§14 | 业务规则、数据归属、AC / VF |
| 01 §4、§8、§9 | owner 边界、依赖方向和一致性策略 |
| 03 §5、§10、§11、§13、§14 | 七模块、持久化、错误、配置、观测红线 |
| 05 §5、§6、§13 | TC / EV / redaction / dependency 证据入口 |

## 4. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 哪些数据不得由本仓保存？ | Runtime loop/context/plan/outcome、Tool execution / registry / definition body、host lifecycle / session / health / acceptance、image manifest / build truth、Governance approval/policy truth、Conversation / Artifact body、Bus delivery、Observability backend、Identity / Work lifecycle 等 foreign truth 或正文。 |
| 哪些下游不得反向改写真相？ | host、Runtime、Governance、Identity、Work、Tools、Conversation、Artifact、Bus、projection、summary、diagnostic 和 Job / report 均不得修改 member-owned source truth；它们只经正式 ref、safe result、attempt、gap 或 controlled seam 协作。 |
| 哪些 projection / cache 不得反写？ | CP06 mirror、CP07 summary / capability outlet、diagnostic、typed stored result、Query surface 和 Job report 都不能反写 CP01~CP06 source。 |
| 哪些 P1 不能污染 P0？ | real-like owner seam、durable Store、image / outlet positive activation、production-like profile、capacity / hard SLO 和非项目型 subject 只能 residual / selected-run。 |
| 红线失败是否一票否决？ | 命中 VF 或 S / security / dependency / truth boundary 时是；普通 P1 unavailable 仅记录 residual。 |

## 5. 当前文档问题诊断

| 问题 | 处理 |
|---|---|
| 旧 06 仅写 persona / endpoint 边界 | 改为 member truth、foreign truth、body-free、no-repair 和依赖红线 |
| 旧文档没有 Query / Job redline | 增加读取不写、投影单向、维护不修 source 的检查 |
| 依赖类型易被误写成 package | 明确仅 Core 为 compile candidate，其余按 runtime / event / ref / adapter / fake 分类 |

## 6. 改动前后对比

| 项 | 旧口径 | 新口径 |
|---|---|---|
| 数据边界 | “不存外部数据”泛化 | 逐类列出允许的 ref / safe view / marker 与禁止的 foreign truth / body |
| 红线 | 三项抽象口号 | AC-L2M-019~026 + VETO 关联 + 可检查证据 |
| 派生面 | 只读未定义 | projection / Query / Job / diagnostic 均明确 no truth repair |

## 7. 验收裁决取舍

| 议题 | 方案 | 结论 |
|---|---|---|
| 是否把所有外部 ref 视为依赖 | 是 / 按全局规则细分 | 按 compile、runtime、event、ref、adapter、fake 分类，不误要求源码依赖 |
| 是否允许 Query 修复 stale | 允许 / 禁止 | 禁止；Query 只返回安全 read-side posture |
| redaction 失败是否可风险接受 | 可 / 不可 | 不可；命中 VF-L2M-004 |

## 8. 结构化中间产物

### 8.1 架构红线验收表

| 红线 ID | 红线 | 通过条件 | 失败条件 | planned 证据 | 裁决影响 |
|---|---|---|---|---|---|
| AC-L2M-019 | 核心不变量 | 双锚、scope 来源、screening、controlled delivery、outbound anchor、derived-read only、open seam fail-closed 全部成立 | 任一不变量被绕过或默认放行 | EV-CAND-L2M-COMMON-001/008；EV-L2M-DOMAIN-* | 失败则不通过 |
| AC-L2M-020 | 禁止行为 | 错主语、allowlist、代答、盲重放、正文 / raw、外部反馈逆写、任意外联、派生反写均被拒绝或标记 | 任一禁止行为成功产生 truth / output | EV-CAND-L2M-COMMON-007；EV-L2M-REDACTION-* | 可能触发 VF-002~006 |
| AC-L2M-021 | 显式变化 | presence、scope、screening、delivery link、publication attempt、view invalidation 均经正式 successor / trace / version | 静默覆盖、无来源变更或旧记录原地更新 | EV-L2M-DOMAIN-*、EV-L2M-REPLAY-* | 失败则不通过 |
| AC-L2M-022 | foreign owner 外置 | Runtime、Tools、registry、host、image、Governance、Conversation、Artifact、Bus、Observability backend、Identity / Work lifecycle 均不由 member 拥有 | package / Store / record 中出现 foreign truth 或 body | EV-L2M-DEPENDENCY-*、EV-L2M-REDACTION-* | 命中 VF-003/007 |
| AC-L2M-023 | member truth 最小集合 | 仅保存 local presence、host 协作 local material / attempt、screening / delivery / outbound / trace / attempt / gap | 保存 host acceptance / session / health、Runtime outcome 或外部正文 | EV-L2M-CONTRACT-*、EV-L2M-SERVICE-* | 失败则不通过 |
| AC-L2M-024 | snapshot / ref 非第二真相 | 每个 ref 有 owner、scope、freshness、来源时点和解析失败姿态；只用于 safe view / local decision | snapshot 被当 current truth 或 stale 被静默清除 | EV-L2M-PROJECTION-*、EV-L2M-SERVICE-* | 失败则不通过 |
| AC-L2M-025 | body-free / sensitive boundary | 入站 body 只作授权瞬时检查；运行结果、hidden reasoning、secret、定义正文、完整日志不进入 persistence / output / telemetry | 任一 forbidden field 出现在 Store、log、metric、trace、report、outbound 或 artifact | EV-L2M-REDACTION-*；redaction-check.md | 一票否决 VF-L2M-004 |
| AC-L2M-026 | dependency classification | 仅 core-contracts 是 planned compile candidate；runtime / event / ref / adapter / fake 未伪装 package，24 candidate zero configuration | non-Core sibling package、event设施或 pending seam 被伪装闭口 | EV-L2M-DEPENDENCY-*；dependency-boundary.md | 一票否决 VF-L2M-007 |

### 8.2 不得由本仓保存的外部真相

| 外部 owner | 允许的最小形态 | 禁止保存 |
|---|---|---|
| L2-runtime | boundary ref、safe material ref、local attempt / gap | loop、context、plan、outcome、memory、checkpoint、run truth |
| L2-tools / Method | capability / definition ref、safe outlet view | registry、invocation、tool input/output、授权 |
| member-service | host ref、request / liveness / report material、local attempt | acceptance、session、health、container lifecycle、credential body |
| member-images | opaque pinned ref、availability / waiting | image build、manifest、digest、compatibility、release readiness |
| L1-identity / L1-work | GlobalMemberRef、ProjectMemberRef、safe resolution | 生命周期、credential issuance、work truth |
| L1-governance | policy safe snapshot、reason / freshness marker | policy / approval truth、allowlist、taxonomy 正文 |
| Conversation / Artifact | body-free safe material、formal ref | 正文、archive、evidence truth |
| L0-bus / observability | typed seam、local attempt / gap、safe telemetry | broker ack、topic / route、delivery / observed、backend truth |

### 8.3 跨红线审计

| 审计项 | 结论 | 说明 |
|---|---|---|
| data owner 与 03 / 05 一致 | 通过（设计级） | 仅 member-local 与支持 / 派生读模型 |
| Query / projection / Job no repair | 通过（规划） | 需真实 no-write / no-repair evidence |
| redaction / body-free | 通过（规划） | 执行前必须有 scan report |
| dependency classification | 通过（设计级） | Core-only compile candidate |
| P1/P2 防污染 | 通过 | selected-run / future 不进入 P0 pass |

## 9. 回填草稿

正式 §6 应写入 AC-L2M-019~026 红线表、不得保存数据清单、foreign owner 最小形态和跨红线审计口径。

## 10. 待确认事项

| 事项 | 影响 | 当前处理 |
|---|---|---|
| member-specific Core / Bus schema | 24 candidate | L2M-UP-005；zero configuration |
| credential / subject owner | CP01 positive | L2M-UP-006/008；fail closed |
| external body retention policy | redaction / archive | 仅保留 body-free 约束，后续 owner 确定 |

## 11. 进入下一步条件

- [x] 数据所有权和 foreign truth 禁止清单完整。
- [x] Query / projection / Job no-repair 和 body-free 红线可检查。
- [x] 依赖分类及 VETO 影响明确。
