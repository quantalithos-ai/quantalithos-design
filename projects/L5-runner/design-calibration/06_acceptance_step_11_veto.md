# Step 11. 定义一票否决项

> 对应 SOP：`standards/document/验收标准讨论流程_SOP.md` Step 11  
> 回填章节：`06-验收标准.md` §11 一票否决项  
> 状态：`completed / pass / self_reviewed`

## 1. Step 状态与事实边界

| 项 | 当前值 |
|---|---|
| current_document | `06-验收标准.md` |
| current_step | Step 11 |
| current_module | `veto:12_nonwaivable_safety_truth_evidence_conditions` |
| gate_status | `pass_for_step_12` |
| veto_contract_count | 12 |
| actual_veto_checks | 0 |
| actual_veto_hits | `unknown / not_evaluated` |
| acceptance_lifecycle | `not_entered / blocked_by_missing_baseline` |
| actual_verdict | `none` |
| formal_06_write_allowed | `false_until_step_15` |
| next_allowed_action | 创建并完成 Step 12 |

本步固定“进入验收后，任一命中即总体 `不通过`”的非豁免条件。当前缺实现、baseline、fixed run 与证据，实际 VETO 尚未检查；这表示验收未进入，不表示已命中 VETO，也不产生实际 `不通过` verdict。

## 2. 输入、目标与适用语义

| 输入 | 用途 |
|---|---|
| 00 §9～§14 | FR/BR/AC 的禁止条件与 truth/security 边界 |
| 01 §7～§13、03 §7～§15、04 §9～§12 | dependency、状态、UoW、恢复、配置与观测红线 |
| 05 §11、§13～§14 | S 级候选、复验、证据真实性与不可风险接受项 |
| 06 Step 3～10 | baseline/entry、功能/红线/协议/状态/NFR/evidence 的可检查合同 |

VETO 只覆盖不可豁免的安全、truth ownership、危险副作用与证据真实性破坏。普通 target-tier required gate 失败同样会阻断 `通过`，但不一定是 VETO；上游能力缺失、required positive blocked 或当前没有 baseline，必须保真为 `blocked/not_entered`，不能人为升级成 VETO hit。

## 3. SOP 问题回答与裁决取舍

| 问题 | 收口答案 |
|---|---|
| 哪些失败直接导致不通过？ | §5 的 12 类 VETO 任一在真实 fixed run /交付检查中命中；包括 selector/authority/integrity 绕过、owner truth 越权、危险资源清理、Unknown 重放、敏感泄露、私有依赖、协议副作用越界、配置 fail-open、证据或 verdict 造假。 |
| 来源是什么？ | 每项回指正式 FR/BR/AC、`AR-RUN-*`、详细设计/配置红线和 05 TC/check；README/旧 06 不作为来源。 |
| 如何检查？ | 同一 fixed run 的相关 TC/EV、call/write/effect ledger、redaction/dependency/link/pairing check、gate results 与经审查 veto checklist；禁止口头确认或静态默认 pass。 |
| 是否允许风险接受？ | 一律不允许。风险表若包含 VETO，风险接受本身无效并构成裁决冲突。 |
| 是否覆盖所有 P0 红线？ | `AR-RUN-001~015` 均至少映射一项 VETO；非危险的 required positive 缺失仍由普通 P0 gate 阻断，不伪装成 VETO。 |
| check unavailable 怎么判？ | 对 redaction、dependency boundary、evidence authenticity 等 required safety check，进入验收后 unavailable 表示无法排除不可接受风险，视同该 VETO 未清除并总体不通过；当前未进入时仅为 entry blocker。 |

## 4. 统一 VETO 判定协议

1. VETO 状态只允许 `not_evaluated / clear / hit / disputed`；`disputed` 不等于 clear，最终仍不能通过。
2. `clear` 必须绑定 fixed `(run_id, source digests, check/report refs, review ref)`；不得静态默认、继承旧 run 或以设计审查代替。
3. 任一 `hit` 使总体 verdict 只能为 `不通过`；不得被缺陷降级、风险接受、角色签字、上游 ACK、local success 或多数门禁通过覆盖。
4. VETO 修复后必须产生新的 fixed run，保留失败 run，并按 Step 12 执行全量/影响面复验；不能修改旧 artifact/status/digest。
5. baseline 未建立、验收未进入、required positive slot blocked 本身不是 VETO hit；但伪造/篡改 baseline，或把 blocked/not-run 写成 pass，是 VETO。
6. `reports/acceptance/veto-checklist.md` 只是检查清单与审查载体，不是 VETO authority；它必须回指真实 check/evidence。

