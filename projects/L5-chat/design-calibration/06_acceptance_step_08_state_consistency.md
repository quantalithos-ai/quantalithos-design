# L5-chat 06 · Step 8 状态机、事务与一致性验收

## 1. Step状态

> done / pass_with_upstream_blockers；2026-10-01。这里只定义验收规则，所有TC/EV为planned预约，无实际验收结果或签署。

## 2. 本步输入

前序Step7 local gate已通过；06 SOP Step8、书写规范5.8；00实际36AC、03契约、04配置、05TC/EV和证据schema；中间产物§5.10与真相源§7。

## 3. SOP问题回答

状态、非法/guard、原子提交、副作用/幂等/并发如何裁决？正式12enum表与33卡回同名矩阵/flow及TC，失败/未知边界明确。

## 4. 当前文档问题诊断

共享enum/代表row和泛化rollback会漏五page、原slot全部检查与hide优先；unknown retry标签容易被误当重发权限。

## 5. 改动前后对比

| 改前 | 改后 | 原因 |
|---|---|---|
| 共享enum/代表row和泛化rollback会漏五page、原slot全部检查与hide优先；unknown retry标签容易被误当重发权限。 | §7结构化裁决 | 保持正式contract/TC/EV与证据能力一致 |

## 6. 验收裁决取舍与复杂度

17主体独立三类全矩阵+root原子1项+14调度+15error合并1项，33gate逐项审查；只客户端原子和owner不变量，不要求后端truthwriter。

## 7. 结构化中间产物

### 8.1 正式状态与矩阵

optimistic只是反馈派生，不新增state；ShellLifecyclePosture仅技术通知消费，不作为第18个业务主体。17主体共享12enum，但五page与projectnavigation各自测全矩阵，不能只测一个enum。

| canonical enum | 正式variants | 来源 |
|---|---|---|
| RoutePhase | unresolved/resolved/restricted/expired/cleared | 03 §5唯一定义/§9矩阵；05 §6.3 |
| AccessAvailability | available/read_only/restricted/unavailable/blocked/hidden | 03 §5唯一定义/§9矩阵；05 §6.3 |
| ConsumptionContextPosture | active/invalidated/cleared | 03 §5唯一定义/§9矩阵；05 §6.3 |
| SelectionPhase | empty/selected/stale/cleared | 03 §5唯一定义/§9矩阵；05 §6.3 |
| PageLoadPosture | loading/ready/partial/stale/blocked/unavailable | 03 §5唯一定义/§9矩阵；05 §6.3 |
| DraftPhase | empty/editing/locally_valid/invalid/submitting/restored/cleared | 03 §5唯一定义/§9矩阵；05 §6.3 |
| CommandResultPosture | draft/submitted/pending/confirmed/rejected/failed/unknown | 03 §5唯一定义/§9矩阵；05 §6.3 |
| FreshnessState | fresh/stale/partial/unknown/expired | 03 §5唯一定义/§9矩阵；05 §6.3 |
| DisclosurePosture | visible/redacted/restricted/unavailable/cleared | 03 §5唯一定义/§9矩阵；05 §6.3 |
| ContinuityPhase | fresh/stale/gap/reconnecting/resuming/restricted/blocked/needs_action | 03 §5唯一定义/§9矩阵；05 §6.3 |
| LocalProjectionState | absent/cached/restored/stale/restricted/evicting/cleared | 03 §5唯一定义/§9矩阵；05 §6.3 |
| CapabilityAvailability | available/restricted/unavailable/needs_action/unknown | 03 §5唯一定义/§9矩阵；05 §6.3 |

每主体须当前03对应合法矩阵**全行**、所有From/To多值分支、逐guard missing/mismatch及未列非法组合全部验证；newgeneration是新实例，不升级旧对象。TC-STATE每族参数分母由实际冻结manifest复核，遗漏、过滤或仅代表row不得passed。

#### GATE-CHAT-S-001 RouteContext / RoutePhase

| 要素 | 裁决要求 |
|---|---|
| 父AC/优先级 | AC-CHAT-005 / P0 |
| 设计契约 | 03 §9.4.1与§5同名factory/enum；05 §6.3.1 |
| TC（既有planned） | TC-STATE-001, TC-STATE-002, TC-STATE-003 |
| EV（既有planned） | EV-UNIT-003 |
| 固定report入口 | reports/runs/<run_id>/evidence-index.md；reports/runs/<run_id>/evidence/EV-UNIT-003.md |
| machine回链 | 05 §13.1对应suite/report.json→cases/<TC-ID>--<variant_id>.json→meta/context/manifest；同一批准baseline的固定run集合 |
| 通过条件 | unresolved→resolved；expired新generation重验；全合法row字段/To/localSDK副作用匹配，逐guard与全部非法迁移按正式错误拒绝；失败原对象不变或按合同收紧；所需TC参数全集/guard/负向均满足，证据scope不升级；本地contract证据可验证，不替代必要real层 |
| 失败/缺证据 | 缓存/deeplink不能直接resolved且authorized对应防护不成立；旧代次复活、非法迁移/缺guard被接受、原对象/owner effect非法变更；缺/failed/blocked/skipped/not_run/过期错版证据不得passed |
| 裁决影响 | P0不满足即不通过；送验baseline尚缺时保持blocked，不产生最终结论；若实际命中§11 VETO则总体强制不通过，不可waive |

#### GATE-CHAT-S-002 AccessPosture / AccessAvailability

| 要素 | 裁决要求 |
|---|---|
| 父AC/优先级 | AC-CHAT-005 / P0 |
| 设计契约 | 03 §9.4.2与§5同名factory/enum；05 §6.3.2 |
| TC（既有planned） | TC-STATE-004, TC-STATE-005, TC-STATE-006 |
| EV（既有planned） | EV-UNIT-003 |
| 固定report入口 | reports/runs/<run_id>/evidence-index.md；reports/runs/<run_id>/evidence/EV-UNIT-003.md |
| machine回链 | 05 §13.1对应suite/report.json→cases/<TC-ID>--<variant_id>.json→meta/context/manifest；同一批准baseline的固定run集合 |
| 通过条件 | 正式可读与安全收紧分别处理；全合法row字段/To/localSDK副作用匹配，逐guard与全部非法迁移按正式错误拒绝；失败原对象不变或按合同收紧；所需TC参数全集/guard/负向均满足，证据scope不升级；本地contract证据可验证，不替代必要real层 |
| 失败/缺证据 | hidden不能被technical unavailable恢复对应防护不成立；旧代次复活、非法迁移/缺guard被接受、原对象/owner effect非法变更；缺/failed/blocked/skipped/not_run/过期错版证据不得passed |
| 裁决影响 | P0不满足即不通过；送验baseline尚缺时保持blocked，不产生最终结论；若实际命中§11 VETO则总体强制不通过，不可waive |

#### GATE-CHAT-S-003 ClientConsumptionContext / ConsumptionContextPosture

| 要素 | 裁决要求 |
|---|---|
| 父AC/优先级 | AC-CHAT-005 / P0 |
| 设计契约 | 03 §9.4.3与§5同名factory/enum；05 §6.3.3 |
| TC（既有planned） | TC-STATE-007, TC-STATE-008, TC-STATE-009 |
| EV（既有planned） | EV-UNIT-003 |
| 固定report入口 | reports/runs/<run_id>/evidence-index.md；reports/runs/<run_id>/evidence/EV-UNIT-003.md |
| machine回链 | 05 §13.1对应suite/report.json→cases/<TC-ID>--<variant_id>.json→meta/context/manifest；同一批准baseline的固定run集合 |
| 通过条件 | active→invalidated→cleared；新slot另建；全合法row字段/To/localSDK副作用匹配，逐guard与全部非法迁移按正式错误拒绝；失败原对象不变或按合同收紧；所需TC参数全集/guard/负向均满足，证据scope不升级；本地contract证据可验证，不替代必要real层 |
| 失败/缺证据 | 旧slot/mismatchedactor/source拒绝对应防护不成立；旧代次复活、非法迁移/缺guard被接受、原对象/owner effect非法变更；缺/failed/blocked/skipped/not_run/过期错版证据不得passed |
| 裁决影响 | P0不满足即不通过；送验baseline尚缺时保持blocked，不产生最终结论；若实际命中§11 VETO则总体强制不通过，不可waive |

