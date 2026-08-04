# L4-observability 01-架构设计 Step 07 · 依赖方向与层间约束

> 对应 SOP: `standards/document/架构设计讨论流程_SOP.md` Step 7
> 回填章节: `01-架构设计.md` §8 依赖方向与层间约束
> 生成日期: 2026-07-07
> 状态: 已完成,等待用户确认后进入 Step 08

---

## 1. 本步目标

明确 `L4-observability` 内部有哪些正式架构责任层 / 依赖角色,这些角色之间允许怎样依赖,哪些外部能力必须通过正式边界进入,以及跨仓关系应如何从全局依赖基线中裁剪。

本步只讨论依赖方向和层间规则,不重写限界上下文、容器部署、接口协议、数据库细节、代码目录、handler / service / repository 调用链、事件字段、部署产品或技术选型。本步尤其不把 log / metric / trace / audit / evidence / handoff 的 schema 名称、字段、topic、store 或产品栈写成层间依赖。

---

## 2. 本步输入

| 输入 | 当前状态 | 本步使用方式 |
|---|---|---|
| `design-calibration/project_execution_ledger.md` | 当前台账显示 Step 06 已完成,用户已确认进入 Step 07 | 确认当前恢复点和 Step 切换门禁。 |
| `design-calibration/01_architecture_calibration_flow.md` | Step 01~06 pass,Step 07 blocked by user confirmation | 确认本轮只允许推进 Step 07。 |
| `design-calibration/01_arch_step_03_responsibility_boundary.md` | Step 03 已完成 | 承接做 / 不做 / 易混淆职责和 no-write 红线。 |
| `design-calibration/01_arch_step_04_system_context.md` | Step 04 已完成 | 承接正式上下文对象、输入 / 输出面和依赖失效降级口径。 |
| `design-calibration/01_arch_step_05_bounded_context.md` | Step 05 已完成 | 承接核心子域、支撑上下文、本地索引 / 投影 / 引用层和跨上下文审计。 |
| `design-calibration/01_arch_step_06_container_deployment.md` | Step 06 已完成 | 承接同步入口、异步观察材料消费、后台维护、观察面真相承载和派生交接承载运行角色。 |
| `design-calibration/00_req_step_06_consumers_dependencies.md` | 需求 Step 06 已完成 | 提供需求层仓际依赖裁剪、闭环前置和禁止依赖关系。 |
| `design-calibration/00_req_step_12_interfaces_dependencies.md` | 需求 Step 12 已完成 | 提供能力级接口面、外部依赖边界和全局依赖类型映射。 |
| `standards/document/全局项目依赖关系与裁剪规则.md` | 已读取 | 提供全局依赖类型、裁剪表和 ASCII 图格式。 |
| `standards/document/架构设计讨论流程_SOP.md` Step 7 | 已读取 | 控制本步必须输出依赖规则、裁剪表、分类表、禁止依赖表、停审和跨边界审计。 |
| `standards/document/架构设计书写规范.md` §4.8 | 已读取 | 控制依赖方向图、层间约束表和跨仓依赖裁剪写法。 |
| `projects/L1-governance/design-calibration/01_arch_step_07_dependency_direction.md` | 已读取 | 参考“责任层 + 跨仓裁剪 + 禁止依赖”的组织方式。 |
| `projects/L1-artifact/design-calibration/01_arch_step_07_dependency_direction.md` | 已读取 | 参考 truth owner、派生消费、技术承载和跨依赖审计粒度。 |
| 旧 `design-calibration/01_arch_step_07_dependency_direction.md` | historical material,已被本文件替换 | 仅作为薄产物诊断来源,不继承 schema 字段、产品栈或 `next_step_or_formal_assembly` 门禁。 |
| 旧 `projects/L4-observability/README.md` 与旧 `01-架构设计.md` | historical material | 仅作为旧依赖方向、旧产品栈和旧实现假设诊断来源。 |

---

## 3. Step 内计划

| 计划项 | 状态 | 可审查产物 |
|---|---|---|
| 读取项目台账、01 flow、Step 03~06、SOP Step 7、书写规范 4.8 和全局依赖裁剪规则 | done | 本文件 §2 |
| 读取需求侧依赖 / 接口边界和 L1 参考 Step 07 | done | 本文件 §2 |
| 回答内部层次、允许依赖、禁止依赖、外部接入、跨仓裁剪和倒置边界问题 | done | 本文件 §4 |
| 诊断旧 README、旧正式 01 和旧 Step 07 中 schema / 产品 / 实现依赖污染点 | done | 本文件 §5 |
| 收敛依赖方向图、层间约束表、依赖倒置结论、架构单元依赖规则、三张跨仓裁剪表和裁剪图 | done | 本文件 §8 |
| 完成依赖方向停审和跨依赖边界审计 | done | 本文件 §8.9 / §8.10 |
| 写出 Step 16 可回填草稿 | done | 本文件 §9 |
| 完成 Step 07 自检并更新 flow / 项目台账 | done | 本文件 §11 |

---

## 4. SOP 问题回答

### 4.1 本仓内部层次如何划分?

本章中的“层次”不是代码目录、crate、模块、服务进程、运行容器或 Step 05 的子域层级,而是架构责任层 / 依赖角色。`L4-observability` 收敛为五类依赖角色:

- `Observability 核心语义角色`:承载 observation material、safety decision、correlation context、audit projection、body-free evidence linkage、report handoff fact、authenticity hint、retention marker、active reference protection、rebuild / replay fact、no-write violation 和 truth / derived / external body 边界判断。
- `Observability 编排 / 承接角色`:承接同步查询 / 诊断 / handoff 入口、异步观察材料消费、后台维护、派生、交接和留存触发,并把外部输入转换为核心可接受的安全引用、摘要、正式变化、缺口、降级或交接材料。
- `外部能力接缝角色`:承接 `L0-bus`、identity、governance、artifact、runtime、sandbox、archive、SDK、console、report / acceptance systems、external audit / GRC 和产品中立观察能力等外部边界。
- `派生消费辅助角色`:承接只读查询视图、rollup、诊断摘要、外围消费摘要、报告交接材料、evidence index input、external audit / GRC 导出准备和长期分析材料,只能从 observation truth 派生。
- `技术承载角色`:承载观察面真相承载、派生投影 / 报告交接承载、事件协作、运行支撑、产品中立采集 / 存储 / 展示 / 导出能力,但不拥有观察语义定义权。

### 4.2 允许哪些依赖方向?

允许的依赖方向是外层依赖内层、接缝依赖正式边界、派生依赖 observation truth、技术承载服从正式承载契约。核心语义角色只允许依赖 `L0-core` 级共享契约和本仓内部观察面规则,不得依赖下游消费方、来源仓源码、事件主题、数据库产品、APM、dashboard、report 系统、GRC 产品、storage product、cache、search、handler、adapter、topic 或外部产品配置。

`Observability 编排 / 承接角色` 可以依赖核心语义、正式外部接缝、正式承载边界和派生规则,但不能绕过核心直接写存储,不能把外部事实原文或产品输出变成本仓 truth。`派生消费辅助角色` 可以依赖核心 truth 和授权范围,但不得形成第二份 observation truth 或向 source owner 反写。

### 4.3 禁止哪些反向依赖?

禁止 source business truth、bus 主干、identity lifecycle、governance decision、artifact / evidence body、runtime / sandbox execution truth、archive package、console UI state、external APM / dashboard / GRC / storage product、report final verdict 或技术设施反向定义 Observability truth。

也禁止把 `L1-identity`、`L1-governance`、`L1-artifact`、`L2-runtime`、`L4-sandbox`、`L4-archive`、`L0-sdk`、`L5-console`、report / acceptance systems、external audit / GRC、`L0-bus` 或外部观测产品写成 `L4-observability` 的编译期源码依赖。除 `L0-core` 外,任何运行期、事件协作、只读消费或交接关系都不得进入 package dependency。

### 4.4 外部系统通过哪些正式边界接入?

外部能力必须通过 `外部能力接缝角色` 进入,并由 `Observability 编排 / 承接角色` 转换为核心语义可接受的 source ref、bus material ref、actor / subject safe ref、governance / artifact / evidence ref、runtime / sandbox safe summary、安全观察材料、缺口、降级、report handoff material、retention / archive handoff 或 no-write violation 语境。

任何外部对象都不能直接写 `Observability 核心语义角色`,也不能绕过核心真相把数据放入 dashboard、alert、report、GRC 导出、rollup、cache 或 external product 后再反写 observation truth 或 source truth。

### 4.5 本仓在全局依赖基线中涉及哪些跨仓依赖边?

本仓直接涉及:

- `L0-core`:唯一编译期依赖。
- `L0-bus`:事件协作主干,提供 tap / audit material 和观察材料协作入口。
- `L1-identity`:actor / subject safe ref、身份审计语境和身份相关观察消费协作。
- `L1-governance`:治理审计语境、policy / gate 观察线索、治理报告交接和审计消费协作。
- `L1-artifact`:artifact / evidence safe ref、完整性线索、body-free evidence linkage 和报告 / 证据交接协作。
- `L2-runtime`:运行 log / metric / trace 来源语境、安全运行观察面和诊断消费协作。
- `L4-sandbox`:sandbox 隔离、环境和执行相关观察语境,以及 sandbox 诊断缺口协作。
- `L4-archive`:retention marker、archive eligibility、active reference protection 和长期交接消费。
- `L0-sdk` / `L5-console`:只读访问、管理查看、诊断消费和报告交接访问边界。
- report / acceptance handoff systems、external audit / GRC、alert、anomaly analysis consumers:只读报告交接、审计导出或外围消费边界。

`L5` 其他产品和 `L6` 生态项目不进入当前架构主链;它们通常应通过 `L0-sdk`、`L5-console`、report / audit consumer 或正式产品 / 生态边界间接消费。

### 4.6 哪些依赖边进入本仓架构主链,哪些被裁剪出去?

进入主链的依赖边是与安全观测材料入口、审计投影、body-free evidence linkage、安全运行观察面、只读诊断 / report handoff、retention marker、active reference protection、rebuild / replay 和 no-write guard 直接相关的跨仓关系。

被裁剪出去的是 OTel、Prometheus、Grafana、TimescaleDB、对象存储、外部 APM、GRC suite、alert sink、dashboard layout、report tool、search backend、queue implementation、consumer group、topic、event schema、outbox、hash chain 分片、冷存天数、P95 / SLA、真实 `run_id`、真实 evidence alias、final verdict 和 signoff。这些可以作为后续技术选型、配置、测试、验收或实施计划候选,但不进入 Step 07 跨仓依赖主链。

### 4.7 进入主链的跨仓依赖分别是什么类型?

`L0-core` 是唯一编译期依赖。`L0-bus` 是事件协作依赖。`L1-identity`、`L1-governance`、`L1-artifact`、`L2-runtime`、`L4-sandbox` 是运行期 / 事件协作输入或协作边界。`L4-archive`、`L0-sdk`、`L5-console`、report / acceptance systems、external audit / GRC、alert 和 anomaly analysis 是运行期消费、只读交接或外围消费边界。

这些运行期、事件协作和交接关系不得写成 package dependency,也不得被实现侧解释为可以直接引用相邻仓源码。

