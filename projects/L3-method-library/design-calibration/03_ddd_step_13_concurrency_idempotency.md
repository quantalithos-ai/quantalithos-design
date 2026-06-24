# Step 13. 定义并发、幂等与重入保护

> 对应 SOP: `standards/document/详细设计讨论流程_SOP.md` Step 13
> 回填章节: `projects/L3-method-library/03-详细设计.md` §12 并发、幂等与重入保护
> 创建日期: 2026-06-24
> 当前模式: full-restart / step13-concurrency-idempotency
> 当前状态: completed_wait_user_confirm
> 当前模块: `R13.16 cross-step closure audit 与正式 §12 候选草稿停审:再写入`
> 当前门禁: `R13.16` completed_wait_user_confirm;等待确认进入 Step 14 `R14.1 开工与必读文档:先思考`

---

## 0. 文件重置记录

旧 `03_ddd_step_13_concurrency_idempotency.md` 曾标记为 `[x] 已确认`,但其内容围绕旧 `MethodContent`、旧 `OutboxStatus`、旧 `IdempotencyStatus`、旧 `JobRunStatus`、revision、old outbox、seed/replay/recalculate/rebuild job、dry_run 和旧 checkpoint 口径展开。该 completed 状态和旧并发/幂等结论全部失效。

当前 Step 13 不继承旧 idempotency key、request_hash、revision、row lock、unique constraint、outbox claim、lease、checkpoint compare-and-swap、dry_run 或旧 job scope 结论。旧内容只能作为 historical pollution 和差异审计输入,不得作为当前 L3-method-library 并发、幂等或重入保护的正向来源。

当前 Step 13 的唯一正向基线是:

- 当前 `00-需求文档.md`、`01-架构设计.md`、`02-概要设计.md`。
- 本轮 `03-详细设计` Step 1~12 中间产物。
- 特别是 Step 8 protocol contracts、Step 9 function flows、Step 10 state matrix、Step 11 persistence / transaction / consistency 和 Step 12 error / recovery handoff。

---

## R13.1 开工与必读文档:先思考

### 1. 当前模块目标

`R13.1` 只思考 Step 13 的开工边界、必读文档、L1-governance Step 13 框架参考、Step 12 handoff 承接、并发/幂等/重入保护分批计划和旧 Step 13 污染隔离方式。当前模块不写完整 idempotency reserve/complete 状态机、retry / lock / TTL / lease / checkpoint resume 算法、concurrency matrix 或 formal §12 候选草稿。

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm |
| 当前允许 | 思考必读文档、输入边界、Step 12 handoff、L1-governance 框架参考、旧 Step 13 污染隔离和 `R13.2` 写入边界。 |
| 当前禁止 | 写完整 reserve/complete 状态机、retry algorithm、lock/lease/TTL、checkpoint resume algorithm、config key、observability schema、test case schema、implementation code 或正式 `03-详细设计.md`。 |

### 2. Step 13 启动前必须承接

| 输入 | 必须承接的内容 | 禁止继承 / 禁止提前 |
|---|---|---|
| `project_execution_ledger.md` | 当前恢复点、单模块推进规则、Step 12 completed_wait_user_confirm_to_step13。 | 跳过 R13.1/R13.2 直接写完整幂等算法。 |
| `03_ddd_calibration_flow.md` | Step 12 completed、Step 13 waiting_user_confirm_to_R13.1、Step 14+ blocked。 | 将 config、observability、test schema 提前写入 Step 13。 |
| `03_ddd_step_12_errors_recovery.md` R12.15~R12.16 | duplicate replay no-rerun、commit unknown、version conflict、retryable unavailable、post-commit no rollback、checkpoint blocked/manual handoff。 | 改写 Step 12 public error surface 或把 consistency failure 变成自动重跑。 |
| `03_ddd_step_11_persistence_tx_consistency.md` R11.21~R11.24 | transaction boundary、stored replay surface、checkpoint/report/run history、publication/handoff no rollback。 | 发明 Step 11 没有的 store/port/atomic boundary。 |
| `03_ddd_step_10_state_machine.md` | idempotency/replay/runtime/entry/outbound/job 状态及 state owner。 | 将状态矩阵扩写成 retry config 或 worker implementation。 |
| `03_ddd_step_09_function_flows.md` | 58 Command、57 Query、4 Inbound、34 Outbound、8 Job 的 duplicate/replay/commit/outcome branch。 | 让 Query 写幂等记录、重跑 Command/Job、或用 publisher failure 修改 truth。 |
| `03_ddd_step_08_protocol_contracts.md` | Command / Query / Inbound / Outbound / Job / Handoff public shell 与 idempotency/replay surface。 | 从 public DTO 反推 private lock/key/schema。 |
| `03_ddd_step_07_trait_port_adapter.md` | repository、idempotency/result store、publisher/handoff/runtime port。 | 给 Step 7 没有的 private port 发明正式语义。 |
| `standards/document/详细设计讨论流程_SOP.md` Step 13 | 并发冲突、重复调用、幂等键来源、重复请求行为、并发测试切口。 | 只写 narrative,不形成可实现矩阵。 |
| `standards/document/详细设计书写规范.md` §5.12 | 并发/幂等/重入保护必须可编码、可测试、可恢复。 | 不区分 request idempotency、resource concurrency、worker reentry。 |
| `standards/document/设计真相源闭环与可落码性标准.md` | 不得自行补 schema/port/mapper/config/evidence;duplicate replay no-rerun;缺正式 source 必须暂停。 | 从 exception text、route、adapter code、queue offset、timestamp、private map 推正式 key/marker/checkpoint。 |

### 3. Step 12 handoff 承接思考

| Step 12 handoff | Step 13 承接方式 | 当前 R13.1 裁决 |
|---|---|---|
| duplicate replay no-rerun | 定义 stored result/receipt/report/checkpoint 的 replay guard、missing surface failure 和 no-rerun sequence。 | 后续必须写 replay/idempotency table;不能重跑 body。 |
| commit unknown | 定义 reserve/complete/commit-observation 的一致性保护和 safe manual surface。 | 后续必须写 commit unknown handling;不能凭 retry 声明 accepted。 |
| version conflict | 定义 mutable truth expected-version / conflict-after-reload 口径。 | 后续必须写 resource concurrency table;不能把 checkpoint/cursor 当 version。 |
| retryable unavailable | 只在 formal marker 表示 temporary/unavailable 时进入 retry classification。 | 后续必须写 retry guard;不能从 adapter exception 推 retry。 |
| post-commit no rollback | publication/handoff/post-commit audit retry 不改变 committed truth/candidate/report。 | 后续必须写 post-commit reentry table。 |
| checkpoint blocked/manual | checkpoint absent/wrong/corrupt -> resume blocked/manual。 | 后续必须写 checkpoint resume boundary;不能用 queue offset/lease/timestamp 补。 |
| marker/source missing | 缺 formal source/marker/schema 仍是 blocker。 | R13 不能补 Step 6~12 未闭口的 source。 |

### 4. L1-governance Step 13 框架参考思考

L1-governance Step 13 的价值在组织框架,不是领域语义。L3-method-library 只参考如何分层并发、幂等和重入保护。

| L1 Step 13 框架点 | L3 采用方式 |
|---|---|
| 请求层幂等 | 按 Command、Inbound、Job、Outbound/Handoff 的 formal key/source 分开。 |
| 资源层并发 | 按 mutable truth、append-only、stored shell、projection/report/checkpoint 区分 version / expected_version / append identity。 |
| worker 层重入 | 按 inbound worker、publisher、handoff worker、operations job、post-commit observation 分开。 |
| duplicate behavior | 同 key 同 digest复制 stored surface;同 key不同 digest冲突;missing stored surface是 consistency/manual。 |
| retry / lease / lock | 只在 Step 13 写算法边界,不写 Step 14 config key 或 Step 15 observability payload。 |
| testing handoff | 只形成并发/幂等测试切口意图,具体 case schema 留 Step 16。 |

### 5. 初步分批思考

本表只是 R13.1 思考结果,不是 final concurrency/idempotency contract。

| 批次族 | 候选内容 | 主要输入 | 初判 |
|---|---|---|---|
| opening / framework | 必读文档、旧材料排除、SOP 五问、模块计划、L1 框架裁剪。 | SOP / writing spec / Step 12 handoff | R13.2 写入。 |
| protection layers | request idempotency、resource concurrency、worker reentry、runtime guard 分层。 | Step 8~12 | 后续先思考再写入。 |
| Command idempotency / concurrency | reserve/complete、request digest、duplicate replay、version conflict、commit unknown。 | Step 8/9/11/12 | 必须保持 stored replay no-rerun。 |
| Query repeatability | Query repeat call/no-write/no-idempotency-store、stale/degraded copy-only。 | Step 8/9/11/12 | 必须禁止 query repair/write。 |
| Inbound / Outbound / Handoff reentry | inbound dedup、publication/handoff outcome retry、post-commit no rollback。 | Step 9/10/11/12 | 必须区分 candidate vs delivery。 |
| Job / checkpoint resume | job idempotency、checkpoint resume、partial retry、report replay、manual consistency。 | Step 9/10/11/12 | 必须禁止 queue offset/lease/timestamp 当 checkpoint。 |
| formal §12 candidate / closure | Step 8~12 closure audit、正式 §12 candidate、Step 14 handoff。 | R13 completed rows | 最后统一停审,不改正式 03。 |

### 6. 旧 Step 13 污染隔离思考

| 旧内容 | 当前处理 |
|---|---|
| `MethodContent` / `content_family_id + version` / old supersede link | historical pollution;不得进入当前 L3-method-library 主线。 |
| old `OutboxStatus` / relay worker claim | 只作旧反例;当前 outbound publication/handoff 必须用本轮 Step 8~12 的 candidate/outcome 表达。 |
| old `IdempotencyStatus` / request_hash | 不继承字段名或状态;当前 key/digest/source 需由 Step 8~12 重新闭合。 |
| old `JobRunStatus` / dry_run / seed / replay / rebuild | 不继承;当前 8 Operations Job 和 report/checkpoint 口径来自 Step 9~12。 |
| old checkpoint compare-and-swap | 不继承算法;当前 checkpoint resume source 必须来自 Step 11/12 formal checkpoint/run history。 |
| old test cut | 不继承;Step 16 后续重建测试切口。 |

### 7. R13.2 写入边界思考

`R13.2` 只应写入开工材料,不得进入完整算法矩阵:

1. 写 Step 13 必读文档表与读取状态。
2. 写输入基线与旧材料处理规则。
3. 写 SOP 五问初步回答。
4. 写 Step 13 输出骨架、模块计划和 L1-governance 框架参考边界。
5. 写 `R13.3` 进入门禁。

### 8. R13.1 stop-review

| 检查项 | 结果 |
|---|---|
| 是否确认旧 Step 13 completed 作废 | pass |
| 是否只思考开工、必读文档、Step 12 handoff 和分批计划 | pass |
| 是否参考 L1-governance 框架但不复制领域语义 | pass |
| 是否明确不写完整 reserve/complete、retry、lock、TTL、lease、checkpoint resume 算法 | pass |
| 是否未修改正式 `03-详细设计.md` | pass |
| 是否未写 Step 14/15/16 内容、test schema 或 implementation code | pass |

next_allowed_action: 等待用户确认后进入 Step 13 `R13.2 开工与必读文档:再写入`;只允许写入 Step 13 必读文档表、读取状态、输入基线、旧材料处理规则、SOP 五问初步回答、输出骨架、模块计划、L1-governance 框架参考边界和 `R13.3` 进入门禁;不得直接修改正式 `03-详细设计.md`;不得写完整 reserve/complete 状态机、retry/lock/TTL/lease/checkpoint resume 算法、config key、observability schema、test case schema 或 implementation code。

---

## R13.2 开工与必读文档:再写入

### 1. 当前模块目标

`R13.2` 将 `R13.1` 的开工思考落成可恢复台账。当前模块只写入 Step 13 的必读文档表、读取状态、输入基线、旧材料处理规则、SOP 五问初步回答、输出骨架、模块计划、L1-governance 框架参考边界和 `R13.3` 进入门禁。

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm |
| 当前允许 | 写入 Step 13 开工材料、输入约束、分批框架和下一模块门禁。 |
| 当前禁止 | 修改正式 `03-详细设计.md`;写完整 reserve/complete 状态机、Command/Inbound/Job 幂等矩阵、Query repeatability 细则、retry/lock/TTL/lease/checkpoint resume 算法、config key、observability schema、test case schema 或 implementation code。 |

### 2. 必读文档表与读取状态

| 输入 | 读取状态 | Step 13 用途 | 当前边界 |
|---|---|---|---|
| `project_execution_ledger.md` | 已读 | 确认当前恢复点、单模块推进、Step 13 R13.1 -> R13.2 门禁。 | 不凭对话记忆跳过台账。 |
| `03_ddd_calibration_flow.md` | 已读 | 确认 Step 13 in_progress、Step 14+ blocked、正式 `03-详细设计.md` 不直接修改。 | 不把 R13.2 扩成完整 Step 13。 |
| `03_ddd_step_13_concurrency_idempotency.md` R13.1 | 已读 | 承接旧 Step 13 污染隔离、Step 12 handoff 和分批思考。 | 不继承旧 completed 状态。 |
| `03_ddd_step_12_errors_recovery.md` R12.15~R12.16 | 已读相关收口 | 承接 duplicate no-rerun、commit unknown、version conflict、checkpoint blocked/manual、post-commit no rollback。 | 不改写 Step 12 public recovery surface。 |
| `03_ddd_step_11_persistence_tx_consistency.md` R11.21~R11.24 | 已读相关收口 | 承接 transaction boundary、stored replay no-rerun、query no-write、checkpoint-not-version、publication/handoff no rollback。 | 不发明 Step 11 没有的 store/port/atomic boundary。 |
| `03_ddd_step_10_state_machine.md` R10.22~R10.24 | 已读相关收口 | 承接 idempotency/replay/runtime/entry、outbound/handoff、job/report/checkpoint 的状态 handoff。 | 不把状态词扩成 retry policy 或 config key。 |
| `03_ddd_step_09_function_flows.md` | 后续模块复读 | Command / Query / Inbound / Outbound / Job flow 的 duplicate、commit、side-effect、checkpoint 分支第一来源。 | 在 R13.5+ 逐族引用;R13.2 不写全量 flow 矩阵。 |
| `03_ddd_step_08_protocol_contracts.md` | 后续模块复读 | Command / Query / Inbound / Outbound / Job public shell、metadata、stored replay surface 第一来源。 | 不从 DTO 反推 private lock/key/schema。 |
| `03_ddd_step_07_trait_port_adapter.md` | 后续模块复读 | idempotency repository、stored result、UnitOfWork、repository version、publisher/handoff/runtime port 第一来源。 | 不新增未闭口 port。 |
| `03_ddd_step_06_object_contracts.md` | 后续模块复读 | idempotency guard、stored operation result、job/report/checkpoint、runtime helper 字段来源。 | 不补 Step 6 未定义字段。 |
| `00-需求文档.md` / `01-架构设计.md` / `02-概要设计.md` | 本轮权威输入 | 确认 L3-method-library 当前业务边界、依赖裁剪和八组件主线。 | 旧 `MethodContent` 主线不得复活。 |
| `standards/document/详细设计讨论流程_SOP.md` Step 13 | 已核对方向 | 提供并发冲突、重复调用、幂等键来源、重复请求行为、并发测试切口五问。 | 不写 narrative-only 结论。 |
| `standards/document/详细设计书写规范.md` §5.12 | 约束输入 | 要求并发/幂等/重入保护可编码、可测试、可恢复。 | 不提前写 Step 14~16 内容。 |
| `standards/document/设计真相源闭环与可落码性标准.md` | 约束输入 | 确认缺 schema/port/mapper/config/source 必须暂停,不得自行补口。 | 不从 exception text、route、timestamp、queue offset、private map 推正式来源。 |
| `projects/L1-governance/design-calibration/03_ddd_step_13_concurrency_idempotency.md` | framework_read | 参考 Step 13 的组织深度、表格族、闭环审计和测试 handoff。 | 只参考框架,不得复制 governance 领域对象、命名或 job 语义。 |

### 3. 输入基线与旧材料处理规则

| 输入族 | 当前处理 |
|---|---|
| 当前正式 `00/01/02` | Step 13 的业务边界、依赖边界和能力边界第一来源。 |
| 当前 Step 1~12 中间产物 | Step 13 的对象、port、protocol、flow、state、persistence、error/recovery 第一来源。 |
| 旧正式 `03-详细设计.md` | historical_material;只用于识别旧主线污染和旧章节结构,不得作为并发/幂等结论来源。 |
| 旧 Step 13 completed 内容 | historical_pollution;旧 `MethodContent`、old outbox、old checkpoint、dry_run、revision、request_hash、old job scope 全部失效。 |
| L1-governance Step 13 | framework_reference;只学习“开头目标 -> 输入 -> 分批 -> SOP 五问 -> 原则 -> 场景表 -> key/digest -> duplicate -> closure”的组织方式。 |
| 后续 Step 14~16 | 只作为 handoff 目标;R13 不写 config key、metric/trace payload、test case ID 或 evidence artifact schema。 |

### 4. SOP 五问初步回答

| SOP 问题 | R13.2 初步回答 | 后续落点 |
|---|---|---|
| 哪些处理流可能并发修改同一资源? | Command accepted path、Inbound receipt / reference summary path、Outbound publication / handoff marker path、Operations Job derived material / report / checkpoint path 都可能并发;Query 必须 no-write。 | R13.5/R13.6、R13.9/R13.10、R13.11/R13.12 |
| 哪些接口、事件或 job 可能被重复调用? | Command 可能因 client retry 重复;Inbound 可能因 upstream redelivery 重复;Outbound/Handoff 可能因 worker retry 重复;Job 可能因 scheduler rerun、worker crash、operator retry 重复;Query 只是重复读。 | R13.5~R13.12 |
| 幂等键来自请求、事件、job 参数还是数据库唯一约束? | 必须来自 Step 6~9 已正式定义的 metadata / envelope / job input / operation scope。数据库唯一约束只能保护 business/storage uniqueness,不能替代 stored replay。 | R13.3~R13.6、R13.9~R13.12 |
| 重复请求应该返回既有结果、跳过、覆盖还是报错? | same key + same digest + completed 复制 stored result / receipt / report;same key + different digest 是 conflict;in-flight 不允许第二 writer;missing stored surface 是 consistency/manual,不得重跑。 | R13.5/R13.6、R13.9~R13.12 |
| 并发冲突如何测试? | Step 13 只形成测试切口意图:version conflict、same digest replay、different digest conflict、in-flight、stored result missing、commit unknown、dual publisher、checkpoint resume。具体 case schema 留 Step 16。 | R13.15/R13.16 handoff_to_step16 |

### 5. Step 13 输出骨架

| 候选正式章节 | 内容边界 | 预计来源 |
|---|---|---|
| §12.1 范围与非目标 | 定义 request idempotency、resource concurrency、worker reentry、runtime guard;排除 config/test/observability/implementation。 | R13.2/R13.4 |
| §12.2 保护层级与类型族 | request / resource / worker / runtime 四层保护,以及 formal source/backref 红线。 | R13.3/R13.4 |
| §12.3 Command 幂等与并发 | reserve/complete/replay/commit unknown/version conflict 的可落码矩阵。 | R13.5/R13.6 |
| §12.4 Query repeatability 与 no-write | 重复 Query 只读、copy-only degraded/stale/unavailable、不得修复或记录幂等。 | R13.7/R13.8 |
| §12.5 Inbound / Outbound / Handoff 重入 | inbound dedup、publication/handoff outcome retry、post-commit no rollback。 | R13.9/R13.10 |
| §12.6 Job / checkpoint resume | job idempotency、checkpoint resume、partial retry、stored report replay、manual consistency。 | R13.11/R13.12 |
| §12.7 retry / lock / lease 边界 | 只写正式边界、禁止来源和 handoff,不写 Step 14 config 数值。 | R13.13/R13.14 |
| §12.8 closure audit 与后续承接 | Step 6~12 闭环审计、正式 §12 候选草稿、Step 14~16 handoff。 | R13.15/R13.16 |

### 6. Step 13 模块计划

| 模块 | 主题 | 状态 |
|---|---|---|
| R13.1 | 开工与必读文档:先思考 | completed_wait_user_confirm |
| R13.2 | 开工与必读文档:再写入 | completed_wait_user_confirm |
| R13.3 | 保护层级与类型族:先思考 | completed_wait_user_confirm |
| R13.4 | 保护层级与类型族:再写入 | completed_wait_user_confirm |
| R13.5 | Command idempotency / concurrency:先思考 | completed_wait_user_confirm |
| R13.6 | Command idempotency / concurrency:再写入 | completed_wait_user_confirm |
| R13.7 | Query repeatability / no-write:先思考 | completed_wait_user_confirm |
| R13.8 | Query repeatability / no-write:再写入 | completed_wait_user_confirm |
| R13.9 | Inbound / Outbound / Handoff reentry:先思考 | completed_wait_user_confirm |
| R13.10 | Inbound / Outbound / Handoff reentry:再写入 | completed_wait_user_confirm |
| R13.11 | Job / checkpoint resume:先思考 | completed_wait_user_confirm |
| R13.12 | Job / checkpoint resume:再写入 | completed_wait_user_confirm |
| R13.13 | retry / lock / lease boundary:先思考 | completed_wait_user_confirm |
| R13.14 | retry / lock / lease boundary:再写入 | completed_wait_user_confirm |
| R13.15 | cross-step closure audit 与正式 §12 候选草稿停审:先思考 | completed_wait_user_confirm |
| R13.16 | cross-step closure audit 与正式 §12 候选草稿停审:再写入 | completed_wait_user_confirm |

### 7. L1-governance 框架参考边界

| 可参考 | 不可复制 |
|---|---|
| 开头先固定目标、非目标、输入材料和分批计划。 | governance 的 command 名、context/gate/policy/control/compliance/nonconformity 领域语义。 |
| SOP 五问先给初步回答,再逐模块展开矩阵。 | governance 的 `GovernanceRequestDigest`、outbox/refresher/export 字段名。 |
| 先写并发场景、再写 key/digest、再写 duplicate/reentry,最后 closure audit。 | governance 的 repository、stored result、job report、handoff target 命名。 |
| duplicate no-rerun、same key different digest conflict、stored surface missing manual 的结构性原则。 | 把 governance 的测试 ID、错误类型、状态名直接映射到 L3。 |
| 前序 Step closure audit 与 Step 14~16 handoff。 | 将 governance 已闭口项当成 L3 已闭口项。 |

### 8. R13.3 进入门禁

进入 `R13.3 保护层级与类型族:先思考` 前必须满足:

- `R13.1` 和 `R13.2` 均为 completed_wait_user_confirm。
- 当前文件已记录 Step 13 必读文档、输入基线、旧材料隔离、SOP 五问、输出骨架和模块计划。
- 正式 `03-详细设计.md` 未被修改。
- 旧 Step 13 的 request_hash、revision、old outbox、old checkpoint、dry_run、old job scope 不得作为正向来源。
- `R13.3` 只允许思考 request idempotency、resource concurrency、worker reentry、runtime guard 的保护层级与类型族,不得写完整 Command/Query/Inbound/Outbound/Job/Handoff 算法。

### 9. R13.2 stop-review

| 检查项 | 结果 |
|---|---|
| 是否写入必读文档表与读取状态 | pass |
| 是否写入输入基线和旧材料处理规则 | pass |
| 是否写入 SOP 五问初步回答 | pass |
| 是否写入 Step 13 输出骨架与模块计划 | pass |
| 是否参考 L1-governance 框架但不复制领域语义 | pass |
| 是否未修改正式 `03-详细设计.md` | pass |
| 是否未写完整 reserve/complete、retry、lock、TTL、lease、checkpoint resume 算法 | pass |
| 是否未写 Step 14/15/16 内容、test schema 或 implementation code | pass |

next_allowed_action: 等待用户确认后进入 Step 13 `R13.3 保护层级与类型族:先思考`;只允许思考 request idempotency、resource concurrency、worker reentry、runtime guard 的层级边界、类型族、formal source/backref、排除规则、watch/blocker 和 `R13.4` 写入边界;不得直接修改正式 `03-详细设计.md`;不得写完整 Command/Query/Inbound/Outbound/Job/Handoff 的 reserve/complete/replay/retry/lock/TTL/lease/checkpoint resume 算法;不得写 config key、observability schema、test case schema 或 implementation code。

