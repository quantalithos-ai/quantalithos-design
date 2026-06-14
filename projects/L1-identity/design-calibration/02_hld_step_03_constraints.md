# Step 3. 收稳约束条件

> 对应 SOP: `standards/document/概要设计讨论流程_SOP.md` Step 3
> 回填章节: `02-概要设计.md` §3 约束条件
> 生成日期: 2026-06-11
> 状态: 已完成,等待用户审核

---

## 1. Step 状态 + Step 内计划

| 计划项 | 状态 | 产物位置 |
|---|---|---|
| 读取 Step 1~2、`00` 业务规则 / VETO、`01` 架构约束 / 技术机制 / 横切关注点 | 已完成 | §2 |
| 回答 Step 3 SOP 问题 | 已完成 | §3 |
| 诊断旧 Step 3 与当前材料的差距 | 已完成 | §4 |
| 比较改动前后口径 | 已完成 | §5 |
| 记录采用 / 不采用的设计取舍 | 已完成 | §6 |
| 输出约束条件表、门禁表、非约束项和高风险串线点 | 已完成 | §7 |
| 判断本 Step 是否需要拆分 | 已完成 | §8 |
| 形成正式 `02` §3 回填草稿 | 已完成 | §9 |
| 列出待确认事项和进入下一步条件 | 已完成 | §10~§11 |

---

## 2. 本步输入

| 输入 | 当前状态 | 本步用途 |
|---|---|---|
| `02_hld_step_01_upstream_boundary.md` | 已完成并已获用户认可 | 提供本文不再回答 / 必须回答和输入风险 |
| `02_hld_step_02_goals_scope.md` | 已完成并已获用户认可 | 提供设计目标、范围、非范围和深度口径 |
| `projects/L1-identity/00-需求文档.md` §10 / §11 / §14 / §15 | 当前需求输入 | 提供业务规则、数据归属、VETO 和待确认事项 |
| `projects/L1-identity/01-架构设计.md` §3 / §4 / §8 / §9 / §10 / §11 / §13 | 当前架构输入 | 提供硬约束、职责边界、依赖裁剪、数据 ownership、交互方式、技术机制和横切约束 |
| `standards/document/概要设计讨论流程_SOP.md` | 最新流程标准 | 规定本 Step 只收会影响概要结构的硬约束 |
| 旧 `02_hld_step_03_constraints.md` | legacy draft | 只作为诊断输入,不得直接继承为新版结论 |

---

## 3. SOP 问题回答

### 3.1 哪些约束会直接影响本仓对象、接口、处理流或状态机设计?

直接影响后续结构的约束包括:

- 平台级成员身份 truth center 约束:对象和 flow 必须围绕成员身份主语,不能被账号、ProjectMember、runtime 或 UI profile 替代。
- 身份引用稳定且不复用约束:对象、状态和异常边界必须支持 tombstone / retired 后仍不可复用。
- command / query 分离约束:读取、投影、对账和消费不得隐式创建、修复或刷新 truth。
- truth / snapshot / reference / report / forbidden body 分离约束:对象候选和接口 payload 必须先分类,不能混合外部正文。
- 外部来源正式承接层约束:method / work / governance / archive / observability 输入必须先收束为 ref、snapshot、basis、marker 或 reject。
- 依赖裁剪约束:除 `L0-core` 外,相邻业务仓不得成为源码依赖;后续接口只能通过 runtime adapter、event、handoff 或 ref 协作。
- accepted fact 最终一致传播约束:下游消费、event delivery 或 handoff 失败不得回滚已接受 identity truth。
- append-only trace / career 约束:生涯和关键变化追溯不能原地改写。
- report-only maintenance 约束:projection rebuild、reference refresh 和 reconciliation 不能修复相邻仓 truth。
- 显式失败 / 降级约束:pending、stale、unavailable、degraded、not visible、duplicate、missing basis、handoff failed 等必须进入状态或异常轮廓。
- 配置不可越界约束:配置只能选择正式允许的运行行为,不能改变 ownership、正文排除、query no-write、report-only 或 phase boundary。

### 3.2 哪些约束来自需求文档,哪些来自架构设计或全局设计?

需求文档提供业务红线:身份引用不复用、查询不得创建、生命周期必须显式变化、高风险处置必须有依据、RoleDefinition / ProjectMember / memory body 等不得入仓、生涯 append-only、维护对账不得修复相邻仓 truth、VETO 不得通过。

