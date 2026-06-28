# Step 5. 定义功能验收门禁

> 对应 SOP: `standards/document/验收标准讨论流程_SOP.md` Step 5
> 回填章节: `06-验收标准.md` §5 功能验收门禁
> 创建日期: 2026-06-28
> 当前模式: full-restart / step5-function-gate
> 当前状态: completed_wait_user_confirm_to_R6.1
> 当前模块: `R5.2 function gate:再写入`
> 当前门禁: `R5.2` completed_wait_user_confirm_to_R6.1;等待确认进入 Step 6 `R6.1 data arch redlines:先思考`

---

## R5.1 function gate:先思考

### 1. 当前模块目标

`R5.1` 只思考新版 `06-验收标准.md` 的 P0 功能验收门禁如何从 `00-需求文档.md` 的核心闭环 / FR-ML、`03-详细设计.md` 的对象 / protocol / flow / state / job 契约、`05-测试方案.md` 的 `TC-ML-*` / `EV-ML-*` 证据族收敛。

当前模块不修改正式 `06-验收标准.md`,不写最终功能验收门禁表,不填写真实 pass/fail,不裁决 VETO,不进入 Step 6。

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm_to_R5.2 |
| 用户确认 | 已确认从 Step 4 completed 推进到 Step 5 `R5.1 function gate:先思考`。 |
| 当前允许 | 思考 P0 功能验收项、通过 / 失败条件候选、设计契约 / TC / EV / report path 映射和 R5.2 写入边界。 |
| 当前禁止 | 修改正式 `06`;写真实执行结论;写 Step 6 红线门禁;正式裁决 VETO。 |

### 2. 本模块输入承接

| 输入 | R5.1 关注点 | 禁止外推 |
|---|---|---|
| Step 2 范围表 | P0 core、P1 selected-run、P2 future 和只验接缝口径。 | 把 P1/P2 selected-run 写成 P0 功能通过证据。 |
| Step 4 进入 / 退出条件 | 功能验收项必须可判定、可回指证据、不得缺 artifact/report pair。 | 在缺 run_id / evidence 时写真实通过结论。 |
| `00-需求文档.md` §14 | 核心闭环验收和功能能力验收:统一定义、正式版本、受控消费、分发、追溯、一致性、证据线索、外围增强不阻塞。 | 把规则 / 数据归属 / 非功能 / VETO 全部混入 Step 5。 |
| `00-需求文档.md` §16 | FR-ML-001~009 和 FR-ML-E-* 到验收方向的追溯。 | 将 FR-ML-E-* 写成 P0 pass 前置。 |
| `03-详细设计.md` | definition/catalog、formalization/version、consumption、distribution、trace/impact/evidence、job/report 的对象 / protocol / flow / state / test cut。 | 在验收标准里补字段、port、mapper、state 或 evidence schema。 |
| `05-测试方案.md` §5 / §13 | `TC-ML-*` 用例族、`EV-ML-*` 证据族、suite / report path。 | 使用旧 EV-001 / TC-CMD / GATE-T 或泛化“证据见报告”。 |
| L1-governance Step 5 | framework_reference | 参考“门禁表 + 闭环矩阵 + P1/P2 后置 + 停审 + 跨功能审计”的粒度。 | 复制 governance 领域 AC / VF / EV 编号。 |

### 3. SOP Step 5 问题思考

| SOP 问题 | R5.1 初判 | R5.2 写入提醒 |
|---|---|---|
| 每个 P0 功能的通过条件是什么? | 每个 P0 功能项必须同时满足:正式设计契约成立、相关 `TC-ML-*` 用例族覆盖、对应 `EV-ML-*` 证据存在、report path 固定、raw artifact 可追溯、失败条件未触发。 | 写成可判定条件,不用“功能正常”。 |
| 每个 P0 功能的失败条件是什么? | truth 不成立、formal version 静默覆盖、未正式化资产被正式消费、消费仓替代定义、分发 / handoff 缺正式边界、trace / impact / evidence 不可追溯、job/query 反写真相、证据无法回指 raw artifact。 | VETO 正式裁决留给 Step 11,但功能失败条件可指向潜在 VETO。 |
| 证据来自哪些测试用例或报告? | 主要来自 `contract-domain-fast`、`service-flow-fast`、`entry-worker-job`、`operations-replay-core`、`report-generation-audit`、`release-main-smoke` 及 `EV-ML-CONTRACT/SERVICE/ENTRY/REPLAY/REPORT/RELEASE`。 | config/redaction/dependency/observability 可被功能项引用,但主裁决分别在 Step 9/10/11 加严。 |
| 哪些 P1 功能只做后置边界验收? | durable / real-like adapter、真实外部服务、staging-like profile、selected-run、高级 dashboard、marketplace/package、production-like capacity。 | 明确 P1/P2 不作为 P0 pass 前置。 |
| 哪些功能失败会导致总体不通过? | P0 core 和 FR-ML-001~009 任一功能失败,正式结论不得为“通过”;若触发 truth / version / boundary / evidence integrity 红线,不得风险接受。 | R5.2 写裁决影响,但不写真实 verdict。 |
| 每个功能验收项能否回指需求 / 设计契约、测试用例、证据 ID 和 report path? | 可以按核心闭环 4 项 + FR-ML 功能 8~9 项建立闭环矩阵。 | report path 使用 `reports/runs/<run_id>/...` 占位。 |
| 每个功能验收项完成后是否通过停审? | R5.2 需要逐项停审:设计来源正式、证据来源固定、通过/失败条件可判定、P1/P2 未污染 P0。 | R5.1 只确定停审维度。 |
| 所有功能验收项完成后是否存在 P0 功能缺门禁、证据重复或裁决影响冲突? | R5.2 需要跨功能审计:孤儿 FR、孤儿 TC/EV、release smoke 误用、P1 污染、证据路径断裂。 | R5.1 只列审计方向。 |

