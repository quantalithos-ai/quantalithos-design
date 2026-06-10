# Step 2. 明确验收目标与范围

> 对应 SOP: `standards/document/验收标准讨论流程_SOP.md` Step 2
> 回填章节: `06-验收标准.md` §2 验收目标与范围

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 2 明确验收目标与范围 |
| 当前状态 | 已完成;待用户审查 |
| 输入基线 | Step 1 输入映射;`00-需求文档.md` §14~§15;`05-测试方案.md` §2 / §14;`03-详细设计.md` public protocol 和 truth boundary |
| 输出文件 | `projects/L1-governance/design-calibration/06_acceptance_step_02_scope.md` |
| 停审方式 | 完成本 Step 后暂停,由用户审查后再进入 Step 3 |

## 2. 本步目标

定义新版 `06-验收标准.md` 本轮要裁决什么、不裁决什么,以及 P0 / P1 / P2 在验收结论中的地位。

本 Step 只回答:

- 本轮验收的核心裁决目标是什么。
- 哪些能力属于 P0 必须裁决范围。
- 哪些能力只验 runtime / event / adapter / handoff 接缝。
- 哪些能力属于 P1 / P2 residual 或 future,不作为当前 P0 通过前置。
- 哪些范围项可能成为一票否决。

本 Step 不固定送验版本、真实证据 run、单条验收项编号、通过 / 失败条件和最终结论。这些分别由 Step 3、Step 5~11 和 Step 14 收口。

## 3. 本步输入

| 输入 | 状态 | 本 Step 用途 |
|---|---|---|
| `06_acceptance_step_01_input_boundary.md` | 已完成 | 提供验收输入边界和旧 `06` 处理策略 |
| `00-需求文档.md` §14 | 已完成 | 提供 AC-GOV-001~031 和 VF-GOV-001~010 |
| `00-需求文档.md` §15 | 已完成 | 提供当前不阻塞项、后续阻塞项和外围增强边界 |
| `03-详细设计.md` §5~§16 | 已完成 | 提供 Command / Query / Consumer / Event / Job、truth、state、transaction、idempotency、observability 等验收契约来源 |
| `04-配置设计.md` §2 / §6 / §12~§14 | 已完成 | 提供 P0 profile、P1/P2 profile、配置不可越界和 future 触发项 |
| `05-测试方案.md` §2 | 已完成 | 提供 P0/P1/P2 测试范围、只测接缝能力和 VF 关联 |
| `05-测试方案.md` §14 | 已完成 | 提供 residual、不可风险接受项和必须转入新版 `06` 的事项 |

## 4. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 本轮验收的核心裁决目标是什么? | 裁决 `L1-governance` 作为治理决策与治理控制事实真相仓是否成立,并能否基于正式设计和测试证据阻断 VF-GOV-001~010。 |
| P0/P1/P2 验收范围如何划分? | P0 裁决 Governance truth center、正式对象、协议、状态、事务、幂等、配置、redaction、dependency、证据完整性和 no truth repair。P1 只裁决 real-like / durable-like / staging-like 接缝是否可选运行,不作为 P0 前置。P2 只记录生产、容量、高级 DSL / dashboard / external GRC 深度集成等 future 风险。 |
| 哪些下游能力只验接缝? | process、work、artifact/archive、identity、method-library、runtime/capability、conversation/workspace/console、observability、external GRC 均只验 ref / safe snapshot / event / adapter / handoff / disabled-or-controlled seam,不验对方内部 truth 或产品 UI。 |
| 哪些非范围会影响最终结论? | P1/P2 unavailable 不导致 P0 不通过,但若被误写成 P0 passed、或缺少 residual / risk acceptance,会影响有条件通过和送验交接完整性。P0 红线不允许风险接受。 |
| 哪些范围项可能成为一票否决? | C-GOV-1~5 断裂、相邻仓状态替代 Gate / Decision truth、外部正文入仓、Policy truth 被 runtime/method 反向定义、shared rules 被低 scope 覆盖、Decision 原地改写、AIIA / SoA 正文混入、Nonconformity 退化、query/job 反写真相、非 core sibling compile dependency。 |
| 哪些验收范围必须使用详细设计正式字段、状态或接口名? | 23 Command、14 Query、9 Consumer、12 Outbound Event、7 Operations Job、23 组状态机、accepted flow、query no-write、outbox stored payload、job report replay、reference/projection marker、config profile 和 redaction / observability surface。 |

## 5. 当前文档问题诊断

