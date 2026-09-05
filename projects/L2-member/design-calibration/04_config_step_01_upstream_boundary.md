# L2-member 04 配置设计 Step 1：确认配置输入边界

> 对应 SOP：`standards/document/配置设计讨论流程_SOP.md` Step 1
> 对应书写规范：`standards/document/配置设计书写规范.md` §5.1
> 回填位置：正式 `04-配置设计.md` §1「与上游文档的关系声明」
> 粒度参考：`projects/L1-governance/design-calibration/04_config_step_01_upstream_boundary.md`；只借鉴 Step 结构、输入映射、回写判定与停审格式，不继承其配置域、产品或事实。
> 创建日期：2026-09-03
> 执行模式：`full-restart + single-agent-serial`
> 当前状态：`completed / pass_with_explicit_blockers / stop_review`；本文件已完成并停审，未经用户明确确认不得进入 Step 2 或写正式 `04-配置设计.md`。

## 1. Step 开工确认与 Step 内计划

| 门禁层级 | 检查 | 结论 |
|---|---|---|
| 项目级 | 已先读取 `project_execution_ledger.md`；正式 03 已完成 / 停审，用户最新“继续”被记录为允许进入 04 Step 1。 | `pass` |
| 文档级 | 本轮新建 `04_config_calibration_flow.md`，当前只允许 Step 1。 | `pass` |
| Step 级 | 已读取配置 SOP、书写规范、中间产物规范、当前正式 00~03、03 Step 14、旧 05/06 和 `L1-governance` Step 1 参考材料。 | `pass` |
| 禁止动作 | 不定义 key、默认值、profile、环境矩阵、secret、加载函数、产品、endpoint、route、DB / broker、部署动作或测试 / 验收事实。 | `active` |

| 小阶段 | 可审查产物 | 状态 | 当前门禁 |
|---|---|---|---|
| 1. 输入来源分层 | §2 输入清单 | completed | 已从正式、owner、sibling、下游历史材料分层 |
| 2. SOP 五问 | §4 | completed | 只收敛输入边界，不产生配置项 |
| 3. 当前文档与历史诊断 | §5～§6 | completed | 旧材料只作污染 / 方向审计 |
| 4. 结构化映射与 03 影响判定 | §8～§9 | completed | 无本 Step 的 03 回写项 |
| 5. 回填草稿与完成自检 | §10～§12 | completed | 本 Step 可停审，等待用户确认进入 Step 2 |

## 2. 本步目标、输入与输出

### 2.1 本步目标

确认 `04-配置设计.md` 能以当前正式 `00~03` 为唯一设计主链继续展开，并把字段级配置绑定、上游 / sibling blocker、下游历史方向和历史污染分开记录。本 Step 只回答「哪些输入可以进入配置设计、哪些问题由 04 回答、哪些问题不应由 04 重答」。

### 2.2 本步输入

