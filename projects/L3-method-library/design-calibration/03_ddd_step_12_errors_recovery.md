# Step 12. 定义错误模型、异常分支与恢复口径

> 对应 SOP: `standards/document/详细设计讨论流程_SOP.md` Step 12
> 回填章节: `projects/L3-method-library/03-详细设计.md` §11 错误模型、异常分支与恢复口径
> 创建日期: 2026-06-23
> 当前模式: full-restart / step12-errors-recovery
> 当前状态: in_progress
> 当前模块: `R12.16 cross-step closure audit 与正式 §11 候选草稿停审:再写入`
> 当前门禁: `R12.16` completed_wait_user_confirm;等待确认进入 Step 13 `R13.1 开工与必读文档:先思考`

---

## 0. 文件重置记录

旧 `03_ddd_step_12_errors_recovery.md` 曾标记为 `[x] 已确认`,但其内容围绕旧 `MethodContent`、payload、snapshot、fingerprint、old outbox、dead-letter、P0/P1、旧 HTTP/RPC 映射和旧 operations job 口径展开。该 completed 状态和旧错误模型结论全部失效。

当前 Step 12 不继承旧错误 enum、旧错误码、旧 retryability、旧 dead-letter/outbox、旧 audit 规则、旧 snapshot/fingerprint 恢复口径或旧 HTTP/RPC status 数字。旧内容只能作为 historical pollution 和差异审计输入,不得作为当前 L3-method-library 错误模型、异常分支或恢复策略的正向来源。

当前 Step 12 的唯一正向基线是:

- 当前 `00-需求文档.md`、`01-架构设计.md`、`02-概要设计.md`。
- 本轮 `03-详细设计` Step 1~11 中间产物。
- 特别是 Step 6 object contracts、Step 7 trait / port / adapter、Step 8 protocol contracts、Step 9 function flows、Step 10 state matrix 和 Step 11 persistence / transaction / consistency handoff。

---

## R12.1 开工与必读文档:先思考

### 1. 当前模块目标

`R12.1` 只思考 Step 12 的开工边界、必读文档、L1-governance Step 12 框架参考、Step 11 handoff 承接、错误/异常/恢复分批计划和旧 Step 12 污染隔离方式。当前模块不写完整错误类型表、错误映射表、异常分支处理表或恢复口径表。

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm |
| 当前允许 | 思考必读文档、输入边界、错误模型分批、L1-governance 框架裁剪、Step 11 handoff 承接和 `R12.2` 写入边界。 |
| 当前禁止 | 写完整 error taxonomy、public error code、safe message schema、HTTP/RPC status 数字、retry/lock/TTL、config key、observability schema、test case schema、implementation code 或正式 `03-详细设计.md`。 |

### 2. Step 12 启动前必须承接

| 输入 | 必须承接的内容 | 禁止继承 / 禁止提前 |
|---|---|---|
| `project_execution_ledger.md` | 当前恢复点、单模块推进规则、Step 11 `R11.24` completed_wait_user_confirm。 | 跳过 R12.1 / R12.2 直接写完整错误模型。 |
| `03_ddd_calibration_flow.md` | Step 11 completed、Step 12 waiting_user_confirm、Step 13+ blocked_by_step12。 | 将并发重试、配置绑定、观测 schema、测试方案提前写入 Step 12。 |
| `03_ddd_step_11_persistence_tx_consistency.md` R11.21~R11.24 | transaction boundary、consistency strategy、deferred handoff 和 §10 候选草稿。 | 把 Step 11 deferred_to_later_step 项伪装成 Step 12 已闭口,或越界写 Step 13~16。 |
| `03_ddd_step_06_object_contracts.md` | object factory / transition / marker / stored result / report / handoff helper 的失败来源。 | 为 Step 6 未定义的 object/field/source 发明错误来源。 |
| `03_ddd_step_07_trait_port_adapter.md` | repository/resolver/publisher/handoff/UoW/result-store/runtime port failure boundary。 | 从 raw adapter error、string reason、fake private map 推 public marker 或 retryability。 |
| `03_ddd_step_08_protocol_contracts.md` | command rejection、query surface、inbound receipt、outbound outcome、job result/report 的 public safe surface。 | 直接暴露 domain/internal/infra error;或用 public DTO 反推 persistence truth。 |
| `03_ddd_step_09_function_flows.md` | Command / Query / Inbound / Outbound / Job flow 的异常分支、rollback/no-rollback、duplicate replay。 | 只写“返回失败”,不回指检测位置、处理方式和副作用边界。 |
| `03_ddd_step_10_state_machine.md` | illegal transition、terminal state、degraded/unavailable/stale/failed/partial 状态与 side-effect trigger。 | 遗漏状态矩阵中出现的错误 variant 或恢复路径。 |
| `standards/document/详细设计讨论流程_SOP.md` Step 12 | 错误类型表、错误映射表、异常分支处理表、恢复口径表。 | 用 narrative 代替可编码表格。 |
| `standards/document/详细设计书写规范.md` §5.11 | 错误类型必须可编码、可映射、可区分 retryability / manual intervention。 | 只列错误码,不说明触发条件、外部映射和调用方处理。 |
| `standards/document/设计真相源闭环与可落码性标准.md` | 状态矩阵错误必须进入错误模型;query marker / degraded mapper / stored replay / job report 缺失必须有正式恢复口径。 | implementation 侧自行合成 marker、mapper、port、schema 或恢复策略。 |

### 3. 规范约束思考

| 规范 | Step 12 使用方式 | 当前判断 |
|---|---|---|
| `详细设计讨论流程_SOP.md` Step 12 | 要求定义代码层错误类型、错误映射、异常分支和恢复策略。 | 必须采用;不能只写 public error code。 |
| `详细设计书写规范.md` §5.11 | 要求输出错误类型表、错误映射表、异常分支处理表、恢复口径表。 | 后续 R12 必须逐表闭合,但 R12.1 只规划。 |
| `设计真相源闭环与可落码性标准.md` §4.3 | 状态矩阵、flow 错误映射或测试切口中出现的每个错误 variant 都必须进入正式错误模型。 | R12 后续必须从 Step 9 / Step 10 反查错误来源。 |
| 同标准 query marker / degraded mapper 规则 | public query status marker 必须来自正式 policy / resolver / mapper / repository summary。 | R12 只能定义复制和恢复口径,不能让 service 从 error text 拼 marker。 |
| 同标准 stored replay / job report 规则 | duplicate replay 的 stored result / receipt / report 缺失必须有错误与恢复口径。 | R12 必须写 consistency failure / manual intervention,但算法留 Step 13。 |

### 4. L1-governance Step 12 框架参考

L1-governance Step 12 的价值在框架深度,不是领域语义。L3-method-library 只参考组织方法和闭环标准。

| L1 Step 12 框架点 | L3 采用方式 |
|---|---|
| 明确 Step 12 目标和非目标 | 当前 Step 12 写可实现错误模型和恢复口径,不写 transport status 数字、retry 参数、配置 key、日志格式或实施 commit。 |
| 先列输入材料和 SOP 问题回答 | R12.2 需要写必读文档表、读取状态和 SOP 五问初步回答。 |
| 错误设计原则 | L3 应固定分层映射、query no-write、accepted 才写 success side effect、duplicate replay no-rerun、body-free recovery。 |
| 错误层级 | L3 需要区分 domain、application、port/infra、protocol、worker/job surface。 |
| 错误类型表 | L3 后续按 capability family 写 domain/application/port/protocol/job 错误类型,不复用 governance enum。 |
| 外部映射表 | L3 后续按 Command、Query、Inbound、Outbound、Job、Handoff 写 internal -> public surface 映射。 |
| 异常分支处理表 | L3 后续回指 Step 9 flow 的检测位置、处理方式、是否写 stored result/audit/outcome/report。 |
| 恢复口径表 | L3 后续区分 retryable、non-retryable、manual intervention、design blocker、query degraded/unavailable。 |
| 跨 Step 审计 | L3 Step 12 最后审计 Step 6~11 所有错误/异常/恢复是否闭口,再进入 Step 13。 |

### 5. Step 11 handoff 承接思考

| Step 11 handoff | Step 12 承接方式 | 当前 R12.1 裁决 |
|---|---|---|
| accepted truth + stored accepted result atomicity | 定义 atomicity failure、stored accepted result missing、commit unknown 的 public safe surface 和恢复口径。 | 后续必须写错误类型和恢复表;reserve/complete 算法留 Step 13。 |
| query no-write | 定义 not-visible、missing、stale、degraded、unavailable、consistency defect 的 query surface,并禁止 query 写修复。 | 后续必须写 Query 映射和异常分支表。 |
| duplicate replay no-rerun | 定义 stored result/receipt/report/checkpoint missing、wrong kind、unreadable 的错误与恢复。 | 后续必须写 duplicate replay failure 分类;重放序列化留 Step 13。 |
| publication / handoff no rollback | 定义 post-commit publisher/handoff failure 的 retryable/permanent/manual 表达,不得回滚 truth。 | 后续必须写 Outbound / Handoff 映射。 |
| checkpoint is not version | 定义 checkpoint missing/stale/corrupt 与 version conflict 的区别。 | 后续必须写 Job/Operations recovery。 |
| body-free persistence redline | 定义 forbidden raw body、payload/report body leakage、raw exception leakage 的 reject/quarantine/manual 口径。 | 后续必须写 body-boundary 错误。 |
| missing formal source / port / marker / schema | 定义 design-blocker / consistency-defect 的停机口径,不能由实现合成。 | 后续必须写 blocker_if_missing_formal_source 规则。 |

### 6. 初步错误模型分批思考

本表只是 R12.1 思考结果,不是 final error taxonomy。

| 批次族 | 候选内容 | 主要输入 | 初判 |
|---|---|---|---|
| opening / framework | 必读文档、SOP 五问、错误层级、分批计划、旧材料排除 | SOP / writing spec / Step 11 / L1 framework | R12.2 写入。 |
| error layer and type families | domain/application/port/protocol/worker/job 错误层级和错误类型族 | Step 6 / 7 / 8 / 10 | 后续先思考再写入。 |
| Command / accepted / rejected / duplicate errors | command validation、domain rejected、version conflict、idempotency conflict、stored result missing、commit unknown | Step 8 / 9 / 11 | 必须闭 stored replay 和 transaction failure。 |
| Query surface errors | missing/not-visible/stale/degraded/unavailable/consistency defect;marker 来源 | Step 7 / 8 / 9 / 10 / 11 | 必须保持 no-write 和 copy-only marker。 |
| Inbound / Outbound / Handoff errors | envelope invalid、unsupported schema、forbidden body、publisher/handoff retryable/permanent outcome | Step 8 / 9 / 10 / 11 | 必须区分 no rollback 和 worker receipt/outcome。 |
| Job / operations recovery errors | job input invalid、partial item failure、checkpoint missing/corrupt、stored report missing、manual intervention | Step 6 / 8 / 9 / 10 / 11 | 必须区分 retryable、manual、consistency defect。 |
| audit / side-effect failure rules | accepted success trace/outcome/report vs rejected/no-write/no side-effect | Step 9 / 10 / 11 | 必须防止失败伪装成成功事实。 |
| formal §11 candidate / closure audit | 正式 §11 候选草稿、Step 6~11 错误恢复闭环审计、Step 13 handoff | R12 completed rows | 最后统一停审,不改正式 03。 |

### 7. 排除规则初判

| 排除对象 | 排除原因 |
|---|---|
| HTTP status 数字 / RPC code 数字 | Step 12 写 public surface 语义和映射方向,具体 adapter 数字可由 protocol/adapter层后续绑定。 |
| retry count / TTL / lock lease / scheduler lease | 归 Step 13;Step 12 只写 retryable / non-retryable / manual intervention / consistency defect。 |
| config key / topic / URL / secret / adapter target | 归 Step 14;Step 12 只写 dependency unavailable / invalid config 的错误类别。 |
| metric label / trace span payload / evidence artifact path | 归 Step 15/16;Step 12 只写是否产生 safe audit / outcome / report / issue ref。 |
| raw external body / payload body / raw exception detail | body-free 红线;错误 details 只能是 typed refs、summary refs、marker、safe issue ref。 |
| old `MethodContent` / snapshot / fingerprint / old outbox / dead-letter 错误码 | historical pollution;不得作为当前 L3 错误模型正向来源。 |

### 8. R12.2 写入边界思考

`R12.2` 只应写入开工材料,不得进入完整错误类型表或恢复矩阵:

1. 写 Step 12 必读文档表和读取状态。
2. 写输入基线与旧材料处理规则。
3. 写 SOP 五问的初步回答。
4. 写 Step 12 输出骨架、分批模块计划和 L1-governance 参考边界。
5. 写 `R12.3` 进入门禁。

### 9. R12.1 stop-review

| 检查项 | 结果 |
|---|---|
| 是否确认旧 Step 12 completed 作废 | pass |
| 是否只思考开工、必读文档、Step 11 handoff 和分批计划 | pass |
| 是否参考 L1-governance 框架但不复制领域语义 | pass |
| 是否明确不写完整 error taxonomy / recovery table | pass |
| 是否未修改正式 `03-详细设计.md` | pass |
| 是否未写 Step 13/14/15/16 内容、test schema 或 implementation code | pass |

next_allowed_action: 等待用户确认后进入 Step 12 `R12.2 开工与必读文档:再写入`;只允许写入 Step 12 必读文档表、读取状态、输入基线、旧材料处理规则、SOP 五问初步回答、Step 12 输出骨架、分批模块计划、L1-governance 框架参考边界和 `R12.3` 进入门禁;不得直接修改正式 `03-详细设计.md`;不得写完整 error taxonomy、error mapping、异常分支处理表、恢复口径表、Step 13 retry/lock/TTL、Step 14 config key、Step 15 observability schema、Step 16 test case schema 或 implementation code。

---

## R12.2 开工与必读文档:再写入

### 1. 当前模块目标

`R12.2` 将 `R12.1` 的开工思考落成 Step 12 的执行入口。当前模块只写必读文档表、读取状态、输入基线、旧材料处理规则、SOP 五问初步回答、Step 12 输出骨架、分批模块计划、L1-governance 框架参考边界和 `R12.3` 进入门禁;不写完整错误类型表、错误映射表、异常分支处理表或恢复口径表。

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm |
| 当前允许 | 写入 Step 12 必读文档表、读取状态、输入基线、旧材料处理规则、SOP 五问初步回答、输出骨架、模块计划和 `R12.3` 进入门禁。 |
| 当前禁止 | 写完整 error taxonomy、public error code、HTTP/RPC 数字、完整 flow error mapping、异常分支处理表、恢复口径表、retry/lock/TTL、config key、observability schema、test case schema、implementation code 或正式 `03-详细设计.md`。 |

### 2. 必读文档表与读取状态

| 文档 | 读取状态 | Step 12 用途 | 当前裁决 |
|---|---|---|---|
| `project_execution_ledger.md` | 已读 | 恢复当前文档、Step、模块、门禁和下一动作。 | 当前允许进入 `R12.2`;每次恢复必须先读。 |
| `03_ddd_calibration_flow.md` | 已读 | 确认 Step 11 completed、Step 12 in_progress、Step 13+ blocked。 | 当前只推进一个模块,不得自动进入 R12.3。 |
| `03_ddd_step_12_errors_recovery.md` | 已重置并已读 | 承载 Step 12 本轮 full-restart 中间产物。 | 旧 completed 状态作废。 |
| `03_ddd_step_11_persistence_tx_consistency.md` R11.21~R11.24 | 已读 | 提供 transaction boundary、consistency strategy、deferred handoff 和 Step 12 进入门禁。 | Step 12 必须承接 query no-write、stored replay no-rerun、no rollback、body-free、missing formal source blocker。 |
| `03_ddd_step_06_object_contracts.md` | 待后续逐模块复核 | 提供 object factory / transition / marker / stored result / report / handoff helper 的失败来源。 | R12.3 起按错误层级逐步回查。 |
| `03_ddd_step_07_trait_port_adapter.md` | 待后续逐模块复核 | 提供 repository/resolver/publisher/handoff/UoW/result-store/runtime port failure boundary。 | 不得从 raw adapter error 或 fake private state 推 public marker。 |
| `03_ddd_step_08_protocol_contracts.md` | 待后续逐模块复核 | 提供 command rejection、query surface、receipt/outcome/report 的 public safe shell。 | public surface 只能复制正式 marker / summary / stored surface。 |
| `03_ddd_step_09_function_flows.md` | 待后续逐模块复核 | 提供 command/query/inbound/outbound/job/handoff 异常分支、rollback、side-effect ordering。 | 后续异常分支表必须回指检测位置和处理方式。 |
| `03_ddd_step_10_state_machine.md` | 待后续逐模块复核 | 提供非法状态迁移、terminal state、degraded/unavailable/stale/failed/partial 状态。 | 状态矩阵出现的错误/恢复必须进入 Step 12。 |
| `standards/document/详细设计讨论流程_SOP.md` Step 12 | 已读 | 确认 Step 12 必须输出四类表。 | 后续不得只写 narrative。 |
| `standards/document/详细设计书写规范.md` §5.11 | 已读 | 确认错误类型、映射、异常分支和恢复口径格式。 | 必须区分 retryable、non-retryable、manual intervention。 |
| `standards/document/设计真相源闭环与可落码性标准.md` | 已读相关条款 | 确认状态矩阵错误、query marker、stored replay、job report、mapper/source 缺口的闭环规则。 | 缺正式 source / mapper / port / schema 时暂停,不得实现侧补口。 |
| `projects/L1-governance/design-calibration/03_ddd_step_12_error_recovery.md` | 已读框架 | 参考 Step 12 组织深度、表格族和门禁表达。 | 只借框架,不复制 governance 领域语义。 |

### 3. 输入基线与旧材料处理规则

| 输入类别 | 当前权威级别 | 使用方式 | 禁止事项 |
|---|---|---|---|
| 当前 `00/01/02` 正式文档 | authoritative upstream | 定义 L3-method-library 的仓定位、能力边界、依赖方向、实现单元和概要承接清单。 | 不得从旧 03 覆盖当前 00/01/02。 |
| 本轮 Step 1~11 中间产物 | current detailed-design truth | 提供对象、port、protocol、flow、state、persistence/transaction/consistency 的正向输入。 | 不得跳过已确认中间产物直接从历史材料生成错误模型。 |
| 旧 `03-详细设计.md` | historical_material | 只识别旧主线残留和污染风险。 | 不得继承旧章节编号、旧错误码或旧 recovery 结论。 |
| 旧 `03_ddd_step_12_errors_recovery.md` | historical_pollution | 只作为“已作废内容”的反例材料。 | 不得继承 `MethodContent`、snapshot、fingerprint、old outbox、dead-letter、P0/P1。 |
| L1-governance Step 12 | framework_reference | 借鉴目标、非目标、错误层级、映射表、恢复表和 cross-step audit 结构。 | 不得复制 governance enum、DTO、job/report/handoff 领域语义。 |

旧材料处理红线:

- 旧 `MethodContent` / `ContentVersion` / `SupersedeLink` / snapshot / fingerprint / old outbox / dead-letter / P0/P1 不进入当前错误模型。
- 旧 HTTP / RPC status 数字不作为 Step 12 正向结论;当前 Step 12 写 public surface 语义,不是 adapter 数字绑定。
- 旧 retryability 与旧 audit 规则不继承;当前 retry/manual/no-retry 必须从 Step 9~11 的 flow、state、transaction 和 consistency 重新推出。
- 发现当前 Step 6~11 缺正式错误 source、marker、mapper、port 或 stored surface 时,记录 blocker,不得在 Step 12 自行补 schema。

### 4. SOP 五问初步回答

| SOP 问题 | 初步回答 | 后续闭口模块 |
|---|---|---|
| 每个模块有哪些错误类型? | 需要按 domain、application、port/infra、protocol、worker/job surface 分层,再按 L3 capability family 细化。错误必须回指 Step 6 object/transition、Step 7 port、Step 8 surface、Step 9 flow 或 Step 10 state。 | R12.3/R12.4 |
| 哪些错误映射到 HTTP / RPC / Event 失败? | 当前 Step 12 不绑定 HTTP/RPC 数字,但要定义 Command rejection、Query surface、Inbound receipt、Outbound outcome、Job result/report、Handoff outcome 的 public safe mapping。 | R12.5~R12.12 |
| 哪些错误可重试、不可重试、需要人工介入? | retryable 只来自 temporary dependency / conflict-after-reload / delayed job or worker;non-retryable 包括 invalid request、domain rejected、forbidden body、idempotency conflict、not-visible;manual 包括 stored result missing、commit unknown、schema/source/marker/mapper 缺口、body leak、consistency defect。 | R12.5~R12.14 |
| 事务失败、并发冲突、重复请求、外部依赖失败如何处理? | 事务失败按 Step 11 rollback/no-rollback 边界处理;version conflict 与 duplicate replay 的精确算法留 Step 13,但 Step 12 要定义 public safe surface 和恢复分类;external failure 不回滚 committed truth。 | R12.5/R12.6/R12.9~R12.12 |
| 哪些异常需要写审计、日志或事件? | accepted truth change、accepted inbound receipt、publication/handoff outcome、job report/checkpoint 可以写正式 side effect;rejected command、invalid request、not-visible query、query degraded 不写 success trace/outbox;具体 observability schema 留 Step 15。 | R12.13/R12.14 |

### 5. Step 12 输出骨架

| 输出块 | 内容 | 计划模块 |
|---|---|---|
| §A opening and source baseline | 必读文档、旧材料排除、SOP 五问、模块计划。 | R12.1/R12.2 |
| §B error layer and type families | domain/application/port/protocol/worker/job 层级、错误类型族、retryability 分类原则。 | R12.3/R12.4 |
| §C Command error and recovery mapping | command invalid/domain rejected/version/idempotency/stored result/commit unknown/dependency unavailable。 | R12.5/R12.6 |
| §D Query surface error and degraded recovery | missing/not-visible/stale/degraded/unavailable/consistency defect、marker copy-only、query no-write。 | R12.7/R12.8 |
| §E Inbound / Outbound / Handoff error mapping | inbound envelope/body/schema,publication outcome,handoff outcome,no rollback,body-free violation。 | R12.9/R12.10 |
| §F Job / operations recovery mapping | job input invalid,partial item failure,checkpoint issue,stored report missing,manual intervention。 | R12.11/R12.12 |
| §G audit / side-effect failure rules | accepted success side effect vs rejected/no-write/no side effect;safe issue/report/outcome refs。 | R12.13/R12.14 |
| §H formal §11 candidate and closure audit | 正式 §11 候选草稿、Step 6~11 error/recovery 闭环审计、Step 13 handoff。 | R12.15/R12.16 |

### 6. Step 12 模块计划

| 模块 | 目标 | 状态 |
|---|---|---|
| R12.1 | 开工与必读文档:先思考 | completed_wait_user_confirm |
| R12.2 | 开工与必读文档:再写入 | completed_wait_user_confirm |
| R12.3 | 错误层级与类型族:先思考 | completed_wait_user_confirm |
| R12.4 | 错误层级与类型族:再写入 | completed_wait_user_confirm |
| R12.5 | Command / accepted / rejected / duplicate 错误恢复:先思考 | completed_wait_user_confirm |
| R12.6 | Command / accepted / rejected / duplicate 错误恢复:再写入 | completed_wait_user_confirm |
| R12.7 | Query surface 与 degraded/unavailable 恢复:先思考 | completed_wait_user_confirm |
| R12.8 | Query surface 与 degraded/unavailable 恢复:再写入 | completed_wait_user_confirm |
| R12.9 | Inbound / Outbound / Handoff 错误恢复:先思考 | completed_wait_user_confirm |
| R12.10 | Inbound / Outbound / Handoff 错误恢复:再写入 | completed_wait_user_confirm |
| R12.11 | Job / operations recovery 错误恢复:先思考 | completed_wait_user_confirm |
| R12.12 | Job / operations recovery 错误恢复:再写入 | completed_wait_user_confirm |
| R12.13 | audit / side-effect failure rules:先思考 | completed_wait_user_confirm |
| R12.14 | audit / side-effect failure rules:再写入 | completed_wait_user_confirm |
| R12.15 | cross-step closure audit 与正式 §11 候选草稿停审:先思考 | completed_wait_user_confirm |
| R12.16 | cross-step closure audit 与正式 §11 候选草稿停审:再写入 | completed_wait_user_confirm |

### 7. L1-governance 框架参考边界

