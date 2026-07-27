# L3-capability-hub 02 概要 Step 1: 确认上游输入边界

> 创建日期: 2026-07-08
> 状态: completed_wait_user_review
> 当前模式: full-restart
> 文档级 flow: `design-calibration/02_hld_calibration_flow.md`
> 项目级台账: `design-calibration/project_execution_ledger.md`
> 正式文档目标: `projects/L3-capability-hub/02-概要设计.md`
> 本轮口径: 只确认新版 `00-需求文档.md` 与新版 `01-架构设计.md` 能为概要设计提供哪些输入;旧 `02-概要设计.md`、旧 README 和旧 `03/05/06` 只作差异审计。

---

## 0. Step 开工确认

| 项目 | 记录 |
|---|---|
| Step | Step 1 确认上游输入边界 |
| 输出文件 | `design-calibration/02_hld_step_01_upstream_boundary.md` |
| 已读取项目级台账 | yes:`design-calibration/project_execution_ledger.md` |
| 已读取文档级 flow | yes:`design-calibration/02_hld_calibration_flow.md` |
| 已读取 SOP / 书写规范 | yes:`概要设计讨论流程_SOP.md` Step 1;`概要设计书写规范.md` §4.1 |
| 已读取正式输入 | yes:`00-需求文档.md`;`01-架构设计.md` |
| 已读取参考粒度 | yes:`L1-governance` / `L3-method-library` / `L0-sdk` 的 `02` Step 1 中间产物 |
| 旧材料处理 | 旧 `02-概要设计.md` 与旧 README 只作后置差异审计 |
| 进入条件 | pass |
| next_allowed_action | Step 1 已完成,等待用户确认后进入 Step 2。 |

---

## 1. Step 内计划

| 模块 | 状态 | 产物 | gate_status | next_allowed_action |
|---|---|---|---|---|
| 必读文档读取 | done | 必读文档摘要 | pass | 进入整体模块骨架。 |
| 整体模块搭建 | done | Step 1 输出结构 | pass | 进入上游关系思考。 |
| 上游关系:先思考 | done | 上游输入判断 | pass | 进入上游关系写入。 |
| 上游关系:再写入 | done | 上游关系映射表 | pass | 进入不再回答清单。 |
| 不再回答:先思考 | done | 已由需求 / 架构收稳问题 | pass | 进入不再回答写入。 |
| 不再回答:再写入 | done | 本文不再回答清单 | pass | 进入必须回答清单。 |
| 必须回答:先思考 | done | 概要必须继续收口的问题 | pass | 进入必须回答写入。 |
| 必须回答:再写入 | done | 本文必须回答清单 | pass | 进入旧材料差异审计。 |
| 旧材料差异审计 | done | 差异审计表 | pass | 进入回填草稿与停审。 |
| 自检与停审 | done | 完成门禁 | pass | 等待用户确认 Step 2。 |

---

## 2. 必读文档

| 文档 | 读取结论 | 对 Step 1 的影响 |
|---|---|---|
| `standards/document/概要设计讨论流程_SOP.md` Step 1 | Step 1 只确认概要设计承接哪些需求与架构结论,输出上游关系映射、本文不再回答、本文必须回答。 | 本 Step 不收口设计目标、范围、约束、代码主体、对象、接口、处理流或状态。 |
| `standards/document/概要设计书写规范.md` §4.1 | 正式 `02` 的 §1 必须使用上游关系映射,不能把需求目标、架构取舍和对象字段提前写进来源声明。 | 回填草稿只保留上游承接关系和回答边界。 |
| `projects/L3-capability-hub/00-需求文档.md` | 新版 `00` 已明确 capability access truth 定位、`C-CH-1~5`、`FR-CH-001~016`、`BR-CH-*`、数据归属、接口依赖、NFR、验收和风险。 | 作为概要设计的需求输入,但不把需求原文复制成概要正文。 |
| `projects/L3-capability-hub/01-架构设计.md` | 新版 `01` 已明确独立 capability access truth、五个核心子域、运行承载、依赖方向、数据所有权、一致性、交互方式、机制级选型和挂起事项。 | 作为概要设计的架构输入,但不重开架构判断。 |
| `design-calibration/00_requirements_calibration_flow.md` | 需求线已完成 Step 1~17。 | 允许把新版 `00` 视为已停审输入。 |
| `design-calibration/01_architecture_calibration_flow.md` | 架构线已完成 Step 1~16。 | 允许把新版 `01` 视为已停审输入。 |
| 旧 `projects/L3-capability-hub/02-概要设计.md` | 旧文档沿用“能力接入中心 + ProviderContract + CapabilityDecision + CostRecord + KMS / Vault + QueryCapabilities”主线。 | 只能用于差异审计,不得作为本轮上游结论。 |