### 4. 功能验收项候选思考

#### 4.1 核心闭环候选

| 候选验收项 | 来源 | R5.1 判断 |
|---|---|---|
| 方法资产统一定义与识别成立 | `00` §14;FR-ML-001~002 | P0。可合并 definition truth、typed ref、catalog、适用语境和 Definition vs Use。 |
| 稳定版本进入正式使用语境成立 | `00` §14;FR-ML-003~004 | P0。覆盖 formalization、formal version、state guard、显式变化。 |
| 下游按边界消费成立 | `00` §14;FR-ML-005~006 | P0。覆盖 controlled consumption、safe shell、distribution/handoff、availability。 |
| 变化追溯与消费一致性保护成立 | `00` §14;FR-ML-007~009 | P0。覆盖 trace、impact、lineage、evidence、report 和 job no truth repair。 |

#### 4.2 FR-ML 功能候选

| 候选验收项 | 来源 | R5.1 判断 |
|---|---|---|
| 方法资产定义表达与目录识别能力 | FR-ML-001~002 | P0。可以拆成一个稳定功能门禁,避免 definition/catalog 证据分散。 |
| 方法资产正式化与版本稳定能力 | FR-ML-003~004 | P0。覆盖正式化触发、版本稳定、显式变化和状态守卫。 |
| 正式方法资产受控消费能力 | FR-ML-005 | P0。覆盖下游只能消费,不得迁移定义 truth。 |
| 方法资产消费语境分发能力 | FR-ML-006 | P0。覆盖分发 / handoff / availability seam。 |
| 方法资产追溯能力 | FR-ML-007 | P0。覆盖版本、变更依据、引用语境、audit / lineage。 |
| 方法资产消费一致性保护能力 | FR-ML-008 | P0。覆盖 impact summary、重复 / replay、保护既有引用。 |
| 方法资产证据线索承接能力 | FR-ML-009 | P0。覆盖 `EV-ML-*` 能进入验收 / 审计语境。 |
| 外围增强能力不阻塞核心闭环 | FR-ML-E-* | P0 边界项。不是增强能力通过,而是证明未完成增强不阻塞核心 P0。 |

### 5. 证据映射候选思考

| 功能轴 | TC 候选 | EV 候选 | report path 候选 |
|---|---|---|---|
| definition truth / catalog | `TC-ML-TRUTH-*`;`TC-ML-IDENTITY-*`;`TC-ML-CATALOG-*`;`TC-ML-BOUNDARY-*`;`TC-ML-SHELL-*`;`TC-ML-POLLUTION-*` | `EV-ML-CONTRACT-001` | `reports/runs/<run_id>/suites/contract-domain-fast.md` |
| formal version / state | `TC-ML-FORMALIZATION-*`;`TC-ML-VERSION-*`;`TC-ML-CHANGE-*`;`TC-ML-STATE-*`;`TC-ML-IDEMP-*` | `EV-ML-CONTRACT-001`;`EV-ML-SERVICE-001` | `contract-domain-fast.md`;`service-flow-fast.md` |
| controlled consumption / distribution | `TC-ML-CONSUMPTION-*`;`TC-ML-DISTRIBUTION-*`;`TC-ML-PUBLISHER-*`;`TC-ML-HANDOFF-*`;`TC-ML-AVAILABILITY-*`;`TC-ML-SHELL-*` | `EV-ML-SERVICE-001`;`EV-ML-ENTRY-001` | `service-flow-fast.md`;`entry-worker-job.md` |
| traceability / consistency / evidence | `TC-ML-TRACE-*`;`TC-ML-AUDIT-*`;`TC-ML-LINEAGE-*`;`TC-ML-IMPACT-*`;`TC-ML-EVIDENCE-*`;`TC-ML-REPLAY-*`;`TC-ML-UOW-*`;`TC-ML-JOB-*` | `EV-ML-REPLAY-001`;`EV-ML-REPORT-001`;`EV-ML-ENTRY-001` | `operations-replay-core.md`;`entry-worker-job.md`;`report-generation-audit.md` |
| release representative | representative `TC-ML-*` | `EV-ML-RELEASE-001` | `release-main-smoke.md` |

### 6. P1 / P2 后置边界思考

