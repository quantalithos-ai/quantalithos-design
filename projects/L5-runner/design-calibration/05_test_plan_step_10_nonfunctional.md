# Step 10. 设计专项测试与非功能验证

> 对应 SOP：`standards/document/测试方案讨论流程_SOP.md` Step 10  
> 回填章节：`05-测试方案.md` §10  
> 状态：`completed / pass / self_reviewed`

## 1. Step 状态与事实边界

| 项 | 当前值 |
|---|---|
| current_document | `05-测试方案.md` |
| current_step | Step 10 |
| current_module | `nonfunctional:safety_consistency_resilience_observability_performance` |
| gate_status | `pass_for_step_11` |
| gate_reason | 安全红线、一致性/幂等、恢复/断线、依赖失效、观测/审计、跨平台和性能测量均有专项方法与证据候选；没有为未授权的生产性能、SLO、容量或跨仓正向路径编造阈值或结果。 |
| formal_05_write_allowed | `false_until_step_15` |
| implementation_write_allowed | `false` |
| test_execution_allowed | `false` |
| commit_required | `false` |
| next_allowed_action | 创建并完成 Step 11 |

本 Step 只定义专项验证合同。指标、故障向量、阈值来源、环境和证据 ID 是计划项；当前没有压测、渗透、跨平台运行、生产 telemetry、artifact、report 或 verdict。

## 2. 本步目标、输入与非目标

### 2.1 目标

将需求中的非功能红线和详细设计中的高风险机制转化为可执行的专项测试矩阵，至少回答：

1. 如何证明 Runner 不越权、不泄露、不把本地状态升级为上游真相；
2. 如何在 duplicate、version/generation 冲突、commit unknown、断线和依赖不可用时证明安全停留；
3. 如何验证 redaction、低基数观测、correlation 和本地记录/正式证据分离；
4. 如何在不锁定平台实现的前提下验证资源/端口冲突与跨平台 Unsupported/Unknown/Conflict；
5. 如何定义性能与容量的测量维度、阈值来源和 blocked 条件，而不是继承旧数字；
6. 如何把每个专项结果交给 Step 11 的缺陷分级和 Step 13 的证据归档。

### 2.2 输入基线

| 输入 | 本 Step 用途 |
|---|---|
| `00-需求文档.md` §10、§13、§14 | 提供业务红线、性能/可用性/安全/审计/幂等/观测 NFR 与验收方向。 |
| `03-详细设计.md` §9～§15 | 提供 state、UoW、错误/恢复、幂等、配置、外部依赖和观测契约。 |
| `04-配置设计.md` §6、§8～§13 | 提供 profile isolation、redaction、builder/readiness、failure/degradation、change/rollback 规则。 |
| `05_test_plan_step_06_cases.md` | 提供 18 个切口、P0 断言和 fault 数据候选。 |
| `05_test_plan_step_07_test_data.md` | 提供 deterministic、fault、concurrency、canary、replay 数据集。 |
| `05_test_plan_step_08_environment_config.md` | 提供四 profile、controlled/replay 环境和依赖 unavailable 分类。 |
| `05_test_plan_step_09_automation_gates.md` | 提供专项 suite、gate、scan、artifact/report 合同。 |

### 2.3 非目标

- 不从旧 `05` 的 P95、首包、成功率或容量数字推导当前阈值。
- 不创建压测脚本、渗透工具、真实跨平台环境、生产流量、外部服务或测试报告。
- 不把 semantic fake、controlled failure、replay snapshot 或人工 UX review 解释成 production readiness。
- 不验证 Artifact/Governance/Sandbox/Runtime/Observability/Archive 内部实现；只验证 Runner-facing 合同和边界。
- 不以 HTTP 状态、PID、端口可连、ACK、stdout/stderr 或本地 telemetry 作为 owner outcome、Running、Cleaned 或正式 evidence。

## 3. SOP 问题回答

