# Step 18. 风险与待确认事项

> 项目：L2-member
> 对应 SOP：`standards/document/详细设计讨论流程_SOP.md` Step 18
> 对应书写规范：`standards/document/详细设计书写规范.md` §5.17
> 中间产物规范：`standards/document/设计文档讨论中间产物规范.md` §4、§5.10
> 粒度 / 格式参考：`projects/L1-governance/design-calibration/03_ddd_step_18_risks_open_questions.md`。只借鉴风险分层、确认方、处置和停审结构；不继承 Governance 的领域、产品选择、事件、outbox 或实施结论。
> 回填目标：未来正式 `projects/L2-member/03-详细设计.md` §17。
> 状态：`completed / pass_with_upstream_and_design_blockers / stop_review`；本文件不代表正式实现移交、实施启动、测试执行、验收、证据、报告、signoff 或 readiness。

## 1. Step 状态

| 项 | 当前记录 |
|---|---|
| 当前 Step | Step 18：风险与待确认事项 |
| 前序门禁 | Step 1～17 已完成并各自停审；Step 17 已给出实施承接、字段 / 协议 / 状态预复核和阻塞回流入口 |
| 本步目标 | 将仍影响代码、正式移交、后续 `04/05/06/07` 或正向外部协作的事项，区分为风险、blocker、待确认和历史污染防回流规则 |
| 本步输出 | 风险表、待确认事项表、未确认前处理规则、重开 / 关闭条件和正式 03 §17 回填草稿 |
| 本步非目标 | 不新增 object、field、Port、protocol、state helper、配置默认值、physical product、phase、commit boundary、测试编号或验收判断 |
| 正式正文 | `formal_03_write_allowed = false`；本 Step 不修改旧 `03-详细设计.md`，只提供 Step 19 装配输入 |
| 实现 / 提交 | `implementation_repo_write_allowed = false`；不创建 `/home/aris/Projects/quantalithos-member`，不写代码、不运行测试、不修改 sibling、不提交 |
| 停审方式 | 完成本文件、同步两层台账并做静态自检后停审；只有随后 Step 19 装配门禁才可处理正式 03 |

### 1.1 Step 内计划

| 项 | 状态 | 产物位置 / 说明 |
|---|---|---|
| 读取 Step 17、SOP、书写规范、真相源与 `L1-governance` 同步材料 | completed | §2、§3 的输入和使用上限 |
| 回答 Step 18 四个 SOP 问题 | completed | §3 |
| 诊断旧正式 03、旧 05/06、缺失 04/07 与当前 sibling 边界 | completed | §4 |
| 对风险分层及“记录 / 修复”的边界作出取舍 | completed | §6 |
| 汇总风险、确认方、阻塞范围、关闭 / 重开条件和保守处置 | completed | §7～§8 |
| 形成正式 03 §17 回填草稿 | completed | §9 |
| 静态自检、更新 flow / project ledger 并停审 | completed | §10；Step 18 已停审，Step 19 仅可在本轮既有授权和相邻 Step 门禁下进入 |

## 2. 本步输入

| 输入 | 状态 | 本 Step 使用上限 |
|---|---|---|
| `03_ddd_step_01_upstream_boundary.md`、`03_ddd_step_02_scope.md` | completed | 读取 full-restart、范围、历史污染和 `L2M-UP-001~008` 的原始 owner / fail-closed 上限 |
| `03_ddd_step_03_constraints.md`、`03_ddd_step_04_file_layout.md` | completed | 读取 planned Rust、唯一 Core compile candidate、目标实现仓缺失和 physical / binary non-choice |
| `03_ddd_step_05_module_contracts.md`～`03_ddd_step_10_state_matrix.md` | completed | 读取七模块、34 对象、10/16/14/24/5 协议、28 状态主语和 `L2M-DDD-003~007` / scope helper 缺口 |
| `03_ddd_step_11_persistence_transaction_consistency.md`～`03_ddd_step_16_test_cuts.md` | completed | 读取 logical Store/UoW、错误 / replay、配置、观测和 planned test cut；不把这些写成物理实现或测试事实 |
| `03_ddd_step_17_implementation_handoff.md` | completed / stop_review | 读取实施前检查、跨文档预复核、命名冲突、未进入实施项和回流入口 |
| `project_execution_ledger.md`、`03_ddd_calibration_flow.md` | completed | 恢复当前 Step、授权、blocker 和两层台账同步义务；本 Step 收口后同步为 stop-review 状态 |
| 当前正式 `00/01/02` | formal upstream baseline | 复核 owner、非范围、依赖分类和外部 truth 边界；不重写需求 / 架构 / 概要结论 |
| 当前 `L2-runtime`、`L2-tools`、Core / Bus / SDK、L1 owner 正式材料及 sibling 当前可引用材料 / 台账 | read-only input | 只确认仍未闭合的 exact seam；不把并行 sibling 进行中内容提升为本仓合同 |
| 旧 README、旧正式 `03/05/06` | historical material | 仅诊断 persona、CloudEvents、AG-UI、UDS、launch token、固定 route / product / 指标等污染风险；零继承权 |
| `projects/L1-governance/.../03_ddd_step_18_risks_open_questions.md` | reference only | 参考风险表、待确认表、处置与停审层次；不继承其 23 Command、outbox、产品或 owner 结论 |

