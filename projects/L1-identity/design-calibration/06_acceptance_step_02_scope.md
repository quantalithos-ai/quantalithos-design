# Step 2. 明确验收目标与范围

> 对应 SOP: `standards/document/验收标准讨论流程_SOP.md` Step 2
> 回填章节: `06-验收标准.md` §2 验收目标与范围

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 2 明确验收目标与范围 |
| 当前状态 | 已审核通过 |
| 输入基线 | Step 1 已审核通过;新版 `00/03/05` 的目标、范围、接口族、AC / VETO 和测试范围 |
| 输出文件 | `projects/L1-identity/design-calibration/06_acceptance_step_02_scope.md` |
| 正式文档状态 | 本 Step 不修改正式 `06-验收标准.md` |
| 停审方式 | 用户已确认,允许进入 Step 3 |

## 2. 本步目标

把 Step 1 固定的输入边界转成新版 `06-验收标准.md` 的验收目标、范围、非范围和优先级裁决边界。

本 Step 只回答:

- 本轮验收的核心裁决目标是什么。
- 哪些能力、规则、入口族和横切约束属于 P0 验收范围。
- 哪些能力属于 P1 / P2 或 residual,不得阻断 P0 pass。
- 哪些下游能力只验正式接缝,不验相邻仓完整内部实现。
- 哪些范围项可能进入一票否决。
- 哪些验收范围必须使用详细设计正式字段、状态、接口或事件名称。

本 Step 不定义每条验收项的编号、通过条件、失败条件、证据 ID、report path、缺陷分级、风险接受人或最终签署结论。

## 3. 本步输入

| 输入 | 状态 | 本 Step 用途 |
|---|---|---|
| `06_acceptance_step_01_input_boundary.md` | 已审核通过 | 提供验收输入权威顺序和旧 `06` 降级口径 |
| `00-需求文档.md` §2 / §4 | 正式输入 | 提供仓定位、目标、非目标和边界判定口径 |
| `00-需求文档.md` §14 | 正式输入 | 提供 AC-ID-001~015 与 VETO-ID-001~006 |
| `03-详细设计.md` §2 | 正式输入 | 提供 P0 详细设计范围、非范围和实现者可完成范围 |
| `03-详细设计.md` §6 | 正式输入 | 提供 6 Command、14 Query、5 Inbound / Callback、10 Outbound Event、6 Operations Job 的正式名称 |
| `03-详细设计.md` §15 | 正式输入 | 提供模块、接口、状态、一致性、配置、观测和 redaction 最小测试切口 |
| `05-测试方案.md` §2 | 正式输入 | 提供 P0 / P1 / P2 测试范围、非范围和 VETO 承接 |
| `05-测试方案.md` §14 | 正式输入 | 提供 residual risk、不可风险接受项和必须转入新版 `06` 的事项 |

## 4. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 本轮验收的核心裁决目标是什么? | 裁决 `L1-identity` 是否作为平台级 AI 员工身份真相仓成立:稳定身份锚点、显式生命周期、角色能力摘要、生涯与 memory refs、身份事实消费 / 追溯 / 对账、传播与交接都必须在正式设计边界内可证明、可追溯、可留证。 |
| P0/P1/P2 验收范围如何划分? | P0 覆盖 `C-ID-1~C-ID-5`、`FR-ID-001~014`、`BR-ID-001~015`、`NFR-ID-001~009` 的当前设计可裁决部分、`AC-ID-001~015`、`VETO-ID-001~006`、6 Command、14 Query、5 Inbound / Callback、10 Outbound Event、6 Operations Job、state/UoW/idempotency/query no-write/job no-repair/redaction/dependency/evidence integrity。P1 只覆盖 real-like / durable-like selected-run 接缝,不可用时记录 residual,不影响 P0 pass。P2 覆盖 production-like profile、capacity、hard SLO、external HR / IdP、advanced UI / dashboard、complex organization 和 full event-sourcing-first。 |
| 哪些下游能力只验接缝? | `L1-work`、`L3-method-library`、governance / security basis、memory / archive、observability、bus、runtime 等只验 refs、safe summary、event、receipt、adapter、handoff 和 report 接缝。验收不得要求这些相邻仓完整内部状态机、权限模型或产品体验通过。 |
| 哪些非范围会影响最终结论? | 非范围本身不阻断 P0 pass,但若 P0 被错误依赖非范围能力,则会影响结论。例如 P0 依赖真实 DB/bus/archive 产品行为、production capacity、UI 体验或相邻仓完整实现时,应判定为验收范围污染或基线缺口。 |
| 哪些范围项可能成为一票否决? | 身份 ref 复用、query/consumer/callback/projection/job 隐式创建 identity truth、外部正文或 secret 落入 truth/event/trace/audit/report/artifact、高风险 lifecycle 缺治理依据仍 accepted、reconciliation / maintenance job 修相邻 truth、非 core sibling compile dependency 或 truth mixing 都是 VETO 候选。 |
| 哪些验收范围必须使用详细设计正式字段、状态或接口名? | Command、Query、Inbound / Callback、Outbound Event、Operations Job、state family、transaction order、stored replay、reconciliation/report-only、outbox/handoff、redaction、config/runtime builder 和 evidence gate 都必须使用新版 `03/05` 的正式名称和证据结构。旧 `06` 中的旧命令、旧 job、旧 query 和旧 gate 名称不得回流。 |

