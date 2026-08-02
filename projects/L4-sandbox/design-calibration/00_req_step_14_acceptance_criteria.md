# L4-sandbox 00 需求 Step 14: 验收标准

> 创建日期: 2026-07-06
> 状态: done_wait_review
> 当前模式: full-restart
> 本轮口径: 用户已确认 Step 13,允许进入 Step 14;旧 L4-sandbox 正式文档、旧测试方案和旧验收材料只作 historical_material。
> 回填位置: `00-需求文档.md` 第 14 章“验收标准”
> 项目级台账: `design-calibration/project_execution_ledger.md`
> 文档级 flow: `design-calibration/00_requirements_calibration_flow.md`
> 上游 Step: `00_req_step_01_upstream_relation.md`;`00_req_step_02_position_boundary.md`;`00_req_step_03_problem_context.md`;`00_req_step_04_goals_non_goals.md`;`00_req_step_05_users_roles.md`;`00_req_step_06_consumers_dependencies.md`;`00_req_step_07_core_capability_loop.md`;`00_req_step_08_user_stories.md`;`00_req_step_09_functional_requirements.md`;`00_req_step_10_business_rules_boundaries.md`;`00_req_step_11_data_ownership.md`;`00_req_step_12_interfaces_dependencies.md`;`00_req_step_13_non_functional_requirements.md`

---

## 0. Step 开工确认

| 项目 | 记录 |
|---|---|
| Step | Step 14 验收标准 |
| 输出文件 | `design-calibration/00_req_step_14_acceptance_criteria.md` |
| 前置确认 | pass:用户在 Step 13 停审后回复“同意”,允许进入 Step 14 |
| 已读取项目级台账 | yes:`design-calibration/project_execution_ledger.md` |
| 已读取文档级 flow | yes:`design-calibration/00_requirements_calibration_flow.md` |
| 已读取上游 Step | yes:`00_req_step_01_upstream_relation.md`;`00_req_step_02_position_boundary.md`;`00_req_step_03_problem_context.md`;`00_req_step_04_goals_non_goals.md`;`00_req_step_05_users_roles.md`;`00_req_step_06_consumers_dependencies.md`;`00_req_step_07_core_capability_loop.md`;`00_req_step_08_user_stories.md`;`00_req_step_09_functional_requirements.md`;`00_req_step_10_business_rules_boundaries.md`;`00_req_step_11_data_ownership.md`;`00_req_step_12_interfaces_dependencies.md`;`00_req_step_13_non_functional_requirements.md` |
| 已读取 SOP / 书写规范 | yes:`需求文档讨论流程_SOP.md` Step 14;`需求文档书写规范.md` §4.14 |
| 已读取通用规范 | yes:`设计文档编写通则.md`;`设计文档讨论中间产物规范.md`;`设计真相源闭环与可落码性标准.md`;`全局项目依赖关系与裁剪规则.md` |
| 已读取历史材料 | yes:`projects/L4-sandbox/README.md`;旧 `00-需求文档.md`;旧 `05-测试方案.md`;旧 `06-验收标准.md` 中旧验收门禁、旧性能阈值、旧 Given-When-Then 和旧红线线索 |
| 已读取参考粒度 | yes:`projects/L1-governance/design-calibration/00_req_step_14_acceptance_criteria.md`;`projects/L1-artifact/design-calibration/00_req_step_14_acceptance_criteria.md` |
| 历史材料口径 | 旧接口步骤、测试脚本、证据列、benchmark 数字、通过率和验收签署只作线索,不直接继承为当前需求层验收条件 |
| 禁写范围 | 不写测试步骤、测试脚本、接口调用、API path、DTO、事件 payload、测试数据准备、CI / QA 流程、证据文件格式、验收执行流程、监控实现、后端选型、实施 commit、真实 run_id 或真实测试结果 |
| 正式文档写入 | not_allowed: Step 17 前不回填正式 `00-需求文档.md` |
| next_allowed_action | wait_user_confirm_step_15 |

---

## 1. Step 内计划

| 模块 | 状态 | 可审查产物 | gate_status | next_allowed_action |
|---|---|---|---|---|
| 恢复门禁与输入读取 | done | 台账、flow、Step 1~13、SOP、书写规范、历史验收材料摘要 | pass | 进入 SOP 问题回答。 |
| SOP 问题回答 | done | 核心闭环、功能、规则、数据、接口、NFR 和一票否决口径回答 | pass | 进入当前材料诊断。 |
| 当前材料诊断 | done | 旧验收污染诊断、外围增强误升格诊断、接口边界漏验诊断和伪量化诊断 | pass | 进入设计取舍。 |
| 设计取舍 | done | 五类验收分类、能力节点主轴、外围增强处理、零容忍和候选指标分层、一票否决窄口径 | pass | 进入结构化中间产物。 |
| 结构化中间产物 | done | 验收类别结论、能力级验收结论、验收标准表、一票否决项、映射结论和能力级停审结论 | pass | 进入回填草稿。 |
| 回填草稿 | done | 正式第 14 章候选正文 | pass | 进入自检与停审。 |
| 自检与停审 | done | Step 14 自检表和下一步门禁 | pass_wait_review | 等待用户确认 Step 15。 |

