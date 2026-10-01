# L5-chat 06 · Step 6 数据边界与架构红线验收

## 1. Step状态

> done / pass_with_upstream_blockers；2026-10-01。这里只定义验收规则，所有TC/EV为planned预约，无实际验收结果或签署。

## 2. 本步输入

前序Step5 local gate已通过；06 SOP Step6、书写规范5.6；00实际36AC、03契约、04配置、05TC/EV和证据schema；中间产物§5.10与真相源§7。

## 3. SOP问题回答

哪些数据/缓存/下游不得造truth、P1不得污染P0、红线失败怎样裁决？22卡逐项明确；初始默认和真实资格分开。

## 4. 当前文档问题诊断

旧架构只写source不归Chat，没有storage/DOM/ARIA/报告全部出口、strict配置与source资格分域裁决。

## 5. 改动前后对比

| 改前 | 改后 | 原因 |
|---|---|---|
| 旧架构只写source不归Chat，没有storage/DOM/ARIA/报告全部出口、strict配置与source资格分域裁决。 | §7结构化裁决 | 保持正式contract/TC/EV与证据能力一致 |

## 6. 验收裁决取舍与复杂度

5BR+5DR+12CFG逐项红线；P0与VETO从当前00～04，不复制backendtruth/UoW。各cut先source与TC/EV再pass/fail审查。

## 7. 结构化中间产物

### 6.1 数据/架构红线

下列每项P0。红线实际违反按§11一票否决；owner内部实现不在Chat范围，客户端使用正式边界是否成立属于范围。禁止数据覆盖store、repo、DOM/ARIA、错误、诊断、stderr/log、export、报告和handoff；rawtruth与允许短暂安全展示view不得混同。

#### GATE-CHAT-R-001 入口与scope红线

| 要素 | 裁决要求 |
|---|---|
| 父AC/优先级 | AC-BR-CHAT-001 / P0 |
| 设计契约 | 00 §10/11/14.3/14.4；01/02 owner/依赖；03 §5/6/10/12/14；05 §5.3/5.4/6 |
| TC（既有planned） | TC-PROTO-009, TC-PROTO-010, TC-PROTO-019, TC-PROTO-020, TC-PROTO-055, TC-PROTO-056, TC-SAFE-001, TC-SAFE-002, TC-REAL-001, TC-REAL-004 |
| EV（既有planned） | EV-UNIT-001, EV-UNIT-002, EV-UNIT-003, EV-UNIT-008, EV-SDK-001 |
| 固定report入口 | reports/runs/<run_id>/evidence-index.md；reports/runs/<run_id>/evidence/EV-UNIT-001.md；reports/runs/<run_id>/evidence/EV-UNIT-002.md；reports/runs/<run_id>/evidence/EV-UNIT-003.md；reports/runs/<run_id>/evidence/EV-UNIT-008.md；reports/runs/<run_id>/evidence/EV-SDK-001.md |
| machine回链 | 05 §13.1对应suite/report.json→cases/<TC-ID>--<variant_id>.json→meta/context/manifest；同一批准baseline的固定run集合 |
| 通过条件 | 只有formalcurrentactor/scope/visibility可披露/操作；URL/空页/缓存不推权限/存在性，deep-link只候选；所需TC参数全集/guard/负向均满足，证据scope不升级；实际正式SDK能力与TC-REAL-001/004对应参数另证 |
| 失败/缺证据 | 资格不明/撤销仍披露或PrivateAPI/bus/DB旁路；缺/failed/blocked/skipped/not_run/过期错版证据不得passed |
| 裁决影响 | P0不满足即不通过；送验baseline尚缺时保持blocked，不产生最终结论；若实际命中§11 VETO则总体强制不通过，不可waive |

#### GATE-CHAT-R-002 owner-safe显化红线

| 要素 | 裁决要求 |
|---|---|
| 父AC/优先级 | AC-BR-CHAT-002 / P0 |
| 设计契约 | 00 §10/11/14.3/14.4；01/02 owner/依赖；03 §5/6/10/12/14；05 §5.3/5.4/6 |
| TC（既有planned） | TC-PROTO-013, TC-PROTO-014, TC-PROTO-015, TC-PROTO-016, TC-PROTO-017, TC-PROTO-018, TC-PROTO-047, TC-PROTO-048, TC-PROTO-057, TC-PROTO-058, TC-SAFE-005, TC-REAL-001, TC-REAL-004 |
| EV（既有planned） | EV-UI-001, EV-UNIT-002, EV-UI-002, EV-UI-003, EV-SDK-001 |
| 固定report入口 | reports/runs/<run_id>/evidence-index.md；reports/runs/<run_id>/evidence/EV-UI-001.md；reports/runs/<run_id>/evidence/EV-UNIT-002.md；reports/runs/<run_id>/evidence/EV-UI-002.md；reports/runs/<run_id>/evidence/EV-UI-003.md；reports/runs/<run_id>/evidence/EV-SDK-001.md |
| machine回链 | 05 §13.1对应suite/report.json→cases/<TC-ID>--<variant_id>.json→meta/context/manifest；同一批准baseline的固定run集合 |
| 通过条件 | 独立source/provenance/type/visibility，safe refs不反解正文或权限；Gate/Process各owner提供结论；所需TC参数全集/guard/负向均满足，证据scope不升级；实际正式SDK能力与TC-REAL-001/004对应参数另证 |
| 失败/缺证据 | 复制ownertruth或隐去降级、隐藏ref/label/count泄露；缺/failed/blocked/skipped/not_run/过期错版证据不得passed |
| 裁决影响 | P0不满足即不通过；送验baseline尚缺时保持blocked，不产生最终结论；若实际命中§11 VETO则总体强制不通过，不可waive |

#### GATE-CHAT-R-003 意图/审批结果红线

