# Step 5. 限界上下文与子域划分

> 对应 SOP: `standards/document/架构设计讨论流程_SOP.md` Step 5
> 回填章节: `01-架构设计.md` §6 限界上下文与子域划分
> 生成日期: 2026-06-07
> 状态: 已完成

---

## 1. 本步目标

说明 `L1-governance` 内部语义结构如何划分:哪些是核心子域,哪些是支撑子域,哪些只是本地索引 / 投影 / 引用,以及它们之间的上下文映射关系。

本步只讨论本仓内部语义结构,不写对象字段、数据库表、代码目录、函数接口、容器部署、技术选型、事件名或运行顺序。

---

## 2. 本步输入

| 输入 | 当前状态 | 本步使用方式 |
|---|---|---|
| `design-calibration/01_arch_step_03_responsibility_boundary.md` | Step 3 已完成 | 承接做 / 不做 / 易混淆职责和边界红线 |
| `design-calibration/01_arch_step_04_system_context.md` | Step 4 已完成 | 承接正式上下文对象、输入 / 输出面和降级口径 |
| `projects/L1-governance/00-需求文档.md` §7 / §9 / §10 / §11 / §14 | 已重建 | 承接 C-GOV-1~C-GOV-5、功能、规则、数据归属和验收否决项 |
| 旧 `projects/L1-governance/01-架构设计.md` §5 | 旧 Draft | 仅作为 Gate / Policy / Compliance / Corrective 旧线索和问题诊断来源 |

---

## 3. SOP 问题回答

### 3.1 本仓内部有哪些子域或本地上下文?

`L1-governance` 的内部语义结构围绕“治理决策与治理控制事实”展开,分为三层:

| 层级 | 上下文 |
|---|---|
| 核心子域 | `治理语境与裁决核心`;`治理策略与控制核心`;`合规结论与纠正核心` |
| 支撑子域 | `治理输入收束上下文`;`裁决责任与授权上下文`;`自动化治理边界上下文`;`治理事实消费与追溯上下文`;`派生维护与交接上下文` |
| 本地索引 / 投影 / 引用 | `身份与责任引用`;`定义来源引用`;`被治理对象语境引用`;`证据与正文来源引用`;`运行与能力反馈摘要`;`治理消费投影 / 报告 / 对账材料`;`observability / archive 交接引用` |

### 3.2 哪些是核心子域?

核心子域必须直接承载 C-GOV-1~C-GOV-4 的治理事实主线:

| 核心子域 | 判断 |
|---|---|
| `治理语境与裁决核心` | 承载治理语境、适用对象、Gate / Decision、正式裁决结论和关键节点放行 / 拒绝 / 变更请求语义。 |
| `治理策略与控制核心` | 承载 Policy effective fact、shared rules、scope / priority / conflict、自动化授权边界和 Control applicability / review 语义。 |
| `合规结论与纠正核心` | 承载 AIIA / SoA governance conclusion、Control 覆盖结论、Nonconformity 和 corrective loop 语义。 |

这三个核心子域是语义核心,不是代码模块或对象清单。`Gate`、`Policy`、`Control`、`AIIA`、`SoA`、`Nonconformity` 等对象线索后续可在概要 / 详细设计中展开,但架构 Step 5 只固定它们所属的核心语义边界。

### 3.3 哪些是支撑子域?

支撑子域围绕核心治理事实存在,但不是中心真相本体:

| 支撑子域 | 判断 |
|---|---|
| `治理输入收束上下文` | 支撑系统触发、周期复核、风险信号和相邻仓请求进入可裁决语境,但不直接生成正式结论。 |
| `裁决责任与授权上下文` | 支撑审批、投票、授权、替代裁决责任和责任语境,但依附于正式裁决核心。 |
| `自动化治理边界上下文` | 支撑 AI member、自动化执行者、默认超时、policy_auto 和高影响裁决边界判断。 |
| `治理事实消费与追溯上下文` | 支撑相邻仓、产品入口、审计者和归档方消费同一份 Governance truth。 |
| `派生维护与交接上下文` | 支撑 read model、报告、对账、归档准备和维护结果,但不得成为业务治理写源。 |

### 3.4 哪些只是外部上下文的本地索引 / 投影 / 引用?

以下结构只能作为本地影子层存在:

| 本地影子结构 | 边界 |
|---|---|
| `身份与责任引用` | 只保存 actor、member、role、责任语境或可承担性引用 / 摘要,不拥有身份生命周期或认证授权真相。 |
| `定义来源引用` | 只保存 AIPolicyDef、Control definition、method、template、standard safe summary 引用,不拥有定义正文。 |
| `被治理对象语境引用` | 只保存 process、work、conversation、runtime、capability 等被治理对象的 ref / summary,不拥有相邻仓 truth。 |
| `证据与正文来源引用` | 只保存 artifact、evidence、baseline、AIIA / SoA 文档正文和 archive package 的引用或摘要,不保存正文。 |
| `运行与能力反馈摘要` | 只保存 runtime feedback、policy cache feedback、tool / provider 使用线索摘要,不拥有执行正文或工具结果。 |
| `治理消费投影 / 报告 / 对账材料` | 只从 Governance truth 派生,服务查询、看板、报告和一致性解释,不得反写真相。 |
| `observability / archive 交接引用` | 只保存治理追溯、观测摘要和归档交接引用,不拥有物理日志、trace store 或归档正文。 |

### 3.5 它们之间的上下文映射关系是什么?

`治理语境与裁决核心` 是进入 Governance truth 的裁决入口;`治理策略与控制核心` 为裁决、自动化边界和控制适用提供生效事实;`合规结论与纠正核心` 在 Policy / Control 和证据引用基础上形成合规评审、适用性声明、不符合和纠正闭环。

支撑子域围绕核心子域工作:治理输入收束把外部线索变成可裁决语境,裁决责任与授权说明谁能决定,自动化治理边界说明哪些路径必须停止或升级,消费追溯和派生维护只能读取或派生核心 truth。本地影子层只提供引用、快照、投影和交接入口,不能反向定义核心治理事实。

### 3.6 为什么这些部分不能混成一个上下文?

这些部分不能混成一个上下文,因为它们的真相角色、变化生命周期和反写风险不同:

| 不能混合的部分 | 原因 |
|---|---|
| Governance Decision 与 process waiting state | waiting gate 是过程等待状态,Gate / Decision 是治理裁决事实。 |
| Policy effective fact 与 AIPolicyDef / runtime cache | 定义和 cache 可作为来源或消费结果,但不能替代生效事实和组织级硬约束。 |
| Control / AIIA / SoA 结论与标准 / artifact 正文 | Governance 拥有评审和适用性结论,不拥有正文或证据 body。 |
| Nonconformity 与 work blocker / bug / observability alert | 不符合纠正是治理闭环,不是普通工作阻塞、缺陷或告警。 |
| Approval responsibility 与 identity role lifecycle | 裁决责任事实依附治理语境,不拥有成员、角色或认证生命周期。 |
| read model / report / reconciliation 与 Governance truth | 派生消费和维护结果可滞后、重建或失败,不能成为正式治理写源。 |

---

## 4. 当前文档问题诊断

| 旧架构内容 | 问题 | 本轮处理 |
|---|---|---|
| `Gate Management` / `Policy Engine` / `Compliance Assets` / `Corrective Loop` | 偏对象 / 技术 / 功能清单,未区分核心子域、支撑子域和本地影子层 | 改为三类核心子域 + 支撑上下文 + 本地索引 / 投影 / 引用 |
| `Policy Engine` 被列为核心域 | 容易把 engine / DSL / cache 写成 Policy truth | 改为 `治理策略与控制核心`,只固定 effective fact、shared rules、scope 和 Control 语义 |
| `Compliance Assets` 名称含糊 | 容易把 artifact、evidence、AIIA / SoA 文档正文和标准原文写入 Governance | 改为 `合规结论与纠正核心`,正文来源进入本地引用层 |
| `Decision` / `Policy` / `Compliance` / `Improvement` 表只列核心对象 | 容易把对象清单误写成限界上下文 | 本步只写语义作用和内部关系,不写对象字段 |
| 旧上下文映射直接写 process / work / artifact / runtime | Step 5 不应重画外部系统上下文 | 外部对象只在本地影子边界结论中出现,不进入上下文关系图 |
| 旧架构缺少消费、追溯、维护和归档准备上下文 | 会让 report、dashboard、reconciliation 或 archive handoff 反写真相 | 增加 `治理事实消费与追溯上下文` 和 `派生维护与交接上下文` |

---

## 5. 改动前后对比

