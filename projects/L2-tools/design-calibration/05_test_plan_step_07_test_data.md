# L2-tools 05 测试方案 · Step 7 测试数据设计

> 对应 SOP：`测试方案讨论流程_SOP.md` Step 7「设计测试数据」
>
> 目标回填：`projects/L2-tools/05-测试方案.md` §7
>
> 直接输入：`05_test_plan_step_06_cases.md`；`03-详细设计.md` §6~§15；`04-配置设计.md` §5~§12

## 1. Step 状态

| 项 | 内容 |
|---|---|
| Step | 7 / 设计测试数据 |
| 状态 | `accepted_for_step_07 / proceed_to_step_08` |
| 当前模块 | `test_data_design` |
| 数据集 identity | `DS-L2T-<FAMILY>-<NNN>`；只表示逻辑数据集，不表示已生成文件或真实数据库行 |
| 本步结论 | 所有 P0 用例族都有可重复构造、运行隔离、清理和替身边界；负向/并发/恢复数据不污染 valid baseline |
| 正式文档写入 | 未允许；正式 `05-测试方案.md` 仍锁定至 Step 15 |
| 下一步 | Step 8：测试环境与配置矩阵 |

### 1.1 Step 内计划

- [x] 读取 Step 6 用例矩阵和 03/04 数据契约。
- [x] 回答测试数据构造、隔离、清理和外部替身问题。
- [x] 诊断旧 05/README 的临时造数和 provider truth 污染。
- [x] 固定 deterministic primitive、数据集 manifest 和 fault profile 边界。
- [x] 建立用例族到数据集的双向映射。
- [x] 完成每个 P0 数据集停审及跨数据隔离/清理审计。
- [x] 形成正式 05 §7 回填草稿。

## 2. 本步输入

| 输入 | 来源 | 用途 |
|---|---|---|
| 用例矩阵 | `05_test_plan_step_06_cases.md` §5~§11 | 为每个 TC family 分配数据集和场景变体 |
| 对象/协议/状态 | `03-详细设计.md` §6~§9 | 约束 typed builder、合法状态和 metadata |
| Store/UoW/错误/并发 | `03-详细设计.md` §10~§12 | 构造 CAS、pair、replay、unknown、rollback 和 race 数据 |
| 配置/失败/敏感边界 | `04-配置设计.md` §5~§12 | 构造 profile、source、CFG-T/A/F/X 和 no-output corpus |
| 测试分层与追溯 | `05_test_plan_step_04_strategy_layers.md`、`05_test_plan_step_05_traceability_coverage.md` | 确定数据在 unit/service/integration/entry 层的消费方式 |
| 旧 README/05/06 | historical material | 仅构造污染负向样本，不继承旧业务数据或编号 |

## 3. SOP 问题回答

| 问题 | 回答 | 依据 |
|---|---|---|
| 哪些基础数据必须存在？ | 运行 namespace、固定 Clock、typed ID/ref、metadata/envelope、合法对象基线、Store/UoW journal、Port resolution script、strict config candidate 和 safe observer fixture。 | `03` §6~§15；`04` §9~§12 |
| 哪些边界、异常、并发和恢复数据必须构造？ | 缺字段/wrong-kind/version、same-key/different-digest、stale CAS、half pair、commit/side-effect unknown、blocked/unavailable、projection stale、partial Job、forbidden body 和每个 NC override。 | Step 6 §5~§11；`03` §11~§13 |
| 数据如何隔离不同测试运行？ | 最高层使用未来 opaque `test_run_ref`；下分 `tc_id/scenario_id/actor_or_source_scope/operation_namespace/key/target_ordinal/config_case`；不共享 mutable global row。 | `03` §12.1；全局依赖规则 |
| 数据如何清理？ | pure typed value 由作用域结束回收；fake Store/UoW/Port/observer reset；run-scoped state drop；dummy leak corpus 用后删除；未来 durable-like 套件才定义 run-scoped cleanup。 | Step 8/9/13 尚未定义具体命令；本步只定义清理契约 |
| 外部依赖使用什么替身？ | P0 使用 contract-faithful fake、controlled typed script 或 formal Disabled；P1 real-like 只作为条件候选；不得以 fake 关闭 upstream blocker。 | `03` §13.5~§13.6；`L2T-UP-001~009` |
| 每个 P0 用例数据是否可重复构造？ | 是。每个 TC family 有唯一 DS manifest、canonical baseline 和 single-variable mutation；若实现无法构造，必须回写 03/04，不由测试侧补字段。 | 本 Step §6~§8 |
| 负向和 happy-path 是否混用？ | 不混用。invalid、conflict、unknown、redaction、blocker 和 race 使用独立 `scenario_id` 与 seed，避免污染 valid baseline。 | Step 6 §12.3 |
| 每个测试切口是否停审？ | 以 family 为最小批次检查 source、constructability、isolation、cleanup、substitute 和 effect probe；全部通过后才允许 Step 8。 | SOP Step 7 |

