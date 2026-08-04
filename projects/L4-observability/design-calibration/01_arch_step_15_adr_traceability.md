# L4-observability 01-架构设计 Step 15 · ADR 与需求追溯

> 对应 SOP: `standards/document/架构设计讨论流程_SOP.md` Step 15
> 回填章节: `01-架构设计.md` §16 需求追溯矩阵 / §17 ADR 索引
> 生成日期: 2026-07-08
> 状态: 已完成,等待用户确认后进入 Step 16

---

## 1. 本步目标

把 Step 01 ~ Step 14 已经收稳的 `L4-observability` 关键架构决定与需求来源、约束来源、取舍来源和风险来源显式连接起来,并沉淀后续需要长期保留的 ADR 决策候选索引。

本步只做追溯映射、漏项检查、架构决定停审和 ADR 候选索引,不新增架构结论,不创建正式 ADR 文件,不补写 API / Command / Query / Job / 对象字段、状态机、数据库、时序存储、消息产品、外部观测产品、完整性算法、性能数字、实施边界或测试结果,也不把 Step 14 已挂起的待确认事项润色成已闭合事实。

---

## 2. 本步输入

| 输入 | 状态 | 用途 |
|---|---|---|
| `projects/L4-observability/00-需求文档.md` | 已按需求 SOP 重建并完成正式装配 | 提供仓定位、核心闭环、功能需求、业务规则、数据归属、接口依赖、NFR、验收和风险基线。 |
| `design-calibration/00_req_step_16_traceability_matrix.md` | 已完成 | 提供 `C-OBS`、`FR-OBS`、`BR-OBS`、`DO-OBS`、`NFR-OBS`、`AC-OBS`、`VF-OBS` 的需求层追溯关系。 |
| `design-calibration/01_arch_step_01_requirements_baseline.md` | 已完成 | 提供架构需求基线、旧材料降级和一票否决输入。 |
| `design-calibration/01_arch_step_02_arch_goals_constraints.md` | 已完成 | 提供 observation truth、redaction / correlation、body-free linkage、read-only handoff、retention / no-write 和产品中立目标。 |
| `design-calibration/01_arch_step_03_responsibility_boundary.md` | 已完成 | 提供做 / 不做、易混淆职责和边界红线。 |
| `design-calibration/01_arch_step_04_system_context.md` | 已完成 | 提供系统上下文、输入 / 输出面、依赖失效降级和外部产品不作为 truth source 的边界。 |
| `design-calibration/01_arch_step_05_bounded_context.md` | 已完成 | 提供核心子域、支撑上下文、本地索引 / 投影 / 引用层和跨上下文审计。 |
| `design-calibration/01_arch_step_06_container_deployment.md` | 已完成 | 提供同步入口、异步观察材料消费、后台维护交接、观察面真相承载和派生交接承载。 |
| `design-calibration/01_arch_step_07_dependency_direction.md` | 已完成 | 提供 `L0-core` 唯一编译期依赖、`L0-bus` 事件协作、运行期接缝、禁止 sibling truth repo 编译期依赖和依赖倒置结论。 |
| `design-calibration/01_arch_step_08_data_ownership_consistency.md` | 已完成 | 提供 observation truth / derived projection / reference / forbidden body 分离、强一致 / 最终一致和失败处理口径。 |
| `design-calibration/01_arch_step_09_interactions_communication.md` | 已完成 | 提供同步即时判断、异步材料送达 / 事实传播和后台派生维护三类路径。 |
| `design-calibration/01_arch_step_10_technology_choices.md` | 已完成 | 提供正式承接边界、redaction-first、correlation、audit projection 分离、body-free linkage、retention、no-write guard、幂等顺序和产品中立适配。 |
| `design-calibration/01_arch_step_11_alternatives_tradeoffs.md` | 已完成 | 提供独立 observation truth + 正式边界协作主线和被放弃路径。 |
| `design-calibration/01_arch_step_12_cross_cutting.md` | 已完成 | 提供安全、可追溯、可观测、韧性、性能 / 容量、配置和变更控制横切约束。 |
| `design-calibration/01_arch_step_13_evolution_roadmap.md` | 已完成 | 提供当前阶段成立条件、可接受债务、不可接受债务和后续演进触发。 |
| `design-calibration/01_arch_step_14_risks_open_questions.md` | 已完成 | 提供正式风险、待确认事项、当前处理口径和阻塞判断。 |
| `projects/L1-governance/design-calibration/01_arch_step_15_adr_traceability.md` | 已参考 | 只参考“需求追溯 + 漏项检查 + ADR 候选索引”的组织粒度,不复制治理仓结论。 |
| `projects/L1-artifact/design-calibration/01_arch_step_15_adr_traceability.md` | 已参考 | 只参考“停审记录 + 跨 ADR / 需求追溯审计”的组织粒度,不复制制品仓结论。 |
| 旧 `design-calibration/01_arch_step_15_adr_traceability.md` | historical material,已被本文件替换 | 旧文件以对象 / schema 名称提前收口,不得作为当前追溯和 ADR 基线。 |
| `standards/document/架构设计讨论流程_SOP.md` Step 15 | 已读取 | 控制 ADR / 追溯问题、停审和跨审计要求。 |
| `standards/document/架构设计书写规范.md` §4.16 / §4.17 | 已读取 | 控制需求追溯矩阵、漏项检查表、ADR 索引表和边界说明写法。 |

