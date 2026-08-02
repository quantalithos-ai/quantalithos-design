# Step 12. 横切关注点

> 对应 SOP: `standards/document/架构设计讨论流程_SOP.md` Step 12
> 回填章节: `01-架构设计.md` §13 横切关注点
> 生成日期: 2026-07-07
> 状态: 已完成,等待用户审查

---

## 1. Step 开工确认

| 检查项 | 结论 |
|---|---|
| 项目级台账是否允许进入 Step 12 | pass。用户已确认 Step 11 `备选方案与取舍`,可进入 Step 12。 |
| 是否已读取当前 flow 与前序 Step | pass。已读取 `01_architecture_calibration_flow.md`、`01_arch_step_08_data_ownership_consistency.md`、`01_arch_step_09_interactions_communication.md`、`01_arch_step_10_technology_choices.md` 和 `01_arch_step_11_alternatives_tradeoffs.md`。 |
| 是否已读取架构 SOP Step 12 与书写规范 §4.13 | pass。已读取横切类别、横切约束、判断口径、边界适用性、按架构单元适用表、停审和跨横切审计要求。 |
| 是否已读取当前正式需求基线 | pass。已读取新版正式 `projects/L4-sandbox/00-需求文档.md`,重点校验 §13 非功能、§14 验收和 §15 风险。 |
| 是否已参考 L1 粒度 | pass。已参考 `projects/L1-artifact/design-calibration/01_arch_step_12_cross_cutting_concerns.md` 和 `projects/L1-governance/design-calibration/01_arch_step_12_cross_cutting_concerns.md` 的主线约束、单元适用性和停审审计组织方式,不复制其结论。 |
| 是否已读取旧材料 | pass。旧 README 和旧 `01-架构设计.md` §11 仅作为 historical material / 差异审计输入。 |
| 是否允许改正式 `01-架构设计.md` | no。正式 `01` 只能在 Step 16 装配时重建。 |
| 是否允许提前创建后续 Step 文件 | no。本步只创建 / 更新 `01_arch_step_12_cross_cutting_concerns.md` 并同步 flow / 台账。 |

---

## 2. 本步目标

明确 `L4-sandbox` 中已经上升为长期横切主线约束的安全边界、审计与可追溯、可观测性、韧性 / 恢复能力、性能 / 容量约束、配置与变更控制要求,并说明它们分别作用于哪些边界、交互、数据关系和承载结构。

本步不写安全规范手册、监控告警配置、日志字段清单、trace / metric 后端、密钥存放脚本、性能压测脚本、恢复操作手册、配置文件格式、数据库、消息、对象存储、OTel、secrets、GRC、Docker/gVisor/Firecracker 配置、seccomp / AppArmor profile、API、event、DTO、schema、部署参数、worker、测试用例或代码对象。

---

## 3. 本步输入

| 输入 | 状态 | 用途 |
|---|---|---|
| `01_arch_step_02_goals_constraints.md` | 已完成并经用户确认 | 提供受控执行隔离事实、coherent boundary、fail-closed、capture / handoff、cleanup / redline 和统一语义目标。 |
| `01_arch_step_03_responsibility_boundary.md` | 已完成并经用户确认 | 提供做 / 不做、易混淆职责、宿主直跑、policy truth、artifact truth、observability truth 和 cleanup / redline 红线。 |
| `01_arch_step_07_dependency_direction.md` | 已完成并经用户确认 | 提供核心语义、编排承接、外部接缝、本地影子 / 派生辅助、技术承载和依赖裁剪口径。 |
| `01_arch_step_08_data_ownership_consistency.md` | 已完成并经用户确认 | 提供 execution isolation truth、外部摘要 / 引用、禁止正文、一致性和失败处理口径。 |
| `01_arch_step_09_interactions_communication.md` | 已完成并经用户确认 | 提供同步 / 异步 / 后台通信方式、正式边界、依赖失效降级和失败语义。 |
| `01_arch_step_10_technology_choices.md` | 已完成并经用户确认 | 提供正式承接边界、backend 抽象承载、policy fail-closed、capture / handoff、cleanup / reaper、redline、幂等追溯和只读派生机制。 |
| `01_arch_step_11_alternatives_tradeoffs.md` | 已完成并经用户确认 | 提供当前主线方案、路径级取舍和不采用方案。 |
| `projects/L4-sandbox/00-需求文档.md` §13 / §14 / §15 | 当前正式需求基线 | 提供需求层 NFR、验收否决项、风险与待确认事项。 |
| 旧 `projects/L4-sandbox/README.md` | historical material | 诊断旧 seccomp / AppArmor、cap drop、只读挂载、网络 drop all 和旧性能指标是否污染本步。 |
| 旧 `projects/L4-sandbox/01-架构设计.md` §11 | historical material | 诊断旧 timeout、backend fallback、日志 / 指标名、audit enable、allowlist lookup timeout、旧性能预算和配置项是否可继承。 |