| 要素 | 裁决要求 |
|---|---|
| 父AC/优先级 | AC-BR-CHAT-003 / P0 |
| 设计契约 | 00 §10/11/14.3/14.4；01/02 owner/依赖；03 §5/6/10/12/14；05 §5.3/5.4/6 |
| TC（既有planned） | TC-PROTO-001, TC-PROTO-002, TC-PROTO-003, TC-PROTO-004, TC-PROTO-021, TC-PROTO-022, TC-PROTO-051, TC-PROTO-052, TC-PROTO-071, TC-PROTO-072, TC-SAFE-003, TC-REAL-001, TC-REAL-004 |
| EV（既有planned） | EV-UNIT-001, EV-SDK-001 |
| 固定report入口 | reports/runs/<run_id>/evidence-index.md；reports/runs/<run_id>/evidence/EV-UNIT-001.md；reports/runs/<run_id>/evidence/EV-SDK-001.md |
| machine回链 | 05 §13.1对应suite/report.json→cases/<TC-ID>--<variant_id>.json→meta/context/manifest；同一批准baseline的固定run集合 |
| 通过条件 | draft/attempt/ACK/result分开；formalGate与association匹配；unknown只probe/等待；所需TC参数全集/guard/负向均满足，证据scope不升级；实际正式SDK能力与TC-REAL-001/004对应参数另证 |
| 失败/缺证据 | 按钮/ACK当成功、unknown无formalproof重发、client生成Decision；缺/failed/blocked/skipped/not_run/过期错版证据不得passed |
| 裁决影响 | P0不满足即不通过；送验baseline尚缺时保持blocked，不产生最终结论；若实际命中§11 VETO则总体强制不通过，不可waive |

#### GATE-CHAT-R-004 变化/cursor/cache红线

| 要素 | 裁决要求 |
|---|---|
| 父AC/优先级 | AC-BR-CHAT-004 / P0 |
| 设计契约 | 00 §10/11/14.3/14.4；01/02 owner/依赖；03 §5/6/10/12/14；05 §5.3/5.4/6 |
| TC（既有planned） | TC-PROTO-023, TC-PROTO-024, TC-PROTO-049, TC-PROTO-050, TC-PROTO-053, TC-PROTO-054, TC-PROTO-055, TC-PROTO-056, TC-PROTO-067, TC-PROTO-068, TC-PROTO-069, TC-PROTO-070, TC-PROTO-075, TC-PROTO-076, TC-PROTO-081, TC-PROTO-082, TC-REAL-001, TC-REAL-004 |
| EV（既有planned） | EV-UNIT-002, EV-UNIT-005, EV-SDK-001 |
| 固定report入口 | reports/runs/<run_id>/evidence-index.md；reports/runs/<run_id>/evidence/EV-UNIT-002.md；reports/runs/<run_id>/evidence/EV-UNIT-005.md；reports/runs/<run_id>/evidence/EV-SDK-001.md |
| machine回链 | 05 §13.1对应suite/report.json→cases/<TC-ID>--<variant_id>.json→meta/context/manifest；同一批准baseline的固定run集合 |
| 通过条件 | 正式SDK change/resume source-local coverage，cache不授权，local状态不成ownertruth；所需TC参数全集/guard/负向均满足，证据scope不升级；实际正式SDK能力与TC-REAL-001/004对应参数另证 |
| 失败/缺证据 | 内部topic/offset直订、墙上时间补序、partial/resume误globalfresh；缺/failed/blocked/skipped/not_run/过期错版证据不得passed |
| 裁决影响 | P0不满足即不通过；送验baseline尚缺时保持blocked，不产生最终结论；若实际命中§11 VETO则总体强制不通过，不可waive |

#### GATE-CHAT-R-005 平台/外围边界

| 要素 | 裁决要求 |
|---|---|
| 父AC/优先级 | AC-BR-CHAT-005 / P0 |
| 设计契约 | 00 §10/11/14.3/14.4；01/02 owner/依赖；03 §5/6/10/12/14；05 §5.3/5.4/6 |
| TC（既有planned） | TC-PROTO-029, TC-PROTO-030, TC-PROTO-059, TC-PROTO-060, TC-SAFE-006, TC-SAFE-007, TC-SAFE-008, TC-REAL-002 |
| EV（既有planned） | EV-UI-001, EV-UNIT-002, EV-NATIVE-001, EV-UI-003, EV-HOST-001 |
| 固定report入口 | reports/runs/<run_id>/evidence-index.md；reports/runs/<run_id>/evidence/EV-UI-001.md；reports/runs/<run_id>/evidence/EV-UNIT-002.md；reports/runs/<run_id>/evidence/EV-NATIVE-001.md；reports/runs/<run_id>/evidence/EV-UI-003.md；reports/runs/<run_id>/evidence/EV-HOST-001.md |
| machine回链 | 05 §13.1对应suite/report.json→cases/<TC-ID>--<variant_id>.json→meta/context/manifest；同一批准baseline的固定run集合 |
| 通过条件 | shell技术能力与业务资格独立，通知/托盘/快捷键/分享不改结果，未激活增强/mobile不扩大scope；所需TC参数全集/guard/负向均满足，证据scope不升级；真实Desktop批准矩阵与TC-REAL-002另证 |
| 失败/缺证据 | hostavailable赋业务权限、通知即提交、mobile/fake代Desktop；缺/failed/blocked/skipped/not_run/过期错版证据不得passed |
| 裁决影响 | P0不满足即不通过；送验baseline尚缺时保持blocked，不产生最终结论；若实际命中§11 VETO则总体强制不通过，不可waive |

#### GATE-CHAT-R-006 Chat-local数据

| 要素 | 裁决要求 |
|---|---|
| 父AC/优先级 | AC-DR-CHAT-001 / P0 |
| 设计契约 | 00 §10/11/14.3/14.4；01/02 owner/依赖；03 §5/6/10/12/14；05 §5.3/5.4/6 |
| TC（既有planned） | TC-CONC-001, TC-CONC-002, TC-PROTO-027, TC-PROTO-028, TC-PROTO-077, TC-PROTO-078 |
| EV（既有planned） | EV-UNIT-001, EV-UNIT-004 |
| 固定report入口 | reports/runs/<run_id>/evidence-index.md；reports/runs/<run_id>/evidence/EV-UNIT-001.md；reports/runs/<run_id>/evidence/EV-UNIT-004.md |
| machine回链 | 05 §13.1对应suite/report.json→cases/<TC-ID>--<variant_id>.json→meta/context/manifest；同一批准baseline的固定run集合 |
| 通过条件 | route/selection/focus/draft/attempt只当前内存与local版本；无owner业务状态第二份，稿不durable/sync；所需TC参数全集/guard/负向均满足，证据scope不升级；本地contract证据可验证，不替代必要real层 |
| 失败/缺证据 | local数据授权/确认业务、disk正文/稿/handle或跨端私造truth；缺/failed/blocked/skipped/not_run/过期错版证据不得passed |
| 裁决影响 | P0不满足即不通过；送验baseline尚缺时保持blocked，不产生最终结论；若实际命中§11 VETO则总体强制不通过，不可waive |

