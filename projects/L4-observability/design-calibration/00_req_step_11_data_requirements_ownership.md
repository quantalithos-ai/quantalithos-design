# Step 11 数据需求与数据归属

## 0. Step 开工确认

| 项目 | 记录 |
|---|---|
| Step | Step 11 数据需求与数据归属 |
| 输出文件 | `design-calibration/00_req_step_11_data_requirements_ownership.md` |
| 当前模式 | full-restart |
| 当前轮次 | 审查后补强 |
| 已读取项目台账 | yes |
| 已读取需求 flow | yes |
| 已读取前序 Step | yes, 已读取 `00_req_step_02_position_boundary.md`、`00_req_step_07_core_capability_loop.md`、补强后的 `00_req_step_09_functional_requirements.md` 与 `00_req_step_10_rules_boundary_constraints.md` |
| 已做一致性反查 | yes, 已回看 `00_req_step_06_consumers_dependencies.md`,仅用于检查数据归属是否退化为依赖表、产品栈或相邻仓 ownership 清单,不把 Step 06 当作本步前置 truth |
| 已读取 SOP / 书写规范 | yes, 需求 SOP Step 11 与需求书写规范 4.11 |
| 已读取上游粒度参考 | yes, `L1-governance` 与 `L1-artifact` 的 Step 11 中间产物 |
| 已读取历史材料 | yes, 旧 `README.md`、旧 `00-需求文档.md` 与旧 implementation ledger / boundaries 仅作为 historical material |
| 用户确认 | yes, 用户确认进入 Step 11 补强 |
| 进入条件 | pass |

## 1. Step 内计划

| 模块 | 状态 | 产物 | gate_status | next_allowed_action |
|---|---|---|---|---|
| 开工确认 / 必读文档:先思考 | done | Step 11 目标、输入、禁写范围和数据识别风险诊断 | pass | 进入必读文档再写入。 |
| 开工确认 / 必读文档:再写入 | done | 必读文档摘要、输入索引和执行约束 | pass | 进入数据收敛先思考。 |
| 数据收敛:先思考 | done | 数据候选分层、裁剪项、能力节点挂载和四类分类策略诊断 | pass | 进入数据收敛再写入。 |
| 数据收敛:再写入 | done | 按能力节点组织的数据归属表、类型结论、映射结论和边界外裁剪写入 | pass | 进入当前文档问题诊断。 |
| 当前文档问题诊断 | done | 历史材料、旧 Step 11 和当前能力输入的差异诊断 | pass | 进入改动前后对比。 |
| 改动前后对比 | done | 补强前后结构、粒度和数据口径差异表 | pass | 进入设计取舍。 |
| 设计取舍 | done | 四类数据分类、旧对象词改写、禁止正文范围和快照 / 引用边界取舍 | pass | 进入结构化中间产物。 |
| 结构化中间产物 | done | 数据归属表、数据类型结论、生命周期结论、功能 / 规则映射、停审和裁剪结论 | pass | 进入回填草稿。 |
| 回填草稿 | done | 正式第 11 章候选草稿 | pass | 进入自检与停审。 |
| 自检与停审 | done | 自检表 / 是否允许进入下一补强 step | pass | wait_user_or_start_step_12_strengthening_after_confirmation |

## 2. 当前停审点

| 项 | 状态 | 说明 |
|---|---|---|
| Step 11 开工 | pass | 已确认当前只允许推进 `00` 的 Step 11 审查后补强。 |
| 必读文档思考 | pass | 已明确 Step 11 只写需求层数据归属,不写字段、表结构、索引、事务、缓存、outbox、projection、rebuild、repo / service / port、API、DTO、事件 schema、配置、NFR、验收或实施组织。 |
| 必读文档摘要写入 | pass | 已写入 Step 02 / 07 / 09 / 10、SOP、书写规范、Step 06 反查和历史材料对本步的约束。 |
| 数据收敛思考 | pass | 已完成数据候选、裁剪项、能力节点挂载和四类分类策略诊断。 |
| 数据表写入 | pass | 已形成 `DO-OBS-001~034` 的能力级数据归属表。 |
| 跨能力数据审计 | pass | 已完成数据类型、功能映射、规则映射和边界外数据裁剪审计。 |
| 当前文档问题诊断 | pass | 已诊断旧 README、旧 `00` 和当前较短旧 Step 11 的失焦点。 |
| 结构化中间产物 | pass | 已整理正式回填所需的最小数据单元。 |
| 回填草稿 | pass | 已形成正式第 11 章候选草稿。 |
| 自检与停审 | pass | Step 11 审查后补强已完成。 |
| 正式文档写入 | blocked | 正式 `00-需求文档.md` 仍等待 Step 17 统一装配。 |
| 当前下一步 | `Step 12 接口与依赖（补强）:开工确认 / 必读文档:先思考` |

当前不得直接写正式 `00-需求文档.md`，也不得自动进入 Step 12。下一步只允许在用户确认后进入 `Step 12 接口与依赖（补强）`。

## 3. 开工确认 / 必读文档:先思考

### 3.1 本步目标诊断

Step 11 的任务是把 Step 02 的仓边界、Step 07 的五个核心能力、Step 09 的功能需求和 Step 10 的业务规则,转译成需求层数据归属结论。对 `L4-observability` 来说,这里的数据归属不是对象模型、字段表、数据库设计或接口 payload,而是回答四类问题:哪些数据由本仓拥有正式 truth,哪些只是快照,哪些只是引用,以及哪些正文明确不得进入本仓。

这一章最容易犯五类错。第一类是把 `ObservationEnvelope`、`MetricPoint`、`AuditHashLink`、`ReportHandoffRecord`、`RetentionMarker` 等对象词直接当成需求层数据归属结构。第二类是把 log / metric / trace / audit 的字段、schema version、index、TTL 或表结构写进本章。第三类是把外部正文、业务 payload、provider response、archive package 或 final verdict 错写为本仓 truth。第四类是只写“本仓有什么”,不写“本仓绝不能有什么”。第五类是先列全仓数据清单再反推能力来源,导致数据项无法稳定回指 `FR-OBS-*` 或 `BR-OBS-*`。

