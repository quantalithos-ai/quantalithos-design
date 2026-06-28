# Step 1. 确认验收输入边界

> 对应 SOP: `standards/document/验收标准讨论流程_SOP.md` Step 1
> 回填章节: `06-验收标准.md` §1 与上游文档的关系声明
> 创建日期: 2026-06-28
> 当前模式: full-restart / step1-input-boundary
> 当前状态: completed
> 当前模块: `R1.2 input boundary:再写入`
> 当前门禁: `R1.2` completed_wait_user_confirm_to_R2.1;等待确认进入 Step 2 `R2.1 scope:先思考`

---

## R1.1 input boundary:先思考

### 1. 当前模块目标

`R1.1` 只思考新版 `06-验收标准.md` 的输入边界、必读文档、旧正式 06 污染隔离、SOP Step 1 问题、结构化输出形态、回填草稿边界和 R1.2 写入范围。

当前模块不修改正式 `06-验收标准.md`,不定义具体 AC/VETO,不固定真实 run_id,不填写真实测试执行结果,不裁决通过 / 有条件通过 / 不通过,不写 `07-实施计划.md`、CI YAML、脚本实现或 implementation code。

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm_to_R1.2 |
| 用户确认 | 已确认从 `05-测试方案.md` completed 推进到 `06-验收标准.md` full-restart Step 1。 |
| 当前允许 | 思考验收输入边界、必读来源、旧材料诊断、SOP 问题回答框架和 R1.2 写入边界。 |
| 当前禁止 | 修改正式 `06`;定义正式验收项全集;固定真实 run_id;填写执行结果;进入 Step 2。 |

### 2. Step 1 启动前必须承接

| 输入 | 必须承接的内容 | 禁止继承 / 禁止提前 |
|---|---|---|
| `project_execution_ledger.md` | 当前项目恢复点、`05` completed、允许启动 `06` Step 1。 | 跳过 Step 1 直接写正式 `06`。 |
| `06_acceptance_calibration_flow.md` | 当前 Step / 模块 / gate_status / next_allowed_action。 | 在 flow 未允许时推进未来 Step。 |
| `00-需求文档.md` | 核心能力闭环、FR-ML、BR-ML、NFR-ML、验收标准表、一票否决项、风险和待确认事项。 | 在 `06` 中重定义需求或恢复旧 7 类 MethodContent 主线。 |
| `01-架构设计.md` | truth owner、Definition vs Use、依赖方向、数据所有权和跨仓边界。 | 重画架构或把 runtime/event 协作误写成源码依赖。 |
| `02-概要设计.md` | 八个组成部分、对象轮廓、接口骨架、处理流、状态和异常。 | 新增组成部分、对象或状态。 |
| `03-详细设计.md` | 对象、port、protocol、flow、state、transaction、error、idempotency、observability 和 test cut。 | 补 schema、mapper、marker source、state 或 phase boundary。 |
| `04-配置设计.md` | profile、config source、validation、secret/redaction、adapter availability、failure/degradation。 | 把验收门禁写成新配置契约。 |
| `05-测试方案.md` | `TC-ML-*`、`EV-ML-*`、suite / gate、artifact/report root、redaction、dependency、report audit、residual。 | 把测试方案展开成验收报告,或伪造真实证据。 |
| 旧 `06-验收标准.md` | 旧方向污染诊断。 | 继承旧 `MethodContent` / publish / snapshot / outbox / PostgreSQL / gateway / P95 主线。 |
| 验收 SOP / 书写规范 | 15 Step 流程、15 章正式主链、验收项闭环、三值结论、证据引用规则。 | 改章节主链或省略 Step 中间产物。 |
| 中间产物规范 / 可落码性标准 | 三层台账、先思考后写入、正式章节校准来源、不得私补 schema / artifact。 | 用对话记忆替代文件台账。 |

### 3. SOP Step 1 问题思考

