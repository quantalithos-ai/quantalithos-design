# Step 10. 定义可观测性、审计与证据门禁

> 对应 SOP：`standards/document/验收标准讨论流程_SOP.md` Step 10\
> 正式回填：`06-验收标准.md` §10\
> 日期：2026-09-14\
> 状态：`completed / nineteen_ev_and_report_chain_closed_no_instances / continue_authorized`

## 1. Step 状态与 Step 内计划

| 项 | 结论 |
|---|---|
| 当前 Step | Step 10：定义可观测性、审计与证据门禁 |
| 目标 | 把 19 个 planned EV family、same-run raw/report、观测/审计边界、acceptance handoff 与具名 review 固定为可判定 P0 门禁 |
| gate_status | `completed / nineteen_ev_and_report_chain_closed_no_instances` |
| gate_reason | 19/19 EV 均已映射 exact TC 范围、suite raw、固定 report、AC/VETO candidate 和缺失影响；raw→suite→EV→report→acceptance 单向链、七类 run report、四类 acceptance report、review 与真实性规则闭合；当前实例仍为 0 |
| next_allowed_action | 按连续授权创建并完成 Step 11；本 Step 不创建 run、artifact、report、EV、review 或裁决实例 |
| source_files | 正式 03 §10～15；04 §8～12；05 §9～14；05 Step 13；06 Step 5～9；验收 SOP/规范；L1-governance Step 10 粒度样本 |

| 小阶段 | 产物 | 状态 | 完成门禁 |
|---|---|---|---|
| 10A | 行为观测与审计边界 | done | native record、runtime signal、formal material、test evidence 不混同 |
| 10B | 十九 EV 逐项追溯 | done | TC、suite raw、report、AC/VETO、缺失影响完整 |
| 10C | report 与 acceptance handoff | done | 路径、输入、review、失败影响固定 |
| 10D | 证据真实性与多 run 规则 | done | 禁止 `latest`、静态造证据、跨 run 补洞、无 digest raw |
| 10E | 逐证据停审与跨证据审计 | done | 设计规则无 orphan、冲突或越权；实例缺失保持显式 |

## 2. 本步输入与事实边界

| 输入 | 本 Step 承接 | 不得推导 |
|---|---|---|
| 正式 03 §10～15 | UoW/history/result/report/checkpoint、safe signal、审计字段和 redaction 边界 | 有日志即有业务 truth、owner audit chain 或验收证据 |
| 正式 04 §8～12 | secret/ref、装配、变更审计、失败与 observability binding | 配置 `Ready` 即 formal capability/readiness |
| 正式 05 §9～14 | 13 suites、5 gates、14 scripts、machine schema、fixed-run path、19 EV、review 与 residual | planned suite/script/path 即已实现或已运行 |
| Step 5～9 | 功能、红线、接口、状态/一致性和 NFR AC | AC 已通过、blocked formal lane 可删除 |
| `L4-observability` formal seam | owner-approved redacted audit/evidence material，当前受 `AR-UP-007` 阻塞 | Archive 拥有完整审计链、backend truth 或保留决定 |

本 Step 完成的是证据合同设计，不是证据生产。`artifacts/test/<run_id>`、`reports/runs/<run_id>`、`reports/acceptance` 和 `reports/review` 当前均没有由本文生成的实例；真实 `run_id`、source/design revision、config identity、digest、status、review、defect、verdict、signoff 和 readiness 数量仍为 0。

测试 artifact 的 `sha256` 只保护测试输出的内容配对；它不是 Archive Bundle manifest digest、签名、KMS/加密证明或 owner proof，不能关闭 `AR-UP-004`。

