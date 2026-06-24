# Step 16. 定义测试切口与最小验证清单

> 对应 SOP: `standards/document/详细设计讨论流程_SOP.md` Step 16
> 回填章节: `projects/L3-method-library/03-详细设计.md` §15 测试切口与最小验证清单
> 创建日期: 2026-06-24
> 当前模式: full-restart / step16-test-cuts
> 当前状态: in_progress
> 当前模块: `R16.18 cross-step closure and formal §15 candidate stop-review:再写入`
> 当前门禁: `R16.18` completed_wait_user_confirm;Step 16 completed;等待确认进入 Step 17 `R17.1 开工与必读文档:先思考`

---

## 0. 文件重置记录

旧 `03_ddd_step_16_test_cut.md` 曾标记为 `[x] 已确认`,但其内容围绕旧 `MethodContent`、P0 / P1、snapshot、fingerprint、outbox relay、Gateway context、object storage、PostgreSQL、dry_run 和旧 6 crate / 13 模块口径展开。该 completed 状态和旧测试切口结论全部失效。

当前 Step 16 不继承旧 `CreateMethodContentDraft`、`PublishMethodContent`、旧 outbox relay、旧 `ResolveViewProfile`、旧 fingerprint / snapshot、旧 PostgreSQL / object storage / bus 测试切口、旧 P1 feature flag 测试或旧正式 §15 草稿。旧内容只能作为 historical pollution 和差异审计输入,不得作为当前 L3-method-library 测试切口正向来源。

当前 Step 16 的唯一正向基线是:

- 当前 `00-需求文档.md`、`01-架构设计.md`、`02-概要设计.md`。
- 本轮 `03-详细设计` Step 1~15 中间产物。
- 特别是 Step 5 的七实现单元主轴,Step 6 对象契约,Step 7 port / adapter 契约,Step 8 Command / Query / Inbound / Outbound / Job protocol,Step 9 function flows,Step 10 state matrix,Step 11 persistence / transaction,Step 12 error / recovery,Step 13 concurrency / idempotency,Step 14 config / dependency binding,Step 15 observability / audit / redaction handoff。

---

## R16.1 开工与必读文档:先思考

### 1. 当前模块目标

`R16.1` 只思考 Step 16 的开工边界、必读文档、Step 15 handoff、L1-governance Step 16 框架参考、旧 Step 16 污染隔离、测试切口分批计划和 `R16.2` 写入边界。当前模块不写最终模块测试切口表、接口测试切口表、状态机测试切口表、一致性 / 幂等测试切口表、完整 test case schema、fixture、evidence schema、CI pipeline、验收标准、implementation code 或正式 `03-详细设计.md`。

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm |
| 当前允许 | 思考开工边界、必读文档、Step 15 handoff、L1-governance 框架参考、旧材料隔离、测试切口分批计划和 `R16.2` 写入边界。 |
| 当前禁止 | 写最终测试切口表、完整 test case schema、fixture、evidence schema、CI pipeline、验收标准、implementation code、运维阈值、具体 config key/env/topic/URL 或正式 `03-详细设计.md`。 |

### 2. Step 16 启动前必须承接

| 输入 | 必须承接的内容 | 禁止继承 / 禁止提前 |
|---|---|---|
| `project_execution_ledger.md` | 当前恢复点、单模块推进规则、Step 15 completed_wait_user_confirm_to_step16。 | 跳过 R16.1/R16.2 直接写完整测试表。 |
| `03_ddd_calibration_flow.md` | Step 15 completed、Step 16 wait_user_confirm_to_R16.1、Step 17+ blocked。 | 将实施承接、风险清单或正式文档装配提前写入 Step 16。 |
| `03_ddd_step_16_test_cut.md` | 当前文件旧内容已重置为 historical material。 | 继承旧 `[x] 已确认`、旧 P0/P1、旧 `MethodContent` 测试切口。 |
| `00-需求文档.md` | 仓定位、验收红线、功能需求、业务规则和非目标。 | 重写需求目标或新增测试验收标准。 |
| `01-架构设计.md` | 模块职责、依赖方向、数据所有权、一致性边界和横切关注点。 | 把测试切口变成架构重划分或部署方案。 |
| `02-概要设计.md` | 八个组成部分、关键对象轮廓、接口骨架、处理流、状态、异常、配置影响。 | 恢复旧概要或旧正式 03 的对象和接口。 |
| Step 5 模块主轴 | 七实现单元:`contracts`、`domain`、`application`、`infra`、`api`、`worker`、`jobs`。 | 用旧 6 crate、旧 13 模块或旧 `domain::content` 作为当前主轴。 |
| Step 6 对象契约 | truth/support/material/trace/audit/report/marker 对象和 forbidden body。 | 测试 raw body、snapshot body、external payload 正文保存。 |
| Step 7 port / adapter 契约 | repository、UoW、resolver、publisher、handoff、runtime/fake adapter 边界。 | 自行新增测试专用 port、mapper、fake private source。 |
| Step 8 protocol 契约 | shared shell、Command、Query、Inbound、Outbound、Job public surface。 | 写旧 HTTP route、topic、DTO、P0/P1 schema。 |
| Step 9 function flows | accepted/rejected/duplicate/no-write/partial/failed 分支和副作用顺序。 | 用测试切口改写 flow 或新增 flow。 |
| Step 10 state matrix | 正式状态、合法/非法转换和 query no-write 状态约束。 | 使用旧状态名或从测试便利角度发明状态。 |
| Step 11 persistence / transaction | truth、stored result、receipt、report、audit、marker、checkpoint 的事务和持久化边界。 | 用测试 report、日志或 fixture 替代正式持久化 surface。 |
| Step 12 error / recovery | safe error、recovery、manual/consistency issue、unavailable/degraded semantics。 | 只测 happy path 或把 raw exception 当 public error。 |
| Step 13 concurrency / idempotency | duplicate replay、commit unknown、conflict、job resume/reentry。 | duplicate 重跑业务或从 current truth 重建响应。 |
| Step 14 config / dependencies | config validation、adapter availability、forbidden configurable boundary。 | 写具体 env/key/topic/URL 或部署 profile。 |
| Step 15 observability / audit | redaction、metric label、audit refs-only、query no-write、post-commit failure no rollback。 | 写完整 observability test schema 或运维告警规则。 |

### 3. Step 15 handoff 承接思考

| Step 15 handoff | Step 16 承接方式 | 当前 R16.1 裁决 |
|---|---|---|
| no raw body | 后续测试切口必须覆盖 log、span、audit、diagnostic、report/handoff 不含 request/event/provider/method/report/archive body。 | 不写 fixture body 或 raw payload 示例。 |
| no secret / config value | 后续测试切口必须覆盖 secret、token、credential、connection string、URL/topic concrete value 不进入 log/metric/trace/diagnostic。 | 不列具体 secret key、env 名或 topic 值。 |
| metric label low-cardinality | 后续测试切口必须覆盖 metric labels 只含 family/kind/state/result/category。 | 不定义 metric backend、采样率或 dashboard。 |
| no synthetic marker | 后续测试切口必须覆盖 degraded/redaction/diagnostic/publication/handoff marker 来自正式 source。 | 不允许测试 fake 私下拼 marker 让实现通过。 |
| query no-write | 后续测试切口必须覆盖 Query 不写 audit、stored command result、event candidate、projection repair。 | Query 测试不得把 read side repair 当成功条件。 |
| duplicate no-rerun | 后续测试切口必须覆盖 duplicate 只复制 stored result/receipt/report/checkpoint。 | 不从 current truth 重算 duplicate result。 |
| post-commit failure no rollback | 后续测试切口必须覆盖 publication/handoff failure 不回滚 accepted truth。 | 不把 publisher failure 当 command rollback。 |
| source-missing stop | 后续测试切口必须覆盖缺 audit subject、safe actor、diagnostic、report/handoff receipt 来源时停审。 | 不在实现测试里发明替代来源。 |

### 4. L1-governance Step 16 框架参考思考

L1-governance Step 16 的价值在组织深度,不是领域语义。L3-method-library 只参考其“目标 -> 输入 -> SOP 五问 -> 文档诊断 -> 设计取舍 -> 总图 -> 模块 -> Command -> Query / Event / Job -> 状态机 -> 一致性 / 幂等 / 并发 -> 错误 / 配置 / 观测 -> closure”的结构。

| L1 Step 16 框架点 | L3 采用方式 |
|---|---|
| 测试切口是最小验证入口 | L3 Step 16 只写最小切口,完整 TC 编号、fixture、CI、evidence 后移 05/06/07。 |
| 模块级测试先于接口级测试 | L3 先按七实现单元列 contracts/domain/application/infra/api/worker/jobs 的测试入口。 |
| 每个 public protocol 有正向和异常测试 | L3 按 Step 8 的 Command / Query / Inbound / Outbound / Job 协议族分批展开。 |
| Query 必须额外验证 no-write | L3 对所有 Query 切口增加不写 truth/audit/event/repair 的断言方向。 |
| 状态机合法/非法转换单独成表 | L3 从 Step 10 的正式状态矩阵拉出测试切口,不使用旧状态名。 |
| 一致性 / 幂等 / 并发单独成表 | L3 覆盖 UoW rollback、stored result replay、commit unknown、checkpoint、partial failure。 |
| 配置 / 观测也必须可测 | L3 承接 Step 14/15 的 config validation、adapter availability、redaction、metric label、audit refs-only。 |

### 5. SOP 五问初步回答

| SOP 问题 | R16.1 初步回答 | 后续落点 |
|---|---|---|
| 每个模块至少需要哪些单元测试? | 七实现单元均要有最小入口:`contracts` roundtrip / body-free shell,`domain` invariant / policy / state,`application` orchestration / UoW / idempotency,`infra` repository / adapter / config binding,`api` handler mapping,`worker` inbound / publisher runner,`jobs` report / partial / no truth repair。 | R16.5/R16.6 |
| 每个接口至少需要哪些正向和异常测试? | 每个 Command、Query、Inbound Consumer、Outbound Event、Operations Job 至少一条正向和一条异常切口;duplicate / no-write / delayed / failed / partial surface 需要额外覆盖。 | R16.7~R16.12 |
| 状态机合法转换和非法转换如何测试? | 以 Step 10 状态矩阵为唯一来源,每个正式状态机至少覆盖主线合法、边界合法和非法转换,并断言错误 surface 与 no side-effect。 | R16.13/R16.14 |
| 事务、一致性、幂等和并发如何验证? | 使用 fake/in-memory repository、fake UoW、fake resolver、fake publisher、fake handoff、fake clock/id generator 注入 conflict、rollback、unavailable、commit unknown、same/different digest、race、partial failure。 | R16.15/R16.16 |
| 哪些测试细节应留给测试方案? | TC 编号、优先级、覆盖率、fixture 目录、测试数据全集、真实外部依赖联调、CI job 分层、报告模板、evidence 编号和执行排期留给 `05/06/07`。 | R16.17/R16.18 |

### 6. 旧 Step 16 污染隔离思考

| 旧内容 | 当前处理 |
|---|---|
| 旧 `[x] 已确认` 状态 | invalid;当前 Step 16 从 R16.1 重新执行。 |
| 旧 `MethodContent` / draft / publish / retire / supersede 测试 | historical pollution;不得进入当前测试切口。 |
| 旧 P0 / P1 测试边界 | 不继承;当前协议范围以 Step 2 / 5 / 8 / 9 为准。 |
| 旧 snapshot / fingerprint / object storage 测试 | 不继承;若当前 Step 6~11 另有 body-free artifact/ref,按新对象重新闭口。 |
| 旧 outbox relay / dead-letter / worker 测试 | 不继承;当前 worker/outbound/publisher/job 切口必须从 Step 8/9/11/13 重建。 |
| 旧 PostgreSQL / Gateway / HTTP header 测试 | 不继承;具体 durable store、gateway/auth、HTTP details 不作为当前 Step 16 正向来源。 |
| 旧 `ResolveViewProfile` / P1 endpoint disabled | 不继承;当前 Query 与 peripheral capability 必须按新协议族重新命名。 |

### 7. Step 16 初步分批思考

| 模块 | 主题 | 初判边界 |
|---|---|---|
| R16.1/R16.2 | 开工与必读文档 | 写输入基线、旧材料隔离、SOP 五问、分批计划。 |
| R16.3/R16.4 | L1-governance 框架对齐与测试切口总图 | 写测试分层、最小验证入口总图、禁入边界。 |
| R16.5/R16.6 | module test cuts | 按七实现单元写模块测试切口。 |
| R16.7/R16.8 | Command / Query test cuts | 写 public command/query 正向、异常、duplicate/no-write 测试入口。 |
| R16.9/R16.10 | Inbound / Outbound / Job test cuts | 写 consumer、event candidate / publisher、operations job 测试入口。 |
| R16.11/R16.12 | state machine test cuts | 写正式状态机合法/非法转换测试入口。 |
| R16.13/R16.14 | consistency / idempotency / concurrency cuts | 写 UoW、rollback、stored replay、commit unknown、race、checkpoint、partial failure。 |
| R16.15/R16.16 | error / config / observability cuts | 写 error mapping、config validation、adapter availability、redaction、metric label、audit refs-only。 |
| R16.17/R16.18 | cross-step closure and formal §15 candidate stop-review | 写 source map、禁入项、Step 17 entry gate。 |

### 8. R16.2 写入边界思考

`R16.2` 只应把 R16.1 的开工思考落成可恢复台账,不得进入最终测试切口表:

1. 写 Step 16 必读文档表与读取状态。
2. 写输入基线与旧材料处理规则。
3. 写 Step 15 handoff 承接表。
4. 写 SOP 五问初步回答。
5. 写 Step 16 输出骨架、模块计划和 L1-governance 框架参考边界。
6. 写 `R16.3 L1-governance 框架对齐与测试切口总图:先思考` 进入门禁。

### 9. R16.1 stop-review

| 检查项 | 结果 |
|---|---|
| 是否确认旧 Step 16 completed 作废 | pass |
| 是否只思考开工、必读文档、Step 15 handoff 和分批计划 | pass |
| 是否参考 L1-governance 框架但不复制领域语义 | pass |
| 是否明确不写最终测试切口表、test case schema、fixture、evidence schema | pass |
| 是否未修改正式 `03-详细设计.md` | pass |
| 是否形成 R16.2 写入边界 | pass |

next_allowed_action: 等待用户确认后进入 Step 16 `R16.2 开工与必读文档:再写入`;只允许写入 Step 16 必读文档表、读取状态、输入基线、旧材料处理规则、Step 15 handoff 承接、SOP 五问初步回答、输出骨架、模块计划、L1-governance 框架参考边界和 `R16.3` 进入门禁;不得直接修改正式 `03-详细设计.md`;不得写最终模块测试切口表、接口测试切口表、状态机测试切口表、一致性 / 幂等测试切口表、完整 test case schema、fixture、evidence schema、CI pipeline、验收标准、implementation code 或具体 config key/env/topic/URL。

---

## R16.2 开工与必读文档:再写入

### 1. 当前模块状态

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm |
| 用户确认 | 已确认从 `R16.1` 推进到 `R16.2`。 |
| 本模块写入范围 | Step 16 必读文档表、读取状态、输入基线、旧材料处理规则、Step 15 handoff 承接、SOP 五问初步回答、输出骨架、模块计划、L1-governance 框架参考边界和 `R16.3` 进入门禁。 |
| 本模块禁止范围 | 最终模块测试切口表、接口测试切口表、状态机测试切口表、一致性 / 幂等测试切口表、完整 test case schema、fixture、evidence schema、CI pipeline、验收标准、implementation code、配置键和正式 `03-详细设计.md`。 |

### 2. 必读文档表与读取状态

| 文档 | 读取状态 | Step 16 用途 | 当前裁决 |
|---|---|---|---|
| `project_execution_ledger.md` | 已读取并承接 | 确认当前恢复点、单模块推进规则、Step 16 当前门禁。 | 每次只推进一个 `R16.x` 模块。 |
| `03_ddd_calibration_flow.md` | 已读取并承接 | 确认 Step 15 completed、Step 16 in_progress、Step 17+ blocked。 | `R16.2` 完成后只能等待 `R16.3`。 |
| `03_ddd_step_16_test_cut.md` | 已读取并重置 | 确认旧文件污染已隔离、`R16.1` 已形成开工思考。 | 当前只补开工写入台账。 |
| `00-需求文档.md` | 作为正式上游基线 | 固定仓定位、验收红线、业务规则和接口依赖。 | Step 16 不新增验收标准。 |
| `01-架构设计.md` | 作为正式上游基线 | 固定职责边界、数据所有权、一致性边界和横切关注点。 | Step 16 不改架构边界。 |
| `02-概要设计.md` | 作为直接输入基线 | 固定八组件、对象轮廓、接口骨架、处理流、状态、异常和配置影响。 | 测试切口必须回指概要与详细设计。 |
| `03_ddd_step_05_module_contracts.md` | 已读取关键主轴 | 固定七实现单元和模块级测试责任预告。 | 不继承旧 6 crate / 13 模块主轴。 |
| `03_ddd_step_06_object_contracts.md` | 已列入必读 | 固定对象不变量、state、marker、report、audit、body-free redline。 | 模块测试切口必须覆盖对象不变量和 forbidden body。 |
| `03_ddd_step_07_trait_port_adapter.md` | 已列入必读 | 固定 repository、UoW、resolver、publisher、handoff、runtime/fake adapter 边界。 | 测试不新增私有 port / fake source。 |
| `03_ddd_step_08_protocol_contracts.md` | 已读取协议框架 | 固定 Command / Query / Inbound / Outbound / Job public surface。 | 接口测试切口以后按协议族展开。 |
| `03_ddd_step_09_function_flows.md` | 已列入必读 | 固定 accepted/rejected/duplicate/no-write/partial/failed 分支。 | 测试切口必须验证 side-effect 顺序和 no-write。 |
| `03_ddd_step_10_state_machine.md` | 已列入必读 | 固定正式状态、合法/非法转换。 | 状态机测试必须用正式状态名。 |
| `03_ddd_step_11_persistence_tx_consistency.md` | 已列入必读 | 固定 transaction、stored result/receipt/report、audit、marker、checkpoint。 | 一致性测试不以 log/report body 替代 truth。 |
| `03_ddd_step_12_errors_recovery.md` | 已列入必读 | 固定 safe error、recovery、manual/consistency issue。 | 异常测试必须断言 safe public surface。 |
| `03_ddd_step_13_concurrency_idempotency.md` | 已列入必读 | 固定 duplicate replay、commit unknown、race、job resume。 | 幂等测试必须验证 no rerun。 |
| `03_ddd_step_14_config_dependencies.md` | 已列入必读 | 固定 config validation、adapter availability、forbidden configurable boundary。 | 不写具体 config key/env/topic/URL。 |
| `03_ddd_step_15_observability_audit.md` | 已读取 handoff | 固定 redaction、metric label、audit refs-only、query no-write、post-commit failure no rollback。 | Step 16 要承接这些红线为测试切口。 |
| `详细设计讨论流程_SOP.md` Step 16 | 已读取并承接 | 固定 Step 16 目标、五问、输出表和进入下一步条件。 | 本 Step 不替代测试方案。 |
| `详细设计书写规范.md` §5.15 | 已读取并承接 | 固定模块、接口、状态机、一致性/幂等测试切口表。 | 后续按表格落地。 |
| `设计真相源闭环与可落码性标准.md` §2.15 | 已读取并承接 | 固定最小验证入口、反查来源和不得越界到 05/06/07。 | 每个切口必须可反查前序 Step。 |
| `L1-governance 03_ddd_step_16_test_cuts.md` | 已读取框架 | 参考组织深度、分批顺序、总图和 closure 方式。 | 只参考框架,不得复制 governance 领域语义。 |

### 3. 输入基线与旧材料处理规则

| 类别 | 当前口径 |
|---|---|
| 正向基线 | 当前 `00/01/02` 和本轮 Step 1~15 中间产物。 |
| 旧 Step 16 | historical pollution;旧 completed 状态作废。 |
| 旧 `MethodContent` 测试 | 不进入当前 L3-method-library 测试切口主线。 |
| 旧 P0/P1 | 不作为当前测试范围来源;当前范围由 Step 2/5/8/9 和后续模块裁决。 |
| 旧 snapshot / fingerprint / outbox relay | 不继承测试命名、fixture、状态或断言。 |
| 旧 PostgreSQL / Gateway / HTTP / object storage | 不作为当前测试切口真相源;具体产品/环境后移 05/07。 |
| 正式 `03-详细设计.md` | 本模块不修改;后续由 Step 19 或明确回填模块装配。 |

### 4. Step 15 handoff 承接

| Step 15 输出 | Step 16 承接写法 | 本模块裁决 |
|---|---|---|
| no raw body | 后续测试切口覆盖 log、span、audit、diagnostic、report/handoff 不含 raw body。 | 不写 fixture body 或 payload 示例。 |
| no secret / config value | 后续测试切口覆盖 secret、credential、connection string、URL/topic concrete value 不进入观测面。 | 不列具体 key/env/topic。 |
| metric label low-cardinality | 后续测试切口覆盖 labels 仅 family/kind/state/result/category。 | 不写 metric backend 或 dashboard。 |
| no synthetic marker | 后续测试切口覆盖 marker 必须来自正式 mapper/resolver/source。 | fake 不得私下拼 marker。 |
| query no-write | 后续测试切口覆盖 Query 不写 truth/audit/event/repair。 | Query 测试不得以 repair 成功作为通过条件。 |
| duplicate no-rerun | 后续测试切口覆盖 duplicate 只 replay stored surface。 | 不允许 duplicate 重新执行业务。 |
| post-commit failure no rollback | 后续测试切口覆盖 publisher/handoff failure 不回滚 accepted truth。 | 不把 post-commit failure 归入 Command rollback。 |
| source-missing stop | 后续测试切口覆盖缺正式来源时停审回补。 | 测试不得引入实现侧 fallback。 |

### 5. SOP 五问写入口径

| SOP 问题 | 当前写入口径 | 后续模块 |
|---|---|---|
| 每个模块至少需要哪些单元测试? | 按七实现单元写最小入口:contracts、domain、application、infra、api、worker、jobs。 | R16.5/R16.6 |
| 每个接口至少需要哪些正向和异常测试? | 按 Command / Query / Inbound / Outbound / Job 协议族写正向、异常、duplicate、no-write、partial/failed 切口。 | R16.7~R16.10 |
| 状态机合法转换和非法转换如何测试? | 从 Step 10 正式状态矩阵抽取合法/非法转换,并断言错误 surface 与 no side-effect。 | R16.11/R16.12 |
| 事务、一致性、幂等和并发如何验证? | 覆盖 UoW rollback、stored replay、commit unknown、same/different digest、race、checkpoint、partial failure。 | R16.13/R16.14 |
| 哪些测试细节应留给测试方案? | TC 编号、优先级、覆盖率、fixture、真实外部依赖联调、CI、报告模板、evidence 和排期留给 05/06/07。 | R16.17/R16.18 |