---

## 3. Step 内计划

| 计划项 | 状态 | 可审查产物 |
|---|---|---|
| 读取项目台账、架构 flow、Step 14、SOP Step 15 和书写规范 4.16 / 4.17 | done | 本文件 §2 |
| 读取需求追溯矩阵、Step 01~14 架构结论和 L1 参考 Step 15 | done | 本文件 §2 / §5 |
| 回答 ADR 候选、需求来源、孤儿结论、核心需求承接和长期红线问题 | done | 本文件 §4 |
| 输出需求追溯矩阵、漏项检查、ADR 候选索引、架构决定停审和跨审计表 | done | 本文件 §7 |
| 写出 Step 16 可回填草稿并更新 flow / 项目台账 | done | 本文件 §8 |

---

## 4. SOP 问题回答

### 4.1 哪些架构决定需要沉淀为 ADR?

应进入 ADR 索引的是会长期影响 observation truth、仓际边界、数据归属、一致性、依赖裁剪、redaction、correlation、body-free evidence linkage、audit projection、report handoff、retention、no-write、产品中立适配和演进路径的架构决定。当前建议沉淀的 ADR 候选包括:

1. 以独立 observation truth 作为 `L4-observability` 架构核心。
2. 通过正式承接边界和 redaction-first 保护外部观察材料进入核心。
3. 使用 correlation context / safe ref 承接跨来源关联,但不从关联标识反推业务 truth。
4. 采用 observation truth / derived projection / reference / forbidden body separation。
5. Audit projection 只读,并与 source audit / Governance truth 分离。
6. Body-free evidence linkage + authenticity hint,不接管 evidence body 或 Artifact body。
7. 核心观察事实强一致,派生 / 外围消费 / 交接最终一致。
8. 同步即时判断、异步材料送达与事实传播、后台派生维护三类路径分离。
9. Query、diagnostic、report handoff、dashboard、alert、external audit / GRC export 等消费面只读派生,不得反写 source truth。
10. Retention marker、active reference protection 和 archive handoff 分离。
11. No-write guard 覆盖查询、诊断、维护、重建、报告交接和导出路径。
12. 产品中立外部能力适配,产品硬选型和旧指标延后。

### 4.2 每个关键架构决定对应哪些需求、约束或风险来源?

完整映射见 §7.1 需求追溯矩阵和 §7.3 ADR 决策候选索引。当前关键架构决定均可追溯到新版 `00-需求文档.md` 的仓定位、`C-OBS-1~5` 核心能力闭环、`FR-OBS-001~013` 核心功能、`BR-OBS-001~026` 业务规则、`DO-OBS-001~034` 数据归属、`NFR-OBS-001~024` 非功能要求、`AC-OBS` / `VF-OBS` 验收与否决项,以及 Step 01 ~ Step 14 已收稳的架构目标、职责边界、系统上下文、限界上下文、依赖方向、数据所有权、通信方式、技术机制、方案取舍、横切约束、演进债务和风险红线。

### 4.3 是否存在没有需求来源的架构设计?

当前结论为否。进入正式架构主线的判断都能追溯到需求基线、需求追溯矩阵、数据归属、接口依赖边界、非功能约束、验收否决项、风险挂起口径或 Step 01 ~ Step 14 的已确认取舍。

旧 `01-架构设计.md`、旧 README 和旧 Step 15 中的对象名称、产品栈、容量数字、冷存设想、完整性链设想、实施边界和测试证据路径没有被作为新版架构来源直接继承。

### 4.4 是否存在没有架构承接的核心需求或关键约束?

当前结论为否。`C-OBS-1~5`、`FR-OBS-001~013`、`BR-OBS-001~026`、`DO-OBS-001~034`、`IB-OBS` / `DB-OBS`、`NFR-OBS-001~024`、`AC-OBS` 和 `VF-OBS` 均已分别被职责边界、系统上下文、限界上下文、依赖方向、数据所有权、一致性策略、关键交互、关键技术机制、横切关注点、演进路线和风险章节承接。

