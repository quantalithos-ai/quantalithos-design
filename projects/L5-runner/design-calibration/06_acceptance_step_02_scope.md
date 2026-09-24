# Step 2. 明确验收目标与范围

> 对应 SOP：`standards/document/验收标准讨论流程_SOP.md` Step 2
> 回填章节：`06-验收标准.md` §2 验收目标与范围
> 状态：`completed / pass / self_reviewed`

## 1. Step 状态

| 项 | 当前值 |
|---|---|
| current_step | Step 2 |
| current_module | `acceptance_scope_and_priority` |
| gate_status | `pass_for_step_03` |
| formal_06_write_allowed | `false_until_step_15` |
| actual_acceptance | `not_entered / no_verdict` |
| next_allowed_action | 创建并完成 Step 3 |

## 2. 本步目标与输入

本步把 Step 1 的权威输入收敛为可裁决的 P0/P1/P2 范围，区分“始终必需的 Runner-owned safety/semantic 门禁”和“只有 baseline 明确启用且 authority 闭合后才必需的 positive integration 门禁”。

| 输入 | 用途 |
|---|---|
| 00 §4、§7、§9～§14、§16 | 目标、五能力、FR/BR/NFR/AC 与 P0/外围边界 |
| 01 §4、§7～§13 | Layer 5、SDK-first、truth ownership、跨平台和技术中立 |
| 02 §5～§13 | 六部分与处理/状态/异常轮廓 |
| 03 §5～§15 | 正式协议、状态、UoW、错误、恢复、配置和观测契约 |
| 05 §2～§5、§10、§12～§14 | 测试范围、CUT、追溯、专项、T0～T4 与 residual |

## 3. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 核心裁决目标是什么？ | 判断一个固定送验 Runner 是否在显式版本、authority/material qualification、受控 run/control、owner-safe read、资源/清理/恢复、preview/diagnosis/handoff、SDK/API 与证据真实性上满足 11 条 AC 和全部 P0 不变量。 |
| P0/P1/P2 如何划分？ | P0 包含 11 条 AC、18 CUT 的 semantic/safety 分母、架构/数据/状态/UoW/证据红线；真实 upstream positive 只有被 baseline 启用时成为 P0-required；批量预取是 P1，multi-run/Archive 浏览及无 authority 量化是 P2/future。 |
| 哪些下游只验接缝？ | Artifact、Governance、Work、Runtime、Sandbox、Observability、Archive、SDK/Bus 只验 Runner-facing public seam、typed outcome、no-bypass/no-write；不验 owner 内部实现。 |
| 哪些非范围影响最终结论？ | 未启用 conditional facet 不进入 positive 分母，但必须证明安全 blocked/disabled；已启用却缺正式合同或证据则阻断进入/通过。实现仓、环境、run 不存在会阻断实际验收生命周期进入。 |
| 哪些可能一票否决？ | 隐式 selector、authority/qualification bypass、ACK/PID/port 冒充运行成功、truth write、Unknown replay、unsafe cleanup、raw leakage、private dependency、Query 写、Consumer parse/ACK、Job owner repair、event emission、静态/错配证据。 |
| 哪些必须用正式名称？ | 全部 11 Command、12 Query、4 Consumer、5 Job、21 状态主语、typed error/result、配置/profile、TC/slot/EV 都必须使用 03～05 正式名称。 |

## 4. 当前文档问题诊断与取舍

| 旧问题 | 新取舍 | 理由 |
|---|---|---|
| 旧 06 按 run UI/card/hint 五主线划范围 | 改为五能力 `CP-RUN-01~05` 与 `AC-RUN-001~011` | 正式需求已完全重建 |
| 把底层 source control 成功简单排除 | 分成安全姿态始终必需、positive 由 baseline enabled 决定 | 防止既无限扩大范围又用 blocked 冒充成功 |
| 旧 P95/首包/100% 直接作门禁 | 无 authority 时只 measurement/residual | 00/05 明确禁止继承历史数字 |
| “全部功能”无分母 | 固定 11 AC、18 CUT、108 TC、12 suite、18 slot 和协议库存 | 可审计且可复验 |

## 5. 结构化中间产物

### 5.1 验收目标

| 目标 ID | 验收目标 | 对应能力 / AC |
|---|---|---|
| `AGO-RUN-01` | 可信 actor/scope/platform 与显式 immutable Release/version 绑定，authority 失败时 fail-closed | CP-01；AC-001～002 |
| `AGO-RUN-02` | 取得、完整性、平台资格、authority freshness 和 cache 保护分轴；只有 qualified 材料可请求运行 | CP-02；AC-003～004 |
| `AGO-RUN-03` | run/control intent 与 owner execution/result 分离；Accepted、ACK、PID、端口不升级 Running/Confirmed | CP-03；AC-005～006 |
| `AGO-RUN-04` | 资源观察、allocation/lease、保护 guard、cleanup 与断线恢复安全闭合；Unknown 不 replay | CP-04；AC-007～009 |
| `AGO-RUN-05` | preview/diagnosis/handoff bounded、redacted、source-attributed；receipt/local log 不升级 evidence | CP-05；AC-010 |
| `AGO-RUN-06` | 所有跨域协作 SDK/API/public adapter only；Query no-write、Consumer header-first、Job no-owner-repair、event-zero | AC-011；03/05 横切红线 |
| `AGO-RUN-07` | 固定 baseline、同 run raw/report/check/digest、VETO/风险/签署闭环真实可复验 | 05 §12～§14；06 横切 |

### 5.2 范围与优先级

