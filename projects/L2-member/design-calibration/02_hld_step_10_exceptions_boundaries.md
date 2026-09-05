# Step 10. 异常与边界场景轮廓

> 对应 SOP: `standards/document/概要设计讨论流程_SOP.md` Step 10
> 回填章节: `02-概要设计.md` §10 异常与边界场景轮廓
> 生成日期: 2026-08-25
> 状态: completed / pass / stop_review
> 正式 02 写入: forbidden until Step 14

## 1. 本步目标、输入与边界

本步只点名会改变 `L2-member` 主线理解、跨组成部分协作或外部 owner 边界的异常 / 边界场景。它承接 Step 8 的 local-first 处理流和 Step 9 的 object-bound 状态机，不重新定义错误码、retry 参数、补偿脚本、调度策略、transport schema、存储恢复、运维处置或外部 owner 的故障模型。

| 项目 | 内容 |
|---|---|
| 本步输入 | Step 8 七部分处理流与跨流审计；Step 9 七部分状态机与跨状态审计；正式 `00-需求文档.md` 的 FR / BR / NFR 失败语义；正式 `01-架构设计.md` 的 fail-closed、body-free、local-truth-first 与 pending 边界。 |
| 本步输出 | 会改变主线理解的异常与边界场景表、按需的跨部分异常影响图、范围外异常细节清单、Step 11 进入条件。 |
| 本步范围 | subject / credential / source / body gate、Runtime / host / downstream seam、重复与乱序、trace / projection、可选能力 outlet、开放合同与 forbidden-body。 |
| 本步不做 | 不把 `L2M-UP-001~008` 写成已解决设计风险；不把异常写成实现任务、测试结果、incident report、evidence、readiness 或正向集成。 |

## 2. SOP 问题回答与当前材料诊断

### 2.1 哪些异常必须在概要层先点名

必须先点名的不是所有低层失败，而是以下会使“项目型成员如何安全进入在场、如何把事实交给 Runtime、如何从 Runtime 形成出站、如何保持可追溯和可读”失真的场景：执行主语 / 凭据不能证明；规则或外部 source 不充分；forbidden body 试图穿越边界；Runtime / host / publication / observation side effect 不能证明；重复、迟到或乱序反馈；关联缺口；派生投影或可选能力出口落后；以及 exact seam 尚未闭口。

### 2.2 哪些边界会改写协作关系

| 边界 | 协作关系变化 | 概要层固定口径 |
|---|---|---|
| C1 入场输入不成立 | CP01 不向 CP02 提供 admitted subject / presence | 形成 rejected / blocked admission；不得降级入场或以身份锚替代执行主语。 |
| CP02 筛选输入不充分 | CP02 不向 CP03 提供可评估的 screening input | `pending` / `blocked` 或规则明确允许的受控 `degraded`；不得 default pass。 |
| CP03 Runtime seam 不可证明 | CP03 不向 CP04 提供 accepted material reception | delivery / attempt 保留 blocked / pending / unknown；不得创建 Runtime run、代答或盲重放。 |
| CP04 / CP05 外部 handoff 未闭合 | attempt / gap 可继续被追溯，但外部成功不进入 member truth | local decision / source fact 不回滚；feedback 只形成 link、successor 或 gap 解释。 |
| CP06 source conflict / stale | 只影响后续 local policy posture、CP07 freshness或outlet surface | 不重裁历史 decision；不以 last-known snapshot 伪装 resolved。 |
| CP07 projection failure / optional outlet 缺失 | 只读供给降级，不反向阻断核心写链 | summary 返回 explicit not-ready / freshness；outlet / diagnostics 可 disabled / not_available / gap。 |

### 2.3 当前材料诊断与取舍

| 诊断项 | 若不在 Step 10 固定的风险 | 本步取舍 |
|---|---|---|
| 将 external unavailable 统称为“失败” | 会混淆 local truth、side effect、外部 acceptance 与恢复权 | 按 owner 分别呈现 blocked / pending / unknown / gap / degraded，不宣布外部成功或失败结论。 |
| 将 duplicate / late / out-of-order 当一般 retry | 会造成重复不可逆副作用或覆盖历史 | append-only / idempotency fence；只形成分类、link、gap 或 successor。 |
| 把 raw / forbidden-body reject 视为普通参数错误 | 会忽略最小暴露和 Runtime / Tools 边界 | body gate 在 CP02、CP03、CP04、CP05、CP07 各自阻断，不保存或转发正文。 |
| 将 pending contract 与异常恢复混写 | 会假定未存在的 route、凭据、schema、host / image agreement | `L2M-UP-001~008` 只产生 fail-closed / waiting / blocked / gap posture，精确合同留 Step 13 和后续文档。 |
| 将 projection unavailable 当核心交互失败 | 会使可重建只读面反向控制 core truth | CP07 独立降级；不写 source、不阻断 CP01~06 已提交本地事实。 |

