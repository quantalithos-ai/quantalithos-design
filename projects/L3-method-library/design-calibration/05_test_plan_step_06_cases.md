# Step 6. 设计测试场景与用例矩阵

> 对应 SOP: `standards/document/测试方案讨论流程_SOP.md` Step 6
> 回填章节: `05-测试方案.md` §6 测试场景与用例设计
> 创建日期: 2026-06-27
> 当前模式: full-restart / step6-cases
> 当前状态: completed
> 当前模块: `R6.14 cross-case audit / closure 用例:再写入`
> 当前门禁: `R6.14` completed_wait_user_confirm_to_R7.1;等待确认进入 Step 7 `R7.1 测试数据设计:先思考`

---

## 0. Step 5 handoff

Step 5 已确认当前 `05-测试方案.md` 的需求追溯与覆盖输入:

- FR-ML-001~009 均已映射到设计依据、测试切口、场景候选、用例候选族、自动化候选和证据候选族。
- BR-ML-001~022、NFR-ML-004~016、数据归属、配置 / profile / dependency 红线均已有覆盖候选。
- Step 3 的 P0 测试切口均能反查需求 / 规则 / 设计契约。
- 当前未发现 P0 覆盖空洞;FR-ML-E-*、BR-ML-E-001、production-like、capacity、multi-region、multi-tenant 和 secret provider 保持 P1/P2 residual / future。
- Step 6 进入条件已通过,但 Step 5 只保留用例候选族和证据候选族,未固定最终 TC 编号、用例步骤、测试数据、环境、自动化门禁或 evidence schema。

Step 6 的任务是把 Step 5 的覆盖候选族转成可执行、可断言、可留证的测试场景和用例矩阵。它必须按测试切口逐批推进,不得一次性生成无切口归属的大表。

---

## R6.1 测试场景与用例矩阵:先思考

### 1. 当前模块目标

`R6.1` 只思考 Step 6 的开工边界、必读文档、Step 5 handoff、L1-governance Step 6 框架参考、L3-method-library 的测试场景轴、用例矩阵分批方式、断言 / 数据 / 自动化 / evidence 边界和 `R6.2` 写入边界。

当前模块不写最终用例矩阵、TC 编号全集、测试步骤、测试数据、环境矩阵、自动化门禁、evidence schema、验收标准或实施计划。

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm_to_R6.2 |
| 用户确认 | 已确认从 Step 5 completed 推进到 Step 6 `R6.1`。 |
| 当前允许 | 思考 Step 6 开工边界、必读文档、SOP 十一问、Step 5 handoff、L1-governance 框架参考、L3 场景轴、用例分批、断言边界和 R6.2 写入边界。 |
| 当前禁止 | 修改正式 `05-测试方案.md`;写最终用例矩阵、测试数据、环境矩阵、自动化门禁、evidence schema、正式验收标准、实施计划或 implementation code。 |

### 2. Step 6 启动前必须承接

| 输入 | 必须承接的内容 | 禁止继承 / 禁止提前 |
|---|---|---|
| `project_execution_ledger.md` | 当前恢复点为 Step 5 completed_wait_user_confirm_to_R6.1;每次确认只推进一个当前模块。 | 直接写完整用例矩阵或跳到测试数据。 |
| `05_test_plan_calibration_flow.md` | Step 1~5 completed;Step 6 waiting_user_confirm_to_R6.1;Step 7+ blocked。 | 在 Step 6 写 fixture、环境矩阵、CI suite 或 artifact schema。 |
| `05_test_plan_step_03_test_objects_cuts.md` | P0 测试切口、负向切口、P1/P2 seam 和停审结论。 | 生成无切口归属的用例。 |
| `05_test_plan_step_04_strategy_layers.md` | 每个 P0 切口的主发现层级、辅助层级和阻断口径。 | 把所有断言推给 release gate。 |
| `05_test_plan_step_05_traceability_coverage.md` | 需求 / 规则 / 设计 / 切口覆盖候选、未覆盖项和 Step 6 进入条件。 | 改写覆盖矩阵或把 P1/P2 residual 当 P0 用例。 |
| `测试方案讨论流程_SOP.md` Step 6 | Step 6 必须输出测试场景表、用例矩阵、按切口组织的用例批次、单切口停审和跨用例审计。 | 只写 happy path 或散列表。 |
| `测试方案书写规范.md` §5.6 | 用例必须有场景、优先级、前置条件、输入 / 操作、预期结果、断言点、自动化候选。 | 预期结果使用口语状态或旧字段名。 |
| `03-详细设计.md` | 正式 object、port、protocol、flow、state、transaction、error、idempotency、config、observability 契约。 | 用测试方案补 schema、port、state、error、marker 或 mapper。 |
| `04-配置设计.md` | profile、source priority、validation、adapter availability、redaction、failure/degradation 和 downstream handoff。 | 写具体 secret、URL、topic、deployment command 或 artifact schema。 |
| L1-governance Step 6 | 参考按切口分批、用例矩阵列、断言矩阵、停审和跨用例审计框架。 | 复制 governance 的 TC 编号、领域对象、状态、事件或证据族。 |

### 3. SOP Step 6 十一问思考边界

| SOP 问题 | R6.1 思考边界 | 后续落点 |
|---|---|---|
| 每个 P0 正向主线怎么执行? | 先按 definition truth、formal version、controlled consumption、traceability、config/redaction 等主线分场景族,不写步骤。 | 后续用例矩阵模块写正向用例。 |
| 每个关键反向和边界场景如何触发? | 先按 required field missing、source mismatch、illegal state、duplicate conflict、forbidden config、raw body leak 分类。 | 后续负向 / 边界用例模块写触发方式。 |
| 每个状态非法迁移如何断言? | 只允许引用 `03` 正式 state family 和 error surface;当前不列完整状态矩阵。 | 状态 / consistency 用例模块写断言。 |
| 每个事务回滚和副作用如何验证? | 先识别 UoW、repository fake、stored replay、outbox / report / marker 副作用边界。 | consistency / recovery 用例模块写 fault injection。 |
| 每个恢复场景如何复现? | 先按 duplicate replay、commit unknown、projection/reference unavailable、publisher failed、handoff failed 分类。 | recovery 用例模块写复现方式。 |
| 每个用例预期结果引用哪些正式字段、状态、错误或事件? | 先固定断言必须回指 `03/04` 正式契约;不得使用旧 MethodContent / publish / snapshot / outbox 口径。 | R6.2 以后写断言矩阵。 |
| 是否存在后续 phase 状态或证据提前写入? | R6.1 只制定检查规则;正式 evidence ID、artifact path、CI gate、验收 verdict 后移。 | R6.2 写 phase boundary 检查。 |
| 每个测试切口下有哪些正向、负向、边界、并发、恢复或一致性用例? | 先定义按测试切口分批写入,不在 R6.1 写全量表。 | R6.3+ 逐切口写入。 |
| 每个用例是否有明确断言点、数据前置、自动化候选和证据 ID? | 先定义列结构和候选口径;数据前置只写数据需求,不写 fixture。 | Step 6 用例模块和 Step 7 数据设计承接。 |
| 当前测试切口的用例完成后是否通过停审? | 先定义单切口停审维度。 | 每批用例写完后停审。 |
| 所有用例完成后是否存在断言重复、断言缺失、phase 越界或证据冲突? | 先定义跨用例审计维度。 | Step 6 收尾模块执行审计。 |

### 4. L1-governance Step 6 框架参考思考

L1-governance Step 6 的价值在于“按测试切口分批生成可执行用例,并给每个用例明确前置、输入、预期、断言、自动化候选和证据候选”。L3 采用框架,不复制领域事实。

| L1-governance 框架点 | L3 采用方式 | L3 禁止 |
|---|---|---|
| Step 状态和输入基线先行 | L3 Step 6 先写 Step 5 handoff、必读文档和禁止范围。 | 不直接进入完整 TC 表。 |
| 按测试切口组织用例批次 | L3 按 Step 3 切口族和 Step 5 覆盖候选族分批。 | 不生成无切口归属的用例大表。 |
| 用例矩阵列稳定 | L3 保留场景、优先级、前置条件、输入 / 操作、预期结果、断言点、自动化候选、证据候选。 | 不写“执行接口看成功”。 |
| 证据只作候选 | L3 可写 evidence candidate / family,正式 schema 留 Step 13。 | 不固定 artifact path、JSON 字段或最终 EV 编号。 |
| 单切口停审与跨用例审计 | L3 每批用例完成后停审,最后审计断言重复、缺失、phase 越界和旧材料污染。 | 不把停审集中到最后一次性补。 |

### 5. L3 测试场景轴思考

| 场景轴 | 需求 / 规则来源 | 主要切口 | R6.1 初判 |
|---|---|---|---|
| definition truth / identity / catalog | FR-ML-001~002;BR-ML-001~004 | truth invariant;public shell;query no-write | 需要正向构造、非法定义、身份目录读取、正文禁入和 query no-write 场景。 |
| formal version / explicit change | FR-ML-003~004;BR-ML-009~011 | state transition;command orchestration;idempotency | 需要正式化、版本稳定、显式变化、非法状态和 duplicate replay 场景。 |
| controlled consumption / distribution | FR-ML-005~006;BR-ML-012~018 | public shell;query;resolver/publisher/handoff seam | 需要下游 refs-only、material/summary 输出、adapter unavailable、handoff safe failure 场景。 |
| traceability / consistency / evidence lineage | FR-ML-007~009;NFR-ML-009~016 | command trace;query no-write;job no truth repair;observability | 需要 trace/audit refs-only、stored replay、job report/no repair、low-cardinality metric 场景。 |
| config / dependency / redaction | BR-ML-005~008;NFR-ML-004~008;`04` | config validation;forbidden configurable boundary;redaction | 需要 fail-fast、profile isolation、forbidden override、raw body/secret leak detection 场景。 |
| negative / boundary / recovery | Step 3 R3.10;Step 5 §8 | negative cuts;UoW/replay/recovery | 需要 missing field、source mismatch、illegal state、commit unknown、publisher failed、projection/reference unavailable 场景。 |

### 6. 用例矩阵分批思考

Step 6 是重模块,不得把所有用例一次写完。R6.2 只固化开工、列结构、批次计划和边界;后续按批次逐步写用例。

| 模块 | 主题 | 输出边界 |
|---|---|---|
| R6.1/R6.2 | 开工、必读文档、场景轴和用例矩阵框架 | 写 Step 6 输入、SOP 回答、列结构、分批计划和进入 R6.3 门禁;不写最终用例矩阵。 |
| R6.3/R6.4 | definition truth / identity / catalog 用例 | 写 FR-ML-001~002、BR-ML-001~004、truth/public shell/query no-write 相关用例。 |
| R6.5/R6.6 | formal version / explicit change / state 用例 | 写正式化、版本、显式变化、状态合法 / 非法、duplicate replay 用例。 |
| R6.7/R6.8 | controlled consumption / distribution / seam 用例 | 写 query、consumer、outbound、handoff、adapter unavailable / degraded 用例。 |
| R6.9/R6.10 | traceability / consistency / job / recovery 用例 | 写 trace/audit、job report、UoW rollback、commit unknown、no truth repair 用例。 |
| R6.11/R6.12 | config / dependency / redaction / observability 用例 | 写 config fail-fast、profile isolation、dependency boundary、redaction、metric/audit refs-only 用例。 |
| R6.13/R6.14 | 用例停审与跨用例审计 | 写单切口停审、断言重复 / 缺失 / phase 越界 / 旧材料污染审计和 Step 7 进入条件。 |

### 7. 用例列结构与边界思考

| 列 | Step 6 可写 | Step 6 禁止 |
|---|---|---|
| 用例 ID | 可在实际用例写入模块生成稳定 `TC-ML-*` 候选 / 正式测试方案用例 ID。 | R6.1 不生成;不得复用旧 TC。 |
| 场景 | 必须来自 Step 5 覆盖候选和 Step 3 切口。 | 从实现便利或旧测试名反推。 |
| 前置条件 | 可写正式状态 / ref / summary / fake seam 需求。 | 写具体 fixture 文件、seed JSON、数据库记录或环境变量。 |
| 输入 / 操作 | 可写调用哪个 formal command/query/job/entry 或触发哪类 event。 | 写实现代码、脚本命令或部署操作。 |
| 预期结果 | 必须引用正式字段、状态、错误、surface、marker 或副作用边界。 | 使用旧口语状态、未闭合 marker 或后续 phase 结果。 |
| 断言点 | 必须明确 truth/no-write/outbox/report/audit/redaction 等断言。 | 只写“成功 / 失败”。 |
| 自动化候选 | 可写是 / 候选 / 后续 Step 9 固定。 | 写 suite 名、required check 或 CI command。 |
| 证据候选 | 可写 evidence family / candidate。 | 写 artifact path、JSON schema 或最终 EV 编号。 |

### 8. 缺口与暂停规则思考

| 缺口类型 | 暂停条件 | 回写方向 |
|---|---|---|
| 用例需要未闭合字段 / state / error | 无法用 `03` 正式字段、状态、错误或 safe surface 表达预期结果。 | 回 `03` owning Step。 |
| 用例需要未闭合 port / mapper / marker source | 断言需要新 repository、resolver、mapper、marker 或 source。 | 回 `03` / `04` owning source。 |
| 用例需要 fixture / seed 才能成立 | 当前只缺数据构造细节,设计契约已闭合。 | 后移 Step 7,不阻塞 Step 6 场景定义。 |
| 用例需要 suite / command / artifact path | 当前只缺自动化或 evidence 归档细节。 | 后移 Step 9 / Step 13。 |
| 用例越过 P0 phase | 预期结果依赖 P1/P2 real-like、production-like、capacity 或旧主线。 | 降级 residual 或回 Step 2 / Step 5。 |

### 9. R6.2 写入边界思考

`R6.2 测试场景与用例矩阵:再写入` 不应写完整最终用例矩阵。它应把 R6.1 的开工思考固化为 Step 6 的可恢复框架。

1. 写 Step 6 必读文档表与读取状态。
2. 写 Step 5 handoff 承接表。
3. 写 SOP 十一问回答。
4. 写 L1-governance Step 6 框架参考边界。
5. 写 L3 测试场景轴和用例矩阵分批计划。
6. 写用例列结构、断言规则、数据 / 自动化 / evidence 边界。
7. 写缺口与暂停规则。
8. 写 `R6.3 definition truth / identity / catalog 用例:先思考` 进入门禁。
9. 禁止写最终用例矩阵、测试数据、环境矩阵、自动化门禁、evidence schema、验收标准、实施计划或正式 `05-测试方案.md`。

### 10. R6.1 stop-review

| 检查项 | 结果 |
|---|---|
| 是否只思考 Step 6 开工边界和用例设计框架 | pass |
| 是否承接 Step 5 completed handoff | pass |
| 是否读取并对照 SOP Step 6 和书写规范 §5.6 | pass |
| 是否参考 L1-governance 框架但不复制领域语义 | pass |
| 是否形成 L3 测试场景轴思考 | pass |
| 是否形成用例矩阵分批计划 | pass |
| 是否形成用例列结构、断言和 phase 边界 | pass |
| 是否形成 R6.2 写入边界 | pass |
| 是否未修改正式 `05-测试方案.md` | pass |
| 是否未写最终用例矩阵、测试数据、环境、自动化、evidence、验收或实施内容 | pass |

next_allowed_action: 等待用户确认后进入 Step 6 `R6.2 测试场景与用例矩阵:再写入`;只允许写入 Step 6 必读文档表、Step 5 handoff 承接、SOP 十一问回答、L1-governance 框架参考边界、L3 测试场景轴、用例矩阵分批计划、用例列结构、断言规则、数据 / 自动化 / evidence 边界、缺口与暂停规则和 `R6.3 definition truth / identity / catalog 用例:先思考` 进入门禁;不得直接修改正式 `05-测试方案.md`;不得写最终用例矩阵、测试数据、环境矩阵、自动化门禁、evidence schema、正式验收标准、实施计划或 implementation code。

---

## R6.2 测试场景与用例矩阵:再写入

### 1. 当前模块状态

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm_to_R6.3 |
| 用户确认 | 已确认从 `R6.1` 推进到 `R6.2`。 |
| 本模块写入范围 | Step 6 必读文档表、Step 5 handoff 承接、SOP 十一问回答、L1-governance Step 6 框架参考边界、L3 测试场景轴、用例矩阵分批计划、用例列结构、断言规则、数据 / 自动化 / evidence 边界、缺口与暂停规则、`R6.3` 进入门禁。 |
| 本模块禁止范围 | 正式 `05-测试方案.md` 正文、最终 TC 编号全集、完整用例矩阵、测试数据 fixture、环境矩阵、CI suite / required check、evidence artifact schema、正式验收标准、实施计划和 implementation code。 |

### 2. 必读文档表与读取状态

| 文档 | 读取状态 | Step 6 用途 | 当前裁决 |
|---|---|---|---|
| `project_execution_ledger.md` | 已读取并承接 | 确认当前恢复点、单模块推进规则和正式文档不得跳写。 | 当前只推进 `R6.2`。 |
| `05_test_plan_calibration_flow.md` | 已读取并承接 | 确认 Step 1~5 completed、Step 6 in_progress、Step 7+ blocked。 | `R6.2` 完成后等待 `R6.3`。 |
| `05_test_plan_step_03_test_objects_cuts.md` | 已承接 | 提供 P0 测试对象、测试切口、负向切口、P1/P2 residual 和停审结论。 | 用例必须绑定切口。 |
| `05_test_plan_step_04_strategy_layers.md` | 已承接 | 提供每个 P0 切口的主发现层级、辅助层级和阻断口径。 | 用例断言不得全部推给 release gate。 |
| `05_test_plan_step_05_traceability_coverage.md` | 已读取并承接 | 提供 FR-ML / BR-ML / NFR-ML / 数据归属 / 配置红线到场景候选和用例候选族的追溯。 | Step 6 不重开覆盖矩阵。 |
| `测试方案讨论流程_SOP.md` | 已读取 Step 6 | 固定 Step 6 必须按测试切口输出场景表、用例矩阵、停审和跨用例审计。 | 当前先固化框架,后续分批写用例。 |
| `测试方案书写规范.md` | 已读取 §5.6 | 固定用例矩阵列:场景、优先级、前置条件、输入 / 操作、预期结果、断言点、自动化候选、证据候选。 | 正式 §6 留 Step 15 装配。 |
| `设计文档讨论中间产物规范.md` | 已承接 | 固定先思考后写入、单次确认单模块、写入批次不等于最终长度上限。 | Step 6 继续按 R6.x 小模块推进。 |
| `00-需求文档.md` | 已承接 | 提供 FR-ML、BR-ML、NFR-ML、数据归属、接口依赖和验收方向。 | 不新增需求编号。 |
| `03-详细设计.md` | 已承接 | 提供 object、port、protocol、flow、state、transaction、error、idempotency、config、observability 和 test cut。 | 不补 schema、port、state、mapper、marker source。 |
| `04-配置设计.md` | 已承接 | 提供 profile、source priority、validation、adapter availability、redaction、failure/degradation 和 downstream handoff。 | 不写具体 secret、URL、topic、deployment command 或 artifact schema。 |
| L1-governance Step 6 | 已对照 | 参考“按切口分批 + 稳定列 + 断言矩阵 + 停审 + 跨用例审计”的框架。 | framework reference only。 |

### 3. Step 5 handoff 承接表

| Step 5 输出 | Step 6 承接方式 | 当前状态 |
|---|---|---|
| FR-ML-001~009 已有覆盖候选族 | Step 6 按主线分成 definition truth、formal version、controlled consumption、traceability、config/redaction 等用例批次。 | pass |
| BR-ML / NFR-ML / 数据归属 / 配置红线均有候选覆盖 | Step 6 把规则和红线转成正向、负向、边界、恢复、一致性和 redaction 用例候选。 | pass |
| Step 3 切口反向覆盖已完成 | Step 6 每个用例批次必须回指至少一个 Step 3 切口。 | pass |
| 当前无 P0 覆盖空洞 | Step 6 不需要回退 Step 5;后续若发现用例无法表达正式断言,按 source blocker 暂停。 | pass |
| Step 5 未固定最终 TC / EV | Step 6 才开始生成 `TC-ML-*` 候选;正式 evidence ID / path / schema 留 Step 13。 | pass |
| P1/P2 residual 已隔离 | Step 6 不把 FR-ML-E-*、production-like、capacity、hard SLO 当 P0 pass 条件。 | pass |

### 4. SOP 十一问回答

| SOP 问题 | Step 6 回答 |
|---|---|
| 每个 P0 正向主线怎么执行? | 按 definition truth / identity / catalog、formal version / explicit change、controlled consumption / distribution、traceability / consistency / evidence lineage、config / dependency / redaction 五类主线分批。每类先由 `03/04` 正式契约决定可执行入口,再写前置、输入、预期和断言。 |
| 每个关键反向和边界场景如何触发? | 使用 required field missing、source mismatch、forbidden body、illegal state、duplicate conflict、version conflict、adapter unavailable、publisher / handoff failed、projection/reference unavailable、unsafe config 和 raw body / secret leak 触发。 |
| 每个状态非法迁移如何断言? | 只引用 `03` 正式 state family、transition guard、error surface 和 protocol rejection。若正式 state 或 error 缺失,暂停回写 `03`,不在测试方案中命名新状态。 |
| 每个事务回滚和副作用如何验证? | 后续用例只表达 UoW / repository fake / stored replay / outbox / report / marker 的验证意图;具体 fault fixture 留 Step 7,自动化 suite 留 Step 9。 |
| 每个恢复场景如何复现? | duplicate replay、commit unknown、projection/reference unavailable、publisher failed、handoff failed、job partial failure 均作为恢复场景族;复现方式必须回指 `03` flow / error / idempotency 契约。 |
| 每个用例预期结果引用哪些正式字段、状态、错误或事件? | 用例预期必须引用 `03/04` 正式 DTO、ref、state、error surface、safe summary、marker、job report、outbox / handoff / trace / audit 边界或 config validation gate。 |
| 是否存在后续 phase 状态或证据提前写入? | R6.2 只固定候选边界,不写正式 evidence ID、artifact path、report schema、CI check、验收 verdict、implementation boundary。 |
| 每个测试切口下有哪些正向、负向、边界、并发、恢复或一致性用例? | 采用 R6.3~R6.14 分批写入。每批至少覆盖正向主线、关键负向/边界、断言依据、自动化候选、证据候选和单批停审。 |
| 每个用例是否有明确断言点、数据前置、自动化候选和证据 ID? | 后续用例矩阵每行必须包含这些列。R6.2 只固定列结构和候选口径,不写最终矩阵。 |
| 当前测试切口的用例完成后是否通过停审? | 每个 R6.x 用例批次完成后必须停审:切口绑定、正式契约引用、断言可判定、数据/自动化/evidence 未越界。 |
| 所有用例完成后是否存在断言重复、断言缺失、phase 越界或证据冲突? | R6.13/R6.14 执行跨用例审计,检查断言重复、孤儿切口、孤儿需求、phase 越界、旧材料污染和证据候选冲突。 |

### 5. L1-governance Step 6 框架参考边界

| 框架点 | L3 采用 | L3 差异 / 禁止 |
|---|---|---|
| Step 状态、输入和目标先行 | L3 保留 Step 状态、输入基线、目标和禁止范围。 | 不复制 governance 的 Command / Query / Job 数量或领域对象。 |
| 先用例批次表,再测试场景表,再矩阵 | L3 采用同一展开顺序,但 R6.2 只固化批次计划和列结构。 | 不一次性写完所有 TC。 |
| 用例行必须可执行、可断言、可留证 | L3 后续每行必须有前置、输入 / 操作、预期、断言、自动化候选、证据候选。 | 不写“验证成功”这类不可判定结果。 |
| 候选证据不等于正式 evidence | L3 可以写 evidence family / candidate。 | 不写 artifact path、JSON key、run id 或最终 EV。 |
| 单切口停审和跨用例审计 | L3 每批用例后停审,最后跨批审计。 | 不把停审延后到 Step 15 才补。 |

