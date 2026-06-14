# Step 16. 测试切口与最小验证清单

> 对应正式文档章节: `03-详细设计.md` 第 15 章 测试切口与最小验证清单
> 对应 SOP: `standards/document/详细设计讨论流程_SOP.md` Step 16
> 当前状态: Step 16.6 cross-step closure / Step 17 handoff / 回填草稿 已写入;Step 16 已完成,等待用户审核后进入 Step 17 implementation handoff
> 本文件性质: 详细设计 Step 16 中间产物,不是正式 `03-详细设计.md`
> 执行纪律: 本 Step 只定义最小验证入口,不替代 `05-测试方案.md`,不分配正式 TC 编号,不提前修改正式 `03-详细设计.md`

---

## 1. 16.0 framework / input boundary / batch plan

本批只建立 Step 16 的执行框架、输入边界、SOP 问题初答、当前材料诊断、设计原则、分批计划和红线。模块测试切口、Command / Query / Event / Job 切口、状态机切口、一致性 / 幂等 / 并发切口、配置 / 观测 / redaction 切口在后续小批次逐步写入。

### 1.1 当前批次状态

| 项 | 状态 |
|---|---|
| 当前 Step | Step 16 测试切口与最小验证清单 |
| 当前批次 | 16.6 cross-step closure / Step 17 handoff / 回填草稿 |
| 当前结论 | Step 16 已完成;模块、协议、状态、事务、错误、幂等、配置、观测和 redaction 测试切口均已闭合到最小验证入口 |
| 本批边界 | 不新增 object、port、state、error、DTO、stored material、fixture schema、CI job、coverage threshold、TC 编号、优先级、证据编号或执行排期 |
| 输出文件 | `projects/L1-identity/design-calibration/03_ddd_step_16_test_cuts.md` |
| 下一步 | Step 17 implementation handoff |

### 1.2 Step 16 总体目标

Step 16 的目标是为实现者和后续 `05-测试方案.md` 提供最小验证入口,确保 Step 5~15 已定义的实现契约都有可反查测试切口。实现侧必须能从本 Step 判断:

- 每个实现模块至少需要哪些 unit / service / repository / adapter / entry test cut。
- 每个 Command、Query、Inbound Event / Callback、Outbound Event 和 Operations Job 至少有哪些正向和异常测试切口。
- 每个正式状态机如何覆盖合法转换、非法转换、terminal guard 和 forbidden transition。
- 事务、一致性、幂等、并发、duplicate replay、commit unknown、partial failure、retry / terminal failure 如何验证。
- 配置绑定、adapter availability、runtime assembly、entry dispatch、fake/controlled/disabled parity 如何验证。
- 日志、指标、业务 trace/audit/report/handoff、redaction、metric low-cardinality 和 forbidden body 如何验证。
- 哪些测试细节必须留给 `05-测试方案.md`、`06-验收标准.md` 或 `07-实施计划.md`。

本 Step 不定义完整测试矩阵、正式 TC 编号、优先级、覆盖率目标、fixture 目录结构、测试数据全集、CI job 分层、真实 durable store / broker / sibling repo 联调、报告模板、evidence 编号、执行排期或验收签署标准。这些由 `05-测试方案.md`、`06-验收标准.md` 和 `07-实施计划.md` 承接。

### 1.3 本步输入

| 输入 | 当前状态 | 本 Step 用途 |
|---|---|---|
| `03_ddd_step_05_module_contracts.md` | 已完成并已审核通过 | 固定 `identity-contracts`、`identity-domain`、`identity-application`、`identity-infra`、`identity-api`、`identity-worker`、`identity-jobs` 七个模块测试主轴 |
| `03_ddd_step_06_object_contracts.md` | 已完成并已审核通过 | 固定对象 factory、不变量、state enum、trace/audit/outbox/handoff/report object、body-free object 的单元测试入口 |
| `03_ddd_step_07_trait_port_adapter_contracts.md` | 已完成并已审核通过 | 固定 repository、port、adapter、UoW、Clock、IdGenerator、stored result、fake/controlled failure injection 的测试入口 |
| `03_ddd_step_08_protocol_contracts.md` | 已完成并已审核通过 | 固定 6 个 Command、14 个 Query、5 个 Inbound Event / Callback、10 个 Outbound Event、6 个 Operations Job 的协议测试入口 |
| `03_ddd_step_09_function_flows.md` | 已完成并已审核通过 | 固定 accepted / rejected / duplicate / query no-write / partial failure / retry / terminal flow 的 application service 测试入口 |
| `03_ddd_step_10_state_matrix.md` | 已完成并已审核通过 | 固定 business truth、source/reference、read/visibility、projection/reference/report、outbox/handoff、idempotency/job、runtime/adapter/entry 状态机测试入口 |
| `03_ddd_step_11_persistence_transaction_consistency.md` | 已完成并已审核通过 | 固定 version、cursor、logical store、transaction boundary、stored replay、append-only、fake/durable parity 测试入口 |
| `03_ddd_step_12_error_recovery.md` | 已完成并已审核通过 | 固定 public rejection、not-visible、degraded、unsupported、delayed/quarantined、retryable/terminal、rollback failure、forbidden body 错误测试入口 |
| `03_ddd_step_13_concurrency_idempotency.md` | 已完成并已审核通过 | 固定 idempotency key/digest、duplicate replay no-rerun、in-flight、same key different digest、job/consumer/callback replay 测试入口 |
| `03_ddd_step_14_config_external_binding.md` | 已完成并已审核通过 | 固定 config validation、runtime assembly、adapter binding、entry dispatch、disabled/degraded/unavailable、forbidden configurable boundary 测试入口 |
| `03_ddd_step_15_observability_audit.md` | 已完成并已审核通过 | 固定 log/metric/audit/report/handoff cuts、redaction、metric label、business audit refs-only 和 forbidden material 检查入口 |
| `projects/L1-governance/design-calibration/03_ddd_step_16_test_cuts.md` | 参考材料 | 只参考 Step 16 粒度、分批方式和表结构,不复制 governance 业务对象 |

### 1.4 SOP 问题初答

| SOP 问题 | Step 16 初答 |
|---|---|
| 每个模块至少需要哪些单元测试? | `contracts` 测 DTO / ref / view / receipt / event / job / error schema 和 roundtrip;`domain` 测 factory、不变量、policy、state transition、trace/outbox/handoff object;`application` 测 command/query/consumer/job 编排、UoW、幂等、error mapping 和副作用顺序;`infra` 测 repository version/page/unique/transaction、fake adapter failure injection、runtime config binding;`api` 测 handler validation 和 protocol mapping;`worker` 测 inbound/callback dedup、unsupported、delayed/quarantined、outbox publish dispatch;`jobs` 测 job request validation、partial failure、report、duplicate replay 和 no truth repair。 |
| 每个接口至少需要哪些正向和异常测试? | 每个 Command 至少覆盖 accepted success、invalid request/domain reject、duplicate replay、idempotency conflict、version/repository conflict。每个 Query 至少覆盖 visible hit、missing/empty、not visible、degraded/stale surface、query no-write。每个 Inbound Event / Callback 至少覆盖 accepted receipt、duplicate replay、unsupported version、rejected/delayed/quarantined。每个 Outbound Event 至少覆盖 payload marker mapping、stored outbox snapshot、forbidden body absent、publish failure marker。每个 Job 至少覆盖 completed、duplicate report replay、invalid input、partial/retryable/terminal failure、no business truth repair。 |
| 状态机合法转换和非法转换如何测试? | 以 Step 10 的正式 enum、state value、transition matrix 和 illegal transition mapping 为唯一真相源。每组状态机至少覆盖主线合法转换、边界合法转换、terminal guard、非法转换和 query/job 不得隐藏状态迁移的 negative cut。 |
| 事务、一致性、幂等和并发如何验证? | 使用 fake / in-memory repository、fake UoW、fake resolver、fake publisher、fake handoff adapter、fake clock/id generator 注入 version conflict、unique conflict、storage unavailable、stored result missing/wrong-kind、commit unknown、rollback failure、same key same digest、same key different digest、in-flight、publisher/handoff race、projection/reference cursor race 和 job partial failure。测试必须断言 truth、history、trace、audit、outbox、projection、reference、handoff、idempotency、stored result/report/receipt 的写入顺序和 no-write / rollback 边界。 |
| 哪些测试细节应留给测试方案? | 正式 TC 编号、优先级、覆盖率目标、fixture 文件、测试数据生成器、真实外部依赖联调、durable store / bus / archive / observability 产品绑定、CI job 名称、报告模板、evidence 编号、执行排期和验收矩阵留给 `05-测试方案.md`、`06-验收标准.md` 和 `07-实施计划.md`。本 Step 只定义最小测试切口。 |

### 1.5 当前材料诊断

| 材料 / 倾向 | 当前问题 | Step 16 处理 |
|---|---|---|
| Step 5 模块职责已闭合 | 缺模块级最小测试入口 | 16.1 固定七个 workspace crate 的测试切口 |
| Step 6 对象和状态已闭合 | 对象 factory、不变量、body-free boundary、trace/outbox/handoff/report object 的测试入口分散 | 16.1 / 16.3 按模块和状态族承接 |
| Step 8 协议 schema 已闭合 | 需要按 public protocol 穷尽正向和异常测试切口 | 16.1 / 16.2 按 Command、Query、Inbound/Callback、Outbound、Job 分批写入 |
| Step 9 flow 已闭合 | accepted/rejected/duplicate/no-write/partial failure 容易只测 happy path | 16.1~16.4 每个 flow family 明确 negative cut |
| Step 10 状态矩阵已闭合 | 合法 / 非法 transition 和 terminal guard 需要反查测试入口 | 16.3 固定状态机测试切口表 |
| Step 11~13 一致性、错误、幂等分散 | duplicate replay、stored result missing、commit unknown、rollback failure、partial failure 容易遗漏 | 16.4 汇总 transaction / error / idempotency / concurrency 切口 |
| Step 14 config/runtime/adapter 已闭合 | config validation、adapter availability、entry dispatch、fake/controlled/disabled parity 需要验证 | 16.5 写配置与外部依赖测试切口 |
| Step 15 observability/audit 已闭合 | redaction、metric label、audit refs-only、forbidden body 需要自动检查入口 | 16.5 写观测与 redaction 测试切口 |
| 旧 `05/06/07` 早于新版 `03` | 不能反向决定当前详细设计测试切口 | 本 Step 只承接 Step 5~15,后续由 `05/06/07` 复核当前 `03` |

### 1.6 设计原则

| 原则 | 正式口径 |
|---|---|
| minimum validation entry, not full test plan | Step 16 只列最小测试切口,不写完整测试方案 |
| every cut maps backward | 每个测试切口必须能反查 Step 5~15 的模块、协议、flow、状态、持久化、错误、幂等、配置或观测契约 |
| protocol family coverage | 每个 public Command / Query / Inbound Event / Callback / Outbound Event / Operations Job 至少有正向和异常切口 |
| state legal and illegal | 每个正式状态机至少有合法转换、非法转换和 terminal guard 测试切口 |
| no-write and no-repair are first-class | Query no-write、job no truth repair、duplicate replay no-rerun 必须作为显式 negative cut |
| fake must prove durable semantics | fake/controlled/disabled 测试只验证正式 port outcome 和 state/report surface,不得断言 private fake map |
| body-free and redaction are tested | raw body、secret、credential、adapter response、archive package、memory text、role/source body 等 forbidden material 必须有 negative cut |
| do not assign TC IDs here | 正式 TC 编号、suite、priority、fixture path、CI job 和 evidence 留给 `05-测试方案.md` |
| missing contract is blocker | 如果测试切口需要新增 schema、port、state、error、stored material 或 fixture truth,必须回 Step 6~15 闭口 |

### 1.7 Step 16 分批计划

| 批次 | 内容 | 状态 |
|---|---|---|
| 16.0 | framework / input boundary / batch plan | [x] 已写入 |
| 16.1 | module and command test cuts | [x] 已写入 |
| 16.2 | query / inbound event / callback / outbound event / operations job test cuts | [x] 已写入 |
| 16.3 | state machine test cuts | [x] 已写入 |
| 16.4 | transaction / error / idempotency / concurrency test cuts | [x] 已写入 |
| 16.5 | config / runtime / adapter / observability / redaction test cuts | [x] 已写入 |
| 16.6 | cross-step closure / Step 17 handoff / 回填草稿 | [x] 已写入 |

### 1.8 Step 16 写入红线

