# Step 1. 确认测试输入边界

> 对应 SOP：`standards/document/测试方案讨论流程_SOP.md` Step 1
> 回填章节：`05-测试方案.md` §1「与上游文档的关系声明」
> 粒度参考：`projects/L1-governance/design-calibration/05_test_plan_step_01_input_boundary.md`
> 日期：2026-09-03

## 1. Step 状态

| 项目 | 结论 |
|---|---|
| 当前 Step | Step 1：确认测试输入边界 |
| 当前状态 | `completed / pass_with_explicit_blockers / stop_review` |
| 执行模式 | `full-restart + single-agent-serial` |
| 正式文档写入 | 未允许；正式 `05-测试方案.md` 仍保留为 historical material |
| 本步输出 | 本文件、`05_test_plan_calibration_flow.md` 与项目台账更新 |
| 停审方式 | 本步完成后立即停审；未经用户确认不得创建 Step 2 |
| 实施 / 测试事实 | 无；不创建实现、测试 run、artifact、report、evidence、verdict、signoff 或 readiness |

## 2. Step 内计划

| 顺序 | 小阶段 | 可审查产物 | 完成门禁 |
|---:|---|---|---|
| 1 | 恢复与标准读取 | 台账、05 SOP / 书写规范和中间产物纪律已读取 | 当前文档 / Step / 模式明确 |
| 2 | 正式输入盘点 | `00~04`、03 test cuts、04 handoff 和专项上游清单 | 每个输入有来源、效力和用途 |
| 3 | 历史 / 污染隔离 | 旧 05 / 06、README、draft 与 sibling 状态差异表 | 旧口径不进入当前测试真相 |
| 4 | blocker 影响判定 | `L2M-UP-*`、`L2M-DDD-*`、scope gap 影响矩阵 | local / blocked-aware / future 边界可判定 |
| 5 | 回填与停审 | §1 回填草稿、待确认事项、进入下一步条件 | 不新增测试契约；停在 Step 1 |

## 3. 本步目标

确认 `L2-member` 测试方案依赖的需求、架构、概要、详细设计、配置设计和验收方向输入是否足够，并明确哪些材料可以成为当前测试设计的真相源。

本 Step 只回答：

- 当前测试方案要承接哪些需求、规则和非功能目标；
- 哪些概要 / 详细设计章节直接影响测试对象；
- 哪些验收项需要测试方案提供证据；
- 哪些内容不应在测试方案中重新定义；
- 当前上游缺口是否阻塞测试设计，若不阻塞，如何以 blocked-aware 方式进入后续 Step。

本 Step 不定义测试目标优先级、范围 / 非范围、完整测试对象、测试切口、用例编号、测试数据、环境矩阵、自动化脚本、证据编号或验收 verdict；这些分别留给 Step 2～15。

## 4. 本步输入