### 6. L3 测试场景轴

| 场景轴 | 需求 / 规则来源 | 主要测试切口 | 后续用例批次 |
|---|---|---|---|
| definition truth / identity / catalog | FR-ML-001~002;BR-ML-001~004;数据归属 | truth invariant;public shell;query no-write;owner boundary | R6.3/R6.4 |
| formal version / explicit change / state | FR-ML-003~004;BR-ML-009~011;NFR-ML-009~012 | state transition;command orchestration;idempotency;stored replay | R6.5/R6.6 |
| controlled consumption / distribution / seam | FR-ML-005~006;BR-ML-012~018;NFR-ML-004~006 | public shell;query;consumer/outbound/handoff seam;degraded safe surface | R6.7/R6.8 |
| traceability / consistency / job / recovery | FR-ML-007~009;BR-ML-019~022;NFR-ML-009~016 | trace/audit refs-only;UoW;job no truth repair;safe diagnostic | R6.9/R6.10 |
| config / dependency / redaction / observability | BR-ML-005~008;NFR-ML-007~008;`04` | config validation;profile isolation;forbidden configurable boundary;redaction;low-cardinality metrics | R6.11/R6.12 |
| stop-review / cross-case audit | Step 3~5 all P0 cuts | orphan/duplicate/phase/evidence candidate audit | R6.13/R6.14 |

### 7. 用例矩阵分批计划

| 模块 | 主题 | 允许输出 | 禁止输出 |
|---|---|---|---|
| R6.3/R6.4 | definition truth / identity / catalog 用例 | `TC-ML-TRUTH-*` / `TC-ML-IDENTITY-*` / `TC-ML-CATALOG-*` 候选行、断言点和停审。 | 测试数据 fixture、DB seed、CI suite、正式 EV。 |
| R6.5/R6.6 | formal version / explicit change / state 用例 | `TC-ML-VERSION-*` / `TC-ML-STATE-*` / `TC-ML-IDEMP-*` 候选行、非法状态和 duplicate replay 断言。 | 新增状态名、错误名或 replay schema。 |
| R6.7/R6.8 | controlled consumption / distribution / seam 用例 | `TC-ML-QUERY-*` / `TC-ML-CONSUMER-*` / `TC-ML-HANDOFF-*` 候选行、no-write 和 degraded/handoff 边界。 | 实现具体 adapter、topic、URL、artifact path。 |
| R6.9/R6.10 | traceability / consistency / job / recovery 用例 | `TC-ML-TRACE-*` / `TC-ML-JOB-*` / `TC-ML-RECOVERY-*` 候选行、report/no repair/rollback 边界。 | job run script、report JSON schema、run-scoped path。 |
| R6.11/R6.12 | config / dependency / redaction / observability 用例 | `TC-ML-CONFIG-*` / `TC-ML-REDACTION-*` / `TC-ML-ARCH-*` 候选行、config/redaction/dependency 断言。 | 真实 secret、部署命令、生产 profile pass 声明。 |
| R6.13/R6.14 | 用例停审与跨用例审计 | 单切口停审、跨用例断言审计、phase 边界审计、Step 7 进入条件。 | 在审计阶段补写新领域用例绕过用户确认。 |

### 8. 用例矩阵列结构

后续每个用例批次必须使用稳定列结构。列结构先于用例行固定,避免不同批次自由发挥。

| 列 | 必填性 | 写法要求 |
|---|---|---|
| 用例 ID | 必填 | 使用稳定 `TC-ML-<FAMILY>-<NNN>` 候选;不得复用旧 `MethodContent` 相关编号。 |
| 场景 | 必填 | 来自 Step 5 场景候选族和 Step 3 测试切口。 |
| 优先级 | 必填 | P0 / P1 / P2;当前主批次默认 P0,但不得把 P1/P2 residual 写成 P0 pass。 |
| 需求 / 规则来源 | 必填 | 写 FR-ML / BR-ML / NFR-ML / 数据归属 / 配置红线来源。 |
| 设计依据 | 必填 | 指向 `03/04` 正式契约族,不写未闭合字段或私有实现。 |
| 前置条件 | 必填 | 写正式状态 / ref / summary / adapter availability / config validation 前置;fixture 细节留 Step 7。 |
| 输入 / 操作 | 必填 | 写 formal command / query / event / job / entry 或 failure trigger 类型;不写脚本命令。 |
| 预期结果 | 必填 | 写正式 state、error surface、safe response、stored replay、report、marker 或 no-write 结果。 |
| 断言点 | 必填 | 至少一条可判定断言,例如 truth 不变、query no-write、redaction pass、outbox/report boundary。 |
| 自动化候选 | 必填 | 只能写 是 / 候选 / 否-需说明;具体 suite 和 required check 留 Step 9。 |
| 证据候选 | 必填 | 写 evidence family / candidate;正式 EV、artifact path 和 schema 留 Step 13。 |
| 停审备注 | 可选 | 记录 source blocker、Step 7 数据承接、Step 9 自动化承接或 Step 13 evidence 承接。 |

### 9. 断言规则

| 断言类别 | Step 6 写法 | 越界写法 |
|---|---|---|
| truth invariant | 写本仓 truth 字段 / 状态 / ref 是否被正确创建、拒绝或保持不变。 | 新增 truth 字段或从旧 `MethodContent` 推断。 |
| public shell / no body | 写 public surface 只包含 ref / summary / material boundary,不泄露外部正文。 | 写 raw body、完整外部文档或 secret 作为预期。 |
| state / error | 写正式状态变更、非法迁移拒绝和 protocol / application / domain error surface。 | 使用口语状态、未定义 error 或后续 phase 状态。 |
| query no-write | 写 query 命中、missing、not-visible、degraded 或 stale 时不得写 truth / report / marker。 | 让 query 自动 rebuild、repair 或 refresh。 |
| UoW / idempotency | 写 accepted path、duplicate replay、same-key conflict、rollback / commit unknown 边界。 | 从 current truth 重算 duplicate response 或私补 replay store。 |
| outbox / handoff / job | 写 stored payload/report/marker 的正式边界和 no truth repair。 | 用 job 修 core truth 或把 handoff package body 入 truth。 |
| config / redaction | 写 fail-fast、source priority、profile isolation、forbidden override、no secret / no body leak。 | 记录真实 secret、topic、URL 或生产部署命令。 |
| evidence candidate | 写候选证据族与可被 Step 13 承接的方向。 | 写最终 artifact path、JSON schema 或 release verdict。 |

### 10. 数据 / 自动化 / evidence 边界

| 主题 | Step 6 允许 | 后续承接 |
|---|---|---|
| 测试数据 | 写“需要 valid formal definition ref”“需要 projection unavailable fake”“需要 duplicate key fixture”等数据需求。 | Step 7 固定 fixture、seed、builder、fault injection 和数据隔离规则。 |
| 测试环境 | 写“需要 fake repository / fake adapter seam”“需要 redaction scan 环境能力”等能力需求。 | Step 8 固定环境、profile、配置矩阵和依赖拓扑。 |
| 自动化 | 写“自动化候选 = 是 / 候选”以及主发现层级。 | Step 9 固定 suite、CI/CD gate、required check 和执行命令。 |
| evidence | 写 evidence family / candidate 与验收可引用方向。 | Step 13 固定 evidence ID、artifact/report path、schema、retention 和 review status。 |
| 验收 | 写用例应能支撑的验收方向。 | Step 12 / `06-验收标准.md` 固定 entry / exit / veto / acceptance verdict。 |

### 11. 缺口与暂停规则

| 缺口类型 | 暂停条件 | 回写方向 |
|---|---|---|
| schema / field 缺口 | 用例预期需要 `03` 未正式定义的字段、state、error、DTO 或 report shape。 | 暂停并回 `03` owning Step。 |
| port / mapper / marker source 缺口 | 断言必须依赖未正式定义的 repository、resolver、mapper、marker 或 source。 | 暂停并回 `03/04` owning source。 |
| config key / profile 缺口 | 用例需要未在 `04` 固定的 config key、source priority、adapter availability 或 validation result。 | 暂停并回 `04`。 |
| 数据细节缺口 | 契约已闭合,但缺 fixture / seed / builder / fault injection 细节。 | 不阻塞 Step 6,记录给 Step 7。 |
| 自动化细节缺口 | 契约已闭合,但缺 suite、script、CI job、required check。 | 不阻塞 Step 6,记录给 Step 9。 |
| evidence 细节缺口 | 契约已闭合,但缺 artifact path、JSON schema、report table、retention。 | 不阻塞 Step 6,记录给 Step 13。 |
| phase 越界 | 用例依赖 P1/P2、production-like、capacity、multi-tenant、marketplace 或旧主线。 | 降级 residual / future 或回 Step 2 / Step 5。 |

### 12. R6.3 进入门禁

| 门禁项 | 裁决 |
|---|---|
| R6.2 是否已固化 Step 6 必读文档、handoff 和 SOP 回答 | pass |
| 是否已确认 L1-governance 只作框架参考 | pass |
| 是否已形成 L3 场景轴和分批计划 | pass |
| 是否已固定用例列结构、断言规则和数据 / 自动化 / evidence 边界 | pass |
| 是否已明确暂停规则 | pass |
| 是否未修改正式 `05-测试方案.md` | pass |
| 是否未写最终用例矩阵、fixture、CI gate、evidence schema、验收标准或实施计划 | pass |

进入 `R6.3 definition truth / identity / catalog 用例:先思考` 时,只允许思考 FR-ML-001~002、BR-ML-001~004、数据归属、truth invariant、public shell、identity/catalog query no-write、old material pollution 和 R6.4 写入边界。

### 13. R6.2 stop-review

| 检查项 | 结果 |
|---|---|
| 是否只固化 Step 6 框架,未提前写最终 TC 矩阵 | pass |
| 是否承接 Step 5 completed handoff | pass |
| 是否对齐 SOP Step 6 和书写规范 §5.6 | pass |
| 是否按 L1-governance 的框架深度建立批次和列结构 | pass |
| 是否保持 L3-method-library 领域事实来源于 `00/03/04` | pass |
| 是否明确数据、环境、自动化、evidence 和验收的后续 Step 归属 | pass |
| 是否建立 source blocker 暂停规则 | pass |
| 是否未修改正式 `05-测试方案.md` | pass |

next_allowed_action: 等待用户确认后进入 Step 6 `R6.3 definition truth / identity / catalog 用例:先思考`;只允许思考 FR-ML-001~002、BR-ML-001~004、数据归属、truth invariant、public shell、identity/catalog query no-write、old material pollution、候选用例族和 `R6.4 definition truth / identity / catalog 用例:再写入` 边界;不得直接修改正式 `05-测试方案.md`;不得写其他用例批次、测试数据 fixture、环境矩阵、CI suite、evidence schema、验收标准、实施计划或 implementation code。

---

## R6.3 definition truth / identity / catalog 用例:先思考

### 1. 当前模块目标

`R6.3` 只思考第一批用例的边界:FR-ML-001~002、BR-ML-001~004、数据归属、definition truth、identity/catalog、public shell、query no-write、body-free 和旧材料污染。

当前模块不写最终 TC 行、测试步骤、fixture、环境矩阵、CI suite、evidence schema、验收标准或实施计划。`R6.4` 才允许把本批次思考转成 `TC-ML-TRUTH-*` / `TC-ML-IDENTITY-*` / `TC-ML-CATALOG-*` 候选行。

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm_to_R6.4 |
| 用户确认 | 已确认从 `R6.2` 推进到 `R6.3`。 |
| 当前允许 | 思考 definition truth、identity/catalog、Definition vs Use、body-free、query no-write、旧材料污染和本批候选用例族。 |
| 当前禁止 | 修改正式 `05-测试方案.md`;写其他批次用例;写 fixture、CI gate、artifact path、JSON schema、正式 EV、验收 verdict 或 implementation code。 |

### 2. 本批次正式输入

| 输入 | 与 R6.3 的关系 | R6.3 裁决 |
|---|---|---|
| FR-ML-001 方法资产定义表达能力 | 方法资产定义必须能统一表达、识别和引用。 | 形成 definition truth 正向 / 负向 / body-free 候选用例族。 |
| FR-ML-002 方法资产身份与目录识别能力 | 方法资产必须具备稳定身份和目录语义。 | 形成 identity/catalog query 与目录状态候选用例族。 |
| BR-ML-001 | 定义真相必须归属 `L3-method-library`,不得退化为下游私有定义或散落文档。 | 用例必须断言 truth owner 和 source boundary。 |
| BR-ML-002 | 方法资产必须具备人类和系统可稳定识别的定义身份与适用语境。 | 用例必须覆盖身份、目录、适用语境和 safe absent。 |
| BR-ML-003 | Definition vs Use 必须成立,相邻仓只能按边界使用、执行、索引或展示。 | 用例必须覆盖下游不能反向替代定义 truth。 |
| BR-ML-004 | 已进入正式使用语境的方法资产版本语义稳定。 | 本批只覆盖身份 / 目录对版本稳定的前置,正式版本用例留 R6.5/R6.6。 |
| 数据归属与正文禁入 | 定义、身份目录、正式化版本、关系、追溯归本仓;外部正文和运行 truth 禁入。 | 本批覆盖 no raw body / no external body / no downstream runtime truth。 |
| `03-详细设计.md` §9~§12 | `MethodAssetDefinition`、`MethodAssetCatalogEntry`、read decision、view shell、Query no-write、stored surface 边界。 | 用例预期必须引用这些正式对象 / 状态 / 边界。 |
| `04-配置设计.md` §4 / §11 | 配置不得改变 truth owner、state transition、query no-write、marker source 或 body-free rule。 | 本批只记录 config redline 候选,具体配置用例留 R6.11/R6.12。 |

### 3. 场景拆分思考

| 场景族 | 正向方向 | 负向 / 边界方向 | 后续用例族 |
|---|---|---|---|
| definition truth invariant | `MethodAssetDefinition` 由正式 command / domain guard / basis summary 建立,truth owner 清晰。 | 缺身份、缺适用语境、外部正文入仓、下游 runtime truth 反向定义、旧 `MethodContent` 恢复。 | truth-definition candidate |
| catalog identity | `MethodAssetCatalogEntry` 表达 pending / visible / hidden / deprecated / retired 等目录状态,身份可被人类和系统稳定识别。 | catalog view 反写真相、目录项缺 source、identity/source mismatch、目录状态与 definition truth 混同。 | identity-catalog candidate |
| Definition vs Use guard | 本仓定义 source 与下游使用边界分离;下游只能消费 refs / summary / material。 | process、identity、governance、runtime、UI、artifact/archive 等相邻仓创建或替代定义 truth。 | definition-use-boundary candidate |
| public shell / body-free | public surface 只返回 typed refs、safe summary、marker、view shell;不承载 raw body。 | 保存外部标准正文、artifact body、provider payload、raw request/response、secret 或旧 snapshot/fingerprint。 | public-shell-body-free candidate |
| identity/catalog query no-write | Query 读取 committed truth、projection、summary、resolver output 后返回 visible / empty / not-visible / stale / degraded / unavailable surface。 | Query refresh material、append audit、publish event、start job、store query replay 或合成 marker。 | catalog-query-no-write candidate |
| old material pollution | 旧 `MethodContent`、publish、snapshot、fingerprint、old outbox/delivery 只作为 historical material。 | 用旧对象、旧状态、旧 snapshot / fingerprint 或旧 outbox 证明当前定义 truth。 | historical-pollution candidate |

### 4. 断言来源思考

| 断言点 | 正式来源 | R6.4 写入方式 |
|---|---|---|
| truth owner | BR-ML-001;`03` business truth state owner;`04` forbidden configurable boundary。 | 用例断言 definition truth 只能由正式 owner / command / repository 维护。 |
| identity stable | FR-ML-002;BR-ML-002;`MethodAssetCatalogEntry` 状态族。 | 用例断言身份、目录和适用语境可读且不被 view / raw route / downstream 私有模型替代。 |
| Definition vs Use | BR-ML-003;`DefinitionUseBoundaryGuard`;架构职责边界。 | 用例断言相邻仓输入只能形成 refs / summary / boundary decision,不能成为 definition truth。 |
| body-free | 数据归属;`ExternalBodyBoundaryRule`;observability / redaction 红线。 | 用例断言 raw external body、artifact body、provider payload、secret 不进入 truth / public shell / audit。 |
| catalog state source | `MethodAssetCatalogEntry` legal state source;visibility policy;repository safe result。 | 用例断言目录状态来自正式 source,不是 catalog view 反写或 query 自行合成。 |
| query no-write | `03` Query flow / persistence / repeatability;`04` query no-write 不可配置。 | 用例断言 query 不写 truth、material、audit、event、job、query replay。 |
| marker source | `03` read decision / degraded decision / freshness / availability marker rules。 | 用例断言 marker 只能复制 formal resolver / mapper / repository output;缺 source 时停审。 |
| historical pollution | `03` old material exclusion;Step 1/3/5 旧材料隔离。 | 用例断言旧 `MethodContent`、publish、snapshot、fingerprint、old outbox 不得作为当前正向断言。 |

### 5. 候选用例族思考

R6.3 不生成最终用例行,但先固定 R6.4 的候选族,避免 R6.4 写入时自由发挥。

| 候选族 | 覆盖意图 | R6.4 允许生成的候选 ID 范围 |
|---|---|---|
| truth-definition candidate | 方法资产定义可构造、非法定义拒绝、truth owner 清晰、body-free。 | `TC-ML-TRUTH-*` |
| identity-catalog candidate | 身份 / 目录语义可读、目录状态来源清晰、missing / hidden / deprecated 安全返回。 | `TC-ML-IDENTITY-*`;`TC-ML-CATALOG-*` |
| definition-use-boundary candidate | 下游 use 不迁移 definition truth,运行状态 / UI / artifact / governance 执行不入 truth。 | `TC-ML-BOUNDARY-*` |
| public-shell-body-free candidate | public shell、summary、view、audit 输出不得泄露 raw body / secret / provider payload。 | `TC-ML-SHELL-*`;`TC-ML-REDACTION-*` 的本批 body-free 子集 |
| catalog-query-no-write candidate | identity/catalog query visible / empty / not-visible / degraded / unavailable 分支保持 no-write。 | `TC-ML-QUERY-*` 的本批 identity/catalog 子集 |
| historical-pollution candidate | 旧 MethodContent / publish / snapshot / fingerprint / outbox 不得作为当前 truth 或断言来源。 | `TC-ML-POLLUTION-*` |

### 6. 数据 / 自动化 / evidence 后移思考

| 主题 | R6.3 可记录 | 后续承接 |
|---|---|---|
| 数据需求 | 需要 valid definition、invalid definition、catalog visible/hidden/deprecated、downstream use input、external body violation、query no-write spy 等数据需求。 | Step 7 固定 builders / fixtures / fault injection。 |
| 自动化候选 | 本批多数应为自动化候选,主发现层级为 domain / contract / application service。 | Step 9 固定 suite、command、required check。 |
| evidence 候选 | 可归入 definition-truth evidence、identity-catalog evidence、boundary evidence、query-no-write evidence、pollution evidence。 | Step 13 固定 EV ID、artifact/report schema 和 run-scoped path。 |
| 验收方向 | 支撑方法资产定义与目录识别、truth owner、禁止正文、Definition vs Use。 | Step 12 / 06 固定进入退出准则和 veto。 |

### 7. R6.4 写入边界思考

`R6.4 definition truth / identity / catalog 用例:再写入` 只能写本批次用例候选行。

允许写入:

1. 本批测试场景表。
2. `TC-ML-TRUTH-*` / `TC-ML-IDENTITY-*` / `TC-ML-CATALOG-*` / 本批 boundary / shell / query / pollution 候选行。
3. 每行的需求 / 规则来源、设计依据、前置条件、输入 / 操作、预期结果、断言点、自动化候选、证据候选和停审备注。
4. 本批数据 / 自动化 / evidence 后移记录。
5. 本批 stop-review 和 `R6.5 formal version / explicit change / state 用例:先思考` 进入门禁。

禁止写入:

1. R6.5 以后 formal version、state、controlled consumption、traceability、job、config 等其他批次用例。
2. 测试数据 fixture、seed JSON、DB 记录、环境矩阵、CI suite、script command。
3. 正式 evidence ID、artifact path、JSON schema、report schema、验收 gate 或实施计划。
4. 任何未在 `03/04` 闭合的 field、state、mapper、marker source、port 或 config key。

### 8. R6.3 stop-review

| 检查项 | 结果 |
|---|---|
| 是否只思考 definition truth / identity / catalog 批次 | pass |
| 是否承接 FR-ML-001~002 和 BR-ML-001~004 | pass |
| 是否纳入数据归属、Definition vs Use、body-free 和 query no-write | pass |
| 是否未生成最终 TC 行 | pass |
| 是否未写测试数据、环境、CI、evidence schema、验收或实施内容 | pass |
| 是否明确旧 MethodContent / publish / snapshot / fingerprint / outbox 污染禁入 | pass |
| 是否形成 R6.4 写入边界 | pass |
| 是否未修改正式 `05-测试方案.md` | pass |

next_allowed_action: 等待用户确认后进入 Step 6 `R6.4 definition truth / identity / catalog 用例:再写入`;只允许写入本批测试场景表、`TC-ML-TRUTH-*` / `TC-ML-IDENTITY-*` / `TC-ML-CATALOG-*` / 本批 boundary / shell / query / pollution 候选用例行、本批数据 / 自动化 / evidence 后移记录、本批 stop-review 和 `R6.5 formal version / explicit change / state 用例:先思考` 进入门禁;不得直接修改正式 `05-测试方案.md`;不得写其他批次用例、fixture、环境矩阵、CI suite、evidence schema、验收标准、实施计划或 implementation code。

---

## R6.4 definition truth / identity / catalog 用例:再写入

### 1. 当前模块状态

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm_to_R6.5 |
| 用户确认 | 已确认从 `R6.3` 推进到 `R6.4`。 |
| 本模块写入范围 | 本批测试场景表、definition truth / identity / catalog / boundary / shell / query / pollution 候选用例行、数据 / 自动化 / evidence 后移记录、本批 stop-review、`R6.5` 进入门禁。 |
| 本模块禁止范围 | 正式 `05-测试方案.md` 正文、formal version / state / controlled consumption / trace / job / config 等后续批次用例、fixture、环境矩阵、CI suite、evidence schema、验收标准、实施计划和 implementation code。 |

### 2. 本批测试场景表

| 场景族 | 覆盖需求 / 规则 | 设计依据 | 本批用例目标 |
|---|---|---|---|
| definition truth invariant | FR-ML-001;BR-ML-001;数据归属 | `MethodAssetDefinition`;business truth state owner;Command accepted mutation | 验证定义 truth 可由正式路径建立,非法定义 / 外部正文 / 下游反写被拒绝。 |
| identity / catalog stable read | FR-ML-002;BR-ML-002 | `MethodAssetCatalogEntry`;read decision;view shell | 验证身份、目录、适用语境可安全读取,missing / hidden / deprecated 不产生私有 truth。 |
| Definition vs Use boundary | BR-ML-003;数据归属 | `DefinitionUseBoundaryGuard`;DownstreamConsumptionBoundary | 验证下游 use 只能形成 refs / summary / boundary decision,不能替代 definition truth。 |
| public shell / body-free | FR-ML-001~002;BR-ML-001~003;NFR-ML-007~008 | `ExternalBodyBoundaryRule`;public shell;redaction boundary | 验证 public shell、summary、view 和 audit 只包含 safe refs / marker,不泄露 raw body。 |
| identity/catalog query no-write | FR-ML-002;BR-ML-002;NFR-ML-013~016 | Query flow;read decision;degraded decision;Query no-write | 验证 visible / empty / not-visible / degraded / unavailable 分支均不写 truth、audit、event 或 job。 |
| historical pollution guard | 全部本批规则 | old material exclusion;historical material isolation | 验证旧 `MethodContent` / publish / snapshot / fingerprint / old outbox 不得作为当前断言来源。 |

