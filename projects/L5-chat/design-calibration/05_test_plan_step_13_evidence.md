# L5-chat 05 · Step 13 测试报告与证据归档

## 1. Step状态

> done / pass_with_upstream_blockers；2026-10-01。全部用例/证据/路径均planned，未执行。

## 2. 本步输入

已通过Step12；05 SOP Step13与书写规范5.13；03 Step16、04 §12；真相源§2.15/§7。复杂cut逐个收口，前序gate成立才创建本文件。

## 3. SOP问题回答

证据从何产生、何处存、schema/enum/digest/TC-ref如何验证、谁审阅与保留？§13.1～8精确给出；06接收实际材料后才判验收。

## 4. 当前文档问题诊断

只列报告字段/EV名称没有schema、digest、分母和proof scope，容易伪造staticindex或把blocked当通过。

## 5. 改动前后对比

| 改前 | 改后 | 原因 |
|---|---|---|
| 只列报告字段/EV名称没有schema、digest、分母和proof scope，容易伪造staticindex或把blocked当通过。 | 本步§7结构化结论 | 防止历史设计与当前owner合同分叉 |

## 6. 设计取舍与复杂度

16suite逐项固定EV与TC，再私有DTO/路径/无环hash/成熟度逐类小循环。RFC8785+sha256使用成熟实现，拒绝rawbody保存和fake升级。所有planned EV不生成真实材料。

## 7. 结构化中间产物

### 13.1 预约证据映射

以下是正式**planned/reserved EV ID**，不是已经生成的EV、run或结果。Step1～12 EV-CAND-<suite>仅预约，现1:1固定到下表，不写到真实evidence-index。tc_refs必须取以下明确集合，不能“全部P0”自然语言代替；06可引用这些预约与00实际AC，最终verdict留06。