| L1-governance 框架元素 | L3-method-library 采用方式 | 不采用内容 |
|---|---|---|
| Step 状态 / 输入基线 / 分批写入计划 | 保留,用于恢复和门禁。 | 不复制 governance 的输入文件名和完成状态。 |
| SOP 五问回答 | 保留,但用 L3 method asset / formalization / consumption / trace / query / job / handoff 语义回答。 | 不复制 governance 的 process/control/nonconformity 语义。 |
| 错误层级 | 保留 domain/application/port/protocol/worker/jobs 分层思想。 | 不复用 `Governance*Error` enum。 |
| 错误类型表 | 保留表格格式和 retryability/manual 分类。 | 不复制 governance error variants。 |
| Command / Query / Worker / Job 映射 | 保留分 surface 映射。 | 不复制 governance protocol surface 名。 |
| 异常分支 / 恢复口径 / audit 规则 | 保留检测位置、处理方式、是否写 side effect 的结构。 | 不复制 governance audit/outbox/report 领域对象。 |
| cross-step closure audit | 保留 Step 6~11 回填审计和 Step 13 handoff。 | 不把 L1 已闭合事项当成 L3 已闭合。 |

### 8. R12.2 stop-review

| 检查项 | 结果 |
|---|---|
| 是否写入必读文档表与读取状态 | pass |
| 是否写入输入基线与旧材料处理规则 | pass |
| 是否回答 SOP 五问但未展开完整错误类型表 | pass |
| 是否写入 Step 12 输出骨架与模块计划 | pass |
| 是否明确 L1-governance 只作框架参考 | pass |
| 是否未修改正式 `03-详细设计.md` | pass |
| 是否未写完整 error taxonomy / mapping / recovery table、Step 13~16 内容或 implementation code | pass |

next_allowed_action: 等待用户确认后进入 Step 12 `R12.3 错误层级与类型族:先思考`;只允许思考 domain/application/port/protocol/worker/job 的错误层级、错误类型族、retryability/manual 分类原则、Step 6~10 错误来源回指和 `R12.4` 写入边界;不得直接修改正式 `03-详细设计.md`;不得写 Command/Query/Inbound/Outbound/Job/Handoff 的完整错误映射表、异常分支处理表、恢复口径表、Step 13 retry/lock/TTL、Step 14 config key、Step 15 observability schema、Step 16 test case schema 或 implementation code。

---

## R12.3 错误层级与类型族:先思考

### 1. 当前模块目标

`R12.3` 只思考 Step 12 的错误层级、错误类型族、retryability / manual intervention 分类原则、Step 6~10 错误来源回指和 `R12.4` 写入边界。当前模块不写最终错误类型表,不为 Command / Query / Inbound / Outbound / Job / Handoff 生成完整映射矩阵,也不定义 HTTP/RPC 数字、retry 参数、config key、observability schema 或 test case schema。

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm |
| 当前允许 | 思考 domain/application/port/protocol/worker/job 错误层级、错误类型族、retryability/manual 分类、Step 6~10 来源回指和 R12.4 写入计划。 |
| 当前禁止 | 写完整 error taxonomy、public code、Command/Query/Inbound/Outbound/Job/Handoff 全量映射、异常分支处理表、恢复口径表、Step 13 retry/lock/TTL、Step 14 config key、Step 15 observability schema、Step 16 test case schema 或正式 `03-详细设计.md`。 |

### 2. 错误层级边界思考

Step 12 的错误模型需要分层,否则实现侧会把 domain invariant、application orchestration、port failure、public protocol surface、worker receipt 和 job report 混在同一个 enum 或同一个 raw error message 里。当前思考采用六层。

| layer | owner | may express | must not express |
|---|---|---|---|
| domain | `domain` object / policy / transition | invariant violation、invalid transition、policy/guard rejection、body-free boundary violation marker requirement。 | repository error、adapter availability、HTTP status、stored result missing、raw payload/body。 |
| application | application service / query service / job orchestration | request orchestration error、domain rejected mapping、version conflict、idempotency conflict、stored result missing、commit unknown、dependency unavailable、consistency defect。 | raw SQL/HTTP/provider error、transport status、secret/config value、public DTO body。 |
| port / infra boundary | repository / resolver / mapper / publisher / handoff / runtime seam | typed port failure、unavailable、safe outcome、version conflict、mapper/source missing,body-free diagnostic input。 | public marker synthesis from error text、business transition decision、raw provider body。 |
| protocol surface | contracts/API public shell | command rejection shell、query visible/not-visible/stale/degraded/unavailable surface、safe reason/marker refs。 | domain enum internals、repository type names、raw issue body、implementation stack trace。 |
| worker / inbound / outbound | worker receipt / publisher result / handoff result | accepted/duplicate/rejected/delayed/unsupported safe receipt;publication/handoff safe outcome。 | broker ack/offset/topic/retry/dead-letter state、payload body、delivery guarantee truth。 |
| operations job | job request/result/report shell | rejected/accepted/partial/failed/duplicate replayed report;item issue refs;checkpoint/report consistency failure。 | scheduler lease、retry count、report body、metrics body、core truth repair。 |

### 3. 错误类型族候选

本表只是 R12.3 的类型族思考,不是最终 error taxonomy。R12.4 才写可执行的层级表和类型族表;具体 Command / Query / Worker / Job 映射留后续模块。

| type family | likely layer | source examples | retryability thought | later module |
|---|---|---|---|---|
| request / protocol invalid | protocol/application | missing typed ref、invalid envelope、route/body mismatch、page/scope invalid。 | non-retryable until caller fixes request。 | R12.4,R12.5/R12.6 |
| domain invariant / policy rejected | domain/application | invalid transition、forbidden definition/use boundary、relation/package integrity violation、composition rejected。 | non-retryable unless upstream truth/policy state changes。 | R12.4,R12.5/R12.6 |
| body-free boundary violation | domain/application/worker | raw external body、artifact/archive body、payload/report body、raw exception leakage。 | non-retryable;may require quarantine/manual review depending surface。 | R12.4,R12.9/R12.10 |
| not found / safe absent | application/protocol query | requested truth/view/report/trace missing or exact lookup absent。 | usually non-retryable;async read material may become available later。 | R12.4,R12.7/R12.8 |
| not visible / context limited | application/protocol query | read decision denies visibility or safe scope. | non-retryable for same actor/scope;not an internal error. | R12.4,R12.7/R12.8 |
| stale / degraded / unavailable | application/query/job/worker | freshness marker,availability resolver,degraded mapper,adapter availability summary. | retryable only when source says temporary;manual if marker/source missing. | R12.4,R12.7/R12.12 |
| version / optimistic conflict | application/port | expected_version mismatch,stale loaded truth. | retryable after reload;algorithm detail Step 13. | R12.4,R12.5/R12.6 |
| idempotency conflict / duplicate replay issue | application/port/job | same key different digest,stored result missing,wrong stored kind,completed receipt/report unreadable. | conflict non-retryable;missing stored surface manual consistency failure. | R12.4,R12.5/R12.12 |
| commit / UoW unknown | application/port | commit status unknown,rollback failure,atomic boundary uncertainty. | not blind retry;requires idempotency/read-back/reconciliation in Step 13. | R12.4,R12.5/R12.6 |
| dependency / adapter unavailable | port/application/worker/job | resolver unavailable,publisher unavailable,handoff target unavailable,runtime binding unavailable. | retryable only if typed outcome marks temporary/unavailable. | R12.4,R12.9/R12.12 |
| publisher / handoff failed | worker/application | publisher/handoff safe failed outcome after local commit. | retryable/permanent/manual depends on formal outcome,never rolls back truth. | R12.9/R12.10 |
| job partial / checkpoint / report defect | job/application | partial item missing,checkpoint corrupt,stored report missing,report shape impossible. | retry failed subset if formal;manual for consistency defect. | R12.11/R12.12 |
| missing formal source / mapper / marker / port / schema | design blocker/application consistency | degraded marker absent,sidecar/replay surface missing,mapper not defined,port output insufficient. | not retryable;pause design/implementation and close truth source. | R12.4 and final closure audit |

### 4. retryability / manual intervention 分类原则

| classification | meaning | allowed source | forbidden shortcut |
|---|---|---|---|
| non_retryable_by_same_request | caller must change request,actor,scope,typed ref,state or upstream truth before retry. | domain rejection、invalid request、forbidden body、idempotency digest conflict。 | classifying raw adapter exception text as non-retryable without typed outcome。 |
| retry_after_reload | caller/job may reload truth/version and retry if still intended. | optimistic version conflict、stale expected_version。 | retrying mutation blindly without reload/idempotency check。 |
| retry_later_dependency | dependency/source/adapter may become available later. | resolver/publisher/handoff/runtime typed unavailable outcome。 | treating any thrown error as retryable without formal outcome. |
| duplicate_replay | same key and same digest returns stored result/receipt/report. | stored replay surface exists and matches kind. | rerunning command/job/consumer when stored surface missing. |
| degraded_surface | public read/job surface can return safe degraded/unavailable/partial result. | read decision,degraded mapper,availability resolver,material freshness marker,job report issue refs。 | building degraded marker from error string,SQL/HTTP code,route id or fake enum. |
| manual_intervention | automatic retry may corrupt truth or hide design/storage defect. | stored result/report missing,commit unknown,body leak,marker/source missing,serialization defect,consistency defect。 | silently rebuilding from current truth or private index. |
| design_blocker | formal schema/source/mapper/port is missing. | Step 6~11 missing closure,truth source standard. | inventing implementation-local type,marker,port or config key. |

### 5. Step 6~10 错误来源回指思考

R12.4 写入时,每个类型族必须回指至少一个正式来源。没有来源时应进入 blocker,不是补新错误码。

| source step | error source to inspect | R12.4 use |
|---|---|---|
| Step 6 object contracts | object factory/transition guard、`MethodAssetReadDecision`、`MethodAssetDegradedDecision`、inbound intake、event candidate、job assembly、body-boundary helper。 | 提取 domain/application/helper 错误类型族和 marker/source required 条款。 |
| Step 7 port / adapter | repository version conflict、resolver unavailable、degraded mapper、availability resolver、publisher/handoff outcome、runtime availability。 | 提取 port/infra failure families and forbidden raw-error classification。 |
| Step 8 protocol | command rejection shell、query surface、inbound receipt、outbound outcome、job result/report shell。 | 提取 public surface families,但不绑定 HTTP/RPC 数字。 |
| Step 9 flows | accepted/rejected/duplicate/query/inbound/outbound/job/handoff branches;rollback/no-rollback;stored replay. | 提取 detection position and later flow mapping boundaries。 |
| Step 10 state matrix | invalid transition placeholder、terminal/replacement rules、stale/degraded/unavailable/failed/partial states、forbidden transition summary。 | 确保所有 state/error/disposition words enter Step 12 type families。 |
| Step 11 persistence/transaction | query no-write、stored replay no-rerun、publication/handoff no rollback、checkpoint-not-version、body-free redline、missing formal source blocker。 | 提取 consistency failure and recovery classification。 |

### 6. R12.4 写入计划思考

`R12.4` 应写入四组表,但仍不展开 Command/Query/Inbound/Outbound/Job/Handoff 的完整映射矩阵。

| write block | should write | should not write |
|---|---|---|
| error layer table | domain/application/port/protocol/worker/job owner、may express、must not expose。 | final enum code or API status numbers。 |
| type family table | request invalid、domain rejected、body violation、not found、not visible、degraded、version conflict、idempotency conflict、dependency unavailable、consistency defect 等类型族。 | per-flow complete mapping for all 58 Command / 57 Query / worker/job flows。 |
| retryability/manual classification table | non_retryable、retry_after_reload、retry_later_dependency、duplicate_replay、degraded_surface、manual_intervention、design_blocker。 | Step 13 retry count/lock/TTL/scheduler lease。 |
| source-backref / blocker table | Step 6~11 source for each family and missing-source pause rule。 | inventing new mapper/port/marker/schema not present upstream。 |

### 7. watch / blocker 思考

| id | topic | issue | handling in R12.3 | required closure |
|---|---|---|---|---|
| ML-D03-S12-WATCH-001 | degraded marker source | degraded/unavailable/not-visible cannot come from error text or fake private enum. | R12.3 classifies as marker-source required. | R12.4 table;R12.7/R12.8 query mapping. |
| ML-D03-S12-WATCH-002 | stored replay missing | duplicate replay surface missing/wrong kind is not rerunnable. | R12.3 classifies as manual consistency defect. | R12.4 table;R12.5/R12.12;Step 13 algorithm. |
| ML-D03-S12-WATCH-003 | body-free violation | raw external body/report body/raw exception leakage must not become details. | R12.3 classifies as body-free boundary violation. | R12.4 table;R12.9/R12.10;Step 16 tests. |
| ML-D03-S12-WATCH-004 | no rollback external failure | publication/handoff failure after commit must not rollback truth. | R12.3 classifies under publisher/handoff failed. | R12.9/R12.10 and Step 15 audit. |
| ML-D03-S12-WATCH-005 | design blocker vs error | missing schema/port/mapper/source is not a retryable runtime error. | R12.3 classifies as design_blocker. | R12.4 blocker table and final closure audit. |

### 8. R12.3 stop-review

| 检查项 | 结果 |
|---|---|
| 是否只思考错误层级与类型族 | pass |
| 是否覆盖 domain/application/port/protocol/worker/job 六层边界 | pass |
| 是否形成 retryability/manual 分类原则 | pass |
| 是否回指 Step 6~11 错误来源 | pass |
| 是否形成 R12.4 写入计划 | pass |
| 是否未修改正式 `03-详细设计.md` | pass |
| 是否未写完整 Command/Query/Inbound/Outbound/Job/Handoff 映射、恢复矩阵、Step 13~16 内容或 implementation code | pass |

next_allowed_action: 等待用户确认后进入 Step 12 `R12.4 错误层级与类型族:再写入`;只允许写入 error layer table、type family table、retryability/manual classification table、source-backref / blocker table 和 `R12.5` 进入门禁;不得直接修改正式 `03-详细设计.md`;不得写 Command/Query/Inbound/Outbound/Job/Handoff 的完整错误映射表、异常分支处理表、恢复口径表、Step 13 retry/lock/TTL、Step 14 config key、Step 15 observability schema、Step 16 test case schema 或 implementation code。

---

## R12.4 错误层级与类型族:再写入

### 1. 当前模块目标

`R12.4` 将 `R12.3` 的层级与类型族思考落成 Step 12 的基础错误模型框架。当前模块只写 error layer table、type family table、retryability/manual classification table、source-backref / blocker table 和 `R12.5` 进入门禁;不写 Command / Query / Inbound / Outbound / Job / Handoff 的完整映射表。

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm |
| 当前允许 | 写入错误层级表、错误类型族表、retryability/manual 分类表、source-backref / blocker 表和 `R12.5` 进入门禁。 |
| 当前禁止 | 写完整 public code、HTTP/RPC 数字、Command/Query/Inbound/Outbound/Job/Handoff 全量错误映射、异常分支处理表、恢复口径表、Step 13 retry/lock/TTL、Step 14 config key、Step 15 observability schema、Step 16 test case schema、implementation code 或正式 `03-详细设计.md`。 |

### 2. error layer table

| layer | owning crate / boundary | may express | must map through | must not expose / decide |
|---|---|---|---|---|
| domain error | `domain` object / factory / transition / policy object | invariant violation、invalid transition、policy/guard rejection、body-free boundary violation requirement、missing required typed input for factory。 | application service maps into application error / safe rejection / diagnostic surface。 | repository / adapter failure、HTTP/RPC status、stored replay missing、raw body、runtime config、transport detail。 |
| application error | application command/query/job orchestration | invalid orchestration input、domain rejected、version conflict、idempotency conflict、stored result/receipt/report missing、commit unknown、dependency unavailable、consistency defect。 | protocol/query/worker/job surface assembler。 | raw SQL/HTTP/provider error、secret/config value、public DTO body、stack trace、provider payload。 |
| port / infra boundary error | repository / resolver / mapper / publisher / handoff / runtime seam | typed unavailable、version conflict、safe failed outcome、mapper/source missing、serialization defect、runtime availability marker。 | application error or safe outcome summary。 | business transition decision、public marker synthesis from error text、raw provider body、transport retry policy。 |
| protocol surface | contracts/API shell | command rejection shell、query visible/not-visible/stale/degraded/unavailable surface、safe reason refs、marker refs、request invalid shell。 | API adapter may bind to concrete transport later。 | domain enum internals、repository type names、raw issue body、HTTP/RPC number as design truth。 |
| worker / inbound / outbound surface | worker receipt / publication result / handoff result | accepted、duplicate、rejected、delayed、unsupported schema、publication failed/unavailable、handoff failed/unavailable safe outcome。 | worker runtime / publisher / handoff runner。 | broker ack、offset、topic、dead-letter queue name、delivery receipt body、retry counter。 |
| operations job surface | job request/result/report shell | rejected、accepted、partial、failed、duplicate replayed、item issue refs、checkpoint/report consistency failure。 | jobs entry and operations query surface。 | scheduler lease、retry count、report body、metrics body、core truth repair algorithm。 |
| design blocker | design truth source / calibration flow | missing formal source、mapper、port、marker、schema、stored surface or evidence source. | pause current design/implementation and return to owning Step。 | treating the gap as retryable runtime error or inventing implementation-local fallback。 |

### 3. type family table

| type family | primary layer | trigger shape | retryability class | public surface direction | source requirement |
|---|---|---|---|---|---|
| request / protocol invalid | protocol/application | missing typed ref、invalid envelope、route/body mismatch、page/scope invalid、unsupported request shell。 | non_retryable_by_same_request | command/job rejected or invalid request shell;query request rejected before read。 | Step 8 protocol metadata and Step 9 entry validation。 |
| domain invariant / policy rejected | domain/application | invalid transition、guard/policy rejected、relation/package integrity violation、composition rejected。 | non_retryable_by_same_request unless upstream truth changes | command rejection / job item failed with safe reason。 | Step 6 object/guard and Step 10 transition matrix。 |
| body-free boundary violation | domain/application/worker | raw external body、artifact/archive body、event payload body、report body、raw exception detail would cross boundary。 | non_retryable_by_same_request or manual_intervention when persisted leak suspected | rejected / quarantined / body-free violation diagnostic。 | Step 6 body boundary objects;Step 9 body-free flows;Step 11 body-free redline。 |
| not found / safe absent | application/protocol query | exact truth/view/report/trace lookup missing or safe absence from resolver。 | non_retryable_by_same_request unless async material may appear later | not found rejection for command target;query safe absent / empty surface。 | repository read/list semantics and Step 8 query surface。 |
| not visible / context limited | application/protocol query | actor/scope/context lacks read visibility or public body must be hidden。 | non_retryable_by_same_request for same actor/scope | query not-visible/context-limited surface,not raw error。 | read decision / visibility resolver / policy diagnostic source。 |
| stale / degraded / unavailable | application/query/job/worker | formal freshness marker、availability resolver、degraded mapper、adapter availability summary indicates stale/degraded/unavailable。 | degraded_surface or retry_later_dependency;manual if source marker missing | query degraded/unavailable/stale surface;job partial/failed with safe issue refs。 | `MethodAssetDegradedDecision`,availability resolver,degraded mapper,material freshness marker。 |
| version / optimistic conflict | application/port | expected_version mismatch or stale loaded truth during save。 | retry_after_reload | command conflict/retry-after-reload safe surface;job item conflict。 | repository versioned read/save semantics from Step 7/11。 |
| idempotency conflict | application/port | same operation/key with different digest or incompatible operation shape。 | non_retryable_by_same_request | command/job/consumer conflict/rejected surface。 | idempotency guard and operation digest from Step 6/8/9/11。 |
| duplicate replay surface issue | application/port/job | completed duplicate points to missing/wrong/unreadable stored result,receipt,report or checkpoint。 | manual_intervention | consistency failure/degraded unavailable surface;must not rerun mutation。 | stored replay surface from Step 8/11;algorithm detail Step 13。 |
| commit / UoW unknown | application/port | commit/rollback status uncertain around atomic boundary。 | manual_intervention with idempotency/read-back guard | temporarily unavailable / consistency unknown safe surface。 | UnitOfWork boundary from Step 7/11;re-entry detail Step 13。 |
| dependency / adapter unavailable | port/application/worker/job | resolver、publisher、handoff、runtime、repository or adapter unavailable with formal typed outcome。 | retry_later_dependency | delayed/unavailable/failed safe outcome depending surface。 | formal port outcome or availability marker;not raw exception text。 |
| publisher / handoff failed | worker/application | publication/handoff returns safe failed outcome after local commit or target unavailable。 | retry_later_dependency / manual_intervention according to formal outcome | publication/handoff failed/unavailable outcome;accepted truth not rolled back。 | publisher/handoff outcome source from Step 7/10/11。 |
| job partial / checkpoint / report defect | job/application | partial item failure,checkpoint missing/corrupt,stored report missing,report shape impossible。 | degraded_surface / retry_later_dependency / manual_intervention by issue class | job partial/failed/duplicate replay unavailable report。 | job assembly/progress/report/checkpoint refs from Step 6/8/9/10/11。 |
| consistency defect | application/design blocker | impossible state,missing sidecar,missing mapper/source,serialization defect,raw body persisted,private index mismatch。 | manual_intervention or design_blocker | safe internal consistency/degraded surface;must raise handoff to owning Step。 | formal source check;do not synthesize。 |

### 4. retryability / manual classification table

| classification | definition | examples | required handling | forbidden handling |
|---|---|---|---|---|
| non_retryable_by_same_request | Same request will fail until caller changes request,actor,scope,typed ref or upstream truth. | invalid request,domain rejected,forbidden body,idempotency digest conflict,not visible for same actor/scope。 | return safe rejection / not-visible / invalid shell with typed refs and safe reason。 | automatic retry,mutation rerun,raw details exposure。 |
| retry_after_reload | Caller or job may reload current truth/version and retry if still intended. | optimistic version conflict,stale expected_version。 | return conflict with reload/retry guidance;exact retry algorithm deferred to Step 13。 | blind retry without reload or idempotency check。 |
| retry_later_dependency | Dependency or adapter may become available later;retry is allowed only when formal outcome marks it temporary/unavailable. | resolver unavailable,publisher unavailable,handoff target unavailable,runtime adapter unavailable。 | return delayed/unavailable/failed safe surface;preserve no-rollback boundary。 | classify raw exception text as retryable without typed outcome。 |
| duplicate_replay | Same key + same digest must return stored result/receipt/report. | duplicate command,duplicate inbound receipt,duplicate operations job report。 | read stored surface;if absent go to manual consistency failure。 | rerun command/job/consumer body。 |
| degraded_surface | Operation may complete as visible safe degraded/unavailable/partial surface. | query stale/degraded,partial job item failure,material unavailable,progress partial。 | copy formal degraded marker / issue refs / safe diagnostic。 | synthesize marker from route,error text,SQL/HTTP code or fake private enum。 |
| manual_intervention | Automatic retry may corrupt truth or hide design/storage defect. | stored result/report missing,commit unknown,serialization defect,body leak,marker/source missing,checkpoint corrupt。 | return safe consistency/manual surface and require operator/design closure. | silently rebuild from current truth,private index or raw body。 |
| design_blocker | Formal design lacks source/mapper/port/schema needed to classify or recover. | missing degraded mapper,missing stored replay schema,missing handoff outcome enum,missing marker source。 | pause and update owning design truth source before implementation. | add implementation-local enum/port/config key or fake-only rule。 |

### 5. source-backref / blocker table