## 4. 当前材料问题诊断

| 材料/位置 | 问题 | 处理 |
|---|---|---|
| 旧正式 `05-测试方案.md` §5~§6 | 旧 `TC-001~012` 依赖临时 ToolDefinition/Policy/host callback 样本，缺少正式对象和状态来源 | 标记 `historical_material`；不复用旧 dataset 或结果 |
| 旧 README | builtin/MCP/registry/executor 语义会诱导构造不存在的 provider/registry truth | 仅保留为 `DS-L2T-HIST-NEG-001` 污染样本，禁止进入业务 Store |
| Step 6 原始前置 | 只描述“typed fixture”而没有隔离键、故障数据和清理方式 | 本 Step 建立 `DS-L2T-*` manifest 和 primitive registry |
| `L2T-UP-001~009` | 正向 owner/schema/mapping/route/client 未闭合 | 只生成 blocked/unavailable/unverifiable/unknown 数据；不生成 provider accepted/run/receipt/delivered/observed 数据 |
| 真实实现仓 | 目标实现仓不存在，backend/secret provider/test framework 未定 | 不固定路径、命令、真实连接或持久化 schema；留 Step 8/9/07 处理 |

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 数据 identity | 用例只有散文前置 | 每个 family 有稳定 `DS-L2T-*` 和 `scenario_id` | 让 05/06/07 能双向引用数据来源 |
| deterministic 输入 | 未指定 Clock/ID/ref/metadata 规则 | 固定 Clock vector、typed ID ordinal、scope 和 canonical digest 输入 | 消除 wall-clock、随机 UUID 和字符串猜测 |
| 负向数据 | 与 happy path 混在同一 fixture | 独立 mutation/fault profile 和隔离 namespace | 防止数据污染导致假通过 |
| 外部依赖 | 旧文档将 host/provider 当真实输入 | P0 只用 typed fake/controlled/Disabled；positive seam 条件化 | 保持 owner 边界和 blocker 真实性 |
| 清理 | 未定义 | pure/reset/drop/delete/future-durable 四类清理策略 | 可重复运行且不污染后续用例 |

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 每个 TC 复制完整数据 | 简单直观 | 大量重复、容易漂移和混入第二真相源 | 拒绝 |
| 只维护少量共享 happy fixture | 文件短 | 无法稳定表达 conflict/unknown/late material | 拒绝 |
| 每个 family 一个 canonical DS，负向以单变量 mutation 展开 | 可追溯、可复现、便于自动生成 | 实现需维护 manifest registry | 采用 |
| P0 使用真实 provider/backend | 接近部署 | 当前 owner、endpoint、secret 和 schema 未闭合，容易伪造 readiness | 拒绝；仅 P1 条件候选 |
| 运行时 query 自动补数据 | 方便测试准备 | 违反 Query no-write、missing-result 不重算和 Job no-repair | 拒绝 |

## 7. 结构化中间产物

### 7.1 数据集 manifest contract

每个数据集必须能表达以下字段；这些字段是设计合同，不代表已经存在的文件或数据库表。

