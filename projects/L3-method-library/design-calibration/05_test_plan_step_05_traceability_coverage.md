# Step 5. 建立需求追溯与覆盖矩阵

> 对应 SOP: `standards/document/测试方案讨论流程_SOP.md` Step 5
> 回填章节: `05-测试方案.md` §5 需求追溯与覆盖矩阵
> 创建日期: 2026-06-27
> 当前模式: full-restart / step5-traceability-coverage
> 当前状态: completed_wait_user_confirm_to_R6.1
> 当前模块: `R5.2 需求追溯与覆盖矩阵:再写入`
> 当前门禁: `R5.2` completed_wait_user_confirm_to_R6.1;等待确认进入 Step 6 `R6.1 测试场景与用例矩阵:先思考`

---

## 0. Step 4 handoff

Step 4 已确认当前 `05-测试方案.md` 的测试策略与分层输入:

- 测试分层按风险发现位置组织:Unit / Contract、Application service / Flow、Repository / UoW / Adapter fake integration、API / Worker / Job entry、Release gate / Evidence summary。
- Step 3 的每个 P0 测试切口均已映射主发现层级、辅助层级和 P0 阻断口径。
- Release gate 只承接最小跨入口 smoke、P0 profile assembly smoke、redaction / dependency scan、report completeness 和 evidence summary,不得替代底层断言。
- P1 real-like selected-run、production-like、capacity 和硬 SLO 不作为当前 P0 覆盖通过前置。
- Step 5 只能建立需求 / 规则 / 设计 / 切口 / 场景 / evidence 的追溯边界,不能生成最终用例矩阵、测试数据、环境矩阵、自动化门禁或 evidence schema。

Step 5 的任务是把 `00` 的 FR-ML / BR-ML / NFR-ML / 验收方向、`03/04` 的正式设计契约、Step 3 测试切口和 Step 4 分层连接成可审计的双向覆盖关系。它不是 Step 6 用例矩阵,也不是 Step 13 证据归档规范。

---

## R5.1 需求追溯与覆盖矩阵:先思考

### 1. 当前模块目标

`R5.1` 只思考 Step 5 的开工边界、必读文档、Step 4 handoff、L1-governance Step 5 框架参考、L3-method-library 的追溯轴、覆盖矩阵分批方式、用例 / evidence 预留边界和 `R5.2` 写入边界。

当前模块不写最终覆盖矩阵、未覆盖项清单、停审记录、跨覆盖项审计表、TC 编号、用例矩阵、测试数据、环境矩阵、自动化门禁、evidence schema、验收标准或实施计划。

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm_to_R5.2 |
| 用户确认 | 已确认从 Step 4 completed 推进到 Step 5 `R5.1`。 |
| 当前允许 | 思考 Step 5 开工边界、必读文档、SOP 八问、Step 4 handoff、L1-governance 框架参考、L3 追溯轴、覆盖矩阵分批和 R5.2 写入边界。 |
| 当前禁止 | 修改正式 `05-测试方案.md`;写最终追溯矩阵、TC 编号、用例矩阵、测试数据、环境矩阵、自动化门禁、evidence schema、正式验收标准、实施计划或 implementation code。 |

### 2. Step 5 启动前必须承接

| 输入 | 必须承接的内容 | 禁止继承 / 禁止提前 |
|---|---|---|
| `project_execution_ledger.md` | 当前恢复点为 Step 4 completed_wait_user_confirm_to_R5.1;每次确认只推进一个当前模块。 | 直接写完整 Step 5 或跳到 Step 6 用例。 |
| `05_test_plan_calibration_flow.md` | Step 1~4 completed;Step 5 waiting_user_confirm_to_R5.1;Step 6+ blocked。 | 在 Step 5 写用例步骤、fixture、CI suite 或 artifact schema。 |
| `05_test_plan_step_01_input_boundary.md` | 正式输入边界、旧材料隔离和缺口回写规则。 | 从旧 `05/06/07` 恢复旧覆盖矩阵、旧 TC / EV 或旧报告路径。 |
| `05_test_plan_step_02_scope.md` | P0/P1/P2、非范围、核心闭环、一票否决候选和下游接缝。 | 把 P1/P2 外围增强计入 P0 覆盖空洞。 |
| `05_test_plan_step_03_test_objects_cuts.md` | P0 测试对象、测试切口、负向切口、P1/P2 seam 和停审。 | 重新发明测试切口或跳过反向追溯。 |
| `05_test_plan_step_04_strategy_layers.md` | 分层图、分层表、切口到层级映射和 release gate 边界。 | 用 release gate 替代所有 P0 覆盖判断。 |
| `测试方案讨论流程_SOP.md` Step 5 | Step 5 必须输出覆盖矩阵、未覆盖项、切口反向矩阵、停审和跨覆盖项审计。 | 只做单向需求表。 |
| `测试方案书写规范.md` §5.5 | 正式 §5 必须建立需求、设计、测试场景、用例和证据之间的追溯。 | 在 R5.1 固定正式 TC / EV 编号。 |
| `00-需求文档.md` | FR-ML-001~009、FR-ML-E-*、BR-ML-001~022、BR-ML-E-001、NFR-ML-001~016、数据归属和验收方向。 | 改写需求编号或新增需求项。 |
| `03-详细设计.md` / `04-配置设计.md` | 设计契约、最小测试切口、配置红线、failure/degradation 和 downstream handoff。 | 用测试方案补 schema、port、state、marker source、config key 或 evidence schema。 |
| L1-governance Step 5 | 参考双向覆盖矩阵、未覆盖项、停审和跨覆盖审计框架。 | 复制 governance 的 C/FR/BR/AC/VF 编号、场景和证据族。 |