### 3. 本批用例矩阵

| 用例 ID | 场景 | 优先级 | 需求 / 规则来源 | 设计依据 | 前置条件 | 输入 / 操作 | 预期结果 | 断言点 | 自动化候选 | 证据候选 | 停审备注 |
|---|---|---|---|---|---|---|---|---|---|---|---|
| TC-ML-TRUTH-001 | MethodAssetDefinition 正向建立 | P0 | FR-ML-001;BR-ML-001 | `MethodAssetDefinition`;Command accepted mutation;business truth owner | 有合法定义身份、适用语境、basis summary 和 expected version | 调用 definition/catalog command family 的 accepted path | definition truth 被保存为正式 business truth;stored result / body-free candidate refs 可承接 | truth owner 是 L3-method-library;accepted truth/support/material 在 logical UoW 中提交;无 raw body | 是 | definition-truth evidence candidate | fixture 留 Step 7;具体 suite 留 Step 9 |
| TC-ML-TRUTH-002 | 缺稳定身份或适用语境的定义被拒绝 | P0 | FR-ML-001~002;BR-ML-002 | `MethodAssetDefinition`;domain guard;protocol rejection | 构造缺 stable identity 或 applicability context 的 definition intent | 调用 definition command family rejected path | 返回 safe rejection;不创建 definition truth、catalog entry、stored accepted result 或 event candidate | rejected path 不留下 accepted replay surface;错误使用正式 safe surface | 是 | definition-negative evidence candidate | 具体 invalid builders 留 Step 7 |
| TC-ML-TRUTH-003 | 外部正文 / artifact body 不进入 definition truth | P0 | FR-ML-001;BR-ML-001;数据归属;NFR-ML-007~008 | `ExternalBodyBoundaryRule`;body-free rule;redaction boundary | 有外部标准正文、artifact body 或 provider payload 输入尝试 | 提交包含 raw body 的 definition / source summary intent | 请求被拒绝或进入 body-boundary violation;truth 仅允许 safe refs / summary refs | truth、public shell、audit、diagnostic 均不包含 raw body / secret / provider payload | 是 | body-free evidence candidate | 红线扫描细节留 Step 9 / Step 13 |
| TC-ML-TRUTH-004 | 下游运行状态不能反向定义 MethodAssetDefinition | P0 | BR-ML-001;BR-ML-003;数据归属 | `DefinitionUseBoundaryGuard`;business truth owner | 有 process / identity / runtime / UI / artifact 等下游 use 输入 | 通过下游 use 输入尝试创建或更新 definition truth | 下游输入只能形成 boundary decision、safe ref 或 rejection;不能保存 definition truth | no downstream runtime truth;无 sibling 私有模型替代 definition | 是 | boundary evidence candidate | cross-repo fixture 留 Step 7/P1 seam |
| TC-ML-IDENTITY-001 | MethodAssetCatalogEntry 正向读取身份与目录 | P0 | FR-ML-002;BR-ML-002 | `MethodAssetCatalogEntry`;read decision;view shell | 已存在正式 definition truth 和对应 catalog entry visible 状态 | 执行 identity/catalog query visible 分支 | 返回 safe view shell,包含身份、目录语义、适用语境和 marker/ref | Query 只复制 repository / resolver 输出;不创建新 catalog truth | 是 | identity-catalog evidence candidate | 具体 query selector 留 Step 7/9 |
| TC-ML-IDENTITY-002 | identity/catalog missing 返回 safe absent | P0 | FR-ML-002;BR-ML-002 | read decision;safe absent surface;Query repeatability | 查询不存在或不可解析的 identity/catalog selector | 执行 identity/catalog query missing 分支 | 返回 empty / safe-absent / not-visible 等正式 public surface | 不合成 identity ref、visibility marker、catalog entry 或 audit record | 是 | identity-absent evidence candidate | marker source 缺失时按 design blocker 暂停 |
| TC-ML-CATALOG-001 | catalog 状态来源清晰 | P0 | FR-ML-002;BR-ML-002;BR-ML-004 | `MethodAssetCatalogEntry` state family;visibility policy | catalog entry 处于 pending / visible / hidden / deprecated / retired 之一 | 执行目录状态读取或正式 catalog command transition | 返回或迁移到正式 catalog 状态;状态来源可追溯 | 状态来自 definition change、catalog command 或 visibility policy;不是 view 反写 | 是 | catalog-state evidence candidate | formal version 稳定语义细化留 R6.5/R6.6 |
| TC-ML-CATALOG-002 | catalog view 不能反写真相 | P0 | BR-ML-001~003;NFR-ML-013~016 | catalog truth boundary;Query no-write | 已存在 stale / partial / unavailable catalog view | 执行 catalog read 或 view assembly | 返回 stale / degraded / unavailable safe surface | view/query 不保存 catalog truth、不刷新 material、不 append audit、不 publish event | 是 | catalog-no-write evidence candidate | write-audit helper 留 Step 9 |
| TC-ML-BOUNDARY-001 | Definition vs Use guard 阻止使用方替代定义 | P0 | BR-ML-003;FR-ML-005 前置边界 | `DefinitionUseBoundaryGuard`;DownstreamConsumptionBoundary | 下游消费方提供 refs / summary / runtime use context | 通过 boundary guard 检查下游 use 输入 | allowed / blocked / violation-detected / manual-review 之一;不改 definition truth | guard 输出只作为 decision / marker;downstream use 不拥有定义 lifecycle | 是 | definition-use-boundary evidence candidate | 完整 controlled consumption 用例留 R6.7/R6.8 |
| TC-ML-SHELL-001 | public shell 只暴露 safe refs / marker | P0 | FR-ML-001~002;BR-ML-001~003;NFR-ML-007~008 | public shell;view shell;redaction boundary | 有 definition truth、catalog entry、source refs 和 safe marker | 组装 definition / catalog public surface | response 只包含 typed refs、safe summary、marker、state category | 无 raw external body、artifact body、provider payload、secret、private adapter state | 是 | public-shell evidence candidate | 具体 response DTO 字段以 `03` protocol 为准 |
| TC-ML-QUERY-001 | identity/catalog query visible / empty / degraded 均 no-write | P0 | FR-ML-002;NFR-ML-013~016 | Query flow;read decision;degraded decision;Query repeatability | 准备 visible、empty、not-visible、degraded、unavailable 等 read surface 输入 | 重复执行 identity/catalog query family | 每次返回 formal safe surface;不会修复、刷新、写入或启动 job | 无 truth write、material repair、audit append、event candidate、job start、query replay | 是 | query-no-write evidence candidate | 具体 write spy 留 Step 9 |
| TC-ML-POLLUTION-001 | 旧 MethodContent / publish / snapshot / fingerprint / outbox 不得作为断言来源 | P0 | historical material isolation;BR-ML-001~004 | old material exclusion;Step 1 / Step 3 / Step 5 isolation | 旧材料中存在 MethodContent、publish、snapshot、fingerprint、old outbox 词条或样例 | 设计审计 / 用例审计检查旧主线引用 | 当前用例和断言只引用 `MethodAssetDefinition`、`MethodAssetCatalogEntry` 等正式对象 | 旧对象不能证明 truth、版本、catalog、query、event 或 evidence;命中即停审 | 是 | pollution-guard evidence candidate | 作为跨用例审计输入延续到 R6.13/R6.14 |

### 4. 本批数据 / 自动化 / evidence 后移记录

| 后移项 | 本批记录 | 后续 Step |
|---|---|---|
| 数据构造 | valid / invalid definition intent、catalog visible / hidden / deprecated / retired、missing selector、downstream use input、external body violation、stale/degraded read surface。 | Step 7 测试数据设计。 |
| 自动化位置 | domain / contract 覆盖 definition invariant 和 body-free guard;application service 覆盖 command/query no-write;release gate 只承接污染和 redaction 摘要。 | Step 9 自动化与 CI/CD 门禁。 |
| evidence 候选 | definition-truth、identity-catalog、catalog-state、boundary、public-shell、query-no-write、pollution-guard evidence candidate。 | Step 13 测试报告与证据归档。 |
| 环境能力 | 需要 fake repository write spy、safe resolver / degraded mapper output、redaction scan 能力。 | Step 8 环境与配置矩阵;Step 9 automation gate。 |
| 验收承接 | 支撑方法资产定义表达、身份目录识别、truth owner、Definition vs Use、禁止正文边界。 | Step 12 / `06-验收标准.md`。 |

### 5. 本批停审

| 停审项 | 结论 | 说明 |
|---|---|---|
| 是否覆盖 FR-ML-001~002 | pass | definition truth、identity/catalog、public shell 和 query no-write 均有候选用例。 |
| 是否覆盖 BR-ML-001~004 的本批边界 | pass | BR-ML-004 的正式版本稳定细节留 R6.5/R6.6,本批只覆盖 identity/catalog 对稳定版本的前置。 |
| 是否每个用例有正式设计依据 | pass | 均回指 `MethodAssetDefinition`、`MethodAssetCatalogEntry`、boundary guard、body-free rule、read decision 或 Query no-write。 |
| 是否避免旧材料污染 | pass | `TC-ML-POLLUTION-001` 明确把旧 MethodContent / publish / snapshot / fingerprint / outbox 作为禁入检查。 |
| 是否未写 fixture / CI / evidence schema | pass | 只写数据需求、自动化候选和 evidence candidate。 |
| 是否未修改正式 `05-测试方案.md` | pass | 本批只更新中间产物。 |

### 6. R6.5 进入门禁

| 门禁项 | 裁决 |
|---|---|
| R6.4 是否已生成本批测试场景表 | pass |
| R6.4 是否已生成本批候选用例矩阵 | pass |
| R6.4 是否已记录数据 / 自动化 / evidence 后移 | pass |
| R6.4 是否已完成本批停审 | pass |
| 是否未写后续批次用例 | pass |
| 是否未修改正式 `05-测试方案.md` | pass |

next_allowed_action: 等待用户确认后进入 Step 6 `R6.5 formal version / explicit change / state 用例:先思考`;只允许思考 FR-ML-003~004、BR-ML-004、BR-ML-009~011、formalization state、formal version boundary、explicit change、illegal transition、duplicate replay、stored surface 和 `R6.6 formal version / explicit change / state 用例:再写入` 边界;不得直接修改正式 `05-测试方案.md`;不得写 controlled consumption、traceability、job、config 等后续批次用例;不得写 fixture、环境矩阵、CI suite、evidence schema、验收标准、实施计划或 implementation code。

---

## R6.5 formal version / explicit change / state 用例:先思考

### 1. 当前模块目标

`R6.5` 只思考第二批用例的边界:FR-ML-003~004、BR-ML-004、BR-ML-009~011、formalization state、formal version boundary、explicit change、illegal transition、duplicate replay、stored surface 和 R6.6 写入边界。

当前模块不生成最终 TC 行,不写测试数据 fixture、环境矩阵、CI suite、evidence schema、验收标准或实施计划。`R6.6` 才允许把本批思考转成 `TC-ML-FORMALIZATION-*` / `TC-ML-VERSION-*` / `TC-ML-STATE-*` / `TC-ML-IDEMP-*` 候选用例行。

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm_to_R6.6 |
| 用户确认 | 已确认从 `R6.4` 推进到 `R6.5`。 |
| 当前允许 | 思考正式化、正式版本、显式变化、状态合法 / 非法迁移、duplicate replay、stored surface、commit unknown 和 R6.6 写入边界。 |
| 当前禁止 | 修改正式 `05-测试方案.md`;写 controlled consumption、traceability、job、config 等后续批次用例;写 fixture、CI gate、artifact path、JSON schema、正式 EV、验收 verdict 或 implementation code。 |

### 2. 本批次正式输入

| 输入 | 与 R6.5 的关系 | R6.5 裁决 |
|---|---|---|
| FR-ML-003 方法资产正式化能力 | 方法资产要能进入正式使用语境,并与仍在调整的定义区分。 | 形成 formalization accepted / rejected / blocked / governance-basis 边界候选。 |
| FR-ML-004 正式版本边界能力 | 正式方法资产要有稳定版本边界,使用方可判断是否引用正式版本。 | 形成 formal version current / superseded / retired 和 semantic-change 候选。 |
| BR-ML-004 | 已进入正式使用语境的方法资产必须保持版本语义稳定。 | 用例必须覆盖 existing formal reference 不被静默覆盖。 |
| BR-ML-009 | 从非正式到正式必须通过显式正式化,不得由读取、引用、同步或运行时使用隐式触发。 | 用例必须覆盖 no implicit formalization。 |
| BR-ML-010 | 改变正式版本语义必须显式形成新版本或等价正式变化口径。 | 用例必须覆盖 no silent semantic overwrite。 |
| BR-ML-011 | 可能影响既有下游消费的变化必须显式识别。 | 本批只覆盖影响变化的显式识别入口,完整消费影响用例留 R6.7/R6.8 或 R6.9/R6.10。 |
| `03-详细设计.md` state / flow | `FormalizationState`、`FormalMethodAssetVersion`、accepted/rejected/duplicate flow、UoW、stored result。 | 用例预期必须引用正式 state、flow 和 stored surface。 |
| `04-配置设计.md` forbidden boundary | config 不得改变 state transition、stored replay、truth owner 或 marker source。 | 本批记录 config redline 候选,具体 config 用例留 R6.11/R6.12。 |

### 3. 场景拆分思考

| 场景族 | 正向方向 | 负向 / 边界方向 | 后续用例族 |
|---|---|---|---|
| formalization state | `FormalizationState` 从 not-started / in-review 通过正式 command、basis eligibility 和 policy diagnostic 进入 accepted / rejected / blocked。 | raw source body 直接 accepted、query/use/sync 隐式 formalize、治理执行正文迁入本仓。 | formalization-state candidate |
| formal version boundary | `FormalMethodAssetVersion` candidate / current / superseded / retired 由正式版本命令、basis refs 和 version repository 驱动。 | latest timestamp、fingerprint、raw artifact body 或下游引用生成版本。 | formal-version candidate |
| explicit semantic change | 版本语义变化必须形成新 version 或正式 change record,既有 current 不被覆盖。 | 静默覆盖 existing current、改写历史版本、用 catalog view / material refresh 替代变化。 | explicit-change candidate |
| illegal transition | terminal 或不合法 state transition 返回 formal error / rejection,且没有成功副作用。 | 状态名漂移、全局 Active/Available 混用、config 放宽 transition。 | state-illegal candidate |
| duplicate replay | same key + same digest + completed 只能 replay stored result / rejection / effect summary。 | duplicate 重跑 mutation、从 current truth 重建 response、stored surface missing 后伪成功。 | duplicate-replay candidate |
| conflict / in-flight / commit unknown | same key different digest conflict;in-flight retryable/blocked;commit unknown 只能靠 stored surface/read-back/formal recovery 判断。 | timeout/log/current truth/adapter note 直接判成功;hidden retry 二次写 truth。 | consistency-recovery candidate |

### 4. 断言来源思考

| 断言点 | 正式来源 | R6.6 写入方式 |
|---|---|---|
| formalization state source | `FormalizationState`;formalization command;basis eligibility;policy diagnostic。 | 用例断言正式化只能由正式 command 和 basis / policy 输出触发。 |
| formal version state source | `FormalMethodAssetVersion`;version repository;basis refs。 | 用例断言版本状态由正式 version command / repository 管理。 |
| no implicit formalization | BR-ML-009;Query no-write;Definition vs Use。 | 用例断言读取、引用、同步、运行时使用不能触发 formalization。 |
| no silent semantic overwrite | BR-ML-004;BR-ML-010;formal version boundary。 | 用例断言 existing current / formal ref 不被直接覆写,语义变化必须显式。 |
| affected-consumption signal | BR-ML-011;ConsumptionImpactSummary;trace / audit refs。 | 本批只写显式识别候选,完整 trace / impact 用例后移。 |
| illegal transition | state transition guard;Domain / Application / Protocol rejection。 | 用例断言非法迁移没有 accepted truth、stored accepted result、candidate 或 audit success。 |
| stored replay | `MethodAssetStoredOperationResult`;idempotency guard;stored surface。 | 用例断言 duplicate 只读 stored result / rejection / effect,不 rerun。 |
| consistency failure | stored surface missing / wrong kind / unreadable;manual / consistency surface。 | 用例断言 missing stored surface 不从 current truth 重建 response。 |
| config redline | `04` static design boundary;stored replay / state transition 不可配置。 | 用例只记录候选,具体 config redline 后移。 |

### 5. 候选用例族思考

| 候选族 | 覆盖意图 | R6.6 允许生成的候选 ID 范围 |
|---|---|---|
| formalization-state candidate | 正式化 accepted/rejected/blocked、basis eligibility、治理摘要 / 引用边界。 | `TC-ML-FORMALIZATION-*` |
| formal-version candidate | candidate/current/superseded/retired、版本稳定、正式引用判断。 | `TC-ML-VERSION-*` |
| explicit-change candidate | 显式版本语义变化、消费影响识别入口、no silent overwrite。 | `TC-ML-CHANGE-*` |
| state-illegal candidate | 非法迁移、terminal guard、config 不放宽状态迁移。 | `TC-ML-STATE-*` |
| duplicate-replay candidate | same digest replay、different digest conflict、in-flight、stored surface missing。 | `TC-ML-IDEMP-*` |
| consistency-recovery candidate | commit unknown、rollback、version conflict、no current-truth rebuild。 | `TC-ML-RECOVERY-*` 的本批子集 |

### 6. 数据 / 自动化 / evidence 后移思考

| 主题 | R6.5 可记录 | 后续承接 |
|---|---|---|
| 数据需求 | 需要 formalization not-started/in-review/accepted/rejected/blocked、version candidate/current/superseded/retired、same/different digest、missing stored surface、version conflict、commit unknown 等数据需求。 | Step 7 固定 builders / fixtures / fault injection。 |
| 自动化候选 | 本批多数应为 application service + fake persistence 自动化;state guard 可在 domain / contract 层补充。 | Step 9 固定 suite、command、required check。 |
| evidence 候选 | formalization evidence、formal-version evidence、explicit-change evidence、state evidence、replay evidence、consistency evidence。 | Step 13 固定 EV ID、artifact/report schema 和 run-scoped path。 |
| 验收方向 | 支撑正式化、正式版本稳定、显式变化、幂等与一致性优先。 | Step 12 / `06-验收标准.md` 固定 entry / exit / veto。 |

### 7. R6.6 写入边界思考

`R6.6 formal version / explicit change / state 用例:再写入` 只能写本批候选用例行。

允许写入:

1. 本批测试场景表。
2. `TC-ML-FORMALIZATION-*` / `TC-ML-VERSION-*` / `TC-ML-CHANGE-*` / `TC-ML-STATE-*` / `TC-ML-IDEMP-*` / 本批 recovery 候选用例行。
3. 每行的需求 / 规则来源、设计依据、前置条件、输入 / 操作、预期结果、断言点、自动化候选、证据候选和停审备注。
4. 本批数据 / 自动化 / evidence 后移记录。
5. 本批 stop-review 和 `R6.7 controlled consumption / distribution / seam 用例:先思考` 进入门禁。

禁止写入:

1. controlled consumption、distribution、traceability、job、config、observability 等后续批次用例。
2. 测试数据 fixture、seed JSON、DB 记录、环境矩阵、CI suite、script command。
3. 正式 evidence ID、artifact path、JSON schema、report schema、验收 gate 或实施计划。
4. 未在 `03/04` 闭合的 state、error、replay surface、mapper、marker source、port 或 config key。

### 8. R6.5 stop-review

| 检查项 | 结果 |
|---|---|
| 是否只思考 formal version / explicit change / state 批次 | pass |
| 是否承接 FR-ML-003~004 和 BR-ML-004 / 009~011 | pass |
| 是否纳入 formalization state、formal version、illegal transition、duplicate replay 和 stored surface | pass |
| 是否未生成最终 TC 行 | pass |
| 是否未写测试数据、环境、CI、evidence schema、验收或实施内容 | pass |
| 是否形成 R6.6 写入边界 | pass |
| 是否未修改正式 `05-测试方案.md` | pass |

next_allowed_action: 等待用户确认后进入 Step 6 `R6.6 formal version / explicit change / state 用例:再写入`;只允许写入本批测试场景表、`TC-ML-FORMALIZATION-*` / `TC-ML-VERSION-*` / `TC-ML-CHANGE-*` / `TC-ML-STATE-*` / `TC-ML-IDEMP-*` / 本批 recovery 候选用例行、本批数据 / 自动化 / evidence 后移记录、本批 stop-review 和 `R6.7 controlled consumption / distribution / seam 用例:先思考` 进入门禁;不得直接修改正式 `05-测试方案.md`;不得写 controlled consumption、traceability、job、config 等后续批次用例;不得写 fixture、环境矩阵、CI suite、evidence schema、验收标准、实施计划或 implementation code。

---

## R6.6 formal version / explicit change / state 用例:再写入

### 1. 当前模块状态

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm_to_R6.7 |
| 用户确认 | 已确认从 `R6.5` 推进到 `R6.6`。 |
| 本模块写入范围 | 本批测试场景表、formalization / formal version / explicit change / state / idempotency / recovery 候选用例行、数据 / 自动化 / evidence 后移记录、本批 stop-review、`R6.7` 进入门禁。 |
| 本模块禁止范围 | 正式 `05-测试方案.md` 正文、controlled consumption / traceability / job / config / observability 等后续批次用例、fixture、环境矩阵、CI suite、evidence schema、验收标准、实施计划和 implementation code。 |

### 2. 本批测试场景表

| 场景族 | 覆盖需求 / 规则 | 设计依据 | 本批用例目标 |
|---|---|---|---|
| formalization state | FR-ML-003;BR-ML-009 | `FormalizationState`;formalization command;basis eligibility;policy diagnostic | 验证正式化只能由正式命令和 basis / policy 输出触发,不能由读取、同步、使用隐式触发。 |
| formal version boundary | FR-ML-004;BR-ML-004 | `FormalMethodAssetVersion`;version repository;basis refs | 验证 candidate/current/superseded/retired 状态来源清晰,正式引用可判断。 |
| explicit semantic change | BR-ML-010;BR-ML-011 | formal version boundary;ConsumptionImpactSummary;trace/audit refs | 验证语义变化必须显式形成新版本或等价正式变化口径,并识别消费影响入口。 |
| illegal transition | BR-ML-004;BR-ML-009~011 | state transition guard;formal rejection surface | 验证非法迁移和 terminal guard 不产生 accepted truth / stored accepted result / event candidate。 |
| duplicate replay / conflict | NFR-ML-012~014;Step 3 replay cut | `MethodAssetStoredOperationResult`;idempotency guard;stored surface | 验证 same digest replay stored surface,different digest conflict,stored surface missing 不重建响应。 |
| commit unknown / version conflict | NFR-ML-012~014;Step 3 transaction cut | UoW;expected version;commit unknown recovery source | 验证 commit unknown 和 version conflict 不通过 timeout/log/current truth 私判成功。 |

### 3. 本批用例矩阵