## 5. 一票否决项总表

共同报告入口：`reports/runs/<run_id>/gate-results.md`、`reports/runs/<run_id>/evidence-index.md`、`reports/acceptance/veto-checklist.md` 和 `reports/review/*`。表中实际状态均为 `not_evaluated`。

| VETO ID / 否决项 | 正式红线来源 | 命中条件 | 必需检查与证据 | 修复后最低复验 | 触发后裁决 |
|---|---|---|---|---|---|
| `VETO-RUN-001` 隐式选择或 authority 绕过 | AC 001/002；BR 001～005；AR 003/009/013 | 接受 `latest`/default/mutable selector；缺 actor/scope/context；authority 不可见/过期/撤销/冲突仍取得、下载或运行 | CTX/CON/ENT/CFG/BND TC；EV 001/010/013/016/018；gate/link check | 相关 family + CONTRACT/CONFIG/SECURITY + 全量 P0 | 总体 `不通过`；不可接受 |
| `VETO-RUN-002` 未验证或未 qualified material 放行 | AC 003/004；FR 003/004；AR 009/013 | transfer/Complete 当 Verified/Qualified；manifest/digest/signature/freshness/platform 不成立仍请求 Sandbox；修改 Release bytes/content | MAT/REQ/CFG/BND TC；EV 002/003/016/018；same-run artifact/digest refs | MAT/REQ/CFG/SECURITY + 全量 P0 | 总体 `不通过`；不可接受 |
| `VETO-RUN-003` owner truth 伪造或反写 | AC 005/006/011；AR 001/003/007/010/013/014 | Runner 写 Release/Governance/Runtime/Sandbox/Observability/Archive truth；由 cache/receipt/ACK/PID/port/toast/local log 推导 approved/running/terminal/cleaned/evidence | OWN/REQ/CTL/UOW/BND/OBS TC；EV 003～005/012/017/018；write/effect audit | affected state/UoW/owner families + 全量 P0 | 总体 `不通过`；不可接受 |
| `VETO-RUN-004` 私有实现或非正式接缝 | AC 011；AR 004；dependency direction | sibling private source/backend、Sandbox 私有实现、direct DB/bus/topic/shared transaction、SDK bypass 或未声明 direct HTTP 被编译/调用 | dependency boundary machine/human report；CON/ENT/CNS/BND EV 010/013/014/018 | CONTRACT/ENTRY/CONSUMER/SECURITY + dependency scan + 全量 P0 | 总体 `不通过`；不可接受 |
| `VETO-RUN-005` 协议角色危险副作用 | AR 005～008；03 Query/Consumer/Job/event contract | Query/read/render/reconnect 写入；Consumer parse/hash/store payload、推进 owner cursor 或 ACK；Job repair owner truth；Runner outbound event/outbox/publish 非零 | QRY/CNS/JOB/BND TC；EV 009/014/015/018；call/write/event audit | affected protocol family + SERVICE/UOW/CONSUMER/JOB + 全量 P0 | 总体 `不通过`；不可接受 |
| `VETO-RUN-006` 危险资源或清理行为 | AC 007/008；FR 007/009；AR 012/013 | 静默抢占/换端口；probe 推导 allocation/lease；guard/current lease/capture/handoff/retention/orphan 未确认仍 release/delete/evict；Confirmed 当 Cleaned | RES/CTL/JOB/BND TC；EV 004/006/015/018；resource/cleanup refs | RES/CTL/JOB/REC + controlled platform + 全量 P0 | 总体 `不通过`；不可接受 |
| `VETO-RUN-007` Unknown/歧义副作用自动重放 | AC 009；FR 010；AR 007/014；TX 规则 | disconnect/restart/expiry/commit-unknown 后自动 resend/replay/reclaim/resume/delete，或把 Unknown 压成 success/failure 绕过 RecoveryCase/readback/manual review | REC/IDM/UOW/JOB/BND TC；EV 007/011/012/015/018；effect/recovery refs | REC/IDM/UOW/JOB/REPLAY + 全量 P0 | 总体 `不通过`；不可接受 |
| `VETO-RUN-008` 敏感正文、secret 或私密状态泄露 | AC 010；AR 002/015；NFA 001/006 | artifact/log/report/preview/diagnosis/handoff/review 含 raw secret/token/credential/body、完整敏感 path/URL、PID/port/stack、Release/owner body 或 Sandbox private state；raw fallback | redaction JSON/report + PRE/OBS/BND EV 008/017/018；restricted source disposition | SECURITY/PRE/OBS/BND + 双面 redaction + 全量 P0 | 总体 `不通过`；不可接受 |
| `VETO-RUN-009` 配置 fail-open 或伪 readiness | AR 009/011；04 strict config/readiness | invalid config silent fallback；profile 污染；flag 绕 authority/integrity/state/redaction/Unknown/guard；capability 不足仍暴露 half facade；profile/configured 当 ready | CFG/CTX/MAT/BND TC；EV 001/002/016/018；config summary + redaction/dependency | CONFIG/CONTROLLED/SECURITY + affected family + 全量 P0 | 总体 `不通过`；不可接受 |
| `VETO-RUN-010` 状态轴合并与成功语义造假 | AC 003～010；AR 010/013 | `Complete=Verified=Qualified`、`Accepted=Running`、`Confirmed=Cleaned`、`Delivered=formal evidence`，或 blocked/not-run/partial/stale/restricted 被记录为 pass/current/full | MAT/REQ/CTL/OWN/PRE/QRY/BND EV；gate/evidence link review | affected state/projection families + 全量 P0 | 总体 `不通过`；不可接受 |
| `VETO-RUN-011` 证据、baseline 或报告真实性破坏 | AR 010/014；Step 3/10；05 evidence contract | 伪造/篡改 baseline、run_id/digest/artifact/report/EV；静态/手写 EV/pass；`latest`；跨 run 拼接；缺 raw/report pair；修改旧 run；隐藏 failed/blocked/not-run | context/source revisions、evidence index、link/pairing/no-static、review；EV 017/018 | source suites + 四项 checks + report generation/review + 全量 P0 | 总体 `不通过`；不可接受；涉嫌交付无效 |
| `VETO-RUN-012` 安全检查失效或 verdict/signoff 造假 | Step 10 RG 006～014；NFA 006；Step 14 boundary | 进入验收后 required redaction/dependency/link/pairing check failed/unavailable；VETO 未逐项清除；伪造/提前填写 verdict、risk acceptance、signoff/readiness，或用 local handoff 代替正式审查 | 四项 check reports、veto/risk/handoff/open-issues、review refs；source digests | 修复检查链 + 所有受影响 suites + 全量 P0 + 重新审查 | 总体 `不通过`；不可接受 |