#### GATE-CHAT-S-004 SelectionState / SelectionPhase

| 要素 | 裁决要求 |
|---|---|
| 父AC/优先级 | AC-CHAT-005 / P0 |
| 设计契约 | 03 §9.5.1与§5同名factory/enum；05 §6.3.4 |
| TC（既有planned） | TC-STATE-010, TC-STATE-011, TC-STATE-012 |
| EV（既有planned） | EV-UI-002 |
| 固定report入口 | reports/runs/<run_id>/evidence-index.md；reports/runs/<run_id>/evidence/EV-UI-002.md |
| machine回链 | 05 §13.1对应suite/report.json→cases/<TC-ID>--<variant_id>.json→meta/context/manifest；同一批准baseline的固定run集合 |
| 通过条件 | empty→selected；stale/clear后新current选择；全合法row字段/To/localSDK副作用匹配，逐guard与全部非法迁移按正式错误拒绝；失败原对象不变或按合同收紧；所需TC参数全集/guard/负向均满足，证据scope不升级；本地contract证据可验证，不替代必要real层 |
| 失败/缺证据 | 跨context或隐藏target不选中对应防护不成立；旧代次复活、非法迁移/缺guard被接受、原对象/owner effect非法变更；缺/failed/blocked/skipped/not_run/过期错版证据不得passed |
| 裁决影响 | P0不满足即不通过；送验baseline尚缺时保持blocked，不产生最终结论；若实际命中§11 VETO则总体强制不通过，不可waive |

#### GATE-CHAT-S-005 ProjectNavigationState / SelectionPhase

| 要素 | 裁决要求 |
|---|---|
| 父AC/优先级 | AC-CHAT-005 / P0 |
| 设计契约 | 03 §9.5.2与§5同名factory/enum；05 §6.3.5 |
| TC（既有planned） | TC-STATE-013, TC-STATE-014, TC-STATE-015 |
| EV（既有planned） | EV-UI-002 |
| 固定report入口 | reports/runs/<run_id>/evidence-index.md；reports/runs/<run_id>/evidence/EV-UI-002.md |
| machine回链 | 05 §13.1对应suite/report.json→cases/<TC-ID>--<variant_id>.json→meta/context/manifest；同一批准baseline的固定run集合 |
| 通过条件 | safeproject五tab/整体→stage→node选择；全合法row字段/To/localSDK副作用匹配，逐guard与全部非法迁移按正式错误拒绝；失败原对象不变或按合同收紧；所需TC参数全集/guard/负向均满足，证据scope不升级；本地contract证据可验证，不替代必要real层 |
| 失败/缺证据 | 旧parent/不获准node不能进入对应防护不成立；旧代次复活、非法迁移/缺guard被接受、原对象/owner effect非法变更；缺/failed/blocked/skipped/not_run/过期错版证据不得passed |
| 裁决影响 | P0不满足即不通过；送验baseline尚缺时保持blocked，不产生最终结论；若实际命中§11 VETO则总体强制不通过，不可waive |

#### GATE-CHAT-S-006 ProjectDetailViewModel / PageLoadPosture

| 要素 | 裁决要求 |
|---|---|
| 父AC/优先级 | AC-CHAT-005 / P0 |
| 设计契约 | 03 §9.5.3与§5同名factory/enum；05 §6.3.6 |
| TC（既有planned） | TC-STATE-016, TC-STATE-017, TC-STATE-018 |
| EV（既有planned） | EV-UI-002 |
| 固定report入口 | reports/runs/<run_id>/evidence-index.md；reports/runs/<run_id>/evidence/EV-UI-002.md |
| machine回链 | 05 §13.1对应suite/report.json→cases/<TC-ID>--<variant_id>.json→meta/context/manifest；同一批准baseline的固定run集合 |
| 通过条件 | loading→ready/partial，变化→stale，revoke→blocked；全合法row字段/To/localSDK副作用匹配，逐guard与全部非法迁移按正式错误拒绝；失败原对象不变或按合同收紧；所需TC参数全集/guard/负向均满足，证据scope不升级；本地contract证据可验证，不替代必要real层 |
| 失败/缺证据 | 混合source不可一次fresh，failLoad不覆盖新generation对应防护不成立；旧代次复活、非法迁移/缺guard被接受、原对象/owner effect非法变更；缺/failed/blocked/skipped/not_run/过期错版证据不得passed |
| 裁决影响 | P0不满足即不通过；送验baseline尚缺时保持blocked，不产生最终结论；若实际命中§11 VETO则总体强制不通过，不可waive |

#### GATE-CHAT-S-007 ProcessFlowViewModel / PageLoadPosture

| 要素 | 裁决要求 |
|---|---|
| 父AC/优先级 | AC-CHAT-005 / P0 |
| 设计契约 | 03 §9.5.4与§5同名factory/enum；05 §6.3.7 |
| TC（既有planned） | TC-STATE-019, TC-STATE-020, TC-STATE-021 |
| EV（既有planned） | EV-UI-002 |
| 固定report入口 | reports/runs/<run_id>/evidence-index.md；reports/runs/<run_id>/evidence/EV-UI-002.md |
| machine回链 | 05 §13.1对应suite/report.json→cases/<TC-ID>--<variant_id>.json→meta/context/manifest；同一批准baseline的固定run集合 |
| 通过条件 | 正式拓扑loading→ready/partial；父变化stale；全合法row字段/To/localSDK副作用匹配，逐guard与全部非法迁移按正式错误拒绝；失败原对象不变或按合同收紧；所需TC参数全集/guard/负向均满足，证据scope不升级；本地contract证据可验证，不替代必要real层 |
| 失败/缺证据 | 无source/不兼容版本不ready对应防护不成立；旧代次复活、非法迁移/缺guard被接受、原对象/owner effect非法变更；缺/failed/blocked/skipped/not_run/过期错版证据不得passed |
| 裁决影响 | P0不满足即不通过；送验baseline尚缺时保持blocked，不产生最终结论；若实际命中§11 VETO则总体强制不通过，不可waive |

#### GATE-CHAT-S-008 ProcessNodeDetailViewModel / PageLoadPosture

| 要素 | 裁决要求 |
|---|---|
| 父AC/优先级 | AC-CHAT-005 / P0 |
| 设计契约 | 03 §9.5.5与§5同名factory/enum；05 §6.3.8 |
| TC（既有planned） | TC-STATE-022, TC-STATE-023, TC-STATE-024 |
| EV（既有planned） | EV-UI-002 |
| 固定report入口 | reports/runs/<run_id>/evidence-index.md；reports/runs/<run_id>/evidence/EV-UI-002.md |
| machine回链 | 05 §13.1对应suite/report.json→cases/<TC-ID>--<variant_id>.json→meta/context/manifest；同一批准baseline的固定run集合 |
| 通过条件 | 当前node section loading→ready/partial；全合法row字段/To/localSDK副作用匹配，逐guard与全部非法迁移按正式错误拒绝；失败原对象不变或按合同收紧；所需TC参数全集/guard/负向均满足，证据scope不升级；本地contract证据可验证，不替代必要real层 |
| 失败/缺证据 | late node不覆写，hidden引用清理对应防护不成立；旧代次复活、非法迁移/缺guard被接受、原对象/owner effect非法变更；缺/failed/blocked/skipped/not_run/过期错版证据不得passed |
| 裁决影响 | P0不满足即不通过；送验baseline尚缺时保持blocked，不产生最终结论；若实际命中§11 VETO则总体强制不通过，不可waive |

#### GATE-CHAT-S-009 ProjectConversationLinkViewModel / PageLoadPosture

