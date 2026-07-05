# Step 5. 建立需求追溯与覆盖矩阵

> 对应 SOP: `standards/document/测试方案讨论流程_SOP.md` Step 5
> 回填章节: `05-测试方案.md` §5 需求追溯与覆盖矩阵

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 5 建立需求追溯与覆盖矩阵 |
| 当前状态 | 已完成;待用户审查 |
| 输入基线 | Step 2 范围、Step 3 测试对象与切口、Step 4 分层策略,以及正式 `00/03/04` |
| 输出文件 | `projects/L1-artifact/design-calibration/05_test_plan_step_05_traceability_coverage.md` |
| 停审方式 | 完成本 Step 后暂停,由用户审查后再进入 Step 6 |

## 2. 本步目标

把 `L1-artifact` 的 P0 测试对象、测试切口和测试层级,正式追溯回五个核心能力、`FR-ART-001~020`、`BR-ART-001~025`、`NFR-ART-CAP-001~027`、`NFR-ART-GLOB-001~012`、第 14 章五类验收方向与 `VF-ART-001~004`。

本 Step 只回答:

- 每个核心能力和每条 `FR-ART` 由哪些测试切口覆盖。
- 每组 `BR-ART`、`NFR-ART`、验收方向和 `VF-ART` 由哪些负向断言、配置门禁和 evidence 候选承接。
- Step 3 的每个 P0 测试切口反向证明哪些需求、规则、设计契约和配置门禁。
- 当前是否存在 P0 孤儿需求、孤儿切口、孤儿门禁或覆盖空洞。

本 Step 不展开完整 TC 编号、fixture、脚本名、CI job 名、artifact 路径或正式 evidence 编号。用例矩阵由 Step 6 继续细化,自动化和 gate 由 Step 9 固定,证据归档由 Step 13 固定。

## 3. 本步输入

| 输入 | 状态 | 本 Step 用途 |
|---|---|---|
| `00-需求文档.md` §7 / §9 / §10 / §13 / §14 / §16 | 正式输入 | 提供五个核心能力、`FR-ART` / `BR-ART` / `NFR-ART` / `VF-ART`、五类验收方向和正式追溯矩阵 |
| `03-详细设计.md` §5~§15 | 正式输入 | 提供 7 模块、16 Command、13 Query、6 Consumer、8 Event、6 public job 与 worker-only relay facade 的正式设计契约 |
| `03_ddd_step_16_test_cuts.md` | 直接输入 | 提供最小测试切口、负向入口和 Step 3 反向映射的直接来源 |
| `04-配置设计.md` §6 / §9 / §11 / §12 | 正式输入 | 提供四个 P0 profile、strict JSON、source priority、redaction、builder fail-fast、degraded no-write 和 replay 证据方向 |
| `04_config_step_12_downstream_handoff.md` | 已完成 | 提供 config gate、evidence 类型和 `05/06` 承接口径 |
| `05_test_plan_step_02_scope.md` | 已完成 | 固定 P0 / P1 / P2、非范围和 `VF-ART-001~004` 的测试范围承接 |
| `05_test_plan_step_03_test_objects_cuts.md` | 已完成 | 固定测试对象、协议盘点、P0 切口和设计真相源回指 |
| `05_test_plan_step_04_strategy_layers.md` | 已完成 | 固定主发现层级、辅助层级和四个 P0 profile 的分层映射 |

## 4. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 核心能力是否都能追溯到 P0 测试? | 能。五个核心能力分别追溯到 fact、version、lineage、baseline、consumable reference / backref 主线,并由 query、consumer、outbound、job、config、redaction 和 replay 切口补齐边界。 |
| `FR-ART-001~020` 是否都需要单独覆盖? | 需要。Step 5 不发明 `AC-ART-*`,但每条 `FR-ART` 都必须至少落到一组协议 / 状态 / 边界 / config 场景和一个证据候选族。 |
| `BR-ART` 是否逐条展开? | 本 Step 采用按能力节点的 5 组规则矩阵收敛,同时保留关键负向断言族。Step 6 再拆到具体用例。 |
| 非功能和验收方向如何表达? | `NFR-ART-CAP` 按五个核心能力分组,`NFR-ART-GLOB` 按全局质量主题分组;第 14 章只按 14.1~14.5 五类验收方向引用,不发明新验收编号。 |
| `VF-ART-001~004` 如何进入覆盖矩阵? | 四项都进入 P0,分别绑定核心闭环、正文越界、version / lineage / baseline 失稳和消费反写 truth 的负向测试与 gate。 |
| 是否存在 P0 未覆盖项? | 当前未发现。真实产品适配、production-like、容量 / 硬 SLO、完整跨仓 E2E 和外围增强仍保持在 P1/P2 或残余风险,不计为 P0 空洞。 |