#### GATE-CHAT-R-007 safe snapshot数据

| 要素 | 裁决要求 |
|---|---|
| 父AC/优先级 | AC-DR-CHAT-002 / P0 |
| 设计契约 | 00 §10/11/14.3/14.4；01/02 owner/依赖；03 §5/6/10/12/14；05 §5.3/5.4/6 |
| TC（既有planned） | TC-PROTO-015, TC-PROTO-016, TC-PROTO-055, TC-PROTO-056, TC-PROTO-057, TC-PROTO-058, TC-CONC-009, TC-REAL-001, TC-REAL-004 |
| EV（既有planned） | EV-UI-001, EV-UNIT-002, EV-SDK-001 |
| 固定report入口 | reports/runs/<run_id>/evidence-index.md；reports/runs/<run_id>/evidence/EV-UI-001.md；reports/runs/<run_id>/evidence/EV-UNIT-002.md；reports/runs/<run_id>/evidence/EV-SDK-001.md |
| machine回链 | 05 §13.1对应suite/report.json→cases/<TC-ID>--<variant_id>.json→meta/context/manifest；同一批准baseline的固定run集合 |
| 通过条件 | 快照仅safe source/currentvisibility，独立freshness；closednode也被当前revokehide，清理失败不反转；所需TC参数全集/guard/负向均满足，证据scope不升级；实际正式SDK能力与TC-REAL-001/004对应参数另证 |
| 失败/缺证据 | cache延长授权、拼聚合truth、revoke失败仍展示；缺/failed/blocked/skipped/not_run/过期错版证据不得passed |
| 裁决影响 | P0不满足即不通过；送验baseline尚缺时保持blocked，不产生最终结论；若实际命中§11 VETO则总体强制不通过，不可waive |

#### GATE-CHAT-R-008 external ref数据

| 要素 | 裁决要求 |
|---|---|
| 父AC/优先级 | AC-DR-CHAT-003 / P0 |
| 设计契约 | 00 §10/11/14.3/14.4；01/02 owner/依赖；03 §5/6/10/12/14；05 §5.3/5.4/6 |
| TC（既有planned） | TC-PROTO-005, TC-PROTO-006, TC-PROTO-017, TC-PROTO-018, TC-SAFE-008, TC-REAL-001, TC-REAL-004 |
| EV（既有planned） | EV-UI-001, EV-SDK-001 |
| 固定report入口 | reports/runs/<run_id>/evidence-index.md；reports/runs/<run_id>/evidence/EV-UI-001.md；reports/runs/<run_id>/evidence/EV-SDK-001.md |
| machine回链 | 05 §13.1对应suite/report.json→cases/<TC-ID>--<variant_id>.json→meta/context/manifest；同一批准baseline的固定run集合 |
| 通过条件 | ref只安全回链，previewdescriptor须formal资格，openRef过期/撤销清；不拼URL/ref解正文；所需TC参数全集/guard/负向均满足，证据scope不升级；实际正式SDK能力与TC-REAL-001/004对应参数另证 |
| 失败/缺证据 | 引用被当capability、Artifactbody/版本血缘留Chat；缺/failed/blocked/skipped/not_run/过期错版证据不得passed |
| 裁决影响 | P0不满足即不通过；送验baseline尚缺时保持blocked，不产生最终结论；若实际命中§11 VETO则总体强制不通过，不可waive |

#### GATE-CHAT-R-009 forbiddenbody/secret红线

| 要素 | 裁决要求 |
|---|---|
| 父AC/优先级 | AC-DR-CHAT-004 / P0 |
| 设计契约 | 00 §10/11/14.3/14.4；01/02 owner/依赖；03 §5/6/10/12/14；05 §5.3/5.4/6 |
| TC（既有planned） | TC-SAFE-004, TC-REPORT-003, TC-REPORT-005, TC-PROTO-064, TC-PROTO-066, TC-PROTO-082 |
| EV（既有planned） | EV-UNIT-004, EV-UNIT-005, EV-REPORT-001 |
| 固定report入口 | reports/runs/<run_id>/evidence-index.md；reports/runs/<run_id>/evidence/EV-UNIT-004.md；reports/runs/<run_id>/evidence/EV-UNIT-005.md；reports/runs/<run_id>/evidence/EV-REPORT-001.md |
| machine回链 | 05 §13.1对应suite/report.json→cases/<TC-ID>--<variant_id>.json→meta/context/manifest；同一批准baseline的固定run集合 |
| 通过条件 | 不保留/输出credential/body/rawpayload/stack/隐藏敏感ref，错误与诊断只finite安全字段；candidate脱敏失败不归档；所需TC参数全集/guard/负向均满足，证据scope不升级；本地contract证据可验证，不替代必要real层 |
| 失败/缺证据 | 任何禁正文/secret进入client数据、内存repo、diskcache、log/export/handoff或rawSDK错误透传；缺/failed/blocked/skipped/not_run/过期错版证据不得passed |
| 裁决影响 | P0不满足即不通过；送验baseline尚缺时保持blocked，不产生最终结论；若实际命中§11 VETO则总体强制不通过，不可waive |

#### GATE-CHAT-R-010 无重复ownertruth

