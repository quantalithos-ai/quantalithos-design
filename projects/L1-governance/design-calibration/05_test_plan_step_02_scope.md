# Step 2. 明确测试目标、范围和非范围

> 对应 SOP: `standards/document/测试方案讨论流程_SOP.md` Step 2
> 回填章节: `05-测试方案.md` §2 本次测试目标与范围

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 2 明确测试目标、范围和非范围 |
| 当前状态 | 已完成;待用户审查 |
| 输入基线 | Step 1 输入边界;新版 `00/01/02/03/04`;`03_ddd_step_16_test_cuts.md` |
| 输出文件 | `projects/L1-governance/design-calibration/05_test_plan_step_02_scope.md` |
| 停审方式 | 完成本 Step 后暂停,由用户审查后再进入 Step 3 |

## 2. 本步目标

定义本轮测试要证明什么、覆盖什么、不覆盖什么,并把 P0 / P1 / P2 的优先级口径固定下来。

本 Step 只回答:

- P0 必须通过哪些测试才能证明 Governance 主链成立。
- P1 / P2 是否只做边界验证或延后。
- 哪些下游能力只测接缝,不测试对方完整实现。
- 哪些非范围仍有残余风险。
- 哪些范围项和一票否决项直接相关。

本 Step 不展开完整测试对象清单、用例矩阵、数据集、环境拓扑、CI job、evidence ID 或验收裁决。这些分别由 Step 3~14 承接。

## 3. 本步输入

| 输入 | 状态 | 本 Step 用途 |
|---|---|---|
| `05_test_plan_step_01_input_boundary.md` | 已完成 | 固定输入权威顺序、旧 `05/06` 地位和无阻塞结论 |
| `00-需求文档.md` §7 / §9 / §10 / §13 / §14 | 正式输入 | 固定 C-GOV、FR-GOV、BR-GOV、AC-GOV、VF-GOV 和非功能范围 |
| `01-架构设计.md` §4 / §8 / §9 / §13 / §14 / §15 | 正式输入 | 固定 truth boundary、依赖裁剪、正文排除、派生不反写和产品中立 |
| `02-概要设计.md` | 正式输入 | 固定测试应覆盖的主要组成部分、关键对象、接口骨架、状态和异常主线 |
| `03-详细设计.md` §5~§16 | 正式输入 | 固定模块、协议、flow、状态、事务、错误、幂等、配置、观测和最小测试切口 |
| `04-配置设计.md` §2 / §6 / §8 / §9 / §11 / §12 | 正式输入 | 固定 profile、config fail-fast、secret / redaction、adapter failure 和配置门禁范围 |

## 4. SOP 问题回答

| 问题 | 回答 |
|---|---|
| P0 必须通过哪些测试才能证明主链成立? | P0 必须证明 C-GOV-1~C-GOV-5 成立:治理语境和输入能形成可裁决上下文;Gate / Decision / Approval 形成正式裁决;Policy / shared rules / Control 适用成立;AIIA / SoA 和 Nonconformity 闭环成立;治理事实能被消费、追溯、发布、维护和归档准备。测试必须覆盖 23 Command、14 Query、9 Consumer、12 Outbound Event、7 Job 的最小正向和异常切口,以及 state matrix、UoW、outbox snapshot、duplicate replay、query no-write、job no truth repair、redaction no-output 和 P0 profile config。 |
| P1 / P2 是否只做边界验证或延后? | 是。P1 只做 staging-like、durable-like、real-like bus / resolver / handoff / external GRC fake-to-real 接缝验证,不要求真实产品闭环成为 P0 必过。P2 只保留生产优化、多区域、多租户、高级 DSL、复杂 Gate、自动草拟、外部 GRC 深度集成、容量和性能健康度方向,不进入当前必过范围。 |
| 哪些下游能力只测接缝,不测对方完整实现? | process、work、artifact、identity、conversation、method-library、runtime、capability-hub、observability、archive、workspace / console、external GRC 均只测 Governance 的 ref / snapshot / safe summary / event / handoff / adapter 接缝和边界断言,不测试相邻仓内部状态机、UI、物理 ledger、archive package body 或外部系统业务语义。 |
| 哪些非范围有残余风险? | 不测真实 DB / bus / search / object storage / secret provider / external GRC 产品会留下产品适配风险;不测生产容量和硬 SLO 会留下性能容量风险;不测相邻仓完整端到端会留下跨仓真实集成风险;不测高级 DSL、复杂评审、自动草拟会留下外围增强风险。这些不影响 P0 truth center 通过,但必须进入 P1/P2 或残余风险。 |
| 哪些范围项是一票否决相关? | P0 中任何导致 VF-GOV-001~010 命中的范围项都与一票否决相关:核心闭环断裂、相邻仓状态替代 Decision truth、外部正文入仓、Policy truth 被 runtime / method 反向定义、shared rules 被低 scope 覆盖、正式裁决原地改写、AIIA / SoA 正文混入、Nonconformity 退化、query / report / job / handoff 反写真相、非 core sibling 编译期依赖。 |