## 5. 当前文档问题诊断

| 位置 | 当前问题 | 本 Step 处理 |
|---|---|---|
| 旧 `06-验收标准.md` §1~§4 | 旧草案以旧 Command / Query / Event / Operations 口径组织范围 | 新版范围只承接 `03` §6 的正式入口族和 `05` §2 的测试范围 |
| 旧 `06-验收标准.md` | P0 最小闭环用旧流程串联,已不匹配新版详细设计 | Step 2 不复用旧闭环;Step 5 再按新版能力闭环定义功能门禁 |
| `05-测试方案.md` §2 | 测试范围已经给出 P0/P1/P2,但还不是验收裁决范围 | 本 Step 将其转成验收范围,并明确 P1 / P2 对结论的影响 |
| `05-测试方案.md` §14 | residual 风险和必须转入 `06` 的事项仍待验收裁决 | Step 2 先定范围;Step 9 / Step 13 / Step 14 继续闭合 |
| 真实产品与 external selected-run | 产品未锁定,不可作为 P0 pass 必要条件 | 标记为 P1/P2 或 residual,不得污染 P0 |

## 6. 改动前后对比

| 项 | 改动前 | 改动后 | 理由 |
|---|---|---|---|
| 验收主语 | 旧 `06` 使用历史身份主线和旧入口族 | 新版验收主语是 `L1-identity` 平台级 AI 员工身份真相仓 | 与新版 `00/03/05` 对齐 |
| P0 范围 | 旧草案混合功能、实现、证据和安全治理 | P0 按能力闭环、正式入口族、横切规则、证据和 VETO 裁决 | 便于 Step 5~11 分项闭环 |
| P1/P2 | 旧草案未清楚区分 selected-run、真实产品和 capacity | P1/P2 明确为非 P0 阻断,只能作为 residual 或后续 trigger | 防止验收范围膨胀 |
| 下游接缝 | 旧草案可能要求完整下游行为 | 新版只验 refs、safe summary、event、adapter、handoff 和 report 接缝 | 符合仓边界和依赖裁剪 |
| VETO | 旧草案分散在红线 / 安全章节 | 新版先标记 VETO 候选,Step 11 再正式逐项裁决 | 保持一票否决小循环 |

## 7. 验收裁决取舍

| 议题 | 可选方案 | 取舍 |
|---|---|---|
| 是否把测试 P0 范围原样作为验收 P0 范围 | A. 原样复制;B. 转成裁决范围 | 采用 B。测试方案回答“如何验证”,验收标准回答“验证到什么程度算通过”。 |
| P1 selected-run 是否强制 | A. 强制作为 P0 pass 条件;B. 只在环境明确时执行,不可用则 residual | 采用 B。真实产品 / 环境未锁定,不能阻断 P0。 |
| hard SLO / production capacity 是否进入 P0 | A. 进入 P0;B. 当前只要求 sample / trend,硬阈值后续硬化 | 采用 B。`00/05` 已明确不继承旧固定阈值。 |
| 完整跨仓端到端是否纳入 | A. 纳入 P0;B. 只验 identity 正式接缝 | 采用 B。相邻仓完整内部状态机不是 identity P0。 |
| 是否提前定义验收项 ID | A. Step 2 定义;B. Step 5~11 分主题定义 | 采用 B。Step 2 只固定范围,避免全局门禁表先行。 |