| type family | required backref | missing-source result |
|---|---|---|
| request / protocol invalid | Step 8 request/protocol shell and Step 9 entry validation branch. | If request shape not defined, pause Step 8/9 rather than invent handler-local validation. |
| domain invariant / policy rejected | Step 6 object/guard/factory plus Step 10 illegal transition / policy state. | If invariant source is absent, return to Step 6/10;do not create ad hoc domain error. |
| body-free boundary violation | Step 6 `ExternalBodyBoundaryRule` / guard objects,Step 9 body-free branch,Step 11 body-free persistence redline. | If forbidden body kind/value domain is absent, pause;do not save raw body to diagnose. |
| not found / safe absent | Step 7 repository/resolver read semantics,Step 8 query/command surface. | If absence semantics missing, mark blocker;do not choose 404/empty/degraded ad hoc. |
| not visible / context limited | Step 6 read/degraded helper,Step 7 read resolver/mapper,Step 8 query surface. | If marker/source missing, pause;do not infer from permission bool or route. |
| stale / degraded / unavailable | Step 6 `MethodAssetDegradedDecision`,Step 7 availability/degraded mapper,Step 10 marker-source rules. | If marker/mapper missing, classify as design_blocker,not runtime retryable. |
| version / optimistic conflict | Step 7 repository expected_version semantics,Step 11 UoW/version table. | If version source missing, return to Step 7/11;do not use checkpoint/cursor as version. |
| idempotency conflict | Step 6 idempotency guard,Step 8 stored surface,Step 9 duplicate branch,Step 11 stored replay persistence. | If digest/result pairing missing, blocker;do not rerun or compare raw body. |
| duplicate replay surface issue | Step 8 stored result/receipt/report shell and Step 11 stored replay no-rerun rule. | Missing stored surface -> manual consistency failure;do not reconstruct from current truth. |
| commit / UoW unknown | Step 7 UoW port,Step 11 atomic boundary. | If commit status semantics missing, Step 13 blocker;do not blind retry mutation. |
| dependency / adapter unavailable | Step 7 resolver/publisher/handoff/runtime outcome or availability summary. | Raw adapter exception alone cannot classify retryability;need typed outcome. |
| publisher / handoff failed | Step 7 outcome enum/summary,Step 10 publication/handoff state,Step 11 no-rollback rule. | Missing outcome taxonomy -> design blocker;do not rollback accepted truth. |
| job partial / checkpoint / report defect | Step 6 job assembly/progress,Step 8 job result/report,Step 10 job state,Step 11 checkpoint/report rule. | Missing report/checkpoint surface -> manual consistency failure or Step 13 blocker. |
| consistency defect | Step 6~11 source closure and design standard. | Pause,record blocker,and return to owning Step;do not hide as dependency unavailable. |

### 5.1 `commit-02-b` current-boundary error closure supplement

当前 implementation boundary `commit-02-b` 只允许把 `domain error` layer 收窄为 pure domain foundation。实现端当前只允许在 `crates/domain/src/errors.rs` 落码以下 exact error kind:

| current-boundary domain error kind | source backref | current implementation rule |
|---|---|---|
| `MissingRequiredTypedInput` | Step 6 policy shell required typed carrier | 只用于 pure domain constructor / helper 缺少 formal typed carrier;不得包装 DTO、route、config 或 adapter raw input。 |
| `InvariantViolation` | Step 6 object invariant | 只用于 pure domain invariant failure;不得替代 version conflict、stored replay、checkpoint 或 dependency failure。 |
| `InvalidTransition` | Step 10 current-boundary judgement transition | 只用于 allowed judgement-state illegal transition;不得扩成 business truth lifecycle or runtime state conflict。 |
| `PolicyRejected` | Step 6 policy/guard rejection + Step 10 judgement branch | 只用于 current policy shell reject branch;safe reason 复制 formal marker。 |
| `BodyFreeBoundaryViolation` | Step 6 `ExternalBodyBoundaryRule` + Step 10 no-body judgement | 只用于 raw body would cross boundary;不得保存 raw body 作为错误详情。 |

以下错误家族在 `commit-02-b` 明确后移:

| deferred error family | defer reason |
|---|---|
| version / optimistic conflict、idempotency conflict、duplicate replay surface issue、commit / UoW unknown | application / replay / UoW owning boundary 在 `commit-02-c`+。 |
| dependency / adapter unavailable、publisher / handoff failed | port / infra / worker owning boundary later。 |
| not found / safe absent、not visible / context limited、stale / degraded / unavailable | query / material / mapper owning boundary later。 |
| job partial / checkpoint / report defect、consistency defect | jobs / replay / later consistency closure。 |

### 6. R12.4 watch / blocker closure

| id | closure in R12.4 | remaining handoff |
|---|---|---|
| ML-D03-S12-WATCH-001 degraded marker source | `stale / degraded / unavailable` and `not visible / context limited` families require formal mapper/resolver/marker source. | R12.7/R12.8 write query surface mapping;Step 15 observes safe diagnostics. |
| ML-D03-S12-WATCH-002 stored replay missing | `duplicate replay surface issue` is manual consistency failure;duplicate must not rerun mutation. | R12.5/R12.12 surface mapping;Step 13 replay algorithm. |
| ML-D03-S12-WATCH-003 body-free violation | `body-free boundary violation` and source-backref table require no raw body persistence/exposure. | R12.9/R12.10 and Step 16 no-body tests. |
| ML-D03-S12-WATCH-004 no rollback external failure | `publisher / handoff failed` stays separate from committed truth and maps by formal outcome. | R12.9/R12.10 and Step 15 audit. |
| ML-D03-S12-WATCH-005 design blocker vs error | `design_blocker` is separate classification,not retryable runtime error. | Final closure audit and implementation gate. |

### 7. R12.4 stop-review

| 检查项 | 结果 |
|---|---|
| 是否写入 error layer table | pass |
| 是否写入 type family table | pass |
| 是否写入 retryability/manual classification table | pass |
| 是否写入 source-backref / blocker table | pass |
| 是否未展开 Command/Query/Inbound/Outbound/Job/Handoff 完整映射 | pass |
| 是否未修改正式 `03-详细设计.md` | pass |
| 是否未写 Step 13/14/15/16 内容、test schema 或 implementation code | pass |

next_allowed_action: 等待用户确认后进入 Step 12 `R12.5 Command / accepted / rejected / duplicate 错误恢复:先思考`;只允许思考 Command request invalid、domain rejected、version conflict、idempotency conflict、duplicate stored replay、stored result missing、commit unknown、dependency unavailable 的错误恢复边界和 `R12.6` 写入计划;不得直接修改正式 `03-详细设计.md`;不得写 Query、Inbound、Outbound、Handoff、Job 的完整错误映射表、完整异常分支处理表、完整恢复口径表、Step 13 retry/lock/TTL、Step 14 config key、Step 15 observability schema、Step 16 test case schema 或 implementation code。

---

## R12.5 Command / accepted / rejected / duplicate 错误恢复:先思考

### 1. 当前模块目标

`R12.5` 只思考 Command 分支的错误恢复边界,覆盖 request invalid、domain rejected、version conflict、idempotency conflict、duplicate stored replay、stored result missing、commit unknown 和 dependency unavailable。当前模块不写最终 Command 映射表,不进入 Query / Inbound / Outbound / Handoff / Job,也不写 Step 13 的 reserve/complete、lock、TTL、retry 或 replay serialization 算法。

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm |
| 当前允许 | 思考 Command accepted/rejected/duplicate 的错误分类、检测位置、事务边界、stored replay 边界、safe surface 和 R12.6 写入计划。 |
| 当前禁止 | 写完整 Command 错误映射表、完整异常分支处理表、完整恢复口径表、Query/Inbound/Outbound/Handoff/Job 映射、Step 13 retry/lock/TTL/idempotency 算法、Step 14 config key、Step 15 observability schema、Step 16 test case schema、implementation code 或正式 `03-详细设计.md`。 |

### 2. Command 分支边界思考

Command 错误恢复必须围绕 Step 9 shared command flow 与 Step 11 transaction boundary 展开。关键不是先定义错误码,而是分清错误发生在 accepted mutation 之前、accepted UoW 内、commit 不确定、duplicate replay 或 post-commit side-effect 之后。

| branch | detection point | expected recovery thought | must not do |
|---|---|---|---|
| request invalid before reserve | protocol / application entry validates metadata、typed refs、scope、actor、idempotency key。 | return safe invalid request rejection;no UoW, no stored accepted result, no event candidate。 | create domain truth,save stored accepted result,append success audit。 |
| duplicate same key + same digest | idempotency guard sees completed or replayable stored surface. | read stored result and return duplicate replay surface;no mutation rerun。 | rerun command,refresh truth,republish candidate,derive result from current truth。 |
| duplicate same key + different digest | idempotency guard detects digest mismatch. | return idempotency conflict;usually non_retryable_by_same_request。 | overwrite prior result,merge requests,compare raw body instead of digest。 |
| domain / policy rejected before accepted save | domain factory/transition/policy guard rejects typed inputs。 | assemble safe rejection;save rejected stored surface only if Step 8/11 marks it replayable。 | partially save truth,emit accepted event candidate,write success trace。 |
| version conflict during save | repository save expected_version mismatch。 | rollback accepted UoW;return conflict/retry-after-reload safe surface。 | blind retry,convert checkpoint/cursor to version,emit event candidate。 |
| dependency unavailable before accepted UoW | required resolver/repository/mapper unavailable before mutation can be safely built。 | return dependency unavailable or retry-later safe surface;no accepted truth。 | synthesize marker from raw error,store provider body,continue with partial accepted truth。 |
| accepted UoW failure before commit | save/stored result/candidate atomic boundary fails before commit。 | rollback;return safe failure/unavailable surface;no accepted replay/candidate should exist。 | claim accepted,leave stored accepted result without truth,publish/handoff。 |
| commit status unknown | UoW commit returns unknown after possible durable write。 | surface as manual/consistency unknown;Step 13 must define idempotency/read-back recovery。 | blind retry mutation,delete partial data,return accepted without stored surface proof。 |
| stored accepted result missing / wrong kind | duplicate path or consistency check finds completed guard but missing/wrong stored result。 | classify as manual consistency failure;do not reconstruct from current truth。 | rerun command,read current truth to fake original result,change stored kind locally。 |
| post-commit publication/handoff failure | accepted truth already committed;publisher/handoff later fails。 | not a Command rollback;handled by outbound/handoff modules as safe outcome。 | roll back accepted truth or convert accepted command to rejected。 |

### 3. Command 错误族思考

| error family | Command-specific interpretation | retryability thought | R12.6 output shape |
|---|---|---|---|
| request / protocol invalid | command shell lacks typed metadata/ref/scope/actor/idempotency key or violates request shape。 | non_retryable_by_same_request。 | Command invalid request row with no UoW/no stored accepted result。 |
| domain invariant / policy rejected | object factory,transition,guard,policy diagnostic rejects accepted mutation。 | non_retryable unless upstream state/policy changes。 | Domain rejected row with safe reason/diagnostic refs and replayable rejection rule。 |
| body-free boundary violation | command attempts to include raw external body,artifact/archive body,report body or raw exception detail。 | non_retryable;manual if leak already persisted。 | Body violation row with reject/quarantine and no raw details。 |
| version / optimistic conflict | expected_version mismatch for mutable truth/support/material save。 | retry_after_reload。 | Version conflict row,rollback and reload guidance;Step 13 owns exact retry protocol。 |
| idempotency conflict | same command family/key has different digest or incompatible operation。 | non_retryable_by_same_request。 | Idempotency conflict row,stored result not overwritten。 |
| duplicate replay | same command family/key/digest has stored accepted/rejected result。 | duplicate_replay。 | Duplicate row: read stored surface,do not rerun mutation。 |
| stored replay missing | completed idempotency/stored result pointer missing,wrong kind,unreadable。 | manual_intervention。 | Consistency failure row: no rerun/no reconstruction。 |
| dependency unavailable | repository/resolver/mapper/runtime dependency unavailable before safe accepted mutation。 | retry_later_dependency only from formal outcome。 | Dependency unavailable row;no accepted truth if pre-commit。 |
| commit / UoW unknown | accepted UoW commit/rollback status unknown。 | manual_intervention + Step 13 read-back。 | Commit unknown row with no blind retry。 |
| missing formal source / marker / port | command flow needs marker/source/stored surface that upstream Step has not defined。 | design_blocker。 | Blocker row;pause rather than synthesize。 |

### 4. accepted / rejected / duplicate side-effect 思考

| side-effect | accepted branch | rejected branch | duplicate branch |
|---|---|---|---|
| truth save | allowed inside accepted UoW only after all required sources loaded。 | not allowed。 | not allowed。 |
| stored result | accepted result must commit with accepted truth;replayable rejected result may commit with rejection decision if formally required。 | only safe rejected surface if defined;not success result。 | read existing stored result/receipt;never overwrite except Step 13-defined repair,if any。 |
| event candidate | allowed only from committed accepted branch and body-free effect refs。 | not allowed except formally defined rejection event,currently not assumed。 | not created。 |
| audit / trace | accepted success trace/audit may be written if Step 9/11 source exists。 | failure audit/log detail deferred to Step 15;must not masquerade as business success。 | not appended merely because duplicate was observed。 |
| publisher/handoff | not inside accepted UoW;post-commit separate boundary。 | not called。 | not called。 |
| job body / repair | not run as part of command error recovery。 | not run。 | not run。 |

### 5. R12.6 写入计划思考

`R12.6` 应写入 Command-focused tables,但仍不进入 Query / Inbound / Outbound / Handoff / Job 全量映射。

| write block | should write | should not write |
|---|---|---|
| Command branch error table | request invalid、domain rejected、version conflict、idempotency conflict、duplicate replay、stored result missing、dependency unavailable、commit unknown。 | all 58 Command flow rows or per-DTO code list。 |
| Command transaction / side-effect table | no UoW,rollback,accepted UoW,rejected stored surface,duplicate no-rerun,post-commit no-rollback boundary。 | Step 13 reserve/complete algorithm,lock,TTL,retry count。 |
| Command safe surface table | public safe rejection/conflict/unavailable/consistency unknown categories with required typed refs/markers。 | HTTP/RPC numeric status or localized messages。 |
| Command blocker / handoff table | missing marker/source/stored surface/design schema -> blocker or Step 13/15 handoff。 | implementation-local fallback or fake-only rule。 |

### 6. watch / blocker 思考

| id | topic | issue | handling in R12.5 | required closure |
|---|---|---|---|---|
| ML-D03-S12-CMD-WATCH-001 | rejected stored surface | Some rejected command branches may need replayable stored surface, but only if Step 8/11 defines it. | R12.5 says save rejected surface only when formally required. | R12.6 row;Step 13 replay detail. |
| ML-D03-S12-CMD-WATCH-002 | stored accepted result missing | Duplicate accepted replay cannot reconstruct from current truth. | R12.5 classifies as manual consistency failure. | R12.6 table;Step 13 consistency failure path. |
| ML-D03-S12-CMD-WATCH-003 | commit unknown | Commit unknown cannot be treated as retryable by default. | R12.5 requires read-back/idempotency guard later. | Step 13 algorithm. |
| ML-D03-S12-CMD-WATCH-004 | post-commit failure rollback | Publisher/handoff failure is not Command rollback. | R12.5 keeps it outside command rollback. | R12.9/R12.10 and Step 15 audit. |
| ML-D03-S12-CMD-WATCH-005 | missing marker/source | Command cannot synthesize domain/policy/degraded/unavailable marker from raw error. | R12.5 classifies as design blocker. | Return to owning Step if found. |

### 7. R12.5 stop-review

| 检查项 | 结果 |
|---|---|
| 是否只思考 Command accepted/rejected/duplicate 错误恢复 | pass |
| 是否覆盖 request invalid、domain rejected、version conflict、idempotency conflict、duplicate replay、stored result missing、commit unknown、dependency unavailable | pass |
| 是否明确 accepted/rejected/duplicate side-effect 边界 | pass |
| 是否形成 R12.6 写入计划 | pass |
| 是否未修改正式 `03-详细设计.md` | pass |
| 是否未写 Query/Inbound/Outbound/Handoff/Job 完整映射、Step 13~16 内容或 implementation code | pass |

next_allowed_action: 等待用户确认后进入 Step 12 `R12.6 Command / accepted / rejected / duplicate 错误恢复:再写入`;只允许写入 Command branch error table、Command transaction / side-effect table、Command safe surface table、Command blocker / handoff table 和 `R12.7` 进入门禁;不得直接修改正式 `03-详细设计.md`;不得写 Query、Inbound、Outbound、Handoff、Job 的完整错误映射表、完整异常分支处理表、完整恢复口径表、Step 13 retry/lock/TTL/idempotency 算法、Step 14 config key、Step 15 observability schema、Step 16 test case schema 或 implementation code。

---

## R12.6 Command / accepted / rejected / duplicate 错误恢复:再写入

### 1. 当前模块目标

`R12.6` 将 `R12.5` 的 Command 分支思考落成可审计表格。当前模块只写 Command branch error table、Command transaction / side-effect table、Command safe surface table、Command blocker / handoff table 和 `R12.7` 进入门禁;不写 Query / Inbound / Outbound / Handoff / Job 的完整错误映射,不写 Step 13 幂等算法,不修改正式 `03-详细设计.md`。

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm |
| 当前允许 | 写入 Command invalid、rejected、conflict、duplicate、stored replay missing、dependency unavailable、commit unknown、post-commit side-effect 的错误恢复表。 |
| 当前禁止 | 写 58 个 Command 的逐 DTO 错误码、HTTP/RPC 数字、Query/Inbound/Outbound/Handoff/Job 错误表、Step 13 reserve/complete/lock/TTL/retry/idempotency 算法、Step 14 config key、Step 15 observability schema、Step 16 test case schema、implementation code 或正式 `03-详细设计.md`。 |

### 2. Command branch error table

所有 Command flow 复用 Step 9 shared command transaction template:entry shell -> operation context -> idempotency reserve -> versioned load -> Step 6 domain/policy -> UoW save -> stored result -> commit。下表写 family 级错误恢复,不替代每个 Command 的业务 invariant。

| branch / error family | trigger / detection point | recovery surface | transaction rule | forbidden recovery |
|---|---|---|---|---|
| command shell invalid | command envelope、metadata、actor/source、typed ref、scope、idempotency input 或 request intent 形状不合法。 | safe invalid request rejection;caller must correct request。 | no business UoW;no accepted stored result;no event candidate。 | load truth,create domain object,save rejection as accepted result,expose raw request body。 |
| entry/runtime unavailable before service | api entry or application facade cannot obtain formal runtime assembly / adapter availability summary required to enter command service。 | safe unavailable / blocked command surface copied from formal availability source。 | no business UoW;no idempotency completion unless formal guard permits safe rejected/unavailable replay。 | call concrete adapter directly,open repository transaction in entry,synthetically create availability marker。 |
| duplicate same digest | idempotency guard finds same command family/key/digest with stored accepted or replayable rejected surface。 | duplicate replay surface copied from stored result。 | no mutation UoW;read-only replay path。 | rerun command,refresh current truth,rebuild response from latest state,append audit/event because duplicate was observed。 |
| duplicate different digest | same command family/key appears with different request digest or incompatible operation identity。 | idempotency conflict surface。 | idempotency guard / minimal decision boundary only;prior stored result remains immutable。 | overwrite stored result,merge requests,compare raw body,continue to mutation。 |
| required formal source missing | Command flow needs formal source/marker/mapper/port/stored surface that Step 6~11 does not define。 | design blocker,not runtime recovery。 | stop before implementation;no UoW。 | invent placeholder ref,derive from string/error text,add fake-only map,continue implementation。 |
| domain / policy rejected | Step 6 factory、transition、policy diagnostic or boundary guard rejects typed inputs before accepted mutation。 | safe rejected result with formal safe reason / diagnostic / marker source。 | no accepted mutation UoW;replayable rejected surface may be stored only when Step 8/11 define it。 | save partial truth,emit accepted candidate,expose raw diagnostic body,turn rejection into infrastructure failure。 |
| body-free violation | command attempts to carry external body、artifact body、provider payload、raw log、report body、marketplace transaction or raw exception details across boundary。 | safe body-boundary rejection or design blocker if source is unclear。 | no accepted truth;no raw body persistence。 | quarantine raw body in command store,store excerpt for debugging,derive summary from forbidden body。 |
| version / optimistic conflict | versioned save sees expected_version mismatch after formal load。 | conflict / reload-required safe surface。 | rollback accepted UoW;no accepted stored result and no event candidate from failed attempt。 | blind retry inside Step 12,relabel checkpoint/cursor as version,return accepted with stale save failure hidden。 |
| dependency unavailable during pre-mutation load | repository/resolver/mapper unavailable before Step 6 object can be safely built。 | dependency unavailable / retry-later surface copied from formal dependency or availability result。 | no accepted truth;idempotency completion only if formal rejected/unavailable replay rule exists。 | continue with partial truth,synthesize marker from adapter error,store raw exception/provider body。 |
| accepted UoW save failure before commit | truth/support/material save、history/trace/audit/lineage append、event candidate assembly or stored accepted result save fails before commit。 | safe failure/unavailable surface;accepted not proven。 | rollback leaves no accepted replay surface and no event candidate。 | claim accepted,leave stored accepted result without truth,publish or handoff。 |
| commit status unknown | UnitOfWork commit returns unknown after possible durable write。 | consistency unknown / manual intervention surface;Step 13 must define read-back / replay guard。 | no blind retry in Step 12;preserve idempotency evidence if formal source exists。 | retry mutation blindly,delete partial rows,return accepted without stored surface proof。 |
| stored replay missing / wrong kind | duplicate path or consistency check finds completed idempotency but stored result is missing,wrong kind or unreadable。 | manual consistency failure surface。 | no mutation UoW;no reconstruction from current truth。 | rerun command,read current truth to fake original response,change stored kind locally。 |
| post-commit publication / handoff failure | accepted truth and stored result committed,then publisher/handoff/observability side effect fails。 | outbound / handoff / observability safe outcome handled by later modules。 | no command rollback;accepted command remains accepted。 | roll back accepted truth,convert accepted command to rejected,republish from current truth without candidate source。 |

### 3. Command transaction / side-effect table

| stage | allowed writes / side effects | rollback / no-rollback rule | handoff |
|---|---|---|---|
| entry validation before idempotency | none;only read formal entry/runtime availability and validate command shell。 | invalid or unavailable returns safe surface without business UoW。 | Step 14 later binds config/runtime source;Step 16 tests entry facade-only。 |
| idempotency reserve / duplicate check | idempotency guard decision and stored result lookup only。 | duplicate replay performs no mutation;conflict does not overwrite prior result。 | Step 13 defines reserve/complete serialization and replay shape。 |
| domain / policy rejection before accepted mutation | safe rejection/diagnostic surface;replayable rejected stored surface only if formal schema exists。 | rejection does not create accepted truth or event candidate。 | Step 12 final audit checks rejected surface source;Step 13 defines replay details if needed。 |
| accepted mutation UoW | versioned truth/support/material save,body-free history/trace/audit/lineage append,event candidate refs,stored accepted result。 | all commit together or rollback together;stored accepted result must not outlive rolled-back truth。 | Step 11 owns atomic boundary;Step 13 owns retry/re-entry algorithm。 |
| accepted response assembly | response/effect summary copies stored result and body-free candidate refs。 | response assembly failure after commit is consistency / observability issue,not truth rollback。 | Step 15 owns observable effect and evidence surface。 |
| post-commit outbound / handoff | publisher/handoff may record separate safe outcome from committed candidate/report/source refs。 | external failure never rolls back accepted truth/candidate。 | R12.9/R12.10 and Step 15 define failure outcome details。 |
| duplicate replay | read stored accepted/rejected result;return duplicate surface。 | no UoW mutation,no new event candidate,no audit append solely for duplicate。 | Step 13 defines stored replay serialization and missing-result consistency failure。 |
| commit unknown | preserve formal guard / commit evidence when available;return consistency unknown。 | no blind retry and no delete/repair inside Step 12。 | Step 13 defines read-back/retry guard;Step 15 defines audit/reporting。 |

### 4. Command safe surface table

| safe surface family | required source | exposed public content | disposition | forbidden content |
|---|---|---|---|---|
| invalid_request | protocol shell validation or application request validator。 | safe reason category,field/ref identifier only if formal and non-sensitive。 | non_retryable_by_same_request。 | raw request body,transport payload,stack trace。 |
| rejected_domain_policy | Step 6 domain/policy diagnostic,guard result or safe marker。 | rejected outcome with diagnostic/marker refs or safe reason refs。 | non_retryable unless upstream truth/policy changes。 | raw rule body,provider payload,private policy trace。 |
| body_boundary_rejected | body-boundary diagnostic or external body rule summary。 | body-free rejection summary and boundary ref。 | non_retryable;manual if leak already persisted。 | body excerpt,archive content,provider payload,marketplace transaction。 |
| version_conflict | repository expected_version conflict from formal versioned save。 | conflict/reload-required surface with involved typed ref/version ref if safe。 | retry_after_reload;algorithm later。 | automatic blind retry,checkpoint as version。 |
| idempotency_conflict | idempotency guard digest/operation mismatch。 | conflict surface identifying operation family/key by safe ref or digest ref。 | non_retryable_by_same_request。 | original raw body comparison,prior result overwrite detail。 |
| duplicate_replay | stored accepted or replayable rejected result。 | duplicate flag plus copied stored result/effect/rejection shell。 | no_retry_needed。 | regenerated result,current truth snapshot,new side effect。 |
| dependency_unavailable | repository/resolver/mapper/runtime availability output。 | unavailable/blocked surface with safe dependency marker/ref。 | retry_later only when source says temporary。 | raw exception,endpoint URL,secret/config value。 |
| consistency_unknown | commit unknown or atomic boundary uncertainty。 | manual consistency / unknown outcome surface with safe operation refs。 | manual_intervention plus Step 13 read-back。 | accepted claim without proof,destructive cleanup hint。 |
| stored_replay_consistency_failure | completed idempotency points to missing/wrong/unreadable stored result。 | manual consistency failure surface。 | manual_intervention。 | reconstructed result from current truth,private storage error body。 |
| design_blocker | missing formal schema/marker/mapper/port/source。 | implementation stop reason in calibration/watch ledger,not runtime DTO。 | stop_design。 | synthetic marker,placeholder version,implementation-local workaround。 |