| 输入 | 状态 / 效力 | 本步用途 | 读取结论 |
|---|---|---|---|
| `standards/document/测试方案讨论流程_SOP.md` | normative | 抽取 Step 1 问题、输出和进入条件 | 先承接设计，再抽对象；中间产物先于正式文档 |
| `standards/document/测试方案书写规范.md` | normative | 确定正式 §1 的来源声明结构及后续 15 章主链 | 每章须列具体 calibration source；05 不做验收裁决 |
| `standards/document/设计文档编写通则.md`、`设计文档讨论中间产物规范.md`、`设计真相源闭环与可落码性标准.md` | normative | full-restart、三层门禁、事实等级、字段 / 状态 / phase 闭环 | 未确认内容不得进入正式正文 |
| `standards/document/全局项目依赖关系与裁剪规则.md` | normative | compile / runtime / event / ref / adapter / fake 分类 | 运行期 / 事件关系不得伪装 package dependency |
| `projects/L2-member/00-需求文档.md` | current formal | FR / BR / NFR、五个能力节点、数据归属、AC / VF、非目标 | 是当前需求和验收方向的首要输入 |
| `projects/L2-member/01-架构设计.md` | current formal | BC01～BC07、owner、依赖、通信、一致性、红线 | 是架构边界和测试接缝来源 |
| `projects/L2-member/02-概要设计.md` | current formal | CP01～CP07、对象 / 接口 / flow / state / exception / config 骨架 | 是对象与切口抽取的上游骨架 |
| `projects/L2-member/03-详细设计.md` | current formal | 七模块、34 对象、10 Command、16 Query、14 Consumer、24 blocked candidate、5 Job、28 状态主语、事务 / 错误 / 幂等 / 观测 | 是测试对象和正式断言名称的直接来源 |
| `projects/L2-member/design-calibration/03_ddd_step_16_test_cuts.md` | completed calibration | 模块、协议、状态、一致性、配置和 redaction 的最小验证入口 | 只表示 planned cuts，不表示实现或执行 |
| `projects/L2-member/04-配置设计.md` | current formal | 四个 P0 profile、source priority、validation、activation、sensitive / redaction、failure / degradation | 是配置与环境测试输入；`Ready` 只指 local composition |
| `projects/L2-member/design-calibration/04_config_step_12_downstream_handoff.md` | completed calibration | 05 应承接的配置负例、no-write、no-retry、blocked seam 和 zero publication config | 只提供 planned handoff，不生成测试结果 |
| `projects/L2-member/05-测试方案.md` | historical material | 识别旧对象、旧层级、旧路径和旧用例污染 | 不继承旧编号、状态、阈值、路径或断言 |
| `projects/L2-member/06-验收标准.md` | historical / direction input | 识别未来验收关注的边界方向 | 不继承旧 evidence、veto、签署或结论；当前 AC / VF 以 `00` 为准 |
| `projects/L2-runtime/00~07` | current upstream | loop / context / plan / outcome 的 owner、entry / handoff seam 和开放项 | member 只测入口 / safe material 接缝，不测 Runtime 内部真相 |
| `projects/L2-tools/00~07` | current upstream | tool action contract、safe view / definition ref 的 owner | member 只测能力出口引用和安全视图，不测工具执行 / registry |
| `projects/L0-core` 当前正式链 | foundation | shared ID / ref / metadata / error、envelope 类别、CloudEvents / W3C authority | Core 是唯一 compile candidate；member-specific schema 仍受 `L2M-UP-005` 约束 |
| `projects/L0-bus` 当前正式链 | foundation | 事件协作和 delivery truth 外置 | 只测 collaboration seam；不把 event 关系写成 package dependency |
| `projects/L0-sdk` 当前正式链 | downstream boundary | SDK / product 入口的消费边界 | 不进入 member package 或本仓测试真相 |
| `projects/L1-work` 当前正式链 | truth input | ProjectMember 执行主语来源 | 只验证 project subject ref 关联，不验证 Work 生命周期 |
| `projects/L1-identity` 当前正式链 | truth input | GlobalMember 身份锚和安全摘要来源 | 不验证身份生命周期、签发或撤销 |
| `projects/L1-governance` 当前正式链及其测试校准粒度 | truth input / granularity reference | Policy effective / Decision 外置边界、模块 / 切口表达粒度 | 不复制 Governance owner 或其业务对象 |
| `projects/L1-conversation` 当前正式链 | truth input | 对话正文 / ordering / visibility truth 外置，member 只交 body-free material | 不测试 UI / conversation 内部实现 |
| `projects/L1-artifact` 当前正式链 | truth input / granularity reference | artifact / evidence 正文与证据真相外置 | member 只交 ref / safe material，不声明 evidence |
| `projects/L2-member-service` 当前正式或明确可引用材料及台账 | sibling pending | host request / signal / report 与 acceptance / registry / session / health owner 分层 | exact IPC、credential、positive host qualification 仍 blocked |
| `projects/L2-member-images` 当前正式或明确可引用材料及台账 | sibling pending | pinned component / image supply 外置方向 | exact release / manifest / compatibility / readiness 仍 blocked |

## 5. SOP 问题回答