| 证据ID（planned） | suite/proof_scope | tc_refs | ac_refs | 未来来源/位置 |
|---|---|---|---|---|
| EV-UNIT-001 | intent/isolated_fixture | TC-PROTO-001, TC-PROTO-002, TC-PROTO-003, TC-PROTO-004, TC-PROTO-019, TC-PROTO-020, TC-PROTO-021, TC-PROTO-022, TC-PROTO-051, TC-PROTO-052, TC-PROTO-071, TC-PROTO-072, TC-STATE-031, TC-STATE-032, TC-STATE-033, TC-STATE-034, TC-STATE-035, TC-STATE-036, TC-CONC-001, TC-CONC-002, TC-CONC-003, TC-CONC-004, TC-CONC-005, TC-SAFE-003 | AC-CHAT-003, AC-CHAT-005, AC-NFR-CHAT-005 | artifacts/test/<run_id>/suites/intent/report.json → reports/runs/<run_id>/evidence/EV-UNIT-001.md |
| EV-UI-001 | presentation/isolated_fixture | TC-PROTO-005, TC-PROTO-006, TC-PROTO-011, TC-PROTO-012, TC-PROTO-013, TC-PROTO-014, TC-PROTO-015, TC-PROTO-016, TC-PROTO-017, TC-PROTO-018, TC-PROTO-031, TC-PROTO-032, TC-SAFE-008, TC-SAFE-009, TC-AT-001, TC-AT-002, TC-AT-003, TC-AT-004, TC-AT-005 | AC-CHAT-002, AC-FR-CHAT-010, AC-NFR-CHAT-001, AC-NFR-CHAT-007 | artifacts/test/<run_id>/suites/presentation/report.json → reports/runs/<run_id>/evidence/EV-UI-001.md |
| EV-UNIT-002 | continuity/isolated_fixture | TC-PROTO-007, TC-PROTO-008, TC-PROTO-023, TC-PROTO-024, TC-PROTO-049, TC-PROTO-050, TC-PROTO-053, TC-PROTO-054, TC-PROTO-055, TC-PROTO-056, TC-PROTO-057, TC-PROTO-058, TC-PROTO-059, TC-PROTO-060, TC-PROTO-067, TC-PROTO-068, TC-PROTO-069, TC-PROTO-070, TC-PROTO-073, TC-PROTO-074, TC-PROTO-075, TC-PROTO-076, TC-STATE-037, TC-STATE-038, TC-STATE-039, TC-STATE-043, TC-STATE-044, TC-STATE-045, TC-CONC-006, TC-CONC-009, TC-CONC-011, TC-CONC-012, TC-CONC-013, TC-CONC-014, TC-SAFE-010 | AC-CHAT-004, AC-CHAT-005, AC-NFR-CHAT-005, AC-NFR-CHAT-001 | artifacts/test/<run_id>/suites/continuity/report.json → reports/runs/<run_id>/evidence/EV-UNIT-002.md |
| EV-UNIT-003 | navigation/isolated_fixture | TC-PROTO-009, TC-PROTO-010, TC-STATE-001, TC-STATE-002, TC-STATE-003, TC-STATE-004, TC-STATE-005, TC-STATE-006, TC-STATE-007, TC-STATE-008, TC-STATE-009, TC-SAFE-002 | AC-CHAT-001, AC-CHAT-005 | artifacts/test/<run_id>/suites/navigation/report.json → reports/runs/<run_id>/evidence/EV-UNIT-003.md |
| EV-UNIT-004 | persistence/isolated_fixture | TC-PROTO-025, TC-PROTO-026, TC-PROTO-027, TC-PROTO-028, TC-PROTO-061, TC-PROTO-062, TC-PROTO-077, TC-PROTO-078, TC-PROTO-079, TC-PROTO-080, TC-STATE-040, TC-STATE-041, TC-STATE-042, TC-STATE-046, TC-STATE-047, TC-STATE-048, TC-CONC-010, TC-SAFE-004 | AC-CHAT-002, AC-CHAT-004, AC-CHAT-005, AC-NFR-CHAT-005, AC-DR-CHAT-004 | artifacts/test/<run_id>/suites/persistence/report.json → reports/runs/<run_id>/evidence/EV-UNIT-004.md |
| EV-NATIVE-001 | host-unit/isolated_fixture | TC-PROTO-029, TC-PROTO-030, TC-STATE-049, TC-STATE-050, TC-STATE-051, TC-CFG-011, TC-CFG-012, TC-SAFE-007 | AC-CHAT-002, AC-CHAT-005, AC-NFR-CHAT-003, AC-FR-CHAT-010 | artifacts/test/<run_id>/suites/host-unit/report.json → reports/runs/<run_id>/evidence/EV-NATIVE-001.md |
| EV-UI-002 | process/isolated_fixture | TC-PROTO-033, TC-PROTO-034, TC-PROTO-035, TC-PROTO-036, TC-PROTO-037, TC-PROTO-038, TC-PROTO-039, TC-PROTO-040, TC-PROTO-041, TC-PROTO-042, TC-PROTO-083, TC-PROTO-084, TC-STATE-010, TC-STATE-011, TC-STATE-012, TC-STATE-013, TC-STATE-014, TC-STATE-015, TC-STATE-016, TC-STATE-017, TC-STATE-018, TC-STATE-019, TC-STATE-020, TC-STATE-021, TC-STATE-022, TC-STATE-023, TC-STATE-024, TC-CFG-019, TC-CFG-020, TC-CONC-007, TC-CONC-008, TC-SAFE-005 | AC-CHAT-002, AC-FR-CHAT-011, AC-CHAT-005, AC-NFR-CHAT-003, AC-NFR-CHAT-005 | artifacts/test/<run_id>/suites/process/report.json → reports/runs/<run_id>/evidence/EV-UI-002.md |
| EV-UI-003 | directory/isolated_fixture | TC-PROTO-043, TC-PROTO-044, TC-PROTO-045, TC-PROTO-046, TC-PROTO-047, TC-PROTO-048, TC-PROTO-085, TC-PROTO-086, TC-STATE-025, TC-STATE-026, TC-STATE-027, TC-STATE-028, TC-STATE-029, TC-STATE-030, TC-SAFE-006 | AC-FR-CHAT-012, AC-FR-CHAT-014, AC-CHAT-005, AC-FR-CHAT-010 | artifacts/test/<run_id>/suites/directory/report.json → reports/runs/<run_id>/evidence/EV-UI-003.md |
| EV-UNIT-005 | diagnostic/isolated_fixture | TC-PROTO-063, TC-PROTO-064, TC-PROTO-065, TC-PROTO-066, TC-PROTO-081, TC-PROTO-082, TC-CFG-021, TC-CFG-022 | AC-FR-CHAT-009, AC-NFR-CHAT-003 | artifacts/test/<run_id>/suites/diagnostic/report.json → reports/runs/<run_id>/evidence/EV-UNIT-005.md |
| EV-UNIT-006 | config/isolated_fixture | TC-CFG-001, TC-CFG-002, TC-CFG-003, TC-CFG-004, TC-CFG-005, TC-CFG-006, TC-CFG-007, TC-CFG-008, TC-CFG-009, TC-CFG-010, TC-CFG-013, TC-CFG-014, TC-CFG-015, TC-CFG-016, TC-CFG-017, TC-CFG-018, TC-CFG-023, TC-CFG-024 | AC-NFR-CHAT-003 | artifacts/test/<run_id>/suites/config/report.json → reports/runs/<run_id>/evidence/EV-UNIT-006.md |
| EV-UNIT-007 | errors/isolated_fixture | TC-ERROR-001, TC-ERROR-002, TC-ERROR-003, TC-ERROR-004, TC-ERROR-005, TC-ERROR-006, TC-ERROR-007, TC-ERROR-008, TC-ERROR-009, TC-ERROR-010, TC-ERROR-011, TC-ERROR-012, TC-ERROR-013, TC-ERROR-014, TC-ERROR-015 | AC-NFR-CHAT-003 | artifacts/test/<run_id>/suites/errors/report.json → reports/runs/<run_id>/evidence/EV-UNIT-007.md |
| EV-UNIT-008 | boundary/isolated_fixture | TC-SAFE-001 | AC-BR-CHAT-001 | artifacts/test/<run_id>/suites/boundary/report.json → reports/runs/<run_id>/evidence/EV-UNIT-008.md |
| EV-REPORT-001 | report/isolated_fixture | TC-REPORT-001, TC-REPORT-002, TC-REPORT-003, TC-REPORT-004, TC-REPORT-005, TC-REPORT-006, TC-REPORT-007 | AC-NFR-CHAT-004, AC-DR-CHAT-004, AC-CHAT-005 | artifacts/test/<run_id>/suites/report/report.json → reports/runs/<run_id>/evidence/EV-REPORT-001.md |
| EV-SDK-001 | sdk-real/formal_sdk | TC-REAL-001, TC-REAL-004 | AC-CHAT-005, AC-NFR-CHAT-005 | artifacts/test/<run_id>/suites/sdk-real/report.json → reports/runs/<run_id>/evidence/EV-SDK-001.md |
| EV-HOST-001 | desktop-real/native_host | TC-REAL-002 | AC-NFR-CHAT-007 | artifacts/test/<run_id>/suites/desktop-real/report.json → reports/runs/<run_id>/evidence/EV-HOST-001.md |
| EV-AT-001 | at-real/manual_at | TC-REAL-003 | AC-NFR-CHAT-007 | artifacts/test/<run_id>/suites/at-real/report.json → reports/runs/<run_id>/evidence/EV-AT-001.md |