## 5. 当前文档问题诊断

| 位置 | 当前问题 | 本 Step 处理 |
|---|---|---|
| 旧 `05-测试方案.md` | 旧覆盖矩阵围绕旧 Artifact / Version / Baseline 主线,没有承接新版 16 Command / 13 Query / 6 Consumer / 8 Event / 6 Job 和 worker-only relay facade | 不继承旧矩阵,按新版 `00/03/04` 重建 |
| `00-需求文档.md` 第 14 章 | 正式验收按五类组织,但没有 `AC-ART-*` 一类的稳定编号 | 本 Step 直接引用第 14 章 14.1~14.5 和 `VF-ART-001~004`,不发明新 ID |
| Step 3 / Step 4 | 已有切口和层级,但还没有需求侧双向追溯 | 本 Step 建立“需求 -> 测试”和“测试 -> 需求”双向矩阵 |
| `04` §12 | 已有 config gate / evidence 方向,但还未并入总覆盖矩阵 | 本 Step 把 config gate 和 `VF-ART`、第 14 章验收方向一起纳入 |

## 6. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 覆盖主轴 | 只有测试对象和层级 | 增加核心能力、`FR-ART`、`BR-ART`、`NFR-ART`、第 14 章、`VF-ART` 双向追溯 | 便于后续用例和验收闭环 |
| Artifact 验收方向 | 只有“五类验收”口径,无测试映射 | 明确 14.1~14.5 对应的切口、自动化候选和证据候选 | 防止 `06` 前置时缺映射 |
| Config gate | 仍是独立配置承接表 | 合并进总覆盖矩阵 | 配置失效会直接打穿 P0 闭环 |
| Worker-only relay facade | 已单列,但尚未进入需求追溯 | 明确映射到 outbound / no-truth-repair / publish failure 边界 | 防止被误并入 public job 或遗漏 |

## 7. 测试设计取舍

| 议题 | 方案 | 取舍 |
|---|---|---|
| 是否发明 `AC-ART-*` 编号 | A. 新建一套验收 ID;B. 直接引用第 14 章五类验收方向 | 采用 B。Artifact 正式需求没有 `AC-ART-*` 体系 |
| `FR-ART` 覆盖粒度 | A. 按 5 组聚合;B. 20 条逐条追溯 | 采用 B。Step 5 必须给 Step 6 足够精细的入口 |
| `BR-ART` 表达方式 | A. 25 条逐条展开;B. 按 5 组规则面 + 关键负向断言族 | 采用 B。覆盖矩阵要稳,用例细节留给 Step 6 |
| 证据口径 | A. 现在固定正式 evidence ID;B. 只预留 evidence 候选族 | 采用 B。正式 evidence 编号依赖 Step 9 / Step 13 |

## 8. 结构化中间产物

### 8.1 核心能力闭环覆盖矩阵