| 要素 | 裁决要求 |
|---|---|
| 父AC/优先级 | AC-CHAT-005 / P0 |
| 设计契约 | 03 §9.5.6与§5同名factory/enum；05 §6.3.9 |
| TC（既有planned） | TC-STATE-025, TC-STATE-026, TC-STATE-027 |
| EV（既有planned） | EV-UI-003 |
| 固定report入口 | reports/runs/<run_id>/evidence-index.md；reports/runs/<run_id>/evidence/EV-UI-003.md |
| machine回链 | 05 §13.1对应suite/report.json→cases/<TC-ID>--<variant_id>.json→meta/context/manifest；同一批准baseline的固定run集合 |
| 通过条件 | 正式关系+target各access→ready/partial；全合法row字段/To/localSDK副作用匹配，逐guard与全部非法迁移按正式错误拒绝；失败原对象不变或按合同收紧；所需TC参数全集/guard/负向均满足，证据scope不升级；本地contract证据可验证，不替代必要real层 |
| 失败/缺证据 | 本地binding不ready，解除清目标对应防护不成立；旧代次复活、非法迁移/缺guard被接受、原对象/owner effect非法变更；缺/failed/blocked/skipped/not_run/过期错版证据不得passed |
| 裁决影响 | P0不满足即不通过；送验baseline尚缺时保持blocked，不产生最终结论；若实际命中§11 VETO则总体强制不通过，不可waive |

#### GATE-CHAT-S-010 CompanyDirectoryViewModel / PageLoadPosture

| 要素 | 裁决要求 |
|---|---|
| 父AC/优先级 | AC-CHAT-005 / P0 |
| 设计契约 | 03 §9.5.7与§5同名factory/enum；05 §6.3.10 |
| TC（既有planned） | TC-STATE-028, TC-STATE-029, TC-STATE-030 |
| EV（既有planned） | EV-UI-003 |
| 固定report入口 | reports/runs/<run_id>/evidence-index.md；reports/runs/<run_id>/evidence/EV-UI-003.md |
| machine回链 | 05 §13.1对应suite/report.json→cases/<TC-ID>--<variant_id>.json→meta/context/manifest；同一批准baseline的固定run集合 |
| 通过条件 | newquery→loading→ready/partial；全合法row字段/To/localSDK副作用匹配，逐guard与全部非法迁移按正式错误拒绝；失败原对象不变或按合同收紧；所需TC参数全集/guard/负向均满足，证据scope不升级；本地contract证据可验证，不替代必要real层 |
| 失败/缺证据 | oldpage lineage不ready，不猜coverage对应防护不成立；旧代次复活、非法迁移/缺guard被接受、原对象/owner effect非法变更；缺/failed/blocked/skipped/not_run/过期错版证据不得passed |
| 裁决影响 | P0不满足即不通过；送验baseline尚缺时保持blocked，不产生最终结论；若实际命中§11 VETO则总体强制不通过，不可waive |

#### GATE-CHAT-S-011 DraftState / DraftPhase

| 要素 | 裁决要求 |
|---|---|
| 父AC/优先级 | AC-CHAT-005 / P0 |
| 设计契约 | 03 §9.6.1与§5同名factory/enum；05 §6.3.11 |
| TC（既有planned） | TC-STATE-031, TC-STATE-032, TC-STATE-033 |
| EV（既有planned） | EV-UNIT-001 |
| 固定report入口 | reports/runs/<run_id>/evidence-index.md；reports/runs/<run_id>/evidence/EV-UNIT-001.md |
| machine回链 | 05 §13.1对应suite/report.json→cases/<TC-ID>--<variant_id>.json→meta/context/manifest；同一批准baseline的固定run集合 |
| 通过条件 | editing→locally_valid→submitting；失败release后editing再验；全合法row字段/To/localSDK副作用匹配，逐guard与全部非法迁移按正式错误拒绝；失败原对象不变或按合同收紧；所需TC参数全集/guard/负向均满足，证据scope不升级；本地contract证据可验证，不替代必要real层 |
| 失败/缺证据 | unknown/pending不能释放旧submitting用于重发对应防护不成立；旧代次复活、非法迁移/缺guard被接受、原对象/owner effect非法变更；缺/failed/blocked/skipped/not_run/过期错版证据不得passed |
| 裁决影响 | P0不满足即不通过；送验baseline尚缺时保持blocked，不产生最终结论；若实际命中§11 VETO则总体强制不通过，不可waive |

#### GATE-CHAT-S-012 CommandAttemptState / CommandResultPosture

| 要素 | 裁决要求 |
|---|---|
| 父AC/优先级 | AC-CHAT-005 / P0 |
| 设计契约 | 03 §9.6.2与§5同名factory/enum；05 §6.3.12 |
| TC（既有planned） | TC-STATE-034, TC-STATE-035, TC-STATE-036 |
| EV（既有planned） | EV-UNIT-001 |
| 固定report入口 | reports/runs/<run_id>/evidence-index.md；reports/runs/<run_id>/evidence/EV-UNIT-001.md |
| machine回链 | 05 §13.1对应suite/report.json→cases/<TC-ID>--<variant_id>.json→meta/context/manifest；同一批准baseline的固定run集合 |
| 通过条件 | draft→submitted→pending/confirmed或unknown→probe；全合法row字段/To/localSDK副作用匹配，逐guard与全部非法迁移按正式错误拒绝；失败原对象不变或按合同收紧；所需TC参数全集/guard/负向均满足，证据scope不升级；本地contract证据可验证，不替代必要real层 |
| 失败/缺证据 | ACK不能confirmed，unknown无automatic_retry，terminal不反转对应防护不成立；旧代次复活、非法迁移/缺guard被接受、原对象/owner effect非法变更；缺/failed/blocked/skipped/not_run/过期错版证据不得passed |
| 裁决影响 | P0不满足即不通过；送验baseline尚缺时保持blocked，不产生最终结论；若实际命中§11 VETO则总体强制不通过，不可waive |

#### GATE-CHAT-S-013 FreshnessMarker / FreshnessState

| 要素 | 裁决要求 |
|---|---|
| 父AC/优先级 | AC-CHAT-005 / P0 |
| 设计契约 | 03 §9.7.1与§5同名factory/enum；05 §6.3.13 |
| TC（既有planned） | TC-STATE-037, TC-STATE-038, TC-STATE-039 |
| EV（既有planned） | EV-UNIT-002 |
| 固定report入口 | reports/runs/<run_id>/evidence-index.md；reports/runs/<run_id>/evidence/EV-UNIT-002.md |
| machine回链 | 05 §13.1对应suite/report.json→cases/<TC-ID>--<variant_id>.json→meta/context/manifest；同一批准baseline的固定run集合 |
| 通过条件 | 正式sourcecoverage更新；过期/stale收紧；全合法row字段/To/localSDK副作用匹配，逐guard与全部非法迁移按正式错误拒绝；失败原对象不变或按合同收紧；所需TC参数全集/guard/负向均满足，证据scope不升级；本地contract证据可验证，不替代必要real层 |
| 失败/缺证据 | cache/arrival/跨source成功不fresh对应防护不成立；旧代次复活、非法迁移/缺guard被接受、原对象/owner effect非法变更；缺/failed/blocked/skipped/not_run/过期错版证据不得passed |
| 裁决影响 | P0不满足即不通过；送验baseline尚缺时保持blocked，不产生最终结论；若实际命中§11 VETO则总体强制不通过，不可waive |

#### GATE-CHAT-S-014 SafeMaterialSnapshot / DisclosurePosture

| 要素 | 裁决要求 |
|---|---|
| 父AC/优先级 | AC-CHAT-005 / P0 |
| 设计契约 | 03 §9.7.2与§5同名factory/enum；05 §6.3.14 |
| TC（既有planned） | TC-STATE-040, TC-STATE-041, TC-STATE-042 |
| EV（既有planned） | EV-UNIT-004 |
| 固定report入口 | reports/runs/<run_id>/evidence-index.md；reports/runs/<run_id>/evidence/EV-UNIT-004.md |
| machine回链 | 05 §13.1对应suite/report.json→cases/<TC-ID>--<variant_id>.json→meta/context/manifest；同一批准baseline的固定run集合 |
| 通过条件 | 按正式visibility允许→收紧/cleared；全合法row字段/To/localSDK副作用匹配，逐guard与全部非法迁移按正式错误拒绝；失败原对象不变或按合同收紧；所需TC参数全集/guard/负向均满足，证据scope不升级；本地contract证据可验证，不替代必要real层 |
| 失败/缺证据 | 未知/撤销内容不展示，不可降级还保留title对应防护不成立；旧代次复活、非法迁移/缺guard被接受、原对象/owner effect非法变更；缺/failed/blocked/skipped/not_run/过期错版证据不得passed |
| 裁决影响 | P0不满足即不通过；送验baseline尚缺时保持blocked，不产生最终结论；若实际命中§11 VETO则总体强制不通过，不可waive |