### 4.8 哪些依赖必须倒置?

source owner / bus material、identity actor / subject、governance audit、artifact / evidence linkage、runtime / sandbox observation、archive handoff、SDK / console 查询、report / acceptance handoff、external audit / GRC、alert / dashboard、产品中立采集 / 存储 / 展示 / 导出、事件协作、存储、投影、缓存、rollup、report 和外部产品都必须通过正式边界倒置到 `Observability 编排 / 承接角色`、`外部能力接缝角色`、`派生消费辅助角色` 或 `技术承载角色`,不能让这些外部或技术对象直接进入核心语义。

核心语义只声明自己需要的引用、摘要、安全处置、关联语境、投影事实、交接事实、留存标记和反写违例规则,外部适配和技术实现服从这些规则。

### 4.9 哪些规则若不先写清,后续实现最容易失控?

最容易失控的规则是:只有 `L0-core` 可进入编译期依赖;运行期和事件协作不能被写成源码依赖;外部产品和基础设施不能成为 truth source;派生查询、diagnostic、rollup、dashboard、alert、report、GRC 导出和长期分析不能反写核心;事件 / bus / outbox / relay 不能承载 observation truth;identity、governance、artifact、runtime、sandbox、archive 和 report consumer 只能提供安全引用、摘要、观察材料、缺口或交接语境,不能成为本仓核心 truth 的上游正文来源。

---

## 5. 当前文档问题诊断

| 旧架构内容 | 问题 | 本轮处理 |
|---|---|---|
| 旧 `01_arch_step_07_dependency_direction.md` 把 log / metric / trace / audit schema 和字段写成结构化中间产物 | Step 07 应表达依赖角色、允许依赖、禁止依赖和跨仓裁剪,不应提前定义 schema 字段。 | 全部降级为 historical material,本步按依赖角色和全局裁剪规则重写。 |
| 旧 Step 07 `next_allowed_action=next_step_or_formal_assembly` | 与用户要求一个 Step 一个 Step 停审冲突,且 Step 07 后应等待 Step 08 确认。 | 改为 `wait_user_confirmation_before_step_08`。 |
| 旧 README 把 OTel、Prometheus、Grafana、TimescaleDB、对象存储、P95、冷存和 hash chain 写得像正式依赖 | 具名产品、指标和容量想象不是 Step 07 依赖方向结论。 | 只作为 historical material;产品选型、容量、NFR 和配置后移。 |
| 旧正式 `01-架构设计.md` 混写代码层、运行容器、产品栈、schema 和依赖方向 | 未经本轮 Step 01~07 停审,且会把运行关系和产品栈误写为源码依赖。 | Step 16 前不得继承旧正式正文。 |
| 需求侧依赖明确 `L0-core` 唯一编译期依赖,但旧产物未充分阻断 sibling repo 源码依赖 | 后续实现 agent 容易把运行期 / 事件协作误落成 package dependency。 | 本步输出裁剪表、类型分类表和禁止依赖表。 |
| 新版 Step 05 / Step 06 上下文与运行承载较多 | 若逐个子域或运行单元都画成依赖层,图会退化为子域图或运行拓扑图。 | 主图收缩为五类依赖角色,子域和运行承载分别留在 Step 05 / Step 06。 |

---

## 6. 改动前后对比

| 维度 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 层次主语 | schema / 产品 / 泛观测能力 | 架构责任层 / 依赖角色 | 本章讨论依赖保护,不是对象清单或产品拓扑。 |
| 核心保护 | log / metric / trace / audit 对象与存储 / 产品混在一起 | 核心语义只被正式承接角色依赖,派生不得反写 | 防止第二 observation truth 和技术反向定义。 |
| 外部来源 | source owner / bus / runtime / artifact 可被看作直接依赖 | 外部来源只通过引用 / 摘要 / 正式边界进入 | 防止 source truth、execution truth 或 evidence body 漂移。 |
| 下游消费 | SDK、console、report、archive、GRC 可反推核心 | 下游只能经正式边界只读消费或交接 | 防止消费需求统治观察面模型。 |
| 技术机制 | OTel、Prometheus、Grafana、TimescaleDB、对象存储容易成为主依赖 | 技术和外部产品只能作为后续候选或接缝,不能定义核心 | 保持架构边界稳定。 |
| 跨仓依赖 | 未充分区分依赖类型 | `L0-core` 编译期,其他按运行期 / 事件协作 / 下游消费 / 追溯交接处理 | 防止实现阶段依赖失控。 |

---

## 7. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A: 按代码分层写 api / application / domain / infra | 对开发者熟悉。 | 会提前进入概要 / 详细设计,且无法表达跨仓依赖红线。 | 不采用。 |
| 方案 B: 按核心语义、编排承接、外部接缝、派生辅助、技术承载写依赖角色 | 能保护 observation truth,并承接 Step 05 / Step 06 结论。 | 后续仍需在概要设计映射到代码主体。 | 采用。 |
| 方案 C: 把所有上下游仓都画成直接依赖 | 看似完整。 | 会把运行期和事件协作误写为源码依赖。 | 不采用。 |
| 方案 D: 只写 `L0-core` 和 `L0-bus`,忽略 identity / governance / artifact / runtime / sandbox / consumers | 图更简单。 | 会遗漏材料域来源、body-free evidence、report handoff、retention 和消费反写风险。 | 不采用。 |
| 方案 E: 把 OTel / Prometheus / Grafana / TimescaleDB / 对象存储 / external GRC 放入当前依赖主链 | 贴近旧实现想象。 | 会把技术机制或外围增强变成 truth 来源。 | 不采用。 |
| 方案 F: 把 report handoff / external audit / alert / dashboard 当成核心依赖写入口 | 能突出消费能力。 | 会让派生面被误读为 observation truth 写源或最终验收结论来源。 | 不采用。 |

