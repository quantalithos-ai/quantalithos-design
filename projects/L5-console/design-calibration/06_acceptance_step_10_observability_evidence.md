# Step 10. 定义可观测性、审计与证据门禁

> 对应 SOP：`standards/document/验收标准讨论流程_SOP.md` Step 10  
> 回填章节：`06-验收标准.md` §10 可观测性、审计与证据门禁

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 10 可观测性、审计与证据门禁 |
| 当前状态 | `done / pass / self_reviewed` |
| 输入基线 | 正式 03 §14～§15；正式 05 §9～§13；05 Step 13；Step 3～9 |
| 输出文件 | `design-calibration/06_acceptance_step_10_observability_evidence.md` |
| 逐项范围 | 八个 future EV family、固定 run reports、acceptance handoff/review |
| 当前 evidence instance | 0；全部 `not_created` |
| 下一动作 | 只允许进入 Step 11 |

## 2. 本步计划与目标

本步依次区分客户端诊断、owner 正式 audit/evidence、测试 artifact/report、验收 handoff/signoff 四种主语；再逐个审查八个 EV family 的来源、资格、证明上限、P0 映射和缺失影响；最后审计 report 完整性、acceptance handoff 与静态造证据风险。

本步不生成 evidence instance、不执行测试、不填写 digest/run_id，也不将文档自审转换为执行结果。

## 3. 本步输入

| 输入 | 本步用途 |
|---|---|
| `03` §14 | body-free client diagnostics 与 formal audit/evidence 分离 |
| `03` §15 | 十模块、5+16+1、状态/一致性/配置/a11y 的 planned test cuts |
| `05` §9 | suites、gates、checks、report scripts 的 planned contract |
| `05` §10 | diagnostic/redaction/NFR 专项与禁止解释 |
| `05` §13 / Step 13 | artifact/report/evidence 分工、目录、字段、八 EV families |
| Step 3 | baseline manifest、fixed paths、禁止 `latest` |
| Step 5～9 | 功能、红线、接口、状态与 NFR 的 evidence 消费方 |

## 4. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 哪些行为必须有 audit record？ | Console 不生成正式 audit record。若 owner 正式提供 audit/evidence/report ref，Console 只验证安全显示与回链；Console 自身受控意图必须由测试 evidence 证明 phase/ref 保真，不能用 diagnostic 替代 owner audit。 |
| 哪些行为必须有 trace/log/metric？ | 验收不强制完整 trace/raw log。允许 body-free correlation ref、枚举、低基数计数/时长 sample；关键 P0 由 case artifact、call ledger、suite report 和 digest 证明。 |
| 哪些测试报告必须归档？ | fixed run 的 summary、gate-results、evidence-index、redaction-check、report-pairing、所有 in-scope suite reports、八类适用 EV detail，以及 acceptance handoff/VETO/open-issues；存在 residual 时 risk-acceptance。 |
| 证据缺失是否导致不通过？ | 未进入前导致 `not_entered/blocked`；进入后缺 P0 artifact/report/EV/pair/digest 使送验无效或门禁失败，不得通过/有条件通过。 |
| 如何复查？ | 从 `reports/runs/<run_id>/evidence-index.md` 定位 EV→TC→suite report→raw artifact/digest，并核对 baseline、redaction、pairing、review status。 |
| evidence index 是否覆盖全部 P0 EV？ | 未来必须覆盖八个 family 的适用 instance 和全部 in-scope P0 TC；当前文件不存在，不能回答“是”。 |
| gate-results 是否覆盖 release gate？ | 未来必须覆盖 05 定义的全部 P0/release suites/checks；当前不存在。 |
| redaction-check 是否证明无 raw secret/body？ | 未来必须覆盖 raw artifact 和 reports，且不得回显命中值；当前不存在。 |
| handoff 是否经审查？ | 当前不存在。未来自动 draft 之后必须由人/Agent 审查，不得自动 signoff/readiness。 |
| VETO checklist 是否覆盖全部否决？ | 未来必须覆盖 `VETO-CON-001～007`；当前不存在，Step 11 固定逐项要求。 |
| risk acceptance 是否支撑有条件通过？ | 只有逐项包含 evidence、owner、acceptor、deadline/trigger、follow-up 并经审查时才可；当前不存在。 |
| 每个 P0 EV 是否能回指 TC/suite/artifact/report/AC/VETO？ | 合同层能，见 §8.2；执行层当前不能，因为无 instance。 |
| 是否逐项停审并做跨证据审计？ | 是，见 §8.5～§8.6；“pass”只指设计自审。 |