| 核心能力 | 设计依据 | 测试场景候选 | 用例候选族 | 自动化 | 证据候选族 | 覆盖状态 |
|---|---|---|---|---|---|---|
| 制品事实承载 | `00` §7 / §9 / §14;`03` §7~§10;Step 16 command/query/state cuts | `RegisterArtifactIntake`、`EstablishArtifactFact`、review / responsibility anchor、automation input intake、forbidden body reject、fact query no-write | `TC-ART-FACT-*`;`TC-ART-INTAKE-*`;`TC-ART-BOUNDARY-*` | 是 | `EV-ART-CORE-*`;`EV-ART-FACT-*` | 覆盖 |
| 制品版本化 | `00` §7 / §9 / §14;`03` §7~§10;Step 16 version/state/idempotency cuts | candidate -> publish -> supersede、history retain、duplicate replay、current pointer / candidate 区分、no silent overwrite | `TC-ART-VERSION-*`;`TC-ART-IDEMP-*` | 是 | `EV-ART-CORE-*`;`EV-ART-VERSION-*` | 覆盖 |
| 制品血缘关联 | `00` §7 / §9 / §14;`03` §7~§10 / §14;Step 16 lineage/query/consumer cuts | establish / reject lineage link、automation relationship intake、lineage summary / trace、event / trace not lineage、cross-repo backref boundary | `TC-ART-LINEAGE-*`;`TC-ART-TRACE-*`;`TC-ART-CONSUMER-*` | 是 | `EV-ART-CORE-*`;`EV-ART-LINEAGE-*` | 覆盖 |
| 制品基线冻结 | `00` §7 / §9 / §14;`03` §7~§10 / §12;Step 16 baseline/job cuts | baseline candidate、freeze、supersede、history audit、formal version only、external set cannot replace baseline | `TC-ART-BASELINE-*`;`TC-ART-JOB-*` | 是 | `EV-ART-CORE-*`;`EV-ART-BASELINE-*` | 覆盖 |
| 制品事实可消费表达 | `00` §7 / §9 / §14;`03` §7~§15;`04` §12 | issue consumable ref、record consumption backref、read surface / trace / report、consumer / outbound / handoff seam、downstream no truth write | `TC-ART-CONSUME-*`;`TC-ART-QUERY-*`;`TC-ART-OUTBOX-*`;`TC-ART-HANDOFF-*` | 是 | `EV-ART-CORE-*`;`EV-ART-CONSUME-*` | 覆盖 |

### 8.2 `FR-ART-001~020` 功能需求覆盖矩阵

| 需求 ID | 测试场景候选 | 对应切口 / 层级 | 证据候选族 | 覆盖状态 |
|---|---|---|---|---|
| `FR-ART-001` 正式制品事实纳管 | intake register / establish success and reject | `application_command_orchestration`;`domain_object_invariants`;service + entry | `EV-ART-FACT-*` | 覆盖 |
| `FR-ART-002` 自动化产出事实收束 | automation input register / accept、runtime body-free | `application_command_orchestration`;`redaction / boundary cuts` | `EV-ART-FACT-*`;`EV-ART-REDACTION-*` | 覆盖 |
| `FR-ART-003` 制品事实责任与审查语境 | review anchor、responsibility assignment、review summary query | command + query + state cuts | `EV-ART-FACT-*`;`EV-ART-QUERY-*` | 覆盖 |
| `FR-ART-004` 制品真相与派生材料区分 | preview / report / outbound snapshot no body | query / outbox / redaction cuts | `EV-ART-REDACTION-*`;`EV-ART-OUTBOX-*` | 覆盖 |
| `FR-ART-005` 稳定版本事实形成 | candidate / publish / supersede version | command orchestration + state matrix | `EV-ART-VERSION-*` | 覆盖 |
| `FR-ART-006` 自动化迭代版本收束 | automation result enters candidate / publish flow | command + idempotency + boundary cuts | `EV-ART-VERSION-*`;`EV-ART-IDEMP-*` | 覆盖 |
| `FR-ART-007` 版本审查与责任语境 | get version / list versions / review responsibility around version | query + command + state cuts | `EV-ART-VERSION-*`;`EV-ART-QUERY-*` | 覆盖 |
| `FR-ART-008` 历史版本可追溯保留 | list historical versions、trace / report / archive explanation | query + job / handoff cuts | `EV-ART-VERSION-*`;`EV-ART-HANDOFF-*` | 覆盖 |
| `FR-ART-009` 正式血缘语境建立 | establish lineage link / reject invalid lineage | command + domain policy cuts | `EV-ART-LINEAGE-*` | 覆盖 |
| `FR-ART-010` 自动化产出关系收束 | runtime / external source signals become formal lineage only by explicit flow | consumer + command + boundary cuts | `EV-ART-LINEAGE-*`;`EV-ART-CONSUMER-*` | 覆盖 |
| `FR-ART-011` 血缘审查与影响理解 | lineage summary / preview / report for review | query + read-surface cuts | `EV-ART-LINEAGE-*`;`EV-ART-QUERY-*` | 覆盖 |
| `FR-ART-012` 血缘审计与跨仓消费边界 | trace / backref / event seam point back to formal lineage | query + consumer + outbound + handoff cuts | `EV-ART-LINEAGE-*`;`EV-ART-TRACE-*` | 覆盖 |
| `FR-ART-013` 受控版本集合形成 | create baseline candidate / freeze baseline | command + state matrix cuts | `EV-ART-BASELINE-*` | 覆盖 |
| `FR-ART-014` 基线候选与冻结语境收束 | only formal versions enter baseline, temporary material rejected | command + boundary + config cuts | `EV-ART-BASELINE-*`;`EV-ART-BOUNDARY-*` | 覆盖 |
| `FR-ART-015` 冻结责任与审查语境 | baseline review / responsibility coherence | command + query + state cuts | `EV-ART-BASELINE-*`;`EV-ART-QUERY-*` | 覆盖 |
| `FR-ART-016` 历史基线可审计与跨仓边界 | get baseline / report / archive handoff with stable membership | query + job + handoff cuts | `EV-ART-BASELINE-*`;`EV-ART-HANDOFF-*` | 覆盖 |
| `FR-ART-017` 稳定 Artifact truth 引用表达 | issue consumable reference and stable read surface | command + query cuts | `EV-ART-CONSUME-*`;`EV-ART-QUERY-*` | 覆盖 |
| `FR-ART-018` 消费边界与 truth 不转移 | record backref、consumer / sync / archive / observability seam no ownership transfer | command + consumer + handoff + boundary cuts | `EV-ART-CONSUME-*`;`EV-ART-HANDOFF-*` | 覆盖 |
| `FR-ART-019` 审查责任与协作消费一致 | review / responsibility and downstream consumption point to same truth anchor | query + backref + report cuts | `EV-ART-CONSUME-*`;`EV-ART-TRACE-*` | 覆盖 |
| `FR-ART-020` 跨仓审计回指与事实解释 | trace, report, archive / observability / sync handoff explain source truth | query + job + handoff + observability cuts | `EV-ART-CONSUME-*`;`EV-ART-HANDOFF-*` | 覆盖 |

