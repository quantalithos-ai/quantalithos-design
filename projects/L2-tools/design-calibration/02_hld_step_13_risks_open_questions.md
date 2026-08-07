# L2-tools 02 概要 Step 13: 设计风险与待确认事项

> 创建日期: 2026-08-05
> 状态: completed
> 当前模式: full-restart / single-agent-serial
> 文档级 flow: `design-calibration/02_hld_calibration_flow.md`
> 正式文档目标: `projects/L2-tools/02-概要设计.md`
> 本轮口径: 只收纳当前概要设计层仍需保守处理的设计风险与确实缺少正式答案的待确认事项；Step 12 已稳定承接给 03 的对象、接口、流、状态、异常和配置实现契约不重新挂起，不写 backlog、任务、排期或实施方案。

---

## 0. Step 开工确认

| 项目 | 记录 |
|---|---|
| Step | Step 13 设计风险与待确认事项 |
| 已读取台账 / flow | yes |
| 已读取前序 Step | yes: Step 4~12，特别是 Step 12 §12 / §14 / §18 |
| 已读取 SOP / 书写规范 | yes: 概要 SOP Step 13；概要书写规范 §4.13 |
| 已读取正式输入 | yes: 正式 00 / 01 风险、待确认、blocker 与追溯缺口 |
| 已读取参考粒度 | yes: Governance、Artifact、Capability Hub Step 13 |
| 旧材料处理 | 旧风险、SLA、上线项、技术选择只作 historical pollution；不得恢复为 current risk baseline |
| 进入条件 | pass: Step 12 completed |
| next_allowed_action | 输出风险表、待确认表、blocker 映射、阶段阻塞口径和 Step 14 保留规则。 |

## 1. Step 内计划

| 模块 | 状态 | 产物 | gate_status |
|---|---|---|---|
| 标准 / 上游 / 参考读取 | done | §0~§2 | pass |
| SOP 问题回答 / 筛选规则 | done | §3~§4 | pass |
| 设计风险清单 | done | §5 | pass |
| 待确认事项清单 | done | §6 | pass |
| Blocker / 阻塞层级映射 | done | §7~§8 | pass |
| 排除 / 历史污染 / 正式回填 / 门禁 | done | §9~§12 | pass |

## 2. 本步输入与筛选边界

| 输入 | 可进入风险 / 待确认 | 不得重复挂起 |
|---|---|---|
| Step 4~11 | 会导致已收稳主体、owner、写权、状态或安全边界被破坏的风险 | 已经确认的六组成部分、41 对象、接口名、flow family、state semantics |
| Step 12 | Blocked condition、未进入稳定承接的外部答案、实现前闭口风险 | 03 已明确需展开的 fields / DTO / traits / transaction / typed errors / config types |
| 正式 00 / 01 | 仍影响概要与 03 的 `AR/Q/L2T-UP` 结论 | 已被 02 完整转译的架构主线和需求目标 |
| 旧 README / 02 / 03 / 05 / 06 | Historical material 回流风险 | 旧技术、接口、指标、测试和上线结论本身 |

## 3. SOP 问题回答

1. 已构成风险但尚需持续防守的问题包括：authorization self-fill、Sandbox mapping 猜测、receipt / route / readiness 伪造、Core contract 复制、SDK 反向定义、41 对象 / 多状态 owner 被压扁、forbidden body 回流、Outcome/Audit 原子关系弱化、非 owning flow 修 truth、迟到材料覆盖终态、blocked skeleton 被误读为 ready、historical model / technology 回流、量化 / evidence 伪造。
2. 尚缺正式答案的事项主要是 `L2T-UP-001~009` 对应 authority、source、taxonomy、mapping、receipt、route、baseline、Core contract、SDK client，以及量化 measurement / evidence authority 和产品中立实施选择。
3. 每项必须明确影响对象 / API / flow / state / config / downstream，并说明未确认前的 fail-closed、blocked、future、product-neutral 或 non-quantified 口径。
4. 若不收纳，03 最容易把 logical adapter 当 ready provider、把 external material 当 normalized truth、把事件 skeleton 当发布协议、用 generic record 合并 owner、或用旧技术文档补 schema。
5. 普通字段细化、DTO 编写、repository trait、测试用例编写、文档润色、代码目录、任务排期、提交拆分不是风险或待确认；它们已有 03 / 05 / 07 归属。

