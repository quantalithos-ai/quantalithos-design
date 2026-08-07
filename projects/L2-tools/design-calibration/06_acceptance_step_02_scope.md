# 06 验收标准校准 · Step 2 验收目标与范围

## 1. Step 状态

- 状态：[x] 已确认
- 对应 SOP：`standards/document/验收标准讨论流程_SOP.md` Step 2
- 回填章节：正式 `06-验收标准.md` §2

### 1.1 Step 内计划

- [x] 读取输入和前序结论：Step 1、正式 00 §2/§4/§7/§14、04 §2、05 §2~§3
- [x] SOP 问题回答：目标、P0/P1/P2、接缝、非范围、VETO、formal-name 要求
- [x] 当前材料 / 旧文档诊断：识别旧 06 范围混层和历史功能污染
- [x] 设计取舍：以裁决风险而不是“功能列表摘要”划分范围
- [x] 结构化中间产物：目标、范围、优先级、接缝、非范围和验收分区
- [x] 复杂度判断 / 是否拆模块或附录：本步不拆；逐项门禁在 Step 5~11 展开
- [x] 回填草稿：形成正式 §2 结论
- [x] 自检与进入下一步条件：范围可判定，无边界外 owner 被纳入

## 2. 本步输入

| 输入 | 承接结论 |
|---|---|
| Step 1 | 当前 `00~05` 是分层输入；旧 06 是 historical；single release seal 是唯一可消费测试资格入口 |
| 正式 00 §2/§4/§7 | L2-tools 是工具行动语义契约真相仓；五核心能力、17 核心 FR、6 外围增强和相邻 owner 边界固定 |
| 正式 00 §14 | `AC-L2T-001~039` 和 `VF-L2T-001~013` 是稳定验收需求分母 |
| 正式 03 | 41 对象、`13/11/5/4/4` protocol、37 flow、六状态族和本地一致性/redaction 边界已经闭合 |
| 正式 04 | P0 配置 schema/profile/V0~V8/B0~B8 和 `CFG-A-01~10` 方向；real/production binding 后置 |
| 正式 05 §2~§3 | P0 local/negative、P1 positive conditional、P2/future；234 concrete TC 和明确的外部接缝禁止断言 |

## 3. SOP 问题回答

1. **本轮验收的核心裁决目标是什么？**

   回答：裁决 L2-tools 是否在不吞并 Runtime、Hub、authorization、Sandbox、Bus、Observability、SDK 和 provider owner 的前提下，形成稳定、可执行、可追溯且 body-free 的工具身份/定义、binding、canonical invocation、precondition/handoff、normalized outcome/audit/safe handoff 本地真相链；同时验证证据本身真实、同 run、可复查。

2. **P0/P1/P2 验收范围如何划分？**

   回答：P0 包含当前 `03/04/05` 已闭合且可用 deterministic/fake/controlled local seam 验证的 truth、协议、状态、一致性、配置、安全和 evidence integrity；P1 是已有 typed seam 但依赖 `L2T-UP-*` 的正向 provider qualification；P2/future 是 production-like、容量/时延/SLO、长期 retention、SDK/client、产品库存和生态深度行为。

3. **哪些下游能力只验接缝？**

   回答：Runtime 只验其消费 canonical contract/result 的 server seam；Hub/Auth/Sandbox 验 typed ref/result/source/handoff、blocked 和 fail-closed；Bus/Observability 验 body-free material、local attempt 与独立 status；SDK 仅保留 future server contract boundary。不得要求这些仓完整实现，也不得把它们写成 L2 package dependency。

4. **哪些非范围会影响最终结论？**

   回答：P2/future 的缺失不影响 P0 通过；P1 positive 若本轮没有把它纳入送验 scope，则作为 open residual，不影响 local P0，但不能声明相应 readiness。若送验声明包含某个 positive seam，而 owner/证据仍缺失，则该 scope 不可通过或只能在满足 Step 13 风险资格时有条件通过。VETO、P0 evidence integrity 和 safety redline 不能因非范围而豁免。

5. **哪些范围项可能成为一票否决？**

   回答：全部 `VF-L2T-001~013`，涵盖五能力断链、identity/definition 替代、Hub registry/authorization 串线、Runtime orchestration 吸收、自我授权/隔离旁路、虚构执行事实、capture/observation 冒充 outcome、forbidden body、下游反写、本仓 owner 扩张、不可追溯、依赖裁剪失效、历史材料/结果/签署伪造。任一触发都强制总体不通过。

6. **哪些验收范围必须使用详细设计正式字段、状态或接口名？**

   回答：所有 P0 protocol、state/UoW/idempotency、Query/Job、phase/unknown fence、outcome/audit pair、config binding、observation/redaction 和 external seam gate。正式 06 不使用旧 `ToolPolicy/ToolScope`、泛化 Accepted/Completed/Delivered/Observed 或自创 topic/route/DTO。

## 4. 当前文档问题诊断

