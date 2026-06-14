# Step 7. 依赖方向与层间约束

> 对应正式章节: `01-架构设计.md` §8
> 本步状态: 已完成
> 前序依赖: Step 6 已完成
> 当前结论: `L1-identity` 的依赖方向必须保护“平台级成员身份真相”不被外部来源、运行承载、投影、事件或下游消费反向定义。当前只允许 `L0-core` 作为编译期依赖候选;`L0-bus` 只能作为事件协作边界;method-library、work、governance、memory / archive、observability、runtime、SDK / 产品层等关系只能通过运行期、事件协作、handoff 或消费边界进入,不得成为业务仓源码依赖。

---

## 1. Step 状态 + Step 内计划

- 本步目标: 明确本仓内部架构责任层 / 依赖角色、允许依赖方向、禁止反向依赖、必要倒置边界和跨仓依赖裁剪。
- 复杂度判断: 本步必须按架构单元逐项给出依赖规则和停审记录;当前采用一个主控 Step 文件承载全部规则,不拆附录。
- 粒度约束: 本步只讨论架构依赖方向,不写 crate、module、handler、repository、API、DTO、topic、数据库、队列、部署或调用顺序。
- 图形约束: 依赖方向图使用架构责任层 / 依赖角色,不使用运行单元或子域对象作为图主语;跨仓依赖裁剪图使用全局依赖裁剪规则格式。
- 停审要求: 本步完成后停留审核;已按用户“继续”进入 Step 8。

| 计划项 | 产物 | 状态 |
|---|---|---|
| 读取 Step 3~6 与依赖裁剪规则 | 本步输入表 | 已完成 |
| 回答依赖方向问题 | SOP 问题回答表 | 已完成 |
| 诊断旧依赖方向与代码层 / 运行层混写问题 | 当前材料 / 旧文档问题诊断表 | 已完成 |
| 记录依赖方向取舍 | 设计取舍表 | 已完成 |
| 输出责任层、依赖方向图、层间约束和倒置边界 | 结构化中间产物 | 已完成 |
| 逐架构单元输出依赖规则和停审记录 | 结构化中间产物 | 已完成 |
| 输出跨仓依赖裁剪表、分类表、禁止依赖表和裁剪图 | 结构化中间产物 | 已完成 |
| 形成正式 §8 回填草稿 | 回填草稿 | 已完成 |
| 自检并决定是否进入 Step 8 | 进入下一步条件 | 已完成 |

---

## 2. 本步输入

| 输入 | 使用方式 |
|---|---|
| `01_arch_step_03_responsibility_boundary.md` | 提供做 / 不做、职责红线和不得反写相邻仓 truth 的规则 |
| `01_arch_step_04_system_context.md` | 提供正式外部上下文、输入 / 输出面和 consumer group |
| `01_arch_step_05_bounded_context_subdomains.md` | 提供内部架构单元,用于逐单元定义依赖规则 |
| `01_arch_step_06_container_deployment.md` | 提供运行承载角色,用于判断运行承载不能反向决定核心语义 |
| `00-需求文档.md` §6 | 提供使用方与依赖、依赖裁剪图和依赖裁剪原则 |
| `00-需求文档.md` §10 | 提供 `BR-ID-*` 业务规则与边界红线 |
| `00-需求文档.md` §12 | 提供能力级接口边界和依赖编号 |
| `standards/document/全局项目依赖关系与裁剪规则.md` | 提供编译期 / 运行期 / 事件协作分类和单仓裁剪图格式 |
| `架构设计讨论流程_SOP.md` Step 7 | 约束本步按架构单元定义依赖规则和停审记录 |
| `架构设计书写规范.md` §4.8 | 约束依赖方向图、层间约束表和跨仓依赖裁剪表 |

---

