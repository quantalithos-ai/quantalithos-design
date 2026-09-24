# Step 6. 定义数据边界与架构红线验收

> 对应 SOP：`standards/document/验收标准讨论流程_SOP.md` Step 6  
> 回填章节：`06-验收标准.md` §6 数据边界与架构红线验收  
> 状态：`completed / pass / self_reviewed`

## 1. Step 状态与事实边界

| 项 | 当前值 |
|---|---|
| current_document | `06-验收标准.md` |
| current_step | Step 6 |
| current_module | `data_boundary:architecture_redlines` |
| gate_status | `pass_for_step_07` |
| formal_06_write_allowed | `false_until_step_15` |
| actual_evidence | `none`; all redlines are planned contracts |
| actual_verdict | `none` |
| next_allowed_action | 创建并完成 Step 7 |

本步只把正式 00～05 的 ownership 与禁止事项转成可裁决红线。红线“设计停审通过”不等于实现已通过；`TC-*`、`ESLOT-RUN-*`、`EV-RUN-*` 和 report path 仍是 future contract。当前没有实现仓、fixed run、artifact、report、evidence 或 signoff。

## 2. 本步目标、输入与非目标

### 2.1 目标

- 固定 Runner-owned local truth、owner snapshot/ref、safe reference 和禁止正文四类边界。
- 把 `truth ownership`、SDK/API-only、Query no-write、Consumer header-first、Job no-owner-repair、outbound-event-zero、配置不绕过设计、证据不反写 truth 变成稳定红线。
- 为每条红线指定可执行的正式 TC family、planned EV alias、fixed report path、通过/失败条件和 target-tier 影响。

### 2.2 权威输入

| 输入 | 用途 |
|---|---|
| `00-需求文档.md` §2、§10～§13、§14 | owner 边界、禁止正文、SDK-first、11 条 AC 与安全/NFR 红线 |
| `01-架构设计.md` §4、§7～§13、§17 | local truth / owner projection / observation 分离，依赖方向和 ADR 红线 |
| `02-概要设计.md` §5～§13 | 六个组成部分、对象责任、Command/Query/Consumer/Job 分层 |
| `03-详细设计.md` §5～§15 及 Step 6～15 | 对象、port、协议、flow、状态、UoW、幂等、配置、观测禁止项 |
| `04-配置设计.md` §4、§6、§9、§12 | 配置不可改变 truth owner、状态轴、Query no-write、redaction 和 readiness |
| `05-测试方案.md` §6、§9、§13 | 18 CUT、TC 分组、检查类型、slot/EV/report 证据合同 |

### 2.3 非目标

- 不选择数据库、文件布局、GUI 框架、Sandbox backend、Docker/Tauri/gVisor/Firecracker 或 SDK 具体版本。
- 不把上游未闭合的 positive adapter 当作可执行；`RUN-UP-001~008` 继续保持 blocked。
- 不创建静态 evidence、脚本、测试 fixture、implementation ledger 或 boundary skeleton。

## 3. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 哪些数据不得由本仓保存？ | Release/Artifact 正文、Governance policy/approval 正文、Runtime loop/result body、Sandbox 私有 state/raw capture、Observability evidence/report、Archive bundle、Project 正文、token/secret/credential 均禁止；只允许 typed ref、bounded safe summary、local intent/protection/recovery 和必要 metadata。 |
| 哪些下游不得反向改写真相？ | Artifact/Release、Governance、Work/Workspace、Runtime、Sandbox boundary/lease/cleanup、Observability、Archive、SDK/Bus 均不得被 Runner 直接或间接写入；Runner 只经正式 public seam 表达意图或读取结果。 |
| 哪些 projection/cache 不得反写真相？ | owner projection、cache、cursor、read section、PID/port/probe、receipt、local log、handoff posture、profile/readiness marker 都不能升级或改写 owner truth。 |
| 哪些 P1 能力不得污染 P0？ | 批量预取、multi-run 比较、Archive 浏览和任何未获 authority 的 Consumer positive path 保持 disabled/blocked；不得改变 P0 分母、状态或成功条件。 |
| 红线失败是否一票否决？ | `AR-RUN-001~015` 任一 required assertion 失败，或 redaction/dependency/no-static check 失败，均进入 Step 11 VETO 候选；正式 VETO 由 Step 11 收口，不能用风险接受覆盖。 |

