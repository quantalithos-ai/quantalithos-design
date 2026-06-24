# Step 14. 定义配置引用与外部依赖绑定

> 对应 SOP: `standards/document/详细设计讨论流程_SOP.md` Step 14
> 回填章节: `projects/L3-method-library/03-详细设计.md` §13 配置引用与外部依赖绑定
> 创建日期: 2026-06-24
> 当前模式: full-restart / step14-config-dependencies
> 当前状态: in_progress
> 当前模块: `R14.14 禁止配置化边界与正式 §13 候选草稿停审:再写入`
> 当前门禁: `R14.14` completed_wait_user_confirm;Step 14 completed;等待确认进入 Step 15 `R15.1 开工与必读文档:先思考`

---

## 0. 文件重置记录

旧 `03_ddd_step_14_config_dependencies.md` 曾标记为 `[x] 已确认`,但其内容围绕旧 `MethodContent`、P0/P1 publish、snapshot、fingerprint、outbox relay、object storage、gateway header、governance validation 和旧 job/dry_run 口径展开。该 completed 状态和旧配置结论全部失效。

当前 Step 14 不继承旧 `MethodLibrarySettings`、旧 outbox lease、旧 snapshot schema、旧 fingerprint canonical schema、旧 object storage、旧 governance remote mode、旧 P1 plugin/cache/marketplace 配置项。旧内容只能作为 historical pollution 和差异审计输入,不得作为当前 L3-method-library 配置引用与外部依赖绑定的正向来源。

当前 Step 14 的唯一正向基线是:

- 当前 `00-需求文档.md`、`01-架构设计.md`、`02-概要设计.md`。
- 本轮 `03-详细设计` Step 1~13 中间产物。
- 特别是 Step 3/4 的跨仓与文件布局约束、Step 5/7 的 module / port / adapter 边界、Step 8/9 的 protocol / flow 绑定点、Step 10/11/12 的 runtime / persistence / recovery 口径、Step 13 的 retry / lock / lease config handoff。

---

## R14.1 开工与必读文档:先思考

### 1. 当前模块目标

`R14.1` 只思考 Step 14 的开工边界、必读文档、Step 13 handoff 承接、L1-governance Step 14 框架参考、旧 Step 14 污染隔离、配置 / 外部依赖绑定分批计划和 `R14.2` 写入边界。当前模块不写完整 config key 表、secret/topic/URL binding、runtime builder 算法、observability schema、test case schema 或正式 `03-详细设计.md`。

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm |
| 当前允许 | 思考必读文档、输入边界、Step 13 handoff、L1-governance 框架参考、旧材料隔离、Step 14 模块计划和 `R14.2` 写入边界。 |
| 当前禁止 | 写完整配置引用表、外部依赖绑定表、跨仓依赖绑定表、runtime builder 顺序、secret/topic/URL/env key、observability schema、test case schema、implementation code 或正式 `03-详细设计.md`。 |

### 2. Step 14 启动前必须承接

| 输入 | 必须承接的内容 | 禁止继承 / 禁止提前 |
|---|---|---|
| `project_execution_ledger.md` | 当前恢复点、单模块推进规则、Step 13 completed_wait_user_confirm_to_step14。 | 跳过 R14.1/R14.2 直接写完整配置表。 |
| `03_ddd_calibration_flow.md` | Step 13 completed、Step 14 wait_user_confirm_to_R14.1、Step 15+ blocked。 | 将 observability/test/implementation 内容提前写入 Step 14。 |
| `03_ddd_step_13_concurrency_idempotency.md` R13.16 | retry numeric policy、TTL、lease duration、runtime binding、target registry、adapter/publisher/handoff config handoff。 | 改写 Step 13 semantic retry/source/lease 规则。 |
| `03_ddd_step_12_errors_recovery.md` | unavailable/degraded/manual consistency/error recovery public surface。 | 用 config 改变错误恢复语义。 |
| `03_ddd_step_11_persistence_tx_consistency.md` | logical store、transaction、stored replay、checkpoint/report/outcome persistence 边界。 | 用 config 改变 transaction boundary 或 storage truth ownership。 |
| `03_ddd_step_10_state_machine.md` | runtime adapter availability、entry/job/outbound/handoff state owner。 | 把 config 字符串当 state truth 或 recovery marker。 |
| `03_ddd_step_09_function_flows.md` | Command / Query / Inbound / Outbound / Job flow 的 adapter 调用点和 config handoff 点。 | 为 flow 私加未闭口 dependency、topic 或 resolver。 |
| `03_ddd_step_08_protocol_contracts.md` | topic-neutral event key、command/query/job public shell、metadata boundary。 | 用 config 修改 public DTO/schema/event kind。 |
| `03_ddd_step_07_trait_port_adapter.md` | repository、resolver、publisher、handoff、runtime、clock/id、config-adjacent port。 | 新增未闭口 port 或让 application/domain 直接读 env/file。 |
| `03_ddd_step_06_object_contracts.md` | runtime config refs、adapter marker、safe issue marker、body-free object redline。 | 把 raw config、secret、URL、topic、SQL 或 external response body 写入对象。 |
| `03_ddd_step_03_runtime_constraints.md` / Step 4 | Rust workspace、本地 sibling dependency、crate/file responsibility。 | 把 runtime/event/handoff dependency 写成 Cargo path dependency。 |
| `standards/document/详细设计讨论流程_SOP.md` Step 14 | 配置引用、外部依赖绑定、跨仓依赖、fake/fixture/pause 选择八问。 | 只写 narrative,不形成可实现绑定表。 |
| `standards/document/详细设计书写规范.md` §5.13 | 必须输出配置引用表、外部依赖绑定表、跨仓 Rust 依赖绑定表。 | 把完整配置手册、profile/env/secret 数值提前落在 Step 14。 |
| `standards/document/设计真相源闭环与可落码性标准.md` | config binding 闭环、config enum / entry args、不得用 config 补 source/field/marker。 | 从 config、fake map、error text 或 route 补 schema/port/mapper/source。 |

### 3. Step 13 handoff 承接思考

| Step 13 handoff | Step 14 承接方式 | 当前 R14.1 裁决 |
|---|---|---|
| retry numeric policy | Step 14 只定义配置绑定点和读取模块;具体 attempts/backoff 数值可继续留给 `04-配置设计.md`。 | 后续必须写 retry config source boundary,不改变 retry semantic allowed source。 |
| TTL / retention | 定义 idempotency/result/report/checkpoint/issue retention 的配置归属和禁止影响 truth 的红线。 | TTL 不证明完成、回滚、checkpoint 或 replay validity。 |
| lease duration / renewal | 定义 worker/job/runtime lease config 只是 execution ownership 参数。 | lease 不能替代 checkpoint/version/stored surface。 |
| runtime binding | 定义 infra/runtime builder、api/worker/jobs entry 的配置读取和注入位置。 | domain/contracts 不读配置;application 只接收 typed params/ports。 |
| target registry | 定义 publisher/handoff/adapter target registry 的 config binding。 | target config 不得改变 event kind、payload schema、truth ownership。 |
| adapter / publisher / handoff config | 定义 resolver、publisher、handoff、external dependency 的 binding、disabled/degraded/unavailable 映射。 | 缺 formal adapter outcome/marker 时回设计补口。 |
| observability/test handoff | Step 14 不写 metric/log/span/test case schema。 | 仅记录 Step 15/16 handoff。 |

### 4. L1-governance Step 14 框架参考思考

L1-governance Step 14 的价值在组织框架和门禁深度,不是领域语义。L3-method-library 只参考其“目标 -> 输入 -> 分批 -> SOP 八问 -> 配置边界 -> 外部依赖 -> 跨仓依赖 -> runtime builder -> closure”的组织方式。

| L1 Step 14 框架点 | L3 采用方式 |
|---|---|
| 明确本 Step 不是完整配置手册 | L3 Step 14 只写代码绑定点,完整 profile/env/secret/value 留 `04-配置设计.md`。 |
| 分清 config owner 和读取模块 | L3 需明确 contracts/domain/application/infra/api/worker/jobs 的读取边界。 |
| 配置引用表与 external binding table 分开 | L3 后续分别写 config family、adapter/port binding、disabled/degraded/unavailable 映射。 |
| 跨仓 Rust 依赖表 | L3 必须区分唯一或有限 compile-time dependency、runtime/event/handoff/fake 协作。 |
| topic-neutral key 到 transport binding | L3 若有 outbound/event/handoff key,Step 14 只绑定 target/topic registry,不改 Step 8 protocol。 |
| runtime builder 顺序 | L3 需定义 config validate -> adapter availability -> port injection -> entry facade 的顺序。 |
| 禁止配置化边界 | L3 必须列出 config 不得改变 Definition / Use / graph / state / query no-write / body-free redline。 |

### 5. SOP 八问初步回答

| SOP 问题 | R14.1 初步回答 | 后续落点 |
|---|---|---|
| 哪些模块需要读取配置? | 预期只有 infra / api / worker / jobs entry 和 runtime builder 读取 raw/validated config;application 接收 typed settings/ports;domain/contracts 不读。 | R14.3/R14.4 |
| 配置项的类型、默认值和读取位置是什么? | 先按 config family 定义 typed binding point;默认值/具体 env/profile 数值留 `04-配置设计.md`,除非 Step 3~13 已要求 explicit no-default。 | R14.5/R14.6 |
| 哪些外部依赖需要通过 adapter 注入? | L0/core shared contracts、bus/event、identity/governance/process/work/runtime/observability/archive 等外部协作只能通过 port/adapter/event/handoff/fake 表达。 | R14.7/R14.8 |
| 外部依赖的超时、重试、降级策略是什么? | Step 14 定义 timeout/retry/degraded/unavailable 的 config binding 和 public mapping,不改 Step 12/13 的 recovery/retry source。 | R14.7/R14.8 |
| 哪些配置细节留给配置设计文档? | env key、profile merge、secret source、endpoint/topic concrete value、numeric retry/backoff/TTL、TLS、credential、health probe、deployment profile 留 `04`。 | R14.9/R14.10 |
| 哪些跨仓 Rust 编译期依赖需要 path dependency? | 必须回到 Step 3/4 裁决;预期只有正式允许的 shared contract/core crate 可 compile dependency,其他 sibling 不进 Cargo。 | R14.9/R14.10 |
| 哪些运行期/事件协作依赖通过 adapter/event/projection/fake 表达? | 所有非 compile dependency 的 sibling / external system 进入 adapter、event、handoff、API、fixture/fake 或 disabled/degraded surface。 | R14.7~R14.10 |
| 依赖仓库不存在时如何处理? | compile dependency 缺失则暂停;runtime/event/handoff 缺真实仓可用 fake/fixture,但若 typed contract/source 未闭口则暂停回设计。 | R14.9/R14.10 |

### 6. 旧 Step 14 污染隔离思考

| 旧内容 | 当前处理 |
|---|---|
| `MethodContent` / publish / snapshot / fingerprint | historical pollution;不得进入当前 L3-method-library 正向配置主线。 |
| old PostgreSQL / object storage / L0-bus / governance adapter 固定项 | 不继承;是否仍需要必须由当前 Step 6~13 的 port/flow/handoff 重新证明。 |
| old Gateway trusted header | 不继承;api/entry context 若需要,必须由当前 Step 8/9/12/13 重新闭口。 |
| old outbox relay lease/retry/job dry_run | 不继承字段名和默认值;只从 Step 13 handoff 重新收敛 retry/lease/checkpoint 边界。 |
| old P1 plugin/configuration/cache/marketplace | 默认作为 historical pollution;除非当前 00/01/02 或 Step 6~13 已保留为明确后续能力。 |
| old `MethodLibrarySettings` | 不继承 object name/fields;后续若定义 settings value 必须作为当前 Step 14 typed binding output。 |

### 7. Step 14 初步分批思考

| 模块 | 主题 | 初判边界 |
|---|---|---|
| R14.1/R14.2 | 开工与必读文档 | 写输入基线、旧材料隔离、SOP 八问、模块计划。 |
| R14.3/R14.4 | 配置边界与读取模块 | 定义 domain/contracts/application/infra/api/worker/jobs 的 config read boundary。 |
| R14.5/R14.6 | 配置引用 family 与 binding source | 写 config family、typed setting/value、default/no-default、`04` handoff;不写完整 env/profile。 |
| R14.7/R14.8 | 外部依赖 / adapter / runtime binding | 写 adapter binding、disabled/degraded/unavailable、publisher/handoff/target registry。 |
| R14.9/R14.10 | 跨仓依赖与 sibling repo 协作 | 写 compile/runtime/event/handoff/downstream/fake 表,缺仓处理。 |
| R14.11/R14.12 | runtime builder / entry binding 顺序 | 写 config load/validate/adapter availability/port injection/API-worker-job facade。 |
| R14.13/R14.14 | 禁止配置化边界与 closure | 写 forbidden configurable boundary、Step 15/16 handoff、正式 §13 candidate draft 和停审。 |

### 8. R14.2 写入边界思考

`R14.2` 只应把 R14.1 的开工思考落成可恢复台账,不得进入完整配置表:

1. 写 Step 14 必读文档表与读取状态。
2. 写输入基线与旧材料处理规则。
3. 写 Step 13 handoff 承接表。
4. 写 SOP 八问初步回答。
5. 写 Step 14 输出骨架、模块计划和 L1-governance 框架参考边界。
6. 写 `R14.3 配置边界与读取模块:先思考` 进入门禁。

### 9. R14.1 stop-review

| 检查项 | 结果 |
|---|---|
| 是否确认旧 Step 14 completed 作废 | pass |
| 是否只思考开工、必读文档、Step 13 handoff 和分批计划 | pass |
| 是否参考 L1-governance 框架但不复制领域语义 | pass |
| 是否明确不写完整 config key 表、secret/topic/URL binding、runtime builder 算法 | pass |
| 是否未修改正式 `03-详细设计.md` | pass |
| 是否未写 Step 15/16 内容、test schema 或 implementation code | pass |
| 是否形成 R14.2 写入边界 | pass |

next_allowed_action: 等待用户确认后进入 Step 14 `R14.2 开工与必读文档:再写入`;只允许写入 Step 14 必读文档表、读取状态、输入基线、旧材料处理规则、Step 13 handoff 承接、SOP 八问初步回答、输出骨架、模块计划、L1-governance 框架参考边界和 `R14.3` 进入门禁;不得直接修改正式 `03-详细设计.md`;不得写完整 config key 表、secret/topic/URL/env binding、runtime builder 顺序、observability schema、test case schema 或 implementation code。

---

## R14.2 开工与必读文档:再写入

### 1. 当前模块目标

`R14.2` 将 `R14.1` 的开工思考落成可恢复台账。当前模块只写入 Step 14 的必读文档表、读取状态、输入基线、旧材料处理规则、Step 13 handoff 承接、SOP 八问初步回答、输出骨架、模块计划、L1-governance 框架参考边界和 `R14.3` 进入门禁。

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm |
| 当前允许 | 写入 Step 14 开工材料、输入约束、分批框架和下一模块门禁。 |
| 当前禁止 | 修改正式 `03-详细设计.md`;写完整 config key 表、secret/topic/URL/env binding、runtime builder 顺序、observability schema、test case schema 或 implementation code。 |

### 2. 必读文档表与读取状态

| 输入 | 读取状态 | Step 14 用途 | 当前边界 |
|---|---|---|---|
| `project_execution_ledger.md` | 已读 | 确认当前恢复点、单模块推进、Step 14 R14.1 -> R14.2 门禁。 | 不凭对话记忆跳过台账。 |
| `03_ddd_calibration_flow.md` | 已读 | 确认 Step 14 in_progress、Step 15+ blocked、正式 `03-详细设计.md` 不直接修改。 | 不把 R14.2 扩成完整 Step 14。 |
| `03_ddd_step_14_config_dependencies.md` R14.1 | 已读 | 承接旧 Step 14 污染隔离、Step 13 handoff 和分批思考。 | 不继承旧 completed 状态。 |
| `03_ddd_step_13_concurrency_idempotency.md` R13.16 | 已读相关收口 | 承接 retry numeric policy、TTL、lease duration、runtime binding、target registry、adapter/publisher/handoff config handoff。 | 不改写 Step 13 semantic retry、lock、lease 规则。 |
| `03_ddd_step_12_errors_recovery.md` | 后续模块复读 | unavailable/degraded/manual consistency、adapter failure、missing source recovery surface。 | 不用 config 改 public recovery surface。 |
| `03_ddd_step_11_persistence_tx_consistency.md` | 后续模块复读 | logical store、transaction boundary、stored replay、checkpoint/report/outcome persistence。 | 不用 config 改 storage truth 或 transaction scope。 |
| `03_ddd_step_10_state_machine.md` | 后续模块复读 | runtime adapter availability、entry/job/outbound/handoff state owner。 | 不把 raw config 当 state truth。 |
| `03_ddd_step_09_function_flows.md` | 后续模块复读 | Command/Query/Inbound/Outbound/Job flow 的 config binding 点和 external adapter 调用点。 | 不为 flow 私加未闭口 dependency。 |
| `03_ddd_step_08_protocol_contracts.md` | 后续模块复读 | protocol shell、topic-neutral key、metadata、entry / job public surface。 | 不用 config 改 DTO/schema/event kind。 |
| `03_ddd_step_07_trait_port_adapter.md` | 后续模块复读 | repository、resolver、publisher、handoff、runtime、clock/id 和 config-adjacent port。 | 不新增未闭口 port。 |
| `03_ddd_step_06_object_contracts.md` | 后续模块复读 | runtime config refs、adapter marker、safe issue marker、body-free object redline。 | 不把 secret、URL、topic、SQL、external body 写入对象。 |
| `03_ddd_step_03_runtime_constraints.md` / Step 4 | 后续模块复读 | Rust workspace、本地 sibling dependency、file responsibility 和 crate boundary。 | runtime/event/handoff dependency 不写 Cargo path dependency。 |
| `00-需求文档.md` / `01-架构设计.md` / `02-概要设计.md` | 本轮权威输入 | 确认 L3-method-library 当前业务边界、外部协作和配置影响来源。 | 旧 publish/snapshot/fingerprint 主线不得复活。 |
| `standards/document/详细设计讨论流程_SOP.md` Step 14 | 已核对方向 | 提供配置引用、外部依赖、跨仓依赖、fake/fixture/pause 选择八问。 | 不写 narrative-only 结论。 |
| `standards/document/详细设计书写规范.md` §5.13 | 约束输入 | 要求配置引用表、外部依赖绑定表、跨仓 Rust 依赖绑定表。 | 不提前写完整配置手册。 |
| `standards/document/设计真相源闭环与可落码性标准.md` | 约束输入 | 确认 config binding 闭环、config enum/entry args、不得用 config 补 source/marker。 | 不从 config/fake/error/route 推正式 schema。 |
| `projects/L1-governance/design-calibration/03_ddd_step_14_config_external_binding.md` | framework_read | 参考 Step 14 组织深度、分批方式、配置边界、外部依赖表、跨仓依赖表、runtime builder 和 closure。 | 只参考框架,不得复制 governance 领域对象或配置项。 |

### 3. 输入基线与旧材料处理规则