## 3. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 本仓内部层次如何划分? | 划分为核心语义角色、身份能力承接角色、外部来源接缝角色、消费 / 投影接缝角色、技术承载角色和基础契约角色。它们是架构依赖角色,不是代码目录或运行单元。 |
| 允许哪些依赖方向? | 外部接缝、消费接缝和技术承载只能依赖或接入身份能力承接角色;身份能力承接角色可以依赖核心语义角色和基础契约角色;核心语义角色只依赖身份本地不变量和 `L0-core` 基础契约语义。 |
| 禁止哪些反向依赖? | 核心语义不得依赖 method/work/governance/runtime/archive/observability/UI、事件 bus、数据库或投影;投影、事件、运行承载和下游消费不得反向定义 identity truth。 |
| 外部系统通过哪些正式边界接入? | method-library、work、governance、memory / archive、observability 和 runtime 只能通过 ref、snapshot、source marker、basis ref、event、handoff 或正式运行期 boundary 接入。 |
| 本仓在全局依赖基线中涉及哪些跨仓依赖边? | 编译期只涉及 `L0-core`;事件协作涉及 `L0-bus`;运行期 / 事件协作涉及 method-library、work、governance、memory / archive、observability 和 runtime / member-service;下游消费涉及 process、conversation、workspace、SDK / 产品层等。 |
| 哪些依赖边进入本仓架构主链,哪些被裁剪出去? | `L0-core`、`L0-bus`、method-library、work、governance、memory / archive 和主要 consumer boundary 进入主链;L5 UI、外部 DB / vector product、runtime implementation、method/work/governance implementation、artifact body 和 observability product implementation 被裁剪出源码依赖主链。 |
| 进入主链的跨仓依赖分别是什么类型? | `L0-core` 是编译期基础契约;`L0-bus` 是事件协作;method-library/work/governance/memory/archive/observability/runtime 是运行期、事件协作或 handoff;downstream consumer 是只读 / 订阅 / SDK 封装消费。 |
| 哪些依赖必须倒置? | 外部来源解析、治理依据读取、ProjectMember / work 来源读取、memory / archive handoff、事件发布 / 订阅、投影重建、对账报告和 visibility / privacy 判断都必须通过身份能力承接层的正式边界倒置。 |
| 哪些规则若不写清,后续实现最容易失控? | `L0-bus` 是否能作为 package dependency、method/work/governance 是否能成为源码依赖、投影是否能写 truth、维护任务是否能修复相邻仓、runtime 是否能决定生命周期,这些必须在本步写清。 |
| 每个架构单元允许依赖谁、禁止依赖谁、通过什么边界接入? | §7.4 已逐单元列出允许依赖、禁止依赖和倒置边界。 |
| 每个架构单元依赖规则完成后是否通过停审? | §7.9 已给出逐单元停审记录;当前整体等待用户审核。 |
| 所有依赖规则完成后是否存在 unresolved 冲突? | §7.10 审计未发现 unresolved 冲突;后续如果 `L0-bus` 实现形态需要 package 依赖,必须在 `03/07` 明确其是否为基础设施 adapter,不得扩大成业务仓源码依赖。 |

---

## 4. 当前材料 / 旧文档问题诊断

| 诊断项 | 旧处理风险 | 本步处理 |
|---|---|---|
| 把依赖方向图写成代码分层图 | `entry -> application -> domain -> contracts` 容易被理解为 crate / module 结构 | 本步使用核心语义、能力承接、外部接缝、消费接缝、技术承载和基础契约等架构依赖角色 |
| 把容器运行单元写成依赖层 | 同步入口、worker、job、store 被误写成层间依赖 | 本步只承接运行承载不能反向决定核心语义,不把运行单元作为图主语 |
| 把子域层级重画成依赖层级 | 核心子域 / 支撑子域 / 投影被误当依赖方向 | 本步按依赖角色表达保护关系,逐单元规则放入表中 |
| 把 `L0-bus` 写成业务编译期依赖 | 事件协作可能被实现成业务仓源码耦合 | 本步明确 `L0-bus` 只作为事件协作边界,是否存在基础设施 client 留到后续 adapter / 实施计划裁定 |
| 把 method / work / governance implementation 写成依赖 | 外部 truth 会被 identity 直接读取或改写 | 本步明确只能通过 ref、snapshot、basis、event 或 formal runtime boundary 接入 |
| 把 projection / report 依赖写成 truth 依赖 | 查询投影或对账任务可能反写核心 truth | 本步禁止消费 / 投影接缝反向定义 identity truth |
| 把 runtime 可用性写成身份生命周期依赖 | runtime 状态可能决定 GlobalMember lifecycle | 本步明确 runtime 只能消费生命周期或提供信号,不能决定 identity truth |
| 把外部正文承载当成 technical dependency | memory / archive / observability body store 可能被直接引用 | 本步只允许 refs、handoff marker、safe summary 和 report-only surface |

---

## 5. 改动前后对比

| 维度 | 旧处理风险 | 新处理 |
|---|---|---|
| 内部层次 | 使用代码层、运行单元或子域名表达依赖 | 使用架构责任层 / 依赖角色表达允许依赖方向 |
| 核心保护 | domain 只是不依赖 adapter 的泛化口号 | 明确平台级成员身份真相不得被来源、投影、事件、runtime 和下游反向定义 |
| 外部来源 | 相邻仓实现可能被直接依赖 | 外部来源必须通过 formal boundary,只进入 ref / snapshot / marker / basis |
| 事件协作 | `L0-bus` 被当成业务源码依赖 | `L0-bus` 是事件协作边界,不拥有 identity 业务语义 |
| 技术承载 | 存储、outbox、trace、audit 可影响业务规则 | 技术承载只保存和传播已接受事实,不得决定身份 truth |
| 下游消费 | consumer 可根据需要修改 identity | consumer 只能读取 / 订阅 / 展示身份事实,不得反写 |
| 实施承接 | 依赖规则停留在高层口号 | 逐架构单元给出允许依赖、禁止依赖和倒置边界 |

---

## 6. 设计取舍