### 3.2 必读文档候选

| 文档 | 必读原因 | 预计落点 |
|---|---|---|
| `standards/document/需求文档讨论流程_SOP.md` Step 11 | 固定本步目标、应问问题、输出物和进入 Step 12 的门禁。 | 本步结构、能力级数据停审和跨能力数据审计。 |
| `standards/document/需求文档书写规范.md` 4.11 | 固定数据归属表结构、四类数据类型、归属说明和生命周期口径写法。 | 数据归属表、数据类型、生命周期口径和回填草稿。 |
| `00_req_step_02_position_boundary.md` | 固定本仓只拥有 observation material、audit projection 和 read-only report handoff truth。 | 真相数据与禁止正文的边界来源。 |
| `00_req_step_07_core_capability_loop.md` | 固定 `C-OBS-1~5` 的能力节点、外围增强和边界外能力。 | 数据归属按能力节点组织。 |
| `00_req_step_09_functional_requirements.md` | 提供 `FR-OBS-001~013` 核心功能与外围增强功能。 | 数据项与功能需求映射。 |
| `00_req_step_10_rules_boundary_constraints.md` | 提供 `BR-OBS-001~026` 规则边界。 | 数据项与业务规则映射。 |
| `00_req_step_06_consumers_dependencies.md` | 只做反查,防止数据归属退化为依赖、产品或相邻仓 ownership 清单。 | 问题诊断和边界外裁剪。 |
| 旧 `00-需求文档.md` 的数据章节 | 提取旧 `DO-OBS-*` 方向线索,识别对象词、schema 倾向、产品词和验收污染。 | 当前文档问题诊断和改动前后对比。 |
| `projects/L1-governance/design-calibration/00_req_step_11_data_ownership.md` | 参考已完成项目如何把数据归属拆成真相 / 快照 / 引用 / 禁止正文四类。 | 组织方式和停审结构。 |
| `projects/L1-artifact/design-calibration/00_req_step_11_data_ownership.md` | 参考如何把主表达收束到 4.11 固定 4 列,再额外提供映射与裁剪表。 | 结构层次和回填方式。 |

### 3.3 初步关注点

- 数据归属必须优先挂到 `C-OBS-1~5`,不能先做全仓数据大表再贴能力标签。
- 每个数据项都必须先判定为真相数据、快照数据、引用数据或禁止保存正文四类之一。
- redaction、correlation、body-free evidence linkage、report handoff、retention 和 no-write truth 都必须找到数据落点,但当前只写数据项类别,不写字段、schema、索引或存储策略。
- `L0-bus`、`L1-governance`、`L1-artifact`、`L1-identity`、runtime、archive、console 和外部监控产品正文都不是本仓真相数据。
- query result、diagnostic summary、report handoff summary 只能是快照或交接事实,不能升级成业务结论、执行结论或最终验收数据。

### 3.4 本模块停审点

| 项 | 状态 | 说明 |
|---|---|---|
| 本步目标诊断 | pass | 已明确 Step 11 只收口需求层数据归属。 |
| 必读文档候选 | pass | 已固定标准、前序 Step、反查输入和粒度参考。 |
| 初步关注点 | pass | 已明确 5 类最易误写点。 |
| 正式数据表写入 | blocked | 当前尚未进入数据收敛正式写入。 |
| 正式文档写入 | blocked | 正式 `00-需求文档.md` 仍等待 Step 17。 |
| 当前下一步 | `开工确认 / 必读文档:再写入` |

## 4. 开工确认 / 必读文档:再写入

### 4.1 必读文档摘要

| 文档 | 读取结论 | 对 Step 11 的影响 |
|---|---|---|
| `需求文档讨论流程_SOP.md` Step 11 | 本步必须回答哪些数据由本仓拥有 truth、哪些只是快照或引用、哪些正文绝不能保存,并输出按能力节点组织的数据归属结论、数据类型结论、生命周期结论、映射结论和能力级停审结论。 | 后续必须先做数据候选分层,再写数据归属表,再做功能 / 规则映射和跨能力审计。 |
| `需求文档书写规范.md` 4.11 | 数据归属表固定字段为 `数据项 / 数据类型 / 归属说明 / 生命周期口径`;数据类型固定为真相数据、快照数据、引用数据、禁止保存正文。 | 正式主表达必须使用 4 列结构,不再用 `ID / 能力节点 / 支撑功能` 直接混入主表。 |
| Step 02 本仓定位与边界 | 本仓只拥有横切 observation material、audit projection 和 read-only report handoff truth,不拥有业务 truth、artifact / evidence 正文、identity truth、runtime truth、archive 正文、console UI 或外部产品配置 truth。 | 所有真相数据和禁止正文边界都必须围绕这条仓级边界展开。 |
| Step 07 核心能力闭环 | 能力节点固定为 `C-OBS-1` 安全观测材料入口、`C-OBS-2` 审计投影与证据关联、`C-OBS-3` 运行观察面安全表达、`C-OBS-4` 只读诊断与报告交接、`C-OBS-5` 留存与不反写真相边界。 | 数据归属必须按这五个节点组织,不能按产品、对象或存储后端分组。 |
| Step 09 功能需求 | 已形成 `FR-OBS-001~013` 核心功能和外围增强 / 边界外裁剪结论。 | 每条正式数据项必须支撑至少一个核心功能或明确的仓边界。 |
| Step 10 业务规则 | 已形成 `BR-OBS-001~026` 规则边界,明确 raw body 禁止、body-free 证据、只读查询 / 诊断 / 交接、留存显式变化和 no-write truth。 | 数据归属必须承接这些规则,特别是禁止正文和 no-write 防线。 |
| Step 06 使用方与依赖 | bus、source owner、治理、制品、身份、runtime、archive、console 和外部产品都是协作边界,不是本仓 truth owner。 | 当前数据不能退化为依赖对象正文或产品配置数据。 |
| 旧 `00-需求文档.md` 数据章节 | 旧 `DO-OBS-*` 方向仍有价值,但表中夹带对象列、能力列、schema 倾向和产品线索。 | 保留数据方向,改写为 4.11 固定主表达,把映射表拆到后面。 |
| `L1-governance` / `L1-artifact` Step 11 | 参考项目都把 Step 11 拆成思考层、诊断层、取舍层、结构化中间产物和停审层。 | 本步也要补足“先思考、再写入、再审计、再停审”的中间过程。 |