### 7.1 待确认问题的方案选择

| 待确认项 | 备选方案 | 推荐方案 | 推荐理由 |
|---|---|---|---|
| 核心语义能否直接依赖 identity / governance / artifact / runtime / sandbox / archive 等仓源码 | A. 可以;B. 不可以,只能接收经边界转换后的 ref / summary / snapshot / signal / handoff | B | 保护唯一编译期依赖和相邻 truth 边界。 |
| 是否把外部 APM / OTel / Prometheus / Grafana / TimescaleDB 放入当前依赖主链 | A. 放入;B. 不放入,仅作为后续技术或外围增强候选 | B | 当前核心是产品中立 observation truth,不是外部产品配置。 |
| 派生 query / diagnostic / rollup / report / dashboard 是否可以反写 observation truth | A. 可以;B. 不可以,只能从 truth 派生 | B | 防止派生面成为第二 observation truth。 |
| `L0-bus` 是否作为编译期依赖进入业务核心 | A. 是;B. 否,只作为事件协作依赖 | B | 对齐全局依赖裁剪规则,避免 event infra 定义核心语义。 |
| `L4-archive` / report handoff consumer / external audit 是否拥有本仓 observation truth | A. 拥有;B. 不拥有,只消费或承接交接材料 | B | 本仓拥有观察面真相;外部消费者只读消费或交接。 |
| report handoff 是否可以生成真实 evidence / verdict / signoff | A. 可以;B. 不可以,只交接观察线索、脱敏状态、缺口和真实性提示 | B | 避免设计文档伪造真实验收材料。 |

---

## 8. 结构化中间产物

### 8.1 依赖方向图

```text
+====================================================================+
|                  L4-observability 依赖边界                         |
|                                                                    |
|   +---------------------------+       +--------------------------+ |
|   | 外部能力接缝角色          |       | 技术承载角色             | |
|   | source / bus / consumers  |       | storage / event support  | |
|   +-------------+-------------+       +-------------+------------+ |
|                 | 边界接入                          | 允许依赖    |
|                 v                                   v             |
|        +--------+-----------------------------------+------+      |
|        | Observability 编排 / 承接角色                     |      |
|        | intake / query / diagnostic / handoff / maintain  |      |
|        +----------------------+----------------------------+      |
|                               | 允许依赖                          |
|                               v                                   |
|        +----------------------+----------------------------+      |
|        | Observability 核心语义角色                         |      |
|        | observation / audit / retention / no-write truth   |      |
|        +----------------------+----------------------------+      |
|                               ^                                   |
|                               | 允许依赖                          |
|        +----------------------+----------------------------+      |
|        | 派生消费辅助角色                                   |      |
|        | query / rollup / diagnostic / report / export     |      |
|        +---------------------------------------------------+      |
|                                                                    |
+====================================================================+
```

图示说明:

- 箭头只表示允许依赖或边界接入,不表示运行调用顺序、协议时序、事件传播顺序或代码调用链。
- `Observability 核心语义角色` 是被保护的中心,外部来源、下游消费、技术承载和派生辅助都不能反向定义它。
- `派生消费辅助角色` 可以依赖核心 truth 和授权范围,但不得形成第二 observation truth 或 source truth。
- `技术承载角色` 只服从正式承载契约,不决定观察语义、redaction、correlation、handoff、retention 或 no-write 规则。

### 8.2 层间约束表

| 架构责任层 / 依赖角色 | 允许依赖 | 禁止依赖 | 说明 |
|---|---|---|---|
| `Observability 核心语义角色` | `L0-core` 共享契约和本仓内部观察面规则 | 下游消费方、来源仓正文、event topic、数据库产品、APM、dashboard、report system、GRC、storage product、cache、search、external product config | 保护 observation material、audit projection、body-free evidence linkage、report handoff、retention marker 和 no-write violation 不被外部反向定义。 |
| `Observability 编排 / 承接角色` | 核心语义角色、正式外部接缝、正式承载边界、派生规则 | 绕过核心直接写 truth store;把外部事实原文变成本仓 truth;把下游展示状态写入核心;把 report / dashboard / GRC / rollup 当写源 | 承接输入和消费,但必须把外部能力转换为核心允许的引用、摘要、正式变化、缺口、降级或交接材料。 |
| `外部能力接缝角色` | 正式边界、编排 / 承接角色、必要的运行期协作对象 | 直接依赖核心存储结构;直接改变核心语义;越过安全边界输出事实;把运行期或事件协作依赖写成源码依赖 | 外部能力只能通过受控接缝进入或消费,不能打穿核心。 |
| `派生消费辅助角色` | 核心语义角色、授权范围、正式派生规则和交接边界 | 生成新 observation truth;覆盖核心事实;绕过 redaction / correlation / visibility 输出;把 query / diagnostic / report / dashboard / export 反写核心 | 查询视图、rollup、诊断、报告、外部审计导出和长期分析都只是消费辅助,可重建且不得反写。 |
| `技术承载角色` | 核心定义的正式状态、派生规则和承载契约 | 决定材料安全性、来源真实性、关联语义、审计投影含义、证据正文归属、留存规则、真实性提示或 no-write 结论 | 存储、事件、索引、缓存、任务调度、采集、展示和外部产品适配只能支撑架构,不能定义架构。 |

### 8.3 依赖倒置结论

