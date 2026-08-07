# L2-tools 01 架构设计 Step 11: 备选方案与取舍

> 创建日期: 2026-08-04
> 状态: completed
> 当前模式: full-restart
> 对应 SOP: `standards/document/架构设计讨论流程_SOP.md` Step 11
> 正式文档回填位置: `01-架构设计.md` 第 12 章

---

## 1. 本步输入与目标

### 1.1 本步目标

把当前架构主线与仍能遵守正式 00 owner / 边界前提的相邻结构路径放在同一判断框架中,比较各自解决的问题、收益、代价与当前结论。已经被职责、硬约束、数据红线或非目标明确排除的方向不重新包装为候选;具体产品和实现差异也不进入本步。

### 1.2 输入与读取结论

| 输入 | 读取结论 | 本步约束 |
|---|---|---|
| Step 2 | 独立工具语义 owner、条件 seam、外部 truth 不复制、canonical semantics 和 local-truth-first 是不可退让前提。 | 违反这些前提的路径只能列为 non-candidate。 |
| Step 5~9 | 五核心语境、三逻辑运行角色、四类数据和三类通信方式已经收稳。 | 可比较不同内部结构 / 外部消费策略,但不能迁移相邻仓 owner。 |
| Step 10 | 十一项架构机制形成当前主线及其代价。 | 本步比较整条路径,不逐项重复机制采用理由。 |
| 旧 README / 正式 01 | Monorepo、registry、三态 executor、MCP Client、extras 和具体技术栈属于旧定位。 | 只作 historical conflict,不成为现行候选。 |
| 架构 SOP Step 11 / 书写规范 4.12 | 候选必须是路径级、结构性、未被前文明确排除的替代。 | 同时写收益与代价,不给当前方案单边赞美。 |

### 1.3 Step 内计划

- [x] 恢复 flow / ledger,确认只允许 Step 11。
- [x] 读取 SOP Step 11、书写规范 4.12 和 Step 2/10。
- [x] 明确当前主线的完整结构表达。
- [x] 按三项判定规则筛出相邻有效路径。
- [x] 把硬排除项和旧材料单列为 non-candidate / historical conflict。
- [x] 对每条有效路径同时写问题、收益、代价和结论。
- [x] 收束当前得到 / 牺牲,审计没有产品横评、愿望池或未来事项冒充候选。

---

## 2. SOP 问题回答

### 2.1 当前架构主线是什么

当前主线是“独立工具行动语义 truth center + 五个核心语境与正式支撑 / 影子分层 + 正式边界协作 + canonical invocation/result/error + 条件化 authorization/Sandbox seam + invocation-bound snapshot/ref + local outcome/audit first + 同步裁定 / 异步送达传播 / 后台派生分离”。它选择更多显式边界与状态解释成本,以换取 owner 稳定、跨 carrier 单一语义、历史可解释和外围失败不反写。

### 2.2 哪些相邻替代路径值得比较

1. 单一工具语义大上下文:仍由 L2 拥有全部工具语义,但不将 A1~A5 划成独立语境。
2. 五核心语境独立运行 / 部署:保留相同语义 owner,把 A1~A5 分成独立运行边界和状态承载。
3. Reference-only live resolution:不保留可复用的 controlled shadow,每次判断都通过正式 ref 实时解析外部 owner。

三条路径都不必复制外部 truth或迁移 owner,因此有资格比较。它们分别改变内部耦合、运行分布和外部消费策略。

### 2.3 为什么采用当前路径

当前路径在语义可分性和运行复杂度之间取中间位置:五个语境保留独立 owner / 失败边界,但由三类逻辑运行角色承载并允许同部署;外部事实通过 invocation-bound snapshot/ref 稳定解释,但必须验证来源、时点和 stale/gap;本地 truth 与外部交接分层,避免跨 owner 伪事务。它不是最少组件或最低初始成本的路径,但最符合当前需求对可解释性、边界和后续可落码性的组合要求。

### 2.4 被放弃路径有什么优点,为何仍不采用

