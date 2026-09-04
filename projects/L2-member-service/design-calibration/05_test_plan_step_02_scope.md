# Step 2. 明确测试目标、范围和非范围

> 对应 SOP：`standards/document/测试方案讨论流程_SOP.md` Step 2
> 回填章节：`05-测试方案.md` §2

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 2 测试目标、范围和非范围 |
| 当前状态 | `completed / pass_with_upstream_blockers` |
| 目标 | 固定 P0 / P1 / P2，防止测试范围吞并外部 truth |
| 停审结论 | P0 可执行；正向跨仓联调仍受 MSVC-UP blocker 约束 |

## 2. 本步输入

| 输入 | 关键内容 |
|---|---|
| Step 1 | 新版输入基线、历史材料处理和测试边界 |
| `00` §7、§9~§14 | C-MS、FR-MS、NFR-MS、AC-MS、VF-MS |
| `01` §4、§6~§13 | Host Truth、依赖裁剪和产品中立 |
| `03` §15 | 最小 test cuts 与 fake / placeholder 上限 |
| `04` §2、§6、§11~§14 | profile、配置失败、下游承接和 pending |

## 3. SOP 问题回答

| 问题 | 回答 |
|---|---|
| P0 主线必须证明什么？ | C-MS-1~5 的本地控制面成立：项目型双锚、显式意图 / 决定、装配与 readiness 分层、注册 / session 壳、健康 / recovery / closure / reconciliation、safe material / handoff 分层、UoW / 幂等 / no-write / redaction。 |
| P1/P2 怎么处理？ | P1 验证真实或 real-like adapter 接缝；P2 保留生产 profile、容量、深度集成和外围优化候选；二者不作为当前 P0 ready 前置。 |
| 哪些只测接缝？ | Identity、Work、Member、Images、Runtime、Sandbox、carrier、Bus、Observability、容器 / 编排和 registry 只测 typed ref、safe snapshot、availability、failure marker、反馈层，不测对方内部真相。 |
| 哪些是一票否决关联？ | `VF-MS-001~009` 全部转成 P0 负向或 release-gate 检查，尤其 zero implicit host、no owner truth migration、required seam no-bypass、body-free、unknown fence、dependency boundary 和 evidence honesty。 |

## 4. 范围 / 非范围结构化表

| 范围项 | 类型 | 优先级 | 验证目标 | 非目标 / 说明 |
|---|---|---|---|---|
| Host intent、ProjectMemberRef / GlobalMemberRef 双锚 | core truth | P0 | 受理、拒绝、等待和稳定决定可判定 | 不测试 Work / Identity 正文 |
| qualification、assembly、readiness | assembly truth | P0 | owner/ref/scope/freshness 和 required item 共同门禁 | 不解析 Role→image，不拥有 policy / credential truth |
| Member registration、endpoint、Host Session 壳 | session truth | P0 | 注册 / 替换 / 失效、single-active、旧世代拒绝 | 不测试 Member 主体或 Runtime run/turn |
| health signal、assessment、failure、recovery | host health | P0 | host/session/backend/unknown 分层、显式处置和 generation fence | 不把心跳等同业务成功 |
| closure、cleanup、residual、reconciliation | closure truth | P0 | local invalidation、attempt、gap、residual 和 case 分层 | 不宣称外部 cleanup complete |
| HostFactMaterial、Handoff、Outbox、Projection、History | handoff / derived | P0 | immutable snapshot、四层 handoff、projection no-write source | 不锁 Bus / Observability 产品 |
| 10 Command、6 Query、5 Consumer、1 material helper、7 Job | protocol | P0 | 每个入口有 accepted/negative 入口和正式 disposition | 不补 Core/Bus exact schema |
| 配置 profile、strict JSON、builder、redaction | configuration | P0 | profile isolation、fail-fast/fail-closed、无敏感输出 | 不定义配置产品或 secret provider |
| real-like adapter / durable-like / route 互操作 | seam | P1 | 验证 adapter failure mapping 和跨仓互操作 | 未闭合合同保持 waiting |
| staging/production profile、容量、性能硬阈值 | operations | P2 / future | 后续由 authority、workload、环境定义 | 当前不做 P0 通过依据 |
| LLM loop、goal/plan、memory/checkpoint、tool execution、capability registry | forbidden scope | 不测 | 只验证边界不被本仓写入 | 归 Runtime / Tools / Capability owner |
| Member 主体、Images 内容 / build / provenance、Sandbox backend/policy、Governance approval、L1 truth、Observability backend | forbidden owner truth | 不测内部 | 只测安全 ref / snapshot / marker 接缝 | 由各 owner 负责 |

## 5. P0 / P1 / P2 口径

| 优先级 | 定义 | 测试输出 |
|---|---|---|
| P0 | 本地控制面和边界可重复验证；不依赖未闭合外部产品 | 可执行 TC、负向断言、planned suite、证据路径 |
| P1 | controlled / real-like seam 的互操作和故障映射 | selected-run、blocked / unavailable marker、残余风险 |
| P2 | 生产优化、容量、深度集成和外围增强 | future test trigger，不进入当前退出准则 |

## 6. 详细范围的否决关联

| VF | 测试范围承接 | P0 断言方向 |
|---|---|---|
| VF-MS-001 | C-MS-1~5 核心闭环 | 缺任一核心节点不得宣告完整 |
| VF-MS-002 | 主语与显式 lifecycle | 非项目 / 默认 actor / signal-only 不得创建宿主 |
| VF-MS-003 | owner boundary | 不得写 Identity、Work、Member、Runtime、Images、Sandbox 等 truth |
| VF-MS-004 | readiness / required seam | partial / unknown / fake 不得 ready 或 fallback |
| VF-MS-005 | forbidden body | secret / body / endpoint / manifest 不得进入任何输出面 |
| VF-MS-006 | idempotency / generation | duplicate / late / unknown 不得分叉或盲重放 |
| VF-MS-007 | result layering | attempt / receipt / snapshot 不得升级为 external completion |
| VF-MS-008 | dependency classification | 非 Core / SDK sibling 不得成为源码依赖 |
| VF-MS-009 | evidence honesty | planned / blocked / not_run 不得伪装 pass / ready |

## 7. 回填草稿

正式 §2 应以“证明 Host Truth 控制面而非接口可调用”为目标，按 P0/P1/P2 和范围 / 非范围表收口；明确只测跨仓接缝，不测试对方内部真相，并把 VF-MS-001~009 作为负向 / gate 关联。

## 8. 待确认事项与进入条件

| 事项 | 状态 |
|---|---|
| P0 / P1 / P2 可判定 | 通过 |
| 非范围有风险归属 | 通过 |
| 未闭合正向合同 | pending / blocked；不阻塞进入 Step 3 |

- [x] 范围可推导测试对象。
- [x] 非范围说明风险归属。