| 位置 | 旧口径 | 问题 | 当前处理 |
|---|---|---|---|
| 旧 06 §1 | 按旧 runtime/tool-host 功能说明范围 | 把本仓写成执行平台，未围绕五能力和 truth owner | 以 `C-L2T-1~5`、17 FR 和边界风险重建 |
| 旧 06 §4 | 少量功能门禁混入 policy、host callback | 使用失效对象且遗漏 binding/invocation/outcome/handoff 全链 | P0 功能范围回指 `AC-L2T-001~023` |
| 旧 06 §5~§7 | 非功能、三红线、安全治理分散 | 数据、接口、状态、配置、证据无法独立裁决 | 分配到 Step 6~11 / 正式 §6~§11 |
| 旧 06 | 未区分 local negative 与 provider positive | 容易让 fake success 关闭上游 blocker | P0/P1/P2 和 scoped qualification 显式分层 |
| 旧 06 | 未明确 agent loop、registry、Sandbox truth 等非范围 | owner 扩张风险 | 建立 excluded owner 清单并绑定 VETO |

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 验收目标 | “工具可执行/可治理”式平台目标 | 工具行动语义 contract truth 和安全消费链 | 对齐当前仓定位 |
| P0 | 旧功能和泛化质量指标 | local truth、17 核心 FR、横切契约、边界与 evidence integrity | 可由当前正式设计和测试闭合 |
| 外部正向 | 与本地功能混在一起 | P1 conditional，按 blocker/scope 单独裁决 | 不伪造 provider readiness |
| 外围增强 | 容易成为核心前置 | 只验 absent 不阻塞、present 不反写 | 承接 `AC-L2T-023` |
| 非范围 | 模糊 | 明确 owner、结论影响和 reopen 条件 | 防止“非范围”成为红线豁免 |

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 按代码模块划分验收范围 | 易对应实现目录 | 不能表达业务能力和 owner 边界；实现仓当前不存在 | 不采用 |
| 按五核心能力分全部章节 | 业务清晰 | 会把数据、接口、状态、证据横切门禁重复五次 | 不采用为全文结构，仅用于功能主线 |
| 业务 AC 为稳定分母，横切章节定义 subordinate gate 并回指 AC/VF | 兼顾稳定需求和可执行横切裁决 | 需要严格禁止派生 gate 变成第二需求 | 采用 |

## 7. 结构化中间产物

### 7.1 验收目标

| 目标 ID | 裁决目标 | 成立条件方向 | 失败后果 |
|---|---|---|---|
| `OBJ-L2T-ACC-01` | 五能力本地 truth 闭环 | `AC-L2T-001~005` 同时成立且条件路径不被写成固定外仓时序 | 核心定位不成立 |
| `OBJ-L2T-ACC-02` | 17 核心功能可消费 | `AC-L2T-006~022` 均有正式 contract/flow/state/result 和 evidence | 对应功能不可放行 |
| `OBJ-L2T-ACC-03` | 外围增强隔离 | `AC-L2T-023`：缺失不阻塞，存在时只读/派生且不扩权 | P1 污染 P0 或形成第二 truth |
| `OBJ-L2T-ACC-04` | 规则、数据和 owner 红线 | `AC-L2T-024~033` 与 `VF-L2T-*` 未触发 | 数据/架构边界失效 |
| `OBJ-L2T-ACC-05` | 结构性 NFR 和配置安全 | `AC-L2T-034~039`、`CFG-A-01~10` 以有来源的方法成立 | 安全/一致性/可观测性不足 |
| `OBJ-L2T-ACC-06` | 证据与结论可信 | matching passed release seal、manifest、同 run pairing、审查和三值裁决成立 | 不可送验或总体不通过 |

### 7.2 范围表