架构设计提供结构性机制:identity truth center、正式承接层、typed refs / source marker、truth / snapshot / reference / forbidden body separation、query no-write、eventual accepted fact propagation、report-only maintenance、reference-only external content boundary、dependency inversion、横切安全 / 可见性 / 可追溯 / 韧性 / 配置变更控制。

本 Step 只把这些上游结论转译为后续概要章节门禁,不重新裁定来源结论。

### 3.3 哪些边界如果不先写清,后续最容易串到相邻仓或详细设计?

最容易串线的边界是:

- `GlobalMember` 与 `ProjectMember` / work truth。
- 全局 lifecycle 与 runtime availability / task state。
- role / capability summary 与 RoleDefinition / CapabilityDefinition 正文。
- career append record 与 Project / WorkItem / ProjectMember truth。
- memory refs / archive refs 与 memory body / embedding / archive package。
- governance basis ref 与 Gate / Policy / Approval / Control truth。
- query / projection / report 与 command truth write。
- event propagation / outbox / handoff 与 accepted truth transaction。
- maintenance / reconciliation 与跨仓修复。
- actor / operator / account / credential 与成员身份主语。

这些边界必须在 Step 4~11 持续作为门禁使用,否则后续对象和 flow 很容易为了“方便实现”引入相邻仓 truth 或详细 schema。

### 3.4 哪些约束只是泛化工程原则,不应进入本章?

不进入本章的泛化工程原则包括:

- “代码要模块化”“接口要清晰”“错误要处理”“日志要记录”等普通工程原则。
- 数据库外键、唯一索引、分区、缓存、队列、搜索引擎、部署平台等技术产品约束。
- 具体 P95、容量、SLO、retry 次数、timeout、batch size、topic name、profile name。
- 测试用例、验收 evidence、实施 commit boundary。
- 完整安全策略、权限模型、认证协议和 UI 展示规则。

这些内容要么属于 `03/04/05/06/07`,要么属于相邻仓,不能在概要约束章节提前写成当前 `02` 的结构约束。

### 3.5 每条约束是否能指导后续章节的设计判断?

本 Step 只保留能直接影响以下判断的约束:

- Step 4 代码主体框架如何分层。
- Step 5 主要组成部分是否越界。
- Step 6 对象是否属于 identity,是否保存 forbidden body。
- Step 7 接口是 command、query、event、job 还是外部接缝。
- Step 8 flow 是否混淆 accepted truth、传播、派生、对账和修复。
- Step 9 状态是否覆盖 pending / stale / degraded / failed 等中间态和失败态。
- Step 10 异常是否覆盖 VETO 和高风险串线场景。
- Step 11 配置是否越过 truth ownership 和依赖裁剪。

---

## 4. 当前材料 / 旧文档问题诊断

| 旧材料 / 倾向 | 问题 | 本轮处理 |
|---|---|---|
| 旧 Step 3 已列约束,但没有完整 Step 内计划、诊断和取舍 | 不符合最新版中间产物结构 | 重写为完整 Step 文件 |
| 旧 Step 3 部分约束以机制名表达,缺少来源和后续门禁 | 后续 Step 不容易判断约束如何使用 | 本轮增加来源、影响章节和负例 |
| 旧 Step 3 将“产品中立”等泛化限制列入同一层级 | 容易混淆结构性硬约束和文档写作纪律 | 本轮拆出“非约束项 / 后移项” |
| 旧 Step 3 没有显式列出 actor / account / member identity 串线风险 | 认证和操作者上下文容易被误当成员 identity | 本轮纳入高风险串线点 |
| 旧 Step 3 没有强调未闭口项不能变成假约束 | source / basis / visibility / threshold 可能被后续提前定死 | 本轮明确只保守约束边界,不补具体 schema |

---

## 5. 改动前后对比

| 项 | 改动前 | 改动后 |
|---|---|---|
| 约束粒度 | 约束表可读,但缺少来源和使用门禁 | 每条约束带来源、影响章节和典型禁止方向 |
| 非约束内容 | 与结构约束混在一起 | 单独列出不进入本章的泛化工程原则和详细设计项 |
| 串线风险 | 主要靠约束表隐含 | 明确列出高风险串线点 |
| 后续使用方式 | 后续章节自行理解 | 建立 Step 4~11 门禁映射 |
| 未闭口事项 | 易被范围吸收 | 明确只能保守约束,不写具体协议 / schema / 阈值 |