| 输入 | 当前状态 | 本步限定用途 |
|---|---|---|
| 配置 SOP、配置书写规范、编写通则、中间产物规范、真相源闭环标准、全局依赖关系与裁剪规则 | normative authority | 固定 15 Step 主链、三层门禁、JSON / 回写规则、可落码和依赖分类纪律。 |
| 当前正式 `00-需求文档.md` | 正式需求基线 | 承接成员门面职责、需求 / NFR / 安全 / 数据归属、`IB-L2M-E03` 生效配置解释视图、无数值目标及 fail-closed 红线。 |
| 当前正式 `01-架构设计.md` | 正式架构基线 | 承接七 BC、依赖裁剪、local-truth-first、配置 provenance、data lifecycle 和不可配置化横切约束。 |
| 当前正式 `02-概要设计.md` | 正式概要基线 | 承接 CP01～CP07、实现分层、配置影响轮廓、入口 / Port / Store / projection / Job 边界。 |
| 当前正式 `03-详细设计.md` | 直接输入 | 承接七 crate、Port、UoW / replay、状态 / 错误、§13 raw-read / builder / logical configuration references、§14 redaction 与 §15 测试切口。 |
| `03_ddd_step_14_configuration_external_bindings.md` | 字段级直接输入 | 承接 `infra/config.rs`、`infra/runtime_builder.rs`、validated refs、section-to-code binding、外部依赖分类、blocked / fake 与禁止配置化清单。 |
| `03_ddd_step_15_observability_audit.md`、`03_ddd_step_16_test_cuts.md`、`03_ddd_step_17_implementation_handoff.md`、`03_ddd_step_18_risks_open_questions.md` | 当前 calibration 输入 | 承接 config redaction、planned config / builder verification cut、下游承接与 blocker / reopen 条件。 |
| Runtime、Tools、Core、Bus、SDK、Work、Identity、Governance、Conversation、Artifact 的当前正式链 / 台账 | owner / foundation input | 只核验本仓消费的 owner、shared primitive、runtime / event / ref / adapter 边界。 |
| member-service、member-images 当前正式或明确可引用材料 / 台账 | 并行 sibling input | 只使用已稳定 owner 方向；exact IPC、credential、pinned release、manifest、compatibility、handoff 与 positive readiness 继续 pending。 |
| 旧 `05-测试方案.md`、旧 `06-验收标准.md` | historical / direction input | 仅识别后续必须重建的测试 / 验收配置承接方向及 persona / protocol / evidence 污染。 |
| README、旧正式 `00/01/02/03/05/06`、`draft/` | historical / discussion input | 后置差异审计；不继承 AG-UI、UDS、gRPC、launch token、固定端口、supervisord、DB / broker、SLA / P95、persona 主线或产品假设。 |

### 2.3 本步输出

- 上游输入映射表。
- 配置设计不再回答的问题清单。
- 配置设计必须回答的问题清单。
- 当前输入缺口、historical pollution 与 blocker 的初步归位。
- 对 `03-详细设计.md` 的影响判定、正式 §1 回填草稿和 Step 2 门禁。

## 3. 本步执行边界

本 Step 只能收敛输入与边界，不能把 logical configuration reference 直接转换为具体配置项。尤其不得：

- 创建实际 JSON / JSONC、env key、默认值、profile 名、优先级、secret storage、endpoint、route、topic、cron、retry / timeout / retention 数值；
- 选择 DB、broker、queue、scheduler、transport、IPC、HTTP / gRPC / UDS、secret backend、observability backend、容器或部署产品；
- 将 `MemberRuntimeConfigRef`、`MemberStoreConfigRef`、`MemberAdapterConfigRef` 的 logical 名称误写为 raw config schema 或实现事实；
- 使用配置改写执行双锚、truth owner、body-free、policy / screening owner、Query no-write、状态转换、UoW / CAS、typed replay、Unknown fence、event blocker 或 dependency classification；
- 把 `L2M-UP-001~008`、`L2M-DDD-001~007`、`scope_supersede_gap` 或 24 个 event candidate 以默认值、fake、string、product 配置或 ready 标记伪关闭；
- 因历史 `05/06` 写有 CI、DB、persona、报告、证据或验收字段，便将其反向当作本轮配置事实。

## 4. SOP 五问回答