| 问题 | 回答 | 依据 |
|---|---|---|
| 当前测试方案要承接哪些需求、规则和非功能目标？ | 承接 `00` 的 `C-L2M-1~5`、`FR-L2M-001~012` 与 `FR-L2M-E01~E03`、`BR-L2M-001~030`、`NFR-L2M-001~016`、`AC-L2M-001~033`、`VF-L2M-001~009`，以及双锚在场、owner 分层、body-free、fail-closed、local-truth-first、Query no-write、Unknown fence、duplicate / late / out-of-order、Core-only compile 和 pending 不伪闭口等红线。 | `00` §2、§4、§7、§9～§15 |
| 哪些概要 / 详细设计章节直接影响测试对象？ | `02` §4～§13 提供 CP01～CP07、34 对象、接口、处理流、状态、异常、配置影响和详细设计承接；`03` §4～§15 直接提供 planned workspace、七模块、对象 / Port、10 Command、16 Query、14 Consumer、24 blocked candidate、5 Job、28 状态主语、事务 / 一致性、错误 / 恢复、并发 / 幂等、配置 / adapter、观测 / 审计和最小测试切口。 | 当前正式 `02` / `03` 与 `03_ddd_step_16_test_cuts.md` |
| 哪些验收项需要测试方案提供证据？ | `00` 的 `AC-L2M-001~033` 和 `VF-L2M-001~009` 是未来 evidence / veto 的需求方向；`04` §12 的 configuration isolation、local mutation safety、invariant protection、sensitive handling、external semantics、24 candidate zero configuration 也需要测试方案规划证据。测试方案只定义 evidence 产出面，不填写执行结论或验收 verdict。 | `00` §14、`04` §12、05 SOP Step 13 |
| 哪些内容不应在测试方案中重新定义？ | 不重新定义需求编号和语义、owner / 架构方案、CP / 对象 / 字段 / DTO / enum / state / Port / Store / flow / error / transaction / idempotency / config key、物理 DB / Bus / transport / runner、实现顺序、commit、测试结果、artifact instance、report、evidence instance、signoff 或 readiness。也不测试相邻仓完整内部状态机。 | 05 书写规范 §2～§4；`03` §1～§17；全局依赖规则 |
| 当前上游是否存在会阻塞测试设计的缺口？ | 存在多个会阻塞正向外部 qualification、受影响 P0 lane 的 1:1 positive oracle、真实执行和 evidence instance 的 blocker，但不阻塞当前 Step 1 或 local / negative / blocked-aware 测试方案设计。`L2M-UP-005` 下 24 个 outbound semantic candidates 只能测试为 zero-materialized / blocked boundary；`L2M-DDD-*` 与 `scope_supersede_gap` 受影响 lane 只能保留拒绝、阻塞、unknown 或 design-gap 口径。 | 项目台账 §5；`03` §1、§7～§17；`04` §14 |

## 6. 当前文档问题诊断

| 位置 | 当前问题 | 本 Step 处理 |
|---|---|---|
| 旧 `05-测试方案.md` | 以 MemberRuntimePersona、endpoint、exposed capability、ExecutionActorBinding、旧 API / 状态和旧 dev / test / staging 假设组织，缺少当前正式 `03` 的协议分母、Query no-write、typed replay、28 状态主语、blocked candidate 和固定 artifact / report 规则 | 标记为 historical；后续 Step 15 删除并按 15 章主链重建，不继承旧 TC / EV 或阈值 |
| 旧 `06-验收标准.md` | 以旧测试方案为前置，并含旧对象、旧断言和未绑定当前 `00` AC / VF 的验收表 | 仅保留方向提示；未来 `06` 由 `00~05` 独立重建 |
| `README.md` | 含 CloudEvents、AG-UI、UDS、launch token、B1～B6、Rust / supervisord、P95 数字等未经当前 owner 全部核验的历史口径 | 逐项隔离；CloudEvents / W3C 只经 Core 当前 authority 承接，其余不进入测试输入 |
| `draft/` | 是已确认的预推演，回答作用、交互、功能和分层，但不是正式真相源 | 可作讨论背景；测试断言必须回到正式 `00~04` |
| 当前 `03` | 已有 planned minimum test cuts，但尚无正式 05 的测试目标、用例、数据、环境、门禁、证据和回归矩阵 | 后续 Step 2～14 分别展开，不在本 Step 越界补齐 |
| 当前 `04` | 已给出 profile、配置项、失败和测试承接，但尚无测试场景 / suite / EV 实例 | 作为 Step 8～10、12～13 的输入；不把 planned handoff 当执行事实 |
| sibling / upstream | host、Runtime entry、handoff、Core member-specific schema、credential、screening taxonomy、image release 等 exact seam 未全部闭口 | 记录稳定 blocker ID；设计 blocked-aware negative / refusal cuts，不以 fake / adapter / default 补齐 |