### 6. Step 16 输出骨架

| 输出块 | 必须回答的问题 | 禁止内容 |
|---|---|---|
| 测试切口总图 | 前序 Step 5~15 如何映射到最小验证入口。 | 完整测试计划、TC 编号、CI suite。 |
| 模块测试切口 | 七实现单元各自最小测试入口和反查 Step。 | 具体 fixture 文件、测试代码。 |
| 接口测试切口 | Command / Query / Inbound / Outbound / Job 正向和异常切口。 | 旧接口名、旧 P0/P1 schema。 |
| 状态机测试切口 | 正式状态合法/非法转换与错误 surface。 | 旧状态名、实现便利状态。 |
| 一致性 / 幂等 / 并发切口 | UoW、rollback、stored replay、commit unknown、race、checkpoint、partial failure。 | 性能阈值、压测计划。 |
| 错误 / 配置 / 观测切口 | safe error、config validation、adapter availability、redaction、metric label、audit refs-only。 | 运维告警、具体 config key。 |
| closure / formal §15 handoff | source map、禁入项、Step 17 entry gate。 | 正式 §15 候选正文或实施计划。 |

### 7. Step 16 模块计划

| 模块 | 主题 | 写入边界 |
|---|---|---|
| R16.1/R16.2 | 开工与必读文档 | 输入基线、旧材料隔离、SOP 五问、分批计划。 |
| R16.3/R16.4 | L1-governance 框架对齐与测试切口总图 | 测试分层、最小验证入口总图、禁入边界。 |
| R16.5/R16.6 | module test cuts | 七实现单元模块测试切口。 |
| R16.7/R16.8 | Command / Query test cuts | 同步 command/query 正向、异常、duplicate/no-write。 |
| R16.9/R16.10 | Inbound / Outbound / Job test cuts | consumer、event candidate/publisher、operations job。 |
| R16.11/R16.12 | state machine test cuts | 正式状态机合法/非法转换。 |
| R16.13/R16.14 | consistency / idempotency / concurrency cuts | UoW、stored replay、commit unknown、race、checkpoint、partial failure。 |
| R16.15/R16.16 | error / config / observability cuts | safe error、config validation、adapter availability、redaction、audit refs-only。 |
| R16.17/R16.18 | cross-step closure and formal §15 candidate stop-review | source map、禁入项、Step 17 entry gate。 |

### 8. L1-governance 框架参考边界

| 可参考 | L3 改写要求 |
|---|---|
| 目标、输入、SOP 五问、文档诊断、设计取舍、总图、分批顺序。 | 替换为 L3 七实现单元、八组件、Command / Query / Inbound / Outbound / Job 协议族。 |
| 模块 -> 接口 -> 状态机 -> 一致性/幂等 -> 错误/配置/观测 -> closure 的深度。 | 不复制 governance command、state、job、event、report 名称。 |
| Query no-write、duplicate replay、forbidden body、redaction 测试思想。 | 映射到 L3 Step 9/13/15 的正式对象和协议。 |
| 测试切口最小入口而非完整测试方案。 | 保持 TC 编号、fixture、CI、evidence 后移。 |

### 9. R16.3 进入门禁

`R16.3 L1-governance 框架对齐与测试切口总图:先思考` 只允许思考 L1-governance Step 16 的框架如何映射到 L3 的测试切口总图:

1. 思考测试分层图:unit、contract、service、repository/adapter、entry/runner/job。
2. 思考 Step 5~15 到测试切口总图的映射。
3. 思考最小验证入口和禁止越界内容。
4. 不写最终模块测试切口表、接口测试切口表、状态机测试切口表或一致性/幂等测试切口表。

### 10. R16.2 stop-review

| 检查项 | 结果 |
|---|---|
| 是否写入必读文档表与读取状态 | pass |
| 是否写入输入基线与旧材料处理规则 | pass |
| 是否写入 Step 15 handoff 承接 | pass |
| 是否写入 SOP 五问初步回答 | pass |
| 是否写入输出骨架、模块计划和 L1-governance 框架参考边界 | pass |
| 是否未写最终测试切口表、test case schema、fixture、evidence schema | pass |
| 是否未修改正式 `03-详细设计.md` | pass |

next_allowed_action: 等待用户确认后进入 Step 16 `R16.3 L1-governance 框架对齐与测试切口总图:先思考`;只允许思考 L1-governance Step 16 框架到 L3 测试分层、Step 5~15 source map、最小验证入口总图和禁入项的映射;不得直接修改正式 `03-详细设计.md`;不得写最终模块测试切口表、接口测试切口表、状态机测试切口表、一致性 / 幂等测试切口表、完整 test case schema、fixture、evidence schema、CI pipeline、验收标准、implementation code 或具体 config key/env/topic/URL。

---

## R16.3 L1-governance 框架对齐与测试切口总图:先思考

### 1. 当前模块目标

`R16.3` 只思考 L1-governance Step 16 框架如何映射到 L3-method-library 的测试分层、Step 5~15 source map、最小验证入口总图和禁入项。当前模块不写最终模块测试切口表、接口测试切口表、状态机测试切口表、一致性 / 幂等测试切口表,也不修改正式 `03-详细设计.md`。

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm |
| 当前允许 | 思考 L1-governance 框架到 L3 测试分层、Step 5~15 source map、最小验证入口总图、禁入项和 `R16.4` 写入边界。 |
| 当前禁止 | 写最终模块测试切口表、接口测试切口表、状态机测试切口表、一致性 / 幂等测试切口表、完整 test case schema、fixture、evidence schema、CI pipeline、验收标准、implementation code、配置键或正式 `03-详细设计.md`。 |

### 2. L1-governance 框架映射思考

| L1-governance 框架点 | L3-method-library 映射 | 当前裁决 |
|---|---|---|
| 先写目标和非目标 | L3 已在 R16.1/R16.2 固定 Step 16 只提供最小验证入口,不替代 05/06/07。 | R16.4 可写目标与非目标总图,不写完整测试方案。 |
| 输入表覆盖 Step 5~15 | L3 需要把 Step 5 七实现单元、Step 6 对象、Step 7 port、Step 8 protocol、Step 9 flow、Step 10 state、Step 11~13 consistency、Step 14 config、Step 15 observability 全部映射到测试入口。 | R16.4 写 source map,后续模块按 source map 展开。 |
| SOP 五问先闭口 | L3 已形成五问初步回答,后续每个切口必须回到五问之一。 | R16.4 保留五问到输出块的映射。 |
| 文档诊断与设计取舍 | L3 需要诊断旧 Step 16 的 MethodContent/P0/P1/outbox 污染,以及当前 Step 5~15 尚未汇总测试入口的问题。 | R16.4 写诊断和取舍,不写具体 case。 |
| 测试切口总图 | L3 需要建立 module -> protocol -> flow -> state -> consistency -> config/observability 的验证链。 | R16.4 写总图,作为后续 R16.5+ 的主控。 |
| 分批写入 | L3 不采用 L1 的 5 批压缩,而按当前 18 个 R16 模块小循环推进。 | 避免一次写完所有测试表。 |
| closure audit | L3 最后需要审计 Step 5~15 是否都有测试入口,并把 Step 17 handoff 固定。 | R16.17/R16.18 处理。 |

### 3. L3 测试分层思考

| 测试层 | 覆盖对象 | L3 适用边界 |
|---|---|---|
| contract unit | `contracts` refs、marker、request/result/view/event/job shell、error surface。 | 验证 public shell 稳定、body-free、roundtrip 和 required field。 |
| domain unit | `domain` truth objects、value objects、policy、state、guard、domain error。 | 验证不变量、状态成立规则、forbidden transition、body-free guard。 |
| application service | Command / Query / Inbound / Outbound / Job orchestration、UoW、idempotency、port 调用。 | 验证 flow 顺序、side-effect、duplicate replay、query no-write、partial failure。 |
| repository / adapter fake | repository、material store、fake resolver、publisher、handoff、runtime builder。 | 验证 version、transaction、rollback、unavailable/degraded、failure injection。 |
| entry / runner | api handler、worker runner、jobs runner。 | 验证 metadata propagation、protocol mapping、runner boundary、no entry direct domain call。 |
| observability / redaction check | logs、metrics、trace/span、audit、report/handoff。 | 验证 forbidden body、secret、high-cardinality label、synthetic marker 禁止。 |

### 4. Step 5~15 source map 思考

| source Step | 测试入口方向 | 后续落点 |
|---|---|---|
| Step 5 module contracts | 七实现单元模块级测试入口。 | R16.5/R16.6 |
| Step 6 object contracts | object factory、不变量、typed ref、marker、body-free guard。 | R16.5/R16.6;R16.11/R16.12 |
| Step 7 trait / port / adapter | port contract、fake adapter failure injection、repository/UoW semantics。 | R16.5/R16.6;R16.13/R16.16 |
| Step 8 protocol contracts | Command / Query / Inbound / Outbound / Job request/result/error/report shell。 | R16.7~R16.10 |
| Step 9 function flows | accepted/rejected/duplicate/no-write/partial/failed flow tests。 | R16.7~R16.10;R16.13/R16.14 |
| Step 10 state machine | legal/illegal state transition tests。 | R16.11/R16.12 |
| Step 11 persistence / transaction | transaction、stored result/receipt/report、checkpoint、rollback tests。 | R16.13/R16.14 |
| Step 12 error / recovery | safe error mapping、manual/consistency issue、unavailable/degraded tests。 | R16.15/R16.16 |
| Step 13 concurrency / idempotency | same/different digest、duplicate replay、commit unknown、race、job resume tests。 | R16.13/R16.14 |
| Step 14 config / dependencies | config validation、adapter availability、forbidden configurable boundary tests。 | R16.15/R16.16 |
| Step 15 observability / audit | redaction、metric label、audit refs-only、query no-write、post-commit no rollback tests。 | R16.15/R16.16 |

### 5. 最小验证入口总图思考

```text
Step 5 module contracts
  -> module test cuts

Step 6 object contracts + Step 10 state matrix + Step 12 domain errors
  -> domain invariant / legal-invalid transition cuts

Step 8 protocol contracts + Step 9 function flows
  -> Command / Query / Inbound / Outbound / Job cuts

Step 7 ports + Step 11 persistence + Step 13 idempotency
  -> repository / UoW / stored replay / race / checkpoint cuts

Step 14 config binding + Step 15 observability
  -> config validation / adapter availability / redaction / audit refs-only cuts
```

当前判断:总图必须表达“最小验证入口”,不能把每个入口展开为完整 TC 矩阵。每个入口后续最多写“测试切口、对应契约、验证内容、建议测试类型”,不写 TC id、fixture、script、artifact schema 或 CI suite。

### 6. 禁入项思考

| 禁入项 | 禁入原因 |
|---|---|
| 完整测试方案、TC 编号、优先级、覆盖率目标 | 属于 `05-测试方案.md`。 |
| fixture 目录结构、测试数据全集、mock/fake 代码实现 | 属于测试方案或实现仓。 |
| CI job、执行脚本、报告模板、evidence schema | 属于 `05/06/07` 后续文档。 |
| 验收标准、acceptance gate、发布门禁 | 属于 `06-验收标准.md` 和 `07-实施计划.md`。 |
| 具体 config key/env/topic/URL、运维阈值、dashboard | 属于 `04-配置设计.md` 或运维文档。 |
| 旧 MethodContent/P0/P1/outbox/snapshot/fingerprint 测试名 | historical pollution,不属于当前正向基线。 |
| 新增未闭口 schema、port、mapper、state、fixture-only fallback | 违反可落码性闭环,必须回对应 Step 补口。 |

### 7. R16.4 写入边界思考

`R16.4` 应把本模块思考落成框架与总图:

1. 写 L1-governance 框架映射表。
2. 写 L3 测试分层图和每层适用边界。
3. 写 Step 5~15 source map。
4. 写最小验证入口总图。
5. 写禁入项表。
6. 写 `R16.5 module test cuts:先思考` 进入门禁。

### 8. R16.3 stop-review

| 检查项 | 结果 |
|---|---|
| 是否只思考 L1-governance 框架对齐和测试切口总图 | pass |
| 是否形成 L3 测试分层思考 | pass |
| 是否形成 Step 5~15 source map 思考 | pass |
| 是否形成最小验证入口总图思考 | pass |
| 是否明确禁入完整测试方案、fixture、CI、evidence schema | pass |
| 是否未写最终模块/接口/状态机/一致性测试切口表 | pass |
| 是否未修改正式 `03-详细设计.md` | pass |

next_allowed_action: 等待用户确认后进入 Step 16 `R16.4 L1-governance 框架对齐与测试切口总图:再写入`;只允许写入 L1-governance 框架映射表、L3 测试分层图、Step 5~15 source map、最小验证入口总图、禁入项表和 `R16.5 module test cuts:先思考` 进入门禁;不得直接修改正式 `03-详细设计.md`;不得写最终模块测试切口表、接口测试切口表、状态机测试切口表、一致性 / 幂等测试切口表、完整 test case schema、fixture、evidence schema、CI pipeline、验收标准、implementation code 或具体 config key/env/topic/URL。

---

## R16.4 L1-governance 框架对齐与测试切口总图:再写入

### 1. 当前模块状态

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm |
| 用户确认 | 已确认从 `R16.3` 推进到 `R16.4`。 |
| 本模块写入范围 | L1-governance 框架映射表、L3 测试分层图、Step 5~15 source map、最小验证入口总图、禁入项表和 `R16.5` 进入门禁。 |
| 本模块禁止范围 | 最终模块测试切口表、接口测试切口表、状态机测试切口表、一致性 / 幂等测试切口表、完整 test case schema、fixture、evidence schema、CI pipeline、验收标准、implementation code、具体 config key/env/topic/URL 和正式 `03-详细设计.md`。 |

### 2. L1-governance 框架映射表

| L1-governance 框架点 | L3-method-library 写入口径 | 本 Step 后续承接 |
|---|---|---|
| target / non-target | Step 16 只定义最小验证入口,不替代 `05-测试方案.md`、`06-验收标准.md` 或 `07-实施计划.md`。 | 所有切口只写验证方向和来源 Step,不写 TC 编号。 |
| Step 5~15 input coverage | L3 必须从七实现单元、对象契约、port、protocol、flow、state、transaction、error、idempotency、config、observability 全链路取测试来源。 | R16.5 起每组切口必须带 source Step。 |
| SOP 五问 | 模块、接口、状态机、一致性/幂等/并发、后移到测试方案的内容分别收口。 | 后续模块按五问分区展开。 |
| document diagnosis / design tradeoff | 旧 `MethodContent`、P0/P1、snapshot、fingerprint、outbox relay、PostgreSQL 等测试命名全部隔离。 | 只保留当前 Step 5~15 重新闭口后的对象和协议。 |
| test cut overview diagram | 先建立 module -> object/state -> protocol/flow -> port/transaction/idempotency -> config/observability 的最小验证链。 | R16.4 写总图,R16.5+ 才分表展开。 |
| phased writing | 不一次写完整测试矩阵,按当前 R16.5~R16.18 小循环推进。 | 用户每次确认只推进一个模块。 |
| closure audit | 最后审计 Step 5~15 是否均有测试入口,并形成 Step 17 handoff。 | R16.17/R16.18 收口。 |

### 3. L3 测试分层图

| 测试层 | 最小覆盖对象 | 验证方向 |
|---|---|---|
| contract unit | `contracts` refs、marker、request/result/view/event/job shell、error surface。 | public shell 稳定、required field、body-free、roundtrip 和 safe error surface。 |
| domain unit | `domain` truth/value/policy/state/guard/domain error。 | 不变量、合法/非法状态、forbidden body、typed ref / marker 来源和 domain error。 |
| application service | Command / Query / Inbound / Outbound / Job orchestration、UoW、idempotency、ports。 | flow 顺序、accepted/rejected、duplicate replay、query no-write、partial/failed side-effect。 |
| repository / adapter fake | repository、material store、fake resolver、publisher、handoff、runtime builder。 | version、transaction、rollback、unavailable/degraded、failure injection 和 no private fallback。 |
| entry / runner | api handler、worker runner、jobs runner。 | protocol mapping、metadata propagation、runner boundary 和 entry 不绕过 application service。 |
| observability / redaction check | logs、metrics、trace/span、audit、report、handoff。 | no raw body、no secret、low-cardinality labels、audit refs-only、no synthetic marker。 |

### 4. Step 5~15 source map

| source Step | 测试入口方向 | 后续落点 |
|---|---|---|
| Step 5 module contracts | 七实现单元模块级 test cuts。 | R16.5/R16.6 |
| Step 6 object contracts | object invariants、body-free shell、typed ref、marker、public DTO shell。 | R16.5/R16.6;R16.11/R16.12 |
| Step 7 trait / port / adapter | port contract、fake adapter、repository、UoW、resolver/publisher/handoff failure。 | R16.5/R16.6;R16.13/R16.16 |
| Step 8 protocol contracts | Command、Query、Inbound、Outbound、Job request/result/error/report shell。 | R16.7~R16.10 |
| Step 9 function flows | accepted/rejected、duplicate、no-write、partial、failed flow tests。 | R16.7~R16.10;R16.13/R16.14 |
| Step 10 state matrix | legal/illegal transition tests。 | R16.11/R16.12 |
| Step 11 persistence / transaction | transaction、stored result/report/checkpoint、rollback tests。 | R16.13/R16.14 |
| Step 12 error / recovery | safe error、manual/consistency issue、unavailable/degraded tests。 | R16.15/R16.16 |
| Step 13 concurrency / idempotency | same/different digest、duplicate replay、commit unknown、race、resume tests。 | R16.13/R16.14 |
| Step 14 config / dependencies | config validation、adapter availability、forbidden configurable boundary tests。 | R16.15/R16.16 |
| Step 15 observability / audit | redaction、metric labels、audit refs-only、query no-write、post-commit no rollback tests。 | R16.15/R16.16 |

### 5. 最小验证入口总图

```text
Step 5 module contracts
  -> module test cuts

Step 6 object contracts + Step 10 state matrix + Step 12 domain errors
  -> domain invariant / legal-invalid transition cuts

Step 8 protocol contracts + Step 9 function flows
  -> Command / Query / Inbound / Outbound / Job cuts

Step 7 ports + Step 11 persistence + Step 13 idempotency
  -> repository / UoW / stored replay / race / checkpoint cuts

Step 14 config binding + Step 15 observability
  -> config validation / adapter availability / redaction / audit refs-only cuts
```

### 6. 禁入项表

| 禁入项 | 处理口径 |
|---|---|
| complete test plan、TC IDs、priority、coverage | 后移到 `05-测试方案.md`。 |
| fixture directory/data、mock/fake code | 后移到测试方案或实现仓,Step 16 只写验证入口。 |
| CI job、scripts、reports、evidence schema | 后移到 `05/06/07`。 |
| acceptance gates、release gates | 后移到 `06-验收标准.md` 和 `07-实施计划.md`。 |
| config keys/env/topic/URL、ops threshold/dashboard | 后移到 `04-配置设计.md` 或运维方案。 |
| old MethodContent/P0/P1/outbox/snapshot/fingerprint test names | 作为 historical pollution,不得进入当前正向切口。 |
| new unclosed schema/port/mapper/state/fixture fallback | 必须回对应 Step 闭口,不得由测试切口自行补口。 |

### 7. R16.5 进入门禁

`R16.5 module test cuts:先思考` 只允许思考七实现单元的模块测试入口:

1. 允许思考 `contracts`、`domain`、`application`、`infra`、`api`、`worker`、`jobs` 的模块测试 entry points。
2. 允许为每个实现单元标注来源 Step、验证方向和禁止越界点。
3. 禁止写最终 module test cuts 表、接口测试切口表、状态机测试切口表、一致性 / 幂等测试切口表。
4. 禁止写完整 test case schema、fixture/evidence/CI、验收标准、implementation code 或正式 `03-详细设计.md`。

### 8. R16.4 stop-review

| 检查项 | 结果 |
|---|---|
| 是否写入 L1-governance 框架映射表 | pass |
| 是否写入 L3 测试分层图 | pass |
| 是否写入 Step 5~15 source map | pass |
| 是否写入最小验证入口总图 | pass |
| 是否写入禁入项表和 R16.5 进入门禁 | pass |
| 是否未写最终模块/接口/状态机/一致性测试切口表 | pass |
| 是否未修改正式 `03-详细设计.md` | pass |

next_allowed_action: 等待用户确认后进入 Step 16 `R16.5 module test cuts:先思考`;只允许思考七实现单元的模块测试入口、来源 Step、验证方向和禁止越界点;不得直接修改正式 `03-详细设计.md`;不得写最终 module test cuts 表、接口测试切口表、状态机测试切口表、一致性 / 幂等测试切口表、完整 test case schema、fixture、evidence schema、CI pipeline、验收标准、implementation code 或具体 config key/env/topic/URL。

---

## R16.5 module test cuts:先思考

### 1. 当前模块目标

`R16.5` 只思考七个实现单元的模块测试入口、来源 Step、验证方向和禁止越界点。当前模块不写最终 module test cuts 表,不写接口测试切口表、状态机测试切口表、一致性 / 幂等测试切口表,也不修改正式 `03-详细设计.md`。

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm |
| 当前允许 | 思考 `contracts`、`domain`、`application`、`infra`、`api`、`worker`、`jobs` 的模块测试入口候选、来源 Step、验证方向和禁止越界点。 |
| 当前禁止 | 写最终 module test cuts 表、接口测试切口表、状态机测试切口表、一致性 / 幂等测试切口表、完整 test case schema、fixture、evidence schema、CI pipeline、验收标准、implementation code、配置键或正式 `03-详细设计.md`。 |

### 2. 模块测试入口来源思考

