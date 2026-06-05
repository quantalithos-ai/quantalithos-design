# Step 1. 确认需求基线

> 对应 SOP: `standards/document/架构设计讨论流程_SOP.md` Step 1
> 回填章节: `01-架构设计.md` §1 / §3 / §16 的前置输入
> 生成日期: 2026-06-02
> 状态: 已完成

---

## 1. 本步目标

确认当前架构设计依赖的需求结论已经收敛到足以支撑架构推导的程度,并识别哪些需求结论会直接影响系统边界、数据所有权和依赖方向。

---

## 2. 本步输入

| 输入 | 状态 | 用途 |
|---|---|---|
| `projects/L1-work/00-需求文档.md` | 已按新版需求 SOP 重建 | 架构需求基线 |
| `design-calibration/00_req_step_01_upstream_relation.md` ~ `00_req_step_17_formal_document_assembly.md` | 已完成 | 需求结论追溯 |
| `projects/L0-core/00~07` | 已完成深度校准 | 共享契约与基础类型来源 |
| `projects/L0-bus/00~07` | 已完成深度校准 | 事件协作语义来源 |
| `projects/L0-sdk/00~07` | 已完成深度校准 | 下游访问和 client 封装边界 |
| `projects/L1-identity/00~07` | 已完成深度校准 | GlobalMember、actor、role 和成员生命周期引用来源 |
| `projects/L1-conversation/00~07` | 已完成深度校准 | conversation space、conversation fact、trace / handoff 和授权查询来源 |
| `projects/L3-method-library/00~07` | 已完成深度校准 | role / task / work product / process template / view profile 定义来源 |
| 旧 `projects/L1-work/01-架构设计.md` | 未按最新 SOP 校准 | 历史问题诊断输入 |

---

## 3. SOP 问题回答

### 3.1 当前架构设计依赖哪些需求结论？

架构设计依赖以下需求结论:

- `L1-work` 是项目工作事实真相仓。
- Work 必须独立拥有 Project、ProjectMember、Backlog 正式工作全集、WorkItem、child WorkItem、依赖 / 阻塞关系、Iteration 承诺子集、promote 后结果和工作事实追溯记录。
- GlobalMember、actor、role 生命周期归 `L1-identity` 和 `L0-core`;Work 只拥有 ProjectMember 项目内承担事实。
- conversation truth、method definition、process execution、governance decision、artifact body / evidence body、runtime execution、workspace aggregation 均不能拥有或反写 Work 真相。
- 核心能力闭环为“项目主语成立 -> 项目内成员承担成立 -> 正式工作全集成立 -> 当前承诺子集成立 -> 项目工作事实可消费可追溯成立”。
- ImplementationPlan / plan item / runtime step / conversation suggestion 进入正式 WorkItem 或 child WorkItem 必须经过显式 promote / formalize 边界。
- 查询、投影、看板、对账和维护报告只能消费或派生 Work 真相,不得成为新的业务真相写源。

### 3.2 哪些需求结论已经稳定？

已稳定结论包括:

- 仓定位稳定:`L1-work` 是项目工作事实真相仓。
- 数据归属稳定:Work 拥有项目工作事实真相;相邻仓正文禁止保存。
- 核心对象稳定:Project、ProjectMember、Backlog、WorkItem、child WorkItem、Iteration 是本仓需求主线。
- 边界稳定:identity、conversation、method-library、process、governance、artifact、runtime、workspace 只通过引用、快照、事件或运行期协作参与。
- 依赖裁剪稳定:唯一编译期依赖是 `L0-core`;`L0-bus` 为事件协作主干;其他相邻仓不得写成 package dependency。
- 验收底线稳定:核心能力闭环断裂、正式工作事实污染、相邻仓边界打穿、关键变化不可追溯和依赖裁剪失效是一票否决。

### 3.3 哪些需求结论仍然待确认？

当前仍待确认但不阻塞架构主线的需求事项:

