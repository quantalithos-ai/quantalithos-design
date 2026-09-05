# Step 13. 设计风险与待确认事项

> 对应 SOP: `standards/document/概要设计讨论流程_SOP.md` Step 13
> 回填章节: `02-概要设计.md` §13 设计风险与待确认事项
> 生成日期: 2026-08-25
> 状态: completed / pass / stop_review
> 正式 02 写入: forbidden until Step 14

## 1. 本步目标、输入与判定口径

本步在 Step 4~12 已收稳后，只收纳仍可能破坏 `L2-member` 概要设计成立性的风险，以及尚缺外部 authority 才能定论的问题。风险与待确认事项分开：风险已有当前保守约束，需要持续防止；待确认事项缺少正式答案，只能在明确挂起上限内继续设计。二者都不是任务、排期、实现 backlog、运行事件或验收结论。

| 项目 | 本步处理 |
|---|---|
| 稳定结论 | 七个组成部分、34 个对象、`10 / 16 / 14 / 24 / 5`、流程、状态、异常和配置红线仍是稳定输入，不重新列为待确认。 |
| 设计风险 | 记录 owner / state / data / dependency / historical pollution 等会在后续设计中使稳定边界失效的风险。 |
| 待确认事项 | 记录 `L2M-UP-001~008` 及确实缺少的物理契约、量化依据或消费合同；每项必须有影响范围与 fail-closed / waiting 上限。 |
| 不在范围 | 不选择 endpoint、schema、route、credential、manifest、DB / queue、默认值、SLO 数字、test case、实施阶段或提交策略。 |

### 1.1 输入与复核范围

| 输入 | 本步用途 |
|---|---|
| Step 4~12 中间产物 | 复核哪些主语已稳定，避免将详细设计承接项误降级为 question。 |
| 正式 `00-需求文档.md` §15 与正式 `01-架构设计.md` §15 | 承接已登记风险 / question，但按当前 02 边界、兄弟可引用状态和 Step 10~12 重新裁剪。 |
| `project_execution_ledger.md` §5 | 复核 `L2M-UP-001~008` 的 owner、影响与当前 pending 口径。 |
| 当前正式上游 / siblings 可引用材料 | 确认没有将尚未稳定的 host、image、Runtime、Core、Policy 或 subject 合同误写为已闭口。 |

### 1.2 风险、待确认与不应收纳事项的区分

| 类型 | 判断条件 | 本步写法 |
|---|---|---|
| 设计风险 | 已知若被违反会破坏当前概要层 owner、状态、数据或依赖结论，但已有保守处理口径。 | 写影响和当前约束；不写负责人、排期或解决方案。 |
| 待确认事项 | 缺少正式 owner / contract / measurement / scope 定论，不能由本仓推断。 | 写影响范围和定论前的 fail-closed / blocked / optional 上限。 |
| 已稳定承接项 | 已由 Step 4~12 停审且已进入详细设计承接清单。 | 不重复写成风险或待确认。 |
| 实施 / 运维任务 | 只是未来要写、要测、要部署或要协调的事项。 | 不纳入本 Step；分别留给 03~07 的后续流程。 |

## 2. SOP 问题回答与诊断

### 2.1 当前概要设计层已经构成风险的问题

当前风险集中在“详细设计或未来合同如何可能反向破坏已稳定边界”，而不是“系统尚未实现”。例如 host / Runtime 的 exact carrier 尚未闭口本身是待确认事项；将它们当作 local truth、默认可用或已发生 integration 则是设计风险。

### 2.2 当前只能挂起的定论缺口

`L2M-UP-001~008` 不是可由本仓关闭的本地问题。它们不阻塞本次概要设计对本地 / negative / blocked-aware 结构的成文，但分别限制 affected lane 的 exact schema、adapter activation、配置激活、positive test、evidence、integration 和 readiness 声明。特别是并行 sibling 的细节不因同属 Layer 3 而自动可引用。

### 2.3 何种情况会误导后续详细设计

若 Step 13 不把以下内容显式收纳，`03` 很容易把 pending seam 当作完整接口、把 projection 当作真相 owner、把 retry 当作 unknown side-effect 的恢复权，或把旧 README 中的协议 / 部署假设重新写入正式细节。因此必须同时保持：稳定主语在 Step 12，开放合同和风险上限在本 Step，二者不相互替代。

