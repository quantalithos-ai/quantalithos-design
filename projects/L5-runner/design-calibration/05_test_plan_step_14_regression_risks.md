# Step 14. 定义回归策略与残余风险

> 对应 SOP：`standards/document/测试方案讨论流程_SOP.md` Step 14  
> 回填章节：`05-测试方案.md` §14  
> 粒度参考：`projects/L1-governance/design-calibration/05_test_plan_step_14_regression_risks.md`  
> 状态：`completed / pass / self_reviewed`

## 1. Step 状态与事实边界

| 项 | 当前值 |
|---|---|
| current_document | `05-测试方案.md` |
| current_step | Step 14 |
| current_module | `regression_risks:change_impact_full_gate_and_residual_register` |
| gate_status | `pass_for_step_15` |
| gate_reason | 需求/设计/协议/状态/UoW/config/adapter/redaction/evidence 变更均有最小回归集与全量触发；持续 blocker、未覆盖风险、不可接受项、接受角色和 06/07 承接均已明确；未执行回归或接受风险。 |
| formal_05_write_allowed | `false_until_step_15` |
| implementation_write_allowed | `false` |
| test_execution_allowed | `false` |
| commit_required | `false` |
| next_allowed_action | 创建并完成 Step 15，full-restart 装配正式 05 |

本 Step 只定义未来变更的回归与风险登记合同。`pass_for_step_15` 仅允许正式文档装配，不表示回归、风险接受、release 或验收已经发生。

## 2. 本步目标、输入与非目标

### 2.1 目标

1. 把变更类型映射到最小 TC family、suite/check 和责任角色；
2. 固定触发全量 P0 回归的红线变化与完整集合；
3. 规定上游 seam 首次闭合、实现技术确定和 evidence schema 变化时的重开/回归规则；
4. 汇总当前未覆盖风险、影响、缓解、触发条件和待确认接受角色；
5. 区分不可风险接受的 P0 红线与可登记但不计通过的 residual；
6. 明确哪些事项必须交给新版 06/07 收口。

### 2.2 输入基线

| 输入 | 用途 |
|---|---|
| Step 5/6 | 18 CUT、108 TC、FR/BR/AC/NFR 与正式断言。 |
| Step 9 | PR/main/nightly/controlled/release suite 和 check。 |
| Step 10 | 专项安全、一致性、恢复、依赖、观测、平台和性能边界。 |
| Step 11 | S/A/B/R、复验矩阵、不可接受项和防回归触发。 |
| Step 12 | 分层进入/退出、结果分类和 blocked/not-run 语义。 |
| Step 13 | planned slot、fixed-run artifact/report/evidence/review 归档。 |
| `03` §16～§17、`04` §12～§14 | 实施前置、下游承接、风险与回写触发。 |

### 2.3 非目标

- 不执行回归、不创建 run/artifact/report/evidence、不填写风险签署或 release verdict。
- 不把真实上游/产品环境 unavailable 当 P0 pass，也不要求不存在的环境执行。
- 不把探索性性能数据硬化为阈值；阈值变更必须回写 00/05/06。
- 不提前制定 07 phase、commit、实现文件或 boundary skeleton。
- 不允许 residual 覆盖 `latest`、truth writeback、Unknown replay、泄露、危险清理、私有实现、config/evidence 造假等 P0 红线。

## 3. SOP 问题回答