| 功能 / 能力 | R5.1 判断 | R5.2 写入提醒 |
|---|---|---|
| durable / real-like adapter | P1 selected-run。 | 不作为 P0 功能通过条件。 |
| 真实外部服务 / staging-like profile | P1 selected-run。 | 不替代 P0 controlled seam。 |
| production-like capacity / long-run | P2 future。 | Step 9 / Step 13 处理。 |
| advanced dashboard / marketplace / package | P2 / peripheral。 | 只验不破坏 truth boundary。 |
| Qualification / CapabilityDefinition 独立核心资产 | 待确认 / 不纳入当前核心功能。 | 若纳入必须回写前序 Step。 |

### 7. 旧正式 06 污染思考

| 旧口径 | R5.1 判断 | R5.2 处理 |
|---|---|---|
| 旧 MethodContent / publish / snapshot 功能门禁 | 与当前 FR-ML 和 `TC-ML-*` 不一致。 | 不进入新版功能门禁。 |
| 旧 API / DB / outbox 证据 | 与当前 `EV-ML-*` 和 report path 不一致。 | 禁止作为证据来源。 |
| P95 / SLO 被当成功能通过条件 | 属于非功能,且当前无硬阈值基线。 | Step 9 处理。 |

### 8. R5.2 写入策略思考

R5.2 应写入 Step 5 的完整中间产物,但仍不修改正式 `06-验收标准.md`。

| 写入范围 | 目的 |
|---|---|
| 功能验收门禁表 | 固定 P0 功能验收项、通过条件、失败条件、证据来源。 |
| 功能验收闭环矩阵 | 将每项回指需求 / 设计契约 / TC / EV / report path / 裁决影响。 |
| P1/P2 功能后置边界 | 防止 selected-run / future 污染 P0。 |
| 功能验收项停审记录 | 逐项检查设计来源、证据来源、可判定性和 P1 污染风险。 |
| 跨功能门禁审计表 | 检查孤儿 FR、孤儿 TC/EV、证据重复、裁决冲突、路径断裂。 |
| 回填草稿 | 提供未来 `06` §5 草稿,不写正式文档。 |

### 9. R5.2 写入边界思考

`R5.2 function gate:再写入` 可以写入:

1. `06_acceptance_step_05_function_gate.md` 的 SOP 问题回答、功能门禁表、闭环矩阵、P1/P2 后置边界、停审记录、跨功能审计、回填草稿和进入 Step 6 条件。
2. `06_acceptance_calibration_flow.md` 推进到 Step 5 completed_wait_user_confirm_to_R6.1。
3. `project_execution_ledger.md` 推进到 `06` Step 5 completed_wait_user_confirm_to_R6.1。

`R5.2` 禁止写入:

1. 正式 `06-验收标准.md` 正文。
2. Step 6 数据边界 / 架构红线正式门禁。
3. Step 7 接口 / 事件 / 跨仓同步正式门禁。
4. 真实测试执行结论、真实缺陷状态、risk acceptance 签署、最终 verdict。
5. 新测试用例、evidence schema、artifact schema、report schema、CI YAML 或 implementation boundary。

### 10. R5.1 stop-review

| 检查项 | 结果 |
|---|---|
| 是否按项目台账和 06 flow 恢复 | pass |
| 是否只推进 Step 5 R5.1 | pass |
| 是否承接 Step 2 / Step 4 和 `00` §14 / `05` §13 | pass |
| 是否识别 P0 功能验收项候选 | pass |
| 是否识别 TC / EV / report path 映射候选 | pass |
| 是否明确 P1/P2 不污染 P0 | pass |
| 是否未填写真实测试 / 缺陷 / verdict 结论 | pass |
| 是否未修改正式 `06-验收标准.md` | pass |
| 是否形成 R5.2 写入边界 | pass |

next_allowed_action: 等待用户确认后进入 Step 5 `R5.2 function gate:再写入`;只允许写入 Step 5 的 SOP 问题回答、功能验收门禁表、功能闭环矩阵、P1/P2 后置边界、停审记录、跨功能审计、回填草稿、待确认事项和进入 Step 6 条件,并推进 flow / project ledger;不得修改正式 `06-验收标准.md`、`07-实施计划.md`、CI YAML、脚本实现、真实执行结论、验收 verdict 或 implementation code。

---

## R5.2 function gate:再写入

### 11. R5.2 模块状态

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm_to_R6.1 |
| 用户确认 | 已确认从 Step 5 `R5.1 function gate:先思考` 推进到 `R5.2 function gate:再写入`。 |
| 当前写入 | SOP 问题回答、问题诊断、前后对比、裁决取舍、功能门禁表、闭环矩阵、P1/P2 后置边界、停审、跨功能审计、回填草稿、待确认事项和进入 Step 6 条件。 |
| 当前禁止 | 修改正式 `06`;写 Step 6 红线;写真实测试执行结论;写 final verdict;补 TC / EV / artifact schema。 |

### 12. SOP 问题回答