| 方案 / 取舍点 | 采用与否 | 理由 |
|---|---|---|
| 按代码层表达依赖方向 | 不采用 | 架构 Step 7 不定义 crate / module / package;代码组织留给概要 / 详细 / 实施计划。 |
| 按运行承载表达依赖方向 | 不采用 | 容器 / 部署图关注“谁在跑”,依赖方向关注“谁可以影响谁”。 |
| 按核心语义、能力承接、接缝、技术承载、基础契约表达依赖 | 采用 | 能直接保护 identity truth,也能承接外部来源和技术能力的倒置边界。 |
| 允许 `L0-core` 作为唯一编译期依赖候选 | 采用 | `L0-core` 是全平台共享 ref / actor / trace / metadata 基础契约来源。 |
| 允许 `L0-bus` 作为业务编译期依赖 | 不采用 | 需求和全局规则定义它为事件协作主干,不定义 identity 业务 truth。 |
| 将 method / work / governance 作为 runtime / event source | 采用 | identity 需要来源和依据,但不能吸收对方 truth 或 implementation。 |
| 让下游消费方反向定义 identity 摘要字段 | 不采用 | 下游消费只能读 / 订阅,summary 字段由 identity truth、visibility 和 projection policy 形成。 |
| 把所有相关仓都列入主图 | 不采用 | 依赖方向主图需要保持可审查;细分关系在裁剪表和禁止依赖表中说明。 |

---

## 7. 结构化中间产物

### 7.1 架构责任层 / 依赖角色表

| 架构责任层 / 依赖角色 | 类型 | 责任 | 不能做什么 |
|---|---|---|---|
| 身份核心语义角色 | 核心语义角色 | 保护平台级成员身份真相、全局生命周期、身份侧摘要、生涯 / memory ref 关系和自身追溯的语义不变量。 | 不能依赖外部仓实现、运行承载、投影、事件、下游消费或技术产品。 |
| 身份能力承接角色 | 编排 / 承接角色 | 承接受控输入、外部来源、维护触发和消费请求,把它们收束为身份核心可接受的 ref、snapshot、basis、marker 或拒绝结果。 | 不能让外部来源直接越过本层写核心 truth,也不能把技术失败润色成业务事实。 |
| 外部来源接缝角色 | 外部接缝角色 | 接入 method-library、work、governance、memory / archive、observability、runtime 等外部来源或依据。 | 不能保存或解释外部正文为 identity truth,不能暴露外部 implementation 给核心语义。 |
| 消费 / 投影接缝角色 | 外部接缝角色 | 向 work、process、conversation、governance、workspace、runtime、SDK / 产品层等提供身份事实消费、投影、追溯和对账结果。 | 不能让消费方反写 identity truth,不能让 projection / report 成为核心事实来源。 |
| 技术承载角色 | 技术承载角色 | 承载 identity 正式存储、trace / audit / outbox、projection、event / handoff 和运行诊断所需的技术支撑。 | 不能定义身份语义、生命周期规则、外部来源 truth 或 visibility 规则。 |
| 基础契约角色 | 外部基础契约角色 | 提供 `L0-core` 共享 refs、actor、trace、metadata、error 等基础契约语义。 | 不能包含 L1/L2/L3 业务 truth,不能让基础契约反向拥有 identity state。 |

### 7.2 依赖方向图

```text
+------------------------------------------------------------------+
|                     L1-identity dependency boundary             |
|                                                                  |
|  +----------------------+       +-----------------------------+  |
|  | 外部来源接缝角色      |       | 消费 / 投影接缝角色          |  |
|  +----------+-----------+       +--------------+--------------+  |
|             |                                  |                 |
|             | 边界接入 / 允许依赖              | 允许依赖        |
|             v                                  v                 |
|        +------------------------------------------------+        |
|        |              身份能力承接角色                  |        |
|        +----------------------+-------------------------+        |
|                               |                                  |
|                               | 允许依赖                         |
|                               v                                  |
|                  +---------------------------+                   |
|                  |      身份核心语义角色      |                   |
|                  +-------------+-------------+                   |
|                                ^                                 |
|                                | 允许依赖                         |
|                  +-------------+-------------+                   |
|                  |        基础契约角色        |                   |
|                  +---------------------------+                   |
|                                                                  |
|  +----------------------+                                        |
|  | 技术承载角色          |                                        |
|  +----------+-----------+                                        |
|             |                                                    |
|             | 支撑承载,不得反向定义核心语义                       |
|             v                                                    |
|        +------------------------+                                |
|        | 身份能力承接角色 / 接缝 |                                |
|        +------------------------+                                |
+------------------------------------------------------------------+
```

图示说明:

- 箭头只表达允许依赖方向或边界接入,不表达调用顺序、事件时序、代码 import 或部署关系。
- 身份核心语义角色位于被保护内层;外部来源、消费投影和技术承载都不能反向定义它。
- 基础契约角色只代表 `L0-core` shared refs / actor / trace / metadata / error 等基础契约,不代表业务仓依赖。
- 技术承载角色支撑 accepted truth 的保存、传播和诊断,但不得决定身份生命周期、角色能力摘要或外部来源 truth。

### 7.3 层间约束表