## 5. 当前文档问题诊断

| 旧问题 | 本步处理 |
|---|---|
| API response、DB record、空 checklist 作为证据 | 改为 fixed-run TC/suite/artifact/report/digest/EV 闭环 |
| diagnostic、owner audit、test evidence、signoff 混为一体 | 四种主语明确分离 |
| `[]` 或静态 Markdown 可默认通过 | no-static-evidence 与人工审查硬门禁 |
| 未保留失败/blocked | 失败 run 永久保留；blocked/not_run 不贡献 positive |
| report/release 被解释为 readiness | 明确 `EV-RELEASE-001` 上限只到交付证据完整性 |

## 6. 改动前后对比

| 项 | 旧 | 新 | 原因 |
|---|---|---|---|
| 证据根 | API/DB/自由附件 | `artifacts/test/<run_id>` + `reports/runs/<run_id>` | 可定位与配对 |
| Evidence ID | 无/空占位 | 八个稳定 future family + run-bound instance | 可追溯 |
| 审计 | 客户端日志可替代 | owner audit ref 与 client diagnostic 分离 | truth ownership |
| Handoff | 空表 | fixed review version + 人/Agent 审查 | 防自动签署 |
| 失败材料 | 可被最新成功覆盖 | 新 run、保留失败、显式关联 | 事实完整性 |

## 7. 验收裁决取舍

| 议题 | 裁决 |
|---|---|
| 是否要求 DB snapshot/owner evidence body | 否；Console 无所有权，P0 以公开接缝和 body-free refs 证明 |
| diagnostic emit receipt 能否作为 audit/evidence | 否 |
| EV family 名是否等于已有 instance | 否；必须有 fixed run、suite、TC、artifact/report 和 digest |
| blocked/not_run 是否可计 positive | 否；只能保真记录 blocker/residual |
| release suite 全绿是否自动验收通过 | 否；仍需 AC/VETO/defect/risk/signoff 裁决 |
| acceptance draft 是否可自动签署 | 否；脚本只能生成待审草稿 |
| 是否可手工补缺失 EV | 否；缺 raw source/pair/digest 必须失败或重跑 |

## 8. 结构化中间产物

### 8.1 四类观测/审计/证据主语

| 主语 | 所有者 | 可证明 | 不可证明 |
|---|---|---|---|
| client diagnostic | Console | 客户端 phase、safe outcome、owner/topic key、body-free correlation、sink posture | owner audit、evidence、业务完成、合规、readiness |
| owner audit/evidence/report ref | 相应正式 owner | 引用存在且当前可见的 owner 结果关系 | Console 自有证明、正文内容正确性、客户端 verdict |
| test artifact/report/EV | Console 测试交付链 | 固定实现/baseline/run 下的测试事实和门禁结果 | owner truth、风险接受、signoff、production readiness |
| acceptance handoff/verdict/signoff | 验收责任角色 | 对已固定范围、证据、缺陷和风险的正式裁决 | 未列范围、未来 facet 或生产 authority 自动成立 |

### 8.2 八个 Evidence family 门禁

共同资格：instance 必须含 `schema_version/run_id/evidence_id/suite/tc_refs/status/artifact_path/artifact_digest/report_path/report_digest/config_profile/source_refs/ac_refs/veto_refs/blocker_refs/redaction_status/pairing_status/review_status`，且路径同 run、TC 为正式 ID、source refs 与 Step 3 baseline 一致。