| 用例 ID | 场景 | 优先级 | 需求 / 规则来源 | 设计依据 | 前置条件 | 输入 / 操作 | 预期结果 | 断言点 | 自动化候选 | 证据候选 | 停审备注 |
|---|---|---|---|---|---|---|---|---|---|---|---|
| TC-ML-FORMALIZATION-001 | 方法资产显式正式化 accepted | P0 | FR-ML-003;BR-ML-009 | `FormalizationState`;formalization command;basis eligibility;policy diagnostic;accepted UoW | definition 已存在且 eligibility / basis summary 满足正式化条件 | 调用 formalization command accepted path | `FormalizationState` 进入 accepted 或等价正式 accepted surface;stored result 保存;body-free candidate refs 可承接 | 正式化只能由 command 触发;accepted truth/support/material 与 stored result 在 logical UoW 中提交 | 是 | formalization evidence candidate | governance basis 只用摘要 / 引用,不迁入治理执行正文 |
| TC-ML-FORMALIZATION-002 | 不满足 basis 的正式化被 rejected / blocked | P0 | FR-ML-003;BR-ML-009;BR-ML-019 | `FormalizationState`;basis eligibility;policy diagnostic;safe rejection | definition 存在但治理摘要缺失、basis rejected 或 eligibility blocked | 调用 formalization command rejected / blocked path | 返回 safe rejection / blocked surface;不生成 formal version current | 无 accepted truth、stored accepted result、event candidate 或正式 version ref | 是 | formalization-negative evidence candidate | 具体 basis fixture 留 Step 7 |
| TC-ML-FORMALIZATION-003 | 读取 / 引用 / 同步不能隐式正式化 | P0 | BR-ML-009;NFR-ML-013~016 | Query no-write;Definition vs Use;formalization state owner | definition 仍处于 draft/proposed 或 formalization not-started/in-review | 执行 query、下游引用检查或同步类读取 | 返回 safe read / not-formal / unavailable surface;formalization state 不变 | 无 formalization write、version write、audit accepted fact、event candidate 或 stored accepted result | 是 | no-implicit-formalization evidence candidate | controlled consumption 完整场景留 R6.7/R6.8 |
| TC-ML-FORMALIZATION-004 | raw source body 不能直接决定 accepted | P0 | FR-ML-003;NFR-ML-007~008;数据归属 | `FormalizationBasisSummary`;`ExternalBodyBoundaryRule`;body-free rule | 外部治理或标准材料带 raw body / provider payload | 尝试以 raw body 作为正式化依据 | 请求被拒绝或进入 body-boundary violation;formalization 不 accepted | basis 只能是 safe refs / digest / summary refs;raw body 不进入 truth、audit、stored result | 是 | formalization-body-free evidence candidate | redaction 扫描细节留 Step 9 / Step 13 |
| TC-ML-VERSION-001 | 建立 FormalMethodAssetVersion current | P0 | FR-ML-004;BR-ML-004 | `FormalMethodAssetVersion`;version repository;basis refs | 已 accepted formalization;version candidate 可建立 | 调用 formal version establish command | candidate 成为 current;正式引用可判断为 current | version state 来源为正式 command / repository / basis refs;不用 timestamp、fingerprint 或 raw artifact body 生成 | 是 | formal-version evidence candidate | 具体 version builder 留 Step 7 |
| TC-ML-VERSION-002 | 语义变化必须创建新版本或显式变化口径 | P0 | FR-ML-004;BR-ML-010 | `FormalMethodAssetVersion`;semantic change boundary;expected version | 已存在 current formal version;输入包含改变版本语义的变化 | 调用 explicit semantic change / new version path | 形成新 candidate/current 或等价正式变化记录;旧 current 不被静默覆写 | existing formal ref 语义不变;历史版本不被 in-place rewrite;变化可追溯 | 是 | version-change evidence candidate | trace 细化留 R6.9/R6.10 |
| TC-ML-VERSION-003 | superseded / retired 版本可判定且不可作为 current | P0 | FR-ML-004;BR-ML-004;BR-ML-010 | `FormalMethodAssetVersion` state family | 准备 current、superseded、retired 版本状态 | 执行版本引用判断或读取 | 返回 current / superseded / retired 的 safe surface | superseded / retired 不被当作 current;不会通过 latest timestamp 反推 current | 是 | version-boundary evidence candidate | 下游消费判断细节留 R6.7/R6.8 |
| TC-ML-CHANGE-001 | 可能影响既有消费的变化必须显式识别 | P0 | BR-ML-011;FR-ML-008 前置边界 | ConsumptionImpactSummary;trace/audit refs;explicit change rule | 输入变化可能影响已存在 formal consumer refs | 执行显式变化识别入口 | 输出 impact candidate / summary ref / manual-review marker 等正式 surface | 影响识别不隐藏在实现细节或人工约定中;不直接修 downstream truth | 是 | explicit-impact evidence candidate | 完整 impact / trace 用例留 R6.9/R6.10 |
| TC-ML-STATE-001 | accepted 后非法回退被拒绝 | P0 | BR-ML-004;BR-ML-009 | `FormalizationState`;state transition guard;safe rejection | `FormalizationState` 已 accepted | 尝试回退到 not-started / in-review 或重复 accepted 不合法迁移 | 返回 formal rejection / invalid transition surface | 无 accepted truth rewrite、stored accepted result、event candidate、audit success | 是 | state-illegal evidence candidate | 具体 error 名以 `03` 正式 surface 为准 |
| TC-ML-STATE-002 | formal version terminal guard | P0 | BR-ML-004;BR-ML-010 | `FormalMethodAssetVersion`;state transition guard | version 已 superseded / retired | 尝试把 terminal version 直接改回 current | 返回 invalid transition / rejection surface | terminal version 不被原地复活;必须走正式 new version / explicit change path | 是 | version-state evidence candidate | config 放宽状态迁移留 R6.11/R6.12 redline |
| TC-ML-IDEMP-001 | duplicate same digest replay stored accepted result | P0 | NFR-ML-012~014;BR-ML-009~010 | idempotency guard;`MethodAssetStoredOperationResult`;stored surface | formalization / version command 已 completed 且 stored result 可读 | 使用同一 operation key + same digest 重放 | 返回 stored accepted result / effect summary;不重跑 mutation | repository save、event candidate assembly、audit accepted fact 不重复执行 | 是 | replay evidence candidate | fault spy / call count 留 Step 7/9 |
| TC-ML-IDEMP-002 | duplicate same key different digest 返回 conflict | P0 | NFR-ML-012~014;BR-ML-010 | idempotency guard;digest conflict surface | 已存在同 operation key completed 记录 | 使用 same key + different digest 重放 | 返回 conflict safe surface | 不覆盖原 stored result;不接受第二 mutation;不改 formal version truth | 是 | digest-conflict evidence candidate | digest builder 留 Step 7 |
| TC-ML-IDEMP-003 | stored surface missing 不从 current truth 重建响应 | P0 | NFR-ML-012~014;BR-ML-004 | stored replay surface;manual / consistency failure | idempotency completed 记录存在,但 stored result missing / wrong kind / unreadable | 重放同 key + same digest | 返回 consistency / manual safe surface | 不从 current truth、logs、adapter note 或 query surface 重建 command response | 是 | stored-surface-missing evidence candidate | raw artifact/report schema 留 Step 13 |
| TC-ML-RECOVERY-001 | commit unknown 不私判成功 | P0 | NFR-ML-012~014;BR-ML-004 | UoW;commit unknown recovery source;stored surface / read-back | formalization 或 version command commit 返回 unknown | 重试或恢复同 operation key | 只能依据 stored surface、formal read-back 或正式 recovery source 判定 | timeout、log、current truth snapshot 或 adapter note 不能直接宣称 accepted | 是 | commit-unknown evidence candidate | fault injection 留 Step 7 |
| TC-ML-RECOVERY-002 | expected version conflict 防止 lost update | P0 | BR-ML-004;BR-ML-010;NFR-ML-014 | expected version;versioned repository;state transition guard | 两个写路径加载同一 formalization / version expected version | 并发保存 semantic change / formal version transition | 一个成功,另一个得到 version conflict / reload-required safe surface | 不发生 lost update;失败路径不保存 accepted replay surface 或 event candidate | 是 | version-conflict evidence candidate | 并发模拟留 Step 7/9 |

### 4. 本批数据 / 自动化 / evidence 后移记录

| 后移项 | 本批记录 | 后续 Step |
|---|---|---|
| 数据构造 | formalization not-started / in-review / accepted / rejected / blocked、version candidate / current / superseded / retired、same/different digest、missing stored result、commit unknown、expected version conflict。 | Step 7 测试数据设计。 |
| 自动化位置 | application service + fake persistence 覆盖 accepted/rejected/duplicate/recovery;domain / contract 层覆盖状态 guard 和 protocol rejection。 | Step 9 自动化与 CI/CD 门禁。 |
| evidence 候选 | formalization、formal-version、explicit-change、state-illegal、replay、digest-conflict、stored-surface-missing、commit-unknown、version-conflict evidence candidate。 | Step 13 测试报告与证据归档。 |
| 环境能力 | 需要 fake UoW、idempotency store、stored result store、versioned repository、fault injection 和 write/call spy。 | Step 8 环境与配置矩阵;Step 9 automation gate。 |
| 验收承接 | 支撑正式化、正式版本稳定、显式变化、幂等和一致性优先。 | Step 12 / `06-验收标准.md`。 |

### 5. 本批停审

| 停审项 | 结论 | 说明 |
|---|---|---|
| 是否覆盖 FR-ML-003~004 | pass | 正式化、正式版本、语义变化、版本引用判断均有候选用例。 |
| 是否覆盖 BR-ML-004 / 009~011 | pass | no implicit formalization、no silent overwrite、impact explicit identification 均已覆盖。 |
| 是否覆盖 state / replay / recovery 风险 | pass | 非法迁移、duplicate replay、digest conflict、stored surface missing、commit unknown、version conflict 均已覆盖。 |
| 是否每个用例有正式设计依据 | pass | 均回指 `FormalizationState`、`FormalMethodAssetVersion`、idempotency guard、stored surface、UoW 或 expected version。 |
| 是否未写后续批次内容 | pass | controlled consumption、traceability、job、config 仅作为后续承接或停审备注。 |
| 是否未写 fixture / CI / evidence schema | pass | 只写数据需求、自动化候选和 evidence candidate。 |
| 是否未修改正式 `05-测试方案.md` | pass | 本批只更新中间产物。 |

### 6. R6.7 进入门禁

| 门禁项 | 裁决 |
|---|---|
| R6.6 是否已生成本批测试场景表 | pass |
| R6.6 是否已生成本批候选用例矩阵 | pass |
| R6.6 是否已记录数据 / 自动化 / evidence 后移 | pass |
| R6.6 是否已完成本批停审 | pass |
| 是否未写后续批次用例 | pass |
| 是否未修改正式 `05-测试方案.md` | pass |

next_allowed_action: 等待用户确认后进入 Step 6 `R6.7 controlled consumption / distribution / seam 用例:先思考`;只允许思考 FR-ML-005~006、BR-ML-012~018、受控消费、分发语境、resolver / publisher / handoff seam、adapter unavailable / degraded、public shell 和 `R6.8 controlled consumption / distribution / seam 用例:再写入` 边界;不得直接修改正式 `05-测试方案.md`;不得写 traceability、job、config 等后续批次用例;不得写 fixture、环境矩阵、CI suite、evidence schema、验收标准、实施计划或 implementation code。

---

## R6.7 controlled consumption / distribution / seam 用例:先思考

### 1. 当前模块目标

`R6.7` 只思考第三批用例边界:FR-ML-005~006、BR-ML-012~018、受控消费、分发语境、resolver / publisher / handoff seam、adapter unavailable / degraded、public shell 和 body-free 断言。

当前模块不写最终 TC 行、测试步骤、fixture、环境矩阵、CI suite、evidence schema、验收标准或实施计划。`R6.8` 才允许把本批思考转成 `TC-ML-QUERY-*` / `TC-ML-CONSUMPTION-*` / `TC-ML-DISTRIBUTION-*` / `TC-ML-SEAM-*` / `TC-ML-HANDOFF-*` 候选行。

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm_to_R6.8 |
| 用户确认 | 已确认从 `R6.6` 推进到 `R6.7`。 |
| 当前允许 | 思考受控消费、分发语境、下游边界、query no-write、resolver / publisher / handoff seam、adapter unavailable / degraded、public shell 和 R6.8 写入边界。 |
| 当前禁止 | 修改正式 `05-测试方案.md`;写最终 TC 行;写 traceability / job / config / observability 后续批次用例;写 fixture、CI gate、artifact path、JSON schema、正式 EV、验收 verdict 或 implementation code。 |

### 2. 本批次正式输入

| 输入 | 与 R6.7 的关系 | R6.7 裁决 |
|---|---|---|
| FR-ML-005 正式方法资产消费支撑能力 | 下游必须按边界消费正式方法资产语义,不把定义真相迁移到消费方。 | 形成 consumption material、query safe surface、Definition vs Use guard 候选用例族。 |
| FR-ML-006 方法资产消费语境分发能力 | 分发 / 同步语境要知道哪些正式方法资产可进入受控消费链路。 | 形成 distribution context、event candidate、publisher / handoff safe outcome 候选用例族。 |
| BR-ML-012 process 边界 | process 只执行流程和运行状态;本仓只定义过程模板、任务和方法语义。 | 用例必须断言 process use 不反写定义 truth 或运行状态 truth。 |
| BR-ML-013 identity 边界 | identity 只拥有成员身份、成员生命周期和实际角色状态;本仓只定义角色等方法语义。 | 用例必须断言身份状态不进入 method truth,角色定义只以 ref / summary 消费。 |
| BR-ML-014 governance 边界 | governance 执行治理裁决;本仓只定义可引用的方法方针 / AI 方针语义。 | 用例必须断言治理结论只以摘要 / 引用 / basis ref 进入,不迁入裁决执行。 |
| BR-ML-015 capability-hub 边界 | capability-hub 拥有外部工具、MCP、A2A、provider 接入语义。 | 用例必须断言外部能力只以 safe ref / adapter summary 出现,本仓不接管 provider access。 |
| BR-ML-016 marketplace 边界 | marketplace 拥有定价、购买、订单、结算和商业履约。 | 用例必须断言分发语义不变成交易 truth 或履约状态。 |
| BR-ML-017 UI / console 边界 | UI 负责渲染和交互执行;本仓可定义视图策略语义。 | 用例必须断言 view policy 不执行前端渲染,public view 不泄露 raw UI payload。 |
| BR-ML-018 artifact / archive 边界 | artifact/archive 拥有正文、证据文件和制品生命周期。 | 用例必须断言 WorkProductDefinition 只作为方法语义,artifact body / archive body 不入仓。 |
| `03-详细设计.md` §7~§12 | Query no-write、public marker source、outbound candidate、publication outcome、handoff outcome、stored shell、no rollback。 | 用例预期只能引用正式 protocol / flow / persistence / recovery / idempotency 口径。 |
| `04-配置设计.md` §3 / §7 / §11 | adapter slot、target binding、availability / degraded / failed marker、no fake fallback、no raw secret/body。 | 本批只引用 availability / degraded 语义,具体 config key / profile fixture 留 R6.11/R6.12 和 Step 8。 |

### 3. 场景拆分思考

| 场景族 | 正向方向 | 负向 / 边界方向 | 后续用例族 |
|---|---|---|---|
| controlled consumption material | 正式版本和定义 summary 可被下游通过 safe refs / material / public shell 消费。 | 未正式化、superseded/retired、material missing、source mismatch、下游私有定义替代。 | consumption-material candidate |
| query safe surface / no-write | Query visible / empty / not-visible / stale / degraded / unavailable 只读正式 material / resolver / mapper 输出。 | Query prepare material、repair projection、append audit、publish event、start job、store query replay。 | query-consumption candidate |
| sibling boundary guard | process / identity / governance / capability-hub / marketplace / UI / artifact 各自只消费边界内 refs / summary。 | 运行状态、身份状态、治理裁决执行、provider access、交易履约、UI 渲染、artifact body 进入本仓 truth。 | sibling-boundary candidate |
| distribution context | 正式可消费语境形成 distribution ref / material / context summary,供分发或同步语境识别。 | marketplace 交易、手工同步唯一口径、旧 publish/outbox、topic 或 route 作为业务 truth。 | distribution-context candidate |
| outbound publisher seam | event candidate 从 stored body-free fact / accepted effect / report source 组装,publication outcome 与 truth 分离。 | publisher 重读 current truth 拼 payload、delivery ack 证明 truth、topic / payload body / old outbox 成为断言。 | publisher-seam candidate |
| handoff seam | handoff prepared / delivered / failed / blocked / unavailable 只表达本地 body-free marker / receipt / outcome。 | delivered 代表 downstream business truth、failure rollback committed truth、handoff package body 入 truth。 | handoff-seam candidate |
| adapter unavailable / degraded | resolver、publisher、handoff、target registry unavailable / degraded marker 只复制正式 availability / mapper 输出。 | raw adapter error、HTTP code、topic、private map 或测试 helper 合成 marker。 | availability-degraded candidate |
| public shell / body-free | Query / Outbound / Handoff / worker result 只承载 typed refs、safe summary、marker、receipt / outcome refs。 | raw external body、provider payload、secret、delivery receipt body、artifact body、archive body 泄露。 | public-shell-seam candidate |

### 4. 断言来源思考

| 断言点 | 正式来源 | R6.8 写入方式 |
|---|---|---|
| consumption boundary | FR-ML-005;`MethodAssetConsumptionMaterial`;`DownstreamConsumptionBoundary`;Definition vs Use guard。 | 用例断言下游只能消费 safe refs / material / summary,不能拥有或修改 definition truth。 |
| distribution context | FR-ML-006;distribution context / relation material;outbound candidate shell。 | 用例断言分发语境可被识别,但不定义 marketplace 交易或旧 publish/outbox。 |
| sibling responsibility split | BR-ML-012~018;架构职责边界;`03` module owner。 | 用例按相邻仓边界覆盖越界输入被拒绝或降为 safe boundary diagnostic。 |
| query no-write | `03` §8 / §10 / §11 / §12;`04` query no-write 不可配置。 | 用例断言所有 consumption query 分支无 truth/material/audit/event/job/replay 写入。 |
| marker source | `03` public marker guard;`04` availability / degraded source。 | 用例断言 degraded / unavailable / blocked / failed marker 只能复制 formal mapper / resolver / availability 输出;缺源则停审。 |
| publisher outcome | `03` outbound protocol / flow / recovery;publication outcome persistence。 | 用例断言 candidate、publication outcome、truth 三层分离,publisher failure 不回滚 committed truth。 |
| handoff outcome | `03` handoff recovery / idempotency;body-free receipt marker。 | 用例断言 prepared 不等于 delivered,delivered 只代表正式 receipt marker,不代表下游业务 truth。 |
| body-free / redaction | `ExternalBodyBoundaryRule`;`04` secret/redaction;observability safe output。 | 用例断言 public shell、candidate、receipt、outcome 和 diagnostic 不含 raw body / secret / receipt body。 |

### 5. 候选用例族思考

R6.7 不生成最终用例行,但先固定 R6.8 的候选族,避免 R6.8 写入时自由发挥。

| 候选族 | 覆盖意图 | R6.8 允许生成的候选 ID 范围 |
|---|---|---|
| consumption-material candidate | 正式消费材料、正式版本可消费判断、未正式 / retired 不可作为正式消费依据。 | `TC-ML-CONSUMPTION-*` |
| query-consumption candidate | consumption query visible / empty / not-visible / stale / degraded / unavailable 与 no-write。 | `TC-ML-QUERY-*` 的本批受控消费子集 |
| sibling-boundary candidate | process、identity、governance、capability-hub、marketplace、UI、artifact/archive 边界不被打穿。 | `TC-ML-BOUNDARY-*`;`TC-ML-SEAM-*` |
| distribution-context candidate | 可消费语境、distribution context / material、手工同步不作为唯一口径。 | `TC-ML-DISTRIBUTION-*` |
| publisher-seam candidate | event candidate body-free、publication outcome 分离、publisher failed / unavailable safe outcome。 | `TC-ML-PUBLISHER-*` |
| handoff-seam candidate | handoff prepared / delivered-marker / failed / blocked / unavailable 与 no rollback。 | `TC-ML-HANDOFF-*` |
| availability-degraded candidate | resolver / publisher / handoff / target registry unavailable / degraded marker copy-only。 | `TC-ML-AVAILABILITY-*`;`TC-ML-DEGRADED-*` |
| public-shell-seam candidate | Query / outbound / handoff public shell 不泄露 raw body、secret、receipt body、artifact body。 | `TC-ML-SHELL-*`;`TC-ML-REDACTION-*` 的本批 seam 子集 |

### 6. 数据 / 自动化 / evidence 后移思考

| 主题 | R6.7 可记录 | 后续承接 |
|---|---|---|
| 数据需求 | 需要 current formal version、not-formal、superseded/retired、consumption material visible/missing/stale/degraded、sibling boundary input、publisher failed、handoff failed/unavailable 等数据需求。 | Step 7 固定 builders / fixtures / fake store / fault injection。 |
| 自动化候选 | 本批多数应为 application query / worker / fake adapter seam 自动化;boundary guard 可在 domain / contract 层补充。 | Step 9 固定 suite、command、required check。 |
| evidence 候选 | controlled-consumption、query-no-write、sibling-seam、distribution-context、publisher-outcome、handoff-outcome、availability-degraded、body-free-shell evidence candidate。 | Step 13 固定 EV ID、artifact/report schema 和 run-scoped path。 |
| 环境能力 | 需要 fake read material、write-audit spy、resolver availability fake、publisher fake、handoff fake、target registry fake 和 redaction scan 能力。 | Step 8 环境与配置矩阵;Step 9 automation gate。 |
| 验收方向 | 支撑下游按边界消费、分发语境成立、相邻仓边界清晰、adapter failure 不改写 truth。 | Step 12 / `06-验收标准.md`。 |

### 7. R6.8 写入边界思考

`R6.8 controlled consumption / distribution / seam 用例:再写入` 只能写本批候选用例行。

允许写入:

1. 本批测试场景表。
2. `TC-ML-CONSUMPTION-*` / `TC-ML-QUERY-*` / `TC-ML-BOUNDARY-*` / `TC-ML-DISTRIBUTION-*` / `TC-ML-PUBLISHER-*` / `TC-ML-HANDOFF-*` / 本批 availability / degraded / shell 候选用例行。
3. 每行的需求 / 规则来源、设计依据、前置条件、输入 / 操作、预期结果、断言点、自动化候选、证据候选和停审备注。
4. 本批数据 / 自动化 / evidence 后移记录。
5. 本批 stop-review 和 `R6.9 traceability / consistency / job / recovery 用例:先思考` 进入门禁。

禁止写入:

1. traceability、job、config、observability、report evidence 等后续批次用例。
2. 测试数据 fixture、seed JSON、DB 记录、环境矩阵、CI suite、script command。
3. 正式 evidence ID、artifact path、JSON schema、report schema、验收 gate 或实施计划。
4. 未在 `03/04` 闭合的 port、mapper、marker source、availability source、state、error、config key 或 downstream phase boundary。

### 8. R6.7 stop-review

| 检查项 | 结果 |
|---|---|
| 是否只思考 controlled consumption / distribution / seam 批次 | pass |
| 是否承接 FR-ML-005~006 和 BR-ML-012~018 | pass |
| 是否纳入 query no-write、public shell、resolver / publisher / handoff seam 和 adapter unavailable / degraded | pass |
| 是否未生成最终 TC 行 | pass |
| 是否未写 traceability、job、config、observability 后续批次内容 | pass |
| 是否未写测试数据、环境、CI、evidence schema、验收或实施内容 | pass |
| 是否形成 R6.8 写入边界 | pass |
| 是否未修改正式 `05-测试方案.md` | pass |

next_allowed_action: 等待用户确认后进入 Step 6 `R6.8 controlled consumption / distribution / seam 用例:再写入`;只允许写入本批测试场景表、`TC-ML-CONSUMPTION-*` / `TC-ML-QUERY-*` / `TC-ML-BOUNDARY-*` / `TC-ML-DISTRIBUTION-*` / `TC-ML-PUBLISHER-*` / `TC-ML-HANDOFF-*` / 本批 availability / degraded / shell 候选用例行、本批数据 / 自动化 / evidence 后移记录、本批 stop-review 和 `R6.9 traceability / consistency / job / recovery 用例:先思考` 进入门禁;不得直接修改正式 `05-测试方案.md`;不得写 traceability、job、config、observability 等后续批次用例;不得写 fixture、环境矩阵、CI suite、evidence schema、验收标准、实施计划或 implementation code。

---

## R6.8 controlled consumption / distribution / seam 用例:再写入