## 8. 结构化中间产物

### 8.1 验收目标

本轮验收目标是裁决新版 `L1-identity` 是否满足以下条件:

1. 作为平台级 AI 员工身份真相仓成立,不被认证、项目成员、方法正文、memory 正文、runtime 实例或 UI 状态混层。
2. 能证明 `C-ID-1~C-ID-5` 的 identity anchor、lifecycle、role/capability summary、career/memory refs 和 consumption traceability 闭环。
3. 能以正式 Command / Query / Inbound / Callback / Outbound / Job surface 支撑主线、异常、duplicate replay、no-write、report-only 和 handoff。
4. 能以 run-scoped evidence 和 acceptance reports 支撑 AC / VETO / risk acceptance / final signoff 的三值裁决。

### 8.2 验收范围表

| 验收范围项 | 类型 | 优先级 | 裁决目标 | 非范围 / 说明 |
|---|---|---|---|---|
| 身份锚定与成员真相 | 核心能力 | P0 | 证明稳定身份锚点、显式建立、ref 不复用、读取不隐式创建 | 不验认证主体、external account 或 runtime identity |
| 全局生命周期 | 核心能力 | P0 | 证明 lifecycle 显式迁移、非法迁移拒绝、高风险依据缺失不 accepted | 不验 governance 内部授权裁决 truth |
| 角色能力摘要 | 核心能力 | P0 | 证明角色 / 能力摘要有来源或证据引用,来源失效不静默污染 | 不保存 RoleDefinition / CapabilityDefinition 正文,不验自动评分算法 |
| 生涯记录 | 核心能力 | P0 | 证明 career append-only、重复来源不生成重复历史、纠错不改写已确认历史 | 不拥有 Project / WorkItem / ProjectMember truth |
| memory refs 与 archive refs | 核心能力 | P0 | 证明只维护引用和状态,不保存 memory 原文、向量或 archive package | 不验 memory 检索、向量生成或 archive package 内容 |
| 身份事实消费与追溯 | 核心能力 | P0 | 证明相邻仓可消费身份摘要 / 变化,身份变化可追溯 | 不验相邻仓完整消费体验 |
| 派生维护与对账 | 核心能力 | P0 | 证明 projection/reference/reconciliation/report-only,job 不修 truth | 不做自动 remediation 或相邻 truth 修复 |
| 身份事实传播与外部交接 | 核心能力 | P0 | 证明 outbound material、outbox、handoff、receipt、retry/terminal 语义 | 不要求真实 bus/archive 产品端到端 |
| 6 Command | 接口族 | P0 | `EstablishGlobalMember`、`UpdateGlobalLifecycleState`、`MaintainRoleCapabilitySummary`、`AppendCareerRecord`、`MaintainMemoryReference`、`PrepareTraceHandoff` 验收 | 不使用旧 command 名称 |
| 14 Query | 接口族 | P0 | visibility-first、missing/empty、degraded/stale-visible、query no-write 验收 | 不允许 query 创建 truth 或 rebuild |
| 5 Inbound / Callback | 接口族 | P0 | receipt replay、unsupported、delayed、quarantined、noop、forbidden body 验收 | 不验相邻仓内部事件生产逻辑 |
| 10 Outbound Event | 接口族 | P0 | accepted-only、saved payload marker、body-free payload、publish failure isolation 验收 | 不把外部正文放入 payload |
| 6 Operations Job | 接口族 | P0 | duplicate report replay、partial failure、retryable/terminal outcome、no business truth repair 验收 | 不做相邻仓修复 |
| state / UoW / idempotency / concurrency | 横切一致性 | P0 | 正式 state matrix、same-UoW、stored replay、rollback/commit visibility、race guard 可裁决 | 不使用旧状态名或 fake 私有规则 |
| config / runtime / adapter / redaction | 横切配置与安全 | P0 | strict config、profile compatibility、runtime builder fail-fast、disabled/fake no-success、redaction clean | 不验真实 secret provider 产品能力 |
| evidence / report integrity | 证据门禁 | P0 | raw artifact、report、EV index、redaction check、dependency check、acceptance handoff 可追溯 | 不接受静态造证据或口头 pass |
| real-like / durable-like selected-run | 接缝增强 | P1 | 在环境明确时补充真实接缝信心 | 不作为 P0 pass 必要条件 |
| production-like capacity / hard SLO | 发布增强 | P2 | 后续容量模型和部署基线明确后裁决 | 当前只保留 sample / trend |
| UI / dashboard / advanced analytics | 产品体验 | P2 | 后续产品验收 | 不影响本轮 truth center 成立 |