### 3. SOP Step 5 八问思考边界

| SOP 问题 | R5.1 思考边界 | 后续落点 |
|---|---|---|
| 每个 P0 需求对应哪些设计章节? | 先按 FR-ML、BR-ML、NFR-ML、数据归属和验收方向建立映射策略,不在 R5.1 写完整矩阵。 | R5.2 写需求 / 规则到设计契约的覆盖候选。 |
| 每个 P0 需求至少有哪些测试场景? | 先定义场景候选族来自 Step 3 切口和 Step 4 层级,不写 TC 步骤。 | R5.2 写场景候选族。 |
| 哪些场景必须自动化? | 先按 Step 4 阻断层级判断 P0 自动化候选,不写 suite 或 command。 | R5.2 写自动化候选列;Step 9 固定门禁。 |
| 每个场景的证据如何编号? | 只允许预留 evidence family 或 evidence candidate,不得固定正式 EV ID、path 或 schema。 | R5.2 写证据候选族;Step 13 固定证据归档。 |
| 哪些需求暂未覆盖,原因是什么? | 先定义未覆盖项必须区分 P0 空洞、P1/P2 residual、旧材料污染和正式 source 缺口。 | R5.2 写未覆盖项清单。 |
| 每个 Step 3 测试切口是否映射到需求 / 规则 / 设计契约? | 先定义反向矩阵必须从切口查回需求 / 规则 / 设计契约或说明设计风险覆盖。 | R5.2 写切口反向覆盖候选。 |
| 每个 P0 需求 / 规则是否至少有一个测试切口、用例候选和证据 ID? | 先固定“用例候选族”和“证据候选族”概念,不固定具体 TC / EV 编号。 | R5.2 写覆盖状态和候选族。 |
| 覆盖矩阵完成后是否通过停审? | 先定义停审维度:孤儿需求、孤儿设计契约、孤儿测试切口、重复证据候选、P0 自动化缺口和 phase 越界。 | R5.2 写停审和跨覆盖审计。 |

### 4. L1-governance Step 5 框架参考思考

L1-governance Step 5 的可借鉴点是“双向覆盖 + 停审 + 跨覆盖审计”,不是它的领域编号或 evidence 命名。L3-method-library 应采用同样的审计深度,但所有覆盖项必须来自 L3 正式 `00/03/04` 与 Step 2~4 中间产物。

| L1-governance 框架点 | L3 采用方式 | L3 禁止 |
|---|---|---|
| 本步目标先声明 | L3 Step 5 先声明只建立追溯,不写用例、数据、环境或 evidence schema。 | 不直接写正式 §5。 |
| 需求 / 规则正向覆盖矩阵 | L3 按 FR-ML / BR-ML / NFR-ML / 验收方向组织。 | 不复制 C-GOV / FR-GOV / VF-GOV。 |
| 测试切口反向覆盖矩阵 | L3 从 Step 3 切口反查需求、规则和设计契约。 | 不允许孤儿测试切口静默存在。 |
| evidence 只预留候选族 | L3 只写 evidence family / candidate,正式 schema 留 Step 13。 | 不固定 EV 编号、artifact path 或 JSON 字段。 |
| 未覆盖项和跨覆盖审计 | L3 区分 P0 空洞、P1/P2 residual、旧材料污染和 source 缺口。 | 不把外围增强当 P0 空洞,也不把 P0 空洞降级隐藏。 |

### 5. L3 追溯轴思考

L3 的追溯矩阵应围绕方法资产定义仓的核心闭环建立,避免只按技术层或旧 MethodContent 主线罗列。

| 追溯轴 | 来源 | R5.1 初判 |
|---|---|---|
| 功能需求轴 | `FR-ML-001~009`;`FR-ML-E-*` | P0 覆盖 FR-ML-001~009;外围增强 FR-ML-E-* 只作为 residual / future。 |
| 业务规则轴 | `BR-ML-001~022`;`BR-ML-E-001` | P0 应覆盖定义真相、Definition vs Use、正式化、下游消费边界、显式变化、相邻仓边界、治理 / 审计 / 证据边界。 |
| 非功能轴 | `NFR-ML-001~016` | P0 覆盖一致性优先、可用性不迁移 truth、安全边界、追溯、幂等和可观测材料不成 truth;硬性能阈值后移 Step 10/14。 |
| 数据归属轴 | `00` 数据归属;`01` ownership;`03` persistence/state | 覆盖方法资产定义、身份目录、正式化版本、关系、分发、追溯和证据线索归属。 |
| 设计契约轴 | `03` object / port / protocol / flow / state / consistency / error / config / observability | 每个 P0 测试切口必须反查至少一个设计契约或明确是横切设计风险。 |
| 配置 / 依赖轴 | `04` profile、source priority、validation、adapter availability、failure/degradation | 覆盖 fail-fast、profile isolation、forbidden configurable boundary、downstream handoff。 |
| 验收方向轴 | `00` §14;后续新版 `06` | 当前只承接验收方向,不写正式验收裁决、veto 或 release verdict。 |

