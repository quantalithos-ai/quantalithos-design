# Step 14. 定义回归策略与残余风险

> 对应 SOP：`standards/document/测试方案讨论流程_SOP.md` Step 14\
> 正式回填：`05-测试方案.md` §14 回归策略与残余风险\
> 日期：2026-09-13\
> 状态：`completed / pass_with_blocked_formal_lanes / continue_authorized_to_step_15`

## 1. Step 状态与 Step 内计划

| 项 | 结论 |
|---|---|
| 当前 Step | Step 14：定义回归策略与残余风险 |
| 目标 | 将设计、实现、配置、测试工具、证据结构和缺陷修复变化映射为最小/全量回归，并把未闭合风险交给正式 06/owning project。 |
| 输入基线 | Step 6 的 102 个 `TC-AR-*`、Step 9 的 13 suites/5 gates/14 planned scripts、Step 10 专项、Step 11 缺陷复验、Step 12 进出准则、Step 13 证据 schema/registry。 |
| gate_status | `completed / pass_with_blocked_formal_lanes` |
| gate_reason | 所有 P0 变更面都有最小回归入口；truth/protocol/state/UoW/idempotency/effect/config/redaction/dependency/evidence 与 S 级修复均有全量触发；正式接缝和量化基线仍按 blocker 保持 blocked。 |
| next_allowed_action | 创建并完成 Step 15，重建正式 `05-测试方案.md`；装配后立即停审，不进入 06。 |
| source_files | `05_test_plan_step_06_cases.md`、`05_test_plan_step_09_automation_gates.md`、`05_test_plan_step_10_nonfunctional.md`、`05_test_plan_step_11_defects_retest.md`、`05_test_plan_step_12_entry_exit.md`、`05_test_plan_step_13_evidence.md`、测试方案 SOP/书写规范 §5.14。 |

### 1.1 Step 内计划

| 计划项 | 产物 | 状态 | 完成门禁 |
|---|---|---|---|
| 读取输入与冻结分母 | 变更面/TC/suite 清单 | done | `6/26/8/7/30/32/18/8` 和 102 TC 不漂移 |
| SOP 问题回答 | §3 | done | 最小、全量、未覆盖、接受人、06 转入事项逐项回答 |
| historical 诊断 | §4 | done | 旧 05 的 14 个 case、固定 provider/期限/阈值不继承 |
| 变更触发表 | §8.1 | done | 每类 P0 变更均有最小回归和全量条件/责任角色 |
| 全量 P0 与最小集 | §8.2～8.3 | done | 相邻 suite、红线 check、证据归档规则闭合 |
| residual / redline / 06 handoff | §8.4～8.6 | done | residual 不隐藏；P0 红线不可接受；不发明 AC |
| 跨回归审计与回填 | §8.7～§11 | done | blocker/owner/证据边界清晰；允许 Step 15 |

## 2. 本步目标与事实边界

本步只设计“发生变更后应如何重新验证”。它不执行测试、不创建 suite/脚本、不填写缺陷实例、不产生 `run_id`、artifact、report、EV、验收 verdict、risk acceptance、signoff 或 readiness。`planned`、`blocked`、`not_run` 仍是设计状态，不是结果。

回归选择遵循三个不变量：

1. 影响 Archive 自有 truth、公开协议、状态轴、事务/幂等或外部 effect 的变化，不能只重跑一个局部 happy path。
2. 受 `AR-UP-*`、`AR-ARCH-*`、`AR-HLD-*` 或 `AR-03-LOCAL-*` 阻塞的正向 lane 仍是 P0 required；不得改成 P1、skip、waiver 或“已通过”。
3. 每个回归 run 必须沿 Step 13 的固定 run → raw artifact → report → evidence index 链留证；报告不能反写 raw，静态矩阵不能制造 EV。

