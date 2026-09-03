# L2-member-images 06 验收标准 Step 10：可观测性、审计与证据门禁

> 对应 SOP：`standards/document/验收标准讨论流程_SOP.md` Step 10  
> 对应书写规范：`standards/document/验收标准书写规范.md` §5.10  
> 回填位置：正式 `06-验收标准.md` 第 10 章“可观测性、审计与证据门禁”  
> 方法粒度：参照 L1-governance 的“证据门禁 → TC / suite / raw artifact / report / EV → 单项停审 → 跨证据审计”收敛方法；不继承其治理对象、outbox、publisher、外部观测后端、真实报告、VETO 结果或签署事实。  
> 文档模式：`full-restart`。本文定义 future acceptance evidence contract；不是测试执行、报告、evidence instance、验收结论、signoff 或 readiness。

## 1. Step 状态、开工确认与本步边界

| 项目 | 记录 |
|---|---|
| 当前 Step | Step 10：定义可观测性、审计与证据门禁。 |
| 输出文件 | `projects/L2-member-images/design-calibration/06_acceptance_step_10_evidence_audit.md`。 |
| 开工恢复 | 已核对项目台账、06 flow、Step 9，并读取验收 SOP Step 10、书写规范 §5.10、03 §14~§15、04 §8~§12、05 §9~§14、`05_test_plan_step_13_evidence.md`、`03_ddd_step_15_observability_audit.md` 与 L1-governance Step 10。 |
| 本步状态 | `completed_stop_review`。已形成 future evidence gate、EV 追溯、报告完整性与实际裁决约束；未修改正式 06，未创建任何实际 artifact/report。 |
| 本步目标 | 将安全观测、本地 trace/audit 边界、planned TC/EV、同一 `<run_id>` 的 raw artifact/report pair、报告审计和 acceptance handoff 收敛为可判定的 future 门禁。 |
| 本步不做 | 不选 observability backend、日志/trace 采样或保留策略、dashboard、告警、外部 audit 产品、真实 runner、run_id、digest、report、evidence alias、VETO verdict、风险接受、signoff 或 readiness。 |

### 1.1 设计校准、future actual evidence 与当前事实的分界

| 语境 | 本 Step 可以定义 | 本 Step 不得声称 |
|---|---|---|
| 设计校准 | 哪些 P0 gate 必须具备 raw artifact/report pair、EV→TC→AC 回指、脱敏和审计；哪些本地 signal 是诊断而非证据。 | 已生成、审阅或通过某条证据、报告、suite、gate 或 VETO。 |
| 当前可判定约束 | safe log/metric/span、local `ImageTraceRecord`、no-audit paths、strict no-write、marker-only inbound、zero outbound、固定路径与 no-`latest`。 | 任一 build、qualification、Artifact、consumer、container、外部 backend 或外部 owner result 已被观测或验收。 |
| future actual acceptance | 同一 fixed `<run_id>` 的 artifact/report pair、case mapping 和 run-scoped audit 如何构成证据实例。 | planned TC、EV family、脚本名称、静态表、stdout、fake、config `Assembled`、local trace 或历史报告可独立构成 evidence instance。 |
| owner / sibling pending | `Blocked`、`Unavailable`、`Unknown`、`Gap`、marker 与 reopen 条件如何保留在报告中。 | L2-member、L2-member-service、runtime/tools/method/artifact/builder/gate/Bus/sandbox 已提供 positive oracle、manifest/ref、digest、gate pass、handoff、confirmation 或 readiness。 |

### 1.2 输入与使用边界

| 输入 | 当前状态 | 本 Step 使用 | 不得推导 |
|---|---|---|---|
| 正式 00 §13~§15 | 已停审 | `NFR-MI-*`、`VETO-MI-*` direction、量化 residual 和风险边界。 | 真实 NFR/VETO 结果、数值基线或风险接受。 |
| 正式 01 §8/§13~§15 | 已停审 | dependency crop、fake isolation、阶段等待与 safe observable state。 | sibling compile dependency、生产观测或外部可用性。 |
| 正式 03 §14~§15 | 已停审 | 四类 signal、no-audit paths、redaction、低基数、`ImageTraceRecord` 的本地/UoW 边界和 test seam。 | audit backend、outbox、event delivery、运行期事实或 readiness。 |
| 正式 04 §8~§12 | 已停审 | sensitive/no-output、strict config、profile/fake、startup-only、下游证据承接。 | secret provider、remote reload、实际启动、online rollback 或真实 config digest。 |
| 正式 05 §9~§14 | 已停审 | planned suite、TC、EV family、artifact/report path、report generation 和 blocked/failed retention。 | 脚本、CI、run、artifact、report、EV instance、benchmark 或 defect/verdict。 |
| Step 5~9 | 已停审 | 各类 AC、redline、protocol/state/NFR 对 actual evidence 的回指与 P0 failure 影响。 | 已通过的功能、同步、状态或非功能验收。 |

## 2. SOP 问题回答

