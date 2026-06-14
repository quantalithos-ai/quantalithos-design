# Step 2. 明确测试目标、范围和非范围

> 对应 SOP: `standards/document/测试方案讨论流程_SOP.md` Step 2
> 回填章节: `05-测试方案.md` §2 本次测试目标与范围

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 2 明确测试目标、范围和非范围 |
| 当前状态 | 已写入;待用户审查 |
| 输入基线 | Step 1 输入边界;新版 `00/01/02/03/04`;`03_ddd_step_16_test_cuts.md` |
| 输出文件 | `projects/L1-identity/design-calibration/05_test_plan_step_02_scope.md` |
| 正式文档状态 | 本 Step 不修改正式 `05-测试方案.md` |
| 停审方式 | 完成本 Step 后暂停,由用户审查后再进入 Step 3 |

## 2. 本步目标

定义本轮测试要证明什么、覆盖什么、不覆盖什么,并把 P0 / P1 / P2 的优先级口径固定下来。

本 Step 只回答:

- P0 必须通过哪些测试才能证明 `L1-identity` 主链成立。
- P1 / P2 是否只做边界验证或延后。
- 哪些下游能力只测接缝,不测试对方完整实现。
- 哪些非范围仍有残余风险。
- 哪些范围项和一票否决项直接相关。

本 Step 不展开完整测试对象清单、用例矩阵、数据集、环境拓扑、CI job、artifact schema、evidence ID 或验收裁决。这些分别由 Step 3~14 承接。

## 3. 本步输入

| 输入 | 状态 | 本 Step 用途 |
|---|---|---|
| `05_test_plan_step_01_input_boundary.md` | 已审核通过 | 固定输入权威顺序、旧 `05/06` 地位和无阻塞结论 |
| `00-需求文档.md` §7 / §9 / §10 / §13 / §14 | 正式输入 | 固定 C-ID、FR-ID、BR-ID、NFR-ID、AC-ID、VETO-ID 和非功能范围 |
| `01-架构设计.md` §3~§9 / §13~§16 | 正式输入 | 固定 identity truth center、依赖裁剪、数据所有权、正文排除、query no-write 和产品中立 |
| `02-概要设计.md` §2~§12 | 正式输入 | 固定主要组成部分、关键对象、接口骨架、处理流、状态、异常和配置影响 |
| `03-详细设计.md` §5~§16 | 正式输入 | 固定模块、协议、flow、状态、事务、错误、幂等、配置、观测和最小测试切口 |
| `04-配置设计.md` §2 / §6 / §8 / §9 / §11 / §12 | 正式输入 | 固定 profile、config fail-fast、secret / redaction、adapter failure、rollback digest 和配置门禁范围 |

## 4. SOP 问题回答

| 问题 | 回答 |
|---|---|
| P0 必须通过哪些测试才能证明主链成立? | P0 必须证明 C-ID-1~C-ID-5 成立:平台级成员身份锚点稳定且不可复用;全局生命周期可显式管理、读取和追溯;角色能力摘要有来源或证据且不保存定义正文;生涯记录与 memory refs 只以追加 / 引用方式维护;相邻仓可消费身份事实、变化可追溯、维护对账不修复相邻 truth。测试必须覆盖 7 个 crate、6 个 Command、14 个 Query、5 个 Inbound Event / Callback、10 个 Outbound Material、6 个 Operations Job、state matrix、UoW、stored replay、duplicate no-rerun、query no-write、job no truth repair、forbidden material scan、P0 profile config 和 redaction。 |
| P1 / P2 是否只做边界验证或延后? | 是。P1 只做 durable-like、real-like bus / resolver / handoff / archive / governance basis / method source 等接缝验证,不要求真实产品闭环成为 P0 必过。P2 保留 production-like profile、容量模型、硬 SLO、高级员工主页、外部 HR / IdP 深度集成、复杂组织结构、全量 event sourcing 和更深运维集成,不进入当前必过范围。 |
| 哪些下游能力只测接缝,不测对方完整实现? | method-library、work、governance、memory / archive、process、conversation、workspace / console、runtime、observability、SDK / 产品层均只测 identity 侧的 ref / snapshot / safe summary / source marker / event / handoff / adapter 接缝和边界断言,不测试相邻仓内部状态机、正文存储、UI、物理观测平台或外部系统业务语义。 |
| 哪些非范围有残余风险? | 不测真实 DB / bus / archive / metric / secret provider 产品会留下产品适配风险;不测生产容量和硬 SLO 会留下性能容量风险;不测相邻仓完整端到端会留下真实集成风险;不测外部 HR / IdP、复杂组织和全量 event sourcing 会留下未来增强风险。这些不影响 P0 identity truth center 通过,但必须进入 P1/P2 或残余风险。 |
| 哪些范围项是一票否决相关? | P0 中任何触发 VETO-ID-001~006 的范围项都与一票否决相关:成员身份 ref 复用、查询或消费隐式创建成员、保存 RoleDefinition / ProjectMember / memory / artifact / conversation / runtime 正文、高风险生命周期缺少治理 / 授权依据仍 accepted、维护对账修复相邻 truth、业务仓源码依赖形成 L1 循环或 truth 混层。 |