---

## R13.3 保护层级与类型族:先思考

### 1. 当前模块目标

`R13.3` 只思考 Step 13 的保护层级和类型族,为 `R13.4` 写入正式分层表做准备。当前模块不写 Command / Inbound / Outbound / Job 的完整 reserve / complete / replay / retry / lock / lease / checkpoint resume 算法,也不写 config key、observability schema、test case schema 或正式 `03-详细设计.md`。

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm |
| 当前允许 | 思考 request idempotency、resource concurrency、worker reentry、runtime guard 的层级边界、类型族、formal source/backref、排除规则、watch/blocker 和 `R13.4` 写入计划。 |
| 当前禁止 | 写完整 per-command key/digest 表、reserve/complete 状态机、storage schema、retry number、TTL、lock table、scheduler lease、checkpoint resume algorithm、implementation code 或正式 `03-详细设计.md`。 |

### 2. 分层原则思考

Step 13 不能把所有并发问题压成“加锁”或“幂等”。当前 L3-method-library 至少需要四层保护,每层 owner、输入和失败处理都不同。

| 保护层级 | 初步责任 | 主要来源 | 禁止混用 |
|---|---|---|---|
| request idempotency / replay guard | 保护同一 Command / Inbound / Job 重复进入 mutation body;区分 fresh、duplicate replay、same-key conflict、in-flight。 | Step 6 `MethodAssetIdempotencyGuard` / `MethodAssetStoredOperationResult`;Step 8 metadata / envelope / job shell;Step 11 stored replay surface;Step 12 duplicate no-rerun。 | 用 Query 写幂等记录;用 DB unique 替代 stored replay;用 route/raw body/timestamp 拼 key;duplicate 重跑 mutation。 |
| resource concurrency / version guard | 保护 mutable truth、material、marker、publication outcome、handoff marker、progress/checkpoint 的并发更新。 | Step 7 versioned repository / expected_version;Step 10 state owner;Step 11 version / append / checkpoint rules;Step 12 version conflict 分类。 | 用 checkpoint、page cursor、digest、lease、queue offset 或 current ref 替代 optimistic version。 |
| worker reentry / side-effect guard | 保护 inbound redelivery、publisher retry、handoff retry、operations job rerun / resume 不产生重复副作用。 | Step 8 receipt / publication outcome / job report shell;Step 9 Inbound / Outbound / Job overlay;Step 11 no rollback and stored shell;Step 12 post-commit failure recovery。 | 从 broker ack、topic、delivery receipt、scheduler attempt、private fake map 判断业务成功;post-commit failure 回滚 truth。 |
| runtime guard / availability guard | 保护 entry / worker / jobs 在 store、resolver、publisher、handoff、runtime binding unavailable 时不误入业务写路径。 | Step 6 runtime / adapter state;Step 7 runtime availability / target registry / handoff binding ports;Step 10 runtime technical state;Step 12 dependency unavailable 分类。 | 在 Step 13 写 config key、secret、URL、topic、cron、product binding;从 raw adapter error text 合成 public marker。 |

### 3. 类型族候选思考

`R13.4` 需要把保护层级落成可审计类型族,但仍不进入每个 flow 的算法矩阵。当前候选如下:

| 类型族 | 作用 | 需要回指 | 后续展开 |
|---|---|---|---|
| operation namespace | 区分 Command / Inbound / Job 的 operation family,避免同 raw key 跨 operation 串扰。 | Step 8 protocol operation family;Step 9 flow name;Step 11 stored shell key。 | R13.5/R13.9/R13.11 |
| idempotency key | 表达 caller / envelope / job 提供的重复请求识别输入。 | Step 8 metadata / envelope / job input;Step 6 idempotency guard。 | R13.5/R13.9/R13.11 |
| operation digest | 覆盖会改变结果的 canonical safe material,用于 same key different digest conflict。 | Step 6 operation context / stored result;Step 8 request shell;Step 12 idempotency conflict。 | R13.5/R13.6 |
| idempotency decision | fresh、duplicate_replay、conflict、in_flight / delayed 等决策族。 | Step 6 `MethodAssetIdempotencyDecisionKind`;Step 10 idempotency/replay state;Step 12 error classification。 | R13.4/R13.6 |
| stored replay surface | duplicate 时复制 accepted / rejected / ignored result、receipt、report 或 checkpoint/run history。 | Step 8 result / receipt / report shell;Step 11 stored replay persistence;Step 12 stored surface missing。 | R13.5~R13.12 |
| expected version | mutable truth / material / marker 更新的并发前置。 | Step 7 versioned read;Step 11 version rule;Step 12 version conflict。 | R13.5/R13.6/R13.11/R13.12 |
| append identity | trace / audit / event candidate / history 等 append-only side effect 的去重或不可覆盖边界。 | Step 6 append/support objects;Step 9 side effects;Step 11 append-only rule。 | R13.6/R13.10 |
| publication / handoff outcome guard | candidate 与 publication / handoff outcome 分离,post-commit no rollback。 | Step 7 publisher/handoff ports;Step 8 publication/handoff shell;Step 9 outbound overlay;Step 11 no rollback。 | R13.9/R13.10 |
| checkpoint / resume anchor | job resume 的正式 anchor,用于 partial retry / resume / report replay。 | Step 6 job context/progress;Step 7 checkpoint store;Step 9 job overlay;Step 11 checkpoint-not-version。 | R13.11/R13.12 |
| runtime availability marker | entry / worker / jobs 的 blocked / unavailable / degraded precheck 来源。 | Step 6 runtime support;Step 7 runtime / adapter availability;Step 10 runtime state;Step 12 dependency unavailable。 | R13.13/R13.14 |

### 4. Query repeatability 边界思考

Query 必须单独从 request idempotency 层排除。重复 Query 是 read repeatability 问题,不是 stored replay 问题。

| Query 场景 | R13.3 初判 |
|---|---|
| 同一 Query 被重复调用 | 重新读取当前 authorized read surface,不 reserve idempotency,不保存 query result。 |
| Query 读到 stale / degraded / unavailable | 只复制 resolver / mapper / material / availability 的正式 marker,不修复 material。 |
| Query page cursor | 只能作为翻页 continuation,不得作为 optimistic version、checkpoint 或 replay token。 |
| Query 发现 material 缺失 | 返回 safe absent / degraded / unavailable / consistency surface,不得启动 job 或写 repair side effect。 |
| Query 需要 audit / observability | 仅 Step 15 定义 observation;R13 不让 Query 写 success trace 或 replay record。 |

### 5. formal source / backref 思考

每个保护类型必须能回指正式来源。若后续 `R13.4+` 发现来源缺失,必须记录 blocker,不得由实现端补口。

| source/backref | R13 使用方式 | 缺失时处理 |
|---|---|---|
| Step 6 object / helper | 提供 operation context、idempotency guard、stored result、read decision、inbound intake、event candidate、job progress、runtime state 主语。 | 缺字段或主语时回 Step 6。 |
| Step 7 port / seam | 提供 repository versioned read、UnitOfWork、stored result get/save、publisher/handoff outcome、checkpoint store、runtime availability。 | 缺 save/get/list/outcome 对称面时回 Step 7。 |
| Step 8 protocol shell | 提供 metadata / envelope / job input / result / receipt / report / publication outcome public surface。 | 缺 public marker / DTO shell / stored surface 时回 Step 8。 |
| Step 9 function flow | 提供 duplicate、accepted、rejected、no-write、publication、handoff、job resume 的触发点和 side effect 顺序。 | flow 分支缺失时回 Step 9。 |
| Step 10 state matrix | 提供 state owner、forbidden transition、runtime/entry/local result、checkpoint/report state 边界。 | 状态主语或 owner 不清时回 Step 10。 |
| Step 11 persistence / transaction | 提供 stored replay no-rerun、query no-write、checkpoint-not-version、publication/handoff no rollback、UoW atomicity。 | durable key / atomic boundary 缺失时回 Step 11。 |
| Step 12 error / recovery | 提供 version conflict、idempotency conflict、stored result missing、commit unknown、dependency unavailable、manual consistency 分类。 | public safe surface 或恢复分类缺失时回 Step 12。 |

### 6. 排除规则思考

下列输入不能成为 R13 的正式 key、version、checkpoint、marker、retry 或 replay source。

| 禁止来源 | 原因 |
|---|---|
| raw request body、external payload、report body、provider response body | 违反 body-free 和 stored replay safe summary 规则。 |
| route string、query param、topic、transport header、broker ack、delivery receipt | transport 不是 domain/application truth source。 |
| timestamp、current time、retry counter、delivery attempt、scheduler attempt | 易变 metadata,不能进入 stable digest 或 checkpoint。 |
| queue offset、scheduler lease、process id、thread id、lock owner | 实现运行时细节,不能替代 checkpoint、version 或 idempotency decision。 |
| page cursor、view cursor、checkpoint、expected version 互相替代 | 三者语义不同:翻页、resume、并发保护不能混用。 |
| current truth reread to rebuild duplicate response | 违反 duplicate replay no-rerun;stored surface missing 是 consistency/manual。 |
| fake-only private map、adapter exception text、raw SQL/HTTP code | 违反 fake/durable parity 和 no synthetic marker。 |

### 7. watch / blocker 思考

当前 `R13.3` 未发现必须立刻回退 Step 6~12 的 hard blocker,但以下项必须在后续具体模块中继续审计:

| ID | 主题 | 当前判断 | 后续处理 |
|---|---|---|---|
| ML-D03-S13-WATCH-001 | operation key / digest per-family 来源 | R13.3 只定义类型族,未逐 Command / Inbound / Job 写 key/digest。 | R13.5/R13.9/R13.11 展开。 |
| ML-D03-S13-WATCH-002 | stored result / receipt / report missing | Step 11/12 已定义 no-rerun/manual,但 replay serialization 仍未写。 | R13.5~R13.12 展开。 |
| ML-D03-S13-WATCH-003 | checkpoint / resume algorithm | checkpoint-not-version 已闭,但 resume sequence 仍未写。 | R13.11/R13.12 展开。 |
| ML-D03-S13-WATCH-004 | publication / handoff retry boundary | no rollback 已闭,但 retry/reentry guard 仍未写。 | R13.9/R13.10/R13.13/R13.14 展开。 |
| ML-D03-S13-WATCH-005 | runtime availability guard 与 config binding | R13 只写 guard 语义,不写 config key。 | R13.13/R13.14 handoff_to_step14。 |
| ML-D03-S13-BLOCK-001 | hard blocker | none at R13.3。 | 后续发现缺正式 source 时新增 blocker 并暂停。 |

### 8. R13.4 写入计划思考

`R13.4` 应把本模块思考写成可审计表格,但仍不得写完整 flow 算法:

1. 写 Step 13 目标 / 非目标中的保护层级定义。
2. 写 request idempotency、resource concurrency、worker reentry、runtime guard 四层保护表。
3. 写 operation namespace、idempotency key、digest、stored replay、expected version、append identity、publication/handoff outcome、checkpoint、runtime availability 类型族表。
4. 写 Query repeatability exclusion 表。
5. 写 formal source/backref 表和禁止来源表。
6. 写 watch / blocker 表和 `R13.5 Command idempotency / concurrency:先思考` 进入门禁。

### 9. R13.3 stop-review

| 检查项 | 结果 |
|---|---|
| 是否只思考保护层级与类型族 | pass |
| 是否区分 request idempotency、resource concurrency、worker reentry、runtime guard | pass |
| 是否明确 Query repeatability 不写幂等记录 | pass |
| 是否列出 formal source/backref 与缺口处理 | pass |
| 是否列出禁止来源 | pass |
| 是否未写完整 reserve/complete、retry、lock、TTL、lease、checkpoint resume 算法 | pass |
| 是否未修改正式 `03-详细设计.md` | pass |
| 是否形成 R13.4 写入计划 | pass |

next_allowed_action: 等待用户确认后进入 Step 13 `R13.4 保护层级与类型族:再写入`;只允许写入保护层级表、类型族表、Query repeatability exclusion、formal source/backref、禁止来源、watch/blocker 表和 `R13.5` 进入门禁;不得直接修改正式 `03-详细设计.md`;不得写完整 Command/Query/Inbound/Outbound/Job/Handoff 的 reserve/complete/replay/retry/lock/TTL/lease/checkpoint resume 算法;不得写 config key、observability schema、test case schema 或 implementation code。

---

## R13.4 保护层级与类型族:再写入

### 1. 当前模块目标

`R13.4` 将 `R13.3` 的保护层级与类型族思考落成可审计表格。当前模块只定义 Step 13 的横向保护框架,不展开 per-command / per-job 的 reserve、complete、duplicate replay、retry、lock、lease 或 checkpoint resume 算法。

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm |
| 当前允许 | 写入保护层级表、类型族表、Query repeatability exclusion、formal source/backref、禁止来源、watch/blocker 和 `R13.5` 进入门禁。 |
| 当前禁止 | 修改正式 `03-详细设计.md`;写完整 Command / Inbound / Outbound / Job 算法矩阵;写 storage schema、lock table、TTL、retry count、scheduler lease、config key、observability schema、test case schema 或 implementation code。 |

### 2. Step 13 目标 / 非目标中的保护层级定义

| 类别 | 正式定义 |
|---|---|
| Step 13 目标 | 定义 L3-method-library 在重复请求、并发写入、worker 重入、post-commit side effect、checkpoint resume 和 runtime availability 下的可落码保护规则。 |
| Step 13 目标 | 让实现侧能判断何时 reserve idempotency、何时读取 stored replay surface、何时用 expected version、何时返回 conflict/manual/degraded/unavailable,以及何时必须暂停回设计闭口。 |
| Step 13 非目标 | 不定义 DDL、表结构、物理锁、具体 hash crate、HTTP/RPC status、topic、URL、secret、cron、scheduler product、metric label、trace payload、test evidence schema 或 implementation commit boundary。 |
| Step 13 非目标 | 不改变 Step 8 protocol surface、Step 9 function flow、Step 10 state owner、Step 11 transaction boundary 或 Step 12 error/recovery surface。 |

### 3. 保护层级表

| 保护层级 | owner | 适用入口 | 正式输入 | 保护对象 | 允许结果 | 禁止事项 |
|---|---|---|---|---|---|---|
| request idempotency / replay guard | application service / consumer service / job service | Command、Inbound、Operations Job | operation namespace、idempotency key、operation digest、stored result / receipt / report ref | mutation body、consumer intake、job body | fresh、duplicate_replay、same-key conflict、in-flight / delayed、stored surface missing consistency | Query 写 idempotency;duplicate 重跑 mutation;用 raw body / timestamp / route 拼 key;DB unique 替代 stored replay |
| resource concurrency / version guard | repository + application service | Command accepted writes、derived material writes、marker/outcome/progress writes | versioned read、expected_version、append identity、UnitOfWork boundary | mutable truth、material、marker、publication outcome、handoff marker、progress/checkpoint | accepted save、version conflict、append accepted、consistency/manual | checkpoint / page cursor / digest / lease / queue offset 替代 optimistic version |
| worker reentry / side-effect guard | worker facade + application publisher/job facade | Inbound redelivery、publisher retry、handoff retry、job rerun/resume | stored receipt/report、candidate ref、publication/handoff outcome、checkpoint/run history | receipt、publication outcome、handoff outcome、derived material、job report | replay receipt/report、retry safe outcome、partial/manual、no rollback | broker ack / topic / delivery receipt / scheduler attempt 成为 truth;post-commit failure rollback accepted truth |
| runtime guard / availability guard | api / worker / jobs entry + runtime availability port | API entry、worker entry、jobs entry、publisher/handoff/runtime precheck | runtime assembly state、adapter availability summary、target registry summary、safe diagnostic | entry dispatch、adapter call boundary、target selection | proceed、blocked、unavailable、degraded/manual | Step 13 写 config key/secret/URL/topic/cron;从 raw adapter error 合成 marker;entry 越过 application facade |

### 4. 类型族表

| 类型族 | 语义 | 来源回指 | 后续展开 | 明确禁止 |
|---|---|---|---|---|
| operation namespace | 区分 Command / Inbound / Job 的 operation family 和 flow name。 | Step 8 protocol family;Step 9 flow card;Step 11 stored shell key。 | R13.5/R13.9/R13.11 | raw key 跨 operation 串扰。 |
| idempotency key | 表达调用方、source envelope 或 job input 提供的重复请求识别 ref。 | Step 8 metadata / inbound envelope / job shell;Step 6 idempotency guard。 | R13.5/R13.9/R13.11 | route/query/raw body/timestamp 生成正式 key。 |
| operation digest | 覆盖会改变结果的 canonical safe material,用于 same-key different-digest conflict。 | Step 6 operation context / stored result;Step 8 request shell;Step 12 idempotency conflict。 | R13.5/R13.6 | 包含 request id、trace id、delivery attempt、current time、raw body。 |
| idempotency decision | fresh、duplicate_replay、conflict、in-flight/delayed、manual consistency 的决策族。 | Step 6 `MethodAssetIdempotencyGuard`;Step 10 replay state;Step 12 error classification。 | R13.5~R13.12 | 用 bool 或 exception 代替正式 decision。 |
| stored replay surface | duplicate 时复制 safe accepted/rejected/ignored result、receipt、report、checkpoint/run history。 | Step 8 result / receipt / report shell;Step 11 stored replay persistence;Step 12 stored surface missing。 | R13.5~R13.12 | 重读 current truth 重建 response。 |
| expected version | mutable truth / material / marker / outcome / progress 更新前置。 | Step 7 versioned read;Step 11 version rule;Step 12 version conflict。 | R13.5/R13.6/R13.11/R13.12 | 用 checkpoint、cursor、digest、lease 替代。 |
| append identity | append-only trace / audit / history / candidate / issue 的身份边界。 | Step 6 support objects;Step 9 side effects;Step 11 append-only rule。 | R13.6/R13.10/R13.12 | 覆盖旧 append record 伪装并发保护。 |
| publication / handoff outcome guard | candidate 与 publication / handoff outcome 分离,失败不回滚 accepted truth。 | Step 7 publisher/handoff ports;Step 8 outcome shell;Step 9 outbound overlay;Step 11 no rollback。 | R13.9/R13.10 | outbox delivery truth、subscriber ack、topic 成为本仓 truth。 |
| checkpoint / resume anchor | Job resume / partial retry 的正式 anchor,不同于 page cursor 和 optimistic version。 | Step 6 job context/progress;Step 7 checkpoint store;Step 9 job overlay;Step 11 checkpoint-not-version。 | R13.11/R13.12 | queue offset、scheduler lease、retry counter 代替 checkpoint。 |
| runtime availability marker | entry / worker / jobs precheck 的 blocked / unavailable / degraded 来源。 | Step 6 runtime support;Step 7 runtime / adapter availability;Step 10 runtime state;Step 12 dependency unavailable。 | R13.13/R13.14 | raw adapter error text / config value 直接成为 public marker。 |

### 5. Query repeatability exclusion

| Query repeatability 项 | 正式口径 | 禁止事项 |
|---|---|---|
| repeated Query | 每次重新读取当前 authorized read surface。 | reserve idempotency 或保存 query result。 |
| stale / degraded / unavailable | 只复制正式 resolver / mapper / material / availability marker。 | 刷新 material、修 truth、合成 marker。 |
| page cursor | 只作为翻页 continuation。 | 替代 expected version、checkpoint、operation digest。 |
| material missing | 返回 safe absent / degraded / unavailable / consistency surface。 | 启动 job、append audit、写 repair side effect。 |
| observability | 留 Step 15 定义 observation。 | R13 让 Query 写 success trace 或 replay record。 |

### 6. formal source / backref 表

| source/backref | R13 允许使用 | 缺失时处理 |
|---|---|---|
| Step 6 object / helper | operation context、idempotency guard、stored result、read decision、inbound intake、event candidate、job progress、runtime state 主语。 | 回 Step 6 补对象/字段来源。 |
| Step 7 port / seam | repository versioned read、UnitOfWork、stored result get/save、publisher/handoff outcome、checkpoint store、runtime availability。 | 回 Step 7 补 save/get/list/outcome 对称面。 |
| Step 8 protocol shell | metadata、envelope、job input、result、receipt、report、publication outcome public surface。 | 回 Step 8 补 public marker / DTO shell / stored surface。 |
| Step 9 function flow | duplicate、accepted、rejected、no-write、publication、handoff、job resume 的触发点和 side effect 顺序。 | 回 Step 9 补 flow branch / replay source。 |
| Step 10 state matrix | state owner、forbidden transition、runtime/entry/local result、checkpoint/report state 边界。 | 回 Step 10 补状态主语或 owner。 |
| Step 11 persistence / transaction | stored replay no-rerun、query no-write、checkpoint-not-version、publication/handoff no rollback、UoW atomicity。 | 回 Step 11 补 durable key / atomic boundary。 |
| Step 12 error / recovery | version conflict、idempotency conflict、stored surface missing、commit unknown、dependency unavailable、manual consistency 分类。 | 回 Step 12 补 public safe surface / recovery classification。 |

### 7. 禁止来源表

| 禁止来源 | 不得用于 | 处理口径 |
|---|---|---|
| raw request body、external payload、report body、provider response body | key、digest、stored result、marker、report replay。 | 只允许 body-free typed ref / summary / digest ref。 |
| route string、query param、topic、transport header、broker ack、delivery receipt | operation identity、truth source、publication/handoff success。 | transport 只在 adapter/entry 层被转译为 formal typed ref 或 outcome。 |
| timestamp、current time、retry counter、delivery attempt、scheduler attempt | stable digest、checkpoint、version、retryability。 | 易变 metadata 排除;若需观测留 Step 15。 |
| queue offset、scheduler lease、process id、thread id、lock owner | checkpoint、expected version、business lock。 | 实现运行时细节不得进入设计 truth。 |
| page cursor、view cursor、checkpoint、expected version 互相替代 | 翻页、resume、并发保护。 | 三者分离:page cursor 读分页,checkpoint job resume,expected_version 并发保护。 |
| current truth reread | duplicate response rebuild。 | duplicate 只能复制 stored replay surface;missing surface 是 consistency/manual。 |
| fake-only private map、adapter exception text、raw SQL/HTTP code | marker、decision、retryability、public safe message。 | 缺正式 source 时暂停回设计闭口。 |

### 8. watch / blocker 表

| ID | 主题 | 状态 | 处理口径 |
|---|---|---|---|
| ML-D03-S13-WATCH-001 | operation key / digest per-family 来源 | watch | R13.5/R13.9/R13.11 逐 Command / Inbound / Job 展开。 |
| ML-D03-S13-WATCH-002 | stored result / receipt / report missing | watch | R13.5~R13.12 写 no-rerun replay serialization 和 manual consistency。 |
| ML-D03-S13-WATCH-003 | checkpoint / resume algorithm | watch | R13.11/R13.12 写 checkpoint resume,仍不使用 queue offset / lease。 |
| ML-D03-S13-WATCH-004 | publication / handoff retry boundary | watch | R13.9/R13.10/R13.13/R13.14 写 retry/reentry guard,不回滚 accepted truth。 |
| ML-D03-S13-WATCH-005 | runtime availability guard 与 config binding | handoff_to_step14 | R13 只写 guard 语义;config key / secret / URL / topic 留 Step 14。 |
| ML-D03-S13-BLOCK-001 | hard blocker | none | 后续发现缺正式 source / port / mapper / schema 时新增 blocker 并暂停。 |

### 9. R13.5 进入门禁

进入 `R13.5 Command idempotency / concurrency:先思考` 前必须满足:

- `R13.3` 和 `R13.4` 均为 completed_wait_user_confirm。
- 当前文件已固定四层保护、十类横向类型族、Query repeatability exclusion、formal source/backref 和禁止来源表。
- 正式 `03-详细设计.md` 未被修改。
- `R13.5` 只允许思考 Command accepted / rejected / duplicate 的 idempotency key、digest、stored result、expected version、commit unknown 和 version conflict 边界。
- `R13.5` 不得写 Inbound / Outbound / Handoff / Job 的完整矩阵,也不得写具体 storage schema、retry number、TTL、lock table 或 implementation code。

### 10. R13.4 stop-review

| 检查项 | 结果 |
|---|---|
| 是否写入保护层级表 | pass |
| 是否写入类型族表 | pass |
| 是否写入 Query repeatability exclusion | pass |
| 是否写入 formal source/backref 表 | pass |
| 是否写入禁止来源表 | pass |
| 是否写入 watch / blocker 表 | pass |
| 是否未写完整 reserve/complete、retry、lock、TTL、lease、checkpoint resume 算法 | pass |
| 是否未修改正式 `03-详细设计.md` | pass |
| 是否形成 R13.5 进入门禁 | pass |