## 3. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 哪些行为必须有 audit record？ | accepted/rejected/blocked admission、source binding/capture attempt、manifest revision/finding、assessment、placement/retrieval/lifecycle intent 与 outcome、restore plan/material/handoff/outcome/compensation、consumer receipt、job claim/checkpoint/report、idempotency reservation/result、config validation/activation failure均须有 Archive-owned native record 或同 UoW relation；不得用 runtime log 补缺。 |
| 哪些行为必须有 trace/log/metric？ | C/Q/E/J entry、UoW、claim/fence、external effect、probe/reconcile、state rejection、config validation、redaction/dependency/report checks 应有有限、低基数、安全 signal；optional sink 失败不得改变业务结果，Query 两姿态仍零写。 |
| 哪些 formal audit material 必须存在？ | 若 scope 包含 audit/evidence source，则须有 `L4-observability` owner-approved、带 coverage/redaction/provenance 的 material/ref；缺合同或材料时对应 required lane=`blocked`，runtime telemetry/summary 不得替代。 |
| 哪些测试报告必须归档？ | fixed run 的 summary、EV index、gate results、redaction、dependency、report audit、blocked lanes、suite/EV pages；送验时另需 handoff、VETO checklist、risk acceptance、open issues 与 review notes。 |
| 证据缺失是否导致不通过？ | required P0 raw、digest、suite/report pair、EV、redaction/dependency/report/blocked-lane check 缺失时不得通过或有条件通过；送验包/具名 review 缺失时送验不成立。 |
| 证据如何复查？ | 从 `reports/runs/<run_id>/evidence-index.md` 的 EV 条目回到同 run EV page、suite report，再按 path/digest 回到 `artifacts/test/<run_id>` 的 `evidence-index.json`、suite/case/specialist raw；任何逆向改写均失败。 |
| evidence index 是否覆盖全部 P0 EV？ | 必须恰好覆盖 19 个登记 family 的适用 instance，不得有未知/orphan/duplicate ID；每条展开 exact TC、AC/VETO、suite、artifact/report、digest、qualification、proof/limitation 和 review status。 |
| gate-results 是否覆盖全部 release gate？ | 必须列 PR/Main/Nightly/Formal-seam/Release 五类 gate 的适用 fixed run、required denominator、状态与 limitation；blocked/not_run/infra/failed 不得压成 passed。 |
| redaction-check 是否覆盖 artifact 和 report？ | 必须同时覆盖所有 selected raw roots、run reports、acceptance/review 输出；禁止保存 canary 原值，任一 forbidden body/secret/key/provider response/敏感 ref 泄漏即硬失败。 |
| handoff/veto/risk/open-issues 是否需要 review？ | 四者可由脚本生成初稿，但正式送验前必须由具名人或具名 Agent 在 `reports/review/*` 留 review identity、时间、输入 fixed run、结论与争议；review 不得改 raw 或代签最终 verdict。 |
| 每个 EV 是否能回指 TC、suite raw、report、AC/VETO？ | 能，见 §7.2；表中范围写法在真实 index 中必须展开为 exact ID 数组。 |
| 如何处理多个 run？ | 单个 EV instance 只属于一个 run。送验可显式列多个 immutable source run，但不得合并它们制造单个 passed EV、覆盖失败或拼补 case；所有 run 的 source/design/config/target 兼容性必须审查并逐项列明。 |
| 是否允许 `latest`、静态 JSON、手写 passed 或无 digest raw？ | 一律不允许；命中时 report/evidence gate 失败并进入 Step 11 VETO 审查。 |

## 4. Historical material 诊断与改动前后对比

| 历史口径 | 问题 | 当前处置 |
|---|---|---|
| API 返回、DB 行或日志即证据 | 无固定 run、TC、digest、proof level 或 report pair | 只接受 same-run raw→suite→EV→report 链 |
| 一个 archive success report | 压平 19 EV、formal blocker 和各状态轴 | 每个 EV 保持独立 status/qualification/limitation |
| `latest` 或人工选择“最好一次” | 无法复验并可隐藏失败 | run ID 显式、immutable，所有 source run 在 handoff 列全 |
| Markdown/空 JSON 先声明 passed | 静态造 evidence | index 只能从真实 raw、suite aggregate 和 digest 推导 |
| 日志/trace 证明 owner commit/完整审计链 | telemetry 非 canonical truth | native/formal/test evidence 分层，owner material 仍需正式 handoff |
| 测试 SHA-256 当 Bundle digest | 混淆测试文件完整性与产品完整性 | test hash 只验证 artifact pairing，Bundle digest 继续 blocked |

