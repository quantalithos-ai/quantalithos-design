# L4-observability 05-测试方案 Step 02：明确测试目标、范围和非范围

## Step 状态

| 字段 | 当前值 |
|---|---|
| project | `L4-observability` |
| document | `05-测试方案.md` |
| step | `02 / 明确测试目标、范围和非范围` |
| mode | `full-restart` |
| status | `completed_current_design_record` |
| gate_status | `pass` |
| next_allowed_action | `start_current_05_step_03` |
| formal_document_write | `not_allowed_until_step_15` |
| source_baseline | current `00~04` plus Step 01 |
| test_execution | `not_run` |
| evidence | `planned_only`; no real alias or run id |
| commit | not required; no commit requested |

## 1. 本步输入

| 输入 | 用途 |
|---|---|
| `standards/document/测试方案讨论流程_SOP.md` Step 02 | 固定 P0/P1/P2、范围和非范围问题 |
| `standards/document/测试方案书写规范.md` §一~§三 | 固定正式 §2 结构和优先级表达 |
| `design-calibration/05_test_plan_step_01_input_boundary.md` | 固定 current 真相源、历史材料处置和 blocker 传播规则 |
| `projects/L4-observability/00-需求文档.md` §4、§8~§14 | 目标、核心/外围能力、规则、NFR、AC 和 VETO |
| `projects/L4-observability/01-架构设计.md` §4~§13 | truth ownership、依赖边界、运行和降级边界 |
| `projects/L4-observability/02-概要设计.md` §4~§12 | 组成部分、协议、处理流、状态和配置轮廓 |
| `projects/L4-observability/03-详细设计.md` §2、§7~§17 | exact protocol、27 state owner、flow、UoW、error、recovery、test cuts |
| `projects/L4-observability/04-配置设计.md` §2、§4、§6、§8~§13 | P0/P1/P2、forbidden、profile、redline、failure 和 lifecycle |
| L1 reference `05` documents | 只参考粒度，不继承业务语义或编号 |

## 2. SOP 问题回答

### 2.1 P0 必须证明的主链

P0 的目标不是证明某个外部产品可用，而是证明 Observability 的观察与审计投影边界能够被实现和验证：

1. 五个核心能力 `C-OBS-1~5` 有完整的安全入口、投影、运行观察、只读交接、留存和 no-write 验证链。
2. 五族 60 个 public protocol 均有 exact schema、入口、正向/负向场景和可留证 planned contract。
3. 27 个正式 lifecycle/state owner 的合法、非法、terminal、reserved 和副作用边界可测试；技术状态
   `ObservationJobPlanItemState` 不升级为第 28 个业务 truth owner。
4. Accepted UoW、rollback、cursor/version、stored result/report、outbox snapshot、claim/fence、duplicate、
   commit unknown 和 external Unknown 的行为有可执行断言。
5. log、metric、trace、audit、report、event、query 输出在 serialization 前通过 redaction 和 body-free
   allowlist；任何 forbidden body 或 secret 进入观察面都阻断。
6. Query、Consumer、Job、rebuild、replay、report assembly 和 export 不写相邻业务 truth、不修复 source truth、
   不下发执行控制。
7. `04` 的 P0 profiles、strict source priority、13-stage complete-or-error assembly、sensitive resolution、
   redline、degraded/unavailable 和 historical binding 规则可验证。

### 2.2 P1/P2 是否只做边界验证或延后

| 级别 | current 定义 | 测试深度 | 是否阻断核心 P0 |
|---|---|---|---|
| P0 | 核心观察面、审计投影、body-free linkage、只读查询/诊断/交接、retention/no-write、60 protocol、27 state、UoW/幂等/配置安全 | 需要可执行正反场景、自动化候选、planned evidence schema 和 veto gate | 是 |
| P1 | durable-like store、real-like resolver/publisher/handoff/export、事件协作接缝、受控跨仓集成 | 只验证 adapter/port contract、failure mapping、binding 和 no-truth transfer；不要求外部产品完整实现 | 否，除非 P0 contract 被接缝破坏 |
| P2 | production-like profile、真实 secret provider/config center、hot reload、容量/SLO、复杂报表、外部 GRC 深度集成、高级 dashboard/alert/异常检测 | 记录触发条件、风险和后续验证入口；没有 current workload/threshold 时不生成 pass | 否 |
| Forbidden | 任何放宽 redaction、body-free、truth ownership、Query no-write、source repair、idempotency、fence、token、evidence authority 或依赖裁剪的开关 | 设计负向测试和静态 veto；不能以 test profile 绕过 | 永远阻断 |