| 红线 | 说明 |
|---|---|
| 不新增实现契约 | 不新增 object、field、port、state、error、DTO、repository、stored material、protocol variant 或 config schema |
| 不替代测试方案 | 不写 TC 编号、优先级、coverage threshold、fixture path、CI job、执行排期、report template 或 evidence 编号 |
| 不越过正式 flow | 测试切口只能验证 Step 9 已定义 flow,不得新增实现路径 |
| 不用测试补 schema | 若测试需要字段/状态/port 支撑,必须回对应 Step 6~15 修正 |
| 不绕过 application facade | API、worker、jobs、query、consumer、maintenance 测试切口不得以直接操作 repository 替代正式 entry/application flow |
| 不断言 private fake store | fake 测试只断言 formal state/outcome/report/issue refs,不得依赖 private map、hidden key 或 scan-derived behavior |
| 不把 query 写成修复入口 | query test 必须断言 no write / no repair / no rebuild / no resolver refresh |
| 不把 job 写成 truth repair | operations job test 必须断言 no business truth repair |
| 不保存 forbidden body | request/event/job body、RoleDefinition body、ProjectMember truth、memory text、archive package、artifact body、governance policy body、adapter response、raw config/env、secret 不得出现在测试期观测材料、stored material 或 report 中 |

### 1.9 Step 15 handoff 承接表

| Step 15 handoff topic | Step 16 承接方式 | 禁止替代 |
|---|---|---|
| log cuts coverage | 16.5 写 API、worker、jobs、application、repository/UoW、adapter、runtime、fake log coverage cut | 只检查 free text log |
| metric low-cardinality labels | 16.5 写有限 label set 检查 | ref、request id、actor id、topic raw string 或 free text label |
| accepted truth observability | 16.4 / 16.5 验证 accepted same-UoW trace/audit/outbox/stale/stored result 和 log/metric | 通过日志替代业务审计 |
| query no-write observability | 16.2 / 16.5 验证 query log/metric 可写但业务 material 不写 | visible query success 当 accepted truth |
| duplicate replay | 16.4 验证 command/consumer/callback/job replay 不重跑 mutation | 从 current truth 重算 replay surface |
| consumer / callback receipt replay | 16.2 / 16.4 验证 stored receipt replay 和 unsupported/delayed/quarantined no accepted marker | unsupported event 写 accepted trace |
| outbox publish | 16.2 / 16.4 验证 publish outcome 只改 outbox/report marker,不回滚 accepted truth | publish failure 修改 core truth |
| handoff delivery | 16.2 / 16.4 验证 delivered requires attempt + formal receipt | adapter healthy 或 request sent 当 delivered |
| projection / reference / reconciliation jobs | 16.2~16.4 验证 item refs/report refs/failed refs/no truth repair | job 直接修 business truth |
| config / runtime redaction | 16.5 验证 raw config、secret、endpoint credential、adapter response 不进入观测或报告 | 人工约定替代自动检查入口 |
| runtime / adapter state boundary | 16.5 验证 runtime assembled、adapter available、application accepted、published、delivered 分离 | runtime ready 直接断言业务成功 |
| fake / controlled / disabled parity | 16.5 验证 formal outcome/issue/state/report parity | private fake map 作为真相源 |
| forbidden body negative tests | 16.5 汇总 forbidden material negative cuts | 只检查 secret,遗漏业务 raw body |

### 1.10 16.0 stop-review record

| 审查项 | 结论 | 说明 |
|---|---|---|
| 是否限定 Step 16 范围 | 通过 | 只写最小测试入口,不写完整测试方案、TC 编号或 evidence |
| 是否读取 Step 5~15 | 通过 | 本步输入覆盖模块、对象、port、协议、flow、状态、事务、错误、幂等、配置、观测 |
| 是否读取 governance Step 16 粒度 | 通过 | 采用分批写入和最小入口表结构,不复制 governance 业务对象 |
| 是否建立分批计划 | 通过 | 16.1~16.6 已按模块/协议/状态/一致性/配置观测/收口拆分 |
| 是否新增 schema / port / state / error / DTO | 未新增 | 本批只写框架、输入边界和红线 |
| 是否修改正式 `03-详细设计.md` | 未修改 | 正式文档留 Step 19 装配 |
| 下一步 | 16.1 | module and command test cuts |

---

## 2. 16.1 module and command test cuts

本批只定义七个实现模块的最小测试入口,以及 6 个 Command 的正向与异常测试切口。Query、Inbound Event / Callback、Outbound Event、Operations Job、状态机全表、事务 / 错误 / 幂等 / 并发全表、配置与观测测试留 16.2~16.5。

### 2.1 当前批次状态

| 项 | 状态 |
|---|---|
| 当前批次 | 16.1 module and command test cuts |
| 当前结论 | 模块测试切口和 Command 测试切口已闭合到最小验证入口 |
| 本批关闭事项 | DDD-S16-OPEN-001, DDD-S16-OPEN-002 |
| 本批边界 | 不写 Query/Event/Job 全表,不分配 TC 编号,不定义 fixture/CI/evidence |
| 下一批 | 16.2 query / inbound event / callback / outbound event / operations job test cuts |

### 2.2 模块测试切口汇总表

| 测试切口 | 对应契约 | 验证内容 | 建议测试类型 |
|---|---|---|---|
| `contracts_protocol_surface_roundtrip` | Step 5 `identity-contracts`;Step 8 shared protocol / Command DTO | typed refs、Command request/result、effect summary、protocol rejection、public error、view/event/job shell 可序列化、反序列化并保持 required fields | contract unit |
| `contracts_body_free_command_schema` | Step 8 command DTO;Step 15 forbidden material | 6 个 Command DTO 只含 refs/markers/safe summary refs;不含 RoleDefinition body、ProjectMember truth、memory text、archive package、trace body、receipt body、secret | contract unit / schema scan |
| `domain_truth_factory_invariants` | Step 6 object contracts;Step 10 state matrix | `GlobalMember`、`IdentityAnchorState`、`GlobalLifecycleState`、`RoleCapabilitySummary`、`CareerRecord`、`MemoryReference`、`TraceHandoffIntent` factory / policy guard 接受合法输入并拒绝非法输入 | domain unit |
| `domain_state_transition_guards` | Step 10 state matrix | lifecycle terminal no-reopen、role/source non-active priority、career append-only、memory pending/archive state、handoff pending/not delivered guard 的 domain helper 不绕过状态矩阵 | domain unit |
| `application_command_transaction_order` | Step 9 shared command discipline;Step 11 same-UoW | command accepted path 按 reserve -> load/version -> domain -> save truth -> cursor -> trace/audit/outbox/stale -> effect/stored result -> complete idempotency -> commit 顺序执行 | application service |
| `application_command_replay_no_rerun` | Step 9 duplicate replay;Step 13 idempotency | same key / same digest duplicate 只读取 stored command result/rejection replay,不重新调用 resolver、不保存 truth、不追加 trace/outbox、不 mark stale | application service |
| `application_command_error_mapping` | Step 12 error recovery | invalid request、domain rejected、adapter unavailable、version conflict、stored replay missing/wrong-kind、UoW failure 映射到正式 application/protocol surface,且不伪造成 accepted | application service |
| `infra_repository_version_and_unique` | Step 7 repository;Step 11 persistence | member/lifecycle/role/career/memory/handoff repository 的 expected_version、unique key、append-only、page/ref lookup 和 rollback behavior 与 durable 语义一致 | repository fake |
| `infra_adapter_failure_injection` | Step 7 resolver/target ports;Step 14 adapter availability | governance basis、role/capability、work、memory/archive、handoff target resolver 可注入 unavailable / invalid / unrecognized / forbidden material outcome,service 只看 formal outcome | adapter fake |
| `infra_runtime_fake_parity` | Step 14 runtime/fake;Step 15 observability | fake/controlled/disabled runtime 暴露 formal state/outcome/issue refs,不依赖 private map、hidden key、scan-derived behavior 或 default success | infra/runtime test |
| `api_command_handler_mapping` | Step 5 API module;Step 8 command envelope;Step 9 dispatch | API handler 只做 request/context extraction、metadata validation 和 application facade dispatch;不直接访问 repository、不推进 domain transition | handler test |
| `worker_dispatch_boundary` | Step 5 worker module;Step 8 inbound envelope | worker 只做 inbound/callback envelope mapping、dedupe context 和 service dispatch;不直接写 truth、不保存 external body、不绕过 receipt replay | worker test |
| `jobs_dispatch_boundary` | Step 5 jobs module;Step 8 job request;Step 9 job discipline | jobs runner 只解析 job request/run context 并调用 application facade;不直连 repository/publisher/handoff adapter,不修 business truth | job runner test |
| `observability_forbidden_material_scan` | Step 15 observability/redaction | command/module tests 产生的 log/metric/audit/report/stored surface 不含 raw body、secret、adapter response、archive package、receipt body、private fake map | observability check |

### 2.3 Command 测试切口通用规则

所有 Command 测试切口共享以下断言,具体命令表不重复展开完整事务步骤。

| 通用切口 | 对应契约 | 验证内容 | 建议测试类型 |
|---|---|---|---|
| `command_accepted_same_uow_effects` | Step 9 shared command discipline;Step 11 transaction | accepted path 同一 UoW 内保存 truth、cursor、trace/audit、outbox 或 explicit empty outbox、projection stale、effect summary、stored result 和 idempotency completion | application service |
| `command_invalid_or_policy_rejected_no_accepted_side_effect` | Step 8 rejection shell;Step 12 error recovery | invalid request / policy denied / forbidden body 不保存 accepted truth、不追加 accepted trace/outbox、不 mark stale 为 accepted | application service |
| `command_duplicate_same_digest_replays_stored_result` | Step 13 duplicate replay | duplicate same key/same digest 返回 stored accepted/rejected surface,不重跑 resolver/domain/repository mutation | application service |
| `command_duplicate_different_digest_conflicts` | Step 13 digest conflict | same key/different digest 返回 conflict/in-flight surface,保留原 stored result/ref,不覆盖 digest | application service |
| `command_version_conflict_rolls_back` | Step 11 expected_version;Step 12 conflict | expected_version / unique conflict 触发 rollback,无 partial truth、trace、outbox、stored result 或 idempotency completion | application service / repository fake |
| `command_body_free_negative_scan` | Step 8 body-free DTO;Step 15 redaction | request/result/effect/trace/outbox/report/log 不含 external body、secret、adapter raw response 或 free text reason body | contract + observability check |

### 2.4 Command 接口测试切口汇总表