---

## 3. 整体模块骨架

| 模块 | 本 Step 要做 | 本 Step 不做 |
|---|---|---|
| 上游关系确认 | 判断新版 `00/01` 哪些结论可承接到概要层。 | 不重新证明 capability-hub 为什么存在。 |
| 不再回答清单 | 列出需求线、架构线已经收稳的问题。 | 不把这些问题再写成概要设计章节目标。 |
| 必须回答清单 | 列出概要设计必须继续下沉的结构问题。 | 不直接给出对象、接口、处理流和状态答案。 |
| 未收稳输入处理 | 标明哪些相关项只能作为待确认、边界线索或后续输入。 | 不为了推进 Step 2 把 open question 写成定论。 |
| 旧材料差异审计 | 识别旧材料中不能继承的对象主线和实现幻觉。 | 不从旧 `02` 反推新版 `00/01`。 |

---

## 4. 模块思考记录

### 4.1 上游关系:先思考

问题回答:

- 当前概要设计要承接的是新版 `00` 已收稳的 capability access truth 需求边界,以及新版 `01` 已收稳的 capability access truth 架构边界。
- `00` 已回答“本仓做什么、为什么要独立、哪些闭环和规则必须成立”;`01` 已回答“这些闭环在系统边界、子域、依赖、数据、交互和机制上如何受约束”。
- `02` 需要继续把这些输入转译为代码主体框架、主要组成部分、关键对象轮廓、接口骨架、关键处理流、状态定义和配置影响轮廓。

诊断:

- 旧 `02` 把 `ProviderContract`、`CapabilityDecision`、`CostRecord`、`KMS / Vault`、`QueryCapabilities`、policy refresh 和 execution gateway 视为概要主线,会把后续对象 / 接口 / flow 拉回旧边界。
- 新版 `00/01` 已将主轴收束为 capability identity、capability registry、adapter descriptor、governance seam、body-free method relation、formal exposure / controlled consumer view 和 traceability / impact。
- 因此 `02` Step 1 必须先宣告哪些旧主语已经失效,避免后续 Step 4~9 被历史对象和历史接口名反向牵引。

取舍:

- 采用新版 `00/01` 作为唯一直接上游输入。
- `00_req_step_*` 与 `01_arch_step_*` 只用于追溯来源和未闭口项,不替代正式文档。
- 旧 `02` 与旧 README 仅用于发现污染项,不用于产生本轮概要结论。

### 4.2 上游关系:再写入

当前 `02` 需要直接承接的稳定上游结论可收束为三类:

1. 需求层稳定输入:
   - capability-hub 是 capability access truth owner。
   - `C-CH-1~5` 已把核心闭环固定为 identity、registry、descriptor、governance / method seam、formal exposure / controlled consumer view。
   - `FR-CH-001~016`、`BR-CH-*`、数据归属、接口依赖、NFR、`AC-CH-*` 和 `VF-CH-*` 已把边界红线钉住。
2. 架构层稳定输入:
   - capability-hub 的内部主线已经固定为五个核心子域和支撑子域 / 本地引用层。
   - 非 `L0-core` sibling 只允许运行期、事件、ref、safe summary 或 body-free relation 协作。
   - truth / snapshot / ref / forbidden body 分层,以及同步 / 异步 / 后台三分已收稳。
3. 仍未闭口但必须保留为后续输入的事项:
   - governance seam 最小承载字段。
   - method relation 摘要强度。
   - descriptor taxonomy、secret safe summary、SDK exposure handoff。
   - API / DTO / state / storage / config / evidence / implementation boundary。

### 4.3 不再回答:先思考