| SOP 问题 | 收敛回答 | 依据 |
|---|---|---|
| 哪些行为必须有 local audit record？ | 只有 future/reopen 中已合法取得 local subject 且 flow 明确要求的 local effect，才能在同一 `ReadWrite` UoW 追加 body-free `ImageTraceRecord`。当前 B01/B02 Command/Job、所有 Query、marker-only inbound、config/composition 与 zero outbound 均是 no-audit paths。 | 03 §14；`TC-OBS-002`、`TC-STATE-018`。 |
| 哪些行为需要 trace / log / metric？ | config/slot validation、Command/Job boundary stop、Query completion/degraded surface、marker disposition，以及 future/reopen store/UoW/adapter error 可有 safe structured log、低基数 metric 和 span。它们只作诊断，不能替代 raw evidence。 | 03 §14；05 §10/§13。 |
| 哪些报告必须归档？ | selected actual run 必须有 suite raw artifacts、suite reports、`summary.md`、`evidence-index.md`、`gate-results.md`、`redaction-check.md`、dependency boundary 和 report audit；交接还须 handoff/open issues，之后分别由 Step 11/13 定义 VETO/risk report 的实质内容。 | 05 §9/§13；验收书写规范 §5.10。 |
| 证据缺失会怎样？ | selected actual P0 run 中，缺 raw/report pair、EV mapping、redaction/dependency/report audit 或 mandatory handoff 时为 `not_evaluable` / gate failed，不能写 pass 或 conditional pass。当前尚无 selected actual run，只能记录 `absent`，不得把设计完成误写为系统失败或通过。 | Step 3~4；05 §12~§13；Step 9。 |
| 如何复查证据？ | 从 `reports/runs/<run_id>/evidence-index.md` 的 EV/TC/AC/case/suite/path 条目回到同 run 的 suite report，再回到 `artifacts/test/<run_id>/...` raw artifact；任何路径漂移、跨 run 拼接或 `latest` 均无效。 | 05 §13；验收书写规范 §4.4。 |
| evidence index 是否覆盖全部 P0 EV？ | 必须覆盖 `EV-UNIT/SVC/ENTRY/INT/CONFIG/SEC/OBS/GATE/REC-*` 的 selected actual instances；`EV-PERF-001` 只作为 baseline input，不能填入 P0 pass 分子。 | 05 §10/§13；Step 9。 |
| gate-results 是否覆盖 release gate？ | 必须逐一列出 blocking suite、redaction、dependency/outbound、pairing、report-audit 及其 `passed`/`failed`/`blocked`/`absent` 状态；不得把 owner gap、PF 或无 run 标为 pass。 | 05 §9、§12~§13。 |
| redaction-check 应证明什么？ | 扫描 artifact root、report root、evidence index 和 acceptance draft；raw secret/body/live state/endpoint/provider result 或高基数字段出现即失败。它不要求也不假设外部 scanner/backend。 | 03 §14；04 §8；05 §10/§13。 |
| handoff、VETO 和 risk report 能否替代 raw evidence？ | 不能。handoff 仅说明送验范围、基线、run、blocked/failed/absent 和待审项；VETO checklist 与 risk acceptance 分别由 Step 11/13 定义并须审查，均只能回指实际 evidence/defect/report。 | 验收 SOP Step 10；05 §13。 |
| 是否可用 fake、`Assembled`、local trace 或 signal 宣告 readiness？ | 不能。fake 只做 TestOnly boundary parity；`Assembled`/slot `Available` 只表示 local composition；trace/log/metric 不拥有 artifact、owner outcome 或验收结论语义。 | 03 §13~§14；04 §9；Step 9。 |

## 3. 当前材料诊断与裁决取舍

### 3.1 诊断

| 诊断点 | 风险 | 本 Step 处置 |
|---|---|---|
| historical 06 使用泛化 API/DB/log 或旧报告作“证据”。 | 诊断信号和计划材料会被误写为可复核 P0 evidence。 | 不继承；强制 same-run raw artifact/report pair、EV index 和 report audit。 |
| 03 已定义 log/metric/span/trace，但它们的 owner 与 evidence 不同。 | 为了“可审计”而让 Query/stop/inbound 写 trace，或将 signal 当 readiness。 | 明确 local signal 只用于诊断；no-audit paths 保持零 business audit，signal 不能替代 report。 |
| 05 已有 EV family、suite 与路径，但仅是规划。 | 直接用 TC/EV/path 表宣告覆盖、执行或通过。 | family 仅作 future instance namespace；actual instance 必须含 run、case、artifact/report pair 和审查状态。 |
| sibling/owner positive lanes 未闭合。 | `Blocked` 被写成 skipped/pass，或 fake/adapter 成功被当 external oracle。 | `blocked`、`failed`、`absent`、`not_evaluable` 分离；正向 owner result 不进入本 Step 的本地证据结论。 |
| 量化 workload、baseline、环境和 retention authority 均缺失。 | sample、无样本或旧阈值被写成性能结论。 | `EV-PERF-001` 只能交付 future baseline input；保持 P2 residual。 |

### 3.2 裁决取舍

| 议题 | 备选 | 结论 | 原因 |
|---|---|---|---|
| runtime log/metric/span 是否可作为 P0 evidence | A. 单独即可；B. 仅作辅助诊断，P0 仍要求 pair。 | 采用 B。 | 运行期 signal 既非 raw suite result，也不具备 case/AC/Evidence provenance。 |
| `ImageTraceRecord` 是否对每条入口都强制存在 | A. 是；B. 仅合法 future/reopen flow 的 local audit cut。 | 采用 B。 | Query、current stop、marker inbound、composition 的 no-write/no-audit 是 P0 红线。 |
| suite report 是否能脱离 raw artifact | A. 可以；B. 不可以。 | 采用 B。 | 可读报告必须可逆向复核 raw case、failure reason、safe config identity 与生成来源。 |
| 无 actual run 是否直接判系统失败 | A. 是；B. 设计阶段记 absent，selected actual acceptance 时判不可裁决/不通过。 | 采用 B。 | 不能将当前尚未授权的执行缺失伪造成 observed defect，也不能伪造 pass。 |
| handoff / VETO / risk 文档是否可默认生成结论 | A. 可以；B. 只能作为经审查的交接/裁决入口。 | 采用 B。 | 它们不能替代 raw evidence，且 Step 11/13 的实质规则尚未收敛。 |

## 4. 可观测性、local audit 与 actual evidence 的边界