| 要素 | 裁决要求 |
|---|---|
| 父AC/优先级 | AC-DR-CHAT-005 / P0 |
| 设计契约 | 00 §10/11/14.3/14.4；01/02 owner/依赖；03 §5/6/10/12/14；05 §5.3/5.4/6 |
| TC（既有planned） | TC-SAFE-001, TC-SAFE-005, TC-PROTO-044, TC-PROTO-048, TC-REAL-001, TC-REAL-004 |
| EV（既有planned） | EV-UI-002, EV-UI-003, EV-UNIT-008, EV-SDK-001 |
| 固定report入口 | reports/runs/<run_id>/evidence-index.md；reports/runs/<run_id>/evidence/EV-UI-002.md；reports/runs/<run_id>/evidence/EV-UI-003.md；reports/runs/<run_id>/evidence/EV-UNIT-008.md；reports/runs/<run_id>/evidence/EV-SDK-001.md |
| machine回链 | 05 §13.1对应suite/report.json→cases/<TC-ID>--<variant_id>.json→meta/context/manifest；同一批准baseline的固定run集合 |
| 通过条件 | Conversation/Turn/Participant/Project/Member/Gate/Artifact/Workspace/Runtime/Process和binding/directory正式owner提供，client只展示或交互；所需TC参数全集/guard/负向均满足，证据scope不升级；实际正式SDK能力与TC-REAL-001/004对应参数另证 |
| 失败/缺证据 | 本地授权、绑定、流程汇聚、运行/工具/治理/观测backend被吸收；缺/failed/blocked/skipped/not_run/过期错版证据不得passed |
| 裁决影响 | P0不满足即不通过；送验baseline尚缺时保持blocked，不产生最终结论；若实际命中§11 VETO则总体强制不通过，不可waive |

### 6.2 配置12切口独立红线

14字段结构/单位/上限/三safe缺省/六profile/source来自04，不增加env/CLI/hot来源。配置格式合格不等SDK/native资格。绝对guard上限不是生产容量，通过示例不解除质量/版本阻塞。

#### GATE-CHAT-CFG-001 strict输入

| 要素 | 裁决要求 |
|---|---|
| 父AC/优先级 | AC-NFR-CHAT-003 / P0 |
| 设计契约 | 04 §5～11/§12.2 CUT-CFG-01；03 §5.9.1.1/§13；05 §6.4 |
| TC（既有planned） | TC-CFG-001, TC-CFG-002 |
| EV（既有planned） | EV-UNIT-006 |
| 固定report入口 | reports/runs/<run_id>/evidence-index.md；reports/runs/<run_id>/evidence/EV-UNIT-006.md |
| machine回链 | 05 §13.1对应suite/report.json→cases/<TC-ID>--<variant_id>.json→meta/context/manifest；同一批准baseline的固定run集合 |
| 通过条件 | 有效strict JSON与plain-data等价；parser一次返回14字段；分别nested重复键/comments/尾逗号/undefined/NaN/null/array/prototype/accessor/getter/unknown key；拒绝且getter执行计数0对应负向均正确拒绝，不secret/partialactivate；所需TC参数全集/guard/负向均满足，证据scope不升级；本地contract证据可验证，不替代必要real层 |
| 失败/缺证据 | 分别nested重复键/comments/尾逗号/undefined/NaN/null/array/prototype/accessor/getter/unknown key；拒绝且getter执行计数0被接受、silentfallback/halfroot、资格放宽或unknown重发；缺/failed/blocked/skipped/not_run/过期错版证据不得passed |
| 裁决影响 | P0不满足即不通过；送验baseline尚缺时保持blocked，不产生最终结论；若实际命中§11 VETO则总体强制不通过，不可waive |

#### GATE-CHAT-CFG-002 required/default

| 要素 | 裁决要求 |
|---|---|
| 父AC/优先级 | AC-NFR-CHAT-003 / P0 |
| 设计契约 | 04 §5～11/§12.2 CUT-CFG-02；03 §5.9.1.1/§13；05 §6.4 |
| TC（既有planned） | TC-CFG-003, TC-CFG-004 |
| EV（既有planned） | EV-UNIT-006 |
| 固定report入口 | reports/runs/<run_id>/evidence-index.md；reports/runs/<run_id>/evidence/EV-UNIT-006.md |
| machine回链 | 05 §13.1对应suite/report.json→cases/<TC-ID>--<variant_id>.json→meta/context/manifest；同一批准baseline的固定run集合 |
| 通过条件 | 8域全量；只app.schemaVersion/memoryOnly/diagnostic.mode缺叶子分别1/true/disabled；八域逐缺、另11叶子逐缺；显式false/坏enum/undefined不fallback对应负向均正确拒绝，不secret/partialactivate；所需TC参数全集/guard/负向均满足，证据scope不升级；本地contract证据可验证，不替代必要real层 |
| 失败/缺证据 | 八域逐缺、另11叶子逐缺；显式false/坏enum/undefined不fallback被接受、silentfallback/halfroot、资格放宽或unknown重发；缺/failed/blocked/skipped/not_run/过期错版证据不得passed |
| 裁决影响 | P0不满足即不通过；送验baseline尚缺时保持blocked，不产生最终结论；若实际命中§11 VETO则总体强制不通过，不可waive |

#### GATE-CHAT-CFG-003 八数字

| 要素 | 裁决要求 |
|---|---|
| 父AC/优先级 | AC-NFR-CHAT-003 / P0 |
| 设计契约 | 04 §5～11/§12.2 CUT-CFG-03；03 §5.9.1.1/§13；05 §6.4 |
| TC（既有planned） | TC-CFG-005, TC-CFG-006 |
| EV（既有planned） | EV-UNIT-006 |
| 固定report入口 | reports/runs/<run_id>/evidence-index.md；reports/runs/<run_id>/evidence/EV-UNIT-006.md |
| machine回链 | 05 §13.1对应suite/report.json→cases/<TC-ID>--<variant_id>.json→meta/context/manifest；同一批准baseline的固定run集合 |
| 通过条件 | 逐字段1/04max/例值，UTF16单位含emoji与组合字符；不夹边界；逐字段0/-1/max+1/1.5/unsafeint/字符串/null；文本超限保留稿零dispatch，图超限unsupported_material对应负向均正确拒绝，不secret/partialactivate；所需TC参数全集/guard/负向均满足，证据scope不升级；本地contract证据可验证，不替代必要real层 |
| 失败/缺证据 | 逐字段0/-1/max+1/1.5/unsafeint/字符串/null；文本超限保留稿零dispatch，图超限unsupported_material被接受、silentfallback/halfroot、资格放宽或unknown重发；缺/failed/blocked/skipped/not_run/过期错版证据不得passed |
| 裁决影响 | P0不满足即不通过；送验baseline尚缺时保持blocked，不产生最终结论；若实际命中§11 VETO则总体强制不通过，不可waive |