---

## 2. 必读摘要

| 文档 | Step 14 读取结论 | 对本 Step 的约束 |
|---|---|---|
| `需求文档讨论流程_SOP.md` Step 14 | Step 14 要把 Step 7 的核心能力、Step 9 的功能、Step 10 的规则、Step 11 的数据归属、Step 12 的接口依赖边界和 Step 13 的 NFR 统一收口成可判断验收条件。 | 验收必须先按 C-SBX-1~5 能力节点组织,再回到五类正式验收类别做横向审计。 |
| `需求文档书写规范.md` §4.14 | 正式验收章节固定使用 `验收类别 | 验收项 | 验收条件` 三列表,并必须列出一票否决项。 | 不能新增测试步骤列、证据列、脚本列、接口调用列或实现门禁列。 |
| `00_req_step_07_core_capability_loop.md` | 已固定 C-SBX-1~5 五个核心能力节点,且每个节点都要求后续 Step 14 有验收承接。 | 核心闭环验收必须覆盖五个节点,不能把外围增强写成闭环成立前置。 |
| `00_req_step_09_functional_requirements.md` | 已形成 `FR-SBX-001~018` 和 `FR-SBX-E01~E06`;核心功能覆盖统一入口、边界施加、policy fail-closed、capture / handoff、failure / cleanup。 | 核心与外围增强功能都需要验收承接,但外围增强不能压过核心需求通过门槛。 |
| `00_req_step_10_business_rules_boundaries.md` | 已形成 `BR-SBX-001~033`;重点保护正式语境、coherent boundary、policy fail-closed、材料分层交接和 cleanup / reaper guard。 | 验收项必须证明这些规则真的构成通过条件,而不是只在规则表中存在。 |
| `00_req_step_11_data_ownership.md` | sandbox 只拥有 execution isolation truth;外部真相只能以快照、引用或禁止保存正文进入。 | 数据归属验收必须显式检查真相、快照、引用和禁止保存正文四类边界。 |
| `00_req_step_12_interfaces_dependencies.md` | 已固定能力级接口只有查询 / 变更 / 事件输出 / 后台任务接口四类;`L0-core` 是唯一编译期定义来源。 | Step 14 必须验收接口与依赖边界是否成立,但不能滑入协议、schema、port 或实现组织。 |
| `00_req_step_13_non_functional_requirements.md` | NFR 已按性能、可用性、安全、审计 / 可追溯、幂等 / 一致性、可观测性六类收束,零容忍项已明确,旧性能数字已降级为候选目标。 | 非功能验收只能承接当前正式 NFR 口径,不能把历史数字无来源升级为硬门禁。 |
| 旧 `README.md` / 旧 `05-测试方案.md` / 旧 `06-验收标准.md` | 旧材料反复强调默认无出网、输出回收、控制留痕、cleanup 不先删证据、未授权访问阻断。 | 可吸收为正式验收方向和一票否决候选,但不复用旧测试阈值、步骤和 evidence 表达。 |

---

## 3. SOP 问题回答

### 3.1 哪些条件满足后,核心能力闭环算成立?

| 闭环节点 | 验收判断 |
|---|---|
| C-SBX-1 受控执行语境识别与约束 | 真实执行发生前必须已经形成正式受理语境、执行环境身份锚点和责任链绑定,且不能由调用方补造第二套受理语义。 |
| C-SBX-2 隔离环境边界建立与限制施加 | 真实执行只能发生在正式建立且限制已落实的隔离环境内;限制不可落实时必须显式拒绝,不能 silent degrade。 |
| C-SBX-3 给定策略内执行与 fail-closed | 高风险执行必须只在给定 policy / authorization 语境内继续;策略缺失、冲突、不支持或越权时必须显式等待、拒绝或保守收束。 |
| C-SBX-4 输出与观测材料安全捕获和分层交接 | 结果、候选材料和 observability material 必须被捕获并分层交接;下游消费失败时也不能把 capture 缺失伪装为已交接。 |
| C-SBX-5 失败租约清理与安全红线保守收束 | timeout、deny、cleanup、orphan、redline 等非 happy path 必须稳定分类、保守收束并保留关键材料,不能先删证据或把问题扩散到托管外。 |

### 3.2 哪些功能能力满足后,本次需求算完成?

本次需求通过的硬前提只覆盖核心闭环功能 `FR-SBX-001~018`。外围增强 `FR-SBX-E01~E06` 需要有验收承接,但不构成当前整体通过的核心前提。