## 5. 当前文档问题诊断

| 位置 | 当前问题 | 本 Step 处理 |
|---|---|---|
| 旧 `05-测试方案.md` §1~§3 | 旧范围围绕 request / decision / risk acceptance 少量主线,未覆盖新版 `03` 的模块、协议、job、配置和观测范围 | 不继承旧范围,重新按新版 `00`~`04` 定 P0 / P1 / P2 |
| 旧 `06-验收标准.md` | 旧验收以旧测试范围为基线,不能直接裁决新版 P0 | 本 Step 只保留验收方向,后续 evidence 和 veto 由新版 `05/06` 闭合 |
| `03-详细设计.md` Step 16 | 给出最小测试切口,但未定义 P0 / P1 / P2 范围和非范围 | 本 Step 将 Step 16 test cuts 收束成范围优先级 |
| `04-配置设计.md` | 已定义 P0 profile 与 P1/P2 future profile,但未纳入测试范围 | 本 Step 把 local-dev / ci-test / integration-like / operations-replay 定为 P0 配置测试范围 |
| 产品未锁定 | 真实 DB / bus / external GRC 不能作为当前必过 | 定为 P1/P2 接缝或残余风险,不阻塞 P0 |

## 6. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 测试目标 | 旧草稿强调 request / decision / emission 主线 | 改为证明 C-GOV-1~C-GOV-5 与 `03` 全协议 / 状态 / 一致性 / 配置切口成立 | 覆盖新版设计主链 |
| P0 范围 | 未系统覆盖 consumer、outbound、job、projection、reference、config、redaction | 明确全部进入 P0 最小验证范围 | 这些是正式设计闭环和验收红线的一部分 |
| P1 / P2 | 旧草稿含 staging / real-like 方向但未分层 | 明确 P1/P2 不阻塞 P0,只做接缝验证或后续演进 | 避免产品未锁定阻塞测试方案 |
| 非范围 | 旧草稿只列 UI 和相邻仓内部 | 增补真实产品、生产容量、高级 DSL、复杂 Gate、external GRC 深度集成等非范围 | 对齐 `00/01/04` 的外围增强和产品中立 |
| 一票否决 | 旧草稿没有映射 VF-GOV | 明确 P0 红线和 VF-GOV-001~010 关联 | 方便后续 Step 5 / Step 13 / `06` 追溯 |

## 7. 测试设计取舍

| 议题 | 方案 | 取舍 |
|---|---|---|
| P0 是否只测核心 Command happy path | A. 只测主线 Command;B. 覆盖协议、状态、一致性、配置和观测最小切口 | 采用 B。否则无法证明 VF-GOV 红线和详细设计闭环 |
| P0 是否要求真实相邻仓 | A. 要求真实集成;B. 使用 ref / snapshot / event / adapter fake 或 controlled seam | 采用 B。相邻仓完整实现不是 Governance P0 真相证明前置 |
| P0 是否要求真实外部 GRC | A. 要求真实 GRC;B. disabled / fake / controlled export boundary | 采用 B。external GRC 不定义 Governance truth |
| P1/P2 是否进入当前硬验收 | A. 全部进入;B. 只作为边界验证和残余风险 | 采用 B。外围增强不能阻塞 C-GOV 主链 |
| 性能是否使用旧硬指标 | A. 继承旧 P95;B. 当前只验证主链不被外围增强阻断 | 采用 B。旧数字只是候选,正式负载模型尚未锁定 |