| 架构责任层 / 依赖角色 | 允许依赖 | 禁止依赖 | 说明 |
|---|---|---|---|
| 身份核心语义角色 | 基础契约角色;身份本地不变量 | 外部来源接缝、消费 / 投影接缝、技术承载、运行承载、`L0-bus`、method/work/governance/runtime/archive/observability implementation | 保护平台级成员身份 truth 不被来源、技术或消费者反向定义。 |
| 身份能力承接角色 | 身份核心语义角色、基础契约角色、正式倒置边界 | 直接依赖相邻业务仓 implementation、外部正文 store、UI、runtime implementation、共享数据库事务 | 承接输入并编排边界,但必须把外部内容收束为 ref / snapshot / marker / basis。 |
| 外部来源接缝角色 | 身份能力承接角色定义的接入边界、基础契约角色 | 身份核心语义角色内部状态、identity 正式存储内部结构、相邻仓正文 | 接入只负责转换和隔离,不能越层写核心语义。 |
| 消费 / 投影接缝角色 | 身份能力承接角色暴露的消费 / projection / trace / report boundary | 写模型内部状态、外部 consumer 私有状态、下游实现细节 | 消费只能读、订阅或展示,投影可重建但不得反写 truth。 |
| 技术承载角色 | 身份能力承接角色的 accepted material、基础契约角色 | 业务规则、生命周期判断、visibility policy ownership、外部 truth ownership | 技术承载为存储、trace、audit、outbox、projection、event、handoff 和诊断服务。 |
| 基础契约角色 | 无或自身基础依赖 | L1/L2/L3 业务 truth、identity 状态、运行承载状态 | 只提供跨仓可识别的基础类型语义。 |

### 7.4 按架构单元组织的依赖规则表

| 架构单元 | 允许依赖 | 禁止依赖 | 倒置边界 / 外部接入方式 |
|---|---|---|---|
| 平台级成员身份真相 | 基础契约角色、身份本地不变量 | method/work/governance/runtime/archive/observability implementation;投影和消费方状态 | 由身份能力承接角色提供 id、actor、metadata、basis ref 和变更意图;核心不读取外部正文。 |
| 成员生命周期边界 | 平台级成员身份真相、基础契约角色、正式治理依据 ref | runtime availability、ProjectMember state、治理裁决 truth body | 高风险依据通过 governance basis boundary 进入;不可用时拒绝、待审或 degraded,不能由 runtime 状态替代。 |
| 角色能力摘要 | 平台级成员身份真相、基础契约角色、method source ref / snapshot | RoleDefinition / CapabilityDefinition body、method-library implementation、评估算法正文 | method 来源通过 source resolver / event snapshot / safe summary 进入;正文留在 method-library。 |
| 身份生涯与记忆引用 | 平台级成员身份真相、work source ref、memory / archive ref | ProjectMember / WorkItem truth body、memory body、embedding、archive package | work 事实和 memory / archive 状态通过 ref、snapshot、handoff marker 或 event 进入;缺失进入 pending / reconciliation。 |
| 身份事实消费与追溯 | 身份核心 truth、visibility / redaction boundary、trace / audit material | 下游 consumer implementation、UI 展示状态、observability log body | consumer 通过 query / projection / trace / event / report boundary 消费;不得反写核心 truth。 |
| 外部来源引用 | 基础契约角色、身份能力承接角色 | 外部正文、外部表结构、外部 private id 解析 | 只保存或传递 body-free ref、source version、digest、state marker 和 safe summary。 |
| 消费投影与对账 | 身份核心 truth 的 committed snapshot、projection state、reference state | 相邻仓 truth writer、query-time write、跨仓修复器 | projection 可重建 / 标脏 / 对账;reconciliation 只 report-only,修复必须回到拥有 truth 的仓。 |
| 事件协作影子 | accepted identity truth change、outbox / event boundary、基础契约角色 | `L0-bus` transport ownership、event consumer 私有状态、current truth 旁路重算 | 事件只发布已接受身份事实或安全摘要;duplicate / replay / outbox 由后续详细设计闭口。 |

### 7.5 依赖倒置结论

| 需要倒置的依赖 | 为什么必须倒置 | 正式边界形态 |
|---|---|---|
| method-library 角色 / 能力定义来源 | 定义正文不归 identity,直接依赖会复制 method truth | method source resolver、event snapshot、safe summary、source ref |
| work 项目参与 / ProjectMember 来源 | ProjectMember 归 work,直接依赖会混淆 GlobalMember 和 ProjectMember | work participation source resolver、ProjectMember ref、event snapshot |
| governance 高风险依据 | Gate / Policy / Approval truth 不归 identity | governance basis ref、decision summary、formal precheck boundary |
| memory / archive 状态 | memory body / archive package 不归 identity | memory ref、archive handoff marker、migration state marker |
| observability / audit 外部承载 | log body 和 metric store 不归 identity | trace / audit refs、safe diagnostic marker、report-only handoff |
| `L0-bus` 事件协作 | bus 是事件协作主干,不是 identity 业务 truth | outbox / event publication boundary;不得让 bus 定义 domain state |
| downstream consumer 读取 | 消费方不拥有 identity truth | query / projection / SDK / event consumption boundary |
| 技术存储 / projection | 存储和投影不能定义业务语义 | accepted truth write boundary、projection rebuild boundary、read visibility boundary |