### 5. Command blocker / handoff table

| id | topic | current R12.6 decision | owner / next closure |
|---|---|---|---|
| ML-D03-S12-CMD-HANDOFF-001 | replayable rejected surface | Store rejected result only when Step 8/11/13 define formal replay surface and read-back semantics。 | Step 13 replay serialization;final Step 12 audit watches schema gap。 |
| ML-D03-S12-CMD-HANDOFF-002 | accepted stored result missing | Missing/wrong stored result on duplicate is manual consistency failure;do not reconstruct。 | Step 13 defines consistency failure path;Step 16 verifies no-rerun。 |
| ML-D03-S12-CMD-HANDOFF-003 | commit unknown | Step 12 only classifies surface;no blind retry or cleanup algorithm。 | Step 13 owns read-back/idempotency recovery;Step 15 owns reporting/audit。 |
| ML-D03-S12-CMD-HANDOFF-004 | dependency unavailable marker | Command may only copy formal availability/dependency marker。 | Step 7/14 must provide source;missing source is design blocker。 |
| ML-D03-S12-CMD-HANDOFF-005 | domain/policy safe reason source | Rejection must copy formal diagnostic/marker/ref source。 | Step 6/7/8/9 owning object/port/protocol;missing source pauses implementation。 |
| ML-D03-S12-CMD-HANDOFF-006 | post-commit publication/handoff failure | Not a Command rollback;handled as outbound/handoff safe outcome。 | R12.9/R12.10 and Step 15 observability/evidence。 |
| ML-D03-S12-CMD-HANDOFF-007 | command audit/trace failure | Audit/trace append inside accepted UoW follows Step 11 atomicity;post-commit audit failure is separate side-effect。 | R12.13/R12.14 side-effect audit rules;Step 15 schema。 |
| ML-D03-S12-CMD-HANDOFF-008 | exact retry/re-entry knobs | retry count,lock,TTL,lease and reserve/complete are intentionally absent here。 | Step 13 only。 |

### 6. R12.6 stop-review

| 检查项 | 结果 |
|---|---|
| 是否写入 Command branch error table | pass |
| 是否写入 Command transaction / side-effect table | pass |
| 是否写入 Command safe surface table | pass |
| 是否写入 Command blocker / handoff table | pass |
| 是否未展开 Query/Inbound/Outbound/Handoff/Job 完整映射 | pass |
| 是否未写 Step 13 retry/lock/TTL/idempotency 算法 | pass |
| 是否未修改正式 `03-详细设计.md` | pass |
| 是否未写 Step 14/15/16 内容、test schema 或 implementation code | pass |

next_allowed_action: 等待用户确认后进入 Step 12 `R12.7 Query surface 与 degraded/unavailable 恢复:先思考`;只允许思考 Query invalid selector、not-visible、empty、stale、degraded、unavailable、partial page、material/source missing、safe marker 来源和 `R12.8` 写入计划;不得直接修改正式 `03-详细设计.md`;不得写 Inbound、Outbound、Handoff、Job 的完整错误映射表、完整异常分支处理表、完整恢复口径表、Step 13 retry/lock/TTL/idempotency 算法、Step 14 config key、Step 15 observability schema、Step 16 test case schema 或 implementation code。

---

## R12.7 Query surface 与 degraded/unavailable 恢复:先思考

### 1. 当前模块目标

`R12.7` 只思考 Query 分支的错误恢复边界,覆盖 invalid selector、safe absent / empty、not-visible、stale visible、degraded、unavailable、partial page、material/source missing、safe marker 来源和 `R12.8` 写入计划。当前模块不写最终 Query 映射表,不进入 Inbound / Outbound / Handoff / Job,也不写 Step 13 page/retry/cursor 算法或 Step 15 观测 schema。

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm |
| 当前允许 | 思考 Query read disposition、degraded decision、safe surface、marker-source、no-write 恢复边界和 R12.8 写入计划。 |
| 当前禁止 | 写完整 Query branch error table、完整 Query surface table、Inbound/Outbound/Handoff/Job 映射、Step 13 cursor/retry/idempotency 算法、Step 14 config key、Step 15 observability schema、Step 16 test case schema、implementation code 或正式 `03-详细设计.md`。 |

### 2. Query 基础边界思考

Query 错误恢复与 Command 不同。Query 没有 accepted mutation,也没有 rollback/replay 语义。它的核心是:在 no-write 前提下,把 read resolver、repository、availability resolver、degraded mapper 和 page helper 输出复制成 safe public surface。

| boundary | R12.7 thought | must not do |
|---|---|---|
| no-write | Query read 没有写 UoW,也没有 rollback state。错误恢复只能返回 safe read surface。 | save/append/repair/refresh/publish/start job/store query replay。 |
| safe absence | safe absent / empty 来自 repository safe absence 或 read resolver。 | 暴露 raw store miss、raw selector、URL/path、外部 id 或存在性差异。 |
| not-visible | not-visible 来自 policy/boundary marker 或 read resolver output。 | 从 auth text、token claim、route、UI state 拼 marker。 |
| stale visible | stale 来自 loaded material/view marker、builder output 或 refresh output。 | 用 timestamp、cache hit、page cursor、private flag 推断 freshness。 |
| degraded / partial | degraded 来自 `MethodAssetDegradedDecisionMapperPort`、partiality marker 或 safe diagnostic。 | 用 exception text、stack trace、debug dump、provider body 推断 degraded。 |
| unavailable | unavailable 来自 availability resolver、adapter availability summary 或 infra safe diagnostic。 | 暴露 raw IO error、HTTP/SQL code、endpoint、secret、provider body。 |
| page cursor | cursor 来自 page/version helper;只表达翻页位置。 | 把 cursor 当 optimistic version、freshness marker 或 checkpoint。 |
| material/source missing | missing linked source/material 只能映射为 safe absent 或 degraded/watch。 | 现场创建 material、刷新 view、扫描外部源或降级成空成功。 |

### 3. Query read disposition 思考

`MethodAssetReadDecision` 是 Query surface 的统一 disposition owner。R12.8 应围绕这些 disposition 写表,但本模块只先确认边界。

| disposition | trigger thought | safe recovery thought | key source |
|---|---|---|---|
| `invalid_selector` | query envelope、selector family、typed ref、page request 或 scope 不合法。 | safe invalid query surface;no repository read unless validator says safe。 | protocol validator / read resolver precheck。 |
| `found` | typed selector 对应 truth/view/material/progress/page 可安全读取。 | assemble safe public view/page。 | repository / resolver / builder output。 |
| `safe_absent_empty` | exact selector or list page 可安全公开为空。 | return absent/empty surface without leaking raw miss。 | repository safe absence / read resolver。 |
| `not_visible` | visibility、boundary、context policy 限制当前 read context。 | return not-visible surface;do not reveal whether hidden truth exists。 | policy/boundary marker / read resolver output。 |
| `stale_visible` | view/material 可读但 freshness marker stale。 | return stale-visible surface with copied marker。 | material/view freshness marker / builder output。 |
| `degraded` | material invalid、partial、context-limited or linked refs missing but safe surface exists。 | return degraded surface with copied degraded decision。 | degraded mapper / safe diagnostic。 |
| `unavailable` | resolver、availability source、adapter or material store unavailable。 | return unavailable surface with copied marker。 | availability resolver / adapter summary / infra diagnostic。 |
| `consistency_defect` | Query needs formal marker/source/page helper but no source exists。 | design blocker or manual consistency surface,not synthesized runtime success。 | owning Step 6/7/8/9/11 source must be fixed。 |

### 4. Partial page / linked material 思考

List Query 的风险最大:page refs 可能部分缺失、linked material 不一致、某些 item 不可见或 degraded。R12.8 应单独写 partial page 思路,不能让实现侧用“跳过 item”来隐藏问题。

| scenario | R12.7 thought | R12.8 handling direction |
|---|---|---|
| page empty by selector | safe empty,not error。 | empty surface row;cursor/page info still formal if present。 |
| listed item missing | partial/degraded if page source expected the item;safe absent only when resolver says absence is safe。 | partial page / degraded item row。 |
| linked ref mismatch | degraded or consistency defect depending on safe diagnostic source。 | material/source mismatch row。 |
| item not visible | item-level not-visible should not leak hidden subject;page-level rule must be explicit。 | not-visible / redacted item row if formal surface exists。 |
| item unavailable | unavailable/degraded copied from availability source。 | unavailable item / partial page row。 |
| cursor invalid | invalid selector/page request,not stale and not version conflict。 | invalid page cursor row;Step 13 owns cursor algorithm only if needed。 |
| partial marker missing | hard stop/watch;service cannot synthesize partial marker。 | blocker row。 |

### 5. safe marker 来源思考

| marker / surface | allowed source | R12.7 risk |
|---|---|---|
| read subject / source | typed selector、loaded source、query read resolver summary。 | route param/raw id/private map 被误用。 |
| visibility / not-visible | policy/boundary marker、read resolver output。 | not-visible 与 absent/degraded 混用导致存在性泄露。 |
| freshness / stale | loaded material/view marker、builder output、refresh output。 | timestamp/cache/page cursor 被当 freshness。 |
| availability / unavailable | availability resolver、adapter availability summary、infra safe diagnostic。 | raw adapter error 或 config failure 被直接暴露。 |
| degraded / partial | degraded mapper、partiality marker、safe diagnostic。 | exception text 或 linked ref mismatch 被直接变成 public marker。 |
| safe absent / empty | repository safe absence、read resolver safe absent。 | raw store miss、external id、URL/path 泄露。 |
| page cursor / ordering | page helper output。 | cursor 与 version/checkpoint 混用。 |

### 6. R12.8 写入计划思考

`R12.8` 应写入 Query-focused tables,但仍不进入 Inbound / Outbound / Handoff / Job 全量映射。

| write block | should write | should not write |
|---|---|---|
| Query branch surface table | invalid selector、safe absent/empty、not-visible、stale-visible、degraded、unavailable、consistency defect。 | 57 个 Query 的逐 DTO 字段 schema 或 HTTP/RPC status。 |
| Query no-write / recovery table | no-write、no repair、no refresh、no audit append、no job start、no stored replay。 | persistence schema、test case IDs、observability payload。 |
| Partial page / material missing table | empty page、listed item missing、linked ref mismatch、item not-visible、partial degraded、cursor invalid。 | Step 13 cursor algorithm or page storage schema。 |
| Query marker-source table | read subject、visibility、freshness、availability、degraded、safe absent、page cursor 来源与禁用来源。 | implementation fallback、fake-only rule、raw error mapping。 |
| Query blocker / handoff table | missing marker/source/page helper -> blocker or Step 15/16 handoff。 | 自行补 mapper、schema、port 或 public marker。 |

### 7. watch / blocker 思考

| id | topic | issue | handling in R12.7 | required closure |
|---|---|---|---|---|
| ML-D03-S12-QRY-WATCH-001 | not-visible vs absent | not-visible must not reveal hidden truth existence。 | R12.7 separates not-visible from safe absent。 | R12.8 surface table;Step 16 no-leak tests later。 |
| ML-D03-S12-QRY-WATCH-002 | stale marker source | stale-visible needs formal freshness marker。 | R12.7 forbids timestamp/cache/cursor derivation。 | R12.8 marker-source table;Step 15 observability。 |
| ML-D03-S12-QRY-WATCH-003 | partial page marker | partial list item handling needs formal partial/degraded marker。 | R12.7 marks missing marker as blocker/watch。 | R12.8 partial page table;Step 16 tests later。 |
| ML-D03-S12-QRY-WATCH-004 | material/source missing | missing linked material can be safe absent,partial degraded or consistency defect depending on formal source。 | R12.7 does not collapse to empty success。 | R12.8 material missing table。 |
| ML-D03-S12-QRY-WATCH-005 | query no-write | Query temptation to repair stale/degraded view remains high。 | R12.7 keeps no-write absolute。 | R12.8 no-write recovery table;Step 16 tests later。 |
| ML-D03-S12-QRY-WATCH-006 | cursor/version confusion | cursor is not version/freshness/checkpoint。 | R12.7 keeps invalid cursor as selector/page error。 | Step 13 cursor/re-entry details if needed。 |

### 8. R12.7 stop-review

| 检查项 | 结果 |
|---|---|
| 是否只思考 Query surface 与 degraded/unavailable 恢复 | pass |
| 是否覆盖 invalid selector、not-visible、empty、stale、degraded、unavailable、partial page、material/source missing、safe marker 来源 | pass |
| 是否明确 Query no-write 恢复边界 | pass |
| 是否形成 R12.8 写入计划 | pass |
| 是否未修改正式 `03-详细设计.md` | pass |
| 是否未写 Inbound/Outbound/Handoff/Job 完整映射、Step 13~16 内容或 implementation code | pass |

next_allowed_action: 等待用户确认后进入 Step 12 `R12.8 Query surface 与 degraded/unavailable 恢复:再写入`;只允许写入 Query branch surface table、Query no-write / recovery table、partial page / material missing table、Query marker-source table、Query blocker / handoff table 和 R12.9 进入门禁;不得直接修改正式 `03-详细设计.md`;不得写 Inbound、Outbound、Handoff、Job 的完整错误映射表、完整异常分支处理表、完整恢复口径表、Step 13 retry/lock/TTL/idempotency/page cursor 算法、Step 14 config key、Step 15 observability schema、Step 16 test case schema 或 implementation code。

---

## R12.8 Query surface 与 degraded/unavailable 恢复:再写入

### 1. 当前模块目标

`R12.8` 将 `R12.7` 的 Query 分支思考落成可审计表格。当前模块只写 Query branch surface table、Query no-write / recovery table、partial page / material missing table、Query marker-source table、Query blocker / handoff table 和 `R12.9` 进入门禁;不写 Inbound / Outbound / Handoff / Job 的完整错误恢复,不写 Step 13 page cursor / retry 算法,不修改正式 `03-详细设计.md`。

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm |
| 当前允许 | 写入 Query invalid selector、safe absent / empty、not-visible、stale-visible、degraded、unavailable、partial page、marker-source 和 blocker/handoff 表。 |
| 当前禁止 | 写 57 个 Query 的逐 DTO 字段 schema、HTTP/RPC 数字、Inbound/Outbound/Handoff/Job 错误恢复表、Step 13 retry/lock/TTL/idempotency/page cursor 算法、Step 14 config key、Step 15 observability schema、Step 16 test case schema、implementation code 或正式 `03-详细设计.md`。 |

### 2. Query branch surface table

所有 Query flow 复用 Step 9 shared query read template:query shell -> read context -> typed selector / read subject -> repository / resolver / mapper / availability read -> safe surface -> return without write UnitOfWork。下表是 family 级 surface 规则,不替代每个 Query 的 selector schema。

| branch / surface | trigger / detection point | public recovery surface | required source | forbidden recovery |
|---|---|---|---|---|
| invalid selector | query envelope、typed selector、scope、read context、page request 或 cursor 壳不合法。 | safe invalid query surface;caller must correct selector/page request。 | protocol validator or read resolver precheck。 | fallback to string parsing,load broad page,convert to empty,expose raw selector。 |
| found readable | exact read/list resolver returns safe truth/view/material/progress page。 | safe view / safe page / typed refs / safe markers。 | repository、read resolver、builder or mapper output。 | include raw body,domain-only body,private adapter state or debug material。 |
| safe absent / empty | repository/read resolver says absence or empty page is safe to expose。 | absent / empty surface that does not reveal raw miss details。 | repository safe absence or read resolver safe absent。 | expose raw store miss,URL/path/external id,or infer absence from exception text。 |
| not visible | boundary / visibility / context policy denies current read context。 | not-visible surface;does not reveal hidden truth existence。 | policy/boundary marker or read resolver output。 | merge with absent,leak hidden subject id,build marker from auth text/token claim。 |
| stale visible | material/view is readable but freshness marker says stale。 | stale-visible surface with copied freshness marker。 | loaded material/view marker,builder output,or refresh output。 | use timestamp,cache hit,page cursor,private flag or clock drift as freshness。 |
| degraded | material/view/page is partial,invalid-safe,context-limited,or linked refs are degraded but safe surface exists。 | degraded surface with copied `MethodAssetDegradedDecision` / safe diagnostic。 | degraded mapper,partiality marker,safe diagnostic。 | use exception text,stack trace,provider body,debug dump or fake enum。 |
| unavailable | resolver、repository、availability source、builder or adapter summary is unavailable。 | unavailable surface with copied availability / safe diagnostic marker。 | availability resolver,adapter availability summary,infra safe diagnostic。 | expose HTTP/SQL/IO code,endpoint,secret,raw provider response or config value。 |
| consistency defect / missing formal source | Query branch needs marker/source/page helper/schema that Step 6~11 does not define。 | design blocker or manual consistency surface;do not synthesize success。 | owning Step source must be fixed。 | invent marker,private map,page cursor,placeholder ref or fake-only rule。 |

### 3. Query no-write / recovery table

| recovery axis | required rule | allowed result | forbidden side effect |
|---|---|---|---|
| write UoW | Query opens no write UnitOfWork。 | read-only response assembly。 | save truth/material/view/marker/progress/report。 |
| stale material | Return stale-visible/degraded surface when marker exists。 | copied freshness/degraded marker。 | refresh material,trigger job,update freshness,append repair audit。 |
| missing material | Use safe absent/degraded/consistency defect depending on formal source。 | absent/degraded/unavailable/consistency surface。 | create material,scan downstream runtime,load external body,pretend empty success。 |
| not-visible | Preserve non-disclosure;do not distinguish hidden truth from absent by raw details。 | not-visible surface with safe marker。 | include hidden subject ref/raw id/reason text。 |
| unavailable dependency | Copy formal unavailable marker or safe diagnostic。 | unavailable surface。 | retry adapter in Query,open command/job repair path,leak raw error。 |
| page cursor problem | Invalid page request/cursor is selector/page error。 | invalid selector/page surface。 | treat cursor as optimistic version/freshness/checkpoint,auto-reset cursor without rule。 |
| linked item degraded | Return partial/degraded page if formal marker exists。 | partial page / degraded item surface。 | silently skip item,repair linked ref,collapse to empty page。 |
| observability/audit | Step 12 only classifies surface;Step 15 owns observability schema。 | safe diagnostic refs only when formal。 | append audit/log body from Query,store trace payload。 |

### 4. Partial page / material missing table

| scenario | surface decision | source required | blocker if missing |
|---|---|---|---|
| empty page from formal selector | `safe_empty_page`。 | page helper / repository safe empty result。 | cursor/page info absent when protocol requires it。 |
| exact item missing | `safe_absent` only if repository/read resolver marks absence safe。 | safe absence result。 | raw miss only;no safe absence marker/source。 |
| listed item missing | `partial_degraded_page` or `consistency_defect`,depending on page source contract。 | partiality marker or safe diagnostic。 | page source guarantees item but no degraded marker exists。 |
| linked ref mismatch | `degraded_material` or `consistency_defect`。 | degraded mapper / safe diagnostic / resolver summary。 | service would need to infer mismatch from private store shape。 |
| item not visible in page | `not_visible_item` or redacted item only if formal surface exists。 | item-level read decision / boundary marker。 | no item redaction/not-visible shell;would leak existence。 |
| item unavailable | `partial_unavailable_page` or page-level unavailable。 | availability marker / degraded decision。 | unavailable comes only from raw adapter/store error。 |
| invalid cursor | `invalid_page_cursor`。 | page helper validation。 | implementation has to parse private cursor without schema。 |
| partial marker missing | blocker,not synthetic degraded。 | formal partial/degraded mapper missing。 | any branch would require generated marker/string。 |

### 5. Query marker-source table

| marker / surface | allowed source | forbidden source | R12.8 rule |
|---|---|---|---|
| read subject / read source | typed selector、loaded source、query read resolver summary。 | route param,raw id,string prefix,UI state,private map。 | service copies only formal read subject/source。 |
| visibility / not-visible | policy/boundary marker、read resolver output。 | auth text,token claim dump,free-form forbidden message。 | not-visible is distinct from safe absent。 |
| freshness / stale | material/view marker,builder output,refresh output。 | timestamp,cache hit,page cursor,clock,private flag。 | stale-visible requires formal freshness marker。 |
| availability / unavailable | availability resolver,adapter availability summary,infra safe diagnostic。 | raw IO/HTTP/SQL code,endpoint,secret,config value,provider body。 | unavailable marker must be copied,not inferred。 |
| degraded / partial | degraded mapper,partiality marker,safe diagnostic。 | exception text,stack trace,debug dump,provider payload。 | partial/degraded surface must carry formal marker/source。 |
| safe absent / empty | repository safe absence,read resolver safe absent,page helper empty page。 | raw store miss,URL/path,external id,404 text。 | safe absent cannot disclose raw selector or existence details。 |
| page cursor / ordering | page helper output。 | optimistic version,checkpoint,material freshness,private index。 | cursor is page-only;Step 13 owns algorithm if needed。 |
| consistency defect | stored formal source mismatch or required source unavailable。 | local inference from arbitrary data shape。 | classify explicitly;do not map to found/empty success。 |

### 6. Query blocker / handoff table

| id | topic | current R12.8 decision | owner / next closure |
|---|---|---|---|
| ML-D03-S12-QRY-HANDOFF-001 | not-visible / absent non-disclosure | not-visible and safe absent stay separate;neither leaks hidden truth existence。 | R12.15/R12.16 closure audit;Step 16 no-leak tests。 |
| ML-D03-S12-QRY-HANDOFF-002 | stale marker source | stale-visible requires formal freshness marker from material/view/builder/refresh source。 | Step 15 observes stale/degraded;missing source returns owning Step。 |
| ML-D03-S12-QRY-HANDOFF-003 | partial page marker | listed item missing or linked mismatch needs partial/degraded marker or consistency defect。 | Step 16 partial-page tests;Step 7/8 source if marker missing。 |
| ML-D03-S12-QRY-HANDOFF-004 | query no-write | Query cannot repair,refresh,append audit,publish event,start job or store replay。 | Step 16 no-write tests;Step 15 safe observation only。 |
| ML-D03-S12-QRY-HANDOFF-005 | page cursor / version split | invalid cursor is page request error;cursor is not version/freshness/checkpoint。 | Step 13 owns cursor/re-entry details if required。 |
| ML-D03-S12-QRY-HANDOFF-006 | unavailable dependency source | unavailable must copy formal availability/diagnostic marker。 | Step 14 binding/config source;Step 15 observation。 |
| ML-D03-S12-QRY-HANDOFF-007 | material/source missing | missing linked source/material is safe absent,degraded,unavailable or consistency defect according to formal source。 | R12.15/R12.16 audit checks branch coverage。 |

### 7. R12.8 stop-review

| 检查项 | 结果 |
|---|---|
| 是否写入 Query branch surface table | pass |
| 是否写入 Query no-write / recovery table | pass |
| 是否写入 partial page / material missing table | pass |
| 是否写入 Query marker-source table | pass |
| 是否写入 Query blocker / handoff table | pass |
| 是否未展开 Inbound/Outbound/Handoff/Job 完整映射 | pass |
| 是否未写 Step 13 retry/lock/TTL/idempotency/page cursor 算法 | pass |
| 是否未修改正式 `03-详细设计.md` | pass |
| 是否未写 Step 14/15/16 内容、test schema 或 implementation code | pass |

next_allowed_action: 等待用户确认后进入 Step 12 `R12.9 Inbound / Outbound / Handoff 错误恢复:先思考`;只允许思考 Inbound malformed/unsupported/duplicate/quarantine/delayed/no-op/unavailable、Outbound candidate invalid/target blocked/unavailable/publication failed/no rollback、Handoff prepared/delivered/blocked/unavailable/failed/body-free receipt marker 的错误恢复边界和 R12.10 写入计划;不得直接修改正式 `03-详细设计.md`;不得写 Job 的完整错误映射表、完整异常分支处理表、完整恢复口径表、Step 13 retry/lock/TTL/idempotency 算法、Step 14 config key、Step 15 observability schema、Step 16 test case schema 或 implementation code。

---

## R12.9 Inbound / Outbound / Handoff 错误恢复:先思考