#### GATE-CHAT-CFG-004 profile交叉

| 要素 | 裁决要求 |
|---|---|
| 父AC/优先级 | AC-NFR-CHAT-003 / P0 |
| 设计契约 | 04 §5～11/§12.2 CUT-CFG-04；03 §5.9.1.1/§13；05 §6.4 |
| TC（既有planned） | TC-CFG-007, TC-CFG-008 |
| EV（既有planned） | EV-UNIT-006 |
| 固定report入口 | reports/runs/<run_id>/evidence-index.md；reports/runs/<run_id>/evidence/EV-UNIT-006.md |
| machine回链 | 05 §13.1对应suite/report.json→cases/<TC-ID>--<variant_id>.json→meta/context/manifest；同一批准baseline的固定run集合 |
| 通过条件 | 6profile逐有效组合；desktop非空hostalias，preview显式null；未知profile、外壳schema不1、desktopnull、preview非null、alias URI/path/secret/wildcard/大写/超128拒绝对应负向均正确拒绝，不secret/partialactivate；所需TC参数全集/guard/负向均满足，证据scope不升级；本地contract证据可验证，不替代必要real层 |
| 失败/缺证据 | 未知profile、外壳schema不1、desktopnull、preview非null、alias URI/path/secret/wildcard/大写/超128拒绝被接受、silentfallback/halfroot、资格放宽或unknown重发；缺/failed/blocked/skipped/not_run/过期错版证据不得passed |
| 裁决影响 | P0不满足即不通过；送验baseline尚缺时保持blocked，不产生最终结论；若实际命中§11 VETO则总体强制不通过，不可waive |

#### GATE-CHAT-CFG-005 SDK绑定

| 要素 | 裁决要求 |
|---|---|
| 父AC/优先级 | AC-NFR-CHAT-003 / P0 |
| 设计契约 | 04 §5～11/§12.2 CUT-CFG-05；03 §5.9.1.1/§13；05 §6.4 |
| TC（既有planned） | TC-CFG-009, TC-CFG-010 |
| EV（既有planned） | EV-UNIT-006 |
| 固定report入口 | reports/runs/<run_id>/evidence-index.md；reports/runs/<run_id>/evidence/EV-UNIT-006.md |
| machine回链 | 05 §13.1对应suite/report.json→cases/<TC-ID>--<variant_id>.json→meta/context/manifest；同一批准baseline的固定run集合 |
| 通过条件 | alias仅进入批准registry查找，存在且qualified才注入adapter；alias格式合格但registry空/版本错；dependency_unbound零private fallback/IO对应负向均正确拒绝，不secret/partialactivate；所需TC参数全集/guard/负向均满足，证据scope不升级；本地contract证据可验证，不替代必要real层 |
| 失败/缺证据 | alias格式合格但registry空/版本错；dependency_unbound零private fallback/IO被接受、silentfallback/halfroot、资格放宽或unknown重发；缺/failed/blocked/skipped/not_run/过期错版证据不得passed |
| 裁决影响 | P0不满足即不通过；送验baseline尚缺时保持blocked，不产生最终结论；若实际命中§11 VETO则总体强制不通过，不可waive |

#### GATE-CHAT-CFG-006 native资格

| 要素 | 裁决要求 |
|---|---|
| 父AC/优先级 | AC-NFR-CHAT-003 / P0 |
| 设计契约 | 04 §5～11/§12.2 CUT-CFG-06；03 §5.9.1.1/§13；05 §6.4 |
| TC（既有planned） | TC-CFG-011, TC-CFG-012, TC-REAL-002 |
| EV（既有planned） | EV-NATIVE-001, EV-HOST-001 |
| 固定report入口 | reports/runs/<run_id>/evidence-index.md；reports/runs/<run_id>/evidence/EV-NATIVE-001.md；reports/runs/<run_id>/evidence/EV-HOST-001.md |
| machine回链 | 05 §13.1对应suite/report.json→cases/<TC-ID>--<variant_id>.json→meta/context/manifest；同一批准baseline的固定run集合 |
| 通过条件 | 可信非空approved_windows/origins与kind匹配probe输出；ordinary JSON/假window/假origin/错kind/未知permission拒绝；host available不授intent对应负向均正确拒绝，不secret/partialactivate；所需TC参数全集/guard/负向均满足，证据scope不升级；真实Desktop批准矩阵与TC-REAL-002另证 |
| 失败/缺证据 | ordinary JSON/假window/假origin/错kind/未知permission拒绝；host available不授intent被接受、silentfallback/halfroot、资格放宽或unknown重发；缺/failed/blocked/skipped/not_run/过期错版证据不得passed |
| 裁决影响 | P0不满足即不通过；送验baseline尚缺时保持blocked，不产生最终结论；若实际命中§11 VETO则总体强制不通过，不可waive |

#### GATE-CHAT-CFG-007 composition

| 要素 | 裁决要求 |
|---|---|
| 父AC/优先级 | AC-NFR-CHAT-003 / P0 |
| 设计契约 | 04 §5～11/§12.2 CUT-CFG-07；03 §5.9.1.1/§13；05 §6.4 |
| TC（既有planned） | TC-CFG-013, TC-CFG-014 |
| EV（既有planned） | EV-UNIT-006 |
| 固定report入口 | reports/runs/<run_id>/evidence-index.md；reports/runs/<run_id>/evidence/EV-UNIT-006.md |
| machine回链 | 05 §13.1对应suite/report.json→cases/<TC-ID>--<variant_id>.json→meta/context/manifest；同一批准baseline的固定run集合 |
| 通过条件 | 一次完整validate/freeze/装配才root active；中间项失败无halfroot；StrictMode双mount/重复callbacks零重复订阅/dispatch对应负向均正确拒绝，不secret/partialactivate；所需TC参数全集/guard/负向均满足，证据scope不升级；本地contract证据可验证，不替代必要real层 |
| 失败/缺证据 | 中间项失败无halfroot；StrictMode双mount/重复callbacks零重复订阅/dispatch被接受、silentfallback/halfroot、资格放宽或unknown重发；缺/failed/blocked/skipped/not_run/过期错版证据不得passed |
| 裁决影响 | P0不满足即不通过；送验baseline尚缺时保持blocked，不产生最终结论；若实际命中§11 VETO则总体强制不通过，不可waive |