| 字段 | 规则 |
|---|---|
| `dataset_id` | 唯一 `DS-L2T-<FAMILY>-<NNN>`，与 TC family 机械对应 |
| `test_case_ids` | 一个或多个稳定 TC ID；必须覆盖该 family 的全部编号范围 |
| `scenario_id` | `<dataset_id>/<positive|negative|boundary|concurrency|recovery>/<token>` |
| `test_run_ref` | 未来执行时注入的 opaque namespace；本设计不分配真实值 |
| `clock_vector` | 固定相对时间向量；禁止读取系统 wall clock 或 sleep 推进 |
| `typed_id_vector` | 按 object/ref kind 分区的 deterministic ordinal；不能用裸字符串替代 typed ref |
| `metadata_vector` | actor/source/correlation/trace/scope/idempotency 等正式 metadata 变体 |
| `seed_frame` | canonical 对象/协议/Store row/UoW marker 的 typed baseline |
| `mutation_or_fault` | 相对 baseline 的单变量 mutation 或命名 fault phase |
| `expected_surface` | 正式 state/error/view/result/receipt/report 类型；不是测试结果 |
| `effect_probe` | expected write set、Port calls、UoW outcome、history and redaction counts |
| `substitute_profile` | `pure`、`contract_fake`、`controlled_script`、`disabled` 或条件 `real_like_candidate` |
| `cleanup_profile` | `pure_reset`、`run_drop`、`fake_reset`、`corpus_delete` 或 future durable cleanup |
| `sensitivity_class` | `safe`、`body_free`、`dummy_forbidden`；真实 secret/body 永不允许 |

### 7.2 Deterministic primitive registry

| Primitive ID | 提供内容 | 允许 | 禁止 | 清理 |
|---|---|---|---|---|
| `TD-L2T-RUN` | opaque run/test namespace、case/scenario partition | future run-scoped isolation | global singleton、真实 run ID、跨 case key 复用 | drop namespace |
| `TD-L2T-CLOCK` | fixed `T0` 和 phase-relative vector | explicit ClockPort injection | system time、sleep、observer time | reset vector |
| `TD-L2T-ID` | Tool/Definition/Invocation/Fact/Attempt/Gap/Job typed ordinal | same semantic value exact reuse | random UUID as oracle、string fallback | reset ordinal scope |
| `TD-L2T-META` | Command/Query/Envelope/Job metadata variants | valid/missing/wrong-scope/wrong-source mutation | real credential/actor body | pure value reset |
| `TD-L2T-CANONICAL` | canonical typed frame/digest included/excluded fields | stable digest and equality/conflict vectors | raw body/pretty/debug/map-order hash | pure vector |
| `TD-L2T-OBJECT` | 41-object valid factory baseline and one-field mutations | formal constructor/guard only | placeholder/private field/old alias | pure or run drop |
| `TD-L2T-STORE` | seven logical Store fake, Loaded token, append/page/watermark rows | CAS/semantic uniqueness/pair/replay probes | hidden finder/full-scan/fallback row | reset/drop namespace |
| `TD-L2T-UOW` | begin/commit/rollback/unknown journal | ordered staged write and exact fault phase | bool commit inference/compensating transaction | journal reset |
| `TD-L2T-PORT` | seven external Port typed resolution scripts | blocked/unavailable/unsupported/conflicting/unverifiable and one side-effect call | raw response/body, host bypass, fake readiness | reset slot script |
| `TD-L2T-CONFIG` | strict JSON bytes, source map, profile and cross-gate variants | valid/invalid/blocked candidate | real env/path/secret, silent fallback | pure bytes/map reset |
| `TD-L2T-OBS` | safe logs/metrics/spans/audit capture and leak corpus | low-cardinality redacted fields | raw body/secret/high-cardinality labels | reset capture; delete dummy corpus |

### 7.3 Canonical data set table

