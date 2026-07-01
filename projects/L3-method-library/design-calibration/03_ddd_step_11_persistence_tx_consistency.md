# Step 11. 定义持久化、事务与一致性契约

> 对应 SOP: `standards/document/详细设计讨论流程_SOP.md` Step 11
> 回填章节: `projects/L3-method-library/03-详细设计.md` §10 数据持久化、事务与一致性契约
> 创建日期: 2026-06-23
> 当前模式: full-restart / step11-persistence-transaction-consistency
> 当前状态: in_progress
> 当前模块: `R11.24 cross-step closure audit 与正式 §10 候选草稿停审:再写入`
> 当前门禁: `R11.24` completed_wait_user_confirm;等待确认进入 Step 12 `R12.1 开工与必读文档:先思考`

---

## 0. 文件重置记录

旧 `03_ddd_step_11_persistence_tx_consistency.md` 曾标记为 `[x] 已确认`,但其内容围绕旧 `MethodContent`、`ContentVersion`、`SupersedeLink`、old outbox、snapshot metadata、projection checkpoint、dead-letter、P0/P1 和旧 SQL / repository 口径展开。该 completed 状态和旧持久化结论全部失效。

当前 Step 11 不继承旧 table、collection、repository 函数、transaction boundary、projection checkpoint、outbox status、dead-letter、revision 或 P0/P1 分层。旧内容只能作为 historical pollution 和差异审计输入,不得作为当前 logical store、transaction ordering 或 consistency strategy 的正向来源。

当前 Step 11 的唯一正向基线是:

- 当前 `00-需求文档.md`、`01-架构设计.md`、`02-概要设计.md`。
- 本轮 `03-详细设计` Step 1~10 中间产物。
- 特别是 Step 6 object contracts、Step 7 trait / port / adapter、Step 8 protocol contracts、Step 9 function flows、Step 10 state matrix / handoff。

---

## R11.1 开工与必读文档:先思考

### 1. 当前模块目标

`R11.1` 只思考 Step 11 的开工边界、必读文档、L1-governance Step 11 框架参考、Step 10 handoff 承接方式、模块分批计划和旧 Step 11 污染隔离方式。当前模块不写完整 logical store 表、repository 持久化语义表、transaction boundary 表或一致性策略表。

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm |
| 当前允许 | 思考必读文档、输入边界、持久化契约分批、L1-governance 框架裁剪、Step 10 handoff 承接和 `R11.2` 写入边界。 |
| 当前禁止 | 写完整 persistence schema、DDL、index、transaction order、repository semantic table、error taxonomy、config key、test case schema、implementation code 或正式 `03-详细设计.md`。 |

### 2. Step 11 启动前必须承接

| 输入 | 必须承接的内容 | 禁止继承 / 禁止提前 |
|---|---|---|
| `project_execution_ledger.md` | 当前恢复点、单模块推进规则、Step 10 `R10.24` completed_wait_user_confirm。 | 跳过 R11.1 / R11.2 直接写完整持久化契约。 |
| `03_ddd_calibration_flow.md` | Step 10 completed、Step 11 waiting_user_confirm、Step 12+ blocked_by_step11。 | 将错误模型、幂等重试、配置绑定、测试方案提前写入 Step 11。 |
| `03_ddd_step_01_input_boundary.md` ~ `03_ddd_step_04_module_layout.md` | 输入权威、范围、runtime、七实现单元和旧材料隔离。 | 从旧正式 03 或旧 Step 11 恢复 `MethodContent` / P0/P1 存储主线。 |
| `03_ddd_step_05_module_contracts.md` | 七模块主轴、八组件 owner 路由、依赖方向。 | 新增未闭口 storage module 或让 infra 反向拥有 domain truth。 |
| `03_ddd_step_06_object_contracts.md` | truth object、support helper、marker、stored result、job/report/handoff helper 的字段来源和 owner。 | 持久化 Step 6 未定义字段,或从 ref/string/error text 推字段。 |
| `03_ddd_step_07_trait_port_adapter.md` | repository / UnitOfWork / resolver / publisher / handoff / result store / runtime port family。 | 给 Step 7 没有的 save/get/list 面发明实现侧私有 repository。 |
| `03_ddd_step_08_protocol_contracts.md` | Command / Query / Inbound / Outbound / Job public surface、stored replay surface、receipt/report/result shell。 | 从 public DTO 反向创建 persistence truth,或保存 raw external body / payload body。 |
| `03_ddd_step_09_function_flows.md` | 58 Command、57 Query、4 Inbound、34 Outbound、8 Job 的 transaction hint、side-effect ordering、watch ledger。 | 把 Step 9 watch 项当成已闭口 schema,或让 query 写修复 side effect。 |
| `03_ddd_step_10_state_machine.md` | state owner、transition precondition、side-effect boundary、Step 11~16 handoff。 | 把 Step 10 状态矩阵扩写成错误 enum、DDL、retry policy 或 config key。 |

### 3. 规范约束思考

| 规范 | Step 11 使用方式 | 当前判断 |
|---|---|---|
| `详细设计讨论流程_SOP.md` Step 11 | 要求定义数据如何保存、查询、加锁、版本控制、写 outbox、刷新 projection 和保持一致性。 | 必须采用;不能只写表名或只写 repository。 |
| `详细设计书写规范.md` §5.10 / §10 | 要求数据所有权表、存储对象表、repository 函数表、事务边界表、一致性策略表。 | 后续 R11 写入必须逐表闭合,但 R11.1 只规划。 |
| `设计文档讨论中间产物规范.md` | 要求结构化中间产物、恢复点、停审、跨 Step 一致性复核。 | R11.2 必须写必读状态和模块计划;后续每批有 stop-review。 |
| `设计真相源闭环与可落码性标准.md` | 要求 version、scope、sidecar read surface、affected view、stored result、cursor、body-free schema 可落码。 | 缺正式 owner / port / version source / schema 时必须记录 blocker,不得自行补口。 |

### 4. L1-governance Step 11 框架参考

L1-governance Step 11 的价值在框架深度,不是领域语义。L3-method-library 只参考组织方法和闭环标准。

| L1 Step 11 框架点 | L3 采用方式 |
|---|---|
| 开头明确目标、非目标和旧材料边界 | 当前 Step 11 明确不写 SQL migration、物理 DB 产品、错误 enum、retry 数字、topic、config key 或 commit boundary。 |
| 先回答 SOP 问题 | R11.2 需要写“本仓拥有哪些数据、哪些只是引用/快照/投影、哪些 flow 需要事务、outbound/projection 失败如何恢复”的初步回答。 |
| 数据所有权实现表 | 后续按 L3 七实现单元和八组件 owner 写 truth / support / projection / marker / stored result / runtime-local 数据归属。 |
| logical store / collection 表 | 后续写 logical persistence contract,不写强制 DDL,但保留 key、unique、index、version、append-only 语义。 |
| repository 函数持久化语义 | 只承接 Step 7 已定义函数;不得用 Step 11 新增 Step 7 没有的 repository 方法。 |
| version source 表 | 必须明确 create / update / append-only / marker update / projection replace / stored result complete 的 version 或 token 来源。 |
| transaction boundary 表 | 按 Command / Query / Inbound / Outbound / Job / Handoff / Runtime 分场景写 begin、commit、rollback、同事务必须完成。 |
| consistency / failure table | 写本 Step 可固定的一致性策略;具体错误分类留 Step 12,重试/并发细节留 Step 13。 |
| cross-step closure audit | 最终审计 Step 6 字段、Step 7 port、Step 8 surface、Step 9 flow、Step 10 state 是否都有持久化和 version guard。 |

### 5. Step 10 handoff 承接思考

| Step 10 handoff | Step 11 承接方式 | 当前 R11.1 裁决 |
|---|---|---|
| durable state owner | 为每个 truth / marker / support boundary 判断是否需要 logical store、append-only record、derived view 或 runtime-local state。 | 后续必须写数据所有权表。 |
| versioned read/write source | 对所有 mutable truth / marker / projection state 绑定 `get/list -> Versioned<T>` 和 `save(... expected_version, uow)` 语义。 | 后续必须写 repository semantic 表。 |
| candidate / stored result / report / checkpoint persistence | 判断 event candidate、stored operation result、job report、run history、checkpoint 是否 durable,以及读取 key。 | 后续必须按 family 分批闭合。 |
| transaction ordering for accepted transitions | 从 Step 9 accepted / rejected / duplicate / job / outbound flows 汇总事务顺序。 | 后续必须写 transaction boundary 表。 |
| no query write | Query 只能读 truth/projection/reference/report/trace,不得 repair stale / degraded。 | 后续一致性策略必须显式保留。 |
| body-free boundary | source、reference、audit、outbound、handoff、report 只保存 typed ref、summary、marker、safe reason。 | 后续每个 store / snapshot / payload shell 必须写 no raw body。 |
| watch items | `ExternalSourceSummary`、`DownstreamConsumptionBoundary`、stored replay、event candidate、job checkpoint/report 等。 | Step 11 只闭持久化与事务来源;错误、配置、观测和测试留后续 Step。 |

### 6. 初步持久化族分批思考

本表只是 R11.1 思考结果,不是 final logical store 表。

| 批次族 | 候选内容 | 主要输入 | 初判 |
|---|---|---|---|
| ownership / logical store framework | 数据所有权表、logical store 表规则、old pollution 排除 | Step 6 / Step 10 / L1 Step 11 | R11.2/R11.4 建骨架。 |
| core business truth persistence | definition、catalog、formalization、formal version、consumption material、relation、package、assembly | Step 6 / 7 / 9 / 10 business truth | 必须闭 key、version、unique、write owner。 |
| source / reference / body-boundary persistence | basis summary、external source summary、definition/use boundary、downstream boundary、body-free marker | Step 6 / 7 / 9 / 10 source family | 必须闭 no raw body、typed summary、unavailable/watch。 |
| trace / audit / lineage / impact persistence | trace material、impact summary、audit trail、evidence lineage、protection/integrity record | Step 6 / 7 / 9 / 10 trace family | 区分 mutable truth、append-only record、support graph。 |
| read / projection / material persistence | read material, availability/freshness state, projection/view shell, query lookup | Step 7 / 8 / 9 / 10 read family | 必须闭 query no-write、stale/degraded source、lookup key。 |
| maintenance / job / report persistence | task/run/progress/checkpoint/report/result shell | Step 6 / 8 / 9 / 10 job family | 必须闭 report durability、checkpoint identity、partial item consistency。 |
| idempotency / stored replay persistence | idempotency guard、stored operation result、consumer receipt、job report replay | Step 7 / 8 / 9 / 10 replay family | 必须闭 duplicate 不重跑和 stored surface read。 |
| outbound / publication / handoff persistence | event candidate、publication outcome、target registry、handoff marker/outcome | Step 7 / 8 / 9 / 10 outbound family | 必须闭 candidate reload、publisher no payload body、handoff marker trace。 |
| transaction / consistency audit | Command / Query / Inbound / Outbound / Job / Runtime boundary 和 cross-store invariants | Step 9 / 10 | 最后统一审计,再进入 Step 12。 |

### 7. 排除规则初判

| 排除对象 | 排除原因 |
|---|---|
| physical SQL DDL / migration file | Step 11 写 logical contract,不锁定物理 DB 产品或 migration 语法。 |
| error enum / public error code / safe message schema | 归 Step 12;Step 11 只列 failure class 和 consistency issue source。 |
| retry count / TTL / lock lease / scheduler lease | 归 Step 13;Step 11 只写事务边界和 version / token 来源。 |
| config key / secret / URL / topic / transport binding | 归 Step 14;Step 11 只写 adapter/publisher/handoff availability 的持久化边界。 |
| metric label / trace span payload / evidence artifact path | 归 Step 15/16;Step 11 只写可观测 transition / artifact 的持久化输入。 |
| raw external body / payload body / report body | body-free 红线;只能保存 typed ref、summary、digest、version、marker、safe reason。 |
| old `MethodContent` tables / old outbox / snapshot / dead-letter / P0/P1 | historical pollution;不得作为当前 L3 store 或 transaction owner。 |

### 8. Step 11 模块计划候选

| 模块 | 目标 | 当前状态 |
|---|---|---|
| R11.1 | 开工与必读文档:先思考 | completed_wait_user_confirm |
| R11.2 | 开工与必读文档:再写入 | pending |
| R11.3 / R11.4 | L1-governance 框架对齐与 Step 11 输出骨架 | pending |
| R11.5 / R11.6 | 数据所有权与 logical store 筛选 | completed / pending |
| R11.7 / R11.8 | core business truth 持久化契约 | pending |
| R11.9 / R11.10 | source/reference/body-boundary 持久化契约 | pending |
| R11.11 / R11.12 | trace/audit/lineage/impact 持久化契约 | pending |
| R11.13 / R11.14 | read/projection/material freshness 持久化契约 | pending |
| R11.15 / R11.16 | maintenance/job/report 持久化契约 | pending |
| R11.17 / R11.18 | idempotency/stored replay/runtime entry 持久化契约 | completed_wait_user_confirm |
| R11.19 / R11.20 | outbound/publication/handoff 持久化契约 | completed_wait_user_confirm |
| R11.21 / R11.22 | transaction boundary 与 consistency strategy | completed_wait_user_confirm |
| R11.23 / R11.24 | cross-step closure audit 与正式 §10 候选草稿停审 | completed_wait_user_confirm |

### 9. R11.2 写入边界思考

`R11.2` 只应写入开工材料,不得进入具体持久化表:

1. 写 Step 11 必读文档表和读取状态。
2. 写输入基线与旧材料处理规则。
3. 写 SOP 问题的初步回答,但不展开 full store / transaction 表。
4. 写 Step 11 输出骨架、分批模块计划和 L1-governance 参考边界。
5. 写 `R11.3` 进入门禁。

### 10. R11.1 stop-review

| 检查项 | 结果 |
|---|---|
| 是否确认旧 Step 11 completed 作废 | pass |
| 是否只做开工思考,未写完整持久化契约 | pass |
| 是否承接 Step 10 handoff | pass |
| 是否参考 L1-governance 框架且未复制领域语义 | pass |
| 是否建立 Step 11 分批计划 | pass |
| 是否修改正式 `03-详细设计.md` | no |

next_allowed_action: 等待用户确认后进入 Step 11 `R11.2 开工与必读文档:再写入`;只允许写入 Step 11 必读文档表、读取状态、输入基线、旧材料处理规则、SOP 问题初步回答、Step 内模块计划、L1-governance 框架参考边界和 `R11.3` 进入门禁;不得直接修改正式 `03-详细设计.md`;不得写完整 logical store 表、repository 持久化语义表、transaction boundary 表、一致性策略表、error taxonomy、config key、test case schema 或 implementation code。

---

## R11.2 开工与必读文档:再写入

### 1. 必读文档表

| 文档 | 读取状态 | Step 11 使用方式 | 禁止事项 |
|---|---|---|---|
| `project_execution_ledger.md` | read | 恢复当前文档、Step、模块、门禁和单模块推进规则。 | 根据对话记忆跳过 R11.2 或直接写完整持久化契约。 |
| `03_ddd_calibration_flow.md` | read | 确认 Step 10 completed、Step 11 in_progress、Step 12+ blocked。 | 将 error / idempotency / config / test 内容提前。 |
| `03_ddd_step_01_input_boundary.md` | inherited_completed | 承接输入权威顺序和旧材料隔离。 | 从旧正式 03 直接恢复旧存储结论。 |
| `03_ddd_step_02_scope.md` | inherited_completed | 承接本轮详细设计范围、非范围和旧 P0/P1 禁入。 | 扩大到 marketplace / downstream / sibling truth persistence。 |
| `03_ddd_step_03_runtime_constraints.md` | inherited_completed | 承接 runtime、安全边界和缺口回设计规则。 | 从 adapter runtime state 推业务持久化字段。 |
| `03_ddd_step_04_module_layout.md` | inherited_completed | 承接七实现单元和文件布局 owner。 | 新增未闭口 storage module 或打破依赖方向。 |
| `03_ddd_step_05_module_contracts.md` | inherited_completed | 承接七模块主轴、八组件 owner 路由和依赖方向。 | 让 infra / entry 越过 application port 直接写 domain truth。 |
| `03_ddd_step_06_object_contracts.md` | inherited_completed | 第一字段来源:truth object、support helper、marker、stored result、report、handoff helper。 | 持久化 Step 6 未定义字段或根据 ref/string 补字段。 |
| `03_ddd_step_07_trait_port_adapter.md` | inherited_completed | 承接 repository、UnitOfWork、resolver、publisher、handoff、result store、runtime port family。 | 在 Step 11 发明 Step 7 没有的 public read/write port。 |
| `03_ddd_step_08_protocol_contracts.md` | inherited_completed | 承接 public surface、stored replay surface、receipt/report/result shell 和 no raw body。 | 从 DTO 反向创建 domain truth 或保存 raw payload。 |
| `03_ddd_step_09_function_flows.md` | inherited_completed | 承接 58 Command、57 Query、4 Inbound、34 Outbound、8 Job 的 branch、side effect、transaction hint 和 watch。 | 把 watch 当闭口 schema 或让 query repair truth。 |
| `03_ddd_step_10_state_machine.md` | inherited_completed | 承接 state owner、transition precondition、side-effect boundary 和 Step 11~16 handoff。 | 把状态矩阵扩写成错误 enum、DDL、retry policy 或 config key。 |
| `standards/document/详细设计讨论流程_SOP.md` | read | 采用 Step 11 的数据所有权、存储对象、repository、事务边界、一致性策略要求。 | 只写“后续持久化”或只写表名。 |
| `standards/document/详细设计书写规范.md` | read | 采用 §5.10 / §10 输出格式。 | 用散文替代表格和可落码约束。 |
| `standards/document/设计文档讨论中间产物规范.md` | read | 采用结构化中间产物、恢复点和停审规则。 | 一次性推进多个 R11 模块。 |
| `standards/document/设计真相源闭环与可落码性标准.md` | read | 检查 version、scope、sidecar read、affected view、stored result、cursor、body-free 闭环。 | 让实现侧自行补 schema / mapper / repository / version source。 |
| `projects/L1-governance/design-calibration/03_ddd_step_11_persistence_transaction_consistency.md` | framework_read | 参考 Step 11 框架深度、表格族和最终审计方式。 | 复制 governance 领域对象、store 名称或 outbox 语义。 |

### 2. 输入基线

| 基线 | 当前裁决 |
|---|---|
| 当前 00/01/02 | 正向真相源;定义 L3-method-library 仓定位、八组件、数据所有权、body-free 边界和详细设计承接清单。 |
| Step 6 | 持久化字段第一来源;只有 Step 6 已定义对象/helper/marker/result/report/handoff 字段才能进入持久化候选。 |
| Step 7 | repository / UnitOfWork / adapter 读取写入面第一来源;Step 11 只补持久化语义,不得新增未闭口 port。 |
| Step 8 | stored replay、receipt、report、event candidate、public view/query surface 的外壳约束;持久化不得反向扩张 public DTO。 |
| Step 9 | transaction hint、branch 和 side-effect ordering 第一来源;后续事务边界必须回指 flow。 |
| Step 10 | state owner、precondition、side-effect boundary 和 Step 11 handoff 第一来源;Step 11 只闭持久化 / 事务 / 一致性。 |
| 旧 Step 11 | historical_material;只用于识别 `MethodContent`、old outbox、snapshot、dead-letter、P0/P1 污染。 |

### 3. 旧材料处理规则

| 旧材料 | 当前处理 |
|---|---|
| `method_contents` / `MethodContent` write model | 禁入正向 store 主线;当前 truth owner 来自 `MethodAssetDefinition`、catalog、formalization、version、material、relation、package、assembly。 |
| `ContentVersion` / `SupersedeLink` 旧 version chain | 禁入;当前 formal version / supersession / retirement 必须从 Step 6~10 当前对象和 flow 重新定义。 |
| old outbox events / relay / delivery status | 禁入旧口径;若当前 event candidate / publication outcome 需要 durable store,必须从 Step 7/8/9/10 当前 outbound family 闭合。 |
| snapshot metadata / fingerprint / object storage blob | 禁入旧 publish/snapshot 主线;当前 body-free source/reference/material 只能保存 typed refs、summary、digest、version、marker。 |
| projection checkpoint / inbound dead-letter / job_runs old schema | 禁入旧 schema;当前 job/report/checkpoint/run history 必须从 Step 6/8/9/10 当前 operations job family 重新收敛。 |
| P0/P1 plugin/configuration tables | 禁入 P0/P1 分层;配置、topic、secret、adapter binding 留给 Step 14。 |

### 4. SOP 问题初步回答

本节只是 R11.2 的开工初答,不是最终持久化契约。后续 R11.5 起按状态族逐步闭合。

| 问题 | 初步回答 |
|---|---|
| 哪些数据对象由本仓拥有? | 当前候选包括 MethodAsset business truth、source/reference safe summary、trace/audit/lineage/impact support、read material/projection shell、maintenance job/report/run/checkpoint、idempotency/stored result、event candidate/publication/handoff marker 和 runtime-local availability。最终名单以后续数据所有权表为准。 |
| 哪些只是引用、快照或投影? | external source、artifact/archive/downstream/marketplace/runtime/provider 只能作为 typed ref、body-free summary、digest、source version、safe marker 或 projection view;不得保存外部正文、payload body 或 downstream truth。 |
| repository 函数如何命名,参数和返回是什么? | 函数签名以 Step 7 为准。Step 11 只补 logical key、unique/index、version source、UnitOfWork、append-only、stored result 和 missing/consistency 语义。 |
| 哪些处理流需要事务,事务内必须完成哪些写入? | Command accepted / rejected-after-reserve、Inbound accepted、Outbound publication marker、Operations job item/report、handoff marker 和 idempotency completion 需要后续事务边界表;Query 不开启写事务。 |
| 是否需要乐观锁、版本号、outbound candidate 或 projection? | 需要 version / expected_version / reservation token 等正式来源。是否存在 durable candidate、projection index、checkpoint、stored result、handoff marker 由后续状态族逐项闭合。 |
| 如果 publication / projection / reference / job / handoff 失败,如何恢复? | Step 11 只固定“本地 truth 不被外部失败回滚、query 不修复、stored replay 不重跑、body-free marker/report 可持久化”的一致性方向;错误分类留 Step 12,重试和并发留 Step 13。 |

### 5. Step 11 输出骨架

| 输出块 | 目标 | 后续模块 |
|---|---|---|
| 开工与框架 | 必读、输入基线、旧材料处理、SOP 初答、分批计划。 | R11.1~R11.4 |
| 数据所有权 / logical store 筛选 | 判断每类对象是 mutable truth、append-only、projection、stored shell、marker、runtime-local 还是 excluded。 | R11.5/R11.6 |
| 状态族持久化契约 | 按 Step 10 状态族闭合 key、unique/index、version、owner、read/write 语义。 | R11.7~R11.20 |
| transaction boundary | 汇总 Command / Query / Inbound / Outbound / Job / Handoff / Runtime 的事务开始、提交、回滚和同事务写入。 | R11.21 |
| consistency strategy | 汇总 local strong consistency、eventual consistency、no-write query、no-repair job、body-free、stored replay。 | R11.22 |
| closure audit / §10 candidate | 审计 Step 6~10 是否都有持久化与事务闭口,形成正式 §10 候选草稿。 | R11.23/R11.24 |

### 6. Step 11 模块计划

| 模块 | 目标 | 状态 |
|---|---|---|
| R11.1 | 开工与必读文档:先思考 | completed |
| R11.2 | 开工与必读文档:再写入 | completed_wait_user_confirm |
| R11.3 | L1-governance 框架对齐与输出骨架:先思考 | completed_wait_user_confirm |
| R11.4 | L1-governance 框架对齐与输出骨架:再写入 | completed_wait_user_confirm |
| R11.5 | 数据所有权与 logical store 筛选:先思考 | pending |
| R11.6 | 数据所有权与 logical store 筛选:再写入 | pending |
| R11.7 | core business truth 持久化契约:先思考 | completed_wait_user_confirm |
| R11.8 | core business truth 持久化契约:再写入 | completed_wait_user_confirm |
| R11.9 | source/reference/body-boundary 持久化契约:先思考 | completed_wait_user_confirm |
| R11.10 | source/reference/body-boundary 持久化契约:再写入 | completed_wait_user_confirm |
| R11.11 | trace/audit/lineage/impact 持久化契约:先思考 | completed_wait_user_confirm |
| R11.12 | trace/audit/lineage/impact 持久化契约:再写入 | completed_wait_user_confirm |
| R11.13 | read/projection/material freshness 持久化契约:先思考 | completed_wait_user_confirm |
| R11.14 | read/projection/material freshness 持久化契约:再写入 | completed_wait_user_confirm |
| R11.15 | maintenance/job/report 持久化契约:先思考 | completed_wait_user_confirm |
| R11.16 | maintenance/job/report 持久化契约:再写入 | completed_wait_user_confirm |
| R11.17 | idempotency/stored replay/runtime entry 持久化契约:先思考 | completed_wait_user_confirm |
| R11.18 | idempotency/stored replay/runtime entry 持久化契约:再写入 | completed_wait_user_confirm |
| R11.19 | outbound/publication/handoff 持久化契约:先思考 | completed_wait_user_confirm |
| R11.20 | outbound/publication/handoff 持久化契约:再写入 | completed_wait_user_confirm |
| R11.21 | transaction boundary 与 consistency strategy:先思考 | completed_wait_user_confirm |
| R11.22 | transaction boundary 与 consistency strategy:再写入 | completed_wait_user_confirm |
| R11.23 | cross-step closure audit 与正式 §10 候选草稿:先思考 | completed_wait_user_confirm |
| R11.24 | cross-step closure audit 与正式 §10 候选草稿:再写入 | completed_wait_user_confirm |

### 7. L1-governance 框架参考边界

| 可参考 | 不可复制 |
|---|---|
| 目标 / 非目标写法。 | GovernanceContext、Gate、Decision、PolicyEffectiveFact 等领域对象。 |
| 数据所有权表、logical store 表、repository 语义表、transaction boundary 表、一致性策略表的结构。 | governance table/store 命名、outbox payload snapshot schema、reference scope index 语义。 |
| “Step 11 只补持久化语义,不得新增 Step 7 port”的规则。 | governance repository 函数签名和错误名。 |
| version source、append-only、stored result、handoff marker、projection dependency 的审计方法。 | governance 的 cursor、payload、handoff/export 具体字段。 |

### 8. R11.3 进入门禁

进入 `R11.3 L1-governance 框架对齐与输出骨架:先思考` 前必须满足:

- `R11.1` 与 `R11.2` 均已 completed / completed_wait_user_confirm。
- 当前 Step 11 仍未写完整 logical store 表、repository semantic table、transaction boundary table 或 consistency strategy。
- 正式 `03-详细设计.md` 未修改。
- 旧 Step 11 只作为 historical pollution。
- 下一步只允许思考 L1-governance Step 11 的框架深度、表格族裁剪、L3 输出骨架和后续分批门禁。

### 9. R11.2 stop-review

| 检查项 | 结果 |
|---|---|
| 是否写入 Step 11 必读文档表 | pass |
| 是否写入输入基线和旧材料处理规则 | pass |
| 是否写入 SOP 问题初步回答 | pass |
| 是否写入 Step 11 输出骨架和模块计划 | pass |
| 是否未写完整持久化 / 事务 / 一致性表 | pass |
| 是否修改正式 `03-详细设计.md` | no |

next_allowed_action: 等待用户确认后进入 Step 11 `R11.3 L1-governance 框架对齐与输出骨架:先思考`;只允许思考 L1-governance Step 11 的框架深度、表格族裁剪、L3 输出骨架、状态族分批与 `R11.4` 写入顺序;不得复制 governance 领域语义;不得直接修改正式 `03-详细设计.md`;不得写完整 logical store 表、repository 持久化语义表、transaction boundary 表、一致性策略表、error taxonomy、config key、test case schema 或 implementation code。

---

## R11.3 L1-governance 框架对齐与输出骨架:先思考

### 1. 当前模块目标

`R11.3` 只思考 L1-governance Step 11 的框架如何裁剪迁移到 L3-method-library,并形成 `R11.4` 可写入的 Step 11 输出骨架。当前模块不写 L3 的完整 logical store 表、repository 持久化语义表、transaction boundary 表或一致性策略表。

| 项 | 内容 |
|---|---|
| 本模块状态 | completed |
| 当前允许 | 思考 L1-governance Step 11 的章节结构、表格族、审计方式、L3 裁剪原则、状态族分批和 `R11.4` 写入顺序。 |
| 当前禁止 | 复制 governance 领域对象 / store / repository / outbox schema;写完整 L3 persistence schema、DDL、index、transaction order、error taxonomy、config key、test case schema、implementation code 或正式 `03-详细设计.md`。 |

### 2. L1-governance Step 11 框架拆解

| L1 框架块 | 框架价值 | L3 迁移裁决 |
|---|---|---|
| Step 状态 / 目标 / 输入材料 | 保证恢复点、输入基线和非目标清楚。 | 采用;R11.4 写入 Step 11 目标、非目标和输入材料表。 |
| 分批写入计划 | 防止一次性写完整大章。 | 采用;L3 保持 R11.5~R11.24 小循环。 |
| SOP 问题回答 | 把数据所有权、引用/快照/投影、事务、outbound/projection 恢复先收口。 | 采用但保持初答;最终结论随状态族逐步闭合。 |
| 当前文档问题诊断 | 识别旧材料和前序缺口。 | 采用;L3 重点诊断旧 `MethodContent` 存储污染和 Step 10 watch。 |
| 设计取舍 | 说明为什么写 logical contract 而不是 DDL。 | 采用;L3 需固定 logical key/version/transaction,不锁定物理 DB。 |
| 数据所有权实现表 | 按对象确认 owner、写入方、读取方、一致性。 | 采用;但对象来自 L3 Step 6/10,不复制 governance 对象。 |
| logical store / collection 表 | 固定 logical key、unique/index、version、append-only 语义。 | 采用;R11.6 后按 L3 状态族逐步写。 |
| repository 函数持久化语义 | 将 Step 7 port 映射到 lock / transaction / return / error。 | 采用;但不得新增 Step 7 未定义函数。 |
| version / cursor / identity rules | 明确 expected_version、append-only、cursor、id 生成边界。 | 采用;L3 需要用自己的 version/cursor/ref 名称。 |
| transaction boundary / ordering | 汇总 command、consumer、publisher、job、handoff、query no-write。 | 采用;但在 R11.21/R11.22 统一写,不在 R11.4 展开。 |
| consistency / failure / invariant | 固定本 Step 能确定的一致性策略和禁止反模式。 | 采用;错误分类和 retry 留 Step 12/13。 |
| 前序契约回填 / cross-step audit | 审计 Step 6~10 是否能落码。 | 采用;R11.23/R11.24 收口。 |

### 3. L3 输出骨架思考

