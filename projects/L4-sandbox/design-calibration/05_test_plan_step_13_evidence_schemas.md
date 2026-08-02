# Step 13 分件 A. 机器 Artifact 与 Evidence Index Schema

> 父Step: `05_test_plan_step_13_evidence.md`
> 标准来源: `设计真相源闭环与可落码性标准.md` §7.3~§7.5;`测试方案讨论流程_SOP.md` Step 13
> 生成日期: 2026-07-13
> 状态: reviewed_passed_to_step_14_with_step_14_metadata_writeback
> 边界: 本文定义planned local test DTO和JSON编码契约,不创建文件实例、run_id、EV alias、测试结果或验收结论。

---

## 1. Schema Owner与共享规则

| 对象 | Writer owner | Reader owner | 正式归属 |
|---|---|---|---|
| run meta | `scripts/gates/*`调用的planned test artifact writer | gate / report / check scripts | test-local DTO,不进入public contracts / domain |
| suite / case artifact | SUITE-001~016 planned harness | report generator、coverage / redaction / pairing checks | test-local DTO |
| check artifact | `scripts/checks/*` | gate summary、evidence index generator | test-local DTO |
| qualification artifact | SUITE-013 deterministic harness | P0Q gate、identity / cleanup / redaction checks | test-local DTO |
| evidence index | `generate_reports.sh --stage evidence` | report / acceptance draft generator、人 / Agent reviewer | report-local DTO |
| Markdown report | `scripts/reports/*` | 人 / Agent、新版`06` | derived output,不得反写raw |

具体实现文件与crate由`07-实施计划.md`定位。实现不得将这些schema写进`core-contracts`或sandbox业务truth模块。

### 1.1 Shared Enum闭集

| Enum | Values |
|---|---|
| `SbxArtifactStatus` | `Passed`,`Failed`,`Blocked`,`NotRunConditional`,`InfraFailed` |
| `SbxAssertionStatus` | `Passed`,`Failed`,`Blocked`,`NotEvaluated` |
| `SbxRedactionStatus` | `Clean`,`Failed`,`Blocked`,`NotEvaluated` |
| `SbxReviewStatus` | `Pending`,`Reviewed`,`Disputed` |
| `SbxExecutionRole` | `Primary`,`Supplemental` |
| `SbxReleaseSourceRole` | `MAIN-CONTRACT`,`MAIN-SEAM`,`OPS`,`P0Q` |
| `SbxRunIntent` | `Diagnostic`,`Baseline`,`Regression`,`DefectRetest`,`Qualification`,`ReleaseAggregation`,`Conditional` |
| `SbxRunScope` | `Diagnostic`,`Targeted`,`Family`,`Suite`,`P0C`,`P0Q`,`Release`,`Conditional` |
| `SbxEvidenceFamily` | `CONTRACT`,`INTAKE`,`BOUNDARY`,`POLICY`,`EXECUTION`,`SAFETY`,`READ`,`PROTOCOL`,`RELAY`,`REPLAY`,`CONSISTENCY`,`ERROR`,`CONFIG`,`CHANGE`,`AUDIT`,`ARCH`,`QUAL-BOUNDARY`,`QUAL-LIFECYCLE`,`QUAL-IDENTITY`,`REAL-LIKE`,`SCOPE` |
| `SbxGateId` | `GATE-SBX-PR`,`GATE-SBX-MAIN`,`GATE-SBX-OPS`,`GATE-SBX-P0Q`,`GATE-SBX-RELEASE`,`GATE-SBX-P1`,`GATE-SBX-SCOPE-REOPEN` |
| `SbxEnvironmentId` | `SBX-ENV-01`,`SBX-ENV-02`,`SBX-ENV-03`,`SBX-ENV-04`,`SBX-ENV-05`,`SBX-ENV-06`,`SBX-ENV-07` |
| `SbxProfileId` | `SBX-PROFILE-01`,`SBX-PROFILE-02`,`SBX-PROFILE-03`,`SBX-PROFILE-04`,`SBX-PROFILE-05`,`SBX-PROFILE-06`,`SBX-PROFILE-07` |
| `SbxFailureKind` | `Assertion`,`Infrastructure`,`Precondition`,`IdentityMismatch`,`Redaction`,`DependencyBoundary`,`Coverage`,`Pairing`,`Cleanup`,`Internal` |
| `SbxProductDisposition` | `Released`,`Blocked`,`Contained`,`HandoffPending`,`NotApplicable` |
| `SbxLabTeardownStatus` | `NotRequired`,`Succeeded`,`Failed` |
| `SbxRetentionClass` | `Diagnostic`,`P0Run`,`Qualification`,`FailureInvestigation`,`Acceptance` |

