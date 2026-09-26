# Step 10. 定义可观测性、审计与证据门禁

> 对应 SOP：`standards/document/验收标准讨论流程_SOP.md` Step 10
> 回填位置：正式 `06-验收标准.md` §10

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | 10 / evidence_audit |
| Step 状态 | `completed / stop_review` |
| gate_status | `pass_with_upstream_blockers` |
| 验收范围 | P0 EV、raw artifact/report pairing、redaction/dependency/report audit、acceptance handoff |
| 下一步 | `Step 11 / blockers` |
| 正式 06 写入 | `blocked_until_step_15` |

## 2. 本步输入

| 输入 | 来源 | 状态 | 说明 |
|---|---|---|---|
| 观测与审计契约 | `03-详细设计.md` §14 | `available` | technical signal、durable local history、redaction |
| 证据计划与三层载体 | `05-测试方案.md` §13 | `planned` | EV 计划、artifact/report/handoff 边界 |
| 验收基线与进入条件 | Step 3/4 | `available` | 固定 `<run_id>`、raw/report/acceptance 根 |
| AC/VETO/风险门禁 | Step 5/9、后续 Step 11/13 | `available` | evidence 对裁决的影响 |

## 3. SOP 问题回答

| 问题 | 回答 | 依据 |
|---|---|---|
| 哪些行为必须有 audit/trace/diagnostic？ | accepted/rejected Command、Consumer、Job、UoW/lock、materialize、handoff/probe、config failure、redaction/dependency/report audit 必须有安全可回链的 local refs；Query 可有 best-effort signal 但不写 truth。 | 03 §14；05 §10/§13 |
| 哪些报告必须归档？ | 每个 blocking suite 的 raw `report.json`、case refs、digest；`reports/runs/<run_id>/` 的 summary、gate-results、evidence-index、suite reports、redaction-check、dependency-boundary、report-audit；`reports/acceptance/` 的 handoff/veto/risk 文件。 | Step 3/4；05 §13 |
| 证据缺失是否不通过？ | P0 EV 缺 raw artifact/report pair、缺 `tc_refs`、缺 digest、使用 latest、静态宣称 passed、redaction/dependency/report audit 失败，均不可通过；缺 acceptance handoff 则不可裁决。 | 06 书写规范 §4.4；真相源闭环 §7 |
| 证据如何复查？ | 先读取 `reports/runs/<run_id>/...`，再回指 `artifacts/test/<run_id>/...`；固定 acceptance 入口只作交接/审查，不替代 raw artifact。 | 06 SOP Step 10；05 §13 |
| acceptance 报告是否等 verdict？ | 否。handoff/veto/risk 是审查入口和支撑材料，不等于 verdict、signoff、accepted 或 readiness。 | 05 §13.2；00/03 boundary |

## 4. 当前文档问题诊断

| 问题 | 影响 | 处理 |
|---|---|---|
| evidence index 可手写 | 可能产生孤儿 EV 或伪造覆盖 | 必须从真实 suite artifact/report 关系生成并审计 |
| 只有 report 无 raw artifact | 无法复验 failure/digest/status | blocking suite 必须 raw/report pair |
| 把 telemetry/job report 当证据 | 观测不等于业务或验收事实 | 明确 proof ceiling |
| 使用 latest/project 路径 | 基线漂移、跨项目污染 | 固定 run-scoped roots |
| redaction 只扫 fixture | report/artifact 可能泄露 | redaction-check 覆盖全部载体和输出面 |
| VETO checklist 默认 passed | 绕过一票否决 | 每项必须由 EV/report/defect 支撑，默认未结论 |

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 理由 |
|---|---|---|---|
| EV | 计划 ID 与结果混用 | 计划标识、raw artifact、run report、审查状态分层 | 不伪造证据 |
| report | 泛化测试报告 | 固定 `reports/runs/<run_id>/` 多类报告 | 可复查 |
| handoff | 上传/报告即接受 | handoff/veto/risk 只作交接审查入口 | 保持 verdict 边界 |
| audit | 口头/静态表 | evidence index、redaction、dependency、report audit | 防证据伪造 |

## 6. 验收裁决取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 手写 EV 索引和 VETO 表 | 快 | 无法证明真实来源 | 拒绝 |
| 只保留 raw artifact | 机器可复核但不便审查 | 缺少人类摘要和交接上下文 | 拒绝 |
| raw artifact → run report → acceptance handoff 三层闭环，加 redaction/dependency/report audit | 既可复核又可裁决 | 需要未来 generator/runner | 采用 |

