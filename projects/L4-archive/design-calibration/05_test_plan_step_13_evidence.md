# Step 13. 定义测试报告与证据归档

> 对应 SOP：`standards/document/测试方案讨论流程_SOP.md` Step 13
> 正式回填：`05-测试方案.md` §13
> 日期：2026-09-13
> 状态：`completed / planned_evidence_schema_closed_no_instances / continue_authorized`

## 1. Step 状态与 Step 内计划

| 项 | 结论 |
|---|---|
| 目标 | 定义 raw artifact、human report、planned EV registry、machine schema、digest/redaction、真实性检查和未来 06 handoff |
| 输入 | 05 Step 5～12；测试方案书写规范 §4.4/4.6/5.13；真相源标准 §7；目录规范 §9～10 |
| gate_status | `completed / planned_evidence_schema_closed_no_instances` |
| gate_reason | machine schema、writer/reader、19 个 planned EV family、18 CUT/102 TC 映射、fixed-run 路径、脱敏与真实性审计均已闭合；当前证据实例仍为 0 |
| next_allowed_action | 按连续授权创建并完成 Step 14；保留本 Step 停审记录，不生成任何真实证据实例 |
| source_files | 05 Step 5/6/9～12；测试方案书写规范 §5.13；真相源标准 §7；目录组织规范 §9～10 |

| 批次 | 产物 | 状态 | 完成门禁 |
|---|---|---|---|
| 13A | 证据语义、路径、成熟度和 owner | done | raw/report/review 职责不混同 |
| 13B | machine DTO/enums/digest/schema | done | 每个 JSON 的字段、类型、值域、writer/reader 闭合 |
| 13C | 19 个 planned EV family 与 CUT/TC/suite/06 映射 | done | 无 orphan EV/TC、candidate alias 可消解 |
| 13D | report/目录/redaction/retention | done | fixed run、failure output、无 `latest`/secret/body |
| 13E | 逐证据停审与跨证据真实性审计 | done | no static evidence、无伪实例/验收事实 |

## 2. 本步输入与证据事实边界

| 输入 | 本 Step 承接 |
|---|---|
| Step 5 | F/BR/NFR/VETO→CUT→TC→`EV-CAND-AR-*` 双向追溯 |
| Step 6 | 102 个正式 planned TC，含 REPORT-001/002 与 VETO-001～005 |
| Step 9 | 13 suites、5 gates、14 scripts、fixed artifact/report roots |
| Step 10 | 结构性 NFR、故障/安全/观测专项与证明上限 |
| Step 11 | failed/fixed run、复验和关闭证据合同 |
| Step 12 | local/formal/release entry/exit，required blocked lane 不可删除 |
| 标准 | machine schema/digest、报告成熟度、路径、redaction 与 TC traceability |

本 Step 可以登记 planned `EV-AR-*` 稳定 ID 和可落码 schema，但不创建证据实例。只有未来真实 runner/gate 对固定 `<run_id>` 写出 raw artifact，且 report/check 从同一 run 校验通过后，才存在带状态的 evidence instance。静态 Markdown 表、空 JSON、fake formal result、手工勾选、日志存在和本文件本身都不是 EV。

## 3. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 每类测试输出什么证据？ | suite report、逐 case result/assertion、redacted stdout/stderr、安全专项 artifact、raw evidence index；再由 report scripts 生成同 run human report/EV detail。 |
| 保存在哪里？ | raw 固定 `artifacts/test/<run_id>/`；human report 固定 `reports/runs/<run_id>/`；交接初稿在 `reports/acceptance/`；审查补充在 `reports/review/`。 |
| 如何关联用例和验收？ | 每个 raw evidence item 显式列出正式 `TC-AR-*` 数组、suite、proof level、artifact refs/digests、report path、requirement/VETO refs；未来 06 回填 `acceptance_refs`。 |
| 必须保留哪些材料？ | context、suite report、case JSON、stdout/stderr refs、failure reason ref、evidence index、gate/report/redaction/dependency/pairing/blocked-lane outputs；不要求 raw DB/body dump。 |
| 证据保留多久？ | 当前没有正式保留时长 authority；至少在送验与相关缺陷复验处置前不可自动清除，最终期限/删除依据转 06/治理/实施运维，不能私造数字。 |
| 失败 suite 是否产出？ | 是，尽最大可能保留 context、report.json、已执行 cases、redacted stdout/stderr、safe failure ref；writer 自身失败记 infrastructure_failed，不能伪造完整输出。 |
| 哪些脚本生成报告？ | `generate_reports.sh` 生成 run/suite/gate 摘要，`generate_evidence_index.sh` 生成 human index/EV pages，`generate_acceptance_handoff.sh` 生成交接初稿；均只读 fixed-run raw。 |
| 人/Agent 审查什么？ | 失败解释、limitation、blocked lanes、VETO/TC/EV 链、残余风险与交接语义；不得改写 raw status/digest 或自行判 acceptance。 |
| 如何证明脱敏？ | synthetic canary + `check_redaction.sh` 同时扫描 raw/report；scanner 输出也遵守 safe schema，不保存 canary 原值。 |
| 如何防静态造证据？ | raw index writer 只接受同 run、digest 可复核的 suite/case artifact；`check_no_static_evidence.sh`、link/pairing/blocked-lane checks 全部阻断 release。 |
| 正式 EV 是否现在存在？ | planned ID registry 存在；真实 instance 为 0。`EV-CAND` 只作前序设计槽位，不能被报告当实例。 |
| AC 如何处理？ | 正式 06 尚未重建，不发明 AC ID。当前保存 00 §14/VETO/requirement refs，`acceptance_refs=[]`；06 完成后按正式映射填充。 |
| Bundle digest 与测试 artifact digest 是否相同？ | 否。测试 artifact content hash 只保护 runner 输出文件；不得作为 Bundle integrity/signature、业务 idempotency digest、owner proof 或 `AR-UP-004` 关闭证明。 |

