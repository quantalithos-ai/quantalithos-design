# Step 6. 定义数据边界与架构红线验收

> 对应 SOP: `standards/document/验收标准讨论流程_SOP.md` Step 6
> 回填章节: `06-验收标准.md` §6 数据边界与架构红线验收
> 创建日期: 2026-06-28
> 当前模式: full-restart / step6-data-arch-redlines
> 当前状态: completed_wait_user_confirm_to_R7.1
> 当前模块: `R6.2 data arch redlines:再写入`
> 当前门禁: `R6.2` completed_wait_user_confirm_to_R7.1;等待确认进入 Step 7 `R7.1 interfaces events sync:先思考`

---

## R6.1 data arch redlines:先思考

### 1. 当前模块目标

`R6.1` 只思考新版 `06-验收标准.md` 的数据边界与架构红线如何从 `00-需求文档.md` 的 BR-ML / 数据归属 / 一票否决项、`01-架构设计.md` 的 Definition vs Use / 数据所有权 / 依赖裁剪、`03-详细设计.md` 的 body-free / query no-write / job no truth repair 和 `05-测试方案.md` 的 `TC-ML-*` / `EV-ML-*` 证据族收敛。

当前模块不修改正式 `06-验收标准.md`,不写最终红线验收表,不裁决 Step 11 VETO,不进入 Step 7。

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm_to_R6.2 |
| 用户确认 | 已确认从 Step 5 completed 推进到 Step 6 `R6.1 data arch redlines:先思考`。 |
| 当前允许 | 思考数据不得保存清单、下游不得反写、projection/cache/job/report 不得反写、P1/P2 防污染、红线失败裁决影响和 R6.2 写入边界。 |
| 当前禁止 | 修改正式 `06`;写 Step 7 接口 / 事件 / 同步门禁;写真实测试结论;提前裁决一票否决。 |

### 2. 本模块输入承接

| 输入 | R6.1 关注点 | 禁止外推 |
|---|---|---|
| Step 2 范围表 | P0 core、P1 selected-run、P2 future 和只验接缝口径。 | 把 P1/P2 selected-run 写成 P0 红线通过证据。 |
| Step 5 功能门禁 | `ML-FG-*` 的功能失败条件已引用 truth owner、body-free、query/job no-write 和 evidence integrity。 | 将功能验收项重复写成红线正文,或把 Step 6 变成 Step 5 的复制。 |
| `00-需求文档.md` §10 | BR-ML-001~022、BR-ML-E-001。 | 新增业务规则或改变 BR 编号。 |
| `00-需求文档.md` §11 | 真相数据、快照数据、引用数据、禁止保存正文。 | 把摘要 / 引用升格为 truth,或把禁止正文改成可保存字段。 |
| `00-需求文档.md` §14.1 / §14.2 | 规则 / 边界验收、数据归属验收、一票否决项。 | 在 Step 6 直接替代 Step 11 VETO 裁决。 |
| `01-架构设计.md` §3 / §8 / §9 / §12 | Definition vs Use、依赖裁剪、数据所有权、一致性策略、备选方案排除。 | 将运行期 / 事件协作依赖写成源码级拥有关系。 |
| `02-概要设计.md` §3 / §5~§7 | 主要组成部分边界、对象分层、接口骨架和禁止旧主线。 | 恢复旧 `MethodContent`、publish、snapshot、fingerprint、outbox。 |
| `03-详细设计.md` §3.5 / §10 / §15 | body-free、外部正文禁止、logical store family、query no-write、job no truth repair、source-missing stop。 | 补 port、schema、mapper、state 或 artifact schema。 |
| `05-测试方案.md` §5 / §6 / §13 | boundary / dependency / redaction / observability / report evidence。 | 使用旧 EV / TC 或把 `EV-ML-RISK-001` 当 P0 pass。 |
| L1-governance Step 6 | framework_reference | 参考“红线表 + 闭环矩阵 + 不得保存清单 + P1/P2 防污染 + 停审 + 跨红线审计”的粒度。 | 复制 governance 领域对象、AC-GOV、RL-GOV 或 EV-GOV 编号。 |

### 3. SOP Step 6 问题思考

