# L5-chat 06 · Step 7 接口、事件与跨仓同步验收

## 1. Step状态

> done / pass_with_upstream_blockers；2026-10-01。这里只定义验收规则，所有TC/EV为planned预约，无实际验收结果或签署。

## 2. 本步输入

前序Step6 local gate已通过；06 SOP Step7、书写规范5.7；00实际36AC、03契约、04配置、05TC/EV和证据schema；中间产物§5.10与真相源§7。

## 3. SOP问题回答

Command/Query/Event/Job与下游未就绪如何判定？§7.1依赖表、§7.2逐协议、§7.3同步成功范围；客户端surface不造SDKwire。

## 4. 当前文档问题诊断

旧接口以stream/topic接通概括，会把SDKcompile/ACK/内部bus或localreceipt当正式能力。

## 5. 改动前后对比

| 改前 | 改后 | 原因 |
|---|---|---|
| 旧接口以stream/topic接通概括，会把SDKcompile/ACK/内部bus或localreceipt当正式能力。 | §7结构化裁决 | 保持正式contract/TC/EV与证据能力一致 |

## 6. 验收裁决取舍与复杂度

43surface逐卡smallloop，真实依赖按compile/runtime/event裁剪；无bus/directowner源码要求，未bound正向blocked而负向边界可验证。

## 7. 结构化中间产物

### 7.1 依赖类型与验收方式

| 依赖 | 全局类型/Chat裁剪 | 证据方式 | 禁止误判 |
|---|---|---|---|
| L0-sdk public TypeScript package | 编译期+运行期 | approvedversion/publicexports/type/import与正式runtime/session/capability，EV-UNIT-008/006、EV-SDK-001 | dist存在/contract compile不等runtime bound |
| L0-core正式contracts | 全局允许编译期；仅03批准import/经SDK的正式传递类型 | package dependency/typecontract与ASTboundary，EV-UNIT-008 | 不为验收新增owner源码依赖 |
| Conversation/Identity/Work/Governance/Artifact/Workspace/Member/Runtime/Process/目录关系provider | 运行期，经SDKsafequery/command/probe | 固定publiccontract、currentauthority/source/visibility/结果；EV-SDK-001对应TC-REAL-001/004 | 不验ownerDB/UoW完整实现，不privateAPI |
| owner change/result/visibility/resume | 事件协作，经SDK正式消费；不是bus直订 | qualifiedsource/cursor/coverage/replay与本地reducer，EV-UNIT-002/001+EV-SDK-001 | 不猜topic/offset，不要求bus代码依赖 |
| Tauri/native/OS/AT | 非业务技术适配，approvedcontrolledIPC | TS/Rustguard与实际Desktop/AT证据EV-NATIVE-001/EV-HOST-001/EV-AT-001 | ordinaryJSON权限或Web截图不证native |
| L6-bridges | 并行兄弟边界参考 | 当前无正式消费要求 | 不把外部映射/未停审材料当输入 |
| diagnostic sink | 条件运行期，显式用户、mode/正式SDK能力 | EV-UNIT-005+启用时formalSDKsink资格 | 无自动telemetry/observabilitybackend |

### 7.2 43协议逐项裁决

这些名字是03正式**客户端typed surface**，不是未经SDK确认的HTTProute/topic/job。两Submit只形成意图；RequestSafePreview纯query；local回执不等ownerreceipt；7Consumer只接受qualifiedSDK或trustedhost输入。正式SDKwire/export未闭一律blocked，无猜方法/topic替代。
每项原Request/Reply/typed Input/value和业务必要session/currentfence、source/visibility/所有原slots按03同名卡严格校验。local读/AT/host按各自协议资格，不伪造owner source。Query只读owner，localCAS仅安全展示更新；jobs只恢复/清理客户端，不推进Process/Runtime/ownertruth。未就绪可验证负向failclosed边界，但不把接口正向判passed。

#### GATE-CHAT-P-001 SubmitConversationIntent

| 要素 | 裁决要求 |
|---|---|
| 父AC/优先级 | AC-CHAT-003 / P0 |
| 设计契约 | 03 §7/§8 SubmitConversationIntent同名独立卡；05 §6.2.1；CUT-P-01 |
| TC（既有planned） | TC-PROTO-001, TC-PROTO-002, TC-REAL-001, TC-REAL-004 |
| EV（既有planned） | EV-UNIT-001, EV-SDK-001 |
| 固定report入口 | reports/runs/<run_id>/evidence-index.md；reports/runs/<run_id>/evidence/EV-UNIT-001.md；reports/runs/<run_id>/evidence/EV-SDK-001.md |
| machine回链 | 05 §13.1对应suite/report.json→cases/<TC-ID>--<variant_id>.json→meta/context/manifest；同一批准baseline的固定run集合 |
| 通过条件 | 冻结当前draft→预留→单dispatch→formal confirmed，只清同revision；typedfield/来源/条件与currentroot/alloriginalslots闭口；实际sdk层符合能力边界；所需TC参数全集/guard/负向均满足，证据scope不升级；实际正式SDK能力与TC-REAL-001/004对应参数另证 |
| 失败/缺证据 | 双击/IME/ACK/断线unknown，新稿不被旧确认清对应异常输入/竞态被错误接受或安全防护未成立；任何非法owner写入/second effect/旧回包覆写/隐藏披露；缺/failed/blocked/skipped/not_run/过期错版证据不得passed |
| 裁决影响 | P0不满足即不通过；送验baseline尚缺时保持blocked，不产生最终结论；若实际命中§11 VETO则总体强制不通过，不可waive |

#### GATE-CHAT-P-002 SubmitGovernanceIntent

| 要素 | 裁决要求 |
|---|---|
| 父AC/优先级 | AC-CHAT-003 / P0 |
| 设计契约 | 03 §7/§8 SubmitGovernanceIntent同名独立卡；05 §6.2.2；CUT-P-02 |
| TC（既有planned） | TC-PROTO-003, TC-PROTO-004, TC-REAL-001, TC-REAL-004 |
| EV（既有planned） | EV-UNIT-001, EV-SDK-001 |
| 固定report入口 | reports/runs/<run_id>/evidence-index.md；reports/runs/<run_id>/evidence/EV-UNIT-001.md；reports/runs/<run_id>/evidence/EV-SDK-001.md |
| machine回链 | 05 §13.1对应suite/report.json→cases/<TC-ID>--<variant_id>.json→meta/context/manifest；同一批准baseline的固定run集合 |
| 通过条件 | formal Gate/action capability→single dispatch→正式结果反馈；typedfield/来源/条件与currentroot/alloriginalslots闭口；实际sdk层符合能力边界；所需TC参数全集/guard/负向均满足，证据scope不升级；实际正式SDK能力与TC-REAL-001/004对应参数另证 |
| 失败/缺证据 | 点击/transport不确认，Gate capability撤销/unknown不重发对应异常输入/竞态被错误接受或安全防护未成立；任何非法owner写入/second effect/旧回包覆写/隐藏披露；缺/failed/blocked/skipped/not_run/过期错版证据不得passed |
| 裁决影响 | P0不满足即不通过；送验baseline尚缺时保持blocked，不产生最终结论；若实际命中§11 VETO则总体强制不通过，不可waive |

#### GATE-CHAT-P-003 RequestSafePreview

| 要素 | 裁决要求 |
|---|---|
| 父AC/优先级 | AC-CHAT-002 / P0 |
| 设计契约 | 03 §7/§8 RequestSafePreview同名独立卡；05 §6.2.3；CUT-P-03 |
| TC（既有planned） | TC-PROTO-005, TC-PROTO-006, TC-REAL-001, TC-REAL-004 |
| EV（既有planned） | EV-UI-001, EV-SDK-001 |
| 固定report入口 | reports/runs/<run_id>/evidence-index.md；reports/runs/<run_id>/evidence/EV-UI-001.md；reports/runs/<run_id>/evidence/EV-SDK-001.md |
| machine回链 | 05 §13.1对应suite/report.json→cases/<TC-ID>--<variant_id>.json→meta/context/manifest；同一批准baseline的固定run集合 |
| 通过条件 | 正式无effect安全preview query；typedfield/来源/条件与currentroot/alloriginalslots闭口；实际sdk层符合能力边界；所需TC参数全集/guard/负向均满足，证据scope不升级；实际正式SDK能力与TC-REAL-001/004对应参数另证 |
| 失败/缺证据 | 有副作用能力/未bound/hidden禁止open对应异常输入/竞态被错误接受或安全防护未成立；任何非法owner写入/second effect/旧回包覆写/隐藏披露；缺/failed/blocked/skipped/not_run/过期错版证据不得passed |
| 裁决影响 | P0不满足即不通过；送验baseline尚缺时保持blocked，不产生最终结论；若实际命中§11 VETO则总体强制不通过，不可waive |

#### GATE-CHAT-P-004 AcknowledgeLocalRecoveryAction

| 要素 | 裁决要求 |
|---|---|
| 父AC/优先级 | AC-CHAT-004 / P0 |
| 设计契约 | 03 §7/§8 AcknowledgeLocalRecoveryAction同名独立卡；05 §6.2.4；CUT-P-04 |
| TC（既有planned） | TC-PROTO-007, TC-PROTO-008, TC-REAL-001, TC-REAL-004 |
| EV（既有planned） | EV-UNIT-002, EV-SDK-001 |
| 固定report入口 | reports/runs/<run_id>/evidence-index.md；reports/runs/<run_id>/evidence/EV-UNIT-002.md；reports/runs/<run_id>/evidence/EV-SDK-001.md |
| machine回链 | 05 §13.1对应suite/report.json→cases/<TC-ID>--<variant_id>.json→meta/context/manifest；同一批准baseline的固定run集合 |
| 通过条件 | current source下允许resume/requery/probe/clear；typedfield/来源/条件与currentroot/alloriginalslots闭口；实际sdk层符合能力边界；所需TC参数全集/guard/负向均满足，证据scope不升级；实际正式SDK能力与TC-REAL-001/004对应参数另证 |
| 失败/缺证据 | 非法action或unknown resend拒绝对应异常输入/竞态被错误接受或安全防护未成立；任何非法owner写入/second effect/旧回包覆写/隐藏披露；缺/failed/blocked/skipped/not_run/过期错版证据不得passed |
| 裁决影响 | P0不满足即不通过；送验baseline尚缺时保持blocked，不产生最终结论；若实际命中§11 VETO则总体强制不通过，不可waive |

#### GATE-CHAT-P-005 ResolveEntryAccess

