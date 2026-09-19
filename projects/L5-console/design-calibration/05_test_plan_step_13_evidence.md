# Step 13. 定义测试报告与证据归档

> 对应 SOP：`standards/document/测试方案讨论流程_SOP.md` Step 13
> 回填章节：`05-测试方案.md` §13
> 粒度参考：`projects/L1-governance/design-calibration/05_test_plan_step_13_evidence.md`
> 状态：`done / pass / self_reviewed`

## 1. 本步目标与事实边界

本 Step 定义未来测试运行如何从固定 run 的机器 artifact 生成可读 report，再形成可被新版 06 引用的正式 evidence 条目。当前只建立归档合同：目标实现仓、脚本、run、artifact、report、evidence instance、测试结果、验收 verdict、signoff 和 readiness 均不存在。

`EV-CAND-*` 只是 Step 5～10 的候选槽；本 Step 的 `EV-UNIT-001` 等是 future evidence family contract，也不是已有证据。具体实例必须由 `run_id + evidence_id + suite + artifact_digest + report_digest` 唯一定位，且只能从真实 artifact/report pair 推导。

## 2. 规则来源与输入

| 来源 | 本步使用 |
|---|---|
| 测试方案 SOP Step 13、书写规范 §5.13 | 固定目录、报告、证据、审查、停审与真实性审计 |
| Step 5～6 | 96 个唯一 TC、八类 `EV-CAND-*`、AC 与七项 VETO 追溯 |
| Step 7～8 | deterministic data、run/case 隔离、环境/profile 与 zero-secret 边界 |
| Step 9 | suite/gate/check/report 脚本、固定 artifact/report root 与禁止 `latest` |
| Step 10～12 | 专项证据、失败保留、缺陷复验和进出准则 |
| 正式 00～04 | owner truth、协议、状态、错误、配置和安全红线 |

Console 不拥有 owner audit/evidence/report truth。因此不要求数据库快照、owner 正文、Policy/Gate 理由、审批正文、完整 trace、credential 或业务 payload；只允许 body-free safe refs、枚举、计数、digest、执行关系和安全失败原因。

## 3. SOP 问题回答

| 问题 | 收口回答 |
|---|---|
| 每类测试输出什么？ | 每个已执行 suite 输出 `report.json`、case results、redacted stdout/stderr（若产生）和安全附件；report 脚本生成 suite report、run summary、gate results、redaction/report-pairing 结果与 evidence index。 |
| 保存在哪里？ | raw=`artifacts/test/<run_id>/`；run report=`reports/runs/<run_id>/`；送验草稿=`reports/acceptance/`；人/Agent 补充=`reports/review/`。 |
| 如何关联 TC 与验收？ | evidence entry 必含 TC、suite、artifact/report path 与 digest、AC/VETO refs、profile、结果姿态和 blocker refs。 |
| 是否保留日志、trace、DB snapshot？ | 仅保留经扫描的 body-free stdout/stderr 与 safe correlation ref；不要求 DB snapshot、完整 trace 或 owner evidence body。 |
| 保留多久？ | 至对应候选验收和相关缺陷复验关闭；具体天数等待正式归档 authority，不在 Console 自造。 |
| 哪些报告自动生成？ | run/suite/gate/pairing/redaction/evidence candidate 和 acceptance draft；自动生成不得写 signoff/readiness。 |
| 哪些需人/Agent？ | acceptance handoff、VETO checklist、risk acceptance、open issues 与 review notes 必须审查；审查不能补造 raw artifact。 |
| 失败 suite 是否归档？ | 是；保留失败结果和 safe reason，但不得贡献 positive pass 或被重跑覆盖。重跑使用新 run_id。 |
| 如何禁止静态造证据？ | evidence index 必须验证 artifact/report pair、run/suite 一致性和 digest；手写表、suite 名、静态 JSON 或 report-only 条目无证据资格。 |

