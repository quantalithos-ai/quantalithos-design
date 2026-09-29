# Step 9. 定义非功能验收门禁

> 对应 SOP：`standards/document/验收标准讨论流程_SOP.md` Step 9\
> 正式回填：`06-验收标准.md` §9\
> 日期：2026-09-14\
> 状态：`completed / structural_p0_closed_measured_p2_blocked / continue_authorized`

## 1. Step 状态与 Step 内计划

| 项 | 结论 |
|---|---|
| 当前 Step | Step 9：定义非功能验收门禁 |
| 目标 | 固定安全、可用、兼容、恢复、配置、观测和资源有界性的 P0 裁决，并隔离无 authority 的 measured P2 |
| gate_status | `completed / structural_p0_closed_measured_p2_blocked` |
| gate_reason | 8 项 P0 NFR 均有来源阈值/结构条件、exact TC、EV/report 和阻断影响；延迟、吞吐、容量、RTO/RPO、长稳和跨区无来源数字未写入通过条件 |
| next_allowed_action | 按连续授权创建并完成 Step 10 |
| source_files | 正式 00 §13～15；03 §10～15；04 §7～14；05 §10/12～14；05 Step 10；Step 5～8 |

| 小阶段 | 产物 | 状态 | 完成门禁 |
|---|---|---|---|
| 9A | 阈值来源分类 | done | 离散硬条件、结构性条件、measured 条件不混同 |
| 9B | 8 项 P0 NFR AC | done | 性能结构/可用/安全/兼容/恢复/配置/观测/依赖完整 |
| 9C | P1/P2 与未执行专项 | done | 不伪造数值或 readiness |
| 9D | 失败与 blocker 裁决 | done | formal blocked 不转 residual |
| 9E | 停审与跨项审计 | done | 无无来源阈值、fake closure 或重复裁决冲突 |

## 2. 阈值与证明层级

| 类型 | 来源 | 示例 | 裁决规则 |
|---|---|---|---|
| 离散硬门禁 | 正式 00～05 | forbidden write/leak/effect=`0`；8/8 source class；55/55 P0 key；required TC 全有结果 | 不满足即 P0 失败，适用时 VETO |
| 结构性 P0 | 正式设计/配置合同 | positive bound、L/L+1、visible partial/continuation、no infinite/blind retry、Query no-write | 按实际 pinned 配置与边界 vector 判定，不需本文私造数字 |
| target-specific formal | owning contract + fixed baseline | schema/version/compatibility、storage/receiver finality、owner coverage | 缺 prerequisite 为 required `blocked`；fake 不替代 |
| measured P2 | future workload/environment/method/owner | latency、throughput、capacity、RTO/RPO、long-run、cross-region | authority 未闭合时 `blocked/not_run`，不得写达标或不达标 |

## 3. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 哪些非功能指标是 P0？ | 资源有界与进度可见、Query 零写、安全/脱敏、依赖降级保守、兼容/完整性 fail-closed、幂等/可恢复、55-key 配置/production fake 隔离、观测非干扰与 native traceability。 |
| 阈值来自哪里？ | 离散分母与零容忍来自正式 00～05；运行 bound 来自未来实际 pinned 04 config；schema/finality 来自 owner/provider contract；数值性能只能来自 future workload authority。 |
| 哪些专项未覆盖，是否影响验收？ | formal source/integrity/storage/governance/receiver/audit positive 仍是 P0 blocked，影响完整验收；selected provider/SDK/product 是 P1；数值/长稳/灾备是 P2，不可冒充 P0。 |
| 哪些失败阻断发布？ | 任一 P0 NFR failed/blocked/infra-failed/not-run；尤其跨域写、泄漏、fail-open、盲重放、production fake、dependency/outbound 偷渡和证据伪造均阻断。 |
| 证据来自哪里？ | 05 的 RESOURCE/QUERY/SECURITY/OBSERVE/CONFIG/DEPENDENCY/UOW/IDEMP/EFFECT/RESTORE/JOB/REPORT exact TC，正式 EV family 和 fixed-run suite/report。 |

## 4. Historical material 诊断与改动前后对比

