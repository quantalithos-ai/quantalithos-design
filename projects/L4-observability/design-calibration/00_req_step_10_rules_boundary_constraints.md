# Step 10 业务规则与边界约束

## 0. Step 开工确认

| 项目 | 记录 |
|---|---|
| Step | Step 10 业务规则与边界约束 |
| 输出文件 | `design-calibration/00_req_step_10_rules_boundary_constraints.md` |
| 当前模式 | full-restart |
| 当前轮次 | 审查后补强 |
| 已读取项目台账 | yes |
| 已读取需求 flow | yes |
| 已读取前序 Step | yes, 已读取 `00_req_step_02_position_boundary.md`、`00_req_step_07_core_capability_loop.md` 与 `00_req_step_09_functional_requirements.md` |
| 已做一致性反查 | yes, 已回看 `00_req_step_04_goals_non_goals.md`,仅用于检查规则是否承接只读 handoff、body-free、retention 和 no-write 目标,不把 Step 04 当作本步前置 truth |
| 已读取 SOP / 书写规范 | yes, 需求 SOP Step 10 与需求书写规范 4.10 |
| 已读取上游粒度参考 | yes, `L1-governance` 与 `L1-artifact` 的 Step 10 中间产物 |
| 已读取历史材料 | yes, 旧 `README.md` 与旧 `00-需求文档.md` 的规则章节仅作为 historical material |
| 用户确认 | yes, 用户确认进入 Step 10 补强 |
| 进入条件 | pass |

## 1. Step 内计划

| 模块 | 状态 | 产物 | gate_status | next_allowed_action |
|---|---|---|---|---|
| 开工确认 / 必读文档:先思考 | done | Step 10 目标、输入、禁写范围和规则识别风险诊断 | pass | 进入必读文档再写入。 |
| 开工确认 / 必读文档:再写入 | done | 必读文档摘要、输入索引和执行约束 | pass | 进入规则收敛先思考。 |
| 规则收敛:先思考 | done | 规则候选分层、裁剪项、规则类型写法和挂载策略诊断 | pass | 进入规则收敛再写入。 |
| 规则收敛:再写入 | done | 按能力节点组织的规则表、规则类型结论、映射结论和跨能力审计写入 | pass | 进入当前文档问题诊断。 |
| 当前文档问题诊断 | done | 历史材料、旧 Step 10 和边界输入的差异诊断 | pass | 进入改动前后对比。 |
| 改动前后对比 | done | 补强前后结构、粒度和口径差异表 | pass | 进入设计取舍。 |
| 设计取舍 | done | 规则类型取舍、旧规则改写策略和边界裁剪策略 | pass | 进入结构化中间产物。 |
| 结构化中间产物 | done | 规则识别口径、规则结论、映射结论和裁剪结论 | pass | 进入回填草稿。 |
| 回填草稿 | done | 正式第 10 章候选草稿 | pass | 进入自检与停审。 |
| 自检与停审 | done | 自检表 / 是否允许进入下一补强 step | pass | wait_user_or_start_step_06_strengthening_after_confirmation |

## 2. 当前停审点

| 项 | 状态 | 说明 |
|---|---|---|
| Step 10 开工 | pass | 已确认当前只允许推进 `00` 的 Step 10 审查后补强。 |
| 必读文档思考 | pass | 已明确 Step 10 只写需求层硬规则,不写状态机编码、数据库约束、接口签名、事件 schema、handler / service / repository 校验逻辑、配置、NFR 或验收条件。 |
| 必读文档摘要写入 | pass | 已写入 Step 02 / 04 / 07 / 09、SOP、书写规范和历史材料对本步的约束。 |
| 规则收敛思考 | pass | 已完成规则候选、裁剪项、规则类型写法和挂载策略诊断。 |
| 规则表写入 | pass | 已形成 `BR-OBS-001~026` 并按能力节点组织。 |
| 跨能力规则审计 | pass | 已完成规则类型、约束对象、功能映射和跨能力一致性审计。 |
| 当前文档问题诊断 | pass | 已诊断旧 README、旧 `00` 和当前较短旧 Step 10 的失焦点。 |
| 结构化中间产物 | pass | 已整理正式回填所需的最小单元。 |
| 回填草稿 | pass | 已形成正式第 10 章候选草稿。 |
| 自检与停审 | pass | Step 10 审查后补强已完成。 |
| 正式文档写入 | blocked | 正式 `00-需求文档.md` 仍等待 Step 17 统一装配。 |
| 当前下一步 | `Step 06 使用方与依赖（补强）:开工确认 / 必读文档:先思考` |

当前不得直接写正式 `00-需求文档.md`，也不得自动进入 Step 06。下一步只允许在用户确认后进入 `Step 06 使用方与依赖（补强）`。

## 3. 开工确认 / 必读文档:先思考

### 3.1 本步目标诊断

Step 10 的任务是把已经收束的仓边界、核心能力闭环和功能需求,转译成需求层硬规则。这里的“规则”不是实现层校验、API 要求、事件字段、状态机编码或测试脚本,而是用来钉住观察面真相不串线、不隐式变化、不反写真相、不过度吸纳相邻仓 truth 的业务约束。

对 `L4-observability` 来说,这一章最容易犯五类错。第一类是把 `BR-OBS` 写成数据模型或接口约束,例如 schema version、DTO、字段、表结构或 query 参数。第二类是把规则写成“违反后如何处理”,例如 reject、quarantine、VETO、exception code,这些更接近测试、验收或实现。第三类是把相邻仓 truth 或外部产品配置写成本仓规则对象。第四类是把 report handoff、evidence、retention、rebuild 写成真实验收结论、真实证据或 source truth 修复。第五类是生成无法回指 `FR-OBS-*` 或 Step 02 / Step 04 边界的孤儿规则。