| 输入族 | 当前处理 |
|---|---|
| 当前正式 `00/01/02` | Step 14 的业务边界、外部依赖边界和配置影响第一来源。 |
| 当前 Step 1~13 中间产物 | Step 14 的对象、port、protocol、flow、state、persistence、recovery、idempotency handoff 第一来源。 |
| 旧正式 `03-详细设计.md` | historical_material;只用于识别旧主线污染和旧章节结构,不得作为配置绑定结论来源。 |
| 旧 Step 14 completed 内容 | historical_pollution;旧 `MethodContent`、publish、snapshot、fingerprint、old outbox、old P1、old `MethodLibrarySettings` 全部失效。 |
| L1-governance Step 14 | framework_reference;只学习“目标 -> 输入 -> 分批 -> SOP 八问 -> 配置边界 -> 外部依赖 -> 跨仓依赖 -> runtime builder -> closure”的组织方式。 |
| 后续 `04-配置设计.md` | 只作为 handoff 目标;R14 不写完整 profile、env key、secret source、endpoint/topic value、TLS、credential、numeric retry/backoff/TTL。 |
| 后续 Step 15~16 | 只作为 handoff 目标;R14 不写 metric/log/span schema、test case ID、fixture 或 evidence artifact schema。 |

### 4. Step 13 handoff 承接表

| Step 13 handoff | R14.2 固定承接口径 | 后续落点 |
|---|---|---|
| retry numeric policy | Step 14 只定义 retry policy 的 config binding owner、读取模块和 forbidden substitution;具体 numeric values 留 `04`。 | R14.5/R14.6 |
| TTL / retention | retention/TTL 是 cleanup / availability policy,不是 truth proof;不得影响 stored replay validity。 | R14.5/R14.6 |
| lease duration / renewal | lease config 只绑定 runtime execution ownership,不替代 checkpoint/version/stored report。 | R14.5/R14.12 |
| runtime binding | infra/runtime builder 读取并验证 config,application/domain 不读 raw config。 | R14.3/R14.4、R14.11/R14.12 |
| target registry | publisher/handoff/adapter target registry 只绑定外部目标和 availability,不改变 protocol/event/payload。 | R14.7/R14.8 |
| adapter / publisher / handoff config | external dependency disabled/degraded/unavailable 必须映射到 Step 10~12 已有 safe marker / public surface。 | R14.7/R14.8 |
| observability / test handoff | Step 14 只声明后续承接,不写 schema。 | R14.13/R14.14 |

### 5. SOP 八问初步回答

| SOP 问题 | R14.2 初步回答 | 后续落点 |
|---|---|---|
| 哪些模块需要读取配置? | infra、api、worker、jobs entry 和 runtime builder 可以读取 raw/validated config;application 只接收 typed settings value 或 port;domain/contracts 不读配置。 | R14.3/R14.4 |
| 配置项的类型、默认值和读取位置是什么? | 后续按 config family 给出 type placeholder、读取模块、default/no-default 口径和 `04` handoff。当前不写完整 key 表。 | R14.5/R14.6 |
| 哪些外部依赖需要通过 adapter 注入? | 所有 runtime/event/handoff/downstream external dependency 通过 Step 7 port/adapter、Step 8 event、Step 9 flow 或 fake/fixture 注入。 | R14.7/R14.8 |
| 外部依赖的超时、重试、降级策略是什么? | Step 14 只定义 timeout/retry/degraded/unavailable config binding 与 safe mapping;不改变 Step 12/13 recovery/retry source。 | R14.7/R14.8 |
| 哪些配置细节应留给配置设计文档? | env var、profile merge、secret source、endpoint、topic concrete value、TLS、credential、timeout/backoff/TTL 数值、health probe 和 validation message。 | R14.5/R14.14 |
| 哪些跨仓 Rust 编译期依赖需要通过本地 path dependency 引入? | 以 Step 3/4 裁决为准;只有正式允许的 shared contract/core crate 可进入 Cargo path dependency。 | R14.9/R14.10 |
| 哪些运行期依赖或事件协作依赖需要通过 adapter / event / projection / fake 表达? | sibling runtime/event/handoff/downstream/system dependencies 不进 Cargo,通过 adapter/event/API/handoff/fake/fixture/disabled surface 表达。 | R14.9/R14.10 |
| 依赖仓库不存在时,当前实现应暂停、使用 fixture / fake,还是等待对应仓库完成? | compile dependency 缺失则暂停;runtime dependency 可用 fake/fixture,但若正式 typed contract/source/marker 未闭口则暂停回设计。 | R14.9/R14.10 |

### 6. Step 14 输出骨架

| 候选正式章节 | 内容边界 | 预计来源 |
|---|---|---|
| §13.1 scope and non-goals | Step 14 只定义代码绑定点,不替代 `04-配置设计.md`。 | R14.2/R14.4 |
| §13.2 config ownership and read boundary | contracts/domain/application/infra/api/worker/jobs 的读取边界和禁止配置化规则。 | R14.3/R14.4 |
| §13.3 config reference families | typed setting family、default/no-default、retention/TTL/retry/lease/target registry config handoff。 | R14.5/R14.6 |
| §13.4 external dependency binding | resolver/publisher/handoff/runtime/external dependency 的 port binding 和 disabled/degraded/unavailable 映射。 | R14.7/R14.8 |
| §13.5 cross-repo dependency binding | compile/runtime/event/handoff/downstream dependency 表和缺仓处理。 | R14.9/R14.10 |
| §13.6 runtime builder and entry binding | config load/validate、adapter availability、port injection、API/worker/job facade 顺序。 | R14.11/R14.12 |
| §13.7 forbidden configurable boundary | 不得通过 config 改 truth、state、query no-write、body-free、protocol schema 或 source。 | R14.13/R14.14 |
| §13.8 closure and handoff | Step 6~13 closure audit、Step 15/16/04/19 handoff。 | R14.13/R14.14 |

### 7. Step 14 模块计划

| 模块 | 主题 | 状态 |
|---|---|---|
| R14.1 | 开工与必读文档:先思考 | completed_wait_user_confirm |
| R14.2 | 开工与必读文档:再写入 | completed_wait_user_confirm |
| R14.3 | 配置边界与读取模块:先思考 | pending |
| R14.4 | 配置边界与读取模块:再写入 | pending |
| R14.5 | 配置引用 family 与 binding source:先思考 | pending |
| R14.6 | 配置引用 family 与 binding source:再写入 | pending |
| R14.7 | 外部依赖 / adapter / runtime binding:先思考 | pending |
| R14.8 | 外部依赖 / adapter / runtime binding:再写入 | pending |
| R14.9 | 跨仓依赖与 sibling repo 协作:先思考 | pending |
| R14.10 | 跨仓依赖与 sibling repo 协作:再写入 | pending |
| R14.11 | runtime builder / entry binding 顺序:先思考 | pending |
| R14.12 | runtime builder / entry binding 顺序:再写入 | pending |
| R14.13 | 禁止配置化边界与正式 §13 候选草稿停审:先思考 | pending |
| R14.14 | 禁止配置化边界与正式 §13 候选草稿停审:再写入 | pending |

### 8. L1-governance 框架参考边界

| 可参考 | 不可复制 |
|---|---|
| Step 14 先声明不是完整配置手册,只定义代码绑定点。 | governance 的 `GovernanceRuntimeConfig` 字段、adapter ref、topic key、external GRC 配置项。 |
| 先回答 SOP 八问,再分批写 config boundary、external dependency、cross-repo、runtime builder。 | governance 的 policy/gate/control/compliance/nonconformity 领域依赖。 |
| 配置引用表和外部依赖绑定表分离。 | governance 的 store/ref/publisher/handoff target 命名。 |
| 编译期依赖、运行期依赖、事件依赖、handoff/downstream 依赖分表。 | 将 governance 的唯一 core-contracts 裁决直接套给 L3,必须以 L3 Step 3/4 为准。 |
| 禁止配置化边界和 Step 15/16/04 handoff。 | 将 governance 已闭口项当成 L3 已闭口项。 |

### 9. R14.3 进入门禁

进入 `R14.3 配置边界与读取模块:先思考` 前必须满足:

- `R14.1` 和 `R14.2` 均为 completed_wait_user_confirm。
- 当前文件已记录 Step 14 必读文档、输入基线、旧材料隔离、Step 13 handoff、SOP 八问、输出骨架和模块计划。
- 正式 `03-详细设计.md` 未被修改。
- 旧 Step 14 的 `MethodLibrarySettings`、PostgreSQL/object storage/L0-bus/governance 固定项、old outbox lease、old snapshot/fingerprint、old P1 配置不得作为正向来源。
- `R14.3` 只允许思考配置 ownership、读取模块、raw config / validated config / typed settings 的边界和禁止配置化读取规则,不得写完整 config key 表或 external dependency binding table。

### 10. R14.2 stop-review

| 检查项 | 结果 |
|---|---|
| 是否写入必读文档表与读取状态 | pass |
| 是否写入输入基线和旧材料处理规则 | pass |
| 是否写入 Step 13 handoff 承接表 | pass |
| 是否写入 SOP 八问初步回答 | pass |
| 是否写入 Step 14 输出骨架与模块计划 | pass |
| 是否参考 L1-governance 框架但不复制领域语义 | pass |
| 是否未修改正式 `03-详细设计.md` | pass |
| 是否未写完整 config key 表、secret/topic/URL/env binding、runtime builder 顺序 | pass |
| 是否未写 observability/test schema 或 implementation code | pass |

next_allowed_action: 等待用户确认后进入 Step 14 `R14.3 配置边界与读取模块:先思考`;只允许思考配置 ownership、domain/contracts/application/infra/api/worker/jobs 的读取边界、raw config / validated config / typed settings 分层、禁止配置化边界和 `R14.4` 写入计划;不得直接修改正式 `03-详细设计.md`;不得写完整 config key 表、外部依赖绑定表、跨仓依赖表、runtime builder 顺序、observability schema、test case schema 或 implementation code。

---

## R14.3 配置边界与读取模块:先思考

### 1. 当前模块目标

`R14.3` 只思考配置 ownership、读取模块、raw config / validated config / typed settings 分层、禁止配置化边界和 `R14.4` 写入计划。当前模块不写完整 config key 表、外部依赖绑定表、跨仓依赖表、runtime builder 顺序、observability schema、test case schema 或正式 `03-详细设计.md`。

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm |
| 当前允许 | 思考 config ownership、模块读取边界、raw/validated/typed settings 分层、禁止配置化边界、watch/blocker 和 `R14.4` 写入计划。 |
| 当前禁止 | 写完整配置引用表、外部依赖绑定表、跨仓依赖表、runtime builder 顺序、secret/topic/URL/env key、observability schema、test case schema、implementation code 或正式 `03-详细设计.md`。 |

### 2. 配置 ownership 分层思考

Step 14 需要先把“谁拥有配置解释权”说清楚,否则后续 config key 表会把部署配置、domain invariant、public protocol 和 adapter runtime 混在一起。

| 层级 | ownership 思考 | 后续写入方向 |
|---|---|---|
| raw config source | env/file/profile/secret/config service 只属于 infra / entry 装配层输入。 | R14.4 写 raw config 只能由 loader/entry 读取,不得进入 domain/application object。 |
| validated config | 由 infra config loader / validator 将 raw config 转成 body-free validated refs、safe issues、adapter availability summary。 | R14.4 写 validated config 是 runtime assembly 输入,不是 public protocol。 |
| typed settings value | application 可接收无 secret、无 raw endpoint body 的 typed settings value 或 policy parameter。 | R14.4 写 application receives typed values only。 |
| port / adapter binding | external dependency 通过 Step 7 port 和 runtime adapter 注入。 | R14.4 写 application/domain 不构造 concrete adapter。 |
| domain invariant | domain invariant 来自对象、state、policy input,不是 config。 | R14.4 写 config 不得改变 truth/state/legal transition。 |
| public protocol | contracts DTO/schema/event kind 不由 config 修改。 | R14.4 写 config 只能绑定 route/target/topic transport,不能改 schema。 |

### 3. 模块读取边界思考

| 模块 | 当前判断 | 需要在 R14.4 固定的规则 |
|---|---|---|
| contracts | 不读取配置。 | 只定义 public DTO/ref/marker/schema;不得携带 runtime config loader 或 secret。 |
| domain | 不读取配置。 | domain factory / transition 只能接收 typed input,不得读取 env/file/feature flag/adapter status。 |
| application | 不直接读取 raw config。 | application service 接收 port trait、typed settings、policy value、clock/id port;不读取 env/file。 |
| infra | 可以读取/验证 raw config 并构造 adapter。 | infra/config 和 runtime builder 是 config ownership 主体;不得实现 domain invariant。 |
| api | 可以读取 entry boundary config。 | api 只处理 bind/body limit/header/context/route enablement 等 entry config;必须调用 application facade。 |
| worker | 可以读取 worker loop / consumer / publisher runner config。 | worker config 只能控制 batch/retry/lease/schedule/enablement;不得绕过 application/repository contract。 |
| jobs | 可以读取 job runner config。 | jobs config 只能控制 runner parameters and adapter availability;job body 仍按 Step 9/11/13 formal source。 |
| tests / fake runtime | 可以加载 fixture/profile。 | fake/profile 不得成为正式 source;缺 schema/port/marker 仍 blocker。 |

### 4. raw config / validated config / typed settings 分层思考

| 分层 | 可包含 | 不可包含 / 不可替代 |
|---|---|---|
| raw config | profile name、env/file values、secret refs、endpoint refs、transport topic refs、numeric policy values。 | public DTO、domain state、truth field、stored replay surface、checkpoint/report proof。 |
| validated config | body-free config ref、adapter slot ref、availability marker、redacted issue ref、safe target registry ref。 | raw secret、credential、URL body、topic secret、SQL/HTTP response body。 |
| typed settings | non-secret limit、timeout/retry policy handle、retention duration handle、feature enablement summary、safe adapter mode enum。 | raw config map、free-form stringly scope、unvalidated endpoint,domain truth override。 |
| runtime binding summary | assembled adapter availability and port injection status。 | proof that external dependency result is true,proof that job completed,proof that retry is safe。 |

### 5. 禁止配置化边界思考

R14.4 需要把禁止配置化边界写成明确表格,避免实现端通过 config 简化核心规则。

| 禁止项 | 原因 | 后续写入方向 |
|---|---|---|
| 通过 config 改 Definition / Use ownership | 会破坏当前 00/01/02 的数据归属。 | R14.4 写 config validation must reject。 |
| 通过 config 放宽 state transition | 会绕过 Step 10 状态矩阵。 | R14.4 写 domain state 不可配置化。 |
| 通过 config 让 Query 写 repair | 会破坏 Step 11/13 query no-write。 | R14.4 写 query no-write invariant。 |
| 通过 config 关闭 stored replay / idempotency | 会破坏 Step 13 duplicate no-rerun。 | R14.4 写 retention 可配, replay requirement 不可关。 |
| 通过 config 从 raw body 推 marker/source | 会破坏 Step 6~12 body-free/source closure。 | R14.4 写 missing marker/source is blocker。 |
| 通过 config 修改 event kind / DTO schema | 会破坏 Step 8 protocol truth。 | R14.4 写 topic binding 只映射 transport route。 |
| 通过 config 把 sibling runtime dependency 写成 Cargo path dependency | 会破坏 Step 3/4 dependency裁剪。 | R14.4 写 compile/runtime dependency 分离。 |
| 通过 fake profile 私补 mapper/port/schema | 会破坏 fake/durable 等价。 | R14.4 写 fake profile only supplies declared adapter behavior。 |

### 6. 当前 watch / blocker 思考

| ID | 主题 | 当前判断 | 处理 |
|---|---|---|---|
| ML-D03-S14-WATCH-001 | config ownership object name | watch | 是否命名为 `MethodLibraryRuntimeConfig` / `MethodLibrarySettings` 留 R14.5/R14.6,不能继承旧名。 |
| ML-D03-S14-WATCH-002 | application typed settings | watch | application 可接收 typed settings,但字段必须由后续 config family 闭口。 |
| ML-D03-S14-WATCH-003 | feature flags | watch | feature flag 只能控制 optional entry/adapter,不得改变 P0 truth/invariant。 |
| ML-D03-S14-WATCH-004 | fake profile | watch | fake profile 允许 adapter behavior fixture,不允许补 schema/source/marker。 |
| ML-D03-S14-BLOCK-001 | hard blocker | none_at_R14.3 | 当前模块未发现阻断 R14.4 的 hard blocker。 |

### 7. R14.4 写入计划思考

`R14.4` 应将本模块思考落成可审计表格,但仍不得进入完整 config key 表:

1. 写 config ownership layer table。
2. 写 module config read boundary table。
3. 写 raw config / validated config / typed settings separation table。
4. 写 application injection rules。
5. 写 forbidden configurable boundary table。
6. 写 watch / blocker closure 和 `R14.5 配置引用 family 与 binding source:先思考` 进入门禁。

### 8. R14.3 stop-review

| 检查项 | 结果 |
|---|---|
| 是否只思考配置 ownership 与读取模块边界 | pass |
| 是否覆盖 raw config / validated config / typed settings 分层 | pass |
| 是否覆盖 domain/contracts/application/infra/api/worker/jobs 边界 | pass |
| 是否覆盖禁止配置化边界 | pass |
| 是否未写完整 config key 表 | pass |
| 是否未写外部依赖绑定表、跨仓依赖表或 runtime builder 顺序 | pass |
| 是否未修改正式 `03-详细设计.md` | pass |
| 是否未写 observability/test schema 或 implementation code | pass |
| 是否形成 R14.4 写入计划 | pass |

next_allowed_action: 等待用户确认后进入 Step 14 `R14.4 配置边界与读取模块:再写入`;只允许写入 config ownership layer table、module config read boundary table、raw config / validated config / typed settings separation table、application injection rules、forbidden configurable boundary table、watch/blocker 和 `R14.5` 进入门禁;不得直接修改正式 `03-详细设计.md`;不得写完整 config key 表、外部依赖绑定表、跨仓依赖表、runtime builder 顺序、observability schema、test case schema 或 implementation code。

---

## R14.4 配置边界与读取模块:再写入

### 1. 当前模块目标

`R14.4` 将 `R14.3` 的配置 ownership 与读取模块边界思考落成可审计表格。当前模块只写 config ownership layer、module config read boundary、raw config / validated config / typed settings separation、application injection rules、forbidden configurable boundary、watch/blocker 和 `R14.5` 进入门禁;不写完整 config key 表、外部依赖绑定表、跨仓依赖表或 runtime builder 顺序。

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm |
| 当前允许 | 写入配置 ownership、读取模块、分层、application injection、禁止配置化边界和下一模块门禁。 |
| 当前禁止 | 修改正式 `03-详细设计.md`;写完整 config key 表、外部依赖绑定表、跨仓依赖表、runtime builder 顺序、observability schema、test case schema 或 implementation code。 |

### 2. config ownership layer table

