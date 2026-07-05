# Step 2. 明确测试目标、范围和非范围

> 对应 SOP: `standards/document/测试方案讨论流程_SOP.md` Step 2
> 回填章节: `05-测试方案.md` §2 本次测试目标与范围

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 2 明确测试目标、范围和非范围 |
| 当前状态 | 已完成;待用户审查 |
| 输入基线 | Step 1 输入边界;新版 `00/01/02/03/04`;`03_ddd_step_16_test_cuts.md` |
| 输出文件 | `projects/L1-artifact/design-calibration/05_test_plan_step_02_scope.md` |
| 停审方式 | 完成本 Step 后暂停,由用户审查后再进入 Step 3 |

## 2. 本步目标

定义本轮测试要证明什么、覆盖什么、不覆盖什么,并把 P0 / P1 / P2 的优先级口径固定下来。

本 Step 只回答:

- P0 必须通过哪些测试才能证明 `L1-artifact` 主链成立。
- P1 / P2 是否只做边界验证或延后。
- 哪些下游能力只测接缝,不测对方完整实现。
- 哪些非范围仍有残余风险。
- 哪些范围项和一票否决项直接相关。

本 Step 不展开完整测试对象清单、用例矩阵、数据集、环境拓扑、CI job、evidence ID 或验收裁决。这些分别由 Step 3~14 承接。

## 3. 本步输入

| 输入 | 状态 | 本 Step 用途 |
|---|---|---|
| `05_test_plan_step_01_input_boundary.md` | 已完成 | 固定输入权威顺序、旧 `05/06` 地位和无阻塞结论 |
| `00-需求文档.md` §7 / §9 / §10 / §11 / §13 / §14 / §16 | 正式输入 | 固定五个核心能力、`FR-ART-001~020`、`BR-ART-001~025`、`NFR-ART-CAP-001~027`、`NFR-ART-GLOB-001~012`、五类验收和一票否决项 |
| `01-架构设计.md` §4 / §5 / §8 / §9 / §13 / §14 / §15 | 正式输入 | 固定 truth ownership、依赖裁剪、数据所有权、只读消费、派生不反写和横切约束 |
| `02-概要设计.md` §5 / §7 / §8 / §9 / §10 / §11 | 正式输入 | 固定主要组成部分、5 类接口、关键处理流、8 组状态机、异常边界和配置影响 |
| `03-详细设计.md` §5~§15 | 正式输入 | 固定 7 模块、16 Command、13 Query、6 Consumer、8 Event、6 Job、状态、事务、一致性、错误、幂等、配置和观测最小验证范围 |
| `03_ddd_step_16_test_cuts.md` | 正式输入 | 固定最小测试切口、worker-only relay publication、脚本契约和高风险验证入口 |
| `04-配置设计.md` §2 / §6 / §8 / §9 / §11 / §12 / §14 | 正式输入 | 固定 4 个 P0 profile、strict JSON、source priority、redaction、builder fail-fast、degraded no-write、operations replay 和 future / residual risk 边界 |

## 4. SOP 问题回答