---

## 4. Step 内计划

| 计划项 | 状态 | 可审查产物 |
|---|---|---|
| 读取项目台账、架构 flow、Step 8 / 9 / 10 / 11、SOP Step 12 和书写规范 §4.13 | done | 本文件 §1、§3 |
| 读取正式 00 NFR / 验收 / 风险、旧 README / 旧 `01` 横切段和 L1 同类 Step 12 示例 | done | 本文件 §3、§6 |
| 回答安全、可观测、韧性、性能、配置、审计和不适用横切项问题 | done | 本文件 §5 |
| 输出横切关注点结论、约束表、主线映射表、不适用项、按架构单元适用表、停审和跨横切审计 | done | 本文件 §9 |
| 写出 Step 16 可回填草稿 | done | 本文件 §10 |
| 完成 Step 12 自检并更新 flow / 项目台账 | done | 本文件 §12;`01_architecture_calibration_flow.md`;`project_execution_ledger.md` |

---

## 5. SOP 问题回答

### 5.1 安全边界如何处理?

`L4-sandbox` 的安全边界不是单个后端 profile 或某组容器参数,而是长期作用于正式受理、执行环境身份、隔离边界、policy 执行、capture / handoff、cleanup / reaper 和 redline containment 的主线约束。真实执行只能经正式受控执行语境进入,并且必须在 execution environment identity、责任链、coherent resource / filesystem / network / process boundary 和给定 policy 裁定成立后继续。

调用方、backend、policy 来源、artifact、observability、bus、runner UI、operator 工具和派生视图都不能直接写 sandbox truth。宿主直跑、弱隔离 fallback、test-only 承载升格、未授权外联、policy permissive fallback、candidate material 静默升格、cleanup 先删证据和 redline advisory-only 均属于安全横切红线。

### 5.2 可观测性需要覆盖哪些正式对象和关键链路?

可观测性必须覆盖 execution isolation truth 是否成立、拒绝、挂起、失败、交接或收束。核心对象包括受控执行语境、execution environment identity、边界限制、policy 裁定、capture fact、candidate material、handoff fact、failure classification、control fact、lease / orphan、cleanup guard、reaper、redline containment 和 investigation handoff。

关键链路包括同步受理 / 裁定 / 查询、异步 material / failure / cleanup / redline 传播、handoff ack / failed / retryable 回送、后台执行生命周期、backend capability 摘要刷新、cleanup guard、reaper 和只读派生维护。本步要求的是状态和边界可辨识,不是日志字段、指标名、trace backend、topic、event payload 或告警阈值。

### 5.3 可用性和韧性需要守住什么底线?

核心 truth 内部失败只能明确失败、拒绝、挂起或保持原状态,不得返回伪成功。identity / work / calling context 不可解析时不得匿名执行;policy / authorization 缺失、冲突、不可解析或不支持时不得 permissive fallback;backend capability 不足或必需限制不可落实时不得降级到弱隔离、宿主直跑或 silent degrade。

下游 artifact / runtime / runner / observability / bus / investigation 消费失败不得回滚已经成立的 sandbox truth,但必须保留 pending、failed、retryable、handoff-pending、containment 或 unresolved 口径。cleanup guard 不满足时必须阻断或保守 pending;redline investigation 不闭合时必须保持 containment;重复 control / handoff / bus 信号必须幂等收束。

### 5.4 性能预算是否需要给出口径?

当前不继承旧 README / 旧 `01` 中 Docker `<1s`、gVisor `<2s`、销毁 `<500ms`、network gate `<5ms` 或 API `99.9%` 等数字作为架构硬指标。本步只给结构性性能 / 容量预算口径。

正式隔离建立、policy 判断、基础 capture 和 cleanup / reaper 不应成为核心主链不可解释瓶颈;同时高级 inspect / preview / trend、多宿主调度、后端比较、完整观测消费、下游 artifact 格式化、归档准备、报告和对账不得成为 C-SBX-1~5 核心闭环前置。复杂读取、派生、交接和容量趋势应通过后台、最终一致或只读派生扩展,不得反向塑造核心模型。

### 5.5 配置如何管理,哪些配置不应散落?