| 需要倒置的依赖 | 倒置方式 | 保护目标 |
|---|---|---|
| `L0-bus` tap / audit material | 事件协作通过正式边界进入异步材料消费,核心只接收安全材料语境和 bus material ref | 防止 bus publish / subscribe / ack / retry / dead-letter / replay 主干定义 observation truth。 |
| `L1-identity` actor / subject 语境 | 核心只保存 actor / subject safe ref、身份审计语境和责任主体摘要 | 防止身份生命周期、认证授权和角色 truth 进入 Observability。 |
| `L1-governance` 治理审计语境 | governance decision、policy / gate 线索只以审计语境、引用、摘要或 handoff purpose 进入 | 防止治理裁决 truth 被审计投影替代。 |
| `L1-artifact` artifact / evidence 语境 | artifact、evidence、baseline 和完整性线索只以 body-free ref、digest 线索、summary 或 gap 进入 | 防止 evidence body、artifact body 和 lineage truth 被复制到 Observability。 |
| `L2-runtime` / `L4-sandbox` 观察来源 | execution、sandbox control、tool result 和 provider response 只以安全观察来源摘要、signal 或 gap 进入 | 防止 log / metric / trace 替代 execution truth 或 sandbox truth。 |
| `L4-archive` 留存 / 归档消费 | archive handoff 只消费 retention marker、archive eligibility、active reference protection 和交接语境 | 防止 archive package、recovery body 或长期正文保存反向定义本仓 truth。 |
| `L0-sdk` / `L5-console` 只读入口 | SDK / console 只通过只读查询、诊断和管理查看边界消费 | 防止 UI state、dashboard layout 或入口体验定义观察面 truth。 |
| report / acceptance handoff systems | 只接收 report handoff、evidence index input、脱敏状态、缺口和真实性提示 | 防止 report consumer 生成 final verdict、真实 run、真实 evidence alias 或 signoff。 |
| external audit / GRC / alert / anomaly consumers | 只消费安全摘要、告警线索、审计导出准备或长期分析材料 | 防止外围消费工具成为 truth source。 |
| 外部 APM / OTel / Prometheus / Grafana / TimescaleDB / 对象存储 | 作为产品中立采集、存储、展示或导出候选,服从核心定义 | 防止外部产品配置和存储模型定义 observation truth。 |
| 存储 / 投影 / 缓存 / rollup / report | 作为技术承载或派生消费实现,服从核心定义 | 防止技术产品、派生结果或缓存成为 truth source。 |

### 8.4 按架构单元组织的依赖规则表

| 架构单元 | 允许依赖谁 | 禁止依赖谁 | 外部接入方式 | 停审结果 |
|---|---|---|---|---|
| `Observability 核心语义角色` | `L0-core` 共享契约;本仓内部观察面规则 | 任意相邻仓源码;运行期对象;事件主题;数据库 / APM / dashboard / report / GRC / storage / cache / search 产品 | 不直接接入外部;由编排 / 承接角色提供已收束输入 | pass |
| `Observability 编排 / 承接角色` | 核心语义角色;外部能力接缝;技术承载契约;派生规则 | 绕过核心写 truth store;从派生材料反推核心;把外部正文原文或 source truth 变成 truth | 同步入口、异步观察材料消费、后台维护触发均经正式边界 | pass |
| `外部能力接缝角色` | 编排 / 承接角色;正式外部协作边界 | 核心存储结构;核心状态私有规则;相邻仓私有实现;外部产品配置 truth | safe ref / summary / snapshot / signal / gap / handoff | pass |
| `派生消费辅助角色` | 核心 truth;授权范围;派生规则;交接边界 | 新建 / 覆盖 observation truth;反写 source truth;绕过 redaction / visibility 输出 | query / rollup / diagnostic / report / dashboard / alert / GRC / analysis 消费边界 | pass |
| `技术承载角色` | 正式承载契约;核心定义的状态和派生规则 | 观察语义定义权;redaction / correlation 规则定义权;证据正文归属;最终 verdict / signoff;外部产品 truth | storage、event、cache、index、collector、dashboard、export 作为实现候选后置 | pass |

### 8.5 本仓依赖裁剪表