| SOP 问题 | R5.2 回答 |
|---|---|
| 每个 P0 功能的通过条件是什么? | 每个 `ML-FG-*` 必须同时具备:正式需求来源、正式设计契约、对应 `TC-ML-*` 用例族、正式 `EV-ML-*` 证据族、固定 suite report path、raw artifact pairing 方向和未触发失败条件。 |
| 每个 P0 功能的失败条件是什么? | 统一定义不成立、正式版本被静默覆盖、未正式资产被正式消费、消费仓迁移定义真相、分发 / handoff 只有人工约定、追溯 / 影响 / 证据线索不可回指、query / job 反写真相、证据不能回指 raw artifact 时,对应功能门禁失败。 |
| 证据来自哪些测试用例或报告? | 主要来自 `contract-domain-fast`、`service-flow-fast`、`entry-worker-job`、`operations-replay-core`、`report-generation-audit`、`release-main-smoke` 及 `EV-ML-CONTRACT-001`、`EV-ML-SERVICE-001`、`EV-ML-ENTRY-001`、`EV-ML-REPLAY-001`、`EV-ML-REPORT-001`、`EV-ML-RELEASE-001`。 |
| 哪些 P1 功能只做后置边界验收? | durable / real-like adapter、真实外部服务、staging-like profile、production-like capacity、advanced dashboard、marketplace / package 生态、MethodPlugin / MethodConfiguration 深化和高级策略变体只进 selected-run、residual 或 future。 |
| 哪些功能失败会导致总体不通过? | `ML-FG-001~012` 任一 P0 功能失败时,正式结论不得为“通过”;若失败同时触发 truth owner、body-free、evidence integrity、no private fallback 等红线,由 Step 11 一票否决最终裁决。 |
| 每个功能验收项能否回指需求 / 设计契约、测试用例、证据 ID 和 report path? | 可以。见 §16 功能验收闭环矩阵。 |
| 每个功能验收项完成后是否通过停审? | 已按设计来源、测试来源、证据来源、可判定性和 P1/P2 污染风险停审。见 §18。 |
| 所有功能验收项完成后是否存在 P0 功能缺门禁、证据重复或裁决影响冲突? | 未发现 unresolved 冲突。重复证据属于 suite 复用,不得用单条 smoke 或 summary 替代底层 suite / raw artifact。 |

### 13. 当前文档问题诊断

| 位置 | 当前问题 | 本 Step 处理 |
|---|---|---|
| 旧正式 `06-验收标准.md` | 仍含旧 `MethodContent`、publish、snapshot、outbox、PostgreSQL、gateway、P95 等历史口径。 | 全部作为污染诊断,不得进入新版功能门禁。 |
| 旧功能门禁表达 | 偏向“功能可用 / 接口可用 / 数据正确”式口径。 | 改为每项必须写通过条件、失败条件、TC、EV、report path 和裁决影响。 |
| `00-需求文档.md` §14 | 只有验收方向,没有 run-scoped evidence 裁决表。 | 本 Step 将核心闭环和 FR-ML 转成可裁决门禁,不补测试 schema。 |
| `05-测试方案.md` §13 | 已固定 `EV-ML-*` 证据族和 report / artifact 路径方向。 | 本 Step 只消费正式 `EV-ML-*`,不继承旧 EV / TC。 |
| P1/P2 外围能力 | 容易被误写成核心通过前置。 | 本 Step 明确 FR-ML-E-* 只验证“不阻塞核心闭环”。 |

### 14. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 功能验收主语 | 旧方法内容发布 / 快照 / 网关 / DB 口径。 | 方法资产定义、正式化版本、受控消费、分发、追溯、一致性和证据线索。 | 承接新版 `00`~`05`。 |
| 通过条件 | 功能正常、接口成功、报表存在。 | 需求 + 设计契约 + TC + EV + report path + raw artifact pairing 同时成立。 | 验收必须可裁决。 |
| 失败条件 | 泛化异常或缺陷。 | 明确 truth 缺失、边界被打穿、query/job 反写、证据不可追溯、P1 污染 P0。 | 支撑后续不通过 / VETO。 |
| 证据 | 旧 API / DB / outbox / 静态报告。 | `EV-ML-*` + `reports/runs/<run_id>` + `artifacts/test/<run_id>`。 | 防止静态造证据。 |
| P1/P2 | 可能混入 P0 功能通过。 | selected-run / residual / future。 | 保持核心闭环不被外围能力拖垮。 |

### 15. 验收裁决取舍

| 议题 | 方案 | 取舍 |
|---|---|---|
| 是否只写 4 个核心闭环项 | A. 只写 4 项;B. 保留 4 个核心项并拆 FR 功能项 | 采用 B。核心项证明端到端闭环,FR 项便于缺陷和证据定位。 |
| 是否给功能验收项新建 `AC-ML-*` | A. 新建需求级 AC;B. 使用 `ML-FG-*` 作为验收标准本地门禁 ID | 采用 B。避免在 `06` 中反向新增需求编号。 |
| 是否允许 `release-main-smoke` 单独证明全部功能 | A. 允许;B. 不允许 | 采用 B。smoke 只证明代表性闭环,底层 suite 仍必须存在。 |
| 是否把 Step 6~11 红线混入本 Step | A. 混入;B. 留给后续 Step | 采用 B。本 Step 只定义功能失败条件,红线和 VETO 由 Step 6~11 加严。 |
| 是否让 FR-ML-E-* 成为 P0 通过前置 | A. 是;B. 否 | 采用 B。只验外围增强未污染核心闭环。 |