配置与变更控制必须保护 sandbox 已收稳主线。配置可以影响运行承载选择、后端启停、资源上限、网络粒度、传播节奏、派生重建、材料保留窗口、cleanup 执行节奏或降级行为,但不得改变 execution isolation truth ownership、正式入口、coherent boundary、policy fail-closed、外部正文禁止入仓、capture / handoff 分层、同步 / 异步 / 后台边界、cleanup guard、redline containment、依赖裁剪或审计追溯要求。

影响高风险执行、后端能力、网络 / 文件系统 / 进程边界、policy 来源、cleanup 放行、redline 解除、fallback 选择和材料保留的配置变化必须可审查、可追溯、可解释。具体配置 key、文件格式、环境变量、密钥存储、默认值、灰度和回滚脚本留到后续配置设计或实施阶段。

### 5.6 审计与可追溯性如何被正式保证?

`L4-sandbox` 必须能解释一次受控执行是谁发起、以什么 identity / work / runner / tool / runtime 语境发起、采用什么边界、依据什么 policy / authorization、如何裁定、执行产生了什么、交给了谁、失败发生在哪里、控制动作为何发生、cleanup 为什么放行或阻断、redline 如何收束。

sandbox 拥有 accept / reject / establish / policy / capture / handoff / failure / control / cleanup / reaper / redline 的追溯语义和 backref,但不拥有 observability 物理 ledger、trace store、metric store、artifact evidence body、runtime recover body、investigation case lifecycle 或 operator UI 状态。观测和事件可以消费 sandbox material,但不能替代 sandbox truth / material 状态承载。

### 5.7 哪些横切项与本仓无关,不应机械照抄模板?

本章不纳入 identity 凭据生命周期、member host lifecycle、tool semantic result normalization、runtime recover、agent loop、work backlog SLA、artifact retention policy、observability 物理存储、archive package 恢复手册、runner UI 体验、container image supply chain 或具体 security profile 细则。这些事项可能重要,但主体职责不属于 `L4-sandbox`;本仓只保留与受控执行隔离事实、边界落实、policy 执行、材料捕获、失败清理、安全红线、追溯和配置不可越界有关的横切约束。

### 5.8 每个架构单元适用哪些横切约束?

`Sandbox 核心语义角色` 必须同时承受安全边界、强一致、审计追溯、幂等一致性和配置不可越界约束。`Sandbox 编排 / 承接角色` 必须承受正式入口、同步裁定、外部引用可解析性、失败不伪成功、handoff 状态和可观测性约束。`外部能力接缝角色` 必须承受正文不入仓、policy truth 不迁移、backend 不反写边界和下游不反写 truth 约束。`本地影子 / 派生辅助角色` 必须承受只读派生、stale / rebuilding / failed 可见和不得反写约束。`技术承载角色` 必须承受产品不定义业务语义、配置不可越界、性能预算和承载失败不伪成功约束。

---

## 6. 当前材料问题诊断

| 旧架构内容 | 问题 | 本步处理 |
|---|---|---|
| 旧 README 写 seccomp、AppArmor、cap drop、只读挂载、drop all 网络 | 这些是重要安全手段候选,但属于后续后端 / 配置 / 测试闭口,不是本章架构横切结论。 | 本步只固定边界不可越过、限制不可 silent degrade 和 policy fail-closed。 |
| 旧 `01` 写 backend fallback 可选 | fallback 若未证明同等边界可落实,会破坏安全和一致性。 | 改为可用性不得越过 coherent boundary 和 fail-closed;fallback 不作为当前横切策略。 |
| 旧 `01` 写日志、指标、trace 名称 | 滑入观测实现,且事件 / 观测容易被误当 truth。 | 本步只定义必须可见的对象、链路和状态。 |
| 旧 `01` 写 backend enable/disable、default limits、allowlist lookup timeout、audit enable/disable | 配置项提前定稿,且可能允许配置暗改边界、policy 和审计。 | 本步只固定配置不得越界和高风险变更可追溯。 |
| 旧 `01` 写 Docker / gVisor / network gate 性能预算 | 缺当前负载模型和验证依据。 | 保留为候选目标,不作为架构硬指标。 |
| 旧 `01` 写 audit emitter 不阻塞主路径 | 若理解为观测失败可忽略,会破坏追溯要求。 | 改为观测消费不回滚 truth,但 material 与 handoff failed / retryable 必须保留。 |

---

## 7. 改动前后对比

