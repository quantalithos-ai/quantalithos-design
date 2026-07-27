# L3-capability-hub 01 架构 Step 16: 正式文档装配

> 创建日期: 2026-07-08
> 状态: completed
> 当前模式: full-restart
> 本轮口径: 将 Step 1~15 已确认结论按正式 `01-架构设计.md` 结构重组、统一和回填;不新增未经讨论的新结论,不恢复旧文档中的旧范围、旧对象主线、旧技术设施或旧性能口径。
> 正式文档目标: `projects/L3-capability-hub/01-架构设计.md`
> 项目级台账: `design-calibration/project_execution_ledger.md`
> 文档级 flow: `design-calibration/01_architecture_calibration_flow.md`

---

## 0. Step 开工确认

| 项目 | 记录 |
|---|---|
| Step | Step 16 整理正式文档 |
| 输出文件 | `design-calibration/01_arch_step_16_formal_document_assembly.md`;`01-架构设计.md` |
| 已读取通用规范 | yes:`设计文档讨论中间产物规范.md`;`设计文档编写通则.md`;`设计真相源闭环与可落码性标准.md`;`全局项目依赖关系与裁剪规则.md` |
| 已读取 SOP / 书写规范 | yes:`架构设计讨论流程_SOP.md` Step 16;`架构设计书写规范.md` 18 章主链和 `§18 参考` |
| 已读取前序输入 | yes:`01_arch_step_01_requirement_baseline.md`~`01_arch_step_15_adr_traceability.md`;正式 `00-需求文档.md` |
| 已读取正式文档旧稿 | yes:旧 `projects/L3-capability-hub/01-架构设计.md` |
| 已读取参考粒度 | yes:`L1-governance` / `L3-method-library` / `L0-sdk` 的 Step 16 中间产物与正式 `01-架构设计.md` |
| 当前模式 | full-restart |
| 进入条件 | pass:用户已确认进入 Step 16 |
| next_allowed_action | Step 16 完成后,等待用户确认是否进入 `02-概要设计.md` Step 1。 |

---

## 1. Step 内计划

| 模块 | 状态 | 产物 | gate_status | next_allowed_action |
|---|---|---|---|---|
| 必读文档读取 | done | 必读文档摘要 | pass | 进入整体模块骨架。 |
| 整体模块骨架 | done | 正式装配骨架 | pass | 进入章节回填思考。 |
| 章节回填:先思考 | done | 章节映射口径 | pass | 进入章节回填写入。 |
| 章节回填:再写入 | done | 章节回填映射表 | pass | 进入术语统一思考。 |
| 术语统一:先思考 | done | 术语保留 / 废弃口径 | pass | 进入术语统一写入。 |
| 术语统一:再写入 | done | 术语统一表 | pass | 进入交叉引用思考。 |
| 交叉引用:先思考 | done | 章节间承接链路 | pass | 进入交叉引用写入。 |
| 交叉引用:再写入 | done | 交叉引用表 | pass | 进入跨架构单元总审计。 |
| 跨架构单元总审计 | done | 总审计表 | pass | 进入正式文档更新。 |
| 正式文档更新 | done | `01-架构设计.md` 重建记录 | pass | 进入自检与停审。 |
| 自检与停审 | done | 自检表 / 完成结论 | pass | 结束 `01-架构设计.md` full-restart。 |

---

## 2. 必读文档

