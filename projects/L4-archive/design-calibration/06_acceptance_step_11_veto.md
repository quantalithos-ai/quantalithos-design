# Step 11. 定义一票否决项

> 对应 SOP：`standards/document/验收标准讨论流程_SOP.md` Step 11\
> 正式回填：`06-验收标准.md` §11\
> 日期：2026-09-14\
> 状态：`completed / ten_exact_vetoes_closed_no_trigger_instances / continue_authorized`

## 1. Step 状态与 Step 内计划

| 项 | 结论 |
|---|---|
| 当前 Step | Step 11：定义一票否决项 |
| 目标 | 将正式需求五类否决源、Step 2 V1～V8、12 条架构红线、Query/证据硬不变量收口为 exact VETO，并固定检查、证据、report 与裁决 |
| gate_status | `completed / ten_exact_vetoes_closed_no_trigger_instances` |
| gate_reason | 10 个 VETO 覆盖 owner/truth、状态传播、fail-open、authority elevation、Query、泄漏、依赖/fake、outbound、blind replay 与 evidence forgery；每项有正式来源、exact TC、EV/report、触发/未触发/不可裁决边界，且明确不可风险接受 |
| next_allowed_action | 按连续授权创建并完成 Step 12；当前不声明任何 VETO 已通过、未命中或命中 |
| source_files | 正式 00 §14.1；01 所有权/依赖红线；03 §7～14；04 §8～12；05 §2/5/6/11～14；06 Step 2/5～10；验收 SOP/规范；L1-governance Step 11 粒度样本 |

| 小阶段 | 产物 | 状态 | 完成门禁 |
|---|---|---|---|
| 11A | 否决源归并 | done | 五类原始源、V1～V8 与 12 RL 无遗漏 |
| 11B | 十项 exact VETO | done | source/check/evidence/report/trigger/action 完整 |
| 11C | source→VETO 覆盖矩阵 | done | 一个 source 可多重防御，但无语义重复裁决 |
| 11D | 逐 VETO 停审 | done | formal source、可执行检查、固定证据、不可接受均明确 |
| 11E | 跨 VETO 审计 | done | 未把 blocker 当命中，也未用“无发现”伪造未命中 |

## 2. VETO 语义与当前事实边界

VETO 是“观察到禁止行为后最终结论必须为不通过”的裁决，不是文档标签，也不是一般缺陷计数。三种情况必须区分：

| 情况 | VETO posture | 验收影响 |
|---|---|---|
| 检查以 qualified evidence 证明禁止行为未发生 | `not_triggered` | 仅满足该 VETO；不自动使任何 AC 或总体通过 |
| qualified evidence 证明禁止行为发生 | `triggered` | 总体必须“不通过”；登记 S 级缺陷，隔离/修复后新 fixed run 全量复验 |
| required TC/EV/raw/report/check 未运行、blocked、infra failed、缺失或不可信 | `undetermined` | 不得声称未命中；验收不得通过或有条件通过，但不能虚构违规已发生 |

持续 blocker 只说明 required formal positive 不可裁决。若缺 formal basis 时系统正确 `Blocked/Unknown` 且零 effect，则 VETO 未被“触发”，但相关 P0 AC 仍 blocked；若缺 basis 仍 seal/dispatch/Verified/Committed/MaterialReady/成功，才触发 fail-open VETO。当前没有真实 run、evidence、defect 或 checklist，因此 10 个 VETO 的实例 posture 均不存在，而不是预填 `not_triggered`。

## 3. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 哪些失败直接导致不通过？ | 跨域写/自行裁决、局部状态越级、缺正式 basis 仍成功/effect、Auxiliary/ref/summary/fake 冒真相、不可追溯盲重放、Query 写/effect/越权披露、敏感泄漏、依赖或 production fake 偷渡、未授权 outbound、证据伪造/篡改。 |
| 否决项来自哪里？ | 正式 00 §14.1 五类源，正式 01/03/04 的 ownership/dependency/query/security/evidence 不变量，Step 6 的 `RL-AR-001～012` 与 Step 10 evidence hard gates。 |
| 如何检查？ | 只以 exact TC、同 run qualified EV、suite/check report、actual graph/write/effect spies、redaction/report audit 和具名 VETO checklist review 检查。 |
| 是否允许风险接受？ | 不允许。任何 VETO triggered、S 缺陷或 VETO posture undetermined 均不能通过或有条件通过。 |
| 是否覆盖所有 P0 红线？ | 是；§7.2 将 12 条 `RL-AR-*`、Query 与 evidence integrity 全映射到 10 个 VETO。 |
| 每个 VETO 能否回指需求/架构/详细设计、证据和 report？ | 能；见 §7.1。report 只是可读入口，必须回指 same-run raw/digest。 |
| 是否逐项停审？ | 是；见 §7.3。停审只确认设计可执行，不填实例结论。 |
| 是否有 P0 红线未覆盖、重复、风险接受冲突或不可执行检查？ | 未发现设计层 unresolved 冲突；当前所有实际检查尚未执行，必须保持 `undetermined`/无实例。 |