### 4.2 Step 11 输入索引

| 输入类型 | 已确认来源 | Step 11 使用方式 |
|---|---|---|
| 仓边界输入 | Step 02 | 固定哪些内容可以成为本仓 truth,哪些只能被排除。 |
| 能力节点输入 | Step 07 | 固定数据组织顺序和停审顺序。 |
| 功能输入 | Step 09 | 固定数据需要支撑的能力主题。 |
| 规则输入 | Step 10 | 固定禁止正文、只读、body-free、留存和 no-write 边界。 |
| 依赖反查输入 | Step 06 | 防止数据归属退化为依赖表、产品表或相邻仓 ownership 表。 |
| 历史数据线索输入 | 旧 `00` | 提取可保留的数据方向,识别对象 / schema / 产品污染。 |
| 粒度参考输入 | `L1-governance`;`L1-artifact` Step 11 | 对齐结构层次、主表达和停审结构。 |
| 用户重点边界输入 | 当前任务说明 | 保证 log / metric / trace / audit、redaction、correlation、evidence linkage、retention、report handoff 和 no-write truth 都有数据落点。 |

### 4.3 执行约束

| 约束 | 当前口径 |
|---|---|
| 数据写法 | 只写需求层数据项类别,不写对象字段、schema、索引、事务、缓存、存储产品或实现机制。 |
| 分类写法 | 每条数据项必须先落到真相数据、快照数据、引用数据或禁止保存正文之一。 |
| 编号写法 | 保留 `DO-OBS-*` 编号,但编号只表示数据归属追溯锚点,不表示表、topic、对象或实现编号。 |
| 生命周期写法 | 只写需求层存在、变化和退出方式,不写 TTL、保留期、归档策略、物理删除或重建流程。 |
| 映射写法 | 每条数据项必须能回指 `FR-OBS-*`、`BR-OBS-*` 或 Step 02 仓边界。 |
| 边界写法 | raw body、payload body、artifact / evidence body、identity body、governance body、runtime body、provider response body、archive package body、final verdict 和 signoff 只能出现在禁止正文结论中。 |
| 正式文档后置 | 当前仍只写 `design-calibration` 中间产物,正式 `00-需求文档.md` 留待 Step 17。 |

### 4.4 下一步输入

`数据收敛:先思考` 需要完成四件事:一是把数据候选分成“核心闭环 truth / 快照 / 引用 / 当前应裁剪或禁止正文”几类;二是确认 `C-OBS-1~5` 分别需要哪些数据项;三是判断哪些旧 `DO-OBS-*` 只需要改写主表达而不是改变语义方向;四是确认哪些数据项需要单独保留映射表,而不是继续混入主表达。

### 4.5 当前停审点

| 项 | 状态 | 说明 |
|---|---|---|
| 必读文档摘要 | pass | 已写入标准、Step 02 / 07 / 09 / 10、Step 06 反查和历史材料对 Step 11 的约束。 |
| 输入索引 | pass | 已明确本步数据来源和一致性反查用途。 |
| 执行约束 | pass | 已明确不写对象字段、schema、接口、NFR、验收或实现。 |
| 数据收敛思考 | pass | 已在 §5 完成数据候选诊断。 |
| 正式文档写入 | blocked | 正式 `00-需求文档.md` 仍等待 Step 17。 |
| 当前下一步 | `数据收敛:先思考` |

## 5. 数据收敛:先思考

### 5.1 收敛目标

本模块只诊断“哪些数据应该正式进入 Step 11,哪些不应该”,不直接写最终数据表。对 `L4-observability` 来说,合格的数据项必须同时满足四个条件。第一,它必须直接支撑某个核心能力节点成立。第二,它必须能回指一个或多个已收敛功能或规则。第三,它必须清楚落在真相 / 快照 / 引用 / 禁止正文四类之一。第四,它不能抢 Step 12 接口、Step 13 非功能、Step 14 验收或后续设计文档的内容。

### 5.2 数据候选分层

| 类别 | 判断标准 | 当前处理方式 |
|---|---|---|
| 真相数据 | 本仓拥有正式 truth,并对其需求层生命周期负责。 | 保留进正式数据归属表。 |
| 快照数据 | 上游拥有正式 truth,本仓仅为稳定消费保留安全摘要、目录、投影或镜像型表达。 | 保留进正式数据归属表。 |
| 引用数据 | 本仓只保存对外部对象或外部正文的引用关系,不拥有正文。 | 保留进正式数据归属表。 |
| 禁止保存正文 | 本仓在需求层明确不得拥有其正文真相的数据对象或内容类型。 | 保留进正式数据归属表。 |
| 当前应裁剪的候选 | 实际是字段、schema、index、产品后端、存储策略、接口 payload 或验收材料。 | 不进入正式数据归属表,只进入排除结论。 |

### 5.3 核心能力数据方向诊断

| 能力节点 | 需要保留的数据方向 | 原因 |
|---|---|---|
| `C-OBS-1` 安全观测材料入口 | 准入事实、安全处置语境、来源与关联语境、redaction / safety marker、来源摘要、source / bus 引用、入口禁止正文 | 没有这组数据,观测材料无法被正式接入、解释、隔离或拒绝。 |
| `C-OBS-2` 审计投影与证据关联 | 审计投影事实、body-free 证据关联事实、缺口语境、外部 evidence / artifact / governance / identity 引用、审计摘要、正文禁止 | 没有这组数据,审计投影会退化为正文副本或不可解释线索。 |
| `C-OBS-3` 运行观察面安全表达 | 安全日志 / 指标 / 追踪观察面、降级 / 不可见事实、运行摘要、运行正文禁止 | 没有这组数据,运行观察会回退为 raw 输出或被误用为执行 truth。 |
| `C-OBS-4` 只读诊断与报告交接 | 查询结果语境、诊断摘要、报告交接事实、报告交接摘要、证据真实性提示、archive / report / external audit 引用、最终结论禁止正文 | 没有这组数据,查询、诊断和交接会退化为控制面、裁决面或伪证入口。 |
| `C-OBS-5` 留存与不反写真相边界 | 留存标记事实、活动引用保护事实、重放 / 重建事实、no-write violation 记录、source truth 修复正文禁止、archive / recovery 正文禁止、重放 / 留存影响摘要 | 没有这组数据,观察材料会被越权清理、错误重建或反写 source truth。 |

