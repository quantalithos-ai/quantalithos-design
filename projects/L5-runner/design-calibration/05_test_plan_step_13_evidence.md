# Step 13. 定义测试报告与证据归档

> 对应 SOP：`standards/document/测试方案讨论流程_SOP.md` Step 13  
> 回填章节：`05-测试方案.md` §13  
> 状态：`completed / pass / self_reviewed`

## 1. Step 状态与事实边界

| 项 | 当前值 |
|---|---|
| current_document | `05-测试方案.md` |
| current_step | Step 13 |
| current_module | `evidence:planned_slots_raw_report_runtime_index_and_review` |
| gate_status | `pass_for_step_14` |
| gate_reason | 18 个 P0 切口均有 planned evidence slot；机器 artifact、人读 report、运行时 EV、验收交接、失败保留、redaction/boundary scan、保留 guard 和人/Agent 审查关系已闭合；没有创建 run、artifact、report、EV 或 verdict。 |
| formal_05_write_allowed | `false_until_step_15` |
| implementation_write_allowed | `false` |
| test_execution_allowed | `false` |
| commit_required | `false` |
| next_allowed_action | 创建并完成 Step 14 |

本 Step 只定义证据合同。`ESLOT-RUN-*` 是 planned slot，`EV-RUN-<FAMILY>-<NNN>` 是未来运行时别名模式；二者都不表示证据已存在。只有固定 `<run_id>` 下真实 case artifact、suite report 和完整性检查通过后，报告生成器才可生成 evidence item 与别名。

## 2. 本步目标、输入与非目标

### 2.1 目标

1. 为 18 个 P0 切口定义唯一 planned evidence slot 和后续 AC 消费入口；
2. 固定 `artifacts/test/<run_id>`、`reports/runs/<run_id>`、`reports/acceptance` 与 `reports/review` 的职责；
3. 定义 case、suite、check、evidence index 和人读 report 的最小 schema/生成关系；
4. 确保 failed/blocked/not-run/timeout/flaky 仍留原始记录，但不被升级成通过证据；
5. 证明 evidence 由真实 raw/report pair 推导，禁止静态表、`latest`、手写索引或本地日志造证据；
6. 定义 redaction、依赖边界、保留/失效和人/Agent 审查规则。

### 2.2 输入基线

| 输入 | 本 Step 用途 |
|---|---|
| `05_test_plan_step_05_traceability_coverage.md` | 提供 CUT/TC/EV 候选到 `AC-RUN-*` 的映射。 |
| `05_test_plan_step_06_cases.md` | 提供 108 个计划 TC、候选证据和正式断言。 |
| `05_test_plan_step_09_automation_gates.md` | 提供 suite/gate、逻辑脚本、fixed-run artifact/report 路径。 |
| `05_test_plan_step_10_nonfunctional.md` | 提供 redaction、dependency、recovery、observability 和 performance sample 证据边界。 |
| `05_test_plan_step_11_defects_retest.md` | 提供失败前后证据和复验关闭要求。 |
| `05_test_plan_step_12_entry_exit.md` | 提供结果分类、退出证据和 blocked/not-run 不计通过规则。 |
| `测试方案书写规范.md` §4.6、§5.13 | 固定 artifact/report/scripts 路径和报告结构。 |

### 2.3 非目标

- 不创建目录、schema 文件、脚本、artifact、report、evidence index、EV detail、run_id 或 acceptance draft 实例。
- 不把 planned slot、candidate EV、测试文档表或报告模板当作执行证据。
- 不规定 digest 算法、文件编码器、CI 产品或物理存储后端；它们需由实现/运维 authority 决定并受一致性检查。
- 不在 `reports/acceptance/*` 自动填写 pass、VETO cleared、verdict、signoff 或 readiness。
- 不保存 raw secret、token、credential、private key、完整 Release/Artifact/Runtime/Sandbox/Observability/Archive 正文或未脱敏日志。
- 不用本地 Runner log/receipt/report/handoff 冒充 L4 formal audit/evidence。