## 8. 结构化中间产物

### 8.1 测试目标表

| 测试目标 | 来源 | P0 判定 |
|---|---|---|
| 证明 Governance truth center 独立成立 | C-GOV-1~5;架构 truth boundary;`03` truth object | Governance context、Gate / Decision、Approval、Policy、Control、AIIA / SoA、Nonconformity 和 trace / outbox / report 均按正式对象与 flow 成立 |
| 证明边界红线可被负向测试阻断 | BR-GOV-012~020;VF-GOV-002~009 | 相邻仓状态、UI、runtime cache、external body、query / job / report 不能写入或替代 Governance truth |
| 证明协议和状态可 1:1 落码并可验证 | `03` Step 7~10;Step 16 | 23 Command、14 Query、9 Consumer、12 Event、7 Job 和 23 组状态机均有最小正向 / 异常测试切口 |
| 证明一致性、幂等和恢复 surface 成立 | `03` Step 11~13 | UoW 顺序、version、outbox snapshot、stored result / receipt / report、duplicate replay、commit unknown 和 partial failure 可测 |
| 证明配置、外部依赖和观测不破坏主链 | `04` §6~§12;`03` Step 14~15 | P0 profile 可装配;invalid config fail-fast;secret / body no-output;adapter disabled / degraded / failed marker 不反写真相 |

### 8.2 范围 / 非范围表

| 范围项 | 类型 | 优先级 | 验证目标 | 非目标 / 说明 |
|---|---|---|---|---|
| Governance context / input 可裁决语境 | core truth | P0 | actor、scope、适用对象、治理目的、外部引用和输入状态形成正式上下文 | 不验证相邻仓正文和完整生命周期 |
| Gate / Decision / Approval responsibility | core truth | P0 | 正式裁决、责任、投票、授权、替代裁决和不可原地改写成立 | 不让 process waiting、conversation card 或 work state 替代 |
| Policy effective fact / shared rules / conflict | core truth | P0 | Policy 生效、scope、priority、shared rules、冲突和自动化边界成立 | 不实现高级 Policy DSL 或 rule engine 产品 |
| Control applicability / review | core truth | P0 | Control 适用、复核、违反和整改关联成立 | 不保存 control definition 或标准正文 |
| AIIA / SoA conclusion | core truth | P0 | 治理评审、适用性、覆盖和批准结论成立且 body-free | 不验证 artifact 正文质量或生成文档 |
| Nonconformity corrective loop | core truth | P0 | 不符合、原因、纠正、复验和关闭形成治理闭环 | 不替代 bug、work blocker 或 observability alert 系统 |
| Query / projection read surface | read model | P0 | missing、not visible、degraded、stale、failed、empty page 和 query no-write 成立 | 不要求 query 自动修复 projection 或 reference |
| Inbound external change consumers | event seam | P0 | snapshot / reference / stale marker / receipt / dead-letter / unsupported version 成立 | 不测试来源仓完整事件生成逻辑 |
| Outbound event and outbox publish | event seam | P0 | stored payload snapshot、topic map、publish failed / retry / dead-letter 成立 | 不要求真实 message product |
| Operations jobs | maintenance seam | P0 | publish、rebuild、refresh、reconcile、trace / archive handoff、external export job 的 report、duplicate replay 和 no truth repair 成立 | 不把 job 作为业务 truth 修复入口 |
| Persistence / UoW / idempotency / concurrency | consistency | P0 | version、transaction order、stored result / receipt / report、duplicate replay、commit unknown、race guard 成立 | 不指定真实 DB isolation 产品 |
| Config profile and runtime builder | config | P0 | local-dev、ci-test、integration-like、operations-replay 可验证;invalid config fail-fast | staging-like / production-like 不作为 P0 必过 |
| Redaction / observability | security / observability | P0 | raw body、secret、full sensitive ref 不进 log、audit、trace、report、outbox | 不验证外部 observability 物理存储 |
| Durable store / real bus / real-like resolver | product seam | P1 | 验证 adapter seam、failure mapping、topic completeness 和 no silent fallback | 不作为 P0 truth center 成立前置 |
| Production-like runtime / capacity / SLO | operations | P2 | 后续基于真实产品、负载模型和运维约束验证 | 当前只保留候选和风险 |
| Advanced Policy DSL / complex Gate / automatic drafting / deep external GRC | peripheral enhancement | P2 | 后续验证不破坏 Governance truth | 当前不作为核心闭环成立条件 |

