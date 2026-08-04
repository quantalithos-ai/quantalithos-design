# L4-observability 05-测试方案 Step 06 · 测试场景与用例矩阵

## Step 状态

| 字段 | 当前值 |
|---|---|
| 文档 / Step | `05-测试方案 / Step 06 设计测试场景与用例矩阵` |
| mode | `full-restart` |
| status | `completed_current_with_inherited_affected_open` |
| current_module | `all_cases_protocols_states_phases_and_audits` |
| historical_material | 旧 53 行 Step 06 仅有 21 个摘要用例，缺 60 协议、27+1 状态、phase 与逐切口停审，已删除，不继承其完成结论 |
| formal_document_write | `blocked_until_Step15` |
| implementation_or_execution | `not_started` |
| real_evidence / run_id / verdict / signoff | `absent_by_design` |
| new_upstream_blocker | `none` |
| inherited_blocker | I05 payload/schema 与 producer binding 保持 `open_upstream_internal`；H13 保持 `open_controlled`；其余 affected 保持开放 |
| next_allowed_action | 读取 Step 07 SOP、书写规范和 current Step 03~06，重建测试数据设计 |

## 1. 本步输入

| 输入 | 本步使用内容 | 真相源优先级 |
|---|---|---|
| `05_test_plan_step_05_traceability_coverage.md` | 16 个 canonical 切口、候选 TC / EV 范围、FR/BR/DO/NFR/AC/VF 双向覆盖、affected 处置 | 本步直接上游 |
| `03-详细设计.md` §7~§13、§15 | 60 个 exact protocol、函数级 phase、27 个正式状态、UoW、恢复、并发、幂等与最小测试切口 | current detailed-design truth |
| `03_ddd_step_09_exact_flow_cards.md` | 每协议 exact entry、owner、写集、错误、key/token、观测及 affected | 协议用例直接输入 |
| `03_ddd_step_10_state_matrix.md` | 27 个正式状态 owner、合法/非法/terminal/reserved 转换和 1 个技术协调状态 | 状态用例直接输入 |
| `03_ddd_step_16_test_cuts.md` | 模块、协议、状态、事务、配置、telemetry 和脚本切口 | planned verification baseline |
| `04-配置设计.md` §6~§13 | `LocalTest` / `IntegrationLike` / `RuntimeLike`、typed snapshot、启动与降级红线 | 配置/运行时用例输入 |
| 测试方案 SOP Step 06 / 书写规范 | 可执行用例、逐切口停审、跨用例 phase 审计、稳定编号 | 本步过程与格式标准 |
| L1-governance / L1-artifact Step 06 | 用例矩阵粒度参考 | 只参考粒度，不复制业务结论 |

本步不以旧 `05-测试方案.md`、旧 Step 06、README 的历史叙述或未来 `06/07` 草稿作为 current 结论来源。

## 2. SOP 问题回答

| SOP 问题 | 本步回答 |
|---|---|
| P0 正向主线如何执行 | 从 formal input/owner pre-state 建立 fixture，经 exact entry -> assembler -> service/domain -> staged UoW 或只读边界执行，并断言正式 post-state、history/outbox/result 或明确的 zero-write surface |
| 关键反向和边界如何触发 | 使用 missing/wrong-owner/body-bearing ref、unsupported schema、visibility/freshness gap、terminal/reserved state、CAS/fence conflict、dependency unavailable 和 phase mismatch 等 typed 条件，不解析错误文本 |
| 非法迁移如何断言 | 对 27 个正式状态分别建立 table-driven legal/illegal/terminal/reserved 集；非法迁移必须返回正式 typed error，且 object/version/history/outbox/stale/result 均不变 |
| 事务回滚如何验证 | 在 reserve、load、transition、stage、cursor、history/outbox、result/completion、commit 各点注入失败，比较 committed store、cursor、outbox、idempotency 与 external call spy |
| 恢复场景如何复现 | 区分 pre-commit failure、commit known rollback、commit unknown、external outcome unknown、stale fence 和 duplicate replay；恢复只能使用正式 recovery class、probe/token 或 manual branch |
| 正式字段/状态/事件如何引用 | 协议与状态逐字引用 `03` 的 C/Q/I/E/J 名称、state owner 和 E01~E12；本步不创设别名状态、业务 truth 或通用 handler |
| 如何防止 phase 越界 | Command 只断言 local preparation；Event 只断言 committed immutable snapshot；external Job 分 prepare/call/finalize；Consumer ack 只在 local completion certainty 后；验收 verdict 不进入测试预期 |
| 切口场景类型如何闭合 | 每个 canonical 切口至少有正向与关键负向；涉及共享状态的切口补边界/并发，涉及 UoW/external effect 的切口补恢复/phase |
| 数据、自动化与证据如何表达 | 本步仅声明 fixture class、自动化候选和 `EV-CAND-*` 候选 ID；具体数据集由 Step 07、环境由 Step 08、脚本/门禁由 Step 09、归档 schema 由 Step 13 收口 |
| affected 如何测试 | 可验证的 fail-closed/blocked/manual 分支进入 current 用例；缺 canonical upstream owner 的正向路径保持 `blocked/conditional`，不得用本地假 DTO 代替 |

## 3. 当前文档问题诊断与改动前后对比

| 维度 | historical Step 06 | current 重建要求 |
|---|---|---|
| 行数 / 粒度 | 53 行、21 个摘要 TC，低于 governance 约 380 行和 artifact 约 258 行 | L4 有 60 协议与 27+1 状态，按其实际复杂度展开，不以参考项目行数作为上限 |
| 切口组织 | 只有 ingest/audit/signal/query/report 等散点 | 16 个 canonical 切口逐一形成 case batch 与停审记录 |
| 协议覆盖 | 未逐项覆盖 16 Command、14 Query、9 Consumer、12 Event、9 Job | `60/60` 独立协议行；不得用 family summary 替代 exact protocol |
| 状态覆盖 | 未覆盖正式状态矩阵 | 27 个 owner 逐项覆盖 legal/illegal/terminal/reserved，另覆盖 `ObservationJobPlanItemState` 技术协调 |
| phase | 未区分 UoW、commit unknown、outbox、external prepare/call/finalize | 建立 phase-specific case 和 forbidden assertion |
| truth 边界 | 仅写笼统“不反写” | 对 Query、rebuild、report、export、Consumer、Job 配 write spy/capability/committed-state 断言 |
| blocker | I05/J06 被写成可有正向成功 | I05 仅 pre-parse fail-closed；J06 仅 controlled blocked/manual/no-fabrication |
| evidence | 候选 ID 与真实 evidence 边界不足 | 候选 ID 仅为 schema 预留，不等同 artifact、run、结果、verdict 或签署 |

## 4. 测试设计取舍

| 议题 | 采用方案 | 不采用方案 | 原因 |
|---|---|---|---|
| 用例主轴 | 16 个 canonical 切口定义主用例；60 协议和 27+1 状态作为反向 closure index | 为每个矩阵重复创建一套互不关联 TC | 保持稳定 TC 身份，同时证明协议和状态无孤儿 |
| P0 场景 | 正向、关键负向、边界、并发、恢复、phase 按风险选择，不强迫每切口机械拥有六类 | 每切口只写 happy path，或机械复制六行 | 让用例数量与风险匹配，且每个缺口可停审 |
| Query | 14 项逐项验证 exact surface 与 strict zero-write | 只抽测一个通用 Query | selector/cursor/visibility/freshness contract 不同，必须逐项闭合 |
| Event | 验证 accepted UoW 内 immutable snapshot 和 publisher stored-only | 发布时从 current truth 重新编码 | 历史 payload 必须来自 committed snapshot |
| Consumer | header/schema/producer gate 先于 payload parse；ack/action 晚于 completion certainty | 先 parse payload 再判断 schema，或 unknown 时默认 ack | 防止不受信 payload 和 indeterminate completion 被错误消费 |
| Job | immutable plan、claim/fence、逐 item UoW、report fold、terminal replay | 一个长事务扫描并外调 | 与 current staged Job 设计一致 |
| evidence | `EV-CAND-OBS-*` 只绑定应留存断言集合 | 预填真实 alias/run/status | 当前没有执行事实，不能伪造 |

## 5. 用例契约与编号

### 5.1 用例字段语义

| 字段 | 必须表达的内容 | 禁止内容 |
|---|---|---|
| `TC` | 唯一、稳定的设计用例 ID | `case1`、临时编号、同 ID 多重定义 |
| `kind` | `positive` / `negative` / `boundary` / `concurrency` / `recovery` / `phase` / `static` | 模糊的“综合测试” |
| 前置 / 操作 | formal fixture class、pre-state、故障点与 exact protocol/action | 未定义字段、随机构造上游 canonical DTO |
| 预期 / 断言 | formal state/error/event、write-set、call count、ordering 与 forbidden absence | “成功即可”、后续 phase 状态、验收结论 |
| 自动化候选 | unit/service/contract/repository/integration/static 中最早发现风险的层 | 当前已自动化、已运行或已通过的声明 |
| candidate EV | 与 TC 一一对应的候选 evidence ID | 真实 artifact alias、run_id、verdict、signoff |

编号采用 Step 05 已冻结的 `TC-OBS-<CUT>-<NNN>` 与 `EV-CAND-OBS-<CUT>-<NNN>`。本步对每个 TC 只定义一次；后续协议、状态和 phase 矩阵只引用，不重新定义。

### 5.2 通用 P0 断言包

| 断言包 | 适用范围 | 必须断言 |
|---|---|---|
| `ASRT-BODY-FREE` | ingress、Consumer、Event、report/export | raw body、secret、endpoint、provider response、真实 run/evidence alias 不出现在 owner/history/outbox/log/error/report |
| `ASRT-UOW-ATOMIC` | accepted Command/Consumer | owner/post-state + native history + one cursor + immutable outbox + stale/result/completion 同成同败；rollback 后不可见 |
| `ASRT-NOWRITE` | 14 Query、rebuild/replay/export read phase | write UoW、reservation、save/append、stale、refresh、durable read audit、source writer call count 均为 0 |
| `ASRT-SNAPSHOT` | E01~E12/J01 | event bytes/schema/cursor/trace/binding/digest 来自 committed immutable snapshot；publish 不读 current owner |
| `ASRT-IDEMPOTENT` | mutation protocols | same key+digest replay exact stored result；different digest conflict；in-flight 不启 second writer |
| `ASRT-STATE-GUARD` | 27 state owner | invalid/terminal/reserved 返回 typed error，version/state/history/outbox 均不变 |
| `ASRT-EXTERNAL-PHASE` | J07/J08/I08/I09 | prepare commit 在 call 前；call 无 DB transaction；finalize 使用同 token/binding；unknown 不盲重试、不伪造完成 |
| `ASRT-TRUTH-BOUNDARY` | 全部切口 | 只写 observation-owned truth/projection/marker；相邻项目业务 truth writer 集合为空 |

## 6. 16 个 canonical 测试切口与用例批次

### 6.1 批次总览