## 4. 风险与待确认判定规则

| 类型 | 判定条件 | 当前表述方式 |
|---|---|---|
| 设计风险 | 已知存在误设计可能性，发生后会破坏 Step 4~12 已收稳边界 | 写影响与当前保守处理；可标实际阻塞层级，但不提供实施方案。 |
| 待确认事项 | 正式 owner / contract / mapping / route / client / measurement / technology 答案尚不存在 | 写缺失答案、影响范围和确认前挂起口径。 |
| 03 稳定承接 | 答案的 owner 与方向已经确定，只缺 exact fields / functions / protocols / mechanisms | 不进入待确认表；按 Step 12 继续展开。 |
| 后续任务 | 实施、测试编写、配置填写、提交或排期工作 | 不进入本 Step。 |

## 5. 设计风险清单

| ID | 风险 | 影响 | 当前处理口径 |
|---|---|---|---|
| `HLR-L2T-001` | Authorization 缺口被 L2、Hub visibility、caller role、Sandbox policy 或配置 fallback 自补为 effective decision | `AuthorizationConsumptionAssessment`、`EvaluateExecutionPreconditions`、governed invocation、no-execution 状态与安全测试 | 只消费正式 invocation-bound result；owner / source / result 不可验证即 fail closed，禁止 local allow / deny truth。 |
| `HLR-L2T-002` | ToolInvocation -> Sandbox execution -> source -> outcome mapping 被旧 executor / callback schema 或实现猜测补齐 | `ExecutionHandoff`、`SandboxExecutionSourceRef`、`ExecutionSourceAssessment`、`ToolInvocationOutcome`、正向执行 / 归一化 flow | 只保留 L2 adapter responsibility、source ref、mapping assessment / gap；mapping 未闭口不声明正向可执行或 outcome 可归一化。 |
| `HLR-L2T-003` | Handoff attempt、Sandbox accepted / receipt / run / cleanup、Bus delivery 与 Observability observation 被合并为统一“外部成功” | 两类 attempt、external refs、状态传播、event collaboration、错误与恢复 owner | Local attempt 与每个 external owner 状态分开；未有正式反馈即 unknown / blocked，不命名伪 receipt / DLQ / observed。 |
| `HLR-L2T-004` | Logical port、Event skeleton、AdapterConfig 方向或 current workspace 文件被误读为 published schema / provider / route / readiness | Step 7 ports/events、Step 8 positive paths、Step 11 config、03/05/06/07 readiness 声明 | 所有相关主语携带 candidate / logical / pending / blocked / future 状态；配置存在不解除 blocker，workspace input 不等于 immutable baseline。 |
| `HLR-L2T-005` | Core Tools shared contract 缺口由 L2 复制 ID / error / trace / envelope 类型填补 | `SharedContractAuthorityRef`、compile dependency、41 对象基础类型、所有跨仓协议 | Core 保持唯一 compile authority；具体 package / type / schema 未闭口时受影响合同保持 candidate / blocked。 |
| `HLR-L2T-006` | Future SDK wrapper / client API 反向定义服务端 canonical invocation / result / error | `ToolConsumerGuidanceView`、SDK seam、接口版本兼容、依赖方向 | 服务端语义独立成立；guidance 只读，SDK 保持 future，不承诺 client / language wrapper / coverage。 |
| `HLR-L2T-007` | 41 个对象、assessment / snapshot / ref、两类 attempt 和多 owner 状态被 generic DTO / record / status 压扁 | Step 6 对象、Step 8 flow transaction、Step 9 状态、追溯与 03 可落码性 | 03 必须逐对象定义 exact contract；需要合并 / 新增主语时回退 Step 6 / 9，不能用 anonymous map 隐藏 owner。 |
| `HLR-L2T-008` | Raw prompt / request / capture / provider response、secret、credential、evidence body 借归一化、审计、加密、诊断、配置或外发回流 | 全部 truth / snapshot / audit / projection / config diagnostic / safe material | Forbidden body 无环境例外；只允许 typed ref / safe summary，外发四项合取且配置只能收紧。 |
| `HLR-L2T-009` | `ToolInvocationOutcome` 与 `ToolAuditEntry` 原子关系被拆开，或 Bus / Observability 材料被当作 audit 替代 | Outcome / audit persistence、consumer read、safe handoff、验收否决项 | Outcome + ToolAuditEntry 同 L2 boundary 收口；不能暴露 outcome-only 半事实，外围材料不替代 audit。 |
| `HLR-L2T-010` | Query、Consumer、Job、projection、diagnostic 或 external feedback 自动采用 definition、替换 Binding、改 outcome 或修 gap subject | 所有 read / async / background path、formal re-entry、state owner | 非 owning path 只写允许 ref / assessment / gap / projection；subject change 必须回到 owning Command。 |
| `HLR-L2T-011` | Duplicate / late / out-of-order / conflicting source 以 last-write-wins 覆盖 invocation anchor、assessment 或 terminal outcome | Idempotency / dedup / ordering、history、correction、state persistence | 保留 consumption-time anchor，形成新 assessment / gap / correction / superseding fact；terminal 不原地覆盖。 |
| `HLR-L2T-012` | Historical registry / ToolPolicy / host executor / MCP / builtin / ToolHealth / replay 模型或旧技术栈回流 | 六组成部分、对象 / API / flow、dependency、config、03 technology design | 旧材料只作污染审计；任何恢复旧主语须按 full-restart 上游来源重新证明，不能作为默认实现。 |
| `HLR-L2T-013` | 具体 DB / broker / cache / framework / topology 或配置产品反向改变 truth owner、transaction、dependency 或 state semantics | Step 4 分层、ports / stores、local-truth-first、config redlines | 02 保持产品中立；03 / 04 可选承载，但不得违反 owner、atomicity、formal re-entry 与 blocked seam。 |
| `HLR-L2T-014` | 无 measurement / evidence authority 时写入 SLO、成功率、测试通过、run、evidence alias、signoff 或 readiness | NFR、05/06/07、正式参考 / 风险、评审结论 | 只保留结构性判断和未来验证输入；不量化、不伪造实现 / 测试 / 验收事实。 |