## 5. 证据裁决取舍

| 议题 | 采用方案 | 未采用方案 | 理由 |
|---|---|---|---|
| evidence index 来源 | 同 run verified raw + suite aggregate + digest | 从静态 TC/AC registry 生成 qualified item | 防止未执行即通过 |
| 多 run 聚合 | handoff 显式列 source run；每 EV 单 run | 跨 run 挑 case 拼一个 EV | 保持可复验与失败可见 |
| acceptance 初稿 | 只作审查入口，必须具名 review | script 输出自动 verdict/signoff | 职责分离 |
| failed/blocked raw | 保留并进入分母 | 删除后重跑覆盖、改成 skipped | 防止选择性证据 |
| telemetry | safe 辅助定位 | 替代 native truth/formal material/raw | 防跨真相源越权 |
| review | 可解释/质疑/确认送验范围，不改 raw | reviewer 手改 status/digest | 保持 evidence immutable |

## 6. 行为可观测性与审计门禁

| 验收项 ID | 证据主题 | 必须存在的证据 | 通过条件 | 失败条件 / 影响 |
|---|---|---|---|---|
| `AC-AR-EVID-001` | Archive native traceability | request/binding/attempt/manifest/finding/assessment/intent/outcome/receipt/result/checkpoint/report/compensation 的 store/history relation raw | 每个 accepted mutation 在正式 UoW 中有完整 basis、correlation、before/after category、result/report ref；失败/unknown 可追溯 | 缺 required native relation、用 log 补缺或记录 forbidden body；不得通过，断链进入 VETO |
| `AC-AR-EVID-002` | runtime signal 非干扰 | `EV-AR-OBSERVE-001`、`archive-security-observe.md`、telemetry on/off raw | signal 字段白名单、有限/低基数；sink fail 只 degraded/drop；业务结果和 Query zero-write 完全一致 | sink 改业务、metric/span 含敏感值、telemetry 生成 truth/evidence；不得通过，泄漏可 VETO |
| `AC-AR-EVID-003` | raw 完整性与 digest | context、case、suite、specialist、raw `evidence-index.json` 及每个声明 digest | schema/status/count/path/run/config 一致；JSON/log digest 可复核；失败输出也存在 | 无 digest、digest mismatch、缺 required case/suite、failure raw 被覆盖；送验不成立，伪造可 VETO |
| `AC-AR-EVID-004` | 19 EV index | `reports/runs/<run_id>/evidence-index.md` + 19 类适用 EV page | 无 orphan/duplicate；每项回指 exact TC、same-run raw/report/digest、AC/VETO、proof/limitation；formal 必须 `formal_seam` | 缺 EV/TC/AC、local 冒 formal、blocked 被 qualified；不得通过或条件通过 |
| `AC-AR-EVID-005` | gate/report pairing | `summary.md`,`gate-results.md`,suite pages 与 raw suite/gate refs | 五 gate、required suite/lane 分母和状态保真；report 只读 raw；链接/digest 同 run | report 手写补洞、状态压平、跨 run 偷换、`latest`；不得通过，造 passed 可 VETO |
| `AC-AR-EVID-006` | redaction | `redaction-check.md` 及 SECURITY raw | selected raw/report/acceptance/review roots 全扫描 clean；negative canary 安全失败且不落原值 | raw secret/body/key/provider response/selector/location/digest 泄漏；立即阻断且不可风险接受 |
| `AC-AR-EVID-007` | dependency/outbound | `dependency-boundary.md` 及 DEPENDENCY raw | actual graph 分类正确；无 sibling/SDK/provider compile；三 outbound candidate 无 runtime/config/store/report/evidence surface | compile/fake/outbound 偷渡、缺实际 graph；不得通过，适用 VETO |
| `AC-AR-EVID-008` | formal/blocked lanes | `blocked-lanes.md`、formal suite raw/report、owning closure refs | 每个 source/decision/capability/storage/receiver/audit target 独立；blocked/not_run 保留且 gate 非零；closure proof 来自 owner | skip/N/A/fake/一个 target proof 覆盖其他 target；完整验收不得通过或条件通过 |
| `AC-AR-EVID-009` | report authenticity | `report-audit.md` 及 REPORT raw | no-static/no-latest/link/pairing/digest/orphan/status denominator 检查全通过 | 静态 EV、无 raw report、缺 link、删除失败或手写 passed；立即阻断，伪造可 VETO |
| `AC-AR-EVID-010` | acceptance handoff 与 review | `reports/acceptance/{handoff,veto-checklist,risk-acceptance,open-issues}.md` + `reports/review/*` | fixed source run 全列明；范围/限制/缺陷/VETO/风险完整；每份有具名 review 且不改 raw | 未审查、默认 VETO passed、无接受人风险、把草稿当 verdict/signoff；不得送验/条件通过 |

