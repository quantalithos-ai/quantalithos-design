# Step 13. 整理正式概要设计文档

## 1. Step 状态

- 状态：[x] 已确认
- 对应 SOP：`standards/document/概要设计讨论流程_SOP.md` Step 13
- 回填章节：`projects/L3-method-library/02-概要设计.md` 全文

---

## 2. 本步输入

| 输入 | 内容 |
|---|---|
| Step 1 | 与上游文档的关系声明 |
| Step 2 | 本次设计目标与范围 |
| Step 3 | 约束条件 |
| Step 4 | 代码主体框架总览 |
| Step 5 | 主要组成部分、职责与边界 |
| Step 6 | 关键对象轮廓 |
| Step 7 | API / 接口骨架 |
| Step 8 | 关键处理流 / 重要函数数据流 |
| Step 9 | 状态定义与状态流转 |
| Step 10 | 异常与边界场景轮廓 |
| Step 11 | 详细设计承接清单 |
| Step 12 | 设计风险与待确认事项 |
| 正式书写规范 | `standards/document/概要设计书写规范.md` |
| 当前正式文档 | `projects/L3-method-library/02-概要设计.md` |

已确认结论：

```text
正式 02 应按最新概要设计 13 章主链重组。
整理阶段只做重组、裁剪、润色、术语统一和交叉引用。
不得新增 Step 1~12 未讨论过的新对象、新接口、新流程、新状态或新风险。
```

依赖的前序 Step：

```text
Step 1~12 已确认并形成可回填中间产物。
```

---

## 3. SOP 问题回答

### 3.1 哪些已确认结论应分别回填到哪些正式章节？

回答：

| 正式章节 | 回填来源 | 回填内容 |
|---|---|---|
| §1 与上游文档的关系声明 | Step 1 | 承接 00 / 01 的内容、本文不再回答、本文必须回答 |
| §2 本次设计目标与范围 | Step 2 | 当前设计目标、当前范围、非范围、设计深度 |
| §3 约束条件 | Step 3 | Definition / Use、P0 / P1、published 不可原地修改、outbox、snapshot、fingerprint、ViewProfile 等硬约束 |
| §4 代码主体框架总览 | Step 4 | 代码主体框架图、实现分层视图、业务主要组成部分与实现分层关系 |
| §5 主要组成部分、职责与边界 | Step 5 | 7 个业务主要组成部分总表、交互总图、每个部分的职责 / 代码主体 / 不承担 / 接缝 |
| §6 关键对象轮廓 | Step 6 | 对象分布、MethodContent、7 类 subtype、lifecycle、fingerprint、audit、outbox、snapshot、projection、P1 对象轮廓 |
| §7 API / 接口骨架 | Step 7 | Command / Query / Inbound Event / Outbound Event / Operations Job 五类接口表 |
| §8 关键处理流 / 重要函数数据流 | Step 8 | 通用写路径、通用读路径、覆盖清单、关键 P0 处理流和 Operations 流 |
| §9 状态定义与状态流转 | Step 9 | MethodContentLifecycle、OutboxEventStatus、P1 状态边界、状态传播关系 |
| §10 异常与边界场景轮廓 | Step 10 | 异常场景表、异常影响图、概要层不展开内容 |
| §11 详细设计承接清单 | Step 11 | 承接清单表、回退规则 |
| §12 设计风险与待确认事项 | Step 12 | 设计风险表、待确认事项表 |
| §13 参考 | Step 13 | 实际使用的上游文档、规范、SOP 和中间产物 |

### 3.2 哪些结论需要拆分吸收到多个章节，而不是机械复制？

回答：

| 结论 | 拆分方式 |
|---|---|
| Definition / Use 分离 | §1 作为上游边界;§3 作为约束;§5 作为主要部分边界;§7 作为接口红线;§10 作为边界异常;§12 作为风险 |
| P0 / P1 分离 | §2 作为范围;§3 作为阶段约束;§4 / §5 / §6 / §7 / §9 保留 P1 位置;§12 保留 P1 污染风险和待确认 |
| outbox + snapshot + fingerprint | §3 作为一致性约束;§4 / §5 作为同步主体;§6 作为对象;§7 作为 event / query;§8 作为处理流;§9 / §10 作为状态和异常 |
| ViewProfile 服务端解析 | §3 作为约束;§5 归入查询解析与审计追溯;§6 展开 ViewProfile / projection;§7 / §8 展开 ResolveViewProfile;§12 保留复杂语义待确认 |
| TaskDefinition -> work 待确认 | §1 / §2 说明非 P0;§12 作为待确认;不得在 §7 / §8 写成 P0 接口或处理流 |
| Operations Job | §4 点名主体;§5 归入恢复运维;§7 写接口骨架;§8 写处理流;§10 写异常边界;§11 交付详细设计展开 |