| 文档 | 读取结论 | 对 Step 16 的影响 |
|---|---|---|
| `standards/document/架构设计讨论流程_SOP.md` Step 16 | 正式装配只做重组、术语统一、交叉引用和总审计,不得新增新结论。 | 本 Step 不能继续补架构判断。 |
| `standards/document/架构设计书写规范.md` | 正式文档必须使用 1~18 章主链,每章要列具体校准来源,`§18 参考` 不得与 `§1`、`§16`、`§17` 混写。 | 正式 `01-架构设计.md` 必须整体重建。 |
| `01_arch_step_01_requirement_baseline.md`~`01_arch_step_15_adr_traceability.md` | Step 1~15 已形成 capability access truth 主线、红线、风险和追溯矩阵。 | 作为正式文档唯一装配来源。 |
| 正式 `projects/L3-capability-hub/00-需求文档.md` | 已明确 capability identity、registry、descriptor、governance seam、method relation、formal exposure 和边界外职责。 | 正式 `01` 必须直接承接新版 `00`。 |
| 旧 `projects/L3-capability-hub/01-架构设计.md` | 旧文档仍是 17 节 Draft 结构,含 `Provider Contract / QueryCapabilities / Cost Accounting / KMS / Vault / runtime gateway / 旧性能指标` 等历史主线。 | 只能用于差异审计,不能作为现行结论来源。 |

---

## 3. 整体模块骨架

| 模块 | 装配动作 | 不做的事 |
|---|---|---|
| 正式章节装配 | 按 1~18 章重新组织 `L3-capability-hub` 架构结论,每章保留校准来源。 | 不沿用旧 Draft 章节或旧目录结构。 |
| 术语统一 | 统一使用 capability access truth、formal intake boundary、adapter descriptor、governance seam、body-free method relation、formal exposure、controlled consumer view 等术语。 | 不恢复 `Provider Contract`、`QueryCapabilities`、`CapabilityDecision` truth、`Cost Accounting`、`KMS / Vault` 等旧主语。 |
| 交叉引用 | 确保职责、上下文、子域、依赖、数据、交互、技术、风险、追溯和 ADR 彼此可回指。 | 不把未闭口事项润色成已闭口事实。 |
| 旧材料排除 | 仅在差异审计中记录旧 01 的污染点。 | 不直接复用旧对象、旧指标、旧 ADR、旧设施或旧成功标准。 |
| 参考收口 | 只列当前正式需求、校准、标准和关键相邻仓参考。 | 不把旧 Draft、临时讨论稿或实现猜测写入 `§18 参考`。 |

---

## 4. 模块思考记录

### 4.1 章节回填:先思考

问题回答:

- 正式文档必须按 `架构设计书写规范.md` 的 18 章主链输出。
- Step 1 主要支撑 `§1 与上游文档的关系声明`、`§3 约束条件` 和 `§16 需求追溯矩阵`。
- Step 2 支撑 `§2 业务背景与驱动力` 与 `§3 约束条件`。
- Step 3~14 分别支撑职责、上下文、子域、容器 / 部署、依赖、数据、交互、技术、取舍、横切、演进和风险。
- Step 15 同时支撑 `§16 需求追溯矩阵` 与 `§17 ADR 索引`。
- Step 16 自身只负责装配规则、旧材料排除、术语统一和 `§18 参考`。

诊断:

- 旧 `01-架构设计.md` 仍保留旧 Draft 元信息、17 节结构和旧主线,其中 `MCP Registry / A2A Directory / Provider Contract / Cost Accounting / Policy-aware query` 已与本轮 capability access truth 主线冲突。
- 旧文档把 runtime execution、provider runtime、secret/KMS、cost、marketplace 和旧性能指标混入架构层,会直接污染后续 `02~07`。
- 直接在旧正文上局部替换风险过高,容易残留旧 ADR、旧对象名和旧设施假设。

取舍:

- 采用“删除旧正文后按 18 章重建”的方式。
- 正式文档只摘录 Step 1~15 已停审结论,不提前补 API / DTO / state / schema / storage / config / implementation boundary。
- 旧术语和旧设施只允许出现在 `§15 风险与待确认事项` 或本 Step 差异审计中。

### 4.2 章节回填:再写入

