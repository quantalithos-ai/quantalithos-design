# Step 12 接口与依赖

## 0. Step 开工确认

| 项目 | 记录 |
|---|---|
| Step | Step 12 接口与依赖 |
| 输出文件 | `design-calibration/00_req_step_12_interfaces_dependencies.md` |
| 当前模式 | full-restart |
| 当前轮次 | 审查后补强 |
| 已读取项目台账 | yes |
| 已读取需求 flow | yes |
| 已读取前序 Step | yes, 已读取 `00_req_step_06_consumers_dependencies.md`、`00_req_step_09_functional_requirements.md` 与补强后的 `00_req_step_11_data_requirements_ownership.md` |
| 已做一致性反查 | yes, 已回看 Step 02 / 07 / 10 的边界、能力节点和规则结论,仅用于检查接口依赖是否打穿 truth ownership,不把这些材料扩写成接口清单 |
| 已读取 SOP / 书写规范 | yes, 需求 SOP Step 12 与需求书写规范 4.12 |
| 已读取上游粒度参考 | yes, `L1-governance`、`L1-artifact` 的 Step 12 中间产物 |
| 已读取历史材料 | yes, 旧 `README.md`、旧 `00-需求文档.md` 与旧 implementation ledger / boundaries 仅作为 historical material |
| 用户确认 | yes, 用户确认进入 Step 12 补强 |
| 进入条件 | pass |

## 1. Step 内计划

| 模块 | 状态 | 产物 | gate_status | next_allowed_action |
|---|---|---|---|---|
| 开工确认 / 必读文档:先思考 | done | Step 12 目标、输入、禁写范围和接口依赖识别风险诊断 | pass | 进入必读文档再写入。 |
| 开工确认 / 必读文档:再写入 | done | 必读文档摘要、输入索引和执行约束 | pass | 进入接口与依赖收敛先思考。 |
| 接口与依赖收敛:先思考 | done | 接口候选分层、依赖边界分层、能力节点挂载和主表写法诊断 | pass | 进入接口与依赖收敛再写入。 |
| 接口与依赖收敛:再写入 | done | 按能力节点组织的接口与依赖结论、主表、类型结论和映射结论写入 | pass | 进入当前文档问题诊断。 |
| 当前文档问题诊断 | done | 历史材料、旧 Step 12 和当前能力输入的差异诊断 | pass | 进入改动前后对比。 |
| 改动前后对比 | done | 补强前后结构、粒度和接口依赖口径差异表 | pass | 进入设计取舍。 |
| 设计取舍 | done | 主表列约束、编号保留、外部产品裁剪、report handoff 与 no-write 边界取舍 | pass | 进入结构化中间产物。 |
| 结构化中间产物 | done | 对外能力接口表、外部依赖边界表、类型表、全局依赖映射、功能映射、停审和裁剪结论 | pass | 进入回填草稿。 |
| 回填草稿 | done | 正式第 12 章候选草稿 | pass | 进入自检与停审。 |
| 自检与停审 | done | 自检表 / 是否允许进入下一补强 step | pass | wait_user_or_start_step_13_strengthening_after_confirmation |

## 2. 当前停审点

| 项 | 状态 | 说明 |
|---|---|---|
| Step 12 开工 | pass | 已确认当前只允许推进 `00` 的 Step 12 审查后补强。 |
| 必读文档思考 | pass | 已明确 Step 12 只写能力级接口面和能力级依赖边界,不写协议、字段、schema、实现组织、NFR、验收或实施方案。 |
| 必读文档摘要写入 | pass | 已写入 Step 06 / 09 / 11、SOP、书写规范、Step 02 / 07 / 10 反查和历史材料对本步的约束。 |
| 接口依赖收敛思考 | pass | 已完成接口候选、依赖边界、能力节点挂载和主表固定列诊断。 |
| 对外能力接口表写入 | pass | 已形成 `IB-OBS-001~013` 的能力级接口表,主表严格使用 4.12 固定四列。 |
| 外部依赖边界表写入 | pass | 已形成 `DB-OBS-001~014` 的能力级依赖边界表,主表严格使用 4.12 固定六列。 |
| 跨能力接口依赖审计 | pass | 已完成接口类型、依赖类型、全局依赖类型、功能映射、能力级停审和边界外裁剪审计。 |
| 当前文档问题诊断 | pass | 已诊断旧 README、旧 `00` 和旧 Step 12 的失焦点。 |
| 结构化中间产物 | pass | 已整理正式回填所需的最小接口依赖单元。 |
| 回填草稿 | pass | 已形成正式第 12 章候选草稿。 |
| 自检与停审 | pass | Step 12 审查后补强已完成。 |
| 正式文档写入 | blocked | 正式 `00-需求文档.md` 仍等待 Step 17 统一装配。 |
| 当前下一步 | `Step 13 非功能需求（补强）:开工确认 / 必读文档:先思考` |

当前不得直接写正式 `00-需求文档.md`,也不得自动进入 Step 13。下一步只允许在用户确认后进入 `Step 13 非功能需求（补强）`。

## 3. 开工确认 / 必读文档:先思考

### 3.1 本步目标诊断

Step 12 的任务是把 Step 06 的仓际依赖裁剪、Step 09 的功能需求和 Step 11 的数据归属,转译成需求层接口与依赖边界。对 `L4-observability` 来说,这里的接口不是 API、DTO、事件 payload、SDK 方法、查询参数或 port,而是外部消费者能看见的能力级入口和输出面:哪些观察材料可以进入,哪些审计投影可以读取,哪些证据关联只能 body-free,哪些报告交接只读,哪些留存和重放能力不能反写 source truth。

这一章最容易犯六类错。第一类是把 `CreateObservation`、`SearchTrace`、`GetAuditProjection`、`ReportHandoff` 一类接口或对象词直接写成需求接口。第二类是把 Step 06 的仓际依赖表原样复制,导致看不出这些依赖在能力层体现为什么输入 / 输出边界。第三类是把 `L0-bus`、runtime、sandbox、artifact、governance、identity 或 archive 的运行期 / 事件协作关系误写成编译期依赖。第四类是把 DTO、字段、event schema、handler、service、repository、outbox、重试或事务提前写入需求层。第五类是让接口保存 raw body、evidence body、provider response、archive package、final verdict、signoff 或真实执行材料。第六类是把外部产品如 OTel、Prometheus、Grafana、TimescaleDB、对象存储、APM 或 GRC 工具固化成当前核心接口依赖。

