# L2-tools 01 架构设计 Step 12: 横切关注点

> 创建日期: 2026-08-04
> 状态: completed
> 当前模式: full-restart
> 执行模式: single_agent_serial
> 对应 SOP: `standards/document/架构设计讨论流程_SOP.md` Step 12
> 正式文档回填位置: `01-架构设计.md` 第 13 章

---

## 1. 本步输入与目标

### 1.1 本步目标

把安全边界、审计与可追溯、可观测性、韧性 / 恢复能力、性能 / 容量约束、配置与变更控制收敛为长期作用于 L2 工具行动契约主线的架构约束。每项约束必须说明作用范围、要求和保护目标,并按 `A1~A5`、`S1~S3`、`P1~P6` 判断重点适用性,不得退化成通用 NFR 清单、实现手册或配置设计。

### 1.2 输入与读取结论

| 输入 | 读取结论 | 本步约束 |
|---|---|---|
| 正式 `00-需求文档.md` §13/§15 | `NFR-L2T-001~019` 已给出非量化判断口径;`R-L2T-001~012`、`Q-L2T-001~008` 和 `L2T-UP-001~009` 均开放。 | 不继承旧 SLA / 指标,不把 blocker 润色为已闭口。 |
| Step 2 | 独立 truth center、外部 owner 不复制、canonical semantics、fail-closed 和 local-truth-first 是硬约束。 | 横切项不得迁移 Runtime、Hub、authorization、Sandbox、Bus、Observability 或 SDK owner。 |
| Step 5 | 已收敛五核心语境、三支撑语境和六类影子边界。 | 必须逐架构单元判断重点适用性,不能把六类要求平均粘贴。 |
| Step 6~7 | `R1/R2/R3`、`T1/T2/D1` 逻辑可分;仅 Core 可为 compile authority,其余按 runtime / event seam。 | 横切项不得伪造物理部署、第四类依赖或 sibling package dependency。 |
| Step 8 | 四类数据、消费时点锚定、A4/A5 两类 attempt 和 local-truth-first 已定。 | 安全、追溯、韧性和配置变更必须服从 owner / 时点 / forbidden-write。 |
| Step 9 | 同步裁定、异步送达 / 传播、后台派生分离;外部材料进入 L2 后仍需正式受理。 | 可用性和性能不能把同步前置全异步化,恢复也不能允许后台直接写 truth。 |
| Step 10~11 | 十一项机制和分层主线已选定;具体产品、协议、指标和 readiness 未选。 | 横切项只压在既定主线上,不重新选方案或预支实现。 |
| 架构 SOP Step 12 / 书写规范 4.13 | 六类横切要求采用固定五列表,并要求单元停审和跨约束审计。 | 每项都要有适用原因、可审查口径和保护目标。 |
| 已完成项目 Step 12 | 已使用“主表 + 单元适用性 + 停审 + 跨约束审计”粒度。 | 只参考组织粒度,不复制其他仓的业务结论。 |

### 1.3 Step 内计划

| 模块 | 状态 | 产物 | 门禁 |
|---|---|---|---|
| 恢复与标准读取 | done | §1 输入结论 | 只允许 Step 12。 |
| 横切类别先思考 | done | §2 问题回答、§3 取舍 | 六类均按本仓边界判断。 |
| 横切类别再写入 | done | §4.1~4.2 | 固定五列且不是 NFR 复印。 |
| 架构单元先思考 | done | §3.3 适用性原则 | 不机械平均分配。 |
| 架构单元再写入 | done | §4.3 | 14 个单元逐项停审。 |
| 横切项停审 | done | §4.5 | 六类适用、范围、目标和粒度通过。 |
| 跨横切约束审计 | done | §4.6 | 无 owner、数据、通信或配置冲突。 |
| 历史材料审计与回填 | done | §5~6 | 旧实现口径不回流。 |

---

## 2. SOP 问题回答

### 2.1 安全边界如何处理

安全首先保护 owner 和执行前红线,而不是附加一层泛化访问控制。外部输入必须经正式语义承接;Hub 可见性不能代替 authorization,正式授权来源不可验证时 fail closed,sandbox-required 不得转为宿主直跑。Raw caller / transport body、prompt、secret、credential、raw capture、provider body、高敏完整引用和 evidence 正文对全部 A/S/P 单元均为 forbidden body;外发材料必须同时满足 minimal necessary、body-free、redacted、correlated。