| 功能范围 | 验收判断 |
|---|---|
| C-SBX-1 对应 `FR-SBX-001~003` | 已形成统一受理入口、执行环境身份与责任链绑定、跨调用方统一入口语义。 |
| C-SBX-2 对应 `FR-SBX-004~006` | 已形成正式隔离环境、统一边界限制施加和限制不可落实时的显式拒绝。 |
| C-SBX-3 对应 `FR-SBX-007~010` | 已形成启动前策略承接、策略内执行、高风险动作阻断和跨调用方统一策略语义。 |
| C-SBX-4 对应 `FR-SBX-011~014` | 已形成统一输出捕获、候选材料安全收口、观测材料分层交接和跨调用方统一结果回收链。 |
| C-SBX-5 对应 `FR-SBX-015~018` | 已形成稳定失败分类、安全红线保守收束、非 happy path 材料留痕和租约 / 孤儿环境保守回收。 |
| 外围增强 `FR-SBX-E01~E06` | 若后续实现这些增强能力,必须证明它们不改变核心隔离语义、不生成第二套真相、不反向定义核心通过口径。 |

### 3.3 哪些规则 / 边界被满足后,才算没有串线?

| 规则组 | 验收判断 |
|---|---|
| 正式受理与归责规则 | 必须先有正式语境和责任链,再允许真实执行发生;identity / work / runner / runtime 真相不能被 sandbox 补造。 |
| 隔离与 backend 边界规则 | 真实执行必须在正式隔离环境内发生;后端能力和产品选型不能反向定义 sandbox 真相。 |
| policy fail-closed 规则 | sandbox 只能执行已给定策略,不能拥有 allowlist truth、approval truth 或 policy definition truth。 |
| capture / handoff 分层规则 | 结果、候选材料和 observability material 必须分层交接,不能静默升级为 Artifact truth、evidence truth 或 observability store truth。 |
| cleanup / reaper / redline 规则 | replay、cleanup、reaper 和 redline 只允许收束隔离层状态,不得重写 runtime、artifact、governance 或业务真相。 |
| 接口 / 依赖规则 | 能力级接口只能落在查询 / 变更 / 事件输出 / 后台任务四类;`L0-core` 之外的仓和运行承载只能作为运行期 / 事件期依赖,不能写成源码真相源。 |

### 3.4 哪些数据边界被满足后,才算数据归属正确?

| 数据类型 | 验收判断 |
|---|---|
| 真相数据 | sandbox 只拥有 execution isolation truth,包括正式受理、边界建立、策略裁定、capture / handoff、失败 / cleanup / redline 事实。 |
| 快照数据 | 调用方上下文摘要、backend capability 摘要、policy applicability 摘要和下游交接状态摘要只服务稳定判断,不形成独立真相。 |
| 引用数据 | identity、work、runner、policy、artifact、runtime、observability、investigation 等对象只能以 refs 进入,不能接管上游 / 下游生命周期。 |
| 禁止保存正文 | identity / work / tool semantic / runtime recover / formal artifact / observability store / policy DSL / operator UI 等正文不得进入 sandbox 真相范围。 |

### 3.5 哪些非功能要求被满足后,才算质量达标?

| 非功能类别 | 验收判断 |
|---|---|
| 性能 | 正式隔离建立、policy 判断、基础 capture 和 cleanup / reaper 不应成为主链不可解释瓶颈;旧时延数字只保留为候选目标。 |
| 可用性 | 输入缺失、下游延迟或外围增强失效时,核心链路必须显式等待、拒绝或失败,不得伪造成功。 |
| 安全 | 宿主直跑、边界静默放宽、未授权外联、cleanup 先删证据和外部正文越权入仓都必须是零容忍结果。 |
| 审计 / 可追溯 | 受理、建立、policy、capture、handoff、failure、control 和 redline 必须可回链。 |
| 幂等 / 一致性 | 同一执行、同一 policy 语境和同一 control 信号不得形成第二套正式语义。 |
| 可观测性 | 关键状态、关键异常、关键依赖缺失、资源超限、cleanup guard 和 redline 事件必须可稳定观察。 |

### 3.6 哪些失败情形属于一票否决?

一票否决项只覆盖仓定位失效、核心闭环断裂、正式边界被打穿、真相归属失守或关键追溯链断裂的情况。外围增强未实现、候选性能数字未定稿、外部展示能力缺失不属于一票否决。

---

## 4. 当前材料诊断

### 4.1 旧验收污染诊断

| 位置 | 旧表现 | 当前问题 | Step 14 处理 |
|---|---|---|---|
| 旧 `06-验收标准.md` | 按接口步骤、执行流程、证据列和门禁流程组织 | 已把验收标准写成测试 / 实施清单 | 改回需求层“验什么”和“怎样算通过” |
| 旧 `05-测试方案.md` | 用 Given-When-Then、脚本和回放步骤表达通过条件 | 测试步骤与需求验收混层 | 只吸收为历史主题线索,不复用句式 |
| 旧 `README.md` / 旧 `00-需求文档.md` | 用启动时延、销毁时延、白名单开销、可用率作硬门槛 | 当前缺正式验证来源 | 保留为候选目标,不直接作为正式验收硬条件 |
| 旧材料中的“默认无出网 / cleanup 不先删证据 / 输出回收” | 方向正确 | 曾混入测试结果表达 | 转译为规则 / 数据 / NFR 承接下的正式验收项和一票否决候选 |