## 4. Historical material 诊断与改动前后对比

| 历史/旧口径 | 问题 | 当前处置 |
|---|---|---|
| `[待定 CI artifacts / reports/archive-test]` | 路径不符合当前标准且不可复核 | fixed `artifacts/test/<run_id>` / `reports/runs/<run_id>` |
| snapshot/digest/custody 日志即证据 | 使用旧对象且无 TC/raw/report 链 | 19 个正式 EV family，逐项绑定当前 TC/CUT/suite |
| `latest` 或跨 run 汇总 | 可替换、不可重放 | 每个 instance 绑定单一 fixed run；聚合显式列 source runs |
| 只列字段名 | writer/reader 会自行发明 enum/digest | 定义 exact schema/version/field/type/value/canonicalization |
| report generator 写回 raw pass | 人类报告可篡改机器状态 | raw writer 与 report reader 单向分离 |
| 签名/digest 成功 | `AR-UP-004` 未闭合 | 只定义测试文件 content hash；不生成 Bundle digest/signature |

| 项 | 改动前 | 改动后 |
|---|---|---|
| EV | 候选标签 | 19 个 planned formal family + future run instance |
| raw | 路径和最小方向 | 五类 exact JSON schema + redacted log refs |
| report | 目录占位 | capability→index shell→EV pages→handoff 成熟度 |
| 验收 | 旧 06/手工说明 | 只提供 requirement/VETO refs；AC 留正式 06 |
| 真实性 | 靠审阅 | digest、pairing、redaction、no-static、blocked-lane checks |

## 5. 证据设计取舍

1. 按 18 CUT 建证据族，另设 `EV-AR-VETO-001` 聚合五类一票否决；一个 EV family 可包含多个逐 TC instance，但 `tc_refs` 必须展开为实际正式 ID。
2. `EV-CAND-AR-ASSESS/BUNDLE/GOVERNANCE/BOUNDARY/RECOVERY/TRACE-*` 是 Step 5 的语义分组，不新增第二套正式 EV；在 §6.8 映射到 19 个 registry ID。
3. raw evidence index 由未来 gate finalizer / raw index writer 生成，report scripts 只读 raw；避免 human report 反写机器真相。
4. JSON content hash 使用本 Step 独立的 test-artifact schema 与算法，不复用 Archive Bundle digest。算法实现库、KMS、签名和长期验证 provider 不在本文选择。
5. status 是测试执行状态，不复用 Archive 业务 `Partial/Unknown/Committed`；业务姿态只能进入 safe assertion actual category。
6. P0 不允许 `skipped`。runner 原生 skip 必须规范化为 `not_run` 并使 gate 不通过；formal prerequisite 缺失规范化为 `blocked`。

## 6. 结构化中间产物

### 6.1 路径、职责与证据流

```text
[test runner / gate writer]
       |
       v
artifacts/test/<run_id>/        immutable raw after finalization
       |
       +--> [raw index finalizer + digest/redaction/link checks]
       |
       v
[scripts/reports/* read-only]
       |
       v
reports/runs/<run_id>/          human summaries + EV detail pages
       |
       +--> reports/acceptance/* draft
       +--> reports/review/* human/Agent notes
       |
       v
[future 06 consumes; decides verdict/risk/signoff]
```

关键说明：箭头单向；report/review 不修改 raw。一个 EV instance 只能引用一个 raw run；多 run 交接只在 handoff 中列清单。当前所有目录、脚本和输出均为 planned，不存在真实实例。