| SOP 问题 | Step 1 收敛回答 |
|---|---|
| 当前配置设计要承接哪些需求、非功能、安全和环境差异？ | 承接 `00` 的成员在场、入站筛选 / 受控投递、出站 attempt / gap、追溯、摘要 / outlet 与 `IB-L2M-E03` 的生效边界 / 来源解释需求；承接 NFR 的 fail-closed、body-free、可追溯、可判别降级、无固定性能 / 容量数字；承接 `01` 的 configuration provenance、availability isolation、data lifecycle 与 evidence discipline。环境只作为后续 local / CI / integration-like 等**配置矩阵待设计输入**，当前没有可直接继承的 profile、数值或生产结论。 |
| 详细设计中哪些配置引用、runtime builder、adapter 或外部依赖需要进入配置设计？ | `03` §13 与 Step 14 已明确：唯一 raw config 读取 / 校验入口为 `infra/config.rs`，唯一 composition root 为 `infra/runtime_builder.rs`；需要在后续 04 中继续收敛的逻辑 section 包括 runtime profile / provenance、CP01～CP07 local / support / projection / continuation / idempotency Store、Clock / ID / digest、command / query boundary、Consumer dedup、projection freshness / activation、Job batch / retry、owner-specific resolver、host / Runtime / publication / observation handoff、logical registry 与可裁剪 outlet posture。它们仅是 logical binding input，未锁定实际 key、来源、值、产品或 activation success。 |
| 哪些测试和验收场景依赖配置矩阵？ | 新版 `05` 应从 04 承接 raw config 隔离、validated binding、mandatory local slot failure、blocked external seam、test-only deterministic fake、Query no-write、redaction、profile / source / conflict / lifecycle 的 negative matrix；新版 `06` 应裁决这些配置门禁。旧 05/06 中 persona、endpoint、真实集成、CI / report / evidence、DB 与固定阈值叙述不适配新版正式链，只是「需重建」的历史诊断，不能指定本轮矩阵。 |
| 哪些内容不应在配置设计中重新定义？ | 不重定义需求目标、七 BC / CP、七 crate、34 HLD 对象、10 Command、16 Query、14 Consumer、5 Job、28 状态主语、Port / DTO / error / flow / UoW / CAS；不重定义 Runtime loop / context / plan / outcome、Tools action / registry / execution、host lifecycle / registry / health、image supply、identity / Work / Governance / Conversation / Artifact / Observability truth；不选择 DB、broker、transport、IPC、scheduler、deployment、secret / backend 产品，也不写测试结果、evidence、verdict、signoff、readiness 或 commit。 |
| 当前上游是否存在会阻塞配置设计的缺口？ | 不阻塞 Step 2 对「本仓存在配置控制面」及其范围的收敛；但阻塞受影响 external slot 的具体 positive activation、secret / endpoint / IPC / route、真实 integration、evidence 与 readiness。`L2M-UP-001~008`、`L2M-DDD-001~007`、`scope_supersede_gap`、physical Store / UoW non-choice 和 `L2M-UP-005` 下的 24 candidate 必须进入后续风险 / 失效设计，不得被 04 补成合同。 |

## 5. 当前文档与输入诊断

| 位置 / 材料 | 诊断 | 本 Step 处理 |
|---|---|---|
| 正式 `04-配置设计.md` | 当前不存在。 | 按 Step 1~15 重建；仅 Step 15 才能创建正式正文。 |
| 当前正式 `00~02` | 已锁定 owner、边界、分层、配置 provenance 和「具体 key / 默认值留 04」的职责分工。 | 作为正式输入，不通过 04 改写其中的业务 / 架构结论。 |
| 正式 `03` §13 | 已闭合 raw-read owner、validated ref、builder、logical Store / slot / boundary / registry binding；尚未决定完整 key、格式、profile、来源、secret、产品、数值、变更和失效手册。 | 作为 04 唯一代码绑定入口，后续只在其边界内细化配置语义。 |
| `03` §14～§17 | 已给出 config redaction / diagnostics、planned verification cut、实施前阅读和 block / reopen 条件。 | 为 Step 8、9、12、14 提供输入；本 Step 不提前展开。 |
| `L2-member-service` / `L2-member-images` | 同 Layer 3 并行窗口，当前只有可消费的 owner 方向；exact host / credential / IPC 和 pinned release / entry contract 未稳定。 | 维持 `L2M-UP-001/002/006` pending，不写 sibling config schema 或 products。 |
| `L2-runtime` / `L2-tools` | Runtime / Tools 是外部 owner；Entry / handoff / capability safe-view seam 存在但 exact positive mapping 未闭合。 | 维持 `L2M-UP-003/004` 和相关 safe-ref / blocked seam，不写 Runtime / Tools config truth。 |
| Core / Bus | Core shared primitive 是唯一 planned compile candidate；member-specific event schema / route 未闭合。 | `L2M-UP-005` 继续阻断所有 outbound event / publisher / outbox / route / topic / retry / DLQ / delivery 配置。 |
| 旧 `05/06` | 使用 persona、endpoint、capability catalog、DB、真实 integration、report / evidence 和固定指标等旧主线。 | 仅保留为 historical pollution / downstream rebuild direction；不得倒灌配置项。 |
| README | 包含 CloudEvents、AG-UI、UDS、gRPC、launch token、固定端口、supervisord、NATS / Redis / Kafka、P95 等历史假设。 | 各项均不成为 04 input；CloudEvents / W3C 仅可按 Core current authority 的共享类别继续消费，不能推出 member event schema 或 route。 |