#### GATE-CHAT-S-015 ContinuityState / ContinuityPhase

| 要素 | 裁决要求 |
|---|---|
| 父AC/优先级 | AC-CHAT-005 / P0 |
| 设计契约 | 03 §9.7.3与§5同名factory/enum；05 §6.3.15 |
| TC（既有planned） | TC-STATE-043, TC-STATE-044, TC-STATE-045 |
| EV（既有planned） | EV-UNIT-002 |
| 固定report入口 | reports/runs/<run_id>/evidence-index.md；reports/runs/<run_id>/evidence/EV-UNIT-002.md |
| machine回链 | 05 §13.1对应suite/report.json→cases/<TC-ID>--<variant_id>.json→meta/context/manifest；同一批准baseline的固定run集合 |
| 通过条件 | stale/gap→resuming→formalcoverage fresh；全合法row字段/To/localSDK副作用匹配，逐guard与全部非法迁移按正式错误拒绝；失败原对象不变或按合同收紧；所需TC参数全集/guard/负向均满足，证据scope不升级；本地contract证据可验证，不替代必要real层 |
| 失败/缺证据 | reconnecting或单event不清gap对应防护不成立；旧代次复活、非法迁移/缺guard被接受、原对象/owner effect非法变更；缺/failed/blocked/skipped/not_run/过期错版证据不得passed |
| 裁决影响 | P0不满足即不通过；送验baseline尚缺时保持blocked，不产生最终结论；若实际命中§11 VETO则总体强制不通过，不可waive |

#### GATE-CHAT-S-016 LocalProjectionEntry / LocalProjectionState

| 要素 | 裁决要求 |
|---|---|
| 父AC/优先级 | AC-CHAT-005 / P0 |
| 设计契约 | 03 §9.7.4与§5同名factory/enum；05 §6.3.16 |
| TC（既有planned） | TC-STATE-046, TC-STATE-047, TC-STATE-048 |
| EV（既有planned） | EV-UNIT-004 |
| 固定report入口 | reports/runs/<run_id>/evidence-index.md；reports/runs/<run_id>/evidence/EV-UNIT-004.md |
| machine回链 | 05 §13.1对应suite/report.json→cases/<TC-ID>--<variant_id>.json→meta/context/manifest；同一批准baseline的固定run集合 |
| 通过条件 | cached→restored/stale；evicting→confirmeddelete cleared；全合法row字段/To/localSDK副作用匹配，逐guard与全部非法迁移按正式错误拒绝；失败原对象不变或按合同收紧；所需TC参数全集/guard/负向均满足，证据scope不升级；本地contract证据可验证，不替代必要real层 |
| 失败/缺证据 | failed delete不cleared，restored不authorized/fresh对应防护不成立；旧代次复活、非法迁移/缺guard被接受、原对象/owner effect非法变更；缺/failed/blocked/skipped/not_run/过期错版证据不得passed |
| 裁决影响 | P0不满足即不通过；送验baseline尚缺时保持blocked，不产生最终结论；若实际命中§11 VETO则总体强制不通过，不可waive |

#### GATE-CHAT-S-017 PlatformCapabilityState / CapabilityAvailability

| 要素 | 裁决要求 |
|---|---|
| 父AC/优先级 | AC-CHAT-005 / P0 |
| 设计契约 | 03 §9.8.1与§5同名factory/enum；05 §6.3.17 |
| TC（既有planned） | TC-STATE-049, TC-STATE-050, TC-STATE-051 |
| EV（既有planned） | EV-NATIVE-001 |
| 固定report入口 | reports/runs/<run_id>/evidence-index.md；reports/runs/<run_id>/evidence/EV-NATIVE-001.md |
| machine回链 | 05 §13.1对应suite/report.json→cases/<TC-ID>--<variant_id>.json→meta/context/manifest；同一批准baseline的固定run集合 |
| 通过条件 | 每capability独立probe五态；全合法row字段/To/localSDK副作用匹配，逐guard与全部非法迁移按正式错误拒绝；失败原对象不变或按合同收紧；所需TC参数全集/guard/负向均满足，证据scope不升级；本地contract证据可验证，不替代必要real层 |
| 失败/缺证据 | 无host proof不available，host可用不intent可用对应防护不成立；旧代次复活、非法迁移/缺guard被接受、原对象/owner effect非法变更；缺/failed/blocked/skipped/not_run/过期错版证据不得passed |
| 裁决影响 | P0不满足即不通过；送验baseline尚缺时保持blocked，不产生最终结论；若实际命中§11 VETO则总体强制不通过，不可waive |

### 8.2 客户端原子边界与十四竞态

Chat无backend事务/outbox/auditwriter；不把后端rollback测试复制过来。原子单元为immutable root.compareAndSet与versioned memoryrepo：比较当前版本/fence/全部原ConsumptionChecks在同JSturn完成并写入；不把await后的incoming slot重标current。

#### GATE-CHAT-TX-001 root/repo原子性

| 要素 | 裁决要求 |
|---|---|
| 父AC/优先级 | AC-NFR-CHAT-005 / P0 |
| 设计契约 | 03 §10/§12 CUT-ROOT/CAS；05 §6.1/6.5 |
| TC（既有planned） | TC-CONC-001, TC-CONC-006, TC-CONC-007, TC-CONC-009, TC-CONC-010, TC-CONC-013, TC-CONC-014 |
| EV（既有planned） | EV-UNIT-001, EV-UNIT-002, EV-UNIT-004, EV-UI-002 |
| 固定report入口 | reports/runs/<run_id>/evidence-index.md；reports/runs/<run_id>/evidence/EV-UNIT-001.md；reports/runs/<run_id>/evidence/EV-UNIT-002.md；reports/runs/<run_id>/evidence/EV-UNIT-004.md；reports/runs/<run_id>/evidence/EV-UI-002.md |
| machine回链 | 05 §13.1对应suite/report.json→cases/<TC-ID>--<variant_id>.json→meta/context/manifest；同一批准baseline的固定run集合 |
| 通过条件 | root expected版+currentfence+alloriginalslots及source/parent/querylineage同turn比较；slice/acceptedids/watermark一CAS全写或全不写；memoryrepo版/fence+mutation同turn；仅dispatchreservation winner之后一次SDKeffect；所需TC参数全集/guard/负向均满足，证据scope不升级；本地contract证据可验证，不替代必要real层 |
| 失败/缺证据 | 部分patch、水位已进而材料未进、slot重写作弊、await间无check写repo、CAS loser也dispatch；缺/failed/blocked/skipped/not_run/过期错版证据不得passed |
| 裁决影响 | P0不满足即不通过；送验baseline尚缺时保持blocked，不产生最终结论；若实际命中§11 VETO则总体强制不通过，不可waive |

#### GATE-CHAT-CONC-001 双提交

| 要素 | 裁决要求 |
|---|---|
| 父AC/优先级 | AC-NFR-CHAT-005 / P0 |
| 设计契约 | 03 §12.1 CONC-01；05 §6.5 |
| TC（既有planned） | TC-CONC-001 |
| EV（既有planned） | EV-UNIT-001 |
| 固定report入口 | reports/runs/<run_id>/evidence-index.md；reports/runs/<run_id>/evidence/EV-UNIT-001.md |
| machine回链 | 05 §13.1对应suite/report.json→cases/<TC-ID>--<variant_id>.json→meta/context/manifest；同一批准baseline的固定run集合 |
| 通过条件 | 同稿revision，defer无effect prepare，Enter与按钮同turn并触发；A→B/B→A/sameturn调度下：先release两prepare，second CAS竞争；单winner dispatched=true/submitted先保存再唯一dispatch；loser无effect；所需TC参数全集/guard/负向均满足，证据scope不升级；本地contract证据可验证，不替代必要real层 |
| 失败/缺证据 | 本场景的singleeffect/版/slot/source/visibility/coverage不变量破坏，或错误推断owner已取消/提交；缺/failed/blocked/skipped/not_run/过期错版证据不得passed |
| 裁决影响 | P0不满足即不通过；送验baseline尚缺时保持blocked，不产生最终结论；若实际命中§11 VETO则总体强制不通过，不可waive |