| 层级 | owner | 可持有内容 | 不得持有 / 不得替代 |
|---|---|---|---|
| raw config source | infra / entry config loader | env/file/profile/config-service value、secret ref、endpoint ref、transport topic ref、numeric policy value。 | domain truth、public DTO、state transition、stored replay surface、checkpoint/report proof。 |
| config validation | infra config validator | body-free validated config ref、safe validation issue、adapter slot ref、redacted unavailable/degraded reason。 | raw secret、credential、URL body、topic secret、SQL/HTTP response body。 |
| typed settings value | application constructor input,由 infra 构造后注入 | non-secret limit、typed duration/retention policy、safe enum、feature enablement summary、adapter mode summary。 | raw config map、unvalidated string、secret,or external response body。 |
| port / adapter binding | infra runtime assembly | concrete repository/resolver/publisher/handoff/clock/id adapter behind Step 7 port。 | domain factory,public DTO schema,truth ownership or hidden side effect。 |
| domain invariant | domain object / state / policy method | typed business input,formal refs,formal markers,domain policy inputs。 | env/file/profile/feature flag/adapter availability。 |
| public protocol | contracts / api shell | public request/response/event/job DTO,metadata,safe marker refs。 | runtime config loader,secret,adapter credential,transport route。 |
| runtime entry | api / worker / jobs facade | validated entry boundary,route enablement,batch/lease/schedule runner params。 | repository-private workaround or direct truth mutation bypassing application。 |

### 3. module config read boundary table

| 模块 | raw config 读取 | validated config / typed settings 使用 | 允许行为 | 禁止行为 |
|---|---:|---|---|---|
| `contracts` | no | no | 定义 DTO/ref/marker/schema。 | 携带 runtime config、secret、endpoint、topic 或 loader。 |
| `domain` | no | no direct config | 接收显式 typed business input,执行 invariant/state transition。 | 读取 env/file/feature flag/adapter status;让 config 改 state matrix。 |
| `application` | no | yes,typed settings / port traits only | 通过 constructor 接收 typed settings、policy value、clock/id/repository/resolver/publisher ports。 | 读取 raw config;构造 concrete adapter;从 config 补 schema/source/marker。 |
| `infra` | yes | yes | 读取/验证 raw config,构造 adapter,产出 validated config ref、安全 issue、adapter availability。 | 实现 domain invariant;通过 config 改 truth ownership或 protocol schema。 |
| `api` | yes,entry boundary only | yes | 读取 bind/body limit/header/context/route enablement;注入 application facade。 | 绕过 application service 直接访问 repository;在 handler 中私造 source/marker。 |
| `worker` | yes,runner boundary only | yes | 读取 consumer/publisher loop、batch、retry、lease、schedule、enablement。 | 用 runner config 代替 receipt/outcome/checkpoint/stored surface。 |
| `jobs` | yes,runner boundary only | yes | 读取 job runner batch/retry/lease/schedule/target enablement。 | 用 job config 推导 target state、issue source、report body或 checkpoint。 |
| `tests / fake runtime` | yes,fixture/profile | yes | 提供 deterministic config profile和 declared fake adapter behavior。 | 用 fake private map 补正式 schema、port、mapper、marker 或 source。 |

### 4. raw config / validated config / typed settings separation table

| 分层 | 典型内容 | 进入代码位置 | 红线 |
|---|---|---|---|
| raw config | profile、env/file value、secret ref、endpoint ref、topic binding ref、numeric policy value。 | config loader / entry bootstrap only。 | 不进入 domain/application object;不写入 public DTO/audit/log body。 |
| validated config | config ref、adapter slot ref、validated target ref、redacted issue ref、adapter availability marker。 | infra runtime builder and adapter registry。 | 不包含 raw secret/URL/topic body;不作为 truth/result/checkpoint proof。 |
| typed settings | safe limit、typed duration handle、retry policy handle、feature summary、page bound、body limit。 | application/api/worker/jobs constructor parameter。 | 只可调度 behavior,不能改变 state matrix、source closure 或 protocol schema。 |
| adapter binding | concrete repository/resolver/publisher/handoff/clock/id implementation behind port。 | infra runtime assembly。 | adapter binding failure maps to safe unavailable/degraded surface,not private fallback。 |
| runtime binding summary | entry readiness、adapter availability、disabled/degraded/unavailable summary。 | runtime builder output / entry health gate。 | 不证明 external operation completed;不替代 stored replay/outcome/report。 |

### 5. application injection rules

| 注入对象 | 来源 | application 可依赖 | application 不可做 |
|---|---|---|---|
| repository / UoW ports | infra runtime assembly | 调用 Step 7 formal port。 | 选择 concrete storage backend or inspect config。 |
| resolver / publisher / handoff ports | infra runtime assembly | 按 Step 7/9 flow 调用 port and handle safe outcome。 | 从 endpoint/topic/adapter config 推断业务结论。 |
| typed settings value | config validator output | 使用 safe numeric/enum/policy value as boundary parameter。 | 保存 raw config,secret,URL,topic or use config to create source marker。 |
| clock / id port | infra runtime assembly | 获取 formal time/id through port。 | 直接读 system clock or random generator outside port。 |
| feature / capability summary | validated config or formal resolver summary | 判断 optional entry/adapter enabled when allowed。 | 关闭 P0 invariant,stored replay,query no-write,or required audit/outcome。 |
| runtime availability summary | runtime builder output | surface disabled/degraded/unavailable where Step 10~12 allow。 | 用 availability summary 代替 external result,checkpoint,report,or stored result。 |

### 6. forbidden configurable boundary table

| 禁止配置化项 | 原因 | 合法替代 |
|---|---|---|
| Definition / Use truth ownership | ownership 来自 00/01/02 和 Step 5~11,不是部署配置。 | 修改正式需求/架构/详细设计后再实现。 |
| domain state transition / invariant | Step 10 状态矩阵和 Step 6 domain object 是真相源。 | 通过正式 state/method 变更设计。 |
| Query no-write / no-repair | Step 11/13 已固定 query repeatability。 | projection/job repair 只能走正式 operations flow。 |
| stored replay / idempotency requirement | Step 13 duplicate no-rerun 依赖 stored surface。 | retention/cleanup 可配置,但未对账 surface 不得删除或跳过。 |
| body-free source / marker closure | Step 6~12 要求 marker/source 来自正式对象/port/mapper。 | 缺 source 时暂停回设计补口。 |
| public DTO / event kind / job schema | Step 8 protocol 是 public contract。 | config 只绑定 transport route或 enablement,不改 schema。 |
| repository logical store ownership | Step 11 定义 store/transaction owner。 | infra 可选择 adapter implementation,不可改变 logical ownership。 |
| runtime dependency as compile dependency | Step 3/4 裁剪 compile/runtime/event/handoff dependency。 | runtime依赖走 port/event/handoff/fake。 |
| fake profile private schema | fake/durable 必须等价。 | fixture 只能提供已声明 adapter outcome。 |
| observability/test evidence schema | 属 Step 15/16。 | 后续步骤正式定义。 |

### 7. watch / blocker closure

| ID | 主题 | R14.4 结果 | 后续 |
|---|---|---|---|
| ML-D03-S14-WATCH-001 | config ownership object name | watch_remains;R14.4 固定 ownership 分层,不裁定具体 settings struct 名。 | R14.5/R14.6 配置 family 时命名。 |
| ML-D03-S14-WATCH-002 | application typed settings | closed_semantic;application 只接收 typed settings/ports。 | R14.5/R14.6 写 settings family。 |
| ML-D03-S14-WATCH-003 | feature flags | closed_boundary;feature flags 不得改变 P0 truth/invariant。 | R14.5/R14.6 判断 optional feature family。 |
| ML-D03-S14-WATCH-004 | fake profile | closed_boundary;fake profile 只提供 declared adapter behavior。 | R14.9/R14.10 和后续 tests 继续承接。 |
| ML-D03-S14-BLOCK-001 | hard blocker | none_at_R14.4。 | 进入 R14.5。 |

### 8. R14.5 进入门禁

进入 `R14.5 配置引用 family 与 binding source:先思考` 前必须满足:

- `R14.3` 和 `R14.4` 均为 completed_wait_user_confirm。
- 当前文件已写入 config ownership layer、module config read boundary、raw config / validated config / typed settings separation、application injection rules、forbidden configurable boundary、watch/blocker 表。
- 正式 `03-详细设计.md` 未被修改。
- `R14.5` 只允许思考配置引用 family、typed binding source、default/no-default 口径、`04-配置设计.md` handoff 和 `R14.6` 写入计划。
- `R14.5` 不得写外部依赖绑定表、跨仓依赖表、runtime builder 顺序、observability schema、test case schema 或 implementation code。

### 9. R14.4 stop-review

| 检查项 | 结果 |
|---|---|
| 是否写入 config ownership layer table | pass |
| 是否写入 module config read boundary table | pass |
| 是否写入 raw config / validated config / typed settings separation table | pass |
| 是否写入 application injection rules | pass |
| 是否写入 forbidden configurable boundary table | pass |
| 是否写入 watch / blocker closure | pass |
| 是否未写完整 config key 表 | pass |
| 是否未写外部依赖绑定表、跨仓依赖表或 runtime builder 顺序 | pass |
| 是否未修改正式 `03-详细设计.md` | pass |
| 是否未写 observability/test schema 或 implementation code | pass |
| 是否形成 R14.5 进入门禁 | pass |

next_allowed_action: 等待用户确认后进入 Step 14 `R14.5 配置引用 family 与 binding source:先思考`;只允许思考配置引用 family、typed binding source、default/no-default 口径、`04-配置设计.md` handoff、watch/blocker 和 `R14.6` 写入计划;不得直接修改正式 `03-详细设计.md`;不得写外部依赖绑定表、跨仓依赖表、runtime builder 顺序、observability schema、test case schema 或 implementation code。

---

## R14.5 配置引用 family 与 binding source:先思考

### 1. 当前模块目标

`R14.5` 只思考配置引用 family、typed binding source、default/no-default 口径、`04-配置设计.md` handoff、watch/blocker 和 `R14.6` 写入计划。当前模块不写最终 config key 表、不写 env/profile/secret/topic/URL 名称、不写外部依赖绑定表、不写跨仓依赖表、不写 runtime builder 顺序、不写 observability/test schema,也不修改正式 `03-详细设计.md`。

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm |
| 当前允许 | 思考 config family 分组、typed settings 来源、默认值分类、配置设计 handoff、watch/blocker 和 R14.6 写入计划。 |
| 当前禁止 | 写最终配置引用表、具体 key/env/profile/secret/topic/URL、adapter binding table、cross-repo dependency table、runtime builder sequence、observability schema、test case schema、implementation code 或正式 `03-详细设计.md`。 |

### 2. 配置引用 family 候选思考

R14.6 应按“代码绑定 family”组织,而不是按部署文件章节或产品名称组织。family 名称应表达 typed setting 进入代码的位置和能力边界,具体 env key、配置文件路径、secret backend、transport topic 和产品选择留给 `04-配置设计.md`。

| family 候选 | 绑定意图 | 来源依据 | R14.6 写入注意 |
|---|---|---|---|
| runtime profile / config identity | 标识当前运行 profile、validated config ref、config issue ref。 | R14.4 ownership layer;Step 12 invalid config / dependency unavailable;Step 13 runtime guard。 | 只能是 entry/infra 装配身份,不得成为业务 truth。 |
| storage / logical store binding | 选择 truth/support/material/report/checkpoint store adapter slot。 | Step 7 repository family;Step 11 logical store / transaction boundary。 | 只绑定 adapter slot,不得改变 logical ownership、UoW 或 schema 语义。 |
| api / entry boundary | API bind、body/page limit、header/context extraction、route enablement。 | Step 8 protocol shell;Step 9 API facade flow;R14.4 api read boundary。 | 不从 route/header/raw body 推 formal source/marker。 |
| query / read material bounds | page bound、freshness policy handle、read resolver mode、degraded/unavailable behavior开关。 | Step 7 read resolver / material repository;Step 9 query flows;Step 12 degraded surface。 | 只能控制边界参数,不能让 Query 写 repair 或合成 marker。 |
| command / idempotency / replay retention | idempotency record retention、stored replay retention、duplicate guard cleanup policy。 | Step 11 stored replay;Step 13 duplicate no-rerun and TTL handoff。 | retention 可配置,stored replay requirement 不可关闭。 |
| worker / job runner policy | batch、schedule、runner enablement、lease duration、checkpoint retention policy handle。 | Step 7 maintenance/runtime ports;Step 9 job flows;Step 13 lease/checkpoint separation。 | lease/schedule 不能替代 checkpoint、report 或 version。 |
| outbound / handoff target registry | target registry ref、publisher/handoff enablement、safe disabled/unavailable classification。 | Step 7 publisher/handoff/target registry;Step 8 event/handoff shell;Step 12 post-commit no rollback。 | 只写 family,不写 topic/URL/secret 或外部 adapter binding table。 |
| adapter availability / capability mode | required/optional adapter slot、disabled/degraded/unavailable policy。 | Step 7 runtime assembly registry and availability port;Step 10 runtime state;Step 12 dependency unavailable。 | availability summary 只能复制正式 port outcome,不能从 raw error 推 marker。 |
| clock / id / deterministic support | clock/id generator adapter、test deterministic support。 | Step 7 Clock/Id family;Step 13 stable source and timestamp exclusion。 | time/id 必须通过 port,不能由 DB default、raw timestamp 或 random 现场生成。 |
| feature / optional capability enablement | optional feature、entry/worker/job capability enablement summary。 | R14.4 feature flag boundary;Step 5~9 capability flow。 | 不得关闭 P0 invariant、stored replay、query no-write、required audit/outcome。 |
| diagnostics / evidence handoff marker | config validation issue ref、safe diagnostic policy handoff。 | Step 12 safe error;Step 15 observability handoff;Step 16 test handoff。 | Step 14 只标 handoff,不写 metric/log/evidence schema。 |

### 3. typed binding source 思考

配置 family 的 typed value 不能凭实现侧 convenience 命名。R14.6 写入时,每个 family 至少要回指一个正式来源族,并说明 raw config 只能进入 infra/entry loader。

| 来源族 | 可作为 binding source 的内容 | 不可作为 source 的内容 |
|---|---|---|
| Step 6 object contracts | body-free runtime refs、safe marker refs、issue refs、state owner objects。 | raw secret、URL、topic、SQL、HTTP body、provider response body。 |
| Step 7 port / adapter family | repository/resolver/publisher/handoff/runtime/clock/id/availability port family。 | 未定义 port、adapter private map、fake-only method、concrete product API。 |
| Step 8 protocol contracts | command/query/event/job public shell、metadata boundary、topic-neutral key。 | config 改 DTO schema、event kind、job payload shape。 |
| Step 9 function flows | command/query/inbound/outbound/job flow 中已经出现的 adapter call point 和 precheck point。 | 为配置方便新增 flow 分支或绕过 application facade。 |
| Step 10 state machine | runtime/entry/outbound/job state owner and legal transitions。 | config string 直接成为 state truth or transition permission。 |
| Step 11 persistence / transaction | logical store、UoW、stored replay、checkpoint/report/outcome ownership。 | product table/index 反向新增业务 source。 |
| Step 12 errors / recovery | invalid config、dependency unavailable、degraded/manual/blocked surface。 | raw exception text、HTTP/SQL status、secret-bearing error body。 |
| Step 13 concurrency / idempotency | retry numeric policy handoff、TTL handoff、lease runtime-only handoff、target binding handoff。 | retry counter、lease token、queue offset、timestamp 当 checkpoint/version/proof。 |
| `04-配置设计.md` | env/profile/secret/value/default/validation detail 的未来承接文档。 | 反向改变 Step 6~13 已闭口的 source/marker/port/schema。 |

### 4. default / no-default 口径思考

R14.6 不应直接写具体数值,但必须先给默认值类别,避免后续 `04-配置设计.md` 或实现端把必填外部依赖隐式默认成 fake,或把 P0 invariant 配成可关闭。

| 类别 | 初步口径 | 适用 family 示例 | R14.6 注意 |
|---|---|---|---|
| explicit required / no default | 生产外部 endpoint、credential、secret source、durable target、transport topic、cross-system target identity 必须由配置设计明确。 | storage durable target、publisher/handoff target、external resolver target。 | Step 14 不写具体 key,但要标 no implicit default。 |
| local/test explicit profile default | local/test 可有 deterministic fake / in-memory profile,但必须显式选择或由测试 harness 声明。 | fake runtime、clock/id deterministic support、in-memory adapter。 | fake profile 只供应已声明 adapter behavior,不补 schema/source/marker。 |
| bounded safe default allowed | 非安全敏感且不会改变 truth 的 limit/batch/page/timeout 可由 `04` 给 conservative default。 | page limit、batch size、body limit、timeout handle。 | Step 14 只写 default category,不写数值。 |
| semantic default forbidden | P0 invariant、state transition、query no-write、stored replay、body-free/source closure 不允许被默认关闭。 | feature flag、idempotency/replay、query repair、domain invariant。 | 写成不可配置化边界,不是普通 default。 |
| disabled unless fully bound | optional outbound/handoff/external capability 可默认 disabled,启用时必须完整绑定 target/adapter/credential。 | optional publisher、handoff、downstream collaboration。 | disabled 不得伪装成功结果;只能返回 safe disabled/unavailable surface。 |
| handoff-only default | 观测、证据、配置 validation 文案、deployment profile merge 只做后续 handoff。 | diagnostics/evidence/observability family。 | 不在 R14.6 写 schema 或 artifact path。 |

### 5. `04-配置设计.md` handoff 思考

Step 14 的产物应足够让实现知道“哪个模块读取哪类 typed setting”,但不能替代配置设计。下列内容必须在 R14.6 标成 `04-配置设计.md` handoff:

| handoff 项 | Step 14 保留内容 | `04-配置设计.md` 应展开 |
|---|---|---|
| config file/profile shape | family、typed binding source、读取模块。 | 文件格式、profile merge、覆盖顺序、环境变量映射。 |
| secret / credential source | no raw secret in domain/application/public surface。 | secret provider、credential ref、redaction、rotation and validation detail。 |
| endpoint/topic/transport binding | topic-neutral key / target registry family。 | concrete URL、topic、queue、transport product、TLS。 |
| numeric policy | default category and binding family。 | attempts、backoff、timeout、TTL、retention、batch、lease duration 数值。 |
| validation and diagnostic text | safe issue ref / safe diagnostic boundary。 | validation error code/message、operator-facing wording、config examples。 |
| local/test profiles | fake/deterministic/in-memory allowed boundary。 | concrete test profile files、fixture names、profile loading order。 |
| deployment matrix | code binding slots and required/optional capability category。 | environment-specific target matrix、operator override、rollout profile。 |

### 6. watch / blocker 思考

| ID | 主题 | 当前判断 | 处理 |
|---|---|---|---|
| ML-D03-S14-WATCH-001 | config ownership object name | watch_remains | R14.6 可用 family-level typed settings 命名,但不得继承旧 `MethodLibrarySettings` 字段。 |
| ML-D03-S14-WATCH-005 | config family final names | watch | R14.6 需要把 candidate family 收敛成可回填 §13 的正式 family 表。 |
| ML-D03-S14-WATCH-006 | default/no-default 分类 | watch | R14.6 需要将 default category 写入每个 family,但不写具体数值。 |
| ML-D03-S14-WATCH-007 | `04-配置设计.md` handoff completeness | watch | R14.6 需要明确哪些细节后移到 04,避免实现端自行补 env/key/default。 |
| ML-D03-S14-BLOCK-002 | config-bound marker/source missing | none_at_R14.5 | 若后续 family 需要 marker/source 而 Step 6~13 没有正式来源,必须暂停回设计补口。 |