`AC-AR-EVID-*` 全部为 P0。当前它们只有设计定义，没有真实状态；不得把本表的“通过条件”误写为已通过。

## 7. 十九个 planned EV 与 report 闭环

### 7.1 通用证据链与实例规则

```text
runner / gate writer
        |
        v
artifacts/test/<run_id>/ immutable raw
        |
        v
raw finalizer: schema + digest + same-run + redaction + denominator
        |
        v
evidence-index.json -> read-only report generators
        |
        v
reports/runs/<run_id>/{suite,EV,index,gate,checks}.md
        |
        v
reports/acceptance/* draft -> reports/review/* named review
        |
        v
formal 06 future verdict (never writes backward)
```

任何一条反向箭头、跨 run 隐式引用、`latest`、无 raw 的 EV、无 digest 的 raw、无 review 的 acceptance 初稿都使链路失败。一个 family 可以在不同 run 有不同 instance，但不得跨 run 拼成一个 instance；local `passed` 不得更名为 formal `passed`。

### 7.2 EV 逐项追溯表

下表中的 `001～NNN` 是文档压缩写法；真实 machine/human index 必须展开成 Step 6 中存在的 exact `TC-AR-*` 数组。raw suite 统一位于 `artifacts/test/<run_id>/suites/<suite>/`，可读报告统一位于 `reports/runs/<run_id>/suites/<suite>.md`，每项还必须有 `reports/runs/<run_id>/evidence/<EV-ID>.md`。