### 1. 当前模块状态

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm_to_R6.9 |
| 用户确认 | 已确认从 `R6.7` 推进到 `R6.8`。 |
| 本模块写入范围 | 本批测试场景表、consumption / query / boundary / distribution / publisher / handoff / availability / shell 候选用例行、数据 / 自动化 / evidence 后移记录、本批 stop-review、`R6.9` 进入门禁。 |
| 本模块禁止范围 | 正式 `05-测试方案.md` 正文、traceability / job / config / observability 等后续批次用例、fixture、环境矩阵、CI suite、evidence schema、验收标准、实施计划和 implementation code。 |

### 2. 本批测试场景表

| 场景族 | 覆盖需求 / 规则 | 设计依据 | 本批用例目标 |
|---|---|---|---|
| controlled consumption material | FR-ML-005;BR-ML-003;BR-ML-007;BR-ML-012~018 | `MethodAssetConsumptionMaterial`;`DownstreamConsumptionBoundary`;`DefinitionUseBoundaryGuard` | 验证正式版本可被下游按 refs / summary / material 消费,未正式或退役材料不可作为正式消费依据。 |
| consumption query safe surface | FR-ML-005;NFR-ML-013~016 | Query protocol;read decision;degraded decision;Query no-write | 验证 visible / empty / stale / degraded / unavailable 分支都只返回 safe surface 且不写。 |
| sibling responsibility boundary | BR-ML-012~018 | 架构职责边界;domain guard;adapter seam | 验证 process、identity、governance、capability-hub、marketplace、UI、artifact/archive 边界不被打穿。 |
| distribution context | FR-ML-006;BR-ML-008;BR-ML-011;BR-ML-021 | distribution context/material;relation/distribution builder;body-free event candidate | 验证可消费语境可被分发 / 同步识别,但不落成 marketplace 交易、旧 publish 或手工同步唯一口径。 |
| publisher seam | FR-ML-006;NFR-ML-004~006 | Outbound event protocol;event candidate;publication outcome;target registry | 验证 candidate 来源 body-free,publisher outcome 与 truth 分离,失败不回滚 committed truth。 |
| handoff seam | FR-ML-006;BR-ML-016~018;NFR-ML-004~006 | handoff binding/outcome;body-free receipt marker;no rollback rule | 验证 prepared / delivered-marker / failed / blocked / unavailable 的本地语义,不代表下游业务 truth。 |
| adapter unavailable / degraded | NFR-ML-004~006;BR-ML-012~018 | availability marker;degraded mapper;`04` failure/degradation | 验证 resolver / publisher / handoff / target registry unavailable 或 degraded 只能复制正式 marker。 |
| public shell / body-free | FR-ML-005~006;NFR-ML-007~008 | public shell;receipt/outcome shell;redaction boundary | 验证 consumption、distribution、publisher、handoff surface 不泄露 raw body、secret、receipt body 或 artifact/archive body。 |

### 3. 本批用例矩阵

| 用例 ID | 场景 | 优先级 | 需求 / 规则来源 | 设计依据 | 前置条件 | 输入 / 操作 | 预期结果 | 断言点 | 自动化候选 | 证据候选 | 停审备注 |
|---|---|---|---|---|---|---|---|---|---|---|---|
| TC-ML-CONSUMPTION-001 | current formal version 可被受控消费 | P0 | FR-ML-005;BR-ML-003;BR-ML-007 | `FormalMethodAssetVersion`;`MethodAssetConsumptionMaterial`;`DownstreamConsumptionBoundary` | 已存在 current formal version 和 available consumption material | 执行正式消费读取 / boundary check | 返回 consumable safe material / summary refs;下游获得可消费语义 | 只暴露 typed refs、safe summary、material marker;不迁移 definition truth 到消费方 | 是 | controlled-consumption evidence candidate | 具体 material builder 留 Step 7 |
| TC-ML-CONSUMPTION-002 | not-formal / retired 不可作为正式消费依据 | P0 | FR-ML-005;BR-ML-007;BR-ML-012~018 | `FormalizationState`;`FormalMethodAssetVersion`;`DownstreamConsumptionBoundary` | definition 未正式化、version superseded/retired 或 boundary retired | 执行消费判断或 consumption query | 返回 blocked / not-consumable / retired safe surface | 无 downstream formal consumption material;无 event candidate;不通过 latest timestamp 伪 current | 是 | consumption-negative evidence candidate | 状态 fixture 留 Step 7 |
| TC-ML-CONSUMPTION-003 | 下游私有定义不能替代本仓消费材料 | P0 | FR-ML-005;BR-ML-003;BR-ML-005;BR-ML-012~018 | `DefinitionUseBoundaryGuard`;business truth owner | 下游提交私有方法定义、运行快照或本地模型作为消费材料 | 执行 boundary guard / consumption material resolve | 返回 violation-detected / blocked / manual-review safe surface | 不保存 definition truth、不刷新 material、不接受 sibling 私有定义为 source | 是 | definition-use-boundary evidence candidate | 不展开跨仓 E2E |
| TC-ML-QUERY-002 | consumption query visible / empty / not-visible 均 no-write | P0 | FR-ML-005;NFR-ML-013~016 | Query flow;read decision;Query repeatability | 准备 visible、empty、not-visible 的 consumption material read surface | 重复执行 consumption query | 返回对应 safe view/page/surface | 无 truth write、material repair、audit append、event candidate、job start、query replay | 是 | consumption-query evidence candidate | write spy 留 Step 9 |
| TC-ML-QUERY-003 | stale / degraded / unavailable consumption material 不被 query 修复 | P0 | FR-ML-005;NFR-ML-004~006;NFR-ML-013~016 | `MethodAssetDegradedDecision`;availability marker;Query no-write | consumption material stale、missing marker、resolver unavailable 或 material store degraded | 执行 consumption query degraded branch | 返回 stale-visible / degraded / unavailable / consistency-safe surface | marker 只复制正式 resolver / mapper / availability 输出;缺 marker source 时停审 | 是 | degraded-query evidence candidate | marker source 缺失不得用 fixture 补 |
| TC-ML-BOUNDARY-002 | process 只能消费模板 / 任务 / 方法语义 | P0 | BR-ML-012;FR-ML-005 | `DownstreamConsumptionBoundary`;Definition vs Use | process use context 引用过程模板或任务定义 | 执行 process-facing consumption boundary check | allowed / blocked safe boundary decision;不保存 process execution state | process 运行状态不进入 method truth;process 不反写 definition 或 formal version | 是 | process-boundary evidence candidate | 不接入 L1-process 内部状态机 |
| TC-ML-BOUNDARY-003 | identity 只能消费角色等方法语义 | P0 | BR-ML-013;FR-ML-005 | role definition consumption boundary;safe identity summary/ref | identity use context 引用 role / method semantics | 执行 identity-facing consumption boundary check | 返回 safe role/method summary refs 或 blocked decision | 成员生命周期、实际角色状态不进入 method truth;identity 不拥有角色定义正文 | 是 | identity-boundary evidence candidate | identity 真实仓状态不作为 P0 前置 |
| TC-ML-BOUNDARY-004 | governance 只提供结论摘要 / basis ref | P0 | BR-ML-014;FR-ML-005;NFR-ML-005 | `FormalizationBasisSummary`;`DefinitionUseBoundaryGuard` | governance basis 或 policy reference 以 safe summary/ref 传入 | 执行治理相关消费 / 方针读取 | 返回 safe basis / policy summary refs;不执行治理裁决 | 无治理裁决过程、vote、approval body 或 enforcement state 进入本仓 | 是 | governance-boundary evidence candidate | 完整治理验收留 governance 仓 |
| TC-ML-BOUNDARY-005 | capability-hub provider access 不进入本仓 | P0 | BR-ML-015;NFR-ML-004~006 | external source summary;adapter availability;body-free rule | capability/tool/provider ref 或 unavailable summary 输入 | 执行 capability-facing consumption / source boundary check | 返回 safe external summary/ref 或 unavailable marker | 不保存 provider payload、access token、MCP/A2A connection state 或工具运行 truth | 是 | capability-boundary evidence candidate | 真实 provider 接入为 P1/P2 |
| TC-ML-BOUNDARY-006 | marketplace 分发消费不产生交易 truth | P0 | BR-ML-016;FR-ML-006 | distribution context/material;marketplace context boundary | marketplace-facing source/package ref 或 distribution context 输入 | 执行 marketplace-facing distribution read | 返回 method asset source / package / distribution safe refs | 无 price、order、purchase、settlement、fulfillment truth;无 marketplace listing body | 是 | marketplace-boundary evidence candidate | 不把生态发现增强写成核心交易流程 |
| TC-ML-BOUNDARY-007 | UI 只消费 view policy 语义不执行渲染 | P0 | BR-ML-017;FR-ML-005 | public view shell;view policy definition;body-free shell | UI/console 请求视图策略或方法可视语义 | 执行 UI-facing query / consumption read | 返回 view policy safe summary / marker | 不保存 UI interaction、render state、raw UI payload 或 frontend execution result | 是 | ui-boundary evidence candidate | 不写前端自动化用例 |
| TC-ML-BOUNDARY-008 | artifact/archive 正文不进入 method truth | P0 | BR-ML-018;NFR-ML-007~008 | `ExternalBodyBoundaryRule`;artifact/archive ref boundary | WorkProductDefinition 引用 artifact/archive ref 或 archive handoff context | 执行 artifact-facing consumption / body boundary check | 返回 safe artifact/archive refs、digest/summary refs 或 body-boundary rejection | artifact body、archive package、evidence file content 不进入 truth、public shell、handoff outcome | 是 | artifact-boundary evidence candidate | artifact lifecycle 留 L1-artifact/archive |
| TC-ML-DISTRIBUTION-001 | 正式可消费语境形成 distribution context | P0 | FR-ML-006;BR-ML-008;BR-ML-021 | distribution context/ref;distribution material;relation/distribution builder | current formal version 可进入受控消费链路 | 执行 distribution context read / material assembly | 返回 body-free distribution context / material refs | 分发语境可被识别;不依赖手工同步作为唯一口径;不写 marketplace transaction | 是 | distribution-context evidence candidate | builder fixture 留 Step 7 |
| TC-ML-DISTRIBUTION-002 | 旧 publish / topic / route 不能证明分发 truth | P0 | FR-ML-006;historical material isolation;BR-ML-008 | old material exclusion;outbound protocol boundary | 输入旧 publish/outbox/topic/route 或手工同步记录 | 执行 distribution source audit / boundary check | 返回 pollution / unsupported / safe rejection | 不用旧 publish 状态、topic、route、broker ack 或 snapshot/fingerprint 证明 distribution context | 是 | distribution-pollution evidence candidate | 延续到 R6.13/R6.14 跨用例审计 |
| TC-ML-PUBLISHER-001 | event candidate 从 stored body-free fact 组装 | P0 | FR-ML-006;NFR-ML-007~008 | Outbound event protocol;event candidate assembly;stored fact source | accepted command effect 或 bounded inbound stored fact 已存在 | 组装 outbound event candidate | candidate 只包含 typed refs、marker refs、target hint 和 safe context | 不重读 current truth 拼 payload;无 raw event body、topic、old outbox body | 是 | publisher-candidate evidence candidate | topic / target 绑定留 Step 8 |
| TC-ML-PUBLISHER-002 | publisher failed / unavailable 不回滚 committed truth | P0 | FR-ML-006;NFR-ML-004~006 | publication outcome;target registry;no rollback rule | event candidate 已持久化,publisher target failed / unavailable | 执行 publication outcome 分支 | 返回 failed / blocked / unavailable safe outcome | accepted truth 和 candidate 不回滚;delivery ack / raw response 不证明 local truth | 是 | publisher-failure evidence candidate | retry policy 留后续 Step |
| TC-ML-HANDOFF-001 | handoff prepared 与 delivered-marker 语义分离 | P0 | FR-ML-006;BR-ML-016~018 | handoff binding/outcome;body-free receipt marker | 有 handoff-safe refs 和 target ready summary | 执行 handoff prepare / delivered-marker branch | prepared 表示本地准备;delivered-marker 只表示正式 receipt marker | delivered 不代表 downstream business truth;无 package body / receipt body | 是 | handoff-marker evidence candidate | downstream receipt schema 留 Step 13 |
| TC-ML-HANDOFF-002 | handoff failed / blocked / unavailable 不回滚本地 truth | P0 | FR-ML-006;NFR-ML-004~006 | handoff outcome;target availability;no rollback rule | handoff target failed、blocked 或 unavailable | 执行 handoff failure branch | 返回 failed / blocked / unavailable outcome 或 safe issue | local truth、stored result、candidate/report 不回滚;不以外部响应正文为诊断来源 | 是 | handoff-failure evidence candidate | report path/schema 留 Step 13 |
| TC-ML-AVAILABILITY-001 | resolver / publisher / handoff marker copy-only | P0 | NFR-ML-004~006;BR-ML-012~018 | availability marker;degraded mapper;`04` failure/degradation | resolver、publisher、handoff 或 target registry 返回 unavailable/degraded formal summary | 执行对应 query / publication / handoff branch | public surface 复制 formal availability / degraded marker | 不从 raw adapter error、HTTP code、topic、private map、health probe 合成 marker | 是 | availability-marker evidence candidate | 缺 marker source 时作为 design blocker |
| TC-ML-SHELL-002 | consumption / distribution / handoff shell body-free | P0 | FR-ML-005~006;NFR-ML-007~008 | public shell;receipt/outcome shell;redaction boundary | 有 consumption view、distribution context、publication outcome 和 handoff outcome | 组装 public/query/outbound/handoff surface | surface 只包含 refs、safe summary、marker、outcome / receipt refs | 无 raw method body、external body、secret、credential、delivery receipt body、artifact/archive body | 是 | body-free-shell evidence candidate | redaction scan细节留 Step 9 / Step 13 |

### 4. 本批数据 / 自动化 / evidence 后移记录

| 后移项 | 本批记录 | 后续 Step |
|---|---|---|
| 数据构造 | current formal version、not-formal、superseded/retired、available/stale/degraded/unavailable consumption material、sibling boundary inputs、publisher failed、handoff failed/unavailable、target registry marker。 | Step 7 测试数据设计。 |
| 自动化位置 | application query / boundary guard / worker publisher / handoff fake seam 为主;domain / contract 层补 body-free shell 和 boundary decision。 | Step 9 自动化与 CI/CD 门禁。 |
| evidence 候选 | controlled-consumption、consumption-query、sibling-boundary、distribution-context、publisher-candidate、publisher-failure、handoff-marker、handoff-failure、availability-marker、body-free-shell evidence candidate。 | Step 13 测试报告与证据归档。 |
| 环境能力 | 需要 fake read material、write-audit spy、resolver availability fake、publisher fake、handoff fake、target registry fake、redaction scan 和 no-private-marker 检查。 | Step 8 环境与配置矩阵;Step 9 automation gate。 |
| 验收承接 | 支撑受控消费、分发语境、相邻仓边界、adapter failure 不改写 truth、public shell body-free。 | Step 12 / `06-验收标准.md`。 |

### 5. 本批停审

| 停审项 | 结论 | 说明 |
|---|---|---|
| 是否覆盖 FR-ML-005~006 | pass | 受控消费材料、消费 query、分发语境、publisher / handoff seam 均有候选用例。 |
| 是否覆盖 BR-ML-012~018 | pass | process、identity、governance、capability-hub、marketplace、UI、artifact/archive 均有边界用例。 |
| 是否覆盖 unavailable / degraded / public shell 风险 | pass | query degraded、publisher / handoff failure、availability marker copy-only 和 body-free shell 均已覆盖。 |
| 是否每个用例有正式设计依据 | pass | 均回指 `MethodAssetConsumptionMaterial`、`DownstreamConsumptionBoundary`、Query / Outbound / Handoff protocol、availability marker 或 `04` failure/degradation。 |
| 是否未写后续 traceability / job / config / observability 批次 | pass | 仅记录 Step 7/8/9/13 后移项,未写后续批次用例。 |
| 是否未写 fixture / CI / evidence schema | pass | 只写数据需求、自动化候选和 evidence candidate。 |
| 是否未修改正式 `05-测试方案.md` | pass | 本批只更新中间产物。 |

### 6. R6.9 进入门禁

| 门禁项 | 裁决 |
|---|---|
| R6.8 是否已生成本批测试场景表 | pass |
| R6.8 是否已生成本批候选用例矩阵 | pass |
| R6.8 是否已记录数据 / 自动化 / evidence 后移 | pass |
| R6.8 是否已完成本批停审 | pass |
| 是否未写后续批次用例 | pass |
| 是否未修改正式 `05-测试方案.md` | pass |

next_allowed_action: 等待用户确认后进入 Step 6 `R6.9 traceability / consistency / job / recovery 用例:先思考`;只允许思考 FR-ML-007~009、BR-ML-019~022、NFR-ML-009~016、trace / audit refs-only、stored replay、job report、UoW rollback、commit unknown、no truth repair 和 `R6.10 traceability / consistency / job / recovery 用例:再写入` 边界;不得直接修改正式 `05-测试方案.md`;不得写 config、observability、cross-case audit 等后续批次用例;不得写 fixture、环境矩阵、CI suite、evidence schema、验收标准、实施计划或 implementation code。

---

## R6.9 traceability / consistency / job / recovery 用例:先思考

### 1. 当前模块目标

`R6.9` 只思考第四批用例边界:FR-ML-007~009、BR-ML-019~022、NFR-ML-009~016、trace / audit refs-only、stored replay、job report、UoW rollback、commit unknown、checkpoint resume、partial failure 和 no truth repair。

当前模块不写最终 TC 行、测试步骤、fixture、环境矩阵、CI suite、evidence schema、验收标准或实施计划。`R6.10` 才允许把本批思考转成 `TC-ML-TRACE-*` / `TC-ML-AUDIT-*` / `TC-ML-LINEAGE-*` / `TC-ML-IMPACT-*` / `TC-ML-EVIDENCE-*` / `TC-ML-JOB-*` / `TC-ML-UOW-*` / `TC-ML-RECOVERY-*` 候选行。

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm_to_R6.10 |
| 用户确认 | 已确认从 `R6.8` 推进到 `R6.9`。 |
| 当前允许 | 思考追溯、消费一致性保护、证据线索、trace / audit refs-only、stored replay、job report、UoW rollback、commit unknown、checkpoint resume、partial failure 和 no truth repair。 |
| 当前禁止 | 修改正式 `05-测试方案.md`;写最终 TC 行;写 config、专项 observability / metric / redaction、cross-case audit 后续批次用例;写 fixture、CI gate、artifact path、JSON schema、正式 EV、验收 verdict 或 implementation code。 |

### 2. 本批次正式输入

| 输入 | 与 R6.9 的关系 | R6.9 裁决 |
|---|---|---|
| FR-ML-007 方法资产追溯能力 | 方法资产版本、变更依据和引用语境必须可追溯。 | 形成 trace material、audit trail、lineage、basis / change ref 候选用例族。 |
| FR-ML-008 方法资产消费一致性保护能力 | 正式资产变化对既有消费的影响必须可识别,避免静默破坏引用稳定性。 | 形成 impact summary、consistency protection、UoW / replay / job no repair 候选用例族。 |
| FR-ML-009 方法资产证据线索承接能力 | 版本、发布和引用相关证据线索必须能进入后续验收 / 审计语境。 | 形成 evidence lineage、job report safe summary、handoff-ready evidence candidate 候选族。 |
| BR-ML-019 | 治理结论只能作为正式化前置或引用依据,不得迁入治理裁决执行。 | 追溯用例只允许治理 basis ref / summary,不测试治理执行流程。 |
| BR-ML-020 | 正式化、版本语义变化和消费影响变化必须具备可追溯依据。 | 用例必须覆盖 accepted fact、change basis、impact ref 和 audit/lineage refs-only。 |
| BR-ML-021 | 正式消费应能回溯到定义来源和版本语境。 | 用例必须覆盖 consumption trace 到 definition / version / material context 的路径。 |
| BR-ML-022 | 版本、发布和引用证据线索必须能承接验收或审计语境,不得只存在人工说明。 | 用例必须覆盖 body-free evidence lineage / report summary,但不定义 evidence schema。 |
| NFR-ML-009~011 | 追溯 / 审计 / 证据线索必须可承接且不定义正文 schema。 | 本批覆盖 refs-only trace、lineage 和 evidence candidate,正式 artifact schema 留 Step 13。 |
| NFR-ML-012~014 | 单一正式语义、重复维护不制造第二 truth、显式变化不可静默覆盖。 | 本批覆盖 stored replay、UoW rollback、version conflict、commit unknown 和 no rerun。 |
| NFR-ML-015~016 | 关键状态可观察,但观测材料不得替代 truth。 | 本批只覆盖 trace/audit/job report 作为 safe fact;专项 metric/log 细节后移。 |
| `03-详细设计.md` §7~§12 | stored result/receipt/report、UoW、checkpoint、commit unknown、job report、partial issue 和 no truth repair。 | 用例预期必须引用正式 stored surface、report/issue/checkpoint 和 recovery surface。 |
| `04-配置设计.md` §4 / §7 / §11 | config 不得关闭 stored replay、改变 transaction boundary、让 job 修 truth 或用 replay root 覆盖 secret/marker。 | 本批只记录配置红线关联,正式 config case 留 R6.11/R6.12。 |

### 3. 场景拆分思考

| 场景族 | 正向方向 | 负向 / 边界方向 | 后续用例族 |
|---|---|---|---|
| trace material / lineage | accepted formalization、version change、consumption reference 形成 refs-only trace / lineage。 | trace 保存 raw body、治理裁决正文、artifact body、下游 runtime truth 或旧 snapshot。 | trace-lineage candidate |
| audit trail refs-only | accepted business fact、change basis、impact decision 形成 audit / history refs。 | rejected / duplicate / query observation 伪装 accepted audit;raw reason/body 进入 audit。 | audit-refs candidate |
| evidence lineage | 版本、发布、引用相关 evidence candidate 以 safe refs / summary / marker 承接后续验收。 | 在 Step 6 定义 EV ID、artifact path、JSON schema 或保存 evidence body。 | evidence-lineage candidate |
| consumption impact / protection | 版本语义变化或正式消费影响形成 impact summary / protection decision。 | 静默覆盖 current、下游回报变成本仓 truth、影响只存在人工说明。 | impact-protection candidate |
| stored replay / no rerun | duplicate command / inbound / job 只复制 stored result / receipt / report。 | 重跑 mutation、重读 current truth 重建 response/report、adapter scan 替代 stored surface。 | stored-replay candidate |
| UoW rollback / atomicity | accepted truth/support/material、stored result、candidate refs 同一 logical boundary 提交。 | rollback 后残留 accepted result/candidate/audit;log/metric/private flag 证明 rollback。 | uow-atomicity candidate |
| commit unknown / stored surface missing | commit unknown 和 stored surface missing 返回 manual / consistency-safe surface。 | timeout、log、current truth、adapter note 直接判 accepted 或重建 response。 | recovery-consistency candidate |
| operations job report / no truth repair | job 只刷新派生 material、progress、checkpoint、report、issue。 | job 修 core truth、report body 入仓、queue offset / lease 作为 checkpoint。 | job-report candidate |

### 4. 断言来源思考

