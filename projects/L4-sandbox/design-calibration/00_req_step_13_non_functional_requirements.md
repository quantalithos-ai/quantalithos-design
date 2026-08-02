# L4-sandbox 00 需求 Step 13: 非功能需求

> 创建日期: 2026-07-06
> 状态: done_wait_review
> 当前模式: full-restart
> 本轮口径: 用户已确认 Step 12,允许进入 Step 13;旧 L4-sandbox 正式文档和旧 README 只作 historical_material。
> 回填位置: `00-需求文档.md` 第 13 章“非功能需求”
> 项目级台账: `design-calibration/project_execution_ledger.md`
> 文档级 flow: `design-calibration/00_requirements_calibration_flow.md`
> 上游 Step: `00_req_step_01_upstream_relation.md`;`00_req_step_02_position_boundary.md`;`00_req_step_03_problem_context.md`;`00_req_step_04_goals_non_goals.md`;`00_req_step_05_users_roles.md`;`00_req_step_06_consumers_dependencies.md`;`00_req_step_07_core_capability_loop.md`;`00_req_step_08_user_stories.md`;`00_req_step_09_functional_requirements.md`;`00_req_step_10_business_rules_boundaries.md`;`00_req_step_11_data_ownership.md`;`00_req_step_12_interfaces_dependencies.md`

---

## 0. Step 开工确认

| 项目 | 记录 |
|---|---|
| Step | Step 13 非功能需求 |
| 输出文件 | `design-calibration/00_req_step_13_non_functional_requirements.md` |
| 前置确认 | pass:用户在 Step 12 停审后回复“同意”,允许进入 Step 13 |
| 已读取项目级台账 | yes:`design-calibration/project_execution_ledger.md` |
| 已读取文档级 flow | yes:`design-calibration/00_requirements_calibration_flow.md` |
| 已读取上游 Step | yes:`00_req_step_01_upstream_relation.md`;`00_req_step_02_position_boundary.md`;`00_req_step_03_problem_context.md`;`00_req_step_04_goals_non_goals.md`;`00_req_step_05_users_roles.md`;`00_req_step_06_consumers_dependencies.md`;`00_req_step_07_core_capability_loop.md`;`00_req_step_08_user_stories.md`;`00_req_step_09_functional_requirements.md`;`00_req_step_10_business_rules_boundaries.md`;`00_req_step_11_data_ownership.md`;`00_req_step_12_interfaces_dependencies.md` |
| 已读取 SOP / 书写规范 | yes:`需求文档讨论流程_SOP.md` Step 13;`需求文档书写规范.md` §4.13 |
| 已读取通用规范 | yes:`设计文档编写通则.md`;`设计文档讨论中间产物规范.md`;`设计真相源闭环与可落码性标准.md`;`全局项目依赖关系与裁剪规则.md` |
| 已读取历史材料 | yes:`projects/L4-sandbox/README.md`;旧 `00-需求文档.md`;旧 `05-测试方案.md`;旧 `06-验收标准.md` 中性能目标、安全基线、测试指标和验收门禁线索 |
| 已读取参考粒度 | yes:`projects/L1-governance/design-calibration/00_req_step_13_non_functional_requirements.md`;`projects/L1-artifact/design-calibration/00_req_step_13_non_functional_requirements.md` |
| 历史材料口径 | 旧启动时延、销毁时延、白名单检查开销、可用率和测试覆盖率只作候选目标线索,不原样继承为当前正式硬指标 |
| 禁写范围 | 不写监控平台配置、日志字段、trace schema、缓存参数、数据库优化、重试算法、加密实现、权限实现、SLO 仪表盘、测试用例、验收门禁、配置 key 或实施 boundary |
| 正式文档写入 | not_allowed: Step 17 前不回填正式 `00-需求文档.md` |
| next_allowed_action | wait_user_confirm_step_14 |

---

## 1. Step 内计划