| 位置 | 当前问题 | 本 Step 处理 |
|---|---|---|
| 旧 `06-验收标准.md` §1~§7 | 范围仍围绕 GovernanceRequest / Gate / Decision / RiskAcceptance 旧主线 | 本 Step 用新版 Governance truth center、AC-GOV、VF-GOV、TC-GOV 和 EV-GOV 重定验收范围 |
| 旧 `06-验收标准.md` | 把 test / staging 级环境写成泛化验收基线 | 本 Step 明确 P0/P1/P2 分层,真实环境不作为 P0 前置 |
| 旧 `06-验收标准.md` | 缺少 Query / Consumer / Outbound Event / Operations Job / config / redaction / dependency / evidence 作为验收范围 | 本 Step 把这些纳入 P0 裁决范围 |
| `05-测试方案.md` | 已给出范围,但 `06` 需要转成裁决目标 | 本 Step 把测试范围转成验收范围项 |

## 6. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 核心裁决 | 审批接口 / 请求 / 风险接受主线 | Governance truth center 是否成立并阻断 VF-GOV-001~010 | 承接新版 `00`~`05` |
| P0 范围 | 旧核心场景 + 泛化非功能 | truth、protocol、state、command、query、consumer、event、job、config、redaction、dependency、evidence | 防止验收漏掉详细设计关键 surface |
| P1/P2 | 与 test / staging 混写 | P1/P2 只作 residual / future,不作为 P0 pass 前置 | 防止真实产品不可用阻塞 P0 或被伪造为 P0 |
| 下游能力 | 旧文档中容易写成 E2E 验证 | 只验接缝,不验相邻仓内部 truth | 保持仓级验收边界 |

## 7. 验收裁决取舍

| 议题 | 方案 | 取舍 |
|---|---|---|
| 是否按旧“功能/安全/红线”简单分组 | A. 继续旧分组;B. 按 truth / protocol / consistency / evidence 范围重建 | 采用 B。新版详细设计 surface 更宽,旧分组会漏掉 query/job/evidence 红线 |
| 是否把 P1 real-like selected-run 作为通过前置 | A. 是;B. 否 | 采用 B。当前 P0 使用 fake / controlled / disabled 证明正式语义;P1 只作 selected-run 或 residual |
| 是否把性能 P95/SLA 硬化 | A. 硬化;B. 只保留 sample / trend 和 `06` 待收口项 | 采用 B。当前无正式负载模型和阈值来源 |
| 是否验相邻仓内部生命周期 | A. 验;B. 只验接缝 | 采用 B。相邻仓内部 truth 属于对应仓验收 |

## 8. 结构化中间产物

### 8.1 验收目标

| 验收目标 | 来源 | 裁决口径 |
|---|---|---|
| 证明 Governance truth center 独立成立 | C-GOV-1~5;`01` truth boundary;`03` truth object | Governance context、Gate / Decision、Approval、Policy、Control、AIIA / SoA、Nonconformity、trace、outbox、report 按正式对象和 flow 成立 |
| 证明 VF-GOV-001~010 可被阻断 | `00` §14.2;`05` §2.5 | 任一 VETO 命中时不得通过;P0 红线不得风险接受 |
| 证明 public protocol 和状态 surface 可裁决 | `03` §7~§10;`05` §3 | 23 Command、14 Query、9 Consumer、12 Event、7 Job 和状态矩阵均有可追溯验收项 |
| 证明一致性、幂等和恢复不变式成立 | `03` §11~§13;`05` §6 / §14 | UoW、version、stored result / receipt / report、duplicate replay、commit unknown、race guard 和 no truth repair 成立 |
| 证明配置、redaction、dependency 和证据真实性成立 | `04`;`05` §8~§13 | P0 profile 可装配;invalid config fail-fast;no raw body;dependency boundary 和 evidence index 可审计 |

### 8.2 验收范围表

