# L5-chat 06 · Step 5 功能验收门禁

## 1. Step状态

> done / pass_with_upstream_blockers；2026-10-01。这里只定义验收规则，所有TC/EV为planned预约，无实际验收结果或签署。

## 2. 本步输入

前序Step4 local gate已通过；06 SOP Step5、书写规范5.5；00实际36AC、03契约、04配置、05TC/EV和证据schema；中间产物§5.10与真相源§7。

## 3. SOP问题回答

每P0的设计/TC/EV/path/pass/fail/裁决、逐项停审及跨功能冲突怎么闭口？§5卡逐项且停审表覆盖19项；复用既有case不新增。

## 4. 当前文档问题诊断

旧功能门禁只有可用描述或旧体验对象，无formalSDK与BPMN/目录粒度；05EV ac_refs是已有主标签，不能改写成36AC实测覆盖。

## 5. 改动前后对比

| 改前 | 改后 | 原因 |
|---|---|---|
| 旧功能门禁只有可用描述或旧体验对象，无formalSDK与BPMN/目录粒度；05EV ac_refs是已有主标签，不能改写成36AC实测覆盖。 | §7结构化裁决 | 保持正式contract/TC/EV与证据能力一致 |

## 6. 验收裁决取舍与复杂度

14功能+5核心逐项小循环，existing父AC/private子gate独立绑定。增强诊断默认disabled与核心real层各自处理，不复制backend。

## 7. 结构化中间产物

### 5.1 P0通用裁决

每项继承00对应AC/F与03同名contract。通过要求实际所需TC/variants与safe UI/assertions成立；正向业务能力还需正式SDKlayer，fixture只能证本地逻辑。具体TC/EV/report固定如下；所有标识是planned，当前无证据或实际结论。
AC-FR-CHAT-010只裁决未激活增强边界，mobile不是V1送验能力；不能把它用于豁免其它P0。Diagnostic defaultdisabled符合当前合同，启用sink须另有正式能力资格。

#### GATE-CHAT-F-001 入口/语境

| 要素 | 裁决要求 |
|---|---|
| 父AC/优先级 | AC-FR-CHAT-001 / P0 |
| 设计契约 | 00 §9/§14.2；03 §7/8同名protocol、§9/§10/§12；04 §7～11；05 §5.2/§6 |
| TC（既有planned） | TC-PROTO-009, TC-PROTO-010, TC-PROTO-011, TC-PROTO-012, TC-PROTO-019, TC-PROTO-020, TC-PROTO-055, TC-PROTO-056, TC-PROTO-075, TC-PROTO-076, TC-REAL-001, TC-REAL-004 |
| EV（既有planned） | EV-UNIT-001, EV-UI-001, EV-UNIT-002, EV-UNIT-003, EV-SDK-001 |
| 固定report入口 | reports/runs/<run_id>/evidence-index.md；reports/runs/<run_id>/evidence/EV-UNIT-001.md；reports/runs/<run_id>/evidence/EV-UI-001.md；reports/runs/<run_id>/evidence/EV-UNIT-002.md；reports/runs/<run_id>/evidence/EV-UNIT-003.md；reports/runs/<run_id>/evidence/EV-SDK-001.md |
| machine回链 | 05 §13.1对应suite/report.json→cases/<TC-ID>--<variant_id>.json→meta/context/manifest；同一批准baseline的固定run集合 |
| 通过条件 | 正式入口group/channel/dm/thread及project/directory候选当前actor/session/scope/visibility可验；thread-parent正确；新epoch重验，hidden refs清空；所需TC参数全集/guard/负向均满足，证据scope不升级；实际正式SDK能力与TC-REAL-001/004对应参数另证 |
| 失败/缺证据 | deep-link/缓存授权限、旧epoch返回覆盖、撤销后披露；缺/failed/blocked/skipped/not_run/过期错版证据不得passed |
| 裁决影响 | P0不满足即不通过；送验baseline尚缺时保持blocked，不产生最终结论；若实际命中§11 VETO则总体强制不通过，不可waive |

#### GATE-CHAT-F-002 Turn/跨owner展示

| 要素 | 裁决要求 |
|---|---|
| 父AC/优先级 | AC-FR-CHAT-002 / P0 |
| 设计契约 | 00 §9/§14.2；03 §7/8同名protocol、§9/§10/§12；04 §7～11；05 §5.2/§6 |
| TC（既有planned） | TC-PROTO-013, TC-PROTO-014, TC-PROTO-015, TC-PROTO-016, TC-PROTO-031, TC-PROTO-032, TC-PROTO-047, TC-PROTO-048, TC-REAL-001, TC-REAL-004 |
| EV（既有planned） | EV-UI-001, EV-UI-003, EV-SDK-001 |
| 固定report入口 | reports/runs/<run_id>/evidence-index.md；reports/runs/<run_id>/evidence/EV-UI-001.md；reports/runs/<run_id>/evidence/EV-UI-003.md；reports/runs/<run_id>/evidence/EV-SDK-001.md |
| machine回链 | 05 §13.1对应suite/report.json→cases/<TC-ID>--<variant_id>.json→meta/context/manifest；同一批准baseline的固定run集合 |
| 通过条件 | Turn正式category安全分派，未知unsupported；每owner来源/version/freshness独立，成员/项目/运行摘要有降级；所需TC参数全集/guard/负向均满足，证据scope不升级；实际正式SDK能力与TC-REAL-001/004对应参数另证 |
| 失败/缺证据 | rawtruth复制、未知type解析、empty/partial当完整，其他owner成功覆盖失效源；缺/failed/blocked/skipped/not_run/过期错版证据不得passed |
| 裁决影响 | P0不满足即不通过；送验baseline尚缺时保持blocked，不产生最终结论；若实际命中§11 VETO则总体强制不通过，不可waive |