| 载体 | 本仓允许的最大语义 | 能否单独支撑 P0 验收 | 永久禁止 |
|---|---|---|---|
| structured log / runtime span | safe operation、disposition、有限 state/error/seam/slot category、redacted diagnostic ref、duration。 | 否；仅能帮助定位对应 case/report。 | raw request/payload/config、ID/key/digest/tag/endpoint/secret、external body、provider result、readiness。 |
| low-cardinality metric | counter/histogram 及有限类别标签；可验证 signal schema 和 no high-cardinality redline。 | 否；`EV-OBS-001` 仍须从 test artifact/report pair 推导。 | object/actor/request/trace ID、free text、source ref、payload、digest、endpoint、external health/readiness gauge。 |
| `ImageTraceRecord` | future/reopen 同 UoW 的 append-only local subject/source/ref/reason trace。 | 否；它是 local audit，不是 test report、outbox、event、receipt、owner truth 或 evidence instance。 | no-audit path 写入、body/live state、report/evidence、truth repair、external export。 |
| raw suite artifact | run-scoped case result、safe stdout/stderr、failure reason、safe config/context identity。 | 是，但必须与同 run report、EV mapping 和 audit一起使用。 | overwrite/delete failed material、raw secret/body/live state、跨 run 拼接。 |
| run report / evidence index | 从 raw artifact 导出的可读 suite/gate/EV 关系和审查入口。 | 仅与 raw artifact 同时存在时可以。 | 手写补成 pass、从静态 mapping 直接宣告 EV、`latest`。 |
| acceptance report | handoff、open issue、Step 11 VETO/Step 13 risk 的审查入口。 | 否；不能替代 raw artifact/report pair。 | 默认 all-pass、未审查结论、把 pending 改写为 readiness。 |

#### 证据流：future selected actual run 的唯一可复查路径

```text
planned TC / suite / EV family
        |
        v
artifacts/test/<run_id>/meta + suites/<suite>/cases
        |  (raw, retained, body-free)
        +--> reports/runs/<run_id>/suites/<suite>.md
        |             |
        |             +--> evidence-index.md -> gate-results.md
        |             +--> redaction/dependency/report-audit checks
        v
reports/acceptance/handoff.md -> later VETO / risk review -> Step 14 decision
```

该图只定义 future provenance；未创建 runner、目录、脚本、run_id、artifact、report 或 decision。每个箭头都必须使用相同 `<run_id>`；acceptance 文档只引用结果，不能反向生成或修补 raw evidence。

## 5. 结构化中间产物：证据门禁表

| 验收项 ID | 证据主题 | future 必须存在的证据 | future 通过条件 | failure / 不可裁决条件 |
|---|---|---|---|---|
| `AC-EV-MI-001` | safe observability 与 no-audit boundary | `TC-OBS-001~002`、`TC-STATE-018` 的 raw case、`EV-OBS-001`、关联 suite report、redaction check。 | signal 只含允许的安全/低基数字段；Query、current Command/Job stop、marker inbound、config/composition 无 local trace/audit write；trace 仅合法 future UoW append。 | forbidden/high-cardinality field、signal 升格 readiness、或 no-audit path 写 trace/audit 为 P0 failed；缺 pair 为不可裁决。 |
| `AC-EV-MI-002` | fixed run 与实际输入基线 | `artifacts/test/<run_id>/meta/context.json`、suite/profile/config identity、`summary.md`。 | 所有 blocking artifact/report/evidence index 使用同一 explicit run、已固定输入身份和安全 profile identity；无 `latest` 或跨 run 拼接。 | missing/ambiguous/mutable run reference、缺 context、profile 不可确认或跨 run 汇总为 gate failed。 |
| `AC-EV-MI-003` | P0 evidence index | `reports/runs/<run_id>/evidence-index.md` 与可回指 raw evidence index。 | selected P0 EV instance 均列出 EV family/instance、TC/case、AC/VETO direction、suite、artifact path、report path、safe status、generated/review relation。 | orphan EV/TC/AC、静态表直接冒充 instance、缺 artifact/report link 或 `latest` 为 gate failed。 |
| `AC-EV-MI-004` | blocking suite raw artifact/report pair | 每个 blocking suite 的 `report.json`、case files、safe stdout/stderr、suite report。 | `pr-contract-domain`、`pr-boundary-no-write`、`pr-config-security`、`ci-entry-contracts`、`ci-dependency-redaction` 及被选入的 integration/risk suite 均有同 run pair；failed/blocked material retained。 | 仅有报告或仅有 artifact、覆盖/删除 failed result、case ref 缺失、pair 不同 run 或 report 与 raw status 冲突。 |
| `AC-EV-MI-005` | gate result 与状态分类 | `reports/runs/<run_id>/gate-results.md`、suite report、blocker references。 | blocking gate、P1/P2 residual 与 `passed`/`failed`/`blocked`/`absent` 分开，且 P0 failure、redaction/dependency/pairing/report-audit failure不能被 manual pass 覆盖。 | blocked/absent 改写为 pass、P0 failure 降 warning、selected gate 漏列或 gate result 无证据回指。 |
| `AC-EV-MI-006` | redaction / static-live output audit | `reports/runs/<run_id>/redaction-check.md`、scan raw result、`EV-SEC-001`/`EV-OBS-001` case mapping。 | artifact root、report root、EV index 与 acceptance draft 均无 raw secret/body/live state/endpoint/provider result；negative fixture 以安全 failure 保留。 | scan 漏范围、泄露、用 hash/手工说明遮蔽泄露、或缺同 run scan result；相关 P0 gate failed。 |
| `AC-EV-MI-007` | dependency category 与 zero outbound audit | `reports/runs/<run_id>/dependency-boundary.md`、`gate-results.md`、`EV-GATE-001` mapping。 | active sibling compile dependency 为零；compile/runtime/event/ref/adapter/fake 分类不漂移；inbound 仍 marker-only，`ImageOutboundEventInventory::NoneAuthorized` 保持零。 | 未授权 Cargo/path edge、shadow owner schema、outbox/publisher/topic/delivery、inbound acceptance/receipt/dedup，或 audit 只凭静态声明无 raw basis。 |
| `AC-EV-MI-008` | report integrity / anti-static-evidence audit | `reports/runs/<run_id>/report-audit.md`、pairing/anti-static check output、evidence index。 | report 从同 run raw artifact 派生；所有 P0 EV 无 orphan、无 default pass、无手写 raw status、failed/blocked/absent 可复查。 | report cannot trace generated_from/raw pair，静态 JSON/Markdown 宣告 EV/VETO pass，orphan/overwrite/mismatch 任一存在。 |
| `AC-EV-MI-009` | acceptance handoff 与审查边界 | `reports/acceptance/handoff.md`、`open-issues.md`、review notes；均回指 selected run。 | handoff 明示送验范围、设计/交付/运行基线、run、P0/P1/P2、failed/blocked/absent、open issue 和审查者；它不替代 raw evidence或最终结论。 | 缺 handoff、无 run ref、未经审查、将草稿写成 final pass、隐去 blocker 或把 owner gap写为 closed。 |
| `AC-EV-MI-010` | later VETO / risk evidence slots | future `reports/acceptance/veto-checklist.md`、`risk-acceptance.md`，分别回指 evidence/report/defect。 | Step 11/13 定义后，每个 VETO 有真实 evidence/defect/report disposition；conditional conclusion 所依据的 residual 有合格的风险接受记录。 | default all-passed、无 evidence 的 VETO、VETO/S boundary 被风险接受、或用风险记录替代 P0 evidence；当前未定义时不得填写结论。 |

