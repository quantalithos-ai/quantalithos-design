# Step 3. 收稳约束条件

> 对应 SOP: `standards/document/概要设计讨论流程_SOP.md` Step 3
> 回填章节: `02-概要设计.md` §3 约束条件
> 生成日期: 2026-06-08
> 状态: 已完成

---

## 1. 本步目标

从已收敛的上游输入、设计目标、非范围和架构边界中提炼会直接影响概要设计结构的硬约束,避免后续代码主体、主要组成部分、关键对象、接口骨架、处理流和状态机向 process、work、artifact、conversation、identity、method-library、runtime、capability、observability、workspace、archive 或 external GRC 串线。

本步只收稳结构性约束,不复述完整架构设计,不写完整实现策略、数据库规则、部署参数、接口 schema 或测试用例。

---

## 2. 本步输入

| 输入 | 状态 | 用途 |
|---|---|---|
| `02_hld_step_01_upstream_boundary.md` | 已完成 | 提供可承接的需求 / 架构边界、本文必须回答和暂不进入范围 |
| `02_hld_step_02_goals_scope.md` | 已完成 | 提供概要设计目标、范围、非范围和代码主体骨架层深度口径 |
| `00-需求文档.md` §10~§14 | 已完成 | 提供业务规则、数据归属、接口依赖、非功能底线和验收红线 |
| `01-架构设计.md` §3 / §8 / §9 / §10 / §13 / §15 | 已完成 | 提供硬约束、依赖方向、数据所有权、一致性、通信方式、横切关注点和风险口径 |
| 旧 `02-概要设计.md` | 未按最新 SOP 校准 | 作为约束缺失和旧主线回流问题诊断输入 |

---

## 3. SOP 问题回答

### 3.1 哪些约束会直接影响本仓对象、接口、处理流或状态机设计?

会直接影响后续概要设计的约束包括:

- 独立 Governance truth 约束:对象和模块必须围绕 governance context / input、Gate / Decision、Approval / responsibility、Policy effective fact、shared rules、Control、AIIA / SoA governance conclusion、Nonconformity corrective loop、governance traceability record 和派生维护展开。
- 编译依赖约束:核心语义只能编译期依赖 `L0-core`,其他仓通过引用、快照、事件、port、handoff 或外部接缝协作。
- 数据归属约束:本仓只拥有治理决策与治理控制事实 truth,可以保存外部引用、摘要、快照和派生视图,不得保存相邻仓正文。
- Gate / Decision 边界约束:Gate / Decision 只能由 Governance 正式形成,不得由 process waiting state、work lifecycle、conversation card、runtime cache 或 report row 替代。
- Approval / responsibility 边界约束:审批责任、投票、授权和替代裁决责任属于 Governance 裁决事实,不得接管 identity 的 GlobalMember、role、actor lifecycle 或平台认证授权 truth。
- Policy / shared rules 边界约束:Policy effective fact、scope、priority、conflict 和 shared rules 属于 Governance truth,不得由 AIPolicyDef、runtime policy cache、capability whitelist、tool execution 或项目局部配置反向定义。
- Control / compliance conclusion 边界约束:Control applicability、implementation、review、AIIA / SoA governance conclusion 只能保存适用性、覆盖、排除、批准和责任结论,不得保存标准正文、artifact body、evidence body 或 archive package body。
- Nonconformity 纠正闭环约束:Nonconformity 必须表达不符合、原因、纠正、复验、关闭和责任语境,不得退化为 bug、work blocker、observability alert 或维护备注。
- Traceability / handoff 约束:Governance traceability 只能表达治理事实来源、变化、消费、报告、对账和交接语境,不得成为 observability ledger、archive package 或 external GRC truth。
- 派生只读约束:dashboard、report、external GRC export、projection、reconciliation evidence、archive preparation 和 maintenance evidence 只能从 Governance truth 派生,不得成为第二 truth。
- 一致性分层约束:核心治理事实成立强一致,外部快照、引用解析、事件传播、派生视图、报告、对账、观测和归档交接最终一致或引用有效性一致。
- 通信方式约束:核心治理变化同步收口,已成立事实传播和外部正式结果送达异步承接,派生 / 刷新 / 重建 / 对账 / handoff 后台处理。
- 配置边界约束:配置不得改变 truth 归属、正文排除、Gate / Decision 正式性、Policy / shared rules 优先级、Nonconformity 闭环、派生不反写、同步 / 异步 / 后台分工或依赖类型。