next_allowed_action: 等待用户确认后进入 Step 13 `R13.5 Command idempotency / concurrency:先思考`;只允许思考 Command accepted / rejected / duplicate 的 idempotency key、digest、stored result、expected version、commit unknown、version conflict、side-effect no-rerun 和 `R13.6` 写入边界;不得直接修改正式 `03-详细设计.md`;不得写 Inbound / Outbound / Handoff / Job 的完整矩阵;不得写 storage schema、retry number、TTL、lock table、scheduler lease、config key、observability schema、test case schema 或 implementation code。

---

## R13.5 Command idempotency / concurrency:先思考

### 1. 当前模块目标

`R13.5` 只思考 58 个 Command 共享的幂等、并发和重入保护边界,为 `R13.6` 写入可落码 Command 矩阵做准备。当前模块不逐条展开 58 个 Command,不写 Inbound / Outbound / Handoff / Job 的完整矩阵,不定义 storage schema、lock / TTL / retry number、scheduler lease、config key、observability schema、test case schema 或 implementation code。

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm |
| 当前允许 | 思考 Command accepted / rejected / duplicate 的 operation namespace、idempotency key、operation digest、stored replay surface、expected_version、commit unknown、version conflict、side-effect no-rerun 和 `R13.6` 写入计划。 |
| 当前禁止 | 修改正式 `03-详细设计.md`;逐条写 58 个 Command 最终矩阵;写 Inbound / Outbound / Handoff / Job 细则;写物理锁、TTL、retry 数字、表结构、config key、observability schema、test case schema 或 implementation code。 |

### 2. Command 输入依据思考

| 输入 | R13.5 使用方式 | 不得外推 |
|---|---|---|
| Step 8 Command protocol family | Command envelope 复用 shared metadata、actor/source、idempotency,result/effect/rejection/duplicate shell。 | 不从 protocol DTO 反推存储字段、HTTP route 或 raw request body。 |
| Step 9 shared command transaction template | 固定 entry -> operation context -> idempotency reserve -> duplicate replay -> load -> domain/policy -> rejected/accepted -> stored result -> commit 顺序。 | 不把 publisher delivery、handoff delivery、job body 或 external raw read 放入 accepted transaction。 |
| Step 11 transaction boundary | accepted truth/support/material、stored accepted result 和 body-free candidate refs 需同一 logical UoW 或等价 formal atomic boundary;duplicate no-rerun。 | 不把 stored accepted result 放在 commit 后私补;不从 current truth 重建 duplicate response。 |
| Step 12 Command recovery | 固定 version conflict、idempotency conflict、commit unknown、stored replay missing/wrong kind、dependency unavailable 和 design blocker 的 safe classification。 | 不在 Step 13 改写错误分类,不把 commit unknown 变成 blind retry。 |

### 3. Command branch 边界思考

| branch | 触发思考 | 应有结果 | 禁止事项 |
|---|---|---|---|
| fresh accepted | operation namespace/key/digest 未命中 completed/in-flight conflict,且 domain/policy/expected_version 校验通过。 | 进入 accepted mutation UoW,保存 truth/support/material、body-free side-effect refs、stored accepted result,提交后返回 accepted response。 | publish/handoff/job body 进入 UoW;stored result commit 后补;accepted 后无 stored replay surface。 |
| fresh rejected | idempotency reserve 后,protocol/domain/policy/body-boundary/dependency 前置失败且可安全形成 rejection。 | 仅保存 replayable rejected/conflict surface,前提是 Step 8/11 已给正式 stored surface。 | 写 accepted truth;存 raw error/body;无正式 rejected surface 时强行保存。 |
| duplicate same digest | same operation namespace/key/digest 命中 completed accepted 或 replayable rejected stored result。 | 复制 stored result/effect/rejection shell,不进入 mutation UoW。 | 重跑 Command、重读 current truth 重建结果、补 append audit/event candidate。 |
| duplicate different digest | same operation namespace/key 但 digest/scope/subject 不兼容。 | idempotency conflict,prior stored result 不可覆盖。 | 合并请求、覆盖 stored result、比较 raw body、继续 mutation。 |
| in-flight / pending | same operation namespace/key/digest 已被 formal guard 占用但未完成。 | 返回 delayed/in-flight/unavailable 或等价 safe surface,等待 R13.6 具体规则。 | 开第二个 writer;用 sleep/retry loop、lock owner 或 process id 决策。 |
| stored result missing / wrong kind | guard 指向 completed,但 replay surface 缺失、类型不匹配或不可读。 | manual consistency failure,不得自动修复。 | 重跑 mutation、从 current truth 伪造 response、修改 stored kind。 |
| commit unknown | UoW commit 结果不确定,可能已写入 durable state。 | 进入 read-back / idempotency evidence / manual consistency 思考,不得 blind retry。 | 删除 partial rows、再次执行 mutation、直接声明 accepted。 |

### 4. key / digest 来源思考

| 项 | 应纳入思考 | 应排除 |
|---|---|---|
| operation namespace | Command protocol family + Step 9 flow name,确保 58 个 Command 之间不串扰。 | HTTP route、handler function path、transport topic。 |
| idempotency key | Step 8 metadata / command envelope 中的正式 idempotency ref,或 Step 6 guard 接受的 typed key。 | raw body、query param、timestamp、trace id、request id、retry attempt。 |
| operation digest | 会改变结果的 stable safe intent:command family、target typed refs、actor/effective source when semantic、scope/context refs、request intent refs、expected_version when it is semantic part of mutation。 | idempotency key 本身、current time、transport headers、debug flags、delivery attempt、raw provider/body content。 |
| digest conflict basis | same key different digest/scope/subject 必须映射 idempotency conflict。 | 用 string diff/raw body diff 暴露差异。 |
| digest stability | 同一业务 intent 在 retry 中应稳定,但不同 mutation intent 必须产生不同 digest。 | 把 unavailable marker、commit status、stored result ref 纳入原始请求 digest。 |

### 5. expected_version / resource concurrency 思考

Command accepted path 中的 resource concurrency 不应与 request idempotency 混用。

| 场景 | 思考裁决 | 禁止事项 |
|---|---|---|
| versioned mutable truth update | expected_version 来自 Step 7 versioned read / loaded object version。 | 用 page cursor、checkpoint、digest、lease、timestamp 代替。 |
| create with business uniqueness | business unique 可保护唯一对象创建,但不能替代 idempotency replay。 | 只靠 DB unique 返回 duplicate accepted。 |
| append-only history/trace/audit/candidate | 使用 append identity / body-free candidate refs;append 失败跟随 UoW rollback。 | 覆盖旧 append record 或用 append 当 current truth version。 |
| version conflict | 映射 Step 12 conflict / reload-required safe surface;不进入 duplicate replay。 | 自动 blind retry、隐藏冲突后返回 accepted。 |
| stale loaded truth after reserve | reload/retry 规则需由 R13.6 定义,但必须保持 same key/digest guard 不被绕过。 | 释放 guard 后无证据重进 mutation。 |

### 6. stored replay / no-rerun 思考

| replay 项 | R13.5 思考 |
|---|---|
| accepted replay | duplicate accepted 必须复制 stored accepted result 和 effect/candidate safe refs,不得读取 latest truth 拼新响应。 |
| rejected replay | replayable rejected/conflict/unavailable surface 只有在 Step 8/11 正式定义 stored rejected surface 时可复制;缺失则不能自行补 schema。 |
| replay authority | idempotency guard 只判断 key/digest/decision;stored operation result 承载可复制 public-safe result。两者不得混成一个私有对象。 |
| missing replay | completed guard 指向缺失 / wrong kind / unreadable stored result 时,返回 manual consistency failure,不得重跑。 |
| side-effect no-rerun | duplicate 不追加 history/trace/audit/lineage/event candidate,也不触发 publisher/handoff/job。 |

### 7. commit unknown 思考

commit unknown 是 Command 最危险的分支:此时既不能假设 rollback,也不能假设 accepted。

| 处理方向 | 思考裁决 |
|---|---|
| read-back source | 只能使用正式 idempotency guard、stored result、versioned repository 或 Step 11 定义的 atomic boundary 证据。 |
| safe public surface | Step 12 已固定为 consistency_unknown / manual_intervention;R13.6 只能定义进入该 surface 的 guard sequence。 |
| retry | 不能 blind retry mutation;若 retry,必须先通过同 key/digest guard 或 formal read-back 证明不会二次写。 |
| cleanup | 不允许删除 partial rows、覆盖 stored result 或根据 adapter exception text 执行 repair。 |
| handoff | 需要在 R13.6 写入:commit unknown 若无法通过 formal source 证明结果,即进入 manual consistency,并交 Step 15/16 观测和测试切口。 |

### 8. watch / blocker 思考

| ID | 主题 | 当前判断 | R13.6 处理 |
|---|---|---|---|
| ML-D03-S13-CMD-WATCH-001 | per Command key/digest 粒度 | R13.5 只写共享原则,未逐 Command family 填入 target/scope/ref 输入。 | R13.6 写 family-level matrix,但不逐字段写 DTO schema。 |
| ML-D03-S13-CMD-WATCH-002 | replayable rejected stored surface | Step 12 标为 handoff;R13.6 必须说明若 Step 8/11 无正式 surface,不得保存。 | R13.6 写 rejected replay rule / blocker 条件。 |
| ML-D03-S13-CMD-WATCH-003 | in-flight decision | R13.5 不写 lock/TTL,只确认不能第二 writer。 | R13.6 写 semantic state,physical lock/TTL 留后续或实现门禁。 |
| ML-D03-S13-CMD-WATCH-004 | commit unknown read-back | R13.5 确认不能 blind retry。 | R13.6 写 read-back order and manual consistency branch。 |
| ML-D03-S13-CMD-WATCH-005 | side-effect no-rerun | duplicate 不追加任何 accepted side effect。 | R13.6 写 side-effect table,post-commit outbound 留 R13.9/R13.10。 |
| ML-D03-S13-CMD-BLOCK-001 | hard blocker | none at R13.5。 | 若 R13.6 找不到 formal key/digest/stored surface source,新增 blocker 并暂停。 |

### 9. R13.6 写入计划思考

`R13.6` 应把本模块思考写成 Command-focused 可审计矩阵,但仍不进入 Inbound / Outbound / Handoff / Job。

1. 写 Command scope / non-scope。
2. 写 operation namespace、idempotency key、operation digest 来源表。
3. 写 fresh / duplicate same digest / duplicate different digest / in-flight / stored missing / commit unknown 分支表。
4. 写 accepted UoW、rejected replay、version conflict、side-effect no-rerun 表。
5. 写 Command forbidden source / anti-pattern 表。
6. 写 watch / blocker closure 和 `R13.7 Query repeatability / no-write:先思考` 进入门禁。

### 10. R13.5 stop-review

| 检查项 | 结果 |
|---|---|
| 是否只思考 Command idempotency / concurrency | pass |
| 是否覆盖 key、digest、stored result、expected_version、commit unknown、version conflict | pass |
| 是否明确 duplicate replay no-rerun 和 side-effect no-rerun | pass |
| 是否未写 Inbound / Outbound / Handoff / Job 矩阵 | pass |
| 是否未写 storage schema、lock、TTL、retry number、config key、test schema 或 implementation code | pass |
| 是否未修改正式 `03-详细设计.md` | pass |
| 是否形成 R13.6 写入计划 | pass |

next_allowed_action: 等待用户确认后进入 Step 13 `R13.6 Command idempotency / concurrency:再写入`;只允许写入 Command scope、key/digest 来源、fresh/duplicate/conflict/in-flight/stored-missing/commit-unknown 分支表、accepted/rejected/version-conflict/side-effect no-rerun 表、Command 禁止来源、watch/blocker 和 `R13.7` 进入门禁;不得直接修改正式 `03-详细设计.md`;不得写 Query / Inbound / Outbound / Handoff / Job 的完整矩阵;不得写 storage schema、retry number、TTL、lock table、scheduler lease、config key、observability schema、test case schema 或 implementation code。

---

## R13.6 Command idempotency / concurrency:再写入

### 1. 当前模块目标

`R13.6` 将 `R13.5` 的 Command 幂等与并发思考写成可审计矩阵。当前模块覆盖 Step 9 已确认的 58 个 Command 共享规则和八个 Command family 的 key/digest 侧重点,但不逐条写 DTO 字段、storage schema、lock / TTL / retry number、config key、observability schema、test case schema 或 implementation code。

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm |
| 当前允许 | 写入 Command scope、key/digest 来源、fresh/duplicate/conflict/in-flight/stored-missing/commit-unknown 分支、accepted/rejected/version-conflict/side-effect no-rerun 表、禁止来源、watch/blocker 和 `R13.7` 进入门禁。 |
| 当前禁止 | 修改正式 `03-详细设计.md`;写 Query / Inbound / Outbound / Handoff / Job 矩阵;写物理锁、TTL、retry 数字、表结构、config key、observability schema、test case schema 或 implementation code。 |

### 2. Command scope / non-scope

| 范围项 | R13.6 正式口径 |
|---|---|
| 覆盖入口 | Step 9 `R9.28` / `R9.36` 已确认的 58 个 Command flow。 |
| 覆盖 family | 方法资产定义与目录、正式化与版本、受控消费、追溯与一致性保护、关系与分发语义、外部摘要与引用、后台维护与收敛、外围包与方法集组织。 |
| idempotency 目标 | 防止同一 Command 重复进入 mutation body;同 key 同 digest 复制 stored result;同 key 不同 digest 返回 conflict;in-flight 不允许第二 writer。 |
| concurrency 目标 | 用 formal expected_version 保护 mutable truth/support/material;append-only 用 append identity;version conflict 不等于 duplicate。 |
| replay 目标 | duplicate 只能复制 stored accepted / replayable rejected surface,不得重跑 Command 或重读 current truth 重建 response。 |
| side-effect 目标 | accepted UoW 内只写 local truth/support/material、body-free append refs、event candidate refs 和 stored result;publisher/handoff/job body 不在 Command transaction。 |
| 非范围 | Query no-write、Inbound receipt dedup、Outbound / Handoff retry、Operations Job checkpoint resume、runtime config binding 和 observability/test evidence。 |

### 3. operation namespace / key / digest 来源表

| 类型 | 正式来源 | 使用规则 | 禁止来源 |
|---|---|---|---|
| operation namespace | Step 8 Command protocol family + Step 9 flow label。 | 每个 Command family/flow 有独立 namespace,防止相同 key 跨 operation 串扰。 | HTTP route、handler path、transport topic、UI action 名。 |
| idempotency key | Step 8 shared metadata / Command envelope 中正式 idempotency ref,并由 Step 6 `MethodAssetIdempotencyGuard` 接受。 | key 只识别 caller intent retry;不能单独证明 accepted success。 | raw body、query param、timestamp、trace id、request id、retry attempt。 |
| operation digest | canonical safe intent:operation namespace、target typed refs、scope/context refs、actor/effective source when semantic、request intent refs。 | same key + same digest 才能 duplicate replay;same key + different digest 进入 conflict。 | idempotency key 本身、current time、transport headers、debug flags、raw provider/body content。 |
| semantic expected_version | 当 Command intent 明确要求基于某版本变更时,expected_version 可进入 digest。 | 保护“同 key retry”的版本语义一致性;实际 save 仍靠 repository expected_version。 | page cursor、checkpoint、lease、timestamp。 |
| stored result ref | stored result 是 replay surface,不是原始 digest 输入。 | duplicate 命中后复制;fresh path 完成后写入。 | 用 stored result ref 反向改变 digest。 |

### 4. Command family key / digest 侧重点

| Command family | key / digest 必须区分的 semantic material | expected_version 关注点 | replay 关注点 |
|---|---|---|---|
| 方法资产定义与目录 | definition/catalog target refs、identity key、catalog scope、adjustment / retirement intent。 | adjust / retire / reclassify 需来自 loaded definition/catalog version。 | duplicate 不创建第二个 definition/catalog entry。 |
| 正式化与版本 | formalization state ref、basis summary refs、trigger、formal version pair / semantic change intent。 | formalization state、formal version truth 和 supersession pair 的 loaded version。 | duplicate 不建立第二个 formal version 或 second supersession。 |
| 受控消费 | consumption context refs、boundary refs、material target refs、violation safe reason refs。 | consumption boundary/material marker update 的 loaded version。 | duplicate 不重复 prepare material 或 violation record。 |
| 追溯与一致性保护 | trace/audit/lineage/impact subject refs、protection/diagnostic safe markers。 | impact summary、trace/audit owner 的 version or append identity。 | duplicate 不重复 append trace/audit/evidence lineage。 |
| 关系与分发语义 | relation endpoint refs、constraint scope、previous/next relation refs、distribution context refs。 | relation/distribution support loaded version。 | duplicate 不重复 relation/distribution support creation。 |
| 外部摘要与引用 | external source refs、artifact archive refs、basis refs、body-free boundary candidate refs。 | external summary/basis summary version where mutable。 | duplicate 不重新读取 provider body 或保存第二个 archive ref。 |
| 后台维护与收敛 | task/run intent refs、trace subject refs、recovery issue refs、formal intervention refs。 | task/run/progress marker version where mutable。 | duplicate 不执行 job body;只复制 request accepted/stored task result。 |
| 外围包与方法集组织 | package/assembly refs、member refs、composition rule diagnostic refs、availability marker refs。 | package/assembly loaded version。 | duplicate 不重复 assemble package/set 或 append peripheral candidate。 |

### 5. Command idempotency branch 表

| branch | detection source | allowed action | public / stored result | forbidden |
|---|---|---|---|---|
| fresh_unreserved | no existing guard for namespace/key,or guard admits fresh same digest entry。 | reserve/verify guard,load formal inputs,continue validation。 | no public result yet。 | skip guard and write truth directly。 |
| duplicate_same_digest_completed | guard has namespace/key/digest and completed stored accepted or replayable rejected surface。 | read stored result and return duplicate surface。 | copied accepted/effect/rejection shell。 | rerun mutation,rebuild response from current truth,append audit/event。 |
| duplicate_different_digest | guard has same namespace/key but different digest/scope/subject。 | return idempotency conflict;prior result immutable。 | safe conflict surface if formal result shell exists。 | overwrite guard/stored result,compare raw body,merge requests。 |
| in_flight_same_digest | guard indicates namespace/key/digest is reserved but not completed。 | return delayed/in-flight/unavailable safe surface or wait only if formal service contract allows。 | no accepted claim。 | open second writer;use lock owner/process id/sleep loop as design truth。 |
| stored_surface_missing | guard completed but stored result missing/wrong/unreadable。 | return manual consistency failure。 | safe consistency/manual surface。 | rerun Command or synthesize stored result from current truth。 |
| commit_unknown | UoW commit outcome unknown。 | perform formal read-back through guard/stored result/versioned repository if available;otherwise consistency_unknown/manual。 | no accepted unless proof exists。 | blind retry,delete partial rows,claim accepted from exception text。 |

### 6. accepted / rejected / version conflict 表

| scenario | UoW / version rule | stored result rule | rollback / retry rule |
|---|---|---|---|
| accepted mutation | accepted truth/support/material writes,body-free history/trace/audit/lineage refs,event candidate refs and stored accepted result commit in one logical UoW or equivalent formal atomic boundary。 | stored accepted result must be replay-safe and body-free;it may reference typed refs/effect/candidate refs,not public DTO body。 | rollback leaves no accepted truth,no accepted replay surface,no event candidate。 |
| replayable rejected / conflict | idempotency decision and stored rejected/conflict surface share minimal UoW only when Step 8/11 define formal replay surface。 | stored rejected result copies safe reason / diagnostic / marker refs only。 | rollback leaves no durable rejection replay;next retry re-enters guard according to R13.6 branch table。 |
| domain/policy rejected without replay surface | no accepted mutation UoW。 | if no formal stored rejected surface exists,do not invent one。 | return safe rejection per Step 12,or record blocker if protocol requires replay but source missing。 |
| version conflict | repository save expected_version mismatch after formal load。 | no accepted stored result;conflict surface may be stored only if replayable conflict shell is formal。 | caller may retry after reload;service must not blind retry inside same mutation。 |
| dependency unavailable before mutation | no accepted mutation UoW。 | unavailable rejected surface may be replayed only if formal source and stored shell exist。 | retry_later only from formal dependency marker;raw exception not enough。 |

### 7. side-effect no-rerun 表

| side effect | fresh accepted | duplicate replay | conflict / rejected | commit unknown |
|---|---|---|---|---|
| history / trace / audit / lineage append | allowed only inside accepted UoW or formal atomic boundary。 | forbidden;no append solely because duplicate observed。 | forbidden unless rejected flow has formal body-free audit owner。 | forbidden unless commit proof says accepted append already committed。 |
| event candidate refs | assembled from accepted local fact and committed with accepted UoW。 | copied only through stored result/effect refs;no new candidate。 | none unless formal rejected event candidate exists;currently not assumed。 | no new candidate;read-back only。 |
| publisher / handoff delivery | not part of Command accepted transaction。 | forbidden。 | forbidden。 | forbidden。 |
| job body / maintenance execution | Command may create task/run intent,not execute job body。 | duplicate copies task request result,does not run job。 | no job body。 | no job body。 |
| current truth reread | allowed only for formal read-back / reload branch,not for response reconstruction。 | forbidden for duplicate response。 | reload only before caller retry,not silent accepted。 | allowed only as formal evidence read-back,not repair。 |

### 8. Command forbidden source / anti-pattern 表

| anti-pattern | status | reason |
|---|---|---|
| raw request body / provider payload / artifact body in digest or stored result | forbidden | violates body-free and stable digest rules。 |
| route/query string as idempotency key | forbidden | transport is not formal Command operation identity。 |
| DB unique alone as duplicate replay | forbidden | uniqueness may reject create,但不能 reconstruct stored accepted response。 |
| page cursor / checkpoint / lease as expected_version | forbidden | cursor,checkpoint,lease and optimistic version have different semantics。 |
| lock table / TTL / retry number as design truth | forbidden in R13.6 | physical locking/retry knobs are not formal source;config later if needed。 |
| duplicate response from latest current truth | forbidden | violates stored replay no-rerun and historical result stability。 |
| fake-only private map for in-flight or stored result | forbidden | fake/durable parity and formal source closure fail。 |
| raw adapter exception text as marker/retryability | forbidden | public marker must copy formal availability/diagnostic source。 |

### 9. watch / blocker closure

| ID | 主题 | R13.6 结果 | 后续 |
|---|---|---|---|
| ML-D03-S13-CMD-WATCH-001 | per Command key/digest 粒度 | closed_at_family_level;八个 Command family 已给 semantic material 侧重点。 | 若正式 §12 需要逐 flow 表,由后续回填草稿从 Step 9 flow cards 展开。 |
| ML-D03-S13-CMD-WATCH-002 | replayable rejected stored surface | watch_remains;R13.6 明确“无正式 surface 不得保存”。 | R13.15 closure audit 检查 Step 8/11 是否足够;implementation 不得补。 |
| ML-D03-S13-CMD-WATCH-003 | in-flight decision | closed_semantic;不允许第二 writer,不写物理 lock/TTL。 | R13.13/R13.14 写 retry / lock / lease boundary 时只写边界。 |
| ML-D03-S13-CMD-WATCH-004 | commit unknown read-back | closed_semantic;只允许 formal guard/stored result/versioned repo read-back,否则 manual。 | Step 15/16 later observation/test cut。 |
| ML-D03-S13-CMD-WATCH-005 | side-effect no-rerun | closed_for_Command;duplicate 不追加 accepted side effect。 | Outbound/Handoff retry 由 R13.9/R13.10 处理。 |
| ML-D03-S13-CMD-BLOCK-001 | hard blocker | none at R13.6。 | 后续发现缺 formal key/digest/stored surface source 时新增 blocker。 |

### 10. R13.7 进入门禁

进入 `R13.7 Query repeatability / no-write:先思考` 前必须满足:

- `R13.5` 和 `R13.6` 均为 completed_wait_user_confirm。
- 当前文件已写入 Command scope、operation namespace/key/digest、Command family semantic material、fresh/duplicate/conflict/in-flight/stored-missing/commit-unknown、accepted/rejected/version-conflict 和 side-effect no-rerun 表。
- 正式 `03-详细设计.md` 未被修改。
- `R13.7` 只允许思考 Query repeatability、no-write、page cursor、stale/degraded/unavailable copy-only 和 `R13.8` 写入边界。
- `R13.7` 不得写 Inbound / Outbound / Handoff / Job 的完整矩阵,不得写 storage schema、retry number、TTL、lock table、scheduler lease、config key、observability schema、test case schema 或 implementation code。