#### GATE-CHAT-F-003 Gate/Artifact卡片

| 要素 | 裁决要求 |
|---|---|
| 父AC/优先级 | AC-FR-CHAT-003 / P0 |
| 设计契约 | 00 §9/§14.2；03 §7/8同名protocol、§9/§10/§12；04 §7～11；05 §5.2/§6 |
| TC（既有planned） | TC-PROTO-003, TC-PROTO-004, TC-PROTO-005, TC-PROTO-006, TC-PROTO-017, TC-PROTO-018, TC-PROTO-019, TC-PROTO-020, TC-REAL-001, TC-REAL-004 |
| EV（既有planned） | EV-UNIT-001, EV-UI-001, EV-SDK-001 |
| 固定report入口 | reports/runs/<run_id>/evidence-index.md；reports/runs/<run_id>/evidence/EV-UNIT-001.md；reports/runs/<run_id>/evidence/EV-UI-001.md；reports/runs/<run_id>/evidence/EV-SDK-001.md |
| machine回链 | 05 §13.1对应suite/report.json→cases/<TC-ID>--<variant_id>.json→meta/context/manifest；同一批准baseline的固定run集合 |
| 通过条件 | GateCard只显化正式Gate/action/可操作语境，Artifact只有qualifiedsafe descriptor/ref；失效openRef清理，不拼URL；所需TC参数全集/guard/负向均满足，证据scope不升级；实际正式SDK能力与TC-REAL-001/004对应参数另证 |
| 失败/缺证据 | 点击即approved、capability错配、ref猜正文/权限或effectpreview绕当前只读边界；缺/failed/blocked/skipped/not_run/过期错版证据不得passed |
| 裁决影响 | P0不满足即不通过；送验baseline尚缺时保持blocked，不产生最终结论；若实际命中§11 VETO则总体强制不通过，不可waive |

#### GATE-CHAT-F-004 来源/降级

| 要素 | 裁决要求 |
|---|---|
| 父AC/优先级 | AC-FR-CHAT-004 / P0 |
| 设计契约 | 00 §9/§14.2；03 §7/8同名protocol、§9/§10/§12；04 §7～11；05 §5.2/§6 |
| TC（既有planned） | TC-PROTO-015, TC-PROTO-016, TC-PROTO-049, TC-PROTO-050, TC-PROTO-055, TC-PROTO-056, TC-PROTO-057, TC-PROTO-058, TC-REAL-001, TC-REAL-004 |
| EV（既有planned） | EV-UI-001, EV-UNIT-002, EV-SDK-001 |
| 固定report入口 | reports/runs/<run_id>/evidence-index.md；reports/runs/<run_id>/evidence/EV-UI-001.md；reports/runs/<run_id>/evidence/EV-UNIT-002.md；reports/runs/<run_id>/evidence/EV-SDK-001.md |
| machine回链 | 05 §13.1对应suite/report.json→cases/<TC-ID>--<variant_id>.json→meta/context/manifest；同一批准baseline的固定run集合 |
| 通过条件 | FreshnessMarker/DisclosurePosture依每正式source资格更新，partial/stale/unavailable/blocked等姿态可理解，隐藏关系不漏label/count；所需TC参数全集/guard/负向均满足，证据scope不升级；实际正式SDK能力与TC-REAL-001/004对应参数另证 |
| 失败/缺证据 | arrival/wallclock/crossowner统一fresh、旧版本复活或隐藏label/count仍在DOM/ARIA；缺/failed/blocked/skipped/not_run/过期错版证据不得passed |
| 裁决影响 | P0不满足即不通过；送验baseline尚缺时保持blocked，不产生最终结论；若实际命中§11 VETO则总体强制不通过，不可waive |

#### GATE-CHAT-F-005 草稿/发送/治理意图

| 要素 | 裁决要求 |
|---|---|
| 父AC/优先级 | AC-FR-CHAT-005 / P0 |
| 设计契约 | 00 §9/§14.2；03 §7/8同名protocol、§9/§10/§12；04 §7～11；05 §5.2/§6 |
| TC（既有planned） | TC-PROTO-001, TC-PROTO-002, TC-PROTO-003, TC-PROTO-004, TC-PROTO-027, TC-PROTO-028, TC-PROTO-051, TC-PROTO-052, TC-REAL-001, TC-REAL-004 |
| EV（既有planned） | EV-UNIT-001, EV-UNIT-004, EV-SDK-001 |
| 固定report入口 | reports/runs/<run_id>/evidence-index.md；reports/runs/<run_id>/evidence/EV-UNIT-001.md；reports/runs/<run_id>/evidence/EV-UNIT-004.md；reports/runs/<run_id>/evidence/EV-SDK-001.md |
| machine回链 | 05 §13.1对应suite/report.json→cases/<TC-ID>--<variant_id>.json→meta/context/manifest；同一批准baseline的固定run集合 |
| 通过条件 | 内存稿/冻结payload/revision分离；firstreserve、SDKnoeffectprepare、secondreserveDispatch原子winner先dispatched/submitted再一次调用；formalGate capability当前；所需TC参数全集/guard/负向均满足，证据scope不升级；实际正式SDK能力与TC-REAL-001/004对应参数另证 |
| 失败/缺证据 | 双dispatch/错association、旧confirm清新稿、unknown释放旧稿重发、宿主可用补业务资格；缺/failed/blocked/skipped/not_run/过期错版证据不得passed |
| 裁决影响 | P0不满足即不通过；送验baseline尚缺时保持blocked，不产生最终结论；若实际命中§11 VETO则总体强制不通过，不可waive |

