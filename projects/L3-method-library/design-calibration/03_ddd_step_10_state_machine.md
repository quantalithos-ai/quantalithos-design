# Step 10. 定义状态机与转换矩阵

> 对应 SOP: `standards/document/详细设计讨论流程_SOP.md` Step 10
> 回填章节: `projects/L3-method-library/03-详细设计.md` §9 状态机与转换矩阵
> 创建日期: 2026-06-23
> 当前模式: full-restart / step10-state-matrix
> 当前状态: completed_wait_user_confirm
> 当前模块: `R10.24 正式 §9 候选草稿与停审:再写入`
> 当前门禁: `R10.24` completed_wait_user_confirm;等待确认进入 Step 11 `R11.1 开工与必读文档:先思考`

---

## 0. 文件重置记录

旧 `03_ddd_step_10_state_machine.md` 曾标记为 `[x] 已确认`,但其内容围绕旧 `MethodContentLifecycle`、publish、outbox relay、fingerprint、P1 plugin/configuration、旧 job run 等历史主线展开。该 completed 状态和旧状态矩阵结论全部失效。

当前 Step 10 不继承旧状态机、状态名、转换函数、错误码、P0/P1 分层或 §7/§9 编号。旧内容只能作为后置差异审计和污染样本,不得作为当前状态主语或转换矩阵来源。

当前 Step 10 的唯一正向基线是:

- 当前 `00-需求文档.md`、`01-架构设计.md`、`02-概要设计.md`。
- 本轮 `03-详细设计` Step 1~9 中间产物。
- 特别是 Step 6 object contracts、Step 8 protocol contracts、Step 9 L1-granularity function flows。

---

## R10.1 开工与必读文档:先思考

### 1. 当前模块目标

`R10.1` 只思考 Step 10 的开工边界、必读文档、状态主语筛选方法、状态族分批框架和旧状态机污染隔离方式。

| 项 | 内容 |
|---|---|
| 本模块状态 | completed |
| 当前允许 | 思考必读文档、输入边界、状态主语候选、排除规则、状态族分批、旧材料隔离和 `R10.2` 写入边界。 |
| 当前禁止 | 写完整状态集合、转换矩阵、非法转换错误 taxonomy、persistence schema、config key、test case schema、implementation code 或正式 `03-详细设计.md`。 |

### 2. Step 10 启动前必须承接

| 输入 | 必须承接的内容 | 禁止继承的内容 |
|---|---|---|
| `project_execution_ledger.md` | 当前恢复点、单模块推进规则、Step 9 `R9.44` completed_wait_user_confirm。 | 跳过 R10.1 / R10.2 直接写完整状态矩阵。 |
| `03_ddd_calibration_flow.md` | Step 10 pending 已被用户确认开启,Step 11+ 仍 blocked_by_step10。 | 将 persistence / error / idempotency / config / test 内容提前写入 Step 10。 |
| `03_ddd_step_01_input_boundary.md` ~ `03_ddd_step_04_module_layout.md` | 输入权威、范围、runtime、七实现单元和旧材料隔离。 | 从旧正式 03 恢复旧 `MethodContent` 状态主线。 |
| `03_ddd_step_05_module_contracts.md` | 七模块主轴、八组件 owner 路由和依赖方向。 | 新增全局状态机或绕过 module owner。 |
| `03_ddd_step_06_object_contracts.md` | 状态主语、state enum/value、disposition、availability、progress、stored result、job/report helper 来源。 | 给纯 ref、DTO wrapper、cache、lock、retry counter 发明状态机。 |
| `03_ddd_step_07_trait_port_adapter.md` | 状态读取面、version source、repository family、resolver / mapper / availability 来源。 | 从 adapter/private map/error text 推状态。 |
| `03_ddd_step_08_protocol_contracts.md` | Command / Query / Inbound / Outbound / Job public surface 里的状态、marker、result、receipt、report 壳。 | 从协议壳反向发明 domain state。 |
| `03_ddd_step_09_function_flows.md` | 58 Command、57 Query、4 Inbound、34 Outbound、8 Job 的触发 flow、branch / replay surface、watch ledger 和 handoff。 | 把 Step 9 watch 项当成已闭合状态 schema。 |

### 3. 规范约束思考

| 规范 | Step 10 使用方式 | 当前判断 |
|---|---|---|
| `详细设计讨论流程_SOP.md` Step 10 | 要求先筛选状态主语,排除非状态机对象,按状态机逐个写状态集合和转换矩阵,每个状态机停审。 | 必须采用;不能全仓一个状态总表。 |
| `详细设计书写规范.md` §5.9 / §9 | 要求状态集合、ASCII 图、转换矩阵、非法转换、测试切口可实现。 | 后续每个状态机必须有 From / To / trigger / precondition / side effect / illegal branch。 |
| `设计文档讨论中间产物规范.md` | 要求结构化中间产物、状态主语筛选、避免为非状态对象发明状态机。 | R10.2 必须先写候选筛选表和排除表。 |
| `设计真相源闭环与可落码性标准.md` | 要求缺 state / mapper / port / schema 来源时暂停,不得实现端补口。 | 状态主语若无法回指 Step 6/7/8/9,必须记录 blocker。 |

### 4. L1-governance 框架参考结果

| L1 Step 10 框架点 | L3 采用方式 |
|---|---|
| 开头明确目标和非目标 | 本 Step 只定义状态集合和转换矩阵;不写错误 taxonomy、DDL、retry、topic、commit boundary。 |
| 先写状态主语筛选 | 必须先列候选主语、来源对象/字段、是否进入 Step 10、状态族和原因。 |
| 按状态族分批 | 至少区分 business truth、source/reference、read/visibility/material、maintenance/job/report、idempotency/replay、runtime/entry。 |
| 每个状态机独立停审 | 每个状态机都要有状态集合、ASCII 图、转换矩阵和停审表。 |
| 最后跨状态机审计 | 审计同名/近义状态、触发 flow、非法转换、测试切口和 phase reserved 调用。 |

### 5. 初步状态族候选

本表只是 R10.1 思考结果,不是最终状态矩阵。R10.2 需要把候选写成正式筛选表。

| 状态族 | 候选状态主语 | 主要来源 | 初判 |
|---|---|---|---|
| business truth | `MethodAssetDefinition`;`MethodAssetCatalogEntry`;`FormalizationState`;`FormalMethodAssetVersion`;`MethodAssetConsumptionMaterial`;`MethodAssetRelation`;`MethodPackage`;`MethodSetAssembly` | Step 6 domain objects;Step 9 Command flows | likely_enter |
| source / reference / body boundary | `ExternalSourceSummary`;`ExternalSourceRef`;`ArtifactArchiveRef`;`ExternalBodyBoundaryRule`;`FormalizationBasisSummary` | Step 6 external / basis objects;Step 9 external command/inbound/query flows | likely_enter_or_marker_family |
| trace / audit / lineage / impact | `MethodAssetTraceMaterial`;`ConsumptionImpactSummary`;`ConsistencyProtectionPolicy`;`MethodAssetAuditTrail`;`MethodAssetEvidenceLineage` | Step 6 trace / audit / policy objects;Step 9 trace/impact/audit flows | likely_enter |
| read / visibility / material | catalog view、availability view、trace view、external summary view、package/assembly view、read material freshness | Step 6 view shell;Step 7 read resolver / availability;Step 9 Query/Job flows | likely_enter_as_read_disposition_or_freshness |
| maintenance / job / report | `ReadMaterialRefreshTask`;`TraceMaterialRefreshTask`;`ConsistencyRecoveryTask`;`MaintenanceProgressView`;run history;checkpoint;job report | Step 6 application helper / job objects;Step 9 Job flows | likely_enter |
| idempotency / replay | `MethodAssetIdempotencyGuard`;`MethodAssetStoredOperationResult`;inbound receipt;job report replay | Step 6 helpers;Step 7 stored result;Step 8 result shell;Step 9 duplicate overlay | likely_enter_as_application_state |
| outbound / publication / handoff | event candidate outcome;publisher outcome;handoff hint / marker if formalized | Step 7 publisher / handoff family;Step 8 event/outcome shell;Step 9 Outbound flows | likely_enter_if_state_subject_exists |
| runtime / entry technical | runtime assembly availability;adapter availability;entry disposition | Step 7 runtime/availability ports;Step 8 shell;Step 9 entry overlay | likely_enter_as technical disposition,not business truth |

### 6. 排除规则初判

| 排除对象 | 排除原因 |
|---|---|
| 纯 typed ref / id / key | 无独立生命周期;只作为 identity 或引用。 |
| DTO wrapper / request / response shell | 只承载协议输入输出,不拥有状态机。 |
| raw external body / artifact body / report body / provider payload | 已被 body-free 红线禁止进入本仓 truth。 |
| cache / lock / retry counter / queue offset / scheduler lease | 实现细节,不是设计 truth 状态机。 |
| `MethodContentLifecycle` / old publish / old outbox / fingerprint state | historical pollution,与当前主线冲突。 |
| marketplace listing/order/install/fulfillment 状态 | 当前 L3 不拥有外围交易履约 truth。 |

### 7. Step 10 模块计划候选

| 模块 | 目标 | 当前状态 |
|---|---|---|
| R10.1 | 开工与必读文档:先思考 | completed |
| R10.2 | 开工与必读文档:再写入 | pending |
| R10.3 / R10.4 | L1-governance 框架对齐 | pending |
| R10.5 / R10.6 | 状态主语筛选与排除表 | pending |
| R10.7 / R10.8 | business truth 状态机 | pending |
| R10.9 / R10.10 | source/reference/body-boundary 状态机 | pending |
| R10.11 / R10.12 | trace/audit/lineage/impact 状态机 | pending |
| R10.13 / R10.14 | read/visibility/material freshness 状态机 | pending |
| R10.15 / R10.16 | maintenance/job/report 状态机 | pending |
| R10.17 / R10.18 | idempotency/replay/runtime/entry 状态机 | pending |
| R10.19 / R10.20 | outbound/publication/handoff 状态机 | pending |
| R10.21 / R10.22 | 跨状态机审计与 Step 11~16 handoff | pending |
| R10.23 / R10.24 | 正式 §9 候选草稿与停审 | pending |

### 8. R10.1 stop-review

| 检查项 | 结果 |
|---|---|
| 是否确认旧 Step 10 completed 作废 | pass |
| 是否读取并承接 Step 9 `R9.44` | pass |
| 是否只做开工思考,未写完整状态矩阵 | pass |
| 是否建立状态主语筛选和排除规则 | pass |
| 是否修改正式 `03-详细设计.md` | no |

next_allowed_action: 等待用户确认后进入 Step 10 `R10.2 开工与必读文档:再写入`;只允许写入 Step 10 必读文档表、读取状态、输入基线、旧材料处理规则、Step 内模块计划、L1-governance 框架参考边界和 `R10.3` 进入门禁;不得直接修改正式 `03-详细设计.md`;不得写完整状态集合、转换矩阵、非法转换错误 taxonomy、persistence schema、config key、test case schema、implementation code 或进入 Step 11。

---

## R10.2 开工与必读文档:再写入

### 1. 必读文档表

| 文档 | 读取状态 | Step 10 使用方式 | 禁止事项 |
|---|---|---|---|
| `project_execution_ledger.md` | read | 恢复当前文档、Step、模块、门禁和单模块推进规则。 | 根据对话记忆跳过 R10.2 或直接写状态矩阵。 |
| `03_ddd_calibration_flow.md` | read | 确认 Step 9 completed、Step 10 in_progress、Step 11+ blocked。 | 将后续 persistence / error / config / test 内容提前。 |
| `03_ddd_step_01_input_boundary.md` | inherited_completed | 承接输入权威顺序和旧材料隔离。 | 从旧正式 03 直接恢复旧状态机。 |
| `03_ddd_step_02_scope.md` | inherited_completed | 承接本轮详细设计范围、非范围和旧 P0/P1 禁入。 | 扩大到 marketplace 交易履约或外部仓 truth 状态。 |
| `03_ddd_step_03_runtime_constraints.md` | inherited_completed | 承接 runtime、安全边界和缺口回设计规则。 | 从 runtime adapter / IO error 推业务状态。 |
| `03_ddd_step_04_module_layout.md` | inherited_completed | 承接七实现单元和文件布局 owner。 | 新增未闭口全局状态模块。 |
| `03_ddd_step_05_module_contracts.md` | inherited_completed | 承接七模块主轴、八组件 owner 路由和依赖方向。 | 绕过模块 owner 写全局混合状态机。 |
| `03_ddd_step_06_object_contracts.md` | inherited_completed | 第一状态主语来源:object、state enum/value、marker、disposition、progress、stored result helper。 | 给 Step 6 未定义状态的对象发明状态机。 |
| `03_ddd_step_07_trait_port_adapter.md` | inherited_completed | 承接状态读取面、version source、resolver / mapper / availability / progress 来源。 | 用 private map、route 字符串、raw error 推状态。 |
| `03_ddd_step_08_protocol_contracts.md` | inherited_completed | 承接 public state / marker / result / receipt / report shell。 | 从 DTO 壳反向创造 domain truth state。 |
| `03_ddd_step_09_function_flows.md` | inherited_completed | 承接 161 个 flow 的 trigger、branch、replay surface、watch ledger 和 Step 10 handoff。 | 把 Step 9 watch 项当成已闭合 schema。 |
| `standards/document/详细设计讨论流程_SOP.md` | read | 采用 Step 10 状态主语筛选、状态族分批、单状态机停审和跨状态机审计。 | 不做筛选直接列矩阵。 |
| `standards/document/详细设计书写规范.md` | read | 采用状态集合、ASCII 图、转换矩阵、非法转换、测试切口要求。 | 用散文替代可落码矩阵。 |
| `standards/document/设计文档讨论中间产物规范.md` | read | 采用结构化中间产物和单模块推进规则。 | 一次性把 Step 10~16 合并写。 |
| `standards/document/设计真相源闭环与可落码性标准.md` | read | 缺 state / mapper / port / schema 来源时记录 blocker。 | 实现侧自行补状态、marker、config 或 evidence schema。 |
| `projects/L1-governance/design-calibration/03_ddd_step_10_state_matrix.md` | framework_read | 参考 Step 10 框架深度、批次、表格和停审方式。 | 复制 governance 领域状态或命名。 |

### 2. 输入基线

| 基线 | 当前裁决 |
|---|---|
| 当前 00/01/02 | 正向真相源;定义 L3-method-library 仓定位、八组件、对象、接口、处理流和状态轮廓。 |
| Step 6 | 状态主语第一来源;只有 Step 6 已定义 state enum/value/disposition/marker/progress/result helper 的对象才可进入候选池。 |
| Step 7 | 状态读写和 marker 来源的 port family 约束;没有读取面或 version source 的状态写入必须后续 watch/blocker。 |
| Step 8 | public surface 约束;状态、marker、result、receipt、report 的对外壳不能被 Step 10 反向扩张。 |
| Step 9 R9.44 | trigger 和 branch 第一来源;状态转换必须能回指 Command / Inbound / Outbound / Job flow 或 Query read disposition。 |
| 旧 Step 10 | historical_material;只用于差异审计和污染禁入。 |

### 3. 旧材料处理规则

| 旧材料 | 当前处理 |
|---|---|
| `MethodContentLifecycle` | 禁入当前状态主语;当前定义相关状态只能由 `MethodAssetDefinition`、`FormalizationState`、`FormalMethodAssetVersion` 等现行对象承接。 |
| old publish / `Published` lifecycle | 禁入;当前不恢复 publish 主线,正式消费边界由 formalization/version/consumption material 承接。 |
| old outbox / relay status | 禁入当前正向状态机;若后续需要 publication outcome,只能从 Step 7 publisher family、Step 8 event outcome、Step 9 outbound overlay 重新定义。 |
| fingerprint / snapshot status | 禁入;当前版本和材料不以 fingerprint / snapshot 作为状态 owner。 |
| P1 plugin / configuration lifecycle | 禁入 P1 分层;外围只能按 `MethodPackage`、`MethodSetAssembly`、peripheral view / availability 当前对象重新筛选。 |
| seed / replay / recalculate jobs | 禁入;当前 job 主语只来自 8 个 Operations Job 和 Step 6 maintenance objects。 |

### 4. Step 10 模块计划

| 模块 | 目标 | 状态 |
|---|---|---|
| R10.1 | 开工与必读文档:先思考 | completed |
| R10.2 | 开工与必读文档:再写入 | completed |
| R10.3 | L1-governance 框架对齐:先思考 | completed |
| R10.4 | L1-governance 框架对齐:再写入 | completed |
| R10.5 | 状态主语筛选与排除表:先思考 | completed |
| R10.6 | 状态主语筛选与排除表:再写入 | completed |
| R10.7 | business truth 状态机:先思考 | completed |
| R10.8 | business truth 状态机:再写入 | completed |
| R10.9 | source/reference/body-boundary 状态机:先思考 | completed |
| R10.10 | source/reference/body-boundary 状态机:再写入 | completed |
| R10.11 | trace/audit/lineage/impact 状态机:先思考 | completed |
| R10.12 | trace/audit/lineage/impact 状态机:再写入 | completed |
| R10.13 | read/visibility/material freshness 状态机:先思考 | completed |
| R10.14 | read/visibility/material freshness 状态机:再写入 | completed |
| R10.15 | maintenance/job/report 状态机:先思考 | completed |
| R10.16 | maintenance/job/report 状态机:再写入 | completed |
| R10.17 | idempotency/replay/runtime/entry 状态机:先思考 | completed |
| R10.18 | idempotency/replay/runtime/entry 状态机:再写入 | completed |
| R10.19 | outbound/publication/handoff 状态机:先思考 | completed |
| R10.20 | outbound/publication/handoff 状态机:再写入 | completed |
| R10.21 | 跨状态机审计与 Step 11~16 handoff:先思考 | completed |
| R10.22 | 跨状态机审计与 Step 11~16 handoff:再写入 | completed |
| R10.23 | 正式 §9 候选草稿与停审:先思考 | completed |
| R10.24 | 正式 §9 候选草稿与停审:再写入 | completed_wait_user_confirm |

### 5. R10.3 进入门禁

进入 `R10.3 L1-governance 框架对齐:先思考` 前必须满足:

- `R10.1` 与 `R10.2` 均已 completed。
- 当前 Step 10 仍未写完整状态集合或转换矩阵。
- 正式 `03-详细设计.md` 未修改。
- 旧 Step 10 状态机只作为 historical pollution。
- 下一步只允许思考 L1-governance Step 10 的框架深度、状态主语筛选、状态族分批、单状态机停审模板和跨状态机审计模板。

### 6. R10.2 stop-review

| 检查项 | 结果 |
|---|---|
| 是否写入必读文档表和读取状态 | pass |
| 是否固定输入基线 | pass |
| 是否固定旧材料处理规则 | pass |
| 是否写入 Step 10 模块计划 | pass |
| 是否未写完整状态矩阵 | pass |
| 是否修改正式 `03-详细设计.md` | no |

next_allowed_action: 等待用户确认后进入 Step 10 `R10.3 L1-governance 框架对齐:先思考`;只允许思考 L1-governance Step 10 的框架深度、状态主语筛选、状态族分批、单状态机停审模板和跨状态机审计模板;不得复制 governance 领域语义;不得直接修改正式 `03-详细设计.md`;不得写完整状态集合、转换矩阵、非法转换错误 taxonomy、persistence schema、config key、test case schema、implementation code 或进入 Step 11。

---

## R10.3 L1-governance 框架对齐:先思考

### 1. 当前模块目标

`R10.3` 只思考 L1-governance Step 10 的框架粒度如何迁移到 L3-method-library。当前模块不写 L3 的正式状态集合、ASCII 图或转换矩阵,只形成 `R10.4` 可写入的框架对齐裁决。

| 项 | 内容 |
|---|---|
| 本模块状态 | completed |
| 当前允许 | 阅读 L1-governance Step 10 的章节组织、批次策略、模板字段、停审机制、跨状态机审计和 handoff 结构。 |
| 当前禁止 | 复制 governance 领域状态、提前裁决 L3 状态 enum、写完整转换矩阵、修改正式 `03-详细设计.md` 或进入 Step 11。 |

### 2. L1-governance Step 10 框架观察

| 框架层 | L1-governance 做法 | 对 L3 的启发 |
|---|---|---|
| Step 状态 | 开头明确当前 Step、状态、输入基线、输出文件和停审方式。 | L3 必须在 Step 10 文件开头保留当前模块、门禁、正式回填章节和旧材料禁入。 |
| 本步目标 | 明确把 Step 6 state enum、Step 6 domain method、Step 8 protocol intent、Step 9 flow 串成矩阵。 | L3 的状态转换必须回指 Step 6 对象、Step 7 port、Step 8 surface 和 Step 9 的 161 个 flow。 |
| 非目标 | 不定义最终错误 enum、DDL、optimistic lock SQL、retry 数字、topic、route 或 commit boundary。 | L3 也必须把 error taxonomy、persistence、concurrency、config、test 和 implementation boundary 留给 Step 11~17。 |
| SOP 问答 | 用表格回答“有哪些状态机、归属哪个 enum、触发函数、前置条件、副作用、非法转换、停审方式”。 | L3 应先写同等问答,避免后续直接堆状态表而缺闭环。 |
| 通用矩阵规则 | 统一规定状态名来源、trigger 来源、前置条件来源、副作用边界、query no-write、maintenance 不反写 truth、version 来源和 phase reserved。 | L3 需要在写任何状态机前先固定通用规则,否则容易把 query/job/read material 写成隐式 truth 更新。 |
| 批次表 | 先列所有状态机批次,每个状态机有 module、enum、主要触发 flow、停审状态。 | L3 的 `R10.5/R10.6` 应先筛选状态主语并形成批次表,再逐族展开。 |
| 写法模板 | 每个状态机固定为 ASCII 图、状态表、转换表、停审表。 | L3 必须沿用模板,不能用散文或一个总表代替单状态机矩阵。 |
| 状态族组织 | domain truth、projection/reference/outbox/report/handoff、application/infra/api/worker/jobs、query helper/external marker 分章。 | L3 需要按 method-library 领域重排为 business truth、source/reference、trace/audit、read/material、maintenance/job、idempotency/runtime、outbound/handoff。 |
| 跨状态机审计 | 最后有副作用一致性、forbidden transition summary、Step 9 待决项闭口、Step 11~16 handoff、命名/触发/测试审计。 | L3 Step 10 必须在末尾做同类审计,并把未闭合问题显式交给 Step 11~16 或 blocker ledger。 |

### 3. L3 采用的框架骨架

| 顺序 | L3 Step 10 应建立的框架 | 说明 |
|---|---|---|
| 1 | Step 目标 / 非目标 | 明确 Step 10 只管 state set、transition matrix、illegal transition placeholder 和 handoff,不管 DDL/error/config/test。 |
| 2 | 输入材料与 SOP 问答 | 将 Step 6/7/8/9 的状态来源、port 来源、public surface、flow trigger 用问答闭合。 |
| 3 | 通用状态矩阵规则 | 先统一状态名、trigger、precondition、side effect、query no-write、maintenance no-truth-write、version source、reserved 规则。 |
| 4 | 状态主语筛选表 | 逐对象判断 enter / exclude / marker-only / watch,并记录来源和原因。 |
| 5 | 状态矩阵批次表 | 用状态族组织后续写入,每个状态机必须有 owner module、state enum/value、trigger flow 和停审状态。 |
| 6 | 单状态机写法模板 | 固定 ASCII 图、状态集合表、转换矩阵、停审表四段式。 |
| 7 | 分状态族逐个矩阵 | 每个状态机单独闭合,不得把多个对象混成一张表。 |
| 8 | forbidden transition summary | 汇总禁止转换、terminal/replacement 规则和非法转换占位错误。 |
| 9 | Step 9 待决项闭口 | 对 Step 9 watch/blocker 做状态层裁决或继续挂牌。 |
| 10 | Step 11~16 handoff | 交付 persistence、error、idempotency、config、observability、test 的待闭口项。 |
| 11 | 跨状态机审计 | 检查命名一致、trigger 可回指、query no-write、job no-truth-write、测试切口可生成。 |
| 12 | 正式 §9 候选草稿 | 只在最后形成可装配草稿,正式 `03-详细设计.md` 仍等回填/装配 gate。 |

### 4. L3 状态族重排思考

| L1 框架族 | L3 对应状态族 | 当前思考 |
|---|---|---|
| domain context / decision / responsibility | business truth | `MethodAssetDefinition`、`FormalizationState`、`FormalMethodAssetVersion`、`MethodAssetConsumptionMaterial`、`MethodAssetRelation`、`MethodPackage`、`MethodSetAssembly` 等应优先筛选。 |
| policy / shared rules / conflict | policy / guard / protection truth | L3 的 `ConsistencyProtectionPolicy`、formalization guard、body-free boundary rule 若拥有状态 enum/value,需单独矩阵;否则 marker-only。 |
| projection / reference / outbox / report / handoff | read material / external source / outbound / maintenance report / handoff | L3 需要拆分 read material freshness、external source availability/reference resolution、publication outcome、job report、handoff marker。 |
| application / infra / api / worker / jobs | idempotency / replay / runtime / entry | L3 的 stored result、idempotency guard、inbound receipt、API/worker/job disposition 应作为技术状态族,但不能反写 business truth。 |
| query helper / external marker | read / availability / visibility / material degradation | L3 查询状态必须保持 no-write,只暴露 resolver / view / material freshness 的结果。 |

### 5. 与 L1-governance 不同的裁剪点

| 差异点 | L3 裁剪口径 |
|---|---|
| 治理审批链 | L3 不引入 gate / decision / responsibility / vote 语义。 |
| control / compliance / nonconformity | L3 不复制治理控制项、合规结论、纠正措施状态。 |
| external GRC export | L3 只保留 method-library 的正式 handoff / publication / archive marker,不复制 GRC target。 |
| evidence verification | L3 只承接 artifact/archive/external body-free summary 的可用性或 lineage marker,不扩成治理 evidence lifecycle。 |
| policy fact | L3 只保留方法资产 formalization / consistency / boundary policy 的本域状态,不复制 policy effective fact。 |

### 6. R10.4 写入边界思考

`R10.4` 应把本模块的框架裁决写成正式的 Step 10 框架小节,但仍不得写具体状态集合和转换矩阵。它的输出边界应包括:

- L3 Step 10 目标 / 非目标。
- 输入材料表。
- SOP 问题回答模板。
- 通用状态矩阵规则。
- 状态机写法模板。
- 状态族批次框架。
- L1-governance 差异裁剪表。
- `R10.5` 状态主语筛选入口门禁。

### 7. R10.3 stop-review

| 检查项 | 结果 |
|---|---|
| 是否读取 L1-governance Step 10 框架 | pass |
| 是否只提炼框架而未复制 governance 领域语义 | pass |
| 是否未写 L3 完整状态集合或转换矩阵 | pass |
| 是否明确 R10.4 写入边界 | pass |
| 是否修改正式 `03-详细设计.md` | no |

next_allowed_action: 等待用户确认后进入 Step 10 `R10.4 L1-governance 框架对齐:再写入`;只允许写入 Step 10 目标/非目标、输入材料表、SOP 问题回答、通用矩阵规则、状态机写法模板、状态族批次框架、L1-governance 差异裁剪表和 `R10.5` 入口门禁;不得复制 governance 领域状态;不得直接修改正式 `03-详细设计.md`;不得写具体状态集合、转换矩阵、非法转换错误 taxonomy、persistence schema、config key、test case schema、implementation code 或进入 Step 11。

---

## R10.4 L1-governance 框架对齐:再写入

### 1. Step 10 目标 / 非目标

| 类型 | 裁决 |
|---|---|
| 目标 | 将 Step 6 的 state enum/value/disposition/helper、Step 7 的 state read/write port、Step 8 的 public surface、Step 9 的 trigger/branch/replay flow 串成可落码的状态机与转换矩阵。 |
| 目标 | 为每个正式状态机给出状态集合、ASCII 图、转换矩阵、非法转换占位、停审记录和后续 Step handoff。 |
| 目标 | 识别非状态主语、marker-only 主语、watch/blocker 主语,避免实现端自行发明 state、mapper、port 或 schema。 |
| 非目标 | 不定义 DDL、transaction ordering、optimistic lock SQL、storage key、index、config key、topic、route、retry 数字或 implementation commit boundary。 |
| 非目标 | 不闭合最终 error taxonomy、API error mapping、test case schema、observability fields 或 evidence schema。 |
| 非目标 | 不复制 L1-governance 的 gate、decision、responsibility、control、compliance、GRC export 等领域语义。 |

### 2. 输入材料表

| 输入 | 状态 | Step 10 用途 |
|---|---|---|
| `00-需求文档.md` | completed | 提供 L3-method-library 的业务能力边界和 body-free 红线。 |
| `01-架构设计.md` | completed | 提供仓职责、依赖方向、数据所有权和跨仓边界。 |
| `02-概要设计.md` | completed | 提供八组件、对象轮廓、接口骨架、处理流、状态和异常轮廓。 |
| `03_ddd_step_06_object_contracts.md` | completed | 状态主语、state enum/value、transition helper 和 marker 第一来源。 |
| `03_ddd_step_07_trait_port_adapter.md` | completed | 状态读写、version source、resolver、mapper、builder 和 repository 来源。 |
| `03_ddd_step_08_protocol_contracts.md` | completed | Command / Query / Inbound / Outbound / Job public surface 与 result/receipt/report 壳。 |
| `03_ddd_step_09_function_flows.md` | completed | 58 Command、57 Query、4 Inbound、34 Outbound、8 Operations Job 的 trigger、branch、side effect 和 replay 来源。 |
| `projects/L1-governance/design-calibration/03_ddd_step_10_state_matrix.md` | framework_reference | 只参考 Step 10 框架深度、模板、批次和停审方式。 |
| `standards/document/详细设计讨论流程_SOP.md` | read | 约束 Step 10 必须先筛选状态主语、逐状态机写矩阵、逐状态机停审。 |
| `standards/document/详细设计书写规范.md` | read | 约束状态集合、ASCII 图、转换矩阵、非法转换和测试切口必须可实现。 |
| `standards/document/设计真相源闭环与可落码性标准.md` | read | 约束缺 state/mapper/port/schema 来源时必须暂停,不得自行补口。 |

### 3. SOP 问题回答模板

| 问题 | L3 Step 10 固定回答方式 |
|---|---|
| 当前仓有哪些正式状态机? | 先由 R10.5/R10.6 状态主语筛选表裁决,不得直接从对象名或 DTO 壳推断。 |
| 每个状态机归属于哪个模块和哪个状态 enum/value? | 每个状态机必须绑定 Step 5/6 模块 owner,并回指 Step 6 的正式 enum/value/disposition/helper。 |
| 每个状态机的状态集合是什么? | 每个状态机小节独立列出,不得用全仓总表替代。 |
| 哪些函数触发状态转换? | 每条转换必须回指 Step 6 factory/method、Step 7 repository marker update 或 Step 9 flow。 |
| 前置条件来源是什么? | 只能来自 loaded truth、DTO intent、repository versioned read、resolver output、policy guard、stored result 或 job input。 |
| 副作用边界如何限定? | domain transition 只更新 object state 字段;trace/audit/outbox/read material/stored result 由 Step 9 application flow 编排。 |
| query 是否允许写状态? | 不允许。query 只能读取并暴露 state/disposition/freshness/degradation,不能修复 stale、重建 material 或写 trace。 |
| maintenance/job 是否允许反写 business truth? | 不允许,除非 Step 9 已明确该 job 是 formal truth repair flow 且 Step 6/7 有正式写面。 |
| 非法转换如何记录? | Step 10 只给非法转换占位错误和 forbidden summary;最终 taxonomy 交 Step 12。 |
| 每个状态机如何停审? | 每个状态机必须以停审表结束:enum/value、状态名、trigger、precondition、side effect、illegal branch、test cut。 |

### 4. 通用状态矩阵规则

| 规则 | 正式口径 |
|---|---|
| 状态名来源 | 必须来自 Step 6 已定义 state enum/value/disposition/marker;不得新增同义状态。 |
| 状态主语来源 | 必须是拥有独立生命周期、正式字段和读写面或可公开暴露 disposition 的对象/helper。 |
| trigger 来源 | 必须是 Step 6 factory/method、Step 7 port/repository marker operation 或 Step 9 formal flow。 |
| 前置条件来源 | 必须能回指正式输入、loaded state、resolver/mapper summary、policy guard、versioned read 或 job context。 |
| 状态副作用 | 只描述状态主语自身字段变化,不把外部 report、trace、outbox、read material 混入 domain method。 |
| flow 副作用 | trace/audit/outbound/stored result/read material stale/report/handoff 由 application/job flow 负责。 |
| query no-write | 所有 query 只暴露状态或 degraded/empty/not-visible surface,不得保存或修复任何状态。 |
| body-free | 任何 raw external body、artifact body、provider payload、report body 都不得成为状态判断来源。 |
| version source | update existing state 必须有 Step 7/11 正式 versioned read/list 来源;没有则记录 blocker。 |
| terminal / replacement | 终态不得隐式恢复;若要重新处理,必须由新 truth、新 marker 或正式 replacement transition 承接。 |
| phase reserved | 后续阶段状态或转换必须标记 reserved,当前 Step/flow 不得调用。 |
| conflict handling | Step 6/7/8/9 与 Step 10 冲突时回设计修正,不得由实现端选边。 |

### 5. 状态机写法模板

```text
[StateMachineName]
  StateA -> StateB -> StateC
  StateA -> TerminalX
```

| 状态 | 作用 | 是否终态 | 允许的关键操作 | 来源 |
|---|---|---|---|---|

| From | To | 触发函数 | Step 9 flow | 前置条件 | 状态副作用 | Flow 副作用 | 非法时错误 |
|---|---|---|---|---|---|---|---|

| 停审项 | 结论 | 缺口 / 修正 |
|---|---|---|
| enum/value 是否回指 Step 6 | pending | 逐状态机填写 |
| trigger 是否回指 Step 6/7/9 | pending | 逐状态机填写 |
| 前置条件是否闭合 | pending | 逐状态机填写 |
| 副作用是否越界 | pending | 逐状态机填写 |
| query/job 是否保持边界 | pending | 逐状态机填写 |
| 测试切口是否可生成 | pending | 逐状态机填写 |

### 6. 状态族批次框架

| 批次 | 状态族 | 预计来源 | 后续模块 |
|---|---|---|---|
| 10.A | 状态主语筛选与排除表 | Step 6/7/8/9 全量对象、helper、surface、flow | R10.5/R10.6 |
| 10.B | business truth 状态机 | method asset、formalization、version、consumption、relation、package、assembly 等正式 truth 候选 | R10.7/R10.8 |
| 10.C | source/reference/body-boundary 状态机 | external source、archive ref、basis summary、body boundary rule、reference availability 候选 | R10.9/R10.10 |
| 10.D | trace/audit/lineage/impact 状态机 | trace material、audit trail、evidence lineage、impact summary、protection policy 候选 | R10.11/R10.12 |
| 10.E | read/visibility/material freshness 状态机 | catalog/read view、availability view、material freshness、degradation/empty/not-visible surface 候选 | R10.13/R10.14 |
| 10.F | maintenance/job/report 状态机 | refresh task、trace task、recovery task、progress view、job report、checkpoint 候选 | R10.15/R10.16 |
| 10.G | idempotency/replay/runtime/entry 状态机 | idempotency guard、stored result、inbound receipt、runtime assembly、API/worker/job disposition 候选 | R10.17/R10.18 |
| 10.H | outbound/publication/handoff 状态机 | event candidate、publisher outcome、publication marker、handoff marker 候选 | R10.19/R10.20 |
| 10.I | cross-state audit / handoff | forbidden transition、Step 9 watch/blocker、Step 11~16 handoff、正式 §9 候选 | R10.21~R10.24 |

### 7. L1-governance 差异裁剪表

| L1-governance 框架项 | L3-method-library 裁剪 |
|---|---|
| `GovernanceContext` / `GovernanceInput` | 不复制对象;L3 只用 method asset / formalization / package 等当前对象筛选。 |
| `Gate` / `GovernanceDecision` / `ApprovalResponsibility` | 不引入审批链、投票、delegate、waive、revoke 等治理状态。 |
| `PolicyEffectiveFact` / `SharedRuleSet` | 不复制 policy effective lifecycle;L3 只保留本域 formalization/consistency/body-boundary policy。 |
| `ControlApplicability` / `ControlReview` / compliance / nonconformity | 不引入控制项、合规结论、纠正措施或验证结果状态。 |
| projection/reference/outbox/report/handoff 章节 | 保留框架,但按 L3 的 read material、external source、publication、job report、handoff marker 重命名筛选。 |
| API/worker/job entry disposition | 保留技术状态框架,但状态名必须来自 L3 Step 6/8,不得复用 governance 命名。 |
| query helper / external marker | 保留 query no-write 与 marker-only 思路,但只承接 L3 的 availability/freshness/degradation/lineage surface。 |

### 8. R10.5 入口门禁

进入 `R10.5 状态主语筛选与排除表:先思考` 前必须满足:

- R10.4 已固定 Step 10 目标/非目标、输入材料、SOP 问答、通用规则、写法模板和状态族批次框架。
- 当前文件仍未写具体状态集合、ASCII 图或转换矩阵。
- 正式 `03-详细设计.md` 未修改。
- 后续筛选必须逐对象判断 enter / exclude / marker-only / watch / blocker,并回指 Step 6/7/8/9。
- 任何缺状态来源、读写面、marker 来源、version source 或 public surface 的候选必须记录 blocker,不得自行补口。

### 9. R10.4 stop-review

| 检查项 | 结果 |
|---|---|
| 是否写入 Step 10 目标 / 非目标 | pass |
| 是否写入输入材料表和 SOP 问答模板 | pass |
| 是否写入通用状态矩阵规则 | pass |
| 是否写入状态机写法模板 | pass |
| 是否写入状态族批次框架和 L1 差异裁剪 | pass |
| 是否未写具体状态集合或转换矩阵 | pass |
| 是否修改正式 `03-详细设计.md` | no |

next_allowed_action: 等待用户确认后进入 Step 10 `R10.5 状态主语筛选与排除表:先思考`;只允许思考状态主语候选池、排除规则、enter / exclude / marker-only / watch / blocker 判定标准、Step 6/7/8/9 回指方式和 `R10.6` 写入表结构;不得直接修改正式 `03-详细设计.md`;不得写具体状态集合、转换矩阵、非法转换错误 taxonomy、persistence schema、config key、test case schema、implementation code 或进入 Step 11。

---

## R10.5 状态主语筛选与排除表:先思考

### 1. 当前模块目标

`R10.5` 只思考状态主语筛选方法,为 `R10.6` 写入正式筛选表做准备。当前模块不对任何候选状态机写最终状态集合、ASCII 图或转换矩阵。

| 项 | 内容 |
|---|---|
| 本模块状态 | completed |
| 当前允许 | 思考候选池来源、判定类别、排除规则、回指字段、watch/blocker 记录方式和 `R10.6` 表结构。 |
| 当前禁止 | 写具体状态集合、From/To 转换、非法转换表、persistence schema、error taxonomy、config key、test case schema 或正式 `03-详细设计.md`。 |

