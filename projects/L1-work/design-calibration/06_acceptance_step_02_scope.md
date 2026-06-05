# Step 2. 明确验收目标与范围

> 本文件是 `projects/L1-work/06-验收标准.md` 的 Step 2 中间产物。
> 本步定义本轮验收裁决什么、不裁决什么,并把 P0 / P1 / P2 范围切清楚。
> 本步不固定送验版本、`run_id` 或最终结论;这些留到 Step 3、Step 4 和 Step 14。

## 1. Step 状态

- 状态: `[~] 已生成,待用户审核`
- 对应 SOP: `standards/document/验收标准讨论流程_SOP.md` Step 2
- 回填章节: `projects/L1-work/06-验收标准.md` §2 验收目标与范围
- 生成日期: 2026-06-04

## 2. 本步输入

| 输入 | 内容 | 本步使用方式 |
|---|---|---|
| Step 1 输入映射 | 新版 `00/01/02/03/04/05` 是验收主输入,旧 `06` 只作诊断 | 固定范围来源 |
| `00-需求文档.md` §4 / §7 / §9 / §14 | 目标 / 非目标、C-1~C-5、`FR-WORK-*`、`AC-WORK-*`、`VF-WORK-*` | 定义验收目标和 P0 / 外围增强边界 |
| `01-架构设计.md` §4 / §8 / §9 | 职责边界、唯一编译期依赖、数据所有权和一致性 | 定义架构红线范围 |
| `02-概要设计.md` §5~§10 | 主要组成部分、接口骨架、处理流、状态和异常边界 | 定义功能 / 接口 / 状态验收范围 |
| `03-详细设计.md` §6~§15 | 对象、协议、flow、状态矩阵、事务、错误、幂等、配置、观测、测试切口 | 定义必须按正式字段、状态和接口名裁决的范围 |
| `04-配置设计.md` §2 / §6 / §8 / §11 / §12 | P0 profile、ref-only sensitive、fail-fast / fail-closed / marker、配置下游承接 | 定义配置和敏感输出验收范围 |
| `05-测试方案.md` §2 / §5 / §6 / §10 / §12 / §13 | 测试范围、AC 覆盖、用例族、NFR、进入退出、证据归档 | 定义可验范围和证据边界 |

已确认结论:

```text
本轮验收核心裁决是 L1-work 能否作为项目工作事实真相仓成立。
P0 验收必须覆盖 C-1~C-5、FR-WORK-001~008、AC-WORK-001~029、VF-WORK-001~008、详细设计 P0 契约、配置 P0 profile 和 EV-WORK-* 证据闭环。
外围增强、production-like 真实部署、remote config、hot reload、容量模型和真实运维 runbook 不进入 P0 硬验收。
```

## 3. SOP 问题回答

### 3.1 本轮验收的核心裁决目标是什么?

本轮验收的核心裁决目标是判断 `L1-work` 是否具备进入实现 / 后续交付裁决的正式基线:

```text
L1-work 是否已经把 Project、ProjectMember、Backlog、WorkItem、child WorkItem、Iteration、promote、依赖 / 阻塞、派生消费、配置和证据边界收束为可实现、可测试、可验收的项目工作事实真相仓。
```

该目标拆成五类裁决:

| 裁决目标 | 说明 |
|---|---|
| 核心能力闭环成立 | C-1 项目主语、C-2 项目内成员承担、C-3 正式工作全集、C-4 Iteration 承诺子集、C-5 可消费可追溯必须成立 |
| 正式工作事实不被污染 | conversation suggestion、personal checklist、runtime step、process planning、artifact / ImplementationPlan 正文不得直接进入 Work truth |
| 设计契约可落码 | `03` 已定义的对象、DTO、trait、flow、状态矩阵、事务、错误、幂等和观测契约必须能被测试证据支撑 |
| 配置红线可执行 | `04` 的 P0 profile、配置来源、敏感引用、fail-fast / fail-closed / marker 和 no hot update 边界必须能被验证 |
| 证据可复核 | `05` 的 `TC-WORK-*`、`EV-WORK-*`、suite、report 和 acceptance handoff 必须能支撑裁决 |

### 3.2 P0/P1/P2 验收范围如何划分?

P0 是本轮硬验收范围;P1 是接缝或 selected gate 范围;P2 是后续生产化或增强专项,不得阻塞 P0 裁决。