### 5.4 外围增强与裁剪候选

| 候选 | 当前处理 | 理由 |
|---|---|---|
| dashboard 展示数据、管理视图数据 | 归入外围增强快照或后续候选 | 有价值,但不决定核心观察面成立。 |
| alert 规则、通知渠道、订阅记录 | 归入外围增强快照、引用或后续候选 | 提升响应效率,但不是本仓核心 truth。 |
| DORA / EBM / ISO 报表材料 | 归入外围增强快照 | 是扩展消费表达,不应挤占核心数据主链。 |
| 外部 APM / Collector / 存储 / 展示产品数据 | 归入外围增强或后续候选 | 属于产品和架构选择,不是需求主链数据。 |
| external audit / GRC 导出材料 | 归入外围增强引用或快照 | 是外部协作增强,不改变本仓 truth 边界。 |
| `trace/correlation` 细字段、`redaction status` 细字段、`evidence index` 结构 | 改写吸收到正式数据项类别 | 当前适合作为数据项语义,不适合作为字段级数据定义。 |
| real `run_id`、real evidence alias、final verdict、signoff | 归入禁止保存正文 | 属于真实执行与验收阶段,不能进入本仓正文。 |
| OTel、Prometheus、Grafana、TimescaleDB、TTL、冷存期限、hash chain 分片 | 裁剪 | 属于产品、配置、NFR 或实现层,不是需求层数据归属。 |

### 5.5 数据写法与生命周期判断

| 项 | 当前口径 |
|---|---|
| 主表达结构 | 保持 4.11 固定 4 列: `数据项 / 数据类型 / 归属说明 / 生命周期口径`。 |
| DO 编号写法 | 保留 `DO-OBS-*` 编号,并与数据项名称写在同一列。 |
| 一数据一分类 | 每条数据项只归入一个数据类型,不允许同一数据项同时被写成 truth 和 snapshot。 |
| 生命周期写法 | 使用需求层短句,例如“随正式判断显式建立、变化或终止”“不进入本仓生命周期”。 |
| 映射写法 | 功能和规则映射拆到独立表,不混入主表达。 |
| 排除数据写法 | 只写“裁剪数据 / 不进入原因 / 正确归属”,不写实现替代方案。 |

### 5.6 当前停审点

| 项 | 状态 | 说明 |
|---|---|---|
| 数据候选诊断 | pass | 已识别 truth / snapshot / ref / forbidden body 四类候选。 |
| 能力数据挂载 | pass | 已明确五个能力节点分别需要的数据方向。 |
| 改写 / 裁剪项诊断 | pass | 已剔除字段、schema、产品、相邻仓正文和真实执行材料。 |
| 数据表写入 | pass | 已在 §10 写入正式结构化结论。 |
| 当前下一步 | `数据收敛:再写入` |

## 6. 数据收敛:再写入

### 6.1 写入原则

正式数据归属表只记录本仓必须拥有、可保留、可引用或明确不得保存的数据项类别,以及对应的需求层归属说明和生命周期口径。它不记录字段、schema、索引、事务、缓存、数据库、存储产品、API 或事件。对 `L4-observability` 来说,数据归属表的首要价值不是描述“数据如何落库”,而是证明 observation material、audit projection、runtime observation、read-only diagnosis / handoff 和 retention / no-write 边界后面分别有哪些稳定数据支撑。

## 7. 当前文档问题诊断

| 输入 | 当前表现 | 诊断 | 处理口径 |
|---|---|---|---|
| 旧 README | 更强调观测平台和产品栈,包含 OTel、Prometheus、Grafana、TimescaleDB、object storage、冷存和 dashboard 方向。 | 无法直接支撑 Step 11 的需求层数据归属。 | 不沿用,只保留历史污染线索。 |
| 旧 `00-需求文档.md` 数据章节 | 已有 `DO-OBS-*` 方向线索。 | 方向有效,但主表中混入 `ID / 能力节点 / 支撑功能 / 规则` 多列表达,偏离 4.11 固定主表达。 | 保留语义方向,重写为 4 列主表达,把映射拆到后面。 |
| 当前较短旧 Step 11 | 已有真相 / 快照 / 引用 / 禁止正文和映射结论雏形。 | 粒度弱于 `L1-governance`,缺少思考层、停审层、对比层和执行约束层。 | 本轮补足 0~12 完整结构。 |
| Step 02 边界结论 | 已明确本仓 truth 范围和边界外正文。 | Step 11 若重新按产品或对象组织,会让正文边界再次松动。 | 数据始终围绕仓边界和能力节点组织。 |
| Step 09 / Step 10 结论 | 已明确功能和规则主轴。 | Step 11 若不拆出功能 / 规则映射,后续 Step 12~14 难以追溯。 | 数据主表与映射表分离。 |

## 8. 改动前后对比

| 项 | 补强前 | 补强后 | 原因 |
|---|---|---|---|
| 结构层次 | 以数据结论为主,缺少读标准、先思考、再写入和停审层。 | 增加 0~12 完整结构,补足思考层、诊断层、对比层和门禁层。 | 对齐已补强 Step 09 / 10 的中间产物粒度。 |
| 主表达结构 | 使用 `ID / 能力节点 / 数据项 / 数据类型 / 归属说明 / 生命周期口径 / 支撑功能规则` 混合表。 | 改为规范 4 列主表达,并将 DO 编号保留在“数据项”列内。 | 对齐书写规范 4.11 固定表结构。 |
| 数据口径 | 已有四类数据方向,但没有显式解释为何不写字段、schema 或存储实现。 | 明确写出对象词、schema 词、产品词和真实证据词的裁剪口径。 | 防止后续把 Step 11 再拉回详细设计层。 |
| 恢复点同步 | Step 11 文件、flow 和 ledger 之间尚未同步到当前恢复点。 | 本轮同步 Step 11、flow 和项目台账到同一恢复点。 | 便于后续按用户确认继续推进 Step 12 补强。 |