## 6. 设计待确认事项清单

| ID | 待确认 | 影响范围 | 当前挂起口径 |
|---|---|---|---|
| `HLQ-L2T-001` | Governed invocation 的正式 authorization owner、source matrix 与 high-risk taxonomy authority 是什么 | `ExecutionRequirement`、authorization port、precondition flow、配置 / 测试分类 | Authority 保持 pending；不推定 Governance 直边或本地优先级，受影响 path fail closed。 |
| `HLQ-L2T-002` | Authorization result 允许的 ref / safe summary、subject / invocation binding、freshness、conflict、constraint 与 re-evaluation contract 是什么 | `AuthorizationResultRef`、assessment variants、sync consume / async clue、state / error / tests | 只定义 L2 consumption assessment 和 conservative variants；不定外部字段 / provider / decision lifecycle。 |
| `HLQ-L2T-003` | Canonical ToolInvocation 与 Sandbox generic command / capture / failure / cleanup 到 source / outcome 的正式 mapping authority 和最小 contract 是什么 | Sandbox ports、handoff / source objects、normalization、positive path / tests | 保留 logical adapter / mapping-blocked / source-not-accepted；不从旧 schema 反推。 |
| `HLQ-L2T-004` | Sandbox handoff receipt、source delivery、dead-letter / investigation feedback 与 cleanup / release seam 是否及如何正式存在 | Execution attempt、external source intake、gap / recovery、03~07 | 只保留 local attempt / gap / formal re-entry；不命名 route / receipt / DLQ / release state。 |
| `HLQ-L2T-005` | Tools safe material 的 Bus / Observability producer、source family、route、feedback 和 current workspace readiness authority 是什么 | Event skeleton、publisher / Consumer config、external refs、05/06 evidence / readiness | 保留 body-free material、local submission / route-blocked / unknown；不定 schema / topic / observed / immutable baseline。 |
| `HLQ-L2T-006` | Core 中 Tools-specific shared contract 的正式 package / type / schema authority及最小共享类别是什么 | `SharedContractAuthorityPort/Ref`、41 对象基础类型、cross-repo compile / compatibility | Core-only compile 保持；具体类型仍 candidate / blocked，不在 L2 复制。 |
| `HLQ-L2T-007` | SDK 对 L2-tools 服务端合同的 client seam、language wrapper、version compatibility 与联调边界是什么 | Guidance Query、future consumer、canonical API compatibility | SDK 保持 future / excluded；不影响当前服务端逻辑完成，不声明 client ready。 |
| `HLQ-L2T-008` | 哪些结构性 NFR 可升级为量化 SLO / capacity / test / acceptance targets，measurement / evidence authority 是什么 | 05 / 06 / 07、performance / availability / evidence / signoff | 继续使用非量化结构口径；不固定数字、环境、alias、run 或签署。 |
| `HLQ-L2T-009` | Current workspace input 何时可成为 frozen / immutable upstream design baseline | Source attribution、cross-repo contract review、readiness / evidence claims | 逐文件 / section 引用 current workspace；不声称 commit-frozen、released 或 approved。 |
| `HLQ-L2T-010` | 03 应采用的语言 / module、persistence、transport、publisher、projection / scheduler 产品与物理部署形态是什么 | Code organization、Store / Adapter / Publisher / JobConfig、transaction / operations | 当前保持产品中立和逻辑可同部署；选择不得改变 Step 4~12 主语与依赖红线。 |