| 断言点 | 正式来源 | R6.10 写入方式 |
|---|---|---|
| trace / lineage refs-only | `MethodAssetTraceMaterial`;`MethodAssetEvidenceLineage`;accepted business fact refs。 | 用例断言 trace / lineage 只保存 typed refs、safe reason、marker 和 source refs。 |
| audit safe boundary | `MethodAssetAuditTrail`;observability / audit redline;body-free rule。 | 用例断言 accepted audit 与 rejected / duplicate / query observation 分离,无 raw body / secret。 |
| consumption impact | `ConsumptionImpactSummary`;ConsistencyProtectionPolicy;explicit change rule。 | 用例断言 impact 显式形成 safe summary / marker,不修 downstream truth。 |
| stored replay | `MethodAssetStoredOperationResult`;stored receipt/report;idempotency guard。 | 用例断言 duplicate 读取 stored surface only,stored missing 进入 manual / consistency。 |
| UoW atomicity | `UnitOfWork`;transaction boundary;accepted mutation rule。 | 用例断言 accepted truth/support/material/stored result/candidate 要么一起提交,要么一起回滚。 |
| commit unknown | §11 recovery;§12 idempotency / commit unknown source。 | 用例断言只能依据 stored surface、formal read-back 或正式 recovery source 判断。 |
| job report / checkpoint | Operations Job protocol;job flow;checkpoint/report boundary。 | 用例断言 job duplicate replay stored report,resume 用 checkpoint/progress/report/issue source。 |
| no truth repair | Job / query / publisher / handoff forbidden responsibility。 | 用例断言 job/query/consumer/publisher 不创建、更新、删除或修复 core truth。 |

### 5. 候选用例族思考

R6.9 不生成最终用例行,但先固定 R6.10 的候选族。

| 候选族 | 覆盖意图 | R6.10 允许生成的候选 ID 范围 |
|---|---|---|
| trace-lineage candidate | formalization / version / consumption 的 trace material、lineage、basis refs-only。 | `TC-ML-TRACE-*`;`TC-ML-LINEAGE-*` |
| audit-refs candidate | accepted audit、history、safe reason、rejected/duplicate/query observation 分离。 | `TC-ML-AUDIT-*` |
| evidence-lineage candidate | evidence candidate、version / publish / reference lineage、body-free handoff-ready summary。 | `TC-ML-EVIDENCE-*` |
| impact-protection candidate | impact summary、consistency protection、下游回报不成 truth、显式变化保护。 | `TC-ML-IMPACT-*`;`TC-ML-CONSISTENCY-*` |
| stored-replay candidate | command / inbound / job duplicate replay stored surface,no rerun,no current truth rebuild。 | `TC-ML-REPLAY-*`;`TC-ML-IDEMP-*` 的本批子集 |
| uow-atomicity candidate | accepted atomicity、rollback no residue、version conflict / race。 | `TC-ML-UOW-*`;`TC-ML-RECOVERY-*` |
| recovery-consistency candidate | commit unknown、stored result/report missing、manual / consistency-safe surface。 | `TC-ML-RECOVERY-*` |
| job-report candidate | job progress、checkpoint、partial failure、report safe summary、no truth repair。 | `TC-ML-JOB-*` |

### 6. 数据 / 自动化 / evidence 后移思考

| 主题 | R6.9 可记录 | 后续承接 |
|---|---|---|
| 数据需求 | 需要 accepted formalization/version/change、consumption ref、impact input、stored result/receipt/report present/missing、commit unknown、rollback, checkpoint/progress/report/issue。 | Step 7 固定 builders / fixtures / fault injection。 |
| 自动化候选 | application service + fake persistence 覆盖 replay/UoW/recovery;jobs fake runner 覆盖 checkpoint/report/no truth repair;contract/domain 层覆盖 body-free shell。 | Step 9 固定 suite、command、required check。 |
| evidence 候选 | traceability、audit-refs、evidence-lineage、impact-protection、stored-replay、uow-atomicity、commit-unknown、job-report evidence candidate。 | Step 13 固定 EV ID、artifact/report path、schema、retention 和 review status。 |
| 环境能力 | 需要 fake UoW、stored result/receipt/report store、write-audit spy、job checkpoint fake、report fake、partial failure injection、truth write guard。 | Step 8 环境与配置矩阵;Step 9 automation gate。 |
| 验收承接 | 支撑追溯、消费一致性保护、证据线索承接、单一 truth、重复维护不制造第二 truth、观测材料不替代 truth。 | Step 12 / `06-验收标准.md`。 |

### 7. R6.10 写入边界思考

`R6.10 traceability / consistency / job / recovery 用例:再写入` 只能写本批候选用例行。

允许写入:

1. 本批测试场景表。
2. `TC-ML-TRACE-*` / `TC-ML-AUDIT-*` / `TC-ML-LINEAGE-*` / `TC-ML-IMPACT-*` / `TC-ML-EVIDENCE-*` / `TC-ML-REPLAY-*` / `TC-ML-UOW-*` / `TC-ML-RECOVERY-*` / `TC-ML-JOB-*` 候选用例行。
3. 每行的需求 / 规则来源、设计依据、前置条件、输入 / 操作、预期结果、断言点、自动化候选、证据候选和停审备注。
4. 本批数据 / 自动化 / evidence 后移记录。
5. 本批 stop-review 和 `R6.11 config / dependency / redaction / observability 用例:先思考` 进入门禁。

禁止写入:

1. config validation、profile isolation、secret/redaction、low-cardinality metric、cross-case audit 等后续批次用例。
2. 测试数据 fixture、seed JSON、DB 记录、环境矩阵、CI suite、script command。
3. 正式 evidence ID、artifact path、JSON schema、report schema、验收 gate 或实施计划。
4. 未在 `03/04` 闭合的 stored surface、report schema、checkpoint source、marker source、job phase boundary、config key 或 evidence schema。

### 8. R6.9 stop-review

| 检查项 | 结果 |
|---|---|
| 是否只思考 traceability / consistency / job / recovery 批次 | pass |
| 是否承接 FR-ML-007~009、BR-ML-019~022 和 NFR-ML-009~016 | pass |
| 是否纳入 trace / audit refs-only、stored replay、job report、UoW rollback、commit unknown 和 no truth repair | pass |
| 是否未生成最终 TC 行 | pass |
| 是否未写 config、专项 observability / metric / redaction、cross-case audit 后续批次内容 | pass |
| 是否未写测试数据、环境、CI、evidence schema、验收或实施内容 | pass |
| 是否形成 R6.10 写入边界 | pass |
| 是否未修改正式 `05-测试方案.md` | pass |

next_allowed_action: 等待用户确认后进入 Step 6 `R6.10 traceability / consistency / job / recovery 用例:再写入`;只允许写入本批测试场景表、`TC-ML-TRACE-*` / `TC-ML-AUDIT-*` / `TC-ML-LINEAGE-*` / `TC-ML-IMPACT-*` / `TC-ML-EVIDENCE-*` / `TC-ML-REPLAY-*` / `TC-ML-UOW-*` / `TC-ML-RECOVERY-*` / `TC-ML-JOB-*` 候选用例行、本批数据 / 自动化 / evidence 后移记录、本批 stop-review 和 `R6.11 config / dependency / redaction / observability 用例:先思考` 进入门禁;不得直接修改正式 `05-测试方案.md`;不得写 config、专项 observability / metric / redaction、cross-case audit 等后续批次用例;不得写 fixture、环境矩阵、CI suite、evidence schema、验收标准、实施计划或 implementation code。

---

## R6.10 traceability / consistency / job / recovery 用例:再写入

### 1. 当前模块状态

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm_to_R6.11 |
| 用户确认 | 已确认从 `R6.9` 推进到 `R6.10`。 |
| 本模块写入范围 | 本批测试场景表、trace / audit / lineage / impact / evidence / replay / UoW / recovery / job 候选用例行、数据 / 自动化 / evidence 后移记录、本批 stop-review、`R6.11` 进入门禁。 |
| 本模块禁止范围 | 正式 `05-测试方案.md` 正文、config validation、dependency availability、secret/redaction、metric/log/trace 专项、cross-case audit、fixture、环境矩阵、CI suite、evidence schema、验收标准、实施计划和 implementation code。 |

### 2. 本批测试场景表

| 场景族 | 覆盖需求 / 规则 | 设计依据 | 本批用例目标 |
|---|---|---|---|
| trace material / lineage | FR-ML-007;BR-ML-020~021;NFR-ML-009~010 | `MethodAssetTraceMaterial`;`MethodAssetEvidenceLineage`;accepted business fact refs | 验证正式化、版本语义变化和正式消费引用可追到定义来源、版本语境和变化依据。 |
| audit trail refs-only | FR-ML-007;BR-ML-020;NFR-ML-009;NFR-ML-016 | `MethodAssetAuditTrail`;business audit cuts;body-free audit rule | 验证 accepted business fact audit 只记录 safe refs / reason refs, rejected、duplicate 和 query observation 不伪装 accepted audit。 |
| evidence lineage | FR-ML-009;BR-ML-022;NFR-ML-011 | evidence lineage object;report / handoff candidate boundary | 验证版本、发布和引用相关证据线索能承接后续验收或审计,但 Step 6 不定义 artifact schema。 |
| consumption impact protection | FR-ML-008;BR-ML-010~011;BR-ML-020 | `ConsumptionImpactSummary`;consistency protection decision;explicit change rule | 验证影响既有消费的变化必须形成显式 impact / protection summary,不得静默覆盖正式引用含义。 |
| stored replay / no rerun | NFR-ML-012~014;NFR-ML-016 | stored operation result / receipt / report;idempotency guard;no-rerun rule | 验证 command / inbound / job duplicate 只能复制 stored surface,不重跑 mutation 或重读 current truth 重建响应。 |
| UoW atomicity / rollback | NFR-ML-012~014 | UoW;transaction boundary;stored accepted surface;candidate refs | 验证 accepted truth/support/material/stored result/candidate 在同一 logical boundary 提交,失败时不留局部残留。 |
| recovery consistency | NFR-ML-012~014;NFR-ML-016 | commit unknown recovery source;stored surface missing manual / consistency surface | 验证 commit unknown、stored surface missing 和 replay source 缺失只能进入正式 safe recovery,不能由日志或私有状态判断成功。 |
| operations job report / no truth repair | FR-ML-008~009;NFR-ML-013~016 | job run/progress/checkpoint/report/issue;operations fact cuts;no core truth repair | 验证后台维护只写派生 material、checkpoint、progress、report、issue,不能修复核心 truth。 |

### 3. 本批用例矩阵

| 用例 ID | 场景 | 优先级 | 需求 / 规则来源 | 设计依据 | 前置条件 | 输入 / 操作 | 预期结果 | 断言点 | 自动化候选 | 证据候选 | 停审备注 |
|---|---|---|---|---|---|---|---|---|---|---|---|
| TC-ML-TRACE-001 | accepted formalization trace 可追到 basis refs | P0 | FR-ML-007;BR-ML-019~020;NFR-ML-009 | `MethodAssetTraceMaterial`;`FormalizationBasisSummary`;accepted business fact refs | definition 已 accepted formalization 且存在 governance / policy safe basis refs | 读取 formalization trace material | 返回 body-free trace refs,可定位 definition、formalization basis 和 accepted fact | 只保存 governance basis ref / summary;不保存治理裁决正文、vote、approval body 或 enforcement state | 是 | trace-formalization evidence candidate | governance 执行流程不进入本仓测试 |
| TC-ML-TRACE-002 | semantic version change trace 可追到变化依据 | P0 | FR-ML-007~008;BR-ML-020;NFR-ML-009;NFR-ML-014 | `FormalMethodAssetVersion`;semantic change boundary;trace material | 已存在 current version,并发生显式语义变化 | 读取 version change trace | 返回 old/new version refs、change basis refs 和 safe change reason refs | 不用 timestamp、fingerprint、artifact body 或人工说明替代正式 change trace | 是 | trace-version-change evidence candidate | 具体 diff body 不在 Step 6 定义 |
| TC-ML-TRACE-003 | formal consumption trace 可回到定义来源和版本语境 | P0 | FR-ML-007;BR-ML-021;NFR-ML-010 | `MethodAssetConsumptionMaterial`;trace material;distribution context | 下游已有正式 consumption ref / material ref | 读取 consumption trace / lineage | 返回 definition ref、formal version ref、material context ref 和 distribution context ref | 下游本地约定、运行快照或旧 publish 不能作为唯一解释来源 | 是 | consumption-trace evidence candidate | 跨仓 E2E 留后续集成层 |
| TC-ML-AUDIT-001 | accepted business fact audit refs-only | P0 | FR-ML-007;BR-ML-020;NFR-ML-009;NFR-ML-016 | `MethodAssetAuditTrail`;accepted UoW;business audit cuts | formalization / version / impact accepted path 已完成 | 读取 audit trail / history refs | 返回 accepted truth refs、safe actor/ref、safe reason refs、stored result ref | 无 raw method body、secret、external response、private domain reason 或 artifact/archive body | 是 | audit-accepted evidence candidate | audit schema 留 Step 13 |
| TC-ML-AUDIT-002 | rejected / duplicate / query observation 不写 accepted audit | P0 | NFR-ML-013~016;BR-ML-020 | rejected surface;duplicate stored replay;query no-write;business audit cuts | 准备 rejected、duplicate replay、query visible / degraded 分支 | 执行对应分支后检查 audit / history | 不新增 accepted business fact audit;仅允许 safe diagnostic / rejected / duplicate observation surface | rejected、duplicate、query 不创建 accepted audit、event candidate 或 truth mutation | 是 | audit-negative evidence candidate | diagnostic schema 后移 Step 13 |
| TC-ML-LINEAGE-001 | version / publish / reference lineage body-free | P0 | FR-ML-009;BR-ML-022;NFR-ML-011 | evidence lineage;outbound candidate source;handoff outcome refs | version、publication candidate、reference / handoff context 已形成 safe refs | 读取 evidence lineage summary | 返回 source version refs、candidate refs、outcome/receipt refs 和 safe marker refs | lineage 不包含 event payload、topic body、receipt body、package body 或 evidence file body | 是 | lineage-body-free evidence candidate | 正式 EV ID 与 artifact path 留 Step 13 |
| TC-ML-IMPACT-001 | semantic change 形成 consumption impact summary | P0 | FR-ML-008;BR-ML-010~011;BR-ML-020 | `ConsumptionImpactSummary`;ConsistencyProtectionPolicy;explicit change rule | current version 存在被消费引用,输入发生语义变化 | 执行 impact evaluation / protection decision | 返回 impact summary / affected refs / safe protection decision | 影响识别必须显式;不静默覆盖旧 current、不直接修 downstream truth | 是 | impact-summary evidence candidate | affected ref fixture 留 Step 7 |
| TC-ML-IMPACT-002 | 下游回报不能反向改写本仓 truth | P0 | FR-ML-008;BR-ML-011;NFR-ML-012~014 | downstream impact return boundary;truth owner;protection decision | 下游返回影响、冲突、失败或不可用 summary | 执行 impact return intake / protection branch | 形成 safe issue / impact marker / manual review surface | 下游回报不改 definition truth、formal version、trace material 或 accepted audit | 是 | downstream-impact-boundary evidence candidate | 入站 payload body 不在本批定义 |
| TC-ML-EVIDENCE-001 | evidence lineage 承接验收 / 审计语境 | P0 | FR-ML-009;BR-ML-022;NFR-ML-011 | evidence lineage;safe report / handoff candidate boundary | 版本、发布或引用已产生可承接证据线索 | 读取 evidence candidate / lineage surface | 返回可供后续验收 / 审计引用的 safe refs / marker / summary | 证据线索不是人工说明;也不定义正式 artifact schema 或报告路径 | 是 | evidence-lineage evidence candidate | Step 13 固定 EV / report schema |
| TC-ML-REPLAY-001 | duplicate command replay stored result only | P0 | NFR-ML-012~014;NFR-ML-016 | `MethodAssetStoredOperationResult`;idempotency guard;no-rerun | accepted command 已完成且 stored result 可读 | 使用相同 operation key / digest 重放 | 返回 stored accepted / rejected surface | 不重跑 mutation、不 append accepted audit、不重新组装 event candidate、不从 current truth 重建 response | 是 | command-replay evidence candidate | call spy 留 Step 9 |
| TC-ML-REPLAY-002 | duplicate inbound / job replay stored receipt / report only | P0 | NFR-ML-012~014;NFR-ML-016 | stored receipt/report;inbound dedup;job duplicate replay | inbound receipt 或 job report 已持久化 | 重放相同 source key / run key | 返回 stored receipt / report summary | 不重读 provider payload、不扫描 adapter、不创建第二 report / candidate / truth mutation | 是 | receipt-report-replay evidence candidate | 具体 source key fixture 留 Step 7 |
| TC-ML-UOW-001 | accepted path atomic commit | P0 | NFR-ML-012~014;BR-ML-020 | UoW;transaction boundary;stored result;candidate refs | accepted formalization / version / impact path 满足条件 | 执行 accepted command | truth/support/material、stored accepted result、trace/audit/lineage refs 和 candidate refs 一起提交 | 不出现只有 truth 无 stored result、只有 event candidate 无 truth、或 audit / trace 半提交 | 是 | uow-atomic-commit evidence candidate | durable isolation 细节留 Step 8/9 |
| TC-ML-UOW-002 | rollback 后无 accepted 残留 | P0 | NFR-ML-012~014 | UoW rollback;safe recovery;no partial residue | 在 accepted transaction 内注入 repository / stored result / candidate save failure | 执行 accepted command 并触发 rollback | 返回 safe failure / recovery surface | 无 accepted truth、stored result、candidate、audit、trace 或 publication outcome 残留 | 是 | uow-rollback evidence candidate | fault injection fixture 留 Step 7 |
| TC-ML-RECOVERY-003 | commit unknown 不用日志 / timeout 私判成功 | P0 | NFR-ML-012~014;NFR-ML-016 | commit unknown recovery source;stored surface / formal read-back | commit 返回 unknown,stored surface / read-back 状态可控 | 执行 retry / recovery read | 仅依据 stored surface、formal read-back 或正式 recovery source 判定 | timeout、runtime log、metric、adapter note、private flag 不能证明 accepted | 是 | commit-unknown evidence candidate | 与 R6.6 保持一致,本批强调 recovery source |
| TC-ML-RECOVERY-004 | stored surface missing 进入 manual / consistency-safe | P0 | NFR-ML-012~014;NFR-ML-016 | stored surface missing rule;manual issue;consistency failure | completed guard 存在但 stored result / receipt / report 缺失或 kind mismatch | 执行 duplicate replay / recovery | 返回 manual / consistency-safe surface 和 safe issue candidate | 不从 current truth、query surface、report body、adapter scan 或 log 重建 stored surface | 是 | stored-missing-recovery evidence candidate | issue schema 留 Step 13 |
| TC-ML-JOB-001 | job duplicate replay stored report | P0 | NFR-ML-013~016;FR-ML-009 | operations job report;stored report;job idempotency guard | job run 已 completed 并有 stored report summary | 使用同一 run key 重放 job | 返回 stored report / progress summary | 不重跑 job body、不刷新 material、不创建第二 report、issue 或 handoff candidate | 是 | job-stored-report evidence candidate | runner command 留 Step 9 |
| TC-ML-JOB-002 | checkpoint resume 使用正式 progress / checkpoint / issue source | P0 | NFR-ML-013~016;FR-ML-008~009 | job checkpoint;progress view;partial issue;resume boundary | job partial / interrupted,checkpoint/progress/report/issue refs 已存在 | 执行 resume | 从正式 checkpoint/progress/report/issue source 继续 | lease、queue offset、scheduler private state 或 current material scan 不能替代 checkpoint | 是 | job-checkpoint-resume evidence candidate | checkpoint fixture 留 Step 7 |
| TC-ML-JOB-003 | partial failure 记录 safe issue 和 report summary | P0 | FR-ML-009;NFR-ML-015~016 | operations fact;safe issue;job report boundary | job 刷新派生 material 时部分 item failed / unavailable | 执行 job partial failure branch | 返回 partial / failed-with-issue report summary | issue / report 只含 safe refs、counts、marker;不含 raw external payload、stack、report body | 是 | job-partial-report evidence candidate | report path/schema 后移 Step 13 |
| TC-ML-JOB-004 | operations job 不修 core truth | P0 | FR-ML-008;NFR-ML-012~016 | job no truth repair;operation contract;truth owner | core truth 缺失、损坏或与派生 material 不一致 | 执行 refresh / recovery / reconciliation job | job 返回 issue / manual / consistency-safe report,不修改 core truth | job 不创建、更新、删除 definition truth、formal version、accepted audit 或 stored command result | 是 | job-no-truth-repair evidence candidate | 真正 repair policy 若需要必须回设计闭口 |

### 4. 本批数据 / 自动化 / evidence 后移记录

| 后移项 | 本批记录 | 后续 Step |
|---|---|---|
| 数据构造 | accepted formalization/version/change、consumption ref、impact input、stored result/receipt/report present/missing、commit unknown、rollback、checkpoint/progress/report/issue、job partial failure。 | Step 7 测试数据设计。 |
| 自动化位置 | application service + fake persistence 覆盖 replay / UoW / recovery;job fake runner 覆盖 checkpoint / report / no truth repair;contract/domain 层补 body-free trace / audit / lineage shell。 | Step 9 自动化与 CI/CD 门禁。 |
| evidence 候选 | trace-formalization、trace-version-change、consumption-trace、audit-accepted、audit-negative、lineage-body-free、impact-summary、command-replay、uow-rollback、commit-unknown、job-report evidence candidate。 | Step 13 测试报告与证据归档。 |
| 环境能力 | 需要 fake UoW、stored surface store、lineage/audit spy、write guard、fault injection、checkpoint fake、report fake、partial failure injection 和 no-truth-repair guard。 | Step 8 环境与配置矩阵;Step 9 automation gate。 |
| 验收承接 | 支撑追溯能力、消费一致性保护、证据线索承接、单一 truth、显式变化、重复维护 no-write/no-rerun 和观测材料不替代 truth。 | Step 12 / `06-验收标准.md`。 |

### 5. 本批停审

| 停审项 | 结论 | 说明 |
|---|---|---|
| 是否覆盖 FR-ML-007~009 | pass | trace material、impact protection、evidence lineage、job report 均有候选用例。 |
| 是否覆盖 BR-ML-019~022 | pass | governance basis only、formalization / semantic change trace、consumption trace、evidence handoff-ready 均已覆盖。 |
| 是否覆盖 NFR-ML-009~016 | pass | 追溯、证据线索、stored replay、UoW、rollback、commit unknown、job report、no truth repair 和 observability-not-truth 均有断言。 |
| 是否每个用例有正式设计依据 | pass | 均回指 trace / audit / lineage / impact / stored surface / UoW / recovery / job report / checkpoint 口径。 |
| 是否未写 config / redaction / metric 专项用例 | pass | 仅保留后移记录,具体 config、dependency、redaction、observability 批次留 R6.11/R6.12。 |
| 是否未写 fixture / CI / evidence schema | pass | 只写数据需求、自动化候选和 evidence candidate,不写正式 artifact path、JSON schema 或 CI command。 |
| 是否未修改正式 `05-测试方案.md` | pass | 本批只更新中间产物。 |

### 6. R6.11 进入门禁

| 门禁项 | 裁决 |
|---|---|
| R6.10 是否已生成本批测试场景表 | pass |
| R6.10 是否已生成本批候选用例矩阵 | pass |
| R6.10 是否已记录数据 / 自动化 / evidence 后移 | pass |
| R6.10 是否已完成本批停审 | pass |
| 是否未写 config / dependency / redaction / observability 后续批次用例 | pass |
| 是否未修改正式 `05-测试方案.md` | pass |

next_allowed_action: 等待用户确认后进入 Step 6 `R6.11 config / dependency / redaction / observability 用例:先思考`;只允许思考 FR-ML-001~009 横切 config 红线、BR-ML / NFR-ML 中的 config validation、dependency availability、secret/redaction、safe diagnostic、low-cardinality metric、trace/span/audit/report body-free、marker copy-only 和 `R6.12 config / dependency / redaction / observability 用例:再写入` 边界;不得直接修改正式 `05-测试方案.md`;不得写 cross-case audit / final coverage closure 等后续批次;不得写 fixture、环境矩阵、CI suite、evidence schema、验收标准、实施计划或 implementation code。

---

## R6.11 config / dependency / redaction / observability 用例:先思考

### 1. 当前模块目标

`R6.11` 只思考第五批横切用例边界:config validation、source priority / conflict、forbidden configurable boundary、dependency availability、profile contamination、secret / raw body redaction、safe diagnostic、low-cardinality metric、trace/span/audit/report body-free、marker copy-only 和 source-missing stop。