| 关联项目 | 全局关系 | 本仓角色 | 依赖类型 | 是否进入当前文档主链 | 裁剪理由 |
|---|---|---|---|---|---|
| `L0-core` | `L4-observability` 编译期依赖 `L0-core` | 依赖方 | 编译期 | 是 | 共享 ID、typed ref、trace / correlation、metadata、error 和安全标记是 observation truth 跨仓表达前置。 |
| `L0-bus` | `L4-observability` 通过 `L0-bus` 消费 tap / audit material | 协作方 | 事件协作 | 是 | 横切观察材料主要经事件协作进入,但 bus 不承载 observation truth 或 source truth。 |
| `L1-identity` | 需求 / 上下文确认 identity 为 actor / subject 来源和消费方 | 协作方 | 运行期 / 事件协作 | 是 | 身份审计语境和 actor / subject safe ref 需要协作,identity truth 不归 Observability。 |
| `L1-governance` | 治理审计语境、policy / gate 线索和报告消费协作 | 协作方 | 运行期 / 事件协作 | 是 | Governance 需要审计投影和 handoff,但 governance decision truth 不归 Observability。 |
| `L1-artifact` | artifact / evidence safe ref、完整性线索和 body-free evidence linkage 协作 | 协作方 | 运行期 / 事件协作 | 是 | Artifact / evidence body 和 lineage truth 不归 Observability。 |
| `L2-runtime` | runtime 提供运行 log / metric / trace 来源语境并消费诊断摘要 | 协作方 | 运行期 / 事件协作 | 是 | 运行观察材料需要 runtime 来源,但 execution truth 不归 Observability。 |
| `L4-sandbox` | sandbox 提供隔离 / 环境 / 执行观察语境并消费诊断缺口 | 协作方 | 运行期 / 事件协作 | 是 | Sandbox truth 和 control truth 不归 Observability。 |
| `L4-archive` | archive 消费 retention marker、archive eligibility 和长期交接 | 被依赖方 | 运行期 / 追溯交接 | 是 | 留存和归档准备需要交接边界,archive package 不归 Observability。 |
| `L0-sdk` | SDK 运行期封装 L1 / L2 / L3 / L4 API | 被依赖方 | 运行期 | 是 | SDK 是默认访问和只读消费边界,不能反向定义 observation truth。 |
| `L5-console` | console 经 SDK / 管理 API 消费 L4 观察能力 | 被依赖方 | 运行期 | 是 | Console 是管理查看和诊断入口,UI state 不能定义 observation truth。 |
| report / acceptance handoff systems | 需求确认的报告 / 验收审查消费边界 | 被依赖方 | 运行期 / 追溯交接 | 是 | report handoff 需要交接材料线索、脱敏状态和真实性提示,但不生成最终验收结论。 |
| external audit / GRC consumers | 外围审计和 GRC 消费边界 | 被依赖方 | 运行期 / 外围消费 | 是 | 外部审计导出可消费安全摘要,但 GRC truth 不归 Observability。 |
| alert / anomaly / long-term analysis consumers | 外围增强消费边界 | 被依赖方 | 运行期 / 外围消费 | 是 | 告警、异常分析和长期分析只能消费派生摘要,不反写 truth。 |
| OTel / Prometheus / Grafana / TimescaleDB / 对象存储 / external APM | 旧文档实现候选或外部技术线索 | 非正式外部依赖 | 运行期候选 | 否 | 属于后续技术选型、配置、测试或实施选择,不进入跨仓依赖主链。 |
| `L5-chat` / `L5-runner` / `L5-sync` / 其他 L5 产品 | 产品经 SDK 消费平台能力 | 被依赖方 | 运行期 | 否 | 当前 Observability 架构主链不逐个展开产品仓,应经 SDK / console /正式消费边界消费。 |
| `L6` 生态入口 | 生态经 SDK / public APIs 消费能力 | 被依赖方 | 运行期 / 事件协作 | 否 | 当前 Observability 架构主链不直接依赖生态仓。 |

### 8.6 本仓依赖类型分类表

| 依赖类型 | 关联项目 | 本仓如何使用 / 提供能力 | 后续文档落点 |
|---|---|---|---|
| 编译期依赖 | `L0-core` | 使用共享 ID、typed ref、trace / correlation、metadata、error 和安全标记。 | 详细设计 / 实施计划 |
| 事件协作依赖 | `L0-bus`;`L1-identity`;`L1-governance`;`L1-artifact`;`L2-runtime`;`L4-sandbox` | 消费 tap / audit material、source observation material、actor / subject refs、governance / artifact / runtime / sandbox 观察信号,并协作输出缺口、审计投影或交接状态。 | 架构设计 / 关键交互 / 测试方案 |
| 运行期依赖 | `L1-identity`;`L1-governance`;`L1-artifact`;`L2-runtime`;`L4-sandbox`;`L4-archive` | 运行时消费安全引用、来源摘要、证据线索、运行观察来源、sandbox 语境和归档交接边界。 | 架构设计 / 详细设计 |
| 下游消费 / 运行期提供 | `L0-sdk`;`L5-console`;report / acceptance handoff systems;external audit / GRC;alert / anomaly / long-term analysis consumers;`L4-archive` | 向 SDK、console、报告、验收审查、外部审计、GRC、告警、分析和归档消费方提供安全观察面、诊断摘要、交接材料和留存线索。 | 架构设计 / 实施计划 |
| 后续技术候选 | OTel、Prometheus、Grafana、TimescaleDB、对象存储、external APM、GRC suite、alert sink、search / cache / storage product | 可作为采集、存储、展示、导出、告警或外部审计能力候选,不得定义核心 observation truth。 | 技术选型 / 配置设计 / 测试方案 |

`L4-archive` 的双角色必须显式区分:它消费 retention / archive eligibility / handoff material,但不拥有 observation truth。`L4-observability` 对 `L1-artifact` / `L1-governance` / `L1-identity` / `L2-runtime` / `L4-sandbox` 的双向关系也必须区分:来源语境、只读消费和交接协作都不意味着本仓拥有相邻 truth。

### 8.7 本仓禁止依赖表