#### GATE-CHAT-F-006 formal结果/unknown

| 要素 | 裁决要求 |
|---|---|
| 父AC/优先级 | AC-FR-CHAT-006 / P0 |
| 设计契约 | 00 §9/§14.2；03 §7/8同名protocol、§9/§10/§12；04 §7～11；05 §5.2/§6 |
| TC（既有planned） | TC-PROTO-021, TC-PROTO-022, TC-PROTO-051, TC-PROTO-052, TC-PROTO-071, TC-PROTO-072, TC-REAL-001, TC-REAL-004 |
| EV（既有planned） | EV-UNIT-001, EV-SDK-001 |
| 固定report入口 | reports/runs/<run_id>/evidence-index.md；reports/runs/<run_id>/evidence/EV-UNIT-001.md；reports/runs/<run_id>/evidence/EV-SDK-001.md |
| machine回链 | 05 §13.1对应suite/report.json→cases/<TC-ID>--<variant_id>.json→meta/context/manifest；同一批准baseline的固定run集合 |
| 通过条件 | CommandResultPosture七态与ACK分开；formal authority+关联满足才confirmed/rejected/failed；unknown只probe/query/wait，not_found不等noeffect；所需TC参数全集/guard/负向均满足，证据scope不升级；实际正式SDK能力与TC-REAL-001/004对应参数另证 |
| 失败/缺证据 | 任意transport/toast/缓存/optimistic确认，potentialeffect异常自动retry，terminal反转；缺/failed/blocked/skipped/not_run/过期错版证据不得passed |
| 裁决影响 | P0不满足即不通过；送验baseline尚缺时保持blocked，不产生最终结论；若实际命中§11 VETO则总体强制不通过，不可waive |

#### GATE-CHAT-F-007 正式变化/缺口

| 要素 | 裁决要求 |
|---|---|
| 父AC/优先级 | AC-FR-CHAT-007 / P0 |
| 设计契约 | 00 §9/§14.2；03 §7/8同名protocol、§9/§10/§12；04 §7～11；05 §5.2/§6 |
| TC（既有planned） | TC-PROTO-023, TC-PROTO-024, TC-PROTO-049, TC-PROTO-050, TC-PROTO-053, TC-PROTO-054, TC-PROTO-067, TC-PROTO-068, TC-PROTO-069, TC-PROTO-070, TC-REAL-001, TC-REAL-004 |
| EV（既有planned） | EV-UNIT-002, EV-SDK-001 |
| 固定report入口 | reports/runs/<run_id>/evidence-index.md；reports/runs/<run_id>/evidence/EV-UNIT-002.md；reports/runs/<run_id>/evidence/EV-SDK-001.md |
| machine回链 | 05 §13.1对应suite/report.json→cases/<TC-ID>--<variant_id>.json→meta/context/manifest；同一批准baseline的固定run集合 |
| 通过条件 | SDKformal qualifiedchange/resume同source、acceptedid/watermark/slice同CAS；duplicate无二apply，coverage完整才fresh，opaque cursor不排序；所需TC参数全集/guard/负向均满足，证据scope不升级；实际正式SDK能力与TC-REAL-001/004对应参数另证 |
| 失败/缺证据 | 内部bus订阅、gap不显化、局部resume当全部sourcefresh、旧recovery覆写；缺/failed/blocked/skipped/not_run/过期错版证据不得passed |
| 裁决影响 | P0不满足即不通过；送验baseline尚缺时保持blocked，不产生最终结论；若实际命中§11 VETO则总体强制不通过，不可waive |

#### GATE-CHAT-F-008 断线/重启/内存缓存

| 要素 | 裁决要求 |
|---|---|
| 父AC/优先级 | AC-FR-CHAT-008 / P0 |
| 设计契约 | 00 §9/§14.2；03 §7/8同名protocol、§9/§10/§12；04 §7～11；05 §5.2/§6 |
| TC（既有planned） | TC-PROTO-025, TC-PROTO-026, TC-PROTO-059, TC-PROTO-060, TC-PROTO-067, TC-PROTO-068, TC-PROTO-075, TC-PROTO-076, TC-PROTO-077, TC-PROTO-078, TC-PROTO-079, TC-PROTO-080, TC-REAL-001, TC-REAL-004 |
| EV（既有planned） | EV-UNIT-002, EV-UNIT-004, EV-SDK-001 |
| 固定report入口 | reports/runs/<run_id>/evidence-index.md；reports/runs/<run_id>/evidence/EV-UNIT-002.md；reports/runs/<run_id>/evidence/EV-UNIT-004.md；reports/runs/<run_id>/evidence/EV-SDK-001.md |
| machine回链 | 05 §13.1对应suite/report.json→cases/<TC-ID>--<variant_id>.json→meta/context/manifest；同一批准baseline的固定run集合 |
| 通过条件 | 同composition离线内存稿/安全快照受当前visibility约束；重启仅safe locator→新epoch正式读取，无durable稿/access/confirmed恢复；hide先cleanup；所需TC参数全集/guard/负向均满足，证据scope不升级；实际正式SDK能力与TC-REAL-001/004对应参数另证 |
| 失败/缺证据 | 缓存延授权、序列化正文/稿/credential、faileddelete当cleared、重启恢复旧资格或盲重发；缺/failed/blocked/skipped/not_run/过期错版证据不得passed |
| 裁决影响 | P0不满足即不通过；送验baseline尚缺时保持blocked，不产生最终结论；若实际命中§11 VETO则总体强制不通过，不可waive |

#### GATE-CHAT-F-009 低敏支持