| 测试切口 | 用例批次 | 场景类型 | P | 数据前置类 | candidate EV | 当前停审状态 |
|---|---|---|---|---|---|---|
| `CUT-INGEST-ADMISSION` | `TC-OBS-ING-001~004` | positive/negative/boundary/idempotent | P0 | safe source summary、forbidden body marker、same/conflict digest | `EV-CAND-OBS-ING-001~004` | `pass_planned` |
| `CUT-CORRELATION-SOURCE` | `TC-OBS-COR-001~003` | positive/boundary/concurrency | P0 | accepted receipt、safe/ambiguous seed、version pair | `EV-CAND-OBS-COR-001~003` | `pass_planned` |
| `CUT-REDACTION-SAFETY` | `TC-OBS-RED-001~004` | positive/negative/static/phase | P0 | clean/redacted/forbidden candidate、serializer spy | `EV-CAND-OBS-RED-001~004` | `pass_planned` |
| `CUT-AUDIT-PROJECTION` | `TC-OBS-AUD-001~004` | positive/negative/boundary/rollback | P0 | source audit ref、relation、visibility、append fault | `EV-CAND-OBS-AUD-001~004` | `pass_planned` |
| `CUT-EVIDENCE-BODY-FREE` | `TC-OBS-EVD-001~004` | positive/negative/boundary/blocked | P0 | projection、body-free ref、resolver outcomes、I05 gate | `EV-CAND-OBS-EVD-001~004` | `pass_conditional` |
| `CUT-SIGNAL-PROJECTION` | `TC-OBS-SIG-001~006` | positive/negative/boundary/concurrency/recovery/static | P0 | context、safe summary、raw signal candidate、rollup CAS | `EV-CAND-OBS-SIG-001~006` | `pass_planned` |
| `CUT-DEGRADED-VISIBILITY` | `TC-OBS-DEG-001~005` | boundary/negative/query/consistency/recovery | P0 | missing/not-visible/stale/rebuilding/degraded fixtures | `EV-CAND-OBS-DEG-001~005` | `pass_conditional` |
| `CUT-QUERY-NOWRITE` | `TC-OBS-QRY-001~004` | positive/boundary/negative/concurrency | P0 | visible/empty/hidden/stale read facets、write spies | `EV-CAND-OBS-QRY-001~004` | `pass_planned` |
| `CUT-DIAGNOSTIC-GUARD` | `TC-OBS-DIA-001~004` | positive/negative/recursion/static | P0 | diagnostic composite、violation target、sink guard | `EV-CAND-OBS-DIA-001~004` | `pass_planned` |
| `CUT-REPORT-HANDOFF` | `TC-OBS-RPT-001~005` | positive/negative/phase/recovery/static | P0 | immutable evidence input、gap/visibility、delivery token | `EV-CAND-OBS-RPT-001~005` | `pass_conditional` |
| `CUT-EVIDENCE-AUTHENTICITY` | `TC-OBS-AUT-001~003` | positive/boundary/negative-static | P0 | owner-backed linkage、placeholder、insufficient basis | `EV-CAND-OBS-AUT-001~003` | `pass_planned` |
| `CUT-RETENTION-PROTECTION` | `TC-OBS-RET-001~005` | positive/negative/concurrency/rollback/no-delete | P0 | marker、active consumer set、CAS versions | `EV-CAND-OBS-RET-001~005` | `pass_planned` |
| `CUT-REBUILD-REPLAY-NOWRITE` | `TC-OBS-REB-001~006` | positive/negative/concurrency/recovery/blocked/static | P0 | immutable plans、stored inputs、claim/fence、H13 gate | `EV-CAND-OBS-REB-001~006` | `pass_conditional` |
| `CUT-UOW-IDEMPOTENCY-RECOVERY` | `TC-OBS-UOW-001~008` | rollback/commit-unknown/idempotency/CAS/cursor/outbox/external | P0 | fault schedule、stored result、tokens、fences | `EV-CAND-OBS-UOW-001~008` | `pass_conditional` |
| `CUT-CONFIG-RUNTIME-REDLINE` | `TC-OBS-CFG-001~006` | positive/negative/profile/activation/degradation/static | P0 | three profiles、typed snapshot、availability probes | `EV-CAND-OBS-CFG-001~006` | `pass_planned` |
| `CUT-DEPENDENCY-REDLINE` | `TC-OBS-DEP-001~003`, `TC-OBS-HIST-001~002` | static/compile/history | P0 | manifest/module graph/source and docs corpus | `EV-CAND-OBS-DEP-001~003`, `EV-CAND-OBS-HIST-001~002` | `pass_planned` |

### 6.2 Intake、correlation 与 redaction 用例

| TC | kind | 前置与输入 / 操作 | 预期结果与核心断言 | 自动化候选 | candidate EV |
|---|---|---|---|---|---|
| `TC-OBS-ING-001` | positive | C01 输入含 typed source ref/purpose/safe summary；执行准入 | receipt 和 safety/disposition 依 formal policy 落 observation-owned state；应用 `ASRT-UOW-ATOMIC/BODY-FREE/TRUTH-BOUNDARY` | service + repository contract | `EV-CAND-OBS-ING-001` |
| `TC-OBS-ING-002` | negative | candidate 含 raw body/secret/provider response；执行 C01/I01 准入 | `Rejected` 或 body-free `Quarantined` 仅按 formal policy；raw material 在 serialization、store、outbox、telemetry 前被阻断 | service + redaction scan | `EV-CAND-OBS-ING-002` |
| `TC-OBS-ING-003` | idempotent | 已有 completed reservation；same key+semantic digest 重放 | exact stored result/receipt surface replay；resolver/domain/history/outbox 第二次调用均为 0 | service + call spies | `EV-CAND-OBS-ING-003` |
| `TC-OBS-ING-004` | boundary | same key、different digest，或 Reserved in-flight 并发进入 | typed digest conflict/in-flight surface；无 second writer、无覆盖 first result、无 payload 回显 | concurrency service | `EV-CAND-OBS-ING-004` |
| `TC-OBS-COR-001` | positive | accepted receipt + matching safe source/trace/causation refs；执行 C03 | `CorrelationContextState` 依正式转换为 `Bound` 或有依据的 `Partial`；只建立 local correlation，不推导业务关系 truth | domain + service | `EV-CAND-OBS-COR-001` |
| `TC-OBS-COR-002` | boundary | seed absent、ambiguous、wrong owner 或 source mismatch | absent 按 formal optionality 处理；ambiguous/mismatch fail closed；不 mint 替代 ref、不创建 context | assembler + domain | `EV-CAND-OBS-COR-002` |
| `TC-OBS-COR-003` | concurrency | 两个 version 相同的 bind 对同一 context 竞争 | 仅一个 CAS 成功；loser 为 typed conflict/reload class；不合并两组 opaque refs | service + repository CAS | `EV-CAND-OBS-COR-003` |
| `TC-OBS-RED-001` | positive | clean 与 redacted 两组 safe summary；执行 C02 | formal `Safe`/`Redacted` 分支及 marker/summary compatibility 正确；receipt admission 不被 C02 越权改写 | domain table | `EV-CAND-OBS-RED-001` |
| `TC-OBS-RED-002` | negative | forbidden body、missing marker、marker/summary 不兼容或 terminal disposition 重写 | typed safety/transition error；owner/history/outbox/result 不变；错误只含 safe detail | domain + service | `EV-CAND-OBS-RED-002` |
| `TC-OBS-RED-003` | static | 扫描 public DTO/event/report/error/log fields 和 serializer inputs | raw body、secret、endpoint、provider response、真实 evidence/run 字段集合为空 | schema/source scan | `EV-CAND-OBS-RED-003` |
| `TC-OBS-RED-004` | phase | 在 serializer 前后分别放置 sensitive sentinel 与 serialization spy | sentinel 必须在 serialization 前被拒绝/裁剪；serializer、outbox encoder 与 telemetry sink 从未收到 forbidden material | component integration | `EV-CAND-OBS-RED-004` |

### 6.3 Audit、evidence 与 signal 用例

| TC | kind | 前置与输入 / 操作 | 预期结果与核心断言 | 自动化候选 | candidate EV |
|---|---|---|---|---|---|
| `TC-OBS-AUD-001` | positive | C05 使用 body-free source audit ref、valid relation 和 visible policy | local `AuditProjectionState` 与 native H3 append record、one cursor、E04 snapshot 同 UoW；source audit 不变 | service + repository | `EV-CAND-OBS-AUD-001` |
| `TC-OBS-AUD-002` | negative | missing/ambiguous relation、wrong subject owner 或 source body | typed relation/boundary error；H3/outbox/stale/result 均无 partial write | service failure injection | `EV-CAND-OBS-AUD-002` |
| `TC-OBS-AUD-003` | boundary | visibility policy 返回 restricted | 允许 formal `VisibilityRestricted` local projection 时只暴露 safe restricted surface；不得把 not-visible 当 missing | domain + query | `EV-CAND-OBS-AUD-003` |
| `TC-OBS-AUD-004` | rollback | 在 H3 append、cursor、E04、stale/result 任一点注入失败 | 整个 accepted write-set 回滚；append-only sequence 无洞、无 orphan E04 | repository fault matrix | `EV-CAND-OBS-AUD-004` |
| `TC-OBS-EVD-001` | positive | C06 使用 existing projection + body-free external ref/purpose/digest summary | formal `EvidenceLinkageState` 转 `Linked`；只存 body-free linkage/history/E05 snapshot，不读取/保存 evidence body | domain + service | `EV-CAND-OBS-EVD-001` |
| `TC-OBS-EVD-002` | negative | resolver 返回 body、missing digest、wrong-owner ref | `BodyBlocked` 或 typed rejection 依设计分支；raw body 不进入 object/error/log/outbox | resolver fake + redaction scan | `EV-CAND-OBS-EVD-002` |
| `TC-OBS-EVD-003` | boundary | projection/linkage `NotVisible`、`Stale` 或 resolver unavailable | 三类结果 lossless 区分；不得伪造 `Linked`、real evidence alias 或空 body 代替成功 | service + query | `EV-CAND-OBS-EVD-003` |
| `TC-OBS-EVD-004` | blocked | 激活 I05，但 canonical payload schema 或 producer binding 仍缺失 | slot disabled / typed unavailable；在 payload parse 前停止，ack=0、local write=0、outbox=0；不得构造本地 canonical DTO | worker activation + parse/write spies | `EV-CAND-OBS-EVD-004` |
| `TC-OBS-SIG-001` | positive | C04/I06/I07 提交 body-free safe signal summary 与 valid context | `SafeSignalState` formal post-state、native record、E03 和 affected rollup marker 原子可见；不形成 runtime success truth | service + integration | `EV-CAND-OBS-SIG-001` |
| `TC-OBS-SIG-002` | negative | raw log line、metric sample body、trace payload、runtime execution/provider body | pre-serialization rejection/quarantine；log/metric/trace sink 与 durable store 均不见 sentinel | redaction + sink spies | `EV-CAND-OBS-SIG-002` |
| `TC-OBS-SIG-003` | boundary | missing/invalid/partial correlation 或 stale reference | formal degraded/stale/gap surface；不得补造 parent span、business causation 或 successful run | domain + query | `EV-CAND-OBS-SIG-003` |
| `TC-OBS-SIG-004` | concurrency | 两个 signal 更新同 rollup/window 或相同 semantic key | CAS/idempotency 决出唯一 accepted write；无 double count、无两条同 cursor、无 summary merge | service + CAS | `EV-CAND-OBS-SIG-004` |
| `TC-OBS-SIG-005` | recovery | resolver unavailable 或 rollup CAS failure 后按 typed class 重试 | signal/rollup 同 UoW 时整体回滚；可重试使用同 scope/digest，不以 current raw telemetry 重建 | fault injection | `EV-CAND-OBS-SIG-005` |
| `TC-OBS-SIG-006` | static | 检查 log fields、metric labels、span attributes 与 audit event schema | label/attribute 使用有限枚举/body-free ref；禁止 secret、endpoint、full artifact/ref、raw payload 和 unbounded message | schema/cardinality scan | `EV-CAND-OBS-SIG-006` |

### 6.4 Degraded、Query 与 diagnostic guard 用例