| 问题 | 回答 |
|---|---|
| P0 必须通过哪些测试才能证明主链成立? | P0 必须证明 `L1-artifact` 的五个核心能力主轴同时成立:制品事实承载、制品版本化、制品血缘关联、制品基线冻结、制品事实可消费表达。测试至少要覆盖 16 Command、13 Query、6 Inbound Consumer、8 Outbound Event、6 Operations Job 与 worker-only relay publication facade 的最小正向和异常切口,以及状态矩阵、UoW / stored result / relay snapshot、一致性 / 幂等 / duplicate replay、query no-write、job no-truth-repair、redaction no-output 和 4 个 P0 profile 配置门禁。 |
| P1 / P2 是否只做边界验证或延后? | 是。P1 只做 durable-like store、controlled / real-like resolver、publisher、handoff target、sync target 和 external content seam 的接缝验证,不要求真实产品成为 P0 前置。P2 只保留 production-like profile、真实 secret provider / config center / hot reload、搜索 / 浏览后端、容量 / SLO、完整跨仓端到端和外围增强方向,不进入当前必过范围。 |
| 哪些下游能力只测接缝,不测对方完整实现? | `L1-work`、`L1-process`、`L1-governance`、`L1-conversation`、`L1-workspace`、`L4-archive`、`L4-observability`、`L3-method-library`、`L2-runtime`、`L3-capability-hub`、`L0-sdk`、`L5-console`、`L5-sync` 和 external content source 都只测 Artifact 的 ref / snapshot / safe summary / event / handoff / adapter seam,不测试相邻仓内部状态机、UI、物理 ledger、archive package body 或外部系统业务语义。 |
| 哪些非范围有残余风险? | 不测真实 object storage / DB / bus / search / secret provider 会留下产品适配和恢复风险;不测 production-like profile、容量和硬 SLO 会留下性能容量风险;不测相邻仓完整端到端会留下跨仓真实集成风险;不测 remote config center、admin override、hot reload 和 search backend 会留下运维与消费增强风险。这些不影响 P0 truth center 通过,但必须进入 P1/P2 或残余风险。 |
| 哪些范围项是一票否决相关? | 与 `VF-ART-001~004` 直接相关的范围项都必须进入 P0:核心能力闭环不能断裂;外部正文和消费副本不得进入正式 truth;正式 version / lineage / baseline 必须稳定追溯与冻结;消费方不得反写 Artifact truth,且消费必须可回指正式 fact / version / lineage / baseline。 |

## 5. 当前文档问题诊断

| 位置 | 当前问题 | 本 Step 处理 |
|---|---|---|
| 旧 `05-测试方案.md` §1 | 旧范围只覆盖 Artifact / ArtifactVersion / Baseline、EvidenceRef / AdoptedRelation / ApprovedRelation、少量 projection 场景,没有承接新版 `03` 的 intake / review / automation / consumption / handoff / maintenance 主线 | 不继承旧范围,重新按新版 `00`~`04` 定义 P0 / P1 / P2 |
| 旧 `05-测试方案.md` 全文 | 旧测试目标仍围绕旧主链和少量 happy path,缺少 16 Command、13 Query、6 Consumer、8 Event、6 Job 的全协议覆盖口径 | 本 Step 明确新版协议、状态、一致性、配置和观测范围全部进入 P0 最小验证 |
| `03-详细设计.md` §15 | 正式摘要只给出最小测试切口,但未定义 P0 / P1 / P2 范围层级 | 本 Step 把最小测试切口收束成优先级范围 |
| `04-配置设计.md` | 已定义 4 个 P0 profile 和 future profile,但旧 `05` 仍沿用 dev/test/staging 旧环境组织 | 本 Step 把 `local-dev` / `ci-test` / `integration-like` / `operations-replay` 固定为 P0 配置测试范围 |
| 产品未锁定 | 真实 object storage / bus / search / secret provider 不能作为当前必过基线 | 定为 P1/P2 接缝或残余风险,不阻塞 P0 |

## 6. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 测试目标 | 旧草稿强调少量制品主线和旧关系层 | 改为证明五个核心能力与新版 `03` 全协议 / 状态 / 一致性 / 配置切口成立 | 覆盖新版正式设计主链 |
| P0 范围 | 未系统覆盖 consumer、outbound、job、consumption backref、handoff、config、redaction、replay | 明确全部进入 P0 最小验证范围 | 这些是正式设计闭环和验收红线的一部分 |
| P1 / P2 | 旧草稿只粗略列 UI / 底层存储非范围 | 明确 durable-like seam、production-like profile、search / secret provider / hot reload 等分层 | 避免产品未锁定阻塞当前测试方案 |
| 下游边界 | 旧草稿只说“不验下游仓内部所有实现” | 细化到 work / process / governance / runtime / archive / observability / SDK / console / sync / external content 接缝 | 让后续 Step 3~10 有稳定边界 |
| 一票否决 | 旧草稿没有映射 `VF-ART` | 明确 `VF-ART-001~004` 关联的范围项进入 P0 | 方便后续 Step 5 / Step 13 / `06` 追溯 |