| 模块 | 状态 | 可审查产物 | gate_status | next_allowed_action |
|---|---|---|---|---|
| 恢复门禁与输入读取 | done | 台账、flow、Step 1~12、SOP、书写规范、历史 NFR 材料摘要 | pass | 进入 SOP 问题回答。 |
| SOP 问题回答 | done | 能力级 NFR、全局 NFR、六类类别适用性和 Step 14 准入判断 | pass | 进入当前材料诊断。 |
| 当前材料诊断 | done | Step 12 到 Step 13 的转译诊断、旧指标污染诊断、能力级 / 全局混层诊断和量化陷阱诊断 | pass | 进入设计取舍。 |
| 设计取舍 | done | 能力级 + 全局双主轴、正式判断口径与候选量化分层、零容忍安全指标和后置性能指标取舍 | pass | 进入结构化中间产物。 |
| 结构化中间产物 | done | 能力级 NFR 结论、全局 NFR 结论、类别结论、NFR 表、判断口径表、映射结论和停审结论 | pass | 进入回填草稿。 |
| 回填草稿 | done | 正式第 13 章候选正文 | pass | 进入自检与停审。 |
| 自检与停审 | done | Step 13 自检表和下一步门禁 | pass_wait_review | 等待用户确认 Step 14。 |

---

## 2. 必读摘要

| 文档 | Step 13 读取结论 | 对本 Step 的约束 |
|---|---|---|
| `需求文档讨论流程_SOP.md` Step 13 | Step 13 要把本仓必须满足的质量约束写清楚,并区分能力级质量约束与全局质量约束。 | 每条 NFR 都必须挂到核心能力节点或全仓目标,不得写孤儿口号。 |
| `需求文档书写规范.md` §4.13 | 正式非功能类别固定为性能、可用性、安全、审计 / 可追溯、幂等 / 一致性、可观测性。 | 每条要求都必须写成判断句,且“判断口径 / 目标值”不得留空。 |
| `00_req_step_07_core_capability_loop.md` | 已固定 C-SBX-1~5 五个核心能力节点。 | 能回指能力节点的 NFR 必须挂到对应节点,不能全部写成全局口号。 |
| `00_req_step_09_functional_requirements.md` | 已形成 `FR-SBX-001~018` 和 `FR-SBX-E01~E06`;主线覆盖统一入口、边界施加、policy fail-closed、capture / handoff、failure / cleanup。 | 每条能力级 NFR 至少要能回指对应 `FR-SBX`。 |
| `00_req_step_10_business_rules_boundaries.md` | 已形成 `BR-SBX-001~033`;重点保护正式语境、coherent boundary、policy fail-closed、材料分层交接和 cleanup / reaper guard。 | 安全、审计和一致性 NFR 必须承接这些规则,不能为了“高可用”而打穿 fail-closed。 |
| `00_req_step_11_data_ownership.md` | sandbox 只拥有 execution isolation truth;外部真相只能以快照、引用或禁止保存正文进入。 | 安全和一致性 NFR 必须持续保护 truth ownership,不允许为了性能或可观测性把外部正文拉进 sandbox。 |
| `00_req_step_12_interfaces_dependencies.md` | 已固定输入边界为 `L0-core`、`L1-identity`、`L1-work`、承载能力、policy 来源;固定输出边界为 tools / runtime / member-service / runner / artifact / bus / observability。 | 可用性和性能 NFR 必须区分核心执行闭环与下游消费 / 事件协作,不得把消费链体验写成核心 truth 成立前置。 |
| `projects/L4-sandbox/README.md` | 提供历史性能目标和安全基线线索: Docker `<1s`、gVisor `<2s`、销毁 `<500ms`、白名单检查 `<5ms`、默认无出网、安全基线等。 | 这些数字只能作为候选目标线索,未经当前阶段验证不得直接升格为正式硬指标。 |
| 旧 `00-需求文档.md` / `05-测试方案.md` / `06-验收标准.md` | 旧材料反复强调未授权外联拦截率、输出回收率、控制留痕率、回放链成功率等。 | 可吸收为需求层零容忍或完整性判断口径,但不直接复制测试阈值或验收句式。 |

---

## 3. SOP 问题回答