## 7. 改动前后对比

| 项 | 改动前 | 改动后 | 理由 |
|---|---|---|---|
| 测试方案入口 | 旧 05 可被误读为当前测试基线 | 以本 flow 和 Step 1 为唯一讨论入口，正式 05 延后到 Step 15 | 符合中间产物先于正式文档 |
| 需求 / 验收来源 | 旧 05 / 06 口径混入正文 | 当前 `00` 的 FR / BR / NFR / AC / VF 作为需求输入，旧 06 仅作方向 | 保持权威顺序和可追溯性 |
| 测试对象来源 | 旧 persona / endpoint / binding 叙述 | 由 `02`、`03` 和 `03_ddd_step_16_test_cuts` 抽取 | 防止测试对象脱离正式设计契约 |
| 配置测试来源 | 旧环境与配置假设 | 由 `04` 的四个 P0 profile、strict JSON、redaction、failure、no-write 和 blocker handoff 承接 | 避免历史产品 / 环境回流 |
| 外部协作测试 | 旧文档倾向把宿主、Runtime、Bus 视为可直接联调 | 只测试 typed ref、safe result、attempt / gap、blocked / waiting / unknown 接缝 | 保持 owner 与依赖类型真实 |
| 证据口径 | 旧 05 使用未固定的日志 / 报告路径 | 后续统一使用 `artifacts/test/<run_id>`、`reports/runs/<run_id>`、`reports/acceptance`；当前只规划，不生成实例 | 满足 05 书写规范 §4.6 / §5.13 |
| 事实等级 | 旧文本存在“成功”“报告”“可用”等易被当执行事实的表述 | 当前只写 planned / blocked-aware 设计；不写 run、artifact、report、evidence、verdict、readiness | 防止伪造执行证据 |

## 8. 测试设计取舍

| 议题 | 方案 A | 方案 B | 结论 |
|---|---|---|---|
| 是否直接改写正式 05 | 直接在旧文件上增量修改 | 先创建 flow / Step 中间产物，Step 15 再重建 | 采用 B；旧文件先隔离，避免历史污染 |
| 是否继承旧测试对象与编号 | 继承旧 persona / endpoint / `TC-001` 等 | 以后续 Step 从正式设计重新分配测试切口、TC / EV 族 | 采用 B；本 Step 不创建 TC / EV 编号 |
| 是否等待 06 才设计 05 | 等新版 06 完成 | 以 `00` 的 AC / VF 和 `04` planned handoff 先规划证据面 | 采用 B；05 先定义“怎么测”，06 再裁决“是否通过” |
| 是否要求真实外部产品作为 P0 前置 | 真实 host / Runtime / Bus / provider 全部可用 | local fake / controlled / disabled / replay seam，正向外部 qualification 另列 blocked | 采用 B；不把产品未锁定误作测试方案阻塞 |
| 如何处理开放 blocker | 用 default、fake 或 adapter 继续给正向 pass | 保留 blocker ID，设计 refusal / blocked / waiting / unknown 测试姿态 | 采用 B；不伪关闭 owner 合同 |
| 如何处理 24 outbound semantic candidates | 预建 event / publisher / outbox / route 以便测试 | 只测试 `Blocked(L2M-UP-005)` 与 zero configuration / non-materialization | 采用 B；符合 `03` 与 `04` 的硬边界 |

## 9. 结构化中间产物

### 9.1 权威层级与消费关系