| 来源 | R16.5 使用方式 | 当前裁决 |
|---|---|---|
| Step 5 模块主轴 | 固定七实现单元和依赖边界:`contracts`、`domain`、`application`、`infra`、`api`、`worker`、`jobs`。 | R16.5 只能围绕这七个模块思考,不得新增 test-only module。 |
| Step 6 对象契约 | 为 `contracts` / `domain` 提供 refs、marker、truth、state、guard、error、body-free redline 来源。 | 模块测试入口必须能反查对象不变量和 forbidden body。 |
| Step 7 port / adapter | 为 `application` / `infra` 提供 port contract、UoW、repository、fake adapter、resolver / publisher / handoff 来源。 | 模块测试入口不能新增测试专用 port 或 fake private source。 |
| Step 8 protocol | 为 `contracts`、`api`、`worker`、`jobs` 提供 command/query/event/job shell 来源。 | R16.5 只记模块入口;具体接口切口后移 R16.7~R16.10。 |
| Step 9 function flows | 为 `application`、`api`、`worker`、`jobs` 提供 accepted/rejected/duplicate/no-write/partial/failed 验证方向。 | R16.5 不展开具体 flow case。 |
| Step 10~13 | 为 `domain`、`application`、`infra`、`jobs` 提供状态、事务、恢复、幂等、并发来源。 | 模块入口只标注方向,状态机和一致性表后移。 |
| Step 14~15 | 为 `infra`、entry / runner 和全模块观测红线提供 config、adapter availability、redaction、audit refs-only 来源。 | R16.5 不写具体 key/env/topic/URL。 |

### 3. 七实现单元模块入口候选思考

| 实现单元 | 模块测试入口候选 | 来源 Step | 先思考判断 |
|---|---|---|---|
| `contracts` | typed ref / marker、request/result/view/event/job shell、safe error surface、body-free shell roundtrip。 | Step 5;Step 6;Step 8;Step 15 | 重点验证 public contract shell 稳定和 forbidden body,不验证具体 handler flow。 |
| `domain` | truth object invariant、value object guard、policy accept/reject、state predicate、domain error。 | Step 5;Step 6;Step 10;Step 12 | 重点验证领域规则和非法状态,不访问 repository、config、adapter 或 entry。 |
| `application` | service orchestration seam、port call order、UoW boundary、idempotency hook、query no-write guard。 | Step 5;Step 7;Step 9;Step 11;Step 13 | 重点验证编排和副作用顺序,不实现 adapter 细节。 |
| `infra` | repository / material store behavior、fake adapter failure injection、runtime builder wiring、config binding validation。 | Step 5;Step 7;Step 11;Step 14;Step 15 | 重点验证 adapter contract 和 failure mapping,不反向定义业务 owner。 |
| `api` | transport-neutral handler mapping、metadata propagation、protocol error mapping、application boundary invocation。 | Step 5;Step 8;Step 9;Step 12;Step 15 | 重点验证 entry 只转译和装配,不直接调用 domain 或实现 auth/gateway。 |
| `worker` | inbound envelope validation、dedup / unsupported source-version、event candidate publishing runner boundary。 | Step 5;Step 8;Step 9;Step 13;Step 15 | 重点验证 runner 边界和不恢复旧 outbox relay,不修 core truth。 |
| `jobs` | job input validation、batch/page behavior、partial failure、stale/degraded output、handoff report boundary。 | Step 5;Step 8;Step 9;Step 12;Step 13;Step 15 | 重点验证 operations job runner 和报告边界,不创建或修复 core truth。 |

### 4. 模块测试入口分层思考

| 层次 | 适用模块 | 思考重点 | 后续写入边界 |
|---|---|---|---|
| pure contract / domain | `contracts`;`domain` | 不依赖 runtime、repository、外部 adapter;验证 shell、ref、marker、invariant、state guard。 | R16.6 可写模块测试切口表的 contract/domain 行。 |
| service orchestration | `application` | 使用正式 port / fake 注入结果,验证 flow 顺序、UoW、idempotency、query no-write。 | R16.6 只写模块入口,具体 Command/Query 后移。 |
| adapter behavior | `infra` | 验证 repository / adapter 对 Step 7/11/14 的实现边界和 failure mapping。 | R16.6 不写具体持久化产品或配置键。 |
| entry / runner boundary | `api`;`worker`;`jobs` | 验证 protocol mapping、metadata propagation、runner isolation、no entry mutual dependency。 | R16.6 不展开每个 public API / event / job case。 |
| cross-cut redline | 全模块 | no raw body、no secret、no synthetic marker、low-cardinality label、audit refs-only。 | R16.6 只标注模块应承接的红线。 |

### 5. 禁止越界点思考

| 越界风险 | 禁止口径 |
|---|---|
| 把模块入口写成完整 test case matrix | R16.5/R16.6 只到模块级最小验证入口,TC 编号和覆盖矩阵后移。 |
| 为测试便利新增 schema / port / mapper / state | 必须回 Step 6/7/8/10/11/12/13 闭口,不能在 Step 16 自行补。 |
| 用 fake private map 绕过正式 port | fake 只能实现已正式定义的 port / adapter 语义。 |
| 在 `api` / `worker` / `jobs` 中绕过 application | entry / runner 只做转译、装配和调用 application boundary。 |
| 恢复旧 MethodContent / P0 / outbox relay 测试名 | 旧主线仍是 historical pollution,不得进入当前模块测试入口。 |
| 写具体 config key/env/topic/URL 或 CI suite | 后移到 `04/05/07`,Step 16 不固定运行环境。 |

### 6. R16.6 写入边界思考

`R16.6 module test cuts:再写入` 应把本模块思考固化为模块级测试切口表,但仍不得进入接口、状态机、一致性 / 幂等和完整 test case schema:

1. 写七实现单元模块测试切口表。
2. 每行包含 module、source Step、test cut intent、minimum assertions direction、forbidden shortcut。
3. 写模块测试切口与后续 R16.7~R16.16 的交接关系。
4. 写 `R16.7 Command / Query test cuts:先思考` 进入门禁。

### 7. R16.5 stop-review

| 检查项 | 结果 |
|---|---|
| 是否只思考七实现单元模块测试入口 | pass |
| 是否反查 Step 5 模块主轴和 Step 6~15 来源 | pass |
| 是否形成模块入口候选、分层和禁止越界点 | pass |
| 是否未写最终 module test cuts 表 | pass |
| 是否未写接口/状态机/一致性测试切口表 | pass |
| 是否未写 test case schema、fixture、evidence schema、CI | pass |
| 是否未修改正式 `03-详细设计.md` | pass |

next_allowed_action: 等待用户确认后进入 Step 16 `R16.6 module test cuts:再写入`;只允许写入七实现单元模块测试切口表、source Step、test cut intent、minimum assertions direction、forbidden shortcut、后续交接关系和 `R16.7 Command / Query test cuts:先思考` 进入门禁;不得直接修改正式 `03-详细设计.md`;不得写接口测试切口表、状态机测试切口表、一致性 / 幂等测试切口表、完整 test case schema、fixture、evidence schema、CI pipeline、验收标准、implementation code 或具体 config key/env/topic/URL。

---

## R16.6 module test cuts:再写入

### 1. 当前模块状态

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm |
| 用户确认 | 已确认从 `R16.5` 推进到 `R16.6`。 |
| 本模块写入范围 | 七实现单元模块测试切口表、source Step、test cut intent、minimum assertions direction、forbidden shortcut、后续交接关系和 `R16.7` 进入门禁。 |
| 本模块禁止范围 | 接口测试切口表、状态机测试切口表、一致性 / 幂等测试切口表、完整 test case schema、fixture、evidence schema、CI pipeline、验收标准、implementation code、具体 config key/env/topic/URL 和正式 `03-详细设计.md`。 |

### 2. 七实现单元模块测试切口表

| module | source Step | test cut intent | minimum assertions direction | forbidden shortcut |
|---|---|---|---|---|
| `contracts` | Step 5;Step 6;Step 8;Step 15 | 验证 typed ref / marker、request/result/view/event/job shell、safe error surface 和 body-free public shell。 | shell roundtrip 不丢 required field;public DTO 不携带 raw body/secret;marker 字段只复制正式来源;error surface 保持 safe message/ref。 | 不把旧 MethodContent/P0/P1 DTO 带回;不把 handler flow 或 adapter 行为塞进 contracts test。 |
| `domain` | Step 5;Step 6;Step 10;Step 12 | 验证 truth object、value object、policy、state predicate、guard 和 domain error 的纯领域规则。 | object invariant 成立;非法状态/非法输入返回正式 domain error;policy accept/reject 不访问 repository/config/adapter;forbidden body guard 生效。 | 不读写 repository;不依赖 runtime/config;不为测试便利合成未闭口 state、marker 或 body ref。 |
| `application` | Step 5;Step 7;Step 9;Step 11;Step 13 | 验证 command/query/consumer/job orchestration、port 调用顺序、UoW 边界、idempotency hook 和 query no-write guard。 | accepted/rejected/duplicate/no-write 分支调用正式 port;UoW commit/rollback 次序可验证;duplicate 使用 stored surface;Query 不写 truth/audit/event/repair。 | 不实现 adapter 细节;不从 current truth 重算 duplicate result;不绕过 domain policy 或正式 port。 |
| `infra` | Step 5;Step 7;Step 11;Step 14;Step 15 | 验证 repository、material store、fake adapter、resolver/publisher/handoff adapter、runtime builder 和 config binding 的实现边界。 | repository version / transaction 语义符合 port;fake failure injection 只模拟正式 failure;adapter unavailable/degraded 映射安全;runtime builder 不泄露 secret/body。 | 不固定具体 DB/bus/product;不反向决定业务 owner;不通过 fake private map 补正式 port 缺口。 |
| `api` | Step 5;Step 8;Step 9;Step 12;Step 15 | 验证同步 command/query handler 的 transport-neutral mapping、metadata propagation、protocol error mapping 和 application boundary invocation。 | handler 将 public request 安全映射给 application;metadata / actor / correlation 只走正式 shell;application error 映射为 protocol safe surface。 | 不实现 auth/gateway owner;不直接调用 domain/repository;不写具体 route/header/status-code 矩阵。 |
| `worker` | Step 5;Step 8;Step 9;Step 13;Step 15 | 验证 inbound consumer runner、event candidate publisher runner、dedup、unsupported source/version 和 runner isolation。 | inbound envelope 校验走正式 protocol;dedup / replay 不重跑业务;publisher failure 不回滚 accepted truth;runner 不与 api/jobs 互依。 | 不恢复旧 outbox relay;不修 core truth;不复制 external body;不私造 topic/env。 |
| `jobs` | Step 5;Step 8;Step 9;Step 12;Step 13;Step 15 | 验证 operations job runner、batch/page behavior、partial failure、stale/degraded output、resume 和 handoff report boundary。 | job input validation 使用正式 job shell;partial failure 产生 safe report/marker;resume/checkpoint 不重复副作用;handoff report 只含 refs/summary。 | 不创建或修复 core truth;不把 operations reads 提前写成完整 case;不复制 external/report/archive body。 |

### 3. 模块切口与后续模块交接

| 后续模块 | 从 module cuts 交接的内容 | 不交接的内容 |
|---|---|---|
| `R16.7/R16.8 Command / Query test cuts` | `contracts` 的 command/query shell、`application` 的 orchestration/no-write/idempotency、`api` 的 handler mapping。 | 不从本表直接生成完整 command/query case matrix。 |
| `R16.9/R16.10 Inbound / Outbound / Job test cuts` | `worker` runner boundary、`jobs` job boundary、`infra` publisher/handoff adapter failure direction。 | 不恢复旧 outbox relay 或写具体 topic/queue。 |
| `R16.11/R16.12 state machine test cuts` | `domain` state predicate、illegal transition、domain error 的模块入口。 | 不用模块表替代 Step 10 状态矩阵。 |
| `R16.13/R16.14 consistency / idempotency / concurrency cuts` | `application` UoW/idempotency、`infra` transaction/fake failure、`jobs` resume/checkpoint 方向。 | 不在本表写 race scenario 全量矩阵。 |
| `R16.15/R16.16 error / config / observability cuts` | `infra` config/adapter availability、全模块 redaction、audit refs-only、no synthetic marker 红线。 | 不写具体 config key/env、metric backend、dashboard 或 evidence schema。 |

### 4. 模块测试切口使用规则

| 规则 | 说明 |
|---|---|
| 每个 module cut 必须反查 source Step | 模块测试入口不能凭实现便利新增 schema、port、state、mapper 或 fixture-only fallback。 |
| module cut 是入口,不是完整测试方案 | 本表只规定最小验证方向;TC 编号、优先级、覆盖率、fixture、CI 和 evidence 后移。 |
| fake 只能实现正式 contract | fake repository / adapter 可用于 failure injection,但必须实现 Step 7 / Step 11 / Step 14 的正式语义。 |
| entry / runner 只验证边界 | `api`、`worker`、`jobs` 只转译和装配,不得通过测试切口获得 direct domain/repository 权限。 |
| 旧测试命名继续禁入 | MethodContent、P0/P1、snapshot、fingerprint、旧 outbox relay、Gateway context、PostgreSQL 等旧名不进入当前模块切口。 |

### 5. R16.7 进入门禁

`R16.7 Command / Query test cuts:先思考` 只允许思考同步 Command / Query 的测试切口:

1. 允许思考 Command accepted/rejected/duplicate/no-write side-effect、stored result replay、safe error surface。
2. 允许思考 Query visible/empty/degraded/not-visible/no-write、material mismatch、safe public surface。
3. 允许反查 Step 8 protocol、Step 9 flow、Step 11 stored surface、Step 12 error、Step 13 idempotency、Step 15 observability。
4. 禁止写最终 Command / Query test cuts 表、Inbound / Outbound / Job 表、状态机表、一致性 / 幂等表。
5. 禁止写完整 test case schema、fixture/evidence/CI、验收标准、implementation code 或正式 `03-详细设计.md`。

### 6. R16.6 stop-review

| 检查项 | 结果 |
|---|---|
| 是否写入七实现单元模块测试切口表 | pass |
| 是否为每行写入 source Step、intent、minimum assertions direction、forbidden shortcut | pass |
| 是否写入后续交接关系 | pass |
| 是否写入 R16.7 进入门禁 | pass |
| 是否未写接口/状态机/一致性测试切口表 | pass |
| 是否未写 test case schema、fixture、evidence schema、CI | pass |
| 是否未修改正式 `03-详细设计.md` | pass |

next_allowed_action: 等待用户确认后进入 Step 16 `R16.7 Command / Query test cuts:先思考`;只允许思考同步 Command / Query 的 accepted/rejected/duplicate/no-write/visible/empty/degraded/not-visible/material-mismatch/safe-surface 测试切口、来源 Step 和禁止越界点;不得直接修改正式 `03-详细设计.md`;不得写最终 Command / Query test cuts 表、Inbound / Outbound / Job 表、状态机测试切口表、一致性 / 幂等测试切口表、完整 test case schema、fixture、evidence schema、CI pipeline、验收标准、implementation code 或具体 config key/env/topic/URL。

---

## R16.7 Command / Query test cuts:先思考

### 1. 当前模块目标

`R16.7` 只思考同步 Command / Query 的测试切口、来源 Step 和禁止越界点。当前模块不写最终 Command / Query test cuts 表,不写 Inbound / Outbound / Job 表、状态机表、一致性 / 幂等表,也不修改正式 `03-详细设计.md`。

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm |
| 当前允许 | 思考 Command accepted/rejected/duplicate/no-write side-effect、stored result replay、safe error surface,以及 Query visible/empty/degraded/not-visible/material-mismatch/no-write/safe surface。 |
| 当前禁止 | 写最终 Command / Query test cuts 表、Inbound / Outbound / Job 表、状态机测试切口表、一致性 / 幂等测试切口表、完整 test case schema、fixture、evidence schema、CI pipeline、验收标准、implementation code、配置键或正式 `03-详细设计.md`。 |

### 2. Command / Query 来源思考

| 来源 | Command 使用方式 | Query 使用方式 | 当前裁决 |
|---|---|---|---|
| Step 8 protocol contracts | Command envelope、request intent、accepted/rejected/duplicate/effect shell。 | Query envelope、selector、response view、page、empty/not-visible/stale/degraded/unavailable shell。 | 测试切口必须验证 public shell 和 outcome family,不写 DTO 字段 schema。 |
| Step 9 function flows | shared command transaction template、58 个 Command flow card、accepted/rejected/duplicate branch。 | shared query read template、57 个 Query no-write overlay、visible/empty/degraded/unavailable branch。 | R16.7 可按 branch 类型思考,不逐条写 58/57 case。 |
| Step 11 persistence / transaction | accepted truth + stored accepted result atomicity、rejected replay surface、duplicate no-rerun。 | query no-write、read committed safe surface、no repair/refresh/event/job side effect。 | 测试入口要覆盖 transaction/no-write,但不写 persistence schema。 |
| Step 12 error / recovery | safe rejection、version conflict、stored surface missing、consistency/manual surface。 | safe absent、not-visible、degraded、unavailable、material mismatch surface。 | 错误测试只验证 safe public surface,不写 error code 全表。 |
| Step 13 concurrency / idempotency | same key same digest replay、different digest conflict、in-flight/commit unknown、no current truth rebuild。 | repeat query no idempotency store、copy-only stale/degraded/unavailable marker。 | Command 与 Query 必须分开:Command 有 replay guard;Query 只有 repeatable no-write。 |
| Step 15 observability / audit | accepted/rejected/duplicate 观测不得泄露 raw body/secret;post-commit failure 不回滚 truth。 | Query 观测 no raw body/no secret/low-cardinality,且不写 audit/truth/event。 | 观测断言只作为红线,不写 metric/report schema。 |

### 3. Command 测试切口思考

| Command 分支 | 测试入口候选 | 最小验证方向 | 禁止越界点 |
|---|---|---|---|
| accepted | command shell -> operation context -> idempotency reserve -> versioned load -> domain/policy -> UoW save -> stored accepted result -> commit。 | accepted truth/support/material 与 stored accepted replay surface 同一逻辑边界提交;effect/candidate 只含 body-free refs;post-commit publication/handoff failure 不回滚 accepted truth。 | 不在 accepted transaction 内做 publisher delivery、job body、transport retry、scheduler、external raw body read。 |
| rejected | invalid input、policy diagnostic、missing/stale version、unsafe source 等分支返回 safe rejection。 | rejected result 有 safe reason / marker 来源;必要时保存 replayable rejected surface;不产生 accepted truth/event candidate。 | 不从 exception text 拼 public rejection;不把 infrastructure error 当 domain rejection;不泄露 raw body。 |
| duplicate same digest | same idempotency key + same digest 命中 stored result。 | 只复制 stored accepted/rejected command surface;不重新 load truth、不重新执行业务、不创建第二个 event candidate。 | 不从 current truth 重建 response;不重新跑 mutation;不扫描 adapter 或 queue。 |
| duplicate different digest / in-flight | same key different digest 或 in-flight 冲突。 | 返回 formal conflict / delayed / safe surface;不进入 mutation body;缺 stored surface 转 consistency/manual。 | 不覆盖旧结果;不用 DB unique violation 替代正式 idempotency decision。 |
| no-write side-effect for non-accepted branch | rejected、duplicate、conflict、precondition unavailable 分支不写业务 truth。 | 可验证无 truth write、无 accepted event candidate、无 post-commit side effect;只允许正式 rejected/replay/diagnostic surface。 | 不用日志、metric 或 private flag 代替正式 stored/rejected surface。 |

### 4. Query 测试切口思考

| Query 分支 | 测试入口候选 | 最小验证方向 | 禁止越界点 |
|---|---|---|---|
| visible | selector / read context -> resolver/repository -> safe view/page assembly。 | 返回 body-free safe view、typed refs、page info 和正式 marker;不写 truth/audit/event/job/stored result。 | 不把 domain-only truth body 或 raw external body 放入 view。 |
| empty / safe absent | exact lookup missing 或 page empty。 | 返回 safe empty/absent surface,不得泄露不可见 truth 是否存在;page cursor 与 version/checkpoint 分离。 | 不把空数组当所有语义;不使用 bool 隐式表达 empty/not-visible/degraded。 |
| not-visible | read resolver 判定不可见。 | 返回 not-visible safe surface,不泄露 truth 存在性;marker / reason 只复制 resolver/mapper 输出。 | 不用 permission error 文本或 route/raw id 推断 public surface。 |
| stale / degraded / unavailable | material stale、partial item missing、resolver/adapter unavailable、degraded mapper 输出。 | 复制 freshness/degraded/unavailable marker;保留 safe diagnostic ref;不修复 material。 | 不自行合成 marker;不从 timestamp/string/error text 推断 stale/degraded。 |
| material mismatch / integrity mismatch | loaded material 与 selector、owner、scope、subject、version 或 source cursor 不一致。 | 返回 safe degraded/consistency surface;不刷新 projection/material;必要缺口回 Step 6/7/9/12 闭口。 | 不静默跳过有问题 item;不把 mismatch 修成成功 read。 |
| repeat query / no-write | 同一 Query 重复调用。 | 重新读取当前 authorized read surface;不 reserve idempotency;不保存 query result;不 append audit/success trace。 | 不给 Query 写 idempotency record;不启动 job;不 publish event;不做 read repair。 |

### 5. Command / Query 共同红线思考

| 红线 | Command 思考 | Query 思考 |
|---|---|---|
| public shell 来源 | request/result/rejection/effect 必须回指 Step 8 shell 和 Step 6/7/11 来源。 | view/page/empty/not-visible/degraded/unavailable 必须回指 Step 8 shell 和 read resolver/material source。 |
| stored replay | duplicate 只能复制 stored result / replay surface。 | Query 无 stored replay;重复读不保存结果。 |
| marker copy-only | rejection/degraded/unavailable marker 不得合成。 | not-visible/stale/degraded/unavailable marker 只复制 resolver / mapper / availability。 |
| body-free | command result/effect 只含 refs/summary。 | query view/page 只含 safe view/typed refs/marker。 |
| observability | accepted/rejected/duplicate logs/metrics/traces 不泄露 raw body/secret。 | Query observation 不写业务状态,不泄露 raw body/secret。 |

### 6. R16.8 写入边界思考

`R16.8 Command / Query test cuts:再写入` 应把本模块思考固化为同步 Command / Query 测试切口表,但仍不写完整 case schema:

1. 写 Command test cuts 表,覆盖 accepted、rejected、duplicate same digest、duplicate conflict/in-flight、non-accepted no-write side-effect。
2. 写 Query test cuts 表,覆盖 visible、empty/safe absent、not-visible、stale/degraded/unavailable、material mismatch、repeat no-write。
3. 每行写 source Step、test cut intent、minimum assertions direction、forbidden shortcut。
4. 写 `R16.9 Inbound / Outbound / Job test cuts:先思考` 进入门禁。

