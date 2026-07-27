# L3-capability-hub 02 概要 Step 2: 明确本仓设计目标与当前范围

> 创建日期: 2026-07-08
> 状态: completed_wait_user_review
> 当前模式: full-restart
> 文档级 flow: `design-calibration/02_hld_calibration_flow.md`
> 项目级台账: `design-calibration/project_execution_ledger.md`
> 正式文档目标: `projects/L3-capability-hub/02-概要设计.md`
> 本轮口径: 只基于新版 `00-需求文档.md`、新版 `01-架构设计.md` 和 Step 1 已收稳输入,收敛概要设计目标、非范围和深度;旧材料只作差异审计。

---

## 0. Step 开工确认

| 项目 | 记录 |
|---|---|
| Step | Step 2 明确本仓设计目标与当前范围 |
| 输出文件 | `design-calibration/02_hld_step_02_goals_scope.md` |
| 已读取项目级台账 | yes:`design-calibration/project_execution_ledger.md` |
| 已读取文档级 flow | yes:`design-calibration/02_hld_calibration_flow.md` |
| 已读取前序 Step | yes:`design-calibration/02_hld_step_01_upstream_boundary.md` |
| 已读取 SOP / 书写规范 | yes:`概要设计讨论流程_SOP.md` Step 2;`概要设计书写规范.md` §4.2 |
| 已读取正式输入 | yes:`00-需求文档.md`;`01-架构设计.md` |
| 旧材料处理 | 旧 `02-概要设计.md` 只作后置差异审计 |
| 进入条件 | pass |
| next_allowed_action | Step 2 已完成,等待用户确认后进入 Step 3。 |

---

## 1. Step 内计划

| 模块 | 状态 | 产物 | gate_status | next_allowed_action |
|---|---|---|---|---|
| 必读文档读取 | done | 必读文档摘要 | pass | 进入整体模块骨架。 |
| 整体模块搭建 | done | Step 2 输出结构 | pass | 进入设计目标思考。 |
| 设计目标:先思考 | done | 本轮概要要收稳的结构判断 | pass | 进入设计目标写入。 |
| 设计目标:再写入 | done | 设计目标表 | pass | 进入非范围思考。 |
| 非范围:先思考 | done | 本轮概要明确排除的内容判断 | pass | 进入非范围写入。 |
| 非范围:再写入 | done | 非范围表 | pass | 进入设计深度思考。 |
| 设计深度:先思考 | done | 概要层与详细设计层分界判断 | pass | 进入设计深度写入。 |
| 设计深度:再写入 | done | 当前阶段设计深度口径 | pass | 进入旧材料差异审计。 |
| 旧材料差异审计 | done | 差异审计表 | pass | 进入回填草稿与停审。 |
| 自检与停审 | done | 完成门禁 | pass | 等待用户确认 Step 3。 |

---

## 2. 必读文档

| 文档 | 读取结论 | 对 Step 2 的影响 |
|---|---|---|
| `standards/document/概要设计讨论流程_SOP.md` Step 2 | Step 2 只回答“本轮概要设计收什么、不收什么、停在什么深度”。 | 本 Step 必须产出设计目标表、非范围表和当前阶段设计深度口径。 |
| `standards/document/概要设计书写规范.md` §4.2 | 设计目标应写结构轮廓,非范围应写边界归属和不进入原因,不能写成功能项、技术选型或实施任务。 | 目标必须围绕结构稳定性,不能回滑到 `FR-CH-*` 清单或旧技术主线。 |
| `design-calibration/02_hld_step_01_upstream_boundary.md` | Step 1 已明确 `02` 只承接 capability identity、registry、descriptor、seam、relation、formal exposure / controlled consumer view 和数据 / 交互分层输入。 | Step 2 的范围必须从 Step 1 的 `本文必须回答` 清单继续下沉。 |
| `projects/L3-capability-hub/00-需求文档.md` | 当前需求主线是 capability access truth、`C-CH-1~5`、`FR-CH-001~016`、严格边界红线和可落码验收约束。 | 设计目标必须围绕核心闭环结构,不能恢复旧 `ProviderContract / Cost / QueryCapabilities` 主语。 |
| `projects/L3-capability-hub/01-架构设计.md` | 当前架构主线是独立 capability access truth、五个核心子域、运行承载、依赖裁剪、truth / snapshot / ref / forbidden body 分层和同步 / 异步 / 后台三分。 | 范围必须承接这些边界,但不重新讨论架构取舍。 |
| 旧 `projects/L3-capability-hub/02-概要设计.md` | 旧文档把“能力接入中心心智”“ProviderContract / CapabilityDecision / CostRecord / KMS / QueryCapabilities / policy refresh”写成当前设计目标和范围。 | 本轮只作为差异审计输入,不得继承为现行目标或范围。 |