不得增加`Skipped`、`Partial`、`UnknownPass`或`Waived`来吞并Blocked / InfraFailed / NotRunConditional。业务对象的`PartialFailed`可以作为safe assertion输入,不能替代测试artifact status。

### 1.2 Digest与Canonicalization

- 所有JSON使用UTF-8、RFC 8785 JSON Canonicalization Scheme;`artifact_digest_algorithm`固定为`sha256`。
- `artifact_digest`格式固定为`sha256:<64 lowercase hex>`;计算对象是同一JSON对象删除顶层`artifact_digest`字段后的canonical bytes。
- 语义为集合的ID / ref数组必须去重并按UTF-8 code point升序;有业务顺序的assertion / source-run数组按manifest顺序保存。
- JSON number只允许schema声明的非负integer;timestamp使用RFC 3339 UTC字符串;路径使用相对仓根的`/`分隔且禁止`..`、absolute path和symlink escape。
- stdout、stderr、Markdown等非JSON文件不内嵌digest;引用它们的JSON保存对“redaction后实际存储bytes”的sha256。Markdown由writer固定UTF-8 + LF后计算bytes digest。
- 任一digest mismatch使对应check为Failed,不得重新计算后静默覆盖原artifact。

### 1.3 全局Forbidden字段

任何JSON、log或report均不得包含raw secret、token、private key、credential value、full sensitive ref、raw endpoint / topic、SQL、HTTP / SDK body、process output正文、external body、stack trace、artifact package body或observability ledger body。只允许typed / opaque ref、digest、stable code、低基数enum、safe count和redacted diagnostic ref。

## 2. `meta/context.json`

`schema_version = "sandbox.test.run-context.v1"`。

| Field | Req | Type /约束 |
|---|---:|---|
| `schema_version` | yes | fixed string |
| `run_id` | yes | nonempty string;不得为`latest` |
| `gate_id` | conditional | `SbxGateId`;仅`Diagnostic` intent必须省略,其他intent必填 |
| `run_intent` | yes | `SbxRunIntent` |
| `run_scope` | yes | `SbxRunScope` |
| `trigger_refs` | yes | sorted unique exact `RT-SBX-*` array;允许空的条件见下文 |
| `change_refs` | yes | sorted unique body-free immutable design / revision / defect refs;允许空的条件见下文 |
| `environment_id` | yes | `SbxEnvironmentId` |
| `profile_id` | yes | `SbxProfileId` |
| `release_source_role` | conditional | `SbxReleaseSourceRole`;只有可被RELEASE消费的source run必填,聚合器与其他run必须省略 |
| `subject_revision_ref` | yes | opaque revision ref |
| `config_generation_ref` | yes | opaque generation ref |
| `suite_refs` | yes | sorted unique `SUITE-SBX-*` array |
| `dataset_manifest_digest` | yes | sha256 string |
| `suite_manifest_digest` | yes | sha256 string |
| `retention_class` | yes | `SbxRetentionClass` |
| `started_at` | yes | RFC 3339 UTC |
| `parent_run_id` | no | prior diagnostic / failed run ref;不得覆盖parent |
| `artifact_root` | yes | exact `artifacts/test/<run_id>` |
| `report_root` | yes | exact `reports/runs/<run_id>` |
| `writer_version_ref` | yes | test artifact writer revision ref |
| `artifact_digest_algorithm` | yes | `sha256` |
| `artifact_digest` | yes | shared digest rule |