### 2. 候选池来源思考

状态主语候选池必须从 Step 6/7/8/9 的已确认内容抽取,不得从旧 Step 10 或旧正式 03 直接恢复。

| 来源 | 提供什么 | R10.6 使用方式 |
|---|---|---|
| Step 6 §6.2~§6.10 | 对象族、对象责任、状态主语预筛、字段来源与暂停条件。 | 作为候选对象第一来源。 |
| Step 7 §7.2~§7.7 | repository / resolver / mapper / publisher / handoff / maintenance / runtime 读写面。 | 判断候选是否有正式读写面、version source、marker source。 |
| Step 8 §8.2~§8.9 | accepted / rejected / duplicate / stale / degraded / unavailable / blocked / partial / no-op 等 public surface。 | 判断是否只是 public surface 状态词,还是有独立状态主语。 |
| Step 9 R9.27~R9.44 | 161 个 flow 的 trigger、branch、side effect、watch ledger。 | 判断状态转换是否有 flow trigger 和 side-effect boundary。 |
| R10.4 通用规则 | 状态名、trigger、precondition、query no-write、maintenance no-truth-write、version source。 | 作为筛选裁决标准。 |

### 3. 判定类别思考

`R10.6` 的每个候选不直接写 `yes/no`,而应使用可审计类别。

| 判定类别 | 含义 | 后续处理 |
|---|---|---|
| `enter_state_matrix` | 候选拥有独立生命周期、正式状态字段或有限状态变体,并有 Step 7/9 读写/触发来源。 | 后续 R10.7+ 按状态族展开完整状态机。 |
| `marker_only` | 候选是 safe marker、decision、diagnostic、availability summary 或 public surface,不拥有独立转换矩阵。 | 后续作为 precondition、branch surface 或 mapper output 引用。 |
| `technical_local_state` | 候选是 API / worker / jobs / runtime / adapter 本地状态,不代表业务 truth。 | 后续放入 idempotency/runtime/entry 状态族,并明确不得反写 domain truth。 |
| `exclude_non_state` | 候选只是 typed ref、shell、context、payload boundary、raw body 禁入项或纯 helper。 | 后续不得进入状态矩阵。 |
| `watch_needs_later_step` | 候选看起来需要状态,但状态集合、persistence、error 或 concurrency 来源应由 Step 11~16 闭合。 | 后续保留 watch,不得提前补 schema。 |
| `blocker_missing_source` | 缺状态 owner、读写面、marker source、version source、public surface 或 flow trigger。 | 立即记录 blocker,暂停对应状态机写入。 |

### 4. 排除规则思考

| 排除项 | 排除理由 |
|---|---|
| `MethodLibraryTypedBoundaryRef` | typed ref 只承载身份,不拥有生命周期。 |
| `MethodLibraryPublicShell` | public shell 只承载协议边界,不能反向创造 domain state。 |
| request / response / event / job envelope | 协议壳不是状态 owner;状态只能来自对象、helper 或 entry result state。 |
| raw external body / artifact body / report body / provider payload | body-free 红线禁止进入 truth 或 state source。 |
| cache / lock / queue offset / scheduler lease / retry counter | 实现细节,不能成为设计状态矩阵。 |
| old `MethodContentLifecycle` / publish / snapshot / fingerprint / old outbox | historical pollution,当前只能作为禁入样本。 |
| marketplace transaction / install / fulfillment / UI state | 当前 L3 不拥有外围交易履约 truth。 |

### 5. 候选族预分组思考

下表只描述 `R10.6` 的候选分组方式,不是最终筛选结果。

| 候选族 | 主要候选 | 预期判定关注点 |
|---|---|---|
| business truth | definition、catalog、formalization、formal version、consumption material、relation、package、assembly | 是否有 state field / lifecycle helper / command trigger / versioned save。 |
| support / external / body boundary | basis summary、external summary、source/archive refs、body boundary rule | 是否是状态 owner,还是 resolver/marker-only summary。 |
| trace / audit / lineage / impact | trace material、impact summary、audit trail、evidence lineage、protection policy | 是否拥有 material freshness / disposition / safe decision,还是只作为 append/read support。 |
| read / material / query surface | read decision、degraded decision、availability/freshness marker、query empty/not-visible/stale/degraded/unavailable surface | query no-write;marker 只能复制 resolver/mapper/availability 输出。 |
| maintenance / job / report | maintenance task、progress view、run history、checkpoint、recovery issue、job result/report boundary | job 不修 core truth;checkpoint/cursor/version 不混用。 |
| idempotency / replay | idempotency guard、stored operation result、stored receipt/report replay | duplicate 不重跑 mutation;stored surface schema 后移 Step 11/13。 |
| runtime / adapter / entry | runtime assembly、adapter availability、store/source/publisher/handoff binding、API/worker/job entry result | local technical state 不等于业务生命周期。 |
| outbound / publication / handoff | event candidate assembly、publication outcome、publisher result、handoff outcome | candidate 与 publisher 分离;failed publication 不回滚 accepted truth。 |

### 6. Step 6/7/8/9 回指方式

`R10.6` 的筛选表必须让每一行都能被后续状态机引用,因此每个候选至少需要以下回指。

| 回指列 | 用途 |
|---|---|
| Step 6 object/helper | 说明候选的正式 owner 与字段来源。 |
| Step 7 read/write/source | 说明读取面、保存面、resolver/mapper/builder、version source 或 marker source。 |
| Step 8 public surface | 说明候选是否暴露为 accepted/rejected/duplicate/stale/degraded/unavailable/blocked/partial/no-op surface。 |
| Step 9 trigger/branch | 说明候选是否有 Command / Query / Inbound / Outbound / Job flow 触发。 |
| R10 判定 | enter / marker-only / technical local / exclude / watch / blocker。 |
| 后续模块 | 指向 R10.7~R10.24 的具体状态族或审计模块。 |

### 7. R10.6 写入表结构思考

`R10.6` 应写入三张表,保持可审计而不提前进入状态矩阵。

| 表 | 目标 | 必要列 |
|---|---|---|
| 候选池筛选表 | 对 Step 6/7/8/9 所有状态主语候选逐项裁决。 | candidate、owner module、candidate kind、Step 6 source、Step 7 source、Step 8 surface、Step 9 trigger、decision、reason、next module。 |
| 排除表 | 明确不得进入状态矩阵的对象/壳/旧材料。 | excluded item、source、reason、forbidden reuse。 |
| watch / blocker 表 | 保留缺口或后续 Step 正常闭口项。 | id、candidate、issue、required closure step、current handling。 |

### 8. R10.5 stop-review

| 检查项 | 结果 |
|---|---|
| 是否只思考筛选方法,未写最终筛选表 | pass |
| 是否覆盖 enter / exclude / marker-only / watch / blocker 判定 | pass |
| 是否明确 Step 6/7/8/9 回指方式 | pass |
| 是否明确 R10.6 写入表结构 | pass |
| 是否未写具体状态集合或转换矩阵 | pass |
| 是否修改正式 `03-详细设计.md` | no |

next_allowed_action: 等待用户确认后进入 Step 10 `R10.6 状态主语筛选与排除表:再写入`;只允许写入候选池筛选表、排除表、watch/blocker 表和后续状态族分配;不得直接修改正式 `03-详细设计.md`;不得写具体状态集合、ASCII 图、转换矩阵、非法转换错误 taxonomy、persistence schema、config key、test case schema、implementation code 或进入 Step 11。

---

## R10.6 状态主语筛选与排除表:再写入

### 1. 候选池筛选表

本表只裁决候选是否进入后续状态矩阵、作为 marker / technical local state 使用、排除或观察。它不定义状态集合、ASCII 图或转换边。

| candidate | owner | Step 6 source | Step 7 / 8 / 9 source | decision | reason | next module |
|---|---|---|---|---|---|---|
| `MethodAssetDefinition` | domain | core truth | definition repository;definition command/query flows | `enter_state_matrix` | 有创建、调整、退休 flow 和 versioned save。 | R10.7/R10.8 |
| `MethodAssetCatalogEntry` | domain | core truth | catalog repository;register/reclassify/retire flows | `enter_state_matrix` | 目录项有独立 truth 与变更 flow。 | R10.7/R10.8 |
| `FormalizationState` | domain | explicit state owner | formalization repository;eligibility/initiate/version flows | `enter_state_matrix` | `state_kind` 是正式状态主语候选。 | R10.7/R10.8 |
| `FormalMethodAssetVersion` | domain | core truth | version repository;establish/change/supersede/retire flows | `enter_state_matrix` | 正式版本有建立、变更、替代、退休 lifecycle。 | R10.7/R10.8 |
| `MethodAssetConsumptionMaterial` | domain | material truth | consumption material repository;availability resolver;material flows | `enter_state_matrix` | 受控材料有 freshness / availability / state marker 语义。 | R10.7/R10.8;R10.13/R10.14 |
| `MethodAssetRelation` | domain | relation truth | relation repository;relation mutation/query/event flows | `enter_state_matrix` | relation truth 与 integrity branch 需要单独状态审计。 | R10.7/R10.8;R10.11/R10.12 |
| `MethodPackage` | domain | peripheral truth | package repository;package command/query/publication flows | `enter_state_matrix` | package 组织 truth 有 composition / availability 分支。 | R10.7/R10.8 |
| `MethodSetAssembly` | domain | peripheral truth | assembly repository;assembly command/query/publication flows | `enter_state_matrix` | assembly summary 是外围组织 truth。 | R10.7/R10.8 |
| `FormalizationBasisSummary` | domain | support summary | basis repository;basis resolver;formalization flows | `marker_only` | 作为依据摘要与 precondition,不拥有独立生命周期。 | R10.9/R10.10 reference input |
| `ExternalSourceSummary` | domain | external summary | external summary repository;inbound/external query flows | `watch_needs_later_step` | 需要 Step 12/14 明确 unavailable/body violation 与 binding 来源。 | R10.9/R10.10 |
| `MethodAssetTraceMaterial` | domain | trace material | trace repository;trace query/refresh flows | `enter_state_matrix` | trace material 有 freshness / degraded / refresh 分支。 | R10.11/R10.12 |
| `ConsumptionImpactSummary` | domain | impact summary | impact repository;impact disposition command/job flows | `enter_state_matrix` | pending / unknown / disposition 需要状态层区分。 | R10.11/R10.12 |
| `MethodAssetAuditTrail` | domain | audit support | audit repository;command/query/audit assembly | `marker_only` | append/read support,不作为有限状态 lifecycle。 | R10.11/R10.12 input |
| `MethodAssetEvidenceLineage` | domain | lineage support | lineage repository;lineage query/audit flows | `marker_only` | lineage graph 只连接 refs,不拥有状态迁移。 | R10.11/R10.12 input |
| `FormalizationEligibilityRule` | domain policy | policy / guard | policy diagnostic builder;formalization precheck | `marker_only` | 输出 eligibility decision,不保存 state。 | R10.7/R10.8 precondition |
| `DefinitionUseBoundaryGuard` | domain policy | boundary guard | policy diagnostic builder;violation flow | `marker_only` | 输出 boundary marker / rejection reason。 | R10.9/R10.10 input |
| `DownstreamConsumptionBoundary` | domain policy | boundary decision | consumption flows;availability resolver | `watch_needs_later_step` | boundary 是否有持久 state owner 需 Step 11/12 继续闭口。 | R10.9/R10.10 |
| `ConsistencyProtectionPolicy` | domain policy | protection decision | impact/protection flows;recovery job input | `marker_only` | 作为 protection decision / precondition,不自动修复 truth。 | R10.11/R10.12 input |
| `RelationIntegrityRule` | domain policy | integrity decision | relation mutation flow;safe reason | `marker_only` | 输出 relation integrity decision。 | R10.11/R10.12 input |
| `ExternalBodyBoundaryRule` | domain policy | no-body rule | body-free adapter;body violation branches | `marker_only` | 输出 no-body violation marker。 | R10.9/R10.10 input |
| `PackageCompositionRule` | domain policy | composition decision | package/assembly flows;composition errors | `marker_only` | 输出 composition decision,不拥有 lifecycle。 | R10.7/R10.8 precondition |
| `MethodAssetIdempotencyGuard` | application | idempotency helper | idempotency / stored result port;duplicate branches | `enter_state_matrix` | reserve / complete / conflict / replay 需要并发闭口。 | R10.17/R10.18 |
| `MethodAssetStoredOperationResult` | application | stored result helper | stored result helper;duplicate replay surfaces | `enter_state_matrix` | accepted/rejected/ignored replay surface 需状态语义。 | R10.17/R10.18 |
| `MethodAssetReadDecision` | application | read decision | query resolver;degraded mapper;query no-write flows | `enter_state_matrix` | found/absent/not-visible/stale/degraded/unavailable 是 query helper state。 | R10.13/R10.14 |
| `MethodAssetDegradedDecision` | application | degraded decision | degraded mapper;Step 8 marker shell | `marker_only` | 只作为 degraded branch surface 和 safe diagnostic。 | R10.13/R10.14 input |
| `MethodAssetInboundIntakeDecision` | application | intake decision | inbound source port;inbound receipt flows | `technical_local_state` | accepted/ignored/rejected/delayed 属于 inbound local outcome。 | R10.17/R10.18 |
| `MethodAssetEventCandidateAssembly` | application | event candidate helper | candidate assembly;publisher port;outbound flows | `enter_state_matrix` | candidate 与 publication outcome 需分离审计。 | R10.19/R10.20 |
| `MethodAssetJobAssemblyContext` | application | job helper | job service;checkpoint/report/progress flows | `technical_local_state` | job assembly local state 不代表 domain lifecycle。 | R10.15/R10.16;R10.17/R10.18 |
| `MethodAssetRuntimeAssemblyState` | infra | runtime state | runtime registry;entry precheck;availability branches | `technical_local_state` | runtime assembly phase 是 technical state。 | R10.17/R10.18 |
| `MethodAssetAdapterAvailabilityState` | infra | adapter state | adapter availability port;unavailable/degraded branches | `technical_local_state` | adapter availability 不替代业务状态。 | R10.17/R10.18 |
| `MethodAssetStoreBindingState` | infra | store binding | persistence handoff;runtime precheck | `technical_local_state` | store readiness 是 runtime/binding state。 | R10.17/R10.18 |
| `MethodAssetExternalResolverBindingState` | infra | resolver binding | resolver port;external availability branches | `technical_local_state` | external resolver binding 是 adapter-local readiness。 | R10.17/R10.18 |
| `MethodAssetInboundSourceBindingState` | infra | inbound binding | inbound source port;consumer precheck | `technical_local_state` | source binding 不等于 inbound business truth。 | R10.17/R10.18 |
| `MethodAssetPublisherBindingState` | infra | publisher binding | publisher port;publication outcome | `technical_local_state` | publisher binding 只影响 publication local outcome。 | R10.17/R10.18;R10.19/R10.20 |
| `MethodAssetHandoffBindingState` | infra | handoff binding | handoff port;target registry;handoff outcome | `technical_local_state` | handoff target readiness 是 adapter-local state。 | R10.17/R10.18;R10.19/R10.20 |
| `MethodAssetApiCommandHandlerEntry` | api | entry object | API command facade;shared command template | `technical_local_state` | entry dispatch result 不代表 domain state。 | R10.17/R10.18 |
| `MethodAssetApiQueryHandlerEntry` | api | entry object | API query facade;query no-write template | `technical_local_state` | query handler state 只限 entry assembly。 | R10.17/R10.18 |
| `MethodAssetApiResponseAssemblyState` | api | response assembly | Step 8 response shell;entry result | `technical_local_state` | response assembly 不等同 transport status。 | R10.17/R10.18 |
| `MethodAssetInboundConsumerEntry` | worker | inbound entry | inbound consumer flows;receipt shell | `technical_local_state` | consumer entry result 不等同 broker ack。 | R10.17/R10.18 |
| `MethodAssetEventPublisherEntry` | worker | publisher entry | outbound publisher flows;publication outcome | `technical_local_state` | publisher entry state 不等同 delivery truth。 | R10.17/R10.18;R10.19/R10.20 |
| `MethodAssetWorkerEntryResultState` | worker | worker result | inbound/outbound worker result shell | `technical_local_state` | worker accepted/blocked/degraded 是 local surface。 | R10.17/R10.18 |
| `MethodAssetOperationJobEntry` | jobs | job entry | operations job service;job input shell | `technical_local_state` | job entry dispatch 不修 core truth。 | R10.17/R10.18 |
| `MethodAssetJobProgressAssemblyState` | jobs | progress assembly | progress view;checkpoint;report boundary | `enter_state_matrix` | progress/partial/degraded/report boundary 需 job/report状态族。 | R10.15/R10.16 |
| `MethodAssetJobEntryResultState` | jobs | job result | job result shell;run history;stored report | `technical_local_state` | completed/partial/blocked/failed/replayed 是 job local result。 | R10.15/R10.16;R10.17/R10.18 |

### 2. 排除表

| excluded item | source | reason | forbidden reuse |
|---|---|---|---|
| `MethodLibraryTypedBoundaryRef` | Step 6 contracts | typed identity,not lifecycle owner。 | 不得从 ref 字符串推导 state。 |
| `MethodLibraryPublicShell` | Step 6/8 contracts | protocol shell,not truth owner。 | 不得从 DTO 壳反向创造 domain state。 |
| `MethodAssetOperationContext` | Step 6 application | operation metadata/context。 | 不得把 actor/source/correlation 当 lifecycle。 |
| `MethodAssetRuntimeConfigBinding` | Step 6 infra | config binding ref,not state machine。 | 不得把 config profile 当业务状态。 |
| `MethodAssetInfraSafeDiagnostic` | Step 6 infra | safe diagnostic marker。 | 不得从 raw error text 推状态。 |
| `MethodAssetApiEntryContext` | Step 6 api | entry local context。 | 不得保存 HTTP / RPC request 或 auth state。 |
| `MethodAssetWorkerEntryContext` | Step 6 worker | worker local context。 | 不得恢复 broker ack / offset lifecycle。 |
| `MethodAssetJobRunnerContext` | Step 6 jobs | runner context。 | 不得恢复 scheduler / queue / lease lifecycle。 |
| old `MethodContentLifecycle` / publish / snapshot / fingerprint | historical material | 与当前 MethodAsset / Formalization 主线冲突。 | 不得作为状态名或迁移来源。 |
| raw external body / artifact body / report body / provider payload | body-free redline | 禁止进入 truth 或 state source。 | 不得作为 precondition、reason 或 recovery source。 |
| marketplace transaction / install / fulfillment / UI state | scope boundary | L3 不拥有外围交易履约 truth。 | 不得塞入 package / assembly 状态矩阵。 |

### 3. watch / blocker 表

| ID | candidate / topic | issue | required closure step | current handling |
|---|---|---|---|---|
| ML-D03-S10-WATCH-001 | `ExternalSourceSummary` | external unavailable、body violation、schema version support 是否形成状态 owner 仍需 error/config 闭口。 | Step 12 / Step 14 | 保留到 R10.9/R10.10 时只写已闭口部分。 |
| ML-D03-S10-WATCH-002 | `DownstreamConsumptionBoundary` | boundary adjustment 与 availability state 的持久 owner 仍需 Step 11 支撑。 | Step 11 / Step 12 | R10.9/R10.10 先按 boundary marker / decision 审计。 |
| ML-D03-S10-WATCH-003 | stored result / replay | stored accepted/rejected/ignored surface schema 仍未在 Step 10 定义。 | Step 11 / Step 13 | R10.17/R10.18 只定义 replay state boundary。 |
| ML-D03-S10-WATCH-004 | query stale/degraded/unavailable | marker 必须复制 resolver / mapper / availability 输出,不能由 query service 合成。 | Step 12 / Step 15 | R10.13/R10.14 必须记录 marker source。 |
| ML-D03-S10-WATCH-005 | event candidate persistence | candidate 是否 durable、publisher reload 来源、target registry binding 后移。 | Step 11 / Step 14 | R10.19/R10.20 只定义 candidate/outcome state boundary。 |
| ML-D03-S10-WATCH-006 | job checkpoint/report | checkpoint identity、report persistence、run history schema 后移。 | Step 11 / Step 13 / Step 15 | R10.15/R10.16 不写 durable schema。 |
| ML-D03-S10-BLOCK-001 | none | 当前筛选未发现必须回退 Step 6/7/8/9 的 hard blocker。 | n/a | 无暂停。 |

### 4. 后续状态族分配

| 后续模块 | 状态族 | 输入候选 |
|---|---|---|
| R10.7/R10.8 | business truth | definition、catalog、formalization、formal version、consumption material、relation、package、assembly。 |
| R10.9/R10.10 | source/reference/body-boundary | basis summary、external summary、definition/use boundary、downstream boundary、external body boundary。 |
| R10.11/R10.12 | trace/audit/lineage/impact | trace material、impact summary、audit trail、evidence lineage、protection / integrity decisions。 |
| R10.13/R10.14 | read/visibility/material freshness | read decision、degraded decision、consumption/trace freshness、query stale/degraded/unavailable surfaces。 |
| R10.15/R10.16 | maintenance/job/report | job assembly context、job progress assembly、job entry result,checkpoint/report/watch items。 |
| R10.17/R10.18 | idempotency/replay/runtime/entry | idempotency guard、stored result、runtime/adapter/store/source/publisher/handoff binding、API/worker/job local states。 |
| R10.19/R10.20 | outbound/publication/handoff | event candidate assembly、publisher binding/entry,publication outcome、handoff binding/outcome。 |
| R10.21/R10.22 | cross-state audit / handoff | all watch items、forbidden transitions、Step 11~16 handoff。 |
| R10.23/R10.24 | formal §9 candidate / stop-review | confirmed matrices only,not open watch assumptions。 |

### 5. R10.6 stop-review

| 检查项 | 结果 |
|---|---|
| 是否写入候选池筛选表 | pass |
| 是否写入排除表 | pass |
| 是否写入 watch / blocker 表 | pass |
| 是否写入后续状态族分配 | pass |
| 是否未写具体状态集合、ASCII 图或转换矩阵 | pass |
| 是否修改正式 `03-详细设计.md` | no |

next_allowed_action: 等待用户确认后进入 Step 10 `R10.7 business truth 状态机:先思考`;只允许思考 business truth 状态机的候选切分、输入来源、状态集合草案边界、触发 flow、precondition 来源和 `R10.8` 写入顺序;不得直接修改正式 `03-详细设计.md`;不得写 source/reference、trace/audit、read/material、maintenance/job、idempotency/runtime、outbound/handoff 的状态矩阵;不得写 persistence schema、error taxonomy、config key、test case schema、implementation code 或进入 Step 11。

---

## R10.7 business truth 状态机:先思考

### 1. 当前模块目标

`R10.7` 只思考 business truth 状态机如何切分、从哪些已闭口对象 / port / flow 取输入、哪些内容必须留到 `R10.8` 写入。当前模块不写最终状态集合、ASCII 图或 From / To 转换矩阵。

| 项 | 内容 |
|---|---|
| 本模块状态 | completed |
| 当前允许 | 思考 business truth 候选分组、输入来源、状态集合草案边界、触发 flow、precondition 来源、watch 约束和 `R10.8` 写入顺序。 |
| 当前禁止 | 写具体状态枚举、ASCII 图、From / To 矩阵、非法转换错误 taxonomy、persistence schema、config key、test case schema、implementation code 或正式 `03-详细设计.md`。 |

### 2. business truth 范围裁剪

`R10.8` 的 business truth 只覆盖 `R10.6` 已判定 `enter_state_matrix` 且属于 domain truth / peripheral truth 的候选。它不覆盖 source/reference、trace/audit、read/material、maintenance/job、idempotency/runtime 或 outbound/handoff 状态族。

| business truth 候选 | 纳入理由 | 本轮边界 |
|---|---|---|
| `MethodAssetDefinition` | 方法资产定义是稳定 truth anchor,有 establish / adjust / retire flow。 | 只写 definition lifecycle;不写 catalog、formal version 或 trace 状态。 |
| `MethodAssetCatalogEntry` | catalog entry 绑定 definition 与 scope,有 register / reclassify / retire flow。 | 只写 catalog truth 状态;catalog view / search material 后移 read/material。 |
| `FormalizationState` | Step 6 已把 `state_kind` 标为正式状态 owner。 | 只写 formalization 前置与版本建立前状态;不写治理正文或 basis resolver 内部状态。 |
| `FormalMethodAssetVersion` | 正式版本有 establish / semantic change / supersede / retire flow。 | 只写版本 lifecycle 与替代边界;不恢复 publish / snapshot / fingerprint。 |
| `MethodAssetConsumptionMaterial` | 受控消费材料有 prepare / mark state flow 和 availability / freshness 输入。 | 只写材料 truth 状态边界;具体 stale / degraded marker 来源在 R10.13/R10.14 交叉审计。 |
| `MethodAssetRelation` | typed relation 有 establish / adjust / constrain / supersede / retire flow。 | 只写 relation truth 状态;relation integrity diagnostic 和 trace impact 后移 R10.11/R10.12。 |
| `MethodPackage` | 外围包组织是当前 L3 拥有的 peripheral truth。 | 只写 package 组织 lifecycle;不写 marketplace listing/order/install/fulfillment。 |
| `MethodSetAssembly` | 方法集 assembly 有 assemble / adjust / retire / mark availability flow。 | 只写 assembly 组织 truth;不写组织运行配置或 UI state。 |

### 3. 输入来源思考

business truth 状态机不能从 DTO 壳、query material、event candidate 或 old Step 10 状态恢复。每个状态机至少需要同时回指 Step 6 object、Step 7 repository/source、Step 8 public surface 和 Step 9 trigger。

| 输入层 | 可用来源 | R10.8 使用方式 |
|---|---|---|
| Step 6 object | `MethodAssetDefinition`;`MethodAssetCatalogEntry`;`FormalizationState`;`FormalMethodAssetVersion`;`MethodAssetConsumptionMaterial`;`MethodAssetRelation`;`MethodPackage`;`MethodSetAssembly`。 | 作为状态 owner 与字段来源。 |
| Step 7 repository | definition、catalog、formalization、formal version、consumption material、relation、package、assembly repositories。 | 作为 load / save / expected version 来源,但不写 persistence schema。 |
| Step 7 resolver / mapper | basis resolver、policy diagnostic builder、availability resolver、degraded mapper、distribution/peripheral builder。 | 只作为 precondition / marker 来源,不得在状态机中定义内部算法。 |
| Step 8 protocol | Command accepted / rejected / duplicate surface;Query read-only surface;event candidate outcome。 | 只用来校验 public result 不与状态机冲突,不从 DTO 反推 truth state。 |
| Step 9 flow | R9.36 command overlay 是 business truth 转换 trigger 第一来源。 | 每条转换必须回指至少一个 command flow;query/outbound 只能作为 read/publication side effect。 |

### 4. 状态集合草案边界

下表只定义 `R10.8` 可以展开的状态切片,不是最终状态名或状态集合。

| 候选 | 状态切片思考 | R10.8 注意事项 |
|---|---|---|
| `MethodAssetDefinition` | 创建后可调整、可退休、退休后仍可读的 definition lifecycle。 | 不允许把 catalog retired 或 formal version retired 合并进 definition state。 |
| `MethodAssetCatalogEntry` | scoped registration、classification adjustment、retirement 的 catalog lifecycle。 | catalog entry 不创建或删除 definition truth。 |
| `FormalizationState` | eligibility evaluation、formalization initiation、version establishment 前后的 formalization readiness。 | eligibility diagnostic 是 precondition,不等于 formal version state。 |
| `FormalMethodAssetVersion` | version establishment、semantic change、supersession、retirement 的 version lifecycle。 | superseded 与 retired 的区别需由 command trigger 和 relation/source 保持可审计。 |
| `MethodAssetConsumptionMaterial` | material preparation、availability/state marking、受控消费边界下的 material lifecycle。 | availability marker 只能复制 resolver / mapper 输出;缺 marker 进入 watch。 |
| `MethodAssetRelation` | relation creation、adjustment、constraint、supersession、retirement。 | integrity violation 是 precondition / diagnostic;不直接替代 relation lifecycle。 |
| `MethodPackage` | package establishment、composition adjustment、retirement、availability marking。 | unavailable marker 不影响 member asset truth。 |
| `MethodSetAssembly` | assembly creation、adjustment、retirement、stale/unavailable marking。 | assembly stale/unavailable 不执行 refresh job,只记录 truth-side marker。 |

### 5. trigger flow 库存

`R10.8` 写转换矩阵时,trigger 只能来自下列 Step 9 Command flow。Query、Outbound 和 Job 不得成为 business truth mutation trigger。

| 状态机候选 | trigger flow 来源 |
|---|---|
| `MethodAssetDefinition` | `EstablishMethodAssetDefinitionFlow`;`AdjustMethodAssetDefinitionFlow`;`RetireMethodAssetDefinitionFlow`。 |
| `MethodAssetCatalogEntry` | `RegisterMethodAssetCatalogEntryFlow`;`ReclassifyMethodAssetCatalogEntryFlow`;`RetireMethodAssetCatalogEntryFlow`。 |
| `FormalizationState` | `EvaluateMethodAssetFormalizationEligibilityFlow`;`InitiateMethodAssetFormalizationFlow`;`EstablishFormalMethodAssetVersionFlow` 前置校验分支。 |
| `FormalMethodAssetVersion` | `EstablishFormalMethodAssetVersionFlow`;`RecordFormalVersionSemanticChangeFlow`;`SupersedeFormalMethodAssetVersionFlow`;`RetireFormalMethodAssetVersionFlow`。 |
| `MethodAssetConsumptionMaterial` | `PrepareMethodAssetConsumptionMaterialFlow`;`MarkMethodAssetConsumptionMaterialStateFlow`。 |
| `MethodAssetRelation` | `EstablishMethodAssetRelationFlow`;`AdjustMethodAssetRelationFlow`;`ConstrainMethodAssetRelationFlow`;`SupersedeMethodAssetRelationFlow`;`RetireMethodAssetRelationFlow`。 |
| `MethodPackage` | `EstablishMethodPackageFlow`;`AdjustMethodPackageCompositionFlow`;`RetireMethodPackageFlow`;`MarkMethodPackageUnavailableFlow`。 |
| `MethodSetAssembly` | `AssembleMethodSetFlow`;`AdjustMethodSetAssemblyFlow`;`RetireMethodSetAssemblyFlow`;`MarkMethodSetAssemblyStaleOrUnavailableFlow`。 |

### 6. precondition 来源思考

| precondition 类别 | 来源 | 使用限制 |
|---|---|---|
| expected version / optimistic consistency | Step 7 repository versioned save;Step 9 command overlay。 | Step 10 可写 precondition,不写 SQL / index / transaction detail。 |
| identity / typed ref validity | Step 6 typed ref;Step 7 repository exact read / lookup。 | 不得从 route、raw name、marketplace id、string parse 生成 ref。 |
| formalization eligibility | `FormalizationEligibilityRule`;basis resolver;policy diagnostic builder。 | 只作为 `FormalizationState` / version establish 的 guard。 |
| package / assembly composition | `PackageCompositionRule`;package / assembly repositories;policy diagnostic builder。 | 不暴露完整规则算法,只写 safe decision precondition。 |
| consumption availability / boundary | availability resolver;downstream boundary support;degraded mapper。 | marker 只能复制来源;缺来源记录 watch,不合成。 |
| relation integrity / constraint | `RelationIntegrityRule`;relation repository;formal version / distribution support。 | integrity diagnostic 不直接改 definition 或 version truth。 |
| active dependent truth conflict | linked formal version、consumption material、assembly、distribution material 等 repository family。 | 只写需要检查的依赖族,不定义持久化查询 schema。 |

### 7. side effect 边界思考

business truth accepted 转换可以产生 body-free history、audit hint、event candidate 或 stored result,但这些不是 business truth 状态机的一部分。

| side effect | R10.8 写法 |
|---|---|
| history / audit hint | 只列为 accepted transition side effect;实际 audit 状态后移 R10.11/R10.12 和 Step 15。 |
| stored operation result | 只列为 duplicate replay source;状态细节后移 R10.17/R10.18 和 Step 13。 |
| event candidate | 只列为 outbound candidate source;publication outcome 后移 R10.19/R10.20。 |
| query readability | 退休、替代、不可用等状态仍可 read 的 public surface 由 Query 状态族审计。 |
| maintenance hint | business truth 不由 Job 直接修复;job 只能刷新派生材料或报告。 |

### 8. watch / blocker 思考

| ID | topic | R10.7 判断 | R10.8 处理 |
|---|---|---|---|
| ML-D03-S10-BT-WATCH-001 | `MethodAssetConsumptionMaterial` availability marker | Step 9 明确 service 不能合成 marker。 | R10.8 可写转换边界,但 marker source 必须回指 resolver / mapper;缺来源不得补。 |
| ML-D03-S10-BT-WATCH-002 | package / assembly unavailable marker | mark unavailable / stale flow 依赖 degraded mapper / availability port。 | R10.8 只写复制 marker 的转换,不写 marker 枚举细节。 |
| ML-D03-S10-BT-WATCH-003 | formal version supersession owner | Step 9 允许 previous / next pair,但具体 pairing owner 和 persistence 后移。 | R10.8 只写 lifecycle 约束和 trigger,不写 table/index。 |
| ML-D03-S10-BT-BLOCK-001 | none | 当前 business truth 思考未发现必须回退 Step 6/7/8/9 的 hard blocker。 | 无暂停。 |

### 9. R10.8 写入顺序思考

`R10.8` 应按业务主线从核心资产到外围组织写入,每个状态机保持相同模板:状态 owner、状态集合、ASCII 图、转换矩阵、非法转换占位、side effect 边界、停审表。

| 顺序 | 写入对象 | 原因 |
|---|---|---|
| 1 | `MethodAssetDefinition` | definition 是其他 business truth 的主 anchor。 |
| 2 | `MethodAssetCatalogEntry` | catalog 依赖 definition,但不影响 formalization owner。 |
| 3 | `FormalizationState` | formalization 是 formal version 的前置 owner。 |
| 4 | `FormalMethodAssetVersion` | version 是 consumption material 与 relation 的上游。 |
| 5 | `MethodAssetConsumptionMaterial` | material 依赖 version 与 consumption boundary。 |
| 6 | `MethodAssetRelation` | relation 连接 definition/version/material/peripheral refs。 |
| 7 | `MethodPackage` | package 是外围组织 truth,依赖 member refs。 |
| 8 | `MethodSetAssembly` | assembly 依赖 package/member refs,最后写入。 |

### 10. R10.7 stop-review

| 检查项 | 结果 |
|---|---|
| 是否只思考 business truth 状态机切分 | pass |
| 是否列出输入来源和 trigger flow 库存 | pass |
| 是否明确 precondition 与 side effect 来源 | pass |
| 是否规划 R10.8 写入顺序 | pass |
| 是否未写最终状态集合、ASCII 图或 From / To 矩阵 | pass |
| 是否修改正式 `03-详细设计.md` | no |

next_allowed_action: 等待用户确认后进入 Step 10 `R10.8 business truth 状态机:再写入`;只允许写入 business truth 状态机的状态集合、ASCII 图、转换矩阵、非法转换占位、side effect 边界和停审表;不得直接修改正式 `03-详细设计.md`;不得写 source/reference、trace/audit、read/material、maintenance/job、idempotency/runtime、outbound/handoff 的状态矩阵;不得写 persistence schema、error taxonomy、config key、test case schema、implementation code 或进入 Step 11。

---

## R10.8 business truth 状态机:再写入

### 1. 写入范围

本模块只写入 `R10.6` 已判定进入 business truth 状态矩阵的 8 个状态主语。所有状态名均为 Step 10 中间产物候选,后续正式装配前仍需 `R10.21`~`R10.24` 做跨状态机审计。

| 状态主语 | owner | repository source | trigger source |
|---|---|---|---|
| `MethodAssetDefinition` | domain core truth | `MethodAssetDefinitionRepository` | definition command flows |
| `MethodAssetCatalogEntry` | domain core truth | `MethodAssetCatalogEntryRepository` | catalog command flows |
| `FormalizationState` | domain state owner | `FormalizationStateRepository` | formalization / version command flows |
| `FormalMethodAssetVersion` | domain core truth | `FormalMethodAssetVersionRepository` | formal version command flows |
| `MethodAssetConsumptionMaterial` | domain material truth | `MethodAssetConsumptionMaterialRepository` | consumption material command flows |
| `MethodAssetRelation` | domain relation truth | `MethodAssetRelationRepository` | relation command flows |
| `MethodPackage` | domain peripheral truth | `MethodPackageRepository` | package command flows |
| `MethodSetAssembly` | domain peripheral truth | `MethodSetAssemblyRepository` | assembly command flows |

### 2. `MethodAssetDefinition` 状态机

状态集合:

| state | 含义 | public read |
|---|---|---|
| `Active` | definition 已建立,可被调整、编目、正式化或追溯引用。 | readable |
| `Retired` | definition 已退休,历史仍可读,不得继续调整或创建新 catalog/formalization 主线。 | readable historical |

`commit-03-b` Rust-facing lifecycle carrier 使用 `MethodAssetDefinitionLifecycle = Active | Retired`。该 carrier 是 `MethodAssetDefinition.definition_lifecycle` 的持久化字段,由 definition repository 作为 `Versioned<MethodAssetDefinition>` 的一部分读写。实现当前 boundary 时必须使用这两个 exact labels;不得引入 draft/proposed/deprecated/superseded、catalog status、formal version state、HTTP status、string status、stored result kind 或 fake private side-state 代替 definition lifecycle。

```text
[virtual:not_created]
  | EstablishMethodAssetDefinitionFlow
  v
[Active] --AdjustMethodAssetDefinitionFlow--> [Active]
   |
   | RetireMethodAssetDefinitionFlow
   v
[Retired]
```

| from | trigger | precondition | to | side effect boundary |
|---|---|---|---|---|
| virtual not created | `EstablishMethodAssetDefinitionFlow` | valid identity key;accepted external summary refs if provided;no duplicate replay mutation | `Active` | definition history;definition changed event candidate;stored accepted result |
| `Active` | `AdjustMethodAssetDefinitionFlow` | exact definition read exposes `definition_lifecycle = Active`;expected version;basis/external summaries safe;policy diagnostic accepted | `Active` | definition history;audit hint;stored result |
| `Active` | `RetireMethodAssetDefinitionFlow` | exact definition read exposes `definition_lifecycle = Active`;expected version;safe retirement marker | `Retired` | retired history;definition changed event candidate |

`commit-03-b` state-matrix carve-out: definition retirement does not require a formal-version repository precheck in this boundary. Formal-version traceability, active formal-version conflict policy, and any reasoned exception are PH-04 formalization/version concerns and require a separately closed `FormalMethodAssetVersionRepository` callable surface before implementation.

非法转换占位:

| from | forbidden trigger | reason |
|---|---|---|
| `Retired` | adjust / retire again / establish duplicate | retired definition is historical truth;duplicate must replay stored result or reject safely |
| any | query / outbound / job flow | Query no-write;Outbound publishes candidate only;Job must not mutate core truth |

### 3. `MethodAssetCatalogEntry` 状态机

状态集合:

| state | 含义 | public read |
|---|---|---|
| `Registered` | catalog entry 已绑定 definition 与 catalog scope。 | readable |
| `Retired` | catalog entry 已退休,不再作为当前发现入口。 | readable historical |

`commit-03-a` Rust-facing status carrier 使用 `MethodAssetCatalogEntryStatus = Pending | Visible | Hidden | Deprecated | Retired`。该 status 是 catalog public/truth summary status,用于 contracts/domain 当前边界落码;本状态机中的 `Registered` 是 transition matrix 的内部 lifecycle 归纳名。`commit-03-b` exact mapping: `Registered == MethodAssetCatalogEntryStatus::Visible`, `Retired == MethodAssetCatalogEntryStatus::Retired`;`Pending` / `Hidden` / `Deprecated` 是闭合枚举标签但不由当前六条 accepted service flow 生成,也不得被实现端默认为 `Registered`。实现当前 boundary 时必须使用这些 exact labels,并将具体转换规则限制在本矩阵允许的 register / reclassify / retire trigger 内,不得引入 HTTP status、search visibility、feature flag、cache state 或 string status。

```text
[virtual:not_created]
  | RegisterMethodAssetCatalogEntryFlow
  v
[Registered] --ReclassifyMethodAssetCatalogEntryFlow--> [Registered]
      |
      | RetireMethodAssetCatalogEntryFlow
      v
  [Retired]
```

| from | trigger | precondition | to | side effect boundary |
|---|---|---|---|---|
| virtual not created | `RegisterMethodAssetCatalogEntryFlow` | linked definition exists;scoped catalog lookup allows new entry;expected scope valid | `Registered` / `Visible` | catalog history;catalog entry changed event candidate;stored result |
| `Registered` / `Visible` | `ReclassifyMethodAssetCatalogEntryFlow` | exact catalog read exposes `catalog_status = Visible`;expected version;policy diagnostic accepts new scope | `Registered` / `Visible` | catalog history;catalog changed event candidate |
| `Registered` / `Visible` | `RetireMethodAssetCatalogEntryFlow` | exact catalog read exposes `catalog_status = Visible`;expected version;safe retirement marker | `Retired` | catalog retired history;catalog event candidate |

非法转换占位:

| from | forbidden trigger | reason |
|---|---|---|
| `Retired` | reclassify / register duplicate | retirement does not delete history and cannot recreate same truth in place |
| any | create or retire definition | catalog state never mutates `MethodAssetDefinition` |
| `Pending` / `Hidden` / `Deprecated` | reclassify / retire as current `Registered` | these labels are not generated by the current six accepted service flows and cannot be silently treated as `Visible` in `commit-03-b` |

### 4. `FormalizationState` 状态机

状态集合:

| state | 含义 | public read |
|---|---|---|
| `AssessmentPending` | formalization 已被触发或评估,但 basis / eligibility 尚未闭合。 | readable diagnostic |
| `Eligible` | eligibility 已通过,允许建立 formal version。 | readable |
| `Ineligible` | eligibility 被安全拒绝,需要新 basis 或新 trigger 重新评估。 | readable diagnostic |
| `VersionEstablished` | 已基于该 formalization 建立 formal version,本状态成为历史依据。 | readable historical |

上述 labels 是 `commit-04-a` exact Rust-facing `FormalizationStateKind` carrier。`FormalizationState.state_kind` 必须保存这些 labels,不得恢复旧 `not-started` / `in-review` / `accepted` / `rejected` / `blocked` 或 publish/review lifecycle。

```text
[virtual:not_started]
  | InitiateMethodAssetFormalizationFlow / EvaluateMethodAssetFormalizationEligibilityFlow
  v
[AssessmentPending] --Evaluate(pass)--> [Eligible]
        |                    |
        | Evaluate(fail)     | EstablishFormalMethodAssetVersionFlow
        v                    v
   [Ineligible] --------> [VersionEstablished]
        | re-evaluate with new basis
        v
 [AssessmentPending]
```

| from | trigger | precondition | to | side effect boundary |
|---|---|---|---|---|
| virtual not started | `InitiateMethodAssetFormalizationFlow` | definition/catalog refs exist;trigger supported;basis resolver returns safe summary or pending marker | `AssessmentPending` | formalization state history;decision event candidate |
| virtual not started / `AssessmentPending` / `Ineligible` | `EvaluateMethodAssetFormalizationEligibilityFlow` | definition/catalog loaded;basis resolver and policy diagnostic return pending/insufficient/pass/fail safe decision | `AssessmentPending` / `Eligible` / `Ineligible` | stored diagnostic result;decision event candidate |
| `Eligible` | `EstablishFormalMethodAssetVersionFlow` | eligible state exact read;expected version;basis summary exact read | `VersionEstablished` | version established event candidate;formalization history |

非法转换占位:

| from | forbidden trigger | reason |
|---|---|---|
| `AssessmentPending` / `Ineligible` | establish formal version | formal version can only be created from `Eligible` state |
| `VersionEstablished` | re-initiate / re-evaluate in place | established formalization is historical basis;new cycle requires formal new state owner if later design allows |

### 5. `FormalMethodAssetVersion` 状态机

状态集合:

| state | 含义 | public read |
|---|---|---|
| `Active` | formal version 已建立,可作为 current / consumption / relation source。 | readable |
| `Superseded` | formal version 已被后续 version 替代,仍可历史读取。 | readable historical |
| `Retired` | formal version 已退休,不得作为新 consumption material 来源。 | readable historical |

上述 labels 是 `commit-04-a` exact Rust-facing `FormalMethodAssetVersionState` carrier,并保存于 `FormalMethodAssetVersion.version_state`。旧 `candidate` / `current` labels 不再是 truth state,不得用 latest timestamp、publish flag、fingerprint 或 snapshot 推导。

```text
[virtual:not_created]
  | EstablishFormalMethodAssetVersionFlow
  v
[Active] --RecordFormalVersionSemanticChangeFlow--> [Active]
   |  \
   |   \ SupersedeFormalMethodAssetVersionFlow
   |    v
   | [Superseded]
   v
[Retired]
```

| from | trigger | precondition | to | side effect boundary |
|---|---|---|---|---|
| virtual not created | `EstablishFormalMethodAssetVersionFlow` | formalization state is `Eligible`;basis summary exact read;id generated by formal source | `Active` | version history;version established candidate;stored result |
| `Active` | `RecordFormalVersionSemanticChangeFlow` | exact version read;expected version;semantic change basis accepted | `Active` | semantic change history;version changed candidate |
| `Active` | `SupersedeFormalMethodAssetVersionFlow` | previous and next versions loaded;pair validated;next not missing | `Superseded` | supersession pairing hint;impact trigger candidate |
| `Active` / `Superseded` | `RetireFormalMethodAssetVersionFlow` | exact version read;retirement reason accepted | `Retired` | retired event candidate |

非法转换占位:

| from | forbidden trigger | reason |
|---|---|---|
| `Retired` | semantic change / supersede / prepare new material | retired version is historical and cannot become active source again |
| any | establish from latest timestamp / fingerprint / publish state | current design forbids old publish/snapshot/fingerprint source |

### 6. `MethodAssetConsumptionMaterial` 状态机

状态集合:

| state | 含义 | public read |
|---|---|---|
| `Prepared` | body-free consumption material 已从 formal version 和 context 创建。 | readable |
| `Ready` | availability resolver 判定可用。 | readable |
| `Stale` | availability / freshness marker 判定材料陈旧。 | readable stale |
| `Unavailable` | availability resolver 判定当前不可用。 | readable unavailable surface |
| `Constrained` | consumption boundary 判定受限。 | readable constrained surface |

```text
[virtual:not_created]
  | PrepareMethodAssetConsumptionMaterialFlow
  v
[Prepared] --MarkMethodAssetConsumptionMaterialStateFlow--> [Ready]
     |                         |                     |
     +------------------------> [Stale]              |
     +------------------------> [Unavailable]        |
     +------------------------> [Constrained] <------+
```

| from | trigger | precondition | to | side effect boundary |
|---|---|---|---|---|
| virtual not created | `PrepareMethodAssetConsumptionMaterialFlow` | formal version loaded and not retired;context/boundary accepted;availability source present | `Prepared` | material prepared event candidate;stored result |
| `Prepared` / `Ready` / `Stale` / `Unavailable` / `Constrained` | `MarkMethodAssetConsumptionMaterialStateFlow` | exact material read;availability resolver/degraded mapper returns formal marker;service does not synthesize marker | `Ready` / `Stale` / `Unavailable` / `Constrained` | availability changed candidate;stored result |

非法转换占位:

| from | forbidden trigger | reason |
|---|---|---|
| virtual not created | mark material state | material must be prepared before availability marker can be copied |
| any | query refresh / job refresh as direct mutation | Query and Job cannot create or mutate material truth in this business state machine |
| any | marker synthesized by service | marker must come from resolver / mapper output;missing marker remains watch/blocker |

### 7. `MethodAssetRelation` 状态机

状态集合:

| state | 含义 | public read |
|---|---|---|
| `Active` | relation 已建立,可被调整、约束或用于分发语义。 | readable |
| `Constrained` | relation 已带正式 scope / context constraint marker。 | readable constrained |
| `Superseded` | relation 被后续 relation 替代,历史仍可读。 | readable historical |
| `Retired` | relation 已退休,不得继续作为 active distribution source。 | readable historical |

```text
[virtual:not_created]
  | EstablishMethodAssetRelationFlow
  v
[Active] --AdjustMethodAssetRelationFlow--> [Active]
   |  \
   |   \ ConstrainMethodAssetRelationFlow
   |    v
   | [Constrained] --AdjustMethodAssetRelationFlow--> [Constrained]
   |       | \
   |       |  \ SupersedeMethodAssetRelationFlow
   |       v   v
   |   [Retired] [Superseded]
   v
[Retired]
```

| from | trigger | precondition | to | side effect boundary |
|---|---|---|---|---|
| virtual not created | `EstablishMethodAssetRelationFlow` | endpoint definition/version refs loaded;relation inputs accepted | `Active` | relation changed event candidate;stored result |
| `Active` / `Constrained` | `AdjustMethodAssetRelationFlow` | exact relation read;expected version;policy diagnostic accepted | same state | relation history;relation changed candidate |
| `Active` | `ConstrainMethodAssetRelationFlow` | scope/context validated from formal support;constraint marker source present | `Constrained` | relation changed candidate |
| `Active` / `Constrained` | `SupersedeMethodAssetRelationFlow` | previous/next relation loaded;next candidate exists | `Superseded` | relation changed candidate;historical pairing hint |
| `Active` / `Constrained` | `RetireMethodAssetRelationFlow` | exact relation read;active distribution conflict handled safely | `Retired` | relation material invalidated candidate |

非法转换占位:

| from | forbidden trigger | reason |
|---|---|---|
| `Superseded` / `Retired` | adjust / constrain / supersede again | historical relation remains readable but cannot be active source |
| any | modify definition/version truth | relation flow never mutates endpoint truth |

### 8. `MethodPackage` 状态机

状态集合:

| state | 含义 | public read |
|---|---|---|
| `Active` | package 已建立,composition 可调整。 | readable |
| `Unavailable` | package availability marker 显示不可用,但 member asset truth 不受影响。 | readable unavailable surface |
| `Retired` | package 已退休,只保留历史组织记录。 | readable historical |

```text
[virtual:not_created]
  | EstablishMethodPackageFlow
  v
[Active] --AdjustMethodPackageCompositionFlow--> [Active]
   |  \
   |   \ MarkMethodPackageUnavailableFlow
   |    v
   | [Unavailable]
   v
[Retired]
```

| from | trigger | precondition | to | side effect boundary |
|---|---|---|---|---|
| virtual not created | `EstablishMethodPackageFlow` | member definition/version refs valid;composition rule accepted | `Active` | package changed event candidate;stored result |
| `Active` | `AdjustMethodPackageCompositionFlow` | exact package read;expected version;composition diagnostic accepted | `Active` | package/composition event candidate |
| `Active` | `MarkMethodPackageUnavailableFlow` | exact package read;degraded mapper / availability port returns formal marker | `Unavailable` | peripheral availability event candidate |
| `Active` / `Unavailable` | `RetireMethodPackageFlow` | exact package read;active assembly conflict rejected or safely handled | `Retired` | package changed event candidate |

非法转换占位:

| from | forbidden trigger | reason |
|---|---|---|
| `Unavailable` | adjust composition without formal availability / composition decision | unavailable marker source and composition decision cannot be guessed |
| `Retired` | adjust / mark unavailable / establish duplicate | retired package is historical truth |
| any | marketplace install / transaction / fulfillment mutation | L3 package state does not own marketplace lifecycle |

### 9. `MethodSetAssembly` 状态机

状态集合:

| state | 含义 | public read |
|---|---|---|
| `Active` | assembly 已建立,可被调整或退休。 | readable |
| `Stale` | assembly marker 显示读取材料或外围视图陈旧。 | readable stale surface |
| `Unavailable` | assembly marker 显示外围组装当前不可用。 | readable unavailable surface |
| `Retired` | assembly 已退休,只保留历史组合记录。 | readable historical |

```text
[virtual:not_created]
  | AssembleMethodSetFlow
  v
[Active] --AdjustMethodSetAssemblyFlow--> [Active]
   |  \
   |   \ MarkMethodSetAssemblyStaleOrUnavailableFlow
   |    v
   | [Stale] <--> [Unavailable]
   v
[Retired]
```

| from | trigger | precondition | to | side effect boundary |
|---|---|---|---|---|
| virtual not created | `AssembleMethodSetFlow` | package/member refs valid;consumption boundary accepted | `Active` | method set changed candidate;stored result |
| `Active` | `AdjustMethodSetAssemblyFlow` | exact assembly read;expected version;policy diagnostic accepted | `Active` | method set changed candidate |
| `Active` / `Stale` / `Unavailable` | `MarkMethodSetAssemblyStaleOrUnavailableFlow` | exact assembly read;degraded mapper / availability port returns stale or unavailable marker | `Stale` / `Unavailable` | peripheral availability event candidate |
| `Active` / `Stale` / `Unavailable` | `RetireMethodSetAssemblyFlow` | exact assembly read;replacement hint handled safely if required | `Retired` | assembly changed candidate |

非法转换占位:

| from | forbidden trigger | reason |
|---|---|---|
| `Retired` | adjust / mark stale / mark unavailable | retired assembly is historical truth |
| any | refresh job as direct assembly mutation | refresh jobs may update derived material/report only,not assembly truth |
| any | organization runtime config mutation | assembly state does not own UI / SDK / org runtime state |

### 10. business truth side effect 总表

| side effect | 允许来源 | 后续承接 |
|---|---|---|
| body-free history | accepted Command transition | Step 11 persistence;Step 15 audit |
| stored result | command accepted / rejected / duplicate | R10.17/R10.18;Step 13 |
| event candidate | accepted business truth transition | R10.19/R10.20;Step 14 publisher binding |
| trace / audit candidate | accepted definition/version/relation transition | R10.11/R10.12;Step 15 |
| impact hint | version/relation/material retirement or supersession | R10.11/R10.12;Step 12 recovery mapping |

### 11. R10.8 stop-review

| 检查项 | 结果 |
|---|---|
| 是否写入 8 个 business truth 状态机 | pass |
| 是否每个状态机都有状态集合、ASCII 图和转换矩阵 | pass |
| 是否写入非法转换占位 | pass |
| 是否限定 side effect 边界 | pass |
| 是否未写 source/reference、trace/audit、read/material、maintenance/job、idempotency/runtime、outbound/handoff 状态矩阵 | pass |
| 是否未写 persistence schema、error taxonomy、config key、test case schema 或 implementation code | pass |
| 是否修改正式 `03-详细设计.md` | no |

next_allowed_action: 等待用户确认后进入 Step 10 `R10.9 source/reference/body-boundary 状态机:先思考`;只允许思考 basis summary、external summary、definition/use boundary、downstream boundary、external body boundary 的状态主语切分、输入来源、状态集合草案边界、trigger flow、marker/precondition 来源和 `R10.10` 写入顺序;不得直接修改正式 `03-详细设计.md`;不得写 trace/audit、read/material、maintenance/job、idempotency/runtime、outbound/handoff 的状态矩阵;不得写 persistence schema、error taxonomy、config key、test case schema、implementation code 或进入 Step 11。

---

## R10.9 source/reference/body-boundary 状态机:先思考

### 1. 当前模块目标

`R10.9` 只思考 source/reference/body-boundary 状态族如何切分,为 `R10.10` 写入做准备。当前模块不写最终状态集合、ASCII 图或 From / To 转换矩阵。

| 项 | 内容 |
|---|---|
| 本模块状态 | completed |
| 当前允许 | 思考 basis summary、external summary、external typed ref、artifact/archive ref、definition/use guard、downstream boundary、external body boundary 的状态主语筛选、输入来源、trigger flow、marker/precondition 来源和 `R10.10` 写入顺序。 |
| 当前禁止 | 写最终状态集合、ASCII 图、From / To 矩阵、非法转换错误 taxonomy、persistence schema、config key、test case schema、implementation code 或正式 `03-详细设计.md`。 |

### 2. 状态主语筛选思考

本组容易把 typed ref、resolver output 和 policy diagnostic 误当成 truth lifecycle。`R10.10` 必须先裁剪状态主语,再写少量已闭口的 support / boundary 状态机。

| 候选 | Step 6/7/9 来源 | R10.9 判定 | R10.10 处理 |
|---|---|---|---|
| `FormalizationBasisSummary` | Step 6 support summary;Step 7 basis repository / resolver;Step 9 accept / mark disposition flow | `enter_support_state_matrix_with_watch` | 可写 basis acceptance / disposition 状态边界;不得读取治理正文或 artifact body。 |
| `ExternalSourceSummary` | Step 6 external support summary;Step 7 external repository / external adapter;Step 9 capture / supersede / inbound accepted flow | `enter_support_state_matrix_with_watch` | 可写 captured / accepted / superseded / unavailable 边界;unavailable 细节后移 Step 12/14。 |
| `ExternalSourceRef` | Step 6 typed external ref;Step 9 register / inbound source ref accepted flow | `reference_marker_only` | 不写完整 lifecycle;只作为 source summary、artifact、basis、event candidate 的 typed ref 输入。 |
| `ArtifactArchiveRef` | Step 6 typed artifact/archive ref;Step 9 register / inbound artifact flow | `reference_marker_only` | 不写完整 lifecycle;只写 ref support / no-body boundary 输入。 |
| `DefinitionUseBoundaryGuard` | Step 6 guard object;Step 9 record violation flow | `enter_boundary_judgement_matrix` | 可写 guard judgement / violation marker 状态边界;不得成为权限系统。 |
| `DownstreamConsumptionBoundary` | Step 6 boundary object;Step 7 material / boundary family;Step 9 register / adjust boundary flow | `enter_boundary_judgement_matrix_with_watch` | 可写 registered / adjusted / constrained judgement 边界;持久 owner 细节后移 Step 11。 |
| `ExternalBodyBoundaryRule` | Step 6 no-body rule;Step 7 policy diagnostic / external adapter;Step 9 assert / reject body candidate flow | `enter_boundary_judgement_matrix` | 可写 body-free assertion / rejected candidate judgement 边界;不得保存正文、摘录或 provider payload。 |

### 3. 输入来源思考

| 输入层 | 可用来源 | R10.10 使用方式 |
|---|---|---|
| Step 6 object | `FormalizationBasisSummary`;`ExternalSourceSummary`;`DefinitionUseBoundaryGuard`;`DownstreamConsumptionBoundary`;`ExternalBodyBoundaryRule`。 | 作为状态 owner 或 boundary judgement owner。 |
| Step 6 typed refs | `ExternalSourceRef`;`ArtifactArchiveRef`;`GovernanceBasisRef`;`ConsumptionContextRef`。 | 只作为 opaque 输入和回指,不得解析字符串生成状态。 |
| Step 7 repository | basis summary repository;external summary repository;consumption material / boundary support family。 | 作为 exact read / lookup / versioned support save 来源,不写 schema。 |
| Step 7 resolver / adapter | basis resolver;external body-free adapter;policy diagnostic builder;availability resolver。 | 只提供 body-free summary、safe marker、diagnostic 和 boundary decision。 |
| Step 9 command flow | boundary、external、basis、body assertion command overlay。 | 作为 `R10.10` transition trigger 第一来源。 |
| Step 9 inbound flow | body-free external summary/source/artifact accepted intake。 | 只能作为 external summary/ref intake source;若要改写 truth 仍需显式 command 或正式 repository owner。 |

### 4. trigger flow 库存

| 状态主语 / 支撑项 | trigger flow 来源 | 备注 |
|---|---|---|
| `FormalizationBasisSummary` | `AcceptExternalBasisSummaryFlow`;`MarkExternalBasisDispositionFlow` | basis acceptance / disposition 只保存 safe summary 和 marker。 |
| `ExternalSourceSummary` | `CaptureExternalSourceSummaryFlow`;`SupersedeExternalSourceSummaryFlow`;`ConsumeBodyFreeExternalSummaryAcceptedFlow` as intake source | inbound 只承接 body-free intake,不得保存 raw payload。 |
| `ExternalSourceRef` | `RegisterExternalSourceRefFlow`;`ConsumeExternalSourceRefRegisteredFlow` as intake source | 只支持 typed ref registration / intake summary。 |
| `ArtifactArchiveRef` | `RegisterArtifactArchiveRefFlow`;`ConsumeArtifactArchiveRefRegisteredFlow` as intake source | 只支持 artifact/archive body-free ref。 |
| `DefinitionUseBoundaryGuard` | `RecordDefinitionUseBoundaryViolationFlow` | 记录 body-free violation line / marker。 |
| `DownstreamConsumptionBoundary` | `RegisterDownstreamConsumptionBoundaryFlow`;`AdjustDownstreamConsumptionBoundaryFlow` | boundary 不等于 auth matrix 或 downstream runtime truth。 |
| `ExternalBodyBoundaryRule` | `AssertExternalBodyBoundaryFlow`;`RejectExternalBodyCandidateFlow` | 只记录 assertion / rejection safe summary。 |

### 5. 状态集合草案边界

下表只描述 `R10.10` 可展开的状态切片,不是最终状态名或状态集合。

| 状态主语 | 状态切片思考 | R10.10 注意事项 |
|---|---|---|
| `FormalizationBasisSummary` | pending/accepted/rejected/disposition-marked 的依据摘要可用性边界。 | basis resolver 可给 pending / insufficient marker,但不保存治理正文。 |
| `ExternalSourceSummary` | captured/accepted/superseded/unavailable 的外部摘要边界。 | unavailable 只写为 marker 来源约束,具体错误映射后移 Step 12/14。 |
| `DefinitionUseBoundaryGuard` | guard observed / violation recorded / rejected judgement。 | guard 不拥有 downstream runtime 或 permission matrix。 |
| `DownstreamConsumptionBoundary` | registered / adjusted / constrained / unavailable marker 边界。 | boundary 持久 owner 仍需 Step 11,此处只写状态语义。 |
| `ExternalBodyBoundaryRule` | asserted clean / body candidate rejected / invalid candidate judgement。 | 不保存正文、摘录、hash 正文、URL/path 或 provider payload。 |
| `ExternalSourceRef` / `ArtifactArchiveRef` | registration support only。 | 若 R10.10 需要出现,只能放在输入表和非法推导表,不单独写状态机。 |

### 6. precondition / marker 来源思考

| precondition / marker | 来源 | 使用限制 |
|---|---|---|
| basis resolution marker | `FormalizationBasisResolverPort` | 可标记 pending / insufficient / rejected,不得读取标准全文或 evidence body。 |
| external body-free summary | `ExternalBodyFreeSourceAdapterPort`;`ExternalSourceSummaryRepository` | 只返回 safe refs / summary digest / marker,不得返回 provider payload。 |
| body boundary diagnostic | `MethodAssetPolicyDiagnosticBuilderPort`;`ExternalBodyBoundaryRule` | 只输出 safe reason 和 no-body marker。 |
| consumption boundary judgement | boundary support family;availability resolver;policy diagnostic builder | 不表达鉴权矩阵、安装状态、handoff/delivery 成功或下游 runtime truth。 |
| typed ref validity | Step 6 typed ref + Step 7 exact read / lookup | 不得从 URL、path、route param、raw downstream id 或 external id 拼 ref。 |
| stored result / duplicate | stored result helper | 只作为 duplicate replay source,不写 replay schema。 |

### 7. watch / blocker 思考

| ID | topic | R10.9 判断 | R10.10 处理 |
|---|---|---|---|
| ML-D03-S10-SRC-WATCH-001 | `ExternalSourceSummary` unavailable / schema support | Step 6/7/9 已有 body-free summary 和 adapter来源,但 unavailable 分类细节属于 Step 12/14。 | R10.10 只写 unavailable marker boundary,不写错误 taxonomy 或 config key。 |
| ML-D03-S10-SRC-WATCH-002 | `DownstreamConsumptionBoundary` persistence owner | Step 9 写了 boundary support/material family,Step 11 才闭 schema。 | R10.10 写状态语义和 trigger,不写保存表、索引或 owner 推断。 |
| ML-D03-S10-SRC-WATCH-003 | `ExternalSourceRef` / `ArtifactArchiveRef` lifecycle | 它们是 typed ref / support input,不是完整 truth lifecycle。 | R10.10 不为二者单独发明状态机。 |
| ML-D03-S10-SRC-BLOCK-001 | none | 当前 source/reference/body-boundary 思考未发现必须回退 Step 6/7/8/9 的 hard blocker。 | 无暂停。 |

### 8. R10.10 写入顺序思考

| 顺序 | 写入对象 | 原因 |
|---|---|---|
| 1 | `FormalizationBasisSummary` | basis 是 formalization/version 前置依据,先写 support summary。 |
| 2 | `ExternalSourceSummary` | external summary 是 basis、lineage、source view 的 body-free 输入。 |
| 3 | `DefinitionUseBoundaryGuard` | guard 保护 definition/formal version 不被 use 侧反写。 |
| 4 | `DownstreamConsumptionBoundary` | boundary 约束 consumption material 和 context。 |
| 5 | `ExternalBodyBoundaryRule` | no-body rule 横跨 external summary、artifact、basis、lineage。 |
| 6 | typed ref / no-body 禁止推导表 | `ExternalSourceRef` / `ArtifactArchiveRef` 只作为输入和禁入审计。 |

### 9. R10.9 stop-review

| 检查项 | 结果 |
|---|---|
| 是否只思考 source/reference/body-boundary 状态族 | pass |
| 是否区分状态 owner、typed ref 和 marker-only 输入 | pass |
| 是否列出输入来源、trigger flow 和 precondition / marker 来源 | pass |
| 是否规划 R10.10 写入顺序 | pass |
| 是否未写最终状态集合、ASCII 图或 From / To 矩阵 | pass |
| 是否修改正式 `03-详细设计.md` | no |

next_allowed_action: 等待用户确认后进入 Step 10 `R10.10 source/reference/body-boundary 状态机:再写入`;只允许写入 `FormalizationBasisSummary`、`ExternalSourceSummary`、`DefinitionUseBoundaryGuard`、`DownstreamConsumptionBoundary`、`ExternalBodyBoundaryRule` 的状态集合、ASCII 图、转换矩阵、非法转换占位、typed ref 禁止推导表、side effect 边界和停审表;不得直接修改正式 `03-详细设计.md`;不得写 trace/audit、read/material、maintenance/job、idempotency/runtime、outbound/handoff 的状态矩阵;不得写 persistence schema、error taxonomy、config key、test case schema、implementation code 或进入 Step 11。

---

## R10.10 source/reference/body-boundary 状态机:再写入

### 1. 写入范围

本模块只写 source/reference/body-boundary 状态族。`ExternalSourceRef` 与 `ArtifactArchiveRef` 是 typed ref / support input,不单独拥有 lifecycle 状态机。

| 状态主语 | owner | trigger source | 当前处理 |
|---|---|---|---|
| `FormalizationBasisSummary` | domain support summary | `AcceptExternalBasisSummaryFlow`;`MarkExternalBasisDispositionFlow` | 写 support summary 状态机 |
| `ExternalSourceSummary` | domain external support summary | `CaptureExternalSourceSummaryFlow`;`SupersedeExternalSourceSummaryFlow`;inbound body-free intake source | 写 external summary 状态机 |
| `DefinitionUseBoundaryGuard` | domain guard judgement | `RecordDefinitionUseBoundaryViolationFlow` | 写 boundary judgement 状态机 |
| `DownstreamConsumptionBoundary` | domain consumption boundary judgement | `RegisterDownstreamConsumptionBoundaryFlow`;`AdjustDownstreamConsumptionBoundaryFlow` | 写 boundary 状态机 |
| `ExternalBodyBoundaryRule` | domain no-body rule judgement | `AssertExternalBodyBoundaryFlow`;`RejectExternalBodyCandidateFlow` | 写 body-boundary judgement 状态机 |

### 2. `FormalizationBasisSummary` 状态机

状态集合:

| state | 含义 | public read |
|---|---|---|
| `Accepted` | basis summary 已从 external summary / governance basis safe ref 接受。 | readable |
| `PendingDisposition` | basis disposition marker 表明仍需补充依据或后续判断。 | readable diagnostic |
| `RejectedDisposition` | basis disposition marker 表明该 basis 不能支撑 formalization。 | readable diagnostic |

```text
[virtual:not_created]
  | AcceptExternalBasisSummaryFlow
  v
[Accepted] --MarkExternalBasisDispositionFlow--> [Accepted]
     |                    |
     |                    +--> [PendingDisposition]
     +------------------------> [RejectedDisposition]
```

| from | trigger | precondition | to | side effect boundary |
|---|---|---|---|---|
| virtual not created | `AcceptExternalBasisSummaryFlow` | external summary loaded;safe governance / external basis ref present;no governance body fetched | `Accepted` | external summary changed candidate;stored result |
| `Accepted` / `PendingDisposition` / `RejectedDisposition` | `MarkExternalBasisDispositionFlow` | exact basis summary read;external summary loaded when required;formal disposition marker source present | `Accepted` / `PendingDisposition` / `RejectedDisposition` | external summary changed candidate;stored result |

非法转换占位:

| from | forbidden trigger | reason |
|---|---|---|
| virtual not created | mark disposition | disposition must copy onto an existing basis summary |
| any | read governance body / standard text / artifact body | basis summary is body-free support material |
| any | create formal version directly | basis only supports formalization precondition |

### 3. `ExternalSourceSummary` 状态机

状态集合:

| state | 含义 | public read |
|---|---|---|
| `Captured` | body-free external summary 已被 capture / intake。 | readable |
| `Accepted` | summary 可作为 basis、lineage 或 external view 的安全来源。 | readable |
| `Superseded` | summary 已被新 summary 替代,历史仍可追溯。 | readable historical |
| `Unavailable` | external adapter / resolver 给出 unavailable safe marker。 | readable unavailable surface |

```text
[virtual:not_created]
  | CaptureExternalSourceSummaryFlow / body-free inbound intake
  v
[Captured] --capture/intake accepted marker--> [Accepted]
     |             |
     |             +--SupersedeExternalSourceSummaryFlow--> [Superseded]
     +--unavailable marker--> [Unavailable]
```

| from | trigger | precondition | to | side effect boundary |
|---|---|---|---|---|
| virtual not created | `CaptureExternalSourceSummaryFlow` | external source ref valid;external body-free adapter returns safe summary or unavailable marker;raw body rejected | `Captured` / `Unavailable` | external summary changed candidate;stored result |
| virtual not created | `ConsumeBodyFreeExternalSummaryAcceptedFlow` as intake source | inbound envelope validated;dedup accepted;body-free summary refs present | `Captured` / `Accepted` | stored consumer receipt;handoff hint optional |
| `Captured` | accepted marker copied from adapter / intake | marker source present;summary digest body-free | `Accepted` | external summary changed candidate |
| `Captured` / `Accepted` | `SupersedeExternalSourceSummaryFlow` | previous and next summaries loaded;next exists;lineage traceable | `Superseded` | external summary changed candidate;evidence lineage hint |

非法转换占位:

| from | forbidden trigger | reason |
|---|---|---|
| `Superseded` | update in place as current summary | superseded summary remains historical only |
| any | derive from URL/path/provider payload | external source identity must come from typed ref and adapter summary |
| any | save provider body / archive body | external summary is body-free |

### 4. `DefinitionUseBoundaryGuard` 状态机

状态集合:

| state | 含义 | public read |
|---|---|---|
| `Monitoring` | guard 可用于检查 definition/formal version 是否被 use 侧反写。 | readable diagnostic |
| `ViolationRecorded` | 已记录 body-free violation marker / safe reason。 | readable diagnostic |
| `RejectedCandidate` | violation candidate 因缺 safe reason 或非法 body 输入被拒绝。 | readable diagnostic |

```text
[Monitoring]
   | RecordDefinitionUseBoundaryViolationFlow
   v
[ViolationRecorded]
   ^
   | invalid candidate / raw body rejected
[RejectedCandidate]
```

| from | trigger | precondition | to | side effect boundary |
|---|---|---|---|---|
| `Monitoring` | `RecordDefinitionUseBoundaryViolationFlow` | guard ref valid;safe violation summary present;raw request body absent | `ViolationRecorded` | guard violation event candidate;audit / trace candidate;stored result |
| `Monitoring` | `RecordDefinitionUseBoundaryViolationFlow` rejected branch | safe reason missing or candidate needs raw body | `RejectedCandidate` | safe rejection surface;stored result |

非法转换占位:

| from | forbidden trigger | reason |
|---|---|---|
| any | mutate definition / formal version / consumption material | guard records boundary judgement only |
| any | store downstream payload or permission matrix | guard is not authorization system or downstream runtime truth |

### 5. `DownstreamConsumptionBoundary` 状态机

状态集合:

| state | 含义 | public read |
|---|---|---|
| `Registered` | consumption context 与 boundary summary 已登记。 | readable |
| `Constrained` | boundary 当前限制 consumption material 或 use kind。 | readable constrained |
| `Unavailable` | boundary / availability source 当前不可用。 | readable unavailable surface |

```text
[virtual:not_created]
  | RegisterDownstreamConsumptionBoundaryFlow
  v
[Registered] --AdjustDownstreamConsumptionBoundaryFlow--> [Registered]
     |                         |
     +------------------------> [Constrained]
     +------------------------> [Unavailable]
```

| from | trigger | precondition | to | side effect boundary |
|---|---|---|---|---|
| virtual not created | `RegisterDownstreamConsumptionBoundaryFlow` | consumption context refs valid;raw downstream id rejected;policy diagnostic accepted | `Registered` / `Constrained` | boundary changed event candidate;trace candidate;stored result |
| `Registered` / `Constrained` / `Unavailable` | `AdjustDownstreamConsumptionBoundaryFlow` | boundary owner loaded;expected version;adjustment reason safe;availability/diagnostic marker source present when changing marker state | `Registered` / `Constrained` / `Unavailable` | boundary changed event candidate;stored result |

非法转换占位:

| from | forbidden trigger | reason |
|---|---|---|
| any | adjust formal version truth | boundary adjustment cannot mutate formal version |
| any | store auth matrix / install state / downstream runtime truth | boundary is safe consumption judgement only |
| any | create ref from raw downstream id | context ref must be formal typed ref |

### 6. `ExternalBodyBoundaryRule` 状态机

状态集合:

| state | 含义 | public read |
|---|---|---|
| `AssertedBodyFree` | candidate 已通过 no-body assertion。 | readable diagnostic |
| `BodyCandidateRejected` | candidate 因包含或需要正文被拒绝。 | readable diagnostic |
| `InvalidCandidate` | candidate ref / safe reason 不完整,无法形成正式判断。 | readable diagnostic |

```text
[virtual:not_checked]
  | AssertExternalBodyBoundaryFlow
  v
[AssertedBodyFree]
  |
  | RejectExternalBodyCandidateFlow
  v
[BodyCandidateRejected]

[virtual:not_checked] --invalid candidate--> [InvalidCandidate]
```

| from | trigger | precondition | to | side effect boundary |
|---|---|---|---|---|
| virtual not checked | `AssertExternalBodyBoundaryFlow` | external/artifact candidate ref present;policy diagnostic builder returns body-free assertion | `AssertedBodyFree` / `InvalidCandidate` | body boundary violation candidate;stored result |
| virtual not checked / `AssertedBodyFree` | `RejectExternalBodyCandidateFlow` | candidate ref and safe reason present;no payload excerpt persisted | `BodyCandidateRejected` | boundary violation event candidate;audit candidate;stored result |

非法转换占位:

| from | forbidden trigger | reason |
|---|---|---|
| any | save body excerpt / provider payload / archive path | rule only records body-free ref, marker and safe reason |
| any | create external summary from rejected body | rejected body cannot become truth source |

### 7. typed ref 禁止推导表

| typed ref | 允许用途 | 禁止推导 |
|---|---|---|
| `ExternalSourceRef` | external summary、basis、artifact、event candidate 的 opaque input。 | 从 URL、path、provider id、route param、payload field 拼接 ref。 |
| `ArtifactArchiveRef` | artifact/archive boundary、lineage、body-boundary assertion 的 opaque input。 | 从 object storage path、archive body、package file、retention policy 推状态。 |
| `GovernanceBasisRef` | formalization basis summary 的 safe ref input。 | 读取治理正文、审批过程、标准全文或 evidence body。 |
| `ConsumptionContextRef` | downstream boundary / material context input。 | 从 raw downstream id、tenant runtime id、install id 或 UI state 拼接。 |

### 8. side effect 边界

| side effect | 允许来源 | 后续承接 |
|---|---|---|
| external summary changed candidate | basis / external command accepted | R10.19/R10.20 outbound;Step 14 binding |
| boundary violation event candidate | guard / body boundary accepted | R10.19/R10.20 outbound;Step 15 audit |
| audit / trace candidate | definition-use violation or body rejection | R10.11/R10.12;Step 15 |
| stored result / receipt | command / inbound duplicate replay | R10.17/R10.18;Step 13 |

### 8.1 `commit-02-b` current-boundary state closure supplement

当前 implementation boundary `commit-02-b` 只允许把 source/reference/body-boundary 与 trace/relation protection family 中的 judgement state 收窄为 shared domain foundation。实现端当前只允许落码以下 exact labels:

| current-boundary state carrier | exact labels | current implementation rule |
|---|---|---|
| `DefinitionUseBoundaryGuardState` | `Monitoring`;`ViolationRecorded`;`RejectedCandidate` | 只表达 guard judgement,不 materialize definition truth / formal version lifecycle。 |
| `DownstreamConsumptionBoundaryState` | `Registered`;`Constrained`;`Unavailable` | 只表达 boundary judgement,不 materialize durable owner / material lifecycle / auth matrix。 |
| `ConsistencyProtectionJudgement` | `ProtectionEstablished`;`UnknownImpactPending`;`ProtectionConstrained`;`InputRejected` | 只表达 protection judgement,不执行 recovery 或 report progression。 |
| `RelationIntegrityJudgement` | `IntegritySatisfied`;`IntegrityPending`;`ViolationMarked`;`IntegrityRejected` | 只表达 integrity judgement,不重写 relation truth lifecycle or runtime graph state。 |
| `ExternalBodyBoundaryState` | `AssertedBodyFree`;`BodyCandidateRejected`;`InvalidCandidate` | 只表达 no-body judgement,不保存 provider body / archive path / payload excerpt。 |

以下 state owner 在 `commit-02-b` 明确后移:

| deferred state owner / family | defer reason |
|---|---|
| `FormalizationState`;`FormalMethodAssetVersion`;`MethodAssetConsumptionMaterial` | business truth / material owner 归 `commit-04-a` / `commit-05-a`+。 |
| `MethodAssetDefinition`;`MethodAssetCatalogEntry`;`MethodAssetRelation`;`MethodPackage`;`MethodSetAssembly` | truth lifecycle later;当前 boundary 不得抢写。 |
| `FormalizationBasisSummary`;`ExternalSourceSummary`;`MethodAssetTraceMaterial`;`ConsumptionImpactSummary`;`MethodAssetAuditTrail`;`MethodAssetEvidenceLineage` | source / trace / support owner later;当前 boundary 只允许 judgement shell。 |
| read/material、maintenance/job、replay/runtime、outbound/handoff families | application / infra / worker / jobs owning boundary later。 |

### 9. R10.10 stop-review

| 检查项 | 结果 |
|---|---|
| 是否写入 5 个 source/reference/body-boundary 状态机 | pass |
| 是否保留 `ExternalSourceRef` / `ArtifactArchiveRef` 为 typed ref 输入而非 lifecycle owner | pass |
| 是否写入非法转换占位和 typed ref 禁止推导表 | pass |
| 是否限定 side effect 边界 | pass |
| 是否未写 trace/audit、read/material、maintenance/job、idempotency/runtime、outbound/handoff 状态矩阵 | pass |
| 是否未写 persistence schema、error taxonomy、config key、test case schema 或 implementation code | pass |
| 是否修改正式 `03-详细设计.md` | no |

next_allowed_action: 等待用户确认后进入 Step 10 `R10.11 trace/audit/lineage/impact 状态机:先思考`;只允许思考 trace material、impact summary、audit trail、evidence lineage、protection / integrity decisions 的状态主语切分、输入来源、状态集合草案边界、trigger flow、marker/precondition 来源和 `R10.12` 写入顺序;不得直接修改正式 `03-详细设计.md`;不得写 read/material、maintenance/job、idempotency/runtime、outbound/handoff 的状态矩阵;不得写 persistence schema、error taxonomy、config key、test case schema、implementation code 或进入 Step 11。

---

## R10.11 trace/audit/lineage/impact 状态机:先思考

### 1. 当前模块目标

`R10.11` 只思考 trace / audit / lineage / impact 状态族的状态主语切分、输入来源、状态集合草案边界、trigger flow、marker / precondition 来源和 `R10.12` 写入顺序。当前模块不写最终状态集合、ASCII 图或 From / To 转换矩阵。

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm |
| 当前允许 | 思考 `MethodAssetTraceMaterial`、`ConsumptionImpactSummary`、`MethodAssetAuditTrail`、`MethodAssetEvidenceLineage`、`ConsistencyProtectionPolicy`、`RelationIntegrityRule` 的状态主语裁剪、输入来源、trigger、marker 来源、watch 和 R10.12 写入顺序。 |
| 当前禁止 | 写最终状态集合、ASCII 图、From / To 转换矩阵、read/material freshness、maintenance/job/report、idempotency/runtime、outbound/handoff、persistence schema、error taxonomy、config key、test case schema、implementation code 或正式 `03-详细设计.md`。 |

### 2. 状态主语裁剪思考

本组对象容易把 support material、append-only trail、lineage graph 和 policy diagnostic 混成一个大 lifecycle。`R10.12` 必须先固定 owner,再写矩阵。

| 候选 | Step 6/7/9 来源 | R10.11 判定 | R10.12 处理 |
|---|---|---|---|
| `MethodAssetTraceMaterial` | Step 6 trace material;Step 7 trace repository;Step 9 organize / mark / query / refresh / publication flows。 | `enter_state_matrix` | 写完整状态集合、ASCII 图、转换矩阵和非法转换占位。 |
| `ConsumptionImpactSummary` | Step 6 impact summary;Step 7 impact repository;Step 9 register / mark disposition / pending impact query / protection flow。 | `enter_state_matrix` | 写完整状态集合、ASCII 图、转换矩阵和 unknown / pending 禁止折叠规则。 |
| `MethodAssetAuditTrail` | Step 6 audit trail;Step 7 audit repository;Step 9 organize audit trail / audit trail query / audit publication。 | `support_append_boundary` | 不写有限业务 lifecycle;写 append/read support 边界、可用性 marker 和非法 raw log 输入。 |
| `MethodAssetEvidenceLineage` | Step 6 evidence lineage;Step 7 lineage repository;Step 9 link lineage / lineage query / external lineage / publication。 | `support_graph_boundary` | 不写完整 lifecycle;写 link / supersede / unavailable 作为 support graph 判断边界。 |
| `ConsistencyProtectionPolicy` | Step 6 policy;Step 7 policy diagnostic builder;Step 9 establish protection decision / protection diagnostic / recovery convergence input。 | `judgement_boundary` | 写 decision / pending / insufficient 输入边界,不写 recovery 执行状态。 |
| `RelationIntegrityRule` | Step 6 rule;Step 7 policy diagnostic builder + relation repository;Step 9 evaluate / mark violation / relation integrity diagnostic。 | `judgement_boundary` | 写 integrity diagnostic / violation marker 边界,不重复 `MethodAssetRelation` truth lifecycle。 |

### 3. 输入来源思考

| 输入层 | 可用来源 | R10.12 使用方式 |
|---|---|---|
| Step 6 object contracts | trace material、impact summary、audit trail、evidence lineage、protection policy、integrity rule 的字段和 body-free 禁止事项。 | 作为状态主语和 marker/input 字段边界。 |
| Step 7 repository family | trace / impact / audit / lineage / relation repository exact read、subject lookup、pending/unknown page、versioned save。 | 作为 transition precondition 和 expected-version source,不写 persistence schema。 |
| Step 7 policy diagnostic builder | protection、integrity、boundary、safe reason、follow-up hint 的 diagnostic 来源。 | protection / integrity judgement 只能复制 builder 输出,不能由 service 拼 marker。 |
| Step 7 degraded mapper | freshness、partial、unavailable、安全 diagnostic 到 degraded decision 的映射来源。 | trace / audit / lineage 的 degraded marker 只可复制正式 mapper 输出。 |
| Step 9 command flows | organize trace、mark trace state、register impact、mark impact disposition、establish protection decision、organize audit trail、link lineage、evaluate / mark integrity。 | 作为 R10.12 transition trigger 第一来源。 |
| Step 9 query flows | get trace material、get impact summary、list pending impacts、get protection diagnostic、get audit trail、get lineage、get relation integrity diagnostic。 | 只作为 read disposition / public surface 检查,不反向发明 domain truth。 |
| Step 9 job flows | refresh trace/audit/impact materials、run consistency recovery convergence。 | 只能触发 derived material/report/progress 输入,不能自动修复 core truth 或 relation truth。 |
| Step 9 outbound flows | trace changed、impact changed、protection decision changed、audit trail changed、lineage changed、integrity changed。 | 只作为 accepted transition side effect 候选,不写 publication outcome 状态。 |

### 4. 状态切片草案边界

下表只描述 R10.12 可展开的状态切片,不是最终状态名或状态集合。

| 状态主语 | 状态切片思考 | R10.12 注意事项 |
|---|---|---|
| `MethodAssetTraceMaterial` | organized / marked / stale-or-degraded / unavailable-support 等切片。 | 状态必须绑定 trace subject、source object refs、source cursor 和 marker 来源;不得保存 raw log、event payload 或 evidence body。 |
| `ConsumptionImpactSummary` | registered / unknown / pending / disposition-marked / constrained 等切片。 | unknown 与 pending 必须显式保留;不得将 unknown 变成 no-effect;不得读取下游 runtime truth。 |
| `MethodAssetAuditTrail` | audit owner present、safe history refs appended、subject lookup unavailable、partial item degraded。 | 写 support 边界即可;不发明 audit entry lifecycle 或 raw stream state。 |
| `MethodAssetEvidenceLineage` | lineage refs linked、external/basis refs connected、linked ref missing degraded、body rejected。 | 只连接 refs;不得保存 artifact body、archive path、provider payload 或 report body。 |
| `ConsistencyProtectionPolicy` | protection decision established、insufficient impact pending、blocked/constrained decision、recovery handoff needed。 | decision 不执行 recovery;recovery job 只能消费 decision / issue ref。 |
| `RelationIntegrityRule` | integrity evaluated、violation marker copied、insufficient refs pending、safe reason missing rejected/watch。 | 不重复 relation active/superseded truth;不暴露 rule matrix 或 graph algorithm。 |

### 5. trigger flow 思考

| trigger family | 相关 flow | 状态影响边界 |
|---|---|---|
| trace organize / mark | `OrganizeMethodAssetTraceMaterialFlow`;`MarkMethodAssetTraceMaterialStateFlow` | 创建 / 更新 trace material marker;marker 必须来自正式 mapper/source。 |
| impact register / disposition | `RegisterConsumptionImpactSummaryFlow`;`MarkConsumptionImpactDispositionFlow` | 创建 impact summary;保留 unknown/pending;disposition 只能复制正式 marker。 |
| protection decision | `EstablishConsistencyProtectionDecisionFlow`;`GetConsistencyProtectionDiagnosticFlow` | 记录 decision / pending diagnostic;不执行 recovery。 |
| audit organize | `OrganizeMethodAssetAuditTrailFlow`;`GetMethodAssetAuditTrailFlow` | 组织 body-free audit trail 和 safe history refs;raw audit payload rejected。 |
| lineage link | `LinkMethodAssetEvidenceLineageFlow`;`LinkExternalEvidenceLineageFlow`;`GetMethodAssetEvidenceLineageFlow` | 连接 lineage refs;missing linked ref 进入 degraded/watch。 |
| relation integrity | `EvaluateRelationIntegrityFlow`;`MarkRelationIntegrityViolationFlow`;`GetRelationIntegrityDiagnosticFlow` | 复制 diagnostic / violation safe reason;不创建 relation side effect。 |
| refresh / recovery jobs | `RefreshTraceAuditImpactMaterialsFlow`;`RunConsistencyRecoveryConvergenceFlow` | 只刷新 derived support material、report partial issue 或 recovery issue;不修改 core truth。 |
| publication side effects | trace / impact / protection / audit / lineage / integrity changed publication flows。 | 只作为后续 R10.19/R10.20 的 publication candidate 输入。 |

### 6. precondition / marker 来源思考

| precondition / marker | 来源 | 使用限制 |
|---|---|---|
| trace subject refs | Step 6 typed refs + Step 7 trace repository lookup。 | 不得从 route、raw object id、log line、artifact path 推导。 |
| trace degraded / stale marker | Step 7 degraded mapper;trace repository freshness / cursor helper。 | service 只能复制 marker;缺 marker 必须 watch/blocker,不能合成。 |
| impact disposition marker | impact summary repository + policy diagnostic builder。 | no-effect 不能替代 unknown;disposition 必须有 safe reason。 |
| protection diagnostic | `MethodAssetPolicyDiagnosticBuilderPort`。 | diagnostic summary body-free;不能包含 recovery algorithm body。 |
| integrity violation reason | relation repository exact read + policy diagnostic builder。 | violation marker / safe reason 只能复制;不能暴露 rule matrix。 |
| audit subject / actor / reason refs | Step 6 safe actor / reason refs;Step 7 audit repository。 | 不得用 raw request body、stack trace、telemetry detail 作为 audit identity。 |
| evidence lineage refs | external summary、basis summary、trace material、audit trail typed refs。 | 不得读取 evidence body、archive body、provider payload 或 report body。 |
| stored result / duplicate | Step 6 stored result helper;Step 9 duplicate overlay。 | 只作为 replay source,不在 R10.12 写 replay schema。 |

### 7. watch / blocker 思考

| ID | topic | R10.11 判断 | R10.12 处理 |
|---|---|---|---|
| ML-D03-S10-TRACE-WATCH-001 | trace stale / degraded marker 来源 | Step 7 degraded mapper 和 trace repository freshness helper 已给 seam,但具体 degraded kind 属 Step 12。 | R10.12 写 marker-source requirement,不写 error taxonomy。 |
| ML-D03-S10-IMPACT-WATCH-001 | impact unknown / pending 与 no-effect 区分 | Step 6/9 明确 unknown 必须保留,可以进入状态矩阵。 | R10.12 显式禁止 unknown -> no-effect 的无来源转换。 |
| ML-D03-S10-AUDIT-WATCH-001 | audit trail 是否拥有 finite lifecycle | Step 6/7/9 将其定位为 append-only support aggregate,不是业务 lifecycle。 | R10.12 只写 support boundary,不写完整 lifecycle。 |
| ML-D03-S10-LINEAGE-WATCH-001 | lineage graph link / missing ref 处理 | lineage 是 body-free ref graph;missing linked ref 需要 degraded/watch,但错误分类属 Step 12。 | R10.12 写 link boundary 和 missing linked ref marker requirement。 |
| ML-D03-S10-PROTECT-WATCH-001 | protection decision 与 recovery job 边界 | policy 只出 decision;job 消费 decision 产生 issue/report,不自动修复 truth。 | R10.12 写 judgement boundary,不写 job/recovery 状态。 |
| ML-D03-S10-INTEGRITY-WATCH-001 | relation integrity 与 relation truth 重叠 | relation truth 已在 R10.8;integrity rule 只写 diagnostic / violation marker。 | R10.12 不重复 relation lifecycle。 |
| ML-D03-S10-TRACE-BLOCK-001 | none | 当前 trace/audit/lineage/impact 思考未发现必须回退 Step 6/7/8/9 的 hard blocker。 | 无暂停。 |

### 8. R10.12 写入顺序思考

| 顺序 | 写入对象 | 原因 |
|---|---|---|
| 1 | `MethodAssetTraceMaterial` | trace material 是 audit、lineage、impact 和 refresh 的共同解释输入。 |
| 2 | `ConsumptionImpactSummary` | impact summary 直接承接 trace / consumption material,并驱动 protection decision。 |
| 3 | `ConsistencyProtectionPolicy` | protection 是 impact / trace 的 judgement boundary,应在 impact 后写。 |
| 4 | `RelationIntegrityRule` | integrity 依赖 relation truth 和 safe diagnostic,不重复 relation 状态机。 |
| 5 | `MethodAssetAuditTrail` support boundary | audit trail 是 append-only support,写边界和禁止事项。 |
| 6 | `MethodAssetEvidenceLineage` support boundary | lineage 串联 external / basis / trace / audit refs,最后写 cross-link 边界。 |
| 7 | cross side-effect / forbidden table | 汇总 event candidate、stored result、job input 和 no-body / no-raw-log 禁止推导。 |

### 9. R10.11 stop-review

| 检查项 | 结果 |
|---|---|
| 是否只思考 trace/audit/lineage/impact 状态族 | pass |
| 是否区分完整状态机、support boundary 和 judgement boundary | pass |
| 是否列出输入来源、trigger flow 和 precondition / marker 来源 | pass |
| 是否规划 R10.12 写入顺序 | pass |
| 是否未写最终状态集合、ASCII 图或 From / To 矩阵 | pass |
| 是否未写 read/material、maintenance/job、idempotency/runtime、outbound/handoff 状态矩阵 | pass |
| 是否未写 persistence schema、error taxonomy、config key、test case schema 或 implementation code | pass |
| 是否修改正式 `03-详细设计.md` | no |

next_allowed_action: 等待用户确认后进入 Step 10 `R10.12 trace/audit/lineage/impact 状态机:再写入`;只允许写入 `MethodAssetTraceMaterial`、`ConsumptionImpactSummary` 的状态集合、ASCII 图、转换矩阵、非法转换占位,以及 `ConsistencyProtectionPolicy`、`RelationIntegrityRule` 的 judgement boundary、`MethodAssetAuditTrail`、`MethodAssetEvidenceLineage` 的 support boundary、cross side-effect / forbidden table 和停审表;不得直接修改正式 `03-详细设计.md`;不得写 read/material、maintenance/job、idempotency/runtime、outbound/handoff 的状态矩阵;不得写 persistence schema、error taxonomy、config key、test case schema、implementation code 或进入 Step 11。

---

## R10.12 trace/audit/lineage/impact 状态机:再写入

### 1. 写入范围

本模块只写 trace / audit / lineage / impact 状态族。`MethodAssetTraceMaterial` 与 `ConsumptionImpactSummary` 是完整状态矩阵主语;`ConsistencyProtectionPolicy` 与 `RelationIntegrityRule` 只写 judgement boundary;`MethodAssetAuditTrail` 与 `MethodAssetEvidenceLineage` 只写 support boundary,不扩展为业务 lifecycle。

| 状态主语 | owner | trigger source | 当前处理 |
|---|---|---|---|
| `MethodAssetTraceMaterial` | domain trace material | organize / mark trace flow;trace refresh job input;trace query read disposition | 写完整状态机 |
| `ConsumptionImpactSummary` | domain impact summary | register / mark disposition flow;pending impact query;protection decision input | 写完整状态机 |
| `ConsistencyProtectionPolicy` | domain policy judgement | establish protection decision;protection diagnostic query;recovery convergence input | 写 judgement boundary |
| `RelationIntegrityRule` | domain policy judgement | evaluate relation integrity;mark integrity violation;diagnostic query | 写 judgement boundary |
| `MethodAssetAuditTrail` | domain append-only support | organize audit trail;audit query;audit publication side effect | 写 support boundary |
| `MethodAssetEvidenceLineage` | domain lineage support graph | link evidence lineage;external lineage;lineage query | 写 support boundary |

### 2. `MethodAssetTraceMaterial` 状态机

状态集合:

| state | 含义 | public read |
|---|---|---|
| `Organized` | trace material 已从正式 source object refs 和 source cursor 组织完成。 | readable |
| `Partial` | trace material 只包含部分可安全追溯来源,原因以 safe reason / marker 表达。 | readable degraded |
| `Stale` | freshness marker 表明 trace material 相对来源 truth 已过期。 | readable stale |
| `Unavailable` | trace material 当前无法安全组织或返回。 | readable unavailable surface |

```text
[virtual:not_created]
  | OrganizeMethodAssetTraceMaterialFlow
  v
[Organized] --MarkMethodAssetTraceMaterialStateFlow--> [Organized]
    |                         |                         |
    |                         +-----------------------> [Partial]
    |                         +-----------------------> [Stale]
    |                         +-----------------------> [Unavailable]
    |
    | RefreshTraceAuditImpactMaterialsFlow saves refreshed material
    v
[Organized]

[Stale] --refreshed from formal source refs--> [Organized] / [Partial] / [Unavailable]
```

| from | trigger | precondition | to | side effect boundary |
|---|---|---|---|---|
| virtual not created | `OrganizeMethodAssetTraceMaterialFlow` | trace subject ref valid;source object refs loaded through formal repositories;source cursor present;no raw log/evidence body | `Organized` / `Partial` / `Unavailable` | trace material changed candidate;stored result |
| `Organized` / `Partial` / `Stale` / `Unavailable` | `MarkMethodAssetTraceMaterialStateFlow` | exact trace material read;expected version;marker/reason copied from formal mapper/source | `Organized` / `Partial` / `Stale` / `Unavailable` | trace material changed candidate;stored result |
| `Stale` / `Partial` / `Unavailable` | `RefreshTraceAuditImpactMaterialsFlow` save branch | refresh plan uses formal trace subject refs;source cursor/freshness marker source present;job does not repair source truth | `Organized` / `Partial` / `Unavailable` | trace refresh report candidate;trace material changed candidate |
| any readable state | `GetMethodAssetTraceMaterialFlow` | read resolver and degraded mapper provide safe read surface | same state | no write side effect |

非法转换占位:

| from | forbidden trigger | reason |
|---|---|---|
| any | synthesize trace subject from route/raw id/log line | trace subject must be formal typed ref or loaded object ref. |
| any | save raw log/event payload/metric/report/evidence body | trace material is body-free support material. |
| `Unavailable` | mark `Organized` without source refs and freshness marker | availability recovery must copy formal marker/source,not be inferred by service. |
| any | repair definition/version/relation/external truth | trace refresh only refreshes support material. |

### 3. `ConsumptionImpactSummary` 状态机

状态集合:

| state | 含义 | public read |
|---|---|---|
| `KnownImpact` | 已形成安全影响摘要,影响来源明确。 | readable |
| `UnknownImpact` | 影响未知,且 unknown 必须显式保留。 | readable diagnostic |
| `PendingDownstreamSummary` | 正在等待下游 safe summary 或正式承接口径。 | readable pending |
| `NoKnownEffect` | 正式判断为当前没有已知影响,不同于 unknown。 | readable |
| `DispositionMarked` | 已复制正式 disposition marker / safe reason。 | readable diagnostic |
| `Superseded` | 当前 summary 被后续 impact summary 替代,历史仍可追溯。 | readable historical |

```text
[virtual:not_created]
  | RegisterConsumptionImpactSummaryFlow
  v
[KnownImpact] / [UnknownImpact] / [PendingDownstreamSummary] / [NoKnownEffect]
      | MarkConsumptionImpactDispositionFlow
      v
[DispositionMarked]
      |
      | supersede_with(next_impact_summary_ref)
      v
[Superseded]
```

| from | trigger | precondition | to | side effect boundary |
|---|---|---|---|---|
| virtual not created | `RegisterConsumptionImpactSummaryFlow` | impact source ref valid;affected version/material/context refs loaded;impact kind supplied by formal source | `KnownImpact` / `UnknownImpact` / `PendingDownstreamSummary` / `NoKnownEffect` | impact summary changed candidate;stored result |
| `KnownImpact` / `UnknownImpact` / `PendingDownstreamSummary` / `NoKnownEffect` | `MarkConsumptionImpactDispositionFlow` | exact impact summary read;expected version;policy diagnostic builder returns safe disposition marker/reason | `DispositionMarked` | impact event candidate;protection trigger candidate;stored result |
| any non-superseded state | `supersede_with(next_impact_summary_ref)` | next summary exists;same impact source or formal supersession relation present | `Superseded` | impact summary changed candidate;lineage/trace hint |
| any readable state | `GetConsumptionImpactSummaryFlow` / `ListPendingConsumptionImpactsFlow` | repository exact read or pending/unknown page;unknown and pending preserved | same state | no write side effect |

非法转换占位:

| from | forbidden trigger | reason |
|---|---|---|
| `UnknownImpact` | convert to `NoKnownEffect` from delivery success/read receipt | sync or publication success is not business impact evidence. |
| `PendingDownstreamSummary` | collapse to `KnownImpact` without safe summary or formal diagnostic | downstream private state cannot be scanned or inferred. |
| `Superseded` | mutate as current impact summary | superseded summary is historical. |
| any | read downstream runtime/process/marketplace private state | impact summary is safe body-free summary only. |

### 4. `ConsistencyProtectionPolicy` judgement boundary

这些 labels 是 policy judgement boundary,不是 recovery job 状态。

| judgement label | 含义 | allowed source |
|---|---|---|
| `ProtectionEstablished` | 已建立对正式版本和消费语境的保护判断。 | `EstablishConsistencyProtectionDecisionFlow`;policy diagnostic builder |
| `UnknownImpactPending` | 影响未知,不能默认安全。 | `ConsumptionImpactSummary.unknown`;`ConsistencyProtectionPolicy.unknown_impact` |
| `ProtectionConstrained` | 保护判断要求限制或后续人工承接。 | impact summary + protected context refs + diagnostic builder |
| `InputRejected` | 缺 impact / trace / protected context 或 safe reason,无法形成正式判断。 | command rejection / diagnostic pending surface |

| from | trigger | precondition | to | side effect boundary |
|---|---|---|---|---|
| virtual not judged | `EstablishConsistencyProtectionDecisionFlow` | protected version ref loaded;impact / trace inputs loaded when required;diagnostic body-free | `ProtectionEstablished` / `UnknownImpactPending` / `ProtectionConstrained` / `InputRejected` | protection decision event candidate;stored result |
| `UnknownImpactPending` / `ProtectionConstrained` | impact summary updated or disposition marked | new impact summary ref or disposition marker is formal;expected version if persisted | `ProtectionEstablished` / `ProtectionConstrained` / `UnknownImpactPending` | protection decision event candidate |
| any label | `GetConsistencyProtectionDiagnosticFlow` | diagnostic builder supplies safe summary | same label | no recovery side effect |

禁止事项:

| 禁止项 | reason |
|---|---|
| run recovery / repair source truth from policy decision | recovery belongs to later job/report state families. |
| treat unknown impact as safe | unknown impact is explicit pending protection input. |
| store downstream runtime state or recovery algorithm body | policy is judgement boundary only. |

### 5. `RelationIntegrityRule` judgement boundary

这些 labels 是 relation integrity judgement,不重复 `MethodAssetRelation` truth lifecycle。

| judgement label | 含义 | allowed source |
|---|---|---|
| `IntegritySatisfied` | relation endpoints、formalization requirement 和 distribution boundary 满足规则。 | relation repository + policy diagnostic builder |
| `IntegrityPending` | endpoint/formalization/distribution 输入不足,需待承接。 | diagnostic pending branch |
| `ViolationMarked` | 已复制正式 violation marker / safe reason。 | `MarkRelationIntegrityViolationFlow` |
| `IntegrityRejected` | raw rule detail、缺 safe reason 或非法 candidate 被拒绝。 | command rejection surface |

| from | trigger | precondition | to | side effect boundary |
|---|---|---|---|---|
| virtual not judged | `EvaluateRelationIntegrityFlow` | relation and endpoint refs loaded;diagnostic builder returns body-free judgement | `IntegritySatisfied` / `IntegrityPending` / `ViolationMarked` / `IntegrityRejected` | integrity changed candidate;stored result |
| `IntegritySatisfied` / `IntegrityPending` | `MarkRelationIntegrityViolationFlow` | exact relation read;violation marker and safe reason copied from formal diagnostic | `ViolationMarked` | integrity changed candidate;stored result |
| any label | `GetRelationIntegrityDiagnosticFlow` | relation/rule refs loaded;diagnostic builder supplies safe summary | same label | no write side effect |

禁止事项:

| 禁止项 | reason |
|---|---|
| mutate relation status from integrity rule | relation truth transitions were written in R10.8. |
| expose rule matrix or graph algorithm body | integrity diagnostic is safe summary only. |
| synthesize violation reason in service | violation reason must be copied from formal diagnostic source. |

### 6. `MethodAssetAuditTrail` support boundary

`MethodAssetAuditTrail` 是 append-only support aggregate。以下 labels 只约束组织、追加和读取边界,不构成业务 lifecycle。

| support label | 含义 | allowed operation |
|---|---|---|
| `TrailOwnerPresent` | audit subject 已有 body-free trail owner。 | create/load trail by formal audit subject ref |
| `SafeEntryRefsAppended` | safe audit entry refs 已追加。 | append entry ref and source cursor |
| `PartialAuditAvailable` | 只能安全返回部分 audit refs。 | partial factory / degraded mapper |
| `AuditUnavailable` | audit subject lookup 或 safe trail material 当前不可用。 | unavailable/degraded read surface |

| operation | precondition | resulting label | side effect boundary |
|---|---|---|---|
| `OrganizeMethodAssetAuditTrailFlow` create/load | audit subject ref comes from formal subject source;actor context and safe reason refs present | `TrailOwnerPresent` | audit trail changed candidate;stored result |
| append safe history refs | exact trail loaded;append-only entry refs and cursor present | `SafeEntryRefsAppended` | audit trail changed candidate |
| `GetMethodAssetAuditTrailFlow` partial branch | page helper/degraded mapper supplies safe marker | `PartialAuditAvailable` | no write side effect |
| unavailable branch | safe unavailable marker present | `AuditUnavailable` | no write side effect |

禁止事项:

| 禁止项 | reason |
|---|---|
| overwrite existing audit entry refs | audit trail is append-only. |
| save request/response body, stack trace, raw log, telemetry detail, secret or PII plaintext | audit trail only stores safe refs and reasons. |
| derive audit subject from log string | audit subject must be formal typed subject ref. |

### 7. `MethodAssetEvidenceLineage` support boundary

`MethodAssetEvidenceLineage` 是 body-free lineage graph。以下 labels 只约束 link / partial / unavailable 边界。

| support label | 含义 | allowed operation |
|---|---|---|
| `LineageLinked` | external summary、basis summary、trace material 或 audit trail refs 已连接。 | link refs by formal lineage subject |
| `LineagePartial` | 仅部分 linked refs 可安全返回。 | partial marker / degraded mapper |
| `LineageUnavailable` | linked ref lookup 或 lineage material 当前不可用。 | unavailable read surface |
| `BodyCandidateRejected` | 输入试图携带 evidence / artifact / report body。 | reject body candidate |

| operation | precondition | resulting label | side effect boundary |
|---|---|---|---|
| `LinkMethodAssetEvidenceLineageFlow` | external/artifact/basis/trace refs loaded through formal repositories;no body/path input | `LineageLinked` | evidence lineage changed candidate;stored result |
| `LinkExternalEvidenceLineageFlow` | external summary and artifact archive refs are typed refs;body-free only | `LineageLinked` | external evidence lineage changed candidate |
| `GetMethodAssetEvidenceLineageFlow` missing linked ref branch | degraded marker source present;missing ref not inferred from body/path | `LineagePartial` / `LineageUnavailable` | no write side effect |
| any link command with body payload | body/path/report payload present or required | `BodyCandidateRejected` | safe rejection surface;stored result |

禁止事项:

| 禁止项 | reason |
|---|---|
| store evidence body, archive body, provider payload, report body or object storage path | lineage stores refs only. |
| create lineage identity from file path/provider id | lineage subject must be formal typed ref. |
| use lineage link to mutate external summary, basis summary, trace material or audit trail truth | lineage is support graph only. |

### 8. cross side-effect / forbidden table

| side effect | 允许来源 | 后续承接 |
|---|---|---|
| trace material changed candidate | trace organize / mark / refresh save branch | R10.19/R10.20 outbound;Step 15 observability |
| impact summary changed candidate | impact register / disposition / supersession | R10.19/R10.20 outbound;Step 12 recovery mapping |
| protection decision changed candidate | protection judgement accepted | R10.19/R10.20 outbound;maintenance/recovery input in R10.15/R10.16 |
| audit trail changed candidate | safe trail owner create or entry refs appended | R10.19/R10.20 outbound;Step 15 audit |
| evidence lineage changed candidate | body-free lineage refs linked | R10.19/R10.20 outbound;Step 15 lineage observability |
| relation integrity changed candidate | integrity evaluated or violation marked | R10.19/R10.20 outbound;relation read diagnostic |
| stored result / duplicate replay | command accepted/rejected overlay | R10.17/R10.18 idempotency/replay |

| forbidden derivation | reason |
|---|---|
| raw log / event payload -> trace or audit state | raw telemetry is not design truth. |
| downstream runtime success -> impact no-effect | no-effect needs formal impact source or diagnostic. |
| policy decision -> automatic repair | recovery is a separate job/report family. |
| lineage linked ref -> evidence body availability | lineage never proves body availability. |
| relation integrity violation -> relation status mutation | relation truth transition belongs to relation state machine. |

### 9. R10.12 stop-review

| 检查项 | 结果 |
|---|---|
| 是否写入 `MethodAssetTraceMaterial` 完整状态机 | pass |
| 是否写入 `ConsumptionImpactSummary` 完整状态机 | pass |
| 是否将 `ConsistencyProtectionPolicy` / `RelationIntegrityRule` 限定为 judgement boundary | pass |
| 是否将 `MethodAssetAuditTrail` / `MethodAssetEvidenceLineage` 限定为 support boundary | pass |
| 是否写入 cross side-effect / forbidden table | pass |
| 是否未写 read/material、maintenance/job、idempotency/runtime、outbound/handoff 状态矩阵 | pass |
| 是否未写 persistence schema、error taxonomy、config key、test case schema 或 implementation code | pass |
| 是否修改正式 `03-详细设计.md` | no |

next_allowed_action: 等待用户确认后进入 Step 10 `R10.13 read/visibility/material freshness 状态机:先思考`;只允许思考 read decision、degraded decision、catalog/availability/trace/external/package/assembly view、read material freshness、query surface disposition 的状态主语筛选、输入来源、状态集合草案边界、trigger flow、marker/precondition 来源和 `R10.14` 写入顺序;不得直接修改正式 `03-详细设计.md`;不得写 maintenance/job、idempotency/runtime、outbound/handoff 的状态矩阵;不得写 persistence schema、error taxonomy、config key、test case schema、implementation code 或进入 Step 11。

---

## R10.13 read/visibility/material freshness 状态机:先思考

### 1. 当前模块目标

`R10.13` 只思考 read / visibility / material freshness 状态族如何切分,为 `R10.14` 写入做准备。当前模块不写最终状态集合、ASCII 图或 From / To 转换矩阵。

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm |
| 当前允许 | 思考 `MethodAssetReadDecision`、`MethodAssetDegradedDecision`、consumption / trace / distribution read material、catalog / availability / trace / external / package / assembly view、freshness / availability / visibility marker、Query surface disposition 的主语筛选、输入来源、trigger、marker 来源和 `R10.14` 写入顺序。 |
| 当前禁止 | 写最终状态集合、ASCII 图、From / To 转换矩阵、maintenance/job/report、idempotency/runtime、outbound/handoff、persistence schema、error taxonomy、config key、test case schema、implementation code 或正式 `03-详细设计.md`。 |

### 2. 状态主语筛选思考

本组容易把 Query surface、public view shell、material freshness 和 repository cache 混成一个 lifecycle。`R10.14` 必须只写 application read decision / degraded decision 与 material / view freshness 的状态边界,不得让 Query 现场创建或刷新 material。

| 候选 | Step 6/7/8/9 来源 | R10.13 判定 | R10.14 处理 |
|---|---|---|---|
| `MethodAssetReadDecision` | Step 6 read decision helper;Step 7 query read resolver;Step 8 query shell;Step 9 57 Query no-write overlay。 | `enter_decision_matrix` | 写 found / safe-absent / not-visible / stale-visible / degraded / unavailable 的 read disposition 矩阵。 |
| `MethodAssetDegradedDecision` | Step 6 degraded helper;Step 7 degraded mapper;Step 8 degraded shell;Step 9 degraded / unavailable branches。 | `enter_decision_matrix` | 写 degraded / unavailable / partial / context-limited / invalid-safe-material 的 decision boundary。 |
| `MethodAssetConsumptionMaterial` | Step 6 controlled read material;Step 7 material repository + availability resolver;Step 9 consumption material query / refresh flow。 | `enter_material_freshness_matrix` | 写 material readiness / freshness / boundary constrained / unavailable 边界,不写下游 runtime truth。 |
| `DistributionReadMaterial` | Step 6 material shell;Step 7 distribution builder;Step 9 distribution material query / relation distribution refresh flow。 | `enter_builder_material_boundary` | 写 builder-output freshness / unavailable boundary,不让 relation repository 生成 material。 |
| catalog / availability / trace / external / package / assembly view shell | Step 6 public shell;Step 7 read resolver / availability / discovery builder;Step 8 query response shell;Step 9 query flows。 | `view_shell_boundary` | 写 view freshness / stale / unavailable / partial 边界,不把 shell 当 truth owner。 |
| `MethodAssetVisibilityMarkerRef` / freshness / availability markers | Step 6 safe marker;Step 7 resolver / mapper / material summary;Step 8 public marker shell。 | `marker_input_only` | 作为 precondition / marker source 表,不单独写 lifecycle。 |
| page cursor / page result | Step 7 page helper;Step 8 page shell;Step 9 list query flows。 | `support_input_only` | 只写 opaque cursor / page no-write 禁止事项,不写 page cursor 状态机。 |
| maintenance progress view | Step 6 progress view;Step 7 progress repository;Step 9 maintenance query flows。 | `defer_to_R10.15_R10.16` | 当前不写;留给 maintenance/job/report 状态族。 |

### 3. 输入来源思考

| 输入层 | 可用来源 | R10.14 使用方式 |
|---|---|---|
| Step 6 application helpers | `MethodAssetReadDecision`、`MethodAssetDegradedDecision` 字段、不变量和工厂边界。 | 作为 Query disposition / degraded decision 的状态主语来源。 |
| Step 6 public shell | catalog、availability、trace、impact、relation、external summary、package、method set view shell;consumption、trace、distribution material shell。 | 作为 public read surface 边界,不反向扩张 DTO schema。 |
| Step 7 repository family | consumption / trace material exact read、resolution、freshness helper;relation/package/assembly repositories。 | 作为 material/view 读取前置,不写 persistence schema。 |
| Step 7 read resolver | read subject、read source、scope / visibility / freshness resolution。 | Query service 只能复制 resolver summary,不得从 route/raw id/private map 推导。 |
| Step 7 availability resolver | consumption material ready / stale / unavailable / boundary constrained summary。 | availability view 与 consumption material 状态边界的正式 marker 来源。 |
| Step 7 degraded mapper | material freshness、availability summary、safe diagnostic、partial / unavailable summary 到 degraded decision 的映射。 | degraded marker / follow-up hint 只能复制 mapper 输出。 |
| Step 7 distribution / discovery builders | distribution read material、package / assembly view、peripheral discovery context 的 body-free builder。 | view/material builder output 只能作为 read surface,不能反写 relation/package truth。 |
| Step 9 Query flows | 57 个 Query no-write overlay,尤其 catalog、consumption、trace、external、relation/distribution、package/assembly 读取。 | 作为 R10.14 trigger / branch 第一来源。 |
| Step 9 Job flows | read material refresh / peripheral refresh / trace refresh 的 derived material 结果。 | 只作为 freshness marker 输入,不在 R10.14 写 job 状态。 |

### 4. 状态切片草案边界

下表只描述 `R10.14` 可展开的状态切片,不是最终状态名或状态集合。

| 状态主语 / 边界 | 状态切片思考 | R10.14 注意事项 |
|---|---|---|
| `MethodAssetReadDecision` | found、safe absent、not visible、stale visible、degraded、unavailable。 | 必须保留 Query no-write;read subject/source/freshness 来自 resolver 或 loaded source。 |
| `MethodAssetDegradedDecision` | stale、partial、context limited、unavailable、invalid safe material、follow-up hinted。 | marker / diagnostic / hint 必须来自 degraded mapper、availability resolver、safe diagnostic。 |
| consumption material freshness | prepared material readable、stale material、boundary constrained、unavailable、safe absent。 | Query 不创建 material、不刷新 material、不扫描下游 runtime truth。 |
| distribution read material | builder output readable、builder unavailable、partial material、invalid safe material。 | builder 只读 relation/distribution/context refs;不得进入 marketplace transaction 或 package body。 |
| catalog / external / package / assembly view shell | fresh readable view、stale visible view、partial page/view、unavailable view、safe empty。 | shell 不拥有 truth;freshness/availability marker 只能复制正式来源。 |
| trace view shell | organized trace visible、stale trace visible、partial trace page、unavailable trace surface。 | 不重复 R10.12 trace material lifecycle;这里只写 query read surface。 |
| availability view shell | ready / constrained / stale / unavailable 的 public read surface。 | availability resolver 装配;不得把 cache hit 或安装态当事实。 |