外围增强 `FR-OBS-E01~E06` 不是未承接需求,而是已按只读派生、外围增强、演进路线和 Step 14 待确认事项处理,不作为当前核心闭环成立前置。

### 4.5 哪些取舍和红线必须长期可追溯?

必须长期可追溯的红线包括:

- `L4-observability` 只拥有 observation truth、audit projection、body-free linkage、report handoff、retention 和 no-write 相关观察面事实,不拥有外部业务 truth。
- Raw body、secret、payload body、raw log、raw prompt、provider response body、runtime body、evidence body、artifact body、identity body、governance decision body 和 source audit truth 正文不得入仓。
- Audit projection 不等于 Governance decision、source audit truth、Artifact lineage、Identity truth、runtime execution truth 或 archive truth。
- Body-free evidence linkage 不得保存 evidence body、Artifact body 或真实验收材料。
- Query、diagnostic、report、dashboard、alert、external export、archive preparation、rebuild、replay 和 maintenance 不得写入或修复 source truth。
- Report handoff 只能交接观察线索、脱敏状态、缺口和真实性提示,不得生成真实运行编号、真实证据别名、最终裁决、通过证据或验收签署。
- Retention marker 必须保护仍被审计、诊断、报告、留存、重放或合法保留语境引用的观察材料。
- `L0-core` 是唯一编译期依赖;`L0-bus` 只是事件协作边界,非 core sibling truth repo 不得进入编译期依赖。
- 外部观测产品、dashboard、alert、external audit / GRC、存储产品或配置不得成为 observation truth source。
- 旧文档、旧 Step、旧实施台账和旧边界骨架只能作为 historical material,不得直接恢复为当前架构基线。

### 4.6 每个关键架构决定是否通过停审?

当前进入 ADR 候选索引的决策均满足三项停审条件:属于架构层决策,具备长期影响,可回指需求 / 约束 / 风险 / 取舍来源。没有把 API 字段、对象状态、数据库、产品、完整性算法、性能数字、实施动作、真实证据或验收签署塞入 ADR。

---

## 5. 当前文档问题诊断

| 位置 / 来源 | 当前表现 | 问题 | 本步处理 |
|---|---|---|---|
| 旧 `01_arch_step_15_adr_traceability.md` | 以对象 / schema 名称和字段线索收束 Step 15 | Step 15 应建立需求到架构结果的追溯和长期 ADR 决策候选,不应提前固定对象模型 | 全部降级为 historical material,本步按追溯矩阵、漏项检查、ADR 候选、停审和跨审计重写。 |
| 旧 Step 15 门禁 | 允许自动进入下一步或正式装配 | 与用户要求一个 Step 一个 Step 停审冲突 | 改为 `wait_user_confirmation_before_step_16`。 |
| 需求 Step 16 | 已建立需求层功能、规则、数据、验收和否决追溯 | 还需要架构层承接位置和成立理由 | 转成 §7.1 架构追溯矩阵。 |
| 架构 Step 01 ~ Step 14 | 每步已有局部结论和回填草稿 | 关键决策尚未统一连接到需求、约束、风险和取舍来源 | 汇总为需求追溯、漏项检查、架构决定停审和 ADR 候选索引。 |
| Step 10 / Step 11 / Step 12 | 已有机制选型、路径取舍和横切约束 | 需要判断哪些长期取舍值得进入 ADR 索引 | 只保留改变主线结构的决策。 |
| Step 14 | 有对象、状态、协议、产品、容量、交接细节等待确认事项 | 容易在追溯阶段被误写成已定 ADR | 保留为漏项检查 / 待确认,不升格为已收敛结论。 |
| 旧 implementation ledger / boundaries | 上一轮粗糙实现移交资产仍存在 | 未经新版 `07-实施计划.md` 重建,不能作为实现门禁 | 继续保持 historical material。 |

---

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A: 只列需求章节到架构章节的目录映射 | 简短,容易写 | 不能证明具体承接关系,也无法发现孤儿结论 | 不采用。 |
| 方案 B: 建立需求追溯矩阵、漏项检查表、ADR 候选索引、架构决定停审和跨审计 | 可审查,能说明来源、承接、缺口和长期决策 | 文档较长,需要严格避免新增结论 | 采用。 |
| 方案 C: 本步直接创建正式 ADR 文件 | ADR 体系看起来完整 | 超出当前 SOP Step,且会绕过 ADR 评审流程 | 不采用。 |
| 方案 D: 把所有 Step 10 技术机制和产品候选都写成 ADR | 表面完整 | 会把局部机制、产品候选和实现偏好噪音化 | 不采用。 |

