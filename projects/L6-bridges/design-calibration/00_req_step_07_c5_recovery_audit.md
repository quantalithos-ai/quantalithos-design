# C-BR-5：失败恢复与安全追溯成立

> 00 Step7当前单元；design_self_review=pass；C4已停审；非用户/owner signoff。

## 1. 来源与职责

C1~4、平台附录§5、Conversation幂等/结果读取、Workspace gap边界、Observability00 §11/12及实施台账。只修本仓cursor/dedup/mapping/attempt/receipt与handoff局部状态，不补修来源事实、Bus投递或平台数据。

## 2. 问题、诊断与取舍

跨边界unknown无法通过“再发一次”消除。采用按namespace记录幂等、受控gap与对账、body-free材料交接；不采用全局external_id去重、时间戳总序、无界重试、raw消息回放仓或本地生成成功evidence。

## 3. 故事目标与能力主题

恢复维护者需要定位失败并在不重复效果下恢复；审计者需要来源、授权、阶段和处理缺口可追溯。主题：幂等/cursor/gap，顺序/限流/安全retry，回放/重建/人工对账，安全审计交接，局部no-write状态读取。

## 4. 幂等与 cursor 语义

| namespace | 稳定语义键 | 不得混同 |
|---|---|---|
| binding management | 管理operation+scope+期望generation | 管理请求不等于平台grant |
| inbound | platform+installation+source stream/epoch+operation identity | message locator不是每次edit唯一事件 |
| callback | installation+interaction/action identity+bound target | 显示按钮文字/用户自报角色不构成键 |
| outbound | committed source/ref version+binding generation+target+operationkind+允许projection版本+logical effect identity | 每次attempt、credential rotation不能成为新effect |
| recovery/audit | original operation/intent+恢复授权operation或handoff identity | 重放不是重新授权或重新提交truth |

同键同语义复用结果；同键不同target/material语义conflict；多调用方竞争只能形成一个局部effectclaim。消息正文hash不得作为公开幂等/审计材料。固定key编码、canonicalization与持久事务schema在03按此语义收口，不向实现端留猜测。

cursor必须包含source namespace+stream/session/epoch+position/comparator依据；接收checkpoint、owner处理checkpoint与外部效果checkpoint各自独立。无comparator保opaque/incomparable；gap只可由正式replay/baseline证明覆盖后关闭。Slack时间戳不证明完整交付，MMsession seq不得假定可无限续接，Telegramoffset不得掩盖update缺失，Discordsequence只在可resume的session内有效。explicit discard/rejected是处理disposition，不是业务accepted。

## 5. rate-limit、恢复与 secret continuity

限流按平台真实namespace/bucket、HTTPmethod/majorresource和当前header；遵守Retry-After/retry_after下界，退避/抖动/预算不能越限或无限自动retry。存在明确无副作用证明才重试；网络超时、未知服务结果、dispatching崩溃/lease失效都不作无效果证明。

有权威operation/result query或平台幂等/probe合同才自动对账；否则indeterminate/manual。所有probe/恢复也需当前授权。不能更换target/binding/logical effectidentity掩盖旧unknown；credential合法轮换也不得造成新effect或绕过撤销。binding恢复不自动重发旧intent。

回放只读原source或正式baseline，通过获准安全ref重解析；ref过期/已删除/不被授权则blocked/missing_source/gap。重建只修本仓mapping/cursor，不触发新内部提交或外部效果；要补效果必须显式恢复授权与同effect continuity。去重留存要覆盖获准重放窗口；窗口不明或记录已过期则禁止自动重放，不假设永久保留。每次恢复记录来源/basis、影响范围和局部结果。

## 6. 审计、证据与查询

允许材料：安全correlation/ref、operation/attempt类别、basis/config/capability版本、有限reason与gap/receipt摘要、handoff ref。禁止消息/文件body、OAuthcode/token/secret、interaction context/responseURL、敏感审批存在性/正文、raw平台error、带凭证URL及可还原敏感正文的日志字段。external ID限授权局部locator，不作公开metrics高基数label。

本仓拥有handoff intent及本地attempt，不拥有Observability accepted disposition或evidence/verdict；接收不可用可在获准预算内保body-free backlog，达到强制审计准入限制就暂停相应操作。查询no-write，不顺便刷新source、推进cursor、重放或修mapping；维护动作是独立显式变更。

## 7. 质量、验收与blocker

切口：同键冲突/并发、cursor跨epoch、gap中后续事件、429、无界backlog、commit/dispatch未知、ref到期、去重过期、audit不可用、查询副作用。否决：unknown盲重试、越gap complete、读取改变truth、secret/body泄漏、伪造run/receipt/evidence/signoff。

BR-UP-001/005/006/007/008/009仍open。进入需具体operation、cursor或gap、安全材料与恢复basis；退出明确reconciled/blocked/indeterminate/missing_source及安全记录，handoff成功须真实consumer结果。

## 8. 停审

幂等、位置比较、恢复授权、unknown、留存与材料边界明确；C2~4保护没有因节点顺序推迟；没有平台/owner修复权。允许Step7跨节点审计。