## 3. SOP 问题回答

| SOP 问题 | L2-member 回答 |
|---|---|
| 哪些问题仍可能影响代码实现？ | 正式 03 尚未由 Step 19 装配；`04` 和 `07` 尚缺、旧 `05/06` 仅为 historical material；目标实现仓不存在；物理 Store/UoW 未选；八项上游 exact seam 和六项本仓 targeted design repair 仍开放。它们分别限制代码启动、受影响的 local positive lane、external collaboration、durable adapter、测试 / 验收和 phase / commit 审计。 |
| 哪些问题会阻塞实现，哪些只影响后续优化？ | Step 19 正式 03、正式 `04/05/06/07`、目标实现仓和每个受影响 lane 的 design / upstream prerequisite 阻塞正式实现开工。`L2M-UP-001~008` 与 `L2M-DDD-003~007` / `scope_supersede_gap` 阻塞相应正向或 helper-dependent lane；它们不授权本仓以默认值、fake success、字符串或旧协议绕过。物理 product、观测 backend、真实 transport 和性能数值不改变当前逻辑设计，但阻塞相应 durable / integration / operations / acceptance 结论。 |
| 每个待确认事项需要谁确认？ | 外部 truth / exact carrier 由其 owner（member-service、member-images、Runtime、Core / Bus、Identity、Governance、Work / 产品 scope）以正式可引用合同关闭；本仓 schema / factory / flow / helper 缺口由拥有的 Step 6 / 8 / 9 / 10 真相源 targeted repair；文档链由各对应 SOP 的维护动作和用户文档切换授权完成；目标仓和物理实施选择由获得授权的 `07` / implementation owner 在实施前置检查中确认。 |
| 未确认前实现者应该如何处理？ | 不自行补设计或传播假设。保留 typed ref、safe resolution、local attempt / gap 或 `Blocked` / `Waiting` / `Unknown`；Query 保持 no-write，duplicate 只 replay complete typed stored carrier，Unknown inspect-first。没有 formal contract 的 event / route / publisher / outbox、IPC / UDS、credential、token、DB / queue / scheduler 或 Runtime run 均不得创建。 |

## 4. 当前材料问题诊断

| 位置 | 已发现问题 / 风险 | 本 Step 处置 |
|---|---|---|
| 旧 `03-详细设计.md` | 仍以 `MemberRuntimePersona`、`ExposedCapability`、`ExecutionActorBinding`、`MemberVisibleSummary` 和固定 transport / storage 叙事组织，不能作为 full-restart 新版真相源。 | 列为 Step 19 装配前的 historical-pollution 风险；不从旧对象、schema、route、DB 或伪代码继承。 |
| 旧 `05-测试方案.md`、`06-验收标准.md` | 仍引用旧 persona 主线、旧测试 / 验收基线和未核验外部交互；不能承接新版 34 对象、10/16/14/24/5、28 状态和 blocker 口径。 | 仅作历史诊断；后续按 `04 -> 05 -> 06 -> 07` 串行重建 / 复核，不能作为实现或验收入口。 |
| `04-配置设计.md`、`07-实施计划.md` | 当前不存在，因此没有正式配置 truth、phase / commit boundary、implementation ledger 或 boundary 审计入口。 | 列为正式实施启动 blocker；本 Step 不预写 key、产品、phase、commit 或实施台账。 |
| `L2-member-service` / `L2-member-images` 并行窗口 | 可以消费需求级 owner / supply 方向，但 IPC、credential、host lifecycle、pinned release / entry / compatibility / confirmation 等 exact 合同仍未稳定。 | 保持 `L2M-UP-001/002` pending；本仓只保留 local material / attempt / ref / availability / blocked seam。 |
| Step 8～10 与 Step 11～17 | 分母、carrier、flow、state 和 replay 已有设计级承接，但 Consumer receipt 与 CP04～CP07 / scope 的部分 helper 或 flow 不可直接落码。 | 保持 `L2M-DDD-003~007`、`scope_supersede_gap`；明确 owner、阻塞面和 targeted repair，不能由 Step 18 静默修复。 |
| 上游 / historical transport | CloudEvents shared category、AG-UI、UDS / gRPC、launch token、topic / route、DB / broker、fixed port / SLA 等没有形成当前 member-specific authority。 | 全部保持 historical 或 pending；不以配置、fake、planned layout 或本地 attempt 升格为外部 contract。 |