### 7. R14.6 写入计划思考

`R14.6` 应把本模块思考落成可审计表格,但仍不写外部依赖绑定表、跨仓依赖表或 runtime builder 顺序:

1. 写 config family table: family、typed binding owner、读取模块、source step、default category、`04` handoff。
2. 写 typed binding source table: raw config、validated config、typed settings、adapter binding summary 的来源和禁止事项。
3. 写 default / no-default policy table: required、local/test explicit、bounded safe、semantic forbidden、disabled-unless-bound。
4. 写 `04-配置设计.md` handoff table: file/env/profile/secret/endpoint/topic/numeric/validation/local-test/deployment matrix。
5. 写 config family watch/blocker closure。
6. 写 `R14.7 外部依赖 / adapter / runtime binding:先思考` 进入门禁。

### 8. R14.5 stop-review

| 检查项 | 结果 |
|---|---|
| 是否只思考配置引用 family 与 typed binding source | pass |
| 是否覆盖 default / no-default 口径 | pass |
| 是否覆盖 `04-配置设计.md` handoff | pass |
| 是否未写最终 config key/env/profile/secret/topic/URL 表 | pass |
| 是否未写外部依赖绑定表、跨仓依赖表或 runtime builder 顺序 | pass |
| 是否未修改正式 `03-详细设计.md` | pass |
| 是否未写 observability/test schema 或 implementation code | pass |
| 是否形成 R14.6 写入计划 | pass |

next_allowed_action: 等待用户确认后进入 Step 14 `R14.6 配置引用 family 与 binding source:再写入`;只允许写入 config family table、typed binding source table、default / no-default policy table、`04-配置设计.md` handoff table、watch/blocker closure 和 `R14.7` 进入门禁;不得直接修改正式 `03-详细设计.md`;不得写具体 env/profile/secret/topic/URL、外部依赖绑定表、跨仓依赖表、runtime builder 顺序、observability schema、test case schema 或 implementation code。

---

## R14.6 配置引用 family 与 binding source:再写入

### 1. 当前模块目标

`R14.6` 将 `R14.5` 的配置引用 family、typed binding source、default/no-default 口径和 `04-配置设计.md` handoff 思考落成可审计表格。当前模块仍只定义代码绑定点和配置设计承接,不写具体 env key、profile 文件、secret 名、endpoint、topic、URL、adapter 绑定矩阵、跨仓依赖表或 runtime builder 顺序。

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm |
| 当前允许 | 写入 config family table、typed binding source table、default/no-default policy table、`04-配置设计.md` handoff table、watch/blocker closure 和 R14.7 进入门禁。 |
| 当前禁止 | 修改正式 `03-详细设计.md`;写具体 env/profile/secret/topic/URL;写外部依赖绑定表、跨仓依赖表、runtime builder 顺序、observability schema、test case schema 或 implementation code。 |

### 2. config family table

下表中的 family label 是 Step 14 的代码绑定分组,不是配置文件 key,也不是必须直接落成同名 Rust struct。后续实现可按 crate / constructor 需要拆分 typed settings,但不得改变本表的读取边界、source 回指和默认值类别。

| config family | typed binding shell | 读取 / 注入模块 | source step | default category | `04-配置设计.md` handoff | redline |
|---|---|---|---|---|---|---|
| runtime profile / config identity | runtime profile ref、validated config ref、safe config issue ref | infra config loader;api/worker/jobs entry 只读 validated summary | R14.4;Step 12;Step 13 | local/test explicit profile default;production explicit required | profile shape、merge order、validation issue wording | 不成为业务 truth、state 或 marker 来源。 |
| storage / logical store binding | logical store adapter slot refs、store capability summary | infra runtime assembly 注入 Step 7 repository ports | Step 7;Step 11 | explicit required for durable;local/test explicit fake/in-memory | durable product、migration、connection secret、pool values | 不改变 logical ownership、UoW、transaction boundary 或 schema 语义。 |
| api / entry boundary | body limit、page limit、route enablement、context extraction policy handle | api entry;application 只接收 typed request/context | Step 8;Step 9;R14.4 | bounded safe default allowed for limits;semantic default forbidden for source | bind/listen、header mapping、body limit value、route profile | 不从 route/header/raw body 拼 formal source、subject 或 marker。 |
| query / read material bounds | page bound、freshness policy handle、read resolver mode summary | application query service receives typed value;infra resolves adapters | Step 7;Step 9;Step 12 | bounded safe default allowed;semantic default forbidden for repair | page/freshness values、read profile validation | 不允许 Query 写 repair、合成 degraded marker 或改 visibility/read source。 |
| command / idempotency / replay retention | idempotency retention handle、stored surface retention handle、cleanup policy summary | application command service receives typed policy;infra owns storage cleanup | Step 11;Step 13 | bounded safe default allowed for cleanup;semantic default forbidden for replay | retention values、cleanup cadence、storage retention profile | stored replay / no-rerun requirement 不可关闭。 |
| worker / job runner policy | batch bound、schedule handle、lease duration handle、checkpoint retention handle | worker/jobs entry and job runner;application receives typed run context | Step 7;Step 9;Step 11;Step 13 | bounded safe default allowed for batch;explicit required for production schedule where enabled | cron/schedule、batch、lease、checkpoint retention values | lease/schedule 不替代 checkpoint、report、version 或 stored result。 |
| outbound / handoff target registry | target registry ref、target enablement summary、safe disabled/unavailable classification | infra target registry;application publisher/handoff facade consumes safe summary | Step 7;Step 8;Step 9;Step 12;Step 13 | disabled unless fully bound | target names、transport topic/URL、credential、TLS | disabled/unavailable 不能伪装成功;不改 event/job/handoff schema。 |
| adapter availability / capability mode | required/optional slot summary、adapter availability marker、capability mode enum | infra runtime assembly;entry/application precheck consumes safe summary | Step 7;Step 10;Step 12;R14.4 | explicit required for required slots;disabled unless bound for optional slots | adapter product、health probe、timeout and availability validation | 不从 raw IO error、HTTP/SQL status 或 secret-bearing message 推 public marker。 |
| clock / id / deterministic support | clock adapter ref、id generator ref、deterministic test mode summary | infra assembly injects Step 7 clock/id ports | Step 7;Step 13 | local/test explicit deterministic default;production explicit required | time source、id algorithm、test fixture profile | 不用 DB default、raw timestamp、random call 或 retry counter 代替 formal time/id source。 |
| feature / optional capability enablement | feature/capability enablement summary | api/worker/jobs entry;application only where Step 9 permits optional branch | Step 5;Step 8;Step 9;R14.4 | disabled unless fully bound;semantic default forbidden for P0 invariant | feature profile、rollout matrix、required dependency validation | 不关闭 P0 truth、state transition、query no-write、stored replay 或 required audit/outcome。 |
| diagnostics / config evidence handoff | safe validation issue ref、diagnostic policy ref、evidence handoff marker | infra validation and later Step 15/16 handoff | Step 12;Step 15/16 handoff | handoff-only default | validation wording、metric/log/evidence artifact schema | R14 不定义 observability/test schema,不泄露 raw config or secret。 |

### 3. typed binding source table

| binding layer | formal source | may feed | forbidden source / forbidden use |
|---|---|---|---|
| raw config source | env/file/profile/secret/config-service values read by infra / entry loader only | config validator input | domain/application object、public DTO、audit body、raw secret in logs。 |
| validated config | infra validator output with body-free config ref、safe issue ref、adapter slot ref | runtime assembly,entry readiness,typed settings construction | truth proof、checkpoint proof、stored replay proof、safe marker synthesis。 |
| typed settings value | validator output projected into non-secret typed limit/policy/enum/capability summary | application/api/worker/jobs constructors | raw map、unvalidated string、secret、URL、topic body、product-specific handle。 |
| adapter binding summary | runtime assembly mapping validated slot to Step 7 port implementation | application port injection and runtime precheck | concrete adapter API leaking into domain/application flow。 |
| target registry summary | Step 7 target registry port output plus validated config slot | publisher/handoff facade target selection | topic/URL/credential becoming event kind、payload schema or business truth。 |
| availability summary | Step 7 runtime assembly / adapter availability port output | Step 10 runtime state and Step 12 unavailable/degraded surfaces | raw exception text,HTTP/SQL status,private health probe body as public marker。 |
| deterministic test profile | explicit local/test profile plus declared fake adapter behavior | tests and fake runtime only | fake-only schema,private map,hidden mapper,or missing marker/source补口。 |
| safe config issue / diagnostic ref | config validator and Step 12 safe error family | later Step 15/16 handoff | secret-bearing message、raw config dump、external response body。 |

### 4. default / no-default policy table

| policy category | applies to | Step 14 binding rule | `04-配置设计.md` responsibility | implementation redline |
|---|---|---|---|---|
| explicit required / no default | production durable stores、required endpoints、credentials、secret refs、required target identity | Step 14 marks required binding family only。 | concrete env/profile/secret/product/topic/URL。 | no hidden fake fallback in production path。 |
| local/test explicit profile default | in-memory store、fake adapters、deterministic clock/id、fixture target registry | must be explicit local/test profile or test harness declaration。 | local/test profile files and fixture naming。 | fake cannot provide missing schema/port/mapper/source。 |
| bounded safe default allowed | body/page/batch/timeout/retention bounds that do not change truth semantics | Step 14 records category,not numeric value。 | concrete safe value,validation range,error wording。 | default cannot disable invariant,stored replay,checkpoint,or no-write rule。 |
| semantic default forbidden | truth ownership、state transition、query no-write、stored replay、body-free marker/source closure | cannot be a configurable default。 | only document as non-configurable invariant if needed。 | implementation must pause on missing formal source instead of using config。 |
| disabled unless fully bound | optional outbound、handoff、external collaboration、feature/capability branch | default disabled is allowed only with safe disabled surface。 | enablement profile and complete dependency matrix。 | disabled branch cannot claim success,completion,publication or handoff delivery。 |
| handoff-only default | observability,config validation wording,evidence artifact shape,deployment matrix | Step 14 only records handoff target。 | metric/log/span/evidence schema and examples。 | R14 must not invent Step 15/16 schema。 |

### 5. `04-配置设计.md` handoff table

| handoff area | Step 14 delivers | `04-配置设计.md` must define |
|---|---|---|
| config structure | family labels、binding owner、reader module、source step、default category | file format、section names、profile merge order、override precedence。 |
| env / CLI / profile mapping | no concrete key;only family-to-reader boundary | env var names、CLI args、config file path、profile examples。 |
| secrets and credentials | no raw secret outside infra loader;redaction boundary | secret backend,credential refs,rotation,redaction,validation messages。 |
| endpoint / topic / transport | target registry and topic-neutral protocol boundary | concrete URL、topic/queue binding、transport product、TLS。 |
| numeric policy values | category for limit/retry/backoff/timeout/TTL/lease/batch | numeric values,validation ranges,operator defaults。 |
| local/test/fake profile | explicit profile requirement and fake/durable parity rule | fixture file names、deterministic seed/time/id policy、fake adapter declarations。 |
| disabled/degraded/unavailable config | safe classification must come from formal summary | how config validation reports disabled/unavailable targets safely。 |
| diagnostics/evidence | safe issue/diagnostic handoff only | metric/log/span/evidence artifact schema in Step 15/16-aligned config。 |

### 6. watch / blocker closure

| ID | 主题 | R14.6 结果 | 后续 |
|---|---|---|---|
| ML-D03-S14-WATCH-001 | config ownership object name | closed_at_family_level;不使用旧 `MethodLibrarySettings` 作为正向结论,本 Step 使用 family label 和 typed binding shell。 | 具体 Rust type/field 可在实施计划或 `04` 中按 family 映射,不得改变本表语义。 |
| ML-D03-S14-WATCH-005 | config family final names | closed_for_step14;family labels 已收敛为 runtime/storage/entry/query/replay/runner/target/availability/clock-feature/diagnostics。 | R14.13/R14.14 可装配到正式 §13 候选草稿。 |
| ML-D03-S14-WATCH-006 | default/no-default 分类 | closed_for_step14;每个 family 已有 default category。 | 具体数值和 key 留 `04-配置设计.md`。 |
| ML-D03-S14-WATCH-007 | `04-配置设计.md` handoff completeness | closed_for_step14;已列结构/env/secret/endpoint/topic/numeric/local-test/diagnostics handoff。 | Step 14 final closure audit 继续检查未越界。 |
| ML-D03-S14-BLOCK-002 | config-bound marker/source missing | none_at_R14.6。 | 若 R14.7/R14.8 发现 adapter binding 需要未定义 marker/source,必须暂停回设计闭口。 |

### 7. R14.7 进入门禁

进入 `R14.7 外部依赖 / adapter / runtime binding:先思考` 前必须满足:

- `R14.5` 和 `R14.6` 均为 completed_wait_user_confirm。
- 当前文件已写入 config family table、typed binding source table、default/no-default policy table、`04-配置设计.md` handoff table 和 watch/blocker closure。
- 正式 `03-详细设计.md` 未被修改。
- `R14.7` 只允许思考外部依赖 / adapter / runtime binding 的边界、Step 7 port 回指、disabled/degraded/unavailable 映射、target registry 与 `R14.8` 写入计划。
- `R14.7` 不得写跨仓依赖表、runtime builder 顺序、observability schema、test case schema、implementation code 或正式 `03-详细设计.md`。

### 8. R14.6 stop-review

| 检查项 | 结果 |
|---|---|
| 是否写入 config family table | pass |
| 是否写入 typed binding source table | pass |
| 是否写入 default / no-default policy table | pass |
| 是否写入 `04-配置设计.md` handoff table | pass |
| 是否写入 watch / blocker closure | pass |
| 是否未写具体 env/profile/secret/topic/URL | pass |
| 是否未写外部依赖绑定表、跨仓依赖表或 runtime builder 顺序 | pass |
| 是否未修改正式 `03-详细设计.md` | pass |
| 是否未写 observability/test schema 或 implementation code | pass |
| 是否形成 R14.7 进入门禁 | pass |

next_allowed_action: 等待用户确认后进入 Step 14 `R14.7 外部依赖 / adapter / runtime binding:先思考`;只允许思考外部依赖 / adapter / runtime binding 的边界、Step 7 port 回指、disabled/degraded/unavailable 映射、target registry、watch/blocker 和 `R14.8` 写入计划;不得直接修改正式 `03-详细设计.md`;不得写跨仓依赖表、runtime builder 顺序、observability schema、test case schema 或 implementation code。

---

## R14.7 外部依赖 / adapter / runtime binding:先思考

### 1. 当前模块目标

`R14.7` 只思考外部依赖 / adapter / runtime binding 的边界、Step 7 port 回指、disabled/degraded/unavailable 映射、target registry、watch/blocker 和 `R14.8` 写入计划。当前模块不写最终外部依赖绑定表、不写跨仓依赖表、不写 runtime builder 顺序、不写具体 endpoint/topic/secret/product,也不修改正式 `03-详细设计.md`。

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm |
| 当前允许 | 思考 external / adapter / runtime binding 分类、Step 7 port 回指、safe outcome / availability 映射、target registry 边界、watch/blocker 和 R14.8 写入计划。 |
| 当前禁止 | 写最终 external dependency binding table、cross-repo dependency table、runtime builder sequence、具体 URL/topic/credential/product、observability schema、test case schema、implementation code 或正式 `03-详细设计.md`。 |

### 2. binding 边界思考

外部依赖绑定不能以“产品/endpoint”为主轴,必须以 Step 7 已定义的 port family 和 Step 9 flow call point 为主轴。R14.8 需要写清“哪个外部能力通过哪个 port family 注入,失败时复制哪个 safe outcome / availability summary”,但仍不写具体 URL、topic、credential 或 transport product。

| binding 族 | 思考边界 | 正式来源 | R14.8 写入方向 |
|---|---|---|---|
| external body-free source adapter | typed external refs / artifact refs 解析为 body-free summary。 | Step 7 `ExternalBodyFreeSourceAdapterPort`;Step 9 Inbound / external summary flows;Step 12 body-free violation。 | 写 external source binding family,禁止 provider payload、archive body、URL/path truth。 |
| basis / availability / marketplace resolver | 解析 formalization basis、consumption availability、marketplace context。 | Step 7 resolver / builder family;Step 9 command/query/job flows;Step 12 unavailable/degraded。 | 写 resolver binding family,只返回 safe summary / unavailable marker。 |
| event candidate publisher | 将 stored candidate shell 发布到配置绑定 target。 | Step 7 publisher port;Step 8 event shell;Step 9 Outbound overlay;Step 13 post-commit no rollback。 | 写 publisher binding family,强调 publisher 不重读 current truth。 |
| collaboration handoff | 将 handoff-safe refs 交给协作目标,只返回 local safe outcome。 | Step 7 handoff port;Step 9 handoff/publication flows;Step 12 failed/unavailable mapping。 | 写 handoff binding family,禁止 external receipt/report/archive body 成为 local truth。 |
| target registry | 从 validated config 和 registry port 得到 enabled/disabled/blocked/unavailable target summary。 | Step 7 target registry port;R14.6 target registry config family。 | 写 target registry binding family,disabled 只能返回 safe disabled surface。 |
| runtime assembly registry | 暴露 validated runtime assembly summary 和 binding slot summary。 | Step 7 runtime assembly registry;R14.4 ownership;R14.6 runtime profile family。 | 写 runtime assembly binding family,不写 builder 顺序。 |
| adapter availability | required/optional slot precheck 与 degraded/unavailable summary。 | Step 7 adapter availability port;Step 10 runtime state;Step 12 dependency unavailable。 | 写 availability binding family,禁止 raw IO/HTTP/SQL text 分类。 |
| clock/id/runtime support | clock/id generator 和 deterministic local/test support。 | Step 7 Clock/Id;R14.6 clock/id family;Step 13 timestamp exclusion。 | 写 support binding family,不把 timestamp/random/retry count 当 formal source。 |

### 3. Step 7 port 回指思考

R14.8 应优先引用已完成 Step 7 的 port family,不得在 Step 14 新增业务 port 或用 config 补 port。若绑定时发现 Step 7 缺少正式 safe outcome / summary,应记录 blocker,不能由实现端私补。