| 要素 | 裁决要求 |
|---|---|
| 父AC/优先级 | AC-CHAT-001 / P0 |
| 设计契约 | 03 §7/§8 ResolveEntryAccess同名独立卡；05 §6.2.5；CUT-P-05 |
| TC（既有planned） | TC-PROTO-009, TC-PROTO-010, TC-REAL-001, TC-REAL-004 |
| EV（既有planned） | EV-UNIT-003, EV-SDK-001 |
| 固定report入口 | reports/runs/<run_id>/evidence-index.md；reports/runs/<run_id>/evidence/EV-UNIT-003.md；reports/runs/<run_id>/evidence/EV-SDK-001.md |
| machine回链 | 05 §13.1对应suite/report.json→cases/<TC-ID>--<variant_id>.json→meta/context/manifest；同一批准baseline的固定run集合 |
| 通过条件 | group/channel/dm/thread与项目/目录入口正式资格解析；typedfield/来源/条件与currentroot/alloriginalslots闭口；实际sdk层符合能力边界；所需TC参数全集/guard/负向均满足，证据scope不升级；实际正式SDK能力与TC-REAL-001/004对应参数另证 |
| 失败/缺证据 | 深链伪actor/无parent/旧epoch/hidden不泄露对应异常输入/竞态被错误接受或安全防护未成立；任何非法owner写入/second effect/旧回包覆写/隐藏披露；缺/failed/blocked/skipped/not_run/过期错版证据不得passed |
| 裁决影响 | P0不满足即不通过；送验baseline尚缺时保持blocked，不产生最终结论；若实际命中§11 VETO则总体强制不通过，不可waive |

#### GATE-CHAT-P-006 LoadConversationSurface

| 要素 | 裁决要求 |
|---|---|
| 父AC/优先级 | AC-CHAT-002 / P0 |
| 设计契约 | 03 §7/§8 LoadConversationSurface同名独立卡；05 §6.2.6；CUT-P-06 |
| TC（既有planned） | TC-PROTO-011, TC-PROTO-012, TC-REAL-001, TC-REAL-004 |
| EV（既有planned） | EV-UI-001, EV-SDK-001 |
| 固定report入口 | reports/runs/<run_id>/evidence-index.md；reports/runs/<run_id>/evidence/EV-UI-001.md；reports/runs/<run_id>/evidence/EV-SDK-001.md |
| machine回链 | 05 §13.1对应suite/report.json→cases/<TC-ID>--<variant_id>.json→meta/context/manifest；同一批准baseline的固定run集合 |
| 通过条件 | qualifiedsafe surface一次current CAS；typedfield/来源/条件与currentroot/alloriginalslots闭口；实际sdk层符合能力边界；所需TC参数全集/guard/负向均满足，证据scope不升级；实际正式SDK能力与TC-REAL-001/004对应参数另证 |
| 失败/缺证据 | 切换会话后late response不覆写，hidden清refs对应异常输入/竞态被错误接受或安全防护未成立；任何非法owner写入/second effect/旧回包覆写/隐藏披露；缺/failed/blocked/skipped/not_run/过期错版证据不得passed |
| 裁决影响 | P0不满足即不通过；送验baseline尚缺时保持blocked，不产生最终结论；若实际命中§11 VETO则总体强制不通过，不可waive |

#### GATE-CHAT-P-007 LoadTurnPage

| 要素 | 裁决要求 |
|---|---|
| 父AC/优先级 | AC-CHAT-002 / P0 |
| 设计契约 | 03 §7/§8 LoadTurnPage同名独立卡；05 §6.2.7；CUT-P-07 |
| TC（既有planned） | TC-PROTO-013, TC-PROTO-014, TC-REAL-001, TC-REAL-004 |
| EV（既有planned） | EV-UI-001, EV-SDK-001 |
| 固定report入口 | reports/runs/<run_id>/evidence-index.md；reports/runs/<run_id>/evidence/EV-UI-001.md；reports/runs/<run_id>/evidence/EV-SDK-001.md |
| machine回链 | 05 §13.1对应suite/report.json→cases/<TC-ID>--<variant_id>.json→meta/context/manifest；同一批准baseline的固定run集合 |
| 通过条件 | SDK排序/page lineage正向，Turn类型安全分派；typedfield/来源/条件与currentroot/alloriginalslots闭口；实际sdk层符合能力边界；所需TC参数全集/guard/负向均满足，证据scope不升级；实际正式SDK能力与TC-REAL-001/004对应参数另证 |
| 失败/缺证据 | 未知category/错cursor lineage/旧页/无限分页拒绝对应异常输入/竞态被错误接受或安全防护未成立；任何非法owner写入/second effect/旧回包覆写/隐藏披露；缺/failed/blocked/skipped/not_run/过期错版证据不得passed |
| 裁决影响 | P0不满足即不通过；送验baseline尚缺时保持blocked，不产生最终结论；若实际命中§11 VETO则总体强制不通过，不可waive |

#### GATE-CHAT-P-008 LoadOwnerSummary

| 要素 | 裁决要求 |
|---|---|
| 父AC/优先级 | AC-CHAT-002 / P0 |
| 设计契约 | 03 §7/§8 LoadOwnerSummary同名独立卡；05 §6.2.8；CUT-P-08 |
| TC（既有planned） | TC-PROTO-015, TC-PROTO-016, TC-REAL-001, TC-REAL-004 |
| EV（既有planned） | EV-UI-001, EV-SDK-001 |
| 固定report入口 | reports/runs/<run_id>/evidence-index.md；reports/runs/<run_id>/evidence/EV-UI-001.md；reports/runs/<run_id>/evidence/EV-SDK-001.md |
| machine回链 | 05 §13.1对应suite/report.json→cases/<TC-ID>--<variant_id>.json→meta/context/manifest；同一批准baseline的固定run集合 |
| 通过条件 | source provenance/freshness独立保持；typedfield/来源/条件与currentroot/alloriginalslots闭口；实际sdk层符合能力边界；所需TC参数全集/guard/负向均满足，证据scope不升级；实际正式SDK能力与TC-REAL-001/004对应参数另证 |
| 失败/缺证据 | raw body/跨owner版本/无visibility拒绝对应异常输入/竞态被错误接受或安全防护未成立；任何非法owner写入/second effect/旧回包覆写/隐藏披露；缺/failed/blocked/skipped/not_run/过期错版证据不得passed |
| 裁决影响 | P0不满足即不通过；送验baseline尚缺时保持blocked，不产生最终结论；若实际命中§11 VETO则总体强制不通过，不可waive |

#### GATE-CHAT-P-009 LoadArtifactPreview

| 要素 | 裁决要求 |
|---|---|
| 父AC/优先级 | AC-CHAT-002 / P0 |
| 设计契约 | 03 §7/§8 LoadArtifactPreview同名独立卡；05 §6.2.9；CUT-P-09 |
| TC（既有planned） | TC-PROTO-017, TC-PROTO-018, TC-REAL-001, TC-REAL-004 |
| EV（既有planned） | EV-UI-001, EV-SDK-001 |
| 固定report入口 | reports/runs/<run_id>/evidence-index.md；reports/runs/<run_id>/evidence/EV-UI-001.md；reports/runs/<run_id>/evidence/EV-SDK-001.md |
| machine回链 | 05 §13.1对应suite/report.json→cases/<TC-ID>--<variant_id>.json→meta/context/manifest；同一批准baseline的固定run集合 |
| 通过条件 | safe ref→正式preview descriptor；typedfield/来源/条件与currentroot/alloriginalslots闭口；实际sdk层符合能力边界；所需TC参数全集/guard/负向均满足，证据scope不升级；实际正式SDK能力与TC-REAL-001/004对应参数另证 |
| 失败/缺证据 | 过期/撤销/unsupported清openRef，不拼URL对应异常输入/竞态被错误接受或安全防护未成立；任何非法owner写入/second effect/旧回包覆写/隐藏披露；缺/failed/blocked/skipped/not_run/过期错版证据不得passed |
| 裁决影响 | P0不满足即不通过；送验baseline尚缺时保持blocked，不产生最终结论；若实际命中§11 VETO则总体强制不通过，不可waive |

#### GATE-CHAT-P-010 LoadIntentCapability

| 要素 | 裁决要求 |
|---|---|
| 父AC/优先级 | AC-CHAT-003 / P0 |
| 设计契约 | 03 §7/§8 LoadIntentCapability同名独立卡；05 §6.2.10；CUT-P-10 |
| TC（既有planned） | TC-PROTO-019, TC-PROTO-020, TC-REAL-001, TC-REAL-004 |
| EV（既有planned） | EV-UNIT-001, EV-SDK-001 |
| 固定report入口 | reports/runs/<run_id>/evidence-index.md；reports/runs/<run_id>/evidence/EV-UNIT-001.md；reports/runs/<run_id>/evidence/EV-SDK-001.md |
| machine回链 | 05 §13.1对应suite/report.json→cases/<TC-ID>--<variant_id>.json→meta/context/manifest；同一批准baseline的固定run集合 |
| 通过条件 | 当前actor/scope/intent/Gate正式能力；typedfield/来源/条件与currentroot/alloriginalslots闭口；实际sdk层符合能力边界；所需TC参数全集/guard/负向均满足，证据scope不升级；实际正式SDK能力与TC-REAL-001/004对应参数另证 |
| 失败/缺证据 | 缓存/host available不授予提交对应异常输入/竞态被错误接受或安全防护未成立；任何非法owner写入/second effect/旧回包覆写/隐藏披露；缺/failed/blocked/skipped/not_run/过期错版证据不得passed |
| 裁决影响 | P0不满足即不通过；送验baseline尚缺时保持blocked，不产生最终结论；若实际命中§11 VETO则总体强制不通过，不可waive |

#### GATE-CHAT-P-011 ProbeCommandAttempt

| 要素 | 裁决要求 |
|---|---|
| 父AC/优先级 | AC-CHAT-003 / P0 |
| 设计契约 | 03 §7/§8 ProbeCommandAttempt同名独立卡；05 §6.2.11；CUT-P-11 |
| TC（既有planned） | TC-PROTO-021, TC-PROTO-022, TC-REAL-001, TC-REAL-004 |
| EV（既有planned） | EV-UNIT-001, EV-SDK-001 |
| 固定report入口 | reports/runs/<run_id>/evidence-index.md；reports/runs/<run_id>/evidence/EV-UNIT-001.md；reports/runs/<run_id>/evidence/EV-SDK-001.md |
| machine回链 | 05 §13.1对应suite/report.json→cases/<TC-ID>--<variant_id>.json→meta/context/manifest；同一批准baseline的固定run集合 |
| 通过条件 | matched formal probe收敛unknown；typedfield/来源/条件与currentroot/alloriginalslots闭口；实际sdk层符合能力边界；所需TC参数全集/guard/负向均满足，证据scope不升级；实际正式SDK能力与TC-REAL-001/004对应参数另证 |
| 失败/缺证据 | not_found无no-effect仍unknown，错association拒绝对应异常输入/竞态被错误接受或安全防护未成立；任何非法owner写入/second effect/旧回包覆写/隐藏披露；缺/failed/blocked/skipped/not_run/过期错版证据不得passed |
| 裁决影响 | P0不满足即不通过；送验baseline尚缺时保持blocked，不产生最终结论；若实际命中§11 VETO则总体强制不通过，不可waive |

#### GATE-CHAT-P-012 LoadResumeContext