### 2.2 可观测性覆盖哪些正式对象和关键链路

本仓必须能稳定判断 tool identity / definition、binding、canonical invocation、admission / rejection、执行前置、Sandbox handoff attempt / gap、normalized outcome、Tool-domain audit 和 post-outcome submission attempt / gap。来源缺失、冲突、stale、不可验证、旁路企图、forbidden-body 进入以及多 owner 故障必须可发现且 owner 可辨。该要求不把 Observability store 拉入本仓,也不把 `observed`、`delivered` 或 Runtime checkpoint 升格为工具 truth。

### 2.3 可用性和韧性需要守住什么底线

不受影响的本地合同读取和核心事实不得因外围搜索、SDK、Bus 或 Observability 失效而整体失效;适用的 Hub、authorization 或 Sandbox 前置缺失时,只收束受影响路径并显式失败、拒绝、无执行、挂起或记录 gap。已成立本地 outcome / audit 不因外部送达失败回滚。异步 / 后台失败只能延后收敛、重建派生物或重新进入正式边界形成新事实,不能静默补造 truth 或直接驱动 Runtime retry / recovery。

### 2.4 性能预算如何给出口径

当前没有正式负载模型、测量对象或 evidence authority,因此架构层不写 P95/P99、QPS、SLA 或百分比。判断口径是:合同 / binding 基础读取、invocation、admission、执行前置和本地 outcome / audit 不被外围能力或外部 handoff 不必要地串入同步闭环;逻辑运行角色与状态承载必须可按真实证据拆分。任何优化不得牺牲合同正确性、来源验证、fail-closed、隔离不可旁路、追溯和四层数据边界。

### 2.5 配置如何管理,哪些配置不应散落

任何会改变 tool identity / definition 解释、binding 有效性、admission、authorization 消费、Sandbox-required、safe-material 资格、owner authority、依赖方向或核心 / 外围分界的控制输入,都必须通过相应正式边界形成显式、可追溯的新判断或变化,不能成为散落在 caller、worker、adapter、provider、部署环境或本地 allowlist 中的旁路开关。实现参数可以后续设计,但不能改变 owner、forbidden-body、canonical semantics、fail-closed 或 local-truth-first。不在本步定义 key、默认值、作用域、加载顺序、密钥载体或热更新机制。

### 2.6 审计与可追溯如何正式保证

任一已成立工具行动语义必须能够回链所用 identity / definition、适用 binding、invocation、admission / execution-precondition 判断、允许的 execution source ref、normalized outcome 和 Tool-domain audit。A4 的 Sandbox execution handoff attempt 与 A5 的 post-outcome safe-material submission attempt 分别按发生时点保留;外部 delivery / observation 摘要按消费时点另行关联。追溯依赖安全 ref / summary 和本地事实,不要求复制外部正文,也不以日志、event delivery 或 observation 代替正式审计。

### 2.7 哪些横切项不应机械照抄

通用身份权限制度、密钥轮换周期、告警阈值、日志字段、on-call 剧本、压测脚本、数据库备份、跨区域部署、具体 retry / DLQ / replay / outbox、配置 key 和审批流程都不直接进入本章。它们要么属于相邻 owner,要么属于 `02~07` 的实现、配置、测试和实施层。幂等 / 一致性仍是强约束,但在架构横切章中由审计时点、配置变更、恢复重入和 canonical semantics 共同承接,不另造第七个模板类别。

### 2.8 架构单元适用性如何判断

每个单元均受 owner 安全与追溯底线约束,但重点不同:`A1/A2` 保护长期合同和关系不分叉,`A3/A4` 保护执行前同步裁定和不可旁路,`A5` 保护终态 / 审计 / 外部交接分层,`S1~S3` 保护正式变化与只读写权分离,`P1~P6` 保护外部 owner、来源有效性和时点摘要。影子单元不因适用横切要求而获得外部 truth 写权。

---

## 3. 诊断与设计取舍

### 3.1 横切项不是 NFR 复印