### 1. 当前模块目标

`R12.9` 只思考 Inbound / Outbound / Handoff 的错误恢复边界和 `R12.10` 写入计划。当前模块不落最终 branch recovery table,不写 Job / operations 错误恢复,不定义 Step 13 retry / lock / TTL / idempotency 算法,也不写 topic、delivery receipt、external payload、observability schema 或测试用例。

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm |
| 当前允许 | 思考 inbound malformed / unsupported / duplicate / quarantine / delayed / unavailable、outbound candidate invalid / target blocked / unavailable / publication failed / no rollback、handoff prepared / delivered / blocked / unavailable / failed / body-free receipt marker 的恢复边界。 |
| 当前禁止 | 写最终 R12.10 表、写 Job/operations recovery 全量映射、写 topic/bus binding/dead-letter/delivery ack、写 external body/archive body、写 retry 参数、config key、observability payload、test schema、implementation code 或正式 `03-详细设计.md`。 |

### 2. Inbound 错误恢复边界思考

Inbound 的主线不是命令 truth mutation,而是 worker 对 body-free external signal 的安全 intake。Step 8 将 inbound protocol 固定为 typed payload boundary、receipt / worker result shell 和 duplicate / quarantine / delayed / no-op 分支;Step 9 shared inbound template 又要求先验证 envelope / runtime source binding,再 reserve source dedup / idempotency,duplicate 只能 replay stored receipt,accepted 只保存 intake summary / receipt / worker result。由此 R12.10 需要把 inbound 错误恢复写成 receipt surface 和 quarantine / delayed / unsupported / rejected surface,而不是写 core truth rollback。

| inbound branch | R12.9 思考裁决 | R12.10 应写入方向 |
|---|---|---|
| malformed envelope | envelope 或 typed shell 不能通过协议验证时,不能调用 source adapter 或 command truth mutation。 | safe rejected / quarantine receipt;no core truth mutation;no raw payload echo。 |
| unsupported schema / family | schema version、consumer family 或 source binding 不被当前 worker 支持时,应返回 unsupported safe receipt。 | unsupported receipt / worker result;不得 fallback 到 closest schema。 |
| raw body / body boundary violation | inbound envelope、adapter summary 或 external boundary 泄露 raw body 时,应按 body-free violation 处理。 | quarantine / rejected receipt with safe reason marker;不得存储 body 或 exception detail。 |
| duplicate source signal | dedup / idempotency 命中已完成 receipt 时,只能 replay stored consumer receipt。 | duplicate replay surface;禁止重新拉外部源或重跑 intake。 |
| delayed / unavailable source | source adapter、runtime binding 或 body-free resolver 暂不可用时,不能伪装为 accepted。 | delayed / unavailable receipt,marker 复制自 adapter/source summary。 |
| no-op external signal | typed signal 合法但按 Step 9 flow 不产生新 intake/truth mutation。 | no-op receipt;保留 safe reason/source refs。 |
| accepted intake | accepted 只是 intake 成功和 receipt/worker result 成功,不是后续 command truth mutation 成功。 | accepted receipt with intake summary ref;后续 truth mutation 由显式 Command 或后续 flow 承接。 |
| missing safe reason/source | 若 Step 6~9 未给 safe reason、source ref、receipt marker,不能由 worker 拼字符串。 | design blocker / consistency defect;返回到 owning Step 闭口。 |

### 3. Outbound publication 错误恢复边界思考

Outbound 的错误恢复必须围绕 event candidate 和 publisher outcome,不能围绕 subscriber ack 或外部 delivery truth。Step 8 已固定 body-free event shell、event candidate、publication outcome、blocked/degraded/unavailable 和 publisher result shell;Step 9 规定 candidate source 来自 accepted command / completed job / bounded inbound intake,并且 publisher 加载 candidate shell,不重读 current truth。Step 11 又明确 publication outcome 与 accepted truth 分离,publication failure never rolls back accepted truth / candidate。

| outbound concern | R12.9 思考裁决 | R12.10 应写入方向 |
|---|---|---|
| candidate source missing | candidate 必须来自正式 accepted result / completed job / bounded intake;source missing 不是 publisher retry 问题。 | candidate_not_assembled / consistency defect / manual surface。 |
| candidate invalid | candidate shell 若含 raw body、缺 typed refs、缺 marker 或 source mismatch,不能发布。 | candidate_invalid / blocked outcome;body-free violation 进入 blocker / quarantine。 |
| target disabled / blocked | target registry 返回 disabled / blocked 时,publication 不应调用 publisher port。 | publication_blocked outcome;truth/candidate 不回滚。 |
| target unsupported | event family 与 target 不兼容时,不能 fallback 到其他 topic 或 family。 | unsupported target outcome;safe reason marker from registry。 |
| target / registry unavailable | registry 或 target availability 缺失时,应记录 unavailable outcome。 | publication_unavailable;retryability 只由 formal outcome 分类,算法留 Step 13。 |
| publisher unavailable / degraded | publisher port 不可用或降级时,只影响 publication outcome。 | unavailable / degraded publisher result;不重建 candidate。 |
| publisher failed | publisher 返回 safe failed outcome 时,不代表 accepted truth 失败。 | publication_failed outcome;no rollback;Step 15 后续观测。 |
| external delivery ambiguity | `Published` 仅代表 publisher port safe outcome,不是 subscriber ack / external delivered truth。 | 禁止写 delivery ack truth;handoff 或 external receipt 另行建模。 |

### 4. Handoff 错误恢复边界思考

Handoff 的恢复边界是 body-free handoff binding / prepared / delivered / blocked / unavailable / failed outcome,不是外部系统真实交付状态或 archive/package body。Step 10 已把 `Delivered` 限定为 handoff port body-free receipt marker,Step 11 规定 handoff outcome 与 local truth/report/candidate 分离,external failure 不回滚 local committed truth。

| handoff concern | R12.9 思考裁决 | R12.10 应写入方向 |
|---|---|---|
| binding missing / unsupported | 没有正式 handoff binding 或 target family 不支持时,不能从 config string / topic 猜测。 | handoff_blocked / unsupported safe outcome。 |
| binding blocked / disabled | binding 正式 blocked / disabled 时,不调用 handoff port。 | blocked outcome with copied marker。 |
| target unavailable | handoff target 或 adapter availability 不可用时,只记录 unavailable outcome。 | handoff_unavailable;no local truth rollback。 |
| prepared but not delivered | prepared 表示本地 body-free handoff material 已准备,不等于 external delivered。 | prepared outcome;后续重试算法留 Step 13。 |
| delivered receipt marker | delivered 只能复制 handoff port 的 body-free receipt marker。 | delivered outcome;禁止存 raw receipt payload。 |
| handoff failed | failed outcome 需要 safe reason / marker,并保持 local committed truth。 | handoff_failed;manual/retry 分类由 formal outcome 决定。 |
| receipt marker missing | 若 delivered / failed 需要 marker 但 port 没有正式输出,不能合成。 | design blocker / consistency defect。 |

### 5. Side-effect / no-rollback / body-free 边界思考

Inbound、Outbound、Handoff 的共同风险是把 external signal 或 side effect 误当成 core truth,或者把失败当成需要回滚 accepted truth。R12.10 需要统一写清四条红线:

1. Inbound worker 只写 safe receipt / intake decision / worker result;不直接修改 core truth。
2. Outbound publication failure 不回滚 accepted command truth、completed job truth 或 event candidate。
3. Handoff failure 不回滚 local report / candidate / committed truth。
4. 所有 inbound/outbound/handoff surface 都必须 body-free;raw payload、raw archive/package body、provider response、stack trace、endpoint/secret/config value 均不得进入 receipt / outcome / marker。

### 6. R12.10 写入计划思考

`R12.10` 应把本模块思考落成可审计表格,但仍不进入 Job / operations recovery。

| write block | should write | should not write |
|---|---|---|
| Inbound branch recovery table | malformed、unsupported、raw body violation、duplicate、delayed/unavailable、no-op、accepted intake、missing safe source。 | command truth mutation、source adapter payload schema、dead-letter queue。 |
| Outbound publication recovery table | candidate not assembled/invalid、target blocked/unsupported/unavailable、publisher degraded/unavailable/failed、published ambiguity。 | topic / bus binding / subscriber ack / delivery truth。 |
| Handoff outcome recovery table | binding missing/blocked/unavailable、prepared、delivered marker、failed、receipt marker missing。 | external delivered truth、archive/package body、provider receipt payload。 |
| side-effect / no-rollback / body-free table | inbound no core truth、publication no rollback、handoff no rollback、copy-only marker、body-free redline。 | retry schedule、TTL、config key、metric/log schema。 |
| blocker / handoff table | missing formal receipt/outcome/marker/source/schema -> owning Step / Step 13~16 handoff。 | implementation fallback、string marker、fake-only rule。 |

### 7. watch / blocker 思考

| id | topic | issue | handling in R12.9 | required closure |
|---|---|---|---|---|
| ML-D03-S12-IOH-WATCH-001 | inbound receipt replay | duplicate inbound must replay stored receipt,not source reprocessing。 | R12.9 keeps replay source as stored receipt only。 | R12.10 branch table;Step 13 idempotency detail later。 |
| ML-D03-S12-IOH-WATCH-002 | body-free violation | inbound/outbound/handoff must not persist or expose raw body / provider response / stack trace。 | R12.9 treats as quarantine/rejected/invalid/blocker surface。 | R12.10 body-free table;Step 16 no-body tests later。 |
| ML-D03-S12-IOH-WATCH-003 | publication no rollback | publisher failure after candidate must not roll back accepted truth。 | R12.9 separates outcome from truth mutation。 | R12.10 no-rollback table;Step 15 observation later。 |
| ML-D03-S12-IOH-WATCH-004 | handoff delivered ambiguity | delivered is body-free receipt marker,not external system truth。 | R12.9 forbids external ack truth or receipt payload。 | R12.10 handoff table;Step 15 safe reporting later。 |
| ML-D03-S12-IOH-WATCH-005 | marker/source gaps | missing receipt/outcome/marker/source cannot be synthesized by worker/publisher/handoff code。 | R12.9 marks as design blocker / consistency defect。 | R12.10 blocker table and R12.15 closure audit。 |
| ML-D03-S12-IOH-WATCH-006 | retry boundary | retryability can be classified but retry count / TTL / lease belongs to Step 13。 | R12.9 only classifies temporary/permanent/manual direction。 | Step 13 concurrency/idempotency/retry detail。 |

### 8. R12.9 stop-review

| 检查项 | 结果 |
|---|---|
| 是否只思考 Inbound / Outbound / Handoff 错误恢复边界 | pass |
| 是否覆盖 inbound malformed / unsupported / duplicate / quarantine / delayed / no-op / unavailable | pass |
| 是否覆盖 outbound candidate invalid / target blocked / unavailable / publication failed / no rollback | pass |
| 是否覆盖 handoff prepared / delivered / blocked / unavailable / failed / body-free receipt marker | pass |
| 是否形成 R12.10 写入计划 | pass |
| 是否未写 Job / operations 完整恢复映射 | pass |
| 是否未写 Step 13 retry/lock/TTL/idempotency 算法 | pass |
| 是否未修改正式 `03-详细设计.md` | pass |
| 是否未写 Step 14/15/16 内容、test schema 或 implementation code | pass |

next_allowed_action: 等待用户确认后进入 Step 12 `R12.10 Inbound / Outbound / Handoff 错误恢复:再写入`;只允许写入 Inbound branch recovery table、Outbound publication recovery table、Handoff outcome recovery table、Inbound / Outbound / Handoff side-effect / no-rollback / body-free table、blocker / handoff table 和 `R12.11` 进入门禁;不得直接修改正式 `03-详细设计.md`;不得写 Job 的完整错误映射表、完整异常分支处理表、完整恢复口径表、Step 13 retry/lock/TTL/idempotency 算法、Step 14 config key、Step 15 observability schema、Step 16 test case schema 或 implementation code。

---

## R12.10 Inbound / Outbound / Handoff 错误恢复:再写入

### 1. 当前模块目标

`R12.10` 将 `R12.9` 的 Inbound / Outbound / Handoff 恢复边界思考落成可审计表格。当前模块只写 Inbound branch recovery table、Outbound publication recovery table、Handoff outcome recovery table、side-effect / no-rollback / body-free table、blocker / handoff table 和 `R12.11` 进入门禁;不写 Job / operations recovery 全量映射,不写 Step 13 retry / idempotency 算法,不修改正式 `03-详细设计.md`。

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm |
| 当前允许 | 写入 inbound receipt / worker result、outbound publication outcome、handoff outcome、copy-only marker、no-rollback、body-free、blocker / handoff 的 family 级恢复表。 |
| 当前禁止 | 写 topic / bus binding / delivery ack、raw external payload、dead-letter body、external delivered truth、retry count / TTL / lease、config key、observability schema、test case schema、implementation code 或正式 `03-详细设计.md`。 |

### 2. Inbound branch recovery table

| inbound branch | detection / source | public recovery surface | persistence / side-effect boundary | forbidden recovery |
|---|---|---|---|---|
| malformed envelope | shared metadata、source binding、typed payload shell 或 schema version validation failed。 | safe rejected receipt or quarantine receipt;worker result marks malformed。 | receipt / worker result only;no core truth mutation;no external adapter call after validation failure。 | expose broker payload,store raw envelope,try best-effort parse,route to Command truth mutation。 |
| unsupported schema / family | consumer family、schema version、source kind or runtime binding is unsupported。 | unsupported receipt with safe reason marker / typed source refs。 | stored receipt may be written for replay;no source reprocessing on duplicate。 | fallback to nearest schema,convert to no-op silently,write dead-letter body。 |
| raw body / body-free violation | inbound envelope、adapter summary、external source summary or error detail contains raw body / provider payload。 | quarantine or rejected receipt with body-free violation marker。 | persist safe marker / typed refs only;quarantine is logical safe surface,not raw payload store。 | store payload body,stack trace,provider response,archive body,or raw dead-letter message。 |
| duplicate source signal | source dedup / idempotency guard finds completed receipt for same formal source and digest/scope。 | duplicate receipt replayed from stored receipt / stored result surface。 | copy stored receipt;do not call adapter,do not recompute intake,do not mutate truth。 | rerun consumer,fetch raw source again,rebuild response from current state,scan queue offset。 |
| delayed / unavailable source | inbound source port、body-free adapter、runtime binding or availability summary returns temporary unavailable / delayed。 | delayed or unavailable receipt with copied availability marker。 | record safe receipt / worker result when formal surface exists;no accepted intake summary。 | return accepted,spin retry loop in Step 12,expose HTTP/IO code or endpoint。 |
| no-op accepted signal | typed signal is valid but Step 9 flow determines no state change / no intake effect。 | no-op receipt with safe reason/source refs。 | stored receipt supports duplicate replay;no command truth mutation or publication candidate unless formal flow requires。 | silently drop with no receipt,create audit/outcome without source,mislabel as accepted mutation。 |
| accepted intake | envelope and body-free resolution succeed and intake decision is accepted。 | accepted receipt with intake summary ref / worker result safe shell。 | intake decision、receipt and worker result share the formal inbound UoW;truth mutation remains separate explicit flow。 | claim downstream command success,publish event body,store raw source,or skip stored receipt。 |
| receipt persistence failure | receipt / intake decision / worker result cannot be committed after accepted branch decision。 | consistency unknown or manual intervention surface;duplicate replay not available until formal receipt exists。 | rollback inbound receipt UoW according to Step 11;do not claim accepted receipt without durable proof。 | pretend success,blindly retry mutation in Step 12,delete partial rows without formal recovery。 |
| missing safe reason / marker / source | required receipt marker、safe reason、source ref or stored receipt schema is absent from Step 6~11。 | design blocker / consistency defect;stop instead of synthesize。 | owning Step must define source / schema before implementation。 | construct marker from strings,adapter error text,route param,private map or fake-only rule。 |

### 3. Outbound publication recovery table

| publication branch | detection / source | public recovery surface | persistence / side-effect boundary | forbidden recovery |
|---|---|---|---|---|
| candidate source missing | accepted command result、completed job result or bounded inbound intake source ref cannot be loaded as formal source。 | candidate_not_assembled / consistency defect / manual intervention marker。 | no publisher call;record safe outcome only if formal outcome source exists。 | rebuild candidate from current truth,scan logs,guess source from event family。 |
| candidate invalid | event candidate shell lacks typed refs / markers,has source mismatch,or violates body-free payload rule。 | candidate_invalid / publication_blocked outcome with safe diagnostic marker。 | candidate remains invalid;truth source is not rolled back。 | publish partial payload,strip fields silently,store raw event body or topic payload。 |
| target disabled / blocked | target registry says disabled,blocked,policy-blocked or not permitted for family。 | publication_blocked outcome copied from registry marker。 | publisher port is not invoked;candidate remains durable if defined。 | bypass registry,choose alternate target,turn block into failure retry。 |
| target unsupported | target registry cannot support event family / schema version。 | unsupported target publication outcome。 | safe outcome only;no transport binding resolution beyond formal registry。 | fallback to another event family,topic,legacy outbox or transport body。 |
| target / registry unavailable | target registry or target availability summary is unavailable。 | publication_unavailable with copied availability marker。 | no candidate rebuild;retryability classification only,algorithm deferred to Step 13。 | expose endpoint/secret/config value,loop retry in Step 12,return published。 |
| publisher unavailable / degraded | publisher binding / port returns unavailable or degraded safe result。 | publisher_unavailable or publisher_degraded publication outcome。 | publication outcome separate from accepted truth/candidate;no rollback。 | mark command failed,change truth,or derive marker from raw adapter status。 |
| publisher failed | publisher port returns safe failed outcome after candidate load and target resolution。 | publication_failed outcome with safe reason marker。 | failure is append / stored outcome;accepted truth and candidate remain committed。 | roll back accepted command/job/inbound source,delete candidate,expose provider response。 |
| published safe outcome | publisher port returns safe published outcome。 | published publication outcome;means local publisher outcome only。 | does not assert subscriber ack or external delivered truth。 | store subscriber ack,delivery receipt body,or downstream processing result as publication truth。 |
| outcome persistence failure | publication outcome cannot be durably recorded after publisher result。 | consistency unknown / manual intervention surface。 | do not manufacture published evidence;Step 13/15 own retry/reporting details。 | claim published without stored outcome,rerun publisher blindly,mutate source truth。 |

### 4. Handoff outcome recovery table

| handoff branch | detection / source | public recovery surface | persistence / side-effect boundary | forbidden recovery |
|---|---|---|---|---|
| binding missing / unsupported | no formal handoff binding,unsupported target family,or missing handoff port source。 | handoff_blocked / handoff_unsupported safe outcome。 | no handoff port invocation;safe outcome only when formal marker exists。 | infer binding from config string,topic,URL,filename or implementation default。 |
| binding blocked / disabled | binding state or handoff policy marks target blocked / disabled。 | handoff_blocked outcome copied from binding / policy marker。 | local truth/report/candidate not rolled back。 | bypass block,call alternate adapter,turn blocked into retry failure。 |
| handoff target unavailable | handoff target,port,adapter availability or runtime binding unavailable。 | handoff_unavailable outcome with copied availability marker。 | outcome separate from local committed truth;retry schedule deferred to Step 13。 | expose endpoint/secret/raw IO error,loop retry in Step 12,delete local source rows。 |
| prepared | handoff material is body-free and ready but not delivered。 | handoff_prepared outcome / marker。 | prepared does not mean external delivered;local material remains body-free。 | claim delivered,store package/archive/report body,or infer external state。 |
| delivered receipt marker | handoff port returns body-free delivered receipt marker。 | handoff_delivered outcome with copied receipt marker。 | delivered means body-free marker from port,not external business truth。 | persist external receipt payload,subscriber ack,archive body,or provider response body。 |
| handoff failed | handoff port returns safe failed outcome。 | handoff_failed with safe reason marker。 | local truth/report/candidate remains committed;failure outcome is separate。 | roll back source truth,overwrite report,leak raw error,or retry without guard。 |
| marker / receipt source missing | delivered / failed / blocked branch needs marker or receipt shell not defined by Step 6~11。 | design blocker / consistency defect。 | owning Step must close marker/source before implementation。 | synthesize marker from string,transport status,adapter enum or private fake map。 |
| outcome persistence failure | handoff outcome cannot be written after port result。 | consistency unknown / manual intervention surface。 | do not claim delivered/failed without durable safe outcome when later replay/report requires it。 | store raw receipt body as evidence,rerun handoff blindly,alter committed local truth。 |

### 5. Side-effect / no-rollback / body-free table

| axis | required rule | allowed side effect | forbidden side effect |
|---|---|---|---|
| inbound truth boundary | Inbound worker receipt is not core truth mutation。 | intake decision / safe receipt / worker result only。 | create/update method asset truth,formal version,query material or outbound event body from raw inbound signal。 |
| inbound duplicate | Duplicate inbound copies stored receipt。 | replay safe receipt / stored result source。 | adapter reprocessing,queue scan,raw payload reload,current truth rebuild。 |
| outbound no rollback | Publication failure never rolls back accepted command/job/inbound source or event candidate。 | publication outcome / safe marker append or stored shell。 | rollback truth,delete candidate,mark command rejected after publication failure。 |
| handoff no rollback | Handoff failure never rolls back local report/candidate/committed truth。 | handoff outcome / safe marker / manual issue ref if formal。 | overwrite report,delete local source,claim local truth invalid due to external failure。 |
| copy-only marker | blocked/degraded/unavailable/failed/delivered markers are copied from formal mapper/resolver/registry/port output。 | typed refs、safe summary、marker、safe reason refs。 | marker from exception text,transport status,raw provider enum,route string or private map。 |
| body-free surface | receipt、candidate、publication outcome、handoff outcome remain body-free。 | body-free fact refs、summary refs、digest/version refs、safe diagnostics。 | raw payload,raw event body,archive/package body,report markdown,provider response,stack trace,secret/config value。 |
| retry boundary | Step 12 only classifies retryable/non-retryable/manual/consistency defect。 | classification and handoff to Step 13。 | retry count,TTL,lease,backoff,queue scheduling,dead-letter implementation。 |
| observation boundary | Step 12 states whether safe outcome/report issue may exist。 | safe diagnostic / issue ref only when formal。 | metric labels,log payload,trace schema,evidence artifact body。 |

### 6. Blocker / handoff table

| id | topic | current R12.10 decision | owner / next closure |
|---|---|---|---|
| ML-D03-S12-IOH-HANDOFF-001 | inbound receipt replay | Duplicate inbound must replay stored receipt;missing receipt schema/source is blocker。 | Step 13 replay/idempotency details;R12.15/R12.16 closure audit。 |
| ML-D03-S12-IOH-HANDOFF-002 | inbound body-free violation | Raw body / provider payload / dead-letter body never enters receipt or quarantine store。 | Step 16 no-body tests;Step 15 safe observability only。 |
| ML-D03-S12-IOH-HANDOFF-003 | publication source/candidate defect | Missing candidate source or invalid candidate is consistency/manual surface,not publisher retry。 | Step 13 retry guard;Step 15 outcome reporting。 |
| ML-D03-S12-IOH-HANDOFF-004 | publication no rollback | Publisher unavailable/failed outcome is separate from truth/candidate。 | Step 15 observation;Step 16 no-rollback tests。 |
| ML-D03-S12-IOH-HANDOFF-005 | handoff delivered ambiguity | Delivered means body-free receipt marker only,not external delivered truth。 | Step 15 reporting wording;Step 16 receipt-body redline tests。 |
| ML-D03-S12-IOH-HANDOFF-006 | marker/source gaps | Missing receipt/outcome/marker/source/schema returns to owning Step;implementation cannot fill。 | R12.15/R12.16 cross-step audit。 |
| ML-D03-S12-IOH-HANDOFF-007 | retry/config/observability deferral | Retry algorithm,bindings/config keys and observability schema are out of R12.10 scope。 | Step 13,Step 14,Step 15。 |

### 7. R12.10 stop-review

| 检查项 | 结果 |
|---|---|
| 是否写入 Inbound branch recovery table | pass |
| 是否写入 Outbound publication recovery table | pass |
| 是否写入 Handoff outcome recovery table | pass |
| 是否写入 side-effect / no-rollback / body-free table | pass |
| 是否写入 blocker / handoff table | pass |
| 是否未写 Job / operations recovery 全量映射 | pass |
| 是否未写 Step 13 retry/lock/TTL/idempotency 算法 | pass |
| 是否未修改正式 `03-详细设计.md` | pass |
| 是否未写 Step 14/15/16 内容、test schema 或 implementation code | pass |