L3 Step 11 不能做成一个大表。应先写通用框架,再按 Step 10 状态族分批闭合,最后统一 transaction / consistency / audit。

| 输出层 | 目的 | 粒度 |
|---|---|---|
| §A 开工和框架 | 固定 Step 11 的目标、非目标、输入、旧材料禁入、设计取舍。 | R11.4 写骨架,不写全量契约。 |
| §B 数据所有权筛选 | 判断候选是 owned truth、safe summary、append-only、projection、stored shell、marker、runtime-local、excluded。 | R11.5/R11.6。 |
| §C 状态族 persistence 契约 | 按 business truth、source/reference、trace/audit、read/projection、job/report、replay/runtime、outbound/handoff 分批。 | R11.7~R11.20。 |
| §D transaction boundary | 将 Step 9 flow 的 accepted/rejected/duplicate/query/job/outbound/handoff 汇总成事务边界。 | R11.21/R11.22。 |
| §E consistency strategy | 汇总 local strong / eventual / append-only / no-write / no-repair / body-free / stored replay。 | R11.21/R11.22。 |
| §F closure audit / formal §10 candidate | 审计 Step 6~10 闭环并形成正式 `03-详细设计.md` §10 候选。 | R11.23/R11.24。 |

### 4. 表格族裁剪原则

| 表格族 | R11.4 是否写入 | 原因 |
|---|---|---|
| Step 11 目标 / 非目标 | 写入 | 开工骨架必须稳定。 |
| 输入材料表 | 写入 | 后续每个 persistence 决策都必须能回指输入。 |
| 旧材料污染表 | 写入 | 旧 Step 11 是高风险污染源。 |
| SOP 问题回答 | 写入压缩版 | 只写初步回答,避免假装最终闭口。 |
| 设计取舍表 | 写入 | 先固定 logical contract vs DDL、version source、no raw body、query no-write 的取舍。 |
| 数据所有权实现表 | 不写全量 | 留给 R11.5/R11.6。R11.4 只写表格模板。 |
| logical store 表 | 不写全量 | 留给 R11.5 以后按状态族展开。 |
| repository semantic 表 | 不写全量 | 留给各状态族和最终统一审计。 |
| transaction boundary 表 | 不写全量 | 留给 R11.21/R11.22。 |
| consistency strategy / failure table | 不写全量 | 留给 R11.21/R11.22;错误分类仍归 Step 12。 |
| cross-step closure audit | 不写全量 | 留给 R11.23/R11.24。 |

### 5. L3 状态族分批裁剪思考

| L3 状态族 | R11 后续处理方式 | 注意点 |
|---|---|---|
| business truth | 先闭 mutable truth 的 key、unique、version、write owner 和 expected_version。 | 不把 old `MethodContent` 表名或 revision 口径带回。 |
| source/reference/body-boundary | 闭 safe summary、source version、digest、marker、no raw body。 | 不保存 external body / payload / provider response。 |
| trace/audit/lineage/impact | 区分 append-only record、mutable audit chain、support graph、impact summary。 | append-only 字段必须来自同事务已形成输入。 |
| read/projection/material freshness | 闭 projection identity、lookup key、freshness/availability、query no-write。 | query 不 repair;missing/degraded 来源不能合成。 |
| maintenance/job/report | 闭 task/run/report/checkpoint 的 durable shell 和 partial item consistency。 | report body / evidence artifact schema 留后续 Step。 |
| idempotency/stored replay/runtime entry | 闭 reserve/complete/stored result replay 和 runtime-local state。 | duplicate 不能重跑;entry state 不等于 domain truth。 |
| outbound/publication/handoff | 闭 event candidate、publication marker、target registry、handoff marker。 | 不写 topic/payload/transport binding;publisher 不重建 payload body。 |

### 6. R11.4 写入顺序思考

`R11.4` 应写入可供后续 R11.5~R11.24 逐步展开的骨架,而不是完整持久化契约:

1. 写 Step 11 目标 / 非目标。
2. 写 L1-governance 框架裁剪表。
3. 写 Step 11 输出章节骨架。
4. 写数据所有权、logical store、repository 语义、transaction boundary、consistency strategy 的表格模板,不填全量行。
5. 写状态族分批表和每批进入 / 停审标准。
6. 写 `R11.5 数据所有权与 logical store 筛选:先思考` 进入门禁。

### 7. R11.3 stop-review

| 检查项 | 结果 |
|---|---|
| 是否只思考 L1-governance 框架和 L3 输出骨架 | pass |
| 是否明确可迁移和不可迁移的表格族 | pass |
| 是否明确 R11.4 写入顺序 | pass |
| 是否未写完整 logical store / repository / transaction / consistency 表 | pass |
| 是否未复制 governance 领域语义 | pass |
| 是否修改正式 `03-详细设计.md` | no |

next_allowed_action: 等待用户确认后进入 Step 11 `R11.4 L1-governance 框架对齐与输出骨架:再写入`;只允许写入 Step 11 目标/非目标、L1-governance 框架裁剪表、输出章节骨架、表格模板、状态族分批表、每批进入/停审标准和 `R11.5` 进入门禁;不得复制 governance 领域语义;不得直接修改正式 `03-详细设计.md`;不得写完整 logical store 表、repository 持久化语义表、transaction boundary 表、一致性策略表、error taxonomy、config key、test case schema 或 implementation code。

---

## R11.4 L1-governance 框架对齐与输出骨架:再写入

### 1. Step 11 目标 / 非目标

| 项 | 内容 |
|---|---|
| 本模块状态 | completed |
| Step 11 目标 | 将 Step 6 对象字段、Step 7 repository / UnitOfWork / adapter port、Step 8 protocol surface、Step 9 flow side effect、Step 10 state matrix 收束为可落码的 logical persistence、transaction 和 consistency contract。 |
| Step 11 非目标 | 不定义 SQL DDL、migration 文件、物理 DB 产品、final error enum、retry/TTL/lease 数字、config key、topic、transport route、metric label、test case schema 或 implementation commit boundary。 |
| 当前写入范围 | 只写框架骨架、表格模板、状态族分批和后续进入/停审标准。 |
| 当前禁止 | 填完整 store 行、repository 函数行、transaction ordering 行、consistency strategy 行或后续 Step 的错误/幂等/配置/测试内容。 |

### 2. L1-governance 框架裁剪表

| L1 框架块 | L3 采用方式 | 当前写入结果 |
|---|---|---|
| Step 状态 / 目标 / 输入材料 | 保留目标、非目标、输入基线和旧材料禁入。 | R11.1~R11.4 已建立。 |
| 分批写入计划 | 保留先思考再写入,每次确认只推进一个模块。 | R11.5~R11.24 分批。 |
| SOP 问题回答 | 保留初答和后续逐步闭口。 | R11.2 已写初答;后续按状态族更新。 |
| 当前文档问题诊断 | 保留旧材料污染和 watch / blocker 识别。 | R11.5 起正式写筛选 / watch。 |
| 设计取舍 | 保留 logical contract、no DDL、version source、no raw body、query no-write。 | 本模块写设计取舍模板。 |
| 数据所有权实现表 | 保留结构,对象换成 L3 当前对象。 | R11.5/R11.6 填写。 |
| logical store / collection 表 | 保留 key / unique / index / version / append-only 结构。 | R11.6 起按状态族填。 |
| repository 函数持久化语义 | 只承接 Step 7 port,补持久化语义。 | R11.7 起按状态族填。 |
| version / cursor / identity rules | 保留 allowed source / forbidden source 表。 | R11.21/R11.22 汇总。 |
| transaction boundary / ordering | 保留场景 / begin / commit / rollback / same-UoW 表。 | R11.21/R11.22 填写。 |
| consistency / failure / invariant | 保留一致性策略、失败恢复、anti-pattern 表。 | R11.21/R11.22 填写;错误分类留 Step 12。 |
| cross-step closure audit | 保留 Step 6~10 闭环审计和 Step 12 handoff。 | R11.23/R11.24 填写。 |

### 3. Step 11 输出章节骨架

| 章节块 | 标题 | 内容边界 | 填写模块 |
|---|---|---|---|
| §11.A | 开工、目标与设计取舍 | 目标、非目标、输入基线、旧材料处理、logical contract 取舍。 | R11.1~R11.4 |
| §11.B | 数据所有权与 logical store 筛选 | owned truth / safe summary / append-only / projection / stored shell / marker / runtime-local / excluded。 | R11.5/R11.6 |
| §11.C | Core business truth persistence | definition、catalog、formalization、formal version、consumption material、relation、package、assembly。 | R11.7/R11.8 |
| §11.D | Source / reference / body-boundary persistence | basis summary、external source summary、definition/use boundary、downstream boundary、external body boundary。 | R11.9/R11.10 |
| §11.E | Trace / audit / lineage / impact persistence | trace material、impact summary、audit trail、lineage、protection/integrity records。 | R11.11/R11.12 |
| §11.F | Read / projection / material freshness persistence | read material、projection/view shell、freshness/availability、query lookup。 | R11.13/R11.14 |
| §11.G | Maintenance / job / report persistence | task、run/progress、checkpoint、report、job result shell。 | R11.15/R11.16 |
| §11.H | Idempotency / stored replay / runtime entry persistence | idempotency guard、stored result、receipt/report replay、runtime-local availability。 | R11.17/R11.18 |
| §11.I | Outbound / publication / handoff persistence | event candidate、publication marker、target registry、handoff marker/outcome。 | R11.19/R11.20 |
| §11.J | Transaction boundary 与 consistency strategy | command/query/inbound/outbound/job/handoff/runtime transaction and consistency。 | R11.21/R11.22 |
| §11.K | Cross-step closure audit and formal §10 candidate | Step 6~10 闭环审计、Step 12~16 handoff、正式 §10 候选草稿。 | R11.23/R11.24 |

### 4. 表格模板

#### 4.1 数据所有权筛选模板

| candidate | source | owner module | persistence kind | write owner | read owner | consistency need | decision | next |
|---|---|---|---|---|---|---|---|---|
| `<Object / Helper / Marker>` | `<Step 6/7/8/9/10 source>` | `<domain/application/infra/api/worker/jobs>` | `<mutable truth / append-only / projection / stored shell / marker / runtime-local / excluded>` | `<flow / repository family>` | `<query/job/command/outbound>` | `<strong / eventual / none>` | `<enter / marker-only / excluded / watch / blocker>` | `<R11.x>` |

#### 4.2 Logical store 模板

| logical store | persistence kind | primary identity | unique key | lookup/index | version / append rule | body-free rule | filled by |
|---|---|---|---|---|---|---|---|
| `<logical_store_name>` | `<truth / summary / projection / marker / stored shell>` | `<typed ref>` | `<business unique if any>` | `<formal lookup keys>` | `<expected_version / append-only / immutable / runtime-local>` | `<refs only / no raw body>` | `<R11.x>` |

#### 4.3 Repository 持久化语义模板

| Step 7 function family | persistence role | version source | UoW requirement | returns | consistency / missing rule | filled by |
|---|---|---|---|---|---|---|
| `<repository_or_port_fn>` | `<load/save/list/append/mark/replace>` | `<Versioned<T> / None create / append id / reservation token>` | `<read-only / same-UoW / short marker-UoW>` | `<typed result>` | `<missing / conflict / degraded / consistency issue>` | `<R11.x>` |

#### 4.4 Transaction boundary 模板

| scenario | begin position | commit position | rollback / no-commit condition | same transaction must complete | forbidden |
|---|---|---|---|---|---|
| `<command/query/inbound/outbound/job/handoff/runtime scenario>` | `<service stage>` | `<after persisted result>` | `<failure classes>` | `<truth/result/marker/report writes>` | `<out-of-step side effect>` |

#### 4.5 Consistency strategy 模板

| data / side effect | consistency strategy | success condition | failure / recovery owner | must not do |
|---|---|---|---|---|
| `<truth/projection/reference/outbound/handoff/result>` | `<local strong / eventual / append-only / runtime-local>` | `<durable condition>` | `<Step 11 / Step 12 / Step 13 / Step 14 / Step 15>` | `<forbidden repair / body / replay>` |

### 5. 状态族分批表

| batch | scope | required inputs | output tables | stop-review focus |
|---|---|---|---|---|
| R11.5/R11.6 | 数据所有权与 logical store 筛选 | Step 6 object/helper、Step 10 state subject、Step 11 output skeleton。 | ownership筛选表、excluded/watch/blocker表、后续分配表。 | 不写完整 per-store contract;只筛选和分配。 |
| R11.7/R11.8 | core business truth | business truth 状态机、Step 7 repository family、Step 9 command/query flows。 | truth logical store rows、version/write owner、repository semantic rows。 | 不恢复 old `MethodContent`;不写 transaction full ordering。 |
| R11.9/R11.10 | source/reference/body-boundary | source/reference 状态机、body-free redline、resolver/summary ports。 | safe summary / marker / no-body logical rows。 | 不保存 raw external body;watch unavailable/config/error 留后续 Step。 |
| R11.11/R11.12 | trace/audit/lineage/impact | trace/audit/lineage 状态机、append/support/judgement owner。 | append-only/support/mutable audit rows。 | append-only 字段来源必须已形成;不写 observability payload。 |
| R11.13/R11.14 | read/projection/material freshness | read decision、freshness、projection/view shell、query no-write。 | projection / material / query lookup logical rows。 | query 不 repair;lookup key must be formal。 |
| R11.15/R11.16 | maintenance/job/report | task/progress/checkpoint/report/result 状态族。 | job/run/report/checkpoint logical rows。 | report body/evidence schema 不提前;partial consistency清楚。 |
| R11.17/R11.18 | idempotency/stored replay/runtime entry | idempotency guard、stored result、entry/runtime local state。 | idempotency/stored result/runtime-local rows。 | duplicate 不重跑;runtime-local 不成为 truth。 |
| R11.19/R11.20 | outbound/publication/handoff | event candidate、publication outcome、handoff marker。 | candidate/publication/handoff logical rows。 | 不写 topic/payload/transport;marker body-free。 |
| R11.21/R11.22 | transaction / consistency | Step 9 flow cards、all previous persistence rows。 | transaction boundary、version source、一致性策略、anti-pattern。 | Query no-write, stored replay, no silent repair。 |
| R11.23/R11.24 | closure audit / formal candidate | Step 6~10 + Step 11 completed rows。 | cross-step audit、Step 12~16 handoff、formal §10 candidate。 | 不进入 Step 12;不修改正式 03。 |

### 6. 每批进入 / 停审标准

| 标准 | 进入条件 | 停审条件 |
|---|---|---|
| 输入闭合 | 对应状态族在 Step 6/7/8/9/10 有正式对象、port、surface、flow、state 来源。 | 每行 persistence 决策能回指来源;缺口进入 watch/blocker。 |
| 不新增 port | 当前批只承接 Step 7 已有函数或明确记录需回 Step 7 闭口。 | 未出现实现侧私有 repository / fake-only map。 |
| body-free | source/reference/outbound/handoff/report 不保存 raw body。 | 每个相关 row 有 body-free rule。 |
| version source | mutable truth / marker / projection update 有正式 version source。 | 没有 hard-coded version、timestamp、cursor 当 expected_version。 |
| query no-write | query 只读 truth/projection/reference/report/trace。 | 未写 query repair / mark stale / save side effect。 |
| 后续 Step 不越界 | error、retry、config、observability、test 留给 Step 12~16。 | 当前批 handoff 清晰,不伪装为已闭口结论。 |

### 7. R11.5 进入门禁

进入 `R11.5 数据所有权与 logical store 筛选:先思考` 前必须满足:

- `R11.1`~`R11.4` 已完成或 completed_wait_user_confirm。
- Step 11 已有目标 / 非目标、输出骨架、模板、状态族分批和停审标准。
- 当前仍未填完整数据所有权表、logical store 表、repository 语义表、transaction boundary 表或 consistency strategy 表。
- 正式 `03-详细设计.md` 未修改。
- 下一步只允许思考数据所有权与 logical store 筛选方法、候选池、判定标准和 R11.6 写入表结构。

### 8. R11.4 stop-review

| 检查项 | 结果 |
|---|---|
| 是否写入 Step 11 目标 / 非目标 | pass |
| 是否写入 L1-governance 框架裁剪表 | pass |
| 是否写入输出章节骨架 | pass |
| 是否写入表格模板 | pass |
| 是否写入状态族分批表和进入 / 停审标准 | pass |
| 是否未填完整 logical store / repository / transaction / consistency 表 | pass |
| 是否未复制 governance 领域语义 | pass |
| 是否修改正式 `03-详细设计.md` | no |

next_allowed_action: 等待用户确认后进入 Step 11 `R11.5 数据所有权与 logical store 筛选:先思考`;只允许思考数据所有权与 logical store 筛选方法、候选池、persistence kind 判定、excluded/watch/blocker 标准和 `R11.6` 写入表结构;不得直接修改正式 `03-详细设计.md`;不得写状态族完整 store rows、repository 持久化语义表、transaction boundary 表、一致性策略表、error taxonomy、config key、test case schema 或 implementation code。

---

## R11.5 数据所有权与 logical store 筛选:先思考

### 1. 当前模块目标

`R11.5` 只思考 Step 11 的数据所有权筛选方法和 logical store 候选分类,为 `R11.6` 写入正式筛选表做准备。当前模块不写完整 store rows、repository 持久化语义表、transaction boundary 表或一致性策略表。

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm |
| 当前允许 | 思考候选池来源、ownership 归属、persistence kind 判定、body-free 边界、watch / blocker 标准和 `R11.6` 表结构。 |
| 当前禁止 | 写完整 logical store 行、repository 持久化语义行、transaction boundary 行、一致性策略行、error taxonomy、config key、test case schema、implementation code 或正式 `03-详细设计.md`。 |

### 2. 候选池来源思考

数据所有权候选池必须来自 Step 6/7/8/9/10 的已确认内容,不得从旧 Step 11 或旧正式 03 直接恢复。候选的第一职责不是“能不能存”,而是“谁拥有、为什么拥有、是否必须落到 durable / append-only / projection / shell / marker / runtime-local”。

| 来源 | 提供什么 | R11.6 使用方式 |
|---|---|---|
| Step 6 对象 / helper / marker / shell | 对象 owner、字段来源、body-free 红线、support boundary。 | 作为 ownership 第一来源。 |
| Step 7 repository / resolver / mapper / publisher / handoff / job / runtime port | 读取面、保存面、version source、marker source、append-only 面。 | 判断 candidate 是否有正式落 store 的 port 依据。 |
| Step 8 public surface / stored result / report shell | public DTO、result shell、receipt shell、view/report shell。 | 判断是 truth、stored shell 还是 marker / projection 仅承载面。 |
| Step 9 command/query/inbound/outbound/job flow | flow side effect、persist ordering、query no-write、stored replay、handoff 与 publication 顺序。 | 判断是否需要事务内写入、append、replace 或 only-marker。 |
| Step 10 state matrix / handoff | state 主语、marker-only / technical-local / watch / blocker 分类。 | 判断 persistence kind 和后续 Step 闭口顺序。 |

### 3. 数据所有权筛选总原则

| 原则 | 含义 | 对 R11.6 的约束 |
|---|---|---|
| 先看 owner 再看 store | 先确认对象/辅助对象/marker 的正式 owner,再决定 logical store。 | 没有 owner 的候选先进入 watch 或 blocker。 |
| 先看 body-free 再看 persistence | 任何 raw body、payload body、report body、外部正文都不能因为“可存”而进入 truth。 | body-free 候选最多进入 summary / shell / marker。 |
| 先看 formal source 再看 version | mutable truth、marker、projection、stored result 都必须能回指 Step 7/9/10 的正式来源。 | 不能用时间戳、route、字符串拼接或私有 map 当 version source。 |
| query 不修复 truth | Query 只能读 truth / projection / reference / report / trace,不能补写缺失 state。 | query 相关候选若缺 marker source,应停在 marker / watch。 |
| 旧实现机制禁入 | old `MethodContent`、publish、snapshot、fingerprint、outbox、delivery 不可直接恢复。 | 旧名只能作为排除样本或污染审计输入。 |

### 4. 预分组筛选结果思考

本表是 `R11.6` 的候选分组方式,不是最终 logical store 结论。

| 候选族 | 主要候选 | 初判 persistence kind | 需要特别注意 |
|---|---|---|---|
| core business truth | `MethodAssetDefinition`、`MethodAssetCatalogEntry`、`FormalizationState`、`FormalMethodAssetVersion`、`MethodAssetConsumptionMaterial`、`MethodAssetRelation`、`MethodPackage`、`MethodSetAssembly` | `mutable truth` | 这些对象有正式 owner、versioned save 或独立 lifecycle,优先进入 truth store 候选。 |
| source / reference / body-boundary | `FormalizationBasisSummary`、`ExternalSourceSummary`、`DefinitionUseBoundaryGuard`、`DownstreamConsumptionBoundary`、`ExternalBodyBoundaryRule` | `marker_only` / `stored shell` / `watch` | 需要进一步区分“只是摘要”还是“真的需要 durable shell”;任何 external body 一律排除。 |
| trace / audit / lineage / impact | `MethodAssetTraceMaterial`、`ConsumptionImpactSummary`、`MethodAssetAuditTrail`、`MethodAssetEvidenceLineage` | `projection` / `append-only` / `marker_only` | trace material 可能是可重建读材料;audit / lineage 更偏 append / support。 |
| read / visibility / material freshness | `MethodAssetReadDecision`、`MethodAssetDegradedDecision`、availability / freshness marker、query surface shell | `marker_only` / `projection` | query 不得修复;缺 marker source 的候选进入 watch。 |
| maintenance / job / report | `ReadMaterialRefreshTask`、`TraceMaterialRefreshTask`、`ConsistencyRecoveryTask`、`MaintenanceProgressView`、run history、checkpoint、job report | `stored shell` / `append-only` | report body 与 evidence schema 后移,此处只保留 durable shell 候选。 |
| idempotency / replay | `MethodAssetIdempotencyGuard`、`MethodAssetStoredOperationResult`、inbound receipt、job report replay | `stored shell` / `runtime-local` | duplicate replay 的 stored surface 必须可回放,但不等于 truth。 |
| runtime / adapter / entry | `MethodAssetRuntimeAssemblyState`、`MethodAssetAdapterAvailabilityState`、`MethodAssetStoreBindingState`、`MethodAssetExternalResolverBindingState`、`MethodAssetInboundSourceBindingState`、`MethodAssetPublisherBindingState`、`MethodAssetHandoffBindingState`、entry local state | `runtime-local` | 这些是装配/绑定状态,默认不进入 durable truth,除非后续 Step 明确需要持久化诊断。 |
| outbound / publication / handoff | `MethodAssetEventCandidateAssembly`、`MethodAssetJobAssemblyContext`、`MethodAssetApiResponseAssemblyState`、publisher/handoff outcome | `append-only` / `stored shell` / `marker_only` | 不能把 candidate、outcome 和 delivery truth 混为一体。 |

### 5. 排除、观察与 blocker 标准

| 类别 | 触发条件 | 处理口径 |
|---|---|---|
| `exclude_non_state` | typed ref、public shell、纯 context、纯 helper、raw body 红线。 | 直接排除,不进 logical store 候选。 |
| `marker_only` | 只表达 safe decision / summary / availability / degraded / blocked / diagnostic。 | 仅进入 marker / summary / shell 候选,不升级为 truth。 |
| `runtime_local_state` | 只服务 API / worker / jobs / adapter 装配与返回结果。 | 只进入 runtime-local 候选,不得反写业务 truth。 |
| `watch_needs_later_step` | 需要 Step 12/13/14/15 才能闭口的 schema / error / config / test 相关来源。 | 保留 watch,不提前补口。 |
| `blocker_missing_source` | 缺 owner、缺 version source、缺 marker source、缺 read/write 面或旧主线污染无法切分。 | 暂停对应候选,记录 blocker,不得自行补 schema。 |

### 6. `R11.6` 写入表结构思考

`R11.6` 应写入三张表,保持可审计而不提前进入完整 persistence contract。

| 表 | 目标 | 必要列 |
|---|---|---|
| 数据所有权筛选表 | 对 Step 6/7/8/9/10 候选逐项裁决。 | candidate、source family、owner module、persistence kind、write owner、read owner、body-free rule、decision、reason、next module。 |
| logical store 候选表 | 固定候选存储对象、身份、索引和 version / append 语义。 | logical store、persistence kind、primary identity、unique key、lookup/index、version / append rule、body-free rule、filled by。 |
| watch / blocker 表 | 保留缺口、后续 Step 闭口和禁止合成项。 | id、candidate/topic、issue、required closure step、current handling。 |

### 7. R11.5 stop-review

| 检查项 | 结果 |
|---|---|
| 是否只思考数据所有权与 logical store 筛选 | pass |
| 是否覆盖 candidate source、persistence kind、body-free 与 blocker 标准 | pass |
| 是否明确 R11.6 写入表结构 | pass |
| 是否未写完整 store rows 或 repository / transaction / consistency 表 | pass |
| 是否未修改正式 `03-详细设计.md` | no |

next_allowed_action: 继续 Step 11 `R11.7 core business truth 持久化契约:先思考`;只允许思考 definition、catalog、formalization、formal version、consumption material、relation、package、assembly 的持久化契约;不得直接修改正式 `03-详细设计.md`;不得写完整 logical store 行、repository 持久化语义表、version / unique / index 规则、body-free 约束、transaction boundary 表、一致性策略表、error taxonomy、config key、test case schema 或 implementation code。

---

## R11.7 core business truth 持久化契约:先思考

### 1. 当前模块目标

`R11.7` 只思考 core business truth 的持久化契约如何继续收口到可审计的 logical store 行与 repository 持久化语义边界。当前模块不写完整 store 行、不写 repository semantic table、不写 transaction boundary 表，也不进入 source/reference、trace/audit、read/projection、maintenance/job、idempotency/replay、outbound/handoff 的完整契约。

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm |
| 当前允许 | 思考 definition、catalog、formalization、formal version、consumption material、relation、package、assembly 的 version / unique / index / body-free 约束和 `R11.8` 写入边界。 |
| 当前禁止 | 写完整 logical store rows、repository semantic rows、transaction boundary rows、一致性策略 rows、error taxonomy、config key、test case schema、implementation code 或正式 `03-详细设计.md`。 |

### 2. core business truth 继续收口思考

| family | current boundary question | likely persistence direction | watch point |
|---|---|---|---|
| definition / catalog | definition 与 catalog 是否独立 truth owner，catalog 是否只承载 scope / lookup 语义 | 独立 truth row + versioned save；catalog 通过 definition_ref 关联 | catalog 不能退化成 definition 附属索引 |
| formalization / version | `FormalizationState` 与 `FormalMethodAssetVersion` 是否双实体 | 资格状态与已建立版本分离，前者承接决策，后者承接 released version | 不把 eligibility / released version 压成单一 record |
| consumption material | material identity 是否由 formal version + context 共同决定 | body-free truth row + freshness/availability link | 不保存原始正文或 provider payload |
| relation | relation endpoint / kind / scope / supersession 的 identity 是否稳定 | versioned relation row + stable endpoint key | 不以 page order 代替 relation identity |
| package / assembly | package 与 assembly 是否都作为 peripheral truth owner | versioned truth row + composition index | composition summary 不能冒充 runtime config |

### 3. 语义边界思考

- core business truth 的关键不是“能持久化”，而是“谁是 owner、谁负责 versioned save、谁读取 loaded version”。
- definition / catalog 需要把“可独立演进的 truth”与“查询入口”区分开，避免把 catalog 简化成 definition 的 shadow table。
- formalization / version 需要保留资格状态与已建立版本的边界，不把 `FormalizationState` 和 `FormalMethodAssetVersion` 混成一条记录。
- consumption material 只能保留 body-free material 与 freshness/availability 相关字段，原始方法正文和外部正文继续排除。
- relation 需要在 endpoint、kind、scope、supersession 上形成稳定 identity，而不是依赖临时 query 顺序。
- package / assembly 需要被视为独立 peripheral truth，而不是运行时配置镜像。

### 4. R11.8 写入边界思考

`R11.8` 应该写:
1. core business truth 的 logical store 行和 version / unique / index 规则。
2. 每个 truth family 对应的 Step 7 repository save/get/list 持久化语义。
3. created vs updated vs append-only 的边界。
4. body-free 约束与 same-UoW 约束的 truth 侧裁决。
5. 进入 `R11.9` 前仍需保留的 watch / blocker。

`R11.8` 不应该写:
- source/reference/body-boundary、trace/audit、read/projection、maintenance/job、idempotency/replay、outbound/handoff 的完整契约。
- error taxonomy、config key、test case schema、implementation code。

### 5. R11.7 stop-review

| 检查项 | 结果 |
|---|---|
| 是否只思考 core business truth 持久化边界 | pass |
| 是否把 definition/catalog、formalization/version、material、relation、package/assembly 分组 | pass |
| 是否未写完整 store rows / repository rows | pass |
| 是否未修改正式 `03-详细设计.md` | pass |

next_allowed_action: 等待用户确认后进入 Step 11 `R11.8 core business truth 持久化契约:再写入`;只允许写入 core business truth 的 logical store 行、repository 持久化语义、version / unique / index 规则、body-free 约束和 `R11.9` 进入门禁;不得直接修改正式 `03-详细设计.md`;不得写 source/reference、trace/audit、read/projection、maintenance/job、idempotency/replay、outbound/handoff 的完整 contract、transaction boundary 表、一致性策略表、error taxonomy、config key、test case schema 或 implementation code。


---

## R11.8 core business truth 持久化契约:再写入

### 1. 当前模块目标

`R11.8` 将 Step 6 的 core business truth 对象收束为可实现的 logical store 行与 repository 持久化语义。当前模块只写 truth 族的 store identity、version / unique / index 规则、created vs updated vs append-only 边界和 body-free 约束，不进入 source/reference、trace/audit、read/projection、maintenance/job、idempotency/replay、outbound/handoff 的完整契约。

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm |
| 当前允许 | 写入 core business truth 的 logical store 行、repository 持久化语义、version / unique / index 规则、body-free 约束和 `R11.9` 进入门禁。 |
| 当前禁止 | 写 source/reference、trace/audit、read/projection、maintenance/job、idempotency/replay、outbound/handoff 的完整 contract、transaction boundary 表、一致性策略表、error taxonomy、config key、test case schema、implementation code 或正式 `03-详细设计.md`。 |

### 2. core business truth 持久化表