| 正式章节 | 主要校准来源 | 回填原则 |
|---|---|---|
| `§1 与上游文档的关系声明` | Step 1;Step 15;Step 16 | 承接新版 `00`、相邻仓边界和旧材料排除口径。 |
| `§2 业务背景与驱动力` | Step 2 | 说明为什么 capability access truth 需要独立存在。 |
| `§3 约束条件` | Step 1;Step 2 | 合并需求基线、硬约束、当前阶段取舍和非目标。 |
| `§4 职责边界` | Step 3 | 直接承接做 / 不做 / 易混淆 / 红线。 |
| `§5 系统边界与上下文` | Step 4 | 承接系统上下文图、上下游表和失效口径。 |
| `§6 限界上下文与子域划分` | Step 5 | 承接核心子域、支撑子域、本地索引 / 投影 / 引用层和统一语言。 |
| `§7 容器 / 部署架构` | Step 6 | 承接运行承载图、运行单元说明和逻辑可分部署口径。 |
| `§8 依赖方向与层间约束` | Step 7 | 承接依赖方向图、层间约束、裁剪表、禁止依赖和依赖倒置。 |
| `§9 数据所有权与一致性策略` | Step 8 | 承接 truth / snapshot / ref / forbidden body 分层和一致性策略。 |
| `§10 关键交互与通信方式` | Step 9 | 承接同步 / 异步 / 后台三类交互与失败口径。 |
| `§11 关键技术选型` | Step 10 | 只写机制级选型,不写产品级设施。 |
| `§12 备选方案与取舍` | Step 11 | 明确当前主线和不采用路径。 |
| `§13 横切关注点` | Step 12 | 承接安全、追溯、韧性、性能和配置红线。 |
| `§14 演进路线` | Step 13 | 承接当前阶段成立边界、可接受债务和触发条件。 |
| `§15 风险与待确认事项` | Step 14 | 保留正式风险与待确认,不脑补解决方案。 |
| `§16 需求追溯矩阵` | Step 15 | 承接 capability-hub 当前追溯主矩阵和缺口口径。 |
| `§17 ADR 索引` | Step 15 | 只保留长期架构决策候选索引,不伪造正式 ADR。 |
| `§18 参考` | Step 16 | 只列正式参考材料,不重复 `§1`、`§16` 和 `§17`。 |

### 4.3 术语统一:先思考

问题回答:

- 正式文档必须统一使用 capability access truth、formal intake boundary、capability identity、capability registry、adapter descriptor、governance seam relation、body-free method relation、formal exposure、controlled consumer view、safe summary、ref、forbidden body、core closure / peripheral enhancement 等架构主语。
- `Provider Contract`、`QueryCapabilities`、`CapabilityDecision`、`Cost Accounting`、`KMS / Vault truth`、`runtime gateway`、`marketplace listing truth` 都只能作为历史污染词汇出现。
- 术语统一的目标是保护后续 `02~07` 不再把旧对象误读为当前真相源。

诊断:

- 如果继续使用旧 `Provider Contract` 或 `QueryCapabilities` 作为现行名词,后续概要 / 详细设计会把 descriptor、formal exposure 和 consumer view 重新拉回旧实现路径。
- 如果把 `CapabilityDecision-style summary` 写成 formal truth,则 Step 8 / Step 9 已确认的 exposure / consumer view 分层会被破坏。

取舍:

- 正式文档中允许出现旧词,但只能出现在“禁止混淆”“历史冲突”“不采用路径”语境。
- 机制级术语保留抽象层,避免提前落地为 DB、cache、topic、API 或 DTO。

### 4.4 术语统一:再写入