## 6. `AR-RUN-*` 与 VETO 覆盖反查

| 架构红线 | VETO 覆盖 | 说明 |
|---|---|---|
| `AR-RUN-001~003` | 001/003/008/010 | truth owner、禁止正文、source attribution |
| `AR-RUN-004` | 004 | SDK/API/public adapter only |
| `AR-RUN-005~008` | 003/005 | Query、Consumer、Job、event-zero |
| `AR-RUN-009` | 001/002/009 | config 不绕安全门禁 |
| `AR-RUN-010` | 003/010/011/012 | evidence 不反写 truth 或造成功 |
| `AR-RUN-011` | 009/010/011 | P1/P2/blocked path 不污染 P0 |
| `AR-RUN-012` | 006 | probe 与 allocation/lease/cleanup 分离 |
| `AR-RUN-013` | 002/003/006/010 | 多轴状态不可快捷映射 |
| `AR-RUN-014` | 003/007/011 | generation/version/visibility 与 evidence immutability |
| `AR-RUN-015` | 008/010/012 | bounded/redacted handoff 与 formal audit 分离 |

## 7. 非 VETO 但仍阻断通过的情形

| 情形 | 正确状态 | 裁决 |
|---|---|---|
| 当前实现仓/baseline/fixed run 不存在 | `not_entered` | 无 actual VETO/verdict；不能进入验收 |
| baseline 要求的 upstream positive slot unavailable | `blocked` | required gate 不能通过；除非发生 fail-open/造假，否则不是 VETO hit |
| 普通 P0 assertion 失败但未触安全/truth/evidence 红线 | `failed` / A defect 候选 | 总体不能通过；按 Step 12 修复复验 |
| 无 authority 的性能 measurement 未执行 | residual/not_run | 不形成 hard fail/VETO；不得宣称性能通过 |
| P1 UX/范围外能力缺失且未被 baseline 升级 | B/R residual | 不降低 P0；若安全误导则升级对应 VETO |
| scanner/check 在验收进入前尚未实现 | entry blocker | 不能开始；不是已命中结论 |

