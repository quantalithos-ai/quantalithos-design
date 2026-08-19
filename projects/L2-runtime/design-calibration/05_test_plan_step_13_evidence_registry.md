# L2-runtime 05 Step 13 Annex：Canonical TC / EV / Acceptance Registry

> Parent：`05_test_plan_step_13_evidence.md`
> Authority：正式 `00-需求文档.md` §§14.1~14.4、Step 5、Step 6 与 Step 9
> 状态：`completed_as_step_13_annex`
> 事实边界：177 行均为 `planned_not_generated` identity；没有 run、artifact、report、evidence instance、verdict、signoff 或 readiness

## 1. 登记与解析规则

1. 本表是 future `CaseManifestArtifact.cases[]` 中 `case_id / evidence_id / owning_suite / acceptance_refs / veto_refs` 的唯一静态登记源；runner、manifest builder 和 report generator 禁止按前缀或 family 推断映射。
2. 每行恰好一个 canonical TC 和一个 canonical EV；TC、EV 均不得重复、遗漏或被 aggregate 复用。
3. `acceptance_refs`、`veto_refs` 使用分号分隔的逐 ID 有序集合；`-` 表示空数组，不是 wildcard、unknown 或 waived。两列不得同时为 `-`。
4. `acceptance_refs` 表示该 raw/aggregate case 可向 future 06 提供的候选验证方向；它不表示 AC 已通过。`veto_refs` 表示该 case 命中相应 forbidden condition 时必须上送的否决方向；它不替代 future 06 的裁决。
5. owning suite 必须严格等于 Step 9 registry。合法值只有 `unit_state`、`contract_protocol`、`service_semantics`、`entry_worker_job`、`fault_replay_consistency`、`config_builder`、`security_source_boundary`、`local_e2e`。
6. 本表不包含 `TC-QUAL-SLOT01~13`。它们当前为独立 `blocked_dependency/not_runnable` positive lane，只有正式 rebaseline 才能新增 TC/EV identity。

## 2. `unit_state`：35 raw

| case_id | evidence_id | owning_suite | acceptance_refs | veto_refs |
|---|---|---|---|---|
| `TC-CAP01-001` | `EV-UNIT-401` | `unit_state` | `AC-L2R-033;AC-L2R-034` | `VF-L2R-003;VF-L2R-008` |
| `TC-LOOP-002` | `EV-UNIT-421` | `unit_state` | `AC-L2R-007;AC-L2R-034;AC-L2R-035` | `-` |
| `TC-LOOP-003` | `EV-UNIT-422` | `unit_state` | `AC-L2R-007;AC-L2R-008;AC-L2R-032` | `-` |
| `TC-OBS-001` | `EV-UNIT-691` | `unit_state` | `AC-L2R-034;AC-L2R-036` | `-` |
| `TC-SM01-001` | `EV-UNIT-601` | `unit_state` | `AC-L2R-001;AC-L2R-006` | `VF-L2R-008` |
| `TC-SM02-001` | `EV-UNIT-602` | `unit_state` | `AC-L2R-001;AC-L2R-008;AC-L2R-018;AC-L2R-035` | `VF-L2R-004` |
| `TC-SM03-001` | `EV-UNIT-603` | `unit_state` | `AC-L2R-001;AC-L2R-007` | `-` |
| `TC-SM04-001` | `EV-UNIT-604` | `unit_state` | `AC-L2R-002;AC-L2R-009;AC-L2R-030` | `-` |
| `TC-SM05-001` | `EV-UNIT-605` | `unit_state` | `AC-L2R-002;AC-L2R-010;AC-L2R-028` | `VF-L2R-001` |
| `TC-SM06-001` | `EV-UNIT-606` | `unit_state` | `AC-L2R-003;AC-L2R-012;AC-L2R-013` | `VF-L2R-003;VF-L2R-004` |
| `TC-SM07-001` | `EV-UNIT-607` | `unit_state` | `AC-L2R-004;AC-L2R-014;AC-L2R-015` | `VF-L2R-002` |
| `TC-SM08-001` | `EV-UNIT-608` | `unit_state` | `AC-L2R-004;AC-L2R-015;AC-L2R-035` | `VF-L2R-004` |
| `TC-SM09-001` | `EV-UNIT-609` | `unit_state` | `AC-L2R-004;AC-L2R-016` | `-` |
| `TC-SM10-001` | `EV-UNIT-610` | `unit_state` | `AC-L2R-004;AC-L2R-025;AC-L2R-035` | `VF-L2R-005` |
| `TC-SM11-001` | `EV-UNIT-611` | `unit_state` | `AC-L2R-005;AC-L2R-017;AC-L2R-035` | `VF-L2R-004` |
| `TC-SM12-001` | `EV-UNIT-612` | `unit_state` | `AC-L2R-005;AC-L2R-018;AC-L2R-035` | `VF-L2R-004` |
| `TC-SM13-001` | `EV-UNIT-613` | `unit_state` | `AC-L2R-005;AC-L2R-020;AC-L2R-024` | `VF-L2R-005` |
| `TC-SM14-001` | `EV-UNIT-614` | `unit_state` | `AC-L2R-005;AC-L2R-020;AC-L2R-024;AC-L2R-035` | `VF-L2R-005` |
| `TC-SM15-001` | `EV-UNIT-615` | `unit_state` | `AC-L2R-009;AC-L2R-021;AC-L2R-032` | `VF-L2R-006` |
| `TC-SM16-001` | `EV-UNIT-616` | `unit_state` | `AC-L2R-024;AC-L2R-030;AC-L2R-036` | `VF-L2R-005` |
| `TC-SM17-001` | `EV-UNIT-617` | `unit_state` | `AC-L2R-011;AC-L2R-023;AC-L2R-032` | `VF-L2R-006` |
| `TC-SM18-001` | `EV-UNIT-618` | `unit_state` | `AC-L2R-032;AC-L2R-035` | `VF-L2R-004` |
| `TC-SM19-001` | `EV-UNIT-619` | `unit_state` | `AC-L2R-001;AC-L2R-007;AC-L2R-019` | `-` |
| `TC-SM20-001` | `EV-UNIT-620` | `unit_state` | `AC-L2R-001;AC-L2R-007;AC-L2R-019` | `-` |
| `TC-SM21-001` | `EV-UNIT-621` | `unit_state` | `AC-L2R-005;AC-L2R-019` | `-` |
| `TC-SM22-001` | `EV-UNIT-622` | `unit_state` | `AC-L2R-003;AC-L2R-011;AC-L2R-032` | `VF-L2R-003` |
| `TC-SM23-001` | `EV-UNIT-623` | `unit_state` | `AC-L2R-003;AC-L2R-011;AC-L2R-032` | `VF-L2R-003` |
| `TC-SM24-001` | `EV-UNIT-624` | `unit_state` | `AC-L2R-005;AC-L2R-019` | `VF-L2R-003` |
| `TC-SM25-001` | `EV-UNIT-625` | `unit_state` | `AC-L2R-025;AC-L2R-035` | `-` |
| `TC-SM26-001` | `EV-UNIT-626` | `unit_state` | `AC-L2R-007;AC-L2R-008;AC-L2R-031` | `-` |
| `TC-SM27-001` | `EV-UNIT-627` | `unit_state` | `AC-L2R-007;AC-L2R-034;AC-L2R-035` | `-` |
| `TC-SM28-001` | `EV-UNIT-628` | `unit_state` | `AC-L2R-018;AC-L2R-035` | `VF-L2R-004` |
| `TC-SM29-001` | `EV-UNIT-629` | `unit_state` | `AC-L2R-007;AC-L2R-035` | `-` |
| `TC-SM30-001` | `EV-UNIT-630` | `unit_state` | `AC-L2R-034;AC-L2R-035` | `VF-L2R-004` |
| `TC-SM31-001` | `EV-UNIT-631` | `unit_state` | `AC-L2R-015;AC-L2R-035` | `VF-L2R-004` |