| 维度 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 横切表达 | timeout、resource limits、backend fallback、日志 / 指标名、seccomp / AppArmor、配置项和旧性能数字混写。 | 只保留持续作用于 sandbox 主线的横切约束。 | 对齐架构规范 §4.13。 |
| 安全 | 具体 profile 和容器配置为主。 | 正式受理、identity、coherent boundary、policy fail-closed、capture 分层、cleanup guard 和 redline containment。 | 安全主线是边界语义成立,不是本步配置 profile。 |
| 可观测 | 日志 / 指标 / trace 实现倾向。 | 核心 truth、传播、handoff、cleanup、redline 和派生状态可辨识。 | 先定义可见对象和状态,后续再落观测设计。 |
| 韧性 | timeout、fallback、deny-by-default 等零散策略。 | 核心失败不伪成功、外部不可解析不补造、下游失败不反写、cleanup / redline 保守收束。 | 对齐 Step 8 / 9 一致性和通信口径。 |
| 性能 | 继承旧 Docker / gVisor / network gate 数字。 | 不伪量化,先固定核心链路不被外围拖重。 | 当前缺正式负载模型。 |
| 配置 | 直接列配置项。 | 配置不得改变 truth、边界、policy、handoff、cleanup、redline 或依赖裁剪。 | 防止实施阶段暗改架构。 |

---

## 8. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A: 按通用非功能模板填安全、性能、可用性、审计 | 覆盖看似完整。 | 容易写空泛口号,与 sandbox 边界无关。 | 不采用。 |
| 方案 B: 只保留持续作用于 execution isolation truth 主线的横切约束 | 与 Step 8 / 9 / 10 / 11 主线贴合,可审查。 | 后续仍需概要 / 详细 / 配置 / 测试继续落地。 | 采用。 |
| 方案 C: 把监控、告警、profile、密钥、压测、配置 key 和恢复脚本都写入本章 | 看起来可执行。 | 越过架构层,污染配置、测试和运维边界。 | 不采用。 |
| 方案 D: 横切关注点全部后移到实施阶段 | 文档更轻。 | 后续实现缺少长期边界约束,容易串仓和私补。 | 不采用。 |

### 8.1 待确认问题的方案选择

| 待确认项 | 备选方案 | 推荐方案 | 推荐理由 | 当前状态 |
|---|---|---|---|---|
| 是否继承旧性能 / 可用性数字 | A. 直接继承;B. 当前只给结构性预算,后续测试 / 验收量化 | B | 避免无来源数字成为架构硬门禁。 | 本步采用 B。 |
| 是否写具体监控字段和告警阈值 | A. 写入;B. 只定义必须可见的对象、链路和状态 | B | 架构层只约束可辨识性,不替代观测设计。 | 本步采用 B。 |
| 是否把 seccomp / AppArmor / cap drop 定为本章硬方案 | A. 是;B. 否,只固定边界不可越过和后续配置 / 测试闭口 | B | profile 细节必须随正式后端和环境边界收敛。 | 本步采用 B。 |
| 是否允许配置改变 sandbox 边界 | A. 允许;B. 不允许,配置只能在既有边界内选择运行行为 | B | truth、boundary、policy、cleanup 和 redline 不能由配置暗改。 | 本步采用 B。 |
| 是否允许观测失败被忽略 | A. 允许;B. 不回滚 truth,但必须保留 material 和 handoff failed / retryable | B | 追溯材料不能丢,观测消费也不能定义 truth。 | 本步采用 B。 |

---

## 9. 结构化中间产物

### 9.1 横切关注点结论

| 结论类型 | 结论 |
|---|---|
| 横切类别结论 | 当前进入主线的横切关注点是安全边界、审计与可追溯、可观测性、韧性 / 恢复能力、性能 / 容量约束、配置与变更控制。 |
| 横切约束结论 | 这些约束只作用于 execution isolation truth、正式受理、coherent boundary、policy fail-closed、capture / handoff、failure / control、cleanup / reaper、redline、派生辅助和配置变更,不替相邻仓定义主体横切要求。 |
| 判断口径结论 | 不能量化时必须给出 rejected、pending、unresolved、stale、failed、retryable、handoff-pending、containment 或保持原状态等可审查口径,不得写抽象口号。 |
| 后续承接结论 | 概要、详细、配置、测试、验收和实施计划必须继承这些横切边界,但具体 schema、port、event、metric、threshold、config key、profile 和测试脚本后续闭口。 |

### 9.2 横切关注点约束表

