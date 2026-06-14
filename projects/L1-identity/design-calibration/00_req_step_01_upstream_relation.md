# Step 1. 与上游文档的关系声明

> 对应 SOP: `standards/document/需求文档讨论流程_SOP.md` Step 1
> 回填章节: `00-需求文档.md` §1 与上游文档的关系声明
> 生成日期: 2026-06-10

---

## 1. Step 状态 + Step 内计划

- 状态: 已完成
- 本步目标: 明确 `L1-identity` 需求文档承接哪些上游结论,并把旧 identity 详细设计降级为历史输入。
- 复杂度判断: 本步为来源和权威层级校准,不需要拆附录;但必须把稳定上游、历史输入和禁止反向继承分开。

| 子步骤 | 产物 | 状态 |
|---|---|---|
| 读取产品叙事、六域模型、仓库拆分和依赖裁剪规则 | 输入来源表 | 已完成 |
| 回答 SOP 问题 | 问题回答表 | 已完成 |
| 诊断旧 `00` 与 `domain/identity/README.md` 的混层问题 | 旧文档问题诊断表 | 已完成 |
| 比较改动前后来源权威 | 改动前后对比表 | 已完成 |
| 记录采用 / 不采用的取舍 | 设计取舍表 | 已完成 |
| 输出结构化来源结论 | 上游来源结论、承接主题结论 | 已完成 |
| 形成正式 §1 回填草稿 | 回填草稿 | 已完成 |
| 列出待确认事项和下一步门禁 | 待确认事项、进入下一步条件 | 已完成 |

---

## 2. 本步输入

| 输入 | 当前状态 | 本步使用方式 |
|---|---|---|
| `product/最终目的.md` | 产品叙事权威 | 承接“员工是有身份的个体”的产品承诺 |
| `product/六域模型.md` | 六域模型权威 | 承接 Identity 域回答“员工是谁”的定位 |
| `architecture/仓库拆分方案.md` | 仓级分层权威 | 承接 `quantalithos-identity` 在 L1 的仓级职责 |
| `standards/document/全局项目依赖关系与裁剪规则.md` | 依赖裁剪权威 | 承接 `L1-identity` 只编译期依赖 `L0-core` 的裁剪原则 |
| `domain/identity/README.md` | 历史领域详细设计 | 作为旧术语、边界和不变量线索,不作为新版需求权威 |
| 旧 `projects/L1-identity/00~07` | 旧项目文档 | 作为问题诊断输入,不得反向约束新版 `00` |
| ADR-0003 / ADR-0004 / ADR-0006 | 历史决策线索 | 只保留边界线索;技术栈、实现细节和正文存储方式后移 |

---

## 3. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 本文承接哪些上游文档 | 直接承接产品叙事、六域模型、仓库拆分方案和全局依赖裁剪规则;参考 `domain/identity/README.md` 和历史 ADR,但不把它们作为新版需求权威。 |
| 承接的是上游哪一部分主题 | 承接“AI 员工是有身份的个体”、Identity 域回答“员工是谁”、`quantalithos-identity` 是 L1 领域服务仓,以及 identity 依赖裁剪纪律。 |
| 本文为什么不是重新定义该主题 | 产品承诺、领域定位和仓分层已由上游定义;本文只把这些结论转译成 identity 仓的需求边界、能力闭环和验收口径。 |
| 本文在当前仓承担什么细化作用 | 形成 `L1-identity` 的需求真相源,让后续 `01`~`07` 能围绕平台级 AI 员工身份真相继续推导。 |
| 哪些旧材料不能直接继承 | 旧技术栈、数据库 schema、RPC / event 名称、状态机实现、性能数字、RoleDefinition 正文归属、memory 正文存储倾向均不能直接继承。 |

---

## 4. 当前文档问题诊断

| 位置 / 来源 | 当前表现 | 问题 | 处理口径 |
|---|---|---|---|
| 旧 `00-需求文档.md` | 已有较完整章节,但校准链偏薄 | 正式正文比中间产物更完整,导致结论来源不足 | 先重建 `design-calibration/00`,再复核正式 `00` |
| `domain/identity/README.md` | 同时写聚合、状态机、event、DB、API 和不变量 | 层级接近详细设计,不能直接作为需求来源 | 只提取“员工是谁”、GlobalMember / ProjectMember 边界、ref-only 等线索 |
| 六域模型 Identity 章节 | 写 GlobalMember、Role、Capability、生命周期等具体模型 | 对需求有帮助,但模型细节可能早于当前 SOP | 需求层只承接领域定位和必要概念,字段后移 |
| 仓库拆分方案 | 写 `GlobalMember / Role / Capability` 和事件名 | 是仓级职责输入,但其中事件名不是新版 protocol 权威 | 需求层保留职责边界,不确认事件 schema |
| 旧 `01/02/03` | 已包含架构、概要和对象设计 | 可能反向约束需求 | 本轮明确旧下游文档只能作为诊断输入 |