| 层级 | 材料 | 当前效力 | 测试方案消费方式 |
|---|---|---|---|
| L0 normative | 测试 SOP、书写规范、通则、中间产物规范、真相源标准、全局依赖规则 | 最高 | 决定流程、格式、证据路径、依赖分类和事实等级 |
| L1 current formal | 本仓 `00~04` | 当前项目设计真相 | 需求、架构、HLD、DDD、配置的直接测试输入 |
| L2 direct calibration | `03_ddd_step_16_test_cuts`、`04_config_step_12_downstream_handoff`、本仓 05 Step 1~14 | 解释与展开输入 | 提供最小切口、测试承接、取舍和 blocker 影响；不能覆盖正式正文 |
| L3 upstream / foundation | Runtime、Tools、Core、Bus、SDK、Work、Identity、Governance、Conversation、Artifact 当前材料 | 外部 owner / shared authority | 只确定 seam、引用和依赖类型；不把外部内部实现纳入 member 测试 |
| L4 sibling | member-service、member-images 当前明确可引用材料 | pending boundary input | 只记录 owner 方向与缺口；exact positive contract 进入 blocked / future |
| L5 historical | README、旧 05 / 06、draft、旧协议 / 指标 / 载体 | 只作污染审计 | 不作为测试断言、编号、路径、阈值或执行事实来源 |

### 9.2 上游输入映射表

| 来源文档 / 材料 | 测试输入 | 回填章节 |
|---|---|---|
| `00-需求文档.md` | `C-L2M-1~5`、`FR-L2M-001~012` / `E01~E03`、`BR-L2M-001~030`、`NFR-L2M-001~016`、数据归属、禁止行为、`AC-L2M-001~033`、`VF-L2M-001~009`、依赖分类 | §1、§2、§5、§6、§7、§10、§12、§13、§14 |
| `01-架构设计.md` | BC01～BC07、职责 / 非职责、上下文边界、依赖方向、local-truth-first、一致性、body-free、fail-closed、横切红线和演进风险 | §1、§2、§3、§4、§8、§10、§14 |
| `02-概要设计.md` | CP01～CP07、实现分层、34 对象轮廓、接口骨架、关键 flow、状态流转、异常边界、配置影响和 03 承接 | §1、§3、§4、§6、§8、§10 |
| `03-详细设计.md` | 七模块、34 对象、10 Command、16 Query、14 Consumer、24 blocked candidate、5 Job、28 状态主语、Store / UoW / replay、错误 / 恢复、并发 / 幂等、配置、观测、最小测试切口 | §1、§3、§4、§6、§7、§8、§9、§10、§11、§12、§13、§14 |
| `03_ddd_step_16_test_cuts.md` | contracts / domain / application / infra / api / worker / jobs / observability cuts，协议分母，状态 / 一致性 / redaction cut | §3、§4、§6、§9、§10、§13 |
| `04-配置设计.md` | source priority、四个 P0 profile、strict validation、activation、sensitive / secret / redaction、failure / degradation、no-write / no-retry、24 candidate zero-config | §1、§2、§7、§8、§9、§10、§12、§13、§14 |
| `04_config_step_12_downstream_handoff.md` | 配置负例、fake / blocked parity、required / optional slot、Query / Consumer / Job 安全姿态和下游证据边界 | §1、§8、§9、§10、§12、§13 |
| `L2-runtime/00~07` | Runtime loop / context / plan / outcome 外置，entry / handoff seam，`Q-L2R-001` 等开放项 | §1、§2、§3、§6、§8、§10、§14 |
| `L2-tools/00~07` | Tool action contract、safe definition / capability ref、execution / registry 外置 | §1、§2、§3、§6、§8、§10、§14 |
| `L0-core`、`L0-bus`、`L0-sdk` | shared primitive / envelope authority、event delivery truth、SDK consumer boundary | §1、§3、§8、§10、§13、§14 |
| `L1-work`、`L1-identity`、`L1-governance`、`L1-conversation`、`L1-artifact` | ProjectMember / GlobalMember、Policy effective / Decision、body-free conversation / artifact ref / evidence boundary | §1、§2、§3、§6、§10、§13、§14 |
| `L2-member-service`、`L2-member-images` | host owner / image supply direction、pending / blocked exact contract | §1、§2、§3、§8、§10、§14 |
| 旧 `README.md`、旧 `05/06`、`draft/` | 历史对象、协议、载体、指标和写法污染 | 只进入 calibration 诊断 / 风险，不进入正式测试断言 |

### 9.3 测试方案必须回答的问题清单

后续 Step 2～14 必须回答以下问题；本 Step 只固定问题边界，不提前给出用例答案：