| 问题 | 收口回答 |
|---|---|
| 哪些变化触发最小回归？ | 局部 object/flow/port/query/consumer/job/config/presentation/report 变化至少触发原 TC、同 CUT family、主 suite 和相邻安全/check；见 §4。 |
| 哪些变化触发全量回归？ | 需求/AC/owner truth、public protocol/state/phase、UoW/idempotency/recovery、profile/readiness、SDK/dependency、redaction/forbidden fields、evidence schema/gate blocking、任一 S 修复或上游 positive seam 首次启用。 |
| 哪些风险暂不覆盖？ | 实现仓/语言/store、真实 Artifact/Governance/Sandbox/Runtime/Observability/Archive/平台/SDK positive、durable restart parity、product/cross-platform rehearsal、生产容量/SLO、retention 天数和 06 verdict。 |
| 谁接受 residual？ | 当前不做实际接受；分别登记上游 owner、架构、实施、测试、安全、运维、产品、验收角色待确认。P0 红线不可接受。 |
| 哪些风险必须转入 06？ | blocked positive 的裁决上限、是否强制 T2/T3、hard NFR 阈值、evidence 充分性、retention、risk acceptance、VETO/signoff/readiness 边界。 |
| 上游 seam 闭合怎么办？ | 不直接删除 blocker；先重读正式上游，回写 01/02/03/04/05 相关合同与 TC/data/environment/suite/slot，再执行 selected + 必要全量回归。 |

## 4. 变更类型到最小回归集

| 变更类型 | 最小 TC/CUT | Suite/check | 全量触发条件 | 责任角色 |
|---|---|---|---|---|
| requirements / FR / BR / AC / NFR | 受影响 family + traceability review | affected suites + evidence-link | owner/safety/phase/priority/AC 语义变化 | 产品/设计 + 测试 |
| context/selection/authority | CTX/CON/ENT | CONTRACT/DOMAIN/SERVICE/ENTRY/CONFIG | exact selector、scope/generation、authority posture 变化 | domain + upstream owner |
| material/integrity/cache | MAT/CFG/RES | DOMAIN/SERVICE/CONTROLLED/CONFIG | transfer/verify/qualify/cache binding 或保护规则变化 | application + Artifact/Governance |
| run/control/owner projection | REQ/CTL/OWN/REC | SERVICE/UOW/CONTROLLED/ENTRY/REPLAY | Accepted/Running、control outcome、owner source/readback 变化 | application + Sandbox/Runtime |
| resource/cleanup/recovery | RES/REC/UOW/JOB | DOMAIN/UOW/JOB/REPLAY/CONTROLLED | guard/lease/cleanup、Unknown/no-replay、RecoveryCase 变化 | domain/operations + Sandbox/platform |
| presentation/diagnosis/handoff | PRE/OBS/QRY | SECURITY/SERVICE/REPLAY | visibility/freshness/redaction/local≠evidence 变化 | presentation + Observability/Archive |
| Query/read model/projection | QRY/UOW/BND | SERVICE/ENTRY/UOW/SECURITY | no-write、section identity/generation 或 freshness 变化 | application/read model |
| public DTO/protocol/entry | CON/ENT/CNS/JOB | CONTRACT/ENTRY/CONSUMER/JOB | 11 Command/12 Query/4 Consumer/5 Job union、metadata/schema/disposition 变化 | contracts/entry |
| idempotency/UoW/store | IDM/UOW/REC/JOB | SERVICE/UOW/JOB/REPLAY | digest、reservation、atomicity、stored result、commit unknown、claim fence 变化 | infra/application |
| Consumer worker | CNS/BND/OBS | CONSUMER/CONTRACT/SECURITY | positive payload seam 首次授权、header/dedup/ACK 语义变化 | worker + upstream event owner |
| Operations Job | JOB/REC/UOW/OBS | JOB/UOW/REPLAY/SECURITY | claim/checkpoint/report、Blocked/Unknown、no-owner-repair 变化 | operations |
| config/profile/builder | CFG + affected family | CONFIG/CONTROLLED/SECURITY | schema/profile/source/core guarantee/readiness/fail-fast/rollback 变化 | config/infra |
| SDK/adapter/dependency | BND + affected owner family | SECURITY/CONTROLLED + dependency check | public seam/version/owner mapping/private boundary 变化 | architecture + SDK/upstream |
| observability/redaction | OBS/PRE/BND | SECURITY + redaction/report checks | forbidden corpus、safe field、metric label、scanner 范围变化 | security/observability |
| suite/gate/runner | representative affected TC | changed suite + pairing/link/no-static checks | blocking topology/result classification/change of required suite | test tooling/release |
| artifact/report/evidence schema | representative source TC + slots | pairing/link/no-static/redaction + source suites | item fields/digest/status/acceptance generation变化 | test tooling + 验收 |
| S 级缺陷修复 | original TC + same CUT + adjacent axes | affected suites/checks | 一律全量 P0 | defect owner + 测试 |