### 3.2 必读文档候选

| 文档 | 必读原因 | 预计落点 |
|---|---|---|
| `standards/document/需求文档讨论流程_SOP.md` Step 10 | 固定本步目标、输入、输出、应问问题和跨能力规则审计门禁。 | 本步结构、规则挂载要求和停审方式。 |
| `standards/document/需求文档书写规范.md` 4.10 | 固定规则表结构、规则类型枚举、粒度要求和完成标准。 | 规则表、自检表和回填草稿。 |
| `00_req_step_02_position_boundary.md` | 固定本仓只拥有 observation material、audit projection 和 read-only report handoff truth。 | 边界约束和 no-write truth 规则来源。 |
| `00_req_step_07_core_capability_loop.md` | 固定 `C-OBS-1~5` 能力节点和闭环顺序。 | 规则必须按能力节点组织。 |
| `00_req_step_09_functional_requirements.md` | 固定 `FR-OBS-001~013` 和外围增强 / 边界外功能裁剪。 | 每条规则必须优先挂到功能需求或边界目标。 |
| `00_req_step_04_goals_non_goals.md` | 反查只读 handoff、body-free evidence、retention 和 no-write target 是否被规则承接。 | 一致性校对,不作为本步前置 truth。 |
| 旧 `README.md` | 识别旧规则为什么容易被产品栈、性能数字、冷存、hash 分片和外部产品绑定污染。 | 当前文档问题诊断和改动前后对比。 |
| 旧 `00-需求文档.md` 第 10 章 | 提取旧 `BR-OBS-*` 有效方向,识别其“违反时处理”和对象 / 接口词污染。 | 保留规则方向,裁剪实现味道。 |
| `projects/L1-governance/design-calibration/00_req_step_10_business_rules_boundaries.md` | 参考如何把规则拆成类型结论、约束对象结论和功能映射结论。 | 补足规则层的思考层和回填层。 |
| `projects/L1-artifact/design-calibration/00_req_step_10_business_rules_boundaries.md` | 参考与相邻正文 owner 的边界规则如何写成需求层硬约束。 | body-free evidence、正文边界和消费边界裁剪。 |

### 3.3 初步关注点

- 规则必须优先挂到 `C-OBS-1~5` 和 `FR-OBS-*`,而不是从对象、接口、状态机或旧 BR 编号出发。
- Step 10 允许使用 `不变量 / 禁止行为 / 显式变化 / 边界约束` 四类核心类型,并按需补 `审计约束`;当前不强行引入治理约束。
- report handoff、evidence linkage、retention marker、rebuild、diagnostic 都只能写成观察面规则,不能写成最终 verdict、正文 ownership 或 source truth 修复。
- 旧 README 的 OTel、Prometheus、Grafana、TimescaleDB、冷存年限、hash chain 分片和 P95 只能是 historical material,不能提升为正式规则。
- 所有规则都要服务于“只读观察面”和“不可反写真相”两条核心边界,否则 Step 11 数据归属和 Step 12 接口边界会被污染。

### 3.4 本模块停审点

| 项 | 状态 | 说明 |
|---|---|---|
| 本步目标诊断 | pass | 已明确 Step 10 只收口需求层硬规则。 |
| 必读文档候选 | pass | 已固定标准、前序 Step、历史材料和粒度参考。 |
| 初步关注点 | pass | 已明确 5 类最易误写点。 |
| 正式规则表写入 | blocked | 当前尚未进入规则收敛正式写入。 |
| 正式文档写入 | blocked | 正式 `00-需求文档.md` 仍等待 Step 17。 |
| 当前下一步 | `开工确认 / 必读文档:再写入` |

## 4. 开工确认 / 必读文档:再写入

### 4.1 必读文档摘要

| 文档 | 读取结论 | 对 Step 10 的影响 |
|---|---|---|
| `需求文档讨论流程_SOP.md` Step 10 | 本步要把边界结论、能力闭环和功能需求钉成按能力节点组织的规则结论、规则编号、规则类型、规则内容、约束对象和能力级停审结论。 | 后续必须先诊断规则候选,再写规则表,再做跨能力规则审计。 |
| `需求文档书写规范.md` 4.10 | 规则表固定为 `规则编号 / 规则类型 / 规则内容 / 约束对象`;核心类型为不变量、禁止行为、显式变化和边界约束,审计约束按需补充。 | 回填草稿必须使用固定表结构,不得混入实现逻辑、接口签名、状态机或数据归属。 |
| Step 02 本仓定位与边界 | 本仓只拥有 observation material、audit projection 和 read-only report handoff truth,不拥有业务 truth、artifact / evidence 正文、identity truth、runtime truth、archive 正文、console UI 或外部产品配置 truth。 | 所有边界规则必须围绕只读观察面和 no-write truth 展开。 |
| Step 07 核心能力闭环 | 能力节点固定为 `C-OBS-1` 安全观测材料入口、`C-OBS-2` 审计投影与证据关联、`C-OBS-3` 运行观察面安全表达、`C-OBS-4` 只读诊断与报告交接、`C-OBS-5` 留存与不反写真相边界。 | 规则必须按这五个节点组织,不能按对象或接口分组。 |
| Step 09 功能需求 | 已形成 `FR-OBS-001~013` 核心功能和外围增强 / 边界外裁剪结论。 | 每条正式规则必须保护核心功能或边界目标,不能出现孤儿规则。 |
| Step 04 目标与非目标 | 已要求统一观察面边界、body-free 关联、redaction / correlation、只读 handoff、retention / no-write 防线和相邻 truth owner 协作边界。 | 当前规则必须承接这些目标,但不能倒推写成功能或对象。 |
| 旧 `README.md` | 旧仓使命和规则想象容易被 OTel、Prometheus、Grafana、TimescaleDB、hash chain、冷存和 P95 绑死。 | 当前需要把“产品 / 指标规则”重写为“业务边界规则”。 |
| 旧 `00-需求文档.md` | 旧 `BR-OBS-001~012` 方向有价值,但含 `reject / quarantine / VETO` 等违反时处理和 `MetricPoint`、`ReportHandoffRecord` 等对象味道。 | 保留规则方向,裁剪处理结果、对象词和接口味道。 |
| `L1-governance` / `L1-artifact` Step 10 | 已完成项目都会把规则拆出类型结论、约束对象结论、功能映射和回填草稿。 | 本步也需要补足“先思考、再写入、再审计、再停审”的中间过程。 |