### 4.2 外围增强误升格诊断

最容易误写成核心通过前提的内容有: 多后端风险分层、inspect / replay 控制面、输出预览、多集群调度、后端比较和长期趋势分析。它们在 Step 9 已被明确为 `FR-SBX-E01~E06` 外围增强。

当前口径:

- 外围增强必须有验收承接,防止变成 Step 16 的孤儿功能。
- 但外围增强不构成当前核心闭环成立前置。
- 其验收重点是“不能破坏核心隔离语义、不能产生第二套真相、不能反向定义当前通过条件”。

### 4.3 接口与依赖漏验诊断

如果 Step 14 只看功能、规则和数据,很容易遗漏 Step 12 的接口 / 依赖边界,导致后续实现把 API、DTO、topic、port 或源码依赖当作需求真相。

当前处理口径:

- 把接口 / 依赖边界纳入“规则 / 边界验收”。
- 正式检查能力接口类型是否仍保持查询 / 变更 / 事件输出 / 后台任务四类。
- 正式检查 `L0-core` 之外的仓和承载能力是否仍停留在运行期 / 事件期消费边界,没有反向升级为源码真相源。

### 4.4 伪量化诊断

Step 14 最容易出现两类伪量化:

1. 直接复制旧性能数字,把历史 benchmark 伪装成已确认硬门槛。
2. 把“100% 拦截”“100% 留痕”写成测试执行描述,而不是需求层零容忍结果。

当前处理口径:

- 与安全红线直接相关的零容忍结果可保留为正式目标值 `0` 容忍。
- 旧启动时延、销毁时延、白名单开销和服务可用率只保留为候选目标。
- 不写任何采集、benchmark、dashboard 或 CI 验证方式。

---

## 5. 设计取舍

### 5.1 采用“能力节点主轴 + 五类验收类别横向审计”

| 方案 | 优点 | 问题 | 决策 |
|---|---|---|---|
| 方案 A: 直接生成全仓验收清单 | 看起来简洁 | 容易让验收项脱离 C-SBX-1~5,也难审计孤儿功能和接口边界 | 不采用 |
| 方案 B: 先按能力节点收束,再按五类类别横向审计 | 可追溯到 Step 7 / 9 / 10 / 11 / 12 / 13,适合后续 Step 16 | 结构更长 | 采用 |

### 5.2 核心功能是整体通过硬前提,外围增强只做边界承接

| 方案 | 内容 | 影响 | 决策 |
|---|---|---|---|
| 方案 A | 把 `FR-SBX-E01~E06` 也当成本轮整体通过前提 | 会让增强能力压过核心隔离闭环 | 不采用 |
| 方案 B | 为外围增强提供验收承接,但不把它们升级为核心通过门槛 | 既避免 Step 16 孤儿功能,也保持核心闭环优先 | 采用 |

### 5.3 零容忍安全结果保留为正式验收,旧性能数字保留为候选目标

| 方案 | 内容 | 影响 | 决策 |
|---|---|---|---|
| 方案 A | 把宿主直跑、边界放宽和旧启动时延数字一起定成硬门槛 | 会把已确认安全底线和未验证历史数字混在一起 | 不采用 |
| 方案 B | 零容忍边界作为正式验收,历史性能数字只保留为候选目标 | 与 Step 13 的当前真相强度一致 | 采用 |

### 5.4 一票否决保持窄口径

| 方案 | 内容 | 影响 | 决策 |
|---|---|---|---|
| 方案 A | 把所有缺陷、外围增强缺口和候选指标未达标都列成一票否决 | 整体失败条件会失真 | 不采用 |
| 方案 B | 只保留仓定位失效、核心闭环断裂、正式边界被打穿、真相污染和关键追溯链断裂 | 便于 Step 06 后续形成真正红线 | 采用 |

---

## 6. 结构化中间产物

### 6.1 验收类别结论

| 验收类别 | 对应输入 | 覆盖范围 |
|---|---|---|
| 核心能力闭环验收 | Step 7 | C-SBX-1~5 是否共同构成受控执行隔离闭环 |
| 功能能力验收 | Step 9 | `FR-SBX-001~018` 与 `FR-SBX-E01~E06` 是否有通过口径承接 |
| 规则 / 边界验收 | Step 10;Step 12 | `BR-SBX-001~033` 与接口 / 依赖边界是否真正防止串线 |
| 数据归属验收 | Step 11 | 真相、快照、引用、禁止保存正文四类边界是否成立 |
| 非功能验收 | Step 13 | 六类 NFR 是否达到当前正式判断口径 |