| SOP 问题 | R1.1 初判 | R1.2 写入提醒 |
|---|---|---|
| 本轮验收依据哪些需求和设计? | 依据当前 full-restart 后的正式 `00`~`04`,并以 `05` 作为测试证据和门禁输入。 | 建立验收输入映射表,不重新定义需求或设计。 |
| 哪些测试证据会支撑验收裁决? | `05` 已定义 `EV-ML-*` evidence family、suite/check family、raw artifact root 和 report root。 | 写清 `EV-ML-*` 是证据族方向,真实 run_id 和 report 需 Step 3 固定。 |
| 哪些交付版本、环境和数据会成为基线? | 后续 Step 3 必须固定 source refs、implementation commit、run_id、profile、config digest、artifact/report root 和 acceptance handoff。 | 本 Step 只列待固定项,不填假值。 |
| 哪些内容属于测试方案或实施计划,不应写进验收标准? | 测试用例细节、fixture builder、CI 脚本、commit boundary、任务排期、部署 runbook、implementation ledger 不进入 `06`。 | 写入“验收标准不再回答的问题”。 |
| 是否存在阻塞验收标准生成的上游缺口? | 不阻塞 Step 1。真实 evidence、reports/acceptance 和送验版本属于 Step 3 / 10 / 14 前置缺口,不得伪造。 | 记录为后续基线待固定项,不是当前 blocker。 |

### 4. 旧正式 06 污染隔离思考

当前 `projects/L3-method-library/06-验收标准.md` 是旧方向材料,不能作为本轮验收真相源。后续 Step 15 应整体替换正式正文,避免旧主线残留。

| 旧口径 | 当前问题 | R1.2 处理 |
|---|---|---|
| 7 类 P0 `MethodContent` | 与当前方法资产定义 / catalog / formalization / consumption / traceability / distribution / external summary / maintenance 主线不一致。 | 标记为 historical material,不得作为新版验收输入。 |
| `publish` / snapshot / fingerprint / old outbox | 当前 `05` 已清理旧测试主线,旧 `06` 不得反向恢复。 | 只按当前 `05` 的 `EV-ML-*` / suite / report 方向进入验收。 |
| PostgreSQL / object storage stub / fake bus / gateway | 当前测试和配置保持 product-neutral / controlled seam。 | 不能作为验收环境基线,后续 Step 3 只固定当前 profile / dependency 方向。 |
| `EV-001` / `TC-CMD-*` / `GATE-T-*` | 与当前 `TC-ML-*` / `EV-ML-*` / suite family 不一致。 | 全量替换为当前编号族。 |
| P95 / SLO 硬阈值 | 当前 `05` 只保留 sample/trend,硬阈值需要新版 `06` 后续闭口。 | Step 9 再裁决是否硬化,不得在 Step 1 继承旧阈值。 |

### 5. R1.2 写入策略思考

R1.2 应写入 Step 1 的完整中间产物,但仍不修改正式 `06-验收标准.md`。

| 写入范围 | 目的 |
|---|---|
| Step 状态和本步目标 | 固定 Step 1 当前模块和停审方式。 |
| 本步输入 | 列明 `00`~`05`、旧 `06/07`、standards、L1-governance 框架参考的角色。 |
| SOP 问题回答 | 逐项回答验收依据、证据、基线、非职责和缺口。 |
| 当前文档问题诊断 | 标出旧 `06` 的旧主线、旧编号、旧证据和旧环境污染。 |
| 验收裁决取舍 | 固定不伪造 run_id、不直接修旧 `06`、不复制测试用例全集等取舍。 |
| 结构化中间产物 | 形成验收输入映射表、必须回答 / 不再回答的问题、后续基线待固定项。 |
| 回填草稿 | 只提供未来 `06` §1 的草稿,不写正式文档。 |
| 待确认事项和进入下一步条件 | 等待用户确认后进入 Step 2。 |

### 6. R1.2 写入边界思考

`R1.2 input boundary:再写入` 可以写入:

1. `06_acceptance_step_01_input_boundary.md` 的 SOP 问题回答、诊断、取舍、结构化中间产物和回填草稿。
2. `06_acceptance_calibration_flow.md` 推进到 Step 1 completed_wait_user_confirm_to_R2.1。
3. `project_execution_ledger.md` 推进到 `06` Step 1 completed_wait_user_confirm_to_R2.1。

`R1.2` 禁止写入:

1. 正式 `06-验收标准.md` 正文。
2. Step 2 目标 / 范围正文或 Step 3 基线正文。
3. 真实 run_id、真实 pass/fail、defect status、acceptance verdict、release sign-off。
4. 新 AC / VETO / evidence schema / artifact schema / report schema / CI YAML / implementation boundary。