## 4. Artifact 与 Report 分工

| 载体 | 负责 | 不负责 |
|---|---|---|
| raw artifact | 记录固定 run 的 suite/case/assertion、call ledger、safe failure 与 digest | 人类解释、验收裁决、owner truth |
| run report | 从 raw artifact 汇总覆盖、失败、blocker、pairing 和 redaction | 修改 raw outcome、补造缺失 case |
| evidence index | 绑定 EV family、TC、suite、artifact/report、digest、AC/VETO | 静态宣告 pass、替代 artifact |
| acceptance draft | 组织送验引用、风险与开放项 | 自动 signoff、VETO verdict、readiness |
| review note | 记录人/Agent 对完整性、解释和争议的审查 | 改写测试结果或 owner 事实 |

## 5. Planned 脚本合同

| Planned script | 输入 | 输出 | 必须失败的条件 |
|---|---|---|---|
| `scripts/reports/generate_console_reports.sh` | 显式 run/artifact/report root | run summary、suite reports、gate results | 缺 artifact、schema/run/suite 不一致、root 越界 |
| `scripts/reports/build_console_evidence_candidates.sh` | raw suites + generated reports | run-bound candidate index | 无 artifact source、无 report pair、digest 缺失、静态 EV |
| `scripts/reports/build_console_acceptance_draft.sh` | run reports + candidate index + risks | acceptance handoff drafts | 写入 pass/signoff/readiness、遗漏 failed/blocked/residual |
| `scripts/checks/check_console_report_pairing.sh` | artifact/report roots + suite manifest | pairing report | orphan artifact/report、run mismatch、blocking suite 缺失 |
| `scripts/checks/check_no_static_evidence.sh` | generated index/reports | static-evidence report | 手写 EV/VETO pass、无源映射、report-only evidence |
| `scripts/checks/check_console_redaction.sh` | artifact/report roots + deny rules | body-free scan report | raw secret/body/full ref/stack/free text 泄露；禁止回显命中值 |

以上路径均为 `planned / not_created`。脚本只能生成事实材料或待审草稿，不能生成验收裁决。

## 6. 目录合同

### 6.1 Artifact 目录树

```text
artifacts/test/<run_id>/
  meta/context.json
  meta/config-digest.json
  meta/source-refs.json
  evidence-index.json
  suites/<suite>/report.json
  suites/<suite>/stdout.log
  suites/<suite>/stderr.log
  suites/<suite>/cases/<tc_id>.json
  suites/<suite>/attachments/<safe_name>.<ext>
```

### 6.2 Report 目录树