### 5.1 Artifact / report 分工、脚本契约与固定目录（均为规划）

#### 规则来源

- `standards/document/设计文档讨论中间产物规范.md` §5.9。
- `standards/document/验收标准书写规范.md` §4.4、§5.10。
- 正式 `03-详细设计.md` §14~§15：safe signal、local trace、no-audit 与 redaction。
- 正式 `04-配置设计.md` §8~§12：sensitive/no-output、profile/fake、startup-only 和下游承接。
- 正式 `05-测试方案.md` §9、§10、§12、§13：planned suite、TC/EV、entry/exit、artifact/report 归档与脚本契约。

| 类型 | 固定 future 路径 | future 生成方 | 消费方 | 可否人工补充 | 不可承担 |
|---|---|---|---|---|---|
| raw artifact | `artifacts/test/<run_id>/...` | gate / CI / test runner。 | report generator、reviewer。 | 否；不得改写 raw result。 | handoff、VETO、风险或最终裁决。 |
| run report | `reports/runs/<run_id>/...` | `scripts/reports/*` 从 same-run raw artifact 派生。 | reviewer、future acceptance。 | 可补说明，不得改变 raw status。 | 跨 run 拼接、手写 pass 或 owner positive oracle。 |
| acceptance report | `reports/acceptance/...` | script 初稿 + 人/Agent review。 | future Step 11~14。 | 是，但必须回指 selected run。 | raw artifact、evidence instance 或自动 signoff。 |

| planned script / check | 类型 | 必须输入 | future 输出 | failure 处理 |
|---|---|---|---|---|
| `scripts/gates/check_contract_domain.sh`、`check_boundary_no_write.sh`、`check_config_security.sh`、`check_entry_contracts.sh` | P0 gate | `--run-id`、artifact root、config profile。 | respective suite `report.json` / case files / safe stdout-stderr。 | assertion failure 保留 safe raw result，gate failed。 |
| `scripts/gates/run_integration_seams.sh`、`run_risk_matrix.sh` | integration / risk gate | `--run-id`、artifact root、profile、explicit controlled seam。 | `ci-integration-seams` / `nightly-risk` raw result。 | P0 assertion failed 与 owner/PF `blocked` 分离；不得虚构 positive lane。 |
| `scripts/gates/check_dependency_redaction.sh` | P0 boundary gate | `--run-id`、dependency metadata、artifact/report roots、profile。 | dependency/redaction raw result。 | unauthorized compile/outbound/leak blocks；缺 owner oracle only remains blocked。 |
| `scripts/reports/generate_test_reports.sh`、`generate_evidence_index.sh`、`generate_gate_summary.sh` | report | same `--run-id`、artifact root、report root。 | suite reports、`summary.md`、`evidence-index.md`、`gate-results.md`。 | pair/mapping/generation failure is nonzero; never overwrite raw result. |
| `scripts/checks/check_redaction.sh`、`check_dependency_boundary.sh`、`check_artifact_report_pairing.sh`、`check_no_static_evidence.sh` | audit check | same run roots and evidence/report inputs。 | redaction/dependency/pairing/report-audit result。 | leak/category drift/missing pair/static evidence blocks; no manual pass. |

所有名称都是 05 的 planned path，不表示脚本、CI、runner、workspace、artifact 或 report 已创建。任何未来替换路径、schema 或 command 先重开 05 Step 9/13，并重审本 Step 与受影响 AC。

```text
artifacts/test/<run_id>/
  meta/context.json
  evidence-index.json
  suites/<suite>/report.json
  suites/<suite>/stdout.log
  suites/<suite>/stderr.log
  suites/<suite>/cases/<case_id>.json

reports/
  runs/<run_id>/
    summary.md
    evidence-index.md
    gate-results.md
    redaction-check.md
    dependency-boundary.md
    report-audit.md
    suites/<suite>.md
    evidence/EV-<TYPE>-<NNN>.md
  acceptance/
    handoff.md
    veto-checklist.md
    risk-acceptance.md
    open-issues.md
  review/
    reviewer-notes.md
    agent-review.md
```

禁止 `artifacts/test/<project>/<run_id>`、`reports/<project>/...`、`latest`、随机路径、将脚本置于 `reports/`、raw secret/body/live state/full sensitive ref 写入 artifact/report，或将 `reports/acceptance/*` 初稿当作 review 或 raw proof。

### 5.2 Evidence ID → TC → suite artifact → report → AC/VETO direction 追溯矩阵

这里的 `AC/VETO direction` 仅指 future evidence index 的回指目标；不是当前 instance、VETO 结论或实际 verdict。除 `EV-PERF-001` 外，行内 `缺失影响` 是 selected actual P0 acceptance 的不可裁决/failed 影响；`EV-PERF-001` 保持 future baseline input。