| Step 7 family | R14.7 采用方式 | 禁止事项 |
|---|---|---|
| repository / UoW | 只作为 adapter injection 目标;store product binding 留 `04-配置设计.md`。 | 用 DB table/index/product 反向改变 repository contract。 |
| resolver / mapper / builder | 用于 basis、availability、read/degraded、distribution、discovery、marketplace context。 | 从 raw exception、provider body、route string 合成 decision/marker。 |
| inbound / publisher / handoff | 用于 external intake、event publication、collaboration handoff、target registry。 | 让 worker 直连 concrete adapter,或把 broker ack/receipt body 当 truth。 |
| jobs / maintenance / runtime | 用于 target planner、checkpoint/progress、runtime assembly、adapter availability。 | 用 scheduler lease、queue offset、health probe body 替代 checkpoint/report/availability marker。 |
| clock / id helper | 通过 formal port 注入。 | 直接读 system clock、random generator、DB default 或 retry counter。 |
| fake / durable parity | fake 与 durable 共享 port surface、identity、version、cursor、safe diagnostic。 | fake-only private map、string parsing、测试专用 source。 |

### 4. disabled / degraded / unavailable 映射思考

R14.8 需要把外部依赖状态映射到 Step 10~12 已有 public surface,但不重新定义错误模型。所有状态必须来自正式 registry / availability / safe outcome,不能来自 raw config 字符串或 adapter exception text。

| 外部绑定状态 | 合法来源 | public / flow 影响 | 禁止推断 |
|---|---|---|---|
| disabled | target registry 或 validated capability summary 明确标 disabled。 | optional capability 不执行;返回 safe disabled / unavailable surface where allowed。 | 用缺 endpoint、空 topic、feature flag 字符串自行推业务成功或忽略。 |
| blocked | target registry / runtime assembly summary 表示 precondition blocked。 | entry / worker / job precheck blocked;不进入业务写路径。 | handler / worker 直接绕过 application facade。 |
| degraded | availability/degraded mapper / resolver summary 提供 marker。 | Query/job/public surface copy marker;不得修复或补材料。 | 从 HTTP/SQL/raw error text 合成 degraded marker。 |
| unavailable | adapter availability / publisher/handoff outcome / resolver summary 提供 unavailable marker。 | 可按 Step 12/13 分类 retry_later or manual;不得 blind retry。 | 把 timeout、connection refused、queue ack 当 formal retryability。 |
| failed | publisher/handoff safe outcome 表示 failed。 | post-commit side effect failure 不回滚 truth;仅记录 safe outcome/hint。 | external receipt/report body 改写 local truth。 |
| missing formal source | Step 7/8/9/12 无对应 summary/marker/outcome。 | design blocker;暂停回设计闭口。 | config/fake/private map/string fallback。 |

### 5. target registry 思考

target registry 是外部 binding 的选择面,不是 transport owner、secret store 或业务 truth owner。R14.8 需要区分 target registry summary 与 concrete transport binding:前者属于 Step 14 code binding point,后者属于 `04-配置设计.md`。

| registry 维度 | R14.7 判断 | 后续写入 |
|---|---|---|
| target identity | 使用 body-free target ref / registry summary。 | R14.8 写 target identity family;`04` 写具体 name/topic/URL。 |
| target enablement | enabled/disabled/blocked/unavailable 必须来自 registry或validated config summary。 | R14.8 写 enablement mapping。 |
| target capability | event / handoff / external resolver / marketplace context 分能力表达。 | R14.8 写 capability-to-port binding。 |
| target credential | secret ref only in infra loader;不进入 public surface。 | R14.8 只写 redline;`04` 写 secret source。 |
| target outcome | publisher/handoff outcome 是 local safe outcome,不证明 external business state。 | R14.8 写 no-external-truth rule。 |

### 6. 当前 watch / blocker 思考

| ID | 主题 | 当前判断 | 处理 |
|---|---|---|---|
| ML-D03-S14-WATCH-008 | external binding family final table | watch | R14.8 需要把本模块思考落成 external/adapter/runtime binding table。 |
| ML-D03-S14-WATCH-009 | target registry vs transport binding | watch | R14.8 需明确 registry summary 属 Step 14,具体 topic/URL/secret 留 `04`。 |
| ML-D03-S14-WATCH-010 | safe outcome mapping | watch | R14.8 需列 disabled/degraded/unavailable/failed 与 Step 12/13 的关系。 |
| ML-D03-S14-BLOCK-003 | missing safe outcome / availability source | none_at_R14.7 | 若 R14.8 发现某 binding 只能靠 raw error/config/fake 推断,必须暂停回 Step 7/12 闭口。 |

### 7. R14.8 写入计划思考

`R14.8` 应把 R14.7 思考落成可审计表格,但仍不得进入跨仓依赖表或 runtime builder sequence:

1. 写 external / adapter / runtime binding table: binding family、Step 7 port、caller、infra owner、safe outcome、`04` handoff。
2. 写 disabled / degraded / unavailable / failed mapping table。
3. 写 target registry table: target identity、enablement、capability、credential redline、outcome redline。
4. 写 adapter redline table: no raw body、no raw error classification、no external truth proof、no fake-private fallback。
5. 写 watch / blocker closure 和 `R14.9 跨仓依赖与 sibling repo 协作:先思考` 进入门禁。

### 8. R14.7 stop-review

| 检查项 | 结果 |
|---|---|
| 是否只思考外部依赖 / adapter / runtime binding | pass |
| 是否回指 Step 7 port family | pass |
| 是否覆盖 disabled / degraded / unavailable 映射思考 | pass |
| 是否覆盖 target registry 边界 | pass |
| 是否未写最终 external binding table | pass |
| 是否未写跨仓依赖表或 runtime builder 顺序 | pass |
| 是否未修改正式 `03-详细设计.md` | pass |
| 是否未写 observability/test schema 或 implementation code | pass |
| 是否形成 R14.8 写入计划 | pass |

next_allowed_action: 等待用户确认后进入 Step 14 `R14.8 外部依赖 / adapter / runtime binding:再写入`;只允许写入 external / adapter / runtime binding table、disabled/degraded/unavailable/failed mapping table、target registry table、adapter redline table、watch/blocker closure 和 `R14.9` 进入门禁;不得直接修改正式 `03-详细设计.md`;不得写跨仓依赖表、runtime builder 顺序、observability schema、test case schema 或 implementation code。

---

## R14.8 外部依赖 / adapter / runtime binding:再写入

### 1. 当前模块目标

`R14.8` 将 `R14.7` 的外部依赖 / adapter / runtime binding 思考落成可审计表格。当前模块只写 binding family、Step 7 port 回指、safe outcome 映射、target registry 和 adapter redline,不写跨仓依赖表、不写 runtime builder 顺序、不写具体 endpoint/topic/secret/product、不修改正式 `03-详细设计.md`。

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm |
| 当前允许 | 写入 external / adapter / runtime binding table、disabled/degraded/unavailable/failed mapping table、target registry table、adapter redline table、watch/blocker closure 和 R14.9 进入门禁。 |
| 当前禁止 | 修改正式 `03-详细设计.md`;写跨仓依赖表、runtime builder 顺序、具体 URL/topic/credential/product、observability schema、test case schema 或 implementation code。 |

### 2. external / adapter / runtime binding table

| binding family | Step 7 port / family | caller | infra owner | safe outcome / summary | `04-配置设计.md` handoff | redline |
|---|---|---|---|---|---|---|
| external body-free source binding | `ExternalBodyFreeSourceAdapterPort`;external summary repository family | application / jobs service;inbound facade | infra external adapter | body-free resolution summary、unsupported / delayed / unavailable marker | external source product、artifact ref binding、credential and timeout | no provider payload、archive body、URL/path truth。 |
| basis resolver binding | basis resolver / policy diagnostic builder family | formalization command service / job service | infra resolver adapter | basis summary or unavailable diagnostic | upstream basis target、credential、retry/backoff value | no governance/external body;no local policy replacement。 |
| consumption availability binding | `MethodAssetConsumptionAvailabilityResolverPort` | query / refresh service | infra availability adapter | ready / stale / constrained / unavailable summary | downstream availability source and numeric policy | no downstream runtime truth stored as local truth。 |
| query read / degraded binding | read resolver / degraded mapper family | application query service | infra material/read adapter | read decision、degraded marker、safe diagnostic | read profile and freshness thresholds | no Query repair;no synthetic marker。 |
| marketplace context binding | `MarketplaceContextRefResolverPort` | discovery builder / peripheral service | infra marketplace adapter | body-free context ref or unavailable summary | marketplace target and credential | no transaction/install/fulfillment body。 |
| event publisher binding | `MethodAssetEventCandidatePublisherPort` | publisher facade / worker / jobs | infra publisher adapter | published / blocked / unavailable / failed safe outcome | transport topic/queue/product/TLS | publisher never rebuilds candidate from current truth。 |
| collaboration handoff binding | `MethodAssetCollaborationHandoffPort` | handoff facade / worker / jobs | infra handoff adapter | prepared / delivered / blocked / unavailable / failed local outcome | handoff target、credential、transport | external receipt/report/archive body never becomes local truth。 |
| target registry binding | `MethodAssetCollaborationTargetRegistryPort` | publisher / handoff / job service | infra target registry adapter | enabled / disabled / blocked / unavailable target summary | target names、capability matrix、secret refs | registry is not secret store or business truth owner。 |
| runtime assembly binding | `MethodAssetRuntimeAssemblyRegistryPort` | api / worker / jobs precheck | infra runtime assembly | validated assembly summary、binding slot summary、diagnostic policy | profile assembly,slot config,validation text | no builder sequence here;no raw config in application。 |
| adapter availability binding | `MethodAssetAdapterAvailabilityPort` | entry precheck / service precheck / job service | infra availability adapter | available / degraded / unavailable summary | health probe and timeout values | no raw IO/HTTP/SQL error classification。 |
| clock / id support binding | Clock / IdGenerator helper family | application services through ports | infra support adapter | formal time/id value through port | time source、id algorithm、test deterministic profile | no system clock/random/DB default bypass。 |

### 3. disabled / degraded / unavailable / failed mapping table

| state | formal source | allowed effect | retry / recovery relation | forbidden fallback |
|---|---|---|---|---|
| disabled | validated capability summary or target registry summary | optional path does not execute;public surface may show safe disabled/unavailable where Step 12 allows | not a failure;enablement requires complete config in `04` | silently treat as success,skip required P0 behavior,or fabricate result。 |
| blocked | runtime assembly / target registry precondition summary | entry / worker / job precheck blocks before business write | manual/operator action or config correction | bypass facade,call repository/adapter directly。 |
| degraded | resolver/degraded mapper/availability summary with marker | Query/job returns copy-only degraded surface | retry only if formal source says temporary;otherwise safe degraded/manual | build marker from error text、status code、fake enum。 |
| unavailable | adapter availability / resolver / publisher / handoff safe outcome | return unavailable / delayed / partial surface;post-commit no rollback | Step 12/13 retry_later only from formal outcome | blind retry from timeout,queue ack,connection error。 |
| failed | publisher/handoff safe outcome | record safe failed outcome or hint;accepted truth remains committed | post-commit retry from durable candidate/outcome only | rollback truth or use external receipt body as truth。 |
| missing formal source | absence of Step 7/8/9/12 outcome or marker | design blocker;pause and close source | no automatic recovery | config default、private map、string parsing、synthetic marker。 |

### 4. target registry table

| registry aspect | Step 14 binding rule | code consumer | `04-配置设计.md` handoff | redline |
|---|---|---|---|---|
| target identity | body-free target ref / registry summary only | publisher / handoff / jobs facade | concrete target names and transport mapping | target name is not event kind or business object id。 |
| target enablement | enabled / disabled / blocked / unavailable from registry or validated summary | entry precheck and application facade | feature/profile enablement matrix | missing config cannot mean published/delivered success。 |
| target capability | event, handoff, external resolver, marketplace context split by capability | flow-specific facade | capability-to-product matrix | one generic target cannot silently cover all capabilities。 |
| target credential | secret refs stay in infra loader / adapter | infra only | secret provider,credential refs,rotation | credential never enters DTO/log/audit/application object。 |
| target outcome | local safe outcome from publisher/handoff port | publication/handoff worker | outcome validation wording and retry policy values | external business state is not local truth。 |

### 5. adapter redline table

| redline | Applies to | Required action |
|---|---|---|
| no raw body | external source、handoff、marketplace、observability-adjacent adapters | Return typed refs、safe summary、marker、diagnostic only。 |
| no raw error classification | resolver、publisher、handoff、runtime availability | Adapter maps raw failure to formal safe outcome before application sees it。 |
| no external truth proof | publisher/handoff/external resolver | External ack/receipt/body only informs local safe outcome,not domain truth。 |
| no config-as-marker | runtime assembly、target registry、adapter availability | Config can bind slots and targets,not synthesize domain/read/recovery marker。 |
| no fake-private fallback | fake adapters and tests | Fake must share port surface and cannot fill missing schema/source/mapper/marker。 |
| no entry direct adapter call | api、worker、jobs | Entry uses application facade and runtime precheck only。 |
| no product-shaped contract | infra adapters | Product tables/topics/URLs do not define DTO,port,flow,state or persistence truth。 |

### 6. watch / blocker closure

| ID | 主题 | R14.8 结果 | 后续 |
|---|---|---|---|
| ML-D03-S14-WATCH-008 | external binding family final table | closed_for_step14;已写 external/source/resolver/publisher/handoff/target/runtime/availability/support binding table。 | R14.13/R14.14 装配正式 §13 候选草稿。 |
| ML-D03-S14-WATCH-009 | target registry vs transport binding | closed_for_step14;registry summary 属 Step 14,具体 topic/URL/secret/product 留 `04`。 | R14.9/R14.10 继续处理跨仓协作。 |
| ML-D03-S14-WATCH-010 | safe outcome mapping | closed_for_step14;disabled/degraded/unavailable/failed 已回指 Step 12/13。 | Step 15/16 后续覆盖观测和测试。 |
| ML-D03-S14-BLOCK-003 | missing safe outcome / availability source | none_at_R14.8。 | 若后续跨仓或 runtime builder 需要未定义 source,暂停回对应 Step。 |

### 7. R14.9 进入门禁

进入 `R14.9 跨仓依赖与 sibling repo 协作:先思考` 前必须满足:

- `R14.7` 和 `R14.8` 均为 completed_wait_user_confirm。
- 当前文件已写入 external / adapter / runtime binding table、disabled/degraded/unavailable/failed mapping table、target registry table、adapter redline table 和 watch/blocker closure。
- 正式 `03-详细设计.md` 未被修改。
- `R14.9` 只允许思考 compile-time dependency、runtime dependency、event/handoff/downstream collaboration、fake/fixture/pause 选择、缺仓处理和 `R14.10` 写入计划。
- `R14.9` 不得写 runtime builder 顺序、observability schema、test case schema、implementation code 或正式 `03-详细设计.md`。

### 8. R14.8 stop-review

| 检查项 | 结果 |
|---|---|
| 是否写入 external / adapter / runtime binding table | pass |
| 是否写入 disabled / degraded / unavailable / failed mapping table | pass |
| 是否写入 target registry table | pass |
| 是否写入 adapter redline table | pass |
| 是否写入 watch / blocker closure | pass |
| 是否未写跨仓依赖表 | pass |
| 是否未写 runtime builder 顺序 | pass |
| 是否未修改正式 `03-详细设计.md` | pass |
| 是否未写 observability/test schema 或 implementation code | pass |
| 是否形成 R14.9 进入门禁 | pass |

next_allowed_action: 等待用户确认后进入 Step 14 `R14.9 跨仓依赖与 sibling repo 协作:先思考`;只允许思考 compile-time dependency、runtime dependency、event/handoff/downstream collaboration、fake/fixture/pause 选择、缺仓处理、watch/blocker 和 `R14.10` 写入计划;不得直接修改正式 `03-详细设计.md`;不得写 runtime builder 顺序、observability schema、test case schema 或 implementation code。

---

## R14.9 跨仓依赖与 sibling repo 协作:先思考

### 1. 当前模块目标

`R14.9` 只思考 compile-time dependency、runtime dependency、event/handoff/downstream collaboration、fake/fixture/pause 选择、缺仓处理、watch/blocker 和 `R14.10` 写入计划。当前模块不写最终跨仓依赖绑定表、不写 runtime builder 顺序、不写配置 key、observability schema、test case schema 或正式 `03-详细设计.md`。

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm |
| 当前允许 | 思考 sibling repo 依赖类型、Cargo path dependency 限制、runtime / event / handoff / downstream 协作方式、fake/fixture/pause 选择和 R14.10 写入计划。 |
| 当前禁止 | 写最终跨仓 Rust 依赖绑定表、runtime builder sequence、具体 config key/env/topic/URL、observability schema、test case schema、implementation code 或正式 `03-详细设计.md`。 |

### 2. Step 3 / Step 4 约束承接思考

Step 3 与 Step 4 已把跨仓依赖裁剪固定为:只有 `quantalithos-core` / `core-contracts` 是 compile dependency candidate;`quantalithos-bus` 是 event collaboration;process、identity、runtime、member-images 等是 runtime consumption,不得因为本地存在 sibling repo 就写成 Cargo dependency。

| 前序结论 | R14.9 承接方式 | 禁止偏移 |
|---|---|---|
| `core-contracts` 是唯一 compile dependency candidate | R14.10 可写本地路径、Cargo 引用方式、使用位置和不可用时处理。 | 把 bus/process/identity/runtime/member-images 也写入 Cargo。 |
| `L0-bus` 是 event collaboration | R14.10 应写 event publisher / consumer / fake 协作方式。 | 固定具体 bus 产品、topic 或 relay 实现。 |
| process / identity / runtime / member-images 是 runtime consumption | R14.10 应写 API / adapter / safe summary / event / fake 方式。 | 复制对方 domain truth 或运行状态。 |
| external artifact / marketplace / console / SDK 是外围候选 | R14.10 应按 optional downstream / fake / pause 处理。 | 让外围能力成为 core closure 前置。 |
| runtime / event 依赖不得进 path dependency | R14.10 必须分表呈现。 | 用本地 sibling repo 存在性推翻依赖类型。 |

### 3. dependency category 思考

| category | L3 适用对象 | 设计表达 | 不可用时初判 |
|---|---|---|---|
| compile dependency | `quantalithos-core` / `core-contracts` only。 | Cargo local path dependency candidate;package / crate / path 必须来自真实布局。 | 缺失或路径不符时暂停依赖真实类型的实现。 |
| event collaboration | `quantalithos-bus`;外部摘要 / 下游回报 / outbound change awareness。 | Step 8 event shell + Step 7 publisher/consumer port + Step 14 target binding。 | P0 可 fake;正式 typed event schema 未闭合则暂停回设计。 |
| runtime consumption | process、identity、runtime、member-images、governance 等运行期协作。 | API/SDK/adapter/safe summary/fake;不得 Cargo 依赖。 | P0 fake/fixture;正式 typed summary/ref 缺口则暂停。 |
| handoff / downstream collaboration | marketplace、artifact/archive、console、SDK、observability-adjacent handoff。 | handoff port、target registry、public contracts/API consumption、fake。 | optional 默认 disabled;启用需完整 binding。 |
| external standard / artifact ref | 标准、ADR、artifact/archive/evidence 等正文外部来源。 | body-free ref / summary / marker only。 | 只可引用或 delayed/unavailable;不得保存正文。 |
| local fake / fixture | 未就绪 runtime/event/downstream 依赖的测试与 P0 支撑。 | declared fake adapter behavior and fixtures。 | fake 不可补正式 schema/port/source。 |

