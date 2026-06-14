# Step 11. 数据需求与数据归属

> 对应 SOP: `standards/document/需求文档讨论流程_SOP.md` Step 11
> 回填章节: `00-需求文档.md` §11 数据需求与数据归属
> 生成日期: 2026-06-10

---

## 1. Step 状态 + Step 内计划

- 状态: 已完成
- 本步目标: 按真相、快照、引用、禁止正文四类收束 identity 的数据归属,防止相邻仓 truth 或外部正文进入 identity。
- 复杂度判断: 数据项数量较多但可按五个能力节点组织;字段级 schema、表结构、索引和存储策略不在本步展开。

| 子步骤 | 产物 | 状态 |
|---|---|---|
| 读取 Step 2 / Step 9 / Step 10 | 输入表 | 已完成 |
| 回答数据归属问题 | SOP 问题回答表 | 已完成 |
| 诊断旧字段清单化问题 | 当前文档问题诊断表 | 已完成 |
| 比较数据归属前后分类 | 改动前后对比表 | 已完成 |
| 记录数据归属取舍 | 设计取舍表 | 已完成 |
| 输出数据归属表、禁止正文表和跨能力数据审计 | 结构化中间产物 | 已完成 |
| 形成正式 §11 回填草稿 | 回填草稿 | 已完成 |
| 列出待确认事项和下一步门禁 | 待确认事项、进入下一步条件 | 已完成 |

---

## 2. 本步输入

| 输入 | 使用方式 |
|---|---|
| Step 2 本仓边界 | 提供 identity truth ownership 基线 |
| Step 9 功能需求 | 提供数据项来源 |
| Step 10 业务规则 | 提供不变量、禁止行为和边界约束 |
| Step 6 依赖裁剪 | 确认引用数据的相邻仓归属 |
| 旧字段 / 对象材料 | 作为候选数据项,但不继承字段级 schema |

---

## 3. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 哪些数据由本仓拥有真相 | 成员身份主语、全局生命周期、身份侧角色能力摘要、成员生涯记录、成员与 memory refs 的身份侧关系、identity 自身变化追溯摘要。 |
| 哪些只是快照 | 外部角色 / 能力定义摘要、消费状态摘要、投影摘要、对账状态、冷存引用状态。 |
| 哪些只是引用 | method definition refs、governance decision refs、work/project refs、memory/archive refs、audit/trace refs。 |
| 哪些内容绝不能保存正文 | RoleDefinition 正文、ProjectMember truth、work item body、memory body/vector、artifact body、conversation body、runtime logs、credential/token。 |
| 生命周期口径是什么 | identity truth 可随成员生命周期变化;history append-only;refs 可更新但必须保留追溯;projection 可重建。 |
| 是否写数据库表 / 字段 schema | 否。需求层只写数据归属和生命周期口径。 |

---

## 4. 当前文档问题诊断

| 旧表现 | 问题 | 新处理 |
|---|---|---|
| 把字段清单当数据需求 | 过早进入详细设计 | 按数据归属类型重写 |
| Role、Capability、memory、career 同层 | truth、snapshot、ref 和正文混层 | 四类数据归属分离 |
| semantic memory ref 容易扩展为 memory body | 正文和向量泄漏风险 | 明确禁止正文 |
| career 可能保存项目 truth | 打穿 work 边界 | identity 只保存身份侧记录和 work refs |
| 消费状态 / 投影 / 对账状态归属不清 | 可能被误认为 truth | 标记为可重建快照或报告数据 |

---

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 数据分类 | 字段 / 对象导向 | 真相、快照、引用、禁止正文 | 支撑边界和追溯 |
| Role / Capability | 可能保存完整定义 | 保存来源引用和身份侧摘要 | 定义正文归 method-library |
| Project / ProjectMember | 可能进入 career 详情 | 只保存 work refs 和身份侧生涯记录 | work 拥有项目事实 |
| memory | ref 与正文边界不清 | 只保存 memory refs 和状态 | 防止正文、向量、索引入仓 |
| 投影 / 对账 | 未明确归属 | 可重建快照 / 报告数据 | 防止派生数据反写真相 |

---

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A: 按未来对象字段列完整数据需求 | 详细 | 会提前锁定 schema,且容易复制外部正文 | 不采用 |
| 方案 B: 按数据归属类型和能力节点列数据项 | 边界清楚,可追溯 | 后续详细设计仍需扩展字段 | 采用 |
| 方案 C: 只列 identity truth,不列快照和引用 | 边界最小 | 无法支撑消费、对账和外部来源变化 | 不采用 |

---

## 7. 结构化中间产物

### 7.1 数据归属表

