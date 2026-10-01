# L5-chat 06 · Step 10 可观测性、审计与证据门禁

## 1. Step状态

> done / pass_with_upstream_blockers；2026-10-01。这里只定义验收规则，所有TC/EV为planned预约，无实际验收结果或签署。

## 2. 本步输入

前序Step9 local gate已通过；06 SOP Step10、书写规范5.10；00实际36AC、03契约、04配置、05TC/EV和证据schema；中间产物§5.10与真相源§7。

## 3. SOP问题回答

audit/trace/log是否必须、每EV/case/report路径、handoff/VETO/risk审阅与机器schema何在？§10.1～7与18卡、检查表；Chat不产businessaudit。

## 4. 当前文档问题诊断

正式EV只是预约，report与parentAC缺独立绑定/署名基线；单run难涵盖多个OS，签署/digest容易循环或模板全pass。

## 5. 改动前后对比

| 改前 | 改后 | 原因 |
|---|---|---|
| 正式EV只是预约，report与parentAC缺独立绑定/署名基线；单run难涵盖多个OS，签署/digest容易循环或模板全pass。 | §7结构化裁决 | 保持正式contract/TC/EV与证据能力一致 |

## 6. 验收裁决取舍与复杂度

16EV逐项+2全局门禁，沿用05schema，独立验收私有DTO/无环hash与实际review绑定；fixedpaths与版本archive，writer只draft，不自动签署。

## 7. 结构化中间产物

### 10.1 证据资格

actual EV先从reports/runs/<run_id>/evidence-index.md读取，再按05 EvidenceIndexArtifact/FileRef回到同run meta/suite/case、log和digest。只有实际machine结果能形成case/suite/EV status；本文件的预约表或prototype截图不是证据。
05 ac_refs保留原声明，06额外的parentAC/gate绑定写在独立验收记录中；只有tc_refs确在被引用EV且参数instance有actualcase，才可复用。unit/fixture永远isolated_fixture，不能通过改alias/reviewer把它升formal SDK、native或AT。
同baseline多run需实际source/build/规则/数据scope/配置/支持矩阵可比，每个必须的OS/AT与TC/variant有显式run回链。某run存在失败不能通过另一个run碎片合并隐去；复验用新run，原失败作为safe defect/retest链保留。

### 10.2 十六EV逐项门禁

#### GATE-CHAT-E-001 EV-UNIT-001 / intent

| 要素 | 裁决要求 |
|---|---|
| 父AC/优先级 | AC-NFR-CHAT-004 / P0 |
| 设计契约 | 05 §9.1/§13.1与schema/digest/crossfield；03 §14/15；00审计/安全红线 |
| TC（既有planned） | TC-PROTO-001, TC-PROTO-002, TC-PROTO-003, TC-PROTO-004, TC-PROTO-019, TC-PROTO-020, TC-PROTO-021, TC-PROTO-022, TC-PROTO-051, TC-PROTO-052, TC-PROTO-071, TC-PROTO-072, TC-STATE-031, TC-STATE-032, TC-STATE-033, TC-STATE-034, TC-STATE-035, TC-STATE-036, TC-CONC-001, TC-CONC-002, TC-CONC-003, TC-CONC-004, TC-CONC-005, TC-SAFE-003 |
| EV（既有planned） | EV-UNIT-001 |
| 固定report入口 | reports/runs/<run_id>/evidence-index.md；reports/runs/<run_id>/evidence/EV-UNIT-001.md |
| machine回链 | 05 §13.1对应suite/report.json→cases/<TC-ID>--<variant_id>.json→meta/context/manifest；同一批准baseline的固定run集合 |
| 通过条件 | 05预约tc_refs全集与actualmanifest/cases exactmatch，proof_scope=isolated_fixture，suite/case/EV实际passed且full detail存在；review与最终脱敏有效，无missinginstance；EV-UNIT-001回链实际source/context/config及安全logs；所需TC参数全集/guard/负向均满足，证据scope不升级；本地contract证据可验证，不替代必要real层 |
| 失败/缺证据 | 缺case/report/EVdetail/参数行、badshape/hash/path/错TC、scope升级、静态手填pass或未审阅初稿；缺/failed/blocked/skipped/not_run/过期错版证据不得passed |
| 裁决影响 | P0不满足即不通过；送验baseline尚缺时保持blocked，不产生最终结论；若实际命中§11 VETO则总体强制不通过，不可waive |

#### GATE-CHAT-E-002 EV-UI-001 / presentation

| 要素 | 裁决要求 |
|---|---|
| 父AC/优先级 | AC-NFR-CHAT-004 / P0 |
| 设计契约 | 05 §9.1/§13.1与schema/digest/crossfield；03 §14/15；00审计/安全红线 |
| TC（既有planned） | TC-PROTO-005, TC-PROTO-006, TC-PROTO-011, TC-PROTO-012, TC-PROTO-013, TC-PROTO-014, TC-PROTO-015, TC-PROTO-016, TC-PROTO-017, TC-PROTO-018, TC-PROTO-031, TC-PROTO-032, TC-SAFE-008, TC-SAFE-009, TC-AT-001, TC-AT-002, TC-AT-003, TC-AT-004, TC-AT-005 |
| EV（既有planned） | EV-UI-001 |
| 固定report入口 | reports/runs/<run_id>/evidence-index.md；reports/runs/<run_id>/evidence/EV-UI-001.md |
| machine回链 | 05 §13.1对应suite/report.json→cases/<TC-ID>--<variant_id>.json→meta/context/manifest；同一批准baseline的固定run集合 |
| 通过条件 | 05预约tc_refs全集与actualmanifest/cases exactmatch，proof_scope=isolated_fixture，suite/case/EV实际passed且full detail存在；review与最终脱敏有效，无missinginstance；EV-UI-001回链实际source/context/config及安全logs；所需TC参数全集/guard/负向均满足，证据scope不升级；本地contract证据可验证，不替代必要real层 |
| 失败/缺证据 | 缺case/report/EVdetail/参数行、badshape/hash/path/错TC、scope升级、静态手填pass或未审阅初稿；缺/failed/blocked/skipped/not_run/过期错版证据不得passed |
| 裁决影响 | P0不满足即不通过；送验baseline尚缺时保持blocked，不产生最终结论；若实际命中§11 VETO则总体强制不通过，不可waive |

#### GATE-CHAT-E-003 EV-UNIT-002 / continuity