| 角色 | 未来职责 | 禁止 |
|---|---|---|
| suite runner | 写 case/raw/log，尽力写失败材料 | 写验收 verdict、伪造未执行 assertion |
| gate writer | 写 context/suite aggregate，规范化 status | blocked/infra/not_run→passed |
| raw index finalizer | 复核同 run refs/digests 后写 `evidence-index.json` | 从静态测试清单直接造 qualified evidence |
| report generators | 只读 raw，生成 human report/index/EV pages/handoff draft | 修改 raw、选择 `latest`、补造 missing result |
| checks | 产生自身 raw case/report并影响 gate | 输出 raw canary/secret/body |
| human/Agent reviewer | 补充解释、争议、风险与交接备注 | 改 raw status/digest、代表 06 签署 |
| 正式 06 | 消费真实 EV instance，定义 AC/VETO/verdict/risk acceptance | 反向改变测试事实 |

### 6.2 Machine schema 全局词汇

所有 JSON owner 是未来测试基础设施本地 DTO，不进入 Archive public contracts/domain/business schema。

| 类型 / enum | exact 定义 |
|---|---|
| `ArchiveTestSchemaVersion` | string，唯一支持值 `archive.test-artifact.v1` |
| `ArchiveTestRunId` | string；1～128 ASCII `[a-z0-9][a-z0-9._-]*`；不得等于/包含路径段 `latest`，不得含 `/`,`\\`,`..` |
| `ArchiveTestExecutionStatus` | `passed`,`failed`,`blocked`,`infrastructure_failed`,`not_run` |
| `ArchiveTestAssertionStatus` | `passed`,`failed`,`not_run` |
| `ArchiveTestProofLevel` | `local_contract`,`controlled_integration`,`formal_seam`,`measured` |
| `ArchiveTestRedactionStatus` | `clean`,`failed`,`not_run` |
| `ArchiveTestQualification` | `qualified`,`unqualified`,`blocked`,`not_evaluated` |
| `ArchiveTestReviewStatus` | `pending`,`reviewed`,`disputed` |
| `ArchiveTestDigestAlgorithm` | 唯一支持值 `sha256`；仅 test artifact content hash |
| `ArchiveTestDigest` | string `sha256:` + 64 个小写十六进制字符 |
| `ArchiveTestRelativePath` | artifact/report root 内 POSIX 相对路径；非空，不得以 `/` 开头，不得含空段、`.`、`..`,`latest` |
| `ArchiveTestSafeRef` | 非空 opaque safe string；不得嵌入 secret/body/endpoint/SQL/stack/provider response |
| `ArchiveTestUtcTimestamp` | RFC 3339 UTC 字符串，必须以 `Z` 结尾；来自真实 runner clock |

状态聚合顺序固定为：任一 `infrastructure_failed`→suite/gate `infrastructure_failed`；否则任一 `failed`→`failed`；否则任一 required `blocked`→`blocked`；否则任一 required `not_run`→`not_run`；只有 required case 全部 `passed` 才能 `passed`。业务 `Partial/Unknown/CommitUnknown` 不参与此 enum，必须作为 assertion 的 safe actual category。

### 6.3 Test artifact digest 与 canonical JSON

每个 JSON artifact 都必须包含 `artifact_digest_algorithm="sha256"` 与 `artifact_digest`。计算规则固定：

1. 解析时拒绝 duplicate key、无效 UTF-8、非有限数、浮点数和 schema 未声明字段；schema 中所有数值均为非负十进制整数。
2. 计算副本仅移除最外层 `artifact_digest` 字段，保留 `artifact_digest_algorithm`；不得移除嵌套文件引用 digest。
3. 递归按 Unicode code point 升序排列 object key；array 保持写入顺序；整数用最短十进制；boolean/null 用 JSON 小写字面量。
4. string 按 JSON 标准转义 `"`、`\\` 与 U+0000～U+001F，其他有效 Unicode 直接 UTF-8；不做 Unicode normalization。
5. 输出无空白、无 BOM、无尾换行的 UTF-8 bytes，计算 SHA-256，编码为 `sha256:<lowercase hex>`。

非 JSON `stdout.log` / `stderr.log` 先以 redacted UTF-8 原始 bytes 计算同格式 hash，digest 由 suite report 的 `log_refs` 引用；log 本身不内嵌 digest。任何 digest 缺失/不匹配使 evidence `unqualified`、gate failed；它不能关闭 `AR-UP-004`，也不能充当 Bundle manifest/integrity/signature 字段。

### 6.4 通用嵌套 DTO