### 8.3 非范围表

| 非范围 | 原因 | 当前处理 |
|---|---|---|
| 登录、token、session、credential 校验 | 属于认证入口或 gateway / API layer | 只验 trusted actor / context 输入边界,不验认证实现 |
| 授权裁决和高风险决策 truth | 属于 governance 或安全入口 | identity 只验 basis ref / safe marker / missing basis reject |
| ProjectMember、Project、WorkItem truth | 属于 `L1-work` | identity 只验 project/work refs 和 career append 接缝 |
| RoleDefinition / CapabilityDefinition 正文 | 属于 `L3-method-library` | identity 只验 source ref / safe summary / body-free |
| memory 原文、向量、检索索引、archive package | 属于 memory / archive / artifact 承载方 | identity 只验 refs、state 和 handoff receipt |
| runtime 容器、工具执行和成员进程编排 | 属于 runtime / member-service / tools | identity 只验 runtime 不反向定义 member identity |
| conversation / workspace / UI 展示状态 | 属于相邻仓和产品层 | P2 或未来产品体验 |
| 真实 DB / bus / archive / metric / secret provider 产品行为 | 产品未锁定 | P0 只验 port / adapter seam;真实产品 selected-run 为 P1 |
| production capacity 与硬性能阈值 | 缺正式容量模型和 deployment baseline | P0 只要求 duration/count sample 与趋势记录 |

### 8.4 P0 / P1 / P2 裁决边界

| 优先级 | 进入验收方式 | 对最终结论的影响 |
|---|---|---|
| P0 | 必须在固定基线和 evidence 下裁决 | 任一 P0 门禁失败或 VETO 命中,结论不得为通过 |
| P1 | 仅在 selected-run 环境、真实接缝或额外证据存在时裁决 | 不存在时记录 residual;失败是否影响有条件通过由 Step 13 判断 |
| P2 | 当前只作为后续演进或发布增强触发 | 不影响本轮 P0 pass,但不得伪装为已验收 |

### 8.5 下游接缝验收边界

| 相邻方 / 能力 | 本轮验收什么 | 本轮不验什么 |
|---|---|---|
| `L1-work` | project/work participation refs、career append source、duplicate source handling | ProjectMember 内部状态机、项目权限、work item truth |
| `L3-method-library` | role/capability source ref、safe summary、source unavailable / invalid response | RoleDefinition / CapabilityDefinition 正文和编辑流程 |
| governance / security basis | high-risk lifecycle basis ref、missing / invalid / unavailable basis 的拒绝或降级 | governance 内部 policy、approval 或 gate truth |
| memory / archive | memory refs、archive refs、handoff result receipt、body-free marker | memory body、vector、archive package、检索语义 |
| bus / publisher | outbound material、topic/target binding、publish failure isolation | 真实 broker 产品 SLA |
| observability | safe trace / audit / report / metric cut、redaction clean | 外部 observability 产品 dashboard |

### 8.6 一票否决候选范围

