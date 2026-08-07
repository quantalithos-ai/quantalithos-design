# L2-tools 01 架构设计 Step 10: 关键技术选型

> 创建日期: 2026-08-04
> 状态: completed
> 当前模式: full-restart
> 对应 SOP: `standards/document/架构设计讨论流程_SOP.md` Step 10
> 正式文档回填位置: `01-架构设计.md` 第 11 章

---

## 1. 本步输入与目标

### 1.1 本步目标

从已经收稳的目标、运行承载、依赖、数据和交互结论中筛出真正上升为架构决定的技术机制,说明每项机制解决的问题、采用理由和必须承担的代价。这里选择的是结构性架构手段,不是语言、框架、数据库、消息产品、协议或实现组件。

### 1.2 输入与读取结论

| 输入 | 读取结论 | 本步约束 |
|---|---|---|
| Step 2 | 独立工具语义 owner、条件 seam、外部 truth 不复制、跨 carrier 单一语义、local-truth-first 是结构目标。 | 机制必须直接保护至少一项目标 / 硬约束,不能只提供局部便利。 |
| Step 6 | `R1/R2/R3` 与 `T1/T2/D1` 逻辑可分、允许物理共载。 | 可以选择职责分离机制,不能预选进程、数据库或消息产品。 |
| Step 7 | Core 是唯一 compile authority;其余 sibling 经 runtime/event 边界。 | 依赖倒置必须成为架构机制,不得用 sibling model 缩短实现路径。 |
| Step 8 | Truth/snapshot/reference/forbidden-body、消费时点和本地强一致 / 外部最终一致已闭合。 | 机制不能改变 owner;必须承接 ref 有效性、迟到材料和派生不反写。 |
| Step 9 | 同步正式裁定、异步事实 / 结果送达、后台派生维护已分层。 | 机制不能预定 HTTP、RPC、event、callback、queue 或 worker。 |
| 架构 SOP Step 10 / 书写规范 4.11 | 选型必须是架构机制,每项同时写问题、理由、代价和架构意义。 | 不展开完整备选路径比较;该内容留给 Step 11。 |

### 1.3 Step 内计划

- [x] 恢复 flow / ledger,确认只允许 Step 10。
- [x] 读取 SOP Step 10、书写规范 4.11 和 Step 2/6/7/8/9。
- [x] 用“是否改变结构、边界、一致性或交互主链”筛选候选机制。
- [x] 逐项写明问题、采用理由、真实代价和架构层意义。
- [x] 将具体产品、协议、实现和量化指标归入后移 / 不采用口径。
- [x] 审计开放 contract 不被机制名称伪装为 implementation-ready。

---

## 2. SOP 问题回答

### 2.1 当前采用哪些关键架构机制

当前采用十一项机制:

1. 正式语义承接边界。
2. 依赖倒置与 Core shared-contract authority 基线。
3. Truth / snapshot / reference / forbidden-body 四层分离与消费时点锚定。
4. Canonical invocation / result / error 跨 caller/carrier 单一语义。
5. Admission / no-execution 与条件化执行前置同步收口。
6. Sandbox execution source 到 normalized outcome 的语义适配边界。
7. Local outcome / audit first 与外部 handoff 状态分离。
8. 同步核心裁定、异步事实 / 结果送达、后台派生维护分离。
9. Safe material 四项合取门禁。
10. 显式演进、幂等、顺序与迟到材料新事实机制。
11. `S1` 正式演进支撑与 `S2/S3` 只读检测 / 派生分权。

### 2.2 每个机制解决什么问题

这些机制分别防止外部模型直接侵入核心、非 Core sibling 源码耦合、外部 truth / 正文复制、caller/carrier 合同分叉、执行前置被异步或默认放行绕过、Sandbox capture 冒充工具结果、delivery/observation 反写本地终态、全同步 / 全异步两类伪闭环、安全材料泄漏、迟到 / 重复材料穿越改写历史,以及演进 owner 悬空或派生反写核心。

### 2.3 为什么不采用相邻思路

不采用外部入口 / sibling model 直达核心、本地 registry/allowlist/self-authorization、caller/carrier 私有合同、Sandbox capture 即 result、全同步等待所有外部 owner、全异步 invocation 主线、派生修复核心和“加密后正文可交接”等思路。它们虽然可能减少边界转换或局部开发成本,但会直接破坏正式 00 已确认的 truth owner、fail-closed、no-bypass、forbidden-body 和 local-truth-first 约束。