| SOP 问题 | 当前回答 |
|---|---|
| 哪些非功能要求能回指具体核心能力节点? | 受控执行入口稳定性、边界施加时延与不退化、policy fail-closed 一致性、capture / handoff 完整性、failure / cleanup / redline 收束可追溯性都能直接回指 C-SBX-1~5。 |
| 哪些非功能要求覆盖全仓,不能强行归入某个能力节点? | 单一 execution isolation truth、外部正文不得入仓、下游消费失败不反写真相、安全底线优先于成功率、跨调用方观测语义一致等属于全局质量约束。 |
| 这个仓必须满足哪些性能要求? | sandbox 的正式执行入口、隔离建立、policy 判断、结果交接和 cleanup 回收不能成为主链不可解释瓶颈;历史启动与销毁数字只作为候选目标。 |
| 这个仓必须满足哪些可用性要求? | 外围增强、下游消费和事件协作降级时,核心执行 isolation truth 仍必须有清晰成立 / 等待 / 失败口径;不得靠伪造成功维持“可用”。 |
| 这个仓必须满足哪些安全要求? | 未授权宿主直跑、边界静默放宽、未授权外联、cleanup 先删证据、托管外孤儿继续运行都必须是零容忍结果。 |
| 这个仓必须满足哪些审计 / 可追溯要求? | 受理 / 拒绝、边界建立 / 拒绝、policy 裁定、结果交接、capture-failure、deny / kill / timeout / replay / cleanup / redline 都必须可回链。 |
| 这个仓必须满足哪些幂等 / 一致性要求? | 同一执行语境不得形成多套正式 isolation truth;同一 policy 语境不得在不同调用方出现第二套执行语义;同一控制信号不得生成冲突的 failure / cleanup truth。 |
| 这个仓必须满足哪些可观测性要求? | 关键状态、关键变化、依赖缺失、backend 不支持、资源超限、capture-failure、cleanup guard 阻断和 redline 事件必须能被平台稳定观察。 |
| 哪些要求能量化,哪些只能给出判断口径? | 零容忍边界可直接写成 `0` 容忍值;启动时延、销毁时延、白名单判断开销、服务可用率等当前只保留为候选目标,正式口径仍写“不应成为主链不可解释瓶颈”。 |
| 每项非功能要求会由 Step 14 中的哪些验收条件承接? | Step 14 需要按能力闭环、规则边界、数据边界、接口边界和非功能验收项承接这些 NFR,尤其是零容忍安全项、关键追溯完整性和核心链路不退化项。 |

---

## 4. 当前材料诊断

### 4.1 从 Step 12 到 Step 13 的转译诊断

| 核心能力节点 | 容易误写成什么 | 当前转译方式 |
|---|---|---|
| C-SBX-1 受控执行语境识别与约束 | intake API 性能指标、request DTO 校验细节或 tracing 字段要求 | 写成受理 / 拒绝必须可解释、不得匿名执行、归责必须可追溯的能力级 NFR。 |
| C-SBX-2 隔离环境边界建立与限制施加 | Docker / gVisor / Firecracker 对比表、seccomp / AppArmor / cgroup 参数 | 写成隔离建立不应成为主链不可解释瓶颈、边界不能 silent degrade、限制触发必须可观察的能力级 NFR。 |
| C-SBX-3 给定策略内执行与 fail-closed | allowlist 刷新时间、policy engine 性能、审批 DSL 设计 | 写成 policy 缺失 / 冲突 / 不支持时必须显式等待或拒绝,且跨调用方语义一致的能力级 NFR。 |
| C-SBX-4 输出与观测材料安全捕获和分层交接 | stdout/stderr 字段、artifact 上传协议、OTel 指标名 | 写成基础 capture / handoff 不应被高级分析阻塞、材料分层不被打穿、capture-failure 可观察且可追溯的能力级 NFR。 |
| C-SBX-5 失败租约清理与安全红线保守收束 | retry 算法、reaper 任务调度、控制台调查流程 | 写成 failure / cleanup / redline 收束必须稳定、证据不先删、孤儿不脱管、重复控制不分叉的能力级 NFR。 |

### 4.2 旧指标污染诊断

| 旧指标 / 旧表达 | 有效线索 | 当前问题 | Step 13 处理 |
|---|---|---|---|
| Docker 启动 `< 1s` / gVisor 启动 `< 2s` | 说明隔离建立时延是平台关心项。 | 数字来自旧 README / 旧 `00`,当前没有正式验证来源。 | 作为候选性能目标保留,不直接写成正式硬指标。 |
| 容器销毁 `< 500ms` | 说明 teardown / cleanup 成本受关注。 | 当前仍是历史数字。 | 作为候选性能目标保留,正式口径只写“cleanup / reaper 不应成为长尾阻塞”。 |
| 白名单检查开销 `< 5ms` | 说明 policy / egress 判断开销受关注。 | 当前没有固定 policy 实现和测量口径。 | 作为候选性能目标保留,正式口径只写“高风险边界判断不应主导核心执行开销”。 |
| API 稳定性 `>= 99.9%` | 说明基础服务可用率曾被关注。 | 这是运营 SLO 候选,不是当前需求层稳定事实。 | 不升格为正式需求,后置到测试 / 运维阶段。 |
| 未授权外联拦截率 `100%`、输出回收率 `100%`、控制留痕率 `100%` | 说明安全、capture 和 audit 是零容忍主线。 | 表达来自测试 / 验收层。 | 转译为正式 NFR 的零容忍或完整性判断口径。 |