---

## 3. 整体模块骨架

| 模块 | 本 Step 要做 | 本 Step 不做 |
|---|---|---|
| 设计目标 | 把 Step 1 的 `本文必须回答` 转成概要层结构目标。 | 不把 `FR-CH-*` 或旧对象清单逐项复制为目标。 |
| 范围边界 | 明确本轮概要设计要覆盖的结构领域和核心闭环。 | 不拆完整对象、接口、字段、状态枚举或处理细节。 |
| 非范围 | 明确相关但不进入本轮概要的内容及归属层。 | 不用“以后再看”替代清晰边界。 |
| 设计深度 | 确定 `02` 对 `03/04/05/06/07` 的交付深度。 | 不提前写 03 的 schema、port、DDL、事务、测试或实施边界。 |
| 旧材料差异 | 识别不得继承的旧范围污染。 | 不从旧材料反推新版范围。 |

---

## 4. 模块思考记录

### 4.1 设计目标:先思考

问题回答:

- 本轮概要设计最主要要把“capability access truth 如何转成可实现结构骨架”讲清,而不是继续解释 capability-hub 为什么存在。
- `00` 已给出核心闭环和边界红线,`01` 已给出职责、数据、依赖和交互约束;`02` 的目标应是把这些约束转成代码主体、主要组成部分、关键对象、接口骨架、处理流、状态和配置影响轮廓。
- 设计目标的粒度必须是“概要设计完成后应成立的结构轮廓”,不能写成功能清单、接口名、技术产品名或实施任务。

诊断:

- 旧 `02` 的目标中心是“让第一次接触这个仓的人建立能力接入心智”,这会把概要设计停留在入门解释层,不足以支撑后续 `03-详细设计.md`。
- 旧 `02` 同时把 `ProviderContract`、`CapabilityDecision`、`CostRecord`、`KMS / Vault`、`QueryCapabilities`、policy refresh 和 cost accounting 写进主线,导致目标层已经被旧对象和旧实现方向污染。
- 新版 `00/01` 已改为 identity、registry、descriptor、governance seam、body-free method relation、formal exposure / controlled consumer view 和 traceability / impact 主线,Step 2 必须围绕这些主语重写目标。

取舍:

- 采用“结构主线 + 可继续下沉到 `03` 的交付边界”来定义设计目标。
- 不把旧对象名、旧查询名、旧性能目标和旧基础设施写入当前目标。

### 4.2 设计目标:再写入