| Evidence ID | exact TC 范围 | suite raw / report | 主要验收项 / VETO candidate | 缺失、非 qualified 或 proof 不足的影响 |
|---|---|---|---|---|
| `EV-AR-CONTRACT-001` | CONTRACT-001～004 | `archive-contract-domain` | `AC-AR-SYNC-001`、Q/Consumer protocol、`AC-AR-NFR-004` | 协议 totality、unsupported-before-parse 与公开边界不可裁决 |
| `EV-AR-OBJECT-001` | OBJECT-001～006 | `archive-contract-domain` | `AC-AR-FUNC-001～009` 的对象不变量 | 26 objects 的 factory/rehydrate/immutable basis 不可裁决 |
| `EV-AR-STATE-001` | STATE-001～018 | `archive-contract-domain` | `AC-AR-STATE-001～018`；V2/V3 | 18 状态合法/非法边与不传播不可裁决 |
| `EV-AR-COMMAND-001` | COMMAND-001～006 | `archive-service-flow` | `AC-AR-CMD-001～003`、FUNC-001/005/007 | admission、stored result、lifecycle request 不可裁决；formal basis 不足保持 blocked |
| `EV-AR-QUERY-001` | QUERY-001～005 | `archive-service-flow` | `AC-AR-QUERY-001～005`,`AC-AR-TX-003`,`AC-AR-NFR-002` | snapshot/visibility/cursor/绝对 no-write 不可裁决；Query 写进入 VETO 审查 |
| `EV-AR-CONSUMER-001` | CONSUMER-001～005 | `archive-entry-worker` | `AC-AR-EVENT-001～005` | envelope/receipt/dedup/ACK 边界不可裁决；producer/Bus positive 不足保持 blocked |
| `EV-AR-JOB-001` | JOB-001～017 | `archive-entry-worker` | `AC-AR-JOB-001～017`、FUNC-002～005/007～009 | job target/claim/checkpoint/report/effect/restore 流不可裁决；formal positive 不足保持 blocked |
| `EV-AR-UOW-001` | UOW-001～004 | `archive-consistency-replay` | `AC-AR-TX-001/002/005`,`AC-AR-CONC-001`；V5 | atomicity/CAS/read-set/fence/local unknown 不可裁决；durable proof 不足保持 blocked |
| `EV-AR-IDEMP-001` | IDEMP-001～004 | `archive-consistency-replay` | `AC-AR-IDEM-001～002`；V5 | replay/conflict/result/partial resume 不可裁决；盲重做进入 VETO 审查 |
| `EV-AR-EFFECT-001` | EFFECT-001～004 | `archive-consistency-replay` + formal target 时 `archive-formal-seam` | `AC-AR-EFFECT-001`,`AC-AR-TX-004`；V3/V5 | intent/finality/unknown/reconcile 不可裁决；local proof 不替代 provider/receiver finality |
| `EV-AR-AUTHORITY-001` | AUTHORITY-001～005 | `archive-authority-restore-negative` + formal target 时 `archive-formal-seam` | `RL-AR-001～006`,`AC-AR-SYNC-002`；V1/V3/V4 | 8 source authority、Auxiliary/ref/material、zero owner write 不可裁决；owner positive 保持 blocked |
| `EV-AR-RESTORE-001` | RESTORE-001～005 | `archive-authority-restore-negative` + formal target 时 `archive-formal-seam` | `RL-AR-007`,FUNC-007～009,`AC-AR-CONC-001`；V1/V2/V3 | owner/item isolation、eligibility、receiver mapping/outcome/compensation 不可裁决 |
| `EV-AR-CONFIG-001` | CONFIG-001～004 | `archive-config-boundary` | `AC-AR-NFR-007`,`RL-AR-006/008/010`；V3/V4/V7 | 55-key、priority、assembly/fake isolation、pinning 不可裁决 |
| `EV-AR-SECURITY-001` | SECURITY-001～002 | `archive-security-observe` | `RL-AR-011`,`AC-AR-NFR-004`,`AC-AR-EVID-006`；V1/V3/V4/V6 | redaction/visibility 不可裁决；泄漏立即阻断 |
| `EV-AR-OBSERVE-001` | OBSERVE-001～002 | `archive-security-observe` + material target 时 `archive-formal-seam` | `RL-AR-005`,`AC-AR-NFR-002/008`,`AC-AR-EVID-001/002`；V5 | native/runtime/formal material 与 non-interference 不可裁决；handoff positive 保持 blocked |
| `EV-AR-DEPENDENCY-001` | DEPENDENCY-001～002 | `archive-dependency-boundary` | `RL-AR-009/010/012`,`AC-AR-SYNC-003/004`,`AC-AR-NFR-007`；V7/V8 | compile 分类、fake 与 outbound absence 不可裁决；失败进入 VETO 审查 |
| `EV-AR-NFR-001` | RESOURCE-001～002 | `archive-resource-bounds` | `AC-AR-NFR-001/003` | positive bound、L/L+1、partial/progress 和降级不可裁决；不产生数值 SLO 结论 |
| `EV-AR-REPORT-001` | REPORT-001～002 | `archive-report-audit` | `AC-AR-NFR-008`,`AC-AR-EVID-003～005/009`；V5 | report 完整性、pairing、same-run/no-static 不可裁决；证据链失效 |
| `EV-AR-VETO-001` | VETO-001～005 + 每项引用的 source TC | 相关 P0 suites + release gate；`gate-results.md`,`veto-checklist.md` | V1～V5 聚合；Step 11 正式编号后回填 | 任一 source TC/EV blocked/failed/not_run 或 checklist 无具名 review 时不得 qualified，也不能宣称 VETO 未命中 |

### 7.3 Report 完整性与 acceptance handoff 检查表