## 4. 当前文档问题诊断与裁决取舍

| 问题 | 历史/错误口径 | 本步裁决 |
|---|---|---|
| truth owner | 旧文档把 `RunnerRun`、queue 或本地日志当成执行结果 | 只承认正式 owner projection/ref/status；本地对象只表达 Runner-owned intent/posture |
| 数据范围 | 旧验收允许 API response/DB record 作为泛证据 | 每条红线必须有 TC、same-run raw/report/check pair；无 pair 不产生 EV |
| 接缝 | 旧技术材料暗示直接复用 Sandbox 私有实现 | 只允许 L0-sdk/公开 API/public adapter；编译期、运行期、事件协作依赖分开验收 |
| Query/后台 | 旧口径允许查询顺便 refresh/reconcile/repair | Query 明确 no-write；Job 才能执行显式本地工作，且不得修 owner truth |
| 配置 | feature flag 可被误读为放行开关 | 配置不可绕过 authority/integrity/qualification、状态轴、redaction、event-zero 或 evidence 边界 |
| P1/外围 | 预取、比较、Archive 被混入“完整功能” | 维持 `FR-RUN-014~016` future/blocked，不贡献 P0 pass |

## 5. 红线与证据合同

### 5.1 统一判定规则

1. 红线通过必须同时满足：正式设计引用、适用 TC 全部有真实 case status、同一 fixed run 的 raw/report/check pair、对应 EV item 或明确的 blocked/incomplete 记录，以及 `reports/runs/<run_id>/gate-results.md` 的 gate 结果。
2. `ESLOT-RUN-*` 和 `EV-RUN-*` 是计划标识，不是证据实例；实例必须绑定 `(run_id, evidence_id, evidence_item_digest)`。
3. 任一 required assertion `failed`、`timeout`、`flaky`、`incomplete`，或 redaction/dependency/link/pairing/no-static check `failed/unavailable`，红线不得通过。
4. 上游 slot 未在 baseline 启用时，只能验安全拒绝/blocked posture；不得将 positive 未执行改成 `not_applicable`，也不得生成正向 EV alias。
5. 红线结果必须携带 `acceptance_target_tier`；T1 只证明 Runner-owned semantic safety，不能推出 T2～T4。

### 5.2 架构红线表