| 优先级 | 验收口径 | 失败影响 |
|---|---|---|
| P0 | 核心闭环、正式工作事实、详细设计 P0 协议 / 状态 / 事务 / 幂等、配置 P0 profile、证据闭环和一票否决 | 失败则不通过;若触发 VF / redline 则一票否决 |
| P1 | controlled integration seams、staging-like dry-run、selected operations-replay、真实或半真实 resolver / publisher / handoff 接缝 | 失败不自动否决 P0,但必须进入风险 / 遗留项或条件通过讨论 |
| P2 | production-like deployment、真实 DB / MQ / KMS / Vault / config center、remote config、hot reload、容量模型、full runbook | 当前不裁决;不得写成 P0 硬门禁 |

### 3.3 哪些下游能力只验接缝?

下游能力只验 Work 侧边界、引用、事件、handoff、report 和不反写规则;不验对方仓内部实现。

| 下游 / 相邻能力 | 本轮只验什么 | 不验什么 |
|---|---|---|
| `L1-identity` | GlobalMember / Actor 引用、ProjectMember 承担边界、resolver unavailable surface | identity 生命周期、role 管理和 actor 正文 |
| `L1-conversation` | conversation / trace / handoff ref、formalize / promote 来源边界、conversation 正文不入仓 | conversation fact 正文、聊天 UI、对话状态机 |
| `L3-method-library` | 方法定义 ref / snapshot、工具能力约束引用 | method definition 正文和 ViewProfile 归属 |
| `L1-process` | planning / timing ref、Iteration 不由 process 直接维护 | ProcessInstance、Activity、checkpoint 正文 |
| `L1-governance` | 高风险变化引用正式治理约束 | Gate / Policy / Approval 决策真相 |
| `L1-artifact` | evidence / baseline / ImplementationPlan / PlanItem ref 和摘要边界 | artifact / evidence / ImplementationPlan 正文 |
| `L2-runtime` | promote 需求输入、runtime plan item / progress 正文拒绝 | agent loop、tool invocation、execution progress |
| `L1-workspace` | 只读消费、projection / board 不反写真相 | workspace 聚合正文和前端交互细节 |
| `L4-observability` / `L4-archive` | trace / audit / archive handoff 材料和 ref | 全局日志正文、长期归档包正文、真实运维保留策略 |
| `L0-sdk` | 下游 client 接入边界和正式 API 消费方式 | SDK 具体封装实现 |

### 3.4 哪些非范围会影响最终结论?

非范围不会直接导致 P0 不通过,但如果被实现或文档写成 P0 前置、或反向污染 Work truth,就会影响最终结论。

| 非范围 | 正常处理 | 影响最终结论的情况 |
|---|---|---|
| 外围增强 `FR-WORK-E01`~`E05` | 进入 P1/P2 风险或后续专项 | 被写成核心闭环前置,或为了增强能力改写 P0 truth |
| production-like 真实部署 | 交给后续部署 / 运维材料 | 把真实 DB / MQ / KMS 缺失写成 P0 不通过,或把 fake success 伪装 production success |
| remote config / hot reload | P2,当前 unsupported | 在 P0 中开启并影响核心边界 |
| 容量模型和旧性能数字 | `AC-WORK-024` 只做性能观察 | 把旧 `100ms / 300ms / 500w` 写成未经验证的 P0 硬阈值 |
| 真实 observability dashboard / archive retention | 后续运维专项 | 缺 dashboard 被误判为 P0 失败,或 Work 保存全局日志 / archive 正文 |
| 前端视觉 / workspace UI | 非本仓 P0 | UI 反向定义 Work truth 或通过 UI 动作绕过正式 command |

### 3.5 哪些范围项可能成为一票否决?

以下范围项失败可能进入 Step 11 一票否决:

| 范围项 | 关联 VF / redline | 否决原因 |
|---|---|---|
| C-1~C-5 核心闭环 | `VF-WORK-001` | Work 仓失去项目工作事实真相仓定位 |
| Backlog / WorkItem / child WorkItem truth | `VF-WORK-002` | 正式工作全集被个人步骤、对话建议或 runtime 局部计划项污染 |
| ProjectMember / identity 边界 | `VF-WORK-003` | Work 接管身份生命周期或正文 |
| 相邻仓正文排除 | `VF-WORK-004` | conversation、method、process、governance、artifact、runtime、workspace 正文入仓 |
| ImplementationPlan / runtime progress 边界 | `VF-WORK-005` | 执行计划或 runtime progress 变成 Work 业务真相 |
| query / projection / maintenance no-write | `VF-WORK-006` | 相邻仓或消费面反写真相 |
| trace / audit / evidence explainability | `VF-WORK-007` | 关键变化不可追溯 |
| 唯一编译期依赖 `L0-core` | `VF-WORK-008` | 依赖裁剪规则被破坏 |
| raw secret / token / payload / source body 泄露 | release redline | 安全和证据红线失败 |
| evidence index 缺 P0 `EV-WORK-*` 或使用 `latest` | release evidence redline | 验收证据不可复核 |