### 6.2 按能力节点组织的验收结论

| 核心能力节点 | 验收焦点 | 主要承接 |
|---|---|---|
| C-SBX-1 受控执行语境识别与约束 | 先有正式受理语境和责任链,再允许真实执行发生;调用方不能补造第二套入口语义。 | `FR-SBX-001~003`;`BR-SBX-001~005`;Step 11 C-SBX-1 数据;Step 12 C-SBX-1 接口边界 |
| C-SBX-2 隔离环境边界建立与限制施加 | 真实执行只能在正式隔离环境内发生;资源 / FS / network / process 边界必须 coherent,不可 silent degrade。 | `FR-SBX-004~006`;`BR-SBX-006~010`;Step 11 C-SBX-2 数据;Step 12 C-SBX-2 接口边界 |
| C-SBX-3 给定策略内执行与 fail-closed | 执行只能在给定策略内继续;策略不完备或越权时必须显式拒绝或保守收束,且跨调用方语义一致。 | `FR-SBX-007~010`;`BR-SBX-011~017`;Step 11 C-SBX-3 数据;Step 12 C-SBX-3 接口边界 |
| C-SBX-4 输出与观测材料安全捕获和分层交接 | 输出、候选材料和观测材料必须统一捕获并分层交接;下游延迟不能反向掩盖 capture 缺失。 | `FR-SBX-011~014`;`BR-SBX-018~024`;Step 11 C-SBX-4 数据;Step 12 C-SBX-4 接口边界 |
| C-SBX-5 失败租约清理与安全红线保守收束 | 非 happy path 必须稳定分类、保守收束、完整留痕;cleanup / reaper 不得先删证据或把问题扩散到托管外。 | `FR-SBX-015~018`;`BR-SBX-025~033`;Step 11 C-SBX-5 数据;Step 12 C-SBX-5 接口边界 |

### 6.3 验收标准表