| 检查项 | 固定路径 | 通过条件 | 失败影响 |
|---|---|---|---|
| run 摘要 | `reports/runs/<run_id>/summary.md` | source/design/config/target、suite/gate 分母、状态、limitation 与 raw root 一致 | 该 run 不可作为送验输入 |
| EV 索引 | `reports/runs/<run_id>/evidence-index.md` | 19 registry 无 orphan/duplicate；每个适用 P0 EV 回指 raw digest、TC/AC/VETO/report | 缺项、静态项或 proof 混淆则不得通过 |
| 门禁结果 | `reports/runs/<run_id>/gate-results.md` | 五类 gate 与 required suite/lane 状态完整，非 passed 状态保真 | release evidence gate 失败 |
| 脱敏检查 | `reports/runs/<run_id>/redaction-check.md` | raw/report/acceptance/review 扫描 clean；canary 不落盘 | 命中 VETO，不可风险接受 |
| 依赖边界 | `reports/runs/<run_id>/dependency-boundary.md` | actual graph、Core 核验、sibling/SDK/provider compile 与 outbound absence可复查 | 失败进入 VETO，不得送验 |
| 报告审计 | `reports/runs/<run_id>/report-audit.md` | pairing、digest、link、no-static、no-latest、denominator 全通过 | evidence 不可信，不得裁决 |
| blocked lanes | `reports/runs/<run_id>/blocked-lanes.md` | required target 逐项列 prerequisite、owner、proof level、closure ref 与状态 | 漏项或降级使完整验收不成立 |
| 验收交接 | `reports/acceptance/handoff.md` | selected fixed run 清单、兼容性审查、范围/非范围/限制/缺陷与基线完整并具名 review | 送验不成立 |
| 否决清单 | `reports/acceptance/veto-checklist.md` | 每个 VETO 有正式来源、TC/EV/report/defect 和非默认结论并具名 review | 不得通过或条件通过 |
| 风险接受 | `reports/acceptance/risk-acceptance.md` | 只含可接受 residual，具名 owner/acceptor、basis、动作、期限/触发并具名 review | 不得有条件通过；不得容纳 VETO/S/P0 blocker |
| 开放问题 | `reports/acceptance/open-issues.md` | blocker/defect/dispute/owner/影响/重新进入条件完整并具名 review | 不得隐去为“无问题” |

### 7.4 多 run 与 review 合同

| 规则 | 必须满足 | 禁止 |
|---|---|---|
| 单 EV instance | 一个 `run_id`、一个 raw root、同 run suite/report/digest | 从 run A 取 passed case、run B 取 report 拼接 |
| selected run set | handoff 显式列每个 immutable run、用途、source/design/config/target identity 与兼容性结论 | `latest`、目录扫描自动选最佳 run、隐式 supplemental |
| 失败留存 | failed/blocked/infra/not_run run 和 limitation 不被后续 run覆盖 | 删除原 raw、只引用 fixed run、把旧失败改 passed |
| acceptance review | reviewer identity/role、reviewed_at、input run IDs、结论/争议/required action 可复查 | 匿名勾选、脚本自审、改 raw/digest/status、代签 verdict |
| report generator | 只读列明 raw，输出可重建 | 查询 runtime/owner DB 补值、手写 missing result |

## 8. 逐证据停审记录

此处“通过”仅表示门禁设计完成停审，不表示未来证据实例通过。

| Evidence / Report | 审查项 | 设计停审结论 | 缺口 / 证明上限 |
|---|---|---|---|
| CONTRACT/OBJECT/STATE | exact TC、raw、suite、AC 与 26/18 分母 | 通过 | 当前无实例 |
| COMMAND/QUERY/CONSUMER/JOB | 30/32 entry、no-write、receipt/claim/report | 通过 | formal producer/owner/provider positive blocked |
| UOW/IDEMP/EFFECT | atomicity、probe、replay、partial、finality | 通过 | durable/external finality blocked |
| AUTHORITY/RESTORE | 8 source、Auxiliary、material/ref、per-owner handoff | 通过 | owner/receiver positive blocked |
| CONFIG/SECURITY/OBSERVE | 55 keys、fake isolation、redaction、native/runtime/material | 通过 | production binding/material handoff blocked |
| DEPENDENCY/NFR | graph/outbound absence、bounds/progress/degradation | 通过 | SDK direction与数值 authority blocked |
| REPORT/VETO | pairing/no-static/no-latest、source TC 聚合 | 通过 | 当前无 raw/report/review；Step 11 待正式 VETO 编号 |
| run reports 七件套 | path/input/status/digest/失败影响 | 通过 | 文件实例为 0 |
| acceptance 四件套 + review | draft/review/不得代 verdict | 通过 | 文件、review、signoff 实例为 0 |

