# L2-tools 01 架构设计 Step 14: 风险与待确认事项

> 创建日期: 2026-08-04
> 状态: completed
> 当前模式: full-restart
> 执行模式: single_agent_serial
> 对应 SOP: `standards/document/架构设计讨论流程_SOP.md` Step 14
> 正式文档回填位置: `01-架构设计.md` 第 15 章

---

## 1. 本步输入与目标

### 1.1 本步目标

收纳 Step 1~13 尚未关闭且会影响 L2 工具行动契约主线、后续正式设计或正向验证的架构风险与待确认事项。风险表只记录已经识别的影响、当前保守约束和阻塞性;待确认事项表只记录仍缺外部信息或前置裁决的问题、缺失确认与挂起口径,不写最终方案、任务、负责人、日期或实现步骤。

### 1.2 输入与读取结论

| 输入 | 读取结论 | 本步约束 |
|---|---|---|
| 正式 `00-需求文档.md` §15 | `R-L2T-001~012`、`Q-L2T-001~008` 和 `L2T-UP-001~009` 全部开放。 | 不因架构主线逻辑闭合而改写为 resolved。 |
| Step 1 | `AR-L2T-001~008` 已把九项 blocker 及 forbidden-body / measurement 风险提升为架构基线。 | 八项 AR 必须全部进入正式第 15 章。 |
| Step 2~7 | Owner、职责、上下文、运行角色和 compile/runtime/event 依赖方向已收稳。 | 已定边界不是待确认;其未来回流属于正式风险。 |
| Step 8~12 | 四类数据、时点锚定、三类通信、十一项机制、方案取舍和六类横切约束已收稳。 | 不能把风险表写成对已定结论的重复;只记录仍可能打穿这些结论的问题。 |
| Step 13 | 开放 seam、物理共载、非量化口径和外围缺失是可接受债务,但阻塞受影响的正向 ready 声明。 | 可接受债务本身不自动成为风险;错误补齐或越过门禁才构成风险。 |
| 架构 SOP Step 14 / 书写规范 4.15 | 风险和待确认事项必须拆表,分别使用固定五列。 | 风险写阻塞性;待确认写缺失确认,禁止假挂起。 |
| 已完成项目 Step 14 | 使用风险表、待确认表、当前口径说明、blocker 映射和 historical audit。 | 只参考结构粒度,不复制其他仓风险。 |

### 1.3 Step 内计划

| 模块 | 状态 | 产物 | 门禁 |
|---|---|---|---|
| 恢复与标准读取 | done | §1 | 当前只允许 Step 14。 |
| 风险归并先思考 | done | §2~3 | 已知影响与缺失确认分离。 |
| 风险归并再写入 | done | §4.1 | AR 基线和架构回流风险完整。 |
| 待确认先思考 | done | §3.2 | 八项 Q 均有真实缺失确认。 |
| 待确认再写入 | done | §4.2 | 固定五列表完整。 |
| Blocker / 阻塞性审计 | done | §4.3~4.4 | 九项 blocker 无伪闭口。 |
| Historical / 回填 / 门禁 | done | §5~8 | 无任务化或最终方案。 |

---

## 2. SOP 问题回答

### 2.1 当前有哪些尚未关闭的架构风险

当前风险分为四类:开放正向合同被本地猜测补齐;外部 owner / source / status 被误写为 L2 truth;历史主线或错误依赖回流;缺少测量与证据 authority 时伪造量化、ready 或验收事实。它们已知会影响 owner、依赖、数据、关键交互或后续验证,因此属于风险,不是普通 TODO。

### 2.2 风险影响哪一层结构

Authorization 风险集中影响 `A4/P3` 和执行前同步门禁;Sandbox 风险影响 `A4/A5/P4` 的 handoff、source 和 outcome 适配;Observability 风险影响 `A5/P6` 与 event collaboration;Core 风险影响全仓 compile authority;SDK 风险影响 future consumer boundary;forbidden body、旧主线回流和伪证据风险横切所有后续文档。每项影响范围在风险表中具体标注,不使用“全局相关”替代。

### 2.3 当前还有哪些待确认事项

待确认事项继续为正式 00 的 `Q-L2T-001~008`:authorization owner/source/taxonomy 及结果消费边界、Sandbox 双向 mapping 与 receipt/feedback/cleanup seam、Observability producer/source/route/workspace readiness、Core Tools shared contract authority、SDK client seam 和 NFR 量化 authority。这些问题当前没有足够外部输入,不能由 L2 单方面定论。