### 2.4 每个选型带来什么代价或风险

共同代价是边界数量增加,需要维护 snapshot/ref 有效性、消费时点、stale/conflict/gap、多 owner attribution 和异步传播状态;开放 seam 下会出现受控拒绝、挂起或不可用;后续 `02~07` 还必须定义具体 contract、mapping、route、配置和验证边界。机制降低 truth 污染和串仓风险,但提高了语义映射、追溯、对账、错误解释和后续落码设计成本。

### 2.5 当前阶段必要与暂不引入

| 类别 | 当前口径 |
|---|---|
| 当前必要 | 十一项机制均直接保护 owner、依赖、数据、一致性或交互主链,必须成为后续设计红线。 |
| 当前不硬化 | 语言、框架、进程拓扑、数据库、缓存、消息产品、搜索产品、协议、API、DTO、event、topic、callback、错误码、配置 key、具体幂等算法、重试 / DLQ / replay 机制和量化指标。 |
| 当前不可宣称 ready | Authorization owner/result carrier、Sandbox mapping/material carrier/receipt、Observability producer/source/route、Core Tools-specific schema/package 和 SDK client。 |

---

## 3. 旧材料诊断

| 旧选型 / 技术线索 | 问题 | 当前处理 |
|---|---|---|
| Python monorepo、Runtime 同进程 import | 把语言、代码组织和部署偶然性当架构决定。 | 不继承;只保留正式 runtime consumption boundary。 |
| Builtin / MCP Client / Sandbox executor 三态 | 按实现 / carrier 分叉合同并吸收 provider / execution truth。 | 不继承;使用 canonical semantics 与条件 seam。 |
| 本地 registry / allowlist / policy cache | 复制 Hub truth或形成 self-authorization。 | 禁止;只消费 controlled ref/summary,不可验证即 fail closed。 |
| 固定 RPC / HTTP、事件名、topic、错误码 | 预支后续协议和 schema,并把旧接口当当前事实。 | 全部后移到概要 / 详细设计。 |
| 数据库、缓存、队列、outbox、worker、replay | 从旧实现反推承载和补偿机制。 | 只保留逻辑承载、最终一致和正式重入,不锁产品 / 实现。 |
| 旧 P95/P99/QPS/SLA/覆盖率 | 缺当前负载模型、测量对象和 evidence authority。 | 不继承;后续测试 / 验收在真实依据下闭口。 |
| 旧 ADR-0005/0009 | 旧定位下的决策编号和结论。 | 不继承;当前 ADR 编号均为未建立。 |

---

## 4. 设计取舍

### 4.1 什么够格进入本步

只有会改变外部输入如何进入核心、跨仓依赖如何隔离、数据关系如何成立、关键交互如何承接或历史事实如何保持稳定的机制进入主表。某个数据库、协议、库或进程即使未来很重要,只要它仍是既定架构的实现载体,就不在本步定稿。

### 4.2 机制与前序章节的关系

主表不是重复 Step 7~9 的规则清单,而是解释“为什么要采用这些结构性手段以及愿意承担什么成本”。例如 Step 9 已判定三类通信方式,本步则把三类路径逻辑分离确认为后续实现不得合并的技术机制;Step 8 已判定四类数据,本步则确认其隔离和消费时点是后续模型必须实现的架构手段。

### 4.3 开放 seam 不等于未做选型

Authorization、Sandbox、Observability、Core 和 SDK 的具体合同开放,不妨碍先选择 fail-closed、semantic adapter、formal carrier、ref/snapshot 和 local-truth-first 机制。相反,这些机制规定了合同闭口时必须满足的方向。机制成立不表示任何 schema、route、receipt、client、实现或 readiness 已存在。

---

## 5. 结构化中间产物

### 5.1 关键技术机制表