## 9. 设计取舍

| 取舍 | 结论 | 原因 |
|---|---|---|
| 是否把本仓数据定义为监控时序库数据 | 不采用 | 监控产品、时序库和展示后端是后续架构 / 配置候选,不是需求层 truth。 |
| 是否把 log / metric / trace 全量正文列为本仓真相 | 不采用 | 本仓拥有安全观察面事实和归属事实,不拥有 raw log、payload body、provider response 或执行正文。 |
| 是否把 audit projection 写成治理 / 制品 / 身份 truth | 不采用 | audit projection 是只读观察投影,外部 truth 仍由各 source owner 拥有。 |
| 是否把 evidence linkage 写成 evidence body | 不采用 | 证据关联必须 body-free;Artifact 或相应 evidence owner 拥有正文和证据本体。 |
| 是否把 query result、diagnostic summary 写成业务 truth | 不采用 | 查询和诊断只能是只读派生快照,不能形成新的业务 truth。 |
| 是否把 no-write violation 写成快照 | 不采用 | no-write violation 是本仓自己的违例事实,应作为真相数据保留。 |
| 是否把 report handoff 写成正式验收数据 | 不采用 | 报告交接只交接观察线索、脱敏状态、缺口和引用语境,不得生成真实 `run_id`、evidence alias、final verdict 或 signoff。 |
| 是否写字段、表结构、索引、schema 或存储策略 | 不采用 | 当前只写需求层数据项类别、归属说明和生命周期口径。 |

## 10. 结构化中间产物

### 10.1 写入原则

本节只写正式回填所需的最小数据单元:能力级数据归属表、数据类型结论、归属说明结论、生命周期口径结论、功能 / 规则映射、能力级停审、边界外数据裁剪和跨能力审计。所有主表达都保持 4.11 固定结构,不提前写入接口、非功能、验收或实现内容。

### 10.2 `C-OBS-1` 安全观测材料入口数据归属

| 数据项 | 数据类型 | 归属说明 | 生命周期口径 |
|---|---|---|---|
| `DO-OBS-001` 观测材料准入事实 | 真相数据 | 观测材料在本仓观察语境中的 accepted / rejected / quarantined 归属事实由本仓拥有正式真相。 | 随观测材料准入判断显式建立、变化或终止,形成本仓观察面生命周期。 |
| `DO-OBS-002` 观测材料安全处置语境 | 真相数据 | 本仓拥有自身对观测材料安全处置原因、处置语境和可审计安全判断的正式真相。 | 随安全处置判断建立或变化,保留可追溯语境。 |
| `DO-OBS-003` 来源与关联语境 | 真相数据 | 本仓拥有观察面内用于说明来源、关联和安全解释的语境真相,不拥有来源对象正文。 | 随观察材料关联关系建立、修正、失效或被标记不可见而变化。 |
| `DO-OBS-004` redaction / safety marker | 真相数据 | 本仓拥有材料是否可安全表达、是否已脱敏、是否需隔离的观察面标记真相。 | 随安全判断、策略适用或重新评估显式变化。 |
| `DO-OBS-005` 输入来源摘要 | 快照数据 | source owner 正式真相不属于本仓,但本仓可保留安全准入和解释所需的来源摘要。 | 随来源事实变化或观察面重建而更新,不形成独立 truth 生命周期。 |
| `DO-OBS-006` source owner / bus event / payload 引用 | 引用数据 | 本仓只保存对 source owner、bus event 或 payload 承载方的引用关系,不拥有其正文真相。 | 随引用关系建立、变化或失效而变化,本仓不负责正文生命周期。 |
| `DO-OBS-007` raw body / secret / credential / full sensitive ref | 禁止保存正文 | raw body、secret、credential 和 full sensitive ref 不属于本仓真相范围,本仓不得保存其正文。 | 不进入本仓生命周期。 |
| `DO-OBS-008` 业务 payload / 外部完整正文 | 禁止保存正文 | 业务 payload 和外部完整正文由 source owner 拥有,本仓不得保存其正文。 | 不进入本仓生命周期。 |

### 10.3 `C-OBS-2` 审计投影与证据关联数据归属

| 数据项 | 数据类型 | 归属说明 | 生命周期口径 |
|---|---|---|---|
| `DO-OBS-009` 审计投影事实 | 真相数据 | 本仓拥有观察材料形成只读审计投影的投影事实,不拥有 source audit truth。 | 随投影形成、修正、失效或重建而变化,不反写 source truth。 |
| `DO-OBS-010` body-free 证据关联事实 | 真相数据 | 本仓拥有证据关联在观察面内成立、缺失或不可见的 body-free 关联事实。 | 随关联建立、变化、失效或缺口显式表达而变化。 |
| `DO-OBS-011` 审计 / 证据缺口语境 | 真相数据 | 本仓拥有观察面内对审计投影缺口、证据缺失和关联不可见的说明事实。 | 随缺口发现、补充、降级或关闭显式变化。 |
| `DO-OBS-012` evidence / artifact / governance / identity 引用 | 引用数据 | 本仓只保存对 evidence、artifact、Governance、Identity 等外部对象的引用关系,不拥有其正文。 | 随引用关系建立、变化或失效而变化,本仓不负责正文生命周期。 |
| `DO-OBS-013` 审计投影安全摘要 | 快照数据 | 审计投影可为报告和审查保留安全摘要,但摘要不替代外部正式 truth。 | 随投影事实或来源事实变化而更新或重建。 |
| `DO-OBS-014` evidence body / artifact body / identity body / governance decision body | 禁止保存正文 | evidence、artifact、identity 和 governance decision 正文不属于本仓真相范围,本仓不得保存其正文。 | 不进入本仓生命周期。 |