| 旧口径 | 问题 | 当前处置 |
|---|---|---|
| P95 `<3s`、归档 5 分钟、成功率/可用率 100%/99.9% | 无 workload、环境、窗口、方法和 owner | 删除数值；P2 measured blocked |
| 默认 7 年、hot/warm/cold | governance/storage authority 未闭合 | 只验 current decision、typed tier/ref 与 fail-closed |
| mock E2E 可证明可用性 | fake 不证明 formal finality | local negative 与 formal positive 分开 |
| retry 保证恢复 | timeout 可能已派发 | exact probe/reconcile + no blind retry |
| 有日志等于可观测/可审计 | runtime telemetry 可丢失且非 truth | telemetry/native/formal material 三层 |

| 项 | 旧 06 | 当前 Step | 理由 |
|---|---|---|---|
| 性能 | 无来源硬数字 | structural P0 + measured P2 | 可验证且不造 SLA |
| 可用性 | 外部依赖“可用” | 局部已知事实保留、总体保守 | 不以失败造全局成功 |
| 安全 | 泛化权限/加密 | zero write/leak、authority、body/secret boundary | 可自动判定 |
| 恢复 | 重试成功 | knowledge-aware probe/reconcile/partial | 防重复 effect |
| 兼容 | 支持版本 | target-specific immutable assessment | 不私造 migration |

## 5. 验收裁决取舍

| 议题 | 采用方案 | 未采用方案 | 理由 |
|---|---|---|---|
| 无数值是否意味着不测性能 | 仍验 positive bound、L/L+1、progress/partial，并记录 sample | 完全不测，或私造数字 | 结构风险本身是 P0 |
| formal positive | required blocked | 放入可接受 residual | authority/finality 是 P0 核心价值 |
| sample 高低 | 只记录，不形成 pass/fail | 对历史阈值比较 | 无当前 authority |
| optional telemetry | sink 可降级但不改业务；native required record 失败则 UoW 不成立 | 所有观测失败都忽略 | 区分非权威 signal 与正式记录 |
| evidence integrity | Step 9 标为 P0 NFR，Step 10 细化证据 AC | 只留 Step 10 | 防 report 故障被视为非功能无关项 |

## 6. 结构化中间产物

### 6.1 非功能验收表

统一要求：所列 EV instance 必须出现在 `reports/runs/<run_id>/evidence-index.md` 并回指 same-run raw；当前 instance 全为 0。