#### GATE-CHAT-CONC-002 改稿

| 要素 | 裁决要求 |
|---|---|
| 父AC/优先级 | AC-NFR-CHAT-005 / P0 |
| 设计契约 | 03 §12.1 CONC-02；05 §6.5 |
| TC（既有planned） | TC-CONC-002 |
| EV（既有planned） | EV-UNIT-001 |
| 固定report入口 | reports/runs/<run_id>/evidence-index.md；reports/runs/<run_id>/evidence/EV-UNIT-001.md |
| machine回链 | 05 §13.1对应suite/report.json→cases/<TC-ID>--<variant_id>.json→meta/context/manifest；同一批准baseline的固定run集合 |
| 通过条件 | prepare pending时新编辑稿；A→B/B→A/sameturn调度下：release旧dispatch confirmed；frozen payload仍原稿；只同revision清理，新稿保留；所需TC参数全集/guard/负向均满足，证据scope不升级；本地contract证据可验证，不替代必要real层 |
| 失败/缺证据 | 本场景的singleeffect/版/slot/source/visibility/coverage不变量破坏，或错误推断owner已取消/提交；缺/failed/blocked/skipped/not_run/过期错版证据不得passed |
| 裁决影响 | P0不满足即不通过；送验baseline尚缺时保持blocked，不产生最终结论；若实际命中§11 VETO则总体强制不通过，不可waive |

#### GATE-CHAT-CONC-003 Gate重复

| 要素 | 裁决要求 |
|---|---|
| 父AC/优先级 | AC-NFR-CHAT-005 / P0 |
| 设计契约 | 03 §12.1 CONC-03；05 §6.5 |
| TC（既有planned） | TC-CONC-003 |
| EV（既有planned） | EV-UNIT-001 |
| 固定report入口 | reports/runs/<run_id>/evidence-index.md；reports/runs/<run_id>/evidence/EV-UNIT-001.md |
| machine回链 | 05 §13.1对应suite/report.json→cases/<TC-ID>--<variant_id>.json→meta/context/manifest；同一批准baseline的固定run集合 |
| 通过条件 | 同actor/fence/Gate/action多个callback；A→B/B→A/sameturn调度下：并发prepare/reserve；复用同attempt，dispatch一次；撤销capability后零新effect；所需TC参数全集/guard/负向均满足，证据scope不升级；本地contract证据可验证，不替代必要real层 |
| 失败/缺证据 | 本场景的singleeffect/版/slot/source/visibility/coverage不变量破坏，或错误推断owner已取消/提交；缺/failed/blocked/skipped/not_run/过期错版证据不得passed |
| 裁决影响 | P0不满足即不通过；送验baseline尚缺时保持blocked，不产生最终结论；若实际命中§11 VETO则总体强制不通过，不可waive |

#### GATE-CHAT-CONC-004 association

| 要素 | 裁决要求 |
|---|---|
| 父AC/优先级 | AC-NFR-CHAT-005 / P0 |
| 设计契约 | 03 §12.1 CONC-04；05 §6.5 |
| TC（既有planned） | TC-CONC-004 |
| EV（既有planned） | EV-UNIT-001 |
| 固定report入口 | reports/runs/<run_id>/evidence-index.md；reports/runs/<run_id>/evidence/EV-UNIT-001.md |
| machine回链 | 05 §13.1对应suite/report.json→cases/<TC-ID>--<variant_id>.json→meta/context/manifest；同一批准baseline的固定run集合 |
| 通过条件 | 两稿不同payload错误复用association；A→B/B→A/sameturn调度下：SDK qualification拒绝不匹配，authority_missing/invalid_input；不自行生成新key绕过；所需TC参数全集/guard/负向均满足，证据scope不升级；本地contract证据可验证，不替代必要real层 |
| 失败/缺证据 | 本场景的singleeffect/版/slot/source/visibility/coverage不变量破坏，或错误推断owner已取消/提交；缺/failed/blocked/skipped/not_run/过期错版证据不得passed |
| 裁决影响 | P0不满足即不通过；送验baseline尚缺时保持blocked，不产生最终结论；若实际命中§11 VETO则总体强制不通过，不可waive |

#### GATE-CHAT-CONC-005 result/probe

| 要素 | 裁决要求 |
|---|---|
| 父AC/优先级 | AC-NFR-CHAT-005 / P0 |
| 设计契约 | 03 §12.1 CONC-05；05 §6.5 |
| TC（既有planned） | TC-CONC-005 |
| EV（既有planned） | EV-UNIT-001 |
| 固定report入口 | reports/runs/<run_id>/evidence-index.md；reports/runs/<run_id>/evidence/EV-UNIT-001.md |
| machine回链 | 05 §13.1对应suite/report.json→cases/<TC-ID>--<variant_id>.json→meta/context/manifest；同一批准baseline的固定run集合 |
| 通过条件 | 同attempt正式result与probe同时返回；A→B/B→A/sameturn调度下：交换release顺序；terminal相同no-op，冲突authority拒绝，terminal不反转；所需TC参数全集/guard/负向均满足，证据scope不升级；本地contract证据可验证，不替代必要real层 |
| 失败/缺证据 | 本场景的singleeffect/版/slot/source/visibility/coverage不变量破坏，或错误推断owner已取消/提交；缺/failed/blocked/skipped/not_run/过期错版证据不得passed |
| 裁决影响 | P0不满足即不通过；送验baseline尚缺时保持blocked，不产生最终结论；若实际命中§11 VETO则总体强制不通过，不可waive |

#### GATE-CHAT-CONC-006 change/resume

| 要素 | 裁决要求 |
|---|---|
| 父AC/优先级 | AC-NFR-CHAT-005 / P0 |
| 设计契约 | 03 §12.1 CONC-06；05 §6.5 |
| TC（既有planned） | TC-CONC-006 |
| EV（既有planned） | EV-UNIT-002 |
| 固定report入口 | reports/runs/<run_id>/evidence-index.md；reports/runs/<run_id>/evidence/EV-UNIT-002.md |
| machine回链 | 05 §13.1对应suite/report.json→cases/<TC-ID>--<variant_id>.json→meta/context/manifest；同一批准baseline的固定run集合 |
| 通过条件 | 单source patch/水位/accepted身份竞争；A→B/B→A/sameturn调度下：两种release顺序；一CAS全写或全不写，无双apply/丢水位；源B不受A顺序控制；所需TC参数全集/guard/负向均满足，证据scope不升级；本地contract证据可验证，不替代必要real层 |
| 失败/缺证据 | 本场景的singleeffect/版/slot/source/visibility/coverage不变量破坏，或错误推断owner已取消/提交；缺/failed/blocked/skipped/not_run/过期错版证据不得passed |
| 裁决影响 | P0不满足即不通过；送验baseline尚缺时保持blocked，不产生最终结论；若实际命中§11 VETO则总体强制不通过，不可waive |

#### GATE-CHAT-CONC-007 late读取