## 7. 上游 blocker 承接映射

| Blocker | 风险承接 | 待确认承接 | 当前不阻塞 | 实际阻塞点 |
|---|---|---|---|---|
| `L2T-UP-001` authorization owner | `HLR-L2T-001` | `HLQ-L2T-001~002` | 正式 02 逻辑概要完成；03 本地 fail-closed contract | Positive authorization provider / authority / result consumption integration。 |
| `L2T-UP-002` source matrix / taxonomy | `HLR-L2T-001` | `HLQ-L2T-001~002` | Requirement / assessment logical design | Exact taxonomy、source precedence、constraint / freshness mapping and positive tests。 |
| `L2T-UP-003` Sandbox mapping | `HLR-L2T-002` | `HLQ-L2T-003` | Handoff / source / assessment / blocked error design | Positive invocation-to-command / capture-failure-to-outcome mapping and validation。 |
| `L2T-UP-004` receipt / feedback / cleanup | `HLR-L2T-003~004` | `HLQ-L2T-004` | Local attempt / gap / unknown design | External receipt、delivery / investigation feedback、retry / DLQ、cleanup lifecycle。 |
| `L2T-UP-005` Observability producer / source | `HLR-L2T-003~004` | `HLQ-L2T-005` | Safe material / local submission / route-blocked design | Producer / source family、route、feedback / observed contract。 |
| `L2T-UP-006` Observability formal-chain conflict | `HLR-L2T-004 / 014` | `HLQ-L2T-005 / 009` | Current workspace source citation | Implementation readiness、positive tests、acceptance / evidence claims。 |
| `L2T-UP-007` uncommitted workspace baseline | `HLR-L2T-004 / 014` | `HLQ-L2T-009` | Current file / section input | Frozen commit / immutable / released / approved baseline attribution。 |
| `L2T-UP-008` Core Tools shared contract | `HLR-L2T-005` | `HLQ-L2T-006` | Authority port / candidate ref / conservative errors | Concrete compile package / type / schema / version and cross-repo contract tests。 |
| `L2T-UP-009` SDK Tools client | `HLR-L2T-006` | `HLQ-L2T-007` | Server logical API / guidance design | Client / wrapper / compatibility / integration coverage。 |