## 5. 改动前后对比

| 项 | 本 Step 前 | 本 Step 后 | 原因 |
|---|---|---|---|
| 未关闭事项的位置 | 分散在 Step 1～17、项目台账及上游 / sibling 材料中 | 以本文件的风险、待确认、处置和关闭条件集中索引，仍回指 owner 真相源 | 让 Step 19 和后续 04～07 能定位风险，不创造第二份 schema / flow 真相源 |
| 上游 pending | `L2M-UP-001~008` 已在各 Step 中出现 | 按 owner、受影响 lane、关闭所需正式合同和 fail-closed 处置汇总 | 防止把并行 sibling 或 Runtime / Core 的方向性材料误读为 exact contract |
| 本仓设计缺口 | `L2M-DDD-003~007`、scope gap 分别散落在对象、flow、state和持久化审计 | 明确每个缺口的 owning Step、阻塞范围、targeted repair 和禁止绕过方式 | 避免 implementation 通过 adapter、fake、repository 或默认值私自补齐 |
| 文档链 / implementation 前置 | Step 17 已列出缺失正式链和目标仓 | 区分“阻塞正式开工”“不阻塞 Step 19 装配”“只阻塞 production / integration” | 不把设计讨论推进误写为已经可以编码或验收 |
| 历史材料 | 旧 03 / 05 / 06 中仍有可被误用的旧名和物理假设 | 记录固定的防回流规则和 Step 19 审计要求 | full-restart 下历史材料只能诊断，不能恢复旧主线 |

## 6. 设计取舍

| 议题 | 备选 | 采用结论 | 原因 / 约束 |
|---|---|---|---|
| 风险是否在 Step 18 直接修复 | A. 直接改前序 Step；B. 只记录并指定 owner / repair 入口 | B | Step 18 的职责是风险与确认事项；schema、factory、flow、state 或 Port 的修复必须回到拥有真相源的 Step，避免无来源跨 Step 改写。 |
| 未闭合上游是否以 local adapter 填平 | A. local default / fake acceptance；B. typed blocked seam | B | `L2M-UP-001~008` 是 owner contract 缺口；fake 只可验证已定义 Port parity，不能成为 carrier、IPC、credential、route 或 external truth。 |
| 24 个 semantic candidate 是否当作普通实施风险 | A. 进入 event implementation queue；B. 保持 non-materialization blocker | B | `L2M-UP-005` 前它们不是 Event，不存在 envelope、publisher、outbox、route、topic、retry 或 delivery 可安排。 |
| 物理 Store / UoW 未定的处理 | A. 在风险表选择 DB / queue；B. 保持 logical contract，后续实施前确认 | B | `L2M-DDD-002` 仅允许 Store / UoW 语义；产品选择、迁移、锁和 durability 不可由本 Step 脑补。 |
| sibling 并行材料的效力 | A. 直接采纳进行中详细契约；B. 只采纳当前正式或明确可引用方向 | B | Layer 3 并行窗口不授予跨仓稳定合同；exact fields / lifecycle / manifest / confirmation 仍必须以 owner 正式材料关闭。 |
| 历史文档的处理 | A. 用旧 03 / 05 / 06 补足下游；B. 用作污染审计并在对应 SOP 重建 | B | 旧 persona、CloudEvents、AG-UI、UDS、launch token 与固定物理产品没有当前 authority；复用会破坏 full-restart。 |

## 7. 结构化中间产物

### 7.1 风险分层图

```text
L2-member detailed-design open risks
  |
  +-- A. Formal design-chain / implementation-start gate
  |     +-- Step 19 formal 03 not assembled
  |     +-- formal 04 / 05 / 06 / 07 not yet current-baseline complete
  |     +-- target implementation repository absent
  |
  +-- B. External owner exact-contract risks
  |     +-- host / image / Runtime / Core-event / credential / screening / subject
  |     +-- L2M-UP-001 ~ L2M-UP-008
  |
  +-- C. Member design targeted-repair risks
  |     +-- Consumer receipt source closure
  |     +-- CP04 / CP05 / CP06 / CP07 helper and flow gaps
  |     +-- subscription scope supersede helper gap
  |
  +-- D. Physical / operational binding risks
  |     +-- Store / UoW / durability product
  |     +-- transport / backend / metric / SLO / performance measurement
  |
  +-- E. Historical-pollution recurrence risks
        +-- persona-mainline / fixed carrier / token / route / product assumptions
```

关键说明：