## 5. 全量 P0 回归触发与集合

### 5.1 强制触发

- 任一 `AC-RUN-001~011` 禁止条件、S 级缺陷或不可接受红线的修复/语义变化。
- owner/truth boundary、SDK-first、compile/runtime/event dependency direction 变化。
- 11 Command、12 Query、4 planned Consumer、0 outbound event、5 Job 的 inventory/schema/phase 变化。
- 任何正式状态 enum、合法/非法 transition、Accepted/Running、Complete/Verified/Qualified、Confirmed/Cleaned、Delivered/evidence 分离变化。
- UoW、idempotency digest、version/generation、commit unknown、claim/checkpoint、RecoveryCase/no-replay 变化。
- 四 profile、strict schema、builder/readiness、redaction/fail-fast/fail-closed/change/rollback 变化。
- Redaction/dependency/evidence-link/report-pairing/no-static-evidence 的范围或 blocking 分类变化。
- `RUN-UP-*` 某 positive seam 首次启用，或 `RUN-DDD-*` physical implementation/store 首次落定。

### 5.2 全量集合

- `S-RUN-CONTRACT`
- `S-RUN-DOMAIN`
- `S-RUN-SERVICE`
- `S-RUN-UOW`
- `S-RUN-CONTROLLED`
- `S-RUN-ENTRY`
- `S-RUN-CONSUMER`
- `S-RUN-JOB`
- `S-RUN-CONFIG`
- `S-RUN-SECURITY`
- `S-RUN-REPLAY`（source 可用；否则显式 blocked）
- 所有 redaction/dependency/evidence-link/report-pairing/no-static-evidence checks
- Step 13 fixed-run report/evidence generation 与 review-ready acceptance draft

`S-RUN-E2E` 只在 T2/T3 进入条件满足时加入；不可用时记录 blocked，不可替代或污染 T1 全量分母。

## 6. 最小回归选择与证据规则

| 规则 | 约束 |
|---|---|
| 原变更/失败 TC 必跑 | 不能以同 family 的另一个 happy case 替代。 |
| 同 CUT family 必跑 | 至少正向/blocked-positive、负向、边界/Unknown/并发代表。 |
| 相邻轴必跑 | 例如 material 变更带 qualification/resource；control 变更带 owner/recovery/cleanup；presentation 变更带 redaction/evidence boundary。 |
| 红线 check 必跑 | 影响 config、dependency、redaction、evidence 时必须运行相应 check。 |
| 上游合同首次闭合先回写 | 不允许在旧 TC/DTO 上直接跑 positive；先更新 truth source 与方案。 |
| 每次新 run | 显式新 run id，context 中记录 run intent/trigger/change refs；不覆盖旧 run。 |
| 固定归档 | 按 Step 13 产出实际 scope 的 artifact/report/index；无 pair 无 EV。 |
| blocked 保真 | selected/positive unavailable 不计 pass，也不从分母静默删除。 |

## 7. 残余风险登记