| 要素 | 裁决要求 |
|---|---|
| 父AC/优先级 | AC-NFR-CHAT-004 / P0 |
| 设计契约 | 05 §9.1/§13.1与schema/digest/crossfield；03 §14/15；00审计/安全红线 |
| TC（既有planned） | TC-PROTO-007, TC-PROTO-008, TC-PROTO-023, TC-PROTO-024, TC-PROTO-049, TC-PROTO-050, TC-PROTO-053, TC-PROTO-054, TC-PROTO-055, TC-PROTO-056, TC-PROTO-057, TC-PROTO-058, TC-PROTO-059, TC-PROTO-060, TC-PROTO-067, TC-PROTO-068, TC-PROTO-069, TC-PROTO-070, TC-PROTO-073, TC-PROTO-074, TC-PROTO-075, TC-PROTO-076, TC-STATE-037, TC-STATE-038, TC-STATE-039, TC-STATE-043, TC-STATE-044, TC-STATE-045, TC-CONC-006, TC-CONC-009, TC-CONC-011, TC-CONC-012, TC-CONC-013, TC-CONC-014, TC-SAFE-010 |
| EV（既有planned） | EV-UNIT-002 |
| 固定report入口 | reports/runs/<run_id>/evidence-index.md；reports/runs/<run_id>/evidence/EV-UNIT-002.md |
| machine回链 | 05 §13.1对应suite/report.json→cases/<TC-ID>--<variant_id>.json→meta/context/manifest；同一批准baseline的固定run集合 |
| 通过条件 | 05预约tc_refs全集与actualmanifest/cases exactmatch，proof_scope=isolated_fixture，suite/case/EV实际passed且full detail存在；review与最终脱敏有效，无missinginstance；EV-UNIT-002回链实际source/context/config及安全logs；所需TC参数全集/guard/负向均满足，证据scope不升级；本地contract证据可验证，不替代必要real层 |
| 失败/缺证据 | 缺case/report/EVdetail/参数行、badshape/hash/path/错TC、scope升级、静态手填pass或未审阅初稿；缺/failed/blocked/skipped/not_run/过期错版证据不得passed |
| 裁决影响 | P0不满足即不通过；送验baseline尚缺时保持blocked，不产生最终结论；若实际命中§11 VETO则总体强制不通过，不可waive |

#### GATE-CHAT-E-004 EV-UNIT-003 / navigation

| 要素 | 裁决要求 |
|---|---|
| 父AC/优先级 | AC-NFR-CHAT-004 / P0 |
| 设计契约 | 05 §9.1/§13.1与schema/digest/crossfield；03 §14/15；00审计/安全红线 |
| TC（既有planned） | TC-PROTO-009, TC-PROTO-010, TC-STATE-001, TC-STATE-002, TC-STATE-003, TC-STATE-004, TC-STATE-005, TC-STATE-006, TC-STATE-007, TC-STATE-008, TC-STATE-009, TC-SAFE-002 |
| EV（既有planned） | EV-UNIT-003 |
| 固定report入口 | reports/runs/<run_id>/evidence-index.md；reports/runs/<run_id>/evidence/EV-UNIT-003.md |
| machine回链 | 05 §13.1对应suite/report.json→cases/<TC-ID>--<variant_id>.json→meta/context/manifest；同一批准baseline的固定run集合 |
| 通过条件 | 05预约tc_refs全集与actualmanifest/cases exactmatch，proof_scope=isolated_fixture，suite/case/EV实际passed且full detail存在；review与最终脱敏有效，无missinginstance；EV-UNIT-003回链实际source/context/config及安全logs；所需TC参数全集/guard/负向均满足，证据scope不升级；本地contract证据可验证，不替代必要real层 |
| 失败/缺证据 | 缺case/report/EVdetail/参数行、badshape/hash/path/错TC、scope升级、静态手填pass或未审阅初稿；缺/failed/blocked/skipped/not_run/过期错版证据不得passed |
| 裁决影响 | P0不满足即不通过；送验baseline尚缺时保持blocked，不产生最终结论；若实际命中§11 VETO则总体强制不通过，不可waive |

#### GATE-CHAT-E-005 EV-UNIT-004 / persistence

| 要素 | 裁决要求 |
|---|---|
| 父AC/优先级 | AC-NFR-CHAT-004 / P0 |
| 设计契约 | 05 §9.1/§13.1与schema/digest/crossfield；03 §14/15；00审计/安全红线 |
| TC（既有planned） | TC-PROTO-025, TC-PROTO-026, TC-PROTO-027, TC-PROTO-028, TC-PROTO-061, TC-PROTO-062, TC-PROTO-077, TC-PROTO-078, TC-PROTO-079, TC-PROTO-080, TC-STATE-040, TC-STATE-041, TC-STATE-042, TC-STATE-046, TC-STATE-047, TC-STATE-048, TC-CONC-010, TC-SAFE-004 |
| EV（既有planned） | EV-UNIT-004 |
| 固定report入口 | reports/runs/<run_id>/evidence-index.md；reports/runs/<run_id>/evidence/EV-UNIT-004.md |
| machine回链 | 05 §13.1对应suite/report.json→cases/<TC-ID>--<variant_id>.json→meta/context/manifest；同一批准baseline的固定run集合 |
| 通过条件 | 05预约tc_refs全集与actualmanifest/cases exactmatch，proof_scope=isolated_fixture，suite/case/EV实际passed且full detail存在；review与最终脱敏有效，无missinginstance；EV-UNIT-004回链实际source/context/config及安全logs；所需TC参数全集/guard/负向均满足，证据scope不升级；本地contract证据可验证，不替代必要real层 |
| 失败/缺证据 | 缺case/report/EVdetail/参数行、badshape/hash/path/错TC、scope升级、静态手填pass或未审阅初稿；缺/failed/blocked/skipped/not_run/过期错版证据不得passed |
| 裁决影响 | P0不满足即不通过；送验baseline尚缺时保持blocked，不产生最终结论；若实际命中§11 VETO则总体强制不通过，不可waive |

#### GATE-CHAT-E-006 EV-NATIVE-001 / host-unit

| 要素 | 裁决要求 |
|---|---|
| 父AC/优先级 | AC-NFR-CHAT-004 / P0 |
| 设计契约 | 05 §9.1/§13.1与schema/digest/crossfield；03 §14/15；00审计/安全红线 |
| TC（既有planned） | TC-PROTO-029, TC-PROTO-030, TC-STATE-049, TC-STATE-050, TC-STATE-051, TC-CFG-011, TC-CFG-012, TC-SAFE-007 |
| EV（既有planned） | EV-NATIVE-001 |
| 固定report入口 | reports/runs/<run_id>/evidence-index.md；reports/runs/<run_id>/evidence/EV-NATIVE-001.md |
| machine回链 | 05 §13.1对应suite/report.json→cases/<TC-ID>--<variant_id>.json→meta/context/manifest；同一批准baseline的固定run集合 |
| 通过条件 | 05预约tc_refs全集与actualmanifest/cases exactmatch，proof_scope=isolated_fixture，suite/case/EV实际passed且full detail存在；review与最终脱敏有效，无missinginstance；EV-NATIVE-001回链实际source/context/config及安全logs；所需TC参数全集/guard/负向均满足，证据scope不升级；本地contract证据可验证，不替代必要real层 |
| 失败/缺证据 | 缺case/report/EVdetail/参数行、badshape/hash/path/错TC、scope升级、静态手填pass或未审阅初稿；缺/failed/blocked/skipped/not_run/过期错版证据不得passed |
| 裁决影响 | P0不满足即不通过；送验baseline尚缺时保持blocked，不产生最终结论；若实际命中§11 VETO则总体强制不通过，不可waive |

#### GATE-CHAT-E-007 EV-UI-002 / process