---

## 6. 设计取舍

| 方案 | 结论 | 理由 |
|---|---|---|
| 把 `00` 业务规则和 `01` 架构约束全文搬入本 Step | 不采用 | 会复述上游,不利于后续概要章节使用 |
| 只保留短约束清单 | 不采用 | 缺少来源、门禁和反例,后续仍可能串线 |
| 按“约束来源 + 影响章节 + 禁止方向”组织 | 采用 | 能直接服务 Step 4~11,也能防止详细设计和实现脑补 |
| 将 source / basis / visibility 等未闭口事项写成详细规则 | 不采用 | 违反 Step 2 深度口径,会提前进入 `03` |
| 将配置、性能、测试等详细事项作为约束写入 | 不采用 | 当前只保留不可越界口径,具体项后移 `04/05/06/07` |

---

## 7. 结构化中间产物

### 7.1 约束条件表

| 约束 | 来源 | 说明 | 影响章节 | 典型禁止方向 |
|---|---|---|---|---|
| Identity truth center 约束 | `C-ID-1`~`C-ID-5`, `ADR-ID-ARCH-001` | 平台级成员身份主语是本仓中心,后续结构必须证明 identity 拥有成员身份 truth | Step 4~9 | 用账号、token、runtime instance、ProjectMember 或 display name 替代成员身份 truth |
| 身份引用稳定且不复用约束 | `BR-ID-001`, `VETO-ID-001` | 成员 identity ref 建立后长期稳定,墓碑化 / 退役后也不得复用 | Step 6 / 9 / 10 | 将删除、归档或重建解释成 ref 可复用 |
| Query / projection no-write 约束 | `BR-ID-002`, `VETO-ID-002`, 架构 query no-write | 读取、投影、report 和消费路径不得创建、刷新、修复或补写 truth | Step 7 / 8 / 10 | query not found 时自动建档,projection rebuild 修复 truth |
| 显式 command write 约束 | `BR-ID-004`, `NFR-ID-003` | 创建、生命周期、角色能力、生涯和 memory refs 的 truth 变化必须来自受控意图、actor / reason / source / basis | Step 7 / 8 / 9 | 后台任务静默改变生命周期或身份主语 |
| 高风险 lifecycle basis 约束 | `BR-ID-005`, `VETO-ID-004`, `OQ-ID-002` | 高风险生命周期处置必须有正式授权 / 治理依据引用;当前不定义具体 basis schema | Step 6 / 8 / 9 / 10 / 12 | 缺依据仍 accepted,或把 Gate / Policy / Approval truth 纳入 identity |
| GlobalMember / ProjectMember 分层约束 | `BR-ID-006`, `BR-ID-011`, `ADR-ID-ARCH-002` | identity 拥有平台级成员身份和全局可用性;项目内承担和工作事实归 `L1-work` | Step 5 / 6 / 8 / 10 | 把 ProjectMember 状态、任务事实或项目分配写成 identity truth |
| Role summary / definition 分层约束 | `BR-ID-007`~`BR-ID-009`, `OQ-ID-001` | identity 只保存 role / capability 来源引用、安全摘要、证据和状态;定义正文与评估算法归 method-library | Step 5 / 6 / 7 / 8 / 10 | 保存 RoleDefinition body、方法内容或自动评估算法结果正文 |
| Career append-only 约束 | `BR-ID-010`, `ADR-ID-ARCH-008` | 生涯记录是身份侧追加历史,纠错也通过追加表达 | Step 6 / 8 / 9 / 10 | 改写、删除或重排已确认 career record |
| Memory / archive reference-only 约束 | `BR-ID-012`, `VETO-ID-003`, `OQ-ID-003` | identity 只保存 memory / archive refs、状态和 handoff marker,不保存正文、embedding、index 或 package | Step 5 / 6 / 7 / 8 / 10 | 为查询或迁移方便复制 memory body、archive package 或向量 |
| Truth / snapshot / reference / report / forbidden body 分离约束 | `00` 数据归属,架构 separation | 对象、接口、event、trace、report 必须先分类,禁止把外部正文或派生视图混入 truth | Step 5 / 6 / 7 / 8 / 10 | 一个对象同时承担核心 truth、外部正文和可重建 projection |
| 外部来源正式承接层约束 | `ADR-ID-ARCH-003`, dependency inversion | method / work / governance / archive / observability 输入必须经正式接缝收束为 ref、snapshot、basis、marker 或 reject | Step 4 / 7 / 8 / 12 | 直接依赖相邻仓 implementation 或从外部 private id 推导内部 truth |
| Typed refs / source marker 约束 | `ADR-ID-ARCH-004` | 跨仓 subject、source、scope、basis、visibility 不得靠字符串拼接或隐式解析 | Step 6 / 7 / 8 / 12 | 使用 `context:<id>`、路径片段或私有 ID 格式作为正式映射规则 |
| Accepted fact 最终一致传播约束 | `ADR-ID-ARCH-007` | 下游消费、event publish、handoff 或 projection 失败不能回滚 accepted identity truth | Step 7 / 8 / 9 / 10 | 同步 fan-out 成功作为 command accepted 前置条件 |
| Trace / audit / outbox 可追溯约束 | `BR-ID-014`, 架构审计与可追溯 | 关键变化必须有安全可见 actor、reason、source、basis、marker、trace ref 或 issue ref | Step 6 / 7 / 8 / 12 | 只保存最终状态,无法解释变化来源 |
| Report-only maintenance 约束 | `BR-ID-015`, `VETO-ID-005`, `ADR-ID-ARCH-009` | projection rebuild、reference refresh、reconciliation 只能重建派生、标记 stale / degraded 或生成 finding | Step 7 / 8 / 9 / 10 / 11 | 维护任务修复相邻仓 truth 或绕过 command 写 identity truth |
| 依赖裁剪约束 | `VETO-ID-006`, `ADR-ID-ARCH-010` | 除 `L0-core` shared contracts 外,业务仓不得成为 identity 编译期依赖 | Step 4 / 7 / 11 / 12 | 将 method / work / governance / archive implementation 引入 identity 业务源码 |
| 显式失败与降级 marker 约束 | 架构显式降级 marker,横切韧性 | not found、not visible、pending、stale、unavailable、degraded、duplicate、conflict、missing basis、handoff failed 等不得被润色为成功 | Step 7 / 8 / 9 / 10 | 来源不可用时返回完整成功摘要,投影 stale 时不暴露状态 |
| 可见性与安全裁剪约束 | `OQ-ID-004`, 架构 visibility / read safety | 查询、事件、trace、report 必须具备可见性 / redaction 轮廓;当前不定义字段级裁剪 schema | Step 7 / 8 / 10 / 12 | 不可见内容通过 debug、event 或 report 泄漏 |
| 性能结构约束 | `OQ-ID-005`, 架构性能口径 | 核心读取不得同步 fan-out 外部正文,accepted path 不等待下游消费;具体阈值后移 | Step 4 / 7 / 8 / 13 | 以旧 P95 或 sample 数字作为当前概要定论 |
| 配置不可越界约束 | 架构配置与变更控制,`OQ-ID-006` | 配置只能选择正式允许的 adapter、profile、timeout、retry、redaction、maintenance scope 等运行行为 | Step 11 / 12 | 配置改变 truth ownership、正文排除、query no-write、依赖裁剪或 phase boundary |