| TC | kind | 前置与输入 / 操作 | 预期结果与核心断言 | 自动化候选 | candidate EV |
|---|---|---|---|---|---|
| `TC-OBS-DEG-001` | boundary | 为同一 scope 分别准备 missing、`NotVisible`、`Stale`、`Rebuilding`、dependency unavailable | exact Query surface lossless 区分；不得折叠为 empty/success/internal error，也不得创建 placeholder | query contract table | `EV-CAND-OBS-DEG-001` |
| `TC-OBS-DEG-002` | negative | gap 仍 `Open`/`Acknowledged` 或 degraded state 为 `Blocked` 时请求 fresh/report/export | 返回 formal gap/degraded/blocked surface；不关闭 gap、不提升 readiness、不调用 external adapter | service + spies | `EV-CAND-OBS-DEG-002` |
| `TC-OBS-DEG-003` | query | 读取 stale/partial diagnostic、rollup、read model 和 reference snapshot | 输出携带其正式 freshness/visibility/gap refs；应用 `ASRT-NOWRITE`，不在线 repair/refresh/rebuild | query integration | `EV-CAND-OBS-DEG-003` |
| `TC-OBS-DEG-004` | consistency | 制造 dangling ref、scope/binding mismatch、duplicate current head 或 progress owner mismatch | typed consistency defect；不选择 first row、不猜测新旧、不写 gap/stale marker | repository/query contract | `EV-CAND-OBS-DEG-004` |
| `TC-OBS-DEG-005` | recovery | dependency 恢复后由正式 mutation/Job 更新 derived owner，再重读 Query | 新 committed state 才改变 surface；原 Query 调用仍 zero-write，旧 snapshot/history 保持不可变 | service + integration | `EV-CAND-OBS-DEG-005` |
| `TC-OBS-QRY-001` | positive | 对 Q01~Q14 准备 visible hit 与各自合法 selector/page | exact response owner/field/cardinality/cursor/freshness 映射正确；所有 write spy 为 0 | parameterized query service | `EV-CAND-OBS-QRY-001` |
| `TC-OBS-QRY-002` | boundary | 对可分页 Query 准备 empty page、last page、same-binding next cursor 和 wrong-binding cursor | empty 是合法 surface；cursor roundtrip稳定；wrong-binding cursor typed invalid 且无 fallback scan | query + repository codec | `EV-CAND-OBS-QRY-002` |
| `TC-OBS-QRY-003` | negative | 对每个 Query 注入 missing/not-visible/stale/corrupt relation/dependency unavailable | 每项使用 exact typed surface/error；不得 durable read audit、reserve、save result、mark stale、refresh 或 start Job | query + exhaustive write spies | `EV-CAND-OBS-QRY-003` |
| `TC-OBS-QRY-004` | concurrency | Query 与 accepted mutation/rebuild finalize 并发，读取位于同一 committed read fence | 只观察一个一致 committed version/snapshot；不混合 pre/post rows，不以 retry 写入修复 | concurrency integration | `EV-CAND-OBS-QRY-004` |
| `TC-OBS-DIA-001` | positive | Q10 读取 scope/view/summary/freshness/progress/binding 完整且一致的 composite | exact diagnostic surface 可解释并 body-free；`ASRT-NOWRITE/TRUTH-BOUNDARY` 成立 | query service | `EV-CAND-OBS-DIA-001` |
| `TC-OBS-DIA-002` | negative | 构造 missing progress、wrong target/binding、forbidden target 或 write-capable diagnostic collaborator | fail closed / static gate fail；不 rebuild、不 drop、不写 source/observation truth | query + capability scan | `EV-CAND-OBS-DIA-002` |
| `TC-OBS-DIA-003` | recursion | telemetry sink 将本仓 signal 回送到任一 C/I façade，或 sink failure 触发业务 retry | recursion guard suppress；own mutation façade调用为 0；只允许 process-local bounded counter | integration + façade spies | `EV-CAND-OBS-DIA-003` |
| `TC-OBS-DIA-004` | static | 扫描 telemetry emitter、diagnostic builder 与 entry dependency graph | emitter 无 repository/UoW/application write façade；diagnostic Query 无 maintenance/external writer capability | compile/source scan | `EV-CAND-OBS-DIA-004` |

### 6.5 Report handoff 与 authenticity 用例

| TC | kind | 前置与输入 / 操作 | 预期结果与核心断言 | 自动化候选 | candidate EV |
|---|---|---|---|---|---|
| `TC-OBS-RPT-001` | positive | C07 读取完整、visible、body-free linkage set，逐项重验后保存 immutable `EvidenceIndexInputView` | input 与 `ReportHandoffRecord` 同 UoW；lifecycle `Draft -> Prepared`、readiness `Ready`/允许的 `Degraded`；无 verdict/signoff/run/evidence alias | service + repository | `EV-CAND-OBS-RPT-001` |
| `TC-OBS-RPT-002` | negative | constituent mismatch、open blocking gap、not-visible、retention/no-write block 或 missing report ref owner | readiness `Blocked`/`PendingEvidence` 与 formal failure surface；不保存可交付状态，不调用 delivery adapter | failure injection | `EV-CAND-OBS-RPT-002` |
| `TC-OBS-RPT-003` | phase | J07 以 committed handoff/preparation intent 执行 prepare commit -> external call -> same-token finalize | 三 phase 顺序固定；外调时无 DB transaction；只有 finalize commit 后 local `Delivered` 可见 | external-phase integration | `EV-CAND-OBS-RPT-003` |
| `TC-OBS-RPT-004` | recovery | external success 后 local finalize known failure/unknown，或 external outcome unknown | known failure 只做 same-token finalize；unknown 先 probe local/external；不 redeliver、不换 binding/token/material | failure/probe integration | `EV-CAND-OBS-RPT-004` |
| `TC-OBS-RPT-005` | static | 扫描 handoff DTO/event/report/receipt 和报告生成候选 | 不含 hard-coded pass、final verdict、signoff、真实 run_id、真实 EV alias 或 evidence body；`Delivered` 仅表示 local delivery lifecycle | schema/report audit | `EV-CAND-OBS-RPT-005` |
| `TC-OBS-AUT-001` | positive | C08 对 owner-backed body-free linkage 与 immutable handoff input 评估 | 只在正式依据成立时转 `RealEvidenceLinked`；H4/E06/result 同 UoW；该 hint 不是最终真实性裁决 | domain + service | `EV-CAND-OBS-AUT-001` |
| `TC-OBS-AUT-002` | boundary | 输入为 placeholder basis 或 non-empty typed gap/insufficient basis | 分别得到 `PlaceholderDetected` 或 `Insufficient`；readiness 相应 blocked/pending，不 mint alias、不补造 origin | domain table | `EV-CAND-OBS-AUT-002` |
| `TC-OBS-AUT-003` | negative/static | 无 owner-backed origin 却声明 real、terminal hint 改写，或源码含 static passed/authentic verdict | typed boundary/transition error或静态门禁失败；owner/history/outbox 不变，无真实 evidence 声明 | domain + source scan | `EV-CAND-OBS-AUT-003` |

### 6.6 Retention 与 active protection 用例

| TC | kind | 前置与输入 / 操作 | 预期结果与核心断言 | 自动化候选 | candidate EV |
|---|---|---|---|---|---|
| `TC-OBS-RET-001` | positive | C09 对 observation-owned protected ref 建立 hold 或在无 active consumer 时标记 release candidate | formal `ActiveHold`/`ReleaseEligible` + H7/E07/result 原子可见；只表达 local marker，不删除 source | domain + service | `EV-CAND-OBS-RET-001` |
| `TC-OBS-RET-002` | negative | active consumer 存在时请求 release，或 protected ref/protection relation 不匹配 | `Conflict` 或 typed `RetentionConflict`；cleanup/archive/source writer 调用均为 0 | service + writer spies | `EV-CAND-OBS-RET-002` |
| `TC-OBS-RET-003` | concurrency | C09/C10 对同一 protected ref 并发 attach/release/expire | version/CAS 决出唯一合法序列；active set canonical unique；loser reload/typed conflict，不丢 consumer | concurrency repository | `EV-CAND-OBS-RET-003` |
| `TC-OBS-RET-004` | rollback | 在 protection、H7、cursor、E07 或 stale/result 阶段注入失败 | marker、active set、history、outbox、result 同成同败；rollback 后无 release eligibility 泄漏 | UoW fault matrix | `EV-CAND-OBS-RET-004` |
| `TC-OBS-RET-005` | no-delete/static | 尝试执行 reserved `ReleaseEligible -> Released` 或从 retention flow 取得 external delete/archive authority | reserved transition被拒；dependency/call scan 证明 source cleanup writer 集合为空；archive hint 不等于 archive truth | domain + capability scan | `EV-CAND-OBS-RET-005` |

### 6.7 Rebuild、replay 与 no-write 用例

| TC | kind | 前置与输入 / 操作 | 预期结果与核心断言 | 自动化候选 | candidate EV |
|---|---|---|---|---|---|
| `TC-OBS-REB-001` | positive | J02/J03/J09 从 immutable plan 与 complete committed source set 重建一个 item | 只 replace 对应 derived scope；item outcome/progress/report fold 使用 fresh fence；source owner 与业务 truth 不变 | job + repository integration | `EV-CAND-OBS-REB-001` |
| `TC-OBS-REB-002` | negative | source set incomplete/oversized、read fence 不一致、missing stored input 或 raw telemetry fallback | item `FailedRetryable`/`FailedPermanent`/`Blocked` 依 typed class；不截断、不标 `Fresh`、不回读外部 body | job failure matrix | `EV-CAND-OBS-REB-002` |
| `TC-OBS-REB-003` | concurrency | 两 worker 竞争同 execution/item，旧 worker 在 lease 过期后提交 | 只有 fresh claim/fence 可从 `Running` CAS 到 terminal；stale worker 所有 replace/outcome/report 写均被拒 | job claim/fence integration | `EV-CAND-OBS-REB-003` |
| `TC-OBS-REB-004` | recovery | item retryable failure 后续重试、terminal execution duplicate、commit unknown | 只重试原 immutable plan 的 eligible item；terminal duplicate replay stored report；unknown 先 probe，不重列 candidates | job recovery integration | `EV-CAND-OBS-REB-004` |
| `TC-OBS-REB-005` | blocked | J06 收到 approved observation-side scope，但 H13 upstream 契约仍未闭合 | controlled `Blocked`/manual report；不创建 positive H13、`Completed` replay truth、external execution result、run/evidence alias | job controlled fake | `EV-CAND-OBS-REB-005` |
| `TC-OBS-REB-006` | static | 扫描 J02/J03/J05/J06/J09、projection ports 与 replay collaborators | source/upstream writer capability 集合为空；rebuild/replay 仅持有 local projection/gap/maintenance/report ports | compile/source scan | `EV-CAND-OBS-REB-006` |

### 6.8 UoW、幂等、outbox 与 external phase 用例

| TC | kind | 前置与输入 / 操作 | 预期结果与核心断言 | 自动化候选 | candidate EV |
|---|---|---|---|---|---|
| `TC-OBS-UOW-001` | phase | accepted Command/Consumer，UoW spy 记录全部调用 | exact 顺序为 reserve -> load -> transition -> stage owner/membership -> assign exactly one tagged cursor -> construct/append history/index/outbox/stale -> result/completion -> commit | application service | `EV-CAND-OBS-UOW-001` |
| `TC-OBS-UOW-002` | rollback | 对 transition 后至 commit 前每个 mandatory stage 注入 known failure | reservation、cursor、owner/state、history/index、outbox、stale、stored result/completion 全不可见；external call=0 | repository fault matrix | `EV-CAND-OBS-UOW-002` |
| `TC-OBS-UOW-003` | recovery | commit 返回 unknown，store 可分别模拟 actually committed / aborted | surface 保持 `CommitOutcomeUnknown`；先 probe exact actor-scoped reservation/result/owner/outbox marker；证明 abort 才可同 key 重试 | ambiguity simulation | `EV-CAND-OBS-UOW-003` |
| `TC-OBS-UOW-004` | idempotency | same key+digest、same key+different digest、same digest in-flight 三组并发 | exact replay / conflict / in-flight lossless 映射；无 second mutation、history、outbox 或 external effect | concurrency service | `EV-CAND-OBS-UOW-004` |
| `TC-OBS-UOW-005` | CAS/cursor | stale expected version、second cursor assignment、混用 observation/reference cursor | typed version/invariant error；无 visible cursor hole/ref；一个 UoW 只能选择一个 namespace 且最多分配一次 | UoW/repository contract | `EV-CAND-OBS-UOW-005` |
| `TC-OBS-UOW-006` | outbox | accepted source mutation、随后 owner 更新，再由 J01 发布原 E snapshot | published bytes/digest/schema/binding/cursor 等于 committed snapshot；publisher current-owner/current-route reads=0 | outbox integration | `EV-CAND-OBS-UOW-006` |
| `TC-OBS-UOW-007` | external phase | J01/J07/J08 prepare commit 后 external unknown/success，再 finalize fail/unknown | 稳定 historical binding/token/material 不变；unknown probe-first；known success finalize-only；无 blind retry/new token | adapter + job integration | `EV-CAND-OBS-UOW-007` |
| `TC-OBS-UOW-008` | report fold | Job 多 item 混合 succeeded/retryable/permanent/blocked/skipped，含 stale fence attempt | report counts/changed/failed/gap refs只 fold committed fresh-fence item outcome；terminal report immutable，duplicate replay exact | job repository contract | `EV-CAND-OBS-UOW-008` |

### 6.9 Config、runtime 与 dependency 用例