| 验收范围项 | 类型 | 优先级 / 当前上限 | 裁决目标 | 非范围 / 说明 |
|---|---|---|---|---|
| trusted context + exact selection | core semantic | P0 | `AC-RUN-001~002`；无隐式 selector、scope/generation 保真 | 不验 Governance/Artifact 内部算法 |
| acquisition + integrity qualification | material | P0 safety；positive conditional | `AC-RUN-003~004`；transfer≠verified≠qualified | locator/crypto/backend 内部不在本仓验收 |
| run request + owner lifecycle | lifecycle | P0 safety；positive conditional | `AC-RUN-005~006`；Accepted≠Running | 不验 Runtime/Sandbox 内部调度/隔离正确性 |
| control intent | lifecycle | P0 | Start/Stop/Cancel intent、basis、receipt/result/Unknown 分离 | owner control implementation 只验接缝 |
| resources + cleanup protection | safety | P0 safety；platform positive conditional | `AC-RUN-007~008`；observation≠allocation；guard-first | 不锁具体 OS/容器/虚拟化实现 |
| disconnect/recovery/manual review | resilience | P0 | `AC-RUN-009`；freeze/query-first/no replay | 自动恢复率与时限无 authority |
| preview/diagnosis/handoff | presentation/security | P0 safety；formal source positive conditional | `AC-RUN-010`；bounded/redacted/source/freshness/non-evidence | 不验 Observability 正式 evidence 内部生成 |
| protocol and entry | contract | P0 | 11 Command、12 Query、4 planned Consumer、5 Job finite typed surface | transport/router/GUI shell 未定 |
| state/UoW/idempotency/concurrency | consistency | P0 | 21 状态主语、version/generation、atomic local sets、stored replay、RecoveryCase | physical DB/lock/backend 未定 |
| config/builder/readiness | control plane | P0 | 41 项、四 profile、strict whole-document、configured≠enabled≠ready | profile 名不授 readiness |
| observability/redaction/dependency/event-zero | security/architecture | P0 | safe fields、低基数、owner writes=0、private dependency=0、event emits=0 | telemetry backend/SLO 未定 |
| fixed-run evidence integrity | adjudication | P0 | 18 slot、runtime EV、pairing/link/redaction/no-static 与 review | planned slot 不等 evidence instance |
| batch prefetch `FR-RUN-014` | peripheral | P1 future/blocked | 重开后独立设计/TC/slot | 不计当前 P0 通过 |
| multi-run comparison / Archive browse `FR-RUN-015~016` | peripheral | P2 future/blocked | 正式合同到达后重开 | 不复用相近 P0 evidence |
| performance/capacity/platform matrix/retention | quantitative | P2 authority-required | authority+workload+baseline 选择后成为 selected gate | 当前不得声明阈值达标 |

### 5.3 Conditional positive 裁决

| Baseline posture | 始终必须满足 | Positive evidence 要求 | 裁决上限 |
|---|---|---|---|
| slot/facet 未启用或正式合同未闭合 | typed `Blocked/Unsupported/Unavailable/Unknown`、zero unsafe effect、无 fake fallback | 不要求，也不得伪造 | 可满足该安全负向门禁；不证明 integration/readiness |
| slot enabled 且 authority/public contract 固定 | 全部安全负向门禁仍成立 | 对应 controlled/product TC 与 runtime EV 必须存在且 pass | 可进入相应 T2/T3 裁决 |
| slot enabled 但合同、环境或 evidence 缺失 | fail-closed/no-call | 无合格 positive | 不得进入或对应门禁失败 |
| semantic fake/controlled negative 通过 | 只证明 Runner-owned 不变量 | 不替代真实 owner/platform positive | 不产生 product/release verdict |

### 5.4 非范围及影响

| 非范围 | 处理 |
|---|---|
| 上游 owner 内部 DB、规则、crypto、scheduler、isolation、audit/evidence、archive/restore | 不验内部实现；Runner 若依赖私有边界则触发 VETO |
| 当前不存在的实现仓、CI/test runner、build/package/environment | 阻断实际验收进入，不阻断本验收合同停审 |
| 未闭合 exact SDK/owner DTO/method/version | 保持 blocked/conditional；不猜 schema |
| 无 authority 的性能、容量、SLO、retention、平台矩阵 | 仅 measurement/residual，不能支撑通过 |
| 代码编辑、部署、runbook、生产上线批准 | 归 07/后续正式运维与治理流程 |

任何 P0 safety、truth ownership、no-replay、cleanup protection、redaction、dependency 或 evidence-integrity 红线失败，都不能由其他 capability 成功、外围体验或风险接受抵消。

## 6. 回填草稿

正式 §2 应使用七个验收目标、范围表、conditional positive 规则和非范围影响。当前 P0 分母固定为 11 条需求 AC 及 18 CUT 的安全/一致性/证据闭环；外围 FR 和无 authority 量化不进入当前 P0 pass。上游 positive 未启用时允许诚实 blocked，启用后缺正式合同或 runtime evidence 必须失败。

## 7. 待确认事项

| 事项 | 影响 | 当前处理 |
|---|---|---|
| 哪些 upstream slot 会在真实 baseline enabled | 决定 positive required set | Step 3 用 facet/slot manifest 固定 |
| P1/P2 是否未来提升 | 改变需求/测试分母 | 必须先回写 00～05 再重开 06 |
| quantitative authority | hard NFR | `RUN-OPS-001~002` 关闭前保持 selected/residual |

## 8. 进入下一步条件

- [x] 核心裁决目标明确。
- [x] P0/P1/P2 和 conditional positive 可判定。
- [x] 下游只验接缝，owner 内部非范围明确。
- [x] VETO 候选方向已识别但未提前定义正式清单。
- [x] 允许进入 Step 3；正式 06 仍禁止写入。