## 3. SOP 问题回答

| 问题 | 收口回答 |
|---|---|
| 每类测试输出什么证据？ | 每个执行 TC 输出 case artifact；每个 suite 输出 `report.json`、redacted stdout/stderr、清理/失败摘要；check 输出 redaction/dependency/link/audit artifact；随后生成 suite report、run summary 和运行时 evidence item。 |
| 证据保存在哪里？ | 机器原始证据在 `artifacts/test/<run_id>`，人读报告在 `reports/runs/<run_id>`，验收交接初稿在 `reports/acceptance`，独立审查记录在 `reports/review`；无 project 子层和 `latest`。 |
| 如何关联 TC 和验收？ | Evidence item 必须含完整 `cut_refs`、`tc_refs`、`suite_refs`、artifact/report refs 与 digest、`ac_refs`、status、blocker/issue refs；运行时数组不得使用 range/wildcard。 |
| 哪些材料必须保留？ | context/config/source refs、case assertion、suite report、redacted logs、call/write/cleanup 摘要、gate/check results、evidence index 和 human reports；不要求复制上游正文或私有数据库 snapshot。 |
| 保留多久？ | 使用条件式 guard：至少保留到对应验收/缺陷复验/争议关闭且存在可追溯 superseding record；当前无 authority，不发明天数。 |
| 失败 suite 是否产出材料？ | 是。无论 fail/blocked/not-run/timeout/flaky，都必须留下 status、未执行范围、safe failure/blocker ref、redacted logs 和 cleanup posture；缺文件本身使 pairing 失败。 |
| 如何证明 redaction/boundary？ | 同一 fixed run 的机器 artifact 与人读报告均由 check 扫描；finding 或 scanner unavailable 阻断 evidence-ready，报告只记录 forbidden category/safe issue ref，不回显原值。 |
| EV 是否能静态生成？ | 不能。Slot catalog 只声明期望关系；运行时 EV 必须由真实 case + suite report + check pair 推导，缺一项不分配 alias。 |
| 哪些报告要人工/Agent 审查？ | acceptance handoff、否决清单、风险接受、open issues 和 review notes；审查可标 reviewed/disputed，不得改写 raw index 或把 failed/blocked 变 pass。 |

## 4. 证据成熟度与生成链

| 成熟度 | 允许存在 | 禁止声称 |
|---|---|---|
| `planned_slot` | slot ID、期望 CUT/TC/suite/AC、计划路径 | artifact/report/EV 已存在 |
| `raw_run_record` | 真实 context/case/suite/check artifact，含实际 status | 已审查、已验收 |
| `generated_report` | 从 raw 生成的 suite/run/evidence index 人读报告 | verdict/signoff |
| `runtime_evidence` | 有效 raw/report pair、完整 refs/digest/check 的 EV item | status 必然 pass |
| `reviewed_handoff` | 独立 review/acceptance draft 与争议/风险补充 | 06/治理已裁决 |

#### 证据流图: planned slot 到验收交接

```text
[ESLOT-RUN-* planned catalog]
          |
          v
[fixed <run_id> case + suite + check artifacts]
          |
          v
[pairing / redaction / boundary / link validation]
          |
          +-- invalid/missing --> [no EV alias; incomplete/failed]
          |
          v
[runtime EV item + evidence-index + human reports]
          |
          v
[acceptance draft + independent human/Agent review]
          |
          v
[future 06 / governance decision]
```

关键说明:

- slot 与 EV alias 不是证据实例；正式实例至少由 `(run_id, evidence_id, evidence_item_digest)` 定位。
- Evidence item 可记录 passed/failed/blocked/not-run 等实际 status；存在 EV 不等于通过。
- acceptance draft 和 review 不得改写 raw artifact、suite status 或 owner truth。

## 5. Planned evidence slot 目录

表中 TC range 仅供文档阅读；未来 machine artifact 必须展开成完整正式 TC ID 数组。