| 测试切口 | 对应契约 | 验证内容 | 建议测试类型 |
|---|---|---|---|
| `EstablishGlobalMember_command_accepted` | Step 8 `EstablishGlobalMember`;Step 9 `EstablishGlobalMemberFlow`;Step 10 anchor/lifecycle | missing requested member ref uses id generator;creates `GlobalMember`, `IdentityAnchorState::Established`, initial `GlobalLifecycleState::Available`;creates accepted trace/audit, `GlobalMemberEstablished` and initial `IdentityAnchorChanged` outbox material, stale refs, stored result | API + application |
| `EstablishGlobalMember_command_rejected` | Step 8 error mapping;Step 12 rejection | missing source/actor/key, forbidden source owner, requested ref reuse, existing lifecycle conflict rejected;no accepted truth/cursor/trace/outbox/stale | API + application |
| `EstablishGlobalMember_command_duplicate` | Step 9 duplicate branch;Step 13 command replay | same idempotency key/digest replays stored `GlobalMemberCommandResult` and effect refs;does not generate new member ref, cursor, trace, outbox or stale refs | application service |
| `EstablishGlobalMember_command_conflict` | Step 11 unique/version;Step 13 digest conflict | same key/different digest or unique member conflict returns conflict surface and rolls back staged material | application + repository fake |
| `UpdateGlobalLifecycleState_command_accepted` | Step 8 `UpdateGlobalLifecycleState`;Step 9 lifecycle flow;Step 10 lifecycle/anchor | valid transition saves lifecycle state, reason, optional valid governance basis;terminal `Retired` / `Tombstoned` synchronously holds anchor per Step 9/10;emits `GlobalLifecycleChanged`, availability changed only when derived availability flips, terminal anchor changed when anchor changes | API + application |
| `UpdateGlobalLifecycleState_command_rejected` | Step 8 high-risk basis;Step 10 illegal transition;Step 12 errors | missing member, illegal target, missing reason, high-risk missing/invalid/unavailable basis, terminal reopen attempt rejected;no accepted side effects | API + application |
| `UpdateGlobalLifecycleState_command_duplicate` | Step 13 replay | duplicate replay returns stored lifecycle result and effect;does not rerun governance basis resolver or append second lifecycle trace/outbox | application service |
| `UpdateGlobalLifecycleState_command_conflict` | Step 11 version;Step 13 digest | version conflict or digest conflict returns conflict surface;no lifecycle/anchor partial write | application + repository fake |
| `MaintainRoleCapabilitySummary_command_accepted` | Step 8 role command;Step 9 role flow;Step 10 role/source states | resolved source + source version + safe summary + validated evidence creates/updates `RoleCapabilitySourceSnapshot` and `RoleCapabilitySummary` active/usable state;stores reference sidecar as defined;emits role summary/source outbound material when accepted | API + application |
| `MaintainRoleCapabilitySummary_command_rejected` | Step 8 forbidden body;Step 9 source priority;Step 12 adapter errors | missing member, missing source, unresolved/unrecognized/unavailable source, missing evidence/safe summary, forbidden RoleDefinition/CapabilityDefinition/method/evidence body must not accepted active | API + application |
| `MaintainRoleCapabilitySummary_command_duplicate` | Step 13 replay | duplicate replays stored role result/effect,does not rerun source/evidence resolver or create second snapshot/outbox | application service |
| `MaintainRoleCapabilitySummary_command_conflict` | Step 11 reference/version;Step 13 digest | role summary/source snapshot expected_version conflict or digest conflict rolls back truth/reference/outbox/stored result | application + repository fake |
| `AppendCareerRecord_command_accepted` | Step 8 career command;Step 9 append flow;Step 10 append-only career | trusted work participation source appends new `CareerRecord`;correction appends a new correction record and keeps original immutable / superseded marker per Step 10;emits `CareerRecordAppended` or `CareerCorrectionAppended` material | API + application |
| `AppendCareerRecord_command_rejected_or_noop` | Step 8 duplicate source;Step 9 pending review;Step 12 priority | missing member/source, untrusted/unavailable work source, forbidden Project/WorkItem/ProjectMember body rejected or explicit pending/noop branch per Step 9/12;duplicate source creates no second career history | API + application |
| `AppendCareerRecord_command_duplicate` | Step 13 replay | duplicate command replays stored career result/effect;does not append another record or re-evaluate duplicate source marker | application service |
| `AppendCareerRecord_command_conflict` | Step 11 append-only/unique;Step 13 digest | same source marker conflict, original correction target missing/conflicting, or digest conflict does not overwrite/reorder/delete existing career records | application + repository fake |
| `MaintainMemoryReference_command_accepted` | Step 8 memory command;Step 9 memory flow;Step 10 memory states | trusted memory/archive/handoff source creates or updates `MemoryReference` and `MemoryReferenceState`;explicit pending verification uses formal state;archive/handoff marker changes relation without storing memory/archive body | API + application |
| `MaintainMemoryReference_command_rejected` | Step 8 forbidden body;Step 9 marker priority;Step 12 handoff errors | missing member, all memory/archive/handoff markers absent, unresolved/untrusted source, handoff marker mismatch, forbidden memory text/embedding/archive package/receipt body rejected;no accepted relation | API + application |
| `MaintainMemoryReference_command_duplicate` | Step 13 replay | duplicate replays stored memory relation result/effect;does not call resolver/callback mapper or create second relation/outbox | application service |
| `MaintainMemoryReference_command_conflict` | Step 11 version;Step 13 digest | relation expected_version conflict, direct ref vs handoff lookup conflict, or digest conflict rolls back relation/state/outbox/stored result | application + repository fake |
| `PrepareTraceHandoff_command_accepted` | Step 8 handoff command;Step 9 prepare flow;Step 10 handoff state | non-empty trace refs, visible/allowed material, supported target/scope create `TraceHandoffIntent` in `PendingHandoff`;effect has explicit empty `outbox_refs`;no delivery call;stored accepted result supports replay | API + application |
| `PrepareTraceHandoff_command_rejected` | Step 8 handoff errors;Step 12 target/material/visibility | empty trace refs, trace/audit not found or mismatched member, unsupported target/scope, target resolver unavailable, forbidden trace/audit/archive/receipt body, visibility denied rejected;no intent saved | API + application |
| `PrepareTraceHandoff_command_duplicate` | Step 13 replay | duplicate replays stored pending handoff result/effect;does not create a new handoff intent,does not append delivery receipt marker,does not call delivery adapter | application service |
| `PrepareTraceHandoff_command_conflict` | Step 11 unique/version;Step 13 digest | same key different digest, requested intent ref reuse, trace selection conflict, or repository version conflict rolls back handoff intent/effect/stored result | application + repository fake |

### 2.5 16.1 stop-review record

| 审查项 | 结论 | 说明 |
|---|---|---|
| 是否关闭 DDD-S16-OPEN-001 | 通过 | §2.2 覆盖七个 workspace crate,并明确 entry/module 不绕过 application facade |
| 是否关闭 DDD-S16-OPEN-002 | 通过 | §2.4 覆盖 6 个 Command 的 accepted / rejected / duplicate / conflict 最小切口 |
| 是否保持 Step 16 范围 | 通过 | 未分配 TC 编号、fixture、CI job、coverage threshold、evidence 或执行排期 |
| 是否避免提前写后续批次 | 通过 | Query/Event/Job、状态机全表、一致性/幂等、配置/观测细节留 16.2~16.5 |
| 是否新增 schema / port / state / error / DTO | 未新增 | 只引用 Step 5~15 已闭合契约 |
| 是否修改正式 `03-详细设计.md` | 未修改 | 正式文档留 Step 19 装配 |
| 下一步 | 16.2 | query / inbound event / callback / outbound event / operations job test cuts |

---

## 3. 16.2 query / inbound event / callback / outbound event / operations job test cuts

本批覆盖 Step 8/9 已闭合的 14 个 Query、5 个 Inbound Event / Callback、10 个 Outbound Event material 和 6 个 Operations Job。状态机逐项合法/非法迁移测试留 16.3,事务/错误/幂等/并发矩阵留 16.4,配置/观测/redaction 细节留 16.5。

### 3.1 当前批次状态

| 项 | 状态 |
|---|---|
| 当前批次 | 16.2 query / inbound event / callback / outbound event / operations job test cuts |
| 当前结论 | Query/Event/Job 协议族的最小验证入口已闭合 |
| 本批关闭事项 | DDD-S16-OPEN-003 |
| 本批边界 | 不写状态机全表、不写一致性/幂等全表、不分配 TC 编号、fixture、CI 或 evidence |
| 下一批 | 16.3 state machine test cuts |

### 3.2 Query 测试切口通用规则

| 通用切口 | 对应契约 | 验证内容 | 建议测试类型 |
|---|---|---|---|
| `query_visibility_first` | Step 8 `IdentityQueryRequest<T>`;Step 9 query no-write discipline | query 先解析 request/metadata,再通过 `IdentityReadVisibilityRepository` 或正式 visibility resolver 取得可见性输入;not visible 返回 body-free surface | query handler |
| `query_no_write_side_effects` | Step 9 query no-write;Step 11 read-only semantics | query 不开启 write UoW,不 reserve idempotency,不写 truth/trace/audit/outbox/projection/reference/report/stored result,不触发 rebuild/refresh/publish/deliver | query service |
| `query_degraded_missing_stale_surface` | Step 8 query surface;Step 10 read disposition | missing、empty、stale visible、degraded、rebuilding、not visible 使用正式 query surface,不得默认 visible 或自动 repair | query service |
| `query_body_free_views` | Step 8 view DTO;Step 15 redaction | view/page 只返回 refs/state/safe markers/visibility result,不返回 source body、memory text、archive package、audit raw log、adapter response | contract + query service |

### 3.3 Query 接口测试切口汇总表

| 测试切口 | 对应契约 | 验证内容 | 建议测试类型 |
|---|---|---|---|
| `GetGlobalMemberAnchor_query` | Step 8 `GetGlobalMemberAnchor`;Step 9 `GetGlobalMemberAnchorFlow` | visible anchor hit;member missing;not visible;optional member summary slice stale/degraded;query no-write and no projection create | query handler |
| `GetGlobalLifecycleSummary_query` | Step 8 `GetGlobalLifecycleSummary`;Step 9 flow | visible lifecycle hit;missing lifecycle;terminal lifecycle surface;not visible;stale summary slice;no lifecycle repair | query handler |
| `GetRoleCapabilitySummary_query` | Step 8 `GetRoleCapabilitySummary`;Step 9 flow | visible role summary + source snapshot;missing summary;source unavailable/stale degraded;not visible;no resolver call or refresh | query handler |
| `ListCareerRecords_query` | Step 8 `ListCareerRecords`;Step 9 flow | paged career records;empty page;per-item visibility filtering;missing/correction refs degraded;no append or correction repair | query handler |
| `ListMemoryReferences_query` | Step 8 `ListMemoryReferences`;Step 9 flow | paged memory refs;pending verification/archive/handoff state surface;not visible;missing relation degraded;no memory/archive resolver call | query handler |
| `ReadMemberSummary_query` | Step 8 `ReadMemberSummary`;Step 9 flow | stable `MemberSummaryViewRef` lookup;fresh/stale/degraded/missing summary;not visible before leaking slices;no view creation or rebuild | query handler |
| `ReadIdentityTrace_query` | Step 8 `ReadIdentityTrace`;Step 9 flow | by member / by subject / by change kind selectors;page cursor separated from truth cursor;per-item visibility;all denied returns safe surface;no trace repair | query handler |
| `ReadAuditTrail_query` | Step 8 `ReadAuditTrail`;Step 9 flow | member canonical audit subject mapper used;empty/missing trail;not visible;cursor/page handling;no audit trail create or raw audit log | query handler |
| `GetProjectionState_query` | Step 8 `GetProjectionState`;Step 9 flow | projection state exact read;Fresh/Stale/Rebuilding/Failed/Unavailable surface;missing state;no rebuild/mark fresh | query handler |
| `GetReferenceResolutionState_query` | Step 8 `GetReferenceResolutionState`;Step 9 flow | reference bundle exact read;typed sidecar refs present/absent;Unavailable/Unrecognized/Stale degraded surface;no external resolver or sidecar save | query handler |
| `ReadReconciliationReport_query` | Step 8 `ReadReconciliationReport`;Step 9 flow | scope list and exact report read;report-only refs/finding/issue surface;not visible;missing report;no reconciliation generation or repair action | query handler |
| `ListPendingIdentityOutbox_query` | Step 8 `ListPendingIdentityOutbox`;Step 9 flow | pending/retryable/by subject/by member/by trace selectors;visibility-filtered page;payload marker body-free;no publish/retry/topic raw string | query handler |
| `GetIdentityOutboxState_query` | Step 8 `GetIdentityOutboxState`;Step 9 flow | exact outbox state read;Pending/Published/Retryable/Failed/Skipped surface;missing/not visible/degraded;no publisher call or downstream consumed claim | query handler |
| `GetTraceHandoffState_query` | Step 8 `GetTraceHandoffState`;Step 9 flow | exact handoff intent state read;Pending/Delivered/Retryable/Failed/Cancelled surface;Delivered requires formal receipt marker;no delivery/retry/receipt body | query handler |

### 3.4 Inbound Event / Callback 测试切口通用规则

| 通用切口 | 对应契约 | 验证内容 | 建议测试类型 |
|---|---|---|---|
| `inbound_envelope_validation` | Step 8 `IdentityInboundEventEnvelope<T>` | consumer name、binding ref、source event ref、schema version、idempotency key、trace context、occurred/received time 必填;unsupported schema 在 unsafe payload parse 前返回 receipt | worker + application |
| `inbound_duplicate_receipt_replay` | Step 9 consumer discipline;Step 13 replay | same key/same digest duplicate 读取 typed stored consumer/callback receipt envelope replay,不重放 mutation、不重新解析 payload body | application service |
| `inbound_rejected_delayed_quarantined_no_accepted_marker` | Step 12 error/recovery | unsupported/rejected/delayed/quarantined/noop branch 返回正式 receipt/outcome,不写 accepted trace/outbox/stale | worker + application |
| `inbound_body_free_payload` | Step 8 payload DTO;Step 15 redaction | payload 只承载 refs/state/safe summary/material marker,不保存 role/work/memory/archive/receipt body | contract + worker |

### 3.5 Inbound Event / Callback 接口测试切口汇总表