| 技术机制 | 解决的问题 | 采用理由 | 代价 / 约束 | 说明 |
|---|---|---|---|---|
| 正式语义承接边界 | Caller、carrier 或外部 owner 模型直接侵入 `A1~A5/S1`。 | 所有输入先转为 L2 可验证的受控语义,由正式 owner 决定是否形成 truth。 | 增加边界转换、拒绝 / gap 解释和后续 contract 设计成本。 | 改变外部输入进入核心的结构,不是 handler 或 endpoint 实现。 |
| 依赖倒置与 Core shared-contract authority 基线 | Sibling 源码耦合、模型泄漏和多套共享合同。 | 只有 Core 可为 compile authority;Hub/Sandbox/Runtime 用 runtime seam,Bus/Observability 用 event seam。 | 正向 contract 未闭口时必须 blocked/gap,不能借 sibling model 快速落码。 | 直接保护全局层级和 package dependency 红线。 |
| 四层数据分离与消费时点锚定 | 本地存在被误读为本地拥有,迟到外部变化改写历史。 | Truth、snapshot、reference、forbidden body 的权利不同,调用必须能解释当时消费依据。 | 需要维护 stale/missing/conflict、来源有效性、时点解释和重建状态。 | 同时影响数据模型、一致性、审计和交互承接。 |
| Canonical invocation / result / error 单一语义 | Runtime、direct caller、Sandbox、adapter 或未来 SDK 各建私有合同。 | 工具行动必须跨 caller/carrier 保持同一受理、无执行、成功和失败语义。 | 每类入口 / carrier 都必须证明语义映射,不能直接沿用私有 schema。 | 改变全链合同形态,不等于已定义 DTO。 |
| Admission / no-execution 与条件化执行前置同步收口 | 未受理、未授权或不满足隔离要求的调用进入真实执行。 | 真实执行前即时形成 L2 判断;authorization 不可验证 fail closed,sandbox-required 不旁路。 | 开放 owner / 依赖失效时会产生受控拒绝、挂起或不可用。 | 保护执行前红线,不固定每次调用的完整时序。 |
| Sandbox source-to-outcome 语义适配边界 | Capture、provider response、execution failure 或 receipt 直接冒充工具终态。 | Sandbox 保留 execution truth,L2 只从可信 source ref 形成 normalized outcome/audit。 | Mapping/source/carrier/receipt 未闭口时不能声明正向执行链 ready。 | 这是跨 owner 语义转换责任,具体 mapping 后移。 |
| Local outcome / audit first | Bus delivery、Observability observation 或下游消费反写本地终态。 | 本地 outcome/audit 先成立,外围交接只形成 attempt/degradation/gap 和外部摘要。 | 需要最终一致、额外追踪和对账;不存在端到端伪事务。 | 改变事实提交与外部协作的结构边界。 |
| 同步裁定、异步送达 / 传播、后台派生分离 | 全同步拖重主链,全异步丢失执行前裁定,后台成为隐式写源。 | 三类路径分别保护即时判断、跨 owner 解耦和外围可重建性。 | 三类延迟、失败、挂起和恢复语义都必须独立可解释。 | 逻辑可分但允许同部署,不预选 queue/worker。 |
| Safe material 四项合取门禁 | Raw/secret/高敏正文借审计、观测或交接名义外泄。 | 外发必须同时满足 minimal necessary、body-free、redacted、correlated。 | 任一不满足即禁止交接,增加资格判断、脱敏和关联审查成本。 | 无“已加密”或“仅审计”例外,不预定具体算法。 |
| 显式演进、幂等、顺序与迟到材料新事实机制 | 重复维护 / 送达制造第二 truth,迟到变化穿越覆盖既有调用 / outcome。 | 重复同语义不产生新 truth;有效变化、重评和迟到材料只形成显式新事实 / snapshot / ref / gap。 | 需要稳定身份、冲突口径、顺序依据和更复杂的历史查询解释。 | 保护合同与 invocation-bound 历史,不定版本字段或算法。 |
| `S1` 正式演进支撑与 `S2/S3` 只读分权 | 演进 truth owner 悬空,或检测 / 派生直接修正核心。 | `S1` 经 `F/K/A1` 同一不变量承接演进影响;`S2/S3` 只检测、报告、组装和派生。 | 维护发现问题必须重入正式边界,不能就地修复,路径更严格。 | 这是写权和运行承载的结构性分离。 |

### 5.2 当前不采用 / 后移口径表