正式 00 的 NFR 是判断来源,本步把其中持续压在多个边界、数据关系和交互方式上的要求重组为架构约束。例如 forbidden body 同时作用于 A3 输入、A5 outcome / audit、S3 派生和 P1~P6 影子,因此属于安全横切项;某个接口的时延目标当前既无测量基线也不跨主线,不应进入本步。

### 3.2 正确性与性能冲突的取舍

选择“正确且可解释的拒绝 / 降级优先”。不允许为了低延迟缓存 authorization allow、跳过 Sandbox、接受 stale/conflict source、把 admission 异步化或先交付后补审计。性能优化空间来自外围隔离、异步传播、后台派生、可重建投影和按证据拆分运行角色,而不是削弱核心门禁。

### 3.3 单元适用性原则

- 核心单元按其正式写权判断横切重点,不能以“全适用”替代具体边界。
- 支撑单元重点审查是否绕过正式重入、是否成为第二 truth、派生失败是否污染核心。
- 影子单元重点审查 authority、source、freshness / consumption time、forbidden body 和 owner attribution。
- `P3` 当前只有 owner-pending 逻辑位置,适用性结论不能伪造已有 authorization snapshot/ref。
- `P4` 和 `P6` 必须保持本地 attempt、外部 receipt / delivery / observation 分层。

### 3.4 配置边界取舍

架构层只固定“配置不能改变什么”和“行为性变化必须走哪里”,不提前设计配置模型。将关键行为控制输入视作普通部署参数会让 allowlist、carrier fallback、safe-material 例外或 owner override 绕过正式 truth;把所有运维参数都提升为合同变化又会过度约束实现。因此只把能改变架构不变量的输入纳入正式变更控制,其余参数后移至 `04-配置设计.md`。

---

## 4. 结构化中间产物

### 4.1 横切类别结论

| 横切类别 | 适用性 | 判断口径 | 不进入本步的内容 |
|---|---|---|---|
| 安全边界 | 强适用 | Owner 不迁移、执行前不旁路、forbidden body 无例外、外发四项合取。 | 权限制度、密钥脚本、具体加密 / 脱敏算法。 |
| 审计与可追溯 | 强适用 | 身份到终态及两类 handoff 的来源、时点、变化和 gap 可回链。 | 日志字段、审计存储产品、evidence 正文。 |
| 可观测性 | 适用 | 本地关键状态、边界异常、多 owner 故障和开放 seam gap 可判断。 | 告警阈值、dashboard、Observability store / route 伪事实。 |
| 韧性 / 恢复能力 | 强适用 | 受影响路径 fail closed;外围失败不回滚;恢复必须正式重入或重建派生。 | Retry / DLQ / replay / on-call 剧本、Runtime recovery。 |
| 性能 / 容量约束 | 适用 | 核心不被外围串行阻塞;正确性优先;可按证据拆分承载。 | 无来源量化指标、压测计划、容量参数。 |
| 配置与变更控制 | 强适用 | 改变不变量的输入必须显式进入正式边界,配置不得形成旁路 truth。 | 配置 key、默认值、文件格式、加载 / 热更新 / 密钥机制。 |

### 4.2 横切关注点约束表