### 7.2 后续章节门禁表

| 后续章节 | 必须使用的约束 | 门禁判断 |
|---|---|---|
| Step 4 代码主体框架 | truth center、正式承接层、依赖裁剪、通信分层 | 代码主体是否保护核心语义,并把 command / query / event / jobs / adapters 分开 |
| Step 5 主要组成部分 | 数据归属、forbidden body、GlobalMember / ProjectMember、role / memory 分层 | 组成部分是否承担相邻仓 truth 或外部正文 |
| Step 6 关键对象 | truth / snapshot / reference / report / forbidden body,typed refs,append-only | 对象是否有明确归属和状态职责,是否暗含正文或隐式字符串规则 |
| Step 7 API / 接口骨架 | command/query separation、eventual propagation、依赖裁剪、visibility | 接口类别是否表达正确读写语义、传播语义和外部接缝 |
| Step 8 关键处理流 | accepted truth、trace / audit / outbox、report-only maintenance、显式失败 | 流程是否混淆核心成立、传播、派生、对账和修复 |
| Step 9 状态定义 | lifecycle、source state、projection state、handoff state、degraded marker | 状态是否覆盖中间态、失败态和非法方向 |
| Step 10 异常边界 | VETO、missing basis、forbidden body、duplicate、stale、handoff failed | 异常是否覆盖最容易打穿边界的路径 |
| Step 11 配置影响 | 配置不可越界、依赖裁剪、visibility、maintenance scope | 配置是否只影响运行选择,不改变业务 ownership 或阶段边界 |
| Step 12 详细设计承接 | 未闭口事项、typed refs、source / basis / visibility / cursor / transaction | 是否把概要无法闭口的可落码契约清楚交给 `03` |
| Step 13 风险与待确认 | `OQ-ID-*`、旧文档回流、性能阈值、配置旧稿 | 风险是否仍按后续闭口处理,没有被写成已完成 |