## 3. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 哪些变更触发最小回归？ | 任一局部 contract/object/state/command/query/consumer/job/UoW/config/redaction/report 工具变更，至少跑受影响 TC family、相邻 suite 和对应红线 check；原失败 TC 必跑。详见 §8.1。 |
| 哪些变更触发全量回归？ | truth object、public protocol、state matrix、UoW/CAS/read-set、idempotency/result replay、external intent/effect/reconcile、restore owner boundary、P0 config/assembly、redaction/dependency/evidence schema、release gate 或任一 S 级修复。详见 §8.2。 |
| 哪些风险暂不覆盖？ | 真实 owner/provider 产品行为、durable restart/finality、具体存储/KMS/签名/压缩、production-like 容量/RTO/RPO、P1 兼容组合和高级产品体验；它们仍有 negative/local 入口或 residual，但不能计作 P0 正向通过。 |
| 谁接受残余风险？ | P0 红线不得接受。P1/P2/future residual 由未来 06 指定的验收负责人、架构负责人、运维/合规或产品 owner 按范围、证据、期限和再触发条件确认；当前只记录“角色待确认”，不作风险接受。 |
| 哪些风险必须转入新版 06？ | 正式 VETO/AC 引用与裁决、P1 selected-run 是否强制、性能/容量/RTO/RPO 阈值、证据保留期限、risk acceptance 角色、real-adapter certification 和 production-like gate。 |
| 回归如何承接 Step 13？ | 最小回归、全量回归、缺陷复验和 residual review 都使用固定 `<run_id>`；保留 context、case/suite report、redacted logs、evidence index、report/link/redaction/blocked-lane checks，禁止 `latest` 和跨 run 偷换。 |

## 4. Historical material 诊断

| 历史位置/口径 | 问题 | 当前处置 |
|---|---|---|
| 旧 `05-测试方案.md` §6 的 `TC-001`～`TC-014` | 对象、状态、协议和证据路径属于旧 snapshot/index/retention/review 模型，无法回指当前 26 对象和 30/32 surfaces。 | 废弃；回归只接受 Step 6 的 102 个 `TC-AR-*`。 |
| 旧 §11 的“每条主线重跑一次” | 没有变更影响图、相邻 suite、VETO 或 evidence pairing。 | 改为变更类型触发表；原 case + family + 相邻 suite + check。 |
| 旧 §9/§12 的固定 provider、cold tier、digest/签名成功、`<3s`、100% | 没有当前 workload、policy、算法、key、provider 或 measurement authority。 | 删除硬阈值和成功事实；保留结构性 bounds、typed unknown/fail-closed、future measured lane。 |
| 旧“hold/purge/restore 成功” | Archive 无治理决定权或 owner DB 写权，fake success 会隐藏 `AR-UP-003/009`。 | 只回归 decision guard、no-dispatch、per-owner handoff、partial/unknown/compensation。 |
| Step 13 以前的 `EV-CAND-AR-*` | 候选别名不包含固定 run、digest、raw/report pairing。 | 仅保留为 candidate alias；正式 planned registry 为 19 个 `EV-AR-*` family，实例当前为 0。 |

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 回归触发 | 只有“失败后重跑”描述 | 变更类型 → 最小 family/suite/check → 全量条件 → 责任角色 | 使 07 能按 boundary 排期，避免漏掉横切语义。 |
| 全量定义 | 未定义分母 | 固定 11 个 P0 主体 suite、release checks、Step 13 evidence/report audit | 保持 102 TC、VETO 和证据真实性同一门禁。 |
| residual | 分散在范围、NFR、entry/exit、blocker | 统一残余风险表并列 owner/缓解/转入 06 | 不能将未闭合风险静默删除。 |
| 缺陷复验 | 只跑原失败 case | 原 case + 同族正/负/边界 + 相邻 suite + 红线 checks；S 全量 | P0 语义通常跨模块、跨状态和证据层。 |
| 证据 | 文字说明或“latest”汇总 | 固定 run raw/report/evidence pairing；失败和 blocked 保留分母 | 防止静态造证据和跨 run 拼接。 |
| 性能 | 历史硬数字 | 结构性 L/L+1、进度、partial 为当前 P0；数值 lane `blocked/not_run` | `AR-HLD-Q-002` 未闭合。 |

## 6. 设计取舍