| 问题 | 收口回答 |
|---|---|
| 哪些性能指标必须验证？ | 当前必须验证可测维度：选择/校验、查询渲染、状态重建、恢复查询、redaction 扫描和 run-local 资源占用的延迟/吞吐/增长趋势；P95/P99、冷/热启动、并发、带宽和容量阈值只有在 NFR/平台/运维 authority 提供后才可转为 gate。 |
| 哪些安全和边界红线必须负向测试？ | `latest`/隐式选择、authority/integrity 缺失、scope 越权、私有 SDK/后端、Query 写入、Consumer parse/ACK、owner truth writeback、raw secret/body/path/URL/PID/port/stack 泄露、local log 升级 evidence、Unknown replay 和保护材料误清理。 |
| 哪些一致性/恢复场景要故障注入？ | expected-version/generation 冲突、duplicate/different digest、UoW commit unknown、外部 effect unknown、claim/checkpoint race、断线/重连、stale source、missing result/receipt、redaction sink failure、cleanup ACK unknown。 |
| 哪些日志、指标和审计证据必须存在？ | 每类 Command/Query/Consumer/Job 的 safe kind/ref/outcome/correlation/freshness/visibility；低基数 metrics；RecoveryCase/issue ref；redaction/boundary scan；但本地记录仍不是 L4 formal audit/evidence/report。 |
| 阈值来自哪里？ | 优先级为正式 NFR/验收或 owner/platform authority，其次是实施后经批准的基线；无来源的数值只做 exploratory measurement，不能阻断或宣称通过。 |
| 环境不可用如何记？ | 预期 fault profile 是该 TC 的输入；未授权的真实依赖、测试 harness 或平台不可用则 `not_run/blocked`，不降级为 pass，也不以 fake fallback 代替。 |

## 4. 专项测试总览

| 专项 ID | 专项名称 | 主要风险 | 主 suite/环境 | P0/P1 | 当前状态 |
|---|---|---|---|---|---|
| `NF-RUN-SEC` | 安全与 truth-boundary negative | 越权、泄露、私有实现、真相反写 | `S-RUN-SECURITY` / CI deterministic | P0 | planned；语义可自动化 |
| `NF-RUN-CONS` | 一致性、幂等与 no-write | 重复副作用、部分提交、查询写入、generation 漂移 | `S-RUN-UOW`/`S-RUN-SERVICE` | P0 | planned；fake/controlled |
| `NF-RUN-REC` | 断线、未知副作用与恢复 | 把 Unknown 当成功、重放危险 effect、错误清理 | `S-RUN-REPLAY`/`S-RUN-JOB` | P0 | planned；真实 owner recovery blocked |
| `NF-RUN-DEP` | 依赖失效与降级 | fail-open、隐式 fallback、configured=ready 混淆 | `S-RUN-CONTROLLED`/CONFIG | P0 | planned；positive seam blocked |
| `NF-RUN-OBS` | 观测、审计与 redaction | raw material、高基数、错误 audit 语义 | `S-RUN-SECURITY`/REPLAY | P0 | planned；扫描器待实现 |
| `NF-RUN-PORT` | 跨平台与资源冲突 | 把本地 probe 当 allocation truth，平台差异泄漏 | CONTROLLED | P0 | planned；平台 authority blocked |
| `NF-RUN-PERF` | 性能、资源与容量测量 | 未授权阈值、阻塞安全主链、资源泄露 | future controlled/replay | P1/P2 | measurement planned；gate blocked |
| `NF-RUN-UX` | 失败/等待/Blocked 可理解性 | 用户误把 accepted/unknown 当成功 | local-safe + 人工 review | P1 | 补充审查，不替代 P0 gate |

## 5. 安全与真相边界专项（`NF-RUN-SEC`）