| 设计目标 | 说明 | 验证方式 |
|---|---|---|
| 建立代码主体框架总览 | 必须先把 capability access truth、正式承接、正式暴露、追溯 / 影响和派生维护映射为统一代码主体骨架,否则后续章节会重新回到旧执行中心叙事。 | Step 4 能围绕稳定主语画出代码主体框架,不再随意增删旧 `ProviderContract / Cost` 部分。 |
| 建立主要组成部分的稳定划分 | 必须明确本仓由哪些核心组成部分和支撑组成部分构成,而不是继续按旧 provider / cost / query 桶拆分。 | Step 5 能围绕稳定组成部分持续展开职责与边界,不再重新命名主结构。 |
| 建立关键对象发现与正式化边界 | 必须先说明哪些主语会成为关键对象,哪些只是 ref、safe summary、projection、port 或后续详细设计对象。 | Step 6 能正式化关键对象而不把 governance truth、method body、runtime state、secret 正文或 cost ledger 拉入本仓。 |
| 建立关键接缝与接口骨架轮廓 | 必须先把正式写入口、正式读取面、变化协作和后台维护边界分开,否则 runtime / governance / SDK / method-library 接缝会混写。 | Step 7 能按正式类别展开接口骨架,且不需要回头重定范围。 |
| 建立主要处理流轮廓 | 必须先说明 identity、registry、descriptor、seam、relation、formal exposure、change / impact 和派生维护如何串起来。 | Step 8 能围绕稳定流程阶段展开,而不重新发明 execution gateway 或 cost 主流程。 |
| 建立状态轮廓与传播边界 | 必须先明确哪些主语有状态、状态如何变化、哪些传播只影响派生视图和交接材料。 | Step 9 能定义状态族而不引入 runtime execution、tool execution 或 provider runtime 状态。 |
| 建立配置影响轮廓 | 必须先识别哪些组成部分和接缝受配置影响,哪些 truth owner 和边界绝不能被配置化改写。 | Step 11 能继续收敛配置影响,且不需要反向改写 Step 5~10 的结构边界。 |
| 建立进入详细设计的承接边界 | 必须明确 `02` 结束后 `03` 应直接承接什么、哪些内容仍留在 `04/05/06/07`。 | Step 12 能输出稳定 handoff,后续 agent 不需要再次追问概要范围。 |

### 4.3 非范围:先思考

问题回答:

- 本轮 `02` 不进入需求、架构、配置细节、测试、验收和实施计划职责。
- 相邻仓的运行 truth、正文 truth、交易 truth、观测存储和治理执行不能进入 capability-hub 的概要范围。
- `01` 已明确挂起的 seam / relation / descriptor / SDK / implementation boundary 只能在概要中保持“后续闭口”状态,不能在 Step 2 擅自升格为已定内容。

诊断:

- 如果 Step 2 把旧 `QueryCapabilities`、allow / deny、KMS / Vault、cost / audit、provider runtime、marketplace 或 observability store 写成当前范围,后续 Step 5~9 会被迫围绕错误主语展开。
- 非范围如果只写“后续优化”或“以后再看”,后续实现很容易把沉默区当成可自行发挥空间。

取舍:

- 非范围按“上游文档职责 / 下游文档职责 / 相邻仓职责 / 当前未闭口事项”四类明确写清。
- 旧技术机制和旧量化口径单独列出,避免其以“历史已有”为名回流。

### 4.4 非范围:再写入