| 议题 | 采用方案 | 未采用方案 | 理由 |
|---|---|---|---|
| 回归粒度 | 风险分层最小集，红线变化全量 | 所有改动一律全量 | 保留执行效率，同时不放松 truth/effect/evidence 红线。 |
| 失败 case 处理 | 原 case + 同 family + 相邻 suite/check | 只重跑原 case | 防止同一错误在 query、job、report 或相邻状态面复发。 |
| formal seam blocker | 保持 P0 required + blocked | 降级为 P1 或 skip | 缺合同是退出阻断，不是风险重要性下降。 |
| P1/P2 residual | 记录 owner/触发/缓解，交 06 裁决 | 直接写“可接受” | 当前没有具名授权、期限和验收矩阵。 |
| 证据变更 | report audit + 受影响 suite sample；schema/聚合变化全量 | 只看 Markdown diff | 证据真实性本身是 P0。 |
| 性能回归 | 采集安全 duration/count/trend；无硬 pass | 私造 P95/SLO | 没有 workload、环境、窗口和阈值 authority。 |

## 7. 固定回归分母和状态语义

| 分母 | 固定值/集合 | 回归要求 |
|---|---|---|
| 技术模块 | `contracts/domain/application/infra/api/worker` 六 crates | 依赖/文件边界变化按受影响 crate 加相邻 suite；不新增测试模块分母。 |
| 业务对象 | 26（2 contracts + 24 domain） | object/state 变更至少跑 `archive-contract-domain`；对象来源或 owner 变化触发全量。 |
| services/ports | 8 services、7 port families | service/port 变更跑 `archive-service-flow`、相关 worker/replay；外部正向仍 formal blocked。 |
| protocol surfaces | 3C + 5Q + 5E + 17J = 30 logical / 32 method surfaces | 入口变更必须覆盖相应 family；E04/J12 placement/lifecycle 互斥路由不能合并。 |
| states | 18 个正式状态主语 | 任一状态边、terminal 或传播语义变化触发 state + service；VETO 变化全量。 |
| source classes | 8；workspace 始终 `Auxiliary` | source/owner/classification 变化跑 authority/dependency/restore；不得用 projection 代 canonical。 |
| config | 12 域、55 P0 keys | key/source/priority/assembly/failure 变化跑 config/dependency/security；任何 required-set 变化全量。 |
| cases | 102 个唯一 `TC-AR-*` | 原 case、同族和相关 suite 必跑；P0 不允许从分母删除。 |
| evidence | 19 planned `EV-AR-*` family，真实 instance 当前为 0 | evidence schema/status/pairing 变化跑 report audit；不把 planned 当执行结果。 |

执行状态仍严格区分 `passed`、`failed`、`blocked`、`infrastructure_failed`、`not_run`；回归策略不得把 blocked/not_run 从分母移除或改写为 passed。

## 8. 结构化中间产物

### 8.1 回归触发表

