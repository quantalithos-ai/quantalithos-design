# Step 13 规范性附录：机器artifact schema v1

归属：测试harness/gate/check/report工具，非Marketplace public contracts/domain。writer/reader和路径沿[Step13](05_test_plan_step_13_evidence.md)§7.1/7.2。以下是可直接编码的JSON Schema2020-12设计，不是实现文件或实际artifact。所有object拒unknown，required完整列出；nullable必须显式null，未声明optional不得省略。`format=date-time`必须由validator严格验证RFC3339 UTC，而非只作annotation。

## 1. JSON Schema

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "Marketplace test artifact v1",
  "type": "object", "additionalProperties": false,
  "required": ["schema_version", "kind", "run_id", "record_digest", "body"],
  "properties": {
    "schema_version": {"const": "marketplace-test/v1"},
    "kind": {"enum": ["context", "registry", "subcase-manifest", "case", "log-entry", "suite-report", "check-report", "run-report", "evidence-detail", "evidence-index", "acceptance-draft"]},
    "run_id": {"$ref": "#/$defs/RunId"},
    "record_digest": {"$ref": "#/$defs/Digest", "properties": {"mode": {"const": "json-record"}}},
    "body": {"type": "object"}
  },
  "allOf": [
    {"if": {"properties": {"kind": {"const": "context"}}}, "then": {"properties": {"body": {"$ref": "#/$defs/Context"}}}},
    {"if": {"properties": {"kind": {"const": "registry"}}}, "then": {"properties": {"body": {"$ref": "#/$defs/Registry"}}}},
    {"if": {"properties": {"kind": {"const": "subcase-manifest"}}}, "then": {"properties": {"body": {"$ref": "#/$defs/Manifest"}}}},
    {"if": {"properties": {"kind": {"const": "case"}}}, "then": {"properties": {"body": {"$ref": "#/$defs/Case"}}}},
    {"if": {"properties": {"kind": {"const": "log-entry"}}}, "then": {"properties": {"body": {"$ref": "#/$defs/Log"}}}},
    {"if": {"properties": {"kind": {"const": "suite-report"}}}, "then": {"properties": {"body": {"$ref": "#/$defs/Suite"}}}},
    {"if": {"properties": {"kind": {"const": "check-report"}}}, "then": {"properties": {"body": {"$ref": "#/$defs/Check"}}}},
    {"if": {"properties": {"kind": {"const": "run-report"}}}, "then": {"properties": {"body": {"$ref": "#/$defs/Run"}}}},
    {"if": {"properties": {"kind": {"const": "evidence-detail"}}}, "then": {"properties": {"body": {"$ref": "#/$defs/Evidence"}}}},
    {"if": {"properties": {"kind": {"const": "evidence-index"}}}, "then": {"properties": {"body": {"$ref": "#/$defs/Index"}}}},
    {"if": {"properties": {"kind": {"const": "acceptance-draft"}}}, "then": {"properties": {"body": {"$ref": "#/$defs/Draft"}}}}
  ],
  "$defs": {
    "RunId": {"type": "string", "pattern": "^[A-Za-z0-9][A-Za-z0-9._-]{0,95}$"},
    "Slug": {"type": "string", "pattern": "^[A-Za-z0-9][A-Za-z0-9_-]{0,127}$"},
    "SafeTag": {"type": "string", "pattern": "^[A-Za-z0-9][A-Za-z0-9._:-]{0,127}$"},
    "Count": {"type": "integer", "minimum": 0, "maximum": 9007199254740991},
    "Time": {"type": "string", "format": "date-time"},
    "NullableTime": {"oneOf": [{"$ref": "#/$defs/Time"}, {"type": "null"}]},
    "Profile": {"enum": ["local", "test", "staging", "production"]},
    "SuiteId": {"enum": ["contract-domain-fast", "service-flow-fast", "infra-runtime-fake", "postgres-atomicity", "entry-worker-job", "web-protocol-workflow", "config-redline", "redaction-boundary", "recovery-replay", "report-generation-audit", "release-main-smoke"]},
    "TcId": {"type": "string", "pattern": "^TC-(SOURCE|REVIEW|CATALOG|DISTRIBUTION|WITHDRAWAL|RECOVERY|REFERENCE|CONFIG|CROSS)-[0-9]{3}$"},
    "EvId": {"type": "string", "pattern": "^EV-(UNIT|DOMAIN|API|WORKER|PG|WEB|CONFIG|RECOVERY|REDACTION|RELEASE)-[0-9]{3}$"},
    "DatasetId": {"enum": ["DS-BASE", "DS-SOURCE", "DS-REVIEW", "DS-CATALOG", "DS-DISTRIBUTION", "DS-WITHDRAWAL", "DS-RECOVERY", "DS-REFERENCE", "DS-CONFIG", "DS-SECURITY", "DS-PG", "DS-WEB", "DS-EVIDENCE"]},
    "CutId": {"type": "string", "pattern": "^CUT-MP-(0[1-9]|1[0-3])$"},
    "AcId": {"type": "string", "pattern": "^(AC-MP-(101|102|103|201|202|203|301|302|303|401|402|403|501|502|503|504|G01|G02|G03|G04)|VETO-MP-[1-5])$"},
    "Path": {"type": "string", "minLength": 1, "maxLength": 1024, "pattern": "^[A-Za-z0-9._/-]+$"},
    "DesignRef": {"type": "string", "minLength": 1, "maxLength": 1024},
    "Status": {"enum": ["passed", "failed", "blocked", "unavailable", "not_run"]},
    "Validation": {"enum": ["passed", "failed", "not_checked"]},
    "Failure": {"enum": [null, "assertion_failed", "precondition_blocked", "dependency_unavailable", "timeout", "invalid_schema", "integrity_failed", "redaction_failed", "coverage_gap", "report_failed", "not_executed"]},
    "ErrorCode": {"enum": [null, "InvalidInput", "MissingIdempotencyKey", "NotAuthorized", "NotVisible", "Missing", "BindingMismatch", "IllegalTransition", "VersionConflict", "IdempotencyConflict", "OperationInProgress", "ContractBlocked", "CurrentGateDenied", "FenceMismatch", "IntegrityFailure", "Unavailable", "ExternalCommitUnknown", "Unsupported", "UnsafeMaterial"]},
    "Digest": {"type": "object", "additionalProperties": false, "required": ["algorithm", "mode", "value"], "properties": {"algorithm": {"const": "SHA-256"}, "mode": {"enum": ["json-record", "raw-bytes"]}, "value": {"type": "string", "pattern": "^[0-9a-f]{64}$"}}},
    "RecordRef": {"type": "object", "additionalProperties": false, "required": ["path", "digest"], "properties": {"path": {"$ref": "#/$defs/Path"}, "digest": {"$ref": "#/$defs/Digest"}}},
    "Refs": {"type": "array", "uniqueItems": true, "items": {"$ref": "#/$defs/RecordRef"}},
    "DesignRefs": {"type": "array", "minItems": 1, "uniqueItems": true, "items": {"$ref": "#/$defs/DesignRef"}},
    "TcRefs": {"type": "array", "minItems": 1, "uniqueItems": true, "items": {"$ref": "#/$defs/TcId"}},
    "Slot": {"enum": ["Source", "Publisher", "Material", "Governance", "Scope", "Receiver", "Notice", "Observation"]},
    "Qualification": {"type": "object", "additionalProperties": false, "required": ["slot", "status", "contract_tag"], "properties": {"slot": {"$ref": "#/$defs/Slot"}, "status": {"enum": ["blocked", "qualified"]}, "contract_tag": {"oneOf": [{"$ref": "#/$defs/SafeTag"}, {"type": "null"}]}}},
    "Baseline": {"type": "object", "additionalProperties": false, "required": ["design_ref", "digest"], "properties": {"design_ref": {"$ref": "#/$defs/DesignRef"}, "digest": {"$ref": "#/$defs/Digest"}}},
    "Context": {
      "type": "object", "additionalProperties": false,
      "required": ["created_at", "implementation_commit", "generator_commit", "source_baselines", "profile", "proof_scope", "gate_stage", "registry_ref", "manifest_ref", "config_summary_digest", "owner_qualifications", "pg_mode", "browser_mode", "seed_tag"],
      "properties": {
        "created_at": {"$ref": "#/$defs/Time"}, "implementation_commit": {"type": "string", "pattern": "^([0-9a-f]{40}|[0-9a-f]{64})$"}, "generator_commit": {"type": "string", "pattern": "^([0-9a-f]{40}|[0-9a-f]{64})$"},
        "source_baselines": {"type": "array", "minItems": 1, "items": {"$ref": "#/$defs/Baseline"}}, "profile": {"$ref": "#/$defs/Profile"}, "proof_scope": {"enum": ["controlled-local", "formal-selected"]}, "gate_stage": {"enum": ["pr", "main", "nightly", "staging", "release"]},
        "registry_ref": {"$ref": "#/$defs/RecordRef"}, "manifest_ref": {"$ref": "#/$defs/RecordRef"}, "config_summary_digest": {"$ref": "#/$defs/Digest"},
        "owner_qualifications": {"type": "array", "maxItems": 8, "items": {"$ref": "#/$defs/Qualification"}}, "pg_mode": {"enum": ["actual-isolated", "fake", "unavailable", "not_required"]}, "browser_mode": {"enum": ["actual-isolated", "unavailable", "not_required"]}, "seed_tag": {"$ref": "#/$defs/SafeTag"}
      }
    },
    "RegistryItem": {"type": "object", "additionalProperties": false, "required": ["tc_id", "ev_id", "suite_id", "priority", "dataset_id", "cut_refs", "design_refs", "ac_refs"], "properties": {"tc_id": {"$ref": "#/$defs/TcId"}, "ev_id": {"$ref": "#/$defs/EvId"}, "suite_id": {"$ref": "#/$defs/SuiteId"}, "priority": {"const": "P0"}, "dataset_id": {"$ref": "#/$defs/DatasetId"}, "cut_refs": {"type": "array", "minItems": 1, "uniqueItems": true, "items": {"$ref": "#/$defs/CutId"}}, "design_refs": {"$ref": "#/$defs/DesignRefs"}, "ac_refs": {"type": "array", "minItems": 1, "uniqueItems": true, "items": {"$ref": "#/$defs/AcId"}}}},
    "Registry": {"type": "object", "additionalProperties": false, "required": ["cases"], "properties": {"cases": {"type": "array", "minItems": 98, "maxItems": 98, "items": {"$ref": "#/$defs/RegistryItem"}}}},
    "InventoryItem": {"type": "object", "additionalProperties": false, "required": ["category", "key", "design_ref"], "properties": {"category": {"enum": ["protocol", "object", "state_pair", "port", "port_method", "canonical_dto", "paged_method"]}, "key": {"$ref": "#/$defs/SafeTag"}, "design_ref": {"$ref": "#/$defs/DesignRef"}}},
    "Subcase": {"type": "object", "additionalProperties": false, "required": ["subcase_id", "assertion_ids", "inventory_keys"], "properties": {"subcase_id": {"$ref": "#/$defs/Slug"}, "assertion_ids": {"type": "array", "minItems": 1, "uniqueItems": true, "items": {"$ref": "#/$defs/Slug"}}, "inventory_keys": {"type": "array", "uniqueItems": true, "items": {"$ref": "#/$defs/SafeTag"}}}},
    "CaseManifest": {"type": "object", "additionalProperties": false, "required": ["tc_id", "subcases"], "properties": {"tc_id": {"$ref": "#/$defs/TcId"}, "subcases": {"type": "array", "minItems": 1, "items": {"$ref": "#/$defs/Subcase"}}}},
    "Manifest": {"type": "object", "additionalProperties": false, "required": ["inventory", "cases"], "properties": {"inventory": {"type": "array", "minItems": 1, "items": {"$ref": "#/$defs/InventoryItem"}}, "cases": {"type": "array", "minItems": 98, "maxItems": 98, "items": {"$ref": "#/$defs/CaseManifest"}}}},
    "Assertion": {"type": "object", "additionalProperties": false, "required": ["assertion_id", "matcher", "matched", "actual_error_code"], "properties": {"assertion_id": {"$ref": "#/$defs/Slug"}, "matcher": {"enum": ["equal-fields", "code-equals", "zero-effect", "transition-equals", "reference-pair", "atomic-write-set", "predicate-parity", "inventory-equals", "validator-rejects"]}, "matched": {"type": ["boolean", "null"]}, "actual_error_code": {"$ref": "#/$defs/ErrorCode"}}},
    "Counters": {"type": "object", "additionalProperties": false, "required": ["write_tx", "id", "clock", "context", "audit", "work", "observation_work", "projection_work", "owner_effect"], "properties": {"write_tx": {"$ref": "#/$defs/Count"}, "id": {"$ref": "#/$defs/Count"}, "clock": {"$ref": "#/$defs/Count"}, "context": {"$ref": "#/$defs/Count"}, "audit": {"$ref": "#/$defs/Count"}, "work": {"$ref": "#/$defs/Count"}, "observation_work": {"$ref": "#/$defs/Count"}, "projection_work": {"$ref": "#/$defs/Count"}, "owner_effect": {"$ref": "#/$defs/Count"}}},
    "Case": {
      "type": "object", "additionalProperties": false,
      "required": ["tc_id", "subcase_id", "execution_id", "suite_id", "ev_id", "context_ref", "dataset_id", "seed_tag", "design_refs", "inventory_keys", "status", "started_at", "finished_at", "duration_ms", "assertions", "effect_counters", "log_refs", "failure_code"],
      "properties": {"tc_id": {"$ref": "#/$defs/TcId"}, "subcase_id": {"$ref": "#/$defs/Slug"}, "execution_id": {"$ref": "#/$defs/Slug"}, "suite_id": {"$ref": "#/$defs/SuiteId"}, "ev_id": {"$ref": "#/$defs/EvId"}, "context_ref": {"$ref": "#/$defs/RecordRef"}, "dataset_id": {"$ref": "#/$defs/DatasetId"}, "seed_tag": {"$ref": "#/$defs/SafeTag"}, "design_refs": {"$ref": "#/$defs/DesignRefs"}, "inventory_keys": {"type": "array", "uniqueItems": true, "items": {"$ref": "#/$defs/SafeTag"}}, "status": {"$ref": "#/$defs/Status"}, "started_at": {"$ref": "#/$defs/NullableTime"}, "finished_at": {"$ref": "#/$defs/NullableTime"}, "duration_ms": {"$ref": "#/$defs/Count"}, "assertions": {"type": "array", "items": {"$ref": "#/$defs/Assertion"}}, "effect_counters": {"oneOf": [{"$ref": "#/$defs/Counters"}, {"type": "null"}]}, "log_refs": {"$ref": "#/$defs/Refs"}, "failure_code": {"$ref": "#/$defs/Failure"}}
    },
    "Log": {"type": "object", "additionalProperties": false, "required": ["execution_id", "stream", "phase", "event", "error_code"], "properties": {"execution_id": {"$ref": "#/$defs/Slug"}, "stream": {"enum": ["stdout", "stderr", "trace"]}, "phase": {"enum": ["start", "prepare", "reserve", "command", "a", "external", "b", "query", "shutdown", "tooling"]}, "event": {"enum": ["started", "asserted", "fault_injected", "blocked", "unavailable", "replayed", "probe_required", "completed", "failed", "stopped", "redacted"]}, "error_code": {"$ref": "#/$defs/ErrorCode"}}},
    "Counts": {"type": "object", "additionalProperties": false, "required": ["expected", "passed", "failed", "blocked", "unavailable", "not_run"], "properties": {"expected": {"$ref": "#/$defs/Count"}, "passed": {"$ref": "#/$defs/Count"}, "failed": {"$ref": "#/$defs/Count"}, "blocked": {"$ref": "#/$defs/Count"}, "unavailable": {"$ref": "#/$defs/Count"}, "not_run": {"$ref": "#/$defs/Count"}}},
    "Suite": {"type": "object", "additionalProperties": false, "required": ["suite_id", "context_ref", "tc_refs", "case_refs", "source_refs", "stdout_ref", "stderr_ref", "status", "counts", "failure_code"], "properties": {"suite_id": {"$ref": "#/$defs/SuiteId"}, "context_ref": {"$ref": "#/$defs/RecordRef"}, "tc_refs": {"$ref": "#/$defs/TcRefs"}, "case_refs": {"$ref": "#/$defs/Refs"}, "source_refs": {"$ref": "#/$defs/Refs"}, "stdout_ref": {"$ref": "#/$defs/RecordRef"}, "stderr_ref": {"$ref": "#/$defs/RecordRef"}, "status": {"$ref": "#/$defs/Status"}, "counts": {"$ref": "#/$defs/Counts"}, "failure_code": {"$ref": "#/$defs/Failure"}}},
    "CheckId": {"enum": ["dependency-boundary", "config-redline", "redaction", "no-static-evidence", "schema-integrity", "coverage"]},
    "Check": {"type": "object", "additionalProperties": false, "required": ["check_id", "stage", "context_ref", "input_refs", "status", "failure_code", "finding_tags"], "properties": {"check_id": {"$ref": "#/$defs/CheckId"}, "stage": {"enum": ["artifact", "seal"]}, "context_ref": {"$ref": "#/$defs/RecordRef"}, "input_refs": {"$ref": "#/$defs/Refs"}, "status": {"$ref": "#/$defs/Status"}, "failure_code": {"$ref": "#/$defs/Failure"}, "finding_tags": {"type": "array", "uniqueItems": true, "items": {"enum": ["schema", "digest", "path", "cross_run", "missing_raw", "missing_report", "static_status", "redaction", "orphan", "duplicate", "coverage", "qualification", "profile", "dependency"]}}}},
    "Run": {"type": "object", "additionalProperties": false, "required": ["context_ref", "expected_suites", "suite_refs", "check_refs", "source_refs", "status", "exit_code", "counts", "failure_code"], "properties": {"context_ref": {"$ref": "#/$defs/RecordRef"}, "expected_suites": {"type": "array", "minItems": 1, "uniqueItems": true, "items": {"$ref": "#/$defs/SuiteId"}}, "suite_refs": {"$ref": "#/$defs/Refs"}, "check_refs": {"$ref": "#/$defs/Refs"}, "source_refs": {"$ref": "#/$defs/Refs"}, "status": {"$ref": "#/$defs/Status"}, "exit_code": {"enum": [0, 1, 2, 3, 4]}, "counts": {"$ref": "#/$defs/Counts"}, "failure_code": {"$ref": "#/$defs/Failure"}}},
    "Evidence": {"type": "object", "additionalProperties": false, "required": ["ev_id", "tc_refs", "suite_id", "context_ref", "case_refs", "report_refs", "check_refs", "design_refs", "ac_refs", "proof_scope", "status", "redaction", "integrity"], "properties": {"ev_id": {"$ref": "#/$defs/EvId"}, "tc_refs": {"$ref": "#/$defs/TcRefs", "maxItems": 1}, "suite_id": {"$ref": "#/$defs/SuiteId"}, "context_ref": {"$ref": "#/$defs/RecordRef"}, "case_refs": {"$ref": "#/$defs/Refs", "minItems": 1}, "report_refs": {"$ref": "#/$defs/Refs", "minItems": 1}, "check_refs": {"$ref": "#/$defs/Refs", "minItems": 1}, "design_refs": {"$ref": "#/$defs/DesignRefs"}, "ac_refs": {"type": "array", "minItems": 1, "uniqueItems": true, "items": {"$ref": "#/$defs/AcId"}}, "proof_scope": {"enum": ["controlled-local", "formal-selected"]}, "status": {"enum": ["valid", "invalid", "pending"]}, "redaction": {"$ref": "#/$defs/Validation"}, "integrity": {"$ref": "#/$defs/Validation"}}},
    "IndexEntry": {"type": "object", "additionalProperties": false, "required": ["ev_id", "tc_refs", "detail_ref", "human_report_ref"], "properties": {"ev_id": {"$ref": "#/$defs/EvId"}, "tc_refs": {"$ref": "#/$defs/TcRefs", "maxItems": 1}, "detail_ref": {"$ref": "#/$defs/RecordRef"}, "human_report_ref": {"$ref": "#/$defs/RecordRef"}}},
    "Index": {"type": "object", "additionalProperties": false, "required": ["context_ref", "run_report_ref", "maturity", "expected_ev_ids", "entries", "completeness"], "properties": {"context_ref": {"$ref": "#/$defs/RecordRef"}, "run_report_ref": {"$ref": "#/$defs/RecordRef"}, "maturity": {"enum": ["minimal-index-shell", "final-ev-details"]}, "expected_ev_ids": {"type": "array", "minItems": 1, "uniqueItems": true, "items": {"$ref": "#/$defs/EvId"}}, "entries": {"type": "array", "items": {"$ref": "#/$defs/IndexEntry"}}, "completeness": {"enum": ["complete", "incomplete"]}}},
    "Note": {"type": "object", "additionalProperties": false, "required": ["note_id", "safe_code", "design_ref"], "properties": {"note_id": {"$ref": "#/$defs/Slug"}, "safe_code": {"enum": ["scope_limited", "owner_blocked", "candidate_only", "defect_open", "retest_required", "review_pending", "evidence_invalid"]}, "design_ref": {"$ref": "#/$defs/DesignRef"}}},
    "Draft": {"type": "object", "additionalProperties": false, "required": ["context_ref", "index_ref", "run_report_ref", "seal_check_refs", "review_state", "reviewer_tag", "notes"], "properties": {"context_ref": {"$ref": "#/$defs/RecordRef"}, "index_ref": {"$ref": "#/$defs/RecordRef"}, "run_report_ref": {"$ref": "#/$defs/RecordRef"}, "seal_check_refs": {"$ref": "#/$defs/Refs", "minItems": 1}, "review_state": {"enum": ["pending", "annotated"]}, "reviewer_tag": {"oneOf": [{"$ref": "#/$defs/SafeTag"}, {"type": "null"}]}, "notes": {"type": "array", "items": {"$ref": "#/$defs/Note"}}}}
  }
}
```

## 2. 必须与schema一起执行的semantic验证

JSON Schema验证形状，不提供业务/证据真实性。下列检查为强制，不可放宽成warning；任何失败exit4或实际case失败，不能补静态结果。

| 规则 | 精确要求 |
|---|---|
| 解析/版本 | UTF-8严格JSON、duplicate key拒绝，schema_version literal一致；unknown不能忽略，date-time用UTC且finish>=start |
| id/membership | run_id不等latest/点目录，不路径逃逸；TC/EV恰为Step6的98个双射，suite/DS/CUT/AC匹配registry；唯一性按ID不只按对象字节 |
| registry/manifest | 98TC完整且无重复；全部inventory类别的集与正式03相等：49/43/222/17/146/33/7；222pair必须含73A及全部S/R来源分类，guard true/false/R零写/S限制都有subcase |
| actual subcase | 每case的subcase_id/assertion_id/inventory_keys集合等于manifest所分配集合；status passed仅实际执行、所有matched=true且无遗漏，不能空assertions或手写pass |
| timing/status | passed/failed实际执行start/finish必非null；not_run或未启动的blocked/unavailable时间null/0 duration，已启动后blocked/unavailable保留实际时间及已执行assertions；passed failure_code=null，其余有限非null；不重写旧execution |
| counters | Q/replay case所有9counter=0；适用spy case不可null，其余可null；所有counter来自实际spy，不能报告器默认0 |
| suite aggregate | raw逐case汇总counts，expected=各status之和，expected manifest集合完整；缺执行也生成not_run，空suite不可passed；suite stdout/stderr ref必须存在（合法空文件也需实际hash） |
| gate aggregate | release expected_suites=全11且98全subcase；status/exit按Step9，任何失败/blocked/unavailable/not_run/nonzero check非0；report生成成功不能覆盖原gate失败 |
| context/baseline | 实际implementation/generator commit与design内容摘要、profile/DS seed一致；config_summary_digest仅hash经过脱敏的安全摘要bytes，不能hash/归档secret或原敏感config值；formal-selected必须actual资格 |
| qualifications | slot唯一，缺slot标blocked；qualified要actual正式contract依据且与原slot/consumer/profile一致；controlled fake不得qualified自证formal owner；status字段不是approval |
| paths/run | RecordRef统一相对logical path，禁止absolute/../重复run/project子目录/latest/symlink；按根和run_id绑定（acceptance为<run_id>-draft形状）；所有child run_id相等 |
| hash | record_digest mode=json-record：SHA256(RFC8785(record删顶层record_digest))；全部其他字段/child digest保留；raw-bytes仅exact file bytes，JSONL每line schema+文件raw hash；摘要不当asset/proof |
| DAG/source_refs | artifacts suite source_refs=[]，rendered suite JSON source_refs=[同run artifacts suite report ref]；run-report/summary同理；其他refs只向已有上游，禁止EV→index/index→seal/self-ref循环 |
| report generation | 人类MD由对应机器JSON渲染，不修改状态/refs；raw/log/report/check必须完整配对，缺失为gap/invalid；report字段声称通过仍由reader重新验证 |
| evidence/detail | tc_refs仅一个完整合法TC，suite/EV/required case refs/AC取registry与actual run，包含该TC所有required主执行subcase；case/report/6artifact checks合格才valid；不挑passed、不拼run |
| index maturity | shell entries可以空且completeness=incomplete，不能用于退出；final complete必须全部expected EV有效、全部MD且同run；失败仅incomplete index，不补造EV |
| seal/draft | seal checks在final index之后，input_refs含final index/run/EV/MD但不self；draft仅引用有效final index及6seal checks/非verdict；reviewer_tag=null表示无人审查，annotated也不signoff |
| redaction | logs无任意message/body/stack/ref/endpoint；DesignRef限本设计范围的实际路径/anchor无secret，SafeTag限已确认registry标签；capture/scanner与import重复核验，不信passed标签 |
| synthetic inputs | 工具negative数据是测试输入，不当final业务raw；CROSS-010实际运行assertion可留raw/EV；不把静态计划TC/EV表当run数据 |

## 3. 字段来源/可选性/失败保留

所有machine字段来源仅actual runner（case/times/counters/logs）、已确认registry/manifest、actual baseline与typed安全context，或从上游machine aggregate计算；没有caller任意JSON、ownerbody、payment、verdict、signoff字段。null不是伪空ref：Case时间/counters/Assertion.matched只在未执行或不适用时允许，ErrorCode/Failure的null只有相应语义允许；nullable contract_tag/reviewer_tag缺正式来源须null，不补假字符串。

case/log/suite/check/run/context JSON均用同envelope；stdout.log/stderr.log每行使用log-entry JSON envelope，无任意plain stderr保存；report MD不内嵌自身digest。registry/manifest无actual status。自引用只排顶层record_digest，Reference中的digest不排；source_baselines摘要是设计文件bytes（mode raw-bytes），不以fingerprint/assetdigest替代。

schema不能自行证明真实执行，依赖actual runner code/baseline与审查；CROSS-010至少逐required/unknown/version/enum/duplicate/path/跨run/hash/缺raw/report/空assertions/伪counter/不完整inventory/maturity循环单维变异，预期validator拒绝。设计JSON解析/局部ref检查不等工具已经实现或用例通过。
