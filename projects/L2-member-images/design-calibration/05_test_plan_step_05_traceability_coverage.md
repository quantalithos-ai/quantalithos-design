# L2-member-images 05 测试方案 Step 5：需求追溯与覆盖矩阵

> 状态：`completed`
> 对应 SOP：`standards/document/测试方案讨论流程_SOP.md` Step 5
> 回填位置：正式 `05-测试方案.md` 第 5 章

## 0. Step 状态与输入

| 项目 | 记录 |
|---|---|
| 本步目标 | 将需求/规则/NFR、设计契约、测试场景、规划用例和证据 ID 连成可审计矩阵。 |
| 本步输入 | Step 1~4；00 §7/9/10/13/14/16；01 §8/13/15/16；02 capability/trace；03 §5~§16；04 §2/§6~§14。 |
| 本步输出 | P0 追溯矩阵、协议/状态/边界覆盖矩阵、覆盖缺口表。 |
| gate_status | `pass_with_explicit_blockers` |

## 1. SOP 问题回答

| 问题 | 收敛回答 |
|---|---|
| 追溯起点是什么？ | 00 的 `C-MI-*`、`F-MI-*`、`BR-MI-*`、`NFR-MI-*`、`AC-MI-*` 与 VETO；不使用旧 05 编号。 |
| 设计依据如何落到测试？ | 逐项回指 03 的对象/协议/状态/UoW/错误/观测和 04 的配置；未闭 owner 以 blocked/pending 覆盖。 |
| “已覆盖”是什么意思？ | 仅表示存在计划用例和证据映射；不是测试执行通过或验收 signoff。 |
| 缺口如何处理？ | 放入 Step 14 残余风险或重开条件；不能用人工口头确认替代证据。 |

## 2. P0 需求追溯矩阵

> 编号校准：本 Step 不另造能力型 TC/EV 编号。所有用例采用 Step 6 的 logical-surface / 横切风险族；所有证据采用 Step 13 的统一规划 EV family。`planned` 只表示追溯已设计，不表示测试、证据或验收已发生。

| 需求/规则 | 设计依据 | 测试场景 | 用例 ID（规划） | 自动化 | 证据 ID（规划） | 覆盖状态 |
|---|---|---|---|---|---|---|
| `C-MI-1`、`F-MI-001~003` | 03 definition/reference；04 static refs | definition、mapping ref、revision、source gap | `TC-CMD-001`、`TC-CMD-003`、`TC-QUERY-001`、`TC-QUERY-009`、`TC-STATE-001~003` | 是 | `EV-UNIT-001`、`EV-SVC-001`、`EV-ENTRY-001` | planned |
| `C-MI-2`、`F-MI-004~006`、`BR-MI-006~010` | 03 assembly/build；00 static/live | baseline completeness、pin、seed/live rejection、append/supersede | `TC-CMD-002~005`、`TC-STATE-004~006`、`TC-SEC-001~002` | 是 | `EV-UNIT-001`、`EV-SEC-001`、`EV-GATE-001` | planned |
| `C-MI-3`、`F-MI-007~009` | 03 build protocol/state | intent/snapshot/attempt/candidate validation 与 B01/B02 stop | `TC-CMD-004~005`、`TC-JOB-001~002`、`TC-STATE-007~010`、`TC-CON-001~005` | 是（当前负向） | `EV-SVC-001`、`EV-INT-001`、`EV-REC-001` | blocked_positive_lane |
| `C-MI-4`、`F-MI-010~012`、`BR-MI-016~020`、`Q-MI-004` | 03 qualification；04 external boundary | provenance/gate/eligibility/Artifact gap、body-free | `TC-CMD-006~007`、`TC-QUERY-004`、`TC-JOB-003`、`TC-STATE-011~014`、`TC-SEC-001` | 是（gap/negative） | `EV-SVC-001`、`EV-INT-001`、`EV-SEC-001` | blocked_positive_lane |
| `C-MI-5`、`F-MI-013~015`、`BR-MI-021~025`、`MI-UP-001` | 03 supply/query；Member Service pending | entry availability/history、consumer gap、resolve blocked | `TC-CMD-008~010`、`TC-QUERY-005~007`、`TC-JOB-006`、`TC-STATE-015~018` | 是（local/negative） | `EV-SVC-001`、`EV-ENTRY-001`、`EV-INT-001` | pending_consumer |
| `BR-MI-001~005`、`BR-MI-006~025` | 03 states/UoW/idempotency | no fallback、illegal transition、append/supersede、version、duplicate/conflict | `TC-CMD-001~010`、`TC-STATE-001~019`、`TC-CON-001~005`、`TC-DEP-001` | 是 | `EV-UNIT-001`、`EV-SVC-001`、`EV-INT-001`、`EV-GATE-001` | planned_or_blocked_by_design |
| `NFR-MI-001~022` | 01/03/04 cross-cutting | no-write、redaction、low-cardinality、fail-closed、evidence lineage | `TC-QUERY-001~010`、`TC-CONFIG-001~005`、`TC-SEC-001~002`、`TC-OBS-001~002`、`TC-REC-001`、`TC-PERF-001` | 是/条件 | `EV-CONFIG-001`、`EV-SEC-001`、`EV-OBS-001`、`EV-REC-001`、`EV-PERF-001` | planned; quantitative threshold blocked |
| `VETO-MI-001~007` | 00 §14.7；01/03/04 risks | staged status、external owner、historical pollution、dependency/outbound/redaction scan | `TC-SEC-001~002`、`TC-EVENT-001`、`TC-DEP-001`、`TC-STATE-019` | 是 | `EV-SEC-001`、`EV-GATE-001`、`EV-OBS-001` | planned |