| SOP 问题 | R6.1 初判 | R6.2 写入提醒 |
|---|---|---|
| 哪些数据不得由本仓保存? | 流程执行实例、项目裁剪运行状态、成员身份 / 生命周期、成员能力绑定、治理裁决执行、外部能力注册、marketplace 交易 / 安装、UI 会话 / 渲染、artifact / evidence / archive 正文、认证鉴权实现正文不得保存为本仓 truth 或正文。 | 写成“不得保存清单”,并区分可允许的 ref / summary / marker / digest / safe reason。 |
| 哪些下游不得反向改写真相? | process、identity、runtime、member-images、governance、capability-hub、marketplace、console / SDK、artifact、observability 均不得创建、修改或替代方法资产定义 truth。 | 写成下游 / 相邻仓反写红线,证据回指 `TC-ML-BOUNDARY-*`、`TC-ML-DEPENDENCY-*`。 |
| 哪些 projection / cache 不得反写真相? | catalog view、read material、trace material、impact summary、report、dashboard、runtime cache、policy cache、operations job report 和 maintenance progress 只能派生、观察或承接摘要,不得成为第二 truth。 | 写成 projection/cache/report/job no truth source 红线。 |
| 哪些 P1 能力不得污染 P0? | durable / real-like adapter、真实外部服务、staging-like / production-like、MethodPlugin、MethodConfiguration、marketplace、advanced dashboard、capacity、标准映射深化都不得作为 P0 红线通过前置。 | 写入 P1/P2 防污染表;`EV-ML-RISK-001` 只作 residual。 |
| 红线失败时是否一票否决? | BR-ML / 数据归属 / body-free / no private fallback / dependency boundary / evidence integrity 类红线失败会成为 Step 11 VETO 候选;Step 6 只记录裁决影响。 | R6.2 写“失败则阻断通过;是否一票否决由 Step 11 正式裁决”。 |

### 4. 数据边界分层候选

| 分层 | 候选内容 | R6.1 判断 |
|---|---|---|
| 正式真相数据 | 方法资产定义语义、身份目录、正式化版本、定义性关系、受控消费前提、追溯依据、分发语义、证据线索。 | P0 红线核心。本仓必须拥有这些 truth,且不得由消费仓替代。 |
| 读取 / 投影 / 材料 | catalog view、consumption material、trace material、read material、availability view、maintenance progress。 | 可由本仓派生和维护,但不得反写真相或成为第二 truth。 |
| 摘要数据 | 治理正式化结论摘要、外部标准来源摘要、下游消费影响回报摘要。 | 只可作为 summary / marker / digest / safe reason,不得迁入外部执行 truth。 |
| 引用数据 | 治理依据引用、标准 / ADR 来源引用、外部正文引用、artifact / archive 引用、marketplace 生态对象引用。 | 只保存引用关系,不保存正文或外部生命周期。 |
| 禁止保存正文 | process、identity、governance、capability、marketplace、UI、artifact/archive、authn/authz 等正文。 | 必须写入红线清单;失败应阻断通过。 |
| 外围增强 truth | MethodPlugin、MethodConfiguration、标准映射材料等若进入范围的外围组织语义。 | 只作为外围增强,不得成为核心闭环前置。 |

### 5. 架构红线候选思考

| 候选红线 | 来源 | R6.1 判断 |
|---|---|---|
| 方法资产定义 truth 独立归属 | BR-ML-001~004;架构 ADR-ML-ARCH-001/002 | P0。若本仓 truth 不能明确归属,Step 11 应纳入 VETO 候选。 |
| Definition vs Use 持续分离 | BR-ML-003;架构 §3 / §9 | P0。消费仓只能使用、执行、索引或展示,不得拥有定义 truth。 |
| 下游不得创建 / 修改 / 替代定义 truth | BR-ML-005;NFR-ML-008 | P0。必须可通过 boundary / dependency / service evidence 检查。 |
| 未正式化资产不得正式消费 | BR-ML-007;功能门禁 ML-FG-002/007 | P0。与 Step 5 功能失败条件相连,红线层加严为边界失败。 |
| 外部正文和运行 truth 禁止入仓 | BR-ML-006 / 012~018;`03` §3.5 | P0。必须结合 redaction / report audit evidence。 |
| 运行期 / 事件协作不得源码级拥有 | BR-ML-008;架构 §8 | P0。依赖类型和 compile dependency scan 需要证据。 |
| 正式版本和消费影响必须显式变化 | BR-ML-009~011 | P0。与状态 / 幂等在 Step 8 继续加严。 |
| 治理结论只作摘要 / 引用 | BR-ML-019;架构 §9 | P0。不得迁入治理裁决执行。 |
| 追溯 / 审计 / 证据线索不得只存在人工说明 | BR-ML-020~022 | P0。证据线索要接到 `EV-ML-REPORT-001` 和 Step 10。 |
| projection / query / job / report 不反写 | `03` §10 / §15;`05` suite cuts | P0。Query no-write、job no truth repair、report not truth source 应独立成红线。 |
| 配置不得改变 truth owner / schema / body-free / 依赖类型 | `03` §13;`05` config-redline | P0。Step 9/11 可继续加严。 |
| source missing 不得 private fallback | `03` §15.7;可落码性标准 | P0。缺 marker / mapper / port / schema 必须暂停,不得由 fake/private map 补口。 |

### 6. 证据映射候选思考