### 6. 覆盖矩阵分批思考

R5.2 不应把所有覆盖关系塞进一张巨大表。应按正向需求覆盖、规则 / 非功能覆盖、配置 / 验收方向覆盖、切口反向覆盖、未覆盖项和停审审计分批写入。

| 分批 | 主题 | 输出边界 |
|---|---|---|
| R5.2-a | 必读文档、Step 4 handoff、SOP 八问回答 | 固定进入 Step 5 的输入、规则和回答。 |
| R5.2-b | FR-ML / 核心能力正向覆盖候选 | 写需求到设计契约、测试切口、场景候选、用例候选族和 evidence candidate。 |
| R5.2-c | BR-ML / NFR-ML / 数据归属 / 配置红线覆盖候选 | 写规则、非功能、数据归属和配置门禁覆盖候选。 |
| R5.2-d | Step 3 测试切口反向覆盖候选 | 从切口反查需求 / 规则 / 设计契约,防止孤儿切口。 |
| R5.2-e | 未覆盖项、停审、跨覆盖审计和 §5 回填草稿候选 | 写 P0 空洞判断、P1/P2 residual、旧材料污染和 Step 6 进入条件。 |

### 7. 用例候选与 Evidence 候选边界思考

Step 5 必须为 Step 6 和 Step 13 留足追溯入口,但不能提前占用它们的职责。

| 项 | Step 5 允许 | Step 5 禁止 |
|---|---|---|
| 测试场景 | 写场景候选族,例如 core truth、formal version、controlled consumption、traceability、config/redaction。 | 写测试步骤、输入数据、前置状态和断言细节。 |
| 用例候选 | 写用例候选族或批次方向。 | 固定 TC 编号、用例矩阵、操作步骤和断言点。 |
| 自动化 | 标注“是 / 候选 / 后续 Step 9 固定”。 | 写 suite 名、CI command、required check 或脚本路径。 |
| Evidence | 写 evidence candidate / family,用于后续 Step 13。 | 固定 EV 编号、artifact path、JSON schema、report 字段。 |
| 未覆盖项 | 标明 P0 空洞、P1/P2 residual、future 或 source blocker。 | 静默删除未覆盖项或用“人工确认”替代 P0 证据。 |

### 8. 缺口与暂停规则思考

Step 5 追溯时如果发现正式来源不闭合,不能在测试方案里补。

| 缺口类型 | 暂停条件 | 回写方向 |
|---|---|---|
| 需求缺口 | P0 测试必须覆盖的能力没有 FR / BR / NFR / 验收方向来源。 | 回 `00-需求文档.md` 或对应需求中间产物。 |
| 设计缺口 | 需求有覆盖要求,但 `03/04` 没有对象、protocol、flow、state、port、config 或 marker 来源。 | 回 `03` / `04` owning source。 |
| 切口缺口 | P0 需求有设计契约,但 Step 3 未形成测试切口。 | 回 Step 3 或记录阻塞。 |
| 分层缺口 | P0 切口没有可承接的发现层级或被推给 release gate。 | 回 Step 4。 |
| 用例 / evidence 缺口 | 需要 TC 编号、fixture、artifact schema 才能继续表达。 | 后移 Step 6 / Step 7 / Step 13,不得在 R5.1 补。 |

### 9. R5.2 写入边界思考

`R5.2 需求追溯与覆盖矩阵:再写入` 应把 R5.1 的思考固化成 Step 5 中间产物,仍不能修改正式 `05-测试方案.md`。

1. 写 Step 5 必读文档表与读取状态。
2. 写 Step 4 handoff 承接表。
3. 写 SOP 八问回答。
4. 写 L1-governance Step 5 框架参考边界。
5. 写 FR-ML / 核心能力正向覆盖候选。
6. 写 BR-ML / NFR-ML / 数据归属 / 配置红线覆盖候选。
7. 写 Step 3 测试切口反向覆盖候选。
8. 写未覆盖项清单、覆盖矩阵停审记录和跨覆盖项审计表。
9. 写正式 §5 回填草稿候选边界、待确认事项和 Step 6 进入条件。
10. 禁止写正式 `05-测试方案.md`、最终 TC 编号、用例矩阵、测试数据、环境矩阵、自动化门禁、evidence schema、验收标准、实施计划或 implementation code。

### 10. R5.1 stop-review

| 检查项 | 结果 |
|---|---|
| 是否只思考 Step 5 开工边界和追溯策略 | pass |
| 是否承接 Step 4 completed handoff | pass |
| 是否读取并对照 SOP Step 5 和书写规范 §5.5 | pass |
| 是否参考 L1-governance 框架但不复制领域语义 | pass |
| 是否形成 L3 追溯轴思考 | pass |
| 是否形成覆盖矩阵分批思考 | pass |
| 是否形成用例候选 / evidence 候选边界 | pass |
| 是否形成 R5.2 写入边界 | pass |
| 是否未修改正式 `05-测试方案.md` | pass |
| 是否未写最终覆盖矩阵、TC、用例、数据、环境、门禁、evidence、验收或实施内容 | pass |