### 7. R16.7 stop-review

| 检查项 | 结果 |
|---|---|
| 是否只思考 Command / Query 测试切口 | pass |
| 是否反查 Step 8/9/11/12/13/15 来源 | pass |
| 是否区分 Command duplicate replay 与 Query repeat no-write | pass |
| 是否形成 accepted/rejected/duplicate 与 visible/empty/degraded/not-visible/material mismatch 思考 | pass |
| 是否未写最终 Command / Query test cuts 表 | pass |
| 是否未写 Inbound / Outbound / Job、状态机、一致性 / 幂等测试表 | pass |
| 是否未修改正式 `03-详细设计.md` | pass |

next_allowed_action: 等待用户确认后进入 Step 16 `R16.8 Command / Query test cuts:再写入`;只允许写入 Command / Query test cuts 表、source Step、test cut intent、minimum assertions direction、forbidden shortcut、后续交接关系和 `R16.9 Inbound / Outbound / Job test cuts:先思考` 进入门禁;不得直接修改正式 `03-详细设计.md`;不得写 Inbound / Outbound / Job test cuts 表、状态机测试切口表、一致性 / 幂等测试切口表、完整 test case schema、fixture、evidence schema、CI pipeline、验收标准、implementation code 或具体 config key/env/topic/URL。

---

## R16.8 Command / Query test cuts:再写入

### 1. 当前模块状态

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm |
| 用户确认 | 已确认从 `R16.7` 推进到 `R16.8`。 |
| 本模块写入范围 | Command / Query test cuts 表、source Step、test cut intent、minimum assertions direction、forbidden shortcut、后续交接关系和 `R16.9` 进入门禁。 |
| 本模块禁止范围 | Inbound / Outbound / Job test cuts 表、状态机测试切口表、一致性 / 幂等测试切口表、完整 test case schema、fixture、evidence schema、CI pipeline、验收标准、implementation code、具体 config key/env/topic/URL 和正式 `03-详细设计.md`。 |

### 2. Command test cuts 表

| Command cut | source Step | test cut intent | minimum assertions direction | forbidden shortcut |
|---|---|---|---|---|
| accepted transaction cut | Step 8;Step 9;Step 11;Step 15 | 验证 accepted command 从 public shell 进入 operation context、domain/policy、UoW save、stored accepted result 和 body-free effect/candidate。 | accepted truth/support/material 与 stored accepted replay surface 同一逻辑边界提交;effect/candidate 只含 refs/summary;post-commit publication/handoff failure 不回滚 accepted truth。 | 不在 accepted transaction 内执行 publisher delivery、job body、transport retry、scheduler 或 external raw body read。 |
| rejected safe surface cut | Step 8;Step 9;Step 12;Step 15 | 验证 invalid input、policy diagnostic、missing/stale version、unsafe source 等 rejected 分支的 public surface。 | rejected result 有 safe reason / marker 来源;必要时保存 replayable rejected surface;无 accepted truth write、无 accepted event candidate。 | 不从 exception text 拼 public rejection;不把 infrastructure error 伪装成 domain rejection;不泄露 raw body。 |
| duplicate same digest replay cut | Step 8;Step 9;Step 11;Step 13 | 验证 same idempotency key + same digest 只 replay stored command surface。 | duplicate 复制 stored accepted/rejected result;不重新 load truth、不重新执行业务、不创建第二个 event candidate。 | 不从 current truth 重建 response;不重跑 mutation;不扫描 adapter、queue 或 publisher state。 |
| duplicate conflict / in-flight cut | Step 8;Step 12;Step 13 | 验证 same key different digest、in-flight 或 stored surface missing 的 safe outcome。 | different digest 返回 formal conflict;in-flight 返回 delayed/safe surface;missing stored surface 转 consistency/manual surface;均不进入 mutation body。 | 不覆盖旧结果;不用 DB unique violation 替代正式 idempotency decision;不把 missing stored result 当 fresh command。 |
| non-accepted no-write cut | Step 9;Step 11;Step 12;Step 15 | 验证 rejected、duplicate、conflict、precondition unavailable 等非 accepted 分支不写业务 truth。 | 无 truth/support/material write;无 accepted event candidate;无 post-commit side effect;只允许正式 rejected/replay/diagnostic surface。 | 不用日志、metric、private flag 或 fake state 代替正式 stored/rejected surface。 |

### 3. Query test cuts 表

| Query cut | source Step | test cut intent | minimum assertions direction | forbidden shortcut |
|---|---|---|---|---|
| visible safe view cut | Step 8;Step 9;Step 11;Step 15 | 验证 selector / read context -> resolver/repository -> safe view/page assembly 的可见读取。 | 返回 body-free safe view、typed refs、page info 和正式 marker;不写 truth/audit/event/job/stored result。 | 不把 domain-only truth body、raw external body 或 adapter private fields 放入 view。 |
| empty / safe absent cut | Step 8;Step 9;Step 12 | 验证 exact lookup missing 或 page empty 的 public surface。 | 返回 safe empty/absent surface;不泄露不可见 truth 是否存在;page cursor 与 optimistic version/checkpoint 分离。 | 不用空数组或 bool 隐式替代 empty/not-visible/degraded 语义。 |
| not-visible cut | Step 8;Step 9;Step 12;Step 15 | 验证 read resolver 判定不可见的 safe surface。 | 返回 not-visible surface;不泄露 truth 存在性;marker / reason 只复制 resolver/mapper 输出。 | 不用 permission error 文本、route param 或 raw id 推断 public surface。 |
| stale / degraded / unavailable cut | Step 8;Step 9;Step 12;Step 13;Step 15 | 验证 stale material、partial item missing、resolver/adapter unavailable、degraded mapper 输出。 | 复制 freshness/degraded/unavailable marker;保留 safe diagnostic ref;不修复 material、不启动 job、不发布 event。 | 不自行合成 marker;不从 timestamp、string 或 error text 推断 stale/degraded/unavailable。 |
| material mismatch / integrity mismatch cut | Step 9;Step 11;Step 12 | 验证 loaded material 与 selector、owner、scope、subject、version 或 source cursor 不一致。 | 返回 safe degraded/consistency surface;不刷新 projection/material;必要缺口回对应 Step 闭口。 | 不静默跳过问题 item;不把 mismatch 修成成功 read;不私造 mapper/source。 |
| repeat no-write cut | Step 9;Step 11;Step 13;Step 15 | 验证同一 Query 重复调用只是重复读取 authorized read surface。 | 不 reserve idempotency;不保存 query result;不 append audit/success trace;不写 truth/repair/event/job。 | 不给 Query 写 idempotency record;不启动 refresh/rebuild job;不 publish event;不做 read repair。 |

### 4. Command / Query 切口交接关系

| 后续模块 | 交接内容 | 不交接内容 |
|---|---|---|
| `R16.9/R16.10 Inbound / Outbound / Job test cuts` | Command accepted stored fact/effect 是 Outbound candidate 来源之一;Query no-write 作为 jobs/operations reads 的禁止基线。 | 不把 Inbound receipt、Outbound publication、Job report 切口塞进本模块。 |
| `R16.11/R16.12 state machine test cuts` | Command accepted/rejected/conflict 和 Query visible/empty/degraded/not-visible 可反查状态主语。 | 不用本表替代 Step 10 状态矩阵。 |
| `R16.13/R16.14 consistency / idempotency / concurrency cuts` | Command duplicate replay、different digest conflict、commit unknown、Query repeat no-write。 | 不在本表写 race / retry / checkpoint 全量场景。 |
| `R16.15/R16.16 error / config / observability cuts` | safe rejection、safe read surface、no raw body/no secret、marker copy-only、post-commit no rollback。 | 不写 error taxonomy 全表、config key 或 metric/evidence schema。 |

### 5. Command / Query 切口使用规则

| 规则 | 说明 |
|---|---|
| Command 是唯一同步写入口 | 只有 accepted Command 可以写业务 truth/support/material,且必须与 stored replay surface 同边界提交。 |
| Query 永远 no-write | Query 只能读 committed truth/material/summary/resolver output,不得 repair、refresh、append、publish、start job 或 store replay。 |
| duplicate 与 repeat 必须区分 | Command duplicate 走 stored replay;Query repeat 只是重新读,无 idempotency record。 |
| public surface copy-only | rejection、not-visible、stale、degraded、unavailable marker 必须复制正式 mapper/resolver/availability 输出。 |
| 本表不是 case schema | TC id、fixture、CI、evidence、执行命令、覆盖率和报告模板后移 `05/06/07`。 |

### 6. R16.9 进入门禁

`R16.9 Inbound / Outbound / Job test cuts:先思考` 只允许思考异步 / 后台协议族的测试切口:

1. 允许思考 Inbound accepted/duplicate/rejected/quarantine/delayed/no-op/body-free receipt。
2. 允许思考 Outbound candidate assembly、publication success/failure、blocked/degraded/unavailable、post-commit no rollback。
3. 允许思考 Operations Job accepted/duplicate/resume/checkpoint/partial failure/degraded/report boundary/no core truth repair。
4. 允许反查 Step 8 protocol、Step 9 flow、Step 11 stored receipt/report/outcome、Step 12 error/recovery、Step 13 replay/checkpoint、Step 15 observability。
5. 禁止写最终 Inbound / Outbound / Job test cuts 表、状态机表、一致性 / 幂等表、完整 test case schema、fixture/evidence/CI、验收标准、implementation code 或正式 `03-详细设计.md`。

### 7. R16.8 stop-review

| 检查项 | 结果 |
|---|---|
| 是否写入 Command test cuts 表 | pass |
| 是否写入 Query test cuts 表 | pass |
| 是否每行包含 source Step、intent、minimum assertions direction、forbidden shortcut | pass |
| 是否写入后续交接关系和 R16.9 进入门禁 | pass |
| 是否未写 Inbound / Outbound / Job、状态机、一致性 / 幂等测试表 | pass |
| 是否未写完整 test case schema、fixture、evidence schema、CI | pass |
| 是否未修改正式 `03-详细设计.md` | pass |

next_allowed_action: 等待用户确认后进入 Step 16 `R16.9 Inbound / Outbound / Job test cuts:先思考`;只允许思考 Inbound / Outbound / Operations Job 的 accepted/duplicate/rejected/quarantine/delayed/no-op/candidate/publication/blocked/degraded/unavailable/resume/checkpoint/partial-failure/report-boundary/no-core-truth-repair 测试切口、来源 Step 和禁止越界点;不得直接修改正式 `03-详细设计.md`;不得写最终 Inbound / Outbound / Job test cuts 表、状态机测试切口表、一致性 / 幂等测试切口表、完整 test case schema、fixture、evidence schema、CI pipeline、验收标准、implementation code 或具体 config key/env/topic/URL。

---

## R16.9 Inbound / Outbound / Job test cuts:先思考

### 1. 当前模块目标

`R16.9` 只思考 Inbound Consumer、Outbound Event / Publisher、Operations Job 三类异步 / 后台协议族的测试切口、来源 Step 和禁止越界点。当前模块不写最终 Inbound / Outbound / Job test cuts 表,不写状态机表、一致性 / 幂等表,也不修改正式 `03-详细设计.md`。

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm |
| 当前允许 | 思考 Inbound accepted/duplicate/rejected/quarantine/delayed/no-op/body-free receipt;Outbound candidate/publication/blocked/degraded/unavailable/post-commit no rollback;Operations Job accepted/duplicate/resume/checkpoint/partial failure/degraded/report boundary/no core truth repair。 |
| 当前禁止 | 写最终 Inbound / Outbound / Job test cuts 表、状态机测试切口表、一致性 / 幂等测试切口表、完整 test case schema、fixture、evidence schema、CI pipeline、验收标准、implementation code、具体 config key/env/topic/URL 或正式 `03-详细设计.md`。 |

### 2. Inbound / Outbound / Job 来源思考

| 来源 | Inbound 使用方式 | Outbound 使用方式 | Job 使用方式 |
|---|---|---|---|
| Step 8 protocol contracts | inbound envelope、typed payload boundary、intake decision、receipt / worker result shell。 | body-free event shell、event candidate、publication outcome、blocked/degraded/unavailable surface。 | job input/result/progress/checkpoint/report boundary、partial/degraded/unavailable、duplicate/replay shell。 |
| Step 9 function flows | 4 个 Inbound overlay、stored receipt、duplicate no source reprocessing、body-free intake。 | 34 个 Outbound overlay、candidate assembly 与 publication outcome 分离、publisher 不重读 truth。 | 8 个 Job overlay、checkpoint/resume/partial/report、no core truth repair。 |
| Step 11 persistence / transaction | receipt 与 intake decision 的 stored shell;无 core truth mutation。 | candidate/outcome stored shell;post-commit side effect 不回滚 accepted truth。 | progress/checkpoint/run history/report stored shell;checkpoint 不替代 version/cursor。 |
| Step 12 error / recovery | unsupported、malformed、quarantine、delayed/unavailable 的 safe receipt。 | blocked、failed、degraded、unavailable publication outcome。 | partial issue、blocked/manual、unavailable/degraded report surface。 |
| Step 13 concurrency / idempotency | redelivery duplicate replay stored receipt;broker ack/topic/offset 不是真相源。 | retry 只能从 durable candidate 与 formal outcome 恢复。 | duplicate replay stored report;resume 只能从 formal checkpoint/progress/report/issue source。 |
| Step 15 observability / audit | accepted intake、duplicate、unsupported、malformed、delayed 只写 safe log/metric/receipt。 | publication outcome 可观测但不泄露 payload;failure 不回滚 accepted fact。 | progress/report/partial issue 可观测;不保存 raw report body 或 scheduler private state。 |

### 3. Inbound 测试切口思考

| Inbound 分支 | 测试入口候选 | 最小验证方向 | 禁止越界点 |
|---|---|---|---|
| accepted intake | inbound envelope -> schema/source validation -> dedup reserve -> body-free adapter/source port -> intake summary/receipt。 | accepted receipt 只含 safe intake summary ref、source refs、worker result;不创建 definition/formal version/core truth。 | 不保存 raw broker payload、provider body、archive body 或 rejected body excerpt。 |
| duplicate redelivery | same formal source binding / semantic material 命中 stored receipt。 | duplicate 只 replay stored receipt;不重新解析 source body、不重新调用 adapter、不产生第二个 intake summary。 | 不用 broker ack、topic、offset、dead-letter state 或 fake private map 证明 duplicate。 |
| unsupported / malformed / raw body | schema unsupported、malformed envelope、raw body boundary violation。 | 返回 safe unsupported/rejected/quarantine receipt;不进入 core mutation;观测只含 safe refs/reason。 | 不把 raw payload parse 成业务对象;不把 quarantine 当 accepted intake。 |
| delayed / unavailable | source / adapter / resolver 暂不可用。 | 返回 safe delayed/unavailable receipt,marker 复制 adapter/source availability;允许后续正式 retry。 | 不从 adapter error text 合成 marker;不以 transport retry 作为业务结果。 |
| no-op / bounded hint | 输入合法但不需要业务变更或只产生 safe hint。 | 返回 safe no-op / intake hint,不触发 Command truth mutation;如有 event hint 必须 body-free。 | 不把 no-op 静默当 success without receipt;不启动隐藏 command。 |

### 4. Outbound 测试切口思考

| Outbound 分支 | 测试入口候选 | 最小验证方向 | 禁止越界点 |
|---|---|---|---|
| candidate assembly | load stored accepted command / completed job / bounded intake refs -> assemble body-free candidate。 | candidate 只复制 changed refs、marker refs、safe reason refs、trace context、target hint。 | publisher 不重读 current truth;不从 domain body、raw event body 或 topic 拼 payload。 |
| publication success | candidate shell -> target registry / adapter availability -> publisher port -> published outcome。 | publication outcome 有 formal target/outcome ref;success 不改变 already accepted truth。 | 不把 external delivery receipt body 存成 truth;不恢复旧 outbox relay。 |
| publication failed / blocked | target blocked、publisher failed、adapter unavailable。 | 返回 safe failed/blocked/unavailable outcome;post-commit failure 不回滚 accepted truth/stored result/report。 | 不把 failure 当 command rollback;不靠 raw transport response 暴露原因。 |
| degraded / unavailable marker | mapper / availability 输出降级或不可用。 | blocked/degraded/unavailable marker copy-only;缺 marker source 时停审回设计。 | 不自行合成 marker;不从 topic、HTTP status、error text 推断 public outcome。 |
| retry / reentry | worker retry publication。 | 只能从 durable candidate 和 formal publication outcome guard 恢复;不得重建 candidate payload。 | 不扫描 current truth、queue 或 subscriber state 重新组装事件。 |

### 5. Operations Job 测试切口思考

| Job 分支 | 测试入口候选 | 最小验证方向 | 禁止越界点 |
|---|---|---|---|
| accepted / run start | job shell -> reserve job idempotency -> load task/checkpoint -> planner targets -> read committed truth/material。 | job input valid;run/progress/checkpoint/report shell 来源正式;只写派生 material/progress/report。 | 不定义 scheduler/queue/lease/trigger;不创建或修 core truth。 |
| duplicate completed | same job/run guard 命中 stored report。 | duplicate 返回 stored job report,不重新 target scan、不重新写 derived material。 | 不用 scheduler lease、queue offset、timestamp 或 current material scan 证明 duplicate。 |
| resume from checkpoint | previous run interrupted or partial。 | resume 只能从 formal checkpoint/progress/report/issue source 继续;checkpoint 不替代 page cursor 或 optimistic version。 | 不用 lease token、queue offset、retry count 或 adapter note 代替 checkpoint。 |
| partial failure / degraded | subset target missing、adapter unavailable、lineage/material issue。 | 产生 safe issue refs、partial counters、degraded/unavailable marker、stored report;不静默成功。 | 不跳过 failed subset 后声明 full success;不把 raw report body 存入 report。 |
| blocked / manual | checkpoint/report/issue source missing 或 marker source 不闭合。 | 返回 blocked/manual surface;实现应暂停回设计或等待 operator,不得自动补口。 | 不用 private fake map、timestamp、string marker 或 material scan 补正式来源。 |
| completion / report boundary | job closes progress/checkpoint/report and optional event candidate hint。 | stored report、progress/checkpoint closure、body-free event hint;report 只含 refs/summary/marker。 | 不保存 archive body、observability ledger body、external document body 或 scheduler private state。 |

### 6. 三类异步 / 后台共同红线思考

| 红线 | Inbound | Outbound | Operations Job |
|---|---|---|---|
| body-free | envelope / typed payload boundary 不含 raw provider body。 | candidate / publication outcome 不含 raw event payload。 | report / progress / issue 不含 raw report or external body。 |
| no hidden truth mutation | Inbound 不创建 core truth。 | Publisher 不修改 accepted truth。 | Job 不修 core truth。 |
| replay no-rerun | duplicate replay stored receipt。 | retry uses stored candidate/outcome guard。 | duplicate replay stored report;resume uses checkpoint。 |
| marker copy-only | delayed/unavailable marker 复制 source/adapter output。 | blocked/degraded/unavailable marker 复制 mapper/availability。 | partial/degraded/unavailable marker 复制 progress/availability/mapper。 |
| runtime detail separation | broker ack/topic/offset 不是 receipt truth。 | topic/delivery receipt body 不是 outcome truth。 | scheduler lease/queue offset 不是 checkpoint/report。 |

### 7. R16.10 写入边界思考

`R16.10 Inbound / Outbound / Job test cuts:再写入` 应把本模块思考固化为三张测试切口表,但仍不写状态机、一致性 / 幂等全表或完整 case schema:

1. 写 Inbound test cuts 表,覆盖 accepted、duplicate、unsupported/malformed/quarantine、delayed/unavailable、no-op/hint。
2. 写 Outbound test cuts 表,覆盖 candidate assembly、publication success、failed/blocked、degraded/unavailable marker、retry/reentry。
3. 写 Operations Job test cuts 表,覆盖 accepted/run start、duplicate completed、resume checkpoint、partial/degraded、blocked/manual、completion/report boundary。
4. 每行写 source Step、test cut intent、minimum assertions direction、forbidden shortcut。
5. 写 `R16.11 state machine test cuts:先思考` 进入门禁。

### 8. R16.9 stop-review

| 检查项 | 结果 |
|---|---|
| 是否只思考 Inbound / Outbound / Job 测试切口 | pass |
| 是否反查 Step 8/9/11/12/13/15 来源 | pass |
| 是否区分 Inbound receipt、Outbound candidate/outcome、Job report/checkpoint | pass |
| 是否明确 no core truth mutation / no rollback / no repair | pass |
| 是否未写最终 Inbound / Outbound / Job test cuts 表 | pass |
| 是否未写状态机、一致性 / 幂等、完整 test case schema | pass |
| 是否未修改正式 `03-详细设计.md` | pass |

next_allowed_action: 等待用户确认后进入 Step 16 `R16.10 Inbound / Outbound / Job test cuts:再写入`;只允许写入 Inbound / Outbound / Operations Job test cuts 表、source Step、test cut intent、minimum assertions direction、forbidden shortcut、后续交接关系和 `R16.11 state machine test cuts:先思考` 进入门禁;不得直接修改正式 `03-详细设计.md`;不得写状态机测试切口表、一致性 / 幂等测试切口表、完整 test case schema、fixture、evidence schema、CI pipeline、验收标准、implementation code 或具体 config key/env/topic/URL。

---

## R16.10 Inbound / Outbound / Job test cuts:再写入

### 1. 当前模块状态

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm |
| 用户确认 | 已确认从 `R16.9` 推进到 `R16.10`。 |
| 本模块写入范围 | Inbound / Outbound / Operations Job test cuts 表、source Step、test cut intent、minimum assertions direction、forbidden shortcut、后续交接关系和 `R16.11` 进入门禁。 |
| 本模块禁止范围 | 状态机测试切口表、一致性 / 幂等测试切口表、完整 test case schema、fixture、evidence schema、CI pipeline、验收标准、implementation code、具体 config key/env/topic/URL 和正式 `03-详细设计.md`。 |

### 2. Inbound test cuts 表