| 红线轴 | TC 候选 | EV 候选 | report path 候选 |
|---|---|---|---|
| truth owner / Definition vs Use | `TC-ML-TRUTH-*`;`TC-ML-BOUNDARY-*`;`TC-ML-POLLUTION-*`;`TC-ML-SHELL-*` | `EV-ML-CONTRACT-001`;`EV-ML-SERVICE-001` | `reports/runs/<run_id>/suites/contract-domain-fast.md`;`service-flow-fast.md` |
| 下游 / 依赖边界 | `TC-ML-DEPENDENCY-*`;`TC-ML-CONSUMPTION-*`;`TC-ML-DISTRIBUTION-*`;`TC-ML-HANDOFF-*` | `EV-ML-DEPENDENCY-001`;`EV-ML-SERVICE-001`;`EV-ML-ENTRY-001` | `dependency-boundary.md`;`service-flow-fast.md`;`entry-worker-job.md` |
| external body-free / redaction | `TC-ML-REDACTION-*`;`TC-ML-DIAGNOSTIC-*`;`TC-ML-SHELL-*`;`TC-ML-MARKER-*` | `EV-ML-REDACTION-001`;`EV-ML-REPORT-001` | `redaction-check.md`;`report-generation-audit.md` |
| query / projection / job no truth repair | `TC-ML-QUERY-*`;`TC-ML-JOB-*`;`TC-ML-REPLAY-*`;`TC-ML-UOW-*`;`TC-ML-RECOVERY-*` | `EV-ML-SERVICE-001`;`EV-ML-REPLAY-001`;`EV-ML-ENTRY-001` | `service-flow-fast.md`;`operations-replay-core.md`;`entry-worker-job.md` |
| config / source-missing / private fallback | `TC-ML-CONFIG-*`;`TC-ML-MARKER-*`;`TC-ML-DEPENDENCY-*` | `EV-ML-CONFIG-001`;`EV-ML-INFRA-001`;`EV-ML-DEPENDENCY-001` | `config-redline.md`;`infra-runtime-fake.md`;`dependency-boundary.md` |
| evidence / observability not truth | `TC-ML-EVIDENCE-*`;`TC-ML-REPORT-*`;`TC-ML-OBSERVABILITY-*`;`TC-ML-METRIC-*`;`TC-ML-AUDIT-*` | `EV-ML-REPORT-001`;`EV-ML-OBSERVABILITY-001` | `report-generation-audit.md`;`observability-boundary.md` |

### 7. P1 / P2 防污染思考

| 能力 / 材料 | R6.1 判断 | R6.2 写入提醒 |
|---|---|---|
| durable / real-like adapter | P1 selected-run。 | 不替代 fake / controlled seam 的 P0 红线证据。 |
| staging-like / production-like profile | P1/P2。 | 不因未运行而判 P0 失败,也不因运行过而跳过 P0 红线。 |
| MethodPlugin / MethodConfiguration | 外围增强。 | 不作为核心 truth、受控消费或分发红线通过前置。 |
| marketplace 生态发现 / 交易 / 安装 | 外围或边界外。 | marketplace 交易与履约正文禁止入仓。 |
| advanced dashboard / console / SDK | 外围入口。 | UI / SDK 不决定核心语义或验收通过。 |
| 标准映射深化 / artifact 核心消费 | 候选或外围。 | 标准 / artifact 正文禁止入仓;核心范围扩展必须回写前序文档。 |

### 8. 旧正式 06 污染思考

| 旧口径 | R6.1 判断 | R6.2 处理 |
|---|---|---|
| 旧 `MethodContent` / publish / snapshot / fingerprint | 与当前 truth owner / formal version 口径不一致。 | 不进入新版数据红线。 |
| 旧 outbox / delivery / PostgreSQL / gateway | 属于旧机制或实现绑定。 | 不作为红线证据或依赖边界。 |
| 旧 API / DB evidence | 与 `EV-ML-*` 不一致。 | 禁止作为证据来源。 |
| 旧 P95 / SLO | 属于非功能且无当前硬阈值。 | Step 9 处理。 |

### 9. R6.2 写入策略思考

R6.2 应写入 Step 6 的完整中间产物,但仍不修改正式 `06-验收标准.md`。

| 写入范围 | 目的 |
|---|---|
| 架构红线验收表 | 固定 `ML-RL-*` 红线、通过条件、失败条件和证据来源。 |
| 数据边界闭环矩阵 | 将规则 / 数据归属 / 设计章节 / TC / EV / report path / 裁决影响连接起来。 |
| 不得由本仓保存的数据清单 | 明确禁止正文和允许的最小 ref / summary / marker 形态。 |
| projection / cache / job / report no-truth-source 清单 | 防止读模型、维护任务、报告或观测材料反写真相。 |
| P1/P2 防污染表 | 防止 selected-run、外围增强和真实环境替代 P0 红线证据。 |
| 红线停审与跨红线审计 | 检查是否缺红线、证据路径断裂、VETO 提前裁决或下游完整实现误要求。 |
| 回填草稿 | 提供未来 `06` §6 草稿,不写正式文档。 |

### 10. R6.2 写入边界思考

`R6.2 data arch redlines:再写入` 可以写入:

1. `06_acceptance_step_06_data_arch_redlines.md` 的 SOP 问题回答、红线验收表、闭环矩阵、不得保存清单、P1/P2 防污染、停审记录、跨红线审计、回填草稿和进入 Step 7 条件。
2. `06_acceptance_calibration_flow.md` 推进到 Step 6 completed_wait_user_confirm_to_R7.1。
3. `project_execution_ledger.md` 推进到 `06` Step 6 completed_wait_user_confirm_to_R7.1。

`R6.2` 禁止写入:

1. 正式 `06-验收标准.md` 正文。
2. Step 7 接口 / 事件 / 跨仓同步正式门禁。
3. Step 8 状态机、事务、幂等和一致性正式门禁。
4. Step 11 一票否决最终裁决。
5. 新测试用例、evidence schema、artifact schema、report schema、CI YAML 或 implementation boundary。

### 11. R6.1 stop-review

| 检查项 | 结果 |
|---|---|
| 是否按项目台账和 06 flow 恢复 | pass |
| 是否只推进 Step 6 R6.1 | pass |
| 是否承接 Step 5 功能门禁 | pass |
| 是否读取 Step 6 SOP 和 L1-governance 框架 | pass |
| 是否承接 `00` BR / 数据归属 / VETO、`01` 架构、`03` body-free / no-write / no-repair、`05` EV | pass |
| 是否识别数据分层、红线候选和证据映射候选 | pass |
| 是否明确 P1/P2 不污染 P0 红线 | pass |
| 是否未填写真实测试 / 缺陷 / verdict 结论 | pass |
| 是否未修改正式 `06-验收标准.md` | pass |
| 是否形成 R6.2 写入边界 | pass |

next_allowed_action: 等待用户确认后进入 Step 6 `R6.2 data arch redlines:再写入`;只允许写入 Step 6 的 SOP 问题回答、架构红线验收表、数据边界闭环矩阵、不得保存清单、projection/cache/job/report no-truth-source 清单、P1/P2 防污染、停审记录、跨红线审计、回填草稿、待确认事项和进入 Step 7 条件,并推进 flow / project ledger;不得修改正式 `06-验收标准.md`、`07-实施计划.md`、CI YAML、脚本实现、真实执行结论、验收 verdict 或 implementation code。

---

## R6.2 data arch redlines:再写入

### 12. R6.2 模块状态

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm_to_R7.1 |
| 用户确认 | 已确认从 Step 6 `R6.1 data arch redlines:先思考` 推进到 `R6.2 data arch redlines:再写入`。 |
| 当前写入 | SOP 问题回答、架构红线验收表、数据边界闭环矩阵、不得保存清单、no-truth-source 清单、P1/P2 防污染、停审记录、跨红线审计、回填草稿、待确认事项和进入 Step 7 条件。 |
| 当前禁止 | 修改正式 `06`;写 Step 7 接口门禁;裁决 Step 11 VETO;写真实测试执行结论;补 TC / EV / artifact schema。 |

### 13. SOP 问题回答

| SOP 问题 | R6.2 回答 |
|---|---|
| 哪些数据不得由本仓保存? | 本仓不得保存流程执行实例、项目裁剪运行状态、成员身份 / 生命周期、成员能力绑定、治理裁决执行、外部能力注册、marketplace 交易 / 安装、UI 会话 / 渲染、artifact / evidence / archive 正文、认证鉴权实现正文。允许的最小形态只能是 typed ref、safe summary、marker、digest、safe reason 或正式摘要。 |
| 哪些下游不得反向改写真相? | process、identity、runtime、member-images、governance、capability-hub、marketplace、console / SDK、artifact、observability 均不得创建、修改或替代方法资产定义 truth。 |
| 哪些 projection / cache 不得反写真相? | catalog view、read material、trace material、impact summary、availability view、runtime cache、policy cache、dashboard、report、maintenance progress 和 job report 均不得成为 truth source。 |
| 哪些 P1 能力不得污染 P0? | durable / real-like adapter、真实外部服务、staging-like / production-like、MethodPlugin、MethodConfiguration、marketplace、advanced dashboard、capacity、标准映射深化和 artifact 核心消费均不得作为 P0 红线通过前置。 |
| 红线失败时是否一票否决? | Step 6 只记录裁决影响:任一 `ML-RL-*` 失败均阻断“通过”;是否成为一票否决由 Step 11 正式裁决。 |

### 14. 当前文档问题诊断