### 2.4 哪些待确认会影响前文成立

它们不推翻 Step 1~13 的逻辑 owner、依赖类型、数据红线和失败语义,所以不阻塞正式 01 的逻辑架构装配。但它们分别有条件阻塞受影响的正向概要 / 详细 / 配置 / 测试 / 验收 / 实施边界;例如 Sandbox mapping 未闭口时,不能把逻辑 seam 写成可落码的正向执行 / 结果转换合同。

### 2.5 哪些风险阻塞后续推进

任何 owner 迁移、forbidden body、self-authorization、Sandbox 旁路、外部状态反写、sibling compile dependency、旧主线回流或伪 evidence 一旦出现在后续正式文档中,都会阻塞该文档通过。开放合同本身对 01 不阻塞,但对需要具体 contract / schema / route / test / readiness 的后续范围构成有条件阻塞。SDK client seam 对 L2 当前主线不阻塞,保持 future/excluded 即可。

---

## 3. 诊断与判定取舍

### 3.1 已知风险与开放问题分离

“Authorization owner 是谁”尚无定论,所以是待确认事项;“如果 L2 在 owner 未定时自补 allow/deny 会形成 self-authorization”是已知风险。相同分法适用于 Sandbox、Observability、Core 和 SDK:缺什么外部裁决写入 Q 表,错误补齐会导致什么结构破坏写入 AR 表。这样既不把未知写成事实,也不让未知成为后续 Agent 自由发挥的理由。

### 3.2 可接受债务不自动升级为风险

三类运行角色可同部署、具体产品未选、外围增强未进入和 NFR 暂不量化,在当前约束下不会打穿主线,因此不单独列为风险。若同部署导致写权混并、产品选择改变 owner、外围反写或无 authority 伪造指标,才命中风险表。五核心语境未来是否独立部署由证据触发,不是当前待确认问题。

### 3.3 风险阻塞口径

- `阻塞`:该问题一旦存在,当前或后续主线无法成立,不得带入下一门禁。
- `有条件阻塞`:不阻塞正式 01 的逻辑结论,但阻塞涉及具体正向合同、实现、测试或 readiness 的范围。
- `不阻塞`:在 current/future 边界下可继续推进,且不要求本仓闭口外部 owner。

### 3.4 不新增上游 blocker

本步新增 `AR-L2T-009` 只是对 Step 2~13 已识别的历史主线、相邻 owner 与依赖类型回流风险作架构归并,不表示发现新的上游缺口。上游 blocker 集仍严格为 `L2T-UP-001~009`。

---

## 4. 结构化中间产物

### 4.1 风险表