## 9. 跨证据裁决审计表

| 审计项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 19 EV registry totality | 19/19 均有 TC/suite/report/AC/VETO/缺失影响 | machine index 必须展开 exact TC |
| orphan/duplicate EV | 设计层无 | 未来 report-audit 拒绝未知、重复或缺 registry ID |
| raw↔suite↔EV↔report | 单向、same-run、digest 可复核 | 当前实例为 0 |
| 静态造 evidence/手写 passed | 已禁止 | 命中则 evidence gate 失败并进入 VETO |
| `latest`/跨 run 拼补 | 已禁止 | 多 run 只能显式列 set，不合成单 EV |
| failure/blocked denominator | 保留 | 不允许删除、skip、N/A、降 P1 或 fake 替代 |
| proof level | local/controlled/formal/measured 分离 | local passed 不关闭 formal blocker |
| test digest 与 Bundle digest | 已分离 | `AR-UP-004` 继续开放 |
| telemetry/native/formal/test truth | 四层不互相替代 | `AR-UP-007` positive 继续 blocked |
| acceptance 初稿与 review | 初稿必须具名 review，review 不改 raw/代签 | 当前 review 实例为 0 |
| AC/VETO refs | Step 5～10 AC 已落点；V1～V8 待 Step 11 正式编号 | Step 11 回填正式 VETO 关系 |
| 当前事实 | 0 run/artifact/report/EV/review/verdict/risk/signoff/readiness | 未伪造 |

## 10. 回填草稿

正式 §10 应回填：行为观测/审计分层、十项 `AC-AR-EVID-*`、19 EV 追溯、七类 run report、四类 acceptance report、具名 review 与多 run 规则。正文必须明确 fixed-run raw 是第一事实入口；所有 report/EV/acceptance 材料只读派生；禁止 `latest`、静态造证据、无 digest raw、跨 run 拼补、手写 passed、匿名 review；当前无任何真实实例。

## 11. 对上游影响与待确认事项

| 项 | 结论 |
|---|---|
| 03/04/05 回写 | 无；native/runtime/formal/test 分层、schema、path、EV 名称与 digest 规则一致 |
| 新 blocker | 无 |
| 持续 blocker | 12 upstream/architecture + 6 local 全部保留；尤其 `AR-UP-004/007` 不得被 test hash/telemetry 关闭 |
| 待 Step 11 | 将 V1～V8 候选正式化，回填 `EV-AR-VETO-001` 与 checklist 的 exact VETO refs |
| 待未来执行 | actual run、artifact/report/EV、具名 reviewer、retention/delete authority 和 evidence instances |

## 12. 进入 Step 11 条件

- [x] 关键 mutation、Query、effect、config 和检查行为的 native/runtime/formal/test 证据边界明确。
- [x] 19/19 planned EV 均有 exact TC 范围、suite raw、固定 report、AC/VETO 与缺失影响。
- [x] raw→suite→EV→report→acceptance 链、七类 run report、四类 acceptance report与具名 review 可判定。
- [x] 禁止 `latest`、静态 EV、跨 run 拼补、无 digest raw、手写 passed 和 review 改 raw。
- [x] 逐证据停审与跨证据审计无设计层 unresolved 冲突；真实实例缺失保持显式。
- [x] 未生成测试、证据、review、裁决、风险接受、签署或 readiness 事实。

当前 `gate_status`：`completed / nineteen_ev_and_report_chain_closed_no_instances`。

`next_allowed_action`：按连续授权创建并完成 Step 11。