| TC | kind | 前置与输入 / 操作 | 预期结果与核心断言 | 自动化候选 | candidate EV |
|---|---|---|---|---|---|
| `TC-OBS-CFG-001` | positive | 对 `LocalTest`、`IntegrationLike`、`RuntimeLike` 分别提供完整 raw candidate 与可用 capability probe | 形成对应 validated typed snapshot/config binding 和一个 profile-specific runtime；无 generic/aggregate runtime | config + runtime builder | `EV-CAND-OBS-CFG-001` |
| `TC-OBS-CFG-002` | negative | 缺 required key、越界值、unknown enum、secret/endpoint 放入 public/domain config、跨项 invariant 失败 | startup/config validation fail-fast；不产 partial runtime、不写 business store/audit/job report | config table | `EV-CAND-OBS-CFG-002` |
| `TC-OBS-CFG-003` | profile | 在三个 profile 间比较同一 protocol/schema/state/UoW/redaction/no-write contract | 只允许 adapter/capacity/controlled availability 差异；协议、owner、状态和安全红线完全相同 | cross-profile contract | `EV-CAND-OBS-CFG-003` |
| `TC-OBS-CFG-004` | activation | runtime assembly 在 registrar/activation 任一点失败，或重复/跨 profile 消费 activation | all-or-error；opaque registered set 不泄漏，启动原子，无 partial handler/worker/job activation | runtime builder fault matrix | `EV-CAND-OBS-CFG-004` |
| `TC-OBS-CFG-005` | degradation | required/optional adapter probe 返回 Available/Unavailable/Unknown/Unsupported | 依 frozen policy fail startup、disable exact slot 或 expose degraded/blocked；不得 silent fallback 或启用 I05/J06 positive | runtime + capability fake | `EV-CAND-OBS-CFG-005` |
| `TC-OBS-CFG-006` | static | 扫描配置项和 environment override 是否试图修改 schema/state/UoW/redaction/no-write/token/probe 语义 | forbidden configurable redline 集合为空；只有 bounded execution/product-neutral binding 可配置 | config/source scan | `EV-CAND-OBS-CFG-006` |
| `TC-OBS-DEP-001` | static | 读取 Cargo/workspace dependency graph | sibling compile dependency 仅允许 `core-contracts`；不得依赖 L1/L2/L3/L4 相邻实现仓 | cargo metadata/static | `EV-CAND-OBS-DEP-001` |
| `TC-OBS-DEP-002` | compile | 对 domain、contracts、api、worker、jobs 注入/扫描 forbidden reverse dependency 和 writer capability | domain 无 infra/application；entry 无 repository/UoW/locator；Query/rebuild/Consumer exact slice 不持有越权 writer | compile-fail + source scan | `EV-CAND-OBS-DEP-002` |
| `TC-OBS-DEP-003` | boundary | 模拟 Bus/dashboard/GRC/report product integration 尝试接管 local truth 或向本仓注入 product DTO | 只允许 event/port/body-free ref/handoff/export seam；产品 truth/transport authority 不进入 owner/schema | adapter contract + scan | `EV-CAND-OBS-DEP-003` |
| `TC-OBS-HIST-001` | static | 扫描 README、旧正式文档和 historical Step 中过时协议/状态/产品/指标词是否进入 current baseline | historical material 只能在诊断/参考中出现；current formal assertions 只引用本轮 Step 真相源 | documentation gate | `EV-CAND-OBS-HIST-001` |
| `TC-OBS-HIST-002` | static | 检查未冻结阈值、旧 evidence alias、run_id、passed/verdict/signoff 或实现 commit 声明 | 不得升级为配置默认、测试结果或验收事实；所有真实执行字段保持 absent | documentation/report scan | `EV-CAND-OBS-HIST-002` |

### 6.10 AC / VETO 横切 P0 用例

这些用例是 Step 05 已预留的跨切口组合门禁。它们复用前述 fixture 和底层断言，但拥有独立的门禁判定，
用于防止单个切口通过而整体边界仍失守；不把外围增强升级为核心正向功能。

| TC | kind | 前置与输入 / 操作 | 预期结果与核心断言 | 自动化候选 | candidate EV |
|---|---|---|---|---|---|
| `TC-OBS-EXT-001` | boundary | 对 dashboard/alert/GRC/report/archive consumer 逐一绑定 product-neutral read/handoff/export seam | public DTO 和 local owner只出现 canonical consumer/ref/scope/visibility；产品 DTO/state/decision 不进入本仓 | adapter contract | `EV-CAND-OBS-EXT-001` |
| `TC-OBS-EXT-002` | negative | peripheral dependency disabled/unavailable/not-visible/stale，调用 Q12/C14/J07/J08/I08/I09 | exact blocked/degraded/unavailable/manual surface；不 fallback、不反写产品 truth、不生成 package/verdict | service + adapter spies | `EV-CAND-OBS-EXT-002` |
| `TC-OBS-EXT-003` | static | 扫描 crate、schema、config 和 route catalog 中的特定 dashboard/GRC/vendor 产品语义 | 产品专属 owner、状态、配置和 compile dependency 集合为空；只有 product-neutral seam | source/schema scan | `EV-CAND-OBS-EXT-003` |
| `TC-OBS-OWN-001` | static | 建立 34 个 DO owner/forbidden store 到 crate/repository/schema 的映射并扫描 | observation-owned owner 唯一；external body/business truth 没有 local table/object/serializer owner | owner/schema audit | `EV-CAND-OBS-OWN-001` |
| `TC-OBS-OWN-002` | compile | 对 Query、Consumer、rebuild、report/export 和 entry 注入最小 capability view | 每个 surface 只能取得其 exact read/write port；所有相邻业务 writer 与 locator 不可构造 | compile-fail capability | `EV-CAND-OBS-OWN-002` |
| `TC-OBS-OWN-003` | integration | accepted local mutation、external feedback、rebuild 和 Query 前后快照相邻项目 fake truth store | 相邻 truth byte-for-byte 不变；仅 local owner/history/projection/marker按正式 flow 变化 | multi-store spy | `EV-CAND-OBS-OWN-003` |
| `TC-OBS-OWN-004` | static | 检查 ref/newtype/secondary type、repository 和 state owner 的 declaration/use index | typed ref不可混用或退化 String；每个 formal owner只有一个定义；缺 owner 保持 affected，不创建 alias | compile/source index | `EV-CAND-OBS-OWN-004` |
| `TC-OBS-TRUTH-001` | boundary | 比较 audit projection、safe signal、summary、diagnostic 和 source business fact | 每个 output 明示 local projection/observation role；不得映射为 source accepted/succeeded/compliant truth | contract + service | `EV-CAND-OBS-TRUTH-001` |
| `TC-OBS-TRUTH-002` | boundary | 比较 handoff `Prepared/Delivered`、authenticity hint、Job report 与验收/证据语义 | 不生成 final verdict、signoff、真实 run_id/EV alias；delivery/report只陈述 local lifecycle/execution draft | report/schema audit | `EV-CAND-OBS-TRUTH-002` |
| `TC-OBS-TRUTH-003` | static | 扫描 state/event/log/metric/span 名称和 mapper 是否把 telemetry outcome当 authority | sink ack、metric、span、dashboard/receipt 不驱动 owner transition、idempotency、retention或验收结论 | source + call graph | `EV-CAND-OBS-TRUTH-003` |
| `TC-OBS-NW-001` | integration | 参数化执行 Q01~Q14 的 visible/empty/missing/stale/defect 分支 | reservation/UoW/cursor/result/history/outbox/gap/stale/refresh/rebuild/external writer调用全部为 0 | query write-spy suite | `EV-CAND-OBS-NW-001` |
| `TC-OBS-NW-002` | integration | 执行 J02/J03/J05/J06/J09 的正常、失败和恢复 item | 只写 local derived/gap/maintenance/report owner；source/upstream writer调用为 0 | job capability spies | `EV-CAND-OBS-NW-002` |
| `TC-OBS-NW-003` | negative | C12/no-write guard 检测到 forbidden target，且 violation persistence 成功或失败 | forbidden adapter始终 0 调用；成功只写 local H6/E08，失败不伪造 durable violation | service failure injection | `EV-CAND-OBS-NW-003` |
| `TC-OBS-NW-004` | phase | C14/J07/J08 在 visibility/retention/no-write block、external unknown 和 finalize failure 下运行 | block 在 call 前生效；unknown probe-first；不发 source repair/consumer truth command | external-phase spies | `EV-CAND-OBS-NW-004` |
| `TC-OBS-NW-005` | static | 扫描 façade、delegate、port 和 runtime assignment 的 writer capability | Query/diagnostic/rebuild/replay/export read phase及 I03/I04 minimal slice无 forbidden writer | compile/source scan | `EV-CAND-OBS-NW-005` |
| `TC-OBS-REL-001` | smoke-design | 组合执行 intake/correlation/redaction P0 planned suite | C-OBS-1 的 accepted、quarantine、duplicate、conflict 与 body-free 边界均有可判定断言 | planned release suite | `EV-CAND-OBS-REL-001` |
| `TC-OBS-REL-002` | smoke-design | 组合执行 audit projection/evidence linkage P0 planned suite | C-OBS-2 append-only、body-free、visibility/gap 与 source no-write 全部可判定 | planned release suite | `EV-CAND-OBS-REL-002` |
| `TC-OBS-REL-003` | smoke-design | 组合执行 safe signal/degraded/query/diagnostic P0 planned suite | C-OBS-3 的有限 telemetry schema、freshness/visibility 和 recursion guard 全部可判定 | planned release suite | `EV-CAND-OBS-REL-003` |
| `TC-OBS-REL-004` | smoke-design | 组合执行 handoff/authenticity/peripheral P0 planned suite | C-OBS-4 的 immutable input、phase、no verdict/signoff 与 product-neutral seam 全部可判定 | planned release suite | `EV-CAND-OBS-REL-004` |
| `TC-OBS-REL-005` | smoke-design | 组合执行 retention/rebuild/replay/UoW P0 planned suite | C-OBS-5 的 active protection、derived-only、J06 blocked、atomicity/recovery 全部可判定 | planned release suite | `EV-CAND-OBS-REL-005` |
| `TC-OBS-NFR-001` | evidence-design | 对所有 P0 TC 检查候选 EV、assertion set、artifact class 与 AC/VF 引用是否可建立 | 每个 P0 有唯一候选 EV 和可机器判定断言；不存在真实 run/result/verdict | traceability audit | `EV-CAND-OBS-NFR-001` |
| `TC-OBS-NFR-002` | boundary | 检查未冻结 latency/throughput/retention/cardinality 数值和 dependency target | 只保留 measurement method/candidate，不出现 invented pass threshold 或 production SLO | documentation/config scan | `EV-CAND-OBS-NFR-002` |
| `TC-OBS-NFR-003` | recovery-design | 汇总 dependency unavailable、commit/external unknown、stale fence、blocked/manual 场景 | 每类都有 typed、body-free、no-fabrication、no-blind-retry 的候选断言与 owner | cross-case audit | `EV-CAND-OBS-NFR-003` |

## 7. 60 个 exact protocol 逐项用例 closure index

本节不是第二套 TC 定义。每个协议行是对应参数化 TC 的 exact fixture / assertion entry，测试实现不得只运行 family summary。
矩阵中的 `ING-001`、`UOW-007` 等简写分别展开为 `TC-OBS-ING-001`、`TC-OBS-UOW-007`；其
candidate EV 固定为同 suffix 的 `EV-CAND-OBS-ING-001`、`EV-CAND-OBS-UOW-007`。`001~004` 表示
闭区间，`001/003/004` 表示列出的离散成员；简写不得创建第二个用例或证据 ID。

### 7.1 16 Command