### 5. trigger flow 思考

| trigger family | 相关 flow | 状态影响边界 |
|---|---|---|
| shared Query read | 57 个 `MethodAssetQueryService.*` flow | 只读 repository / resolver / mapper 输出,不得写 truth、material、event 或 job。 |
| definition / catalog read | `GetMethodAssetDefinitionSummaryFlow`;`ListMethodAssetCatalogViewFlow` | read decision 可 found / absent / stale / unavailable;catalog view 不反写 catalog entry。 |
| consumption / availability read | `GetMethodAssetConsumptionMaterialFlow`;`GetMethodAssetAvailabilityViewFlow`;`ListConsumableContextsForFormalVersionFlow` | availability / freshness marker copied;Query 不 prepare material。 |
| trace / impact / audit / lineage read | trace、impact、audit、lineage query flows | 复制 R10.12 material/support 状态到 read surface;不追加 audit、不刷新 trace。 |
| external summary read | `GetExternalSourceSummaryViewFlow`;`GetExternalSummaryBySourceRefFlow`;`GetArtifactArchiveRefFlow` | body-free view / safe absent / stale / unavailable;不读取 external body/path。 |
| relation / distribution read | relation list、distribution ref/material query flows | relation truth 只读;distribution material 由 builder 输出。 |
| peripheral read | package / method set / discovery query flows | package/assembly view freshness 只来自 discovery builder / availability marker。 |
| read material refresh job output | `RefreshCatalogAndDefinitionReadMaterialsFlow`;`RefreshConsumptionReadMaterialsFlow`;`RefreshExternalSummaryReadMaterialsFlow`;`RefreshPeripheralReadMaterialsFlow` | 只作为 freshness/material marker 输入;job 状态后移 R10.15/R10.16。 |

### 6. precondition / marker 来源思考

| precondition / marker | 来源 | 使用限制 |
|---|---|---|
| read subject / read source | typed selector ref、loaded view/material subject、`MethodAssetQueryReadResolverPort` summary。 | 不得从 route param、raw id、UI state、private map 或 string prefix 反推。 |
| visibility / boundary marker | domain policy / boundary output、read resolver summary。 | Query service 只能复制;不得现场拼 not-visible marker。 |
| freshness marker | loaded material / view / material builder / refresh output 的正式 marker。 | 不得用 timestamp、cache hit、page cursor 或 fake-only flag 代替。 |
| availability marker | availability resolver、adapter availability summary、safe diagnostic。 | 不得从 raw IO error、HTTP/SQL code、install/runtime state 推导。 |
| degraded marker | degraded mapper output、material freshness/partial marker、safe diagnostic。 | 不得从 exception text、stack trace、provider body 或 debug dump 分类。 |
| safe absence reason | repository safe absence summary、read resolver safe absent output。 | 不得泄露 raw store miss、raw selector、external id 或 path。 |
| page cursor / ordering | page/version helper output。 | cursor opaque;不得替代 optimistic version 或 material freshness。 |

### 7. watch / blocker 思考

| ID | topic | R10.13 判断 | R10.14 处理 |
|---|---|---|---|
| ML-D03-S10-READ-WATCH-001 | view shell 是否能成为状态 owner | Step 6 明确 shell_not_truth,只能写 read surface / freshness 边界。 | R10.14 不为每个 view shell 写 truth lifecycle。 |
| ML-D03-S10-READ-WATCH-002 | material freshness marker 来源 | Step 7 有 material repository freshness helper、availability resolver、builder seam,但具体 marker kind 值域属 Step 8/12。 | R10.14 写 marker-source requirement,不写 error taxonomy。 |
| ML-D03-S10-READ-WATCH-003 | Query empty / safe absent 来源 | Step 6 read decision 与 Step 9 query flows 已给 safe absent branch,但 absence reason 值域属 Step 12。 | R10.14 写 safe absence boundary,不写错误码。 |
| ML-D03-S10-READ-WATCH-004 | distribution / peripheral material builder output | Step 7 builder seam 已闭 owner,但 persistence / material schema 属 Step 11。 | R10.14 写 builder-output read boundary,不写 schema。 |
| ML-D03-S10-READ-WATCH-005 | maintenance progress view | 属 maintenance/job/report 状态族,不在当前模块展开。 | 留给 R10.15/R10.16。 |
| ML-D03-S10-READ-BLOCK-001 | none | 当前 read/visibility/material freshness 思考未发现必须回退 Step 6/7/8/9 的 hard blocker。 | 无暂停。 |

### 8. R10.14 写入顺序思考

| 顺序 | 写入对象 / 边界 | 原因 |
|---|---|---|
| 1 | `MethodAssetReadDecision` | 所有 Query surface 的统一 disposition owner,先写 no-write read matrix。 |
| 2 | `MethodAssetDegradedDecision` | stale / partial / unavailable / invalid material 都依赖 read decision。 |
| 3 | consumption material freshness / availability boundary | 受控消费是 availability view 和 read material 的核心。 |
| 4 | distribution read material builder boundary | 依赖 relation truth 和 builder seam,不能混入 relation lifecycle。 |
| 5 | catalog / external / package / assembly view shell boundary | public view shell 只表达 freshness / partial / unavailable。 |
| 6 | query surface forbidden / marker-source table | 汇总 no-write、no-marker-synthesis、opaque cursor、safe absent 禁止事项。 |

### 9. R10.13 stop-review

| 检查项 | 结果 |
|---|---|
| 是否只思考 read/visibility/material freshness 状态族 | pass |
| 是否区分 decision owner、material freshness、view shell boundary 和 marker input | pass |
| 是否列出输入来源、trigger flow 和 precondition / marker 来源 | pass |
| 是否规划 R10.14 写入顺序 | pass |
| 是否未写最终状态集合、ASCII 图或 From / To 矩阵 | pass |
| 是否未写 maintenance/job、idempotency/runtime、outbound/handoff 状态矩阵 | pass |
| 是否未写 persistence schema、error taxonomy、config key、test case schema 或 implementation code | pass |
| 是否修改正式 `03-详细设计.md` | no |

next_allowed_action: 等待用户确认后进入 Step 10 `R10.14 read/visibility/material freshness 状态机:再写入`;只允许写入 `MethodAssetReadDecision`、`MethodAssetDegradedDecision`、consumption material freshness / availability boundary、distribution read material builder boundary、catalog / external / package / assembly view shell boundary、query surface forbidden / marker-source table 和停审表;不得直接修改正式 `03-详细设计.md`;不得写 maintenance/job、idempotency/runtime、outbound/handoff 的状态矩阵;不得写 persistence schema、error taxonomy、config key、test case schema、implementation code 或进入 Step 11。

---

## R10.14 read/visibility/material freshness 状态机:再写入

### 1. 写入范围

本模块只写 read / visibility / material freshness 状态族。`MethodAssetReadDecision` 与 `MethodAssetDegradedDecision` 是 application decision owner;consumption / distribution material 和 public view shell 只写 read surface / freshness boundary,不写 truth lifecycle。

| 状态主语 / 边界 | owner | trigger source | 当前处理 |
|---|---|---|---|
| `MethodAssetReadDecision` | application query service helper | 57 个 Query flow;query read resolver;repository exact read/page | 写 read disposition 矩阵 |
| `MethodAssetDegradedDecision` | application degraded mapper helper | degraded mapper;availability resolver;safe diagnostic;query degraded branch | 写 degraded decision 矩阵 |
| consumption material freshness / availability | domain material + availability resolver | consumption material query;availability view query;read material refresh output | 写 material read boundary |
| distribution read material builder output | application builder / material shell | distribution ref/material query;relation distribution refresh | 写 builder material boundary |
| catalog / external / package / assembly view shell | contracts public shell + resolver/builder output | list/get view queries;read material refresh output | 写 view shell boundary |
| marker / cursor / page shell | contracts safe marker + page helper | query resolver / page helper output | 写 input-only forbidden table |

### 2. `MethodAssetReadDecision` 状态机

状态集合:

| state | 含义 | public read |
|---|---|---|
| `Found` | typed selector 对应 safe read source 已加载并可返回。 | found result |
| `SafeAbsent` | typed selector 下可安全公开为 absent / empty。 | safe absent / empty |
| `NotVisible` | boundary / visibility marker 表明该 subject 在当前 read context 不可见。 | not visible |
| `StaleVisible` | material / view 可见,但 freshness marker 表明已 stale。 | stale visible |
| `Degraded` | 需要交给 degraded decision 表达 partial / invalid / constrained surface。 | degraded |
| `Unavailable` | read resolver、repository 或 availability source 当前不可用。 | unavailable |

```text
[virtual:query_started]
  | MethodAssetQueryReadResolverPort
  v
[Found] / [SafeAbsent] / [NotVisible] / [StaleVisible] / [Degraded] / [Unavailable]

All states are terminal for the Query request and do not write truth/material.
```

| from | trigger | precondition | to | side effect boundary |
|---|---|---|---|---|
| virtual query started | any Query flow exact read/list branch | operation context and typed selector present;read subject/source resolved by `MethodAssetQueryReadResolverPort`;repository read/page is no-write | `Found` | no write;response assembly only |
| virtual query started | repository / resolver safe absence branch | selector is formal typed ref;safe absence reason copied from repository/read resolver | `SafeAbsent` | no write;safe empty / absent response |
| virtual query started | boundary / visibility constrained branch | visibility / boundary marker copied from domain policy or read resolver | `NotVisible` | no write;not-visible safe surface |
| virtual query started | stale material/view branch | material freshness marker copied from loaded source/resolver/builder | `StaleVisible` | no write;stale marker copied |
| virtual query started | partial / invalid material branch | degraded mapper output exists;safe diagnostic present | `Degraded` | no write;degraded decision linked |
| virtual query started | resolver / adapter / material unavailable branch | unavailable marker or safe diagnostic copied from availability/resolver output | `Unavailable` | no write;unavailable safe surface |

非法转换占位:

| from | forbidden trigger | reason |
|---|---|---|
| any read state | create / refresh / repair truth, view, material or job | Query is no-write. |
| `SafeAbsent` | expose raw selector, raw store miss or external id | absence reason must be safe. |
| `NotVisible` | synthesize visibility marker from auth text or route | marker must come from policy/boundary/read resolver. |
| `StaleVisible` | use timestamp/cache hit/page cursor as freshness marker | freshness marker must be formal material/view marker. |
| `Unavailable` | classify from raw exception/HTTP/SQL/provider body | unavailable surface must copy formal availability/safe diagnostic. |

### 3. `MethodAssetDegradedDecision` 状态机

状态集合:

| state | 含义 | public read |
|---|---|---|
| `StaleMaterial` | material/view stale,但可安全返回 stale-visible 或 degraded surface。 | stale / degraded |
| `PartialMaterial` | page/material/trace/audit/view 只部分可用。 | partial |
| `ContextLimited` | read context、boundary 或 visibility 限制导致结果受限。 | context limited |
| `UnavailableMaterial` | material、resolver、builder 或 adapter 当前不可用。 | unavailable |
| `InvalidSafeMaterial` | material/view 不满足 safe material 约束。 | degraded invalid |
| `FollowUpHinted` | degraded decision 附带 refresh / intervention / maintenance hint。 | degraded with hint |

```text
[virtual:degraded_requested]
  | MethodAssetDegradedDecisionMapperPort
  v
[StaleMaterial] / [PartialMaterial] / [ContextLimited] / [UnavailableMaterial] / [InvalidSafeMaterial]
       |
       | with_follow_up_hint(hint_ref)
       v
[FollowUpHinted]
```

| from | trigger | precondition | to | side effect boundary |
|---|---|---|---|---|
| virtual degraded requested | stale marker mapping | freshness marker copied from material/view/builder output;safe diagnostic present | `StaleMaterial` | no repair;response assembly only |
| virtual degraded requested | partial marker mapping | partiality marker from page/material/trace/audit/job-safe source | `PartialMaterial` | no write;partial surface |
| virtual degraded requested | boundary/context-limited mapping | visibility/boundary marker and read decision ref present | `ContextLimited` | no write;safe limited surface |
| virtual degraded requested | unavailable mapping | availability/unavailable marker and unavailable reason copied from resolver/adapter summary | `UnavailableMaterial` | no write;safe unavailable surface |
| virtual degraded requested | invalid safe material mapping | safe diagnostic identifies invalid body-free material;no raw body included | `InvalidSafeMaterial` | no write;safe diagnostic only |
| any degraded state | `with_follow_up_hint(hint_ref)` | follow-up hint is formal and body-free;does not trigger job | `FollowUpHinted` | no automatic refresh/job/retry |

非法转换占位:

| from | forbidden trigger | reason |
|---|---|---|
| any degraded state | start repair/refresh/retry/job | degraded decision only records safe branch. |
| any degraded state | save raw exception, stack trace, provider payload or debug dump | diagnostic must be safe and redacted. |
| `UnavailableMaterial` | return accepted success without degraded marker | degraded / unavailable cannot be silently successful. |
| `FollowUpHinted` | treat hint as scheduled work | hint is not a job/task state. |

### 4. consumption material freshness / availability boundary

这些 labels 约束受控消费 read material 的读取面,不表达下游 runtime truth。

| boundary label | 含义 | allowed source |
|---|---|---|
| `MaterialReadable` | consumption material 已存在且可安全返回。 | `MethodAssetConsumptionMaterialRepository` exact read/resolution |
| `MaterialStale` | material freshness marker 表明当前材料过期。 | material freshness helper;read material refresh output |
| `BoundaryConstrained` | consumption boundary / guard 限制当前 material 可用性。 | availability resolver;policy diagnostic builder |
| `MaterialUnavailable` | material 或 availability resolver 当前不可用。 | availability resolver;adapter availability summary |
| `MaterialSafeAbsent` | typed selector 下 material 安全缺失。 | repository/read resolver safe absence |

| operation | precondition | resulting label | side effect boundary |
|---|---|---|---|
| `GetMethodAssetConsumptionMaterialFlow` | formal version/context selector typed;existing material exact read succeeds;availability summary copied | `MaterialReadable` / `MaterialStale` / `BoundaryConstrained` / `MaterialUnavailable` | no write;no material creation |
| `GetMethodAssetAvailabilityViewFlow` | material/context resolved;availability resolver returns ready/stale/constrained/unavailable summary | `MaterialReadable` / `MaterialStale` / `BoundaryConstrained` / `MaterialUnavailable` | no write;view assembly only |
| `ListConsumableContextsForFormalVersionFlow` | formal version loaded;page helper returns contexts and availability hints | `MaterialReadable` / `MaterialStale` / `BoundaryConstrained` | no write;page cursor opaque |
| missing material branch | safe absence source present | `MaterialSafeAbsent` | no write;safe absent surface |

禁止事项:

| 禁止项 | reason |
|---|---|
| Query creates/prepares/refreshes consumption material | material write belongs to command/job flows. |
| use downstream runtime/install/UI state to decide availability | availability resolver only uses formal material/context/boundary inputs. |
| cache hit as truth or freshness marker | cache/runtime implementation is not design truth. |

### 5. distribution read material builder boundary

`DistributionReadMaterial` 是 builder 输出的 body-free material shell,不由 relation repository 直接生成。

| boundary label | 含义 | allowed source |
|---|---|---|
| `DistributionMaterialReadable` | builder 可从 relation/distribution/context refs 组装 body-free material。 | `DistributionReadMaterialBuilderPort` |
| `DistributionMaterialPartial` | 部分 relation/context/material refs 可安全返回。 | builder partial marker;degraded mapper |
| `DistributionMaterialUnavailable` | builder、availability 或 required refs 当前不可用。 | availability resolver;safe diagnostic |
| `DistributionMaterialInvalid` | builder 输出不满足 body-free / safe material 约束。 | degraded mapper;safe diagnostic |

| operation | precondition | resulting label | side effect boundary |
|---|---|---|---|
| `GetDistributionReadMaterialFlow` | relation/distribution/context refs typed;builder returns body-free material summary | `DistributionMaterialReadable` | no relation truth write;no package body |
| `ListDistributionReadMaterialsByContextFlow` | context selector resolved;page helper returns builder outputs | `DistributionMaterialReadable` / `DistributionMaterialPartial` | no ranking/search side effect |
| builder unavailable branch | safe unavailable marker and diagnostic present | `DistributionMaterialUnavailable` | no write;unavailable surface |
| invalid safe material branch | builder safe diagnostic identifies invalid material | `DistributionMaterialInvalid` | no write;safe diagnostic only |

禁止事项:

| 禁止项 | reason |
|---|---|
| relation repository generates distribution material | builder seam owns material assembly. |
| read marketplace listing/order/install state | distribution material is not transaction or fulfillment truth. |
| include package body, artifact body, URL, download path or search ranking | material shell remains body-free and deterministic. |

### 6. public view shell freshness boundary

这些 labels 适用于 catalog、external summary、package、assembly、availability、trace 等 public view shell。view shell 不拥有 truth。

| boundary label | 含义 | view families |
|---|---|---|
| `ViewReadable` | view shell 可从 truth/material/builder 输出安全装配。 | catalog、external、package、assembly、availability、trace |
| `ViewStaleVisible` | freshness marker 表明 view stale,但可安全返回。 | catalog、external、package、assembly、trace |
| `ViewPartial` | page/view 中部分 item 或 linked ref degraded。 | list pages、trace/external/package/assembly views |
| `ViewUnavailable` | resolver/builder/material store 当前不可用。 | all view families |
| `ViewSafeEmpty` | typed selector 下安全 empty page / empty view。 | list/query views |

| operation | precondition | resulting label | side effect boundary |
|---|---|---|---|
| catalog / definition view query | catalog/definition refs loaded;read resolver returns source/freshness summary | `ViewReadable` / `ViewStaleVisible` / `ViewSafeEmpty` | no catalog truth write;no refresh |
| external summary view query | external summary ref/source ref typed;body-free summary loaded;availability marker copied | `ViewReadable` / `ViewStaleVisible` / `ViewUnavailable` / `ViewSafeEmpty` | no external body fetch |
| package / assembly view query | package/assembly aggregate loaded;discovery builder returns body-free view and marker | `ViewReadable` / `ViewStaleVisible` / `ViewPartial` / `ViewUnavailable` | no marketplace transaction/body |
| trace view query | trace material loaded/listed;read resolver/degraded mapper returns marker | `ViewReadable` / `ViewStaleVisible` / `ViewPartial` / `ViewUnavailable` | no raw log;no trace refresh |
| list page query | page helper returns opaque cursor/order and optional partial marker | `ViewReadable` / `ViewPartial` / `ViewSafeEmpty` | cursor is not freshness/version |

禁止事项:

| 禁止项 | reason |
|---|---|
| view shell mutates underlying truth | shell_not_truth is fixed in Step 6. |
| view query refreshes material or starts job | Query no-write applies to all view surfaces. |
| derive freshness from timestamp/page cursor/cache state | freshness marker must be formal. |
| expose raw external body, package body, audit log, report body or provider payload | all public views are body-free. |

### 7. query surface forbidden / marker-source table

| marker / surface | allowed source | forbidden derivation |
|---|---|---|
| read subject / read source | typed selector, loaded source, query read resolver summary | route param, raw id, UI state, private map, string prefix |
| visibility / not visible | policy/boundary marker, read resolver output | auth text, free-form forbidden message, token claim dump |
| freshness / stale | loaded material/view marker, builder output, refresh output | timestamp, cache hit, page cursor, fake-only flag |
| availability / unavailable | availability resolver, adapter availability summary, infra safe diagnostic | raw IO error, HTTP/SQL code, install/runtime state |
| degraded / partial | degraded mapper, partiality marker, safe diagnostic | exception text, stack trace, debug dump, provider body |
| safe absent / empty | repository safe absence, read resolver safe absent | raw store miss, raw selector, URL/path, external id |
| page cursor / ordering | page/version helper output | optimistic version, material freshness, private index |

### 8. R10.14 stop-review

| 检查项 | 结果 |
|---|---|
| 是否写入 `MethodAssetReadDecision` read disposition 矩阵 | pass |
| 是否写入 `MethodAssetDegradedDecision` degraded decision 矩阵 | pass |
| 是否写入 consumption material freshness / availability boundary | pass |
| 是否写入 distribution read material builder boundary | pass |
| 是否写入 public view shell freshness boundary | pass |
| 是否写入 query surface forbidden / marker-source table | pass |
| 是否未写 maintenance/job、idempotency/runtime、outbound/handoff 状态矩阵 | pass |
| 是否未写 persistence schema、error taxonomy、config key、test case schema 或 implementation code | pass |
| 是否修改正式 `03-详细设计.md` | no |

next_allowed_action: 等待用户确认后进入 Step 10 `R10.15 maintenance/job/report 状态机:先思考`;只允许思考 read material refresh task、trace material refresh task、consistency recovery task、maintenance progress view、run history、checkpoint、recovery issue、job report/result shell 的状态主语筛选、输入来源、状态集合草案边界、trigger flow、marker/precondition 来源和 `R10.16` 写入顺序;不得直接修改正式 `03-详细设计.md`;不得写 idempotency/runtime、outbound/handoff 的状态矩阵;不得写 persistence schema、error taxonomy、config key、test case schema、implementation code 或进入 Step 11。

---

## R10.15 maintenance/job/report 状态机:先思考

### 1. 当前模块目标

`R10.15` 只思考 maintenance / job / report 状态族如何切分,为 `R10.16` 写入做准备。当前模块不写最终状态集合、ASCII 图或 From / To 转换矩阵。

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm |
| 当前允许 | 思考 read material refresh task、trace material refresh task、consistency recovery task、maintenance progress view、run history、checkpoint、recovery issue、job report/result shell 的状态主语筛选、输入来源、状态集合草案边界、trigger flow、marker/precondition 来源和 `R10.16` 写入顺序。 |
| 当前禁止 | 写最终状态集合、ASCII 图、From / To 转换矩阵、idempotency/replay/runtime/entry、outbound/handoff、persistence schema、error taxonomy、config key、test case schema、implementation code 或正式 `03-详细设计.md`。 |

### 2. 状态主语筛选思考

maintenance / job / report 不能被压成一个“大 job 状态”。Step 7 已经把 task truth、progress view、run history、checkpoint 和 recovery issue 切开;Step 10 必须沿用该分层。

| 候选 | Step 6/7/8/9 来源 | R10.15 判定 | R10.16 处理 |
|---|---|---|---|
| `ReadMaterialRefreshTask` | Step 6 maintenance task;Step 7 `MethodAssetMaintenanceTaskRepository`;Step 9 request / refresh job flows。 | `enter_state_matrix` | 写 read material refresh task lifecycle。 |
| `TraceMaterialRefreshTask` | Step 6 maintenance task;Step 7 task repository;Step 9 trace/audit/impact refresh job。 | `enter_state_matrix` | 写 trace material refresh task lifecycle。 |
| `ConsistencyRecoveryTask` | Step 6 maintenance task;Step 7 task / recovery issue repositories;Step 9 recovery request / convergence job。 | `enter_state_matrix` | 写 consistency recovery task lifecycle。 |
| `MaintenanceProgressView` | Step 6 progress view;Step 7 progress repository;Step 8 progress shell;Step 9 progress Query / job closure。 | `support_boundary_matrix` | 写 progress view visibility/freshness boundary,不得替代 task truth。 |
| `MaintenanceRunHistory` | Step 7 run history repository;Step 8 run history/report linkage shell;Step 9 run history Query / job report closure。 | `support_boundary_matrix` | 写 body-free chronology / report linkage boundary。 |
| `MethodAssetJobCheckpointRef` / checkpoint store | Step 7 checkpoint store;Step 8 checkpoint shell;Step 9 resume / partial branch。 | `support_boundary_matrix` | 写 checkpoint/resume support boundary,不写 durable schema。 |
| `MethodAssetRecoveryIssue` | Step 7 recovery issue repository;Step 8 issue/task summary shell;Step 9 recovery/intervention/partial issue branch。 | `enter_issue_disposition_matrix` | 写 issue disposition boundary,不声称 repair success。 |
| `MethodAssetJobProgressAssemblyState` | Step 6 jobs object;Step 7 progress/checkpoint/report seam;Step 8 progress/report shell。 | `technical_support_matrix` | 写 progress assembly boundary,不保存 report body。 |
| `MethodAssetJobEntryResultState` | Step 6 jobs result object;Step 8 job result shell;Step 9 duplicate/partial/blocked/completed branches。 | `technical_local_state` | 写 safe job result boundary;idempotency serialization 留给 R10.17/R10.18 和 Step 13。 |
| `MethodAssetJobAssemblyContext` | Step 6 application helper;Step 9 jobs service overlay。 | `input_context_only` | 不单独写 lifecycle;只作为 task/job result 输入来源。 |
| `MethodAssetJobRunnerContext` / `MethodAssetOperationJobEntry` | Step 6 jobs entry;Step 8 dispatch/entry shell。 | `defer_runtime_entry` | 本地 entry / runtime precheck 放到 R10.17/R10.18。 |
| report body / metrics body / raw log | Step 6/8 明确 body-free 红线。 | `exclude` | 不进入状态主语。 |

### 3. 输入来源思考

| 输入层 | 可用来源 | R10.16 使用方式 |
|---|---|---|
| Step 6 application helper | `MethodAssetJobAssemblyContext`、event candidate assembly、stored result helper、degraded decision。 | 作为 job orchestration 输入和 safe result assembly 来源。 |
| Step 6 jobs entry objects | `MethodAssetJobProgressAssemblyState`、`MethodAssetJobEntryResultState`。 | 作为 progress/report/result boundary 的本地 support state。 |
| Step 7 maintenance repositories | task repository、progress view repository、run history repository、recovery issue repository。 | 作为 task truth、progress、history、issue 的正式读写来源。 |
| Step 7 planning / checkpoint | refresh target planner、checkpoint store。 | 作为 target batch、resume checkpoint、partial continuation 的正式来源。 |
| Step 7 runtime / availability | runtime assembly registry、adapter availability port。 | 只作为 blocked / unavailable precondition 来源;完整 runtime/entry 状态后移 R10.17/R10.18。 |
| Step 8 job protocol | job input、dispatch、result、progress/checkpoint、report/handoff boundary、partial/degraded/unavailable、duplicate/replay shell。 | 作为 public shell 和 state label 约束,不得反推 domain truth。 |
| Step 9 command flows | request refresh/recovery、suspend、supersede、formal intervention command flows。 | 作为 task state trigger 第一来源。 |
| Step 9 job flows | 8 个 Operations Job execution overlay。 | 作为 running/resume/partial/completed/report boundary trigger 第一来源。 |
| Step 9 query flows | maintenance progress、task summary、run history、pending scopes Query。 | 只作为 no-write read surface,不得驱动 task transition。 |

### 4. 状态集合草案边界

下表只描述 `R10.16` 可展开的状态切片,不是最终状态名或状态集合。

| 状态主语 / 边界 | 状态切片思考 | R10.16 注意事项 |
|---|---|---|
| refresh task family | requested、planned、running、partial、completed、suspended、superseded、blocked / unavailable 等任务 truth 切片。 | read / trace task 可共用模式,但必须分别回指对应 job flow。 |
| consistency recovery task | requested、evaluating、issue recorded、formal intervention required、converged、suspended、superseded、blocked 等恢复任务切片。 | 不写 automatic repair success;formal intervention 只是 issue / hint。 |
| recovery issue | pending、blocked、intervention required、acknowledged、linked to progress/history 等 issue disposition。 | issue 只保存 body-free safe diagnostic / hint,不保存 raw evidence。 |
| progress view | pending/running/progressed/partial/degraded/stale/unavailable/completed-view 等 read surface。 | progress view 不决定 task truth 已完成或 superseded。 |
| run history / report boundary | run milestone、partial milestone、completed milestone、blocked milestone、report linked、handoff hinted。 | run history 不保存 report body、worker log 或 metrics body。 |
| checkpoint / resume support | checkpoint absent/present/resume-ready/partial-continuation/closed/invalid-safe 等 support boundary。 | checkpoint 不是 version、queue offset、retry token 或 lease。 |
| job progress assembly | progress assembled、partial failure linked、degraded linked、checkpoint linked、report boundary linked。 | local assembly 不等于 durable task state。 |
| job entry result | completed、partial、blocked、failed、degraded、unavailable、replayed safe result。 | duplicate/replay 语义只写边界,完整幂等矩阵后移。 |

### 5. trigger flow 思考

| trigger group | Step 9 flow 来源 | 影响边界 |
|---|---|---|
| maintenance request accepted | `RequestReadMaterialRefreshFlow`;`RequestTraceMaterialRefreshFlow`;`RequestConsistencyRecoveryFlow` | 创建 task truth、progress seed、run history start。 |
| maintenance control | `MarkMaintenanceSuspendedFlow`;`SupersedeMaintenanceRequestFlow`;`RequireMaintenanceFormalInterventionFlow` | suspend / supersede task,或记录 formal intervention issue。 |
| read material refresh jobs | `RefreshCatalogAndDefinitionReadMaterialsFlow`;`RefreshFormalVersionReadMaterialsFlow`;`RefreshConsumptionReadMaterialsFlow`;`RefreshRelationDistributionMaterialsFlow`;`RefreshExternalSummaryReadMaterialsFlow`;`RefreshPeripheralReadMaterialsFlow` | read refresh task running / partial / completed / blocked,progress/checkpoint/report boundary。 |
| trace/audit/impact refresh job | `RefreshTraceAuditImpactMaterialsFlow` | trace task progress、partial lineage issue、report boundary。 |
| consistency recovery job | `RunConsistencyRecoveryConvergenceFlow` | recovery task evaluating/converged/intervention issue/progress/report boundary。 |
| duplicate / resume branch | Step 9 job branch discipline | stored report replay或 checkpoint resume;不重新扫描 target。 |
| query flows | maintenance progress/task/run history/pending scope Query | no-write read surface;不得触发 transition。 |
| outbound publication candidate | maintenance requested/progress changed event candidate flows | 只作为 R10.19/R10.20 outbound 输入;本组不写 publication outcome。 |

### 6. precondition / marker 来源思考

| precondition / marker | 正式来源 | 使用限制 |
|---|---|---|
| task identity / scope / kind | maintenance task repository、command accepted task refs、job input shell。 | 不得从 scheduler name、queue payload、free-form scope 或 string prefix 推导。 |
| run identity | maintenance request command、run history repository、job shell。 | run ref 不等于 process id、worker id 或 batch id。 |
| target batch | `MethodAssetRefreshTargetPlannerPort`。 | service 不做全表猜测、private map 反查或 fake-only target rule。 |
| checkpoint / resume | `MethodAssetJobCheckpointStorePort`、previous progress、run history summary。 | 不得用 page cursor、optimistic version、retry count、queue offset 或 lease 代替。 |
| progress marker | progress repository、application job orchestration output、job progress assembly。 | progress 只能被 Query / report 复制,不能反推 task truth。 |
| partial failure / issue marker | recovery issue repository、safe diagnostic、degraded decision。 | 不保存 raw exception、provider payload、raw evidence 或 report body。 |
| blocked / unavailable marker | runtime assembly registry、adapter availability port、safe diagnostic。 | full runtime / entry 状态后移;当前只复制 unavailable precondition。 |
| report boundary | job progress/result assembly、run history repository、report boundary ref。 | 不保存 markdown、JSON、metrics、raw log 或 artifact body。 |
| duplicate / replay surface | stored operation result、run history、checkpoint。 | 完整幂等状态矩阵后移 R10.17/R10.18 / Step 13。 |

### 7. watch / blocker 思考

| ID | topic | R10.15 判断 | R10.16 处理 |
|---|---|---|---|
| ML-D03-S10-JOB-WATCH-001 | task truth vs progress view | Step 7 已明确切开,但 R10.16 必须避免 progress 反推 task completed/superseded。 | 写 cross forbidden table。 |
| ML-D03-S10-JOB-WATCH-002 | checkpoint schema | checkpoint 来源已闭为 store / progress / history,但 durable key/schema 属 Step 11/13。 | R10.16 只写 support boundary。 |
| ML-D03-S10-JOB-WATCH-003 | report body/schema | Step 6/8 明确 body-free,Step 15/16 再承接 observability/test。 | R10.16 只写 report boundary ref。 |
| ML-D03-S10-JOB-WATCH-004 | runtime/availability | 本组需要 blocked/unavailable marker,但完整 runtime/entry lifecycle 在 R10.17/R10.18。 | 当前只作为 precondition 来源。 |
| ML-D03-S10-JOB-WATCH-005 | recovery issue repair semantics | consistency recovery convergence 不能自动修 core truth。 | R10.16 写 issue disposition,不写 repair success。 |
| ML-D03-S10-JOB-BLOCK-001 | none | 当前 maintenance/job/report 思考未发现必须回退 Step 6/7/8/9 的 hard blocker。 | 无暂停。 |

### 8. R10.16 写入顺序思考

| 顺序 | 写入对象 / 边界 | 原因 |
|---|---|---|
| 1 | refresh task family | `ReadMaterialRefreshTask` 与 `TraceMaterialRefreshTask` 是 job 执行的任务 truth 基础。 |
| 2 | consistency recovery task | recovery task 与 refresh task 相似,但必须单独处理 intervention / convergence。 |
| 3 | recovery issue disposition | recovery task、partial failure 和 formal intervention 都依赖 issue surface。 |
| 4 | maintenance progress view boundary | progress 复制 task/checkpoint/issue/job result,但不反推 truth。 |
| 5 | run history / report boundary | run chronology 和 report linkage 承接 job closure,保持 body-free。 |
| 6 | checkpoint / resume support boundary | resume / partial continuation 需要独立于 cursor、version、retry。 |
| 7 | job progress assembly / job entry result boundary | local jobs state 汇总 progress/report/result,但不成为 domain truth。 |
| 8 | cross forbidden / side-effect table | 汇总 no repair、no scheduler、no report body、no marker synthesis、query no-write。 |

### 9. R10.15 stop-review

| 检查项 | 结果 |
|---|---|
| 是否只思考 maintenance/job/report 状态族 | pass |
| 是否切开 task truth、progress view、run history、checkpoint、issue 和 local job result | pass |
| 是否列出输入来源、trigger flow 和 precondition / marker 来源 | pass |
| 是否规划 R10.16 写入顺序 | pass |
| 是否未写最终状态集合、ASCII 图或 From / To 矩阵 | pass |
| 是否未写 idempotency/runtime、outbound/handoff 状态矩阵 | pass |
| 是否未写 persistence schema、error taxonomy、config key、test case schema 或 implementation code | pass |
| 是否修改正式 `03-详细设计.md` | no |

next_allowed_action: 等待用户确认后进入 Step 10 `R10.16 maintenance/job/report 状态机:再写入`;只允许写入 refresh task family、consistency recovery task、recovery issue disposition、maintenance progress view boundary、run history / report boundary、checkpoint / resume support boundary、job progress assembly / job entry result boundary、cross forbidden / side-effect table 和停审表;不得直接修改正式 `03-详细设计.md`;不得写 idempotency/replay/runtime/entry、outbound/handoff 的状态矩阵;不得写 persistence schema、error taxonomy、config key、test case schema、implementation code 或进入 Step 11。

---

## R10.16 maintenance/job/report 状态机:再写入

### 1. 写入范围

本模块只写 maintenance / job / report 状态族。task truth、progress view、run history、checkpoint、recovery issue 和 local job result 必须保持独立,不得压成单一 job lifecycle。

| 状态主语 / 边界 | owner | trigger source | 当前处理 |
|---|---|---|---|
| `ReadMaterialRefreshTask` | application maintenance task truth | request read refresh command;read material refresh jobs;maintenance control commands | 写 refresh task family 矩阵 |
| `TraceMaterialRefreshTask` | application maintenance task truth | request trace refresh command;trace/audit/impact refresh job;maintenance control commands | 写 refresh task family 矩阵 |
| `ConsistencyRecoveryTask` | application recovery task truth | request recovery command;convergence job;formal intervention / suspend / supersede commands | 写 recovery task 矩阵 |
| `MethodAssetRecoveryIssue` | application recovery issue surface | partial failure;formal intervention;blocked recovery;safe diagnostic | 写 issue disposition 矩阵 |
| `MaintenanceProgressView` | application progress read surface | task truth changes;checkpoint;issue;job result summary | 写 progress view boundary |
| `MaintenanceRunHistory` / report boundary | application run chronology + report linkage | request accepted;job partial/completed/blocked;report boundary linked | 写 run/report boundary |
| checkpoint / resume support | checkpoint store support boundary | resume branch;partial continuation;completed closure | 写 checkpoint support boundary |
| `MethodAssetJobProgressAssemblyState` / `MethodAssetJobEntryResultState` | jobs local safe result boundary | job entry execution;partial/degraded/unavailable;duplicate report replay | 写 local job boundary |

### 2. refresh task family 状态机

适用对象: `ReadMaterialRefreshTask` 与 `TraceMaterialRefreshTask`。两者共用任务 truth 模式,但 trigger 必须分别回指 read material refresh jobs 与 trace/audit/impact refresh job。

状态集合:

| state | 含义 | source / owner |
|---|---|---|
| `Requested` | maintenance request command accepted,task truth 已登记。 | command flow + task repository |
| `Planned` | target planner 已为正式 scope 形成 body-free target batch / resume slice。 | refresh target planner |
| `Running` | operations job 已基于 task truth 和 checkpoint 进入执行。 | job execution overlay |
| `Partial` | 部分 target 失败或 degraded,已形成 safe issue / partial marker。 | job result + recovery issue repository |
| `Completed` | task 目标在当前 run 下闭合,progress/report boundary 已形成。 | progress/run history |
| `Suspended` | maintenance control 明确暂停当前 task。 | suspend command |
| `Superseded` | later formal request 或 control command 取代当前 task。 | supersede command |
| `Blocked` | runtime/adapter/scope precondition 不满足,task 保留但不能继续。 | runtime availability + safe diagnostic |

```text
[Requested]
  | target_plan_ready
  v
[Planned] -- job_started --> [Running]
   |                         | partial_issue
   | blocked                 v
   v                      [Partial] -- resume_ready --> [Running]
[Blocked]                  | completed_with_partial_report
   ^                       v
   |                    [Completed]
   |
[Suspended] <--- suspend --- [Requested]/[Planned]/[Running]/[Partial]/[Blocked]

[Requested]/[Planned]/[Running]/[Partial]/[Blocked]/[Suspended] -- supersede --> [Superseded]
```