| Inbound cut | source Step | test cut intent | minimum assertions direction | forbidden shortcut |
|---|---|---|---|---|
| accepted intake cut | Step 8;Step 9;Step 11;Step 15 | 验证 inbound envelope 经过 schema/source validation、dedup 和 body-free adapter/source port 后落成 intake summary / receipt。 | accepted receipt 只含 safe intake summary ref、source refs 和 worker result;不创建 definition、formal version 或 core truth;观测只含 safe refs / reason。 | 不保存 raw broker payload、provider body、archive body 或 rejected body excerpt。 |
| duplicate redelivery cut | Step 9;Step 11;Step 13 | 验证 same formal source binding / semantic material 的 redelivery 只命中 stored receipt。 | duplicate 只 replay stored receipt;不重新解析 source body、不重新调用 adapter、不产生第二个 intake summary。 | 不用 broker ack、topic、offset、dead-letter state 或 fake private map 证明 duplicate。 |
| unsupported / malformed / quarantine cut | Step 8;Step 9;Step 12;Step 15 | 验证 unsupported schema、malformed envelope 或 raw body boundary violation 的 safe intake outcome。 | 返回 safe unsupported / rejected / quarantine receipt;不进入 core mutation;reason / marker 必须来自正式 mapper/source。 | 不把 raw payload parse 成业务对象;不把 quarantine 当 accepted intake。 |
| delayed / unavailable cut | Step 8;Step 12;Step 13;Step 15 | 验证 source、adapter 或 resolver 暂不可用时的 delayed / unavailable receipt。 | 返回 safe delayed / unavailable receipt;marker 复制 adapter/source availability;后续 retry 只走正式重入入口。 | 不从 adapter error text 合成 marker;不以 transport retry 作为业务结果。 |
| no-op / bounded hint cut | Step 8;Step 9;Step 15 | 验证合法输入但无需业务变更或只产生 bounded hint 的分支。 | 返回 safe no-op / intake hint;不触发 Command truth mutation;如有 event hint 必须 body-free。 | 不把 no-op 静默当 success without receipt;不启动隐藏 command。 |

### 3. Outbound test cuts 表

| Outbound cut | source Step | test cut intent | minimum assertions direction | forbidden shortcut |
|---|---|---|---|---|
| candidate assembly cut | Step 8;Step 9;Step 11;Step 15 | 验证从 stored accepted command、completed job 或 bounded intake refs 组装 body-free event candidate。 | candidate 只复制 changed refs、marker refs、safe reason refs、trace context 和 target hint;publisher 不重读 current truth。 | 不从 domain body、raw event body、topic 或 current truth 扫描重建 payload。 |
| publication success cut | Step 8;Step 9;Step 11;Step 15 | 验证 candidate shell 经 target registry / adapter availability / publisher port 落成 published outcome。 | publication outcome 有 formal target / outcome ref;success 不改变 already accepted truth、stored command result 或 stored job report。 | 不把 external delivery receipt body 存成 truth;不恢复旧 outbox relay。 |
| publication failed / blocked cut | Step 9;Step 11;Step 12;Step 15 | 验证 target blocked、publisher failed、adapter unavailable 的 safe outcome。 | 返回 safe failed / blocked / unavailable outcome;post-commit failure 不回滚 accepted truth、stored result 或 report。 | 不把 failure 当 command rollback;不靠 raw transport response 暴露原因。 |
| degraded / unavailable marker cut | Step 8;Step 12;Step 14;Step 15 | 验证 blocked、degraded、unavailable marker 只能复制正式 mapper / availability 输出。 | marker copy-only;缺 marker source 时停审回设计;观测面只含 safe marker/ref/category。 | 不自行合成 marker;不从 topic、HTTP status、error text 推断 public outcome。 |
| retry / reentry cut | Step 11;Step 13;Step 15 | 验证 worker retry publication 只能从 durable candidate 和 formal publication outcome guard 恢复。 | retry 不重建 candidate payload;不重新读取 truth;只按 stored candidate/outcome guard 推进。 | 不扫描 current truth、queue、subscriber state 或 delivery backend 重新组装事件。 |

### 4. Operations Job test cuts 表

| Operations Job cut | source Step | test cut intent | minimum assertions direction | forbidden shortcut |
|---|---|---|---|---|
| accepted / run start cut | Step 8;Step 9;Step 11;Step 13 | 验证 job shell、job idempotency、task/checkpoint、planner targets 和 committed read source 的开跑边界。 | job input valid;run/progress/checkpoint/report shell 来源正式;只写 derived material、progress、checkpoint 或 report。 | 不定义 scheduler、queue、lease、trigger 细节;不创建或修 core truth。 |
| duplicate completed cut | Step 8;Step 11;Step 13 | 验证 same job/run guard 命中 stored report 的 duplicate completed 分支。 | duplicate 返回 stored job report;不重新 target scan、不重新写 derived material、不重算 report。 | 不用 scheduler lease、queue offset、timestamp 或 current material scan 证明 duplicate。 |
| resume checkpoint cut | Step 9;Step 11;Step 13 | 验证 interrupted / partial run 只能从 formal checkpoint、progress、report 或 issue source 继续。 | resume source 正式闭口;checkpoint 不替代 page cursor、optimistic version 或 selector boundary。 | 不用 lease token、queue offset、retry count 或 adapter note 代替 checkpoint。 |
| partial / degraded cut | Step 9;Step 12;Step 13;Step 15 | 验证 subset target missing、adapter unavailable、lineage/material issue 的 partial report。 | 产生 safe issue refs、partial counters、degraded/unavailable marker 和 stored report;不得静默成功。 | 不跳过 failed subset 后声明 full success;不把 raw report body 存入 report。 |
| blocked / manual cut | Step 12;Step 13;Step 15 | 验证 checkpoint/report/issue source missing、marker source 不闭合或 material corrupt 时的 blocked/manual surface。 | 返回 blocked/manual surface;实现应暂停回设计或等待 operator;不得自动补口。 | 不用 private fake map、timestamp、string marker 或 material scan 补正式来源。 |
| completion / report boundary cut | Step 8;Step 9;Step 11;Step 15 | 验证 job 关闭 progress/checkpoint/report 并可产生 body-free event candidate hint。 | stored report、progress/checkpoint closure、body-free event hint;report 只含 refs、summary、marker。 | 不保存 archive body、observability ledger body、external document body 或 scheduler private state。 |

### 5. Inbound / Outbound / Job 切口交接关系

| 后续模块 | 交接内容 | 不交接内容 |
|---|---|---|
| `R16.11/R16.12 state machine test cuts` | Inbound receipt state、Outbound publication outcome state、Job run/progress/report state 可作为状态主语候选。 | 不在本模块展开合法/非法转换矩阵。 |
| `R16.13/R16.14 consistency / idempotency / concurrency cuts` | redelivery receipt replay、publication retry guard、job duplicate report replay、checkpoint resume 是后续一致性 / 幂等输入。 | 不在本模块写 UoW rollback、commit unknown、race、same/different digest 全量表。 |
| `R16.15/R16.16 error / config / observability cuts` | unsupported/malformed、blocked/degraded/unavailable、no raw body、marker copy-only、post-commit no rollback 是错误 / 配置 / 观测输入。 | 不写 error taxonomy 全表、config key/env/topic/URL、metric/evidence schema。 |
| `R16.17/R16.18 closure` | 三类异步 / 后台协议族已具备最小测试入口和 source Step 反查。 | 不替代 `05-测试方案.md`、`06-验收标准.md` 或 `07-实施计划.md`。 |

### 6. R16.11 进入门禁

`R16.11 state machine test cuts:先思考` 只允许思考从 Step 10 正式状态矩阵抽取状态机测试入口:

1. 允许思考各状态主语的 legal transition、illegal transition、state owner/source 和 side-effect/no-side-effect 断言方向。
2. 允许反查 Step 6 object state owner、Step 9 flow 分支、Step 11 persistence boundary、Step 12 safe error surface、Step 13 race/reentry 约束。
3. 禁止写最终 state machine test cuts 表、一致性 / 幂等测试切口表、完整 test case schema、fixture、evidence schema、CI pipeline、验收标准、implementation code 或正式 `03-详细设计.md`。
4. 禁止恢复旧 MethodContent、P0/P1、snapshot、fingerprint、旧 outbox relay 或旧状态名。

### 7. R16.10 stop-review

| 检查项 | 结果 |
|---|---|
| 是否写入 Inbound test cuts 表 | pass |
| 是否写入 Outbound test cuts 表 | pass |
| 是否写入 Operations Job test cuts 表 | pass |
| 是否每行包含 source Step、intent、minimum assertions direction、forbidden shortcut | pass |
| 是否写入后续交接关系和 R16.11 进入门禁 | pass |
| 是否未写状态机、一致性 / 幂等、完整 test case schema | pass |
| 是否未修改正式 `03-详细设计.md` | pass |

next_allowed_action: 等待用户确认后进入 Step 16 `R16.11 state machine test cuts:先思考`;只允许思考 state machine test cuts 的 legal/illegal transition、state owner/source、side-effect/no-side-effect assertions、safe error surface direction 和 Step 6/9/10/11/12/13 反查关系;不得直接修改正式 `03-详细设计.md`;不得写最终 state machine test cuts 表、一致性 / 幂等测试切口表、完整 test case schema、fixture、evidence schema、CI pipeline、验收标准、implementation code 或具体 config key/env/topic/URL。

---

## R16.11 state machine test cuts:先思考

### 1. 当前模块目标

`R16.11` 只思考如何从 Step 10 正式状态矩阵抽取状态机测试切口。当前模块不写最终 state machine test cuts 表,不写一致性 / 幂等测试切口表,不写完整 case schema,也不修改正式 `03-详细设计.md`。

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm |
| 当前允许 | 思考 legal transition、illegal transition、state owner/source、trigger/precondition、side-effect/no-side-effect、safe error surface 和 Step 6/9/10/11/12/13 反查关系。 |
| 当前禁止 | 写最终 state machine test cuts 表、一致性 / 幂等测试切口表、完整 test case schema、fixture、evidence schema、CI pipeline、验收标准、implementation code、具体 config key/env/topic/URL 或正式 `03-详细设计.md`。 |

### 2. Step 10 状态族到测试关注点思考

| Step 10 状态族 | 测试关注点思考 | 当前不落地内容 |
|---|---|---|
| business truth | 覆盖 definition、catalog、formalization、formal version、consumption material、relation、package、assembly 的初始创建、主线推进、replacement / terminal 和非法回退。 | 不逐状态机写最终 test cuts 表。 |
| source/reference/body-boundary | 覆盖 basis summary、external source summary、definition/use guard、downstream boundary、external body rule 的 safe summary、unavailable、violation、body-free rejection。 | 不写 external adapter fixture、URL/path/provider payload。 |
| trace/audit/lineage/impact | 覆盖 append/support judgement、lineage / impact material 状态变化和 no raw body / append-only 边界。 | 不写 audit/evidence schema 或 report artifact path。 |
| read/visibility/material freshness | 覆盖 visible、empty、not-visible、stale、degraded、unavailable、freshness marker 的 copy-only 和 Query no-write。 | 不写完整 Query case schema 或 degraded marker fixture。 |
| maintenance/job/report | 覆盖 task/progress/checkpoint/run/report 的 accepted、running、partial、completed、blocked/manual 和 no core truth repair。 | 不写 scheduler/lease/retry count 或 job evidence schema。 |
| idempotency/replay/runtime/entry | 覆盖 in-flight、completed replay、conflict、stored surface missing、runtime blocked/unavailable、entry facade-only。 | 不写 reserve/complete algorithm、TTL、lock table 或 runtime config key。 |
| outbound/publication/handoff | 覆盖 candidate assembled、published/failed/blocked/unavailable、handoff prepared/delivered/failed 和 no rollback。 | 不写 topic、transport payload、delivery receipt body 或 external truth proof。 |

### 3. legal transition 测试维度思考

| 维度 | 来源 | 测试断言方向 |
|---|---|---|
| initial creation | Step 6 object factory/helper;Step 9 accepted flow;Step 10 virtual not-created transition。 | 从无状态进入首个正式状态时必须有正式 input、precondition 和 owner;不得从 DTO 壳或 route/raw id 创建 state。 |
| normal progression | Step 9 Command / Inbound / Job / Outbound trigger;Step 10 From/To 矩阵。 | From、trigger、precondition、To 必须完全匹配 Step 10;状态副作用只作用于 state owner。 |
| terminal / replacement | Step 10 terminal/replacement rule;Step 12 recovery surface。 | terminal、superseded、retired、replaced 后不得隐式恢复;replacement 必须由正式新 truth/ref/marker 承接。 |
| marker / disposition update | Step 7 resolver/mapper/availability;Step 10 marker-only / disposition boundary。 | 状态或 public surface marker 只能复制正式 source;缺 marker source 应进入 design stop / manual consistency。 |
| append-only support progression | Step 10 trace/audit/lineage;Step 11 append identity。 | append-only record 不被更新成 current truth;重复 append 必须靠 append identity / stored shell 保护。 |
| runtime / entry local progression | Step 10 runtime/entry technical state;Step 13 runtime guard。 | entry 只调用 application facade;runtime availability 只表达 blocked/unavailable,不拥有 business truth。 |

### 4. illegal / forbidden transition 思考

| forbidden class | 应测试的失败方向 | 禁止捷径 |
|---|---|---|
| old state resurrection | 旧 `MethodContentLifecycle`、publish、snapshot、fingerprint、old outbox 状态不得被测试命名或 fixture 恢复。 | 用旧状态名证明当前状态机覆盖。 |
| missing state owner/source | state enum/value、trigger、precondition、version、marker 来源缺失时必须停审。 | 在测试 fake、private map、error text 或字符串里补状态。 |
| query writes state | Query visible/empty/not-visible/stale/degraded/unavailable 均不得 repair material、append audit、publish event、start job 或 store replay。 | 让 Query 测试以修复成功作为通过条件。 |
| job repairs core truth | Operations Job 只写 derived material/progress/checkpoint/report,不得修 definition/version/relation/package 等 core truth。 | 用 job retry / rebuild 直接改 core truth。 |
| checkpoint as version | checkpoint/cursor/page anchor 不能替代 optimistic version、accepted truth freshness 或 idempotency proof。 | 用 queue offset、lease、timestamp、cursor 当版本。 |
| publication/handoff rollback | publication/handoff failed/blocked/unavailable 不回滚 accepted truth、stored result、receipt、report 或 checkpoint。 | 用 publisher failure 反写 command rejection。 |
| raw body as state source | external body、artifact/archive body、event payload、report body、raw exception 不能作为状态判断或 public evidence。 | 在 fixture 中保存 raw body 让状态转换通过。 |

### 5. side-effect 与 safe error 断言思考

| 断言面 | R16.11 思考 | 后续交接 |
|---|---|---|
| state owner mutation | legal transition 只更新该状态主语的正式 state/disposition/freshness/outcome/progress 字段。 | R16.12 写 state cut 时每行标出 owner/source。 |
| flow side effect | trace、audit、event candidate、stored result、receipt、report、checkpoint 等由 Step 9/11 flow boundary 承接。 | R16.13/R16.14 写一致性 / 幂等切口时再展开 atomicity。 |
| illegal branch | 非法转换返回 Step 12 safe rejection / conflict / degraded / unavailable / manual surface。 | R16.12 只写 safe error direction,不写 error code / taxonomy。 |
| no side effect | rejected、illegal、query no-write、missing marker/source、stored surface missing 分支不得产生 accepted success side effect。 | R16.15/R16.16 再承接 error / observability redline。 |
| replay / duplicate | 状态测试只确认 duplicate/replay 状态词与 stored surface 相关,不写 reserve/complete 算法。 | R16.13/R16.14 写 replay no-rerun 和 commit unknown 切口。 |

### 6. R16.12 写入边界思考

`R16.12 state machine test cuts:再写入` 应把本模块思考固化为状态机测试切口表,但仍不写一致性 / 幂等全表或完整 case schema:

1. 写 state machine test cuts 表,按 Step 10 状态族覆盖 business truth、source/reference/body-boundary、trace/audit/lineage/impact、read/material、maintenance/job/report、idempotency/runtime/entry、outbound/publication/handoff。
2. 每行写 source Step、test cut intent、minimum assertions direction、forbidden shortcut。
3. 切口必须覆盖 legal transition、illegal transition、terminal/replacement、marker copy-only、query no-write、job no-core-truth-repair、publication no-rollback。
4. 写 `R16.13 consistency / idempotency / concurrency cuts:先思考` 进入门禁。

### 7. R16.11 stop-review

| 检查项 | 结果 |
|---|---|
| 是否只思考 state machine test cuts | pass |
| 是否反查 Step 6/9/10/11/12/13 来源 | pass |
| 是否覆盖 legal / illegal transition、owner/source、side-effect/no-side-effect | pass |
| 是否明确 Query no-write、Job no-core-truth-repair、publication no-rollback | pass |
| 是否未写最终 state machine test cuts 表 | pass |
| 是否未写一致性 / 幂等测试切口表、完整 test case schema | pass |
| 是否未修改正式 `03-详细设计.md` | pass |

next_allowed_action: 等待用户确认后进入 Step 16 `R16.12 state machine test cuts:再写入`;只允许写入 state machine test cuts 表、source Step、test cut intent、minimum assertions direction、forbidden shortcut、后续交接关系和 `R16.13 consistency / idempotency / concurrency cuts:先思考` 进入门禁;不得直接修改正式 `03-详细设计.md`;不得写一致性 / 幂等测试切口表、完整 test case schema、fixture、evidence schema、CI pipeline、验收标准、implementation code 或具体 config key/env/topic/URL。

---

## R16.12 state machine test cuts:再写入

### 1. 当前模块状态

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm |
| 用户确认 | 已确认从 `R16.11` 推进到 `R16.12`。 |
| 本模块写入范围 | state machine test cuts 表、source Step、test cut intent、minimum assertions direction、forbidden shortcut、后续交接关系和 `R16.13` 进入门禁。 |
| 本模块禁止范围 | 一致性 / 幂等测试切口表、完整 test case schema、fixture、evidence schema、CI pipeline、验收标准、implementation code、具体 config key/env/topic/URL 和正式 `03-详细设计.md`。 |

### 2. state machine test cuts 表

| State machine cut | source Step | test cut intent | minimum assertions direction | forbidden shortcut |
|---|---|---|---|---|
| business truth transition cut | Step 6;Step 9;Step 10;Step 11;Step 12 | 验证 definition、catalog、formalization、formal version、consumption material、relation、package、assembly 的创建、主线推进、terminal / replacement 和非法回退。 | From、trigger、precondition、To 与 Step 10 矩阵一致;状态副作用只落在 business truth owner;非法转换返回 safe rejection/conflict/manual surface。 | 不恢复旧 `MethodContentLifecycle`、publish、snapshot、fingerprint 或 old outbox 状态;不从 DTO shell / route id 创建状态。 |
| source / reference / body-boundary cut | Step 6;Step 7;Step 9;Step 10;Step 12;Step 15 | 验证 basis summary、external source summary、definition/use guard、downstream boundary、external body rule 的 safe summary、unavailable、violation、body-free rejection。 | 状态判断只用 typed refs、safe summary、diagnostic、availability marker;raw body violation 走 safe rejected/quarantine/manual surface。 | 不保存 provider body、artifact body、URL/path、raw external id、payload excerpt 或 raw exception 作为状态证据。 |
| trace / audit / lineage / impact cut | Step 6;Step 9;Step 10;Step 11;Step 15 | 验证 trace material、audit trail、evidence lineage、impact summary、protection judgement 的 append/support 状态和 no raw body 边界。 | append-only support 不被改写成 current truth;lineage/impact/audit 只持有 refs、summary、marker;失败不伪装成 accepted success。 | 不用 audit log body、provider body、operator note、raw report body 或 private append flag 证明状态。 |
| read / visibility / material freshness cut | Step 6;Step 7;Step 9;Step 10;Step 12;Step 15 | 验证 visible、empty、not-visible、stale、degraded、unavailable、freshness marker 的 public read 状态。 | Query 保持 no-write;freshness/degraded/unavailable/not-visible marker 只复制 resolver / mapper / repository summary;缺 marker source 停审或 manual consistency。 | 不让 Query repair material、refresh projection、append audit、publish event、start job 或从 error text 合成 marker。 |
| maintenance / job / report state cut | Step 6;Step 8;Step 9;Step 10;Step 11;Step 12;Step 13 | 验证 task、progress、checkpoint、run history、job report/result 的 accepted、running、partial、completed、blocked/manual 状态。 | Job 只写 derived material、progress、checkpoint、report shell;checkpoint/report/issue source 缺失返回 blocked/manual;不修 core truth。 | 不用 scheduler lease、queue offset、timestamp、retry count、current material scan 或 raw report body 代替 checkpoint/report。 |
| idempotency / replay / runtime / entry cut | Step 6;Step 8;Step 9;Step 10;Step 11;Step 12;Step 13 | 验证 in-flight、completed replay、conflict、stored surface missing、runtime blocked/unavailable、API/worker/jobs entry facade-only 状态。 | entry 只经 application facade;runtime availability 只表达 technical local state;stored surface missing 是 manual/consistency,不是重跑许可。 | 不写 private idempotency map、lock table、TTL、lease duration、config key;不让 entry 直接调用 repository/UoW/concrete adapter。 |
| outbound / publication / handoff state cut | Step 6;Step 8;Step 9;Step 10;Step 11;Step 12;Step 15 | 验证 event candidate、target registry、publisher binding、publication outcome、handoff binding/outcome 的 assembled、published、failed、blocked、unavailable、prepared、delivered 状态。 | Candidate、publication outcome、handoff outcome 分层;published/delivered 只表示 local safe port outcome/receipt marker;失败不回滚 accepted truth。 | 不把 topic、transport payload、subscriber ack、delivery receipt body、external system state 或 old outbox relay 当状态真相源。 |
| cross-state forbidden transition cut | Step 10;Step 11;Step 12;Step 13;Step 15 | 验证 query writes truth、marker synthesis、old-state resurrection、raw body as state source、publication rollback、checkpoint-as-version 等跨状态机禁区。 | 每个 forbidden class 应有 safe no-side-effect / rejected / degraded / manual direction;无正式 source/mapper/port/schema 时停审回设计。 | 不用测试 fixture、fake private state、日志、metric、transport status、SQL/HTTP code 或 exception text 补正式来源。 |

### 3. 状态机切口使用规则

| 规则 | 说明 |
|---|---|
| Step 10 是状态来源 | 状态名、state owner、From/To、trigger 和非法转换必须回指 Step 10,不得从实现便利或旧文档补状态。 |
| Step 6/7/9 是可落码来源 | 状态 owner、factory/helper、port、mapper、repository、function flow 必须能回指 Step 6/7/9。 |
| Step 11~13 只提供断言边界 | persistence、transaction、safe error、replay、checkpoint、runtime guard 只用于断言方向;本模块不写算法或 schema。 |
| marker copy-only | stale/degraded/unavailable/blocked/failed/not-visible marker 必须复制正式 source。 |
| state cut 不是 TC schema | TC id、fixture、execution command、coverage target、evidence path 和 acceptance gate 后移 `05/06/07`。 |