## 3. `contract_protocol`：32 raw

| case_id | evidence_id | owning_suite | acceptance_refs | veto_refs |
|---|---|---|---|---|
| `TC-Q01-001` | `EV-CON-501` | `contract_protocol` | `AC-L2R-008;AC-L2R-034` | `-` |
| `TC-Q02-001` | `EV-CON-502` | `contract_protocol` | `AC-L2R-034;AC-L2R-035` | `-` |
| `TC-Q03-001` | `EV-CON-503` | `contract_protocol` | `AC-L2R-007;AC-L2R-027` | `VF-L2R-001` |
| `TC-Q04-001` | `EV-CON-504` | `contract_protocol` | `AC-L2R-009;AC-L2R-030` | `VF-L2R-003` |
| `TC-Q05-001` | `EV-CON-505` | `contract_protocol` | `AC-L2R-010;AC-L2R-028` | `VF-L2R-001` |
| `TC-Q06-001` | `EV-CON-506` | `contract_protocol` | `AC-L2R-012;AC-L2R-013` | `VF-L2R-003` |
| `TC-Q07-001` | `EV-CON-507` | `contract_protocol` | `AC-L2R-014;AC-L2R-015` | `VF-L2R-005` |
| `TC-Q08-001` | `EV-CON-508` | `contract_protocol` | `AC-L2R-016` | `-` |
| `TC-Q09-001` | `EV-CON-509` | `contract_protocol` | `AC-L2R-017;AC-L2R-018` | `VF-L2R-004` |
| `TC-Q10-001` | `EV-CON-510` | `contract_protocol` | `AC-L2R-020;AC-L2R-024` | `VF-L2R-005` |
| `TC-Q11-001` | `EV-CON-511` | `contract_protocol` | `AC-L2R-020;AC-L2R-024` | `VF-L2R-005` |
| `TC-Q12-001` | `EV-CON-512` | `contract_protocol` | `AC-L2R-030;AC-L2R-036` | `VF-L2R-005` |
| `TC-O01-001` | `EV-CON-531` | `contract_protocol` | `AC-L2R-034;AC-L2R-035` | `-` |
| `TC-O02-001` | `EV-CON-532` | `contract_protocol` | `AC-L2R-026;AC-L2R-027;AC-L2R-034` | `VF-L2R-001` |
| `TC-O03-001` | `EV-CON-533` | `contract_protocol` | `AC-L2R-015;AC-L2R-020;AC-L2R-034` | `VF-L2R-005` |
| `TC-O04-001` | `EV-CON-534` | `contract_protocol` | `AC-L2R-020;AC-L2R-024` | `VF-L2R-005` |
| `TC-O05-001` | `EV-CON-535` | `contract_protocol` | `AC-L2R-020;AC-L2R-024;AC-L2R-036` | `VF-L2R-005` |
| `TC-O06-001` | `EV-CON-536` | `contract_protocol` | `AC-L2R-030;AC-L2R-036` | `VF-L2R-005` |
| `TC-SLOT01-001` | `EV-CON-446` | `contract_protocol` | `AC-L2R-015;AC-L2R-022;AC-L2R-023;AC-L2R-032` | `VF-L2R-001;VF-L2R-002;VF-L2R-006` |
| `TC-SLOT02-001` | `EV-CON-447` | `contract_protocol` | `AC-L2R-007;AC-L2R-022;AC-L2R-027;AC-L2R-032` | `VF-L2R-001;VF-L2R-006` |
| `TC-SLOT03-001` | `EV-CON-448` | `contract_protocol` | `AC-L2R-009;AC-L2R-021;AC-L2R-032;AC-L2R-036` | `VF-L2R-006` |
| `TC-SLOT04-001` | `EV-CON-449` | `contract_protocol` | `AC-L2R-010;AC-L2R-028;AC-L2R-032` | `VF-L2R-001;VF-L2R-006` |
| `TC-SLOT05-001` | `EV-CON-450` | `contract_protocol` | `AC-L2R-015;AC-L2R-022;AC-L2R-023;AC-L2R-032` | `VF-L2R-001;VF-L2R-006` |
| `TC-SLOT06-001` | `EV-CON-451` | `contract_protocol` | `AC-L2R-015;AC-L2R-022;AC-L2R-023;AC-L2R-032;AC-L2R-035` | `VF-L2R-001;VF-L2R-002;VF-L2R-004;VF-L2R-006` |
| `TC-SLOT07-001` | `EV-CON-452` | `contract_protocol` | `AC-L2R-011;AC-L2R-013;AC-L2R-029;AC-L2R-032` | `VF-L2R-003;VF-L2R-006` |
| `TC-SLOT08-001` | `EV-CON-453` | `contract_protocol` | `AC-L2R-011;AC-L2R-012;AC-L2R-013;AC-L2R-032;AC-L2R-035` | `VF-L2R-003;VF-L2R-006` |
| `TC-SLOT09-001` | `EV-CON-454` | `contract_protocol` | `AC-L2R-016;AC-L2R-032;AC-L2R-035` | `VF-L2R-006` |
| `TC-SLOT10-001` | `EV-CON-455` | `contract_protocol` | `AC-L2R-017;AC-L2R-018;AC-L2R-032;AC-L2R-035` | `VF-L2R-004;VF-L2R-006` |
| `TC-SLOT11-001` | `EV-CON-456` | `contract_protocol` | `AC-L2R-020;AC-L2R-024;AC-L2R-032;AC-L2R-035` | `VF-L2R-005;VF-L2R-006` |
| `TC-SLOT12-001` | `EV-CON-457` | `contract_protocol` | `AC-L2R-024;AC-L2R-035;AC-L2R-036` | `VF-L2R-005;VF-L2R-006` |
| `TC-SLOT13-001` | `EV-CON-458` | `contract_protocol` | `AC-L2R-024;AC-L2R-030;AC-L2R-036` | `VF-L2R-005;VF-L2R-006` |
| `TC-LPORT-001` | `EV-CON-430` | `contract_protocol` | `AC-L2R-033;AC-L2R-034` | `VF-L2R-008` |