## 6. 改动前后与设计取舍

| 议题 | 误用旧材料的风险 | 本 Step 结论 | 取舍理由 |
|---|---|---|---|
| 配置设计入口 | 从缺失 04、旧 05 / 06 或 README 直接反推完整配置。 | 以正式 `00~03` 和 `03` Step 14 为唯一主链，先建立中间产物。 | full-restart 与 SOP 均要求中间产物先行。 |
| 是否存在配置 | 因未选产品或 external seam blocked 而误判「无配置」。 | 已有 raw-read、validated ref、builder、Store / Port / boundary / Job / registry binding，故不是无配置路径。 | 03 已定义多个 logical configuration binding point。 |
| external blocker | 将 availability、fake 或 local builder `Ready` 当作 host / Runtime / image / Bus 成功。 | local composition 与 external positive lane 分层；blocked seam 可进入配置设计，但不成为 success。 | 对齐 03 §13 和所有 `L2M-UP-*` 红线。 |
| 历史下游 | 让旧测试 / 验收中的 DB、环境、CI、evidence 或数字定义配置项。 | 旧 05/06 仅提供未来重建方向；新版 04 将成为新版 05/06 的唯一配置输入。 | 防止旧 persona / protocol / evidence / product 污染反向成为事实。 |
| 03 契约影响 | 在 04 静默增加 config struct、builder constructor、adapter、Port 或 error。 | 本 Step 只承接既有 binding；任何后续代码契约变化必须先回写 03。 | 配置设计只能细化配置语义，不能代替详细设计。 |
| 物理产品与数值 | 以「配置设计」之名锁定 DB、broker、secret backend、endpoint、SLO 或 retry 数字。 | 当前只确认这些属于后续待收敛 / pending 类别。 | 现有 authority 未选择产品或提供测量依据。 |

## 7. 配置设计取舍

| 议题 | 方案 | 结论 |
|---|---|---|
| 正式 04 的生成方式 | A. 直接写正式文档；B. 按 15 Step 建立 calibration 再装配。 | 采用 B；正式 04 只在 Step 15 装配。 |
| 旧 05 / 06 的地位 | A. 反向定义环境 / 配置；B. 仅提供后续测试 / 验收方向与污染审计。 | 采用 B。 |
| external seam 的配置形态 | A. 以默认 endpoint / route / fake success 闭口；B. logical slot / ref / blocked-aware posture。 | 采用 B。 |
| physical Store / transport / secret 产品 | A. 在 Step 1 选择；B. 保持 product-neutral，后续仅在 authority 允许时收敛。 | 采用 B。 |
| 配置设计影响 03 | A. 在 04 直接新增代码契约；B. 发现影响时回写 03 或记录 blocker。 | 采用 B。 |
| outbound event candidate | A. 预设 publisher / outbox / topic；B. 在 `L2M-UP-005` 下保持 zero configuration / non-materialized。 | 采用 B。 |