| 要素 | 裁决要求 |
|---|---|
| 父AC/优先级 | AC-NFR-CHAT-005 / P0 |
| 设计契约 | 03 §12.1 CONC-07；05 §6.5 |
| TC（既有planned） | TC-CONC-007 |
| EV（既有planned） | EV-UI-002 |
| 固定report入口 | reports/runs/<run_id>/evidence-index.md；reports/runs/<run_id>/evidence/EV-UI-002.md |
| machine回链 | 05 §13.1对应suite/report.json→cases/<TC-ID>--<variant_id>.json→meta/context/manifest；同一批准baseline的固定run集合 |
| 通过条件 | 两project/node/search request不同slots；A→B/B→A/sameturn调度下：先新返回再旧返回；旧result context_changed，当前VM/选择/root版本不被旧覆写；所需TC参数全集/guard/负向均满足，证据scope不升级；本地contract证据可验证，不替代必要real层 |
| 失败/缺证据 | 本场景的singleeffect/版/slot/source/visibility/coverage不变量破坏，或错误推断owner已取消/提交；缺/failed/blocked/skipped/not_run/过期错版证据不得passed |
| 裁决影响 | P0不满足即不通过；送验baseline尚缺时保持blocked，不产生最终结论；若实际命中§11 VETO则总体强制不通过，不可waive |

#### GATE-CHAT-CONC-008 父图更新

| 要素 | 裁决要求 |
|---|---|
| 父AC/优先级 | AC-NFR-CHAT-005 / P0 |
| 设计契约 | 03 §12.1 CONC-08；05 §6.5 |
| TC（既有planned） | TC-CONC-008 |
| EV（既有planned） | EV-UI-002 |
| 固定report入口 | reports/runs/<run_id>/evidence-index.md；reports/runs/<run_id>/evidence/EV-UI-002.md |
| machine回链 | 05 §13.1对应suite/report.json→cases/<TC-ID>--<variant_id>.json→meta/context/manifest；同一批准baseline的固定run集合 |
| 通过条件 | child请求未完成，parent换正式版本；A→B/B→A/sameturn调度下：先invalidate旧child再release；无旧node/幽灵edge/隐藏label；需新formal read；所需TC参数全集/guard/负向均满足，证据scope不升级；本地contract证据可验证，不替代必要real层 |
| 失败/缺证据 | 本场景的singleeffect/版/slot/source/visibility/coverage不变量破坏，或错误推断owner已取消/提交；缺/failed/blocked/skipped/not_run/过期错版证据不得passed |
| 裁决影响 | P0不满足即不通过；送验baseline尚缺时保持blocked，不产生最终结论；若实际命中§11 VETO则总体强制不通过，不可waive |

#### GATE-CHAT-CONC-009 撤销

| 要素 | 裁决要求 |
|---|---|
| 父AC/优先级 | AC-NFR-CHAT-005 / P0 |
| 设计契约 | 03 §12.1 CONC-09；05 §6.5 |
| TC（既有planned） | TC-CONC-009 |
| EV（既有planned） | EV-UNIT-002 |
| 固定report入口 | reports/runs/<run_id>/evidence-index.md；reports/runs/<run_id>/evidence/EV-UNIT-002.md |
| machine回链 | 05 §13.1对应suite/report.json→cases/<TC-ID>--<variant_id>.json→meta/context/manifest；同一批准baseline的固定run集合 |
| 通过条件 | 当前scope/source含已关闭node缓存，与query/result竞速；A→B/B→A/sameturn调度下：正式revoke先hide/invalidate再stop/delete，defer失败后release旧返回；无复活/权限恢复；所需TC参数全集/guard/负向均满足，证据scope不升级；本地contract证据可验证，不替代必要real层 |
| 失败/缺证据 | 本场景的singleeffect/版/slot/source/visibility/coverage不变量破坏，或错误推断owner已取消/提交；缺/failed/blocked/skipped/not_run/过期错版证据不得passed |
| 裁决影响 | P0不满足即不通过；送验baseline尚缺时保持blocked，不产生最终结论；若实际命中§11 VETO则总体强制不通过，不可waive |

#### GATE-CHAT-CONC-010 save/登出

| 要素 | 裁决要求 |
|---|---|
| 父AC/优先级 | AC-NFR-CHAT-005 / P0 |
| 设计契约 | 03 §12.1 CONC-10；05 §6.5 |
| TC（既有planned） | TC-CONC-010 |
| EV（既有planned） | EV-UNIT-004 |
| 固定report入口 | reports/runs/<run_id>/evidence-index.md；reports/runs/<run_id>/evidence/EV-UNIT-004.md |
| machine回链 | 05 §13.1对应suite/report.json→cases/<TC-ID>--<variant_id>.json→meta/context/manifest；同一批准baseline的固定run集合 |
| 通过条件 | memory entry版匹配，pending保存与logout/evict竞争；A→B/B→A/sameturn调度下：注销推进fence，save应用时同turn检查；错版/旧fence拒绝，delete失败restricted不cleared；所需TC参数全集/guard/负向均满足，证据scope不升级；本地contract证据可验证，不替代必要real层 |
| 失败/缺证据 | 本场景的singleeffect/版/slot/source/visibility/coverage不变量破坏，或错误推断owner已取消/提交；缺/failed/blocked/skipped/not_run/过期错版证据不得passed |
| 裁决影响 | P0不满足即不通过；送验baseline尚缺时保持blocked，不产生最终结论；若实际命中§11 VETO则总体强制不通过，不可waive |

#### GATE-CHAT-CONC-011 resume重入

| 要素 | 裁决要求 |
|---|---|
| 父AC/优先级 | AC-NFR-CHAT-005 / P0 |
| 设计契约 | 03 §12.1 CONC-11；05 §6.5 |
| TC（既有planned） | TC-CONC-011 |
| EV（既有planned） | EV-UNIT-002 |
| 固定report入口 | reports/runs/<run_id>/evidence-index.md；reports/runs/<run_id>/evidence/EV-UNIT-002.md |
| machine回链 | 05 §13.1对应suite/report.json→cases/<TC-ID>--<variant_id>.json→meta/context/manifest；同一批准baseline的固定run集合 |
| 通过条件 | A、B各source current recovery；A→B/B→A/sameturn调度下：A连续两resume onlysingleflight；B独立；旧A回包不改B或新A水位；所需TC参数全集/guard/负向均满足，证据scope不升级；本地contract证据可验证，不替代必要real层 |
| 失败/缺证据 | 本场景的singleeffect/版/slot/source/visibility/coverage不变量破坏，或错误推断owner已取消/提交；缺/failed/blocked/skipped/not_run/过期错版证据不得passed |
| 裁决影响 | P0不满足即不通过；送验baseline尚缺时保持blocked，不产生最终结论；若实际命中§11 VETO则总体强制不通过，不可waive |

#### GATE-CHAT-CONC-012 跨设备

| 要素 | 裁决要求 |
|---|---|
| 父AC/优先级 | AC-NFR-CHAT-005 / P0 |
| 设计契约 | 03 §12.1 CONC-12；05 §6.5 |
| TC（既有planned） | TC-CONC-012, TC-REAL-001, TC-REAL-004 |
| EV（既有planned） | EV-UNIT-002, EV-SDK-001 |
| 固定report入口 | reports/runs/<run_id>/evidence-index.md；reports/runs/<run_id>/evidence/EV-UNIT-002.md；reports/runs/<run_id>/evidence/EV-SDK-001.md |
| machine回链 | 05 §13.1对应suite/report.json→cases/<TC-ID>--<variant_id>.json→meta/context/manifest；同一批准baseline的固定run集合 |
| 通过条件 | 隔离device A/B，各local root与同正式intent目标；A→B/B→A/sameturn调度下：fixture只证各composition限制；真实server幂等由TC-REAL-004，不能宣称local CAS跨端exactlyonce；所需TC参数全集/guard/负向均满足，证据scope不升级；实际正式SDK能力与TC-REAL-001/004对应参数另证 |
| 失败/缺证据 | 本场景的singleeffect/版/slot/source/visibility/coverage不变量破坏，或错误推断owner已取消/提交；缺/failed/blocked/skipped/not_run/过期错版证据不得passed |
| 裁决影响 | P0不满足即不通过；送验baseline尚缺时保持blocked，不产生最终结论；若实际命中§11 VETO则总体强制不通过，不可waive |

#### GATE-CHAT-CONC-013 有界消费

