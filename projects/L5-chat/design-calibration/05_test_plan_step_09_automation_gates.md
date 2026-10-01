# L5-chat 05 · Step 9 自动化与CI/CD门禁

## 1. Step状态

> done / pass_with_upstream_blockers；2026-10-01。全部用例/证据/路径均planned，未执行。

## 2. 本步输入

已通过Step8；05 SOP Step9与书写规范5.9；03 Step16、04 §12；真相源§2.15/§7。复杂cut逐个收口，前序gate成立才创建本文件。

## 3. SOP问题回答

自动化候选、触发、阶段、命令、失败和证据如何闭合？§9.1～4；非零且保留安全失败，realgate缺依赖必blocked。

## 4. 当前文档问题诊断

泛化CI“通过”会把SDK unbound/skip与真实OS缺失藏到本地报告中，多个suite共用文件容易误计。

## 5. 改动前后对比

| 改前 | 改后 | 原因 |
|---|---|---|
| 泛化CI“通过”会把SDK unbound/skip与真实OS缺失藏到本地报告中，多个suite共用文件容易误计。 | 本步§7结构化结论 | 防止历史设计与当前owner合同分叉 |

## 6. 设计取舍与复杂度

按16suite manifest区分scope与gate；采用既有三脚本合同，不增加AppCLI/遥测或后端runner。每suite独立审查阻塞/产物。

## 7. 结构化中间产物

### 9.1 suite manifest逐族门禁

runner计划在实际实现仓以suite独立filter/describe block关联以下TC；多个suite共用文件不代表运行全文件可自动统计每suite。TC/variant manifest执行前冻结，report逐instance对应，缺参数行就是失败。全部suite当前planned，无runner/锁文件或运行结果。