- 单一大上下文减少概念边界和单元协作成本,但会把 identity、binding、admission、precondition、outcome 的独立不变量与失败语义重新耦合。
- 独立部署提高隔离、扩缩和自治能力,但当前没有负载 / 隔离证据支撑,还会提前引入分布式一致性和内部 runtime 边界。
- Reference-only live resolution 减少本地 shadow 的维护和 stale 状态,但把外部 owner 的可用性 / 延迟压入每次判断,并弱化消费时点的稳定历史解释。

### 2.5 当前选择牺牲什么、换来什么

牺牲的是初始结构简单性、外部状态“永远实时”的表面感、单元独立伸缩自由和少量状态类型;换来的是五节点 owner 清晰、外部输入隔离、当前调用依据可复现、核心与外围故障分离、逻辑角色可同部署且后续仍可按证据演进。

---

## 3. 候选资格与旧材料诊断

### 3.1 有效候选判定

| 路径 | 与当前主线结构性替代 | 路径级而非点级 | 未被硬约束排除 | 资格 |
|---|---|---|---|---|
| 当前分层主线 | 是 | 是 | 是 | candidate / selected |
| 单一工具语义大上下文 | 是 | 是 | 是,仍可保留外部 owner 和 canonical semantics | candidate |
| 五核心语境独立运行 / 部署 | 是 | 是 | 是,仍可保留语义 owner | candidate |
| Reference-only live resolution | 是 | 是 | 是,仍可只消费正式 ref 并 fail closed | candidate |

### 3.2 Non-candidate / historical conflict

| 方向 | 排除来源 | 为什么不进入正式比较 |
|---|---|---|
| Runtime/orchestrator 拥有工具合同 | Step 2/3 硬边界 | 会让 planning、loop、retry、recovery 反向定义工具 truth。 |
| Hub/provider registry 拥有 tool identity/definition | Step 2/3/5 identity 红线 | Capability/provider identity 不能替代独立工具主体。 |
| 本地 inventory/registry/allowlist 或 builtin/MCP executor 主导 | 正式 00 owner/no-bypass 约束 | 复制 Hub / authorization truth并以旧实现定义合同。 |
| Caller/carrier 分别拥有 invocation/result/error | `NFR-L2T-015` / canonical semantics | 会形成明确禁止的多套工具合同。 |
| Raw request/capture/provider body 入仓 | Forbidden-body 红线 | 不是可权衡的路径,而是直接越界。 |
| Capture/provider response 直接作为 result | Outcome owner 红线 | 会迁移 Sandbox/provider truth并形成多义终态。 |
| 全异步 invocation/admission 主线 | `FR-L2T-008/011~013` | 无法满足真实执行前同步受理 / authorization 消费 / 交接判断。 |
| 全同步等待 Hub/Auth/Sandbox/Bus/Observability 完成 | `NFR-L2T-003/005`、local-truth-first | 将外围可用性压回核心并制造跨 owner 伪一致。 |
| Search/SDK/marketplace/Observability 成为核心前置 | Step 2 非目标与外围隔离 | 属于已排除的外围升格,不是有效主线路径。 |
| 具体语言、数据库、消息产品、HTTP/RPC、幂等算法 | 书写规范 4.12 | 是产品 / 点级实现差异,不够格进入架构路径比较。 |

### 3.3 旧正式 01 差异

旧 `monorepo + registry + in-process/sandbox/mcp 三态执行` 不是当前主线的相邻候选,因为它同时改变 truth owner、仓职责、caller/carrier 语义和技术栈。旧“纯本地函数库”“每类工具独立服务”也是围绕 builtin/MCP 库存的实现拆分,而不是当前工具行动契约层的路径比较。它们只用于证明 full-restart 必要性,不进入正式方案表。

---

## 4. 结构化中间产物

### 4.1 方案路径比较表