next_allowed_action: 等待用户确认后进入 Step 5 `R5.2 需求追溯与覆盖矩阵:再写入`;只允许写入 Step 5 必读文档表、Step 4 handoff 承接、SOP 八问回答、L1-governance 框架参考边界、FR-ML / 核心能力正向覆盖候选、BR-ML / NFR-ML / 数据归属 / 配置红线覆盖候选、Step 3 测试切口反向覆盖候选、未覆盖项清单、覆盖矩阵停审记录、跨覆盖项审计表、正式 §5 回填草稿候选边界、待确认事项和 Step 6 进入条件;不得直接修改正式 `05-测试方案.md`;不得写最终 TC 编号、用例矩阵、测试数据、环境矩阵、自动化门禁、evidence schema、正式验收标准、实施计划或 implementation code。

---

## R5.2 需求追溯与覆盖矩阵:再写入

### 1. 当前模块状态

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm_to_R6.1 |
| 用户确认 | 已确认从 `R5.1` 推进到 `R5.2`。 |
| 本模块写入范围 | Step 5 必读文档表、Step 4 handoff 承接、SOP 八问回答、L1-governance 框架参考边界、FR-ML / 核心能力正向覆盖候选、BR-ML / NFR-ML / 数据归属 / 配置红线覆盖候选、Step 3 测试切口反向覆盖候选、未覆盖项清单、覆盖矩阵停审记录、跨覆盖项审计表、正式 §5 回填草稿候选边界、待确认事项和 Step 6 进入条件。 |
| 本模块禁止范围 | 正式 `05-测试方案.md` 正文、最终 TC 编号、用例矩阵、测试数据、环境矩阵、自动化门禁、evidence schema、正式验收标准、实施计划和 implementation code。 |

### 2. 必读文档表与读取状态

| 文档 | 读取状态 | Step 5 用途 | 当前裁决 |
|---|---|---|---|
| `project_execution_ledger.md` | 已读取并承接 | 确认恢复点为 Step 5 `R5.1` completed_wait_user_confirm_to_R5.2。 | 当前只推进 `R5.2`。 |
| `05_test_plan_calibration_flow.md` | 已读取并承接 | 确认 Step 1~4 completed、Step 5 in_progress、Step 6+ blocked。 | `R5.2` 完成后等待 `R6.1`。 |
| `05_test_plan_step_02_scope.md` | 已读取并承接 | 提供 P0/P1/P2、非范围、核心闭环和一票否决候选。 | Step 5 不重开范围。 |
| `05_test_plan_step_03_test_objects_cuts.md` | 已读取并承接 | 提供 P0 测试切口、负向切口、P1/P2 seam 和停审。 | Step 5 不重开切口。 |
| `05_test_plan_step_04_strategy_layers.md` | 已读取并承接 | 提供主发现层级、辅助层级、阻断口径和 release gate 边界。 | Step 5 不重开分层。 |
| `测试方案讨论流程_SOP.md` | 已读取 Step 5 | 固定覆盖矩阵、未覆盖项、反向矩阵、停审和跨覆盖审计要求。 | 当前只写追溯覆盖。 |
| `测试方案书写规范.md` | 已读取 §5.5 | 固定正式 §5 必须建立需求、设计、场景、用例和证据追溯关系。 | 正式 `05` 仍留到 Step 15。 |
| `00-需求文档.md` | 已读取 §14 / §16 关键表 | 提供 FR-ML、BR-ML、NFR-ML、数据归属、验收方向和主追溯矩阵。 | 不新增需求编号。 |
| `03-详细设计.md` / `04-配置设计.md` | 已承接 | 提供设计契约、最小切口、配置红线和 failure/degradation 输入。 | 不补 schema、port、state、marker、config 或 evidence。 |
| L1-governance Step 5 | 已对照 | 参考双向覆盖、未覆盖项、停审和跨覆盖审计框架。 | framework reference only。 |

### 3. Step 4 handoff 承接

| Step 4 结论 | Step 5 承接方式 | 当前状态 |
|---|---|---|
| 每个 P0 切口都有主发现层级 | 覆盖矩阵可把需求映射到切口和层级,不再重新判断分层。 | pass |
| Release gate 不替代底层断言 | Step 5 只把 release gate 作为 evidence summary 候选,不作为所有覆盖项的唯一验证。 | pass |
| P1/P2 不阻塞 P0 | FR-ML-E-*、production-like、capacity、hard SLO 等写入 residual / future,不算 P0 空洞。 | pass |
| Step 4 待确认项后移 Step 9 / 13 | dependency check、write-audit helper、report completeness 等只标记后续承接。 | pass |

### 4. SOP 八问回答