| 横切关注点 | 作用范围 | 约束要求 | 保护目标 | 说明 |
|---|---|---|---|---|
| 安全边界:正式 owner 与输入承接不可绕过 | `A1~A5`、`P1~P6`、compile/runtime/event seam | 外部输入只经正式 authority/ref/safe summary 进入;Runtime、Hub、authorization、Sandbox、Bus、Observability、SDK、provider 均不得定义或反写工具 truth。 | 保护 L2 工具行动合同 owner 和全局依赖方向。 | 横切职责、依赖、数据和交互主线,不是单个入口鉴权。 |
| 安全边界:执行前置不可旁路 | `A3/A4`、`P2/P3/P4`、同步受理与条件执行交接 | Governed 场景只消费正式 authorization 结果且不可验证即 fail closed;sandbox-required 不得宿主直跑或静默换 carrier。 | 保护 no-execution、authorization owner 与 Sandbox isolation truth。 | 不建立本地 allowlist、policy fallback 或 effective decision。 |
| 安全边界:forbidden body 与安全外发 | `A3/A5`、`S2/S3`、全部 P 单元、异步 / 后台路径 | Raw/secret/external-owner body 不得进入 truth、snapshot、audit 或 handoff;外发必须同时满足 minimal necessary、body-free、redacted、correlated。 | 保护敏感正文、外部生命周期和审计 / 观测边界。 | “已加密”“仅诊断”或“仅审计”都不构成例外。 |
| 审计与可追溯:工具行动关键链回链 | `A1~A5/S1`、`T1/T2`、正式读取面 | 已成立事实必须可解释合同锚点、适用 relation、invocation、判断、source ref、outcome 及显式演进;缺口不能静默覆盖。 | 保护合同演进、调用终态和争议审查的历史解释。 | Tool-domain audit 不等于日志、Runtime checkpoint 或 observation projection。 |
| 审计与可追溯:多 owner 与时点分层 | `A2/A4/A5/S2`、`P2~P6`、同步 / 异步 / event seam | 外部来源、消费时点、本地判断、本地 attempt 与外部状态分别关联;迟到材料只形成新事实 / snapshot / ref / gap。 | 保护 owner attribution、invocation-bound 历史和 A4/A5 两类 attempt 分权。 | 不以 capture、receipt、delivery 或 observed 状态倒推本地终态。 |
| 可观测性:本地正式状态与边界异常可判断 | `A1~A5/S1/S2`、`R1/R2/R3`、正式读取 / 诊断面 | 关键状态、变化、拒绝、stale/conflict/missing/unverifiable、旁路企图和 forbidden-body 进入必须有本地可辨语境。 | 保护主线是否成立、为何未成立以及故障 owner 可定位。 | 约束的是可判断性,不指定日志、指标、告警或平台。 |
| 可观测性:外部协作缺口不伪装成功 | `A4/A5/S3`、`P4/P6`、Sandbox / Bus / Observability seam | Handoff / submission attempt、degradation、gap 与正式可用的外部摘要分别可判断;开放 mapping/receipt/route/readiness 不得写成成功。 | 保护外部协作边界和 blocker 事实可信性。 | Observability 逻辑消费目标不等于 direct producer 或 route ready。 |
| 韧性 / 恢复能力:条件前置故障隔离 | `A2~A4`、`P2~P4`、同步主链 | 必要输入异常只使适用路径失败、拒绝、无执行、挂起或暴露 gap;不受影响合同读取继续成立,未知不转为允许。 | 保护 truth 不污染并限制上游故障爆炸半径。 | Fail-closed 是受控收束,不是全仓不可用。 |
| 韧性 / 恢复能力:local-truth-first 与正式重入 | `A5/S2/S3`、`R2/R3`、`T2/D1`、event / 后台路径 | 外围失败不回滚 outcome/audit;派生可 stale/rebuilding/unavailable;重评 / 恢复只能形成新事实或重入正式同步边界。 | 保护核心提交边界、历史事实和恢复后的单一 truth。 | 不预定 retry、DLQ、replay、outbox 或 Runtime recovery。 |
| 性能 / 容量约束:核心与外围解耦 | `A1~A5`、`S2/S3`、`R1/R2/R3`、`T1/T2/D1` | 合同读取、invocation、前置和本地终态不等待搜索、报表、SDK、Bus delivery 或 Observability observation;三类角色保持逻辑可分。 | 保护行动主链不被外围放大并保留按证据拆分能力。 | 当前不声明进程数、吞吐、延迟或资源预算。 |
| 性能 / 容量约束:正确性门禁优先 | 所有同步判断、来源验证、safe-material gate 和跨 owner 适配 | 优化不得跳过来源验证、canonical mapping、fail-closed、隔离、审计或 forbidden-body;无法同时满足时保留正确拒绝 / 降级。 | 保护规模压力下架构不变量不被性能目标侵蚀。 | 量化目标须等正式测量对象和 evidence authority 成立。 |
| 配置与变更控制:行为性输入正式化 | `A1~A5/S1`、`P1~P6`、维护 / 部署 / adapter 边界 | 会改变合同解释、binding、admission、执行要求、安全资格、authority 或依赖方向的输入必须成为显式正式变化 / 判断;不得散落为旁路开关。 | 保护主线不被本地 registry、allowlist、fallback、owner override 或环境差异改写。 | 不把实现参数一律提升为业务 truth。 |
| 配置与变更控制:派生与外部状态不得反写 | `S2/S3`、`D1`、Hub/Auth/Sandbox/Bus/Obs 影子更新 | 刷新、对账、重建、外部反馈和配置变更若影响核心,必须重新进入对应正式 owner;不得原地修正 `T1/T2`。 | 保护写权分离、显式演进和可重复解释。 | 后续 `04` 可设计配置机制,但不得改变此写入方向。 |