问题回答:

- 需求和架构已经回答“本仓为什么存在”“与 runtime / tools / governance / method-library / SDK 的边界在哪里”“为什么旧 `ProviderContract` / `CapabilityDecision` / `CostRecord` / `KMS` 主线不能继承”。
- `02` 不应再证明 capability-hub 是否是 runtime gateway、provider platform 或 governance approval center,否则会变成需求和架构的重复文档。
- `02` 也不应把未闭口的 API / DTO / state / storage / config / implementation boundary 伪装成已知输入。

### 4.4 不再回答:再写入

本文不再回答:

- 为什么 `L3-capability-hub` 必须作为独立 capability access truth 仓存在。
- 为什么 runtime execution、tools execution、governance approval / Policy truth、method body、SDK client、marketplace listing、secret / KMS、cost / billing、provider runtime 和 observability store 不属于本仓。
- 为什么 capability identity、registry、descriptor、governance seam、method relation、formal exposure / controlled consumer view 必须分层存在。
- 为什么非 `L0-core` sibling 不得形成编译期依赖。
- 为什么 search、browse、export、candidate discovery、SDK 说明、只读生态发现和审计摘要只能是派生输出。
- 为什么旧 `ProviderContract`、`CapabilityDecision`、`CostRecord`、`QueryCapabilities`、policy refresh、KMS / Vault 和 execution gateway 不能直接沿用。

### 4.5 必须回答:先思考

问题回答:

- `02` 的任务不是继续做仓定位解释,而是把 capability access truth 架构主线转译为可以被 `03-详细设计.md` 继续逐项落码的结构骨架。
- 这要求 `02` 至少回答代码主体框架、主要组成部分、关键对象、接口骨架、处理流、状态、异常边界、配置影响和详细设计承接。
- 如果 Step 1 不先把这些目标暴露出来,后续 Step 2~13 很容易重新退回旧对象教学或旧执行中心叙事。

### 4.6 必须回答:再写入

本文必须回答:

- capability-hub 的代码主体框架如何从 identity、registry、descriptor、governance / method relation、formal exposure、traceability / impact 和派生维护语义映射到可实现骨架。
- 本仓有哪些主要组成部分,每个组成部分承担什么、不承担什么、包含哪些代码主体 / 模块候选。
- 每个主要组成部分能发现哪些对象候选,哪些对象应在 Step 6 进入关键对象轮廓。
- Command / Query / Event / Operations Job / external port 等接口骨架如何按正式边界分类。
- identity / registry / descriptor / seam / relation / exposure / traceability / impact / derived maintenance 的关键处理流如何连接入口、service、domain、port、read model 和协作边界。
- 哪些对象具有状态,状态如何流转,状态如何回指接口或处理流。
- 哪些异常和边界场景会改变主流程理解,必须在概要层提前点名。
- 哪些组成部分、接缝、入口或派生承载受配置影响,哪些边界绝不能配置化。
- `03-详细设计.md` 需要继续展开哪些对象、接口、flow、状态、配置契约和测试切口。

### 4.7 旧材料差异审计

| 旧材料口径 | 本轮处理 | 原因 |
|---|---|---|
| 旧 `02` 的“先用人话理解本仓”与“统一能力接入中心”叙事 | 不继承为新版概要主线。 | 新版概要必须下沉到代码主体骨架层,不能停留在入门解释。 |
| `ProviderContract` 作为能力接入核心对象 | 不继承为当前上游输入。 | 新版 `00/01` 已将其重裁为 adapter descriptor 线索,并明确 secret / provider runtime / cost 不入仓。 |
| `CapabilityDecision` / `QueryCapabilities` 作为核心查询主语 | 不继承为当前上游输入。 | 新版 `01` 已明确 formal exposure 与 controlled consumer view 分层,consumer view 不得反写真相。 |
| `CostRecord`、cost accounting、provider raw billing 主线 | 不继承为概要输入。 | cost / billing 已在新版需求和架构中被裁出 capability-hub 职责。 |
| `KMS / Vault`、secret platform、policy refresh、allow / deny、execution gateway 主线 | 不继承为概要输入。 | 这些会把 capability-hub 拉回 secrets 平台、runtime gateway 或 governance truth owner。 |
| 旧 `02` 中基于旧对象直接展开接口、流程和状态 | 只作污染检查。 | 本轮 Step 4~9 必须从新版 `00/01` 重新推导对象、接口、flow 和状态。 |