### 6.1 待确认问题的方案选择

| 待确认项 | 备选方案 | 推荐方案 | 推荐理由 |
|---|---|---|---|
| API / 状态机 / 对象字段未闭合是否进入 ADR | A. 建 ADR 占位;B. 留在 Step 14 风险和待确认事项 | B | 未闭合详细项不是已收稳架构决定。 |
| 外围增强是否进入需求追溯矩阵 | A. 不进入;B. 进入漏项 / 范围说明并按演进和待确认处理 | B | 避免被误判为未承接,但不升级为当前核心前置。 |
| 旧架构文档中的方案是否直接继承 | A. 继承旧方案;B. 重新建立新版追溯和 ADR 候选索引 | B | 防止旧技术栈、旧指标、旧实施资产和旧对象命名污染新版架构。 |
| 完整事件溯源、完整性链或外部产品是否现在定论 | A. 现在定论;B. 作为后续设计、测试、配置或 ADR 输入挂起 | B | 当前只固定边界和机制口径,不由产品或算法定义 truth。 |

---

## 7. 结构化中间产物

### 7.1 需求追溯矩阵

| 需求来源 | 需求结论 / 约束 | 架构承接结果 | 承接位置 | 说明 |
|---|---|---|---|---|
| `00-需求文档.md` §2 / Step 01 仓定位 | `L4-observability` 是横切观测材料、审计投影、body-free evidence linkage、retention marker 和只读 report handoff 基础 | 以独立 observation truth 为架构核心,围绕安全准入、关联语境、审计投影、证据线索、报告交接、留存和 no-write 组织边界 | §2 业务背景与驱动力;§4 职责边界;§6 限界上下文;§9 数据所有权 | 架构把仓定位转译为独立观察面 truth center,防止退化为本地日志、外部监控产品、审计副本、dashboard 或会反写的诊断工具。 |
| `C-OBS-1` / `FR-OBS-001~003` | 观察材料必须经过安全准入、来源 / 关联表达和安全处置 | 正式承接边界 + redaction-first / safety marker + correlation / safe ref 承接 | §4 职责边界;§5 系统边界;§6 限界上下文;§10 关键交互;§11 技术机制 | 架构要求外部材料先形成 accepted / rejected / quarantined / degraded / unresolved 等语义,不能默认入仓或带入 forbidden body。 |
| `C-OBS-2` / `FR-OBS-004~005` | 审计投影与证据关联必须可审计,且不保存正文、不替代 source truth | Audit projection 与 source audit / Governance truth 分离;body-free evidence linkage + authenticity hint 承接 | §4 职责边界;§6 限界上下文;§9 数据所有权;§11 技术机制;§13 横切关注点 | 需求侧的审计和证据线索被转译为只读投影、safe ref、digest 线索、缺口和可见性语境,不接管 evidence body 或治理裁决。 |
| `C-OBS-3` / `FR-OBS-006~007` | 运行观察面必须安全表达,并能表达降级、缺口和不可见 | 安全日志 / 指标 / 追踪观察面由 redaction、correlation 和 degraded / gap 语义承接,不拥有 execution truth | §6 限界上下文;§9 数据所有权;§10 关键交互;§13 横切关注点 | 架构把运行可见性转译为安全观察面,避免把观察信号解释为 runtime / sandbox 执行裁决。 |
| `C-OBS-4` / `FR-OBS-008~011` | 查询、诊断、报告交接和真实性提示必须只读消费观察材料 | 只读查询 / diagnostic / report handoff / evidence index input / authenticity hint 由派生消费和交接边界承接 | §5 系统上下文;§8 依赖方向;§9 数据所有权;§10 关键交互;§11 技术机制 | 架构允许消费者获得观察线索、脱敏状态、缺口和交接状态,但不得生成最终业务裁决、真实证据或验收签署。 |
| `C-OBS-5` / `FR-OBS-012~013` | 留存、活动引用保护、重放 / 重建和 no-write 防线必须持续约束观察材料 | Retention marker + active reference protection + rebuild / replay fact + no-write violation 承接 | §6 限界上下文;§9 数据所有权;§10 关键交互;§13 横切关注点;§15 风险与待确认事项 | 架构把留存和维护转译为本仓观察面事实和防线,不接管 archive package,也不修复 source truth。 |
| `BR-OBS-001~026` | 业务规则保护材料准入、正文禁止、审计投影、证据关联、只读消费、留存、no-write、产品中立和 historical material 边界 | 通过职责红线、依赖裁剪、数据归属、一致性策略、横切约束和风险表承接 | §4 职责边界;§8 依赖方向;§9 数据所有权;§13 横切关注点;§15 风险与待确认事项 | 架构把规则转译为不得串仓、不得正文入仓、不得派生反写、不得伪造验收材料、不得让外部产品成为 truth source 等红线。 |
| `DO-OBS-001~034` | Observation truth、派生投影、引用关系、外部正文和禁止正文必须分离 | Observation truth / derived projection / reference / forbidden body separation 承接 | §9 数据所有权与一致性策略;§11 关键技术选型;§12 备选方案与取舍 | 这是后续对象、协议、持久化、测试和验收都必须继承的核心数据边界。 |
| `IB-OBS` / `DB-OBS` / 全局依赖裁剪规则 | `L0-core` 是唯一编译期依赖;`L0-bus` 是事件协作;非 core sibling 只能运行期、事件协作、ref、summary、snapshot、signal、adapter 或 handoff 协作 | 依赖方向图、依赖倒置表、跨仓裁剪表、禁止依赖表和产品中立接缝承接 | §5 系统上下文;§8 依赖方向与层间约束;§10 关键交互;§11 技术机制 | 架构明确运行期协作不等于源码依赖,防止 sibling truth owner 和 bus 主干被本仓接管。 |
| `NFR-OBS-001~024` | 安全、追溯、幂等、顺序、一致性、可观测、性能预算、配置不可越界和产品中立必须有结构性口径 | Redaction-first、traceability / handoff trail、幂等顺序、核心强一致 + 外围最终一致、横切约束和配置不可越界承接 | §11 关键技术选型;§13 横切关注点;§14 演进路线 | 架构保留质量底线,但不预支监控字段、配置 key、产品参数、压测脚本或旧性能数字。 |
| `AC-OBS` / `VF-OBS` | 核心闭环断裂、正文入仓、观察面冒充外部 truth、反写 source truth、伪造验收材料、活动引用误清、依赖裁剪破坏和产品误升级均不能通过 | 风险表、漏项检查、ADR 候选索引和 Step 16 装配门禁长期保留这些红线 | §15 风险与待确认事项;§16 需求追溯矩阵;§17 ADR 索引 | 架构把验收否决项转译为长期可追溯的决策和阻塞风险。 |
| `FR-OBS-E01~E06` | 高级 dashboard、告警通知、管理报表、外部观测产品候选、外部审计 / GRC 导出和异常分析为外围增强 | 只读派生、外围消费、产品中立适配、演进路线和待确认事项承接 | §12 备选方案与取舍;§14 演进路线;§15 风险与待确认事项 | 外围增强已留痕,但不得作为当前核心闭环前置,也不得反向定义 observation truth。 |
| Step 14 风险与待确认事项 | 对象、状态、协议、产品、容量、交接、留存、完整性算法和实施边界仍未闭合 | 作为后续概要 / 详细 / 配置 / 测试 / 验收 / 实施阶段必须闭合的挂起项 | §15 风险与待确认事项;§16 需求追溯矩阵 | 架构层不补字段、不选产品、不造状态、不建实施边界,但明确后续实现前不得自行补真相源。 |