| 位置 | 当前问题 | 本 Step 处理 |
|---|---|---|
| 旧正式 `06-验收标准.md` | 仍含旧 `MethodContent`、publish、snapshot、outbox、PostgreSQL、gateway、P95 等历史口径。 | 全部作为污染诊断,不得进入新版红线。 |
| `00-需求文档.md` §14 | 数据归属和一票否决是方向性口径,尚未转成 run-scoped 门禁。 | 本 Step 转成 `ML-RL-*` 红线和证据路径方向。 |
| `01-架构设计.md` §8 / §9 | 依赖裁剪和数据所有权分散在架构叙述中。 | 本 Step 固定 dependency boundary、truth owner 和摘要 / 引用边界验收。 |
| `03-详细设计.md` §10 / §15 | query no-write、job no truth repair、stored replay、source-missing stop 属于实现红线。 | 本 Step 抽取为验收红线,细节仍由 Step 8 / Step 10 加严。 |
| `05-测试方案.md` §13 | 已有 `EV-ML-*`,但验收红线尚未引用。 | 本 Step 只引用正式 `EV-ML-*`,不新增 evidence schema。 |

### 15. 验收裁决取舍

| 议题 | 方案 | 取舍 |
|---|---|---|
| 红线 ID 是否使用 `AC-ML-*` | A. 新增 AC;B. 使用 `ML-RL-*` 本地红线 ID | 采用 B。避免在 `06` 反向新增需求编号。 |
| 是否把所有红线直接写成 VETO | A. Step 6 直接裁决;B. Step 6 记录候选,Step 11 正式裁决 | 采用 B。保持 SOP 边界。 |
| 是否要求真实下游仓完整实现 | A. 要求;B. 只验接缝和边界 | 采用 B。P0 只验正式 ref / summary / adapter / event seam。 |
| 是否允许 report / job 修复 truth | A. 允许;B. 禁止 | 采用 B。维护面只能写派生材料、marker、checkpoint、report shell。 |

## 16. 结构化中间产物

### 16.1 架构红线验收表

| 红线 ID | 红线 | 通过条件 | 失败条件 | 证据来源 |
|---|---|---|---|---|
| ML-RL-001 | 方法资产定义 truth 独立归属 | 方法资产定义、身份目录、正式化版本、定义性关系、受控消费前提、追溯依据、分发语义和证据线索均由本仓正式对象 / flow 承载。 | 任一核心方法资产 truth 由 process、identity、runtime、member-images、governance、marketplace、UI、artifact 或散落文档替代。 | `TC-ML-TRUTH-*`;`TC-ML-IDENTITY-*`;`TC-ML-CATALOG-*`;`EV-ML-CONTRACT-001` |
| ML-RL-002 | Definition vs Use 持续分离 | 下游只能按 ref、safe shell、consumption material、distribution / handoff 边界消费正式语义。 | 下游仓创建、修改、覆盖或私有化方法资产定义。 | `TC-ML-BOUNDARY-*`;`TC-ML-CONSUMPTION-*`;`EV-ML-SERVICE-001` |
| ML-RL-003 | 未正式化资产不得正式消费 | 正式消费只能引用 formal version / formalized material,未正式化或调整中资产被拒绝或返回安全不可用 / 降级面。 | 未正式化资产被正式下游消费,或读取 / 同步 / 使用隐式触发正式化。 | `TC-ML-FORMALIZATION-*`;`TC-ML-VERSION-*`;`TC-ML-CONSUMPTION-*`;`EV-ML-CONTRACT-001`;`EV-ML-SERVICE-001` |
| ML-RL-004 | 外部正文禁止入仓 | 外部标准、ADR、artifact、archive、evidence、API response、下游回报只以 ref / summary / marker / digest / safe reason 承接。 | 任一 truth、material、audit、report、handoff、observable output 保存外部正文、raw payload、provider body 或 evidence file content。 | `TC-ML-REDACTION-*`;`TC-ML-DIAGNOSTIC-*`;`EV-ML-REDACTION-001`;`EV-ML-REPORT-001` |
| ML-RL-005 | 相邻仓运行 truth 不得入仓 | process execution、member state、governance execution、capability binding、marketplace transaction、UI state、artifact lifecycle 不进入本仓 truth。 | 运行状态、交易、UI、artifact 生命周期或治理执行结果成为方法资产定义成立条件。 | `TC-ML-BOUNDARY-*`;`TC-ML-POLLUTION-*`;`EV-ML-CONTRACT-001`;`EV-ML-REDACTION-001` |
| ML-RL-006 | 运行期 / 事件协作不得写成源码级拥有 | 只有 `L0-core` 作为编译期基础依赖;运行期和事件协作通过正式 ref、adapter、event、handoff 或 fake seam。 | 下游业务仓源码级依赖本仓业务实现,或事件协作被写成编译期拥有关系。 | `TC-ML-DEPENDENCY-*`;`EV-ML-DEPENDENCY-001`;`reports/runs/<run_id>/suites/dependency-boundary.md` |
| ML-RL-007 | 正式版本语义和消费影响必须显式变化 | 正式化、版本语义变化和消费影响变化均由正式 command / state / trace / lineage 承接。 | 正式版本被静默覆盖,消费影响只存在实现细节或人工约定。 | `TC-ML-CHANGE-*`;`TC-ML-STATE-*`;`TC-ML-IMPACT-*`;`EV-ML-CONTRACT-001`;`EV-ML-REPLAY-001` |
| ML-RL-008 | projection / read material 不得反写真相 | catalog view、read material、trace material、consumption material、availability view 只可派生或复制正式 marker。 | projection / material / cache 修复、创建或覆盖 core truth。 | `TC-ML-QUERY-*`;`TC-ML-MARKER-*`;`EV-ML-SERVICE-001`;`EV-ML-INFRA-001` |
| ML-RL-009 | query / report / observability 不得成为 truth source | Query no-write;report、metric、trace、audit、diagnostic 只观察和追溯,不得替代 truth。 | query 写入 truth;report / dashboard / observability 后端成为恢复或定义来源。 | `TC-ML-QUERY-*`;`TC-ML-OBSERVABILITY-*`;`TC-ML-METRIC-*`;`EV-ML-SERVICE-001`;`EV-ML-OBSERVABILITY-001` |
| ML-RL-010 | job / replay / recovery 不得修 core truth | job 只写派生材料、progress、checkpoint、report shell;duplicate / replay 只读 stored surface。 | job 修复 core truth、从 current truth 重建 stored result、用 queue offset / lease 作为 checkpoint。 | `TC-ML-JOB-*`;`TC-ML-REPLAY-*`;`TC-ML-UOW-*`;`EV-ML-REPLAY-001`;`EV-ML-ENTRY-001` |
| ML-RL-011 | 配置不得改变 truth / schema / body-free / 依赖类型 | config 只影响 assembly、adapter、profile、job 参数和外部绑定。 | config 改变 truth owner、state owner、DTO schema、body-free 边界、replay 语义或依赖类型。 | `TC-ML-CONFIG-*`;`TC-ML-MARKER-*`;`EV-ML-CONFIG-001` |
| ML-RL-012 | source missing 不得 private fallback | 缺正式 source、marker、mapper、port、schema 时必须暂停回设计闭口。 | 使用 private map、raw string、route param、timestamp、HTTP/SQL code、test helper 合成正式 marker 或 ref。 | `TC-ML-MARKER-*`;`TC-ML-RECOVERY-*`;`TC-ML-DEPENDENCY-*`;`EV-ML-INFRA-001`;`EV-ML-DEPENDENCY-001` |