### 3.3 哪些术语、编号或交叉引用需要统一？

回答：

| 类型 | 统一口径 |
|---|---|
| 仓定位 | 使用 `L3-method-library` / 方法定义资产中心 |
| P0 定义资产 | 使用 `MethodContent` 与 7 类 subtype: `Qualification`、`RoleDefinition`、`TaskDefinition`、`WorkProductDefinition`、`ProcessTemplateDef`、`ViewProfile`、`AIPolicyDef` |
| P1 对象 | 使用 `MethodPlugin`、`MethodConfiguration`、`PluginCompositionPolicy`、`effective_content_set` |
| 主要组成部分 | 使用 7 个业务主要组成部分,不再使用旧 A-H 作为正式业务部分编号 |
| 实现分层 | 使用 Inbound / Operations、Application Services、Domain Model / Policies、Ports、Persistence / Projection / Outbound Adapters |
| 同步对象 | 使用 `OutboxEvent`、`DefinitionSnapshot`、`snapshot_ref`、`schema_version` |
| 指纹 | 使用 `Fingerprint`、`canonical fingerprint`、`source_version / fingerprint` |
| 状态机 | 使用 `MethodContentLifecycle`、`OutboxEventStatus` |
| 风险 / 待确认 | 只在 §12 表达,不要在前文润色成定论 |
| 交叉引用 | 正文使用 `§N` 引用章节,接口 / 对象 / 状态用反引号标识 |

### 3.4 哪些内容仍应继续保留为设计风险或待确认，而不能润色成定论？

回答：

| 内容 | 正式文档处理方式 |
|---|---|
| `TaskDefinition` 是否直接供 `L1-work` 消费 | 只放 §12 待确认,前文只写 process 是 P0 消费方 |
| ViewProfile 默认 deny / 空视图产品语义 | 放 §12 待确认,前文只写受控返回和服务端解析 |
| ViewProfile 复杂优先级 / preset / override | 放 §12 待确认,前文只写 P0 简化匹配 |
| snapshot schema 是否由 L0-core 统一定义 | 放 §12 待确认,§7 / §8 只写 schema_version 边界 |
| P1 Plugin / Configuration 何时进入正式详细设计 | 放 §12 待确认,前文只保留位置和边界 |
| Plugin dependency DAG / Variability 算法 | 放 §12 待确认,不得在 §6 / §8 提前展开算法 |
| Operations Job 执行门禁和运维权限 | 放 §12 待确认,§7 / §8 只写 job 骨架和不绕过规则 |

### 3.5 哪些细节仍应留给详细设计，而不应在整理阶段被补进来？

回答：

| 细节 | 留给 |
|---|---|
| Rust struct / enum 字段全集与完整函数签名 | `03-详细设计.md` |
| HTTP / RPC / event / job 完整 schema | `03-详细设计.md` |
| ErrorCode、HTTP status、retry 参数、dead_letter 阈值 | `03-详细设计.md` |
| SQL DDL、索引、事务隔离、锁策略 | `03-详细设计.md` |
| 完整测试用例全集 | 测试方案 / `03-详细设计.md` |
| 开发任务、排期、负责人 | 实施计划 / WorkItem |
| 部署拓扑、监控阈值、运维脚本 | 运维设计 / 实施计划 |

### 3.6 当前概要设计实际依赖了哪些参考材料，每份材料用途是什么？

回答：

| 参考材料 | 用途 |
|---|---|
| `projects/L3-method-library/00-需求文档.md` | 提供目标、非目标、P0 / P1 范围、用户故事、功能需求和验收口径 |
| `projects/L3-method-library/01-架构设计.md` | 提供系统边界、上下游交互、数据所有权、一致性策略和架构取舍 |
| `projects/L3-method-library/02-概要设计.md` | 被校准对象,用于识别旧结构和新版规范差距 |
| `standards/document/概要设计书写规范.md` | 约束正式文档章节、图表、表格和输出格式 |
| `standards/document/概要设计讨论流程_SOP.md` | 约束 Step 1~13 的讨论顺序与问题集合 |
| `standards/document/设计文档讨论中间产物规范.md` | 约束中间产物固定十段结构 |
| `projects/L3-method-library/design-calibration/02_hld_step_01_upstream_boundary.md` ~ `02_hld_step_12_risks_open_questions.md` | 提供已确认的章节回填内容和设计取舍记录 |

---

## 4. 当前文档问题诊断