当前模块不写最终 TC 行、测试步骤、fixture、环境矩阵、CI suite、evidence schema、验收标准或实施计划。`R6.12` 才允许把本批思考转成 `TC-ML-CONFIG-*` / `TC-ML-DEPENDENCY-*` / `TC-ML-REDACTION-*` / `TC-ML-DIAGNOSTIC-*` / `TC-ML-OBSERVABILITY-*` / `TC-ML-METRIC-*` / `TC-ML-MARKER-*` 候选行。

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm_to_R6.12 |
| 用户确认 | 已确认从 `R6.10` 推进到 `R6.11`。 |
| 当前允许 | 思考 config 红线、dependency unavailable / degraded、secret / raw body 禁输、redaction fail-closed、safe diagnostic、metric 低基数、trace/span/audit/report body-free、marker copy-only、source-missing stop 和 R6.12 写入边界。 |
| 当前禁止 | 修改正式 `05-测试方案.md`;写最终 TC 行;写 cross-case audit / final coverage closure 后续批次;写 fixture、CI gate、artifact path、JSON schema、正式 EV、验收 verdict、实施计划或 implementation code。 |

### 2. 本批次正式输入

| 输入 | 与 R6.11 的关系 | R6.11 裁决 |
|---|---|---|
| `04-配置设计.md` §4 | 配置类别、更新时机和禁止配置化边界。 | 用例必须覆盖配置不得改变 truth owner、state transition、query no-write、stored replay、transaction boundary、marker source、body-free rule 和 public DTO schema。 |
| `04-配置设计.md` §5 | 来源链、优先级、冲突处理和不可用策略。 | 用例必须覆盖 high-priority illegal fail-fast、重复 key fail-fast、raw secret/body reject、test fixture 不进入 production-like、P0 不启用 config center/admin override。 |
| `04-配置设计.md` §8 | sensitive ref、secret、credential、target、route、replay root 和 redaction 边界。 | 用例必须覆盖 opaque ref only、redacted digest only、raw secret / endpoint / route / payload body 禁入日志、错误、审计、trace、report。 |
| `04-配置设计.md` §11 | fail-fast、fail-closed、rejected、degraded、delayed、failed marker、no activation 策略。 | 用例必须覆盖 required startup config missing、unsafe redaction、dependency unavailable、publisher/handoff target failed、query read material unavailable 的 safe branch。 |
| `03-详细设计.md` §14 | observability、audit、trace/span、operations fact 和 redaction 边界。 | 用例必须覆盖 observability 只能观察 formal refs / marker / diagnostic,不能替代 truth、stored replay、report、checkpoint、publication outcome 或 recovery source。 |
| `03-详细设计.md` §15.7 | error / config / observability 最小测试切口。 | 用例必须覆盖 invalid entry、config validation、adapter availability marker copy-only、redaction、source-missing stop。 |
| FR-ML-001~009 | 本批作为横切红线,保护前四批所有功能能力。 | config / dependency / observability 用例不重测业务主线,只验证横切红线不会破坏正式定义、版本、消费、追溯、证据和 job 语义。 |
| BR-ML / NFR-ML | 数据归属、相邻仓边界、追溯、一致性、可观测和安全红线。 | 用例必须防止配置、日志、metric、trace、report 或 adapter fallback 变成第二 truth 或越权正文存储。 |

### 3. 场景拆分思考

| 场景族 | 正向方向 | 负向 / 边界方向 | 后续用例族 |
|---|---|---|---|
| config validation / source conflict | 合法 profile、adapter slot、safe ref、job-run input 经校验后进入 runtime readiness 或 scoped action。 | 非法高优先级值 silent fallback、重复 key last-write-wins、legacy key 兼容未闭口、config center/admin override 进入 P0。 | config-validation candidate |
| forbidden configurable boundary | 配置只影响 runtime assembly、adapter binding、target binding、technical knobs。 | 配置开关改变 truth owner、state transition、query write、stored replay、transaction boundary、marker source、public DTO schema。 | config-redline candidate |
| dependency availability | required dependency missing fail-fast 或 scoped rejected;optional read / resolver / publisher / handoff unavailable 走正式 unavailable/degraded/failed marker。 | fake fallback、raw adapter error 作为 public marker、delivery proves truth、failure rollback truth。 | dependency-availability candidate |
| profile / fixture isolation | local / ci / integration / operations-replay 只能用各自允许的 fake / fixture / replay root。 | production-like 使用 fixture、raw secret、fake fallback、replay raw body 或 test override。 | profile-isolation candidate |
| secret / raw body redaction | config、env、entry-local、job input、adapter output 只保留 opaque ref、redacted digest、safe issue。 | password、token、cert、DSN、endpoint、route secret、external payload、provider response、raw fixture body 进入输出面。 | redaction-secret candidate |
| diagnostic safe surface | error response、safe issue、job report、audit 只输出 safe message/ref、issue ref、marker category、redacted digest。 | raw exception text、stack、SQL、HTTP body、provider body、full sensitive ref 被持久化或公开。 | diagnostic-safe candidate |
| observability low-cardinality | metrics 只使用 family/kind/state/result/category 等低基数标签。 | truth ref、operation key、trace id、candidate/report/receipt ref、route param、free text、payload digest 作为 label。 | metric-cardinality candidate |
| trace/span/audit/report body-free | trace/span/log/audit/operations fact 只记录 formal refs、marker、diagnostic、stored surface refs。 | payload body、topic、transport response、delivery receipt body、report body、scheduler private state 作为断言来源。 | observability-body-free candidate |
| marker copy-only / source-missing stop | marker 来自 formal resolver / mapper / summary / availability source;缺 source 时停审或 safe failure。 | 从 raw adapter error、route param、private map、test helper、metric/log 合成 marker。 | marker-source candidate |

### 4. 断言来源思考

| 断言点 | 正式来源 | R6.12 写入方式 |
|---|---|---|
| config fail-fast / fail-closed | `04` §5 / §9 / §11;safe config issue。 | 用例断言非法来源、重复 key、raw secret/body、unsafe redaction 和 forbidden boundary override 不激活。 |
| no semantic config override | `04` §4;`03` §13 / §15.7。 | 用例断言配置不能改变 domain / protocol / transaction / replay / marker / DTO 语义。 |
| dependency unavailable semantics | `04` §5 / §7 / §11;`03` error / availability cuts。 | 用例断言 required missing fail-fast / rejected,optional unavailable 复制 formal marker,不 fake fallback。 |
| sensitive output redaction | `04` §8;`03` §14.6。 | 用例断言日志、错误、audit、trace、job report、generated artifact 不含 raw secret、raw body 或 full sensitive ref。 |
| safe diagnostic | `03` §14.1 / §14.5;`04` §11。 | 用例断言 diagnostic 只能是 safe issue/ref/marker category,不得作为 recovery truth source。 |
| low-cardinality metric | `03` §14.3。 | 用例断言 metric labels 不含 per-ref、trace id、route param、free text、payload digest 或 marker ref。 |
| trace/span body-free | `03` §14.4。 | 用例断言 correlation refs 可存在,但 payload、transport response、provider body、scheduler private payload 禁止。 |
| marker copy-only | `03` §15.7;`04` §4 marker source redline。 | 用例断言 public marker 必须复制 formal source,缺 mapper/source/schema 时不得由测试或实现补口。 |

### 5. 候选用例族思考

R6.11 不生成最终用例行,但先固定 R6.12 的候选族。

| 候选族 | 覆盖意图 | R6.12 允许生成的候选 ID 范围 |
|---|---|---|
| config-validation candidate | startup / job / entry / test config strict validation、source conflict、no silent fallback。 | `TC-ML-CONFIG-*` |
| config-redline candidate | forbidden configurable boundary 不被配置开关改变。 | `TC-ML-CONFIG-*`;`TC-ML-MARKER-*` |
| dependency-availability candidate | store / resolver / publisher / handoff / diagnostic sink unavailable safe branch。 | `TC-ML-DEPENDENCY-*` |
| profile-isolation candidate | local / ci / integration / operations-replay / production-like profile 隔离和 fixture 污染阻断。 | `TC-ML-CONFIG-*`;`TC-ML-DEPENDENCY-*` |
| redaction-secret candidate | secret / credential / endpoint / route / raw body / replay root 安全输出边界。 | `TC-ML-REDACTION-*` |
| diagnostic-safe candidate | safe issue、safe message/ref、redacted digest 和 report issue 输出边界。 | `TC-ML-DIAGNOSTIC-*` |
| metric-cardinality candidate | metric 低基数 label、禁止 per-ref / free text / trace id。 | `TC-ML-METRIC-*`;`TC-ML-OBSERVABILITY-*` |
| observability-body-free candidate | log / trace / span / audit / operations fact / report body-free。 | `TC-ML-OBSERVABILITY-*`;`TC-ML-REDACTION-*` |
| marker-source candidate | marker copy-only、source missing stop、no synthetic marker。 | `TC-ML-MARKER-*`;`TC-ML-DEPENDENCY-*` |

### 6. 数据 / 自动化 / evidence 后移思考

| 主题 | R6.11 可记录 | 后续承接 |
|---|---|---|
| 数据需求 | 合法 / 非法 profile、重复 key、高优先级非法来源、raw secret/body、unsafe redaction、missing required dependency、optional unavailable marker、production-like fixture contamination、metric label sample。 | Step 7 固定 builders / fixtures / invalid config samples / adapter failure fakes。 |
| 自动化候选 | config validator / runtime builder fake、entry precheck、adapter availability fake、redaction scan、metric label scanner、log/trace/report safe-output scanner、marker-source guard。 | Step 9 固定 suite、command、required check。 |
| evidence 候选 | config-validation、config-redline、dependency-availability、profile-isolation、redaction-secret、diagnostic-safe、metric-cardinality、observability-body-free、marker-source evidence candidate。 | Step 13 固定 EV ID、artifact/report path、schema、retention 和 review status。 |
| 环境能力 | 需要 controlled config loader、source priority harness、fake dependency registry、safe diagnostic sink、redaction scanner、metric capture、trace/log/report capture 和 no-synthetic-marker guard。 | Step 8 环境与配置矩阵;Step 9 automation gate。 |
| 验收承接 | 支撑安全边界、配置不改变语义、dependency failure 安全降级、observability 不替代 truth、no raw body/secret 和 no synthetic marker。 | Step 12 / `06-验收标准.md`。 |

### 7. R6.12 写入边界思考

`R6.12 config / dependency / redaction / observability 用例:再写入` 只能写本批候选用例行。

允许写入:

1. 本批测试场景表。
2. `TC-ML-CONFIG-*` / `TC-ML-DEPENDENCY-*` / `TC-ML-REDACTION-*` / `TC-ML-DIAGNOSTIC-*` / `TC-ML-OBSERVABILITY-*` / `TC-ML-METRIC-*` / `TC-ML-MARKER-*` 候选用例行。
3. 每行的需求 / 规则来源、设计依据、前置条件、输入 / 操作、预期结果、断言点、自动化候选、证据候选和停审备注。
4. 本批数据 / 自动化 / evidence 后移记录。
5. 本批 stop-review 和 `R6.13 cross-case audit / closure 用例:先思考` 进入门禁。

禁止写入:

1. cross-case audit、final coverage closure、Step 6 总停审等后续批次内容。
2. 测试数据 fixture、seed JSON、config sample 文件、环境矩阵、CI suite、script command。
3. 正式 evidence ID、artifact path、JSON schema、report schema、验收 gate 或实施计划。
4. 未在 `03/04` 闭合的 config key、profile、secret provider、availability marker、degraded marker、diagnostic sink、metric schema、log field schema、redaction rule schema 或 artifact schema。

### 8. R6.11 stop-review

| 检查项 | 结果 |
|---|---|
| 是否只思考 config / dependency / redaction / observability 批次 | pass |
| 是否承接 `04` §4 / §5 / §8 / §11 和 `03` §14 / §15.7 | pass |
| 是否纳入 fail-fast、fail-closed、no silent fallback、profile isolation、marker copy-only、safe diagnostic、low-cardinality metric 和 no raw body/secret | pass |
| 是否未生成最终 TC 行 | pass |
| 是否未写 cross-case audit / final coverage closure 后续批次内容 | pass |
| 是否未写测试数据、环境、CI、evidence schema、验收或实施内容 | pass |
| 是否形成 R6.12 写入边界 | pass |
| 是否未修改正式 `05-测试方案.md` | pass |

next_allowed_action: 等待用户确认后进入 Step 6 `R6.12 config / dependency / redaction / observability 用例:再写入`;只允许写入本批测试场景表、`TC-ML-CONFIG-*` / `TC-ML-DEPENDENCY-*` / `TC-ML-REDACTION-*` / `TC-ML-DIAGNOSTIC-*` / `TC-ML-OBSERVABILITY-*` / `TC-ML-METRIC-*` / `TC-ML-MARKER-*` 候选用例行、本批数据 / 自动化 / evidence 后移记录、本批 stop-review 和 `R6.13 cross-case audit / closure 用例:先思考` 进入门禁;不得直接修改正式 `05-测试方案.md`;不得写 cross-case audit / final coverage closure 后续批次正文;不得写 fixture、环境矩阵、CI suite、evidence schema、验收标准、实施计划或 implementation code。

---

## R6.12 config / dependency / redaction / observability 用例:再写入

### 1. 当前模块状态

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm_to_R6.13 |
| 用户确认 | 已确认从 `R6.11` 推进到 `R6.12`。 |
| 本模块写入范围 | 本批测试场景表、config / dependency / redaction / diagnostic / observability / metric / marker 候选用例行、数据 / 自动化 / evidence 后移记录、本批 stop-review、`R6.13` 进入门禁。 |
| 本模块禁止范围 | 正式 `05-测试方案.md` 正文、cross-case audit / final coverage closure 后续批次、fixture、环境矩阵、CI suite、evidence schema、验收标准、实施计划和 implementation code。 |

### 2. 本批测试场景表

| 场景族 | 覆盖需求 / 规则 | 设计依据 | 本批用例目标 |
|---|---|---|---|
| config validation / source conflict | `04` §5 / §9 / §11;NFR-ML-012~016 | source chain、strict validation、safe config issue、fail-fast / rejected | 验证非法来源、重复 key、raw secret/body 和 unsafe redaction 不被 silent fallback 或隐式激活。 |
| forbidden configurable boundary | `04` §4;`03` §13 / §15.7 | forbidden configurable boundary;static design boundary | 验证配置不得改变 truth owner、state transition、query no-write、stored replay、transaction boundary、marker source、body-free rule 或 DTO schema。 |
| dependency availability | `04` §5 / §11;`03` §15.7 | adapter availability、degraded / unavailable marker、failed marker | 验证 required dependency fail-fast / rejected,optional dependency unavailable 复制正式 marker 且不 fake fallback。 |
| profile / fixture isolation | `04` §6 / §8 / §11 | profile matrix、test fixture isolation、production-like redline | 验证 local / ci / integration / operations-replay / production-like 的 fixture、replay root 和 secret 边界不互相污染。 |
| secret / raw body redaction | `04` §8;`03` §14.6 | sensitive ref、redacted digest、body-free output | 验证 config、env、entry-local、job input、adapter output 到日志 / 错误 / audit / trace / report 的全链路不泄露 raw secret/body。 |
| safe diagnostic / report issue | `04` §11;`03` §14.1 / §14.5 | safe issue、safe message/ref、diagnostic ref、report issue | 验证 diagnostic 只能输出 safe ref / category / redacted digest,不得成为 recovery truth source。 |
| observability low-cardinality | `03` §14.3 | metric family/kind/state/result/category | 验证 metric label 低基数,不把 truth ref、operation key、trace id、route param、payload digest 或 free text 作为 label。 |
| trace/span/audit/report body-free | `03` §14.4~§14.6 | correlation refs、audit refs-only、operations fact、report boundary | 验证 log / trace / span / audit / operations fact / report 只记录 safe refs、marker、diagnostic 和 stored surface refs。 |
| marker copy-only / source-missing stop | `03` §15.7;`04` §4 | formal marker source、source-missing stop、no synthetic marker | 验证 public marker 必须来自 formal resolver / mapper / summary / availability source,缺 source 时停审或 safe failure。 |

### 3. 本批用例矩阵

| 用例 ID | 场景 | 优先级 | 需求 / 规则来源 | 设计依据 | 前置条件 | 输入 / 操作 | 预期结果 | 断言点 | 自动化候选 | 证据候选 | 停审备注 |
|---|---|---|---|---|---|---|---|---|---|---|---|
| TC-ML-CONFIG-001 | 高优先级非法配置 fail-fast / rejected | P0 | `04` §5;NFR-ML-012~016 | source chain;strict validation;safe config issue | defaults / file 存在合法值,env 或 entry-local 提供非法 high-priority 值 | 执行 startup / entry / job config validation | 返回 fail-fast 或 scoped rejected;低优先级值不被自动回退使用 | 无 runtime Ready、无 facade dispatch、无 truth mutation、无 event candidate、无 stored replay 改写 | 是 | config-source-conflict evidence candidate | 具体 sample 留 Step 7 |
| TC-ML-CONFIG-002 | 单文件重复 key 不采用 last-write-wins | P0 | `04` §5 | config file conflict;fail-fast | config file 中存在重复 key 或 alias / legacy key 并存 | 执行 config load / merge | 返回 safe config issue 并阻断激活 | 不依赖 parser 隐式覆盖;不把 legacy key 当当前真相源 | 是 | config-duplicate-key evidence candidate | legacy migration 规则若需要回 §13 |
| TC-ML-CONFIG-003 | forbidden configurable boundary 不可覆盖语义 | P0 | `04` §4;`03` §15.7 | static design boundary;forbidden boundary redline | 配置输入尝试打开 query write、关闭 stored replay 或改变 state transition | 执行 config validation / runtime builder | 返回 design violation / fail-fast / no activation | 配置不能改变 truth owner、state transition、query no-write、stored replay、transaction boundary、marker source、body-free rule 或 public DTO schema | 是 | config-redline evidence candidate | 不新增 config key |
| TC-ML-CONFIG-004 | config center / admin override 不进入 P0 | P0 | `04` §4~§5 | watch_only source;P0 source chain | P0 profile 中配置 remote config center 或 admin live override | 执行 source chain validation | 返回 unsupported / watch-only / fail-fast surface | 不承诺 hot reload、live override、admin 权限或 rollback contract | 是 | config-watch-only evidence candidate | P1/P2 启用需回架构 / `03` |
| TC-ML-CONFIG-005 | profile fixture 不污染 production-like | P0 | `04` §6 / §8 / §11 | profile matrix;fixture isolation;fail-closed | production-like 或 staging-like profile 引用 test fixture、fake adapter 或 raw replay body | 执行 startup / job-run-start validation | 返回 reject / fail-fast;不激活 profile | production-like 无 fixture、无 fake fallback、无 raw replay body、无 ordinary raw secret | 是 | profile-isolation evidence candidate | production readiness 不在本批证明 |
| TC-ML-DEPENDENCY-001 | required store / adapter binding missing fail-fast | P0 | `04` §5 / §11;`03` §15.7 | adapter binding;runtime builder;availability cut | required repository / material store / resolver binding 缺失或 invalid | 执行 startup runtime builder | builder not Ready,返回 safe config issue / adapter slot category | 不构造 half-assembled facade;不 fallback 到 mismatched store 或 production fake | 是 | dependency-required-missing evidence candidate | 具体 adapter product 留配置/实施 |
| TC-ML-DEPENDENCY-002 | optional read / resolver unavailable 返回正式 marker | P0 | `04` §5 / §11;NFR-ML-004~006 | degraded / unavailable marker;query no-write | optional read material stale、resolver unavailable 或 diagnostic sink unavailable | 执行 query / read / diagnostic branch | 返回 degraded / unavailable / safe issue surface | marker 复制 formal source;query 不 repair、不 hidden write、不从 raw adapter error 合成 marker | 是 | dependency-unavailable evidence candidate | marker source 缺失时停审 |
| TC-ML-DEPENDENCY-003 | publisher / handoff target failed 不回滚 truth | P0 | `04` §5 / §11;FR-ML-006 | failed marker;publication/handoff outcome;no rollback | publisher 或 handoff target unavailable / failed | 执行 publication / handoff branch | 返回 failed marker / report issue / delayed outcome | delivery ack 不证明 truth;failure 不回滚 accepted truth 或 stored result;不保存 transport response body | 是 | dependency-target-failed evidence candidate | 与 R6.8 seam 用例互补 |
| TC-ML-REDACTION-001 | ordinary config / env 禁 raw secret / raw body | P0 | `04` §8;NFR-ML-007~008 | sensitive ref;secret boundary;fail-closed | config file / env / entry-local / job input 含 password、token、DSN、endpoint body、payload body 或 raw fixture body | 执行 validation | 返回 fail-closed / rejected / safe issue | raw secret/body 不进入 config digest、log、audit、trace、report 或 evidence candidate | 是 | redaction-secret-input evidence candidate | 不定义 secret provider schema |
| TC-ML-REDACTION-002 | adapter raw error / provider response 必须 redacted | P0 | `04` §8 / §11;`03` §14.6 | redacted failure ref;safe diagnostic | adapter 返回 raw HTTP/SQL/provider error body | 执行 resolver / publisher / handoff / job failure branch | 输出 safe issue / marker / redacted digest | 不持久化 raw exception text、stack、SQL、HTTP body、provider response、full sensitive ref | 是 | redaction-adapter-output evidence candidate | scanner 实现留 Step 9 |
| TC-ML-REDACTION-003 | report / generated artifact 不含 raw config 或 package body | P0 | `04` §8;`03` §14.5~§14.6 | job report boundary;operations fact;body-free report | job / handoff / report 生成 safe summary | 检查 report / generated artifact candidate | 仅包含 marker refs、safe issue refs、counts、redacted report refs | 无 raw config files、secret、package body、external GRC response body、evidence body | 是 | redaction-report evidence candidate | artifact path/schema 留 Step 13 |
| TC-ML-DIAGNOSTIC-001 | diagnostic safe surface 不作为 recovery truth | P0 | `04` §11;`03` §14.1 / §14.5 | safe diagnostic source;operations fact boundary | command / query / job 出现 safe diagnostic issue | 执行 recovery / retry / report branch | diagnostic 作为 safe issue/ref 输出,不作为 accepted / replay / checkpoint 判定来源 | recovery 仍依赖 stored surface、formal marker、checkpoint 或 owning source;不依赖 log/metric/diagnostic 文本 | 是 | diagnostic-safe evidence candidate | 具体 issue schema 留 Step 13 |
| TC-ML-METRIC-001 | metric labels 保持低基数 | P0 | `03` §14.3;NFR-ML-015~016 | metric cuts;low-cardinality rule | command/query/job/adapter metrics 被采集 | 检查 metric label candidate | labels 只包含 family/kind/state/result/category 等低基数项 | 无 truth ref、operation key、actor id、trace id、route param、candidate/report/receipt ref、free text、payload digest、marker ref | 是 | metric-cardinality evidence candidate | 指标名和阈值不在本批定义 |
| TC-ML-OBSERVABILITY-001 | trace/span 只记录 correlation refs 和 safe marker | P0 | `03` §14.4;NFR-ML-015~016 | trace/span cuts;body-free correlation | command/query/inbound/outbound/job execution 有 trace/span | 检查 span payload candidate | 仅包含 operation context ref、stored surface ref、candidate/outcome/report/checkpoint refs 和 safe marker | 无 request body、material body、provider payload、transport response、topic、scheduler private payload | 是 | trace-span-body-free evidence candidate | trace backend 产品不在本批定义 |
| TC-ML-OBSERVABILITY-002 | audit / operations fact body-free 且不伪造 accepted fact | P0 | `03` §14.5;BR-ML-020;NFR-ML-016 | audit/operations fact cuts | accepted、rejected、duplicate、query、job、publication/handoff 分支均发生 | 检查 audit / operations fact candidate | accepted fact 只来自 accepted UoW;job/outcome 只记录 operations fact refs | rejected/duplicate/query 不伪造成 accepted audit;无 raw body、raw reason、transport response 或 core truth repair | 是 | audit-operations-fact evidence candidate | 与 R6.10 audit 用例互补 |
| TC-ML-MARKER-001 | public degraded / unavailable marker copy-only | P0 | `03` §15.7;`04` §4 / §11 | formal marker source;availability marker;no synthetic marker | resolver / mapper / availability source 返回正式 marker | 执行 query / adapter / handoff / job degraded branch | public surface 复制 formal marker / category | 不从 raw adapter error、HTTP code、route param、topic、private map、metric/log 或 test helper 合成 marker | 是 | marker-copy-only evidence candidate | 缺 formal marker source 时不得补口 |
| TC-ML-MARKER-002 | source-missing stop 不由 fixture 私补 | P0 | `03` §15.7;设计真相源闭环标准 | source-missing stop;no private fallback | marker/source/mapper/port/schema 缺失或不可读 | 执行相关 branch / test design review | 停审并返回 owning design source,或返回 formal safe failure | 不用 fixture、private fake map、raw ID、route param、payload string 或 old doc 生成正式 marker / schema | 是 | source-missing-stop evidence candidate | 这是设计门禁用例,不是实现绕行 |