| 测试切口 | 对应契约 | 验证内容 | 建议测试类型 |
|---|---|---|---|
| `HandleRoleCapabilitySourceChanged_event` | Step 8 payload;Step 9 `HandleRoleCapabilitySourceChangedFlow` | accepted source snapshot/reference sidecar update;duplicate receipt replay;unsupported version;unavailable/unrecognized/quarantined branch;no RoleDefinition/CapabilityDefinition body | worker + application |
| `HandleWorkParticipationAccepted_event` | Step 8 payload;Step 9 flow | accepted appends career record only for trusted source;source duplicate noop/no second record;duplicate receipt replay;delayed/quarantined branch;no Project/WorkItem/ProjectMember body | worker + application |
| `HandleMemoryReferenceSourceStateChanged_event` | Step 8 payload;Step 9 flow | accepted memory relation/state/reference sidecar update;missing relation quarantined/no create-on-event unless formal branch;duplicate replay;no memory text/embedding/archive package | worker + application |
| `HandleArchiveHandoffResult_callback` | Step 8 callback payload;Step 9 flow | direct ref or handoff lookup resolves same memory relation;delivered/failed marker updates formal state;duplicate callback replay;target mismatch quarantined/rejected;no receipt/archive package body | worker + application |
| `HandleTraceHandoffResult_callback` | Step 8 callback payload;Step 9 flow | delivered requires `HandoffReceiptRef`;failed/cancelled issue marker required;updates `TraceHandoffIntent` state;duplicate callback replay;HTTP 2xx/request sent not enough | worker + application |

### 3.6 Outbound Event material 测试切口通用规则

| 通用切口 | 对应契约 | 验证内容 | 建议测试类型 |
|---|---|---|---|
| `outbound_material_accepted_only` | Step 8 outbound table;Step 9 outbound material audit | outbound material 只从 accepted command/consumer/callback transaction 生成;rejected/query/job retry 不生成新的 accepted material | application service |
| `outbound_payload_marker_snapshot` | Step 9 payload marker audit;Step 11 persistence | saved outbox record binds event name、schema version、topic key、subject、trace、cursor、payload marker;publisher 不回读 current truth 重构 payload | application + job |
| `outbound_forbidden_body_absent` | Step 8 payload body-free;Step 15 redaction | outbound payload marker/view 不含 account/credential/RoleDefinition/ProjectMember/memory text/archive package/receipt body/adapter response | contract + observability check |
| `outbound_publish_failure_does_not_rollback_truth` | Step 9 publish job;Step 11 transaction | publish retryable/permanent/skipped/unsupported 只更新 outbox state/report issue,不回滚 accepted command/consumer truth | job service |

### 3.7 Outbound Event material 测试切口汇总表

| 测试切口 | 对应契约 | 验证内容 | 建议测试类型 |
|---|---|---|---|
| `GlobalMemberEstablished_outbound_material` | Step 8 payload;Step 9 material audit | `EstablishGlobalMember` accepted creates member-established material with member/source/anchor/lifecycle safe markers and accepted cursor;no account/credential/runtime body | application service |
| `IdentityAnchorChanged_outbound_material` | Step 8 payload;Step 9 material audit | initial anchor and terminal anchor hold material created only from accepted anchor state change;subject/trace/cursor match accepted mapper | application service |
| `GlobalLifecycleChanged_outbound_material` | Step 8 payload;Step 9 material audit | each accepted lifecycle update creates lifecycle material with reason/basis refs only;no governance basis body | application service |
| `GlobalMemberAvailabilityChanged_outbound_material` | Step 8 payload;Step 9 co-emission rule | material emitted only when old/new `GlobalLifecycleState::is_available()` changes;establish initial available does not emit extra availability material | application service |
| `RoleCapabilitySummaryChanged_outbound_material` | Step 8 payload;Step 9 material audit | accepted role summary active/usable change creates body-free summary material;no RoleDefinition/CapabilityDefinition/method/evidence body | application service |
| `RoleCapabilitySourceStateChanged_outbound_material` | Step 8 payload;Step 9 material audit | accepted source snapshot/state change creates source material with source version marker,not optimistic version/cursor substitute | application service |
| `CareerRecordAppended_outbound_material` | Step 8 payload;Step 9 material audit | normal career append accepted creates append material with work/source markers;no Project/WorkItem/ProjectMember body | application service |
| `CareerCorrectionAppended_outbound_material` | Step 8 payload;Step 9 material audit | correction append creates correction material with original ref;no separate original-superseded outbound event | application service |
| `MemoryReferenceChanged_outbound_material` | Step 8 payload;Step 9 material audit | accepted memory relation/state change creates memory material with memory/archive/handoff refs;no memory text/embedding/archive package | application service |
| `MemoryArchiveHandoffStateChanged_outbound_material` | Step 8 payload;Step 9 material audit | accepted archive/handoff state marker creates material;receipt ref only for delivered state;failure/cancel branches carry safe issue refs | application service |

### 3.8 Operations Job 测试切口通用规则

| 通用切口 | 对应契约 | 验证内容 | 建议测试类型 |
|---|---|---|---|
| `job_entry_dispatch_only` | Step 5 jobs module;Step 8 job request;Step 9 job discipline | job runner parses `IdentityJobRequest<T>` and dispatches application facade only;does not direct-read repositories or adapters | job runner |
| `job_duplicate_report_replay` | Step 8 job report;Step 9 shared job skeleton;Step 13 replay | same key/same digest duplicate loads stored `IdentityJobRunReport` and stored result;does not rerun body or re-list pending/stale/retryable items | job service |
| `job_no_business_truth_repair` | Step 9 no truth repair;Step 10 job state | jobs may write projection/reference/report/outbox/handoff/report only;never mutate `GlobalMember`, lifecycle, role, career or memory truth | job service |
| `job_partial_failure_report_refs` | Step 8 report surface;Step 9 report mapping | Partial/Failed/RetryableFailed reports include item refs and non-empty issue refs;report stores no raw log/body/adapter response | job service |

### 3.9 Operations Job 接口测试切口汇总表

| 测试切口 | 对应契约 | 验证内容 | 建议测试类型 |
|---|---|---|---|
| `RebuildIdentityProjection_job` | Step 8 job DTO;Step 9 `RebuildIdentityProjectionFlow` | explicit/stale target expansion;fresh rebuild success with source cursor;unsupported writer or missing cursor failed item;partial report;duplicate report replay;no truth repair | job service |
| `RefreshExternalReferenceState_job` | Step 8 job DTO;Step 9 flow | explicit/stale/owner/kind target selection;loaded bundle version used for state/sidecar save;unavailable/unrecognized/refresh failed issue refs;duplicate replay;no external body | job service |
| `RunIdentityReconciliation_job` | Step 8 job DTO;Step 9 flow | report-only target expansion;no-finding/generated/failed report;forbidden finding material rejected/failed;partial expansion issue refs;no remediation/truth repair | job service |
| `PublishIdentityOutbox_job` | Step 8 job DTO;Step 9 flow | pending page scan;publisher uses saved outbox + payload marker + topic binding;Published/retryable/permanent/skipped/unsupported state/report mapping;duplicate replay;accepted truth not rolled back | job service |
| `DeliverTraceHandoff_job` | Step 8 job DTO;Step 9 flow | explicit/target-scoped intent scan;Delivered requires attempt + receipt;retryable/permanent failed requires attempt + issue;cancelled/unsupported without attempt;no archive/receipt body | job service |
| `RetryIdentityPropagationFailures_job` | Step 8 job DTO;Step 9 flow | processes only one retry family per run;retries only retryable outbox/handoff;reuses publish/deliver mapping;duplicate replay does not re-list retryable store | job service |

### 3.10 16.2 stop-review record

| 审查项 | 结论 | 说明 |
|---|---|---|
| 是否关闭 DDD-S16-OPEN-003 | 通过 | §3.3、§3.5、§3.7、§3.9 覆盖 14 Query、5 Inbound/Callback、10 Outbound、6 Job |
| 是否保持 Query no-write | 通过 | §3.2/§3.3 明确 no write / no repair / no rebuild / no resolver refresh |
| 是否保持 Event/Callback replay | 通过 | §3.4/§3.5 明确 typed stored receipt replay and no accepted marker for unsupported/delayed/quarantined |
| 是否保持 Outbound accepted-only | 通过 | §3.6/§3.7 明确 only accepted material and no current truth reconstruction |
| 是否保持 Job no truth repair | 通过 | §3.8/§3.9 明确 jobs only write maintenance/propagation/report material |
| 是否保持 Step 16 范围 | 通过 | 未分配 TC 编号、fixture、CI job、coverage threshold、evidence 或执行排期 |
| 是否新增 schema / port / state / error / DTO | 未新增 | 只引用 Step 5~15 已闭合契约 |
| 是否修改正式 `03-详细设计.md` | 未修改 | 正式文档留 Step 19 装配 |
| 下一步 | 16.3 | state machine test cuts |

---

## 4. 16.3 state machine test cuts

本批只把 Step 10 已闭合的状态机转成最小测试切口。它不重写 Step 10 转换矩阵,不新增状态名、transition helper、error variant、repository surface 或测试方案细节。后续 transaction / error / idempotency / concurrency 的全量交叉验证留 16.4。

### 4.1 当前批次状态

| 项 | 状态 |
|---|---|
| 当前批次 | 16.3 state machine test cuts |
| 当前结论 | Step 10 状态机测试切口已闭合到合法转换、非法转换、terminal guard、query no-write、job no-repair 和 fake/durable parity 的最小入口 |
| 本批关闭事项 | DDD-S16-OPEN-004 |
| 本批边界 | 不写完整 transition table,不分配 TC 编号、fixture、CI job、coverage threshold 或 evidence |
| 下一批 | 16.4 transaction / error / idempotency / concurrency test cuts |

### 4.2 State machine test cut common rules

| 通用切口 | 对应契约 | 验证内容 | 建议测试类型 |
|---|---|---|---|
| `state_transition_uses_formal_enum` | Step 6 state enum;Step 10 state inventory | 所有测试只使用正式 enum / state value 和正式 factory/helper;不得用字符串、ref 前缀、private fake key 或同义状态推断状态 | domain unit / service |
| `state_legal_transition_success` | Step 10 transition matrix;Step 9 flow | 每个状态族至少覆盖主线合法转换和边界合法转换;state owner、trigger owner 和 flow side effect 与 Step 10 一致 | domain unit / application service |
| `state_illegal_transition_rejected` | Step 10 forbidden transition;Step 12 error handoff | 非法 from/to、缺前置条件、owner 错误、reserved transition 调用必须返回正式错误/拒绝 surface,且不保存状态副作用 | domain unit / service |
| `state_terminal_guard` | Step 10 terminal/reopen audit | terminal 或 quasi-terminal state 不得直接 reopen;仅允许 Step 10 明示的 upgrade / recovery path | domain unit / service |
| `state_owner_boundary` | Step 10 trigger owner audit | domain helper 只改对象内状态;application 编排 trace/audit/outbox/stale/stored result;entry/runtime/fake 不得越权推进业务状态 | service / entry test |
| `state_no_query_write_no_job_repair` | Step 9 query/job discipline;Step 10 no-side-effect audit | query 只能表达 read surface;job 只能维护 projection/reference/report/outbox/handoff/job report,不得修 core identity truth | query / job service |
| `state_body_free_issue_surface` | Step 10 safe issue/finding;Step 15 redaction | failed/degraded/unavailable/invalid/retryable 等状态只暴露 safe issue/ref marker,不携带 raw request、external body、adapter response、receipt body 或 secret | contract + observability check |

### 4.3 Business truth and source state test cuts

| 测试切口 | 对应状态机 | 验证内容 | 建议测试类型 |
|---|---|---|---|
| `IdentityAnchorState_transition_guards` | `IdentityAnchorState` | establish 创建正式 anchor;terminal lifecycle hold anchor 只能通过正式 lifecycle flow 触发;held/tombstone-held 不可由 query/job/fake 直接生成 | domain + application |
| `GlobalLifecycleState_legal_illegal_terminal` | `GlobalLifecycleState` | initial available、合法 lifecycle 更新、高风险 precheck、`Retired -> Tombstoned` upgrade、terminal reopen rejected、availability 派生边界 | domain + application |
| `HighRiskLifecycleGuard_precheck_only` | high-risk lifecycle precheck | precheck missing/invalid/unavailable governance basis 不推进 lifecycle;accepted 只能来自 `UpdateGlobalLifecycleStateFlow` 的正式步骤 | domain policy / service |
| `RoleCapabilitySummary_state_priority` | `RoleCapabilitySummary` | active/usable/stale/unavailable 等状态由 source snapshot 和 safe summary 计算;低优先级或不可用 source 不覆盖高优先级 active summary | domain + service |
| `RoleCapabilitySourceSnapshot_state_update` | `RoleCapabilitySourceSnapshot` | resolver/consumer 更新 source state 和 source version;unrecognized/unavailable 不写 role definition body,不默认 active | domain + consumer |
| `WorkSource_and_CareerRecord_append_only` | work source summary,`CareerRecord` | trusted work source 才能 append;correction 追加新 record 而不改写原 record;duplicate source 不产生第二条 history | domain + application |
| `MemorySource_and_MemoryReference_state` | memory source summary,`MemoryReference` | pending verification、active relation、archive/handoff relation、failed/cancelled marker 按正式 source/callback 流转;不保存 memory/archive body | domain + application |