1. 哪些 `FR / BR / NFR / AC / VF` 是 P0，哪些可延后为 P1 / P2，非范围风险由谁承接？
2. CP01～CP07、七模块、对象、协议、状态、事务、错误、配置和观测分别对应哪些测试对象 / 切口？
3. 每个 P0 切口在哪个层级发现：contract、unit、service、integration-like、API / worker、Job、release gate？
4. 每个 P0 需求和设计契约如何双向追溯到场景、TC、suite、EV 和未来 AC？
5. 每个用例的正式字段、状态、错误、phase、前置数据、断言和证据如何落地？
6. 失败、duplicate、late、out-of-order、version conflict、commit unknown、stale、gap 和 blocked 如何可重复构造和判定？
7. local-dev、ci-test、integration-like、operations-replay 需要哪些依赖和配置，哪些是 compile / runtime / event / ref / adapter / fake？
8. 哪些 suite 进入 PR / CI / nightly / staging / release gate，失败如何阻断，artifact / report 如何生成和脱敏？
9. 非功能、redaction、低基数观测、Query no-write、Job no-truth-repair、projection 不反写和 24 candidate zero-config 如何验证？
10. 哪些缺陷必须阻断，修复后回归哪些用例，哪些未覆盖风险需要进入 `06` 或由责任人接受？

### 9.4 设计测试边界与外部接缝

| 领域 | member 测试可验证 | 不在本仓测试范围 | 未闭口时预期 |
|---|---|---|---|
| CP01 / host | 双锚受理、local presence、request / signal / report material、attempt / blocked posture | host acceptance、registry、session、health、container lifecycle、credential issue | invalid / blocked / degraded / unknown；positive host lane blocked |
| CP02 / inbound | subscription source、screening disposition、body-free record、controlled delivery decision | Bus delivery、Governance policy truth、Runtime admission、raw body persistence | conservative blocked / waiting / rejected；正向 taxonomy pending |
| CP03 / Runtime mediation | typed ref、safe context、delivery decision、submission attempt、result link、material reception | run / context / plan / outcome truth、Runtime trigger implementation、transport | blocked / waiting / unknown；不代答、不创建 run |
| CP04 / outbound | committed safe source check、body-free material gate、local publication attempt / gap | Runtime outcome、Bus delivery、Conversation / Artifact / observed truth、24 Event realization | source rejection / blocked / gap；24 candidate zero |
| CP05 / trace | correlation、body-free trace / observation material、local handoff attempt / gap | observability backend、complete log、evidence verdict | local attempt / gap；不声明 observed |
| CP06 / mirror | typed source ref、safe snapshot、neutral resolution、freshness / gap | foreign truth、authorization、registry、definition body | stale / unavailable / blocked；refresh positive受 DDD gap 约束 |
| CP07 / read model | summary / diagnostic / outlet projection、freshness、rebuild no-write | source truth、authorization、capability registry、UI rendering | stale / not-available / gap；不反写 |

### 9.5 blocker 影响矩阵