| Slot | Family / CUT | 计划 TC | 主 producer suite | 后续 AC | runtime alias pattern |
|---|---|---|---|---|---|
| `ESLOT-RUN-001` | CTX / CUT-01 | `TC-RUN-CTX-001~006` | CONTRACT/DOMAIN/SERVICE | AC-RUN-001/002 | `EV-RUN-CTX-001` |
| `ESLOT-RUN-002` | MAT / CUT-02 | `TC-RUN-MAT-001~007` | DOMAIN/SERVICE/CONTROLLED | AC-RUN-003/004 | `EV-RUN-MAT-002` |
| `ESLOT-RUN-003` | REQ / CUT-03 | `TC-RUN-REQ-001~006` | SERVICE/UOW/CONTROLLED | AC-RUN-005 | `EV-RUN-REQ-003` |
| `ESLOT-RUN-004` | CTL / CUT-04 | `TC-RUN-CTL-001~005` | SERVICE/UOW/CONTROLLED | AC-RUN-005/006 | `EV-RUN-CTL-004` |
| `ESLOT-RUN-005` | OWN / CUT-05 | `TC-RUN-OWN-001~005` | SERVICE/CONTROLLED/REPLAY | AC-RUN-006 | `EV-RUN-OWN-005` |
| `ESLOT-RUN-006` | RES / CUT-06 | `TC-RUN-RES-001~006` | DOMAIN/CONTROLLED/JOB | AC-RUN-007/008 | `EV-RUN-RES-006` |
| `ESLOT-RUN-007` | REC / CUT-07 | `TC-RUN-REC-001~006` | SERVICE/UOW/JOB/REPLAY | AC-RUN-009 | `EV-RUN-REC-007` |
| `ESLOT-RUN-008` | PRE / CUT-08 | `TC-RUN-PRE-001~006` | DOMAIN/SERVICE/SECURITY | AC-RUN-010 | `EV-RUN-PRE-008` |
| `ESLOT-RUN-009` | QRY / CUT-09 | `TC-RUN-QRY-001~006` | SERVICE/ENTRY/SECURITY | AC-RUN-006/009/010 | `EV-RUN-QRY-009` |
| `ESLOT-RUN-010` | CON / CUT-10 | `TC-RUN-CON-001~006` | CONTRACT/ENTRY | AC-RUN-001/011 | `EV-RUN-CON-010` |
| `ESLOT-RUN-011` | IDM / CUT-11 | `TC-RUN-IDM-001~006` | SERVICE/UOW | AC-RUN-005/009/011 | `EV-RUN-IDM-011` |
| `ESLOT-RUN-012` | UOW / CUT-12 | `TC-RUN-UOW-001~006` | UOW/SERVICE/REPLAY | AC-RUN-009/011 | `EV-RUN-UOW-012` |
| `ESLOT-RUN-013` | ENT / CUT-13 | `TC-RUN-ENT-001~005` | ENTRY/CONTRACT/SERVICE | AC-RUN-001/005/011 | `EV-RUN-ENT-013` |
| `ESLOT-RUN-014` | CNS / CUT-14 | `TC-RUN-CNS-001~006` | CONSUMER/CONTRACT | AC-RUN-011 | `EV-RUN-CNS-014` |
| `ESLOT-RUN-015` | JOB / CUT-15 | `TC-RUN-JOB-001~008` | JOB/UOW/REPLAY | AC-RUN-003/008/009/010/011 | `EV-RUN-JOB-015` |
| `ESLOT-RUN-016` | CFG / CUT-16 | `TC-RUN-CFG-001~006` | CONFIG/CONTROLLED/SECURITY | AC-RUN-002/004/011 | `EV-RUN-CFG-016` |
| `ESLOT-RUN-017` | OBS / CUT-17 | `TC-RUN-OBS-001~006` | SECURITY/CONTRACT/REPLAY | AC-RUN-010/011 | `EV-RUN-OBS-017` |
| `ESLOT-RUN-018` | BND / CUT-18 | `TC-RUN-BND-001~006` | CONTRACT/SECURITY/SERVICE | AC-RUN-005/006/008/010/011 | `EV-RUN-BND-018` |