### 10.4 `C-OBS-3` 运行观察面安全表达数据归属

| 数据项 | 数据类型 | 归属说明 | 生命周期口径 |
|---|---|---|---|
| `DO-OBS-015` 安全日志观察面 | 真相数据 | 本仓拥有已安全表达的日志观察面事实,不拥有原始日志正文或执行 truth。 | 随安全日志观察材料建立、降级、重建或失效而变化。 |
| `DO-OBS-016` 安全指标观察面 | 真相数据 | 本仓拥有已安全表达的指标观察面事实,不拥有业务状态或执行结果 truth。 | 随指标观察材料建立、聚合、降级或失效而变化。 |
| `DO-OBS-017` 安全追踪观察面 | 真相数据 | 本仓拥有已安全表达的追踪观察面事实,不拥有 runtime / sandbox execution truth。 | 随追踪观察材料建立、关联、降级或失效而变化。 |
| `DO-OBS-018` 观察输出降级 / 不可见事实 | 真相数据 | 本仓拥有观察输出缺失、不可见、不可安全输出或被降级的表达事实。 | 随缺失、不可见、降级或恢复显式变化。 |
| `DO-OBS-019` 运行状态安全摘要 / metric rollup | 快照数据 | runtime / sandbox 和业务状态正式 truth 不属于本仓,本仓可保留安全摘要或聚合观察快照。 | 随来源观察面变化而更新或重建,不形成独立 truth 生命周期。 |
| `DO-OBS-020` raw log / raw prompt / provider response body / runtime body | 禁止保存正文 | 原始日志、raw prompt、provider response body 和 runtime body 不属于本仓真相范围,本仓不得保存其正文。 | 不进入本仓生命周期。 |

### 10.5 `C-OBS-4` 只读诊断与报告交接数据归属

| 数据项 | 数据类型 | 归属说明 | 生命周期口径 |
|---|---|---|---|
| `DO-OBS-021` 只读观测查询结果语境 | 快照数据 | 查询结果是观察面派生表达,不形成新的业务 truth 或执行 truth。 | 随查询条件、可见性和观察面变化而生成、失效或重建。 |
| `DO-OBS-022` 只读诊断摘要 | 快照数据 | 诊断摘要是对安全观察线索的聚合表达,不拥有 source truth 或控制结果。 | 随观察线索、缺口或可见性变化而更新或重建。 |
| `DO-OBS-023` 报告交接事实 | 真相数据 | 本仓拥有观察材料被交接给报告、归档准备或验收审查的交接事实。 | 随交接计划、阻塞、完成或撤销显式变化。 |
| `DO-OBS-024` 报告交接摘要 / 缺口说明 | 快照数据 | 报告交接可包含安全摘要、脱敏状态和缺口说明,但不生成最终裁决。 | 随交接事实、观察材料和缺口状态变化而更新。 |
| `DO-OBS-025` 证据真实性提示 | 真相数据 | 本仓拥有观察面内区分真实执行证据、待补齐材料和设计期占位的提示事实。 | 随证据可见性、执行语境或材料状态显式变化。 |
| `DO-OBS-026` archive / report / external audit 引用 | 引用数据 | 本仓只保存对 archive、report 或 external audit / GRC 消费对象的引用关系,不拥有其正文。 | 随引用关系建立、变化或失效而变化,本仓不负责正文生命周期。 |
| `DO-OBS-027` final verdict / signoff / 真实 run_id / 真实 evidence alias | 禁止保存正文 | 最终裁决、验收签署、真实 `run_id` 和真实 evidence alias 不能由设计期观察材料伪造或静态保存为本仓正文。 | 不进入本仓生命周期。 |

### 10.6 `C-OBS-5` 留存与不反写真相边界数据归属

| 数据项 | 数据类型 | 归属说明 | 生命周期口径 |
|---|---|---|---|
| `DO-OBS-028` 留存标记事实 | 真相数据 | 本仓拥有观察材料在本仓内的 hold、release、conflict、archive eligibility 或活动引用标记事实。 | 随留存判断、活动引用、冲突处理或释放显式变化。 |
| `DO-OBS-029` 活动引用保护事实 | 真相数据 | 本仓拥有观察材料仍被审计、诊断、报告、留存或重放语境引用的保护事实。 | 随引用建立、变化、解除或冲突显式变化。 |
| `DO-OBS-030` 观察面重放 / 重建事实 | 真相数据 | 本仓拥有观察面和派生投影重放 / 重建的范围、原因和影响事实。 | 随重放 / 重建计划、执行边界、完成或撤销显式变化。 |
| `DO-OBS-031` no-write violation 记录 | 真相数据 | 本仓拥有发现查询、诊断、维护、重建或报告交接试图写入 source truth 的观察面违例记录。 | 随违例发现、确认、处置语境或关闭显式变化。 |
| `DO-OBS-032` source truth 修复 / 删除 / 覆盖请求正文 | 禁止保存正文 | source truth 修复、删除或覆盖请求正文不属于本仓真相范围,本仓不得保存或执行。 | 不进入本仓生命周期。 |
| `DO-OBS-033` archive package / recovery body | 禁止保存正文 | archive package、恢复正文和归档裁决不属于本仓真相范围,本仓不得保存其正文。 | 不进入本仓生命周期。 |
| `DO-OBS-034` 重放 / 留存影响摘要 | 快照数据 | 本仓可保留重放、重建或留存冲突的安全摘要,但摘要不修改 source truth。 | 随重放 / 留存事实变化而更新或重建。 |

### 10.7 数据类型结论