### 3.2 必读文档候选

| 文档 | 必读原因 | 预计落点 |
|---|---|---|
| `standards/document/需求文档讨论流程_SOP.md` Step 12 | 固定本步目标、输入、输出、应问问题和能力级停审要求。 | 本步结构、接口 / 依赖映射和停审门禁。 |
| `standards/document/需求文档书写规范.md` 4.12 | 固定接口类型、依赖类型、对外能力接口表、外部依赖边界表和粒度禁区。 | 主表、类型结论、回填草稿和自检项。 |
| `00_req_step_06_consumers_dependencies.md` | 提供编译期 / 运行期 / 事件协作裁剪、禁止依赖和依赖类型基线。 | 判断每条依赖边界的关联方与全局依赖类型。 |
| `00_req_step_09_functional_requirements.md` | 提供 `FR-OBS-001~013` 核心功能和 `FR-OBS-E01~E06` 外围增强功能。 | 接口 / 依赖必须能回指功能需求或明确裁剪。 |
| `00_req_step_11_data_requirements_ownership.md` | 提供真相、快照、引用和禁止保存正文的数据边界。 | 防止接口改变 truth ownership 或携带禁止正文。 |
| `00_req_step_02_position_boundary.md` | 固定本仓只拥有 observation material、audit projection 和 read-only report handoff truth。 | 接口边界与 no-write truth 防线。 |
| `00_req_step_07_core_capability_loop.md` | 固定 `C-OBS-1~5` 的核心能力节点。 | 接口与依赖按能力节点组织。 |
| `00_req_step_10_rules_boundary_constraints.md` | 提供 raw body 禁止、body-free、只读、留存和 no-write 等规则边界。 | 检查接口是否打穿业务规则。 |
| 旧 `README.md` 与旧 `00-需求文档.md` | 提取接口线索,识别旧产品栈、API、对象、指标和验收污染。 | 当前文档问题诊断和改动前后对比。 |
| `projects/L1-governance/design-calibration/00_req_step_12_interfaces_dependencies.md` | 参考能力级接口面与外部依赖边界写法。 | 组织方式和粒度基线。 |
| `projects/L1-artifact/design-calibration/00_req_step_12_interfaces_dependencies.md` | 参考严格先思考、再写入、再审计的 Step 12 粒度。 | 结构层次、停审和固定表头使用方式。 |

### 3.3 初步关注点

- 对外能力接口必须围绕 `C-OBS-1~5` 组织,不能按 API、产品、对象或仓列表组织。
- `L0-core` 是唯一编译期依赖输入;`L0-bus` 只能作为事件协作依赖,不能写成 package dependency。
- `L1-identity`、`L1-governance`、`L1-artifact`、`L2-runtime`、`L4-sandbox` 只提供安全引用、摘要、观测材料或消费语境,不把正文 truth 转入本仓。
- `L4-archive`、reporting consumer、`L5-console`、`L0-sdk` 和外部审计 / GRC 只读消费或交接观察材料,不得反写 observation truth 或 source truth。
- report handoff 只能交接观察线索、脱敏状态、缺口和真实性提示,不能生成最终 verdict、真实 `run_id`、真实 evidence alias 或 signoff。
- replay / rebuild 只作用于观察面和派生投影,不能修复、删除、覆盖或反写 source truth。

### 3.4 本模块停审点

| 项 | 状态 | 说明 |
|---|---|---|
| 本步目标诊断 | pass | 已明确 Step 12 只收口需求层能力接口和依赖边界。 |
| 必读文档候选 | pass | 已固定标准、前序 Step、历史材料和粒度参考。 |
| 初步关注点 | pass | 已明确最易误写的接口、依赖、正文和产品绑定边界。 |
| 接口依赖表写入 | blocked | 当前尚未进入接口与依赖收敛正式写入。 |
| 正式文档写入 | blocked | 正式 `00-需求文档.md` 仍等待 Step 17。 |
| 当前下一步 | `开工确认 / 必读文档:再写入` |

## 4. 开工确认 / 必读文档:再写入

### 4.1 必读文档摘要

| 文档 | 读取结论 | 对 Step 12 的影响 |
|---|---|---|
| `需求文档讨论流程_SOP.md` Step 12 | 本步必须回答本仓对外提供哪些能力级接口、消费哪些能力级输入、哪些同步 / 异步、哪些输入 / 输出、哪些核心 / 外围,并输出按能力节点组织的接口依赖结论。 | 后续必须先围绕能力节点做接口与依赖收敛,再做类型表、映射表和能力级停审。 |
| `需求文档书写规范.md` 4.12 | 对外能力接口主表固定为 `接口类型 / 名称 / 说明 / 所属能力层级`;外部依赖边界主表固定为 `依赖方向 / 依赖类型 / 关联方 / 全局依赖类型 / 说明 / 所属能力层级`。 | 主表不得额外加入 ID、支撑功能、能力节点或协议字段;编号只能作为追溯锚点嵌入名称或说明,详细映射拆到后续表。 |
| Step 06 使用方与依赖 | `L0-core` 是唯一编译期依赖;`L0-bus` 是事件协作主干;identity、governance、artifact、runtime、sandbox 是材料域运行期 / 事件协作关系;archive、console、SDK 是消费 / 交接关系。 | 外部依赖边界必须保留全局依赖类型,且不能把 Step 06 仓依赖表原样复制。 |
| Step 09 功能需求 | 核心功能固定为 `FR-OBS-001~013`;外围增强为 dashboard、alert、报表、外部产品、GRC 导出、异常 / 根因建议等。 | 核心接口 `IB-OBS-001~013` 必须映射到核心功能;外围增强不能挤入核心接口主链。 |
| Step 11 数据归属 | 已固定 observation material、audit projection、body-free evidence linkage、safe runtime observation、report handoff、retention marker、no-write violation 等数据边界,并列出禁止正文。 | 接口只能传递安全观察面、引用、快照、缺口和提示,不得让禁止正文或外部 truth 进入本仓。 |
| Step 02 / 07 / 10 反查 | 仓级边界、五个核心能力节点和业务规则已收束。 | 接口命名和依赖边界都要回到能力节点与规则防线,不能从旧对象或产品栈反推。 |
| 旧 README / 旧 `00` | 旧材料中有 query、diagnostic、report handoff、retention、replay 等线索,也混入 OTel、Prometheus、Grafana、TimescaleDB、对象存储、dashboard、对象词和测试 / 验收词。 | 保留能力方向,重写成需求层接口边界;产品、实现、指标和真实 evidence / run / signoff 线索降级为 historical material。 |
| `L1-governance` / `L1-artifact` Step 12 | 参考项目都把主表保持在规范列,另以映射表承载编号、功能、规则和能力停审。 | 本步采用同样结构,避免主表过载或写成 API / 依赖清单。 |