### 4.3 能力级 NFR 与全局 NFR 混层诊断

| 易混层对象 | 若混层会怎样 | 当前防线 |
|---|---|---|
| 受理、建立、capture、cleanup 的局部质量要求 | 若全写成全局口号,会失去后续落码锚点。 | 能回指 C-SBX-1~5 的全部写成能力级 NFR。 |
| 单一真相、外部正文禁入、下游失败不反写 | 若硬塞到某个能力节点,会把仓级边界写窄。 | 统一保留为全局质量约束。 |
| 高级 inspect / replay 辅助、多承载比较、趋势分析 | 若当成核心可用性前置,会压过核心闭环。 | 只作为外围增强相关 NFR 线索,不定义核心可用性。 |

### 4.4 量化陷阱诊断

最容易出错的地方有三类:

1. 直接复制旧启动时延、可用率或白名单开销数字,把历史线索伪装成已确认硬指标。
2. 把“100% 留痕 / 0 越权成功”这类零容忍要求写成测试方案细节,而不是需求层底线。
3. 为了量化而写出监控字段、benchmark 方法、DB 指标或告警规则。

当前处理口径:

- 有历史数字但缺当前验证来源的,只进入候选目标表。
- 与边界底线直接相关的零容忍结果,可以直接写成正式目标值 `0` 或完整性目标值。
- 所有指标仍停留在需求层判断口径,不写具体采集、仪表盘或测试实现。

---

## 5. 设计取舍

### 5.1 采用“能力级 NFR + 全局 NFR”双主轴,不只按六类口号展开

| 方案 | 优点 | 问题 | 决策 |
|---|---|---|---|
| 方案 A: 只按六类非功能类别罗列表述 | 看起来整齐。 | 容易变成全仓口号,看不出和 C-SBX-1~5 的绑定关系。 | 不采用。 |
| 方案 B: 先按能力级 / 全局拆分,再用六类类别审计 | 能同时保护可落码粒度和仓级质量底线。 | 结构会更长。 | 采用。 |

### 5.2 形式化保留零容忍安全结果,历史性能数字降级为候选目标

| 方案 | 内容 | 影响 | 决策 |
|---|---|---|---|
| 方案 A | 把旧性能数字和零容忍安全结果都定成正式硬指标 | 会把未经验证的历史数字和已确认边界底线混在一起。 | 不采用。 |
| 方案 B | `0` 容忍越权 / 证据先删 / 宿主直跑等直接保留为正式目标;旧时延 / 可用率数字降级为候选目标 | 更符合当前真相强度。 | 采用。 |

### 5.3 可用性不等于“永远成功”,而是“失败也必须真实且可解释”

旧材料容易把 sandbox 写成“基础设施就必须一直可用”。当前取舍是:

- 输入依赖、承载能力或 policy 来源缺失时,核心闭环可以等待、拒绝或失败。
- 但不能为了表面成功率去匿名执行、宿主直跑、放宽边界或静默忽略限制。
- 因此 Step 13 的可用性要求统一写成“真实成立 / 显式等待 / 显式失败”的判断口径。

### 5.4 可观测性只写可观察底线,不写平台配置

| 方案 | 内容 | 影响 | 决策 |
|---|---|---|---|
| 方案 A | 写 metrics 名、trace 字段、dashboard 和 alert | 会滑入实现和运维配置层。 | 不采用。 |
| 方案 B | 写关键状态、关键异常、关键依赖失效必须可被平台稳定观察 | 能被 Step 14 和后续测试 / 运维承接。 | 采用。 |

### 5.5 不新增“可维护性”正式类别

虽然 sandbox 后续实现会很关心可维护性、承载切换和排障效率,但当前取舍是:

- 仍严格使用规范固定的六类非功能类别。
- 可维护性相关关切拆入“可观测性 / 一致性 / 可用性”的判断口径。
- 具体模块化、适配器可替换性和实施复杂度后置到 01~03 与 07。

---

## 6. 结构化中间产物

### 6.1 按能力节点组织的非功能要求结论