| SOP 问题 | Step 5 回答 |
|---|---|
| 每个 P0 需求对应哪些设计章节? | FR-ML-001~009 均回指 `00` §16 主追溯矩阵、`03` 的 object / protocol / flow / state / consistency / observability 契约,以及 `04` 的 config / dependency / redaction 红线。 |
| 每个 P0 需求至少有哪些测试场景? | 每个 P0 需求至少映射到 Step 3 的 P0 切口之一,包括 definition truth、formal version、controlled consumption、traceability、consistency、config、redaction 和 observability 场景候选。 |
| 哪些场景必须自动化? | P0 public shell、truth invariant、policy guard、command/query/job orchestration、query no-write、idempotency/replay、config validation、forbidden configurable boundary、redaction 和 dependency boundary 均为自动化候选;具体 suite / command 留 Step 9。 |
| 每个场景的证据如何编号? | 本 Step 只预留证据候选族,如 definition-truth evidence、formal-version evidence、controlled-consumption evidence、traceability evidence、config-redline evidence、redaction evidence。正式 evidence ID、artifact path 和 schema 留 Step 13。 |
| 哪些需求暂未覆盖,原因是什么? | 当前 P0 FR-ML / BR-ML / NFR-ML 追溯未发现覆盖空洞。FR-ML-E-*、BR-ML-E-001、production-like、capacity、hard SLO、marketplace / advanced policy 等属于 P1/P2 residual 或 future,不算 P0 空洞。 |
| 每个 Step 3 测试切口是否映射到需求 / 规则 / 设计契约? | 是。P0 切口均可反查到 FR-ML、BR-ML、NFR-ML、数据归属、验收方向或 `03/04` 设计契约。 |
| 每个 P0 需求 / 规则是否至少有一个测试切口、用例候选和证据 ID? | 是,但当前只写用例候选族和证据候选族,不固定最终 TC / EV 编号。 |
| 覆盖矩阵完成后是否通过停审? | 通过。当前未发现 P0 孤儿需求、孤儿设计契约或孤儿测试切口;未覆盖项已区分 P1/P2 residual 与 future。 |

### 5. L1-governance Step 5 框架参考边界

| 框架点 | L3 采用 | L3 差异 |
|---|---|---|
| 正向需求覆盖矩阵 | 采用;L3 用 FR-ML / BR-ML / NFR-ML / 验收方向组织。 | 不复制 governance 的 C-GOV / VF-GOV 编号。 |
| 反向测试切口覆盖矩阵 | 采用;从 Step 3 切口反查需求 / 规则 / 设计契约。 | L3 切口围绕方法资产定义 truth、正式版本和受控消费。 |
| evidence 只预留候选族 | 采用;正式 evidence 归 Step 13。 | L3 不在本 Step 固定 EV 编号、artifact path 或 JSON schema。 |
| 未覆盖项清单 | 采用;区分 P0 空洞、P1/P2 residual、future 和 source blocker。 | L3 的 FR-ML-E-* 不计入当前 P0 空洞。 |
| 覆盖停审与跨覆盖审计 | 采用;检查孤儿需求、孤儿设计契约、孤儿切口和 phase 越界。 | L3 同时审计旧 MethodContent / publish / snapshot / outbox 污染。 |

### 6. FR-ML / 核心能力正向覆盖候选

| 需求 / 规则 ID | 设计依据 | 测试切口 | 场景候选 | 用例候选族 | 自动化候选 | 证据候选族 | 覆盖状态 |
|---|---|---|---|---|---|---|---|
| FR-ML-001 方法资产定义表达能力 | `00` §16;`03` object / protocol contracts | truth invariant;policy guard;public shell | 方法资产定义可构造、非法定义被拒绝、正文不入仓 | definition-truth candidate | 是 | definition-truth evidence | 覆盖 |
| FR-ML-002 方法资产身份与目录识别能力 | `00` §16;`03` identity / summary / query contracts | truth invariant;query no-write;public shell | 身份与目录语义可读、missing/not-visible/degraded 安全返回 | identity-catalog candidate | 是 | identity-catalog evidence | 覆盖 |
| FR-ML-003 方法资产正式化能力 | `00` §16;`03` state / command flow | state transition;command orchestration;idempotency | 正式化为显式命令结果、非法状态拒绝、duplicate 不重跑 | formalization candidate | 是 | formalization evidence | 覆盖 |
| FR-ML-004 正式版本边界能力 | `00` §16;`03` formal version / state / replay | truth invariant;state transition;idempotency | 正式 / 非正式区分、版本稳定、版本语义变化显式记录 | formal-version candidate | 是 | formal-version evidence | 覆盖 |
| FR-ML-005 正式方法资产消费支撑能力 | `00` §16;`01` Definition vs Use;`03` public shell / query | public shell;query no-write;resolver/handoff seam | 下游只消费 ref / summary / material,不能迁移定义 truth | controlled-consumption candidate | 是 | controlled-consumption evidence | 覆盖 |
| FR-ML-006 方法资产消费语境分发能力 | `00` §16;`03` outbound / handoff / config | inbound/outbound/job flow;handoff seam | 可消费语境分发、publisher failure safe、handoff 不写 truth | consumption-distribution candidate | 是 | distribution evidence | 覆盖 |
| FR-ML-007 方法资产追溯能力 | `00` §16;`03` trace / audit / observability | command orchestration;safe diagnostic;metric/audit refs-only | 变化依据、版本语境和引用语境可追溯且 refs-only | traceability candidate | 是 | traceability evidence | 覆盖 |
| FR-ML-008 方法资产消费一致性保护能力 | `00` §16;`03` consistency / query / job | query no-write;idempotency;job no truth repair | 影响识别和引用稳定性保护,重复维护不制造第二 truth | consistency-protection candidate | 是 | consistency evidence | 覆盖 |
| FR-ML-009 方法资产证据线索承接能力 | `00` §16;`03` report / audit / handoff / observability | safe diagnostic;metric/audit refs-only;job flow | 版本、发布、引用相关证据线索可承接审计语境且 body-free | evidence-lineage candidate | 是 | evidence-lineage candidate | 覆盖 |

### 7. BR-ML / NFR-ML / 数据归属 / 配置红线覆盖候选