## 3. 设计风险清单

| 风险 | 影响 | 当前处理口径 |
|---|---|---|
| member、Runtime、host、Bus 或 downstream owner 在详细设计中被重新混写。 | CP01、CP03、CP04 的对象、Port、处理流、状态与 transaction；可能形成第二 run / health / delivery truth。 | 只允许 member-local decision / attempt / link / gap；Runtime loop / run / context / plan / outcome、host registry / session / health、Bus delivery 与 downstream truth 全部保持外置。发生冲突必须回退 Step 1~5 / 8。 |
| 项目型执行主语被 `GlobalMemberRef`、Workspace view、匿名进程或未定义 personal 主语替代。 | CP01 admission、CP02~CP07 所有 subject-bearing Command / Consumer / Query / state。 | 正向只接受 `ProjectMemberRef + GlobalMemberRef`；任何其他主语 rejected / blocked / fail-closed，直到正式 owner 定义第三种主语。 |
| inbound screening 膨胀为本地 Policy / allowlist，或未知规则默认放行。 | CP02 screening、CP03 delivery 前置、CP06 policy resolution、相关配置与测试。 | CP06 `PolicyContextUpdateConsumer` 为唯一 rule source owner；CP02 只消费 neutral resolution；unknown / stale / conflict 维持 pending / blocked 或明确规则许可的受控 degraded。 |
| local decision、attempt、feedback、delivery、accepted、observed、evidence、health 或 `available` 被压平为一个成功状态。 | CP01~CP07 状态机、Query surface、semantic Event、验收语义。 | 保持对象化状态族和 local-truth-first；`submitted`、`feedback_linked`、`resolved`、`current`、`available`均不得代答外部成功。 |
| raw body、hidden reasoning、secret、definition body、complete log 或 evidence body 经 debug、trace、projection、handoff 或 config 进入 member。 | CP02~CP07 对象、Consumer、Event、Port、store、read surface 与配置。 | 只允许授权瞬时检查；持久化 / 传播 / projection 一律 body-free、最小化且可回源。任何例外必须回开需求 / 架构边界，而不是在 03 中加字段。 |
| unknown side effect 被 retry、timeout、restart、cache、Query 或默认配置自动重放 / 升级。 | host、Runtime、publication、observation attempt；gap、history、Job 与 state transition。 | `unknown` 保持 fence；只允许新 formal basis、matching feedback 或 successor 形成新 revision。不得盲重放或原地覆盖历史。 |
| CP06 Mirror、CP07 projection / outlet 或 CP05 Trace 越权为 registry、authorization、configuration truth、evidence / backend 或 source repair。 | CP05~CP07 的对象、source Consumer、Query、rebuild / reconcile Job。 | Mirror 只形成 neutral resolution / gap；Read Model 只从 committed refs / resolution 重建；Trace 只形成 body-free relation。它们均无 source write 和 authorization 权。 |
| runtime / event / ref / adapter / fake 被误写为 compile package dependency，或 planned / fake / blocked 被叙述为 positive integration / readiness。 | Step 7 Port / Event、03 dependency / adapter、05~07 未来 test / evidence / implementation材料。 | Core shared primitive 仍是唯一 compile candidate；其余严格分类。任何 future material 只可标 planned / blocked / waiting / not_run，不形成 integration、evidence、verdict、signoff 或 readiness。 |
| historical README / 旧正式链中的 CloudEvents、AG-UI、UDS、launch token、语言 / 进程管理器或 P95 / SLA 整包回流。 | 03 协议、04 配置、05~07 测试 / 验收 / 实施与所有跨仓 seam。 | 旧材料仅作污染审计；CloudEvents / W3C 只经 Core current authority 承接，其余逐项需要当前 owner 的重新证明。 |
| sibling / upstream 合同后来改变 owner 或允许越界数据，而本仓未回开校准。 | host / image / Runtime / Core / Policy / subject seam，尤其 CP01、CP03~CP06。 | 只引用正式或明确可引用材料；一旦新正式合同与现有 owner、body、dependency、state 红线冲突，回退对应 Step 并重新审计，不单方面吸收。 |

## 4. 设计待确认事项清单