| 核心能力节点 | 非功能类别 | 要求 | 判断口径 / 目标值 | 主要来源 |
|---|---|---|---|---|
| C-SBX-1 受控执行语境识别与约束 | 可用性 | 受控执行语境受理与责任链绑定必须在必需来源缺失时显式等待、拒绝或失败,不得以匿名或默认语境继续执行。 | 不允许出现“来源不明但继续执行”的成功结果。 | `FR-SBX-001~003`;`BR-SBX-001~005`;Step 12 输入边界 |
| C-SBX-1 受控执行语境识别与约束 | 安全 | 绕过统一入口、宿主直跑或未绑定责任链进入真实执行必须是零容忍结果。 | 未经正式受理进入真实执行的成功率 = 0。 | `BR-SBX-003`;Step 2 边界;Step 4 目标 |
| C-SBX-1 受控执行语境识别与约束 | 审计 / 可追溯 | 受理、拒绝、归责和来源引用必须可回链。 | 任一正式执行都能解释“谁发起、以什么语境发起、为何被受理或拒绝”。 | `BR-SBX-005`;Step 11 C-SBX-1 真相数据 |
| C-SBX-2 隔离环境边界建立与限制施加 | 性能 | 正式隔离环境建立与边界施加不应成为主链不可解释瓶颈。 | 正式口径:不应成为核心执行进入主线前的不可解释长尾;候选目标: Docker 启动 `<1s`、gVisor 启动 `<2s`、销毁 `<500ms`。 | `FR-SBX-004~006`;历史 README / 旧 `00` |
| C-SBX-2 隔离环境边界建立与限制施加 | 安全 | 任一必需限制无法落实时,不得静默退化或部分忽略后继续执行。 | 限制无法落实仍继续执行的成功率 = 0。 | `BR-SBX-007~010` |
| C-SBX-2 隔离环境边界建立与限制施加 | 可观测性 | 隔离建立失败、承载不支持、资源超限和边界不一致必须可被平台稳定观察。 | 必须能区分建立失败、限制触发、承载不支持和主动拒绝。 | `FR-SBX-005`;`FR-SBX-006`;Step 12 承载边界 |
| C-SBX-3 给定策略内执行与 fail-closed | 可用性 | policy / authorization 来源延迟、缺失、冲突或不支持时,执行必须显式等待或拒绝,不得 permissive fallback。 | 不允许出现“policy 不完备但继续执行”的成功结果。 | `FR-SBX-007~010`;`BR-SBX-011~017` |
| C-SBX-3 给定策略内执行与 fail-closed | 安全 | 未授权外联、越权边界扩张或高风险动作继续执行必须是零容忍结果。 | 未经正式授权继续高风险动作的成功率 = 0;历史候选目标:白名单判断额外开销 `<5ms`。 | `BR-SBX-012`;`BR-SBX-013`;`BR-SBX-017`;README |
| C-SBX-3 给定策略内执行与 fail-closed | 幂等 / 一致性 | 相同 policy 语境在 tools、runtime、member-service、runner 等调用方下必须得到同一套执行语义和失败语义。 | 不允许出现按调用方切换的第二套 policy 语义。 | `BR-SBX-014~016`;Step 12 统一消费边界 |
| C-SBX-4 输出与观测材料安全捕获和分层交接 | 性能 | 基础结果捕获与材料交接不应被高级分析、预览、归档或消费侧格式化阻塞。 | 基础 capture / handoff 应独立于高级外围增强能力成立。 | `FR-SBX-011~014`;Step 12 输出边界 |
| C-SBX-4 输出与观测材料安全捕获和分层交接 | 可用性 | 下游 artifact 或 observability 消费延迟时,sandbox 必须保留 capture truth 和显式交接状态,不得把未交接伪装为已完成。 | 可出现 pending / failed handoff,不可出现“下游缺失但静默成功”。 | `BR-SBX-021~024`;Step 11 C-SBX-4 真相数据 |
| C-SBX-4 输出与观测材料安全捕获和分层交接 | 安全 | 输出、候选材料和观测材料必须保持分层,不得被静默提升为 formal artifact truth。 | 候选材料或观测材料未经正式下游裁定直接成为 formal truth 的成功率 = 0。 | `BR-SBX-018~023` |
| C-SBX-4 输出与观测材料安全捕获和分层交接 | 审计 / 可追溯 | capture、capture-failure、结果交接和观测材料交接必须可回链到来源语境。 | 必须能解释“产生了什么、交给了谁、失败发生在哪里”。 | `BR-SBX-024`;Step 11 handoff facts |
| C-SBX-5 失败租约清理与安全红线保守收束 | 可用性 | advanced inspect 或外围调查能力不可用时,失败分类、cleanup guard 和保守回收仍必须给出显式结果。 | 可出现 blocked / pending / recovered,不可出现 silent drop。 | `FR-SBX-015~018`;Step 12 控制边界 |
| C-SBX-5 失败租约清理与安全红线保守收束 | 安全 | cleanup 先删证据、孤儿环境脱管继续运行和 redline 仅 advisory 不收束都必须是零容忍结果。 | `cleanup` 先删证据成功率 = 0;托管恢复路径之外继续运行成功率 = 0。 | `BR-SBX-026~029`;`BR-SBX-032~033` |
| C-SBX-5 失败租约清理与安全红线保守收束 | 幂等 / 一致性 | 同一控制信号重复到达时,不得形成互相矛盾的失败分类、cleanup 事实或 redline 收束结果。 | 重复 deny / timeout / kill / cleanup / reaper 信号只允许收束为单一正式控制语义。 | `BR-SBX-025`;`BR-SBX-030`;`BR-SBX-031` |
| C-SBX-5 失败租约清理与安全红线保守收束 | 可观测性 | timeout、资源超限、capture-failure、cleanup guard 阻断、orphan recovery 和 redline containment 必须可被稳定观察。 | 关键非 happy path 必须能区分“检测到”“已收束”“仍待处理”。 | `FR-SBX-015~018`;Step 12 失败 / 红线输出边界 |