| 非范围 | 不进入原因 |
|---|---|
| 需求目标、用户故事、功能需求、业务规则和验收标准重写 | 已由 `00-需求文档.md` 收稳,当前概要只承接其结构影响,不重新定义需求层主语。 |
| 系统上下文、职责边界、依赖方向、数据所有权、技术机制和方案取舍重写 | 已由 `01-架构设计.md` 收稳,概要不能把架构判断重新讨论一遍。 |
| 完整 Rust struct / enum / value object 契约、完整字段全集和成员函数签名 | 属于 `03-详细设计.md`,概要当前只保留对象轮廓和函数骨架级别。 |
| 完整 API / DTO / event payload / Job schema / JSON / proto / CloudEvent 契约 | 属于 `03-详细设计.md`,概要当前只定义接口类别和边界轮廓。 |
| repository / port / adapter trait、存储模型、索引、事务、幂等、重试和一致性实现 | 属于 `03-详细设计.md`,当前不进入概要范围。 |
| 配置项默认值、配置 JSON 示例、配置加载实现和运行 profile 细节 | 属于 `04-配置设计.md` 与 `03-详细设计.md`,当前只识别配置影响轮廓。 |
| 测试矩阵、测试用例、证据口径、验收场景、放行门禁和实施 commit boundary | 分别属于 `05-测试方案.md`、`06-验收标准.md` 和 `07-实施计划.md`。 |
| runtime execution、tools execution、provider runtime、allow / deny enforcement、外部调用编排和 LLM routing | 属于 `L2-runtime` / `L2-tools` 或 future runtime / provider orchestration 边界,不进入 capability-hub 概要主链。 |
| governance approval、Policy effective fact、shared_rules truth 和治理执行流程 | 属于 `L1-governance`,capability-hub 只承接 governance seam。 |
| method body、定义正文、方法版本和 definition source truth | 属于 `L3-method-library`,capability-hub 只承接 body-free relation。 |
| SDK client、多语言 binding、package、client cache 和 DX 细节 | 属于 `L0-sdk`,capability-hub 只承接服务端 exposure boundary。 |
| marketplace listing、transaction、pricing、fulfillment 和商业履约 | 属于 `L6-marketplace`,本仓最多只在后续写只读生态发现边界。 |
| secret / KMS / Vault 平台和密钥生命周期管理 | 属于安全基础设施;本仓只允许 secret ref / safe summary,不成为 secrets 平台。 |
| cost / billing / finance ledger / provider 原始账单 | 已被 `00/01` 裁出 capability-hub 职责,不能在概要中回流。 |
| observability store、audit 平台、trace / metric / alert 存储 | 属于 `L4-observability`,本仓只可能输出审计友好摘要或 ref。 |
| governance seam 最小字段、relation 摘要强度、descriptor taxonomy、secret safe summary 最小内容、SDK handoff contract、完整 state / storage / implementation boundary | 当前仍属未闭口事项,只能在后续 Step 与 `03/04` 中继续收口,不能在 Step 2 直接定稿。 |
| 旧 `ProviderContract`、`CapabilityDecision`、`CostRecord`、`QueryCapabilities`、policy refresh、KMS / Vault、旧 P95 / `30s` 指标 | 这些是旧范围污染或历史实现线索,当前不继承为新版概要范围。 |

### 4.5 设计深度:先思考

问题回答:

- `02` 的深度应停在“可实现结构骨架”,足以让 `03` 拿到稳定输入,但不能替 `03` 完成契约设计。
- 可以点名代码主体、组成部分、关键对象类别、接口类别、流程阶段、状态族和配置影响;不能给出完整字段、完整签名、完整协议、DDL、事务、错误码或测试用例。
- Step 2 只定深度和边界,不提前执行 Step 4~12 的内容。

诊断:

- 旧 `02` 已经在目标与范围层混入 `QueryCapabilities P95`、`CostRecord`、KMS 接缝、provider lookup 和 allow / deny 主线,导致概要和详细设计甚至实现层纠缠。
- 如果本轮继续下沉过深,后续 Step 5~9 的组件小循环会失去独立停审价值。

取舍:

- 用“可命名结构,不定义契约全集”作为 `02` 的深度边界。
- 正式 `02-概要设计.md` 继续保持 historical material,到 Step 14 再统一装配。

### 4.6 设计深度:再写入

当前阶段设计深度口径:

- 本轮概要设计收敛到“可实现结构骨架”。
- 可以明确代码主体框架、主要组成部分、关键对象轮廓、接口类别、关键处理流、状态族、异常边界、配置影响和详细设计承接清单。
- 可以使用概要层名称,但这些名称只是 `03` 的稳定输入,不是完整 schema、Rust 类型、port contract 或存储契约。
- 可以写字段骨架和函数骨架,但字段不写全集,函数不写完整签名、实现、事务或协议。
- 不写完整 DTO、event payload、DDL、索引、并发、幂等、错误码、测试矩阵、证据 schema、配置示例或实施计划。
- 对当前 `00/01` 标记为待确认、外围增强或候选接缝的项,`02` 只能维持相同状态,不能把它们升格为核心定论。
- 正式 `projects/L3-capability-hub/02-概要设计.md` 只在 Step 14 装配时更新,当前 Step 2 只产出校准中间产物。

### 4.7 旧材料差异审计