### 11. R13.6 stop-review

| 检查项 | 结果 |
|---|---|
| 是否写入 Command scope / non-scope | pass |
| 是否写入 key / digest 来源表 | pass |
| 是否按八个 Command family 写 key/digest 侧重点 | pass |
| 是否写入 fresh / duplicate / conflict / in-flight / stored missing / commit unknown 分支表 | pass |
| 是否写入 accepted / rejected / version conflict 表 | pass |
| 是否写入 side-effect no-rerun 表 | pass |
| 是否未写 Query / Inbound / Outbound / Handoff / Job 矩阵 | pass |
| 是否未写 storage schema、lock、TTL、retry number、config key、test schema 或 implementation code | pass |
| 是否未修改正式 `03-详细设计.md` | pass |
| 是否形成 R13.7 进入门禁 | pass |

next_allowed_action: 等待用户确认后进入 Step 13 `R13.7 Query repeatability / no-write:先思考`;只允许思考 Query repeatability、no-write、page cursor、stale/degraded/unavailable copy-only、material missing、no repair、no idempotency store 和 `R13.8` 写入边界;不得直接修改正式 `03-详细设计.md`;不得写 Inbound / Outbound / Handoff / Job 的完整矩阵;不得写 storage schema、retry number、TTL、lock table、scheduler lease、config key、observability schema、test case schema 或 implementation code。

---

## R13.7 Query repeatability / no-write:先思考

### 1. 当前模块目标

`R13.7` 只思考 Query repeatability / no-write 的并发、重复调用和游标边界,为 `R13.8` 写入 Query-focused 表格做准备。当前模块不写最终 Query 矩阵,不进入 Inbound / Outbound / Handoff / Job,不定义 storage schema、retry number、TTL、lock table、scheduler lease、config key、observability schema、test case schema 或 implementation code。

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm |
| 当前允许 | 思考 repeated Query、no-write、page cursor、stale/degraded/unavailable copy-only、material missing、no repair、no idempotency store 和 `R13.8` 写入计划。 |
| 当前禁止 | 修改正式 `03-详细设计.md`;写 R13.8 最终表;写 Inbound / Outbound / Handoff / Job 矩阵;写 storage schema、retry number、TTL、lock table、scheduler lease、config key、observability schema、test case schema 或 implementation code。 |

### 2. Query 输入依据思考

| 输入 | R13.7 使用方式 | 不得外推 |
|---|---|---|
| Step 8 Query protocol family | Query envelope、selector、response view、page、empty/not-visible/stale/degraded/unavailable shell。 | 不写 selector 字段 schema;不从 protocol shell 反推 private cursor store。 |
| Step 9 shared query read template | query entry -> read context -> read resolver / repository / mapper / availability -> safe surface -> return without write UoW。 | 不让 Query 保存 material、修复 view、append audit、创建 event candidate、启动 job、刷新 external summary 或写 stored result。 |
| Step 11 transaction boundary | Query read 没有写 UoW,无 rollback state;page cursor 不替代 optimistic version 或 checkpoint。 | 不把 Query repeatability 做成 idempotency reserve / stored replay。 |
| Step 12 Query recovery | invalid selector、safe absent/empty、not-visible、stale-visible、degraded、unavailable、consistency defect 均要求 marker/source copy-only。 | 不从 raw error、exception text、fake enum 或 adapter status 合成 public marker。 |

### 3. Query repeatability 思考

Query 的重复调用不属于 request idempotency。它的正确模型是“重复读当前可授权 read surface”,而不是“复用 stored result”。

| scenario | R13.7 thought | must not do |
|---|---|---|
| same Query repeated immediately | 重新执行 read resolver 和 repository read,返回当前 safe surface。 | reserve idempotency、保存 query result、复制旧 query response。 |
| repeated Query sees changed committed truth | 返回新一次读取到的 safe current surface;不保证 repeatable snapshot。 | 用旧 response 掩盖已提交变化。 |
| repeated Query sees stale/degraded marker | 复制本次读取的 formal marker,不修复。 | 刷新 material 或把 stale 当 success freshness。 |
| repeated Query during unavailable dependency | 返回 unavailable / degraded safe surface if formal marker exists。 | 将 raw adapter failure 变成 retry rule 或 success empty。 |
| repeated Query with invalid cursor / selector | safe invalid selector/page surface。 | 把 invalid cursor 当 empty page 或 checkpoint resume。 |

### 4. no-write 边界思考

| no-write 轴 | 允许 | 禁止 |
|---|---|---|
| read side | committed truth、projection/material/view、summary/report、resolver/mapper/availability output。 | uncommitted mutation state、private adapter state、raw external body。 |
| write side | none。 | save truth/material/view/marker/progress/report、append trace/audit、publish event、start job、store query replay。 |
| repair side | none;only return degraded/unavailable/consistency surface。 | repair stale view、refresh projection、backfill sidecar、create missing material。 |
| observability | Step 15 后续可定义 observation,但 Query 本身不写 success trace/audit。 | 在 R13 让 Query 写审计事实或 evidence artifact。 |
| idempotency | none for Query。 | idempotency guard、stored result、duplicate replay、same key conflict。 |

### 5. page cursor / version / checkpoint 分离思考

| token / marker | Query 中的角色 | 禁止混用 |
|---|---|---|
| page cursor | 翻页 continuation / list position;来源必须是 formal page helper。 | 替代 expected_version、checkpoint、freshness marker、idempotency key。 |
| optimistic version | Command / mutable save 并发保护;Query 可展示 safe version ref only if public surface允许。 | 作为 page cursor 或 Query repeat token。 |
| checkpoint | Operations Job resume/progress anchor。 | 作为 Query page cursor 或 Query consistency proof。 |
| freshness marker | 表示 stale/current/degraded read material status。 | 从 page cursor、timestamp、cache hit 或 clock 推断。 |
| read subject / selector | Query read resolver 的 typed input/output。 | route string、raw id、private map 拼接。 |

### 6. stale / degraded / unavailable copy-only 思考

| surface | allowed source | Query action | must not do |
|---|---|---|---|
| stale-visible | loaded material/view marker、builder output、refresh output。 | return stale-visible safe surface with copied marker。 | use timestamp/cache hit/page cursor/private flag as stale source。 |
| degraded | degraded mapper、partiality marker、safe diagnostic。 | return degraded surface,possibly with partial page indication。 | derive from exception text,linked ref mismatch string,stack trace or fake enum。 |
| unavailable | availability resolver、adapter availability summary、infra safe diagnostic。 | return unavailable surface when source says unavailable。 | expose HTTP/SQL/IO code,endpoint,secret,raw provider response。 |
| not-visible | read resolver / boundary / policy marker。 | return not-visible without revealing hidden truth existence。 | collapse to absent/degraded in a way that leaks existence。 |
| safe absent / empty | repository safe absence or read resolver safe absent。 | return absent/empty surface。 | infer absence from raw store miss or URL/path。 |

### 7. material missing / partial page 思考

List Query 和 linked-material Query 不能通过“静默跳过”隐藏一致性问题。

| scenario | R13.7 thought | R13.8 handling direction |
|---|---|---|
| page empty by selector | empty is valid if repository/page helper says empty。 | write empty page row。 |
| listed item missing | partial/degraded if page source expected item;safe absent only when resolver says absence is safe。 | write partial page / missing item row。 |
| linked material mismatch | degraded or consistency defect depending on formal diagnostic source。 | write linked ref mismatch row。 |
| item not visible | item-level not-visible must preserve no-leak rule。 | write not-visible item / redaction thought row if formal surface exists。 |
| marker/source missing | design blocker,not runtime success。 | write blocker row;do not invent marker。 |
| material unavailable | unavailable/degraded copied from availability source。 | write unavailable item/material row。 |

### 8. Query watch / blocker 思考

| ID | 主题 | 当前判断 | R13.8 处理 |
|---|---|---|---|
| ML-D03-S13-QRY-WATCH-001 | Query idempotency exclusion | Query must not reserve idempotency or store replay。 | R13.8 写 no idempotency store row。 |
| ML-D03-S13-QRY-WATCH-002 | page cursor source | page cursor must come from formal page helper and stay separate from version/checkpoint。 | R13.8 写 cursor/version/checkpoint separation table。 |
| ML-D03-S13-QRY-WATCH-003 | marker copy-only | stale/degraded/unavailable/not-visible marker must copy formal source。 | R13.8 写 marker-source table。 |
| ML-D03-S13-QRY-WATCH-004 | material missing / partial page | listed item missing and linked ref mismatch cannot silently become empty success。 | R13.8 写 material missing / partial page table。 |
| ML-D03-S13-QRY-WATCH-005 | no repair | Query cannot repair stale/degraded material or trigger job。 | R13.8 写 forbidden side-effect table。 |
| ML-D03-S13-QRY-BLOCK-001 | hard blocker | none at R13.7。 | R13.8 若发现 page helper / marker source / read resolver 缺口,新增 blocker 并暂停。 |

### 9. R13.8 写入计划思考

`R13.8` 应把本模块思考写成 Query-focused 可审计表,但仍不得进入 Inbound / Outbound / Handoff / Job。

1. 写 Query scope / non-scope。
2. 写 repeated Query / no idempotency store 表。
3. 写 no-write / no-repair / forbidden side-effect 表。
4. 写 page cursor / optimistic version / checkpoint / freshness 分离表。
5. 写 stale / degraded / unavailable / not-visible / safe absent copy-only 表。
6. 写 material missing / partial page / marker missing blocker 表。
7. 写 watch / blocker closure 和 `R13.9 Inbound / Outbound / Handoff reentry:先思考` 进入门禁。

### 10. R13.7 stop-review

| 检查项 | 结果 |
|---|---|
| 是否只思考 Query repeatability / no-write | pass |
| 是否明确 Query 不用 idempotency store / stored replay | pass |
| 是否覆盖 page cursor、version、checkpoint、freshness 分离 | pass |
| 是否覆盖 stale/degraded/unavailable copy-only | pass |
| 是否覆盖 material missing / partial page / no repair | pass |
| 是否未写 Inbound / Outbound / Handoff / Job 矩阵 | pass |
| 是否未写 storage schema、lock、TTL、retry number、config key、test schema 或 implementation code | pass |
| 是否未修改正式 `03-详细设计.md` | pass |
| 是否形成 R13.8 写入计划 | pass |

next_allowed_action: 等待用户确认后进入 Step 13 `R13.8 Query repeatability / no-write:再写入`;只允许写入 Query scope、repeated Query/no idempotency store、no-write/no-repair、cursor/version/checkpoint/freshness 分离、stale/degraded/unavailable/not-visible/safe absent copy-only、material missing/partial page/marker missing blocker、watch/blocker 和 `R13.9` 进入门禁;不得直接修改正式 `03-详细设计.md`;不得写 Inbound / Outbound / Handoff / Job 的完整矩阵;不得写 storage schema、retry number、TTL、lock table、scheduler lease、config key、observability schema、test case schema 或 implementation code。

---

## R13.8 Query repeatability / no-write:再写入

### 1. 当前模块目标

`R13.8` 将 `R13.7` 的 Query repeatability / no-write 思考落成可审计表格。当前模块覆盖 57 个 Query 的共享重复读、no-write、cursor 分离、marker copy-only、material missing / partial page 和 blocker 规则;不逐条写 57 个 Query 的 DTO 字段或 selector schema,不进入 Inbound / Outbound / Handoff / Job。

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm |
| 当前允许 | 写入 Query scope、repeated Query/no idempotency store、no-write/no-repair、cursor/version/checkpoint/freshness 分离、stale/degraded/unavailable/not-visible/safe absent copy-only、material missing/partial page/marker missing blocker、watch/blocker 和 `R13.9` 进入门禁。 |
| 当前禁止 | 修改正式 `03-详细设计.md`;写 Inbound / Outbound / Handoff / Job 矩阵;写 storage schema、retry number、TTL、lock table、scheduler lease、config key、observability schema、test case schema 或 implementation code。 |

### 2. Query scope / non-scope

| 范围项 | R13.8 正式口径 |
|---|---|
| 覆盖入口 | Step 9 `R9.29` / Query overlay 已确认的 57 个 Query flow。 |
| 覆盖 family | 方法资产定义与目录、正式化与版本、受控消费、追溯与一致性保护、关系与分发语义、外部摘要与引用、后台维护与收敛、外围包与方法集组织。 |
| repeatability 目标 | repeated Query 每次重新读取当前 authorized safe read surface,不复制旧结果。 |
| no-write 目标 | Query 不创建、修复、刷新、append、publish、start job 或 store replay。 |
| marker 目标 | stale/degraded/unavailable/not-visible/safe absent/empty 均只复制 formal source。 |
| cursor 目标 | page cursor 只表达翻页 continuation,不得替代 optimistic version、checkpoint 或 freshness marker。 |
| 非范围 | Command idempotency、Inbound receipt dedup、Outbound/Handoff retry、Operations Job checkpoint resume、config/observability/test schema。 |

### 3. repeated Query / no idempotency store 表

| scenario | required behavior | reason | forbidden |
|---|---|---|---|
| same Query repeated | 重新执行 read resolver、repository / material read、marker copy 和 response assembly。 | Query 是当前读,不是 replayable mutation。 | idempotency reserve、stored query result、duplicate replay。 |
| repeated Query after committed change | 返回本次读取到的 safe current surface。 | 不承诺跨调用 stable snapshot。 | 用旧 response 掩盖新 truth/material。 |
| repeated Query during projection lag | 返回 stale/degraded surface when marker exists。 | lag 是 material/freshness 状态,不是 idempotency state。 | 触发 projection refresh 或写 repair marker。 |
| repeated Query during dependency unavailable | 返回 unavailable/degraded safe surface when formal availability source exists。 | 可用性来自 resolver/availability output。 | 从 raw exception 推 retryability,或把 unavailable 当 empty success。 |
| repeated Query with invalid selector/cursor | 返回 safe invalid selector/page surface。 | selector/page cursor 是 read input validation。 | 当作 empty page、checkpoint resume 或 optimistic version conflict。 |

### 4. no-write / no-repair / forbidden side-effect 表

| Query action area | allowed | forbidden |
|---|---|---|
| read | committed truth、projection/material/view、summary/report、resolver/mapper/availability output。 | uncommitted Command state、private adapter state、raw external body。 |
| response assembly | safe view、safe page、typed refs、safe markers、safe diagnostics。 | public DTO body persisted for replay、raw provider body、stack trace。 |
| material handling | return stale/degraded/unavailable/absent surface according to formal marker。 | create material、refresh projection、backfill sidecar、update freshness。 |
| audit / trace | none in Query flow;Step 15 may later observe read without changing truth。 | append trace/audit/lineage/history,write evidence artifact,record success fact。 |
| event / job | none。 | create event candidate,publish event,start maintenance job,run job body。 |
| replay | none。 | MethodAssetIdempotencyGuard,stored operation result,duplicate result store。 |

### 5. cursor / version / checkpoint / freshness 分离表

| token / marker | owner / source | Query usage | must not replace |
|---|---|---|---|
| page cursor | formal page helper / repository list page output。 | list continuation and ordering position。 | optimistic version,checkpoint,freshness,idempotency key。 |
| optimistic version | versioned repository read for mutable save。 | may be displayed only when safe public surface requires version ref;not used by Query for writes。 | page cursor,checkpoint,stale marker。 |
| checkpoint | Operations Job progress/checkpoint store。 | Query may read checkpoint/report surface as safe view only。 | Query page cursor,truth version,repeat token。 |
| freshness marker | material/view/projection builder or refresh output。 | stale/current/degraded read material marker。 | page cursor,timestamp,cache hit,Clock value。 |
| read subject / selector | typed selector / read resolver summary。 | authorize and scope read。 | route string,raw id,private map,transport path。 |

### 6. marker copy-only 表

| surface | allowed source | Query behavior | forbidden source |
|---|---|---|---|
| stale-visible | loaded material/view marker,builder output,refresh output。 | return stale-visible with copied marker。 | timestamp,cache hit,page cursor,private flag。 |
| degraded | degraded mapper,partiality marker,safe diagnostic。 | return degraded surface and preserve partial reason refs。 | exception text,stack trace,provider body,debug dump,fake enum。 |
| unavailable | availability resolver,adapter availability summary,infra safe diagnostic。 | return unavailable or degraded-unavailable surface。 | HTTP/SQL/IO code,endpoint,secret,raw config value。 |
| not-visible | read resolver,boundary/policy marker。 | return not-visible without leaking hidden truth existence。 | auth text,token claim,route ACL string。 |
| safe absent / empty | repository safe absence,read resolver safe absent,page helper empty page。 | return absent/empty surface。 | raw store miss,URL/path,external id,exception text。 |
| consistency defect | missing formal marker/source/page helper/schema。 | stop or return manual consistency surface according to Step 12。 | synthesize marker,private map,placeholder ref。 |

### 7. material missing / partial page / marker missing 表

| scenario | required behavior | blocker condition | forbidden |
|---|---|---|---|
| exact material missing | safe absent if resolver says absence safe;otherwise degraded/consistency defect。 | no safe absent or degraded source。 | create material or return raw not-found detail。 |
| listed item missing | partial/degraded if page expected item。 | no partial/degraded marker source。 | silently skip item or collapse page to empty success。 |
| linked ref mismatch | degraded or consistency defect depending on diagnostic source。 | no safe diagnostic / mapper source。 | repair link,delete item,or expose raw mismatch text。 |
| item not visible | item-level or page-level not-visible surface only if formal no-leak rule exists。 | no formal redaction/not-visible surface。 | leak hidden subject by absent/degraded distinction。 |
| item unavailable | unavailable/degraded copied from availability source。 | no availability marker。 | retry adapter blindly or expose adapter error。 |
| invalid cursor | safe invalid page request / selector surface。 | page helper cannot classify cursor。 | treat as checkpoint,version conflict or empty page。 |

### 8. Query watch / blocker closure

| ID | 主题 | R13.8 结果 | 后续 |
|---|---|---|---|
| ML-D03-S13-QRY-WATCH-001 | Query idempotency exclusion | closed;Query has no idempotency guard or stored replay。 | Step 16 later verifies no query replay/write。 |
| ML-D03-S13-QRY-WATCH-002 | page cursor source | closed_semantic;cursor/version/checkpoint/freshness separated。 | R13.15 closure audit checks page helper source if formal §12 needs detail。 |
| ML-D03-S13-QRY-WATCH-003 | marker copy-only | closed_semantic;marker table records allowed sources and forbidden sources。 | Missing source remains blocker in implementation/design closure。 |
| ML-D03-S13-QRY-WATCH-004 | material missing / partial page | closed_semantic;listed missing cannot silently become empty success。 | Step 16 later tests no silent skip。 |
| ML-D03-S13-QRY-WATCH-005 | no repair | closed;Query cannot repair,refresh,append,publish,start job or store result。 | Observability only in Step 15。 |
| ML-D03-S13-QRY-BLOCK-001 | hard blocker | none at R13.8。 | Later missing page helper/marker source/read resolver creates blocker。 |

### 9. R13.9 进入门禁

进入 `R13.9 Inbound / Outbound / Handoff reentry:先思考` 前必须满足:

- `R13.7` 和 `R13.8` 均为 completed_wait_user_confirm。
- 当前文件已写入 Query scope、repeated Query / no idempotency store、no-write / no-repair、cursor/version/checkpoint/freshness 分离、marker copy-only、material missing / partial page / marker missing 表。
- 正式 `03-详细设计.md` 未被修改。
- `R13.9` 只允许思考 Inbound redelivery、Outbound publication retry、Handoff retry、post-commit no rollback、stored receipt/outcome source 和 `R13.10` 写入边界。
- `R13.9` 不得写 Job / checkpoint resume 完整矩阵,不得写 storage schema、retry number、TTL、lock table、scheduler lease、config key、observability schema、test case schema 或 implementation code。

### 10. R13.8 stop-review

| 检查项 | 结果 |
|---|---|
| 是否写入 Query scope / non-scope | pass |
| 是否写入 repeated Query / no idempotency store 表 | pass |
| 是否写入 no-write / no-repair / forbidden side-effect 表 | pass |
| 是否写入 cursor/version/checkpoint/freshness 分离表 | pass |
| 是否写入 marker copy-only 表 | pass |
| 是否写入 material missing / partial page / marker missing 表 | pass |
| 是否未写 Inbound / Outbound / Handoff / Job 矩阵 | pass |
| 是否未写 storage schema、lock、TTL、retry number、config key、test schema 或 implementation code | pass |
| 是否未修改正式 `03-详细设计.md` | pass |
| 是否形成 R13.9 进入门禁 | pass |

next_allowed_action: 等待用户确认后进入 Step 13 `R13.9 Inbound / Outbound / Handoff reentry:先思考`;只允许思考 Inbound redelivery、Outbound publication retry、Handoff retry、post-commit no rollback、stored receipt/outcome source、duplicate/no-op/retry semantics 和 `R13.10` 写入边界;不得直接修改正式 `03-详细设计.md`;不得写 Job / checkpoint resume 完整矩阵;不得写 storage schema、retry number、TTL、lock table、scheduler lease、config key、observability schema、test case schema 或 implementation code。

---

## R13.9 Inbound / Outbound / Handoff reentry:先思考

### 1. 当前模块目标

`R13.9` 只思考 Inbound / Outbound / Handoff 的重入、重复投递、发布重试、handoff retry 和 post-commit no rollback 边界,为 `R13.10` 写入可审计表格做准备。当前模块不写最终矩阵,不进入 Job / checkpoint resume,不定义 storage schema、retry number、TTL、lock table、scheduler lease、config key、observability schema、test case schema 或 implementation code。

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm |
| 当前允许 | 思考 Inbound redelivery、Outbound publication retry、Handoff retry、post-commit no rollback、stored receipt/outcome source、duplicate/no-op/retry semantics、body-free 禁止来源和 `R13.10` 写入计划。 |
| 当前禁止 | 修改正式 `03-详细设计.md`;写 R13.10 最终表;写 Job / checkpoint resume 完整矩阵;写 storage schema、retry number、TTL、lock table、scheduler lease、config key、observability schema、test case schema 或 implementation code。 |

### 2. 输入依据思考

| 输入 | R13.9 使用方式 | 不得外推 |
|---|---|---|
| Step 8 Inbound protocol shell | inbound envelope、typed payload boundary、intake decision、duplicate/quarantine/delayed/no-op receipt、stored result source、worker result。 | 不从 broker topic、queue offset、raw payload、dead-letter 或 transport ack 反推正式 receipt。 |
| Step 8 Outbound protocol shell | outbound envelope、body-free fact payload、event candidate、publisher result、publication outcome、target registry summary。 | 不把 subscriber ack、topic、delivery receipt、external payload body 写成本仓 truth。 |
| Step 8 Handoff shell | handoff-safe refs、handoff marker、outcome、receipt/failure marker、safe hints。 | 不持有外部归档包、report body、provider response、endpoint、secret 或 raw exception。 |
| Step 9 shared inbound flow | reserve source dedup/idempotency;duplicate replay stored consumer receipt;malformed/unsupported/rejected/delayed/quarantine save safe receipt;accepted save intake summary/receipt/worker result。 | Inbound consumer 不直接创建 definition、formal version、relation、package、maintenance task 或 core truth。 |
| Step 9 shared outbound flow | accepted command/completed job/bounded intake emits body-free fact summary;candidate is publisher source;publisher loads candidate shell and target registry summary。 | Publisher 不重读 current truth 重建 payload;publication failure 不回滚 accepted truth。 |
| Step 11 IOH transaction boundary | Inbound receipt/intake decision 同 UoW;Outbound/Handoff outcome UoW 与 accepted truth/report/candidate 分离;failure no rollback。 | 不把 outcome UoW 合并成 accepted truth rollback rule。 |
| Step 12 IOH recovery | duplicate receipt replay no-rerun;body-free violation safe rejection/quarantine;publication/handoff failure safe outcome;marker copy-only。 | 不从 raw error、adapter code、retry count 或 private map 合成 public marker。 |

### 3. Inbound redelivery 思考

Inbound 重投递的核心不是执行核心业务幂等,而是 source dedup + stored receipt replay。Inbound consumer 的 accepted 结果也只是 intake/receipt/worker result,后续核心 truth mutation 必须由正式 Command 或 Job 入口完成。