| Dataset ID | 覆盖 TC | canonical baseline | 独立 negative/boundary/fault | substitute | 隔离/清理 |
|---|---|---|---|---|---|
| `DS-L2T-FOUNDATION-001` | `FOUNDATION-001~018` | 41 typed objects、协议 metadata、views/errors、Clock/ID/ref 基线 | missing field、wrong kind、unknown version、body/secret、projection degraded | pure + contract fake | case/scenario；pure reset/run drop |
| `DS-L2T-CONTRACT-001` | `CONTRACT-001~008` | contract、definition、revision、evolution fact、current/history rows | duplicate/digest conflict、candidate incompatibility、retirement closure、late material | contract fake + UoW script | tool/revision/scope；run drop |
| `DS-L2T-BIND-001` | `BIND-001~008` | Bound/ExplicitUnbound relation、snapshot、assessment、change fact | empty ref、two-current、stale CAS、Hub blocked/stale/conflict、late clue | controlled Hub Port | tool/binding/source scope；reset Port/drop run |
| `DS-L2T-INV-001` | `INV-001~008` | canonical invocation、anchor、context、admission、stored view | insufficient context、revision drift、terminal re-admission、IF-03 altered digest | pure + Store fake | invocation/key/actor scope；drop run |
| `DS-L2T-PRE-001` | `PRE-001~010` | requirement、auth/readiness refs、handoff and Prepared marker | missing/stale/conflicting auth、Sandbox mapping blocked、known/unknown Port、stale phase-2 CAS | controlled Auth/Sandbox Port | invocation/attempt/generation；reset script/drop run |
| `DS-L2T-OUTCOME-001` | `OUTCOME-001~010` | source assessment、six outcome classes、audit pair、status refs | source mismatch/body、half pair、late source、status conflict、duplicate | controlled source Port + UoW fake | invocation/source/terminal key；pair reset/drop |
| `DS-L2T-HANDOFF-001` | `HANDOFF-001~008` | four-gate eligibility、safe material、event/attempt | each gate fail、target mismatch、Prepared/unknown replay、feedback blocked | controlled collaboration Port | material/target/continuation key；reset script/drop |
| `DS-L2T-QUERY-001` | `QUERY-001~011` | owner-scoped read bundles、projection/report/status refs | NotFound/NotVisible/Stale/Rebuilding/Unavailable/Failed、cursor invalid、half pair | read-only Store/Projection fake + write spy | query scope/cursor; reset spy/drop read seed |
| `DS-L2T-CONSUMER-001` | `CONSUMER-001~005` | versioned inbound envelope、claim、receipt and source frame | unsupported/altered/duplicate/blocked source, IF-03 only re-entry | controlled source/feedback Port | consumer/source/dedup key；receipt reset/drop |
| `DS-L2T-CONT-001` | `CONT-001~004` | committed material、event identity、Prepared attempt | branch mismatch、body/half pair、route blocked、unknown replay | controlled collaboration Port | material/event/target key；reset attempt/drop |
| `DS-L2T-JOB-001` | `JOB-001~004` | bounded scope/cursor/watermark、target rows、JobReport | empty/unbounded scope、mixed outcome、older watermark、duplicate report | Store/Port controlled scripts | job key/target ordinal；report reset/drop |
| `DS-L2T-STATE-001` | `STATE-001~012` | each six state family valid from/to pair | terminal rollback、unknown label、late material、phase violation | pure transition fixture | subject/state case；pure reset |
| `DS-L2T-TX-001` | `TX-001~010` | staged write set, claim/result pair, CAS token and commit journal | insert failure, rollback failure, commit unknown, missing replay, query spy | UoW/Store controlled fake | UoW/request key；journal reset/drop |
| `DS-L2T-CONC-001` | `CONC-001~023` | two or more identical canonical frames and isolated scopes | divergent digest, stale CAS, redelivery, Prepared race, watermark race | deterministic scheduler/harness + Store fake | operation namespace/key/ordinal；reset all actors |
| `DS-L2T-ERR-001` | `ERR-001~012` | typed error input/output mapping and recovery owner | validation, unavailable, blocked, unknown, unsupported, partial, late conflict | controlled fault profile | case/error class；reset fault journal |
| `DS-L2T-CFG-001` | all `CFG-T/A/F/X` | strict ten-root candidate, three P0 profiles, source map | malformed/high-source fallback/cross-gate/redline/builder-stage/output leak | pure parser/builder fixture | profile/config-case; pure reset |
| `DS-L2T-OBS-001` | `OBS-001~009` | safe log/metric/span/audit/status capture | body/secret/high-cardinality/half-pair/status inference/fake parity | controlled observer sink | observer-case/run; clear capture/delete corpus |
| `DS-L2T-VETO-001` | `VETO-001~013`, `NC-001~025` | valid L2 boundary graph and safe local truth | one redline override per scenario; historical/blocker pollution corpus | static graph + typed validator | veto/nc case; pure reset/delete corpus |

### 7.4 Negative and recovery corpus