## 16. 结构化中间产物

### 16.1 功能验收门禁表

| 验收项 ID | 功能 / 场景 | 优先级 | 通过条件 | 失败条件 | 证据来源 |
|---|---|---|---|---|---|
| ML-FG-001 | 方法资产统一定义与识别成立 | P0 | 方法资产能够作为本仓统一定义语义被建立、识别、归类和引用;typed ref、catalog、适用语境和 Definition vs Use 边界均来自正式契约。 | 定义散落到文档或消费仓私有模型;catalog / identity 不可稳定识别;外部正文或旧 `MethodContent` 成为 truth。 | `TC-ML-TRUTH-*`;`TC-ML-IDENTITY-*`;`TC-ML-CATALOG-*`;`TC-ML-BOUNDARY-*`;`TC-ML-SHELL-*`;`EV-ML-CONTRACT-001` |
| ML-FG-002 | 稳定版本进入正式使用语境成立 | P0 | 正式化状态、正式版本、依据摘要、版本语义变化和状态守卫均成立;正式与非正式调整语境可区分。 | 未正式资产进入正式消费;正式版本被静默覆盖;版本变化无显式记录;非法状态转换未拒绝。 | `TC-ML-FORMALIZATION-*`;`TC-ML-VERSION-*`;`TC-ML-CHANGE-*`;`TC-ML-STATE-*`;`TC-ML-IDEMP-*`;`EV-ML-CONTRACT-001`;`EV-ML-SERVICE-001` |
| ML-FG-003 | 下游按边界消费成立 | P0 | process、identity、runtime、member-images 等消费方只能按 ref、safe shell、consumption material、distribution / handoff 边界消费正式语义。 | 消费仓拥有或改写定义真相;query / consumer / distribution 反写核心 truth;分发只靠人工同步;availability 缺安全降级。 | `TC-ML-CONSUMPTION-*`;`TC-ML-DISTRIBUTION-*`;`TC-ML-PUBLISHER-*`;`TC-ML-HANDOFF-*`;`TC-ML-AVAILABILITY-*`;`EV-ML-SERVICE-001`;`EV-ML-ENTRY-001` |
| ML-FG-004 | 变化追溯与消费一致性保护成立 | P0 | 正式化、版本语义变化、消费影响、trace/audit/lineage/evidence 和维护 job report 可回溯,且不会静默破坏既有消费。 | 变化依据不可追溯;impact summary 缺失;duplicate / replay 重跑 mutation;job 修复 core truth;证据线索无法回指定义来源。 | `TC-ML-TRACE-*`;`TC-ML-AUDIT-*`;`TC-ML-LINEAGE-*`;`TC-ML-IMPACT-*`;`TC-ML-EVIDENCE-*`;`TC-ML-REPLAY-*`;`TC-ML-UOW-*`;`TC-ML-JOB-*`;`EV-ML-REPLAY-001`;`EV-ML-REPORT-001` |
| ML-FG-005 | 方法资产定义表达与目录识别能力 | P0 | FR-ML-001~002 的定义表达、身份识别、目录语义、适用语境和定义来源共同成立。 | 方法资产只能以散落正文表达;identity / catalog 不能稳定回指;旧材料污染当前主语。 | `TC-ML-TRUTH-*`;`TC-ML-IDENTITY-*`;`TC-ML-CATALOG-*`;`TC-ML-POLLUTION-*`;`EV-ML-CONTRACT-001` |
| ML-FG-006 | 方法资产正式化与版本稳定能力 | P0 | FR-ML-003~004 的正式化触发、正式/非正式区分、正式版本稳定、显式变化和状态 guard 成立。 | 正式化依据缺失;版本语义静默改变;非法转换 accepted;重复请求制造第二正式版本。 | `TC-ML-FORMALIZATION-*`;`TC-ML-VERSION-*`;`TC-ML-CHANGE-*`;`TC-ML-STATE-*`;`EV-ML-CONTRACT-001`;`EV-ML-SERVICE-001` |
| ML-FG-007 | 正式方法资产受控消费能力 | P0 | FR-ML-005 的 consumption material、safe shell、Definition vs Use guard 和 query no-write 成立。 | 下游绕过本仓创建定义;未正式资产被正式消费;消费材料保存外部正文;query 写入 truth。 | `TC-ML-CONSUMPTION-*`;`TC-ML-QUERY-*`;`TC-ML-SHELL-*`;`TC-ML-BOUNDARY-*`;`EV-ML-SERVICE-001` |
| ML-FG-008 | 方法资产消费语境分发能力 | P0 | FR-ML-006 的 distribution context、publisher candidate、handoff / availability seam 和受控协作边界成立。 | 分发结果替代定义 truth;publisher 从 current truth 临时重算 payload;handoff 缺 receipt/report 边界。 | `TC-ML-DISTRIBUTION-*`;`TC-ML-PUBLISHER-*`;`TC-ML-HANDOFF-*`;`TC-ML-AVAILABILITY-*`;`EV-ML-ENTRY-001`;`EV-ML-SERVICE-001` |
| ML-FG-009 | 方法资产追溯能力 | P0 | FR-ML-007 的版本、变更依据、引用语境、audit trail 和 lineage 可追溯。 | trace / audit / lineage 只存在日志或人工说明;外部依据正文入仓;追溯链无法回指正式版本。 | `TC-ML-TRACE-*`;`TC-ML-AUDIT-*`;`TC-ML-LINEAGE-*`;`EV-ML-ENTRY-001`;`EV-ML-REPORT-001` |
| ML-FG-010 | 方法资产消费一致性保护能力 | P0 | FR-ML-008 的 impact summary、consistency protection、stored replay、UoW 和维护 job no truth repair 成立。 | 变化静默破坏既有引用;duplicate 重跑 mutation;UoW 部分提交;job 修核心 truth 或用 private state 证明恢复。 | `TC-ML-IMPACT-*`;`TC-ML-REPLAY-*`;`TC-ML-UOW-*`;`TC-ML-JOB-*`;`EV-ML-REPLAY-001`;`EV-ML-ENTRY-001` |
| ML-FG-011 | 方法资产证据线索承接能力 | P0 | FR-ML-009 的 evidence lineage、report audit、artifact/report pairing 和验收 / 审计承接成立。 | 证据线索只存在人工描述;report 不是 raw artifact 推导;`latest` 替代 fixed run_id;证据包含 raw body。 | `TC-ML-EVIDENCE-*`;`TC-ML-REPORT-*`;`TC-ML-AUDIT-*`;`EV-ML-REPORT-001`;`EV-ML-RELEASE-001` |
| ML-FG-012 | 外围增强能力不阻塞核心闭环 | P0 boundary | FR-ML-E-* 未完成时,核心定义、正式化、受控消费、追溯和证据线索仍可验收;若外围实现,必须遵守核心 truth 边界。 | MethodPlugin、MethodConfiguration、marketplace、dashboard、标准映射材料或 real-like adapter 被写成 P0 前置。 | `TC-ML-BOUNDARY-*`;`TC-ML-DEPENDENCY-*`;representative `TC-ML-*`;`EV-ML-DEPENDENCY-001`;`EV-ML-RISK-001` residual only |