### 16.2 数据边界闭环矩阵

| 验收主题 | 覆盖规则 / 来源 | 对应红线 | 测试用例 | 证据 ID | report path | 裁决影响 |
|---|---|---|---|---|---|---|
| 方法资产定义真相归属清晰 | BR-ML-001~004;`01` §9;`03` §10 | ML-RL-001 / 002 | `TC-ML-TRUTH-*`;`TC-ML-BOUNDARY-*` | `EV-ML-CONTRACT-001`;`EV-ML-SERVICE-001` | `contract-domain-fast.md`;`service-flow-fast.md` | 失败阻断通过;VETO 候选。 |
| 禁止行为未发生 | BR-ML-005~008;NFR-ML-007~008 | ML-RL-002 / 003 / 004 / 005 / 006 | `TC-ML-CONSUMPTION-*`;`TC-ML-DEPENDENCY-*`;`TC-ML-REDACTION-*` | `EV-ML-SERVICE-001`;`EV-ML-DEPENDENCY-001`;`EV-ML-REDACTION-001` | `service-flow-fast.md`;`dependency-boundary.md`;`redaction-check.md` | 失败阻断通过;VETO 候选。 |
| 显式变化规则成立 | BR-ML-009~011 | ML-RL-003 / 007 | `TC-ML-FORMALIZATION-*`;`TC-ML-CHANGE-*`;`TC-ML-IMPACT-*` | `EV-ML-CONTRACT-001`;`EV-ML-REPLAY-001` | `contract-domain-fast.md`;`operations-replay-core.md` | 失败阻断通过。 |
| 相邻仓边界清晰 | BR-ML-012~018;`01` §8 | ML-RL-005 / 006 | `TC-ML-BOUNDARY-*`;`TC-ML-DEPENDENCY-*`;`TC-ML-POLLUTION-*` | `EV-ML-DEPENDENCY-001`;`EV-ML-CONTRACT-001` | `dependency-boundary.md`;`contract-domain-fast.md` | 失败阻断通过;VETO 候选。 |
| 治理、审计和证据边界清晰 | BR-ML-019~022 | ML-RL-004 / 007 / 009 | `TC-ML-TRACE-*`;`TC-ML-AUDIT-*`;`TC-ML-EVIDENCE-*`;`TC-ML-REPORT-*` | `EV-ML-REPORT-001`;`EV-ML-OBSERVABILITY-001` | `report-generation-audit.md`;`observability-boundary.md` | 失败阻断通过;Step 10 加严。 |
| 真相数据归属正确 | `00` §11;`01` §9.1 | ML-RL-001 | `TC-ML-TRUTH-*`;`TC-ML-IDENTITY-*`;`TC-ML-CATALOG-*` | `EV-ML-CONTRACT-001` | `contract-domain-fast.md` | 失败阻断通过。 |
| 快照与引用不形成第二真相源 | `00` §11;`01` §9.2 | ML-RL-008 / 009 / 010 | `TC-ML-QUERY-*`;`TC-ML-JOB-*`;`TC-ML-REPLAY-*` | `EV-ML-SERVICE-001`;`EV-ML-REPLAY-001` | `service-flow-fast.md`;`operations-replay-core.md` | 失败阻断通过。 |
| 禁止保存正文边界成立 | `00` §11;`03` §3.5 / §10.6 | ML-RL-004 / 005 | `TC-ML-REDACTION-*`;`TC-ML-SHELL-*`;`TC-ML-DIAGNOSTIC-*` | `EV-ML-REDACTION-001`;`EV-ML-REPORT-001` | `redaction-check.md`;`report-generation-audit.md` | 失败阻断通过;VETO 候选。 |