### 4.2 Step 10 输入索引

| 输入类型 | 已确认来源 | Step 10 使用方式 |
|---|---|---|
| 仓边界输入 | Step 02 | 固定哪些边界不能被打穿。 |
| 能力节点输入 | Step 07 | 固定规则组织顺序和停审顺序。 |
| 功能输入 | Step 09 | 固定规则需要保护的功能能力。 |
| 目标反查输入 | Step 04 | 检查规则是否承接只读、body-free、retention 和 no-write 目标。 |
| 历史规则线索输入 | 旧 README;旧 `00` | 识别哪些旧规则方向可保留,哪些只是产品、对象或实现污染。 |
| 粒度参考输入 | `L1-governance`;`L1-artifact` Step 10 | 补足规则层的思考、映射和停审结构。 |
| 用户重点边界输入 | 当前任务说明 | 保证 log / metric / trace / audit schema、redaction、correlation id、evidence linkage、retention marker、report handoff 和 no-write truth 都有规则落点。 |

### 4.3 执行约束

| 约束 | 当前口径 |
|---|---|
| 规则写法 | 规则内容只写需求层硬约束,不写实现方式。 |
| 规则类型 | 默认先用不变量、禁止行为、显式变化、边界约束,审计约束按需补充。 |
| 规则挂载 | 每条规则必须回指 `FR-OBS-*` 或 Step 02 / Step 04 边界结论。 |
| 边界约束 | 相邻仓 truth 只能作为“本仓不得拥有 / 不得反向定义”的边界对象出现。 |
| 禁写内容 | 不写字段、DTO、接口、事件 schema、状态机、数据库约束、事务流程、错误码、配置、NFR、验收门禁。 |
| 正式文档后置 | 当前仍只写 `design-calibration` 中间产物,正式 `00-需求文档.md` 留待 Step 17。 |

### 4.4 下一步输入

`规则收敛:先思考` 需要完成四件事:一是把旧规则候选分成“保留 / 改写 / 裁剪”三类;二是确认 `C-OBS-1~5` 各自需要保护哪些不变量、禁止行为、显式变化和边界约束;三是决定哪些规则需要补审计约束;四是明确跨能力规则审计怎么检查重复、冲突和孤儿规则。

### 4.5 当前停审点

| 项 | 状态 | 说明 |
|---|---|---|
| 必读文档摘要 | pass | 已写入标准、Step 02 / 04 / 07 / 09 和历史材料对 Step 10 的约束。 |
| 输入索引 | pass | 已明确本步规则来源和一致性反查用途。 |
| 执行约束 | pass | 已明确不写实现、接口、对象、数据归属、NFR 或验收。 |
| 规则收敛思考 | pass | 已在 §5 完成候选诊断。 |
| 正式文档写入 | blocked | 正式 `00-需求文档.md` 仍等待 Step 17。 |
| 当前下一步 | `规则收敛:先思考` |

## 5. 规则收敛:先思考

### 5.1 收敛目标

本模块只诊断“哪些规则应该正式进入 Step 10,哪些不应该”,不直接写正式规则表。对 `L4-observability` 来说,合格的规则必须同时满足四个条件。第一,它要能解释某个核心能力节点为什么成立。第二,它要直接保护至少一个 `FR-OBS-*` 或仓级边界目标。第三,它要保持 no-write truth、body-free evidence 和只读 handoff 的语义不串层。第四,它不能抢 Step 11、12、13、14 或后续设计文档的内容。

### 5.2 规则候选分层

| 类别 | 判断标准 | 当前处理方式 |
|---|---|---|
| 应保留的正式规则 | 能直接保护能力节点、功能需求或仓边界,且可用规则类型清楚表达。 | 保留进正式规则表。 |
| 需要改写后保留的候选 | 旧材料里方向正确,但写成了对象、实现、产品或违反时处理。 | 改写为需求层规则后保留。 |
| 当前应裁剪的候选 | 实际是 DTO、接口、事件、状态机、产品绑定、性能指标、测试门禁或真实证据规则。 | 不进入规则表。 |

### 5.3 保留规则方向诊断