| 要素 | 裁决要求 |
|---|---|
| 父AC/优先级 | AC-CHAT-004 / P0 |
| 设计契约 | 03 §7/§8 LoadResumeContext同名独立卡；05 §6.2.12；CUT-P-12 |
| TC（既有planned） | TC-PROTO-023, TC-PROTO-024, TC-REAL-001, TC-REAL-004 |
| EV（既有planned） | EV-UNIT-002, EV-SDK-001 |
| 固定report入口 | reports/runs/<run_id>/evidence-index.md；reports/runs/<run_id>/evidence/EV-UNIT-002.md；reports/runs/<run_id>/evidence/EV-SDK-001.md |
| machine回链 | 05 §13.1对应suite/report.json→cases/<TC-ID>--<variant_id>.json→meta/context/manifest；同一批准baseline的固定run集合 |
| 通过条件 | 当前单source恢复候选；typedfield/来源/条件与currentroot/alloriginalslots闭口；实际sdk层符合能力边界；所需TC参数全集/guard/负向均满足，证据scope不升级；实际正式SDK能力与TC-REAL-001/004对应参数另证 |
| 失败/缺证据 | 跨source/cursor字符串排序/旧request拒绝对应异常输入/竞态被错误接受或安全防护未成立；任何非法owner写入/second effect/旧回包覆写/隐藏披露；缺/failed/blocked/skipped/not_run/过期错版证据不得passed |
| 裁决影响 | P0不满足即不通过；送验baseline尚缺时保持blocked，不产生最终结论；若实际命中§11 VETO则总体强制不通过，不可waive |

#### GATE-CHAT-P-013 LoadLocalProjection

| 要素 | 裁决要求 |
|---|---|
| 父AC/优先级 | AC-CHAT-002 / P0 |
| 设计契约 | 03 §7/§8 LoadLocalProjection同名独立卡；05 §6.2.13；CUT-P-13 |
| TC（既有planned） | TC-PROTO-025, TC-PROTO-026 |
| EV（既有planned） | EV-UNIT-004 |
| 固定report入口 | reports/runs/<run_id>/evidence-index.md；reports/runs/<run_id>/evidence/EV-UNIT-004.md |
| machine回链 | 05 §13.1对应suite/report.json→cases/<TC-ID>--<variant_id>.json→meta/context/manifest；同一批准baseline的固定run集合 |
| 通过条件 | 同partition load含entry版/null；typedfield/来源/条件与currentroot/alloriginalslots闭口；实际本地合同层符合能力边界；所需TC参数全集/guard/负向均满足，证据scope不升级；本地contract证据可验证，不替代必要real层 |
| 失败/缺证据 | 错partition不泄露存在性，cache不授权对应异常输入/竞态被错误接受或安全防护未成立；任何非法owner写入/second effect/旧回包覆写/隐藏披露；缺/failed/blocked/skipped/not_run/过期错版证据不得passed |
| 裁决影响 | P0不满足即不通过；送验baseline尚缺时保持blocked，不产生最终结论；若实际命中§11 VETO则总体强制不通过，不可waive |

#### GATE-CHAT-P-014 LoadDraft

| 要素 | 裁决要求 |
|---|---|
| 父AC/优先级 | AC-CHAT-002 / P0 |
| 设计契约 | 03 §7/§8 LoadDraft同名独立卡；05 §6.2.14；CUT-P-14 |
| TC（既有planned） | TC-PROTO-027, TC-PROTO-028 |
| EV（既有planned） | EV-UNIT-004 |
| 固定report入口 | reports/runs/<run_id>/evidence-index.md；reports/runs/<run_id>/evidence/EV-UNIT-004.md |
| machine回链 | 05 §13.1对应suite/report.json→cases/<TC-ID>--<variant_id>.json→meta/context/manifest；同一批准baseline的固定run集合 |
| 通过条件 | 当前context内存稿/root版；typedfield/来源/条件与currentroot/alloriginalslots闭口；实际本地合同层符合能力边界；所需TC参数全集/guard/负向均满足，证据scope不升级；本地contract证据可验证，不替代必要real层 |
| 失败/缺证据 | 项目/目录伪Conversation/跨scope稿拒绝对应异常输入/竞态被错误接受或安全防护未成立；任何非法owner写入/second effect/旧回包覆写/隐藏披露；缺/failed/blocked/skipped/not_run/过期错版证据不得passed |
| 裁决影响 | P0不满足即不通过；送验baseline尚缺时保持blocked，不产生最终结论；若实际命中§11 VETO则总体强制不通过，不可waive |

#### GATE-CHAT-P-015 ProbePlatformCapability

| 要素 | 裁决要求 |
|---|---|
| 父AC/优先级 | AC-CHAT-002 / P0 |
| 设计契约 | 03 §7/§8 ProbePlatformCapability同名独立卡；05 §6.2.15；CUT-P-15 |
| TC（既有planned） | TC-PROTO-029, TC-PROTO-030, TC-REAL-002 |
| EV（既有planned） | EV-NATIVE-001, EV-HOST-001 |
| 固定report入口 | reports/runs/<run_id>/evidence-index.md；reports/runs/<run_id>/evidence/EV-NATIVE-001.md；reports/runs/<run_id>/evidence/EV-HOST-001.md |
| machine回链 | 05 §13.1对应suite/report.json→cases/<TC-ID>--<variant_id>.json→meta/context/manifest；同一批准baseline的固定run集合 |
| 通过条件 | 四host能力各自probe姿态；typedfield/来源/条件与currentroot/alloriginalslots闭口；实际host层符合能力边界；所需TC参数全集/guard/负向均满足，证据scope不升级；真实Desktop批准矩阵与TC-REAL-002另证 |
| 失败/缺证据 | 假origin/旧window/无合同unknown，不授予业务权对应异常输入/竞态被错误接受或安全防护未成立；任何非法owner写入/second effect/旧回包覆写/隐藏披露；缺/failed/blocked/skipped/not_run/过期错版证据不得passed |
| 裁决影响 | P0不满足即不通过；送验baseline尚缺时保持blocked，不产生最终结论；若实际命中§11 VETO则总体强制不通过，不可waive |

#### GATE-CHAT-P-016 LoadAccessibilityContext

| 要素 | 裁决要求 |
|---|---|
| 父AC/优先级 | AC-CHAT-002 / P0 |
| 设计契约 | 03 §7/§8 LoadAccessibilityContext同名独立卡；05 §6.2.16；CUT-P-16 |
| TC（既有planned） | TC-PROTO-031, TC-PROTO-032, TC-REAL-003 |
| EV（既有planned） | EV-UI-001, EV-AT-001 |
| 固定report入口 | reports/runs/<run_id>/evidence-index.md；reports/runs/<run_id>/evidence/EV-UI-001.md；reports/runs/<run_id>/evidence/EV-AT-001.md |
| machine回链 | 05 §13.1对应suite/report.json→cases/<TC-ID>--<variant_id>.json→meta/context/manifest；同一批准baseline的固定run集合 |
| 通过条件 | safe page派生region/focus/announcement；typedfield/来源/条件与currentroot/alloriginalslots闭口；实际at层符合能力边界；所需TC参数全集/guard/负向均满足，证据scope不升级；适用真实AT矩阵与TC-REAL-003另证 |
| 失败/缺证据 | 隐藏label/count/边不能出现在AT，失效焦点转安全区对应异常输入/竞态被错误接受或安全防护未成立；任何非法owner写入/second effect/旧回包覆写/隐藏披露；缺/failed/blocked/skipped/not_run/过期错版证据不得passed |
| 裁决影响 | P0不满足即不通过；送验baseline尚缺时保持blocked，不产生最终结论；若实际命中§11 VETO则总体强制不通过，不可waive |

#### GATE-CHAT-P-017 LoadProjectList

| 要素 | 裁决要求 |
|---|---|
| 父AC/优先级 | AC-CHAT-002 / P0 |
| 设计契约 | 03 §7/§8 LoadProjectList同名独立卡；05 §6.2.17；CUT-P-17 |
| TC（既有planned） | TC-PROTO-033, TC-PROTO-034, TC-REAL-001, TC-REAL-004 |
| EV（既有planned） | EV-UI-002, EV-SDK-001 |
| 固定report入口 | reports/runs/<run_id>/evidence-index.md；reports/runs/<run_id>/evidence/EV-UI-002.md；reports/runs/<run_id>/evidence/EV-SDK-001.md |
| machine回链 | 05 §13.1对应suite/report.json→cases/<TC-ID>--<variant_id>.json→meta/context/manifest；同一批准baseline的固定run集合 |
| 通过条件 | 正式Work项目safe页与page info；typedfield/来源/条件与currentroot/alloriginalslots闭口；实际sdk层符合能力边界；所需TC参数全集/guard/负向均满足，证据scope不升级；实际正式SDK能力与TC-REAL-001/004对应参数另证 |
| 失败/缺证据 | 空页不推项目不存在；旧搜索/页拒绝对应异常输入/竞态被错误接受或安全防护未成立；任何非法owner写入/second effect/旧回包覆写/隐藏披露；缺/failed/blocked/skipped/not_run/过期错版证据不得passed |
| 裁决影响 | P0不满足即不通过；送验baseline尚缺时保持blocked，不产生最终结论；若实际命中§11 VETO则总体强制不通过，不可waive |

#### GATE-CHAT-P-018 LoadProjectDetail

| 要素 | 裁决要求 |
|---|---|
| 父AC/优先级 | AC-FR-CHAT-011 / P0 |
| 设计契约 | 03 §7/§8 LoadProjectDetail同名独立卡；05 §6.2.18；CUT-P-18 |
| TC（既有planned） | TC-PROTO-035, TC-PROTO-036, TC-REAL-001, TC-REAL-004 |
| EV（既有planned） | EV-UI-002, EV-SDK-001 |
| 固定report入口 | reports/runs/<run_id>/evidence-index.md；reports/runs/<run_id>/evidence/EV-UI-002.md；reports/runs/<run_id>/evidence/EV-SDK-001.md |
| machine回链 | 05 §13.1对应suite/report.json→cases/<TC-ID>--<variant_id>.json→meta/context/manifest；同一批准baseline的固定run集合 |
| 通过条件 | 五tab、各sourcesection与返回语境；typedfield/来源/条件与currentroot/alloriginalslots闭口；实际sdk层符合能力边界；所需TC参数全集/guard/负向均满足，证据scope不升级；实际正式SDK能力与TC-REAL-001/004对应参数另证 |
| 失败/缺证据 | 顶层progress不存在，partial不混成全owner fresh对应异常输入/竞态被错误接受或安全防护未成立；任何非法owner写入/second effect/旧回包覆写/隐藏披露；缺/failed/blocked/skipped/not_run/过期错版证据不得passed |
| 裁决影响 | P0不满足即不通过；送验baseline尚缺时保持blocked，不产生最终结论；若实际命中§11 VETO则总体强制不通过，不可waive |

#### GATE-CHAT-P-019 LoadProjectProcessFlow

| 要素 | 裁决要求 |
|---|---|
| 父AC/优先级 | AC-FR-CHAT-011 / P0 |
| 设计契约 | 03 §7/§8 LoadProjectProcessFlow同名独立卡；05 §6.2.19；CUT-P-19 |
| TC（既有planned） | TC-PROTO-037, TC-PROTO-038, TC-REAL-001, TC-REAL-004 |
| EV（既有planned） | EV-UI-002, EV-SDK-001 |
| 固定report入口 | reports/runs/<run_id>/evidence-index.md；reports/runs/<run_id>/evidence/EV-UI-002.md；reports/runs/<run_id>/evidence/EV-SDK-001.md |
| machine回链 | 05 §13.1对应suite/report.json→cases/<TC-ID>--<variant_id>.json→meta/context/manifest；同一批准baseline的固定run集合 |
| 通过条件 | Process整体safe topology/版本/并行gateway；typedfield/来源/条件与currentroot/alloriginalslots闭口；实际sdk层符合能力边界；所需TC参数全集/guard/负向均满足，证据scope不升级；实际正式SDK能力与TC-REAL-001/004对应参数另证 |
| 失败/缺证据 | 从WorkItem/log/prototype补图拒绝，hidden边裁剪对应异常输入/竞态被错误接受或安全防护未成立；任何非法owner写入/second effect/旧回包覆写/隐藏披露；缺/failed/blocked/skipped/not_run/过期错版证据不得passed |
| 裁决影响 | P0不满足即不通过；送验baseline尚缺时保持blocked，不产生最终结论；若实际命中§11 VETO则总体强制不通过，不可waive |