| 覆盖组 | 设计依据 | 测试切口 | 场景候选 | 用例候选族 | 自动化候选 | 证据候选族 | 覆盖状态 |
|---|---|---|---|---|---|---|---|
| BR-ML-001~004 定义真相、身份语境、Definition vs Use、正式版本稳定 | `00` §14 / §16;`01`;`03` object/state | truth invariant;state transition;module owner | 定义 truth 归属、本仓 owner、正式版本不被下游替代 | truth-boundary candidate | 是 | truth-boundary evidence | 覆盖 |
| BR-ML-005~008 禁止下游反向拥有、消费未正式资产、运行职责入仓、源码依赖误写 | `01` dependency boundary;`03` public shell / config | owner boundary;public shell;dependency boundary | 下游只能 refs/summary/material;非 core sibling compile dependency 被拒绝 | downstream-boundary candidate | 是 | boundary evidence | 覆盖 |
| BR-ML-009~011 正式化、版本语义变化、消费影响变化均为显式变化 | `03` command/state/trace | command orchestration;state transition;traceability | 变化必须由正式命令/状态/追溯锚点表达 | explicit-change candidate | 是 | explicit-change evidence | 覆盖 |
| BR-ML-012~018 相邻仓边界 | `01`;`03` resolver / handoff seam | resolver/publisher/handoff seam;no raw body | process、identity、governance、capability-hub、marketplace、UI、artifact/archive 边界不被打穿 | sibling-seam candidate | 是 | seam evidence | 覆盖 |
| BR-ML-019~022 治理、审计、证据边界 | `00`;`03` trace/audit/report;`04` redaction | safe diagnostic;metric/audit refs-only;job report | 治理结论只摘要/引用,正式化追溯和证据线索 body-free | governance-audit-boundary candidate | 是 | audit-boundary evidence | 覆盖 |
| NFR-ML-001~003 性能与一致性优先 | `00` §13;Step 2 P0/P2 | release summary;consistency/idempotency | 主链不阻塞作为候选,性能与一致性冲突时以 truth 完整为先 | performance-sanity candidate | 候选 | performance-sanity evidence | 覆盖;硬阈值后移 Step 10 |
| NFR-ML-004~006 可用性与下游不可用边界 | `00` §13;`04` failure/degradation | resolver/handoff seam;config validation | 外围能力、条件型依赖或下游不可用不得改写 truth | availability-degraded candidate | 是 | degraded evidence | 覆盖 |
| NFR-ML-007~008 安全边界 | `00` §13;`03` redaction;`04` secret/no-output | no raw body / no secret;public shell | 禁止越权拥有正文,下游不能绕过定义 truth | security-boundary candidate | 是 | security evidence | 覆盖 |
| NFR-ML-009~016 追溯、一致性、幂等、可观测性 | `00` §13;`03` consistency / observability | idempotency;query no-write;metric/audit refs-only | 重复读取/维护不制造第二 truth,观测材料不成 truth | trace-consistency-observe candidate | 是 | trace-consistency evidence | 覆盖 |
| 数据归属与正文禁入验收 | `00` §11 / §14;`01`;`03` persistence/redaction | truth invariant;no raw body;safe diagnostic | 方法资产定义/身份/正式化/关系/追溯归本仓,外部正文和运行 truth 禁入 | data-ownership candidate | 是 | ownership evidence | 覆盖 |
| 配置 / profile / dependency 红线 | `04` §5~§12;`03` config / runtime | config validation;forbidden configurable boundary | source priority、fail-fast、profile isolation、config 不补 truth/source/marker | config-redline candidate | 是 | config-redline evidence | 覆盖 |

### 8. Step 3 测试切口反向覆盖候选