| planned EV family | planned TC | suite artifact | fixed report path | AC / VETO direction | selected-run 缺失影响 |
|---|---|---|---|---|---|
| `EV-UNIT-001` | `TC-CMD-001~003`、`TC-STATE-001~019`。 | `artifacts/test/<run_id>/suites/pr-contract-domain/`。 | `reports/runs/<run_id>/suites/pr-contract-domain.md`。 | `AC-FUNC-001~006`、`AC-RED-MI-001/002/007/008`、`AC-STATE-MI-001~004/007`、`AC-TX-MI-003/004`、`AC-NFR-MI-004/005` direction。 | local typed-ref/state/history P0 subchecks not evaluable. |
| `EV-SVC-001` | `TC-CMD-004~010`、`TC-QUERY-001~010`、`TC-CON-001~002`。 | `artifacts/test/<run_id>/suites/pr-boundary-no-write/`。 | `reports/runs/<run_id>/suites/pr-boundary-no-write.md`。 | Command/Job zero-effect、Query no-write、functional build/qualification/supply boundary、`AC-RED-MI-004~006`、`AC-TX-MI-001/005/006`、`AC-NFR-MI-001/002/005` direction。 | no-write/ordering and affected boundary subchecks not evaluable. |
| `EV-ENTRY-001` | `TC-IN-001~002`、`TC-JOB-001~006`、`TC-OBS-002`。 | `artifacts/test/<run_id>/suites/ci-entry-contracts/`。 | `reports/runs/<run_id>/suites/ci-entry-contracts.md`。 | `AC-SYNC-MI-021~029`、marker/no-outbound adjacent checks、`AC-TX-MI-001/005`、`AC-EV-MI-001/007` direction。 | inbound/job boundary or marker/no-audit subchecks not evaluable. |
| `EV-INT-001` | `TC-CON-003~005`、`TC-STATE-008~011`。 | `artifacts/test/<run_id>/suites/ci-integration-seams/`。 | `reports/runs/<run_id>/suites/ci-integration-seams.md`。 | `AC-STATE-MI-002~006`、`AC-TX-MI-002~006`、`AC-IDEM-MI-*`、`AC-NFR-MI-002/004/005` direction。 | UoW/version/history/recovery negative subchecks not evaluable; unavailable owner lane stays blocked. |
| `EV-CONFIG-001` | `TC-CONFIG-001~005`。 | `artifacts/test/<run_id>/suites/pr-config-security/`。 | `reports/runs/<run_id>/suites/pr-config-security.md`。 | `AC-RED-MI-003/006/008/010`、`AC-NFR-MI-003/006`、`AC-EV-MI-002/006` direction。 | strict config/profile/redaction subchecks not evaluable. |
| `EV-SEC-001` | `TC-SEC-001~002`、`TC-CMD-005`。 | `artifacts/test/<run_id>/suites/pr-config-security/` and `.../ci-dependency-redaction/`。 | `reports/runs/<run_id>/suites/pr-config-security.md`、`redaction-check.md`。 | `AC-RED-MI-002~004/008/010`、`AC-NFR-MI-003/004/006~008`、`VETO-MI-002~007` direction。 | forbidden-body/static-live/readiness redline cannot be accepted; leak evidence failure is blocking. |
| `EV-OBS-001` | `TC-OBS-001~002`、`TC-STATE-018`。 | `artifacts/test/<run_id>/suites/ci-entry-contracts/` and `.../ci-dependency-redaction/`。 | relevant suite reports and `reports/runs/<run_id>/redaction-check.md`。 | `AC-NFR-MI-008`、`AC-EV-MI-001/006`、`VETO-MI-003/007` direction。 | observability/no-audit/redaction subchecks not evaluable. |
| `EV-GATE-001` | `TC-DEP-001`、`TC-EVENT-001`、`TC-STATE-019`。 | `artifacts/test/<run_id>/evidence/EV-GATE-001/` plus dependency-redaction suite raw result。 | `reports/runs/<run_id>/gate-results.md`、`dependency-boundary.md`、`report-audit.md`。 | `AC-SYNC-MI-023/030`、`AC-RED-MI-009/010`、`AC-NFR-MI-007/009`、`AC-EV-MI-005/007/008`、`VETO-MI-007` direction。 | dependency/outbound/report-integrity subchecks not evaluable; detected violation is P0 failed. |
| `EV-REC-001` | `TC-CON-004~005`、`TC-REC-001`。 | `artifacts/test/<run_id>/suites/nightly-risk/`。 | `reports/runs/<run_id>/suites/nightly-risk.md`。 | `AC-STATE-MI-005`、`AC-TX-MI-006`、`AC-NFR-MI-002/005` direction。 | recovery negative boundary not evaluable; `PF-UNAVAILABLE-RECOVERY` does not become a positive result. |
| `EV-PERF-001` | `TC-PERF-001`。 | `artifacts/test/<run_id>/suites/nightly-risk/` or future controlled suite。 | matching suite report。 | `AC-NFR-MI-001/009` baseline/residual direction only。 | no P0 pass/fail denominator; only future workload/baseline input. |

### 5.3 Report 完整性与 acceptance handoff 检查表