### 4. sibling repo 候选思考

| sibling / system | 当前依赖类型判断 | 协作方式思考 | R14.10 写入注意 |
|---|---|---|---|
| `quantalithos-core` | compile dependency candidate | `core-contracts` local path dependency。 | 写真实 path、Cargo 引用方式、使用位置、缺失暂停。 |
| `quantalithos-bus` | event collaboration | publisher / inbound event / fake publisher。 | 不进 Cargo;不写具体 topic/product。 |
| `quantalithos-process` | runtime consumption / downstream consumer | consumes method/process template semantics;may return impact summary。 | 不进 Cargo;不保存 process runtime truth。 |
| `quantalithos-identity` | runtime consumption / downstream consumer | typed role/member refs、safe identity summary。 | 不进 Cargo;不复制 identity truth。 |
| `quantalithos-runtime` | runtime consumption | runtime profile/run summary marker through adapter/fake。 | 不进 Cargo;不保存 execution truth。 |
| `quantalithos-member-images` | runtime consumption | Role -> image variant source through safe adapter or summary。 | 不进 Cargo;不得 hardcode role image mapping。 |
| `quantalithos-governance` | conditional runtime/event input | formalization basis / governance conclusion summary。 | 不进 Cargo;governance execution truth 不入本仓。 |
| `quantalithos-artifact` / archive | optional runtime / handoff / ref source | artifact/archive body-free ref only。 | 不进 Cargo;artifact body/lifecycle 不入本仓。 |
| `quantalithos-marketplace` | optional downstream / peripheral collaboration | package/distribution consumption;transaction outside。 | 默认 optional;交易/履约不入本仓。 |
| `quantalithos-sdk` / console | downstream client / management surface | consumes public API/contracts;no business truth ownership。 | 不作为 core closure 前置。 |

### 5. fake / fixture / pause 选择思考

| 情况 | 初判选择 | 理由 |
|---|---|---|
| `core-contracts` path 不存在或 package/crate 不符 | pause | compile dependency 缺失会影响类型真相,不能 fake。 |
| runtime sibling 仓不存在但本仓 Step 7 port / Step 8 schema / Step 9 flow 已闭口 | fake / fixture allowed | 可以用 declared fake adapter behavior 支撑 P0/test。 |
| runtime sibling typed summary / event schema 未闭口 | pause design | fake 不能补 schema / source / marker。 |
| optional downstream target 未配置 | disabled unless fully bound | 与 R14.6/R14.8 一致,不能伪装成功。 |
| external body/ref 需要 raw payload 才能实现 | pause design or reject body | 违反 body-free boundary。 |
| event bus 产品未定但 topic-neutral event shell 已闭口 | fake publisher allowed | transport binding 留 `04`,event schema 不依赖产品。 |
| downstream impact 回报机制未闭口 | watch / pause before implementation | 不得把一致性保护实现成私有同步机制。 |

### 6. 当前 watch / blocker 思考

| ID | 主题 | 当前判断 | 处理 |
|---|---|---|---|
| ML-D03-S14-WATCH-011 | `core-contracts` path and package | watch | R14.10 需写真实本地路径和 Cargo 引用方式,不在 R14.9 直接裁决实施配置。 |
| ML-D03-S14-WATCH-012 | runtime sibling collaboration | watch | R14.10 需把 process/identity/runtime/member-images/governance 等写成 adapter/event/fake。 |
| ML-D03-S14-WATCH-013 | optional downstream / peripheral dependency | watch | R14.10 需区分 marketplace/artifact/console/SDK 的 optional / disabled / fake 策略。 |
| ML-D03-S14-BLOCK-004 | compile dependency missing | none_at_R14.9 | 本模块未执行实现仓路径校验;R14.10 若要求真实 path 且缺失,记录 pause。 |
| ML-D03-S14-BLOCK-005 | missing typed runtime/event contract | none_at_R14.9 | 若后续需要未闭口 DTO/event/source/marker,暂停回对应 Step。 |

### 7. R14.10 写入计划思考

`R14.10` 应把 R14.9 思考落成可审计表格:

1. 写跨仓 Rust 编译期依赖绑定表: only `quantalithos-core` / `core-contracts`,本地路径、Cargo 引用方式、使用位置、不可用时处理。
2. 写 runtime / event / handoff / downstream collaboration table: sibling/system、依赖类型、协作方式、使用位置、不可用时处理。
3. 写 fake / fixture / pause decision table。
4. 写 body-free / no-source-dependency redline table。
5. 写 watch / blocker closure 和 `R14.11 runtime builder / entry binding 顺序:先思考` 进入门禁。

### 8. R14.9 stop-review

| 检查项 | 结果 |
|---|---|
| 是否只思考跨仓依赖与 sibling repo 协作 | pass |
| 是否继承 Step 3 / Step 4 compile/runtime/event 裁剪 | pass |
| 是否区分 compile dependency、runtime consumption、event/handoff/downstream collaboration | pass |
| 是否覆盖 fake / fixture / pause 选择 | pass |
| 是否未写最终跨仓依赖绑定表 | pass |
| 是否未写 runtime builder 顺序 | pass |
| 是否未修改正式 `03-详细设计.md` | pass |
| 是否未写 observability/test schema 或 implementation code | pass |
| 是否形成 R14.10 写入计划 | pass |

next_allowed_action: 等待用户确认后进入 Step 14 `R14.10 跨仓依赖与 sibling repo 协作:再写入`;只允许写入跨仓 Rust 编译期依赖绑定表、runtime/event/handoff/downstream collaboration table、fake/fixture/pause decision table、body-free/no-source-dependency redline table、watch/blocker closure 和 `R14.11` 进入门禁;不得直接修改正式 `03-详细设计.md`;不得写 runtime builder 顺序、observability schema、test case schema 或 implementation code。

---

## R14.10 跨仓依赖与 sibling repo 协作:再写入

### 1. 当前模块目标

`R14.10` 将 `R14.9` 的跨仓依赖与 sibling repo 协作思考落成可审计表格。当前模块只写 compile-time dependency、runtime/event/handoff/downstream collaboration、fake/fixture/pause 选择、body-free / no-source-dependency redline、watch/blocker closure 和 `R14.11` 进入门禁;不写 runtime builder sequence、不写具体 config key/env/topic/URL、不写 observability/test schema、不修改正式 `03-详细设计.md`。

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm |
| 当前允许 | 写入跨仓 Rust 编译期依赖绑定表、runtime/event/handoff/downstream collaboration table、fake/fixture/pause decision table、body-free/no-source-dependency redline table、watch/blocker closure 和 R14.11 进入门禁。 |
| 当前禁止 | 修改正式 `03-详细设计.md`;写 runtime builder sequence、具体 config key/env/topic/URL、observability schema、test case schema、implementation code 或 sibling implementation details。 |

### 2. 跨仓 Rust 编译期依赖绑定表

| dependency | 依赖类型 | verified local path | Cargo reference candidate | package / crate | 使用边界 | 不可用时处理 |
|---|---|---|---|---|---|---|
| `quantalithos-core` / `core-contracts` | compile dependency candidate | `/home/aris/Projects/quantalithos-core/crates/contracts` | `core-contracts = { path = "../quantalithos-core/crates/contracts" }` | package = `core-contracts`;lib crate = `core_contracts` | 仅用于当前 Step 3/4/5/6/7 已允许的 shared refs、shared contract shell、cross-layer typed boundary;不得引入 core runtime truth。 | 若 path/package/lib 不存在或不匹配,依赖 shared types 的实现必须暂停;不得以本仓私有 clone/fake 替代 compile type truth。 |

本表只确认 `core-contracts` 为 L3-method-library 当前唯一 Rust compile-time sibling dependency candidate。相对 path 以目标实现仓与 `quantalithos-core` 同级 checkout 为前提;若目标实现仓实际根路径不同,实施计划或 `04-配置设计.md` 只能调整 path 解析方式,不得扩大 Cargo dependency 集合。

### 3. runtime / event / handoff / downstream collaboration table

| sibling / system | 依赖类型 | 协作方式 | 使用位置 | 不可用时处理 | redline |
|---|---|---|---|---|---|
| `quantalithos-bus` | event collaboration | Step 8 topic-neutral event shell + Step 7 publisher / inbound consumer port + fake publisher。 | outbound change awareness、event publication、inbound event handling。 | transport product 未定时可 fake publisher;若 typed event schema 未闭口则暂停回 Step 8。 | 不进 Cargo;不固定 topic/product;不从 bus ack 推本仓 truth。 |
| `quantalithos-process` | runtime consumption / downstream consumer | adapter / API / safe summary / event consumption。 | process template consumption、method asset impact awareness、downstream read context。 | sibling 仓未就绪时可 declared fake/fixture;typed summary/source 缺口时暂停。 | 不进 Cargo;不保存 process runtime truth;不把 process execution result 当本仓 state。 |
| `quantalithos-identity` | runtime consumption / downstream consumer | typed member/role refs、safe identity summary、read adapter/fake。 | author/member/role/context 相关 safe source。 | 可 fake declared summary;缺 formal identity ref/source/marker 时暂停。 | 不进 Cargo;不复制 identity truth;不拼接 raw identity id。 |
| `quantalithos-runtime` | runtime consumption | runtime adapter / run profile summary / execution marker/fake。 | runtime binding、availability、job execution context。 | runtime target 可 disabled/unavailable/fake;缺 typed runtime summary 时暂停。 | 不进 Cargo;不保存 execution truth;不让 runtime config 改本仓 state transition。 |
| `quantalithos-member-images` | runtime consumption | image variant safe summary adapter or fixture。 | role/member image presentation or peripheral enrichment。 | optional disabled 或 fake;缺正式 source 时不启用。 | 不进 Cargo;不得 hardcode role-to-image mapping;image body 不入对象。 |
| `quantalithos-governance` | conditional runtime/event input | governance basis / conclusion safe summary adapter or event input。 | formalization basis、policy/basis evidence summary。 | 缺仓可 fake only if Step 7/8/9 source closed;缺 typed basis/conclusion 时暂停。 | 不进 Cargo;governance execution truth 不入本仓。 |
| `quantalithos-artifact` / archive | optional runtime / handoff / ref source | body-free artifact/archive refs、handoff target、safe archive summary。 | external reference、handoff closure、audit-adjacent safe ref。 | optional disabled;需要 raw body 时 pause/reject body。 | artifact body/lifecycle 不入本仓 truth;只存 refs/markers/summaries。 |
| `quantalithos-marketplace` | optional downstream / peripheral | marketplace context resolver / downstream client handoff。 | package/distribution/peripheral context。 | 默认 disabled unless fully bound;启用需 target registry 和 typed context。 | 不进 Cargo;交易、履约、结算不入本仓 core closure。 |
| `quantalithos-sdk` / console | downstream client / management surface | consumes public API/contracts;may provide operator input through entry boundary。 | API / management / debug surface consumer。 | 不作为 core closure blocker;缺失不影响本仓 P0。 | 不成为 source of truth;不绕过 command/query/job facade。 |

### 4. fake / fixture / pause decision table

| 情况 | 正式选择 | 适用范围 | 禁止事项 |
|---|---|---|---|
| `core-contracts` path/package/lib 缺失 | pause | 任何依赖 shared compile type truth 的实现。 | 本仓私造同名 crate、复制 type shell、fake compile dependency。 |
| runtime sibling 仓不存在但 Step 7/8/9 已闭口 | fake / fixture allowed | adapter、publisher、resolver、availability、handoff 的 declared fake behavior。 | fake 补 schema、source、marker、state transition 或 mapper。 |
| runtime/event typed contract 未闭口 | pause design | DTO、event shell、safe summary、source marker、public surface。 | 用 config、字符串、error text、private map 填空。 |
| optional downstream target 未配置 | disabled unless fully bound | marketplace、artifact/archive、console/SDK peripheral collaboration。 | 伪装 delivered/published/available 或影响 required P0 path。 |
| external body/payload 才能完成流程 | pause design or reject body | artifact、archive、handoff、marketplace、external resolver。 | 保存 raw body、凭 raw payload 推 truth/source/marker。 |
| event bus product 未定但 topic-neutral shell 已闭口 | fake publisher allowed | event publication/inbound simulation。 | 固定 transport topic/product 或把 bus ack 当成功 truth。 |
| downstream impact 回报机制未闭口 | watch / pause before implementation | downstream feedback、impact report、reconciliation input。 | 私有同步机制、扫描 sibling truth、从 downstream response 反推 local state。 |

### 5. body-free / no-source-dependency redline table

| redline | Applies to | Required rule |
|---|---|---|
| no runtime sibling Cargo dependency | bus、process、identity、runtime、member-images、governance、artifact、marketplace、SDK/console | 除 `core-contracts` 外,sibling 协作一律通过 port/event/API/handoff/fake 表达。 |
| no external/downstream truth storage | runtime、process、identity、governance、marketplace、artifact/archive | 本仓只保存自己的 truth、body-free ref、safe summary、local outcome 或 marker。 |
| no raw body / payload source | archive、handoff、marketplace、external resolver、event consumer | raw body 不进入 domain object、public DTO、state machine、persistence truth。 |
| no fake-private schema/source/marker | fake adapters、fixtures、tests | fake 必须共享正式 Step 7/8/9 surface;缺正式 source 就暂停。 |
| no local sibling existence override | all sibling repos | 本地目录存在只说明可协作,不改变依赖类型或模块边界。 |
| no config-derived formal source | config loader、target registry、runtime assembly | config 只能绑定 target/slot/value,不得生成 domain source、read marker、recovery marker。 |
| no product-shaped contract | bus/HTTP/DB/SDK/product adapter | 产品 topic、URL、table、receipt 不定义本仓 DTO、port、flow、state。 |

### 6. watch / blocker closure

| ID | 主题 | R14.10 结果 | 后续 |
|---|---|---|---|
| ML-D03-S14-WATCH-011 | `core-contracts` path and package | closed_for_step14;已核对 `/home/aris/Projects/quantalithos-core/crates/contracts/Cargo.toml`,package=`core-contracts`,lib crate=`core_contracts`,path=`src/lib.rs`。 | 实施计划可按目标实现仓实际根路径调整 relative path,不得扩大 compile dependency。 |
| ML-D03-S14-WATCH-012 | runtime sibling collaboration | closed_for_step14;已把 bus/process/identity/runtime/member-images/governance 写为 event/runtime adapter/fake/downstream collaboration。 | R14.11/R14.12 只处理 runtime builder/entry binding 顺序,不改依赖类型。 |
| ML-D03-S14-WATCH-013 | optional downstream / peripheral dependency | closed_for_step14;artifact/marketplace/SDK/console 默认 optional/disabled unless fully bound。 | `04-配置设计.md` 写具体 enablement/profile/target values。 |
| ML-D03-S14-BLOCK-004 | compile dependency missing | none_at_R14.10;当前 path/package/lib 已存在且匹配。 | 若目标实现仓 checkout 布局不同导致 path 不可解析,实施阶段暂停调整 path binding。 |
| ML-D03-S14-BLOCK-005 | missing typed runtime/event contract | none_at_R14.10;本模块未发现需新增 DTO/event/source/marker 的 immediate gap。 | 后续若 runtime builder 或 `04/05/07` 需要未闭口 typed source,暂停回对应 Step。 |

### 7. R14.11 进入门禁

进入 `R14.11 runtime builder / entry binding 顺序:先思考` 前必须满足:

- `R14.9` 和 `R14.10` 均为 completed_wait_user_confirm。
- 当前文件已写入跨仓 Rust 编译期依赖绑定表、runtime/event/handoff/downstream collaboration table、fake/fixture/pause decision table、body-free/no-source-dependency redline table 和 watch/blocker closure。
- 正式 `03-详细设计.md` 未被修改。
- `R14.11` 只允许思考 config load/validate、adapter availability、port injection、API/worker/jobs facade precheck、watch/blocker 和 `R14.12` 写入计划。
- `R14.11` 不得写 observability schema、test case schema、implementation code、正式 `03-详细设计.md` 或具体 config key/env/topic/URL。

### 8. R14.10 stop-review

| 检查项 | 结果 |
|---|---|
| 是否写入唯一 compile dependency candidate | pass |
| 是否核对 `core-contracts` 本地 path/package/lib | pass |
| 是否写入 runtime/event/handoff/downstream collaboration table | pass |
| 是否写入 fake / fixture / pause decision table | pass |
| 是否写入 body-free / no-source-dependency redline table | pass |
| 是否关闭 R14.9 watch/blocker | pass |
| 是否未写 runtime builder 顺序 | pass |
| 是否未修改正式 `03-详细设计.md` | pass |
| 是否未写 observability/test schema 或 implementation code | pass |
| 是否形成 R14.11 进入门禁 | pass |

next_allowed_action: 等待用户确认后进入 Step 14 `R14.11 runtime builder / entry binding 顺序:先思考`;只允许思考 config load/validate、adapter availability、port injection、API/worker/jobs facade precheck、watch/blocker 和 `R14.12` 写入计划;不得直接修改正式 `03-详细设计.md`;不得写 observability schema、test case schema、implementation code 或具体 config key/env/topic/URL。

---

## R14.11 runtime builder / entry binding 顺序:先思考

### 1. 当前模块目标

`R14.11` 只思考 runtime builder / entry binding 的装配顺序:config load/validate、adapter availability、port injection、API/worker/jobs facade precheck、watch/blocker 和 `R14.12` 写入计划。当前模块不写最终 runtime builder 顺序表、不写具体 config key/env/topic/URL、不写 observability/test schema、不写 implementation code、不修改正式 `03-详细设计.md`。

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm |
| 当前允许 | 思考 runtime builder 输入、validated config 到 adapter slot 的顺序、availability precheck、facade-only entry 和 R14.12 写入计划。 |
| 当前禁止 | 写最终 runtime builder sequence table、具体 config key/env/topic/URL、scheduler/queue lifecycle、observability schema、test case schema、implementation code 或正式 `03-详细设计.md`。 |

### 2. 前序约束承接思考

R14.12 的写入必须承接 R14.3~R14.10 已固定的分层,不能把 runtime builder 写成业务流程、配置手册或依赖注入实现细节。

| 前序结论 | R14.11 承接方式 | 禁止偏移 |
|---|---|---|
| contracts/domain 不读配置 | runtime builder 不影响 contracts/domain object 或 invariant。 | 在 domain factory / DTO 中读取 config。 |
| application 不读 raw config | application 只接收 typed settings、port bundle、safe runtime summary。 | application 解析 env/file/profile/secret/topic。 |
| infra owns raw config / validated config / adapter construction | runtime builder 属 infra 装配层,产出 validated assembly summary and port bindings。 | runtime builder 成为 business judgement owner。 |
| api/worker/jobs entry 可读 entry/runner boundary config | entry 只做 local context、runtime precheck、facade dispatch。 | entry 直连 repository、UoW、domain transition 或 concrete adapter。 |
| target registry / adapter availability 已有 binding family | builder 复制 registry / availability safe summary,不合成 marker。 | 从 raw IO/HTTP/SQL/config 字符串推 degraded/unavailable marker。 |
| 非 `core-contracts` sibling 不进 Cargo | runtime builder 只能绑定 adapter/target/fake,不能扩大 compile dependency。 | 用本地 sibling repo 存在性改变依赖类型。 |