### 4.4 Read / visibility surface state test cuts

| 测试切口 | 对应状态机 | 验证内容 | 建议测试类型 |
|---|---|---|---|
| `ReadVisibilityDecision_disposition_order` | read visibility decision | visible、not-visible、degraded、missing/empty/stale-visible 的优先级与 Step 10 一致;not visible 不泄露 body/slice | query service |
| `MemberSummaryReadSurface_freshness` | member summary read/freshness | summary fresh/stale/rebuilding/failed/unavailable/missing surface 只读 projection 状态;query 不创建 view、不 mark fresh/stale | query service |
| `TraceAuditReadSurface_visibility` | trace/audit read surface | trace/audit query 按正式 subject/visibility/page 读取;不可见项过滤或 body-free not-visible;不 append trace/audit | query service |
| `ReadSurface_no_repair` | all read surfaces | read degraded/stale/missing 只表达 surface,不触发 resolver refresh、projection rebuild、reconciliation 或 stored result save | query service |

### 4.5 Projection / reference / reconciliation state test cuts

| 测试切口 | 对应状态机 | 验证内容 | 建议测试类型 |
|---|---|---|---|
| `ProjectionState_transition_matrix` | `ProjectionState` | accepted stale marker 进入 stale;rebuild start/success/failure/unavailable 按 Step 10 迁移;fresh 不被 query 或 fake 私有扫描更新 | job service + repository fake |
| `ProjectionState_missing_and_failed_boundaries` | `ProjectionState` | missing state、unsupported writer、source cursor missing、rebuild failure 进入正式 failed/unavailable/report surface;不修 business truth | job service |
| `ReferenceResolutionState_transition_matrix` | `ReferenceResolutionState` | tracked bundle 通过 consumer/refresh 更新 resolved/stale/unavailable/unrecognized/invalid;expected version 来自正式 versioned read | consumer + job service |
| `ReferenceResolutionState_no_external_body` | `ReferenceResolutionState` | reference sidecar 保存 safe ref/summary/state,不保存 role/work/memory/archive/adapter raw body;unavailable 不默认 resolved | repository fake / contract |
| `ReconciliationReport_state` | `ReconciliationReport` | no-finding、finding-generated、partial/failed report 只生成 report-only material;后续 run 创建新 report,不修改旧 report 作为修复 | job service |
| `MaintenanceIssueFinding_disposition` | maintenance issue/finding disposition | issue/finding disposition 只承载 safe marker/ref;invalid finding material 进入 failed/issue surface,不写 remediation truth | job service |

### 4.6 Outbox / handoff propagation state test cuts

| 测试切口 | 对应状态机 | 验证内容 | 建议测试类型 |
|---|---|---|---|
| `IdentityOutboxRecord_transition_matrix` | `IdentityOutboxRecord` | accepted material 创建 pending;publish success -> published;retryable/permanent/skipped/unsupported 按正式状态和 issue marker 更新 | job service |
| `IdentityOutboxRecord_published_boundary` | `IdentityOutboxRecord` | `Published` 只表示 outbound boundary 成功,不代表 downstream consumed;publish failure 不回滚 accepted truth | job service |
| `OutboundMaterial_visibility_disposition` | outbound visibility/material disposition | material guard 对 not visible/forbidden/missing/degraded 返回正式 disposition;不得从 current truth 重构 payload body | application + job |
| `TraceHandoffIntent_transition_matrix` | `TraceHandoffIntent` | prepare 创建 pending;deliver success -> delivered;retryable/permanent/cancelled/unsupported 按正式 attempt/issue/receipt marker 更新 | application + job |
| `TraceHandoffIntent_delivered_requires_receipt` | `TraceHandoffIntent` | request sent、adapter healthy、HTTP success 或 fake default 不足以 delivered;必须有 formal attempt + receipt marker | job service + adapter fake |
| `HandoffMaterial_disposition` | handoff material disposition | unsupported target、scope denied、material unavailable/forbidden 只产生 safe issue/disposition;不保存 archive package、trace body、receipt body | application + job |

### 4.7 Replay / job / runtime / entry state test cuts

| 测试切口 | 对应状态机 | 验证内容 | 建议测试类型 |
|---|---|---|---|
| `IdentityIdempotencyRecord_transition_matrix` | `IdentityIdempotencyRecord` | reserve、in-flight、complete accepted/rejected、conflict、expired 的状态与 key/digest/channel 一致;different digest 不覆盖原 record | application service |
| `StoredIdentityOperationResult_replay_kind` | `StoredIdentityOperationResult` | command/consumer/callback/job replay 只能读取匹配 kind 的 stored surface;wrong-kind/missing 不从 current truth 重算 | application service |
| `IdentityJobRunReport_result_state` | `IdentityJobRunReport` | completed/partial/failed/retryable failed/duplicate replay 保存 body-free item refs/issue refs;duplicate 不重跑 job body | job service |
| `ConfigValidation_state` | config validation | valid/degraded/invalid config 只影响 runtime/entry readiness;不得改变 domain invariant 或业务 accepted 语义 | runtime test |
| `RuntimeAssembly_state_boundary` | runtime assembly | assembled/degraded/failed 只表达 wiring lifecycle;assembled 不等于 adapter healthy、publish success、handoff delivered 或 command accepted | runtime test |
| `AdapterAvailability_state_boundary` | adapter availability | available/degraded/unavailable/disabled 驱动 resolver/publisher/handoff formal outcome;disabled/fake 不默认成功 | adapter fake |
| `EntryValidationDispatch_state_boundary` | API/worker/job entry validation / dispatch | entry valid / dispatched 只表示进入 facade 的尝试;不得映射为 accepted、visible、receipt accepted 或 job succeeded | entry test |

### 4.8 Cross-state negative cuts

| 测试切口 | 对应审计规则 | 验证内容 | 建议测试类型 |
|---|---|---|---|
| `cross_state_no_global_state` | Step 10 cross-state naming audit | 不存在统一 `IdentityGlobalState` 或跨 owner 总状态机;同名状态必须绑定具体 owner | contract/domain scan |
| `cross_state_query_no_write` | Step 10 query no-side-effect audit | 所有 query 在 degraded/stale/missing/not-visible 下仍不写 truth/projection/reference/report/outbox/handoff/idempotency/stored result | query service |
| `cross_state_job_no_truth_repair` | Step 10 job no-repair audit | rebuild/refresh/reconcile/publish/deliver/retry job 不写 `GlobalMember`、lifecycle、role、career、memory truth | job service |
| `cross_state_duplicate_no_rerun` | Step 10 duplicate rerun forbidden | command/consumer/callback/job duplicate 只走 stored result/receipt/report,不重跑 mutation、resolver、publisher、handoff 或 store scan | application/job service |
| `cross_state_published_not_consumed` | Step 10 downstream boundary | outbox published 不得生成 downstream consumed / callback accepted / member state changed 断言 | job service |
| `cross_state_delivered_requires_receipt` | Step 10 handoff delivery boundary | handoff delivered 必须能追溯到 attempt + formal receipt marker;adapter/fake success 不可替代 | job service |
| `cross_state_entry_dispatch_not_business_success` | Step 10 entry boundary | API/worker/job dispatch success 不等于 command accepted、query visible、consumer receipt accepted 或 job completed | entry + service |
| `cross_state_fake_no_private_map_success` | Step 10 fake/durable parity | fake/controlled/disabled 只按 formal port outcome 和 state/report surface 断言;不依赖 private map、default success 或 ref 字符串推断 | infra fake |

### 4.9 16.3 stop-review record

| 审查项 | 结论 | 说明 |
|---|---|---|
| 是否关闭 DDD-S16-OPEN-004 | 通过 | §4.2~§4.8 覆盖 Step 10 状态族、合法/非法/terminal/no-write/no-repair/fake parity 切口 |
| 是否保持 Step 10 真相源 | 通过 | 只引用 Step 10 已闭合 state inventory、transition matrix 和 cross-state audit |
| 是否避免重写完整状态矩阵 | 通过 | 本批只定义最小测试入口,不复制每条 transition 表 |
| 是否保持 Query no-write / Job no-repair | 通过 | §4.4、§4.7、§4.8 明确 read/job 边界 |
| 是否保持 body-free / redaction 边界 | 通过 | failure/degraded/issue/report/handoff/outbox surface 均要求 safe marker/ref |
| 是否新增 schema / port / state / error / DTO | 未新增 | 未补新状态、port、field、error variant、fixture schema 或 stored material |
| 是否修改正式 `03-详细设计.md` | 未修改 | 正式文档留 Step 19 装配 |
| 下一步 | 16.4 | transaction / error / idempotency / concurrency test cuts |

---

## 5. 16.4 transaction / error / idempotency / concurrency test cuts

本批承接 Step 11~13 已闭合的事务边界、错误恢复、幂等重放和并发控制。它只写最小验证入口,不定义正式 TC 编号、fixture、CI job、coverage threshold、retry/backoff 参数、transport ack/dead-letter 绑定或 observability 字段。配置、runtime、adapter、日志、指标、redaction 全表留 16.5。

### 5.1 当前批次状态

| 项 | 状态 |
|---|---|
| 当前批次 | 16.4 transaction / error / idempotency / concurrency test cuts |
| 当前结论 | Step 11~13 的 transaction、error、recovery、idempotency、concurrency 和 replay 边界已闭合到最小测试入口 |
| 本批关闭事项 | DDD-S16-OPEN-005 |
| 本批边界 | 不写配置/观测全表,不分配 TC 编号、fixture、CI job、coverage threshold 或 evidence |
| 下一批 | 16.5 config / runtime / adapter / observability / redaction test cuts |

### 5.2 Transaction boundary test cuts

| 测试切口 | 对应契约 | 验证内容 | 建议测试类型 |
|---|---|---|---|
| `transaction_command_accepted_same_uow` | Step 11 command transaction boundary | accepted command 的 truth、cursor、trace/audit、outbox、projection stale、effect summary、stored result、idempotency complete 同 UoW 提交;任一 pre-commit 失败整体 rollback | application service + UoW fake |
| `transaction_command_rejected_replayable_scope` | Step 11/12 command rejected boundary | 只有 Step 12/13 明确可 replay 的 rejected surface 才保存 stored rejected + rejected complete;不写 truth、accepted trace/outbox/stale/effect | application service |
| `transaction_query_no_write` | Step 11 query no-write boundary | query 不开 write UoW、不 reserve idempotency、不写 stored result/trace/audit/projection/reference/report/outbox/handoff | query service + repository spy |
| `transaction_consumer_callback_same_uow_receipt` | Step 11 consumer/callback boundary | accepted/delayed/quarantined/noop 等 application outcome 在同 UoW 保存 owned state/marker、typed receipt envelope、stored shell、idempotency complete | worker application service |
| `transaction_job_report_same_uow` | Step 11 job boundary | job item state/report refs、`IdentityJobRunReport`、stored `JobReport`、idempotency complete 同 UoW;stored report save 失败不返回 job success | job service |
| `transaction_entry_predispatch_no_store` | Step 11/12 entry pre-dispatch boundary | API/worker/jobs entry validation、route/binding/catalog/runtime guard 失败不保存 stored result、receipt、job report、truth、trace/outbox | entry test |
| `transaction_external_side_effect_after_commit_boundary` | Step 11 propagation isolation | accepted command 不直接发布/交付;publish/deliver job 失败只更新 outbox/handoff/report marker,不回滚 accepted truth | application + job service |
| `transaction_staged_visibility_and_rollback` | Step 11 rollback / commit visibility | staged cursor、stored result、receipt、job report、outbox/handoff/projection/reference 更新在 rollback 后不可见;commit 后才可 replay/read | repository fake / UoW fake |

### 5.3 Error / recovery test cuts

