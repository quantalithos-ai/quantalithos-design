# standards — 规范体系

> **目录定位**:Quantalithos A 方案的**规范承载区**。文档约定、编码约定、图形约定、流程约定、合规约定等"**任何跨产品/跨仓必须统一**"的东西都在这里。
>
> **与其他目录的分工**:
> - `methodology/` 是**学**(了解国际标准做参考)
> - `architecture/` 是**设计**(定义系统拆分 + 决策)
> - `product/` 是**叙事**(产品定位 + 领域建模)
> - **`standards/`(本目录)是**规则**(必须遵守的硬约定)
>
> 规范 ≠ 建议。凡放在本目录下的内容,都**具有强制性**。违反必须有 ADR 说明理由。

---

## 一、三条横切红线(本目录的最高约束)

所有设计、代码、文档、流程,都必须同时满足以下三条**横切红线**。违反任何一条,即使功能正确也必须打回。

### 红线 1:可审计性(Auditability)

**定义**:任何写操作都必须留痕,任何决策都能被独立审计者还原。

**硬要求**:
- 六域每次写操作必须发 CloudEvents 事件
- 审计事件进入 observability 的 **append-only + 哈希链**存储,不可篡改
- 每个 Gate 决策保留完整的六段式记录(trigger / decision_request / candidate_options / evidence_requirement / resolution / audit_trail)
- AIIA / SoA / ComplianceDeclaration 作为 Artifact 永久保留

**标准依据**:
- ISO 9001 §9 绩效评价 + 记录型 Documented Information
- ISO 42001 §9.1 监视测量 + §9.2 内部审计
- ISO 27001 审计要求

**违反举例**:
- ❌ 直接修改 Artifact 内容不留版本
- ❌ Gate 决策没记录"为什么"
- ❌ observability 事件允许删除或修改

### 红线 2:可追溯性(Traceability)

**定义**:任何产出都能反向追溯到"谁做的 / 基于什么讨论 / 对应什么需求 / 经过哪些批准"的完整链路。

**硬要求**:
- W3C Trace Context 贯穿所有跨域事件
- Artifact 的血缘图(derives-from / implements / verifies / validates)必须完整
- Artifact → Activity → WorkItem → Conversation Turn → Member 的引用链可查
- Decision → Evidence 的链路必须闭合

**标准依据**:
- ISO/IEC/IEEE 24748-2 §3.4 可追溯原则
- ISO/IEC/IEEE 12207 配置管理
- ISO/IEC/IEEE 15288 SoI 血缘

**违反举例**:
- ❌ 代码改动找不到对应的 WorkItem 或 Discussion
- ❌ Artifact 没有 authors 字段
- ❌ 事件不带 trace_id

### 红线 3:可裁剪性(Tailorability)

**定义**:任何过程、角色、工具、策略都可被项目级裁剪,不允许硬编码到代码。

**硬要求**:
- 过程通过 Template → Profile → Instance 三段式承载,不得在代码里硬编码阶段
- Role 定义在 method-library,不在 identity 仓代码里 hardcode role enum
- tool_scope + policy_overrides 支持项目级覆盖
- 所有 Gate.kind 可在 ProcessProfile 里裁剪

**标准依据**:
- ISO/IEC 29110 Profile Group 机制
- ISO/IEC/IEEE 24748-2 Tailoring(Reduction / Extension / Adaptation)
- OMG SPEM 2.0 Method Plugin

**违反举例**:
- ❌ 代码里硬编码"项目必须有 requirements Gate"
- ❌ Role 枚举写在代码里不能扩展
- ❌ 流程阶段在数据模型里是固定字段

---

## 二、规范分类

Quantalithos 的规范按 **9 类**组织:

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  [本体约束 · 横切红线]                                        │
│   §一 的三条横切红线 —— 所有规范的上位约束                    │
│                                                             │
│  [设计类] 决定怎么做设计                                      │
│   1. 设计文档编写(document/)                                │
│   2. 架构图 / 流程图绘制(diagram/)                          │
│   3. 工作流编排(工作流编排讨论.md)                          │
│                                                             │
│  [实现类] 决定怎么写代码                                      │
│   4. 编程语言约定(coding/)                                  │
│   5. 设计模式使用(设计模式使用规范.md)                      │
│                                                             │
│  [流程类] 决定怎么工作                                        │
│   6. Git 分支与提交(待补)                                   │
│   7. 发布与版本(待补,摘自产品矩阵 §九)                     │
│                                                             │
│  [合规类] 决定怎么证明符合                                    │
│   8. ADR 书写(架构决策记录)                                 │
│   9. 合规制品(AIIA / SoA / ComplianceDeclaration)          │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 三、当前目录结构