| ID / exact protocol | positive fixture / assertion | negative / concurrency / recovery assertion | mapped TC | phase / truth boundary | closure |
|---|---|---|---|---|---|
| C01 `SubmitObservationMaterial` | typed source/purpose/safe summary形成 receipt、safety、H1、E01/E02、result | raw body quarantine；resolver unavailable；same/conflict digest；commit unknown | `ING-001~004`, `RED-004`, `UOW-001~004` | accepted local UoW；source/body writer=0 | `covered_planned` |
| C02 `RecordSafetyDisposition` | versioned disposition依 formal compatibility 转 `Safe`/`Redacted` 并写 H1/E02 | missing receipt、invalid/terminal/reserved、CAS、forbidden material；receipt admission不变 | `RED-001~004`, `UOW-002/005` | disposition-only local mutation | `covered_planned` |
| C03 `BindCorrelationContext` | matching receipt/source/seed建立 formal `Bound`/`Partial` 与 H2 | absent/ambiguous seed、owner/source mismatch、concurrent CAS | `COR-001~003`, `UOW-005` | correlation ref不推导业务关系 truth | `covered_planned` |
| C04 `RecordSafeSignal` | safe summary/context形成 signal、native record、E03 和 rollup marker | raw signal、missing context、resolver unavailable、rollup CAS、duplicate | `SIG-001~006`, `UOW-004/005` | no runtime execution truth | `covered_planned` |
| C05 `AppendAuditProjection` | valid body-free relation append local projection/H3/E04 | missing/ambiguous/restricted/body、append rollback、duplicate | `AUD-001~004`, `UOW-004` | source audit read-only | `covered_planned` |
| C06 `LinkBodyFreeEvidence` | existing projection + body-free digest summary形成 linkage/H3/E05 | body leak、missing digest、not-visible/stale、resolver unavailable、duplicate | `EVD-001~003`, `UOW-004` | no evidence body/alias mint | `covered_planned` |
| C07 `PrepareReportHandoff` | constituent revalidation后 immutable input + Draft/Prepared/readiness/H4/E06 | mismatch、gap/visibility/retention/no-write block、rollback、duplicate | `RPT-001/002/005`, `UOW-002/004` | Command不外调、不生成 verdict/token | `covered_conditional` |
| C08 `EvaluateAuthenticityHint` | owner-backed linkage形成 `RealEvidenceLinked`，或 formal placeholder/insufficient | unproven origin、terminal rewrite、missing handoff/input、static verdict | `AUT-001~003`, `UOW-002` | hint不是验收真实性 truth | `covered_planned` |
| C09 `SetRetentionMarker` | local hold/release-candidate/conflict + H7/E07 | active protection conflict、reserved release、CAS、rollback | `RET-001~005`, `UOW-005` | no cleanup/delete authority | `covered_planned` |
| C10 `ProtectActiveReference` | canonical consumer attach/expire/release with exact guard | duplicate consumer、active release conflict、wrong ref、version race | `RET-002~005`, `UOW-005` | protection只管 observation-owned ref | `covered_planned` |
| C11 `DefineReplayScope` | non-empty observation-side target + allowed effect形成 Defined/Approved | source target/empty scope/hold/no-write/H13 boundary形成 Blocked；duplicate | `REB-001/005/006`, `UOW-004` | 不执行 replay，不写 source truth | `covered_conditional` |
| C12 `RecordNoWriteViolation` | forbidden attempt先被阻断，再保存 local Detected/Blocked + H6/E08 | malformed target、H6失败、Closed rewrite、commit unknown | `DIA-002`, `UOW-002/003`, `NW-003` | violation不是 compensation/source write | `covered_planned` |
| C13 `RecordGapState` | open/ack/mitigate/close使用 typed basis并写 H12/E09 | no-basis close、wrong degraded ref、reserved suppress、Resolved reopen、CAS | `DEG-002/005`, `UOW-002/005` | close仅是 local gap conclusion | `covered_planned` |
| C14 `PrepareExternalAuditExport` | committed body-free view + binding形成 local preparation/H9/E12 | missing/hidden/gap/no-write/binding unavailable/body/verdict | `EXT-001~003`, `UOW-001/002` | Command无 external call；不拥有 audit truth | `covered_planned` |
| C15 `RegisterReferenceSnapshot` | typed subject唯一建立 `Pending` 和 refresh record/E10 | malformed/duplicate subject、body、resolver unavailable、rollback | `DEG-001/005`, `UOW-001/002/004` | no external lifecycle write | `covered_planned` |
| C16 `UpdateReferenceSnapshotState` | newer comparable typed outcome推进 formal snapshot state/H10/E10 | older no-write、equal mismatch、uncomparable、invalid transition、CAS | `DEG-001/004/005`, `UOW-002/005` | no current resolver result overwrite old binding | `covered_planned` |

### 7.2 14 Query：全部 strict no-write

| ID / exact protocol | visible / valid assertion | boundary / consistency assertion | mapped TC | forbidden call set | closure |
|---|---|---|---|---|---|
| Q01 `GetObservationReceipt` | receipt+safety committed relation映射 `ObservationReceiptView` | NotFound、not-visible body None、relation mismatch typed defect | `QRY-001/003/004`, `DEG-001` | all write/resolver/repair ports=0 | `covered_planned` |
| Q02 `GetIntakeStatus` | bounded page保留 receipt/disposition relation；visible empty合法 | pending safety不等于 missing；wrong-binding cursor invalid | `QRY-001~004` | admission/history/result/outbox=0 | `covered_planned` |
| Q03 `GetSafeSignal` | point/page selector cardinality和 body-free signal surface正确 | dual selector、hidden、stale/degraded、cursor mismatch | `QRY-001~004`, `SIG-003` | signal/rollup/refresh writes=0 | `covered_planned` |
| Q04 `GetSignalRollup` | window/scope page与 Fresh/Stale/Rebuilding/Failed一致 | invalid selector、empty、corrupt relation；不从 raw signal recompute | `QRY-001~004`, `DEG-001/003` | rollup rebuild/start/save=0 | `covered_planned` |
| Q05 `GetAuditTimeline` | canonical subject page保持 append order与restricted mapping | hidden entry omitted/redacted、empty visible、cursor mismatch | `QRY-001~004`, `AUD-003` | source fetch/write、read-audit append=0 | `covered_planned` |
| Q06 `GetEvidenceIndexInput` | canonical sorted linkage/audit/gap refs形成 preview | missing/not-visible/gap/snapshot mismatch显式 | `QRY-001~004`, `EVD-003` | immutable input/handoff save=0 | `covered_planned` |
| Q07 `GetReportHandoff` | handoff/input/hint/readiness/delivery local lifecycle一致 | blocked/pending/degraded/stale/missing/mismatch显式 | `QRY-001/003/004`, `RPT-002/005` | prepare/deliver/verdict writes=0 | `covered_conditional` |
| Q08 `GetRetentionProtection` | marker/protection/active consumers/hold-conflict surface一致 | unmarked、not-visible、dangling/mismatched protection typed defect | `QRY-001/003/004`, `RET-002` | release/delete/archive=0 | `covered_planned` |
| Q09 `GetObservationReadModel` | canonical scope/page读取 stable identity和 freshness | missing/hidden/stale/rebuilding/degraded/disabled | `QRY-001~004`, `DEG-001/003` | replace/stale/rebuild=0 | `covered_planned` |
| Q10 `GetDiagnosticView` | scope/view/summary/freshness/progress/binding composite一致 | missing progress、binding/owner mismatch、corrupt composite | `DIA-001/002`, `QRY-003/004` | rebuild/drop/gap/write façade=0 | `covered_planned` |
| Q11 `GetGapStatus` | point/page输出 exact gap/degraded lifecycle | selector ambiguous、Suppressed不等Resolved、not-visible不等missing | `QRY-001~004`, `DEG-001/002` | scan/ack/mitigate/close=0 | `covered_planned` |
| Q12 `GetPeripheralExportView` | body-free local consumer/view/availability/freshness | disabled/not-visible/stale/missing/degraded，且不读取 provider body | `QRY-001~004`, `EXT-001/002` | external prepare/delivery=0 | `covered_planned` |
| Q13 `GetReferenceSnapshotView` | snapshot/subject单 selector和 current-head唯一 | both/neither、duplicate head、Unavailable/Invalid、sidecar mismatch | `QRY-001~004`, `DEG-001/004` | resolver/refresh/save=0 | `covered_planned` |
| Q14 `GetRebuildProgress` | target/progress/maintenance owner/freshness关系一致 | not-started/missing、wrong owner/binding/report、hidden | `QRY-001~004`, `DEG-004` | start/resume/finalize/report write=0 | `covered_planned` |

### 7.3 9 Inbound Consumer

所有行先执行 route/operation -> required header -> schema intersection -> producer static map -> source-version equality，再允许 typed payload parse 和 reserve。

| ID / exact protocol | accepted / supported assertion | negative / ordering / completion assertion | mapped TC | truth / ack boundary | closure |
|---|---|---|---|---|---|
| I01 `ConsumeBusObservationMaterial` | body-free material形成 local receipt/safety/H1/E01/E02/result | unsupported不parse；raw body quarantine；Older no-write；commit unknown probe | `ING-001~004`, `RED-004`, `UOW-001~004` | ack只在 known completion后；Bus truth不变 | `covered_conditional` |
| I02 `ConsumeSourceAuditMaterial` | valid relation形成 local audit projection/H3/E04 | ambiguous/missing context、body、Older/Equal conflict、rollback | `AUD-001~004`, `UOW-003~005` | source audit writer=0 | `covered_conditional` |
| I03 `ConsumeIdentityObservationContext` | 仅在 canonical schema/freshness与最小 capability满足时落 reference snapshot | header/schema/owner/body/Older/Equal conflict fail closed；无 H3/H4/H5 writer | `DEG-001/004/005`, `DEP-002`, `UOW-004` | Identity truth writer=0；affected保留 | `covered_conditional` |
| I04 `ConsumeGovernanceAuditContext` | supported binding只形成 local body-free reference/audit-safe landing或 gap | payload/binding/reference authority缺口、decision body、writer capability越权阻断 | `EVD-002/003`, `DEP-002`, `UOW-002` | Governance truth writer=0；affected保留 | `covered_conditional` |
| I05 `ConsumeArtifactEvidenceContext` | 正向路径当前不激活 | missing canonical payload/schema/producer binding在 parse 前 fail closed；ack/write/outbox=0 | `EVD-004`, `CFG-005`, `HIST-002` | 不构造本地 DTO，不写 Artifact truth | `blocked_upstream` |
| I06 `ConsumeRuntimeSignalSummary` | safe summary/context形成 local signal/reference/E03/E10 | raw runtime/log/metric/trace body、Older、resolver unavailable、duplicate | `SIG-001~005`, `UOW-003/004` | no Runtime run/success truth | `covered_conditional` |
| I07 `ConsumeSandboxSignalSummary` | safe branch形成 local safety/signal；absent receipt按 formal NoOp/snapshot | unsafe body quarantine；missing relation不造 receipt；unknown completion无默认 action | `SIG-001~003`, `RED-002/004`, `UOW-003` | no Sandbox execution truth | `covered_conditional` |
| I08 `ConsumeArchiveHandoffFeedback` | matching stored phase/token/binding推进 local handoff/delivery lifecycle | mismatch/stale/body/absence/unknown completion不证明 Delivered；probe/manual | `RPT-003~005`, `UOW-007` | no Archive acceptance truth；ack after finalize certainty | `covered_conditional` |
| I09 `ConsumeReportConsumerFeedback` | matching local delivery推进 peripheral marker/gap/E12/E09 | unknown consumer、receipt mismatch、stale/body/disabled/unknown action | `EXT-001~003`, `UOW-003/007` | no report verdict/consumer truth writeback | `covered_conditional` |

### 7.4 12 Outbound Event

| ID / exact protocol | committed source / payload assertion | negative / publication assertion | mapped TC | forbidden content / claim | closure |
|---|---|---|---|---|---|
| E01 `ObservationReceiptChanged` | committed receipt/H1 post-state冻结 refs/admission/disposition | source/schema/encoder失败回滚；J01只发 stored bytes | `ING-001`, `UOW-002/006/007` | raw material | `covered_planned` |
| E02 `SafetyDispositionChanged` | committed disposition/H1冻结 receipt/state/redaction marker | boundary/binding/CAS mismatch回滚；不从 current disposition重建 | `RED-001/004`, `UOW-006/007` | forbidden-body evidence | `covered_planned` |
| E03 `SafeSignalRecorded` | committed signal/correlation冻结 kind/context/rollup/safe summary | source/rollup mismatch回滚；publish不读 raw telemetry | `SIG-001/002/006`, `UOW-006/007` | raw log/metric/trace | `covered_planned` |
| E04 `AuditProjectionAppended` | committed H3/projection冻结 subject/source-audit/state/visibility | relation/cursor mismatch回滚；immutable append order | `AUD-001/004`, `UOW-006/007` | source body/business verdict | `covered_planned` |
| E05 `EvidenceLinkageChanged` | committed linkage/H3冻结 boundary/state/digest/visibility | unsafe/missing linkage回滚/manual；no current relink reconstruction | `EVD-001~003`, `UOW-006/007` | evidence body/real alias | `covered_conditional` |
| E06 `ReportHandoffChanged` | committed H4冻结 handoff/consumer/state/readiness/hint | input/binding mismatch consistency/manual；delivery phase不提前 | `RPT-001~005`, `UOW-006/007` | verdict/signoff/run/evidence alias | `covered_conditional` |
| E07 `RetentionMarkerChanged` | committed H7冻结 protected/marker/protection/state | protection conflict保留 local；publish失败不执行 cleanup | `RET-001~005`, `UOW-006/007` | source cleanup completed claim | `covered_planned` |
| E08 `NoWriteViolationRecorded` | committed H6冻结 violation/context/target/state | H6/outbox失败回滚；attempted write仍为0 | `DIA-002`, `NW-003`, `UOW-002/006` | locator/body/compensation | `covered_planned` |
| E09 `GapStateChanged` | committed H12冻结 gap/source/kind/state/degraded ref | relation mismatch回滚；publish不尝试 repair | `DEG-001/002/005`, `UOW-006` | synthetic source material/success | `covered_planned` |
| E10 `ReferenceSnapshotChanged` | committed reference refresh冻结 snapshot/subject/state/safe summary | replacement proof/outcome mismatch回滚；old snapshot immutable | `DEG-001/004/005`, `UOW-006` | external body/lifecycle truth | `covered_planned` |
| E11 `DerivedProjectionChanged` | committed maintenance/progress冻结 target/freshness/progress | incomplete source/index保持 stale/manual；不宣称 false Fresh | `REB-001~004`, `UOW-006/008` | business/source truth | `covered_planned` |
| E12 `PeripheralDeliveryChanged` | committed local preparation/delivery冻结 consumer/state/preparation | external unknown probe/manual；source transaction不回滚 | `EXT-001~003`, `RPT-003/004`, `UOW-007` | provider body/consumer or audit truth | `covered_conditional` |