| 测试切口 | 需求 / 规则 ID | 设计契约 | 场景候选 | 用例候选族 | 证据候选族 | 覆盖状态 |
|---|---|---|---|---|---|---|
| module owner / dependency direction cut | BR-ML-003, BR-ML-005~008, BR-ML-012~018, NFR-ML-007 | `01` dependency;`03` module owner | owner boundary、forbidden responsibility、compile dependency boundary | owner-boundary candidate | boundary evidence | 覆盖 |
| truth invariant and formal version cut | FR-ML-001~004, BR-ML-001~004, BR-ML-009~010 | `03` object/state/flow | truth object invariant、formal version、稳定边界 | truth-version candidate | truth/version evidence | 覆盖 |
| policy guard and body-free boundary cut | BR-ML-005~008, NFR-ML-007~008 | `03` policy/guard/error;`04` redaction | policy accept/reject、safe rejection、body-free guard | policy-guard candidate | guard evidence | 覆盖 |
| public shell and safe surface cut | FR-ML-005~006, BR-ML-012~018, NFR-ML-007~008 | `03` protocol / safe surface | Command / Query / Inbound / Outbound / Job shell 安全输出 | public-shell candidate | shell evidence | 覆盖 |
| command accepted / rejected / duplicate orchestration cut | FR-ML-003~004, FR-ML-007~008, BR-ML-009~011, NFR-ML-012~014 | `03` command flow / replay | accepted/rejected/duplicate/no-rerun/stored surface missing | command-flow candidate | command evidence | 覆盖 |
| query no-write and degraded surface cut | FR-ML-005~009, BR-ML-011, NFR-ML-013, NFR-ML-016 | `03` query flow / no-write | visible/empty/not-visible/degraded/partial/no-write | query-surface candidate | query evidence | 覆盖 |
| inbound / outbound / operations job flow cut | FR-ML-006~009, BR-ML-020~022, NFR-ML-013~016 | `03` consumer/outbound/job flow | consumer replay、publisher failure、job report/no truth repair | background-flow candidate | background evidence | 覆盖 |
| repository / UoW transaction cut | FR-ML-003~004, FR-ML-008, NFR-ML-012~014 | `03` UoW / transaction / consistency | commit、rollback、conflict、commit unknown、checkpoint resume | transaction candidate | transaction evidence | 覆盖 |
| resolver / publisher / handoff seam cut | FR-ML-005~006, BR-ML-012~018, NFR-ML-004~006 | `03` adapter seam;`04` availability/degradation | available/unavailable/degraded/failed marker,no synthetic source | adapter-seam candidate | seam evidence | 覆盖 |
| state machine legal / illegal transition cut | FR-ML-003~004, BR-ML-009~011, NFR-ML-014 | `03` state matrix | legal transition、illegal transition、safe error、no side-effect | state-machine candidate | state evidence | 覆盖 |
| idempotency / replay / concurrency cut | FR-ML-008, NFR-ML-012~014 | `03` idempotency/replay/concurrency | duplicate replay、digest conflict、in-flight、race | replay-concurrency candidate | replay evidence | 覆盖 |
| config validation and profile isolation cut | NFR-ML-004~006, NFR-ML-007, config redline | `04` profile/source/validation | valid baseline、missing required ref、invalid priority、profile isolation | config-validation candidate | config evidence | 覆盖 |
| forbidden configurable boundary cut | BR-ML-001~004, BR-ML-009~011, NFR-ML-012~016 | `04` forbidden configurable boundary | config 不能改 truth owner/state/replay/schema/marker source | config-forbidden candidate | config-redline evidence | 覆盖 |
| no raw body / no secret / safe diagnostic cut | BR-ML-005~008, BR-ML-012~018, NFR-ML-007~008 | `03`/`04` redaction/secret/no-output | no raw payload、no secret、safe report/output | redaction candidate | redaction evidence | 覆盖 |
| low-cardinality metric / audit refs-only cut | FR-ML-007~009, BR-ML-020~022, NFR-ML-015~016 | `03` observability/audit | metric label 裁剪、audit refs-only、query observation no-write | observability candidate | observability evidence | 覆盖 |
| negative public shell / source / state / replay / config / observability cuts | FR-ML-001~009, BR-ML-001~022, NFR-ML-004~016 | R3.10;`03/04` negative sources | required field missing、source mismatch、illegal state、marker missing、leakage | negative-risk candidate | negative evidence | 覆盖 |

### 9. 未覆盖项清单

| 项 | 状态 | 原因 | 后续处理 |
|---|---|---|---|
| P0 FR-ML-001~009 | 无未覆盖项 | 均已映射到 Step 3 切口、Step 4 层级和证据候选族。 | Step 6 拆具体场景与用例。 |
| P0 BR-ML-001~022 | 无未覆盖项 | 已按定义真相、禁止行为、显式变化、相邻仓边界、治理 / 审计 / 证据边界成组覆盖。 | Step 6 拆关键正向 / 负向场景。 |
| P0 NFR-ML-004~016 | 无未覆盖项 | 已覆盖可用性、安全、追溯、一致性、幂等和可观测性。 | Step 10 细化专项和非功能验证。 |
| NFR-ML-001~003 硬性能阈值 | 非 P0 hard gate | 当前只有性能判断口径,无正式阈值和负载模型。 | Step 10 / Step 14 记录候选与残余风险。 |
| FR-ML-E-001~004 / BR-ML-E-001 | P1/P2 residual | 外围增强不阻塞核心闭环。 | Step 14 残余风险 / future。 |
| production-like、capacity、multi-region、multi-tenant、secret provider | P2 future | 当前不作为 P0 release gate。 | Step 10 / Step 14 / 后续设计。 |
| 旧 MethodContent / publish / snapshot / outbox / PostgreSQL / gateway / old TC / EV | historical pollution | 旧材料不作为当前测试真相源。 | Step 14 / Step 15 装配审计。 |

### 10. 覆盖矩阵停审记录

| 覆盖项 / 测试切口 | 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|---|
| FR-ML-001~009 | 是否每项至少有设计依据、测试切口、场景候选、用例候选族和证据候选族 | pass | 见 §6。 |
| BR-ML-001~022 | 是否覆盖定义真相、禁止行为、显式变化、相邻仓边界和治理 / 审计 / 证据边界 | pass | 见 §7。 |
| NFR-ML-001~016 | 是否区分 P0 可用性 / 安全 / 一致性 / 可观测与后续性能硬阈值 | pass | 硬阈值后移 Step 10 / 14。 |
| 数据归属与正文禁入 | 是否证明真相归属和外部正文禁入 | pass | 见 §7。 |
| 配置 / profile / dependency 红线 | 是否承接 `04` 配置设计且不补 key/source | pass | Step 8/9/13 后续细化。 |
| Step 3 全部 P0 测试切口 | 是否能反查需求 / 规则 / 设计契约 | pass | 见 §8。 |
| 用例与证据编号 | 是否避免提前固定最终 TC / EV / artifact schema | pass | 当前只写候选族。 |