| 风险/场景 | 方法与输入 | 必须断言 | 环境/profile | 证据候选 | 通过条件 |
|---|---|---|---|---|---|
| 隐式 `latest`、默认分支、cache 最新项 | `DS-RUN-SELECT-NEG-001` 单字段 mutation | reject/Blocked；没有 selection、下载、启动或 owner call | CI deterministic | `EV-CAND-RUN-SEC-001` | 零危险副作用 |
| authority/approval/baseline 缺失或过期 | controlled authority vectors | 不本地批准；不进入 material/run mutation | controlled | `EV-CAND-RUN-SEC-002` | posture 保持 pending/blocked |
| manifest/digest/signature/platform mismatch | material negative vectors | 不把 transfer/complete 当 verified/qualified | CI/controlled | `EV-CAND-RUN-SEC-003` | fail-closed、safe issue ref |
| actor/scope/visibility 越权 | entry metadata 与 context mutation | body 不可覆盖 trusted scope；无 read/write/dispatch | CI deterministic | `EV-CAND-RUN-SEC-004` | `Rejected/VisibilityDenied` |
| 私有 SDK、Sandbox backend、内部表/bus topic | source/import/call graph scan（实现后） | boundary scan 无违规；未知实现依赖阻断 gate | CI/future release | `EV-CAND-RUN-SEC-005` | 0 findings |
| Query/render/reconnect 触发写入 | write spy、UoW/port call log | reserve/save/refresh/reconcile/dispatch/cleanup = 0 | CI deterministic | `EV-CAND-RUN-SEC-006` | no-write |
| Consumer payload parse/hash/store/ACK | header-only opaque fixture | 缺/不支持 header 时 body untouched，ACK=0 | CI deterministic | `EV-CAND-RUN-SEC-007` | header-first |
| local projection/receipt/report 反写 owner truth | call audit + safe stores | Artifact/Governance/Runtime/Sandbox/Observability/Archive truth write = 0 | controlled | `EV-CAND-RUN-SEC-008` | boundary preserved |
| 受保护 material 清理 | `ProtectionGuard` missing/stale/conflict | `Protected/Unknown/Blocked`，释放/删除调用=0 | controlled | `EV-CAND-RUN-SEC-009` | fail-closed |
| raw secret/body/path/URL/PID/port/stack | forbidden canary through all outputs | 0 visible findings；redaction 失败不回显 | CI deterministic | `EV-CAND-RUN-SEC-010` | zero leakage |

## 6. 一致性、幂等与并发专项（`NF-RUN-CONS`）

| 场景 | 注入/方法 | 关键断言 | 失败后姿态 | 环境 | 证据候选 |
|---|---|---|---|---|---|
| same key + same stable digest | completed idempotency record | 精确回放 stored result；external calls/UoW=0 | `DuplicateReplayed` | CI | `EV-CAND-RUN-CONS-001` |
| same key + different stable digest | semantic mutation only | `IdempotencyConflict`；原记录不变 | no retry | CI | `EV-CAND-RUN-CONS-002` |
| Reserved/InProgress collision | two deterministic actors | 不 takeover、不二次 effect；必要时 RecoveryCase | `InProgress/Unknown` | CI | `EV-CAND-RUN-CONS-003` |
| expected version stale | repository fake | `VersionConflict`；no last-write-wins/owner call | local state unchanged | CI | `EV-CAND-RUN-CONS-004` |
| append unique duplicate | same transition/history key | 只追加一次；stored result stable | duplicate safe | CI | `EV-CAND-RUN-CONS-005` |
| projection generation mismatch | J05/Q12 vectors | replace 只接受 exact identity+generation；Query replace=0 | stale/degraded view | CI | `EV-CAND-RUN-CONS-006` |
| UoW commit response lost | controlled commit fault | commit knowledge distinct from effect; no automatic replay | `Unknown + RecoveryCase` | CI/controlled | `EV-CAND-RUN-CONS-007` |
| simultaneous cleanup/control | deterministic ordering/fence | guard/lease/epoch protects destructive action | `Blocked/Conflict` | controlled | `EV-CAND-RUN-CONS-008` |

所有一致性专项都必须同时检查状态、stored result/receipt、调用次数、版本/generation 和安全记录；只看最终返回值不构成通过。

## 7. 断线、未知副作用与恢复专项（`NF-RUN-REC`）