### 7.6 本仓依赖裁剪表

| 关联项目 | 全局关系 | 本仓角色 | 依赖类型 | 是否进入当前文档主链 | 裁剪理由 |
|---|---|---|---|---|---|
| `L0-core` | 全平台共享契约来源 | 依赖方 | 编译期依赖 | 是 | identity 需要共享 refs、actor、trace、metadata、error 等基础契约;这是唯一编译期依赖候选。 |
| `L0-bus` | 全平台事件传递主干 | 协作方 | 事件协作依赖 | 是 | 身份变化事实需要跨仓传播;bus 不定义 identity event schema 或业务 truth,不得成为业务源码依赖。 |
| `L3-method-library` | method / role / capability 定义来源 | 依赖方 / 协作方 | 运行期 / 事件协作 | 是 | identity 需要角色 / 能力来源摘要,但定义正文和 method body 归 method-library。 |
| `L1-work` | ProjectMember / project participation truth owner | 依赖方 / 被依赖方 / 协作方 | 运行期 / 事件协作 | 是 | identity 消费项目参与来源并向 work 提供 GlobalMember 身份锚点;ProjectMember truth 仍归 work。 |
| `L1-governance` | 决策 / policy / approval truth owner | 依赖方 / 被依赖方 / 协作方 | 运行期 / 事件协作 | 是 | identity 消费高风险 lifecycle 依据并向 governance 提供 actor 身份引用;裁决 truth 仍归 governance。 |
| memory / archive 承载边界 | 记忆 / 冷存正文承载方 | 依赖方 / 协作方 | 运行期 / handoff / 事件协作 | 是 | identity 只保存 memory refs、archive refs、migration / handoff marker,不保存正文或 package。 |
| `L4-observability` | 横切观测与审计支撑 | 协作方 | 运行期 / 事件协作 / handoff | 是 | identity 可交接 trace / audit refs 和 safe diagnostics,不保存观测正文或让观测定义 truth。 |
| `L2-member-service` / `L2-runtime` | 成员容器编排和运行能力 | 被依赖方 / 协作方 | 运行期 / 事件协作 | 是 | runtime 消费身份生命周期和能力摘要,但运行状态不能反向定义 identity lifecycle。 |
| `L1-process` | process participant 消费方 | 被依赖方 | 运行期 / 事件协作消费 | 是 | process 消费 actor / participant 身份摘要,不得反写 identity truth。 |
| `L1-conversation` | conversation participant 消费方 | 被依赖方 | 运行期 / 事件协作消费 | 是 | conversation 消费显示身份和参与者摘要,不得拥有 identity truth。 |
| `L1-workspace` | workspace view consumer | 被依赖方 | 运行期 / 事件协作消费 | 是 | workspace 消费成员视图和跨项目摘要,只拥有自身视图局部状态。 |
| `L0-sdk` / L5 产品层 | SDK / UI / CLI / 管理入口 | 被依赖方 / 入口方 | 运行期消费 / SDK 封装 | 是 | 产品层通过 SDK / API 消费或提交受控意图,不拥有 identity truth。 |
| 外部 DB / vector / cache / queue product | 基础设施产品 | 无直接业务角色 | 不进入业务依赖 | 否 | 只可能在配置 / 实施阶段作为 adapter 产品选择,不属于架构业务依赖。 |
| `L1-artifact` | artifact body owner | 非当前主链依赖 | 裁剪出当前主链 | 否 | identity 不保存 artifact body;若后续 evidence 需要 artifact ref,必须经 governance / evidence boundary 明确。 |
| L5 UI implementation | 产品展示实现 | 消费方实现 | 裁剪出源码依赖 | 否 | UI 只能经 SDK / public boundary 消费,不能进入 identity package dependency。 |

### 7.7 本仓依赖类型分类表

| 依赖类型 | 关联项目 | 本仓如何使用 / 提供能力 | 后续文档落点 |
|---|---|---|---|
| 编译期依赖 | `L0-core` | 使用共享 refs、actor、trace、metadata、error 基础契约 | `03` 详细设计 shared type / `07` 实施计划 package dependency |
| 事件协作依赖 | `L0-bus` | 发布身份变化、角色能力摘要变化、生涯 / memory ref 变化,并消费正式外部事实事件 | `01` 依赖约束 / `03` event-outbox / `05` event tests |
| 运行期 / 事件协作 | `L3-method-library` | 读取或同步角色 / 能力定义摘要、来源版本和 stale marker | Step 9 交互 / `03` resolver and consumer |
| 运行期 / 事件协作 | `L1-work` | 接收项目参与 / ProjectMember ref 来源,输出 GlobalMember 身份锚点 | Step 9 交互 / `03` work source boundary / `05` tests |
| 运行期 / 事件协作 | `L1-governance` | 消费高风险 lifecycle 依据,提供 actor identity summary | Step 9 交互 / `03` governance basis boundary |
| 运行期 / handoff / 事件协作 | memory / archive 承载边界 | 管理 memory refs、archive refs、migration / handoff state | Step 8 数据所有权 / Step 9 handoff / `03` jobs |
| 运行期 / 事件协作 / handoff | `L4-observability` | 交接 trace / audit refs、safe diagnostics 和 report-only material | Step 12 横切关注点 / `03` observability boundary |
| 运行期 / 事件协作消费 | `L1-process` / `L1-conversation` / `L1-workspace` / `L2-member-service` / `L2-runtime` | 提供身份事实、生命周期、角色能力摘要和变化追溯 | Step 9 交互 / `03` query / event / projection |
| SDK / public consumption | `L0-sdk` / L5 产品层 | 封装成员查询、管理意图和可见消费结果 | Step 9 交互 / Step 12 安全 / `03` API boundary |