### 2.3 哪些下游只测接缝

| 下游/外部面 | P0/P1 测试内容 | 不测试内容 | 风险归属 |
|---|---|---|---|
| `L0-bus` | source event ref、envelope、schema/producer binding、ack-after-commit、duplicate/unsupported 处理 | bus publish、ack、retry、DLQ、replay 主干实现 | `L0-bus` |
| `L1-identity` | actor/subject safe ref、source version、visibility 和 body-free context | member/role/identity 生命周期和权限 truth | `L1-identity` |
| `L1-governance` | governance audit context、safe action summary、reference/digest、visibility、no-write | Gate/Policy/Decision/Control/AIIA/SoA truth | `L1-governance` |
| `L1-artifact` | evidence context、body-free linkage、digest/purpose、producer/schema binding | Artifact/evidence body、version、lineage、baseline truth | `L1-artifact` |
| `L2-runtime` / `L4-sandbox` | safe signal/summary、trace correlation、degraded/unavailable mapping | execution result、control command、runtime body | runtime/sandbox owner |
| `L4-archive` | retention marker、archive handoff feedback、active protection | archive package body、restore/recovery truth | `L4-archive` |
| report consumer | handoff input/readiness/authenticity hint、delivery result、gap | final report conclusion、acceptance verdict/signoff | report owner / `06` |
| external audit/GRC | body-free export preparation and typed unavailable/blocked surface | vendor schema、external conclusion和审计 truth | future external owner |

### 2.4 非范围和残余风险

| 非范围 | 当前原因 | 残余风险 | 后续承接 |
|---|---|---|---|
| 外部观测产品、dashboard、APM、具体 DB/queue/object store | `00`/`04` 未冻结产品 truth | 产品能力、容量和运维成本未知 | `01/04/07` candidate；P2 spike |
| production-like/hard SLO/capacity | 无 workload、sample、threshold review 和真实环境 | NFR 无法作辩护性 pass | `05` §10、`06` NFR gate 标 `not_evaluated` |
| I05 positive payload/binding | 上游 canonical schema/binding 未闭合 | I05 正向 consumer 无法安全构造 | `05` blocked/conditional；`06/07` affected gate |
| H13 positive replay execution | `R06.6-F2-H13-UPSTREAM` controlled open | 不能证明 scope mutation 的 audit truth | 只验证 blocked/manual/zero fabrication |
| target repo reality、真实脚本和真实 evidence | 实现仓尚未建立 | 无法执行代码/测试/留证 | `07` initialization boundary；不伪造 |

## 3. 当前文档问题诊断

| 材料 | 问题 | 处理 |
|---|---|---|
| 旧 `05-测试方案.md` | 采用 Artifact truth、旧 profile、旧协议数量和旧 `TC/EV` 口径 | 整体降级为 historical，Step15 从 current Step 01~14 装配 |
| 旧 Step 02 文件 | 重复旧 Step 01 内容，未提供可判定 P0/P1/P2 scope | 删除并重建，不继承其结构化结论 |
| README/旧性能数字 | 把产品、存储和阈值当作当前测试前置 | 仅保留为 P2/残余风险 |
| `04` | 已固定 P0/P1/P2/Forbidden 和配置非范围去向 | 作为测试范围的直接输入；不新增配置 key |
| current `03` | 已固定 16/14/9/12/9、27 owner 和 planned cuts | 作为 P0 exact contract 清单 |

## 4. 设计取舍

| 方案 | 结论 | 理由 |
|---|---|---|
| 以核心能力和 exact protocol 双轴定义 P0 | 采用 | 同时避免只测业务故事而漏协议，也避免只测 DTO 而漏核心边界 |
| 让所有外部依赖都进入 P0 E2E | 放弃 | 外部 truth 和产品尚未建立；应在 port/adapter 接缝验证，不把环境不确定性伪装成核心通过 |
| 用 P1/P2 的 unavailable/fake 结果代表生产成功 | 放弃 | availability、fake 和 RuntimeLike 是不同语义；不能跨等级升级结论 |
| 把 I05/H13 当成普通缺测并删除 | 放弃 | 会隐藏设计 blocker，破坏测试到验收和实施的真实条件链 |
| 把禁止项作为测试后置审查 | 放弃 | body-free、no-write、truth ownership 和依赖裁剪是 VETO，必须进入 P0 负向/静态 gate |