| from | trigger | precondition | to | side effect boundary |
|---|---|---|---|---|
| virtual none | `RequestReadMaterialRefreshFlow` / `RequestTraceMaterialRefreshFlow` accepted | scope ref、run ref、task kind 和 safe reason 均来自 command shell;stored command result saved | `Requested` | create task truth;seed progress/run history;event candidate hint only |
| `Requested` | target planning succeeds | task exact read succeeds;`MethodAssetRefreshTargetPlannerPort` returns body-free target batch | `Planned` | may save progress hint/checkpoint anchor;no material refresh yet |
| `Requested` / `Planned` | target planning or required adapter unavailable | availability / safe diagnostic copied from runtime assembly or adapter availability | `Blocked` | save safe diagnostic/progress;no private retry state |
| `Planned` | operations job starts | task version accepted;checkpoint absent or resume-ready;job input shell matches task kind/scope | `Running` | job execution may refresh derived material only |
| `Running` | target partial failure | safe partial failure refs or recovery issue refs created;raw error/body absent | `Partial` | save issue/progress/checkpoint/report boundary |
| `Partial` | resume from checkpoint | checkpoint store returns formal resume anchor;task not suspended/superseded | `Running` | continue from checkpoint;no queue offset substitution |
| `Running` / `Partial` | all formal targets closed | progress view and run history closure recorded;report boundary ref body-free | `Completed` | save stored report/result;event candidate hint only |
| `Requested` / `Planned` / `Running` / `Partial` / `Blocked` | `MarkMaintenanceSuspendedFlow` accepted | task exact read;safe suspend reason ref present | `Suspended` | save task state and progress hint;no scheduler operation |
| `Requested` / `Planned` / `Running` / `Partial` / `Blocked` / `Suspended` | `SupersedeMaintenanceRequestFlow` accepted | superseding request/run ref present;safe reason ref present | `Superseded` | save task state and run history milestone |

非法转换占位:

| from | forbidden trigger | reason |
|---|---|---|
| any task state | modify definition/formal version/relation/external/package truth | maintenance jobs cannot repair or create core truth。 |
| `Completed` | resume job body | completed task can only be replayed via stored result/report;no target scan。 |
| `Superseded` | continue old task | superseded task is closed to new execution。 |
| any task state | derive state from queue/cron/lease/retry/process status | scheduler/runtime detail is not task truth。 |
| any task state | use progress view as state authority | task repository is the task truth owner。 |

### 3. `ConsistencyRecoveryTask` 状态机

状态集合:

| state | 含义 | source / owner |
|---|---|---|
| `Requested` | recovery request command accepted。 | command flow + task repository |
| `Evaluating` | convergence job 正在基于 impact/protection/material refs 评估。 | job flow |
| `IssueRecorded` | 发现 body-free recovery issue 或 partial convergence issue。 | recovery issue repository |
| `FormalInterventionRequired` | 需要正式人工/治理介入,但未自动修复 truth。 | intervention command / recovery judgement |
| `Converged` | 当前 recovery scope 的收敛判定已闭合。 | convergence job result |
| `Suspended` | recovery task 被正式暂停。 | suspend command |
| `Superseded` | recovery task 被后续正式请求取代。 | supersede command |
| `Blocked` | runtime、scope 或 required refs 不可用。 | safe diagnostic / availability |

```text
[Requested] -- convergence_job_started --> [Evaluating]
     |                                  | issue_found
     | blocked                          v
     v                              [IssueRecorded]
 [Blocked]                              | formal_intervention_needed
     ^                                  v
     |                         [FormalInterventionRequired]
     |                                  |
     | convergence_closed               | intervention_recorded
     v                                  v
 [Converged] <--------------------- [Evaluating]

[Requested]/[Evaluating]/[IssueRecorded]/[FormalInterventionRequired]/[Blocked]
  -- suspend --> [Suspended]
any non-terminal control-open state -- supersede --> [Superseded]
```

| from | trigger | precondition | to | side effect boundary |
|---|---|---|---|---|
| virtual none | `RequestConsistencyRecoveryFlow` accepted | recovery scope、affected refs、safe reason 来自 command shell | `Requested` | create recovery task;seed progress/run history |
| `Requested` | `RunConsistencyRecoveryConvergenceFlow` starts | task exact read;target planner / impact / protection refs available;checkpoint valid or absent | `Evaluating` | no repair;evaluate convergence only |
| `Requested` / `Evaluating` | required refs / adapter unavailable | unavailable marker copied from availability source;safe diagnostic present | `Blocked` | save progress/issue hint;no retry loop state |
| `Evaluating` | body-free issue detected | recovery issue repository can save safe issue refs | `IssueRecorded` | save issue/progress/report boundary |
| `Evaluating` / `IssueRecorded` | formal intervention required | safe intervention reason/ref present;no raw evidence body | `FormalInterventionRequired` | save issue and follow-up hint;no governance execution |
| `Evaluating` / `IssueRecorded` | convergence closed without open blocking issue | progress closure and run history milestone ready | `Converged` | save stored report/result;event candidate hint only |
| `Requested` / `Evaluating` / `IssueRecorded` / `FormalInterventionRequired` / `Blocked` | `MarkMaintenanceSuspendedFlow` accepted | safe suspend reason ref present | `Suspended` | save task state and progress hint |
| any control-open recovery state | `SupersedeMaintenanceRequestFlow` accepted | superseding recovery request/run ref present | `Superseded` | save task state and run milestone |

非法转换占位:

| from | forbidden trigger | reason |
|---|---|---|
| any recovery state | automatic core truth repair | recovery convergence records issues / convergence only。 |
| `FormalInterventionRequired` | mark converged without formal intervention record or issue closure source | intervention requirement cannot be skipped。 |
| `Converged` | append new issue into same closed task | create/supersede new task instead。 |
| any recovery state | store raw evidence, provider payload, repair script or report body | recovery state is body-free。 |

### 4. `MethodAssetRecoveryIssue` disposition 边界

Recovery issue 是 safe issue surface,不是 repair result。它可以由 recovery convergence、partial failure、formal intervention 或 blocked target 分支创建。

状态集合:

| state | 含义 | public / report surface |
|---|---|---|
| `Pending` | issue 已记录,等待后续 job/resolution/intervention 处理。 | pending issue ref |
| `Blocked` | issue 当前阻止 task/run 继续。 | blocked issue marker |
| `InterventionRequired` | issue 需要正式人工/治理介入。 | formal intervention hint |
| `Acknowledged` | issue 已被正式承认并可用于报告/后续处理。 | acknowledged issue marker |
| `LinkedToProgress` | issue 已安全链接到 progress view / run history / report boundary。 | issue linkage ref |

```text
[Pending] -- blocks_task --> [Blocked]
    | formal_intervention_needed
    v
[InterventionRequired] -- acknowledged --> [Acknowledged]
    \                                       /
     \--------- linked_to_progress --------/
                       v
               [LinkedToProgress]
```

| from | trigger | precondition | to | side effect boundary |
|---|---|---|---|---|
| virtual none | partial failure / recovery issue detected | safe diagnostic refs present;raw evidence/provider body absent | `Pending` | save body-free issue |
| `Pending` | issue blocks task/job continuation | blocked marker copied from recovery judgement or availability summary | `Blocked` | progress may reference issue;no retry state |
| `Pending` / `Blocked` | formal intervention required | formal intervention reason/hint ref present | `InterventionRequired` | follow-up hint only;no governance execution |
| `Pending` / `Blocked` / `InterventionRequired` | issue acknowledged | actor/context ref and safe acknowledgement reason present | `Acknowledged` | run history milestone may be linked |
| `Pending` / `Blocked` / `InterventionRequired` / `Acknowledged` | progress/report links issue | progress view ref or report boundary ref present | `LinkedToProgress` | no report body,only refs |

非法转换占位:

| from | forbidden trigger | reason |
|---|---|---|
| any issue state | mark core truth repaired | issue disposition does not prove repair。 |
| any issue state | store raw evidence / provider payload / stack trace | issue surface is body-free。 |
| `LinkedToProgress` | mutate task truth through issue link | progress/report linkage is not task state authority。 |

### 5. `MaintenanceProgressView` boundary

Progress view 是 Query / report 可见 surface。它复制 task、checkpoint、issue、job result summary,但不得决定 task truth。

状态集合:

| boundary label | 含义 | source |
|---|---|---|
| `ProgressSeeded` | request accepted 后已有 progress seed。 | request command / task repository |
| `ProgressRunning` | job 正在执行并输出 progress marker。 | job orchestration output |
| `ProgressPartial` | progress 包含 partial failure / issue refs。 | issue repository / job result |
| `ProgressDegraded` | progress view 可见但带 degraded marker。 | degraded decision / safe diagnostic |
| `ProgressUnavailable` | progress source 当前不可用。 | progress repository / adapter availability |
| `ProgressClosed` | task/run 对应 progress 已形成闭合 view。 | task closure / run history |

| operation | precondition | resulting label | side effect boundary |
|---|---|---|---|
| maintenance request accepted | task truth created;run ref present | `ProgressSeeded` | seed progress view;no job body |
| job progress update | task truth open;checkpoint/progress marker present | `ProgressRunning` | save progress snapshot;no task completion inference |
| partial issue linked | safe issue refs present | `ProgressPartial` | expose partial refs;no raw failure |
| degraded progress branch | degraded decision or safe diagnostic present | `ProgressDegraded` | query/report copies marker |
| progress repository unavailable | unavailable marker copied from formal source | `ProgressUnavailable` | no fallback private map |
| task closure reflected | task truth closed and run history milestone recorded | `ProgressClosed` | read surface closure only |

禁止事项:

| 禁止项 | reason |
|---|---|
| progress view sets task completed/superseded/suspended | task repository owns task truth。 |
| progress view stores report body, metrics body or worker log | progress surface is body-free。 |
| query progress starts refresh/retry/resume | Query no-write。 |
| progress marker derived from timestamp/cache/queue status | marker must come from formal progress/job output。 |

### 6. run history / report boundary

Run history 记录 body-free chronology、milestone summary、report boundary ref 和 handoff hint。它不是 raw log 或 metrics store。

状态集合:

| boundary label | 含义 | source |
|---|---|---|
| `RunStarted` | request accepted 后 run chronology 开始。 | command accepted result |
| `RunProgressed` | job/progress milestone 已追加。 | progress/job result summary |
| `RunPartial` | run 产生 partial issue/report marker。 | partial issue refs |
| `RunBlocked` | run 因 runtime/adapter/scope blocked。 | availability / safe diagnostic |
| `RunCompleted` | run 已形成 closure milestone。 | task/job completion |
| `ReportBoundaryLinked` | body-free report boundary ref 已链接。 | job progress/result assembly |
| `HandoffHinted` | 后续 handoff hint 已记录。 | safe handoff hint |

| from / boundary | trigger | precondition | to / boundary | side effect boundary |
|---|---|---|---|---|
| virtual none | maintenance request accepted | run ref and scope ref present | `RunStarted` | append start milestone |
| `RunStarted` / `RunProgressed` | progress snapshot saved | progress view ref and safe milestone summary present | `RunProgressed` | append body-free chronology |
| `RunStarted` / `RunProgressed` | partial issue linked | issue refs safe and body-free | `RunPartial` | append partial milestone |
| `RunStarted` / `RunProgressed` | blocked/unavailable branch | blocked marker copied from availability or safe diagnostic | `RunBlocked` | append blocked milestone |
| `RunProgressed` / `RunPartial` | task/job closure | stored job result and progress closure available | `RunCompleted` | append completion milestone |
| any run milestone | report boundary created | `MethodAssetJobReportBoundaryRef` present;report body absent | `ReportBoundaryLinked` | link report boundary ref only |
| any report-linked milestone | handoff hint created | safe handoff hint ref present | `HandoffHinted` | hint only;handoff outcome deferred |

禁止事项:

| 禁止项 | reason |
|---|---|
| save markdown/JSON report body, raw log, metrics payload or artifact body | run history is body-free chronology。 |
| use run history as task truth | task repository remains authority。 |
| make publication/handoff outcome from report boundary | outbound/handoff deferred to R10.19/R10.20。 |

### 7. checkpoint / resume support boundary

Checkpoint 是 job resume anchor,不是 optimistic version、repository page cursor、queue offset、retry token 或 lease。

| boundary label | 含义 | allowed source |
|---|---|---|
| `CheckpointAbsent` | 当前 task/run 无可用 checkpoint。 | checkpoint store safe absence |
| `CheckpointPresent` | persisted checkpoint ref 可读取。 | checkpoint store |
| `ResumeReady` | checkpoint 与 task/run/job family 匹配,可恢复。 | checkpoint store + task truth |
| `PartialContinuation` | checkpoint 表达 partial continuation anchor。 | partial progress/job result |
| `CheckpointClosed` | task/run completed 或 superseded 后 checkpoint 不再用于恢复。 | task closure/run history |
| `CheckpointInvalidSafe` | checkpoint 不匹配或不可安全使用。 | safe diagnostic |

| operation | precondition | resulting label | side effect boundary |
|---|---|---|---|
| job starts without checkpoint | checkpoint store returns safe absence | `CheckpointAbsent` | planner starts from formal scope |
| job loads checkpoint | checkpoint ref belongs to run/task/job family | `CheckpointPresent` | no target scan yet |
| resume branch | checkpoint present and task open | `ResumeReady` | planner resumes from anchor |
| partial failure saved | partial failure refs and continuation anchor present | `PartialContinuation` | save checkpoint/progress;no retry state |
| task/run closure | completed/superseded task state recorded | `CheckpointClosed` | checkpoint no longer drives execution |
| mismatch/unavailable checkpoint | safe diagnostic present | `CheckpointInvalidSafe` | degraded/blocked surface only |

禁止事项:

| 禁止项 | reason |
|---|---|
| use retry count, queue offset, lease token, thread id or process id as checkpoint | runtime scheduler details are not formal checkpoint。 |
| use checkpoint as optimistic version or material freshness marker | version/freshness/checkpoint are separate。 |
| parse checkpoint ref string to recover scope | checkpoint store/planner must provide formal summary。 |

### 8. job progress assembly / job entry result boundary

`MethodAssetJobProgressAssemblyState` 与 `MethodAssetJobEntryResultState` 是 jobs local safe result boundary。它们服务 report、handoff、observability 和 tests,不替代 maintenance task truth。

状态集合:

| local state | 含义 | source |
|---|---|---|
| `ProgressAssembled` | progress view ref 已由 application job orchestration 输出。 | progress repository / job output |
| `PartialFailureLinked` | partial failure refs 已安全链接。 | safe issue refs / diagnostic |
| `DegradedLinked` | degraded decision 已链接。 | degraded decision / availability |
| `CheckpointLinked` | checkpoint ref 已链接。 | checkpoint store / progress output |
| `ReportBoundaryLinked` | report boundary ref 已链接。 | report boundary assembly |
| `ResultCompleted` | job 本地 safe result 为 completed。 | stored operation result |
| `ResultPartial` | job 本地 safe result 为 partial。 | partial progress / issue refs |
| `ResultBlocked` | job 本地 safe result 为 blocked。 | precheck / availability diagnostic |
| `ResultFailedSafe` | job 本地 safe result 为 failed,但只含 safe diagnostic。 | safe diagnostic |
| `ResultDegraded` | job 本地 safe result 为 degraded / unavailable。 | degraded / unavailable marker |
| `ResultReplayed` | duplicate job 直接重放 stored result/report。 | stored result / run history |

```text
[ProgressAssembled]
   | partial_failure
   v
[PartialFailureLinked] -- report_boundary --> [ReportBoundaryLinked]
   | degraded
   v
[DegradedLinked]

[CheckpointLinked] can attach to any open progress assembly state.

job result:
[ResultCompleted] / [ResultPartial] / [ResultBlocked] / [ResultFailedSafe] /
[ResultDegraded] / [ResultReplayed]
are terminal for the local job entry invocation.
```

| from | trigger | precondition | to | side effect boundary |
|---|---|---|---|---|
| virtual progress assembly | job progress output | progress view ref present;body-free progress summary | `ProgressAssembled` | local assembly;may feed progress/run history |
| `ProgressAssembled` | partial failure detected | partial failure refs safe and redacted | `PartialFailureLinked` | issue/progress/report refs only |
| `ProgressAssembled` / `PartialFailureLinked` | degraded/unavailable branch | degraded decision ref or availability marker present | `DegradedLinked` | no raw diagnostic |
| any open progress assembly | checkpoint saved | checkpoint ref present and belongs to run/task/job family | `CheckpointLinked` | resume anchor only |
| any progress assembly | report boundary created | report boundary ref present;report body absent | `ReportBoundaryLinked` | link report boundary only |
| virtual job result | job closure success | stored operation result ref and progress assembly ref present | `ResultCompleted` | terminal local result |
| virtual job result | job closure with partial issue | progress assembly ref and issue refs present | `ResultPartial` | terminal local result;follow-up hint allowed |
| virtual job result | precheck/runtime/scope blocked | safe diagnostic refs present | `ResultBlocked` | terminal local result;no scheduler retry state |
| virtual job result | safe failure branch | safe diagnostic refs present;raw error absent | `ResultFailedSafe` | terminal local result |
| virtual job result | degraded/unavailable result branch | degraded/unavailable marker copied from formal source | `ResultDegraded` | terminal local result |
| virtual job result | duplicate report replay | stored operation result or run history report surface present | `ResultReplayed` | no job body execution |

非法转换占位:

| from | forbidden trigger | reason |
|---|---|---|
| any local job state | mutate maintenance task truth without task repository transition | local result is not task truth。 |
| any local job state | store process exit code, OS signal, queue status or scheduler status as result kind | job result kind is safe protocol state。 |
| `ResultReplayed` | rerun job body or scan targets | duplicate/replay must use stored surface。 |
| any local job state | store report body, raw log, metric payload, external response or stack trace | local job boundary is body-free。 |

### 9. cross forbidden / side-effect table

| axis | allowed | forbidden |
|---|---|---|
| task truth authority | `MethodAssetMaintenanceTaskRepository` saves task truth changes。 | progress view、run history、checkpoint、job local result 反推 task completed/superseded/suspended。 |
| derived material write | Operations Job 只刷新派生 read material / trace material / peripheral material。 | 修改 core truth、重做 formalization、修 relation truth、复制 external body。 |
| recovery | recovery task records convergence / issue / intervention requirement。 | automatic repair success、repair script、raw evidence body。 |
| checkpoint | checkpoint store / previous progress / run history provides resume anchor。 | retry count、queue offset、lease token、timestamp、process id、optimistic version。 |
| report | report boundary ref、handoff hint、safe summary。 | markdown / JSON report body、metrics payload、raw log、artifact/archive body。 |
| runtime unavailable | runtime assembly registry / adapter availability / safe diagnostic。 | raw IO error、SQL/HTTP status、exception text、scheduler state。 |
| Query | maintenance progress / task summary / run history reads are no-write。 | Query starts refresh/resume/retry or creates issue。 |
| outbound / handoff | event candidate / handoff hint may be produced as body-free side effect candidate。 | publication outcome、delivery receipt、handoff completion in this state family。 |

### 10. R10.16 stop-review

| 检查项 | 结果 |
|---|---|
| 是否写入 refresh task family 状态机 | pass |
| 是否写入 `ConsistencyRecoveryTask` 状态机 | pass |
| 是否写入 `MethodAssetRecoveryIssue` disposition 边界 | pass |
| 是否写入 maintenance progress view boundary | pass |
| 是否写入 run history / report boundary | pass |
| 是否写入 checkpoint / resume support boundary | pass |
| 是否写入 job progress assembly / job entry result boundary | pass |
| 是否写入 cross forbidden / side-effect table | pass |
| 是否未写 idempotency/replay/runtime/entry、outbound/handoff 状态矩阵 | pass |
| 是否未写 persistence schema、error taxonomy、config key、test case schema 或 implementation code | pass |
| 是否修改正式 `03-详细设计.md` | no |

next_allowed_action: 等待用户确认后进入 Step 10 `R10.17 idempotency/replay/runtime/entry 状态机:先思考`;只允许思考 idempotency guard、stored operation result、duplicate replay、inbound receipt replay、runtime assembly state、adapter availability state、api / worker / jobs entry local result 的状态主语筛选、输入来源、状态集合草案边界、trigger flow、marker/precondition 来源和 `R10.18` 写入顺序;不得直接修改正式 `03-详细设计.md`;不得写 outbound/publication/handoff 的状态矩阵;不得写 persistence schema、error taxonomy、config key、test case schema、implementation code 或进入 Step 11。

---

## R10.17 idempotency/replay/runtime/entry 状态机:先思考

### 1. 当前模块目标

`R10.17` 只思考 idempotency / replay / runtime / entry 状态族如何切分,为 `R10.18` 写入做准备。当前模块不写最终状态集合、ASCII 图或 From / To 转换矩阵。

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm |
| 当前允许 | 思考 idempotency guard、stored operation result、duplicate replay、inbound receipt replay、runtime assembly state、adapter availability state、api / worker / jobs entry local result 的状态主语筛选、输入来源、状态集合草案边界、trigger flow、marker/precondition 来源和 `R10.18` 写入顺序。 |
| 当前禁止 | 写最终状态集合、ASCII 图、From / To 转换矩阵、outbound/publication/handoff 状态矩阵、persistence schema、error taxonomy、config key、test case schema、implementation code 或正式 `03-详细设计.md`。 |

### 2. 状态主语筛选思考

本组容易把 Step 13 幂等持久化、Step 14 runtime binding、entry transport 细节和 Step 10 状态矩阵混在一起。`R10.18` 只能写 Step 6/7/8/9 已经闭口的 state / decision / local result boundary。

| 候选 | Step 6/7/8/9 来源 | R10.17 判定 | R10.18 处理 |
|---|---|---|---|
| `MethodAssetIdempotencyGuard` | Step 6 guard object;Step 7 stored result seam;Step 9 command/inbound/job shared templates。 | `enter_state_matrix` | 写 fresh / duplicate replay / conflict / rejected guard decision boundary。 |
| `MethodAssetStoredOperationResult` | Step 6 stored result object;Step 8 result/replay shell;Step 9 duplicate branch。 | `enter_state_matrix` | 写 accepted / rejected / ignored / conflict replay-safe result boundary。 |
| duplicate replay surface | Step 8 replay guardrail;Step 9 command/inbound/job duplicate branch。 | `support_boundary_matrix` | 写 command / inbound / job replay source boundary,不写 durable store schema。 |
| inbound receipt replay | Step 6 inbound intake decision + worker result;Step 8 inbound receipt shell;Step 9 inbound duplicate branch。 | `support_boundary_matrix` | 写 receipt replay / ignored / rejected / delayed / quarantine 思考边界。 |
| `MethodAssetRuntimeAssemblyState` | Step 6 infra runtime object;Step 7 runtime assembly registry;Step 9 entry/job precheck。 | `enter_state_matrix` | 写 not started / validating / assembling / ready / degraded / failed assembly boundary。 |
| `MethodAssetAdapterAvailabilityState` | Step 6 availability object;Step 7 adapter availability port;Step 9 degraded/unavailable precheck。 | `enter_state_matrix` | 写 available / degraded / unavailable / disabled / unsupported boundary。 |
| `MethodAssetApiEntryContext` / command/query handler entry | Step 6 API entry objects;Step 7 entry restriction;Step 9 API entry template。 | `technical_local_state` | 写 ready / blocked / unsupported / runtime unavailable / dispatched boundary。 |
| `MethodAssetApiResponseAssemblyState` | Step 6 API response assembly;Step 8 response/rejection shell;Step 9 command/query return。 | `technical_local_state` | 写 ready / rejected / degraded / blocked / unavailable response assembly boundary。 |
| `MethodAssetWorkerEntryContext` / inbound / publisher entry | Step 6 worker entry objects;Step 7 entry restriction;Step 9 inbound/outbound templates。 | `technical_local_state` | 写 worker context / inbound entry / publisher entry local boundary,但 publication outcome 细节留 R10.19/R10.20。 |
| `MethodAssetWorkerEntryResultState` | Step 6 worker result object;Step 8 worker result shell;Step 9 inbound / publisher branch。 | `technical_local_state` | 写 accepted / ignored / rejected / blocked / degraded / unavailable local result。 |
| `MethodAssetJobRunnerContext` / `MethodAssetOperationJobEntry` | Step 6 jobs entry;Step 7 entry restriction;Step 9 jobs entry template。 | `technical_local_state` | 写 entry ready / blocked / unsupported / dispatched boundary;job result 已在 R10.16,重复处只引用。 |
| durable idempotency table / lock / TTL | Step 6 明确 no_store_schema。 | `exclude_defer_step11_13` | 不进入 R10.18。 |
| config key / secret / URL / topic / queue / process lifecycle | Step 6/7 明确禁入。 | `exclude_defer_step14_or_out_of_scope` | 不进入 R10.18。 |

### 3. 输入来源思考

| 输入层 | 可用来源 | R10.18 使用方式 |
|---|---|---|
| Step 6 application helper | `MethodAssetIdempotencyGuard`;`MethodAssetStoredOperationResult`;operation context。 | 作为 idempotency / replay 状态主语。 |
| Step 6 infra support | `MethodAssetRuntimeAssemblyState`;`MethodAssetAdapterAvailabilityState`;safe diagnostic。 | 作为 runtime / availability 状态主语和 entry precondition。 |
| Step 6 entry objects | API、worker、jobs entry context / handler / result state。 | 作为 entry-local state boundary。 |
| Step 7 stored result / idempotency seam | stored result helper、UoW / id / clock / fake durable parity。 | 只写 replay source / guard decision boundary;durable schema 后移。 |
| Step 7 runtime / availability ports | runtime assembly registry、adapter availability port、entry restriction map。 | 写 ready/degraded/failed/blocked precondition 来源。 |
| Step 8 protocol shell | command accepted/rejected/duplicate、inbound receipt、job result/report replay、public marker / result shell。 | 约束 state label 与 public surface 一致。 |
| Step 9 shared templates | command duplicate,query no-write,inbound duplicate receipt replay,job duplicate report replay,entry facade-only。 | 作为 trigger / forbidden branch 第一来源。 |

### 4. 状态集合草案边界

下表只描述 `R10.18` 可展开的状态切片,不是最终状态名或状态集合。

| 状态主语 / 边界 | 状态切片思考 | R10.18 注意事项 |
|---|---|---|
| idempotency guard decision | fresh、duplicate replay、conflict、rejected、digest mismatch、scope mismatch。 | 不写 lock/TTL/table;只写 decision boundary。 |
| stored operation result | accepted、rejected、ignored、conflict、replay safe、replay unavailable / invalid safe。 | 不保存 DTO body;不重读 truth 重建 response。 |
| duplicate replay source | command stored result、inbound stored receipt、job stored report/checkpoint/run history。 | replay source 必须复制 stored surface;不重跑 mutation。 |
| runtime assembly | not started、validating config、assembling、ready、degraded、failed。 | 不写 config key、secret、builder call order 或 process lifecycle。 |
| adapter availability | available、degraded、unavailable、disabled by config、unsupported。 | marker 来自 health/config summary;不从 raw error 分类。 |
| API entry local | context ready、command/query entry ready、unsupported family、runtime blocked、dispatched、response assembled。 | entry 只能调用 application facade;不直连 repository/UoW。 |
| API response assembly | success response ready、safe rejection ready、degraded response、blocked/unavailable response。 | 不写 HTTP status 或 transport mapping。 |
| worker entry local | inbound ready、publisher ready、duplicate/no-op ignored、blocked/degraded/unavailable。 | inbound receipt 可写;publication outcome 细节后移 R10.19/R10.20。 |
| jobs entry local | runner context ready、job entry ready、precheck blocked、unsupported job family、dispatched。 | job result/report boundary 已在 R10.16;R10.18 只写 entry/precheck。 |

### 5. trigger flow 思考

| trigger group | Step 9 flow 来源 | 影响边界 |
|---|---|---|
| Command entry duplicate | shared command template;58 Command flows duplicate branch。 | idempotency guard duplicate_replay;stored command result replay。 |
| Command conflict / rejected | command metadata/digest/scope mismatch;safe rejection branch。 | guard conflict/rejected;stored rejected/conflict result。 |
| Inbound duplicate receipt | 4 Inbound Consumer flows duplicate branch。 | inbound receipt replay / ignored worker result。 |
| Job duplicate / resume | Operations Job template duplicate / checkpoint resume。 | job report replay / checkpoint source boundary;idempotency serialization deferred。 |
| Runtime precheck | API / worker / jobs entry templates;runtime assembly summary validation。 | entry blocked / runtime unavailable / degraded。 |
| Adapter availability precheck | resolver/publisher/handoff/store availability from Step 7 ports。 | availability degraded/unavailable;entry or service blocked。 |
| API response assembly | command/query service returns accepted/rejected/degraded/unavailable。 | response assembly local state。 |
| Worker publisher outcome | outbound publication template。 | only worker local blocked/degraded;publication outcome matrix deferred to R10.19/R10.20。 |

### 6. precondition / marker 来源思考

| precondition / marker | 正式来源 | 使用限制 |
|---|---|---|
| idempotency key | command metadata、inbound source event + dedup key、job task/cursor typed refs。 | 不得拼 raw request body、route、topic、queue id。 |
| operation digest | canonical safe material。 | 不得包含 raw payload、provider body、archive body、DTO body。 |
| dedup scope | operation family、subject ref、source kind、boundary scope typed refs。 | 不得用 free-form string 或 adapter private id。 |
| stored result | stored operation result ref / safe receipt / job report surface。 | 不得重跑 mutation或重读 current truth 重建。 |
| runtime assembly marker | runtime assembly registry / validated assembly state。 | 不得从 env、config file、DI container 或 process state 反推。 |
| availability marker | adapter health summary、config validation summary、adapter availability port。 | 不得从 exception text、HTTP/SQL code、timeout string 分类。 |
| entry blocked reason | entry precheck、runtime assembly、availability state、safe diagnostic。 | 不得含 raw token、header、broker ack、scheduler detail。 |
| response / receipt / result shell | Step 8 protocol shell + Step 6 entry/result object。 | 不展开 public DTO body 或 transport status。 |

### 7. watch / blocker 思考

| ID | topic | R10.17 判断 | R10.18 处理 |
|---|---|---|---|
| ML-D03-S10-REPLAY-WATCH-001 | durable idempotency schema | Step 6/7 明确后移 Step 11/13;R10.18 不写 store schema。 | 写 no_store_schema forbidden。 |
| ML-D03-S10-REPLAY-WATCH-002 | replay surface 字段 | Step 8 只给 shell family;R10.18 写 state boundary,不写 JSON/Rust 字段。 | 写 stored surface copy-only。 |
| ML-D03-S10-RUNTIME-WATCH-001 | runtime config binding | Step 14 才写 config key/secret/URL;R10.18 只写 assembly phase。 | 写 no_config_detail。 |
| ML-D03-S10-ENTRY-WATCH-001 | entry direct-call 风险 | Step 7 已固定 facade-only;R10.18 必须把 direct repository/UoW/adapter call 写入禁入表。 | 写 entry forbidden table。 |
| ML-D03-S10-OUTBOUND-WATCH-001 | publisher outcome 与 worker result 重叠 | Worker local result 可写 blocked/degraded/unavailable;publication outcome matrix 留 R10.19/R10.20。 | R10.18 不写 delivery/publication outcome。 |
| ML-D03-S10-REPLAY-BLOCK-001 | none | 当前思考未发现必须回退 Step 6/7/8/9 的 hard blocker。 | 无暂停。 |

### 8. R10.18 写入顺序思考

| 顺序 | 写入对象 / 边界 | 原因 |
|---|---|---|
| 1 | `MethodAssetIdempotencyGuard` decision matrix | command/inbound/job duplicate 的共同入口。 |
| 2 | `MethodAssetStoredOperationResult` replay-safe result matrix | duplicate replay 依赖 stored result surface。 |
| 3 | duplicate replay source boundary | 统一 command / inbound / job replay copy-only 规则。 |
| 4 | runtime assembly state matrix | entry 和 job precheck 都依赖 runtime assembly。 |
| 5 | adapter availability state matrix | degraded/unavailable/blocked marker 的正式来源。 |
| 6 | API entry / response assembly boundary | 同步入口 facade-only 与 safe response assembly。 |
| 7 | worker entry / worker result boundary | inbound receipt / publisher local result,但不写 publication outcome。 |
| 8 | jobs entry precheck boundary | jobs runner context / operation job entry local precheck,复用 R10.16 job result。 |
| 9 | cross forbidden / side-effect table | 汇总 no rerun, no entry direct call, no raw payload, no config detail, no scheduler/queue。 |

### 9. R10.17 stop-review

| 检查项 | 结果 |
|---|---|
| 是否只思考 idempotency/replay/runtime/entry 状态族 | pass |
| 是否区分 idempotency decision、stored result、runtime assembly、availability 和 entry-local state | pass |
| 是否列出输入来源、trigger flow 和 precondition / marker 来源 | pass |
| 是否规划 R10.18 写入顺序 | pass |
| 是否未写最终状态集合、ASCII 图或 From / To 矩阵 | pass |
| 是否未写 outbound/publication/handoff 状态矩阵 | pass |
| 是否未写 persistence schema、error taxonomy、config key、test case schema 或 implementation code | pass |
| 是否修改正式 `03-详细设计.md` | no |

next_allowed_action: 等待用户确认后进入 Step 10 `R10.18 idempotency/replay/runtime/entry 状态机:再写入`;只允许写入 `MethodAssetIdempotencyGuard` decision matrix、`MethodAssetStoredOperationResult` replay-safe result matrix、duplicate replay source boundary、runtime assembly state matrix、adapter availability state matrix、API entry / response assembly boundary、worker entry / worker result boundary、jobs entry precheck boundary、cross forbidden / side-effect table 和停审表;不得直接修改正式 `03-详细设计.md`;不得写 outbound/publication/handoff 的状态矩阵;不得写 persistence schema、error taxonomy、config key、test case schema、implementation code 或进入 Step 11。

---

## R10.18 idempotency/replay/runtime/entry 状态机:再写入

### 1. 写入范围

本模块只写 idempotency / replay / runtime / entry 状态族。它表达 decision、stored safe surface、runtime/availability technical state 和 entry-local result,不写 durable schema、config key、transport status、scheduler/queue 或 outbound delivery outcome。

| 状态主语 / 边界 | owner | trigger source | 当前处理 |
|---|---|---|---|
| `MethodAssetIdempotencyGuard` | application idempotency helper | command / inbound / job reserve duplicate branch | 写 decision matrix |
| `MethodAssetStoredOperationResult` | application stored replay summary | accepted / rejected / ignored / conflict result save;duplicate replay | 写 replay-safe result matrix |
| duplicate replay source boundary | application stored surface + checkpoint/run history support | command/inbound/job duplicate | 写 copy-only source boundary |
| `MethodAssetRuntimeAssemblyState` | infra runtime support | runtime builder / entry precheck | 写 assembly phase matrix |
| `MethodAssetAdapterAvailabilityState` | infra availability support | config validation / adapter health summary | 写 availability matrix |
| API entry / response assembly | api local entry | API command/query shared templates | 写 local boundary |
| worker entry / worker result | worker local entry | inbound consumer / publisher shared templates | 写 local boundary,publication outcome deferred |
| jobs entry precheck | jobs local entry | jobs shared template | 写 runner/entry precheck boundary |

### 2. `MethodAssetIdempotencyGuard` decision matrix

状态集合:

| state | 含义 | source |
|---|---|---|
| `Fresh` | 当前 idempotency key / digest / scope 未命中既有 result,可继续执行。 | idempotency guard reserve |
| `DuplicateReplay` | 同 key、同 digest、同 scope 命中 stored result,必须回放。 | stored result ref |
| `Conflict` | 同 key 但 subject、digest 或 scope 不一致。 | conflict safe reason |
| `Rejected` | idempotency 输入本身不合法或缺正式来源。 | safe reject reason |
| `ReplayUnavailable` | 命中 duplicate 但 stored surface 不可安全回放。 | safe diagnostic |

```text
[virtual:reserve_requested]
   | no stored result
   v
[Fresh]
   | matching stored result
   v
[DuplicateReplay]
   | digest/scope/subject mismatch
   v
[Conflict]
   | invalid metadata/source
   v
[Rejected]
   | stored surface missing/unsafe
   v
[ReplayUnavailable]
```

| from | trigger | precondition | to | side effect boundary |
|---|---|---|---|---|
| virtual reserve requested | command / inbound / job reserve | idempotency key、operation digest、dedup scope all typed and body-free;no matching stored result | `Fresh` | operation may continue;no durable schema specified |
| virtual reserve requested | duplicate hit | stored result ref exists;digest/scope/subject match;replay marker present | `DuplicateReplay` | return stored surface only;no mutation |
| virtual reserve requested | digest/scope/subject mismatch | safe conflict reason can be assembled;raw payload absent | `Conflict` | store/return safe conflict result |
| virtual reserve requested | invalid key/digest/scope source | safe reject reason present | `Rejected` | reject before mutation |
| virtual reserve requested | duplicate hit but stored surface unavailable/invalid | safe diagnostic present;no current truth reread allowed | `ReplayUnavailable` | degraded/rejection surface;no rerun |

非法转换占位:

| from | forbidden trigger | reason |
|---|---|---|
| `DuplicateReplay` | rerun command/inbound/job body | duplicate replay must copy stored surface。 |
| `Conflict` | treat as accepted duplicate | conflict is not idempotent success。 |
| any guard state | derive digest from raw body/provider payload/archive body | digest input must be canonical safe material。 |
| any guard state | define lock/TTL/table/transaction schema | persistence and concurrency details are Step 11/13。 |

### 3. `MethodAssetStoredOperationResult` replay-safe result matrix

状态集合:

| state | 含义 | replay surface |
|---|---|---|
| `StoredAccepted` | accepted branch 的 body-free summary 已可回放。 | accepted summary + effect refs |
| `StoredRejected` | safe rejection 已可回放。 | rejection reason + diagnostic refs |
| `StoredIgnored` | ignored / no-op / duplicate ignored 已可回放。 | ignore reason / receipt refs |
| `StoredConflict` | idempotency conflict 已可回放。 | conflict reason |
| `ReplaySafe` | stored result 通过 body-free / marker / ref 校验。 | replay marker |
| `ReplayInvalidSafe` | stored result 不满足安全回放条件。 | safe diagnostic only |

```text
[StoredAccepted] -- assert_replay_safe --> [ReplaySafe]
[StoredRejected] -- assert_replay_safe --> [ReplaySafe]
[StoredIgnored]  -- assert_replay_safe --> [ReplaySafe]
[StoredConflict] -- assert_replay_safe --> [ReplaySafe]
any stored result -- unsafe_surface --> [ReplayInvalidSafe]
```