```text
reports/
  runs/<run_id>/
    summary.md
    gate-results.md
    evidence-index.md
    redaction-check.md
    report-pairing.md
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

`<run_id>` 必须是显式、不可变的执行标识；正式引用禁止 `latest`、移动别名或无 run 路径。当前不创建这些目录或任何实例文件。

## 7. Future Evidence Family 与字段合同

| Future evidence family | 候选来源 | 未来证明范围上限 |
|---|---|---|
| `EV-UNIT-001` | `EV-CAND-UNIT-001` | pure object/state/config/diagnostic assertions |
| `EV-FLOW-001` | `EV-CAND-FLOW-001` | client module flow、Query no-write、recovery flow |
| `EV-CONTRACT-001` | `EV-CAND-CONTRACT-001` | narrow Port/adapter/config/state contract parity |
| `EV-INTEGRATION-001` | `EV-CAND-INTEGRATION-001` | controlled composition、race、partial failure |
| `EV-ACCESSIBILITY-001` | `EV-CAND-ACCESSIBILITY-001` | semantic a11y；不自动证明具体 browser/AT 兼容 |
| `EV-SECURITY-001` | `EV-CAND-SECURITY-001` | disclosure/redaction/forbidden-body/authority negatives |
| `EV-ARCH-001` | `EV-CAND-ARCH-001` | SDK-only、surface count、forbidden dependency/units |
| `EV-RELEASE-001` | `EV-CAND-RELEASE-001` | 固定 run 的 release suite/check/report 完整性；不等 readiness |

每个未来 evidence instance 至少包含：`schema_version`、`run_id`、`evidence_id`、`suite`、`tc_refs`、`status`、`artifact_path`、`artifact_digest`、`report_path`、`report_digest`、`config_profile`、`source_refs`、`ac_refs`、`veto_refs`、`blocker_refs`、`redaction_status`、`pairing_status`、`review_status`。路径必须落在同一 run；digest 算法由未来实现合同固定，当前不虚构值。

`status` 记录测试事实（如 passed/failed/blocked/not_run），不是验收 verdict；`review_status` 只能记录证据完整性审查，不得写 business approval/readiness。

## 8. TC → Suite → EV → AC/VETO 追溯

| TC 范围（共 96） | Primary suite/check | Future EV | 后续 AC / VETO |
|---|---|---|---|
| `TC-CTX-001～005`;`TC-NAV-001～004` | pure-contract/module-flow/semantic-a11y | UNIT/FLOW/SECURITY/ACCESSIBILITY | `AC-CON-001～002`;`AC-FR-001～002`;VETO-002/006 |
| `TC-VIEW-001～009` | module-flow/port-adapter/redaction | FLOW/CONTRACT/SECURITY | `AC-CON-003`;`AC-FR-003`;VETO-001/004/005 |
| `TC-INTENT-001～011` | module-flow/port-adapter/concurrency | UNIT/FLOW/CONTRACT/INTEGRATION | `AC-CON-004`;`AC-FR-004`;VETO-002/003 |
| `TC-TOPIC-001～012` | controlled-composition/recovery/release safety | FLOW/INTEGRATION/SECURITY | `AC-CON-005`;`AC-FR-005～010`;VETO-005/007 |
| `TC-RECOVERY-001～005` | recovery-matrix/module-flow | UNIT/FLOW/INTEGRATION/SECURITY | `AC-CON-006`;`AC-FR-011～012`;VETO-003/006 |
| `TC-A11Y-001～004` | semantic-a11y/selected-browser-at | ACCESSIBILITY | `AC-CON-006`;`AC-NFR-007`;VETO-006；004 blocked |
| `TC-ADAPTER-001～006` | port-adapter/architecture/concurrency | CONTRACT/FLOW/INTEGRATION/SECURITY | AC-FR-003～005；VETO-001/004；006 blocked |
| `TC-STATE-001～008` | pure-contract/module-flow/concurrency | UNIT/FLOW/CONTRACT/INTEGRATION | AC-BR/DR/NFR state groups；VETO-002/003/005 |
| `TC-CONSISTENCY-001～008` | concurrency-race/controlled-composition | FLOW/INTEGRATION | `AC-NFR-001～002/004～006`;VETO-003/007 |
| `TC-DIAG-001～004`;`TC-SEC-001～005` | redaction-boundary/module-flow | UNIT/INTEGRATION/SECURITY | `AC-NFR-003～006`;VETO-001～005/007 |
| `TC-CONFIG-001～011` | config-redline/release-config/redaction | UNIT/CONTRACT/INTEGRATION/SECURITY/RELEASE | AC-NFR/config consumers；VETO-002/004/005 |
| `TC-ARCH-001～004` | architecture-static/release-dependency/report audit | ARCH/RELEASE | boundary AC；VETO-001/004 |

表中 EV 简写均指本 Step §7 的 `EV-*-001`。conditional/blocked TC 只能形成 blocked/not-run evidence，不得贡献 positive AC/VETO pass。

## 9. 人 / Agent 审查与失败 Suite 归档

| 审查对象 | 自动步骤 | 人/Agent 必审 | 不得做 |
|---|---|---|---|
| suite report | 由 raw case 汇总 | 失败解释、遗漏 case、blocker posture | 手改结果为 pass |
| evidence index | pairing/redaction/static checks | TC/AC/VETO 追溯与争议 | 无 raw source 补录 EV |
| acceptance draft | 从固定 run 抽取 | 风险接受角色、开放项、送验范围 | 自动 signoff/readiness |
| review notes | 无 | 记录完整性审查和分歧 | 替代新版 06 裁决 |

失败 suite 必须保留 `report.json`、已执行 case JSON、redacted stdout/stderr（若产生）、safe failure reason、gate status、artifact/report digest 与缺陷引用。失败材料与通过材料位于各自固定 run；重跑不得覆盖旧 run，也不得用“最后一次成功”隐藏失败历史。

## 10. 禁止路径、禁止引用与安全边界

| 禁止项 | 原因 | 正确方式 |
|---|---|---|
| `artifacts/test/<project>/<run_id>` | 重复项目层级 | `artifacts/test/<run_id>` |
| `reports/<project>` 或 `reports/latest` | 不可稳定复查 | `reports/runs/<run_id>` |
| 脚本写在 `reports/` | 工具与输出混淆 | `scripts/reports/*` |
| report-only/static JSON/手写 EV | 无真实执行来源 | artifact/report pair + digest |
| raw secret/token/key/credential/body/stack/full ref | 边界与泄露风险 | body-free enum/ref/digest/safe reason |
| DB snapshot、owner audit/evidence body | Console 无所有权且 P0 不需要 | owner-provided safe reference only |
| diagnostic receipt 或 `production-pending` 作为 evidence | phase/事实越界 | 只记录诊断隔离或 pending posture |

## 11. 跨证据真实性与追溯审计

| 审计项 | 结论 | 依据 / 修正 |
|---|---|---|
| 96 个 TC 是否都有 evidence 归档路径 | pass（planned） | §8 覆盖全部 14 family；conditional 保持 blocked |
| 八个 candidate 是否 1:1 收口 | pass | §7；candidate 与 formal future family 分离 |
| 每个 EV 是否要求固定 run、suite、artifact/report、digest | pass | §7 字段合同 |
| 是否存在 orphan/duplicate/static EV | pass | 当前无 instance；未来 pairing/no-static check 阻断 |
| failed suite 是否保留且不伪 pass | pass | §9 |
| redaction/dependency/report pairing 是否纳入证据资格 | pass | §5、§7、§10 |
| 是否要求 DB snapshot/owner body | pass | 明确不要求且禁止归档 |
| AC/VETO 是否由 05 提前裁决 | pass | 只提供引用；新版 06 裁决 |
| 是否出现真实 run/artifact/report/evidence/verdict | pass | 当前均不存在；所有路径和 ID 为 future contract |

## 12. 回填草稿与门禁

正式 §13 应回填 artifact/report/evidence 分工、planned 脚本、目录树、八个 future EV family、字段合同、TC→suite→EV→AC/VETO 追溯、失败归档、人/Agent 审查、禁止路径及真实性审计。

> 校准来源：`design-calibration/05_test_plan_step_13_evidence.md`
>
> 延伸阅读：建议继续阅读本文件的“目录合同”“Future Evidence Family 与字段合同”“TC → Suite → EV → AC/VETO 追溯”“人 / Agent 审查与失败 Suite 归档”和“跨证据真实性与追溯审计”。

| 进入 Step 14 条件 | 结论 |
|---|---|
| 所有 P0/blocked TC 有 run-scoped 归档合同 | pass |
| artifact/report/evidence/acceptance 边界清楚 | pass |
| 失败、redaction、pairing、static-evidence 规则可判定 | pass |
| 无 orphan EV、静态造证据或提前验收裁决 | pass |

Step 13 `done / pass / self_reviewed`；未创建实现仓、脚本、run、artifact、report、evidence instance、verdict、signoff 或 readiness。