| 要素 | 裁决要求 |
|---|---|
| 父AC/优先级 | AC-NFR-CHAT-004 / P0 |
| 设计契约 | 05 §9.1/§13.1与schema/digest/crossfield；03 §14/15；00审计/安全红线 |
| TC（既有planned） | TC-PROTO-033, TC-PROTO-034, TC-PROTO-035, TC-PROTO-036, TC-PROTO-037, TC-PROTO-038, TC-PROTO-039, TC-PROTO-040, TC-PROTO-041, TC-PROTO-042, TC-PROTO-083, TC-PROTO-084, TC-STATE-010, TC-STATE-011, TC-STATE-012, TC-STATE-013, TC-STATE-014, TC-STATE-015, TC-STATE-016, TC-STATE-017, TC-STATE-018, TC-STATE-019, TC-STATE-020, TC-STATE-021, TC-STATE-022, TC-STATE-023, TC-STATE-024, TC-CFG-019, TC-CFG-020, TC-CONC-007, TC-CONC-008, TC-SAFE-005 |
| EV（既有planned） | EV-UI-002 |
| 固定report入口 | reports/runs/<run_id>/evidence-index.md；reports/runs/<run_id>/evidence/EV-UI-002.md |
| machine回链 | 05 §13.1对应suite/report.json→cases/<TC-ID>--<variant_id>.json→meta/context/manifest；同一批准baseline的固定run集合 |
| 通过条件 | 05预约tc_refs全集与actualmanifest/cases exactmatch，proof_scope=isolated_fixture，suite/case/EV实际passed且full detail存在；review与最终脱敏有效，无missinginstance；EV-UI-002回链实际source/context/config及安全logs；所需TC参数全集/guard/负向均满足，证据scope不升级；本地contract证据可验证，不替代必要real层 |
| 失败/缺证据 | 缺case/report/EVdetail/参数行、badshape/hash/path/错TC、scope升级、静态手填pass或未审阅初稿；缺/failed/blocked/skipped/not_run/过期错版证据不得passed |
| 裁决影响 | P0不满足即不通过；送验baseline尚缺时保持blocked，不产生最终结论；若实际命中§11 VETO则总体强制不通过，不可waive |

#### GATE-CHAT-E-008 EV-UI-003 / directory

| 要素 | 裁决要求 |
|---|---|
| 父AC/优先级 | AC-NFR-CHAT-004 / P0 |
| 设计契约 | 05 §9.1/§13.1与schema/digest/crossfield；03 §14/15；00审计/安全红线 |
| TC（既有planned） | TC-PROTO-043, TC-PROTO-044, TC-PROTO-045, TC-PROTO-046, TC-PROTO-047, TC-PROTO-048, TC-PROTO-085, TC-PROTO-086, TC-STATE-025, TC-STATE-026, TC-STATE-027, TC-STATE-028, TC-STATE-029, TC-STATE-030, TC-SAFE-006 |
| EV（既有planned） | EV-UI-003 |
| 固定report入口 | reports/runs/<run_id>/evidence-index.md；reports/runs/<run_id>/evidence/EV-UI-003.md |
| machine回链 | 05 §13.1对应suite/report.json→cases/<TC-ID>--<variant_id>.json→meta/context/manifest；同一批准baseline的固定run集合 |
| 通过条件 | 05预约tc_refs全集与actualmanifest/cases exactmatch，proof_scope=isolated_fixture，suite/case/EV实际passed且full detail存在；review与最终脱敏有效，无missinginstance；EV-UI-003回链实际source/context/config及安全logs；所需TC参数全集/guard/负向均满足，证据scope不升级；本地contract证据可验证，不替代必要real层 |
| 失败/缺证据 | 缺case/report/EVdetail/参数行、badshape/hash/path/错TC、scope升级、静态手填pass或未审阅初稿；缺/failed/blocked/skipped/not_run/过期错版证据不得passed |
| 裁决影响 | P0不满足即不通过；送验baseline尚缺时保持blocked，不产生最终结论；若实际命中§11 VETO则总体强制不通过，不可waive |

#### GATE-CHAT-E-009 EV-UNIT-005 / diagnostic

| 要素 | 裁决要求 |
|---|---|
| 父AC/优先级 | AC-NFR-CHAT-004 / P0 |
| 设计契约 | 05 §9.1/§13.1与schema/digest/crossfield；03 §14/15；00审计/安全红线 |
| TC（既有planned） | TC-PROTO-063, TC-PROTO-064, TC-PROTO-065, TC-PROTO-066, TC-PROTO-081, TC-PROTO-082, TC-CFG-021, TC-CFG-022 |
| EV（既有planned） | EV-UNIT-005 |
| 固定report入口 | reports/runs/<run_id>/evidence-index.md；reports/runs/<run_id>/evidence/EV-UNIT-005.md |
| machine回链 | 05 §13.1对应suite/report.json→cases/<TC-ID>--<variant_id>.json→meta/context/manifest；同一批准baseline的固定run集合 |
| 通过条件 | 05预约tc_refs全集与actualmanifest/cases exactmatch，proof_scope=isolated_fixture，suite/case/EV实际passed且full detail存在；review与最终脱敏有效，无missinginstance；EV-UNIT-005回链实际source/context/config及安全logs；所需TC参数全集/guard/负向均满足，证据scope不升级；本地contract证据可验证，不替代必要real层 |
| 失败/缺证据 | 缺case/report/EVdetail/参数行、badshape/hash/path/错TC、scope升级、静态手填pass或未审阅初稿；缺/failed/blocked/skipped/not_run/过期错版证据不得passed |
| 裁决影响 | P0不满足即不通过；送验baseline尚缺时保持blocked，不产生最终结论；若实际命中§11 VETO则总体强制不通过，不可waive |

#### GATE-CHAT-E-010 EV-UNIT-006 / config

| 要素 | 裁决要求 |
|---|---|
| 父AC/优先级 | AC-NFR-CHAT-004 / P0 |
| 设计契约 | 05 §9.1/§13.1与schema/digest/crossfield；03 §14/15；00审计/安全红线 |
| TC（既有planned） | TC-CFG-001, TC-CFG-002, TC-CFG-003, TC-CFG-004, TC-CFG-005, TC-CFG-006, TC-CFG-007, TC-CFG-008, TC-CFG-009, TC-CFG-010, TC-CFG-013, TC-CFG-014, TC-CFG-015, TC-CFG-016, TC-CFG-017, TC-CFG-018, TC-CFG-023, TC-CFG-024 |
| EV（既有planned） | EV-UNIT-006 |
| 固定report入口 | reports/runs/<run_id>/evidence-index.md；reports/runs/<run_id>/evidence/EV-UNIT-006.md |
| machine回链 | 05 §13.1对应suite/report.json→cases/<TC-ID>--<variant_id>.json→meta/context/manifest；同一批准baseline的固定run集合 |
| 通过条件 | 05预约tc_refs全集与actualmanifest/cases exactmatch，proof_scope=isolated_fixture，suite/case/EV实际passed且full detail存在；review与最终脱敏有效，无missinginstance；EV-UNIT-006回链实际source/context/config及安全logs；所需TC参数全集/guard/负向均满足，证据scope不升级；本地contract证据可验证，不替代必要real层 |
| 失败/缺证据 | 缺case/report/EVdetail/参数行、badshape/hash/path/错TC、scope升级、静态手填pass或未审阅初稿；缺/failed/blocked/skipped/not_run/过期错版证据不得passed |
| 裁决影响 | P0不满足即不通过；送验baseline尚缺时保持blocked，不产生最终结论；若实际命中§11 VETO则总体强制不通过，不可waive |

#### GATE-CHAT-E-011 EV-UNIT-007 / errors