| 要素 | 裁决要求 |
|---|---|
| 父AC/优先级 | AC-FR-CHAT-009 / P0 |
| 设计契约 | 00 §9/§14.2；03 §7/8同名protocol、§9/§10/§12；04 §7～11；05 §5.2/§6 |
| TC（既有planned） | TC-PROTO-063, TC-PROTO-064, TC-PROTO-065, TC-PROTO-066, TC-PROTO-081, TC-PROTO-082 |
| EV（既有planned） | EV-UNIT-005 |
| 固定report入口 | reports/runs/<run_id>/evidence-index.md；reports/runs/<run_id>/evidence/EV-UNIT-005.md |
| machine回链 | 05 §13.1对应suite/report.json→cases/<TC-ID>--<variant_id>.json→meta/context/manifest；同一批准baseline的固定run集合 |
| 通过条件 | 默认disabled零IO；显式currentuser的六字段仅qualifiedsink，unknown不自动重送；连接/cache/恢复/错误分类安全展示；所需TC参数全集/guard/负向均满足，证据scope不升级；本地contract证据可验证，不替代必要real层 |
| 失败/缺证据 | 自动日志/metrics、extra字段/rawquery/actorref/body/截图、sinkfailure改业务结果；缺/failed/blocked/skipped/not_run/过期错版证据不得passed |
| 裁决影响 | P0不满足即不通过；送验baseline尚缺时保持blocked，不产生最终结论；若实际命中§11 VETO则总体强制不通过，不可waive |

#### GATE-CHAT-F-010 外围activation

| 要素 | 裁决要求 |
|---|---|
| 父AC/优先级 | AC-FR-CHAT-010 / P0 |
| 设计契约 | 00 §9/§14.2；03 §7/8同名protocol、§9/§10/§12；04 §7～11；05 §5.2/§6 |
| TC（既有planned） | TC-SAFE-006, TC-SAFE-007, TC-SAFE-008 |
| EV（既有planned） | EV-UI-001, EV-NATIVE-001, EV-UI-003 |
| 固定report入口 | reports/runs/<run_id>/evidence-index.md；reports/runs/<run_id>/evidence/EV-UI-001.md；reports/runs/<run_id>/evidence/EV-NATIVE-001.md；reports/runs/<run_id>/evidence/EV-UI-003.md |
| machine回链 | 05 §13.1对应suite/report.json→cases/<TC-ID>--<variant_id>.json→meta/context/manifest；同一批准baseline的固定run集合 |
| 通过条件 | 搜索/通知/富文本/附件正式capability未激活保持禁用或安全边界；mobile不算V1交付，增强不绕SDK；所需TC参数全集/guard/负向均满足，证据scope不升级；本地contract证据可验证，不替代必要real层 |
| 失败/缺证据 | 未激活假ready、搜索泄露隐藏对象、通知即提交、本地file成Artifacttruth或mobile作为Desktop前置；缺/failed/blocked/skipped/not_run/过期错版证据不得passed |
| 裁决影响 | P0不满足即不通过；送验baseline尚缺时保持blocked，不产生最终结论；若实际命中§11 VETO则总体强制不通过，不可waive |

#### GATE-CHAT-F-011 项目五tab/流程下钻

| 要素 | 裁决要求 |
|---|---|
| 父AC/优先级 | AC-FR-CHAT-011 / P0 |
| 设计契约 | 00 §9/§14.2；03 §7/8同名protocol、§9/§10/§12；04 §7～11；05 §5.2/§6 |
| TC（既有planned） | TC-PROTO-033, TC-PROTO-034, TC-PROTO-035, TC-PROTO-036, TC-PROTO-037, TC-PROTO-038, TC-PROTO-039, TC-PROTO-040, TC-PROTO-041, TC-PROTO-042, TC-PROTO-083, TC-PROTO-084, TC-CONC-007, TC-CONC-008, TC-REAL-001, TC-REAL-004 |
| EV（既有planned） | EV-UI-002, EV-SDK-001 |
| 固定report入口 | reports/runs/<run_id>/evidence-index.md；reports/runs/<run_id>/evidence/EV-UI-002.md；reports/runs/<run_id>/evidence/EV-SDK-001.md |
| machine回链 | 05 §13.1对应suite/report.json→cases/<TC-ID>--<variant_id>.json→meta/context/manifest；同一批准baseline的固定run集合 |
| 通过条件 | 仅项目详情五tab；whole→stage→node各正式Process parent/version/source；返回有位置感；节点工作/运行/工具/提交/测试/证据独立safe section；所需TC参数全集/guard/负向均满足，证据scope不升级；实际正式SDK能力与TC-REAL-001/004对应参数另证 |
| 失败/缺证据 | 另建顶层progress、用Work/log/原型补拓扑、旧父图下child复活、safe测试摘要作为正式验收EV；缺/failed/blocked/skipped/not_run/过期错版证据不得passed |
| 裁决影响 | P0不满足即不通过；送验baseline尚缺时保持blocked，不产生最终结论；若实际命中§11 VETO则总体强制不通过，不可waive |

#### GATE-CHAT-F-012 群聊↔项目