| scenario | R13.9 thought | must not do |
|---|---|---|
| first inbound envelope | reserve source dedup / idempotency using formal source binding and envelope metadata;then load body-free source summary and adapter marker。 | 从 raw body、topic、offset、timestamp 或 transport path 生成正式 dedup key。 |
| same envelope redelivered | replay stored consumer receipt / worker result if key + digest match and stored surface exists。 | 重新调用 adapter、重复保存 intake summary、触发 Command 或修改 core truth。 |
| same key different digest | safe conflict / rejected receipt according to formal inbound receipt source。 | 覆盖旧 receipt 或将差异当 no-op。 |
| completed receipt missing | consistency / manual surface;不得重跑 accepted body。 | 通过重新读取 raw envelope 重建 receipt。 |
| malformed / unsupported / body-boundary violation | save safe receipt/quarantine/delayed/no-op according to Step 8/12 shell。 | 泄露 raw payload、provider body、stack trace 或 external content。 |
| accepted inbound summary | save intake summary、receipt、worker result only;handoff hint may point to later formal Command/Job。 | 直接创建方法资产定义、版本、关系、包或 maintenance truth。 |

### 4. Outbound publication retry 思考

Outbound publication 的重试对象是 durable event candidate shell,不是 accepted truth 本身。publisher worker 只能从 candidate shell 和 target registry summary 得到发布输入,不能通过重读 current truth 重建事件。

| scenario | R13.9 thought | must not do |
|---|---|---|
| first publish attempt | load candidate shell;resolve target registry enabled/blocked/unavailable summary;call publisher port;write safe outcome。 | 从 current truth 重建 payload,或把 event topic / delivery receipt 写成本仓 truth。 |
| retry after failed outcome | retry starts from same durable candidate shell and target registry summary;new outcome records safe result if Step 11/12 permit。 | rollback accepted command/job truth,delete candidate,or claim subscriber success。 |
| target blocked | return/write blocked outcome with copied target/marker source。 | treat blocked as success delivered or as truth failure。 |
| target unavailable | return/write unavailable/failed safe outcome with formal marker。 | expose endpoint,HTTP/SQL/IO code,secret,provider response。 |
| duplicate publisher attempt | use candidate identity/outcome guard to prevent double-success semantics;safe replay/skip only if stored outcome source exists。 | publish again while pretending it is same single side effect without formal outcome identity。 |
| candidate missing/corrupt | consistency/manual surface。 | reconstruct candidate from current truth or historical trace body。 |

### 5. Handoff retry 思考

Handoff retry 的对象是 local handoff-safe refs 与 local outcome marker,不是外部系统状态。local delivered 只能表达本仓保存的 safe handoff outcome,不能声明外部最终 truth。

| scenario | R13.9 thought | must not do |
|---|---|---|
| prepared handoff | load report/candidate/handoff-safe refs;call handoff seam;write prepared/delivered/failed/blocked/unavailable safe outcome。 | 存储 package/report/archive body 或 external receipt body。 |
| retry failed handoff | retry from local handoff-safe refs and copied safe failure marker。 | rollback local report/candidate/truth or rewrite report body。 |
| duplicate delivered outcome | replay/skip from stored local outcome only if outcome identity permits。 | call external seam again to infer previous success。 |
| delivered without external receipt body | keep body-free delivered marker if formal shell supports it;otherwise blocker/manual。 | fabricate receipt_ref or persist provider response as proof。 |
| blocked/unavailable target | copy formal blocked/unavailable marker。 | convert endpoint failure into domain truth failure。 |
| handoff source missing | consistency/manual surface。 | rebuild handoff refs from raw report body or external archive path。 |

### 6. post-commit no rollback 思考

| side-effect family | post-commit source | retry owner | no rollback rule |
|---|---|---|---|
| inbound accepted receipt | stored receipt / intake summary / worker result。 | inbound consumer redelivery guard。 | 后续 Command/Job 失败不回滚已保存 receipt;只通过正式后续入口处理。 |
| outbound event candidate | durable body-free candidate shell。 | publisher worker / publication outcome guard。 | publication failed/blocked/unavailable 不回滚 accepted command/job truth。 |
| handoff outcome | handoff-safe refs and local outcome shell。 | handoff worker / outcome guard。 | external failure 不回滚 report/candidate/local committed truth。 |
| audit / trace side effect | Step 11/12 defined append/marker source。 | later side-effect recovery boundary。 | duplicate replay 不追加新的 accepted audit/trace side effect。 |

### 7. stored receipt / outcome source 思考

| stored surface | replay / retry use | blocker if missing |
|---|---|---|
| inbound consumer receipt | duplicate inbound returns stored receipt/worker result;no source adapter re-call。 | completed receipt required but absent -> consistency/manual;not rerun。 |
| inbound intake summary | later Command/Job can reference bounded intake if Step 9/11 formal source exists。 | no formal intake source -> cannot create downstream truth。 |
| event candidate | publisher retry source;body-free fact payload and trace context carrier。 | missing candidate -> cannot rebuild from current truth。 |
| publication outcome | duplicate publication / retry classification source。 | missing outcome after claimed completed publish -> consistency/manual。 |
| handoff outcome | duplicate handoff replay/skip source。 | missing local outcome marker -> consistency/manual。 |
| target registry summary | target enabled/blocked/unavailable classification source。 | missing marker -> cannot classify retry/blocked/unavailable。 |

### 8. duplicate / no-op / retry semantics 思考

| semantic | Inbound | Outbound | Handoff |
|---|---|---|---|
| duplicate | same source key + digest -> replay stored receipt;different digest -> conflict/rejected surface。 | same candidate/outcome identity -> use stored outcome or safe duplicate policy。 | same handoff identity -> use stored local outcome or safe duplicate policy。 |
| no-op | unsupported/no-op inbound receipt may be stored as safe worker result。 | target blocked may be no publish effect but still safe outcome,not accepted truth failure。 | blocked/unavailable handoff may leave local truth intact and record safe outcome。 |
| retry | allowed only from formal stored surface and formal marker。 | retry from durable candidate,not current truth。 | retry from handoff-safe refs,not external state。 |
| manual / consistency | stored receipt/outcome/source missing,marker missing,or body-free boundary violated。 | candidate/outcome/target marker missing。 | handoff refs/outcome/receipt marker missing。 |

### 9. watch / blocker 思考

| ID | 主题 | 当前判断 | R13.10 处理 |
|---|---|---|---|
| ML-D03-S13-IOH-WATCH-001 | inbound receipt replay | duplicate redelivery must replay stored receipt/worker result and avoid source adapter re-call。 | 写 inbound redelivery table。 |
| ML-D03-S13-IOH-WATCH-002 | inbound no core truth mutation | inbound consumer accepted path only stores intake/receipt/worker result。 | 写 forbidden mutation row。 |
| ML-D03-S13-IOH-WATCH-003 | outbound candidate source | publisher retry source is durable candidate shell,not current truth。 | 写 outbound publication retry table。 |
| ML-D03-S13-IOH-WATCH-004 | publication no rollback | publish failure/blocked/unavailable never roll back accepted truth。 | 写 post-commit no rollback table。 |
| ML-D03-S13-IOH-WATCH-005 | handoff local outcome only | delivered/failed/blocked/unavailable are local safe outcomes,not external truth。 | 写 handoff retry table。 |
| ML-D03-S13-IOH-WATCH-006 | marker/source copy-only | all retry/blocked/unavailable/failed markers must copy formal source。 | 写 stored source / blocker table。 |
| ML-D03-S13-IOH-BLOCK-001 | hard blocker | none at R13.9。 | R13.10 若发现 receipt/outcome/candidate/target marker formal source 缺口,新增 blocker 并暂停。 |

### 10. R13.10 写入计划思考

`R13.10` 应把本模块思考写成 Inbound / Outbound / Handoff-focused 可审计表,但仍不得进入 Job / checkpoint resume。

1. 写 Inbound / Outbound / Handoff scope / non-scope。
2. 写 Inbound source dedup、redelivery、stored receipt replay、malformed/unsupported/quarantine/no-op、no core truth mutation 表。
3. 写 Outbound candidate publication retry、target blocked/unavailable、duplicate outcome、candidate missing 表。
4. 写 Handoff retry、prepared/delivered/failed/blocked/unavailable、external truth forbidden 表。
5. 写 post-commit no rollback 表。
6. 写 stored receipt/outcome source、body-free forbidden source、marker copy-only / missing blocker 表。
7. 写 watch / blocker closure 和 `R13.11 Job / checkpoint resume:先思考` 进入门禁。

### 11. R13.9 stop-review

| 检查项 | 结果 |
|---|---|
| 是否只思考 Inbound / Outbound / Handoff reentry | pass |
| 是否覆盖 inbound redelivery / stored receipt replay | pass |
| 是否覆盖 outbound candidate publication retry | pass |
| 是否覆盖 handoff retry 与 local outcome | pass |
| 是否覆盖 post-commit no rollback | pass |
| 是否覆盖 body-free / marker copy-only / missing source blocker | pass |
| 是否未写 Job / checkpoint resume 矩阵 | pass |
| 是否未写 storage schema、lock、TTL、retry number、config key、test schema 或 implementation code | pass |
| 是否未修改正式 `03-详细设计.md` | pass |
| 是否形成 R13.10 写入计划 | pass |

next_allowed_action: 等待用户确认后进入 Step 13 `R13.10 Inbound / Outbound / Handoff reentry:再写入`;只允许写入 Inbound / Outbound / Handoff scope、Inbound redelivery / stored receipt replay、Outbound candidate publication retry、Handoff outcome retry、post-commit no rollback、stored receipt/outcome source、body-free / forbidden source、marker copy-only / missing blocker、watch/blocker 和 `R13.11` 进入门禁;不得直接修改正式 `03-详细设计.md`;不得写 Job / checkpoint resume 完整矩阵;不得写 storage schema、retry number、TTL、lock table、scheduler lease、config key、observability schema、test case schema 或 implementation code。

---

## R13.10 Inbound / Outbound / Handoff reentry:再写入

### 1. 当前模块目标

`R13.10` 将 `R13.9` 的 Inbound / Outbound / Handoff reentry 思考落成可审计表格。当前模块覆盖 4 个 Inbound Consumer、34 个 Outbound Event / publication flow 和 handoff outcome 边界的重复投递、重试、stored receipt/outcome replay、post-commit no rollback 与 body-free source 规则;不进入 Job / checkpoint resume。

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm |
| 当前允许 | 写入 Inbound / Outbound / Handoff scope、Inbound redelivery / stored receipt replay、Outbound candidate publication retry、Handoff outcome retry、post-commit no rollback、stored receipt/outcome source、body-free / forbidden source、marker copy-only / missing blocker、watch/blocker 和 `R13.11` 进入门禁。 |
| 当前禁止 | 修改正式 `03-详细设计.md`;写 Job / checkpoint resume 完整矩阵;写 storage schema、retry number、TTL、lock table、scheduler lease、config key、observability schema、test case schema 或 implementation code。 |

### 2. Inbound / Outbound / Handoff scope / non-scope

| 范围项 | R13.10 正式口径 |
|---|---|
| Inbound 覆盖 | Step 9 `R9.38` 的 4 个 Inbound Consumer flow,包括 accepted、duplicate、unsupported、malformed/raw-body、delayed/unavailable 和 no-op receipt。 |
| Outbound 覆盖 | Step 9 `R9.39` 的 34 个 Outbound Event / publication flow,包括 candidate assembly、target registry、publisher outcome 和 publication failure no rollback。 |
| Handoff 覆盖 | Step 8/11/12 已定义的 body-free handoff-safe refs、handoff marker/outcome、prepared/delivered/failed/blocked/unavailable local safe outcome。 |
| reentry 目标 | duplicate / retry 只能从 stored receipt、durable candidate、publication outcome、handoff-safe refs 或 local outcome shell 继续。 |
| no rollback 目标 | accepted truth、stored intake、candidate、job report 或 local report 一旦 committed,publication/handoff failure 不回滚它们。 |
| body-free 目标 | IOH 重入面只携带 typed refs、summary refs、marker、safe reason、safe issue;不得持有 raw external body、payload body、archive/package/report body 或 provider response。 |
| 非范围 | Command idempotency、Query no-write、Operations Job checkpoint resume、scheduler lease、retry number/TTL、physical storage schema、config binding、observability schema、test case schema。 |

### 3. Inbound redelivery / stored receipt replay 表

| scenario | required behavior | stored / marker source | forbidden |
|---|---|---|---|
| first inbound envelope | validate worker shell and envelope boundary;reserve source dedup / idempotency;load body-free source summary;save intake decision,receipt and worker result。 | inbound envelope metadata,source binding summary,inbound source port,body-free adapter summary。 | derive key from raw body,topic,offset,timestamp,path or provider payload。 |
| duplicate same key + same digest | replay stored inbound receipt / worker result;no source adapter re-call and no downstream mutation。 | `inbound_receipts` stored shell and stored worker result surface from Step 8/11。 | parse raw envelope again,repeat intake save,trigger Command/Job or update core truth。 |
| same key different digest | return/store safe conflict or rejected receipt according to formal inbound receipt shell。 | inbound dedup guard and formal receipt conflict marker if defined。 | overwrite previous receipt,merge two envelopes,or treat digest mismatch as no-op。 |
| completed receipt missing / unreadable | consistency/manual surface;do not rerun accepted inbound body。 | stored receipt lookup result and Step 12 duplicate replay surface issue。 | reconstruct receipt from current external source,raw payload or transport log。 |
| unsupported schema | save unsupported safe receipt;no body parsing beyond envelope boundary。 | Step 8 inbound receipt kind and safe schema marker。 | dead-letter/topic detail as truth,or expose raw unsupported payload。 |
| malformed / raw body / body-boundary violation | save rejected/quarantine safe receipt;preserve body-free diagnostic only。 | body-boundary helper / safe diagnostic marker。 | store rejected body excerpt,archive body,path,provider response or stack trace。 |
| delayed / unavailable source | save delayed/unavailable receipt with copied formal unavailable marker。 | inbound source port or adapter availability summary。 | classify retryability from raw exception,HTTP code,endpoint or secret-bearing config。 |
| accepted inbound summary | save intake summary,receipt,worker result and optional safe event hint only。 | intake decision and body-free source/summary refs。 | create definition/formal version/relation/package/maintenance truth directly from inbound signal。 |

### 4. Outbound candidate publication retry 表

| scenario | required behavior | stored / marker source | forbidden |
|---|---|---|---|
| first publication attempt | load durable event candidate shell;resolve target registry;call publisher port;write safe publication outcome。 | event candidate assembly,accepted result/job report/intake receipt source,target registry summary,publisher outcome。 | rebuild event from current truth,store topic/payload body,or claim subscriber success。 |
| retry after failed outcome | retry from same durable candidate shell and current formal target registry / publisher outcome source;write a new safe outcome only if formal outcome guard permits。 | candidate_ref,target_ref,publication outcome shell,target availability marker。 | rollback accepted source truth,delete candidate,or mutate candidate source to fit retry。 |
| duplicate publication attempt | use candidate identity + target identity + stored outcome to replay/skip according to formal outcome surface。 | publication outcome shell keyed by candidate/target identity from Step 11。 | blindly publish again while representing the side effect as already idempotent。 |
| target blocked / unsupported | return/write blocked or unsupported outcome with copied marker;candidate/source remains committed。 | target registry / publisher policy blocked marker。 | choose alternate target,override registry decision,or mark source truth failed。 |
| publisher unavailable | return/write unavailable/failed safe outcome;retryability only if formal marker says so。 | publisher port outcome or runtime binding availability summary。 | expose transport code,endpoint,secret,raw provider response or adapter exception text。 |
| candidate missing / corrupt | consistency/manual surface;no publication attempt。 | candidate store lookup / shell validation result。 | reread current truth,scan audit logs,or parse historical payload to rebuild candidate。 |
| outcome persistence failure | consistency unknown/manual;do not claim durable publication outcome exists。 | local outcome save failure safe diagnostic if formal。 | persist raw delivery receipt fallback or republish without outcome guard。 |

### 5. Handoff outcome retry 表

| scenario | required behavior | stored / marker source | forbidden |
|---|---|---|---|
| prepared handoff | load handoff-safe refs;call handoff seam only with body-free shell;write prepared/delivered/failed/blocked/unavailable outcome。 | handoff marker/handoff-safe refs,target registry/handoff port outcome。 | store report body,archive package,external receipt payload or downstream state。 |
| retry failed handoff | retry from local handoff-safe refs and copied safe failure marker;source truth/report/candidate remains committed。 | handoff_ref,local outcome shell,failure marker。 | rollback local report/candidate/truth,or rewrite report body to make handoff pass。 |
| duplicate delivered outcome | replay/skip from stored local handoff outcome only if outcome identity permits。 | local handoff outcome shell and body-free delivered marker。 | call external seam to infer previous success or claim downstream business truth。 |
| delivered with formal receipt marker | record local delivered safe marker;delivered means local safe outcome only。 | handoff port body-free receipt marker / target outcome summary。 | persist external receipt body,package body,archive contents or provider response。 |
| delivered marker missing | consistency/manual or blocker depending formal shell;do not fabricate receipt_ref。 | missing formal marker/source detection。 | synthesize delivered marker from endpoint response,filename,path or timestamp。 |
| blocked / unavailable target | write blocked/unavailable local outcome with copied formal marker。 | handoff target registry / runtime binding / handoff port outcome。 | convert target failure into domain truth failure or raw adapter error exposure。 |
| handoff source missing | consistency/manual;no handoff seam call。 | local handoff-safe ref lookup。 | rebuild handoff source from raw report body,external archive path or public DTO。 |

### 6. post-commit no rollback 表

| family | committed local source | later failure | required behavior | forbidden rollback |
|---|---|---|---|---|
| inbound accepted receipt | intake summary,receipt,worker result。 | downstream Command/Job later rejects or fails。 | preserve receipt;later entry returns its own safe rejection/failure。 | delete/rewrite receipt or reclassify accepted inbound as not received。 |
| outbound candidate | accepted command effect,job report,intake receipt,candidate shell。 | publisher blocked/unavailable/failed/outcome save unknown。 | preserve source and candidate;record safe outcome/manual issue when formal source exists。 | rollback accepted truth/job report/intake/candidate。 |
| handoff source | local report,candidate,handoff-safe refs。 | handoff failed/blocked/unavailable/outcome save unknown。 | preserve local source;record local handoff outcome/manual issue。 | rollback report/candidate/local truth or claim external truth corrected it。 |
| deferred observation | accepted truth/report/candidate already committed。 | audit/trace/lineage/handoff observation fails。 | preserve committed source;safe issue belongs to side-effect layer。 | change accepted result to rejected or rerun mutation。 |

### 7. stored receipt / outcome source 与 body-free 禁止来源表

| surface | allowed replay / retry source | body-free allowed content | forbidden source |
|---|---|---|---|
| inbound receipt | stored receipt shell,stored worker result,intake summary ref。 | source refs,summary refs,receipt kind,safe marker,safe reason。 | raw envelope body,broker ack,topic,offset,dead-letter payload。 |
| inbound intake summary | body-free source summary and adapter marker。 | typed source refs,digest/version refs,availability marker。 | provider payload,artifact/archive body,URL/path as formal body。 |
| event candidate | accepted result/job report/intake receipt refs and body-free fact summary。 | changed refs,marker refs,safe reason refs,trace context,target hint。 | current truth reread,payload body,old outbox event,subscriber ack。 |
| publication outcome | publisher port outcome,target registry summary,runtime availability marker。 | published/blocked/unavailable/failed marker,safe diagnostic refs。 | transport status as truth,endpoint,secret,provider response,delivery receipt body。 |
| handoff outcome | handoff port body-free receipt/failure marker,target registry outcome。 | prepared/delivered/failed/blocked/unavailable marker and handoff-safe refs。 | external receipt payload,archive package,report body,external state owner。 |
| consistency/manual issue | formal missing-source or save-failure diagnostic if defined。 | safe issue ref,marker/source id,manual handoff hint。 | stack trace,SQL/HTTP body,debug dump,private map snapshot。 |

### 8. marker copy-only / missing blocker 表

| marker / source | copy-only source | missing source handling | forbidden synthesis |
|---|---|---|---|
| inbound unavailable / delayed | inbound source port or adapter availability summary。 | delayed/unavailable cannot be classified;record blocker/manual per Step 12。 | exception text,HTTP code,clock retry hint。 |
| inbound body-boundary violation | body-boundary helper / safe diagnostic builder。 | cannot store rejected/quarantine detail;pause as design blocker if shell missing。 | body excerpt,archive path,provider payload hash not defined as formal digest。 |
| publication blocked / unavailable / failed | target registry summary,publisher port outcome,runtime binding summary。 | publication outcome cannot be safely written;manual/design blocker。 | target name string,transport error,config value。 |
| candidate missing / corrupt | candidate shell validation and stored source lookup。 | consistency/manual;do not publish。 | current truth reconstruction,old event payload,log scan。 |
| handoff delivered / failed / blocked / unavailable | handoff port body-free outcome,target registry summary,runtime binding summary。 | delivered/failed outcome cannot be claimed;manual/design blocker。 | provider response body,receipt file,timestamp,external status page。 |
| outcome persistence unknown | local outcome store save result / UoW diagnostic if formal。 | consistency unknown/manual;do not assert stored replay works。 | raw database error,stack trace,manual note as marker。 |

### 9. duplicate / no-op / retry semantics closure

| semantic | Inbound closure | Outbound closure | Handoff closure |
|---|---|---|---|
| duplicate same semantic material | same source key + digest replays stored receipt/worker result。 | same candidate/target identity uses stored outcome/retry guard。 | same handoff identity uses stored local outcome/retry guard。 |
| conflict | same source key + different digest returns safe conflict/rejected receipt if formal。 | candidate identity mismatch is consistency/manual,not alternate publication。 | handoff source mismatch is consistency/manual,not alternate delivery。 |
| no-op | unsupported/no-op receipt is still stored safe worker result。 | blocked target is safe outcome,not source truth failure。 | blocked/unavailable handoff is local safe outcome,not source rollback。 |
| retry | only from stored surface and formal marker;no raw source reread。 | only from durable candidate and target/publisher formal marker。 | only from handoff-safe refs and local outcome marker。 |
| manual / consistency | stored receipt/source/marker missing blocks replay/retry。 | candidate/outcome/target marker missing blocks publication retry。 | handoff refs/outcome/receipt marker missing blocks handoff retry。 |

### 10. IOH watch / blocker closure

| ID | 主题 | R13.10 结果 | 后续 |
|---|---|---|---|
| ML-D03-S13-IOH-WATCH-001 | inbound receipt replay | closed_semantic;duplicate inbound replays stored receipt/worker result and does not re-call source adapter。 | Step 16 later verifies no rerun/no raw body。 |
| ML-D03-S13-IOH-WATCH-002 | inbound no core truth mutation | closed;accepted inbound stores intake/receipt/worker result only。 | Command/Job modules remain only truth mutation entry。 |
| ML-D03-S13-IOH-WATCH-003 | outbound candidate source | closed_semantic;publisher retry source is durable event candidate shell。 | Step 14 later binds target registry/runtime config without changing source rule。 |
| ML-D03-S13-IOH-WATCH-004 | publication no rollback | closed;publication failure/blocked/unavailable never rolls back accepted local source。 | Step 15 later observes publication outcome safely。 |
| ML-D03-S13-IOH-WATCH-005 | handoff local outcome only | closed;handoff delivered/failed/blocked/unavailable is local body-free outcome only。 | Step 15/16 later check no external truth guarantee。 |
| ML-D03-S13-IOH-WATCH-006 | marker/source copy-only | closed_semantic;tables define allowed source and missing-source blocker behavior。 | Implementation/design closure must pause if formal marker source missing。 |
| ML-D03-S13-IOH-BLOCK-001 | hard blocker | none at R13.10。 | Later missing receipt/outcome/candidate/target marker source becomes blocker,not implementation fallback。 |

### 11. R13.11 进入门禁

进入 `R13.11 Job / checkpoint resume:先思考` 前必须满足:

- `R13.9` 和 `R13.10` 均为 completed_wait_user_confirm。
- 当前文件已写入 Inbound / Outbound / Handoff scope、Inbound redelivery / stored receipt replay、Outbound candidate publication retry、Handoff outcome retry、post-commit no rollback、stored receipt/outcome source、body-free / forbidden source、marker copy-only / missing blocker、watch/blocker 表。
- 正式 `03-详细设计.md` 未被修改。
- `R13.11` 只允许思考 Operations Job idempotency、checkpoint resume、stored report replay、partial retry、manual consistency 和 `R13.12` 写入边界。
- `R13.11` 不得写 retry / lock / lease boundary 完整表,不得写 storage schema、retry number、TTL、lock table、scheduler lease、config key、observability schema、test case schema 或 implementation code。

### 12. R13.10 stop-review

| 检查项 | 结果 |
|---|---|
| 是否写入 IOH scope / non-scope | pass |
| 是否写入 Inbound redelivery / stored receipt replay 表 | pass |
| 是否写入 Outbound candidate publication retry 表 | pass |
| 是否写入 Handoff outcome retry 表 | pass |
| 是否写入 post-commit no rollback 表 | pass |
| 是否写入 stored receipt/outcome source 与 body-free 禁止来源表 | pass |
| 是否写入 marker copy-only / missing blocker 表 | pass |
| 是否未写 Job / checkpoint resume 矩阵 | pass |
| 是否未写 storage schema、lock、TTL、retry number、config key、test schema 或 implementation code | pass |
| 是否未修改正式 `03-详细设计.md` | pass |
| 是否形成 R13.11 进入门禁 | pass |

next_allowed_action: 等待用户确认后进入 Step 13 `R13.11 Job / checkpoint resume:先思考`;只允许思考 Operations Job idempotency、checkpoint resume、stored report replay、partial retry、manual consistency、checkpoint/cursor/version/lease 分离和 `R13.12` 写入边界;不得直接修改正式 `03-详细设计.md`;不得写 retry / lock / lease boundary 完整表;不得写 storage schema、retry number、TTL、lock table、scheduler lease、config key、observability schema、test case schema 或 implementation code。

---

## R13.11 Job / checkpoint resume:先思考

### 1. 当前模块目标

`R13.11` 只思考 Operations Job 的 idempotency、checkpoint resume、stored report replay、partial retry、manual consistency 和 checkpoint/cursor/version/lease 分离,为 `R13.12` 写入可审计 Job 表做准备。当前模块不写最终 Job 矩阵,不进入 retry / lock / lease boundary 完整表,不定义 storage schema、retry number、TTL、scheduler lease、config key、observability schema、test case schema 或 implementation code。

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm |
| 当前允许 | 思考 8 个 Operations Job 的 idempotency、stored report replay、checkpoint resume、partial retry、manual consistency、checkpoint/cursor/version/lease 分离和 `R13.12` 写入计划。 |
| 当前禁止 | 修改正式 `03-详细设计.md`;写 R13.12 最终矩阵;写 retry / lock / lease boundary 完整表;写 storage schema、retry number、TTL、lock table、scheduler lease、config key、observability schema、test case schema 或 implementation code。 |

### 2. Job 输入依据思考

| 输入 | R13.11 使用方式 | 不得外推 |
|---|---|---|
| Step 9 Operations Job overlay | 8 个 Job 均有 validate -> reserve -> load task/checkpoint -> plan targets -> read committed truth/material -> write derived material/progress/checkpoint/report 的 flow。 | 不补 Step 9 未定义的 Job、target planner、derived material builder 或 report schema。 |
| Step 11 transaction boundary | Job item/page UoW 覆盖 derived writes、progress、checkpoint、run history、job report shell;rollback reverts item/page unit。 | 不写物理 DB transaction、lock mode、lease、retry count 或 scheduler ownership。 |
| Step 11 separation table | checkpoint / cursor 是 job resume anchor/page progress marker,不能替代 optimistic version。 | 不把 checkpoint 当 truth version、page cursor、idempotency key、lease token 或 queue offset。 |
| Step 12 Job recovery | duplicate report replay no-rerun;checkpoint missing/wrong/corrupt -> manual/consistency;partial item failure uses safe issue/progress/report marker。 | 不从 current truth 重建 stored report,不从 raw log/metrics body 合成 issue。 |
| Step 12 side-effect rules | job completed/partial may write derived material、progress、checkpoint、run history、report shell、safe issue、event candidate hint;must not repair core truth。 | 不把 recovery convergence 写成自动 truth repair。 |

### 3. Job family idempotency 思考

Operations Job 的幂等目标不是“重复执行 job body 后得到相同结果”,而是“同一 job request / semantic digest 在已完成时 replay stored report,未完成时从 formal checkpoint resume,缺失时进入 manual consistency”。

| Job family | idempotency material thought | no-rerun / no-repair boundary |
|---|---|---|
| `RefreshCatalogAndDefinitionReadMaterialsFlow` | task kind,scope,target plan identity,definition/catalog source version refs and checkpoint anchor form semantic material。 | duplicate completed returns stored report;resume reads checkpoint and committed truth,not old report body。 |
| `RefreshFormalVersionReadMaterialsFlow` | formal version target refs,basis summary refs,planner output and checkpoint anchor define job request digest。 | missing basis is partial/degraded issue,not formalization rerun。 |
| `RefreshConsumptionReadMaterialsFlow` | consumption material target refs,availability marker refs and checkpoint anchor define retry/resume scope。 | boundary unavailable stays partial/unavailable marker;no boundary re-decision。 |
| `RefreshRelationDistributionMaterialsFlow` | relation/distribution target refs,distribution builder input refs and checkpoint anchor define semantic material。 | builder unavailable is degraded issue;no graph truth repair。 |
| `RefreshExternalSummaryReadMaterialsFlow` | external summary refs,body-free availability refs and checkpoint anchor define semantic material。 | no external body fetch or provider payload reprocessing。 |
| `RefreshTraceAuditImpactMaterialsFlow` | trace/audit/impact subjects,lineage refs and checkpoint anchor define semantic material。 | no raw log/evidence body;missing lineage becomes partial issue。 |
| `RunConsistencyRecoveryConvergenceFlow` | recovery task ref,affected refs,impact/protection refs and checkpoint anchor define semantic material。 | formal intervention issue only;no automatic core truth repair。 |
| `RefreshPeripheralReadMaterialsFlow` | package/assembly target refs,discovery builder input refs,marketplace context marker and checkpoint anchor define semantic material。 | marketplace unavailable is marker;no marketplace transaction/body。 |

### 4. duplicate / stored report replay 思考

| scenario | R13.11 thought | must not do |
|---|---|---|
| duplicate same job key + same digest,completed | return stored job report/result/run summary;no target scan,planner call or derived material write。 | rerun job body,refresh material again,append new success audit/event。 |
| duplicate same key + different digest | safe conflict / rejected job request if formal shell supports it。 | overwrite report,merge target scopes,or treat changed digest as resume。 |
| completed report missing / unreadable | consistency/manual surface;do not rerun job to recreate report。 | rebuild report from current derived material,raw logs or metrics body。 |
| stored report wrong kind / wrong scope | consistency/manual surface。 | coerce report kind,copy from sibling job or use private map。 |
| duplicate partial report | replay partial report with safe issues if formal report is completed as partial。 | silently upgrade partial to success or rerun failed items without resume boundary。 |

### 5. checkpoint resume 思考

| resume input | allowed role | forbidden substitution |
|---|---|---|
| checkpoint ref / checkpoint marker | resume anchor for next target/page/item after prior committed job unit。 | optimistic version,query page cursor,lease token,queue offset,retry counter。 |
| run history | tells which run/checkpoint/report relation is durable if Step 11/12 formal source exists。 | public report body,raw worker log,metrics stream。 |
| progress view | safe progress surface and partial issue reference carrier。 | authority to mutate core truth or skip marker validation。 |
| target planner output | formal target list for current run/resume unit。 | scanning all repositories privately or using stale old target list without formal source。 |
| committed truth/material read | source for derived material rebuild only within job scope。 | source for core truth repair or report reconstruction outside checkpoint rule。 |

### 6. partial retry / item failure 思考

| partial branch | R13.11 thought | R13.12 handling direction |
|---|---|---|
| target item missing | record safe partial issue if item was in formal plan;do not silently skip。 | write item missing / partial issue row。 |
| marker/source unavailable | partial/unavailable if availability marker exists;otherwise blocker/manual。 | write marker copy-only / missing source row。 |
| derived material save failure | rollback item/page UoW;record failed item/progress only if formal issue source exists。 | write item/page UoW rollback row。 |
| checkpoint save failure | resume state uncertain;manual/consistency,not completed success。 | write checkpoint persistence failure row。 |
| report save failure | duplicate replay unsafe;manual/consistency。 | write report persistence failure row。 |
| event candidate hint failure after report | no rollback of completed/partial report;candidate failure remains side-effect layer。 | write post-report side-effect row or handoff to R13.10/R13.15。 |

### 7. checkpoint / cursor / version / lease 分离思考

| concept | owner in Job context | separation rule |
|---|---|---|
| checkpoint | Operations Job resume owner;points to task/run/target progress。 | not optimistic version,not Query page cursor,not scheduler lease,not retry count。 |
| page cursor | Query/list helper continuation;may appear in read APIs but not as job resume truth。 | cannot resume job item writes or prove prior derived write completion。 |
| optimistic version | mutable truth/material save concurrency guard。 | cannot be used as job checkpoint or duplicate key。 |
| lease | runtime/scheduler execution ownership if later Step 13/14 defines boundary。 | R13.11 cannot define lease algorithm or use lease as checkpoint。 |
| retry count / TTL | runtime policy deferred to R13.13/R13.14 or config Step 14。 | cannot decide public recovery,manual consistency or stored replay validity。 |

### 8. manual consistency / blocker 思考

| issue | current R13.11裁决 | R13.12 treatment |
|---|---|---|
| stored report missing after completed duplicate | manual consistency;no rerun。 | write stored report missing row。 |
| checkpoint missing/wrong/corrupt | resume blocked/manual;do not start from scratch unless formal new job request。 | write checkpoint blocked row。 |
| run history missing | cannot prove report/checkpoint relation;manual if needed for replay。 | write run history missing row。 |
| formal issue marker missing | design blocker;implementation cannot synthesize partial issue。 | write marker/source missing blocker row。 |
| target planner source missing | design blocker or job rejected;no private repository scan。 | write target planner missing row。 |
| body-free violation in report/progress | reject/block/manual according to body-free helper;raw report/log/evidence body excluded。 | write body-free redline row。 |

### 9. watch / blocker 思考

| ID | 主题 | 当前判断 | R13.12 处理 |
|---|---|---|---|
| ML-D03-S13-JOB-WATCH-001 | stored report replay | completed duplicate must replay stored report/result and not rerun job body。 | 写 duplicate / stored report replay table。 |
| ML-D03-S13-JOB-WATCH-002 | checkpoint resume | resume only from formal checkpoint/run/progress source。 | 写 checkpoint resume table。 |
| ML-D03-S13-JOB-WATCH-003 | partial retry | partial item failures need safe issue/progress/report marker。 | 写 partial item / item UoW table。 |
| ML-D03-S13-JOB-WATCH-004 | no core truth repair | jobs only write derived material/progress/checkpoint/report/run history。 | 写 no-repair / forbidden mutation row。 |
| ML-D03-S13-JOB-WATCH-005 | checkpoint/cursor/version/lease separation | checkpoint cannot be cursor/version/lease/retry count。 | 写 separation table。 |
| ML-D03-S13-JOB-WATCH-006 | missing stored surface | missing report/checkpoint/run history blocks replay/resume and becomes manual/consistency。 | 写 manual consistency table。 |
| ML-D03-S13-JOB-BLOCK-001 | hard blocker | none at R13.11。 | R13.12 若发现 report/checkpoint/issue marker formal source缺口,新增 blocker 并暂停。 |

### 10. R13.12 写入计划思考

`R13.12` 应把本模块思考写成 Job-focused 可审计表,但仍不得进入 retry / lock / lease boundary 完整表。

1. 写 Operations Job scope / non-scope。
2. 写 8 个 Job family idempotency material table。
3. 写 duplicate / stored report replay table。
4. 写 checkpoint resume table。
5. 写 partial retry / item failure / item-page UoW table。
6. 写 checkpoint / cursor / version / lease separation table。
7. 写 no core truth repair / body-free report redline table。
8. 写 manual consistency / missing source blocker table。
9. 写 watch / blocker closure 和 `R13.13 retry / lock / lease boundary:先思考` 进入门禁。

### 11. R13.11 stop-review

| 检查项 | 结果 |
|---|---|
| 是否只思考 Job / checkpoint resume | pass |
| 是否覆盖 8 个 Operations Job family | pass |
| 是否覆盖 duplicate stored report replay | pass |
| 是否覆盖 checkpoint resume 与 missing checkpoint/manual consistency | pass |
| 是否覆盖 partial retry / item failure | pass |
| 是否覆盖 checkpoint/cursor/version/lease 分离 | pass |
| 是否未写 R13.12 最终矩阵 | pass |
| 是否未写 retry / lock / lease boundary 完整表 | pass |
| 是否未写 storage schema、lock、TTL、retry number、config key、test schema 或 implementation code | pass |
| 是否未修改正式 `03-详细设计.md` | pass |
| 是否形成 R13.12 写入计划 | pass |

next_allowed_action: 等待用户确认后进入 Step 13 `R13.12 Job / checkpoint resume:再写入`;只允许写入 Operations Job scope、8 个 Job family idempotency material、duplicate / stored report replay、checkpoint resume、partial retry / item failure、checkpoint/cursor/version/lease 分离、no core truth repair / body-free report redline、manual consistency / missing source blocker、watch/blocker 和 `R13.13` 进入门禁;不得直接修改正式 `03-详细设计.md`;不得写 retry / lock / lease boundary 完整表;不得写 storage schema、retry number、TTL、lock table、scheduler lease、config key、observability schema、test case schema 或 implementation code。

---

## R13.12 Job / checkpoint resume:再写入

### 1. 当前模块目标

`R13.12` 将 `R13.11` 的 Job / checkpoint resume 思考落成可审计表格。当前模块覆盖 8 个 Operations Job 的幂等材料、stored report replay、checkpoint resume、partial retry / item failure、checkpoint/cursor/version/lease 分离、no core truth repair、body-free report redline、manual consistency 和 missing source blocker;不进入 retry / lock / lease boundary 完整表。

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm |
| 当前允许 | 写入 Operations Job scope、8 个 Job family idempotency material、duplicate / stored report replay、checkpoint resume、partial retry / item failure、checkpoint/cursor/version/lease 分离、no core truth repair / body-free report redline、manual consistency / missing source blocker、watch/blocker 和 `R13.13` 进入门禁。 |
| 当前禁止 | 修改正式 `03-详细设计.md`;写 retry / lock / lease boundary 完整表;写 storage schema、retry number、TTL、lock table、scheduler lease、config key、observability schema、test case schema 或 implementation code。 |

### 2. Operations Job scope / non-scope

| 范围项 | R13.12 正式口径 |
|---|---|
| 覆盖入口 | Step 9 `R9.40` 的 8 个 Operations Job flow。 |
| 覆盖行为 | validate job shell、reserve job idempotency、load task/checkpoint、plan targets、read committed truth/material、write derived material/progress/checkpoint/run history/stored report。 |
| replay 目标 | duplicate completed job 只能 replay stored report/result/run summary,不得重跑 job body。 |
| resume 目标 | 未完成 job 只能从 formal checkpoint/run/progress source resume,不得用 cursor/version/lease/queue offset 替代。 |
| partial 目标 | target/item failure 必须以 safe issue/progress/report marker 表达,不得静默成功或隐藏 failed item。 |
| no-repair 目标 | Job 可刷新 derived read/trace/peripheral material、progress、checkpoint、report,不得 create/update/delete/repair core business truth。 |
| 非范围 | physical storage schema、retry number、TTL、lock table、scheduler lease、config binding、observability schema、test case schema、implementation code。 |

### 3. 8 个 Job family idempotency material table

| Job family | semantic material source | duplicate completed behavior | resume / partial boundary | forbidden |
|---|---|---|---|---|
| `RefreshCatalogAndDefinitionReadMaterialsFlow` | task kind,scope,target plan identity,definition/catalog source version refs,checkpoint anchor。 | replay stored report/result;no target scan。 | resume from checkpoint and committed definition/catalog truth。 | mutate definition/catalog truth or rebuild report from current views。 |
| `RefreshFormalVersionReadMaterialsFlow` | formal version target refs,basis summary refs,planner output,checkpoint anchor。 | replay stored report。 | missing basis becomes partial/degraded issue。 | rerun formalization or infer basis from old snapshot/fingerprint。 |
| `RefreshConsumptionReadMaterialsFlow` | consumption material target refs,availability marker refs,checkpoint anchor。 | replay stored report。 | unavailable boundary remains partial/unavailable marker。 | redo consumption boundary decision or create runtime downstream truth。 |
| `RefreshRelationDistributionMaterialsFlow` | relation/distribution target refs,distribution builder input refs,checkpoint anchor。 | replay stored report。 | builder unavailable becomes degraded issue。 | repair relation graph or publish marketplace transaction。 |
| `RefreshExternalSummaryReadMaterialsFlow` | external summary refs,body-free availability refs,checkpoint anchor。 | replay stored report。 | adapter unavailable becomes partial/unavailable issue if marker exists。 | fetch external body/provider payload or store archive body。 |
| `RefreshTraceAuditImpactMaterialsFlow` | trace/audit/impact subjects,lineage refs,checkpoint anchor。 | replay stored report。 | missing lineage becomes partial issue。 | read raw log/evidence body or repair audit truth。 |
| `RunConsistencyRecoveryConvergenceFlow` | recovery task ref,affected refs,impact/protection refs,checkpoint anchor。 | replay stored report。 | formal intervention required becomes issue/manual surface。 | automatically repair core truth or run repair script。 |
| `RefreshPeripheralReadMaterialsFlow` | package/assembly target refs,discovery builder input refs,marketplace context marker,checkpoint anchor。 | replay stored report。 | marketplace unavailable becomes marker issue。 | store marketplace transaction/listing body or UI/SDK config。 |

### 4. duplicate / stored report replay table

| scenario | required behavior | replay source | forbidden |
|---|---|---|---|
| duplicate same job key + same digest and completed | return stored job report/result/run summary。 | stored job report shell,run history and report identity from Step 8/11。 | target scan,planner call,derived material write,new success event/audit。 |
| duplicate same job key + different digest | safe conflict / rejected job request if formal shell supports it。 | job idempotency guard and request digest source。 | overwrite existing report,merge scope,or treat changed digest as resume。 |
| duplicate partial completed report | replay partial report with safe issue/progress markers。 | stored partial report and issue refs。 | silently upgrade partial to success or rerun failed items outside checkpoint boundary。 |
| stored report missing / unreadable | consistency/manual surface;no rerun。 | stored report lookup and Step 12 duplicate replay surface issue。 | rebuild report from current material,run logs,metrics body or old evidence。 |
| stored report wrong kind / wrong scope | consistency/manual surface。 | report kind/scope validation。 | coerce report kind,copy sibling report,or rely on private map。 |
| stored run history missing when required | replay blocked/manual if report-run relation cannot be proven。 | run history shell。 | guess run from timestamp,worker id,queue offset or scheduler trace。 |

### 5. checkpoint resume table

| resume branch | required behavior | formal source | forbidden |
|---|---|---|---|
| checkpoint present and valid | resume from checkpoint anchor;load formal task/run/progress;plan next targets;read committed truth/material;write next item/page unit。 | checkpoint store,run history,task repo,target planner。 | start from scratch,skip target planner,or resume from queue offset。 |
| checkpoint missing for in-progress run | resume blocked/manual unless formal new job request is created。 | missing checkpoint diagnostic and run state。 | recompute checkpoint from current material or page cursor。 |
| checkpoint wrong kind / wrong scope | manual/consistency;do not resume。 | checkpoint kind/scope validation。 | coerce checkpoint or reuse another task family checkpoint。 |
| checkpoint corrupt / unreadable | manual/consistency;do not run job body。 | checkpoint read/deserialize safe diagnostic if formal。 | parse raw bytes,operator note,stack trace or log to continue。 |
| checkpoint save failure after item/page | rollback item/page UoW if inside same unit;otherwise manual consistency according to boundary。 | item/page UoW result and checkpoint store outcome。 | mark job completed or treat progress as checkpoint。 |
| resume reaches no remaining targets | complete only if planner/checkpoint relation proves all targets handled。 | target planner plus checkpoint/progress relation。 | infer completion from empty repository scan or elapsed time。 |

### 6. partial retry / item failure / item-page UoW table

| branch | required behavior | issue/progress source | forbidden |
|---|---|---|---|
| target item missing from formal plan | record partial issue if formal issue marker exists;continue/stop according to job family safe rule。 | target planner output and recovery issue/progress/report shell。 | silently skip item or report full success。 |
| marker/source unavailable | record partial/unavailable issue only with copied marker。 | availability resolver,adapter summary,builder output。 | synthesize marker from exception/HTTP/SQL code。 |
| derived material builder unavailable | item/page failure or partial issue;no core truth mutation。 | builder unavailable marker / safe diagnostic。 | repair source truth or store raw builder input body。 |
| derived material save failure | rollback item/page UoW and record safe issue only if formal post-failure source exists。 | repository/UoW failure source and recovery issue shell。 | leave partial derived write while claiming checkpoint advanced。 |
| checkpoint/progress save failure | item/page completion cannot be claimed if checkpoint/progress is required in same unit。 | checkpoint/progress store result。 | advance report without checkpoint or use retry count as progress。 |
| report save failure | duplicate replay unsafe;manual/consistency。 | report store save result。 | claim completed job or reconstruct report later from material。 |
| event candidate hint failure after report | no rollback of stored report/progress/checkpoint;side-effect issue belongs to candidate/publication layer。 | candidate assembly safe outcome if formal。 | delete completed report or rerun job body to recreate candidate。 |

### 7. checkpoint / cursor / version / lease separation table

| concept | allowed use | cannot replace | R13.12 rule |
|---|---|---|---|
| checkpoint | Job resume anchor for task/run/target progress。 | optimistic version,Query page cursor,scheduler lease,retry count,queue offset。 | resume requires formal checkpoint/run/progress source。 |
| Query page cursor | list/query continuation only。 | job checkpoint,truth version,run history。 | cannot prove job item/page completion。 |
| optimistic version | mutable truth/material save concurrency guard。 | checkpoint,duplicate key,lease token。 | version conflict affects save;it does not resume job。 |
| run history | durable relation between run,checkpoint,progress and report when formal。 | report body,metrics stream,worker log。 | missing run history may block replay/resume。 |
| scheduler lease | runtime execution ownership if later defined。 | checkpoint,job completion,stored report validity。 | R13.12 does not define lease algorithm。 |
| retry count / TTL | runtime/config policy deferred later。 | public recovery class,manual consistency,stored replay validity。 | retry number never decides whether report/checkpoint is valid。 |

### 8. no core truth repair / body-free report redline table

| area | allowed Job write | forbidden write / source |
|---|---|---|
| derived read material | refresh/rebuild derived material from committed truth/material refs within job scope。 | create/update/delete/repair core definition/catalog/version/relation/package truth。 |
| progress / checkpoint | save body-free progress/checkpoint/run history refs。 | queue offset,lease token,retry count,worker local state as checkpoint。 |
| job report | save stored report shell with refs,summary,marker,safe issue refs。 | raw report body,metrics body,raw log,evidence body,provider payload。 |
| recovery issue | save safe issue/intervention refs when formal source exists。 | operator note,stack trace,raw exception,private map as public issue。 |
| event candidate hint | body-free candidate hint after report if formal。 | rollback report if publication/candidate fails,or publish raw report payload。 |
| external/peripheral source | body-free summary/marker only。 | external body,archive package,marketplace transaction/listing body。 |

### 9. manual consistency / missing source blocker table

| issue | required classification | no-rerun rule | owner / next |
|---|---|---|---|
| completed report missing | manual consistency / stored replay failure。 | do not rerun job body to recreate report。 | Step 15/16 may observe/test;implementation must pause if no surface。 |
| checkpoint missing/wrong/corrupt | resume blocked/manual consistency。 | do not start from scratch under same run unless formal new request。 | R13.13 may discuss retry boundary,not schema invention。 |
| run history missing | manual if run/report/checkpoint relation required。 | do not infer from clock,worker id or queue offset。 | Step 15 observability may report safe issue。 |
| target planner source missing | design blocker or rejected job request。 | do not private-scan repositories to produce target list。 | owning Step 7/9/11 source must close。 |
| partial issue marker missing | design blocker;cannot report partial safely。 | do not synthesize issue marker from exception text。 | owning Step 6/7/12 marker source must close。 |
| body-free report redline violation | rejected/blocked/manual according to formal body-free helper。 | do not persist raw body to diagnose。 | Step 16 redline tests later。 |