| VETO | 范围触发点 | 后续闭合 Step |
|---|---|---|
| `VETO-ID-001` | 身份 ref 复用给另一个成员 | Step 11 |
| `VETO-ID-002` | Query、consumer、callback、projection、maintenance job 隐式创建 identity truth | Step 11 |
| `VETO-ID-003` | 外部正文、credential、token、raw secret 进入 truth、event、trace、audit、report 或 artifact | Step 11 |
| `VETO-ID-004` | 高风险 lifecycle 缺少治理 / 授权依据仍 accepted | Step 11 |
| `VETO-ID-005` | 维护对账或 job 绕过正式能力修改相邻仓 truth | Step 11 |
| `VETO-ID-006` | 非 core sibling compile dependency 或 truth mixing | Step 11 |

## 9. 对上游 / 下游文档的影响判定

| 结论 | 是否影响上游 / 下游 | 影响类型 | 处理状态 |
|---|---|---|---|
| 新版范围足够进入 Step 3 | 否 | 验收目标与范围闭合 | 无需回写 |
| P1 selected-run 不强制 P0 | 否 | 验收裁决边界 | Step 13 继续定义 residual / 有条件通过 |
| production-like capacity 和 hard SLO 不进入 P0 | 否 | 非功能裁决边界 | Step 9 只定义 sample / trend 或后续硬化触发 |
| 下游完整实现不纳入 identity P0 | 否 | 跨仓验收边界 | Step 7 按接缝验收 |
| 若 Step 5~11 发现 P0 范围项缺正式设计契约或证据 | 是 | 设计 / 测试闭环缺口 | 暂停对应验收项,回写 `03/05` |

## 10. 回填草稿

> 校准来源:
> - `design-calibration/06_acceptance_step_02_scope.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“SOP 问题回答”“结构化中间产物”“对上游 / 下游文档的影响判定”和“待确认事项”小节,了解验收目标与范围如何从新版 `00/03/05` 收敛。

正式 `06-验收标准.md` §2 应回填:

- 本轮验收目标是裁决 `L1-identity` 是否作为平台级 AI 员工身份真相仓成立,并能以证据支撑 `AC-ID-001~015` 和阻断 `VETO-ID-001~006`。
- P0 范围覆盖 `C-ID-1~C-ID-5`、`FR-ID-001~014`、`BR-ID-001~015`、`NFR-ID-001~009` 的当前设计可裁决部分、正式入口族、状态 / 事务 / 幂等 / 配置 / redaction / evidence integrity。
- P1 selected-run、real-like / durable-like 接缝仅在环境明确时裁决,不可用时记录 residual,不作为 P0 pass 必要条件。
- P2 production-like profile、capacity、hard SLO、external HR / IdP、UI / dashboard 和复杂组织能力不影响本轮 P0 裁决。
- 相邻仓只验正式接缝,不验完整内部业务状态机。
- VETO 命中不得风险接受,具体检查方式在 §11 闭合。

## 11. 待确认事项

| 待确认事项 | 影响 | 当前处理 |
|---|---|---|
| P1 selected-run 是否在本次送验中实际执行 | 影响 residual 或附加信心 | Step 3 固定基线,Step 13 定风险接受 |
| hard SLO 是否在本轮硬化 | 影响 Step 9 非功能门禁 | 当前按 sample / trend;如要硬化必须有正式阈值来源 |
| evidence retention days 是否需要本轮固定 | 影响 Step 10 / Step 13 | `05` 已提示转入 `06`;后续 Step 判断 |
| 风险接受 approval role 未固定 | 影响有条件通过 | Step 13 / Step 14 定义 |
| 下游接缝的真实产品可用性 | 影响 P1 selected-run | 不影响 P0,Step 3 / Step 13 记录 |

## 12. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| 验收核心目标明确 | 通过 | 见 §8.1 |
| P0 / P1 / P2 范围边界明确 | 通过 | 见 §8.2 / §8.4 |
| 非范围明确 | 通过 | 见 §8.3 |
| 下游接缝边界明确 | 通过 | 见 §8.5 |
| VETO 候选范围明确 | 通过 | 见 §8.6 |
| 未提前定义 Step 5~11 验收项 | 通过 | 本 Step 只定义范围 |
| 可进入 Step 3 | 通过 | 用户已确认,进入 Step 3: 固定验收基线 |