| 待确认 | 影响范围 | 当前挂起口径 |
|---|---|---|
| `L2M-UP-001`：member-service 的 host request / signal / report / feedback、注册受理、IPC direction 与字段合同。 | CP01 host collaboration、CP06 host-route resolution、host adapter、03 / 04 的正向配置与05~07的联调 / evidence。 | member 只形成 local request / signal / report / attempt / feedback link；host acceptance / registry / session / health 外置。exact carrier 未闭口前 Port 保持 blocked-aware。 |
| `L2M-UP-002`：member-images 的 pinned component release、manifest / version、compatibility、pinned entry handoff / confirmation。 | CP01 宿主协作的 supply 前提、future implementation / configuration / test lanes。 | image truth 不进入 member object / state / package dependency；仅保留 image / pinned entry unavailable 时的 blocked / waiting seam，不声明 release readiness。 |
| `L2M-UP-003`：member inbound material 到 Runtime formal trigger / EntryAuthority 的 exact mapping。 | CP03 delivery decision / submission attempt、CP02→CP03 正向流程、Runtime adapter与正向测试。 | 只保留 transport-neutral `RuntimeEntryPort` 与 typed mapping slot；mapping 不能证明时 blocked / pending / unknown，不创建 Runtime run。 |
| `L2M-UP-004`：Runtime committed material / handoff source family 与 outbound / observation 承接方向。 | CP03 reception、CP04 publication、CP05 observation、semantic Event、downstream adapter。 | 仅承接 safe ref / material 与 local attempt / gap；不声明 delivered、accepted、observed、conversation fact 或 evidence。 |
| `L2M-UP-005`：member-specific Core shared schema、event family、type / source / subject / payload / route。 | 14 Consumers、24 semantic Events、event Port、outbox candidate、03 protocol和05 contract tests。 | Core shared primitive / envelope 类别可用；member-specific carrier 继续 pending，不 shadow schema、不定 topic / route。 |
| `L2M-UP-006`：启动凭据 issue / revoke / verification owner、形态与身份锚关联合同。 | CP01 admission、credential Port、配置 / secret reference 说明、negative tests。 | 凭据形态不假设 JWT、token、TTL 或 secret storage；不可验证时 rejected / blocked，不能建立 presence。 |
| `L2M-UP-007`：screening rule source matrix、safe result shape 与风险 taxonomy。 | CP02 screening、CP06 Policy resolution、subscription / delivery precondition、配置验证和安全测试。 | 仅消费正式结果 / safe snapshot；不定义 local allowlist、taxonomy、policy engine 或 default pass。 |
| `L2M-UP-008`：non-project / personal 的第三种 execution subject、identity relation 与 lifecycle。 | CP01~CP07 subject-bearing结构、future product scope与验收。 | 当前仅 project-scoped 正向路径；非项目型输入 fail-closed，不以 `GlobalMemberRef` 或 workspace view 替代。 |
| local member truth 的物理 persistence、unit-of-work、durability、recovery、idempotency carrier 与 trace / observation retention。 | 34 对象的 Store、history、outbox candidate、Job、03 / 04 / 05 的可落码闭环。 | 本概要只锁 logical local consistency、append / successor 与 unknown fence；03 在不违背已稳定对象 / 状态前提下定义 physical contract。 |
| workload、capacity、backpressure、SLO / SLA、timeout / retry / retention 的量化依据和 owner。 | 04 configuration、05 test、06 acceptance和07 planning边界。 | 无正式 measurement / workload / evidence authority 时不设数字；不回流旧 P95 / SLA，后续只形成可测 / planned的结构。 |
| capability outlet 的下游 consumer contract 与是否在首批实际激活。 | CP07 `CapabilityOutletView`、source read Port、optional projection、future configuration / test。 | summary 与核心交互不依赖 outlet；outlet 可裁剪、可显示 not_available / stale / gap，且永不成为 registry / authorization。 |

## 5. 当前设计层未闭环项与影响判断