| 测试切口 | 对应契约 | 验证内容 | 建议测试类型 |
|---|---|---|---|
| `error_entry_predispatch_surface` | Step 12 entry branches | route/binding/job catalog、metadata、idempotency key、runtime dispatch 失败停在 entry surface,不伪造成 command rejected、consumer receipt 或 failed job report | API/worker/jobs entry |
| `error_invalid_transition_and_domain_reject` | Step 10/12 domain/application errors | invalid transition、policy denied、missing high-risk basis、forbidden material 被映射到正式 rejection/error surface;无 accepted side effect | domain + application |
| `error_version_unique_conflict_mapping` | Step 11 conflict;Step 12 mapping | stale `IdentityVersion`、formal unique conflict、duplicate source conflict 返回 conflict/noop/rejected surface;不 last-write-wins、不覆盖原 row | service + repository fake |
| `error_dependency_unavailable_delayed_degraded` | Step 12 retryable recovery | resolver/repository/publisher/handoff temporary unavailable 映射为 command dependency failure、worker delayed、query degraded、job retryable/partial issue;不保存 raw body | service + adapter fake |
| `error_forbidden_body_rollback_or_quarantine` | Step 12 forbidden body recovery | constructor/domain/repository/consumer/adapter 检测 forbidden body 时 reject/quarantine/rollback;fake/durable 都不保留 raw payload/source/archive/receipt/config/log body | contract + service + repository fake |
| `error_stored_replay_missing_wrong_kind` | Step 12 replay consistency defect | idempotency 指向 missing/wrong-kind stored command result、typed receipt 或 job report 时返回 replay consistency/manual recovery surface;不重跑 operation | application/job service |
| `error_commit_unknown_recovery_surface` | Step 12 commit unknown;Step 13 recovery | UoW commit unknown 时不返回 success;后续先查 idempotency/stored surface,found replay,not found unknown/manual | UoW fake + service |
| `error_rollback_failure_consistency_defect` | Step 12 rollback failure | rollback 本身失败时返回 consistency defect/manual recovery;不假设 clean rollback 后自动重试 mutation | UoW fake |
| `error_query_priority_no_repair` | Step 12 query mapping | not-visible、missing、empty、degraded、stale-visible priority 按正式 surface;query 不创建 truth/view/report、不刷新 reference | query service |
| `error_terminal_marker_recovery` | Step 12 terminal/manual recovery | outbox failed/skipped、handoff failed/cancelled/delivered、job saved report、reconciliation finding 都作为 marker/report-only surface;不自动 reopen 或 repair truth | job/query service |

### 5.4 Idempotency / replay test cuts

| 测试切口 | 对应契约 | 验证内容 | 建议测试类型 |
|---|---|---|---|
| `idempotency_key_digest_namespace` | Step 13 key/digest matrix | command、consumer/callback、job 使用正式 operation/channel/key/digest;不得用 timestamp、cursor、source version、page cursor、job run ref 或 route/topic string 替代 | contract + application |
| `idempotency_same_digest_command_replay` | Step 13 command duplicate handling | same key/same digest duplicate replay stored accepted/rejected command surface;不重跑 resolver/domain/repository mutation,不追加 trace/outbox/effect | application service |
| `idempotency_same_digest_consumer_receipt_replay` | Step 13 consumer duplicate handling | consumer redelivery 加载 typed `IdentityConsumerReceiptEnvelope`;不重新解析 payload、不调用 source resolver、不更新 truth/marker | worker application service |
| `idempotency_same_digest_callback_receipt_replay` | Step 13 callback duplicate handling | handoff callback redelivery 加载 handoff callback receipt kind;不当普通 consumer receipt,不更新 handoff/memory state | worker application service |
| `idempotency_same_digest_job_report_replay` | Step 13 job duplicate handling | duplicate job replay stored `IdentityJobRunReport`;不重新 list targets、不跑 rebuild/refresh/reconcile/publish/deliver/retry body | job service |
| `idempotency_different_digest_conflict` | Step 13 reserve outcome priority | same operation/channel/key but different digest 返回 duplicate conflict;原 digest/result authoritative,不覆盖旧 record | application/job service |
| `idempotency_inflight_no_second_writer` | Step 13 in-flight handling | same digest in-flight 返回 delayed/temporary surface;第二调用不进入 mutation/job body、不 hidden wait loop | application/job service |
| `idempotency_complete_after_stored_surface` | Step 11/13 save-before-complete | stored command result、typed receipt 或 job report 必须先保存,再 complete idempotency;反向失败不得产生 completed 指向 missing stored surface | application + repository fake |
| `idempotency_expiry_boundary` | Step 13 expiry boundary | `Expired` 不自动允许 key reuse;未有 Step 14 policy 时不静默重用旧 key、不丢 stored replay | application service |

### 5.5 Concurrency / optimistic conflict test cuts

| 测试切口 | 对应契约 | 验证内容 | 建议测试类型 |
|---|---|---|---|
| `concurrency_mutable_truth_version_conflict` | Step 11/13 mutable truth resources | member/lifecycle/role/memory 等 mutable truth stale version 冲突 rollback;不覆盖当前 truth,不提交 partial trace/outbox/stored result | application + repository fake |
| `concurrency_append_only_duplicate_guard` | Step 11 append-only;Step 13 resource inventory | career、trace、audit、outbox、stored result、receipt、job report append-only 不 overwrite/reorder;duplicate source/noop 不产生第二条 history | repository fake + service |
| `concurrency_reference_sidecar_bundle_version` | Step 11/13 reference bundle | reference state/typed sidecar 使用同一 `ExternalReferenceRef` bundle loaded version;source version/business source ref 不能当 expected_version | consumer/job service |
| `concurrency_projection_rebuild_race` | Step 13 maintenance reentry | projection rebuild 使用 loaded projection state version 和 formal source cursor;并发 rebuild 只有一个版本更新成功,失败记录 job issue,不 query rebuild | job service |
| `concurrency_outbox_dual_publisher` | Step 13 outbox reentry | 两个 publisher 同时处理同一 pending/retryable outbox 时只有一个 versioned state update 成功;失败不回滚 accepted truth | job service + publisher fake |
| `concurrency_handoff_dual_delivery` | Step 13 handoff reentry | 两个 delivery/retry 同时处理同一 handoff intent 时只有一个 versioned update 成功;Delivered 仍需 attempt+receipt | job service + handoff fake |
| `concurrency_job_duplicate_no_relist` | Step 13 job replay | job duplicate 与 fresh run 并发时 duplicate/in-flight 不 relist current targets,不重新选择 stale/pending/retryable items | job service |
| `concurrency_query_repeated_read_no_write` | Step 13 query repeated-read | repeated query 可观察当前 committed state,但不 reserve、不写 stored result、不 repair missing/stale/degraded state | query service |
| `concurrency_fake_durable_parity` | Step 11/13 fake parity | fake 与 durable 在 reserve atomicity、version conflict、terminal retry filter、missing replay、query no-write 上同语义;不使用 private map 或 hidden repair | infra fake |

### 5.6 Partial failure / propagation / maintenance test cuts

| 测试切口 | 对应契约 | 验证内容 | 建议测试类型 |
|---|---|---|---|
| `partial_job_item_failure_report` | Step 12 job mapping;Step 13 job report replay | rebuild/refresh/reconcile/publish/deliver/retry 中部分 item 失败时保存 partial/failed report、item refs、safe issue refs;duplicate replay 报告本身 | job service |
| `partial_outbox_publish_failure_isolated` | Step 11/12 outbox recovery | publisher retryable/permanent/skipped/unsupported 只更新 outbox state 和 job report issue;accepted command truth 不变 | job service |
| `partial_handoff_delivery_failure_isolated` | Step 11/12 handoff recovery | handoff target unavailable、unsupported、retryable/permanent failure 只更新 handoff marker/job issue;不保存 target path/receipt body | job service |
| `partial_reference_refresh_failure` | Step 11/12 reference recovery | refresh resolver unavailable/unrecognized/invalid 写正式 reference state/report issue when flow owns it;不删除 local truth、不用 error string 分类 | job service + resolver fake |
| `partial_projection_source_missing` | Step 11/12 projection recovery | projection source cursor/target missing 记录 failed item/report;query 仍返回 stale/missing/degraded,不 inline rebuild | job + query service |
| `partial_reconciliation_report_only` | Step 12 reconciliation recovery | reconciliation finding/issue 只写 report/finding refs;不修 member/lifecycle/role/career/memory truth 或 external truth | job service |
| `partial_retry_terminal_guard` | Step 13 terminal retry guard | retry job 只选择 retryable outbox/handoff;Published/Delivered/Failed/Cancelled/Skipped terminal state 不被重试 | job service |
| `partial_commit_post_external_failure_split` | Step 11 external side-effect boundary | post-commit publisher/handoff/worker transport failure 不能回滚 accepted truth;只能由后续 propagation/marker/report flow 表达 | application + job service |

### 5.7 Cross-family negative cuts

| 测试切口 | 对应契约 | 验证内容 | 建议测试类型 |
|---|---|---|---|
| `negative_no_replay_from_current_truth` | Step 11~13 replay rules | command/receipt/job duplicate 不从 current truth、current repository page、current projection state 重构 public surface | application/job service |
| `negative_no_unique_as_idempotency` | Step 11/13 unique vs replay | business unique conflict 不能替代 idempotency replay;source duplicate noop 只有 flow 明示时才可保存 noop receipt | application service |
| `negative_no_cursor_key_substitution` | Step 10/13 version/cursor/key separation | truth cursor、projection cursor、page cursor、source version、idempotency key、request digest、job run ref 不互相替代 | contract + service |
| `negative_no_query_diagnostic_write` | Step 11/12 query no-write | query 即使为了诊断也不写 visibility decision、audit success、stored result、repair marker 或 fake private map | query service |
| `negative_no_entry_store_on_failure` | Step 11/12 entry no-store | pre-dispatch validation/runtime/catalog failure 不创建 rejected result、receipt 或 job report | entry test |
| `negative_no_body_for_recovery` | Step 11/12 body-free recovery | 为 dedupe、replay、manual recovery、job report 或 issue marker 不保存 raw request/event/job/source/archive/receipt/config/log body | contract + observability check |

### 5.8 16.4 stop-review record

| 审查项 | 结论 | 说明 |
|---|---|---|
| 是否关闭 DDD-S16-OPEN-005 | 通过 | §5.2~§5.7 覆盖 transaction、error、idempotency、concurrency、replay、partial failure 最小切口 |
| 是否承接 Step 11 | 通过 | transaction boundary、same-UoW、rollback/commit visibility、fake/durable parity 已入测试切口 |
| 是否承接 Step 12 | 通过 | error mapping、recovery classes、forbidden body、commit unknown、manual recovery 已入测试切口 |
| 是否承接 Step 13 | 通过 | key/digest、same digest replay、different digest conflict、in-flight、reentry、terminal retry guard 已入测试切口 |
| 是否保持 Step 16 范围 | 通过 | 未分配 TC 编号、fixture、CI job、coverage threshold、evidence、retry/backoff 或 transport binding |
| 是否新增 schema / port / state / error / DTO | 未新增 | 只引用 Step 5~15 已闭合契约 |
| 是否修改正式 `03-详细设计.md` | 未修改 | 正式文档留 Step 19 装配 |
| 下一步 | 16.5 | config / runtime / adapter / observability / redaction test cuts |

---

## 6. 16.5 config / runtime / adapter / observability / redaction test cuts

本批承接 Step 14 配置与外部依赖绑定,以及 Step 15 可观测性与审计埋点契约。它只定义最小验证入口,不定义配置文件格式、env var、secret provider、日志后端、指标后端、告警阈值、SLO、dashboard、runbook、正式 TC 编号、fixture、CI job 或 evidence。

### 6.1 当前批次状态

| 项 | 状态 |
|---|---|
| 当前批次 | 16.5 config / runtime / adapter / observability / redaction test cuts |
| 当前结论 | Step 14~15 的 config/runtime/adapter/fake、log/metric/audit/report/handoff 和 redaction 边界已闭合到最小测试入口 |
| 本批关闭事项 | DDD-S16-OPEN-006 |
| 本批边界 | 不写正式 TC 编号、fixture、CI job、evidence、运维告警或 Step 17 handoff |
| 下一批 | 16.6 cross-step closure / Step 17 handoff / 回填草稿 |

### 6.2 Config / runtime boundary test cuts