| truth family | logical store | primary identity | unique key | lookup/index | version / append rule | body-free rule | filled by |
|---|---|---|---|---|---|---|---|
| `MethodAssetDefinition` | `method_asset_definitions` | `definition_ref` | `definition_ref` | `catalog_scope_ref`,`current_version_ref` | versioned save | refs + summary only | R11.8 |
| `MethodAssetCatalogEntry` | `method_asset_catalog_entries` | `catalog_entry_ref` | `(definition_ref, catalog_scope_ref)` | `definition_ref`,`catalog_scope_ref` | versioned save | refs + summary only | R11.8 |
| `FormalizationState` | `formalization_states` | `formalization_ref` | `formalization_ref` | `definition_ref`,`state_kind` | versioned save | refs only | R11.8 |
| `FormalMethodAssetVersion` | `formal_method_asset_versions` | `version_ref` | `(definition_ref, version_kind)` | `definition_ref`,`version_kind` | versioned save | refs + version only | R11.8 |
| `MethodAssetConsumptionMaterial` | `method_asset_consumption_materials` | `material_ref` | `(formal_version_ref, consumption_context_ref)` | `formal_version_ref`,`consumption_context_ref` | versioned save | refs + summary only | R11.8 |
| `MethodAssetRelation` | `method_asset_relations` | `relation_ref` | `(left_asset_ref, right_asset_ref, relation_kind)` | `left_asset_ref`,`right_asset_ref`,`relation_kind` | versioned save | refs only | R11.8 |
| `MethodPackage` | `method_packages` | `package_ref` | `(package_scope_ref, package_kind)` | `package_scope_ref`,`package_kind` | versioned save | refs + summary only | R11.8 |
| `MethodSetAssembly` | `method_set_assemblies` | `assembly_ref` | `(assembly_scope_ref, assembly_kind)` | `assembly_scope_ref`,`assembly_kind` | versioned save | refs + summary only | R11.8 |

### 3. repository 持久化语义

| Step 7 family | persistence role | version source | UoW requirement | returns | consistency / missing rule |
|---|---|---|---|---|---|
| `MethodAssetDefinitionRepository` | load / save definition truth | `Versioned<MethodAssetDefinition>` | create / update in same UoW | `MethodAssetDefinitionRef` | missing exact read enters create path; update 必须带 expected version |
| `MethodAssetCatalogEntryRepository` | load / save catalog truth | `Versioned<MethodAssetCatalogEntry>` | create / update in same UoW | `MethodAssetCatalogEntryRef` | catalog scope uniqueness must be enforced by logical key |
| `FormalizationStateRepository` | load / save formalization state | `Versioned<FormalizationState>` | create / update in same UoW | `FormalizationStateRef` | state owner cannot be inferred from version history alone |
| `FormalMethodAssetVersionRepository` | load / save formal version | `Versioned<FormalMethodAssetVersion>` | create / supersede in same UoW | `FormalMethodAssetVersionRef` | supersession must be explicit and versioned |
| `MethodAssetConsumptionMaterialRepository` | load / save controlled material | `Versioned<MethodAssetConsumptionMaterial>` | create / refresh in same UoW | `MethodAssetConsumptionMaterialRef` | material lookup must stay body-free and versioned |
| `MethodAssetRelationRepository` | load / save relation truth | `Versioned<MethodAssetRelation>` | create / update in same UoW | `MethodAssetRelationRef` | relation identity must be endpoint+kind stable |
| `MethodPackageRepository` | load / save package truth | `Versioned<MethodPackage>` | create / update in same UoW | `MethodPackageRef` | package summary cannot become runtime config |
| `MethodSetAssemblyRepository` | load / save assembly truth | `Versioned<MethodSetAssembly>` | create / update in same UoW | `MethodSetAssemblyRef` | assembly summary cannot broaden consumption authority |

### 3A. `commit-03-b` repository / UoW / stored-result persistence closure

本节闭合 `commit-03-b` 当前 accepted service 所需的 exact persistence semantics。它只适用于 definition/catalog accepted service vertical slice,不提前实现 formalization/version、query/read material、publisher、job 或 external summary durable dereference。

| Step 7 callable | logical store | read key | write key / unique key | version source | UoW rule | missing/conflict rule |
|---|---|---|---|---|---|---|
| `get_definition_with_version(definition_ref)` | `method_asset_definitions` | `definition_ref` | none | stored row version -> `Versioned<MethodAssetDefinition>` | read before command UoW mutation | missing returns `None`,not implicit create。 |
| `find_definition_by_identity_key(identity_key)` | `method_asset_definitions` | `identity_key` unique index | none | stored row version -> `Versioned<MethodAssetDefinition>` | read before create decision | duplicate create becomes safe stored rejection/conflict,not second row。 |
| `save_definition(definition, expected_version, uow)` | `method_asset_definitions` | none | `definition_ref`;unique `identity_key` | create `None` -> new version;update expected loaded version -> next version | staged in supplied command UoW | version mismatch maps to safe rejection;rollback leaves no row/version advance。 |
| `get_catalog_entry_with_version(catalog_entry_ref)` | `method_asset_catalog_entries` | `catalog_entry_ref` | none | stored row version -> `Versioned<MethodAssetCatalogEntry>` | read before command UoW mutation | missing returns `None`,not implicit create。 |
| `find_catalog_entry_by_definition_scope(definition_ref,catalog_scope_ref)` | `method_asset_catalog_entries` | `(definition_ref,catalog_scope_ref)` unique index | none | stored row version -> `Versioned<MethodAssetCatalogEntry>` | read before create/reclassify decision | duplicate register becomes safe stored rejection/conflict。 |
| `save_catalog_entry(catalog_entry, expected_version, uow)` | `method_asset_catalog_entries` | none | `catalog_entry_ref`;unique `(definition_ref,catalog_scope_ref)` | create `None` -> new version;update expected loaded version -> next version | staged in supplied command UoW | stale expected version maps to safe rejection;rollback leaves no row/version advance。 |
| `find_command_result_by_idempotency(idempotency_key_ref,dedup_scope_ref)` | `method_asset_stored_operation_results` + idempotency index | `(idempotency_key_ref,dedup_scope_ref)` | none | stored result immutable once committed | read before domain mutation | missing means fresh candidate;digest mismatch creates safe conflict surface。 |
| `get_stored_operation_result(stored_result_ref)` | `method_asset_stored_operation_results` | `stored_result_ref` | none | immutable stored result row | replay read only | missing stored result is replay consistency failure,not mutation rerun。 |
| `save_command_result_for_idempotency(...,stored_result,uow)` | `method_asset_stored_operation_results` | none | `stored_result_ref`;unique `(idempotency_key_ref,dedup_scope_ref)` | immutable append for replay surface | same command UoW as accepted/rejected mutation | rollback leaves no replay surface;unique conflict maps to duplicate/conflict resolution,not partial accepted state。 |

`method_asset_stored_operation_results` in `commit-03-b` stores only replay-safe refs and markers: `stored_result_ref`, `operation_context_ref`, `operation_digest_ref`, `result_kind`, `accepted_summary_ref`, `rejected_reason_ref`, `ignored_reason_ref`, `effect_summary_refs`, `replay_marker_ref`, `idempotency_key_ref`, and `dedup_scope_ref`. It must not store command DTO body, raw command shell body, raw error, repository row body snapshot, event payload, external provider body, report body, HTTP/RPC status or config value。

### 3B. `commit-03-b` transaction sequence

| branch | required sequence | rollback rule |
|---|---|---|
| fresh accepted definition/catalog command | begin command UoW -> read idempotency/stored result -> read required truth -> create/update domain object -> repository save with expected version -> create stored accepted result -> save command result for idempotency -> commit。 | If any save or stored-result write fails before commit, rollback all staged truth/result/effect writes。 |
| safe rejected command | begin minimal command UoW -> create stored rejected/conflict result with safe reason -> save command result for idempotency -> commit。 | If rejected result cannot be saved, return replay consistency failure and leave no partial idempotency row。 |
| duplicate replay | read stored result by idempotency key/scope -> compare digest -> return stored safe surface。 | No UoW mutation and no domain/repository save。 |
| digest conflict | read stored result by key/scope -> detect digest mismatch -> return stored safe conflict if present or save conflict result in minimal UoW。 | Must not mutate definition/catalog truth。 |

The accepted branch must commit truth and stored result in the same logical atomic boundary or a formally equivalent fake atomic boundary. A fake repository that exposes truth before stored result commit,or leaves stored result after truth rollback,violates `commit-03-b`。

### 4. created vs updated vs append-only 边界

| family | create boundary | update boundary | append-only boundary | notes |
|---|---|---|---|---|
| definition / catalog | first persisted row establishes identity | changes to body-free summary or scope are versioned updates | no append-only requirement | exact read and stable lookup must not be derived from name or route |
| formalization / version | state owner create first; formal version create after state closure | state transitions and supersession are versioned | no append-only requirement | release state and released version remain separate records |
| consumption material | material created from formal version + context | freshness / availability changes are versioned refreshes | no append-only requirement | material is controlled read body, not source truth |
| relation | relation create from endpoint refs and kind | relation supersession or integrity updates are versioned | no append-only requirement | endpoints and relation kind define identity |
| package / assembly | package / assembly create from refs and summary | membership or summary changes are versioned | no append-only requirement | composition summary must remain body-free |

### 5. body-free 与 watch / blocker 约束

| item | rule | watch / blocker |
|---|---|---|
| definition summary | only body-free summary refs / safe facts | raw method body remains excluded |
| catalog scope | only scope / classification refs | catalog cannot carry source正文 |
| formalization state / version | only state, basis refs, version boundary summary | do not fold state into a single released record |
| consumption material | only formal version refs, context refs, boundary summary | no downstream runtime truth / payload body |
| relation | endpoint refs, relation kind, integrity summary | no distribution body / runtime graph |
| package / assembly | refs and summary only | no marketplace body / installation body / fulfillment body |

### 6. R11.8 stop-review

| 检查项 | 结果 |
|---|---|
| 是否写入 core business truth logical store 行 | pass |
| 是否写入 core business truth repository 持久化语义 | pass |
| 是否写入 version / unique / index 规则 | pass |
| 是否写入 body-free 约束 | pass |
| 是否越界进入 source/reference / trace / read / job / replay / outbound | no |
| 是否修改正式 `03-详细设计.md` | no |

next_allowed_action: 等待用户确认后进入 Step 11 `R11.9 source/reference/body-boundary 持久化契约:先思考`;只允许思考 source/reference/body-boundary 的持久化契约和 `R11.10` 写入边界;不得直接修改正式 `03-详细设计.md`;不得写 trace/audit、read/projection、maintenance/job、idempotency/replay、outbound/handoff 的完整 contract、transaction boundary 表、一致性策略表、error taxonomy、config key、test case schema 或 implementation code。

---

## R11.9 source/reference/body-boundary 持久化契约:先思考

### 1. 当前模块目标

`R11.9` 只思考 source/reference/body-boundary 族如何在 `R11.10` 落成可审计的 logical store 与 repository 语义。当前模块不写完整 store 行、不写 repository semantic table、不写 transaction boundary 表，也不进入 trace/audit、read/projection、maintenance/job、idempotency/replay、outbound/handoff 的完整契约。

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm |
| 当前允许 | 思考 `FormalizationBasisSummary`、`ExternalSourceSummary`、`DefinitionUseBoundaryGuard`、`DownstreamConsumptionBoundary`、`ExternalBodyBoundaryRule` 的持久化归属、body-free 红线、version / marker 来源和 `R11.10` 写入边界。 |
| 当前禁止 | 写完整 logical store rows、repository semantic rows、transaction boundary rows、一致性策略 rows、error taxonomy、config key、test case schema、implementation code 或正式 `03-详细设计.md`。 |

### 2. source/reference/body-boundary 继续收口思考

| family | current boundary question | likely persistence direction | watch point |
|---|---|---|---|
| formalization basis summary | basis summary 是本地 support summary 还是 resolver 输出缓存 | support summary row;exact read + basis-source lookup | 不让 repository 顺带执行 basis resolver 或读取治理正文 |
| external source summary | external summary 是否作为本地 body-free summary owner | support summary row;source lookup + acceptance / definition-scoped page | unavailable / schema / adapter binding 留 Step 12 / Step 14 |
| definition/use guard | guard 是否需要 standalone durable store | marker-only or policy-derived decision;R11.10 判断是否落 marker row | 若无 Step 7 repository,不得发明 guard repository |
| downstream consumption boundary | boundary 是持久化 marker 还是纯 resolver decision | likely marker row with versioned boundary if Step 7/9/10 来源闭合 | durable owner 与可更新语义仍需谨慎记录 watch |
| external body boundary rule | rule 是 domain policy guard 还是持久化 violation marker | no raw body;可能只持久化 safe violation / rejection marker | 不保存正文、摘录、provider payload、URL/path truth |

### 3. repository / resolver 边界思考

| Step 7 source | 可用于 R11.10 的内容 | 不能做的事 |
|---|---|---|
| `FormalizationBasisSummaryRepository` | `FormalizationBasisSummaryRef` exact read、basis-source lookup、versioned support summary save。 | 顺带做 basis resolution、eligibility diagnostic 或读取治理执行正文。 |
| `ExternalSourceSummaryRepository` | `ExternalSourceSummaryRef` exact read、`external_source_ref` lookup、acceptance / definition-scoped page、versioned support summary save。 | 顺带做 external resolver、archive lookup、provider payload parsing。 |
| `FormalizationBasisResolverPort` | body-free basis resolution / pending / rejected 输入。 | 保存 basis summary 或生成 durable key。 |
| `ExternalBodyFreeSourceAdapterPort` | typed external source / artifact refs 到 safe resolution summary。 | 返回 document body、archive body、provider payload、credential、URL/path truth。 |
| `MethodAssetPolicyDiagnosticBuilderPort` | 装配 guard / rule 的 safe diagnostic summary。 | 让 query service 自己拼 diagnostic 或持久化 raw rule matrix。 |
| `MethodAssetConsumptionAvailabilityResolverPort` | 对已有 material + boundary 做 ready/stale/unavailable/boundary constrained 解释。 | 创建 material、扫描 downstream runtime truth 或修改 formal version truth。 |

### 4. R11.10 写入边界思考

`R11.10` 应该写:
1. source/reference/body-boundary 的 logical store / marker / excluded 行。
2. `FormalizationBasisSummaryRepository` 与 `ExternalSourceSummaryRepository` 的持久化语义。
3. `DefinitionUseBoundaryGuard`、`DownstreamConsumptionBoundary`、`ExternalBodyBoundaryRule` 是否落 standalone marker 的裁决。
4. body-free 红线: 不保存 external body、archive body、provider payload、request body、URL/path truth 或正文 hash 反推。
5. watch / blocker: unavailable、schema/config binding、durable boundary owner、marker source 缺口。

`R11.10` 不应该写:
- trace/audit/lineage/impact、read/projection、maintenance/job、idempotency/replay、outbound/handoff 的完整契约。
- transaction boundary、一致性策略、error taxonomy、config key、test case schema、implementation code。

### 5. R11.9 stop-review

| 检查项 | 结果 |
|---|---|
| 是否只思考 source/reference/body-boundary 持久化边界 | pass |
| 是否区分 support summary、marker-only、resolver、adapter 与 policy guard | pass |
| 是否明确 no raw body / no provider payload / no URL path truth | pass |
| 是否明确 R11.10 写入边界 | pass |
| 是否未写完整 store rows / repository rows | pass |
| 是否未修改正式 `03-详细设计.md` | no |

next_allowed_action: 等待用户确认后进入 Step 11 `R11.10 source/reference/body-boundary 持久化契约:再写入`;只允许写入 source/reference/body-boundary 的 logical store / marker / excluded 行、repository 持久化语义、body-free 约束、watch / blocker 和 `R11.11` 进入门禁;不得直接修改正式 `03-详细设计.md`;不得写 trace/audit、read/projection、maintenance/job、idempotency/replay、outbound/handoff 的完整 contract、transaction boundary 表、一致性策略表、error taxonomy、config key、test case schema 或 implementation code。

---

## R11.10 source/reference/body-boundary 持久化契约:再写入

### 1. 当前模块目标

`R11.10` 将 `R11.9` 的 source/reference/body-boundary 思考落成可审计的 logical store、marker / excluded 裁决和 repository 持久化语义。当前模块只覆盖 `FormalizationBasisSummary`、`ExternalSourceSummary`、`DefinitionUseBoundaryGuard`、`DownstreamConsumptionBoundary`、`ExternalBodyBoundaryRule` 以及相关 resolver / adapter 的持久化边界,不进入 trace/audit、read/projection、maintenance/job、idempotency/replay、outbound/handoff 的完整契约。

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm |
| 当前允许 | 写入 source/reference/body-boundary 的 logical store / marker / excluded 行、repository 持久化语义、body-free 约束、watch / blocker 和 `R11.11` 进入门禁。 |
| 当前禁止 | 写 trace/audit、read/projection、maintenance/job、idempotency/replay、outbound/handoff 的完整 contract、transaction boundary 表、一致性策略表、error taxonomy、config key、test case schema、implementation code 或正式 `03-详细设计.md`。 |

### 2. source/reference/body-boundary logical store 裁决

| object / boundary | logical persistence decision | primary identity | lookup / index | version / marker rule | body-free rule | current closure |
|---|---|---|---|---|---|---|
| `FormalizationBasisSummary` | `formalization_basis_summaries` support summary row | `basis_summary_ref` | exact read by `basis_summary_ref`;basis-source lookup by `(definition_ref, external_summary_ref)` or `(definition_ref, governance_basis_ref)` | versioned support save;supersession must be explicit and cannot be inferred from resolver output | only `definition_ref`, optional `catalog_entry_ref`, basis kind, external/governance typed refs and `basis_safe_summary` | closed for Step 11 persistence semantics |
| `ExternalSourceSummary` | `external_source_summaries` support summary row | `external_summary_ref` | exact read by `external_summary_ref`;lookup by `external_source_ref`;acceptance / definition-scoped page as Step 7 helper | versioned support save;`summary_digest_ref` and `acceptance_marker_ref` are safe consistency markers, not body hash recovery | only external/artifact typed refs, source kind, safe summary, digest ref and acceptance marker | closed with Step 12 / Step 14 watches |
| `DownstreamConsumptionBoundary` | reserved marker / boundary row, not fully closed as durable repository | `boundary_ref` | desired exact/context lookup remains tied to boundary/material family | versioned marker only after Step 7 owner is explicit | formal version requirement, allowed/forbidden kind sets, material scope and safe reason only | open watch: Step 9 flows require boundary family but Step 7 has no explicit boundary repository |
| `DefinitionUseBoundaryGuard` | no standalone truth store in this module | `guard_ref` if materialized by policy diagnostic or later trace/audit family | no repository lookup added in Step 11 | guard result may be copied into stored result, trace or audit later;no new guard repository is introduced here | protected definition/version refs, context ref, boundary ref and safe reason only | marker-only;standalone persistence deferred unless Step 7 adds formal port |
| `ExternalBodyBoundaryRule` | no raw body store and no standalone rule table in this module | `rule_ref` if materialized by policy diagnostic or later trace/audit family | no repository lookup added in Step 11 | violation/rejection marker may be persisted by stored result, trace or audit later;rule matrix is not persisted here | typed refs, forbidden/allowed kind sets, safe reason and optional lineage ref only | marker-only;body violation persistence deferred to later families |
| `ExternalBodyFreeSourceAdapterPort` output | not persisted directly | adapter output has no durable identity in Step 11 | consumed by application service;may produce `ExternalSourceSummary` or safe rejection surface | adapter availability / invalid / unresolved outcome is not a support-summary save by itself | no document body, archive body, provider payload, credential, URL/path truth | excluded from store;Step 12 / Step 14 own error/config closure |
| `FormalizationBasisResolverPort` output | not persisted directly | resolver output has no durable identity in Step 11 | consumed by formalization / eligibility flow | resolver cannot allocate `basis_summary_ref` or save summary | body-free basis resolution / pending / rejected only | excluded from store;repository remains the durable support owner |
| `MethodAssetPolicyDiagnosticBuilderPort` output | not persisted directly in source/reference family | diagnostic marker ref only if later stored by result/trace/audit | no policy diagnostic repository added here | builder output is copied by command/query/report surfaces;not a new truth owner | safe diagnostic, reason, hint and marker only | excluded from store;trace/audit/replay families may persist copies |
| `MethodAssetConsumptionAvailabilityResolverPort` output | not persisted directly in source/reference family | availability marker only if later stored by material/read/report family | no availability repository added here | resolver explains existing material + boundary;does not create material or boundary | no downstream runtime truth, request body or auth matrix | excluded from store;read/material families own later persistence |

### 3. repository 持久化语义

| Step 7 family | durable role | accepted read / lookup | save semantics | version / UoW rule | missing / consistency rule | explicit exclusions |
|---|---|---|---|---|---|---|
| `FormalizationBasisSummaryRepository` | owner of local `FormalizationBasisSummary` support rows | exact read by `basis_summary_ref`;basis-source lookup by external or governance source ref | save body-free support summary with expected version or create token supplied by application UoW | save participates in the command/inbound UoW that creates or reassesses the basis summary;duplicate/replay semantics are handled by stored-result family later | missing exact read returns absent support summary,not resolver fallback;basis-source ambiguity must remain a consistency issue for Step 12 | no governance execution body;no external body;no eligibility decision;no formal version creation |
| `ExternalSourceSummaryRepository` | owner of local `ExternalSourceSummary` support rows | exact read by `external_summary_ref`;source lookup by `external_source_ref`;acceptance / definition-scoped page as formal helper | save body-free external summary with expected version or create token supplied by application UoW | save participates in the inbound/intake/refresh UoW that accepts or replaces the safe summary | missing source lookup returns absent summary,not adapter resolution;duplicate safe summary must be resolved through explicit marker/version rule,not URL/path comparison | no external resolver;no archive lookup;no provider payload parse;no raw URL/path truth |
| boundary/material family for `DownstreamConsumptionBoundary` | not closed as a named Step 7 repository in current design | Step 9 expects exact/context boundary read, but Step 7 does not yet define a boundary repository row | no standalone save semantics can be added here | any future save must be versioned and UoW-bound, but this module cannot invent the port | register/adjust/query boundary flows remain watch until durable owner is formalized | no auth matrix;no downstream runtime state;no formal version mutation |
| `MethodAssetPolicyDiagnosticBuilderPort` | non-durable diagnostic builder | consumes domain guard/rule inputs and support summaries | no save | no UoW ownership | missing diagnostic input maps to safe diagnostic / error model later | no rule matrix persistence;no query-side DTO fabrication |
| `ExternalBodyFreeSourceAdapterPort` | non-durable body-free adapter | consumes typed external/source/archive refs | no save | no UoW ownership except caller may save resulting safe summary through repository | unavailable/invalid/unresolved outcomes are later Step 12 / Step 14 concerns | no raw body;no credentials;no provider response persistence |
| `FormalizationBasisResolverPort` | non-durable resolver | consumes basis/external/governance safe refs | no save | no UoW ownership | pending / insufficient / rejected output must not be silently converted into accepted summary | no durable key allocation;no repository side effect |
| `MethodAssetConsumptionAvailabilityResolverPort` | non-durable availability interpreter | consumes existing material + boundary inputs | no save | no UoW ownership | unavailable / boundary constrained output copied to query/report surfaces later | no material creation;no downstream scan;no boundary mutation |

### 4. marker / excluded 裁决

| candidate | current decision | reason | later closure target |
|---|---|---|---|
| `DefinitionUseBoundaryGuard` standalone row | excluded from current source/reference store | Step 7 has no guard repository;guard is domain policy object and diagnostic input,not an independently listed truth owner. | If command flow needs durable violation history, R11.11 trace/audit or R11.17 stored replay must carry the marker. |
| `ExternalBodyBoundaryRule` standalone row | excluded from current source/reference store | The rule protects the no-body boundary and may create safe violation markers, but Step 11 must not create a rule table or raw body evidence row. | R11.11 trace/audit/lineage and Step 12 error mapping decide how violation markers are recorded. |
| `DownstreamConsumptionBoundary` row | reserved / watch | Step 6 defines a boundary object and Step 9 has register/adjust/read flows, but Step 7 lacks an explicit boundary repository family. | Step 11 later audit or Step 7 backfill must formalize boundary repository / material-family owner before implementation. |
| adapter resolution cache | excluded | Adapter resolution is not a durable truth;only resulting accepted safe summaries or safe outcomes may be stored by formal repositories. | Step 14 config binding and Step 12 unavailable/error handling. |
| source URL / path / payload fingerprint | excluded | Current design forbids URL/path truth and raw body/hash inference. | Never enters L3 persistence;only typed refs, safe summaries and digest refs are allowed. |
| body-boundary rejected body evidence | excluded from source/reference store | Rejected body content itself cannot be stored. | A body-free rejection marker may appear in stored result, trace/audit or report families later. |

### 5. body-free redline 表

| redline | persistence rule | violation handling |
|---|---|---|
| external document body | never stored in summary, basis, boundary, trace or report rows | reject before repository save;copy only safe reason / marker |
| artifact / archive body | only `ArtifactArchiveRef` may be stored | archive body remains outside L3 truth and support stores |
| provider payload / API response | never stored as diagnostic or summary body | adapter returns body-free safe outcome only |
| request body / downstream private payload | never stored in guard or boundary rows | use typed context ref and safe violation marker |
| URL / path truth | cannot define identity, uniqueness or lookup | use `ExternalSourceRef`, `ArtifactArchiveRef`, summary digest ref or explicit safe marker |
| body hash inference | `summary_digest_ref` cannot be used to reconstruct or validate raw body | digest ref is a safe summary consistency line only |
| raw rule matrix / permission matrix | not persisted by policy diagnostic or boundary family | persist only allowed/forbidden kind sets and safe reason refs already in Step 6 |
| resolver fallback body | resolver pending/rejected cannot be upgraded by reading body text | pending/rejected remains safe marker input for Step 12 |

### 6. watch / blocker 台账

| id | topic | issue | current handling | required closure |
|---|---|---|---|---|
| ML-D03-S11-WATCH-007 | `ExternalSourceSummary` version semantics | Step 6 gives `summary_digest_ref` / `acceptance_marker_ref`, while Step 7 mentions versioned support save;there is no separate `source_version_ref` field in the object. | Treat repository version as storage version and digest/marker as safe summary consistency line. | Step 12 / Step 14 must not introduce source-version lookup without Step 6/7 backfill. |
| ML-D03-S11-WATCH-008 | `DownstreamConsumptionBoundary` durable owner | Step 9 requires register/adjust/read boundary flows, but Step 7 currently lacks an explicit boundary repository. | Mark `downstream_consumption_boundaries` as reserved / watch,not fully closed store. | Step 7 or later Step 11 audit must formalize repository/owner before implementation. |
| ML-D03-S11-WATCH-009 | guard/rule marker persistence | `DefinitionUseBoundaryGuard` and `ExternalBodyBoundaryRule` are policy/guard objects without standalone repository. | Do not create guard/rule table in R11.10. | R11.11 trace/audit or R11.17 stored replay must carry safe markers if durable history is required. |
| ML-D03-S11-WATCH-010 | unavailable / invalid external source | Adapter unavailable, schema mismatch and config binding are not persistence schema. | Persist only accepted safe summary or safe rejection marker if another family owns it. | Step 12 error/recovery and Step 14 config/dependency binding. |
| ML-D03-S11-WATCH-011 | body-boundary violation evidence | Rejected body content cannot be stored, but flows may need durable proof of rejection. | Persist only body-free violation/reason refs through later stored result / audit / report family. | R11.11 / R11.17 / Step 15 must define marker placement. |

### 7. R11.10 stop-review

| 检查项 | 结果 |
|---|---|
| 是否写入 source/reference/body-boundary logical store / marker / excluded 行 | pass |
| 是否写入 `FormalizationBasisSummaryRepository` 与 `ExternalSourceSummaryRepository` 持久化语义 | pass |
| 是否没有发明 guard / boundary / rule repository | pass |
| 是否写入 body-free redline | pass |
| 是否记录 unavailable、schema/config、boundary owner、marker source watch | pass |
| 是否越界进入 trace/audit、read/projection、job、replay、outbound/handoff 完整契约 | no |
| 是否修改正式 `03-详细设计.md` | no |

next_allowed_action: 等待用户确认后进入 Step 11 `R11.11 trace/audit/lineage/impact 持久化契约:先思考`;只允许思考 trace/audit/lineage/impact 的持久化契约和 `R11.12` 写入边界;不得直接修改正式 `03-详细设计.md`;不得写 read/projection、maintenance/job、idempotency/replay、outbound/handoff 的完整 contract、transaction boundary 表、一致性策略表、error taxonomy、config key、test case schema 或 implementation code。

---

## R11.11 trace/audit/lineage/impact 持久化契约:先思考

### 1. 当前模块目标

`R11.11` 只思考 trace/audit/lineage/impact 族如何在 `R11.12` 落成可审计的 logical store 与 repository 语义。当前模块不写完整 store 行、不写 repository semantic table、不写 transaction boundary 表,也不进入 read/projection、maintenance/job、idempotency/replay、outbound/handoff 的完整契约。

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm |
| 当前允许 | 思考 `MethodAssetTraceMaterial`、`ConsumptionImpactSummary`、`MethodAssetAuditTrail`、`MethodAssetEvidenceLineage`、`ConsistencyProtectionPolicy`、`RelationIntegrityRule` 的持久化归属、append/support/judgement 边界、body-free 红线、version / marker 来源和 `R11.12` 写入边界。 |
| 当前禁止 | 写完整 logical store rows、repository semantic rows、transaction boundary rows、一致性策略 rows、error taxonomy、config key、test case schema、implementation code 或正式 `03-详细设计.md`。 |

### 2. trace/audit/lineage/impact 继续收口思考

| family | current boundary question | likely persistence direction | watch point |
|---|---|---|---|
| trace material | trace material 是可刷新 support material,还是 query 临时拼装 | versioned material row;exact read + trace subject lookup/page + source/freshness helper | subject ref、source cursor、freshness marker 必须来自 Step 6/7/9/10 正式来源,不得从 raw log/string 推断 |
| impact summary | impact summary 是否作为本地 support summary owner | versioned support summary row;exact read + impact source lookup + pending/unknown page | unknown/pending 必须显式保留,不得用投递成功、read receipt 或下游运行态压成 no-effect |
| audit trail | audit trail 是 append-only support aggregate 还是 raw audit stream | trail aggregate row with append-only entry refs;exact read + audit subject lookup/page | raw audit entry stream、telemetry payload、request/response body 和敏感字段不得入仓 |
| evidence lineage | lineage 是 body-free graph 还是 evidence/archive store | lineage support graph row;exact read + trace subject lookup + linked external/basis page | 只能连接 external summary、basis summary、trace material、audit trail refs,不得保存 evidence body/archive body/report body/path |
| consistency protection policy | policy judgement 是否需要 standalone durable store | marker-only / stored decision copy;R11.12 判断是否落在 impact/protection result shell | policy 不执行 recovery,也不保存 recovery plan body |
| relation integrity rule | integrity judgement 是否属于 relation truth 还是独立 marker | marker-only / relation-linked decision summary;R11.12 判断是否由 relation store 或 stored result 承接 | 不重复 relation lifecycle,不保存 rule matrix、graph algorithm 或 synthetic violation reason |