#### GATE-CHAT-CFG-008 切换迟到

| 要素 | 裁决要求 |
|---|---|
| 父AC/优先级 | AC-NFR-CHAT-003 / P0 |
| 设计契约 | 04 §5～11/§12.2 CUT-CFG-08；03 §5.9.1.1/§13；05 §6.4 |
| TC（既有planned） | TC-CFG-015, TC-CFG-016 |
| EV（既有planned） | EV-UNIT-006 |
| 固定report入口 | reports/runs/<run_id>/evidence-index.md；reports/runs/<run_id>/evidence/EV-UNIT-006.md |
| machine回链 | 05 §13.1对应suite/report.json→cases/<TC-ID>--<variant_id>.json→meta/context/manifest；同一批准baseline的固定run集合 |
| 通过条件 | 重建epoch后仅新source/slot可更新；profile切换/revoke后release旧load/result；hide先stop，旧confirmed不复活、unknown不resend对应负向均正确拒绝，不secret/partialactivate；所需TC参数全集/guard/负向均满足，证据scope不升级；本地contract证据可验证，不替代必要real层 |
| 失败/缺证据 | profile切换/revoke后release旧load/result；hide先stop，旧confirmed不复活、unknown不resend被接受、silentfallback/halfroot、资格放宽或unknown重发；缺/failed/blocked/skipped/not_run/过期错版证据不得passed |
| 裁决影响 | P0不满足即不通过；送验baseline尚缺时保持blocked，不产生最终结论；若实际命中§11 VETO则总体强制不通过，不可waive |

#### GATE-CHAT-CFG-009 容量/CAS

| 要素 | 裁决要求 |
|---|---|
| 父AC/优先级 | AC-NFR-CHAT-003 / P0 |
| 设计契约 | 04 §5～11/§12.2 CUT-CFG-09；03 §5.9.1.1/§13；05 §6.4 |
| TC（既有planned） | TC-CFG-017, TC-CFG-018 |
| EV（既有planned） | EV-UNIT-006 |
| 固定report入口 | reports/runs/<run_id>/evidence-index.md；reports/runs/<run_id>/evidence/EV-UNIT-006.md |
| machine回链 | 05 §13.1对应suite/report.json→cases/<TC-ID>--<variant_id>.json→meta/context/manifest；同一批准baseline的固定run集合 |
| 通过条件 | cache/context/consumed各上限内接受；save同turn版与fence匹配；capacity达到边界与+1：失效旧source/slot再重取；pending save-after-revoke无复活/无忘dedup仍fresh对应负向均正确拒绝，不secret/partialactivate；所需TC参数全集/guard/负向均满足，证据scope不升级；本地contract证据可验证，不替代必要real层 |
| 失败/缺证据 | capacity达到边界与+1：失效旧source/slot再重取；pending save-after-revoke无复活/无忘dedup仍fresh被接受、silentfallback/halfroot、资格放宽或unknown重发；缺/failed/blocked/skipped/not_run/过期错版证据不得passed |
| 裁决影响 | P0不满足即不通过；送验baseline尚缺时保持blocked，不产生最终结论；若实际命中§11 VETO则总体强制不通过，不可waive |

#### GATE-CHAT-CFG-010 拓扑预算

| 要素 | 裁决要求 |
|---|---|
| 父AC/优先级 | AC-NFR-CHAT-003 / P0 |
| 设计契约 | 04 §5～11/§12.2 CUT-CFG-10；03 §5.9.1.1/§13；05 §6.4 |
| TC（既有planned） | TC-CFG-019, TC-CFG-020 |
| EV（既有planned） | EV-UI-002 |
| 固定report入口 | reports/runs/<run_id>/evidence-index.md；reports/runs/<run_id>/evidence/EV-UI-002.md |
| machine回链 | 05 §13.1对应suite/report.json→cases/<TC-ID>--<variant_id>.json→meta/context/manifest；同一批准baseline的固定run集合 |
| 通过条件 | formal fork/branch/join/loop图与列表/ARIA安全集合一致；edges可大于nodes；nodes/edges超限不ready局部残图；hidden节点/关联边/label/count/ARIA均无泄露对应负向均正确拒绝，不secret/partialactivate；所需TC参数全集/guard/负向均满足，证据scope不升级；本地contract证据可验证，不替代必要real层 |
| 失败/缺证据 | nodes/edges超限不ready局部残图；hidden节点/关联边/label/count/ARIA均无泄露被接受、silentfallback/halfroot、资格放宽或unknown重发；缺/failed/blocked/skipped/not_run/过期错版证据不得passed |
| 裁决影响 | P0不满足即不通过；送验baseline尚缺时保持blocked，不产生最终结论；若实际命中§11 VETO则总体强制不通过，不可waive |

#### GATE-CHAT-CFG-011 诊断六字段

| 要素 | 裁决要求 |
|---|---|
| 父AC/优先级 | AC-NFR-CHAT-003 / P0 |
| 设计契约 | 04 §5～11/§12.2 CUT-CFG-11；03 §5.9.1.1/§13；05 §6.4 |
| TC（既有planned） | TC-CFG-021, TC-CFG-022 |
| EV（既有planned） | EV-UNIT-005 |
| 固定report入口 | reports/runs/<run_id>/evidence-index.md；reports/runs/<run_id>/evidence/EV-UNIT-005.md |
| machine回链 | 05 §13.1对应suite/report.json→cases/<TC-ID>--<variant_id>.json→meta/context/manifest；同一批准baseline的固定run集合 |
| 通过条件 | formal_low_sensitivity+显式user+current六字段+qualified sink一次send；disabled零IO、extra/secret/未请求拒绝、unknown无重送，sink失败不影响业务对应负向均正确拒绝，不secret/partialactivate；所需TC参数全集/guard/负向均满足，证据scope不升级；本地contract证据可验证，不替代必要real层 |
| 失败/缺证据 | disabled零IO、extra/secret/未请求拒绝、unknown无重送，sink失败不影响业务被接受、silentfallback/halfroot、资格放宽或unknown重发；缺/failed/blocked/skipped/not_run/过期错版证据不得passed |
| 裁决影响 | P0不满足即不通过；送验baseline尚缺时保持blocked，不产生最终结论；若实际命中§11 VETO则总体强制不通过，不可waive |