Cross-field规则:

- `Diagnostic`必须配`Diagnostic`且省略`gate_id`;`Baseline`可配`P0C`或`P0Q`,二者允许`trigger_refs` / `change_refs`为空,但仍须固定subject / config / manifest identity和正式`gate_id`。
- `Regression` / `DefectRetest`必须使用`Targeted`,`Family`,`Suite`,`P0C`,`P0Q`或`Release`,且两个ref数组均nonempty;`DefectRetest`还必须填写`parent_run_id`指向原失败 /阻塞run。
- `Qualification`必须配`P0Q`、`SBX-ENV-05 / SBX-PROFILE-05`且含`RT-SBX-017`;`ReleaseAggregation`必须配`Release`、`GATE-SBX-RELEASE`和聚合器`SBX-ENV-02 / SBX-PROFILE-02`;`Conditional`必须配`Conditional`和`SBX-ENV-06 / SBX-PROFILE-06`,三者的两个ref数组均nonempty。
- 只有未来可能被RELEASE消费的source run才允许填写`release_source_role`,并必须满足固定矩阵:`MAIN-CONTRACT` = `GATE-SBX-MAIN / SBX-ENV-02 / SBX-PROFILE-02`;`MAIN-SEAM` = `GATE-SBX-MAIN / SBX-ENV-03 / SBX-PROFILE-03`;`OPS` = `GATE-SBX-OPS / SBX-ENV-04 / SBX-PROFILE-04`;`P0Q` = `GATE-SBX-P0Q / SBX-ENV-05 / SBX-PROFILE-05`。不带该字段的diagnostic、PR、targeted或普通回归run不得事后升格为release source。
- `MAIN-CONTRACT`固定承载SBX-ENV-02中的SUITE-SBX-001~011 /014及MAIN checks和237条P0-C主结果;`MAIN-SEAM`固定承载SBX-ENV-03中的SUITE-SBX-005 /008 /010 /011 controlled seam补强。两者共享`GATE-SBX-MAIN`,但必须是两个不同`run_id`、两份context和两组profile-specific config identity,不得在一个run中声明两套ENV / PROFILE。
- ReleaseAggregation必须省略`release_source_role`;其`environment_id / profile_id`只标识聚合器和完整性check的执行组合,不声明该组合证明P0-C或P0-Q。证明效力只能来自evidence index中按`MAIN-CONTRACT / MAIN-SEAM / OPS / P0Q`顺序固定的四个`source_run_refs`。
- `change_refs`只保存opaque / formal ref,禁止保存diff body、commit message、secret、外部正文或free-form理由。范围理由由Step 14 trigger和正式追溯解释。
- intent / scope / trigger / change任一不一致时context schema失败,gate必须在suite launch前Blocked或InfraFailed,不得回填默认值。

## 3. Source与Config Identity

### 3.1 `meta/source-commits.json`

`schema_version = "sandbox.test.source-revisions.v1"`。

| Field | Req | Type /约束 |
|---|---:|---|
| `schema_version`,`run_id` | yes | fixed schema;same run ID |
| `design_revision_ref` | yes | design source commit / equivalent immutable ref |
| `subject_revision_ref` | yes | implementation subject immutable ref |
| `core_contracts_revision_ref` | yes | exact shared contracts immutable ref |
| `test_harness_revision_ref` | yes | suite / scripts immutable ref |
| `workspace_status_digest` | no | safe status digest,不得保存diff body |
| `artifact_digest_algorithm`,`artifact_digest` | yes | shared digest rule |

### 3.2 `meta/config-digest.json`

`schema_version = "sandbox.test.config-identity.v1"`。

| Field | Req | Type /约束 |
|---|---:|---|
| `schema_version`,`run_id` | yes | fixed schema;same run ID |
| `profile_id`,`environment_id` | yes | shared enums |
| `config_generation_ref` | yes | same as context |
| `redacted_effective_config_ref` | yes | body-free generated ref |
| `config_digest_algorithm`,`config_digest` | yes | `sha256`;redacted effective config canonical digest |
| `material_descriptor_digests` | yes | sorted array;empty when none,不得含raw ref / material |
| `artifact_digest_algorithm`,`artifact_digest` | yes | shared digest rule |