### 3. repository / policy 边界思考

| Step 7 source | 可用于 R11.12 的内容 | 不能做的事 |
|---|---|---|
| `MethodAssetTraceMaterialRepository` | `MethodAssetTraceMaterialRef` exact read、`trace_subject_ref` lookup/page、source-object/freshness helper、versioned material save。 | 顺带追加 audit trail、生成 safe diagnostic、修复 source truth 或读取 raw log/evidence body。 |
| `ConsumptionImpactSummaryRepository` | `ConsumptionImpactSummaryRef` exact read、`impact_source_ref` lookup、pending/unknown page、versioned support summary save。 | 把 unknown/pending 折叠成 no-effect、扫描下游 runtime truth 或用 publication success 推导 impact。 |
| `MethodAssetAuditTrailRepository` | `MethodAssetAuditTrailRef` exact read、`audit_subject_ref` lookup、subject page、versioned trail save。 | 保存 raw audit stream、telemetry detail、request body、stack trace、secret 或 PII 明文。 |
| `MethodAssetEvidenceLineageRepository` | `MethodAssetEvidenceLineageRef` exact read、`trace_subject_ref` lookup、external/basis linked page、versioned lineage save。 | 作为 evidence archive / report store,或从 file path / provider id / archive path 推 lineage identity。 |
| `MethodAssetPolicyDiagnosticBuilderPort` | 装配 consistency protection、relation integrity、guard/rule 的 body-free diagnostic summary。 | 让 repository 或 query service 自行拼 judgement marker、暴露 raw rule matrix 或读取外部正文。 |
| `MethodAssetRelationRepository` | relation exact read 与 relation truth save 已在 core/peripheral 族承接;可作为 integrity diagnostic 输入。 | 在 integrity rule 中重复 relation truth lifecycle 或让 integrity marker 修改 definition/version truth。 |

### 4. 与 Step 10 状态主语的对应思考

| Step 10 裁剪 | 持久化思考 | R11.12 写入方向 |
|---|---|---|
| `MethodAssetTraceMaterial` 是完整状态矩阵主语 | `Organized` / `Partial` / `Stale` / `Unavailable` 需要 versioned material row 承载 source cursor、freshness marker 和 safe summary。 | 写 trace material logical store 与 repository 语义。 |
| `ConsumptionImpactSummary` 是完整状态矩阵主语 | `KnownImpact` / `UnknownImpact` / `PendingDownstreamSummary` / `NoKnownEffect` / `DispositionMarked` / `Superseded` 需要 versioned summary row 承载 impact kind 和 disposition marker。 | 写 impact summary logical store 与 repository 语义。 |
| `MethodAssetAuditTrail` 是 append-only support boundary | trail owner 可 versioned,entry refs 必须 append-only;不定义 raw entry stream lifecycle。 | 写 audit trail aggregate 与 append-only entry-ref 规则。 |
| `MethodAssetEvidenceLineage` 是 support graph boundary | lineage graph versioned save;linked refs 可 partial/unavailable,但不保存 body。 | 写 lineage support graph store 与 linked page 规则。 |
| `ConsistencyProtectionPolicy` 是 judgement boundary | protection decision 可作为 safe decision marker / stored result / report 输入,不应创建 recovery state。 | 写 marker-only / excluded 裁决与 watch。 |
| `RelationIntegrityRule` 是 judgement boundary | integrity diagnostic 可作为 relation-linked marker 或 stored result,不应重复 relation truth。 | 写 marker-only / excluded 裁决与 watch。 |

### 5. R11.12 写入边界思考

`R11.12` 应该写:

1. trace/audit/lineage/impact 的 logical store / marker / excluded 行。
2. `MethodAssetTraceMaterialRepository`、`ConsumptionImpactSummaryRepository`、`MethodAssetAuditTrailRepository`、`MethodAssetEvidenceLineageRepository` 的持久化语义。
3. `ConsistencyProtectionPolicy` 与 `RelationIntegrityRule` 是否落 standalone marker 的裁决。
4. audit trail append-only entry refs、lineage support graph、impact unknown/pending、trace freshness / cursor 的 body-free 约束。
5. watch / blocker: subject ref 来源、freshness marker 来源、safe audit reason 来源、degraded/partial marker 来源、protection/integrity decision 存放位置。

`R11.12` 不应该写:

- read/projection、maintenance/job、idempotency/replay、outbound/handoff 的完整契约。
- transaction boundary、一致性策略、error taxonomy、config key、test case schema、implementation code。
- raw audit stream、telemetry payload、evidence/archive/report body、recovery algorithm、rule matrix 或 downstream runtime truth。

### 6. watch / blocker 预判

| id | topic | issue | R11.11 handling |
|---|---|---|---|
| ML-D03-S11-WATCH-012 | trace subject / audit subject 来源 | Step 6 要求 typed subject refs,Step 9 多个 flow 要求 subject lookup/page;实现侧不得从 route、raw id、log line 或 path 推 subject。 | R11.12 必须显式绑定 subject lookup 与 repository 语义。 |
| ML-D03-S11-WATCH-013 | trace freshness marker | Trace state 依赖 freshness marker;缺正式来源时不能把 refresh job 成功当 freshness。 | R11.12 必须记录 freshness marker source watch。 |
| ML-D03-S11-WATCH-014 | audit append-only 与 raw stream 分离 | Step 7 只闭合 trail aggregate,raw entry stream / observability payload 后移。 | R11.12 只能写 entry refs append-only,不写 raw stream schema。 |
| ML-D03-S11-WATCH-015 | lineage linked ref partial / unavailable marker | Lineage query 缺 linked ref 时需要 degraded/partial marker,但 marker 来源必须来自正式 mapper/source。 | R11.12 只记录 marker copy rule和 Step 12/15 watch。 |
| ML-D03-S11-WATCH-016 | protection / integrity decision 持久化位置 | Policy/rule 是 judgement boundary,不是明显 repository owner。 | R11.12 不发明 policy repository;只裁决 marker-only / stored-result / relation-linked watch。 |

### 7. R11.11 stop-review

| 检查项 | 结果 |
|---|---|
| 是否只思考 trace/audit/lineage/impact 持久化边界 | pass |
| 是否区分 material、support summary、append-only trail、lineage graph 与 policy judgement | pass |
| 是否明确 no raw log / no telemetry payload / no evidence body / no rule matrix | pass |
| 是否明确 R11.12 写入边界 | pass |
| 是否未写完整 store rows / repository rows | pass |
| 是否未修改正式 `03-详细设计.md` | no |

next_allowed_action: 等待用户确认后进入 Step 11 `R11.12 trace/audit/lineage/impact 持久化契约:再写入`;只允许写入 trace/audit/lineage/impact 的 logical store / marker / excluded 行、repository 持久化语义、append-only / body-free 约束、watch / blocker 和 `R11.13` 进入门禁;不得直接修改正式 `03-详细设计.md`;不得写 read/projection、maintenance/job、idempotency/replay、outbound/handoff 的完整 contract、transaction boundary 表、一致性策略表、error taxonomy、config key、test case schema 或 implementation code。

---

## R11.12 trace/audit/lineage/impact 持久化契约:再写入

### 1. 当前模块目标

`R11.12` 将 `R11.11` 的 trace/audit/lineage/impact 思考落成可审计的 logical store、marker / excluded 裁决和 repository 持久化语义。当前模块只覆盖 `MethodAssetTraceMaterial`、`ConsumptionImpactSummary`、`MethodAssetAuditTrail`、`MethodAssetEvidenceLineage`、`ConsistencyProtectionPolicy`、`RelationIntegrityRule` 以及相关 policy diagnostic builder 的持久化边界,不进入 read/projection、maintenance/job、idempotency/replay、outbound/handoff 的完整契约。

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm |
| 当前允许 | 写入 trace/audit/lineage/impact 的 logical store / marker / excluded 行、repository 持久化语义、append-only / body-free 约束、watch / blocker 和 `R11.13` 进入门禁。 |
| 当前禁止 | 写 read/projection、maintenance/job、idempotency/replay、outbound/handoff 的完整 contract、transaction boundary 表、一致性策略表、error taxonomy、config key、test case schema、implementation code 或正式 `03-详细设计.md`。 |

### 2. trace/audit/lineage/impact logical store 裁决

| object / boundary | logical persistence decision | primary identity | lookup / index | version / append rule | body-free rule | current closure |
|---|---|---|---|---|---|---|
| `MethodAssetTraceMaterial` | `method_asset_trace_materials` versioned support material row | `trace_material_ref` | exact read by `trace_material_ref`;lookup/page by `trace_subject_ref`;helper by source object refs and freshness marker | versioned material save;refresh replaces material state by expected version;source cursor and freshness marker must be explicit | trace subject ref, source object refs, safe summary, cursor, freshness marker and external summary refs only | closed for Step 11 persistence semantics,with freshness marker watch |
| `ConsumptionImpactSummary` | `consumption_impact_summaries` versioned support summary row | `impact_summary_ref` | exact read by `impact_summary_ref`;lookup by `impact_source_ref`;pending/unknown page by version/context helper | versioned summary save;unknown/pending/no-known-effect/disposition/supersession must remain explicit | impact source, optional material/context refs, impact kind, safe summary and optional trace material ref only | closed for Step 11 persistence semantics |
| `MethodAssetAuditTrail` | `method_asset_audit_trails` append-only support aggregate | `audit_trail_ref` | exact read by `audit_trail_ref`;lookup/page by `audit_subject_ref` | trail owner is versioned;`audit_entry_refs` append-only by source cursor;existing entry refs are never overwritten | audit subject ref, trace material refs, actor context ref, safe reason ref, entry refs and cursor only | closed for trail aggregate;raw stream excluded |
| `MethodAssetEvidenceLineage` | `method_asset_evidence_lineages` body-free lineage graph / append support row | `evidence_lineage_ref` | exact read by `evidence_lineage_ref`;lookup by `lineage_subject_ref` / `trace_subject_ref`;linked external/basis page helper | versioned lineage save;linked refs are added/superseded explicitly,not inferred from body/path | external summary refs, basis summary refs, trace material refs, audit trail ref and lineage summary only | closed for support graph,with partial marker watch |
| `ConsistencyProtectionPolicy` | no standalone policy store in this module | `policy_ref` if materialized by diagnostic/stored result | no repository lookup added in Step 11 | protection decision marker may be copied into stored result/report later;policy does not create recovery state | protected version ref, impact summary ref, trace material ref, protected context refs and safe reason only | marker-only;no policy repository invented |
| `RelationIntegrityRule` | no standalone rule store in this module | `rule_ref` if materialized by diagnostic/stored result | relation repository remains input owner;no rule repository added | integrity marker may be relation-linked or stored result later;rule does not own relation lifecycle | relation ref, endpoint definition refs, formalization requirement, distribution boundary ref and safe violation reason only | marker-only;no integrity repository invented |
| `MethodAssetPolicyDiagnosticBuilderPort` output | not persisted directly | diagnostic output has no durable identity in Step 11 | consumed by command/query/report assembly | caller may copy formal marker into existing store/result;builder itself has no save | body-free diagnostic summary, safe reason, marker and hint only | excluded from store;Step 12 / Step 15 own error/observability mapping |

### 3. repository 持久化语义

| Step 7 family | durable role | accepted read / lookup | save semantics | version / UoW rule | missing / consistency rule | explicit exclusions |
|---|---|---|---|---|---|---|
| `MethodAssetTraceMaterialRepository` | owner of local trace material rows | exact read by `trace_material_ref`;lookup/page by `trace_subject_ref`;helper by source object refs / freshness marker | save body-free trace material with expected version or create token supplied by application UoW | organize / mark / refresh branches save within their caller UoW;query branches never save | missing subject or material returns absent/degraded input for Step 12;service cannot synthesize subject/freshness from raw strings | no audit append,raw log,event payload,metric,report body,evidence body or source truth repair |
| `ConsumptionImpactSummaryRepository` | owner of impact support summary rows | exact read by `impact_summary_ref`;lookup by `impact_source_ref`;pending/unknown page by version/context | save impact summary or disposition with expected version;supersession is explicit | register / mark disposition branches save within command UoW;pending page query is read-only | missing impact source remains absent/pending;unknown/pending cannot be folded into no-effect | no downstream runtime scan,no marketplace/process truth,no read receipt or publication success as impact proof |
| `MethodAssetAuditTrailRepository` | owner of audit trail aggregate and safe entry refs | exact read by `audit_trail_ref`;lookup/page by `audit_subject_ref` | create/load trail owner and append safe entry refs;append requires source cursor and expected owner version | append is same-UoW with accepted command/inbound/job audit side effect when required;raw stream remains outside this repository | missing audit subject is absent/degraded for Step 12;existing entry refs cannot be rewritten or deleted | no raw audit stream,telemetry detail,stack trace,request/response body,secret or PII plaintext |
| `MethodAssetEvidenceLineageRepository` | owner of body-free lineage graph rows | exact read by `evidence_lineage_ref`;lookup by `lineage_subject_ref` / `trace_subject_ref`;linked external/basis page helper | save linked refs and lineage summary with expected version;partial/unavailable markers are copied,not synthesized | link commands save lineage within command UoW;query branches are read-only | missing linked ref remains partial/degraded input;identity cannot be inferred from file path/provider/archive path | no evidence archive,artifact/archive body,provider payload,report body or object storage path |
| `MethodAssetPolicyDiagnosticBuilderPort` | non-durable diagnostic builder for protection/integrity | consumes impact/trace/relation/support inputs and domain policy/rule | no save | no UoW ownership | insufficient input returns safe pending/rejected diagnostic for Step 12 | no rule matrix persistence,no recovery execution,no query-side marker fabrication |
| `MethodAssetRelationRepository` as integrity input | relation truth owner already covered by core/peripheral persistence | exact relation read and endpoint lookup only as diagnostic input | relation save remains relation family responsibility | integrity marker cannot mutate relation lifecycle through policy builder | missing endpoint/formalization input stays pending/rejected diagnostic | no graph algorithm body,no runtime dependency graph,no synthetic violation reason |

### 4. append-only / body-free 约束

| item | persistence rule | prohibited shortcut |
|---|---|---|
| trace source cursor | cursor must be explicit field on trace material save | treating job success,latest timestamp or page cursor as trace cursor |
| trace freshness marker | freshness marker must be copied from formal source/mapper | inferring freshness from refresh completion or query read success |
| impact unknown / pending | unknown and pending are durable impact kinds | converting unknown to no-effect from delivery/read receipt/publication success |
| impact disposition | disposition marker must come from formal diagnostic builder | service-generated safe reason from error text or downstream state |
| audit entry refs | append-only ref set with cursor;historical refs are immutable | overwriting/deleting entries or storing raw audit event body |
| audit subject | formal typed `MethodAssetAuditSubjectRef` only | deriving subject from log string,route,SQL key,request body or stack trace |
| lineage linked refs | only typed external/basis/trace/audit refs are linked | deriving lineage from file path,object store path,provider id or archive body |
| partial/degraded markers | copy formal degraded/partial marker only | synthesizing marker from missing linked ref text |
| protection/integrity judgement | store/copy marker only where an existing result/store owner exists | creating policy/rule table or storing recovery plan/rule matrix |

### 5. marker / excluded 裁决

| candidate | current decision | reason | later closure target |
|---|---|---|---|
| `ConsistencyProtectionPolicy` standalone row | excluded from current trace/audit/lineage/impact store | Step 7 has policy diagnostic builder,not policy repository;policy is judgement boundary and recovery input,not state owner. | R11.17 stored replay/report or R11.21 transaction audit may decide where accepted protection decision is copied. |
| `RelationIntegrityRule` standalone row | excluded from current trace/audit/lineage/impact store | Relation truth repository owns relation lifecycle;rule only emits safe diagnostic/violation marker. | Relation family or stored result may carry relation-linked marker;no rule repository in Step 11. |
| raw audit entry stream | excluded | Current repository owns trail aggregate and entry refs only. | Step 15 may define observability payload mapping,without changing persistence truth. |
| evidence/archive/report body | excluded | Lineage graph stores typed refs and summary only. | Never enters lineage store;safe marker/report shell may be handled by later report/evidence steps. |
| recovery plan / repair algorithm | excluded | Protection decision does not execute recovery or repair truth. | Maintenance/recovery job family later owns recovery issue/report shell. |
| graph algorithm / rule matrix | excluded | Integrity diagnostic is body-free safe summary. | Step 12 may define safe error/rejection code,not raw rule details. |

### 6. watch / blocker 台账

| id | topic | issue | current handling | required closure |
|---|---|---|---|---|
| ML-D03-S11-WATCH-012 | trace subject / audit subject 来源 | Subject refs must be formal typed refs;route/raw id/log/path inference is forbidden. | Repository lookup rows require formal subject refs and do not define subject mapper. | Step 12/15 must preserve degraded/observability marker source;implementation cannot add private subject mapper. |
| ML-D03-S11-WATCH-013 | trace freshness marker | Trace material needs `freshness_marker_ref`,but refresh success alone is not a marker. | Treat freshness marker as explicit save input copied from formal source/mapper. | If Step 12/15 adds stale/degraded mapping,it must not synthesize marker from job success. |
| ML-D03-S11-WATCH-014 | audit append-only vs raw stream | Audit trail aggregate is closed;raw entry stream / telemetry schema is not. | Persist only safe entry refs and cursor. | Step 15 observability may map telemetry,not rewrite Step 11 trail schema. |
| ML-D03-S11-WATCH-015 | lineage partial/degraded marker | Missing linked refs require safe partial/degraded marker. | Record copy-only rule;do not synthesize marker in repository. | Step 12 degraded/error mapping must define formal marker source before implementation. |
| ML-D03-S11-WATCH-016 | protection / integrity decision placement | Policy/rule lack standalone repository. | Marker-only/excluded;decision copies must use stored result/report/relation-linked owner later. | R11.17/R11.21 or Step 12 must close exact decision replay/report surface if needed. |

### 7. R11.12 stop-review

| 检查项 | 结果 |
|---|---|
| 是否写入 trace/audit/lineage/impact logical store / marker / excluded 行 | pass |
| 是否写入四个 repository 的持久化语义 | pass |
| 是否保留 policy/rule judgement boundary,未发明 repository | pass |
| 是否写入 append-only / body-free 约束 | pass |
| 是否记录 subject、freshness、audit raw stream、lineage marker、decision placement watch | pass |
| 是否越界进入 read/projection、job、replay、outbound/handoff 完整契约 | no |
| 是否修改正式 `03-详细设计.md` | no |

next_allowed_action: 等待用户确认后进入 Step 11 `R11.13 read/projection/material freshness 持久化契约:先思考`;只允许思考 read/projection/material freshness 的持久化契约和 `R11.14` 写入边界;不得直接修改正式 `03-详细设计.md`;不得写 maintenance/job、idempotency/replay、outbound/handoff 的完整 contract、transaction boundary 表、一致性策略表、error taxonomy、config key、test case schema 或 implementation code。

---

## R11.13 read/projection/material freshness 持久化契约:先思考

### 1. 当前模块目标

`R11.13` 只思考 read/projection/material freshness 族如何在 `R11.14` 落成可审计的 logical store、marker / excluded 裁决和 repository 语义。当前模块不写完整 store 行、不写 repository semantic table、不写 transaction boundary 表,也不进入 maintenance/job、idempotency/replay、outbound/handoff 的完整契约。

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm |
| 当前允许 | 思考 `MethodAssetReadDecision`、`MethodAssetDegradedDecision`、`MethodAssetConsumptionMaterial` freshness、`DistributionReadMaterial` builder output、catalog / availability / trace / external / package / assembly view shell、freshness / availability marker 的持久化归属、query no-write 边界、copy-only marker 来源和 `R11.14` 写入边界。 |
| 当前禁止 | 写完整 logical store rows、repository semantic rows、transaction boundary rows、一致性策略 rows、error taxonomy、config key、test case schema、implementation code 或正式 `03-详细设计.md`。 |

### 2. read/projection/material freshness 继续收口思考

| family | current boundary question | likely persistence direction | watch point |
|---|---|---|---|
| `MethodAssetReadDecision` | Query read decision 是否 durable | query-local marker / optional stored surface copy;regular Query cannot save | Query no-write means read decision repository save is forbidden unless another owner such as stored result/report explicitly persists a copy |
| `MethodAssetDegradedDecision` | degraded decision 是否 durable | marker-only / copied surface;not a truth store | degraded kind/marker must come from resolver/mapper/material source,not error text |
| consumption material freshness | consumption material truth 已在 R11.8/R11.12 关联,但 freshness / availability 是读侧边界 | versioned material row carries freshness/cursor;availability resolver output is copied,not saved as truth | repository cannot decide availability fallback or create material in Query |
| `DistributionReadMaterial` | builder output 是本地 material store 还是 transient read surface | builder output likely excluded from standalone durable store until Step 7/9 gives material save owner | relation repository cannot generate/save distribution material;builder cannot read marketplace listing/body |
| public view shell | catalog / availability / trace / external / package / assembly view 是否拥有 store | view shell is public surface / derived read boundary,not truth owner | no catalog/search index/projection table may be invented without Step 7 repository or builder save face |
| freshness / availability marker | marker 是否作为独立 store | marker input only;copied into material/view/read decision surface | timestamp,cache hit,page cursor,job success or fake flag cannot become freshness |
| page cursor / ordering | page helper cursor 是否持久化为 projection cursor | query page cursor is opaque read paging,not optimistic version or material freshness | cursor cannot substitute version/freshness/checkpoint |

### 3. Step 7 / Step 9 输入边界思考

| input source | R11.14 可用内容 | R11.14 不能做的事 |
|---|---|---|
| `MethodAssetConsumptionMaterialRepository` | exact read、formal version/context resolution、page helper、freshness / cursor helper、versioned material save。 | 顺带做 availability policy、Query fallback creation、下游 runtime scan 或 boundary re-decision。 |
| `MethodAssetQueryReadResolverPort` | read subject、read source、scope/visibility/boundary/freshness resolution summary。 | 从 route/raw id/private map/string 前缀推 subject/marker,或拼 public DTO。 |
| `MethodAssetDegradedDecisionMapperPort` | degraded kind、marker ref、safe diagnostic ref、follow-up hint ref 的 body-free mapping summary。 | 从 `ApplicationError` 文本、stack trace、SQL/HTTP detail、provider body 分类,或触发 repair/retry/job。 |
| `MethodAssetConsumptionAvailabilityResolverPort` | ready / stale / unavailable / boundary constrained availability summary。 | 创建 material、扫描 downstream runtime truth、修改 boundary/formal version truth。 |
| `DistributionReadMaterialBuilderPort` | relation/distribution/context refs 到 body-free distribution material summary。 | 修改 relation truth、进入 publisher/handoff、读取 package body/marketplace listing。 |
| page / version helper | opaque page cursor、page ordering、version wrapper。 | 用 cursor 替代 optimistic version、freshness marker、checkpoint 或 durable projection cursor。 |
| read refresh job outputs | refresh output 可作为 freshness/material marker 输入。 | 在 R11.14 写 job task/report/checkpoint persistence;该内容属于 R11.15/R11.16。 |

### 4. 与 Step 10 状态主语的对应思考

| Step 10 裁剪 | 持久化思考 | R11.14 写入方向 |
|---|---|---|
| `MethodAssetReadDecision` 是 read disposition owner | found / safe absent / not visible / stale visible / degraded / unavailable 是 Query 判断壳。 | 写 marker-only / query-local 裁决;不允许 Query 持久化决策。 |
| `MethodAssetDegradedDecision` 是 degraded decision boundary | stale / partial / context-limited / unavailable / invalid-safe-material 只复制 mapper 输出。 | 写 degraded marker copy-only 与 excluded store 裁决。 |
| consumption material freshness / availability boundary | material row 可有 freshness/cursor,availability resolver 解释 existing material。 | 写 material freshness 持久化约束,并避免重复 R11.8 truth store。 |
| `DistributionReadMaterial` 是 builder-output boundary | relation repo 只给锚点,builder 生成 body-free material。 | 写 builder output excluded/reserved watch,不发明 material repository。 |
| public view shell freshness boundary | view shell 只表达 readable/stale/partial/unavailable/empty。 | 写 view shell excluded / derived surface 规则,不建 view truth store。 |
| marker-source table | freshness/availability/degraded/page cursor 有不同来源。 | 写 marker redline: freshness != cursor != checkpoint != cache hit。 |

### 5. R11.14 写入边界思考

`R11.14` 应该写:

1. read/projection/material freshness 的 logical store / marker / excluded 行。
2. `MethodAssetReadDecision`、`MethodAssetDegradedDecision` 的 marker-only / query-local 持久化裁决。
3. `MethodAssetConsumptionMaterialRepository` 在 freshness / cursor / availability 读取上的持久化语义补充,不重复 R11.8 truth store。
4. `DistributionReadMaterialBuilderPort`、view shell、read resolver、degraded mapper、availability resolver 的 non-durable / copy-only 裁决。
5. freshness / availability / degraded / page cursor / checkpoint 的 redline 和 watch / blocker。

`R11.14` 不应该写:

- maintenance/job/report、idempotency/replay、outbound/handoff 的完整契约。
- transaction boundary、一致性策略、error taxonomy、config key、test case schema、implementation code。
- read material refresh task、checkpoint、progress view、job report 的持久化语义。
- catalog/search/projection table、distribution material table 或 view repository,除非 Step 7 已有正式 save owner。

### 6. watch / blocker 预判

| id | topic | issue | R11.13 handling |
|---|---|---|---|
| ML-D03-S11-WATCH-017 | Query no-write vs read decision durability | Step 6 有 `MethodAssetReadDecision`,但 Step 9 Query 明确 no-write。 | R11.14 必须把 query-local decision 与 durable stored copy 分开。 |
| ML-D03-S11-WATCH-018 | distribution material persistence owner | Step 7 有 `DistributionReadMaterialBuilderPort`,但没有 standalone material repository save owner。 | R11.14 不发明 distribution material table;记录 reserved/excluded。 |
| ML-D03-S11-WATCH-019 | public view shell store owner | view shell 是 public surface,不是 truth;Step 7 没有 catalog/package/assembly view save repository。 | R11.14 应排除 view truth store,只允许 derived surface/copy marker。 |
| ML-D03-S11-WATCH-020 | freshness marker source | freshness marker must be formal material/view/builder/refresh output;timestamp/cache/page cursor/job success 都不合法。 | R11.14 写 marker redline,缺 marker 交 Step 12/15。 |
| ML-D03-S11-WATCH-021 | page cursor / checkpoint 混用 | Query page cursor、optimistic version、material freshness、job checkpoint 是不同语义。 | R11.14 明确 page cursor 不进入 freshness/transaction/replay 语义。 |

### 7. R11.13 stop-review

| 检查项 | 结果 |
|---|---|
| 是否只思考 read/projection/material freshness 持久化边界 | pass |
| 是否区分 query-local decision、material freshness、builder output、view shell 与 marker input | pass |
| 是否明确 Query no-write 和 marker copy-only | pass |
| 是否明确 R11.14 写入边界 | pass |
| 是否未写完整 store rows / repository rows | pass |
| 是否未修改正式 `03-详细设计.md` | no |

next_allowed_action: 等待用户确认后进入 Step 11 `R11.14 read/projection/material freshness 持久化契约:再写入`;只允许写入 read/projection/material freshness 的 logical store / marker / excluded 行、repository / resolver / builder 持久化边界、copy-only marker 约束、watch / blocker 和 `R11.15` 进入门禁;不得直接修改正式 `03-详细设计.md`;不得写 maintenance/job、idempotency/replay、outbound/handoff 的完整 contract、transaction boundary 表、一致性策略表、error taxonomy、config key、test case schema 或 implementation code。

---

## R11.14 read/projection/material freshness 持久化契约:再写入

### 1. 当前模块目标

`R11.14` 将 `R11.13` 的 read/projection/material freshness 思考落成可审计的 logical store、marker / excluded 裁决和 repository / resolver / builder 持久化边界。当前模块只覆盖 Query read decision、degraded decision、consumption material freshness、distribution builder output、view shell、freshness / availability marker 和 page cursor 红线,不进入 maintenance/job、idempotency/replay、outbound/handoff 的完整契约。

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm |
| 当前允许 | 写入 read/projection/material freshness 的 logical store / marker / excluded 行、repository / resolver / builder 持久化边界、copy-only marker 约束、watch / blocker 和 `R11.15` 进入门禁。 |
| 当前禁止 | 写 maintenance/job、idempotency/replay、outbound/handoff 的完整 contract、transaction boundary 表、一致性策略表、error taxonomy、config key、test case schema、implementation code 或正式 `03-详细设计.md`。 |

### 2. read/projection/material freshness logical store 裁决

| object / boundary | logical persistence decision | primary identity | lookup / index | version / marker rule | body-free rule | current closure |
|---|---|---|---|---|---|---|
| `MethodAssetReadDecision` | no standalone durable store for regular Query | `read_decision_ref` is query-local unless copied by another durable owner | no repository lookup added in Step 11 | marker-only;Query service may assemble but must not save | read subject, read source, visibility/boundary, material freshness refs only | excluded from store;stored copy deferred to stored-result/report family if needed |
| `MethodAssetDegradedDecision` | no standalone durable store for regular Query | `degraded_decision_ref` is query-local unless copied by another durable owner | no repository lookup added in Step 11 | marker-only;degraded marker copied from mapper/resolver/material source | degraded kind, marker, safe diagnostic, partial marker and follow-up hint only | excluded from store;Step 12/15 own mapping and observability |
| `MethodAssetConsumptionMaterial` freshness fields | existing `method_asset_consumption_materials` row carries freshness/cursor semantics | `consumption_material_ref` | exact read;formal version/context lookup;page by context/version | versioned material save already closed;freshness/cursor are explicit material fields,not resolver output | formal version refs, context refs, boundary refs, material summary, freshness/cursor only | supplemental closure;does not reopen R11.8 truth store |
| `DistributionReadMaterial` builder output | no standalone durable material store in current Step 7 | no stable durable material identity defined | builder consumes relation/distribution/context refs | builder output is transient/read surface unless later Step adds save owner | body-free distribution summary only | excluded / reserved;no material repository invented |
| catalog / availability / trace / external / package / assembly view shell | no view truth store in this module | public view refs are protocol/read surface refs,not persistence owner | assembled from truth/material repositories, resolver and builder outputs | freshness/availability marker copied into surface;view shell has no save | safe summary, refs, marker and page cursor only | excluded from store;view shell not truth |
| freshness / availability marker | marker input only | marker ref supplied by material/builder/resolver/refresh output | no marker repository | copied into read decision / public surface only | marker refs only | excluded from standalone store |
| page cursor / ordering | query-local paging support | opaque cursor from page/version helper | page helper controls cursor | cursor is not version,checkpoint or freshness | opaque cursor only | excluded from material freshness and transaction semantics |

### 3. repository / resolver / builder 持久化边界