## 5. 当前文档问题诊断

| 位置 | 当前问题 | 本 Step 处理 |
|---|---|---|
| 旧 `05-测试方案.md` §1~§3 | 旧范围围绕历史主链、旧命令和旧投影组织,未覆盖新版 `03` 的 6 Command、14 Query、5 Inbound/Callback、10 Outbound、6 Job、配置和观测范围 | 不继承旧范围,重新按新版 `00`~`04` 定 P0 / P1 / P2 |
| 旧 `06-验收标准.md` | 旧验收以旧测试范围为基线,不能直接裁决新版 P0 | 本 Step 只保留验收方向,后续 evidence 和 veto 由新版 `05/06` 闭合 |
| `03-详细设计.md` §15 | 给出最小测试切口,但未定义 P0 / P1 / P2 范围和非范围 | 本 Step 将 Step 16 test cuts 收束成范围优先级 |
| `04-配置设计.md` | 已定义 P0 profile 与 P1/P2 future profile,但未纳入测试范围 | 本 Step 把 `local-dev` / `ci-test` / `integration-like` / `operations-replay` 定为 P0 配置测试范围 |
| 性能 / 可用性 | 需求和架构均明确不继承旧硬阈值 | 定为 Step 10/12/13 的 baseline、sample 或评审口径,不是当前旧数字继承 |
| 产品未锁定 | 真实 durable / bus / archive / metric 产品不能作为当前必过 | 定为 P1/P2 接缝或残余风险,不阻塞 P0 |

## 6. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 测试目标 | 旧草稿强调历史创建、同步、发布、投影和查询链路 | 改为证明 C-ID-1~C-ID-5 与新版 `03` 全协议 / 状态 / 一致性 / 配置切口成立 | 覆盖新版 identity 主链 |
| P0 范围 | 未系统覆盖 callback、outbound material、operations job、reference、stored replay、config、redaction | 明确全部进入 P0 最小验证范围 | 这些是正式设计闭环和验收红线的一部分 |
| P1 / P2 | 旧草稿含真实环境方向但未分层 | 明确 P1/P2 不阻塞 P0,只做接缝验证或后续演进 | 避免产品未锁定阻塞测试方案 |
| 非范围 | 旧草稿主要列 UI 和相邻系统 | 增补真实产品、生产容量、外部 HR / IdP、复杂组织、全量 event sourcing 等非范围 | 对齐 `00/01/04` 的外围增强和产品中立 |
| 一票否决 | 旧草稿没有映射新版 VETO-ID | 明确 P0 红线和 VETO-ID-001~006 关联 | 方便后续 Step 5 / Step 13 / `06` 追溯 |

## 7. 测试设计取舍

| 议题 | 可选方案 | 取舍 |
|---|---|---|
| P0 是否只测核心 Command happy path | A. 只测主线 Command;B. 覆盖协议、状态、一致性、配置和观测最小切口 | 采用 B。否则无法证明 VETO-ID 红线和详细设计闭环 |
| P0 是否要求真实相邻仓 | A. 要求真实集成;B. 使用 ref / snapshot / event / adapter fake 或 controlled seam | 采用 B。相邻仓完整实现不是 identity P0 真相证明前置 |
| P0 是否要求真实 durable / bus / archive 产品 | A. 要求真实产品;B. in-memory / fake / controlled / disabled 接缝 | 采用 B。产品未锁定,且 `04` 已定义 product-neutral P0 profile |
| P1/P2 是否进入当前硬验收 | A. 全部进入;B. 只作为边界验证和残余风险 | 采用 B。外围增强不能阻塞 C-ID 主链 |
| 性能是否使用旧硬指标 | A. 继承旧 P95;B. 当前先建立 baseline / sample / review 口径 | 采用 B。旧数字不是新版需求真相源 |