| 要素 | 裁决要求 |
|---|---|
| 父AC/优先级 | AC-NFR-CHAT-005 / P0 |
| 设计契约 | 03 §12.1 CONC-13；05 §6.5 |
| TC（既有planned） | TC-CONC-013 |
| EV（既有planned） | EV-UNIT-002 |
| 固定report入口 | reports/runs/<run_id>/evidence-index.md；reports/runs/<run_id>/evidence/EV-UNIT-002.md |
| machine回链 | 05 §13.1对应suite/report.json→cases/<TC-ID>--<variant_id>.json→meta/context/manifest；同一批准baseline的固定run集合 |
| 通过条件 | 已达consumed/context/cache limit，后续change到达；A→B/B→A/sameturn调度下：先失效source/slot再重取；不丢dedup继续fresh；覆盖未齐保持gap/stale；所需TC参数全集/guard/负向均满足，证据scope不升级；本地contract证据可验证，不替代必要real层 |
| 失败/缺证据 | 本场景的singleeffect/版/slot/source/visibility/coverage不变量破坏，或错误推断owner已取消/提交；缺/failed/blocked/skipped/not_run/过期错版证据不得passed |
| 裁决影响 | P0不满足即不通过；送验baseline尚缺时保持blocked，不产生最终结论；若实际命中§11 VETO则总体强制不通过，不可waive |

#### GATE-CHAT-CONC-014 dispose晚到

| 要素 | 裁决要求 |
|---|---|
| 父AC/优先级 | AC-NFR-CHAT-005 / P0 |
| 设计契约 | 03 §12.1 CONC-14；05 §6.5 |
| TC（既有planned） | TC-CONC-014 |
| EV（既有planned） | EV-UNIT-002 |
| 固定report入口 | reports/runs/<run_id>/evidence-index.md；reports/runs/<run_id>/evidence/EV-UNIT-002.md |
| machine回链 | 05 §13.1对应suite/report.json→cases/<TC-ID>--<variant_id>.json→meta/context/manifest；同一批准baseline的固定run集合 |
| 通过条件 | effect已dispatch且reply pending；A→B/B→A/sameturn调度下：可信dispose失效root/listener，release旧reply不写新root；取消等待不cancel owner，无second dispatch；所需TC参数全集/guard/负向均满足，证据scope不升级；本地contract证据可验证，不替代必要real层 |
| 失败/缺证据 | 本场景的singleeffect/版/slot/source/visibility/coverage不变量破坏，或错误推断owner已取消/提交；缺/failed/blocked/skipped/not_run/过期错版证据不得passed |
| 裁决影响 | P0不满足即不通过；送验baseline尚缺时保持blocked，不产生最终结论；若实际命中§11 VETO则总体强制不通过，不可waive |

### 8.3 15错误与恢复资格

所有ChatErrorCode和retry用03 §11值；effect_unknown的explicit_after_probe不授unknown重发，必须正式probe证实无effect/业务拒绝并有新capability，用户才可建新intent。dependency_unbound与dependency_unavailable分别保守blocked/暂不可用，不能fallback私有API。

#### GATE-CHAT-ERROR-001 全错误/安全retry

| 要素 | 裁决要求 |
|---|---|
| 父AC/优先级 | AC-NFR-CHAT-003 / P0 |
| 设计契约 | 03 §11；05 §6.6 |
| TC（既有planned） | TC-ERROR-001, TC-ERROR-002, TC-ERROR-003, TC-ERROR-004, TC-ERROR-005, TC-ERROR-006, TC-ERROR-007, TC-ERROR-008, TC-ERROR-009, TC-ERROR-010, TC-ERROR-011, TC-ERROR-012, TC-ERROR-013, TC-ERROR-014, TC-ERROR-015 |
| EV（既有planned） | EV-UNIT-007 |
| 固定report入口 | reports/runs/<run_id>/evidence-index.md；reports/runs/<run_id>/evidence/EV-UNIT-007.md |
| machine回链 | 05 §13.1对应suite/report.json→cases/<TC-ID>--<variant_id>.json→meta/context/manifest；同一批准baseline的固定run集合 |
| 通过条件 | 15code生产入口/finite安全文案/正式retry值与允许动作全部匹配，无rawSDKmessage/stack；不因technicalerror升级权限/confirmed或second dispatch；所需TC参数全集/guard/负向均满足，证据scope不升级；本地contract证据可验证，不替代必要real层 |
| 失败/缺证据 | 错误coercion/unknown自动retry、raw错误外泄、unbound伪装available、取消读被当取消owner；缺/failed/blocked/skipped/not_run/过期错版证据不得passed |
| 裁决影响 | P0不满足即不通过；送验baseline尚缺时保持blocked，不产生最终结论；若实际命中§11 VETO则总体强制不通过，不可waive |

### 本Step逐项停审（设计过程记录）

每项独立完成来源→contract→TC→EV/report→pass/fail→裁决影响后才处理下一项。下表通过仅代表规则审查；实际TC/EV未生成、实际验收未开始。