| DTO | exact fields |
|---|---|
| `ArchiveTestIssue` | `category` required finite string；`issue_ref` optional `ArchiveTestSafeRef`；`related_blocker_refs` required sorted unique string array；禁止 free-text/raw value |
| `ArchiveTestFileDigestRef` | `path: ArchiveTestRelativePath`,`artifact_digest_algorithm: sha256`,`artifact_digest: ArchiveTestDigest`,`redaction_status: ArchiveTestRedactionStatus` |
| `ArchiveTestAssertion` | `assertion_id` required stable string；`status: ArchiveTestAssertionStatus`；`expected_category` required finite string；`actual_category` required finite string；`design_refs` required non-empty sorted unique strings；`issue_ref` optional safe ref |
| `ArchiveTestCaseDigestRef` | `case_id: TC-AR-*`,`path: ArchiveTestRelativePath`,`artifact_digest: ArchiveTestDigest` |
| `ArchiveEvidenceArtifactRef` | `path: ArchiveTestRelativePath`,`artifact_digest: ArchiveTestDigest`,`kind` one of `case`,`suite`,`log`,`safe_specialist`,`check` |

数组除明确保留执行顺序的 `assertions` 外，writer 必须按稳定 ID/path 升序去重；reader 发现顺序或重复不合规则拒绝，不自行修复。

### 6.5 Machine artifact 文件 schema

共同规则：以下每个对象都必须有 `schema_version`、`artifact_digest_algorithm`、`artifact_digest`；required array 可以为空但不能缺失，optional 仅限表中明确标为 optional 的字段。时间与 source ref 必须来自实际执行，不允许文档默认值。

#### 6.5.1 `meta/context.json` — `ArchiveTestRunContextArtifact`

| field | required | type / value | source / rule |
|---|---:|---|---|
| `schema_version` | yes | `archive.test-artifact.v1` | writer constant |
| `run_id` | yes | `ArchiveTestRunId` | gate input；全 run 相同 |
| `repository` | yes | safe lowercase repo name | actual checkout metadata |
| `source_revision` | yes | `ArchiveTestSafeRef` | actual immutable implementation source ref |
| `design_revision` | yes | `ArchiveTestSafeRef` | actual immutable design source ref |
| `branch_ref` | no | `ArchiveTestSafeRef` | safe branch ref；不替代 revision |
| `config_profile` | yes | finite profile string | validated effective profile |
| `config_identity_ref` | yes | `ArchiveTestSafeRef` | redacted/pinned identity；不含 config body |
| `suite_ids` | yes | sorted unique string array | selected suites |
| `started_at` / `finished_at` | yes | `ArchiveTestUtcTimestamp` | runner clock；finish >= start |
| `generated_by` | yes | `ArchiveTestSafeRef` | exact gate writer/script version ref |
| `artifact_root` | yes | exact `artifacts/test/<run_id>` | relative repository path；run must match |
| `report_root` | yes | exact `reports/runs/<run_id>` | planned counterpart |
| `issues` | yes | `ArchiveTestIssue[]` | safe only |
| digest fields | yes | §6.3 | content hash only |

`meta/context.json` 不保存 endpoint、ENV dump、secret ref body、dirty diff、host/user identity、provider response。若实际 source/design revision 无法确定，gate 不得运行到 qualified evidence。

#### 6.5.2 `suites/<suite>/cases/<case_id>.json` — `ArchiveTestCaseArtifact`

| field | required | type / value | source / rule |
|---|---:|---|---|
| `schema_version` | yes | fixed | writer constant |
| `run_id` / `suite_id` / `case_id` | yes | run、suite、exact `TC-AR-*` | invocation + static registry；case must exist in Step 6 |
| `proof_level` | yes | `ArchiveTestProofLevel` | suite configuration |
| `status` | yes | `ArchiveTestExecutionStatus` | normalized actual execution |
| `started_at` / `finished_at` | yes | UTC timestamps | actual runner clock |
| `duration_ms` | yes | u64 | derived from monotonic duration；不作 SLO 判定 |
| `config_profile` / `config_identity_ref` | yes | finite string / safe ref | pinned run context |
| `data_set_refs` | yes | non-empty sorted unique `DS-AR-*` | exact case fixture set |
| `design_refs` | yes | non-empty sorted unique strings | formal 03/04 sections |
| `requirement_refs` / `veto_refs` | yes | sorted unique arrays | F/BR/NFR and V1～V5 as applicable |
| `assertions` | yes | non-empty `ArchiveTestAssertion[]` in declared order | actual assertions；not_run uses a single not_run prerequisite assertion |
| `issues` | yes | safe issue array | blocked/failure reason as category/ref |
| `safe_artifact_refs` | yes | sorted `ArchiveTestFileDigestRef[]` | optional produced specialist files; empty allowed |
| digest fields | yes | §6.3 | exact case JSON digest |