#### GATE-CHAT-P-020 LoadStageProcessFlow

| 要素 | 裁决要求 |
|---|---|
| 父AC/优先级 | AC-FR-CHAT-011 / P0 |
| 设计契约 | 03 §7/§8 LoadStageProcessFlow同名独立卡；05 §6.2.20；CUT-P-20 |
| TC（既有planned） | TC-PROTO-039, TC-PROTO-040, TC-REAL-001, TC-REAL-004 |
| EV（既有planned） | EV-UI-002, EV-SDK-001 |
| 固定report入口 | reports/runs/<run_id>/evidence-index.md；reports/runs/<run_id>/evidence/EV-UI-002.md；reports/runs/<run_id>/evidence/EV-SDK-001.md |
| machine回链 | 05 §13.1对应suite/report.json→cases/<TC-ID>--<variant_id>.json→meta/context/manifest；同一批准baseline的固定run集合 |
| 通过条件 | matchedparent进入独立阶段流程；typedfield/来源/条件与currentroot/alloriginalslots闭口；实际sdk层符合能力边界；所需TC参数全集/guard/负向均满足，证据scope不升级；实际正式SDK能力与TC-REAL-001/004对应参数另证 |
| 失败/缺证据 | 父版本变化/阶段迟到清旧child，无伪汇聚对应异常输入/竞态被错误接受或安全防护未成立；任何非法owner写入/second effect/旧回包覆写/隐藏披露；缺/failed/blocked/skipped/not_run/过期错版证据不得passed |
| 裁决影响 | P0不满足即不通过；送验baseline尚缺时保持blocked，不产生最终结论；若实际命中§11 VETO则总体强制不通过，不可waive |

#### GATE-CHAT-P-021 LoadProcessNodeDetail

| 要素 | 裁决要求 |
|---|---|
| 父AC/优先级 | AC-FR-CHAT-011 / P0 |
| 设计契约 | 03 §7/§8 LoadProcessNodeDetail同名独立卡；05 §6.2.21；CUT-P-21 |
| TC（既有planned） | TC-PROTO-041, TC-PROTO-042, TC-REAL-001, TC-REAL-004 |
| EV（既有planned） | EV-UI-002, EV-SDK-001 |
| 固定report入口 | reports/runs/<run_id>/evidence-index.md；reports/runs/<run_id>/evidence/EV-UI-002.md；reports/runs/<run_id>/evidence/EV-SDK-001.md |
| machine回链 | 05 §13.1对应suite/report.json→cases/<TC-ID>--<variant_id>.json→meta/context/manifest；同一批准baseline的固定run集合 |
| 通过条件 | 当前safe节点的工作/运行/工具/提交/测试/证据独立section；typedfield/来源/条件与currentroot/alloriginalslots闭口；实际sdk层符合能力边界；所需TC参数全集/guard/负向均满足，证据scope不升级；实际正式SDK能力与TC-REAL-001/004对应参数另证 |
| 失败/缺证据 | 旧node返回拒绝；safe摘要不等验收evidence对应异常输入/竞态被错误接受或安全防护未成立；任何非法owner写入/second effect/旧回包覆写/隐藏披露；缺/failed/blocked/skipped/not_run/过期错版证据不得passed |
| 裁决影响 | P0不满足即不通过；送验baseline尚缺时保持blocked，不产生最终结论；若实际命中§11 VETO则总体强制不通过，不可waive |

#### GATE-CHAT-P-022 LoadProjectConversationLinks

| 要素 | 裁决要求 |
|---|---|
| 父AC/优先级 | AC-FR-CHAT-012 / P0 |
| 设计契约 | 03 §7/§8 LoadProjectConversationLinks同名独立卡；05 §6.2.22；CUT-P-22 |
| TC（既有planned） | TC-PROTO-043, TC-PROTO-044, TC-REAL-001, TC-REAL-004 |
| EV（既有planned） | EV-UI-003, EV-SDK-001 |
| 固定report入口 | reports/runs/<run_id>/evidence-index.md；reports/runs/<run_id>/evidence/EV-UI-003.md；reports/runs/<run_id>/evidence/EV-SDK-001.md |
| machine回链 | 05 §13.1对应suite/report.json→cases/<TC-ID>--<variant_id>.json→meta/context/manifest；同一批准baseline的固定run集合 |
| 通过条件 | 正式关系和每个target独立access；typedfield/来源/条件与currentroot/alloriginalslots闭口；实际sdk层符合能力边界；所需TC参数全集/guard/负向均满足，证据scope不升级；实际正式SDK能力与TC-REAL-001/004对应参数另证 |
| 失败/缺证据 | 解除/撤销/不同群成员不串权；本地不建binding对应异常输入/竞态被错误接受或安全防护未成立；任何非法owner写入/second effect/旧回包覆写/隐藏披露；缺/failed/blocked/skipped/not_run/过期错版证据不得passed |
| 裁决影响 | P0不满足即不通过；送验baseline尚缺时保持blocked，不产生最终结论；若实际命中§11 VETO则总体强制不通过，不可waive |

#### GATE-CHAT-P-023 LoadCompanyDirectory

| 要素 | 裁决要求 |
|---|---|
| 父AC/优先级 | AC-FR-CHAT-014 / P0 |
| 设计契约 | 03 §7/§8 LoadCompanyDirectory同名独立卡；05 §6.2.23；CUT-P-23 |
| TC（既有planned） | TC-PROTO-045, TC-PROTO-046, TC-REAL-001, TC-REAL-004 |
| EV（既有planned） | EV-UI-003, EV-SDK-001 |
| 固定report入口 | reports/runs/<run_id>/evidence-index.md；reports/runs/<run_id>/evidence/EV-UI-003.md；reports/runs/<run_id>/evidence/EV-SDK-001.md |
| machine回链 | 05 §13.1对应suite/report.json→cases/<TC-ID>--<variant_id>.json→meta/context/manifest；同一批准baseline的固定run集合 |
| 通过条件 | 正式provider人类/AI覆盖/搜索/分页；typedfield/来源/条件与currentroot/alloriginalslots闭口；实际sdk层符合能力边界；所需TC参数全集/guard/负向均满足，证据scope不升级；实际正式SDK能力与TC-REAL-001/004对应参数另证 |
| 失败/缺证据 | 覆盖未知/隐藏人数/跨querypage不合并，Identity不伪全目录对应异常输入/竞态被错误接受或安全防护未成立；任何非法owner写入/second effect/旧回包覆写/隐藏披露；缺/failed/blocked/skipped/not_run/过期错版证据不得passed |
| 裁决影响 | P0不满足即不通过；送验baseline尚缺时保持blocked，不产生最终结论；若实际命中§11 VETO则总体强制不通过，不可waive |

#### GATE-CHAT-P-024 LoadMemberContext

| 要素 | 裁决要求 |
|---|---|
| 父AC/优先级 | AC-FR-CHAT-014 / P0 |
| 设计契约 | 03 §7/§8 LoadMemberContext同名独立卡；05 §6.2.24；CUT-P-24 |
| TC（既有planned） | TC-PROTO-047, TC-PROTO-048, TC-REAL-001, TC-REAL-004 |
| EV（既有planned） | EV-UI-003, EV-SDK-001 |
| 固定report入口 | reports/runs/<run_id>/evidence-index.md；reports/runs/<run_id>/evidence/EV-UI-003.md；reports/runs/<run_id>/evidence/EV-SDK-001.md |
| machine回链 | 05 §13.1对应suite/report.json→cases/<TC-ID>--<variant_id>.json→meta/context/manifest；同一批准baseline的固定run集合 |
| 通过条件 | Identity/ProjectMember/Participant/presence独立；typedfield/来源/条件与currentroot/alloriginalslots闭口；实际sdk层符合能力边界；所需TC参数全集/guard/负向均满足，证据scope不升级；实际正式SDK能力与TC-REAL-001/004对应参数另证 |
| 失败/缺证据 | 目录可见不授予DM/项目，Runtime summary不当presence对应异常输入/竞态被错误接受或安全防护未成立；任何非法owner写入/second effect/旧回包覆写/隐藏披露；缺/failed/blocked/skipped/not_run/过期错版证据不得passed |
| 裁决影响 | P0不满足即不通过；送验baseline尚缺时保持blocked，不产生最终结论；若实际命中§11 VETO则总体强制不通过，不可waive |

#### GATE-CHAT-P-025 ConsumeFormalChange

| 要素 | 裁决要求 |
|---|---|
| 父AC/优先级 | AC-CHAT-004 / P0 |
| 设计契约 | 03 §7/§8 ConsumeFormalChange同名独立卡；05 §6.2.25；CUT-P-25 |
| TC（既有planned） | TC-PROTO-049, TC-PROTO-050, TC-REAL-001, TC-REAL-004 |
| EV（既有planned） | EV-UNIT-002, EV-SDK-001 |
| 固定report入口 | reports/runs/<run_id>/evidence-index.md；reports/runs/<run_id>/evidence/EV-UNIT-002.md；reports/runs/<run_id>/evidence/EV-SDK-001.md |
| machine回链 | 05 §13.1对应suite/report.json→cases/<TC-ID>--<variant_id>.json→meta/context/manifest；同一批准baseline的固定run集合 |
| 通过条件 | source-qualified change一次CAS更新slice/水位；typedfield/来源/条件与currentroot/alloriginalslots闭口；实际sdk层符合能力边界；所需TC参数全集/guard/负向均满足，证据scope不升级；实际正式SDK能力与TC-REAL-001/004对应参数另证 |
| 失败/缺证据 | duplicate无二次apply；gap/乱序/oldslot无fresh对应异常输入/竞态被错误接受或安全防护未成立；任何非法owner写入/second effect/旧回包覆写/隐藏披露；缺/failed/blocked/skipped/not_run/过期错版证据不得passed |
| 裁决影响 | P0不满足即不通过；送验baseline尚缺时保持blocked，不产生最终结论；若实际命中§11 VETO则总体强制不通过，不可waive |

#### GATE-CHAT-P-026 ConsumeCommandReceiptOrResult