next_allowed_action: 等待用户确认后进入 Step 12 `R12.11 Job / operations recovery 错误恢复:先思考`;只允许思考 job input invalid、partial item failure、checkpoint missing/corrupt、stored report missing、run history / resume source、manual intervention、no-repair、body-free report boundary 和 `R12.12` 写入计划;不得直接修改正式 `03-详细设计.md`;不得写 Job / operations 的最终恢复表、Step 13 retry/lock/TTL/idempotency/checkpoint resume 算法、Step 14 config key、Step 15 observability schema、Step 16 test case schema 或 implementation code。

---

## R12.11 Job / operations recovery 错误恢复:先思考

### 1. 当前模块目标

`R12.11` 只思考 Job / operations recovery 的错误恢复边界和 `R12.12` 写入计划。当前模块覆盖 8 个 Operations Job 的 job input invalid、runtime blocked、partial item failure、checkpoint missing/corrupt、stored report missing、run history / resume source、manual intervention、no-repair 和 body-free report boundary。当前模块不落最终 Job recovery table,不写 Step 13 checkpoint resume / retry / lock / lease 算法,不写 Step 15 observability schema,不写 Step 16 test case schema。

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm |
| 当前允许 | 思考 Operations Job 的安全结果面、partial/degraded/unavailable/blocked/failed/manual surface、checkpoint/report/run history/source 缺口和 `R12.12` 写入计划。 |
| 当前禁止 | 写最终 R12.12 表、写 checkpoint resume 算法、retry count / TTL / lease / queue / scheduler 规则、report body / evidence artifact schema、config key、observability payload、test schema、implementation code 或正式 `03-详细设计.md`。 |

### 2. Job / operations recovery 边界思考

Operations Job 不是 Command,也不是 Query 的隐式 repair。Step 9 明确 8 个 Operations Job 只刷新派生材料、trace/audit/impact 材料、外围读取材料或推进 recovery convergence;Step 11 又把 job item/page UoW 限定为 derived material / progress / checkpoint / report shell,并明确 job no-truth-repair。由此 R12.12 的错误恢复必须写成 job result / progress / checkpoint / report / safe issue surface,不能写成业务 truth 修复或 scheduler 重试实现。

| job recovery concern | R12.11 思考裁决 | R12.12 应写入方向 |
|---|---|---|
| invalid job input | job family、run ref、scope ref、task refs、target refs 或 operation context 不合法时,job body 不启动。 | invalid / rejected job result;no derived write;safe reason from validator。 |
| unsupported job family | 8 个 Operations Job 之外的 family 不被接受。 | blocked / unsupported job result;不得 fallback 到旧 seed / replay outbox / rebuild index job。 |
| runtime / adapter blocked | runtime assembly、adapter availability、job profile 或 safe execution boundary 阻止执行。 | blocked / unavailable / degraded result copied from runtime / availability marker。 |
| duplicate / replay | duplicate job request 或 resume 命中 stored surface 时,只复制 stored report / checkpoint / run history。 | duplicate / replayed job result;禁止重跑 job body 或重算 material。 |
| checkpoint missing / corrupt | resume 需要 checkpoint,但 checkpoint absent、wrong kind、corrupt 或与 run/scope 不匹配。 | manual consistency / resume blocked surface;Step 13 owns recovery algorithm。 |
| target planning empty | target planner returns safe empty target set。 | no-op or completed-empty job result with progress/report source。 |
| target planning unavailable | planner / repository / availability source unavailable。 | unavailable / blocked result or partial surface according to formal marker。 |
| partial item failure | one target/page fails after some derived material is processed。 | partial / completed-with-issues result;safe issue refs and checkpoint/progress update only。 |
| report persistence failure | job body produced result but report/progress/checkpoint cannot commit。 | consistency unknown / manual intervention;do not claim completed report。 |
| stored report missing | duplicate / query / observability needs stored report but durable report absent。 | manual consistency failure;no rerun in Step 12。 |
| body-free report violation | report / issue / evidence / artifact output contains raw report body、metrics body、raw log、artifact/archive body。 | failed / blocked / quarantine-like body-free violation surface;safe marker only。 |
| formal intervention required | recovery convergence detects condition requiring human or upstream design intervention。 | manual intervention result / issue ref;no automatic core truth repair。 |

### 3. 8 个 Operations Job family 思考

R12.11 不逐字段写 DTO,但需要确认 8 个 Job 在错误恢复上各自的风险重心。R12.12 应按 family 级别写恢复表,并保持 shared template 一致。

| Operations Job | recovery risk focus | R12.11 裁决 |
|---|---|---|
| `RefreshCatalogAndDefinitionReadMaterialsFlow` | definition/catalog target missing、partial target failure、read material refresh failure。 | partial/report issue;不得修改 definition/catalog truth。 |
| `RefreshFormalVersionReadMaterialsFlow` | formal version / basis summary missing、basis degraded、version read material failure。 | partial/degraded issue;不得重新 formalize 或创建 version。 |
| `RefreshConsumptionReadMaterialsFlow` | boundary unavailable、consumption material freshness/availability marker missing。 | partial/unavailable marker copied;不得重新做 boundary decision。 |
| `RefreshRelationDistributionMaterialsFlow` | relation/distribution builder unavailable、linked relation mismatch。 | degraded issue/report;不得修 graph truth 或做 ranking/recommendation。 |
| `RefreshExternalSummaryReadMaterialsFlow` | external adapter unavailable、external summary missing/body-free violation。 | unavailable/body-free violation issue;不得 fetch or store external body。 |
| `RefreshTraceAuditImpactMaterialsFlow` | missing lineage/audit/impact refs、partial trace refresh、raw evidence/log risk。 | partial issue;不得保存 raw log/evidence body。 |
| `RunConsistencyRecoveryConvergenceFlow` | recovery issue unresolved、protection/impact mismatch、manual intervention required。 | intervention issue/report;不得自动 repair core truth。 |
| `RefreshPeripheralReadMaterialsFlow` | package/assembly/peripheral resolver unavailable、marketplace material missing。 | peripheral unavailable/degraded surface;不得读取 marketplace transaction body。 |

### 4. Checkpoint / report / run history 思考

Checkpoint、report 和 run history 是 Job recovery 的关键,但 R12.11 不能把 Step 13 的 replay / resume 算法提前落下。当前只固定错误分类方向。

| support surface | allowed source | recovery thinking | forbidden source / action |
|---|---|---|---|
| checkpoint | checkpoint store、progress output、run history summary。 | missing/wrong/corrupt -> resume blocked / manual consistency surface。 | retry count、queue offset、lease token、timestamp、private map。 |
| progress | progress view repository、application job orchestration output。 | partial item failure records progress marker and safe issue when formal。 | metrics body、worker log、scheduler state、process status。 |
| run history | run history repository and body-free chronology summary。 | missing run history during replay/report -> manual consistency surface。 | report markdown、raw log、external receipt body。 |
| stored report | stored report shell / job result shell。 | missing or wrong kind -> duplicate replay consistency failure。 | rerun job body,rebuild report from current truth,scan queue。 |
| report boundary | report boundary ref、safe summary、issue refs、handoff hint。 | report body-free violation -> blocked/failed safe surface。 | markdown/JSON report body,artifact body,archive body,metrics payload。 |
| recovery issue | recovery issue repository / safe diagnostic marker。 | formal intervention required is explicit issue,not hidden success。 | repair script,raw exception,operator note body as public result。 |

### 5. No-repair / body-free / partial 思考

R12.12 需要把 Job-specific redlines 写清:

1. Job 只能写 derived material、progress、checkpoint、run history、safe issue、stored report 或 event candidate hint;不得 create / update / repair core business truth。
2. Partial failure 不能被 success counter 隐藏;必须有 safe issue / partial marker / report boundary 来源。
3. Duplicate / resume 不能重跑 job body、重读 current truth 重建 public response、扫描 queue 或读取 scheduler state。
4. Checkpoint 是 resume anchor,不是 optimistic version、page cursor、truth cursor 或 retry counter。
5. Job report / evidence / artifact / archive / metrics / log 全部保持 body-free;只允许 typed refs、safe summary、markers 和 boundary refs。

### 6. R12.12 写入计划思考

`R12.12` 应把本模块思考落成可审计表格,但仍不进入 Step 13 算法。

| write block | should write | should not write |
|---|---|---|
| Job branch recovery table | invalid input、unsupported family、runtime blocked、duplicate/replay、checkpoint issue、target planning empty/unavailable、partial item failure、report persistence failure。 | retry / lease / scheduler / queue / lock algorithm。 |
| 8 Job family recovery table | 每个 Operations Job 的 partial/degraded/unavailable/manual risk focus 和 forbidden repair。 | DTO 字段 schema、job trigger、target batch algorithm。 |
| checkpoint / report / run history table | missing/corrupt/wrong kind、stored report missing、run history missing、report body-free violation。 | checkpoint serialization、resume algorithm、evidence artifact path。 |
| no-repair / body-free / partial table | no core truth repair、body-free report、partial not hidden、checkpoint not version。 | implementation fallback、fake checkpoint map、raw report/log body。 |
| blocker / handoff table | missing marker/source/report/checkpoint/schema -> owning Step / Step 13~16 handoff。 | service-synthesized marker/report/checkpoint。 |

### 7. watch / blocker 思考

| id | topic | issue | handling in R12.11 | required closure |
|---|---|---|---|---|
| ML-D03-S12-JOB-WATCH-001 | job no-truth-repair | Job partial/failure cannot mutate or repair core truth。 | R12.11 keeps job writes limited to derived/progress/report/issue。 | R12.12 no-repair table;Step 16 tests later。 |
| ML-D03-S12-JOB-WATCH-002 | checkpoint source | checkpoint must come from formal checkpoint/progress/run history source。 | R12.11 forbids retry count/queue offset/lease/private map。 | R12.12 checkpoint table;Step 13 resume details。 |
| ML-D03-S12-JOB-WATCH-003 | stored report missing | duplicate/replay/report query cannot rerun job body to rebuild missing report。 | R12.11 classifies as manual consistency failure。 | R12.12 branch table;Step 13 replay details。 |
| ML-D03-S12-JOB-WATCH-004 | partial item failure | partial failure must become safe issue/report marker,not silent success。 | R12.11 requires marker/source or blocker。 | R12.12 partial table;Step 15 report observation。 |
| ML-D03-S12-JOB-WATCH-005 | body-free report | report/evidence/artifact/log/metrics body must not enter public result。 | R12.11 treats body leakage as body-free violation。 | R12.12 body-free table;Step 16 no-body tests。 |
| ML-D03-S12-JOB-WATCH-006 | manual intervention | recovery convergence may require formal intervention,not automatic repair。 | R12.11 keeps intervention as explicit issue/result。 | R12.12 family table;Step 15 observation。 |

### 8. R12.11 stop-review

| 检查项 | 结果 |
|---|---|
| 是否只思考 Job / operations recovery 边界 | pass |
| 是否覆盖 job input invalid、partial item failure、checkpoint missing/corrupt、stored report missing | pass |
| 是否覆盖 run history / resume source、manual intervention、no-repair、body-free report boundary | pass |
| 是否形成 R12.12 写入计划 | pass |
| 是否未写 Job / operations 最终恢复表 | pass |
| 是否未写 Step 13 retry/lock/TTL/idempotency/checkpoint resume 算法 | pass |
| 是否未修改正式 `03-详细设计.md` | pass |
| 是否未写 Step 14/15/16 内容、test schema 或 implementation code | pass |

next_allowed_action: 等待用户确认后进入 Step 12 `R12.12 Job / operations recovery 错误恢复:再写入`;只允许写入 Job branch recovery table、8 Job family recovery table、checkpoint / report / run history recovery table、no-repair / body-free / partial table、blocker / handoff table 和 `R12.13` 进入门禁;不得直接修改正式 `03-详细设计.md`;不得写 Step 13 retry/lock/TTL/idempotency/checkpoint resume 算法、Step 14 config key、Step 15 observability schema、Step 16 test case schema 或 implementation code。

---

## R12.12 Job / operations recovery 错误恢复:再写入

### 1. 当前模块目标

`R12.12` 将 `R12.11` 的 Job / operations recovery 思考落成可审计表格。当前模块只写 Job branch recovery table、8 Job family recovery table、checkpoint / report / run history recovery table、no-repair / body-free / partial table、blocker / handoff table 和 `R12.13` 进入门禁;不写 Step 13 retry / checkpoint resume 算法,不修改正式 `03-详细设计.md`。

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm |
| 当前允许 | 写入 Job invalid / unsupported / blocked / duplicate / checkpoint / partial / report / manual intervention 的 family 级恢复表。 |
| 当前禁止 | 写 checkpoint serialization、resume algorithm、retry count、TTL、lease、queue / scheduler 规则、config key、observability schema、test case schema、implementation code 或正式 `03-详细设计.md`。 |

### 2. Job branch recovery table

| job branch | detection / source | public recovery surface | persistence / side-effect boundary | forbidden recovery |
|---|---|---|---|---|
| invalid job input | job family、run ref、scope ref、task refs、target refs、operation context validation failed。 | invalid / rejected job result with safe reason marker。 | no job body;no derived material/progress/checkpoint/report write except formal safe rejection result。 | start job anyway,coerce free-form scope,parse private ref string,write core truth repair。 |
| unsupported job family | job family not in the 8 Operations Job family set。 | unsupported / blocked job result。 | no task planning;stored safe result only when formal shell exists。 | fallback to old seed/replay/rebuild/fingerprint/export job。 |
| runtime or adapter blocked | runtime assembly、adapter availability、job profile、safe execution boundary says blocked / unavailable / degraded。 | blocked / unavailable / degraded job result copied from formal marker。 | no job body if blocked;partial progress only if formal partial branch started before marker。 | derive marker from scheduler state,queue status,exception text or config key。 |
| duplicate / stored replay | job idempotency / resume key hits stored report,checkpoint or run history surface。 | duplicate / replayed job result copied from stored surface。 | no target planning,no material rebuild,no new report except formal replay record if defined。 | rerun job body,recompute material,scan queue,rebuild report from current truth。 |
| checkpoint missing / wrong / corrupt | resume branch requires checkpoint but checkpoint is absent,wrong kind,corrupt or mismatched with run/scope。 | resume_blocked / manual consistency failure。 | no resume body;record safe issue only when formal issue source exists。 | use retry count,queue offset,lease token,timestamp,page cursor or private map as checkpoint。 |
| target planning empty | target planner returns formally empty target set。 | no-op / completed-empty job result with progress/report source。 | progress/report can record empty completion;no derived writes。 | treat empty as failure,scan repository broadly,guess target set from old index。 |
| target planning unavailable | target planner,repository page,availability resolver or runtime support unavailable before item work。 | unavailable / blocked job result with copied marker。 | no item/page UoW unless formal partial work already began。 | loop retry in Step 12,expose adapter error,substitute cached/private target batch。 |
| target item missing / mismatch | loaded target ref missing,wrong owner/scope/kind,or linked material mismatch during item/page work。 | partial / degraded item issue or consistency defect。 | item/page UoW may roll back that unit;progress/report records safe issue if formal marker exists。 | silently skip item,repair truth,collapse partial to success,create missing target。 |
| partial item failure | one item/page fails after prior items/pages succeeded。 | partial / completed-with-issues job result。 | preserve committed prior units;record safe issue/progress/checkpoint/report for failed unit when formal。 | roll back entire run without rule,hide partial in success counter,store raw error body。 |
| derived material save failure | derived read/trace/peripheral material write fails within item/page UoW。 | failed item / partial run / consistency unknown depending commit point。 | item/page UoW rollback reverts derived material/progress/checkpoint/report for that unit。 | repair core truth,mark completed,or write report body as evidence。 |
| report / progress / checkpoint persistence failure | job body produces result but report/progress/checkpoint cannot commit。 | consistency unknown / manual intervention surface。 | do not claim completed report;duplicate replay unavailable until durable shell exists。 | claim success without stored report,rerun blindly,delete partial rows without formal recovery。 |
| stored report / run history missing | duplicate,query or observability path needs stored report / run history but durable shell is absent/wrong kind。 | manual consistency failure / replay unavailable。 | no job rerun in Step 12;owning Step 11/13/15 closure required。 | rebuild report from current truth,scan logs,read scheduler history。 |
| body-free report violation | report,issue,evidence,artifact,metrics,log or handoff hint contains raw body。 | body-free violation job result;blocked/failed safe surface。 | persist only safe marker/refs if formal;raw body is excluded。 | store report markdown/JSON body,artifact/archive body,raw log,metrics payload,provider response。 |
| formal intervention required | recovery convergence or protection/impact check says human/upstream action required。 | manual intervention result / recovery issue ref。 | safe issue/report only;core truth unchanged。 | run repair script,auto-adjust truth,hide intervention as completed success。 |

### 3. 8 Job family recovery table

| Operations Job | primary recovery risks | allowed surface | forbidden repair / leakage |
|---|---|---|---|
| `RefreshCatalogAndDefinitionReadMaterialsFlow` | definition/catalog target missing,material builder failure,partial target page。 | partial/degraded report issue,progress/checkpoint marker。 | mutate definition/catalog truth,rebuild from old index,store raw material body。 |
| `RefreshFormalVersionReadMaterialsFlow` | formal version missing,basis summary degraded,version read material refresh failure。 | partial/degraded/unavailable issue with safe refs。 | rerun formalization,create formal version,derive basis from raw external body。 |
| `RefreshConsumptionReadMaterialsFlow` | boundary unavailable,consumption material freshness/availability marker missing。 | partial/unavailable result copied from availability marker。 | redo boundary decision,change consumption truth,guess availability from downstream runtime。 |
| `RefreshRelationDistributionMaterialsFlow` | relation/distribution builder unavailable,linked relation mismatch。 | degraded/partial issue and report boundary。 | repair relation graph,run ranking/recommendation,store traversal/debug body。 |
| `RefreshExternalSummaryReadMaterialsFlow` | external summary missing,adapter unavailable,external body-free violation。 | unavailable/body-free violation issue;safe summary refs only。 | fetch/store external body,parse provider payload,write raw URL/path details。 |
| `RefreshTraceAuditImpactMaterialsFlow` | missing lineage/audit/impact refs,partial trace refresh,raw evidence/log risk。 | partial issue,trace/audit/impact safe refs。 | save raw log,evidence body,audit stream body or artifact archive。 |
| `RunConsistencyRecoveryConvergenceFlow` | unresolved recovery issue,protection/impact mismatch,manual intervention required。 | manual intervention issue/ref and recovery report boundary。 | automatic core truth repair,operator note body as public result,repair script execution。 |
| `RefreshPeripheralReadMaterialsFlow` | package/assembly/peripheral resolver unavailable,marketplace material missing。 | peripheral unavailable/degraded report issue。 | read marketplace transaction body,mutate package/assembly truth,rank external marketplace data。 |

### 4. checkpoint / report / run history recovery table

| support surface issue | detection / source | recovery surface | forbidden recovery |
|---|---|---|---|
| checkpoint absent | resume request lacks formal checkpoint for run/scope when required。 | resume blocked / manual consistency surface。 | use page cursor,version,retry count,queue offset,lease token or timestamp。 |
| checkpoint wrong kind / scope mismatch | checkpoint kind/run/scope does not match job family or task。 | manual consistency failure。 | coerce checkpoint,scan private checkpoint map,continue from first target silently。 |
| checkpoint corrupt / unreadable | checkpoint shell cannot be decoded by formal helper。 | resume blocked / stored surface defect。 | parse raw bytes/string ad hoc,drop checkpoint without issue。 |
| progress marker missing | partial or completed-with-issues path lacks formal progress marker。 | blocker / consistency defect until marker source is closed。 | synthesize marker from item count,log text or worker local state。 |
| run history missing / wrong kind | run history required for replay/report chronology absent or wrong kind。 | replay unavailable / manual consistency surface。 | read scheduler history,worker log,queue events or report body。 |
| stored report missing / wrong kind | duplicate/query/observability needs report shell but report absent/wrong kind。 | stored report consistency failure。 | rerun job body,rebuild report from current truth,return completed。 |
| report persistence failure | report/progress/checkpoint commit fails after item/page result。 | consistency unknown / manual intervention。 | claim report exists,write raw report body elsewhere,blind retry mutation in Step 12。 |
| report body-free violation | report/evidence/artifact/log/metrics body detected in output boundary。 | body-free violation failed/blocked surface。 | persist markdown/JSON report body,artifact/archive body,raw log,metrics payload。 |
| recovery issue source missing | manual/partial/intervention branch lacks formal issue ref or safe diagnostic。 | design blocker / consistency defect。 | create issue text from exception/operator note/private data。 |

### 5. no-repair / body-free / partial table

| axis | required rule | allowed result | forbidden result |
|---|---|---|---|
| no core truth repair | Operations Job cannot create/update/delete/repair core business truth。 | derived material,progress,checkpoint,run history,safe issue,stored report,event candidate hint。 | definition/catalog/formal version/consumption/relation/package/assembly truth mutation。 |
| partial not hidden | Partial target/page failure must be explicit。 | partial/completed-with-issues result,safe issue refs,progress/checkpoint/report marker。 | success-only counter,silent skip,empty success,raw error detail。 |
| duplicate / resume no-rerun | Duplicate/replay/resume copies stored result/report/checkpoint/run history。 | replayed job result or resume-blocked surface。 | rerun job body,recalculate material,scan queue,rebuild public response from truth。 |
| checkpoint separation | checkpoint is job resume anchor only。 | checkpoint ref / progress anchor / partial continuation from formal helper。 | optimistic version,page cursor,truth cursor,retry count,lease token,queue offset。 |
| body-free report | Job report / evidence / artifact / archive / metrics / log outputs remain body-free。 | typed refs,safe summary,boundary ref,markers,safe issue refs。 | report body,markdown,JSON body,archive body,raw log,metrics payload,provider response。 |
| manual intervention | Recovery convergence can require explicit intervention。 | manual issue/ref and recovery summary。 | automatic repair,hidden success,operator note body leakage。 |
| retry deferral | Step 12 classifies retryable/non-retryable/manual/consistency only。 | handoff to Step 13 for retry/resume algorithm。 | retry count,backoff,TTL,lock mode,lease,scheduler policy。 |

### 6. blocker / handoff table

| id | topic | current R12.12 decision | owner / next closure |
|---|---|---|---|
| ML-D03-S12-JOB-HANDOFF-001 | job no-truth-repair | Jobs only write derived/progress/checkpoint/report/issue;truth repair is forbidden。 | Step 16 no-repair tests;R12.15/R12.16 closure audit。 |
| ML-D03-S12-JOB-HANDOFF-002 | checkpoint source | checkpoint absent/wrong/corrupt is resume-blocked/manual,not synthesized。 | Step 13 checkpoint resume/re-entry details。 |
| ML-D03-S12-JOB-HANDOFF-003 | stored report replay | stored report/run history missing is manual consistency failure;job is not rerun。 | Step 13 replay serialization;Step 15 report observability。 |
| ML-D03-S12-JOB-HANDOFF-004 | partial item failure | partial must produce safe issue/progress/report marker or blocker。 | Step 15 report/evidence boundary;Step 16 partial tests。 |
| ML-D03-S12-JOB-HANDOFF-005 | body-free report | report/evidence/artifact/log/metrics body is forbidden in job result/report shell。 | Step 15 safe observability;Step 16 no-body tests。 |
| ML-D03-S12-JOB-HANDOFF-006 | manual intervention | recovery convergence intervention is explicit issue/result,not auto repair。 | Step 15 observation wording;implementation handoff。 |
| ML-D03-S12-JOB-HANDOFF-007 | missing marker/source/schema | missing issue marker,checkpoint schema,report shell or run history source returns to owning Step。 | R12.15/R12.16 cross-step audit。 |

### 7. R12.12 stop-review

| 检查项 | 结果 |
|---|---|
| 是否写入 Job branch recovery table | pass |
| 是否写入 8 Job family recovery table | pass |
| 是否写入 checkpoint / report / run history recovery table | pass |
| 是否写入 no-repair / body-free / partial table | pass |
| 是否写入 blocker / handoff table | pass |
| 是否未写 Step 13 retry/lock/TTL/idempotency/checkpoint resume 算法 | pass |
| 是否未修改正式 `03-详细设计.md` | pass |
| 是否未写 Step 14/15/16 内容、test schema 或 implementation code | pass |