| 断点/故障 | 方法 | 预期安全结果 | 禁止结果 | 证据候选 |
|---|---|---|---|---|
| request accepted 后连接断开 | controlled owner effect + lost response | local accepted/pending 与 owner outcome 分离；建立 recovery basis | 显示 Running/Completed 或 resend | `EV-CAND-RUN-REC-010` |
| control ACK timeout | C08/C09 fault profile | `Unknown`、RecoveryCase、query-first/manual review | retry/reclaim/kill replay | `EV-CAND-RUN-REC-011` |
| owner read unavailable | J03/Q08 unavailable | Frozen/ManualReview/degraded safe view | inferred success/rejection、local close | `EV-CAND-RUN-REC-012` |
| missing/wrong-kind stored result | duplicate gate | `ConsistencyUnknown`；不重建、不 rerun | current truth shortcut | `EV-CAND-RUN-REC-013` |
| stale checkpoint/claim fence | J01/J03/J05 vectors | `Blocked/Unknown`；不自动 resume/takeover | old worker writes report | `EV-CAND-RUN-REC-014` |
| reconnect/cache miss | Query and local cursor replay | 只重建 bounded view/cursor；不写 owner | refresh/reconcile/cleanup dispatch | `EV-CAND-RUN-REC-015` |
| cleanup result unknown | guard + adapter timeout | material remains protected; recovery marker | `Cleaned/Evicted` claim | `EV-CAND-RUN-REC-016` |

恢复专项的通过条件是“安全停留和可追踪”，不是“最终自动恢复成功”。真实 owner recovery 正向保持 `RUN-UP-003/004/006` blocked。

## 8. 依赖失效与降级专项（`NF-RUN-DEP`）

| 依赖/失效 | 测试方法 | 预期 posture | 禁止 fallback | 环境/证据候选 |
|---|---|---|---|---|
| Artifact locator/source unavailable | controlled source returns `Unavailable` | acquisition `Blocked/Unavailable`；无 material mutation | 读取 cache 最新项、跳过验证 | controlled / `EV-CAND-RUN-DEP-001` |
| Governance authority unavailable/ambiguous | authority adapter fault vector | `Pending/Blocked/Unknown`；不本地批准 | 历史 approval、角色推断、空结果放行 | controlled / `EV-CAND-RUN-DEP-002` |
| Integrity verifier unsupported/fails | verifier capability fault | `Unverified/Blocked`；不进入 Sandbox request | transfer complete 或 HTTP success 当 verified | deterministic/controlled / `EV-CAND-RUN-DEP-003` |
| Sandbox request/lease unavailable | semantic adapter returns `Unsupported/Unavailable` | request posture 保持 `Rejected/Blocked/Unknown`；无 Running | PID/port/container 状态代替 owner result | controlled / `EV-CAND-RUN-DEP-004` |
| Runtime status/result read unavailable | safe read fake returns stale/unknown | safe view degraded；RecoveryCase 如 effect ambiguity | 本地 cursor/cache 推断终态 | controlled/replay / `EV-CAND-RUN-DEP-005` |
| Observability/redaction sink unavailable | sink fault or policy ref missing | diagnostic/handoff `Blocked` 或 bounded degraded；业务结果不变 | raw local log、未脱敏 fallback | deterministic/controlled / `EV-CAND-RUN-DEP-006` |
| Archive reference unavailable | peripheral adapter fault | archive path `Blocked`；run/cleanup core posture不升级 | 把本地 package 当 archive truth | controlled / `EV-CAND-RUN-DEP-007` |
| Platform resource probe unknown/conflict | platform semantic fake | `Unknown/Conflict/Blocked`；不做 allocation claim | 固定 OS 命令、静默抢占或覆盖 lease | controlled / `EV-CAND-RUN-DEP-008` |
| L0-sdk seam/version unsupported | compile/runtime candidate unavailable | dependent suite `blocked/not_run`；保留 blocker | 复制 SDK/private implementation | CI gate / `EV-CAND-RUN-DEP-009` |
| core local store/UoW capability missing | builder capability marker absent | Builder `Failed/Blocked`；不暴露半 facade | in-memory/product fallback | deterministic / `EV-CAND-RUN-DEP-010` |