### 4.2 Step 12 输入索引

| 输入类型 | 已确认来源 | Step 12 使用方式 |
|---|---|---|
| 依赖裁剪输入 | Step 06 | 固定关联方、全局依赖类型和禁止依赖。 |
| 功能输入 | Step 09 | 固定接口必须服务的核心功能和外围增强边界。 |
| 数据归属输入 | Step 11 | 固定接口可承载的数据类别与禁止正文。 |
| 仓边界输入 | Step 02 | 固定本仓只承载观测与审计投影,不拥有业务 truth。 |
| 能力节点输入 | Step 07 | 固定接口与依赖组织顺序。 |
| 规则输入 | Step 10 | 固定 raw body 禁止、body-free、只读交接、留存和 no-write 规则。 |
| 历史线索输入 | 旧 README;旧 `00` | 提取能力方向,识别产品和实现污染。 |
| 粒度参考输入 | `L1-governance`;`L1-artifact` Step 12 | 对齐表格结构、停审层次和补强深度。 |

### 4.3 执行约束

| 约束 | 当前口径 |
|---|---|
| 主表写法 | 对外能力接口表只用 4 列;外部依赖边界表只用 6 列。 |
| 编号写法 | `IB-OBS-*` 放在接口名称列内;`DB-OBS-*` 放在依赖说明内,作为追溯锚点,不新增主表列。 |
| 接口类型写法 | 只使用查询接口、变更接口、事件输出、事件输入、后台任务接口。 |
| 依赖类型写法 | 只使用定义来源依赖、治理结论依赖、下游消费依赖、外部能力依赖。 |
| 全局依赖类型写法 | 保留编译期依赖、运行期依赖、事件协作依赖、不适用 / 外部系统候选等判断;不得把运行期或事件协作写成 package dependency。 |
| 内容禁区 | 不写 API 路径、HTTP / gRPC / RPC 方法、Command / Query 名、DTO / JSON / proto、事件 schema、字段名、handler、service、repository、port、adapter、outbox、重试、fallback、relay、transaction、配置、NFR、验收或实施组织。 |
| truth 边界 | 接口不得保存 raw body、secret、payload body、evidence body、identity body、governance body、runtime body、provider response body、archive package body、final verdict、signoff、真实 `run_id` 或真实 evidence alias。 |
| 正式文档后置 | 当前仍只写 `design-calibration` 中间产物,正式 `00-需求文档.md` 留待 Step 17。 |

### 4.4 下一步输入

`接口与依赖收敛:先思考` 需要完成四件事:一是把接口候选分成“核心闭环接口 / 外围增强接口 / 当前应裁剪”三类;二是把依赖边界分成“正式主链依赖 / 消费交接边界 / 外部候选 / 应禁止依赖”四类;三是确认 `C-OBS-1~5` 分别需要哪些接口与依赖;四是确定哪些编号只做追溯锚点,哪些映射必须拆到主表之后。

### 4.5 当前停审点

| 项 | 状态 | 说明 |
|---|---|---|
| 必读文档摘要 | pass | 已写入标准、Step 06 / 09 / 11、Step 02 / 07 / 10 反查和历史材料对 Step 12 的约束。 |
| 输入索引 | pass | 已明确本步接口依赖来源和一致性反查用途。 |
| 执行约束 | pass | 已明确主表列、类型枚举、编号写法、禁写范围和 truth 边界。 |
| 接口与依赖收敛思考 | pass | 已在 §5 完成候选诊断。 |
| 正式文档写入 | blocked | 正式 `00-需求文档.md` 仍等待 Step 17。 |
| 当前下一步 | `接口与依赖收敛:先思考` |

## 5. 接口与依赖收敛:先思考

### 5.1 收敛目标

本模块只诊断“哪些接口与依赖应该进入正式 Step 12,哪些不应该”,不直接写最终主表。对 `L4-observability` 来说,合格的接口 / 依赖边界必须同时满足五个条件。第一,它必须支撑 `C-OBS-1~5` 的核心能力或明确属于外围增强。第二,它必须能回指 `FR-OBS-*` 或 Step 06 依赖裁剪。第三,它必须尊重 Step 11 的数据归属和禁止正文。第四,它必须不改变 source owner、governance、artifact、identity、runtime、archive 或 report consumer 的 truth ownership。第五,它必须停留在需求层能力接口,不滑入协议、schema 或实现机制。

### 5.2 接口候选分层

| 类别 | 判断标准 | 当前处理方式 |
|---|---|---|
| 核心闭环接口 | 直接决定安全观测材料入口、审计投影、运行观察面、只读诊断 / 交接、留存 / no-write 能否成立。 | 保留进对外能力接口主表。 |
| 外围增强接口 | 有消费价值,但不决定核心闭环成立,例如高级 dashboard、复杂 alert、外部 GRC 导出或异常建议。 | 不进入核心接口主链;作为外围增强和依赖候选说明。 |
| 当前应裁剪接口 | 实际是 API、Command、DTO、事件名、字段、产品接口、UI 页面、测试证据或验收签署。 | 不进入 Step 12 主表,只进入边界外裁剪结论。 |

### 5.3 依赖边界分层