`passed` 要求所有 assertions passed、redaction clean且没有 blocking issue；`blocked` 必须至少关联一个开放 blocker；`infrastructure_failed` 必须有 safe harness issue；`not_run` 不得带伪 actual result。

#### 6.5.3 `suites/<suite>/report.json` — `ArchiveTestSuiteReportArtifact`

| field | required | type / value | source / rule |
|---|---:|---|---|
| `schema_version`,`run_id`,`suite_id` | yes | fixed/run/string | context + selected suite |
| `proof_level` / `status` | yes | exact enums | configuration + §6.2 aggregate |
| `case_refs` | yes | sorted `ArchiveTestCaseDigestRef[]` | every required/selected case，含 blocked/not_run |
| `required_case_count`,`passed_case_count`,`failed_case_count`,`blocked_case_count`,`infrastructure_failed_case_count`,`not_run_case_count` | yes | u64 | must sum exactly to case_refs length |
| `started_at`,`finished_at`,`duration_ms` | yes | timestamp/u64 | actual run |
| `config_profile`,`config_identity_ref` | yes | string/safe ref | context exact match |
| `command_ref` | yes | `ArchiveTestSafeRef` | safe command/script invocation ref，不含 secret args |
| `exit_code` | no | i32 | process started 时 required；未启动 blocked/not_run 时 omitted |
| `log_refs` | yes | exactly stdout/stderr `ArchiveTestFileDigestRef[]` when process started; otherwise empty | redacted logs；path under same suite |
| `issues` / `related_blocker_refs` | yes | safe issues / sorted IDs | actual limitation |
| `redaction_status` | yes | exact enum | scan result；formal qualification requires clean |
| digest fields | yes | §6.3 | suite report hash |

P0 suite `passed` 只允许 required_case_count > 0、全部 required cases passed、logs/safe outputs redaction clean。失败 writer 若来不及生成完整 report，由 gate 写最小 `infrastructure_failed` report，禁止猜 case status。

#### 6.5.4 `evidence-index.json` — `ArchiveTestEvidenceIndexArtifact`

| field | required | type / value | source / rule |
|---|---:|---|---|
| `schema_version`,`run_id`,`source_revision`,`design_revision`,`config_identity_ref` | yes | context exact values | raw finalizer copies after digest verification |
| `gate_status` | yes | `ArchiveTestExecutionStatus` | §6.2 aggregate over required suites/lanes |
| `suite_refs` | yes | sorted suite report digest refs | all required and selected suites |
| `evidence_items` | yes | sorted `ArchiveTestEvidenceItem[]` by evidence_id | only registry IDs; empty allowed before qualified execution |
| `unresolved_blocker_refs` | yes | sorted unique IDs | union from required blocked lanes |
| `redaction_status` | yes | exact enum | aggregate checks |
| `generated_at` / `generated_by` | yes | UTC/safe writer ref | actual finalizer |
| `issues` | yes | safe array | orphan/schema/digest/pairing failures |
| digest fields | yes | §6.3 | index hash |

`ArchiveTestEvidenceItem` exact fields：`evidence_id: EV-AR-*`；`status: ArchiveTestExecutionStatus`；`qualification: ArchiveTestQualification`；`proof_level`；`tc_refs` non-empty sorted exact `TC-AR-*`；`suite_ids` non-empty sorted；`artifact_refs` non-empty `ArchiveEvidenceArtifactRef[]` when executed，blocked/not_run 可为空；`report_path: ArchiveTestRelativePath` optional until report generation；`requirement_refs`,`veto_refs`,`acceptance_refs` sorted arrays；`limitation_refs` sorted blocker/safe refs；`review_status`；`redaction_status`。正式 06 未装配前 `acceptance_refs=[]` 是合法且必须可见，不得填临时 AC。

一个 item 只有在所有 referenced TC 的 actual raw、suite aggregate、digest、redaction 和 fixed-run pairing 均有效，且 status=passed 时才能 `qualified`；formal EV 必须 proof_level=`formal_seam`。local passed item 不能被改名为 formal。

#### 6.5.5 `suites/<suite>/artifacts/<safe_name>.json` — `ArchiveTestSpecialistArtifact`