| 规则方向 | 来源 | 保留理由 | 下一步写入口径 |
|---|---|---|---|
| 安全观测材料入口规则 | Step 07 `C-OBS-1`;Step 09 `FR-OBS-001~003` | 没有入口规则,观测材料准入、安全处置、来源与关联语境会在实现期散掉。 | 写成准入不变量、敏感正文禁止、准入显式变化、来源关联边界和入口审计约束。 |
| 审计投影与 body-free 证据关联规则 | Step 07 `C-OBS-2`;Step 09 `FR-OBS-004~005` | 没有这些规则,observability 很容易吸入 artifact / evidence body 或替代上游 truth。 | 写成只读审计不变量、body-free 不变量、缺口显式变化和关联审计约束。 |
| 运行观察面安全表达规则 | Step 07 `C-OBS-3`;Step 09 `FR-OBS-006~007` | 没有这些规则,log / metric / trace 会冒充 execution truth,或携带未脱敏正文和不安全 label。 | 写成观察面不变量、敏感输出禁止、降级显式变化和摘要不反写真相边界。 |
| 只读诊断与报告交接规则 | Step 07 `C-OBS-4`;Step 09 `FR-OBS-008~011` | 没有这些规则,查询、诊断和交接会被误用成控制面、裁决面或伪造证据入口。 | 写成只读不变量、诊断不控制、交接不裁决、设计期不伪造真实证据和交接审计约束。 |
| 留存与不反写真相规则 | Step 07 `C-OBS-5`;Step 09 `FR-OBS-012~013` | 没有这些规则,留存、重建、缺口处理和维护动作会越权清理或修复 source truth。 | 写成活动引用保护不变量、留存显式变化、重建边界和全局 no-write 禁止。 |
| 全局边界规则 | Step 02;Step 04;旧 README / 旧 `00` | 没有这些规则,总线主干、相邻仓 truth 和旧产品栈会不断回流到本仓。 | 写成 bus 边界、相邻 truth owner 边界和 historical material 边界。 |

### 5.4 需要改写或裁剪的候选

| 候选 | 处理 | 理由 |
|---|---|---|
| `reject / quarantine / VETO / blocker / retention conflict` 等违反时处理 | 改写 | 这些是验收、实现或运行时结果,需求层规则只写不得发生什么或必须显式发生什么。 |
| `ObservationEnvelope`、`MetricPoint`、`AuditHashLink`、`ReportHandoffRecord`、`RetentionMarker` 等对象名 | 改写 | 这些是对象 / 数据 / 接口语境,不应直接支配规则层。 |
| schema version、source tag、correlation context 字段清单 | 改写 | 可保留为“必须有可解释来源和关联语境”的规则,但不写字段结构。 |
| OTel、Prometheus、Grafana、TimescaleDB、hash chain 分片、冷存天数、P95 | 裁剪 | 属于产品、NFR、配置或测试候选,不是业务规则。 |
| 真实 `run_id`、真实 evidence alias、passed evidence、final verdict、signoff | 裁剪 | 属于真实执行与验收阶段,不能在设计规则中伪造。 |
| query API、diagnostic API、report DTO、rebuild job、alert sink | 裁剪 | 属于接口或实现层,不属于需求层规则。 |

### 5.5 规则类型写法

| 类型 | 当前写法要求 |
|---|---|
| 不变量 | 写“必须始终成立的业务条件”,例如观察面只读、body-free、no-write 目标。 |
| 禁止行为 | 写“明确不允许发生的行为”,例如 raw body 入仓、diagnostic 下发控制、维护动作写 truth。 |
| 显式变化 | 写“必须通过正式动作显式表达的状态或关系变化”,例如准入、缺口、降级、hold / release / conflict。 |
| 边界约束 | 写“哪些边界不能被打穿”,例如 bus 主干、artifact 正文、runtime truth、external product config 不归本仓。 |
| 审计约束 | 写“哪些高风险变化必须保留来源、范围、原因或消费语境”。 |

### 5.6 规则挂载与跨能力审计写法

| 项 | 当前口径 |
|---|---|
| 规则与功能挂载 | 每条正式规则至少回指一个 `FR-OBS-*` 或 Step 02 / Step 04 边界。 |
| 孤儿规则处理 | 不能挂载的规则不进入正式规则表,改进 `风险 / 待确认事项`。 |
| 重复规则处理 | 跨能力只保留一个主责规则,其他位置用映射承接。 |
| 冲突规则处理 | 如某条规则既要求“只读”又允许“修复 source truth”,则必须拆分并裁掉越界部分。 |
| 全局规则处理 | bus 边界、相邻 truth owner 边界和 historical material 边界作为全局规则保留。 |

### 5.7 当前停审点

| 项 | 状态 | 说明 |
|---|---|---|
| 规则候选诊断 | pass | 已识别 6 组需要正式保留的规则方向。 |
| 改写 / 裁剪项诊断 | pass | 已剔除处理结果、对象词、产品词、真实证据和接口实现类候选。 |
| 规则类型写法 | pass | 已明确核心类型和审计约束的使用口径。 |
| 规则表写入 | pass | 已在 §6 写入正式规则表。 |
| 当前下一步 | `规则收敛:再写入` |

## 6. 规则收敛:再写入

### 6.1 写入原则

正式规则表只记录需求层必须成立、不得发生、必须显式发生或不能越界的业务约束。规则表不记录 DTO、不记录状态机编码、不记录接口签名、不记录实现校验。对 `L4-observability` 来说,规则的首要价值不是定义“怎么做”,而是阻止观察面退化为产品配置仓、source truth 副本、执行控制面或伪造证据入口。

### 6.2 `C-OBS-1` 安全观测材料入口规则