| 类别 | 判断标准 | 当前处理方式 |
|---|---|---|
| 正式主链依赖 | 直接支撑核心观察面材料、审计投影、证据关联、运行观察、留存或 no-write 防线。 | 保留进外部依赖边界主表。 |
| 消费 / 交接边界 | 本仓输出需被 archive、console、SDK、report consumer 或审查方只读消费。 | 保留,但明确不产生 truth 转移。 |
| 外部候选 | 外部观测、存储、展示、GRC、alert 或 analysis 产品能力可能后续需要。 | 作为外围增强或后续架构 / 配置候选,不成为当前核心前置。 |
| 应禁止依赖 | 会引入 source truth 写入、正文 ownership、执行控制、最终裁决、真实 evidence 或产品锁定。 | 裁剪并在禁区表中说明正确归属。 |

### 5.4 核心能力接口与依赖方向诊断

| 能力节点 | 需要保留的接口方向 | 需要保留的依赖方向 | 原因 |
|---|---|---|---|
| `C-OBS-1` 安全观测材料入口 | 安全观测材料入口、观测材料安全处置、来源与关联语境读取 | `L0-core` 共享契约、`L0-bus` 事件协作、source owner 安全引用 / 摘要 / 观测材料 | 没有这组边界,材料无法安全进入、解释、拒绝或隔离。 |
| `C-OBS-2` 审计投影与证据关联 | 审计投影读取、body-free 证据关联读取 | governance、artifact、identity、source owner 和 report consumer 的安全引用 / 审查语境 | 没有这组边界,审计投影会退化为正文副本或不可解释引用。 |
| `C-OBS-3` 运行观察面安全表达 | 安全运行观察面读取、观察输出降级表达 | runtime、sandbox、bus、console / SDK / diagnostic consumer | 没有这组边界,log / metric / trace 会退化为 raw 输出或执行 truth。 |
| `C-OBS-4` 只读诊断与报告交接 | 只读观测查询、只读诊断视图、报告与证据交接、证据真实性提示 | artifact / evidence refs、archive、reporting consumer、governance 审查语境 | 没有这组边界,查询和交接会退化为控制命令、最终裁决或伪证入口。 |
| `C-OBS-5` 留存与不反写真相边界 | 留存标记与活动引用保护、观察面重放 / 重建与 no-write 防护 | archive 交接、source owner 引用、bus / runtime / sandbox 观察材料、维护 / 审计消费边界 | 没有这组边界,观察材料会被越权清理、错误重建或反写 source truth。 |

### 5.5 同步 / 异步与输入 / 输出判断

| 判断项 | 当前口径 |
|---|---|
| 同步能力边界 | 只读查询、来源语境读取、审计投影读取、证据关联读取、安全运行观察面读取、只读诊断、真实性提示等查询型能力。 |
| 同步变更边界 | 观测材料安全处置、报告与证据交接、留存标记与活动引用保护等需求层正式处置或交接能力。 |
| 异步能力边界 | 安全观测材料进入、bus tap / audit material、观察输出降级、审计投影输出、留存冲突、no-write violation、report handoff 状态等事件输入 / 输出能力。 |
| 后台能力边界 | 观察面重放 / 重建与 no-write 防护,只作用于观察面和派生投影。 |
| 输入型依赖 | core 契约、bus 协作、source refs / summaries、runtime / sandbox 观测来源、evidence refs、identity refs、governance / artifact / archive / report 语境。 |
| 输出型结果 | 安全观察面、审计投影、body-free 证据关联、诊断摘要、降级标记、报告交接材料、留存标记、no-write violation 和只读查询结果。 |

### 5.6 编号与主表写法判断

| 项 | 当前口径 |
|---|---|
| `IB-OBS-*` | 放入对外能力接口表的名称列,例如 `` `IB-OBS-001` 安全观测材料入口``。 |
| `DB-OBS-*` | 放入外部依赖边界表的说明列开头,例如 `` `DB-OBS-001`: 使用共享 ID...``。 |
| 功能映射 | 不进入主表,拆到 `接口 / 依赖与功能需求映射结论`。 |
| 能力节点映射 | 不进入主表,拆到按能力节点组织表和能力级停审表。 |
| 外围增强 | 可在依赖边界表中标为外围增强能力,但不反向扩大核心闭环。 |

### 5.7 当前停审点

| 项 | 状态 | 说明 |
|---|---|---|
| 接口候选诊断 | pass | 已识别核心闭环、外围增强和裁剪三类接口候选。 |
| 依赖边界诊断 | pass | 已识别正式主链、消费交接、外部候选和禁止依赖四类边界。 |
| 能力节点挂载 | pass | 已明确五个能力节点分别需要的接口和依赖方向。 |
| 同步 / 异步与输入 / 输出判断 | pass | 已明确查询、变更、事件、后台任务和依赖方向口径。 |
| 主表写法判断 | pass | 已明确编号和映射不破坏 4.12 固定表头。 |
| 接口依赖表写入 | pass | 已在 §10 写入正式结构化结论。 |
| 当前下一步 | `接口与依赖收敛:再写入` |

## 6. 接口与依赖收敛:再写入

### 6.1 写入原则

正式接口与依赖表达只记录外部可见的能力入口、输出面、输入面和依赖边界。它不记录协议、路径、方法、payload、字段、topic、订阅、handler、service、repository、port、adapter、outbox、重试、事务、配置或存储产品。对 `L4-observability` 来说,Step 12 的首要价值是证明横切观察面能被安全接入、审计投影能被只读消费、证据关联保持 body-free、运行观察不会变成执行 truth、报告交接不会伪造成验收结论、留存和重建不会反写 source truth。

### 6.2 写入结论

本步正式结构化结论写入 §10。主表遵守 4.12 固定列,编号、功能映射、能力映射、类型结论和裁剪结论均拆到独立表或说明中。后续 Step 13 非功能需求只能围绕这些已收口接口与依赖边界提出质量要求,不得新增 API、外部产品依赖或 truth owner。

## 7. 当前文档问题诊断