| 统一术语 | 正式含义 | 禁止替代表达 |
|---|---|---|
| capability access truth | 本仓拥有的正式能力接入真相集合 | runtime capability cache、QueryCapabilities truth、marketplace listing、SDK client view |
| formal intake boundary | 外部来源、治理结果、方法关系和管理入口进入本仓的正式承接边界 | runtime gateway、provider adapter service、approval client |
| capability identity | 外部能力在本仓中的稳定主体锚点 | URL、provider 名、tool config、runtime config、listing |
| capability registry | 正式接入目录及其生命周期 / 可见性语义 | allowlist、availability bit、search index、marketplace directory |
| adapter descriptor | 接入方式、能力类型、风险 / 约束摘要语义 | Provider Contract、secret 容器、provider runtime contract |
| governance seam relation | capability 与治理结果之间的关系边界 | approval truth、Policy truth、shared_rules truth |
| body-free method relation | capability 与方法资产的无正文关系 | Method Content、TaskDefinition、AIPolicyDef、definition body |
| formal exposure | 服务端正式能力暴露边界 | runtime allow / deny decision、SDK wrapper、consumer cache |
| controlled consumer view | 从 formal exposure 派生的受控消费快照 | formal exposure truth、runtime truth、SDK client truth |
| safe summary / ref | 对外部对象的允许摘要或稳定引用 | 外部正文、外部生命周期、生产请求 / 响应正文 |
| forbidden body | 明确不得进入本仓的相邻系统正文 / 真相 | safe summary、ref、projection |
| core closure / peripheral enhancement | 当前必须闭合的核心主线与后续增强边界 | 将搜索、导出、console、marketplace、observability 视为核心前置 |

### 4.5 交叉引用:先思考

问题回答:

- 职责边界决定系统上下文、依赖、数据和交互的红线,因此 `§4` 必须被 `§5`~`§13` 多处回指。
- 数据所有权和交互方式必须共同保护 formal exposure / consumer view 分层与 forbidden body 边界。
- 风险、追溯和 ADR 必须共同保留历史主线回流、依赖回流、派生反写和未闭口事项。

诊断:

- 最容易断裂的链路是:在 `§5` 写清了 governance / method / SDK 接缝,但在 `§9` 或 `§10` 把它们重新写成正文 ownership 或实现依赖。
- 另一个高风险点是:在 `§14` 写“可接受债务”,却在 `§16` 和 `§17` 假装这些债务已经闭口。

取舍:

- 正式文档中的跨章引用以“边界保护关系”为主,不写章节间操作流程。
- 追溯缺口、风险和 ADR 候选彼此可见,但不互相替代。

### 4.6 交叉引用:再写入

| 主线 | 约束来源 | 正式落点 | 审计结论 |
|---|---|---|---|
| 独立 capability access truth | Step 1;Step 2;Step 3;Step 8;Step 11 | `§1`;`§2`;`§3`;`§4`;`§9`;`§12`;`§17` | 无断裂。 |
| identity / registry / descriptor / seam / relation / exposure 核心主轴 | Step 2;Step 3;Step 5;Step 8 | `§2`;`§4`;`§6`;`§9`;`§16`;`§17` | 无断裂。 |
| formal intake boundary | Step 3;Step 4;Step 9;Step 10 | `§4`;`§5`;`§10`;`§11`;`§13` | 无断裂。 |
| truth / snapshot / ref / forbidden body 分层 | Step 3;Step 8;Step 10;Step 12 | `§4`;`§9`;`§11`;`§13`;`§15`;`§17` | 无断裂。 |
| formal exposure / controlled consumer view 分层 | Step 2;Step 3;Step 8;Step 9;Step 11 | `§2`;`§4`;`§9`;`§10`;`§12`;`§16` | 无断裂。 |
| 同步 / 异步 / 后台三分 | Step 6;Step 8;Step 9;Step 10 | `§7`;`§9`;`§10`;`§11`;`§13`;`§17` | 无断裂。 |
| 非 `L0-core` sibling 仅运行期 / 事件 / ref 协作 | Step 1;Step 4;Step 7;Step 10 | `§3`;`§5`;`§8`;`§11`;`§15`;`§17` | 无断裂。 |
| 核心闭环与外围增强隔离 | Step 2;Step 4;Step 11;Step 12;Step 13 | `§2`;`§5`;`§12`;`§13`;`§14`;`§15`;`§17` | 未闭口范围已保留在风险和待确认事项。 |

---

## 5. 跨架构单元总审计