| 验收项 | 审查项 | local gate | 外部缺口 |
|---|---|---|---|
| GATE-CHAT-S-001 | AC-CHAT-005；03 §9.4.1与§5同名factory/enum；05 §6.3.1；TC/EV存在且scope/路径明确；pass/fail可判定，P0无waiver | pass_with_upstream_blockers | build/run/实际证据仍waiting，real能力不借fixture推断 |
| GATE-CHAT-S-002 | AC-CHAT-005；03 §9.4.2与§5同名factory/enum；05 §6.3.2；TC/EV存在且scope/路径明确；pass/fail可判定，P0无waiver | pass_with_upstream_blockers | build/run/实际证据仍waiting，real能力不借fixture推断 |
| GATE-CHAT-S-003 | AC-CHAT-005；03 §9.4.3与§5同名factory/enum；05 §6.3.3；TC/EV存在且scope/路径明确；pass/fail可判定，P0无waiver | pass_with_upstream_blockers | build/run/实际证据仍waiting，real能力不借fixture推断 |
| GATE-CHAT-S-004 | AC-CHAT-005；03 §9.5.1与§5同名factory/enum；05 §6.3.4；TC/EV存在且scope/路径明确；pass/fail可判定，P0无waiver | pass_with_upstream_blockers | build/run/实际证据仍waiting，real能力不借fixture推断 |
| GATE-CHAT-S-005 | AC-CHAT-005；03 §9.5.2与§5同名factory/enum；05 §6.3.5；TC/EV存在且scope/路径明确；pass/fail可判定，P0无waiver | pass_with_upstream_blockers | build/run/实际证据仍waiting，real能力不借fixture推断 |
| GATE-CHAT-S-006 | AC-CHAT-005；03 §9.5.3与§5同名factory/enum；05 §6.3.6；TC/EV存在且scope/路径明确；pass/fail可判定，P0无waiver | pass_with_upstream_blockers | build/run/实际证据仍waiting，real能力不借fixture推断 |
| GATE-CHAT-S-007 | AC-CHAT-005；03 §9.5.4与§5同名factory/enum；05 §6.3.7；TC/EV存在且scope/路径明确；pass/fail可判定，P0无waiver | pass_with_upstream_blockers | build/run/实际证据仍waiting，real能力不借fixture推断 |
| GATE-CHAT-S-008 | AC-CHAT-005；03 §9.5.5与§5同名factory/enum；05 §6.3.8；TC/EV存在且scope/路径明确；pass/fail可判定，P0无waiver | pass_with_upstream_blockers | build/run/实际证据仍waiting，real能力不借fixture推断 |
| GATE-CHAT-S-009 | AC-CHAT-005；03 §9.5.6与§5同名factory/enum；05 §6.3.9；TC/EV存在且scope/路径明确；pass/fail可判定，P0无waiver | pass_with_upstream_blockers | build/run/实际证据仍waiting，real能力不借fixture推断 |
| GATE-CHAT-S-010 | AC-CHAT-005；03 §9.5.7与§5同名factory/enum；05 §6.3.10；TC/EV存在且scope/路径明确；pass/fail可判定，P0无waiver | pass_with_upstream_blockers | build/run/实际证据仍waiting，real能力不借fixture推断 |
| GATE-CHAT-S-011 | AC-CHAT-005；03 §9.6.1与§5同名factory/enum；05 §6.3.11；TC/EV存在且scope/路径明确；pass/fail可判定，P0无waiver | pass_with_upstream_blockers | build/run/实际证据仍waiting，real能力不借fixture推断 |
| GATE-CHAT-S-012 | AC-CHAT-005；03 §9.6.2与§5同名factory/enum；05 §6.3.12；TC/EV存在且scope/路径明确；pass/fail可判定，P0无waiver | pass_with_upstream_blockers | build/run/实际证据仍waiting，real能力不借fixture推断 |
| GATE-CHAT-S-013 | AC-CHAT-005；03 §9.7.1与§5同名factory/enum；05 §6.3.13；TC/EV存在且scope/路径明确；pass/fail可判定，P0无waiver | pass_with_upstream_blockers | build/run/实际证据仍waiting，real能力不借fixture推断 |
| GATE-CHAT-S-014 | AC-CHAT-005；03 §9.7.2与§5同名factory/enum；05 §6.3.14；TC/EV存在且scope/路径明确；pass/fail可判定，P0无waiver | pass_with_upstream_blockers | build/run/实际证据仍waiting，real能力不借fixture推断 |
| GATE-CHAT-S-015 | AC-CHAT-005；03 §9.7.3与§5同名factory/enum；05 §6.3.15；TC/EV存在且scope/路径明确；pass/fail可判定，P0无waiver | pass_with_upstream_blockers | build/run/实际证据仍waiting，real能力不借fixture推断 |
| GATE-CHAT-S-016 | AC-CHAT-005；03 §9.7.4与§5同名factory/enum；05 §6.3.16；TC/EV存在且scope/路径明确；pass/fail可判定，P0无waiver | pass_with_upstream_blockers | build/run/实际证据仍waiting，real能力不借fixture推断 |
| GATE-CHAT-S-017 | AC-CHAT-005；03 §9.8.1与§5同名factory/enum；05 §6.3.17；TC/EV存在且scope/路径明确；pass/fail可判定，P0无waiver | pass_with_upstream_blockers | build/run/实际证据仍waiting，real能力不借fixture推断 |
| GATE-CHAT-TX-001 | AC-NFR-CHAT-005；03 §10/§12 CUT-ROOT/CAS；05 §6.1/6.5；TC/EV存在且scope/路径明确；pass/fail可判定，P0无waiver | pass_with_upstream_blockers | build/run/实际证据仍waiting，real能力不借fixture推断 |
| GATE-CHAT-CONC-001 | AC-NFR-CHAT-005；03 §12.1 CONC-01；05 §6.5；TC/EV存在且scope/路径明确；pass/fail可判定，P0无waiver | pass_with_upstream_blockers | build/run/实际证据仍waiting，real能力不借fixture推断 |
| GATE-CHAT-CONC-002 | AC-NFR-CHAT-005；03 §12.1 CONC-02；05 §6.5；TC/EV存在且scope/路径明确；pass/fail可判定，P0无waiver | pass_with_upstream_blockers | build/run/实际证据仍waiting，real能力不借fixture推断 |
| GATE-CHAT-CONC-003 | AC-NFR-CHAT-005；03 §12.1 CONC-03；05 §6.5；TC/EV存在且scope/路径明确；pass/fail可判定，P0无waiver | pass_with_upstream_blockers | build/run/实际证据仍waiting，real能力不借fixture推断 |
| GATE-CHAT-CONC-004 | AC-NFR-CHAT-005；03 §12.1 CONC-04；05 §6.5；TC/EV存在且scope/路径明确；pass/fail可判定，P0无waiver | pass_with_upstream_blockers | build/run/实际证据仍waiting，real能力不借fixture推断 |
| GATE-CHAT-CONC-005 | AC-NFR-CHAT-005；03 §12.1 CONC-05；05 §6.5；TC/EV存在且scope/路径明确；pass/fail可判定，P0无waiver | pass_with_upstream_blockers | build/run/实际证据仍waiting，real能力不借fixture推断 |
| GATE-CHAT-CONC-006 | AC-NFR-CHAT-005；03 §12.1 CONC-06；05 §6.5；TC/EV存在且scope/路径明确；pass/fail可判定，P0无waiver | pass_with_upstream_blockers | build/run/实际证据仍waiting，real能力不借fixture推断 |
| GATE-CHAT-CONC-007 | AC-NFR-CHAT-005；03 §12.1 CONC-07；05 §6.5；TC/EV存在且scope/路径明确；pass/fail可判定，P0无waiver | pass_with_upstream_blockers | build/run/实际证据仍waiting，real能力不借fixture推断 |
| GATE-CHAT-CONC-008 | AC-NFR-CHAT-005；03 §12.1 CONC-08；05 §6.5；TC/EV存在且scope/路径明确；pass/fail可判定，P0无waiver | pass_with_upstream_blockers | build/run/实际证据仍waiting，real能力不借fixture推断 |
| GATE-CHAT-CONC-009 | AC-NFR-CHAT-005；03 §12.1 CONC-09；05 §6.5；TC/EV存在且scope/路径明确；pass/fail可判定，P0无waiver | pass_with_upstream_blockers | build/run/实际证据仍waiting，real能力不借fixture推断 |
| GATE-CHAT-CONC-010 | AC-NFR-CHAT-005；03 §12.1 CONC-10；05 §6.5；TC/EV存在且scope/路径明确；pass/fail可判定，P0无waiver | pass_with_upstream_blockers | build/run/实际证据仍waiting，real能力不借fixture推断 |
| GATE-CHAT-CONC-011 | AC-NFR-CHAT-005；03 §12.1 CONC-11；05 §6.5；TC/EV存在且scope/路径明确；pass/fail可判定，P0无waiver | pass_with_upstream_blockers | build/run/实际证据仍waiting，real能力不借fixture推断 |
| GATE-CHAT-CONC-012 | AC-NFR-CHAT-005；03 §12.1 CONC-12；05 §6.5；TC/EV存在且scope/路径明确；pass/fail可判定，P0无waiver | pass_with_upstream_blockers | build/run/实际证据仍waiting，real能力sdk仍blocked |
| GATE-CHAT-CONC-013 | AC-NFR-CHAT-005；03 §12.1 CONC-13；05 §6.5；TC/EV存在且scope/路径明确；pass/fail可判定，P0无waiver | pass_with_upstream_blockers | build/run/实际证据仍waiting，real能力不借fixture推断 |
| GATE-CHAT-CONC-014 | AC-NFR-CHAT-005；03 §12.1 CONC-14；05 §6.5；TC/EV存在且scope/路径明确；pass/fail可判定，P0无waiver | pass_with_upstream_blockers | build/run/实际证据仍waiting，real能力不借fixture推断 |
| GATE-CHAT-ERROR-001 | AC-NFR-CHAT-003；03 §11；05 §6.6；TC/EV存在且scope/路径明确；pass/fail可判定，P0无waiver | pass_with_upstream_blockers | build/run/实际证据仍waiting，real能力不借fixture推断 |

### 跨状态/一致性门禁审计（设计过程记录）

| 审计项 | 结论/处理 |
|---|---|
| 缺contract/TC/EV/report | 本Step各项均回指既有03/04/05；无新TC/EV |
| 重复/冲突裁决 | 共用EV按TC/variant取子集；P0/VETO优先，parentAC仅聚合，不重复计通过 |
| source/状态/phase漂移 | 只当前正式值；planned/schema不是实测/结果，07boundary waiting |
| 范围越界 | 不验owner内部实现，不private API/bus；scope不足blocked，不伪real |


## 8. 回填草稿

正式06 §8回填本步§7裁决结论/表/schema；过程停审、差异和自检留本文件，不冒充实际结果。

## 9. 待确认事项

CHAT-UP001～009/WS-UP001～008/BASE001/native/OS/AT/生产预算/精确版本/来源/发布/归档继续open/blocked。角色、build、run_id、报告、actualEV、风险接受与签署均waiting；没有当前放行或readiness。

## 10. 自检及下一Step门禁

17主体/12enum、14CONC、15error及root/repo原子性local审查闭口；无实际迁移或运行结论。 本地规则设计gate pass_with_upstream_blockers；允许Step9先读取台账/flow/当前产物与对应SOP，不创建其它未来Step。