## 4. `service_semantics`：32 raw

| case_id | evidence_id | owning_suite | acceptance_refs | veto_refs |
|---|---|---|---|---|
| `TC-CAP02-001` | `EV-SVC-402` | `service_semantics` | `AC-L2R-001;AC-L2R-006;AC-L2R-032;AC-L2R-035` | `VF-L2R-008` |
| `TC-CAP02-002` | `EV-SVC-403` | `service_semantics` | `AC-L2R-008;AC-L2R-018;AC-L2R-035` | `VF-L2R-004` |
| `TC-CAP03-001` | `EV-SVC-404` | `service_semantics` | `AC-L2R-001;AC-L2R-007;AC-L2R-019;AC-L2R-027` | `VF-L2R-001` |
| `TC-CAP04-001` | `EV-SVC-405` | `service_semantics` | `AC-L2R-002;AC-L2R-009;AC-L2R-021;AC-L2R-030` | `VF-L2R-003` |
| `TC-CAP05-001` | `EV-SVC-406` | `service_semantics` | `AC-L2R-002;AC-L2R-010;AC-L2R-028` | `VF-L2R-001` |
| `TC-CAP06-001` | `EV-SVC-407` | `service_semantics` | `AC-L2R-003;AC-L2R-011;AC-L2R-012;AC-L2R-013;AC-L2R-025;AC-L2R-035` | `VF-L2R-003;VF-L2R-004` |
| `TC-CAP07-001` | `EV-SVC-408` | `service_semantics` | `AC-L2R-004;AC-L2R-014;AC-L2R-015;AC-L2R-023;AC-L2R-032` | `VF-L2R-002` |
| `TC-CAP07-002` | `EV-FAULT-409` | `service_semantics` | `AC-L2R-004;AC-L2R-015;AC-L2R-023;AC-L2R-032;AC-L2R-035` | `VF-L2R-001;VF-L2R-002;VF-L2R-004;VF-L2R-006` |
| `TC-CAP08-001` | `EV-SVC-410` | `service_semantics` | `AC-L2R-004;AC-L2R-016;AC-L2R-025;AC-L2R-035` | `VF-L2R-001` |
| `TC-CAP09-001` | `EV-FAULT-411` | `service_semantics` | `AC-L2R-004;AC-L2R-015;AC-L2R-025;AC-L2R-035` | `VF-L2R-004;VF-L2R-005` |
| `TC-CAP09-002` | `EV-SVC-412` | `service_semantics` | `AC-L2R-005;AC-L2R-019;AC-L2R-025;AC-L2R-035` | `VF-L2R-003` |
| `TC-CAP10-001` | `EV-FAULT-413` | `service_semantics` | `AC-L2R-005;AC-L2R-017;AC-L2R-018;AC-L2R-035` | `VF-L2R-004` |
| `TC-CAP11-001` | `EV-SVC-414` | `service_semantics` | `AC-L2R-005;AC-L2R-020;AC-L2R-024;AC-L2R-035` | `VF-L2R-005` |
| `TC-CAP12-001` | `EV-FAULT-415` | `service_semantics` | `AC-L2R-005;AC-L2R-020;AC-L2R-024;AC-L2R-030;AC-L2R-035;AC-L2R-036` | `VF-L2R-005;VF-L2R-006` |
| `TC-C01-001` | `EV-SVC-451` | `service_semantics` | `AC-L2R-001;AC-L2R-006;AC-L2R-032;AC-L2R-035` | `VF-L2R-008` |
| `TC-C02-001` | `EV-SVC-452` | `service_semantics` | `AC-L2R-008;AC-L2R-018;AC-L2R-035` | `VF-L2R-004` |
| `TC-C03-001` | `EV-SVC-453` | `service_semantics` | `AC-L2R-001;AC-L2R-007;AC-L2R-008;AC-L2R-019;AC-L2R-035` | `-` |
| `TC-C04-001` | `EV-SVC-454` | `service_semantics` | `AC-L2R-002;AC-L2R-009;AC-L2R-021;AC-L2R-029;AC-L2R-030` | `VF-L2R-003` |
| `TC-C05-001` | `EV-SVC-455` | `service_semantics` | `AC-L2R-002;AC-L2R-010;AC-L2R-028;AC-L2R-035` | `VF-L2R-001` |
| `TC-C06-001` | `EV-FAULT-456` | `service_semantics` | `AC-L2R-003;AC-L2R-011;AC-L2R-012;AC-L2R-013;AC-L2R-025;AC-L2R-029;AC-L2R-032;AC-L2R-035` | `VF-L2R-003;VF-L2R-004` |
| `TC-C07-001` | `EV-SVC-457` | `service_semantics` | `AC-L2R-003;AC-L2R-012;AC-L2R-013;AC-L2R-025;AC-L2R-035` | `VF-L2R-003` |
| `TC-C08-001` | `EV-SVC-458` | `service_semantics` | `AC-L2R-004;AC-L2R-014;AC-L2R-030` | `VF-L2R-005` |
| `TC-C09-001` | `EV-SVC-459` | `service_semantics` | `AC-L2R-004;AC-L2R-015;AC-L2R-023;AC-L2R-032` | `VF-L2R-001;VF-L2R-002` |
| `TC-C10-001` | `EV-SVC-460` | `service_semantics` | `AC-L2R-004;AC-L2R-016;AC-L2R-027;AC-L2R-033` | `VF-L2R-001` |
| `TC-C11-001` | `EV-FAULT-461` | `service_semantics` | `AC-L2R-004;AC-L2R-015;AC-L2R-025;AC-L2R-035` | `VF-L2R-004;VF-L2R-005` |
| `TC-C12-001` | `EV-SVC-462` | `service_semantics` | `AC-L2R-005;AC-L2R-017;AC-L2R-029;AC-L2R-034` | `VF-L2R-003` |
| `TC-C13-001` | `EV-FAULT-463` | `service_semantics` | `AC-L2R-005;AC-L2R-017;AC-L2R-018;AC-L2R-035` | `VF-L2R-004` |
| `TC-C14-001` | `EV-SVC-464` | `service_semantics` | `AC-L2R-005;AC-L2R-018;AC-L2R-019;AC-L2R-035` | `VF-L2R-004` |
| `TC-C15-001` | `EV-SVC-465` | `service_semantics` | `AC-L2R-005;AC-L2R-020;AC-L2R-024;AC-L2R-034;AC-L2R-035` | `VF-L2R-005` |
| `TC-C16-001` | `EV-SVC-466` | `service_semantics` | `AC-L2R-005;AC-L2R-020;AC-L2R-024;AC-L2R-029;AC-L2R-030;AC-L2R-036` | `VF-L2R-003;VF-L2R-005` |
| `TC-C17-001` | `EV-FAULT-467` | `service_semantics` | `AC-L2R-002;AC-L2R-009;AC-L2R-021;AC-L2R-025;AC-L2R-030;AC-L2R-032;AC-L2R-035;AC-L2R-036` | `VF-L2R-001;VF-L2R-006` |
| `TC-LOOP-001` | `EV-SVC-420` | `service_semantics` | `AC-L2R-001;AC-L2R-007;AC-L2R-031;AC-L2R-034` | `-` |