| 要素 | 裁决要求 |
|---|---|
| 父AC/优先级 | AC-FR-CHAT-012 / P0 |
| 设计契约 | 00 §9/§14.2；03 §7/8同名protocol、§9/§10/§12；04 §7～11；05 §5.2/§6 |
| TC（既有planned） | TC-PROTO-043, TC-PROTO-044, TC-REAL-001, TC-REAL-004 |
| EV（既有planned） | EV-UI-003, EV-SDK-001 |
| 固定report入口 | reports/runs/<run_id>/evidence-index.md；reports/runs/<run_id>/evidence/EV-UI-003.md；reports/runs/<run_id>/evidence/EV-SDK-001.md |
| machine回链 | 05 §13.1对应suite/report.json→cases/<TC-ID>--<variant_id>.json→meta/context/manifest；同一批准baseline的固定run集合 |
| 通过条件 | 正式关系一群最多一Project、多群各Participant不同；每target独立access；解除/撤销双向入口失效，不能从ProjectMember授群权限；所需TC参数全集/guard/负向均满足，证据scope不升级；实际正式SDK能力与TC-REAL-001/004对应参数另证 |
| 失败/缺证据 | 本地建立bindingtruth、一个群多项目未拒绝、群/项目成员串权、解除后旧入口仍授权；缺/failed/blocked/skipped/not_run/过期错版证据不得passed |
| 裁决影响 | P0不满足即不通过；送验baseline尚缺时保持blocked，不产生最终结论；若实际命中§11 VETO则总体强制不通过，不可waive |

#### GATE-CHAT-F-013 BPMN并行与Gate分离

| 要素 | 裁决要求 |
|---|---|
| 父AC/优先级 | AC-FR-CHAT-013 / P0 |
| 设计契约 | 00 §9/§14.2；03 §7/8同名protocol、§9/§10/§12；04 §7～11；05 §5.2/§6 |
| TC（既有planned） | TC-PROTO-037, TC-PROTO-038, TC-PROTO-039, TC-PROTO-040, TC-PROTO-041, TC-PROTO-042, TC-AT-002, TC-SAFE-005, TC-CFG-019, TC-CFG-020, TC-REAL-001, TC-REAL-004 |
| EV（既有planned） | EV-UI-001, EV-UI-002, EV-SDK-001 |
| 固定report入口 | reports/runs/<run_id>/evidence-index.md；reports/runs/<run_id>/evidence/EV-UI-001.md；reports/runs/<run_id>/evidence/EV-UI-002.md；reports/runs/<run_id>/evidence/EV-SDK-001.md |
| machine回链 | 05 §13.1对应suite/report.json→cases/<TC-ID>--<variant_id>.json→meta/context/manifest；同一批准baseline的固定run集合 |
| 通过条件 | fork/branch/join/loop由Processsafe topology/state提供；图/list/AT同可披露集合，分支与汇聚不靠颜色；GovernanceGate独立formal姿态；所需TC参数全集/guard/负向均满足，证据scope不升级；实际正式SDK能力与TC-REAL-001/004对应参数另证 |
| 失败/缺证据 | UI以摘要成功/颜色判断join或Gateapproval，hiddenedge泄露，超限ready残图；缺/failed/blocked/skipped/not_run/过期错版证据不得passed |
| 裁决影响 | P0不满足即不通过；送验baseline尚缺时保持blocked，不产生最终结论；若实际命中§11 VETO则总体强制不通过，不可waive |

#### GATE-CHAT-F-014 公司目录/三成员集合

| 要素 | 裁决要求 |
|---|---|
| 父AC/优先级 | AC-FR-CHAT-014 / P0 |
| 设计契约 | 00 §9/§14.2；03 §7/8同名protocol、§9/§10/§12；04 §7～11；05 §5.2/§6 |
| TC（既有planned） | TC-PROTO-045, TC-PROTO-046, TC-PROTO-047, TC-PROTO-048, TC-PROTO-085, TC-PROTO-086, TC-REAL-001, TC-REAL-004 |
| EV（既有planned） | EV-UI-003, EV-SDK-001 |
| 固定report入口 | reports/runs/<run_id>/evidence-index.md；reports/runs/<run_id>/evidence/EV-UI-003.md；reports/runs/<run_id>/evidence/EV-SDK-001.md |
| machine回链 | 05 §13.1对应suite/report.json→cases/<TC-ID>--<variant_id>.json→meta/context/manifest；同一批准baseline的固定run集合 |
| 通过条件 | provider human/AIcoverage与query/page lineage正式可验；公司人员、ProjectMember、Participant/presence各source/access独立；目录可见不授DM；所需TC参数全集/guard/负向均满足，证据scope不升级；实际正式SDK能力与TC-REAL-001/004对应参数另证 |
| 失败/缺证据 | Identity冒充全公司、人类coverage猜全、hidden人数输出、旧query页合并、新搜索被旧回包覆写；缺/failed/blocked/skipped/not_run/过期错版证据不得passed |
| 裁决影响 | P0不满足即不通过；送验baseline尚缺时保持blocked，不产生最终结论；若实际命中§11 VETO则总体强制不通过，不可waive |

#### GATE-CHAT-CORE-001 语境进入保持

| 要素 | 裁决要求 |
|---|---|
| 父AC/优先级 | AC-CHAT-001 / P0 |
| 设计契约 | 00 §14.1；03 §5～15；05 §5/12/13 |
| TC（既有planned） | TC-PROTO-009, TC-PROTO-010, TC-PROTO-019, TC-PROTO-020, TC-PROTO-055, TC-PROTO-056, TC-PROTO-075, TC-PROTO-076, TC-REAL-001, TC-REAL-004 |
| EV（既有planned） | EV-UNIT-001, EV-UNIT-002, EV-UNIT-003, EV-SDK-001 |
| 固定report入口 | reports/runs/<run_id>/evidence-index.md；reports/runs/<run_id>/evidence/EV-UNIT-001.md；reports/runs/<run_id>/evidence/EV-UNIT-002.md；reports/runs/<run_id>/evidence/EV-UNIT-003.md；reports/runs/<run_id>/evidence/EV-SDK-001.md |
| machine回链 | 05 §13.1对应suite/report.json→cases/<TC-ID>--<variant_id>.json→meta/context/manifest；同一批准baseline的固定run集合 |
| 通过条件 | 相关入口/访问/撤销子gate满足，route/selection纯local，onlyformalcurrent可见/可操作；所需TC参数全集/guard/负向均满足，证据scope不升级；实际正式SDK能力与TC-REAL-001/004对应参数另证 |
| 失败/缺证据 | 任一入口授权不明仍披露/操作；缺/failed/blocked/skipped/not_run/过期错版证据不得passed |
| 裁决影响 | P0不满足即不通过；送验baseline尚缺时保持blocked，不产生最终结论；若实际命中§11 VETO则总体强制不通过，不可waive |