### 7.5 9 Operations Job

| ID / exact protocol | plan / item / output assertion | negative / duplicate / recovery assertion | mapped TC | phase / truth boundary | closure |
|---|---|---|---|---|---|
| J01 `PublishObservationOutbox` | immutable eligible outbox plan；claim/fence逐 item；report fold exact refs | corrupt/missing payload、unavailable、external/commit unknown；terminal duplicate不 relist/republish | `UOW-006~008`, `REB-003/004` | same bytes/binding/token；published不等 consumed | `covered_conditional` |
| J02 `RebuildObservationReadModels` | complete bounded source capture逐 scope replace local view/progress/report | bad scope/incomplete source/fence/CAS；duplicate replay report | `REB-001~004/006`, `UOW-008` | derived only；source writer=0 | `covered_conditional` |
| J03 `RebuildSignalRollups` | 只从 stored SafeSignal按 immutable window plan重建 | missing source/gap/incomplete cursor不 Fresh；stale fence/duplicate | `REB-001~004/006`, `SIG-005` | no raw telemetry fallback | `covered_planned` |
| J04 `RefreshReferenceSnapshots` | canonical snapshot plan + formal resolver outcome推进 local refresh/report | Unavailable/Unresolved/Invalid区分；body copy、stale fence、duplicate阻断 | `DEG-001/004/005`, `REB-003/004`, `UOW-008` | no external lifecycle truth | `covered_conditional` |
| J05 `ScanObservationGaps` | complete expected-source scan才写 proven H12/gap outcome/report | timeout/incomplete不等 no-gap；no-basis不 close；duplicate不 rescan | `DEG-002/005`, `REB-002~004/006` | no source repair/synthetic material | `covered_planned` |
| J06 `CoordinateObservationReplay` | 当前仅保存 immutable plan/guard 与 controlled blocked/manual outcome | H13 upstream mismatch阻断 positive execution/completion；不造 record/run/evidence | `REB-005/006`, `UOW-008` | no source replay/repair command | `blocked_controlled` |
| J07 `PrepareReportHandoffDelivery` | immutable handoff/binding plan；prepare/call/finalize + report | mismatch/unavailable/unknown/finalize fail；same-token probe/finalize-only | `RPT-002~005`, `UOW-007/008` | Delivered仅 local transport lifecycle | `covered_conditional` |
| J08 `PrepareExternalAuditExport` | immutable export preparation/binding plan；phase-separated local delivery/report | missing prep/visibility/body/binding/unknown；不换 target/token | `EXT-001~003`, `UOW-007/008` | no external audit conclusion/signoff | `covered_conditional` |
| J09 `RebuildPeripheralViews` | complete committed source按 consumer scope replace derived view/progress/report | empty/incomplete/stale/fence conflict；terminal duplicate no rebuild | `REB-001~004/006`, `UOW-008` | no core truth write；external call absent | `covered_conditional` |

### 7.6 协议数量与孤儿审计

| 协议族 | 期望 | 本节记录 | unconditional complete | 结论 |
|---|---:|---:|---:|---|
| Command | 16 | 16 | 0 | `pass_with_affected_open` |
| Query | 14 | 14 | 0 | `pass_with_affected_open`;14/14 strict no-write |
| Consumer | 9 | 9 | 0 | `pass_with_affected_open`;I05 positive blocked |
| Event | 12 | 12 | 0 | `pass_with_affected_open`;12/12 immutable snapshot |
| Job | 9 | 9 | 0 | `pass_with_affected_open`;J06 positive controlled blocked |
| **Total** | **60** | **60** | **0** | **`60/60 recorded_with_affected_open`** |

## 8. 27 个正式状态 owner 与 1 个技术协调状态

### 8.1 状态 harness 契约

每一行都是所映射 TC 中不可省略的参数化 case。Harness 必须在调用前记录 object/state/version、native history、
outbox、stale marker、stored result 和 collaborator call counts；合法路径校验 exact post-state 与 write-set，非法、
terminal、reserved 路径除 typed error 外必须逐项比较前后不变。Existing owner 一律使用 `expected_version`；Query
不得借状态评估开启 write UoW。同名 variant 只按 owner 解释，不能跨 owner 自动传播。

| 断言类 | 通用判定 |
|---|---|
| legal | 只允许 formal factory/member/policy 产生 formal variant；返回 native record/decision 时与 owner 同 UoW |
| illegal | domain/application/job 返回其正式 typed transition/invariant error；不解析 message |
| terminal | 终态不原地复活；需要恢复时按矩阵创建新 owner/scope/execution/preparation |
| reserved | 当前无 callable 的转换必须拒绝或在 compile/API surface 中不存在；不得由测试 helper 绕过 |
| no-effect | state/version/history/outbox/stale/result/claim/report 不变，external/source writer call count 为 0 |

### 8.2 Observation truth / safety：6 个 owner

| # / owner | legal parameter set | illegal / terminal / reserved parameter set | side-effect assertion | mapped TC / candidate EV | closure |
|---|---|---|---|---|---|
| 01 `ObservationReceiptState` | factory `Received`;按正式 guard 覆盖 Accepted/Rejected/Quarantined/Degraded 及 Degraded/Quarantined 后续合法分支 | Rejected/Superseded重开、Accepted回Received；Superseded current transition reserved | H1/receipt/E01 result exact；body absent | `ING-001/002`, `RED-002` / corresponding EV | `covered_planned` |
| 02 `SafetyDispositionState` | Pending -> Safe/Redacted/Rejected/Quarantined；Quarantined -> Rejected | Safe/Redacted/Rejected互转或回Pending；marker/summary incompatibility | disposition/H1/E02 exact；receipt admission unchanged | `RED-001/002` / corresponding EV | `covered_planned` |
| 03 `CorrelationContextState` | Unbound/Partial -> Bound；Unbound/Bound -> Partial；nonterminal -> Invalid；Bound state-preserving link | Invalid重开；conflicting/mismatched opaque refs | H2 exact；不创建 business relation fact | `COR-001~003` / corresponding EV | `covered_planned` |
| 04 `SafeSignalState` | Candidate/Stale -> Recorded；Recorded -> Stale；nonterminal -> Suppressed | Suppressed恢复；missing context/raw body/invalid summary | native signal/E03/rollup marker exact；raw telemetry absent | `SIG-001~005` / corresponding EV | `covered_planned` |
| 05 `AuditProjectionState` | PendingAppend/VisibilityRestricted -> Appended；PendingAppend/Appended -> Restricted；attach gap保态 | Suppressed entry/transition current reserved；wrong relation append | H3/E04 exact append order；source audit unchanged | `AUD-001~004` / corresponding EV | `covered_planned` |
| 06 `EvidenceLinkageState` | Candidate/Stale/NotVisible -> Linked；Candidate -> BodyBlocked；formal NotVisible/Stale paths | BodyBlocked恢复；body-bearing ref伪装 Linked；wrong-owner relink | H3/E05 exact；handoff/index stale only on accepted path | `EVD-001~003` / corresponding EV | `covered_conditional` |

### 8.3 Handoff / retention / gap：9 个 owner

| # / owner | legal parameter set | illegal / terminal / reserved parameter set | side-effect assertion | mapped TC / candidate EV | closure |
|---|---|---|---|---|---|
| 07 `ReportHandoffState` | factory Draft；Draft/Failed -> Prepared；Prepared -> Delivered/Failed；attach hint保态 | Draft直达Delivered；Delivered重开；Cancelled terminal且 transition reserved | H4/E06/input relation exact；Delivered无 verdict/signoff | `RPT-001~005` / corresponding EV | `covered_conditional` |
| 08 `HandoffReadinessState` | complete immutable input经 policy 得 PendingEvidence/Ready/Blocked/Degraded；accepted reevaluation替换 | blocking gap/NotVisible/hold/no-write 时产生 Ready；Query 持久 reevaluation | readiness与lifecycle compatible；Query writes=0 | `RPT-001/002`, `QRY-003` / corresponding EV | `covered_conditional` |
| 09 `AuthenticityHintState` | Unassessed/Insufficient -> RealEvidenceLinked/PlaceholderDetected；Unassessed -> Insufficient | 无 owner-backed origin转 Real；两个 terminal hint重写 | H4/E06 exact；alias/run/verdict absent | `AUT-001~003` / corresponding EV | `covered_planned` |
| 10 `RetentionMarkerState` | Unmarked/ReleaseEligible/Conflict -> ActiveHold；formal ReleaseEligible/Conflict；archive hint保态 | Released重开；ReleaseEligible -> Released current reserved；active ref下 release | H7/E07 exact；cleanup/delete=0 | `RET-001~005` / corresponding EV | `covered_planned` |
| 11 `ActiveReferenceProtectionState` | attach -> Protected；Protected -> Expired/Conflicted；empty guarded owner -> Released | non-empty consumer set release；Released重开；duplicate ref分叉 | active set canonical unique；source/archive write=0 | `RET-002~005` / corresponding EV | `covered_planned` |
| 12 `ReplayScopeState` | factory Defined；Defined -> Approved/Blocked/Cancelled；Approved -> Completed/Blocked/Cancelled | empty/external target；Blocked/Completed/Cancelled重开；H13 positive无owner | local scope/record/report only；source repair=0 | `REB-005/006`, `NW-002` / corresponding EV | `covered_conditional` |
| 13 `NoWriteViolationState` | Detected -> Blocked/Escalated；Blocked -> Escalated/Closed；Escalated -> Closed | Closed重开；missing target；persistence failure当已 durable | H6/E08仅在commit后；attempted writer始终0 | `NW-003`, `UOW-002/003` / corresponding EV | `covered_planned` |
| 14 `GapLifecycleState` | factory Open；Open -> Acknowledged；mitigate保/转Acknowledged；formal basis -> Resolved | no-basis close；Resolved重开；Suppress/unsuppress current reserved | H12/E09 exact；Resolved不声称 source repaired | `DEG-002/005`, `UOW-005` / corresponding EV | `covered_planned` |
| 15 `DegradedOutputKind` | policy new owner None -> Active/Blocked；cause消失时生成 new evaluated None replacement | Active/Blocked in-place reset；Blocked返回替代 success body；Query reset | old object immutable；replacement/stale relation accepted-only | `DEG-001~005` / corresponding EV | `covered_planned` |

### 8.4 Read / reference / maintenance：7 个 owner

| # / owner | legal parameter set | illegal / terminal / reserved parameter set | side-effect assertion | mapped TC / candidate EV | closure |
|---|---|---|---|---|---|
| 16 `SignalRollupState` | Pending/Fresh/Stale/Failed -> Rebuilding as allowed；complete fixed cursor -> Fresh；Rebuilding -> Failed | incomplete cursor/raw telemetry -> Fresh；wrong target；Query start rebuild | rollup/progress/E11 only from complete stored signals | `SIG-004/005`, `REB-001~004` / corresponding EV | `covered_planned` |
| 17 `ReadVisibilityKind` | 每 request 独立产生 Visible/Restricted/NotVisible/Blocked exact surface | 把 NotVisible映射 Missing；跨 actor/context复用；持久推进 owner | no write UoW/history/gap；body按surface裁剪 | `QRY-001~004`, `NW-001` / corresponding EV | `covered_planned` |
| 18 `DiagnosticFreshnessState` | assembler产生 Fresh/Partial/Unavailable；accepted change -> Stale；maintenance replacement恢复 | Query repair；旧 summary in-place标Fresh；missing progress默认Fresh | composite原子替换；old summary不可改 | `DIA-001/002`, `DEG-003~005` / corresponding EV | `covered_planned` |
| 19 `ReferenceSnapshotStateKind` | Pending；non-Invalid按 typed outcome进入 Resolved/Stale/Unresolved/Unavailable/Invalid | Invalid重开；older/equal mismatch覆盖；Resolved无 safe summary | H10/E10 exact；external body/lifecycle unchanged | `DEG-001/004/005`, `UOW-005` / corresponding EV | `covered_conditional` |
| 20 `ProjectionMaintenanceStateKind` | Fresh/Failed -> Stale；Stale -> Rebuilding；complete fenced replace -> Fresh；failure -> Failed | Fresh直达Rebuilding；incomplete capture标Fresh；Query start | progress/view/E11/report与 fresh fence一致 | `REB-001~004`, `QRY-003` / corresponding EV | `covered_conditional` |
| 21 `ReplayCoordinationKind` | Pending -> Coordinating/Blocked；Coordinating -> Blocked/Completed/Failed（仅未来 owner gate闭合后） | terminal execution重开；scope mismatch；当前 H13缺失却 Completed | current只允许 controlled Blocked/manual；source write=0 | `REB-005/006` / corresponding EV | `blocked_controlled` |
| 22 `RollupRebuildKind` | Pending -> Running -> Completed/Failed；Completed需 fixed cursor + rollup seal | terminal回Running；Pending -> Cancelled current reserved；raw source | item/report与rollup seal同 fenced outcome | `REB-001~004`, `SIG-005` / corresponding EV | `covered_planned` |