## 7. 测试设计取舍

| 议题 | 方案 | 取舍 |
|---|---|---|
| P0 是否只测核心 Command happy path | A. 只测主线 Command;B. 覆盖协议、状态、一致性、配置和观测最小切口 | 采用 B。否则无法证明五类验收和 `VF-ART` 红线 |
| P0 是否要求真实相邻仓 | A. 要求真实跨仓集成;B. 使用 ref / snapshot / event / adapter fake 或 controlled seam | 采用 B。相邻仓完整实现不是 Artifact truth center P0 成立前置 |
| P0 是否要求真实基础设施产品 | A. 要求真实 store / bus / secret provider;B. 使用 product-neutral / fake / controlled / replay-backed seam | 采用 B。产品未锁定不应阻塞 P0 |
| P1/P2 是否进入当前硬验收 | A. 全部进入;B. 只作为边界验证和残余风险 | 采用 B。外围增强和生产化能力不能阻塞正式 truth 闭环 |
| 是否沿用旧 `dev/test/staging` 环境术语 | A. 直接继承;B. 改为新版 `04` profile 口径 | 采用 B。`04` 已正式固定 P0 profile 和 failure strategy |

## 8. 结构化中间产物

### 8.1 测试目标表

| 测试目标 | 来源 | P0 判定 |
|---|---|---|
| 证明 Artifact truth center 独立成立 | 五个核心能力;`00` §14;`01` truth boundary;`03` truth object / protocol | Artifact fact、version、lineage、baseline 和 consumption backref 均按正式对象、flow 和只读边界成立 |
| 证明边界红线可被负向测试阻断 | `BR-ART-001~025`;`VF-ART-001~004`;`04` fail-fast / fail-closed | 外部正文、消费副本、相邻仓状态、query repair、job truth repair 和 config override 都会被显式阻断 |
| 证明协议和状态可 1:1 落码并可验证 | `03` Step 7~10;Step 16 | 16 Command、13 Query、6 Consumer、8 Event、6 Job 和 worker relay facade 均有最小正向 / 异常测试切口 |
| 证明一致性、幂等和恢复 surface 成立 | `03` Step 11~13 | UoW 顺序、version、relay snapshot、stored result / receipt / report、duplicate replay、commit unknown 和 partial failure 可测 |
| 证明配置、外部依赖和观测不破坏主链 | `04` §6~§12;`03` Step 14~15 | 4 个 P0 profile 可装配;invalid config fail-fast;secret / body no-output;degraded no-write;operations replay 可测 |

### 8.2 范围 / 非范围表