| 检查项 | 固定 future 路径 | 通过条件 | selected actual acceptance 失败影响 |
|---|---|---|---|
| run summary | `reports/runs/<run_id>/summary.md` | scope、baseline identity、suite inventory、state counts和生成来源可回到 same-run artifact。 | run baseline/coverage不可复核。 |
| EV 索引 | `reports/runs/<run_id>/evidence-index.md` | 每个 selected P0 EV instance 可回指 TC/case、AC direction、suite、raw artifact、report、safe status和审查关系。 | `AC-EV-MI-003` failed / not evaluable。 |
| gate results | `reports/runs/<run_id>/gate-results.md` | blocking/P1/P2、passed/failed/blocked/absent、gate source与影响完整分离。 | overall P0 gate cannot be decided。 |
| redaction check | `reports/runs/<run_id>/redaction-check.md` | artifacts、reports、EV index、acceptance draft 全覆盖且无 forbidden output。 | P0 failure; Step 11 must evaluate applicable VETO candidate. |
| dependency boundary | `reports/runs/<run_id>/dependency-boundary.md` | active sibling compile edge zero、category/outbound inventory audit有 raw basis。 | P0 failure / VETO candidate。 |
| pair/report audit | `reports/runs/<run_id>/report-audit.md` | same-run pairing、generated-from、no static evidence、no orphan/overwrite/mismatch。 | `AC-EV-MI-004/008` failed; no pass or conditional pass。 |
| acceptance handoff | `reports/acceptance/handoff.md`、`open-issues.md` | reviewed scope, baseline, run, P0/P1/P2, failed/blocked/absent, residual/open issues; no decision substitution。 | handoff incomplete; cannot claim ready for acceptance review。 |
| VETO checklist | `reports/acceptance/veto-checklist.md` | future Step 11 maps every VETO to evidence/report/defect disposition; no default pass。 | final acceptance cannot decide VETO。 |
| risk acceptance | `reports/acceptance/risk-acceptance.md` | future Step 13 records only eligible residual with acceptor/action/deadline/trigger; no P0/VETO/S override。 | conditional pass unavailable。 |

### 5.4 Evidence instance 字段与人 / Agent 审查补充表

| 载体 | future 必填安全字段 / 回指 | 审查者必须核对 | 不得填入 |
|---|---|---|---|
| raw `report.json` / case result | fixed run reference、suite/case ID、planned TC ref、safe status、failure/blocker class、safe profile/context identity、generated relation。 | case 属于 selected scope；status与stdout/stderr一致；failed/blocked均保留。 | raw config/secret/body/live state、external provider body、伪 digest、手写 passed。 |
| EV index instance | EV family + instance identity、TC/case、AC/VETO direction、suite/artifact/report path、same run、safe status、generated/review relation。 | 无 orphan、无跨 run、无 static mapping冒充instance，`EV-PERF` 不进 P0 pass。 | `latest`、manual pass、owner positive oracle、unapproved readiness。 |
| run report / gate result | source artifact refs、generated relation、safe classification、P0/P1/P2 and pass/failed/blocked/absent separation。 | report不可改写 raw status；所有 selected blocking suite and check are represented。 | raw body、silent skip、blocked-as-pass、default verdict。 |
| acceptance handoff / open issue | selected run、baseline、scope、reviewer、evidence references、open blocker/defect/residual classification。 | 交接不替代 raw pair；pending/blocked未被关闭；审查人实际补充。 | final signoff、default all pass、风险接受冒充 P0 proof。 |
| future VETO / risk report | evidence/report/defect links，且由 Step 11/13 的规则授权。 | VETO/S不可接受；residual 是否有 acceptor/action/deadline/trigger。 | 未定义的 verdict、owner确认、risk closure或 conditional pass。 |

### 5.5 禁止引用、状态分离与实际证据裁决规则

1. `planned` 仅表示设计已定义 TC/suite/EV/path；不是 `passed`、`executed`、`evidence` 或 `ready`。
2. `absent` 表示当前没有实际 run、artifact、report 或 instance；它不是 observed defect，也不允许被解释成 pass。
3. `blocked` 只记录正式 DDD/PF/MI-UP/Q-MI 或环境/owner gap；它不等 failed，却使受影响 positive lane `not_evaluable`，不能进入 P0 pass 分子。
4. `failed` 只用于获得授权的实际检查出现断言/边界/完整性失败；必须保留 same-run raw artifact、report 和 failure reason，不能由重跑、手工编辑或 acceptance 文档覆盖。
5. `not_evaluable` 是 selected actual acceptance 对缺 pair、缺 baseline、缺 scope、缺 owner oracle 或 blocked positive lane的裁决，不是 `N/A`、skip 或 conditional pass。
6. 禁止 static table、planned mapping、fake、log/span/metric、`ImageTraceRecord`、stdout、historical report、cache、`Assembled`、slot `Available`、external ACK/tag/ref 或手写 JSON 单独生成 EV/VETO/result。
7. `latest`、跨 run 拼接、artifact/report 覆盖、orphan EV/TC/AC、无 generated relation、redaction/dependency/pairing/report-audit failure 均阻断被影响 P0 gate；不得用 risk acceptance、人工 pass 或 future rerun 覆盖原结果。
8. `EV-PERF-001` 只产生 future measurement baseline input；没有获权 workload/threshold 时既不能写 numeric P0 pass，也不能把无样本写为 numeric failure。

## 6. 逐项停审记录与跨证据裁决审计

### 6.1 证据门禁逐项停审记录

此表的“通过”仅表示本 Step 的设计收敛完成：正式来源、future pass/failure、TC/EV/path 与当前事实边界已一致。它不是 future run 的 gate result，更不是 actual acceptance pass。

| 验收项 | formal source / boundary 完整 | planned TC / EV / path 固定 | future pass/failure 可判定 | 未伪造 actual evidence / verdict | 保持的限制 | 本 Step 结论 |
|---|---|---|---|---|---|---|
| `AC-EV-MI-001` | 是 | 是 | 是 | 是 | signal/local trace 不替代 evidence；no-audit paths 继续零 audit。 | `pass_with_explicit_blockers`。 |
| `AC-EV-MI-002` | 是 | 是 | 是 | 是 | 无 fixed delivery/profile/run/context；不得填写实际值。 | `pass_with_explicit_blockers`。 |
| `AC-EV-MI-003` | 是 | 是 | 是 | 是 | EV family不是 instance；现无 evidence index。 | `pass_with_explicit_blockers`。 |
| `AC-EV-MI-004` | 是 | 是 | 是 | 是 | 05 的 suite/artifact/report均为 planned；当前无 pair。 | `pass_with_explicit_blockers`。 |
| `AC-EV-MI-005` | 是 | 是 | 是 | 是 | no run、DDD/PF/owner gap 只能 absent/blocked，不能 pass。 | `pass_with_explicit_blockers`。 |
| `AC-EV-MI-006` | 是 | 是 | 是 | 是 | 未执行 redaction scan；禁止借静态说明形成 clean result。 | `pass_with_explicit_blockers`。 |
| `AC-EV-MI-007` | 是 | 是 | 是 | 是 | active sibling compile dependency当前仍为零设计约束；没有 actual package graph audit。 | `pass_with_explicit_blockers`。 |
| `AC-EV-MI-008` | 是 | 是 | 是 | 是 | no report/audit instance；不得手写 generated relation。 | `pass_with_explicit_blockers`。 |
| `AC-EV-MI-009` | 是 | 是 | 是 | 是 | handoff/open issues/review notes均未创建；无送验完整性声明。 | `pass_with_explicit_blockers`。 |
| `AC-EV-MI-010` | 是 | 是 | 是 | 是 | VETO/risk substantive rules留 Step 11/13；无 checklist/result/acceptance。 | `pass_with_explicit_blockers`。 |