### 7.8 本仓禁止依赖表

| 禁止依赖 | 禁止原因 | 正确协作方式 |
|---|---|---|
| `L1-identity` -> `L1-work` 源码依赖 | 会让 ProjectMember / Project / WorkItem truth 泄入 identity,形成 L1 循环和 truth 混层 | 通过 `GlobalMemberRef`、ProjectMember ref、work event / resolver / snapshot 协作 |
| `L1-identity` -> `L3-method-library` 源码依赖 | 会让 RoleDefinition / CapabilityDefinition / method body 泄入 identity | 通过 method source ref、safe summary、resolver、event snapshot 协作 |
| `L1-identity` -> `L1-governance` 源码依赖 | 会让 Gate / Decision / Policy / Approval truth 泄入 identity | 通过 governance basis ref、decision summary、formal precheck 协作 |
| `L1-identity` -> `L2-member-service` / `L2-runtime` 源码依赖 | runtime 编排和执行状态不是身份 truth | identity 发布生命周期 / role summary, runtime 通过正式边界消费 |
| `L1-identity` -> memory / archive body store 源码依赖 | 会保存或读取 memory body、embedding、archive package | 只保存 refs、migration marker、handoff marker,正文由承载方拥有 |
| `L1-identity` -> `L4-observability` implementation | 会把运行日志、metric、trace backend 变成 identity truth 来源 | 只交接 trace / audit refs、safe diagnostics 和 report-only material |
| `L1-identity` -> L5 UI / product implementation | UI 展示状态不定义身份 truth | 通过 SDK / API / projection / event 消费 |
| 身份核心语义角色 -> event bus / database / queue / cache | 技术机制会反向决定身份语义 | 技术承载只承接 accepted truth material,不得被核心语义依赖 |
| projection / query / report -> identity truth write | 读模型或对账会反向修复核心 truth | projection 可重建、query 不写、reconciliation report-only |
| external source ref -> direct string parsing for scope / identity | 通过字符串推导会形成隐式依赖和第二真相 | 必须定义 typed ref、resolver / source summary 和正式错误口径 |

### 7.9 依赖裁剪图: L1-identity

```text
Global baseline
  |
  | crop only L1-identity related edges
  v
+----------------------+
| L1-identity          |
+----------+-----------+
           |
           | [compile]
           v
        L0-core

L1-identity <--> [event]         L0-bus
L1-identity <--> [runtime/event] L3-method-library
L1-identity <--> [runtime/event] L1-work
L1-identity <--> [runtime/event] L1-governance
L1-identity <--> [runtime/event] memory / archive carrier
L1-identity  --> [runtime/event] L1-process / L1-conversation / L1-workspace
L1-identity  --> [runtime/event] L2-member-service / L2-runtime
L1-identity  --> [runtime/event] L0-sdk / L5 products
L1-identity <--> [runtime/event] L4-observability
```

图示说明:

- 本图只展示 `L1-identity` 相关依赖边,不复制全 27 仓矩阵。
- `[compile]` 只有 `L0-core`;其它 `[runtime]`、`[event]`、`[handoff]` 或消费关系不得写成业务仓 package dependency。
- 双向箭头表示双方可通过正式边界交换 refs、snapshots、events 或 handoff markers,不表示共享数据库、事务或源码依赖。
- 输出给 process、conversation、workspace、runtime、SDK / 产品层的是身份事实消费边界,不是对 identity truth 的反向 ownership。

### 7.10 依赖方向停审记录

| 架构单元 | 层级是否清楚 | 禁止依赖是否明确 | 运行期 / 事件协作是否未误写为 package dependency | 结论 |
|---|---|---|---|---|
| 平台级成员身份真相 | 是 | 是 | 是 | 已通过 |
| 成员生命周期边界 | 是 | 是 | 是 | 已通过 |
| 角色能力摘要 | 是 | 是 | 是 | 已通过 |
| 身份生涯与记忆引用 | 是 | 是 | 是 | 已通过 |
| 身份事实消费与追溯 | 是 | 是 | 是 | 已通过 |
| 外部来源引用 | 是 | 是 | 是 | 已通过 |
| 消费投影与对账 | 是 | 是 | 是 | 已通过 |
| 事件协作影子 | 是 | 是 | 是 | 已通过 |