| Step 7 family | durable role | accepted read / lookup | save semantics | copy-only rule | explicit exclusions |
|---|---|---|---|---|---|
| `MethodAssetConsumptionMaterialRepository` | owner of consumption material row already covered by R11.8 | exact read;formal version/context resolution;context/version page;freshness/cursor helper | versioned material save only in command/job owner flows,not Query | Query copies loaded freshness/cursor;availability resolver explains loaded material | no availability policy save;no Query fallback creation;no downstream runtime scan;no boundary re-decision |
| `MethodAssetQueryReadResolverPort` | non-durable read resolution provider | consumes typed selector, loaded subject/source refs and formal marker inputs | no save | returns read subject/source/scope/visibility/freshness summary for Query assembly | no DTO persistence;no subject inference from route/raw id/private map/string |
| `MethodAssetDegradedDecisionMapperPort` | non-durable degraded mapping provider | consumes read decision, availability, freshness/partial marker and safe diagnostic inputs | no save | returns degraded kind, marker, diagnostic and hint for Query/stored surface copy | no raw error text,stack trace,SQL/HTTP detail or provider body classification |
| `MethodAssetConsumptionAvailabilityResolverPort` | non-durable availability interpreter | consumes formal version/context/existing material/boundary judgement | no save | returns ready/stale/unavailable/constrained summary copied by read surface | no material creation;no downstream scan;no boundary/formal version mutation |
| `DistributionReadMaterialBuilderPort` | non-durable builder in current design | consumes relation/distribution/context refs and safe availability marker | no save owner defined | returns body-free distribution material summary for Query assembly | no relation truth write;no publisher/handoff;no package body;no marketplace listing |
| page / version helper | non-durable query helper | provides opaque cursor/order and version wrapper where applicable | no save | cursor copied only to page surface | cursor does not replace optimistic version,material freshness,job checkpoint or replay key |

### 4. copy-only marker / cursor redline

| item | persistence rule | prohibited shortcut |
|---|---|---|
| read decision | Query-local unless explicitly copied by stored result/report owner | saving `MethodAssetReadDecision` from normal Query |
| degraded decision | copied from degraded mapper output | deriving degraded kind from error text,SQL/HTTP code,stack trace or provider body |
| freshness marker | copied from loaded material/view/builder/refresh output | timestamp,cache hit,page cursor,job success,fake flag |
| availability marker | copied from availability resolver / adapter availability summary | downstream runtime state,request body,UI state,delivery success |
| page cursor | opaque page helper output | optimistic version,freshness marker,checkpoint,replay cursor |
| distribution material | builder output only | relation repository generating material or storing package/listing body |
| view shell | response surface only | creating catalog/search/view truth table from public DTO shape |
| read material refresh output | marker input only in this module | writing task/report/checkpoint persistence before R11.15/R11.16 |

### 5. marker / excluded 裁决

| candidate | current decision | reason | later closure target |
|---|---|---|---|
| `method_asset_read_decisions` durable table | excluded for regular Query | Query no-write forbids persistence side effect;Step 7 has no read decision repository. | R11.17 stored replay/report family may copy accepted/stored surfaces if needed. |
| `method_asset_degraded_decisions` durable table | excluded for regular Query | Degraded decision is mapper output,not truth owner. | Step 12 defines degraded/error surface;Step 15 defines safe observability mapping. |
| `distribution_read_materials` durable table | reserved / excluded | Step 7 provides builder but no save/list repository owner. | If later required, Step 7/11 must add formal material store owner before implementation. |
| catalog/search/projection view tables | excluded | View shells are public/read surfaces,not truth;no Step 7 view repository save face. | R11.15 job/progress may report refresh,not create view truth here. |
| freshness marker table | excluded | Marker is copied from formal source;standalone marker store would create source ambiguity. | Step 12/15 may define marker value mapping/observability,not store ownership. |
| page cursor store | excluded | Query cursor is opaque paging support. | Job checkpoints and replay cursors are handled in later families. |

### 6. watch / blocker 台账

| id | topic | issue | current handling | required closure |
|---|---|---|---|---|
| ML-D03-S11-WATCH-017 | Query no-write vs read decision durability | `MethodAssetReadDecision` exists, but regular Query cannot write. | Exclude standalone table;allow only query-local or later copied stored surface. | Stored result/report family must explicitly define copy owner before any durable read decision artifact. |
| ML-D03-S11-WATCH-018 | distribution material persistence owner | Builder exists, but no standalone material repository save/list owner. | Mark `DistributionReadMaterial` store as reserved/excluded. | Step 7/11 backfill required before implementation persists distribution material. |
| ML-D03-S11-WATCH-019 | public view shell store owner | View shells have no save repository and must not become truth. | Exclude catalog/search/view truth tables. | Any projection/view persistence must be formally added before implementation. |
| ML-D03-S11-WATCH-020 | freshness marker source | Freshness marker cannot be inferred from runtime/cache/page/job success. | Copy-only redline recorded. | Step 12/15 must preserve marker source and degraded mapping. |
| ML-D03-S11-WATCH-021 | page cursor / checkpoint separation | Cursor, version, freshness, checkpoint and replay cursor are distinct. | Page cursor excluded from material freshness and transaction semantics. | R11.15/R11.17/R11.21 must keep checkpoint/replay/transaction cursors separate. |

### 7. R11.14 stop-review

| 检查项 | 结果 |
|---|---|
| 是否写入 read/projection/material freshness logical store / marker / excluded 行 | pass |
| 是否保持 Query no-write,未给 read/degraded decision 发明 repository | pass |
| 是否补充 consumption material freshness / cursor 的 repository 边界且未重复 truth store | pass |
| 是否排除 distribution material、view shell、freshness marker、page cursor 的不合法持久化 | pass |
| 是否记录 freshness / availability / degraded / cursor redline 和 watch | pass |
| 是否越界进入 maintenance/job、replay、outbound/handoff 完整契约 | no |
| 是否修改正式 `03-详细设计.md` | no |

next_allowed_action: 等待用户确认后进入 Step 11 `R11.15 maintenance/job/report 持久化契约:先思考`;只允许思考 maintenance/job/report 的持久化契约和 `R11.16` 写入边界;不得直接修改正式 `03-详细设计.md`;不得写 idempotency/replay、outbound/handoff 的完整 contract、transaction boundary 表、一致性策略表、error taxonomy、config key、test case schema 或 implementation code。

---

## R11.15 maintenance/job/report 持久化契约:先思考

### 1. 当前模块目标

`R11.15` 只思考 maintenance/job/report 族在 `R11.16` 中应如何落成可审计的 logical store、repository semantic、checkpoint / report boundary 和 excluded 裁决。当前模块不写最终 store rows、repository semantic rows、transaction boundary rows,也不进入 idempotency/replay、outbound/handoff 的完整契约。

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm |
| 当前允许 | 思考 `ReadMaterialRefreshTask`、`TraceMaterialRefreshTask`、`ConsistencyRecoveryTask`、`MaintenanceProgressView`、`MaintenanceRunHistory`、`MethodAssetJobCheckpointStorePort`、`MethodAssetRecoveryIssue`、job report / result boundary、jobs entry-local state 的持久化归属和 `R11.16` 写入边界。 |
| 当前禁止 | 写最终 logical store rows、repository semantic rows、transaction boundary rows、一致性策略 rows、idempotency / replay schema、outbound / handoff store、error taxonomy、config key、test case schema、implementation code 或正式 `03-详细设计.md`。 |

### 2. maintenance/job/report 输入来源思考

| 输入来源 | 本模块可使用内容 | 本模块不能做的事 |
|---|---|---|
| Step 6 object contracts | `MethodAssetJobAssemblyContext`、`MethodAssetJobRunnerContext`、`MethodAssetOperationJobEntry`、`MethodAssetJobProgressAssemblyState`、`MethodAssetJobEntryResultState` 和 body-free report / checkpoint / progress refs。 | 给这些 helper 发明 scheduler / queue / lease / process 状态,或保存 report body、raw log、metrics body。 |
| Step 7 port family | `MethodAssetMaintenanceTaskRepository`、`MethodAssetMaintenanceProgressViewRepository`、`MethodAssetMaintenanceRunHistoryRepository`、`MethodAssetJobCheckpointStorePort`、`MethodAssetRecoveryIssueRepository`。 | 新增未闭口 repository,或让 repository 顺带拥有 target planning、retry、publisher outcome、handoff outcome。 |
| Step 8 protocol shell | job input/result/report shell、maintenance progress / task / run history query shell、report boundary shell。 | 从 protocol DTO 反向创建 truth store,或保存完整 markdown / JSON report body。 |
| Step 9 flows | maintenance request commands seed task/run/progress;8 个 Operations Job 加载 task/checkpoint、刷新派生材料或 recovery issue、保存 progress/checkpoint/run history/report。 | 把 request command 当成立即执行 job body,或让 job repair definition/catalog/formal version/relation truth。 |
| Step 10 state matrix | task truth、progress view、run history/report boundary、checkpoint/resume、recovery issue、job progress assembly、job entry result 已拆开。 | 用 progress / run history / checkpoint / job-local result 反推 task truth 或 business truth completed。 |

### 3. boundary 分层思考

| boundary | 持久化思考 | R11.16 写入方向 | redline |
|---|---|---|---|
| maintenance task truth | `ReadMaterialRefreshTask`、`TraceMaterialRefreshTask`、`ConsistencyRecoveryTask` 需要 durable shell、run/scope/kind stable lookup 和 versioned state save。 | 写 task truth logical rows 与 task repository 持久化语义。 | 不保存 worker queue、retry、lease、thread lifecycle、scheduler status。 |
| progress view | `MaintenanceProgressView` 是 Query / report 可见 projection,复制 task、checkpoint、issue、job result summary。 | 写 progress view projection / replace-by-version 语义和 no task-truth inference。 | progress 不代表 task success / closed / superseded。 |
| run history | `MaintenanceRunHistory` 记录 body-free chronology、milestone、report boundary ref、handoff hint。 | 写 run chronology / milestone append 语义。 | 不保存 report body、raw log、metrics payload、artifact body。 |
| checkpoint | `MethodAssetJobCheckpointStorePort` 保存 resume anchor、cursor continuation、partial continuation anchor。 | 写 checkpoint identity / lookup / resume summary 语义。 | checkpoint 不是 optimistic version、query page cursor、material freshness、retry count、queue offset、lease token。 |
| recovery issue | `MethodAssetRecoveryIssue` 表达 pending / blocked / intervention / linked issue surface。 | 写 recovery issue store / page / acknowledgement linkage 语义。 | issue 不证明 core truth 已修复;不保存 raw evidence、provider payload、repair script。 |
| job report / result boundary | completed / partial / blocked / failed / degraded / replayed safe result 需要可复制的 report boundary。 | 写 stored job report shell、result boundary 和 run history/report linkage。 | 只保存 boundary refs / summary / marker;不保存 markdown、JSON report body、metrics body、external response。 |
| jobs entry-local state | `MethodAssetJobRunnerContext`、`MethodAssetOperationJobEntry`、progress assembly 和 entry result state 是 local orchestration state。 | 写 excluded / runtime-local 裁决,只允许其输出被 application-owned store 复制。 | jobs entry 不成为业务 truth、scheduler state 或 direct repository owner。 |

### 4. flow 对应思考

| flow family | persistence consequence | R11.16 closure target |
|---|---|---|
| `RequestReadMaterialRefreshFlow` / `RequestTraceMaterialRefreshFlow` / `RequestConsistencyRecoveryFlow` | accepted command 创建 task/run intent、progress seed、run history start 和 stored result / event candidate hint,但不执行 job body。 | task store、progress seed、run history start 的写入 owner 分开。 |
| `MarkMaintenanceSuspendedFlow` / `RequireMaintenanceFormalInterventionFlow` / `SupersedeMaintenanceRequestFlow` | control command 只能改变 task truth / issue / run milestone,不得重放 worker task。 | task versioned state save、issue linkage、run milestone append。 |
| maintenance Query flows | `GetMaintenanceProgress*`、task summary、run history、pending scope list 均为 no-write read。 | progress / task / run history read semantics,缺失或 unavailable 只返回 safe surface。 |
| 8 个 Operations Job flows | reserve -> load task/checkpoint -> plan targets -> refresh derived material 或 recovery issue -> save progress/checkpoint/run history/report。 | job writes only derived material/progress/checkpoint/report/issue;task truth change must use task repo transition。 |
| duplicate / resume branch | duplicate 依赖 stored job report / run history / checkpoint,但具体 idempotency serialization 属 Step 13。 | R11.16 只写 stored report / checkpoint as durable surface;R11.17/R11.18 和 Step 13 闭 replay。 |
| report -> outbound / handoff | report boundary / handoff hint 可作为后续 outbound/handoff 输入。 | R11.16 只写 report boundary ref 和 hint linkage,不写 publication / handoff outcome。 |

### 5. R11.16 写入边界思考

`R11.16` 应该写:

1. maintenance task、progress view、run history、checkpoint、recovery issue、job report/result boundary 的 logical store / marker / excluded 行。
2. `MethodAssetMaintenanceTaskRepository`、`MethodAssetMaintenanceProgressViewRepository`、`MethodAssetMaintenanceRunHistoryRepository`、`MethodAssetJobCheckpointStorePort`、`MethodAssetRecoveryIssueRepository` 的持久化语义。
3. task truth vs progress view vs run history vs checkpoint vs report/result vs recovery issue 的 authority separation。
4. checkpoint / cursor / version / freshness / retry / queue lease 的 redline。
5. report boundary body-free 规则、stored report replay source 的 Step 13/15 handoff 和 watch / blocker。

`R11.16` 不应该写:

- 完整 transaction boundary / consistency strategy;该内容留给 R11.21/R11.22。
- idempotency guard、stored operation result、inbound receipt 的完整 replay schema;该内容留给 R11.17/R11.18 和 Step 13。
- event candidate / publication outcome / handoff marker 的完整 store;该内容留给 R11.19/R11.20。
- report markdown / JSON body、metrics payload、raw log、evidence artifact schema;该内容留给 Step 15/16 或正式 report artifact 设计。
- scheduler、queue、lease、retry loop、process exit、thread lifecycle、cron/config binding。

### 6. watch / blocker 预判

| id | topic | issue | R11.15 handling |
|---|---|---|---|
| ML-D03-S11-WATCH-022 | task truth vs progress/run history/report boundary | task、progress、run history、checkpoint、report/result 容易被压成一个 job state。 | R11.16 必须拆分 authority,progress/report 不反推 task truth。 |
| ML-D03-S11-WATCH-023 | checkpoint identity and resume source | checkpoint 可能被错误替换为 page cursor、version、retry count、queue offset 或 lease token。 | R11.16 写 checkpoint redline,Step 13 写 re-entry / replay。 |
| ML-D03-S11-WATCH-024 | stored job report / replay source | Step 9 duplicate 需要 stored job report,但 serialization 和 replay 并发语义后移。 | R11.16 只写 durable report shell;R11.17/R11.18/Step 13 继续闭 replay。 |
| ML-D03-S11-WATCH-025 | recovery issue is not repair proof | recovery issue / intervention / convergence report 容易被误写成 truth repaired。 | R11.16 写 issue store 只表达 safe issue / convergence surface。 |
| ML-D03-S11-WATCH-026 | report boundary no body | job report / run history 容易保存 markdown、JSON report body、raw log 或 metrics body。 | R11.16 只允许 boundary refs、summary、marker、safe reason。 |
| ML-D03-S11-WATCH-027 | jobs entry-local state persistence | jobs runner context / entry result 可能被实现成 durable business truth 或 scheduler state。 | R11.16 写 runtime-local / excluded 裁决,application-owned store 才能复制输出。 |

### 7. R11.15 stop-review

| 检查项 | 结果 |
|---|---|
| 是否只思考 maintenance/job/report 持久化边界 | pass |
| 是否拆开 task truth、progress、run history、checkpoint、report/result、recovery issue | pass |
| 是否明确 job 不修 core truth | pass |
| 是否明确 checkpoint / cursor / version / freshness / retry / lease 分离 | pass |
| 是否明确 report boundary body-free | pass |
| 是否形成 R11.16 写入边界 | pass |
| 是否未写最终 logical store / repository semantic rows | pass |
| 是否未修改正式 `03-详细设计.md` | no |

next_allowed_action: 等待用户确认后进入 Step 11 `R11.16 maintenance/job/report 持久化契约:再写入`;只允许写入 maintenance/job/report 的 logical store / marker / excluded 行、repository 持久化语义、authority separation、checkpoint / report boundary redline、watch / blocker 和 `R11.17` 进入门禁;不得直接修改正式 `03-详细设计.md`;不得写 idempotency/replay、outbound/handoff 的完整 contract、transaction boundary 表、一致性策略表、error taxonomy、config key、test case schema 或 implementation code。

---

## R11.16 maintenance/job/report 持久化契约:再写入

### 1. 当前模块目标

`R11.16` 将 `R11.15` 的 maintenance/job/report 思考落成可审计的 logical store、repository 持久化语义、authority separation、checkpoint / report boundary redline 和 watch / blocker。当前模块只覆盖 task、progress、run history、checkpoint、recovery issue、job report/result boundary 与 jobs entry-local state,不进入 idempotency/replay、outbound/handoff 的完整契约。

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm |
| 当前允许 | 写入 maintenance/job/report 的 logical store / marker / excluded 行、repository 持久化语义、authority separation、checkpoint / report boundary redline、watch / blocker 和 `R11.17` 进入门禁。 |
| 当前禁止 | 写 idempotency/replay、outbound/handoff 的完整 contract、transaction boundary 表、一致性策略表、error taxonomy、config key、test case schema、implementation code 或正式 `03-详细设计.md`。 |

### 2. maintenance/job/report logical store 裁决

| logical boundary | persistence decision | primary identity | lookup / index | version / append rule | body-free rule | current closure |
|---|---|---|---|---|---|---|
| `read_material_refresh_tasks` | durable task-run shell | `maintenance_task_ref`;`maintenance_run_ref` | run ref;refresh scope ref;task kind;state kind | create from accepted request;versioned state save through task repository | task refs,scope refs,state marker,safe reason only | enter;may be stored as one task-family store partitioned by task kind |
| `trace_material_refresh_tasks` | durable task-run shell | `maintenance_task_ref`;`maintenance_run_ref` | run ref;trace subject/scope ref;task kind;state kind | create from accepted request;versioned state save through task repository | trace subject refs,scope refs,state marker,safe reason only | enter;no raw log/evidence body |
| `consistency_recovery_tasks` | durable task-run shell | `maintenance_task_ref`;`maintenance_run_ref` | run ref;recovery scope ref;affected refs;state kind | create from accepted request;versioned state save through task repository | affected refs,safe reason,intervention marker only | enter;no repair script or raw evidence |
| `maintenance_progress_views` | durable progress projection | `progress_view_ref` | run ref;scope ref;task ref;pending issue refs | replace by version from application job/control flow | progress marker,checkpoint ref,issue refs,summary refs only | enter;not task truth |
| `maintenance_run_history` | append-only run chronology | `maintenance_run_history_ref`;`maintenance_run_ref` | run ref;scope ref;milestone kind;report boundary ref | append milestone;link report/handoff hint by ref only | milestone summary,report boundary ref,handoff hint ref only | enter;not raw log/metrics store |
| `job_checkpoints` | durable resume anchor shell | `job_checkpoint_ref` | job family ref;run ref;task ref;checkpoint state | save/replace checkpoint summary from job progress;close when task/run closes | opaque cursor/checkpoint refs,continuation anchor,safe summary only | enter;not version/cursor/retry/lease |
| `method_asset_recovery_issues` | durable safe issue surface | `recovery_issue_ref` | run ref;scope ref;task ref;issue disposition | append/create issue;versioned disposition/linkage update | safe diagnostic refs,follow-up hint,ack reason only | enter;not repair proof |
| `job_report_boundaries` | durable report/result shell | `job_report_boundary_ref`;`maintenance_run_ref` | job family ref;run ref;task ref;report kind;result state | immutable boundary or superseded by later boundary ref | result state,progress ref,issue refs,checkpoint ref,handoff hint only | enter;report body excluded |
| jobs entry local state | runtime-local / excluded from business store | `job_runner_context_ref`;`operation_job_entry_ref` | no durable business lookup | local invocation state only;outputs copied by application-owned stores | safe refs only | excluded as business truth / scheduler state |

### 3. repository / port 持久化语义

| Step 7 family | durable role | read / lookup semantics | save semantics | authority boundary | explicit exclusions |
|---|---|---|---|---|---|
| `MethodAssetMaintenanceTaskRepository` | owner of refresh/recovery task truth | exact task read;run/scope/kind page;state summary read | create task shell from accepted request;save state with expected version | only task repository changes task state such as requested/running/suspended/superseded/completed/blocked | no queue、retry、lease、thread lifecycle、scheduler state;no job body execution in request command |
| `MethodAssetMaintenanceProgressViewRepository` | owner of progress read projection | exact progress read;run/scope progress lookup;pending issue summary page | seed on accepted request;replace progress snapshot by version from job/control flow | progress copies task/checkpoint/issue/job result;does not decide task truth | no task success inference;no worker log、metrics body、report body |
| `MethodAssetMaintenanceRunHistoryRepository` | owner of run chronology and report linkage | list chronology by run/scope;read report/handoff linkage summary | append start/progress/partial/blocked/completed/report-linked milestones | chronology records what happened;does not own task transition or handoff outcome | no markdown/JSON report body;no raw log;no publication/handoff delivery truth |
| `MethodAssetJobCheckpointStorePort` | owner of resume checkpoint shell | load by checkpoint ref;lookup current checkpoint by job family/run/task;safe absence | save checkpoint summary;close/supersede checkpoint when task/run closes | checkpoint is resume anchor only | no optimistic version、query page cursor、material freshness、retry counter、queue offset、lease token、process id |
| `MethodAssetRecoveryIssueRepository` | owner of recovery / partial issue surface | exact issue read;page pending/blocked/intervention issues by run/scope/task | create body-free issue;update disposition/linkage with expected version if mutable | issue records problem/intervention/ack;does not prove repair | no raw evidence、provider payload、stack trace、repair script、report body |
| job report/result boundary owner | application job closure / run history store owns boundary linkage | read boundary by report ref/run/task only where Step 8 shell requires it | save immutable or superseded boundary summary from job closure | report boundary is copy surface for Query/observability/replay handoff | no full report body;no metrics payload;no external response body |

### 4. authority separation

| surface | can be authority for | cannot be authority for |
|---|---|---|
| maintenance task truth | task lifecycle state,control transitions,run/scope/kind stable lookup | progress percentages,report body,checkpoint resume internals,publication/handoff result |
| progress view | Query/report visible progress snapshot,pending issue refs,checkpoint/report hints | task completed/superseded/suspended truth,business truth repair,automatic retry |
| run history | body-free chronology,milestone summary,report/handoff hint linkage | raw logs,metrics timeline,task truth,delivery or handoff completion |
| checkpoint store | resume anchor and partial continuation | optimistic version,query page cursor,material freshness,retry count,queue offset,lease token |
| recovery issue | safe issue/intervention/ack surface | proof that core truth was repaired or consistency was globally restored |
| job report boundary | safe result summary and report ref handoff | report body,evidence artifact body,metrics body,raw external response |
| jobs entry local state | local runner precheck/dispatch assembly | durable business truth,scheduler state,repository owner,repair authority |

### 5. marker / excluded 裁决

| candidate | current decision | reason | later closure target |
|---|---|---|---|
| scheduler / queue / lease / retry tables | excluded | Step 11 persistence contract does not own scheduler product or concurrency policy. | Step 13 may define retry/re-entry semantics without making scheduler state business truth. |
| process exit / thread lifecycle state | excluded | jobs entry result is safe protocol state,not OS process state. | Step 15 may observe safe result,not raw process signal. |
| report markdown / JSON body store | excluded | report body-free boundary is fixed by Step 6/8/10. | Step 15/16 can define evidence/report artifact reference if needed. |
| metrics payload / worker log store | excluded | observability payload is not maintenance truth. | Step 15 owns metrics/log redaction and safe observability. |
| query page cursor as checkpoint | excluded | page cursor and job checkpoint have different owners and replay semantics. | Step 13 closes checkpoint replay;Query cursor stays read helper. |
| progress-derived task transition | forbidden | progress is projection and cannot mutate task truth. | Implementation must call task repository transition explicitly. |
| recovery issue as repair success | forbidden | issue records safe problem/intervention/convergence surface only. | Recovery closure/error mapping continues in Step 12/15. |
| handoff/publication outcome inside report store | excluded | report boundary may carry hint/ref,not external delivery truth. | R11.19/R11.20 own publication/handoff persistence. |

### 6. checkpoint / report redline

| item | valid source | invalid substitution |
|---|---|---|
| checkpoint ref | checkpoint store,previous progress summary,run/task/job family refs | query page cursor,optimistic version,truth cursor,timestamp,retry count,queue offset,lease token |
| checkpoint summary | body-free continuation anchor and safe progress refs | target scan result from private map,filesystem path,serialized job input body |
| report boundary ref | job closure application output or run history linkage | markdown filename,raw JSON report body,metrics artifact body |
| report result state | safe completed/partial/blocked/failed/degraded/replayed marker | process exit code,exception text,SQL/HTTP status,provider response body |
| handoff hint | body-free report/handoff hint ref | archive body,external receipt body,delivery success truth |

### 7. watch / blocker 台账

| id | topic | issue | current handling | required closure |
|---|---|---|---|---|
| ML-D03-S11-WATCH-022 | task truth vs progress/run history/report boundary | task、progress、run history、checkpoint、report/result 可能被实现成一个 job state。 | Split authority into independent logical stores/surfaces. | R11.21 transaction table must preserve write ordering without merging owners. |
| ML-D03-S11-WATCH-023 | checkpoint identity and resume source | checkpoint 不能用 page cursor、version、retry count、queue offset 或 lease token 替代。 | Checkpoint redline recorded. | Step 13 must define resume/re-entry and duplicate behavior. |
| ML-D03-S11-WATCH-024 | stored job report / replay source | Duplicate job replay needs stored report,但本模块不定义 idempotency serialization。 | Durable report boundary shell recorded. | R11.17/R11.18 and Step 13 close stored replay schema. |
| ML-D03-S11-WATCH-025 | recovery issue is not repair proof | issue/intervention/convergence 容易被误写成 truth repaired。 | Recovery issue authority is issue surface only. | Step 12 maps recovery/intervention/error surface;job still no repair. |
| ML-D03-S11-WATCH-026 | report boundary no body | run history/report 不能保存 markdown、JSON、raw log、metrics 或 artifact body。 | Report body excluded. | Step 15/16 may add safe artifact refs,not body. |
| ML-D03-S11-WATCH-027 | jobs entry-local state persistence | runner context / entry result must not become durable business truth or scheduler state. | Marked runtime-local / excluded from business store. | Runtime/entry family continues in R11.17/R11.18. |

### 8. R11.16 stop-review

| 检查项 | 结果 |
|---|---|
| 是否写入 maintenance/job/report logical store / marker / excluded 行 | pass |
| 是否写入 task/progress/run history/checkpoint/recovery issue/report boundary repository 语义 | pass |
| 是否拆开 authority,未让 progress/report/checkpoint 反推 task truth | pass |
| 是否明确 checkpoint / cursor / version / freshness / retry / lease 分离 | pass |
| 是否明确 report boundary body-free,未保存 report/log/metrics/artifact body | pass |
| 是否未进入 idempotency/replay、outbound/handoff 完整契约 | pass |
| 是否未写 transaction boundary、一致性策略、error taxonomy、config key、test case schema 或 implementation code | pass |
| 是否修改正式 `03-详细设计.md` | no |

next_allowed_action: 等待用户确认后进入 Step 11 `R11.17 idempotency/stored replay/runtime entry 持久化契约:先思考`;只允许思考 idempotency guard、stored operation result、inbound receipt、stored job report replay、runtime assembly、adapter availability、API/worker/jobs entry local state 的持久化契约和 `R11.18` 写入边界;不得直接修改正式 `03-详细设计.md`;不得写 outbound/handoff 的完整 contract、transaction boundary 表、一致性策略表、error taxonomy、config key、test case schema 或 implementation code。

---

## R11.17 idempotency/stored replay/runtime entry 持久化契约:先思考

### 1. 当前模块目标

`R11.17` 只思考 idempotency / stored replay / runtime entry 族在 `R11.18` 中应如何落成可审计的 durable shell、runtime-local / excluded 裁决和 replay source 边界。当前模块不写最终 logical store rows、repository semantic rows、transaction boundary rows,也不进入 outbound/handoff 的完整契约。

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm |
| 当前允许 | 思考 `MethodAssetIdempotencyGuard`、`MethodAssetStoredOperationResult`、inbound receipt、stored job report replay、`MethodAssetRuntimeAssemblyState`、`MethodAssetAdapterAvailabilityState`、API / worker / jobs entry local state 的持久化归属和 `R11.18` 写入边界。 |
| 当前禁止 | 写最终 logical store rows、repository semantic rows、transaction boundary rows、一致性策略 rows、outbound / handoff store、error taxonomy、config key、test case schema、implementation code 或正式 `03-详细设计.md`。 |

### 2. 输入来源思考

| 输入来源 | 本模块可使用内容 | 本模块不能做的事 |
|---|---|---|
| Step 6 application helper | `MethodAssetIdempotencyGuard`、`MethodAssetStoredOperationResult`、operation context、safe digest、dedup scope、replay marker。 | 定义 lock、TTL、retry、transaction table、public DTO body snapshot 或 raw error storage。 |
| Step 6 inbound / entry objects | `MethodAssetInboundIntakeDecision`、API / worker / jobs entry context、entry result state。 | 保存 HTTP request、broker ack、offset、topic、subscription、scheduler/process state。 |
| Step 6 infra state | `MethodAssetRuntimeAssemblyState`、`MethodAssetAdapterAvailabilityState`、binding state、safe diagnostic refs。 | 持久化 raw config、secret、URL、adapter instance、connection pool、raw health response。 |
| Step 7基础 helper / runtime ports | UnitOfWork、IdGenerator、stored result seam、runtime assembly registry、adapter availability port、fake/durable parity。 | 新增未闭口 repository 或让 entry 绕过 application facade 直调 repository / adapter。 |
| Step 8 protocol shell | Command duplicate result、Inbound receipt、Job duplicate / report replay、worker/job result shell。 | 从协议壳反推完整 stored surface schema 或保存 DTO body。 |
| Step 9 flow overlay | Command / Inbound / Job duplicate 只能 replay stored result / receipt / report / checkpoint;entry facade-only。 | 通过重跑 mutation、重读 current truth、扫描 queue 或重新处理 raw payload 重建响应。 |
| Step 10 state matrix | idempotency guard decision、stored result replay-safe state、runtime assembly、availability、entry local boundary。 | 把 technical-local entry state 升格为 business truth 或 delivery truth。 |