### 6.2 全局非功能要求结论

| 非功能类别 | 要求 | 判断口径 / 目标值 | 主要来源 |
|---|---|---|---|
| 性能 | 外围增强能力不得成为核心受控执行 isolation 闭环的主链前置。 | 高级 replay / inspect、多承载比较、多宿主调度、趋势分析不可阻塞 C-SBX-1~5 核心闭环。 | Step 7 外围增强;`FR-SBX-E01~E06` |
| 可用性 | 下游消费、事件协作或外围展示失效时,core execution isolation truth 不得被伪造、补写或静默改写。 | 可以显式 pending / failed;不允许“因为消费失败所以补造成功 truth”。 | Step 11 truth ownership;Step 12 输出边界 |
| 安全 | 安全底线必须优先于吞吐、成功率和表面可用性。 | 任一需要通过静默放宽 resource / fs / network / process / policy 边界才能成功的路径都应视为失败。 | Step 4 目标;`BR-SBX-007~017` |
| 安全 | test-only 或弱隔离承载不得在未经正式裁定的情况下承担生产受控执行。 | 低隔离或 test-only 承载被静默提升为正式生产路径的成功率 = 0。 | Step 4 非目标;历史 README 线索 |
| 安全 | identity / work / runtime / tools / artifact / observability 等相邻仓正文不得因性能、观测或排障诉求进入 sandbox 真相。 | 外部正文越权入仓成功率 = 0。 | Step 11 禁止保存正文 |
| 审计 / 可追溯 | 从受理到 cleanup / redline 收束的关键变化必须形成可重建的引用链。 | 必须能从 formal request 回链到 identity/work refs、限制、policy、result、handoff、failure 和 control。 | Step 11 真相 / 引用;Step 12 接口边界 |
| 幂等 / 一致性 | 同一正式执行 isolation truth 在全平台只允许一种正式含义。 | tools / runtime / member-service / runner / artifact / observability 不得各自形成第二正式语义。 | Step 2 边界;Step 12 统一消费边界 |
| 可观测性 | 关键状态、关键异常、关键依赖缺失和关键红线事件必须在所有调用方语境下保持可观察。 | 不允许因调用方不同而出现观测盲区或异常分类漂移。 | Step 4 observability hooks 目标;Step 12 bus / observability 边界 |

### 6.3 非功能类别结论

| 非功能类别 | 适用性 | 说明 |
|---|---|---|
| 性能 | 强适用 | sandbox 是执行 isolation 主链基础,启动、建立、capture 和 cleanup 的时延不能失控。 |
| 可用性 | 强适用 | fail-closed 前提下仍必须给出真实、可解释的成立 / 等待 / 失败结果。 |
| 安全 | 强适用 | sandbox 是运行隔离基础,边界放宽、宿主直跑、未授权外联和证据先删都必须零容忍。 |
| 审计 / 可追溯 | 强适用 | 受理、限制、policy、capture、failure、cleanup 和 redline 都必须形成可回链真相。 |
| 幂等 / 一致性 | 适用 | 多调用方、多承载、多控制信号下必须保持单一正式语义。 |
| 可观测性 | 强适用 | 关键状态、依赖失效、资源超限、cleanup guard 和 redline 必须被稳定观察。 |

### 6.4 非功能要求结论