| blocker | 被阻塞的测试设计 / 执行面 | 当前可保留的测试面 | 不允许的替代 |
|---|---|---|---|
| `L2M-UP-001` | host exact carrier、positive registration / session / health qualification | local material formation、owner boundary、unavailable / feedback mapping | 用旧 gRPC / UDS / heartbeat 形态伪造正向联调 |
| `L2M-UP-002` | pinned release、manifest、compatibility、assembly readiness | opaque ref、source unavailable、blocked handoff | 用镜像目录存在或 fake image 当 release pass |
| `L2M-UP-003` | Runtime entry trigger / positive admission | delivery pre-gate、typed mapping refusal、waiting / blocked | 自定义 Runtime payload 或直接调用 run |
| `L2M-UP-004` | committed handoff source family、positive outbound / observation route | source validation、body-free rejection、attempt / gap | 把 local attempt 写成 delivered / observed |
| `L2M-UP-005` | member-specific event schema / route、publisher、outbox、delivery | 24 candidate zero configuration / non-materialization check | 预建 event envelope、topic、route、retry、DLQ 或 receipt |
| `L2M-UP-006` | credential issue / verify exact positive path | missing / conflict / unverifiable fail-closed | 假设 JWT、launch token、TTL 或 secret provider |
| `L2M-UP-007` | positive screening taxonomy / policy result | unknown / stale / conflict conservative posture | 自建 allowlist、default pass 或旧 Attention 算法 |
| `L2M-UP-008` | non-project / personal subject extension | project double-anchor and invalid-subject refusal | 用 GlobalMember / workspace view 代替 ProjectMember |
| `L2M-DDD-001` | real implementation / test execution | planned contract and no-execution boundary | 以文件存在或 fake 产出 execution evidence |
| `L2M-DDD-002` | physical durability / crash / performance claims | logical Store / UoW / fake parity design | 猜 DB、isolation、queue 或 durability SLA |
| `L2M-DDD-003` | complete Consumer receipt / source reconstruction | pre-gate refusal、missing / wrong carrier、blocked receipt path | default authority / schema / fake map 重建 receipt |
| `L2M-DDD-004` | CP04 attempt / gap positive relay | unsafe source rejection、blocked / gap marker boundary | 猜 attempt / gap ref 或 unsupported selector |
| `L2M-DDD-005` | CP05 observation Unknown relation | Unknown fence、inspect-first refusal | 伪造 observed、gap link 或 retry success |
| `L2M-DDD-006` | CP06 refresh initial gap helper | invalid / blocked refresh input | 直接设 `ResolutionPending` 或绕过 factory |
| `L2M-DDD-007` | CP07 rebuild / reconciliation helper / version | read-side stale / not-available / no-write | 用 watermark / cursor / object method 冒充 Store version |
| `scope_supersede_gap` | ReplaceSubscriptionScope positive successor | invalid / blocked transition | 用 repository save 替代 domain helper |

### 9.6 事实等级和后续状态标签

后续 Step 允许使用以下设计状态，但不得混为执行结论：

| 标签 | 含义 | 可否作为 05 设计输入 |
|---|---|---|
| `designed_local` | 本仓逻辑契约有完整本地 oracle，可规划测试 | 可以 |
| `designed_blocked_aware` | 本地拒绝 / blocked / unknown oracle 可规划，外部正向资格未闭口 | 可以，须保留 blocker |
| `future_not_in_p0` | P1 / P2 或未激活能力 | 只能进入未来 / 残余风险 |
| `not_evaluable_until_contract` | 缺少 owner / schema / helper，连正向测试断言都不能 1:1 固定 | 只能进入待确认 / blocked |
| `planned_not_generated` | 未来 TC / EV identity 可规划，但尚无执行实例 | 设计文档允许；不得写 evidence 已存在 |

## 10. 回填草稿：正式 `05-测试方案.md` §1

> 校准来源：
> - `design-calibration/05_test_plan_step_01_input_boundary.md`
>
> 延伸阅读：
> - 建议继续阅读上述中间产物的“结构化中间产物”“回填草稿”和“待确认事项”小节，了解测试输入、历史隔离和 blocker 处理如何收敛。

## 1. 与上游文档的关系声明

本测试方案只定义如何验证当前正式需求、架构、概要、详细设计和配置设计；不重新定义需求、owner、实现契约、物理产品、验收结论或实施计划。旧 `05/06`、README 和 draft 只作为历史 / 污染审计输入。

| 来源文档 | 测试输入 | 本文如何使用 |
|---|---|---|
| `00-需求文档.md` | `C-L2M-1~5`、`FR-L2M-001~012` / `E01~E03`、`BR-L2M-001~030`、`NFR-L2M-001~016`、`AC-L2M-001~033`、`VF-L2M-001~009`、数据归属和依赖边界 | 转成测试目标、范围、覆盖矩阵、负向红线、证据和残余风险；不重定义需求语义 |
| `01-架构设计.md` | BC01～BC07、职责 / 非职责、上下文、依赖分类、通信、一致性、body-free、fail-closed 和演进红线 | 转成架构边界、接缝、分层和专项测试；不重新选择架构 |
| `02-概要设计.md` | CP01～CP07、对象轮廓、接口骨架、处理流、状态、异常和配置影响 | 转成测试对象、切口、场景和分层；不新增主要组成部分 |
| `03-详细设计.md` | 七模块、对象、10 Command、16 Query、14 Consumer、24 blocked candidate、5 Job、28 状态主语、事务 / 错误 / 幂等 / 观测和最小测试切口 | 作为字段、状态、协议、错误、phase 和一致性断言的直接来源；受 blocker 约束 |
| `04-配置设计.md` | 四个 P0 profile、source priority、strict validation、activation、sensitive / redaction、failure / degradation、no-write / no-retry 和 zero publication config | 转成环境 / 配置、失败、自动化、证据和验收承接；不把 local Ready 当 external readiness |
| `06-验收标准.md` | 仅作旧方向提示；当前验收需求以 `00` 的 AC / VF 为准 | 为后续证据 / 追溯设计提供方向，不继承旧 verdict / evidence / veto |