## 7. 结构化中间产物

### 7.1 P0 evidence 追溯表

| Evidence ID | 证据主题 | 必须回指的正式 TC | 对应 AC/VETO | raw artifact 根 | run report / 审查入口 | 当前状态 |
|---|---|---|---|---|---|---|
| `EV-SYNC-TRACE-001` | selection/access、binding、metadata/provenance | `TC-SYNC-MOD-001/002`、`TC-SYNC-PROTO-001/002/005`、`TC-SYNC-CMD-001~003` | AC-001/002/007/010/013/014；VETO-003/004/005 | `artifacts/test/<run_id>/` | `reports/runs/<run_id>/evidence-index.md` | planned |
| `EV-SYNC-FLOW-001` | clone/pull/status/conflict/recovery | `TC-SYNC-MOD-003/004`、`TC-SYNC-CMD-001/004~008`、`TC-SYNC-QRY-004~006`、`TC-SYNC-STATE-008~014` | AC-003/004/008/011/016/019；VETO-001/005 | same | `reports/runs/<run_id>/evidence-index.md` | planned |
| `EV-SYNC-HANDOFF-001` | candidate/attempt/transport/probe/Decision layer | `TC-SYNC-MOD-005`、`TC-SYNC-CMD-009/010`、`TC-SYNC-PROTO-003`、`TC-SYNC-STATE-014~016` | AC-005/009/019；VETO-001/002/003/005 | same | `reports/runs/<run_id>/evidence-index.md` | planned |
| `EV-SYNC-QRY-001` | 13 Query zero-write/read completeness | `TC-SYNC-QRY-001`、`TC-SYNC-QRY-004~006`、`TC-SYNC-PROTO-005/006` | AC-003/006/008/020；VETO-001/003/005 | same | `reports/runs/<run_id>/evidence-index.md` | planned |
| `EV-SYNC-OPS-001` | 3 Consumer/3 Job receipt/report/no repair | `TC-SYNC-MOD-009/011`、`TC-SYNC-PROTO-004/005`、`TC-SYNC-IDEMP-001` | AC-006/016/018/020；VETO-002/003/004 | same | `reports/runs/<run_id>/evidence-index.md` | planned |
| `EV-SYNC-CONFIG-001` | 42 leaf、4 profile、strict source/activation/failure | `TC-SYNC-MOD-009`、`TC-SYNC-PROTO-001/004/005` | AC-017/020；VETO-004/005 | same | `reports/runs/<run_id>/evidence-index.md` | planned |
| `EV-SYNC-REDACT-001` | no secret/body/path/provider/Git output | `TC-SYNC-PROTO-004`、`TC-SYNC-REDACT-001` | AC-014/017/020；VETO-004 | same | `reports/runs/<run_id>/evidence-index.md` + `redaction-check.md` | planned |
| `EV-SYNC-CONSISTENCY-001` | version/UoW/idempotency/commit unknown/recovery | `TC-SYNC-CONSISTENCY-001`、`TC-SYNC-IDEMP-001`、`TC-SYNC-STATE-001~017` | AC-004/008/019；VETO-001/005 | same | `reports/runs/<run_id>/evidence-index.md` | planned |
| `EV-SYNC-ARCH-001` | dependency/outbound event/remote truth absence | `TC-SYNC-ARCH-001` | AC-010/012/013/017；VETO-002/003 | same | `reports/runs/<run_id>/evidence-index.md` + `dependency-boundary.md` | planned |
| `EV-SYNC-BLOCKER-001` | blocker status and exact impact | 仅作 blocker metadata；不得替代 P0 TC | handoff/risk/open-issues context | same | `reports/acceptance/handoff.md` | planned metadata; not proof |

`EV-SYNC-*` 仍为计划标识；上表的 `tc_refs` 必须在未来真实 evidence index 中指向已生成的正式 `TC-SYNC-*`，不能以“all P0”或手写自然语言代替。

### 7.2 Report 完整性检查表