| 横切关注点 | 作用范围 | 约束要求 | 保护目标 | 说明 |
|---|---|---|---|---|
| 安全边界:正式受控执行入口强制生效 | 受控执行请求、execution environment identity、责任链、同步入口、调用方接缝 | 真实执行必须先经过正式受理和归责裁定,不得由调用方、UI、SDK、脚本、backend 或测试路径绕过。 | 防止宿主直跑、匿名执行、旁路执行和第二套 sandbox 入口。 | 该要求横切职责、依赖、数据和通信,不是单个接口鉴权规则。 |
| 安全边界:coherent boundary 不可 silent degrade | resource、filesystem、network、process、workspace boundary、backend capability 摘要 | 任一必需限制不可落实、不可验证或不被后端支持时,必须拒绝、等待或保守失败。 | 保护正式隔离环境边界不被后端产品、配置或 fallback 反向削弱。 | 具体 profile 后移,但不可 silent degrade 是本章硬约束。 |
| 安全边界:给定 policy 执行与 fail-closed | policy / authorization 来源、网络 / 文件系统 / 进程高风险动作、policy 裁定 | policy 缺失、冲突、不可解析、不支持或越权时不得继续执行或 permissive fallback。 | 保护 policy truth 外部拥有和高风险边界扩张安全。 | sandbox 只拥有执行裁定,不拥有 allowlist / approval / capability truth。 |
| 安全边界:capture / handoff 分层不可打穿 | captured output、candidate material、observability material、artifact / runtime / runner / observability handoff | 输出、候选材料和观测材料必须分层捕获和显式交接,不得静默升级为下游 truth。 | 保护 artifact truth、tool result truth、observability store truth 和 evidence truth。 | 这是跨数据、交互和清理的边界约束。 |
| 安全边界:cleanup guard 与 redline containment 优先 | cleanup、reaper、lease / orphan、redline、investigation handoff、材料保留 | 材料未安全交接、调查未闭合或 redline 未收束时,cleanup 不得先删证据,containment 不得解除。 | 保护安全调查、审计复盘和托管内收束。 | 该要求不是 SRE 脚本,而是正式后台维护约束。 |
| 审计与可追溯:关键裁定可回链 | accept / reject、identity、boundary establish / reject、policy decision、control decision | 关键裁定必须能解释 actor / context、输入 refs、边界、policy 摘要、裁定原因和结果。 | 保护一次执行“谁、为什么、在什么边界下发生”的问责链。 | 这是 sandbox 追溯语义,不是物理日志平台。 |
| 审计与可追溯:材料和收束可回链 | capture、capture-failure、handoff、failure classification、cleanup、reaper、redline | 材料产生、交接、失败、控制、清理和 redline 收束必须能回链到同一 execution isolation truth。 | 保护非 happy path、下游争议和安全复盘能力。 | 观测消费可以失败,但本仓 material / handoff 状态不得丢。 |
| 可观测性:核心 truth 状态可辨识 | execution isolation truth、boundary、policy、capture、failure、control、cleanup、redline | 必须能区分 accepted、rejected、pending、unresolved、failed、capture-failure、blocked、contained 和 completed 等状态族。 | 保护核心闭环是否真实成立的可审查性。 | 不指定日志字段、指标名、trace backend 或告警阈值。 |
| 可观测性:传播 / handoff / 派生状态可辨识 | `L0-bus`、observability、artifact / runtime / runner handoff、本地影子、inspect / preview / trend | 必须能区分待传播、已送达、未消费、handoff-pending、failed、retryable、stale、rebuilding 和 unavailable。 | 保护最终一致、事件协作和派生辅助的可解释性。 | 下游未消费不得回滚 sandbox truth。 |
| 韧性 / 恢复能力:核心失败不伪成功 | 同步受理、身份绑定、边界裁定、policy 裁定、capture、control、cleanup guard | 核心失败只能失败、拒绝、挂起或保持原状态,不得写成半成立、默认成功或后补 truth。 | 保护 execution isolation truth 完整性。 | 该约束优先于调用方即时体验和表面可用性。 |
| 韧性 / 恢复能力:外部不可解析不补造 truth | identity / work refs、policy refs、backend capability、handoff refs、investigation refs | 外部来源缺失、过期或不可解析时只表达 unresolved、stale、pending、waiting、failed 或 rejected。 | 防止 sandbox 为继续执行而保存外部正文或伪造外部事实。 | 适用于同步裁定、异步输入和后台刷新。 |
| 韧性 / 恢复能力:外围失败不污染核心 | observability、bus、artifact / runtime / runner handoff、inspect / preview / trend、capacity analysis | 外围失败不得回滚、覆盖或补写 sandbox truth。 | 保护核心 truth 在下游降级时独立成立。 | 外围失败通过 pending / failed / retryable / stale / unavailable 表达。 |
| 韧性 / 恢复能力:重复与乱序幂等收束 | repeated execute、control signal、handoff ack、bus replay、cleanup / reaper trigger | 重复或乱序输入必须收束为同一正式含义,不得产生第二套 execution / control / cleanup truth。 | 保护跨调用方和事件协作的一致性。 | 具体幂等键和顺序机制后续详细设计收敛。 |
| 性能 / 容量约束:核心同步链路不被外围拖重 | 受理、身份、边界、policy、基础 capture、control 裁定 | inspect、preview、trend、后端比较、归档、完整观测消费、下游格式化和全量 fan-out 不得成为核心同步前置。 | 保护 C-SBX-1~5 核心闭环在规模增长下仍可成立。 | 当前不写具体数字,先固定结构性预算。 |
| 性能 / 容量约束:长时执行与清理通过后台承接 | 执行生命周期、capture 准备、handoff、lease / orphan、cleanup、reaper、redline | 长时运行、材料整理、清理回收和安全收束必须可后台 / 延后承接,不得伪同步完成。 | 保护同步入口不被长时执行和非 happy path 拖垮。 | 后台失败仍必须回写同一 truth。 |
| 配置与变更控制:配置不得越界 | 后端启停、default limits、network policy 粒度、材料保留、cleanup 节奏、audit / handoff 开关、降级策略 | 配置不得改变 truth 归属、正式入口、coherent boundary、policy fail-closed、handoff 分层、cleanup guard、redline 和依赖裁剪。 | 防止配置层暗改架构。 | 具体配置 key 和默认值后移配置设计。 |
| 配置与变更控制:高风险变更可追溯 | backend capability、resource / fs / network / process 边界、policy source、fallback、redline 解除、cleanup 放行 | 影响执行边界、安全裁定、材料保留和安全收束的变更必须可审查、可追溯、可解释。 | 保护安全责任、事故复盘和边界稳定。 | 不等同于写配置文件格式、灰度脚本或回滚手册。 |