- A 类阻塞正式实现开工，但不阻塞本 Step 18 或其后的 Step 19 设计装配。
- B 类由外部 owner 关闭；本仓的 local attempt、safe ref、gap 和 blocked disposition 不是正向合同的替代品。
- C 类必须 targeted repair 到 Step 6 / 8 / 9 / 10 等拥有真相源的位置；不得借由 Step 18、adapter、fake 或 repository 间接修复。
- D 类可保留 logical contract，但会阻塞对应 physical / integration / operations / acceptance 结论。
- E 类是 full-restart 质量门禁；任何复发都必须回写 Step 19 污染审计，而不是当作兼容实现。

### 7.2 风险表

| ID / 风险 | 影响 | 阻塞范围 | 缓解 / 关闭条件 | 负责人 / 待确认方 |
|---|---|---|---|---|
| `L2M-RISK-001` 正式 03 尚未装配 | 旧 03 不能作为新版详细设计入口，无法形成受控的正式 implementation baseline | 阻塞正式实现移交与后续 04～07 的正式输入；不阻塞 Step 18 / 19 设计过程 | Step 19 仅从 Step 1～18 装配、逐章标来源并通过静态审计；不得修补旧 03 | 本仓详细设计维护者；Step 19 及用户既有 full-03 授权 |
| `L2M-RISK-002` 下游正式链缺失或历史化 | `04` / `07` 缺失，旧 `05/06` 不能承接新版对象、协议、状态和 blocker；没有正式 config、测试、验收、phase / commit 输入 | 阻塞正式代码开工、测试 / 验收 / phase boundary 审计；不阻塞 Step 19 装配 | 严格在正式 03 停审后按 `04 -> 05 -> 06 -> 07` 各自 SOP 重建 / 复核；每份正式文档停审后再进下一份 | 各下游文档维护动作；每次切换仍需用户明确确认 |
| `L2M-DDD-001` 目标实现仓不存在 | `/home/aris/Projects/quantalithos-member` 当前无可核验 workspace、manifest、git 配置或 compile baseline | 阻塞代码、测试执行、实现台账和提交；不把 planned layout 变成已存在 | 获得实施授权后在 `07` 前置检查确认目标仓及七 crate 布局、Core path、git / source convention；当前不创建 | 实施计划 / 实现 owner；需独立实现授权 |
| `L2M-UP-001` host registration / IPC / lifecycle / credential seam 未闭合 | CP01 host collaboration、反馈、启动协作、adapter binding 无 exact request / signal / report / feedback 形态 | 阻塞 host IPC、session、health、lifecycle、正向联调和物理 adapter | member-service 发布可引用 formal owner contract；本仓再做漂移审计并按影响回开 Step 7～9 / 14 | `L2-member-service` owner；credential 相关还需 Identity owner |
| `L2M-UP-002` image release / pinned entry consumer contract 未闭合 | image supply 只能被安全 ref / availability 语义消费，不能判定 pinned release 可装配 | 阻塞 image manifest、entry compatibility、host assembly、release confirmation 和 readiness | member-images / member-service 给出正式 release / consumer / compatibility / confirmation contract；必要时回开 Step 4 / 14 | `L2-member-images`、`L2-member-service` owner |
| `L2M-UP-003` Runtime entry / trigger mapping 未闭合 | CP03 只能形成 member-local delivery decision / attempt，无法构造 Runtime positive entry | 阻塞 Runtime trigger、run / client payload、正向投递与联调 | `L2-runtime` 发布 formal EntryAuthority / trigger mapping；本仓回开受影响 protocol / flow / config seam | `L2-runtime` owner |
| `L2M-UP-004` Runtime handoff / feedback / source family 未闭合 | result link、material reception、CP04 / CP05 continuation 只能使用 safe ref、attempt / gap 或 non-positive disposition | 阻塞 Runtime handoff、feedback、downstream delivered / observed claim 和正向协作 | `L2-runtime` 发布 formal handoff / source-family contract；按影响回开 Step 7～10 / 14 | `L2-runtime` owner |
| `L2M-UP-005` member-specific Core event schema / route 未闭合 | 24 个 semantic candidates 不能成为 public Event 或 delivery work item | 阻塞 Event envelope、payload、source、subject、route、topic、publisher、outbox、retry、delivery、event integration | Core / Bus owner 发布 member-specific shared contract；随后重开 Step 8 / 9 / 14 及受影响测试 / 下游审计 | `L0-core` / `L0-bus` owner |
| `L2M-UP-006` startup credential / identity anchor exact contract 未闭合 | admission / presence 正向路径缺 credential shape、verify / revoke ownership与关联证明 | 阻塞 credential validation、positive startup admission、secret handling / evidence；不阻塞 fail-closed rejection | Identity / host owner 发布 formal credential / anchor contract；本仓复核双锚、Port 与 negative branch | `L1-identity`、`L2-member-service` owner |
| `L2M-UP-007` screening taxonomy / policy source 未闭合 | CP02 / CP06 只能消费 safe resolution；无法定义 local allowlist 或 default pass | 阻塞 screening 正向分类、policy evidence 与受控降级判定 | Governance / safety owner 发布 formal safe result shape、taxonomy 与 freshness boundary；回开 screening / mirror seam | `L1-governance` / safety-policy owner |
| `L2M-UP-008` 非项目型第三执行主语未定义 | 当前只有 `ProjectMemberRef + GlobalMemberRef` 双锚可接受；无法扩展 personal / third subject | 阻塞非项目型 activation、跨主语流程与输入兼容 | Work / Identity / product-scope authority 发布正式主语生命周期与关联 contract；从 Step 1～3 开始评估回开 | `L1-work`、`L1-identity`、product scope owner |
| `L2M-DDD-002` physical Store / UoW / durability 未选 | 逻辑 append、CAS、typed replay 和 same-UoW 已定义，但没有 DB / lock / migration / isolation / retention 产品事实 | 阻塞 durable adapter、compile / integration / crash-recovery、性能和运维结论；不阻塞逻辑设计装配 | 在正式下游 / 实施前置中按已定义 logical semantics 选择并审计 physical realization；不得反向修改 truth owner | 配置 / 实施计划 / implementation owner；需要相应技术 authority |
| `L2M-RISK-004` historical pollution 回流 | 旧 persona 主线、CloudEvents / AG-UI、UDS / gRPC、launch token、固定 route / port、DB / broker / SLA 可能被误作为当前契约 | 阻塞正式 03 装配审计；若进入后续文档，会污染 config / test / acceptance / implementation | Step 19 和后续文档只引用当前正式上游与 calibration；发现复发即删除并回写 owning Step / pollution audit | 本仓文档维护者；所有后续文档审计者 |