| 检查项 | 固定路径 | 通过条件 | 缺失/失败影响 |
|---|---|---|---|
| raw suite artifact | `artifacts/test/<run_id>/...` | 每个 blocking suite 有 report.json、case refs、status、failure reason、profile/config ref、digest | 不可裁决；不得手写补洞 |
| evidence index | `reports/runs/<run_id>/evidence-index.md` | P0 EV 与 TC、suite、artifact、report、digest、AC/VETO、review status 一一可回链 | orphan EV/缺 tc_refs/缺 digest 不通过 |
| gate results | `reports/runs/<run_id>/gate-results.md` | 每个 blocking gate 有真实来源和 disposition，未把 blocked/unknown 压成 pass | 不通过 |
| summary/suite reports | `reports/runs/<run_id>/...` | 从 raw artifact 生成，失败/partial/unknown 原样保留 | 不通过或暂停 |
| redaction check | `reports/runs/<run_id>/redaction-check.md` | artifact、report、acceptance 载体均无 forbidden value | 一票否决候选 |
| dependency boundary | `reports/runs/<run_id>/dependency-boundary.md` | 证明只允许的 compile/runtime/event seam，Outbound Event=0 | 依赖越界不通过 |
| report audit | `reports/runs/<run_id>/report-audit.md` | artifact/report pairing、no static evidence、no orphan EV、path policy 通过 | 不通过 |

### 7.3 Acceptance handoff 检查表

| 入口 | 固定路径 | 必须内容 | 不得包含/宣称 |
|---|---|---|---|
| handoff | `reports/acceptance/handoff.md` | source/build/run refs、范围、P0/P1/P2、未覆盖、blocker、审查人/时间 | 不得直接写 accepted/verdict/signoff/readiness |
| VETO checklist | `reports/acceptance/veto-checklist.md` | `VETO-SYNC-001~005` 各自来源、EV/report/defect、结论字段 | 不得默认全 passed，不得被 risk acceptance 覆盖 |
| risk acceptance | `reports/acceptance/risk-acceptance.md` | risk id、impact、reason、evidence refs、owner、acceptor、deadline/trigger、follow-up | 不得接受 VETO/S/redaction/dependency/evidence failure |

### 7.4 Evidence/Report 停审与跨证据审计

| 审计项 | 结论 | 缺口/修正 |
|---|---|---|
| 每个 P0 EV 是否有正式 TC refs | pass (planned) | 未来 generator 必须拒绝无 tc_refs 的 EV |
| 每个 P0 EV 是否有 artifact/report path | pass (planned) | 当前无实例；Step 3 固定 path policy |
| 是否存在 orphan EV / static mapping | pending until run | Step 10 只定义失败门禁，当前不能宣称 clean |
| report 是否能回指 raw artifact | pending until run | 缺 raw/report pair 直接不可裁决 |
| redaction 覆盖全部输出面 | pass (design) / pending execution | 真实扫描待未来执行 |
| acceptance handoff 是否已人工/Agent 审查 | pending | 当前未生成文件 |
| blocker metadata 是否误当 evidence | pass | `EV-SYNC-BLOCKER-001` 明确 not proof |

## 8. 回填草稿

正式 §10 应声明：P0 验收必须从 `reports/runs/<run_id>/` 读取 run report，再回指 `artifacts/test/<run_id>/` raw artifact；每个 EV 必须有正式 TC refs、suite/artifact/report/digest、AC/VETO 映射和审查状态。固定入口为 `evidence-index.md`、`gate-results.md`、`redaction-check.md`、`dependency-boundary.md`、`report-audit.md` 及 `reports/acceptance/handoff.md`、`veto-checklist.md`、`risk-acceptance.md`。缺 raw/report、orphan EV、静态 evidence、路径违规、redaction/dependency/report audit 失败或未经审查的 handoff 均不得通过。当前所有 EV 仍为 planned，不存在真实证据。

## 9. 待确认事项

| 事项 | 影响 | 截止点 |
|---|---|---|
| runner/report generator 与 raw artifact schema | evidence index 可否真实生成 | 07/implementation boundary |
| redaction/path/dependency/report audit tooling | P0 evidence integrity | 07/后续执行环境 |
| 人类/Agent acceptance handoff 审查角色 | handoff 是否可作为裁决输入 | Step 14/送验前 |

## 10. 进入下一步条件

- [x] P0 EV、TC refs、artifact/report/handoff 路径和审查要求已形成表格。
- [x] raw artifact → run report → acceptance handoff 三层闭环已定义。
- [x] report/redaction/dependency/path/no-static-evidence 失败影响已明确。
- [x] EV-SYNC-BLOCKER-001 已明确为 metadata 而非 proof。
- [x] 本步停审；进入 Step 11 前读取 00 VETO、Step 5/6/9/10 和缺陷/风险边界。

## 11. Step 停审记录

- 本步裁决：`pass_with_upstream_blockers`。
- 证据门禁结构完整，但当前不存在 run/artifact/report/evidence；未声称 evidence clean 或验收通过。
- 下一步阅读：00 §14.1、05 §12.3、03 §13/§14，创建 Step 11。