| 变更类型 | 最小回归集（至少） | 全量回归触发条件 | 责任角色 |
|---|---|---|---|
| 需求/规则/VETO 方向 | 受影响 TC family、`archive-report-audit`、`release-main-smoke`、traceability review | F/BR/NFR/VETO 语义、五类红线或退出条件变化 | 设计负责人 + 测试负责人 |
| 架构/所有权/依赖分类 | `archive-dependency-boundary`、受影响 suite、`archive-report-audit` | compile candidate、truth owner、runtime/event/ref/adapter 分类或禁止依赖变化 | 架构负责人 |
| public contract/DTO/ref/schema/version | `archive-contract-domain`、受影响 entry suite、redaction check | envelope/payload、typed ref、operation digest、schema version 或 error surface 变化 | contracts 负责人 |
| 26 对象/invariant/factory/rehydrate | `archive-contract-domain`、受影响 service family | truth object、immutable revision/history、factory 失败语义变化 | domain 负责人 |
| 18 状态/transition guard | `archive-contract-domain`、`archive-service-flow`、非法边代表集 | terminal/legal/illegal edge、跨轴传播或 VETO 语义变化 | domain 负责人 |
| Command flow / result / admission | 受影响 `TC-AR-COMMAND-*`、`archive-service-flow`、`archive-consistency-replay` | UoW 顺序、reservation/result/replay、owner effect 或 admission posture 变化 | application 负责人 |
| Query/view/visibility/cursor | 受影响 `TC-AR-QUERY-*`、`archive-service-flow`、write-audit/security | visibility、cursor mapping、stale/partial posture 或 strict no-write 变化 | application 负责人 |
| Consumer/envelope/dedup | 受影响 `TC-AR-CONSUMER-*`、`archive-entry-worker`、report audit | trust/schema/version、dedup/receipt、late/ACK semantics 或 E04 route 变化 | worker 负责人 |
| Job/claim/checkpoint/report | 受影响 `TC-AR-JOB-*`、`archive-entry-worker`、`archive-consistency-replay`、report audit | target/fence/partial/replay/no-truth-repair、J12 route 或 report schema 变化 | jobs 负责人 |
| UoW/store/CAS/read-set | `TC-AR-UOW-*`、`TC-AR-IDEMP-*`、`archive-consistency-replay`、infra fake parity | commit knowledge、rollback、range/negative read-set、result/claim durability 变化 | infra 负责人 |
| Idempotency/key/canonical input | `TC-AR-IDEMP-*`、受影响 command/consumer/job、replay suite | namespace/codec/digest binding、same/different conflict、missing result、partial resume 变化 | application + infra 负责人 |
| External effect/dispatch/reconcile | `TC-AR-EFFECT-*`、相关 job/restore、`archive-consistency-replay` | intent-before-effect、NotDispatched/MayHaveDispatched、probe/reconcile、ACK/commit 变化 | effect/worker 负责人 |
| Source/authority/material closure | `TC-AR-AUTHORITY-*`、`TC-AR-RESTORE-*`、authority-negative | owner/class/version/fence/coverage、workspace Auxiliary、artifact/body closure 变化 | source integration 负责人 |
| Restore plan/material/handoff | `TC-AR-RESTORE-*`、相关 J13～J17、authority-negative、replay | owner receiver mapping、per-item outcome、compensation、no-direct-write 变化 | restore 负责人 |
| Governance/lifecycle decision seam | `TC-AR-COMMAND-*`、J11/J12、authority-negative、effect | retention/legal hold/delete/risk decision lookup、recheck 或 effect target 变化 | governance seam 负责人 |
| Config key/source/profile/assembly | `TC-AR-CONFIG-*`、`archive-config-boundary`、dependency/security checks | 55-key requiredness、priority winner、required slot、profile/fake isolation、fail-fast 变化 | config 负责人 |
| Redaction/telemetry/visibility | `TC-AR-SECURITY-*`、`TC-AR-OBSERVE-*`、`archive-security-observe`、redaction check | denylist、safe ref、metric cardinality、native record或 sink non-interference 变化 | observability/security 负责人 |
| Evidence/report/index/schema | `TC-AR-REPORT-*`、`archive-report-audit`、no-static/link/pairing checks | raw schema、digest canonicalization、status aggregation、EV registry、acceptance handoff 变化 | test tooling 负责人 |
| Release gate/check classification | 受影响 suite + 全部 release checks | gate denominator、blocked-lane、VETO 或 release smoke 逻辑变化 | release/test 负责人 |
| S 级缺陷修复 | 原失败 TC、同族正/负/边界、相关 suite/check | 任一 S/VETO、truth boundary、redaction、dependency、evidence integrity 或 external effect 修复 | 缺陷 owner + 测试负责人 |

“最小回归集”不表示结果必定通过；如果所需正式前置不存在，适用 lane 仍记录 `blocked`，并保留 blocker 与证明上限。

### 8.2 全量 P0 回归集

全量 P0 回归至少包括以下 11 个 P0 主体 suite（不含 P1/P2）：