专项通过条件是：每个 fault vector 的 typed outcome、safe issue/ref、零越权副作用和准确的 unavailable 分类均可被断言；“降级”不等于“可继续运行”，非法配置仍须 fail-fast。

## 9. 观测、审计与 redaction 专项（`NF-RUN-OBS`）

| 观测面 | 输入/方法 | 必须存在 | 必须不存在 | 证据候选 |
|---|---|---|---|---|
| Command trace | C01～C11 deterministic invocation | entry、validation、reservation、local transition、result/recovery safe refs | raw body、secret、完整 key、owner body | `EV-CAND-RUN-OBS-010` |
| Query read marker | Q01～Q12 repeated/stale/denied | read subject、visibility、freshness、section/generation | reservation/save/refresh/reconcile/dispatch marker | `EV-CAND-RUN-OBS-011` |
| Consumer marker | header-first missing/unsupported/duplicate | source/schema/event/dedup safe header、disposition | payload bytes、owner cursor、ACK success | `EV-CAND-RUN-OBS-012` |
| Job report marker | J01～J05 claim/checkpoint/fault | job kind/run/claim/checkpoint/report refs、bounded counts | owner truth/evidence body、raw report payload | `EV-CAND-RUN-OBS-013` |
| Metrics cardinality | actor/subject/request/result/trace canary | finite kind/outcome/category labels | free text和高基数 IDs | `EV-CAND-RUN-OBS-014` |
| Redaction all surfaces | secret/body/path/URL/PID/port/stack corpus | blocked/absent or bounded marker；scan result | raw value、部分拼接泄露、fallback output | `EV-CAND-RUN-OBS-015` |
| Audit/evidence separation | local receipt/report/handoff sample | local correlation and explicit non-evidence posture | formal audit/evidence/report/verdict/signoff claim | `EV-CAND-RUN-OBS-016` |
| Failure/Unknown telemetry | rejected/duplicate/blocked/unknown vectors | issue/RecoveryCase correlation and safe outcome | accepted business trace或success metric | `EV-CAND-RUN-OBS-017` |

观测专项必须在原始 artifact 和人类报告两个输出面各执行一次；扫描器不可用时结果为安全阻断或 `not_run`，不得因“没有发现”而通过。

## 10. 跨平台、资源与清理专项（`NF-RUN-PORT`）

| 场景 | 平台中立输入 | 预期结果 | 禁止推断/副作用 | 状态 |
|---|---|---|---|---|
| port/resource available | bounded `ResourceObservation` + source/freshness | 仅显示 observation；allocation/lease 仍由 owner | probe=allocated、自动抢占 | planned controlled |
| port/resource conflict | conflicting observation + requested resource | `Conflict/Blocked`，说明影响与下一步 | 覆盖已有 lease、静默换端口、伪造可用 | planned controlled |
| observation unknown | missing/stale/unsupported probe | `Unknown/Blocked`；不启动危险 effect | 缺失当 available | planned controlled |
| platform unsupported | unknown OS/arch/provider capability | `Unsupported`；不编译/调用私有 backend | Docker/gVisor/Firecracker/Tauri 假定 | blocked `RUN-UP-007` |
| cleanup protected | active lease/capture/handoff/retention | `Protected/Blocked`，释放调用=0 | 本地 cache 直接删除 | planned controlled |
| cleanup owner ACK | controlled accepted/unknown/confirmed posture | local receipt 与 owner cleanup posture 分离 | ACK=Cleaned/Evicted | blocked `RUN-UP-003` |
| sleep/restart/reconnect | deterministic cursor/basis and stale platform view | freeze/revalidate/manual review | reconnect=auto resume/replay | planned replay |

该专项只验证 Runner 的表示与保护边界，不验证操作系统、容器、虚拟化或 Sandbox backend 的内部正确性。

## 11. 性能、资源与容量测量专项（`NF-RUN-PERF`）