### 9.3 主线映射小表

| 横切关注点 | 主要作用章节 / 主线 | 后续承接 |
|---|---|---|
| 安全边界 | 职责边界、系统上下文、依赖方向、数据所有权、关键交互、关键技术选型 | 概要设计、详细设计、配置设计、测试方案、验收标准 |
| 审计与可追溯 | execution identity、policy 裁定、capture / handoff、failure / control、cleanup / redline | 详细设计、测试方案、验收标准、observability 交接 |
| 可观测性 | 同步裁定、异步传播、handoff、后台维护、派生辅助 | 详细设计、测试方案、验收标准、运维报告 |
| 韧性 / 恢复能力 | 核心强一致、外部摘要最终一致、引用有效性、失败处理、cleanup guard | 详细设计、测试方案、实施计划 |
| 性能 / 容量约束 | 同步入口、后台执行生命周期、capture、handoff、inspect / preview / trend | 测试方案、验收标准、容量验证 |
| 配置与变更控制 | 后端能力、资源限制、网络策略、材料保留、cleanup / redline、降级策略 | 配置设计、详细设计、实施计划 |

### 9.4 按架构单元组织的横切约束表

| 架构单元 | 安全边界 | 可观测性 | 韧性 / 恢复能力 | 性能 / 容量约束 | 配置与变更控制 | 审计与可追溯 | 停审结果 |
|---|---|---|---|---|---|---|---|
| `Sandbox 核心语义角色` | 只接受正式收束后的受理、身份、边界、policy、capture、failure、cleanup 和 redline 判断。 | 核心 truth 状态和裁定结果必须可辨识。 | 输入不闭合时失败、拒绝、pending 或保持原状态。 | 不被派生、下游 handoff、观测消费或后端比较拖重。 | 配置不得改变 truth ownership、边界语义或 fail-closed。 | 关键裁定和状态变化必须有追溯回指。 | pass |
| `Sandbox 编排 / 承接角色` | 所有外部输入必须经正式入口、refs、summary、policy input 或 handoff 状态进入。 | accepted / rejected / pending / unresolved / failed / unavailable 必须可见。 | 外部不可解析不得补造 truth;重复 control 幂等。 | 同步只做必要裁定,长时执行和交接后置。 | 降级和传播策略不得改变同步 / 异步 / 后台边界。 | 必须记录来源、依据、结果和交接状态。 | pass |
| `外部能力接缝角色` | 调用方、policy 来源、backend、artifact、observability、bus、investigation 不得直接写核心。 | 外部引用、快照、summary、handoff 状态的缺失 / 过期可见。 | 缺失时 stale / unresolved / waiting / failed,不复制正文。 | 外部解析、能力刷新和下游确认不得阻塞核心 truth。 | adapter、source 和 policy 配置不得变成 truth 规则。 | 外部材料只作为引用、摘要或回指。 | pass |
| `本地影子 / 派生辅助角色` | backend capability、workspace source、inspect / preview / trend 只能只读派生。 | stale / rebuilding / failed / unavailable 必须可见。 | 派生失败不回滚核心。 | 复杂查询、趋势和对账通过后台 / 派生扩展。 | 派生重建配置不得改变核心模型。 | 派生材料必须回指正式 sandbox truth。 | pass |
| `技术承载角色` | 后端产品、存储、事件、观测、配置和 profile 不定义业务 truth。 | 技术失败必须暴露为架构允许状态。 | 承载失败不得补写、覆盖或伪造语义。 | 产品和容量策略服从核心 / 外围分离。 | 配置不得绕过边界和依赖裁剪。 | 承载材料不替代 sandbox audit backref。 | pass |