## 4. Historical material 诊断与改动前后对比

| 历史/宽松口径 | 问题 | 当前处置 |
|---|---|---|
| “三红线”“安全与治理门禁” | 数量和来源不完整，未覆盖 Query、依赖、outbound、证据真实性 | 十项 exact VETO + 12 RL 覆盖矩阵 |
| 无日志/报告即否决命中 | 混淆证据缺失与观察到违规 | 缺证据=`undetermined`，仍阻止通过但不伪造 trigger |
| blocker 自动等于失败 | 未执行不能证明产品违反行为 | formal prerequisite blocked 与 fail-open violation 分离 |
| 管理者签字可豁免 | 破坏 P0 truth/security/evidence | VETO 不允许 waiver/risk acceptance |
| 默认 checklist 全绿 | 无 raw/EV 支撑 | 每项必须有 source TC/EV/report/defect 与具名 review |

## 5. 否决裁决取舍

| 议题 | 采用方案 | 未采用方案 | 理由 |
|---|---|---|---|
| 五类原始 VETO 是否原样保留 | 保留语义，并将 Query/security/dependency/outbound/evidence 拆成独立 exact VETO | 只保留五个宽泛条目 | 降低一项证据覆盖多种红线的歧义 |
| blocker posture | `undetermined/blocked`，不是 trigger | 自动填 triggered 或 not-triggered | 不伪造执行事实 |
| 相邻 VETO 是否可共享 EV | 可共享，但每项 checklist/trigger 独立 | 合并为单一“安全失败” | 保持责任与复验范围可定位 |
| negative case passed | 证明特定禁止行为被拒绝；formal positive 仍按其 AC 判断 | 证明整个功能或 formal seam 通过 | 防 fake/local 证据越级 |
| 修复后处理 | 新 run + 原 TC/同族/相邻/全量 P0；旧 trigger 证据保留 | 改旧 checklist/status | 可审计、可复验 |

## 6. VETO 共通检查合同

每个 VETO 的未来 checklist 条目至少必须包含：`veto_id`、正式 source refs、exact TC refs、EV instance refs、raw/report path 与 digest、proof level、fixed `run_id`、检查 status、trigger observation safe ref、defect ref（若触发）、reviewer identity/role/time、review conclusion。禁止默认值 `passed/not_triggered`。

状态聚合规则：任一 qualified source 证明违规即 `triggered`；否则任一 required source `failed/blocked/infrastructure_failed/not_run/unqualified/missing` 则 `undetermined`；只有全部 required source qualified 且无违规，才能 `not_triggered`。多 run 送验时每个 source run 单独评估；不得用一个 clean run 覆盖另一个 triggered 或缺失 run。

触发后统一动作：总体结论锁为“不通过”；建立 S 缺陷；停止受影响 release/effect；若涉及泄漏则隔离并按 owner 流程处置材料；若涉及不确定外部 effect 则禁止盲重放；修复后用新 fixed run 执行原 TC、同 family、相邻 suite/check 和全量 P0，旧 raw/report 不得删除或改写。

## 7. 结构化中间产物

### 7.1 十项一票否决表

统一 human 入口为 `reports/acceptance/veto-checklist.md`，其每项必须回指所列 `reports/runs/<run_id>` report 与 `artifacts/test/<run_id>` raw；缺 checklist 或具名 review 时 posture=`undetermined`。