### 4.3 按架构单元组织的横切适用表

| 架构单元 | 重点横切关注点 | 单元级约束 | 停审结论 |
|---|---|---|---|
| `A1` 工具合同身份与定义 | 安全、追溯、配置变更、性能 | Identity/current definition 只有一个正式解释;演进显式且可回链;实现、inventory、provider 或环境开关不得定义合同;稳定读取不依赖外围。 | pass:保护长期合同 owner,未指定字段或存储。 |
| `A2` Capability Binding | 安全、韧性、追溯、可观测 | 只拥有 body-free relation;Hub source stale/conflict/missing 时 fail closed;关系变化与消费依据可回链;不得本地 registry/allowlist 回退。 | pass:Hub truth 与本地 relation 分权清楚。 |
| `A3` 规范调用与受理 | 安全、性能、配置变更、追溯 | Raw caller/carrier body 不入 truth;canonical invocation 与 admission 在真实执行前同步收口;caller/carrier/config 不形成第二合同。 | pass:同步红线和跨 carrier 单一语义明确。 |
| `A4` 执行前置与条件交接 | 安全、韧性、可观测、追溯 | Authorization 来源不可验证即 fail closed;sandbox-required 不旁路;handoff attempt/gap 可判断且不冒充 accepted/receipt/run;P3 owner-pending 不伪造数据。 | pass:authorization 与 Sandbox owner 均未迁移。 |
| `A5` Outcome、审计与安全交接 | 安全、审计、可观测、韧性 | Execution material 经正式受理才形成 normalized outcome;Tool audit 与 outcome 同链可解释;safe material 四项合取;外部 failure/status 不回滚或反写。 | pass:终态、审计、本地 submission attempt 与外部状态分层。 |
| `S1` 合同演进与影响解释 | 追溯、配置变更、一致性 | 保存显式演进和兼容影响;更正 / 退役经 `A1` 同一不变量重入,不直接建立第二 current definition。 | pass:演进支撑有正式写权边界。 |
| `S2` 引用有效性与一致性维护 | 可观测、韧性、审计、性能 | 只形成检测 / 对账 / gap 报告;可延后运行;不得自动修正 binding、outcome 或外部 truth;来源和时点保持可辨。 | pass:维护不成为恢复写源。 |
| `S3` 受控读取与外围消费辅助 | 安全、性能、韧性、配置变更 | 派生 / safe-material 只读组装可 stale/rebuilding/unavailable;不裁决资格、不记录提交 truth、不保存正文、不阻塞核心。 | pass:外围可重建且无核心写权。 |
| `P1` Core 引用边界 | 安全、配置变更、追溯 | 只保存正式 authority/version ref;Tools-specific schema 未闭口时保持 gap;不得以本地类型或 sibling package 伪造 authority。 | pass:`L2T-UP-008` 保持开放。 |
| `P2` Hub 影子边界 | 安全、韧性、可观测、时点追溯 | Controlled summary/ref 按消费时点验证;不复制 registry/descriptor/exposure/applicability;可见性不等于 authorization。 | pass:Hub owner 和失败口径明确。 |
| `P3` Authorization 影子边界 | 安全、韧性、可观测、配置变更 | 正式 owner/source 未成立时只表达 missing/unverifiable gap;不得保存伪 snapshot/ref、生成 decision 或配置默认 allow。 | pass:`L2T-UP-001~002` 未被闭口。 |
| `P4` Sandbox 影子边界 | 安全、追溯、可观测、韧性 | Readiness/source summary 与 ref 按消费时点承接;不拥有 run/capture/receipt/cleanup;mapping/receipt 缺口显式。 | pass:`L2T-UP-003~004` 未被伪造。 |
| `P5` Caller/work/trace 引用边界 | 安全、追溯、一致性 | 只保留安全摘要和各 owner refs;不复制 plan/loop/checkpoint/recovery;不同 caller/carrier 不分叉 invocation 语义。 | pass:Runtime orchestration 未进入本仓。 |
| `P6` Bus/Observability 影子边界 | 安全、可观测、韧性、时点追溯 | Bus delivery 与 observation 分别承接;unknown / delayed / failed 不写成 delivered/observed;不保存外部 history/store/evidence 正文。 | pass:`L2T-UP-005~007` 保持开放且 owner 分离。 |