## 4. Suite与Case Artifact

### 4.1 `suites/<suite_id>/report.json`

`schema_version = "sandbox.test.suite-report.v1"`;Failed / Blocked / InfraFailed suite也必须写本文件。

| Field | Req | Type /约束 |
|---|---:|---|
| `schema_version`,`run_id` | yes | fixed schema;same run ID |
| `gate_id`,`suite_id` | conditional / yes | gate与context一致;仅Diagnostic context省略gate;exact suite ID |
| `environment_id`,`profile_id` | yes | shared enums |
| `subject_revision_ref`,`config_generation_ref` | yes | 与meta完全一致 |
| `status` | yes | `SbxArtifactStatus` |
| `expected_tc_refs`,`observed_tc_refs` | yes | sorted exact `TC-SBX-*` arrays;不得使用range / wildcard |
| `case_result_paths` | yes | sorted relative JSON paths |
| `counts` | yes | object: `expected`,`observed`,`passed`,`failed`,`blocked`,`not_run_conditional`,`infra_failed`,均u32 |
| `started_at`,`finished_at` | yes | RFC 3339 UTC |
| `duration_ms` | yes | u64 |
| `failure_kind`,`safe_failure_reason_ref` | conditional | 非Passed时必填;safe ref only |
| `stdout_digest`,`stderr_digest` | yes | redacted exact-bytes digest;零字节文件也必须记录 |
| `product_disposition_ref` | no | cleanup / containment safe artifact ref |
| `artifact_digest_algorithm`,`artifact_digest` | yes | shared digest rule |

### 4.2 `suites/<suite_id>/cases/<tc_id>/<parameter_id>.json`

`schema_version = "sandbox.test.case-result.v1"`。

| Field | Req | Type /约束 |
|---|---:|---|
| `schema_version`,`run_id`,`suite_id` | yes | fixed schema and IDs |
| `tc_id` | yes | exact formal `TC-SBX-*`;不得用自然语言 |
| `parameter_id` | yes | manifest-defined stable string |
| `execution_role` | yes | `Primary` or `Supplemental` |
| `layer` | yes | `L1`,`L2`,`L3`,`L4`,`L5`,`L6`,`Static` |
| `status` | yes | `SbxArtifactStatus` |
| `cut_refs`,`per_refs`,`dataset_refs` | yes | sorted exact ID arrays |
| `assertions` | yes | array of assertion objects,按assertion code排序 |
| `artifact_refs` | yes | array of `{path,digest}`,可为空 |
| `failure_kind`,`safe_failure_reason_ref` | conditional | 非Passed时必填 |
| `product_disposition`,`lab_teardown_status` | conditional | safety / qualification case必填,其他可省略 |
| `duration_ms` | yes | u64 |
| `artifact_digest_algorithm`,`artifact_digest` | yes | shared digest rule |

Assertion object字段固定为:`assertion_code` required string;`status` required `SbxAssertionStatus`;`expected_ref` required safe ref;`actual_ref` optional safe ref;`safe_detail_ref` optional;`failure_reason_ref`在Failed时required。禁止嵌入expected / actual正文。

## 5. Check与Safe Artifact

### 5.1 `checks/<check_id>.json`

`schema_version = "sandbox.test.check-result.v1"`。

| Field | Req | Type /约束 |
|---|---:|---|
| `schema_version`,`run_id`,`check_id` | yes | fixed schema;check ID来自Step 9脚本名 |
| `status` | yes | `SbxArtifactStatus` |
| `input_refs` | yes | sorted `{path,digest}` array |
| `finding_codes` | yes | sorted stable safe codes;empty allowed |
| `safe_finding_refs` | yes | sorted opaque refs;不得回显正文 |
| `failure_kind`,`safe_failure_reason_ref` | conditional | 非Passed时必填 |
| `artifact_digest_algorithm`,`artifact_digest` | yes | shared digest rule |