`HLQ-L2T-008` 的 measurement / evidence authority 与 `HLQ-L2T-010` 的产品 / 物理承载选择没有新增 `L2T-UP` 编号：前者阻塞量化测试、验收和 readiness 声明；后者是 03 / 04 的产品中立设计输入，只有当选择试图改变 owner / dependency / invariant 时才升级为架构回退问题。

## 8. 当前阶段阻塞口径

### 8.1 不阻塞 Step 14 / 正式 02 完成

以下条件已经满足，因此风险与待确认不阻塞正式概要设计装配：

- 六组成部分、41 对象、接口 / ports、12 flow families、多状态族、异常和配置边界已经逻辑闭合。
- 每个开放 seam 都有 explicit blocked / conservative / unknown / future 状态和失败口径。
- 正式 02 可以说明“需要什么合同”和“缺失时如何保守处理”，无需伪造外部 owner 的最终答案。
- 风险 / 待确认事项不会改变当前 L2 truth owner、数据边界、依赖裁剪、canonical semantics 或 local-truth-first。

### 8.2 不阻塞 03 的本地逻辑详细设计

03 可继续设计：

- 41 对象 exact local contracts、owner-qualified states / errors、local stores / transactions。
- Command / Query / Consumer / Job / Port 的 logical / blocked-aware contracts。
- Fail-closed / source-not-accepted / route-blocked / unknown / future surfaces and negative tests input。
- Config validator ensuring blocked seams cannot be enabled without formal contracts。

### 8.3 会阻塞 03 / 05 / 06 / 07 的正向声明

| 未闭口项 | 被阻塞的声明 |
|---|---|
| Authorization owner / source / taxonomy / result contract | Governed positive invocation flow、provider adapter、allow / constrained mapping、positive contract tests。 |
| Sandbox mapping / receipt / feedback / cleanup | End-to-end isolated execution、accepted / receipt / run mapping、normalized positive outcome、recovery verification。 |
| Observability producer / source / route / readiness | Published / delivered / observed integration、observation feedback、positive evidence / acceptance。 |
| Core Tools shared contract | Final cross-repo compile types / schema、compatibility tests、implementation boundary ready。 |
| SDK Tools client | Client contract / wrapper / integration / coverage claims。 |
| Measurement / evidence authority | SLO / capacity targets、test pass、evidence alias、acceptance signoff、readiness。 |
| Frozen upstream baseline | Immutable / commit-bound design input or reproducibility claim。 |

任何后续文档若需要上述正向声明，必须保持 blocked 或先由正式 owner 闭口；不能用 mock、fake adapter、历史 schema、配置或逻辑 skeleton 代替正式 contract truth。

## 9. 不作为设计风险或待确认事项的内容