### 4.4 不进入本章的事项

| 事项 | 排除原因 | 正确落点 |
|---|---|---|
| 语言、框架、数据库、缓存、消息 / 观测产品 | 实现载体,不改变本章架构约束。 | `02/03/07`。 |
| API / DTO / event / topic / error code / log field | 协议与对象细节,且部分上游 seam 未闭口。 | `02/03` 及对应上游合同。 |
| 配置 key、默认值、作用域、优先级、热更新、secret carrier | 正式配置模型和运行机制。 | `04-配置设计.md`。 |
| 告警阈值、dashboard、值班和恢复操作 | 观测 / 运维实施方案。 | `04/05/07` 或相邻 owner 文档。 |
| P95/P99/QPS/SLA、百分比、覆盖率、replay 指标 | 无正式测量对象、基线与 evidence authority。 | `05/06/07` 有真实输入后定稿。 |
| Retry/DLQ/replay/outbox/worker/幂等算法 | 恢复和承载实现,且外部 receipt / route 未闭口。 | `02~05/07`。 |
| Agent loop、LLM planning、Runtime recovery | 明确属于 Runtime owner。 | `L2-runtime` 正式设计。 |
| Sandbox isolation / execution recovery、Observability store / recovery | 外部 owner truth。 | `L4-sandbox` / `L4-observability` 正式设计。 |

### 4.5 横切关注点停审记录

| 横切类别 | 适用于本仓主线 | 作用范围明确 | 判断口径可审查 | 未下沉实现 | 停审 |
|---|---|---|---|---|---|
| 安全边界 | 是,强适用 | 是:owner、输入、执行前置、正文和外发 | 是:禁止 / fail-closed / 四项合取 | 是 | pass |
| 审计与可追溯 | 是,强适用 | 是:合同到终态、多 owner 和两类 attempt | 是:来源、时点、变化、gap 可回链 | 是 | pass |
| 可观测性 | 是 | 是:本地状态、异常、外部协作缺口 | 是:状态和 owner 可判断但不造 observed | 是 | pass |
| 韧性 / 恢复能力 | 是,强适用 | 是:条件前置、外围、异步和后台 | 是:受控收束、local-truth-first、正式重入 | 是 | pass |
| 性能 / 容量约束 | 是 | 是:核心主链、外围与运行角色 | 是:不必要同步阻塞和正确性优先 | 是,未写数字 | pass |
| 配置与变更控制 | 是,强适用 | 是:不变量、authority、写权和影子更新 | 是:行为性变化显式进入正式边界 | 是,未写配置项 | pass |

### 4.6 跨横切约束审计表

| 检查项 | 结果 | 说明 |
|---|---|---|
| 模板化空话 | pass | 13 条主表约束均有具体作用范围、要求和保护目标。 |
| 架构单元适用性遗漏 | pass | `A1~A5/S1~S3/P1~P6` 共 14 单元均已差异化停审。 |
| Owner 迁移 | pass | Runtime、Hub、authorization、Sandbox、Bus、Observability、SDK 和 provider truth 均未进入 L2。 |
| 安全与数据边界冲突 | pass | 四类数据、forbidden body、P3/P4/P6 特别口径保持一致。 |
| 审计追溯缺口 | pass | 合同到 outcome、A4/A5 attempt、多 owner 来源和消费时点均有承接。 |
| 可观测性反写 truth | pass | 可见性只判断 L2 状态 / gap,不把 observation、delivery 或 checkpoint 作为 truth。 |
| 韧性与通信方式冲突 | pass | 同步前置未被全异步化;异步 / 后台恢复必须正式重入或重建派生。 |
| 性能牺牲硬边界 | pass | 明确正确性、来源验证、fail-closed、隔离和追溯优先。 |
| 配置旁路 | pass | Owner override、allowlist、carrier fallback 和 safe-material 例外均不得由配置产生。 |
| 配置设计越界 | pass | 未写 key、默认值、加载、作用域、密钥或更新机制。 |
| 实现 / 运维下沉 | pass | 未写产品、脚本、日志字段、告警、恢复剧本、压测或部署参数。 |
| 量化伪事实 | pass | 未继承旧 SLA / 百分比 / 时延 / QPS / replay 指标。 |
| Blocker 伪闭口 | pass | `L2T-UP-001~009` 均保持开放,无 schema、mapping、receipt、route、client 或 readiness 声明。 |