| 禁止依赖 | 禁止原因 | 正确协作方式 |
|---|---|---|
| `L4-observability -> L1-identity` 编译期依赖 | 会把身份生命周期、认证授权和 role truth 耦合进 Observability | 使用 `L0-core` shared ref,通过运行期 / 事件协作消费 actor / subject safe ref。 |
| `L4-observability -> L1-governance` 编译期依赖 | 会把 governance decision、policy、gate 和 control truth 耦合进 Observability | 使用治理引用、审计语境、safe summary、report purpose 和运行期 / 事件协作。 |
| `L4-observability -> L1-artifact` 编译期依赖 | 会把 artifact body、evidence body、version 和 lineage truth 引入观察仓 | 使用 artifact / evidence safe ref、digest 线索、body-free linkage 和运行期 / 事件协作。 |
| `L4-observability -> L2-runtime` / `L4-sandbox` 编译期依赖 | 会把 execution truth、sandbox control truth、tool result 或 provider response 混入观察面 | runtime / sandbox 仅通过观察来源摘要、safe signal、gap 和正式协作边界输入。 |
| `L4-observability -> L4-archive` 编译期依赖 | 会把 archive package、recovery body 和长期正文保存实现引入观察仓 | 通过 retention marker、archive eligibility、handoff 和运行期交接边界协作。 |
| `L4-observability -> L0-bus` 编译期依赖到业务核心 | Bus 是事件协作主干,但不应成为 observation core 的业务实现依赖 | 通过正式事件协作边界接入,核心只依赖 `L0-core` 共享契约。 |
| `L4-observability -> L0-sdk` / `L5-console` / report consumer 编译期依赖 | 会让入口体验、UI state 或报告消费需求反向定义 observation truth | 经正式只读查询、诊断、report handoff 和 SDK / console 边界消费。 |
| `L4-observability -> OTel / Prometheus / Grafana / TimescaleDB / 对象存储 / external APM` 作为核心语义依赖 | 会让技术产品、存储模型或外部配置定义 observation truth | 作为后续技术选型、配置或外围增强候选,不得定义核心。 |
| `L4-observability -> external GRC / alert / dashboard / analysis product` 作为核心语义依赖 | 会让外部消费和展示工具成为 truth source | 仅作为只读导出、告警或分析消费边界。 |
| 派生视图 / query / diagnostic / rollup / report / export -> observation truth 反写 | 派生结构可延迟和重建,不能成为第二 truth | 从核心 truth 派生,必要时重建派生结果。 |
| report handoff -> final verdict / real evidence / signoff | 会伪造真实测试和验收材料 | report handoff 只交接观察线索、脱敏状态、缺口和真实性提示。 |
| retention / replay / rebuild -> source truth repair | 会让维护路径修复、删除、覆盖或反写 source truth | 只作用于 observation truth、retention marker 和派生投影。 |
| `L5/L6` 产品或生态仓绕过 `L0-sdk` 直接绑定 `L4-observability` 源码 | 会破坏 SDK 统一接入层和依赖裁剪规则 | 经 SDK、console、report / audit consumer 或 public boundary 消费。 |

### 8.8 依赖裁剪图

#### 依赖裁剪图: L4-observability

```text
Global baseline
  |
  | crop only L4-observability related edges
  v
+-----------+ [compile]   +-------------------+   [event] +--------+
| L0-core   +------------>| L4-observability  |<----------+ L0-bus |
+-----------+             +---------+---------+           +--------+
                                    ^
                                    | [runtime/event]
               +--------------------+--------------------+
               |                                         |
               v                                         v
 identity / governance / artifact            runtime / sandbox sources
 archive / SDK / console                     report / audit / GRC consumers
 alert / anomaly / analysis                  downstream read-only consumers
```

图示说明:

- 本图只展示 `L4-observability` 相关依赖,不展示全 27 仓。
- `[compile]` 只有 `L0-core`,可进入后续 Cargo / package dependency 讨论。
- `[runtime]`、`[event]` 和追溯交接 / 外围消费关系不得写成 package dependency,只能进入正式边界、adapter、event、projection、report、handoff 或配置讨论。
- 箭头表达依赖 / 消费 / 协作方向,不表达调用顺序、接口时序或事件传播顺序。

### 8.9 依赖方向停审记录

| 架构单元 | 层级是否清楚 | 禁止依赖是否明确 | 运行期 / 事件协作是否未误写为 package dependency | 停审结果 |
|---|---|---|---|---|
| `Observability 核心语义角色` | pass | pass | pass | pass |
| `Observability 编排 / 承接角色` | pass | pass | pass | pass |
| `外部能力接缝角色` | pass | pass | pass | pass |
| `派生消费辅助角色` | pass | pass | pass | pass |
| `技术承载角色` | pass | pass | pass | pass |
| `跨仓依赖裁剪` | pass | pass | pass | pass |

### 8.10 跨依赖边界审计表

| 审计项 | 结果 | 说明 |
|---|---|---|
| 是否存在反向依赖 | pass | identity、governance、artifact、runtime、sandbox、archive、SDK、console、report、GRC、APM、dashboard 和 storage 均不得反向定义 observation truth。 |
| 是否存在运行期通信误写 package dependency | pass | 除 `L0-core` 外,均按运行期、事件协作、下游消费、外围消费或追溯交接处理。 |
| 是否存在跨仓依赖裁剪不一致 | pass | 承接全局矩阵中 `L4-observability` 行,并补充需求 / 上下文确认的 identity、governance、artifact、runtime、sandbox、archive、SDK、console 和 report / audit 消费边界。 |
| 是否存在依赖类型误判 | pass | `L0-bus` 作为事件协作,不是业务核心编译期依赖;`L0-sdk` / console / report consumers 是消费入口。 |
| 是否存在 adapter / repository 名词误作架构规则 | pass | 旧 schema、collector、store、outbox、handler、repository 和 product 名称未进入正式依赖角色。 |
| 是否存在技术产品定义核心语义 | pass | OTel、Prometheus、Grafana、TimescaleDB、对象存储、external APM、GRC、alert sink 和 dashboard 仍为后续技术或外围候选。 |
| 是否存在真实 evidence / signoff 污染 | pass | report handoff 不生成真实 run、真实 evidence alias、final verdict 或 signoff。 |
| 是否存在后续概要设计承接风险 | pass | 本步只定义依赖保护结构,未提前写代码目录、crate、trait、DTO、event payload、database table 或 repository。 |

### 8.11 依赖边界说明