| field | required | type / value | source / rule |
|---|---:|---|---|
| `schema_version`,`run_id`,`suite_id` | yes | context values | actual writer |
| `artifact_kind` | yes | `resource_sample`,`fault_observation`,`redaction_scan`,`dependency_scan`,`report_pairing`,`blocked_lane_scan`,`formal_prerequisite` | closed enum |
| `status` | yes | execution status | actual check/sample |
| `case_refs` | yes | non-empty sorted exact TC IDs | every specialist output must have formal TC source |
| `observations` | yes | array of `{name: finite string,value_u64?: u64,value_category?: finite string,unit?: finite string}` | exactly one value form; no raw body/id |
| `file_refs` | yes | sorted file digest refs | scanned/derived safe files only |
| `issues`,`related_blocker_refs` | yes | safe arrays | actual failures/limitations |
| `redaction_status` | yes | exact enum | scan result |
| digest fields | yes | §6.3 | specialist JSON hash |

### 6.6 Artifact / report 目录结构

```text
artifacts/test/<run_id>/
  meta/context.json
  evidence-index.json
  suites/<suite>/
    report.json
    stdout.log
    stderr.log
    cases/<case_id>.json
    artifacts/<safe_name>.json

reports/
  README.md
  runs/<run_id>/
    summary.md
    evidence-index.md
    gate-results.md
    redaction-check.md
    dependency-boundary.md
    report-audit.md
    blocked-lanes.md
    suites/<suite>.md
    evidence/EV-AR-<FAMILY>-<NNN>.md
  acceptance/
    handoff.md
    veto-checklist.md
    risk-acceptance.md
    open-issues.md
  review/
    reviewer-notes.md
    agent-review.md
```

`reports/README.md` 只在真实送验准备中由实施/验收流程写当前 selected fixed run 列表；本文不创建。所有 report 链接使用 repository-relative path，不得引用绝对本机路径、`latest`、其他 run 的隐式输出或项目子目录。

### 6.7 报告成熟度与生成合同

| 成熟度 | planned 输出 | writer / input | 不代表 |
|---|---|---|---|
| script capability | 参数解析、path/schema/digest/redaction check | future 07 boundary；synthetic schema fixtures | 真实 suite/EV |
| minimal index shell | summary/gate-results + 从 raw 渲染的 EV/TC/path 形状 | `generate_reports.sh`;fixed run raw | qualified final EV 或 acceptance |
| final EV detail pages | full evidence-index + `evidence/EV-AR-*.md` | `generate_evidence_index.sh`;qualified raw items | 06 verdict/signoff |
| acceptance handoff draft | handoff/VETO/open issues/risk draft | `generate_acceptance_handoff.sh`;selected fixed run reports | 自动风险接受或 readiness |
| human/Agent review | reviewer/agent notes、争议和解释 | reports + owning closure proof | raw status mutation |

| 报告 | raw 来源 | planned script | output | 审查要求 |
|---|---|---|---|---|
| run/suite/gate summary | context + suite reports | `scripts/reports/generate_reports.sh` | `reports/runs/<run_id>/{summary,gate-results}.md`、suite pages | denominator/status/limitation 不被压平 |
| evidence index / EV pages | `evidence-index.json` + referenced raw | `generate_evidence_index.sh` | run `evidence-index.md` + `evidence/EV-AR-*.md` | TC/ref/digest/qualification 一致 |
| acceptance handoff draft | selected fixed-run reports + future 06 mapping | `generate_acceptance_handoff.sh` | `reports/acceptance/*.md` 初稿 | 人/Agent补充；无自动 verdict/signoff |
| redaction/dependency/pairing/blocked | corresponding check specialist raw | `generate_reports.sh` | named run reports | 原检查失败不得被报告改写 |

### 6.8 Planned EV registry 与 candidate 映射

下表 ID 是稳定的 planned evidence family，不是实例。每个未来 instance 必须从 §6.5 raw schema生成。