| 验收类别 | 验收项 | 验收条件 |
|---|---|---|
| 核心能力闭环验收 | AC-SBX-001 正式受控执行语境成立 | 真实执行发生前,必须已经形成正式受理语境、执行环境身份锚点和责任链绑定,且调用方不能补造第二套正式入口语义。 |
| 核心能力闭环验收 | AC-SBX-002 正式隔离环境边界成立 | 真实执行只能在正式建立且限制已落实的隔离环境内发生;限制不可落实时必须显式拒绝。 |
| 核心能力闭环验收 | AC-SBX-003 策略内执行与 fail-closed 成立 | 高风险执行只能在给定 policy / authorization 语境下继续;策略缺失、冲突、不支持或越权时必须显式等待、拒绝或保守收束。 |
| 核心能力闭环验收 | AC-SBX-004 输出与观测材料捕获交接闭环成立 | 结果、候选材料和 observability material 必须被统一捕获并分层交接;下游消费失败时也必须保留显式 capture / handoff 状态。 |
| 核心能力闭环验收 | AC-SBX-005 失败 / cleanup / redline 保守收束闭环成立 | timeout、deny、cleanup、orphan、redline 等非 happy path 必须形成稳定分类、保守收束结果和关键材料保留。 |
| 功能能力验收 | AC-SBX-006 受控执行请求语境接入能力成立 | `FR-SBX-001` 成立:真实执行开始前存在稳定、统一、可追溯的受理入口。 |
| 功能能力验收 | AC-SBX-007 执行环境身份与责任链绑定能力成立 | `FR-SBX-002` 成立: actor / member / work / runner 来源语境能够绑定到正式执行环境身份并可稳定归责。 |
| 功能能力验收 | AC-SBX-008 跨调用方统一受控执行入口能力成立 | `FR-SBX-003` 成立: Runner 与其他调用方遵守同一套 sandbox 入口语义,不存在第二套旁路入口。 |
| 功能能力验收 | AC-SBX-009 正式隔离环境建立能力成立 | `FR-SBX-004` 成立:真实执行能够进入正式管理的隔离环境,而不是退化为宿主直跑。 |
| 功能能力验收 | AC-SBX-010 统一边界限制施加能力成立 | `FR-SBX-005` 成立:资源、文件系统、网络和进程边界以一致语义被正式施加。 |
| 功能能力验收 | AC-SBX-011 限制可落实性校验与拒绝能力成立 | `FR-SBX-006` 成立:边界限制不可落实、不可验证或后端不支持时,会显式拒绝执行。 |
| 功能能力验收 | AC-SBX-012 启动前策略语境承接能力成立 | `FR-SBX-007` 成立:高风险执行开始前,正式 launch / isolation policy 语境已经被承接。 |
| 功能能力验收 | AC-SBX-013 策略内执行与高风险动作阻断能力成立 | `FR-SBX-008` 成立:只在给定策略范围内继续执行,越权高风险动作被阻断。 |
| 功能能力验收 | AC-SBX-014 策略缺失 / 冲突 / 不支持时保守拒绝能力成立 | `FR-SBX-009` 成立:策略不完备或后端不支持时不会 best-effort 继续执行。 |
| 功能能力验收 | AC-SBX-015 跨调用方统一策略执行口径能力成立 | `FR-SBX-010` 成立:工具、Runner 和自动化场景遵守同一套策略执行和失败语义。 |
| 功能能力验收 | AC-SBX-016 执行输出统一捕获能力成立 | `FR-SBX-011` 成立:标准输出、结果语境和完成状态通过统一 capture 主线收口。 |
| 功能能力验收 | AC-SBX-017 候选材料安全收口能力成立 | `FR-SBX-012` 成立:候选文件和材料能够安全收口并交接,但不会被直接宣布为 formal artifact truth。 |
| 功能能力验收 | AC-SBX-018 观测与审计材料分层交接能力成立 | `FR-SBX-013` 成立: usage、audit、trace 等材料能够连同来源语境被分层交接,且 sandbox 不拥有 observability store truth。 |
| 功能能力验收 | AC-SBX-019 跨调用方统一结果回收链能力成立 | `FR-SBX-014` 成立: Runner 与其他调用方通过同一套 capture / handoff 语义消费结果。 |
| 功能能力验收 | AC-SBX-020 失败分类与原因归并能力成立 | `FR-SBX-015` 成立: timeout、资源超限、backend failure、capture failure、orphan 等都能收束为稳定失败分类。 |
| 功能能力验收 | AC-SBX-021 安全红线保守收束能力成立 | `FR-SBX-016` 成立: escape-like、越权访问和其他安全红线事件会变成显式保守结果,而不是静默扩散。 |
| 功能能力验收 | AC-SBX-022 非 happy path 材料留痕能力成立 | `FR-SBX-017` 成立: deny、kill、replay、cleanup 等异常控制动作形成可追溯材料。 |
| 功能能力验收 | AC-SBX-023 租约到期与孤儿环境保守回收能力成立 | `FR-SBX-018` 成立:租约过期或孤儿环境场景能够保守回收,且不重写相邻仓业务真相。 |
| 功能能力验收 | AC-SBX-024 风险分层承载与多调度增强不改核心语义 | `FR-SBX-E01`;`FR-SBX-E04`;`FR-SBX-E05` 若被实现,必须证明不改写核心隔离语义、不新增第二套 policy / backend 真相、也不把后端选择提升为当前核心通过前提。 |
| 功能能力验收 | AC-SBX-025 inspect / preview / 趋势增强不改核心真相边界 | `FR-SBX-E02`;`FR-SBX-E03`;`FR-SBX-E06` 若被实现,必须证明不新增第二套结果 / 调查 / 观测真相,且不阻塞核心 capture / cleanup 闭环。 |
| 规则 / 边界验收 | AC-SBX-026 正式受理与归责边界成立 | `BR-SBX-001~005` 成立:必须先有正式语境和责任链,identity / work / runner / runtime 真相不能被 sandbox 补造。 |
| 规则 / 边界验收 | AC-SBX-027 隔离边界与 backend 边界成立 | `BR-SBX-006~010` 成立:真实执行必须在正式隔离环境内发生,coherent boundary 不可 silent degrade,backend 不反写真相。 |
| 规则 / 边界验收 | AC-SBX-028 policy fail-closed 与 policy 来源边界成立 | `BR-SBX-011~017` 成立:sandbox 只执行已给定 policy,越权动作会被阻断,allowlist truth / approval truth / policy definition truth 仍外部拥有。 |
| 规则 / 边界验收 | AC-SBX-029 capture / handoff 分层与下游真相边界成立 | `BR-SBX-018~024` 成立:输出、候选材料和 observability material 保持分层,交接显式发生,不静默升级为下游真相。 |
| 规则 / 边界验收 | AC-SBX-030 失败 / control / cleanup / reaper 边界成立 | `BR-SBX-025~033` 成立:稳定失败分类、cleanup guard、reaper 边界和 redline 收束成立,且不重写相邻仓真相。 |
| 规则 / 边界验收 | AC-SBX-031 接口类型与依赖裁剪边界成立 | Step 12 和 Step 6 的接口 / 依赖边界成立:能力接口仍限于查询 / 变更 / 事件输出 / 后台任务四类,`L0-core` 仍是唯一编译期定义来源,其他仓和运行承载仍停留在运行期 / 事件期消费边界。 |
| 数据归属验收 | AC-SBX-032 execution isolation 真相归属正确 | Step 11 的真相数据边界成立:sandbox 只拥有正式受理、边界建立、策略裁定、capture / handoff、失败 / cleanup / redline 事实。 |
| 数据归属验收 | AC-SBX-033 快照只服务判断,不反向成真相 | 调用方摘要、backend capability 摘要、policy applicability 摘要和下游交接状态摘要只服务稳定判断,不形成独立真相。 |
| 数据归属验收 | AC-SBX-034 引用关系不接管外部生命周期 | identity、work、policy、artifact、runtime、observability、investigation 等只以 refs 进入,不会被 sandbox 接管正文生命周期。 |
| 数据归属验收 | AC-SBX-035 外部正文禁止入仓 | identity / work / tool semantic / runtime recover / formal artifact / observability store / policy DSL / operator UI 等正文不得进入 sandbox 真相范围。 |
| 非功能验收 | AC-SBX-036 性能判断口径成立 | Step 13 性能要求成立:正式隔离建立、policy 判断、基础 capture 和 cleanup / reaper 不应成为主链不可解释瓶颈;旧时延数字只保留为候选目标。 |
| 非功能验收 | AC-SBX-037 可用性判断口径成立 | Step 13 可用性要求成立:输入缺失、下游延迟或外围增强失效时,核心链路必须显式等待、拒绝或失败,不得伪造成功。 |
| 非功能验收 | AC-SBX-038 安全判断口径成立 | Step 13 安全要求成立:宿主直跑、边界静默放宽、未授权外联、cleanup 先删证据和外部正文越权入仓都必须是零容忍结果。 |
| 非功能验收 | AC-SBX-039 审计 / 可追溯判断口径成立 | Step 13 审计 / 可追溯要求成立:受理、建立、policy、capture、handoff、failure、control 和 redline 必须可回链。 |
| 非功能验收 | AC-SBX-040 幂等 / 一致性判断口径成立 | Step 13 幂等 / 一致性要求成立:同一执行、同一 policy 语境和同一 control 信号不得形成第二套正式语义。 |
| 非功能验收 | AC-SBX-041 可观测性判断口径成立 | Step 13 可观测性要求成立:关键状态、关键异常、关键依赖缺失、资源超限、cleanup guard 和 redline 事件必须可稳定观察。 |