## 5. 结构化中间产物

### 5.1 范围总表

| 范围项 | 类型 | 优先级 | 验证目标 | 非目标/说明 |
|---|---|---:|---|---|
| 安全观测材料准入、拒绝、隔离、来源与关联 | core capability | P0 | `C-OBS-1`、`FR-OBS-001~003` 和 `BR-OBS-001~006` 的入口与安全状态成立 | 不保存 raw material，不验证 source owner 内部生成 |
| 审计投影与 body-free evidence linkage | core capability | P0 | `C-OBS-2`、`FR-OBS-004~005`、`BR-OBS-007~010` 可追溯且不拥有正文 | 不验证治理/Artifact/evidence 正文 |
| log/metric/trace 安全表达 | core capability | P0 | `C-OBS-3`、`FR-OBS-006~007`、`BR-OBS-011~014` 的脱敏、关联、降级成立 | 不验证外部 telemetry backend |
| Query / diagnostic / report handoff | core capability | P0 | `C-OBS-4`、`FR-OBS-008~011` 严格只读，gap/visibility/authenticity 显式 | 不生成 verdict/signoff/真实 evidence |
| retention / active reference / replay / no-write | core capability | P0 | `C-OBS-5`、`FR-OBS-012~013`、`BR-OBS-020~023` 成立 | 不修复/删除/覆盖 source truth |
| 16 Command | protocol | P0 | 每个 exact request/result/error/accepted side effect 可测 | 不扩展新 command |
| 14 Query | protocol | P0 | 每个 exact response surface 和 strict zero-write 可测 | 不在 miss/stale 时隐式 repair |
| 9 Inbound Consumer | protocol seam | P0 | envelope/schema/dedup/consumer local projection 边界可测 | I05 positive 受 blocker 条件化 |
| 12 Outbound Event | protocol seam | P0 | committed immutable snapshot、redaction、publish failure marker 可测 | 不要求真实 bus 产品 |
| 9 Operations Job | maintenance | P0 | plan/claim/item/report/finalize、duplicate、partial、no-truth-repair 可测 | J06 positive 受 H13 条件化 |
| 27 formal state owner | state | P0 | legal/illegal/terminal/reserved transition 和副作用可测 | Job item technical state 不当作业务 state |
| UoW/persistence/consistency/recovery | consistency | P0 | accepted order、rollback、unknown、CAS/cursor/fence 和 stored result/report 可测 | 不指定物理 DB 产品 |
| P0 config/runtime assembly | config/security | P0 | 三个 current profile（`LocalTest`、`IntegrationLike`、`RuntimeLike`）、strict source priority、redline、complete-or-error、redaction 可测 | 不把 target reality 当已建立 |
| real-like adapter/transport/store seams | integration seam | P1 | 验证 port contract、failure mapping、historical binding 和 no fallback | 不作为核心 truth 成立前置 |
| production-like、capacity、hard SLO | NFR candidate | P2 | 以真实 workload、环境和阈值 review 后验证 | 当前不产生 pass |
| dashboard/alert/report enhancement/APM/GRC/异常检测 | peripheral enhancement | P2 | 只验证不污染核心 truth 的消费边界 | 不进入当前核心闭环 |

### 5.2 VETO 与范围关联