### 16.2 功能验收闭环矩阵

| 验收项 ID | 需求来源 | 设计契约 | 测试用例 | 证据 ID | report path | 裁决影响 |
|---|---|---|---|---|---|---|
| ML-FG-001 | `00` §14.1;FR-ML-001~002 | `03` §5~§8 definition/catalog;§15 module/protocol cuts | `TC-ML-TRUTH-*`;`TC-ML-IDENTITY-*`;`TC-ML-CATALOG-*`;`TC-ML-BOUNDARY-*` | `EV-ML-CONTRACT-001` | `reports/runs/<run_id>/suites/contract-domain-fast.md` | 失败则不通过;可能触发 truth owner / body-free 红线。 |
| ML-FG-002 | `00` §14.1;FR-ML-003~004 | `03` §6 object index;§8 command flow;§9 state;§12 idempotency | `TC-ML-FORMALIZATION-*`;`TC-ML-VERSION-*`;`TC-ML-CHANGE-*`;`TC-ML-STATE-*` | `EV-ML-CONTRACT-001`;`EV-ML-SERVICE-001` | `contract-domain-fast.md`;`service-flow-fast.md` | 失败则不通过;版本静默覆盖可能触发 VETO。 |
| ML-FG-003 | `00` §14.1;FR-ML-005~006 | `03` §7 Query/Event/Job protocol;§8 flow;§10 persistence no-write | `TC-ML-CONSUMPTION-*`;`TC-ML-DISTRIBUTION-*`;`TC-ML-PUBLISHER-*`;`TC-ML-HANDOFF-*` | `EV-ML-SERVICE-001`;`EV-ML-ENTRY-001` | `service-flow-fast.md`;`entry-worker-job.md` | 失败则不通过;消费仓迁移 truth 触发边界红线。 |
| ML-FG-004 | `00` §14.1;FR-ML-007~009 | `03` §8 job flow;§10 UoW;§12 replay;§14 audit;§15 evidence cuts | `TC-ML-TRACE-*`;`TC-ML-AUDIT-*`;`TC-ML-LINEAGE-*`;`TC-ML-IMPACT-*`;`TC-ML-EVIDENCE-*` | `EV-ML-REPLAY-001`;`EV-ML-REPORT-001` | `operations-replay-core.md`;`report-generation-audit.md` | 失败则不通过;证据不可追溯可能触发 evidence integrity VETO。 |
| ML-FG-005 | FR-ML-001~002 | `03` §6 object family;§15 contract test cuts | `TC-ML-TRUTH-*`;`TC-ML-IDENTITY-*`;`TC-ML-CATALOG-*`;`TC-ML-POLLUTION-*` | `EV-ML-CONTRACT-001` | `contract-domain-fast.md` | 失败则不通过。 |
| ML-FG-006 | FR-ML-003~004 | `03` §8 command flow;§9 business truth state;§12 idempotency | `TC-ML-FORMALIZATION-*`;`TC-ML-VERSION-*`;`TC-ML-STATE-*`;`TC-ML-IDEMP-*` | `EV-ML-CONTRACT-001`;`EV-ML-SERVICE-001` | `contract-domain-fast.md`;`service-flow-fast.md` | 失败则不通过。 |
| ML-FG-007 | FR-ML-005 | `03` §7 Query protocol;§8 query no-write;§15 protocol cuts | `TC-ML-CONSUMPTION-*`;`TC-ML-QUERY-*`;`TC-ML-SHELL-*` | `EV-ML-SERVICE-001` | `service-flow-fast.md` | 失败则不通过。 |
| ML-FG-008 | FR-ML-006 | `03` §7 outbound / job protocol;§8 publisher / handoff flow | `TC-ML-DISTRIBUTION-*`;`TC-ML-PUBLISHER-*`;`TC-ML-HANDOFF-*`;`TC-ML-AVAILABILITY-*` | `EV-ML-ENTRY-001`;`EV-ML-SERVICE-001` | `entry-worker-job.md`;`service-flow-fast.md` | 失败则不通过。 |
| ML-FG-009 | FR-ML-007 | `03` §6 trace/audit objects;§14 audit cuts | `TC-ML-TRACE-*`;`TC-ML-AUDIT-*`;`TC-ML-LINEAGE-*` | `EV-ML-ENTRY-001`;`EV-ML-REPORT-001` | `entry-worker-job.md`;`report-generation-audit.md` | 失败则不通过。 |
| ML-FG-010 | FR-ML-008 | `03` §10 transaction;§12 replay;§8 job no truth repair | `TC-ML-IMPACT-*`;`TC-ML-REPLAY-*`;`TC-ML-UOW-*`;`TC-ML-JOB-*` | `EV-ML-REPLAY-001`;`EV-ML-ENTRY-001` | `operations-replay-core.md`;`entry-worker-job.md` | 失败则不通过。 |
| ML-FG-011 | FR-ML-009 | `03` §14 evidence/audit;§15 report/evidence cuts;`05` §13 | `TC-ML-EVIDENCE-*`;`TC-ML-REPORT-*`;`TC-ML-AUDIT-*` | `EV-ML-REPORT-001`;`EV-ML-RELEASE-001` | `report-generation-audit.md`;`release-main-smoke.md` | 失败则不通过;release smoke 不替代底层 suite。 |
| ML-FG-012 | FR-ML-E-* | `00` §14;`03` §2.3 non-scope;§13 dependency binding | `TC-ML-BOUNDARY-*`;`TC-ML-DEPENDENCY-*`;selected `TC-ML-*` | `EV-ML-DEPENDENCY-001`;`EV-ML-RISK-001` residual only | `dependency-boundary.md`;P1 residual report | 外围未完成不阻塞 P0;外围污染 P0 则不通过。 |