## 5. `entry_worker_job`：16 raw

| case_id | evidence_id | owning_suite | acceptance_refs | veto_refs |
|---|---|---|---|---|
| `TC-E01-001` | `EV-ENTRY-521` | `entry_worker_job` | `AC-L2R-003;AC-L2R-012;AC-L2R-013;AC-L2R-025;AC-L2R-035` | `VF-L2R-003;VF-L2R-004` |
| `TC-E02-001` | `EV-ENTRY-522` | `entry_worker_job` | `AC-L2R-004;AC-L2R-015;AC-L2R-025;AC-L2R-035` | `VF-L2R-003;VF-L2R-004;VF-L2R-005` |
| `TC-E03-001` | `EV-ENTRY-523` | `entry_worker_job` | `AC-L2R-004;AC-L2R-016;AC-L2R-025;AC-L2R-035` | `VF-L2R-005` |
| `TC-E04-001` | `EV-ENTRY-524` | `entry_worker_job` | `AC-L2R-009;AC-L2R-021;AC-L2R-025;AC-L2R-030;AC-L2R-035` | `VF-L2R-001` |
| `TC-E05-001` | `EV-ENTRY-525` | `entry_worker_job` | `AC-L2R-015;AC-L2R-021;AC-L2R-023;AC-L2R-025;AC-L2R-035` | `VF-L2R-001;VF-L2R-002` |
| `TC-E06-001` | `EV-ENTRY-526` | `entry_worker_job` | `AC-L2R-020;AC-L2R-024;AC-L2R-025;AC-L2R-035` | `VF-L2R-005` |
| `TC-J01-001` | `EV-JOB-541` | `entry_worker_job` | `AC-L2R-024;AC-L2R-030;AC-L2R-034;AC-L2R-035;AC-L2R-036` | `VF-L2R-005` |
| `TC-J02-001` | `EV-JOB-542` | `entry_worker_job` | `AC-L2R-009;AC-L2R-021;AC-L2R-025;AC-L2R-032;AC-L2R-035` | `VF-L2R-001` |
| `TC-J03-001` | `EV-JOB-543` | `entry_worker_job` | `AC-L2R-010;AC-L2R-028;AC-L2R-034;AC-L2R-035` | `VF-L2R-001` |
| `TC-J04-001` | `EV-JOB-544` | `entry_worker_job` | `AC-L2R-007;AC-L2R-018;AC-L2R-034;AC-L2R-035` | `VF-L2R-004` |
| `TC-J05-001` | `EV-JOB-545` | `entry_worker_job` | `AC-L2R-015;AC-L2R-017;AC-L2R-018;AC-L2R-035` | `VF-L2R-004` |
| `TC-J06-001` | `EV-JOB-546` | `entry_worker_job` | `AC-L2R-020;AC-L2R-024;AC-L2R-032;AC-L2R-035` | `VF-L2R-005` |
| `TC-J07-001` | `EV-JOB-547` | `entry_worker_job` | `AC-L2R-034;AC-L2R-035;AC-L2R-036` | `VF-L2R-005` |
| `TC-ENTRY-001` | `EV-ENTRY-433` | `entry_worker_job` | `AC-L2R-006;AC-L2R-008;AC-L2R-022;AC-L2R-033;AC-L2R-034` | `VF-L2R-008` |
| `TC-ENTRY-002` | `EV-ENTRY-434` | `entry_worker_job` | `AC-L2R-025;AC-L2R-034;AC-L2R-035` | `VF-L2R-004` |
| `TC-ENTRY-003` | `EV-ENTRY-435` | `entry_worker_job` | `AC-L2R-032;AC-L2R-034;AC-L2R-035` | `VF-L2R-006` |