| 红线 ID | 红线与可检查对象 | 通过条件 | 失败条件 | TC / planned slot / EV alias | 固定 report 入口 | tier / 裁决影响 |
|---|---|---|---|---|---|---|
| `AR-RUN-001` | Runner-owned local truth 与外部 owner truth 分离 | selection、intent、progress、protection、recovery、cursor、local generation 只在 Runner-owned store 变化；owner projection 只读且带 source/version/freshness | 本地状态升级为 Release/Governance/Sandbox/Runtime/Observability/Archive truth，或本地写入 owner state | `TC-RUN-BND-002/005`；`ESLOT-RUN-018`；`EV-RUN-BND-018` | `reports/runs/<run_id>/evidence-index.md`、`evidence/EV-RUN-BND-018.md`、`gate-results.md` | T1 required；失败为 VETO 候选，T2+ 同样阻断 |
| `AR-RUN-002` | 禁止保存外部正文与私密实现状态 | store/schema/diagnostic/report 只含 typed ref、bounded safe summary、digest/visibility/freshness；禁止 Release bytes、raw payload/capture、policy、credential、owner cursor | 发现正文、secret/token、raw body、完整敏感 path/URL/PID/port/stack 或 Sandbox 私有 state | `TC-RUN-OBS-001/005`、`TC-RUN-BND-006`；`ESLOT-RUN-017/018`；`EV-RUN-OBS-017`、`EV-RUN-BND-018` | `redaction-check.md`、`dependency-boundary.md`、对应 evidence detail | 所有 tier required；任何 finding 直接 VETO 候选，不能风险接受 |
| `AR-RUN-003` | safe ref/snapshot 必须归因且不可自封权威 | owner snapshot/ref 带 source、scope、visibility、freshness、version/generation、limitation；restricted/stale/unknown 保真 | 缺 source/freshness/scope，或由 cache、角色、历史成功、ACK、HTTP 200、PID/port 补出 approved/running/terminal/cleaned | `TC-RUN-CTX-001~006`、`TC-RUN-OWN-001~005`；`ESLOT-RUN-001/005/009`；`EV-RUN-CTX-001`、`EV-RUN-OWN-005`、`EV-RUN-QRY-009` | `evidence-index.md`、`evidence/EV-RUN-CTX-001.md`、`gate-results.md` | T1 semantic required；T2+ owner positive 缺失时为 blocked，不得升级 verdict |
| `AR-RUN-004` | SDK/API/public adapter only | 所有跨域调用经过已声明 public seam，依赖类型/版本/authority 可在 baseline 定位；adapter 只映射安全 DTO/result | sibling private source/backend/DB/bus/topic、共享事务、直接 HTTP/内部模块或 Sandbox 私有实现被调用 | `TC-RUN-BND-006`、`TC-RUN-CON-001~006`；`ESLOT-RUN-010/018`；`EV-RUN-CON-010`、`EV-RUN-BND-018` | `dependency-boundary.md`、`evidence-link-check.md`、`gate-results.md` | T1 boundary required；失败为 VETO 候选；T2+ positive 仍需真实 public contract |
| `AR-RUN-005` | Query/read/render/reconnect no-write | 12 Query 只读 committed section/view；call/write spy 中 reserve/save/refresh/reconcile/probe/cleanup/dispatch 均为零；读取失败只返回 typed degraded/blocked/unknown | Query 或 render/reconnect 产生任何 local mutation、owner call effect、generation allocation、job dispatch 或 cleanup | `TC-RUN-QRY-001~006`、`TC-RUN-BND-004`；`ESLOT-RUN-009/018`；`EV-RUN-QRY-009`、`EV-RUN-BND-018` | `evidence/EV-RUN-QRY-009.md`、`evidence/EV-RUN-BND-018.md`、`gate-results.md` | T1 required；失败为 VETO 候选 |
| `AR-RUN-006` | Consumer header-first / no payload / no ACK | 四 planned Consumer 在 contract 未闭合时只读取安全 header/readiness，返回 Blocked/Unsupported/Rejected/Quarantined 或 stored Duplicate；payload parse/hash/store/owner cursor/ACK 均为零 | 解析或保存 payload、推进 owner cursor、发送 ACK、把消息到达当作 owner success，或用 fake positive 绕过 readiness | `TC-RUN-CNS-001~006`、`TC-RUN-BND-003/005`；`ESLOT-RUN-014/018`；`EV-RUN-CNS-014`、`EV-RUN-BND-018` | `evidence/EV-RUN-CNS-014.md`、`dependency-boundary.md`、`gate-results.md` | T1 negative required；任何越界为 VETO 候选；positive slot 未启用保持 blocked |
| `AR-RUN-007` | Operations Job 只能改 Runner-owned local operations | J01～J05 的 claim/checkpoint/report/section replacement 只作用于 Runner-owned store，owner refresh/reconcile 仅产生本地 posture；unknown 保持 RecoveryCase | Job 修改 Release/Governance/Runtime/Sandbox/Observability/Archive truth、自动 reclaim/重放未知副作用或把 report 当 owner outcome | `TC-RUN-JOB-001~008`、`TC-RUN-BND-005`；`ESLOT-RUN-015/018`；`EV-RUN-JOB-015`、`EV-RUN-BND-018` | `evidence/EV-RUN-JOB-015.md`、`gate-results.md` | T1 required；失败为 VETO 候选 |
| `AR-RUN-008` | outbound event/outbox/publisher 必须为零 | 11 Command、12 Query、4 Consumer、5 Job call/audit graph 中 outbound event、outbox、topic publish 数为零；local trace/history 不计 event | 任意 emitter/outbox/topic/publisher、隐式事件、event-derived owner write 或配置开启 outbound path | `TC-RUN-BND-003`；`ESLOT-RUN-018`；`EV-RUN-BND-018` | `dependency-boundary.md`、`evidence/EV-RUN-BND-018.md`、`gate-results.md` | T1 required；非零直接 VETO 候选 |
| `AR-RUN-009` | 配置不得改变 truth/安全门禁 | strict config 只能选择已定义 profile、limit、redaction、adapter marker 和安全 disabled posture；不能启用 latest、authority bypass、state merge、Query write、Unknown replay、Consumer positive/event | feature flag/profile/hot patch 使未批准材料运行、把 Accepted/Complete/Confirmed 升级、绕过 guard/redaction 或创建 event/owner mutation | `TC-RUN-CFG-001~006`、`TC-RUN-BND-001/004`；`ESLOT-RUN-016/018`；`EV-RUN-CFG-016`、`EV-RUN-BND-018` | `evidence/EV-RUN-CFG-016.md`、`redaction-check.md`、`gate-results.md` | T1 required；配置绕过为 VETO 候选 |
| `AR-RUN-010` | evidence/report 不得反写 truth 或制造成功 | local log/receipt/handoff/preview/report 只能成为 bounded local surface；EV 只由 same-run raw/report/check 生成，不能反写 owner/local business state | 手写/static EV、report→state mutation、receipt→evidence/verdict、local log→running/cleaned/approved 或跨 run 拼接 | `TC-RUN-OBS-003~006`、`TC-RUN-BND-005`；`ESLOT-RUN-017/018`；`EV-RUN-OBS-017`、`EV-RUN-BND-018` | `evidence-link-check.md`、`report-pairing.md`、`evidence-index.md`、`gate-results.md` | T1/T4 required；任何静态/跨 run 证据为 VETO 候选 |
| `AR-RUN-011` | P1/P2 与 reserved positive path 不污染 P0 | `FR-RUN-014~016`、Consumer positive、Archive/compare/prefetch 只能显示 disabled/blocked/future；不改变 P0 分母或 pass 条件 | future/blocked capability 被计入 P0 pass、借 fake/fixture 充当真实 integration、外围结果改变 core lifecycle | `TC-RUN-CFG-006`、`TC-RUN-CNS-001~006`、`TC-RUN-BND-001`；`ESLOT-RUN-014/016/018`；`EV-RUN-CFG-016`、`EV-RUN-CNS-014`、`EV-RUN-BND-018` | `gate-results.md`、`evidence-index.md`、`dependency-boundary.md` | T1 scope required；污染 P0 为 VETO 候选，外围缺失本身不是 fail |
| `AR-RUN-012` | local probe/observation 与 owner allocation/lease/cleanup 分离 | probe、端口、路径、容量和本地进程只形成 observation/conflict；allocation、lease、cleanup 只能由正式 owner result/ref 证明 | 静默换端口/抢占/删除、probe 推导 allocation/lease/cleanup、PID/HTTP 200 推导 running | `TC-RUN-RES-001~006`、`TC-RUN-BND-001/005`；`ESLOT-RUN-006/018`；`EV-RUN-RES-006`、`EV-RUN-BND-018` | `evidence/EV-RUN-RES-006.md`、`gate-results.md` | T1 semantic required；T2+ platform positive 缺失为 blocked；越界为 VETO 候选 |
| `AR-RUN-013` | 多轴状态不得被快捷映射合并 | `Accepted≠Running`、`Complete≠Verified≠Qualified`、`Confirmed≠Cleaned`、`Delivered≠evidence`，每轴保留 source/basis/freshness | ACK/PID/port/toast、transfer complete、control confirmation、local delivery 被映射成 owner success 或 formal evidence | `TC-RUN-BND-001/005`、`TC-RUN-MAT-001~007`、`TC-RUN-CTL-001~005`；`ESLOT-RUN-002/004/018`；`EV-RUN-MAT-002`、`EV-RUN-CTL-004`、`EV-RUN-BND-018` | `evidence-index.md`、`evidence/EV-RUN-MAT-002.md`、`gate-results.md` | T1 required；shortcut 为 VETO 候选 |
| `AR-RUN-014` | cache/projection/receipt 不能绕过 generation/version/visibility | local writes 使用 expected version/generation；projection replacement 只更新既有 identity；restricted/stale/unknown 不补值 | stale overwrite、缺 ref 自动 upsert、cache hit 补 authority、旧 projection 清除 business stale 或 receipt 重建 current | `TC-RUN-CTX-001~006`、`TC-RUN-OWN-001~005`、`TC-RUN-UOW-001~006`、`TC-RUN-BND-004`；`ESLOT-RUN-001/005/009/012/018`；`EV-RUN-CTX-001`、`EV-RUN-OWN-005`、`EV-RUN-UOW-012`、`EV-RUN-BND-018` | `evidence-link-check.md`、`evidence/EV-RUN-UOW-012.md`、`gate-results.md` | T1 required；一致性越界为 VETO 候选 |
| `AR-RUN-015` | sensitive diagnostics/handoff 只可 bounded/redacted，且不成为 audit truth | preview/diagnosis/handoff 带 visibility/freshness/truncation/redaction；restricted/partial/stale/blocked 显式；handoff receipt 只是姿态 | raw secret/body/path/URL/PID/port/stack 泄露、redaction fallback、handoff ACK→evidence/report/verdict/signoff | `TC-RUN-PRE-001~006`、`TC-RUN-OBS-001~006`、`TC-RUN-BND-005`；`ESLOT-RUN-008/017/018`；`EV-RUN-PRE-008`、`EV-RUN-OBS-017`、`EV-RUN-BND-018` | `redaction-check.md`、`evidence/EV-RUN-PRE-008.md`、`gate-results.md` | 所有 tier required；泄露或升级直接 VETO 候选 |