### 16.3 P1 / P2 功能后置边界

| 功能 / 能力 | 当前裁决 | 后续承接 |
|---|---|---|
| durable / real-like adapter | 不作为 P0 功能通过前置。 | `EV-ML-RISK-001` selected-run / residual;若升级为 P0 必须回写 `04/05/06/07`。 |
| 真实外部服务 / staging-like profile | 不作为 P0 功能通过前置。 | Step 13 风险接受或 release 条件;不得替代 fake / controlled seam。 |
| production-like capacity / long-run | 不作为本 Step 功能门禁。 | Step 9 / Step 13 处理。 |
| advanced dashboard / marketplace / package | 外围增强。 | 只验不破坏 truth boundary;不作为核心闭环前置。 |
| MethodPlugin / MethodConfiguration 深化 | 外围增强或待确认。 | 若纳入核心,必须回写需求、架构、概要和测试方案。 |
| Qualification / CapabilityDefinition 独立核心资产 | 待确认,不纳入当前 P0。 | 若纳入必须回写 `00`~`05`。 |

### 16.4 功能验收项停审记录

| 验收项 ID | 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|---|
| ML-FG-001~004 | 核心闭环均回指 `00` §14、正式 `03` 设计章节和 `05` §13 EV | pass | 正式验收时必须提供 fixed `run_id` 下的 artifact/report pairing。 |
| ML-FG-005~011 | FR-ML-001~009 均有功能门禁、TC、EV 和 report path | pass | `TC-ML-*` 使用族级引用;具体 case 由正式 `05` 和 evidence index 证明。 |
| ML-FG-012 | FR-ML-E-* 未污染 P0 | pass | `EV-ML-RISK-001` 只能作为 residual,不得写成 P0 pass 证据。 |
| 全部 `ML-FG-*` | 通过 / 失败条件可判定 | pass | 不填写真实 pass/fail;正式裁决等待 run evidence。 |
| 全部 `ML-FG-*` | 未误用旧 `06/07` 或旧 MethodContent 主线 | pass | 旧材料只保留为污染诊断。 |