## 8. 结构化中间产物

### 8.1 测试目标表

| 测试目标 | 来源 | P0 判定 |
|---|---|---|
| 证明 identity truth center 独立成立 | C-ID-1~5;架构 truth boundary;`03` truth object | 成员身份、生命周期、角色能力摘要、生涯、memory refs、追溯、outbox、projection、report 均按正式对象与 flow 成立 |
| 证明边界红线可被负向测试阻断 | BR-ID-001~015;VETO-ID-001~006 | 相邻仓状态、认证主体、runtime instance、外部正文、query / consumer / job 不能创建或修复 identity truth |
| 证明协议和状态可 1:1 落码并可验证 | `03` Step 7~10;Step 16 | 6 Command、14 Query、5 Inbound/Callback、10 Outbound、6 Job 和状态机均有最小正向 / 异常测试切口 |
| 证明一致性、幂等和恢复 surface 成立 | `03` Step 11~13 | UoW 顺序、version、stored result / receipt / report、duplicate replay、commit unknown 和 partial failure 可测 |
| 证明配置、外部依赖和观测不破坏主链 | `04` §6~§12;`03` Step 14~15 | P0 profile 可装配;invalid config fail-fast;secret / body no-output;adapter disabled / degraded / failed marker 不反写真相 |

### 8.2 范围 / 非范围表

| 范围项 | 类型 | 优先级 | 验证目标 | 非目标 / 说明 |
|---|---|---|---|---|
| Identity anchor and stable member ref | core truth | P0 | `EstablishGlobalMember` accepted/rejected/duplicate/conflict 成立;成员 ref 稳定且不可复用 | 不做认证账号、credential、session 或 runtime identity |
| Global lifecycle availability | core truth | P0 | `UpdateGlobalLifecycleState` 合法/非法迁移、高风险 basis、追溯和读取成立 | 不把 ProjectMember 状态、runtime availability 或 UI 状态当全局生命周期 |
| Role capability summary | core truth / snapshot | P0 | `MaintainRoleCapabilitySummary` 来源、证据、安全摘要、stale/unavailable/unrecognized 和 forbidden body 阻断成立 | 不保存 RoleDefinition / CapabilityDefinition body,不做能力评分算法 |
| Career record append | append-only truth | P0 | `AppendCareerRecord` 追加、纠错追加、重复来源 no duplicate、ProjectMember body 阻断成立 | 不保存 work truth,不反向定义项目事实 |
| Memory reference relation | reference truth | P0 | `MaintainMemoryReference` ref / archive / handoff marker、状态变化、迁移引用和 forbidden body 阻断成立 | 不保存 memory text、embedding、archive package 或 external carrier body |
| Trace handoff intent | handoff intent | P0 | `PrepareTraceHandoff` 只创建 pending intent,非空 trace refs、visibility、unsupported target 和 duplicate replay 成立 | 不在 command path 执行 delivery |
| Query and read visibility surface | read model | P0 | `ReadMemberSummary` 及 trace/audit/query family 覆盖 visible hit、missing/empty、not visible、degraded/stale-visible 和 query no-write | 不要求 query 创建成员、重建 projection 或刷新 reference |
| Inbound event / callback consumption | event seam | P0 | source change、work participation、memory/archive callback 等 typed receipt replay、unsupported、delayed、quarantined、noop 和 forbidden body 成立 | 不测试来源仓完整事件生成逻辑 |
| Outbound material and propagation | event seam | P0 | 10 类 outbound material accepted-only、saved payload marker、body-free payload、publish failure isolation 成立 | 不要求真实 message product 或 downstream consumed |
| Operations jobs | maintenance seam | P0 | `RebuildIdentityProjection`、`RefreshExternalReferenceState`、`RunIdentityReconciliation`、`PublishIdentityOutbox`、`DeliverTraceHandoff`、`RetryIdentityPropagationFailures` 的 report、duplicate replay、partial failure 和 no truth repair 成立 | 不把 job 作为业务 truth 修复入口 |
| Persistence / UoW / idempotency / concurrency | consistency | P0 | version、transaction order、stored result / receipt / report、duplicate no-rerun、commit unknown、race guard 成立 | 不指定真实 DB isolation 产品 |
| Config profile and runtime builder | config | P0 | `local-dev`、`ci-test`、`integration-like`、`operations-replay` 可验证;invalid config fail-fast | `staging-like` / `production-like` 不作为 P0 必过 |
| Redaction / observability | security / observability | P0 | raw body、secret、full sensitive ref 不进 log、audit、trace、report、outbox、artifact | 不验证外部 observability 物理存储 |
| Durable store / real bus / real-like resolver | product seam | P1 | 验证 adapter seam、failure mapping、topic completeness 和 no silent fallback | 不作为 P0 truth center 成立前置 |
| Production-like runtime / capacity / hard SLO | operations | P2 | 后续基于真实产品、负载模型和运维约束验证 | 当前只保留候选和风险 |
| External HR / IdP, advanced employee profile, complex organization, full event sourcing | peripheral enhancement | P2 | 后续验证不破坏 identity truth | 当前不作为核心闭环成立条件 |