`L4-observability` 的依赖方向以保护 observation material、audit projection、body-free evidence linkage、report handoff、retention marker 和 no-write violation truth 为中心:外部来源可以提供引用、摘要、观察材料、缺口或交接语境,下游可以消费授权安全观察面,技术承载可以支撑存储和派生,但它们都不能反向定义核心语义。`L0-core` 是唯一可进入编译期的共享契约基线,其余跨仓关系必须按运行期、事件协作、追溯交接、只读消费或外围消费处理。这个边界让后续概要设计可以继续展开代码主体骨架,但不会把 identity lifecycle、governance decision、artifact body、runtime execution、sandbox control、archive package、console UI、external APM、dashboard、GRC、report verdict 或技术产品提前写进 Observability 核心。

---

## 9. 回填草稿

以下内容供 Step 16 重建正式 `01-架构设计.md` 时回填。正式文档可摘录本文件 §8 的结构化结论,不重复扩写 SOP 问题回答、旧材料诊断和设计取舍。

```md
## 8. 依赖方向与层间约束

> 校准来源:
> - `design-calibration/01_arch_step_07_dependency_direction.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“结构化中间产物”“依赖方向停审记录”和“跨依赖边界审计表”小节,了解本章如何从容器 / 部署视图和全局依赖基线收敛出依赖保护结构。

### 8.1 依赖方向图

摘录 `design-calibration/01_arch_step_07_dependency_direction.md` §8.1。

### 8.2 层间约束表

摘录 `design-calibration/01_arch_step_07_dependency_direction.md` §8.2。

### 8.3 依赖倒置结论

摘录 `design-calibration/01_arch_step_07_dependency_direction.md` §8.3。

### 8.4 按架构单元组织的依赖规则表

摘录 `design-calibration/01_arch_step_07_dependency_direction.md` §8.4。

### 8.5 本仓依赖裁剪表

摘录 `design-calibration/01_arch_step_07_dependency_direction.md` §8.5。

### 8.6 本仓依赖类型分类表

摘录 `design-calibration/01_arch_step_07_dependency_direction.md` §8.6。

### 8.7 本仓禁止依赖表

摘录 `design-calibration/01_arch_step_07_dependency_direction.md` §8.7。

### 8.8 依赖裁剪图

摘录 `design-calibration/01_arch_step_07_dependency_direction.md` §8.8。

### 8.9 依赖边界说明

摘录 `design-calibration/01_arch_step_07_dependency_direction.md` §8.11。
```

---

## 10. 待确认事项

本步不新增阻塞 Step 08 的待确认事项。下列事项进入后续 Step,不得在 Step 07 中提前闭口:

| 编号 | 待确认事项 | 当前状态 |
|---|---|
| `Q-OBS-ARCH-007-001` | source owner、bus material、actor / subject、governance、artifact / evidence、runtime / sandbox 的正式 ref / summary / carrier 如何在概要和详细设计中表达 | 后续数据所有权、概要和详细设计收敛。 |
| `Q-OBS-ARCH-007-002` | 运行期依赖和事件协作如何映射到具体 adapter、event、projection、handoff 或 resolver | 后续关键交互、概要 / 详细设计和测试方案收敛。 |
| `Q-OBS-ARCH-007-003` | 派生查询、rollup、diagnostic、report、GRC export 和 dashboard 是否需要独立存储或 worker | 后续技术选型、配置、详细设计和实施计划收敛。 |
| `Q-OBS-ARCH-007-004` | OTel、Prometheus、Grafana、TimescaleDB、对象存储、external APM、GRC 或 alert sink 是否进入正式技术主线 | 后续 Step 10、配置、测试和实施计划收敛。 |
| `Q-OBS-ARCH-007-005` | report handoff、evidence index input、authenticity hint 和 external audit / GRC 导出的正式格式 | 后续关键交互、详细设计、测试、验收和实施计划收敛。 |
| `Q-OBS-ARCH-007-006` | `L0-bus` 事件协作的 topic、consumer、ack、retry、dead-letter 和 replay 机制如何表达 | 归 `L0-bus` 主干和后续交互 / 详细设计边界,本仓不拥有 bus 主干 truth。 |

---

## 11. 自检与门禁

| 检查项 | 结果 | 说明 |
|---|---|---|
| 是否明确本仓内部架构责任层 / 依赖角色 | pass | §8.1 / §8.2 已定义五类依赖角色。 |
| 是否明确允许依赖方向和禁止反向依赖 | pass | §8.2 / §8.7 已给出允许、禁止和正确协作方式。 |
| 是否明确必要倒置边界 | pass | §8.3 已逐项列出 bus、identity、governance、artifact、runtime、sandbox、archive、SDK、console、report、GRC、产品和技术倒置。 |
| 是否按全局依赖基线裁剪本仓跨仓依赖子图 | pass | §8.5 / §8.6 / §8.8 已输出裁剪表、分类表和裁剪图。 |
| 是否每个架构单元完成停审 | pass | §8.9 已逐项通过层级、禁止依赖和 package dependency 检查。 |
| 是否完成跨依赖边界审计 | pass | §8.10 未发现反向依赖、依赖类型误判、技术产品定义核心或实现名词污染。 |
| 是否避免把运行时通信、代码目录、数据库、接口协议或事件 payload 写成层间约束 | pass | 未写 API、handler、repository、DTO、topic、payload、表结构或技术产品选型。 |
| 是否保持 report handoff 与 evidence authenticity 的真实性边界 | pass | 未生成真实 run、evidence alias、final verdict、signoff 或测试结果。 |
| gate_status | pass | 当前 Step 07 已完成。 |
| next_allowed_action | wait_user_confirmation_before_step_08 | 必须等待用户确认后才允许进入 Step 08 `数据所有权与一致性策略`。 |

当前 Step 07 `依赖方向与层间约束` 已完成。下一步必须等待用户确认后进入 Step 08 `数据所有权与一致性策略`,并只创建 / 改写 `design-calibration/01_arch_step_08_data_ownership_consistency.md`。