### 8.5 Propagation / idempotency / report：5 个 owner

| # / owner | legal parameter set | illegal / terminal / reserved parameter set | side-effect assertion | mapped TC / candidate EV | closure |
|---|---|---|---|---|---|
| 23 `PeripheralDeliveryKind` | Pending/Failed/Blocked -> Prepared；Prepared -> Delivered/Failed/Blocked | Delivered重开；nonterminal -> Cancelled current reserved；body receipt | H9/E12/report exact；consumer truth unchanged | `EXT-001/002`, `UOW-007/008` / corresponding EV | `covered_conditional` |
| 24 `ExportPreparationState` | Draft/Failed/Blocked -> Prepared；Prepared -> Delivered/Failed/Blocked | Delivered重开；final conclusion field；blocked仍外调 | preparation/intent/E12 exact；external audit truth unchanged | `EXT-001~003`, `UOW-007/008` / corresponding EV | `covered_conditional` |
| 25 `OutboxPublicationState` | Pending -> Published/Failed/DeadLettered；Failed same-token -> Published/Failed/DeadLettered | Failed -> Pending；terminal重开；current-truth payload rebuild | immutable snapshot不变；owner truth不回滚 | `UOW-006/007`, `REB-003/004` / corresponding EV | `covered_conditional` |
| 26 `IdempotencyReservationState` | atomic empty -> Reserved；result-before-complete -> Completed；same digest Replay/InFlight | Completed -> Reserved；different digest覆盖；missing/mismatch result replay | duplicate attempt的domain/history/outbox/external=0 | `ING-003/004`, `UOW-003/004` / corresponding EV | `covered_conditional` |
| 27 `JobReportState` | Draft -> Completed/PartiallyCompleted/FailedRetryable/FailedPermanent/Blocked exact fold | terminal refinalize/edit；DuplicateReplayed写 stored state；含 Planned/Running item finalize | report/result/complete same UoW；无测试 verdict/signoff | `REB-004/005`, `UOW-008` / corresponding EV | `covered_conditional` |

### 8.6 `ObservationJobPlanItemState` 技术协调矩阵

该状态不计入 27 个正式 owner，不拥有业务或投影 truth，但必须落在 durable execution plan store 并接受 plan CAS、
claim 与 monotonic fence 约束。

| parameter | legal transition / guard | illegal / race assertion | report / effect assertion | mapped TC / candidate EV |
|---|---|---|---|---|
| create / claim | factory -> Planned；report Draft + Active fresh claim/fence时 Planned -> Running | duplicate work key、stale/Released/Expired claim、terminal report下启动均拒绝 | outcome在 Running 前后仍遵循 formal shape；未执行 effect | `REB-003`, `UOW-008` / corresponding EV |
| success | Running -> Succeeded，要求 local effect与 item/plan/report CAS 同 fenced UoW | stale fence、effect rollback、failure refs非空或 reason present均拒绝 | exact changed/progress refs进入 fold一次 | `REB-001/003`, `UOW-008` / corresponding EV |
| classified failure | Running -> FailedRetryable/FailedPermanent/Blocked，要求 typed class/guard与 exact refs | effect未rollback、reason/digest/refs不兼容或 policy过期均拒绝 | protected effect不执行；report fold lossless | `REB-002/003`, `UOW-008` / corresponding EV |
| equivalent terminal | Running -> SkippedTerminal，仅 probe证明 same work identity/token/material 已有 durable terminal fact | 仅凭 timeout/Released claim/telemetry推断 terminal 被拒绝 | 引用 existing fact；不重做 external/local effect | `REB-004`, `UOW-007/008` / corresponding EV |
| retry | FailedRetryable -> Running，仅 report仍Draft、immutable input不变、fresh claim/fence | terminal report、changed plan/input、旧 fence、permanent/blocked/skipped重进均拒绝 | previous attempt保留 append-only；new outcome由 guarded CAS 写入 | `REB-003/004`, `UOW-008` / corresponding EV |

### 8.7 状态数量与孤儿审计

| 检查 | 期望 | 本节结果 | 结论 |
|---|---:|---:|---|
| 正式状态 owner | 27 | 27 | `pass_with_affected_open` |
| 技术协调状态 | 1 | 1 | `pass_with_affected_open`;未误计入27 |
| 每 owner legal 参数 | 27 | 27 | pass |
| 每 owner illegal / terminal / reserved 参数 | 27 | 27 | pass |
| Query 写状态 | 0 | 0 | pass |
| external business truth owner | 0 | 0 | pass |

## 9. 横切事务、错误、恢复与 phase 用例矩阵

### 9.1 Accepted UoW 与 read-only phase

| phase / failure point | fixture / operation | required assertion | forbidden assertion | mapped TC |
|---|---|---|---|---|
| pre-dispatch validation | malformed route/ref/page/envelope 或 unsupported schema | 在 UoW / reservation / payload parse 前返回 exact typed surface | normal marker、history、stale、outbox、result | `RED-002`, `EVD-004`, `QRY-002/003` |
| reserve | absent、same digest Reserved/Completed、different digest | Acquired/InFlight/Replay/Conflict 原子且 lossless | overwrite old digest/result、second writer | `ING-003/004`, `UOW-004` |
| load / guard | missing owner、policy block、expected-version stale | rollback incoming attempt；typed missing/policy/conflict | default owner、last-write-wins、negative generic ledger | `UOW-002/005` |
| transition / stage | domain legal/illegal；owner与membership plan stage fault | legal进入 staged set；illegal/known fault whole rollback | visible pre-cursor owner/history/outbox | `UOW-001/002`, state §8 parameters |
| cursor | observation/reference namespace、second assign、allocation fault | exactly one tagged cursor；fault whole rollback | mixed namespace、reuse gap、cursor as row version | `UOW-001/002/005` |
| history/index/outbox/stale | 各 mandatory append 单点失败 | all-or-none；event snapshot exact committed post-state | owner without history、snapshot from current truth | `AUD-004`, `RET-004`, `UOW-002/006` |
| result / complete / commit | result/completion fault、known commit failure、unknown | known abort不 accepted；unknown保持 indeterminate 并 probe | completed missing result、blind retry/new key | `UOW-002~004` |
| Query read | Q01~Q14 的 visible/empty/error/concurrent mutation | one committed read fence；all write spies=0 | repair/refresh/gap/stale/result/read-audit | `QRY-001~004`, `NW-001` |

### 9.2 Consumer ordering 与 completion phase

| phase | required assertion | failure / unknown assertion | mapped TC |
|---|---|---|---|
| route / operation | exact operation only maps to one compile-time producer family | mismatch不重路由、不猜 producer | `DEP-002`, `OWN-002` |
| header / schema / producer | required header、binary/root/binding intersection、static producer map先完成 | unsupported/mismatch时 payload parse=0、reserve=0、write=0 | `EVD-004`, `CFG-005` |
| typed payload / source version | payload family与header一致；Newer仍需 CAS | body拒绝；Older zero-write；Equal mismatch conflict；Uncomparable不按time决胜 | `RED-004`, `SIG-002`, `UOW-004/005` |
| accepted local UoW | 只保存 exact local owner/native record/authorized outbox/result | 不持有/调用相邻业务 writer | `UOW-001/002`, `OWN-002/003` |
| completion -> worker action | known committed receipt才允许 exact ack/action mapper | commit unknown、ack unknown、completion affected 时无 default ack/retry/dead-letter | `UOW-003`, `NFR-003` |
| redelivery | compatible Completed receipt exact replay | no payload parse/resolver/owner/history/outbox second effect | `ING-003`, `UOW-004` |

### 9.3 Job 与 external effect phase

| phase | required assertion | failure / recovery assertion | mapped TC |
|---|---|---|---|
| start | metadata/input validation后冻结 immutable plan、complete config snapshot、Draft report、reservation | invalid不建plan；duplicate terminal只读 stored report；resume不 relist/change binding | `REB-004`, `CFG-003`, `UOW-008` |
| claim | global work key唯一、lease/heartbeat/fence 单调、plan item CAS | stale/expired token不提交；fresh claim不修改 immutable input | `REB-003`, `UOW-008` |
| item | 每 item short UoW reload plan/owner/report/binding并 recheck fence/read fence | failure rollback item effect；earlier item commits不概念回滚 | `REB-001~003`, `UOW-002/008` |
| report fold / finalize | all items finalizable且 structured outcome compatible；canonical fold -> one terminal report/result/complete | Planned/Running item、tampered fold、parallel finalizer loser均拒绝 | `REB-004`, `UOW-008` |
| external prepare | exact material/binding/token intent 在 call 前 durable | prepare commit unknown先 probe；无 intent 不 call | `RPT-003/004`, `UOW-007` |
| external call | 无 DB transaction；使用 stored historical binding + same token/material | Unknown/Unsupported停止；不切 current route/token/material | `RPT-003/004`, `EXT-002`, `UOW-007` |
| local finalize | body-free receipt + same token/binding/version在 short UoW 更新 local lifecycle/report/event | known external success只 finalize-only；unknown probe；不 redeliver | `RPT-004`, `UOW-007/008` |
| J06 controlled lane | immutable plan与 guard 可记录 controlled blocked/manual | 不创建 H13 positive execution、Completed、run/evidence alias | `REB-005/006` |

### 9.4 Typed recovery class 覆盖

| recovery class | trigger fixture | allowed action / assertion | forbidden action | mapped TC |
|---|---|---|---|---|
| `DoNotRetrySameInput` | unsupported schema、digest conflict、reserved/deterministic invalid transition | exact reject/conflict/blocked；old state/result不变 | same-input loop、payload reinterpretation | `EVD-004`, `ING-004`, state §8 |
| `RetryAfterInputChange` | malformed ref/page/body-free input | caller修正 typed input 后建立新 attempt | silent default/sanitize forbidden material | `RED-002`, `QRY-002`, `EVD-002` |
| `RetryAfterStateChange` | InFlight、policy/readiness block、disabled capability | 等 formal owner/policy/config/claim state改变 | timer-only blind retry | `RPT-002`, `CFG-005`, `UOW-004` |
| `RetryAfterReload` | optimistic/CAS conflict | rollback、reload `Versioned<T>`、重跑全部 guard | reuse old expected version | `COR-003`, `RET-003`, `UOW-005` |
| `RetryAfterDependencyRecovery` | known repository/resolver/publisher/delivery unavailable | dependency被证明恢复后用原 semantic identity 重试 | fabricate available/success outcome | `SIG-005`, `CFG-005`, `NFR-003` |
| `RetryFinalizeOnly` | external success + known local finalize failure | same token/receipt/binding只做 local finalize | second external call、rebuild package | `RPT-004`, `UOW-007` |
| `ProbeBeforeRetry` | commit/external/finalize outcome unknown | 按 reservation/result/marker/token 顺序只读 probe | blind retry、新 key/token、timeout推断失败 | `UOW-003/007`, `NFR-003` |
| `ManualIntervention` | corrupt stored result/outbox/composite、rollback unknown、I05/J06 owner blocker | fail closed，保留 body-free refs/issue，等待 owner 修复 | current-truth rebuild、fabricated evidence/completion | `DEG-004`, `EVD-004`, `REB-005`, `UOW-006` |

## 10. Inherited blocker / affected 用例处置