### 7. R1.1 stop-review

| 检查项 | 结果 |
|---|---|
| 是否按项目台账和 `05` flow 恢复 | pass |
| 是否读取验收 SOP、书写规范、中间产物规范和可落码性标准 | pass |
| 是否参考 L1-governance 06 flow / Step 1 框架但未复制领域事实 | pass |
| 是否识别旧正式 06 污染 | pass |
| 是否未修改正式 `06-验收标准.md` | pass |
| 是否形成 R1.2 写入边界 | pass |

next_allowed_action: 等待用户确认后进入 Step 1 `R1.2 input boundary:再写入`;只允许写入 Step 1 的 SOP 问题回答、当前文档诊断、取舍、结构化中间产物、回填草稿、待确认事项和进入 Step 2 条件,并推进 flow / project ledger;不得修改正式 `06-验收标准.md`、`07-实施计划.md`、CI YAML、脚本实现、真实执行结论、验收 verdict 或 implementation code。

---

## R1.2 input boundary:再写入

### 1. 当前模块目标

`R1.2` 根据用户确认,完成 Step 1 的正式中间产物:明确新版 `06-验收标准.md` 承接哪些上游输入、哪些证据方向支撑后续裁决、哪些基线必须后续固定、哪些内容不由验收标准回答,并留下未来正式 §1 的回填草稿。

当前模块不修改正式 `06-验收标准.md`,不进入 Step 2,不定义具体验收目标和范围,不固定真实 run_id,不填写真实执行结果,不裁决通过 / 有条件通过 / 不通过。

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm_to_R2.1 |
| 用户确认 | 已确认从 R1.1 推进到 R1.2。 |
| 当前允许 | 写入 Step 1 的问题回答、诊断、取舍、结构化产物、回填草稿和进入 Step 2 条件。 |
| 当前禁止 | 修改正式 `06`;进入 Step 2;写真实验收结论;写 `07`;写 CI / implementation。 |

### 2. 本步输入

| 输入 | 当前状态 | 本 Step 用途 |
|---|---|---|
| `projects/L3-method-library/00-需求文档.md` | full-restart completed | 提供核心能力闭环、FR-ML、BR-ML、NFR-ML、需求层验收表、一票否决和风险待确认项。 |
| `projects/L3-method-library/01-架构设计.md` | full-restart completed | 提供 truth owner、Definition vs Use、依赖方向、数据所有权、跨仓协作和架构红线。 |
| `projects/L3-method-library/02-概要设计.md` | full-restart completed | 提供八个组成部分、对象轮廓、接口骨架、处理流、状态和异常轮廓。 |
| `projects/L3-method-library/03-详细设计.md` | full-restart completed | 提供对象、port、protocol、flow、state、transaction、idempotency、error、observability 和 test cut。 |
| `projects/L3-method-library/04-配置设计.md` | full-restart completed | 提供 profile、config source、validation、secret/redaction、adapter availability、failure/degradation 和 handoff。 |
| `projects/L3-method-library/05-测试方案.md` | full-restart completed | 提供 `TC-ML-*`、`EV-ML-*`、suite / gate、artifact/report path、redaction、dependency、report audit 和 residual。 |
| `projects/L3-method-library/06-验收标准.md` | historical material | 旧 `MethodContent` / publish / snapshot / outbox / PostgreSQL / gateway / P95 口径,只作污染诊断。 |
| `projects/L3-method-library/07-实施计划.md` | old direction input | 不作为验收基线、实施边界或 required check 来源。 |
| `standards/document/验收标准讨论流程_SOP.md` | 标准输入 | 提供 Step 1~15 生成顺序、验收项裁决小循环和恢复纪律。 |
| `standards/document/验收标准书写规范.md` | 标准输入 | 提供正式 `06` 15 章结构、三值结论、AC 编号和证据引用规则。 |
| `standards/document/设计文档讨论中间产物规范.md` | 标准输入 | 提供三层台账、先思考后写入、正式章节校准来源和分批写入规则。 |
| `standards/document/设计真相源闭环与可落码性标准.md` | 标准输入 | 约束验收不得引用不可落码设计、静态伪证据或私补 artifact schema。 |
| `projects/L1-governance/design-calibration/06_acceptance_*` | framework_reference | 只参考验收中间产物粒度、表格结构和门禁表达深度。 |