一个 case artifact 可被多个 slot 引用，但每个 TC 只有一个 CUT/slot 主归属；secondary slot 引用必须显式且不得重复计算覆盖率。缺失/blocked TC 不从 slot 目录删除，而是由实际 status 和 blocker refs 表达。

## 6. Machine artifact 目录与最小 schema

```text
artifacts/test/<run_id>/
  meta/context.json
  meta/config-summary.json
  meta/source-revisions.json
  evidence-index.json
  checks/redaction.json
  checks/dependency-boundary.json
  checks/evidence-links.json
  checks/report-pairing.json
  suites/<suite>/report.json
  suites/<suite>/stdout.log
  suites/<suite>/stderr.log
  suites/<suite>/cases/<tc_id>.json
  suites/<suite>/artifacts/<safe_name>.json
```

根目录不得增加 project 子层或 `latest`。这些路径是计划合同，当前不创建实例。

### 6.1 共享结果枚举

| 枚举 | 允许值 | 规则 |
|---|---|---|
| `RunnerTestArtifactStatus` | `passed`, `failed`, `blocked`, `not_run`, `timeout`, `flaky`, `incomplete` | 与 Step 9/12 一致；不得把 blocked/not_run 合并为 skipped-pass。 |
| `RunnerTestAssertionStatus` | `passed`, `failed`, `not_run` | assertion 不使用 risk accepted；接受只在报告层。 |
| `RunnerTestReviewStatus` | `pending`, `reviewed`, `disputed` | review 另存记录，不回写 raw status。 |
| `RunnerTestRedactionStatus` | `clean`, `failed`, `unavailable`, `not_applicable` | unavailable 阻断 evidence-ready。 |

### 6.2 `meta/context.json`

| 字段 | 必需 | 含义 |
|---|---:|---|
| `schema_version`, `run_id`, `started_at` | 是 | 固定 schema、非 `latest` 的 run identity 和开始时间。 |
| `test_layer`, `config_profile`, `environment_role` | 是 | T1/T2/T3、四 profile 之一和 Step 8 环境 ID。 |
| `suite_refs`, `run_intent`, `trigger_refs`, `change_refs` | 是 | 执行范围与 Step 14 回归原因；数组使用正式 ID。 |
| `artifact_root`, `report_root` | 是 | 必须匹配本 fixed run。 |
| `redacted_environment` | 是 | 只含安全类别、版本/ref 和能力 posture。 |
| `context_digest` | 是 | 由未来 authority 选定的 canonical digest；不得伪填。 |

### 6.3 Case 与 suite artifact

| 文件 | 必需字段 | 关键约束 |
|---|---|---|
| `cases/<tc_id>.json` | schema/run/suite/TC/CUT/profile/dataset refs/status/assertions/safe issue refs/call-write-cleanup refs/digest | `tc_id` 为单个正式 ID；actual value 只能是 bounded safe value/ref；blocked 要有 blocker ref。 |
| `suites/<suite>/report.json` | schema/run/suite/status/case refs+digests/counts/failure/blocker/cleanup/redaction refs/digest | 必须列出计划、执行、未执行 case；aggregate 不能压缩 failed/blocked/timeout/flaky。 |
| `checks/<check>.json` | schema/run/check/status/findings categories/source refs/digest | findings 不包含 raw forbidden value；scanner unavailable 为失败/阻断。 |
| `artifacts/<safe_name>.json` | schema/run/producer/status/safe payload refs/digest | 不保存 owner body、secret、完整 URL/path、stdout/stderr body。 |

`stdout.log` 与 `stderr.log` 必须存在且经过 redaction scan；无输出可为空文件，但仍由 suite report 引用其 digest。任何 digest 算法/规范在实现时必须统一登记，不能由单个 suite 自行发明。

### 6.4 Evidence index 与 item