| 验收项 ID | 维度 | 指标 / 要求 | 阈值 / 来源 | exact 证据来源 | 结论口径 |
|---|---|---|---|---|---|
| `AC-AR-NFR-001` | 资源有界与进度 | request/page/source/manifest/restore/worker 按 pinned positive bound 运行；L 与 L+1 均有 typed result；超界显式 Partial/Blocked/continuation，报告 count/checkpoint，不静默截断或无限 retry | bound 必须 `>0` 且来自 fixed config identity；zero silent truncation；正式 00/03/04 | `TC-AR-RESOURCE-001`,`TC-AR-REPORT-001`; `EV-AR-NFR-001`,`EV-AR-REPORT-001`; `archive-resource-bounds.md` | 结构断言失败则不通过；具体容量/耗时不在本项硬判 |
| `AC-AR-NFR-002` | Query 非干扰 | Q01～Q05 × telemetry on/off 均在 committed snapshot 读取，safe stale/partial surface，绝不回源写、长写事务或修复 | `begin_uow/reserve/save/append/complete/claim/external_port = 0`；03/05 | `TC-AR-QUERY-001～005`,`TC-AR-OBSERVE-001`; `EV-AR-QUERY-001`,`EV-AR-OBSERVE-001`; `archive-service-flow.md` | 任一写/effect 或跨 snapshot 失败；越权写可能 VETO |
| `AC-AR-NFR-003` | 可用性与降级 | 单 source/storage/receiver/visibility/telemetry seam 失败时，已提交局部事实可读，总体只为 Partial/Blocked/Unknown；没有 silent fallback 或 timeout→success | 所有故障注入 vector 有保守结果；00 §13、03 §11 | `TC-AR-RESOURCE-002`,`TC-AR-EFFECT-002～004`,`TC-AR-RESTORE-004`; `EV-AR-NFR-001`,`EV-AR-EFFECT-001`,`EV-AR-RESTORE-001`; consistency/formal reports | local negative failed 则不通过；formal positive unavailable 仍 P0 blocked |
| `AC-AR-NFR-004` | 安全、authority 与脱敏 | owner DB/secret/key/credential/provider response/未获准 body/敏感 ref 不进入 truth、config、API/error/log/metric/span/raw/report；hidden 不可枚举；hash 不绕 denylist | forbidden write/leak=`0`；正式 source matrix/04 denylist/05 canary | `TC-AR-AUTHORITY-005`,`TC-AR-SECURITY-001～002`,`TC-AR-CONTRACT-004`; `EV-AR-AUTHORITY-001`,`EV-AR-SECURITY-001`; `redaction-check.md` | 任一写/泄漏直接不通过且适用 VETO，不可风险接受 |
| `AC-AR-NFR-005` | 完整性与版本兼容 | assessment 绑定 exact Bundle revision/input/capability/target；Unknown/Unsupported/IntegrityFailed/Blocked 保真；重验新记录；不自动 migrate | target-specific formal contract；无合同不允许 Verified/Supported；00/03 | `TC-AR-OBJECT-004`,`TC-AR-STATE-007`,`TC-AR-JOB-007～008`,`TC-AR-QUERY-003`; `EV-AR-OBJECT-001`,`EV-AR-STATE-001`,`EV-AR-JOB-001`,`EV-AR-QUERY-001`; `archive-formal-seam.md` | false positive 失败/VETO；formal capability 未闭合则 blocked |
| `AC-AR-NFR-006` | 幂等、并发与恢复 | same/same full replay、same/different conflict、CAS/range/fence、local/external unknown 分探针、partial explicit subset、per-owner isolation 和 compensation authority 全成立 | zero duplicate effect / old-fence effect；正式 03 §10～12 | `TC-AR-UOW-001～004`,`TC-AR-IDEMP-001～004`,`TC-AR-EFFECT-001～004`,`TC-AR-RESTORE-001～005`; UOW/IDEMP/EFFECT/RESTORE EV；`archive-consistency-replay.md` | 任一 failed 不通过；盲重放/跨域效果可能 VETO；durable/formal 未闭合则 blocked |
| `AC-AR-NFR-007` | 配置、装配与依赖隔离 | 12 域/55 P0 keys exact 校验；非法 winner 不 fallback；required slot missing/degraded/disabled 无 facade；production 无 fake；仅核验 Core 可 compile；outbound absence | keys=`55/55`、unknown/duplicate/silent fallback=`0`；04/05 | `TC-AR-CONFIG-001～004`,`TC-AR-DEPENDENCY-001～002`; `EV-AR-CONFIG-001`,`EV-AR-DEPENDENCY-001`; `archive-config-boundary.md`,`dependency-boundary.md` | 配置/依赖失败阻断；production fake、reverse compile、ready outbound 可 VETO |
| `AC-AR-NFR-008` | 观测、追溯与证据完整性 | entry/UoW/effect/state/query/claim 有 safe finite signal；mandatory native basis/history/result/report relation 完整；optional sink 不干扰；raw/report/EV same-run 可审 | required native relation 缺失=`0` 容忍；metric high-cardinality/forbidden value=`0`；03/05 | `TC-AR-OBSERVE-001～002`,`TC-AR-REPORT-001～002`,`TC-AR-SECURITY-001`; `EV-AR-OBSERVE-001`,`EV-AR-REPORT-001`,`EV-AR-SECURITY-001`; `archive-security-observe.md`,`report-audit.md` | 断链/静态证据/泄漏不通过；formal audit material 未闭合则对应 lane blocked |

### 6.2 P1 / P2 非功能边界