## 6. `fault_replay_consistency`：25 raw

| case_id | evidence_id | owning_suite | acceptance_refs | veto_refs |
|---|---|---|---|---|
| `TC-LOOP-004` | `EV-FAULT-423` | `fault_replay_consistency` | `AC-L2R-007;AC-L2R-018;AC-L2R-032;AC-L2R-035` | `VF-L2R-004` |
| `TC-LOOP-005` | `EV-FAULT-424` | `fault_replay_consistency` | `AC-L2R-034;AC-L2R-035` | `VF-L2R-004` |
| `TC-LOOP-006` | `EV-FAULT-425` | `fault_replay_consistency` | `AC-L2R-008;AC-L2R-018;AC-L2R-032;AC-L2R-035` | `VF-L2R-004` |
| `TC-LPORT-002` | `EV-FAULT-431` | `fault_replay_consistency` | `AC-L2R-034;AC-L2R-035` | `VF-L2R-004` |
| `TC-LPORT-003` | `EV-FAULT-432` | `fault_replay_consistency` | `AC-L2R-034;AC-L2R-035` | `VF-L2R-004` |
| `TC-UOW-001` | `EV-FAULT-641` | `fault_replay_consistency` | `AC-L2R-034;AC-L2R-035` | `VF-L2R-004` |
| `TC-UOW-002` | `EV-FAULT-642` | `fault_replay_consistency` | `AC-L2R-018;AC-L2R-034;AC-L2R-035` | `VF-L2R-004` |
| `TC-UOW-003` | `EV-FAULT-643` | `fault_replay_consistency` | `AC-L2R-018;AC-L2R-034;AC-L2R-035` | `VF-L2R-004` |
| `TC-UOW-004` | `EV-FAULT-644` | `fault_replay_consistency` | `AC-L2R-018;AC-L2R-034;AC-L2R-035` | `VF-L2R-004` |
| `TC-UOW-005` | `EV-FAULT-645` | `fault_replay_consistency` | `AC-L2R-025;AC-L2R-034;AC-L2R-035` | `VF-L2R-004;VF-L2R-005` |
| `TC-UOW-006` | `EV-FAULT-646` | `fault_replay_consistency` | `AC-L2R-024;AC-L2R-034;AC-L2R-035` | `VF-L2R-005` |
| `TC-UOW-007` | `EV-FAULT-647` | `fault_replay_consistency` | `AC-L2R-034;AC-L2R-035` | `VF-L2R-004` |
| `TC-REPLAY-001` | `EV-FAULT-648` | `fault_replay_consistency` | `AC-L2R-034;AC-L2R-035` | `VF-L2R-004` |
| `TC-REPLAY-002` | `EV-FAULT-649` | `fault_replay_consistency` | `AC-L2R-025;AC-L2R-034;AC-L2R-035` | `VF-L2R-004;VF-L2R-005` |
| `TC-REPLAY-003` | `EV-FAULT-650` | `fault_replay_consistency` | `AC-L2R-034;AC-L2R-035` | `VF-L2R-004` |
| `TC-REPLAY-004` | `EV-FAULT-651` | `fault_replay_consistency` | `AC-L2R-034;AC-L2R-035` | `VF-L2R-004` |
| `TC-REPLAY-005` | `EV-FAULT-652` | `fault_replay_consistency` | `AC-L2R-020;AC-L2R-034;AC-L2R-035` | `VF-L2R-004;VF-L2R-005` |
| `TC-REPLAY-006` | `EV-FAULT-653` | `fault_replay_consistency` | `AC-L2R-034;AC-L2R-035` | `VF-L2R-004` |
| `TC-ERR-001` | `EV-CON-661` | `fault_replay_consistency` | `AC-L2R-032;AC-L2R-033;AC-L2R-034` | `VF-L2R-003;VF-L2R-008` |
| `TC-ERR-002` | `EV-CON-662` | `fault_replay_consistency` | `AC-L2R-025;AC-L2R-032;AC-L2R-035` | `VF-L2R-004` |
| `TC-ERR-003` | `EV-FAULT-663` | `fault_replay_consistency` | `AC-L2R-018;AC-L2R-032;AC-L2R-035` | `VF-L2R-004` |
| `TC-ERR-004` | `EV-CON-664` | `fault_replay_consistency` | `AC-L2R-023;AC-L2R-025;AC-L2R-032;AC-L2R-035` | `VF-L2R-002;VF-L2R-004` |
| `TC-ERR-005` | `EV-CON-665` | `fault_replay_consistency` | `AC-L2R-032;AC-L2R-033` | `VF-L2R-003;VF-L2R-006` |
| `TC-ERR-006` | `EV-FAULT-666` | `fault_replay_consistency` | `AC-L2R-025;AC-L2R-032;AC-L2R-035` | `VF-L2R-004;VF-L2R-005` |
| `TC-ERR-007` | `EV-STATIC-667` | `fault_replay_consistency` | `AC-L2R-018;AC-L2R-032;AC-L2R-034` | `VF-L2R-004;VF-L2R-008` |