| 输入 | 当前表现 | 诊断 | 处理口径 |
|---|---|---|---|
| 旧 README | 将 OTel、Prometheus、Grafana、TimescaleDB、对象存储、dashboard、alert sink 与观测平台能力强绑定。 | 产品栈和存储展示能力被误当成需求接口依赖。 | 降级为 historical material;只保留“产品中立采集 / 存储 / 展示 / 导出能力候选”的外围增强表达。 |
| 旧 `00-需求文档.md` | 已有 query、diagnostic、report handoff、retention、replay、evidence linkage 等线索。 | 方向可用,但夹带对象词、DTO 倾向、输入输出细节、性能 / 验收暗示和外部产品候选。 | 保留能力语义,重写为 4.12 能力级接口和依赖边界。 |
| 当前较短旧 Step 12 | 已有 `IB-OBS-*` 和 `DB-OBS-*` 方向。 | 主表带额外 ID / 支撑功能列,不完全符合 4.12 固定表头;思考、诊断、取舍和停审层不够。 | 本轮补足 0~12 完整结构,主表恢复规范列,映射拆出。 |
| Step 06 使用方与依赖 | 已固定依赖裁剪和全局依赖类型。 | 若原样复制,会变成仓际依赖表而不是能力接口边界。 | 只承接关联方和依赖类型,重新表达为能力输入 / 输出边界。 |
| Step 09 功能需求 | 已形成 `FR-OBS-001~013` 和外围增强功能。 | 若从旧接口反推功能,会出现孤儿接口。 | 每个核心接口必须回指功能需求。 |
| Step 11 数据归属 | 已列出真相、快照、引用和禁止正文。 | 若接口没有继承禁止正文,会打穿数据归属。 | 所有接口均以 safe refs、summary、projection、marker、gap、hint 为边界。 |

## 8. 改动前后对比

| 项 | 补强前 | 补强后 | 原因 |
|---|---|---|---|
| Step 结构 | 直接给 SOP 问题回答、表格和自检 | 补足开工确认、计划、停审点、先思考 / 再写入、诊断、对比、取舍、结构化产物、回填和自检 | 对齐 Step 09 / Step 11 补强粒度。 |
| 对外接口主表 | 带 `ID` 和 `支撑功能` 等额外列 | 使用 `接口类型 / 名称 / 说明 / 所属能力层级` 四列 | 对齐需求书写规范 4.12。 |
| 外部依赖主表 | 带 `ID` 和 `支撑功能` 等额外列 | 使用 `依赖方向 / 依赖类型 / 关联方 / 全局依赖类型 / 说明 / 所属能力层级` 六列 | 对齐需求书写规范 4.12。 |
| 编号处理 | 编号作为主表独立列 | `IB-OBS-*` 进入名称;`DB-OBS-*` 进入说明;功能映射拆表 | 保留追溯能力,避免破坏标准主表。 |
| 依赖表达 | 容易接近 Step 06 仓依赖复制 | 表达为能力级输入、输出、消费和交接边界 | Step 12 负责能力接口面,不是仓际依赖清单。 |
| 外部产品 | 曾作为候选依赖线索出现 | 只保留为外围增强或后续架构 / 配置候选 | 避免需求层产品锁定。 |
| report handoff | 容易被误读为验收结果或签署 | 明确只交接观察线索、脱敏状态、缺口和真实性提示 | 不伪造 final verdict、真实 evidence、真实 `run_id` 或 signoff。 |
| replay / rebuild | 容易被误读为 source truth 修复 | 明确只作用于观察面和派生投影 | 保持 no-write truth 边界。 |

## 9. 设计取舍

| 取舍 | 结论 |
|---|---|
| 是否写 API 路径、Command / Query 名、SDK 方法或事件名 | 不采用。Step 12 只写能力级接口面,协议和命名后移 `03-详细设计`。 |
| 是否把 Step 06 仓依赖表原样复制 | 不采用。Step 12 只说明依赖关系在需求层体现为哪些输入、输出、查询、变更、事件或交接能力边界。 |
| 是否把 `L0-bus` 写成编译期依赖 | 不采用。`L0-bus` 固定为事件协作依赖,不得进入 package dependency。 |
| 是否把外部观测产品写成正式接口依赖 | 不采用。OTel、Prometheus、Grafana、TimescaleDB、对象存储、APM 和 GRC 工具后移架构 / 配置 / 测试裁剪。 |
| 是否把 report handoff 写成验收签署接口 | 不采用。报告交接只提供观察材料线索、脱敏状态、缺口和真实性提示,不得生成最终 verdict、真实 `run_id`、真实 evidence alias 或 signoff。 |
| 是否把 evidence linkage 写成 evidence body 接口 | 不采用。只允许 body-free 引用、缺口和真实性提示;artifact / evidence 正文仍归 `L1-artifact`。 |
| 是否把 runtime observation 写成执行控制接口 | 不采用。本仓只提供安全运行观察面,不下发执行命令,不拥有 execution truth。 |
| 是否把 replay / rebuild 写成 source truth 修复接口 | 不采用。重放 / 重建只作用于观察面和派生投影,不得修复、删除、覆盖或反写 source truth。 |
| 是否把 console / dashboard 写成本仓 UI 接口 | 不采用。Console / dashboard 是下游消费或外围增强,不能反向定义本仓 truth。 |

## 10. 结构化中间产物

### 10.1 按能力节点组织的接口与依赖结论

| 能力节点 | 对外能力接口 | 外部依赖边界 | 停审口径 |
|---|---|---|---|
| `C-OBS-1` 安全观测材料入口 | 安全观测材料入口;观测材料安全处置;来源与关联语境读取 | `L0-core` 共享契约;`L0-bus` 事件协作;source owner 安全引用 / 摘要 / 观测材料 | 接口只能准入、拒绝、隔离、关联或说明材料,不得接收 raw body、secret、payload body 或写 source truth。 |
| `C-OBS-2` 审计投影与证据关联 | 审计投影读取;body-free 证据关联读取 | Governance / Artifact / Identity / runtime / source owner 引用;报告 / 审查消费方 | 接口只提供只读投影、引用和缺口,不得保存 evidence body 或替代外部 truth。 |
| `C-OBS-3` 运行观察面安全表达 | 安全运行观察面读取;观察输出降级表达 | runtime / sandbox 观测来源;bus 事件协作;console / SDK / diagnostic consumer | 接口只能输出安全观察面和降级表达,不得输出 raw log、raw prompt、provider response 或执行裁决。 |
| `C-OBS-4` 只读诊断与报告交接 | 只读观测查询;只读诊断视图;报告与证据交接;证据真实性提示 | archive / report / external audit 消费边界;Artifact / evidence refs;Governance 审查语境 | 查询、诊断和报告交接只读,不得下发控制命令或生成最终验收结论。 |
| `C-OBS-5` 留存与不反写真相边界 | 留存标记与活动引用保护;观察面重放 / 重建与 no-write 防护 | archive 交接;source owner 引用;维护 / 审计消费边界 | 后台能力只作用于观察面、留存标记和派生投影,不得修复、删除、覆盖或反写 source truth。 |