| from | trigger | precondition | to | side effect boundary |
|---|---|---|---|---|
| virtual result saved | accepted operation completes | accepted summary ref and effect summary refs are body-free | `StoredAccepted` | safe summary only;no DTO body |
| virtual result saved | safe rejection assembled | safe reject reason and diagnostic refs present | `StoredRejected` | safe rejection only |
| virtual result saved | ignored / no-op branch | safe ignore reason or receipt ref present | `StoredIgnored` | safe ignored result |
| virtual result saved | conflict branch | conflict reason ref present | `StoredConflict` | safe conflict result |
| any stored result | replay safety assertion passes | replay marker present;no raw DTO/error/body | `ReplaySafe` | may be copied by duplicate branch |
| any stored result | replay safety assertion fails | raw body missing? unsafe marker? unavailable result source? safe diagnostic present | `ReplayInvalidSafe` | do not replay;return safe failure/degraded |

非法转换占位:

| from | forbidden trigger | reason |
|---|---|---|
| any stored state | store full public DTO body, raw error, provider payload, event payload or report body | stored result is safe summary only。 |
| `ReplayInvalidSafe` | replay by reloading current truth | replay cannot be reconstructed from current truth。 |
| any stored state | encode delivery/outbox/retry/dead-letter state | delivery state belongs to outbound/handoff or out of scope。 |

### 4. duplicate replay source boundary

| replay family | allowed source | forbidden fallback |
|---|---|---|
| Command duplicate | `MethodAssetStoredOperationResult` accepted/rejected/conflict surface。 | rerun command mutation;reload truth to rebuild response;reassemble DTO body。 |
| Inbound duplicate | stored consumer receipt / stored operation result / intake decision safe summary。 | reprocess raw envelope;read broker offset;call external adapter again。 |
| Job duplicate | stored job report/result,checkpoint,run history surface。 | rescan targets;rerun job body;use queue offset / retry count。 |
| Query | no write idempotency state。 | save stored query result or use command idempotency guard for read path。 |

| operation | precondition | resulting boundary | side effect boundary |
|---|---|---|---|
| duplicate command | guard state is `DuplicateReplay`;stored result is `ReplaySafe` | command response copied from stored safe surface | no mutation;no event candidate refresh |
| duplicate inbound | source dedup key matches;stored receipt safe | receipt / ignored result copied | no raw payload reprocess |
| duplicate job | task/run/job family key matches;stored report/checkpoint/history safe | job report/result copied or resume-ready checkpoint returned | no target scan |
| replay unavailable | stored surface absent or unsafe | safe rejection/degraded replay failure | no current truth reconstruction |

### 5. `MethodAssetRuntimeAssemblyState` state matrix

状态集合:

| state | 含义 | source |
|---|---|---|
| `NotStarted` | runtime assembly 尚未开始或尚未形成可见 state。 | runtime builder initial state |
| `ValidatingConfig` | 正在校验 typed config binding。 | runtime config binding summary |
| `Assembling` | 正在组装 service / port / adapter slots。 | runtime builder |
| `Ready` | required slots 已有可用 assembly summary。 | runtime assembly registry |
| `Degraded` | runtime 可部分启动,但存在 safe issue / unavailable slot。 | assembly issue refs |
| `Failed` | runtime assembly 无法提供 entry 可用 summary。 | safe diagnostic |

```text
[NotStarted] -- validate_config --> [ValidatingConfig]
[ValidatingConfig] -- config_valid --> [Assembling]
[ValidatingConfig] -- config_issue --> [Failed]
[Assembling] -- slots_ready --> [Ready]
[Assembling] -- partial_issue --> [Degraded]
[Degraded] -- required_slot_restored --> [Ready]
[Degraded] -- required_slot_failed --> [Failed]
```

| from | trigger | precondition | to | side effect boundary |
|---|---|---|---|---|
| `NotStarted` | runtime binding validation starts | config binding ref typed;no raw config/secret in state | `ValidatingConfig` | no service call |
| `ValidatingConfig` | config binding valid | validated config binding summary exists | `Assembling` | no config key/schema output |
| `ValidatingConfig` | config binding invalid | safe diagnostic ref present | `Failed` | entry can return blocked/unavailable safe surface |
| `Assembling` | all required slots available | service slot refs and availability state refs present | `Ready` | entry may proceed to facade |
| `Assembling` | optional slot degraded or partial assembly issue | assembly issue refs and diagnostic refs present | `Degraded` | entry/service may copy degraded marker |
| `Degraded` | degraded slot restored | availability state refs show required slots usable | `Ready` | no domain truth side effect |
| `Degraded` | required slot failed | safe diagnostic for required slot present | `Failed` | entry blocked;no retry loop state |

非法转换占位:

| from | forbidden trigger | reason |
|---|---|---|
| any runtime state | change domain truth or application result | runtime state is not business truth。 |
| any runtime state | expose raw config, secret, URL, connection pool, adapter instance or process state | runtime assembly is body-free / secret-free。 |
| `Ready` / `Degraded` | let entry grab repository/UoW/concrete adapter handle directly | entry must call application facade。 |

### 6. `MethodAssetAdapterAvailabilityState` state matrix

状态集合:

| state | 含义 | source |
|---|---|---|
| `Available` | adapter slot 可服务对应 read/write/publish/handoff requirement。 | adapter health summary |
| `Degraded` | adapter slot 可部分服务,需要 degraded marker。 | availability marker |
| `Unavailable` | adapter slot 当前不可用。 | safe unavailable reason |
| `DisabledByConfig` | validated config 明确禁用该 adapter slot。 | config binding summary |
| `Unsupported` | adapter family / operation 不被当前 binding 支持。 | adapter capability summary |

```text
[Available] -- health_degraded --> [Degraded]
[Available] -- health_unavailable --> [Unavailable]
[Available] -- config_disabled --> [DisabledByConfig]
[Degraded] -- restored --> [Available]
[Degraded] -- unavailable --> [Unavailable]
[Unavailable] -- restored --> [Available]
any state -- unsupported_family --> [Unsupported]
```

| from | trigger | precondition | to | side effect boundary |
|---|---|---|---|---|
| virtual availability checked | health summary available | formal availability marker present | `Available` | marker copied by entry/service |
| `Available` / virtual check | degraded health summary | degraded marker and safe reason present | `Degraded` | no raw health response |
| `Available` / `Degraded` / virtual check | unavailable health summary | unavailable marker and safe reason present | `Unavailable` | service/entry blocked or degraded |
| virtual check | validated config disables slot | config binding ref present;no raw config key exposed | `DisabledByConfig` | safe disabled marker only |
| any availability state | unsupported family/operation | capability summary says unsupported | `Unsupported` | safe unsupported reason |
| `Degraded` / `Unavailable` | restored health summary | availability marker present and slot matches runtime assembly | `Available` | no truth rollback |

非法转换占位:

| from | forbidden trigger | reason |
|---|---|---|
| any availability state | classify from raw exception, SQL/HTTP code, timeout text or provider body | marker must come from formal health/config summary。 |
| any availability state | roll back accepted truth or stored result | adapter availability cannot rewrite business truth。 |
| `DisabledByConfig` | infer config key/secret in Step 10 | config details belong to Step 14。 |

### 7. API entry / response assembly boundary

API entry-local state 只表达 shell 转译、runtime precheck、facade dispatch 和 response assembly。它不拥有 repository、UnitOfWork、domain transition 或 transport status。

| boundary label | 含义 | source |
|---|---|---|
| `ApiContextReady` | actor/metadata/trace/runtime refs 已形成 entry context。 | API entry context factory |
| `CommandEntryReady` | command shell 可交给 application command facade。 | command handler entry |
| `QueryEntryReady` | query shell 可交给 application query facade。 | query handler entry |
| `UnsupportedFamily` | command/query family 不受本 entry 支持。 | protocol family marker |
| `RuntimeBlocked` | runtime assembly / availability precheck 阻塞。 | runtime/availability state |
| `DispatchedToFacade` | entry 已把 shell 和 context refs 交给 application facade。 | application dispatch ref |
| `ResponseReady` | success response shell 已安全组装。 | response assembly state |
| `RejectionReady` | safe rejection shell 已安全组装。 | rejection shell + diagnostics |
| `ResponseDegraded` | degraded/unavailable response shell 已安全组装。 | degraded decision / availability marker |

| operation | precondition | resulting label | side effect boundary |
|---|---|---|---|
| create API context | metadata/actor/trace/runtime refs typed and transport-neutral | `ApiContextReady` | no HTTP/RPC body stored |
| prepare command entry | command shell typed;runtime ready/degraded acceptable;application dispatch ref present | `CommandEntryReady` | no repository/UoW direct call |
| prepare query entry | query shell typed;read surface hint safe | `QueryEntryReady` | query no-write |
| unsupported command/query | family marker not supported | `UnsupportedFamily` | safe rejection only |
| runtime unavailable/degraded blocking | assembly/availability marker copied | `RuntimeBlocked` | no app facade call if blocked |
| dispatch | entry ready;facade dispatch ref present | `DispatchedToFacade` | facade-only boundary |
| assemble accepted/query response | application safe result ref and protocol response shell ref present | `ResponseReady` | no transport mapping |
| assemble rejection | rejection shell and safe diagnostic refs present | `RejectionReady` | no raw error |
| assemble degraded/unavailable | degraded decision or availability marker present | `ResponseDegraded` | safe marker only |

禁止事项:

| 禁止项 | reason |
|---|---|
| API entry calls repository, UnitOfWork, domain transition, resolver, publisher or concrete adapter | entry is facade-only。 |
| API response assembly writes truth/material/stored result | response assembly is output-only。 |
| API state stores HTTP status/header/route/raw token/raw DTO body | transport mapping is outside Step 10。 |

### 8. worker entry / worker result boundary

Worker local state covers inbound consumer and event publisher entry assembly. Publication outcome matrix is deferred to R10.19/R10.20;this section only records worker-local accepted/ignored/rejected/blocked/degraded/unavailable result.

| boundary label | 含义 | source |
|---|---|---|
| `WorkerContextReady` | worker runtime/source/publisher binding refs 可用。 | worker entry context |
| `InboundEntryReady` | inbound body-free shell 可交给 application inbound facade。 | inbound consumer entry |
| `PublisherEntryReady` | event candidate 可交给 publisher facade/port boundary。 | event publisher entry |
| `WorkerAccepted` | inbound intake或 publication boundary local accepted。 | intake/publication decision |
| `WorkerIgnored` | duplicate / no-op 已安全忽略。 | stored receipt / intake decision |
| `WorkerRejected` | malformed / unsupported / unsafe input 被安全拒绝。 | safe rejection diagnostic |
| `WorkerBlocked` | source / publisher binding unavailable or blocked。 | availability / binding marker |
| `WorkerDegraded` | worker 可返回 degraded / unavailable safe result。 | degraded decision / safe diagnostic |

| operation | precondition | resulting label | side effect boundary |
|---|---|---|---|
| create worker context | runtime assembly and binding refs present | `WorkerContextReady` | no broker state |
| prepare inbound entry | body-free intake shell, schema ref and dedup key present | `InboundEntryReady` | no raw envelope |
| prepare publisher entry | event candidate ref and publisher binding ref present | `PublisherEntryReady` | publication outcome deferred |
| inbound accepted | application intake decision accepted | `WorkerAccepted` | stored receipt / safe result only |
| duplicate/no-op inbound | stored receipt or ignore reason present | `WorkerIgnored` | no reprocess |
| inbound rejected | unsupported/malformed/raw body rejected with safe reason | `WorkerRejected` | no truth mutation |
| source/publisher unavailable | availability marker copied | `WorkerBlocked` | no retry/dead-letter state |
| degraded worker result | degraded decision / diagnostic present | `WorkerDegraded` | safe diagnostic only |

禁止事项:

| 禁止项 | reason |
|---|---|
| worker stores broker ack, offset, topic, subscription, retry, dead letter or delivery receipt | transport lifecycle is out of scope。 |
| inbound entry creates core truth directly | explicit Command must perform truth mutation。 |
| publisher entry rolls back accepted truth or candidate source fact | publication failure cannot roll back source fact。 |
| worker result expands event payload or external body | body-free boundary。 |

### 9. jobs entry precheck boundary

Jobs entry-local state covers runner context, operation job entry precheck and facade dispatch. Job execution/result/report state was written in R10.16.

| boundary label | 含义 | source |
|---|---|---|
| `JobRunnerContextReady` | runtime assembly、job profile、run/scope/checkpoint refs 已形成。 | job runner context |
| `OperationJobEntryReady` | job shell 可交给 application job facade。 | operation job entry |
| `JobUnsupportedFamily` | job family 不受支持。 | job family marker |
| `JobScopeBlocked` | scope invalid or unavailable。 | safe diagnostic |
| `JobRuntimeBlocked` | runtime/adapter precheck blocked。 | runtime/availability state |
| `JobDispatchedToFacade` | jobs entry 已调用 application job facade。 | application job dispatch ref |

| operation | precondition | resulting label | side effect boundary |
|---|---|---|---|
| create runner context | runtime assembly, job profile, maintenance run/scope refs present | `JobRunnerContextReady` | no scheduler/queue state |
| prepare job entry | job input shell and application dispatch ref present | `OperationJobEntryReady` | no repository direct call |
| unsupported job family | job family marker unsupported | `JobUnsupportedFamily` | safe blocked result |
| invalid scope/precheck | safe execution boundary rejects scope | `JobScopeBlocked` | no job body execution |
| runtime unavailable | runtime/availability marker copied | `JobRuntimeBlocked` | no retry loop state |
| dispatch to job facade | entry ready;facade dispatch ref present | `JobDispatchedToFacade` | R10.16 job task/result matrix takes over |

禁止事项:

| 禁止项 | reason |
|---|---|
| jobs entry calls repositories or repairs truth directly | jobs entry must use application job facade。 |
| jobs entry stores cron/scheduler/queue/lease/thread/process result | scheduler product is out of scope。 |
| jobs entry stores report body or metrics body | report body is forbidden;report boundary only。 |

### 10. cross forbidden / side-effect table

| axis | allowed | forbidden |
|---|---|---|
| replay | duplicate branches copy stored result / receipt / report / checkpoint / run history surface。 | rerun mutation, rescan targets, reprocess inbound payload, reload truth to rebuild response。 |
| stored result | safe summary, marker, typed ref, safe reason, effect refs。 | DTO body, raw error, provider payload, event payload, report body。 |
| runtime | assembly phase, slot refs, availability refs, safe diagnostics。 | config key, secret, URL, adapter instance, connection pool, process/thread state。 |
| availability | formal marker from health/config summary。 | exception text, SQL/HTTP code, timeout string, raw health response。 |
| API entry | transport-neutral context, facade dispatch, safe response assembly。 | repository/UoW/domain/adapter direct call, HTTP/RPC mapping。 |
| worker entry | body-free inbound/publisher shell, safe worker result。 | broker ack/offset/topic/retry/dead letter/delivery receipt。 |
| jobs entry | runner context, operation job entry, facade dispatch precheck。 | scheduler/queue/lease/process status, direct truth repair。 |
| outbound overlap | worker may record local blocked/degraded publisher entry result。 | publication outcome / delivery / handoff completion matrix before R10.19/R10.20。 |

### 11. R10.18 stop-review

| 检查项 | 结果 |
|---|---|
| 是否写入 `MethodAssetIdempotencyGuard` decision matrix | pass |
| 是否写入 `MethodAssetStoredOperationResult` replay-safe result matrix | pass |
| 是否写入 duplicate replay source boundary | pass |
| 是否写入 runtime assembly state matrix | pass |
| 是否写入 adapter availability state matrix | pass |
| 是否写入 API entry / response assembly boundary | pass |
| 是否写入 worker entry / worker result boundary | pass |
| 是否写入 jobs entry precheck boundary | pass |
| 是否写入 cross forbidden / side-effect table | pass |
| 是否未写 outbound/publication/handoff 状态矩阵 | pass |
| 是否未写 persistence schema、error taxonomy、config key、test case schema 或 implementation code | pass |
| 是否修改正式 `03-详细设计.md` | no |

next_allowed_action: 等待用户确认后进入 Step 10 `R10.19 outbound/publication/handoff 状态机:先思考`;只允许思考 event candidate、publication decision/outcome、publisher binding state、handoff binding state、target registry / handoff target、publication blocked/degraded/unavailable、handoff prepared/delivered/failed 的状态主语筛选、输入来源、状态集合草案边界、trigger flow、marker/precondition 来源和 `R10.20` 写入顺序;不得直接修改正式 `03-详细设计.md`;不得写跨状态机审计或 Step 11 内容;不得写 persistence schema、error taxonomy、config key、test case schema、implementation code。

---

## R10.19 outbound/publication/handoff 状态机:先思考

### 1. 当前模块目标

`R10.19` 只思考 outbound / publication / handoff 状态族的状态主语筛选、输入来源、状态集合草案边界、trigger flow、marker / precondition 来源和 `R10.20` 写入顺序。当前模块不写最终状态集合、ASCII 图或 From / To 转换矩阵。

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm |
| 当前允许 | 思考 event candidate、publisher binding、target registry、publication outcome、handoff binding、handoff outcome、worker publisher result support boundary 和 forbidden side effects。 |
| 当前禁止 | 写正式状态矩阵、跨状态机审计、persistence schema、topic / payload / outbox / retry / dead-letter / delivery receipt、config key、error taxonomy、test case schema、implementation code 或正式 `03-详细设计.md`。 |

### 2. 状态主语候选筛选

本组必须把 candidate、binding、registry、publication outcome、handoff outcome 分开。candidate 表达可发布事实边界;publisher / handoff outcome 只表达 safe side-effect boundary;target registry 只表达目标可用性裁决。

| 候选 | Step 6/7/8/9 来源 | R10.19 判定 | R10.20 处理 |
|---|---|---|---|
| `MethodAssetEventCandidateAssembly` | Step 6 event candidate helper;Step 8 outbound event shell;Step 9 shared outbound candidate template。 | `enter_state_boundary` | 写 candidate assembly boundary;只表达 body-free candidate 是否 ready / blocked / invalid。 |
| `MethodAssetPublisherBindingState` | Step 6 publisher binding state;Step 7 publisher port;R10.18 adapter availability。 | `enter_state_boundary` | 写 publisher binding readiness / blocked / unavailable / disabled boundary。 |
| `MethodAssetCollaborationTargetRegistryPort` outcome | Step 7 target registry;Step 9 target precheck before publisher / handoff。 | `enter_state_boundary` | 写 enabled / disabled / blocked / unavailable target selection boundary。 |
| `MethodAssetEventCandidatePublisherPort` outcome | Step 7 publisher port;Step 8 publication outcome shell;Step 9 outbound publication flows。 | `enter_state_boundary` | 写 published / blocked / unavailable / failed publication outcome boundary。 |
| `MethodAssetHandoffBindingState` | Step 6 handoff binding state;Step 7 handoff port;Step 9 handoff after trace/report-safe refs。 | `enter_state_boundary` | 写 handoff binding readiness and safe failure marker boundary。 |
| `MethodAssetCollaborationHandoffPort` outcome | Step 7 handoff port output;Step 8 handoff result shell;Step 9 job/report/audit handoff hints。 | `enter_state_boundary` | 写 prepared / delivered / blocked / unavailable / failed handoff outcome boundary。 |
| `MethodAssetEventPublisherEntry` | Step 6 worker entry;R10.18 worker entry boundary。 | `support_input_only` | 只作为 publisher flow entry trigger;不重复写 worker local result。 |
| `MethodAssetWorkerEntryResultState` | R10.18 worker accepted / blocked / degraded local result。 | `support_input_only` | 只承接 local publisher result relation;publication outcome 由 port outcome owner。 |
| job report / progress / handoff hints | R10.16 job report boundary;Step 9 maintenance / report flows。 | `support_input_only` | 只作为 handoff trigger / safe ref input;不在本组重写 job state。 |
| topic / outbox / delivery receipt / subscriber ack / retry / dead letter | 旧材料和显式禁入项。 | `exclude` | 不进入 R10.20。 |

### 3. 输入来源表

| 输入层 | 可用来源 | R10.20 使用方式 |
|---|---|---|
| Step 6 objects | `MethodAssetEventCandidateAssembly`;`MethodAssetPublisherBindingState`;`MethodAssetHandoffBindingState`;`MethodAssetEventPublisherEntry`;`MethodAssetWorkerEntryResultState`。 | 提供 candidate、binding、entry-local 和 safe marker 的 state subject 来源。 |
| Step 7 ports | `MethodAssetEventCandidatePublisherPort`;`MethodAssetCollaborationHandoffPort`;`MethodAssetCollaborationTargetRegistryPort`;adapter availability / runtime precheck。 | 提供 publication / handoff / target registry outcome value 来源。 |
| Step 8 protocol | outbound event family shell、event candidate shell、publication outcome shell、publisher result shell、blocked / degraded / unavailable public surfaces。 | 提供 public surface 的 copy-only result 边界,不反向发明 domain state。 |
| Step 9 flows | shared outbound candidate template、34 outbound flows、job/report handoff hint、publication failure no-rollback rule。 | 提供 trigger order、failure handling、side-effect boundary 和 no-rollback invariant。 |
| R10.18 runtime / entry | runtime assembly、adapter availability、worker publisher entry local boundary。 | 作为 publisher / handoff precondition 来源,不重复定义 runtime state。 |

### 4. 状态集合草案边界思考

下表只描述 `R10.20` 可展开的状态切片,不是最终状态名或状态集合。

| 状态主语 / 边界 | 状态切片思考 | R10.20 注意事项 |
|---|---|---|
| event candidate boundary | candidate not assembled、assembled、ready for publication、blocked by missing marker、invalid for publication。 | candidate 不等于 payload / topic / delivery task;不能写 outbox relay。 |
| target registry boundary | target enabled、target disabled、target blocked、target unavailable、unsupported target family。 | target summary 必须来自 registry / binding / availability,不能从 config key 字符串推断。 |
| publisher binding boundary | binding available、degraded、unavailable、disabled、unsupported。 | 与 R10.18 adapter availability 对齐;本组只写 publisher-specific binding consequence。 |
| publication outcome boundary | published、blocked、unavailable、failed。 | `Published` 只表示 publisher port safe outcome,不是 external delivery truth 或 subscriber ack。 |
| handoff binding boundary | target bound、target unavailable、target blocked、safe failure marker present、receipt marker copied。 | `receipt_marker_ref` 是 body-free marker,不是外部写入回执正文。 |
| handoff outcome boundary | prepared、delivered、blocked、unavailable、failed。 | `Delivered` 只表达 handoff port safe outcome;不能生成 archive/report/package body。 |
| publisher worker support boundary | publisher entry ready、publication attempt delegated、local blocked/degraded copied。 | entry state 已在 R10.18;R10.20 只写与 publication outcome 的交界。 |

### 5. trigger flow 清单

| trigger family | flow 来源 | 触发边界 |
|---|---|---|
| accepted command produces event candidate | Step 9 command accepted branches and shared outbound candidate template。 | candidate assembly from typed refs / markers / trace context。 |
| completed job produces event candidate | Step 9 maintenance / report / progress changed flows。 | job report/progress refs feed event candidate or handoff hint。 |
| inbound accepted / bounded intake produces candidate | Step 9 inbound accepted overlay。 | accepted intake surface may create body-free event candidate。 |
| publisher worker attempts publication | Step 9 outbound flows,one per event family。 | worker loads candidate shell and publisher binding,then target registry,then publisher port。 |
| handoff attempts collaboration target | Step 7 handoff port and Step 9 report / audit / trace safe handoff hints。 | handoff uses target ref, trace/lineage/report-safe refs and handoff marker。 |
| publication failure | Step 9 stop review rule。 | failure records safe outcome only;no rollback of accepted truth。 |

### 6. marker / precondition 来源思考

| marker / precondition | 正式来源 | 禁止来源 |
|---|---|---|
| event candidate reason | `MethodAssetEventCandidateAssembly.candidate_reason_ref` and accepted source refs。 | raw payload、topic、transport body、error text。 |
| publication boundary marker | event candidate assembly and publisher binding state。 | outbox id、delivery receipt、subscriber ack。 |
| target enabled / blocked / unavailable | target registry output, binding state and adapter availability summary。 | config key string、URL、secret、manual target list。 |
| publisher failed / unavailable reason | publisher port safe outcome and safe diagnostic refs。 | exception text、HTTP status、broker response body。 |
| handoff boundary marker | handoff binding state and handoff port safe outcome。 | archive/report/package body or external storage receipt body。 |
| receipt marker | handoff port body-free receipt marker if present。 | external receipt payload or provider confirmation body。 |
| no-rollback invariant | Step 9 outbound stop review;R10.8/R10.16 accepted truth owner boundaries。 | any publication/handoff failure branch rewriting source truth。 |

### 7. watch / blocker 判断

| ID | topic | R10.19 判断 | R10.20 处理 |
|---|---|---|---|
| ML-D03-S10-OUTBOUND-WATCH-001 | publication outcome schema | Step 7 已给 published / blocked / unavailable / failed outcome family,但字段级 schema 留给 Step 8/11/15。 | R10.20 只写 state boundary,不写 JSON/Rust 字段。 |
| ML-D03-S10-OUTBOUND-WATCH-002 | handoff delivered meaning | Step 6/7 明确 receipt marker body-free,不等于 external delivered truth。 | R10.20 写 delivered = safe port outcome only。 |
| ML-D03-S10-OUTBOUND-WATCH-003 | target registry binding | target enabled / disabled / blocked / unavailable 来源已足够做状态边界;config key 留 Step 14。 | 写 no_config_detail forbidden。 |
| ML-D03-S10-OUTBOUND-WATCH-004 | candidate persistence / publisher reload | Step 9 提到 publisher worker loads candidate shell;durable source 留 Step 11/14。 | R10.20 写 no_store_schema and no_current_truth_rebuild。 |
| ML-D03-S10-OUTBOUND-WATCH-005 | old outbox pollution | 当前设计禁止 topic / payload / outbox / relay / retry / dead-letter / subscriber ack。 | 写 forbidden table,不恢复旧状态机。 |

当前未发现必须暂停的 formal blocker。原因是 `R10.20` 只写状态边界和禁入规则,不写 publisher / handoff artifact schema、transport delivery contract、target config key 或 persistence contract。

### 8. R10.20 写入顺序思考

`R10.20` 应按以下顺序写入,避免把 side effect outcome 提前变成 business truth:

1. 写 `MethodAssetEventCandidateAssembly` candidate boundary。
2. 写 `MethodAssetCollaborationTargetRegistryPort` target registry boundary。
3. 写 `MethodAssetPublisherBindingState` publisher binding boundary。
4. 写 `MethodAssetEventCandidatePublisherPort` publication outcome boundary。
5. 写 `MethodAssetHandoffBindingState` handoff binding boundary。
6. 写 `MethodAssetCollaborationHandoffPort` handoff outcome boundary。
7. 写 publisher worker / handoff hint support boundary。
8. 写 no rollback / no outbox / no topic / no payload / no delivery receipt forbidden table。
9. 写 `R10.20` stop-review 和进入 `R10.21` 门禁。

### 9. R10.19 stop-review

| 检查项 | 结果 |
|---|---|
| 是否只做 outbound/publication/handoff 思考 | pass |
| 是否筛选 event candidate、publisher binding、target registry、publication outcome、handoff binding、handoff outcome | pass |
| 是否列出 Step 6/7/8/9 输入来源 | pass |
| 是否只写状态集合草案边界,未写最终状态集合 / ASCII 图 / From-To 矩阵 | pass |
| 是否明确 no rollback、no topic、no payload、no outbox、no delivery receipt 红线 | pass |
| 是否未写 persistence schema、error taxonomy、config key、test case schema 或 implementation code | pass |
| 是否修改正式 `03-详细设计.md` | no |

next_allowed_action: 等待用户确认后进入 Step 10 `R10.20 outbound/publication/handoff 状态机:再写入`;只允许写入 event candidate boundary、target registry boundary、publisher binding boundary、publication outcome boundary、handoff binding boundary、handoff outcome boundary、publisher worker / handoff hint support boundary、no rollback / no outbox / no topic / no payload / no delivery receipt forbidden table 和停审表;不得直接修改正式 `03-详细设计.md`;不得写跨状态机审计或 Step 11 内容;不得写 persistence schema、error taxonomy、config key、test case schema、implementation code。

---

## R10.20 outbound/publication/handoff 状态机:再写入

### 1. `MethodAssetEventCandidateAssembly` candidate boundary

状态集合:

| state | 含义 | source |
|---|---|---|
| `CandidateNotAssembled` | 尚未形成 event candidate assembly。 | accepted command / completed job / bounded intake before candidate helper |
| `CandidateAssembled` | 已由 typed refs、safe summary、marker 和 trace context 组装 candidate。 | `MethodAssetEventCandidateAssembly` |
| `CandidateReadyForPublication` | candidate body-free 校验通过,可交给 publisher boundary。 | `publication_boundary_marker_ref` present |
| `CandidateBlocked` | 缺少 marker / subject / safe summary 或被 target precheck 阻塞。 | safe candidate / target marker |
| `CandidateInvalid` | candidate 混入 payload、topic、outbox、delivery 或 raw body。 | body-free assertion failure |

```text
[CandidateNotAssembled] -- assemble_from_fact --> [CandidateAssembled]
[CandidateAssembled] -- body_free_passed --> [CandidateReadyForPublication]
[CandidateAssembled] -- missing_marker_or_target_blocked --> [CandidateBlocked]
[CandidateAssembled] -- body_or_delivery_state_detected --> [CandidateInvalid]
```

| from | trigger | precondition | to | side effect boundary |
|---|---|---|---|---|
| `CandidateNotAssembled` | accepted fact / material change / maintenance progress emits safe refs | typed subject refs and fact summary refs present | `CandidateAssembled` | no publish attempt yet |
| `CandidateAssembled` | candidate body-free assertion passes | publication boundary marker present | `CandidateReadyForPublication` | candidate may be handed to publisher facade |
| `CandidateAssembled` | required marker / subject / summary unavailable | safe blocked reason present | `CandidateBlocked` | no truth rollback |
| `CandidateAssembled` | payload / topic / delivery / outbox state detected | safe invalid reason present | `CandidateInvalid` | reject candidate;no publisher call |

### 2. target registry boundary

| state | 含义 | source |
|---|---|---|
| `TargetEnabled` | target registry 返回可用 target summary。 | `MethodAssetCollaborationTargetRegistryPort` |
| `TargetDisabled` | target 被 validated binding 禁用。 | config binding summary,not config key |
| `TargetBlocked` | target 当前被 safe rule / boundary 阻塞。 | blocked target marker |
| `TargetUnavailable` | target adapter / binding unavailable。 | adapter availability marker |
| `TargetUnsupported` | target family 不支持当前 publication / handoff family。 | target capability summary |

| from | trigger | precondition | to | side effect boundary |
|---|---|---|---|---|
| virtual target check | registry resolves enabled target | binding state and target marker present | `TargetEnabled` | publisher / handoff may proceed |
| virtual target check | binding disables target | validated binding summary present | `TargetDisabled` | safe skipped/blocked outcome only |
| virtual target check | registry returns blocked | blocked marker and safe reason present | `TargetBlocked` | no adapter send |
| virtual target check | registry returns unavailable | availability marker present | `TargetUnavailable` | no retry state |
| virtual target check | unsupported family | capability summary present | `TargetUnsupported` | safe unsupported outcome only |

### 3. publisher binding boundary

| state | 含义 | source |
|---|---|---|
| `PublisherAvailable` | publisher binding 可承接 candidate family。 | `MethodAssetPublisherBindingState.bound` |
| `PublisherDegraded` | publisher 可部分承接,需要 degraded / safe marker。 | adapter availability marker |
| `PublisherUnavailable` | publisher binding 当前不可用。 | unavailable binding state |
| `PublisherDisabled` | publisher 被 validated config binding 禁用。 | disabled binding summary |
| `PublisherUnsupportedFamily` | publisher 不支持 candidate event family。 | `supports_event_family` |
| `PublisherBlocked` | publisher 被 safe publication boundary 阻塞。 | blocked reason / diagnostic |

```text
[PublisherAvailable] -- health_degraded --> [PublisherDegraded]
[PublisherAvailable] -- blocked --> [PublisherBlocked]
[PublisherAvailable] -- unavailable --> [PublisherUnavailable]
[PublisherAvailable] -- disabled --> [PublisherDisabled]
any state -- unsupported_family --> [PublisherUnsupportedFamily]
```

| from | trigger | precondition | to | side effect boundary |
|---|---|---|---|---|
| virtual publisher check | binding supports family and availability is available | publisher binding ref and boundary marker present | `PublisherAvailable` | candidate may be published |
| `PublisherAvailable` / virtual check | availability degraded | degraded marker present | `PublisherDegraded` | safe degraded outcome may be copied |
| `PublisherAvailable` / `PublisherDegraded` | safe publication rule blocks | blocked reason and diagnostic present | `PublisherBlocked` | no candidate payload expansion |
| any publisher state | availability unavailable | unavailable marker present | `PublisherUnavailable` | no publish attempt or safe unavailable outcome |
| any publisher state | binding disabled | config binding summary present | `PublisherDisabled` | no config key exposure |
| any publisher state | event family unsupported | capability summary present | `PublisherUnsupportedFamily` | safe unsupported/blocked outcome |

### 4. publication outcome boundary

| state | 含义 | source |
|---|---|---|
| `PublicationPending` | candidate ready,尚未调用 publisher port。 | candidate + enabled target |
| `Published` | publisher port 返回 body-free published safe outcome。 | `MethodAssetEventCandidatePublisherPort` |
| `PublicationBlocked` | target / binding / publication rule 阻塞。 | blocked target or publisher marker |
| `PublicationUnavailable` | publisher / target unavailable。 | unavailable marker |
| `PublicationFailed` | publisher port 返回 safe failed outcome。 | failure reason / marker |

| from | trigger | precondition | to | side effect boundary |
|---|---|---|---|---|
| `CandidateReadyForPublication` | target enabled and publisher available | candidate shell, target summary and binding marker present | `PublicationPending` | publisher worker may call port |
| `PublicationPending` | publisher port returns published | body-free publication ref / marker present | `Published` | no subscriber ack or delivery truth |
| `PublicationPending` | target / binding blocked | blocked marker present | `PublicationBlocked` | no adapter send |
| `PublicationPending` | publisher / target unavailable | unavailable marker present | `PublicationUnavailable` | no retry/dead-letter state |
| `PublicationPending` | publisher port fails safely | failure reason / marker present | `PublicationFailed` | accepted truth not rolled back |

### 5. handoff binding and outcome boundary

| boundary | state | 含义 | source |
|---|---|---|---|
| handoff binding | `HandoffBound` | handoff target binding exists and supports family。 | `MethodAssetHandoffBindingState.bound` |
| handoff binding | `HandoffPreparedBinding` | body-free target marker shows prepared handoff boundary。 | `prepared(...)` |
| handoff binding | `HandoffBlockedBinding` | binding / target safe rule blocked。 | failure reason / diagnostic |
| handoff binding | `HandoffUnavailableBinding` | target adapter unavailable。 | availability marker |
| handoff binding | `HandoffFailedBinding` | safe failure marker exists。 | failure reason / diagnostic |
| handoff outcome | `HandoffPrepared` | handoff port prepared package/ref boundary。 | handoff port outcome |
| handoff outcome | `HandoffDelivered` | handoff port returned body-free receipt marker。 | receipt marker |
| handoff outcome | `HandoffBlocked` | handoff port returned blocked outcome。 | failure marker |
| handoff outcome | `HandoffUnavailable` | handoff target unavailable。 | unavailable marker |
| handoff outcome | `HandoffFailed` | handoff port failed safely。 | safe failure reason |

| from | trigger | precondition | to | side effect boundary |
|---|---|---|---|---|
| virtual handoff check | binding supports family | handoff target ref and boundary marker present | `HandoffBound` | no external write yet |
| `HandoffBound` | port prepares body-free handoff | trace / lineage / report-safe refs present | `HandoffPrepared` | package ref only,no package body |
| `HandoffPrepared` | port returns receipt marker | receipt marker body-free | `HandoffDelivered` | no external delivered truth stored |
| `HandoffBound` / `HandoffPrepared` | target or boundary blocked | failure marker present | `HandoffBlocked` | no truth rollback |
| any handoff state | adapter unavailable | availability marker present | `HandoffUnavailable` | no retry state |
| `HandoffBound` / `HandoffPrepared` | port fails safely | safe failure reason present | `HandoffFailed` | safe diagnostic only |

### 6. publisher worker / handoff hint support boundary

| support label | 含义 | source |
|---|---|---|
| `PublisherEntryDelegated` | worker publisher entry 已把 candidate / binding refs 交给 publisher boundary。 | R10.18 worker entry |
| `PublicationOutcomeCopied` | worker result 复制 publisher port safe outcome。 | publication outcome shell |
| `HandoffHintReady` | job / report / audit / trace flow 形成 body-free handoff hint。 | R10.16 job/report refs;Step 9 handoff hint |
| `HandoffOutcomeCopied` | worker / jobs result 复制 handoff port safe outcome。 | handoff outcome shell |
| `OutboundSupportBlocked` | worker / jobs entry 因 binding / availability / registry marker 阻塞。 | runtime/adapter/target marker |

支持边界不拥有 business truth、candidate persistence、delivery task 或 report body。它只负责把已闭口的 candidate / publication / handoff outcome surface 复制到 worker / jobs safe result 中。

### 7. cross forbidden / side-effect table

| axis | allowed | forbidden |
|---|---|---|
| candidate | typed refs、safe summary refs、lineage refs、publication boundary marker。 | topic、payload body、outbox row、delivery state、subscriber ack。 |
| target registry | enabled / disabled / blocked / unavailable target summary。 | config key、URL、credential、transport private state。 |
| publisher binding | binding ref、slot ref、family set、availability marker、blocked reason。 | delivery guarantee、retry counter、dead-letter state、broker ack。 |
| publication outcome | published / blocked / unavailable / failed safe marker。 | external delivered truth、subscriber response、current truth reconstruction。 |
| handoff binding | target ref、handoff marker、availability marker、safe failure reason。 | archive body、report body、package body、external receipt body。 |
| handoff outcome | prepared / delivered / blocked / unavailable / failed safe outcome。 | proof of external business completion or external system owner state。 |
| failure handling | publication / handoff failure records safe outcome and diagnostic。 | rollback accepted truth, mutate source fact, rerun command, create retry/dead-letter lifecycle。 |

### 8. R10.20 stop-review

| 检查项 | 结果 |
|---|---|
| 是否写入 event candidate boundary | pass |
| 是否写入 target registry boundary | pass |
| 是否写入 publisher binding boundary | pass |
| 是否写入 publication outcome boundary | pass |
| 是否写入 handoff binding / outcome boundary | pass |
| 是否写入 publisher worker / handoff hint support boundary | pass |
| 是否写入 no rollback / no outbox / no topic / no payload / no delivery receipt forbidden table | pass |
| 是否未写 persistence schema、error taxonomy、config key、test case schema 或 implementation code | pass |
| 是否修改正式 `03-详细设计.md` | no |

next_allowed_action: 等待用户确认后进入 Step 10 `R10.21 跨状态机审计与 Step 11~16 handoff:先思考`;只允许思考跨状态机同名/近义状态审计、触发 flow 覆盖审计、非法转换覆盖审计、side-effect 边界审计、Step 11~16 handoff 列表和 `R10.22` 写入顺序;不得直接修改正式 `03-详细设计.md`;不得进入 Step 11;不得写 persistence schema、error taxonomy、config key、test case schema 或 implementation code。