### 7.3 不进入本章的非约束项

| 不进入项 | 后移位置 | 原因 |
|---|---|---|
| 数据库表、索引、外键、事务隔离级别 | `03` | 属于持久化契约 |
| HTTP / RPC / event topic / queue 产品 | `03/04` | 概要只说接口类别和通信边界 |
| P95、容量、SLO、batch size、timeout、retry 次数 | `05/06/04` | 当前只有结构性性能和韧性约束 |
| 配置 profile、env key、CLI args、JSON 示例 | `04` | Step 11 只识别配置影响轮廓 |
| 测试 case、suite、artifact、evidence | `05/06` | 当前只提供约束和 VETO 来源 |
| 实施 commit boundary | `07` | 当前不拆实施计划 |
| 认证协议、权限策略、治理裁决对象 | 相邻仓 / `03` 接缝 | identity 只消费可信上下文和依据引用 |
| UI 展示规则和文案 | 产品层 / 消费方 | identity 只提供可见摘要和状态语义 |

### 7.4 高风险串线点清单

| 串线点 | 必须守住的概要判断 |
|---|---|
| account / actor / credential / member identity | actor 和 credential 可作为上下文或来源,不得等同成员 identity truth |
| GlobalMember / ProjectMember | identity 只拥有平台级成员身份;work 拥有项目内承担事实 |
| lifecycle / runtime availability | identity lifecycle 表达全局可用性;runtime 只表达执行承载状态 |
| role summary / RoleDefinition body | identity 保存摘要与来源;method-library 拥有定义正文 |
| career record / project truth | career 是身份侧追加历史;项目 truth 不被 identity 反向定义 |
| memory ref / memory body | identity 保存 ref 与状态;正文、embedding、index、package 不入仓 |
| governance basis / governance truth | identity 消费依据引用;不拥有 Gate、Policy、Approval、Control truth |
| projection / truth | projection 可 stale / rebuild;不得作为第二 truth |
| reconciliation / repair | reconciliation 发现问题;修复必须回到拥有 truth 的正式能力 |
| event propagation / accepted command | accepted truth 不等待下游全部消费成功 |

---

## 8. 复杂度判断 / 是否拆分

本 Step 只收约束条件和后续章节门禁,不拆主要组成部分附录。

约束数量较多,但它们会被 Step 4~11 按章节复用。当前不创建附录,避免在 Step 3 过早进入对象、接口或 flow 细节。后续 Step 若发现某类约束不足以支撑具体判断,应在对应 Step 记录回退需求,而不是在本 Step 预先展开详细契约。

---

## 9. 回填草稿

正式 `02-概要设计.md` §3 后续应回填:

1. 约束条件表。
2. 后续章节门禁表。
3. 不进入本章的非约束项。
4. 高风险串线点清单。

正式正文要等 Step 14 统一装配,当前不直接回填。

---

## 10. 待确认事项

| 待确认 | 影响 | 当前处理 |
|---|---|---|
| 是否认可本 Step 只收结构性硬约束,不收泛化工程原则 | 若不认可,约束章节会膨胀并复述上游 | 当前只保留能影响 Step 4~11 的约束 |
| 是否认可 typed refs / source marker 只作为约束,不在本 Step 定义 schema | 若不认可,会提前进入 `03` refs contract | 当前后移 `03` |
| 是否认可性能、配置、测试只保留不可越界口径 | 若不认可,需要提前改写 `04/05/06` 前置 | 当前后移对应文档 |

---

## 11. 进入下一步条件

进入 Step 4 前必须满足:

- 用户审核通过本 Step 的结构性约束、后续章节门禁和高风险串线点。
- 用户认可本 Step 没有重新裁定需求或架构边界。
- 用户认可本 Step 不提前写入对象 contract、接口 schema、配置项、测试项或实施边界。