| 风险/blocker | 未覆盖原因 | 影响 | 缓解/触发条件 | 接受/确认角色 |
|---|---|---|---|---|
| `RUN-DDD-001` 实现仓不存在 | 无源码、runner、CI、manifest | T1～T4 均无真实执行证据 | 07 前确认仓；创建后按 full P0 开始 | 实施负责人 + 验收待确认 |
| `RUN-DDD-002` language/runtime/shell/packaging 未定 | 无 authority | 无物理 test target、命令、跨平台 package 证据 | authority 到达后回写 03/04/05/07 | 架构 + 实施 |
| `RUN-DDD-003` durable store/cache 未定 | 无 backend/locking/migration/corruption 合同 | crash/restart parity 和容量不可证明 | 语义 fake；方案闭合后 UOW/replay/full P0 | 架构/infra + 测试 |
| `RUN-UP-001` Artifact consumption seam | locator/manifest/digest/signature/revoke 合同不全 | 真实下载/验证 evidence blocked | fail-closed fake；合同到达回写 MAT/CFG/T2 | Artifact owner + 验收 |
| `RUN-UP-002` Governance authority seam | authority chain/scope/freshness/conflict 不全 | approved/baselined 正向不可证明 | blocked posture；合同到达 CTX/MAT 回归 | Governance owner + 验收 |
| `RUN-UP-003` Sandbox request/lease/cleanup | DTO/idempotency/lease/orphan/cleanup 未闭合 | 真实 request/control/cleanup evidence blocked | semantic adapter/no replay/guard；到达 selected+full | Sandbox owner + 验收 |
| `RUN-UP-004` Runtime safe read/recovery | Runner-facing status/result 未闭合 | Running/terminal/reconcile 正向不可证明 | safe unknown/manual review；到达 OWN/CTL/REC 回归 | Runtime owner + 验收 |
| `RUN-UP-005` Observability diagnosis/handoff | DTO/visibility/freshness/retention 未闭合 | positive diagnosis/handoff/formal audit blocked | redacted fake/local≠evidence；到达 PRE/OBS 回归 | Observability owner + 安全 |
| `RUN-UP-006` Archive seam | safe ref/restore cooperation 未闭合 | archive 浏览/恢复不进入核心证据 | peripheral blocked；合同到达 selected | Archive owner + 产品 |
| `RUN-UP-007` platform resource/port/cleanup | 统一 taxonomy/authority/workload 未定 | 跨平台 allocation/cleanup/容量不可证明 | semantic Unsupported/Unknown/Conflict；到达 PORT/E2E | 平台/Sandbox + 验收 |
| `RUN-UP-008` L0-sdk exact surface | client/version/error/redaction/trace 未核验 | compile/runtime/boundary evidence blocked | SDK-first candidate；闭合后 dependency/full P0 | SDK owner + 架构 |
| `RUN-OPS-001` telemetry/SLO/capacity | 无 workload/environment/threshold authority | 无生产性能/容量 verdict | exploratory measurements；hardening 时回写 00/05/06 | 产品/架构/运维/验收 |
| `RUN-OPS-002` real integration/GRC | 无正式环境/责任链 | T2/T3/T4 无 release evidence | controlled negative；环境到达 selected | 集成/治理/验收 |
| evidence retention/physical archive | 无天数/介质/owner authority | 长期可用性不可承诺 | Step 13 condition guard；06/09 收口 | 运维/归档 + 验收 |
| 新版 06/07 尚未完成 | 文档串行门禁 | 无 verdict/signoff/phase/implementation tasks | 05 完成后停审，等用户授权 | 用户/验收/实施 |

上述“接受/确认角色”是责任角色候选，不表示任何人已实际接受风险。

## 8. 不可风险接受项

| 项 | 强制处理 |
|---|---|
| `latest`/默认/可变 selector、scope/authority bypass | 修复；CTX/CON/ENT/CONFIG + 全量 P0。 |
| 未验证/未 qualified material 请求运行 | 修复；MAT/REQ/CFG/SECURITY + 全量 P0。 |
| Accepted/ACK/PID/port/toast 推导 Running/success | 修复；REQ/CTL/OWN/BND + 全量 P0。 |
| Query write、Consumer parse/ACK、Job owner repair、Runner outbound event | 修复；相关 entry/worker/job + boundary + 全量 P0。 |
| Unknown/commit unknown 自动 replay/resend/reclaim/resume | 修复；REC/IDM/UOW/JOB + 全量 P0。 |
| protection 未解除仍清理/删除/淘汰 | 修复；RES/REC/JOB + 全量 P0。 |
| raw secret/body/path/URL/PID/port/stack 或 upstream正文泄露 | 修复；PRE/OBS/SECURITY/redaction + 全量 P0。 |
| sibling private implementation、SDK bypass、direct DB/bus/topic | 修复；dependency boundary + 全量 P0。 |
| config silent fallback、fake profile contamination、half facade/readiness fabrication | 修复；CFG/CONTROLLED/SECURITY + 全量 P0。 |
| static EV、`latest` evidence、run mismatch、raw/report 缺对、伪 verdict/signoff | 修复；source suites + all evidence checks + 全量 P0。 |