每suite证据小循环：读取actual machine run/context/manifest→核对scope、TC/variants和status→校验schema/digest/path→redaction→生成允许成熟度的safe EV/index→审查失效/缺证据→发布。失败/blocked可以有安全报告及不足记录，绝不报告passed或交付通过。unit/fixture EV不是owner业务审批/验收evidence。

### 13.2 证据流图: planned生成链

```text
[actual approved runner + frozen TC/variant manifest]
       | real machine artifacts, safe writers
       v
[artifacts/test/<run_id>/meta + suites/cases + safe logs]
       | schema / path / source / digest checks
       v
[actual gate/redaction machine checks]
       | generate_reports candidate, then check_redaction
       v
[reports/runs/<run_id>/summary + suites + gate + redaction]
       |
       +--> index shell (link shape only)
       +--> full EV detail/index (07 boundary authorized + real materials)
       +--> future06/07 acceptance handoff -> human review
```

没有真实run就没有artifact/report/index。机器writer必须先抑制raw stdout/stderr，不能先存rawsecret再依赖扫描。模型/人工不得手填case passed和EV内容。

### 13.3 schema共同规则与owner

DTO owner：未来测试runner/report脚本私有test-support schema，不进入Chat public contracts、domain/core或SDK wire。Case/suite/meta由run_ci_gate writer；redactioncheck由check_redaction；evidence-index/report Markdown由generate_reports reader/writer。所有文件schema_version固定 `chat.test.v1`；其它版本reject。
下述是可直接转JSON Schema的精确DTO；**全部字段必填、没有optional**，明确nullable项仅可null；object additionalProperties=false，各数组unique约束按下文crossfield。禁止getter/prototype/nonJSON/重复key/coercion。整数为非负safeint，duration_ms为finite nonnegative number或null，不以null填假时长。
所有safe alias/ref均经allowlist，token/完整业务ref、URL、绝对路径、用户路径不许用alias逃避redaction。