### 16.3 不得由本仓保存的数据清单

| 数据类别 | 禁止保存为本仓 truth / 正文 | 允许的最小形态 |
|---|---|---|
| Process | ProcessInstance、Activity、TaskUse、runtime orchestration、project tailoring runtime body。 | ProcessTemplateRef、TaskDefinitionRef、safe process summary、consumption context ref。 |
| Identity | GlobalMember、member lifecycle、member actual role state、qualification / capability binding body。 | ActorRef、MemberRef、RoleDefinitionRef、safe identity summary。 |
| Governance | Gate / policy execution process、policy enforce result、governance裁决正文。 | GovernanceConclusionRef、formalization basis summary、safe marker。 |
| Capability / Runtime | MCP / A2A / provider registry、tool binding、runtime execution、tool result/provider payload。 | CapabilityRef、RuntimeSignalRef、adapter availability marker。 |
| Marketplace / UI / Console | listing transaction、purchase、install、fulfillment、UI session、rendered component state。 | MarketplaceContextRef、console entry ref、safe presentation marker。 |
| Artifact / Archive / Evidence | artifact body、evidence file content、archive package、object storage body、retention policy body。 | ArtifactRef、ArchiveRef、EvidenceLineageRef、digest、safe evidence summary。 |
| External source | standard full text、ADR body、external document body、API response body。 | ExternalSourceRef、standard summary、ADR ref、safe reason。 |
| Authn / Authz / Observability | login、token、credential、permission system body、raw log、stack trace、metric high-cardinality payload。 | trusted actor metadata、safe diagnostic ref、trace context、low-cardinality metric labels。 |

### 16.4 projection / cache / job / report no-truth-source 清单

| 派生面 | 允许 | 禁止 |
|---|---|---|
| Query / read view | 读取 committed truth、projection、material、summary、report、resolver output。 | repair stale material、append audit、publish event、start job、store query replay。 |
| Projection / read material | 从正式 truth 派生并复制正式 marker。 | 反写 core truth 或成为第二定义来源。 |
| Runtime / policy cache | 表达 runtime-local availability 或缓存命中。 | 作为 business lifecycle truth 或 formalization basis。 |
| Operations job | 写 derived material、progress、checkpoint、report shell。 | 修 core truth、重做正式化、从 current truth 重建 stored replay。 |
| Report / dashboard | 汇总 raw artifact / stored report / safe fact。 | 替代 raw artifact、修改 truth、作为恢复来源。 |
| Observability | 记录 body-free refs、safe markers、low-cardinality family/kind/state/result。 | 保存正文、secret、高基数字段,或替代 truth。 |

### 16.5 P1 / P2 防污染规则

| P1/P2 能力 | P0 中允许的证明 | 禁止做法 |
|---|---|---|
| durable / real-like adapter | fake / controlled adapter / unavailable seam 加正式 marker。 | 用真实 adapter selected-run 替代 P0 红线证据。 |
| staging-like / production-like profile | residual 或 release 条件记录。 | 因未运行判 P0 失败,或因运行过跳过 P0 fake 证据。 |
| MethodPlugin / MethodConfiguration | 只证明不破坏核心 truth 边界。 | 作为核心定义、正式化、受控消费或分发前置。 |
| marketplace / package 生态 | 只用 marketplace context ref 或 residual。 | 保存交易 / 安装 / 履约正文,或让 marketplace 状态决定 truth。 |
| dashboard / console / SDK | 入口或展示候选。 | UI / SDK 决定核心语义、红线通过或验收结论。 |
| 标准映射 / artifact 核心消费 | 外部摘要 / 引用和 candidate residual。 | 保存标准全文、artifact body,或未经回写纳入核心下游。 |

### 16.6 红线停审记录