| 维度 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 核心子域 | Gate / Policy / Compliance / Improvement 直接按旧功能名划分 | 治理语境与裁决、治理策略与控制、合规结论与纠正三类核心语义 | 更贴近 C-GOV-1~C-GOV-4 和 truth 边界 |
| 支撑上下文 | 缺少或混在对象列表中 | 输入收束、责任授权、自动化边界、消费追溯、派生维护 | 表达围绕核心 truth 的正式支撑结构 |
| 本地影子层 | 未集中区分 ref、snapshot、projection | 单列身份、定义、对象语境、证据正文、运行反馈、消费投影和交接引用 | 防止外部 truth 或派生结果反写核心 |
| Policy 语义 | 容易写成规则引擎 / DSL | 固定为生效事实、shared rules、scope / priority / conflict 和控制适用 | 避免技术机制替代 truth |
| 合规语义 | 容易写成 assets / documents | 固定为治理结论和纠正闭环,正文只作引用 | 保护 artifact / method-library 边界 |

---

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A: 沿用 Gate / Policy / Compliance / Improvement 四上下文 | 接近旧文档 | 过于对象化,且 Policy Engine / Compliance Assets 容易滑向实现和正文归属 | 不采用 |
| 方案 B: 三个核心子域 + 支撑上下文 + 本地影子层 | 能表达治理事实主线,同时保护相邻仓和派生结构边界 | 表更长,后续概要需继续展开对象 | 采用 |
| 方案 C: 一个 `Governance Truth` 核心子域 | 最简洁 | 无法区分裁决、策略控制、合规纠正的不同生命周期和风险 | 不采用为主结构 |
| 方案 D: 把 Gate、Policy、Control、AIIA、SoA、Nonconformity 都作为核心子域 | 覆盖看似完整 | 退化为对象清单,不符合 Step 5 粒度 | 不采用 |

### 6.1 待确认问题的方案选择

#### Nonconformity 是否归入核心子域?

| 方案 | 内容 | 影响 |
|---|---|---|
| 方案 A | 作为支撑子域 | 会弱化 C-GOV-4 的纠正闭环主线 |
| 方案 B | 归入 `合规结论与纠正核心` | 保持不符合、原因、纠正、复验和关闭为 Governance truth |

推荐方案 B。

#### read model / report / reconciliation 是否作为核心子域?

| 方案 | 内容 | 影响 |
|---|---|---|
| 方案 A | 作为核心子域 | 会让派生消费面被误读为业务写源 |
| 方案 B | 作为支撑子域和本地投影层 | 既承接 FR-GOV-009 / 010,又防止维护反写真相 |

推荐方案 B。

#### Policy DSL / engine 是否成为子域名?

| 方案 | 内容 | 影响 |
|---|---|---|
| 方案 A | 使用 `Policy Engine` | 容易提前选技术机制并让 engine 替代 Policy truth |
| 方案 B | 使用 `治理策略与控制核心` | 固定生效事实和控制适用语义,保留技术选型空间 |

推荐方案 B。

---

## 7. 结构化中间产物

### 7.1 子域 / 上下文划分表