```ts
// Test/report-local DTO only. JSON Schema must reject additionalProperties.
type SchemaVersion = "chat.test.v1";
type RunId = string; // ^[a-z][a-z0-9-]{0,63}$, single-use, no / or ..
type Digest = string; // ^sha256:[0-9a-f]{64}$
type SafeAlias = string; // ^[a-z][a-z0-9._:-]{0,127}$; approved non-sensitive catalog only
type TCId = string; // ^TC-[A-Z]+-[0-9]{3}$ and member of §6 registry
type EVId = string; // ^EV-[A-Z]+-[0-9]{3}$ and member of §13.1 registry
type ACId = string; // member of current00§14 actual AC registry, no invented AC
type VariantId = string; // ^[a-z][a-z0-9-]{0,95}$; frozen explicit row/guard variant
type SuiteId = "navigation" | "intent" | "continuity" | "persistence"
  | "presentation" | "process" | "directory" | "diagnostic" | "config"
  | "errors" | "host-unit" | "boundary" | "report"
  | "sdk-real" | "desktop-real" | "at-real";
type ProfileId = "desktop-local" | "desktop-ci" | "desktop-staging"
  | "desktop-prod" | "web-preview-local" | "web-preview-ci";
type ProofScope = "isolated_fixture" | "formal_sdk" | "native_host" | "manual_at";
type CaseStatus = "passed" | "failed" | "blocked" | "skipped" | "not_run";
type SuiteStatus = "passed" | "failed" | "blocked" | "skipped";
type AssertionStatus = "passed" | "failed" | "not_checked";
type FailureCategory = "none" | "assertion_failed" | "dependency_unbound"
  | "dependency_unavailable" | "authority_missing" | "environment_unapproved"
  | "runner_unavailable" | "runner_crashed" | "schema_invalid" | "digest_mismatch"
  | "path_invalid" | "redaction_failed" | "coverage_missing" | "review_pending";
type Maturity = "script_capability" | "index_shell" | "full_ev" | "acceptance_handoff";
type ReviewStatus = "pending" | "approved" | "rejected";
type RedactionStatus = "passed" | "failed" | "not_checked";
type RefRoot = "artifact" | "report";
interface FileRef {
  root: RefRoot;
  path: string; // relative safe path below same run root; no symlink or traversal
  artifact_digest_algorithm: "sha256";
  artifact_digest: Digest; // referenced sanitized file: exact stored bytes
}
interface InstanceRef {
  tc_id: TCId;
  variant_id: VariantId;
}
interface DigestHeader {
  schema_version: SchemaVersion;
  run_id: RunId;
  artifact_digest_algorithm: "sha256";
  artifact_digest: Digest;
}
interface SourceRevision {
  repository_alias: SafeAlias;
  revision: string; // actual Git commit ^([0-9a-f]{40}|[0-9a-f]{64})$, no placeholder
  dirty: boolean; // actual run check; dirty doesn't count as approved release
}
interface SourceCommitsArtifact extends DigestHeader {
  sources: SourceRevision[]; // actual test code + required SDK/contract repos
}
interface RuntimeVersion {
  component: SafeAlias;
  version: string; // ^[a-zA-Z0-9][a-zA-Z0-9.+_-]{0,63}$, actual checked version
}
interface RunContextArtifact extends DigestHeader {
  config_profile: ProfileId;
  environment_alias: SafeAlias;
  supported_matrix_ref: SafeAlias | null; // null => real support gate blocked
  approved_policy_ref: SafeAlias | null; // no actual native grant in JSON
  versions: RuntimeVersion[];
  source_commits_ref: FileRef;
  config_digest_ref: FileRef;
  manifest_ref: FileRef;
  authorized_maturity: Maturity; // actual07 boundary allowlist, cannot caller-upgrade
  phase_boundary_ref: SafeAlias | null;
}
interface SafeConfigProjection {
  schemaVersion: 1;
  platform: "desktop" | "web_preview";
  sdkProfileRef: SafeAlias;
  hostProfileRef: SafeAlias | null;
  maxTextUnits: number;
  maxAttachmentRefs: number;
  maxCachedEntries: number;
  memoryOnly: true;
  maxConsumedChanges: number;
  maxConsumptionContexts: number;
  maxDirectoryQueryUnits: number;
  maxVisibleProcessNodes: number;
  maxVisibleProcessEdges: number;
  diagnosticMode: "disabled" | "formal_low_sensitivity";
}
interface ConfigDigestArtifact extends DigestHeader {
  config_profile: ProfileId;
  config_projection: SafeConfigProjection; // exact14 validated fields, no raw config
  config_digest_algorithm: "sha256";
  config_digest: Digest; // RFC8785 over config_projection only
}
interface PlannedCaseInstance {
  tc_id: TCId;
  variant_id: VariantId;
  suite: SuiteId;
  priority: "P0" | "P1" | "P2";
  runner_kind: "vitest" | "react_component" | "playwright" | "rust_native" | "sdk_real" | "manual";
  proof_scope: ProofScope;
  source_contract_ref: SafeAlias; // safe local registry alias to current03/04 row
}
interface ManifestArtifact extends DigestHeader {
  case_instances: PlannedCaseInstance[];
  planned_ev_refs: EVId[];
}
interface AssertionArtifact {
  assertion_id: SafeAlias; // fixed from test manifest, not raw assertion text
  status: AssertionStatus;
  reason: FailureCategory;
}
interface CaseArtifact extends DigestHeader {
  suite: SuiteId;
  tc_id: TCId;
  variant_id: VariantId;
  proof_scope: ProofScope;
  status: CaseStatus;
  executed: boolean;
  duration_ms: number | null;
  assertions: AssertionArtifact[];
  failure_category: FailureCategory;
  source_contract_ref: SafeAlias;
  safe_attachment_refs: FileRef[]; // no body screenshots/dumps/stack/fullrefs
}
interface SuiteReportArtifact extends DigestHeader {
  suite: SuiteId;
  config_profile: ProfileId;
  proof_scope: ProofScope;
  status: SuiteStatus;
  duration_ms: number | null;
  expected_instances: InstanceRef[];
  case_refs: FileRef[];
  missing_instances: InstanceRef[];
  failure_category: FailureCategory;
  stdout_ref: FileRef;
  stderr_ref: FileRef;
  context_ref: FileRef;
}
interface GateItem {
  gate_id: SafeAlias;
  required_suite_refs: SuiteId[];
  status: "passed" | "failed" | "blocked";
  failure_category: FailureCategory;
}
interface GateResultsArtifact extends DigestHeader {
  gates: GateItem[];
  suite_report_refs: FileRef[];
}
interface RedactionCheckArtifact extends DigestHeader {
  status: RedactionStatus;
  checked_refs: FileRef[];
  rejected_paths: string[]; // safe relative paths only, never matched raw snippets
  failure_category: FailureCategory;
}
interface EvidenceItem {
  ev_id: EVId;
  suite: SuiteId;
  proof_scope: ProofScope;
  tc_refs: TCId[];
  instance_refs: InstanceRef[];
  ac_refs: ACId[];
  status: "passed" | "failed" | "blocked";
  failure_category: FailureCategory;
  suite_report_ref: FileRef;
  case_refs: FileRef[];
  detail_ref: FileRef | null; // null only index_shell, not full_ev
  redaction_status: RedactionStatus;
  review_status: ReviewStatus;
  reviewer_ref: SafeAlias | null;
}
interface EvidenceIndexArtifact extends DigestHeader {
  maturity: "index_shell" | "full_ev";
  context_ref: FileRef;
  manifest_ref: FileRef;
  gate_results_ref: FileRef;
  redaction_check_ref: FileRef; // machine artifact check, excludes this derived index
  items: EvidenceItem[];
}
```