| Corpus ID | 内容 | 关联用例 | 约束 |
|---|---|---|---|
| `DS-L2T-NEG-METADATA-001` | missing/wrong actor/source/correlation/trace/scope | FOUNDATION, INV, QUERY, CONSUMER, JOB, ERR | synthetic safe values only；不进入 Store |
| `DS-L2T-NEG-REF-001` | wrong-kind、empty、stale、conflicting、unverifiable refs | FOUNDATION, BIND, PRE, OUTCOME, CFG, VETO | typed ref mutation；禁止字符串猜测 |
| `DS-L2T-NEG-BODY-001` | dummy raw request/capture/provider/secret/full-ref corpus | FOUNDATION, HANDOFF, OUTCOME, OBS, CFG, VETO | isolated dummy only；no echo；scan 后删除 |
| `DS-L2T-NEG-REPLAY-001` | Claimed/Committed/Prepared/Unknown/half-result surfaces | INV, OUTCOME, HANDOFF, TX, CONC, ERR | exact stored surface or manual marker；不重算 current truth |
| `DS-L2T-NEG-CONFIG-001` | strict parser/source/profile/cross-field/redline variants | CFG-T/A/F/X, VETO | no real env/path/secret；无 fallback |
| `DS-L2T-NEG-UPSTREAM-001` | each `L2T-UP-*` blocked/unavailable/unverifiable/unknown response | PRE, CONSUMER, CFG-F-010, OBS, VETO | 不产生 provider accepted/run/receipt/delivered/observed |

### 7.5 TC 到数据集映射规则

| TC family | 唯一数据集 | 前置要求 | effect probe |
|---|---|---|---|
| FOUNDATION/CONTRACT/BIND/INV | 对应 `DS-L2T-*` | typed factory、scope、revision/CAS seed | object/fact/admission/pair write set、Port count |
| PRE/OUTCOME/HANDOFF | 对应 `DS-L2T-*` + NEG-UPSTREAM/BODY | source/auth/readiness/target script | phase marker、one-call count、pair/material presence |
| QUERY/CONSUMER/CONT/JOB | 对应 `DS-L2T-*` | read bundle/envelope/bounded plan | zero-write/receipt/attempt/report/cursor/watermark |
| STATE/TX/CONC/ERR | 对应 `DS-L2T-*` + replay/fault corpus | formal from-state and UoW journal | CAS winner、rollback、unknown/manual、history immutability |
| CFG/OBS/VETO | CFG/OBS/VETO dataset + negative corpus | strict candidate, safe observer, static redline | no bundle/no output/no truth drift/status separation |

### 7.6 数据不变量与清理审计规则

| 不变量 | 数据断言 |
|---|---|
| typed identity | DS 不以 display name、endpoint、provider body 或 inventory 命名 Tool/Binding/Invocation |
| replay symmetry | duplicate case 同时 seed claim 和 matching stored result/receipt/report；缺一才进入 `DuplicateResultMissing` |
| pair atomicity | outcome/audit 只允许成对 seed 或明确 half-pair defect；不以两个独立成功 row 代表 pair |
| query purity | stale/missing/degraded seed 不包含隐含 repair/refresh side effect；write spy 初始为零 |
| Job boundedness | 每个 Job seed 有显式 scope、cursor、watermark、target ordinal 和上限类别；不生成 whole scan |
| phase fence | Prepared seed 只表示本地 marker；unknown seed 不含可安全重试的假设 |
| blocker semantics | upstream negative seed 只返回 blocked/unavailable/unverifiable/unknown；不生成 positive readiness |
| sensitivity | dummy forbidden corpus 不进入业务 truth、audit、report 或 observer fallback |
| cleanup | 每个 dataset 有 cleanup profile；无人工临时清理或共享 mutable singleton |

### 7.7 逐切口停审记录

| 数据切口 | source / constructability | isolation / cleanup | substitute | 结论 |
|---|---|---|---|---|
| FOUNDATION/CONTRACT/BIND/INV | 03 typed object、protocol、state 可构造 | case + scope + run namespace；pure/fake reset | pure/contract fake | 通过 |
| PRE/OUTCOME/HANDOFF | 03 phase、pair、target、Port resolution 可构造 | attempt/material/generation 隔离；unknown reset | controlled Port | 通过；positive external 条件化 |
| QUERY/CONSUMER/CONT/JOB | read bundle、envelope、bounded plan 可构造 | query/consumer/job key 隔离；zero-write spy reset | read fake/controlled Port | 通过 |
| STATE/TX/CONC/ERR | formal state/Loaded/UoW/fault 可构造 | operation key、ordinal、journal 隔离 | deterministic harness | 通过 |
| CFG/OBS/VETO | 04 candidate、safe output、NC mutation 可构造 | profile/case/corpus 隔离；corpus delete | pure validator/observer | 通过 |