| 数据类型 | 数据项 |
|---|---|
| 真相数据 | `DO-OBS-001`;`DO-OBS-002`;`DO-OBS-003`;`DO-OBS-004`;`DO-OBS-009`;`DO-OBS-010`;`DO-OBS-011`;`DO-OBS-015`;`DO-OBS-016`;`DO-OBS-017`;`DO-OBS-018`;`DO-OBS-023`;`DO-OBS-025`;`DO-OBS-028`;`DO-OBS-029`;`DO-OBS-030`;`DO-OBS-031` |
| 快照数据 | `DO-OBS-005`;`DO-OBS-013`;`DO-OBS-019`;`DO-OBS-021`;`DO-OBS-022`;`DO-OBS-024`;`DO-OBS-034` |
| 引用数据 | `DO-OBS-006`;`DO-OBS-012`;`DO-OBS-026` |
| 禁止保存正文 | `DO-OBS-007`;`DO-OBS-008`;`DO-OBS-014`;`DO-OBS-020`;`DO-OBS-027`;`DO-OBS-032`;`DO-OBS-033` |

### 10.8 归属说明结论

| 归属类别 | 结论 |
|---|---|
| Observability 真相 | 本仓只拥有观察面内部事实、审计投影事实、body-free 证据关联事实、只读交接事实、留存标记和 no-write violation 记录。 |
| 外部快照 | 本仓可保留安全摘要、观察摘要、诊断摘要、报告交接摘要和重放 / 留存影响摘要,但快照不得替代外部正式 truth。 |
| 外部引用 | 本仓可保存 source owner、bus、Governance、Artifact / evidence、Identity、runtime / sandbox、archive / report、external audit / GRC 的引用关系,但不负责外部正文生命周期。 |
| 禁止正文 | raw body、secret、payload body、artifact / evidence body、identity body、governance decision body、runtime body、provider response body、archive package body、final verdict 和 signoff 不得进入本仓正文真相范围。 |

### 10.9 生命周期口径结论

| 数据类型 | 生命周期口径 |
|---|---|
| 真相数据 | 随本仓观察面事实、投影事实、交接事实、留存事实或违例事实正式建立、变化、失效或终止。 |
| 快照数据 | 随来源事实、观察材料、可见性或派生口径变化而更新或重建,不形成独立业务 truth 生命周期。 |
| 引用数据 | 随引用关系建立、变化或失效而变化,本仓不负责外部正文生命周期。 |
| 禁止保存正文 | 不进入本仓生命周期。 |

### 10.10 数据与功能需求映射结论

| 功能需求 | 数据归属要求 |
|---|---|
| `FR-OBS-001` 安全观测材料准入 | `DO-OBS-001`;`DO-OBS-005`;`DO-OBS-008` |
| `FR-OBS-002` 来源与关联语境表达 | `DO-OBS-003`;`DO-OBS-005`;`DO-OBS-006` |
| `FR-OBS-003` 观测材料安全处置 | `DO-OBS-002`;`DO-OBS-004`;`DO-OBS-007` |
| `FR-OBS-004` 审计投影表达 | `DO-OBS-009`;`DO-OBS-011`;`DO-OBS-013` |
| `FR-OBS-005` Body-free 证据关联 | `DO-OBS-010`;`DO-OBS-012`;`DO-OBS-014` |
| `FR-OBS-006` 运行观察面安全表达 | `DO-OBS-015`;`DO-OBS-016`;`DO-OBS-017`;`DO-OBS-019`;`DO-OBS-020` |
| `FR-OBS-007` 观察输出降级表达 | `DO-OBS-018`;`DO-OBS-021`;`DO-OBS-024` |
| `FR-OBS-008` 只读观测查询 | `DO-OBS-021`;`DO-OBS-031` |
| `FR-OBS-009` 只读诊断视图 | `DO-OBS-022`;`DO-OBS-031` |
| `FR-OBS-010` 报告与证据交接 | `DO-OBS-023`;`DO-OBS-024`;`DO-OBS-026` |
| `FR-OBS-011` 证据真实性提示 | `DO-OBS-025`;`DO-OBS-027` |
| `FR-OBS-012` 留存约束与活动引用保护 | `DO-OBS-028`;`DO-OBS-029`;`DO-OBS-033`;`DO-OBS-034` |
| `FR-OBS-013` 观察面重放 / 重建与 no-write 防护 | `DO-OBS-030`;`DO-OBS-031`;`DO-OBS-032`;`DO-OBS-034` |
| 外围增强功能 | 只能消费安全快照、只读摘要或外部引用;不得新增本仓核心 truth 或保存禁止正文。 |

### 10.11 数据与业务规则映射结论

| 规则范围 | 数据归属支撑 |
|---|---|
| `BR-OBS-001~006` 观测材料入口规则 | `DO-OBS-001~008` 支撑准入事实、安全处置、来源关联、redaction、引用和正文禁止。 |
| `BR-OBS-007~010` 审计投影与证据规则 | `DO-OBS-009~014` 支撑只读审计投影、body-free 证据关联、缺口表达和外部正文禁止。 |
| `BR-OBS-011~014` 运行观察面规则 | `DO-OBS-015~020` 支撑安全 log / metric / trace、降级事实、运行摘要和原始运行正文禁止。 |
| `BR-OBS-015~019` 查询诊断报告规则 | `DO-OBS-021~027` 支撑只读查询、诊断摘要、报告交接、真实性提示和 final verdict / signoff 禁止。 |
| `BR-OBS-020~023` 留存重放 no-write 规则 | `DO-OBS-028~034` 支撑留存标记、活动引用、重放 / 重建边界、no-write violation 和 source truth 正文禁止。 |
| `BR-OBS-024~026` 全局边界规则 | 引用数据、禁止保存正文和 historical material 裁剪共同支撑 bus、相邻仓 truth、外部产品和旧材料边界。 |

### 10.12 能力级数据停审结论