| 待确认事项 | 对架构影响 | 当前处理口径 |
|---|---|---|
| 具体 API / command / event / DTO 名称和字段 | 影响后续概要 / 详细设计接口契约 | 架构只固定能力面、方向和一致性语义 |
| WorkItem / Project / Iteration 的完整状态机 | 影响详细设计状态矩阵和测试方案 | 架构只确认状态机必须保护边界,不在 Step 1 定 variant |
| 完成依据、evidence 类型和 artifact / governance 前置关系 | 影响数据所有权、关键交互和后续验收证据 | 架构先确认 Work 只保存引用 / 摘要,不拥有 artifact 或 governance 正文 |
| 旧性能指标是否升级为正式目标 | 影响技术选型、容量规划和测试方案 | 架构保留可扩展和可观测约束,不在 Step 1 定硬数字 |
| 高级看板、容量趋势、自动维护建议、跨项目依赖进入哪个版本 | 影响子域边界和演进路线 | 架构先作为外围增强或演进能力处理,不进入核心真相闭环 |
| 存储实现、索引形态和物化视图策略 | 影响容器、数据一致性和技术选型 | 后续 Step 6 / 8 / 10 讨论,不在本步提前决定 |

### 3.4 哪些需求会直接影响架构边界？

- “项目工作事实真相仓”决定本仓必须独立于 process、runtime、workspace、conversation 和 artifact,不能被它们吸收。
- “ProjectMember 是项目内承担事实”决定 Work 只能引用 GlobalMember / ActorRef,不能拥有身份生命周期。
- “Backlog 只保存正式协作级工作”决定 conversation suggestion、runtime plan item 和个人 checklist 不能直接写入 Backlog。
- “Iteration 是承诺子集”决定 process planning timing 或 workspace view 不能反向决定 Iteration 真相。
- “ImplementationPlan promote 边界”决定 Work 需要 formalize / promote 输入面,但不拥有 ImplementationPlan 正文或执行推进。

### 3.5 哪些需求会直接影响数据所有权？

- Project、ProjectMember、Backlog 正式工作全集、WorkItem、child WorkItem、工作依赖 / 阻塞关系、Iteration 承诺子集、promote 结果与来源引用关系、工作事实审计 / 追溯记录属于 Work 真相数据。
- ProjectMember 可承担性快照、方法定义目录级快照、planning / review / timing 摘要、治理结论摘要、完成依据摘要、promote 来源摘要、conversation context 摘要、消费视图 / 看板 / 任务摘要属于快照数据。
- GlobalMemberRef / ActorRef、方法定义 Ref、process Ref、governance Ref、artifact / evidence / baseline Ref、ImplementationPlanRef / PlanItemRef、conversation / trace / handoff Ref、runtime / archive Ref 属于引用数据。
- identity、conversation、method-library、process、governance、artifact / evidence / baseline / ImplementationPlan、runtime、workspace 的正文禁止进入 Work 真相。

### 3.6 哪些需求会直接影响依赖方向或一致性策略？

- `L0-core` 是唯一编译期共享契约来源。
- `L0-bus` 是事件协作主干,但不能替代本仓业务真相。
- `L1-identity` 是 ProjectMember 闭环强前置,但只能通过运行期 / 事件 / 引用边界协作。
- `L1-conversation`、`L3-method-library`、`L1-process`、`L1-governance`、`L1-artifact`、`L2-runtime` 是上下文输入或协作方,不得作为编译期依赖。
- `L0-sdk`、`L1-workspace`、`L4-archive` 是消费方或协作方,不得反向定义 Work 真相。
- 快照、索引、看板、对账和维护报告必须从 Work 真相派生,不得成为新的业务事实来源。

---

## 4. 当前文档问题诊断

| 旧架构内容 | 问题 | 本轮处理 |
|---|---|---|
| 旧 `01-架构设计.md` 直接以 Project / ProjectMember / Backlog / WorkItem / Iteration 的实现草案展开 | 缺少新版需求基线追溯,容易把历史对象细节直接升级为架构事实 | 改为先以项目工作事实边界、职责、上下文、依赖方向和数据所有权为架构主线 |
| 旧文档使用 `PostgreSQL`、P95、规模数字和 read model 作为早期架构输入 | 这些内容尚未由新版需求定为硬指标或技术选型 | 后移到容器、数据一致性、技术选型和测试阶段讨论 |
| 旧文档把 process / governance / artifact / conversation 的关系写成较早的外部依赖列表 | 缺少“不得编译期依赖”和“不得反写 Work 真相”的新版裁剪口径 | 按新版 `00` 和全局依赖裁剪规则重建依赖方向 |
| 旧文档缺少正式 `design-calibration` 来源入口 | 后续概要 / 详细设计无法确认架构结论来自哪一步 | 本轮每个正式架构章节必须引用具体中间产物 |