1. `archive-contract-domain`：contracts、26 objects、18 states。
2. `archive-service-flow`：3 Command、5 Query、Query no-write 和 service flow。
3. `archive-config-boundary`：12 域/55 keys、source priority、assembly/fail-fast。
4. `archive-dependency-boundary`：compile/runtime/event/ref/adapter/fake 分类及 outbound absence。
5. `archive-entry-worker`：5 Consumer、17 Job、claim/fence/checkpoint/report。
6. `archive-consistency-replay`：UoW、CAS/read-set、幂等、effect knowledge、partial/reconcile。
7. `archive-authority-restore-negative`：source-authority、restore isolation、VETO negative。
8. `archive-security-observe`：redaction、visibility、telemetry non-interference。
9. `archive-resource-bounds`：L/L+1、bounded work、progress/partial（不作数值 SLO）。
10. `archive-report-audit`：raw/report pairing、digest、no-static、blocked-lane/evidence registry。
11. `archive-formal-seam`：owner/provider/durable/integrity/storage/receiver 正向 conformance；前置缺失必须为 `blocked`，不能 skip/pass。

同时必须执行/审查：

- `release-main-smoke` 及 release config、redaction、dependency、report、blocked-lane checks；
- Step 13 的 context、case/suite report、evidence-index 生成和 pairing/redaction 审计；
- 五类 VETO（`TC-AR-VETO-001`～`005`）的精确实例及其引用的 source TC；
- 受影响的 102 TC 分母、18 state、55 key 和 19 planned EV family 是否仍可反查。

触发全量的具体条件：

- `03-详细设计.md` 的 truth object、protocol、flow、state、UoW、idempotency、external effect、restore 或 observability 正式口径变化；
- `04-配置设计.md` 的 P0 profile、required slot、source priority、fail-fast/degraded、redaction 或 budget 关系变化；
- `05` 的 TC registry、evidence schema/digest、report status aggregation、VETO mapping、entry/exit 或 regression semantics 变化；
- 任一 S 级缺陷、五类 VETO 命中、redaction leak、cross-domain write、blind retry、fake/formal 混淆或 static evidence 发现后的修复；
- release gate、report/evidence pairing、no-static、blocked-lane 或依赖图检查逻辑变化。

### 8.3 最小回归选择规则

| 规则 | 要求 |
|---|---|
| 原失败 TC 必跑 | 缺陷修复或受影响设计变更的原始 `TC-AR-*` 必须进入新 fixed run；失败 raw 不得覆盖。 |
| 同 family 必跑 | 同一 family 至少覆盖正向、负向、duplicate/no-write/partial 中受影响的代表项；不能只选 happy path。 |
| 相邻 suite 必跑 | contract/object/state→service；service→replay/report；consumer/job→entry-worker/replay/report；config/redaction/dependency→相应 boundary check。 |
| 横切红线必跑 | UoW、effect、authority、restore、redaction、dependency、evidence 变化必须补相应 VETO/check。 |
| Formal requiredness 不降级 | formal positive 缺前置时跑 negative/fail-closed lane，并记录 blocked；不得用 P1 selected-run 代替 P0。 |
| 变更身份固定 | 回归 run 固定 `source_revision`、`design_revision`、`config_identity_ref`；新配置不能重建旧 operation。 |
| 证据必须归档 | 每次回归均按 Step 13 写 raw artifact、suite report、report、evidence index；当前设计阶段不创建实例。 |
| 失败姿态保真 | `failed`、`infrastructure_failed`、`blocked`、`not_run` 各自保留；预期 dependency unavailable 只可使对应 negative assertion 通过。 |

### 8.4 残余风险表