## 6. 红线与 AC/TC/EV 反查矩阵

| 红线族 | 主要 AC | 主要 CUT | secondary slot / AC 关系 | 实际结果 |
|---|---|---|---|---|
| `AR-RUN-001/003/014` ownership、source attribution、generation | `AC-RUN-001/002/006/009/011` | 01、05、07、09、12、18 | `ESLOT-RUN-001/005/009/012/018`；secondary 只消费，不重复计主归属 | `not_evaluated` |
| `AR-RUN-002/015` forbidden body、redaction | `AC-RUN-010/011` | 08、17、18 | `ESLOT-RUN-008/017/018` | `not_evaluated` |
| `AR-RUN-004/006/007/008` seam、Consumer、Job、event-zero | `AC-RUN-011` | 10、14、15、18 | `ESLOT-RUN-010/014/015/018` | `not_evaluated` |
| `AR-RUN-005/009` Query no-write、config boundary | `AC-RUN-002/004/006/009/011` | 09、16、18 | `ESLOT-RUN-009/016/018` | `not_evaluated` |
| `AR-RUN-010/011` evidence boundary、P1 isolation | `AC-RUN-010/011` | 14、17、18 | `ESLOT-RUN-014/017/018` | `not_evaluated` |
| `AR-RUN-012/013` resource and multi-axis status | `AC-RUN-003/004/005/006/007/008/010` | 02、04、06、08、18 | `ESLOT-RUN-002/004/006/008/018` | `not_evaluated` |