### 8.3 `BR-ART-001~025` 规则覆盖矩阵

| 规则组 | 规则主题 | 测试场景候选 | 主要切口 | 覆盖状态 |
|---|---|---|---|---|
| `BR-ART-001~005` | 正式 fact 入口、显式事实收束、责任锚点、派生材料边界、相邻仓不得定义 fact | intake accept / reject、forbidden body、preview / report / event snapshot、consumer no-truth-write | fact / query / consumer / outbox / redaction cuts | 覆盖 |
| `BR-ART-006~010` | 稳定版本事实、禁止无声覆盖、自动化再生成入版本语境、确定版本引用、历史版本审计 | candidate / publish / supersede、duplicate replay、history query、conflict / stale / current pointer 区分 | version / state / idempotency / query cuts | 覆盖 |
| `BR-ART-011~015` | 正式 lineage 锚点、显式关系收束、automation lineage 边界、血缘语境审查、跨仓血缘消费边界 | establish lineage、reject trace-as-lineage、lineage summary、consumer snapshot / stale marker | lineage / consumer / trace / boundary cuts | 覆盖 |
| `BR-ART-016~020` | baseline 受控集合、候选过滤、显式冻结、责任集合语境、历史 baseline 审计 | baseline candidate / freeze / supersede、formal-version-only、history baseline query / handoff | baseline / query / job / handoff cuts | 覆盖 |
| `BR-ART-021~025` | 统一 truth 引用、跨仓消费边界、automation/runtime 消费边界、责任协作消费、跨仓审计回指 | issue consumable ref、record backref、downstream no truth rewrite、report / trace explanation | consume / query / consumer / handoff / boundary cuts | 覆盖 |

### 8.4 `NFR-ART` 覆盖矩阵