### 3. SOP 问题回答

| SOP 问题 | 回答 |
|---|---|
| 本轮验收依据哪些需求和设计? | 依据当前 full-restart 后的正式 `00`~`04`,并以正式 `05-测试方案.md` 作为测试证据和门禁输入。需求裁决入口是方法资产统一定义与识别、正式化与版本稳定、受控消费、分发、追溯、消费一致性保护、证据线索承接和外围增强不阻塞核心闭环。设计裁决入口是 truth owner、Definition vs Use、对象 / protocol / flow / state / transaction / config / observability 等正式契约。 |
| 哪些测试证据会支撑验收裁决? | 由 `05-测试方案.md` 定义的 `EV-ML-*` 证据族、`TC-ML-*` 用例族、blocking suite family、`artifacts/test/<run_id>/...` raw artifact、`reports/runs/<run_id>/...` suite/report 和 `reports/acceptance/...` 交接材料支撑。当前只确认证据方向,不填写真实 run_id 或 pass/fail。 |
| 哪些交付版本、环境和数据会成为基线? | 后续 Step 3 必须固定需求 / 架构 / 概要 / 详细 / 配置 / 测试方案版本或 design baseline、implementation commit/source refs、P0 profile、config digest、fixture/seed baseline、run_id、artifact root、report root 和 acceptance handoff。当前 Step 不填假值。 |
| 哪些内容属于测试方案或实施计划,不应写进验收标准? | 测试用例全集、fixture builder、测试脚本、CI YAML、具体命令、commit boundary、任务排期、implementation ledger、部署 runbook、真实产品选型、生产运维步骤不进入验收标准正文。`06` 只写裁决条件、失败条件、证据引用、VETO、风险接受和签署口径。 |
| 是否存在阻塞验收标准生成的上游缺口? | 不阻塞 Step 1~2。真实送验版本、run_id、报告生成结果、acceptance handoff、veto checklist、risk acceptance 文件属于 Step 3 / Step 10 / Step 13 / Step 14 的待固定项,不得在设计阶段伪造。若后续发现 evidence schema、artifact schema 或 report schema 不足,必须回写拥有真相源的 `05` 或相关 standards。 |

### 4. 当前文档问题诊断

| 位置 | 当前问题 | 本 Step 处理 |
|---|---|---|
| 旧 `06-验收标准.md` 标题和目标 | 仍写“P0 方法定义发布同步闭环”,并围绕 7 类 `MethodContent`。 | 标记为旧方向材料;不得作为新版验收主语。 |
| 旧 §2 / §5 | 使用 `publish`、`fingerprint`、`snapshot`、`outbox`、旧生命周期和旧 AC-P0 项。 | 后续 Step 15 整体替换,当前只作污染诊断。 |
| 旧 §3 / §4 | 使用 PostgreSQL、object storage stub、fake bus、staging-like 等产品化环境作为基线。 | 新版只承接 `05` 的 product-neutral profile / controlled seam;真实环境后续 Step 3 固定。 |
| 旧 §7 / §8 | 使用旧 event / snapshot / outbox / MethodContent lifecycle 作为同步和状态裁决主线。 | 新版验收应按当前 `03` / `05` 的 method asset、formalization、consumption、traceability、job/report 和 boundary 口径重建。 |
| 旧 §9 | 写入 P95 / SLO 硬阈值。 | 当前 `05` 只允许 sample/trend;硬阈值必须在 Step 9 重新裁决。 |
| 旧 §10~§14 | 使用 EV-001、TC-CMD、GATE-T 等旧证据和旧编号。 | 新版必须使用 `TC-ML-*`、`EV-ML-*`、suite family 和 fixed report path。 |
| 当前 `05` | 已定义证据族和路径,但没有真实执行结果。 | Step 3 固定 run_id;Step 10 审计 evidence integrity;当前不伪造。 |