---

## 5. 结构化中间产物

### 5.1 上游关系映射表

| 来源文档 | 承接内容 | 本文继续展开什么 |
|---|---|---|
| `projects/L3-capability-hub/00-需求文档.md` | 仓定位、`C-CH-1~5`、`FR-CH-001~016`、`BR-CH-*`、数据归属、接口依赖、NFR、`AC-CH-*`、`VF-CH-*`。 | 转译为代码主体框架、主要组成部分、关键对象、接口骨架、处理流、状态、异常边界、配置影响和详细设计承接。 |
| `projects/L3-capability-hub/01-架构设计.md` | 独立 capability access truth 主线、五个核心子域、运行承载、依赖裁剪、truth / snapshot / ref / forbidden body 分层、同步 / 异步 / 后台三分、机制级约束和风险挂起项。 | 转译为可实现结构骨架,不重写架构判断。 |
| `design-calibration/00_req_step_01_*` ~ `00_req_step_17_*` | 需求形成过程、追溯矩阵、验收与风险来源。 | 为正式 `02` 提供需求层可追溯入口和未闭口项来源。 |
| `design-calibration/01_arch_step_01_*` ~ `01_arch_step_16_*` | 架构形成过程、红线、挂起事项和长期结构决策来源。 | 为正式 `02` 提供架构层可追溯入口和未闭口项来源。 |
| `standards/document/概要设计讨论流程_SOP.md` | 14 Step 生成顺序、Step 1 输出要求和 Step 5~9 小循环规则。 | 约束本轮 `02` 按 Step 逐步生成,不得合并或跳步。 |
| `standards/document/概要设计书写规范.md` | 正式 `02` 的 14 章主链、校准来源格式和禁止下沉内容。 | 约束正式文档最终章节和本 Step 回填草稿。 |
| `projects/L1-governance` / `L3-method-library` / `L0-sdk` 的 `02` Step 1 | Step 粒度、模块密度、历史材料处理样式。 | 仅参考写法,不作为 capability-hub 结论来源。 |
| 旧 `projects/L3-capability-hub/02-概要设计.md` | 旧对象、旧接口名和旧执行中心叙事线索。 | 只作差异审计和污染检查,不作为正式概要主链。 |

### 5.2 本文不再回答

本文不再回答:

- capability-hub 是否应该独立成仓。
- runtime / tools / governance / method-library / SDK / marketplace / observability / secret / cost 的仓级边界。
- capability identity、registry、descriptor、seam、relation、formal exposure / controlled consumer view 为什么要分层。
- 五个核心子域、系统上下文、依赖方向、数据所有权和交互分层的架构取舍。
- 旧 `ProviderContract`、`CapabilityDecision`、`CostRecord`、`KMS / Vault`、`QueryCapabilities`、execution gateway 为什么不能继续作为现行主语。

### 5.3 本文必须回答

本文必须回答:

- 代码主体框架总览。
- 主要组成部分、职责与边界。
- 关键对象轮廓。
- API / 接口骨架。
- 关键处理流 / 重要函数数据流。
- 状态定义与状态流转。
- 异常与边界场景轮廓。
- 配置影响轮廓。
- 详细设计承接清单。
- 概要层风险与待确认事项。

### 5.4 暂不进入范围