| 规则编号 | 规则类型 | 规则内容 | 约束对象 |
|---|---|---|---|
| `BR-OBS-001` | 不变量 | 进入本仓观察语境的材料必须具备可解释来源、安全状态和关联语境,不得以匿名、不可解释或无法审计的形式成为正式观察材料。 | 观测材料入口 |
| `BR-OBS-002` | 禁止行为 | raw body、secret、credential、完整外部正文和 full sensitive ref 不得进入观察面、审计投影、报告交接或查询输出。 | 观测材料安全边界 |
| `BR-OBS-003` | 显式变化 | 观测材料被接受、拒绝或隔离必须显式发生,不得由查询、展示、消费或后台维护动作隐式改变材料准入状态。 | 观测材料准入状态 |
| `BR-OBS-004` | 边界约束 | 观测材料入口不得被解释为 source truth 已写入、已修复或已被裁决。 | source truth 边界 |
| `BR-OBS-005` | 审计约束 | 观测材料安全处置必须可追溯到来源语境、处置原因和安全判断语境。 | 观测材料处置审计 |
| `BR-OBS-006` | 边界约束 | 来源与关联语境不得通过 opaque id、route、topic、dashboard label 或临时映射反推出业务 truth。 | 来源 / 关联语境 |

### 6.3 `C-OBS-2` 审计投影与证据关联规则

| 规则编号 | 规则类型 | 规则内容 | 约束对象 |
|---|---|---|---|
| `BR-OBS-007` | 不变量 | 审计投影必须保持只读观察性质,不得替代 Governance decision、Artifact lineage、Identity truth、runtime execution truth 或 source audit truth。 | 审计投影 |
| `BR-OBS-008` | 不变量 | 证据关联必须以 body-free 方式成立,只能表达可审计线索、引用语境、摘要或缺口,不得保存 evidence body、artifact body 或身份正文。 | 证据关联 |
| `BR-OBS-009` | 显式变化 | 审计投影缺口、证据缺失或关联不可见必须显式表达,不得以空结果、默认成功或静默跳过替代。 | 审计 / 证据缺口 |
| `BR-OBS-010` | 审计约束 | 审计投影和证据关联必须能说明来源、责任主体语境和消费目的,以便报告或审查回溯。 | 审计投影与证据关联审计 |

### 6.4 `C-OBS-3` 运行观察面安全表达规则

| 规则编号 | 规则类型 | 规则内容 | 约束对象 |
|---|---|---|---|
| `BR-OBS-011` | 不变量 | 日志、指标和追踪只能表达运行观察面,不得被解释为 runtime / sandbox execution truth、业务成功结论或治理裁决。 | 运行观察面 |
| `BR-OBS-012` | 禁止行为 | 指标、日志、追踪和观察摘要不得包含未脱敏正文、secret、raw prompt、provider response body、高敏完整引用或不可解释高基数敏感标签。 | log / metric / trace 安全边界 |
| `BR-OBS-013` | 显式变化 | 观察输出缺失、不可见、被降级或不可安全输出时必须显式表达,不得让消费方用空洞结果补造事实。 | 观察输出降级 |
| `BR-OBS-014` | 边界约束 | dashboard、alert、summary、metric rollup 或 diagnostic hint 不得反向定义 source truth。 | 观察摘要边界 |

### 6.5 `C-OBS-4` 只读诊断与报告交接规则

| 规则编号 | 规则类型 | 规则内容 | 约束对象 |
|---|---|---|---|
| `BR-OBS-015` | 不变量 | 查询、诊断和报告交接必须保持只读观察性质,不得产生隐藏写入、业务修复、执行控制或最终裁决副作用。 | 只读观察面 |
| `BR-OBS-016` | 禁止行为 | 诊断视图不得下发 kill、retry、replay、recovery、business command 或其他执行控制命令。 | 诊断边界 |
| `BR-OBS-017` | 不变量 | 报告与证据交接只能交接观察材料线索、脱敏状态、缺口说明和可审计引用,不得生成 final verdict、验收签署或业务结论。 | report handoff |
| `BR-OBS-018` | 禁止行为 | 设计阶段材料不得静态填写真实 `run_id`、真实 evidence alias、passed evidence、final verdict 或 signoff。 | 证据真实性 |
| `BR-OBS-019` | 审计约束 | 报告交接必须能说明材料来源、可见性、脱敏状态、缺口和消费语境。 | 报告交接审计 |

### 6.6 `C-OBS-5` 留存与不反写真相边界规则

| 规则编号 | 规则类型 | 规则内容 | 约束对象 |
|---|---|---|---|
| `BR-OBS-020` | 不变量 | 仍被审计、诊断、报告、留存约束、重放或合法保留语境引用的观察材料不得被误清理。 | 留存与活动引用 |
| `BR-OBS-021` | 显式变化 | 留存 hold、release、conflict、archive eligibility 或活动引用变化必须显式发生,不得由后台清理或展示行为隐式触发。 | 留存状态变化 |
| `BR-OBS-022` | 边界约束 | 重放、重建或缺口处理只能影响观察面和派生投影,不得修复、删除、覆盖或反写 source business truth。 | 重放 / 重建边界 |
| `BR-OBS-023` | 禁止行为 | query、diagnostic、maintenance action、rebuild、report assembly 或外部 export 不得写入任何 L1/L2/L3/L4 source truth。 | no-write truth |

### 6.7 全局边界规则

| 规则编号 | 规则类型 | 规则内容 | 约束对象 |
|---|---|---|---|
| `BR-OBS-024` | 边界约束 | 本仓不得定义或拥有事件总线投递、ack、retry、dead-letter 或 replay 主干规则。 | `L0-bus` 边界 |
| `BR-OBS-025` | 边界约束 | 本仓不得拥有 Governance、Artifact、Identity、runtime / sandbox、archive、console 或外部监控产品的业务 truth、正文 truth、执行 truth、归档 truth、UI truth 或产品配置 truth。 | 相邻仓 truth 边界 |
| `BR-OBS-026` | 边界约束 | 旧 README 或历史正式文档中的 P95、SLA、TimescaleDB、Grafana、Prometheus、OTel Collector、冷存期限、hash chain 分片或事件数量不得直接升级为本轮需求硬规则。 | historical material 边界 |