#### GATE-CHAT-CORE-002 正式事实显化

| 要素 | 裁决要求 |
|---|---|
| 父AC/优先级 | AC-CHAT-002 / P0 |
| 设计契约 | 00 §14.1；03 §5～15；05 §5/12/13 |
| TC（既有planned） | TC-PROTO-013, TC-PROTO-014, TC-PROTO-015, TC-PROTO-016, TC-PROTO-017, TC-PROTO-018, TC-PROTO-035, TC-PROTO-036, TC-PROTO-037, TC-PROTO-038, TC-PROTO-039, TC-PROTO-040, TC-PROTO-041, TC-PROTO-042, TC-PROTO-043, TC-PROTO-044, TC-PROTO-045, TC-PROTO-046, TC-PROTO-047, TC-PROTO-048, TC-REAL-001, TC-REAL-004 |
| EV（既有planned） | EV-UI-001, EV-UI-002, EV-UI-003, EV-SDK-001 |
| 固定report入口 | reports/runs/<run_id>/evidence-index.md；reports/runs/<run_id>/evidence/EV-UI-001.md；reports/runs/<run_id>/evidence/EV-UI-002.md；reports/runs/<run_id>/evidence/EV-UI-003.md；reports/runs/<run_id>/evidence/EV-SDK-001.md |
| machine回链 | 05 §13.1对应suite/report.json→cases/<TC-ID>--<variant_id>.json→meta/context/manifest；同一批准baseline的固定run集合 |
| 通过条件 | safe source/type/version/visibility逐section成立，Process/关系/目录provider与范围正式，Gate与Artifact不生成truth；所需TC参数全集/guard/负向均满足，证据scope不升级；实际正式SDK能力与TC-REAL-001/004对应参数另证 |
| 失败/缺证据 | 跨owner补truth或fresh、混成员集合/summary当完成；缺/failed/blocked/skipped/not_run/过期错版证据不得passed |
| 裁决影响 | P0不满足即不通过；送验baseline尚缺时保持blocked，不产生最终结论；若实际命中§11 VETO则总体强制不通过，不可waive |

#### GATE-CHAT-CORE-003 受控意图结果

| 要素 | 裁决要求 |
|---|---|
| 父AC/优先级 | AC-CHAT-003 / P0 |
| 设计契约 | 00 §14.1；03 §5～15；05 §5/12/13 |
| TC（既有planned） | TC-PROTO-001, TC-PROTO-002, TC-PROTO-003, TC-PROTO-004, TC-PROTO-021, TC-PROTO-022, TC-PROTO-051, TC-PROTO-052, TC-PROTO-071, TC-PROTO-072, TC-CONC-001, TC-CONC-002, TC-CONC-003, TC-CONC-004, TC-CONC-005, TC-REAL-001, TC-REAL-004 |
| EV（既有planned） | EV-UNIT-001, EV-SDK-001 |
| 固定report入口 | reports/runs/<run_id>/evidence-index.md；reports/runs/<run_id>/evidence/EV-UNIT-001.md；reports/runs/<run_id>/evidence/EV-SDK-001.md |
| machine回链 | 05 §13.1对应suite/report.json→cases/<TC-ID>--<variant_id>.json→meta/context/manifest；同一批准baseline的固定run集合 |
| 通过条件 | localdraft/attempt、formalresult、transport与effectunknown全分开，single dispatch+正式owner结果；所需TC参数全集/guard/负向均满足，证据scope不升级；实际正式SDK能力与TC-REAL-001/004对应参数另证 |
| 失败/缺证据 | 点击/ACK确认、unknown重放、旧结果清新稿；缺/failed/blocked/skipped/not_run/过期错版证据不得passed |
| 裁决影响 | P0不满足即不通过；送验baseline尚缺时保持blocked，不产生最终结论；若实际命中§11 VETO则总体强制不通过，不可waive |

#### GATE-CHAT-CORE-004 变化与恢复

| 要素 | 裁决要求 |
|---|---|
| 父AC/优先级 | AC-CHAT-004 / P0 |
| 设计契约 | 00 §14.1；03 §5～15；05 §5/12/13 |
| TC（既有planned） | TC-PROTO-023, TC-PROTO-024, TC-PROTO-049, TC-PROTO-050, TC-PROTO-053, TC-PROTO-054, TC-PROTO-055, TC-PROTO-056, TC-PROTO-059, TC-PROTO-060, TC-PROTO-067, TC-PROTO-068, TC-PROTO-069, TC-PROTO-070, TC-PROTO-071, TC-PROTO-072, TC-PROTO-075, TC-PROTO-076, TC-PROTO-077, TC-PROTO-078, TC-PROTO-079, TC-PROTO-080, TC-REAL-001, TC-REAL-004 |
| EV（既有planned） | EV-UNIT-001, EV-UNIT-002, EV-UNIT-004, EV-SDK-001 |
| 固定report入口 | reports/runs/<run_id>/evidence-index.md；reports/runs/<run_id>/evidence/EV-UNIT-001.md；reports/runs/<run_id>/evidence/EV-UNIT-002.md；reports/runs/<run_id>/evidence/EV-UNIT-004.md；reports/runs/<run_id>/evidence/EV-SDK-001.md |
| machine回链 | 05 §13.1对应suite/report.json→cases/<TC-ID>--<variant_id>.json→meta/context/manifest；同一批准baseline的固定run集合 |
| 通过条件 | source独立顺序/coverage、撤销优先与内存恢复，缓存不授权，各设备正式query/change刷新而不syncdrafttruth；所需TC参数全集/guard/负向均满足，证据scope不升级；实际正式SDK能力与TC-REAL-001/004对应参数另证 |
| 失败/缺证据 | gap/offline/旧授权被掩盖、partial成功假全局fresh；缺/failed/blocked/skipped/not_run/过期错版证据不得passed |
| 裁决影响 | P0不满足即不通过；送验baseline尚缺时保持blocked，不产生最终结论；若实际命中§11 VETO则总体强制不通过，不可waive |