| 测试切口 | 对应契约 | 验证内容 | 建议测试类型 |
|---|---|---|---|
| `config_ownership_boundary` | Step 14 configuration ownership | raw config 只由 infra config loader、runtime builder、entry composition root 读取;application/domain/contracts 不读取 env、loader、secret 或 raw config | static scan + runtime test |
| `config_redline_validation` | Step 14 redline config | no-auth、ref-only、projection no-write、outbox accepted-only、job no-repair、stored replay、body-free 等红线配置不可禁用;违规 fail-fast 或 explicit invalid/degraded | config validation test |
| `config_profile_adapter_compatibility` | Step 14 profile / adapter compatibility | local/CI profile 允许 fixture/fake;integration-like profile 拒绝 test override/private fixture;profile 不改变 domain invariant | runtime builder test |
| `config_topic_target_completeness` | Step 14 bus/outbox/handoff binding | enabled outbound event kind 必须有 `TopicKeyRef` binding;handoff target/scope 必须来自 target catalog;缺失时 publisher/handoff 不启动 | runtime builder + job entry |
| `config_runtime_builder_order` | Step 14 builder order | raw parse/type/range/cross-field validation 先于 secret ref resolution、config shell、store/base/external adapters、facade 和 entry assembly | runtime builder test |
| `config_invalid_runtime_not_assembled` | Step 14 runtime validation boundary | invalid config、redline violation、required adapter missing 不能产生 dispatchable runtime facade;不保存 business rejected result | runtime builder / entry test |
| `config_sensitive_material_infra_local` | Step 14/15 redaction | raw env value、secret、token、credential、endpoint URL 只留在 infra adapter memory boundary,不进入 application/domain/contracts/log/metric/report | redaction scan |
| `config_non_core_dependency_guard` | Step 14 cross-repo dependency | 除 `core-contracts` 外,identity crate 不引入 bus/method/work/governance/memory/archive/artifact/observability sibling implementation path dependency | static dependency scan |

### 6.3 Runtime / adapter / fake parity test cuts

| 测试切口 | 对应契约 | 验证内容 | 建议测试类型 |
|---|---|---|---|
| `runtime_assembled_not_business_success` | Step 10/14/15 runtime boundary | `RuntimeAssemblyState::Assembled` 只表示 wiring ready;不代表 adapter healthy、query visible、command accepted、published 或 delivered | runtime + entry test |
| `adapter_availability_surface` | Step 10/14 adapter availability | available/degraded/unavailable/disabled 必须映射到正式 query degraded、command dependency failure、job issue 或 entry/runtime surface;不默认成功 | adapter fake |
| `disabled_adapter_no_fake_success` | Step 14/15 disabled mode | disabled resolver/publisher/handoff/audit adapter 返回 formal disabled/unavailable/degraded outcome and issue ref;不返回 accepted/published/delivered/completed | adapter fake |
| `controlled_outcome_formal_mapping` | Step 14 fake/controlled parity | controlled fixture 只能选择 Step 7/12 已定义 formal outcome;缺 outcome 返回 controlled issue,不落 private map 推导 | fake runtime test |
| `resolver_body_free_output` | Step 14/15 resolver boundary | role/governance/work/artifact/memory resolver 只返回 safe summary refs、state kinds、source version refs、issue refs;不返回或保存 external body | adapter fake + contract |
| `publisher_saved_marker_only` | Step 14/15 outbox binding | publisher 使用 saved outbox record + payload marker + topic key ref;不从 current truth 重建 payload,不使用 topic raw string 作为业务真相 | job service + publisher fake |
| `handoff_delivery_marker_only` | Step 14/15 handoff binding | delivery 使用 handoff intent、target/scope、safe material marker;Delivered 必须有 attempt + receipt ref;不保存 bucket/path/archive package/receipt body | job service + handoff fake |
| `entry_dispatch_facade_only` | Step 14 entry boundary | API/worker/jobs entry 只经 dispatch catalog 调 application facade;不直连 repository/resolver/publisher/handoff/UoW | entry test |
| `fake_durable_observability_parity` | Step 15 fake/durable parity | fake/controlled/disabled 与 durable 暴露相同 formal outcome kind、state、issue refs、log/metric categories;不暴露 private fake map | infra fake |

### 6.4 Log instrumentation test cuts

| 测试切口 | 对应契约 | 验证内容 | 建议测试类型 |
|---|---|---|---|
| `log_entry_application_coverage` | Step 15 log cuts | API command/query、worker consumer/callback、jobs entry、application command/query/job 都产生结构化 log cut with safe refs/kinds/issues | instrumentation test |
| `log_repository_uow_replay_coverage` | Step 15 repository/UoW log cuts | version conflict、unique conflict、repository unavailable、commit unknown、rollback failed、stored replay missing/wrong-kind 有 error/warn log with diagnostic refs | instrumentation + UoW fake |
| `log_resolver_publisher_handoff_coverage` | Step 15 adapter log cuts | resolver success/failure、publish attempt outcome、handoff attempt/receipt/failure、adapter availability 均记录 adapter ref/mode/outcome/issue refs | adapter fake |
| `log_duplicate_replay_not_business_audit` | Step 15 duplicate log rule | duplicate replay 只写 replay log/metric with stored result/receipt/report ref;不追加第二份 business trace/outbox/report item | application/job service |
| `log_query_no_write_observability` | Step 15 query log rule | query 可写 completed/not-visible/degraded/stale log,但不写 trace/audit、stored result、projection/reference repair | query service |
| `log_runtime_config_fake_coverage` | Step 15 runtime/config/fake log cuts | config load/validation、runtime assembled/degraded/failed、fake fixture loaded、controlled outcome used 都有 safe log cut | runtime/fake test |
| `log_forbidden_material_negative_scan` | Step 15 log redaction | logs 不含 raw request/event/job body、secret、credential、RoleDefinition body、ProjectMember truth、memory text、archive package、adapter raw response | log scan |

### 6.5 Metric instrumentation test cuts

| 测试切口 | 对应契约 | 验证内容 | 建议测试类型 |
|---|---|---|---|
| `metric_protocol_family_coverage` | Step 15 metric cuts | command、query、consumer/callback、job、outbox publish、handoff delivery、projection/reference/reconciliation、runtime/config/adapter 都有 counter/histogram/gauge cut | instrumentation test |
| `metric_low_cardinality_labels` | Step 15 metric label rules | metric label 只使用 finite kind/state/result/error/source family/adapter kind;不使用 ref、request id、actor id、subject id、idempotency key、topic raw string、free text | metric label scan |
| `metric_no_truth_source` | Step 15 metric-only truth redline | 指标不能作为 accepted truth、audit、replay、delivery receipt、reconciliation evidence 唯一来源;必须有正式 refs/material | service + report assertion |
| `metric_duplicate_conflict_inflight` | Step 15 duplicate metrics | duplicate replay、same key different digest conflict、in-flight、stored missing/wrong-kind 有分类 metric,不暴露 raw key/digest | application instrumentation |
| `metric_runtime_adapter_state` | Step 15 runtime/adapter metrics | config validation state、runtime assembly state、adapter availability state、fake/disabled state 用有限 label/gauge 表达 | runtime instrumentation |
| `metric_no_secret_or_endpoint_label` | Step 15 redaction | endpoint URL、broker topic raw string、bucket/path、tenant route、secret ref target 不得作为 metric label | metric label scan |

### 6.6 Business trace / audit / report / marker test cuts

| 测试切口 | 对应契约 | 验证内容 | 建议测试类型 |
|---|---|---|---|
| `audit_accepted_truth_same_uow` | Step 15 business audit;Step 11 transaction | accepted command 同 UoW 写 truth、trace/audit、outbox/stale、stored result;runtime log 不能替代 business trace/audit/outbox | application service |
| `audit_query_no_business_write` | Step 15 query audit boundary | visible/not-visible/degraded/stale query 不 append trace/audit、不写 stored result、不 repair projection/reference | query service |
| `audit_rejected_failed_not_accepted_trace` | Step 15 failed path boundary | rejected、unsupported、not-visible、degraded、adapter failed、entry failure 不伪造成 accepted truth trace | application/entry |
| `audit_consumer_callback_marker_boundary` | Step 15 consumer/callback audit | consumer/callback 只在 Step 9 要求时写 marker/accepted trace、receipt/outbox/stale;unsupported/delayed/quarantined 不写 accepted marker | worker application |
| `audit_outbox_publish_marker_boundary` | Step 15 outbox audit | publish attempt success/failure 写 outbox state/job report marker;不回滚 truth,不创建 downstream consumed truth | job service |
| `audit_handoff_delivery_marker_boundary` | Step 15 handoff audit | Delivered 带 formal attempt + receipt;failed/cancelled/unsupported 带 safe issue marker;不保存 archive package/receipt body | job/callback service |
| `audit_projection_reference_report_no_truth_repair` | Step 15 maintenance audit | rebuild、refresh、reconciliation 只写 projection/reference/report/job report refs;不修 core identity truth | job service |
| `audit_stored_replay_refs_only` | Step 15 stored replay audit | stored result、receipt、job report 只保存 refs/kinds/issues/counts,不保存 raw body 或 adapter response | contract + repository fake |

### 6.7 Redaction / forbidden material test cuts

| 测试切口 | 对应契约 | 验证内容 | 建议测试类型 |
|---|---|---|---|
| `redaction_config_runtime_material` | Step 14/15 config redaction | raw config body、env raw value、secret、credential、endpoint URL、connection string、raw health response 不进入 log/metric/audit/report/stored material | redaction scan |
| `redaction_protocol_entry_material` | Step 15 entry redaction | API request body/header/token、worker event payload/broker headers/topic raw string、job raw CLI/env/input body 不进入 observability material | redaction scan |
| `redaction_resolver_external_body` | Step 14/15 resolver redaction | RoleDefinition/CapabilityDefinition body、ProjectMember truth、work body、memory text、embedding、artifact body、governance policy body 不落 observability/stored/report | adapter + scan |
| `redaction_publisher_handoff_material` | Step 15 publisher/handoff redaction | outbound payload body、broker response、bucket/path/raw endpoint、archive package、receipt body 不落 log/metric/audit/report/handoff/stored replay | job + scan |
| `redaction_diagnostic_material` | Step 15 diagnostic rule | stack trace、SQL、HTTP body、adapter response body、free-text secret 不进入 diagnostic;只保存 issue_ref/diagnostic_ref/category | error instrumentation |
| `redaction_fake_private_material` | Step 15 fake redaction | fixture raw body、private fake map、hidden lookup key、private sequence table 不进入 service result、log、metric、audit 或 report | fake runtime scan |
| `redaction_before_emission` | Step 15 enforcement rule | log/metric/audit/report emission 前先映射 safe refs/kinds;不得先输出后清洗 | instrumentation test |

### 6.8 Cross-boundary negative cuts

| 测试切口 | 对应契约 | 验证内容 | 建议测试类型 |
|---|---|---|---|
| `negative_config_cannot_change_invariants` | Step 14 redline | 配置不能改变 state matrix、query no-write、job no-repair、stored replay、terminal retry guard、body-free boundary | config validation test |
| `negative_runtime_health_not_adapter_success` | Step 14/15 runtime boundary | runtime assembled / adapter available 不能直接断言 resolver valid、publisher published、handoff delivered 或 business accepted | runtime + service |
| `negative_observability_not_business_audit` | Step 15 logs are not business audit | logs/metrics 不能替代 `IdentityTraceRecord`、`AuditTrail`、outbox、handoff marker、stored result、receipt 或 job report | service + scan |
| `negative_metric_high_cardinality` | Step 15 metric labels | ref/request/actor/subject/idempotency/topic/free text 不得作为 label;高基数定位走 log/audit refs | metric scan |
| `negative_fake_no_default_success` | Step 14/15 fake parity | fake/controlled/disabled 未配置 formal outcome 时不能默认 valid/published/delivered/completed | fake adapter test |
| `negative_observability_no_private_truth_source` | Step 15 fake/durable parity | 测试不得通过 private fake store/log text/metric value 断言业务真相;必须断言 formal state/outcome/report refs | infra test |

### 6.9 16.5 stop-review record

| 审查项 | 结论 | 说明 |
|---|---|---|
| 是否关闭 DDD-S16-OPEN-006 | 通过 | §6.2~§6.8 覆盖 config、runtime、adapter、fake、log、metric、business audit、redaction 和 cross-boundary negative cuts |
| 是否承接 Step 14 | 通过 | config ownership、runtime builder、adapter binding、fake/disabled、cross-repo dependency 和 redline validation 已入测试切口 |
| 是否承接 Step 15 | 通过 | log/metric/audit/report/handoff、runtime/config/adapter redaction、fake parity 已入测试切口 |
| 是否保持 Step 16 范围 | 通过 | 未分配 TC 编号、fixture、CI job、coverage threshold、evidence、alert、SLO、dashboard 或 runbook |
| 是否新增 schema / port / state / error / DTO | 未新增 | 只引用 Step 5~15 已闭合契约 |
| 是否修改正式 `03-详细设计.md` | 未修改 | 正式文档留 Step 19 装配 |
| 下一步 | 16.6 | cross-step closure / Step 17 handoff / 回填草稿 |