| ID | current testable lane | blocked / conditional lane | mapped TC | Step 06 conclusion |
|---|---|---|---|---|
| `S08-E-I05-PAYLOAD-SCHEMA-01` | schema/header gate before parse；unsupported/absent owner fail closed | canonical payload decode/positive landing | `EVD-004`, `CFG-005` | `blocked_upstream`;不反推 DTO |
| `S08-E-I05-PRODUCER-EVENT-BINDING-01` | producer static map/slot activation拒绝 missing binding | exact producer event -> I05 positive adapter | `EVD-004`, `DEP-003` | `blocked_upstream`;不全订阅/任选事件 |
| `R06.6-F2-H13-UPSTREAM` | approved scope guard、controlled Blocked/manual、zero fabrication | J06 positive execution/H13/Completed | `REB-005/006` | `blocked_controlled` |
| `R06-F-AFFECT-UOW-01` | exact order、known rollback、commit unknown probe | implementation atomicity proof | `UOW-001~005` | `covered_conditional`;后续 `07`逐 boundary消费 |
| `S08-RECOVERY-CLASS-OWNER-01` | 八类 recovery branch 与 no-default mapper test | missing exact owner wiring | `NFR-003`, §9.4 | `covered_conditional`;不创建新 enum |
| `R07-EXTERNAL-PHASE-LINK-01` | prepare/call/finalize relation、same token/binding | production adapter capability | `RPT-003/004`, `UOW-007` | `covered_conditional` |
| `R07-EXTERNAL-PHASE-RETRY-ACCOUNTING-01` | unknown probe/manual、known success finalize-only | real retry/probe accounting owner | `UOW-007/008`, `NFR-003` | `covered_conditional` |
| `S08-CONSUMER-OUTBOX-SURFACE-01` | accepted local snapshot boundary、duplicate zero effect | exact per-consumer outbox capability implementation | `OWN-002`, `UOW-001/006` | `covered_conditional` |
| `S08-CONSUMER-INDETERMINATE-COMPLETION-01` | commit unknown无 default action、redelivery exact replay | exact worker completion mapper owner | `UOW-003/004`, `NFR-003` | `covered_conditional` |
| `S08-JOB-REPORT-REF-OWNER-01` | missing/wrong report ref fail closed、fold immutable | canonical ref wiring | `RPT-002`, `UOW-008` | `covered_conditional`;不发明第二 owner |
| `S08-M1-SECONDARY-TYPE-OWNER-01` | declaration/use/static owner scan | owner未闭合的 positive protocol lane | `OWN-004`, `DEP-002` | `covered_conditional` |
| `03-RPR-S09-PER-FLOW` | 60 exact 行 + protocol count audit | implementation per-flow proof | §7 全部 | `design_record_closed`;implementation affected开放 |

## 11. 单测试切口用例停审记录

| 测试切口 | 正向 / 负向是否具体 | 数据前置是否可构造 | 自动化 / candidate EV | phase / truth 边界 | 结论 |
|---|---|---|---|---|---|
| `CUT-INGEST-ADMISSION` | accepted、quarantine、replay、conflict | safe/forbidden summary + reservation fixtures | service/redaction；4/4 unique | accepted UoW；source/body no-write | `pass_planned` |
| `CUT-CORRELATION-SOURCE` | bind、ambiguous/mismatch、CAS | receipt/source/seed/version fixtures | domain/service；3/3 unique | correlation-only，不推导 truth | `pass_planned` |
| `CUT-REDACTION-SAFETY` | clean/redacted/forbidden/serializer phase | sentinel + marker/summary组合 | domain/static/integration；4/4 unique | redaction-before-serialization | `pass_planned` |
| `CUT-AUDIT-PROJECTION` | append/restricted/relation/rollback | body-free audit refs + append failpoints | service/repository；4/4 unique | append-only local projection | `pass_planned` |
| `CUT-EVIDENCE-BODY-FREE` | linkage/body/not-visible/I05 blocked | projection/ref/resolver + activation fixtures | service/worker；4/4 unique | I05 positive保持blocked | `pass_conditional` |
| `CUT-SIGNAL-PROJECTION` | safe/raw/degraded/CAS/recovery/schema | context/summary/rollup/sentinel | service/static；6/6 unique | no runtime execution truth | `pass_planned` |
| `CUT-DEGRADED-VISIBILITY` | five exact surfaces、consistency、recovery | view/gap/freshness relation corpus | query/integration；5/5 unique | Query不repair | `pass_conditional` |
| `CUT-QUERY-NOWRITE` | 14 exact Query visible/boundary/error/race | committed facet/page/cursor + write spies | parameterized query；4/4 unique | 14/14 strict no-write | `pass_planned` |
| `CUT-DIAGNOSTIC-GUARD` | composite/defect/recursion/capability | diagnostic bundle + sink/write spies | query/static；4/4 unique | no own telemetry recursion/write | `pass_planned` |
| `CUT-REPORT-HANDOFF` | immutable input/block/phase/unknown/static | linkage/gap/binding/token/receipt | service/external；5/5 unique | no verdict/signoff；affected开放 | `pass_conditional` |
| `CUT-EVIDENCE-AUTHENTICITY` | real/placeholder/insufficient/fabrication | owner-backed origin + gap basis | domain/static；3/3 unique | hint非验收 truth | `pass_planned` |
| `CUT-RETENTION-PROTECTION` | hold/conflict/race/rollback/no-delete | marker/protection/version/consumer set | domain/repository；5/5 unique | release不授权 source cleanup | `pass_planned` |
| `CUT-REBUILD-REPLAY-NOWRITE` | derived rebuild/failure/fence/recovery/J06/static | immutable plans + source fences + H13 gate | Job/static；6/6 unique | J06 positive blocked；source writer=0 | `pass_conditional` |
| `CUT-UOW-IDEMPOTENCY-RECOVERY` | order/rollback/unknown/replay/CAS/outbox/external/report | failpoint/token/fence/result corpus | service/integration；8/8 unique | one UoW与external split明确 | `pass_conditional` |
| `CUT-CONFIG-RUNTIME-REDLINE` | profiles/validation/activation/degradation/static | three profile candidates + probes | builder/static；6/6 unique | config不改变 truth/security contract | `pass_planned` |
| `CUT-DEPENDENCY-REDLINE` | dependency/capability/product/history | manifest/module/doc corpus | compile/static；5/5 unique | core-only sibling compile dep | `pass_planned` |

## 12. 跨用例断言 / phase / 证据审计

| 审计项 | 结论 | 缺口 / 修正 |
|---|---|---|
| TC 定义唯一性 | pass | 99 个完整 `TC-OBS-*` 定义，ID 无重复 |
| candidate EV 唯一性 | pass | 99 个 `EV-CAND-OBS-*` 与 TC 一一对应；均非真实 artifact alias |
| canonical cut coverage | pass | 16/16 均有正向或受控正向门禁 + 关键负向，并逐项停审 |
| protocol coverage | pass_with_affected_open | 仅统计 §7.1~§7.5 exact protocol 行为 `16+14+9+12+9=60`；I05/J06正向未伪造；`0/60`无条件完成 |
| state coverage | pass_with_affected_open | 27/27 formal owner + 1 technical item state，均有 legal 与 illegal/terminal/reserved 参数 |
| assertion drift | pass | 状态、协议、error/recovery、Event 名称逐字来自 current `03`；未采用 Healthy/Done 等别名 |
| Query phase | pass | Q01~Q14 的所有 surface 写调用为0；no repair/read audit/reservation/result |
| Consumer phase | pass_with_affected_open | header/schema/producer先于 parse；completion certainty先于 action；unknown不默认 ack |
| Event phase | pass | E01~E12 全部由 accepted UoW immutable snapshot；publisher stored-only |
| Job phase | pass_with_affected_open | immutable plan、claim/fence、item UoW、report fold完整；J06 controlled lane保留 |
| external phase | pass_with_affected_open | prepare commit -> no-DB call -> same-token finalize；unknown probe/manual |
| redaction phase | pass | allowlist/redaction先于 serialization；forbidden sentinel不进入任何 durable/runtime surface |
| truth ownership | pass | Query/rebuild/report/export/feedback不修复或反写相邻业务 truth；writer capability scan有 P0 TC |
| duplicate assertion | pass | 共用 `ASRT-*` 明确复用；协议/状态矩阵只引用稳定 TC，不重复定义 case/EV |
| phase advance | pass | Prepared/Published/Delivered/Fresh/Completed 只在各自 owner/commit 后断言；不提前产生反馈或验收事实 |
| fabricated evidence | pass | 未创建 run_id、真实 evidence alias、artifact、测试结果、verdict、signoff 或 implementation commit |
| unresolved conflict | none | inherited affected 均转为 blocked/conditional case，不构成 Step 06 自身未决冲突 |

## 13. 正式 `05` §6 回填草稿

正式 §6 应按以下顺序装配收口结论，不携带本 Step 的诊断和过程记录：

1. 用例字段、编号、candidate EV 和 P0 断言包。
2. 16 个 canonical 切口的批次总览与 99 个唯一用例矩阵。
3. 60 个 exact protocol closure index，保留 I05 `blocked_upstream`、J06 `blocked_controlled`。
4. 27 个正式状态 owner + `ObservationJobPlanItemState` 的参数化状态矩阵。
5. accepted UoW、Consumer ordering、Job/external phase 和八类 recovery class 矩阵。
6. inherited affected 处置、逐切口停审和跨用例审计。

正式正文必须继续声明：本章定义的是 planned case contract，不是测试执行报告；`EV-CAND-*` 不是
`artifacts/test/<run_id>/` 中的真实 evidence，不能被 `06` 当作已通过证据。

## 14. 待确认事项

| 事项 | 当前决定 | 后续 owner |
|---|---|---|
| I05 canonical payload/schema 与 producer binding | 继续 `open_upstream_internal`；只保留 pre-parse fail-closed | 上游 L1-artifact / contracts owner；`07` activation boundary |
| J06 H13 positive owner | 继续 `open_controlled`；只保留 Blocked/manual/no-fabrication | 上游 detailed-design owner；`07` J06 boundary |
| concrete fixture values / corpus files | 本 Step 只定义 fixture class，不填真实数据 | Step 07 |
| profile topology / dependency process | 本 Step 只引用三 profile，不搭环境 | Step 08 |
| executable suite / gate command | 本 Step 只标 automation candidate | Step 09 |
| performance/security exact procedures | 本 Step 仅保留相关 P0 redline，不硬化阈值 | Step 10 |
| evidence artifact/report schema | 本 Step 仅分配 candidate EV | Step 13 |

## 15. 进入下一步条件

- [x] 16 个 canonical 切口均有可执行、可断言、可留候选证据的用例批次并完成停审。
- [x] 99 个 TC 与 99 个 candidate EV 一一对应且编号唯一。
- [x] 60 个 exact protocol 逐项映射；14 Query strict no-write；12 Event immutable snapshot；9 Job staged lifecycle。
- [x] 27 个正式状态 owner 与 1 个技术协调状态逐项覆盖 legal/illegal/terminal/reserved。
- [x] UoW、rollback、commit unknown、idempotency、CAS、cursor、outbox、external phase 和 recovery class 已展开。
- [x] I05/J06 及其余 inherited affected 保持 blocked/conditional，没有被测试设计伪关闭。
- [x] 跨用例审计无 unresolved assertion、phase 或 candidate EV 冲突。
- [x] 未写正式 `05`、未执行测试、未创建真实 evidence/run/verdict/signoff/commit。

Step 06 gate 为 `pass_current_with_inherited_affected_open`。下一允许动作是读取测试方案 SOP Step 07、
书写规范 §7、current Step 03~06、`03` 对象/协议/状态/持久化契约和 `04` profile/config，重建设计测试数据。

## 16. 参考

- `standards/document/测试方案讨论流程_SOP.md` Step 06
- `standards/document/测试方案书写规范.md` §三~§四
- `standards/document/设计文档讨论中间产物规范.md`
- `projects/L4-observability/03-详细设计.md` §5~§15
- `projects/L4-observability/04-配置设计.md` §6~§13
- `projects/L4-observability/design-calibration/03_ddd_step_09_exact_flow_cards.md`
- `projects/L4-observability/design-calibration/03_ddd_step_10_state_matrix.md`
- `projects/L4-observability/design-calibration/03_ddd_step_16_test_cuts.md`
- `projects/L4-observability/design-calibration/05_test_plan_step_03_test_objects_cuts.md`
- `projects/L4-observability/design-calibration/05_test_plan_step_04_strategy_layers.md`
- `projects/L4-observability/design-calibration/05_test_plan_step_05_traceability_coverage.md`
- `projects/L4-observability/design-calibration/project_execution_ledger.md`