### 4. 本批数据 / 自动化 / evidence 后移记录

| 后移项 | 本批记录 | 后续 Step |
|---|---|---|
| 数据构造 | 合法 / 非法 profile、重复 key、高优先级非法来源、forbidden boundary override、raw secret/body、missing required dependency、optional unavailable marker、production-like fixture contamination、safe / unsafe metric label candidate。 | Step 7 测试数据设计。 |
| 自动化位置 | config validator / runtime builder / entry precheck / adapter availability fake / redaction scanner / metric label scanner / trace-log-report scanner / marker-source guard。 | Step 9 自动化与 CI/CD 门禁。 |
| evidence 候选 | config-source-conflict、config-redline、dependency-unavailable、profile-isolation、redaction-secret、diagnostic-safe、metric-cardinality、trace-span-body-free、marker-copy-only、source-missing-stop evidence candidate。 | Step 13 测试报告与证据归档。 |
| 环境能力 | 需要 controlled config loader、source priority harness、fake dependency registry、safe diagnostic sink、redaction scan、metric capture、trace/log/report capture 和 no-synthetic-marker guard。 | Step 8 环境与配置矩阵;Step 9 automation gate。 |
| 验收承接 | 支撑配置不改变语义、dependency failure 安全降级、安全输出、observability 不替代 truth、metric 低基数、no raw body/secret 和 no synthetic marker。 | Step 12 / `06-验收标准.md`。 |

### 5. 本批停审

| 停审项 | 结论 | 说明 |
|---|---|---|
| 是否覆盖 config validation / source conflict / forbidden boundary | pass | `TC-ML-CONFIG-001~005` 覆盖 fail-fast、no silent fallback、no semantic config override、watch_only 和 profile isolation。 |
| 是否覆盖 dependency availability | pass | `TC-ML-DEPENDENCY-001~003` 覆盖 required missing、optional unavailable 和 publisher/handoff target failed。 |
| 是否覆盖 secret / raw body / diagnostic / observability | pass | redaction、diagnostic、metric、trace/span、audit/operations fact 均有候选用例。 |
| 是否覆盖 marker copy-only / source-missing stop | pass | `TC-ML-MARKER-001~002` 明确禁止 synthetic marker 和 fixture/private fallback。 |
| 是否每个用例有正式设计依据 | pass | 均回指 `04` §4 / §5 / §8 / §11 或 `03` §14 / §15.7。 |
| 是否未写 cross-case audit / final closure | pass | 仅写本批用例和后移记录,总审计留 R6.13/R6.14。 |
| 是否未写 fixture / CI / evidence schema | pass | 只写数据需求、自动化候选和 evidence candidate。 |
| 是否未修改正式 `05-测试方案.md` | pass | 本批只更新中间产物。 |

### 6. R6.13 进入门禁

| 门禁项 | 裁决 |
|---|---|
| R6.12 是否已生成本批测试场景表 | pass |
| R6.12 是否已生成本批候选用例矩阵 | pass |
| R6.12 是否已记录数据 / 自动化 / evidence 后移 | pass |
| R6.12 是否已完成本批停审 | pass |
| 是否未写 cross-case audit / final coverage closure 后续批次 | pass |
| 是否未修改正式 `05-测试方案.md` | pass |

next_allowed_action: 等待用户确认后进入 Step 6 `R6.13 cross-case audit / closure 用例:先思考`;只允许思考 Step 6 已写用例的跨批次审计、编号重复、断言重复、覆盖缺口、phase 越界、evidence candidate 冲突、P0/P1/P2 边界、design blocker 和 `R6.14 cross-case audit / closure 用例:再写入` 边界;不得直接修改正式 `05-测试方案.md`;不得写测试数据 fixture、环境矩阵、CI suite、evidence schema、验收标准、实施计划或 implementation code。

---

## R6.13 cross-case audit / closure 用例:先思考

### 1. 当前模块目标

`R6.13` 只思考 Step 6 已写候选用例的跨批次审计和收口边界,不新增业务用例,不重写已确认批次正文,不直接修改正式 `05-测试方案.md`。

当前模块要为 `R6.14` 固定审计维度、发现项分类、可在 Step 6 内修正的范围、必须后移到 Step 7/8/9/13 的范围,以及 Step 7 进入条件。`R6.14` 才允许写入正式跨批次审计表、必要的 ID 修正记录、Step 6 总停审和 Step 7 进入门禁。

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm_to_R6.14 |
| 用户确认 | 已确认从 `R6.12` 推进到 `R6.13`。 |
| 当前允许 | 思考 Step 6 已写 83 条候选用例行的编号唯一性、批次边界、需求覆盖、断言重复、phase 越界、evidence candidate 冲突、后移项一致性、design blocker 和 R6.14 写入边界。 |
| 当前禁止 | 修改正式 `05-测试方案.md`;新增业务用例行;写 fixture、环境矩阵、CI suite、artifact path、JSON schema、正式 EV、验收 verdict、实施计划或 implementation code。 |

### 2. 已写用例批次盘点

| 批次 | 写入模块 | 候选行规模 | 主要 ID 族 | 审计重点 |
|---|---|---:|---|---|
| definition truth / identity / catalog | R6.4 | 12 | `TC-ML-TRUTH-*`;`TC-ML-IDENTITY-*`;`TC-ML-CATALOG-*`;`TC-ML-BOUNDARY-*`;`TC-ML-SHELL-*`;`TC-ML-QUERY-*`;`TC-ML-POLLUTION-*` | truth owner、catalog no-write、old material pollution、public shell body-free。 |
| formal version / explicit change / state | R6.6 | 15 | `TC-ML-FORMALIZATION-*`;`TC-ML-VERSION-*`;`TC-ML-CHANGE-*`;`TC-ML-STATE-*`;`TC-ML-IDEMP-*`;`TC-ML-RECOVERY-*` | formalization trigger、version stability、state guard、idempotency、commit unknown / conflict。 |
| controlled consumption / distribution / seam | R6.8 | 20 | `TC-ML-CONSUMPTION-*`;`TC-ML-QUERY-*`;`TC-ML-BOUNDARY-*`;`TC-ML-DISTRIBUTION-*`;`TC-ML-PUBLISHER-*`;`TC-ML-HANDOFF-*`;`TC-ML-AVAILABILITY-*`;`TC-ML-SHELL-*` | downstream boundary、query no-write、publisher/handoff seam、availability marker、body-free shell。 |
| traceability / consistency / job / recovery | R6.10 | 19 | `TC-ML-TRACE-*`;`TC-ML-AUDIT-*`;`TC-ML-LINEAGE-*`;`TC-ML-IMPACT-*`;`TC-ML-EVIDENCE-*`;`TC-ML-REPLAY-*`;`TC-ML-UOW-*`;`TC-ML-RECOVERY-*`;`TC-ML-JOB-*` | trace/audit refs-only、impact protection、stored replay、UoW、job report、no truth repair。 |
| config / dependency / redaction / observability | R6.12 | 17 | `TC-ML-CONFIG-*`;`TC-ML-DEPENDENCY-*`;`TC-ML-REDACTION-*`;`TC-ML-DIAGNOSTIC-*`;`TC-ML-METRIC-*`;`TC-ML-OBSERVABILITY-*`;`TC-ML-MARKER-*` | config redline、dependency unavailable、redaction、safe diagnostic、metric low-cardinality、marker source。 |

### 3. 跨批次审计维度思考

| 审计维度 | 当前观察 | R6.14 写入方式 |
|---|---|---|
| ID 唯一性 | 行级候选用例总数为 83;发现 `TC-ML-RECOVERY-001` / `TC-ML-RECOVERY-002` 在 R6.6 与 R6.10 重复使用。 | 写入 ID 冲突审计;建议将 R6.10 的 recovery 行作为同族后续编号处理,并记录不改变用例语义。 |
| 批次边界 | 各批次基本按 R6.2 计划推进;R6.10 与 R6.6 都覆盖 recovery,但语义层次不同。 | 标记 recovery 语义重叠为可接受重叠,ID 冲突必须修正;不新增新用例。 |
| 需求覆盖 | FR-ML-001~009、BR-ML-001~022、NFR-ML-004~016 均至少进入一个 P0 候选族。 | 写覆盖收口表;不重新生成 Step 5 矩阵。 |
| 断言重复 | query no-write、body-free、stored replay、marker copy-only 多次出现,但分别绑定不同接口 / 场景 / 横切红线。 | 写“允许重复断言族”和“禁止重复 ID / 伪覆盖”区分。 |
| phase 越界 | production-like、真实 provider、secret provider、capacity、multi-region、multi-tenant、真实 dashboard / runbook 均保持后移或 P1/P2。 | 写 phase 边界审计;命中 P1/P2 不作为 P0 pass 前置。 |
| evidence candidate 冲突 | 当前只写 evidence candidate,未写 EV ID、artifact path、JSON schema。多个用例共享 evidence family 是可接受候选。 | 写 evidence 候选审计;正式 EV / path / schema 留 Step 13。 |
| 数据 / 环境 / 自动化后移 | 各批次均把 fixture、fault injection、profile matrix、CI suite、redaction scan、metric scanner 后移。 | 写后移一致性表,将 Step 7/8/9/13 承接项分组。 |
| design blocker | marker source、mapper/source/schema 缺失、secret provider、config key、evidence schema、artifact schema 缺失均不得由 Step 6 补口。 | 写 blocker 分类和暂停规则;不在 Step 6 发明 schema / key / marker。 |
| historical pollution | `TC-ML-POLLUTION-001` 已作为旧 MethodContent / publish / snapshot / fingerprint / outbox 污染守卫。 | 在总审计中确认旧 `05/06/07` 仍只作 historical / old direction input。 |

### 4. 发现项分类思考

| 发现项 | 严重性 | 当前处理意图 |
|---|---|---|
| `TC-ML-RECOVERY-001~002` ID 重复 | must_fix_before_step6_closure | R6.14 需要写明冲突并执行最小修正;优先修正 R6.10 recovery 行编号,避免改变 R6.6 已确认语义。 |
| recovery 断言族跨 R6.6 / R6.10 重叠 | acceptable_with_note | R6.6 偏 command / version recovery;R6.10 偏 recovery source / stored surface / job consistency,语义不同。 |
| body-free / redaction / no raw body 多批出现 | acceptable_with_note | 属于横切红线,允许多接口重复覆盖;R6.14 只审计不合并。 |
| evidence candidate 复用 | acceptable_deferral | evidence family 复用不是 EV ID 冲突;正式 evidence schema 留 Step 13。 |
| P1/P2 / future 内容出现在停审备注 | acceptable_if_not_pass_condition | 只要未作为 P0 expected result 或 pass condition,保持 residual / downstream。 |
| fixture / CI / artifact path 未闭合 | expected_deferral | Step 6 只写场景和用例候选;Step 7/8/9/13 承接。 |

### 5. R6.14 写入边界思考

`R6.14 cross-case audit / closure 用例:再写入` 只能写跨批次审计和 Step 6 收口。

允许写入:

1. Step 6 已写候选用例规模、批次、ID 族和覆盖概览。
2. ID 唯一性审计,包括 `TC-ML-RECOVERY-001~002` 重复的修正记录。
3. 需求 / 规则 / NFR 覆盖收口表。
4. 断言重复与可接受横切断言说明。
5. P0/P1/P2 phase 边界审计。
6. evidence candidate / data / automation / environment 后移一致性表。
7. design blocker / source-missing stop 分类。
8. Step 6 总停审和 Step 7 进入门禁。

禁止写入:

1. 新增业务用例行或扩大 Step 6 范围。
2. 测试数据 fixture、seed、config sample、DB record、fault injection 脚本。
3. 环境矩阵、profile matrix、CI suite、required check、执行命令。
4. 正式 evidence ID、artifact path、JSON schema、report schema、验收 gate、release verdict。
5. 修改正式 `05-测试方案.md` 或直接进入 Step 7。

### 6. R6.13 stop-review

| 检查项 | 结果 |
|---|---|
| 是否只思考跨批次审计与收口 | pass |
| 是否识别已写用例规模和批次 | pass |
| 是否识别 ID 唯一性问题 | pass;`TC-ML-RECOVERY-001~002` 重复需 R6.14 修正 |
| 是否区分断言重复与 ID 冲突 | pass |
| 是否未新增业务用例行 | pass |
| 是否未写 fixture、环境、CI、evidence schema、验收或实施内容 | pass |
| 是否形成 R6.14 写入边界 | pass |
| 是否未修改正式 `05-测试方案.md` | pass |

next_allowed_action: 等待用户确认后进入 Step 6 `R6.14 cross-case audit / closure 用例:再写入`;只允许写入 Step 6 跨批次审计、ID 唯一性修正记录、覆盖收口、phase 边界、后移一致性、design blocker 分类、Step 6 总停审和 Step 7 进入门禁;不得直接修改正式 `05-测试方案.md`;不得新增业务用例;不得写测试数据 fixture、环境矩阵、CI suite、evidence schema、验收标准、实施计划或 implementation code。

---

## R6.14 cross-case audit / closure 用例:再写入

### 1. 当前模块状态

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm_to_R7.1 |
| 用户确认 | 已确认从 `R6.13` 推进到 `R6.14`。 |
| 本模块写入范围 | Step 6 跨批次审计、ID 唯一性修正记录、覆盖收口、phase 边界、后移一致性、design blocker 分类、Step 6 总停审和 Step 7 进入门禁。 |
| 本模块禁止范围 | 正式 `05-测试方案.md` 正文、新增业务用例、fixture、环境矩阵、CI suite、evidence schema、验收标准、实施计划和 implementation code。 |

### 2. ID 唯一性修正记录

| 修正项 | 原编号 | 新编号 | 修正原因 | 语义是否改变 | 裁决 |
|---|---|---|---|---|---|
| R6.10 commit unknown recovery source 用例 | `TC-ML-RECOVERY-001` | `TC-ML-RECOVERY-003` | R6.6 已使用 `TC-ML-RECOVERY-001` 表达 command / version commit unknown 不私判成功。 | 否 | pass |
| R6.10 stored surface missing recovery 用例 | `TC-ML-RECOVERY-002` | `TC-ML-RECOVERY-004` | R6.6 已使用 `TC-ML-RECOVERY-002` 表达 expected version conflict 防 lost update。 | 否 | pass |

修正后,Step 6 仍保持 83 条候选用例行,未新增业务用例,未删除业务用例,只消除 ID 冲突。

### 3. 候选用例规模与批次审计

| 批次 | 写入模块 | 候选行规模 | ID 族 | 审计结论 |
|---|---|---:|---|---|
| definition truth / identity / catalog | R6.4 | 12 | `TRUTH` / `IDENTITY` / `CATALOG` / `BOUNDARY` / `SHELL` / `QUERY` / `POLLUTION` | pass |
| formal version / explicit change / state | R6.6 | 15 | `FORMALIZATION` / `VERSION` / `CHANGE` / `STATE` / `IDEMP` / `RECOVERY-001~002` | pass |
| controlled consumption / distribution / seam | R6.8 | 20 | `CONSUMPTION` / `QUERY` / `BOUNDARY` / `DISTRIBUTION` / `PUBLISHER` / `HANDOFF` / `AVAILABILITY` / `SHELL` | pass |
| traceability / consistency / job / recovery | R6.10 | 19 | `TRACE` / `AUDIT` / `LINEAGE` / `IMPACT` / `EVIDENCE` / `REPLAY` / `UOW` / `RECOVERY-003~004` / `JOB` | pass_after_id_fix |
| config / dependency / redaction / observability | R6.12 | 17 | `CONFIG` / `DEPENDENCY` / `REDACTION` / `DIAGNOSTIC` / `METRIC` / `OBSERVABILITY` / `MARKER` | pass |

### 4. 覆盖收口

| 覆盖面 | Step 6 承接 | 审计结论 |
|---|---|---|
| FR-ML-001~002 | definition truth、identity、catalog、query no-write、public shell、pollution guard。 | pass |
| FR-ML-003~004 | formalization、formal version、semantic change、state guard、idempotency、recovery。 | pass |
| FR-ML-005~006 | controlled consumption、distribution context、publisher seam、handoff seam、availability、body-free shell。 | pass |
| FR-ML-007~009 | trace material、audit refs-only、evidence lineage、impact protection、stored replay、UoW、job report。 | pass |
| BR-ML-001~022 | truth owner、Definition vs Use、version stability、governance boundary、downstream boundary、audit / evidence boundary 均进入 P0 候选用例族。 | pass |
| NFR-ML-004~016 | availability / degraded、body-free、安全边界、追溯、幂等、一致性、可观测不替代 truth 均进入候选用例族。 | pass |
| FR-ML-E-* / BR-ML-E-* | 当前保持外围增强 / residual,未作为 P0 pass 前置。 | pass |

### 5. 断言重复与横切红线审计

| 断言族 | 重复位置 | 裁决 | 说明 |
|---|---|---|---|
| query no-write | R6.4、R6.6、R6.8、R6.12 | acceptable | 各自绑定 catalog、formalization、consumption、config/read material 不同入口。 |
| body-free / no raw body | R6.4、R6.6、R6.8、R6.10、R6.12 | acceptable | 属于跨接口安全红线,允许多切口重复断言。 |
| stored replay / no-rerun | R6.6、R6.10、R6.12 | acceptable | 分别覆盖 command、inbound/job、config 禁止关闭 replay。 |
| marker copy-only | R6.8、R6.12 | acceptable | R6.8 覆盖 seam unavailable / degraded,R6.12 覆盖 source-missing / no synthetic marker。 |
| recovery consistency | R6.6、R6.10 | acceptable_after_id_fix | R6.6 偏 command/version recovery,R6.10 偏 recovery source / stored surface / job consistency。 |

### 6. Phase 边界审计

| 边界项 | 当前处理 | 审计结论 |
|---|---|---|
| production-like / staging-like | 仅作为 profile isolation 或 future direction,不作为 P0 success 前置。 | pass |
| real provider / real broker / durable product | 不锁产品、不要求真实外部依赖。 | pass |
| secret provider / raw credential schema | 只验证 raw secret 禁入和 opaque ref 边界,不定义 provider schema。 | pass |
| capacity / SLO / multi-region / multi-tenant | 保持 P1/P2 residual,未进入 Step 6 P0 pass 条件。 | pass |
| UI rendering、marketplace transaction、artifact/archive lifecycle | 只验证边界不入仓,不测试相邻仓业务流程。 | pass |

### 7. 后移一致性审计

| 后移方向 | Step 6 已记录 | 后续承接 |
|---|---|---|
| 测试数据 | valid/invalid definition、formalization state、version state、consumption material、stored surface、commit unknown、checkpoint/report、invalid config、raw secret/body、marker source 等数据需求。 | Step 7 `05_test_plan_step_07_test_data.md` |
| 测试环境 | fake repository/UoW、write spy、resolver/publisher/handoff fakes、config loader、redaction scanner、metric capture、trace/log/report capture 等环境能力。 | Step 8 `05_test_plan_step_08_environment_config.md` |
| 自动化门禁 | application service、domain/contract、fake persistence、job runner、redaction scan、metric label scan、marker-source guard 等自动化候选。 | Step 9 `05_test_plan_step_09_automation_gates.md` |
| evidence 归档 | evidence candidate / family 已记录,未定义 EV ID、artifact path、JSON schema、report schema。 | Step 13 `05_test_plan_step_13_evidence.md` |
| 验收裁决 | 仅写验收承接方向,未写 entry / exit / veto / acceptance verdict。 | Step 12 和正式 `06-验收标准.md` |

### 8. Design Blocker 与暂停规则

| blocker 类型 | Step 6 裁决 | 处理规则 |
|---|---|---|
| object / DTO / state / port / mapper 缺口 | 不由测试方案补 schema。 | 回 owning `03` / `04` source。 |
| marker source 缺失 | 不用 raw adapter error、route param、private map、fixture 或 test helper 合成。 | 停审并回 marker / mapper owning source。 |
| config key / profile / secret provider 缺口 | 不发明 key、default、profile、provider schema。 | 回 `04-配置设计.md` 或 owning source。 |
| evidence / artifact schema 缺口 | Step 6 只写 evidence candidate。 | Step 13 闭合。 |
| phase / implementation boundary 缺口 | Step 6 不写实施边界。 | `07-实施计划.md` 和实施台账闭合。 |
| old material pollution | 旧 `05/06/07` 不作为当前 TC / evidence / acceptance / phase 来源。 | 命中即停审。 |

### 9. Step 6 总停审

| 停审项 | 裁决 | 说明 |
|---|---|---|
| 是否按批次完成用例矩阵 | pass | R6.4 / R6.6 / R6.8 / R6.10 / R6.12 已分别完成本批用例矩阵。 |
| 是否完成跨批次审计 | pass | R6.14 已写入 ID、覆盖、断言、phase、后移和 blocker 审计。 |
| 是否消除 ID 冲突 | pass | R6.10 recovery 用例已改为 `TC-ML-RECOVERY-003~004`。 |
| 是否覆盖 P0 需求 / 规则 / NFR | pass | FR-ML-001~009、BR-ML-001~022、NFR-ML-004~016 均有 P0 候选承接。 |
| 是否未把 P1/P2 residual 写成 P0 pass | pass | production-like、capacity、real provider、multi-region 等均未作为 P0 成功条件。 |
| 是否未写 fixture / 环境矩阵 / CI / evidence schema | pass | 均后移到 Step 7/8/9/13。 |
| 是否未新增 schema / key / marker / phase | pass | 缺口均按 design blocker 处理。 |
| 是否未修改正式 `05-测试方案.md` | pass | 当前仍只更新中间产物。 |

### 10. Step 7 进入门禁

| 门禁项 | 裁决 |
|---|---|
| Step 6 是否已完成所有 planned R6.x 模块 | pass |
| Step 6 是否已修正 must-fix ID 冲突 | pass |
| Step 6 是否已形成可供 Step 7 承接的数据需求 | pass |
| Step 7 是否仍禁止直接修改正式 `05-测试方案.md` | pass |
| 是否等待用户确认后才进入 Step 7 `R7.1 测试数据设计:先思考` | pass |

next_allowed_action: 等待用户确认后进入 Step 7 `R7.1 测试数据设计:先思考`;只允许创建 / 更新 `design-calibration/05_test_plan_step_07_test_data.md`,读取 Step 1~6 中间产物和正式 `00`~`04`,思考测试数据设计的输入边界、数据族、fixture / builder / fault injection / seed 边界、数据隔离、敏感数据和 `R7.2 测试数据设计:再写入` 边界;不得直接修改正式 `05-测试方案.md`;不得写环境矩阵、CI suite、evidence schema、验收标准、实施计划或 implementation code。