| 位置 | 当前问题 | 影响 |
|---|---|---|
| 当前正式 02 结构 | 仍是旧版大而全结构,不符合最新 13 章主链 | 无法直接作为最新规范样本文档 |
| 当前正式 02 §1~§5 | 背景、人话解释、目标、上下文和风险信息较多 | 需要裁剪为 §1~§3 的输入边界、目标范围和约束 |
| 当前正式 02 主要部分 | 仍使用旧 A-H 口径,把入口层和基础设施层当业务主要部分 | 与 Step 4 / Step 5 已确认的新方案冲突 |
| 当前正式 02 对象 / 接口 / 流程 | 内容存在但散落且粒度不统一 | 需要按 §6~§10 重新组织 |
| 当前正式 02 风险 | 风险与架构依赖、运维降级、P1 说明混合 | 需要按 §12 风险 / 待确认分表表达 |
| 当前正式 02 参考 | 参考来源和用途不够聚焦 | 需要按 §13 列实际使用材料 |

---

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 正式结构 | 旧版长文结构 | 最新 13 章主链 | 对齐书写规范 |
| 回填方式 | 保留旧文并局部修补 | 用 Step 1~12 已确认产物重组正式文档 | 防止旧 A-H 和新 7 部分并存 |
| 主要组成部分 | A-H 混合业务、入口和基础设施 | 7 个业务主要组成部分 + 实现分层单独表达 | 保持业务主线和代码落位清晰 |
| 对象与接口 | 分散在多处说明 | §6 对象、§7 接口、§8 流程、§9 状态、§10 异常分章 | 支撑 03 详细设计 |
| P1 表达 | 多处重叠说明 | 保留位置、边界、风险和待确认 | 不污染 P0 |
| 参考材料 | 分散或不完整 | §13 只列实际使用材料和用途 | 便于审查和追溯 |

---

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 在旧正式 02 上局部打补丁 | 改动小 | 旧结构和新结构会混在一起,难以满足最新规范 | 不采用 |
| 把 Step 1~12 全文机械复制进正式 02 | 信息完整 | 正式文档过长,保留过多讨论过程和诊断内容 | 不采用 |
| 按 13 章主链重组并裁剪 Step 1~12 的回填草稿 | 结构清楚,能承接详细设计 | 需要仔细统一术语和裁剪重复内容 | 采用 |

---

## 7. 结构化中间产物

### 7.1 正式章节回填映射表

| 正式章节 | 回填中间产物 | 正式化处理 |
|---|---|---|
| §1 与上游文档的关系声明 | Step 1 §8 | 保留上游关系映射、本文不再回答、本文必须回答;裁剪讨论性文字 |
| §2 本次设计目标与范围 | Step 2 §8 | 保留目标表、范围表、非范围表、设计深度表 |
| §3 约束条件 | Step 3 §8 | 保留结构性约束表和约束来源表;容量假设不进入主约束 |
| §4 代码主体框架总览 | Step 4 §8 | 保留两张 ASCII 图和关键说明;不写目录树 |
| §5 主要组成部分、职责与边界 | Step 5 §8 | 保留总表、交互总图和各部分展开模板;必要时裁剪解释 |
| §6 关键对象轮廓 | Step 6 §8 | 保留对象分布和关键对象卡片;裁剪过长解释但保留字段 / 类型 / 作用表 |
| §7 API / 接口骨架 | Step 7 §8 | 保留五类接口表和接口红线;不写完整 schema |
| §8 关键处理流 / 重要函数数据流 | Step 8 §8 | 保留覆盖清单、通用路径、关键 P0 流;不写全部详细调用链 |
| §9 状态定义与状态流转 | Step 9 §8 | 保留 MethodContent、Outbox、P1 状态概要和传播关系 |
| §10 异常与边界场景轮廓 | Step 10 §8 | 保留异常场景表和异常影响图 |
| §11 详细设计承接清单 | Step 11 §8 | 保留承接清单和回退规则 |
| §12 设计风险与待确认事项 | Step 12 §8 | 保留风险表和待确认事项表 |
| §13 参考 | Step 13 §3.6 | 保留实际参考材料和用途 |

### 7.2 正式文档裁剪规则

| 内容类型 | 正式文档处理 |
|---|---|
| Step 状态、SOP 问题回答、当前文档问题诊断、改动前后对比、设计取舍 | 不进入正式正文,只保留在中间产物 |
| 已确认结论、表格、ASCII 图、对象卡片、接口骨架、处理流、状态机 | 按正式章节回填 |
| 重复解释 | 保留第一次正式出现的位置,后文用交叉引用 |
| 未确认事项 | 只进入 §12,前文不得写成定论 |
| 详细设计内容 | 只在 §11 承接清单中点名继续展开方向 |
| 旧正式 02 中有价值但不符合新章节的背景文字 | 压缩吸收到 §1 / §2,不保留旧主章 |