| 旧材料口径 | 本轮处理 | 原因 |
|---|---|---|
| 旧 `02` 的目标是“建立正确能力接入心智” | 不继承为本轮目标主线。 | 新版 `02` 必须支撑 `03-详细设计.md`,不能停留在入门解释。 |
| 旧 `02` 把 `registry / contract / decision / cost / audit` 当成主结构 | 重写为 capability identity、registry、descriptor、governance seam、body-free relation、formal exposure / controlled consumer view 和 traceability / impact 主线。 | 旧结构已与新版 `00/01` 冲突。 |
| 旧 `02` 把 KMS / Vault、QueryCapabilities、allow / deny、policy refresh、cost accounting 写进本轮范围 | 不继承。 | 这些要么属于边界外职责,要么只是后续详细设计 / 外围增强线索。 |
| 旧 `02` 在范围层提前写指标和性能目标 | 不继承旧 `P95`、`30s` 等量化口径。 | 新版需求和架构只保留结构性 NFR,不允许旧数字直接回流。 |
| 旧 `02` 以旧对象名推动后续对象 / 接口 / 状态设计 | 改为只保留新版主语,旧对象名只作污染检查。 | 避免 Step 5~9 被历史接口名和历史对象名绑定。 |

---

## 5. 结构化中间产物

### 5.1 设计目标表

| 设计目标 | 说明 | 验证方式 |
|---|---|---|
| 建立代码主体框架总览 | 必须先把 capability access truth 和派生承载如何映射到代码主体讲清。 | Step 4 能围绕稳定主语展开而不回流旧执行中心叙事。 |
| 建立主要组成部分的稳定划分 | 必须让读者知道系统由哪些主要组成部分构成。 | Step 5 能持续沿这些组成部分展开,不再随意增删主语。 |
| 建立关键对象发现与正式化边界 | 必须先说明哪些对象值得进入关键对象轮廓,哪些不应进入。 | Step 6 能 formalize 关键对象而不拉入相邻仓 truth 或 forbidden body。 |
| 建立关键接缝与接口骨架轮廓 | 必须先说明正式写入、正式读取、变化协作和后台维护如何接起来。 | Step 7 能围绕稳定接缝展开接口骨架。 |
| 建立主要处理流轮廓 | 必须先说明核心主线怎么流动。 | Step 8 能围绕既定流程阶段展开而无需重开范围。 |
| 建立状态轮廓与传播边界 | 必须先说明哪些主语有状态、哪些传播只影响派生层。 | Step 9 能围绕稳定状态族展开而不引入执行态污染。 |
| 建立配置影响轮廓 | 必须先说明哪些结构受配置影响、哪些边界不能配置化。 | Step 11 能继续收口配置影响而不反改结构主线。 |
| 建立进入详细设计的承接边界 | 必须确保 `03`、`04`、`05`、`06`、`07` 的边界从本章开始就不混乱。 | Step 12 能输出稳定 handoff,后续 agent 不需要回问概要范围。 |

### 5.2 非范围表

| 非范围 | 不进入原因 |
|---|---|
| 需求目标、功能需求、业务规则和验收标准重写 | 已由 `00-需求文档.md` 收稳。 |
| 系统上下文、职责边界、依赖方向、数据所有权、技术机制和方案取舍重写 | 已由 `01-架构设计.md` 收稳。 |
| 完整对象契约、完整接口契约、完整持久化与事务实现 | 属于 `03-详细设计.md`。 |
| 配置项细节与配置加载实现 | 属于 `04-配置设计.md` 与 `03-详细设计.md`。 |
| 测试、验收和实施计划边界 | 分别属于 `05`、`06`、`07`。 |
| runtime / tools execution、provider runtime、allow / deny enforcement、LLM routing | 属于执行侧或 future 边界。 |
| governance approval / Policy truth、method body、SDK client、marketplace listing / transaction、secret / KMS 平台、cost / billing、observability store | 属于相邻仓或边界外职责。 |
| 当前未闭口的 seam / relation / descriptor / SDK / implementation field-level contract | 只能在后续 Step 与 `03/04` 中继续闭口。 |
| 旧 `ProviderContract`、`CapabilityDecision`、`CostRecord`、`QueryCapabilities`、policy refresh 和旧量化指标 | 属于历史污染项,不得回流为新版概要范围。 |

