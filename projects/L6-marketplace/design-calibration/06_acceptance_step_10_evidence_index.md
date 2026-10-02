# Step 10 规范性附录：98 TC/EV 验收归档计划

本文件是设计索引，不是运行 evidence-index，不提供run/digest/actual pass。归属[Step10](06_acceptance_step_10_evidence_audit.md)；identity/主suite/全部required子例由[05用例](05_test_plan_step_06_cases.md)、[自动化](05_test_plan_step_09_automation_gates.md)、[schema](05_test_plan_step_13_artifact_schema.md)唯一规定。

## 1. 逐EV审查规则

每行先回读对应TC的正式对象/flow/状态/错误与风险，再选择正式主suite、确认全部required raw/report和canonical AC/VETO归属、裁决缺失影响，完成该行设计停审后进入下一行。不能按EV名称猜suite，例如EV-API-001的主suite为W，不是新增API suite。

AC/VETO锚点采用05Step5反向匹配；05Step13§7.3共享CUT锚点及06功能/边界/接口/事务/非功能门禁补充无直接业务AC的case。补充仅解释既有canonical集合，不能改变05TC/EV/断言或引入GT到机器ac_refs。实际registry应从这些正式设计关系构造expected，actual index仍必须来自真实raw/report，不能复制本表成passed证据。

Step15反向总审计补齐72行细分门禁的AC/VETO支持边，identity/TC/EV/suite/断言/path未变。每条边只表明该TC是该门禁证据集的一部分，不表示单EV足以证明整个AC或VETO已触发/已排除；actual判定仍须该门禁所有必选证据与子例。每新增边已回核对应06表行/独立review，未增加任何运行或owner资格事实。

固定缩写只为表内路径压缩，展开是唯一字符串，不是另一个根：

- A = `artifacts/test/<run_id>/suites`。
- R = `reports/runs/<run_id>`。
- 每raw列的 `<subcase_id>` 在未来case_refs必须枚举该主TC全部required主执行subcase及execution，不是通配符路径，也不能只选passed。
- 每EV同时必须有 `artifacts/test/<run_id>/evidence/<完整EV-ID>.json`，表内R/evidence对应唯一MD，回R/evidence-index.md与R/suites/<真实suite>.json/md及该suite的artifact report.json。
- 缺失影响全行相同：本scope P0不能授予通过；命中该行VETO需Step11核查actual finding，缺证不当已触发或已排除VETO。
- “设计停审pass”只说明该行identity/完整来源/证明层/归档路径/裁决已核对；运行均planned/not-run。

## 2. 完整逐行索引