| 检查项 | 结论 | 说明 |
|---|---|---|
| Step 5 架构单元是否已停审 | pass | 五个核心子域、四个支撑子域和五类本地影子层均已停审。 |
| Step 7 依赖方向是否已停审 | pass | 依赖方向、裁剪表、禁止依赖和倒置边界均已闭合。 |
| Step 8 数据所有权是否已停审 | pass | truth / snapshot / ref / forbidden body 和一致性策略均已闭合。 |
| Step 9 通信方式是否已停审 | pass | 同步 / 异步 / 后台三类交互与失败口径已闭合。 |
| Step 12 横切关注点是否已停审 | pass | 正式边界、只读派生、失败口径、配置不可越界均已闭合。 |
| Step 15 ADR / 追溯是否已停审 | pass | 8 个长期架构决策候选和追溯缺口均有来源链。 |
| 是否存在职责重叠 | pass | execution、governance truth、method body、SDK client、marketplace、observability、cost 均未与核心子域重叠。 |
| 是否存在依赖方向冲突 | pass | 运行期、事件、ref / summary / relation 和编译期边界清楚。 |
| 是否存在数据所有权冲突 | pass | 相邻真相均保持 ref / safe summary / forbidden body 边界。 |
| 是否存在通信方式冲突 | pass | 核心 truth 同步裁定,事实传播异步,派生维护后台承接。 |
| 是否存在追溯断裂 | pass | capability-hub 仓定位、C-CH-1~5、BR / NFR / AC / VF 均能回指到架构承接结果。 |

---

## 6. 正式文档更新记录

| 文件 | 更新内容 | 说明 |
|---|---|---|
| `projects/L3-capability-hub/01-架构设计.md` | 删除旧 Draft 主体后按 18 章结构重建。 | 正文只承接 Step 1~15 已停审结论。 |

---

## 7. 旧材料差异审计

| 旧口径 | 装配处理 |
|---|---|
| 旧 17 节结构和 Draft 元信息 | 不继承;按新版 18 章结构和当前日期重建。 |
| `MCP Registry / A2A Directory / Provider Contract / Cost Accounting` 四子域主线 | 不继承;改写为 capability identity / registry / descriptor / seam / relation / exposure 主线。 |
| `QueryCapabilities`、`CapabilityDecision` 作为 truth | 不继承;只允许作为 controlled consumer view / summary 历史冲突语境出现。 |
| KMS / Vault、provider runtime、retry / failover / routing / quota、cost ledger | 不继承;全部保留为边界外历史设施或风险。 |
| 旧 P95、`30s`、SLA、明文 key、成本覆盖率等指标 | 不继承;当前只保留结构性 NFR 约束和量化待确认事项。 |
| 旧 ADR 编号 / 状态 | 不继承;当前只保留 `未建立` 的 ADR 候选索引。 |

---

## 8. 自检与停审

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否按 1~18 章装配正式文档 | pass | 正式文档已使用规范主链。 |
| 每章是否有具体校准来源 | pass | 每个正式章节开头均列出具体 `design-calibration` 文件。 |
| 是否新增 Step 1~15 之外的新结论 | pass | 未发现新增架构判断。 |
| 是否恢复旧范围或旧实现机制 | pass | 旧口径只在差异审计、风险或不采用路径语境出现。 |
| 是否完成跨架构单元总审计 | pass | identity / registry / descriptor / seam / relation / exposure 与外围边界无断裂。 |
| 是否可结束 `01-架构设计.md` full-restart | pass | Step 16 已完成,正式 `01-架构设计.md` 可作为后续 `02-概要设计.md` 输入。 |

### 8.1 本 Step 结论

Step 16 已完成。`projects/L3-capability-hub/01-架构设计.md` 已按本轮 Step 1~15 结论完成正式装配,旧 `Provider Contract / QueryCapabilities / Cost / KMS / runtime gateway` 主线未被继承。至此 `L3-capability-hub` 的 `01-架构设计.md` full-restart 校准完成。