| 推进对象 | 当前判断 | 说明 |
|---|---|---|
| Step 14 正式 `02` 装配 | 不阻塞 | 风险和待确认项均有 current posture；正式正文可忠实记录，不需要脑补 external contract。 |
| 新建正式 `03-详细设计.md` | 当前不允许，且将受条件限制 | 首先需要完成 / 停审正式 `02` 并获用户明确批准；之后可展开本地对象与逻辑 Port，但 exact contracts 继续限制受影响 lane。 |
| 03 的对象 / state / local transaction 契约 | 可在后续授权下按稳定主语展开 | 仍必须为每个字段、Port read、state transition、history / projection提供闭环；不得用 pending seam 填空。 |
| 03 的 positive external adapter / carrier / protocol | 条件阻塞 | 依赖对应 `L2M-UP-001~008` 的正式 authority；只能先定义 blocked-aware boundary。 |
| 04 配置设计 | 条件阻塞 | 先由03定义 effective config / validation契约；pending seam 未闭口前不得以配置激活未知 host / Runtime / event / credential合同。 |
| 05 / 06 测试与验收 | 条件阻塞 positive cases / evidence | 可设计 local / negative / fake / blocked-aware coverage；不得声明 external test、run、artifact、report、evidence或 readiness。 |
| 07 实施计划 | 可在其正式门禁满足后记录 planned skeleton | exact contracts仍应以 planned / blocked / waiting呈现，不得伪造 commit、run_id、result、evidence、verdict或 signoff。 |

## 6. 当前材料诊断与取舍

| 诊断 | 未采用做法 | 采用取舍 |
|---|---|---|
| 把所有开放 seam 都称为“风险”。 | 风险与缺失定论混写，后续无法判断是否应收紧结构还是等待 owner。 | owner / body / state / dependency越界记风险；exact contract 缺失记待确认。 |
| 把 Step 12 已收稳主语重新列为 pending。 | 详细设计误以为可以自行改业务组成部分、对象或接口分类。 | 稳定主语只在 Step 12 承接；本 Step 只写威胁它们的风险。 |
| 将 sibling 并行讨论中的材料当正式答案。 | 并行窗口反向定义 truth，造成错误集成假设。 | 只读正式或明确可引用材料；其余保持 `L2M-UP-*` pending。 |
| 将 future test、configuration、implementation工作写进风险表。 | 风险表退化成项目看板并伪造执行进展。 | 只说明对后续设计的条件影响；不写任务、负责人、排期、run或结果。 |

## 7. 回填草稿

正式 `02-概要设计.md` §13 应使用两张主表：

1. §3 的“风险 / 影响 / 当前处理口径”表，压缩保留 owner、subject、screening、state、body、unknown fence、derived overreach、dependency、historical pollution 与 contract drift 风险；
2. §4 的“待确认 / 影响范围 / 当前挂起口径”表，逐项保留 `L2M-UP-001~008`，并列出 local persistence、量化依据与 optional outlet consumer contract；
3. 用一段简短说明明确：这些项不推翻本次概要设计的 local / negative / blocked-aware 结构，但限制 exact carrier、configuration activation、positive integration、test evidence 与 readiness；
4. 不写风险矩阵、roadmap、TODO、实施任务、完整测试或解决方案。

## 8. Step 13 停审与进入下一步条件

| 审查项 | 结论 | 说明 |
|---|---|---|
| 风险与待确认明确分离 | pass | 风险均有已知失效模式与当前约束；待确认均有缺失 authority 与挂起上限。 |
| 已稳定承接项未被重新挂起 | pass | 七个组成部分、34对象、接口分类、流、状态和配置红线仍仅属于Step 12的稳定输入。 |
| `L2M-UP-001~008` 完整且诚实 | pass | 全部保留 pending / blocked / fail-closed口径，未生成 schema、route、credential、image或Runtime假闭口。 |
| 影响后续文档的条件清楚 | pass | 明确了02装配不受阻、03~07的条件限制及禁止 positive claim。 |
| 未滑入任务 / 实施 / 伪造事实 | pass | 未写TODO、排期、实施结果、commit、run、artifact、report、evidence、verdict、signoff或 readiness。 |
| 正式正文写入门禁 | hold | 只有 Step 14 才可从空文件重建正式 `02-概要设计.md`。 |

Step 13 结论为 `completed / pass / stop_review`。下一允许动作是读取 Step 14 的 SOP 与书写规范输入，更新三层台账到 `formal_document_assembly` 并创建 `02_hld_step_14_formal_document_assembly.md`；届时才允许删除并从空文件重建正式 `02-概要设计.md`。