| 范围项 | 类型 | 优先级 | 验证目标 | 非目标 / 说明 |
|---|---|---|---|---|
| 制品事实收束主线: `FR-ART-001~004`;`BR-ART-001~005`;`03` §5/§7/§8/§9 的 `RegisterArtifactIntake`、`EstablishArtifactFact`、review / automation intake | truth / command | P0 | 证明平台产出和自动化产出只有经正式收束后才能成为 Artifact fact,且责任 / 审查语境锚定同一正式事实入口 | 不验证上游正文生成过程,不验证相邻仓完整生命周期 |
| 制品版本与历史主线: `FR-ART-005~008`;`BR-ART-006~010`;`03` 的 `CreateArtifactVersionCandidate`、`PublishArtifactVersion`、`SupersedeArtifactVersion` | truth / command / state | P0 | 证明版本形成、替代、历史保留、current pointer 和自动化迭代版本收束成立,且不能被新内容无声覆盖 | 不验证真实内容后端算法,不要求生产级内容存储产品 |
| 制品血缘主线: `FR-ART-009~012`;`BR-ART-011~015`;`03` 的 `EstablishArtifactLineageLink`、`RejectArtifactLineageLink`、lineage queries / reports | truth / relation / audit | P0 | 证明来源、替代、依赖和跨仓回指进入正式 lineage 语境,不能由 trace / event / tool result / 私有链补造 | 不验证下游消费方内部追溯图实现 |
| 制品基线冻结主线: `FR-ART-013~016`;`BR-ART-016~020`;`03` 的 `CreateArtifactBaselineCandidate`、`FreezeArtifactBaseline`、`SupersedeArtifactBaseline` | truth / state / audit | P0 | 证明只有正式版本可进入 baseline,freeze 后成员不漂移,历史基线可回溯且不被发布口径 / 归档包替代 | 不验证项目或治理仓内部基线业务语义 |
| 可消费引用与回指主线: `FR-ART-017~020`;`BR-ART-021~025`;`03` 的 `IssueConsumableArtifactReference`、`RecordArtifactConsumptionBackref`、consumption queries | truth / reference / cross-repo seam | P0 | 证明下游消费只引用正式 fact / version / lineage / baseline,不迁移 ownership,且消费后可回指正式 truth | 不测试下游仓完整内部消费流程 |
| 只读 query / derived read surface: `03` §7/§8/§9/§10/§15 的 13 Query、preview / report / reconciliation surface | query / derived / state | P0 | 证明 missing / not visible / degraded / stale / failed surface 成立,且 query 始终 no-write | 不要求 query 自动修复 projection 或 reference |
| Inbound external change consumers: `03` 的 6 个 Consumers 和 external reference state | event seam / consumer | P0 | 证明 work / process / governance / method / runtime / external content 变化只能写 snapshot / reference / stale marker / receipt,不能直接创建核心 truth | 不测试来源仓事件生成的完整正确性 |
| Outbound relay 与 worker publish loop: `03` 的 8 个 Outbound Event、worker-only `PublishPendingArtifactRelays`、`04` topic bindings | event seam / worker | P0 | 证明 payload 来自 stored snapshot, publish failure 只影响 relay / report,不反写 truth | 不要求真实 message bus 产品 |
| Operations jobs 与 maintenance: `03` 的 6 个 Jobs、rebuild / refresh / reconcile / archive / observability / sync handoff,`04` operations-replay | maintenance / job / report | P0 | 证明 maintenance 只维护 derived state、reference、report、handoff material, duplicate replay 与 partial failure 成立,且 no-truth-repair | 不把 job 当业务写路径,不验证 archive restore 过程 |
| Persistence / UoW / idempotency / concurrency / recovery: `03` Step 11~13 | consistency / recovery | P0 | 证明 version、transaction order、stored result / receipt / report、duplicate replay、commit unknown、race guard 和 rollback 边界成立 | 不指定真实 DB isolation 产品或性能参数 |
| Config profile / runtime builder / redaction gates: `04` §6~§12 的 `local-dev`、`ci-test`、`integration-like`、`operations-replay` | config / security / observability | P0 | 证明 4 个 P0 profile 可装配,strict JSON、生效顺序、redaction no-output、invalid config fail-fast、degraded no-write、operations replay 成立 | `staging-like` / `production-like` 与真实 secret provider 不作为 P0 必过 |
| Durable-like stores / real-like resolver / publisher / handoff seam: `04` future / residual risk,`03` adapter seam | product seam | P1 | 验证真实或 real-like adapter 接缝不会改变 P0 truth 语义 | 不作为当前 truth center 成立前置 |
| Production-like profile / search backend / secret provider / hot reload / hard SLO | operations / future enhancement | P2 | 后续基于真实产品、负载模型和运维约束验证 | 当前只保留候选和残余风险 |

### 8.3 P0 / P1 / P2 优先级口径