### 7.11 跨依赖边界审计表

| 审计项 | 结论 | 说明 |
|---|---|---|
| 是否存在除 `L0-core` 外的编译期依赖 | 未允许 | method/work/governance/runtime/archive/observability/UI 均不进入业务源码依赖。 |
| 是否把 `L0-bus` 误写成业务 package dependency | 未允许 | 本步只把它定义为事件协作边界;后续若需要 client,必须限定为基础设施 adapter 并不携带业务 truth。 |
| 是否把运行期通信写成层间依赖规则 | 未发现 | 本步只写架构允许依赖方向和边界接入,不写协议或调用顺序。 |
| 是否把运行单元当依赖层 | 未发现 | 同步入口、异步承接、维护承接只作为 Step 6 输入,未进入依赖图主语。 |
| 是否让外部正文进入核心语义 | 未允许 | method body、ProjectMember body、memory body、archive package、runtime context 和 log body 均被禁止。 |
| 是否让 projection / report 反写 truth | 未允许 | projection 可重建;对账 report-only;query 不写 truth。 |
| 是否存在下游消费反向 ownership | 未允许 | 下游只能读、订阅、展示或经 SDK 提交受控意图。 |
| 是否存在 unresolved 依赖裁剪冲突 | 未发现 | `L0-bus` 实现形态仍留给后续 adapter / 实施计划,不改变本步业务依赖裁剪。 |

---

## 8. 回填草稿

````md
## 8. 依赖方向与层间约束