| VETO | 必须进入的测试范围 | P0 阻断方向 |
|---|---|---|
| `VF-OBS-001` | 五核心能力闭环 | 任一核心能力缺主流程、关键负向或证据输入即阻断 |
| `VF-OBS-002` | redaction-before-serialization、log/metric/trace/event/report scan | 任一 forbidden body/secret/raw ref 出现即阻断 |
| `VF-OBS-003` | body-free evidence/artifact/identity/governance/source audit boundary | 保存外部正文即阻断 |
| `VF-OBS-004` | source truth interpretation、safe summary、report/handoff wording | 观察面被解释为外部 truth 即阻断 |
| `VF-OBS-005` | Query/Consumer/Job/rebuild/replay/export no-write spies and static scan | source write/control call 即阻断 |
| `VF-OBS-006` | planned/candidate evidence schema和真实性提示 | 设计材料填写真实 run/evidence/verdict/signoff 即阻断 |
| `VF-OBS-007` | retention/active protection/cleanup guard | active reference 被删除或释放误判即阻断 |
| `VF-OBS-008` | dependency/static boundary scan | 非 `L0-core` sibling compile dependency 即阻断 |
| `VF-OBS-009` | product-neutral config/adapter boundary | 外部产品成为 truth/source hard prerequisite 即阻断 |
| `VF-OBS-010` | historical-material scan和文档 traceability | 旧编号/阈值/证据被升级为 current gate 即阻断 |

### 5.3 测试优先级判定规则

| 判定 | 条件 | 结果 |
|---|---|---|
| P0 | 影响核心能力、truth/no-write、security、exact protocol、state/UoW/幂等或 VETO | 必须有正向和关键负向切口；后续缺失标 blocker |
| P1 | 只影响真实接缝或 adapter/product-neutral capability，且不改变本仓 truth | 有条件验证；缺真实依赖时标 pending/blocked |
| P2 | 外围增强、产品选择、容量或未来生命周期，没有 current schema/threshold | 只留风险、触发条件和 future test design |
| Forbidden | 违反不变量或依赖裁剪，不论 profile/环境 | 负向/静态 gate；不可风险接受或降级 |

## 6. 回填草稿

本步回填正式 `05-测试方案.md` §2。正式正文只承载以下结论：

> 本轮 P0 测试证明 `C-OBS-1~5`、`FR-OBS-001~013`、60 个 exact public protocol、27 个正式状态 owner、UoW/一致性/幂等/恢复、配置装配、redaction、correlation、evidence linkage、retention、report handoff 和 no-write 边界。P1 只验证 durable-like/real-like 接缝，P2 保留 production-like、容量、外部产品和外围增强；跨仓只测安全引用、快照、事件/协议和 handoff 接缝，不测试相邻仓完整 truth 生命周期。`VF-OBS-001~010` 是阻断性边界，I05 payload/binding、H13 replay 和 inherited affected 只能以 blocked/conditional/planned 语义传播，不得伪造通过。

## 7. 待确认事项

| ID | 内容 | 当前状态 | 影响 |
|---|---|---|---|
| `Q-05-02-SCOPE` | I05/H13 的正向范围何时可从 conditional 转为 executable | inherited open | 影响 Consumer I05 和 Job J06 的 P0 positive gate |
| `Q-05-03-SCOPE` | 12 inherited affected 的 owner/phase 是否在后续设计闭合 | inherited affected | 影响 exact case、06 VETO 和 07 boundary gate |
| `Q-05-04-SCOPE` | 当前 workload、环境和硬阈值何时获得授权 | candidate | 影响 P2 NFR，不得提前 pass |
| `Q-05-05-SCOPE` | target repo 和真实外部依赖是否建立 | not established | 影响 P1/真实执行，不影响当前 scope 设计 |

## 8. 自检与进入下一步条件

| 检查项 | 结论 |
|---|---|
| P0/P1/P2/Forbidden 已分开 | `pass` |
| 核心范围回指 current 需求和详细设计 | `pass` |
| 外部能力只定义接缝 | `pass` |
| VETO 全部有测试承接方向 | `pass`；`VF-OBS-001~010` |
| 非范围有风险归属和后续承接 | `pass` |
| 上游 blocker/affected 被隐藏或关闭 | `no`；均保持 inherited/conditional |
| 真实测试/evidence/验收/实现是否存在 | `not_run/not_established` |
| Step gate | `pass` |
| next_allowed_action | `start_current_05_step_03` |

## 9. 参考

- `standards/document/测试方案讨论流程_SOP.md` Step 02
- `standards/document/测试方案书写规范.md` §三
- `projects/L4-observability/design-calibration/05_test_plan_step_01_input_boundary.md`
- `projects/L4-observability/00-需求文档.md` §4、§8~§14
- `projects/L4-observability/03-详细设计.md` §7~§17
- `projects/L4-observability/04-配置设计.md` §2、§4、§6、§8~§13