### 6.8 规则类型结论

| 规则类型 | 规则编号 |
|---|---|
| 不变量 | `BR-OBS-001`;`BR-OBS-007`;`BR-OBS-008`;`BR-OBS-011`;`BR-OBS-015`;`BR-OBS-017`;`BR-OBS-020` |
| 禁止行为 | `BR-OBS-002`;`BR-OBS-012`;`BR-OBS-016`;`BR-OBS-018`;`BR-OBS-023` |
| 显式变化 | `BR-OBS-003`;`BR-OBS-009`;`BR-OBS-013`;`BR-OBS-021` |
| 边界约束 | `BR-OBS-004`;`BR-OBS-006`;`BR-OBS-014`;`BR-OBS-022`;`BR-OBS-024`;`BR-OBS-025`;`BR-OBS-026` |
| 审计约束 | `BR-OBS-005`;`BR-OBS-010`;`BR-OBS-019` |

### 6.9 约束对象结论

| 约束对象 | 相关规则 |
|---|---|
| 观测材料入口 / 准入状态 | `BR-OBS-001`;`BR-OBS-003`;`BR-OBS-005` |
| 观测材料安全边界 / redaction | `BR-OBS-002`;`BR-OBS-012` |
| 来源 / 关联语境 | `BR-OBS-006`;`BR-OBS-010` |
| source truth 边界 | `BR-OBS-004`;`BR-OBS-014`;`BR-OBS-022`;`BR-OBS-023`;`BR-OBS-025` |
| 审计投影 / 证据关联 | `BR-OBS-007`;`BR-OBS-008`;`BR-OBS-009`;`BR-OBS-010` |
| 运行观察面 / 降级表达 | `BR-OBS-011`;`BR-OBS-012`;`BR-OBS-013`;`BR-OBS-014` |
| 查询 / 诊断 / 报告交接 | `BR-OBS-015`;`BR-OBS-016`;`BR-OBS-017`;`BR-OBS-018`;`BR-OBS-019` |
| 留存 / 重放 / no-write | `BR-OBS-020`;`BR-OBS-021`;`BR-OBS-022`;`BR-OBS-023` |
| bus / historical material / 外部产品边界 | `BR-OBS-024`;`BR-OBS-026` |

### 6.10 规则与功能需求映射结论

| 功能需求 | 主要规则 |
|---|---|
| `FR-OBS-001` 安全观测材料准入 | `BR-OBS-001`;`BR-OBS-002`;`BR-OBS-003`;`BR-OBS-005` |
| `FR-OBS-002` 来源与关联语境表达 | `BR-OBS-001`;`BR-OBS-004`;`BR-OBS-006`;`BR-OBS-010` |
| `FR-OBS-003` 观测材料安全处置 | `BR-OBS-002`;`BR-OBS-003`;`BR-OBS-005`;`BR-OBS-012` |
| `FR-OBS-004` 审计投影表达 | `BR-OBS-007`;`BR-OBS-009`;`BR-OBS-010` |
| `FR-OBS-005` Body-free 证据关联 | `BR-OBS-008`;`BR-OBS-009`;`BR-OBS-010` |
| `FR-OBS-006` 运行观察面安全表达 | `BR-OBS-011`;`BR-OBS-012`;`BR-OBS-014` |
| `FR-OBS-007` 观察输出降级表达 | `BR-OBS-009`;`BR-OBS-013`;`BR-OBS-019` |
| `FR-OBS-008` 只读观测查询 | `BR-OBS-013`;`BR-OBS-015`;`BR-OBS-023` |
| `FR-OBS-009` 只读诊断视图 | `BR-OBS-014`;`BR-OBS-015`;`BR-OBS-016`;`BR-OBS-023` |
| `FR-OBS-010` 报告与证据交接 | `BR-OBS-017`;`BR-OBS-018`;`BR-OBS-019` |
| `FR-OBS-011` 证据真实性提示 | `BR-OBS-017`;`BR-OBS-018`;`BR-OBS-019` |
| `FR-OBS-012` 留存约束与活动引用保护 | `BR-OBS-020`;`BR-OBS-021` |
| `FR-OBS-013` 观察面重放 / 重建与 no-write 防护 | `BR-OBS-022`;`BR-OBS-023` |
| 外围增强功能 | `BR-OBS-014`;`BR-OBS-023`;`BR-OBS-025`;`BR-OBS-026` |

### 6.11 能力级规则停审结论

| 能力节点 | 规则覆盖 | 停审结论 |
|---|---|---|
| `C-OBS-1` 安全观测材料入口 | `BR-OBS-001~006` 覆盖准入、安全处置、显式状态和来源 / 关联边界 | pass,足以进入后续数据归属与接口边界讨论 |
| `C-OBS-2` 审计投影与证据关联 | `BR-OBS-007~010` 覆盖只读审计、body-free 证据、缺口显式和审计追溯 | pass,足以进入后续数据归属与接口边界讨论 |
| `C-OBS-3` 运行观察面安全表达 | `BR-OBS-011~014` 覆盖运行观察面、敏感输出禁止、降级表达和摘要不反写真相 | pass,足以进入后续数据归属与接口边界讨论 |
| `C-OBS-4` 只读诊断与报告交接 | `BR-OBS-015~019` 覆盖只读、诊断不控制、报告不裁决、证据真实性和交接审计 | pass,足以进入后续数据归属与接口边界讨论 |
| `C-OBS-5` 留存与不反写真相边界 | `BR-OBS-020~023` 覆盖活动引用保护、留存显式变化、重建边界和 no-write truth | pass,足以进入后续数据归属与接口边界讨论 |
| 全局边界 | `BR-OBS-024~026` 覆盖 bus、相邻仓 truth、historical material 和外部产品边界 | pass |