### 7.8 跨数据隔离/清理审计

| 审计项 | 结论 | 处理 |
|---|---|---|
| P0 TC 是否都有唯一 DS 入口 | 通过；18 个 family dataset 覆盖 Step 6 全部 TC 范围 | 新 TC 必须先新增/扩展 DS manifest |
| valid 与 negative 是否共享 mutable seed | 未发现共享；negative 使用单变量 mutation 和独立 scenario namespace | 实现时禁止原位修改 valid seed |
| duplicate replay 是否有对称 surface | 通过；claim/result/receipt/report 明确成对；缺失场景单独标记 | 不从 current truth 重建 |
| Query/Job 是否有隐含写入 | 未发现；write spy 和 no-repair seed 固定 | 任何 query refresh/subject repair 视为数据设计缺陷 |
| fake/stub/real-like 是否混用 | 未混用；P0 仅 pure/fake/controlled/Disabled | Step 8 仅登记条件 P1 real-like |
| 敏感 corpus 是否可泄漏 | 仅 dummy isolated corpus；不进业务 Store/report | 扫描后删除，禁止真实 secret |
| 人工造数/人工清理依赖 | 未发现 | 实现若无法自动构造则回写 03/04 或登记 blocker |

## 8. 回填草稿（正式 05 §7）

> 校准来源：
> - `design-calibration/05_test_plan_step_07_test_data.md`
>
> 延伸阅读：
> - 建议继续阅读本文件的“数据集 manifest contract”“Deterministic primitive registry”“Canonical data set table”“Negative and recovery corpus”和“数据不变量与清理审计规则”。

测试数据按 `DS-L2T-*` 逻辑数据集组织。每个 Step 6 用例族都有 canonical typed baseline、正向/负向/边界/并发/恢复场景、`test_run_ref` 隔离字段、effect probe、substitute profile 和 cleanup profile。Clock、ID、metadata、canonical digest、Store/UoW、Port resolution、配置和观测均采用显式 deterministic primitive；Query 数据不包含 refresh/write，Job 数据包含有界 scope/cursor/watermark，Prepared/Unknown 数据不携带自动重试假设。P0 只使用 pure、contract-faithful fake、controlled script 或 formal Disabled；`L2T-UP-001~009` 只产生 blocked/unavailable/unverifiable/unknown negative data。真实 secret、provider body、run、artifact、报告和 evidence 不在本 Step 生成。

## 9. 待确认事项

| 事项 | 影响 | 未确认前处理 |
|---|---|---|
| 实现仓测试框架和 fixture 文件布局 | Step 9 suite/script 实现 | 只保留 DS manifest 和 primitive contract，不写路径/命令 |
| durable Store/UoW/sidecar capability | P1 real-like 数据准备 | P0 fake/controlled；capability 未闭则 blocked |
| exact policy numeric values | timeout/page/batch/retention 边界 | 使用 04 typed policy ref/category；不写未经 authority 的数字 |
| upstream owner/schema/mapping/route/client closure | positive external fixture | 继续使用 NEG-UPSTREAM；不生成 positive readiness |
| 06 evidence authority | 数据到证据的最终绑定 | 只保留 planned EV family，Step 13 再绑定 |

## 10. 进入下一步条件

- [x] 每个 P0 用例族有唯一数据集入口和可重复 baseline。
- [x] 负向、边界、并发和恢复数据独立于 happy-path mutable seed。
- [x] 隔离键、cleanup profile、fake/controlled/Disabled 边界明确。
- [x] Query no-write、Job bounded/no-repair、pair atomicity、unknown fence、redaction 和 blocker 语义有数据断言。
- [x] 未创建真实 run、数据文件、数据库、secret、artifact、report 或 evidence alias。
- [x] 可进入 Step 8；正式 05 仍锁定，未修改。

## 11. Step 7 完成记录

| 项 | 结论 |
|---|---|
| Step 状态 | `accepted_for_step_07 / proceed_to_step_08` |
| 停审时间 | 2026-08-06（设计审查记录；非测试执行时间） |
| 上游 blocker | `L2T-UP-001~009` 仍 open；只生成 negative/blocked 数据 |
| 正式文档写入 | 未写；Step 15 前保持锁定 |
| 下一步 | Step 8 测试环境与配置矩阵 |