| planned EV | CUT / TC refs | suite | proof / 当前上限 | 前序 candidate alias |
|---|---|---|---|---|
| `EV-AR-CONTRACT-001` | CONTRACT-001～004 | archive-contract-domain | local_contract | CONTRACT |
| `EV-AR-OBJECT-001` | OBJECT-001～006 | archive-contract-domain | local_contract | OBJECT |
| `EV-AR-STATE-001` | STATE-001～018 | archive-contract-domain | local_contract | STATE |
| `EV-AR-COMMAND-001` | COMMAND-001～006 | archive-service-flow | local + formal limitations | COMMAND |
| `EV-AR-QUERY-001` | QUERY-001～005 | archive-service-flow | local；cursor/formal blocked | QUERY |
| `EV-AR-CONSUMER-001` | CONSUMER-001～005 | archive-entry-worker | local mapping；formal event blocked | CONSUMER |
| `EV-AR-JOB-001` | JOB-001～017 | archive-entry-worker | local/fault；affected formal blocked | JOB/BUNDLE/ASSESS/GOVERNANCE |
| `EV-AR-UOW-001` | UOW-001～004 | archive-consistency-replay | controlled；durable blocked | UOW/TRACE |
| `EV-AR-IDEMP-001` | IDEMP-001～004 | archive-consistency-replay | controlled；codec/restart blocked | IDEMP/RECOVERY |
| `EV-AR-EFFECT-001` | EFFECT-001～004 | archive-consistency-replay | controlled；external finality blocked | EFFECT/RECOVERY |
| `EV-AR-AUTHORITY-001` | AUTHORITY-001～005 | archive-authority-restore-negative + formal | negative local；owner positive blocked | AUTHORITY/BOUNDARY |
| `EV-AR-RESTORE-001` | RESTORE-001～005 | archive-authority-restore-negative + formal | negative local；receiver positive blocked | RESTORE/RECOVERY |
| `EV-AR-CONFIG-001` | CONFIG-001～004 | archive-config-boundary | local schema;production binding blocked | CONFIG |
| `EV-AR-SECURITY-001` | SECURITY-001～002 | archive-security-observe | local_contract | SECURITY |
| `EV-AR-OBSERVE-001` | OBSERVE-001～002 | archive-security-observe | local non-interference；handoff blocked | OBSERVE/TRACE |
| `EV-AR-DEPENDENCY-001` | DEPENDENCY-001～002 | archive-dependency-boundary | source-derived local;SDK/outbound blocked | DEPENDENCY/BOUNDARY |
| `EV-AR-NFR-001` | RESOURCE-001～002 | archive-resource-bounds | qualitative local；numeric blocked | NFR |
| `EV-AR-REPORT-001` | REPORT-001～002 | archive-report-audit | local report truth | REPORT |
| `EV-AR-VETO-001` | VETO-001～005 | relevant P0 suites + release gate | aggregate only after each exact TC instance | VETO/BOUNDARY/RECOVERY |

正式 EV 的 `tc_refs` 不能写范围字符串；上表的 `001～NNN` 是文档压缩表示，未来 registry/code generator 必须展开为 Step 6 中存在的每个精确 TC ID。例如 `EV-AR-REPORT-001.tc_refs=[TC-AR-REPORT-001,TC-AR-REPORT-002]`。

### 6.9 18 CUT → EV → future 06 映射

| CUT | planned EV | 00 requirement / VETO refs | future 06 状态 |
|---|---|---|---|
| CONTRACT | EV-AR-CONTRACT-001 | F1～9；BR1/5/8/9 | `acceptance_refs=[]` pending formal 06 |
| OBJECT | EV-AR-OBJECT-001 | F1～9；BR1～5/8～11 | pending 06 |
| STATE | EV-AR-STATE-001 | BR2～6/8/10；V2/V3 | pending 06 |
| COMMAND | EV-AR-COMMAND-001 | F1/F5/F7；BR6/8/11 | pending 06 |
| QUERY | EV-AR-QUERY-001 | F6；BR3/4/8/12 | pending 06 |
| CONSUMER | EV-AR-CONSUMER-001 | F2/F5/F8/F9 | pending 06 |
| JOB | EV-AR-JOB-001 | F1～5/F7～9 | pending 06 |
| UOW | EV-AR-UOW-001 | BR2/10/11；V5 | pending 06 |
| IDEMPOTENCY | EV-AR-IDEMP-001 | F9；BR8/10/11；V5 | pending 06 |
| EFFECT | EV-AR-EFFECT-001 | F2/F5/F8/F9；BR5/6/8/10 | pending 06 |
| AUTHORITY | EV-AR-AUTHORITY-001 | BR1/4/6/7/9/12；V1/V3/V4 | pending 06 |
| RESTORE | EV-AR-RESTORE-001 | F7～9；BR8～10；V1/V2 | pending 06 |
| CONFIG | EV-AR-CONFIG-001 | BR6/8/12；V3/V4 | pending 06 |
| SECURITY | EV-AR-SECURITY-001 | security/audit NFR；V1/V3/V4 | pending 06 |
| OBSERVE | EV-AR-OBSERVE-001 | BR11；observe NFR；V5 | pending 06 |
| DEPENDENCY | EV-AR-DEPENDENCY-001 | BR7/12；V1/V4 | pending 06 |
| RESOURCE | EV-AR-NFR-001 | performance/availability NFR | pending 06；numeric threshold blocked |
| REPORT | EV-AR-REPORT-001 | BR11；V5 | pending 06 |

`EV-AR-VETO-001` 是这 18 条中相关 exact evidence instance 的聚合索引，不覆盖它们，也不能在任一 required source item blocked/failed/not_run 时 qualified。

### 6.10 证据归档停审记录