### 7.2 漏项检查表

| 追溯缺口类型 | 对象 / 缺口 | 影响范围 | 当前状态 | 说明 |
|---|---|---|---|---|
| 需求未被承接 | `C-OBS-1~5` | 架构主线、职责边界、数据归属、关键交互、横切关注点 | 无缺口 | 核心能力闭环均已映射到安全准入、审计证据、运行观察、只读交接和留存 no-write 主线。 |
| 需求未被承接 | `FR-OBS-001~013` | 核心功能、数据归属、交互、风险和验收 | 无缺口 | 核心功能均已由核心子域、支撑上下文、正式承接边界和一致性策略承接。 |
| 需求未被承接 | `BR-OBS-001~026` | 正文禁止、只读投影、留存、no-write、依赖裁剪、产品中立 | 无缺口 | 业务规则已被职责红线、数据所有权、一致性策略、依赖裁剪、横切约束和风险表承接。 |
| 需求未被承接 | `DO-OBS-001~034` | truth / derived / reference / forbidden body 数据边界 | 无缺口 | 数据归属要求已由 Step 08 架构数据归属和一致性策略承接。 |
| 需求未被承接 | `FR-OBS-E01~E06` 外围增强 | 演进路线、派生消费、外部导出、产品适配 | 已挂起,非缺口 | 外围增强按只读派生、最终一致、后续演进和待确认事项处理,不作为当前核心闭环前置。 |
| 架构判断缺来源 | 独立 observation truth、redaction-first、correlation / safe ref、body-free linkage、只读派生、retention、no-write、依赖裁剪 | 架构主线 | 无缺口 | 均可追溯到需求定位、数据归属、接口依赖、NFR、验收和风险章节。 |
| 承接关系未闭合 | API / Command / Query / Job 名称、对象字段、状态集、错误语义和协议细节 | 概要设计、详细设计、测试方案、实施边界 | 保留为待确认 | 架构只承接能力类别和交互方式,不能在 Step 15 补字段。 |
| 承接关系未闭合 | Redaction、correlation、evidence linkage、retention、handoff、no-write 的配置项、状态转换和测试断言 | 配置设计、详细设计、测试方案、验收标准 | 保留为待确认 | 后续设计必须闭合后才可实现,不能由实现侧补真相源。 |
| 承接关系未闭合 | 完整事件溯源、完整性链、长留存模型、外部产品组合和容量目标 | 技术选型、配置设计、测试方案、实施计划 | 保留为待确认 | 当前只固定边界和机制口径,不让产品、算法或旧指标反向定义 truth。 |
| ADR 缺口 | `L4-observability` 专项正式 ADR 文件 | 长期架构决策评审 | 正式 ADR 尚未建立 | 本步只形成决策候选索引,不伪装成已评审 ADR。 |
| 实施移交缺口 | 新版 implementation ledger 和 planned boundary skeleton | `07-实施计划.md` 完成后的实现移交 | 保留为后续门禁 | 用户规则要求完成 07 时创建;当前 Step 15 不提前创建或复用旧资产。 |