| 验收范围项 | 类型 | 优先级 | 裁决目标 | 非范围 / 说明 |
|---|---|---|---|---|
| Governance context / input 可裁决语境 | core truth | P0 | actor、scope、适用对象、治理目的、外部引用和输入状态能形成正式治理上下文 | 不验证相邻仓正文和完整生命周期 |
| Gate / Decision / Approval responsibility | core truth | P0 | 正式裁决、责任、投票、授权、替代裁决和不可原地改写成立 | process waiting、conversation card、work state 不可替代 |
| Policy effective fact / shared rules / conflict | core truth | P0 | Policy 生效、scope、priority、shared rules、冲突和自动化治理边界成立 | 不实现高级 Policy DSL 或 rule engine 产品 |
| Control applicability / review | core truth | P0 | Control 适用、复核、违反和整改关联成立 | 不保存 control definition 或标准正文 |
| AIIA / SoA conclusion | core truth | P0 | 治理评审、适用性、覆盖和批准结论成立且 body-free | 不验证 artifact 正文质量或生成文档 |
| Nonconformity corrective loop | core truth | P0 | 不符合、原因、纠正、复验和关闭形成治理闭环 | 不替代 bug、work blocker 或 observability alert |
| Command accepted flow | mutation protocol | P0 | accepted command 在同一 UoW 中按设计保存 truth、trace/audit/history、outbox、stale marker、stored result | 不验具体 DB 产品 |
| Query / projection read surface | read model | P0 | missing、not visible、degraded、stale、failed、empty page 和 query no-write 成立 | 不要求 query 自动修复 projection/reference/truth |
| Inbound external change consumers | event seam | P0 | snapshot/reference/stale marker/receipt/dead-letter/unsupported version 成立 | 不测试来源仓完整事件生成逻辑 |
| Outbound event and outbox publish | event seam | P0 | stored payload snapshot、topic map、publish failed / retry / dead-letter 成立 | 不要求真实 message product |
| Operations jobs | maintenance seam | P0 | publish、rebuild、refresh、reconcile、handoff、archive、external export report 和 duplicate replay 成立 | job 不作为业务 truth 修复入口 |
| Persistence / UoW / idempotency / concurrency | consistency | P0 | expected version、transaction order、stored result/receipt/report、commit unknown、race guard 成立 | 不指定真实 DB isolation 产品 |
| Config profile and runtime builder | config | P0 | `local-dev`、`ci-test`、`integration-like`、`operations-replay` 可验证;invalid config fail-fast | `staging-like` / `production-like` 不作为 P0 必过 |
| Redaction / observability | security / observability | P0 | raw body、secret、full sensitive ref 不进 log、metric、audit、trace、report、outbox | 不验证外部 observability 物理存储 |
| Evidence and report integrity | acceptance evidence | P0 | `EV-GOV-*` 可回指 TC、suite、artifact、report、AC/VETO;无静态造证据 | 不填写实际执行结论 |
| Durable store / real bus / real-like resolver | product seam | P1 | 验证 adapter seam、failure mapping、topic completeness 和 no silent fallback | 不作为 P0 truth center 成立前置 |
| Production-like runtime / capacity / SLO | operations | P2 | 后续基于真实产品、负载模型和运维约束验证 | 当前只保留候选和风险 |
| Advanced Policy DSL / complex Gate / automatic drafting / deep external GRC | peripheral enhancement | P2 | 后续验证不破坏 Governance truth | 当前不作为核心闭环成立条件 |

### 8.3 只验接缝的下游 / 外部能力

| 下游 / 外部能力 | 本轮验收内容 | 不裁决内容 | 裁决影响 |
|---|---|---|---|
| `L1-process` | process context ref、waiting / decision consumption event、no process truth persisted | ProcessInstance / Activity / waiting gate 内部状态机 | 接缝失败可阻断相关 P0;真实 process 差异留 P1 |
| `L1-work` | work governance context ref、work view stale、decision consumption boundary | Project / WorkItem / Iteration / blocker lifecycle | 接缝失败可阻断相关 P0;真实 work lifecycle 留 P1 |
| `L1-artifact` / `L4-archive` | artifact / evidence refs、archive handoff marker、no package body | artifact body validation、archive package restore | body 入仓触发 VETO;真实 restore 留 P1/P2 |
| `L1-identity` | actor capability snapshot、responsibility actor ref、dedup / degraded | member lifecycle、authn / authz backend | capability snapshot 接缝失败阻断相关 P0 |
| `L3-method-library` | method policy / control snapshot、definition ref、unavailable marker | method body、Policy DSL、standard text | method body 入仓或反定义 Policy 触发 VETO |
| `L2-runtime` / `L3-capability-hub` | runtime signal ref、policy consumption boundary、no runtime body | tool execution、agent loop、capability registry | runtime cache 反定义 Governance truth 触发 VETO |
| `L1-conversation` / workspace / console | display context ref、trace / decision view consumption boundary | UI state、card rendering、accessibility | UI / card 替代 Decision truth 触发 VETO |
| `L4-observability` | alert summary ref、safe diagnostic ref、redaction scan | physical log store、metric backend、trace storage | raw body/secret 泄漏触发 VETO |
| external GRC | disabled / fake / controlled export boundary、no truth source | vendor schema、external workflow、credential rotation | external GRC 定义 Governance truth 触发 VETO |