| 要素 | 裁决要求 |
|---|---|
| 父AC/优先级 | AC-NFR-CHAT-004 / P0 |
| 设计契约 | 05 §9.1/§13.1与schema/digest/crossfield；03 §14/15；00审计/安全红线 |
| TC（既有planned） | TC-ERROR-001, TC-ERROR-002, TC-ERROR-003, TC-ERROR-004, TC-ERROR-005, TC-ERROR-006, TC-ERROR-007, TC-ERROR-008, TC-ERROR-009, TC-ERROR-010, TC-ERROR-011, TC-ERROR-012, TC-ERROR-013, TC-ERROR-014, TC-ERROR-015 |
| EV（既有planned） | EV-UNIT-007 |
| 固定report入口 | reports/runs/<run_id>/evidence-index.md；reports/runs/<run_id>/evidence/EV-UNIT-007.md |
| machine回链 | 05 §13.1对应suite/report.json→cases/<TC-ID>--<variant_id>.json→meta/context/manifest；同一批准baseline的固定run集合 |
| 通过条件 | 05预约tc_refs全集与actualmanifest/cases exactmatch，proof_scope=isolated_fixture，suite/case/EV实际passed且full detail存在；review与最终脱敏有效，无missinginstance；EV-UNIT-007回链实际source/context/config及安全logs；所需TC参数全集/guard/负向均满足，证据scope不升级；本地contract证据可验证，不替代必要real层 |
| 失败/缺证据 | 缺case/report/EVdetail/参数行、badshape/hash/path/错TC、scope升级、静态手填pass或未审阅初稿；缺/failed/blocked/skipped/not_run/过期错版证据不得passed |
| 裁决影响 | P0不满足即不通过；送验baseline尚缺时保持blocked，不产生最终结论；若实际命中§11 VETO则总体强制不通过，不可waive |

#### GATE-CHAT-E-012 EV-UNIT-008 / boundary

| 要素 | 裁决要求 |
|---|---|
| 父AC/优先级 | AC-NFR-CHAT-004 / P0 |
| 设计契约 | 05 §9.1/§13.1与schema/digest/crossfield；03 §14/15；00审计/安全红线 |
| TC（既有planned） | TC-SAFE-001 |
| EV（既有planned） | EV-UNIT-008 |
| 固定report入口 | reports/runs/<run_id>/evidence-index.md；reports/runs/<run_id>/evidence/EV-UNIT-008.md |
| machine回链 | 05 §13.1对应suite/report.json→cases/<TC-ID>--<variant_id>.json→meta/context/manifest；同一批准baseline的固定run集合 |
| 通过条件 | 05预约tc_refs全集与actualmanifest/cases exactmatch，proof_scope=isolated_fixture，suite/case/EV实际passed且full detail存在；review与最终脱敏有效，无missinginstance；EV-UNIT-008回链实际source/context/config及安全logs；所需TC参数全集/guard/负向均满足，证据scope不升级；本地contract证据可验证，不替代必要real层 |
| 失败/缺证据 | 缺case/report/EVdetail/参数行、badshape/hash/path/错TC、scope升级、静态手填pass或未审阅初稿；缺/failed/blocked/skipped/not_run/过期错版证据不得passed |
| 裁决影响 | P0不满足即不通过；送验baseline尚缺时保持blocked，不产生最终结论；若实际命中§11 VETO则总体强制不通过，不可waive |

#### GATE-CHAT-E-013 EV-REPORT-001 / report

| 要素 | 裁决要求 |
|---|---|
| 父AC/优先级 | AC-NFR-CHAT-004 / P0 |
| 设计契约 | 05 §9.1/§13.1与schema/digest/crossfield；03 §14/15；00审计/安全红线 |
| TC（既有planned） | TC-REPORT-001, TC-REPORT-002, TC-REPORT-003, TC-REPORT-004, TC-REPORT-005, TC-REPORT-006, TC-REPORT-007 |
| EV（既有planned） | EV-REPORT-001 |
| 固定report入口 | reports/runs/<run_id>/evidence-index.md；reports/runs/<run_id>/evidence/EV-REPORT-001.md |
| machine回链 | 05 §13.1对应suite/report.json→cases/<TC-ID>--<variant_id>.json→meta/context/manifest；同一批准baseline的固定run集合 |
| 通过条件 | 05预约tc_refs全集与actualmanifest/cases exactmatch，proof_scope=isolated_fixture，suite/case/EV实际passed且full detail存在；review与最终脱敏有效，无missinginstance；EV-REPORT-001回链实际source/context/config及安全logs；所需TC参数全集/guard/负向均满足，证据scope不升级；本地contract证据可验证，不替代必要real层 |
| 失败/缺证据 | 缺case/report/EVdetail/参数行、badshape/hash/path/错TC、scope升级、静态手填pass或未审阅初稿；缺/failed/blocked/skipped/not_run/过期错版证据不得passed |
| 裁决影响 | P0不满足即不通过；送验baseline尚缺时保持blocked，不产生最终结论；若实际命中§11 VETO则总体强制不通过，不可waive |

#### GATE-CHAT-E-014 EV-SDK-001 / sdk-real

| 要素 | 裁决要求 |
|---|---|
| 父AC/优先级 | AC-NFR-CHAT-004 / P0 |
| 设计契约 | 05 §9.1/§13.1与schema/digest/crossfield；03 §14/15；00审计/安全红线 |
| TC（既有planned） | TC-REAL-001, TC-REAL-004 |
| EV（既有planned） | EV-SDK-001 |
| 固定report入口 | reports/runs/<run_id>/evidence-index.md；reports/runs/<run_id>/evidence/EV-SDK-001.md |
| machine回链 | 05 §13.1对应suite/report.json→cases/<TC-ID>--<variant_id>.json→meta/context/manifest；同一批准baseline的固定run集合 |
| 通过条件 | 05预约tc_refs全集与actualmanifest/cases exactmatch，proof_scope=formal_sdk，suite/case/EV实际passed且full detail存在；review与最终脱敏有效，无missinginstance；EV-SDK-001回链实际source/context/config及安全logs；所需TC参数全集/guard/负向均满足，证据scope不升级；本地contract证据可验证，不替代必要real层 |
| 失败/缺证据 | 缺case/report/EVdetail/参数行、badshape/hash/path/错TC、scope升级、静态手填pass或未审阅初稿；缺/failed/blocked/skipped/not_run/过期错版证据不得passed |
| 裁决影响 | P0不满足即不通过；送验baseline尚缺时保持blocked，不产生最终结论；若实际命中§11 VETO则总体强制不通过，不可waive |

#### GATE-CHAT-E-015 EV-HOST-001 / desktop-real

| 要素 | 裁决要求 |
|---|---|
| 父AC/优先级 | AC-NFR-CHAT-004 / P0 |
| 设计契约 | 05 §9.1/§13.1与schema/digest/crossfield；03 §14/15；00审计/安全红线 |
| TC（既有planned） | TC-REAL-002 |
| EV（既有planned） | EV-HOST-001 |
| 固定report入口 | reports/runs/<run_id>/evidence-index.md；reports/runs/<run_id>/evidence/EV-HOST-001.md |
| machine回链 | 05 §13.1对应suite/report.json→cases/<TC-ID>--<variant_id>.json→meta/context/manifest；同一批准baseline的固定run集合 |
| 通过条件 | 05预约tc_refs全集与actualmanifest/cases exactmatch，proof_scope=native_host，suite/case/EV实际passed且full detail存在；review与最终脱敏有效，无missinginstance；EV-HOST-001回链实际source/context/config及安全logs；所需TC参数全集/guard/负向均满足，证据scope不升级；本地contract证据可验证，不替代必要real层 |
| 失败/缺证据 | 缺case/report/EVdetail/参数行、badshape/hash/path/错TC、scope升级、静态手填pass或未审阅初稿；缺/failed/blocked/skipped/not_run/过期错版证据不得passed |
| 裁决影响 | P0不满足即不通过；送验baseline尚缺时保持blocked，不产生最终结论；若实际命中§11 VETO则总体强制不通过，不可waive |