| 测量面 | 采样对象 | 测量方法 | 阈值来源/状态 | 不得宣称 |
|---|---|---|---|---|
| selection/validation | exact selection、strict config、integrity posture | deterministic fixed-size cases；记录分布和样本规模 | 先做 exploratory；正式 NFR/owner authority 后定 P95/P99 | 当前性能达标 |
| query/render | bounded page/view、stale/degraded sections | repeated read-only runs；区分 cache hit/miss | 产品/平台 authority 待定 | 任何 UI SLA |
| recovery/reconcile | RecoveryCase/read-only recheck | controlled unavailable/unknown vectors；记录安全停留时长 | 运维/可靠性 authority 待定 | 自动恢复成功率 |
| redaction/scan | output size、forbidden-field corpus | fixed corpus + size buckets；记录扫描成本 | 安全/平台 authority 待定 | 零成本或生产吞吐 |
| concurrent local operations | idempotency/UoW/claim collision | deterministic bounded concurrency；观察冲突、锁等待、资源 | 实现仓/存储 authority 待定 | 支持某并发数 |
| cache/material growth | run-scoped metadata and cleanup journal | long-run bounded fixture/replay；检查残留与增长趋势 | 容量 authority 待定 | durable leak-free |
| cross-platform overhead | semantic platform observations | same logical dataset across approved platforms | platform authority 待定 | OS parity/readiness |

规则：在阈值来源、 workload、平台和实现仓未闭合前，`NF-RUN-PERF` 只能产出测量计划或 exploratory data，不能成为 P0 release gate；任何超时先按 Step 9 分类为 `timeout`，不得事后挑选样本。

## 12. 可理解性与失败交互补充专项（`NF-RUN-UX`）

| 场景 | 人工/自动方法 | 必须确认 | 证据形态 | 边界 |
|---|---|---|---|---|
| authority/integrity blocked | local-safe scripted view + review checklist | 原因、来源/freshness、下一步明确；无“可运行”暗示 | review notes + safe snapshot | 不替代 authority truth |
| accepted/pending/unknown | state transition examples | 接收、处理中、确认、未知分层可理解 | bounded presentation sample | 不把文案 review 当 owner outcome |
| resource conflict/cleanup protection | conflict and protected samples | 影响范围、保护原因、恢复动作可见 | UX review | 不验证平台分配 |
| stale/partial/restricted preview | safe view corpus | freshness/visibility/redaction/partial posture 明确 | review notes | 不泄露正文 |
| disconnected/reconnect | simulated timeline | freeze/revalidate/manual review 路径明确 | timeline review | 不证明自动恢复 |

此专项是 P1 补充，不可降低 P0 安全/一致性 gate，也不能为未执行的产品环境生成 release evidence。

## 13. NFR 来源、阈值与证据矩阵

| NFR/验收方向 | 当前可验证断言 | 阈值/裁决来源 | 当前 gate 状态 | 后续证据候选 |
|---|---|---|---|---|
| 性能可解释进度 | 有进度、阶段、freshness 和安全停留，不阻断主安全链 | `00` §13；具体 P95/P99 后置 | measurement planned；不阻断 | `EV-CAND-RUN-PERF-*` |
| 可用性/失败下一步 | owner unavailable、断线、冲突保持 blocked/unknown 并给 safe next step | `00` §13、AC-RUN-002/005/009 | P0 semantic gate | `EV-CAND-RUN-DEP/REC-*` |
| 安全 fail-closed | 无隐式版本、越权、私有实现、raw material | `00` §13/§14、AC-RUN-001/002/004/011 | P0 blocking | `EV-CAND-RUN-SEC/OBS-*` |
| 审计/追溯 | source/correlation/freshness 可回指；local record 非 formal evidence | `00` §13/§14、AC-RUN-010 | P0 semantic; formal evidence later | `EV-CAND-RUN-OBS-*` |
| 幂等/一致性 | version/digest/generation/epoch 冲突停止副作用；Query no-write | `00` §13、03 §10/§12 | P0 blocking | `EV-CAND-RUN-CONS-*` |
| 可观测性 | redacted bounded output、低基数标签、telemetry 与 audit 分离 | `00` §13、03 §14 | P0 blocking | `EV-CAND-RUN-OBS-*` |