| 层级 | 必需字段 | 生成规则 |
|---|---|---|
| root `evidence-index.json` | schema/run/context digest/generator ref/items/incomplete slots/check refs/index digest | 只从同 run 的 raw/report/check 生成；不得手写补项。 |
| evidence item | run/evidence ID/slot/family/status/CUT refs/逐项 TC refs/suite refs/artifact refs+digests/report refs+digests/AC refs/blocker+issue refs/item digest | 至少一个真实 case artifact 和 suite report；所有 refs 同 run；status 不被 alias 隐藏。 |
| incomplete slot | slot ID/missing producer/missing TC/blocker/status | 不生成 EV alias；仍进入人读 evidence index 的缺口区。 |

正式 evidence instance 由 `(run_id, evidence_id, evidence_item_digest)` 唯一定位。单独 `EV-RUN-*`、root digest、路径或 `latest` 都不足以定位证据。

## 7. Human-readable report 目录

```text
reports/
  README.md
  runs/<run_id>/
    summary.md
    evidence-index.md
    gate-results.md
    redaction-check.md
    dependency-boundary.md
    evidence-link-check.md
    report-pairing.md
    suites/<suite>.md
    evidence/<evidence_id>.md
  acceptance/
    handoff.md
    veto-checklist.md
    risk-acceptance.md
    open-issues.md
  review/
    reviewer-notes.md
    agent-review.md
```

- `reports/runs/<run_id>` 只包含该 run 的生成报告；不得合并多个 run 后隐藏差异。
- `reports/acceptance/*` 是交接初稿/补充区，不得静态宣告通过；每份必须列明 source run 和 digest refs。
- `reports/review/*` 是独立审查记录，不得改写 `artifacts/test/<run_id>/evidence-index.json`。
- `reports/` 只存输出，生成脚本必须位于 `scripts/reports/`；当前不创建任何脚本或目录。

## 8. 报告生成与审查映射

| 报告 | 来源 artifact/report | 逻辑生成脚本 | 输出 | 人/Agent 审查 |
|---|---|---|---|---|
| suite summary | suite `report.json`、case JSON、redacted logs | `scripts/reports/render-suite-report.sh` | `reports/runs/<run_id>/suites/<suite>.md` | 核对 case/status/failure/blocker/cleanup 与 raw 一致。 |
| run summary / gate results | context + all suite/check reports | `scripts/reports/render-run-summary.sh` | `summary.md`, `gate-results.md` | 核对 planned/executed/not-run 分母和 T1/T2/T3 层级。 |
| evidence index/detail | valid raw/report pairs + checks | 未来 evidence-index report stage | `evidence-index.md`, `evidence/<EV>.md` | 逐 TC/CUT/AC、digest、blocker 和 status 抽查。 |
| redaction/boundary/link/pairing reports | corresponding check JSON | future check report stage | fixed check report paths | findings、scanner unavailable 和 missing source 不得被隐藏。 |
| acceptance handoff | fixed-run reports/evidence index/open issues | future acceptance handoff script | `reports/acceptance/handoff.md` | 补交付范围、未执行项、blocker；不写 verdict/signoff。 |
| veto checklist | S-redline coverage + check reports | future acceptance handoff script | `veto-checklist.md` | 由 06/治理确认否决项；脚本不自动清除。 |
| risk acceptance | Step 11/14 residual + source reports | future acceptance handoff script | `risk-acceptance.md` | 必须补接受角色、期限、触发条件；未接受保持 open。 |
| open issues | failed/blocked/incomplete slots and defects | future acceptance handoff script | `open-issues.md` | 核对没有把 blocked 写成 pass。 |
| reviewer/agent notes | acceptance set + selected raw refs | 人/Agent 独立撰写 | `reports/review/*` | 可标 reviewed/disputed；不覆盖 raw。 |

Step 9 已规划的两个 report script 是最低逻辑合同；实现阶段可将 evidence/acceptance stage 作为其显式子命令或新增脚本，但必须回写 05/07，不能临时在 `reports/` 中放生成器。

## 9. 失败、blocked、not-run 与重跑证据