### 3. runtime builder sequence 思考

R14.12 可以写顺序,但 R14.11 先只固定顺序原则:先验证 config,再形成 slot,再检查 adapter availability,再注入 port bundle,最后给 entry 暴露 body-free readiness summary。任何顺序都不能要求 entry 拿到 concrete adapter handle。

| phase 候选 | 输入 | 输出候选 | 停审条件 |
|---|---|---|---|
| load raw config | env/file/profile/config-service value、secret ref、endpoint ref、topic binding ref。 | raw config candidate,仅 infra 可见。 | 需要把 raw value 写入 DTO/domain/audit。 |
| validate config | raw config candidate、expected family、required/optional slot policy。 | validated config ref、safe config issue ref、validated target/slot ref。 | validation 需要业务 truth、external response body 或 public marker。 |
| resolve adapter slots | validated store/source/resolver/publisher/handoff/runtime slot refs。 | adapter slot summary、required/optional slot disposition。 | slot 解析要求 application/domain 读取 config。 |
| check availability | adapter availability port、runtime assembly registry、target registry summary。 | available/degraded/unavailable/disabled/blocked safe summary。 | 从 raw exception、HTTP/SQL code、secret-bearing message 分类。 |
| assemble port bundle | Step 7 application port family、fake/durable adapter implementation、typed settings。 | application service/facade callable port bundle and runtime binding summary。 | entry 获取 repository/UoW/concrete adapter direct handle。 |
| expose entry summary | entry-visible runtime assembly summary、availability summary、route/runner enablement。 | API/worker/jobs precheck outcome。 | summary 包含 secret、URL、topic concrete value、connection object。 |

### 4. API / worker / jobs facade precheck 思考

entry 层的核心规则不是“装配完成即可随意调用”,而是“只在 runtime precheck 允许时把 protocol shell 交给 application facade”。R14.12 需要把三类 entry 分开写清。

| entry family | precheck source | allowed dispatch | blocked / unavailable outcome | forbidden shortcut |
|---|---|---|---|---|
| API command/query entry | runtime assembly summary、adapter availability summary、route/context typed boundary。 | application command/query facade。 | safe rejection / unavailable / blocked entry response shell where Step 8/12 permits。 | handler 直接访问 repository/UoW/domain transition/resolver/publisher。 |
| worker inbound/publication entry | runtime assembly summary、inbound source/publisher target availability、worker context ref。 | application inbound consumer facade or event publication facade。 | delayed/unavailable/blocked worker result shell with copied marker。 | worker 解释 raw payload,保存 broker ack/offset as truth,直连 publisher/handoff adapter。 |
| jobs entry | runtime assembly summary、job runner profile summary、checkpoint/run/scope refs、required adapter availability。 | application job facade。 | blocked/unavailable/degraded job entry result or resume boundary。 | job runner 直接修 truth、扫 store、绕过 checkpoint/report/outcome port。 |

### 5. port injection 与 fake / durable 等价思考

R14.12 需要强调 port injection 是“把 Step 7 port implementation 放入 application facade 的构造边界”,不是把 infra 细节暴露给业务层。fake 和 durable 的差异只能在 adapter implementation behind port,不能改变 public contract。

| 注入对象 | R14.11 判断 | 等价要求 | 停审条件 |
|---|---|---|---|
| repository / UoW ports | 由 infra runtime assembly 绑定,application 通过 Step 7 port 调用。 | fake/durable 共享同一 port、version/cursor/UoW semantics。 | fake 用 private map 补正式 source 或跳过 version。 |
| resolver / mapper / builder ports | 由 port bundle 注入 application service。 | safe summary/marker 来源一致。 | durable/fake marker 来源不同或从 config 合成。 |
| publisher / handoff / target registry ports | 由 target registry 与 availability summary 控制可用性。 | outcome enum / safe marker 一致。 | fake 把 publish/handoff 伪装成 truth 成功。 |
| clock / id ports | deterministic profile 可绑定 fake implementation。 | 时间/id 经 port 进入,不直接读取 system clock/random。 | timestamp/random 被当 source、retry proof 或 marker。 |
| runtime availability ports | entry/service precheck 只能复制 summary。 | blocked/unavailable/degraded 表达一致。 | raw adapter error 进入 public response。 |

### 6. 当前 watch / blocker 思考

| ID | 主题 | 当前判断 | 处理 |
|---|---|---|---|
| ML-D03-S14-WATCH-014 | runtime builder phase final table | watch | R14.12 需要把 load/validate/slot/availability/injection/entry summary 写成最终顺序表。 |
| ML-D03-S14-WATCH-015 | entry facade-only closure | watch | R14.12 需要分别写 API/worker/jobs precheck and dispatch boundary。 |
| ML-D03-S14-WATCH-016 | fake/durable parity through runtime assembly | watch | R14.12 需要写 port injection 和 fake/durable 等价红线。 |
| ML-D03-S14-BLOCK-006 | missing runtime assembly / availability source | none_at_R14.11 | Step 7/10/13 已有 runtime assembly registry、adapter availability、entry facade-only 来源;若 R14.12 发现某 marker/source 只能靠 raw config/adapter error,必须暂停。 |

### 7. R14.12 写入计划思考

`R14.12` 应把 R14.11 思考落成可审计表格,但仍不写具体 config key/env/topic/URL、观测、测试或实现代码:

1. 写 runtime builder sequence table: raw config load、validation、slot resolution、availability check、port bundle assembly、entry-visible summary。
2. 写 entry binding / precheck table: API、worker、jobs 三类 entry 的 precheck source、allowed dispatch、blocked/unavailable outcome、forbidden shortcut。
3. 写 port injection table: repository/UoW、resolver/mapper/builder、publisher/handoff/target registry、clock/id、runtime availability。
4. 写 fake/durable parity and runtime summary redline table。
5. 写 watch/blocker closure 和 `R14.13 禁止配置化边界与正式 §13 候选草稿停审:先思考` 进入门禁。

### 8. R14.11 stop-review

| 检查项 | 结果 |
|---|---|
| 是否只思考 runtime builder / entry binding 顺序 | pass |
| 是否承接 R14.3~R14.10 的配置分层与依赖边界 | pass |
| 是否覆盖 config load/validate、adapter slot、availability、port injection、entry summary | pass |
| 是否覆盖 API / worker / jobs facade precheck | pass |
| 是否覆盖 fake / durable parity 思考 | pass |
| 是否未写最终 runtime builder sequence table | pass |
| 是否未写具体 config key/env/topic/URL | pass |
| 是否未修改正式 `03-详细设计.md` | pass |
| 是否未写 observability/test schema 或 implementation code | pass |
| 是否形成 R14.12 写入计划 | pass |

next_allowed_action: 等待用户确认后进入 Step 14 `R14.12 runtime builder / entry binding 顺序:再写入`;只允许写入 runtime builder sequence table、entry binding / precheck table、port injection table、fake/durable parity and runtime summary redline table、watch/blocker closure 和 `R14.13` 进入门禁;不得直接修改正式 `03-详细设计.md`;不得写具体 config key/env/topic/URL、observability schema、test case schema 或 implementation code。

---

## R14.12 runtime builder / entry binding 顺序:再写入

### 1. 当前模块目标

`R14.12` 将 `R14.11` 的 runtime builder / entry binding 思考落成可审计表格。当前模块只写 runtime builder sequence table、entry binding / precheck table、port injection table、fake/durable parity and runtime summary redline table、watch/blocker closure 和 `R14.13` 进入门禁;不写具体 config key/env/topic/URL、不写 observability/test schema、不写 implementation code、不修改正式 `03-详细设计.md`。

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm |
| 当前允许 | 写入 runtime builder sequence、entry precheck、port injection、fake/durable parity、runtime summary redline、watch/blocker closure 和 R14.13 进入门禁。 |
| 当前禁止 | 修改正式 `03-详细设计.md`;写具体 config key/env/topic/URL、scheduler/queue lifecycle、observability schema、test case schema、implementation code 或 product-specific binding。 |

### 2. runtime builder sequence table

| order | phase | owner | input | output | consumer | redline |
|---|---|---|---|---|---|---|
| 1 | load raw config | infra config loader / entry bootstrap | env/file/profile/config-service value、secret ref、endpoint ref、topic binding ref、numeric policy value。 | raw config candidate;infra-only and secret-bearing where applicable。 | config validator only。 | raw value 不进入 domain/application object、public DTO、audit/log body。 |
| 2 | validate config family | infra config validator | raw config candidate、R14.6 config family、required/optional slot policy、profile identity。 | validated config ref、safe config issue ref、validated slot/target refs、redacted diagnostic。 | runtime builder and entry readiness。 | validation 不读取业务 truth、不调用 external body、不生成 domain/read/recovery marker。 |
| 3 | resolve adapter slots | infra runtime builder | validated store/source/resolver/publisher/handoff/runtime/clock/id slot refs。 | adapter slot summary、required/optional slot disposition、disabled/blocked hint。 | adapter availability check and port bundle assembly。 | application/domain 不参与 slot 解析;slot 名称不是业务 state。 |
| 4 | check runtime / adapter availability | infra availability adapter behind Step 7 ports | adapter slot summary、target registry summary、runtime assembly registry、safe health summary。 | available/degraded/unavailable/disabled/blocked availability summary。 | entry precheck and application service precheck where Step 9 permits。 | 不从 raw exception、HTTP/SQL code、timeout string、secret-bearing message 分类 public marker。 |
| 5 | assemble application port bundle | infra runtime builder | Step 7 port implementation refs、typed settings、availability summary、target registry summary。 | application facade callable port bundle、runtime binding summary。 | api/worker/jobs entry and application facade constructors。 | entry 不获取 repository/UoW/concrete adapter handle;builder 不拥有业务 judgement。 |
| 6 | expose entry-visible runtime summary | infra runtime assembly registry | runtime binding summary、availability summary、route/runner enablement summary、safe issue refs。 | entry-visible runtime assembly summary and precheck disposition。 | API / worker / jobs entry。 | summary 不包含 secret、URL、topic concrete value、connection object、adapter instance。 |
| 7 | dispatch through facade | api / worker / jobs entry | protocol shell、entry context、runtime precheck outcome、application facade ref。 | facade dispatch ref or blocked/unavailable entry result。 | application service and protocol/result assembler。 | entry 不直连 repository、domain transition、resolver、publisher、handoff or scheduler product。 |

### 3. entry binding / precheck table

| entry family | runtime precheck source | typed input boundary | allowed dispatch | blocked / unavailable outcome | forbidden shortcut |
|---|---|---|---|---|---|
| API command entry | entry-visible runtime assembly summary、required adapter availability、route enablement、context extraction policy。 | command shell、typed actor/context refs、body-free request metadata。 | application command facade。 | safe rejection / unavailable / blocked response shell where Step 8/12 permits。 | handler 直连 repository、UoW、domain transition、resolver、publisher、handoff or concrete adapter。 |
| API query entry | entry-visible runtime assembly summary、query read availability、page/body limit typed setting。 | query shell、typed read context、safe pagination / scope refs。 | application query facade。 | safe not available / degraded / blocked query surface where Step 8/12 permits。 | query handler 写 repair、直读 material store、私造 read marker/source。 |
| worker inbound entry | runtime assembly summary、inbound source availability、worker context ref、stored result replay readiness。 | inbound shell、body-free source envelope summary、typed source/dedup refs。 | application inbound consumer facade。 | delayed/unavailable/blocked worker result shell with copied marker。 | worker 解释 raw payload、保存 broker ack/offset as truth、绕过 stored result seam。 |
| worker publication entry | runtime assembly summary、event candidate availability、target registry summary、publisher availability。 | event candidate refs、publisher binding summary、safe target refs。 | application publication facade or publisher port boundary already closed by Step 9。 | blocked/unavailable/failed publication worker result with safe outcome。 | worker 用 topic ack/receipt body 证明业务成功或回滚 accepted truth。 |
| jobs entry | runtime assembly summary、job runner profile summary、checkpoint/run/scope refs、required adapter availability。 | job shell、operation context、task/target/checkpoint refs。 | application job facade。 | blocked/unavailable/degraded job entry result or resume boundary。 | job runner 直接修 truth、扫 store、绕过 checkpoint/report/outcome port、持有 scheduler/queue truth。 |

### 4. port injection table

| injected family | injection owner | visible to application as | fake / durable parity rule | forbidden injection |
|---|---|---|---|---|
| repository / UoW ports | infra runtime builder | Step 7 repository / UoW port bundle。 | fake/durable 共享 version、cursor、transaction、logical ownership semantics。 | direct store handle、DB connection、private map、test-only mutation helper。 |
| resolver / mapper / builder ports | infra runtime builder | formal resolver / mapper / builder port bundle。 | safe summary、marker、diagnostic 来源一致;fake 只返回 declared formal output。 | marker from config、string parsing、raw body、error text。 |
| publisher / handoff ports | infra runtime builder + target registry | formal publisher / handoff port bundle and safe outcome surface。 | fake/durable 共享 publication/handoff outcome enum and retry/source semantics。 | topic/URL/product client exposed to application or entry。 |
| target registry port | infra target registry adapter | enabled/disabled/blocked/unavailable target summary。 | fake/durable 均不得把 missing target 伪装成 delivered/published。 | target name 变 event kind、business object id 或 truth proof。 |
| adapter availability port | infra availability adapter | available/degraded/unavailable/disabled/blocked summary。 | fake/durable 共享 safe marker/source contract。 | raw health payload、HTTP/SQL status、exception text exposed upstream。 |
| clock / id ports | infra support adapter | Clock / IdGenerator formal port。 | local/test deterministic profile allowed only through port。 | system clock/random direct call from domain/application/entry flow。 |
| typed settings values | infra validator / entry bootstrap | safe limits、duration handles、retry/retention policy handles、feature summary。 | fake/durable receive same typed shape;values change only execution policy,not semantics。 | config object with secrets,endpoint,topic,credential,raw profile body。 |

### 5. fake / durable parity and runtime summary redline table

| redline | Applies to | Required action |
|---|---|---|
| fake/durable same port surface | all injected ports | Test fake and durable adapter expose identical Step 7 port methods and safe outcomes。 |
| no fake source completion | fake adapters / fixtures | Fake may model declared availability/outcome only;missing schema/source/marker remains design blocker。 |
| no runtime summary as truth proof | runtime assembly / availability summary | Summary only gates entry or reports availability;it never proves business state,external completion,stored replay validity,or checkpoint completion。 |
| no secret-bearing summary | validated config、entry-visible runtime summary | Redact secret/URL/topic/credential/connection details before application/entry/public surface。 |
| no entry concrete handle | api、worker、jobs | Entry receives facade refs and body-free runtime summary,not concrete adapter/repository/UoW handles。 |
| no config-controlled invariant | runtime builder、feature enablement、typed settings | Config may disable optional capability or tune limits;it cannot change truth ownership、state matrix、DTO schema、query no-write、stored replay。 |
| no product lifecycle leakage | scheduler、queue、broker、HTTP/DB/product clients | Product lifecycle remains infra implementation detail;public/job/worker state uses formal local shells only。 |

### 6. watch / blocker closure

| ID | 主题 | R14.12 结果 | 后续 |
|---|---|---|---|
| ML-D03-S14-WATCH-014 | runtime builder phase final table | closed_for_step14;已写 load raw config -> validate -> resolve slots -> availability -> port bundle -> entry summary -> facade dispatch。 | R14.13/R14.14 装配正式 §13 候选草稿。 |
| ML-D03-S14-WATCH-015 | entry facade-only closure | closed_for_step14;已按 API command/query、worker inbound/publication、jobs entry 固定 precheck and allowed dispatch。 | Step 16 测试切口需覆盖 no direct shortcut。 |
| ML-D03-S14-WATCH-016 | fake/durable parity through runtime assembly | closed_for_step14;已写 port injection 和 parity redline。 | Step 17/07 实施计划需转成 boundary gate。 |
| ML-D03-S14-BLOCK-006 | missing runtime assembly / availability source | none_at_R14.12;当前可回指 Step 7 runtime assembly registry、adapter availability port、Step 10 runtime state、Step 13 guard。 | 若 R14.13 closure audit 发现配置化边界仍缺 source,暂停回对应 Step。 |

### 7. R14.13 进入门禁

进入 `R14.13 禁止配置化边界与正式 §13 候选草稿停审:先思考` 前必须满足:

- `R14.11` 和 `R14.12` 均为 completed_wait_user_confirm。
- 当前文件已写入 runtime builder sequence table、entry binding / precheck table、port injection table、fake/durable parity and runtime summary redline table 和 watch/blocker closure。
- 正式 `03-详细设计.md` 未被修改。
- `R14.13` 只允许思考 forbidden configurable boundary、Step 6~13 closure audit、`04/15/16/19` handoff、正式 §13 候选草稿结构和 `R14.14` 写入计划。
- `R14.13` 不得直接修改正式 `03-详细设计.md`;不得写 observability schema、test case schema、implementation code 或具体 config key/env/topic/URL。

### 8. R14.12 stop-review

| 检查项 | 结果 |
|---|---|
| 是否写入 runtime builder sequence table | pass |
| 是否写入 API / worker / jobs entry precheck table | pass |
| 是否写入 port injection table | pass |
| 是否写入 fake/durable parity and runtime summary redline | pass |
| 是否关闭 R14.11 watch/blocker | pass |
| 是否未写具体 config key/env/topic/URL | pass |
| 是否未修改正式 `03-详细设计.md` | pass |
| 是否未写 observability/test schema 或 implementation code | pass |
| 是否形成 R14.13 进入门禁 | pass |

next_allowed_action: 等待用户确认后进入 Step 14 `R14.13 禁止配置化边界与正式 §13 候选草稿停审:先思考`;只允许思考 forbidden configurable boundary、Step 6~13 closure audit、`04/15/16/19` handoff、正式 §13 候选草稿结构和 `R14.14` 写入计划;不得直接修改正式 `03-详细设计.md`;不得写 observability schema、test case schema、implementation code 或具体 config key/env/topic/URL。

---

## R14.13 禁止配置化边界与正式 §13 候选草稿停审:先思考

### 1. 当前模块目标

`R14.13` 只思考 Step 14 最后收口:forbidden configurable boundary、Step 6~13 closure audit、`04/15/16/19` handoff、正式 §13 候选草稿结构和 `R14.14` 写入计划。当前模块不写最终 §13 候选草稿正文、不修改正式 `03-详细设计.md`、不写具体 config key/env/topic/URL、不写 observability/test schema、不写 implementation code。

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm |
| 当前允许 | 思考禁止配置化边界、跨 Step 闭环审计、后续文档 handoff、正式 §13 候选草稿结构和 R14.14 写入计划。 |
| 当前禁止 | 写最终正式 §13 candidate draft、修改正式 `03-详细设计.md`、写具体 env/profile/secret/topic/URL、观测 schema、测试用例 schema、实现代码。 |

### 2. forbidden configurable boundary 思考