### 6.4 一票否决项

| ID | 一票否决项 | 否决原因 |
|---|---|---|
| VF-SBX-001 | C-SBX-1~C-SBX-5 任一核心闭环节点无法成立。 | sandbox 不再构成完整的受控执行隔离闭环。 |
| VF-SBX-002 | 宿主直跑、调用方本地执行、旁路执行或匿名执行可以被宣称为正式 sandbox 受控执行。 | 正式受理与隔离入口边界失效。 |
| VF-SBX-003 | 任一必需 resource / filesystem / network / process 边界可以 silent degrade、部分忽略或未验证即继续执行。 | 隔离边界真相失效。 |
| VF-SBX-004 | policy 缺失、冲突、不支持、不可解析或未授权高风险动作仍可继续执行。 | fail-closed 失效,高风险动作被放行。 |
| VF-SBX-005 | sandbox 保存或拥有 identity / work / tool semantic / runtime recover / formal artifact / observability store / policy DSL / operator UI 等外部正文或外部真相正文。 | execution isolation truth ownership 被污染。 |
| VF-SBX-006 | 输出、候选材料或 observability material 被静默提升为 formal artifact truth、baseline truth、evidence truth 或 observability store truth。 | 材料分层与下游真相边界失效。 |
| VF-SBX-007 | cleanup / reaper 在审计、回放、调查或安全交接所需材料未安全交接前先删除 capture / audit / investigation 材料。 | 关键证据链被主动破坏。 |
| VF-SBX-008 | 租约到期、孤儿环境或 redline 事件可以在托管恢复路径之外继续运行或脱离受控收束。 | cleanup / reaper / redline containment 失效。 |
| VF-SBX-009 | 同一正式执行、同一 policy 语境或同一控制信号在不同调用方、不同承载或不同下游处出现第二套正式语义。 | 平台出现冲突真相,无法对账。 |
| VF-SBX-010 | 关键 accept / reject / establish / policy / handoff / failure / control / redline 链路存在不可重建的追溯缺口。 | 核心审计与问责链断裂。 |

### 6.5 验收项与功能 / 规则 / 数据 / 接口 / 非功能映射结论

| 范围 | 对应验收项 |
|---|---|
| C-SBX-1~C-SBX-5 核心能力闭环 | `AC-SBX-001~005`;`VF-SBX-001` |
| `FR-SBX-001~018` | `AC-SBX-006~023` |
| `FR-SBX-E01~E06` | `AC-SBX-024~025` |
| `BR-SBX-001~033` | `AC-SBX-026~030`;`VF-SBX-002~008` |
| Step 12 接口与依赖边界 | `AC-SBX-031`;`VF-SBX-009` |
| Step 11 数据归属 | `AC-SBX-032~035`;`VF-SBX-005~007` |
| Step 13 非功能要求 | `AC-SBX-036~041`;`VF-SBX-010` |

### 6.6 能力级验收停审结论