## 8. 结构化中间产物

### 8.1 上游输入映射表

| 来源 | 可进入 04 的配置输入 | 不得继承 / 重定义 | 预期回填章节 |
|---|---|---|---|
| `00-需求文档.md` | member-local capability、fail-closed、body-free、stale / gap / degraded 分层、`IB-L2M-E03` 生效配置解释视图、无固定数值基线 | 需求重定义、external truth、固定 P95 / SLA、historical transport / token | §1、§2、§4、§11、§12、§14 |
| `01-架构设计.md` | BC01～07、Core-only compile、runtime / event / ref / adapter / fake 分类、configuration provenance、availability isolation、data lifecycle | owner / ADR、产品、部署拓扑、physical IPC / DB / broker | §1、§3、§4、§5、§10、§13、§14 |
| `02-概要设计.md` | CP01～07、inbound / operations → application → domain / Port / persistence 分层、configuration impact、logical entry / Store / projection / Job 轮廓 | 完整 key、env、secret、物理 transport / storage | §1、§2、§3、§4、§7、§9、§12 |
| `03-详细设计.md` §3～§13 | seven-crate direction、application-owned Port、logical Store / UoW / idempotency、config raw-read / builder、logical section types、unavailable posture | 新对象 / Port / DTO / function / state、physical products / topology | §1、§3～§11 |
| `03` §14～§17 与 Step 15～18 | redacted config diagnostics、planned config / builder cut、implementation handoff、risk / reopen conditions | telemetry backend、actual test / evidence / verdict / commit | §8、§9、§10～§14 |
| `03_ddd_step_14_configuration_external_bindings.md` | raw-read boundary、validated ref、section-to-code mapping、dependency binding、builder ordering、forbidden configuration | exact raw schema、source priority、values、products、external success | §1、§3、§4、§7、§9、§11 |
| Runtime / Tools formal chain | Runtime entry / material and capability safe-view owner boundary | Runtime loop / plan / outcome、tool execution / registry / external adapter truth | §1、§4、§11、§14 |
| Core / Bus / SDK | Core shared primitive, event collaboration, downstream read seam | member-specific event schema / route / publisher / SDK client | §1、§4、§5、§14 |
| Work / Identity / Governance / Conversation / Artifact | subject / anchor, safe policy result, body-free conversation / artifact ref boundaries | foreign body、credential truth、approval / conversation / evidence truth | §1、§4、§8、§11、§14 |
| member-service / member-images | host / image supply owner direction and blocked availability posture | IPC / credential / health / manifest / release compatibility / readiness contract | §1、§3、§4、§8、§14 |
| old `05/06` | future matrix / gate need and historical mismatch locations | persona, catalog, endpoint, DB, CI result, report / evidence / fixed threshold | §1、§12、§14 |

### 8.2 配置设计不再回答的问题

- `L2-member` 为什么存在、拥有哪七个 BC / CP、34 对象、10 Command、16 Query、14 Consumer、24 blocked candidate、5 Job 或 28 状态主语。
- Runtime 的 loop / context / plan / outcome / checkpoint，Tools 的 action / execution / registry，host 的 lifecycle / registry / health，image 的 build / release truth。
- Work / Identity 主语与凭据真相，Governance policy / approval truth，Conversation / Artifact / Observability truth。
- Rust crate、struct / enum / trait / Port / DTO / error / function flow、state / UoW / CAS / idempotency 的实现契约。
- DB、broker、queue、scheduler、transport、IPC、HTTP / gRPC / UDS、endpoint、route、topic、secret provider、backend、container / deployment / process topology 选择。
- event envelope、payload、publisher、outbox、route、topic、retry、DLQ、delivery / accepted / observed truth，尤其 `L2M-UP-005` 下的 24 candidate。
- 测试执行、CI、report、artifact、evidence、验收 verdict、signoff、readiness、implementation phase 或 commit。

### 8.3 配置设计必须回答的问题