> 校准来源:
> - `design-calibration/01_arch_step_07_dependency_direction.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“架构责任层 / 依赖角色表”“层间约束表”“按架构单元组织的依赖规则表”和“跨仓依赖裁剪表”小节,了解本章依赖规则如何保护身份真相边界。

`L1-identity` 的依赖方向以保护平台级成员身份真相为中心。外部来源、消费投影、事件协作、技术承载和下游消费都不能反向定义 identity truth;它们必须通过正式接缝进入身份能力承接边界,再由核心语义决定是否接受、拒绝、标记 pending / stale / unavailable 或形成 report-only 结果。

### 8.1 依赖方向图

```text
+------------------------------------------------------------------+
|                     L1-identity dependency boundary             |
|                                                                  |
|  +----------------------+       +-----------------------------+  |
|  | 外部来源接缝角色      |       | 消费 / 投影接缝角色          |  |
|  +----------+-----------+       +--------------+--------------+  |
|             |                                  |                 |
|             | 边界接入 / 允许依赖              | 允许依赖        |
|             v                                  v                 |
|        +------------------------------------------------+        |
|        |              身份能力承接角色                  |        |
|        +----------------------+-------------------------+        |
|                               |                                  |
|                               | 允许依赖                         |
|                               v                                  |
|                  +---------------------------+                   |
|                  |      身份核心语义角色      |                   |
|                  +-------------+-------------+                   |
|                                ^                                 |
|                                | 允许依赖                         |
|                  +-------------+-------------+                   |
|                  |        基础契约角色        |                   |
|                  +---------------------------+                   |
|                                                                  |
|  +----------------------+                                        |
|  | 技术承载角色          |                                        |
|  +----------+-----------+                                        |
|             |                                                    |
|             | 支撑承载,不得反向定义核心语义                       |
|             v                                                    |
|        +------------------------+                                |
|        | 身份能力承接角色 / 接缝 |                                |
|        +------------------------+                                |
+------------------------------------------------------------------+
```

箭头只表达允许依赖方向或边界接入,不表达调用顺序、事件时序、代码 import 或部署关系。身份核心语义角色位于被保护内层;外部来源、消费投影和技术承载都不能反向定义它。

### 8.2 层间约束

| 架构责任层 / 依赖角色 | 允许依赖 | 禁止依赖 | 说明 |
|---|---|---|---|
| 身份核心语义角色 | 基础契约角色;身份本地不变量 | 外部来源接缝、消费 / 投影接缝、技术承载、运行承载、`L0-bus`、method/work/governance/runtime/archive/observability implementation | 保护平台级成员身份 truth 不被来源、技术或消费者反向定义。 |
| 身份能力承接角色 | 身份核心语义角色、基础契约角色、正式倒置边界 | 直接依赖相邻业务仓 implementation、外部正文 store、UI、runtime implementation、共享数据库事务 | 承接输入并编排边界,但必须把外部内容收束为 ref / snapshot / marker / basis。 |
| 外部来源接缝角色 | 身份能力承接角色定义的接入边界、基础契约角色 | 身份核心语义角色内部状态、identity 正式存储内部结构、相邻仓正文 | 接入只负责转换和隔离,不能越层写核心语义。 |
| 消费 / 投影接缝角色 | 身份能力承接角色暴露的消费 / projection / trace / report boundary | 写模型内部状态、外部 consumer 私有状态、下游实现细节 | 消费只能读、订阅或展示,投影可重建但不得反写 truth。 |
| 技术承载角色 | 身份能力承接角色的 accepted material、基础契约角色 | 业务规则、生命周期判断、visibility policy ownership、外部 truth ownership | 技术承载为存储、trace、audit、outbox、projection、event、handoff 和诊断服务。 |
| 基础契约角色 | 无或自身基础依赖 | L1/L2/L3 业务 truth、identity 状态、运行承载状态 | 只提供跨仓可识别的基础类型语义。 |

### 8.3 跨仓依赖裁剪

| 关联项目 | 全局关系 | 本仓角色 | 依赖类型 | 是否进入当前文档主链 | 裁剪理由 |
|---|---|---|---|---|---|
| `L0-core` | 全平台共享契约来源 | 依赖方 | 编译期依赖 | 是 | identity 需要共享 refs、actor、trace、metadata、error 等基础契约;这是唯一编译期依赖候选。 |
| `L0-bus` | 全平台事件传递主干 | 协作方 | 事件协作依赖 | 是 | 身份变化事实需要跨仓传播;bus 不定义 identity event schema 或业务 truth,不得成为业务源码依赖。 |
| `L3-method-library` | method / role / capability 定义来源 | 依赖方 / 协作方 | 运行期 / 事件协作 | 是 | identity 需要角色 / 能力来源摘要,但定义正文和 method body 归 method-library。 |
| `L1-work` | ProjectMember / project participation truth owner | 依赖方 / 被依赖方 / 协作方 | 运行期 / 事件协作 | 是 | identity 消费项目参与来源并向 work 提供 GlobalMember 身份锚点;ProjectMember truth 仍归 work。 |
| `L1-governance` | 决策 / policy / approval truth owner | 依赖方 / 被依赖方 / 协作方 | 运行期 / 事件协作 | 是 | identity 消费高风险 lifecycle 依据并向 governance 提供 actor 身份引用;裁决 truth 仍归 governance。 |
| memory / archive 承载边界 | 记忆 / 冷存正文承载方 | 依赖方 / 协作方 | 运行期 / handoff / 事件协作 | 是 | identity 只保存 memory refs、archive refs、migration / handoff marker,不保存正文或 package。 |
| downstream consumers | process、conversation、workspace、runtime、SDK / 产品层等消费边界 | 被依赖方 / 入口方 | 运行期消费 / 事件协作消费 | 是 | 消费方只能读取、订阅、展示身份事实或提交受控意图,不得反写 identity truth。 |

### 8.4 禁止依赖

- `L1-identity` 不得直接依赖 `L1-work`、`L3-method-library`、`L1-governance`、runtime、memory / archive、observability 或 UI 的 implementation。
- 身份核心语义不得依赖 event bus、database、queue、cache、projection、report 或运行承载状态。
- query、projection、event consumer、handoff、reconciliation 和 downstream consumer 不得反向写 identity truth。
- 任何 external ref 不得通过字符串解析直接推导 scope、member identity、visibility 或 graph relation;必须经 typed ref 和正式 resolver / source summary。
````

---

## 9. 待确认事项

本步不新增阻塞性待确认事项。需求层已登记的 `OQ-ID-001`~`OQ-ID-006` 继续有效。

| 待确认项 | 本步处理 |
|---|---|
| `OQ-ID-001` method-library 到 identity 的角色 / 能力来源方式 | 本步只定义依赖类型为运行期 / 事件协作,具体 resolver / event 协议后移 Step 9 / `03`。 |
| `OQ-ID-002` 高风险 lifecycle 动作枚举 | 本步只定义 governance basis 作为倒置边界,具体动作和依据校验后移 `03/06`。 |
| `OQ-ID-003` memory refs 的正式承载方和迁移结果 surface | 本步只定义 memory / archive 为运行期 / handoff / 事件协作边界,具体 surface 后移 Step 8 / Step 9 / `03`。 |
| `OQ-ID-004` 成员摘要 visibility / privacy 字段级裁剪 | 本步只定义 consumption boundary 不得反写 truth,字段级 visibility 后移 Step 12 / `03`。 |
| `OQ-ID-005` P0 performance / availability 阈值 | 本步不设阈值;性能和可用性阈值后移 `05/06`。 |
| `OQ-ID-006` 既有 `04` 是否保留或重写 | 本步不引用既有 `04`;配置依赖绑定后移新版 `04` 复核。 |

---

## 10. 进入下一步条件

Step 7 已完成。进入 Step 8 前必须满足:

- 用户已通过“继续”确认本步依赖方向与层间约束。
- `01_architecture_calibration_flow.md` 中 Step 7 状态已更新为 `已完成`。
- Step 8 只能承接本步依赖规则去讨论数据所有权和一致性,不得让数据归属反向放松依赖裁剪。
- 若审核发现运行期 / 事件协作被误写为 package dependency、外部 implementation 被核心依赖、projection / report 反写 truth 或下游 consumer 反向 ownership,必须先回到本 Step 修正,不能带着冲突进入 Step 8。