## 9. 必须转入新版 06/07 的事项

| 事项 | 06 应收口 | 07 应承接 |
|---|---|---|
| AC/VETO 与 evidence 充分性 | required/forbidden evidence、blocked/failed 判定、不得替代项 | 对应 suite/check 实施任务（未来） |
| T2/T3 是否为某 release 强制 | 环境 unavailable 的验收上限和 selected-run 规则 | adapter/environment planned tasks |
| hard performance/capacity/SLO | workload、平台、窗口、阈值和责任人 | benchmark/measurement tasks（authority 后） |
| risk acceptance | 可接受范围、角色、期限、签署；P0/S 不可接受 | 风险跟踪和暂停条件 |
| evidence retention/review/signoff | 物理保留、归档 owner、审查/签署边界 | report/archive tooling tasks |
| implementation repo/technology/store | 未实施只能 blocked/not-run，不可设计替代执行 | implementation ledger/skeleton、phase boundaries（07 完成时才创建） |
| upstream seam closure | positive evidence 必须基于正式 contract | per-adapter boundary skeleton/planned blocker |

## 10. 回归停审与跨风险审计

| 审计项 | 结论 | 缺口/处理 |
|---|---|---|
| 所有 P0 变更面有最小回归 | 通过（设计层） | §4 覆盖 18 CUT/主要 suite/check。 |
| 全量触发和集合可判定 | 通过 | §5；blocked suite 不静默删除。 |
| 上游首次闭合是否先回写设计 | 通过 | §6 固定重开规则。 |
| Residual 是否有原因、影响、缓解和角色 | 通过 | §7；角色待确认不等实际接受。 |
| 是否存在可接受 P0 红线 | 无 | §8 全部强制修复/全量回归。 |
| 性能/retention 数字是否伪造 | 无 | authority pending。 |
| 回归证据是否承接 Step 13 | 通过 | 新 run、trigger/change refs、fixed-run pair。 |
| 06/07 是否有明确入口 | 通过 | §9；本 Step 不提前创建实现产物。 |

## 11. 结构化回填草稿

正式 §14 应收录：变更→最小回归矩阵、强制全量触发与 suite 集合、最小选择/证据规则、完整 residual register、不可接受红线及 06/07 承接。正文必须说明责任角色仍待确认，当前没有风险接受、回归 run 或 release verdict。

## 12. 待确认与持续 blocker

| 项 | 影响 | 当前处理 |
|---|---|---|
| residual 实际接受人/期限 | 影响 06 风险裁决 | 仅登记候选角色，未接受。 |
| T2/T3 强制性 | 影响 release gate 与退出 | 留新版 06；当前不阻断 T1 design，但不计 positive。 |
| NFR/retention 硬阈值 | 影响 future gate | authority 后重开 Step 10/12/13/14。 |
| implementation phase/commit | 影响 07 | 05 不定义；正式 07 完成时才创建 ledger/skeleton。 |

## 13. Step 14 进入下一步门禁

- [x] 局部变更最小回归和红线变更全量回归可判定。
- [x] 全量集合覆盖所有 P0 suite/check 与 Step 13 report/evidence generation。
- [x] 上游 seam/技术/store 首次闭合时先回写设计再回归。
- [x] Residual 具备原因、影响、缓解、触发和候选确认角色。
- [x] 不可风险接受项与可登记 residual 严格分离。
- [x] 新版 06/07 的承接事项明确。
- [ ] 回归执行、risk acceptance、run、artifact、report、evidence、verdict、signoff、readiness：未发生，不作为本 Step 条件。

Step 14 完成，允许进入 Step 15 full-restart 装配正式 `05-测试方案.md`。