### 13.4 文件shape、writer与materialization

| 文件（未来run根下） | DTO/内容 | writer→reader | 必需检查 |
|---|---|---|---|
| artifacts/test/<run_id>/meta/context.json | RunContextArtifact | gate→reports/checks | profile/批准scope/实际versions与source refs |
| 同root meta/source-commits.json | SourceCommitsArtifact | gate→reports | 真实commit而非planned id；dirty明确 |
| 同root meta/config-digest.json | ConfigDigestArtifact | gate→reports | flat14有效、无secret、config_digest一致 |
| 同root meta/manifest.json | ManifestArtifact | gate→runner/reports | 唯一TC/variant/suite/expected；source行分母完整 |
| 同root suites/<suite>/report.json | SuiteReportArtifact | runner→reports | 对本suite manifest exactmatch、scope/缺case |
| 同root suites/<suite>/cases/<TC-ID>--<variant_id>.json | CaseArtifact | runner→reports | 真执行与断言、TC/variant匹配 |
| 同root suites/<suite>/stdout.log / stderr.log | UTF8 sanitized finite output | runner→checks | rawbody/secret/stack抑制；FileRef字节digest |
| 同root gate-results.json | GateResultsArtifact | gate→reports | 相关P0缺证据非pass |
| 同root redaction-check.json | RedactionCheckArtifact | checks→reports | 机器artifact集合检查（不包含derivedindex） |
| 同root evidence-index.json | EvidenceIndexArtifact | reports→checks/06reader | allowed maturity、planned EV全集与实际结果关联 |
| reports/runs/<run_id>/redaction-final.json | RedactionCheckArtifact | checks→发布审查 | 派生index/Markdown最终检查，不反向写index循环 |