### 4. state machine 切口交接关系

| 后续模块 | 交接内容 | 不交接内容 |
|---|---|---|
| `R16.13/R16.14 consistency / idempotency / concurrency cuts` | state cut 已标出 stored surface missing、in-flight、checkpoint-not-version、publication no-rollback、query no-write、job no-core-truth-repair。 | 不在本模块展开 same/different digest、commit unknown、race、rollback、resume algorithm。 |
| `R16.15/R16.16 error / config / observability cuts` | illegal transition、missing marker/source、body-free violation、blocked/degraded/unavailable、safe no-side-effect 作为错误 / 观测输入。 | 不写 error taxonomy、config key、metric labels、trace fields 或 evidence schema。 |
| `R16.17/R16.18 closure` | Step 10 状态族已具备最小测试入口和 source Step 反查。 | 不替代正式测试方案、验收标准或实施计划。 |

### 5. R16.13 进入门禁

`R16.13 consistency / idempotency / concurrency cuts:先思考` 只允许思考事务、一致性、幂等和并发测试切口:

1. 允许思考 UoW atomicity、rollback/no-commit、stored replay no-rerun、same/different digest、in-flight、commit unknown、version conflict、race、checkpoint resume、publication retry guard。
2. 允许反查 Step 11 transaction / consistency、Step 12 recovery surface、Step 13 concurrency / idempotency / reentry。
3. 禁止写最终 consistency / idempotency / concurrency cuts 表、完整 test case schema、fixture、evidence schema、CI pipeline、验收标准、implementation code 或正式 `03-详细设计.md`。
4. 禁止写具体 lock/TTL/lease/retry count、DB isolation、queue offset、topic、scheduler binding 或 config key。

### 6. R16.12 stop-review

| 检查项 | 结果 |
|---|---|
| 是否写入 state machine test cuts 表 | pass |
| 是否每行包含 source Step、intent、minimum assertions direction、forbidden shortcut | pass |
| 是否覆盖 Step 10 七状态族和跨状态机 forbidden class | pass |
| 是否写入后续交接关系和 R16.13 进入门禁 | pass |
| 是否未写一致性 / 幂等测试切口表 | pass |
| 是否未写完整 test case schema、fixture、evidence schema、CI | pass |
| 是否未修改正式 `03-详细设计.md` | pass |

next_allowed_action: 等待用户确认后进入 Step 16 `R16.13 consistency / idempotency / concurrency cuts:先思考`;只允许思考 UoW atomicity、rollback/no-commit、stored replay no-rerun、same/different digest、in-flight、commit unknown、version conflict、race、checkpoint resume、publication retry guard 的测试切口、来源 Step 和禁止越界点;不得直接修改正式 `03-详细设计.md`;不得写最终 consistency / idempotency / concurrency cuts 表、完整 test case schema、fixture、evidence schema、CI pipeline、验收标准、implementation code 或具体 config key/env/topic/URL。

---

## R16.13 consistency / idempotency / concurrency cuts:先思考

### 1. 当前模块目标

`R16.13` 只思考事务、一致性、幂等和并发测试切口的覆盖范围、来源 Step、断言方向和禁止越界点。当前模块不写最终 consistency / idempotency / concurrency cuts 表,不写完整 case schema,也不修改正式 `03-详细设计.md`。

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm |
| 当前允许 | 思考 UoW atomicity、rollback/no-commit、stored replay no-rerun、same/different digest、in-flight、commit unknown、version conflict、race、checkpoint resume、publication retry guard 的测试切口、来源 Step 和禁止越界点。 |
| 当前禁止 | 写最终 consistency / idempotency / concurrency cuts 表、完整 test case schema、fixture、evidence schema、CI pipeline、验收标准、implementation code、具体 lock/TTL/lease/retry count、DB isolation、queue offset、topic、scheduler binding、config key 或正式 `03-详细设计.md`。 |

### 2. 来源 Step 映射思考

| 来源 | 给 R16.13 的输入 | 测试切口使用方式 |
|---|---|---|
| Step 9 function flows | accepted/rejected/duplicate/no-write、Inbound redelivery、Outbound retry、Handoff retry、Job resume / partial / report 分支。 | 判断测试入口属于 Command、Query、Inbound、Outbound、Handoff、Job 还是 Runtime。 |
| Step 10 state matrix | in-flight、completed replay、conflict、checkpoint/report、publication outcome、runtime blocked/unavailable 状态主语。 | 判断状态词和 owner,但不把状态测试表扩写成并发算法。 |
| Step 11 transaction / consistency | UoW atomicity、rollback/no-commit、query no-write、no external rollback、stored replay no-rerun、checkpoint-not-version。 | 作为最小断言方向,不写 physical transaction 或 DB isolation。 |
| Step 12 recovery | stored surface missing/manual、commit unknown、version conflict、retryable unavailable、checkpoint blocked/manual、body-free violation。 | 作为失败 surface 方向,不写 error code 或 retry algorithm。 |
| Step 13 concurrency / idempotency | request idempotency、resource concurrency、worker reentry、runtime guard、same/different digest、in-flight、race、resume。 | 作为幂等并发语义来源,不写 lock/TTL/lease/retry count。 |
| Step 15 observability / audit | no raw body、safe diagnostic、post-commit failure observation、marker copy-only。 | 只用于断言不泄露 body/secret/private detail,观测 schema 后移 R16.15/R16.16。 |

### 3. consistency 测试切口思考

| consistency 分支 | 测试入口候选 | 最小验证方向 | 禁止越界点 |
|---|---|---|---|
| accepted mutation atomicity | Command accepted truth/support/material write + stored accepted result + body-free candidate refs。 | 同一 logical UoW 或等价 formal atomic boundary 要么全部提交,要么全部不存在。 | 不允许 accepted truth 成功但 stored result / candidate 缺失后由测试重建。 |
| rollback / no-commit | accepted UoW failure before commit、append inside UoW failure、rejected/conflict minimal UoW rollback。 | rollback 后无 accepted truth、无 stored accepted result、无 event candidate、无 publication/handoff outcome。 | 不用日志、metric、private flag 或 partially saved fixture 证明 rollback。 |
| query no-write | visible / empty / not-visible / stale / degraded / unavailable Query。 | Query 不开写 UoW,不 repair material,不 append audit,不 publish,不 start job,不 store replay。 | 不把 query repair success 当测试通过条件。 |
| publication / handoff no rollback | candidate published/failed/blocked/unavailable 或 handoff failed/blocked/unavailable。 | post-commit side effect failure 只产生 safe outcome/issue,不回滚 committed truth/result/report/candidate。 | 不把 publisher/handoff failure 映射成 command/job rollback。 |
| checkpoint / version separation | mutable truth expected_version 与 job checkpoint/page cursor/freshness marker。 | checkpoint/cursor 只能作为 resume/progress anchor,不得替代 optimistic version 或 idempotency proof。 | 不用 queue offset、lease、timestamp、page cursor 当 version。 |

### 4. idempotency / replay 测试切口思考

| 幂等分支 | 测试入口候选 | 最小验证方向 | 禁止越界点 |
|---|---|---|---|
| same key same digest completed | Command / Inbound / Job duplicate 命中 stored result、receipt 或 report。 | duplicate 只复制 stored surface;不重新 load current truth、不重跑 mutation/intake/job body、不重发 side effect。 | 不从 current truth 重建 response;不扫描 queue/subscriber/material state。 |
| same key different digest | same formal operation key + different canonical digest。 | 返回 conflict / rejected safe surface;不覆盖旧 stored result;不合并语义材料。 | 不把后到请求当新请求;不用 DB unique violation 替代正式 idempotency decision。 |
| in-flight duplicate | idempotency guard 显示同 key 正在处理。 | 返回 delayed/blocked/retryable surface only when formal marker exists;不进入第二 writer。 | 不让第二请求等待私有锁后偷偷执行业务。 |
| stored surface missing / wrong kind | duplicate path 找不到 stored result/receipt/report/checkpoint 或 kind 不匹配。 | 返回 manual consistency / design blocker surface;不得 rerun body 重建 replay。 | 不用 private map、log、current truth 或 fake fallback 补 stored surface。 |
| repeat Query | 同一 Query 重复调用。 | 重新读取当前 authorized safe surface;不 reserve idempotency;不保存 query result。 | 不给 Query 写 replay store 或 idempotency record。 |

### 5. concurrency / reentry 测试切口思考

| 并发 / 重入分支 | 测试入口候选 | 最小验证方向 | 禁止越界点 |
|---|---|---|---|
| version conflict / lost update | 两个 Command 或 job/material writer 竞争同一 mutable owner。 | 只有正式 expected_version save 可成功;冲突方返回 reload-required conflict / safe surface。 | 不用 checkpoint、cursor、timestamp、route param 或 digest 当 expected_version。 |
| append collision | audit、lineage、event candidate、run history、report 等 append-only side effect 重复或并发 append。 | append identity 保护不可覆盖;重复 append 不能变成 current truth 更新。 | 不用数组位置、log order 或 private counter 证明 append identity。 |
| inbound redelivery | same source binding / semantic material redelivered。 | 复制 stored receipt;不重新解析 raw envelope、不重新调用 source adapter、不创建第二 intake summary。 | 不用 broker ack、topic、offset、dead-letter state 作为业务 dedup truth。 |
| outbound publication retry | worker retry publication / target unavailable 后重入。 | 只从 durable candidate 和 publication outcome guard 恢复;candidate source 已提交且不被重建。 | 不从 current truth、topic、payload、delivery receipt 或 subscriber state 重建 candidate。 |
| handoff retry | handoff blocked/failed/unavailable 后重入。 | 只从 handoff-safe refs 和 local outcome marker 恢复;delivered 只表示 formal receipt marker。 | 不把 external system state、receipt body、operator note 当 handoff truth。 |
| job checkpoint resume / partial retry | job interrupted、partial failed、checkpoint missing/wrong/corrupt。 | resume 只从 formal task/run/checkpoint/progress/report/issue source;partial retry 只处理 formally marked failed subset。 | 不用 scheduler lease、queue offset、retry count、timestamp、current material scan 代替 checkpoint。 |
| commit unknown | commit result 不可确认或 stored surface/read-back 缺失。 | 返回 manual / consistency-safe surface;不运行 post-commit side effect,不盲目重跑 mutation。 | 不用 timeout、log line、adapter note、current truth alone 判定 accepted。 |

### 6. R16.14 写入边界思考

`R16.14 consistency / idempotency / concurrency cuts:再写入` 应把本模块思考固化为测试切口表,但仍不写完整 case schema:

1. 写 consistency test cuts 表,覆盖 accepted atomicity、rollback/no-commit、query no-write、publication/handoff no rollback、checkpoint/version separation。
2. 写 idempotency / replay test cuts 表,覆盖 same digest replay、different digest conflict、in-flight、stored surface missing、repeat Query。
3. 写 concurrency / reentry test cuts 表,覆盖 version conflict、append collision、inbound redelivery、outbound retry、handoff retry、job checkpoint resume、commit unknown。
4. 每行写 source Step、test cut intent、minimum assertions direction、forbidden shortcut。
5. 写 `R16.15 error / config / observability cuts:先思考` 进入门禁。

### 7. R16.13 stop-review

| 检查项 | 结果 |
|---|---|
| 是否只思考 consistency / idempotency / concurrency cuts | pass |
| 是否反查 Step 9/10/11/12/13/15 来源 | pass |
| 是否覆盖 UoW atomicity、rollback/no-commit、stored replay no-rerun、same/different digest、in-flight、commit unknown、version conflict、race、checkpoint resume、publication retry guard | pass |
| 是否明确不写 lock/TTL/lease/retry count、DB isolation、queue offset、topic、scheduler binding 或 config key | pass |
| 是否未写最终 consistency / idempotency / concurrency cuts 表 | pass |
| 是否未写完整 test case schema、fixture、evidence schema、CI | pass |
| 是否未修改正式 `03-详细设计.md` | pass |

next_allowed_action: 等待用户确认后进入 Step 16 `R16.14 consistency / idempotency / concurrency cuts:再写入`;只允许写入 consistency / idempotency / concurrency cuts 表、source Step、test cut intent、minimum assertions direction、forbidden shortcut、后续交接关系和 `R16.15 error / config / observability cuts:先思考` 进入门禁;不得直接修改正式 `03-详细设计.md`;不得写 error / config / observability cuts 表、完整 test case schema、fixture、evidence schema、CI pipeline、验收标准、implementation code 或具体 config key/env/topic/URL。

---

## R16.14 consistency / idempotency / concurrency cuts:再写入

### 1. 当前模块状态

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm |
| 用户确认 | 已确认从 `R16.13` 推进到 `R16.14`。 |
| 本模块写入范围 | consistency / idempotency / concurrency cuts 表、source Step、test cut intent、minimum assertions direction、forbidden shortcut、后续交接关系和 `R16.15` 进入门禁。 |
| 本模块禁止范围 | error / config / observability cuts 表、完整 test case schema、fixture、evidence schema、CI pipeline、验收标准、implementation code、具体 lock/TTL/lease/retry count、DB isolation、queue offset、topic、scheduler binding、config key 和正式 `03-详细设计.md`。 |

### 2. consistency test cuts 表

| Consistency cut | source Step | test cut intent | minimum assertions direction | forbidden shortcut |
|---|---|---|---|---|
| accepted atomicity cut | Step 9;Step 11;Step 12;Step 13 | 验证 Command accepted truth/support/material write、stored accepted result 和 body-free candidate refs 的原子边界。 | accepted truth、stored accepted result、candidate refs 要么同一 logical UoW / formal atomic boundary 全部存在,要么全部不存在。 | 不允许 accepted truth 成功但 stored result / candidate 缺失后由测试或实现从 current truth 重建。 |
| rollback / no-commit cut | Step 9;Step 11;Step 12;Step 15 | 验证 accepted UoW failure、append inside UoW failure、rejected/conflict minimal UoW rollback。 | rollback 后无 accepted truth、无 stored accepted result、无 event candidate、无 publication/handoff outcome;safe failure surface 不泄露 raw detail。 | 不用日志、metric、private flag、partial fixture 或 raw exception 证明 rollback。 |
| query no-write consistency cut | Step 8;Step 9;Step 11;Step 12;Step 15 | 验证 Query visible / empty / not-visible / stale / degraded / unavailable 分支无写 side effect。 | Query 不开写 UoW,不 repair material,不 append audit,不 publish,不 start job,不 store replay。 | 不把 query repair success、hidden refresh、audit append 或 replay record 当测试通过条件。 |
| publication / handoff no-rollback cut | Step 9;Step 11;Step 12;Step 13;Step 15 | 验证 publication / handoff failed、blocked、unavailable 属 post-commit side effect,不回滚本地已提交事实。 | post-commit failure 只产生 safe outcome/issue;accepted truth、stored result、receipt、report、candidate 不回滚。 | 不把 publisher/handoff failure 映射成 Command/Job rollback 或 subscriber delivery truth。 |
| checkpoint / version separation cut | Step 10;Step 11;Step 12;Step 13 | 验证 mutable truth expected_version 与 job checkpoint、page cursor、freshness marker 分离。 | expected_version 只来自 versioned repository read/save;checkpoint/cursor 只能作为 job resume/progress anchor。 | 不用 queue offset、scheduler lease、timestamp、page cursor、freshness marker 或 digest 替代 version。 |

### 3. idempotency / replay test cuts 表

| Idempotency / replay cut | source Step | test cut intent | minimum assertions direction | forbidden shortcut |
|---|---|---|---|---|
| same digest replay cut | Step 8;Step 9;Step 11;Step 13 | 验证 Command / Inbound / Job duplicate same key + same digest 只复制 stored result、receipt 或 report。 | duplicate 不重新 load current truth、不重跑 mutation / intake / job body、不重发 side effect;public surface 来自 stored surface。 | 不从 current truth 重建 response;不扫描 queue、subscriber、material 或 fake private state。 |
| different digest conflict cut | Step 8;Step 9;Step 12;Step 13 | 验证 same formal operation key + different canonical digest 的冲突分支。 | 返回 conflict / rejected safe surface;不覆盖旧 stored result;不合并语义材料;不进入 mutation body。 | 不把后到请求当新请求;不用 DB unique violation、route id 或 hash 字符串替代正式 decision。 |
| in-flight duplicate cut | Step 8;Step 9;Step 12;Step 13 | 验证同 key 正在处理时第二请求的 delayed / blocked / retryable 分支。 | 只有 formal marker/source 支持时才返回 delayed/blocked/retryable;第二 writer 不进入业务写路径。 | 不让第二请求等待私有锁后继续执行业务;不从 lock timeout 合成 public marker。 |
| stored surface missing cut | Step 11;Step 12;Step 13;Step 15 | 验证 duplicate path 找不到 stored result/receipt/report/checkpoint 或 kind 不匹配时的处理。 | 返回 manual consistency / design blocker surface;不得 rerun body;不得用 current truth 补 replay。 | 不用 private map、log line、operator note、current truth 或 fake fallback 补 stored surface。 |
| repeat Query no-replay cut | Step 8;Step 9;Step 11;Step 13;Step 15 | 验证同一 Query 重复调用只是重复读取 authorized safe surface。 | Query 不 reserve idempotency、不保存 query result、不写 replay store;page cursor 不成为 replay token。 | 不给 Query 写 idempotency record、stored result、audit success side effect 或 hidden refresh。 |

### 4. concurrency / reentry test cuts 表

| Concurrency / reentry cut | source Step | test cut intent | minimum assertions direction | forbidden shortcut |
|---|---|---|---|---|
| version conflict / lost update cut | Step 7;Step 9;Step 11;Step 12;Step 13 | 验证两个 writer 竞争同一 mutable truth/support/material owner 时的 expected_version 保护。 | 只有一个 formal expected_version save 成功;冲突方返回 reload-required conflict / safe surface。 | 不用 checkpoint、cursor、timestamp、route param、digest 或 private compare value 当 expected_version。 |
| append collision cut | Step 6;Step 9;Step 11;Step 13;Step 15 | 验证 audit、lineage、event candidate、run history、report 等 append-only side effect 的并发 / 重复 append。 | append identity 防止覆盖;重复 append 不能变成 current truth update;raw body 不进入 append proof。 | 不用数组位置、log order、private counter、metric count 或 raw evidence body 证明 append identity。 |
| inbound redelivery cut | Step 8;Step 9;Step 11;Step 12;Step 13 | 验证 same source binding / semantic material 的 Inbound redelivery。 | redelivery 复制 stored receipt;不重新解析 raw envelope、不重调 source adapter、不创建第二 intake summary。 | 不用 broker ack、topic、offset、dead-letter state 或 transport retry 作为业务 dedup truth。 |
| outbound publication retry cut | Step 8;Step 9;Step 11;Step 12;Step 13 | 验证 publication retry 只能从 durable event candidate 和 publication outcome guard 恢复。 | candidate source 已提交且不重建;retry 不重读 current truth;failed/unavailable 不回滚 source truth。 | 不从 current truth、topic、payload、delivery receipt、subscriber state 或 old outbox 重建 candidate。 |
| handoff retry cut | Step 8;Step 9;Step 11;Step 12;Step 13 | 验证 handoff blocked/failed/unavailable 后的重入边界。 | 只从 handoff-safe refs 和 local outcome marker 恢复;delivered 只表示 formal receipt marker。 | 不把 external system state、receipt body、operator note、raw response 或 archive body 当 handoff truth。 |
| job checkpoint resume / partial retry cut | Step 8;Step 9;Step 10;Step 11;Step 12;Step 13 | 验证 job interrupted、partial failed、checkpoint missing/wrong/corrupt 的 resume / retry。 | resume 只从 formal task/run/checkpoint/progress/report/issue source;partial retry 只处理 formally marked failed subset。 | 不用 scheduler lease、queue offset、retry count、timestamp、current material scan 或 adapter note 代替 checkpoint。 |
| commit unknown cut | Step 9;Step 11;Step 12;Step 13;Step 15 | 验证 commit result 不可确认或 stored surface/read-back 缺失时的 safe outcome。 | 返回 manual / consistency-safe surface;不运行 post-commit side effect;不盲目重跑 mutation;缺 formal source 时停审。 | 不用 timeout、log line、adapter note、metric、current truth alone 或 private status 判定 accepted。 |

### 5. consistency / idempotency / concurrency 切口交接关系

| 后续模块 | 交接内容 | 不交接内容 |
|---|---|---|
| `R16.15/R16.16 error / config / observability cuts` | manual consistency、commit unknown、stored surface missing、retryable unavailable、marker copy-only、safe diagnostic/no raw body 作为错误与观测输入。 | 不在本模块写 error taxonomy、config key、metric label、trace field、evidence artifact schema。 |
| `R16.17/R16.18 closure` | 事务、幂等、并发、重入红线已具备最小测试入口和 source Step 反查。 | 不替代 `05-测试方案.md`、`06-验收标准.md` 或 `07-实施计划.md`。 |

### 6. R16.15 进入门禁

`R16.15 error / config / observability cuts:先思考` 只允许思考错误、配置和观测测试切口:

1. 允许思考 safe error mapping、manual/design blocker、config validation、adapter availability、forbidden configurable boundary、redaction、metric label low-cardinality、audit refs-only、no raw body / no secret。
2. 允许反查 Step 12 error/recovery、Step 14 config/dependency、Step 15 observability/audit。
3. 禁止写最终 error / config / observability cuts 表、完整 test case schema、fixture、evidence schema、CI pipeline、验收标准、implementation code 或正式 `03-详细设计.md`。
4. 禁止写具体 config key/env/topic/URL、secret、metric backend、dashboard、trace payload 或 evidence artifact path。

### 7. R16.14 stop-review

| 检查项 | 结果 |
|---|---|
| 是否写入 consistency test cuts 表 | pass |
| 是否写入 idempotency / replay test cuts 表 | pass |
| 是否写入 concurrency / reentry test cuts 表 | pass |
| 是否每行包含 source Step、intent、minimum assertions direction、forbidden shortcut | pass |
| 是否写入后续交接关系和 R16.15 进入门禁 | pass |
| 是否未写 error / config / observability cuts 表 | pass |
| 是否未写完整 test case schema、fixture、evidence schema、CI | pass |
| 是否未修改正式 `03-详细设计.md` | pass |