Runtime、Tools、Core、Bus、Work、Identity、Governance、Conversation、Artifact、member-service 和 member-images 只作为正式 owner / seam 输入；测试方案只验证 `L2-member` 可归属的本地事实与接缝行为，不验证相邻仓的完整内部实现。

当前未闭口的 `L2M-UP-001~008`、`L2M-DDD-001~007`、`scope_supersede_gap` 及 `L2M-UP-005` 下 24 个 outbound semantic candidates，不阻塞 local / negative / blocked-aware 测试设计，但会阻塞受影响正向 qualification、真实执行、evidence instance 和 readiness 声明；后续测试必须显式保留其状态。

## 11. 待确认事项

| 事项 | 影响 | 截止点 | 当前处理 |
|---|---|---|---|
| 用户是否确认从 Step 1 进入 Step 2 | 允许创建范围与优先级中间产物 | Step 2 开工前 | 当前停审，等待用户确认 |
| `L2M-UP-001~008` exact owner / schema / route / credential / subject contract | 影响正向外部测试、环境和 evidence qualification | 对应 owner 合同闭口前 | 只做 local / negative / blocked-aware 设计 |
| `L2M-DDD-001~007` 与 `scope_supersede_gap` | 影响受影响 lane 的 1:1 positive oracle 和实现执行 | 进入对应测试切口前 | 保留 design-gap、blocked、unknown 或 refusal，不私补 helper / schema |
| `06-验收标准.md` 当前仍是历史草稿 | 影响未来 evidence / verdict 消费面 | 05 Step 13～15、06 Step 1 | 当前以 `00` AC / VF 和 `04` planned gates 作为方向输入 |
| 物理 DB / Bus / transport / runner / report backend 未锁定 | 影响真实 integration / performance / evidence 执行 | Step 8～13 与实现授权前 | 使用 product-neutral fake / controlled / replay 设计，不选择产品 |

## 12. 进入下一步条件

- [x] 已读取项目台账、05 SOP、05 书写规范和中间产物规范。
- [x] 当前正式 `00~04`、`03` test cuts、`04` test handoff 已列入输入清单。
- [x] 旧 05 / 06、README、draft 与 sibling in-progress 材料已按效力隔离。
- [x] 需求、设计、配置、验收方向与后续测试章节的映射已形成。
- [x] `L2M-UP-*`、`L2M-DDD-*`、`scope_supersede_gap` 和 24 candidate 的影响及安全测试姿态已记录。
- [x] 本 Step 未新增字段、状态、接口、错误、配置、TC / EV 或执行事实。
- [ ] 用户确认后，才可创建 `05_test_plan_step_02_scope.md`。

## 13. 停审结论

Step 1 已完成。当前测试方案的输入边界清晰：正式 `00~04` 是项目设计输入，`03` test cuts 与 `04` handoff 是直接校准输入，专项上游 / sibling 只提供 owner / seam，旧 05 / 06、README 和 draft 只作历史审计。开放 blocker 不阻塞 local / negative / blocked-aware 测试设计，但阻塞受影响正向 qualification、真实执行、evidence instance 和 readiness；不得用 fake、default、adapter 或历史协议关闭它们。

```text
step_01 = completed
gate_status = pass_with_explicit_blockers / stop_review
next_allowed_action = wait_for_user_confirmation_before_create_step_02_scope
formal_05_write_allowed = false_until_step_15
implementation_repo_write_allowed = false
test_execution_allowed = false
commit_required = false
```