| 红线 / 验收项 | 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|---|
| ML-RL-001~003 | truth owner、Definition vs Use、formal consumption 均回指 BR-ML 和正式 `03/05` | pass | 状态细节由 Step 8 加严。 |
| ML-RL-004~006 | body-free、相邻仓边界、dependency boundary 均有证据入口 | pass | redaction / dependency 真实性由 Step 10 继续审计。 |
| ML-RL-007~010 | 显式变化、projection/query/job/report no truth source 已独立成红线 | pass | 事务、幂等和 replay 由 Step 8 加严。 |
| ML-RL-011~012 | config redline 和 source-missing stop 已有正式证据族 | pass | Step 11 决定是否纳入 VETO。 |
| P1/P2 防污染 | `EV-ML-RISK-001` 未作为 P0 pass 证据 | pass | residual 和风险接受由 Step 13 收口。 |

### 16.7 跨红线审计表

| 审计项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 是否存在数据不得保存清单缺口 | 未发现 | 见 §16.3。 |
| 是否存在下游可反写 truth 的口径 | 未发现 | ML-RL-002 / 005 / 006 已覆盖。 |
| 是否存在 projection / cache / report / job 成为 truth source | 未发现 | ML-RL-008~010 已覆盖。 |
| 是否存在 P1 污染 P0 | 未发现 | 见 §16.5。 |
| 是否提前替代 Step 11 VETO | 未提前 | 只记录 VETO 候选影响。 |
| 是否要求下游完整实现 | 未要求 | P0 只验 ref / summary / adapter / event / fake seam。 |

## 17. 回填草稿

> 校准来源:
> - `design-calibration/06_acceptance_step_06_data_arch_redlines.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“架构红线验收表”“数据边界闭环矩阵”“不得由本仓保存的数据清单”“projection / cache / job / report no-truth-source 清单”“P1 / P2 防污染规则”和“跨红线审计表”小节,了解数据边界与架构红线如何从 BR-ML、数据归属、架构设计、详细设计和 `EV-ML-*` 证据族收敛。

正式 `06-验收标准.md` §6 应回填:

- 数据边界与架构红线验收使用 `ML-RL-001~012`。
- `L3-method-library` 必须独立拥有方法资产定义、身份目录、正式化版本、定义性关系、受控消费前提、追溯依据、分发语义和证据线索 truth。
- 下游仓、运行期系统、事件协作方、projection、cache、report、observability 和 job 不得创建、修改或替代方法资产定义 truth。
- 外部正文、artifact/evidence/archive 正文、成员状态、治理执行、capability 注册、marketplace 交易、UI 会话和认证鉴权实现正文不得进入本仓 truth 或输出。
- P1/P2 selected-run、real-like adapter、production-like、dashboard、marketplace、MethodPlugin / MethodConfiguration 和标准映射深化不得替代 P0 红线证据。
- 任一 `ML-RL-*` 失败均阻断“通过”;是否成为一票否决由 Step 11 正式裁决。

## 18. 待确认事项

| 待确认事项 | 影响 | 当前处理 |
|---|---|---|
| Step 11 是否把全部 `ML-RL-*` 纳入 VETO | 影响最终一票否决表 | 当前只记录候选影响,Step 11 正式裁决。 |
| 是否需要为 dependency / boundary 拆更细 `EV-ML-*` | 影响 evidence index 粒度 | 当前使用 `EV-ML-DEPENDENCY-001`、`EV-ML-CONTRACT-001`、`EV-ML-SERVICE-001`。 |
| artifact 核心消费是否进入本轮 P0 | 影响数据边界和接口门禁 | 当前保持候选 / 外围,正文禁止入仓。 |

## 19. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| 数据边界和架构红线都有验收项 | pass | `ML-RL-001~012` 已覆盖。 |
| 哪些数据不得保存已明确 | pass | 见 §16.3。 |
| 下游 / projection / cache / job / report 不反写已明确 | pass | 见 §16.1 / §16.4。 |
| P1/P2 防污染已明确 | pass | 见 §16.5。 |
| 可进入 Step 7 | pass | 下一步定义接口、事件与跨仓同步验收;进入前等待用户确认。 |

## 20. R6.2 stop-review

| 检查项 | 结果 |
|---|---|
| 是否按项目台账和 06 flow 恢复 | pass |
| 是否只推进 Step 6 R6.2 | pass |
| 是否未修改正式 `06-验收标准.md` | pass |
| 是否覆盖 SOP Step 6 问题 | pass |
| 是否形成可回填红线验收表与闭环矩阵 | pass |
| 是否明确 P1/P2 不污染 P0 红线 | pass |
| 是否未新增需求、TC、EV、schema 或真实 verdict | pass |
| 是否可以等待用户确认进入 Step 7 R7.1 | pass |

next_allowed_action: 等待用户确认后进入 Step 7 `R7.1 interfaces events sync:先思考`;只允许思考接口、事件、跨仓同步、Command / Query / Consumer / Outbound / Job、依赖类型、下游未就绪接缝、TC / EV / report path 和 Step 7 写入边界;不得修改正式 `06-验收标准.md`、`07-实施计划.md`、CI YAML、脚本实现、真实执行结论、验收 verdict 或 implementation code。