### 7.3 本仓 targeted-repair 风险表

| ID / 风险 | 影响 | 阻塞范围 | 关闭 / 重开条件 | 负责人 / 待确认方 |
|---|---|---|---|---|
| `L2M-DDD-003` Consumer source / context / receipt closure 缺口 | 14 Consumer 的 full `MemberConsumerSource`、typed receipt、exact replay 与 stored carrier 无法由窄 source identity 无损构造 | 阻塞完整 Consumer receipt 保存 / replay 和受影响 Consumer 正向实施 | 回到 Step 6 / 8 / 9，闭合 source、context、receipt 的字段来源、factory、Port / flow 和 missing branch；再同步 Step 10～17 | 本仓 Step 6 / 8 / 9 真相源维护者 |
| `L2M-DDD-004` CP04 prepared-attempt / gap creation chain 缺口 | reception flow、material、Prepared attempt、PublicationGap、relay selector 和 Unknown fence 无完整创建 / 保存顺序 | 阻塞 PublicationRelay positive / unknown path、相关 Consumer / Job 与 projection | 回到 Step 6 / 9 / 10，统一 factory、append、UoW、selector、gap status 与 flow；不得以 `new_gap_ref()` 或 list selector 假装已创建 | 本仓 Step 6 / 9 / 10 真相源维护者 |
| `L2M-DDD-005` CP05 observation attempt–gap unknown relation 缺口 | `mark_unknown` 参数、InteractionGap factory / relation 和 ObservationRelay flow 不一致 | 阻塞 ObservationRelay unknown path、gap 关联、相关 report / projection | 回到 Step 6 / 7 / 9 / 10，裁决并定义合法 relation / helper / flow / error；不得伪造 observed 或 blind retry | 本仓 Step 6 / 7 / 9 / 10 真相源维护者 |
| `L2M-DDD-006` CP06 refresh initial gap / `ResolutionPending` helper mismatch | Refresh Command / Job 试图构造当前 factory 不允许的 initial status，且不存在相应 transition helper | 阻塞 refresh positive path、gap successor 和关联 projection | 回到 Step 6 / 9 / 10，裁决为合法 initial factory + successor 或扩展经审计 helper；随后更新 Store / test cut | 本仓 Step 6 / 9 / 10 真相源维护者 |
| `L2M-DDD-007` CP07 projection helper / version mismatch | required degraded / unknown / activation path 未有合法 helper，且 `store_version()` 不是 legal CAS provenance | 阻塞 projection rebuild / reconciliation 完整失败路径和相关 derived read completion | 回到 Step 6 / 9 / 10，以 `Versioned<MemberProjectionState>` 的 Store version 和合法 helper 修复；不得由 watermark / object method 伪造 version | 本仓 Step 6 / 9 / 10 真相源维护者 |
| `scope_supersede_gap` subscription replacement helper 缺口 | `SubscriptionScopeStatus::Active -> Superseded` 没有 domain helper，replace flow 不能合法创建 old successor | 阻塞 `ReplaceSubscriptionScope` 正向 implementation 与相关 state / test | 回到 Step 6 / 9 / 10，定义并审计 domain helper、precondition、expected version、new scope relation 和 error；不得让 repository save 冒充 transition | 本仓 Step 6 / 9 / 10 真相源维护者 |