### 3.6 哪些验收范围必须使用详细设计正式字段、状态或接口名?

以下范围必须按 `03-详细设计.md` 的正式名称裁决,不得用旧口语名、占位字段或实现者自造 DTO。

| 范围 | 必须使用的正式来源 |
|---|---|
| Command / Query / Consumer / Outbound Event / Job | `03-详细设计.md` §7 协议契约和 Step 8 protocol contracts |
| Project / ProjectMember / Backlog / WorkItem / ChildWorkItem / Iteration | `03-详细设计.md` §6 对象契约和 Step 6 object contracts |
| `ProjectLifecycleState`、`ProjectMemberResponsibilityState`、`BacklogState`、`WorkItemState`、`PromoteResultState`、`DependencyState`、`BlockerState`、`IterationState`、`CommitmentState`、`DerivedFreshnessState`、`ReferenceResolutionStatus`、`OutboxPublicationState` | `03-详细设计.md` §9 状态机与 Step 10 state matrix |
| Repository / Port / Adapter / UoW / idempotency | `03-详细设计.md` §5 / §10 / §12 |
| 错误映射和恢复 | `03-详细设计.md` §11 和 Step 12 error recovery |
| 配置项和 profile | `04-配置设计.md` §6~§11,不得由 06 重写默认值或字段 |
| 测试用例和证据 | `05-测试方案.md` §5 / §6 / §13,不得在 06 自行新增 `TC` 或 `EV` 口径 |

## 4. 当前文档问题诊断

| 位置 | 当前问题 | 影响 | 本步处理 |
|---|---|---|---|
| 旧 `06-验收标准.md` §1.2 | 范围表按旧 Project / Backlog / Iteration / promote / artifact done 组织,没有 P0/P1/P2 裁决层级 | 无法判断哪些失败直接不通过,哪些只是后续风险 | 重新定义范围层级 |
| 旧 `06-验收标准.md` §4 | 功能门禁没有回指 `AC-WORK-*`、`TC-WORK-*`、`EV-WORK-*` | 不能支撑可复核裁决 | 后续 Step 5 重建 |
| 旧 `06-验收标准.md` §5 | 把旧性能数字写成硬指标 | 与新版 `00` / `05` 的候选观察口径冲突 | Step 2 先裁为非 P0 硬门禁 |
| 旧 `06-验收标准.md` §6~§7 | 红线和治理门禁未连接 `VF-WORK-*` 和 release redline | 一票否决范围不清 | Step 2 标出潜在否决范围,Step 11 收口 |
| 旧 `06-验收标准.md` | 没有说明下游能力只验接缝 | 容易把 identity、conversation、artifact、runtime、workspace 等内部实现纳入本仓验收 | 本步明确只验 Work 侧边界 |

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 验收目标 | 笼统判断 Work 功能是否存在 | 裁决 Work 是否作为项目工作事实真相仓成立 | 验收标准必须服务通过 / 有条件通过 / 不通过 |
| 范围层级 | 未区分 P0/P1/P2 | P0 硬验收、P1 接缝 / selected、P2 后续专项 | 防止外围增强或生产化细节阻塞 P0 |
| 下游范围 | 可能把相邻仓实现一起验 | 只验引用、快照、事件、handoff、no-write 和 forbidden body 边界 | 保持仓际职责边界 |
| 一票否决候选 | 散落在旧三红线和安全治理表 | 显式连接 `VF-WORK-*`、release redline 和 evidence redline | Step 11 可继续闭环 |
| 详细设计名称 | 旧文档使用口语场景名 | 协议、状态、对象、错误、配置、证据必须使用 `03/04/05` 正式名 | 避免验收文档形成第二真相 |

## 6. 验收裁决取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A: 把 `05` 测试范围原样复制成验收范围 | 覆盖全面 | 测试范围回答“怎么测”,不能直接表达“什么算通过” | 不采用 |
| 方案 B: 以核心闭环和一票否决为主轴,再承接 `05` 的证据范围 | 验收目标清楚,能区分 P0/P1/P2 和非范围 | 后续 Step 5~10 需要继续拆门禁 | 采用 |
| 方案 C: 以旧 `06` 的主要部分继续组织范围 | 改动少 | 旧范围没有新版 AC / EV / config / evidence path 闭环 | 不采用 |

推荐方案 B。

原因:

- 验收范围必须先能裁决,再谈测试证据。
- `L1-work` 的最大风险不是“某个接口少测”,而是 Work truth 被外部正文、执行步骤、查询 / 投影 / 维护或依赖关系污染。
- P1/P2 能力必须显式非 P0,否则实现和验收都会把 production-like、hot reload、容量模型等未闭合内容误当硬门禁。

## 7. 结构化中间产物

### 7.1 验收目标表

| 验收目标 | 优先级 | 裁决说明 | 主要证据入口 |
|---|---|---|---|
| 核心能力闭环成立 | P0 | C-1~C-5 必须全部成立 | `EV-WORK-CORE-*`、`EV-WORK-MEMBER-*`、`EV-WORK-FORMAL-*`、`EV-WORK-ITER-*`、`EV-WORK-QUERY-*` |
| 功能需求成立 | P0 | `FR-WORK-001`~`008` 必须可被正式接口、状态和证据支撑 | `TC-WORK-*` / `EV-WORK-*` 覆盖矩阵 |
| 规则 / 边界成立 | P0 | `BR-WORK-001`~`027` 的不变量、禁止行为、显式变化、边界、治理和审计约束成立 | `EV-WORK-FORMAL-*`、`EV-WORK-PROMOTE-*`、`EV-WORK-QUERY-*`、`EV-WORK-OPS-*` |
| 数据归属成立 | P0 | Work truth、外部快照、外部引用和禁止正文边界成立 | `EV-WORK-FORMAL-*`、`EV-WORK-CFG-*`、redaction report |
| 详细设计契约可验 | P0 | 协议、对象、状态、事务、错误、幂等、观测契约能被测试覆盖 | `unit-contract-domain`、`service-all`、`worker-job-contract` |
| 配置红线成立 | P0 | P0 profile、strict config、source priority、sensitive、fail-fast / marker 成立 | `EV-WORK-CFG-*` |
| 证据可复核 | P0 | `EV / TC / AC / design_contract_refs` 可追溯,路径固定且无 `latest` | `reports/runs/<run_id>/evidence-index.md` |
| controlled integration seams | P1 | 真实或半真实接缝选测,失败进入风险 | selected suite / staging-like report |
| production-like 和容量专项 | P2 | 当前只记录,不裁决 | 后续专项 |

### 7.2 范围 / 非范围表

| 验收范围项 | 类型 | 优先级 | 裁决目标 | 非范围 / 说明 |
|---|---|---|---|---|
| Project / ProjectMember truth | 核心对象 | P0 | 项目主语和项目内承担成立 | 不验 identity 生命周期 |
| Backlog / WorkItem / child WorkItem truth | 核心对象 | P0 | 正式工作全集、拆分、升级和拒绝边界成立 | 不接收个人步骤、对话建议或 runtime step 直写 |
| Work dependency / blocker / done evidence | 核心关系 | P0 | 依赖、阻塞、解除依据和完成依据可解释 | 不保存 artifact / evidence 正文 |
| Iteration commitment | 核心对象 | P0 | 承诺子集从正式工作全集形成并保持边界 | 不验 process planning 内部实现 |
| Promote boundary | 跨仓接缝 | P0 | plan item 符合条件时显式升级,不符合时拒绝 | 不拥有 ImplementationPlan 正文 |
| Command / Query / Consumer / Event / Job protocol | 协议 | P0 | success、reject、duplicate、conflict、no-write、rerun 成立 | 不新增未定义协议 |
| 状态机 / 事务 / 幂等 / 恢复 | 一致性 | P0 | 合法 / 非法转换、UoW、outbox、projection、commit unknown 成立 | 不验真实 DB 产品行为 |
| Projection / query / maintenance no-write | 派生 / 维护 | P0 | 查询、投影、对账、报告不反写真相 | 不验 workspace UI |
| 配置加载 / 失败 / 敏感输出 | 配置 | P0 | P0 profile、strict JSON、env、sensitive、adapter ref、outbox / handoff / replay 可验证 | 不验 config center / hot reload |
| Observability / audit / evidence | 证据 | P0 | safe log、metric、audit / trace / outbox / report 证据成立 | 不验真实 dashboard |
| Controlled integration seams | 集成接缝 | P1 | resolver / publisher / handoff / staging-like dry-run 有选测证据 | 不要求真实生产 endpoint |
| Production-like deployment | 生产化 | P2 | 后续专项验证 | 当前不进入 P0 |
| 高级看板、多视图、容量趋势、跨项目依赖 | 外围增强 | P2 | 仅确认不得污染 P0 truth | 当前不验完整能力 |

### 7.3 一票否决候选映射