| 非功能类别 | 要求 | 判断口径 / 目标值 |
|---|---|---|
| 性能 | 正式隔离建立、policy 判断、基础 capture 和 cleanup / reaper 不应成为主链不可解释瓶颈。 | 正式口径:核心闭环不出现不可解释长尾阻塞;候选目标见 §6.5。 |
| 性能 | 外围增强能力不得阻塞核心受控执行 isolation 闭环。 | inspect、趋势分析、多承载比较、多宿主调度不可成为 C-SBX-1~5 前置。 |
| 可用性 | 输入依赖缺失时,核心能力必须显式等待、拒绝或失败,不得伪造成功。 | 不允许出现“缺上下文 / 缺 policy / 缺承载仍继续执行”的成功结果。 |
| 可用性 | 下游消费延迟或事件协作失效时,必须保留 capture / handoff truth 和显式状态。 | 可存在 pending / failed,不可静默宣称已交接完成。 |
| 安全 | 未授权宿主直跑、边界静默放宽、未授权外联、test-only 承载静默升格都必须是零容忍结果。 | 对应成功率 = 0。 |
| 安全 | cleanup 先删证据、托管外孤儿继续运行、redline 只提示不收束都必须是零容忍结果。 | 对应成功率 = 0。 |
| 安全 | 相邻仓正文不得因性能、观测或排障诉求进入 sandbox 真相。 | 外部正文越权入仓成功率 = 0。 |
| 审计 / 可追溯 | 受理 / 拒绝、边界建立 / 拒绝、policy 裁定、结果交接、capture-failure、deny / kill / timeout / replay / cleanup / redline 都必须可回链。 | 必须能解释“谁、何时、为何、在何边界下发生了什么”。 |
| 幂等 / 一致性 | 同一正式执行 isolation truth 只允许一种正式含义。 | 不允许调用方、承载或下游消费各自形成第二语义。 |
| 幂等 / 一致性 | 相同 policy 语境和相同控制信号不得得到互相冲突的执行、failure 或 cleanup 结论。 | 重复信号只能收束为单一正式语义。 |
| 可观测性 | 关键状态、关键异常、关键依赖缺失和关键红线事件必须可被平台稳定观察。 | 必须能区分开始 / 失败 / 收束 / 待处理等关键状态。 |
| 可观测性 | 资源超限、backend 不支持、capture-failure、cleanup guard 阻断和 orphan recovery 必须无观测盲区。 | 不允许因调用方或消费链差异出现异常盲区。 |

### 6.5 判断口径 / 目标值结论

| 主题 | 正式判断口径 / 目标值 | 候选目标 / 当前处理 |
|---|---|---|
| 隔离建立与回收时延 | 核心执行进入与退出隔离环境不应成为主链不可解释瓶颈。 | 历史候选目标: Docker 启动 `<1s`; gVisor 启动 `<2s`; 销毁 `<500ms`; 当前不直接定为正式硬指标。 |
| 高风险边界判定开销 | policy / authorization / egress 边界判断不应主导核心执行开销。 | 历史候选目标:白名单检查额外开销 `<5ms`; 当前不直接定为正式硬指标。 |
| 宿主直跑 / 匿名执行 / 边界静默放宽 | 这些都必须是零容忍结果。 | 对应成功率 = 0。 |
| 未授权外联 / 越权边界扩张 | 必须是零容忍结果。 | 对应成功率 = 0。 |
| 证据先删 / 候选材料静默提升 / 孤儿脱管 | 必须是零容忍结果。 | 对应成功率 = 0。 |
| 关键变化追溯完整性 | 关键 accept / reject / establish / policy / handoff / failure / control / redline 不得出现追溯盲点。 | 正式口径:关键变化追溯缺口 = 0;物理审计实现后续由测试 / 运维验证。 |
| 服务可用率与事件输出时延 | 当前只保留为后续运营 / 测试目标候选。 | 历史候选目标:`API 稳定性 >= 99.9%`;后续再决定是否升级为正式运营 SLO。 |

### 6.6 非功能要求与能力节点 / 全仓目标映射结论