| suite | planned源入口 | TC集合 | proof_scope | PR/nightly/staging/release |
|---|---|---|---|---|
| intent | tests/intent_result_tests.ts | TC-PROTO-001, TC-PROTO-002, TC-PROTO-003, TC-PROTO-004, TC-PROTO-019, TC-PROTO-020, TC-PROTO-021, TC-PROTO-022, TC-PROTO-051, TC-PROTO-052, TC-PROTO-071, TC-PROTO-072, TC-STATE-031, TC-STATE-032, TC-STATE-033, TC-STATE-034, TC-STATE-035, TC-STATE-036, TC-CONC-001, TC-CONC-002, TC-CONC-003, TC-CONC-004, TC-CONC-005, TC-SAFE-003 | isolated_fixture | PR必需；nightly全参数+Web交互；staging/release需对应层复跑 |
| presentation | tests/presentation_accessibility_tests.tsx | TC-PROTO-005, TC-PROTO-006, TC-PROTO-011, TC-PROTO-012, TC-PROTO-013, TC-PROTO-014, TC-PROTO-015, TC-PROTO-016, TC-PROTO-017, TC-PROTO-018, TC-PROTO-031, TC-PROTO-032, TC-SAFE-008, TC-SAFE-009, TC-AT-001, TC-AT-002, TC-AT-003, TC-AT-004, TC-AT-005 | isolated_fixture | PR必需；nightly全参数+Web交互；staging/release需对应层复跑 |
| continuity | tests/continuity_recovery_tests.ts | TC-PROTO-007, TC-PROTO-008, TC-PROTO-023, TC-PROTO-024, TC-PROTO-049, TC-PROTO-050, TC-PROTO-053, TC-PROTO-054, TC-PROTO-055, TC-PROTO-056, TC-PROTO-057, TC-PROTO-058, TC-PROTO-059, TC-PROTO-060, TC-PROTO-067, TC-PROTO-068, TC-PROTO-069, TC-PROTO-070, TC-PROTO-073, TC-PROTO-074, TC-PROTO-075, TC-PROTO-076, TC-STATE-037, TC-STATE-038, TC-STATE-039, TC-STATE-043, TC-STATE-044, TC-STATE-045, TC-CONC-006, TC-CONC-009, TC-CONC-011, TC-CONC-012, TC-CONC-013, TC-CONC-014, TC-SAFE-010 | isolated_fixture | PR必需；nightly全参数+Web交互；staging/release需对应层复跑 |
| navigation | tests/navigation_boundary_tests.ts | TC-PROTO-009, TC-PROTO-010, TC-STATE-001, TC-STATE-002, TC-STATE-003, TC-STATE-004, TC-STATE-005, TC-STATE-006, TC-STATE-007, TC-STATE-008, TC-STATE-009, TC-SAFE-002 | isolated_fixture | PR必需；nightly全参数+Web交互；staging/release需对应层复跑 |
| persistence | tests/persistence_boundary_tests.ts | TC-PROTO-025, TC-PROTO-026, TC-PROTO-027, TC-PROTO-028, TC-PROTO-061, TC-PROTO-062, TC-PROTO-077, TC-PROTO-078, TC-PROTO-079, TC-PROTO-080, TC-STATE-040, TC-STATE-041, TC-STATE-042, TC-STATE-046, TC-STATE-047, TC-STATE-048, TC-CONC-010, TC-SAFE-004 | isolated_fixture | PR必需；nightly全参数+Web交互；staging/release需对应层复跑 |
| host-unit | tests/sdk_binding_tests.ts（TS platform adapter/factory）；src-tauri/tests/platform_boundary_tests.rs（Rust HostBoundaryGuard） | TC-PROTO-029, TC-PROTO-030, TC-STATE-049, TC-STATE-050, TC-STATE-051, TC-CFG-011, TC-CFG-012, TC-SAFE-007 | isolated_fixture | PR必需；nightly全参数+Web交互；staging/release需对应层复跑 |
| process | tests/project_process_boundary_tests.tsx | TC-PROTO-033, TC-PROTO-034, TC-PROTO-035, TC-PROTO-036, TC-PROTO-037, TC-PROTO-038, TC-PROTO-039, TC-PROTO-040, TC-PROTO-041, TC-PROTO-042, TC-PROTO-083, TC-PROTO-084, TC-STATE-010, TC-STATE-011, TC-STATE-012, TC-STATE-013, TC-STATE-014, TC-STATE-015, TC-STATE-016, TC-STATE-017, TC-STATE-018, TC-STATE-019, TC-STATE-020, TC-STATE-021, TC-STATE-022, TC-STATE-023, TC-STATE-024, TC-CFG-019, TC-CFG-020, TC-CONC-007, TC-CONC-008, TC-SAFE-005 | isolated_fixture | PR必需；nightly全参数+Web交互；staging/release需对应层复跑 |
| directory | tests/directory_relationship_boundary_tests.tsx | TC-PROTO-043, TC-PROTO-044, TC-PROTO-045, TC-PROTO-046, TC-PROTO-047, TC-PROTO-048, TC-PROTO-085, TC-PROTO-086, TC-STATE-025, TC-STATE-026, TC-STATE-027, TC-STATE-028, TC-STATE-029, TC-STATE-030, TC-SAFE-006 | isolated_fixture | PR必需；nightly全参数+Web交互；staging/release需对应层复跑 |
| diagnostic | tests/sdk_binding_tests.ts | TC-PROTO-063, TC-PROTO-064, TC-PROTO-065, TC-PROTO-066, TC-PROTO-081, TC-PROTO-082, TC-CFG-021, TC-CFG-022 | isolated_fixture | PR必需；nightly全参数+Web交互；staging/release需对应层复跑 |
| config | tests/sdk_binding_tests.ts | TC-CFG-001, TC-CFG-002, TC-CFG-003, TC-CFG-004, TC-CFG-005, TC-CFG-006, TC-CFG-007, TC-CFG-008, TC-CFG-009, TC-CFG-010, TC-CFG-013, TC-CFG-014, TC-CFG-015, TC-CFG-016, TC-CFG-017, TC-CFG-018, TC-CFG-023, TC-CFG-024 | isolated_fixture | PR必需；nightly全参数+Web交互；staging/release需对应层复跑 |
| errors | tests/sdk_binding_tests.ts | TC-ERROR-001, TC-ERROR-002, TC-ERROR-003, TC-ERROR-004, TC-ERROR-005, TC-ERROR-006, TC-ERROR-007, TC-ERROR-008, TC-ERROR-009, TC-ERROR-010, TC-ERROR-011, TC-ERROR-012, TC-ERROR-013, TC-ERROR-014, TC-ERROR-015 | isolated_fixture | PR必需；nightly全参数+Web交互；staging/release需对应层复跑 |
| boundary | tests/sdk_binding_tests.ts | TC-SAFE-001 | isolated_fixture | PR必需；nightly全参数+Web交互；staging/release需对应层复跑 |
| report | tests/sdk_binding_tests.ts | TC-REPORT-001, TC-REPORT-002, TC-REPORT-003, TC-REPORT-004, TC-REPORT-005, TC-REPORT-006, TC-REPORT-007 | isolated_fixture | PR必需；nightly全参数+Web交互；staging/release需对应层复跑 |
| sdk-real | tests/sdk_binding_tests.ts | TC-REAL-001, TC-REAL-004 | formal_sdk | PR不声明通过；staging/release必需当前blocked |
| desktop-real | src-tauri/tests/platform_boundary_tests.rs | TC-REAL-002 | native_host | PR不声明通过；staging/release必需当前blocked |
| at-real | tests/presentation_accessibility_tests.tsx | TC-REAL-003 | manual_at | PR不声明通过；staging/release必需当前blocked |