| 验收范围项 | 类型 | 优先级 | 裁决目标 | 非范围 / 说明 |
|---|---|---:|---|---|
| `C-L2T-1~5` 五核心能力 | 核心闭环 | P0 | identity/definition -> binding -> invocation -> precondition/handoff -> outcome/audit/safe handoff 共同成立 | 不是每次调用固定穿越五节点 |
| `FR-L2T-001~017` | 功能 | P0 | `AC-L2T-006~022` 逐项可裁决 | 不以外部完整实现替代本地语义 |
| `FR-L2T-E01~E06` | 外围增强边界 | P0 isolation / P1 implementation | 未实现不阻塞；实现时只读核心 truth、不扩 owner | 不要求 UI/SDK/管理产品实现 |
| `BR-L2T-001~042` / `DR-L2T-001~034` | 规则/数据 | P0 | 不变量、owner、truth/snapshot/ref/body 分类和禁止行为成立 | 不验相邻仓正文或 lifecycle |
| 41 objects / 37 flows / `13/11/5/4/4` protocols | 设计契约 | P0 | 正式字段、状态、flow 和 result/error 没有漂移 | 不新增旧 alias 或 transport truth |
| 六状态族、UoW/CAS/idempotency/replay/unknown | 一致性 | P0 | 合法/非法/terminal、atomic pair、one-call 和 no-repair 成立 | 不以最终字段快照替代副作用断言 |
| `04` schema/profile/V/B/CFG-A | 配置 | P0 | strict/no-fallback/atomic/no-output/isolation/redline | 不验具体 backend、endpoint、secret value |
| Query/Job/observation/redaction | 横切 | P0 | zero-write/no-repair、safe field、status separation、forbidden sweep | 不拥有 Observability store |
| Hub/Auth/Sandbox/Bus/Obs/Core/SDK seams | 跨仓接缝 | P0 negative/local parity；P1 positive | 验 typed blocked/unavailable/unknown 与禁止 fallback；positive 按 owner closure | 不验对方完整内部实现 |
| evidence seal / projection / review | 证据与裁决 | P0 | single run、final eligibility、manifest digest、redaction、review 分层 | 不生成真实 evidence 或 signoff |
| production-like / capacity / numeric SLO / retention | 非功能扩展 | P2/future | 仅保留方法、authority 和 reopen trigger | 无来源时不得写阈值通过 |
| Runtime planning/orchestration/recovery/checkpoint | owner 非范围 | excluded | 验 L2 未吸收该 truth | Runtime 自身验收不属于本轮 |
| registry/authorization/Sandbox execution/Bus delivery/Obs store/SDK client/provider/marketplace | owner 非范围 | excluded | 验接缝和不越权 | 对方内部 readiness 不属于本轮 |

### 7.3 优先级与总体结论影响

| 层级 | 进入方式 | 缺失 / 失败影响 |
|---|---|---|
| P0 hard | 默认进入本轮 | 任一 gate 失败不得“通过”；VETO / integrity / redaction 失败强制“不通过” |
| P0 structural without numeric threshold | 默认进入本轮 | 方法、结构和安全 oracle 必须成立；不得以缺数字为失败，也不得声称数字达标 |
| P1 conditional positive | 只有 scope manifest 显式纳入且 owner closure 成立 | 未纳入则 residual；已纳入却 unavailable/blocked 则该 scope 不通过或满足严格风险资格后有条件通过 |
| P2/future | 不进入当前 denominator | 缺失不影响 P0；不得在结论中声称 production/capacity/readiness |
| excluded owner | 永不成为 L2 功能通过前置 | 若 L2 实际吸收或伪造其 truth，触发 VETO |

### 7.4 验收分区与编号纪律

| 正式章节 | 主分母 | subordinate gate 用途 |
|---|---|---|
| §5 功能 | `AC-L2T-001~023` | 不新增业务 AC |
| §6 数据/架构 | `AC-L2T-024~033` | `AG-L2T-RED-*` 只作可执行红线分组，必须回指 AC/VF |
| §7 接口/同步 | 与功能/规则 AC 交叉 | `AG-L2T-IF-*` 只聚合正式 protocol family |
| §8 状态/一致性 | 与功能/NFR AC 交叉 | `AG-L2T-STATE/TX/IDEM-*` 只聚合 formal state/TX oracle |
| §9 NFR | `AC-L2T-034~039` | 不引入无 authority 阈值 |
| §10 evidence | 所有 P0 AC/VF | `EG-L2T-*` 是 evidence gate，不是 evidence instance |
| §11 VETO | `VF-L2T-001~013` | 不重编号、不合并掉任何 VF |

## 8. 回填草稿

正式 §2 应以目标表和范围表声明：P0 裁决五核心能力、17 核心功能、外围不反写、规则/数据/owner、正式 protocol/state/UoW/config/redaction 和 evidence integrity；P1 positive 只在上游 owner 闭口并进入 scope 时裁决；P2/future 不进入当前 denominator。所有 subordinate gate 只用于执行性分组，必须回指稳定 `AC-L2T-001~039` / `VF-L2T-001~013`。Agent loop、LLM planning、Runtime orchestration、registry、authorization、Sandbox execution、Bus delivery、Observability store、SDK client、provider control、inventory 和 marketplace 明确在范围外；若 L2 吸收或伪造其 truth，不是“非范围”，而是 VETO。

## 9. 待确认事项

| 事项 | 影响 | 当前处理 |
|---|---|---|
| 某次送验是否纳入 conditional provider | 决定 P1 positive denominator | 由 Step 3 scope/baseline manifest 固定；当前不默认纳入 |
| performance/capacity authority | 决定未来数字阈值 | 当前只验结构性 NFR，保留 residual |
| production / SDK / marketplace 范围 | 可能触发新正式设计 | 当前 excluded/future；不得通过 06 私自扩张 |

## 10. 进入下一步条件

- [x] 核心目标、P0/P1/P2 和 excluded owner 均可判定。
- [x] 每个范围项明确对总体结论的影响。
- [x] 13 项 VETO 均在不可降级范围，没有被“非范围”规避。
- [x] formal field/state/protocol 名称约束已进入后续 gate 输入。
- [x] 允许进入 Step 3：固定验收基线。