### 5.3 当前阶段设计深度口径

```text
本轮概要设计收敛到可实现结构骨架。

它必须明确:
- 代码主体框架
- 主要组成部分
- 关键对象轮廓
- API / 接口骨架
- 关键处理流
- 状态定义与状态流转
- 异常与边界场景轮廓
- 配置影响轮廓
- 详细设计承接清单

它不得提前展开:
- 完整实现代码
- 完整协议 schema
- DDL / 索引 / 事务
- 完整错误码和恢复脚本
- 完整测试方案和证据 schema
- 实施计划和 commit 边界
```

---

## 6. 回填草稿

以下内容供 Step 14 装配正式 `02-概要设计.md` 时回填到 §2,当前不直接修改正式文档。

```md
## 2. 本次设计目标与范围

> 校准来源:
> - `design-calibration/02_hld_step_02_goals_scope.md`
>
> 延伸阅读:
> - 建议继续阅读 `design-calibration/02_hld_step_02_goals_scope.md` 的“结构化中间产物”“设计深度:再写入”和“旧材料差异审计”小节,了解本轮概要设计为什么这样划范围。

### 2.1 设计目标

| 设计目标 | 说明 | 验证方式 |
|---|---|---|
| 建立代码主体框架总览 | 必须先把 capability access truth 和派生承载如何映射到代码主体讲清。 | Step 4 能围绕稳定主语展开而不回流旧执行中心叙事。 |
| 建立主要组成部分的稳定划分 | 必须让读者知道系统由哪些主要组成部分构成。 | Step 5 能持续沿这些组成部分展开,不再随意增删主语。 |
| 建立关键对象发现与正式化边界 | 必须先说明哪些对象值得进入关键对象轮廓,哪些不应进入。 | Step 6 能 formalize 关键对象而不拉入相邻仓 truth 或 forbidden body。 |

### 2.2 非范围
```

---

## 7. 待确认事项

### 7.1 待确认项处理建议

| 待确认项 | 备选方案 | 推荐方案 | 推荐理由 | 当前状态 |
|---|---|---|---|---|
| 概要设计是否继续以“能力接入心智解释”作为主目标 | A. 是;B. 否,必须下沉到结构骨架层 | B | 当前规范要求 `02` 足以支撑 `03`,旧解释性目标不够 | 已确认采用 B |
| 概要设计是否提前写完整契约 | A. 是;B. 否,停在骨架层 | B | 可以保持 `02` 和 `03` 的职责分层 | 已确认采用 B |
| 旧 `ProviderContract / CapabilityDecision / CostRecord` 是否作为范围主语保留 | A. 保留;B. 只作为历史线索;C. 与新主语并行 | B | 新版 `00/01` 已将其裁出或重裁 | 已确认采用 B |
| seam / relation / descriptor / SDK handoff 是否在 Step 2 直接定字段 | A. 是;B. 否,只确认属于后续概要 / 详细设计输入 | B | Step 2 只定范围和深度,不能提前进入字段 / 协议层 | 已确认采用 B |

### 7.2 本 Step 未确认事项

本步不新增阻塞 Step 3 的待确认事项。具体硬约束、禁止配置化边界、状态传播红线和错误边界将在 Step 3 独立收敛。

---

## 8. 进入下一步条件

- 已明确本次概要设计要收敛哪些主要结构轮廓。
- 已明确当前概要设计停在什么深度。
- 已明确哪些内容当前不进入概要设计范围,以及它们分别属于哪一层。
- 已明确旧 `02` 的目标与范围污染为何不能继承。
- 未提前拆对象字段、接口 schema、函数实现、持久化细节、测试或实施边界。
- 可以进入 Step 3“收稳约束条件”。