### 7.3 ADR 决策候选索引

| ADR 编号 | 架构决策 | 解决的问题 | 关联主线 | 说明 |
|---|---|---|---|---|
| 未建立 | 以独立 observation truth 作为 `L4-observability` 架构核心 | 防止观察材料散落到 source repo、本地日志、外部产品、dashboard、report、archive 或 GRC 中形成多真相 | 职责边界 / 数据所有权 / 备选方案 / 风险 | 这是本仓存在和后续设计的根决策,值得单独建立正式 ADR。 |
| 未建立 | 通过正式承接边界和 redaction-first 保护外部观察材料进入核心 | 防止外部输入、raw body、secret、payload 或不可信材料直接打穿核心观察语义 | 职责边界 / 关键交互 / 技术机制 / 横切安全 | 该决策长期影响准入、隔离、拒绝、可见性和输出安全。 |
| 未建立 | 使用 correlation context / safe ref 承接跨来源关联,但不反推业务 truth | 防止 opaque id、label、route、trace 或外部引用被误读为业务事实 | 数据归属 / 审计投影 / 诊断 / report handoff | 该决策长期保护关联可解释性和相邻 truth owner 边界。 |
| 未建立 | 采用 observation truth / derived projection / reference / forbidden body separation | 防止观察事实、派生视图、引用关系和外部正文混成一类数据 | 数据所有权 / 一致性策略 / 详细设计约束 | 该决策会长期影响对象建模、持久化、查询、投影和测试。 |
| 未建立 | Audit projection 只读,并与 source audit / Governance truth 分离 | 防止审计投影替代治理裁决、source audit truth、Artifact lineage 或 Identity truth | 审计投影 / 职责边界 / 风险 / 验收 | 该决策长期保护 Observability 只做审计投影而不拥有业务或治理 truth。 |
| 未建立 | Body-free evidence linkage + authenticity hint,不接管 evidence body 或 Artifact body | 防止证据线索、完整性提示和报告输入变成 evidence body 副本或真实验收材料 | 证据关联 / report handoff / 数据归属 / 验收真实性 | 该决策长期保护 evidence ownership 和报告交接真实性。 |
| 未建立 | 核心观察事实强一致,派生 / 外围消费 / 交接最终一致 | 防止核心事实半成立,同时避免 dashboard、report、archive、GRC 或外部消费阻塞核心 truth | 一致性策略 / 关键交互 / 韧性 | 该决策长期影响失败状态、stale、rebuilding、blocked、retryable 和恢复方式。 |
| 未建立 | 同步即时判断、异步材料送达与事实传播、后台派生维护三类路径分离 | 防止全同步拖重主链或全异步导致准入、安全、handoff、retention 和 no-write 口径不清 | 容器部署 / 关键交互 / 技术机制 | 该决策长期影响入口、消费、后台维护和交接分工。 |
| 未建立 | Query、diagnostic、report handoff、dashboard、alert、external audit / GRC export 只读派生 | 防止查询、诊断、报表、导出或外围消费成为第二 observation truth 或 source truth 写源 | 数据所有权 / 横切关注点 / 风险 | 该决策长期保护 read model / write model / maintenance model 边界。 |
| 未建立 | Retention marker、active reference protection 和 archive handoff 分离 | 防止 cleanup、archive preparation、rebuild 或 replay 误清活动引用材料或接管 archive package | 留存 / 归档交接 / 横切韧性 / 风险 | 该决策长期保护观察材料生命周期和归档消费边界。 |
| 未建立 | No-write guard 覆盖查询、诊断、维护、重建、报告交接和导出路径 | 防止读侧、派生侧、维护侧和交接侧越权写入或修复 source truth | 职责边界 / 关键交互 / 横切安全 / 验收否决 | 该决策长期保护本仓只观察、不反写业务 truth。 |
| 未建立 | 产品中立外部能力适配,产品硬选型和旧指标延后 | 防止旧产品设施、外部产品配置、存储模型或无来源性能数字反向决定 observation truth | 技术选型 / 备选方案 / 演进路线 / 风险 | 该决策保留后续实施空间,但要求产品选择不得推翻已收稳边界。 |