| NFR 组 | 非功能主题 | 测试场景候选 | 主要切口 | 覆盖状态 |
|---|---|---|---|---|
| `NFR-ART-CAP-001~006` | fact 纳管、边界异常识别、重复输入一致性 | intake duplicate, forbidden body, fact traceability | fact / idempotency / redaction cuts | 覆盖 |
| `NFR-ART-CAP-007~011` | version 稳定区分、不可无声覆盖 | version publish / supersede / history / current pointer | version / state / query cuts | 覆盖 |
| `NFR-ART-CAP-012~016` | lineage 读取、审计追溯、安全边界 | lineage summary / trace / external signal reject | lineage / consumer / trace cuts | 覆盖 |
| `NFR-ART-CAP-017~021` | baseline 可回溯、可解释、不可被外部范围替代 | baseline history, freeze replay, external-set reject | baseline / handoff / boundary cuts | 覆盖 |
| `NFR-ART-CAP-022~027` | 下游稳定引用、消费失败不反写 truth、消费异常可识别 | consumable ref / backref, degraded read, handoff failure immutability | consume / query / handoff / job cuts | 覆盖 |
| `NFR-ART-GLOB-001~002` | truth 判断不依赖外围材料;单一 Artifact truth | query / trace / read surface must resolve from formal truth only | query / boundary / architecture cuts | 覆盖 |
| `NFR-ART-GLOB-003;011` | 外部正文不归属 | raw body / secret / full sensitive ref reject | redaction / config / outbox cuts | 覆盖 |
| `NFR-ART-GLOB-004;006;009` | 依赖降级不伪造 truth | degraded / unavailable / partial failure no repair | query no-write / job no-truth-repair / config failure cuts | 覆盖 |
| `NFR-ART-GLOB-005` | 变化协作不承载 truth | outbound event / notification / sync only carry snapshot / refs | outbox / handoff / boundary cuts | 覆盖 |
| `NFR-ART-GLOB-007;008` | 跨能力变化可追溯 | trace / report / backref explain source truth | trace / report / handoff cuts | 覆盖 |
| `NFR-ART-GLOB-010` | 边界异常可识别 | ownership crossing, write-on-query, write-on-job, unsupported source | boundary / config / observability cuts | 覆盖 |
| `NFR-ART-GLOB-012` | 无来源硬指标不固化 | 不把真实容量、P95 / P99、production-like 升格为 P0 gate | scope / release gate audit | 覆盖 |

### 8.5 第 14 章验收方向、`VF-ART` 与 config gate 覆盖矩阵

| 验收 / 门禁项 | 测试承接 | 自动化 | 证据候选族 | 覆盖状态 |
|---|---|---|---|---|
| 第 14.1 核心能力闭环验收 | 五个核心能力主线 + query / consumer / job / handoff 主链 smoke | 是 | `EV-ART-CORE-*` | 覆盖 |
| 第 14.2 功能能力验收 | `FR-ART-001~020` 逐条映射到协议 / 状态 / 边界场景 | 是 | `EV-ART-FR-*` | 覆盖 |
| 第 14.3 规则 / 边界验收 | `BR-ART-001~025` 五组规则 + 负向断言 | 是 | `EV-ART-BR-*`;`EV-ART-BOUNDARY-*` | 覆盖 |
| 第 14.4 数据归属验收 | 真相 / 快照 / 引用 / 禁止保存正文边界 | 是 | `EV-ART-REDACTION-*`;`EV-ART-OWNERSHIP-*` | 覆盖 |
| 第 14.5 非功能验收 | `NFR-ART-CAP` / `NFR-ART-GLOB` 与 config / replay / no-write / no-repair | 是 | `EV-ART-NFR-*`;`EV-ART-CONFIG-*` | 覆盖 |
| `VF-ART-001` 核心闭环断裂 | 核心能力任一主线失败即 veto | 是 | `EV-ART-CORE-*` | 覆盖 |
| `VF-ART-002` 外部正文或消费副本进入正式 truth | forbidden body / raw secret / preview-outbox-report leak / wrong owner reject | 是 | `EV-ART-REDACTION-*`;`EV-ART-BOUNDARY-*` | 覆盖 |
| `VF-ART-003` version / lineage / baseline 无法稳定形成、追溯或冻结 | version / lineage / baseline 主线和历史查询、freeze / supersede、trace explanation | 是 | `EV-ART-VERSION-*`;`EV-ART-LINEAGE-*`;`EV-ART-BASELINE-*` | 覆盖 |
| `VF-ART-004` 下游或外围可以反写 Artifact truth | query no-write、consumer no-truth-write、job no-truth-repair、handoff failure immutability | 是 | `EV-ART-QUERY-*`;`EV-ART-JOB-*`;`EV-ART-HANDOFF-*` | 覆盖 |
| Config schema / no silent fallback / builder gate | strict JSON、unknown field reject、source priority、invalid config no facade | 是 | `EV-ART-CONFIG-*` | 覆盖 |
| Sensitive no-output / topic completeness / replay gate | redaction scan、enabled topic completeness、operations-replay replay root / report replay | 是 | `EV-ART-CONFIG-*`;`EV-ART-REPLAY-*` | 覆盖 |
| Degraded no-write / relay-handoff immutability gate | degraded query no-write、publish / handoff failure no truth rollback | 是 | `EV-ART-QUERY-*`;`EV-ART-HANDOFF-*` | 覆盖 |