```
standards/
├── README.md(本文)
├── 产品遵循规范清单.md            ← 面向产品(10 产品侧)
├── 子项目遵循规范清单.md          ← 面向子项目(26 仓侧)
│
├── document/                       设计文档编写规范
│   ├── 设计文档编写通则.md
│   ├── 架构设计书写规范.md
│   ├── 概要设计书写规范.md
│   ├── 详细设计书写规范.md
│   ├── 实施计划书写规范.md
│   ├── 需求文档书写规范.md
│   ├── 软件架构设计与代码设计书写规范.md
│   ├── 软件架构设计与代码设计规范参考清单.md
│   └── project-doc-writing-guide.md
│
├── diagram/                        流程图 / 架构图绘制规范
│   ├── BPMN2.md
│   ├── ISO5807.md
│   └── 流程图模型与节点原语设计.md
│
├── coding/                         编程语言规范
│   ├── python.md
│   ├── rust.md
│   └── typescript.md
│
├── 工作流编排讨论.md
└── 设计模式使用规范.md
```

---

## 四、使用方式

### 4.1 针对"开发 / 设计某个产品"

读 `产品遵循规范清单.md` —— 列出每个产品(Chat / Console / Server / …)必须遵守的规范项。

### 4.2 针对"开发 / 维护某个仓库"

读 `子项目遵循规范清单.md` —— 列出每个仓(core / member / identity / …)必须遵守的规范项。

### 4.3 针对"写一份设计文档"

- 入口:`document/设计文档编写通则.md`(通则 + 模板)
- 类型化规范:按文档类型查 `document/<type>书写规范.md`
- 架构图配合:`diagram/BPMN2.md` 或 `diagram/ISO5807.md`

### 4.4 针对"审查一份 PR / 设计文档"

依次过以下清单:

1. **横切红线**(本文 §一)—— 任何违反都是 Blocker
2. **子项目遵循规范清单** 对应仓的条目
3. **document/** 下的具体规范(如果是文档)
4. **coding/** 下的语言规范(如果是代码)

---

## 五、修订纪律

- **§一 三条横切红线** 的修改 **必须经过 ADR 且上报到产品最终目的文档联动修订**
- **§二 九类规范的分类** 的修改 **必须经过 ADR**
- 具体规范文件(`document/` / `coding/` / `diagram/` 下)的内容修订走 PR 评审即可,不需要 ADR
- 规范文件的**新增**和**移除**要走 ADR

---

## 六、与其他文档的关系

```
product/最终目的.md        (叙事 + 产品原则)
       │
       ▼
product/六域模型.md        (领域建模)
       │
       ▼
architecture/标准对齐全景图.md  (ISO/Research 标准映射)
       │
       ▼
standards/README.md(本文)       (三红线 + 规范分类)
       │
       ├──────────────────┬──────────────────┐
       ▼                  ▼                  ▼
standards/               standards/       standards/
产品遵循规范清单.md       子项目遵循规范清单.md  <具体规范文件>
```

---

## 附录:三红线与 14 标准的关联速查

| 红线 | 主要标准依据 | 具体条款 |
|---|---|---|
| **可审计性** | 9001 / 42001 / 27001 / 三红线技术落地 | 9001 §7.5 + §9.2 / 42001 §9.1 + §A.5 / 27001 审计控制 |
| **可追溯性** | 24748-2 / 12207 / 15288 | 24748-2 §3.4 / 12207 配置管理 / 15288 SoI 血缘 |
| **可裁剪性** | 29110 / 24748-2 / SPEM | 29110 Profile Group / 24748-2 §5.2 Tailoring / SPEM Method Plugin |

---

> 本文是 Quantalithos A 方案段 1 的规范总纲。所有具体规范必须与本文 §一 三红线对齐;违反三红线的具体规范必须调整,不得保留。