### 8.3 P0 / P1 / P2 优先级口径

| 优先级 | 定义 | 必须输出 |
|---|---|---|
| P0 | 证明 `L1-identity` 作为平台级 AI 员工身份真相仓成立,并阻断 VETO-ID-001~006 | 可执行测试切口、自动化候选、负向断言、配置 / redaction 门禁、evidence 产出面 |
| P1 | 证明真实或 real-like adapter 接缝不会改变 P0 truth 语义 | integration-like / real-like 接缝测试、failure mapping、product-neutral evidence |
| P2 | 证明未来外围增强、生产优化或深度集成不反向定义 identity truth | 演进风险、残余风险、后续测试触发条件 |

### 8.4 只测接缝的下游能力

| 下游 / 外部能力 | 本轮测试内容 | 不测试内容 | 残余风险 |
|---|---|---|---|
| `L3-method-library` | role / capability source ref、safe summary、source state、unrecognized/unavailable marker、forbidden body guard | RoleDefinition / CapabilityDefinition 正文、method body、能力评估算法 | 真实来源变更复杂度留给 P1/P2 |
| `L1-work` | project / participation source marker、career append boundary、ProjectMember body guard | Project、WorkItem、ProjectMember truth 和状态机 | 真实 work participation 语义留给跨仓集成 |
| `L1-governance` | high-risk lifecycle basis ref / summary、basis missing/invalid/unavailable | governance decision / policy truth | 真实治理 basis shape 变化需后续接缝验证 |
| memory / archive boundary | memory/archive refs、handoff marker、migration state、no package body | memory text、embedding、archive package storage and restore | 真实归档恢复能力留给 archive |
| `L1-process` / `L1-conversation` | identity fact consumption ref、trace visibility、no consumer implicit create | process / conversation internal state and body | 真实消费差异留给跨仓集成 |
| workspace / console / SDK / product layer | read surface contract、not visible / degraded / stale surface | UI state、rendering、product interaction | 真实产品体验留给产品层 |
| runtime / member-service | lifecycle consumption boundary、runtime body guard | tool execution、container state、agent loop | 真实运行编排留给 runtime |
| observability / audit backend | safe diagnostic refs、redaction scan、body-free report | physical log store、metric backend、trace storage | 真实观测平台接入留给 observability |

### 8.5 非范围与残余风险表

| 非范围 | 残余风险 | 当前归属 |
|---|---|---|
| 真实 DB / bus / archive / metric / secret provider 产品行为 | durable adapter 的 isolation、throughput、routing 和 recovery 仍需产品验证 | P1 / 实施计划 / ADR |
| 生产容量、硬 SLO、压测阈值 | 旧性能数字未硬化,无法作为 P0 release gate | P2 / 容量评估 |
| 完整跨仓端到端业务流程 | 相邻仓真实状态机、权限和消费语义可能与 fake seam 不一致 | P1 cross-repo integration |
| 外部 HR / IdP 深度集成 | 外部身份系统语义可能被误当 identity truth | P2 integration design |
| 高级员工主页、复杂组织结构、自动能力评级、绩效评分 | 外围增强可能诱导保存正文或评分算法 | P2 product enhancement |
| Full event-sourcing-first | 追溯与 replay 能力更强,但 P0 建模和测试复杂度显著升高 | P2 architecture revisit |
| UI / dashboard / report 体验 | 消费体验和查询性能可能不足 | 产品层 / P2 |

### 8.6 一票否决关联表