## 7. `config_builder`：15 raw

| case_id | evidence_id | owning_suite | acceptance_refs | veto_refs |
|---|---|---|---|---|
| `TC-CFG01-001` | `EV-CFG-671` | `config_builder` | `AC-L2R-032;AC-L2R-033;AC-L2R-034` | `VF-L2R-003;VF-L2R-006;VF-L2R-008` |
| `TC-CFG02-001` | `EV-CFG-672` | `config_builder` | `AC-L2R-032;AC-L2R-033;AC-L2R-034` | `VF-L2R-003;VF-L2R-008` |
| `TC-CFG03-001` | `EV-CFG-673` | `config_builder` | `AC-L2R-031;AC-L2R-032;AC-L2R-033;AC-L2R-034` | `VF-L2R-003;VF-L2R-008` |
| `TC-CFG04-001` | `EV-CFG-674` | `config_builder` | `AC-L2R-030;AC-L2R-033;AC-L2R-034` | `VF-L2R-008` |
| `TC-CFG05-001` | `EV-CFG-675` | `config_builder` | `AC-L2R-031;AC-L2R-032;AC-L2R-033` | `VF-L2R-008` |
| `TC-CFG06-001` | `EV-CFG-676` | `config_builder` | `AC-L2R-022;AC-L2R-023;AC-L2R-032` | `VF-L2R-002;VF-L2R-006` |
| `TC-CFG07-001` | `EV-CFG-677` | `config_builder` | `AC-L2R-022;AC-L2R-023;AC-L2R-032` | `VF-L2R-001;VF-L2R-002;VF-L2R-006` |
| `TC-CFG08-001` | `EV-CFG-678` | `config_builder` | `AC-L2R-031;AC-L2R-032;AC-L2R-035` | `VF-L2R-004;VF-L2R-006` |
| `TC-CFG09-001` | `EV-STATIC-679` | `config_builder` | `AC-L2R-029;AC-L2R-033` | `VF-L2R-003` |
| `TC-CFG10-001` | `EV-CFG-680` | `config_builder` | `AC-L2R-022;AC-L2R-023;AC-L2R-032;AC-L2R-033` | `VF-L2R-001;VF-L2R-002;VF-L2R-006;VF-L2R-007` |
| `TC-CFG11-001` | `EV-CFG-681` | `config_builder` | `AC-L2R-030;AC-L2R-034;AC-L2R-035` | `VF-L2R-004;VF-L2R-008` |
| `TC-CFG12-001` | `EV-CFG-682` | `config_builder` | `AC-L2R-030;AC-L2R-032;AC-L2R-034;AC-L2R-035` | `VF-L2R-004;VF-L2R-006` |
| `TC-CFG13-001` | `EV-CFG-683` | `config_builder` | `AC-L2R-032;AC-L2R-033;AC-L2R-034` | `VF-L2R-002;VF-L2R-003;VF-L2R-006` |
| `TC-CFG14-001` | `EV-FAULT-684` | `config_builder` | `AC-L2R-018;AC-L2R-023;AC-L2R-025;AC-L2R-032;AC-L2R-035` | `VF-L2R-002;VF-L2R-004;VF-L2R-005` |
| `TC-CFG15-001` | `EV-STATIC-685` | `config_builder` | `AC-L2R-022;AC-L2R-023;AC-L2R-032;AC-L2R-036` | `VF-L2R-006;VF-L2R-008` |