next_allowed_action: 等待用户确认后进入 Step 12 `R12.13 audit / side-effect failure rules:先思考`;只允许思考 accepted success side effect vs rejected/no-write/no side effect、audit/trace/lineage append failure、event candidate / publication / handoff outcome、job report / recovery issue、safe diagnostic / issue refs 和 `R12.14` 写入计划;不得直接修改正式 `03-详细设计.md`;不得写最终 audit / side-effect failure rules 表、Step 13 retry/lock/TTL/idempotency 算法、Step 14 config key、Step 15 observability schema、Step 16 test case schema 或 implementation code。

---

## R12.13 audit / side-effect failure rules:先思考

### 1. 当前模块目标

`R12.13` 只思考 audit / side-effect failure rules 的边界和 `R12.14` 写入计划。当前模块覆盖 accepted success side effect vs rejected/no-write/no side effect、audit/trace/lineage append failure、event candidate / publication / handoff outcome、job report / recovery issue、safe diagnostic / issue refs。当前模块不落最终 side-effect failure table,不写 Step 13 retry / idempotency / lock 算法,不写 Step 15 observability schema,不写 Step 16 test case schema。

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm |
| 当前允许 | 思考 accepted / rejected / no-write / job / publication / handoff 的 side-effect failure 分类、safe marker 来源和 `R12.14` 写入计划。 |
| 当前禁止 | 写最终 R12.14 表、写 retry count / TTL / lease / queue / scheduler 规则、audit log schema、metric / trace payload、evidence artifact schema、config key、test schema、implementation code 或正式 `03-详细设计.md`。 |

### 2. audit / side-effect failure 总边界思考

Step 9 将 Command、Query、Inbound、Outbound、Job 和 Handoff 的处理流拆开;Step 10 将 event candidate、audit/lineage、job report/checkpoint、publication/handoff outcome 归为不同状态面;Step 11 又限定了 transaction boundary 和 no-rollback boundary。因此 R12.14 不能把所有“副作用失败”写成同一种错误。必须先区分副作用是否在 accepted UoW 内、是否发生在 commit 之后、是否只是 safe observation、是否是 public response 的正式组成部分。

| side-effect class | R12.13 思考裁决 | R12.14 应写入方向 |
|---|---|---|
| accepted UoW side effect | accepted command/job item UoW 内的 stored result、audit/trace/lineage/history ref、derived progress/report shell 必须随同 UoW 原子成功或失败。 | 若 UoW 内 side effect 写失败,accepted result 不得被声明成功;按 rollback / consistency unknown 分类。 |
| post-commit observation | publisher outcome、handoff outcome、post-commit audit observation、safe report emission 不回滚已提交 truth。 | 写成 post-commit side-effect failure / outcome failure;不得改变 accepted truth。 |
| query no-write | Query 不写 audit、event candidate、job、material repair、stored result 或 side-effect outcome。 | Query degraded/unavailable 只返回 surface;不产生 success side effect。 |
| inbound receipt | accepted inbound 可以写 intake summary / receipt / optional event candidate hint,但不是 core truth mutation。 | receipt 写失败需有 safe intake failure surface;不得以 raw body 做补偿。 |
| outbound / handoff outcome | publication/handoff 只写 body-free outcome / marker;不代表外部 truth 保证。 | outcome 写失败是 local consistency / manual issue,不是外部 delivery truth。 |
| job report / recovery issue | Job 可写 derived material、progress、checkpoint、report shell、safe issue。 | report/issue 写失败不允许隐藏 partial/failure,也不得修 core truth。 |

### 3. accepted success vs rejected/no-write side-effect 思考

R12.14 需要把 “谁可以产生 success side effect” 写清。accepted success 的 side effect 必须由正式 flow 拥有;rejected/no-write/degraded 不能借用 success side effect 来制造可观察假象。

| flow branch | side-effect thinking | forbidden interpretation |
|---|---|---|
| accepted command | 可以在正式拥有的对象族上写 history / trace / audit / lineage ref、stored accepted result、event candidate shell 或 maintenance hint。 | post-commit publisher/handoff 失败不能把 command 改成 rejected。 |
| command rejected | 可以返回 protocol rejection;replayable rejected 仅在 Step 8/11 已有正式 stored surface 时可复制。 | 写 success event candidate、success audit body、truth mutation 或 job start。 |
| duplicate accepted replay | 只能复制 stored accepted result / response surface。 | 重跑 command、重建 response、再次 emit success side effect。 |
| query visible / empty / degraded / unavailable | 只返回 public query surface。 | 写 material repair、audit success、event candidate、stored result 或 start job。 |
| inbound accepted receipt | 可以写 safe intake / receipt / optional event candidate hint。 | 直接突变 core truth 或持久化 raw inbound payload。 |
| job completed / partial | 可以写 report shell、progress、checkpoint、safe issue和候选 hint。 | 把 partial 隐藏为 full success,或用 job 修 core truth。 |

### 4. audit / trace / lineage append failure 思考

Audit、trace、lineage 不是一个统一“日志”。它们在当前 L3 中都必须保持 body-free,并且失败处理依赖它们所在的边界。

| append position | R12.13 thinking | R12.14 应闭口 |
|---|---|---|
| inside accepted UoW | append failure 与 accepted write 同属原子边界。 | UoW rollback 后返回 accepted write failure / consistency-safe error;不得声明 accepted success。 |
| inside job item/page UoW | append failure 与该 item/page 的 derived material/progress/report 同属 item/page 边界。 | 该 unit 失败或 partial;不能隐藏。 |
| post-commit / deferred observation | append failure 发生在 truth commit 之后。 | 不回滚 truth;产生 safe side-effect failure outcome / issue ref if formal。 |
| unavailable audit store | availability marker 必须来自正式 port/resolver/output。 | 可分类 retryable/unavailable,但 retry 算法留 Step 13。 |
| marker / issue source missing | side-effect failure 要公开时缺 formal safe diagnostic / issue ref。 | 记录 blocker;implementation 不得从 exception text 合成。 |
| raw log / evidence body risk | audit/trace/lineage append 不得泄漏 raw method body、provider payload、stack trace、artifact body。 | body-free violation surface;Step 15 才定义 observability schema。 |

### 5. event candidate / publication / handoff outcome 思考

Event candidate、publication outcome 和 handoff outcome 是三个不同层次。candidate 是本地 body-free 候选事实,publication / handoff 是后续 side-effect outcome。R12.14 必须防止将 “candidate assembled” 误写成 “external delivered”。

| concern | R12.13 thinking | R12.14 应写入方向 |
|---|---|---|
| event candidate source | 候选只能来自 accepted command、completed/partial job、bounded inbound intake 等已提交 body-free fact。 | candidate source missing -> consistency/manual;不得从 current truth 重建。 |
| candidate assembly failure | 若在 accepted UoW 内失败,按 UoW 边界失败;若在 post-commit worker 中失败,按 candidate failure outcome。 | 不把 assembly failure 等同 publisher unavailable。 |
| publisher unavailable / failed | publication failure 不回滚 candidate source。 | safe publication outcome / marker;retry details deferred Step 13。 |
| handoff prepared / delivered / failed | handoff outcome 是 body-free local outcome,delivered 只表示正式 receipt marker。 | 不存外部 receipt payload,不声称外部 truth。 |
| outcome persistence failure | port 已返回 outcome,但 local outcome shell 未持久化。 | consistency unknown / manual;不得声称后续 replay 可用。 |

### 6. safe diagnostic / issue refs 思考

所有 public failure / degraded / unavailable / side-effect issue 都必须复制正式 source。R12.14 需要把 source table 写清,并把缺口列入 blocker。

| safe source | 允许用途 | 缺失时裁决 |
|---|---|---|
| policy diagnostic builder | invalid request、forbidden body、domain rejected 的 safe reason。 | design blocker 或 generic safe rejection only if protocol already defines。 |
| degraded / material mapper | query degraded、partial item、material missing 的 marker / kind。 | 不得合成 marker;暂停回 owning Step。 |
| availability resolver / port outcome | unavailable、blocked、publisher/handoff failure。 | 不能从 adapter exception 或 status code 拼 marker。 |
| recovery issue repository | manual intervention、partial job issue、consistency defect。 | 不能把 operator note / raw exception 当 public issue。 |
| stored result / report shell | duplicate replay、job report replay、receipt replay。 | missing -> manual consistency failure;不 rerun body。 |
| body-free helper / redaction boundary | raw body leak / forbidden payload / evidence body violation。 | raw body excluded;只返回 safe marker if formal。 |

### 7. R12.14 写入计划思考

`R12.14` 应将本模块思考落成可审计表格,但仍不进入 Step 13~16。

| write block | should write | should not write |
|---|---|---|
| accepted / rejected / no-write side-effect table | 哪些 branch 允许 success side effect,哪些 branch 只返回 rejection/query surface/receipt/outcome。 | retry/idempotency 算法,transport status 数字。 |
| audit / trace / lineage append failure table | inside UoW、inside job unit、post-commit/deferred、availability unavailable、marker missing、body-free violation。 | audit log schema,trace span fields,metric labels。 |
| event candidate / publication / handoff outcome table | candidate source,assembly failure,publisher failed,handoff delivered/failed,outcome persistence failure。 | topic/config key,external delivery guarantee,raw receipt body。 |
| safe diagnostic / issue-ref source table | policy diagnostic、degraded mapper、availability outcome、recovery issue、stored shell、body-free helper。 | synthesized marker,exception text,private fake map。 |
| blocker / handoff table | missing source/marker/schema/outcome shell -> owning Step / Step 13~16 handoff。 | implementation fallback。 |

### 8. watch / blocker 思考

| id | topic | issue | handling in R12.13 | required closure |
|---|---|---|---|---|
| ML-D03-S12-SIDE-WATCH-001 | accepted side-effect atomicity | UoW-contained side effect failure cannot coexist with accepted success。 | R12.13 classifies as rollback / consistency-safe failure。 | R12.14 atomic side-effect table;Step 13 commit unknown details。 |
| ML-D03-S12-SIDE-WATCH-002 | query no-write | Query degraded/unavailable must not write audit/event/job/material repair。 | R12.13 keeps query side-effect-free。 | R12.14 no-write table;Step 16 tests later。 |
| ML-D03-S12-SIDE-WATCH-003 | post-commit no rollback | Publication/handoff/post-commit audit failure must not roll back committed truth。 | R12.13 separates post-commit outcome from truth。 | R12.14 outcome table;Step 13 retry guard。 |
| ML-D03-S12-SIDE-WATCH-004 | safe diagnostic source | Issue/marker must come from formal mapper/resolver/repository/output。 | R12.13 forbids synthesized marker。 | R12.14 source table;R12.15/R12.16 closure audit。 |
| ML-D03-S12-SIDE-WATCH-005 | outcome persistence | Port outcome without durable local outcome creates replay/report ambiguity。 | R12.13 classifies as consistency unknown / manual。 | R12.14 outcome persistence row;Step 15 observability wording。 |
| ML-D03-S12-SIDE-WATCH-006 | body-free side effect | audit/event/report/handoff side effects cannot carry raw bodies。 | R12.13 keeps refs/markers/safe summaries only。 | R12.14 body-free rows;Step 16 redline tests。 |

### 9. R12.13 stop-review

| 检查项 | 结果 |
|---|---|
| 是否只思考 audit / side-effect failure rules | pass |
| 是否覆盖 accepted success vs rejected/no-write/no side-effect | pass |
| 是否覆盖 audit/trace/lineage append failure | pass |
| 是否覆盖 event candidate / publication / handoff outcome | pass |
| 是否覆盖 safe diagnostic / issue refs 来源 | pass |
| 是否形成 R12.14 写入计划 | pass |
| 是否未写最终 audit / side-effect failure rules 表 | pass |
| 是否未写 Step 13 retry/lock/TTL/idempotency 算法 | pass |
| 是否未修改正式 `03-详细设计.md` | pass |
| 是否未写 Step 14/15/16 内容、test schema 或 implementation code | pass |

next_allowed_action: 等待用户确认后进入 Step 12 `R12.14 audit / side-effect failure rules:再写入`;只允许写入 accepted / rejected / no-write side-effect table、audit / trace / lineage append failure table、event candidate / publication / handoff outcome table、safe diagnostic / issue-ref source table、blocker / handoff table 和 `R12.15` 进入门禁;不得直接修改正式 `03-详细设计.md`;不得写 Step 13 retry/lock/TTL/idempotency 算法、Step 14 config key、Step 15 observability schema、Step 16 test case schema 或 implementation code。

---

## R12.14 audit / side-effect failure rules:再写入

### 1. 当前模块目标

`R12.14` 将 `R12.13` 的 audit / side-effect failure 思考落成可审计表格。当前模块只写 accepted / rejected / no-write side-effect table、audit / trace / lineage append failure table、event candidate / publication / handoff outcome table、safe diagnostic / issue-ref source table、blocker / handoff table 和 `R12.15` 进入门禁;不写 Step 13 retry / idempotency / lock 算法,不修改正式 `03-详细设计.md`。

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm |
| 当前允许 | 写入 side-effect 允许/禁止规则、append failure recovery、candidate/publication/handoff outcome recovery、safe diagnostic source 和 handoff blocker。 |
| 当前禁止 | 写 retry count、TTL、lease、queue / scheduler 规则、topic/config key、audit log schema、metric / trace payload、evidence artifact schema、test schema、implementation code 或正式 `03-详细设计.md`。 |

### 2. accepted / rejected / no-write side-effect table

| branch | allowed side effect | failure / recovery surface | forbidden side effect |
|---|---|---|---|
| request invalid before reserve | safe invalid rejection only;no business UoW。 | invalid request / safe rejection;caller correction required。 | stored accepted result,event candidate,success audit,truth mutation。 |
| domain / policy rejected before accepted mutation | safe rejection;replayable rejected stored surface only when Step 8/11 formally defines it。 | domain rejected / policy rejected safe surface。 | accepted truth write,success trace,audit success,event candidate,job start。 |
| version / optimistic conflict | no accepted side effect after rollback。 | conflict / reload-required safe surface;retry classification only。 | blind retry,emit event candidate,append success audit,claim accepted。 |
| accepted command UoW success | truth/support/material save,body-free history/trace/audit/lineage refs,stored accepted result,event candidate shell when owned。 | accepted response;post-commit publication/handoff failure remains separate。 | raw audit body,external delivery claim,success without stored result when required。 |
| accepted UoW failure before commit | no accepted side effect survives rollback。 | safe failure / unavailable / consistency-safe surface according to failing source。 | partial accepted result,orphan event candidate,publisher/handoff execution。 |
| commit unknown | no further side effect until stored surface / commit state is resolved by formal source。 | manual consistency / commit unknown safe surface。 | rerun mutation,duplicate event,guess commit from logs。 |
| duplicate accepted replay | copy stored accepted response/result only。 | replayed accepted surface or stored result missing consistency failure。 | rerun command,new audit/event candidate,new truth write。 |
| duplicate rejected replay | copy stored rejected surface only if formal。 | replayed rejection or stored rejection missing consistency failure。 | convert rejected to accepted,write success event,rebuild from current truth。 |
| query visible / empty / not-visible / degraded / unavailable | public query surface only。 | query surface with copied marker / safe diagnostic。 | material repair,refresh,trace/audit append,event candidate,stored result,job start。 |
| inbound accepted receipt | intake summary、body-free receipt、optional event candidate hint if formal。 | intake accepted / duplicate receipt / intake failure safe surface。 | core truth mutation,raw payload persistence,definition/formal version creation。 |
| outbound publication | publication outcome only,after candidate source exists。 | published / blocked / unavailable / failed outcome copied from publisher output。 | rollback source truth,delete candidate,claim subscriber delivered truth。 |
| handoff outcome | prepared/delivered/failed/blocked body-free marker only。 | handoff safe outcome copied from port / registry。 | external receipt payload,archive/package body,external truth guarantee。 |
| job completed / partial | derived material,progress,checkpoint,run history,report shell,safe issue,event candidate hint。 | completed / partial / failed / manual intervention job result。 | core truth repair,raw report/log/evidence body,hidden partial success。 |

### 3. audit / trace / lineage append failure table

| append failure branch | detection / source | recovery surface | persistence / transaction boundary | forbidden recovery |
|---|---|---|---|---|
| append inside accepted command UoW fails | repository/UoW append of history、trace、audit or lineage ref fails before commit。 | accepted write failure / unavailable / consistency-safe failure。 | entire accepted UoW rolls back;stored accepted result and event candidate must not survive。 | claim accepted,write stored result separately,publish candidate,store raw audit log。 |
| append inside job item/page UoW fails | trace/audit/impact append or derived material relation append fails within job item/page unit。 | item failed / partial run / consistency issue。 | item/page UoW rolls back according to Step 11;progress/report records safe issue only if formal。 | hide failure as completed,repair core truth,store raw evidence/log body。 |
| append after commit / deferred observation fails | post-commit audit/trace/lineage observation cannot be written after truth/report/candidate commit。 | post-commit side-effect failure / manual issue if formal。 | committed truth/report/candidate is not rolled back。 | alter accepted result,mark command rejected,rerun mutation,delete source truth。 |
| append store unavailable | formal repository/port/availability source marks append store unavailable。 | unavailable / retryable classification if marker says temporary;algorithm deferred。 | no raw exception in public surface;safe marker copied only。 | infer marker from SQL/HTTP/IO code,endpoint,secret,stack trace。 |
| append marker / issue source missing | branch needs public side-effect failure marker but Step 6~11 did not define source。 | design blocker / consistency defect。 | stop implementation until owning Step closes source。 | synthesize issue ref from exception text,operator note or private map。 |
| duplicate append risk | duplicate/replay branch would append the same success trace/audit again。 | no new append;copy stored replay surface。 | duplicate replay remains read-only relative to side effects。 | append “duplicate observed” as success audit without formal observation rule。 |
| body-free violation | append candidate contains raw method body、provider payload、raw log、stack trace、artifact/evidence body。 | body-free violation failed/blocked surface。 | only safe refs/markers may persist。 | redact ad hoc and keep body,store archive/log/evidence payload elsewhere。 |

### 4. event candidate / publication / handoff outcome table

| branch | formal source | recovery surface | no-rollback rule | forbidden recovery |
|---|---|---|---|---|
| candidate source missing | accepted result、job report、intake receipt or body-free fact ref absent/wrong kind。 | candidate_source_missing / manual consistency failure。 | no publication attempt;source truth is not reconstructed。 | reread current truth to rebuild candidate,scan logs,parse payload。 |
| candidate assembly invalid | candidate shell lacks typed refs/markers,has source mismatch or body-free violation。 | candidate_invalid / publication_blocked safe outcome。 | source truth/report/receipt remains committed。 | publish partial body,strip fields silently,store raw event payload。 |
| candidate assembly fails inside accepted UoW | candidate is part of accepted UoW and assembly/save fails before commit。 | accepted UoW failure;accepted not proven。 | UoW rollback includes truth/support/result/candidate。 | save truth without required result/candidate when boundary says atomic。 |
| candidate assembly fails post-commit | asynchronous candidate assembly fails after source fact committed。 | post-commit candidate failure / manual issue if formal。 | committed source fact not rolled back。 | mutate source fact,claim accepted failed,rerun original command/job。 |
| publisher target blocked | target registry / publisher policy marks target blocked or unsupported。 | publication_blocked / unsupported outcome。 | candidate remains;truth source remains。 | choose alternate target,override blocked config,delete candidate。 |
| publisher unavailable | publisher port / adapter / runtime binding unavailable。 | publication_unavailable outcome with copied marker。 | no truth rollback;retry scheduling deferred to Step 13。 | expose transport status,endpoint,secret,raw provider response。 |
| publisher failed | publisher returns safe failed outcome。 | publication_failed outcome with safe reason marker。 | candidate source stays committed。 | mark command/job rejected,change candidate source,claim subscriber state。 |
| publication outcome persistence failure | publisher returns outcome but local durable outcome shell cannot be saved。 | consistency unknown / manual intervention。 | do not claim replay/report can prove outcome。 | store raw receipt as fallback,blind republish without guard。 |
| handoff prepared | handoff material is body-free and ready but not delivered。 | handoff_prepared marker。 | prepared is not delivered truth。 | claim delivered,store package/archive/report body。 |
| handoff delivered | handoff port returns formal body-free delivered receipt marker。 | handoff_delivered outcome。 | delivered means local safe marker only。 | persist external receipt payload or guarantee downstream business truth。 |
| handoff failed / blocked / unavailable | port/registry/policy returns safe failed/blocked/unavailable marker。 | handoff_failed / blocked / unavailable outcome。 | local source truth/report/candidate remains committed。 | rollback source,overwrite report,leak raw external error。 |
| handoff outcome persistence failure | outcome marker cannot be saved durably after port result。 | consistency unknown / manual issue。 | no claim of durable handoff state。 | rerun handoff blindly,store raw response,alter committed source。 |

### 5. safe diagnostic / issue-ref source table

| public marker / issue need | allowed formal source | allowed use | missing-source recovery |
|---|---|---|---|
| invalid request safe reason | command/query/inbound validator or policy diagnostic builder。 | protocol rejection / invalid surface。 | design blocker unless generic safe rejection is already formal。 |
| domain / policy rejected reason | domain transition guard,policy diagnostic builder,body-free helper。 | command rejection / boundary violation surface。 | no synthesized message from raw input or exception。 |
| degraded / partial marker | degraded mapper、partiality marker、material mapper、safe diagnostic summary。 | query degraded / partial job / partial page surface。 | consistency defect / blocker;service must not infer。 |
| unavailable / blocked marker | availability resolver、adapter availability summary、publisher/handoff port outcome、runtime binding summary。 | unavailable/blocked publication,handoff,job or query surface。 | no marker from transport code,config value or endpoint。 |
| manual intervention issue | recovery issue repository、consistency protection diagnostic、job report issue shell。 | manual intervention / consistency defect / partial report。 | no issue text from operator note,raw log or exception body。 |
| duplicate replay surface | stored result / stored receipt / stored report / run history shell。 | replayed accepted/rejected/inbound/job result。 | missing -> stored surface consistency failure;no rerun。 |
| event candidate source | accepted command effect、job report/hint、bounded inbound receipt/body-free fact。 | candidate assembly input。 | candidate source missing;do not read current truth。 |
| handoff delivered marker | handoff port body-free receipt marker / target registry outcome。 | handoff delivered surface。 | delivered cannot be claimed。 |
| body-free violation marker | body-boundary helper / redaction boundary / safe diagnostic builder。 | blocked/failed body-free violation surface。 | raw body excluded;missing marker is blocker。 |
| observation-only diagnostic | Step 15 observability contract after it exists。 | logs/metrics/traces only after Step 15。 | Step 12 cannot invent metric/span/evidence schema。 |

### 6. blocker / handoff table

| id | topic | current R12.14 decision | owner / next closure |
|---|---|---|---|
| ML-D03-S12-SIDE-HANDOFF-001 | accepted side-effect atomicity | UoW-contained side effects are atomic with accepted mutation;failure prevents accepted success。 | Step 13 commit unknown/retry guard;R12.15/R12.16 closure audit。 |
| ML-D03-S12-SIDE-HANDOFF-002 | query no-write | Query branches never emit success side effects or repair material。 | Step 16 no-write tests;Step 15 safe observability only。 |
| ML-D03-S12-SIDE-HANDOFF-003 | post-commit no rollback | Publication/handoff/post-commit audit failure never rolls back committed source truth/report/candidate。 | Step 13 retry/re-entry guard;Step 15 outcome observation。 |
| ML-D03-S12-SIDE-HANDOFF-004 | candidate vs delivery separation | Candidate assembled does not mean publication delivered;handoff delivered means body-free receipt marker only。 | Step 15 wording;Step 16 no-external-truth tests。 |
| ML-D03-S12-SIDE-HANDOFF-005 | outcome persistence failure | Port outcome without durable local outcome is consistency unknown/manual,not success。 | Step 13 replay/retry guard;Step 15 report surface。 |
| ML-D03-S12-SIDE-HANDOFF-006 | safe diagnostic source | Public issue/marker/source must come from formal mapper/resolver/repository/port output。 | R12.15/R12.16 cross-step audit checks missing sources。 |
| ML-D03-S12-SIDE-HANDOFF-007 | body-free side effect | audit/event/report/handoff side effects carry refs/markers/summaries only。 | Step 15 observability schema;Step 16 redline tests。 |
| ML-D03-S12-SIDE-HANDOFF-008 | Step 13~16 deferral | retry/lock/TTL/config/observability/test schema are not closed in R12.14。 | Step 13,Step 14,Step 15,Step 16。 |

### 7. R12.14 stop-review

