## Step 1. 与上游文档的关系声明

### 1. Step 状态

- 状态：[x] 已确认
- 对应 SOP：`standards/document/需求文档讨论流程_SOP.md` Step 1
- 回填章节：`projects/L0-core/00-需求文档.md` §1 与上游文档的关系声明

### 2. 本步输入

- 上游文档：
  - `product/最终目的.md`
  - `product/六域模型.md`
  - `product/产品矩阵.md`
  - `architecture/仓库拆分方案.md`
  - `architecture/开发路线图与优先级.md`
  - `architecture/标准对齐全景图.md`
  - `architecture/proto-draft/README.md`
  - `architecture/bus-draft/event-catalog.md`
  - `standards/子项目遵循规范清单.md`
- 已确认结论：
  - `L0-core` 是所有仓共享契约的来源之一。
  - 需求文档 Step 1 只声明上游来源和承接主题,不展开本仓边界、功能、数据或接口。
  - 本轮校准必须保留中间产物,不得直接改正式 `00-需求文档.md`。
- 依赖的前序 Step：无。

### 3. SOP 问题回答

1. 本文承接哪些上游文档？

   回答：本文承接 `product/六域模型.md` 的跨域事件通信规则,承接 `architecture/仓库拆分方案.md` 中 L0 共享契约层和 `quantalithos-core` 仓定义,承接 `architecture/开发路线图与优先级.md` 中 N0 契约地基节点,承接 `architecture/标准对齐全景图.md` 对 core 的标准对齐要求,并承接 `architecture/proto-draft/README.md` 与 `architecture/bus-draft/event-catalog.md` 的设计态契约草案。

2. 承接的是上游哪一部分主题？

   回答：承接主题是“跨仓共享契约来源”。具体包括六域之间的事件通信规则、L0-core 的仓级定位、N0 契约地基交付范围、CloudEvents / W3C Trace Context / proto 草案 / 事件目录等契约来源。

3. 本文为什么不是重新定义该主题？

   回答：六域通信规则、L0 分层、路线图节点、标准对齐和 proto / event catalog 草案已经在上游文档中成立。`L0-core` 的需求文档只把这些上游结论收敛成当前仓的需求入口,不重新定义六域模型、L0 分层、事件命名规范或标准选型。

4. 本文在当前仓里承担什么细化作用？

   回答：本文在当前仓里承担仓级需求细化作用,把上游已经成立的跨仓契约主题转为 `L0-core` 的需求基线,为后续架构、概要、详细、测试和验收文档提供输入。

### 4. 当前文档问题诊断

| 位置 | 当前问题 | 影响 |
|---|---|---|
| 文档头部 `前置文档` | 只列 `product/最终目的.md`、`product/六域模型.md`、`product/产品矩阵.md`、`architecture/标准对齐全景图.md` | 漏掉 `architecture/仓库拆分方案.md`、`architecture/开发路线图与优先级.md`、`architecture/proto-draft/README.md`、`architecture/bus-draft/event-catalog.md` 等直接定义 L0-core 来源的文档 |
| §1 标题 | 写成“与 `product/` 的关系声明” | 过窄,无法覆盖架构拆分、路线图、proto 草案、事件目录和子项目强制规范 |
| §1 来源表 | 使用“章节 / 本文内容的来源 / product 对应章节”结构 | 不符合当前需求书写规范的固定结构,也把文档内部章节和上游来源混在一起 |
| §1 来源表内容 | 按“背景与问题 / 目标 / 用户与角色 / 功能需求 / 非功能需求”组织 | Step 1 应只声明来源和承接主题,不应预告后续章节内容 |
| §1 `定位原则` | 写入“不承载业务语义、只定义契约形状、消费者是谁、成功标准是什么” | 已经滑入本仓边界、使用方、成功标准,应移到后续 Step |

### 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 章节名称 | 与 `product/` 的关系声明 | 与上游文档的关系声明 | L0-core 需求来源不只来自 product,还来自架构拆分、路线图、proto 草案、事件目录和标准对齐 |
| 来源表结构 | `章节 / 本文内容的来源 / product 对应章节` | `来源文档 / 上游章节或模块 / 承接内容` | 对齐需求书写规范 4.1 固定结构 |
| 来源粒度 | 按正式需求文档内部章节组织 | 按上游语义单元逐行组织 | 避免 Step 1 变成全文结构预告 |
| 收束说明 | 用定位原则列出边界和成功标准 | 用 1 段 2~3 句说明本文只做仓级需求细化 | 避免提前进入 Step 2 以后内容 |
| 直接来源 | product 文档为主 | product + architecture + proto/event 草案 + 子项目规范 | 更符合 L0-core “架构反推型 / 共享契约型”仓的来源事实 |

### 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A：只保留 product 来源 | 简短,延续旧文档 | L0-core 是架构反推型仓,只写 product 会漏掉直接来源 | 不采用 |
| 方案 B：列出所有上游文档并逐行承接语义单元 | 来源完整,符合需求规范 4.1,便于后续追溯 | 表格比旧版略长 | 采用 |
| 方案 C：在 Step 1 同时写本仓边界和职责 | 读者能快速理解 L0-core 做什么 | 违反 4.1 粒度要求,会污染 Step 2~Step 4 | 不采用 |