### 8.6 测试切口反向覆盖矩阵

| 测试切口 | 反向证明的需求 / 规则 | 设计契约 | 用例候选族 | 覆盖状态 |
|---|---|---|---|---|
| `contracts_protocol_roundtrip`;`contracts_metadata_validation`;`contracts_operation_digest_profile` | `FR-ART-001~020`;第 14.2;`NFR-ART-GLOB-002` | `03` §7 / Step 8 / Step 16 | `TC-ART-CONTRACT-*` | 覆盖 |
| `domain_object_invariants`;`domain_policy_accept_reject`;`domain_state_matrix_transitions` | `BR-ART-001~025`;`VF-ART-003`;第 14.3 | `03` §6 / §9 / §10 / Step 16 | `TC-ART-DOMAIN-*`;`TC-ART-STATE-*` | 覆盖 |
| `application_command_orchestration` | `FR-ART-001~020`;`BR-ART-002;008;012;018`;第 14.1 / 14.2 | `03` §8 / §11~§13 / Step 16 | `TC-ART-CMD-*` | 覆盖 |
| `application_query_no_write` | `FR-ART-017~020`;`BR-ART-021~025`;`VF-ART-004`;config degraded no-write gate | `03` §7 / §8 / §14 / Step 16 | `TC-ART-QUERY-*` | 覆盖 |
| `application_consumer_orchestration` | `FR-ART-010;012;018;020`;`BR-ART-005;015;022~025`;`VF-ART-004` | `03` §7 / §8 / §12 / Step 16 | `TC-ART-CONSUMER-*` | 覆盖 |
| outbound event schema cuts | `FR-ART-004;012;020`;`BR-ART-004;015;025`;`NFR-ART-GLOB-005` | `03` §7 / §8 / §13 / Step 16 | `TC-ART-OUTBOX-*` | 覆盖 |
| public job cuts | `FR-ART-016;020`;`NFR-ART-GLOB-004;006;009`;`VF-ART-004` | `03` §7 / §8 / §11~§13 / Step 16 | `TC-ART-JOB-*` | 覆盖 |
| `PublishPendingArtifactRelays_job` | relay immutability、stored snapshot publish、no accepted truth rollback | `03` Step 8 / Step 16;`04` §12 | `TC-ART-RELAY-*` | 覆盖 |
| consistency / idempotency / concurrency cuts | `BR-ART-006~010`;`NFR-ART-CAP-001~006`;`NFR-ART-GLOB-002` | `03` §11~§13 / Step 16 | `TC-ART-IDEMP-*` | 覆盖 |
| config / replay / redaction / dependency boundary cuts | 第 14.4 / 14.5;`VF-ART-002`;config gates;`NFR-ART-GLOB-003;004;010;012` | `04` §6 / §9 / §11 / §12;`03` §14 / §15 | `TC-ART-CONFIG-*`;`TC-ART-REDACTION-*`;`TC-ART-ARCH-*` | 覆盖 |

### 8.7 未覆盖项与非 P0 项

| 项 | 状态 | 原因 | 后续处理 |
|---|---|---|---|
| P0 核心能力、`FR-ART-001~020`、`BR-ART-001~025`、`VF-ART-001~004` | 无未覆盖项 | 均已映射到测试切口、层级和证据候选族 | Step 6 继续拆用例 |
| 真实 store / bus / secret provider / search 产品 | 非 P0 | 产品未锁定,只做 seam 验证 | P1 / P2 |
| `staging-like` / `production-like`、容量 / P95 / P99 / SLO | 非 P0 | `NFR-ART-GLOB-012` 明确无来源硬指标不固化 | Step 10 / Step 14 |
| 完整跨仓 E2E、UI / dashboard / sync 体验 | 非 P0 | 当前只验证 Artifact side seam | P1 / P2 |