### 6.12 边界外规则排除结论

| 排除规则候选 | 排除原因 | 正确归属 / 处理 |
|---|---|---|
| bus ack / retry / dead-letter / replay 主干规则 | 事件总线主干不属于本仓 | `L0-bus` |
| Governance Gate / Policy / SoA 裁决规则 | 治理 truth 不属于本仓 | `L1-governance` |
| Artifact / evidence 正文完整性规则 | 正文和 evidence body 不属于本仓 | `L1-artifact` 或 evidence owner |
| Identity actor / subject lifecycle 规则 | 身份生命周期不属于本仓 | `L1-identity` |
| runtime / sandbox kill、retry、recovery、execution verdict 规则 | 执行控制和执行 truth 不属于本仓 | runtime / sandbox |
| archive package、恢复和长期正文保存规则 | 归档包和恢复流程不属于本仓 | `L4-archive` |
| Grafana / Prometheus / OTel / TimescaleDB 产品配置规则 | 外部产品配置不属于需求核心 | 后续架构 / 配置 |
| 真实验收 evidence、run_id、final verdict 和 signoff 生成规则 | 真实证据和验收签署不能伪造 | 测试执行与验收阶段 |

### 6.13 跨能力规则审计

| 审计项 | 结论 |
|---|---|
| 是否存在孤儿规则 | no,所有规则均映射到功能需求或 Step 02 / Step 04 边界 |
| 是否存在规则重复 | no,跨能力规则按约束对象保留唯一主责 |
| 是否存在规则冲突 | no |
| 是否存在边界约束遗漏 | no,已覆盖 bus、governance、artifact、identity、runtime / sandbox、archive、console / 外部产品和 historical material |
| 是否存在实现校验、接口协议、对象字段或测试门禁 | no |
| 是否把数据归属矩阵写进规则表 | no |

## 7. 当前文档问题诊断

| 输入 | 当前表现 | 诊断 | 处理口径 |
|---|---|---|---|
| 旧 `README.md` | 将可观测性能力绑定外部产品、冷存、hash chain 和性能目标。 | 规则层会被产品栈、技术方案和 NFR 绑死,无法先表达观察面硬边界。 | 不沿用产品和指标规则,只保留边界冲突线索。 |
| 旧 `00-需求文档.md` 第 10 章 | 旧 `BR-OBS-001~012` 覆盖 redaction、truth、retention、dependency 等重要方向。 | 方向有价值,但规则类型不规范,同时混入 `reject / quarantine / VETO` 这类处理结果和对象 / 接口词。 | 保留规则方向,改写为固定规则类型和需求层约束。 |
| 当前较短旧 Step 10 | 已有规则表、类型表、映射和排除结论。 | 粒度显著弱于 `L1-governance`,缺少停审点、候选分层、规则改写层和与目标 / 能力的一致性反查。 | 本轮补足思考层、诊断层、对比层和门禁层。 |
| Step 02 边界结论 | 已确认本仓不拥有业务 truth、evidence body、identity truth、runtime truth、archive truth 或外部产品配置 truth。 | Step 10 若不把这些写成硬边界,后续 Step 11 / 12 很容易回流出越界设计。 | 规则表必须显式写出 no-write、body-free 和相邻 truth owner 边界。 |
| Step 07 / Step 09 | 已固定五个能力节点和核心功能需求。 | 规则若不按能力节点挂载,后续追溯矩阵会出现孤儿规则。 | 规则必须按 `C-OBS-1~5` 和 `FR-OBS-*` 组织。 |

## 8. 改动前后对比

| 项 | 补强前 | 补强后 | 原因 |
|---|---|---|---|
| 中间产物结构 | 主要是结论摘要和简短回填 | 增加开工确认、输入索引、候选分层、规则改写策略、对比、取舍和停审点 | 对齐 `L1-governance` 粒度,提升恢复性和可审查性。 |
| 规则组织方式 | 直接给出 `BR-OBS-001~026` 结果表 | 增加规则候选分层和按能力节点收敛逻辑 | 让规则来源和裁剪理由更可辩护。 |
| 旧规则继承口径 | 只说明“旧规则方向保留” | 明确区分“保留 / 改写 / 裁剪”三类候选 | 便于后续审查为什么某些旧条目不再出现。 |
| 规则写法边界 | 较少显式解释为何不写处理结果、对象词或产品词 | 明确把处理结果、对象、接口、NFR、真实证据和产品绑定排除出规则表 | 保护 Step 10 边界。 |
| 与前序 Step 关系 | 主要依赖 Step 02 / 07 / 09,但未显式反查 Step 04 | 增加与 Step 04 目标的一致性反查口径 | 保证规则承接已补强目标。 |
| 下一步门禁 | 指向 Step 11 | 更新为审查后补强优先级中的 Step 06 | 与当前返工顺序保持一致。 |

## 9. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A: 原样沿用旧 `BR-OBS-*` | 快,保留历史内容多 | 规则类型不规范,对象味道和处理结果太重 | 不采用 |
| 方案 B: 只保留结果表,不补思考层 | 文档更短 | 审查时难以解释规则来源和裁剪依据 | 不采用 |
| 方案 C: 保留现有规则主线,按能力节点和规则类型重写并补足思考层 | 既保留有效边界,又提升可审查性和恢复性 | 文档更长,需要明确下一步仍未进入数据 / 接口 | 采用 |
| 方案 D: 把 OTel / Grafana / cold retention / hash chain 强化成正式规则 | 看起来更“具体” | 会把产品、NFR 和实现方案误写成业务规则 | 不采用 |