| 暂不进入范围 | 原因 | 后续落点 |
|---|---|---|
| governance seam 最小字段集合 | 当前只闭口为 seam relation / result ref / safe summary 边界。 | Step 6 / Step 7 / Step 8 / Step 9 / `03-详细设计.md` |
| capability-method relation 摘要强度 | 当前只闭口为 body-free relation 与 method asset ref。 | Step 6 / Step 7 / Step 8 / `03-详细设计.md` |
| adapter descriptor taxonomy、协议类别细分和 descriptor 完整字段 | 当前只闭口为 descriptor truth 与风险 / 约束摘要边界。 | Step 6 / Step 7 / `03-详细设计.md` |
| secret safe summary 最小内容与安全接缝契约 | 当前只闭口为 secret ref / safe summary,不做 secrets 平台。 | Step 10 / Step 11 / `03-详细设计.md` / `04-配置设计.md` |
| formal exposure 到 `L0-sdk` 的 handoff contract | 当前只闭口为服务端 exposure boundary 与 SDK consumer 分层。 | Step 7 / Step 8 / `03-详细设计.md` |
| 完整 API / DTO / state / storage / config / evidence / implementation boundary | 架构层明确挂起,概要 Step 1 不能提前定形。 | Step 2~13 / `03-详细设计.md` / `04-配置设计.md` |
| 量化性能、传播与容量目标 | 当前只承接结构性 NFR 和验收红线,不继承旧 P95 / `30s`。 | Step 3 / Step 13 / 后续 `05/06/07` |

---

## 6. 回填草稿

以下内容供 Step 14 装配正式 `02-概要设计.md` 时回填到 §1,当前不直接修改正式文档。

```md
## 1. 与上游文档的关系声明

> 校准来源:
> - `design-calibration/02_hld_step_01_upstream_boundary.md`
>
> 延伸阅读:
> - 建议继续阅读 `design-calibration/02_hld_step_01_upstream_boundary.md` 的“结构化中间产物”“模块思考记录”和“旧材料差异审计”小节,了解概要设计输入边界如何收敛。

### 1.1 上游关系映射

| 来源文档 | 承接内容 | 本文继续展开什么 |
|---|---|---|
| `projects/L3-capability-hub/00-需求文档.md` | 仓定位、`C-CH-1~5`、`FR-CH-001~016`、`BR-CH-*`、数据归属、接口依赖、NFR、验收和风险。 | 概要层代码主体框架、主要组成部分、关键对象、接口骨架、处理流、状态、异常边界、配置影响和详细设计承接。 |
| `projects/L3-capability-hub/01-架构设计.md` | capability access truth 主线、核心子域、依赖裁剪、数据分层、交互分层、机制级约束和挂起事项。 | 概要层主要组成部分边界、关键接缝、对象归属、状态传播和跨边界协作轮廓。 |

本文不再回答:
```

---

## 7. 待确认事项

### 7.1 待确认项处理建议

| 待确认项 | 备选方案 | 推荐方案 | 推荐理由 | 当前状态 |
|---|---|---|---|---|
| 是否沿用旧 `02-概要设计.md` 主线 | A. 沿用;B. 只作诊断输入,正式文档重建;C. 在旧文档上局部替换 | B | 新版 `00/01` 已重建,旧主线会把概要设计拉回旧对象和旧执行中心叙事 | 已确认采用 B |
| 是否在 Step 1 直接拆代码主体框架 | A. 是;B. 否,Step 1 只确认上游输入边界 | B | SOP 要求 Step 1 不提前展开代码主体、对象、接口、flow 和状态 | 已确认采用 B |
| `ProviderContract` / `CapabilityDecision` / `CostRecord` 是否保留为正式概要主语 | A. 保留;B. 只作为历史线索;C. 作为辅助别名并行存在 | B | 新版 `00/01` 已将其裁出或重命名为 descriptor / controlled consumer view / 非目标 | 已确认采用 B |
| governance seam、method relation、SDK handoff 是否在 Step 1 直接定字段 | A. 是;B. 否,保留为后续概要 / 详细设计输入 | B | 当前只允许确认它们是稳定边界主题,不允许脑补字段或协议 | 已确认采用 B |

### 7.2 本 Step 未确认事项

本步不新增阻塞 Step 2 的待确认事项。具体本次概要设计目标、范围和当前深度将在 Step 2 独立收敛。

---

## 8. 进入下一步条件

- 已明确概要设计当前承接哪些需求结论。
- 已明确概要设计当前承接哪些架构结论。
- 已明确哪些输入稳定、哪些仍不能直接展开。
- 已明确本文不再回答什么、必须回答什么。
- 已明确旧 `02` 的历史主线为何不能继承。
- 未提前展开代码主体框架、接口骨架、对象轮廓、处理流或状态机。
- 可以进入 Step 2“明确本仓设计目标与当前范围”。