| 能力节点 | 数据覆盖 | 停审结论 |
|---|---|---|
| `C-OBS-1` 安全观测材料入口 | `DO-OBS-001~008` 覆盖准入、安全处置、来源关联、redaction、来源摘要、引用和正文禁止 | pass,足以进入 Step 12 接口与依赖讨论 |
| `C-OBS-2` 审计投影与证据关联 | `DO-OBS-009~014` 覆盖审计投影、body-free 证据、缺口、引用、安全摘要和正文禁止 | pass,足以进入 Step 12 接口与依赖讨论 |
| `C-OBS-3` 运行观察面安全表达 | `DO-OBS-015~020` 覆盖安全 log / metric / trace、降级事实、运行摘要和 raw runtime 正文禁止 | pass,足以进入 Step 12 接口与依赖讨论 |
| `C-OBS-4` 只读诊断与报告交接 | `DO-OBS-021~027` 覆盖查询快照、诊断摘要、报告交接、真实性提示、引用和验收伪造禁止 | pass,足以进入 Step 12 接口与依赖讨论 |
| `C-OBS-5` 留存与不反写真相边界 | `DO-OBS-028~034` 覆盖留存标记、活动引用、重放 / 重建、no-write violation 和归档 / source truth 正文禁止 | pass,足以进入 Step 12 接口与依赖讨论 |

### 10.13 边界外数据裁剪结论

| 裁剪数据 | 不进入原因 | 正确归属 / 处理 |
|---|---|---|
| bus delivery、ack、retry、dead-letter、replay 主干正文 | 事件总线 truth 不属于本仓 | `L0-bus`;本仓只保存观察引用或安全摘要 |
| Governance decision、Policy、Gate、AIIA、SoA、Control、Nonconformity 正文 | 治理 truth 不属于本仓 | `L1-governance`;本仓只保存引用、投影摘要或缺口 |
| Artifact、Evidence、Baseline、Archive package 正文 | 制品、证据和归档正文不属于本仓 | `L1-artifact` / archive;本仓只保存 body-free 关联或引用 |
| Identity actor、member、role、subject lifecycle 正文 | 身份 truth 不属于本仓 | `L1-identity`;本仓只保存安全 actor / subject 引用语境 |
| runtime / sandbox execution body、tool result body、provider response body | 执行 truth 和执行正文不属于本仓 | runtime / sandbox;本仓只保存安全观察面和降级语境 |
| console UI、dashboard 布局、外部监控产品配置 | UI truth 和产品配置不属于需求核心 | console / 产品层 / 后续配置;本仓只提供可消费观察材料 |
| TimescaleDB、Grafana、Prometheus、OTel Collector、P95、冷存期限、hash chain 分片 | 旧技术栈、指标和实现候选不是当前需求数据归属 | historical material;后续架构 / 配置 / NFR 重新裁剪 |

### 10.14 跨能力数据审计

| 审计项 | 结论 |
|---|---|
| 是否区分真相 / 快照 / 引用 / 禁止保存正文 | pass |
| 是否使用 4.11 固定 4 列主表达 | pass |
| 是否每个核心功能都有数据归属承接 | pass |
| 是否每个数据项都有功能、规则或边界来源 | pass |
| 是否存在重复 truth 归属冲突 | no |
| 是否存在把外部正文写成本仓 truth | no |
| 是否存在把快照或查询结果写成业务 truth | no |
| 是否存在字段、表结构、索引、DTO、事件 schema、缓存、事务或存储产品 | no |
| 是否存在正式文档写入 | no |

## 11. 回填草稿

以下内容供 Step 17 重建正式 `00-需求文档.md` 时回填到 §11。正式文档应摘录本文件 §10.2~§10.11 的收口表,不重复扩写当前诊断、对比和取舍过程。

```md
## 11. 数据需求与数据归属

> 校准来源:
> - `design-calibration/00_req_step_11_data_requirements_ownership.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“结构化中间产物”“回填草稿”和“边界外数据裁剪结论”小节,了解本章如何用数据归属承接功能与规则边界。

本文采用 `design-calibration/00_req_step_11_data_requirements_ownership.md` §10 的数据归属结论。本仓只拥有观察面内部事实和投影事实;外部正式 truth 只能以安全摘要或引用方式进入;raw body、secret、payload body、Artifact / evidence body、Identity body、Governance decision body、runtime body、provider response body、archive package body、final verdict 和 signoff 不得进入本仓正文真相范围。

正式数据归属表应摘录:

- `design-calibration/00_req_step_11_data_requirements_ownership.md` §10.2~§10.6 能力级数据归属表。
- `design-calibration/00_req_step_11_data_requirements_ownership.md` §10.7 数据类型结论。
- `design-calibration/00_req_step_11_data_requirements_ownership.md` §10.8 归属说明结论。
- `design-calibration/00_req_step_11_data_requirements_ownership.md` §10.9 生命周期口径结论。
- `design-calibration/00_req_step_11_data_requirements_ownership.md` §10.10 数据与功能需求映射结论。
- `design-calibration/00_req_step_11_data_requirements_ownership.md` §10.11 数据与业务规则映射结论。
```

## 12. 自检与门禁

### 12.1 自检

| 检查项 | 结果 |
|---|---|
| 是否按能力节点组织数据归属 | pass |
| 是否使用 4.11 固定 4 列主表达 | pass |
| 是否明确真相数据、快照数据、引用数据和禁止保存正文四类 | pass |
| 是否每条数据项都有数据类型、归属说明和生命周期口径 | pass |
| 是否每条数据项都能回指功能需求、业务规则或边界来源 | pass |
| 是否覆盖 `FR-OBS-001~013` 所需数据归属 | pass |
| 是否显式列出 raw body、secret、payload body、evidence body、identity body、governance body、runtime body、provider response body、archive body、final verdict 和 signoff 禁止正文 | pass |
| 是否未写字段、表结构、索引、事务、缓存、outbox / projection / rebuild、repo / service / port、DDL | pass |
| 是否未写接口协议、事件 schema、DTO、配置、NFR、验收或实施边界 | pass |
| 是否未把旧技术栈、P95、冷存、hash chain 或产品绑定升级为当前数据需求 | pass |
| 是否未写入正式 `00-需求文档.md` | pass |
| 是否发现阻塞进入下一补强 step 的上游 blocker | no |

### 12.2 门禁

| gate_status | gate_reason | next_allowed_action |
|---|---|---|
| pass | 真相 / 快照 / 引用 / 禁止保存正文四类数据、归属说明、生命周期口径、功能 / 规则映射、能力级数据停审和边界外数据裁剪已收束,且未混写接口、非功能、验收或实现方案 | wait_user_or_start_step_12_strengthening_after_confirmation |