### 7.4 架构决定停审记录

| 架构决定 | 是否值得长期保留 | 来源是否明确 | 是否新增未确认结论 | 停审结论 |
|---|---|---|---|---|
| 独立 observation truth | 是 | 仓定位、核心闭环、数据归属、验收否决项 | 否 | pass |
| 正式承接边界 + redaction-first | 是 | 安全观测材料入口、正文禁止、横切安全、风险表 | 否 | pass |
| Correlation context / safe ref | 是 | 来源与关联语境、数据归属、审计追溯、诊断交接 | 否 | pass |
| Truth / derived / reference / forbidden body separation | 是 | 数据归属、NFR、备选方案、风险表 | 否 | pass |
| Audit projection 只读并与外部 truth 分离 | 是 | 审计投影、职责边界、数据归属、验收否决项 | 否 | pass |
| Body-free evidence linkage + authenticity hint | 是 | 证据关联、报告交接、禁止正文、验收真实性 | 否 | pass |
| 核心强一致 + 外围最终一致 | 是 | 一致性策略、关键交互、韧性约束、演进路线 | 否 | pass |
| 同步 / 异步 / 后台路径分离 | 是 | 容器部署、关键交互、技术机制、性能预算 | 否 | pass |
| 只读派生消费面 | 是 | 数据归属、横切追溯、风险表、验收否决项 | 否 | pass |
| Retention / active reference / archive handoff 分离 | 是 | 留存需求、归档交接、横切韧性、风险表 | 否 | pass |
| No-write guard | 是 | 职责边界、关键交互、横切安全、验收否决项 | 否 | pass |
| 产品中立适配和旧指标延后 | 是 | 技术选型、备选方案、演进路线、旧材料诊断 | 否 | pass |

### 7.5 跨 ADR / 需求追溯审计表

| 审计项 | 结论 | 说明 |
|---|---|---|
| 是否存在孤儿架构决定 | 否 | ADR 候选均可回指需求、约束、风险或取舍来源。 |
| 是否存在孤儿核心需求 | 否 | `C-OBS-1~5`、`FR-OBS-001~013`、`BR-OBS-001~026`、数据归属、NFR 和 VF 均已找到架构承接。 |
| 是否存在普通实现选择误入 ADR | 否 | 数据库、外部产品、对象字段、状态机、协议细节、完整性算法、性能数字和实施动作未进入 ADR 候选。 |
| 是否存在旧材料污染 | 否 | 旧产品栈、旧性能数字、旧完整性设想、旧实施资产和旧对象命名只作为历史风险,未成为追溯来源。 |
| 是否存在新增未确认结论 | 否 | 本步只整理 Step 01 ~ Step 14 已收稳结论和需求 Step 16 追溯结果。 |
| 是否存在待确认事项被伪装为已闭合 | 否 | 对象、状态、协议、产品、容量、handoff、retention、完整性算法和实施边界仍保留为待确认。 |
| 是否存在 ADR 与追溯职责混写 | 否 | §7.1 写来源到承接关系,§7.3 写长期决策索引,两者职责分离。 |
| 是否存在真实证据或验收签署伪造 | 否 | 本步未创建真实运行编号、真实证据别名、通过证据、最终裁决或签署。 |

### 7.6 追溯与决策范围说明