| 名称 | 类型 | 作用 | 与其他部分的关系 |
|---|---|---|---|
| 治理语境与裁决核心 | 核心子域 | 承载治理语境、适用对象和关键节点正式裁决语义。 | 是 Governance 写入主线入口,消费输入收束和责任授权上下文。 |
| 治理策略与控制核心 | 核心子域 | 承载 Policy 生效事实、shared rules 和 Control 适用 / 复核语义。 | 支撑裁决核心和自动化边界,不得由定义来源或 runtime cache 反向定义。 |
| 合规结论与纠正核心 | 核心子域 | 承载 AIIA / SoA 治理结论、Control 覆盖和 Nonconformity 纠正闭环语义。 | 消费策略控制核心和证据引用,不拥有 artifact / evidence / standard 正文。 |
| 治理输入收束上下文 | 支撑子域 | 承载外部触发、周期复核、风险信号和相邻仓请求进入可裁决语境的语义。 | 围绕裁决核心存在,不能绕过正式裁决直接形成结论。 |
| 裁决责任与授权上下文 | 支撑子域 | 承载审批、投票、授权、替代裁决责任和责任语境。 | 支撑裁决核心,只消费 identity 引用,不拥有成员或角色生命周期。 |
| 自动化治理边界上下文 | 支撑子域 | 承载 AI member、自动化执行、默认超时和高影响裁决边界语义。 | 依附策略控制核心和裁决核心,不拥有 runtime execution truth。 |
| 治理事实消费与追溯上下文 | 支撑子域 | 承载治理事实被查询、解释、追溯和相邻仓消费的语义。 | 消费所有核心子域,不替代 observability 物理日志。 |
| 派生维护与交接上下文 | 支撑子域 | 承载 read model、报告、对账、归档准备和维护结果语义。 | 只能从 Governance truth 派生,不得创建、批准、关闭或改写治理事实。 |
| 身份与责任引用 | 本地索引 / 投影 / 引用 | 为裁决责任和授权判断提供 actor / member / role 引用或摘要。 | 服务输入收束和责任授权上下文,不拥有 identity truth。 |
| 定义来源引用 | 本地索引 / 投影 / 引用 | 为 Policy、shared rules、Control 和方法语境提供定义来源引用。 | 服务策略控制核心,不拥有 AIPolicyDef、Control definition 或标准正文。 |
| 被治理对象语境引用 | 本地索引 / 投影 / 引用 | 为 process、work、conversation、runtime 和 capability 语境提供稳定回链。 | 服务输入收束、裁决和自动化边界,不拥有相邻仓 truth。 |
| 证据与正文来源引用 | 本地索引 / 投影 / 引用 | 为 AIIA / SoA、Control、Nonconformity 和裁决依据提供 evidence / artifact / baseline 引用。 | 服务合规结论与纠正核心,不保存正文 body。 |
| 运行与能力反馈摘要 | 本地索引 / 投影 / 引用 | 为自动化边界、Policy 消费和风险信号提供运行或能力反馈摘要。 | 只作输入线索或消费状态,不拥有 execution log、tool result 或 cache truth。 |
| 治理消费投影 / 报告 / 对账材料 | 本地索引 / 投影 / 引用 | 为查询、看板、报告、对账和维护解释提供可重建消费结构。 | 服务消费追溯和派生维护上下文,不得成为业务写源。 |
| observability / archive 交接引用 | 本地索引 / 投影 / 引用 | 为观测解释、审计复盘、归档和恢复交接保留引用入口。 | 服务消费追溯和交接上下文,不拥有物理日志或 archive package 正文。 |

### 7.2 上下文关系图

```text
+---------------------------+   +---------------------------+   +---------------------------+
| 治理语境与裁决核心          |   | 治理策略与控制核心          |   | 合规结论与纠正核心          |
+-------------+-------------+   +-------------+-------------+   +-------------+-------------+
              |                               |                               |
              +---------------+---------------+---------------+---------------+
                              |
                              v
+-----------------------------+-----------------------------+
|                         支撑子域层                         |
+-------------+-------------+-------------+-----------------+
| 治理输入收束 | 裁决责任授权 | 自动化治理边界 | 消费追溯 / 派生维护 |
+-------------+-------------+-------------+-----------------+
                              |
                              v
+-----------------------------------------------------------+
|                  本地索引 / 投影 / 引用层                  |
| 身份责任引用 | 定义来源引用 | 对象语境引用 | 证据正文来源引用     |
| 运行能力反馈 | 消费投影报告 | 对账材料     | 观测归档交接引用     |
+-----------------------------------------------------------+
```

该图只表达 `L1-governance` 内部语义结构,不表达外部仓、接口、事件、数据库、容器、代码模块或运行顺序。

图示说明:

- 三个核心子域共同构成 Governance truth 主线,但分别承载裁决、策略控制、合规纠正三类不同生命周期。
- 支撑子域围绕核心 truth 工作,不能独立生成第二份治理事实。
- 本地索引 / 投影 / 引用层只提供稳定引用、快照、派生消费和交接入口,不得反向定义核心子域。
- 派生维护、报告、对账和归档准备可以滞后或重建,但不能创建、批准、关闭或改写治理事实。

### 7.3 本地索引 / 投影 / 引用边界结论

| 本地结构 | 允许做什么 | 禁止做什么 |
|---|---|---|
| 身份与责任引用 | 保存裁决责任、授权判断和责任语境所需引用或摘要 | 不保存成员生命周期、认证凭据、role definition 或 identity 正文 |
| 定义来源引用 | 保存 Policy / Control / method / standard 的来源 ref、版本和 safe summary | 不保存 AIPolicyDef、Control definition、method 或标准正文 |
| 被治理对象语境引用 | 保存 process / work / conversation / runtime / capability 语境 ref 或摘要 | 不创建 ProcessInstance、WorkItem、conversation fact、runtime execution 或 capability truth |
| 证据与正文来源引用 | 保存 artifact、evidence、baseline、AIIA / SoA 正文和 archive package 的引用 | 不复制 artifact / evidence / baseline / AIIA / SoA / archive 正文 |
| 运行与能力反馈摘要 | 保存自动化边界判断所需的运行 / 能力反馈摘要 | 不保存 tool execution log、provider response、policy cache truth 或 plan item progress |
| 治理消费投影 / 报告 / 对账材料 | 支撑授权查询、看板、报告、对账、重建和一致性解释 | 不作为正式裁决、Policy、Control、AIIA / SoA 或 Nonconformity 写源 |
| observability / archive 交接引用 | 关联治理追溯事实、审计复盘和归档交接材料 | 不拥有 observability ledger、trace store、metric body 或 archive package body |