#### GATE-CHAT-CORE-005 整体闭环

| 要素 | 裁决要求 |
|---|---|
| 父AC/优先级 | AC-CHAT-005 / P0 |
| 设计契约 | 00 §14.1；03 §5～15；05 §5/12/13 |
| TC（既有planned） | TC-SAFE-009, TC-SAFE-010, TC-REAL-001, TC-REAL-002, TC-REAL-003, TC-REAL-004 |
| EV（既有planned） | EV-UI-001, EV-UNIT-002, EV-SDK-001, EV-HOST-001, EV-AT-001 |
| 固定report入口 | reports/runs/<run_id>/evidence-index.md；reports/runs/<run_id>/evidence/EV-UI-001.md；reports/runs/<run_id>/evidence/EV-UNIT-002.md；reports/runs/<run_id>/evidence/EV-SDK-001.md；reports/runs/<run_id>/evidence/EV-HOST-001.md；reports/runs/<run_id>/evidence/EV-AT-001.md |
| machine回链 | 05 §13.1对应suite/report.json→cases/<TC-ID>--<variant_id>.json→meta/context/manifest；同一批准baseline的固定run集合 |
| 通过条件 | 其它35个parentAC与独立local/SDK/native/AT/质量/证据要求全部满足，局部owner失败可解释；不把自身AC-CHAT-005结论当输入，聚合无环；所需TC参数全集/guard/负向均满足，证据scope不升级；本地contract证据可验证，不替代必要real层 |
| 失败/缺证据 | 任何P0 unsatisfied/blocked被统计为整体通过、非法scope升级；缺/failed/blocked/skipped/not_run/过期错版证据不得passed |
| 裁决影响 | P0不满足即不通过；送验baseline尚缺时保持blocked，不产生最终结论；若实际命中§11 VETO则总体强制不通过，不可waive |

### 5.2 parent聚合

AC-CHAT-001～004分别聚合当前功能、红线、协议、状态、NFR和证据义务；先裁决其它35个parentAC，再裁决AC-CHAT-005独立子gate和整体聚合，不递归引用其自身结论。聚合要求不改变05 suite/EV的scope或ac_refs标签；acceptance binding另记录每父AC所取实际TC/variants，不要求owner源码直接依赖。重复引用同一TC只共享证据，不算独立多次证明。

### 本Step逐项停审（设计过程记录）

每项独立完成来源→contract→TC→EV/report→pass/fail→裁决影响后才处理下一项。下表通过仅代表规则审查；实际TC/EV未生成、实际验收未开始。