## 14. 专项测试停审与跨专项审计

| 审计项 | 结论 | 缺口/处理 |
|---|---|---|
| P0 安全红线均有负向方法 | 通过（设计层） | CUT-01/08/09/10/14/16/17/18 全覆盖。 |
| 一致性、幂等、UoW、generation、claim/checkpoint 有故障向量 | 通过（设计层） | `NF-RUN-CONS/REC` 覆盖；真实 durable parity blocked。 |
| Unknown 是否被误写成成功 | 无 | 所有 unknown 均要求 RecoveryCase/freeze/no replay。 |
| 依赖 unavailable 是否与预期负向区分 | 通过 | controlled fault 可作为 TC 输入；意外 infra 为 not_run/blocked。 |
| redaction/低基数/审计分离是否可留证 | 通过（计划） | artifact/report 双面扫描；实际扫描器尚未实现。 |
| 跨平台是否误锁旧技术 | 无 | 只使用 semantic observation 和 Unsupported/Unknown/Conflict。 |
| 性能阈值是否有来源 | 通过 | 无 authority 的数字不进入 gate；旧数字不继承。 |
| P1/P2 是否升级为 P0 readiness | 无 | PERF/UX、真实 owner recovery 和 product profile 保持 planned/blocked。 |
| 专项是否覆盖 18 个切口和 AC | 通过 | 见 §5～§13；每个 AC 至少有安全/一致性/恢复或追溯断言。 |

## 15. 结构化回填草稿

正式 §10 应收录：专项总览、安全与真相边界、一致性/幂等、恢复、依赖失效、观测/redaction、跨平台资源、性能测量和 UX 补充矩阵；明确阈值来源、blocked/not-run 语义和“无来源数字不成为 gate”的规则。正文不得写入真实压测结果、SLO、生产 readiness 或验收 verdict。

## 16. 待确认与持续 blocker

| 项 | 影响 | 当前处理 |
|---|---|---|
| NFR P95/P99、冷/热启动、并发、带宽、容量 authority (`RUN-OPS-001`) | 无法定量 release gate | 只保留 measurement plan/exploratory，待 authority。 |
| Artifact/Governance/Sandbox/Runtime/Observability/Archive/平台 seam (`RUN-UP-001~007`) | 正向 dependency/recovery/platform 专项不能执行 | semantic fake/controlled negative；positive blocked。 |
| SDK exact surface (`RUN-UP-008`) | boundary/telemetry scan 不能宣称 compile-ready | candidate only。 |
| durable store/cache/runner (`RUN-DDD-001~003`) | restart parity、capacity 和真实资源测量未知 | 不创建实现或性能环境。 |
| 06/07 尚未重建 (`RUN-DOC-002~003`) | EV 不能形成正式裁决或实施 gate | Step 13 只定义计划 schema；Step 15 后停审。 |

## 17. Step 10 进入下一步门禁

- [x] 安全、truth boundary、依赖失效、redaction、no-write/no-replay 和 event-zero 有专项方法。
- [x] 一致性、幂等、UoW、断线、Unknown、claim/checkpoint、cleanup protection 有 fault vectors。
- [x] 观测、审计、低基数和 forbidden-field 规则可形成扫描证据。
- [x] 跨平台/资源验证保持 technology-neutral，不复用 Sandbox 私有实现。
- [x] 性能/容量指标明确测量面和阈值来源；无来源数字不进入 gate。
- [x] P0/P1/P2、blocked/not-run 和 fake/controlled/real-like 边界无 unresolved 冲突。
- [ ] 专项执行、压测、渗透、跨平台环境、artifact、report、evidence、verdict、readiness：未发生，不作为本 Step 条件。

Step 10 完成，允许进入 Step 11；正式 `05-测试方案.md` 仍不可写。
