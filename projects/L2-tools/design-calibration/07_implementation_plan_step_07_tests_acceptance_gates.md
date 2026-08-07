# L2-tools 07 实施计划 Step 7：测试与验收门禁嵌入

## Step 状态

`accepted`

## 本步输入

| 输入 | 来源 | 用途 |
|---|---|---|
| phase/boundary | Step 5/6 | 逐阶段和逐提交绑定 selector。 |
| 234 concrete TC / 22 family | `05-测试方案.md` §6 | 唯一 semantic case denominator。 |
| 11 P0 suite / 11 check | `05` §9、§14 | CI/release closed set。 |
| 39 AC / 13 VF / 24 evidence gate | `06` §5、§9~§11 | 验收方向和 hard stop。 |
| 30 candidate slot | `05` §13、`06` §10.5 | evidence derivation，不是静态 evidence。 |

## SOP 问题回答

| 问题 | 回答 | 依据 |
|---|---|---|
| 测试何时实现？ | 与 owning boundary 同步实现 targeted TC；PH-11 只补 runner/report/check/release aggregation，不后补业务测试。 | 05 suite ownership。 |
| 每阶段如何对齐 AC？ | 用 concrete TC family -> candidate slot -> AC/VF 方向映射；不让 AC 文本替代 test oracle。 | 05 §5/§13、06 §5。 |
| 门禁失败能否继续？ | applicable P0 failed/invalid/missing、VF risk、redaction/dependency/phase/pair check 失败不得进入下一 boundary。 | 06 §4/§11。 |
| Evidence 何时成立？ | 只有真实 fixed run 的 raw/report/check/seal 可形成 instance；本计划只列路径与生成顺序。 | 05 §13、06 §10。 |
| 外部 positive blocked 如何处理？ | `blocked_dependency`/conditional，不缩减 local P0 denominator，不转换为 pass。 | 05 §2.3/§9.4。 |

## 当前材料问题诊断与取舍

| 议题 | 诊断 | 取舍 |
|---|---|---|
| 234 TC 全量逐 boundary 列出会形成重复真相源 | 05 已是唯一 case registry | boundary 绑定 family/range，执行期由 manifest 展开 exact TC。 |
| 11 suite 与 13 semantic suite 容易混淆 | conditional-provider、release-local-smoke 不属于 11 P0 owning suites | 固定 11 P0 + smoke aggregate；conditional 单列。 |
| candidate slot 可能被误写 evidence | slot 只有 planned identity | 所有 boundary ledger 明示 `not_created`。 |
| acceptance draft 容易被误当 verdict | generators 只能生成 review-required drafts | final verdict/signoff 仍由06 authority和授权角色产生。 |

## 结构化中间产物

### Suite 与 Check 固定集合

| 类别 | 固定集合 | 数量 |
|---|---|---:|
| P0 suite | `static-boundary`,`contract-domain`,`application-core`,`query-purity`,`entry-worker-job`,`transaction-concurrency`,`config-validator`,`config-assembly`,`observability-redaction`,`local-closure`,`controlled-seam` | 11 |
| release aggregate | `release-local-smoke` | 1（不新增 semantic TC） |
| conditional | `conditional-provider` | 1（P1/future） |
| mandatory checks | `check_case_manifest`,`check_dependency_boundary`,`check_profile_isolation`,`check_query_no_write`,`check_job_boundedness`,`check_phase_unknown_fence`,`check_outcome_audit_pair`,`check_redaction_boundary`,`check_blocker_truth`,`check_artifact_report_pairing`,`check_no_static_evidence` | 11 |

### Phase 门禁矩阵