| 情况 | 必须归档 | 禁止行为 |
|---|---|---|
| assertion failed | case/report、首失败 reason、redacted stdout/stderr、call/write/cleanup refs | 重跑覆盖原 run，或只保存修复后 pass。 |
| dependency blocked | blocker/slot/profile/未执行 TC、zero-effect assertion（若已执行负向） | fake fallback 后标真实 integration pass。 |
| not-run / harness failure | context、planned scope、未执行清单、safe infra reason、cleanup posture | 生成空 pass report 或 EV alias。 |
| timeout/flaky | 每次尝试的独立 run/ref、固定数据/seed refs、最后阶段、issue ref | 用最后一次成功覆盖首失败或挑选样本。 |
| redaction finding | safe finding category、受限原始材料处置 ref、scanner version/ref | 在报告回显命中值，或将 scanner unavailable 当 clean。 |
| cleanup failure/unknown | 残留类型/ref、ProtectionState/RecoveryCase、处置 owner | 删除受保护材料、把业务 pass 改成 clean success。 |
| report generation/link/pairing failure | partial output、missing paths、source digests、generator failure | 手写 evidence index/detail 补洞。 |
| superseding run | 新 run 独立全套材料 + predecessor/supersedes ref | 修改旧 artifact/status/digest。 |

## 10. Redaction、依赖与证据完整性门禁

| Check | 扫描面 | 阻断条件 | 安全输出 |
|---|---|---|---|
| redaction | machine artifacts、stdout/stderr、人读 reports、acceptance/review drafts | raw secret/token/credential/key/body/full sensitive ref/path/URL/PID/port/stack；scanner unavailable | forbidden category、count、safe issue/ref，不回显 value。 |
| dependency boundary | manifests/import graph/call graph/runtime binding declarations | sibling private source/backend、SDK bypass、direct DB/bus/private topic、Docker/Tauri/gVisor/Firecracker 假定 | dependency kind/source class/finding ref。 |
| evidence link | TC/CUT/suite/artifact/report/AC/run/digest | orphan/mismatched run、missing TC、wildcard machine refs、duplicate slot主归属 | missing/mismatch categories。 |
| report pairing | planned suite invocation and report/log/case sources | missing `report.json`/stdout/stderr、report 无 raw、raw 无 report | missing path/ref and suite status。 |
| no-static-evidence | index/item/detail/acceptance claims | slot/catalog/手写 JSON 直接生成 EV；`latest`；无 producer pair 的 pass | invalid claim category and source ref。 |

任一 check failed/unavailable 都使相关 evidence slot `incomplete` 或 run `failed/blocked`；check 自身是验证控制，当前未在 Step 6 定义独立 TC 时不自动生成新的正式 EV。

## 11. 保留、失效与删除 guard

| 类别 | 最低保留条件 | 可处置前必须满足 |
|---|---|---|
| acceptance candidate | 直到对应 06/治理审查结束且所有争议/风险有结论 | 有可追溯归档 owner 和处置记录。 |
| failure/retest | 直到缺陷关闭、复验完成、superseding run 可定位 | 失败与修复后证据均不丢失。 |
| disputed evidence | 直到争议关闭且 review record 固化 | 不得因新结果删除旧争议材料。 |
| invalidated/superseded evidence | 原材料 immutable，追加 invalidation/supersedes ref | 不回写旧 status/digest，不沿用旧 pass。 |
| local debugging output | 不进入正式 evidence 或 acceptance | 遵循安全清理；不得被正式索引引用。 |

当前没有正式 retention 数值 authority，不规定天数。未来 07/09 可选择物理存储、TTL 和归档策略，但不得越过上述条件式 guard；测试 artifact 保留与 Runner material/cache cleanup 是不同责任边界。

## 12. Planned slot 停审记录