### 7.4 非 blocker 的实施前复核风险

下列事项不改变当前逻辑设计，也不授权提前实现；它们在获得实现授权后仍必须被正式 `07` 的 phase / commit boundary 审计逐项复核。

| 风险 | 当前影响 | 阻塞范围 | 处理 / 确认方 |
|---|---|---|---|
| planned `core-contracts` path / shared type compatibility 尚未在目标仓核验 | Step 3 只确认它是唯一 planned sibling compile dependency，未证明未来 workspace 可编译 | 阻塞使用 Core shared type 的实际代码编译；不改变当前依赖分类 | 在获授权的目标仓检查 `../quantalithos-core/crates/contracts`、package / crate 名称、Rust 2024 与最低兼容版本；不匹配时暂停并回开 Step 3 / 4 / 7，不引入第二 sibling path dependency |
| 物理 adapter、transport、scheduler、metric / log backend、retention 和性能数值未选 | Step 14 / 15 仅定义 Port、availability、safe field 与 low-cardinality 约束 | 阻塞对应生产化 adapter、运维集成、SLO / performance / external integration 结论；不阻塞 local logical contract | 由后续 04 / 07 / 运维或 owner authority 确认；不得把 DB、queue、HTTP / UDS、topic、backend 或 SLO 数字写入 domain / application |
| 实际 safe redaction scanner、真实 integration fixture 和 acceptance evidence 形态未设计 | Step 16 只有 planned test cut，尚无当前 05 / 06 正式基线 | 阻塞测试执行、验收、evidence、verdict、signoff 和 readiness；不把 test cut 误作测试结果 | 由新版 05 / 06 先定义测试 / 验收门禁；未定义前只保留 forbidden-field、safe ref 和 local disposition 约束 |

### 7.5 已有设计级闭环、但不得误读为实施完成

| 已有设计级结论 | 依据 | 本 Step 的风险口径 |
|---|---|---|
| 七模块、34 个 HLD 对象、10 Command、16 Query、14 Consumer、24 blocked candidate、5 Job 和 28 状态主语已有唯一 calibration 来源 | Step 5～10、17 | 不另列为“缺失设计”；`L2M-DDD-003~007` 与 `scope_supersede_gap` 限定的部分保持开放。 |
| Query no-write、typed duplicate replay、Unknown side-effect fence、same-UoW / CAS 逻辑纪律已收束 | Step 8～13、17 | 是 future implementation 的硬约束，不代表有 Store、code、run 或测试结果。 |
| raw config 仅在 infra、依赖分类、safe observability / redaction 边界和 planned test cuts 已收束 | Step 14～16、17 | 不代表完整配置文件、backend、测试、验收或外部 integration 已存在。 |
| 24 个 outbound semantic candidates 在 `L2M-UP-005` 前不能物化 | Step 8、12～17 | 这是一项 non-materialization 约束，不是 event implementation completion 或 delivery conclusion。 |

## 8. 待确认事项与未确认前处理规则

### 8.1 待确认事项表