### 4.7 横切影响说明

这些横切要求必须进入架构层,因为它们同时约束核心写权、外部输入、数据归属、三类通信和运行承载,留到实现或运维阶段会允许旁路改变主线。它们只规定长期不可破坏的边界和判断口径,不替代安全制度、监控方案、恢复手册、配置设计或性能测试。幂等与一致性通过显式变化、消费时点、正式重入和 canonical semantics 贯穿六类约束,不额外扩张模板。开放上游 seam 仍按 gap / fail-closed 承接,本章通过不表示任何正向集成已经 ready。

---

## 5. Historical material 差异审计

| 旧口径 | 当前裁决 |
|---|---|
| 本地 registry / inventory / allowlist 作为安全与配置中心 | `historical_conflict`:会复制 Hub / authorization truth并允许配置旁路。 |
| In-process / sandbox / MCP 三态 executor 与自动 fallback | `historical_conflict`:carrier 不得改变合同语义,sandbox-required 不得静默降级。 |
| Raw capture/provider response 进入 ToolResult / audit | `historical_conflict`:违反 execution truth、normalized outcome 与 forbidden-body 分层。 |
| 固定 ToolInvoked/Completed/Failed、错误码、日志字段和告警 | `historical_material`:具体合同 / 观测实现未在当前架构闭口。 |
| `100%`、`99.9%`、`99.95%`、P95/P99、replay 成功率 | `historical_material`:无当前测量对象、基线或 evidence authority。 |
| Bus delivery / Observability observed 驱动本地完成或 Runtime recovery | `historical_conflict`:外围状态不得反写 outcome/audit 或编排 Runtime。 |
| 共享数据库 / 单事务解决跨仓一致性 | `historical_conflict`:跨 owner 采用 ref/snapshot、时点锚定和 local-truth-first。 |

---

## 6. 回填草稿

正式 01 第 13 章使用 §4.2 固定五列横切关注点约束表和 §4.7 横切影响说明。正式章按需要增加轻量主线映射,但不复制 §4.3 单元停审与 §4.6 审计过程;这些表作为校准来源保留。正式章必须保留以下去歧义:可观测不等于 Observability owner,恢复不等于 Runtime recovery,配置控制不等于本章已定义配置项,性能口径不等于已有量化目标。

---

## 7. 待确认事项

本步无新增上游 blocker。`L2T-UP-001~009` 不阻塞横切架构约束成立,但分别继续阻塞 authorization owner/source/taxonomy、Sandbox mapping/receipt/feedback/cleanup、Observability producer/source/route/readiness、Core Tools-specific contract、SDK client seam 和量化验证。任何受影响的 `02~07` 设计只能在 owner 闭口后形成正向合同,或保持显式 blocked / fail-closed 边界。

---

## 8. 自检与门禁

| 检查项 | 结果 |
|---|---|
| 六类横切类别是否逐项判断 | pass |
| 固定五列表是否写清范围、要求、目标和说明 | pass |
| 是否覆盖 14 个架构单元并逐项停审 | pass |
| 是否完成跨横切约束审计 | pass |
| 是否与 Step 8 数据和 Step 9 通信语义一致 | pass |
| 是否避免 NFR 复印、模板空话和实现手册 | pass |
| 是否避免配置设计、量化指标和 readiness 伪事实 | pass |
| 是否保留全部开放 blocker | pass |

```text
current_step = Step 12 cross_cutting_concerns completed
gate_status = pass
gate_reason = six cross-cutting categories have concrete mainline constraints, fourteen architecture units passed applicability review, and the cross-constraint audit found no unresolved ownership, data, interaction or configuration conflict
next_allowed_action = create_and_complete_01_arch_step_13_evolution_path
formal_document_write_allowed = false
commit_required = false
```