### 8.3 P0 / P1 / P2 优先级口径

| 优先级 | 定义 | 必须输出 |
|---|---|---|
| P0 | 证明 `L1-governance` 作为治理决策与治理控制真相仓成立,并阻断 VF-GOV-001~010 | 可执行测试切口、自动化候选、负向断言、配置 / redaction 门禁、evidence 产出面 |
| P1 | 证明真实或 real-like adapter 接缝不会改变 P0 truth 语义 | integration-like / staging-like 接缝测试、failure mapping、product-neutral evidence |
| P2 | 证明未来外围增强、生产优化或深度集成不反向定义 Governance truth | 演进风险、残余风险、后续测试触发条件 |

### 8.4 只测接缝的下游能力

| 下游 / 外部能力 | 本轮测试内容 | 不测试内容 | 残余风险 |
|---|---|---|---|
| `L1-process` | process context ref、waiting / decision consumption event、no process truth persisted | ProcessInstance / Activity / waiting gate 内部状态机 | 真实 process 消费差异留给跨仓集成 |
| `L1-work` | work governance context ref、work view stale、decision consumption boundary | Project / WorkItem / Iteration / blocker lifecycle | 真实 work query / lifecycle 差异留给跨仓集成 |
| `L1-artifact` / `L4-archive` | artifact / evidence refs、archive handoff marker、no package body | artifact body validation、archive package storage and restore | 真实归档恢复能力留给 archive |
| `L1-identity` | actor capability snapshot、responsibility actor ref、dedup / degraded | member lifecycle、authn / authz backend | 真实身份权限策略差异留给 identity |
| `L3-method-library` | method policy / control snapshot、definition ref、unavailable marker | method body、Policy DSL、standard text | 真实定义变更复杂度留给 method |
| `L2-runtime` / `L3-capability-hub` | runtime signal ref、policy consumption boundary、no runtime body | tool execution、agent loop、capability registry | 真实执行策略传播留给 runtime / capability |
| `L1-conversation` / workspace / console | display context ref、trace / decision view consumption boundary | UI state、card rendering、accessibility | 真实产品显化留给产品层 |
| `L4-observability` | alert summary ref、safe diagnostic ref、redaction scan | physical log store、metric backend、trace storage | 真实观测平台接入留给 observability |
| external GRC | disabled / fake / controlled export boundary、no truth source | vendor schema、external workflow、credential rotation | 真实 external GRC 接入留给 P1/P2 |

### 8.5 非范围与残余风险表

| 非范围 | 残余风险 | 当前归属 |
|---|---|---|
| 真实 DB / bus / search / object storage 产品行为 | durable adapter 的 isolation、throughput、topic routing 和 recovery 仍需产品验证 | P1 / 实施计划 / ADR |
| 生产容量、硬 SLO、压测阈值 | 旧性能数字未硬化,无法作为 P0 release gate | P2 / 容量评估 |
| 完整跨仓端到端业务流程 | 相邻仓真实状态机、权限和消费语义可能与 fake seam 不一致 | P1 cross-repo integration |
| 高级 Policy DSL / simulation | 复杂策略表达可能带来新冲突与解释成本 | P2 Policy 增强 |
| 复杂多人评审 / 升级 / 超时仲裁 | 高风险评审编排需要更多状态和测试 | P2 Gate 编排增强 |
| AIIA / SoA 自动草拟 / 周期重评 | 自动建议可能被误当正式结论 | P2 合规增强 |
| external GRC 深度集成 | 外部系统状态可能被误当 Governance truth | P1/P2 external export boundary |
| UI / dashboard / report 体验 | 消费体验和查询性能可能不足 | 产品层 / P2 |

### 8.6 一票否决关联表