### 3. boundary 分层思考

| boundary | 持久化思考 | R11.18 写入方向 | redline |
|---|---|---|---|
| idempotency guard / reservation | 需要 durable reservation / decision shell 以支持 duplicate / conflict 判断,但并发锁细节后移 Step 13。 | 写 idempotency record 的 identity、dedup key、digest、scope、stored result ref 方向。 | 不写 lock TTL、lease、retry、DB locking 或 queue dedup 实现。 |
| stored operation result | accepted / rejected / ignored / conflict 的 safe summary 需要 durable replay source。 | 写 stored result safe shell、replay marker、body-free effect refs 的持久化边界。 | 不保存 public DTO body、raw error、provider payload、event payload、report body。 |
| inbound receipt | 4 个 inbound flow 的 accepted / duplicate / unsupported / malformed / delayed receipt 需要 durable replay surface。 | 写 inbound receipt shell 与 stored result / intake decision / worker result 的配对方向。 | 不保存 raw envelope、broker message、ack、offset、dead-letter body。 |
| stored job report replay linkage | R11.16 已写 report boundary;本组只思考 duplicate job 如何引用 stored report / checkpoint / run history。 | 写 replay source 只复制 R11.16 report/checkpoint/history surface 的边界。 | 不重跑 job body、不扫描 target、不把 checkpoint 当 page cursor。 |
| runtime assembly | runtime assembly 是 technical support;是否 durable 只限 validated assembly summary / latest safe diagnostic,不成为业务 truth。 | 写 runtime-local / support-shell 裁决,config binding 细节留 Step 14。 | 不保存 secret、URL、config file、DI container、process state。 |
| adapter availability | availability marker 可被 entry/job/query 复制;持久化方向应是 runtime-local latest summary 或 excluded store。 | 写 availability summary 的 non-business owner 与 copy-only marker 约束。 | 不从 raw exception、SQL/HTTP code、timeout string 分类。 |
| API / worker / jobs entry local state | entry context / result 是 facade-local assembly;通常不应进入 durable business store。 | 写 runtime-local / excluded 裁决,只允许 durable stored result / receipt / report 复制安全输出。 | entry 不拥有 repository、UoW、domain transition、delivery truth 或 scheduler state。 |

### 4. replay source 思考

| replay family | durable source candidate | R11.18 应明确 | 不允许 |
|---|---|---|---|
| Command duplicate | idempotency record + stored operation result | key/digest/scope match 后复制 stored result safe shell。 | 重跑 command mutation、重读 truth 重建 accepted response。 |
| Command conflict | idempotency record + safe conflict stored result | 同 key 不同 digest/scope/subject 时保存/返回 safe conflict surface。 | 当成 accepted duplicate 或抛 raw infrastructure error。 |
| Inbound duplicate | inbound receipt + stored operation result / intake decision summary | source event + dedup key 命中后复制 safe receipt。 | 重新处理 raw payload、再次调用 external adapter、读取 broker offset。 |
| Job duplicate | R11.16 job report boundary + checkpoint + run history | 复制 stored report/result 或返回 resume-ready checkpoint。 | 重跑 job body、重新扫描 targets、使用 queue lease/retry count。 |
| Query | no durable idempotency record | Query no-write,不保存 query result replay。 | 把 read path 纳入 command idempotency store。 |

### 5. runtime / entry 持久化边界思考

| surface | likely decision | R11.18 写入重点 |
|---|---|---|
| `MethodAssetRuntimeAssemblyState` | runtime-local / support summary,not business truth | 若保留 latest assembly summary,只能保存 binding refs、slot refs、safe diagnostic refs;不得保存 config detail。 |
| `MethodAssetAdapterAvailabilityState` | runtime-local / latest availability summary or marker input | availability marker 只能从 adapter availability port / health summary 复制,不得 service-side classify。 |
| store/source/publisher/handoff binding state | runtime-local / Step 14 config handoff | R11.18 只说明不进入 business truth;具体 key/secret/URL/topic 留 Step 14。 |
| API entry context/result | excluded from durable store except stored result output | API entry is transport-neutral facade;durable copy only through stored result,not through entry table。 |
| worker entry context/result | excluded except inbound receipt / publication outcome later | Inbound duplicate uses receipt;publisher outcome belongs R11.19/R11.20。 |
| jobs entry context/result | excluded except job report/checkpoint/result shell | Job result durable surface already via report/checkpoint/run history/stored result,not runner table。 |

### 6. R11.18 写入边界思考

`R11.18` 应该写:

1. idempotency record、stored operation result、inbound receipt、job replay linkage、runtime assembly / adapter availability、entry local state 的 logical store / marker / excluded 行。
2. idempotency record vs stored result vs inbound receipt vs job report boundary 的 replay authority separation。
3. stored result / receipt 的 body-free safe shell 约束和 replay marker 来源。
4. runtime assembly / adapter availability 的 runtime-local 或 support summary 裁决,以及 config / secret / raw diagnostic 禁入。
5. API / worker / jobs entry local state 的 facade-only / excluded 裁决。
6. watch / blocker 和 `R11.19` 进入门禁。

`R11.18` 不应该写:

- Step 13 的并发竞争、reserve/complete 原子性、lock、TTL、retry、re-entry 细节。
- outbound event candidate、publication outcome、handoff marker / outcome 的完整 store;该内容留给 R11.19/R11.20。
- transaction boundary 全序和 consistency strategy;该内容留给 R11.21/R11.22。
- error taxonomy、safe error code、config key、secret、topic、transport、test case schema、evidence artifact schema 或 implementation code。

### 7. watch / blocker 预判

| id | topic | issue | R11.17 handling |
|---|---|---|---|
| ML-D03-S11-WATCH-028 | idempotency record vs stored result separation | reservation / decision shell 容易与 replay result shell 混成一个对象。 | R11.18 必须拆 key/digest/scope guard 与 replay-safe result。 |
| ML-D03-S11-WATCH-029 | stored result body-free replay | duplicate replay 需要 stored surface,但不能保存 DTO body/raw error/event payload/report body。 | R11.18 写 safe summary / marker / typed refs only。 |
| ML-D03-S11-WATCH-030 | inbound receipt schema boundary | Step 9 定义 receipt branch,但 result kind / safe reason / replay serialization 后续还需 Step 12/13。 | R11.18 只写 durable receipt shell and replay source;不写 error taxonomy。 |
| ML-D03-S11-WATCH-031 | job report replay overlap | R11.16 已有 report boundary;R11.18 可能重复定义 job report store。 | R11.18 只能引用 R11.16 report/checkpoint/run history as replay source。 |
| ML-D03-S11-WATCH-032 | runtime assembly persistence | runtime assembly 可见性需要支持 entry precheck,但不应变成 config store 或 business truth。 | R11.18 写 runtime-local/support summary 裁决。 |
| ML-D03-S11-WATCH-033 | entry local state persistence | API/worker/jobs entry local state 容易被实现成持久化入口表或直接持有 repository/UoW。 | R11.18 写 facade-only / excluded rule。 |

### 8. R11.17 stop-review

| 检查项 | 结果 |
|---|---|
| 是否只思考 idempotency/stored replay/runtime entry 持久化边界 | pass |
| 是否区分 idempotency record、stored result、inbound receipt、job report replay linkage | pass |
| 是否明确 duplicate replay 不重跑 mutation / 不重读 current truth / 不扫描 queue | pass |
| 是否明确 runtime / adapter / entry 是 technical/local boundary,不等于 business truth | pass |
| 是否形成 R11.18 写入边界 | pass |
| 是否未写最终 logical store / repository semantic rows | pass |
| 是否未修改正式 `03-详细设计.md` | no |

next_allowed_action: 等待用户确认后进入 Step 11 `R11.18 idempotency/stored replay/runtime entry 持久化契约:再写入`;只允许写入 idempotency/stored replay/runtime entry 的 logical store / marker / excluded 行、replay authority separation、body-free stored result / receipt 约束、runtime-local / entry-local 裁决、watch / blocker 和 `R11.19` 进入门禁;不得直接修改正式 `03-详细设计.md`;不得写 outbound/handoff 的完整 contract、transaction boundary 表、一致性策略表、error taxonomy、config key、test case schema 或 implementation code。

---

## R11.18 idempotency/stored replay/runtime entry 持久化契约:再写入

### 1. 当前模块目标

`R11.18` 将 `R11.17` 的 idempotency / stored replay / runtime entry 思考落成可审计的 logical store、runtime-local / excluded 裁决、replay authority separation 和 watch / blocker。当前模块只覆盖 idempotency record、stored operation result、inbound receipt、job replay linkage、runtime assembly / adapter availability 和 API / worker / jobs entry local state,不进入 outbound/handoff 的完整契约。

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm |
| 当前允许 | 写入 idempotency/stored replay/runtime entry 的 logical store / marker / excluded 行、replay authority separation、body-free stored result / receipt 约束、runtime-local / entry-local 裁决、watch / blocker 和 `R11.19` 进入门禁。 |
| 当前禁止 | 写 outbound/handoff 的完整 contract、transaction boundary 表、一致性策略表、Step 13 并发/重入细节、error taxonomy、config key、test case schema、implementation code 或正式 `03-详细设计.md`。 |

### 2. idempotency / stored replay logical store 裁决

| logical boundary | persistence decision | primary identity | lookup / index | version / append rule | body-free rule | current closure |
|---|---|---|---|---|---|---|
| `method_asset_idempotency_records` | durable reservation / decision shell | `idempotency_record_ref`;`idempotency_key_ref` | operation kind;dedup scope;operation subject;idempotency key | reservation -> complete / conflict / rejected state;exact atomicity deferred to Step 13 | key,digest,scope,subject,stored result ref and safe reason only | enter;guard/decision authority only |
| `stored_method_asset_operation_results` | durable replay-safe result shell | `stored_result_ref` | operation kind;operation digest;operation context;result kind | immutable after save,or superseded only by explicit stored result ref | accepted/rejected/ignored/conflict summary refs,effect refs,replay marker only | enter;public DTO body excluded |
| `inbound_receipts` | durable inbound receipt shell | `inbound_receipt_ref`;`source_event_ref` | source kind;source event ref;dedup key;receipt kind | immutable after save;duplicate returns stored receipt | intake summary refs,source refs,safe reason,unavailable marker only | enter;raw envelope/broker state excluded |
| job replay linkage | reference to R11.16 report/checkpoint/run history | `job_report_boundary_ref`;`job_checkpoint_ref`;`maintenance_run_ref` | job family;run;task;checkpoint/report kind | no new job report store in this module | report/checkpoint/history refs only | enter as linkage;R11.16 remains report owner |
| query replay store | excluded | none | none | no write | none | Query no-write;no durable query result replay |

### 3. runtime / entry persistence 裁决

| candidate | current decision | reason | allowed durable copy |
|---|---|---|---|
| `MethodAssetRuntimeAssemblyState` | runtime-local / support summary | runtime assembly supports entry precheck but is not business truth or config truth. | latest body-free assembly summary may carry binding refs,slot refs,safe diagnostic refs if Step 14 binding requires it. |
| `MethodAssetAdapterAvailabilityState` | runtime-local / marker input | availability marker is copied by entry/service;it does not own domain state. | latest availability summary may carry adapter family ref,availability marker,safe reason refs. |
| store/source/publisher/handoff binding states | runtime-local / Step 14 handoff | binding configuration belongs to config/dependency design. | only typed binding refs and safe diagnostic refs,not key/secret/URL/topic. |
| API entry context / handler entry / response assembly | excluded from durable business store | API entry is facade-local and transport-neutral. | durable copy only through stored operation result,not an API entry table. |
| worker entry context / inbound / publisher entry / worker result | excluded except formal receipt/outcome stores | Worker local state is not broker truth or delivery truth. | inbound receipt in this module;publication outcome later in R11.19/R11.20. |
| jobs runner context / operation job entry / local result | excluded except formal report/checkpoint/result stores | Jobs local state is not scheduler,queue,process or repair truth. | R11.16 report/checkpoint/run history and stored result reference only. |

### 4. replay authority separation

| authority | owns | cannot own |
|---|---|---|
| idempotency record | key/digest/scope/subject matching,duplicate/conflict/rejected decision shell,stored result pointer | accepted business result body,receipt body,job report body,lock/TTL semantics |
| stored operation result | replay-safe accepted/rejected/ignored/conflict safe summary and effect refs | public DTO snapshot,raw error,provider payload,event payload,report body |
| inbound receipt | inbound accepted/duplicate/unsupported/malformed/delayed safe receipt surface | raw source envelope,broker ack,offset,topic,dead-letter body |
| job report/checkpoint/run history linkage | duplicate job replay source and resume anchor refs | new job report store,job target scan result,queue lease,retry counter |
| runtime assembly / availability summary | entry/job precheck marker and safe diagnostics | config truth,business lifecycle,adapter raw health response |
| entry-local state | local facade assembly only | repository owner,UnitOfWork owner,domain transition,delivery truth,scheduler truth |

### 5. body-free stored surface rules

| stored surface | allowed content | forbidden content |
|---|---|---|
| idempotency record | typed key ref,operation digest ref,dedup scope ref,subject ref,decision kind,stored result ref,safe conflict/reject reason ref | raw request body,route string,topic,queue id,lock token,TTL,lease |
| stored operation result | accepted summary ref,rejected reason ref,ignored reason ref,conflict reason ref,effect summary refs,replay marker | public DTO body,stack trace,raw exception,provider response,event payload,report body |
| inbound receipt | receipt ref,source event ref,dedup key ref,intake decision ref,safe receipt kind,unavailable/degraded marker,safe reason | raw envelope,broker message,ack/offset,subscription,dead-letter body,payload excerpt |
| job replay linkage | report boundary ref,checkpoint ref,run history ref,job result marker,progress ref | target list body,raw report,metrics payload,queue lease,retry count,scheduler state |
| runtime summary | runtime assembly state ref,binding refs,slot availability refs,safe diagnostic refs | config key/secret/URL,connection pool,adapter instance,process/thread state |

### 6. replay redline

| replay branch | valid replay source | prohibited fallback |
|---|---|---|
| Command duplicate | idempotency record + replay-safe stored operation result | rerun command mutation;reload current truth to rebuild response;reassemble DTO body |
| Command conflict | idempotency record + safe conflict result | treat as accepted duplicate;throw raw infra error |
| Inbound duplicate | inbound receipt + stored result / intake decision safe summary | reprocess raw payload;call external adapter again;read broker offset |
| Job duplicate | R11.16 report boundary + checkpoint + run history + stored result marker | rerun job body;scan targets;use retry count / queue lease as checkpoint |
| Query duplicate | none;Query no-write | save query result for replay;reuse command idempotency store |

### 7. marker / excluded 裁决

| candidate | current decision | reason | later closure target |
|---|---|---|---|
| idempotency lock / TTL / lease table | excluded from R11.18 | This module records durable shell,not concurrency mechanism. | Step 13 defines atomic reserve/complete/re-entry semantics. |
| entry-local dedup map | forbidden | Replay authority must be durable stored result / receipt / report,not entry memory. | Step 13 fake/durable parity tests. |
| full response snapshot table | excluded | Stored result is safe summary,not DTO snapshot. | Step 8/12 keep protocol shell separate. |
| raw inbound payload archive | forbidden | Inbound receipt is body-free. | Step 15/16 may define safe evidence refs,not payload body. |
| runtime config store | excluded | Config key/secret/URL/topic belong to Step 14. | Step 14 config/dependency binding. |
| adapter raw health log store | excluded | Availability marker must come from formal summary,not raw response. | Step 12/15 safe diagnostic mapping. |
| API / worker / jobs entry tables | excluded as business store | Entry state is local facade assembly. | Only stored result/receipt/report/outcome stores may persist safe output. |

### 8. watch / blocker 台账

| id | topic | issue | current handling | required closure |
|---|---|---|---|---|
| ML-D03-S11-WATCH-028 | idempotency record vs stored result separation | reservation / decision shell 与 replay result shell 容易混成一个对象。 | Separated idempotency record authority from stored result authority. | R11.21 transaction table and Step 13 reserve/complete must preserve separation. |
| ML-D03-S11-WATCH-029 | stored result body-free replay | duplicate replay 需要 stored surface,但不得保存 DTO body/raw error/event payload/report body。 | Body-free stored surface rules recorded. | Step 12/13 must keep rejection/replay surface safe. |
| ML-D03-S11-WATCH-030 | inbound receipt schema boundary | Receipt branch 已有 durable shell,但 result kind / safe reason taxonomy 后移。 | Durable receipt shell recorded without taxonomy. | Step 12/13 close receipt kind,reason,replay behavior. |
| ML-D03-S11-WATCH-031 | job report replay overlap | Job report store 已在 R11.16,本模块不能重复定义。 | R11.18 only references R11.16 report/checkpoint/run history as replay linkage. | Step 13 closes duplicate job replay behavior. |
| ML-D03-S11-WATCH-032 | runtime assembly persistence | runtime support needs precheck surface,但不能变成 config/business truth。 | Runtime-local/support-summary decision recorded. | Step 14 closes config binding and slot assembly. |
| ML-D03-S11-WATCH-033 | entry local state persistence | API/worker/jobs entry state 容易被持久化为入口表。 | Entry-local state excluded except formal stored surfaces. | Step 16 tests must cover facade-only entry. |

### 9. R11.18 stop-review

| 检查项 | 结果 |
|---|---|
| 是否写入 idempotency/stored replay/runtime entry logical store / marker / excluded 行 | pass |
| 是否拆开 idempotency record、stored result、inbound receipt、job report replay linkage 的 authority | pass |
| 是否明确 stored result / receipt body-free 约束 | pass |
| 是否明确 runtime-local / entry-local 裁决 | pass |
| 是否明确 duplicate replay 不重跑 mutation / 不重读 truth / 不扫描 queue | pass |
| 是否未进入 outbound/handoff 完整契约 | pass |
| 是否未写 transaction boundary、一致性策略、Step 13 并发细节、error taxonomy、config key、test case schema 或 implementation code | pass |
| 是否修改正式 `03-详细设计.md` | no |

next_allowed_action: 等待用户确认后进入 Step 11 `R11.19 outbound/publication/handoff 持久化契约:先思考`;只允许思考 event candidate、publication outcome、publisher binding、target registry、handoff marker / outcome、report / archive handoff hint 的持久化契约和 `R11.20` 写入边界;不得直接修改正式 `03-详细设计.md`;不得写 transaction boundary 表、一致性策略表、error taxonomy、config key、test case schema 或 implementation code。

---

## R11.19 outbound/publication/handoff 持久化契约:先思考

### 1. 当前模块目标

`R11.19` 只思考 outbound/publication/handoff 族的持久化边界,把 event candidate、publication outcome、publisher / target registry、handoff marker / outcome、report / archive handoff hint 和 worker event publisher entry local result 分开。当前模块不写最终 logical store rows、repository semantic rows 或 transaction boundary rows。

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm |
| 当前允许 | 思考 event candidate persistence、publication outcome persistence、publisher binding / target registry boundary、handoff marker / outcome boundary、report / archive handoff hint 和 watch / blocker。 |
| 当前禁止 | 写完整 logical store rows、repository semantic rows、transaction boundary table、一致性策略、error taxonomy、config key、test case schema、implementation code 或正式 `03-详细设计.md`。 |

### 2. outbound/publication/handoff 边界思考

| boundary | current decision | reason | R11.20 writing focus |
|---|---|---|---|
| `MethodAssetEventCandidateAssembly` | durable append-only candidate shell | candidate is the formal publication input; it may be reloaded as candidate truth, not rebuilt from current truth or delivery result. | 写 candidate logical row、append key、body-free summary boundary。 |
| publication outcome | durable publication outcome shell | publication outcome must stay separated from candidate and from delivery truth; it only records safe publication result / marker. | 写 outcome logical row、candidate/target key、safe result / marker 约束。 |
| `MethodAssetPublisherBindingState` / `MethodAssetCollaborationTargetRegistryPort` | runtime-local / support summary | publisher binding and target registry are technical availability inputs, not business durable truth. | 只写 runtime-local 或 Step 14 handoff 相关的安全裁决,不升格 truth。 |
| `MethodAssetHandoffBindingState` / `MethodAssetCollaborationHandoffPort` | durable body-free handoff shell | handoff needs a traceable marker / receipt surface, but not package body, report body or external write receipt body. | 写 handoff marker / outcome logical row 和 body-free hint boundary。 |
| report / archive handoff hint | marker-only support surface | hint can be copied for observability and follow-up; it does not carry report/archive body or delivery truth. | 只写 safe hint refs 和 follow-up marker,不写 body。 |
| `MethodAssetEventPublisherEntry` / worker local result | excluded from durable business store | worker local state is a technical entry boundary, not a persistent publication truth. | 仅保留 facade-local 裁决,不进入 durable store。 |

### 3. 来源承接思考

| source step | outbound / handoff input | R11.19 interpretation | R11.20 constraint |
|---|---|---|---|
| Step 6 objects | `MethodAssetEventCandidateAssembly`;`MethodAssetPublisherBindingState`;`MethodAssetHandoffBindingState`;`MethodAssetEventPublisherEntry`;handoff hint / marker refs | Step 6 gives field source and body-free redline,not persistence table authority. | only fields with Step 6 source can be written;no topic/payload/delivery fields. |
| Step 7 ports | `MethodAssetEventCandidatePublisherPort`;`MethodAssetCollaborationHandoffPort`;`MethodAssetCollaborationTargetRegistryPort` | ports define publication / handoff seams and safe outcomes,not physical transport binding. | repository rows must not invent port methods;publisher/handoff outcomes copy port output only. |
| Step 8 protocol | event candidate / publication surface,job report / handoff boundary shell | protocol shell proves public boundary,not durable DTO snapshot. | stored rows carry safe refs/markers only,not public body. |
| Step 9 flows | outbound publisher overlay,report/archive handoff hints,worker entry branches | flow gives ordering and branch names;it does not authorize delivery truth. | R11.20 can reference flow branch as write owner;cannot create outbox relay / ack / dead-letter truth. |
| Step 10 state matrix | event candidate state boundary,publication outcome boundary,handoff marker boundary,technical local publisher/handoff binding | state matrix confirms candidate/outcome/handoff separation and no rollback of accepted truth. | persistence must keep candidate,publication outcome,handoff marker and technical binding separate. |

### 4. 分离矩阵思考

| pair | must stay separate because | prohibited shortcut | R11.20 expression |
|---|---|---|---|
| event candidate vs publication outcome | candidate is publication input;outcome is publisher/handoff result. | storing outcome on candidate as delivery state. | distinct candidate row and outcome row. |
| publication outcome vs delivery truth | L3 only owns safe publication summary,not downstream delivery. | subscriber ack,delivery receipt,topic offset,dead-letter status. | safe publication ref / marker only. |
| target registry vs config binding | registry reports enabled / blocked / unavailable target summary;config owns keys/topics/URLs later. | persisting target registry as config table. | runtime-local/support summary,Step 14 handoff. |
| handoff marker vs handoff package/report/archive body | marker traces boundary;body belongs outside this Step and may be external. | saving report body,archive body,package body or external write receipt body. | body-free handoff marker/outcome row. |
| candidate reload source vs current truth reread | publisher retry/resume must reload candidate shell,not reconstruct from changed truth. | re-running command/query or scanning current domain truth. | candidate append-only shell as reload source. |
| worker entry local result vs durable outcome | worker local result is facade-local;durable authority is formal outcome/marker. | persisting worker entry table as publication truth. | excluded row with allowed durable copies named. |

### 5. R11.20 写入计划思考

`R11.20` 应把本模块裁决落成可审计表,但仍不进入 transaction boundary 或 consistency strategy。

| write block | should write | should not write |
|---|---|---|
| event candidate persistence | candidate logical row,append identity,reload source,body-free candidate content. | event payload,topic,outbox relay,delivery status,current truth reconstruction rule. |
| publication outcome persistence | outcome row keyed by candidate / target / publication boundary marker,safe result kinds and failure marker. | subscriber ack,broker offset,delivery guarantee,dead-letter state. |
| target registry / publisher binding裁决 | runtime-local/support-summary decision and Step 14 closure pointer. | config key,secret,URL,topic,transport product owner. |
| handoff marker / outcome persistence | handoff marker/outcome row,package/report/archive safe refs,receipt/failure marker refs. | report body,archive body,package body,external receipt body. |
| report / archive handoff hint | marker-only hint row or excluded/linked decision. | automatic repair trigger,external write truth,observability payload body. |
| worker publisher entry | excluded from business store;allowed durable copies through candidate/outcome/handoff stores only. | worker entry table,local result as replay authority. |

### 6. watch / blocker 台账

| id | topic | issue | current handling | required closure |
|---|---|---|---|---|
| ML-D03-S11-WATCH-034 | event candidate persistence and reload source | candidate needs a formal durable shell, but cannot be rebuilt from current truth or delivery result. | Candidate shell only; no truth reread fallback. | R11.20 写 candidate row and reload semantics. |
| ML-D03-S11-WATCH-035 | candidate vs publication outcome separation | candidate shell and publication outcome shell may collapse into one object if not fenced. | Kept as separate families. | R11.20 must preserve distinct logical rows and reload paths. |
| ML-D03-S11-WATCH-036 | publisher binding / target registry / config binding separation | binding and registry are technical availability inputs, not business truth. | Kept runtime-local or Step 14 handoff. | Step 14 must close config / binding sources without turning them into business store. |
| ML-D03-S11-WATCH-037 | publication / handoff outcome is not delivery / external truth | publication / handoff outcome must remain a safe summary or marker. | Body-free outcome shell only. | R11.20 and Step 15 must not promote outcome to delivery truth. |
| ML-D03-S11-WATCH-038 | handoff marker / outcome body-free boundary | handoff must not absorb report body, archive body or external write receipt body. | Marker-only / hint-only decision recorded. | R11.20 must keep marker and hint body-free. |
| ML-D03-S11-WATCH-039 | worker event publisher entry local state excluded | worker entry local result is a technical entry boundary, not durable business truth. | Facade-local result excluded. | Step 16 tests must keep worker entry out of durable business store. |

### 7. R11.19 stop-review

| 检查项 | 结果 |
|---|---|
| 是否只思考 outbound/publication/handoff 持久化边界 | pass |
| 是否区分 event candidate、publication outcome、handoff marker / outcome | pass |
| 是否把 publisher / target registry / binding 维持为 technical runtime boundary | pass |
| 是否把 worker local result 排除出 durable business store | pass |
| 是否未写 final logical store / repository semantic rows / transaction boundary rows | pass |
| 是否未修改正式 `03-详细设计.md` | no |

next_allowed_action: 等待用户确认后进入 Step 11 `R11.20 outbound/publication/handoff 持久化契约:再写入`;只允许写入 event candidate、publication outcome、publisher binding / target registry / handoff marker / outcome 的 logical store / marker / excluded 行、report / archive handoff hint 的 body-free 裁决、watch / blocker 和 `R11.21` 进入门禁;不得直接修改正式 `03-详细设计.md`;不得写 transaction boundary 表、一致性策略表、error taxonomy、config key、test case schema 或 implementation code。

---

## R11.20 outbound/publication/handoff 持久化契约:再写入

### 1. 当前模块目标

`R11.20` 将 `R11.19` 的 outbound/publication/handoff 思考落成可审计的 logical store、marker / excluded 裁决、reload authority 和 body-free redline。当前模块只覆盖 event candidate、publication outcome、publisher / target registry 边界、handoff marker / outcome、report / archive handoff hint 和 worker publisher entry local state,不写 transaction boundary、一致性策略、错误分类或配置绑定。

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm |
| 当前允许 | 写入 event candidate、publication outcome、publisher binding / target registry、handoff marker / outcome、report / archive handoff hint、worker publisher entry local state 的 logical store / marker / excluded 行、reload authority 和 watch / blocker。 |
| 当前禁止 | 写 transaction boundary 表、一致性策略、Step 13 retry / lock / lease、Step 14 config key / topic / URL / secret、Step 12 error taxonomy、test case schema、implementation code 或正式 `03-详细设计.md`。 |

### 2. logical store / marker / excluded 裁决

| logical boundary | persistence decision | primary identity / lookup | write owner | read / reload owner | version / append rule | body-free rule | current closure |
|---|---|---|---|---|---|---|---|
| `event_candidate_assemblies` | durable append-only candidate shell | `assembly_ref`;index by `event_family_kind`,`subject_ref_set`,`publication_boundary_marker_ref` | application outbound candidate assembly flow | worker / jobs publisher flow;publication retry / resume | append-only;duplicate / collision semantics deferred to Step 13 | `operation_context_ref`,`subject_ref_set`,`fact_summary_ref_set`,`lineage_ref_set`,`candidate_reason_ref`,`publication_boundary_marker_ref` only | enter;candidate reload authority |
| `publication_outcomes` | durable publication outcome shell | `publication_ref`;index by `assembly_ref`,`publisher_binding_ref`,`handoff_target_ref_set` | publisher flow after `MethodAssetEventCandidatePublisherPort` returns safe outcome | command/job stored result effect summary;observability and replay surfaces | versioned outcome per candidate / target boundary;retry ordering deferred to Step 13 | publication ref, outcome kind, boundary marker, failure reason, safe diagnostic and target refs only | enter;not delivery truth |
| publisher binding / target registry summary | runtime-local / support summary;not business store | `publisher_binding_ref`;`publisher_slot_ref`;target refs copied from registry output | runtime assembly / config binding layer | application publication precheck | no business version;configuration source deferred to Step 14 | binding refs,availability marker,blocked reason,safe diagnostic,target refs only | excluded from business truth;Step 14 closure |
| `handoff_markers` | durable body-free handoff marker / outcome shell | `handoff_ref`;index by `handoff_binding_ref`,`handoff_target_ref`,`handoff_boundary_marker_ref` | worker / jobs / application handoff flow after `MethodAssetCollaborationHandoffPort` returns safe outcome | report/archive/observability handoff readers;implementation handoff | versioned marker / outcome shell;external delivery ordering deferred | handoff target, family, boundary marker, package/report/archive safe refs, receipt marker, failure reason, safe diagnostic and hint refs only | enter;not package/report/archive body |
| report / archive handoff hint | marker-only support surface;not independent body store by default | `handoff_hint_ref` or existing report boundary ref | job report / worker result assembly | handoff / observability / Step 17 handoff | copied marker;no independent mutable lifecycle unless later Step creates formal owner | safe hint,follow-up marker,report boundary ref,archive ref only | linked marker;body store forbidden |
| `MethodAssetEventPublisherEntry` / worker publisher local result | excluded from durable business store | none as durable key | worker local entry only | none;durable reload uses candidate/outcome/handoff stores | no durable business version | no persistent local context/result body | excluded;facade-local only |

### 3. reload authority separation