### 9.1 关键取舍补充

| 取舍 | 结论 |
|---|---|
| 是否新增“治理约束”类型 | 当前不新增。Observability 的关键是观察面、交接和 no-write 边界,审计约束已经足够承接高风险变化。 |
| 是否拆出单独的“label 安全”规则 | 不单独拆编号,但已并入 `BR-OBS-012` 的指标 / 追踪 / 摘要安全表达边界。 |
| 是否把 report handoff 和证据真实性拆成更多规则 | 当前不再细分编号,`BR-OBS-017~019` 已足够覆盖交接边界和真实性提示。 |
| 是否把 historical material 边界并入相邻仓边界 | 不并入。历史材料污染是本仓独立风险,单独保留 `BR-OBS-026` 更清楚。 |

## 10. 结构化中间产物

### 10.1 规则识别口径

本章只识别以需求层硬约束形式存在的业务规则和边界约束。规则收敛的判断标准是:它是否直接保护 observation material、audit projection、read-only handoff、retention marker、evidence linkage 或 no-write truth 边界,以及它是否能回指某个能力节点、功能需求或仓级边界。对象字段、接口动作、状态机、实现处理和验收门禁不在本章展开。

### 10.2 规则结论

正式规则表采用 `BR-OBS-001~026`,分为六组:

- `C-OBS-1` 安全观测材料入口: `BR-OBS-001~006`
- `C-OBS-2` 审计投影与证据关联: `BR-OBS-007~010`
- `C-OBS-3` 运行观察面安全表达: `BR-OBS-011~014`
- `C-OBS-4` 只读诊断与报告交接: `BR-OBS-015~019`
- `C-OBS-5` 留存与不反写真相边界: `BR-OBS-020~023`
- 全局边界: `BR-OBS-024~026`

### 10.3 类型与映射结论

| 维度 | 结论 |
|---|---|
| 规则类型 | 不变量、禁止行为、显式变化、边界约束、审计约束。 |
| 主要映射对象 | `FR-OBS-001~013` 与 Step 02 / Step 04 边界。 |
| 核心保护主线 | 安全接入、body-free 关联、安全观察面、只读交接、活动引用保护、no-write truth、防止相邻仓和历史材料回流。 |

### 10.4 裁剪结论

| 裁剪项 | 处理口径 |
|---|---|
| 产品栈 / 外部产品 / 配置 | 不进入 Step 10 正式规则,后置架构 / 配置。 |
| DTO / 字段 / 表结构 / 接口 / 事件 schema | 不进入 Step 10 正式规则,后置数据 / 接口 / 详细设计。 |
| 处理结果 / 错误码 / VETO / reject / quarantine | 不进入 Step 10 正式规则,后置测试 / 验收 / 实现。 |
| 真实 `run_id`、evidence alias、final verdict、signoff | 不进入 Step 10 正式规则,留在真实执行与验收阶段。 |

## 11. 回填草稿

以下内容供 Step 17 重建正式 `00-需求文档.md` 时回填到 §10。

```md
## 10. 业务规则与边界约束

> 校准来源:
> - `design-calibration/00_req_step_10_rules_boundary_constraints.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“规则收敛:先思考”“规则与功能需求映射结论”和“跨能力规则审计”小节,了解本章如何从历史规则线索收束为当前需求层硬规则。

### 10.1 业务规则表

正式规则表采用 `BR-OBS-001~026`,按以下六组组织:

- `C-OBS-1` 安全观测材料入口: `BR-OBS-001~006`
- `C-OBS-2` 审计投影与证据关联: `BR-OBS-007~010`
- `C-OBS-3` 运行观察面安全表达: `BR-OBS-011~014`
- `C-OBS-4` 只读诊断与报告交接: `BR-OBS-015~019`
- `C-OBS-5` 留存与不反写真相边界: `BR-OBS-020~023`
- 全局边界: `BR-OBS-024~026`

### 10.2 规则类型与功能映射

规则类型使用 `不变量 / 禁止行为 / 显式变化 / 边界约束 / 审计约束` 五类。所有规则均回指 `FR-OBS-001~013` 或 Step 02 / Step 04 的正式边界结论,用于保护 observation material、audit projection、body-free evidence linkage、只读 report handoff、retention marker 和 no-write truth 不串线。
```

## 12. 自检与门禁

### 12.1 自检

| 检查项 | 结果 |
|---|---|
| 是否每条规则都有编号、类型、内容和约束对象 | pass |
| 是否明确哪些规则在保护核心能力闭环成立 | pass |
| 是否区分不变量、禁止行为、显式变化与边界约束 | pass |
| 是否按需补充了审计约束 | pass |
| 是否没有把实现校验逻辑写成规则 | pass |
| 是否没有把接口约束、事件 schema、DTO 或对象字段写成规则 | pass |
| 是否没有把数据归属矩阵、NFR 或验收门禁写进规则表 | pass |
| 是否未写入正式 `00-需求文档.md` | pass |
| 是否发现阻塞进入下一补强步骤的上游 blocker | no |

### 12.2 门禁

| gate_status | gate_reason | next_allowed_action |
|---|---|---|
| pass | 已完成 Step 10 审查后补强,规则编号、规则类型、规则内容、约束对象、规则与功能映射、能力级规则停审和边界外规则裁剪已收束,且未混写数据归属、接口、NFR、验收或实现方案 | wait_user_or_start_step_06_strengthening_after_confirmation |