| 风险项 | 影响范围 | 当前处理口径 | 是否阻塞 | 说明 |
|---|---|---|---|---|
| `AR-L2T-001` Authorization 缺口被 L2 自补为 effective decision | `A4/P3`;governed invocation;同步执行前门禁;后续 `02~05/07` | 只声明工具风险 / 执行要求并消费正式结果;owner/source/result 不可验证时 fail closed;Hub visibility、本地摘要或 Sandbox policy 不得当 allow/deny。 | 有条件阻塞 | 来源为 `R-L2T-001`、`L2T-UP-001~002`;不阻塞 owner-pending 逻辑架构,但阻塞 governed 正向合同 / 验证。 |
| `AR-L2T-002` Sandbox invocation/source/outcome mapping 被旧对象或猜测补齐 | `A4/A5/P4`;canonical invocation;execution source;normalized outcome;后续 `02/03/05/06` | 只保留 L2 semantic adapter responsibility、正式 source ref、映射失败和 gap;mapping 未定稿前不声称正向执行 / 结果转换可落码。 | 有条件阻塞 | 来源为 `R-L2T-002`、`L2T-UP-003`;错误 mapping 会形成多义或不可追溯终态。 |
| `AR-L2T-003` Sandbox receipt/feedback/cleanup seam 被伪称存在 | `A4/P4`;handoff attempt;外部 accepted/receipt/run/cleanup;后续 `02~07` | 只记录本地 handoff eligibility/context/attempt/gap;不命名 receipt、DLQ、feedback、release 或外部成功状态。 | 有条件阻塞 | 来源为 `R-L2T-003`、`L2T-UP-004`;逻辑 attempt 不等于外部 receipt truth。 |
| `AR-L2T-004` Observability producer/source/route 或 workspace readiness 被伪造 | `A5/P6`;event collaboration;safe material;测试 / evidence / readiness;后续 `01~07` | 只承认本地 safe eligibility、submission attempt/degradation/gap 和 current workspace input;不私造 event/schema/route/projection、immutable baseline 或 observed。 | 有条件阻塞 | 来源为 `R-L2T-004~005`、`L2T-UP-005~007`;事件依赖成立不表示正向 route ready。 |
| `AR-L2T-005` Core Tools shared contract 被本地复制或错误归权 | 全仓基础语义;`P1`;compile dependency;跨仓 schema/package;后续 `01~03/05/07` | 只引用正式适用共享类别,保持 Core 唯一 compile authority;具体 Tools schema/package 未确认时保留 authority gap。 | 有条件阻塞 | 来源为 `R-L2T-006/012`、`L2T-UP-008`;本地复制会形成双 shared contract。 |
| `AR-L2T-006` SDK client 包装反向定义服务端工具合同 | Future consumer boundary;canonical semantics;依赖方向;SDK 联调 | `DB-L2T-008` 保持 future/excluded;客户端说明只读消费正式服务端语义,不承诺 client、语言包、method、coverage 或联调状态。 | 不阻塞 | 来源为 `R-L2T-007/012`、`L2T-UP-009`;只要保持裁剪边界,L2 当前主线可独立成立。 |
| `AR-L2T-007` Forbidden body 借归一化、审计、加密、诊断或交接回流 | `A1~A5/S1~S3/P1~P6`;truth/snapshot/audit/handoff;后续 `02~06` | Raw prompt/request/transport/capture/provider body、secret、credential、高敏引用和 evidence 正文无条件排除;外发同时满足四项合取门禁。 | 阻塞 | 来源为 `R-L2T-010`;一旦允许正文进入即打穿数据 owner 和安全底线。 |
| `AR-L2T-008` 无 measurement/evidence authority 时伪造量化、测试或签署事实 | NFR;测试方案;验收标准;实施计划;`05~07` | 只保留结构性判断口径;不写 P95/P99/QPS/SLA/百分比、测试通过、run、evidence alias、签署或 readiness。 | 有条件阻塞 | 来源为 `R-L2T-011`、`Q-L2T-008`;不阻塞逻辑设计,但阻塞任何量化通过或验收声明。 |
| `AR-L2T-009` Historical material、相邻 owner 或错误依赖类型回流 | 仓定位;五核心语境;依赖方向;数据归属;通信;演进;全部后续正式文档 | 旧 Python/Rust、builtin/MCP/extras、local registry/allowlist、三态 executor、固定 API/event/error/SLA/ADR 只作 historical material;Runtime/Hub/Auth/Sandbox/Bus/Obs/SDK owner 不并入;依赖只用 compile/runtime/event。 | 阻塞 | 来源为 `R-L2T-008~009/012` 和 Step 2~13;回流会直接推翻 full-restart 主线,不是合法演进。 |

### 4.2 待确认事项表