| 风险 | 未覆盖原因 | 影响 | 缓解方式 | 接受人/状态 |
|---|---|---|---|---|
| 真实 owner/source export 和 version/fence/coverage 行为 | `AR-UP-001/006/008` 合同未闭合 | 不能证明完整跨域 capture/closure | P0 做 owner/class/mismatch/Auxiliary negative；合同闭合后 formal seam selected run | 验收/架构负责人待确认 |
| `L1-work` 生命周期与 restore handoff | `AR-UP-002` 未闭合 | 不能证明 archived/restored 或 owner 状态传播 | 只测 Archive local posture、无越级和 handoff boundary | owning project `L1-work`；待确认 |
| governance retention/legal hold/delete/risk authority | `AR-UP-003` 未闭合 | 不能证明保留期、hold 或删除授权正确 | 缺失/过期/冲突/hold 负向 zero-dispatch；正式 decision 后补 | governance owner 待确认 |
| digest/signature/KMS/compression/schema evolution | `AR-UP-004` 未闭合 | 不能证明 Verified、长期可读或密钥 finality | typed Unknown/Unsupported/IntegrityFailed；不把测试 hash 当 Bundle digest | integrity/security owner 待确认 |
| storage location/tier/commit/retrieval | `AR-UP-005` 未闭合 | 不能证明 durability、retrievable、RTO | ACK≠commit、exact probe/reconcile、unknown 保真 | storage owner 待确认 |
| artifact body/ref/lineage closure | `AR-UP-006` 未闭合 | 引用集合可能不是完整材料 | 只消费 owner-approved ref/material；缺口可见 | `L1-artifact` owner 待确认 |
| observability audit/evidence material handoff | `AR-UP-007` 未闭合 | runtime signal 不能证明完整审计链 | native record 与 external material 分层；positive blocked | `L4-observability` owner 待确认 |
| workspace archive/export contract | `AR-UP-008` 未闭合 | projection 不能成为 canonical source | workspace 仅 `Auxiliary`；缺 canonical 即 partial/blocked | `L1-workspace` owner 待确认 |
| restore receiver commit/probe/compensation | `AR-UP-009` 未闭合 | 不能证明 owner committed/restored | per-owner/item handoff、mapping drift、unknown/compensation negative | 各 owning domain 待确认 |
| SDK 依赖方向 | `AR-ARCH-001` 未闭合 | 全局 compile matrix 可能与 SDK 角色冲突 | Archive 不引入 SDK compile dependency；静态 reverse-edge check | 全局依赖标准 / `L0-sdk` owner 待确认 |
| outbound event/outbox/publisher | `AR-HLD-Q-001` 未闭合 | 不得声称 delivery 或 outbound EV | absence/config/surface negative；候选全部 blocked | 架构/Bus owner 待确认 |
| workload、capacity、P95、RTO/RPO | `AR-HLD-Q-002` 未闭合 | 不能进行数值 pass/fail 或 readiness | P0 只测 bounds/progress/partial；measured lane `blocked/not_run` | workload/验收负责人待确认 |
| operation codec/cursor mapping/durable store/config/telemetry binding | `AR-03-LOCAL-001～005` pending | local fake 与生产实现可能不等价 | contract/negative parity；生产 exit blocked | L4-archive implementation owner 待确认 |
| 真实实现和运行 | `AR-03-LOCAL-006` pending | 当前没有可执行实现/证据 | 只保留 planned boundary；0 run/artifact/report/EV | L4-archive implementation owner 待确认 |
| P1 provider/SDK/产品组合 | 未锁定产品和环境 | 兼容性与操作体验未知 | 条件具备后 selected run；不替代 P0 | 产品/架构负责人待确认 |
| evidence retention/delete operation | governance/运维 policy 未给出 | 不能声称长期审计保留满足要求 | 验收与缺陷复验前不可自动清除；期限交 06/运维 | records/运维负责人待确认 |

残余风险不是通过清单；在正式 06 固定角色和条件前，不得写入 `accepted`、`closed` 或 readiness。

### 8.5 不可风险接受的 P0 红线

以下任一命中必须阻断受影响 gate/release、修复并执行全量 P0；不得用 waiver、fake、人工签字、日志或静态表接受：

| 红线 | 最低回归要求 |
|---|---|
| Archive 直接写任一 owner DB、项目状态或 governance truth | `TC-AR-VETO-001`、authority/restore/dependency suites、完整 release checks。 |
| `Accepted`/`Sealed`/`Verified`/item `Succeeded` 推导 archived/dissolved/restored/global success | `TC-AR-VETO-002`、18-state 全量和 service/replay。 |
| 缺 source/decision/hold/integrity/storage/receiver/schema 仍 seal/complete/ready/effect | `TC-AR-VETO-003`、config/authority/effect/restore 全量。 |
| workspace projection、artifact ref、audit summary 或 fake 冒 canonical/material/formal | `TC-AR-VETO-004`、source/dependency/formal prerequisite checks。 |
| result/history/effect key 缺失仍重算、盲重派或把 unknown 当 committed | `TC-AR-VETO-005`、UoW/idempotency/effect/replay 全量。 |
| Query 触发写、repair、external effect 或泄漏 hidden metadata | 五 Query telemetry on/off、security-observe、write audit。 |
| raw secret/body/key/provider response/selector/location/digest 泄漏 | synthetic canary、redaction boundary 和 release redaction check；受影响材料隔离。 |
| SDK/provider sibling compile 或 ready outbound surface 偷渡 | dependency/outbound absence、架构复核和 release gate。 |
| static/cross-run/latest evidence 被标为 qualified/pass | report audit、no-static/link/pairing/blocked-lane 全量；不得送 06。 |
| P0 profile unavailable、cleanup failure 或 infrastructure failure 被标为 passed | config/entry/report checks；新隔离 run 前不得继续。 |