| 非功能主题 | 主要来源能力节点 / 全仓目标 | 关键功能 / 规则 / 边界支撑 |
|---|---|---|
| 正式受理不可匿名、不可绕过 | C-SBX-1;Step 4 execution environment identity 目标 | `FR-SBX-001~003`;`BR-SBX-001~005`;Step 12 输入边界 |
| 隔离建立不退化、限制不可静默忽略 | C-SBX-2;Step 4 resource / fs / network / process boundary 目标 | `FR-SBX-004~006`;`BR-SBX-006~010`;Step 11 C-SBX-2 truth |
| policy fail-closed 与跨调用方一致性 | C-SBX-3;Step 4 launch policy 目标 | `FR-SBX-007~010`;`BR-SBX-011~017`;Step 12 policy 输入边界 |
| capture / handoff 完整性与材料分层 | C-SBX-4;Step 4 capture / observability hooks 目标 | `FR-SBX-011~014`;`BR-SBX-018~024`;Step 11 C-SBX-4 truth |
| failure / cleanup / redline 收束稳定性 | C-SBX-5;Step 4 failure / cleanup / security redlines 目标 | `FR-SBX-015~018`;`BR-SBX-025~033`;Step 12 failure / control 输出边界 |
| 单一 execution isolation truth | 全仓目标;Step 2 仓边界 | Step 11 truth ownership;Step 12 统一消费边界 |
| 外部正文禁入与安全底线优先 | 全仓目标;Step 4 非目标与安全红线目标 | Step 11 禁止保存正文;Step 10 边界规则 |
| 关键状态 / 异常可观察 | 全仓目标;Step 4 observability hooks 目标 | Step 12 `L0-bus` / `L4-observability` 边界;相关 `BR-SBX` 审计约束 |

### 6.7 非功能停审结论

| 检查项 | 结论 |
|---|---|
| 已按六类非功能类别检查适用性 | pass |
| 每条正式 NFR 都能回指能力节点或全仓目标 | pass |
| “要求”列未退化为空洞口号 | pass |
| “判断口径 / 目标值”列未留空 | pass |
| 历史数字未被无来源地升格为正式硬指标 | pass |
| 未写监控平台、日志字段、缓存、数据库优化、加密或测试方案 | pass |

---

## 7. 回填草稿

以下内容供 Step 17 重建正式 `00-需求文档.md` 时回填到 §13。正式文档可摘录本文件 §6.3~§6.6 的表格,不重复扩写 Step 诊断和设计取舍。

```md
## 13. 非功能需求

> 校准来源:
> - `design-calibration/00_req_step_13_non_functional_requirements.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“结构化中间产物”和“非功能要求与能力节点 / 全仓目标映射结论”小节,了解本章如何从核心能力、规则、数据和接口边界收束质量要求。

本文采用 `design-calibration/00_req_step_13_non_functional_requirements.md` §6 的非功能需求结论。`L4-sandbox` 的非功能要求按性能、可用性、安全、审计 / 可追溯、幂等 / 一致性、可观测性六类展开,同时区分能力级质量约束与全局质量约束。

当前正式口径中,零容忍边界可直接写为正式目标值,例如未授权宿主直跑、边界静默放宽、未授权外联、cleanup 先删证据、外部正文越权入仓等成功率必须为 `0`。旧 README 与旧正式文档中的启动时延、销毁时延、白名单检查开销和服务可用率数字仅作为后续架构 / 测试 / 运维阶段的候选目标,不在当前需求层直接定为正式硬指标。
```

---

## 8. 自检与停审

| 自检项 | 结果 | 说明 |
|---|---|---|
| 是否按六类非功能类别逐项检查 | yes | 性能、可用性、安全、审计 / 可追溯、幂等 / 一致性、可观测性均已覆盖。 |
| 是否区分了能力级 NFR 与全局 NFR | yes | 能回指 C-SBX-1~5 的已挂能力节点,仓级边界已保留为全局质量约束。 |
| 是否为每条要求给出判断口径或目标值 | yes | 零容忍边界给出 `0` 目标值,历史数字只保留为候选目标。 |
| 是否泄漏实现方案、运维配置或测试方案 | no | 已裁剪监控配置、日志字段、缓存、DB 优化、重试算法、测试用例等内容。 |
| 是否发现新的上游 blocker | no | 当前无新增 blocker;既有 downstream 文档缺口仍不阻塞 `00` Step 13。 |
| 是否允许进入 Step 14 | yes_after_user_review | 本 Step 已完成,等待用户确认后进入 Step 14 `验收标准`。 |

停审结论:

```text
Step 13 `非功能需求` 已按需求 SOP、书写规范、Step 7 能力闭环、Step 10 规则边界、Step 11 数据归属和 Step 12 接口依赖完成重建;
当前 gate_status = pass_wait_review;
未修改正式 `projects/L4-sandbox/00-需求文档.md`;
next_allowed_action = 等待用户确认后进入 Step 14 `验收标准`;
当前不需要提交 commit。
```