### 9.5 不进入本章的横切项

| 横切项 | 不进入本章原因 | 正确归属 |
|---|---|---|
| Identity 认证凭据、GlobalMember 生命周期、role / capability identity 管理 | sandbox 只消费身份引用和摘要,不拥有身份 truth。 | `L1-identity` / `L0-core` / 安全设计 |
| ToolDefinition、ToolPolicy、ToolInvocationResult 归一化和工具语义审计 | sandbox 不拥有 tools semantic execution。 | `L2-tools` |
| Runtime agent loop、ExecutionInstance recover、checkpoint / recover 和 runtime retry | sandbox 只拥有隔离层 failure / control fact。 | `L2-runtime` |
| MemberExecutionHost、SandboxBinding 装配、host health 和 member lifecycle | sandbox 不拥有宿主装配 truth。 | `L2-member-service` |
| Artifact retention、baseline、formal evidence 和归档正文保留 | sandbox 只交接候选材料和 refs。 | `L1-artifact` / archive |
| Observability 物理日志存储、指标平台、trace store 和告警规则 | sandbox 只拥有 material fact 和 handoff fact。 | `L4-observability` |
| Container image supply chain、image build provenance 和镜像漏洞治理 | sandbox 消费承载环境,不拥有镜像供应链 truth。 | `L2-member-images` / supply chain 设计 |
| Runner UI、operator console、输出预览体验和可访问性 | sandbox 可提供读取 / 派生材料,不拥有产品界面状态。 | `L5-runner` / console / UI 设计 |
| seccomp / AppArmor / cap drop / mount profile 具体清单 | 属于后续配置、后端和测试闭口,不是本章横切架构结论。 | `04-配置设计.md`;`05-测试方案.md`;`07-实施计划.md` |

### 9.6 横切关注点停审记录

| 横切关注点 | 是否适用于本仓主线 | 是否说明作用范围 | 是否说明保护目标 | 是否未下沉实现细节 | 停审结果 |
|---|---|---|---|---|---|
| 安全边界 | pass | pass | pass | pass | pass |
| 审计与可追溯 | pass | pass | pass | pass | pass |
| 可观测性 | pass | pass | pass | pass | pass |
| 韧性 / 恢复能力 | pass | pass | pass | pass | pass |
| 性能 / 容量约束 | pass | pass | pass | pass | pass |
| 配置与变更控制 | pass | pass | pass | pass | pass |

### 9.7 跨横切约束审计表

| 审计项 | 结论 | 说明 |
|---|---|---|
| 是否存在模板化空话 | pass | 每项横切约束均落到 execution isolation truth、边界、policy、capture / handoff、cleanup / redline、派生或配置边界。 |
| 是否存在适用性缺失 | pass | 已按五类架构单元判断约束适用性,并列出不进入本章的横切项。 |
| 是否存在审计追溯缺口 | pass | accept / reject / establish / policy / capture / handoff / failure / control / cleanup / redline 均要求回链。 |
| 是否存在配置边界遗漏 | pass | 配置不得改变 truth 归属、正式入口、coherent boundary、policy fail-closed、handoff、cleanup guard、redline 和依赖裁剪。 |
| 是否与 Step 8 数据语义冲突 | pass | 核心 truth 强一致、外部摘要 / 投影最终一致、外部正文 forbidden、handoff failed / retryable 口径保持一致。 |
| 是否与 Step 9 通信语义冲突 | pass | 同步裁定、异步传播、后台执行 / cleanup / reaper / redline 的分离保持一致。 |
| 是否与 Step 10 技术机制冲突 | pass | 未把 Docker/gVisor、RPC/SDK、outbox、seccomp/AppArmor、OTel 或 P95 升级为硬选型。 |
| 是否与 Step 11 方案取舍冲突 | pass | 继续拒绝调用方自管、后端产品主导、协议主导、audit event 主导、backend fallback 优先和 cleanup 运维私有路径。 |
| 是否误写具体实现 | pass | 未写 API、event、DTO、schema、metric、threshold、config key、profile、测试脚本或部署参数。 |