### 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 验收输入 | 旧 `06` 直接继承旧 MethodContent / publish / snapshot / outbox 主线。 | 新版 `06` 输入固定为当前 `00`~`05`。 | 防止旧主线反向污染验收。 |
| 证据引用 | 旧 EV-001、GATE-T、旧 report / artifact 方向。 | 当前 `EV-ML-*`、`TC-ML-*`、`artifacts/test/<run_id>`、`reports/runs/<run_id>`、`reports/acceptance/*`。 | 保持测试到验收闭环一致。 |
| 基线口径 | 泛化版本、环境和产品组件。 | 后续 Step 3 固定 source refs、run_id、profile、config digest 和 evidence root。 | 防止使用 `latest` 或未绑定基线。 |
| 文档生成 | 旧正式文档上局部修补。 | Step 1~14 先产出中间产物,Step 15 整体装配正式 `06`。 | 符合 SOP 和中间产物规范。 |

### 6. 验收裁决取舍

| 议题 | 取舍 | 理由 |
|---|---|---|
| 是否在 Step 1 直接重写正式 `06` | 不重写。 | 正式 `06` 只能在 Step 15 从 Step 1~14 装配。 |
| 是否沿用旧 `06` 的 AC / EV / threshold | 不沿用。 | 旧编号和旧主线已与当前 `05` 冲突。 |
| 是否在 Step 1 固定真实 `run_id` | 不固定。 | 当前没有执行结果,伪造 run_id 会破坏证据完整性。 |
| 是否把 `05` 的用例全集搬进 `06` | 不搬运。 | `06` 是裁决文档,只引用 TC / EV / report path。 |
| 是否把 P1/P2 selected-run 作为 P0 pass 前置 | 不作为 P0 前置。 | 当前 `05` 已明确 P1/P2 进入 residual 或后续扩展。 |

### 7. 结构化中间产物

#### 7.1 验收输入映射表

| 来源文档 | 验收输入 | 本文如何裁决 |
|---|---|---|
| `00-需求文档.md` | FR-ML、BR-ML、NFR-ML、需求层验收标准、一票否决项、风险与待确认事项。 | 转成 P0 功能门禁、边界红线、VETO、风险接受和最终裁决口径。 |
| `01-架构设计.md` | truth owner、Definition vs Use、依赖方向、数据所有权、跨仓边界和一致性分层。 | 转成数据边界、架构红线、接口 / 跨仓同步和 dependency VETO。 |
| `02-概要设计.md` | 八个组成部分、对象轮廓、接口骨架、处理流、状态和异常。 | 转成功能验收分组、范围边界、状态 / 一致性验收主题。 |
| `03-详细设计.md` | 对象契约、port、DTO、flow、state matrix、transaction、idempotency、error、observability。 | 作为 AC 的设计契约来源,用于判定通过条件和失败条件。 |
| `04-配置设计.md` | profile、config validation、adapter binding、secret/redaction、unavailable/degraded。 | 转成配置、依赖、redaction、环境和降级验收门禁。 |
| `05-测试方案.md` | `TC-ML-*`、`EV-ML-*`、suite family、artifact/report path、residual、不可风险接受项。 | 作为验收证据来源和验收结论复核入口。 |

#### 7.2 验收标准必须回答的问题

| 问题 | 后续 Step |
|---|---|
| 本轮裁决哪些 P0 / P1 / P2 范围? | Step 2 |
| 验收基线如何固定到需求、设计、配置、测试、送验版本、环境、数据和证据? | Step 3 |
| 什么时候可以开始验收、什么时候可以退出验收? | Step 4 |
| P0 功能能力如何判定通过和失败? | Step 5 |
| 哪些数据边界、架构红线和跨仓依赖不得破坏? | Step 6~7 |
| 状态机、事务、幂等、重复回放、恢复和一致性如何裁决? | Step 8 |
| 性能 sample/trend、安全、可用性、redaction、dependency 和证据真实性如何裁决? | Step 9~10 |
| 哪些问题触发一票否决? | Step 11 |
| 缺陷、复验、放行和风险接受如何影响结论? | Step 12~13 |
| 最终通过 / 有条件通过 / 不通过如何签署? | Step 14 |

#### 7.3 验收标准不再回答的问题