| 方案路径 | 解决的问题 | 主要收益 | 主要代价 / 约束 | 当前结论 | 说明 |
|---|---|---|---|---|---|
| 独立 truth center + 五语境 / 三运行角色 / controlled shadows 分层主线 | 同时守住工具语义 owner、条件外部 seam、调用时点解释和外围故障隔离。 | 语义与失败边界清楚;逻辑可分但可同部署;snapshot/ref 支持历史解释;后续可按证据拆分。 | 边界、状态、来源验证、映射、gap、追溯和对账成本较高;开放 seam 下存在受控不可用。 | 采用 | 在单体耦合与分布式过度拆分之间取中间结构,承接全部正式 00 硬约束。 |
| 单一工具语义大上下文 | 在一个语义模型内承载 identity、binding、invocation、precondition 和 outcome。 | 概念入口更少,内部协调直接,初始建模和同部署路径更简单。 | 不变量、写权和失败语义容易耦合;capability/authorization/Sandbox 材料更易穿透;后续独立演进困难。 | 不采用 | 外部 owner 可保持不变,因此是有效路径;但当前五节点已证明有独立语义和失败边界。 |
| 五核心语境独立运行 / 部署 | 让 A1~A5 各自隔离运行、状态和扩缩边界。 | 故障隔离、独立伸缩、发布自治和团队边界最强。 | 引入内部 runtime 依赖、跨单元一致性与调用链故障;运维 / 追溯成本显著增加;当前无负载证据。 | 不采用 | 保留为未来有真实隔离 / 吞吐触发时的演进方向,但不作为当前部署承诺。 |
| Reference-only live resolution | 每次核心判断都实时解析外部 owner,不维护可复用 controlled shadow。 | 减少 snapshot 刷新、stale/rebuilding 状态和本地影子维护成本;外部状态表面更“新”。 | 外部可用性与延迟进入每次判断;历史消费依据难稳定复现;来源波动扩大 fail-closed 范围。 | 不采用 | 仍遵守外部 owner,所以是有效路径;当前更重视 invocation-bound 解释与受控退化。 |

### 4.2 当前取舍对照

| 当前得到 | 当前牺牲 |
|---|---|
| 单一工具语义 owner;五节点不变量与失败边界清晰;跨 caller/carrier 语义稳定;外部时点可解释;本地 truth 不受外围回滚;逻辑可分且可同部署。 | 更多显式边界和状态;ref/snapshot 有效性维护;mapping / gap / 对账成本;最终一致延迟;开放 seam 下的受控拒绝;后续 `02~07` 闭口责任。 |

### 4.3 方案边界说明

本章只比较仍能遵守现行 owner、forbidden-body、canonical semantics 和依赖红线的相邻结构路径。已经被正式 00 或 Step 2~3 排除的职责迁移、正文入仓、self-authorization 和 carrier 分叉不再开放为“可选方案”。具体产品、协议、存储和算法只是在选定路径上的实现载体,后续可以选择但不能反向改变本章结论。独立部署仅保留触发式演进位置,不表示当前已有拆分计划、容量证据或实施 readiness。

---

## 5. 回填草稿

正式 01 第 12 章使用 §4.1 方案路径比较表、§4.2 取舍对照和 §4.3 边界说明。Non-candidate 表作为校准审计来源,正式章只需简述旧 monorepo/registry/executor 与硬排除项不属于当前候选,避免给读者错误的“仍可选择”暗示。

---

## 6. 待确认事项

本步无新增 blocker。五核心语境是否在未来独立部署必须由真实负载、隔离、故障和运维证据触发,当前不属于待确认合同也不构成实施承诺。`L2T-UP-001~009` 仍是具体正向 contract / mapping / route / client / measurement 缺口,不能被任何方案措辞关闭。

---

## 7. 自检与门禁

| 检查项 | 结果 |
|---|---|
| 是否明确当前主线 | pass |
| 正式候选是否均为结构性路径级替代 | pass |
| 正式候选是否未违反现行硬约束 | pass |
| 每条路径是否同时写收益与代价 | pass |
| 是否把硬排除项单列为 non-candidate | pass |
| 是否避免产品横评、局部实现和愿望池 | pass |
| 是否保留开放 blocker 与未来触发事实纪律 | pass |

```text
current_step = Step 11 alternatives_tradeoffs completed
gate_status = pass
gate_reason = current mainline and three valid structural alternatives have explicit gains, costs and conclusions; hard exclusions remain non-candidates
next_allowed_action = create_and_complete_01_arch_step_12_cross_cutting_concerns
formal_document_write_allowed = false
commit_required = false
```