### 8.4 P0 / P1 / P2 裁决口径

| 优先级 | 验收裁决地位 | 证据要求 |
|---|---|---|
| P0 | 必须有明确通过 / 失败条件;失败或 VETO 命中时不得通过 | 必须闭环到 `TC-GOV-*`、`EV-GOV-*`、report path 和 raw artifact |
| P1 | 不作为当前 P0 通过前置;可作为 selected-run 或 residual 记录 | 可进入 evidence index,但必须标记 non-P0 / unavailable / residual |
| P2 | 不作为当前验收通过前置;仅作为 future risk / operations readiness 输入 | 进入风险接受或后续 `09` / ADR / future test plan |

### 8.5 范围项到一票否决候选

| VF | 对应范围项 | 一票否决方向 |
|---|---|---|
| VF-GOV-001 | C-GOV-1~5;core truth;protocol;job | 任一核心闭环无法成立 |
| VF-GOV-002 | Gate / Decision;process/work/conversation/runtime seam | 相邻状态或 UI 替代 Decision truth |
| VF-GOV-003 | artifact/evidence/method/runtime/observability/external GRC boundary;redaction | 外部正文进入 truth、outbox、audit、trace、report |
| VF-GOV-004 | Policy effective fact;runtime/method boundary | runtime cache、capability whitelist、method definition 反向定义 Policy truth |
| VF-GOV-005 | shared rules;scope hierarchy | 低 scope 覆盖组织级硬约束 |
| VF-GOV-006 | Decision state/history;consistency | 正式裁决原地改写,无新事实 |
| VF-GOV-007 | AIIA / SoA conclusion;artifact boundary | 治理结论与正文脱锚或保存第二份正文 |
| VF-GOV-008 | Nonconformity corrective loop | 不符合退化为 bug、work blocker、alert 或备注 |
| VF-GOV-009 | Query/projection/reconciliation/handoff/job | 读或维护动作隐式创建、修改、批准或关闭 truth |
| VF-GOV-010 | dependency boundary | 非 `L0-core` sibling compile-time business dependency |

## 9. 回填草稿

> 校准来源:
> - `design-calibration/06_acceptance_step_02_scope.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“验收目标”“验收范围表”“只验接缝的下游 / 外部能力”“P0 / P1 / P2 裁决口径”和“范围项到一票否决候选”小节,了解验收目标与范围如何收敛。

正式 `06-验收标准.md` §2 应回填:

- 本轮验收目标是裁决 `L1-governance` 作为治理决策与治理控制事实真相仓是否成立,并能否阻断 VF-GOV-001~010。
- P0 覆盖 Governance truth、public protocol、command/query/consumer/event/job、状态矩阵、UoW/idempotency、配置、redaction、dependency 和证据真实性。
- P1 仅作为 real-like / durable-like / staging-like selected-run 或 residual,不作为当前 P0 通过前置。
- P2 包含 production-like、capacity、advanced Policy DSL、complex Gate、automatic drafting、deep external GRC、dashboard / analytics 等 future 能力,不参与当前通过条件。
- process、work、artifact/archive、identity、method-library、runtime/capability、conversation/workspace/console、observability、external GRC 只验正式接缝,不验对方内部 truth。
- 凡命中 VF-GOV-001~010 的范围项均不得风险接受。

## 10. 待确认事项

| 待确认事项 | 影响 | 当前处理 |
|---|---|---|
| P1 selected-run 是否在某个 release candidate 中强制 | 影响 Step 13 风险接受和 Step 14 最终结论 | 当前不作为 P0 前置;后续 Step 13 / `06` 风险接受表承接 |
| 性能 hard threshold 是否硬化 | 影响 Step 9 非功能门禁 | 当前只保留 sample / trend;没有正式阈值不裁决 pass/fail |
| production-like / real adapter certification 是否升级 | 影响 P1/P2 范围 | 当前作为 future / residual,需后续 ADR / 配置 / 运维文档收口 |

## 11. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| 验收目标可裁决 | 通过 | 目标聚焦 Governance truth center 和 VF-GOV 阻断 |
| P0/P1/P2 边界明确 | 通过 | P1/P2 不作为当前 P0 通过前置 |
| 只验接缝的下游能力已列出 | 通过 | 见 §8.3 |
| 一票否决候选已关联范围项 | 通过 | 见 §8.5 |
| 可进入 Step 3 | 通过 | 下一步固定验收基线;进入前等待用户审查 |