| 优先级 | 定义 | 必须输出 |
|---|---|---|
| P0 | 证明 `L1-artifact` 作为正式制品真相仓成立,并阻断 `VF-ART-001~004` | 可执行测试切口、负向断言、配置 / redaction 门禁、evidence 产出面 |
| P1 | 证明真实或 durable-like / real-like adapter 接缝不会改变 P0 truth 语义 | integration-like 接缝测试、failure mapping、product-neutral evidence |
| P2 | 证明未来外围增强、生产优化或深度集成不反向定义 Artifact truth | 演进风险、残余风险、后续测试触发条件 |

### 8.4 只测接缝的下游 / 外部能力

| 下游 / 外部能力 | 本轮测试内容 | 不测试内容 | 残余风险 |
|---|---|---|---|
| `L1-work` | work context ref、consumption backref、artifact truth 回指 | Project / WorkItem / Iteration 内部状态机 | 真实工作流消费差异留给跨仓集成 |
| `L1-process` | process context ref、活动输出到 artifact 的收束接缝 | ProcessInstance / Activity / checkpoint 生命周期 | 真实过程编排留给跨仓集成 |
| `L1-governance` | evidence / basis / artifact consumption seam、formal ref 回指 | Gate / Decision / Policy 内部治理逻辑 | 治理内部语义留给 governance 仓 |
| `L1-conversation` / `L1-workspace` | read surface、preview、notification、safe summary 消费边界 | UI 状态、交互、搜索体验 | 产品体验风险后置 |
| `L4-archive` | archive handoff marker、trace / report refs、no package body | archive package 存储与 restore orchestration | 真实归档恢复留给 archive |
| `L4-observability` | trace available / safe diagnostic refs / redaction scan seam | 物理 log / metric / trace backend | 真实观测平台接入留给 observability |
| `L3-method-library` | definition ref、artifact kind / definition snapshot seam | method 正文、标准文本、definition 内部状态机 | 真实定义演进留给 method-library |
| `L2-runtime` / `L3-capability-hub` | automation source ref、runtime signal、body-free consumption boundary | tool execution、agent loop、capability registry | 真实执行策略传播留给 runtime / capability |
| `L0-sdk` / `L5-console` / `L5-sync` | external read / sync / handoff seam、formal refs | 入口 UI、同步副本内部状态 | 真实访问 / 同步产品差异后置 |
| external content source | source ref、resolution state、degraded / unavailable surface | vendor API、真实对象存储或搜索产品 | 真实外部产品接入留给 P1/P2 |

### 8.5 非范围与残余风险表

| 非范围 | 残余风险 | 当前归属 |
|---|---|---|
| 真实 object storage / DB / bus / search 产品行为 | durable adapter 的 isolation、throughput、topic routing、content reachability 和恢复仍需产品验证 | P1 / 实施计划 / ADR |
| 生产容量、硬 SLO、压测阈值 | 旧性能数字未硬化,无法作为 P0 release gate | P2 / 容量评估 |
| 完整跨仓端到端业务流程 | 相邻仓真实状态机、权限和消费语义可能与 fake seam 不一致 | P1 cross-repo integration |
| 真实 secret provider / config center / admin override / hot reload | 运维与安全边界仍需专门验证 | P2 / 运维演进 |
| search / browse backend 与大规模 history 浏览 | 列表体验和索引恢复语义可能需要额外测试矩阵 | P2 / 产品增强 |
| archive restore orchestration | 交接成功后真实恢复链路尚未验证 | P1/P2 archive integration |
| UI / dashboard / report 体验 | 消费体验和查询性能可能不足 | 产品层 / P2 |

### 8.6 一票否决关联表