- 哪些 member-local composition、boundary、Store、technical slot、resolver、handoff、projection、Job、registry 与 feature posture 可配置，哪些不可配置。
- 配置控制面、配置域、source / priority / conflict、环境 / profile、P0 / P1 / P2、key / type / default / requiredness / scope / sensitivity / activation / failure 的闭环。
- raw config 如何仅由 `infra/config.rs` 读取、校验与脱敏，validated ref 如何经 `infra/runtime_builder.rs` 装配为 local adapter、blocked seam 或 test fake。
- Store、idempotency、boundary、Consumer、projection、Job、resolver / handoff 与 registry 配置如何不改变 typed replay、Query no-write、CAS、Unknown fence、local / external truth 分层和 24 candidate blocked 状态。
- 敏感配置如何表示、读取、禁止输出、轮换 / 审计，且不把 credential / secret owner truth 纳入本仓。
- 配置如何加载、校验、生效、变更、审计、回滚和失效；`Ready` 如何始终只表示 local composition、不得升格 external readiness。
- 新版 05 / 06 / 07 / 09 如何承接配置测试切口、验收门禁、planned implementation / operation topic，而不伪造执行事实。
- 哪些配置结论若会改变 `03` 的 config carrier、builder、constructor、Port、error、DTO 或 flow，必须回写或阻塞。

### 8.4 初始配置输入候选表（非配置项清单）

| 候选配置域 | 已有来源 | 已知逻辑绑定 | 本 Step 状态 | 后续收敛位置 |
|---|---|---|---|---|
| runtime profile / provenance | `03` §13、Step 14 | `MemberRuntimeConfigRef`、profile selector、redacted provenance | 有 binding，具体 schema 未定 | Step 2～7 / 9 |
| local / support / projection / continuation / idempotency Store | `03` §10 / §13、Step 11 / 14 | `MemberStoreConfigRef`、builder、UoW / typed result | logical Store 已定，physical product 未定 | Step 3～7 / 11 |
| technical slots | `03` §13、Step 7 / 14 | Clock / ID / digest Port 与 adapter ref | test fake posture 已定，actual binding 未定 | Step 3～7 / 9 / 11 |
| boundary / Consumer / projection | `03` §7～§13、Step 8～14 | command / query limits、dedup、freshness / activation | boundary semantics 已定，key / value 未定 | Step 3～7 / 9 / 11 |
| Job control | `03` §7～§13 | batch / parallelism、retry / timeout category | no blind retry / no scheduler truth 已定 | Step 3～7 / 9 / 11 |
| owner-specific resolver | `03` §7 / §13 | Work / Identity / Governance / Tools / Method resolver slot | owner-specific / blocked seam 已定 | Step 3～8 / 11 / 14 |
| host / Runtime / publication / observation handoff | `03` §13、Step 14 | adapter availability / handoff slot | external contracts pending | Step 3～8 / 11 / 14 |
| logical entry registry / optional outlet posture | `03` §4 / §13 | API / worker / Job registry, optional projection / outlet activation | no listener / process / authorization decision | Step 3～7 / 9 / 11 |
| redaction / diagnostic surface | `03` §14、Step 15 | config validation issue ref, safe log / metric labels | backend / alert product excluded | Step 4 / 8～10 / 12 |
| outbound semantic events | `03` §7 / §13、`L2M-UP-005` | none; all 24 non-materialized | explicitly zero configuration | remain blocked; Step 14 audit |

## 9. 对详细设计的影响判定