| 项 | 优先级 / 当前状态 | 解锁输入 | 当前裁决 |
|---|---|---|---|
| selected storage/integrity/KMS/compression implementation hardening | P1 / pending | exact provider/version/config/vector/owner | 独立 target run；不替代 P0 port/finality/security |
| selected SDK/product consumer compatibility | P1 / pending | `AR-ARCH-001` closure + public binding/version | 独立 consumer run；不影响 owner truth |
| Bundle size/throughput/latency/capacity | P2 / blocked | workload distribution、environment、method、percentile/window、threshold、owner | `archive-p2-measured` not-run/blocked；无 verdict |
| archive/restore RTO/RPO | P2 / blocked | source/storage/receiver recovery contracts + workload/method/threshold | 不声明恢复目标达标 |
| long-run/cross-region/DR | P2 / future | 正式需求、拓扑、failure model、owner | 当前非范围，不形成 readiness |
| evidence retention duration | governance/records pending | formal retention/hold/delete authority | 只要求验收/复验期间不可自动清除；不私造期限 |

### 6.3 失败、不可执行与风险分流

| 状态 / 触发 | 裁决 |
|---|---|
| P0 structural assertion failed | 对应 NFR AC 失败；总体不得通过 |
| formal P0 prerequisite missing | 对应 AC `blocked`；完整验收不得通过或有条件通过 |
| runner/environment 意外故障 | `infrastructure_failed`；修复后新 run，不得算产品失败或通过 |
| measured P2 authority 缺失 | `not_run/blocked`；不得写数值 verdict/readiness |
| P1 selected combination 未纳入 release | 不参与 P0；作为 scope 注记，不需伪造 risk acceptance |
| P1 明确纳入但未执行 | 该 release 的 P1 条件未满足；是否影响下一阶段由 Step 13/14 的正式 scope/risk 实例裁决 |
| leak/cross-domain write/blind effect/static evidence/production fake | S/VETO 候选；不可风险接受 |

### 6.4 非功能门禁停审与跨项审计

| 审计项 | 结论 | 缺口 / 上限 |
|---|---|---|
| 8 项 P0 NFR 是否有来源、阈值/结构、TC、EV、report | 是 | 当前无执行 instance |
| 无来源 numeric threshold | 无 | `AR-HLD-Q-002` 保持 blocked |
| formal positive 是否被降级 | 否 | source/crypto/storage/receiver/audit/durable 仍 required P0 |
| local fake 是否冒 formal | 否 | 只证明 local mapping/fail-closed |
| 安全/泄漏是否可接受 | 否 | 直接 VETO 候选 |
| Query/telemetry 是否混淆 | 否 | optional sink 不干扰；Query durable write=0 |
| compatibility 是否自动迁移/复用 target | 否 | target-specific immutable assessment |
| evidence Step 10 是否被提前替代 | 否 | 本 Step 定 NFR requiredness，Step 10 固定 19 EV 与报告真实性 |
| P1/P2 是否污染 P0 | 否 | 独立 scope/run，不能关闭 blocker |

## 7. 回填草稿

正式 §9 应回填 §2 阈值层级、8 项 P0 NFR 表、P1/P2 边界和失败分流。必须明确：结构性 P0 可裁决但当前未执行；formal positive 仍 blocked；性能样本不形成无来源 SLA；`AR-HLD-Q-002` 关闭前不写 latency/throughput/capacity/RTO/RPO verdict；安全、owner write、blind replay、production fake 和 evidence forgery 不可风险接受。

## 8. 对上游影响与待确认事项

| 项 | 结论 |
|---|---|
| 00/03/04/05 回写 | 无；NFR、配置、专项和 EV 名称一致 |
| 新 blocker | 无 |
| 持续 blocker | 18 项全部保留；尤其 `AR-HLD-Q-002` 决定 measured P2 上限 |
| 待 Step 10 | 19 EV、raw/report/handoff 的真实性与完整性逐项裁决 |

## 9. 进入 Step 10 条件

- [x] P0 安全、可用、兼容、恢复、配置、观测和资源结构门禁可判定。
- [x] 每项有正式来源、exact TC、EV、report 与失败影响。
- [x] measured P2 无来源数字保持 blocked/not-run。
- [x] formal required lane、fake 证明上限和不可接受红线清楚。
- [x] 非功能停审与跨项审计无 unresolved 冲突。

当前 `gate_status`：`completed / structural_p0_closed_measured_p2_blocked`。

`next_allowed_action`：按连续授权创建并完成 Step 10。