Meta-check artifact只验证证据真实性,不自动成为正式EV。若未来要为report audit分配EV,必须先在Step 6新增正式`TC-SBX-REPORT-*`或等价TC并重开Step 5 /9 /13。

### 5.2 `suites/<suite_id>/artifacts/<safe_name>.json`

`schema_version = "sandbox.test.safe-artifact.v1"`。

| Field | Req | Type /约束 |
|---|---:|---|
| `schema_version`,`run_id`,`suite_id` | yes | fixed schema;same run / exact suite ID |
| `artifact_name` | yes | manifest-owned safe file stem,必须与path一致 |
| `artifact_kind` | yes | manifest-owned closed kind string |
| `status` | yes | `SbxArtifactStatus` |
| `safe_refs` | yes | sorted unique opaque ref array;可为空 |
| `safe_summary` | no | schema-owned低基数object;禁止free-form map / body |
| `artifact_digest_algorithm`,`artifact_digest` | yes | shared digest rule |

`safe_summary`的具体kind字段必须由实现boundary中的manifest schema穷尽;未登记kind只能InfraFailed,不得用任意key绕过redaction。

## 6. Qualification Artifact

`suites/SUITE-SBX-013/qualification-result.json`使用`schema_version = "sandbox.test.qualification-result.v1"`。

| Field | Req | Type /约束 |
|---|---:|---|
| `schema_version`,`run_id`,`status` | yes | fixed schema;`SbxArtifactStatus` |
| `subject_revision_ref`,`candidate_ref`,`profile_id`,`config_generation_ref`,`environment_id` | yes | fixed packet identity;profile必须`SBX-PROFILE-05`,env必须`SBX-ENV-05` |
| `capability_digest`,`boundary_template_digest` | yes | sha256 strings |
| `provider_descriptor_digest` | conditional | material case适用时required,否则null |
| `preflight_check_ref` | yes | qualification identity check artifact |
| `probe_case_refs` | yes | exact CONF TC array |
| `probe_artifact_refs` | yes | sorted `{path,digest}` array |
| `product_disposition` | yes | `SbxProductDisposition` |
| `lab_teardown_status`,`lab_teardown_ref` | yes | status enum;Failed仍保留safe ref |
| `redaction_status` | yes | `SbxRedactionStatus` |
| `failure_kind`,`safe_failure_reason_ref` | conditional | 非Passed时必填 |
| `artifact_digest_algorithm`,`artifact_digest` | yes | shared digest rule |

任一identity缺失时status只能Blocked且`probe_case_refs`为空;不得填默认candidate或执行probe。

## 7. Evidence Index Schema

### 7.1 Root `evidence-index.json`

`schema_version = "sandbox.test.evidence-index.v1"`。

| Field | Req | Type /约束 |
|---|---:|---|
| `schema_version`,`run_id`,`gate_id` | yes | fixed schema / IDs |
| `status` | yes | `SbxArtifactStatus`;由items / missing slots / checks聚合 |
| `slot_catalog_version` | yes | reviewed Step 13 slot catalog immutable ref |
| `expected_slot_refs` | yes | sorted exact `ESLOT-SBX-*` array |
| `items` | yes | evidence item array;只由真实raw + report推导 |
| `missing_slot_refs` | yes | sorted slot array;empty才可Passed |
| `source_run_refs` | yes | 有业务顺序的source ref数组;RELEASE必须严格按`MAIN-CONTRACT / MAIN-SEAM / OPS / P0Q`,其他run必须为空 |
| `validation_check_refs` | yes | sorted `{check_id,path,digest,status}` array |
| `artifact_digest_algorithm`,`artifact_digest` | yes | shared digest rule |

每个`source_run_refs`元素必须具有以下字段,不得用单一模糊`digest`替代:

| Field | Type /约束 |
|---|---|
| `role` | `SbxReleaseSourceRole`;数组顺序固定 |
| `run_id` | nonempty且不得为`latest`;四项互不相同 |
| `gate_id` | 与role矩阵完全一致 |
| `environment_id`,`profile_id` | 与role矩阵及source context完全一致 |
| `subject_revision_ref`,`config_generation_ref` | 与source context完全一致 |
| `context_digest` | source `meta/context.json`的sha256 |
| `source_revisions_digest` | source `meta/source-commits.json`的sha256 |
| `config_identity_digest` | source `meta/config-digest.json`的sha256 |
| `evidence_index_digest` | source `evidence-index.json`的sha256 |

四个source的`design_revision_ref`,`subject_revision_ref`,`core_contracts_revision_ref`,`test_harness_revision_ref`必须逐项相同。由于四个role使用不同profile,`config_generation_ref`、config identity、dataset manifest与suite manifest不要求彼此相同;它们必须分别与各自source context和config artifact一致,并符合固定role矩阵。任何source缺失、顺序错误、role / gate / ENV / PROFILE错配、revision不一致或digest mismatch都使RELEASE为`Blocked`或`Failed`,不得删掉该source、改用PR /低profile / P1 run或把两个MAIN role拼成一个run。

`expected_slot_refs`必须按gate从已审查catalog投影:GATE-SBX-RELEASE的P0集合固定为ESLOT-SBX-001~019;只有conditional gate被真实触发时才加入适用的020 /021。未触发conditional slot不计`missing_slot_refs`,也不得补成Passed item。root只有在全部expected item、四个source run和validation check满足聚合规则时才可Passed。

### 7.2 Evidence Item

| Field | Req | Type /约束 |
|---|---:|---|
| `evidence_id` | yes at runtime | `EV-SBX-<FAMILY>-<NNN>`;只有真实producer pair存在才分配,`NNN`等于slot三位后缀 |
| `evidence_slot_id`,`family` | yes | exact planned slot / `SbxEvidenceFamily` |
| `status` | yes | `SbxArtifactStatus` |
| `suite_refs`,`tc_refs`,`per_refs`,`cut_refs`,`ac_refs` | yes | sorted exact ID arrays;`tc_refs`至少1个正式TC |
| `vf_refs`,`veto_refs` | yes | sorted arrays;无适用项时empty |
| `artifact_refs`,`report_refs` | yes | nonempty sorted `{path,digest}` arrays |
| `generated_from_check_refs` | yes | nonempty sorted exact prerequisite check refs,至少含pairing与redaction结论 |
| `redaction_status`,`review_status` | yes | shared enums |
| `artifact_digest_algorithm`,`artifact_digest` | yes | shared digest rule applied to this item object |

Slot catalog只能声明expected family / refs,不能静态生成item。一个slot在一个run内最多一个item;item必须聚合该slot全部有效raw / report refs后才分配alias。`tc_refs`必须从case JSON展开为逐个正式ID;range、wildcard、`all P0`、`representative`或manual audit文字均非法。

Item的`artifact_digest`按§1.2对Evidence Item对象删除自身`artifact_digest`字段后计算;root index digest在所有item digest形成后再计算。证据实例唯一键为`(run_id,evidence_id,artifact_digest)`。raw index初次写入的`review_status`固定Pending;Reviewed / Disputed只写独立review记录,不得回写或覆盖raw index。

## 8. Schema失败与停审

| 失败 | 必须结果 |
|---|---|
| required字段 / enum / schema version错 | report generator nonzero;对应gate InfraFailed |
| digest / path / run identity不匹配 | pairing / identity check Failed;禁止重写原文件 |
| suite缺`report.json` / `stdout.log` / `stderr.log`任一文件 | pairing Failed,保留missing path |
| forbidden marker命中 | redaction Failed;报告只保存safe finding ref |
| evidence item无正式TC / raw / report | no-static-evidence Failed;不分配EV alias |
| qualification identity缺失 | Blocked且0 probe / launch |

Schema停审结论:字段名、required / optional、enum、版本、digest、owner、失败保留和redaction均已闭合;具体文件尚不存在,全部`planned_not_implemented`。