| 能力节点 | 主要验收项 | 停审结论 |
|---|---|---|
| C-SBX-1 | `AC-SBX-001`;`AC-SBX-006~008`;`AC-SBX-026`;`AC-SBX-032~035`;`AC-SBX-037~039` | 已覆盖正式受理、责任链、统一入口、上游真相不补造和关键追溯,可承接 Step 15。 |
| C-SBX-2 | `AC-SBX-002`;`AC-SBX-009~011`;`AC-SBX-027`;`AC-SBX-032~034`;`AC-SBX-036~041` | 已覆盖正式隔离环境、coherent boundary、限制不可 silent degrade 和 backend 不反写真相,可承接 Step 15。 |
| C-SBX-3 | `AC-SBX-003`;`AC-SBX-012~015`;`AC-SBX-028`;`AC-SBX-032~035`;`AC-SBX-037~041` | 已覆盖 policy 前置、fail-closed、跨调用方统一语义和 policy 来源边界,可承接 Step 15。 |
| C-SBX-4 | `AC-SBX-004`;`AC-SBX-016~019`;`AC-SBX-029`;`AC-SBX-032~035`;`AC-SBX-036~041` | 已覆盖统一 capture、候选材料与观测材料分层、显式 handoff 和下游真相边界,可承接 Step 15。 |
| C-SBX-5 | `AC-SBX-005`;`AC-SBX-020~023`;`AC-SBX-030`;`AC-SBX-032~035`;`AC-SBX-037~041` | 已覆盖稳定失败分类、cleanup guard、orphan / lease recovery、redline 保守收束和关键材料保留,可承接 Step 15。 |

---

## 7. 回填草稿

以下内容供 Step 17 重建正式 `00-需求文档.md` 时回填到 §14。正式文档可摘录本文件 §6.1、§6.3、§6.4 和 §6.5 的结论,不重复扩写旧材料诊断和设计取舍。

```md
## 14. 验收标准

> 校准来源:
> - `design-calibration/00_req_step_14_acceptance_criteria.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“按能力节点组织的验收结论”“验收标准表”和“一票否决项”小节,了解本章如何从核心闭环、功能需求、规则边界、数据归属、接口依赖和非功能要求收束验收条件。

本文采用 `design-calibration/00_req_step_14_acceptance_criteria.md` §6 的验收标准结论。`L4-sandbox` 的验收按核心能力闭环、功能能力、规则 / 边界、数据归属和非功能五类组织,并单独列出一票否决项。

当前正式口径中,整体通过的硬前提只覆盖 `C-SBX-1~5` 和 `FR-SBX-001~018` 对应的核心隔离闭环。`FR-SBX-E01~E06` 外围增强仍有验收承接,但不构成当前核心需求通过前提。零容忍验收重点包括: 宿主直跑成功率为 `0`、边界静默放宽成功率为 `0`、未授权外联成功率为 `0`、cleanup 先删证据成功率为 `0`、外部正文越权入仓成功率为 `0`。
```

---

## 8. 自检与停审

| 自检项 | 结果 | 说明 |
|---|---|---|
| 是否按五类正式验收类别组织 | yes | 已覆盖核心能力闭环、功能能力、规则 / 边界、数据归属、非功能验收。 |
| 是否按 C-SBX-1~5 形成能力级验收承接 | yes | 五个能力节点均有按节点组织的验收结论和停审结论。 |
| 是否承接了 `FR-SBX-001~018` 与 `FR-SBX-E01~E06` | yes | 核心功能由 `AC-SBX-006~023` 承接,外围增强由 `AC-SBX-024~025` 承接。 |
| 是否承接了 `BR-SBX-001~033` 与 Step 12 接口边界 | yes | 规则 / 边界验收与映射结论已覆盖正式规则和接口 / 依赖边界。 |
| 是否承接了 Step 11 数据归属与 Step 13 NFR | yes | 数据归属验收和非功能验收已单独列出。 |
| 是否把测试步骤、脚本、接口调用或证据格式写进本步 | no | 已裁剪测试执行、CI / QA、payload、benchmark 和证据文件格式。 |
| 历史数字是否被无来源升格为正式硬门槛 | no | 旧时延、白名单开销和服务可用率仍只作候选目标。 |
| 是否发现新的上游 blocker | no | 当前无新增 blocker;既有 downstream 文档缺口仍不阻塞 `00` Step 14。 |
| 是否允许进入 Step 15 | yes_after_user_review | 本 Step 已完成,等待用户确认后进入 Step 15 `风险与待确认事项`。 |

停审结论:

```text
Step 14 `验收标准` 已按需求 SOP、书写规范、Step 7 能力闭环、Step 9 功能需求、Step 10 规则边界、Step 11 数据归属、Step 12 接口依赖和 Step 13 非功能要求完成重建;
当前 gate_status = pass_wait_review;
未修改正式 `projects/L4-sandbox/00-需求文档.md`;
next_allowed_action = 等待用户确认后进入 Step 15 `风险与待确认事项`;
当前不需要提交 commit。
```