| 事项 | 当前影响 | 需要谁确认 | 未确认前的处理方式 |
|---|---|---|---|
| Step 19 正式 `03-详细设计.md` 装配与静态审计 | 尚无新版正式详细设计入口，旧 03 不可作为实现依据 | 本仓详细设计维护者；用户已授予完成全部 03 的范围，但仍须通过 Step 19 装配门禁 | 只继续当前 Step 链；不按旧 03 开工，不写实现仓。 |
| 正式 `04/05/06/07` 的新版链 | 无当前 config、test、acceptance、phase / commit boundary / implementation-ledger 基线 | 对应文档 SOP 维护动作；每份正式文档后的用户切换确认 | 不预写 key、test / acceptance result、phase、commit、implementation ledger 或 boundary skeleton。 |
| `L2M-UP-001~008` 的 exact owner contract | 受影响 positive lane 无法构造 carrier、调用 owner seam 或声明 external result | 分别由 member-service、member-images、Runtime、Core / Bus、Identity、Governance、Work / product scope owner | 保持 typed ref / safe resolution / local attempt / gap / blocked / waiting / unknown；不用 local shadow schema、default、token、transport 或 fake success 绕过。 |
| `L2M-DDD-001` 与 `L2M-DDD-002` | 目标仓、physical Store / UoW、durability 和 execution baseline 不可核验 | 07 / implementation owner，在获得独立实现授权时 | 不创建仓、不写 code、不选 DB / queue / lock / migration / scheduler；仅保留 planned logical contract。 |
| `L2M-DDD-003~007` 与 `scope_supersede_gap` | Consumer receipt / replay 及 CP04～CP07、scope 的 specific positive / helper-dependent lane 不可落码 | 本仓 owning Step 6 / 7 / 8 / 9 / 10 targeted repair | 对应 lane `blocked` / `wait_design`；不直写 state、不补 factory、selector、relation、version 或 report。 |
| `L2M-UP-005` 前的 24 semantic candidate | 不存在 Event public carrier 或 delivery contract | Core / Bus owner contract，随后本仓 Step 8 / 9 / 14 重开 | 不创建 event、envelope、publisher、outbox、route、topic、retry、DLQ 或 delivery receipt。 |
| Core shared compile candidate 的实际兼容性 | planned Core path 尚未在不存在的目标 workspace 内被核验 | implementation owner 与 Core owner，在 07 / implementation preflight | 不做 compile / test claim；若不匹配，暂停并回写 Step 3 / 4 / 7。 |
| physical / operations / test / acceptance products | Store、transport、backend、redaction scanner、fixture、evidence / verdict 形态未被后续正式链选择 | 04 / 05 / 06 / 07 及相应 owner | 不把 product / evidence 选择编入 domain、application 或本 Step；不声称 run、report、artifact、evidence、verdict、signoff 或 readiness。 |

### 8.2 未确认前实现处理规则

| 场景 | 强制处理规则 |
|---|---|
| 正式 03 未由 Step 19 装配 | 不恢复旧 03，不正式移交实现；只允许继续当前设计 SOP。 |
| 04 / 05 / 06 / 07 未完成 | 不把旧配置、旧测试、旧验收或自拟 phase / commit 交给实现者；不创建 implementation ledger 或 planned boundary skeleton。 |
| 目标实现仓不存在 | 不创建、修改或初始化实现仓；不写代码、Cargo manifest、脚本、测试、run 或 commit。 |
| 上游 exact contract 缺失 | 不复制 owner type，不发明 IPC / UDS / HTTP、credential / token、event route / topic 或 Runtime client；保持 blocked-aware Port / ref / safe surface。 |
| Consumer source / receipt 缺口 | 不以 narrow identity、default authority / schema / detail、shell ref 或 fake map 保存 / replay完整 receipt。 |
| CP04～CP07 / scope helper 或 flow 缺口 | 停在 `blocked` / `wait_design`；不直写状态字段、不伪造 relation / gap / version、不把 repository save 当 transition。 |
| Query | 永远 no-write：不 digest、不 reserve、不 append、不写 audit / result / projection、不 refresh / rebuild / reconcile、不调用 resolver / handoff。 |
| duplicate / `Unknown` | matching duplicate 只读取完整 typed stored carrier；missing / wrong carrier fail closed；`Unknown` inspect-first，不换 key 或盲重试外部 side effect。 |
| event candidate / external result | `L2M-UP-005` 前只能 `Blocked`；member-local `Prepared` / `Submitted` / gap / safe ref 不能声明 host accepted、Runtime executed、delivered、observed、evidence 或 readiness。 |
| fake 与 physical product | fake 仅验证既有 Port parity / failure semantics，不是 dependency、owner contract、integration evidence 或 readiness；不得借 fake 选定 DB、broker、scheduler、backend 或产品协议。 |
| 历史材料 | CloudEvents shared category仅可按 Core 当前 authority消费；AG-UI、UDS、launch token、固定端口、route / topic、DB / broker / SLO 与旧 persona 只作污染诊断。 |

### 8.3 关闭与重开规则

| 情形 | 允许动作 | 禁止动作 |
|---|---|---|
| 外部 owner 发布正式可引用 contract | 先读取 owner 正式材料和台账，做 drift audit，定位受影响 Step / object / Port / protocol / flow / state / config / test，再 targeted reopen | 仅凭对话、sibling in-progress 文档或名称相似就更新 local carrier / adapter。 |
| 本仓发现 DDD gap | 回到拥有字段、factory、Port、flow 或 state 真相源的 Step 做 targeted repair，并同步下游 Step / formal document（如已装配） | 在 Step 18、implementation 或 fake private state 中补 placeholder。 |
| physical / deployment / operational product 需要选择 | 在已授权的下游设计或 implementation boundary 内，依据正式 logical contract、依赖分类和实施门禁裁决 | 把 product 选择倒灌到 domain owner、修改外部 truth 或声称对应 integration 已完成。 |
| 历史污染复发 | 删除无 authority 的结论，记录污染来源和受影响章节，回到 Step 19 / 当前 downstream document 的 source audit | 以“兼容旧文档”为由保留 persona、carrier、token、route 或 performance 假设。 |