| 不回答的问题 | 归属 |
|---|---|
| 新增或修改需求目标、用户故事、FR / BR / NFR。 | `00-需求文档.md` |
| 新增架构边界、依赖方向或数据所有权。 | `01-架构设计.md` |
| 新增组成部分、对象轮廓、接口骨架或处理流。 | `02-概要设计.md` |
| 新增字段、DTO、port、repository、state、flow、error、marker source。 | `03-详细设计.md` |
| 新增配置项、profile、env key、adapter binding、secret source。 | `04-配置设计.md` |
| 设计测试用例、fixture、suite、artifact/report schema 或 report script。 | `05-测试方案.md` / 测试实现 |
| 拆分 commit boundary、安排开发任务、定义 implementation ledger。 | `07-实施计划.md` |
| 生产部署、运维告警、容量 runbook、长期归档策略细节。 | 部署与运维文档 / 后续运维标准 |

#### 7.4 后续基线待固定项

| 待固定项 | 后续 Step | 当前处理 |
|---|---|---|
| design baseline / source refs | Step 3 | 只列为必须基线,不填假值。 |
| implementation commit / build / package | Step 3 | 由送验说明或实施交付提供。 |
| P0 runtime profile / config digest | Step 3 | 必须来自 `04` 和测试证据。 |
| fixture / seed / test data baseline | Step 3 | 必须可追溯到 `05` 的测试数据方向。 |
| `run_id` | Step 3 | 必须固定到 `artifacts/test/<run_id>` 和 `reports/runs/<run_id>`。 |
| `reports/acceptance/handoff.md` | Step 3 / Step 10 | 未生成时记录为送验前置缺口。 |
| `reports/acceptance/veto-checklist.md` | Step 10 / Step 11 | 必须由真实证据推导,不得静态 passed。 |
| `reports/acceptance/risk-acceptance.md` | Step 13 / Step 14 | 有条件通过时必须引用。 |

### 8. 回填草稿

> 校准来源:
> - `design-calibration/06_acceptance_step_01_input_boundary.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“SOP 问题回答”“当前文档问题诊断”“验收输入映射表”“验收标准必须回答的问题”和“后续基线待固定项”小节,了解验收输入边界如何从讨论收敛而来。

正式 `06-验收标准.md` §1 应回填:

- 新版验收标准承接 `00-需求文档.md`、`01-架构设计.md`、`02-概要设计.md`、`03-详细设计.md`、`04-配置设计.md` 和 `05-测试方案.md`。
- 旧 `06-验收标准.md` 只作为 historical material / old direction input,不得继承旧 `MethodContent`、publish、snapshot、fingerprint、outbox、PostgreSQL、gateway、P95 等口径。
- 验收标准回答“什么条件下通过 / 有条件通过 / 不通过”,不重新定义需求、设计、测试用例、配置、实施计划或部署运维。
- 后续每个 P0 AC 必须能回指正式设计契约、`TC-ML-*`、`EV-ML-*`、fixed report path 和必要 raw artifact。
- 真实送验版本、run_id、config digest、evidence index 和 `reports/acceptance/*` 必须在 Step 3 及后续 Step 固定,不得在设计阶段伪造。

### 9. 待确认事项

| 待确认事项 | 影响 | 当前处理 |
|---|---|---|
| Step 15 是否删除并整体重建旧正式 `06-验收标准.md` | 影响正式文档装配方式。 | 建议整体替换,避免旧主线残留。 |
| 真实送验版本、implementation commit 和 run_id | 影响 Step 3 基线和最终裁决。 | 当前不填;后续由送验 / 测试执行提供。 |
| `reports/acceptance/*` 是否由实现仓生成初稿 | 影响 Step 10 / 13 / 14。 | 当前只固定入口和禁止静态通过。 |
| 是否需要把性能 sample/trend 硬化为阈值 | 影响 Step 9。 | 当前不继承旧 P95;后续按正式基线裁决。 |

### 10. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| 验收输入和边界清楚 | pass | `00`~`05` 和 standards 输入已映射。 |
| 旧正式 `06` 继承策略明确 | pass | 旧 `06` 只作污染诊断,不作为当前验收真相源。 |
| 不应由验收标准回答的问题已排除 | pass | 见 §7.3。 |
| 后续基线待固定项已列出 | pass | 见 §7.4。 |
| 未修改正式 `06-验收标准.md` | pass | 正式文档仍待 Step 15 装配。 |

next_allowed_action: Step 1 completed;等待用户确认后进入 Step 2 `R2.1 scope:先思考`;不得直接修改正式 `06-验收标准.md`、`07-实施计划.md`、CI YAML、脚本实现、真实执行结论、验收 verdict 或 implementation code。