| 要素 | 裁决要求 |
|---|---|
| 父AC/优先级 | AC-CHAT-003 / P0 |
| 设计契约 | 03 §7/§8 ConsumeCommandReceiptOrResult同名独立卡；05 §6.2.26；CUT-P-26 |
| TC（既有planned） | TC-PROTO-051, TC-PROTO-052, TC-REAL-001, TC-REAL-004 |
| EV（既有planned） | EV-UNIT-001, EV-SDK-001 |
| 固定report入口 | reports/runs/<run_id>/evidence-index.md；reports/runs/<run_id>/evidence/EV-UNIT-001.md；reports/runs/<run_id>/evidence/EV-SDK-001.md |
| machine回链 | 05 §13.1对应suite/report.json→cases/<TC-ID>--<variant_id>.json→meta/context/manifest；同一批准baseline的固定run集合 |
| 通过条件 | formalauthority/correlation后result gate；typedfield/来源/条件与currentroot/alloriginalslots闭口；实际sdk层符合能力边界；所需TC参数全集/guard/负向均满足，证据scope不升级；实际正式SDK能力与TC-REAL-001/004对应参数另证 |
| 失败/缺证据 | 普通receipt/WS/AG-UI ACK/fake不确认真实attempt对应异常输入/竞态被错误接受或安全防护未成立；任何非法owner写入/second effect/旧回包覆写/隐藏披露；缺/failed/blocked/skipped/not_run/过期错版证据不得passed |
| 裁决影响 | P0不满足即不通过；送验baseline尚缺时保持blocked，不产生最终结论；若实际命中§11 VETO则总体强制不通过，不可waive |

#### GATE-CHAT-P-027 ConsumeResumeResult

| 要素 | 裁决要求 |
|---|---|
| 父AC/优先级 | AC-CHAT-004 / P0 |
| 设计契约 | 03 §7/§8 ConsumeResumeResult同名独立卡；05 §6.2.27；CUT-P-27 |
| TC（既有planned） | TC-PROTO-053, TC-PROTO-054, TC-REAL-001, TC-REAL-004 |
| EV（既有planned） | EV-UNIT-002, EV-SDK-001 |
| 固定report入口 | reports/runs/<run_id>/evidence-index.md；reports/runs/<run_id>/evidence/EV-UNIT-002.md；reports/runs/<run_id>/evidence/EV-SDK-001.md |
| machine回链 | 05 §13.1对应suite/report.json→cases/<TC-ID>--<variant_id>.json→meta/context/manifest；同一批准baseline的固定run集合 |
| 通过条件 | current source/recovery+completecoverage才fresh；typedfield/来源/条件与currentroot/alloriginalslots闭口；实际sdk层符合能力边界；所需TC参数全集/guard/负向均满足，证据scope不升级；实际正式SDK能力与TC-REAL-001/004对应参数另证 |
| 失败/缺证据 | partial/错recovery/旧slots不fresh对应异常输入/竞态被错误接受或安全防护未成立；任何非法owner写入/second effect/旧回包覆写/隐藏披露；缺/failed/blocked/skipped/not_run/过期错版证据不得passed |
| 裁决影响 | P0不满足即不通过；送验baseline尚缺时保持blocked，不产生最终结论；若实际命中§11 VETO则总体强制不通过，不可waive |

#### GATE-CHAT-P-028 ConsumeVisibilityChange

| 要素 | 裁决要求 |
|---|---|
| 父AC/优先级 | AC-CHAT-004 / P0 |
| 设计契约 | 03 §7/§8 ConsumeVisibilityChange同名独立卡；05 §6.2.28；CUT-P-28 |
| TC（既有planned） | TC-PROTO-055, TC-PROTO-056, TC-REAL-001, TC-REAL-004 |
| EV（既有planned） | EV-UNIT-002, EV-SDK-001 |
| 固定report入口 | reports/runs/<run_id>/evidence-index.md；reports/runs/<run_id>/evidence/EV-UNIT-002.md；reports/runs/<run_id>/evidence/EV-SDK-001.md |
| machine回链 | 05 §13.1对应suite/report.json→cases/<TC-ID>--<variant_id>.json→meta/context/manifest；同一批准baseline的固定run集合 |
| 通过条件 | 当前scope/source正式revoke先隐藏失效；typedfield/来源/条件与currentroot/alloriginalslots闭口；实际sdk层符合能力边界；所需TC参数全集/guard/负向均满足，证据scope不升级；实际正式SDK能力与TC-REAL-001/004对应参数另证 |
| 失败/缺证据 | closed node仍被遮蔽；stop/delete失败不回滚对应异常输入/竞态被错误接受或安全防护未成立；任何非法owner写入/second effect/旧回包覆写/隐藏披露；缺/failed/blocked/skipped/not_run/过期错版证据不得passed |
| 裁决影响 | P0不满足即不通过；送验baseline尚缺时保持blocked，不产生最终结论；若实际命中§11 VETO则总体强制不通过，不可waive |

#### GATE-CHAT-P-029 ConsumeMaterialRevisionChange

| 要素 | 裁决要求 |
|---|---|
| 父AC/优先级 | AC-CHAT-004 / P0 |
| 设计契约 | 03 §7/§8 ConsumeMaterialRevisionChange同名独立卡；05 §6.2.29；CUT-P-29 |
| TC（既有planned） | TC-PROTO-057, TC-PROTO-058, TC-REAL-001, TC-REAL-004 |
| EV（既有planned） | EV-UNIT-002, EV-SDK-001 |
| 固定report入口 | reports/runs/<run_id>/evidence-index.md；reports/runs/<run_id>/evidence/EV-UNIT-002.md；reports/runs/<run_id>/evidence/EV-SDK-001.md |
| machine回链 | 05 §13.1对应suite/report.json→cases/<TC-ID>--<variant_id>.json→meta/context/manifest；同一批准baseline的固定run集合 |
| 通过条件 | 仅matchedsource材料stale/parent失效；typedfield/来源/条件与currentroot/alloriginalslots闭口；实际sdk层符合能力边界；所需TC参数全集/guard/负向均满足，证据scope不升级；实际正式SDK能力与TC-REAL-001/004对应参数另证 |
| 失败/缺证据 | 跨source不覆盖，旧revision不复活graph对应异常输入/竞态被错误接受或安全防护未成立；任何非法owner写入/second effect/旧回包覆写/隐藏披露；缺/failed/blocked/skipped/not_run/过期错版证据不得passed |
| 裁决影响 | P0不满足即不通过；送验baseline尚缺时保持blocked，不产生最终结论；若实际命中§11 VETO则总体强制不通过，不可waive |

#### GATE-CHAT-P-030 ConsumeShellLifecycle

| 要素 | 裁决要求 |
|---|---|
| 父AC/优先级 | AC-CHAT-004 / P0 |
| 设计契约 | 03 §7/§8 ConsumeShellLifecycle同名独立卡；05 §6.2.30；CUT-P-30 |
| TC（既有planned） | TC-PROTO-059, TC-PROTO-060, TC-REAL-002 |
| EV（既有planned） | EV-UNIT-002, EV-HOST-001 |
| 固定report入口 | reports/runs/<run_id>/evidence-index.md；reports/runs/<run_id>/evidence/EV-UNIT-002.md；reports/runs/<run_id>/evidence/EV-HOST-001.md |
| machine回链 | 05 §13.1对应suite/report.json→cases/<TC-ID>--<variant_id>.json→meta/context/manifest；同一批准baseline的固定run集合 |
| 通过条件 | 可信host offline/background/closing技术消费；typedfield/来源/条件与currentroot/alloriginalslots闭口；实际host层符合能力边界；所需TC参数全集/guard/负向均满足，证据scope不升级；真实Desktop批准矩阵与TC-REAL-002另证 |
| 失败/缺证据 | 窗口ACK/closing不取消owner或确认业务对应异常输入/竞态被错误接受或安全防护未成立；任何非法owner写入/second effect/旧回包覆写/隐藏披露；缺/failed/blocked/skipped/not_run/过期错版证据不得passed |
| 裁决影响 | P0不满足即不通过；送验baseline尚缺时保持blocked，不产生最终结论；若实际命中§11 VETO则总体强制不通过，不可waive |

#### GATE-CHAT-P-031 ConsumeEvictionTrigger

| 要素 | 裁决要求 |
|---|---|
| 父AC/优先级 | AC-CHAT-004 / P0 |
| 设计契约 | 03 §7/§8 ConsumeEvictionTrigger同名独立卡；05 §6.2.31；CUT-P-31 |
| TC（既有planned） | TC-PROTO-061, TC-PROTO-062 |
| EV（既有planned） | EV-UNIT-004 |
| 固定report入口 | reports/runs/<run_id>/evidence-index.md；reports/runs/<run_id>/evidence/EV-UNIT-004.md |
| machine回链 | 05 §13.1对应suite/report.json→cases/<TC-ID>--<variant_id>.json→meta/context/manifest；同一批准baseline的固定run集合 |
| 通过条件 | qualifiedclearreason→先hide再repo delete；typedfield/来源/条件与currentroot/alloriginalslots闭口；实际本地合同层符合能力边界；所需TC参数全集/guard/负向均满足，证据scope不升级；本地contract证据可验证，不替代必要real层 |
| 失败/缺证据 | 非法触发/冲突delete不能cleared对应异常输入/竞态被错误接受或安全防护未成立；任何非法owner写入/second effect/旧回包覆写/隐藏披露；缺/failed/blocked/skipped/not_run/过期错版证据不得passed |
| 裁决影响 | P0不满足即不通过；送验baseline尚缺时保持blocked，不产生最终结论；若实际命中§11 VETO则总体强制不通过，不可waive |

#### GATE-CHAT-P-032 ClientDiagnosticHandoffRequested

| 要素 | 裁决要求 |
|---|---|
| 父AC/优先级 | AC-FR-CHAT-009 / P0 |
| 设计契约 | 03 §7/§8 ClientDiagnosticHandoffRequested同名独立卡；05 §6.2.32；CUT-P-32 |
| TC（既有planned） | TC-PROTO-063, TC-PROTO-064 |
| EV（既有planned） | EV-UNIT-005 |
| 固定report入口 | reports/runs/<run_id>/evidence-index.md；reports/runs/<run_id>/evidence/EV-UNIT-005.md |
| machine回链 | 05 §13.1对应suite/report.json→cases/<TC-ID>--<variant_id>.json→meta/context/manifest；同一批准baseline的固定run集合 |
| 通过条件 | 显式current低敏六字段，合格sinkreceipt；typedfield/来源/条件与currentroot/alloriginalslots闭口；实际本地合同层符合能力边界；所需TC参数全集/guard/负向均满足，证据scope不升级；本地contract证据可验证，不替代必要real层 |
| 失败/缺证据 | disabled零IO/额外secret字段拒绝/unknown不重送对应异常输入/竞态被错误接受或安全防护未成立；任何非法owner写入/second effect/旧回包覆写/隐藏披露；缺/failed/blocked/skipped/not_run/过期错版证据不得passed |
| 裁决影响 | P0不满足即不通过；送验baseline尚缺时保持blocked，不产生最终结论；若实际命中§11 VETO则总体强制不通过，不可waive |

#### GATE-CHAT-P-033 ClientSupportContextRequested