| VF | 测试范围承接 | P0 断言方向 |
|---|---|---|
| VF-GOV-001 | C-GOV-1~5 core truth / protocol / job | 任一核心闭环无法成立即失败 |
| VF-GOV-002 | Gate / Decision / process / work / conversation / runtime boundary | 相邻状态或 UI 不能替代 Decision truth |
| VF-GOV-003 | artifact / evidence / method / runtime / observability / external body redaction | 外部正文不得进入 truth、outbox、audit、trace、report |
| VF-GOV-004 | Policy effective fact / runtime / method boundary | runtime cache、capability whitelist、method definition 不能反向定义 Policy truth |
| VF-GOV-005 | shared rules / low scope Policy | 低 scope 不能覆盖组织级硬约束 |
| VF-GOV-006 | Decision state and history | 正式裁决不能原地改写,变更必须新事实 |
| VF-GOV-007 | AIIA / SoA conclusion / artifact boundary | 治理结论必须 body-free 且可回链正文来源 |
| VF-GOV-008 | Nonconformity corrective loop | 不符合不得退化为 bug、work blocker、alert 或备注 |
| VF-GOV-009 | Query / projection / reconciliation / handoff / job | 读和维护动作不得隐式创建、修改、批准或关闭 truth |
| VF-GOV-010 | module dependency and adapter seam | 除 `L0-core` 外不得引入 sibling compile-time business dependency |

## 9. 对上游设计的影响判定

| 测试范围结论 | 是否影响上游 | 影响类型 | 处理状态 |
|---|---|---|---|
| P0 覆盖 `03` Step 16 的全部最小测试切口 | 否 | 测试范围收束 | 无需回写 |
| P1/P2 不作为当前 P0 必过 | 否 | 优先级口径 | 符合 `00/01/04` 外围增强和产品中立结论 |
| 只测相邻仓接缝,不测完整内部状态机 | 否 | 仓际边界 | 符合 truth ownership 和依赖裁剪 |
| 后续若某 P0 范围无法构造可执行测试 | 是 | 可验证性缺口 | 回写对应 `03` / `04` 或记录为阻塞 |
| 后续若一票否决项无法形成 evidence | 是 | 验收闭环缺口 | 在 Step 5 / Step 13 / 新版 `06` 闭合 |

## 10. 回填草稿

> 校准来源:
> - `design-calibration/05_test_plan_step_02_scope.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“SOP 问题回答”“范围 / 非范围表”“P0 / P1 / P2 优先级口径”和“一票否决关联表”小节,了解测试目标与范围如何收敛。

正式 `05-测试方案.md` §2 应回填:

- 本轮测试目标是证明 `L1-governance` 作为治理决策与治理控制真相仓成立,并能阻断 VF-GOV-001~010。
- P0 覆盖 C-GOV-1~C-GOV-5、FR-GOV-001~010、BR-GOV-001~040、23 Command、14 Query、9 Consumer、12 Event、7 Job、状态矩阵、一致性、幂等、配置和观测最小切口。
- P1 只验证 real-like adapter / staging-like / durable-like 接缝,不让真实产品成为 P0 前置。
- P2 保留生产优化、高级 DSL、复杂 Gate、自动草拟、external GRC 深度集成、容量和报表健康度等外围增强。
- process、work、artifact、identity、method、runtime、conversation、observability、archive、workspace / console 和 external GRC 只测接缝,不测其完整内部实现。
- 非范围必须进入残余风险或后续演进触发条件,不得被误写成当前已验证。

## 11. 待确认事项

| 待确认事项 | 影响 | 当前处理 |
|---|---|---|
| P0 用例数量较大 | Step 6 需要按测试切口小循环分批写入 | 后续按模块 / interface family / state / consistency 分批 |
| P1 real-like adapter 范围是否需要提前 | 影响 integration-like / staging-like 证据深度 | 当前只做接缝验证,不阻塞 P0 |
| 新版 `06` 是否把所有 VF-GOV 映射为 veto | 影响 evidence 强度和 release gate | Step 13 先定义 evidence,`06` 后续裁决 |
| 性能候选目标何时硬化 | 影响专项测试和 release gate | 当前只做结构性性能验证,硬指标后续容量评估 |

## 12. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| P0 / P1 / P2 已收稳 | 通过 | 见 §8.3 |
| 范围 / 非范围已收稳 | 通过 | 见 §8.2 / §8.5 |
| 下游只测接缝边界已明确 | 通过 | 见 §8.4 |
| 一票否决关联已记录 | 通过 | 见 §8.6 |
| 可进入 Step 3 | 通过 | 下一步抽取测试对象与测试切口 |