| replay / resume need | valid durable source | forbidden fallback |
|---|---|---|
| reload event candidate for publication | `event_candidate_assemblies.assembly_ref` and its body-free candidate shell | re-read current domain truth;re-run command/query/job body;rebuild event payload from latest state |
| replay publication result | `publication_outcomes.publication_ref` and safe outcome marker | infer success from downstream ack,broker offset,topic,delivery receipt or absence of error |
| handoff resume / audit | `handoff_markers.handoff_ref` and body-free receipt/failure marker | reload report body/archive body/package body;query external system for truth |
| command / job effect summary | stored result / job report may reference candidate/outcome/handoff refs | store public DTO body,event payload or report body inside outbound store |
| worker publisher duplicate | durable candidate/outcome/handoff refs | local worker memory,entry result state,queue lease,retry count |

### 4. body-free stored surface rules

| stored surface | allowed content | forbidden content |
|---|---|---|
| candidate shell | typed operation context ref,event family,subject refs,fact summary refs,lineage refs,candidate reason,boundary marker | topic,payload schema,outbox event,delivery status,subscriber guarantee,raw method / external / artifact / report body |
| publication outcome | publication ref,outcome kind,boundary marker,target refs,failure reason,safe diagnostic,stored effect refs | subscriber ack,broker offset,delivery receipt,dead-letter body,transport retry body,topic routing |
| publisher / target summary | publisher binding ref,slot ref,event family set,availability state,blocked reason,safe diagnostic,handoff target refs | config key,secret,URL,topic,credential,transport product state |
| handoff marker / outcome | handoff ref,binding ref,target ref,family,boundary marker,package safe ref,receipt marker,failure reason,safe diagnostic,hint refs | report body,archive body,package body,external write receipt body,raw exception,external system state |
| report / archive handoff hint | report boundary ref,archive safe ref,follow-up hint,safe diagnostic marker | markdown/JSON report body,metrics payload,raw log,artifact/archive content |
| worker publisher entry | no durable business content | worker context table,local result replay authority,queue lease,process id,ack/offset |

### 5. source / port closure guard

| closure point | current rule | unresolved / deferred item |
|---|---|---|
| event candidate fields | must come from Step 6 `MethodAssetEventCandidateAssembly` field skeleton. | candidate duplicate / reserve semantics deferred to Step 13. |
| publication outcome | must copy `MethodAssetEventCandidatePublisherPort` safe outcome;service cannot synthesize delivery result. | outcome kind taxonomy and safe failure mapping deferred to Step 12. |
| target registry | `MethodAssetCollaborationTargetRegistryPort` provides enabled / disabled / blocked / unavailable summary only. | config binding,topic,URL,secret and target enablement source deferred to Step 14. |
| handoff outcome | must copy `MethodAssetCollaborationHandoffPort` prepared / delivered / blocked / unavailable / failed safe outcome. | handoff failure taxonomy and observability payload mapping deferred to Step 12/15. |
| report/archive handoff | may reference job report boundary and archive safe refs only. | report/evidence artifact body schema deferred to Step 15/16. |
| worker entry | may trigger port calls but cannot become durable authority. | facade-only verification deferred to Step 16. |

### 6. redline / excluded table

| candidate | current decision | reason | later closure target |
|---|---|---|---|
| old outbox event / relay / claim / lease | forbidden | current design replaced old outbox with body-free event candidate and publication outcome shells. | none;historical pollution only |
| delivery receipt / subscriber ack store | excluded | L3-method-library does not own downstream delivery truth. | Step 15 may observe safe marker only |
| dead-letter queue / retry table | excluded from R11.20 | retry / re-entry behavior belongs Step 13 and transport config belongs Step 14. | Step 13 / Step 14 |
| topic / routing key / transport binding table | excluded | config and transport binding are not business persistence. | Step 14 |
| handoff package / report / archive body store | forbidden in this Step | handoff marker is body-free and cannot store body content. | Step 15/16 may define safe artifact refs only |
| worker publisher entry table | excluded as business store | entry local state is not replay,publication or handoff truth. | Step 16 facade-only tests |

### 7. watch / blocker 台账

| id | topic | current handling | required closure |
|---|---|---|---|
| ML-D03-S11-WATCH-034 | event candidate persistence and reload source | `event_candidate_assemblies` recorded as append-only candidate reload authority. | Step 13 must close candidate duplicate / retry semantics without current-truth reread. |
| ML-D03-S11-WATCH-035 | candidate vs publication outcome separation | candidate shell and publication outcome shell remain distinct logical boundaries. | R11.21 transaction ordering must preserve candidate-before-outcome separation. |
| ML-D03-S11-WATCH-036 | publisher binding / target registry / config binding separation | publisher / registry stay runtime-local / support summary,not business truth. | Step 14 must close binding/config source and target enablement source. |
| ML-D03-S11-WATCH-037 | publication / handoff outcome is not delivery / external truth | publication and handoff stores only persist safe marker/outcome refs. | Step 15 must not promote outcome markers to external delivery truth. |
| ML-D03-S11-WATCH-038 | handoff marker / outcome body-free boundary | `handoff_markers` recorded as body-free marker/outcome shell. | Step 12/15 must close failure mapping and observability without report/archive body. |
| ML-D03-S11-WATCH-039 | worker event publisher entry local state excluded | worker publisher entry is excluded from durable business store. | Step 16 must test worker facade-local behavior and durable outcome source. |

### 8. R11.20 stop-review

| 检查项 | 结果 |
|---|---|
| 是否写入 event candidate logical store 裁决 | pass |
| 是否写入 publication outcome 与 candidate 分离裁决 | pass |
| 是否写入 publisher binding / target registry runtime-local 裁决 | pass |
| 是否写入 handoff marker / outcome body-free 裁决 | pass |
| 是否写入 report / archive handoff hint 与 worker entry excluded 裁决 | pass |
| 是否明确 reload authority 不回读 current truth / 不依赖 delivery truth | pass |
| 是否未写 transaction boundary、一致性策略、Step 13 retry / lock / lease、Step 14 config、error taxonomy、test case schema 或 implementation code | pass |
| 是否修改正式 `03-详细设计.md` | no |

next_allowed_action: 等待用户确认后进入 Step 11 `R11.21 transaction boundary 与 consistency strategy:先思考`;只允许思考 Command / Query / Inbound / Outbound / Job / Runtime / Handoff 的 transaction boundary、UnitOfWork 范围、commit/rollback 顺序、一致性策略、cross-store invariant 和 `R11.22` 写入边界;不得直接修改正式 `03-详细设计.md`;不得写 error taxonomy、Step 13 并发重试、Step 14 config key、test case schema 或 implementation code。

---

## R11.21 transaction boundary 与 consistency strategy:先思考

### 1. 当前模块目标

`R11.21` 只思考 Step 11 最后一组横向事务边界与一致性策略,为 `R11.22` 写入 transaction boundary table、commit / rollback ordering、cross-store invariant 和 consistency redline 做准备。当前模块不写最终事务表,不定义 lock / retry / TTL / scheduler lease,也不写 error taxonomy、config key 或 test case schema。

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm |
| 当前允许 | 思考 Command、Query、Inbound、Outbound、Operations Job、Runtime / Entry、Handoff 的 UnitOfWork 范围、提交顺序、rollback 红线、一致性策略和 `R11.22` 写入边界。 |
| 当前禁止 | 写最终 transaction boundary rows、一致性策略正式表、Step 13 并发/幂等算法、Step 12 error taxonomy、Step 14 config key、test case schema、implementation code 或正式 `03-详细设计.md`。 |

### 2. transaction family 切分思考

| family | Step 9 / 10 source | likely UnitOfWork boundary | R11.22 注意事项 |
|---|---|---|---|
| Command accepted mutation | shared command template: reserve -> load -> domain/policy -> save -> stored result -> commit | one application command UoW covering versioned truth/support writes,append-only audit/lineage hints,stored accepted result and candidate shell where candidate is emitted by accepted fact | do not call publisher/handoff/job body inside accepted truth transaction |
| Command rejected / conflict after reserve | command rejected branch and stored rejected surface | minimal UoW for idempotency decision / stored rejected result when durable replay is required | rejection taxonomy deferred to Step 12;reserve/complete atomicity deferred to Step 13 |
| Query read | Query no-write overlay and read/degraded state family | no write UoW;read-only repository snapshot / committed read only | no refresh,repair,append,publish,job start or stored query result |
| Inbound consumer receipt | inbound accepted / duplicate / malformed / delayed receipt overlay | receipt UoW only: intake summary / safe receipt / stored result;no core truth mutation | explicit Command owns later truth mutation;consumer does not create definition/version/material truth |
| Outbound publication | candidate assembly -> target registry -> publisher outcome | candidate reload UoW and publication outcome UoW separated from accepted truth;external publication failure records safe outcome only | no current-truth reread;no rollback of accepted truth;no delivery truth |
| Operations job | job shell -> task/checkpoint -> committed read -> derived material/progress/checkpoint/report | job item/page UoW covering derived material/progress/checkpoint/report shell;read committed truth before derived writes | no core truth repair;partial failure recorded as report/issue boundary |
| Handoff / archive / observability | handoff port and report/archive hint boundary | handoff marker/outcome UoW separate from report body and external system truth | no report/archive/package body;handoff failure does not roll back local truth |
| Runtime / entry | runtime precheck,adapter availability,facade-only entry | no business UoW;runtime-local summary may be copied only through formal stored result/receipt/report/outcome | entry must not own repository/UoW or concrete adapter call |

### 3. commit / rollback 顺序思考

| scenario | candidate ordering | rollback boundary | prohibited shortcut |
|---|---|---|---|
| accepted Command | reserve / idempotency precheck -> load versioned refs -> validate -> save truth/support/material -> append audit/lineage/event candidate hints -> save stored accepted result -> commit | if commit fails, no durable accepted result, no publication outcome, no handoff marker | commit truth then synthesize stored result outside UoW;publish before commit |
| rejected Command | reserve / validate -> save stored rejected/conflict surface when replayable -> commit | rejected surface rollback leaves duplicate branch unable to replay;Step 13 closes re-entry semantics | throw raw infra error or skip stored rejection when protocol requires replay |
| Query | load resolver/view/projection/material summaries -> assemble surface -> return | no rollback because no write | write stale repair,append audit,publish event,start job |
| Inbound accepted receipt | reserve inbound dedup -> resolve body-free source -> save intake summary / receipt -> commit | failed receipt commit means no accepted replay surface;raw envelope not persisted | mutate core truth from consumer or retry by reading broker/private offset |
| Outbound publish | load candidate shell -> resolve target summary -> call publisher seam -> save publication outcome -> commit outcome | failed outcome commit must not alter accepted truth;safe failure handling deferred | infer delivery truth from external ack or rebuild candidate from current truth |
| Job item/page | load task/checkpoint -> read committed targets -> write derived material/progress/checkpoint/report shell -> commit | failed item UoW rolls back derived material/progress/checkpoint/report for that item/page | repair core truth or use retry count/queue lease as checkpoint |
| Handoff | load report/candidate safe refs -> call handoff seam -> save handoff marker/outcome -> commit | failed marker commit must not rewrite report or external body | persist package/report/archive body or call external system to reconcile truth |

### 4. consistency strategy 思考

| consistency axis | intended rule | deferred detail |
|---|---|---|
| versioned truth consistency | mutable truth writes use loaded version / expected version;stale version rejects safely. | exact conflict classification belongs Step 12;atomic compare/save belongs Step 13. |
| append-only support consistency | audit,lineage,candidate,run history and evidence refs append body-free records only. | append id collision / dedup semantics belongs Step 13. |
| stored replay consistency | duplicate replay copies stored result / receipt / report / checkpoint and must not rerun mutation. | serialization and reserve/complete protocol belongs Step 13. |
| query consistency | Query reads committed truth/projection/material and returns safe absent/degraded/stale surface;it does not repair. | degraded/unavailable public mapping belongs Step 12/15. |
| derived material consistency | jobs may update read/trace/peripheral derived material and report partial failure;core truth remains unchanged. | job checkpoint resume and partial retry belongs Step 13/15. |
| outbound consistency | candidate is durable reload source;publication/handoff outcome never means downstream delivery truth. | publisher binding/config and observability belongs Step 14/15. |
| runtime consistency | runtime / adapter / entry availability is technical precondition;business state remains authoritative. | config source and diagnostic mapping belongs Step 14/12. |

### 5. cross-store invariant 思考

| invariant | reason | R11.22 expression |
|---|---|---|
| stored accepted result must not outlive rolled-back accepted truth | duplicate replay cannot claim accepted if truth write did not commit. | command accepted transaction table must place stored accepted result in same UoW as accepted truth writes or explicitly identify equivalent atomic boundary. |
| event candidate must be sourced from committed accepted fact/job/intake shell | publisher cannot rebuild from current truth or uncommitted side effects. | outbound transaction table must require candidate reload from durable shell. |
| publication/handoff failure must not rollback local truth | external publication/handoff is after local fact boundary. | consistency table must state no-rollback and safe outcome recording. |
| query no-write is absolute | reads must be repeatable and side-effect free. | query transaction table must mark no write UoW and forbidden side effects. |
| checkpoint is not version | job resume anchor cannot replace optimistic version of truth/material. | job table must separate checkpoint / cursor / version. |
| runtime-local state is not durable business truth | adapter availability/config binding cannot mutate domain truth. | runtime row must mark precheck-only / support-summary-only. |

### 6. R11.22 写入计划思考

`R11.22` 应写入四组表,把前面所有 persistence families 横向收口。

| write block | should write | should not write |
|---|---|---|
| transaction boundary table | Command / Query / Inbound / Outbound / Job / Handoff / Runtime rows with begin,read,write,commit,rollback and forbidden side effects. | physical SQL transaction syntax,lock mode,TTL,lease,retry count. |
| UnitOfWork / version table | expected_version source,append-only rule,checkpoint/cursor separation,stored result / receipt / report commit relation. | new repository method names or DB columns not already justified by Step 7/11. |
| consistency strategy table | no query write,no rollback from publication/handoff failure,stored replay no-rerun,job no-truth-repair,body-free store rule. | error code taxonomy,public safe message schema,observability metric schema. |
| cross-store invariant / watch closure | map R11.1~R11.20 watch items to R11.22 strategy or later Step 12~16 handoff. | claim unresolved Step 12/13/14/15 items are fully closed. |

### 7. watch / blocker 台账

| id | topic | issue | current handling | required closure |
|---|---|---|---|---|
| ML-D03-S11-WATCH-040 | accepted truth vs stored accepted result atomicity | stored accepted result must not commit separately from accepted truth unless an equivalent formal atomic boundary exists. | R11.21 marks as R11.22 transaction row requirement. | R11.22 table;Step 13 reserve/complete detail. |
| ML-D03-S11-WATCH-041 | query no-write enforcement | Query may be tempted to repair stale/degraded read material or append audit. | R11.21 marks no write UoW as absolute. | R11.22 query row and Step 16 no-write tests. |
| ML-D03-S11-WATCH-042 | outbound publication after commit | publication outcome must not occur inside accepted truth transaction. | R11.21 separates candidate shell from publisher outcome. | R11.22 outbound rows and Step 15 audit. |
| ML-D03-S11-WATCH-043 | job checkpoint vs version | checkpoint/cursor/run history can be confused with optimistic version. | R11.21 separates checkpoint/cursor from version. | R11.22 job row;Step 13 resume semantics. |
| ML-D03-S11-WATCH-044 | runtime / entry UoW ownership | entry/runtime may accidentally open UoW or call repository directly. | R11.21 marks runtime/entry as no business UoW. | R11.22 runtime row;Step 16 facade-only tests. |

### 8. R11.21 stop-review

| 检查项 | 结果 |
|---|---|
| 是否只思考 transaction boundary 与 consistency strategy | pass |
| 是否覆盖 Command / Query / Inbound / Outbound / Job / Handoff / Runtime | pass |
| 是否明确 query no-write、publication no-rollback、stored replay no-rerun、job no-truth-repair | pass |
| 是否形成 R11.22 写入计划 | pass |
| 是否未写最终 transaction table / consistency table | pass |
| 是否未写 Step 12/13/14/15/16 内容、implementation code 或正式 `03-详细设计.md` | pass |
| 是否修改正式 `03-详细设计.md` | no |

next_allowed_action: 等待用户确认后进入 Step 11 `R11.22 transaction boundary 与 consistency strategy:再写入`;只允许写入 Command / Query / Inbound / Outbound / Job / Runtime / Handoff 的 transaction boundary table、UnitOfWork / version / checkpoint separation、一致性策略表、cross-store invariant / watch closure 和 `R11.23` 进入门禁;不得直接修改正式 `03-详细设计.md`;不得写 error taxonomy、Step 13 并发重试算法、Step 14 config key、test case schema 或 implementation code。

---

## R11.22 transaction boundary 与 consistency strategy:再写入

### 1. 当前模块目标

`R11.22` 将 `R11.21` 的事务与一致性思考落成 Step 11 的横向收口表。当前模块只写 logical transaction boundary、UnitOfWork / version / checkpoint separation、一致性策略、cross-store invariant 和 watch closure;不写物理 DB 事务语法、lock / TTL / retry / lease、错误 taxonomy、配置 key、测试 case 或实施代码。

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm |
| 当前允许 | 写入 Command / Query / Inbound / Outbound / Job / Handoff / Runtime 的 transaction boundary table、UoW / version / checkpoint separation、consistency strategy、cross-store invariant / watch closure 和 `R11.23` 进入门禁。 |
| 当前禁止 | 写 SQL transaction isolation、lock mode、retry count、TTL、scheduler lease、error code、safe message schema、config key、test artifact schema、implementation code 或正式 `03-详细设计.md`。 |

### 2. transaction boundary table

| boundary | begin / read set | write set | same UoW / atomic boundary | commit / rollback rule | forbidden side effects |
|---|---|---|---|---|---|
| Command accepted mutation | reserve or verify idempotency;load versioned truth/support/material refs;load policy / marker inputs | versioned truth/support/material save;append audit/lineage/history refs;stored accepted result;event candidate shell if emitted | accepted truth writes,stored accepted result and body-free side-effect refs must be committed in one application command UoW or equivalent formal atomic boundary | rollback means no accepted result, no candidate, no publication/handoff outcome | publisher delivery,handoff delivery,job body,query repair,transport retry,raw body read |
| Command rejected / conflict | reserve or verify idempotency;validate typed refs/digest/scope/version | stored rejected/conflict result when replayable;safe diagnostic refs if formally available | replayable rejection result and idempotency decision share one minimal UoW | rollback leaves no durable replay surface;Step 13 defines re-entry | raw error persistence,untyped route/string reason,accepted truth mutation |
| Query read | load committed truth/projection/material/view/resolver summaries | none | no write UoW | no rollback state;query returns safe absent/not-visible/stale/degraded/unavailable surface | save/append/repair/refresh/publish/start job/store query replay |
| Inbound consumer receipt | reserve inbound dedup;load body-free source / adapter summary;validate receipt shell | intake summary,stored receipt,stored result or safe delayed/rejected surface | receipt and intake decision share receipt UoW;no core truth mutation | rollback means duplicate cannot replay accepted receipt;raw envelope remains unpersisted | create definition/version/material truth,store raw envelope,broker ack/offset as truth |
| Outbound publication | load durable event candidate shell;load target registry summary;call publisher seam | publication outcome shell with safe marker / reason / diagnostic refs | publication outcome UoW is separate from accepted truth UoW;candidate is reload source | outcome failure never rolls back accepted truth/candidate;missing outcome is recovery/observability issue later | rebuild candidate from current truth,store topic/payload/delivery receipt,claim subscriber success |
| Operations job item/page | load task/run/checkpoint;read committed targets;load derived material state | derived read/trace/peripheral material;progress view;checkpoint;run history;job report shell | item/page UoW covers derived writes,progress,checkpoint and report shell for that unit | rollback reverts item/page derived writes and progress/checkpoint/report for that unit | repair core truth,use retry count/queue lease as checkpoint,store report body/raw log |
| Handoff / archive / observability | load report/candidate/handoff-safe refs;call handoff seam | handoff marker/outcome shell with receipt/failure marker and safe hint refs | handoff outcome UoW is separate from report body and external system truth | failure does not rollback local truth/report/candidate;safe outcome may be recorded | persist package/report/archive body,external receipt body,raw exception,external state owner |
| Runtime / entry precheck | read runtime assembly / adapter availability / binding summary | none as business store;only formal stored result/receipt/report/outcome may copy safe marker | no business UoW owned by api/worker/jobs entry | entry failure returns safe blocked/unavailable surface through application facade | entry opens UoW,entry calls repository/domain transition/concrete adapter directly |

### 3. UnitOfWork / version / checkpoint separation

| concept | formal use in Step 11 | cannot replace | later closure |
|---|---|---|---|
| `UnitOfWork` | application-owned logical transaction boundary for accepted command,receipt,job item/outcome and marker writes. | repository method semantics,Step 13 lock/reserve protocol,entry local context. | Step 13 atomic reserve/complete and fake/durable parity. |
| expected version | optimistic guard for mutable truth/support/material owner loaded through formal repository read. | checkpoint,cursor,run history,idempotency key,route param. | Step 12 stale/conflict mapping;Step 13 compare/save atomicity. |
| append-only identity | audit,lineage,candidate,run history,report and evidence refs append body-free records. | mutable truth version or duplicate dedup key. | Step 13 append collision / duplicate behavior. |
| checkpoint / cursor | job resume anchor and page progress marker for derived material work. | optimistic version or accepted truth freshness. | Step 13 resume / partial retry. |
| stored result / receipt / report | replay-safe durable surface for duplicate branch. | public DTO body,raw error,event payload,report body. | Step 12 safe reason taxonomy;Step 13 replay serialization. |
| runtime availability marker | precondition input copied into safe result/degraded surface. | business truth lifecycle or config truth. | Step 14 config binding;Step 15 observability. |

### 4. consistency strategy table

| strategy | rule | applies to | deferred detail |
|---|---|---|---|
| accepted mutation atomicity | accepted truth/support/material writes and stored accepted replay surface commit together or not at all. | Command accepted flows. | Step 13 exact reserve/complete and retry behavior. |
| query no-write | Query opens no write UoW and cannot repair,refresh,append,publish,start job or store replay. | all Query flows. | Step 12/15 degraded mapping and observability. |
| no external rollback | publication/handoff/adapter failure records safe outcome/diagnostic only;it never rolls back committed local truth. | Outbound,Handoff,Runtime. | Step 12 failure recovery;Step 15 audit. |
| stored replay no-rerun | duplicate branch reads stored result/receipt/report/checkpoint and never reruns mutation or scans external queues. | Command,Inbound,Job. | Step 13 replay serialization and consistency failure handling. |
| job no-truth-repair | Operations job writes derived material/progress/checkpoint/report only;core truth remains command-owned. | Job flows. | Step 13 checkpoint resume;Step 15 report/evidence. |
| body-free persistence | source,outbound,handoff,audit,lineage,report stores persist typed refs,summary,marker,safe reason only. | all body-boundary families. | Step 12 body violation mapping;Step 15 evidence refs. |
| runtime facade-only | api/worker/jobs entry calls application facade and cannot own repository/UoW/concrete adapter. | Runtime / entry. | Step 16 facade-only tests. |

### 5. cross-store invariant / watch closure

| invariant / watch | R11.22 closure | remaining handoff |
|---|---|---|
| stored accepted result must not outlive rolled-back accepted truth | command accepted boundary requires accepted truth and stored accepted result in same logical UoW / atomic boundary. | Step 13 reserve/complete detail. |
| event candidate must come from committed shell | outbound boundary requires durable candidate shell / accepted fact / job report / intake receipt as source. | Step 13 candidate retry;Step 15 publication audit. |
| publication/handoff outcome is not delivery truth | transaction table and consistency table keep outcome shell separate from external truth. | Step 12 failure mapping;Step 15 observability. |
| query no-write | query boundary explicitly has no write set and forbids repair/refresh/event/job side effects. | Step 16 no-write tests. |
| checkpoint is not version | separation table states checkpoint/cursor is resume anchor,not optimistic version. | Step 13 checkpoint resume. |
| runtime / entry no business UoW | runtime row forbids entry-owned UoW and direct repository/adapter calls. | Step 14 config binding;Step 16 facade-only tests. |
| ML-D03-S11-WATCH-001~006 | ownership/logical store watch items remain covered by family rows and later Step handoff where needed. | External/body/config/error/evidence details stay Step 12/14/15/16. |
| ML-D03-S11-WATCH-028~039 | replay/runtime/outbound watch items have durable shell,body-free and no-rerun/no-delivery-truth rules. | replay algorithm Step 13;config Step 14;observability Step 15. |
| ML-D03-S11-WATCH-040~044 | accepted atomicity,query no-write,outbound after commit,checkpoint/version,entry UoW risks are closed at Step 11 strategy level. | exact algorithms/tests remain later Steps. |

### 6. Step 12~16 handoff from Step 11

| target Step | handoff item | not closed in Step 11 |
|---|---|---|
| Step 12 error / recovery | stale version,missing replay surface,body violation,publication/handoff blocked/unavailable/failed,query degraded/unavailable. | final error enum,public error code,safe message schema. |
| Step 13 concurrency / idempotency | idempotency reserve/complete,duplicate replay serialization,append collision,checkpoint resume,retry/re-entry. | lock mode,TTL,lease,retry count,queue scheduler semantics. |
| Step 14 config / dependency | runtime config binding,publisher/handoff target binding,adapter availability source,transport topic/URL/secret redline. | config key schema,secret/URL/topic values,transport product mapping. |
| Step 15 observability / audit | publication/handoff outcome audit,job report/run history observation,safe diagnostic and evidence refs. | metric labels,trace payload,raw logs,report body,evidence artifact schema. |
| Step 16 test cut | no-write,no-body,no-rollback,stored replay no-rerun,entry facade-only,checkpoint-not-version tests. | test case IDs,fixtures,evidence paths. |

### 7. R11.22 stop-review

| 检查项 | 结果 |
|---|---|
| 是否写入 transaction boundary table | pass |
| 是否写入 UnitOfWork / version / checkpoint separation | pass |
| 是否写入 consistency strategy table | pass |
| 是否写入 cross-store invariant / watch closure | pass |
| 是否明确 Step 12~16 handoff 且未伪装闭口 | pass |
| 是否未写 SQL / lock / TTL / retry / config / error taxonomy / test schema / implementation code | pass |
| 是否修改正式 `03-详细设计.md` | no |

next_allowed_action: 等待用户确认后进入 Step 11 `R11.23 cross-step closure audit 与正式 §10 候选草稿停审:先思考`;只允许思考 Step 6~10 到 Step 11 的闭环审计、watch/blocker 收口、正式 `03-详细设计.md` §10 候选草稿结构、不可装配项和 `R11.24` 写入边界;不得直接修改正式 `03-详细设计.md`;不得进入 Step 12;不得写 error taxonomy、Step 13 并发重试算法、Step 14 config key、test case schema 或 implementation code。

---

## R11.23 cross-step closure audit 与正式 §10 候选草稿停审:先思考

### 1. 当前模块目标

`R11.23` 只思考 Step 6~10 到 Step 11 的闭环审计方法、watch/blocker 收口、正式 `03-详细设计.md` §10 候选草稿结构和 `R11.24` 写入边界。当前模块不写最终 audit 表、不装配正式 03、不进入 Step 12,也不补 error taxonomy、Step 13 并发重试、Step 14 config key、Step 15 观测 schema 或 Step 16 test case。

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm |
| 当前允许 | 思考 cross-step closure audit、unresolved/deferred handoff 分类、正式 §10 候选结构、不可装配项和 `R11.24` 写入计划。 |
| 当前禁止 | 修改正式 `03-详细设计.md`、写 Step 12 错误模型、写 Step 13 lock/retry/TTL、写 Step 14 配置 key、写 Step 15 metric/evidence schema、写 Step 16 test case 或 implementation code。 |

### 2. closure audit 视角

Step 11 的最终收口不能只检查“是否有 store 表”,还必须检查每个上游 Step 的字段、port、surface、flow、state 是否能被 Step 11 的 persistence / transaction / consistency 契约承接。

| audit dimension | check question | R11.24 expected output |
|---|---|---|
| object field source | Step 6 每个 durable 字段是否有 owner、source、body-free rule、version / append rule。 | Step 6 -> Step 11 closure audit row。 |
| port / repository closure | Step 7 是否存在对应 read/write/list/save/result/publisher/handoff seam,且 Step 11 未新增私有 port。 | Step 7 -> Step 11 closure audit row。 |
| public / stored surface closure | Step 8 public DTO、stored replay、receipt/report/outcome shell 是否有 durable source 和 no raw body redline。 | Step 8 -> Step 11 closure audit row。 |
| flow transaction closure | Step 9 command/query/inbound/outbound/job flow 是否有 begin/read/write/commit/rollback/no-side-effect order。 | Step 9 -> transaction boundary audit row。 |
| state / side-effect closure | Step 10 state owner、transition precondition、side-effect boundary 是否被 logical store / UoW / consistency strategy 承接。 | Step 10 -> Step 11 closure audit row。 |
| watch/blocker handling | R11.1~R11.22 watch 是否被 closed、deferred_to_step、或 blocked 明确分类。 | unresolved/deferred handoff table。 |

### 3. Step 6~10 闭环思考

| upstream Step | Step 11 closure focus | current thought |
|---|---|---|
| Step 6 object contracts | durable truth、support summary、marker、stored result、job/report/handoff helper 的 owner、field source、body-free boundary。 | R11.6~R11.20 已按 family 覆盖;R11.24 应审计每个 family 是否有 key/version/append/body-free 裁决。 |
| Step 7 trait / port / adapter | repository、resolver、UnitOfWork、result store、publisher、handoff、runtime port 是否被 Step 11 使用且不新增未闭口方法。 | R11.8~R11.22 已按 formal port 语义表达;R11.24 应标明 Step 11 不创建新 port,缺口只能进入 blocker/handoff。 |
| Step 8 protocol contracts | command/query/inbound/outbound/job surface、stored replay、receipt/report/outcome shell 是否能回读和复制 safe marker。 | R11.17~R11.22 覆盖 stored replay / receipt / report / candidate / outcome shell;public error 细节仍转 Step 12。 |
| Step 9 function flows | accepted/rejected/duplicate/query/inbound/outbound/job/handoff 的 transaction hint 和 side-effect ordering。 | R11.21/R11.22 已横向收口;R11.24 应把 no query write、publication no rollback、duplicate no rerun 作为 closure 条款。 |
| Step 10 state machine | state owner、transition precondition、side-effect trigger、handoff to Step 11~16。 | R11.22 已承接 transaction 与 consistency;状态错误映射、retry、config、observability、tests 仍按 Step 12~16 分流。 |

### 4. watch / blocker 收口思考

`R11.24` 不应把所有 deferred detail 伪装为 Step 11 已闭口。分类应保持三类。