meta/context→manifest/source/config，suite→context/case/log，gate→suite，redaction-check→machine artifacts，index→context/manifest/gate/redaction-check/suite/case/EVdetail，redaction-final→derivedindex与Markdown；引用图无环。
所有FileRef在root enum指定同run root内materialize；不能只有ref不提供位置。meta/context不指向suite/index避免cycle，fullEVdetail Markdown只列安全逻辑artifact路径及其已固定digest，不写返回index的自摘要。
FileRef对被引用JSON使用**完整存储bytes**digest，与该JSON内部selfdigest计算不同；不能把二者混用。

### 13.5 canonicalization/digest精确规则

1. 所有JSON UTF8、无BOM，解析先拒duplicate/nonJSON，RFC8785 JCS canonical JSON；不得自研排序replace或对rawinput算hash。整数/finite与字符串规则在schema前校验。
2. 每DigestHeader的artifact_digest是 `sha256:` +64lowerhex，对该object根级去掉**自身artifact_digest唯一字段**后的RFC8785 UTF8bytes计算；其它字段含algorithm、子FileRef/artifact_digest与config_digest均保留。
3. config_digest仅对validated config_projection的RFC8785 UTF8bytes计算，不排字段。sha256没有其它算法候选，不hash敏感原配置/credential。
4. log/Markdown无内嵌digest；writer将有限输出转UTF8/LF保存，FileRef对最终存储bytes求sha256。JSON FileRef同样sha256实际bytes。校验时既验证byte ref digest又验证JSON selfdigest。
5. generator按有向依赖顺序写完子artifact再写父refs，任何修改重新计算向上所有refs与selfdigest；不得用normalize忽略失败/blocked/脏源或参数删减。
6. path只批准字母数字/._-/安全TC与EV名分段，禁empty段、..、absolute、backslash、URL、query、symlink逃逸/crossrun。run_id单次且固定roots，无latest，不重用覆盖。

### 13.6 crossfield验证与状态