host-unit是复合suite：TC-PROTO-029/030与TC-STATE-049～051由TS platform adapter/factory harness运行；TC-CFG-011/012与TC-SAFE-007的nativeguard参数由Rust运行、其TS business-boundary参数由TS运行。manifest每variant注册唯一runner_kind和source入口；两引擎期望instance全集合并才能suite passed。纯Rust不能证明TS状态迁移，TS fakehost不能证明真实IPC。其它suite参数同样只能由预约入口对应runner运行。

### 9.2 自动化门禁图: planned pipeline

```text
PR source/type/import + config + local/unit/component + native guard
   -> run-scoped machine results -> schema/digest checks -> redaction -> local gate
nightly full parameter instances + shared-Web workflow
   -> same checks -> regression report (preview only)
staging formal SDK + actual Desktop/OS/AT
   -> blocked if capability/approval missing -> evidence completeness
release approved versions/config + full P0/required real layers
   -> report review -> future06 acceptance review (not current verdict)
```

每cut小循环：确认manifestTC→验证本层前置→运行或blocked→保留安全失败材料→映射EV候选→审查scope/缺行→门禁。P0 failed/blocked/skipped/not_run/missing artifact/redaction failure均阻断相应gate，不用skip伪装PASS。PR local gate通过仅证明local scope；release不得因PR通过绕过真实层。

### 9.3 planned命令合同

以下命令使用占位符而非真实run-id，未执行；未来脚本由07boundary实现。由fixture suite自身定义typed断言，runner不得套用假pass模板。

```sh
scripts/gates/run_ci_gate.sh --run-id <run_id> --artifact-root artifacts/test/<run_id> --config-profile desktop-ci
scripts/reports/generate_reports.sh --run-id <run_id> --artifact-root artifacts/test/<run_id> --report-root reports/runs/<run_id>
scripts/checks/check_redaction.sh --run-id <run_id> --artifact-root artifacts/test/<run_id> --report-root reports/runs/<run_id>
```

run_ci_gate负责选择profile允许suite/冻结manifest/实际runner调用及machine结果，TS候选Vitest+组件/Playwright，Rust候选cargo test；实际package commands留07实施，不冒称现存npm scripts。
固定顺序：run_ci_gate写安全machine材料→check_redaction首次只检查machine并写redaction-check.json/安全检查摘要（报告尚不存在，不把缺derived report当失败）→generate_reports验证本run schema/digest/ref与成熟度并生成待检查报告候选→check_redaction再次检查派生index/Markdown并写redaction-final.json，成功才发布最终可审阅report。首次与末次同脚本参数，依同run报告候选存在性区分阶段，不能跳过首次；机器证据和derived证据引用图无环。writer先脱敏stdout/stderr，不允许rawsecret先归档。
没有前置或runner时保留blocked suite report与sanitized空/有限stdout/stderr、finite failure_category；没有真实case执行不给executed/passed结果。失败退出非零；无run不生成任何suite报告。
取消/崩溃有实际runner上下文才报告failed/blocked，不能补造case执行时间或结果。禁止latest覆盖、跨run合并、重用run_id和symlink逃逸。

### 9.4 自动化责任

TS实现者负责local/组件/typed adapter；native实现者负责guard及真实host；测试负责人维护manifest/参数分母；SDK/owner负责人提供formal能力；环境负责人提供批准OS/AT/版本；报告writer只读machine artifact，不产生owner truth。当前角色未指派，全部planned/waiting。


## 8. 回填草稿

正式05 §9回填本步§7全部表、步骤和schema。

## 9. 待确认事项

CHAT-UP001～009、WS-UP001～008、CHAT-BASE001、native/生产预算/版本兼容/质量仍open或blocked。真实正向不得由fixture解除。无当前测试结果、EV或readiness。

## 10. 自检与下一Step门禁

216TC各有唯一suite，16suite均有入口、scope/阶段；path/脚本与03/04相同，无实际命令执行。 本地设计gate pass_with_upstream_blockers；进入Step10，先读本产物/台账与对应SOP。