### 7. 结构化中间产物

#### 7.1 上游来源映射

| 来源文档 | 上游章节 / 模块 | 承接内容 |
|---|---|---|
| `product/六域模型.md` | `§二 六域总览与交互规则 / 2.2 域间通信规则` | 跨域事件通信、CloudEvents、事件命名、幂等、Trace Context 等规则来源 |
| `product/产品矩阵.md` | `§6.2 SDK — 开发者接入层` | core proto 作为 SDK 类型生成来源的产品侧约束 |
| `product/产品矩阵.md` | `§9 发布节奏与版本同步` | core proto 改动影响 Server / SDK / 端侧产品同步的版本节奏约束 |
| `architecture/仓库拆分方案.md` | `§三 L0 · 共享契约层 / 3.1 quantalithos-core` | `L0-core` 的仓级来源定位和共享契约主题 |
| `architecture/仓库拆分方案.md` | `§十 依赖方向矩阵` | L0-core 作为最底层稳定依赖的分层依据 |
| `architecture/开发路线图与优先级.md` | `§三 节点式路线图 / 节点 N0 · 契约地基` | N0 阶段对 core 第一版 proto 和六域事件类型的交付要求 |
| `architecture/标准对齐全景图.md` | `§L0 · 共享契约层 / quantalithos-core` | CloudEvents、W3C Trace Context、标准术语统一等标准对齐来源 |
| `architecture/proto-draft/README.md` | `proto-draft` | core 仓 proto、CloudEvents schema、Trace Context 和三语言 binding 的设计态草案来源 |
| `architecture/bus-draft/event-catalog.md` | `Event Catalog` | 跨域事件名称、发布方、订阅方、幂等、严重度、保留期的事件目录来源 |
| `standards/子项目遵循规范清单.md` | `§一 L0 共享契约层 / 1.1 quantalithos-core` | CR1~CR6 强制项来源 |

#### 7.2 收束说明结论

```text
本文讨论的主题是:上游跨仓契约结论在 `L0-core` 仓中的需求收束方式。
本文不重新定义六域模型、L0 分层、事件标准、路线图节点或 proto 草案,只把这些已经成立的上游结论整理为 `L0-core` 的仓级需求基线。
```

### 8. 回填草稿

```md
## 1. 与上游文档的关系声明

| 来源文档 | 上游章节 / 模块 | 承接内容 |
|---|---|---|
| `product/六域模型.md` | `§二 六域总览与交互规则 / 2.2 域间通信规则` | 跨域事件通信、CloudEvents、事件命名、幂等、Trace Context 等规则来源 |
| `product/产品矩阵.md` | `§6.2 SDK — 开发者接入层` | core proto 作为 SDK 类型生成来源的产品侧约束 |
| `product/产品矩阵.md` | `§9 发布节奏与版本同步` | core proto 改动影响 Server / SDK / 端侧产品同步的版本节奏约束 |
| `architecture/仓库拆分方案.md` | `§三 L0 · 共享契约层 / 3.1 quantalithos-core` | `L0-core` 的仓级来源定位和共享契约主题 |
| `architecture/仓库拆分方案.md` | `§十 依赖方向矩阵` | L0-core 作为最底层稳定依赖的分层依据 |
| `architecture/开发路线图与优先级.md` | `§三 节点式路线图 / 节点 N0 · 契约地基` | N0 阶段对 core 第一版 proto 和六域事件类型的交付要求 |
| `architecture/标准对齐全景图.md` | `§L0 · 共享契约层 / quantalithos-core` | CloudEvents、W3C Trace Context、标准术语统一等标准对齐来源 |
| `architecture/proto-draft/README.md` | `proto-draft` | core 仓 proto、CloudEvents schema、Trace Context 和三语言 binding 的设计态草案来源 |
| `architecture/bus-draft/event-catalog.md` | `Event Catalog` | 跨域事件名称、发布方、订阅方、幂等、严重度、保留期的事件目录来源 |
| `standards/子项目遵循规范清单.md` | `§一 L0 共享契约层 / 1.1 quantalithos-core` | CR1~CR6 强制项来源 |

本文讨论的主题是:上游跨仓契约结论在 `L0-core` 仓中的需求收束方式。本文不重新定义六域模型、L0 分层、事件标准、路线图节点或 proto 草案,只把这些已经成立的上游结论整理为 `L0-core` 的仓级需求基线。
```

### 9. 待确认事项

- `product/最终目的.md` 是否需要进入 Step 1 来源表:当前判断为不进入主表,因为它是产品总目标背景,不直接定义 `L0-core` 的仓级需求来源;如后续需要,可在 Step 3 背景中引用。
- `product/产品矩阵.md` 中 SDK 章节是否应保留两行:当前判断保留,因为 core proto 是 SDK 类型生成来源,且版本同步会影响 core 的需求约束。

### 10. 进入下一步条件

- 用户确认 Step 1 的来源映射表可以作为正式 §1 的回填基础。
- 用户确认 Step 1 不再保留旧版“定位原则”,相关内容后移到 Step 2~Step 4。
- 确认后将 `00_requirements_calibration_flow.md` 中 Step 1 状态从 `[~]` 改为 `[x]`,并进入 Step 2 本仓定位与边界。