#### GATE-CHAT-CFG-012 rollback漂移

| 要素 | 裁决要求 |
|---|---|
| 父AC/优先级 | AC-NFR-CHAT-003 / P0 |
| 设计契约 | 04 §5～11/§12.2 CUT-CFG-12；03 §5.9.1.1/§13；05 §6.4 |
| TC（既有planned） | TC-CFG-023, TC-CFG-024 |
| EV（既有planned） | EV-UNIT-006 |
| 固定report入口 | reports/runs/<run_id>/evidence-index.md；reports/runs/<run_id>/evidence/EV-UNIT-006.md |
| machine回链 | 05 §13.1对应suite/report.json→cases/<TC-ID>--<variant_id>.json→meta/context/manifest；同一批准baseline的固定run集合 |
| 通过条件 | 旧批准配置重新全量validate，新composition/profile资格重验；alias/registry/native批准变更或旧版本失效blocked；无自动LKG/恢复旧资格对应负向均正确拒绝，不secret/partialactivate；所需TC参数全集/guard/负向均满足，证据scope不升级；本地contract证据可验证，不替代必要real层 |
| 失败/缺证据 | alias/registry/native批准变更或旧版本失效blocked；无自动LKG/恢复旧资格被接受、silentfallback/halfroot、资格放宽或unknown重发；缺/failed/blocked/skipped/not_run/过期错版证据不得passed |
| 裁决影响 | P0不满足即不通过；送验baseline尚缺时保持blocked，不产生最终结论；若实际命中§11 VETO则总体强制不通过，不可waive |

图/list/AT同safe nodes/edges与parent版；budget超限unsupported_material，不ready残图。LocalPageRequest.limit≤maxCachedEntries，本地接受不保证owner接受。cache/context/consumed上限触发先invalidate/source重取，不允许忘dedup仍fresh。

### 本Step逐项停审（设计过程记录）

每项独立完成来源→contract→TC→EV/report→pass/fail→裁决影响后才处理下一项。下表通过仅代表规则审查；实际TC/EV未生成、实际验收未开始。