| 当前不采用或不硬化的口径 | 原因 | 正确落点 |
|---|---|---|
| 本地 capability registry / allowlist / authorization fallback | 会复制 Hub truth或形成 self-authorization。 | 禁止;只能走正式 source/ref 与 fail-closed。 |
| Raw request/capture/provider body 复制 | 违反 forbidden-body 和 owner 边界。 | 只形成合同允许的 normalized semantics / safe summary / ref。 |
| Sandbox capture/provider response 直接作为 result | 会迁移 execution truth并形成多义终态。 | 后续 semantic adapter mapping,当前保持 blocked。 |
| 全同步等待 Hub/Auth/Sandbox/Bus/Observability | 形成跨 owner 伪事务并让外围故障阻塞核心。 | Step 9 已收敛的条件同步 + 异步 / 后台分层。 |
| 全异步 invocation / admission 主线 | 无法保证真实执行前即时拒绝与 no-execution。 | 同步正式裁定。 |
| Runtime、Hub、SDK、inventory 或 provider 主导工具合同 | 会把相邻职责和生命周期带入 L2。 | 只经正式消费边界引用 L2 合同。 |
| 具体语言、框架、数据库、缓存、消息 / 搜索产品 | 当前缺实现约束,且产品不能反向定义语义。 | `02/03/04/07` 在架构红线内选择。 |
| 具体 API/DTO/event/topic/callback/error code | 属于后续协议与对象设计,开放 seam 也未闭口。 | `02/03` 及相关上游合同。 |
| 具体 retry/DLQ/replay/outbox/worker/幂等算法 | 属于失败恢复和承载实现。 | `02~05/07`,不得改变正式重入与 owner。 |
| P95/P99/QPS/SLA/百分比和证据别名 | 当前无正式负载、测量对象和 evidence authority。 | `05/06/07` 基于真实输入闭口。 |

### 5.3 机制与来源追溯

| 机制范围 | 主要前序来源 | 保护的需求结论 |
|---|---|---|
| 正式承接 / 依赖倒置 | Step 2、Step 7、正式 00 §2/§6/§12 | `ARB-L2T-001`;`HC-L2T-001~002`;`DB-L2T-001~008`。 |
| 四层数据 / 消费时点 / 新事实机制 | Step 8、正式 00 §11/§13 | `DR-L2T-001~034`;`NFR-L2T-014~016`。 |
| Canonical semantics / admission / 条件前置 | Step 2、Step 9、正式 00 §7/§10 | `FR-L2T-007~013`;`BR-L2T-016~031`。 |
| Sandbox semantic adapter / local-truth-first | Step 8~9、正式 00 §7/§10~13 | `FR-L2T-013~017`;`BR-L2T-028~042`;`DR-L2T-025~034`。 |
| 三类路径 / safe material 门禁 | Step 9、正式 00 §12~13 | `IB-L2T-001~019`;`NFR-L2T-003`;`NFR-L2T-007~013`。 |
| `S1` 与 `S2/S3` 分权 | Step 5、Step 7~9 | 合同显式演进、派生不反写、外围不阻塞核心。 |

### 5.4 技术边界说明

本章选择的是后续设计必须实现的架构机制,不是技术 inventory。机制名称即使包含“同步”“异步”“适配”或“幂等”,也只固定结构责任和失败语义,不授权任何协议、产品、对象或算法。开放上游 seam 仍可由这些机制约束,但在正式 contract 闭口前不能据此声称 ready。后续产品选型若改变 truth owner、依赖类型、forbidden-body、fail-closed、canonical semantics 或 local-truth-first,应判定为违反本章而不是实现自由。

---

## 6. 回填草稿

正式 01 第 11 章使用 §5.1 关键技术机制表、§5.2 当前不采用 / 后移口径表和 §5.4 技术边界说明。正式章不重复完整来源追溯表,但每项机制必须保留真实代价,并明确具体技术栈 / 产品 / 协议 / 指标尚未选择。

---

## 7. 待确认事项

本步无新增 blocker。`L2T-UP-001~009` 不阻塞机制选择,但继续阻塞受影响 schema、mapping、carrier、receipt、route、client、量化验证和 implementation-ready 声明。产品和协议后移是事实纪律,不是这些 blocker 已解决的证据。

---

## 8. 自检与门禁

| 检查项 | 结果 |
|---|---|
| 每项是否解决架构层问题 | pass |
| 每项是否写明采用理由和真实代价 | pass |
| 每项是否影响结构、边界、一致性或交互主链 | pass |
| 是否区分机制与产品 / 实现载体 | pass |
| 是否没有展开完整备选方案对比 | pass |
| 是否保留开放 contract 和 readiness blocker | pass |
| 是否避免技术栈、协议、部署和量化指标硬选型 | pass |

```text
current_step = Step 10 technology_choices completed
gate_status = pass
gate_reason = eleven architecture-level mechanisms have explicit problems, reasons, costs and non-adoption boundaries without product or readiness claims
next_allowed_action = create_and_complete_01_arch_step_11_alternatives_tradeoffs
formal_document_write_allowed = false
commit_required = false
```