| Evidence family | 必需 TC / suite 来源 | 证明上限 | 通过资格 | 缺失/失败影响 |
|---|---|---|---|---|
| `EV-UNIT-001` | UNIT candidate；pure-contract、config/state/diagnostic pure cuts | pure object/state/config/diagnostic assertions | 所有 in-scope UNIT TC 有 raw/report/digest，失败/blocked 保真 | P0 unit-backed AC 不可裁决；阻断 |
| `EV-FLOW-001` | FLOW candidate；module-flow/recovery | client flow、Query no-write、recovery phase | in-scope FLOW TC 与 call ledger 真实配对 | 功能/协议/recovery P0 不可通过 |
| `EV-CONTRACT-001` | CONTRACT candidate；port-adapter/config/state | narrow Port/adapter/config/state parity | contract TC 使用固定 approved/fake/formal source；conditional 标记保真 | safety contract 缺失阻断；positive blocked 不可冒充 |
| `EV-INTEGRATION-001` | INTEGRATION candidate；controlled-composition/concurrency | controlled composition、race、partial failure | deterministic scheduler/ledger、partition/correlation 与 reports 配对 | isolation/concurrency P0 不可通过 |
| `EV-ACCESSIBILITY-001` | ACCESSIBILITY candidate；semantic-a11y + selected（若 required） | semantic a11y；selected 时仅覆盖声明 matrix | core semantic TC 全部合格；selected matrix 按 baseline | semantic 缺失/失败→VETO-006；非required selected 只 residual |
| `EV-SECURITY-001` | SECURITY candidate；redaction-boundary/module/release redaction | disclosure/redaction/forbidden-body/authority negatives | synthetic corpus、no echo、minimum disclosure、redaction scan 均合格 | 失败→S/VETO 候选；总体不通过 |
| `EV-ARCH-001` | ARCH candidate；architecture-static/release dependency | SDK-only、5+16+1/0/0、forbidden dependency/unit/write inventory | generated graph/registry/call ledger 与 delivery source ref 一致 | 失败→S/VETO-001/004 候选 |
| `EV-RELEASE-001` | RELEASE candidate；release suites/checks/report-pairing | fixed-run release safety/config/redaction/dependency/report 完整性 | 全部 required release gate 有真实 source/pair/digest，no-static-evidence 合格 | 送验无效/阻断；不等 readiness |

### 8.3 P0 Evidence 追溯

| P0 范围 | TC families | 必需 EV families | AC/VETO 入口 | 固定 report |
|---|---|---|---|---|
| context/navigation/access | CTX/NAV/SEC/A11Y | UNIT/FLOW/SECURITY/ACCESSIBILITY/INTEGRATION | AC-CON-001～002、AC-FR-001～002、VETO-002/006 | evidence-index + module-flow/a11y/redaction suite reports |
| views/queries | VIEW/ADAPTER/ARCH | FLOW/CONTRACT/SECURITY/ARCH | AC-CON-003、AC-FR-003、VETO-001/004/005 | evidence-index + module/port/architecture reports |
| intents/commands | INTENT/STATE/CONSISTENCY | UNIT/FLOW/CONTRACT/INTEGRATION/SECURITY | AC-CON-004、AC-FR-004、VETO-002/003 | evidence-index + flow/port/concurrency reports |
| topics | TOPIC/RECOVERY/SEC | FLOW/INTEGRATION/SECURITY | AC-CON-005、AC-FR-005～010、VETO-005/007 | evidence-index + composition/recovery/redaction reports |
| recovery/a11y | RECOVERY/A11Y | UNIT/FLOW/INTEGRATION/ACCESSIBILITY/SECURITY | AC-CON-006、AC-FR-011～012、VETO-003/006 | evidence-index + recovery/a11y reports |
| state/consistency | STATE/CONSISTENCY | UNIT/FLOW/CONTRACT/INTEGRATION | AC-BR/DR/NFR state groups、VETO-002/003/005/007 | evidence-index + concurrency/composition reports |
| config/diagnostic | CONFIG/DIAG/SEC | UNIT/CONTRACT/INTEGRATION/SECURITY/RELEASE | AC-NFR-003/006、VETO-002/004/005 | evidence-index + config/redaction/release reports |
| architecture/release | ARCH + all required release checks | ARCH/RELEASE/SECURITY | boundary AC、all VETO support | evidence-index + gate-results + pairing/redaction |

### 8.4 Report 完整性与 handoff 检查

| 检查项 | 固定路径 | 通过条件 | 失败影响 |
|---|---|---|---|
| raw root | `artifacts/test/<run_id>/` | meta、suite report/cases、safe logs/attachments（如有）与 digest 完整 | 送验无效 |
| run summary | `reports/runs/<run_id>/summary.md` | baseline/run/suite/failed/blocked/residual 保真 | 阻断 review |
| gate results | `reports/runs/<run_id>/gate-results.md` | 全部 required P0/release gates 有真实 status/source | 不通过/送验无效 |
| EV index | `reports/runs/<run_id>/evidence-index.md` | 八类适用 EV 无 orphan，逐 TC/AC/VETO 回指 raw/report/digest | 不可裁决 |
| EV detail | `reports/runs/<run_id>/evidence/EV-<TYPE>-<NNN>.md` | 与 index/instance/run/digest 一致，证明上限不越界 | 对应 EV 无资格 |
| redaction | `reports/runs/<run_id>/redaction-check.md` | artifact/report 无 forbidden material，检查器不回显命中值 | S/VETO-004 候选 |
| pairing | `reports/runs/<run_id>/report-pairing.md` | 无 run mismatch、orphan、缺 blocking suite/digest | S/送验无效 |
| handoff | `reports/acceptance/handoff.md` | baseline、范围、enabled facets、failed/blocked/residual 和 review version 完整并审查 | 不得进入最终裁决 |
| VETO checklist | `reports/acceptance/veto-checklist.md` | 七项逐项有 evidence/结论；无静态默认 pass | 不得通过 |
| risk acceptance | `reports/acceptance/risk-acceptance.md` | 有条件通过时逐项完整并签署；无 residual 可明确 N/A | 缺失则不得有条件通过 |
| open issues | `reports/acceptance/open-issues.md` | blocker/residual/defect/owner/trigger 与 evidence 一致 | review 不完整 |
| review notes | `reports/review/reviewer-notes.md` / `agent-review.md` | 记录完整性、争议和审查，不改 raw outcome | 未审查 draft 不得签署 |