## 7. 红线逐项停审记录

| 红线 | 正式来源 | 可检查断言 | 证据路径固定 | tier 不升级 | 设计停审 | Actual result |
|---|---:|---:|---:|---:|---:|---|
| `AR-RUN-001` | pass | pass | pass | pass | pass | `not_evaluated` |
| `AR-RUN-002` | pass | pass | pass | pass | pass | `not_evaluated` |
| `AR-RUN-003` | pass | pass | pass | pass | pass | `not_evaluated` |
| `AR-RUN-004` | pass | pass | pass | pass | pass | `not_evaluated` |
| `AR-RUN-005` | pass | pass | pass | pass | pass | `not_evaluated` |
| `AR-RUN-006` | pass | pass | pass | pass | pass | `not_evaluated` |
| `AR-RUN-007` | pass | pass | pass | pass | pass | `not_evaluated` |
| `AR-RUN-008` | pass | pass | pass | pass | pass | `not_evaluated` |
| `AR-RUN-009` | pass | pass | pass | pass | pass | `not_evaluated` |
| `AR-RUN-010` | pass | pass | pass | pass | pass | `not_evaluated` |
| `AR-RUN-011` | pass | pass | pass | pass | pass | `not_evaluated` |
| `AR-RUN-012` | pass | pass | pass | pass | pass | `not_evaluated` |
| `AR-RUN-013` | pass | pass | pass | pass | pass | `not_evaluated` |
| `AR-RUN-014` | pass | pass | pass | pass | pass | `not_evaluated` |
| `AR-RUN-015` | pass | pass | pass | pass | pass | `not_evaluated` |