### 8.6 必须转入新版 `06-验收标准.md` 的事项

| 事项 | 为什么由 06 收口 | 05 当前处理 |
|---|---|---|
| 正式 VETO/AC ID、EV→AC/VETO 裁决矩阵 | 05 只定义测试和证据，不拥有验收裁决 | 保存 00 requirement/VETO refs；`acceptance_refs=[]`。 |
| P1 real-like selected-run 是否强制 | 取决于 release/产品风险 | 保留 residual，不降级 P0。 |
| 性能、容量、RTO/RPO 硬阈值 | 需要 workload、环境、窗口、测量 authority | 仅结构性 P0；数值 lane blocked/not_run。 |
| evidence retention period、介质和删除授权 | governance/records owner 决定 | 只要求送验/缺陷复验前保留，禁止私造天数。 |
| residual risk accepter 与条件接受 | 需具名角色、期限、basis evidence | 当前均为角色待确认，不写 acceptance。 |
| production-like/capacity/DR gate | 属于验收和运维 readiness | future gate，当前不执行。 |
| real upstream/downstream adapter certification | 产品/合同闭合后才可定义 | formal-seam required + blocked。 |

### 8.7 回归证据与报告规则

| 回归类型 | 必须产出的 planned 材料 | 禁止 |
|---|---|---|
| 最小回归 | 固定 run 的 `meta/context.json`、受影响 case/suite report、redacted logs、report、evidence index；标记 regression scope | 用静态 TC 清单替代 raw case；跨 run 偷换。 |
| 全量 P0 | 全部 P0 suite raw/report、release checks、VETO/blocked-lane/redaction/dependency/report audit、acceptance handoff draft | 把 blocked formal lane 删除、改成 passed 或 qualified。 |
| 缺陷复验 | failed run、修复 source/config identity、fixed run、原 TC/同族/追加 assertion、两次 report pairing | 覆盖失败 raw、只写“已修复”、人工改 raw status。 |
| residual review | `reports/acceptance/risk-acceptance.md` 初稿和 `reports/review/*` 备注（未来） | 05 或脚本自动签署风险。 |
| P1 selected-run unavailable | safe unavailable marker、blocker/ref、影响和重新进入条件 | 计入 P0 passed evidence。 |

所有证据实例必须引用一个固定 run；多 run 只在交接清单中显式列 source runs。test artifact hash 只保护测试输出，不是 Archive Bundle integrity/signature 或 owner proof。

### 8.8 回归停审记录

| 审查项 | 结论 | 依据/限制 |
|---|---|---|
| 所有 P0 变更面是否有最小回归集 | 通过 | §8.1 覆盖 contract、object、state、entry、job、effect、config、evidence 等面。 |
| 全量 P0 触发是否可判定 | 通过 | §8.2 固定 11 个 P0 suite、release checks 和 evidence audit。 |
| 原失败 case、同族、相邻 suite 是否保留 | 通过 | §8.3。 |
| P0 formal lane 是否被降级 | 否 | 缺前置只记 blocked；不从分母删除。 |
| P0 红线是否可风险接受 | 否 | §8.5 全部必须修复。 |
| residual 是否有 owner/缓解/转入事项 | 通过设计 | 具体姓名、期限和 acceptance 仍待 06/owner。 |
| 回归证据是否承接 Step 13 | 通过设计 | fixed-run pairing/schema 已固定；当前无实例。 |
| 是否产生真实测试事实 | 否 | 0 run、0 artifact、0 report、0 EV、0 verdict。 |