| 候选范围 | 关联项 | 后续收口 Step |
|---|---|---|
| 核心能力闭环任一节点失败 | `VF-WORK-001` | Step 11 |
| 正式工作全集被外部步骤污染 | `VF-WORK-002`、`VF-WORK-005` | Step 6 / Step 11 |
| identity / conversation / process / governance / artifact / runtime / workspace 边界打穿 | `VF-WORK-003`、`VF-WORK-004`、`VF-WORK-006` | Step 6 / Step 7 / Step 11 |
| 关键变化不可追溯 | `VF-WORK-007` | Step 10 / Step 11 |
| 依赖裁剪失败 | `VF-WORK-008` | Step 6 / Step 11 |
| raw secret / raw payload / source body 泄露 | release redline | Step 9 / Step 10 / Step 11 |
| 证据不可复核 | evidence redline | Step 10 / Step 11 |

### 7.4 范围裁剪图

#### 验收范围图: P0 到 P2 裁决边界

```text
P0 hard acceptance
  -> core loop
  -> Work truth boundary
  -> detailed design contracts
  -> configuration redlines
  -> EV / TC / AC evidence closure

P1 selected seams
  -> controlled resolver / publisher / handoff
  -> staging-like or operations selected runs
  -> risk / conditional pass input

P2 future specialties
  -> production-like deployment
  -> remote config / hot reload
  -> capacity model
  -> full operations runbook
```

关键说明:

- P0 失败会阻断通过;触发 VF 或 release redline 时一票否决。
- P1 失败不自动否决 P0,但必须进入风险接受或遗留项。
- P2 不进入当前硬验收,也不得被写成当前 P0 前置。
- 任一非范围能力如果反向污染 Work truth,按 P0 红线处理。

## 8. 验收输入影响判定

| 验收结论 | 是否影响上游设计 / 测试 | 影响类型 | 回写位置 | 处理状态 |
|---|---|---|---|---|
| 确认 P0 验收聚焦核心能力闭环、正式工作事实、详细设计契约、配置红线和证据闭环 | 否 | 验收范围裁剪,无设计契约变化 | 无 | 无回写 |
| 确认 P1 只验 controlled integration seams 和 selected runs | 否 | 验收范围裁剪 | 无 | 无回写 |
| 确认 P2 production-like、remote config、hot reload、容量模型和 full runbook 不进入当前 P0 | 否 | 非范围声明 | 无 | 无回写 |
| 确认非范围能力若污染 Work truth 则按 P0 红线处理 | 否 | 裁决规则承接 `VF-WORK-*` | 无 | 无回写 |

说明:

```text
本步没有新增需求、设计、配置、测试用例或证据编号。
本步只是把已确认的需求、架构、详细设计、配置和测试范围转成验收裁决范围。
```

## 9. 回填草稿

正式 `06-验收标准.md` §2 建议采用以下结构:

```text
2. 验收目标与范围
  2.1 验收目标
  2.2 P0 / P1 / P2 验收口径
  2.3 范围 / 非范围表
  2.4 只验接缝的下游能力
  2.5 一票否决候选范围
  2.6 验收输入影响判定
```

正文草稿:

```text
本轮验收的核心目标是裁决 `L1-work` 是否作为项目工作事实真相仓成立。P0 范围覆盖核心能力闭环、正式工作事实、详细设计契约、配置红线和证据闭环。P1 只覆盖 controlled integration seams 和 selected runs;P2 的 production-like、remote config、hot reload、容量模型和 full operations runbook 不进入当前硬验收。

任何非范围能力只要反向污染 Work truth、保存相邻仓正文、绕过正式接口、破坏依赖裁剪或使证据不可复核,都不再按非范围处理,而按 P0 红线和一票否决候选处理。
```

## 10. 待确认事项

无阻塞进入 Step 3 的待确认事项。

后续 Step 必须继续收口:

- Step 3 固定需求、设计、测试、交付、环境、数据和 `run_id` baseline。
- Step 5~10 把 P0 范围拆成可判定门禁,每项绑定设计契约、`TC-WORK-*`、`EV-WORK-*` 和 report 路径。
- Step 11 将本步一票否决候选正式收束为否决项。
- Step 13 / Step 14 处理 P1 失败、P2 未覆盖和有条件通过的风险接受。

## 11. 进入下一步条件

- [x] 核心验收目标已经明确。
- [x] P0 / P1 / P2 验收范围已经划分。
- [x] 只验接缝的下游能力已经列明。
- [x] 非范围及其影响最终结论的条件已经列明。
- [x] 潜在一票否决范围已经标出。
- [x] 必须使用详细设计正式字段、状态或接口名的范围已经列明。
- [ ] 用户审核并确认本 Step。