### 6.2 跨证据裁决审计表

| 审计项 | 审计结论 | 修正 / 保持边界 |
|---|---|---|
| 每个规划 EV 是否有 TC、suite artifact、report path 与验收方向 | `pass` | §5.2 覆盖 `EV-UNIT/SVC/ENTRY/INT/CONFIG/SEC/OBS/GATE/REC/PERF-*`；所有均标记 planned。 |
| 是否把 05 的 future mapping 误写为已执行 EV | `pass` | `EV-*` 仅 family；实际实例必须有 selected same-run artifact/report/case/review relation。 |
| raw artifact 与 report 是否保持一对一、同 run、可回查 | `pass` | 由 `AC-EV-MI-002/004/008` 和 pairing/report-audit future check共同约束；当前没有 pair。 |
| 是否保留 failed、blocked、absent、not_evaluable 的不同语义 | `pass` | failed只来自实际检查；blocked不升格为pass；当前真实材料为 absent而非 observed failure。 |
| 是否存在 static evidence、orphan EV 或 report 补写路径 | `pass` | 静态 mapping、fake、signal、historical material、manual JSON、`latest`均禁止；future report audit必须检查。 |
| redaction 是否覆盖 artifact、report、index 与 acceptance draft | `pass` | leakage 是P0 failure/VETO candidate direction；本 Step未声称scan完成。 |
| dependency/outbound audit 是否误把 ref/adapter/fake 变为 compile 或外部成功 | `pass` | 保持六类依赖分类、active sibling compile zero、marker inbound与zero outbound；无外部 oracle。 |
| local trace/log/metric 是否被混为 raw evidence、outbox或 external audit | `pass` | 仅 safe diagnostics/local append-only trace；无 backend、outbox、publisher、delivery、receipt或 readiness metric。 |
| VETO、risk、handoff 是否被提前写为事实或结论 | `pass` | 仅固定 future report slots；Step 11、13、14分别收敛实质规则与最终裁决。 |
| P1/P2、performance与 owner-positive lanes 是否污染P0 | `pass_with_explicit_blockers` | `EV-PERF-001`仅baseline input；real builder/gate/Artifact/consumer仍需 owner oracle；B01/B02、B03、OPEN、PF、MI-UP、Q-MI保持开放。 |

## 7. 正式 `06-验收标准.md` §10 回填草稿（禁止当前装配）

> 写入前提：只有 Step 1~14 已完成、Step 15 已获准进行正式装配时，才能写入本草稿。当前正式 `06-验收标准.md` 仍是 historical material，禁止修改。