#### GATE-CHAT-E-016 EV-AT-001 / at-real

| 要素 | 裁决要求 |
|---|---|
| 父AC/优先级 | AC-NFR-CHAT-004 / P0 |
| 设计契约 | 05 §9.1/§13.1与schema/digest/crossfield；03 §14/15；00审计/安全红线 |
| TC（既有planned） | TC-REAL-003 |
| EV（既有planned） | EV-AT-001 |
| 固定report入口 | reports/runs/<run_id>/evidence-index.md；reports/runs/<run_id>/evidence/EV-AT-001.md |
| machine回链 | 05 §13.1对应suite/report.json→cases/<TC-ID>--<variant_id>.json→meta/context/manifest；同一批准baseline的固定run集合 |
| 通过条件 | 05预约tc_refs全集与actualmanifest/cases exactmatch，proof_scope=manual_at，suite/case/EV实际passed且full detail存在；review与最终脱敏有效，无missinginstance；EV-AT-001回链实际source/context/config及安全logs；所需TC参数全集/guard/负向均满足，证据scope不升级；本地contract证据可验证，不替代必要real层 |
| 失败/缺证据 | 缺case/report/EVdetail/参数行、badshape/hash/path/错TC、scope升级、静态手填pass或未审阅初稿；缺/failed/blocked/skipped/not_run/过期错版证据不得passed |
| 裁决影响 | P0不满足即不通过；送验baseline尚缺时保持blocked，不产生最终结论；若实际命中§11 VETO则总体强制不通过，不可waive |

#### GATE-CHAT-E-017 schema/digest/分母/成熟度

| 要素 | 裁决要求 |
|---|---|
| 父AC/优先级 | AC-NFR-CHAT-004 / P0 |
| 设计契约 | 05 §13.3～8、真相源§7；03 §15.7 |
| TC（既有planned） | TC-REPORT-001, TC-REPORT-002, TC-REPORT-003, TC-REPORT-004, TC-REPORT-005, TC-REPORT-006, TC-REPORT-007 |
| EV（既有planned） | EV-REPORT-001 |
| 固定report入口 | reports/runs/<run_id>/evidence-index.md；reports/runs/<run_id>/evidence/EV-REPORT-001.md |
| machine回链 | 05 §13.1对应suite/report.json→cases/<TC-ID>--<variant_id>.json→meta/context/manifest；同一批准baseline的固定run集合 |
| 通过条件 | chat.test.v1各DTO/enum/null/required/additionalproperties与RFC8785+sha256/selfdigest排除自身唯一字段、FileRef完整bytesdigest均有效；无环顺序：actualmachine→首次redaction→generate候选→finalredaction；source/version/TC参数全集/16EV完整；07允许maturity与实际产物一致；所需TC参数全集/guard/负向均满足，证据scope不升级；本地contract证据可验证，不替代必要real层 |
| 失败/缺证据 | 任何badshape/digest/path/跨run/latest/缺分母/丢P0case/跳check、index_shell伪fullEV、fake/截图/summary伪actual或手工编辑pass；缺/failed/blocked/skipped/not_run/过期错版证据不得passed |
| 裁决影响 | P0不满足即不通过；送验baseline尚缺时保持blocked，不产生最终结论；若实际命中§11 VETO则总体强制不通过，不可waive |

#### GATE-CHAT-E-018 acceptance交接/审阅完整

| 要素 | 裁决要求 |
|---|---|
| 父AC/优先级 | AC-CHAT-005 / P0 |
| 设计契约 | 本章§10.3～7；05 §13.7/14；00 §14.4 |
| TC（既有planned） | TC-REPORT-001, TC-REPORT-002, TC-REPORT-003, TC-REPORT-004, TC-REPORT-005, TC-REPORT-006, TC-REPORT-007 |
| EV（既有planned） | EV-REPORT-001 |
| 固定report入口 | reports/runs/<run_id>/evidence-index.md；reports/runs/<run_id>/evidence/EV-REPORT-001.md |
| machine回链 | 05 §13.1对应suite/report.json→cases/<TC-ID>--<variant_id>.json→meta/context/manifest；同一批准baseline的固定run集合 |
| 通过条件 | 固定handoff/veto/risk/openissues与baseline机器记录一致、安全、actualreview版本固定且每P0gate/parent有TC/EV/instance/run；签署前必要角色的语义审阅输入完整；风险不覆盖P0/VETO；最终签署单独按§14完成；所需TC参数全集/guard/负向均满足，证据scope不升级；本地contract证据可验证，不替代必要real层 |
| 失败/缺证据 | 缺handoff/未审初稿、baseline/TC/EV不一致、默认全通过/默认清VETO、没有接受人/期限却条件放行，旧材料被覆盖；缺/failed/blocked/skipped/not_run/过期错版证据不得passed |
| 裁决影响 | P0不满足即不通过；送验baseline尚缺时保持blocked，不产生最终结论；若实际命中§11 VETO则总体强制不通过，不可waive |

### 10.3 report/handoff检查入口