| VETO | 测试范围承接 | P0 断言方向 |
|---|---|---|
| VETO-ID-001 | Identity anchor and stable member ref | 成员身份 ref 不得复用给另一个成员 |
| VETO-ID-002 | Query / consumer / callback / projection / maintenance | 查询或消费路径不得隐式创建成员身份 |
| VETO-ID-003 | Role source、work source、memory/archive、artifact、conversation、runtime、redaction | 外部正文不得进入 identity truth、event、trace、audit、report 或 diagnostic material |
| VETO-ID-004 | Global lifecycle availability and high-risk basis | 高风险生命周期缺少治理 / 授权依据时不得 accepted |
| VETO-ID-005 | Reconciliation / maintenance jobs | 维护对账只能 report-only,不得修复相邻仓 truth |
| VETO-ID-006 | Dependency boundary and adapter seam | 除 `L0-core` 外不得引入 sibling business compile-time dependency 或 truth mixing |

## 9. 对上游设计的影响判定

| 测试范围结论 | 是否影响上游 | 影响类型 | 处理状态 |
|---|---|---|---|
| P0 覆盖 `03` Step 16 的全部最小测试切口 | 否 | 测试范围收束 | 无需回写 |
| P1/P2 不作为当前 P0 必过 | 否 | 优先级口径 | 符合 `00/01/04` 外围增强和产品中立结论 |
| 只测相邻仓接缝,不测完整内部状态机 | 否 | 仓际边界 | 符合 truth ownership 和依赖裁剪 |
| performance / availability 不继承旧硬阈值 | 否 | 测试 / 验收待定义 | Step 10/12/13 闭合 baseline、sample 或评审口径 |
| 后续若某 P0 范围无法构造可执行测试 | 是 | 可验证性缺口 | 回写对应 `03` / `04` 或记录为阻塞 |
| 后续若一票否决项无法形成 evidence | 是 | 验收闭环缺口 | 在 Step 5 / Step 13 / 新版 `06` 闭合 |

## 10. 回填草稿

> 校准来源:
> - `design-calibration/05_test_plan_step_02_scope.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“SOP 问题回答”“范围 / 非范围表”“P0 / P1 / P2 优先级口径”和“一票否决关联表”小节,了解测试目标与范围如何收敛。

正式 `05-测试方案.md` §2 应回填:

- 本轮测试目标是证明 `L1-identity` 作为平台级 AI 员工身份真相仓成立,并能阻断 VETO-ID-001~006。
- P0 覆盖 C-ID-1~C-ID-5、FR-ID-001~014、BR-ID-001~015、NFR-ID-001~009、6 Command、14 Query、5 Inbound Event / Callback、10 Outbound Material、6 Operations Job、状态矩阵、一致性、幂等、配置和观测最小切口。
- P1 只验证 real-like adapter、durable-like store、bus / resolver / archive / basis / source 接缝,不让真实产品成为 P0 前置。
- P2 保留 production-like profile、容量模型、硬 SLO、外部 HR / IdP 深度集成、复杂组织结构、全量 event sourcing 和产品体验增强。
- method-library、work、governance、memory/archive、process、conversation、workspace / console、runtime、observability 和 SDK / 产品层只测接缝,不测其完整内部实现。
- 非范围必须进入残余风险或后续演进触发条件,不得被误写成当前已验证。

## 11. 待确认事项

| 待确认事项 | 影响 | 当前处理 |
|---|---|---|
| P0 用例数量较大 | Step 6 需要按测试切口小循环分批写入 | 后续按 module / protocol family / state / consistency / config 分批 |
| P1 real-like adapter 范围是否需要提前 | 影响 integration-like 证据深度 | 当前只做接缝验证,不阻塞 P0 |
| 新版 `06` 是否把所有 VETO-ID 映射为 release veto | 影响 evidence 强度和 release gate | Step 13 先定义 evidence,`06` 后续裁决 |
| 性能候选目标何时硬化 | 影响专项测试和 release gate | 当前只做 baseline / sample / review 口径,硬指标后续容量评估 |

## 12. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| P0 / P1 / P2 已收稳 | 通过 | 见 §8.3 |
| 范围 / 非范围已收稳 | 通过 | 见 §8.2 / §8.5 |
| 下游只测接缝边界已明确 | 通过 | 见 §8.4 |
| 一票否决关联已记录 | 通过 | 见 §8.6 |
| 正式 `05` 未提前改写 | 通过 | 本 Step 只写 `design-calibration` 中间产物 |
| 可进入 Step 3 | 待用户确认 | 用户审核通过后进入 Step 3: 抽取测试对象与测试切口 |