| Slot 范围 | 审查点 | 结论 | 持续 blocker |
|---|---|---|---|
| 001～004 | selection/material/request/control 的 TC、suite、AC 和 truth separation | pass_for_design | Artifact/Governance/Sandbox/Runtime positive blocked。 |
| 005～008 | owner/resource/recovery/presentation 的 source/freshness/guard/redaction | pass_for_design | Runtime/platform/Observability/Archive seams blocked。 |
| 009～013 | Query/protocol/idempotency/UoW/entry 的 no-write/metadata/atomicity | pass_for_design | 实现仓/durable store blocked。 |
| 014～018 | Consumer/Job/config/observability/boundary 的 no-parse/report/readiness/event-zero | pass_for_design | positive Consumer、SDK exact surface、scripts blocked。 |

所有 slot 均有 CUT、计划 TC、producer suite、AC 和 alias pattern；任何真实 TC 未执行/blocked 都由运行时 status 表达，不从证据分母删除。

## 13. 跨证据真实性与追溯审计

| 审计项 | 结论 | 缺口/处理 |
|---|---|---|
| 18 个 P0 CUT 是否都有 slot | 通过 | 18/18 一一主归属。 |
| 108 个计划 TC 是否有归档路径 | 通过（设计层） | case JSON + suite report；运行时必须展开 ID。 |
| EV 是否可能在无 raw/report 时生成 | 无 | 不完整 slot 不分配 alias。 |
| failed/blocked/not-run 是否保留 | 通过 | status、blocker、未执行范围和 logs 均归档。 |
| evidence status 是否等于 pass | 否 | EV item 保留 actual status。 |
| artifact/report 是否可能跨 run 混用 | 禁止 | context/digest/link check 要求同 fixed run。 |
| `latest` 或 project 子路径 | 无 | 固定标准路径。 |
| redaction/依赖/pairing/no-static 是否闭合 | 通过（合同层） | checks 尚未实现，真实执行 blocked。 |
| 06/治理是否被自动报告越权 | 无 | acceptance 只初稿；review 不改 raw；verdict 后置。 |
| 保留天数是否被伪造 | 无 | 使用条件式 guard。 |

## 14. 结构化回填草稿

正式 §13 应收录：证据成熟度/生成链、18 slot 目录、machine artifact 和 report 目录、最小 schema、报告生成/审查映射、失败归档、redaction/dependency/link/pairing/no-static checks、条件式保留 guard 和真实性审计。正文必须明确当前无真实 run/artifact/report/evidence，planned slot 不能作为证据。

## 15. 待确认与持续 blocker

| 项 | 影响 | 当前处理 |
|---|---|---|
| artifact schema 物理格式、digest 算法、writer/reader、test runner (`RUN-DDD-001/002`) | 无法创建真实机器证据 | 最小逻辑字段已定；实现 authority 后回写 07/05。 |
| durable store/cache 与重启 parity (`RUN-DDD-003`) | UoW/replay artifact 只能语义化 | 不宣称 durable evidence。 |
| upstream/platform/SDK seams (`RUN-UP-001~008`) | 相关 slot positive evidence 不可生成 | runtime slot 保持 blocked/incomplete。 |
| retention/archival/production telemetry (`RUN-OPS-001/002`) | 物理 TTL、归档 owner、SLO report 未定 | condition-based guard；不造天数。 |
| 新版 06 (`RUN-DOC-002`) | AC/VETO 最终消费和裁决未完成 | AC refs 仅候选消费者；不生成 verdict/signoff。 |

## 16. Step 13 进入下一步门禁

- [x] 18 个 P0 切口和全部计划 TC 有 planned slot 与机器/报告归档路径。
- [x] Evidence 生成链要求真实 fixed-run case、suite report 和 checks；无静态 EV。
- [x] failed/blocked/not-run/timeout/flaky/cleanup failure 的保留规则完整。
- [x] Redaction、dependency、link、pairing、no-static-evidence checks 可判定。
- [x] Acceptance/review 仅补充交接与争议，不改 raw 或提前 verdict。
- [x] 保留规则使用条件式 guard，不发明 retention 数字。
- [ ] 目录、脚本、run、artifact、report、evidence index、EV、review、verdict、signoff：未创建/未执行，不作为本 Step 条件。

Step 13 完成，允许进入 Step 14；正式 `05-测试方案.md` 仍不可写。