### 9.8 横切影响说明

`L4-sandbox` 的横切关注点不是通用非功能清单,而是长期压在 execution isolation truth 主线之上的结构约束。安全、审计、可观测、韧性、性能和配置都服务于同一条主线:真实执行必须可归责、边界必须可裁定、policy 必须 fail-closed、材料必须分层交接、失败和清理必须保守收束、红线必须 containment。具体监控、告警、profile、密钥、压测、配置 key、恢复脚本、后端产品和运维流程只有在不改变这些横切约束的前提下,才能在后续设计和实施阶段继续细化。

---

## 10. 回填草稿

正式 `01-架构设计.md` 后续整理时:

- §13 “横切关注点”直接摘录并整理本文件 §9.1、§9.2、§9.3、§9.4、§9.5、§9.7 和 §9.8。
- 不在本 Step 重复粘贴完整正式章节,后续 Step 16 从结构化中间产物摘录生成正式文档。

---

## 11. 待确认事项

### 11.1 待确认项处理建议

| 待确认项 | 备选方案 | 推荐方案 | 推荐理由 | 当前状态 |
|---|---|---|---|---|
| 是否把具体监控字段和告警阈值写入架构横切章节 | A. 写入;B. 不写,只定义可观测对象、链路和状态 | B | 架构层应定义可辨识状态,字段和阈值属于后续观测设计。 | 本步采用 B。 |
| 是否把具体配置项和配置文件写入本章 | A. 写入;B. 不写,只定义配置不可越界原则 | B | 配置设计有独立阶段,本章只固定配置不得绕过架构主线。 | 本步采用 B。 |
| 是否把 seccomp / AppArmor / cap drop 定为当前横切硬方案 | A. 是;B. 否,只保留边界不可越过和后续配置 / 测试闭口 | B | profile 细节必须随正式后端和配置边界收敛。 | 本步采用 B。 |
| 是否现在量化性能 / 可用性目标 | A. 现在量化;B. 当前只给结构性预算口径,后续测试 / 验收量化 | B | 当前缺正式负载模型,但不能不约束核心链路不被外围拖重。 | 本步采用 B。 |
| 是否允许配置改变 sandbox boundary / policy / cleanup / redline | A. 允许;B. 不允许,配置只能在已收稳架构边界内选择运行行为 | B | truth、boundary、policy、handoff、cleanup 和 redline 不能由配置暗改。 | 本步采用 B。 |

### 11.2 本 Step 未确认事项

本步不新增阻塞 Step 13 的待确认事项。具体监控字段、告警阈值、密钥处理、配置 key、压测指标、恢复脚本、seccomp / AppArmor / cap drop profile、后端产品、observability 存储、event / topic / outbox、artifact handoff ack 协议和部署参数留到配置设计、详细设计、测试方案、验收标准和实施计划继续收敛。

---

## 12. 自检与进入下一步条件

| 自检项 | 结论 |
|---|---|
| 已明确哪些横切关注点已经上升为长期作用于主线的正式要求 | pass。安全边界、审计与可追溯、可观测性、韧性 / 恢复能力、性能 / 容量约束、配置与变更控制均已收敛。 |
| 已说明每项横切关注点作用于哪些结构面 | pass。见 §9.2 和 §9.3。 |
| 已写清每项横切关注点的约束要求 | pass。见 §9.2。 |
| 已明确每项横切关注点最终在保护什么 | pass。见 §9.2。 |
| 已按架构单元组织横切约束并停审 | pass。见 §9.4 和 §9.6。 |
| 已明确哪些横切项不属于本仓主体职责 | pass。见 §9.5。 |
| 已审计模板化空话、适用性缺失、审计追溯缺口、配置边界遗漏和 Step 8 / 9 冲突 | pass。见 §9.7。 |
| 未滑入安全手册、监控配置、告警阈值、profile、配置 key、压测脚本、恢复手册、产品选型或实现机制 | pass。 |
| 是否允许进入 Step 13 | 本步完成后需等待用户审查确认;确认后才能进入 Step 13 `演进路线`。 |