### 11. 跨覆盖项审计表

| 审计项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 是否存在 P0 孤儿需求 | pass | 当前未发现。 |
| 是否存在 P0 孤儿设计契约 | pass_with_watch | 当前 Step 3 粒度未发现;Step 6 展开用例时继续反查。 |
| 是否存在 P0 孤儿测试切口 | pass | Step 3 切口均有反向覆盖候选。 |
| 是否存在重复证据候选导致冲突 | pass | 当前使用候选族,正式编号留 Step 13。 |
| 是否存在 P0 自动化缺口 | pass_with_watch | 自动化候选已标出;具体 suite / script 留 Step 9。 |
| 是否把 P1/P2 写成 P0 pass | pass | FR-ML-E-*、硬性能阈值和 production-like 均保持 residual / future。 |
| 是否用旧材料污染当前覆盖 | pass | 未继承旧 MethodContent、publish、snapshot、outbox、old TC / EV。 |
| 是否发生 phase boundary 越界 | pass | 未写最终 TC、用例矩阵、数据、环境、CI、evidence schema、验收或实施计划。 |

### 12. 正式 §5 回填草稿候选边界

正式 `05-测试方案.md` §5 只能在 Step 15 装配。本节只记录候选边界,不得当作正式正文。

| §5 候选块 | 中间产物来源 | 装配边界 |
|---|---|---|
| §5.1 校准来源与延伸阅读 | R5.2 | 引用 Step 5 中间产物,不复制旧 `05/06/07`。 |
| §5.2 FR-ML / 核心能力覆盖矩阵 | R5.2 §6 | 装配 FR-ML-001~009 到设计契约、切口、场景候选、用例候选族和证据候选族的映射。 |
| §5.3 BR-ML / NFR-ML / 数据归属 / 配置红线覆盖矩阵 | R5.2 §7 | 装配规则、非功能、数据归属和配置红线覆盖。 |
| §5.4 测试切口反向覆盖矩阵 | R5.2 §8 | 装配 Step 3 切口到需求 / 规则 / 设计契约的反查关系。 |
| §5.5 未覆盖项、停审和跨覆盖审计 | R5.2 §9~§11 | 装配 P0 空洞判断、P1/P2 residual、停审和审计结论。 |

### 13. 待确认事项

| 待确认事项 | 影响 | 当前处理 |
|---|---|---|
| Step 6 用例矩阵规模较大 | 需要按切口和场景族分批写入。 | Step 6 先思考分批,不得一次性压缩。 |
| dependency boundary scan 的具体方式 | 影响 Step 9 自动化门禁和 Step 13 evidence。 | 当前只保留 boundary evidence 候选。 |
| repository write-audit / no-write 检查方式 | 影响 query no-write 和 job no truth repair。 | Step 9 收口。 |
| NFR-ML-001~003 是否需要最小性能 smoke | 影响 Step 10 非功能验证。 | 当前不设硬阈值。 |
| evidence candidate 命名是否需要统一规范 | 影响 Step 13 归档。 | Step 13 前可调整,当前不固定。 |

### 14. Step 6 进入条件

| 条件 | 状态 | 说明 |
|---|---|---|
| P0 覆盖矩阵无空洞,或空洞已进入风险 | pass | 当前 P0 未发现未覆盖项。 |
| 覆盖矩阵可从需求 / 规则查测试切口 | pass | 见 §6 / §7。 |
| 覆盖矩阵可从测试切口反查需求 / 规则 / 设计契约 | pass | 见 §8。 |
| 覆盖矩阵已停审 | pass | 见 §10。 |
| 跨覆盖项审计无 unresolved 冲突 | pass | 见 §11。 |
| 未提前写 Step 6+ 内容 | pass | 未写最终 TC、用例矩阵、数据、环境、自动化、evidence、验收或实施内容。 |
| 正式 `05-测试方案.md` 未修改 | pass | 正式正文仍留到 Step 15 装配。 |

### 15. R5.2 stop-review

| 检查项 | 结果 |
|---|---|
| 是否写入 Step 5 必读文档表 | pass |
| 是否写入 Step 4 handoff 承接 | pass |
| 是否写入 SOP 八问回答 | pass |
| 是否写入 L1-governance 框架参考边界 | pass |
| 是否写入 FR-ML / 核心能力正向覆盖候选 | pass |
| 是否写入 BR-ML / NFR-ML / 数据归属 / 配置红线覆盖候选 | pass |
| 是否写入 Step 3 测试切口反向覆盖候选 | pass |
| 是否写入未覆盖项、停审、跨覆盖审计和 Step 6 进入条件 | pass |
| 是否未修改正式 `05-测试方案.md` | pass |
| 是否未写最终 TC、用例矩阵、数据、环境、自动化、evidence schema、验收或实施内容 | pass |

next_allowed_action: 等待用户确认后进入 Step 6 `R6.1 测试场景与用例矩阵:先思考`;只允许思考 Step 6 开工边界、必读文档、Step 5 handoff、L1-governance Step 6 框架参考、测试场景 / 用例矩阵 / 断言 / 自动化候选边界和 R6.2 写入边界;不得直接修改正式 `05-测试方案.md`;不得写最终用例矩阵、测试数据、环境矩阵、自动化门禁、evidence schema、正式验收标准、实施计划或 implementation code。