| 待确认事项 | 影响范围 | 缺失确认 | 当前挂起口径 | 说明 |
|---|---|---|---|---|
| `Q-L2T-001` Governed invocation 的正式 authorization owner、source matrix 和高风险 taxonomy | `A4/P3`;系统上下文;依赖;执行前门禁;`02~05/07` | 缺正式 authority 身份、来源优先关系和 taxonomy owner 的上游裁决。 | Authorization 维持 owner-pending;不推定 Governance 直边或本地优先级;受影响路径 fail closed。 | 逻辑消费 seam 成立,但 owner/source 未形成定论。 |
| `Q-L2T-002` Authorization result 的 ref/safe-summary、freshness、冲突与重评语义 | `P3/D1`;消费时点;A4 判断;交互 / 一致性;`02~05` | 缺正式结果合同允许材料、source verification、时点有效性和冲突 / 重评规则。 | 只确认 L2 拥有来源可验证性和自身消费判断;不拥有 decision truth,不定义字段或状态。 | 影响正向对象和状态设计,不改变 fail-closed 红线。 |
| `Q-L2T-003` Canonical ToolInvocation 与 Sandbox generic execution / capture / failure / outcome 的 mapping authority | `A4/A5/P4`;adapter;正向执行与结果转换;`02/03/05/06` | 缺双方正式语义映射、允许 source material、mapping owner 与失败边界确认。 | 只保留逻辑 adapter boundary 和 source-ref 要求;positive execution/outcome mapping 保持 blocked。 | 不得从旧 executor 或 capture schema 反推。 |
| `Q-L2T-004` Sandbox handoff receipt、dead-letter、investigation feedback、cleanup release seam | `A4/P4`;异步 source delivery;恢复 / gap;`02~07` | 缺外部 receipt / feedback / cleanup authority、carrier 和状态语义确认。 | 只保留本地 context/attempt/gap 与正式重入原则;不命名 route、receipt、DLQ 或 release 状态。 | 影响正向交接生命周期,不改变 Sandbox owner。 |
| `Q-L2T-005` Tools safe material 的 Observability producer/source/route 与可引用 workspace readiness | `A5/P6`;Bus event collaboration;观测交接;配置 / 测试 / evidence;`01~07` | 缺正式 producer/source family、route、消费合同以及上游链 / workspace 可引用状态确认。 | 保留 `DB-L2T-007` event 关系和 current workspace input;不定 enum/event/schema/topic/route/projection/immutable baseline。 | 影响正向观测交接,不影响 local outcome/audit 成立。 |
| `Q-L2T-006` Core 对 Tools shared contract 的正式 authority 与最小共享类别 | `P1`;compile contract;基础 ID/error/trace/metadata/envelope;`01~03/05/07` | 缺 Core 正式 Tools-specific schema/package owner 与最小类别裁决。 | 只保留共享类别候选和 Core compile authority;L2 不复制字段、类型或 package。 | 影响跨仓对象定稿,不改变依赖方向。 |
| `Q-L2T-007` L2 服务端合同与 SDK tools client seam、语言包装和联调边界 | Future SDK consumer;客户端说明;跨语言 canonical semantics | 缺 SDK owner 的消费合同需求、client boundary 和联调前置确认。 | `DB-L2T-008` 保持 future/excluded;客户端说明不升级为 SDK client 或 coverage。 | 不阻塞当前 L2 主线;由 SDK 独立设计触发。 |
| `Q-L2T-008` 哪些 NFR 判断口径可升级为量化测试 / 验收目标 | 性能 / 可用性;`05/06/07`;evidence / signoff | 缺正式接口、负载模型、测量对象、阈值来源、环境和 evidence authority。 | 继续使用 Step 12 的结构性判断口径;不固定数字、alias、run 或签署。 | 只有真实 authority 成立后才能提出并验证量化候选。 |

### 4.3 上游 blocker 承接表

| Blocker | 风险承接 | 待确认承接 | 对正式 01 | 实际阻塞点 |
|---|---|---|---|---|
| `L2T-UP-001` | `AR-L2T-001` | `Q-L2T-001~002` | 不阻塞逻辑架构 | Authorization owner / result consumption contract。 |
| `L2T-UP-002` | `AR-L2T-001` | `Q-L2T-001~002` | 不阻塞逻辑架构 | Source matrix、taxonomy 与测试分类。 |
| `L2T-UP-003` | `AR-L2T-002` | `Q-L2T-003` | 不阻塞逻辑架构 | Sandbox mapping、结果转换与验证。 |
| `L2T-UP-004` | `AR-L2T-003` | `Q-L2T-004` | 不阻塞逻辑架构 | Receipt / feedback / cleanup 正向 seam。 |
| `L2T-UP-005` | `AR-L2T-004` | `Q-L2T-005` | 不阻塞逻辑架构 | Observability producer/source/route。 |
| `L2T-UP-006` | `AR-L2T-004` | `Q-L2T-005` | 不阻塞逻辑架构 | Upstream readiness / evidence 声明。 |
| `L2T-UP-007` | `AR-L2T-004` | `Q-L2T-005` | 不阻塞逻辑架构 | Immutable source attribution / baseline。 |
| `L2T-UP-008` | `AR-L2T-005` | `Q-L2T-006` | 不阻塞逻辑架构 | Shared schema / package authority。 |
| `L2T-UP-009` | `AR-L2T-006` | `Q-L2T-007` | 不阻塞逻辑架构 | SDK client contract / 联调。 |

### 4.4 当前门禁状态