R14.14 需要把“config 可以绑定什么”和“config 永远不能决定什么”分开写。配置只能调装配、target、adapter、limit、profile、retry/retention numeric policy,不能成为业务真相、状态主语、source、marker、schema 或测试证据。

| 禁止配置化对象 | 为什么禁止 | R14.14 写入方向 |
|---|---|---|
| Definition / Use truth ownership | 这是 00/01/02 和 Step 5/6/11 的数据归属。 | config 不得改变 truth owner、logical store owner 或 aggregate boundary。 |
| domain state transition | Step 10 state matrix 是正式状态机。 | feature flag / profile 不得放宽、跳过或新增状态转换。 |
| Query no-write | Step 9/11/13 已固定 query repeatability and no-write。 | config 不得开启 query repair、read-time backfill 或 hidden write。 |
| stored replay / idempotency | Step 13 已固定 duplicate replay and no rerun。 | retention 可配置,但 replay requirement 不可关闭。 |
| public DTO / event / job schema | Step 8 是协议真相源。 | topic、route、transport binding 不能改变 DTO/event/job kind/schema。 |
| source / marker / mapper closure | Step 6~12 已要求 marker/source 来自正式对象/port/summary。 | config、fake、raw error、route/header 不得合成 source/marker。 |
| persistence / transaction boundary | Step 11 固定 logical store、UoW、transaction and outbox-like outcome boundary。 | config 只能选 adapter slot,不能改事务语义或 logical ownership。 |
| external truth proof | Step 12/13 固定 external side effect no rollback and safe outcome。 | receipt/ack/body/health probe/config success 不证明业务 truth。 |
| compile/runtime dependency type | Step 3/4/14 已固定 only `core-contracts` as compile candidate。 | 本地 sibling 存在不改变 Cargo dependency set。 |
| test/evidence truth | Step 15/16/05 后续定义观测和测试。 | config profile/fake fixture 不得替代正式 evidence schema。 |

### 3. Step 6~13 closure audit 思考

R14.14 需要做一张 closure audit,确认 Step 14 没有反向改写对象、port、protocol、flow、state、persistence、error、idempotency。当前思考结论是:已知配置绑定点可以回指前序 Step;未发现需要 Step 14 自行新增 schema/port/marker/source 的 hard blocker。

| Step | closure concern | R14.13 判断 | R14.14 写入方向 |
|---|---|---|---|
| Step 6 object contracts | runtime config refs、adapter marker、safe issue marker、body-free object redline。 | pass_with_watch;Step 14 只绑定 refs/summary,不新增 object body。 | 写 object no-config-truth closure。 |
| Step 7 trait / port / adapter | runtime assembly registry、adapter availability、target registry、publisher/handoff/source ports。 | pass;R14.8/R14.12 已回指 Step 7 port family。 | 写 port source closure and no new Step 14 port rule。 |
| Step 8 protocol contracts | command/query/event/job shell、metadata、topic-neutral event。 | pass;Step 14 只绑定 transport/target,不改 protocol schema。 | 写 protocol no-config-schema closure。 |
| Step 9 function flows | API/worker/jobs entry facade、adapter call points、runtime precheck。 | pass;R14.12 已固定 facade-only dispatch。 | 写 flow no-hidden-branch closure。 |
| Step 10 state machine | runtime assembly state、adapter availability state、entry local state。 | pass;config only feeds technical precheck source。 | 写 state no-config-transition closure。 |
| Step 11 persistence / tx | logical store、UoW、stored replay、checkpoint/report/outcome boundary。 | pass_with_watch;storage binding selects adapter,not schema truth。 | 写 persistence no-config-ownership closure。 |
| Step 12 errors / recovery | unavailable/degraded/blocked/failed safe surface。 | pass;status must copy formal summary/outcome。 | 写 recovery no-raw-error-classification closure。 |
| Step 13 concurrency / idempotency | retry numeric policy,lease,duplicate replay,runtime guard。 | pass;numeric config does not change semantic guard。 | 写 idempotency no-config-disable closure。 |

### 4. `04/15/16/19` handoff 思考

Step 14 不是最终配置手册、观测方案、测试方案或正式文档装配。R14.14 需要把后续 handoff 写清,防止实现端把 Step 14 的 family 表误读成完整可部署配置。

| 目标文档 / Step | handoff 内容 | 不得在 Step 14 提前写入 |
|---|---|---|
| `04-配置设计.md` | concrete config file/profile/env key、secret source、endpoint/topic/queue/product、TLS、credential、numeric retry/backoff/TTL/lease value、validation message、profile merge order。 | 具体 key 名、具体默认值、部署 profile、transport product。 |
| Step 15 observability / audit | runtime builder validation issue、adapter availability、entry precheck、publisher/handoff outcome、config redaction point 的观测承接。 | metric/log/span/audit event schema、字段名、采样策略、dashboard。 |
| Step 16 test cut | no direct entry shortcut、fake/durable parity、config redline、missing marker/source blocker、runtime unavailable/degraded mapping。 | test case ID、fixture JSON、evidence artifact schema、CI command。 |
| Step 19 formal assembly | 将 R14.2~R14.14 confirmed tables 装配为正式 `03-详细设计.md` §13。 | 现在直接修改正式 03 或跳过停审。 |
| `07-实施计划.md` later | runtime builder / config binding / no shortcut / fake parity 转成 implementation boundary gate。 | commit boundary、代码文件清单、evidence run schema。 |

### 5. 正式 §13 候选草稿结构思考

R14.14 可以写“候选草稿结构”和停审记录,但不应在 R14.13 直接写完整 candidate draft。结构应能从 R14.2~R14.12 的已确认表格装配,并保持 Step 14 只定义代码绑定点。

| 候选章节 | 主要来源 | 内容边界 |
|---|---|---|
| §13.1 scope and non-goals | R14.2 / R14.4 | Step 14 只定义 code binding points,不替代 `04-配置设计.md`。 |
| §13.2 config ownership and read boundary | R14.4 | contracts/domain/application/infra/api/worker/jobs 读取边界。 |
| §13.3 config reference families | R14.6 | config family、typed binding source、default/no-default category、04 handoff。 |
| §13.4 external dependency binding | R14.8 | adapter/runtime/source/publisher/handoff/target binding and safe outcome。 |
| §13.5 cross-repo dependency binding | R14.10 | only `core-contracts` compile candidate;其他 sibling runtime/event/handoff/downstream。 |
| §13.6 runtime builder and entry binding | R14.12 | load/validate/slot/availability/port bundle/entry precheck/facade-only。 |
| §13.7 forbidden configurable boundary | R14.13/R14.14 | config cannot change truth/state/schema/source/marker/idempotency/persistence。 |
| §13.8 closure and handoff | R14.13/R14.14 | Step 6~13 closure,04/15/16/19 handoff,stop-review。 |

### 6. 当前 watch / blocker 思考

| ID | 主题 | 当前判断 | 处理 |
|---|---|---|---|
| ML-D03-S14-WATCH-017 | forbidden configurable boundary final table | watch | R14.14 需要把禁止配置化边界写成正式可审计表。 |
| ML-D03-S14-WATCH-018 | Step 6~13 closure audit | watch | R14.14 需要写 closure audit table and no new blocker statement。 |
| ML-D03-S14-WATCH-019 | downstream handoff completeness | watch | R14.14 需要写 `04/15/16/19/07` handoff table。 |
| ML-D03-S14-WATCH-020 | formal §13 candidate draft structure | watch | R14.14 需要写 candidate structure / stop-review,但不修改正式 03。 |
| ML-D03-S14-BLOCK-007 | unresolved Step 14 source / marker / config schema gap | none_at_R14.13 | 当前思考未发现 hard blocker;若 R14.14 发现某 table 只能靠 config/fake 私补 source,必须暂停。 |

### 7. R14.14 写入计划思考

`R14.14` 应把 R14.13 思考落成 Step 14 收口产物,并把 Step 14 停在等待用户确认进入 Step 15:

1. 写 forbidden configurable boundary final table。
2. 写 Step 6~13 closure audit table。
3. 写 `04/15/16/19/07` handoff table。
4. 写正式 §13 candidate draft structure table and assembly source map。
5. 写 watch/blocker closure,Step 14 stop-review and Step 15 entry gate。
6. 同步 flow / ledger 到 Step 14 completed_wait_user_confirm_to_step15。

### 8. R14.13 stop-review

| 检查项 | 结果 |
|---|---|
| 是否只思考 forbidden configurable boundary and closure | pass |
| 是否覆盖 Step 6~13 closure audit 思考 | pass |
| 是否覆盖 `04/15/16/19/07` handoff 思考 | pass |
| 是否覆盖正式 §13 候选草稿结构思考 | pass |
| 是否未写最终 candidate draft 正文 | pass |
| 是否未修改正式 `03-详细设计.md` | pass |
| 是否未写 observability/test schema 或 implementation code | pass |
| 是否形成 R14.14 写入计划 | pass |

next_allowed_action: 等待用户确认后进入 Step 14 `R14.14 禁止配置化边界与正式 §13 候选草稿停审:再写入`;只允许写入 forbidden configurable boundary final table、Step 6~13 closure audit table、`04/15/16/19/07` handoff table、正式 §13 candidate structure/source map、watch/blocker closure、Step 14 stop-review 和 Step 15 entry gate;不得直接修改正式 `03-详细设计.md`;不得写 observability schema、test case schema、implementation code 或具体 config key/env/topic/URL。

---

## R14.14 禁止配置化边界与正式 §13 候选草稿停审:再写入

### 1. 当前模块目标

`R14.14` 将 Step 14 的最终收口写成可恢复、可审计、可装配的 calibration artifact。当前模块只写 forbidden configurable boundary final table、Step 6~13 closure audit table、`04/15/16/19/07` handoff table、正式 §13 candidate structure/source map、watch/blocker closure、Step 14 stop-review 和 Step 15 entry gate。正式 `03-详细设计.md` 仍不修改。

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm |
| Step 状态 | Step 14 completed_wait_user_confirm |
| 当前允许 | 写入 Step 14 收口表、正式 §13 candidate source map、handoff、stop-review 和 Step 15 进入门禁。 |
| 当前禁止 | 修改正式 `03-详细设计.md`;写具体 env/profile/secret/topic/URL、观测 schema、测试用例 schema、实现代码。 |

### 2. forbidden configurable boundary final table

| 禁止配置化对象 | Final rule | config allowed only for | violation handling |
|---|---|---|---|
| Definition / Use truth ownership | Config 不得改变 truth owner、logical store owner、aggregate boundary 或 module ownership。 | adapter slot selection、profile identity、storage product binding。 | design blocker / implementation gate failure。 |
| Domain state transition | Config 不得新增、跳过、放宽或重命名 Step 10 state transition。 | optional capability enablement only where Step 9/10 already allows。 | reject config or pause;不得落代码私分支。 |
| Query no-write | Config 不得开启 query repair、read-time backfill、read path mutation 或 hidden material write。 | page/body limits、freshness threshold handles。 | must fail gate;query stays no-write。 |
| Stored replay / idempotency | Config 不得关闭 duplicate replay、no-rerun、stored result source 或 checkpoint resume contract。 | retention TTL、retry numeric policy、lease duration。 | invalid config;cannot claim idempotency coverage。 |
| Public DTO / event / job schema | Config 不得改变 request/response/event/job kind、schema version、field presence 或 public marker carrier。 | route/topic/target transport binding。 | protocol blocker;return to Step 8 if schema change needed。 |
| Source / marker / mapper closure | Config、fake、route/header、raw error、raw body 不得合成 domain/read/recovery/source marker。 | choose formal adapter/mapper implementation behind existing port。 | design blocker;missing source remains open。 |
| Persistence / transaction boundary | Config 不得改 logical ownership、UoW、transaction boundary、stored replay or outcome persistence semantics。 | durable/fake store adapter and pool/connection config in `04`。 | implementation gate failure。 |
| External truth proof | External ack、receipt、response body、health probe、config validation success 不证明 local truth。 | safe local outcome and availability summary。 | accepted truth never rolls back from side effect failure。 |
| Compile/runtime dependency type | Only `core-contracts` is compile dependency candidate;runtime/event/handoff/downstream sibling remains port/event/fake collaboration。 | path binding for `core-contracts`;target registry for others。 | dependency review failure。 |
| Test/evidence truth | Config profile、fake fixture、private map 不替代 formal test/evidence schema。 | explicit local/test profile and deterministic fake through formal ports。 | Step 16/05 blocker if evidence schema absent。 |

### 3. Step 6~13 closure audit table

| Source Step | Closure result | Step 14 binding outcome | Remaining blocker |
|---|---|---|---|
| Step 6 object contracts | pass | Step 14 only references runtime config refs、adapter marker、safe issue marker and body-free summaries;no raw config/body enters objects。 | none_at_R14.14 |
| Step 7 trait / port / adapter | pass | Runtime assembly registry、adapter availability、target registry、publisher/handoff/source ports are binding anchors;Step 14 adds no new business port。 | none_at_R14.14 |
| Step 8 protocol contracts | pass | Route/topic/target binding remains transport/runtime concern;DTO/event/job schema unchanged。 | none_at_R14.14 |
| Step 9 function flows | pass | API/worker/jobs entry remains facade-only;adapter call points are through Step 7 ports。 | none_at_R14.14 |
| Step 10 state machine | pass | Runtime assembly and adapter availability are technical local states;config cannot alter business state transition。 | none_at_R14.14 |
| Step 11 persistence / tx | pass_with_watch | Storage config selects adapter;logical store ownership、UoW、transaction and stored replay semantics unchanged。 | concrete store product details move to `04`。 |
| Step 12 errors / recovery | pass | Disabled/degraded/unavailable/failed surfaces copy formal summary/outcome;raw adapter/config error does not classify public marker。 | none_at_R14.14 |
| Step 13 concurrency / idempotency | pass | Retry/lease/TTL values bind through config;semantic guard、duplicate replay、no-rerun and checkpoint source remain fixed。 | numeric values move to `04`。 |

### 4. `04/15/16/19/07` handoff table

| Target | Handoff from Step 14 | Must not be inferred by implementation |
|---|---|---|
| `04-配置设计.md` | concrete config file/profile/env key、secret source、endpoint/topic/queue/product、TLS、credential、numeric retry/backoff/TTL/lease value、validation message、profile merge order。 | actual key names、defaults、secret backend、transport product、deployment profile。 |
| Step 15 observability / audit | observe config validation issue、adapter availability、entry precheck、publisher/handoff safe outcome、redacted config diagnostic。 | metric/log/span/audit schema、field names、sampling、dashboard。 |
| Step 16 test cut | cover no direct entry shortcut、fake/durable parity、config redline、missing marker/source blocker、runtime unavailable/degraded mapping、core-contracts path dependency review。 | test case IDs、fixture JSON、CI command、evidence artifact schema。 |
| Step 19 formal assembly | assemble formal `03-详细设计.md` §13 from confirmed R14.2~R14.14 tables only。 | direct edits to formal 03 before Step 19。 |
| later `07-实施计划.md` | convert runtime builder/config binding/no shortcut/fake parity into implementation boundary gates and commit checks。 | commit boundary,code file list,evidence run schema before Step 17/19/07。 |

### 5. 正式 §13 candidate structure / source map

| Candidate formal section | Source modules | Assembly note |
|---|---|---|
| §13.1 Scope and non-goals | R14.1/R14.2/R14.4 | State Step 14 defines code binding points only;full deploy config is `04-配置设计.md`。 |
| §13.2 Config ownership and read boundary | R14.3/R14.4 | Include contracts/domain/application/infra/api/worker/jobs read boundary and raw/validated/typed settings separation。 |
| §13.3 Config reference families | R14.5/R14.6 | Include config family table、typed binding source、default/no-default policy、`04` handoff。 |
| §13.4 External dependency binding | R14.7/R14.8 | Include external/adapter/runtime binding table、safe outcome mapping、target registry、adapter redline。 |
| §13.5 Cross-repo dependency binding | R14.9/R14.10 | Include only `core-contracts` compile dependency candidate and sibling collaboration table。 |
| §13.6 Runtime builder and entry binding | R14.11/R14.12 | Include runtime builder sequence、entry precheck、port injection、fake/durable parity。 |
| §13.7 Forbidden configurable boundary | R14.13/R14.14 | Include final forbidden configurable boundary table and redline closure。 |
| §13.8 Closure and handoff | R14.13/R14.14 | Include Step 6~13 closure audit、handoff table、open blocker status。 |

### 6. watch / blocker closure

| ID | 主题 | R14.14 result | 后续 |
|---|---|---|---|
| ML-D03-S14-WATCH-017 | forbidden configurable boundary final table | closed_for_step14 | Step 19 formal assembly can reuse table。 |
| ML-D03-S14-WATCH-018 | Step 6~13 closure audit | closed_for_step14 | Step 15/16 use closure as entry constraint。 |
| ML-D03-S14-WATCH-019 | downstream handoff completeness | closed_for_step14 | `04/15/16/19/07` must consume handoff in their own Steps。 |
| ML-D03-S14-WATCH-020 | formal §13 candidate draft structure | closed_for_step14 | Formal `03-详细设计.md` remains unchanged until Step 19。 |
| ML-D03-S14-BLOCK-007 | unresolved Step 14 source / marker / config schema gap | none_at_R14.14 | No hard blocker to Step 15 identified。 |

### 7. Step 15 entry gate

进入 Step 15 `定义可观测性与审计埋点契约` / `R15.1 开工与必读文档:先思考` 前必须满足:

- Step 14 `R14.1` ~ `R14.14` 均已 completed_wait_user_confirm。
- 当前文件已写入配置 ownership、config family、external binding、cross-repo dependency、runtime builder、forbidden configurable boundary、closure audit and handoff。
- 正式 `03-详细设计.md` 未被修改。
- Step 15 只允许开始思考 observability / audit 埋点契约的必读文档、输入边界、L1-governance 框架参考和分批计划。
- Step 15 不得回写配置 key、重开 Step 14 依赖裁决、写测试 case schema、实现代码或直接修改正式 `03-详细设计.md`。

### 8. R14.14 final stop-review

| 检查项 | 结果 |
|---|---|
| 是否写入 forbidden configurable boundary final table | pass |
| 是否写入 Step 6~13 closure audit table | pass |
| 是否写入 `04/15/16/19/07` handoff table | pass |
| 是否写入 formal §13 candidate source map | pass |
| 是否关闭 Step 14 watch/blocker | pass |
| 是否确认 no hard blocker to Step 15 | pass |
| 是否未修改正式 `03-详细设计.md` | pass |
| 是否未写 observability/test schema 或 implementation code | pass |
| 是否形成 Step 14 completed_wait_user_confirm 与 Step 15 R15.1 等待确认状态 | pass |

next_allowed_action: 等待用户确认后进入 Step 15 `R15.1 开工与必读文档:先思考`;只允许思考 Step 15 observability / audit 埋点契约的开工边界、必读文档、Step 14 handoff、L1-governance 框架参考、旧材料隔离、分批计划和 `R15.2` 写入边界;不得直接修改正式 `03-详细设计.md`;不得写 metric/log/span/audit event schema、test case schema、implementation code 或具体 config key/env/topic/URL。