## 3. 协议、状态与边界覆盖矩阵

| 覆盖面 | 设计来源 | 测试入口 | 证据规划 | 缺口/限制 |
|---|---|---|---|---|
| 10 Command | 03 §7.1、§8 / Step 16 | `TC-CMD-001~010`：required metadata、B01/B02 stop、非法输入 / state / owner gap | `EV-UNIT-001`、`EV-SVC-001` | accepted mutation/replay 等 B01/B02 后重开 |
| 10 Query | 03 §7.2、§8 / Step 16 | `TC-QUERY-001~010`：hit/missing/gap/stale/page/freshness 与 strict no-write | `EV-SVC-001`、`EV-ENTRY-001` | visibility authority pending 时只测 `Unavailable` |
| 2 inbound | 03 §7.3、§8；`MI-UP-005` | `TC-IN-001~002`：marker-only、`accepted_input=false` | `EV-ENTRY-001` | 无 envelope/receipt/dedup/accepted write |
| 6 Job | 03 §7.4、§8、§12 / Step 16 | `TC-JOB-001~006`：bounded scope、B01/B02 stop、no-truth-repair | `EV-ENTRY-001`、`EV-INT-001`、`EV-REC-001` | B01/B02、PF 阻断正向 recovery |
| 0 outbound | 03 §7.3、§15 | `TC-EVENT-001`：`ImageOutboundEventInventory::NoneAuthorized` 零库存 | `EV-GATE-001` | 无 event schema/topic/publisher |
| 19 状态矩阵 / 20 subjects | 03 §9 / Step 10 | `TC-STATE-001~019`：合法/非法边、terminal/replacement、阶段隔离 | `EV-UNIT-001`、`EV-INT-001` | 运行结果待未来执行 |

## 4. 测试切口反向覆盖与停审

| 测试切口 | 反向覆盖 | 设计契约 | 用例 / 证据规划 | 停审结论 |
|---|---|---|---|---|
| contracts / definition / state | `C-MI-1~2`、`BR-MI-001~010`、`VETO-MI-002/003` | 03 §5、§7、§9 | `TC-CMD-001~003`、`TC-STATE-001~006`、`TC-SEC-001~002` -> `EV-UNIT-001` / `EV-SEC-001` | planned；不以 planned 代替 mutation。 |
| build / qualification | `C-MI-3~4`、`BR-MI-011~020`、`VETO-MI-004/005` | 03 §7~§12 | `TC-CMD-004~007`、`TC-JOB-001~003`、`TC-STATE-007~014` -> `EV-SVC-001` / `EV-INT-001` | positive lane blocked。 |
| supply / query / consumer gap | `C-MI-5`、`BR-MI-021~025`、`VETO-MI-006` | 03 §7~§10 | `TC-CMD-008~010`、`TC-QUERY-001~010`、`TC-JOB-006` -> `EV-SVC-001` / `EV-ENTRY-001` | consumer positive lane pending。 |
| inbound / outbound / dependency | `VETO-MI-007`、`MI-UP-005/009` | 03 §7.3、§13、§15 | `TC-IN-001~002`、`TC-EVENT-001`、`TC-DEP-001` -> `EV-ENTRY-001` / `EV-GATE-001` | marker-only / zero inventory。 |
| config / redaction / observability | `NFR-MI-*`、`VETO-MI-003/007` | 03 §13~§14；04 §3~§11 | `TC-CONFIG-001~005`、`TC-SEC-001~002`、`TC-OBS-001~002` -> `EV-CONFIG-001` / `EV-SEC-001` / `EV-OBS-001` | planned；无外部 backend / actual evidence。 |

| 覆盖审计项 | 结论 | 缺口 / 处置 |
|---|---|---|
| 孤儿 P0 需求 / VETO | 无 | 每组均回指至少一个 cut、TC family 与 EV family。 |
| 孤儿 logical surface | 无 | 10/10/2/6/0 均有 TC 与 suite 方向。 |
| 旧能力型 TC/EV 族 | 已移除 | 不再引用 `TC-DEF/ASM/BLD/QUAL/SUP/NFR/VETO` 或 `EV-API/DOMAIN`。 |
| external positive lane | 持续 blocked / pending | 进入 Step 14 风险；不得被 coverage 状态计为 pass。 |

## 5. 改动前后对比、结构化产物与回填草稿

旧正式 05 的覆盖关系不能继承；本矩阵以当前需求与正式设计 ID 为主，并明确 planned/blocked。正式 §5 将回填本矩阵摘要及“覆盖状态不等于通过”的声明。能力型旧 TC/EV 族已统一到 Step 6 / Step 13 的单一编号体系。

## 6. 待确认事项与进入下一步条件

待确认项：06 的最终 AC 编号、Q-MI policy、Artifact evidence kind、真实性能阈值。它们不阻止 P0 traceability，但任何新正向要求必须回写本矩阵。进入 Step 6 的条件是每个 P0 需求至少有场景、TC 规划、自动化方向和 EV 规划，且缺口已有 owner/处置。