| 配置结论 | 是否影响 03 | 影响类型 | 03 回写位置 | 处理状态 |
|---|---:|---|---|---|
| 04 以当前正式 `00~03` 和 Step 14 重建，旧 05 / 06 仅作方向输入 | 否 | 输入权威与文档生成路径 | 不适用 | 无回写 |
| raw config 仅 `infra/config.rs`；builder 仅 `infra/runtime_builder.rs`；其他层只接收 validated input | 否 | 承接既有代码绑定 | 03 §13 / Step 14 已定义 | 无回写 |
| Store、technical、boundary、Consumer、projection、Job、resolver、handoff、registry / feature posture是后续 04 的候选域 | 否 | 既有 logical binding 输入确认 | 03 §13 / Step 14 已定义 | 无回写 |
| 04 不得用配置改变双锚、owner、body-free、Query no-write、state、CAS、typed replay、Unknown fence、24 candidate block 或 dependency classification | 否 | 既有不变量承接 | 03 §3 / §8～§13 已定义 | 无回写 |
| 后续新增 / 改名 `MemberRuntimeConfigRef` 等 typed carrier，新增 builder / adapter constructor 参数、Port、error、DTO 或 function flow | 是 | 代码契约变更 | 03 §4～§13 与对应 Step 4 / 6 / 7 / 8 / 9 / 14 | 已回写（03 已有回开规则；当前未触发） |
| 后续将 raw config 读取下沉到 domain / application / api / worker / jobs，或允许其保存 secret / endpoint / raw body | 是 | 依赖方向与安全契约破坏 | 03 §3 / §4 / §5 / §13 | 设计拒绝；不得进入正式 04 |
| 后续把 `L2M-UP-001~008` exact schema、credential、endpoint、route 或 external success 写为 local configuration fact | 是 | 越界 / 伪造上游合同 | 03 §1 / §7 / §13 / §17 | 设计拒绝；保持 pending / blocked |

本 Step 的结论未改变任何已定义的 `03` 代码契约；当前无 `待回写` 或 `阻塞待确认` 的 03 影响项。上表中的 future trigger 不是本 Step 的回写任务，若后续实际触发，必须停止 04 的相关收敛并先完成针对性的 03 回开。

## 10. 回填草稿：正式 `04-配置设计.md` §1

> 本草稿仅供 Step 15 依据全部已完成 Step 装配正式正文；不是正式 `04`，不得单独作为配置契约。

> 校准来源：
> - `design-calibration/04_config_step_01_upstream_boundary.md`
>
> 延伸阅读：
> - 建议继续阅读上述中间产物的“上游输入映射表”“配置设计不再回答的问题”“配置设计必须回答的问题”“对详细设计的影响判定”和“待确认事项”小节，了解本章输入边界、历史材料和 blocker 如何收敛。

正式 `04` §1 应表达以下结论：

1. 本文直接承接当前正式 `00-需求文档.md`、`01-架构设计.md`、`02-概要设计.md` 和 `03-详细设计.md`；`03` §13 与 `03_ddd_step_14_configuration_external_bindings.md` 是 configuration binding 的直接输入。
2. `04` 只展开配置控制面、可 / 禁止配置化边界、来源 / 优先级、profile / 环境、配置项、敏感性、加载 / 校验 / 生效、变更 / 回滚、失效与下游承接；它不重新定义业务、架构、对象、Port、flow、state 或外部 owner。
3. `infra/config.rs` 是唯一 raw configuration reader / validator，`infra/runtime_builder.rs` 是唯一 composition root；application / domain / contracts / api / worker / jobs 不重新读取或保存 raw config。
4. README、旧正式 `00/01/02/03/05/06` 和 `draft/` 只作 historical / pollution audit；旧 persona、AG-UI、UDS、gRPC、launch token、fixed port、supervisord、product / metric 假设不成为当前配置事实。旧 05/06 只提供下游重建方向。
5. `L2M-UP-001~008`、`L2M-DDD-001~007`、`scope_supersede_gap` 与 `L2M-UP-005` 下 24 candidate 保持 pending / blocked / fail-closed；配置不得产生 external success、event publisher / route / outbox、integration、evidence、verdict 或 readiness。

## 11. 待确认事项与 blocker