| 证据/报告族 | 审查项 | 结论 | 缺口 / 上限 |
|---|---|---|---|
| CONTRACT/OBJECT/STATE | 每个 TC、设计 refs、raw case 和 suite report 可回指 | 通过设计 | 当前无实例 |
| COMMAND/QUERY/CONSUMER/JOB | 入口、状态、failure/blocked 与 proof level 分离 | 通过设计 | formal positive 受 blocker |
| UOW/IDEMP/EFFECT/RESTORE | fault、probe、partial 和 owner boundary 有独立 evidence | 通过设计 | durable/provider finality blocked |
| CONFIG/SECURITY/OBSERVE | 55 keys、redaction、no-write/non-interference 有 raw 入口 | 通过设计 | telemetry/material handoff blocked |
| DEPENDENCY/VETO | graph/outbound absence 与五类 VETO 有 exact TC refs | 通过设计 | SDK direction/outbound contract blocked |
| NFR | sample 与 hard threshold 分离 | 通过设计 | `AR-HLD-Q-002` blocked |
| REPORT | failure raw、pairing、no-static、fixed run 可审查 | 通过设计 | 当前 0 run |

### 6.11 跨证据真实性与追溯审计

| 审计项 | 结论 | 必须保持的限制 |
|---|---|---|
| orphan TC / EV | 设计无 orphan；未来 generator 必须拒绝未知 ID | 不能用自然语言 all/representative 代替 `tc_refs` |
| duplicate EV / alias | 19 个 registry ID 与 candidate alias 一一映射 | 不为同一 TC 静态复制 qualified evidence |
| raw↔report pairing | 每个 report 同一固定 run、path、digest | 跨 run 聚合必须列 source runs，不能偷偷合并 |
| digest canonicalization | JSON/log 规则已固定 | test hash 不等 Bundle digest/signature |
| status denominator | passed/failed/blocked/infra/not_run 独立 | blocked/not_run 不删除分母 |
| redaction | raw、report、check 输出都扫描 | scanner 不保存 canary 原值 |
| static evidence | index 只能从真实 raw 推导 | Markdown/空 JSON/手工勾选不是 EV |
| AC/VETO handoff | 当前只保存 requirement/VETO refs | 06 未重建前 `acceptance_refs=[]`，不造 AC/verdict |
| retention | 至少覆盖送验和缺陷复验 | 具体天数/删除授权交治理/06/运维 |
| 当前事实 | 0 run/artifact/report/EV | 本 Step 不生成任何实例 |

## 7. 复杂度判断

五类 machine artifact 加 19 个 evidence family 足以支持 102 个 TC、18 个 CUT 与未来 06 追溯，同时将脚本能力、最小 index、最终 EV 页面和 acceptance handoff 分开。字段 schema 足够落码，但不绑定 runner/framework/provider。

## 8. 回填草稿

正式 §13 应保留证据成熟度、固定 raw/report 目录、machine schema/digest、19 个 planned EV family、18 CUT 映射、报告脚本和人工审查要求。正文必须明确：这些是未来 run 的生成规则；当前没有真实 run/artifact/report/EV；`acceptance_refs` 在 06 重建前为空；失败、blocked 和 not_run 不能被报告或静态表改成 passed。

## 9. 对上游设计的影响与待确认

| 项 | 结论 |
|---|---|
| 03/04 回写 | 无；测试 artifact schema 属于本地工具边界，不进入业务协议 |
| 新 blocker | 无；既有 blocker/pending 全保留 |
| 待 06 | AC/VETO 最终引用、verdict、risk acceptance、signoff、readiness |
| 待 07 | runner/gate/report/check 实现边界、writer/reader 文件与 phase |
| 待治理/运维 | evidence retention/delete policy、secret/redaction operation、formal material handoff |

## 10. 进入 Step 14 门禁

- [x] 每类 P0 CUT/TC 都有 planned evidence family、raw/report 位置和 future 06 引用槽位。
- [x] machine JSON schema、enum、digest/canonicalization、writer/reader、failure artifact 和 redaction 边界已闭合。
- [x] 19 个 EV registry 与前序 candidate alias 可展开到精确 TC ID；无静态 `tc_refs` 替代。
- [x] `artifacts/test/<run_id>`、`reports/runs/<run_id>`、`reports/acceptance` 和 `reports/review` 职责不混同；禁止 `latest`。
- [x] formal blocker、P2 threshold、AC/verdict/signoff/readiness 均保持未确认/未生成。
- [x] 证据停审与跨证据真实性审计无 unresolved 冲突。
- [x] 允许进入 Step 14。

当前 `gate_status`：`completed / planned_evidence_schema_closed_no_instances`。

`next_allowed_action`：按连续授权创建并完成 Step 14；本 Step 不创建 run、artifact、report 或 evidence instance。