### 7.3 术语统一表

| 旧 / 易混表达 | 统一表达 |
|---|---|
| 方法资产仓 / 方法库 / method library | `L3-method-library` / 方法定义资产中心 |
| Template | `ProcessTemplateDef` 或具体 Template family,避免泛称 |
| WorkProductDef | `WorkProductDefinition` |
| AIPolicy | `AIPolicyDef` |
| lifecycle | `MethodContentLifecycle` 或 `OutboxEventStatus`,按语义区分 |
| Event / event source | `OutboxEvent` / Outbound Event |
| snapshot | `DefinitionSnapshot` |
| A-H 主要部分 | 不作为正式业务主要部分编号 |
| 对外入口 / 基础设施适配 | 实现分层或支撑主体,不是业务主要组成部分 |
| Plugin / Configuration | P1 `MethodPlugin` / `MethodConfiguration` |

### 7.4 交叉引用规则

| 场景 | 写法 |
|---|---|
| 引用本文件章节 | 使用 `§N` 或 `§N.N` |
| 引用对象、接口、状态、事件 | 使用反引号,如 `MethodContent`、`PublishMethodContent`、`OutboxEventStatus` |
| 引用上游文档 | 使用相对路径,如 `00-需求文档.md`、`01-架构设计.md` |
| 引用待确认事项 | 统一指向 `§12.2 待确认事项` |
| 引用详细设计继续展开 | 统一指向 `§11 详细设计承接清单` |

### 7.5 参考材料表

| 参考材料 | 用途 |
|---|---|
| `00-需求文档.md` | 目标、非目标、P0 / P1 范围、接口需求、验收口径 |
| `01-架构设计.md` | 系统边界、上下游交互、数据所有权、一致性策略、架构取舍 |
| `02-概要设计.md` | 被校准对象 |
| `standards/document/概要设计书写规范.md` | 正式文档结果结构 |
| `standards/document/概要设计讨论流程_SOP.md` | Step 1~13 生成流程 |
| `standards/document/设计文档讨论中间产物规范.md` | 中间产物结构和确认门禁 |
| `design-calibration/02_hld_step_01_upstream_boundary.md` ~ `02_hld_step_12_risks_open_questions.md` | 已确认的回填材料和取舍记录 |

---

## 8. 回填草稿

以下内容不是正式 `02-概要设计.md` 全文,而是下一步正式回填的执行骨架。

````md
# 02-概要设计 · L3-method-library

> 本文遵循 `standards/document/概要设计书写规范.md`。
> 本文承接 `00-需求文档.md` 与 `01-架构设计.md`,不重新定义需求目标和架构取舍。

## 1. 与上游文档的关系声明

从 Step 1 回填。

## 2. 本次设计目标与范围

从 Step 2 回填。

## 3. 约束条件

从 Step 3 回填。

## 4. 代码主体框架总览

从 Step 4 回填。

## 5. 主要组成部分、职责与边界

从 Step 5 回填。

## 6. 关键对象轮廓

从 Step 6 回填。

## 7. API / 接口骨架

从 Step 7 回填。

## 8. 关键处理流 / 重要函数数据流

从 Step 8 回填。

## 9. 状态定义与状态流转

从 Step 9 回填。

## 10. 异常与边界场景轮廓

从 Step 10 回填。

## 11. 详细设计承接清单

从 Step 11 回填。

## 12. 设计风险与待确认事项

从 Step 12 回填。

## 13. 参考

从 Step 13 参考材料表回填。
````

---

## 9. 待确认事项

| 问题 | 当前建议 | 是否阻塞 Step 13 |
|---|---|---|
| 是否同意正式 02 用最新 13 章主链整体重组 | 建议同意 | 阻塞 |
| 是否同意旧正式 02 中“人话理解 / 背景 / 问题定义”等内容只压缩吸收,不保留为主章 | 建议同意 | 阻塞 |
| 是否同意回填时按本步裁剪规则处理,不机械复制 Step 1~12 全文 | 建议同意 | 阻塞 |
| 是否同意下一步开始直接改写正式 `projects/L3-method-library/02-概要设计.md` | 建议同意 | 阻塞 |

---

## 10. 进入下一步条件

完成 Step 13 正式回填前需要确认：

- [x] 是否同意本步的章节回填映射
- [x] 是否同意本步的正式文档裁剪规则
- [x] 是否同意本步的术语统一和交叉引用规则
- [x] 是否同意开始改写正式 `02-概要设计.md`