| 事项 | 当前影响 | 需要谁 / 什么确认 | 未确认前处理 |
|---|---|---|---|
| `L2M-UP-001` / `L2M-UP-006`：host、IPC、credential、session / health | host slot、sensitive config、activation / failure policy | member-service / Identity formal exact contract | blocked seam；不写 credential raw value、endpoint 或 host-success 默认值 |
| `L2M-UP-002`：pinned image release / entry | image availability / supply reference | member-images + member-service consumer contract | waiting / not-available；不写 manifest / digest / compatibility |
| `L2M-UP-003` / `L2M-UP-004`：Runtime entry / handoff | Runtime slot / source / handoff configuration | Runtime formal EntryAuthority / source-family contract | blocked / waiting / unknown；不创建 Runtime run / payload / route |
| `L2M-UP-005`：Core / Bus event schema / route | outbound event / publication configuration | Core / Bus formal member-specific contract | 24 candidates zero configuration；不创建 publisher / outbox / topic / retry / DLQ |
| `L2M-UP-007`：screening taxonomy / policy source | resolver / policy freshness configuration | Governance / safety formal safe-result taxonomy | owner-specific safe resolution；unknown conservative，不设 local allowlist |
| `L2M-UP-008`：third execution subject | profile / subject configuration scope | Work / Identity / product lifecycle authority | project-scoped dual anchor only；other scope fail closed |
| physical Store / UoW / transport / scheduler / secret / observability product | product binding、default values、operational failure semantics | future technology / owner authority | product-neutral；不将 test fake / local Ready 升格 durable / external ready |
| `L2M-DDD-001~007`、`scope_supersede_gap` | affected implementation, test cut and activation paths | owning 03 Step / formal reopen | 不用 config default、fake、private map 或 product choice掩盖缺口 |
| 新版 05 / 06 / 07 尚未重建 | downstream test / acceptance / implementation handoff | 后续正式文档按串行 SOP | 仅记录 planned handoff；不宣称 environment / evidence / verdict |

## 12. 完成门禁与停审记录

| 检查项 | 结果 | 依据 |
|---|---|---|
| 项目级、文档级和 Step 级恢复门禁已检查 | pass | §1；`project_execution_ledger.md`；`04_config_calibration_flow.md` |
| SOP 五问已逐项回答 | pass | §4 |
| 当前正式 00~03 与 Step 14 的配置输入已映射 | pass | §2、§8.1 |
| 旧 05/06、README 和历史正式链未被当作配置真相源 | pass | §2、§5、§6 |
| 配置设计不再回答 / 必须回答的问题已分开 | pass | §8.2、§8.3 |
| external / sibling / design blocker 均保留 pending / blocked | pass_with_explicit_blockers | §5、§8.1、§11 |
| 未定义 key、默认值、profile、环境矩阵、secret、加载函数、产品或部署动作 | pass | §3；本 Step 仅收敛输入边界 |
| 对 03 的影响已判定，当前无待回写 / 阻塞待确认项 | pass | §9 |
| 正式 `04-配置设计.md` 尚未创建 | pass | 符合 Step 15 后置装配纪律 |

### 停审结论

Step 1 已完成配置输入、权威层级、历史污染、blocker 与详细设计影响判定的收敛。`L2-member` 不是无配置项目：其后续配置设计必须围绕 member-local composition 和既有 logical binding 继续展开，同时保持 product-neutral、body-free、fail-closed 和 external seam 不伪关闭。

```text
step_01 = completed
gate_status = pass_with_explicit_blockers / stop_review
gate_reason = formal_00_to_03_and_step_14_input_boundary_closed;historical_05_06_read_only;no_current_03_writeback;upstream_and_design_blockers_preserved
next_allowed_action = wait_for_explicit_user_confirmation_before_create_step_02_scope
formal_04_write_allowed = false_until_step_15
future_step_files_allowed = false_until_explicit_user_confirmation
implementation_repo_write_allowed = false
test_execution_allowed = false
commit_required = false
```