| 范围 | 当前状态 | 门禁口径 |
|---|---|---|
| 正式 `01-架构设计.md` 逻辑装配 | `not_blocked_by_upstream_contract` | 可基于保守 seam 完成 Step 15~16,但必须保留风险 / 待确认。 |
| Authorization / Sandbox / Observability / Core 正向对象与协议 | `blocked_by_open_contract` | 对应 Q 闭口前不得声称可落码、ready 或 verified。 |
| SDK tools client | `future_excluded_pending_owner_design` | 不进入 L2 当前主链或实施依赖。 |
| NFR 量化、测试结果、验收 / 实施证据 | `blocked_by_measurement_and_evidence_authority` | Q8 闭口且真实验证前不得定量、声称通过或签署。 |
| 任何命中 AR7 / AR9 的后续文档 | `blocked_by_architecture_invariant_violation` | 必须先恢复 owner、正文和依赖红线,不能以风险接受方式放行。 |

### 4.5 当前处理口径说明

本章把已经能够说明结构破坏后果的问题写成风险,把仍缺正式 owner、contract、mapping、route、client 或 measurement 裁决的问题写成待确认事项。风险的当前口径只规定未关闭时如何保守约束以及阻塞什么,不提供最终解决方案;待确认事项只说明缺什么和怎样挂起,不预支外部 owner 的答案。可接受债务不会因为仍未实现就自动升级为风险,但用旧材料或本地猜测填补债务会命中相应风险。正式 01 的逻辑完成不会关闭任何上游 blocker。

---

## 5. Historical material 差异审计

| 旧风险 / 待确认表达 | 当前裁决 |
|---|---|
| MCP provider 稳定性、builtin inventory 覆盖、extras 装配、member-images 发布 | 产品库存 / 适配 / 装配问题,不属于当前 L2 架构风险。 |
| Python/Rust 选型、monorepo 拆服务、具体数据库或 broker | 实现 / 承载候选,除非改变 owner 或依赖方向,否则不是当前风险。 |
| 固定 event/error/replay/SLA 的实现缺口 | Historical material,不能恢复为待确认问题或默认方案。 |
| 本地 allowlist、policy cache、provider fallback 如何实现 | 已违反 owner / fail-closed,不是待确认方案;命中 `AR-L2T-001/009`。 |
| Observability route、Sandbox receipt、Core schema 被旧正式文档视为已有 | 当前明确开放,分别进入 `Q-L2T-003~006`;旧声明不能闭口。 |
| 旧 ADR-0005/ADR-0009 | 无当前 ADR authority,不作为风险已决证据;Step 15 ADR 状态保持 `未建立`。 |

---

## 6. 回填草稿

正式 01 第 15 章使用 §4.1 风险表、§4.2 待确认事项表和 §4.5 当前处理口径说明。§4.3 blocker 映射和 §4.4 门禁状态作为校准审计来源,正式章按需保留简短 blocker 说明,但不得把“对 01 不阻塞”改写成“问题已解决”。`AR-L2T-001~009`、`Q-L2T-001~008` 与 `L2T-UP-001~009` 的编号和状态必须保持一致。

---

## 7. 待确认事项

本步未发现新的上游 blocker。所有待确认项已经进入 §4.2,无需用户在正式 01 装配前即时裁决;它们不会阻塞 Step 15 的 ADR / 追溯审计,但必须作为追溯来源和后续文档门禁继续保留。

---

## 8. 自检与门禁

| 检查项 | 结果 |
|---|---|
| 风险与待确认事项是否拆表 | pass |
| `AR-L2T-001~008` 是否全量保留 | pass |
| 新增 `AR-L2T-009` 是否仅为架构风险而非上游 blocker | pass |
| 每项风险是否有范围、当前口径和阻塞性 | pass |
| 每项待确认是否有真实缺失确认和挂起口径 | pass |
| `Q-L2T-001~008`、`L2T-UP-001~009` 是否全量承接 | pass |
| 是否区分逻辑架构完成与正向 ready | pass |
| 是否避免任务、最终方案、空泛风险和假挂起 | pass |
| 是否避免 historical material、schema、route、metric 或 evidence 伪事实 | pass |

```text
current_step = Step 14 risks_open_questions completed
gate_status = pass
gate_reason = nine formal architecture risks and eight open questions are separated with concrete impact, conservative handling, blocking scope and full L2T-UP-001~009 preservation
next_allowed_action = create_and_complete_01_arch_step_15_adr_traceability
formal_document_write_allowed = false
commit_required = false
```