### 10.2 对外能力接口结论

| 接口类型 | 名称 | 说明 | 所属能力层级 |
|---|---|---|---|
| 事件输入 | `IB-OBS-001` 安全观测材料入口 | 对外体现为接收跨域观测材料并进入安全准入语境的能力入口。 | 核心闭环能力 |
| 变更接口 | `IB-OBS-002` 观测材料安全处置 | 对外体现为对不可安全表达、来源不可信或包含敏感正文风险的材料进行需求层处置的能力入口。 | 核心闭环能力 |
| 查询接口 | `IB-OBS-003` 来源与关联语境读取 | 对外体现为读取观测材料来源、关联语境、脱敏状态和可解释上下文的能力入口。 | 核心闭环能力 |
| 查询接口 | `IB-OBS-004` 审计投影读取 | 对外体现为读取只读审计投影、来源语境、责任主体语境和缺口说明的能力入口。 | 核心闭环能力 |
| 查询接口 | `IB-OBS-005` Body-free 证据关联读取 | 对外体现为读取不含正文的证据关联、引用语境和缺口信息的能力入口。 | 核心闭环能力 |
| 查询接口 | `IB-OBS-006` 安全运行观察面读取 | 对外体现为读取安全日志、指标、追踪和运行观察摘要的能力入口。 | 核心闭环能力 |
| 事件输出 | `IB-OBS-007` 观察输出降级表达 | 对外体现为材料缺失、不可见、不可安全输出或来源不完整时可被消费的降级输出能力。 | 核心闭环能力 |
| 查询接口 | `IB-OBS-008` 只读观测查询 | 对外体现为人类和系统消费者以只读方式查看安全观察面的能力入口。 | 核心闭环能力 |
| 查询接口 | `IB-OBS-009` 只读诊断视图 | 对外体现为聚合安全观察线索、缺口和诊断摘要的只读能力入口。 | 核心闭环能力 |
| 变更接口 | `IB-OBS-010` 报告与证据交接 | 对外体现为向报告、归档准备或验收审查交接观察材料线索、脱敏状态和缺口说明的能力入口。 | 核心闭环能力 |
| 查询接口 | `IB-OBS-011` 证据真实性提示 | 对外体现为区分真实执行证据、待补齐材料和设计期占位的提示能力入口。 | 核心闭环能力 |
| 变更接口 | `IB-OBS-012` 留存标记与活动引用保护 | 对外体现为建立或调整留存标记、活动引用保护和冲突语境的能力入口。 | 核心闭环能力 |
| 后台任务接口 | `IB-OBS-013` 观察面重放 / 重建与 no-write 防护 | 对外体现为对观察面和派生投影进行受控重放 / 重建,并发现 no-write violation 的后台能力入口。 | 核心闭环能力 |

### 10.3 外部依赖边界结论

| 依赖方向 | 依赖类型 | 关联方 | 全局依赖类型 | 说明 | 所属能力层级 |
|---|---|---|---|---|---|
| 输入 | 定义来源依赖 | `L0-core` | 编译期依赖 | `DB-OBS-001`: 使用共享 ID、typed ref、trace、metadata、error、安全 marker 和基础契约语境。 | 核心闭环能力 |
| 输入 / 输出 | 外部能力依赖 | `L0-bus` | 事件协作依赖 | `DB-OBS-002`: 通过事件协作消费 tap / audit material 并输出观察、降级、留存或交接材料。 | 核心闭环能力 |
| 输入 / 输出 | 外部能力依赖 | `L1-identity` | 运行期 / 事件协作依赖 | `DB-OBS-003`: 消费 actor / subject 安全引用和身份相关审计材料,输出身份相关观察面或缺口。 | 核心闭环能力 |
| 输入 / 输出 | 治理结论依赖 | `L1-governance` | 运行期 / 事件协作依赖 | `DB-OBS-004`: 消费治理事实相关审计语境,输出审计投影、缺口和报告交接材料。 | 核心闭环能力 |
| 输入 / 输出 | 外部能力依赖 | `L1-artifact` | 运行期 / 事件协作依赖 | `DB-OBS-005`: 消费 artifact / evidence 安全引用,输出 body-free 证据关联和报告交接线索。 | 核心闭环能力 |
| 输入 / 输出 | 外部能力依赖 | `L2-runtime` | 运行期 / 事件协作依赖 | `DB-OBS-006`: 消费运行 trace、metric、log 和诊断材料来源,输出安全运行观察面和诊断摘要。 | 核心闭环能力 |
| 输入 / 输出 | 外部能力依赖 | `L4-sandbox` | 运行期 / 事件协作依赖 | `DB-OBS-007`: 消费 sandbox isolation、job 或环境相关观测材料,输出 sandbox 相关诊断缺口或观察摘要。 | 核心闭环能力 |
| 输出 | 下游消费依赖 | `L4-archive` | 运行期 / 事件协作依赖 | `DB-OBS-008`: 输出留存标记、归档准备、长期交接和可引用材料边界,不拥有 archive package。 | 核心闭环能力 |
| 输出 | 下游消费依赖 | `L5-console` / `L0-sdk` | 运行期依赖 | `DB-OBS-009`: 输出只读查询、诊断摘要和安全观察面供上层展示或访问,不得被反写。 | 核心闭环能力 / 外围增强能力 |
| 输出 | 下游消费依赖 | reporting consumer | 运行期依赖 | `DB-OBS-010`: 输出报告交接材料、脱敏状态、缺口说明和证据真实性提示。 | 核心闭环能力 |
| 输出 | 下游消费依赖 | external audit / GRC consumer | 不适用 | `DB-OBS-011`: 可在外围增强中导出安全审计材料,但不改变本仓 truth 边界。 | 外围增强能力 |
| 输入 / 输出 | 外部能力依赖 | 产品中立采集 / 存储 / 展示 / 导出能力 | 不适用 | `DB-OBS-012`: 仅作为后续架构 / 配置候选,当前不绑定 OTel、Prometheus、Grafana、TimescaleDB 或对象存储。 | 外围增强能力 |
| 输出 | 下游消费依赖 | alert / notification consumer | 不适用 | `DB-OBS-013`: 可在外围增强中消费观察输出形成告警,但 alert 不等于业务 truth 或执行裁决。 | 外围增强能力 |
| 输入 / 输出 | 外部能力依赖 | anomaly / root-cause analysis consumer | 不适用 | `DB-OBS-014`: 可在外围增强中消费安全观察摘要形成建议,但建议不得替代诊断边界或 source truth。 | 外围增强能力 |