## 8. VETO 逐项停审记录

| VETO | 正式来源 | 命中条件可判定 | evidence/report 固定 | 复验固定 | 禁止风险接受 | 设计停审 | Actual |
|---|---:|---:|---:|---:|---:|---:|---|
| `VETO-RUN-001` | pass | pass | pass | pass | pass | pass | `not_evaluated` |
| `VETO-RUN-002` | pass | pass | pass | pass | pass | pass | `not_evaluated` |
| `VETO-RUN-003` | pass | pass | pass | pass | pass | pass | `not_evaluated` |
| `VETO-RUN-004` | pass | pass | pass | pass | pass | pass | `not_evaluated` |
| `VETO-RUN-005` | pass | pass | pass | pass | pass | pass | `not_evaluated` |
| `VETO-RUN-006` | pass | pass | pass | pass | pass | pass | `not_evaluated` |
| `VETO-RUN-007` | pass | pass | pass | pass | pass | pass | `not_evaluated` |
| `VETO-RUN-008` | pass | pass | pass | pass | pass | pass | `not_evaluated` |
| `VETO-RUN-009` | pass | pass | pass | pass | pass | pass | `not_evaluated` |
| `VETO-RUN-010` | pass | pass | pass | pass | pass | pass | `not_evaluated` |
| `VETO-RUN-011` | pass | pass | pass | pass | pass | pass | `not_evaluated` |
| `VETO-RUN-012` | pass | pass | pass | pass | pass | pass | `not_evaluated` |

## 9. 跨 VETO 覆盖审计

| 审计项 | 结论 | 处理 |
|---|---|---|
| P0 truth/security/evidence 红线是否全覆盖 | pass | 15 个 `AR-RUN-*` 全部反查到 VETO |
| VETO 与普通 blocker 是否混淆 | pass | §7 明确 not_entered/blocked/普通 failed 的差异 |
| 是否允许风险接受覆盖 | pass | 12/12 均禁止；冲突风险记录无效 |
| 检查方式是否可执行 | pass_for_design | 绑定 TC/EV/check/report；当前因实现/baseline 缺失未执行 |
| VETO 是否可由 checklist 自封 clear | 否 | checklist 必须回指 fixed-run source/evidence/review |
| 是否存在重复且冲突裁决 | pass | 可多 VETO 同时命中；不重复计算通过率，任一命中结论相同 |
| 修复是否可能覆盖旧失败证据 | 否 | 新 run + predecessor/supersedes；旧 artifact immutable |
| 当前是否伪造 clear/hit | pass | 12/12 `not_evaluated`，actual hit 未知，无 verdict |

## 10. 回填草稿、blocker 与下一步

正式 §11 应保留统一判定协议、12 项 VETO、AR 反查、非 VETO 阻断区分和覆盖审计。不得将当前 blocker 写成 VETO hit，也不得预填 `clear`、`不通过`、修复结果或接受签字。

| blocker | 影响 | 当前处理 |
|---|---|---|
| `RUN-DDD-001~003` | 无法执行 TC/check 或验证修复 | actual VETO 均 `not_evaluated` |
| `RUN-UP-001~008` | positive seam 不可验证 | required positive blocked；只有越权 fallback/造假才命中 VETO |
| `RUN-OPS-001~002` | T3/T4/SLO/GRC 未闭合 | 不造 release verdict 或 hard threshold |
| `RUN-DOC-002~003` | 正式 06/07 未完成 | 串行继续；不提前关闭 |

- [x] 12 项 VETO 均有正式来源、可执行检查、fixed report 和复验要求。
- [x] 任一命中总体只允许 `不通过`，且不可风险接受。
- [x] 15 项架构红线全覆盖，无 P0 VETO 缺口。
- [x] missing baseline / blocked positive / 普通 gate failure 与 VETO hit 已分离。
- [x] actual VETO 仍全部 `not_evaluated`，未伪造清除或命中。
- [x] 允许进入 Step 12；正式 06 仍禁止写入。