### 16.5 跨功能门禁裁决审计表

| 审计项 | 结论 | 缺口 / 修正 |
|---|---|---|
| P0 功能是否缺门禁 | 未发现缺口 | 核心闭环 4 项 + FR 功能 8 项均已覆盖。 |
| 是否存在孤儿 FR | 未发现缺口 | FR-ML-001~009 和 FR-ML-E-* 均有对应门禁或后置边界。 |
| 是否存在孤儿 P0 用例族 | 未在本 Step 发现 | Step 6~10 继续覆盖边界、接口、一致性、非功能和证据审计用例。 |
| 是否用 release smoke 替代详细证据 | 未采用 | `EV-ML-RELEASE-001` 只作为代表性闭环和 release readiness direction。 |
| 是否存在 P1 污染 P0 | 未发现 | P1/P2 已进入 selected-run / residual / future。 |
| 是否存在证据路径断裂 | 设计层未发现 | 正式验收必须由 Step 3/4 固定 `run_id`、artifact root 和 report root。 |
| 是否存在裁决影响冲突 | 未发现 | 任一 P0 功能失败均不能通过;VETO 由 Step 11 裁决。 |

## 17. 回填草稿

> 校准来源:
> - `design-calibration/06_acceptance_step_05_function_gate.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“功能验收门禁表”“功能验收闭环矩阵”“P1 / P2 功能后置边界”“功能验收项停审记录”和“跨功能门禁裁决审计表”小节,了解功能验收如何从 FR-ML、详细设计和 `EV-ML-*` 证据族收敛。

正式 `06-验收标准.md` §5 应回填:

- 功能验收门禁使用 `ML-FG-001~012`。其中 `ML-FG-001~004` 裁决核心能力闭环,`ML-FG-005~011` 裁决 FR-ML-001~009,`ML-FG-012` 裁决 FR-ML-E-* 不阻塞核心闭环。
- 每个 P0 功能验收项必须同时具备正式需求来源、正式设计契约、`TC-ML-*` 用例族、`EV-ML-*` 证据 ID、`reports/runs/<run_id>/...` report path 和 raw artifact pairing。
- `release-main-smoke` 只能证明代表性方法资产闭环和 release readiness direction,不得单独替代 `contract-domain-fast`、`service-flow-fast`、`entry-worker-job`、`operations-replay-core` 或 `report-generation-audit`。
- 任一 `ML-FG-001~012` 失败时,正式结论不得为“通过”。若失败同时命中 Step 11 一票否决项,不得风险接受。
- P1/P2 功能只能进入 selected-run、residual、future 或 Step 13 风险接受,不得作为 P0 功能通过证据。

## 18. 待确认事项

| 待确认事项 | 影响 | 当前处理 |
|---|---|---|
| 是否需要在正式 `06` 中把 `ML-FG-*` 改为 `AC-ML-*` | 影响验收项编号稳定性 | 当前使用 `ML-FG-*` 作为本地功能门禁 ID,不新增需求级 AC。 |
| `EV-ML-RELEASE-001` 的 release smoke 是否足以证明四个核心闭环的代表性主链 | 影响 ML-FG-001~004 的 release readiness 强度 | 当前要求底层 suite 同时存在,smoke 不替代详细证据。 |
| FR-ML-E-* 是否有某项在本 release 被升级为 P0 | 影响 ML-FG-012 和 Step 13 residual | 当前不升级;若升级必须回写 `00`~`05`。 |

## 19. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| P0 功能都有可裁决门禁 | pass | `ML-FG-001~012` 均定义通过 / 失败条件。 |
| 每项均有需求、设计契约、测试用例、证据 ID、report path | pass | 见 §16.2。 |
| 功能验收项已停审 | pass | 见 §16.4。 |
| 跨功能门禁审计无 unresolved 冲突 | pass | 见 §16.5。 |
| 可进入 Step 6 | pass | 下一步定义数据边界与架构红线验收;进入前等待用户确认。 |

## 20. R5.2 stop-review

| 检查项 | 结果 |
|---|---|
| 是否按项目台账和 06 flow 恢复 | pass |
| 是否只推进 Step 5 R5.2 | pass |
| 是否未修改正式 `06-验收标准.md` | pass |
| 是否覆盖 SOP Step 5 问题 | pass |
| 是否形成可回填功能门禁表与闭环矩阵 | pass |
| 是否明确 P1/P2 不污染 P0 | pass |
| 是否未新增需求、TC、EV、schema 或真实 verdict | pass |
| 是否可以等待用户确认进入 Step 6 R6.1 | pass |

next_allowed_action: 等待用户确认后进入 Step 6 `R6.1 data arch redlines:先思考`;只允许思考数据边界、架构红线、truth owner、Definition vs Use、body-free、query no-write、job no truth repair、P1/P2 污染和 Step 6 写入边界;不得修改正式 `06-验收标准.md`、`07-实施计划.md`、CI YAML、脚本实现、真实执行结论、验收 verdict 或 implementation code。