| 要素 | 裁决要求 |
|---|---|
| 父AC/优先级 | AC-FR-CHAT-009 / P0 |
| 设计契约 | 03 §7/§8 ClientSupportContextRequested同名独立卡；05 §6.2.33；CUT-P-33 |
| TC（既有planned） | TC-PROTO-065, TC-PROTO-066 |
| EV（既有planned） | EV-UNIT-005 |
| 固定report入口 | reports/runs/<run_id>/evidence-index.md；reports/runs/<run_id>/evidence/EV-UNIT-005.md |
| machine回链 | 05 §13.1对应suite/report.json→cases/<TC-ID>--<variant_id>.json→meta/context/manifest；同一批准baseline的固定run集合 |
| 通过条件 | 显式支持分类/有限reason构造；typedfield/来源/条件与currentroot/alloriginalslots闭口；实际本地合同层符合能力边界；所需TC参数全集/guard/负向均满足，证据scope不升级；本地contract证据可验证，不替代必要real层 |
| 失败/缺证据 | raw logs/query/actorref/截图不能加入payload对应异常输入/竞态被错误接受或安全防护未成立；任何非法owner写入/second effect/旧回包覆写/隐藏披露；缺/failed/blocked/skipped/not_run/过期错版证据不得passed |
| 裁决影响 | P0不满足即不通过；送验baseline尚缺时保持blocked，不产生最终结论；若实际命中§11 VETO则总体强制不通过，不可waive |

#### GATE-CHAT-P-034 ResumeChangeContext

| 要素 | 裁决要求 |
|---|---|
| 父AC/优先级 | AC-CHAT-004 / P0 |
| 设计契约 | 03 §7/§8 ResumeChangeContext同名独立卡；05 §6.2.34；CUT-P-34 |
| TC（既有planned） | TC-PROTO-067, TC-PROTO-068, TC-REAL-001, TC-REAL-004 |
| EV（既有planned） | EV-UNIT-002, EV-SDK-001 |
| 固定report入口 | reports/runs/<run_id>/evidence-index.md；reports/runs/<run_id>/evidence/EV-UNIT-002.md；reports/runs/<run_id>/evidence/EV-SDK-001.md |
| machine回链 | 05 §13.1对应suite/report.json→cases/<TC-ID>--<variant_id>.json→meta/context/manifest；同一批准baseline的固定run集合 |
| 通过条件 | 每source single-flight resume；typedfield/来源/条件与currentroot/alloriginalslots闭口；实际sdk层符合能力边界；所需TC参数全集/guard/负向均满足，证据scope不升级；实际正式SDK能力与TC-REAL-001/004对应参数另证 |
| 失败/缺证据 | 双resume/旧recovery/断线ACK不fresh对应异常输入/竞态被错误接受或安全防护未成立；任何非法owner写入/second effect/旧回包覆写/隐藏披露；缺/failed/blocked/skipped/not_run/过期错版证据不得passed |
| 裁决影响 | P0不满足即不通过；送验baseline尚缺时保持blocked，不产生最终结论；若实际命中§11 VETO则总体强制不通过，不可waive |

#### GATE-CHAT-P-035 RequeryAfterGap

| 要素 | 裁决要求 |
|---|---|
| 父AC/优先级 | AC-CHAT-004 / P0 |
| 设计契约 | 03 §7/§8 RequeryAfterGap同名独立卡；05 §6.2.35；CUT-P-35 |
| TC（既有planned） | TC-PROTO-069, TC-PROTO-070, TC-REAL-001, TC-REAL-004 |
| EV（既有planned） | EV-UNIT-002, EV-SDK-001 |
| 固定report入口 | reports/runs/<run_id>/evidence-index.md；reports/runs/<run_id>/evidence/EV-UNIT-002.md；reports/runs/<run_id>/evidence/EV-SDK-001.md |
| machine回链 | 05 §13.1对应suite/report.json→cases/<TC-ID>--<variant_id>.json→meta/context/manifest；同一批准baseline的固定run集合 |
| 通过条件 | 新qualifiedsnapshot覆盖相应source；typedfield/来源/条件与currentroot/alloriginalslots闭口；实际sdk层符合能力边界；所需TC参数全集/guard/负向均满足，证据scope不升级；实际正式SDK能力与TC-REAL-001/004对应参数另证 |
| 失败/缺证据 | 缺coverage不能清gap/吞变更对应异常输入/竞态被错误接受或安全防护未成立；任何非法owner写入/second effect/旧回包覆写/隐藏披露；缺/failed/blocked/skipped/not_run/过期错版证据不得passed |
| 裁决影响 | P0不满足即不通过；送验baseline尚缺时保持blocked，不产生最终结论；若实际命中§11 VETO则总体强制不通过，不可waive |

#### GATE-CHAT-P-036 ResolveUnknownAttempt

| 要素 | 裁决要求 |
|---|---|
| 父AC/优先级 | AC-CHAT-003 / P0 |
| 设计契约 | 03 §7/§8 ResolveUnknownAttempt同名独立卡；05 §6.2.36；CUT-P-36 |
| TC（既有planned） | TC-PROTO-071, TC-PROTO-072, TC-REAL-001, TC-REAL-004 |
| EV（既有planned） | EV-UNIT-001, EV-SDK-001 |
| 固定report入口 | reports/runs/<run_id>/evidence-index.md；reports/runs/<run_id>/evidence/EV-UNIT-001.md；reports/runs/<run_id>/evidence/EV-SDK-001.md |
| machine回链 | 05 §13.1对应suite/report.json→cases/<TC-ID>--<variant_id>.json→meta/context/manifest；同一批准baseline的固定run集合 |
| 通过条件 | 只formalprobe→合法结果轴；typedfield/来源/条件与currentroot/alloriginalslots闭口；实际sdk层符合能力边界；所需TC参数全集/guard/负向均满足，证据scope不升级；实际正式SDK能力与TC-REAL-001/004对应参数另证 |
| 失败/缺证据 | not_found/timeout不自动dispatch对应异常输入/竞态被错误接受或安全防护未成立；任何非法owner写入/second effect/旧回包覆写/隐藏披露；缺/failed/blocked/skipped/not_run/过期错版证据不得passed |
| 裁决影响 | P0不满足即不通过；送验baseline尚缺时保持blocked，不产生最终结论；若实际命中§11 VETO则总体强制不通过，不可waive |

#### GATE-CHAT-P-037 RefreshStaleMaterial

| 要素 | 裁决要求 |
|---|---|
| 父AC/优先级 | AC-CHAT-004 / P0 |
| 设计契约 | 03 §7/§8 RefreshStaleMaterial同名独立卡；05 §6.2.37；CUT-P-37 |
| TC（既有planned） | TC-PROTO-073, TC-PROTO-074, TC-REAL-001, TC-REAL-004 |
| EV（既有planned） | EV-UNIT-002, EV-SDK-001 |
| 固定report入口 | reports/runs/<run_id>/evidence-index.md；reports/runs/<run_id>/evidence/EV-UNIT-002.md；reports/runs/<run_id>/evidence/EV-SDK-001.md |
| machine回链 | 05 §13.1对应suite/report.json→cases/<TC-ID>--<variant_id>.json→meta/context/manifest；同一批准baseline的固定run集合 |
| 通过条件 | newcurrent source材料/marker；typedfield/来源/条件与currentroot/alloriginalslots闭口；实际sdk层符合能力边界；所需TC参数全集/guard/负向均满足，证据scope不升级；实际正式SDK能力与TC-REAL-001/004对应参数另证 |
| 失败/缺证据 | revoked旧ref不refresh恢复权限对应异常输入/竞态被错误接受或安全防护未成立；任何非法owner写入/second effect/旧回包覆写/隐藏披露；缺/failed/blocked/skipped/not_run/过期错版证据不得passed |
| 裁决影响 | P0不满足即不通过；送验baseline尚缺时保持blocked，不产生最终结论；若实际命中§11 VETO则总体强制不通过，不可waive |

#### GATE-CHAT-P-038 RestoreAfterShellRestart

| 要素 | 裁决要求 |
|---|---|
| 父AC/优先级 | AC-CHAT-004 / P0 |
| 设计契约 | 03 §7/§8 RestoreAfterShellRestart同名独立卡；05 §6.2.38；CUT-P-38 |
| TC（既有planned） | TC-PROTO-075, TC-PROTO-076, TC-REAL-001, TC-REAL-004 |
| EV（既有planned） | EV-UNIT-002, EV-SDK-001 |
| 固定report入口 | reports/runs/<run_id>/evidence-index.md；reports/runs/<run_id>/evidence/EV-UNIT-002.md；reports/runs/<run_id>/evidence/EV-SDK-001.md |
| machine回链 | 05 §13.1对应suite/report.json→cases/<TC-ID>--<variant_id>.json→meta/context/manifest；同一批准baseline的固定run集合 |
| 通过条件 | safe locator新epoch重新入口/正式read；typedfield/来源/条件与currentroot/alloriginalslots闭口；实际sdk层符合能力边界；所需TC参数全集/guard/负向均满足，证据scope不升级；实际正式SDK能力与TC-REAL-001/004对应参数另证 |
| 失败/缺证据 | 旧confirmed/access/handle不恢复，memory无durable承诺对应异常输入/竞态被错误接受或安全防护未成立；任何非法owner写入/second effect/旧回包覆写/隐藏披露；缺/failed/blocked/skipped/not_run/过期错版证据不得passed |
| 裁决影响 | P0不满足即不通过；送验baseline尚缺时保持blocked，不产生最终结论；若实际命中§11 VETO则总体强制不通过，不可waive |

#### GATE-CHAT-P-039 PersistLocalProjection

| 要素 | 裁决要求 |
|---|---|
| 父AC/优先级 | AC-CHAT-004 / P0 |
| 设计契约 | 03 §7/§8 PersistLocalProjection同名独立卡；05 §6.2.39；CUT-P-39 |
| TC（既有planned） | TC-PROTO-077, TC-PROTO-078 |
| EV（既有planned） | EV-UNIT-004 |
| 固定report入口 | reports/runs/<run_id>/evidence-index.md；reports/runs/<run_id>/evidence/EV-UNIT-004.md |
| machine回链 | 05 §13.1对应suite/report.json→cases/<TC-ID>--<variant_id>.json→meta/context/manifest；同一批准baseline的固定run集合 |
| 通过条件 | 当前fence/partition/entry版memory保存；typedfield/来源/条件与currentroot/alloriginalslots闭口；实际本地合同层符合能力边界；所需TC参数全集/guard/负向均满足，证据scope不升级；本地contract证据可验证，不替代必要real层 |
| 失败/缺证据 | pending save-after-revoke拒绝，正文/secret不disk对应异常输入/竞态被错误接受或安全防护未成立；任何非法owner写入/second effect/旧回包覆写/隐藏披露；缺/failed/blocked/skipped/not_run/过期错版证据不得passed |
| 裁决影响 | P0不满足即不通过；送验baseline尚缺时保持blocked，不产生最终结论；若实际命中§11 VETO则总体强制不通过，不可waive |

#### GATE-CHAT-P-040 EvictLocalMaterial