### 10.4 接口类型结论

| 接口类型 | 本仓使用情况 |
|---|---|
| 查询接口 | 来源与关联语境读取;审计投影读取;body-free 证据关联读取;安全运行观察面读取;只读观测查询;只读诊断视图;证据真实性提示 |
| 变更接口 | 观测材料安全处置;报告与证据交接;留存标记与活动引用保护 |
| 事件输出 | 观察输出降级表达;审计投影 / 留存 / no-write / report handoff 相关能力输出 |
| 事件输入 | 安全观测材料入口;bus tap / audit material;source owner 观测材料输入 |
| 后台任务接口 | 观察面重放 / 重建与 no-write 防护 |

### 10.5 依赖类型结论

| 依赖类型 | 本仓使用情况 |
|---|---|
| 定义来源依赖 | `L0-core` 共享契约、typed ref、trace、metadata、error、安全 marker 和基础 contract 语境 |
| 治理结论依赖 | `L1-governance` 治理事实审计语境、报告交接审查语境和治理相关缺口输入 |
| 下游消费依赖 | `L4-archive`、`L5-console`、`L0-sdk`、reporting consumer、external audit / GRC consumer、alert consumer 等消费安全观察面、审计投影或交接材料 |
| 外部能力依赖 | `L0-bus`、`L1-identity`、`L1-artifact`、`L2-runtime`、`L4-sandbox` 以及产品中立采集 / 存储 / 展示 / 导出能力候选 |

### 10.6 能力边界与全局依赖类型映射结论

| 能力边界 | 关联方 | 全局依赖类型 | 约束 |
|---|---|---|---|
| 共享契约输入 | `L0-core` | 编译期依赖 | 唯一允许进入编译期依赖的上游。 |
| 事件协作和 tap / audit material 输入 | `L0-bus` | 事件协作依赖 | 不得转写成 package dependency,也不得拥有 bus truth。 |
| 身份相关观测输入 / 输出 | `L1-identity` | 运行期 / 事件协作依赖 | 只消费 actor / subject 安全引用和审计材料,不保存 identity body。 |
| 治理审计与报告交接 | `L1-governance` | 运行期 / 事件协作依赖 | 只输出审计投影和缺口,不替代 Governance decision。 |
| Artifact / evidence 关联 | `L1-artifact` | 运行期 / 事件协作依赖 | 只保存 body-free 证据关联,不保存 evidence body。 |
| 运行观察面 | `L2-runtime` / `L4-sandbox` | 运行期 / 事件协作依赖 | 只表达安全观察面,不拥有 execution truth。 |
| 留存和报告交接 | `L4-archive` / reporting consumer | 运行期 / 事件协作依赖 | 只交接观察材料和缺口,不拥有 archive package 或 final verdict。 |
| 查询和展示消费 | `L5-console` / `L0-sdk` | 运行期依赖 | 只读消费,不得反写本仓 truth 或 source truth。 |
| 外部观测 / GRC / alert / analysis 产品 | external systems | 不适用 | 仅为外围增强候选,不得成为当前核心闭环前置。 |

### 10.7 接口 / 依赖与功能需求映射结论

| 功能需求 | 对外能力接口 | 外部依赖边界 |
|---|---|---|
| `FR-OBS-001` 安全观测材料准入 | `IB-OBS-001` | `DB-OBS-001`;`DB-OBS-002` |
| `FR-OBS-002` 来源与关联语境表达 | `IB-OBS-003` | `DB-OBS-001`;`DB-OBS-003`;`DB-OBS-004`;`DB-OBS-005` |
| `FR-OBS-003` 观测材料安全处置 | `IB-OBS-002` | `DB-OBS-001`;`DB-OBS-002` |
| `FR-OBS-004` 审计投影表达 | `IB-OBS-004` | `DB-OBS-003`;`DB-OBS-004`;`DB-OBS-005` |
| `FR-OBS-005` Body-free 证据关联 | `IB-OBS-005` | `DB-OBS-005`;`DB-OBS-010` |
| `FR-OBS-006` 运行观察面安全表达 | `IB-OBS-006` | `DB-OBS-002`;`DB-OBS-006`;`DB-OBS-007` |
| `FR-OBS-007` 观察输出降级表达 | `IB-OBS-007` | `DB-OBS-002`;`DB-OBS-006`;`DB-OBS-009` |
| `FR-OBS-008` 只读观测查询 | `IB-OBS-008` | `DB-OBS-009` |
| `FR-OBS-009` 只读诊断视图 | `IB-OBS-009` | `DB-OBS-006`;`DB-OBS-007`;`DB-OBS-009` |
| `FR-OBS-010` 报告与证据交接 | `IB-OBS-010` | `DB-OBS-005`;`DB-OBS-008`;`DB-OBS-010` |
| `FR-OBS-011` 证据真实性提示 | `IB-OBS-011` | `DB-OBS-005`;`DB-OBS-010` |
| `FR-OBS-012` 留存约束与活动引用保护 | `IB-OBS-012` | `DB-OBS-008`;`DB-OBS-010` |
| `FR-OBS-013` 观察面重放 / 重建与 no-write 防护 | `IB-OBS-013` | `DB-OBS-001`;`DB-OBS-002`;`DB-OBS-006`;`DB-OBS-007` |
| `FR-OBS-E01~E06` 外围增强 | 不进入核心接口表;按需消费核心只读观察面或安全摘要 | `DB-OBS-011`;`DB-OBS-012`;`DB-OBS-013`;`DB-OBS-014` |