| 入口 | 必须验证 | 不满足时 |
|---|---|---|
| reports/runs/<run_id>/summary.md、suites/<suite>.md | 实际case/suite状态，固定profile/source与不足解释，blocked不pass | 送验不完整/P0不通过 |
| 同run evidence-index.md、evidence/EV-*.md、artifact根evidence-index.json | 16EV/全部TC/parameter scope、actualref/path/digest与full_ev | missing/orphan/造假不得通过 |
| 同run gate-results.md、artifact根gate-results.json | 对应stage/local vsrelease必要suite，不能PR pass代release | P0未成立 |
| 同run redaction-check.md、artifact根redaction-check.json | machine材料初次检查passed/checked集合足 | 泄露VETO；缺检查blocked |
| 同run redaction-final.json | derivedindex/Markdown finalcheck，整套证据引用无环 | 不发布/不接受候选 |
| reports/acceptance/handoff.md | 批准送验scope/build/run集合/review_id、所有AC子gate结果与actualreview | 送验交接不成立 |
| reports/acceptance/veto-checklist.md | §11各VETO actualclear/detected/unassessed及safeEV/report/defect refs | 缺结果不得通过；detected总体不通过 |
| reports/acceptance/risk-acceptance.md | 每非P0遗留范围/接受人/动作/截止/当前状态，与JSON一致；无风险也须真实审阅emptylist | 不得条件通过 |
| reports/acceptance/open-issues.md | blocker/defect/retention/版本/预算及后续责任，不静默隐藏P0 | 未解决硬项不得放行 |
| reports/acceptance/baseline.json | 下述私有schema、版本/digest、parent/gate/run/binding/review一致 | 缺actualbaseline送验blocked |
| reports/review/<review_id>/acceptance/* | 固定旧实际文件bytes与审阅版本，不编造历史 | 审计链断，不允许覆盖 |

### 10.4 验收私有机器schema

仅未来报告/验收tooling私有DTO，**不进入Chat或SDK public契约、clientstore/enum/业务truth**；不是当前生成的文件。复用05 TC/EV/ProofScope与chat.test.v1的run机器读取规则，不修改其schema。
baseline.json采用chat.acceptance.v1，下列字段全部required、additionalProperties=false；只有显式nullable可null，拒重复键/nonJSON/非finite/coercion。nullable只给draft缺审阅字段，不能在final替代实际值。

```ts
type AcceptanceSchemaVersion = "chat.acceptance.v1";
type ReviewId = string; // ^[a-z][a-z0-9-]{0,63}$, actual unique review revision
type SafeAlias = string; // approved non-sensitive catalog, same05 alias rules
type Digest = string; // ^sha256:[0-9a-f]{64}$
type RunId = string; // same05 run_id rules; actual listed run, never placeholder
type ParentAc = string; // exactly36 current00 AC registry, never AC-NFR008+
type GateId = string; // exact GATE-CHAT-* registry in06, no arbitrary gate
type TCId = string; // exact216 TC registry in05
type EVId = string; // exact16 EV registry in05
type VariantId = string; // actual frozen manifest member, same05 constraints
type AcceptanceVerdict = "pass" | "conditional_pass" | "fail";
type EvalStatus = "passed" | "failed" | "blocked" | "not_evaluated";
type ReviewRole = "product" | "technical" | "test" | "security" | "platform" | "release";
type ReasonCode = "none" | "evidence_missing" | "baseline_mismatch"
  | "schema_invalid" | "digest_mismatch" | "path_invalid" | "scope_mismatch"
  | "coverage_missing" | "dependency_blocked" | "assertion_failed"
  | "redaction_failed" | "veto_detected" | "review_pending"
  | "risk_unapproved" | "risk_expired" | "defect_open";
type Timestamp = string; // actual UTC RFC3339 YYYY-MM-DDTHH:mm:ss.sssZ
interface RunFileRef {
  run_id: RunId;
  root: "artifact" | "report";
  path: string; // below same run root, same05 path/symlink policy
  artifact_digest_algorithm: "sha256";
  artifact_digest: Digest; // exact stored sanitized bytes
}
interface AcceptanceFileRef {
  root: "acceptance" | "review";
  path: string; // below reports/acceptance or reports/review; bound current review
  artifact_digest_algorithm: "sha256";
  artifact_digest: Digest; // exact stored sanitized bytes
}
interface DocumentBaseline {
  document: "00" | "01" | "02" | "03" | "04" | "05" | "06";
  version_ref: SafeAlias; // actual approved revision catalog, not 'latest'
  byte_digest: Digest;
}
interface DeliveryBaseline {
  repository_alias: SafeAlias;
  source_revision: string; // actual Git commit40/64lowerhex
  dirty: boolean;
  working_tree_digest: Digest; // approved build-input allowlist snapshot digest
  build_ref: SafeAlias;
  build_byte_digest: Digest; // actual desktop distribution/build result
  sdk_version_ref: SafeAlias;
  native_version_ref: SafeAlias;
}
interface EvidenceRun {
  run_id: RunId;
  context_ref: RunFileRef;
  manifest_ref: RunFileRef;
  index_ref: RunFileRef;
  final_redaction_ref: RunFileRef;
  profile_ref: SafeAlias; // exact04 profileId membership
  supported_matrix_ref: SafeAlias | null; // actual approved matrix when real layer required
}
interface ExpectedInstance {
  run_id: RunId;
  tc_id: TCId;
  variant_id: VariantId;
  source_contract_ref: SafeAlias; // actual manifest source row; no fake case digest
}
interface BoundInstance {
  run_id: RunId;
  tc_id: TCId;
  variant_id: VariantId;
  case_ref: RunFileRef; // actual existing case only
}
interface GateEvaluation {
  gate_id: GateId;
  parent_ac: ParentAc;
  tc_refs: TCId[];
  ev_refs: EVId[];
  expected_instances: ExpectedInstance[]; // actual manifest rows; no case existence claim
  actual_instances: BoundInstance[];
  status: EvalStatus;
  reason: ReasonCode;
  evidence_run_ids: RunId[];
  reviewer_ref: SafeAlias | null;
  reviewed_at: Timestamp | null;
}
interface ParentEvaluation {
  ac_id: ParentAc;
  gate_refs: GateId[];
  status: EvalStatus;
  reason: ReasonCode;
}
interface VetoEvaluation {
  veto_id: string; // exact §11 VETO-CHAT registry
  status: "clear" | "detected" | "unassessed";
  reason: ReasonCode;
  gate_refs: GateId[];
  tc_refs: TCId[];
  ev_refs: EVId[];
  run_refs: RunFileRef[];
  defect_refs: SafeAlias[];
  reviewer_ref: SafeAlias | null;
  reviewed_at: Timestamp | null;
}
interface RiskAcceptance {
  risk_id: SafeAlias;
  category: "cosmetic_noncore" | "documentation_nonblocking"
    | "maintenance_nonblocking" | "future_out_of_scope";
  priority: "P1" | "P2";
  affects_p0: false;
  status: "pending" | "approved" | "rejected" | "expired" | "fulfilled";
  reason: ReasonCode;
  affected_gate_refs: GateId[]; // no failed/blocked P0gate can be excused
  owner_ref: SafeAlias | null;
  acceptor_ref: SafeAlias | null;
  acceptor_role: ReviewRole | null;
  followup_action_ref: SafeAlias | null; // approved work/issue action, no raw body
  deadline: Timestamp | null;
  accepted_at: Timestamp | null;
  followup_evidence_refs: RunFileRef[];
}
interface Signoff {
  role: ReviewRole;
  signer_ref: SafeAlias;
  verdict: AcceptanceVerdict;
  signed_at: Timestamp;
  baseline_input_digest: Digest;
}
interface DefectSummary {
  defect_ref: SafeAlias;
  severity: "blocker" | "major" | "minor"; // same05
  acceptance_class: "S" | "A" | "B";
  priority: "P0" | "P1" | "P2";
  status: "open" | "triaged" | "fix_planned" | "ready_for_retest"
    | "verified" | "closed" | "reopened" | "blocked_external";
  reason: ReasonCode;
  affected_gate_refs: GateId[];
  tc_refs: TCId[];
  previous_failure_refs: RunFileRef[]; // actual approved historical runs, not pass evidence
  retest_refs: RunFileRef[]; // current baseline same-layer actual cases
  owner_ref: SafeAlias | null;
  risk_ref: SafeAlias | null;
}
interface HandoffRefs {
  handoff: AcceptanceFileRef;
  veto_checklist: AcceptanceFileRef;
  risk_acceptance: AcceptanceFileRef;
  open_issues: AcceptanceFileRef;
}
interface AcceptanceBaseline {
  schema_version: AcceptanceSchemaVersion;
  artifact_digest_algorithm: "sha256";
  artifact_digest: Digest;
  review_id: ReviewId;
  stage: "draft" | "reviewing" | "final";
  primary_run_id: RunId;
  run_ids: RunId[];
  rules: DocumentBaseline[];
  delivery: DeliveryBaseline;
  runs: EvidenceRun[];
  gates: GateEvaluation[];
  parents: ParentEvaluation[];
  vetoes: VetoEvaluation[];
  risks: RiskAcceptance[];
  defects: DefectSummary[];
  handoff_refs: HandoffRefs;
  previous_review_ref: AcceptanceFileRef | null; // archived previous actual baseline
  baseline_input_digest_algorithm: "sha256";
  baseline_input_digest: Digest;
  final_verdict: AcceptanceVerdict | null;
  next_stage: "not_allowed" | "allowed" | "conditional";
  signoffs: Signoff[];
}
```

GateEvaluation.expected_instances只含实际manifest中的run/TC/variant/source row，不放尚不存在case的digest或FileRef。actual_instances必须实际case存在且refhash有效；缺case列expected而不补fake digest，draft/not_evaluated actual可为空，blocked需有限缺口reason。
working_tree_digest计算：仅批准build-input源码/manifest/锁文件/必要配置**安全摘要**allowlist，每文件实际bytes SHA256，按safe相对path的Unicode codepoint序排列 `[{path,byte_digest}]` 后RFC8785 SHA256；不得hash或输出credential/完整外部正文，allowlist在07实际build基线批准。dirty=true仍可观察测试，但productrelease送验必须冻结实际tree与build且来源获批准，不把commit独自当tree。

### 10.5 digest、writer/reader与跨字段

- artifact_digest：RFC8785 over根object去掉自身artifact_digest，保留其它字段/algorithm/子refs；规则与05相同，sha256:64lowerhex。
- baseline_input_digest：RFC8785 over显式对象 `{review_id,primary_run_id,run_ids,rules,delivery,runs,gates,parents,vetoes,risks,defects,handoff_refs,previous_review_ref}`；不含根级stage/final_verdict/next_stage/signoffs、artifact_digest/artifact_digest_algorithm和baseline_input_digest/baseline_input_digest_algorithm。上述对象中的已存储输入摘要（rules.byte_digest、delivery的tree/build摘要和全部FileRef.artifact_digest）必须保留，不能递归剔除。所有signoff签同一inputdigest，避免signoffs自引用；不能排除failed/blocked/risks、defects或本身TC/EV字段。
- fixed Markdown文件不内嵌自身digest，也不指回baseline的自身digest。先产生并审查safe handoff/veto/risk/openissues（引用actualrun但不写自身baselinehash）→计算其bytes refs→baseline_input_digest→签署记录→finalbaseline selfdigest，形成无环引用。旧archive FileRef也只引用实际既有文件，不伪create。
- rules恰好00～06七个唯一成员；run_ids唯一、包含primary、等于runs.run_id集合，每Ref绑定自己的run；同run source/context/manifest与delivery/规则/支持矩阵相容，不跨build补case。
- 每gate唯一、parent/TC/EV集合与本文registry固定；expected参数来自manifest，actual与expected完整匹配且assertions/requiredscope/reviewer成立才passed；failed有实际失败，blocked有缺证据，不混not_run。parent只有全部requiredgatespassed才passed。
- E018核对签署前的交接事实、完整输入与实际语义审阅，不把final signoffs设为本gate passed的前置条件。先固定全部gate/parent/VETO/defect/risk与handoff内容→计算inputdigest→取得六角色最终签署→核对finalstage；签署后改动任一输入必须重算并重签，避免E018→签署→E018的循环。
- 05 evidence-index.ac_refs保持原scope/声明；AcceptanceBaseline独立gate/parentac绑定实际TC→EV，其中TC必须属于该EV mapped集，instance_ref属于actualrun。新增父AC引用不改05的machineindex或testscope。
- VETO clear需要实际可靠检查与审阅；detected立即硬fail，unassessed阻断通过。任何P0failed/blocked/not_evaluated不能riskaccept；RiskAcceptance只P1/P2且affects_p0=false。
- DefectSummary须severity/class/priority/status与05/06映射一致；P0/S/A unresolved不能passed/conditional，verified/closed必须真实同层retest_refs与修复baseline。previous_failure_refs可指批准历史run（独立核其source/hash），不加入当前requiredrun集合，也不用于判当前casepassed；open-issues.md与机器defects清单完全一致，无缺陷也需实际审阅空集合。
- Risk approved必须实际owner/acceptor/role/followup/deadline/accepted_at且deadline尚有效；过期即expired不再支撑条件放行，不能静默延期；fulfilled有真实后续证据。
- stage=draft/reviewing时final_verdict=null、next_stage=not_allowed、signoffs无finalclaim。stage=final且verdict=pass/conditional_pass必须全部36parent/142适用P0gatepassed、10VETOclear、同层证据/缺陷/risk及6角色签署有效；verdict=fail则必须已有可靠detectedVETO或actualP0failed的case/ref与足以定位的送验baseline，6角色签同一拒绝inputdigest，其余未评项保留not_evaluated/blocked。单纯缺证据不填假finalfail；timestamp不得填计划日期。
- reader必须验证每05JSONselfdigest与bytesrefhash、每acceptanceJSONselfdigest/inputdigest/Markdownbytesref、ACL/保留/来源，任何失败不得finalpass；unsafe输出不发布，不保留raw候选。当前没有baseline.json/报告或reader实现。

### 10.6 planned生成与审阅边界

writer候选继续使用既有scripts/reports/generate_reports.sh（同05参数），在真实RunContext.authorized_maturity=acceptance_handoff且07批准boundary时才能生成固定acceptance**draft**与baseline.json；evidence-index仍只full_ev/index_shell，不改chat.test.v1。reader是未来验收审阅tooling与人/Agent，不是Chat运行时。
check_redaction.sh在相同批准maturity时扩检本baseline引用的reports/acceptance候选和实际archive路径，签署前另作final安全检查；它不修改验收结果或回写owner。具体implementation/commitboundary由07安排，本轮不建脚本/报告/实施台账。
既有TC-REPORT-001/002/004/006/007对应schema/hash/maturity/path/完整性参数覆盖这些私有验收DTO，未来07冻结actualvariant manifest；不是当前已执行的新case或造passed。
生成器只据actualrun给事实/缺证据摘要，不自动clearVETO、接受risk、签署或造最终三值。人工补semanticreview/实际风险、缺陷与署名必须有scope+真实引用，同步JSON与Markdown后重新计算inputdigest，任何后续变动使原signoff失效。

### 10.7 观测/审计证据边界

Chat没有businessaudit/outbox/log/metric backend；不要求客户端创造这些材料作为验收。formal owner receipt/result/provenance只经SDK安全回链；自动metrics当前blocked，不能自建telemetry。
低敏诊断strict六字段、defaultdisabled、explicituser与sinkreceipt仅表交付，不等EV或Governance结果。测试/acceptance报告是实施测试审阅材料，不是Artifact/Governance/Workspace/Runtime业务truth。任何safe commit/tool/test摘要和BPMN截图不能单独充formalEV。

### 本Step逐项停审（设计过程记录）

每项独立完成来源→contract→TC→EV/report→pass/fail→裁决影响后才处理下一项。下表通过仅代表规则审查；实际TC/EV未生成、实际验收未开始。

| 验收项 | 审查项 | local gate | 外部缺口 |
|---|---|---|---|
| GATE-CHAT-E-001 | AC-NFR-CHAT-004；05 §9.1/§13.1与schema/digest/crossfield；03 §14/15；00审计/安全红线；TC/EV存在且scope/路径明确；pass/fail可判定，P0无waiver | pass_with_upstream_blockers | build/run/实际证据仍waiting，real能力不借fixture推断 |
| GATE-CHAT-E-002 | AC-NFR-CHAT-004；05 §9.1/§13.1与schema/digest/crossfield；03 §14/15；00审计/安全红线；TC/EV存在且scope/路径明确；pass/fail可判定，P0无waiver | pass_with_upstream_blockers | build/run/实际证据仍waiting，real能力不借fixture推断 |
| GATE-CHAT-E-003 | AC-NFR-CHAT-004；05 §9.1/§13.1与schema/digest/crossfield；03 §14/15；00审计/安全红线；TC/EV存在且scope/路径明确；pass/fail可判定，P0无waiver | pass_with_upstream_blockers | build/run/实际证据仍waiting，real能力不借fixture推断 |
| GATE-CHAT-E-004 | AC-NFR-CHAT-004；05 §9.1/§13.1与schema/digest/crossfield；03 §14/15；00审计/安全红线；TC/EV存在且scope/路径明确；pass/fail可判定，P0无waiver | pass_with_upstream_blockers | build/run/实际证据仍waiting，real能力不借fixture推断 |
| GATE-CHAT-E-005 | AC-NFR-CHAT-004；05 §9.1/§13.1与schema/digest/crossfield；03 §14/15；00审计/安全红线；TC/EV存在且scope/路径明确；pass/fail可判定，P0无waiver | pass_with_upstream_blockers | build/run/实际证据仍waiting，real能力不借fixture推断 |
| GATE-CHAT-E-006 | AC-NFR-CHAT-004；05 §9.1/§13.1与schema/digest/crossfield；03 §14/15；00审计/安全红线；TC/EV存在且scope/路径明确；pass/fail可判定，P0无waiver | pass_with_upstream_blockers | build/run/实际证据仍waiting，real能力不借fixture推断 |
| GATE-CHAT-E-007 | AC-NFR-CHAT-004；05 §9.1/§13.1与schema/digest/crossfield；03 §14/15；00审计/安全红线；TC/EV存在且scope/路径明确；pass/fail可判定，P0无waiver | pass_with_upstream_blockers | build/run/实际证据仍waiting，real能力不借fixture推断 |
| GATE-CHAT-E-008 | AC-NFR-CHAT-004；05 §9.1/§13.1与schema/digest/crossfield；03 §14/15；00审计/安全红线；TC/EV存在且scope/路径明确；pass/fail可判定，P0无waiver | pass_with_upstream_blockers | build/run/实际证据仍waiting，real能力不借fixture推断 |
| GATE-CHAT-E-009 | AC-NFR-CHAT-004；05 §9.1/§13.1与schema/digest/crossfield；03 §14/15；00审计/安全红线；TC/EV存在且scope/路径明确；pass/fail可判定，P0无waiver | pass_with_upstream_blockers | build/run/实际证据仍waiting，real能力不借fixture推断 |
| GATE-CHAT-E-010 | AC-NFR-CHAT-004；05 §9.1/§13.1与schema/digest/crossfield；03 §14/15；00审计/安全红线；TC/EV存在且scope/路径明确；pass/fail可判定，P0无waiver | pass_with_upstream_blockers | build/run/实际证据仍waiting，real能力不借fixture推断 |
| GATE-CHAT-E-011 | AC-NFR-CHAT-004；05 §9.1/§13.1与schema/digest/crossfield；03 §14/15；00审计/安全红线；TC/EV存在且scope/路径明确；pass/fail可判定，P0无waiver | pass_with_upstream_blockers | build/run/实际证据仍waiting，real能力不借fixture推断 |
| GATE-CHAT-E-012 | AC-NFR-CHAT-004；05 §9.1/§13.1与schema/digest/crossfield；03 §14/15；00审计/安全红线；TC/EV存在且scope/路径明确；pass/fail可判定，P0无waiver | pass_with_upstream_blockers | build/run/实际证据仍waiting，real能力不借fixture推断 |
| GATE-CHAT-E-013 | AC-NFR-CHAT-004；05 §9.1/§13.1与schema/digest/crossfield；03 §14/15；00审计/安全红线；TC/EV存在且scope/路径明确；pass/fail可判定，P0无waiver | pass_with_upstream_blockers | build/run/实际证据仍waiting，real能力不借fixture推断 |
| GATE-CHAT-E-014 | AC-NFR-CHAT-004；05 §9.1/§13.1与schema/digest/crossfield；03 §14/15；00审计/安全红线；TC/EV存在且scope/路径明确；pass/fail可判定，P0无waiver | pass_with_upstream_blockers | build/run/实际证据仍waiting，real能力不借fixture推断 |
| GATE-CHAT-E-015 | AC-NFR-CHAT-004；05 §9.1/§13.1与schema/digest/crossfield；03 §14/15；00审计/安全红线；TC/EV存在且scope/路径明确；pass/fail可判定，P0无waiver | pass_with_upstream_blockers | build/run/实际证据仍waiting，real能力不借fixture推断 |
| GATE-CHAT-E-016 | AC-NFR-CHAT-004；05 §9.1/§13.1与schema/digest/crossfield；03 §14/15；00审计/安全红线；TC/EV存在且scope/路径明确；pass/fail可判定，P0无waiver | pass_with_upstream_blockers | build/run/实际证据仍waiting，real能力不借fixture推断 |
| GATE-CHAT-E-017 | AC-NFR-CHAT-004；05 §13.3～8、真相源§7；03 §15.7；TC/EV存在且scope/路径明确；pass/fail可判定，P0无waiver | pass_with_upstream_blockers | build/run/实际证据仍waiting，real能力不借fixture推断 |
| GATE-CHAT-E-018 | AC-CHAT-005；本章§10.3～7；05 §13.7/14；00 §14.4；TC/EV存在且scope/路径明确；pass/fail可判定，P0无waiver | pass_with_upstream_blockers | build/run/实际证据仍waiting，real能力不借fixture推断 |

### 跨证据/报告门禁审计（设计过程记录）

| 审计项 | 结论/处理 |
|---|---|
| 缺contract/TC/EV/report | 本Step各项均回指既有03/04/05；无新TC/EV |
| 重复/冲突裁决 | 共用EV按TC/variant取子集；P0/VETO优先，parentAC仅聚合，不重复计通过 |
| source/状态/phase漂移 | 只当前正式值；planned/schema不是实测/结果，07boundary waiting |
| 范围越界 | 不验owner内部实现，不private API/bus；scope不足blocked，不伪real |


## 8. 回填草稿

正式06 §10回填本步§7裁决结论/表/schema；过程停审、差异和自检留本文件，不冒充实际结果。

## 9. 待确认事项

CHAT-UP001～009/WS-UP001～008/BASE001/native/OS/AT/生产预算/精确版本/来源/发布/归档继续open/blocked。角色、build、run_id、报告、actualEV、风险接受与签署均waiting；没有当前放行或readiness。

## 10. 自检及下一Step门禁

16EV涵盖既有216TC，每项实际scope/分母/rawsafeartifact/report明确；验收DTO必填/enum/null/digest/writer/reader与review不自引用，无真实报告。 本地规则设计gate pass_with_upstream_blockers；允许Step11先读取台账/flow/当前产物与对应SOP，不创建其它未来Step。