“设计停审 pass”只表示红线合同完整；任何一条实际 result 都尚未产生。

## 8. 跨红线架构审计

| 审计项 | 结论 | 处理 |
|---|---|---|
| Runner-owned 与 owner truth 是否分离 | pass | `AR-RUN-001/003/014` 固定 source/ref/version/freshness 与 local write scope |
| 禁止正文、secret、私有实现是否覆盖 | pass | `AR-RUN-002/004/015` 与 redaction/dependency checks 绑定 |
| 11 Command/12 Query/4 Consumer/5 Job 是否有边界 | pass | `AR-RUN-005/006/007` 逐类覆盖 |
| outbound event 是否明确为零 | pass | `AR-RUN-008` 与 `TC-RUN-BND-003` 固定 count=0 |
| 配置是否可能绕过安全门禁 | pass | `AR-RUN-009` 与 CFG/BND family 绑定 |
| P1/P2 是否污染 P0 分母 | pass | `AR-RUN-011` 明确 future/blocked，不贡献 pass |
| 多轴状态、资源观察、证据是否越权 | pass | `AR-RUN-010/012/013/014/015` 保留 non-escalation |
| evidence 是否可能静态伪造 | pass | same-run raw/report/check、pairing、no-static 共同阻断 |
| 当前是否生成实际结果 | pass | 15/15 红线均 `not_evaluated` |

## 9. 回填草稿

正式 §6 应收录统一红线判定规则、`AR-RUN-001~015` 表、AC/TC/EV 反查关系和跨红线审计结论。正文只写收口后的 owner、禁止项和验收条件；不写本步讨论过程，不把 `not_evaluated` 改成 pass，也不把 blocked positive 改成 not applicable。

## 10. 待确认事项与持续 blocker

| 事项 | 影响 | 当前处理 |
|---|---|---|
| L0-sdk exact client/version/error/redaction surface（`RUN-UP-008`） | `AR-RUN-004` 的 T2+ positive compile/runtime evidence | 保持 SDK-first 与 blocked；不发明方法名 |
| Artifact/Governance exact authority（`RUN-UP-001/002`） | `AR-RUN-003/009/013` 的 positive qualification | 只验 semantic reject/blocked |
| Sandbox/Runtime/Observability/platform seams（`RUN-UP-003~005/007`） | `AR-RUN-006/007/012/015` 的 positive integration | header-first/blocked/fail-closed |
| 实现仓与持久化（`RUN-DDD-001~003`） | 无法执行静态依赖、store、call/write spy | 不创建实现或测试实例 |
| production telemetry/SLO/GRC（`RUN-OPS-001/002`） | T3/T4 证据与 release 裁决 | 保持 blocked，不写阈值 |

## 11. 进入下一步条件

- [x] Runner-owned local truth、owner ref/snapshot、禁止正文与 safe reference 已明确。
- [x] 15 条红线均可检查，并绑定正式 TC family、planned slot/EV alias 与固定 report path。
- [x] Query no-write、Consumer header-first、Job no-owner-repair、event-zero、配置边界和 evidence boundary 已覆盖。
- [x] 红线失败与 VETO 候选关系明确，风险接受不得提前覆盖。
- [x] 所有实际结果仍为 `not_evaluated`；没有伪造 evidence/verdict/readiness。
- [x] 允许进入 Step 7；正式 `06-验收标准.md` 仍禁止写入。