| 检查项 | 结果 |
|---|---|
| 是否写入 accepted / rejected / no-write side-effect table | pass |
| 是否写入 audit / trace / lineage append failure table | pass |
| 是否写入 event candidate / publication / handoff outcome table | pass |
| 是否写入 safe diagnostic / issue-ref source table | pass |
| 是否写入 blocker / handoff table | pass |
| 是否未写 Step 13 retry/lock/TTL/idempotency 算法 | pass |
| 是否未写 Step 14 config key | pass |
| 是否未写 Step 15 observability schema | pass |
| 是否未写 Step 16 test case schema | pass |
| 是否未修改正式 `03-详细设计.md` | pass |

next_allowed_action: 等待用户确认后进入 Step 12 `R12.15 cross-step closure audit 与正式 §11 候选草稿停审:先思考`;只允许思考 Step 6~11 错误恢复闭环审计、Step 12 已完成表格覆盖、正式 `03-详细设计.md` §11 候选草稿结构、open blocker / watch 汇总和 Step 13 handoff;不得直接修改正式 `03-详细设计.md`;不得写最终 closure audit / §11 候选草稿、Step 13 retry/lock/TTL/idempotency 算法、Step 14 config key、Step 15 observability schema、Step 16 test case schema 或 implementation code。

---

## R12.15 cross-step closure audit 与正式 §11 候选草稿停审:先思考

### 1. 当前模块目标

`R12.15` 只思考 Step 12 收口方式,为 `R12.16` 写入 cross-step closure audit、正式 `03-详细设计.md` §11 候选草稿和 Step 13 handoff 做准备。当前模块不写最终 closure audit 表,不写完整正式 §11 候选草稿,不修改正式 `03-详细设计.md`。

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm |
| 当前允许 | 思考 Step 6~11 错误恢复闭环审计、Step 12 已完成表格覆盖、正式 §11 候选草稿结构、open blocker / watch 汇总和 Step 13 handoff。 |
| 当前禁止 | 写最终 closure audit / §11 候选草稿、Step 13 retry/lock/TTL/idempotency 算法、Step 14 config key、Step 15 observability schema、Step 16 test case schema、implementation code 或正式 `03-详细设计.md`。 |

### 2. Step 6~11 错误恢复闭环审计思考

R12.16 需要逐项证明 Step 12 的错误模型已经承接 Step 6~11,但不能把 closure audit 写成泛泛的 pass。审计应按“来源 Step -> 错误/恢复要求 -> Step 12 落点 -> 未闭口项”展开。

| source Step | R12.15 审计关注 | R12.16 应写入方式 |
|---|---|---|
| Step 6 object contracts | object factory/transition guard、marker/helper、stored result/report/handoff helper 的错误来源是否进入 Step 12。 | 对照 object / marker / helper family,列出已覆盖表格和缺口。 |
| Step 7 trait / port / adapter | repository/resolver/mapper/publisher/handoff/UoW/result-store/runtime failure 是否有 safe surface 和 source rule。 | 对照 port family,审计 marker/source 不得由 implementation 合成。 |
| Step 8 protocol contracts | Command rejection、Query surface、Inbound receipt、Outbound outcome、Job result/report、Handoff outcome 是否有映射。 | 对照 public surface family,审计 stored replay / safe marker / body-free requirement。 |
| Step 9 function flows | 58 Command、57 Query、4 Inbound、34 Outbound、8 Job 的异常分支是否都能落到 Step 12 表格族。 | 按 flow family 做覆盖汇总,不逐条复制 161 个 flow card。 |
| Step 10 state matrix | invalid/blocked/degraded/unavailable/partial/failed/manual/stale 等状态是否进入错误恢复分类。 | 按 state family 审计状态与 public recovery surface。 |
| Step 11 persistence / transaction | UoW atomicity、query no-write、stored replay no-rerun、publication/handoff no rollback、body-free persistence 是否被 Step 12 承接。 | 对照 transaction/consistency rules,列出 Step 12 对应表格。 |

### 3. Step 12 已完成表格覆盖思考

R12.16 应把 R12.1~R12.14 的输出收成一个覆盖索引,方便后续 Step 13~16 和正式 §11 装配使用。

| Step 12 output family | 已完成模块 | coverage thinking |
|---|---|---|
| opening / source baseline | R12.1/R12.2 | 输入基线、旧材料排除、SOP 五问、模块计划已闭口。 |
| error layer / type families | R12.3/R12.4 | domain/application/port/protocol/worker/job 层级、retry/manual/source-backref 已闭口。 |
| Command recovery | R12.5/R12.6 | invalid/rejected/conflict/duplicate/stored result/commit unknown/dependency/side-effect 已闭口。 |
| Query recovery | R12.7/R12.8 | safe absent/not-visible/stale/degraded/unavailable/partial/material/source missing/no-write 已闭口。 |
| Inbound / Outbound / Handoff recovery | R12.9/R12.10 | intake/receipt/publication/handoff/no-rollback/body-free 已闭口。 |
| Job / operations recovery | R12.11/R12.12 | invalid input/unsupported/runtime blocked/partial/checkpoint/report/run history/manual/no-repair 已闭口。 |
| audit / side-effect failure | R12.13/R12.14 | accepted/rejected/no-write side effect、append failure、candidate/publication/handoff outcome、diagnostic source 已闭口。 |

### 4. 正式 §11 候选草稿结构思考

正式 `03-详细设计.md` §11 是 Step 12 的回填目标。R12.16 可以形成候选草稿,但仍不能直接修改正式文档。候选草稿应比中间产物更凝练,但必须保留可落码表格。

| §11 candidate block | 应包含 | 不应包含 |
|---|---|---|
| §11.1 错误模型目标与非目标 | scope、old material exclusion、no HTTP/RPC number、no retry/config/observability/test schema。 | 重复全部 R12.1~R12.2 台账文本。 |
| §11.2 错误层级与类型族 | error layer table、type family table、retryability/manual/source-backref principle。 | 未定义 enum 代码或实现语言细节。 |
| §11.3 Command 错误恢复 | Command branch error、transaction/side-effect、safe surface、blocker/handoff。 | Step 13 幂等算法。 |
| §11.4 Query 错误恢复 | Query surface、no-write、partial/material missing、marker source。 | query repair / refresh / metrics schema。 |
| §11.5 Inbound / Outbound / Handoff 错误恢复 | receipt/outcome/no-rollback/body-free/marker source。 | topic/config key、external delivery guarantee。 |
| §11.6 Job / operations recovery | Job branch、8 family recovery、checkpoint/report/run history、no-repair/body-free/partial。 | checkpoint resume algorithm、scheduler policy。 |
| §11.7 audit / side-effect failure rules | accepted/rejected/no-write side effect、append failure、candidate/publication/handoff outcome、safe diagnostic sources。 | audit log schema、trace span schema。 |
| §11.8 cross-step closure and handoff | Step 6~11 closure audit、open blockers/watch、Step 13~16 handoff。 | 直接开始 Step 13/14/15/16 内容。 |

### 5. open blocker / watch 汇总思考

R12.16 需要把 watch / handoff 项收敛为“仍需后续 Step 承接”的清单,而不是新开设计缺口。当前已知 watch 多数是后续 Step 的正常 handoff,不是阻止 Step 12 收口的 blocker。

| category | R12.15 初判 | R12.16 应写入方式 |
|---|---|---|
| marker/source missing | 若 Step 6~11 未定义正式 marker/source,implementation 不能补。 | 在 closure audit 中标记 blocker_if_missing_formal_source。 |
| stored replay / stored report missing | duplicate replay/job report missing 不可 rerun。 | handoff 到 Step 13 replay/idempotency,Step 15 reporting。 |
| retry / lock / TTL | Step 12 只分类 retryable/non-retryable/manual。 | handoff 到 Step 13。 |
| config / binding | Step 12 不定义 topic、URL、secret、binding key。 | handoff 到 Step 14。 |
| observability / audit schema | Step 12 只说 safe diagnostic / issue ref,不定义 metric/log/span/evidence schema。 | handoff 到 Step 15。 |
| tests / evidence | Step 12 不写 test case schema。 | handoff 到 Step 16。 |
| formal document assembly | Step 12 形成 §11 候选,不直接改正式 03。 | Step 19 或指定正式回填模块装配。 |

### 6. Step 13 handoff 思考

Step 13 将进入并发、幂等与重入保护。R12.16 的 handoff 必须明确 Step 13 只接收“错误分类与恢复语义”,不能倒回来改变 Step 12 的 public surface。

| Step 13 input need | Step 12 提供什么 | Step 13 不应改变什么 |
|---|---|---|
| duplicate replay | stored result/receipt/report missing -> consistency failure;no rerun。 | 不把 replay 缺口改成重跑 command/job。 |
| commit unknown | safe manual/consistency surface。 | 不用 retry 算法声明已 accepted。 |
| version conflict | conflict/reload-required classification。 | 不把 checkpoint/page cursor 当 optimistic version。 |
| retryable unavailable | temporary/unavailable marker copy-only。 | 不从 adapter exception 推 retryability。 |
| post-commit outcome retry | no rollback truth/candidate/report。 | 不让 publisher/handoff failure 改变 accepted source。 |
| checkpoint resume | checkpoint absent/wrong/corrupt -> resume blocked/manual。 | 不从 queue offset、lease、timestamp 补 checkpoint。 |

### 7. R12.16 写入计划思考

`R12.16` 应写入最终收口材料,并把 Step 12 标记为 completed_wait_user_confirm_to_step13。

| write block | should write | should not write |
|---|---|---|
| Step 6~11 closure audit table | source Step、required closure、Step 12 coverage、remaining handoff。 | 逐字复制 Step 6~11 全文。 |
| Step 12 coverage index | R12.1~R12.14 输出族到正式 §11 的映射。 | 再展开新的错误模型。 |
| formal §11 candidate draft | 凝练可装配的 §11.1~§11.8 候选草稿。 | 修改正式 `03-详细设计.md`。 |
| open blocker / watch / handoff table | marker/source、stored replay、retry、config、observability、test handoff。 | 把后续 Step 内容提前闭口。 |
| Step 13 entry gate | 明确 Step 13 next_allowed_action 和禁止项。 | 写 Step 13 算法。 |

### 8. R12.15 stop-review

| 检查项 | 结果 |
|---|---|
| 是否只思考 cross-step closure audit 与正式 §11 候选草稿 | pass |
| 是否覆盖 Step 6~11 错误恢复闭环审计方法 | pass |
| 是否覆盖 Step 12 已完成表格覆盖索引 | pass |
| 是否覆盖正式 §11 候选草稿结构 | pass |
| 是否覆盖 open blocker / watch 汇总和 Step 13 handoff | pass |
| 是否形成 R12.16 写入计划 | pass |
| 是否未写最终 closure audit / §11 候选草稿 | pass |
| 是否未修改正式 `03-详细设计.md` | pass |
| 是否未写 Step 13/14/15/16 内容、test schema 或 implementation code | pass |

next_allowed_action: 等待用户确认后进入 Step 12 `R12.16 cross-step closure audit 与正式 §11 候选草稿停审:再写入`;只允许写入 Step 6~11 closure audit table、Step 12 coverage index、正式 §11 candidate draft、open blocker / watch / handoff table、Step 13 entry gate 和 Step 12 stop-review;不得直接修改正式 `03-详细设计.md`;不得写 Step 13 retry/lock/TTL/idempotency 算法、Step 14 config key、Step 15 observability schema、Step 16 test case schema 或 implementation code。

---

## R12.16 cross-step closure audit 与正式 §11 候选草稿停审:再写入

### 1. 当前模块目标

`R12.16` 将 Step 12 的错误模型、异常分支与恢复口径收口为可装配候选材料。当前模块写入 Step 6~11 closure audit table、Step 12 coverage index、正式 §11 candidate draft、open blocker / watch / handoff table、Step 13 entry gate 和 Step 12 stop-review。当前模块仍不修改正式 `03-详细设计.md`,也不写 Step 13 算法。

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm |
| 当前允许 | 写入 Step 12 收口审计、§11 候选草稿和 Step 13 进入门禁。 |
| 当前禁止 | 修改正式 `03-详细设计.md`;写 Step 13 retry/lock/TTL/idempotency 算法、Step 14 config key、Step 15 observability schema、Step 16 test case schema 或 implementation code。 |

### 2. Step 6~11 closure audit table

| source Step | required error / recovery closure | Step 12 coverage | remaining handoff |
|---|---|---|---|
| Step 6 object contracts | object factory/transition guard、marker/helper、stored result/report/handoff helper failure must map to typed error family and safe recovery surface。 | R12.3/R12.4 type families;R12.5~R12.14 branch tables;safe source and blocker rules。 | Missing object/marker/helper source remains blocker_if_missing_formal_source。 |
| Step 7 trait / port / adapter | repository/resolver/mapper/publisher/handoff/UoW/result-store/runtime failures must expose safe marker/source,not raw adapter error。 | R12.4 source-backref;R12.8 marker-source;R12.10 outcome markers;R12.14 safe diagnostic source table。 | Retry/re-entry behavior deferred to Step 13;binding/config source deferred to Step 14。 |
| Step 8 protocol contracts | Command rejection、Query surface、Inbound receipt、Outbound outcome、Job result/report、Handoff outcome need public safe mapping。 | R12.6 Command safe surface;R12.8 Query surface;R12.10 receipt/outcome;R12.12 Job result/report;R12.14 side-effect surfaces。 | Transport status numeric mapping remains out of Step 12 unless later protocol adapter Step requires。 |
| Step 9 function flows | Command/Query/Inbound/Outbound/Job branches need error handling,rollback/no-rollback,and side-effect boundary。 | R12.5~R12.14 map all flow families at branch/family granularity;query no-write and no-rerun are explicit。 | Step 13 owns precise idempotency/retry/checkpoint algorithms。 |
| Step 10 state machine | invalid/blocked/degraded/unavailable/partial/failed/manual/stale states must enter error/recovery taxonomy。 | R12.4 type families;R12.8 Query degraded/unavailable;R12.10 IOH outcomes;R12.12 Job partial/manual;R12.14 side-effect failure。 | Step 15 may add observability labels but cannot change state semantics。 |
| Step 11 persistence / transaction | accepted UoW atomicity、query no-write、stored replay no-rerun、publication/handoff no rollback、body-free persistence must be reflected in recovery。 | R12.6 command transaction;R12.8 no-write;R12.10 no-rollback/body-free;R12.12 checkpoint/report;R12.14 side-effect atomicity。 | Step 13 owns commit unknown/replay serialization;Step 16 owns tests。 |

### 3. Step 12 coverage index

| Step 12 output family | modules | formal §11 target | status |
|---|---|---|---|
| opening / source baseline | R12.1/R12.2 | §11.1 | completed |
| error layer and type families | R12.3/R12.4 | §11.2 | completed |
| Command recovery | R12.5/R12.6 | §11.3 | completed |
| Query recovery | R12.7/R12.8 | §11.4 | completed |
| Inbound / Outbound / Handoff recovery | R12.9/R12.10 | §11.5 | completed |
| Job / operations recovery | R12.11/R12.12 | §11.6 | completed |
| audit / side-effect failure rules | R12.13/R12.14 | §11.7 | completed |
| cross-step closure and handoff | R12.15/R12.16 | §11.8 | completed_wait_user_confirm |

### 4. 正式 §11 candidate draft

以下内容是正式 `03-详细设计.md` §11 的候选结构和可装配草稿,仍保存在当前中间产物中。Step 19 装配正式文档时必须再次核对 Step 13~18 的新增约束,不得直接机械复制。

#### §11.1 错误模型范围与非目标

L3-method-library 的错误模型覆盖 domain/application/port/protocol/worker/job 层的错误类型、public safe surface 映射、异常分支处理和恢复口径。错误恢复必须回指 Step 6 object/helper/marker、Step 7 port/mapper/resolver、Step 8 protocol surface、Step 9 function flow、Step 10 state matrix 或 Step 11 transaction/consistency contract。

本节不定义 HTTP/RPC 数字、retry count、TTL、lock lease、scheduler lease、config key、topic/URL/secret、metric label、trace span payload、evidence artifact path、test case ID 或 implementation code。旧 `MethodContent`、snapshot、fingerprint、old outbox、dead-letter、P0/P1 错误码和旧 HTTP/RPC 映射不得作为当前错误模型来源。

#### §11.2 错误层级与类型族

| layer | type family | public handling |
|---|---|---|
| domain | invalid transition、domain/policy rejected、body-boundary violation、manual intervention required | safe rejection or manual/blocked surface;no raw body |
| application | idempotency conflict、stored replay missing、commit unknown、material missing、consistency defect | conflict/manual/consistency-safe surface;no rerun |
| port / infra | repository unavailable、resolver unavailable、publisher/handoff unavailable、runtime binding unavailable | unavailable/blocked surface copied from formal marker |
| protocol | invalid request、unsupported command/query/inbound envelope、public surface mismatch | safe invalid/unsupported rejection |
| worker / job | duplicate receipt/report、checkpoint missing/corrupt、partial item failure、report persistence failure | replayed/partial/manual/job failed surface |
| side-effect | audit append failure、candidate invalid、publication/handoff outcome failure、outcome persistence failure | no rollback for committed truth;safe outcome/issue only |

Retryability is semantic,not adapter-driven. Retryable means a formal marker says temporary/unavailable and Step 13 later defines the retry guard. Non-retryable covers invalid request、domain rejected、forbidden body、idempotency conflict and not-visible. Manual/consistency covers stored surface missing、commit unknown、marker/source missing、body leak and outcome persistence ambiguity.

#### §11.3 Command 错误恢复

Command errors split by branch:

| command branch | recovery rule |
|---|---|
| invalid request before reserve | return safe invalid request rejection;no UoW,truth,stored accepted result or event candidate。 |
| domain / policy rejected | return safe rejection;store replayable rejection only when Step 8/11 formally defines stored surface。 |
| version conflict | rollback accepted UoW and return reload-required conflict;retry algorithm deferred to Step 13。 |
| accepted UoW failure | accepted not proven;stored accepted result and event candidate must not survive rollback。 |
| duplicate replay | copy stored accepted/rejected result;never rerun command or re-emit side effect。 |
| stored result missing / wrong kind | manual consistency failure;do not rebuild response from current truth。 |
| commit unknown | manual/consistency-safe surface;do not run post-commit side effect until resolved by formal source。 |

#### §11.4 Query 错误恢复

Query is always no-write. It may return visible、empty、safe absent、not-visible、stale-visible、degraded、unavailable、partial or consistency defect surfaces,using only formal read resolver、availability/degraded mapper、repository summary and safe diagnostic source. Query must not repair material,refresh projection,append audit,publish event,start job or store query replay. Missing marker/source is a design blocker or consistency defect;implementation must not synthesize marker from route,exception text,SQL/HTTP code or private state.

#### §11.5 Inbound / Outbound / Handoff 错误恢复

Inbound workers only validate body-free envelopes,store intake decision/receipt,copy duplicate receipt and optionally emit candidate hint when formal. They do not mutate core truth from raw inbound signal.

Outbound publication is split into candidate assembly and publisher outcome. Candidate source must be accepted command effect、completed/partial job report or bounded inbound receipt/body-free fact. Publisher failure never rolls back source truth or candidate. Publication outcome must be body-free and copied from publisher/target registry output.

Handoff outcome is local body-free marker state. Prepared is not delivered;delivered means formal receipt marker only,not downstream business truth. Handoff failure,blocked or unavailable never rolls back local source truth/report/candidate. Outcome persistence failure is consistency unknown/manual.

#### §11.6 Job / operations recovery

Operations Job errors split by invalid input、unsupported family、runtime blocked、duplicate/replay、checkpoint missing/wrong/corrupt、target planning empty/unavailable、partial item failure、derived save failure、report/progress/checkpoint persistence failure、stored report/run history missing、body-free report violation and manual intervention required.

Jobs may write derived material、progress、checkpoint、run history、safe issue、stored report and event candidate hint. Jobs must not create/update/delete/repair core business truth. Partial item failure must be explicit through safe issue/progress/report marker. Duplicate/replay/resume must not rerun job body or rebuild report from current truth. Checkpoint is a job resume anchor,not optimistic version,page cursor,retry counter,lease token or queue offset.

#### §11.7 audit / side-effect failure rules

Accepted success side effects inside command/job UoW are atomic with that UoW. Failure before commit prevents accepted success. Rejected command、query branch and duplicate replay cannot emit success event/audit/job side effect unless a formal observation-only rule later exists.

Audit/trace/lineage append failure inside accepted UoW rolls back with the UoW. Post-commit/deferred observation failure does not roll back committed truth/report/candidate and must be represented as safe side-effect failure/issue when formal source exists.

Event candidate assembly、publication outcome and handoff outcome are separate layers. Candidate assembled is not publication delivered. Handoff delivered means formal body-free receipt marker only. Public issue/marker/source must come from policy diagnostic builder、degraded mapper、availability resolver、recovery issue repository、stored shell、body-free helper or formal port output.

#### §11.8 closure, blocker and handoff

If a required source,marker,mapper,port,stored surface or schema is missing,implementation must pause and return to the owning design truth source. Step 13 receives retryability/replay/commit-unknown/checkpoint classifications and must define idempotency、retry、re-entry、lock、lease and checkpoint resume algorithms without changing Step 12 public surface semantics. Step 14 owns config binding. Step 15 owns observability/audit/evidence schema. Step 16 owns test cuts and evidence validation.

### 5. open blocker / watch / handoff table

| id | topic | Step 12 decision | owner / next closure |
|---|---|---|---|
| ML-D03-S12-CLOSURE-001 | marker/source missing | Missing formal marker/source is blocker_if_missing_formal_source;no implementation synthesis。 | Owning Step 6/7/8/9/10/11 or later closure audit。 |
| ML-D03-S12-CLOSURE-002 | stored replay missing | Missing stored result/receipt/report/checkpoint/run history is manual consistency failure;no rerun。 | Step 13 replay/idempotency;Step 15 reporting。 |
| ML-D03-S12-CLOSURE-003 | retry classification | Step 12 only classifies retryable/non-retryable/manual/consistency。 | Step 13 retry/lock/TTL/lease/re-entry。 |
| ML-D03-S12-CLOSURE-004 | config/binding source | Step 12 does not define topic、URL、secret、binding key or adapter target。 | Step 14 config/dependency binding。 |
| ML-D03-S12-CLOSURE-005 | observability/audit schema | Step 12 only permits safe diagnostic/issue refs;no metric/log/span/evidence schema。 | Step 15 observability/audit/evidence。 |
| ML-D03-S12-CLOSURE-006 | tests/evidence | Step 12 does not define test case IDs,fixtures or evidence paths。 | Step 16 test cut and validation。 |
| ML-D03-S12-CLOSURE-007 | formal document assembly | §11 candidate remains in calibration file。 | Step 19 or formal assembly module。 |

### 6. Step 13 entry gate

Step 12 到此完成到 `completed_wait_user_confirm`。进入 Step 13 前,下一位 agent 必须先读取:

- `projects/L3-method-library/design-calibration/project_execution_ledger.md`
- `projects/L3-method-library/design-calibration/03_ddd_calibration_flow.md`
- 当前文件的 R12.15~R12.16 收口段
- Step 9~11 中与 idempotency、duplicate replay、commit unknown、version conflict、checkpoint、retryable unavailable、post-commit no rollback 相关的中间产物

进入 Step 13 时必须先将旧 `03_ddd_step_13_concurrency_idempotency.md` 视为 historical_material,不得继承其中旧 `MethodContent`、outbox、checkpoint、dry_run 或旧 completed 状态。Step 13 的第一模块应是 `R13.1 开工与必读文档:先思考`。

### 7. Step 12 final stop-review

| 检查项 | 结果 |
|---|---|
| 是否完成 Step 6~11 closure audit table | pass |
| 是否完成 Step 12 coverage index | pass |
| 是否形成正式 §11 candidate draft 且保留在 calibration 文件 | pass |
| 是否写入 open blocker / watch / handoff table | pass |
| 是否写入 Step 13 entry gate | pass |
| 是否保持 no synthetic marker / no raw body / query no-write / duplicate no-rerun / no rollback rules | pass |
| 是否未修改正式 `03-详细设计.md` | pass |
| 是否未写 Step 13 retry/lock/TTL/idempotency 算法、Step 14/15/16 具体内容、test schema 或 implementation code | pass |

next_allowed_action: 等待用户确认后进入 Step 13 `R13.1 开工与必读文档:先思考`;只允许思考 Step 13 的必读文档、并发/幂等/重入输入边界、Step 12 handoff 承接、L1-governance 框架参考、旧 Step 13 污染隔离方式和 R13 模块计划;不得直接修改正式 `03-详细设计.md`;不得提前写 reserve/complete 状态机、retry/lock/TTL/lease/checkpoint resume 算法、config key、observability schema、test case schema 或 implementation code。