### 8.9 跨回归 / 残余风险审计

| 审计项 | 结论 | 修正/限制 |
|---|---|---|
| 是否存在未映射的 P0 变更面 | 无 | 变更触发表逐类覆盖；新增面必须回到本 Step。 |
| 是否把 P1/P2 unavailable 写成 P0 pass | 无 | residual/blocked/not_run 分离。 |
| 是否把性能 candidate 写成硬阈值 | 无 | 只保留 sample/trend 和 `AR-HLD-Q-002`。 |
| 是否有 residual 无接受角色 | 无（均有待确认角色） | 06 必须补具名角色和条件。 |
| 是否有可接受 P0 redline | 无 | §8.5 不可风险接受。 |
| 是否有 orphan TC/EV 或重复 evidence | 设计无 | 未来 generator 仍必须按 Step 13 exact ID/digest 检查。 |
| 是否能被 07 引用 | 是 | 变更类型、最小/全量套件、证据要求可直接转 boundary。 |
| 是否越权修改 03/04/上游 | 否 | 本 Step 只组合现有契约；跨仓问题保留 blocker。 |

## 9. 复杂度判断

采用一张变更触发表、一个固定全量 P0 集、一个最小选择规则、一个 residual 表和红线/06 handoff 表，足以覆盖 102 TC 与 19 EV family。继续为每个 TC 复制一整套回归规则会造成重复且增加漂移；具体 case 细节仍以 Step 6、证据 schema 仍以 Step 13 为准。

## 10. 回填草稿（正式 §14）

> 校准来源：
> - `design-calibration/05_test_plan_step_14_regression_risks.md`
>
> 延伸阅读：
> - 建议阅读本文件的“回归触发表”“全量 P0 回归集”“最小回归选择规则”“残余风险表”“不可风险接受的 P0 红线”和“必须转入新版 `06-验收标准.md` 的事项”小节，了解变更如何触发回归以及未闭合风险如何进入验收。

正式 §14 应收口为：局部变更执行风险分层最小回归；truth/protocol/state/UoW/idempotency/effect/restore/config/redaction/dependency/evidence 或 S 级修复执行全量 P0；每次回归按 Step 13 产出固定-run raw/report/evidence；五类 VETO、Query no-write、owner boundary、evidence authenticity、P0 profile fail-closed 等红线不可接受；P1/P2 与未闭合外部合同进入 residual，并由 06/owning project 收口。不得填写真实回归结果、缺陷状态或风险接受。

## 11. 对上游设计的影响、blocker 与进入下一步

| 项 | 结论 |
|---|---|
| 对 03/04 的直接回写 | 无；本步只为既有对象、协议、状态、UoW、配置和证据定义变更触发。 |
| 新 owning-project blocker | 无。 |
| 持续 blocker | `AR-UP-001～009`、`AR-ARCH-001`、`AR-HLD-Q-001～002` 全部保留；对应 positive lane 仍 P0 required + blocked。 |
| 本地 pending | `AR-03-LOCAL-001～006` 全部保留；不会由回归设计关闭。 |
| 进入 Step 15 | 允许；Step 15 只装配正式文档，不能新增测试范围或验收编号。 |
| Step 15 后状态 | `formal_05_status=formal / stop_review`；立即停审，等待用户明确授权 06。 |

## 12. Step 14 完成门禁

- [x] SOP 五个问题逐项回答。
- [x] historical material 已后置审计，旧编号/供应商/期限/阈值未继承。
- [x] 每个主要 P0 变更面均有最小回归集、责任角色和全量条件。
- [x] 全量 P0 集包含 11 个 P0 suite、release checks、VETO 与 Step 13 evidence audit。
- [x] 原失败 TC、同族、相邻 suite、redline checks 和固定-run 证据规则明确。
- [x] residual 有影响、缓解、owner/待确认和 06 转入项；P0 红线不可风险接受。
- [x] blocker/pending、0 run/artifact/report/EV 事实边界保持不变。
- [x] 允许创建并完成 Step 15；本 Step 完成后不再改变回归结论，除非用户审查提出修订。