| 否决项 ID | 禁止行为 / 触发条件 | 正式来源 | exact TC / EV | 固定 report / 检查方式 | 触发后裁决 |
|---|---|---|---|---|---|
| `VETO-AR-001` | Archive 直接写任一 L1/workspace/artifact/observability owner DB、业务状态/import 内部，或自行决定 project lifecycle、retention/hold/delete/risk/销毁 | 00 §14.1-1；`RL-AR-001/006/007`；03 ownership/restore | `TC-AR-VETO-001`,`TC-AR-AUTHORITY-005`,`TC-AR-RESTORE-004～005`; `EV-AR-VETO-001`,`EV-AR-AUTHORITY-001`,`EV-AR-RESTORE-001` | `archive-authority-restore-negative.md`,`archive-formal-seam.md`,`dependency-boundary.md`；store schema/call/effect spy | 立即不通过；S；停止相关 handoff/lifecycle；不可接受 |
| `VETO-AR-002` | `Accepted/Sealed/Verified/Committed/Retrievable/HandoffComplete/item Succeeded/Compensated` 或局部成功推导 archived/dissolved/restored、owner committed、全局完整/成功 | 00 §14.1-2；`RL-AR-007/008`；18-state non-propagation | `TC-AR-VETO-002`,`TC-AR-STATE-001～018`,`TC-AR-EFFECT-004`,`TC-AR-RESTORE-004`; `EV-AR-VETO-001`,`EV-AR-STATE-001`,`EV-AR-EFFECT-001`,`EV-AR-RESTORE-001` | `archive-contract-domain.md`,`archive-consistency-replay.md`,`archive-authority-restore-negative.md` | 立即不通过；S；修复聚合/映射并全量状态回归 |
| `VETO-AR-003` | 缺 authority/scope/version/fence/coverage/current decision/hold/integrity/compatibility/storage/receiver/schema/probe basis，仍 Bound/Captured/ClosureReady/Sealed/Verified/Committed/Retrievable/MaterialReady/dispatch/success | 00 §14.1-3；`RL-AR-002/006/008`；formal fail-closed | `TC-AR-VETO-003`,`TC-AR-AUTHORITY-001～004`,`TC-AR-EFFECT-001～004`,`TC-AR-RESTORE-001～003`,`TC-AR-CONFIG-003`; `EV-AR-VETO-001`,`EV-AR-AUTHORITY-001`,`EV-AR-EFFECT-001`,`EV-AR-RESTORE-001`,`EV-AR-CONFIG-001` | `archive-formal-seam.md`,`blocked-lanes.md`,`archive-consistency-replay.md`,`archive-config-boundary.md` | 立即不通过；S；禁止 effect；blocker 本身不等触发，false success 才触发 |
| `VETO-AR-004` | Workspace projection、Artifact ref、observability summary/telemetry、provider ACK/config、test fake/fixture 冒充 canonical truth、完整 material/audit chain、formal finality 或 readiness | 00 §14.1-4；`RL-AR-003/004/005/008/010` | `TC-AR-VETO-004`,`TC-AR-AUTHORITY-003～004`,`TC-AR-CONFIG-003`,`TC-AR-OBSERVE-002`; `EV-AR-VETO-001`,`EV-AR-AUTHORITY-001`,`EV-AR-CONFIG-001`,`EV-AR-OBSERVE-001` | authority/config/observe suite reports + `blocked-lanes.md`；classification/proof-level scan | 立即不通过；S；撤销假 qualified/finality/readiness，不能用真实 target 后补改旧事实 |
| `VETO-AR-005` | result/history/checkpoint/report/effect key/correlation 缺失仍 Complete，local/external unknown 被当成功/失败后盲重做、重派或补偿，旧 fence/late result 覆盖原历史 | 00 §14.1-5；`AC-AR-TX/IDEM/CONC/EFFECT-*` | `TC-AR-VETO-005`,`TC-AR-UOW-001～004`,`TC-AR-IDEMP-001～004`,`TC-AR-EFFECT-001～004`,`TC-AR-RESTORE-004～005`; UOW/IDEMP/EFFECT/RESTORE/VETO EV | `archive-consistency-replay.md`,`archive-formal-seam.md`,`report-audit.md`；exact key/input/probe 与 immutable history | 立即不通过；S；冻结盲 effect，先 reconcile；保留原 run/history |
| `VETO-AR-006` | 任一 Q01～Q05 开启 UoW、reserve/save/append/complete/claim，触发 capture/repair/retrieve/probe/compensate/external effect，或撤权后披露 hidden metadata/body/private cursor | 正式 03 Query no-write/visibility；`AC-AR-TX-003`,`AC-AR-NFR-002` | `TC-AR-QUERY-001～005`,`TC-AR-OBSERVE-001`,`TC-AR-SECURITY-002`,`TC-AR-CONTRACT-004`; QUERY/OBSERVE/SECURITY/CONTRACT EV | `archive-service-flow.md`,`archive-security-observe.md`；telemetry on/off write/effect spy 与 disclosure diff | 立即不通过；S；停止受影响 read surface；修复后五 Query 双姿态全量回归 |
| `VETO-AR-007` | API/error/log/metric/span/native/test raw/report/acceptance/review 泄漏 raw secret/token/key/credential/provider response、未获准 body、selector/location/digest 或可逆敏感 ref；hash 绕 denylist | `RL-AR-011`；04 sensitive/redaction；`AC-AR-NFR-004`,`AC-AR-EVID-006` | `TC-AR-SECURITY-001`,`TC-AR-CONTRACT-004`,`TC-AR-REPORT-002`; `EV-AR-SECURITY-001`,`EV-AR-CONTRACT-001`,`EV-AR-REPORT-001` | `redaction-check.md`,`archive-security-observe.md`,`report-audit.md`；全 root canary scan | 立即不通过；S；隔离输出并按 owning security/records 流程处置；不可接受 |
| `VETO-AR-008` | non-core sibling、L1、Bus、workspace、observability、SDK client 或 provider SDK 被写为 Archive compile dependency/共享 DB/Tx，或 production required slot fallback 到 fake | `RL-AR-009/010`；`AR-ARCH-001` 安全处置 | `TC-AR-DEPENDENCY-001`,`TC-AR-CONFIG-003`; `EV-AR-DEPENDENCY-001`,`EV-AR-CONFIG-001` | `dependency-boundary.md`,`archive-config-boundary.md`；actual graph/symbol/profile/marker scan | 立即不通过；S；移除逆向依赖/fake fallback 后重跑依赖、配置与全量 P0 |
| `VETO-AR-009` | `AR-HLD-Q-001` 未正式关闭时出现或宣称 outbox/topic/publisher/delivery state/config/evidence，或 response/receipt/report 自动产生 `ready/published/delivered` outbound | `RL-AR-012`；正式 03 outbound absence | `TC-AR-DEPENDENCY-002`; `EV-AR-DEPENDENCY-001` | `dependency-boundary.md`,`blocked-lanes.md`,`gate-results.md`；runtime/config/store/report/evidence surface scan | 立即不通过；S；移除未授权 surface；不能以候选名或 Bus ACK 辩护 |
| `VETO-AR-010` | 静态/空 JSON 或 Markdown 造 qualified EV/pass；无 raw/digest；`latest`；跨 run 拼 case；删除失败/blocked；report/reviewer 反写 status；默认 checklist 全绿 | Step 10 `AC-AR-EVID-003～010`；05 evidence authenticity | `TC-AR-REPORT-001～002`,`TC-AR-VETO-005` + 所有被引用 source TC；`EV-AR-REPORT-001`,`EV-AR-VETO-001` | `report-audit.md`,`evidence-index.md`,`gate-results.md`,`veto-checklist.md`；pairing/digest/no-static/no-latest/review audit | 立即不通过；S；整份送验证据失效，重新从真实 fixed-run raw 生成；不可接受 |