本章采用关键需求结论和关键架构约束为追溯粒度,不把 Step 01 ~ Step 14 的每一行表格机械展开为目录对照。主矩阵只记录已经成立的来源到承接关系,漏项检查表只记录当前是否仍有追溯缺口或后续详细设计挂起项。当前没有已评审通过的 `L4-observability` 专项 ADR 文件,因此 ADR 表采用“决策候选索引”口径,不替代正式 ADR 文件。API、状态机、对象字段、持久化、产品级技术选择、容量数字、完整性算法和交接协议已经在 Step 14 风险与待确认事项中挂起,当前不补写为确定架构结论。

---

## 8. 回填草稿

以下内容供 Step 16 重建正式 `01-架构设计.md` 时回填。正式文档可摘录本文件 §7 的结构化结论,不重复扩写 SOP 问题回答、旧材料诊断和设计取舍。

```md
## 16. 需求追溯矩阵

> 校准来源:
> - `design-calibration/01_arch_step_15_adr_traceability.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“需求追溯矩阵”“漏项检查表”“跨 ADR / 需求追溯审计表”和“追溯与决策范围说明”小节,了解本章如何从需求来源映射到架构承接结果。

### 16.1 需求追溯矩阵

摘录 `design-calibration/01_arch_step_15_adr_traceability.md` §7.1。

### 16.2 漏项检查表

摘录 `design-calibration/01_arch_step_15_adr_traceability.md` §7.2。

### 16.3 跨 ADR / 需求追溯审计

摘录 `design-calibration/01_arch_step_15_adr_traceability.md` §7.5。

### 16.4 追溯范围说明

摘录 `design-calibration/01_arch_step_15_adr_traceability.md` §7.6。

## 17. ADR 索引

> 校准来源:
> - `design-calibration/01_arch_step_15_adr_traceability.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“ADR 决策候选索引”“架构决定停审记录”“跨 ADR / 需求追溯审计表”和“追溯与决策范围说明”小节,了解本章如何筛选长期架构决策。

### 17.1 ADR 决策候选索引

摘录 `design-calibration/01_arch_step_15_adr_traceability.md` §7.3。

### 17.2 架构决定停审记录

摘录 `design-calibration/01_arch_step_15_adr_traceability.md` §7.4。

### 17.3 决策边界说明

摘录 `design-calibration/01_arch_step_15_adr_traceability.md` §7.6。
```

---

## 9. 进入下一步条件

- 已明确哪些架构决定需要 ADR。
- 已建立关键需求、约束和风险与架构承接结果之间的追溯关系。
- 已明确承接位置和承接理由。
- 已检查核心需求、关键约束和长期架构决定没有孤儿项。
- 已完成每个关键架构决定的停审记录。
- 已完成跨 ADR / 需求追溯审计。
- 未在追溯矩阵或 ADR 索引中新增前文未确认的架构结论。
- 未把未闭合的详细设计问题、产品技术选择、算法候选、容量数字、真实证据或局部实现偏好升格为 ADR。

结论:具备进入 Step 16 “整理正式文档”的材料条件,但必须等待用户确认后才能进入 Step 16。

---

## 10. 自检与门禁

| 检查项 | 结果 | 说明 |
|---|---|---|
| 是否明确哪些架构决定需要 ADR | pass | §7.3 已列出 12 项长期架构决策候选。 |
| 是否建立需求到架构结果的具体追溯 | pass | §7.1 按需求来源、需求结论、架构承接结果、承接位置和说明建立映射。 |
| 是否显式暴露追溯缺口 | pass | §7.2 已区分无缺口、外围增强挂起、后续详细设计挂起和正式 ADR 尚未建立。 |
| 是否完成架构决定停审 | pass | §7.4 已逐项检查长期保留价值、来源和未新增结论。 |
| 是否完成跨 ADR / 需求追溯审计 | pass | §7.5 已检查孤儿架构决定、孤儿核心需求、实现选择误入 ADR、旧材料污染和伪证风险。 |
| 是否创建正式 ADR 文件 | pass | 未创建正式 ADR 文件,只形成候选索引。 |
| 是否修改正式 `01-架构设计.md` | pass | 本步只更新中间产物、flow 和项目台账,正式文档仍等待 Step 16。 |
| 是否引入产品、对象字段、协议细节、测试结果或实施边界 | pass | 产品、对象、协议、指标、测试和实施边界均后移对应文档闭口。 |
| 是否发现上游 blocker | pass | 未发现阻塞 Step 15 完成的上游 blocker。 |
| gate_status | pass | Step 15 已完成。 |
| next_allowed_action | wait_user_confirmation_before_step_16 | 必须等待用户确认后才能进入 Step 16。 |