## 3. 异常与边界场景轮廓表

| 异常 / 边界场景 | 影响哪些部分 / 流程 | 当前轮廓口径 | 说明 |
|---|---|---|---|
| 非项目型、不可解析或冲突的执行主语 / 身份锚 / 启动凭据 | CP01 `AdmitMemberStartup`、`MemberPresence`；CP06 subject / identity resolution | `StartupAdmission` 形成 rejected / blocked，不能建立 presence；只允许 `ProjectMemberRef + GlobalMemberRef` 正向语境。 | 这是防止匿名、错项目或 GlobalMember 替代执行主语进入所有后续主线的入口边界。 |
| host 不可达、反馈不可证明或 host contract 未闭口 | CP01 host attempt；CP06 host-route resolution；Read Model diagnostics | presence 仅在有明确 local basis 时进入 degraded / unknown；attempt 保留 blocked / unknown / feedback-linked，绝不声明 host acceptance、session或health。 | 容器编排、registry、session、健康与重启不归 member；`L2M-UP-001/002/006` 不得被本仓补齐。 |
| 订阅来源、scope 或筛选规则 unknown / stale / conflict | CP02 scope / intake / screening；CP06 policy resolution；CP03 delivery precondition | scope / screening 形成 rejected / blocked / pending，或仅在正式 rule 明确允许时形成受控 degraded；不得本地 allowlist / default pass。 | 会决定入站是否能进入 Runtime mediation，不能留到详细设计才暴露。 |
| 授权瞬时检查失败或 forbidden body 企图持久化 / raw 转发 | CP02 intake / screening；CP03 delivery；CP04 material；CP05 observation；CP07 Query / view | 创建安全分类或阻断 disposition；正文、hidden reasoning、secret、definition body、complete log 均不进入 local record、event、material、projection 或 Query。 | 这是跨边界数据最小暴露的结构性红线，而不是普通 validation 分支。 |
| Runtime entry mapping / seam 不可用、拒绝或 side effect unknown | CP03 delivery decision / submission attempt / result link；CP05 trace；CP07 projection | local decision / attempt 进入 rejected / blocked / pending / unknown 或 `result_linked`；不创建 run、不代答、未知不盲重放。 | `L2M-UP-003` 与 Runtime truth 外置使该场景直接改变 CP02→CP03→CP04 的主线资格。 |
| Runtime material source / correlation / body gate 不成立，或 material duplicate / late | CP03 `RuntimeMaterialReception`；CP04 outbound evaluation；CP05 trace | reception 形成 rejected / duplicate / late / blocked / unknown；只有 accepted reception 才能触发新的 CP04 evaluation。 | 防止旧相关语境、重复 material 或 unsafe material 直接变成出站。 |
| publication / observation handoff 失败、route pending 或 side effect unknown | CP04 `PublicationAttempt` / `PublicationGap`；CP05 `ObservationAttempt` / `InteractionGap`；CP07 diagnostics | prepared / blocked / submitted / unknown attempt 与 open / pending / resolved / superseded gap 保持分层；local decision / trace source 不回滚。 | member 只声明 local invocation / feedback ref，不代答 Bus delivery、downstream accepted、observed或evidence。 |
| duplicate、late、out-of-order 或 conflict feedback / source update | CP01 host feedback、CP03 result link / reception、CP04 delivery feedback、CP05 observation feedback、CP06 snapshot / resolution | 使用 dedup、immutable link、safe classification、gap或successor revision承接；不覆盖已提交事实或把 late input 提升为 current。 | 幂等与历史语义一旦漏写，会把跨边界异步行为误成同步状态机。 |
| correlation / trace relation 不完整 | CP05 `InteractionTraceEntry` / `InteractionGap`；CP07 diagnostic / summary freshness | source fact 保持 committed；CP05 追加 open / blocked / unknown gap，Query / projection 显式显示不完整。 | trace / observation 失败不是 CP01~04 core truth 的回滚条件。 |
| external context snapshot / resolution stale、conflict、unavailable 或 unknown | CP06 resolution / gap；CP01~04 future policy posture；CP07 projection / outlet | new purpose-specific resolution / gap 形成保守 posture；不重裁历史 local decision，不选择 last-known source，不把 resolved 当 authorization。 | Mirror 是 anti-corruption support truth，异常不能让其变成 second policy / registry owner。 |
| projection rebuild / store result失败、watermark 不完整或来源不可证明 | CP07 `MemberProjectionState`、summary / diagnostics Query | `stale` / `rebuilding` / `degraded` / `failed` / `unknown` 显式返回；只有完整覆盖 target watermark 才为 current；不写 source truth。 | 只读派生失败必须与 CP01~06 本地写链隔离。 |
| capability outlet safe ref / resolution / exact contract 缺失或过期 | CP06 capability resolution；CP07 outlet projection / `GetCapabilityOutlet` | outlet 显式 `not_available` / `stale` / `gap`；不能自建 registry、复制 definition、授权 invocation或声称 execution ready。 | optional outlet 的失败不阻断 summary 和核心交互。 |
| member-specific carrier / route、image release / entry 或其他 exact seam 尚未闭口 | 相关 Consumer / Event / Port / Job 的正向 integration；所有 CP01~07 | 仅保留 transport-neutral logical seam 与 object-bound blocked / waiting / gap；不私造 schema、route、adapter、IPC、manifest或readiness。 | `L2M-UP-001~008` 是开放边界，不应被误写成可以自动恢复的本地异常。 |