next_allowed_action: 等待用户确认后进入 Step 16 `R16.15 error / config / observability cuts:先思考`;只允许思考 safe error mapping、manual/design blocker、config validation、adapter availability、forbidden configurable boundary、redaction、metric label low-cardinality、audit refs-only、no raw body / no secret 的测试切口、来源 Step 和禁止越界点;不得直接修改正式 `03-详细设计.md`;不得写最终 error / config / observability cuts 表、完整 test case schema、fixture、evidence schema、CI pipeline、验收标准、implementation code 或具体 config key/env/topic/URL。

---

## R16.15 error / config / observability cuts:先思考

### 1. 当前模块目标

`R16.15` 只思考错误、配置和观测测试切口的覆盖范围、来源 Step、断言方向和禁止越界点。当前模块不写最终 error / config / observability cuts 表,不写完整 case schema,不写 fixture / evidence schema / CI pipeline / 验收标准 / implementation code,也不修改正式 `03-详细设计.md`。

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm |
| 用户确认 | 已确认从 `R16.14` 推进到 `R16.15`。 |
| 当前允许 | 思考 safe error mapping、manual/design blocker、config validation、adapter availability、forbidden configurable boundary、redaction、metric label low-cardinality、audit refs-only、no raw body / no secret 的测试切口、来源 Step 和禁止越界点。 |
| 当前禁止 | 写最终 error / config / observability cuts 表、完整 test case schema、fixture、evidence schema、CI pipeline、验收标准、implementation code、具体 config key/env/topic/URL、metric backend/schema、log/span/audit 字段 schema 或正式 `03-详细设计.md`。 |

### 2. source Step 映射思考

| 来源 | 给 R16.15 的输入 | 测试切口使用方式 |
|---|---|---|
| Step 12 error / recovery | safe error mapping、retryability is semantic、manual/consistency surface、stored surface missing no-rerun、commit unknown no side-effect、query no-write、adapter unavailable/degraded copy-only。 | 作为错误测试的语义来源;测试只能验证 public safe surface 和 no forbidden side effect。 |
| Step 14 config / dependencies | config validation、runtime builder / entry precheck、adapter availability、forbidden configurable boundary、fake/durable parity、missing source remains blocker、no concrete key/env/topic/URL。 | 作为配置测试入口和 redline 来源;测试不得让 config 改 truth/state/schema/source/marker/idempotency。 |
| Step 15 observability / audit | no raw body、no secret、low-cardinality metric label、audit refs-only、safe diagnostic refs、no synthetic marker、query no-write observation、post-commit failure no rollback。 | 作为观测测试红线;测试只检查安全承载和禁入字段,不定义观测后端或完整字段 schema。 |
| R16.14 consistency / idempotency / concurrency | manual consistency、stored surface missing、commit unknown、publication/handoff retry、checkpoint resume、marker copy-only。 | 作为 R16.15 的错误与观测输入;不重复展开幂等 / 并发矩阵。 |

### 3. error 测试切口思考

| error family | 测试入口候选 | 最小验证方向 | 禁止越界点 |
|---|---|---|---|
| invalid request / unsupported envelope | API / worker / job entry 的 invalid shell 或 unsupported kind。 | 返回 safe invalid / unsupported surface;不进入 UoW、truth mutation、event candidate、job body 或 adapter call。 | 不用 HTTP/RPC 数字、route 字符串或 raw request body 证明错误语义。 |
| domain / policy rejected | Command flow 中 domain guard、state guard、body-boundary guard 拒绝。 | 返回 safe rejection;accepted truth、stored accepted result、event candidate 不存在;必要时只保存正式 replayable rejected surface。 | 不把 rejected 写成 accepted audit;不泄露 domain raw reason/body。 |
| version / state conflict | expected_version mismatch、illegal transition、conflict/reload-required。 | 返回 conflict/reload-required safe surface;rollback accepted UoW;无 success side effect。 | 不用 checkpoint、cursor、timestamp、adapter note 替代 optimistic version。 |
| idempotency conflict / in-flight | same key different digest、same key in-flight、stored surface wrong kind。 | 返回 formal conflict/delayed/manual consistency;不进入第二 writer;不重跑业务。 | 不用 DB unique violation、private lock 或 current truth 重建 public surface。 |
| stored surface missing / commit unknown | duplicate path 缺 stored result/receipt/report/checkpoint,或 commit result 不可确认。 | 返回 manual / consistency-safe surface;不执行 post-commit side effect;缺 formal source 时停审。 | 不用 log line、metric、timeout、operator note、current truth alone 判定 accepted。 |
| dependency unavailable / degraded | repository、resolver、publisher、handoff、runtime、config validation 失败或 unavailable。 | 只复制 formal availability/degraded marker;retryability 必须来自正式语义,不是 adapter exception。 | 不从 SQL/HTTP status、provider body、raw error text 推 retryable/unavailable marker。 |
| query degraded / not-visible / unavailable | Query resolver/material/source 缺失、not-visible、stale/degraded、partial。 | 返回 safe read surface;Query 保持 no-write;marker 只复制正式 resolver/mapper/repository summary。 | 不让 Query repair material、append audit、publish event、start job 或合成 marker。 |
| job partial / blocked / manual | checkpoint missing/wrong/corrupt、partial item failure、report persistence ambiguity。 | 写 safe progress/report/issue surface only when formal source exists;不得修 core truth。 | 不用 scheduler lease、queue offset、retry count、raw report body 或 current material scan 代替 checkpoint/report。 |

### 4. config / dependency 测试切口思考

| config / dependency family | 测试入口候选 | 最小验证方向 | 禁止越界点 |
|---|---|---|---|
| config load / validate redline | runtime builder 加载 raw config 后输出 typed settings / validation issue。 | missing/invalid binding 产生 redacted diagnostic;不泄露 key/value/secret/endpoint/topic/URL。 | 不写具体 env/profile/key 名或默认值;不把 validation success 当业务 truth。 |
| config ownership boundary | contracts/domain/application/infra/api/worker/jobs 的 config 读取边界。 | contracts/domain 不读 raw config;application 只接收 typed settings 或 ports;entry/infra/runtime 负责 validate and inject。 | 不让 domain/application 直接读 env/file/global config。 |
| forbidden configurable boundary | truth owner、state transition、query no-write、stored replay、DTO/event/job schema、source/marker、transaction boundary。 | 配置不能改变这些语义;违反时应 gate fail / design blocker。 | 不通过 feature flag 放宽 state、打开 query repair、关闭 duplicate replay 或改变 schema field。 |
| adapter availability mapping | resolver、publisher、handoff、runtime、external dependency disabled/degraded/unavailable。 | public surface 复制 formal availability summary / marker;fake/durable 语义一致。 | 不从 health payload、topic ack、external receipt body 或 adapter exception 推业务成功。 |
| target / transport binding | publisher / handoff target registry、route/topic/URL/product binding。 | transport target 只影响 adapter binding;不改变 Step 8 protocol kind/schema 或 event body-free rule。 | 不在 Step 16 写具体 topic、queue、URL、route 或 transport product。 |
| missing source / marker handling | config/fake/fixture 无法提供正式 source、marker、mapper、schema。 | 进入 design stop / manual consistency;测试应暴露缺口。 | 不用 config profile、fake private map、route/header、error text 补正式来源。 |
| fake / durable parity | local fake 与 durable adapter 在 repository/UoW、availability、publisher/handoff outcome、runtime assembly 的语义一致。 | fake 只能返回正式 port output;failure injection 不新增 production 不存在的 source。 | 不给 fake 加 test-only mutation helper、private source 或绕过 port 的 direct store handle。 |

### 5. observability / audit 测试切口思考

| observability family | 测试入口候选 | 最小验证方向 | 禁止越界点 |
|---|---|---|---|
| no raw body / payload | log、span、audit、diagnostic、report、handoff、publication outcome。 | 不包含 request/response/event/provider/method/report/archive body;只含 typed refs、safe summary、marker。 | 不用 hash/fingerprint、object path、raw payload digest 或 archive existence 代替 no-body marker。 |
| no secret / config value | config validation、runtime assembly、adapter availability、target binding、diagnostic。 | secret/token/credential/connection string、concrete key/value、endpoint/topic/URL 不进入 log/metric/trace/diagnostic。 | 不把 secret 值、raw config、connection string 或 route/topic 放入测试期望。 |
| metric label low-cardinality | command/query/inbound/outbound/job/repository/UoW/adapter/config/publisher/handoff metrics。 | labels 只含 family/kind/state/result/category;不得包含 trace id、actor/subject/truth refs、raw endpoint/topic/free text。 | 不把 entity ref、request id、payload digest、error text 或 URL 作为 label。 |
| audit refs-only | accepted business fact、operations fact、handoff/report/marker state。 | audit / operations fact 只持有 refs、state、safe reason/source、receipt/report refs;rejected/query/duplicate 不伪装为 accepted audit。 | 不用 runtime log、metric、raw operator note 或 external body 替代 business audit。 |
| safe diagnostic / redaction source | redaction marker、safe diagnostic ref、availability/degraded marker。 | marker/ref 只来自 formal mapper/resolver/builder/port output;source missing 时停审回补。 | 不由 log adapter、service string、raw exception、SQL/provider body 合成 marker。 |
| query observation no-write | Query visible/empty/not-visible/degraded/unavailable/partial。 | 只允许 runtime log/metric/safe correlation;不写 business audit、stored command result、event candidate 或 repair。 | 不通过观测后端反推 read state;不把 query diagnostic 当 material repair。 |
| post-commit side-effect failure | publication/handoff/observability failure after accepted truth/report/candidate committed。 | 记录 safe outcome/diagnostic when formal;不回滚 accepted truth/report/candidate。 | 不把 publisher/handoff failure 当 Command rollback;不重建 candidate body。 |

### 6. R16.16 写入边界思考

`R16.16 error / config / observability cuts:再写入` 应将本模块思考固化为三组测试切口表,但仍不写完整 case schema:

1. 写 error test cuts 表,覆盖 invalid/unsupported、domain rejected、version conflict、idempotency conflict/in-flight、stored surface missing、commit unknown、dependency unavailable/degraded、query degraded、job partial/manual。
2. 写 config / dependency test cuts 表,覆盖 config validation redline、config ownership、forbidden configurable boundary、adapter availability、target binding、missing source / marker、fake/durable parity。
3. 写 observability / audit test cuts 表,覆盖 no raw body、no secret/config value、low-cardinality metric labels、audit refs-only、safe diagnostic/redaction source、query no-write observation、post-commit failure no rollback。
4. 每行必须带 source Step、test cut intent、minimum assertions direction、forbidden shortcut。
5. 写后续交接关系:将 R16.17/R16.18 的 cross-step closure、formal §15 candidate stop-review 和 Step 17 entry gate 留到下一组模块。
6. 不写 formal §15 candidate draft、TC ID、fixture、evidence schema、CI command、acceptance gate、implementation code 或具体 config key/env/topic/URL。

### 7. R16.15 stop-review

| 检查项 | 结果 |
|---|---|
| 是否只思考 error / config / observability cuts | pass |
| 是否反查 Step 12 / Step 14 / Step 15 和 R16.14 输入 | pass |
| 是否覆盖 safe error mapping、manual/design blocker、adapter availability、forbidden configurable boundary | pass |
| 是否覆盖 redaction、metric label low-cardinality、audit refs-only、no raw body / no secret | pass |
| 是否未写最终 error / config / observability cuts 表 | pass |
| 是否未写完整 case schema、fixture、evidence schema、CI、验收标准或 implementation code | pass |
| 是否未修改正式 `03-详细设计.md` | pass |
| 是否形成 R16.16 写入边界 | pass |

next_allowed_action: 等待用户确认后进入 Step 16 `R16.16 error / config / observability cuts:再写入`;只允许写入 error test cuts、config / dependency test cuts、observability / audit test cuts 表、source Step、test cut intent、minimum assertions direction、forbidden shortcut、后续交接关系和 `R16.17 cross-step closure and formal §15 candidate stop-review:先思考` 进入门禁;不得直接修改正式 `03-详细设计.md`;不得写 formal §15 candidate draft、完整 test case schema、fixture、evidence schema、CI pipeline、验收标准、implementation code 或具体 config key/env/topic/URL。

---

## R16.16 error / config / observability cuts:再写入

### 1. 当前模块状态

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm |
| 用户确认 | 已确认从 `R16.15` 推进到 `R16.16`。 |
| 本模块写入范围 | error test cuts、config / dependency test cuts、observability / audit test cuts 表、source Step、test cut intent、minimum assertions direction、forbidden shortcut、后续交接关系和 `R16.17` 进入门禁。 |
| 本模块禁止范围 | formal §15 candidate draft、完整 test case schema、fixture、evidence schema、CI pipeline、验收标准、implementation code、具体 config key/env/topic/URL、metric backend/schema、log/span/audit 字段 schema 和正式 `03-详细设计.md`。 |

### 2. error test cuts 表

| test cut | source Step | test cut intent | minimum assertions direction | forbidden shortcut |
|---|---|---|---|---|
| invalid / unsupported entry cut | Step 8;Step 9;Step 12 | 验证 API / worker / job entry 对 invalid shell、unsupported kind、malformed envelope 的 safe rejection。 | 返回 safe invalid / unsupported surface;不进入 UoW、truth mutation、event candidate、job body 或 adapter call。 | 不用 HTTP/RPC 数字、route 字符串、raw request body 或 transport error text 证明错误语义。 |
| domain / policy rejected cut | Step 6;Step 8;Step 9;Step 10;Step 12 | 验证 Command domain guard、state guard、policy guard、body-boundary guard 拒绝。 | 返回 safe rejection;accepted truth、stored accepted result、event candidate 不存在;replayable rejected surface 仅在正式定义时保存。 | 不把 rejected 写成 accepted audit;不泄露 raw reason、method body、policy private note。 |
| version / illegal transition conflict cut | Step 9;Step 10;Step 11;Step 12;Step 13 | 验证 expected_version mismatch、illegal transition、reload-required conflict。 | rollback accepted UoW;返回 conflict / reload-required safe surface;无 success event、audit、report 或 candidate。 | 不用 checkpoint、cursor、timestamp、adapter note、metric count 替代 optimistic version。 |
| idempotency conflict / in-flight cut | Step 8;Step 11;Step 12;Step 13 | 验证 same key different digest、same key in-flight、stored surface wrong kind。 | 返回 formal conflict / delayed / manual consistency surface;不进入第二 writer;不重跑 mutation/intake/job body。 | 不用 DB unique violation、private lock、current truth 或 fake map 重建 public surface。 |
| stored surface missing cut | Step 11;Step 12;Step 13;Step 15 | 验证 duplicate path 缺 stored result、receipt、report、checkpoint 或 kind 不匹配。 | 返回 manual consistency / design blocker safe surface;不得 rerun body;不得从 current truth 补 replay。 | 不用 log line、operator note、metric、private map 或 current truth 补 stored surface。 |
| commit unknown cut | Step 9;Step 11;Step 12;Step 13;Step 15 | 验证 commit result 不可确认、read-back 缺失或 outcome persistence ambiguity。 | 返回 manual / consistency-safe surface;不运行 post-commit side effect;缺 formal source 时停审。 | 不用 timeout、adapter note、current truth alone、publisher state 或 observability event 判定 accepted。 |
| dependency unavailable / degraded cut | Step 7;Step 10;Step 12;Step 14;Step 15 | 验证 repository、resolver、publisher、handoff、runtime、external dependency unavailable / degraded。 | public surface 只复制 formal availability/degraded marker;retryability 来自正式语义。 | 不从 SQL/HTTP status、provider body、health payload、raw exception 推 retryable/unavailable marker。 |
| query degraded / not-visible / unavailable cut | Step 7;Step 8;Step 9;Step 10;Step 12;Step 15 | 验证 Query resolver/material/source 缺失、not-visible、stale/degraded、partial。 | 返回 safe read surface;Query 不写 truth/audit/event/repair;marker 只复制正式 resolver/mapper/repository summary。 | 不让 Query repair material、append audit、publish event、start job 或从 error text 合成 marker。 |
| job partial / blocked / manual cut | Step 8;Step 9;Step 10;Step 11;Step 12;Step 13 | 验证 checkpoint missing/wrong/corrupt、partial item failure、report persistence ambiguity。 | 只写 formal progress/checkpoint/report/issue surface;partial/manual 明确可见;不得修 core truth。 | 不用 scheduler lease、queue offset、retry count、raw report body、current material scan 代替 checkpoint/report。 |

### 3. config / dependency test cuts 表

| test cut | source Step | test cut intent | minimum assertions direction | forbidden shortcut |
|---|---|---|---|---|
| config validation redline cut | Step 12;Step 14;Step 15 | 验证 runtime builder 对 missing/invalid raw config 的 validation issue 和 redaction。 | 产生 redacted diagnostic;不泄露 key/value/secret/endpoint/topic/URL;不装配 invalid runtime。 | 不写具体 env/profile/key 名、默认值、secret 值或 transport target。 |
| config ownership boundary cut | Step 3;Step 4;Step 5;Step 7;Step 14 | 验证 contracts/domain/application/infra/api/worker/jobs 的配置读取边界。 | contracts/domain 不读 raw config;application 只接收 typed settings 或 ports;infra/entry/runtime validate and inject。 | 不让 domain/application 直接读 env/file/global config 或 concrete adapter config。 |
| forbidden configurable boundary cut | Step 8;Step 9;Step 10;Step 11;Step 13;Step 14 | 验证 config 不能改变 truth owner、state transition、query no-write、stored replay、DTO/event/job schema、source/marker、transaction boundary。 | 违反边界应 gate fail / design blocker;config 只调装配、target、adapter、limit 或 numeric policy handle。 | 不用 feature flag 放宽 state、打开 query repair、关闭 duplicate replay、改 schema field 或补 marker。 |
| adapter availability mapping cut | Step 7;Step 10;Step 12;Step 14;Step 15 | 验证 resolver、publisher、handoff、runtime、external adapter disabled/degraded/unavailable。 | public surface 复制 formal availability summary / marker;fake/durable 共享同一 safe outcome 语义。 | 不用 health payload、topic ack、external receipt body、adapter exception 证明业务成功或可见性。 |
| target / transport binding cut | Step 8;Step 9;Step 14;Step 15 | 验证 route/topic/URL/product/target binding 只影响 adapter/runtime target。 | transport target 不改变 protocol kind/schema、event candidate body-free rule 或 local truth ownership。 | 不在测试切口中写具体 topic、queue、URL、route、product 或 target value。 |
| missing source / marker blocker cut | Step 6;Step 7;Step 8;Step 12;Step 14;Step 15 | 验证 config/fake/fixture 无法提供正式 source、marker、mapper、schema 时的处理。 | 进入 design stop / manual consistency;测试暴露缺口,不隐藏缺口。 | 不用 config profile、fake private map、route/header、raw error、operator note 补正式来源。 |
| fake / durable parity cut | Step 7;Step 11;Step 13;Step 14;Step 16 | 验证 local fake 与 durable adapter 在 repository/UoW、availability、publisher/handoff outcome、runtime assembly 的语义一致。 | fake 只返回正式 port output;failure injection 不新增 production 不存在的 source;version/cursor/transaction 语义一致。 | 不给 fake 加 test-only mutation helper、private source、direct store handle 或 bypass port。 |

### 4. observability / audit test cuts 表

| test cut | source Step | test cut intent | minimum assertions direction | forbidden shortcut |
|---|---|---|---|---|
| no raw body / payload cut | Step 6;Step 8;Step 9;Step 12;Step 15 | 验证 log、span、audit、diagnostic、report、handoff、publication outcome 不承载正文。 | 只含 typed refs、safe summary、marker、status/category;不含 request/response/event/provider/method/report/archive body。 | 不用 hash/fingerprint、object path、raw payload digest、archive existence 代替 no-body marker。 |
| no secret / config value cut | Step 14;Step 15 | 验证 config validation、runtime assembly、adapter availability、target binding 的观测红线。 | secret/token/credential/connection string、concrete key/value、endpoint/topic/URL 不进入 log/metric/trace/diagnostic。 | 不把 secret 值、raw config、connection string、route/topic/URL 放入测试期望或 fixture。 |
| low-cardinality metric label cut | Step 8;Step 9;Step 10;Step 15 | 验证 command/query/inbound/outbound/job/repository/UoW/adapter/config/publisher/handoff metrics 的 label 裁剪。 | labels 只含 family/kind/state/result/category;不含 trace id、actor/subject/truth refs、raw endpoint/topic/free text。 | 不把 entity ref、request id、payload digest、error text、URL、topic 或 raw route 作为 label。 |
| audit refs-only cut | Step 6;Step 9;Step 11;Step 12;Step 15 | 验证 accepted business fact、operations fact、handoff/report/marker state 的审计承载。 | audit / operations fact 只持有 refs、state、safe reason/source、receipt/report refs;rejected/query/duplicate 不伪装为 accepted audit。 | 不用 runtime log、metric、raw operator note、external body 或 report body 替代 business audit。 |
| safe diagnostic / redaction source cut | Step 6;Step 7;Step 12;Step 14;Step 15 | 验证 redaction marker、safe diagnostic ref、availability/degraded marker 的来源。 | marker/ref 只来自 formal mapper/resolver/builder/port output;source missing 时停审回补。 | 不由 log adapter、service string、raw exception、SQL/provider body、raw config 合成 marker。 |
| query observation no-write cut | Step 8;Step 9;Step 11;Step 12;Step 15 | 验证 Query visible/empty/not-visible/degraded/unavailable/partial 的观测行为。 | 只允许 runtime log/metric/safe correlation;不写 business audit、stored command result、event candidate 或 repair。 | 不通过 observability backend 反推 read state;不把 diagnostic 当 material repair。 |
| post-commit side-effect failure cut | Step 9;Step 11;Step 12;Step 13;Step 15 | 验证 publication/handoff/observability failure after accepted truth/report/candidate committed。 | 记录 safe outcome/diagnostic only when formal;不回滚 accepted truth/report/candidate;不重建 candidate。 | 不把 publisher/handoff failure 当 Command rollback;不从 current truth、payload、delivery receipt 重建 candidate。 |

### 5. error / config / observability 切口交接关系