### 7.2 红线与 VETO 覆盖矩阵

| 正式红线 / 硬不变量 | 正式 VETO | 覆盖说明 |
|---|---|---|
| `RL-AR-001` Archive-owned truth | 001 | owner write/decision ownership |
| `RL-AR-002` 8-source authority | 003 | 缺/mismatch basis 仍 success |
| `RL-AR-003` Workspace Auxiliary | 004 | projection elevation |
| `RL-AR-004` Artifact material/ref | 004 | ref/summary 冒 material/canonical |
| `RL-AR-005` observability 分层 | 004、010 | telemetry 冒 truth/evidence；静态 evidence |
| `RL-AR-006` governance authority | 001、003 | 自行裁决或缺 current basis dispatch |
| `RL-AR-007` restore handoff only | 001、002、003 | direct write、假 restored、缺 receiver success |
| `RL-AR-008` provider/finality | 002、003、004、005 | phase propagation、ACK/fake、unknown replay |
| `RL-AR-009` dependency type | 008 | compile/DB/Tx 偷渡 |
| `RL-AR-010` fake isolation | 004、008 | fake 冒 formal或 production fallback |
| `RL-AR-011` zero leakage | 007 | 全 surface redaction |
| `RL-AR-012` outbound absence | 009 | candidate 未解锁仍 ready/published |
| Query committed snapshot/no-write/visibility | 006 | 读路径写/effect/披露 |
| Evidence authenticity | 010 | fixed-run raw/digest/pairing/review |
| 原始 V1～V5 | 001～005、010 | 五类语义完整，evidence forgery 从 V5 加严拆出 |
| Step 2 V6～V8 | 007～009 | leakage、dependency/fake、outbound |