| 验收项 | 审查项 | local gate | 外部缺口 |
|---|---|---|---|
| GATE-CHAT-F-001 | AC-FR-CHAT-001；00 §9/§14.2；03 §7/8同名protocol、§9/§10/§12；04 §7～11；05 §5.2/§6；TC/EV存在且scope/路径明确；pass/fail可判定，P0无waiver | pass_with_upstream_blockers | build/run/实际证据仍waiting，real能力sdk仍blocked |
| GATE-CHAT-F-002 | AC-FR-CHAT-002；00 §9/§14.2；03 §7/8同名protocol、§9/§10/§12；04 §7～11；05 §5.2/§6；TC/EV存在且scope/路径明确；pass/fail可判定，P0无waiver | pass_with_upstream_blockers | build/run/实际证据仍waiting，real能力sdk仍blocked |
| GATE-CHAT-F-003 | AC-FR-CHAT-003；00 §9/§14.2；03 §7/8同名protocol、§9/§10/§12；04 §7～11；05 §5.2/§6；TC/EV存在且scope/路径明确；pass/fail可判定，P0无waiver | pass_with_upstream_blockers | build/run/实际证据仍waiting，real能力sdk仍blocked |
| GATE-CHAT-F-004 | AC-FR-CHAT-004；00 §9/§14.2；03 §7/8同名protocol、§9/§10/§12；04 §7～11；05 §5.2/§6；TC/EV存在且scope/路径明确；pass/fail可判定，P0无waiver | pass_with_upstream_blockers | build/run/实际证据仍waiting，real能力sdk仍blocked |
| GATE-CHAT-F-005 | AC-FR-CHAT-005；00 §9/§14.2；03 §7/8同名protocol、§9/§10/§12；04 §7～11；05 §5.2/§6；TC/EV存在且scope/路径明确；pass/fail可判定，P0无waiver | pass_with_upstream_blockers | build/run/实际证据仍waiting，real能力sdk仍blocked |
| GATE-CHAT-F-006 | AC-FR-CHAT-006；00 §9/§14.2；03 §7/8同名protocol、§9/§10/§12；04 §7～11；05 §5.2/§6；TC/EV存在且scope/路径明确；pass/fail可判定，P0无waiver | pass_with_upstream_blockers | build/run/实际证据仍waiting，real能力sdk仍blocked |
| GATE-CHAT-F-007 | AC-FR-CHAT-007；00 §9/§14.2；03 §7/8同名protocol、§9/§10/§12；04 §7～11；05 §5.2/§6；TC/EV存在且scope/路径明确；pass/fail可判定，P0无waiver | pass_with_upstream_blockers | build/run/实际证据仍waiting，real能力sdk仍blocked |
| GATE-CHAT-F-008 | AC-FR-CHAT-008；00 §9/§14.2；03 §7/8同名protocol、§9/§10/§12；04 §7～11；05 §5.2/§6；TC/EV存在且scope/路径明确；pass/fail可判定，P0无waiver | pass_with_upstream_blockers | build/run/实际证据仍waiting，real能力sdk仍blocked |
| GATE-CHAT-F-009 | AC-FR-CHAT-009；00 §9/§14.2；03 §7/8同名protocol、§9/§10/§12；04 §7～11；05 §5.2/§6；TC/EV存在且scope/路径明确；pass/fail可判定，P0无waiver | pass_with_upstream_blockers | build/run/实际证据仍waiting，real能力不借fixture推断 |
| GATE-CHAT-F-010 | AC-FR-CHAT-010；00 §9/§14.2；03 §7/8同名protocol、§9/§10/§12；04 §7～11；05 §5.2/§6；TC/EV存在且scope/路径明确；pass/fail可判定，P0无waiver | pass_with_upstream_blockers | build/run/实际证据仍waiting，real能力不借fixture推断 |
| GATE-CHAT-F-011 | AC-FR-CHAT-011；00 §9/§14.2；03 §7/8同名protocol、§9/§10/§12；04 §7～11；05 §5.2/§6；TC/EV存在且scope/路径明确；pass/fail可判定，P0无waiver | pass_with_upstream_blockers | build/run/实际证据仍waiting，real能力sdk仍blocked |
| GATE-CHAT-F-012 | AC-FR-CHAT-012；00 §9/§14.2；03 §7/8同名protocol、§9/§10/§12；04 §7～11；05 §5.2/§6；TC/EV存在且scope/路径明确；pass/fail可判定，P0无waiver | pass_with_upstream_blockers | build/run/实际证据仍waiting，real能力sdk仍blocked |
| GATE-CHAT-F-013 | AC-FR-CHAT-013；00 §9/§14.2；03 §7/8同名protocol、§9/§10/§12；04 §7～11；05 §5.2/§6；TC/EV存在且scope/路径明确；pass/fail可判定，P0无waiver | pass_with_upstream_blockers | build/run/实际证据仍waiting，real能力sdk仍blocked |
| GATE-CHAT-F-014 | AC-FR-CHAT-014；00 §9/§14.2；03 §7/8同名protocol、§9/§10/§12；04 §7～11；05 §5.2/§6；TC/EV存在且scope/路径明确；pass/fail可判定，P0无waiver | pass_with_upstream_blockers | build/run/实际证据仍waiting，real能力sdk仍blocked |
| GATE-CHAT-CORE-001 | AC-CHAT-001；00 §14.1；03 §5～15；05 §5/12/13；TC/EV存在且scope/路径明确；pass/fail可判定，P0无waiver | pass_with_upstream_blockers | build/run/实际证据仍waiting，real能力sdk仍blocked |
| GATE-CHAT-CORE-002 | AC-CHAT-002；00 §14.1；03 §5～15；05 §5/12/13；TC/EV存在且scope/路径明确；pass/fail可判定，P0无waiver | pass_with_upstream_blockers | build/run/实际证据仍waiting，real能力sdk仍blocked |
| GATE-CHAT-CORE-003 | AC-CHAT-003；00 §14.1；03 §5～15；05 §5/12/13；TC/EV存在且scope/路径明确；pass/fail可判定，P0无waiver | pass_with_upstream_blockers | build/run/实际证据仍waiting，real能力sdk仍blocked |
| GATE-CHAT-CORE-004 | AC-CHAT-004；00 §14.1；03 §5～15；05 §5/12/13；TC/EV存在且scope/路径明确；pass/fail可判定，P0无waiver | pass_with_upstream_blockers | build/run/实际证据仍waiting，real能力sdk仍blocked |
| GATE-CHAT-CORE-005 | AC-CHAT-005；00 §14.1；03 §5～15；05 §5/12/13；TC/EV存在且scope/路径明确；pass/fail可判定，P0无waiver | pass_with_upstream_blockers | build/run/实际证据仍waiting，real能力不借fixture推断 |

### 跨功能门禁审计（设计过程记录）

| 审计项 | 结论/处理 |
|---|---|
| 缺contract/TC/EV/report | 本Step各项均回指既有03/04/05；无新TC/EV |
| 重复/冲突裁决 | 共用EV按TC/variant取子集；P0/VETO优先，parentAC仅聚合，不重复计通过 |
| source/状态/phase漂移 | 只当前正式值；planned/schema不是实测/结果，07boundary waiting |
| 范围越界 | 不验owner内部实现，不private API/bus；scope不足blocked，不伪real |


## 8. 回填草稿

正式06 §5回填本步§7裁决结论/表/schema；过程停审、差异和自检留本文件，不冒充实际结果。

## 9. 待确认事项

CHAT-UP001～009/WS-UP001～008/BASE001/native/OS/AT/生产预算/精确版本/来源/发布/归档继续open/blocked。角色、build、run_id、报告、actualEV、风险接受与签署均waiting；没有当前放行或readiness。

## 10. 自检及下一Step门禁

19项local审查，14FR与5core来源/证据与影响明确，无实际passed/新TC/EV。 本地规则设计gate pass_with_upstream_blockers；允许Step6先读取台账/flow/当前产物与对应SOP，不创建其它未来Step。