### 10. Job watch / blocker closure

| ID | 主题 | R13.12 结果 | 后续 |
|---|---|---|---|
| ML-D03-S13-JOB-WATCH-001 | stored report replay | closed_semantic;completed duplicate replays stored report/result and does not rerun job body。 | Step 16 later verifies no rerun。 |
| ML-D03-S13-JOB-WATCH-002 | checkpoint resume | closed_semantic;resume requires formal checkpoint/run/progress source。 | R13.13/R13.14 later discuss retry/lease boundary without changing checkpoint owner。 |
| ML-D03-S13-JOB-WATCH-003 | partial retry | closed_semantic;partial item failure requires safe issue/progress/report marker。 | Step 15/16 later observe/test partial reporting。 |
| ML-D03-S13-JOB-WATCH-004 | no core truth repair | closed;Job writes derived material/progress/checkpoint/report/run history only。 | Step 16 later tests no-truth-repair。 |
| ML-D03-S13-JOB-WATCH-005 | checkpoint/cursor/version/lease separation | closed;separation table forbids substitution。 | R13.13 must not convert lease into checkpoint。 |
| ML-D03-S13-JOB-WATCH-006 | missing stored surface | closed_semantic;missing report/checkpoint/run history blocks replay/resume and becomes manual/consistency。 | Implementation/design closure must pause if formal surface missing。 |
| ML-D03-S13-JOB-BLOCK-001 | hard blocker | none at R13.12。 | Later missing report/checkpoint/issue marker source becomes blocker,not implementation fallback。 |

### 11. R13.13 进入门禁

进入 `R13.13 retry / lock / lease boundary:先思考` 前必须满足:

- `R13.11` 和 `R13.12` 均为 completed_wait_user_confirm。
- 当前文件已写入 Operations Job scope、8 个 Job family idempotency material、duplicate / stored report replay、checkpoint resume、partial retry / item failure、checkpoint/cursor/version/lease 分离、no core truth repair / body-free report redline、manual consistency / missing source blocker、watch/blocker 表。
- 正式 `03-详细设计.md` 未被修改。
- `R13.13` 只允许思考 retry / lock / lease 的边界、allowed source、禁止来源、与 Step 14 config 的分界和 `R13.14` 写入计划。
- `R13.13` 不得定义具体 retry number、TTL、physical lock table、scheduler implementation、config key、observability schema、test case schema 或 implementation code。

### 12. R13.12 stop-review

| 检查项 | 结果 |
|---|---|
| 是否写入 Operations Job scope / non-scope | pass |
| 是否写入 8 个 Job family idempotency material table | pass |
| 是否写入 duplicate / stored report replay table | pass |
| 是否写入 checkpoint resume table | pass |
| 是否写入 partial retry / item failure / item-page UoW table | pass |
| 是否写入 checkpoint/cursor/version/lease separation table | pass |
| 是否写入 no core truth repair / body-free report redline table | pass |
| 是否写入 manual consistency / missing source blocker table | pass |
| 是否未写 retry / lock / lease boundary 完整表 | pass |
| 是否未写 storage schema、lock、TTL、retry number、config key、test schema 或 implementation code | pass |
| 是否未修改正式 `03-详细设计.md` | pass |
| 是否形成 R13.13 进入门禁 | pass |

next_allowed_action: 等待用户确认后进入 Step 13 `R13.13 retry / lock / lease boundary:先思考`;只允许思考 retry / lock / lease 的边界、allowed source、forbidden source、operation family 适用性、与 Step 14 config 的分界和 `R13.14` 写入计划;不得直接修改正式 `03-详细设计.md`;不得定义具体 retry number、TTL、physical lock table、scheduler implementation、config key、observability schema、test case schema 或 implementation code。

---

## R13.13 retry / lock / lease boundary:先思考

### 1. 当前模块目标

`R13.13` 只思考 retry / lock / lease 的语义边界、allowed source、forbidden source、operation family 适用性、与 Step 14 config 的分界和 `R13.14` 写入计划。当前模块不写最终表,不定义具体 retry number、TTL、physical lock table、scheduler implementation、config key、observability schema、test case schema 或 implementation code。

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm |
| 当前允许 | 思考 retry / lock / lease 的 boundary、allowed source、forbidden source、operation family applicability、Step 14 config 分界、watch/blocker 和 `R13.14` 写入计划。 |
| 当前禁止 | 修改正式 `03-详细设计.md`;写 R13.14 最终表;定义 retry number、TTL、lock table、scheduler lease algorithm、config key、metric/log/test schema 或 implementation code。 |

### 2. retry boundary 思考

Retry 在 Step 13 只能表达“什么时候允许再次进入正式 flow”,不能表达具体次数、间隔、退避策略或 scheduler 实现。retryability 必须来自 Step 12 的 safe classification 和 Step 7/8/9/11 的正式 source。

| retry source | R13.13 thought | must not do |
|---|---|---|
| version conflict / stale expected_version | allowed only as retry-after-reload;must reload formal mutable truth and use expected_version semantics。 | blind retry without reload,or convert checkpoint/cursor to expected_version。 |
| dependency unavailable | retryable only when formal resolver/adapter/publisher/handoff/runtime outcome marks temporary/unavailable。 | infer retryability from raw exception,HTTP/SQL code,endpoint or config value。 |
| duplicate same digest with completed surface | no retry;replay stored result/receipt/report/outcome。 | rerun command/inbound/job body under the name of retry。 |
| missing stored replay surface | manual/consistency;no retry。 | rerun mutation to recreate result/report/receipt。 |
| commit unknown | retry must be gated by idempotency/read-back/formal stored surface resolution。 | retry mutation blindly or claim accepted from log/timeout。 |
| job partial item failure | retry only failed subset if formal checkpoint/progress/issue source permits。 | rerun full job or skip failed item without marker。 |

### 3. lock boundary 思考

Lock 在本 Step 只表达“single writer / in-flight guard / expected-version atomicity”的语义边界,不表达物理锁表、数据库 isolation、row lock 语法或 TTL。

| lock-like boundary | R13.13 thought | forbidden expansion |
|---|---|---|
| idempotency reservation | protects same operation key from two writers during reserve/complete。 | physical lock table schema,TTL,expiry algorithm。 |
| expected_version save | protects mutable truth from lost update。 | using checkpoint/cursor/lease as version。 |
| append identity | prevents duplicate append identity from becoming two indistinguishable side effects。 | mutating append-only record into current truth。 |
| publication outcome guard | prevents duplicate publication outcome claim for same candidate/target identity。 | claiming subscriber delivery truth or storing transport ack。 |
| job run/checkpoint guard | prevents two job workers from advancing same checkpoint/report without formal run boundary。 | scheduler lease implementation or queue locking details。 |
| runtime entry guard | entry must call application facade;runtime-local state is not lock owner for truth。 | entry-owned repository/UoW or concrete adapter lock。 |

### 4. lease boundary 思考

Lease 是 runtime/scheduler ownership concept,not business truth,not checkpoint,not stored replay proof。Step 13 可以定义 lease 的禁止混用和 handoff,但具体 lease duration/renewal/config belongs to Step 14 or implementation plan later。

| lease-related concept | allowed in R13.13 | forbidden |
|---|---|---|
| worker execution ownership | may be named as runtime guard around Job/Publisher/Handoff execution if formal runtime source exists。 | define renewal algorithm,lease TTL,heartbeat table or scheduler protocol。 |
| job checkpoint | remains resume/progress truth for Job。 | treat lease as checkpoint or completed proof。 |
| idempotency key | remains operation semantic duplicate key。 | use lease token as idempotency key。 |
| retry decision | uses safe outcome/recovery classification。 | use lease expiry alone to decide public retryability。 |
| config source | deferred to Step 14。 | invent config key or default duration in Step 13。 |

### 5. operation family applicability 思考

| family | retry boundary thought | lock / lease boundary thought |
|---|---|---|
| Command | retry after reload for version conflict;duplicate replay for same digest;manual for commit unknown / missing stored result。 | idempotency reservation + expected_version,not physical lock schema。 |
| Query | no retry state and no idempotency store;caller can repeat read,each call reads current safe surface。 | no lock/lease;query cannot repair or write。 |
| Inbound | redelivery uses source dedup and stored receipt replay;unavailable source retry only from formal marker。 | inbound dedup guard,not broker offset/ack lock。 |
| Outbound | retry publication from durable candidate and target/publisher marker。 | outcome guard around candidate/target,not subscriber delivery lock。 |
| Handoff | retry from handoff-safe refs and local outcome marker。 | local outcome guard,not external receipt truth。 |
| Operations Job | duplicate completed uses stored report;resume uses checkpoint;partial retry requires formal issue/progress marker。 | job run/checkpoint guard;lease remains runtime-only,not checkpoint。 |
| Runtime / entry | blocked/unavailable precheck can be retried by caller/runtime if formal marker says temporary。 | entry owns no business lock or UoW。 |

### 6. allowed / forbidden source 思考

| source class | allowed use | forbidden use |
|---|---|---|
| formal idempotency guard | reserve/complete/replay decision for Command/Inbound/Job where defined。 | physical lock details,TTL,expiration policy。 |
| stored result/receipt/report/outcome | duplicate replay and no-rerun proof。 | reconstructing missing surfaces or public DTO body persistence。 |
| versioned repository read/save | optimistic concurrency and retry-after-reload source。 | page cursor/checkpoint/lease substitute。 |
| checkpoint/progress/run history | Job resume and partial retry source。 | Query cursor,truth version,lease/retry counter。 |
| availability / publisher / handoff outcome | retryable/unavailable/blocked classification source。 | raw adapter exception or transport code classification。 |
| runtime binding summary | safe blocked/unavailable precheck source。 | config key/default/secret/topic definition。 |
| scheduler lease/token | runtime execution ownership only if later formalized。 | business truth,checkpoint,stored report proof,idempotency key。 |

### 7. Step 14 config 分界思考

| concern | Step 13 boundary | Step 14 or later |
|---|---|---|
| retry count / attempts | only says whether retry is semantically allowed。 | numeric attempts,backoff,deadline,policy key。 |
| TTL / expiry | only forbids using expiry to synthesize truth/replay validity。 | actual TTL value/config binding。 |
| lock implementation | only states semantic guard owner and no-substitution rule。 | physical lock table,DB isolation,scheduler/product mechanics。 |
| lease renewal | only states lease is runtime ownership,not checkpoint/truth。 | renewal interval,heartbeat,binding key。 |
| target registry binding | only says marker/outcome must be formal source。 | target registry config,topic/URL/secret/adapter binding。 |
| observability of retry | only says no raw error/source synthesis。 | metric/log/span/evidence schema in Step 15。 |

### 8. watch / blocker 思考

| ID | 主题 | 当前判断 | R13.14 处理 |
|---|---|---|---|
| ML-D03-S13-RLL-WATCH-001 | retry source | retryability must come from formal safe outcome/classification。 | 写 retry source table。 |
| ML-D03-S13-RLL-WATCH-002 | lock semantic only | lock boundary is semantic guard,not physical schema。 | 写 lock boundary table。 |
| ML-D03-S13-RLL-WATCH-003 | lease runtime-only | lease cannot become checkpoint/version/idempotency proof。 | 写 lease separation table。 |
| ML-D03-S13-RLL-WATCH-004 | operation family applicability | Command/Query/Inbound/Outbound/Handoff/Job/Runtime each has different retry/guard boundary。 | 写 family applicability table。 |
| ML-D03-S13-RLL-WATCH-005 | config separation | retry number/TTL/lease duration/config key deferred to Step 14。 | 写 Step 14 handoff row。 |
| ML-D03-S13-RLL-BLOCK-001 | hard blocker | none at R13.13。 | R13.14 若发现 required formal retry/guard source missing,record blocker rather than inventing implementation fallback。 |

### 9. R13.14 写入计划思考

`R13.14` 应把本模块思考写成 retry / lock / lease boundary 表,但仍不得定义具体数值、物理 schema 或 scheduler implementation。

1. 写 retry / lock / lease scope / non-scope。
2. 写 retry allowed source / forbidden source table。
3. 写 lock semantic guard table。
4. 写 lease separation / runtime-only table。
5. 写 operation family applicability table。
6. 写 Step 14 config handoff table。
7. 写 missing source / blocker table。
8. 写 watch / blocker closure 和 `R13.15 cross-step closure audit 与正式 §12 候选草稿停审:先思考` 进入门禁。

### 10. R13.13 stop-review

| 检查项 | 结果 |
|---|---|
| 是否只思考 retry / lock / lease boundary | pass |
| 是否覆盖 retry allowed source / forbidden source | pass |
| 是否覆盖 lock semantic guard | pass |
| 是否覆盖 lease runtime-only separation | pass |
| 是否覆盖 operation family applicability | pass |
| 是否明确 Step 14 config 分界 | pass |
| 是否未写 R13.14 最终表 | pass |
| 是否未定义具体 retry number、TTL、physical lock table、scheduler implementation、config key | pass |
| 是否未写 observability/test schema 或 implementation code | pass |
| 是否未修改正式 `03-详细设计.md` | pass |
| 是否形成 R13.14 写入计划 | pass |

next_allowed_action: 等待用户确认后进入 Step 13 `R13.14 retry / lock / lease boundary:再写入`;只允许写入 retry / lock / lease scope、retry allowed/forbidden source、lock semantic guard、lease runtime-only separation、operation family applicability、Step 14 config handoff、missing source/blocker、watch/blocker 和 `R13.15` 进入门禁;不得直接修改正式 `03-详细设计.md`;不得定义具体 retry number、TTL、physical lock table、scheduler implementation、config key、observability schema、test case schema 或 implementation code。

---

## R13.14 retry / lock / lease boundary:再写入

### 1. 当前模块目标

`R13.14` 将 `R13.13` 的 retry / lock / lease boundary 思考落成可审计表格。当前模块只写语义边界、allowed/forbidden source、operation family 适用性、Step 14 config handoff、missing source/blocker 和 R13.15 进入门禁;不定义具体 retry number、TTL、physical lock table、scheduler implementation、config key、observability schema、test case schema 或 implementation code。

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm |
| 当前允许 | 写入 retry / lock / lease scope、retry allowed/forbidden source、lock semantic guard、lease runtime-only separation、operation family applicability、Step 14 config handoff、missing source/blocker、watch/blocker 和 `R13.15` 进入门禁。 |
| 当前禁止 | 修改正式 `03-详细设计.md`;定义 retry number、TTL、physical lock table、scheduler implementation、config key、observability schema、test case schema 或 implementation code。 |

### 2. retry / lock / lease scope / non-scope

| 范围项 | R13.14 正式口径 |
|---|---|
| retry scope | 只定义何时允许重新进入正式 flow,以及重试必须依赖的 formal source。 |
| lock scope | 只定义 semantic guard owner: idempotency reservation、expected_version、append identity、candidate/outcome identity、job checkpoint/run guard。 |
| lease scope | 只定义 lease 是 runtime execution ownership,不是 business truth、checkpoint、version、stored replay proof 或 idempotency key。 |
| source rule | retry/guard/lease 判断只能复制 Step 6~12 已正式定义的 source、marker、stored surface、version、checkpoint、runtime binding summary。 |
| non-scope | retry 次数、间隔、backoff、TTL、physical lock table、DB isolation、scheduler lease renewal、heartbeat、config key、metric/log/span/test/evidence schema。 |

### 3. retry allowed / forbidden source table

| retry scenario | allowed source | required behavior | forbidden source / behavior |
|---|---|---|---|
| version conflict | versioned repository save conflict and reloadable truth source。 | caller/service may retry only after formal reload and new expected_version。 | blind retry,checkpoint/cursor/lease as version。 |
| dependency unavailable | formal resolver/adapter/publisher/handoff/runtime outcome marks unavailable/temporary。 | retry may be allowed by caller/runtime policy later;surface remains safe unavailable/failed。 | raw exception,HTTP/SQL code,endpoint,secret,config value。 |
| duplicate same digest completed | stored result/receipt/report/outcome exists and matches kind。 | replay stored surface;no retry。 | rerun mutation/consumer/job/publisher under retry label。 |
| same key different digest | idempotency guard detects digest mismatch。 | conflict / rejected surface;no retry for same request material。 | overwrite stored result or merge semantic material。 |
| commit unknown | formal stored surface/read-back/reconciliation source needed。 | manual/consistency until source proves status;retry only through formal recovery path。 | infer commit from timeout,log line,worker note or current truth alone。 |
| partial job failed subset | checkpoint/progress/report/issue source identifies failed subset safely。 | retry only failed subset if formal job semantics permit。 | rerun full job,skip failed item,or use retry count as checkpoint。 |
| missing stored replay surface | stored surface lookup missing/wrong/unreadable。 | manual consistency;no retry。 | rerun body to recreate surface。 |

### 4. lock semantic guard table

| semantic guard | protected resource / invariant | formal source | forbidden expansion |
|---|---|---|---|
| idempotency reservation | one operation key/digest reserve/complete path at a time。 | `MethodAssetIdempotencyGuard` / stored operation result family。 | lock table schema,TTL,expiry policy。 |
| expected_version | mutable truth/support/material lost-update prevention。 | versioned repository read/save。 | checkpoint,cursor,lease,route param as version。 |
| append identity | append-only side effect identity uniqueness。 | append ref / candidate ref / run history/report identity。 | update append record into current truth。 |
| inbound dedup | source envelope semantic duplicate handling。 | inbound dedup/source binding summary and stored receipt。 | broker ack,topic,offset,dead-letter state。 |
| publication outcome guard | candidate/target outcome cannot be claimed inconsistently。 | candidate_ref,target_ref,publication outcome shell。 | subscriber ack/delivery receipt as local truth。 |
| handoff outcome guard | local handoff outcome identity and no external truth guarantee。 | handoff_ref,target/outcome marker。 | external receipt body or archive path as truth。 |
| job run/checkpoint guard | same run/checkpoint/report cannot be advanced by conflicting writers。 | task/run/checkpoint/progress/report shell。 | scheduler lease as checkpoint or report proof。 |
| runtime entry guard | entry remains facade-only and owns no business UoW。 | runtime binding summary/application facade contract。 | entry repository access or concrete adapter lock。 |

### 5. lease runtime-only separation table

| lease concept | allowed role | cannot replace | deferred to |
|---|---|---|---|
| worker execution ownership | runtime may use lease-like concept to avoid concurrent worker execution if later formalized。 | business truth,stored report,checkpoint,version,idempotency key。 | Step 14 config / implementation plan。 |
| lease expiry | may indicate runtime should re-attempt execution ownership after safe classification。 | proof that previous work rolled back or completed。 | Step 14 numeric policy。 |
| lease renewal | runtime management only。 | checkpoint advance,progress save,publication outcome save。 | Step 14 / implementation plan。 |
| scheduler lock | runtime orchestration guard only。 | repository UoW,expected_version,idempotency reserve。 | Step 14/07 implementation plan;not Step 13 schema。 |
| queue offset / ack | transport runtime detail only。 | inbound receipt,job checkpoint,publication outcome。 | Step 14 dependency binding if relevant。 |

### 6. operation family applicability table

| family | retry rule | guard rule | lease rule |
|---|---|---|---|
| Command | version conflict can retry after reload;duplicate same digest replays;commit unknown/manual blocks blind retry。 | idempotency reservation and expected_version protect mutation。 | no command business lease;runtime entry has facade-only precheck。 |
| Query | no stored retry state;repeat call re-reads current safe surface。 | no write lock;no idempotency guard。 | no lease。 |
| Inbound | redelivery replays stored receipt;unavailable source retry only if marker says temporary。 | inbound source dedup and receipt shell。 | broker/queue ownership is not receipt truth。 |
| Outbound | retry from durable candidate and formal target/publisher outcome。 | candidate/target publication outcome guard。 | publisher worker lease is runtime-only if later defined。 |
| Handoff | retry from handoff-safe refs and local outcome marker。 | handoff outcome guard。 | external system lock/receipt cannot become local truth。 |
| Operations Job | duplicate completed replays stored report;resume from checkpoint;partial retry only from safe issue/progress。 | job run/checkpoint/progress/report guard。 | scheduler lease does not replace checkpoint/report。 |
| Runtime / entry | blocked/unavailable can be re-entered only via formal runtime marker and application facade。 | entry cannot own repository/UoW lock。 | runtime lease/config deferred。 |

### 7. Step 14 config handoff table

| concern | closed in R13.14 | deferred to Step 14 / later |
|---|---|---|
| retry attempts/count | semantic retry allowed/forbidden source。 | numeric attempts,backoff,deadline,policy key。 |
| TTL / expiry | expiry cannot synthesize truth,stored replay,checkpoint or retryability。 | actual TTL value,expiration config,binding key。 |
| lock implementation | semantic guard owner and substitution redline。 | physical lock table,DB isolation,row lock syntax,product-specific lock。 |
| scheduler lease | runtime-only separation from checkpoint/version/replay。 | lease duration,renewal,heartbeat,scheduler binding。 |
| target/publisher/handoff binding | marker/outcome must be formal source。 | topic,URL,secret,adapter binding,target registry config。 |
| observability | safe source only;no raw error/source synthesis。 | metric/log/span/evidence schema in Step 15。 |
| tests | semantic rules and redlines only。 | concrete test case IDs and fixtures in Step 16。 |

### 8. missing source / blocker table

| missing item | R13.14 classification | forbidden workaround |
|---|---|---|
| no formal retryable marker for unavailable dependency | design blocker or manual/consistency;retry not allowed by implementation guess。 | raw exception/status-code retryability。 |
| no idempotency guard / stored surface for replayable operation | blocker for replay semantics。 | private map,rerun body,rebuild response。 |
| no version source for mutable truth save | blocker for concurrency-safe update。 | timestamp,route id,checkpoint,cursor as version。 |
| no checkpoint/progress/run source for Job resume | resume blocked/manual。 | queue offset,lease token,current material scan。 |
| no publication/handoff outcome guard | publication/handoff retry cannot claim safe idempotent outcome。 | subscriber ack,external receipt body,transport delivery status。 |
| no runtime binding summary for blocked/unavailable entry | runtime blocked/unavailable cannot be safely classified。 | config string,endpoint name,secret-bearing error。 |

### 9. watch / blocker closure

| ID | 主题 | R13.14 结果 | 后续 |
|---|---|---|---|
| ML-D03-S13-RLL-WATCH-001 | retry source | closed_semantic;retryability must come from formal safe outcome/classification。 | Step 14 binds numeric/runtime policy only。 |
| ML-D03-S13-RLL-WATCH-002 | lock semantic only | closed;lock table states semantic guard,not physical schema。 | Implementation plan may map to concrete mechanisms later。 |
| ML-D03-S13-RLL-WATCH-003 | lease runtime-only | closed;lease cannot become checkpoint/version/idempotency proof。 | Step 14/implementation plan may define runtime lease details。 |
| ML-D03-S13-RLL-WATCH-004 | operation family applicability | closed;family table distinguishes Command/Query/Inbound/Outbound/Handoff/Job/Runtime。 | Step 16 later tests selected redlines。 |
| ML-D03-S13-RLL-WATCH-005 | config separation | closed;numeric policy/config binding deferred。 | Step 14 owns config keys and values。 |
| ML-D03-S13-RLL-BLOCK-001 | hard blocker | none at R13.14。 | Missing formal retry/guard source later remains blocker,not implementation fallback。 |

### 10. R13.15 进入门禁

进入 `R13.15 cross-step closure audit 与正式 §12 候选草稿停审:先思考` 前必须满足:

- `R13.13` 和 `R13.14` 均为 completed_wait_user_confirm。
- 当前文件已写入 retry / lock / lease scope、retry allowed/forbidden source、lock semantic guard、lease runtime-only separation、operation family applicability、Step 14 config handoff、missing source/blocker、watch/blocker 表。
- 正式 `03-详细设计.md` 未被修改。
- `R13.15` 只允许思考 Step 6~12 到 Step 13 的 closure audit、Step 13 已完成表格覆盖、正式 §12 候选草稿结构、open blocker/watch 汇总和 Step 14~16 handoff。
- `R13.15` 不得写最终 closure audit/正式 §12 候选草稿,不得修改正式 `03-详细设计.md`,不得写 Step 14 config key、Step 15 observability schema、Step 16 test case schema 或 implementation code。