- manifest (tc_id,variant_id,suite)唯一，TC严格属于§6；source_contract_ref链接到冻结03/04源行；state row/guard/非法和protocol失败variant集合不得少项。suite与scope固定§9，planned_ev_refs固定§13.1。
- passed case必须executed=true、至少一个assertion且全部passed、failure_category=none、真实finite duration。failed执行case必须executed=true且失败断言或runner安全失败理由；blocked/skipped/not_run executed=false、duration_ms=null、assertions只not_checked或空，不伪造运行。未启动runner可无case文件，missing_instances必须列齐。
- passed suite要求expected集合与实际cases exactmatch，所有P0case passed、无missing、无scope升级、failure_category none；failed有真实失败；blocked前置缺失，skipped只非必需明示，不满足P0。unit scope终身isolated_fixture。
- GateItem passed要求所有required suites真正passed且schema/digest/redaction及manifest completeness合格；缺real capability只能blocked。local gate不等release gate或acceptance。
- EvidenceItem tc_refs集合严格等于§13.1 planned映射，ac_refs只当前00已有编号；instance_refs/case_refs由实际machine解析，blocked缺case为空，不补造执行。passed EV须所有mappedTC参数instancepassed、所需scope证据足、redactionpassed；缺instance blocked/failed。每P0EV必须full detail与index回链。
- review_status默认pending；只有实际审查记录与批准safe reviewer ref可approved，rejected有实际理由category；nullreviewer不能approved。evidence passed仅测试断言结果，不表示已审查acceptance。
- approved_policy_ref等元数据记录已验证的来源引用，字段本身不授native权限；版本/contract ref安全登记不替代真实SDKruntime资格。
- 失败日志必须sanitized，boundedcapture达到批准runner上限时显式coverage_missing/blocked，不截掉失败改为pass。容量/保留具体预算尚未批准，release blocked。

### 13.7 报告结构与成熟度

```text
reports/
  README.md
  runs/<run_id>/
    summary.md
    gate-results.md
    redaction-check.md
    redaction-final.json
    evidence-index.md
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

| 成熟度 | permitted output（07授权后） | 禁止提前宣称 |
|---|---|---|
| script_capability | 参数/path/schema/digest/redaction的真实selftest与safe summary | 无索引全集/fullEV/验收 |
| index_shell | 真实run machine artifact→最小index、TC/suite/path状态，detail_ref=null | 不补完整EV、不signoff |
| full_ev | 全部预约EV实际status/不足、完整detail/index、gate/redaction | 无06审阅不验收通过 |
| acceptance_handoff | 06/07批准boundary基于fullEV生成acceptance初稿 | 人/Agent实际审阅前无signoff/readiness |

summary/gate/suite/EV/index均由generate_reports生成实际machine安全摘要；redaction-check.md由check_redaction真实检查产生，索引shell只验证链接形态。06/07尚未定义acceptance writer与commitboundary，不在05创建额外脚本或ledger，也不填验收文件。report schema的maturity是已批准boundary记录，不能任意--mode升级。

### 13.8 保留、访问与审查

只保留sanitized machine artifact、实际失败safe summary/log与引用digest；rawsecret/body候选不归档、不发布、不输出命中片段，立即安全移除候选，保留finite category/path的失败摘要。
run-scoped目录访问由批准CI/test环境限制；正式owner数据与credential不写artifact。生产/真实环境的保留时长、存储预算、ACL/删除责任与来源版本批准均waiting，未批准不能release归档；05不自行给30天/永久保存。
失败/blocked run不能覆盖或删改成通过；需要复验新run与旧失败safe ref。修改证据必须重新writer生成/refdigest审计，保留变更与review记录。
人/Agent只审阅语义、缺口与风险，不用手工编辑JSON伪造实际结果。safe commit/test/运行摘要、BPMN截图及原型均不是EV；报告只能证明相应测试层，不能生成Governance/Artifact/Workspace/Runtime业务truth。


## 8. 回填草稿

正式05 §13回填本步§7全部表、步骤和schema。

## 9. 待确认事项

CHAT-UP001～009、WS-UP001～008、CHAT-BASE001、native/生产预算/版本兼容/质量仍open或blocked。真实正向不得由fixture解除。无当前测试结果、EV或readiness。

## 10. 自检与下一Step门禁

16planned EV各回指明确TC；machine DTO全字段必填/enum/null/path/digest/crossfield明确；真实writer未实现、无run/EV/报告。 本地设计gate pass_with_upstream_blockers；进入Step14，先读本产物/台账与对应SOP。