## 9. 正式 03 §17 回填草稿

> 校准来源：`projects/L2-member/design-calibration/03_ddd_step_18_risks_open_questions.md`。本节仅供 Step 19 装配；本 Step 不修改正式 `03-详细设计.md`。

### 17. 风险与待确认事项

本详细设计已在校准链中形成七模块、34 个 HLD 对象、10 Command、16 Query、14 Consumer、24 个被阻塞的 outbound semantic candidate、5 Job、28 个状态主语以及 local transaction / replay / configuration / observability / planned test-cut 的设计级约束。该结论不是实现、测试、外部 integration、验收、evidence、verdict、signoff 或 readiness 结论。

以下事项必须保留为开放风险，并在未关闭前阻止受影响的正向实施：

| 风险类别 | 当前处理 |
|---|---|
| 正式文档与实现启动 | 正式 03 须由 Step 19 装配；随后 04、05、06、07 须按严格顺序完成。目标实现仓、implementation ledger、phase / commit boundary 和代码写入在获独立授权前均不得创建。 |
| 外部 exact contract | `L2M-UP-001~008` 分别由 host、image、Runtime、Core / Bus、Identity、Governance、Work / product owner 关闭。本仓只保留 typed ref、safe resolution、local attempt / gap 和 fail-closed disposition。 |
| 本仓 targeted repair | `L2M-DDD-001~007` 与 `scope_supersede_gap` 必须回到其拥有字段、factory、Port、flow、state 或 physical implementation choice 的真相源修复；不得由 adapter、fake、repository、默认值或实现者自行补造。 |
| event 与历史污染 | `L2M-UP-005` 前，24 个 candidate 不是 Event，不得产生 envelope、publisher、outbox、route、topic、retry、DLQ 或 delivery。旧 persona 主线、CloudEvents / AG-UI、UDS、launch token、固定物理产品和数值只作 historical-pollution 诊断。 |

未确认前，Query 必须 no-write；matching duplicate 必须回放完整 typed stored carrier；`Unknown` 必须 inspect-first；外部 owner truth、local attempt 与 safe ref 不得升格为 external accepted、executed、delivered、observed、evidence 或 readiness。任何 blocker 闭口均须更新拥有真相源的正式文档或 calibration 文件，并同步项目台账、文档 flow 与受影响下游；不能只在对话中确认。

## 10. 自检、完成门禁与停审

| 门禁 | 结论 | 依据 |
|---|---|---|
| Step 18 四个 SOP 问题逐项回答 | pass_for_design | §3 区分影响、阻塞、确认方和未确认前处置。 |
| 未关闭上游事项完整记录 | pass_with_upstream_blockers | §7.2、§8.1 覆盖 `L2M-UP-001~008`，保留 owner、阻塞范围与关闭条件。 |
| 未关闭本仓设计事项完整记录 | pass_with_design_blockers | §7.2～§8.1 覆盖 `L2M-DDD-001~007` 与 `scope_supersede_gap`，指定 targeted repair。 |
| 文档链、目标仓与物理 binding 风险 | pass_with_blockers | §4、§7.2 / §7.4、§8.1 明确 Step 19、04～07、目标仓和 physical product 的不同门禁。 |
| 未确认前处置可执行 | pass_for_design | §8.2 固定 no-write、typed replay、Unknown fence、blocked / wait_design、dependency classification 和历史隔离。 |
| 历史污染隔离 | pass_for_design | §4、§7.2、§8.2、§8.3 保留 CloudEvents / AG-UI / UDS / launch token 等诊断与删除规则。 |
| 未新增实现契约或伪造事实 | pass_for_design | 本文件只记录风险，不新增 schema、state、config、phase、commit、代码、test run、artifact、report、evidence、verdict、signoff 或 readiness。 |
| 正式 03 / 实现仓 / sibling 写入 | not_performed | 本 Step 未修改正式 03、未创建实现仓、未修改 sibling、未执行测试、未提交。 |
| 静态文本审计 | pass_for_design | 已复核无 replacement character、无未收口 `in_progress` / `pending_self_audit` 标记；所有上游和本仓 blocker 均具影响、确认方与未确认前处置。 |
| 进入 Step 19 | pass_with_upstream_and_design_blockers | Step 18 已完成 / 停审；可在用户既有 full-03 授权下读取 Step 19 输入并创建其独立中间产物。 |

Step 18 在此停审。未关闭 blocker 的状态不变；下一动作只能是按 Step 19 SOP 从 Step 1～18 的本轮 calibration 装配正式 `03-详细设计.md`，不得将本 Step 的风险记录误作实施授权。