| 验收项 | 审查项 | local gate | 外部缺口 |
|---|---|---|---|
| GATE-CHAT-R-001 | AC-BR-CHAT-001；00 §10/11/14.3/14.4；01/02 owner/依赖；03 §5/6/10/12/14；05 §5.3/5.4/6；TC/EV存在且scope/路径明确；pass/fail可判定，P0无waiver | pass_with_upstream_blockers | build/run/实际证据仍waiting，real能力sdk仍blocked |
| GATE-CHAT-R-002 | AC-BR-CHAT-002；00 §10/11/14.3/14.4；01/02 owner/依赖；03 §5/6/10/12/14；05 §5.3/5.4/6；TC/EV存在且scope/路径明确；pass/fail可判定，P0无waiver | pass_with_upstream_blockers | build/run/实际证据仍waiting，real能力sdk仍blocked |
| GATE-CHAT-R-003 | AC-BR-CHAT-003；00 §10/11/14.3/14.4；01/02 owner/依赖；03 §5/6/10/12/14；05 §5.3/5.4/6；TC/EV存在且scope/路径明确；pass/fail可判定，P0无waiver | pass_with_upstream_blockers | build/run/实际证据仍waiting，real能力sdk仍blocked |
| GATE-CHAT-R-004 | AC-BR-CHAT-004；00 §10/11/14.3/14.4；01/02 owner/依赖；03 §5/6/10/12/14；05 §5.3/5.4/6；TC/EV存在且scope/路径明确；pass/fail可判定，P0无waiver | pass_with_upstream_blockers | build/run/实际证据仍waiting，real能力sdk仍blocked |
| GATE-CHAT-R-005 | AC-BR-CHAT-005；00 §10/11/14.3/14.4；01/02 owner/依赖；03 §5/6/10/12/14；05 §5.3/5.4/6；TC/EV存在且scope/路径明确；pass/fail可判定，P0无waiver | pass_with_upstream_blockers | build/run/实际证据仍waiting，real能力host仍blocked |
| GATE-CHAT-R-006 | AC-DR-CHAT-001；00 §10/11/14.3/14.4；01/02 owner/依赖；03 §5/6/10/12/14；05 §5.3/5.4/6；TC/EV存在且scope/路径明确；pass/fail可判定，P0无waiver | pass_with_upstream_blockers | build/run/实际证据仍waiting，real能力不借fixture推断 |
| GATE-CHAT-R-007 | AC-DR-CHAT-002；00 §10/11/14.3/14.4；01/02 owner/依赖；03 §5/6/10/12/14；05 §5.3/5.4/6；TC/EV存在且scope/路径明确；pass/fail可判定，P0无waiver | pass_with_upstream_blockers | build/run/实际证据仍waiting，real能力sdk仍blocked |
| GATE-CHAT-R-008 | AC-DR-CHAT-003；00 §10/11/14.3/14.4；01/02 owner/依赖；03 §5/6/10/12/14；05 §5.3/5.4/6；TC/EV存在且scope/路径明确；pass/fail可判定，P0无waiver | pass_with_upstream_blockers | build/run/实际证据仍waiting，real能力sdk仍blocked |
| GATE-CHAT-R-009 | AC-DR-CHAT-004；00 §10/11/14.3/14.4；01/02 owner/依赖；03 §5/6/10/12/14；05 §5.3/5.4/6；TC/EV存在且scope/路径明确；pass/fail可判定，P0无waiver | pass_with_upstream_blockers | build/run/实际证据仍waiting，real能力不借fixture推断 |
| GATE-CHAT-R-010 | AC-DR-CHAT-005；00 §10/11/14.3/14.4；01/02 owner/依赖；03 §5/6/10/12/14；05 §5.3/5.4/6；TC/EV存在且scope/路径明确；pass/fail可判定，P0无waiver | pass_with_upstream_blockers | build/run/实际证据仍waiting，real能力sdk仍blocked |
| GATE-CHAT-CFG-001 | AC-NFR-CHAT-003；04 §5～11/§12.2 CUT-CFG-01；03 §5.9.1.1/§13；05 §6.4；TC/EV存在且scope/路径明确；pass/fail可判定，P0无waiver | pass_with_upstream_blockers | build/run/实际证据仍waiting，real能力不借fixture推断 |
| GATE-CHAT-CFG-002 | AC-NFR-CHAT-003；04 §5～11/§12.2 CUT-CFG-02；03 §5.9.1.1/§13；05 §6.4；TC/EV存在且scope/路径明确；pass/fail可判定，P0无waiver | pass_with_upstream_blockers | build/run/实际证据仍waiting，real能力不借fixture推断 |
| GATE-CHAT-CFG-003 | AC-NFR-CHAT-003；04 §5～11/§12.2 CUT-CFG-03；03 §5.9.1.1/§13；05 §6.4；TC/EV存在且scope/路径明确；pass/fail可判定，P0无waiver | pass_with_upstream_blockers | build/run/实际证据仍waiting，real能力不借fixture推断 |
| GATE-CHAT-CFG-004 | AC-NFR-CHAT-003；04 §5～11/§12.2 CUT-CFG-04；03 §5.9.1.1/§13；05 §6.4；TC/EV存在且scope/路径明确；pass/fail可判定，P0无waiver | pass_with_upstream_blockers | build/run/实际证据仍waiting，real能力不借fixture推断 |
| GATE-CHAT-CFG-005 | AC-NFR-CHAT-003；04 §5～11/§12.2 CUT-CFG-05；03 §5.9.1.1/§13；05 §6.4；TC/EV存在且scope/路径明确；pass/fail可判定，P0无waiver | pass_with_upstream_blockers | build/run/实际证据仍waiting，real能力不借fixture推断 |
| GATE-CHAT-CFG-006 | AC-NFR-CHAT-003；04 §5～11/§12.2 CUT-CFG-06；03 §5.9.1.1/§13；05 §6.4；TC/EV存在且scope/路径明确；pass/fail可判定，P0无waiver | pass_with_upstream_blockers | build/run/实际证据仍waiting，real能力host仍blocked |
| GATE-CHAT-CFG-007 | AC-NFR-CHAT-003；04 §5～11/§12.2 CUT-CFG-07；03 §5.9.1.1/§13；05 §6.4；TC/EV存在且scope/路径明确；pass/fail可判定，P0无waiver | pass_with_upstream_blockers | build/run/实际证据仍waiting，real能力不借fixture推断 |
| GATE-CHAT-CFG-008 | AC-NFR-CHAT-003；04 §5～11/§12.2 CUT-CFG-08；03 §5.9.1.1/§13；05 §6.4；TC/EV存在且scope/路径明确；pass/fail可判定，P0无waiver | pass_with_upstream_blockers | build/run/实际证据仍waiting，real能力不借fixture推断 |
| GATE-CHAT-CFG-009 | AC-NFR-CHAT-003；04 §5～11/§12.2 CUT-CFG-09；03 §5.9.1.1/§13；05 §6.4；TC/EV存在且scope/路径明确；pass/fail可判定，P0无waiver | pass_with_upstream_blockers | build/run/实际证据仍waiting，real能力不借fixture推断 |
| GATE-CHAT-CFG-010 | AC-NFR-CHAT-003；04 §5～11/§12.2 CUT-CFG-10；03 §5.9.1.1/§13；05 §6.4；TC/EV存在且scope/路径明确；pass/fail可判定，P0无waiver | pass_with_upstream_blockers | build/run/实际证据仍waiting，real能力不借fixture推断 |
| GATE-CHAT-CFG-011 | AC-NFR-CHAT-003；04 §5～11/§12.2 CUT-CFG-11；03 §5.9.1.1/§13；05 §6.4；TC/EV存在且scope/路径明确；pass/fail可判定，P0无waiver | pass_with_upstream_blockers | build/run/实际证据仍waiting，real能力不借fixture推断 |
| GATE-CHAT-CFG-012 | AC-NFR-CHAT-003；04 §5～11/§12.2 CUT-CFG-12；03 §5.9.1.1/§13；05 §6.4；TC/EV存在且scope/路径明确；pass/fail可判定，P0无waiver | pass_with_upstream_blockers | build/run/实际证据仍waiting，real能力不借fixture推断 |

### 跨数据/配置红线门禁审计（设计过程记录）

| 审计项 | 结论/处理 |
|---|---|
| 缺contract/TC/EV/report | 本Step各项均回指既有03/04/05；无新TC/EV |
| 重复/冲突裁决 | 共用EV按TC/variant取子集；P0/VETO优先，parentAC仅聚合，不重复计通过 |
| source/状态/phase漂移 | 只当前正式值；planned/schema不是实测/结果，07boundary waiting |
| 范围越界 | 不验owner内部实现，不private API/bus；scope不足blocked，不伪real |


## 8. 回填草稿

正式06 §6回填本步§7裁决结论/表/schema；过程停审、差异和自检留本文件，不冒充实际结果。

## 9. 待确认事项

CHAT-UP001～009/WS-UP001～008/BASE001/native/OS/AT/生产预算/精确版本/来源/发布/归档继续open/blocked。角色、build、run_id、报告、actualEV、风险接受与签署均waiting；没有当前放行或readiness。

## 10. 自检及下一Step门禁

22红线local停审，十BR/DR及12CFG覆盖，unsafe/partial/默认/资格与VETO一致。 本地规则设计gate pass_with_upstream_blockers；允许Step7先读取台账/flow/当前产物与对应SOP，不创建其它未来Step。