### 8.5 Evidence / Report 逐项停审记录

| 对象 | 来源真实可生成合同 | TC/suite/artifact/report 闭环 | 证明上限清楚 | 当前 instance | 设计停审 |
|---|---|---|---|---|---|
| `EV-UNIT-001` | yes | yes | yes | none | pass |
| `EV-FLOW-001` | yes | yes | yes | none | pass |
| `EV-CONTRACT-001` | yes | yes | yes | none | pass |
| `EV-INTEGRATION-001` | yes | yes | yes | none | pass |
| `EV-ACCESSIBILITY-001` | yes | yes | semantic/selected separated | none | pass |
| `EV-SECURITY-001` | yes | yes | yes | none | pass |
| `EV-ARCH-001` | yes | yes | yes | none | pass |
| `EV-RELEASE-001` | yes | yes | no readiness/signoff | none | pass |
| run reports | yes | raw/report/pair/digest | yes | none | pass |
| acceptance handoff/review | yes | derived + human/Agent review | no auto signoff | none | pass |

### 8.6 跨证据裁决审计

| 审计项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 八 family 是否全部有正式 TC 来源 | pass | 8/8；report audit 使用正式 CONFIG/ARCH/RELEASE TC/check 合同，不发明 TC |
| 是否存在 orphan EV / orphan P0 TC | none in design | future pairing/report audit 必须执行 |
| candidate/family/instance 是否混同 | no | 三层明确分开 |
| blocked/not_run 是否贡献 positive | no | 保真但不计 pass |
| static JSON/Markdown 是否可造 evidence | no | no-static-evidence hard gate |
| report 是否可修改 raw outcome | no | 只派生与解释 |
| client diagnostic 是否冒充 audit/evidence | no | 四主语分离 |
| owner body/DB snapshot 是否被要求 | no | 仅 safe ref，不越权 |
| acceptance draft 是否自动 signoff | no | 必须审查和角色签署 |
| `EV-RELEASE` 是否冒充 readiness | no | 证明上限固定 |
| 路径是否与 03/05/标准一致 | pass | raw/run/acceptance roots 一致 |
| 当前 evidence 是否被伪造 | no | instance=0，实际验收未进入 |

## 9. 回填草稿

正式 §10 应先区分四类主语，再列八个 evidence family 门禁、P0 追溯和 report/handoff 完整性检查。正文必须声明当前 evidence instance 为 0，路径与 ID 是 future contract；缺 fixed-run pair/digest、redaction、pairing 或 human/Agent review 时不得进入最终裁决。

## 10. 待确认事项

| 事项 | 影响 | 当前处理 |
|---|---|---|
| artifact JSON exact schema/digest algorithm/canonicalization | 实现/证据互操作 | 07/实现前需固定；当前不填假值 |
| retention 天数/介质 | 长期复验与合规 | authority 待定；至少保留到验收/复验关闭 |
| 实际 reviewers/signers | handoff/signoff | 实际验收填写 |
| owner audit/evidence safe-ref contracts | 正向展示 | `CON-Q-037/042` pending |

## 11. 下一步门禁

| 条件 | 结果 |
|---|---|
| 八 EV family 逐项资格与上限闭合 | pass |
| report/handoff 固定路径与失败影响完整 | pass |
| 四类主语无混同 | pass |
| 跨证据审计无 unresolved 冲突 | pass |
| 允许进入 Step 11 | yes |
| 当前 evidence instance | 0 |
| 允许修改正式 06 | no |