| Evidence ID | 主TC | suite | suite raw artifact（全部required） | EV report path | canonical AC / VETO | 独立停审/缺失影响 |
|---|---|---|---|---|---|---|
| EV-DOMAIN-001 | TC-SOURCE-001 | S | A/service-flow-fast/cases/TC-SOURCE-001/<subcase_id>.json | R/evidence/EV-DOMAIN-001.md | AC-MP-101, AC-MP-103, AC-MP-G02 | 设计停审pass / P0阻授通过 |
| EV-DOMAIN-002 | TC-SOURCE-002 | S | A/service-flow-fast/cases/TC-SOURCE-002/<subcase_id>.json | R/evidence/EV-DOMAIN-002.md | AC-MP-101, AC-MP-103, AC-MP-203 | 设计停审pass / P0阻授通过 |
| EV-DOMAIN-003 | TC-SOURCE-003 | S | A/service-flow-fast/cases/TC-SOURCE-003/<subcase_id>.json | R/evidence/EV-DOMAIN-003.md | AC-MP-101, AC-MP-102, AC-MP-103, AC-MP-G01, VETO-MP-1 | 设计停审pass / P0阻授通过 |
| EV-DOMAIN-004 | TC-SOURCE-004 | I | A/infra-runtime-fake/cases/TC-SOURCE-004/<subcase_id>.json | R/evidence/EV-DOMAIN-004.md | AC-MP-102, AC-MP-103, VETO-MP-1 | 设计停审pass / P0阻授通过 |
| EV-DOMAIN-005 | TC-SOURCE-005 | I | A/infra-runtime-fake/cases/TC-SOURCE-005/<subcase_id>.json | R/evidence/EV-DOMAIN-005.md | AC-MP-101, AC-MP-202, AC-MP-401, AC-MP-G01, VETO-MP-1 | 设计停审pass / P0阻授通过 |
| EV-DOMAIN-006 | TC-SOURCE-006 | S | A/service-flow-fast/cases/TC-SOURCE-006/<subcase_id>.json | R/evidence/EV-DOMAIN-006.md | AC-MP-103, AC-MP-303 | 设计停审pass / P0阻授通过 |
| EV-DOMAIN-007 | TC-REVIEW-001 | S | A/service-flow-fast/cases/TC-REVIEW-001/<subcase_id>.json | R/evidence/EV-DOMAIN-007.md | AC-MP-201, AC-MP-203, AC-MP-G02 | 设计停审pass / P0阻授通过 |
| EV-DOMAIN-008 | TC-REVIEW-002 | S | A/service-flow-fast/cases/TC-REVIEW-002/<subcase_id>.json | R/evidence/EV-DOMAIN-008.md | AC-MP-102, AC-MP-201, AC-MP-G02 | 设计停审pass / P0阻授通过 |
| EV-DOMAIN-009 | TC-REVIEW-003 | S | A/service-flow-fast/cases/TC-REVIEW-003/<subcase_id>.json | R/evidence/EV-DOMAIN-009.md | AC-MP-201, AC-MP-203, AC-MP-G02, VETO-MP-2 | 设计停审pass / P0阻授通过 |
| EV-DOMAIN-010 | TC-REVIEW-004 | S | A/service-flow-fast/cases/TC-REVIEW-004/<subcase_id>.json | R/evidence/EV-DOMAIN-010.md | AC-MP-102, AC-MP-201, AC-MP-202, AC-MP-203 | 设计停审pass / P0阻授通过 |
| EV-DOMAIN-011 | TC-REVIEW-005 | S | A/service-flow-fast/cases/TC-REVIEW-005/<subcase_id>.json | R/evidence/EV-DOMAIN-011.md | AC-MP-201, AC-MP-202, AC-MP-203 | 设计停审pass / P0阻授通过 |
| EV-DOMAIN-012 | TC-REVIEW-006 | I | A/infra-runtime-fake/cases/TC-REVIEW-006/<subcase_id>.json | R/evidence/EV-DOMAIN-012.md | AC-MP-201, AC-MP-202, AC-MP-203, AC-MP-403, AC-MP-503, AC-MP-504 | 设计停审pass / P0阻授通过 |
| EV-DOMAIN-013 | TC-REVIEW-007 | S | A/service-flow-fast/cases/TC-REVIEW-007/<subcase_id>.json | R/evidence/EV-DOMAIN-013.md | AC-MP-202, AC-MP-203, VETO-MP-2 | 设计停审pass / P0阻授通过 |
| EV-DOMAIN-014 | TC-REVIEW-008 | I | A/infra-runtime-fake/cases/TC-REVIEW-008/<subcase_id>.json | R/evidence/EV-DOMAIN-014.md | AC-MP-202, AC-MP-203, AC-MP-401, AC-MP-G01, VETO-MP-2 | 设计停审pass / P0阻授通过 |
| EV-DOMAIN-015 | TC-REVIEW-009 | S | A/service-flow-fast/cases/TC-REVIEW-009/<subcase_id>.json | R/evidence/EV-DOMAIN-015.md | AC-MP-201, AC-MP-203, AC-MP-501 | 设计停审pass / P0阻授通过 |
| EV-DOMAIN-016 | TC-REVIEW-010 | S | A/service-flow-fast/cases/TC-REVIEW-010/<subcase_id>.json | R/evidence/EV-DOMAIN-016.md | AC-MP-202, AC-MP-203, AC-MP-503 | 设计停审pass / P0阻授通过 |
| EV-PG-001 | TC-CATALOG-001 | P | A/postgres-atomicity/cases/TC-CATALOG-001/<subcase_id>.json | R/evidence/EV-PG-001.md | AC-MP-201, AC-MP-301, AC-MP-G02 | 设计停审pass / P0阻授通过 |
| EV-PG-002 | TC-CATALOG-002 | P | A/postgres-atomicity/cases/TC-CATALOG-002/<subcase_id>.json | R/evidence/EV-PG-002.md | AC-MP-301, AC-MP-G02 | 设计停审pass / P0阻授通过 |
| EV-PG-003 | TC-CATALOG-003 | P | A/postgres-atomicity/cases/TC-CATALOG-003/<subcase_id>.json | R/evidence/EV-PG-003.md | AC-MP-301, AC-MP-502, AC-MP-G01, AC-MP-G02 | 设计停审pass / P0阻授通过 |
| EV-PG-004 | TC-CATALOG-004 | P | A/postgres-atomicity/cases/TC-CATALOG-004/<subcase_id>.json | R/evidence/EV-PG-004.md | AC-MP-201, AC-MP-203, AC-MP-303, AC-MP-501, AC-MP-G02 | 设计停审pass / P0阻授通过 |
| EV-PG-005 | TC-CATALOG-005 | P | A/postgres-atomicity/cases/TC-CATALOG-005/<subcase_id>.json | R/evidence/EV-PG-005.md | AC-MP-201, AC-MP-202, AC-MP-203, AC-MP-501, VETO-MP-2 | 设计停审pass / P0阻授通过 |
| EV-PG-006 | TC-CATALOG-006 | P | A/postgres-atomicity/cases/TC-CATALOG-006/<subcase_id>.json | R/evidence/EV-PG-006.md | AC-MP-201, AC-MP-202, AC-MP-203, AC-MP-501, VETO-MP-2 | 设计停审pass / P0阻授通过 |
| EV-PG-007 | TC-CATALOG-007 | P | A/postgres-atomicity/cases/TC-CATALOG-007/<subcase_id>.json | R/evidence/EV-PG-007.md | AC-MP-301, AC-MP-302, AC-MP-303, AC-MP-G03, VETO-MP-3 | 设计停审pass / P0阻授通过 |
| EV-PG-008 | TC-CATALOG-008 | P | A/postgres-atomicity/cases/TC-CATALOG-008/<subcase_id>.json | R/evidence/EV-PG-008.md | AC-MP-301, AC-MP-302, AC-MP-303, AC-MP-G01, VETO-MP-3 | 设计停审pass / P0阻授通过 |
| EV-PG-009 | TC-CATALOG-009 | P | A/postgres-atomicity/cases/TC-CATALOG-009/<subcase_id>.json | R/evidence/EV-PG-009.md | AC-MP-303 | 设计停审pass / P0阻授通过 |
| EV-PG-010 | TC-CATALOG-010 | P | A/postgres-atomicity/cases/TC-CATALOG-010/<subcase_id>.json | R/evidence/EV-PG-010.md | AC-MP-302, AC-MP-303, AC-MP-G01 | 设计停审pass / P0阻授通过 |
| EV-WORKER-001 | TC-DISTRIBUTION-001 | W | A/entry-worker-job/cases/TC-DISTRIBUTION-001/<subcase_id>.json | R/evidence/EV-WORKER-001.md | AC-MP-401, VETO-MP-3 | 设计停审pass / P0阻授通过 |
| EV-WORKER-002 | TC-DISTRIBUTION-002 | W | A/entry-worker-job/cases/TC-DISTRIBUTION-002/<subcase_id>.json | R/evidence/EV-WORKER-002.md | AC-MP-401, AC-MP-403 | 设计停审pass / P0阻授通过 |
| EV-WORKER-003 | TC-DISTRIBUTION-003 | W | A/entry-worker-job/cases/TC-DISTRIBUTION-003/<subcase_id>.json | R/evidence/EV-WORKER-003.md | AC-MP-403, AC-MP-G02 | 设计停审pass / P0阻授通过 |
| EV-WORKER-004 | TC-DISTRIBUTION-004 | W | A/entry-worker-job/cases/TC-DISTRIBUTION-004/<subcase_id>.json | R/evidence/EV-WORKER-004.md | AC-MP-403, AC-MP-G02 | 设计停审pass / P0阻授通过 |
| EV-WORKER-005 | TC-DISTRIBUTION-005 | W | A/entry-worker-job/cases/TC-DISTRIBUTION-005/<subcase_id>.json | R/evidence/EV-WORKER-005.md | AC-MP-402, AC-MP-403, VETO-MP-4 | 设计停审pass / P0阻授通过 |
| EV-WORKER-006 | TC-DISTRIBUTION-006 | W | A/entry-worker-job/cases/TC-DISTRIBUTION-006/<subcase_id>.json | R/evidence/EV-WORKER-006.md | AC-MP-203, AC-MP-402, AC-MP-403, AC-MP-504 | 设计停审pass / P0阻授通过 |
| EV-WORKER-007 | TC-DISTRIBUTION-007 | W | A/entry-worker-job/cases/TC-DISTRIBUTION-007/<subcase_id>.json | R/evidence/EV-WORKER-007.md | AC-MP-203, AC-MP-401, AC-MP-403, AC-MP-501, AC-MP-502, AC-MP-504 | 设计停审pass / P0阻授通过 |
| EV-WORKER-008 | TC-DISTRIBUTION-008 | W | A/entry-worker-job/cases/TC-DISTRIBUTION-008/<subcase_id>.json | R/evidence/EV-WORKER-008.md | AC-MP-402, AC-MP-403, VETO-MP-4 | 设计停审pass / P0阻授通过 |
| EV-WORKER-009 | TC-DISTRIBUTION-009 | W | A/entry-worker-job/cases/TC-DISTRIBUTION-009/<subcase_id>.json | R/evidence/EV-WORKER-009.md | AC-MP-401, VETO-MP-3 | 设计停审pass / P0阻授通过 |
| EV-WORKER-010 | TC-DISTRIBUTION-010 | W | A/entry-worker-job/cases/TC-DISTRIBUTION-010/<subcase_id>.json | R/evidence/EV-WORKER-010.md | AC-MP-402, AC-MP-403, AC-MP-504 | 设计停审pass / P0阻授通过 |
| EV-DOMAIN-017 | TC-WITHDRAWAL-001 | S | A/service-flow-fast/cases/TC-WITHDRAWAL-001/<subcase_id>.json | R/evidence/EV-DOMAIN-017.md | AC-MP-501, AC-MP-502 | 设计停审pass / P0阻授通过 |
| EV-DOMAIN-018 | TC-WITHDRAWAL-002 | S | A/service-flow-fast/cases/TC-WITHDRAWAL-002/<subcase_id>.json | R/evidence/EV-DOMAIN-018.md | AC-MP-201, AC-MP-203, AC-MP-501, VETO-MP-5 | 设计停审pass / P0阻授通过 |
| EV-DOMAIN-019 | TC-WITHDRAWAL-003 | S | A/service-flow-fast/cases/TC-WITHDRAWAL-003/<subcase_id>.json | R/evidence/EV-DOMAIN-019.md | AC-MP-501, AC-MP-G01 | 设计停审pass / P0阻授通过 |
| EV-DOMAIN-020 | TC-WITHDRAWAL-004 | S | A/service-flow-fast/cases/TC-WITHDRAWAL-004/<subcase_id>.json | R/evidence/EV-DOMAIN-020.md | AC-MP-501, AC-MP-502, AC-MP-G03 | 设计停审pass / P0阻授通过 |
| EV-DOMAIN-021 | TC-WITHDRAWAL-005 | S | A/service-flow-fast/cases/TC-WITHDRAWAL-005/<subcase_id>.json | R/evidence/EV-DOMAIN-021.md | AC-MP-203, AC-MP-403, AC-MP-501, AC-MP-502, AC-MP-G03, VETO-MP-5 | 设计停审pass / P0阻授通过 |
| EV-DOMAIN-022 | TC-WITHDRAWAL-006 | S | A/service-flow-fast/cases/TC-WITHDRAWAL-006/<subcase_id>.json | R/evidence/EV-DOMAIN-022.md | AC-MP-502, AC-MP-G02 | 设计停审pass / P0阻授通过 |
| EV-DOMAIN-023 | TC-WITHDRAWAL-007 | S | A/service-flow-fast/cases/TC-WITHDRAWAL-007/<subcase_id>.json | R/evidence/EV-DOMAIN-023.md | AC-MP-502, AC-MP-504 | 设计停审pass / P0阻授通过 |
| EV-DOMAIN-024 | TC-WITHDRAWAL-008 | S | A/service-flow-fast/cases/TC-WITHDRAWAL-008/<subcase_id>.json | R/evidence/EV-DOMAIN-024.md | AC-MP-501, AC-MP-502, AC-MP-504, VETO-MP-5 | 设计停审pass / P0阻授通过 |
| EV-DOMAIN-025 | TC-WITHDRAWAL-009 | S | A/service-flow-fast/cases/TC-WITHDRAWAL-009/<subcase_id>.json | R/evidence/EV-DOMAIN-025.md | AC-MP-502, AC-MP-504 | 设计停审pass / P0阻授通过 |
| EV-DOMAIN-026 | TC-WITHDRAWAL-010 | S | A/service-flow-fast/cases/TC-WITHDRAWAL-010/<subcase_id>.json | R/evidence/EV-DOMAIN-026.md | AC-MP-302, AC-MP-502, AC-MP-503, AC-MP-G01 | 设计停审pass / P0阻授通过 |
| EV-RECOVERY-001 | TC-RECOVERY-001 | R | A/recovery-replay/cases/TC-RECOVERY-001/<subcase_id>.json | R/evidence/EV-RECOVERY-001.md | AC-MP-103, AC-MP-302, AC-MP-403, AC-MP-504, AC-MP-G02 | 设计停审pass / P0阻授通过 |
| EV-RECOVERY-002 | TC-RECOVERY-002 | R | A/recovery-replay/cases/TC-RECOVERY-002/<subcase_id>.json | R/evidence/EV-RECOVERY-002.md | AC-MP-101, AC-MP-103, AC-MP-403, AC-MP-G02 | 设计停审pass / P0阻授通过 |
| EV-RECOVERY-003 | TC-RECOVERY-003 | R | A/recovery-replay/cases/TC-RECOVERY-003/<subcase_id>.json | R/evidence/EV-RECOVERY-003.md | AC-MP-504 | 设计停审pass / P0阻授通过 |
| EV-RECOVERY-004 | TC-RECOVERY-004 | R | A/recovery-replay/cases/TC-RECOVERY-004/<subcase_id>.json | R/evidence/EV-RECOVERY-004.md | AC-MP-302, AC-MP-504, AC-MP-G01, AC-MP-G02 | 设计停审pass / P0阻授通过 |
| EV-RECOVERY-005 | TC-RECOVERY-005 | R | A/recovery-replay/cases/TC-RECOVERY-005/<subcase_id>.json | R/evidence/EV-RECOVERY-005.md | AC-MP-203, AC-MP-302, AC-MP-403, AC-MP-504, AC-MP-G02, VETO-MP-5 | 设计停审pass / P0阻授通过 |
| EV-RECOVERY-006 | TC-RECOVERY-006 | R | A/recovery-replay/cases/TC-RECOVERY-006/<subcase_id>.json | R/evidence/EV-RECOVERY-006.md | AC-MP-203, AC-MP-403, AC-MP-501, AC-MP-504, AC-MP-G02, VETO-MP-5 | 设计停审pass / P0阻授通过 |
| EV-RECOVERY-007 | TC-RECOVERY-007 | R | A/recovery-replay/cases/TC-RECOVERY-007/<subcase_id>.json | R/evidence/EV-RECOVERY-007.md | AC-MP-302, AC-MP-502, AC-MP-503, AC-MP-G02 | 设计停审pass / P0阻授通过 |
| EV-RECOVERY-008 | TC-RECOVERY-008 | R | A/recovery-replay/cases/TC-RECOVERY-008/<subcase_id>.json | R/evidence/EV-RECOVERY-008.md | AC-MP-503, AC-MP-504, AC-MP-G02 | 设计停审pass / P0阻授通过 |
| EV-RECOVERY-009 | TC-RECOVERY-009 | R | A/recovery-replay/cases/TC-RECOVERY-009/<subcase_id>.json | R/evidence/EV-RECOVERY-009.md | AC-MP-503, AC-MP-504, AC-MP-G02, VETO-MP-5 | 设计停审pass / P0阻授通过 |
| EV-RECOVERY-010 | TC-RECOVERY-010 | R | A/recovery-replay/cases/TC-RECOVERY-010/<subcase_id>.json | R/evidence/EV-RECOVERY-010.md | AC-MP-501, AC-MP-504, AC-MP-G02, AC-MP-G03, VETO-MP-5 | 设计停审pass / P0阻授通过 |
| EV-RECOVERY-011 | TC-RECOVERY-011 | R | A/recovery-replay/cases/TC-RECOVERY-011/<subcase_id>.json | R/evidence/EV-RECOVERY-011.md | AC-MP-504 | 设计停审pass / P0阻授通过 |
| EV-PG-011 | TC-REFERENCE-001 | P | A/postgres-atomicity/cases/TC-REFERENCE-001/<subcase_id>.json | R/evidence/EV-PG-011.md | AC-MP-102, AC-MP-103, AC-MP-303, AC-MP-504, AC-MP-G02 | 设计停审pass / P0阻授通过 |
| EV-PG-012 | TC-REFERENCE-002 | P | A/postgres-atomicity/cases/TC-REFERENCE-002/<subcase_id>.json | R/evidence/EV-PG-012.md | AC-MP-103, AC-MP-302, AC-MP-303, AC-MP-504 | 设计停审pass / P0阻授通过 |
| EV-PG-013 | TC-REFERENCE-003 | P | A/postgres-atomicity/cases/TC-REFERENCE-003/<subcase_id>.json | R/evidence/EV-PG-013.md | AC-MP-303, AC-MP-504, AC-MP-G02 | 设计停审pass / P0阻授通过 |
| EV-PG-014 | TC-REFERENCE-004 | P | A/postgres-atomicity/cases/TC-REFERENCE-004/<subcase_id>.json | R/evidence/EV-PG-014.md | AC-MP-303, AC-MP-504, AC-MP-G02 | 设计停审pass / P0阻授通过 |
| EV-PG-015 | TC-REFERENCE-005 | P | A/postgres-atomicity/cases/TC-REFERENCE-005/<subcase_id>.json | R/evidence/EV-PG-015.md | AC-MP-303, AC-MP-504, AC-MP-G02 | 设计停审pass / P0阻授通过 |
| EV-PG-016 | TC-REFERENCE-006 | P | A/postgres-atomicity/cases/TC-REFERENCE-006/<subcase_id>.json | R/evidence/EV-PG-016.md | AC-MP-103, AC-MP-303, AC-MP-504, AC-MP-G02 | 设计停审pass / P0阻授通过 |
| EV-CONFIG-001 | TC-CONFIG-001 | C | A/config-redline/cases/TC-CONFIG-001/<subcase_id>.json | R/evidence/EV-CONFIG-001.md | AC-MP-G01 | 设计停审pass / P0阻授通过 |
| EV-CONFIG-002 | TC-CONFIG-002 | C | A/config-redline/cases/TC-CONFIG-002/<subcase_id>.json | R/evidence/EV-CONFIG-002.md | AC-MP-G01 | 设计停审pass / P0阻授通过 |
| EV-CONFIG-003 | TC-CONFIG-003 | C | A/config-redline/cases/TC-CONFIG-003/<subcase_id>.json | R/evidence/EV-CONFIG-003.md | AC-MP-G01 | 设计停审pass / P0阻授通过 |
| EV-CONFIG-004 | TC-CONFIG-004 | C | A/config-redline/cases/TC-CONFIG-004/<subcase_id>.json | R/evidence/EV-CONFIG-004.md | AC-MP-G01 | 设计停审pass / P0阻授通过 |
| EV-CONFIG-005 | TC-CONFIG-005 | C | A/config-redline/cases/TC-CONFIG-005/<subcase_id>.json | R/evidence/EV-CONFIG-005.md | AC-MP-G01, AC-MP-G03 | 设计停审pass / P0阻授通过 |
| EV-CONFIG-006 | TC-CONFIG-006 | C | A/config-redline/cases/TC-CONFIG-006/<subcase_id>.json | R/evidence/EV-CONFIG-006.md | AC-MP-G01 | 设计停审pass / P0阻授通过 |
| EV-CONFIG-007 | TC-CONFIG-007 | C | A/config-redline/cases/TC-CONFIG-007/<subcase_id>.json | R/evidence/EV-CONFIG-007.md | AC-MP-503, AC-MP-G01, AC-MP-G04, VETO-MP-1 | 设计停审pass / P0阻授通过 |
| EV-CONFIG-008 | TC-CONFIG-008 | C | A/config-redline/cases/TC-CONFIG-008/<subcase_id>.json | R/evidence/EV-CONFIG-008.md | AC-MP-G01 | 设计停审pass / P0阻授通过 |
| EV-CONFIG-009 | TC-CONFIG-009 | C | A/config-redline/cases/TC-CONFIG-009/<subcase_id>.json | R/evidence/EV-CONFIG-009.md | AC-MP-G01 | 设计停审pass / P0阻授通过 |
| EV-CONFIG-010 | TC-CONFIG-010 | C | A/config-redline/cases/TC-CONFIG-010/<subcase_id>.json | R/evidence/EV-CONFIG-010.md | AC-MP-G01 | 设计停审pass / P0阻授通过 |
| EV-CONFIG-011 | TC-CONFIG-011 | C | A/config-redline/cases/TC-CONFIG-011/<subcase_id>.json | R/evidence/EV-CONFIG-011.md | AC-MP-G01, AC-MP-G04 | 设计停审pass / P0阻授通过 |
| EV-CONFIG-012 | TC-CONFIG-012 | C | A/config-redline/cases/TC-CONFIG-012/<subcase_id>.json | R/evidence/EV-CONFIG-012.md | AC-MP-101, AC-MP-202, AC-MP-402, AC-MP-G01, AC-MP-G03, VETO-MP-4 | 设计停审pass / P0阻授通过 |
| EV-UNIT-001 | TC-CROSS-001 | D | A/contract-domain-fast/cases/TC-CROSS-001/<subcase_id>.json | R/evidence/EV-UNIT-001.md | AC-MP-103, AC-MP-403, AC-MP-G02 | 设计停审pass / P0阻授通过 |
| EV-UNIT-002 | TC-CROSS-002 | D | A/contract-domain-fast/cases/TC-CROSS-002/<subcase_id>.json | R/evidence/EV-UNIT-002.md | AC-MP-103, AC-MP-403, AC-MP-G02 | 设计停审pass / P0阻授通过 |
| EV-PG-017 | TC-CROSS-003 | P | A/postgres-atomicity/cases/TC-CROSS-003/<subcase_id>.json | R/evidence/EV-PG-017.md | AC-MP-G02 | 设计停审pass / P0阻授通过 |
| EV-PG-018 | TC-CROSS-004 | P | A/postgres-atomicity/cases/TC-CROSS-004/<subcase_id>.json | R/evidence/EV-PG-018.md | AC-MP-301, AC-MP-302, AC-MP-303, AC-MP-504, AC-MP-G03 | 设计停审pass / P0阻授通过 |
| EV-API-001 | TC-CROSS-005 | W | A/entry-worker-job/cases/TC-CROSS-005/<subcase_id>.json | R/evidence/EV-API-001.md | AC-MP-302, AC-MP-504, AC-MP-G02 | 设计停审pass / P0阻授通过 |
| EV-REDACTION-001 | TC-CROSS-006 | X | A/redaction-boundary/cases/TC-CROSS-006/<subcase_id>.json | R/evidence/EV-REDACTION-001.md | AC-MP-102, AC-MP-503, AC-MP-G01, AC-MP-G02, AC-MP-G03, AC-MP-G04, VETO-MP-1 | 设计停审pass / P0阻授通过 |
| EV-API-002 | TC-CROSS-007 | W | A/entry-worker-job/cases/TC-CROSS-007/<subcase_id>.json | R/evidence/EV-API-002.md | AC-MP-101, AC-MP-202, AC-MP-401, AC-MP-G01, VETO-MP-3 | 设计停审pass / P0阻授通过 |
| EV-WEB-001 | TC-CROSS-008 | B | A/web-protocol-workflow/cases/TC-CROSS-008/<subcase_id>.json | R/evidence/EV-WEB-001.md | AC-MP-G04 | 设计停审pass / P0阻授通过 |
| EV-CONFIG-013 | TC-CROSS-009 | C | A/config-redline/cases/TC-CROSS-009/<subcase_id>.json | R/evidence/EV-CONFIG-013.md | AC-MP-402, AC-MP-G01, AC-MP-G02, AC-MP-G03, VETO-MP-1 | 设计停审pass / P0阻授通过 |
| EV-RELEASE-001 | TC-CROSS-010 | E | A/report-generation-audit/cases/TC-CROSS-010/<subcase_id>.json | R/evidence/EV-RELEASE-001.md | AC-MP-503, AC-MP-504, AC-MP-G01, AC-MP-G02, AC-MP-G03, VETO-MP-1, VETO-MP-5 | 设计停审pass / P0阻授通过 |
| EV-UNIT-003 | TC-CROSS-011 | D | A/contract-domain-fast/cases/TC-CROSS-011/<subcase_id>.json | R/evidence/EV-UNIT-003.md | AC-MP-G01, AC-MP-G04 | 设计停审pass / P0阻授通过 |
| EV-DOMAIN-027 | TC-CROSS-012 | D | A/contract-domain-fast/cases/TC-CROSS-012/<subcase_id>.json | R/evidence/EV-DOMAIN-027.md | AC-MP-101, AC-MP-102, AC-MP-502, AC-MP-G01, AC-MP-G02, VETO-MP-5 | 设计停审pass / P0阻授通过 |
| EV-DOMAIN-028 | TC-CROSS-013 | D | A/contract-domain-fast/cases/TC-CROSS-013/<subcase_id>.json | R/evidence/EV-DOMAIN-028.md | AC-MP-G02, VETO-MP-5 | 设计停审pass / P0阻授通过 |
| EV-UNIT-004 | TC-CROSS-014 | I | A/infra-runtime-fake/cases/TC-CROSS-014/<subcase_id>.json | R/evidence/EV-UNIT-004.md | AC-MP-G01, AC-MP-G02 | 设计停审pass / P0阻授通过 |
| EV-PG-019 | TC-CROSS-015 | P | A/postgres-atomicity/cases/TC-CROSS-015/<subcase_id>.json | R/evidence/EV-PG-019.md | AC-MP-502, AC-MP-503, AC-MP-504, AC-MP-G02, AC-MP-G03, VETO-MP-5 | 设计停审pass / P0阻授通过 |
| EV-PG-020 | TC-CROSS-016 | P | A/postgres-atomicity/cases/TC-CROSS-016/<subcase_id>.json | R/evidence/EV-PG-020.md | AC-MP-201, AC-MP-203, AC-MP-403, AC-MP-501, AC-MP-502, AC-MP-G02, VETO-MP-5 | 设计停审pass / P0阻授通过 |
| EV-PG-021 | TC-CROSS-017 | P | A/postgres-atomicity/cases/TC-CROSS-017/<subcase_id>.json | R/evidence/EV-PG-021.md | AC-MP-301, AC-MP-302, AC-MP-303, AC-MP-402, AC-MP-403, AC-MP-502, AC-MP-503, AC-MP-504, AC-MP-G03, VETO-MP-3 | 设计停审pass / P0阻授通过 |
| EV-API-003 | TC-CROSS-018 | W | A/entry-worker-job/cases/TC-CROSS-018/<subcase_id>.json | R/evidence/EV-API-003.md | AC-MP-G01, AC-MP-G02 | 设计停审pass / P0阻授通过 |
| EV-WORKER-021 | TC-CROSS-019 | W | A/entry-worker-job/cases/TC-CROSS-019/<subcase_id>.json | R/evidence/EV-WORKER-021.md | AC-MP-403, AC-MP-502, AC-MP-504, AC-MP-G02, AC-MP-G03, VETO-MP-5 | 设计停审pass / P0阻授通过 |
| EV-UNIT-005 | TC-CROSS-020 | D | A/contract-domain-fast/cases/TC-CROSS-020/<subcase_id>.json | R/evidence/EV-UNIT-005.md | AC-MP-G01, AC-MP-G02, AC-MP-G03, VETO-MP-4 | 设计停审pass / P0阻授通过 |
| EV-WEB-002 | TC-CROSS-021 | B | A/web-protocol-workflow/cases/TC-CROSS-021/<subcase_id>.json | R/evidence/EV-WEB-002.md | AC-MP-G04, VETO-MP-4 | 设计停审pass / P0阻授通过 |
| EV-CONFIG-014 | TC-CROSS-022 | C | A/config-redline/cases/TC-CROSS-022/<subcase_id>.json | R/evidence/EV-CONFIG-014.md | AC-MP-402, AC-MP-G01, AC-MP-G03 | 设计停审pass / P0阻授通过 |
| EV-RELEASE-002 | TC-CROSS-023 | M | A/release-main-smoke/cases/TC-CROSS-023/<subcase_id>.json | R/evidence/EV-RELEASE-002.md | AC-MP-101, AC-MP-102, AC-MP-103, AC-MP-201, AC-MP-202, AC-MP-203, AC-MP-301, AC-MP-302, AC-MP-303, AC-MP-401, AC-MP-402, AC-MP-403, AC-MP-501, AC-MP-502, AC-MP-503, AC-MP-504, AC-MP-G01, AC-MP-G02, AC-MP-G04 | 设计停审pass / P0阻授通过 |

## 3. 跨EV审计

设计identity集合已与05逐行回核：九族6/10/10/10/10/11/6/12/23共98TC与98唯一EV；D6/S22/I5/P21/W14/B2/C14/X1/R11/E1/M1主归属互斥。全部20canonical AC及五VETO至少有直接正反来源，全部98行均有canonical锚点、固定raw/JSON/MD/主suite/report/index回链，不能按98计数代替required集合完整性。

schema/state/canonical/page/port shared case必须展开49协议/43对象/222pair/17ports/146methods/33DTO/七paged caller及所有guard/叶字段/故障/竞争子例。actual实现执行前冻结manifest和主execution；追加补层不是重选主执行。smoke的多AC锚点只提供辅助闭环，不能替任何独立P0 gate。

全98逐行设计停审完成，不存在无主TC/无主suite/无canonical锚点的计划EV。未来actual evidence还须六checks两stage、full final index、人工审查和formal-selected qualification；本表不是actual覆盖、合格EV或签核。