### 3.2 哪些约束来自需求文档,哪些约束来自架构设计或全局设计?

| 来源 | 约束来源内容 | 本步提炼结果 |
|---|---|---|
| `00-需求文档.md` §2 / §4 / §7 | 本仓定位、目标 / 非目标、核心能力闭环 | 独立 Governance truth、C-GOV 核心闭环必须共同成立 |
| `00-需求文档.md` §10 | 业务规则与边界约束 | Gate / Decision、Policy、Control、AIIA / SoA、Nonconformity 的边界和禁止行为 |
| `00-需求文档.md` §11 | 数据需求与数据归属 | truth / snapshot / reference / forbidden body 边界 |
| `00-需求文档.md` §12 | 接口与依赖 | 能力级接口边界和外部依赖边界 |
| `00-需求文档.md` §13 / §14 | 非功能需求和验收红线 | 安全、一致性、降级、追溯、可审计和依赖裁剪底线 |
| `01-架构设计.md` §3 | 架构硬约束和不可变约束 | 正文排除、派生不反写、唯一编译期依赖、正式裁决不可原地改写 |
| `01-架构设计.md` §8 | 依赖方向与层间约束 | 核心语义、外部接缝、派生辅助、技术承载分层 |
| `01-架构设计.md` §9 | 数据所有权与一致性策略 | 强一致 / 最终一致 / 引用有效性一致分层 |
| `01-架构设计.md` §10 | 关键交互与通信方式 | 同步、异步和后台承接口径 |
| `01-架构设计.md` §13 / §15 | 横切关注点和风险 | 配置不可绕过边界、外围降级不污染核心、阻塞风险 |
| `standards/document/全局项目依赖关系与裁剪规则.md` | 总体依赖关系和单仓裁剪方法 | 每个子项目必须从总依赖关系中裁剪自己的依赖子图 |

### 3.3 哪些边界如果不先写清,后续最容易串到相邻仓或详细设计?

最容易串线的边界包括:

- Gate / Decision 与 process waiting state、work lifecycle、conversation card、runtime cache、report row 的边界。
- Approval / responsibility 与 identity role、actor lifecycle、member permission、platform authorization 的边界。
- Policy effective fact / shared rules 与 AIPolicyDef、runtime cache、capability whitelist、project local config、tool execution 的边界。
- Control applicability / implementation / review 与 ControlDefinition、standard body、method content、artifact evidence body 的边界。
- AIIA / SoA governance conclusion 与 AIIA / SoA artifact body、evidence body、archive package body 的边界。
- Nonconformity corrective loop 与 bug、work blocker、runtime failure、observability alert、maintenance report 的边界。
- Governance traceability 与 observability audit store、archive package、external GRC truth 的边界。
- dashboard、report、projection、reconciliation、external GRC export、archive preparation 与 Governance truth 写路径的边界。
- 同步成立状态与异步传播 / 后台派生 / 观测 / 归档交接状态的边界。
- 概要设计骨架与详细设计完整字段、DTO、函数、事务、状态矩阵、配置项的边界。

### 3.4 哪些约束只是泛化工程原则,不应进入本章?

以下内容不进入本章约束条件:

- “代码要清晰”“模块要解耦”“可维护性要好”这类泛化工程原则。
- 具体数据库、规则引擎、搜索、消息队列、缓存、调度器、对象存储或部署拓扑选择。
- 完整 Rust module layout、crate name、trait 签名和 repository 函数。
- 具体 API 字段、JSON / proto / CloudEvent schema、错误码、幂等键格式。
- 具体测试覆盖率、性能数值、压测规模和验收证据路径。
- 具体配置项默认值、配置文件格式和配置加载实现。

### 3.5 每条约束是否能指导后续章节的设计判断?

本步保留的约束都必须能回答至少一个后续设计判断:

- Step 4 用它判断代码主体框架是否围绕 Governance 核心语义、外部接缝、派生辅助和技术承载展开。
- Step 5 用它判断主要组成部分是否越权承接相邻仓职责。
- Step 6 用它判断关键对象是否是本仓 truth、snapshot、reference、derived view 或 forbidden body。
- Step 7 用它判断接口是 Command、Query、Event、Operations Job 还是外部接缝,以及是否越过数据归属边界。
- Step 8 用它判断处理流是否把同步成立、异步传播和后台承接混写。
- Step 9 用它判断状态机是否表达 pending decision、approved、rejected、waived、stale、expired、invalid、correcting、closed、handoff pending 等治理状态。
- Step 10 用它判断异常和边界场景是否覆盖裁决责任不足、证据不可用、Policy 冲突、shared rules 违背、正文越界、派生延迟和交接失败。
- Step 11 用它判断配置是否只影响技术承载和策略参数,不得改变核心边界。

---

## 4. 当前文档问题诊断

| 旧 `02-概要设计.md` 内容 | 问题 | 本轮处理 |
|---|---|---|
| 以 Gate、Decision、Governance Request、Exception、Responsibility Chain 的新人解释为主 | 领域词解释有价值,但未形成能指导后续设计的结构性约束 | 后续必须先按 truth / snapshot / reference / derived / forbidden body 归类 |
| 将 Gate Turn、conversation card、process waiting 和 governance decision 作为混合背景讲解 | 容易暗示显化层或等待状态可以替代正式裁决 | 改为 Gate / Decision 正式性约束和 conversation / process 边界约束 |
| Policy / Control / AIIA / SoA 多以合规语义说明 | 没有显式写出定义正文、artifact body、evidence body 不得进入 Governance truth | 改为 Policy / Control / compliance conclusion 正文排除约束 |
| Nonconformity 只作为合规问题线索 | 容易被实现端当成普通 bug、blocker 或 alert | 改为纠正闭环约束 |
| report、dashboard、external GRC 等消费面与治理真相关系不够硬 | 容易让派生消费成为第二 truth | 改为派生只读约束 |
| 旧文档中存在外部 GRC、Policy engine、旧性能数字等实现候选 | 容易把技术产品或旧指标写成概要硬约束 | 改为协议与产品中立约束,具体技术后移 |
| 缺少配置边界 | 后续可能通过配置绕开 shared rules、正式裁决、正文排除或派生不反写 | 本步新增配置不可改变核心边界的结构性约束 |

---

## 5. 改动前后对比

| 维度 | 改动前 | 改动后 |
|---|---|---|
| 约束来源 | 多数来自旧对象解释和旧实现心智 | 来自新版需求、架构、全局依赖裁剪和上游稳定仓 |
| 约束粒度 | 偏“不要混层”的泛化提醒 | 明确到对象、接口、处理流、状态机和配置判断 |
| 数据边界 | Gate / Decision / Policy / Control 口径较粗 | truth / snapshot / reference / derived view / forbidden body 分层 |
| 外部来源 | process、work、artifact、conversation、runtime 和 external GRC 容易混入主线 | 统一经引用、摘要、快照、事件、handoff 或正式输入边界进入 |
| 外围增强 | dashboard、external GRC、Policy DSL、报告健康度容易进入核心主线 | 只能作为演进、派生、对账或维护辅助,不得反写真相或阻塞核心 |
| 下游承接 | 泛化为支撑详细设计 | 明确哪些约束要继续指导 Step 4~Step 11 |

---

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A: 直接复述架构设计 §3 约束 | 与架构一致 | 太粗,不能指导对象、接口、流程和状态机 | 不采用 |
| 方案 B: 按“会影响后续概要章节判断”筛选约束 | 能服务 Step 4~Step 11,避免泛化 | 需要对需求和架构约束做二次转译 | 采用 |
| 方案 C: 把详细设计规则也提前写入约束 | 对开发约束更强 | 抢占详细设计职责,容易写入字段、schema、事务和实现策略 | 不采用 |
| 方案 D: 沿用旧 Gate / Decision / Request 教学边界作为约束 | 与旧文档迁移成本低 | 会让对象候选和实现候选反向绑定概要主线 | 不采用 |

---

## 7. 结构化中间产物

### 7.1 约束条件表