| category | meaning | example handling |
|---|---|---|
| closed_in_step11 | Step 11 已能给出 logical store、repository semantic、version/append、transaction 或 consistency rule。 | query no-write、stored replay no-rerun、checkpoint-not-version、publication no rollback。 |
| deferred_to_later_step | Step 11 给出边界和输入,但细节属于 Step 12~16。 | error taxonomy、lock/retry/TTL、config key、metric/evidence/test case。 |
| blocker_if_missing_formal_source | 上游缺正式字段/port/mapper/schema/source,Step 11 不能自行补。 | 未定义 durable source、未闭合 marker 来源、缺 replay surface、缺 repository save/get 对称面。 |

### 5. 正式 §10 候选草稿结构思考

正式 `03-详细设计.md` 的 §10 应由 `R11.24` 形成候选草稿,但仍停留在 design-calibration 文件内,等待后续正式装配 Step 19 统一回填。候选结构应足够接近正式章节,便于后续直接审校。

| §10 candidate block | expected content | source modules |
|---|---|---|
| §10.1 persistence scope and non-goals | logical contract scope、no physical DDL、no SQL product lock-in、body-free rule。 | R11.1~R11.6 |
| §10.2 data ownership and logical stores | ownership table、logical store families、excluded/runtime-local/watch items。 | R11.6~R11.20 |
| §10.3 repository and persistence semantics | read/write/list/save/result/outcome/report semantics,expected_version,append-only,query no-write。 | R11.8~R11.20 |
| §10.4 version / append / checkpoint rules | optimistic version,append identity,stored result/receipt/report replay,checkpoint/cursor separation。 | R11.8~R11.22 |
| §10.5 transaction boundaries | Command / Query / Inbound / Outbound / Job / Handoff / Runtime boundary table。 | R11.21/R11.22 |
| §10.6 consistency strategy | local strong consistency,eventual boundary,no external rollback,stored replay no rerun,job no-truth-repair。 | R11.22 |
| §10.7 body-free and replay redlines | no raw body,no public DTO as truth,no synthetic marker,no duplicate rerun。 | R11.9~R11.22 |
| §10.8 cross-step closure and handoff | Step 6~10 closure audit,unresolved/deferred table,Step 12~16 handoff。 | R11.23/R11.24 |

### 6. 不可在 Step 11 装配为 closed conclusion 的内容

| item | reason | target |
|---|---|---|
| public error taxonomy / safe message schema | Step 11 只定义 consistency issue source 和 replay/body-free boundary。 | Step 12 |
| lock mode / retry count / TTL / lease / scheduler policy | Step 11 只定义 transaction boundary 和 version/checkpoint separation。 | Step 13 |
| config key / topic / URL / secret / adapter binding values | Step 11 只定义 runtime/config refs 和 availability marker边界。 | Step 14 |
| metric labels / trace span payload / evidence artifact schema | Step 11 只定义 observable state/outcome/report refs。 | Step 15 |
| test case IDs / fixtures / report paths | Step 11 只给验证切口,不生成测试方案。 | Step 16 |
| formal document assembly | 本轮仍是中间产物,正式 `03-详细设计.md` 不在 R11.23/R11.24 直接修改。 | Step 19 |

### 7. R11.24 写入计划思考

| write block | should write | should not write |
|---|---|---|
| cross-step closure audit table | Step 6~10 到 Step 11 的 closure row、covered module、remaining handoff。 | 复制 Step 6~10 全文或引入新领域语义。 |
| unresolved/deferred handoff table | closed_in_step11 / deferred_to_step12~16 / blocker_if_missing_formal_source 分类。 | 把 deferred 项标为 complete。 |
| formal §10 candidate draft | 章节结构和可装配候选内容,仍保留在 calibration 文件。 | 直接修改正式 `03-详细设计.md`。 |
| Step 11 final stop-review | Step 11 自检、formal assembly handoff、进入 Step 12 的门禁。 | 写 Step 12 内容或进入 Step 12 执行。 |

### 8. R11.23 stop-review

| 检查项 | 结果 |
|---|---|
| 是否只思考 cross-step closure audit 和正式 §10 候选结构 | pass |
| 是否覆盖 Step 6~10 到 Step 11 的审计视角 | pass |
| 是否明确 watch/blocker 分类方式 | pass |
| 是否形成 R11.24 写入计划 | pass |
| 是否未修改正式 `03-详细设计.md` | pass |
| 是否未写 Step 12/13/14/15/16 内容、test schema 或 implementation code | pass |

next_allowed_action: 等待用户确认后进入 Step 11 `R11.24 cross-step closure audit 与正式 §10 候选草稿停审:再写入`;只允许写入 Step 6~10 到 Step 11 的 closure audit table、unresolved/deferred handoff table、正式 `03-详细设计.md` §10 候选草稿结构、Step 11 final stop-review 和 Step 12 进入门禁;不得直接修改正式 `03-详细设计.md`;不得写 Step 12 错误 taxonomy、Step 13 并发重试算法、Step 14 config key、Step 15 observability schema、Step 16 test case schema 或 implementation code。

---

## R11.24 cross-step closure audit 与正式 §10 候选草稿停审:再写入

### 1. 当前模块目标

`R11.24` 将 `R11.23` 的收口思考写成 Step 11 最终中间产物:cross-step closure audit、unresolved/deferred handoff、正式 `03-详细设计.md` §10 候选草稿和 Step 11 final stop-review。当前模块仍不修改正式 `03-详细设计.md`,不进入 Step 12 具体错误模型,不写并发重试、配置、观测或测试 schema。

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm |
| 当前允许 | 写入 Step 6~10 到 Step 11 的 closure audit、deferred handoff、正式 §10 候选草稿、Step 11 stop-review 和 Step 12 进入门禁。 |
| 当前禁止 | 修改正式 `03-详细设计.md`、写 Step 12 error taxonomy、Step 13 retry/lock/TTL、Step 14 config key、Step 15 observability schema、Step 16 test case schema 或 implementation code。 |

### 2. cross-step closure audit table

| upstream step | closure requirement | Step 11 closure | status | remaining handoff |
|---|---|---|---|---|
| Step 6 object contracts | durable truth/support/marker/stored-result/job/report/handoff objects must have owner,field source,identity,version/append rule and body-free boundary. | R11.6~R11.20 classify objects into truth,summary,marker_only,projection,append-only,stored shell,runtime-local and watch;R11.22 adds transaction and consistency redlines. | closed_at_step11_boundary | error mapping Step 12;config/runtime source Step 14;observability/test coverage Step 15/16. |
| Step 7 trait / port / adapter | persistence semantics may only use formal repository/resolver/UoW/result-store/publisher/handoff/runtime ports;Step 11 must not invent private save/get/list methods. | R11.8~R11.20 bind logical stores to existing formal port families;missing sources are recorded as watch/blocker rather than filled by Step 11. | closed_at_step11_boundary | exact atomic reserve/complete and fake/durable parity Step 13. |
| Step 8 protocol contracts | public surfaces,stored replay surfaces,receipt/report/outcome shells must have durable safe sources and no raw body persistence. | R11.17~R11.22 define stored result/receipt/report/candidate/outcome replay authority and body-free redlines. | closed_at_step11_boundary | safe error surface Step 12;evidence/report artifact schemas Step 15/16. |
| Step 9 function flows | command,query,inbound,outbound,job,handoff flows must have transaction hint,side-effect ordering,rollback/no-rollback rule and duplicate replay source. | R11.21/R11.22 write Command/Query/Inbound/Outbound/Job/Handoff/Runtime transaction boundary table and consistency strategy. | closed_at_step11_boundary | retry/re-entry and scheduler semantics Step 13. |
| Step 10 state matrix | durable state owners,transition preconditions,side-effect triggers and Step 11~16 handoff must map to persistence and consistency rules. | R11.6~R11.22 map state owners to logical stores,versioned writes,append-only records,no-write query and post-commit side effects. | closed_at_step11_boundary | public recovery wording Step 12;config/observability/test cut Step 14~16. |
| historical material | old Step 11 / old formal 03 must not leak old `MethodContent`,old outbox,snapshot,dead-letter,P0/P1 or physical SQL conclusions. | R11.1/R11.2 mark old material as historical pollution;R11.24 formal candidate only uses current Step 1~10 and current R11 modules. | closed | final assembly Step 19 must repeat pollution check. |

### 3. unresolved / deferred handoff table

| item | class | Step 11 decision | target |
|---|---|---|---|
| accepted truth plus stored accepted result atomicity | closed_in_step11 | accepted mutation boundary requires truth/support/material writes and stored accepted replay surface to commit in the same logical UoW or equivalent formal atomic boundary. | Step 13 defines reserve/complete algorithm and retry behavior. |
| query no-write | closed_in_step11 | all query flows have no write UoW and cannot repair,refresh,append,publish,start jobs or store replay. | Step 16 verifies no-write cut. |
| duplicate replay no-rerun | closed_in_step11 | duplicate branches read stored result/receipt/report/checkpoint and never rerun mutation or external intake. | Step 13 defines replay serialization and consistency failure behavior. |
| publication/handoff no rollback | closed_in_step11 | publication/handoff outcomes are separate from accepted truth and never roll back committed local facts. | Step 12/15 define failure surface and observation. |
| checkpoint is not version | closed_in_step11 | job checkpoint/cursor is resume anchor only and cannot replace optimistic version. | Step 13 defines resume/partial retry. |
| body-free persistence redline | closed_in_step11 | source,reference,audit,outbound,handoff,report stores persist typed refs,summary,digest,marker and safe reason only. | Step 12 maps body violation;Step 15/16 validate evidence/test cut. |
| external source unavailable / invalid body / schema drift | deferred_to_later_step | Step 11 keeps source summary/body-free marker boundary but does not define public error taxonomy or adapter config. | Step 12 and Step 14. |
| downstream consumption boundary adjustment | deferred_to_later_step | Step 11 records boundary decision as summary/watch,not a new truth source. | Step 12 recovery and Step 15 audit. |
| runtime adapter availability and binding | deferred_to_later_step | runtime/entry is facade-only and can copy availability markers;it does not own business UoW or config truth. | Step 14 config binding;Step 16 facade-only tests. |
| metric labels,trace payload,evidence artifact schema | deferred_to_later_step | Step 11 exposes safe refs/outcome/report sources only. | Step 15 and Step 16. |
| missing formal source / port / marker / schema discovered later | blocker_if_missing_formal_source | implementation or later Step must pause rather than synthesize source,port,mapper,marker or schema. | Return to owning design Step and update truth source. |
| formal `03-详细设计.md` assembly | deferred_to_later_step | §10 candidate remains in calibration;formal document is not modified here. | Step 19 formal assembly. |

### 4. 正式 `03-详细设计.md` §10 候选草稿

以下内容是正式 §10 的候选结构和可装配草稿,仍保存在当前中间产物中。Step 19 装配正式文档时必须再次核对 Step 12~18 的新增约束,不得直接机械复制。

#### §10.1 数据持久化、事务与一致性范围

L3-method-library 的持久化契约采用 logical persistence contract,不绑定物理数据库产品、SQL 方言、migration 文件或索引实现语法。本节只定义业务数据所有权、logical store family、repository 持久化语义、version / append / checkpoint 规则、transaction boundary 和一致性红线。

本节明确不定义 public error code、safe message schema、retry count、TTL、lock lease、scheduler lease、config key、topic/URL/secret、metric label、trace span payload、test fixture 或 evidence artifact schema。这些内容分别由 Step 12~16 继续闭合。

#### §10.2 数据所有权与 logical store family

| family | persistence kind | owner | write authority | read authority | body-free rule |
|---|---|---|---|---|---|
| core business truth | mutable truth | domain/application service | command / formalization / consumption / relation / package / assembly services | command,query,job | typed refs,summary and version only |
| source / reference / boundary summaries | summary / marker_only / watch | domain/application support | source resolver,intake,boundary guard | query,maintenance,precheck | no raw external body |
| trace / audit / lineage / impact | projection / append-only | domain/application support | trace,audit,lineage,impact services | query,export,job | refs,marker,safe reason only |
| read / projection / material freshness | projection / marker_only | application query/material services | projection/refresh job and read resolver | query service | copy-only marker;query no write |
| maintenance / job / report | stored shell / append-only | application job runner | job runner | operations query,report replay | checkpoint/report shell only |
| idempotency / stored replay / inbound receipt | stored shell | application service | command/consumer/job service | duplicate replay path | stored safe surface only |
| outbound / publication / handoff | append-only / stored shell | application publisher/handoff service | publisher/handoff service | audit/operations | candidate/outcome marker only |
| runtime / entry binding | runtime-local | infra/runtime | runtime assembly | precheck/facade | config refs and availability marker only |

#### §10.3 repository 与持久化语义

Repository and persistence ports must be those defined by Step 7. Step 11 may describe semantics for existing formal ports, but cannot create private implementation-only save/get/list methods. Mutable truth writes use versioned read plus `expected_version` save semantics. Append-only records use append identity and must not be mutated into current truth. Stored result,receipt,report,candidate,outcome and handoff shells are durable replay/observation surfaces,not public DTO bodies or external payload stores.

Query flows open no write UoW. Query service can read committed truth,projection,material,summary,report and resolver output,then return safe visible/not-visible/stale/degraded/unavailable surface. It cannot repair stale material,refresh projections,append audit,publish events,start jobs or store query replay.

#### §10.4 version / append / checkpoint rules

| concept | rule |
|---|---|
| expected version | optimistic guard for mutable truth/support/material loaded through formal repository reads. |
| append identity | identity for audit,lineage,candidate,run history,report and evidence refs;not a replacement for mutable truth version. |
| stored replay surface | duplicate command/inbound/job branch must read stored result/receipt/report/checkpoint,not rerun mutation. |
| checkpoint / cursor | job resume/page progress anchor only;cannot replace optimistic version or accepted truth freshness. |
| runtime availability marker | copied into safe blocked/degraded surface;not business lifecycle truth. |

#### §10.5 transaction boundary

| boundary | atomic rule | rollback / no-rollback rule |
|---|---|---|
| Command accepted mutation | accepted truth/support/material writes,stored accepted result and body-free candidate refs commit in one logical UoW or equivalent formal atomic boundary. | rollback leaves no accepted replay surface and no event candidate. |
| Command rejected / conflict | replayable rejection/conflict result and idempotency decision share one minimal UoW. | rollback leaves no durable replay surface. |
| Query read | no write UoW. | no rollback state;return safe read surface only. |
| Inbound consumer receipt | receipt and intake decision share receipt UoW;no core truth mutation. | rollback means duplicate cannot replay accepted receipt. |
| Outbound publication | publication outcome is separate from accepted truth;candidate is reload source. | failure never rolls back accepted truth/candidate. |
| Operations job item/page | derived writes,progress,checkpoint and report shell commit per item/page UoW. | rollback reverts that unit's derived material/progress/checkpoint/report. |
| Handoff / archive / observability | handoff outcome is separate from local truth/report/candidate. | external failure never rolls back local committed truth. |
| Runtime / entry precheck | entry owns no business UoW. | entry returns safe facade surface only. |

#### §10.6 consistency strategy

The consistency model combines local strong consistency for accepted mutation boundaries with eventual consistency for outbound publication,handoff,derived material and observability. Local truth remains command-owned. Jobs may rebuild derived material and reports but cannot repair core truth. Publication/handoff/adapter failures produce safe outcome or diagnostic refs,never rollback committed local facts. Duplicate replay reads durable stored surfaces and never reruns side effects.

#### §10.7 body-free and replay redlines

Persistence must not store raw external body,transport payload,report body,raw exception text,public DTO body or synthetic marker. Stored artifacts are typed refs,version refs,summary refs,digests,markers,safe reasons and replay-safe shells. If a required formal source,marker,mapper,port or schema is absent,implementation and later design Steps must pause and return to the owning design truth source.

#### §10.8 Step 12~16 handoff

Step 12 owns error taxonomy,recovery surface and safe message schema. Step 13 owns idempotency reserve/complete,retry,re-entry,locking,lease,checkpoint resume and duplicate serialization. Step 14 owns config key,dependency binding,topic/URL/secret and adapter availability source. Step 15 owns observability,metric/trace/audit/evidence contracts. Step 16 owns test cut,fixtures,case IDs and evidence path validation.

### 5. Step 11 final stop-review

| 检查项 | 结果 |
|---|---|
| 是否完成 Step 6~10 到 Step 11 closure audit | pass |
| 是否写入 unresolved/deferred handoff table | pass |
| 是否形成正式 §10 候选草稿且保留在 calibration 文件 | pass |
| 是否明确 Step 12~16 责任边界 | pass |
| 是否保持 no private port / no synthetic marker / no raw body / query no-write / duplicate no-rerun | pass |
| 是否未修改正式 `03-详细设计.md` | pass |
| 是否未写 Step 12/13/14/15/16 具体内容、test schema 或 implementation code | pass |

### 6. Step 12 进入门禁

Step 11 到此完成到 `completed_wait_user_confirm`。进入 Step 12 前,下一位 agent 必须先读取:

- `projects/L3-method-library/design-calibration/project_execution_ledger.md`
- `projects/L3-method-library/design-calibration/03_ddd_calibration_flow.md`
- 当前文件的 R11.21~R11.24 收口段
- Step 6~10 中与错误、恢复、degraded/unavailable、conflict、replay consistency failure、body violation、adapter unavailable 相关的正式中间产物

next_allowed_action: 等待用户确认后进入 Step 12 `R12.1 开工与必读文档:先思考`;只允许思考 Step 12 的必读文档、错误/异常/恢复输入边界、Step 11 handoff 承接、L1-governance 框架参考和 R12 模块计划;不得直接修改正式 `03-详细设计.md`;不得提前写完整 error taxonomy、retry/lock/TTL、config key、observability schema、test case schema 或 implementation code。

---

## R11.6 数据所有权与 logical store 筛选:再写入

### 1. 当前模块目标

`R11.6` 把 R11.5 的筛选结果落成可审计表,只写数据所有权筛选表、logical store 候选表、watch / blocker 表和后续分配,不展开完整 repository / transaction / consistency 契约。

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm |
| 当前允许 | 写入数据所有权筛选表、logical store 候选表、watch / blocker 表和后续分配。 |
| 当前禁止 | 写完整 per-store contract、repository semantic rows、transaction boundary rows、一致性策略 rows、error taxonomy、config key、test case schema、implementation code 或正式 `03-详细设计.md`。 |

### 2. 数据所有权筛选表

| candidate | source | owner module | persistence kind | write owner | read owner | body-free rule | decision | reason | next module |
|---|---|---|---|---|---|---|---|---|---|
| `MethodAssetDefinition` / `MethodAssetCatalogEntry` | Step 6 core truth | domain | mutable truth | definition/catalog services | command/query services | refs + summary only | enter | definition/catalog have independent lifecycle and versioned save | R11.7/R11.8 |
| `FormalizationState` / `FormalMethodAssetVersion` | Step 6 core truth | domain | mutable truth | formalization/version services | command/query services | refs + version only | enter | formalization and supersession need durable owner | R11.7/R11.8 |
| `MethodAssetConsumptionMaterial` | Step 6 material truth | domain | mutable truth | consumption service | query/job services | body-free material only | enter | consumption material has formal freshness and availability owner | R11.7/R11.8 |
| `MethodAssetRelation` | Step 6 relation truth | domain | mutable truth | relation service | query/trace services | refs only | enter | relation integrity needs versioned persistence | R11.7/R11.8 |
| `MethodPackage` / `MethodSetAssembly` | Step 6 peripheral truth | domain | mutable truth | package/assembly services | query/publication services | refs + summary only | enter | package and assembly have independent lifecycle and composition rules | R11.7/R11.8 |
| `FormalizationBasisSummary` | Step 6 support summary | domain | marker_only | formalization service | query/precheck services | summary only | marker_only | basis summary is a precondition artifact,not a truth owner | R11.9/R11.10 |
| `ExternalSourceSummary` | Step 6 external summary | domain | watch | source resolver / intake | query / maintenance | summary only | watch | unavailable/body-violation/schema support still needs later closure | Step 12 / Step 14 |
| `DefinitionUseBoundaryGuard` / `ExternalBodyBoundaryRule` | Step 6 policy guard | domain | marker_only | policy / intake services | query / flow precheck | marker only | marker_only | boundary guard only emits safe rejection / violation markers | R11.9/R11.10 |
| `DownstreamConsumptionBoundary` | Step 6 boundary decision | domain | watch | consumption service | query / maintenance | summary only | watch | durable owner for boundary adjustment still needs closure | Step 11 / Step 12 |
| `MethodAssetTraceMaterial` | Step 6 trace material | domain | projection | trace service | query / job services | refs only | enter | trace material has freshness / refresh lifecycle | R11.11/R11.12 |
| `ConsumptionImpactSummary` | Step 6 impact summary | domain | projection | impact service | query / job services | refs only | enter | impact summary is a derived read model with recovery path | R11.11/R11.12 |
| `MethodAssetAuditTrail` / `MethodAssetEvidenceLineage` | Step 6 audit / lineage support | domain | append-only | audit / lineage services | query / export services | refs only | enter | audit and lineage are append-only support records | R11.11/R11.12 |
| `MethodAssetReadDecision` / `MethodAssetDegradedDecision` | Step 6 read helper | application | marker_only | query service | query / UI entry | marker only | marker_only | read decisions copy resolver output,not a truth lifecycle | R11.13/R11.14 |
| `ReadMaterialRefreshTask` / `TraceMaterialRefreshTask` / `ConsistencyRecoveryTask` | Step 6 job helper | application | stored shell | job runner | operator / query / report | body-free shell only | enter | refresh/recovery tasks need durable shell and progress tracking | R11.15/R11.16 |
| `MaintenanceProgressView` / `run history` / `checkpoint` / `job report` | Step 6 job/view shell | application | stored shell | job runner | operations / query | shell only | enter | progress/report/checkpoint require durable replay surface | R11.15/R11.16 |
| `MethodAssetIdempotencyGuard` / `MethodAssetStoredOperationResult` | Step 6 replay helper | application | stored shell | command / consumer / job service | duplicate replay path | shell only | enter | duplicate replay needs stored result and dedup guard | R11.17/R11.18 |
| `Inbound receipt` / replay surface | Step 8 inbound shell | application | stored shell | inbound consumer | replay / audit | shell only | enter | inbound accepted/rejected result needs stored receipt surface | R11.17/R11.18 |
| `MethodAssetEventCandidateAssembly` / `publication outcome` | Step 6 outbound helper | application | append-only / stored shell | publisher service | publication audit | refs + summary only | enter | candidate and outcome must stay body-free and reloadable | R11.19/R11.20 |
| `Handoff marker` / `handoff binding` | Step 6 handoff helper | application | stored shell | handoff service | audit / operations | marker only | enter | handoff needs traceable body-free marker | R11.19/R11.20 |
| runtime binding states | Step 6 infra state | infra | runtime-local | runtime assembly | runtime checks | config refs only | runtime-local | binding states are technical,not business durable truth | R11.17/R11.18 |

### 3. logical store 候选表

| logical store | persistence kind | primary identity | unique key | lookup/index | version / append rule | body-free rule | filled by |
|---|---|---|---|---|---|---|---|
| `method_asset_definitions` | truth | `definition_ref` | `definition_ref` | `catalog_scope_ref`,`current_version_ref` | versioned save | refs + summary only | R11.7/R11.8 |
| `method_asset_catalog_entries` | truth | `catalog_entry_ref` | `(definition_ref, catalog_scope_ref)` | `definition_ref`,`catalog_scope_ref` | versioned save | refs + summary only | R11.7/R11.8 |
| `formalization_states` | truth | `formalization_ref` | `formalization_ref` | `definition_ref`,`state_kind` | versioned save | refs only | R11.7/R11.8 |
| `formal_method_asset_versions` | truth | `version_ref` | `(definition_ref, version_kind)` | `definition_ref`,`version_kind` | versioned save | refs + version only | R11.7/R11.8 |
| `method_asset_consumption_materials` | truth | `material_ref` | `(formal_version_ref, consumption_context_ref)` | `formal_version_ref`,`consumption_context_ref` | versioned save | refs + summary only | R11.7/R11.8 |
| `method_asset_relations` | truth | `relation_ref` | `(left_asset_ref, right_asset_ref, relation_kind)` | `left_asset_ref`,`right_asset_ref`,`relation_kind` | versioned save | refs only | R11.7/R11.8 |
| `method_packages` | truth | `package_ref` | `(package_scope_ref, package_kind)` | `package_scope_ref`,`package_kind` | versioned save | refs + summary only | R11.7/R11.8 |
| `method_set_assemblies` | truth | `assembly_ref` | `(assembly_scope_ref, assembly_kind)` | `assembly_scope_ref`,`assembly_kind` | versioned save | refs + summary only | R11.7/R11.8 |
| `formalization_basis_summaries` | summary | `basis_summary_ref` | `(definition_ref, basis_kind)` | `definition_ref`,`basis_kind` | immutable summary | summary only | R11.9/R11.10 |
| `external_source_summaries` | summary | `source_summary_ref` | `(external_source_ref, source_version_ref)` | `external_source_ref`,`source_version_ref` | immutable summary | summary only | Step 12 / Step 14 |
| `downstream_consumption_boundaries` | marker | `boundary_ref` | `(formal_version_ref, downstream_scope_ref)` | `formal_version_ref`,`downstream_scope_ref` | versioned marker | summary only | Step 11 / Step 12 |
| `method_asset_trace_materials` | projection | `trace_material_ref` | `(definition_ref, trace_kind, source_cursor)` | `definition_ref`,`trace_kind`,`source_cursor` | append/replace by version | refs only | R11.11/R11.12 |
| `consumption_impact_summaries` | projection | `impact_summary_ref` | `(consumption_context_ref, impact_kind)` | `consumption_context_ref`,`impact_kind` | replace by version | refs only | R11.11/R11.12 |
| `method_asset_audit_trails` | append-only | `audit_trail_ref` | `audit_subject_ref` | `audit_subject_ref`,`latest_trace_ref` | append-only | refs only | R11.11/R11.12 |
| `method_asset_evidence_lineages` | append-only | `lineage_ref` | `(evidence_kind, evidence_ref)` | `evidence_kind`,`evidence_ref` | append-only | refs only | R11.11/R11.12 |
| `method_asset_read_decisions` | marker | `read_decision_ref` | `(read_subject_ref, visibility_scope_ref)` | `read_subject_ref`,`visibility_scope_ref` | marker update | marker only | R11.13/R11.14 |
| `maintenance_progress_views` | projection | `progress_view_ref` | `(job_kind, job_scope_ref)` | `job_kind`,`job_scope_ref` | replace by version | shell only | R11.15/R11.16 |
| `read_material_refresh_runs` | stored shell | `run_ref` | `(task_kind, task_scope_ref)` | `task_kind`,`task_scope_ref` | versioned shell | shell only | R11.15/R11.16 |
| `trace_material_refresh_runs` | stored shell | `run_ref` | `(task_kind, task_scope_ref)` | `task_kind`,`task_scope_ref` | versioned shell | shell only | R11.15/R11.16 |
| `consistency_recovery_runs` | stored shell | `run_ref` | `(task_kind, task_scope_ref)` | `task_kind`,`task_scope_ref` | versioned shell | shell only | R11.15/R11.16 |
| `job_reports` | stored shell | `report_ref` | `(job_ref, report_kind)` | `job_ref`,`report_kind` | immutable or superseded | shell only | R11.15/R11.16 |
| `method_asset_idempotency_records` | stored shell | `idempotency_ref` | `(operation_kind, idempotency_key)` | `operation_kind`,`idempotency_key` | reservation + complete | shell only | R11.17/R11.18 |
| `stored_method_asset_operation_results` | stored shell | `result_ref` | `(operation_kind, request_digest)` | `operation_kind`,`request_digest` | immutable after save | shell only | R11.17/R11.18 |
| `inbound_receipts` | stored shell | `receipt_ref` | `(source_kind, source_ref, receipt_kind)` | `source_kind`,`source_ref` | immutable after save | shell only | R11.17/R11.18 |
| `event_candidate_assemblies` | append-only | `candidate_ref` | `(event_kind, subject_ref, truth_change_ref)` | `event_kind`,`subject_ref` | append-only | refs only | R11.19/R11.20 |
| `publication_outcomes` | stored shell | `publication_ref` | `(candidate_ref, target_ref)` | `candidate_ref`,`target_ref` | versioned outcome | refs + summary only | R11.19/R11.20 |
| `handoff_markers` | stored shell | `handoff_ref` | `(handoff_kind, target_ref, package_ref)` | `handoff_kind`,`target_ref` | versioned marker | marker only | R11.19/R11.20 |

### 4. watch / blocker 表

| id | candidate / topic | issue | required closure step | current handling |
|---|---|---|---|---|
| ML-D03-S11-WATCH-001 | `ExternalSourceSummary` | availability / body-violation / schema support 还需 formal closure。 | Step 12 / Step 14 | 保留 summary 形态,不升格 truth。 |
| ML-D03-S11-WATCH-002 | `DownstreamConsumptionBoundary` | durable owner 和可更新边界仍需确认。 | Step 11 / Step 12 | 先作为 marker,不写扩散规则。 |
| ML-D03-S11-WATCH-003 | `MethodAssetReadDecision` / `MethodAssetDegradedDecision` | marker 来源必须回指 resolver / mapper / availability 输出。 | Step 12 / Step 15 | 只复制上游 marker,不合成。 |
| ML-D03-S11-WATCH-004 | `maintenance_progress_views` / `job_reports` | report / checkpoint / evidence body schema 不能在此层闭口。 | Step 15 / Step 16 | 只保留 shell 和 run history。 |
| ML-D03-S11-WATCH-005 | `event_candidate_assemblies` / `publication_outcomes` | publisher reload、target registry、publication failure mapping 仍待闭口。 | Step 11 / Step 14 / Step 15 | 只保留 candidate / outcome shell。 |
| ML-D03-S11-WATCH-006 | runtime binding states | config key / secret / URL / topic / transport 仍属于后续配置层。 | Step 14 | 归 runtime-local,不进入 durable store。 |

### 5. R11.6 stop-review

| 检查项 | 结果 |
|---|---|
| 是否写入数据所有权筛选表 | pass |
| 是否写入 logical store 候选表 | pass |
| 是否写入 watch / blocker 表 | pass |
| 是否覆盖 core truth / source / trace / read / job / replay / outbound / runtime 族 | pass |
| 是否未进入完整 repository / transaction / consistency 表 | pass |
| 是否未修改正式 `03-详细设计.md` | no |

next_allowed_action: 等待用户确认后进入 Step 11 `R11.7 core business truth 持久化契约:先思考`;只允许思考 definition、catalog、formalization、formal version、consumption material、relation、package、assembly 的持久化契约;不得直接修改正式 `03-详细设计.md`;不得写 source/reference、trace/audit、read/projection、maintenance/job、idempotency/replay、outbound/handoff 的完整 contract、repository semantic 表、transaction boundary 表、一致性策略表、error taxonomy、config key、test case schema 或 implementation code。