| Phase | TC/fixture selector | Owning suites | AC/VF 方向 | Required checks seed | 失败处理 |
|---|---|---|---|---|---|
| PH-01 | FOUNDATION layout/dependency/config-root branches | static-boundary, config-validator | AC-024~030/032/033; VF-010/012/013 | case-manifest, dependency, profile, redaction, blocker, no-static | repo/path/dependency invalid -> pause |
| PH-02 | FOUNDATION-001~018, STATE-001~012, TX/CONC/ERR foundations | contract-domain, transaction-concurrency | AC-024~030/033/038; VF-002/011 | manifest, dependency, phase, pair, redaction | field/state/UoW conflict -> wait_design |
| PH-03 | CONTRACT-001~008, QUERY-001~002, related STATE/TX | application-core, query-purity | AC-006~008; VF-002/011 | query, pair, phase, manifest | history/current/replay failure blocks |
| PH-04 | BIND-001~008, QUERY-003 | application-core, controlled-seam, query-purity | AC-009~011; VF-003/005/012 | blocker, dependency, profile, query | registry/default/visibility inference hard stop |
| PH-05 | INV-001~008, PRE-001~010, TX-003~004, CONC-010~014 | application-core, controlled-seam, transaction-concurrency | AC-012~018; VF-004~006/009 | phase, pair, blocker, profile | default allow/host/blind retry hard stop |
| PH-06 | OUTCOME-001~010, HANDOFF-001~008, CONT subset, OBS | application-core, transaction-concurrency, observability-redaction | AC-019~022/037~039; VF-006~009/011 | pair, phase, redaction, blocker | half pair/body/delivery inference hard stop |
| PH-07 | QUERY-001~011, CONC-016~017 | query-purity, contract-domain, observability-redaction | AC-023~025/031; VF-009/010 | query, redaction, manifest | any write/refresh/repair hard stop |
| PH-08 | CONSUMER-001~005, CONT-001~004, TX/CONC entry branches | entry-worker-job, controlled-seam, transaction-concurrency | AC-016/018/021/022/029; VF-006/009~011 | phase, pair, redaction, blocker | receipt/re-entry/second effect failure blocks |
| PH-09 | JOB-001~004, CONC-013~017 | entry-worker-job, transaction-concurrency, query-purity | AC-023/025/031/038; VF-009/010 | job, query, phase, blocker | unbounded/repair/replan blocks |
| PH-10 | CFG-001~007, all CFG-T/A/F/X | config-validator, config-assembly, static-boundary | AC-024~030/032/035/036; VF-005/008/012/013 | profile, dependency, blocker, redaction | invalid/high fallback/partial graph blocks |
| PH-11 | all 234 TC, 11 P0 suites + smoke, 11 checks, VETO-001~013 | all P0 suites + release-local-smoke | all AC-001~039, VF-001~013, EG-001~024 | all 11 | missing/non-pass retains no eligibility/verdict |

### Boundary Gate Matrix

| Boundary | Primary selector / dataset direction | Test/AC focus | Evidence state before real run |
|---|---|---|---|
| `commit-01-a` | FOUNDATION workspace/dependency; DS-FOUNDATION | layout/name/Core-only/Rustdoc | `not_created` |
| `commit-01-b` | CFG-001/007 and path/schema fixtures | strict roots/no-static/path | `not_created` |
| `commit-02-a` | FOUNDATION-001~018 contract subset | carrier/codec/body-free/Rustdoc | `not_created` |
| `commit-02-b` | STATE-001~012 + pure ERR | legal/illegal/terminal | `not_created` |
| `commit-02-c` | TX-001~010, CONC foundation | UoW/CAS/replay/fake parity | `not_created` |
| `commit-03-a` | CONTRACT-001~002, QUERY-001 | identity/definition/read | `not_created` |
| `commit-03-b` | CONTRACT-003~008, QUERY-002, STATE evolution | impact/adopt/retire/history | `not_created` |
| `commit-04-a` | BIND-001~004 | relation/ref/body-free guards | `not_created` |
| `commit-04-b` | BIND-005~008, QUERY-003 | Hub blocked seam/CAS/no-refresh | `not_created` |
| `commit-05-a` | INV-001~008, QUERY-004 | canonical invocation/admission/no-execution | `not_created` |
| `commit-05-b` | PRE-001~004, ERR-007~008 | auth fail-closed | `not_created` |
| `commit-05-c` | PRE-005~010, TX-003~004, CONC-010~014 | Prepared/one-call/unknown | `not_created` |
| `commit-06-a` | OUTCOME-001~010, TX pair | source/result/error/atomic audit | `not_created` |
| `commit-06-b` | HANDOFF-001~004, OBS redaction | four gates/body-free material | `not_created` |
| `commit-06-c` | HANDOFF-005~008, CONT subset | local attempt/status independence | `not_created` |
| `commit-07-a` | QUERY foundation/page/visibility fixtures | no-write infrastructure | `not_created` |
| `commit-07-b` | QUERY-001~006 | core read surfaces | `not_created` |
| `commit-07-c` | QUERY-007~011, CONC-016~017 | projection/report/watermark | `not_created` |
| `commit-08-a` | CONSUMER-001/002/004/005 | header/claim/receipt/blocked source | `not_created` |
| `commit-08-b` | CONSUMER-003, CONT-001~004 | CF-11 re-entry/event one-call | `not_created` |
| `commit-09-a` | JOB protocol/codec fixtures | public bounded surface/replay carrier | `not_created` |
| `commit-09-b` | JOB-001~004, CONC-013~017 | bounded target/report/no-repair | `not_created` |
| `commit-10-a` | all CFG-T/A/F/X | strict load/V0~V8/B0 preconditions | `not_created` |
| `commit-10-b` | config-assembly + entry binding fixtures | B0~B8/controlled adapter parity | `not_created` |
| `commit-11-a` | all case/check/evidence schema fixtures | 234 manifest/raw/report/pairing | `not_created` |
| `commit-11-b` | VETO-001~013 + release aggregate | 30 slot/seal/projection/handoff draft | `not_created` |