| 数据项 | 能力节点 | 数据类型 | 归属说明 | 生命周期口径 | 支撑功能 / 规则 |
|---|---|---|---|---|---|
| 成员身份主语 | C-ID-1 | 真相数据 | identity 拥有平台级 AI 员工身份主语 | 建立后稳定,墓碑化后仍不得复用 | FR-ID-001~003 / BR-ID-001 |
| 成员公开身份摘要 | C-ID-1 | 快照 / 投影数据 | identity 可提供读取摘要,但摘要不替代 truth | 可重建,按可见性裁剪 | FR-ID-002 |
| 全局生命周期状态 | C-ID-2 | 真相数据 | identity 拥有成员全局可用性状态 | 显式变化,高风险变化需依据 | FR-ID-004~005 / BR-ID-004~006 |
| 生命周期变化追溯 | C-ID-2 | 真相 / 追溯数据 | identity 拥有自身变化原因和来源摘要 | append-only 或可重放追溯 | FR-ID-005 / BR-ID-014 |
| 角色来源引用 | C-ID-3 | 引用数据 | 指向 method-library 的角色定义来源 | 可随来源版本变化更新,保留追溯 | FR-ID-006 / BR-ID-007 |
| 身份侧角色摘要 | C-ID-3 | 快照数据 | identity 保存用于成员身份解释的角色摘要 | 来源变化时更新、失效或待对账 | FR-ID-006, FR-ID-008 |
| 能力画像摘要 | C-ID-3 | 真相 / 快照混合数据 | identity 拥有成员身份侧能力声明,但定义来源和证据可外部引用 | 变化需来源 / 证据引用 | FR-ID-007 / BR-ID-008 |
| 能力证据引用 | C-ID-3 | 引用数据 | 指向治理、artifact、audit 或其他证据承载方 | 可追加和替换引用,不得保存证据正文 | FR-ID-007 / BR-ID-008 |
| 生涯记录 | C-ID-4 | 真相数据 | identity 拥有成员生涯时间线中的身份侧记录 | append-only,纠错通过追加记录 | FR-ID-009 / BR-ID-010 |
| 项目 / ProjectMember 引用 | C-ID-4 | 引用数据 | 指向 work 的项目和项目成员事实 | 不反向定义 work truth | FR-ID-009 / BR-ID-011 |
| memory refs | C-ID-4 | 引用数据 | identity 保存成员与外部记忆承载方的引用关系 | 可迁移、可冷存、变化可追溯 | FR-ID-010~011 / BR-ID-012 |
| 归档 / 冷存引用状态 | C-ID-4 | 快照 / 引用数据 | identity 只记录与成员相关的外部冷存引用状态 | 可由归档协作更新,不保存 package body | FR-ID-011 |
| 身份消费状态摘要 | C-ID-5 | 快照数据 | identity 可记录消费边界、版本或投影状态摘要 | 可重建、可对账 | FR-ID-012, FR-ID-014 |
| 身份变化追溯视图 | C-ID-5 | 投影数据 | identity 提供自身 truth 变化的只读追溯视图 | 可重建,不得反写 truth | FR-ID-013 |
| 对账发现 | C-ID-5 | 快照 / 报告数据 | identity 可记录自身投影、引用或消费边界的漂移发现 | 不得修改相邻仓 truth | FR-ID-014 / BR-ID-015 |

### 7.2 禁止保存正文表

| 禁止保存正文 | 原因 | 正确处理 |
|---|---|---|
| RoleDefinition / Method Content 正文 | 归 `L3-method-library` | 保存来源引用和身份侧摘要 |
| Project / ProjectMember / WorkItem truth | 归 `L1-work` | 保存 work refs 和生涯追加记录 |
| memory 原文、embedding、检索索引 | 归 memory / archive / external provider | 保存 memory refs |
| artifact / evidence body | 归 `L1-artifact` 或证据承载方 | 保存 evidence refs |
| conversation message body | 归 `L1-conversation` | 保存必要 trace / actor refs |
| runtime logs / execution context body | 归 `L2-runtime` / observability | 保存身份关联引用 |
| credential、token、session、raw secret | 归认证 / 安全入口 | identity 不保存 |

### 7.3 数据归属判定

| 类别 | 判断标准 | identity 中的处理方式 |
|---|---|---|
| 真相数据 | 如果没有 identity,平台无法回答成员身份本身的问题 | 由 identity 拥有生命周期、变化原因和追溯边界 |
| 快照 / 投影数据 | 可以从 truth 或外部来源重建,用于读取或消费便利 | 可保存可重建摘要,必须允许失效、重建或对账 |
| 引用数据 | 真相归相邻仓或外部承载方,identity 只需要稳定指向它 | 保存 ref、来源摘要、状态和可追溯原因 |
| 禁止正文 | 不是身份真相,且保存会破坏隐私、归属或边界 | 不进入 identity 存储、事件、报告或诊断正文 |

### 7.4 跨能力数据审计

| 检查项 | 结论 |
|---|---|
| 是否区分真相 / 快照 / 引用 / 禁止正文 | 通过 |
| 是否存在功能需要但无数据归属 | 未发现 |
| 是否有数据项无功能或规则来源 | 未发现 |
| 是否把相邻仓 truth 写入 identity | 未发现 |
| 是否提前写表结构或字段 schema | 未写 |

---

## 8. 回填草稿

```md
## 11. 数据需求与数据归属

> 校准来源:
> - `design-calibration/00_req_step_11_data_ownership.md`

`L1-identity` 的数据归属按真相、快照、引用和禁止正文四类判断。identity 拥有平台级成员身份主语、全局生命周期、身份侧角色能力摘要、生涯记录、成员与 memory refs 的身份侧关系和自身变化追溯;可保存可重建摘要、投影、引用状态和对账发现;只引用 method、work、governance、archive、artifact、conversation、runtime 和 observability 的外部事实;不得保存 RoleDefinition 正文、ProjectMember truth、memory body、artifact body、conversation body、runtime body、credential、token 或 secret。
```

---

## 9. 待确认事项

| 编号 | 待确认事项 | 当前处理 |
|---|---|---|
| OQ-ID-S11-001 | 能力画像摘要中哪些字段属于 identity truth | 需求层只确认能力声明和证据引用归属,字段后移详细设计 |
| OQ-ID-S11-002 | 消费状态摘要是否需要正式存储 | 需求层保留为维护 / 对账需求,实施边界后移 |
| OQ-ID-S11-003 | memory refs 的承载方和状态枚举 | 需求层只确认 ref-only,具体承载和状态后移 |

---

## 10. 进入下一步条件

数据归属已明确,每类数据均可回指功能或规则,且禁止正文边界已覆盖写路径、读路径、事件、报告和诊断。可以进入 Step 12,收束接口与依赖。