| 内容 | 不纳入原因 | 后续归属 |
|---|---|---|
| 41 对象 exact fields / functions / enum / DomainError | Owner 与方向已收稳，只缺详细设计 | 03 |
| Command / Query DTO、Consumer envelope、Event payload、Job report、Port trait | Interface skeleton 已收稳，只缺 exact protocol | 03；blocked cross-repo parts retain blocker |
| Repository / transaction / idempotency / dedup / ordering mechanism | Invariants 已收稳，只缺 implementation design | 03 |
| ConfigLoader / Validator / typed config / builder contracts | Step 11 已稳定交付 | 03 |
| Exact config key / default / env / secret / endpoint / schedule | 配置说明，不是概要未知主语 | 04 |
| Test cases / fixtures / fault injection / evidence path | 测试与验收设计 | 05 / 06 |
| Implementation tasks / owner assignment / commits / sequence / skeleton | 实施计划 | 07 |
| 文档润色、章节排序、交叉引用修正 | 不影响设计边界 | Step 14 |

## 10. Historical pollution 审计

| Historical risk / question | Why invalid now | Current treatment |
|---|---|---|
| Builtin / MCP inventory growth、multiple host adapters | Product / provider implementation outside current truth boundary | Not a current risk / question;only historical contamination risk `HLR-L2T-012`。 |
| Governed / restricted local ToolPolicy taxonomy | Assumes L2 authorization owner | Replaced by `HLQ-L2T-001~002` formal owner / result questions。 |
| Member-service host callback / stdout mapping | Old owner and raw-body path conflict | Replaced by `HLQ-L2T-003~004` Sandbox formal mapping / receipt questions。 |
| ToolHealth / retryable errors / Runtime recovery | Merges derived / carrier / orchestration owners | Not a current design candidate;protected by `HLR-L2T-003 / 007 / 010~012`。 |
| Fixed RPC / HTTP / Rust / Python / DB / event topics | Historical implementation preselection | Only product-neutral `HLQ-L2T-010`;choices cannot alter semantics。 |
| Old SLA / availability / P95 / QPS / success rate | No current measurement authority / evidence | Replaced by `HLQ-L2T-008`;no numeric inheritance。 |
| Rollout / rollback / monitoring tasks | Implementation / operations scope | Excluded from Step 13;belongs 07 / operations documentation later。 |

## 11. 正式 §13 回填草稿

正式第 13 章应保留两张独立表：

1. 设计风险表：从 §5 压缩保留 authorization、Sandbox mapping / external statuses、blocked skeleton / readiness、Core / SDK、object / state compression、forbidden body、outcome / audit、non-owning writes / late material、historical / technology / evidence risks。
2. 待确认事项表：保留 §6 全部 10 项及其影响范围、挂起口径。

章后增加短文说明：这些事项不阻塞正式 02 的逻辑完成和 03 的本地 conservative design，但阻塞受影响的 positive cross-repo schema / mapping / route / client / quantitative verification / readiness 声明；`L2T-UP-001~009` 不因正式装配关闭。

正式章不得写风险矩阵、优先级、owner task、deadline、解决方案路线图或“后续优化”；也不得把待确认事项润色为正式结论。

## 12. Step 完成门禁

| 门禁 | 结果 | 说明 |
|---|---|---|
| 风险 / 待确认分离 | pass | 14 risks describe known failure modes;10 questions describe missing formal answers。 |
| 概要层相关性 | pass | 每项影响 Step 4~12 主语、03 gate 或后续 positive claims。 |
| Stable handoff not re-opened | pass | Exact fields / protocols / transactions / config types remain 03 work,not open questions。 |
| Blocker traceability | pass | `L2T-UP-001~009` each maps to risk / question and actual blocking point。 |
| Conservative posture | pass | Missing owner / contract remains fail-closed / blocked / unknown / future / product-neutral。 |
| Step 14 eligibility | pass | All open issues have explicit treatment and do not destabilize current logical overview。 |
| Historical pollution | pass | Old inventory / policy / host / health / technology / SLA questions not restored。 |
| No task / evidence fabrication | pass | No backlog / schedule / commit / run / test result / evidence alias / signoff。 |

```text
step_status = completed
gate_status = pass
next_allowed_action = create_step_14_formal_document_assembly
formal_document_write_allowed = false
commit_required = false
```