每个 boundary 的 Build Gate 至少包括 `cargo fmt --check`、affected package `cargo check/test`、`git diff --check` 和适用静态检查；exact command 只能在目标仓存在后由 implementation ledger 记录实际值与输出。

### Evidence 与报告生成顺序

```text
real fixed run + context
  -> suite case/journal/stdout/stderr raw
  -> suite report JSON + human suite report
  -> pre-check evidence-index.json (derivation only)
  -> required checks + redaction scan
  -> release-only acceptance staging and fixed projection manifest
  -> gate-summary.json final eligibility
  -> human review records
  -> future 06 decision/signoff
```

| 规则 | 固定口径 |
|---|---|
| raw root | `artifacts/test/<run_id>`；禁止项目子目录和 `latest`。 |
| human report | `reports/runs/<run_id>`，必须回指同 run raw/digest。 |
| candidate | 30 个 `EV-CAND-L2T-*` slot 只由同 run concrete TC 派生。 |
| acceptance draft | 只能 `draft/review_required`，不得预填 verdict/signoff/accepted risk。 |
| failure | failed/blocked/cancelled/invalid materials retained；新 run 不覆盖旧 run。 |

### 门禁停审与跨覆盖审计

| 审计项 | 结论 | 说明 |
|---|---|---|
| 234 concrete TC owner | pass-designed | 每 family 有 owning suite，theme 不新增 TC。 |
| 11 P0 suite + smoke | pass-designed | release aggregate 不复制 case。 |
| 11 checks | pass-designed | release/main/nightly exact closed set；不能动态裁剪。 |
| 39 AC / 13 VF | pass-designed | phase/boundary 有方向映射；VF 全为 hard stop。 |
| 24 evidence gates | pass-designed | PH-11 覆盖 EG-001~024；业务 boundary 覆盖前置 truth。 |
| evidence attribution | pass-designed | same-run raw/report/index/seal，无 static/cross-run。 |
| current execution facts | 0 | 无 run、result、artifact、evidence、verdict、signoff。 |

## 回填草稿

正式 07 §7 应承接 suite/check 固定集合、phase 门禁矩阵、boundary selector/evidence 状态、生成顺序和失败纪律；具体 TC schema 继续引用正式 05/06，不复制为第二 registry。

## 待确认事项与进入下一步条件

| 事项 | 状态 | 截止点 |
|---|---|---|
| target repo exact test commands | pending | PH-01/每 boundary 开工。 |
| conditional provider positive | blocked | owner closure + explicit profile + new run。 |
| real release evidence | not_created | PH-11 after all lower gates。 |

- [x] 每个 phase/boundary 有 selector、suite、AC/VF/check 方向。
- [x] evidence path、writer order、failure behavior 无歧义。
- [x] 未把 planned slot/path 写成 evidence instance。