| 约束 | 说明 |
|---|---|
| 独立 Governance truth 约束 | 后续代码主体、主要组成部分和关键对象必须围绕 governance context / input、Gate / Decision、Approval / responsibility、Policy effective fact、shared rules、Control、AIIA / SoA governance conclusion、Nonconformity corrective loop、governance traceability record 和派生维护展开,不能被 process、work、artifact、conversation、runtime、observability、archive 或 external GRC 吸收。 |
| 编译依赖与跨仓裁剪约束 | 核心语义只能编译期依赖 `L0-core` 共享契约;`L0-bus`、`L1-identity`、`L1-conversation`、`L1-work`、`L1-process`、`L1-artifact`、`L2-runtime`、`L3-capability-hub`、`L1-workspace`、`L0-sdk`、`L3-method-library`、`L4-observability`、`L4-archive` 必须按运行期、事件协作、外部接缝、handoff 或下游消费裁剪。 |
| 数据归属分层约束 | 本仓正式拥有 Governance truth;可以保存外部快照、摘要、投影和引用关系;不得保存 process、work、artifact、conversation、identity、method-library、runtime、capability、workspace、observability、archive 或 external GRC 正文。 |
| Gate / Decision 正式性约束 | Gate / Decision 只能由 Governance 正式形成并追溯,不得被 process waiting state、work lifecycle、conversation card、runtime cache、report row 或 external GRC record 替代。 |
| Approval / responsibility 边界约束 | 审批责任、投票、授权、替代裁决和风险承担事实属于 Governance 裁决语境,不得成为 identity role、GlobalMember lifecycle、platform auth 或 tool permission truth。 |
| Policy / shared rules 约束 | Policy effective fact、scope、priority、conflict、override 和 shared rules 必须由 Governance 承载;低 scope policy、project local config、runtime default、capability whitelist 或 tool execution 不得覆盖组织级 shared rules。 |
| Control / compliance conclusion 约束 | Control applicability / implementation / review、AIIA / SoA governance conclusion 只能保存适用性、覆盖、排除、批准和责任结论;不得保存标准正文、method definition body、artifact body、evidence body 或 archive package body。 |
| Nonconformity 纠正闭环约束 | Nonconformity 必须表达不符合、原因、纠正、复验、关闭和责任语境,不得退化为 bug、work blocker、runtime failure、observability alert 或维护备注。 |
| Traceability / handoff 边界约束 | Governance traceability 只能表达治理事实来源、变化、消费、报告、对账和交接语境;不得成为 observability ledger、archive package、external GRC truth 或 UI history。 |
| 派生只读约束 | dashboard、report、external GRC export、projection、reconciliation evidence、archive preparation 和 maintenance evidence 只能从 Governance truth 派生,可延迟、可重建、可过期,但不能生成新业务事实或反写核心。 |
| 一致性分层约束 | governance context / input、Gate / Decision、Approval / responsibility、Policy effective fact、shared rules、Control、AIIA / SoA、Nonconformity 和关键 traceability 的核心成立必须强一致;外部快照、引用解析、事件传播、派生视图、报告、对账、观测和归档交接按最终一致或引用有效性一致表达。 |
| 通信方式分层约束 | 核心变化使用同步请求 / 响应收口;已成立 Governance 事实传播和外部正式结果送达使用异步事件 / 回调承接;派生、刷新、重建、对账和交接材料形成使用后台任务 / 延后承接。 |
| 失败状态显式约束 | 裁决责任不足、证据不可用、Policy 冲突、shared rules 违背、control applicability 不成立、compliance coverage 缺口、Nonconformity 复验失败、引用不可解析、旧快照、过期投影、待传播事件、待交接材料和外部依赖降级都必须表达为独立状态或边界场景,不得伪装成核心成功。 |
| 配置不可越界约束 | 配置只能影响运行承载、派生策略、刷新节奏、保留期限、限流、复核窗口或外部接缝参数,不得改变 truth 归属、正文排除、Gate / Decision 正式性、Policy / shared rules 优先级、Nonconformity 闭环、同步 / 异步 / 后台分工、派生不反写或依赖类型。 |
| 协议与产品中立约束 | 概要设计不得提前锁定 PostgreSQL、Policy engine、external GRC 产品、完整 ES / CQRS、搜索产品、队列产品、缓存产品、调度产品、对象存储或容量数字;这些只能在后续详细设计、配置设计、测试、验收或实施计划中基于本约束展开。 |