## 8. `security_source_boundary`：17 raw

| case_id | evidence_id | owning_suite | acceptance_refs | veto_refs |
|---|---|---|---|---|
| `TC-BOUND-001` | `EV-STATIC-438` | `security_source_boundary` | `AC-L2R-022;AC-L2R-026;AC-L2R-027` | `VF-L2R-001` |
| `TC-BOUND-002` | `EV-SVC-439` | `security_source_boundary` | `AC-L2R-021;AC-L2R-024;AC-L2R-030` | `VF-L2R-005;VF-L2R-006` |
| `TC-BOUND-003` | `EV-STATIC-440` | `security_source_boundary` | `AC-L2R-011;AC-L2R-013;AC-L2R-022;AC-L2R-029` | `VF-L2R-001;VF-L2R-003` |
| `TC-BOUND-004` | `EV-FAULT-441` | `security_source_boundary` | `AC-L2R-015;AC-L2R-022;AC-L2R-023;AC-L2R-032` | `VF-L2R-001;VF-L2R-002` |
| `TC-BOUND-005` | `EV-STATIC-442` | `security_source_boundary` | `AC-L2R-016;AC-L2R-022;AC-L2R-027;AC-L2R-029;AC-L2R-033` | `VF-L2R-001;VF-L2R-003` |
| `TC-BOUND-006` | `EV-STATIC-443` | `security_source_boundary` | `AC-L2R-022;AC-L2R-026;AC-L2R-027` | `VF-L2R-001` |
| `TC-BOUND-007` | `EV-FAULT-444` | `security_source_boundary` | `AC-L2R-020;AC-L2R-024;AC-L2R-025;AC-L2R-030;AC-L2R-035` | `VF-L2R-005` |
| `TC-BOUND-008` | `EV-STATIC-445` | `security_source_boundary` | `AC-L2R-023;AC-L2R-032` | `VF-L2R-002;VF-L2R-006` |
| `TC-DEP-001` | `EV-STATIC-437` | `security_source_boundary` | `AC-L2R-022;AC-L2R-027;AC-L2R-033` | `VF-L2R-007;VF-L2R-008` |
| `TC-ENTRY-004` | `EV-STATIC-436` | `security_source_boundary` | `AC-L2R-022;AC-L2R-023;AC-L2R-032` | `VF-L2R-006` |
| `TC-OBS-002` | `EV-STATIC-692` | `security_source_boundary` | `AC-L2R-013;AC-L2R-029;AC-L2R-033` | `VF-L2R-003` |
| `TC-OBS-003` | `EV-FAULT-693` | `security_source_boundary` | `AC-L2R-020;AC-L2R-024;AC-L2R-036` | `VF-L2R-005;VF-L2R-006` |
| `TC-SEC-001` | `EV-STATIC-694` | `security_source_boundary` | `AC-L2R-029;AC-L2R-033` | `VF-L2R-003` |
| `TC-SEC-002` | `EV-STATIC-695` | `security_source_boundary` | `AC-L2R-013;AC-L2R-029;AC-L2R-033` | `VF-L2R-003` |
| `TC-SEC-003` | `EV-STATIC-696` | `security_source_boundary` | `AC-L2R-022;AC-L2R-026;AC-L2R-027` | `VF-L2R-001` |
| `TC-SOURCE-001` | `EV-STATIC-698` | `security_source_boundary` | `AC-L2R-034` | `VF-L2R-008` |
| `TC-TRUTH-001` | `EV-STATIC-697` | `security_source_boundary` | `AC-L2R-032;AC-L2R-036` | `VF-L2R-006` |