### 7.4 统一语言词汇结论

| 术语 | 定义 | 所属上下文 |
|---|---|---|
| 治理语境 | actor、scope、适用对象、治理目的和责任语境形成的可裁决入口。 | 治理语境与裁决核心 |
| Gate / Decision | 关键节点正式治理裁决结论,不等于 process waiting state 或 UI 显化。 | 治理语境与裁决核心 |
| Approval / responsibility | 支撑正式裁决的审批、投票、授权和责任语境。 | 裁决责任与授权上下文 |
| Policy effective fact | 已生效、可消费、带 scope / priority / conflict 语义的治理策略事实。 | 治理策略与控制核心 |
| shared rules | 组织级不可被低 scope 覆盖的治理硬约束。 | 治理策略与控制核心 |
| Control applicability | 控制项在具体治理语境下的适用、实施、复核或违反事实。 | 治理策略与控制核心 |
| AIIA / SoA governance conclusion | 影响评估和适用性声明的治理评审、适用 / 排除、覆盖和批准结论。 | 合规结论与纠正核心 |
| Nonconformity corrective loop | 不符合、原因、纠正、复验和关闭的正式治理闭环。 | 合规结论与纠正核心 |
| 自动化治理边界 | AI member、自动化执行者、默认超时和高影响裁决是否允许继续推进的治理边界。 | 自动化治理边界上下文 |
| Governance traceability | 治理事实变化、消费、报告、对账和交接材料的可解释追溯语义。 | 治理事实消费与追溯上下文 |
| 本地索引 / 投影 / 引用 | 为稳定消费、判断、追溯和降级保留的 ref、snapshot、projection 或 handoff 结构。 | 本地索引 / 投影 / 引用层 |

---

## 8. 回填草稿

正式 `01-架构设计.md` 后续整理时:

- §6 “限界上下文与子域划分”直接摘录并整理本文件 §7.1、§7.2、§7.3 和 §7.4。
- 不在本 Step 写对象字段、数据库表、代码目录、接口协议、容器部署或技术选型。
- 旧 `Gate Management / Policy Engine / Compliance Assets / Corrective Loop` 只作为历史线索,不作为正式子域名回填。

---

## 9. 待确认事项

### 9.1 待确认项处理建议

| 待确认项 | 备选方案 | 推荐方案 | 推荐理由 | 当前状态 |
|---|---|---|---|---|
| 是否按 Gate / Policy / Compliance / Improvement 旧四分法划分 | A. 沿用;B. 改为三个核心语义子域;C. 单一 Governance truth | B | 旧四分法对象 / 功能色彩过强,三核心能承接 C-GOV-1~C-GOV-4 并保护正文边界 | 已确认采用 B |
| Nonconformity 是否进入核心 | A. 支撑;B. 归入合规结论与纠正核心 | B | Nonconformity 是正式治理纠正闭环,不能退化为 report 或 work blocker | 已确认采用 B |
| Policy DSL / engine 是否作为子域 | A. 是;B. 否,只保留策略控制语义 | B | DSL / engine 是后续技术机制或外围增强,不是 Step 5 子域名 | 已确认采用 B |
| read model / report / reconciliation 是否作为核心 | A. 是;B. 支撑 + 本地投影层 | B | 派生消费和维护不得反写真相 | 已确认采用 B |

### 9.2 本 Step 未确认事项

本步不新增阻塞 Step 6 的待确认事项。具体容器承载、运行入口、数据所有权、依赖方向、通信方式、技术选型、对象 schema 和状态机留到后续 Step 独立收敛。

---

## 10. 进入下一步条件

- 已明确本仓内部语义结构层次。
- 已区分核心子域、支撑子域和本地索引 / 投影 / 引用。
- 已形成上下文关系图、本地影子边界结论和统一语言词汇结论。
- 未把对象清单、代码模块、数据库结构、接口协议、外部系统上下文或容器部署写成子域结构。

结论:可以进入 Step 6 `容器 / 部署架构`。