| 后续模块 / 文档 | R16.16 已交付 | 不得从本模块直接推出 |
|---|---|---|
| `R16.17/R16.18 cross-step closure and formal §15 candidate stop-review` | 已形成 error、config/dependency、observability/audit 三组最小测试切口和 source Step 映射。 | 不直接装配 formal §15 candidate draft;不跳过 closure audit。 |
| `05-测试方案.md` | 可承接测试意图、断言方向和 forbidden shortcut。 | 不直接继承 TC ID、fixture、suite、case priority、evidence artifact schema。 |
| `06-验收标准.md` | 可承接 no raw body、no secret、no synthetic marker、query no-write、duplicate no-rerun 等红线。 | 不从本表生成最终 acceptance gate 或覆盖率目标。 |
| `07-实施计划.md` | 可承接 implementation gate 的 redline check、fake/durable parity、config blocker、observability redaction。 | 不从本表推 commit boundary、CI command、run report schema 或代码文件清单。 |

### 6. R16.17 进入门禁

`R16.17 cross-step closure and formal §15 candidate stop-review:先思考` 只允许思考 Step 16 的跨 Step 收口、正式 §15 候选结构和 Step 17 进入条件:

1. 思考 Step 5~15 是否都已有对应测试切口来源。
2. 思考 R16.1~R16.16 的 coverage index、source map、禁入项和 remaining handoff。
3. 思考 formal §15 candidate source map、章节结构和禁止携带内容。
4. 思考 Step 17 implementation handoff 的 entry gate。
5. 不写 formal §15 candidate draft、不修改正式 `03-详细设计.md`、不写完整 test case schema、fixture、evidence schema、CI pipeline、验收标准或 implementation code。

### 7. R16.16 stop-review

| 检查项 | 结果 |
|---|---|
| 是否写入 error test cuts 表 | pass |
| 是否写入 config / dependency test cuts 表 | pass |
| 是否写入 observability / audit test cuts 表 | pass |
| 是否每行包含 source Step、intent、minimum assertions direction、forbidden shortcut | pass |
| 是否写入后续交接关系和 R16.17 进入门禁 | pass |
| 是否未写 formal §15 candidate draft | pass |
| 是否未写完整 test case schema、fixture、evidence schema、CI、验收标准或 implementation code | pass |
| 是否未修改正式 `03-详细设计.md` | pass |

next_allowed_action: 等待用户确认后进入 Step 16 `R16.17 cross-step closure and formal §15 candidate stop-review:先思考`;只允许思考 Step 16 cross-step closure、Step 5~15 source coverage、R16.1~R16.16 coverage index、formal §15 candidate source map / 章节结构 / 禁入项、Step 17 entry gate 和 `R16.18` 写入计划;不得直接修改正式 `03-详细设计.md`;不得写 formal §15 candidate draft、完整 test case schema、fixture、evidence schema、CI pipeline、验收标准、implementation code 或具体 config key/env/topic/URL。

---

## R16.17 cross-step closure and formal §15 candidate stop-review:先思考

### 1. 当前模块目标

`R16.17` 只思考 Step 16 的跨 Step 收口、Step 5~15 source coverage、R16.1~R16.16 coverage index、formal §15 candidate source map / 章节结构 / 禁入项、Step 17 entry gate 和 `R16.18` 写入计划。当前模块不写 formal §15 candidate draft,不修改正式 `03-详细设计.md`,不写完整 test case schema、fixture、evidence schema、CI pipeline、验收标准或 implementation code。

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm |
| 用户确认 | 已确认从 `R16.16` 推进到 `R16.17`。 |
| 当前允许 | 思考 Step 16 closure、source coverage、coverage index、formal §15 source map / 章节结构 / 禁入项、Step 17 entry gate 和 R16.18 写入计划。 |
| 当前禁止 | 写 formal §15 candidate draft、修改正式 `03-详细设计.md`、写完整 test case schema、fixture、evidence schema、CI pipeline、验收标准、implementation code、具体 config key/env/topic/URL。 |

### 2. Step 5~15 source coverage 思考

| source Step | Step 16 已覆盖入口 | R16.18 写入时需确认 |
|---|---|---|
| Step 5 module contracts | R16.5/R16.6 module test cuts 按七实现单元覆盖。 | contracts/domain/application/infra/api/worker/jobs 均有最小测试入口和 forbidden shortcut。 |
| Step 6 object contracts | R16.5/R16.6、R16.11/R16.12、R16.15/R16.16 覆盖 object invariant、state owner、marker、body-free redline。 | truth/support/material/trace/audit/report/marker 对象均能反查至少一个测试入口。 |
| Step 7 trait / port / adapter | R16.5/R16.6、R16.13/R16.14、R16.15/R16.16 覆盖 repository/UoW、resolver/mapper、publisher/handoff、fake/durable parity。 | port failure、availability marker、missing source blocker 不靠 fake 私补。 |
| Step 8 protocol contracts | R16.7/R16.8、R16.9/R16.10 覆盖 Command、Query、Inbound、Outbound、Job public surface。 | 每个协议族至少有 positive、negative、safe surface 或 no-write/no-rerun 测试入口。 |
| Step 9 function flows | R16.7~R16.10、R16.13~R16.16 覆盖 accepted/rejected/duplicate/no-write/partial/failed flow。 | flow side-effect 顺序和 no forbidden side effect 均有测试入口。 |
| Step 10 state machine | R16.11/R16.12 覆盖正式状态族合法/非法转换。 | state owner/source、illegal transition no side-effect、checkpoint-not-version 均被标出。 |
| Step 11 persistence / tx | R16.13/R16.14 覆盖 UoW atomicity、rollback、stored replay、checkpoint/version、query no-write。 | transaction / logical store 语义不被 log/report/fake 替代。 |
| Step 12 errors / recovery | R16.15/R16.16 覆盖 safe error、manual/consistency、unavailable/degraded、stored surface missing、commit unknown。 | retryability semantic、no raw exception、no rerun、source missing stop 均进入 closure。 |
| Step 13 concurrency / idempotency | R16.13/R16.14 覆盖 same/different digest、in-flight、race、commit unknown、job resume。 | duplicate no-rerun、checkpoint resume、publication retry guard 均有入口。 |
| Step 14 config / dependencies | R16.15/R16.16 覆盖 config validation、availability、forbidden configurable boundary、fake/durable parity。 | 不写具体 key/env/topic/URL;config 不补 source/marker/schema。 |
| Step 15 observability / audit | R16.15/R16.16 覆盖 no raw body、no secret、low-cardinality label、audit refs-only、safe diagnostic source。 | 观测测试只验证红线和安全承载,不定义 backend/schema。 |

### 3. R16.1~R16.16 coverage index 思考

| module range | 已形成内容 | formal §15 候选落点 |
|---|---|---|
| R16.1/R16.2 | Step 16 开工边界、必读文档、旧材料隔离、SOP 五问和分批计划。 | §15.1 scope / non-goals / source baseline。 |
| R16.3/R16.4 | L1-governance 框架对齐、测试分层、Step 5~15 source map、最小验证入口总图。 | §15.2 test cut overview and source map。 |
| R16.5/R16.6 | 七实现单元 module test cuts。 | §15.3 module test cuts。 |
| R16.7/R16.8 | Command / Query test cuts。 | §15.4 protocol / interface test cuts 的同步入口。 |
| R16.9/R16.10 | Inbound / Outbound / Job test cuts。 | §15.4 protocol / interface test cuts 的异步与后台入口。 |
| R16.11/R16.12 | state machine test cuts。 | §15.5 state machine test cuts。 |
| R16.13/R16.14 | consistency / idempotency / concurrency cuts。 | §15.6 transaction / idempotency / concurrency cuts。 |
| R16.15/R16.16 | error / config / observability cuts。 | §15.7 error / config / observability cuts。 |
| R16.17/R16.18 | cross-step closure、formal §15 source map、禁入项、Step 17 entry gate。 | §15.8 closure and downstream handoff。 |

### 4. formal §15 candidate source map 思考

正式 `03-详细设计.md` §15 的候选结构只能从已确认的 R16.2、R16.4、R16.6、R16.8、R16.10、R16.12、R16.14、R16.16 和 R16.18 装配。R16.17 只思考 source map,不写候选正文。

| formal §15 候选块 | source modules | 装配原则 |
|---|---|---|
| §15.1 Scope and non-goals | R16.2 | 说明 Step 16 只定义最小测试切口,不替代 05/06/07。 |
| §15.2 Source map and overview | R16.4 | 装配 Step 5~15 source map、测试分层和最小验证入口总图。 |
| §15.3 Module test cuts | R16.6 | 装配七实现单元测试切口表和后续交接关系。 |
| §15.4 Protocol / interface test cuts | R16.8;R16.10 | 装配 Command、Query、Inbound、Outbound、Job 测试切口。 |
| §15.5 State machine test cuts | R16.12 | 装配正式状态族合法/非法转换测试入口。 |
| §15.6 Consistency / idempotency / concurrency cuts | R16.14 | 装配 UoW、rollback、stored replay、commit unknown、race、checkpoint、partial retry 切口。 |
| §15.7 Error / config / observability cuts | R16.16 | 装配 safe error、config validation、adapter availability、redaction、metric label、audit refs-only 切口。 |
| §15.8 Closure and handoff | R16.18 | 装配 source coverage audit、deferred-to-05/06/07、Step 17 entry gate。 |

### 5. formal §15 禁入项思考

| 禁入项 | 禁入原因 |
|---|---|
| 旧 `MethodContent`、publish、snapshot、fingerprint、old outbox relay、P0/P1 测试 | historical pollution,不属于当前 00/01/02 和 Step 1~15 正向基线。 |
| TC ID、case priority、suite hierarchy、coverage target、test data set、fixture JSON、evidence artifact schema | 属于 `05-测试方案.md` / `06-验收标准.md` / `07-实施计划.md` 后续文档。 |
| CI command、run report path、acceptance gate、commit boundary、代码文件清单 | 属于实施计划或实现仓执行台账。 |
| concrete config key、env、profile、secret source、topic、queue、URL、transport product、numeric retry/backoff/TTL | 属于 `04-配置设计.md` 或后续部署配置。 |
| metric backend、dashboard、alert threshold、SLO、sampling、retention、runbook | 属于观测方案 / 运维 / 验收后续文档,不是 Step 16 最小切口。 |
| 新增未闭口 object / port / DTO / mapper / source / marker / schema | 违反设计真相源闭环;发现缺口必须回 owning Step 补口。 |
| raw body、secret、provider payload、external document body、synthetic marker | 违反 Step 12/14/15 的安全与 body-free 红线。 |

### 6. Step 17 entry gate 思考

进入 Step 17 `收口详细设计到实施计划的承接清单` 前,Step 16 需要在 R16.18 明确:

1. Step 5~15 均已具备最小测试切口入口和 source Step 反查。
2. Step 16 没有修改正式 `03-详细设计.md`,formal §15 仍只是候选 source map。
3. 完整 test case schema、fixture、evidence schema、CI、验收标准、implementation code 均已明确后移。
4. 若 Step 16 closure 发现测试切口需要未闭口 source/marker/schema,必须暂停回 owning Step,不得进入 Step 17。
5. Step 17 只承接实施计划输入清单,不得回头重写测试切口内容。

### 7. R16.18 写入计划思考

`R16.18 cross-step closure and formal §15 candidate stop-review:再写入` 应把本模块思考落成可恢复收口记录:

1. 写 Step 5~15 source coverage audit table。
2. 写 R16.1~R16.16 coverage index table。
3. 写 formal §15 source map table 和 formal §15 forbidden carryover table。
4. 写 downstream handoff table: `04/05/06/07/17/19` 分别承接什么、不得承接什么。
5. 写 Step 16 completed stop-review 和 Step 17 entry gate。
6. 不写 formal §15 candidate draft 正文、不修改正式 `03-详细设计.md`。

### 8. R16.17 stop-review

| 检查项 | 结果 |
|---|---|
| 是否只思考 cross-step closure 和 formal §15 candidate stop-review | pass |
| 是否覆盖 Step 5~15 source coverage | pass |
| 是否覆盖 R16.1~R16.16 coverage index | pass |
| 是否形成 formal §15 source map、章节结构和禁入项思考 | pass |
| 是否形成 Step 17 entry gate 和 R16.18 写入计划 | pass |
| 是否未写 formal §15 candidate draft | pass |
| 是否未写完整 test case schema、fixture、evidence schema、CI、验收标准或 implementation code | pass |
| 是否未修改正式 `03-详细设计.md` | pass |

next_allowed_action: 等待用户确认后进入 Step 16 `R16.18 cross-step closure and formal §15 candidate stop-review:再写入`;只允许写入 Step 5~15 source coverage audit table、R16.1~R16.16 coverage index table、formal §15 source map table、formal §15 forbidden carryover table、downstream handoff table、Step 16 completed stop-review 和 Step 17 entry gate;不得直接修改正式 `03-详细设计.md`;不得写 formal §15 candidate draft 正文、完整 test case schema、fixture、evidence schema、CI pipeline、验收标准、implementation code 或具体 config key/env/topic/URL。

---

## R16.18 cross-step closure and formal §15 candidate stop-review:再写入

### 1. 当前模块状态

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm |
| Step 状态 | Step 16 completed_wait_user_confirm |
| 用户确认 | 已确认从 `R16.17` 推进到 `R16.18`。 |
| 本模块写入范围 | Step 5~15 source coverage audit table、R16.1~R16.16 coverage index table、formal §15 source map table、formal §15 forbidden carryover table、downstream handoff table、Step 16 completed stop-review 和 Step 17 entry gate。 |
| 本模块禁止范围 | formal §15 candidate draft 正文、完整 test case schema、fixture、evidence schema、CI pipeline、验收标准、implementation code、具体 config key/env/topic/URL 和正式 `03-详细设计.md`。 |

### 2. Step 5~15 source coverage audit table

| source Step | closure status | Step 16 coverage statement | remaining handoff |
|---|---|---|---|
| Step 5 module contracts | pass | 七实现单元 `contracts/domain/application/infra/api/worker/jobs` 均已在 R16.6 形成 module test cuts。 | 05/06/07 细化 suite / TC / evidence。 |
| Step 6 object contracts | pass | object invariant、state owner、marker、body-free redline 已由 R16.6、R16.12、R16.16 覆盖。 | 若后续发现 object/source 缺口,回 Step 6 补口。 |
| Step 7 trait / port / adapter | pass | repository/UoW、resolver/mapper、publisher/handoff、fake/durable parity 已由 R16.6、R16.14、R16.16 覆盖。 | 05/07 细化 fake/durable 测试边界和实施 gate。 |
| Step 8 protocol contracts | pass | Command、Query、Inbound、Outbound、Job public surface 已由 R16.8 和 R16.10 覆盖。 | 不在 Step 16 写完整 protocol case matrix。 |
| Step 9 function flows | pass | accepted/rejected/duplicate/no-write/partial/failed flow 已由 R16.8、R16.10、R16.14、R16.16 覆盖。 | flow 级 TC 编号后移 05。 |
| Step 10 state machine | pass | 正式状态族合法/非法转换已由 R16.12 覆盖。 | 不恢复旧状态名;状态用例细化后移 05。 |
| Step 11 persistence / tx | pass | UoW atomicity、rollback、stored replay、checkpoint/version、query no-write 已由 R16.14 覆盖。 | durable product / DB isolation 不在 Step 16 定义。 |
| Step 12 errors / recovery | pass | safe error、manual/consistency、unavailable/degraded、stored surface missing、commit unknown 已由 R16.16 覆盖。 | error code / transport status 后移 protocol adapter 或测试方案。 |
| Step 13 concurrency / idempotency | pass | same/different digest、in-flight、race、commit unknown、job resume 已由 R16.14 覆盖。 | lock/TTL/lease/numeric retry 不进入 Step 16。 |
| Step 14 config / dependencies | pass | config validation、availability、forbidden configurable boundary、fake/durable parity 已由 R16.16 覆盖。 | concrete config key/env/topic/URL 后移 04。 |
| Step 15 observability / audit | pass | no raw body、no secret、low-cardinality label、audit refs-only、safe diagnostic source 已由 R16.16 覆盖。 | backend/schema/dashboard/alert 后移 05/06/07 或 observability 后续文档。 |

### 3. R16.1~R16.16 coverage index table

| module range | output family | formal §15 source role | status |
|---|---|---|---|
| R16.1/R16.2 | 开工、必读文档、旧材料隔离、SOP 五问、分批计划。 | §15.1 scope / source baseline。 | completed |
| R16.3/R16.4 | L1-governance 框架对齐、测试分层、Step 5~15 source map、最小验证入口总图。 | §15.2 overview / source map。 | completed |
| R16.5/R16.6 | module test cuts。 | §15.3 module cuts。 | completed |
| R16.7/R16.8 | Command / Query test cuts。 | §15.4 protocol/interface cuts。 | completed |
| R16.9/R16.10 | Inbound / Outbound / Job test cuts。 | §15.4 protocol/interface cuts。 | completed |
| R16.11/R16.12 | state machine test cuts。 | §15.5 state machine cuts。 | completed |
| R16.13/R16.14 | consistency / idempotency / concurrency cuts。 | §15.6 consistency/idempotency/concurrency cuts。 | completed |
| R16.15/R16.16 | error / config / observability cuts。 | §15.7 error/config/observability cuts。 | completed |
| R16.17/R16.18 | source coverage audit、formal §15 source map、forbidden carryover、handoff、Step 17 gate。 | §15.8 closure / downstream handoff。 | completed_wait_user_confirm |

### 4. formal §15 source map table

| formal §15 candidate block | only source modules | assembly note |
|---|---|---|
| §15.1 Scope and non-goals | R16.2 | 写 Step 16 只定义最小测试切口;完整测试方案、验收标准、实施计划后移。 |
| §15.2 Source map and overview | R16.4 | 写 Step 5~15 source map、测试分层和最小验证入口总图。 |
| §15.3 Module test cuts | R16.6 | 写七实现单元测试切口和交接关系。 |
| §15.4 Protocol / interface test cuts | R16.8;R16.10 | 写 Command、Query、Inbound、Outbound、Job 测试切口。 |
| §15.5 State machine test cuts | R16.12 | 写正式状态族合法/非法转换测试入口。 |
| §15.6 Consistency / idempotency / concurrency cuts | R16.14 | 写 UoW、rollback、stored replay、commit unknown、race、checkpoint、partial retry 切口。 |
| §15.7 Error / config / observability cuts | R16.16 | 写 safe error、config validation、adapter availability、redaction、metric label、audit refs-only 切口。 |
| §15.8 Closure and handoff | R16.18 | 写 source coverage audit、deferred-to-04/05/06/07、Step 17 entry gate。 |

### 5. formal §15 forbidden carryover table

| forbidden carryover | Step 16 result |
|---|---|
| 旧 `MethodContent`、publish、snapshot、fingerprint、old outbox relay、P0/P1 测试 | rejected;historical pollution。 |
| TC ID、case priority、suite hierarchy、coverage target、fixture JSON、evidence artifact schema | deferred to `05-测试方案.md` / `06-验收标准.md` / `07-实施计划.md`。 |
| CI command、run report path、acceptance gate、commit boundary、代码文件清单 | deferred to implementation planning and execution ledgers。 |
| concrete config key、env、profile、secret source、topic、queue、URL、transport product、numeric retry/backoff/TTL | deferred to `04-配置设计.md` 或后续部署配置。 |
| metric backend、dashboard、alert threshold、SLO、sampling、retention、runbook | deferred to observability / operations / acceptance follow-up。 |
| 新增未闭口 object / port / DTO / mapper / source / marker / schema | blocked if discovered;return to owning Step。 |
| raw body、secret、provider payload、external document body、synthetic marker | rejected;violates Step 12/14/15 redline。 |

### 6. downstream handoff table

| handoff target | must consume from Step 16 | must not infer from Step 16 |
|---|---|---|
| `04-配置设计.md` | config validation redline、forbidden configurable boundary、adapter availability、no concrete key in Step 16。 | actual key/env/profile/topic/URL/default/secret source from test cut text。 |
| `05-测试方案.md` | source Step、test cut intent、minimum assertions direction、forbidden shortcut。 | Direct TC IDs、fixture JSON、suite priority、evidence artifact schema。 |
| `06-验收标准.md` | redline outcomes such as no raw body、no secret、query no-write、duplicate no-rerun、no synthetic marker。 | Final acceptance gate、coverage target、run report shape。 |
| `07-实施计划.md` | implementation gate candidates: fake/durable parity、config blocker、observability redaction、no private fallback。 | Commit boundary、code file list、CI command、run-scoped report schema。 |
| Step 17 implementation handoff | Step 5~15 coverage status、formal §15 source map、deferred items and blockers。 | Rewriting test cuts or adding new test families without returning to Step 16。 |
| Step 19 formal assembly | assemble formal §15 only from confirmed R16 tables and this closure。 | Directly copy historical Step 16 or add formal case schema。 |

### 7. Step 17 entry gate

进入 Step 17 `收口详细设计到实施计划的承接清单` / `R17.1 开工与必读文档:先思考` 前必须满足:

- Step 16 `R16.1` ~ `R16.18` 均已 completed_wait_user_confirm。
- Step 5~15 均已具备最小测试切口入口和 source Step 反查。
- 正式 `03-详细设计.md` 未由 Step 16 直接修改。
- formal §15 仍是 source map 和候选结构,不是正式文档正文。
- 完整 test case schema、fixture、evidence schema、CI、验收标准、implementation code、concrete config key/env/topic/URL 已明确后移。
- 若 Step 17 发现实施承接需要新测试切口或未闭口 source/marker/schema,必须回 Step 16 或 owning Step,不得自行补口。

### 8. R16.18 final stop-review

| 检查项 | 结果 |
|---|---|
| 是否写入 Step 5~15 source coverage audit table | pass |
| 是否写入 R16.1~R16.16 coverage index table | pass |
| 是否写入 formal §15 source map table | pass |
| 是否写入 formal §15 forbidden carryover table | pass |
| 是否写入 downstream handoff table | pass |
| 是否形成 Step 16 completed_wait_user_confirm 与 Step 17 entry gate | pass |
| 是否未写 formal §15 candidate draft 正文 | pass |
| 是否未写完整 test case schema、fixture、evidence schema、CI、验收标准或 implementation code | pass |
| 是否未修改正式 `03-详细设计.md` | pass |

next_allowed_action: 等待用户确认后进入 Step 17 `R17.1 开工与必读文档:先思考`;只允许思考 Step 17 的开工边界、必读文档、Step 16 handoff、L1-governance 框架参考、旧 Step 17 污染隔离、实施承接清单分批计划和 `R17.2` 写入边界;不得直接修改正式 `03-详细设计.md`;不得写正式实施计划、commit boundary、代码文件清单、evidence schema、CI command、acceptance gate 或 implementation code。