## 9. `local_e2e`：5 same-run aggregate

| case_id | evidence_id | owning_suite | acceptance_refs | veto_refs |
|---|---|---|---|---|
| `TC-E2E-001` | `EV-E2E-001` | `local_e2e` | `AC-L2R-001;AC-L2R-006;AC-L2R-007;AC-L2R-008;AC-L2R-034;AC-L2R-035` | `-` |
| `TC-E2E-002` | `EV-E2E-002` | `local_e2e` | `AC-L2R-002;AC-L2R-009;AC-L2R-010;AC-L2R-021;AC-L2R-028;AC-L2R-030` | `VF-L2R-001;VF-L2R-003` |
| `TC-E2E-003` | `EV-E2E-003` | `local_e2e` | `AC-L2R-003;AC-L2R-011;AC-L2R-012;AC-L2R-013;AC-L2R-025;AC-L2R-029;AC-L2R-035` | `VF-L2R-003;VF-L2R-004` |
| `TC-E2E-004` | `EV-E2E-004` | `local_e2e` | `AC-L2R-004;AC-L2R-014;AC-L2R-015;AC-L2R-016;AC-L2R-023;AC-L2R-025;AC-L2R-035` | `VF-L2R-001;VF-L2R-002;VF-L2R-004;VF-L2R-005` |
| `TC-E2E-005` | `EV-E2E-005` | `local_e2e` | `AC-L2R-005;AC-L2R-017;AC-L2R-018;AC-L2R-019;AC-L2R-020;AC-L2R-024;AC-L2R-034;AC-L2R-035;AC-L2R-036` | `VF-L2R-004;VF-L2R-005` |

## 10. Registry invariants and stop-review

Future manifest build must fail before suite execution when any invariant is false:

| Invariant | Exact condition | Failure posture |
|---|---|---|
| cardinality | 172 raw + 5 aggregate = 177 rows | `invalid_execution` |
| TC uniqueness | 177 distinct canonical `case_id` values, exact Step 6 set | `invalid_artifact` |
| EV uniqueness | 177 distinct canonical `evidence_id` values, exact Step 6 set | `invalid_artifact` |
| pair identity | every TC/EV pair exactly equals its Step 6 row | `invalid_artifact` |
| suite ownership | counts exactly 35/32/32/16/25/15/17/5 and exact Step 9 owner | `invalid_execution` |
| acceptance authority | refs resolve only to `AC-L2R-001~036` | `invalid_artifact` |
| veto authority | refs are empty or resolve only to `VF-L2R-001~008` | `invalid_artifact` |
| non-orphan | each row has at least one AC or VF; all 36 AC and 8 VF are referenced by the registry | `invalid_artifact` |
| qualification separation | no `TC-QUAL-*` or `EV-QUAL-*` in current 177 rows | `invalid_execution` |

```text
registry_rows = 177_planned_not_generated
raw_rows = 172
aggregate_rows = 5
duplicate_tc = 0
duplicate_ev = 0
orphan_row = 0
acceptance_authority_coverage = 36/36
veto_authority_coverage = 8/8
positive_qualification_rows = 0_blocked_outside_registry
actual_evidence = 0
annex_status = completed_as_step_13_annex
```