---

## 7. 16.6 cross-step closure / Step 17 handoff / 回填草稿

本批只做 Step 16 收口。它确认 16.0~16.5 是否完整承接 Step 5~15,列出 Step 17 implementation handoff 必须继承的内容,并给正式 `03-详细设计.md` 第 15 章留下回填草稿。本批不修改正式 `03-详细设计.md`,不写 `05-测试方案.md`、`06-验收标准.md` 或 `07-实施计划.md` 的具体 TC、suite、priority、fixture、CI、evidence 或 commit boundary。

### 7.1 当前批次状态

| 项 | 状态 |
|---|---|
| 当前批次 | 16.6 cross-step closure / Step 17 handoff / 回填草稿 |
| 当前结论 | Step 16 已完成;没有未闭合的 Step 16 blocker |
| 本批关闭事项 | DDD-S16-OPEN-007 |
| 本批边界 | 只做 cross-step closure、Step 17 handoff 和回填草稿;不修改正式 `03` |
| 下一步 | Step 17 implementation handoff |

### 7.2 Cross-step coverage audit

| 输入来源 | Step 16 覆盖位置 | 闭合结论 |
|---|---|---|
| Step 5 module contracts | §2.2 module test cuts | 七个 workspace crate 均有最小测试入口,并明确 API/worker/jobs 不绕过 application facade |
| Step 6 object contracts | §2.2、§2.4、§4.2~§4.8 | DTO/ref/view/receipt/event/job/error schema、domain factory、不变量、state transition、body-free object 均有测试切口 |
| Step 7 trait / port / adapter contracts | §2.2、§5.2~§5.7、§6.2~§6.3 | repository version/unique/UoW、idempotency/stored replay、fake/durable parity、adapter formal outcome 均有测试切口 |
| Step 8 protocol contracts | §2.4、§3.3、§3.5、§3.7、§3.9 | 6 Command、14 Query、5 Inbound/Callback、10 Outbound、6 Operations Job 均有正向和异常最小切口 |
| Step 9 function flows | §2.3~§3.9、§5.2、§5.6 | accepted/rejected/duplicate/query no-write/consumer/callback/job/publish/handoff/maintenance flow 均有 application-level cut |
| Step 10 state matrix | §4.2~§4.8 | 状态合法转换、非法转换、terminal guard、query no-write、job no-repair、fake parity 已覆盖 |
| Step 11 persistence / transaction | §5.2、§5.5~§5.7 | same-UoW、rollback/commit visibility、append-only、version conflict、stored replay、fake/durable parity 已覆盖 |
| Step 12 error / recovery | §5.3、§5.6~§5.7 | public rejection、degraded、unsupported、delayed/quarantined、retryable/terminal/manual recovery、forbidden body 已覆盖 |
| Step 13 concurrency / idempotency | §5.4~§5.7 | key/digest、same digest replay、different digest conflict、in-flight、commit unknown、reentry/terminal retry guard 已覆盖 |
| Step 14 config / external binding | §6.2~§6.3、§6.8 | config ownership、runtime builder、adapter binding、fake/disabled、cross-repo dependency、redline validation 已覆盖 |
| Step 15 observability / audit | §6.4~§6.8 | log、metric、business trace/audit/report/marker、runtime/config/adapter/fake redaction 和 forbidden material 已覆盖 |

### 7.3 Step 17 implementation handoff

Step 17 必须把下列内容转成 implementation handoff / phase / commit-boundary 审计项。Step 16 不定义 commit boundary,只给实施计划必须承接的测试切口主题。

| Handoff topic | Step 17 必须承接 | Step 17 不得改写 |
|---|---|---|
| module test ownership | 每个 crate 的 unit/service/repository/adapter/entry/job test ownership 和依赖边界 | 用跨层集成测试替代全部 module cut |
| command implementation cuts | 6 个 Command 的 accepted/rejected/duplicate/conflict 最小测试入口 | 增删 command surface 或改变 Step 9 flow |
| query no-write cuts | 14 个 Query 的 visibility-first、not-visible/degraded/missing/stale/no-write 切口 | query 自动 repair/rebuild/refresh |
| consumer/callback receipt cuts | 5 个 Inbound/Callback 的 typed receipt replay、unsupported/delayed/quarantined/noop 切口 | unsupported 写 accepted trace 或 duplicate 重跑 payload |
| outbound material cuts | 10 个 Outbound material 的 accepted-only、saved marker、body-free、publish failure isolation 切口 | publisher 从 current truth 重构 payload |
| operations job cuts | 6 个 Job 的 duplicate report replay、partial item refs、retryable/terminal failure、no truth repair 切口 | job 直接修 core identity truth |
| state machine cuts | Step 10 所有状态族的 legal/illegal/terminal/no-write/no-repair/fake parity 切口 | 新增全局状态机或用字符串/ref 推断状态 |
| transaction/error/concurrency cuts | same-UoW、rollback、commit unknown、stored replay missing、idempotency conflict、version/unique conflict、in-flight、reentry guard 切口 | 用 unique key 替代 replay 或 duplicate rerun |
| config/runtime/adapter cuts | config boundary、runtime assembled vs adapter healthy、disabled/fake no-success、non-core dependency guard 切口 | 配置改变 domain invariant 或绕过 facade |
| observability/redaction cuts | log/metric/audit/report/handoff、low-cardinality labels、forbidden body scan、fake private material scan 切口 | 用日志替代业务 trace/audit 或保留 raw body |
| formal test planning handoff | 把本 Step 的最小切口交给 `05/06/07` 后续复核,由后续文档分配 TC、priority、fixture、CI、evidence | 在 Step 16 中补正式测试方案细节 |

### 7.4 Step 16 completion review

| 审查项 | 结论 | 说明 |
|---|---|---|
| 是否完成 16.0 framework / input boundary | 通过 | §1 固定目标、输入、SOP 初答、分批计划和红线 |
| 是否完成 16.1 module and command cuts | 通过 | §2 覆盖七个 crate 和 6 个 Command |
| 是否完成 16.2 query / event / job cuts | 通过 | §3 覆盖 Query、Inbound/Callback、Outbound、Operations Job |
| 是否完成 16.3 state machine cuts | 通过 | §4 覆盖 Step 10 状态族和 cross-state negative cuts |
| 是否完成 16.4 transaction / error / idempotency / concurrency cuts | 通过 | §5 覆盖 Step 11~13 |
| 是否完成 16.5 config / runtime / adapter / observability / redaction cuts | 通过 | §6 覆盖 Step 14~15 |
| 是否关闭全部 DDD-S16-OPEN | 通过 | DDD-S16-OPEN-001~007 均已闭合 |
| 是否新增 schema / port / state / error / DTO | 未新增 | Step 16 全程只引用 Step 5~15 已闭合契约 |
| 是否写入正式 TC / fixture / CI / evidence | 未写入 | 测试方案细节留 `05/06/07` |
| 是否修改正式 `03-详细设计.md` | 未修改 | 正式文档留 Step 19 装配 |
| 是否可以进入 Step 17 | 可以 | 用户审核 Step 16 后进入 implementation handoff |

---

## 8. 回填草稿

正式 `03-详细设计.md` 第 15 章后续可按下列结构装配:

```md
## 15. 测试切口与最小验证清单

本章定义 L1-identity 的最小测试切口,用于指导后续测试方案、验收标准和实施计划复核。它不分配正式 TC 编号、优先级、fixture、CI job、coverage threshold、evidence 或执行排期。

### 15.1 Module and command test cuts

模块测试覆盖 `identity-contracts`、`identity-domain`、`identity-application`、`identity-infra`、`identity-api`、`identity-worker`、`identity-jobs` 七个 crate。Command 测试覆盖 `EstablishGlobalMember`、`UpdateGlobalLifecycleState`、`MaintainRoleCapabilitySummary`、`AppendCareerRecord`、`MaintainMemoryReference`、`PrepareTraceHandoff` 的 accepted、rejected、duplicate replay 和 conflict 分支。

### 15.2 Query, event, outbound material and job test cuts

Query 测试必须覆盖 visibility-first、not-visible、missing/empty、degraded/stale-visible 和 query no-write。Inbound Event / Callback 测试必须覆盖 typed receipt replay、unsupported、delayed、quarantined、noop 和 forbidden body。Outbound material 测试必须覆盖 accepted-only、saved payload marker、body-free payload 和 publish failure isolation。Operations Job 测试必须覆盖 duplicate report replay、partial failure、retryable/terminal outcome 和 no business truth repair。

### 15.3 State machine test cuts

状态机测试以 Step 10 的正式 enum、state value、transition matrix 和 cross-state audit 为唯一真相源。每个状态族至少覆盖合法转换、非法转换、terminal guard、owner boundary、query no-write、job no-repair、Published not consumed、Delivered requires receipt、duplicate no-rerun 和 fake/durable parity。

### 15.4 Transaction, error, idempotency and concurrency test cuts

事务与一致性测试必须覆盖 accepted same-UoW、rollback/commit visibility、stored replay save-before-complete、commit unknown、rollback failure、version/unique conflict、append-only、reference bundle version、projection rebuild race、outbox/handoff reentry 和 partial job report。错误与恢复测试必须覆盖 public rejection、degraded、unsupported、delayed/quarantined、retryable/terminal/manual recovery、stored replay missing/wrong-kind 和 forbidden body persistence attempt。

### 15.5 Config, runtime, adapter, observability and redaction test cuts

配置与 runtime 测试必须覆盖 raw config ownership、redline validation、profile/adapter compatibility、runtime builder order、runtime assembled vs adapter healthy、disabled/fake no-success 和 non-core dependency guard。观测与 redaction 测试必须覆盖 log/metric/audit/report/handoff cut points、low-cardinality metric labels、business audit not replaced by logs、query no-write observability、duplicate replay no business trace,以及 raw request/event/job/config/source/archive/receipt/adapter/fake private material 不落盘。

### 15.6 Step 17 handoff

实施计划必须承接本章所有最小切口,并在后续 `05-测试方案.md`、`06-验收标准.md` 和 `07-实施计划.md` 中再分配正式 TC、priority、fixture、CI、evidence 和 commit boundary。本章发现任何需要新增 schema、port、state、error、DTO、stored material、config binding 或 observability field 的测试需求时,必须回 Step 6~15 闭口,不能用测试补设计真相源。
```

---

## 9. 待确认事项

| 编号 | 事项 | 所属批次 | 当前处理 |
|---|---|---|---|
| DDD-S16-OPEN-001 | 模块测试切口是否覆盖七个 workspace crate 且不绕过依赖边界 | 16.1 | 已闭合 |
| DDD-S16-OPEN-002 | 6 个 Command 是否都有 accepted / rejected / duplicate / conflict 最小切口 | 16.1 | 已闭合 |
| DDD-S16-OPEN-003 | 14 个 Query、5 个 Inbound/Callback、10 个 Outbound、6 个 Job 是否都有正向和异常切口 | 16.2 | 已闭合 |
| DDD-S16-OPEN-004 | Step 10 所有状态机是否合法 / 非法 / terminal guard / no-write / no-repair 切口闭合 | 16.3 | 已闭合 |
| DDD-S16-OPEN-005 | transaction / error / idempotency / concurrency / replay / partial failure 切口是否闭合 | 16.4 | 已闭合 |
| DDD-S16-OPEN-006 | config / runtime / adapter / observability / redaction / forbidden body 切口是否闭合 | 16.5 | 已闭合 |
| DDD-S16-OPEN-007 | Step 17 handoff 和正式回填草稿是否闭合 | 16.6 | 已闭合 |

---

## 10. 进入下一步条件

进入 Step 17 前必须满足:

- 用户审核通过 Step 16。
- Step 17 只写 implementation handoff / 实施计划承接清单,不得提前修改正式 `03-详细设计.md`。
- Step 17 必须把 Step 16 的 module、protocol、state、transaction/error/idempotency/concurrency、config/runtime/adapter、observability/redaction 切口纳入实施计划复核输入。
- 后续 `05/06/07` 复核新版 `03` 时,才分配正式 TC、priority、fixture、CI、evidence、acceptance 和 commit boundary。