| 要素 | 裁决要求 |
|---|---|
| 父AC/优先级 | AC-CHAT-004 / P0 |
| 设计契约 | 03 §7/§8 EvictLocalMaterial同名独立卡；05 §6.2.40；CUT-P-40 |
| TC（既有planned） | TC-PROTO-079, TC-PROTO-080 |
| EV（既有planned） | EV-UNIT-004 |
| 固定report入口 | reports/runs/<run_id>/evidence-index.md；reports/runs/<run_id>/evidence/EV-UNIT-004.md |
| machine回链 | 05 §13.1对应suite/report.json→cases/<TC-ID>--<variant_id>.json→meta/context/manifest；同一批准baseline的固定run集合 |
| 通过条件 | deleted/already_absent→memorycleared；typedfield/来源/条件与currentroot/alloriginalslots闭口；实际本地合同层符合能力边界；所需TC参数全集/guard/负向均满足，证据scope不升级；本地contract证据可验证，不替代必要real层 |
| 失败/缺证据 | storage/conflict失败restricted仍隐藏对应异常输入/竞态被错误接受或安全防护未成立；任何非法owner写入/second effect/旧回包覆写/隐藏披露；缺/failed/blocked/skipped/not_run/过期错版证据不得passed |
| 裁决影响 | P0不满足即不通过；送验baseline尚缺时保持blocked，不产生最终结论；若实际命中§11 VETO则总体强制不通过，不可waive |

#### GATE-CHAT-P-041 EmitDiagnosticHandoff

| 要素 | 裁决要求 |
|---|---|
| 父AC/优先级 | AC-FR-CHAT-009 / P0 |
| 设计契约 | 03 §7/§8 EmitDiagnosticHandoff同名独立卡；05 §6.2.41；CUT-P-41 |
| TC（既有planned） | TC-PROTO-081, TC-PROTO-082 |
| EV（既有planned） | EV-UNIT-005 |
| 固定report入口 | reports/runs/<run_id>/evidence-index.md；reports/runs/<run_id>/evidence/EV-UNIT-005.md |
| machine回链 | 05 §13.1对应suite/report.json→cases/<TC-ID>--<variant_id>.json→meta/context/manifest；同一批准baseline的固定run集合 |
| 通过条件 | 显式approved input按mode交付；typedfield/来源/条件与currentroot/alloriginalslots闭口；实际本地合同层符合能力边界；所需TC参数全集/guard/负向均满足，证据scope不升级；本地contract证据可验证，不替代必要real层 |
| 失败/缺证据 | 缺sinkblocked/默认disabled/unknown no resend对应异常输入/竞态被错误接受或安全防护未成立；任何非法owner写入/second effect/旧回包覆写/隐藏披露；缺/failed/blocked/skipped/not_run/过期错版证据不得passed |
| 裁决影响 | P0不满足即不通过；送验baseline尚缺时保持blocked，不产生最终结论；若实际命中§11 VETO则总体强制不通过，不可waive |

#### GATE-CHAT-P-042 NavigateProjectContext

| 要素 | 裁决要求 |
|---|---|
| 父AC/优先级 | AC-FR-CHAT-011 / P0 |
| 设计契约 | 03 §7/§8 NavigateProjectContext同名独立卡；05 §6.2.42；CUT-P-42 |
| TC（既有planned） | TC-PROTO-083, TC-PROTO-084 |
| EV（既有planned） | EV-UI-002 |
| 固定report入口 | reports/runs/<run_id>/evidence-index.md；reports/runs/<run_id>/evidence/EV-UI-002.md |
| machine回链 | 05 §13.1对应suite/report.json→cases/<TC-ID>--<variant_id>.json→meta/context/manifest；同一批准baseline的固定run集合 |
| 通过条件 | 五tab和safe stage/node局部选择；typedfield/来源/条件与currentroot/alloriginalslots闭口；实际本地合同层符合能力边界；所需TC参数全集/guard/负向均满足，证据scope不升级；本地contract证据可验证，不替代必要real层 |
| 失败/缺证据 | 旧parent/hiddennode/错误project拒绝，不能绑定群聊对应异常输入/竞态被错误接受或安全防护未成立；任何非法owner写入/second effect/旧回包覆写/隐藏披露；缺/failed/blocked/skipped/not_run/过期错版证据不得passed |
| 裁决影响 | P0不满足即不通过；送验baseline尚缺时保持blocked，不产生最终结论；若实际命中§11 VETO则总体强制不通过，不可waive |

#### GATE-CHAT-P-043 UpdateDirectorySearch

| 要素 | 裁决要求 |
|---|---|
| 父AC/优先级 | AC-FR-CHAT-014 / P0 |
| 设计契约 | 03 §7/§8 UpdateDirectorySearch同名独立卡；05 §6.2.43；CUT-P-43 |
| TC（既有planned） | TC-PROTO-085, TC-PROTO-086 |
| EV（既有planned） | EV-UI-003 |
| 固定report入口 | reports/runs/<run_id>/evidence-index.md；reports/runs/<run_id>/evidence/EV-UI-003.md |
| machine回链 | 05 §13.1对应suite/report.json→cases/<TC-ID>--<variant_id>.json→meta/context/manifest；同一批准baseline的固定run集合 |
| 通过条件 | 新querygeneration登记slot并清旧page；typedfield/来源/条件与currentroot/alloriginalslots闭口；实际本地合同层符合能力边界；所需TC参数全集/guard/负向均满足，证据scope不升级；本地contract证据可验证，不替代必要real层 |
| 失败/缺证据 | rapidsearch late results/旧cursor不能覆写对应异常输入/竞态被错误接受或安全防护未成立；任何非法owner写入/second effect/旧回包覆写/隐藏披露；缺/failed/blocked/skipped/not_run/过期错版证据不得passed |
| 裁决影响 | P0不满足即不通过；送验baseline尚缺时保持blocked，不产生最终结论；若实际命中§11 VETO则总体强制不通过，不可waive |

### 7.3 未就绪与同步成功

SDK未提供publiccapability、owner资格/opaque顺序/幂等窗口未闭：interface实际gate blocked，localnegative可证dependency_unbound/authority_missing与zero unsafeIO，不满足positive。不能用“有条件通过”代替缺P0能力。
正式同步成功只意味着该source/view/result在当前SDK合同、coverage与visibility范围内被客户端安全消费。它不意味跨owner原子snapshot、业务多端exactlyonce、draftsync或owner全局完成。
诊断正式sink只在mode启用并explicituser请求时验证；未启用边界zeroIO符合合同，但不可宣称sink实际接通。native安全open/storageexecution未qualified保持blocked，Lifecycle/Accessibility有限probe不授业务资格。

### 本Step逐项停审（设计过程记录）

每项独立完成来源→contract→TC→EV/report→pass/fail→裁决影响后才处理下一项。下表通过仅代表规则审查；实际TC/EV未生成、实际验收未开始。