### 10.8 能力级接口停审结论

| 能力节点 | 接口 / 依赖覆盖 | 停审结论 |
|---|---|---|
| `C-OBS-1` 安全观测材料入口 | `IB-OBS-001~003`;`DB-OBS-001~002` 覆盖安全入口、处置和来源关联语境 | pass,足以进入 Step 13 非功能需求讨论 |
| `C-OBS-2` 审计投影与证据关联 | `IB-OBS-004~005`;`DB-OBS-003~005`;`DB-OBS-010` 覆盖审计投影和 body-free 证据关联 | pass,足以进入 Step 13 非功能需求讨论 |
| `C-OBS-3` 运行观察面安全表达 | `IB-OBS-006~007`;`DB-OBS-002`;`DB-OBS-006~007`;`DB-OBS-009` 覆盖安全运行观察面和降级输出 | pass,足以进入 Step 13 非功能需求讨论 |
| `C-OBS-4` 只读诊断与报告交接 | `IB-OBS-008~011`;`DB-OBS-005`;`DB-OBS-008~010` 覆盖只读查询、诊断、报告交接和真实性提示 | pass,足以进入 Step 13 非功能需求讨论 |
| `C-OBS-5` 留存与不反写真相边界 | `IB-OBS-012~013`;`DB-OBS-001~002`;`DB-OBS-006~008`;`DB-OBS-010` 覆盖留存、活动引用、重放 / 重建和 no-write 防护 | pass,足以进入 Step 13 非功能需求讨论 |

### 10.9 边界外接口依赖裁剪结论

| 裁剪候选 | 不进入原因 | 正确处理 |
|---|---|---|
| API 路径、RPC、Command / Query 名、SDK 方法 | 属于协议或实现层 | 后移 `03-详细设计` |
| DTO、JSON、proto、事件 schema、字段名 | 属于字段和契约细节 | 后移 `03-详细设计` |
| handler、service、repository、port、adapter、outbox、retry、fallback、relay、transaction | 属于实现组织和可靠性机制 | 后移架构 / 详细设计 / 实施计划 |
| TimescaleDB、Grafana、Prometheus、OTel Collector、对象存储 | 属于外部产品或存储选型候选 | 后移 `01` / `04` / `05` / `07` |
| console UI 页面、dashboard 布局和可视化编排 | 属于产品 / UI 或外围增强 | 不进入核心接口;可作为外围消费能力 |
| source truth 修复、删除、覆盖接口 | 会打穿 no-write truth 边界 | 只允许输出缺口、冲突或 no-write violation |
| final verdict、真实 evidence alias、真实 `run_id`、signoff 生成接口 | 会伪造测试证据或验收签署 | 不进入设计期接口 |

### 10.10 跨能力接口依赖审计

| 审计项 | 结论 |
|---|---|
| 是否存在没有功能来源的接口边界 | no |
| 是否存在功能需要外部协作但无依赖承接 | no |
| 是否把运行期 / 事件协作依赖写成编译期依赖 | no |
| 是否把 Step 06 仓依赖表原样重抄 | no |
| 是否存在同一外部能力重复定义且依赖类型冲突 | no |
| 是否存在接口允许保存 Step 11 禁止正文 | no |
| 是否存在接口允许反写 source truth | no |
| 是否写 API 路径、DTO、事件 schema、字段或实现 port | no |
| 是否未写入正式 `00-需求文档.md` | pass |

## 11. 回填草稿

正式第 12 章应包含对外能力接口表、外部依赖边界表、接口类型结论、依赖类型结论、能力边界与全局依赖类型映射表、接口 / 依赖与功能需求映射表。候选正文如下:

### 12.1 对外能力接口

采用本文件 §10.2 的 `IB-OBS-001~013`。这些编号只代表需求层能力接口边界,不代表 API、Command、Query、事件名、DTO、service、port 或 adapter。

### 12.2 外部依赖边界

采用本文件 §10.3 的 `DB-OBS-001~014`。当前唯一编译期依赖是 `L0-core`;`L0-bus` 是事件协作依赖;source owner 和 consumer 只通过运行期、事件协作或交接边界参与;外部观测、GRC、alert 和 analysis 产品只作为外围增强候选。

### 12.3 类型与映射

采用本文件 §10.4~§10.8 的接口类型、依赖类型、全局依赖类型映射、接口 / 依赖与功能需求映射和能力级接口停审结论。后续 Step 13 非功能需求必须基于这些能力边界表达质量约束,不得反向新增接口或外部产品依赖。

## 12. 自检与门禁

### 12.1 自检

| 检查项 | 结果 |
|---|---|
| 是否明确对外能力接口面 | pass |
| 是否明确外部依赖边界面 | pass |
| 是否使用正式接口类型:查询接口、变更接口、事件输出、事件输入、后台任务接口 | pass |
| 是否使用正式依赖类型:定义来源依赖、治理结论依赖、下游消费依赖、外部能力依赖 | pass |
| 是否承接 Step 06 的编译期 / 运行期 / 事件协作裁剪 | pass |
| 是否区分核心闭环能力和外围增强能力 | pass |
| 是否每个接口 / 依赖都能回指能力节点和功能需求 | pass |
| 是否没有把 Step 06 仓依赖表原样复制 | pass |
| 是否没有写 API 路径、HTTP / gRPC / RPC 方法签名、Command 名、DTO / JSON / proto、事件 schema 或字段名 | pass |
| 是否没有写 handler、service、repository、port、adapter、outbox、重试、fallback、relay、transaction、配置、NFR 或验收 | pass |
| 是否没有让接口保存 Step 11 禁止正文或反写 source truth | pass |
| 是否未写入正式 `00-需求文档.md` | pass |
| 是否发现阻塞进入 Step 13 的上游 blocker | no |

### 12.2 门禁

| gate_status | gate_reason | next_allowed_action |
|---|---|---|
| pass | 对外能力接口、外部依赖边界、接口类型、依赖类型、全局依赖类型映射、功能映射、能力级接口停审和边界外接口裁剪已收束,且未混写协议、字段、实现、非功能或验收方案 | wait_user_or_start_step_13_strengthening_after_confirmation |