### 11. R13.14 stop-review

| 检查项 | 结果 |
|---|---|
| 是否写入 retry / lock / lease scope | pass |
| 是否写入 retry allowed / forbidden source table | pass |
| 是否写入 lock semantic guard table | pass |
| 是否写入 lease runtime-only separation table | pass |
| 是否写入 operation family applicability table | pass |
| 是否写入 Step 14 config handoff table | pass |
| 是否写入 missing source / blocker table | pass |
| 是否未定义 retry number、TTL、physical lock table、scheduler implementation、config key | pass |
| 是否未写 observability/test schema 或 implementation code | pass |
| 是否未修改正式 `03-详细设计.md` | pass |
| 是否形成 R13.15 进入门禁 | pass |

next_allowed_action: 等待用户确认后进入 Step 13 `R13.15 cross-step closure audit 与正式 §12 候选草稿停审:先思考`;只允许思考 Step 6~12 到 Step 13 的 closure audit、Step 13 已完成表格覆盖、正式 §12 候选草稿结构、open blocker/watch 汇总和 Step 14~16 handoff;不得直接修改正式 `03-详细设计.md`;不得写最终 closure audit/正式 §12 候选草稿;不得写 Step 14 config key、Step 15 observability schema、Step 16 test case schema 或 implementation code。

---

## R13.15 cross-step closure audit 与正式 §12 候选草稿停审:先思考

### 1. 当前模块目标

`R13.15` 只思考 Step 13 的最终收口方式,为 `R13.16` 写入 cross-step closure audit、正式 `03-详细设计.md` §12 候选草稿和 Step 14 进入门禁做准备。当前模块不写最终 closure audit 表,不写正式 §12 候选草稿,不修改正式 `03-详细设计.md`,不进入 Step 14/15/16 的具体内容。

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm |
| 当前允许 | 思考 Step 6~12 到 Step 13 的 closure audit、Step 13 coverage index、正式 §12 候选草稿结构、open blocker/watch 汇总、Step 14~16 handoff 和 `R13.16` 写入计划。 |
| 当前禁止 | 写最终 closure audit/正式 §12 候选草稿;修改正式 `03-详细设计.md`;写 Step 14 config key、Step 15 observability schema、Step 16 test case schema 或 implementation code。 |

### 2. closure audit 方法思考

| source step | Step 13 closure question | R13.16 expected audit direction |
|---|---|---|
| Step 6 object contracts | replay/result/receipt/report/outcome/checkpoint/marker objects 是否都有 owner/source/body-free redline。 | 对照 Command、Inbound、Outbound、Handoff、Job、runtime guard 表逐类标注 covered/deferred/blocker。 |
| Step 7 trait / port / adapter | idempotency guard、repository version、publisher/handoff outcome、runtime binding、checkpoint/report read/write 是否只使用正式 port。 | 标注 Step 13 没有新增未闭口 port;missing source 进入 blocker/handoff。 |
| Step 8 protocol contracts | Command/Query/Inbound/Outbound/Job/Handoff public/stored surface 是否有 replay/no-rerun/no-write/no-rollback 规则。 | 对照 R13.6/R13.8/R13.10/R13.12 覆盖。 |
| Step 9 function flows | 58 Command、57 Query、4 Inbound、34 Outbound、8 Job 的 duplicate/retry/resume/no-write/no-rollback 是否闭口。 | 用 coverage index 汇总,不重复全文。 |
| Step 10 state machine | idempotency/replay/runtime/outbound/job state owner 是否能映射到 Step 13 guard。 | 标注 checkpoint/version/lease separation、in-flight/commit-unknown/manual。 |
| Step 11 persistence/transaction | stored replay no-rerun、query no-write、publication/handoff no rollback、checkpoint-not-version 是否被 Step 13 承接。 | 标注 R13.4~R13.14 对应表。 |
| Step 12 errors/recovery | duplicate missing surface/manual、retryable unavailable、commit unknown、partial job、body-free violation 是否有并发/重入规则。 | 标注 public recovery 不被 Step 13 改写;Step 13 只补重入/guard。 |

### 3. Step 13 coverage index 思考

| Step 13 block | coverage | candidate §12 role |
|---|---|---|
| R13.1/R13.2 | 开工、必读文档、输入边界、旧污染隔离、模块计划。 | §12.1 scope and source boundary。 |
| R13.3/R13.4 | request/resource/worker/runtime protection layers, type families, source/backref redlines。 | §12.2 protection layers。 |
| R13.5/R13.6 | Command idempotency/concurrency, key/digest, duplicate/conflict/in-flight/stored-missing/commit-unknown/version conflict。 | §12.3 Command idempotency and concurrency。 |
| R13.7/R13.8 | Query repeatability/no-write, cursor/version/checkpoint/freshness separation, marker copy-only。 | §12.4 Query repeatability and no-write。 |
| R13.9/R13.10 | Inbound redelivery, Outbound candidate retry, Handoff outcome retry, post-commit no rollback。 | §12.5 IOH reentry。 |
| R13.11/R13.12 | Operations Job idempotency, stored report replay, checkpoint resume, partial retry, no repair。 | §12.6 Job checkpoint resume。 |
| R13.13/R13.14 | retry/lock/lease semantic boundary, allowed source, config handoff。 | §12.7 retry / lock / lease boundary。 |
| R13.15/R13.16 | closure audit, formal candidate, next-step handoff。 | §12.8 closure and handoff。 |

### 4. 正式 §12 候选草稿结构思考

`R13.16` 应生成可装配到正式 `03-详细设计.md` 的 §12 候选草稿,但仍保留在 calibration 文件中。正式文档只能在后续 formal assembly 模块修改。

| §12 candidate block | 应包含 | 不应包含 |
|---|---|---|
| §12.1 scope and non-goals | Step 13 处理的 concurrency/idempotency/reentry 范围和非范围。 | physical DB lock、TTL、config key、test case ID。 |
| §12.2 protection layers | request idempotency、resource concurrency、worker reentry、runtime guard。 | private implementation lock or lease mechanism。 |
| §12.3 Command idempotency | operation key/digest、reserve/complete/replay semantics、conflict/in-flight/stored missing/commit unknown/version conflict。 | per-command DTO schema or code。 |
| §12.4 Query repeatability | no-write、repeat read、cursor/version/checkpoint/freshness separation、marker copy-only。 | query result cache or replay store。 |
| §12.5 IOH reentry | inbound receipt replay、outbound candidate retry、handoff local outcome、post-commit no rollback。 | broker offset/topic/delivery truth。 |
| §12.6 Job checkpoint resume | stored report replay、checkpoint resume、partial issue、no core truth repair。 | scheduler lease algorithm or report body schema。 |
| §12.7 retry/lock/lease boundary | semantic retry source,lock guard owner,lease runtime-only,Step 14 config handoff。 | numeric retry/backoff/TTL/config keys。 |
| §12.8 closure and handoff | closure audit,open blocker/watch,Step 14~16 handoff。 | implementation plan commit boundaries。 |

### 5. open blocker / watch 汇总思考

当前 R13.15 未发现需要暂停 Step 13 的 hard blocker。多数 watch 已在 Step 13 semantic layer closed,但仍需在后续 Step 承接 config/observability/test。

| watch group | current status | R13.16 handling |
|---|---|---|
| Command stored replay / commit unknown | closed_semantic;missing stored surface remains manual/consistency。 | summary in closure audit and candidate §12.3。 |
| Query no-write / marker copy-only | closed_semantic;missing marker source remains blocker later。 | summary in §12.4 and Step 16 handoff。 |
| IOH receipt/outcome/candidate source | closed_semantic;missing outcome/candidate marker remains blocker later。 | summary in §12.5 and Step 15/16 handoff。 |
| Job report/checkpoint/resume | closed_semantic;missing report/checkpoint/issue source remains blocker later。 | summary in §12.6。 |
| retry/lock/lease config | closed at semantic boundary;numeric/config binding deferred。 | Step 14 handoff in §12.7/§12.8。 |
| formal assembly | not done;formal `03-详细设计.md` remains unmodified。 | R13.16 writes candidate only;Step 19/formal assembly later。 |

### 6. Step 14~16 handoff 思考

| target Step | handoff from Step 13 | not closed here |
|---|---|---|
| Step 14 config / dependencies | retry numeric policy、TTL、lease duration/renewal、runtime binding、target registry、adapter/publisher/handoff config。 | config key names,values,secret/topic/URL binding。 |
| Step 15 observability / audit | idempotency/replay/commit unknown/manual consistency/publication/handoff/job issue observations must be safe and body-free。 | metric labels,log/span schema,evidence artifact schema。 |
| Step 16 test cut | no-rerun duplicate,query no-write,no-rollback,checkpoint-not-version,lease-not-checkpoint,no-body redlines。 | concrete test IDs,fixtures,evidence files。 |
| Step 17 implementation handoff | implementation must respect blocker-if-missing-source and no private fallback。 | commit boundaries and run evidence gates。 |
| Step 19 formal assembly | §12 candidate can be assembled only from confirmed R13.16。 | direct modification now。 |

### 7. R13.16 写入计划思考

`R13.16` 应将本模块思考写成 Step 13 最终中间产物,但仍不得修改正式 `03-详细设计.md`。

1. 写 Step 6~12 -> Step 13 closure audit table。
2. 写 Step 13 coverage index。
3. 写 open blocker / watch / handoff table。
4. 写正式 `03-详细设计.md` §12 candidate draft。
5. 写 Step 14 entry gate。
6. 写 Step 13 final stop-review。
7. 同步 flow 和项目台账到 Step 13 completed_wait_user_confirm,等待 Step 14。

### 8. R13.15 stop-review

| 检查项 | 结果 |
|---|---|
| 是否只思考 closure audit 与正式 §12 候选草稿结构 | pass |
| 是否覆盖 Step 6~12 到 Step 13 的审计方法 | pass |
| 是否覆盖 Step 13 coverage index | pass |
| 是否覆盖正式 §12 candidate 结构 | pass |
| 是否覆盖 open blocker/watch 和 Step 14~16 handoff | pass |
| 是否未写最终 closure audit / 正式 §12 候选草稿 | pass |
| 是否未修改正式 `03-详细设计.md` | pass |
| 是否未写 Step 14 config key、Step 15 observability schema、Step 16 test case schema 或 implementation code | pass |
| 是否形成 R13.16 写入计划 | pass |

next_allowed_action: 等待用户确认后进入 Step 13 `R13.16 cross-step closure audit 与正式 §12 候选草稿停审:再写入`;只允许写入 Step 6~12 到 Step 13 的 closure audit table、Step 13 coverage index、open blocker/watch/handoff table、正式 `03-详细设计.md` §12 candidate draft、Step 14 entry gate 和 Step 13 final stop-review;不得直接修改正式 `03-详细设计.md`;不得写 Step 14 config key、Step 15 observability schema、Step 16 test case schema 或 implementation code。

---

## R13.16 cross-step closure audit 与正式 §12 候选草稿停审:再写入

### 1. 当前模块目标

`R13.16` 将 Step 13 的最终收口写成可恢复、可审计、可装配的 calibration artifact。当前模块只写 Step 6~12 到 Step 13 的 closure audit、Step 13 coverage index、open blocker/watch/handoff、正式 `03-详细设计.md` §12 candidate draft、Step 14 entry gate 和 final stop-review。正式 `03-详细设计.md` 仍不修改。

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm |
| 当前允许 | 写入 Step 13 final closure artifact 和 Step 14 entry gate。 |
| 当前禁止 | 修改正式 `03-详细设计.md`;写 Step 14 config key、Step 15 observability schema、Step 16 test case schema 或 implementation code。 |

### 2. Step 6~12 -> Step 13 closure audit table

| source step | Step 13 覆盖结论 | 剩余边界 |
|---|---|---|
| Step 6 object contracts | replay/result/receipt/report/outcome/checkpoint/marker owner、formal source 和 body-free redline 已被 R13.4、R13.6、R13.8、R13.10、R13.12、R13.14 承接。 | 若实现时发现对象字段来源未在 Step 6 闭口,必须回设计补口,不得以 private map、raw body、timestamp 或 error text 推导。 |
| Step 7 trait / port / adapter | Step 13 只使用正式 idempotency guard、repository version、stored surface、publisher/handoff/runtime/checkpoint/report port;没有新增 private port。 | 若缺 formal port,implementation 必须暂停,不得在 adapter/fake runtime 私补。 |
| Step 8 protocol contracts | Command / Query / Inbound / Outbound / Job / Handoff public shell 与 stored replay surface 已映射到 no-rerun、no-write、no-rollback、copy-only 和 manual consistency 规则。 | public DTO 缺 marker/source 时是设计 blocker,不是实现自由度。 |
| Step 9 function flows | 58 Command、57 Query、4 Inbound、34 Outbound、8 Operations Job 的 duplicate、retry、resume、no-write、no-rollback 分支已按 family 覆盖。 | R13 不重写函数流;发现 flow 与对象/port/protocol 不一致时回到对应 Step 闭口。 |
| Step 10 state machine | in-flight、completed replay、commit unknown、manual consistency、checkpoint、version、lease/runtime ownership 的状态主语已被分离。 | lease 不得替代 checkpoint/version/stored replay proof。 |
| Step 11 persistence / transaction | stored replay no-rerun、Query no-write、post-commit no rollback、checkpoint-not-version、publication/handoff outcome guard 已承接。 | R13 不定义 physical storage schema、DB lock table 或 transaction isolation。 |
| Step 12 errors / recovery | duplicate missing surface/manual、retryable unavailable、commit unknown、partial job、body-free violation 已补并发/重入 guard,但不改写 recovery public surface。 | retryability、manual consistency 和 degraded/unavailable marker 仍只能复制正式 source。 |

### 3. Step 13 coverage index

| Step 13 block | 覆盖内容 | candidate §12 落点 |
|---|---|---|
| R13.1 / R13.2 | 开工、必读文档、输入边界、旧污染隔离、SOP 五问和模块计划。 | §12.1 scope and source boundary |
| R13.3 / R13.4 | request idempotency、resource concurrency、worker reentry、runtime guard、formal source/backref redline。 | §12.2 protection layers |
| R13.5 / R13.6 | Command key/digest、reserve/complete、duplicate replay、digest conflict、in-flight、stored missing、commit unknown、version conflict。 | §12.3 Command idempotency and concurrency |
| R13.7 / R13.8 | Query repeatability、no-write/no-repair、cursor/version/checkpoint/freshness separation、marker copy-only。 | §12.4 Query repeatability and no-write |
| R13.9 / R13.10 | Inbound redelivery、stored receipt replay、Outbound candidate retry、Handoff outcome retry、post-commit no rollback。 | §12.5 Inbound / Outbound / Handoff reentry |
| R13.11 / R13.12 | Operations Job idempotency、stored report replay、checkpoint resume、partial retry、no core truth repair。 | §12.6 Operations Job checkpoint resume |
| R13.13 / R13.14 | retry allowed/forbidden source、lock semantic guard、lease runtime-only、Step 14 config handoff。 | §12.7 retry / lock / lease boundary |
| R13.15 / R13.16 | cross-step closure audit、open blocker/watch、正式 §12 candidate、Step 14 entry gate。 | §12.8 closure, blocker and handoff |

### 4. open blocker / watch / handoff table

| ID | 类型 | 状态 | 处理口径 |
|---|---|---|---|
| ML-D03-S13-FINAL-BLOCK-001 | hard blocker | none_at_R13.16 | 当前 Step 13 没有需要阻断进入 Step 14 的 hard blocker。 |
| ML-D03-S13-FINAL-WATCH-001 | Command stored surface | watch_for_implementation | accepted/rejected duplicate 只能复制 stored surface;missing surface 进入 manual/consistency,不得重跑。 |
| ML-D03-S13-FINAL-WATCH-002 | Query marker/source | watch_for_step15_step16 | Query degraded/stale/unavailable marker 必须来自正式 source;缺 source 是 blocker。 |
| ML-D03-S13-FINAL-WATCH-003 | IOH outcome/candidate | watch_for_step14_step15 | receipt/outcome/candidate marker 必须来自正式 shell;broker offset、external receipt body 和 topic 不得成为 truth。 |
| ML-D03-S13-FINAL-WATCH-004 | Job report/checkpoint/issue source | watch_for_implementation | checkpoint/report/issue source 缺失时 resume blocked/manual,不得用 lease、queue offset 或 material scan 补。 |
| ML-D03-S13-FINAL-HANDOFF-001 | Step 14 | pending_user_confirm | retry number、TTL、lease duration、runtime binding、target registry、adapter/publisher/handoff config 留 Step 14。 |
| ML-D03-S13-FINAL-HANDOFF-002 | Step 15 | pending_later_step | metric/log/span/audit/evidence safe schema 留 Step 15。 |
| ML-D03-S13-FINAL-HANDOFF-003 | Step 16 | pending_later_step | concrete test case IDs、fixtures、evidence files 留 Step 16。 |
| ML-D03-S13-FINAL-HANDOFF-004 | Step 19 / formal assembly | pending_later_step | 本模块只给 §12 candidate;正式 `03-详细设计.md` 后续装配时再修改。 |

### 5. 正式 `03-详细设计.md` §12 candidate draft

以下内容是候选草稿,只保存在 calibration 文件中。正式 `03-详细设计.md` 尚未修改。

#### §12.1 Scope and non-goals

Step 13 定义 L3-method-library 的并发、幂等与重入保护边界。保护对象包括 Command mutation、Query repeat read、Inbound redelivery、Outbound publication retry、Handoff retry、Operations Job resume 以及 runtime entry guard。Step 13 不定义 physical lock table、DB isolation、retry numeric policy、TTL、lease duration、config key、observability payload、test case schema 或 implementation code。

所有 key、digest、version、checkpoint、stored replay surface、marker、outcome 和 runtime binding 只能来自 Step 6~12 已正式定义的对象、port、protocol、flow、state、persistence 和 recovery surface。缺正式来源时,实现必须暂停回设计闭口。

#### §12.2 Protection layers

并发与幂等保护按四层处理:

- request idempotency: 同一 formal operation key 和 digest 的 duplicate 复制 stored surface;同 key 不同 digest 是 conflict;in-flight 不允许第二 writer。
- resource concurrency: mutable truth 使用正式 version / expected_version;append-only side effect 使用 append identity;checkpoint、cursor、freshness 和 lease 不得替代 version。
- worker reentry: Inbound、Outbound、Handoff 和 Operations Job 只能从 formal receipt、candidate、outcome、checkpoint、report 或 issue source 恢复。
- runtime guard: entry / scheduler / lease 只能表达 runtime ownership 或 unavailable / blocked classification,不得成为 business truth、checkpoint、stored replay proof 或 idempotency key。

#### §12.3 Command idempotency and concurrency

Command accepted/rejected duplicate path 必须先读取正式 idempotency guard 和 stored surface。same key + same digest + completed 返回 stored result / rejection / effect summary;same key + different digest 返回 conflict;in-flight 返回 retryable or blocked public surface only when formal marker exists。stored surface missing、wrong kind 或 unreadable 时进入 consistency/manual,不得重跑 Command body 重建响应。

Command mutation path 使用 repository version / expected_version 防止 lost update。version conflict 只能在正式 reload 后重试。commit unknown 不能凭 timeout、log、current truth 或 adapter note 断言成功;必须依赖 stored surface、read-back 或正式 recovery source。

#### §12.4 Query repeatability and no-write

Query 重复调用不写 idempotency store,不修复 projection/material,不创建 missing marker。Query 只读取当前正式 safe surface,并复制 visibility、freshness、degraded、unavailable、not-visible 或 safe absent marker。page cursor 只表达分页位置,不能替代 version、checkpoint 或 freshness marker。

当 Query 发现 material missing、partial page、marker missing 或 source mismatch 时,只能返回 Step 8/12 已定义的 public surface;若缺正式 marker 来源,该分支是设计 blocker。

#### §12.5 Inbound / Outbound / Handoff reentry

Inbound redelivery 以 formal source binding 和 stored receipt 判定 duplicate。same source + same semantic material 复制 stored receipt;digest/source mismatch 或 receipt missing 按 Step 12 recovery surface 处理,不得用 broker ack、topic、offset 或 dead-letter state 作为 receipt truth。

Outbound publication retry 只能从 durable event candidate 和 target publication outcome shell 恢复。Handoff retry 只能从 handoff-safe refs 和 local outcome marker 恢复。publication/handoff 属 post-commit side-effect layer,失败或重试不得回滚已提交 truth、stored result、receipt、report 或 checkpoint。

#### §12.6 Operations Job checkpoint resume

Operations Job duplicate completed path 返回 stored report。resume 只能从 formal task/run/checkpoint/progress/report/issue source 继续。partial retry 只能针对正式 issue/progress 标记出的 failed subset;缺 checkpoint、checkpoint corrupt、report missing 或 issue source missing 时进入 blocked/manual。

Job 不得用 scheduler lease、queue offset、timestamp、current material scan 或 adapter note 代替 checkpoint、report 或 idempotency proof。Job 不承担 core truth repair,除非 Step 9/11 已把该写面定义为正式 maintenance output。

#### §12.7 retry / lock / lease boundary

retry 只在 formal safe outcome/classification 表示 temporary/unavailable/retryable 时允许。same digest completed 是 replay,不是 retry;different digest conflict 不允许自动重试;commit unknown 和 missing stored surface 进入 manual/consistency。

lock 在 Step 13 中只表示 semantic guard owner,包括 idempotency reservation、expected_version、append identity、candidate/outcome identity 和 job checkpoint/report guard。physical lock table、row lock、DB isolation 和 scheduler implementation 留给后续实施计划或适配层设计。

lease 是 runtime execution ownership 概念,只能防止重复 worker execution。lease expiry/renewal 不证明前序工作回滚、完成、checkpoint advance 或 report write。retry number、backoff、TTL、lease duration、target registry 和 adapter binding 留 Step 14。

#### §12.8 closure, blocker and handoff

Step 13 已覆盖 Step 6~12 到并发、幂等与重入保护的主要闭环: object source、port usage、protocol surface、function flow、state owner、persistence transaction 和 recovery behavior。当前无阻断 Step 14 的 hard blocker。

后续 Step 必须承接三类 handoff:

- Step 14 只绑定配置和外部依赖,不得改变 Step 13 的 semantic source 规则。
- Step 15 只定义 safe observability/audit schema,不得泄露 raw body、secret、external unsafe response 或 private adapter detail。
- Step 16 只定义测试切口和 evidence,不得用测试 fixture 补正式 source、port、mapper 或 marker。

### 6. Step 14 entry gate

进入 Step 14 前必须满足:

- Step 13 `R13.1` ~ `R13.16` 均已 completed_wait_user_confirm。
- 本文件已写入 closure audit、coverage index、open blocker/watch/handoff、正式 §12 candidate draft、Step 14 entry gate 和 final stop-review。
- 正式 `03-详细设计.md` 未被修改。
- 用户明确确认进入 Step 14。
- Step 14 只能从 `R14.1 开工与必读文档:先思考` 开始,只思考配置引用与外部依赖绑定输入边界、Step 13 handoff 承接、L1-governance 框架参考、旧 Step 14 污染隔离和 R14 模块计划。
- Step 14 不得提前写 observability schema、test case schema、implementation code,也不得在未到 formal assembly 时直接修改正式 `03-详细设计.md`。

### 7. R13.16 final stop-review

| 检查项 | 结果 |
|---|---|
| 是否写入 Step 6~12 -> Step 13 closure audit table | pass |
| 是否写入 Step 13 coverage index | pass |
| 是否写入 open blocker / watch / handoff table | pass |
| 是否写入正式 `03-详细设计.md` §12 candidate draft 且仅保存在 calibration 文件 | pass |
| 是否写入 Step 14 entry gate | pass |
| 是否未修改正式 `03-详细设计.md` | pass |
| 是否未写 Step 14 config key、Step 15 observability schema、Step 16 test case schema | pass |
| 是否未写 implementation code | pass |
| 是否形成 Step 13 completed_wait_user_confirm 与 Step 14 R14.1 等待确认状态 | pass |

next_allowed_action: 等待用户确认后进入 Step 14 `R14.1 开工与必读文档:先思考`;只允许思考 Step 14 的必读文档、配置引用与外部依赖绑定输入边界、Step 13 handoff 承接、L1-governance 框架参考、旧 Step 14 污染隔离和 R14 模块计划;不得直接修改正式 `03-详细设计.md`;不得提前写完整 config key 表、secret/topic/URL binding、observability schema、test case schema 或 implementation code。