| 相关 VF | 测试范围承接 | P0 断言方向 |
|---|---|---|
| `VF-ART-001` | 五个核心能力整体闭环 | 任一核心能力节点无法成立即失败 |
| `VF-ART-002` | 制品事实收束主线、正文排除、自动化事实收束 | 外部正文、运行材料、派生材料或消费副本不得进入正式 fact truth |
| `VF-ART-003` | 版本 / 血缘 / 基线主线 | version、lineage、baseline 必须稳定追溯、冻结且不可被后续语境改写 |
| `VF-ART-004` | 可消费引用与回指、只读消费边界 | 消费方不得反写 Artifact truth,且消费后必须可回指正式 fact / version / lineage / baseline |

## 9. 对上游设计的影响判定

| 测试范围结论 | 是否影响上游 | 影响类型 | 处理状态 |
|---|---|---|---|
| P0 覆盖 `03` Step 16 的全部最小测试切口与 `04` 的 P0 配置门禁 | 否 | 测试范围收束 | 无需回写 |
| P1/P2 不作为当前 P0 必过 | 否 | 优先级口径 | 符合 `00/01/04` 的外围增强和产品中立结论 |
| 相邻仓与外部系统只测接缝,不测完整内部状态机 | 否 | 仓际边界 | 符合 truth ownership 和依赖裁剪 |
| 后续若某个 P0 范围无法构造稳定测试对象、断言或 evidence | 是 | 可验证性缺口 | 回写对应 `03` / `04` 或记录为阻塞 |
| 后续若 `VF-ART` 某项无法形成稳定 evidence | 是 | 验收闭环缺口 | 在 Step 5 / Step 13 / 新版 `06` 闭合 |

## 10. 回填草稿

> 校准来源:
> - `design-calibration/05_test_plan_step_02_scope.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“SOP 问题回答”“范围 / 非范围表”“P0 / P1 / P2 优先级口径”和“一票否决关联表”小节,了解测试目标与范围如何收敛。

正式 `05-测试方案.md` §2 应回填:

- 本轮测试目标是证明 `L1-artifact` 作为正式制品真相仓成立,并能阻断 `VF-ART-001~004`。
- P0 覆盖五个核心能力主轴、`FR-ART-001~020`、`BR-ART-001~025`、13 Query、16 Command、6 Consumer、8 Event、6 Job、worker relay publication、一致性、幂等、配置和观测最小切口。
- P1 只验证 durable-like / real-like adapter seam,不让真实产品成为 P0 前置。
- P2 保留 production-like profile、真实 secret provider / config center / hot reload、search backend、容量和完整跨仓端到端等外围增强。
- `L1-work`、`L1-process`、`L1-governance`、`L1-conversation`、`L1-workspace`、`L4-archive`、`L4-observability`、`L3-method-library`、`L2-runtime`、`L3-capability-hub`、`L0-sdk`、`L5-console`、`L5-sync` 和 external content 只测接缝,不测其完整内部实现。
- 非范围必须进入残余风险或后续演进触发条件,不得被误写成当前已验证。

## 11. 待确认事项

| 待确认事项 | 影响 | 当前处理 |
|---|---|---|
| P0 用例数量较大 | Step 6 需要按测试切口小循环分批写入 | 后续按模块 / protocol family / state / consistency 分批 |
| P1 durable-like seam 范围是否要提前做更深验证 | 影响 integration-like evidence 深度 | 当前只做接缝验证,不阻塞 P0 |
| 新版 `06` 是否把所有 `VF-ART` 映射为 veto | 影响 evidence 强度和 release gate | Step 13 先定义 evidence,`06` 后续裁决 |
| 性能候选目标何时硬化 | 影响专项测试和 release gate | 当前只做结构性验证,硬指标后续容量评估 |

## 12. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| P0 / P1 / P2 已收稳 | 通过 | 见 §8.3 |
| 范围 / 非范围已收稳 | 通过 | 见 §8.2 / §8.5 |
| 下游只测接缝边界已明确 | 通过 | 见 §8.4 |
| 一票否决关联已记录 | 通过 | 见 §8.6 |
| 可进入 Step 3 | 通过 | 下一步抽取测试对象与测试切口 |