| 验收项 | 审查项 | local gate | 外部缺口 |
|---|---|---|---|
| GATE-CHAT-P-001 | AC-CHAT-003；03 §7/§8 SubmitConversationIntent同名独立卡；05 §6.2.1；CUT-P-01；TC/EV存在且scope/路径明确；pass/fail可判定，P0无waiver | pass_with_upstream_blockers | build/run/实际证据仍waiting，real能力sdk仍blocked |
| GATE-CHAT-P-002 | AC-CHAT-003；03 §7/§8 SubmitGovernanceIntent同名独立卡；05 §6.2.2；CUT-P-02；TC/EV存在且scope/路径明确；pass/fail可判定，P0无waiver | pass_with_upstream_blockers | build/run/实际证据仍waiting，real能力sdk仍blocked |
| GATE-CHAT-P-003 | AC-CHAT-002；03 §7/§8 RequestSafePreview同名独立卡；05 §6.2.3；CUT-P-03；TC/EV存在且scope/路径明确；pass/fail可判定，P0无waiver | pass_with_upstream_blockers | build/run/实际证据仍waiting，real能力sdk仍blocked |
| GATE-CHAT-P-004 | AC-CHAT-004；03 §7/§8 AcknowledgeLocalRecoveryAction同名独立卡；05 §6.2.4；CUT-P-04；TC/EV存在且scope/路径明确；pass/fail可判定，P0无waiver | pass_with_upstream_blockers | build/run/实际证据仍waiting，real能力sdk仍blocked |
| GATE-CHAT-P-005 | AC-CHAT-001；03 §7/§8 ResolveEntryAccess同名独立卡；05 §6.2.5；CUT-P-05；TC/EV存在且scope/路径明确；pass/fail可判定，P0无waiver | pass_with_upstream_blockers | build/run/实际证据仍waiting，real能力sdk仍blocked |
| GATE-CHAT-P-006 | AC-CHAT-002；03 §7/§8 LoadConversationSurface同名独立卡；05 §6.2.6；CUT-P-06；TC/EV存在且scope/路径明确；pass/fail可判定，P0无waiver | pass_with_upstream_blockers | build/run/实际证据仍waiting，real能力sdk仍blocked |
| GATE-CHAT-P-007 | AC-CHAT-002；03 §7/§8 LoadTurnPage同名独立卡；05 §6.2.7；CUT-P-07；TC/EV存在且scope/路径明确；pass/fail可判定，P0无waiver | pass_with_upstream_blockers | build/run/实际证据仍waiting，real能力sdk仍blocked |
| GATE-CHAT-P-008 | AC-CHAT-002；03 §7/§8 LoadOwnerSummary同名独立卡；05 §6.2.8；CUT-P-08；TC/EV存在且scope/路径明确；pass/fail可判定，P0无waiver | pass_with_upstream_blockers | build/run/实际证据仍waiting，real能力sdk仍blocked |
| GATE-CHAT-P-009 | AC-CHAT-002；03 §7/§8 LoadArtifactPreview同名独立卡；05 §6.2.9；CUT-P-09；TC/EV存在且scope/路径明确；pass/fail可判定，P0无waiver | pass_with_upstream_blockers | build/run/实际证据仍waiting，real能力sdk仍blocked |
| GATE-CHAT-P-010 | AC-CHAT-003；03 §7/§8 LoadIntentCapability同名独立卡；05 §6.2.10；CUT-P-10；TC/EV存在且scope/路径明确；pass/fail可判定，P0无waiver | pass_with_upstream_blockers | build/run/实际证据仍waiting，real能力sdk仍blocked |
| GATE-CHAT-P-011 | AC-CHAT-003；03 §7/§8 ProbeCommandAttempt同名独立卡；05 §6.2.11；CUT-P-11；TC/EV存在且scope/路径明确；pass/fail可判定，P0无waiver | pass_with_upstream_blockers | build/run/实际证据仍waiting，real能力sdk仍blocked |
| GATE-CHAT-P-012 | AC-CHAT-004；03 §7/§8 LoadResumeContext同名独立卡；05 §6.2.12；CUT-P-12；TC/EV存在且scope/路径明确；pass/fail可判定，P0无waiver | pass_with_upstream_blockers | build/run/实际证据仍waiting，real能力sdk仍blocked |
| GATE-CHAT-P-013 | AC-CHAT-002；03 §7/§8 LoadLocalProjection同名独立卡；05 §6.2.13；CUT-P-13；TC/EV存在且scope/路径明确；pass/fail可判定，P0无waiver | pass_with_upstream_blockers | build/run/实际证据仍waiting，real能力不借fixture推断 |
| GATE-CHAT-P-014 | AC-CHAT-002；03 §7/§8 LoadDraft同名独立卡；05 §6.2.14；CUT-P-14；TC/EV存在且scope/路径明确；pass/fail可判定，P0无waiver | pass_with_upstream_blockers | build/run/实际证据仍waiting，real能力不借fixture推断 |
| GATE-CHAT-P-015 | AC-CHAT-002；03 §7/§8 ProbePlatformCapability同名独立卡；05 §6.2.15；CUT-P-15；TC/EV存在且scope/路径明确；pass/fail可判定，P0无waiver | pass_with_upstream_blockers | build/run/实际证据仍waiting，real能力host仍blocked |
| GATE-CHAT-P-016 | AC-CHAT-002；03 §7/§8 LoadAccessibilityContext同名独立卡；05 §6.2.16；CUT-P-16；TC/EV存在且scope/路径明确；pass/fail可判定，P0无waiver | pass_with_upstream_blockers | build/run/实际证据仍waiting，real能力at仍blocked |
| GATE-CHAT-P-017 | AC-CHAT-002；03 §7/§8 LoadProjectList同名独立卡；05 §6.2.17；CUT-P-17；TC/EV存在且scope/路径明确；pass/fail可判定，P0无waiver | pass_with_upstream_blockers | build/run/实际证据仍waiting，real能力sdk仍blocked |
| GATE-CHAT-P-018 | AC-FR-CHAT-011；03 §7/§8 LoadProjectDetail同名独立卡；05 §6.2.18；CUT-P-18；TC/EV存在且scope/路径明确；pass/fail可判定，P0无waiver | pass_with_upstream_blockers | build/run/实际证据仍waiting，real能力sdk仍blocked |
| GATE-CHAT-P-019 | AC-FR-CHAT-011；03 §7/§8 LoadProjectProcessFlow同名独立卡；05 §6.2.19；CUT-P-19；TC/EV存在且scope/路径明确；pass/fail可判定，P0无waiver | pass_with_upstream_blockers | build/run/实际证据仍waiting，real能力sdk仍blocked |
| GATE-CHAT-P-020 | AC-FR-CHAT-011；03 §7/§8 LoadStageProcessFlow同名独立卡；05 §6.2.20；CUT-P-20；TC/EV存在且scope/路径明确；pass/fail可判定，P0无waiver | pass_with_upstream_blockers | build/run/实际证据仍waiting，real能力sdk仍blocked |
| GATE-CHAT-P-021 | AC-FR-CHAT-011；03 §7/§8 LoadProcessNodeDetail同名独立卡；05 §6.2.21；CUT-P-21；TC/EV存在且scope/路径明确；pass/fail可判定，P0无waiver | pass_with_upstream_blockers | build/run/实际证据仍waiting，real能力sdk仍blocked |
| GATE-CHAT-P-022 | AC-FR-CHAT-012；03 §7/§8 LoadProjectConversationLinks同名独立卡；05 §6.2.22；CUT-P-22；TC/EV存在且scope/路径明确；pass/fail可判定，P0无waiver | pass_with_upstream_blockers | build/run/实际证据仍waiting，real能力sdk仍blocked |
| GATE-CHAT-P-023 | AC-FR-CHAT-014；03 §7/§8 LoadCompanyDirectory同名独立卡；05 §6.2.23；CUT-P-23；TC/EV存在且scope/路径明确；pass/fail可判定，P0无waiver | pass_with_upstream_blockers | build/run/实际证据仍waiting，real能力sdk仍blocked |
| GATE-CHAT-P-024 | AC-FR-CHAT-014；03 §7/§8 LoadMemberContext同名独立卡；05 §6.2.24；CUT-P-24；TC/EV存在且scope/路径明确；pass/fail可判定，P0无waiver | pass_with_upstream_blockers | build/run/实际证据仍waiting，real能力sdk仍blocked |
| GATE-CHAT-P-025 | AC-CHAT-004；03 §7/§8 ConsumeFormalChange同名独立卡；05 §6.2.25；CUT-P-25；TC/EV存在且scope/路径明确；pass/fail可判定，P0无waiver | pass_with_upstream_blockers | build/run/实际证据仍waiting，real能力sdk仍blocked |
| GATE-CHAT-P-026 | AC-CHAT-003；03 §7/§8 ConsumeCommandReceiptOrResult同名独立卡；05 §6.2.26；CUT-P-26；TC/EV存在且scope/路径明确；pass/fail可判定，P0无waiver | pass_with_upstream_blockers | build/run/实际证据仍waiting，real能力sdk仍blocked |
| GATE-CHAT-P-027 | AC-CHAT-004；03 §7/§8 ConsumeResumeResult同名独立卡；05 §6.2.27；CUT-P-27；TC/EV存在且scope/路径明确；pass/fail可判定，P0无waiver | pass_with_upstream_blockers | build/run/实际证据仍waiting，real能力sdk仍blocked |
| GATE-CHAT-P-028 | AC-CHAT-004；03 §7/§8 ConsumeVisibilityChange同名独立卡；05 §6.2.28；CUT-P-28；TC/EV存在且scope/路径明确；pass/fail可判定，P0无waiver | pass_with_upstream_blockers | build/run/实际证据仍waiting，real能力sdk仍blocked |
| GATE-CHAT-P-029 | AC-CHAT-004；03 §7/§8 ConsumeMaterialRevisionChange同名独立卡；05 §6.2.29；CUT-P-29；TC/EV存在且scope/路径明确；pass/fail可判定，P0无waiver | pass_with_upstream_blockers | build/run/实际证据仍waiting，real能力sdk仍blocked |
| GATE-CHAT-P-030 | AC-CHAT-004；03 §7/§8 ConsumeShellLifecycle同名独立卡；05 §6.2.30；CUT-P-30；TC/EV存在且scope/路径明确；pass/fail可判定，P0无waiver | pass_with_upstream_blockers | build/run/实际证据仍waiting，real能力host仍blocked |
| GATE-CHAT-P-031 | AC-CHAT-004；03 §7/§8 ConsumeEvictionTrigger同名独立卡；05 §6.2.31；CUT-P-31；TC/EV存在且scope/路径明确；pass/fail可判定，P0无waiver | pass_with_upstream_blockers | build/run/实际证据仍waiting，real能力不借fixture推断 |
| GATE-CHAT-P-032 | AC-FR-CHAT-009；03 §7/§8 ClientDiagnosticHandoffRequested同名独立卡；05 §6.2.32；CUT-P-32；TC/EV存在且scope/路径明确；pass/fail可判定，P0无waiver | pass_with_upstream_blockers | build/run/实际证据仍waiting，real能力不借fixture推断 |
| GATE-CHAT-P-033 | AC-FR-CHAT-009；03 §7/§8 ClientSupportContextRequested同名独立卡；05 §6.2.33；CUT-P-33；TC/EV存在且scope/路径明确；pass/fail可判定，P0无waiver | pass_with_upstream_blockers | build/run/实际证据仍waiting，real能力不借fixture推断 |
| GATE-CHAT-P-034 | AC-CHAT-004；03 §7/§8 ResumeChangeContext同名独立卡；05 §6.2.34；CUT-P-34；TC/EV存在且scope/路径明确；pass/fail可判定，P0无waiver | pass_with_upstream_blockers | build/run/实际证据仍waiting，real能力sdk仍blocked |
| GATE-CHAT-P-035 | AC-CHAT-004；03 §7/§8 RequeryAfterGap同名独立卡；05 §6.2.35；CUT-P-35；TC/EV存在且scope/路径明确；pass/fail可判定，P0无waiver | pass_with_upstream_blockers | build/run/实际证据仍waiting，real能力sdk仍blocked |
| GATE-CHAT-P-036 | AC-CHAT-003；03 §7/§8 ResolveUnknownAttempt同名独立卡；05 §6.2.36；CUT-P-36；TC/EV存在且scope/路径明确；pass/fail可判定，P0无waiver | pass_with_upstream_blockers | build/run/实际证据仍waiting，real能力sdk仍blocked |
| GATE-CHAT-P-037 | AC-CHAT-004；03 §7/§8 RefreshStaleMaterial同名独立卡；05 §6.2.37；CUT-P-37；TC/EV存在且scope/路径明确；pass/fail可判定，P0无waiver | pass_with_upstream_blockers | build/run/实际证据仍waiting，real能力sdk仍blocked |
| GATE-CHAT-P-038 | AC-CHAT-004；03 §7/§8 RestoreAfterShellRestart同名独立卡；05 §6.2.38；CUT-P-38；TC/EV存在且scope/路径明确；pass/fail可判定，P0无waiver | pass_with_upstream_blockers | build/run/实际证据仍waiting，real能力sdk仍blocked |
| GATE-CHAT-P-039 | AC-CHAT-004；03 §7/§8 PersistLocalProjection同名独立卡；05 §6.2.39；CUT-P-39；TC/EV存在且scope/路径明确；pass/fail可判定，P0无waiver | pass_with_upstream_blockers | build/run/实际证据仍waiting，real能力不借fixture推断 |
| GATE-CHAT-P-040 | AC-CHAT-004；03 §7/§8 EvictLocalMaterial同名独立卡；05 §6.2.40；CUT-P-40；TC/EV存在且scope/路径明确；pass/fail可判定，P0无waiver | pass_with_upstream_blockers | build/run/实际证据仍waiting，real能力不借fixture推断 |
| GATE-CHAT-P-041 | AC-FR-CHAT-009；03 §7/§8 EmitDiagnosticHandoff同名独立卡；05 §6.2.41；CUT-P-41；TC/EV存在且scope/路径明确；pass/fail可判定，P0无waiver | pass_with_upstream_blockers | build/run/实际证据仍waiting，real能力不借fixture推断 |
| GATE-CHAT-P-042 | AC-FR-CHAT-011；03 §7/§8 NavigateProjectContext同名独立卡；05 §6.2.42；CUT-P-42；TC/EV存在且scope/路径明确；pass/fail可判定，P0无waiver | pass_with_upstream_blockers | build/run/实际证据仍waiting，real能力不借fixture推断 |
| GATE-CHAT-P-043 | AC-FR-CHAT-014；03 §7/§8 UpdateDirectorySearch同名独立卡；05 §6.2.43；CUT-P-43；TC/EV存在且scope/路径明确；pass/fail可判定，P0无waiver | pass_with_upstream_blockers | build/run/实际证据仍waiting，real能力不借fixture推断 |

### 跨协议/同步门禁审计（设计过程记录）

| 审计项 | 结论/处理 |
|---|---|
| 缺contract/TC/EV/report | 本Step各项均回指既有03/04/05；无新TC/EV |
| 重复/冲突裁决 | 共用EV按TC/variant取子集；P0/VETO优先，parentAC仅聚合，不重复计通过 |
| source/状态/phase漂移 | 只当前正式值；planned/schema不是实测/结果，07boundary waiting |
| 范围越界 | 不验owner内部实现，不private API/bus；scope不足blocked，不伪real |


## 8. 回填草稿

正式06 §7回填本步§7裁决结论/表/schema；过程停审、差异和自检留本文件，不冒充实际结果。

## 9. 待确认事项

CHAT-UP001～009/WS-UP001～008/BASE001/native/OS/AT/生产预算/精确版本/来源/发布/归档继续open/blocked。角色、build、run_id、报告、actualEV、风险接受与签署均waiting；没有当前放行或readiness。

## 10. 自检及下一Step门禁

43协议各有成对TC、固定EV/path、字段与副作用/real层判据，依赖类型与未就绪处理local停审。 本地规则设计gate pass_with_upstream_blockers；允许Step8先读取台账/flow/当前产物与对应SOP，不创建其它未来Step。