```md
## 10. 可观测性、审计与证据门禁

> 校准来源：
> - `design-calibration/06_acceptance_step_10_evidence_audit.md`
>
> 延伸阅读：
> - 建议继续阅读 `design-calibration/06_acceptance_step_10_evidence_audit.md` 的“证据门禁表”“Evidence ID → TC → suite artifact → report → AC/VETO direction 追溯矩阵”“Report 完整性与 acceptance handoff 检查表”“逐项停审记录与跨证据裁决审计”小节，了解本章如何从 03 的安全可观测边界和 05 的 future artifact/report contract 收敛。

本章定义 future actual acceptance 的证据门禁，不记录任何当前运行结果。P0 evidence 必须固定到同一 `artifacts/test/<run_id>/...` 与 `reports/runs/<run_id>/...`，不得引用 `latest`、跨 run 拼接、planned TC/EV、静态表、fake、log、metric、span、`ImageTraceRecord`、historical report 或 handoff draft 作为独立证据实例。

structured log、low-cardinality metric、runtime span 只作安全诊断；`ImageTraceRecord` 只是在合法 future/reopen `ReadWrite` UoW 中追加的本地 trace。当前 B01/B02 Command/Job、所有 Query、marker-only inbound、config/composition 和 zero outbound 都是 no-audit paths。`Assembled`/slot `Available`、safe ref、adapter/fake 或 local trace均不表示 build、gate、Artifact、consumer、container、external health或readiness。

| 验收项 ID | 证据主题 | 必须存在的 future evidence | 通过条件 | 失败条件 |
|---|---|---|---|---|
| `AC-EV-MI-001` | safe observability / no-audit | `TC-OBS-001~002`、`TC-STATE-018`、`EV-OBS-001`、same-run suite pair、redaction check。 | 仅安全低基数字段；no-audit paths无 local trace/audit；required trace只在合法 future UoW append。 | raw/high-cardinality field、trace/write越界或signal升格readiness；缺pair不可裁决。 |
| `AC-EV-MI-002` | fixed run / input baseline | `meta/context.json`、safe profile/config identity、`summary.md`。 | selected blocking inputs、artifact、report、index均使用同一fixed run。 | mutable/ambiguous run、`latest`、缺context或跨run汇总。 |
| `AC-EV-MI-003` | P0 EV index | `reports/runs/<run_id>/evidence-index.md`。 | 每个selected P0 EV instance回指TC/case、AC/VETO direction、suite、raw artifact、report、safe status与review relation。 | orphan、static declaration、缺pair link或`latest`。 |
| `AC-EV-MI-004` | blocking suite pair | suite `report.json`、case files、safe stdout/stderr与same-run suite report。 | selected blocking suite的raw/result/report均保留且一致。 | pair缺失、不同run、case缺失、failed/blocked被删除或report/raw冲突。 |
| `AC-EV-MI-005` | gate result / status separation | `gate-results.md`、suite reports、blocker references。 | P0/P1/P2与passed/failed/blocked/absent明确分离，P0 hard failure不可manual pass。 | blocked/absent写成pass、漏gate或无evidence回指。 |
| `AC-EV-MI-006` | redaction / static-live audit | `redaction-check.md`、scan result、security/observability case mapping。 | artifact、report、index与acceptance draft无forbidden output。 | leakage、scan漏范围、缺scan或用说明遮蔽泄露。 |
| `AC-EV-MI-007` | dependency / zero-outbound audit | `dependency-boundary.md`、`gate-results.md`、`EV-GATE-001` mapping。 | sibling compile edge为零；依赖分类不漂移；inbound marker-only、outbound严格零。 | unauthorized compile/outbound、shadow schema、inbound acceptance或静态无raw basis。 |
| `AC-EV-MI-008` | pair/report/anti-static audit | `report-audit.md`、pairing/anti-static output、EV index。 | report可回到same-run raw evidence；无orphan/default pass/overwrite/mismatch。 | static EV/VETO pass、缺generated relation、pair mismatch或result改写。 |
| `AC-EV-MI-009` | acceptance handoff | `handoff.md`、`open-issues.md`、review notes。 | 已审查并说明scope、baseline、run、P0/P1/P2、failed/blocked/absent与open issues；不替代raw evidence。 | 缺run/ref/review、隐去blocker或草稿冒充final pass。 |
| `AC-EV-MI-010` | VETO / risk slots | future `veto-checklist.md`、`risk-acceptance.md`及其evidence/report/defect回指。 | Step 11/13规则闭合后，VETO与eligible residual均有可复核来源。 | default pass、无evidence VETO、VETO/S被risk接受或risk替代P0 proof。 |

报告完整性至少覆盖 `summary.md`、`evidence-index.md`、`gate-results.md`、`redaction-check.md`、`dependency-boundary.md`、`report-audit.md`、`handoff.md` 和 `open-issues.md`。`veto-checklist.md` 与 `risk-acceptance.md` 分别在后续 Step 完成后才可填写审查内容。redaction、dependency、pairing、report-audit、P0 EV index任一实际失败或缺失时，不得作出通过或有条件通过结论。
```

## 8. 待确认事项、完成检查与进入 Step 11 条件

| 待确认 / blocker | 对本 Step 的影响 | 当前处理 / 重开条件 |
|---|---|---|
| selected delivery、actual implementation repository、profile/config identity、fixture、environment、`run_id` | 无法产生 actual raw artifact/report pair。 | 当前 `absent`；future actual acceptance先满足 Step 3~4 的固定基线。 |
| `DDD-S9-B01/B02`、`DDD-S11-B03`、`DDD-S13-OPEN-01/02`、`PF-UNAVAILABLE-RECOVERY` | 限制 mutation/replay/terminal/recovery positive lane，以及受影响 evidence的可裁决范围。 | 只测试已定义 zero-effect/no-write/blocked边界；关闭后重开03/05/06受影响Step。 |
| `MI-UP-001~009`、`Q-MI-001~004` | 不存在 owner-controlled builder/gate/Artifact/consumer/event/field oracle。 | 保留 `blocked/not_evaluable`；不能用 fake、ref、adapter、report 或 local marker伪闭合。 |
| actual report schema、digest algorithm、report signing、retention、backend/alert | 不影响当前 P0 structural evidence discipline，但影响 future implementation/operations details。 | 不定义默认值；有授权选择时重开05/06及相关配置/运维设计。 |
| VETO checklist、risk acceptance、signoff ownership | 实质裁决与责任人尚未定义。 | 严格留 Step 11、13、14；当前不创建报告或结论。 |

完成检查：

- [x] 已按验收 SOP Step 10 定义证据门禁、report 完整性、handoff检查、逐项停审与跨证据裁决审计。
- [x] 已把 local log/metric/span/trace 与 actual evidence instance、report、acceptance review 的 owner/lifecycle 分开。
- [x] 已为 `EV-UNIT/SVC/ENTRY/INT/CONFIG/SEC/OBS/GATE/REC/PERF-*` 建立 TC→suite artifact→report→AC/VETO direction；`EV-PERF-001`仍仅为baseline input。
- [x] 已固定 same-run、no-`latest`、failed retention、blocked/failed/absent/not_evaluable 分离、redaction/dependency/pairing/anti-static audit。
- [x] 未创建脚本、CI、runner、workspace、artifact、report、run_id、digest、evidence instance、VETO/result、handoff、risk acceptance、signoff或readiness。
- [x] 未将 sibling/upstream pending、fake、adapter、local composition或observability signal写为外部成功。

| 进入 Step 11 的条件 | 状态 | 说明 |
|---|---|---|
| P0 evidence gate有future pass/failure与固定路径 | `pass` | 见 §5. |
| 每个EV family有TC/suite/report/AC direction | `pass` | 见 §5.2；均为planned。 |
| report/handoff完整性与anti-static规则可审计 | `pass` | 见 §5.3~§5.5。 |
| 逐项停审、跨证据审计无未解决的设计矛盾 | `pass_with_explicit_blockers` | blocker限制正向lane，不改变证据纪律。 |
| actual evidence是否存在 | `absent` | 不阻止继续定义 Step 11 VETO规则；阻止任何实际验收结论。 |

```text
step_10_status = completed_stop_review
step_content_gate_status = pass_with_explicit_blockers
document_gate_status = allowed_for_step_11
next_allowed_action = create_and_complete_step_11_veto
formal_06_write_allowed = false_until_step_15
test_execution_allowed = false
implementation_allowed = false
commit_required = false
```