### 7.3 一票否决项停审记录

此处“通过设计停审”不表示实际 `not_triggered`。

| VETO | 正式来源 | 检查可执行 | TC/EV/report 固定 | 风险接受禁止 | 停审结论 |
|---|---|---|---|---|---|
| 001 owner/truth write | 是 | 是 | 是 | 是 | 通过设计停审；实例不存在 |
| 002 state propagation | 是 | 是 | 是 | 是 | 通过设计停审；实例不存在 |
| 003 missing-basis success | 是 | 是 | 是 | 是 | 通过设计停审；blocker≠trigger |
| 004 authority elevation | 是 | 是 | 是 | 是 | 通过设计停审；proof level 不混同 |
| 005 blind/untraceable effect | 是 | 是 | 是 | 是 | 通过设计停审；unknown 保真 |
| 006 Query mutation/disclosure | 是 | 是 | 是 | 是 | 通过设计停审；双 telemetry 姿态 |
| 007 sensitive leakage | 是 | 是 | 是 | 是 | 通过设计停审；全 root scan |
| 008 compile/fake | 是 | 是 | 是 | 是 | 通过设计停审；actual graph/profile |
| 009 unauthorized outbound | 是 | 是 | 是 | 是 | 通过设计停审；absence 可检查 |
| 010 evidence forgery | 是 | 是 | 是 | 是 | 通过设计停审；raw first |

### 7.4 跨 VETO 覆盖审计表

| 审计项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 五类原始否决源 | 全覆盖 | 001～005；证据伪造由 010 加严 |
| 12 架构红线 | 12/12 有至少一个 VETO | 见 §7.2 |
| Query no-write/visibility | 独立 006 | 不再勉强并入跨域写 |
| security/evidence | 独立 007/010 | 泄漏与造证据均不可接受 |
| dependency/fake/outbound | 008/009 分开 | compile 与未授权事件可分别定位 |
| 语义重复 | 无冲突 | 同一观察可能触发多个 VETO，但每个来源/修复面独立，最终只聚合为不通过 |
| VETO 与 blocker | 已分离 | blocked 使姿态 undetermined；只有 observed forbidden result 才 triggered |
| VETO 与 risk acceptance | 无冲突 | 10 项全部不可接受；Step 13 只能处理非 VETO residual |
| VETO evidence | exact TC/EV/report/path 完整 | 当前真实 instance 和具名 review 均为 0 |
| 默认未命中 | 已禁止 | checklist 不得预填全绿 |

## 8. 回填草稿

正式 §11 应回填 10 项 `VETO-AR-001～010` 的禁止行为、来源、TC/EV/report 与触发后动作，并保留 `triggered/not_triggered/undetermined` 语义。任一 triggered 必须总体“不通过”且登记 S；任一 undetermined 也阻止通过/有条件通过，但不伪造违规。所有 VETO 不得被 risk acceptance、fake、ACK、日志、配置、人工签字或后续 clean run 覆盖。

## 9. 对上游影响与待确认事项

| 项 | 结论 |
|---|---|
| 00～05 回写 | 无；10 个 VETO 是既有五类源、12 RL、Query/证据硬约束的验收层拆分，不新增业务需求 |
| 新 blocker | 无 |
| 持续 blocker | 18 项全部保留；其存在使相关检查/AC blocked，不等于 VETO 已触发或已关闭 |
| Step 10 回填 | `EV-AR-VETO-001` 未来 `veto_refs` 应展开至 001～010，并同时保留 source TC/EV；当前无 evidence instance，不修改 05 planned schema |
| 待 Step 12/13/14 | S/复验/放行、不可接受 residual 与三值聚合继续收口 |

## 10. 进入 Step 12 条件

- [x] 10 个 VETO 均有正式来源、精确触发、exact TC/EV、fixed report 与处置。
- [x] 五类原始源、V1～V8、12 条 RL、Query 与 evidence integrity 均有覆盖。
- [x] 每项完成设计停审；未将停审写成实际未命中。
- [x] blocker、VETO triggered 和证据 undetermined 三种姿态已分离。
- [x] VETO 不可风险接受、不可默认全绿、不可由后续 clean run 覆盖旧事实。
- [x] 跨 VETO 审计无设计层 unresolved 冲突，未生成真实 trigger/defect/verdict。

当前 `gate_status`：`completed / ten_exact_vetoes_closed_no_trigger_instances`。

`next_allowed_action`：按连续授权创建并完成 Step 12。