### 8.8 覆盖矩阵停审记录

| 审查项 | 结论 | 说明 |
|---|---|---|
| 五个核心能力是否都有 P0 测试主线 | 通过 | 见 §8.1 |
| `FR-ART-001~020` 是否逐条有测试承接 | 通过 | 见 §8.2 |
| `BR-ART-001~025` 是否有成组规则覆盖 | 通过 | 见 §8.3 |
| 第 14 章五类验收和 `VF-ART-001~004` 是否有测试映射 | 通过 | 见 §8.5 |
| Step 3 全部 P0 测试切口能否反查需求 / 规则 / 设计契约 | 通过 | 见 §8.6 |
| 是否存在 P0 孤儿需求、孤儿切口、孤儿 gate | 通过 | 当前未发现 |
| 是否把 P1/P2 冒充为 P0 通过条件 | 通过 | 见 §8.7 |

## 9. 对上游设计的影响判定

| 覆盖结论 | 是否影响上游 | 影响类型 | 处理状态 |
|---|---|---|---|
| 当前 P0 覆盖矩阵无空洞 | 否 | 测试方案收束 | 无需回写 |
| 第 14 章按五类验收方向引用,不发明 `AC-ART-*` | 否 | 需求侧引用纪律 | 已固定 |
| Step 6 若发现某条 `FR-ART` 仍无法拆出稳定用例 | 是 | 可验证性缺口 | 回写 `03/04` 或记录阻塞 |

## 10. 回填草稿

> 校准来源:
> - `design-calibration/05_test_plan_step_05_traceability_coverage.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“核心能力闭环覆盖矩阵”“`FR-ART-001~020` 功能需求覆盖矩阵”“第 14 章验收方向、`VF-ART` 与 config gate 覆盖矩阵”“测试切口反向覆盖矩阵”和“覆盖矩阵停审记录”小节。

正式 `05-测试方案.md` §5 应回填:

- 需求追溯必须从五个核心能力、`FR-ART-001~020`、`BR-ART-001~025`、`NFR-ART-CAP-001~027`、`NFR-ART-GLOB-001~012`、第 14 章五类验收方向和 `VF-ART-001~004` 回指到 Step 3 测试切口。
- 不发明 `AC-ART-*` 之类的新验收编号;验收追溯直接引用第 14 章 14.1~14.5 和 `VF-ART-001~004`。
- `PublishPendingArtifactRelays` 必须继续保持为 worker-only internal facade,单独纳入 relay immutability 和 stored snapshot publish 覆盖,不得并入 6 个 public job。
- config gate 必须进入总覆盖矩阵,至少覆盖 strict JSON、source priority、redaction no-output、runtime builder gate、degraded no-write、replay gate 和 relay / handoff immutability。
- Step 6 必须在本矩阵基础上继续细化用例族,不得改写追溯关系或新增无来源测试目标。

## 11. 待确认事项

| 待确认事项 | 影响 | 当前处理 |
|---|---|---|
| Step 6 将按 command / query / consumer / event / job / config 分批展开 | 影响后续写入节奏 | 已接受,后续按切口分批 |
| 第 13 步 evidence 编号是否沿用 `EV-ART-*` 族命名 | 影响正式证据索引 | 当前只作为候选族,可在 Step 13 调整 |

## 12. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| 核心能力、`FR-ART`、`BR-ART`、`NFR-ART`、第 14 章和 `VF-ART` 均有测试映射 | 通过 | 见 §8.1~§8.5 |
| Step 3 全部 P0 切口可反查需求 / 规则 / 设计契约 | 通过 | 见 §8.6 |
| P0 无未覆盖项 | 通过 | 见 §8.7 |
| 覆盖矩阵已停审 | 通过 | 见 §8.8 |
| 可进入 Step 6 | 通过 | 下一步设计测试场景与用例矩阵;进入前等待用户审查 |