---

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 来源权威 | 旧 `00` 和 `domain/identity/README.md` 承担主要事实来源 | 产品、六域、仓库拆分、依赖裁剪为稳定上游;旧文档降级 | 防止详细设计反向压需求 |
| 文档链 | 旧文档互相引用,缺少每步校准来源 | `00_req_step_*` 逐步生成,正式 `00` 每章标注来源 | 满足可追溯要求 |
| 角色 / 能力来源 | 可能直接继承 `Role` 聚合根和 capability 字段 | 需求层只确认身份侧角色能力摘要和来源引用 | 防止 method-library 正文被 identity 接管 |
| memory 口径 | 旧材料倾向把 semantic memory ref 挂在成员档案 | 新版只确认 ref-only,不确认正文、向量、索引和存储实现 | 防止 memory/archive 正文越界 |
| 技术栈 / 性能 | 旧 ADR 和 README 有技术栈、P95、容量等线索 | 不在 Step 1 继承,后移 `01/03/05/06/07` | 需求层不锁实现 |

---

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A: 直接把旧 `domain/identity/README.md` 压缩成新版需求 | 信息多,速度快 | 会把字段、状态机、RPC、事件和存储直接带入需求层 | 不采用 |
| 方案 B: 以产品 / 六域 / 仓库拆分 / 依赖裁剪为权威,旧文档只做历史输入 | 权威层级清楚,边界可追溯 | 需要重写校准链 | 采用 |
| 方案 C: 只局部修补当前正式 `00` | 改动少 | 中间产物仍偏薄,无法解释 governance 与 identity 差距 | 不采用 |

---

## 7. 结构化中间产物

### 7.1 上游文档来源结论

| 来源文档 | 承接内容 | 权威级别 |
|---|---|---|
| `product/最终目的.md` | AI 员工有唯一 ID、名字、职业能力、记忆、生涯、生命周期和可被查看的持久身份叙事 | 产品叙事权威 |
| `product/六域模型.md` | Identity 域回答“员工是谁”,GlobalMember 跨项目存在,ProjectMember 不归 identity | 领域模型权威 |
| `architecture/仓库拆分方案.md` | `quantalithos-identity` 位于 L1,负责员工档案、生命周期、Role/Capability 管理和 memory ref 句柄 | 仓级分层权威 |
| `standards/document/全局项目依赖关系与裁剪规则.md` | `L1-identity` 编译期只依赖 `L0-core`,按需消费 method/governance/work 能力边界,通过 bus 发布成员事件 | 依赖裁剪权威 |
| `domain/identity/README.md` | GlobalMember、Role、Capability、生命周期、career、semantic_memory_ref 等历史线索 | 历史详细设计输入 |
| 旧 `L1-identity` 文档 | 旧需求、架构、概要和配置线索 | 诊断输入 |

### 7.2 承接主题结论

`L1-identity` 承接的主题是:把“AI 员工是有身份的个体”落到平台级身份真相仓。它回答“这个 AI 员工是谁、是否全局可用、有哪些身份侧角色能力摘要、有哪些生涯和记忆引用、哪些相邻仓可以如何消费身份事实”。

### 7.3 不重新定义结论

| 不重新定义对象 | 原因 |
|---|---|
| AI 员工产品概念 | 已由 `product/最终目的.md` 定义 |
| 六域模型和 Identity 域存在理由 | 已由 `product/六域模型.md` 定义 |
| 27 仓分层和 L1 位置 | 已由 `architecture/仓库拆分方案.md` 定义 |
| `L0-core` 共享契约 | 后续只依赖共享 ref、actor、trace、metadata 等基础契约 |
| `L1-work` 的 ProjectMember | identity 只提供 GlobalMember 身份锚点 |
| `L3-method-library` 的定义正文 | identity 只保存身份侧来源引用和摘要 |
| memory / archive 正文 | identity 只保存 ref 和身份侧关系 |

---

## 8. 回填草稿

```md
## 1. 与上游文档的关系声明

> 校准来源:
> - `design-calibration/00_req_step_01_upstream_relation.md`

本文承接 `product/最终目的.md` 中“AI 员工是有身份的个体”的产品承诺,承接 `product/六域模型.md` 中 Identity 域回答“员工是谁”的领域定位,承接 `architecture/仓库拆分方案.md` 中 `quantalithos-identity` 的 L1 仓级职责,并承接 `standards/document/全局项目依赖关系与裁剪规则.md` 中 identity 的依赖裁剪纪律。

本文不重新定义 AI 员工、六域模型、仓库分层或共享基础契约;它只把这些已成立结论整理为 `L1-identity` 的需求边界、核心能力、数据归属、接口依赖和验收口径。`domain/identity/README.md`、历史 ADR 和旧 `L1-identity` 文档只作为历史输入,其中的技术栈、字段、状态机、RPC、事件名、数据库表和性能数字不直接进入新版需求基线。
```

---

## 9. 待确认事项

| 编号 | 待确认事项 | 当前处理 |
|---|---|---|
| OQ-ID-S1-001 | ADR-0003 中技术栈是否仍有效 | 不在需求层确认,后移架构和实施计划 |
| OQ-ID-S1-002 | `domain/identity/README.md` 中 Role 聚合根是否仍由 identity 拥有 | 需求层只保留身份侧角色能力摘要,定义正文归属后续设计闭口 |
| OQ-ID-S1-003 | semantic memory ref 的正式承载方 | 需求层只确认 ref-only,承载方和迁移 surface 后移 |

---

## 10. 进入下一步条件

已明确本文来源、承接主题、历史输入降级规则和禁止反向继承范围。可以进入 Step 2,继续收束本仓定位与边界。