---

## 5. 结构化中间产物

### 5.1 架构需求基线清单

| 基线编号 | 需求结论 | 影响的架构问题 |
|---|---|---|
| ARB-WORK-001 | `L1-work` 是项目工作事实真相仓 | 系统边界、职责边界、容器划分 |
| ARB-WORK-002 | 核心能力闭环必须完整成立 | 子域划分、关键交互、验收追溯 |
| ARB-WORK-003 | Project、ProjectMember、Backlog、WorkItem、child WorkItem、Iteration 和追溯记录由本仓拥有 | 数据所有权、一致性策略 |
| ARB-WORK-004 | 相邻仓正文禁止保存 | 数据模型边界、依赖方向、安全约束 |
| ARB-WORK-005 | conversation suggestion、runtime plan item 和 ImplementationPlan step 不能直接污染 Backlog | formalize / promote 边界、关键交互 |
| ARB-WORK-006 | Iteration 是正式工作全集中的承诺子集 | 子域划分、数据所有权、状态一致性 |
| ARB-WORK-007 | 查询、看板、投影和对账不得改变真相 | 支撑子域、异步派生、一致性策略 |

### 5.2 架构硬约束清单

| 约束编号 | 硬约束 | 架构含义 |
|---|---|---|
| AHC-WORK-001 | Work 不能被 process / runtime / workspace / conversation / artifact 吸收 | 必须保留独立服务 / crate / domain 边界 |
| AHC-WORK-002 | Work 不拥有 GlobalMember、conversation、method definition、process state、governance decision、artifact body、runtime execution 或 workspace aggregation | 必须通过引用、快照、事件或运行期边界协作 |
| AHC-WORK-003 | Backlog 只保存正式协作级工作 | 必须存在 formalize / promote 防护,阻止个人步骤和对话建议直接入仓 |
| AHC-WORK-004 | 关键变化必须显式发生并可追溯 | 架构必须保留 audit / trace / outbox / evidence 接缝 |
| AHC-WORK-005 | 除 `L0-core` 外不得形成编译期依赖 | 架构必须把相邻仓协作设计为运行期 / 事件 / 引用关系 |

### 5.3 未关闭需求风险清单

| 风险 | 当前架构处理 |
|---|---|
| API / event / DTO 未定 | 架构只固定能力面、方向和一致性语义 |
| 状态机 variant 未定 | 架构先固定状态机必须保护的边界和一票否决语义 |
| evidence / artifact / governance 前置关系未细化 | 架构先固定引用 / 摘要边界,后续在数据所有权和关键交互中展开 |
| 旧候选性能指标可能被误当成已确认硬指标 | 架构后续单独讨论技术选型和测试候选指标,本步不定数值 |
| 外围增强范围可能挤入核心闭环 | 架构后续在子域、演进路线和风险章节中隔离 |

---

## 6. 回填草稿

正式 `01-架构设计.md` 后续整理时,本步内容应分散回填到:

- §1 与上游文档的关系声明:引用新版 `00-需求文档.md` 和需求中间产物。
- §3 约束条件:回填架构硬约束清单。
- §16 需求追溯矩阵:回填 `ARB-WORK-*` 与后续架构章节的追溯关系。

---

## 7. 待确认事项

本步不新增阻塞架构主线的需求待确认事项。API / DTO、状态机、evidence、性能指标、外围增强版本和存储实现进入后续架构或详细设计 Step 继续收敛。

---

## 8. 进入下一步条件

- 已明确架构需求基线清单。
- 已明确架构硬约束清单。
- 已明确不阻塞架构主线的未关闭需求风险。
- 可以进入 Step 2“明确架构目标与约束”。