### 7.2 后续章节门禁表

| 后续章节 | 必须使用的约束 | 门禁判断 |
|---|---|---|
| Step 4 代码主体框架映射 | 独立 Governance truth、依赖裁剪、通信方式分层 | 代码主体是否保护核心语义,并把同步入口、异步输入、后台维护、派生承载和技术承载分开 |
| Step 5 主要组成部分 | 数据归属、Gate / Decision、Policy、Control / compliance、Nonconformity、派生只读 | 组成部分是否承担了相邻仓正文、工作事实、过程等待、执行正文、展示层、观测账本、归档包或 external GRC 职责 |
| Step 6 关键对象 | truth / snapshot / reference / derived / forbidden body 分层 | 对象是否属于本仓该拥有的对象类型,字段是否暗含外部正文、执行状态、UI 显示或外部 GRC truth |
| Step 7 API / 接口骨架 | 显式变化、同步 / 异步 / 后台分工、协议中立 | 接口是否表达正确读写性质,是否把协议、产品或外部正文写成 truth |
| Step 8 关键处理流 | 一致性分层、失败显式、正式裁决不可替代 | 数据流是否混淆核心成立、传播、派生、对账、报告和交接 |
| Step 9 状态机 | 失败显式、引用有效性、派生最终一致、纠正闭环 | 状态集合是否覆盖 pending decision、approved、rejected、waived、accepted risk、stale、expired、invalid、correcting、closed、handoff pending 等治理状态 |
| Step 10 异常与边界场景 | 裁决责任不足、证据不可用、Policy 冲突、shared rules 违背、正文排除、派生延迟、交接失败 | 异常场景是否覆盖最容易打穿边界的路径 |
| Step 11 配置影响 | 配置不可越界 | 配置是否只影响参数,不改变核心边界 |

---

## 8. 回填草稿

正式 `02-概要设计.md` 后续整理时:

- §3 “约束条件”引用本文件 §7.1 的约束条件表,生成正式文档时从该节摘录。
- §3 后附简短说明:这些约束只约束概要设计结构,不替代详细设计中的完整对象契约、接口协议、状态矩阵、配置项和测试用例。
- Step 4~Step 11 的正式章节必须继续使用本文件 §7.2 的门禁表检查是否越界。
- 不在本 Step 重复粘贴正式全文,后续 Step 14 从结构化中间产物摘录生成正式文档。

---

## 9. 待确认事项

### 9.1 待确认项处理建议

| 待确认项 | 备选方案 | 推荐方案 | 推荐理由 | 当前状态 |
|---|---|---|---|---|
| 概要设计 §3 是否复述架构全文 | A. 复述架构 §3;B. 只提炼影响后续概要章节的结构性约束;C. 写完整详细设计约束 | B | 能避免重复架构,也能直接指导对象、接口、流程和状态机 | 已确认采用 B |
| 旧 Gate / Decision / Request 教学线索是否作为约束进入 §3 | A. 是;B. 否,只保留 Governance truth 和上游 / 相邻仓边界约束 | B | 教学线索不能反向定义概要主线,应后移到对象、流程和状态筛选 | 已确认采用 B |
| 配置是否可以改变 Gate / Decision、Policy / shared rules 或派生边界 | A. 可以;B. 不可以,配置只能影响参数和承载策略 | B | 配置若能绕过边界,会破坏架构主线和验收红线 | 已确认采用 B |

### 9.2 本 Step 未确认事项

本步不新增阻塞 Step 4 的待确认事项。具体代码主体框架如何拆分,将在 Step 4 独立收敛。

---

## 10. 进入下一步条件

- 已明确后续概要设计必须遵守的结构性约束。
- 每条约束都能影响后续代码主体、主要组成部分、关键对象、接口、处理流、状态机或配置判断。
- 未把上游架构全文复述为约束。
- 未写入详细设计实现策略、数据库约束、部署约束、协议 schema 或测试用例。
- 可以进入 Step 4“代码主体框架映射”。