---

## R10.21 跨状态机审计与 Step 11~16 handoff:先思考

### 1. 当前模块目标

`R10.21` 只思考 Step 10 已写入状态矩阵的跨状态机审计方法、审计范围、待写入表结构和 Step 11~16 handoff 分类。当前模块不写最终跨状态机审计结论,不进入 Step 11,不修改正式 `03-详细设计.md`。

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm |
| 当前允许 | 思考同名/近义状态审计、trigger flow 覆盖审计、非法转换覆盖审计、side-effect 边界审计、watch/blocker 归属、Step 11~16 handoff 和 `R10.22` 写入顺序。 |
| 当前禁止 | 写最终正式 §9 草稿、persistence schema、error taxonomy、config key、observability 字段、test case schema、implementation code 或正式 `03-详细设计.md`。 |

### 2. 审计输入范围

| 输入 | R10.21 使用方式 | R10.22 输出候选 |
|---|---|---|
| R10.6 候选池筛选表 | 确认 enter / technical local / marker-only / watch / blocker 分类是否被后续模块承接。 | candidate coverage audit。 |
| R10.8 business truth 矩阵 | 审计 core truth / peripheral truth lifecycle 的状态名、trigger、side effect。 | business truth cross-check。 |
| R10.10 source/reference/body-boundary 矩阵 | 审计 external / basis / body-free redline 和 boundary marker。 | source/body boundary handoff。 |
| R10.12 trace/audit/lineage/impact 矩阵 | 审计 trace、impact、audit、lineage 与 event candidate / observability 的交界。 | trace/audit side-effect audit。 |
| R10.14 read/visibility/material 矩阵 | 审计 query no-write、stale/degraded/unavailable marker 来源。 | query/material marker audit。 |
| R10.16 maintenance/job/report 矩阵 | 审计 job task、progress、report、checkpoint 与 run history 的边界。 | job/report persistence and replay handoff。 |
| R10.18 idempotency/replay/runtime/entry 矩阵 | 审计 duplicate replay、runtime availability、entry facade-only 红线。 | concurrency/runtime/config handoff。 |
| R10.20 outbound/publication/handoff 矩阵 | 审计 candidate、publication、handoff 与 delivery/outbox 禁区。 | publication/handoff handoff。 |

### 3. 同名 / 近义状态审计思考

R10.22 需要把同名或近义状态拆成“可共享语义”“上下文限定语义”和“必须改名/加前缀语义”。当前思考如下:

| 状态词族 | 可能出现位置 | 审计重点 | R10.22 处理 |
|---|---|---|---|
| `Draft` / `Proposed` / `Submitted` | definition、catalog、formalization、package / assembly。 | 是否都是 business truth lifecycle,还是 command intake / review boundary。 | 写 semantic namespace table。 |
| `Active` / `Published` / `Ready` / `Available` / `Enabled` | business truth、read material、runtime、publisher、target registry。 | `Published` 不能回到旧 publish/outbox;`Ready/Available/Enabled` 必须带 owner 前缀。 | 写 owner-prefixed naming rule。 |
| `Deprecated` / `Retired` / `Superseded` / `Archived` | version、material、relation、package、external source。 | lifecycle terminal / replaceable / recoverable 含义是否混用。 | 写 terminal vs replaceable audit。 |
| `Blocked` / `Unavailable` / `Degraded` / `Failed` | availability、query、job、runtime、publication、handoff。 | marker 来源必须来自正式 mapper / resolver / port / diagnostic,不能服务内合成。 | 写 marker-source audit。 |
| `Invalid` / `Rejected` / `ViolationDetected` | body boundary、candidate、command/query/inbound rejection。 | invalid 输入、非法转换、body-free 破口三类不能混成一个错误 taxonomy。 | 写 Step 12 handoff。 |
| `Completed` / `CompletedWithIssues` / `Partial` | job/report/checkpoint。 | job execution result 不等于 business truth completed。 | 写 job-local state isolation。 |
| `Published` / `Delivered` | publication / handoff。 | 只表示 safe port outcome,不表示外部投递成功或外部系统 truth。 | 写 delivery redline audit。 |

### 4. trigger flow 覆盖审计思考

| flow 族 | Step 10 已覆盖面 | R10.22 需要检查 |
|---|---|---|
| 58 Command flows | business truth、source/body boundary、trace/audit、stored result、event candidate side effects。 | 每个 accepted mutation 是否至少落到一个 truth state transition 或明确 marker-only。 |
| 57 Query flows | read decision、degraded decision、view freshness、query no-write。 | 每个 NotVisible / Degraded / Stale / Empty 是否有 marker 来源或明确 Step 12/15 handoff。 |
| 4 Inbound flows | inbound intake local result、candidate generation、stored receipt/replay。 | inbound accepted 是否不直接创建 formal truth;duplicate 是否只复制 stored receipt。 |
| 34 Outbound flows | candidate assembly、target registry、publication outcome。 | publication failure 是否全都 no rollback;是否仍有 outbox/topic/delivery 漏口。 |
| 8 Job flows | task lifecycle、progress、report、checkpoint、handoff hint。 | job body 是否不越权修 truth;checkpoint/report durable schema 是否留给 Step 11/13/15。 |

### 5. 非法转换覆盖审计思考

R10.22 不定义最终 error taxonomy,只写非法转换覆盖表和 Step 12 handoff。重点检查:

| 非法转换类型 | 典型风险 | 后续处理 |
|---|---|---|
| query writes truth | query flow 反写 material、truth、stored result。 | R10.22 写 forbidden;Step 12/16 给错误/测试切口。 |
| helper becomes truth owner | event candidate、read decision、audit helper、report shell 被当成 durable truth。 | R10.22 写 owner isolation;Step 11 决定 durable surface。 |
| marker synthesis | service 从 raw error、string、route、topic、HTTP/SQL code 合成 marker。 | R10.22 写 marker source rule;Step 12/15 承接。 |
| publication rollback | publication / handoff failure 回滚 accepted truth。 | R10.22 写 no rollback forbidden。 |
| old-state resurrection | `MethodContentLifecycle`、old publish、snapshot、fingerprint、outbox relay 回流。 | R10.22 写 historical pollution audit。 |
| direct entry bypass | API / worker / jobs entry 直调 repository / UoW / adapter。 | R10.22 写 facade-only forbidden。 |
| persistence detail leakage | Step 10 写 table/index/lock/TTL/schema。 | R10.22 写 Step 11/13 handoff only。 |

### 6. side-effect 边界审计思考

| side effect | 当前状态族 owner | 审计问题 | R10.22 输出 |
|---|---|---|---|
| stored operation result | R10.18 | 是否只复制 safe summary,不存 DTO/raw error/body。 | stored surface handoff to Step 11/13。 |
| event candidate | R10.20 | 是否只含 body-free refs / marker,不含 topic/payload/outbox。 | publication handoff to Step 11/14/15。 |
| audit / lineage | R10.12 | 是否不记录 raw method body / provider body / log body。 | observability handoff to Step 15。 |
| read material freshness | R10.14 | stale/degraded/unavailable 是否复制正式 marker。 | recovery/error/observability handoff。 |
| job report / checkpoint | R10.16 | report body、checkpoint identity、run history schema 是否未提前定义。 | Step 11/13/15 handoff。 |
| runtime / adapter availability | R10.18 | config key、secret、URL、process lifecycle 是否禁入。 | Step 14 handoff。 |
| handoff / publication outcome | R10.20 | delivered/published 是否不表示外部 truth。 | Step 12/15/17 handoff。 |

### 7. Step 11~16 handoff 思考

| 后续 Step | 应承接内容 | 当前禁止提前写入 |
|---|---|---|
| Step 11 persistence / transaction | versioned read/write source、durable state owner、candidate/report/checkpoint/stored result persistence、index / lookup / transaction boundary。 | table、column、index、DDL、lock、transaction order。 |
| Step 12 error / recovery | illegal transition taxonomy、rejection mapping、blocked/unavailable/degraded recovery、body-free violation handling。 | final error enum、public error code、safe message schema。 |
| Step 13 concurrency / idempotency | guard reserve/complete/replay concurrency、duplicate replay safety、checkpoint resume and reentry rules。 | TTL、lock table、retry count、scheduler lease。 |
| Step 14 config / dependency | runtime config binding、publisher / handoff / target registry binding、adapter availability config source。 | config key、secret、URL、topic、transport binding schema。 |
| Step 15 observability / audit | audit trail refs、lineage refs、publication/handoff outcome observability、report/run history safe evidence。 | log body、metric label schema、trace payload、report body。 |
| Step 16 test cut | state transition tests、forbidden transition tests、marker-source tests、no-write/no-body/no-rollback tests。 | concrete test case IDs and evidence artifact schema before Step 16。 |

### 8. R10.22 写入顺序思考

`R10.22` 应按以下顺序写入,避免把 handoff 思考误写成后续 Step schema:

1. 写状态词族 / owner namespace 审计表。
2. 写 trigger flow coverage audit 表。
3. 写非法转换 / forbidden transition summary。
4. 写 side-effect boundary audit 表。
5. 写 watch / blocker closure table,区分 resolved_by_step10、handoff_to_step11_16、hard_blocker。
6. 写 Step 11~16 handoff table。
7. 写 R10.22 stop-review 和进入 R10.23 门禁。

### 9. R10.21 stop-review

| 检查项 | 结果 |
|---|---|
| 是否只做跨状态机审计与 handoff 思考 | pass |
| 是否未写最终跨状态机审计结论 | pass |
| 是否覆盖同名/近义状态、trigger flow、非法转换、side effect、Step 11~16 handoff | pass |
| 是否未进入 Step 11 | pass |
| 是否未写 persistence schema、error taxonomy、config key、test case schema 或 implementation code | pass |
| 是否修改正式 `03-详细设计.md` | no |

next_allowed_action: 等待用户确认后进入 Step 10 `R10.22 跨状态机审计与 Step 11~16 handoff:再写入`;只允许写入状态词族 / owner namespace 审计表、trigger flow coverage audit、非法转换 / forbidden transition summary、side-effect boundary audit、watch / blocker closure table、Step 11~16 handoff table 和停审表;不得直接修改正式 `03-详细设计.md`;不得进入 Step 11;不得写 persistence schema、error taxonomy、config key、test case schema 或 implementation code。

---

## R10.22 跨状态机审计与 Step 11~16 handoff:再写入

### 1. 状态词族 / owner namespace 审计表

| 状态词族 | 审计结论 | owner namespace rule | 后续约束 |
|---|---|---|---|
| `Draft` / `Proposed` / `Submitted` | pass_with_owner_scope | 只允许出现在 definition、formalization、package / assembly 等 business truth lifecycle;command intake 不复用这些词表达协议接收。 | Step 12 不把 command rejected 映射成 business draft rollback。 |
| `Active` / `Ready` / `Available` / `Enabled` | pass_with_prefix_required | business truth 用 owner 状态;runtime / adapter / target registry 必须带 `Runtime`、`Adapter`、`Target`、`Publisher` 等 owner 前缀。 | 正式 §9 装配时不得写全局 `Available` 总状态。 |
| `Published` | pass_with_redline | 只表示 `MethodAssetEventCandidatePublisherPort` safe publication outcome,不恢复旧 publish lifecycle。 | 不得映射到 outbox、topic、subscriber ack 或 delivery truth。 |
| `Delivered` | pass_with_redline | 只表示 `MethodAssetCollaborationHandoffPort` body-free receipt marker outcome。 | 不得成为外部系统 delivered truth 或 archive package body。 |
| `Deprecated` / `Retired` / `Superseded` | pass_with_terminal_distinction | `Retired` 是 terminal/removed-from-use,`Superseded` 是 replaced-by-next,`Deprecated` 是 allowed-but-discouraged lifecycle。 | Step 11 需要保存替代关系和 version source,但 Step 10 不定义 index。 |
| `Blocked` / `Unavailable` / `Degraded` / `Failed` | pass_with_marker_source_required | 每个出现点必须回指 resolver、mapper、availability、port outcome 或 safe diagnostic。 | Step 12/15 继续定义 mapping / observability;service 不得合成 marker。 |
| `Invalid` / `Rejected` / `ViolationDetected` | pass_with_error_handoff | `Invalid` 用于 candidate/body boundary 输入不合格;`Rejected` 用于 protocol/intake safe rejection;`ViolationDetected` 用于 boundary/policy judgement。 | final error taxonomy 交 Step 12。 |
| `Completed` / `Partial` / `CompletedWithIssues` | pass_with_job_local_scope | 只用于 jobs/report/checkpoint local result,不代表 business truth completed。 | Step 13/15 承接 checkpoint/resume/report evidence。 |

### 2. trigger flow coverage audit

| flow 族 | Step 10 coverage | audit result | remaining handoff |
|---|---|---|---|
| 58 Command flows | business truth、source/body boundary、trace/audit、stored result、event candidate side effects。 | pass | Step 11 must define durable save/version ordering;Step 12 must define illegal transition rejection. |
| 57 Query flows | read decision、degraded decision、view freshness、query no-write、marker source table。 | pass_with_marker_handoff | Step 12/15 must define degraded/unavailable public mapping and observability. |
| 4 Inbound flows | inbound local result、stored receipt/replay、candidate handoff;formal truth mutation remains explicit command only。 | pass | Step 13 must close dedup/replay;Step 11 must close receipt storage if durable. |
| 34 Outbound flows | event candidate、target registry、publication outcome、no rollback/no outbox/no topic。 | pass | Step 11/14/15 must close candidate persistence, publisher binding and observability. |
| 8 Job flows | task lifecycle、progress、report boundary、checkpoint/resume、handoff hint。 | pass_with_persistence_handoff | Step 11/13/15 must close run history, checkpoint identity and report evidence. |

### 3. 非法转换 / forbidden transition summary

| forbidden class | applies to | Step 10 result | handoff |
|---|---|---|---|
| query writes truth | all query/read state boundaries | forbidden in R10.14 and cross audit | Step 12 error mapping;Step 16 no-write tests |
| helper becomes truth owner | event candidate、read decision、degraded decision、audit/report shell | forbidden;helpers are support boundaries only | Step 11 decides durable shells only where formally required |
| marker synthesis | blocked/degraded/unavailable/stale/failure states | forbidden;marker must be copied from formal source | Step 12 mapper/error;Step 15 observability |
| publication/handoff rollback | publication failed/unavailable/blocked, handoff failed/unavailable/blocked | forbidden;accepted truth remains unchanged | Step 12 recovery;Step 15 audit trail |
| old-state resurrection | old `MethodContentLifecycle`、publish/outbox/snapshot/fingerprint/P1 plugin state | forbidden throughout Step 10 | Step 19 formal assembly pollution check |
| entry direct call | API/worker/jobs entry | forbidden;entry remains facade-only | Step 16 entry boundary tests |
| persistence detail leakage | any state machine | forbidden;Step 10 only defines state sets and transition boundary | Step 11/13 own schema/concurrency |
| raw body / payload as state source | external source、artifact、report、event、handoff、audit | forbidden by body-free redline | Step 12 body violation;Step 15 safe evidence |

### 4. side-effect boundary audit

| side effect | owner state family | audit result | required next-step closure |
|---|---|---|---|
| stored operation result | idempotency/replay | safe summary only;no DTO/raw error/body | Step 11 persistence;Step 13 replay consistency |
| event candidate | outbound/publication | body-free refs / markers only;candidate not delivery/outbox | Step 11 candidate storage;Step 14 publisher binding;Step 15 publication audit |
| audit / lineage | trace/audit/lineage | ref/marker only;no raw method/provider/log body | Step 15 audit and observability fields |
| read material freshness | read/material | stale/degraded/unavailable copy formal marker only | Step 12 recovery mapping;Step 15 degraded observability |
| job report / checkpoint | maintenance/job/report | report/checkpoint boundaries only;no report body/schema | Step 11 storage;Step 13 resume;Step 15 evidence |
| runtime / adapter availability | runtime/entry | technical local state only;no config key/secret/process state | Step 14 config/dependency binding |
| publication / handoff outcome | outbound/handoff | safe port outcome only;no external truth guarantee | Step 12 failure recovery;Step 15 audit;Step 17 handoff |
| business truth side effects | business truth | accepted transitions may emit stored result/event/audit hints but do not define their durable schema | Step 11 transaction ordering and version source |

### 5. watch / blocker closure table

| ID | topic | closure status | R10.22 disposition |
|---|---|---|---|
| ML-D03-S10-WATCH-001 | `ExternalSourceSummary` unavailable/body violation/schema support | handoff_to_step12_14 | R10.10 wrote boundary state only;Step 12/14 must close error/config mapping. |
| ML-D03-S10-WATCH-002 | `DownstreamConsumptionBoundary` durable owner / availability | handoff_to_step11_12 | R10.10 wrote decision boundary;Step 11/12 decide persistence/recovery. |
| ML-D03-S10-WATCH-003 | stored accepted/rejected/ignored replay surface schema | handoff_to_step11_13 | R10.18 wrote replay state boundary only. |
| ML-D03-S10-WATCH-004 | query stale/degraded/unavailable marker source | handoff_to_step12_15 | R10.14 wrote copy-only marker rule;mapping/observability remain later. |
| ML-D03-S10-WATCH-005 | event candidate persistence / publisher reload / target binding | handoff_to_step11_14_15 | R10.20 wrote candidate/outcome state boundary only. |
| ML-D03-S10-WATCH-006 | job checkpoint/report/run history schema | handoff_to_step11_13_15 | R10.16 wrote state boundary only. |
| ML-D03-S10-BLOCK-001 | hard blocker | none | No hard blocker found in Step 10. |
| ML-D03-S10-BT-WATCH-001 | material availability marker source | handoff_to_step12_15 | R10.8/R10.14 require formal mapper/resolver source. |
| ML-D03-S10-REPLAY-WATCH-001 | durable idempotency schema | handoff_to_step11_13 | no schema in Step 10. |
| ML-D03-S10-RUNTIME-WATCH-001 | runtime config binding | handoff_to_step14 | no config key / secret / URL in Step 10. |
| ML-D03-S10-OUTBOUND-WATCH-001 | publication outcome schema | handoff_to_step12_15 | state boundary only;protocol/artifact schema remains later. |

### 6. Step 11~16 handoff table

| Step | handoff items from Step 10 | must not reinterpret |
|---|---|---|
| Step 11 persistence / transaction | durable state owner, versioned read/write, candidate/stored result/report/checkpoint persistence, transaction ordering for accepted transitions. | Do not introduce new lifecycle names or make helpers truth owners. |
| Step 12 error / recovery | illegal transition categories, body-free violation, unavailable/degraded/blocked/failure mapping, no-rollback recovery. | Do not use raw provider/HTTP/SQL/exception text as marker source. |
| Step 13 concurrency / idempotency | idempotency guard race semantics, duplicate replay, stored result safety, checkpoint resume/reentry. | Do not rerun mutations or rebuild response from current truth. |
| Step 14 config / dependency | runtime config binding, adapter availability source, publisher/handoff/target registry binding, external resolver binding. | Do not leak config key, secret, URL, topic or transport body into state. |
| Step 15 observability / audit | audit/lineage refs, publication/handoff outcome observation, degraded/read-material observation, report/run history safe evidence. | Do not store report body, payload body, trace body or raw log body. |
| Step 16 test cut | state transition tests, forbidden transition tests, marker-source tests, no-write/no-body/no-rollback/facade-only tests. | Do not create test cases that assume schemas deferred to Step 11~15. |

### 7. R10.22 stop-review

| 检查项 | 结果 |
|---|---|
| 是否写入状态词族 / owner namespace 审计表 | pass |
| 是否写入 trigger flow coverage audit | pass |
| 是否写入非法转换 / forbidden transition summary | pass |
| 是否写入 side-effect boundary audit | pass |
| 是否写入 watch / blocker closure table | pass |
| 是否写入 Step 11~16 handoff table | pass |
| 是否未进入 Step 11 | pass |
| 是否未写 persistence schema、error taxonomy、config key、test case schema 或 implementation code | pass |
| 是否修改正式 `03-详细设计.md` | no |

next_allowed_action: 等待用户确认后进入 Step 10 `R10.23 正式 §9 候选草稿与停审:先思考`;只允许思考正式 `03-详细设计.md` §9 候选结构、哪些 Step 10 内容可装配、哪些 watch/handoff 不可装配为已闭口结论、R10.24 写入顺序和 Step 10 最终停审标准;不得直接修改正式 `03-详细设计.md`;不得进入 Step 11;不得写 persistence schema、error taxonomy、config key、test case schema 或 implementation code。

---

## R10.23 正式 §9 候选草稿与停审:先思考

### 1. 当前模块目标

`R10.23` 只思考正式 `03-详细设计.md` §9 的候选装配结构、可装配内容、不可装配内容、R10.24 写入顺序和 Step 10 最终停审标准。当前模块不修改正式 `03-详细设计.md`,不写正式 §9 正文,不进入 Step 11。

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm |
| 当前允许 | 思考正式 §9 候选章节结构、状态族装配顺序、矩阵保留粒度、watch/handoff 排除口径、最终停审标准和 `R10.24` 写入顺序。 |
| 当前禁止 | 直接修改正式 `03-详细设计.md`、进入 Step 11、写 persistence schema、error taxonomy、config key、test case schema、implementation code 或把 handoff 项写成已闭口结论。 |

### 2. 正式 §9 候选结构思考

正式 §9 不应复制 Step 10 全量讨论记录,而应装配为可读、可实现、可回指的状态机章节。候选结构如下:

| §9 候选小节 | 来源模块 | 装配方式 |
|---|---|---|
| §9.1 状态机定义原则与全局红线 | R10.4 / R10.6 / R10.22 | 写目标/非目标、状态来源、query no-write、body-free、no old state resurrection。 |
| §9.2 状态主语筛选结果 | R10.6 | 写 enter / technical local / marker-only / exclude / watch summary,不放全量历史污染表。 |
| §9.3 business truth 状态机 | R10.8 | 装配 8 个 business truth 状态机和 side effect 总表。 |
| §9.4 source/reference/body-boundary 状态机 | R10.10 | 装配 basis、external summary、definition/use、downstream、body boundary。 |
| §9.5 trace/audit/lineage/impact 状态机 | R10.12 | 装配 trace material、impact summary、judgement boundary、audit/lineage support boundary。 |
| §9.6 read/visibility/material freshness 状态机 | R10.14 | 装配 read decision、degraded decision、freshness、view shell、query marker-source table。 |
| §9.7 maintenance/job/report 状态机 | R10.16 | 装配 task、recovery issue、progress、run/report、checkpoint、job result。 |
| §9.8 idempotency/replay/runtime/entry 状态机 | R10.18 | 装配 idempotency、stored result、runtime/availability、API/worker/jobs entry。 |
| §9.9 outbound/publication/handoff 状态机 | R10.20 | 装配 candidate、target registry、publisher、publication、handoff。 |
| §9.10 跨状态机审计与后续承接 | R10.22 | 装配 owner namespace、forbidden summary、side-effect audit、Step 11~16 handoff。 |

### 3. 可装配内容思考

| 内容类型 | 可装配判断 | 装配粒度 |
|---|---|---|
| 已写状态集合 | 可装配 | 保留 state / meaning / source,必要时压缩同类 support boundary。 |
| ASCII 图 | 可装配但需精选 | 只保留核心 truth / source / trace / job / replay / publication 的关键图;support boundary 可用表格替代。 |
| From/trigger/precondition/to/side effect 矩阵 | 可装配 | 保留每个状态机最小完整转换矩阵。 |
| forbidden / illegal transition | 可装配 | 保留 Step 10 占位和 redline,但不写最终 error enum。 |
| watch / blocker closure | 可装配 | 写为后续承接表,不得当成已闭口 schema。 |
| Step 11~16 handoff | 可装配 | 写成 §9.10 的承接清单,不展开后续 Step 内容。 |

### 4. 不可装配为已闭口结论的内容

| 内容 | 处理口径 | 原因 |
|---|---|---|
| table / column / index / transaction order | 只进入 Step 11 handoff | Step 10 非持久化设计。 |
| final error enum / public error code / safe message schema | 只进入 Step 12 handoff | Step 10 只写非法转换占位。 |
| idempotency TTL / lock / retry count / scheduler lease | 只进入 Step 13 handoff | Step 10 只写 replay boundary。 |
| config key / secret / URL / topic / transport binding | 只进入 Step 14 handoff | Step 10 只写 binding state和禁入。 |
| metric label / trace payload / report body / evidence artifact schema | 只进入 Step 15/16 handoff | Step 10 不定义 observability/test artifact schema。 |
| old `MethodContentLifecycle` / publish / outbox / snapshot / fingerprint | 不装配 | historical pollution,已被禁入。 |

### 5. 正式 §9 装配质量标准思考

| 标准 | R10.24 检查方式 |
|---|---|
| 每个状态机有 owner | 每个小节标题或表格必须指向对象/helper/port owner。 |
| 每个状态有 source | 每个状态集合必须有 source 列或来源说明。 |
| 每个转换有 trigger 和 precondition | From/To 表必须保留 trigger/precondition。 |
| 每个 side effect 有边界 | flow side effect 不得混入 domain object 方法。 |
| query no-write 可见 | §9.6 和跨状态机审计必须明确 query no-write。 |
| body-free 红线可见 | source/outbound/handoff/audit/report 小节必须可见 no raw body。 |
| handoff 不伪装成闭口 | Step 11~16 handoff 必须保持 handoff 状态,不写成 final schema。 |
| 正式文档未直接修改 | R10.24 仍只写候选草稿到中间产物。 |

### 6. R10.24 写入顺序思考

`R10.24` 应写入一个可供 Step 19 装配正式文档的 §9 候选草稿和 Step 10 最终停审表:

1. 写 §9.1~§9.10 候选章节结构。
2. 写每个候选章节的来源模块、装配内容和压缩策略。
3. 写 watch/handoff 不进入已闭口结论的排除表。
4. 写 Step 10 最终停审表。
5. 写进入 Step 11 的门禁:Step 10 completed_wait_user_confirm,正式 `03-详细设计.md` 仍未修改,等待用户确认后由 flow 进入 Step 11。

### 7. R10.23 stop-review

| 检查项 | 结果 |
|---|---|
| 是否只思考正式 §9 候选结构 | pass |
| 是否明确可装配和不可装配内容 | pass |
| 是否规划 R10.24 写入顺序 | pass |
| 是否未修改正式 `03-详细设计.md` | pass |
| 是否未进入 Step 11 | pass |
| 是否未写 persistence schema、error taxonomy、config key、test case schema 或 implementation code | pass |

next_allowed_action: 等待用户确认后进入 Step 10 `R10.24 正式 §9 候选草稿与停审:再写入`;只允许写入正式 §9 候选章节结构、各章节来源和装配内容、不可装配为已闭口结论的排除表、Step 10 最终停审表和进入 Step 11 的门禁;不得直接修改正式 `03-详细设计.md`;不得进入 Step 11;不得写 persistence schema、error taxonomy、config key、test case schema 或 implementation code。

---

## R10.24 正式 §9 候选草稿与停审:再写入

### 1. 当前模块目标

`R10.24` 将 Step 10 已完成的状态主语筛选、状态机矩阵、跨状态机审计和 handoff 内容整理成正式 `03-详细设计.md` §9 的候选草稿索引。当前模块仍只写入本中间产物,不直接修改正式 `03-详细设计.md`,不进入 Step 11。

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm |
| 当前允许 | 写入 §9 候选章节结构、各章节来源、装配粒度、排除表、Step 10 最终停审表和进入 Step 11 的门禁。 |
| 当前禁止 | 直接修改正式 `03-详细设计.md`、进入 Step 11、写 persistence schema、error taxonomy、config key、test case schema、implementation code 或把 handoff/watch 项写成已闭口结论。 |

### 2. 正式 §9 候选章节结构

以下结构供 Step 19 装配正式 `03-详细设计.md` §9 使用。Step 19 装配时必须回读对应来源模块,不得只凭本索引重写语义。

| 候选章节 | 标题 | 来源模块 | 正式装配目标 |
|---|---|---|---|
| §9.1 | 状态机定义原则与全局红线 | R10.4 / R10.6 / R10.22 | 说明状态机 owner、状态来源、状态主语筛选、query no-write、body-free、old state no-resurrection。 |
| §9.2 | 状态主语筛选结果 | R10.6 | 装配 enter / technical local / marker-only / excluded / watch 的筛选摘要和后续承接关系。 |
| §9.3 | Business Truth 状态机 | R10.8 | 装配 `MethodAssetDefinition`、catalog、formalization、version、consumption、relation、package、assembly 的状态集合和转换矩阵。 |
| §9.4 | Source / Reference / Body-Boundary 状态机 | R10.10 | 装配 basis、external source summary、definition/use boundary、downstream boundary、external body boundary。 |
| §9.5 | Trace / Audit / Lineage / Impact 状态机 | R10.12 | 装配 trace material、impact summary、protection/integrity judgement、audit trail、evidence lineage。 |
| §9.6 | Read / Visibility / Material Freshness 状态机 | R10.14 | 装配 read decision、degraded decision、freshness、availability、view shell 和 query surface marker-source 红线。 |
| §9.7 | Maintenance / Job / Report 状态机 | R10.16 | 装配 refresh task、recovery task、recovery issue、progress view、run history、checkpoint、job report/result。 |
| §9.8 | Idempotency / Replay / Runtime / Entry 状态机 | R10.18 | 装配 idempotency guard、stored operation result、duplicate replay、runtime assembly、adapter availability、entry result。 |
| §9.9 | Outbound / Publication / Handoff 状态机 | R10.20 | 装配 event candidate、target registry、publisher binding、publication outcome、handoff binding/outcome。 |
| §9.10 | 跨状态机审计与后续承接 | R10.22 | 装配 state word / owner namespace audit、trigger coverage、forbidden transition summary、side-effect audit、Step 11~16 handoff。 |

### 3. 各章节装配粒度

| 候选章节 | 必须保留 | 可压缩 | 不得写入 |
|---|---|---|---|
| §9.1 | 状态机定义原则、全局红线、owner/source/trigger/precondition/side-effect 基本规则。 | L1-governance 对齐过程可压缩为一句来源说明。 | governance 领域状态、旧 `MethodContentLifecycle` 口径。 |
| §9.2 | 状态主语筛选结论和排除原因。 | 历史污染对象全量清单可压缩为类别表。 | 把 marker-only / watch 项升级成已闭口状态机。 |
| §9.3 | 8 个 business truth 状态机的 state / meaning / source、ASCII 图、From/To 矩阵、side-effect 边界。 | 同类 forbidden transition 可合并成 summary。 | repository transaction、DDL、error enum。 |
| §9.4 | source/reference/body-boundary 状态集合、typed ref 禁止推导、no raw body。 | support boundary 可用表格替代 ASCII 图。 | external raw body、archive body、provider payload schema。 |
| §9.5 | trace/impact/audit/lineage 的状态或 support boundary、judgement owner、side-effect 边界。 | protection / integrity judgement 可保留裁决矩阵而不展开算法。 | audit persistence table、evidence artifact schema。 |
| §9.6 | read decision、degraded decision、freshness/availability、query no-write 和 marker-source 表。 | view shell 可按 family 汇总。 | query 写 side effect、从 route/raw id/error text 合成 marker。 |
| §9.7 | job/task/report/run/checkpoint 状态、resume boundary、no silent repair。 | progress/report support boundary 可合并。 | scheduler lease、retry count、metric label、artifact file schema。 |
| §9.8 | idempotency decision、stored result replay source、runtime/adapter availability、entry local result。 | API/worker/jobs entry 可按 entry family 汇总。 | TTL、lock table、transport retry、runtime config key。 |
| §9.9 | publication/handoff candidate/binding/outcome、no topic/no payload/no delivery receipt 禁止表。 | target registry 和 handoff target 可合并成 binding family。 | topic name、payload schema、publisher implementation。 |
| §9.10 | 跨状态机审计表、trigger coverage、forbidden transition summary、Step 11~16 handoff。 | watch/blocker 只保留可追踪摘要。 | 把 handoff 写成 Step 11~16 的完成结论。 |

### 4. §9.1 候选正文骨架

| 段落 | 候选内容 |
|---|---|
| 定义原则 | 本仓状态机只覆盖 L3-method-library 拥有的 method asset truth、read material、maintenance、replay、runtime entry 和 outbound/handoff boundary。状态必须能回指 Step 6 对象/helper、Step 7 port/mapper、Step 8 protocol surface 或 Step 9 flow branch。 |
| 非目标 | §9 不定义持久化 schema、事务顺序、错误 taxonomy、幂等 TTL、配置 key、metric label、测试 artifact schema 或 implementation commit boundary。 |
| 状态主语规则 | 只有拥有独立生命周期或可复制 public disposition 的对象/helper 才能成为状态主语;typed ref、DTO wrapper、raw external body、cache、lock、scheduler lease 和旧主线对象不得进入。 |
| 转换规则 | 每个状态机必须保留 From、trigger、precondition、To、side effect boundary;side effect 归 application flow / port,不写入 domain object 私有行为。 |
| 读侧规则 | Query flow 只能复制 resolver / material / mapper 输出的状态或 marker,不得写 truth,不得合成 visibility、degraded、freshness 或 audit marker。 |
| body-free 规则 | source、outbound、handoff、audit、report 均只能持有 typed ref、summary、marker、result 或 safe message;不得持有 raw external body、payload body 或 report body。 |

### 5. §9.3~§9.9 候选装配索引

| 状态族 | 状态主语 / boundary | 来源模块 | 装配方式 |
|---|---|---|---|
| business truth | `MethodAssetDefinition`;`MethodAssetCatalogEntry`;`FormalizationState`;`FormalMethodAssetVersion`;`MethodAssetConsumptionMaterial`;`MethodAssetRelation`;`MethodPackage`;`MethodSetAssembly` | R10.8 | 每个主语保留 state table + ASCII 图 + transition matrix + side effect boundary。 |
| source/reference/body-boundary | `FormalizationBasisSummary`;`ExternalSourceSummary`;`DefinitionUseBoundaryGuard`;`DownstreamConsumptionBoundary`;`ExternalBodyBoundaryRule` | R10.10 | 以 source ownership、typed ref 禁止推导和 body-free boundary 为主线装配。 |
| trace/audit/lineage/impact | `MethodAssetTraceMaterial`;`ConsumptionImpactSummary`;`ConsistencyProtectionPolicy`;`RelationIntegrityRule`;`MethodAssetAuditTrail`;`MethodAssetEvidenceLineage` | R10.12 | truth-like state machine 与 support/judgement boundary 分开装配。 |
| read/visibility/material freshness | `MethodAssetReadDecision`;`MethodAssetDegradedDecision`;freshness / availability / view shell boundary | R10.14 | 装配 read disposition、degraded marker source、freshness and no-write table。 |
| maintenance/job/report | refresh task family;consistency recovery task;recovery issue;progress view;run history;checkpoint;job report/result | R10.16 | 装配 job lifecycle、resume/checkpoint、report assembly 和 no silent repair。 |
| idempotency/replay/runtime/entry | idempotency guard;stored result;runtime assembly;adapter availability;API/worker/jobs entry local result | R10.18 | 装配 duplicate replay source、runtime readiness、adapter availability 和 entry result boundary。 |
| outbound/publication/handoff | event candidate;target registry;publisher binding;publication outcome;handoff binding/outcome | R10.20 | 装配 outbound candidate 到 binding/outcome 的状态,并保留 no topic / no payload / no delivery receipt 表。 |

### 6. 不可装配为已闭口结论的排除表

| 排除内容 | 保留位置 | Step 10 裁决 |
|---|---|---|
| table、column、index、transaction order、locking order | Step 11 handoff | §9 只给 state / transition / side-effect boundary,不定义持久化细节。 |
| final error enum、safe message schema、public rejection code | Step 12 handoff | §9 只保留 illegal / forbidden transition 占位和 redline。 |
| idempotency TTL、lock lease、retry count、scheduler lease | Step 13 handoff | §9 只定义 replay-safe state 和 duplicate source。 |
| config key、secret、URL、topic、transport binding | Step 14 handoff | §9 只定义 runtime / publisher / handoff availability state。 |
| metric label、trace span payload、audit evidence artifact schema | Step 15 handoff | §9 只定义 observability/audit 需要观测的 state transition。 |
| test case id、fixture schema、artifact path、acceptance gate | Step 16 handoff | §9 只提供可测试状态/转换切口。 |
| implementation commit boundary、crate path、file diff plan | Step 17+ handoff | §9 不写实施计划。 |
| old `MethodContentLifecycle`、old publish、old outbox、snapshot、fingerprint | 不装配 | historical pollution,不得作为当前 truth 或 state owner。 |

### 7. Step 10 最终停审表

| 检查项 | 结果 | 说明 |
|---|---|---|
| 是否完成状态主语筛选 | pass | R10.6 已完成 enter / exclude / marker-only / watch 分类。 |
| 是否按状态族分批写入状态机 | pass | R10.8、R10.10、R10.12、R10.14、R10.16、R10.18、R10.20 已覆盖当前状态族。 |
| 是否完成跨状态机审计 | pass | R10.22 已覆盖 owner namespace、trigger coverage、forbidden transition、side-effect 和 handoff。 |
| 是否形成正式 §9 候选草稿 | pass | R10.24 已写入 §9.1~§9.10 候选结构和装配索引。 |
| 是否把 handoff/watch 伪装成闭口结论 | pass | R10.24 明确 Step 11~16 handoff 和不可装配表。 |
| 是否直接修改正式 `03-详细设计.md` | no | 当前只修改 Step 10 中间产物、flow 和项目台账。 |
| 是否进入 Step 11 | no | 当前只给出等待确认进入 Step 11 的门禁。 |
| 是否写 persistence schema、error taxonomy、config key、test case schema 或 implementation code | no | 相关内容均保留为后续 Step handoff。 |

### 8. 进入 Step 11 的门禁

| 门禁项 | 当前状态 |
|---|---|
| Step 10 当前模块 | `R10.24 正式 §9 候选草稿与停审:再写入` completed_wait_user_confirm |
| Step 10 总体状态 | completed_wait_user_confirm |
| 正式 `03-详细设计.md` | 未在 Step 10 中直接修改 |
| 下一步允许动作 | 等待用户确认后进入 Step 11 `R11.1 开工与必读文档:先思考` |
| 下一步禁止动作 | 不得跳过 R11.1;不得直接写 persistence schema 正文;不得同时推进 Step 11 多个模块;不得修改正式 `03-详细设计.md`。 |

next_allowed_action: 等待用户确认后进入 Step 11 `R11.1 开工与必读文档:先思考`;只允许思考 Step 11 持久化、事务与一致性契约的开工边界、必读文档、L1-governance 框架参考、Step 10 handoff 承接方式和模块计划;不得直接修改正式 `03-详细设计.md`;不得写完整 persistence schema、DDL、index、transaction order、error taxonomy、config key、test case schema 或 implementation code。