#### 跨部分异常影响图

```text
<Unverifiable input / source / seam / side effect>
                    │
                    ▼
<Owner-local gate or Consumer classification>
  rejected / blocked / pending / degraded / unknown / gap
                    │
          ┌─────────┴─────────┐
          ▼                   ▼
<No unsafe next-stage>  <Committed local history>
  no presence / Runtime     trace / projection shows
  entry / publication       body-free posture / freshness
          │                   │
          └─────────┬─────────┘
                    ▼
<New formal basis / feedback / successor only>
```

关键说明：

- 图表达异常首先由所属 owner 形成保守本地状态或 gap，并保留可追溯 history；它不表示重试、补偿、运维或外部系统恢复步骤。
- 外部 side effect 不可证明时，`unknown` 是 fence；新事实只能经 matching formal basis / feedback / successor 形成，不能由时间或 Query 自动放行。
- CP05 与 CP07 只消费 committed local refs，分别提供 trace / projection surface；它们不能修复 CP01~06 source truth。
- exact carrier、route、adapter、SDK、image / host / Runtime contract 继续受 `L2M-UP-001~008` 约束，图不把它们描绘成已连通。

## 4. 不在本步展开的异常细节

| 留待位置 | 不在 Step 10 展开的内容 | 原因 |
|---|---|---|
| Step 11 / 04 配置设计 | activation、timeout、refresh、retention、backoff、feature switch 或 visibility 配置形态 | 本步只固定哪些边界不可被配置绕过。 |
| 03 详细设计 | error taxonomy、错误码、dedup key / ordering key、state-store conflict、transaction、outbox、retry / compensation、job lease / scheduler、adapter mapping | 需要精确 schema、concurrency、carrier 与 owner contract，当前概要层不具备该 authority。 |
| 05 / 06 / 07 | fake / test matrix、验收证据、真实 run、实施 sequencing、report / signoff / readiness | 当前没有实现或集成事实，禁止伪造。 |
| Step 13 | `L2M-UP-001~008` 的风险、待确认方、影响范围与回开条件 | pending 不是本步可以关闭的异常；这里只固定其对主线的保守姿态。 |

## 5. 回填草稿

正式 `02-概要设计.md` §10 将保留一张压缩的异常与边界场景表：覆盖入场双锚 / 凭据、规则和 body gate、Runtime seam与material、publication / observation、duplicate / late / correlation、Mirror source、projection / outlet和开放合同。正文只说明场景落在哪个主要组成部分、如何改变主线资格或可见姿态，以及不产生哪些外部 truth；完整问题诊断、影响图、pending映射和详细设计后移项留在本文件。

## 6. Step 10 停审与进入下一步条件

| 审查项 | 结论 | 说明 |
|---|---|---|
| 关键异常已覆盖主线断点 | pass | 入场、筛选、Runtime、出站、追溯、Mirror、projection和开放 seam均有 object-bound 口径。 |
| 跨部分协作影响明确 | pass | 每个场景都标明 CP01~CP07 影响、阻断 / 保留 history / read surface的方向。 |
| 状态机不被改写或压平 | pass | rejected、blocked、pending、degraded、unknown、gap、stale、failed均保持原对象语义。 |
| 外部 truth 与 source owner 不越权 | pass | host / Runtime / Bus / Governance / Tools / downstream / observability不被 member 代答；CP05 / CP07无反向写。 |
| forbidden-body 边界完整 | pass | 只允许授权瞬时检查；禁止持久化、raw forwarding、definition / provider / log / evidence body。 |
| 未下沉到详细设计 | pass | 未写错误码、retry参数、补偿、schema、store、adapter、run或测试结论。 |
| pending 诚实性 | pass | `L2M-UP-001~008` 仍为pending / blocked / fail-closed，未生成closed contract或readiness声明。 |

Step 10 结论为 `completed / pass / stop_review`。下一允许动作是读取 Step 11 的 SOP 与书写规范输入，更新三层台账到 `configuration_impact` 并创建 `02_hld_step_11_configuration_impact.md`；不得提前创建 Step 12。
