# L5-chat 06 · Step 9 非功能验收门禁

## 1. Step状态

> done / pass_with_upstream_blockers；2026-10-01。这里只定义验收规则，所有TC/EV为planned预约，无实际验收结果或签署。

## 2. 本步输入

前序Step8 local gate已通过；06 SOP Step9、书写规范5.9；00实际36AC、03契约、04配置、05TC/EV和证据schema；中间产物§5.10与真相源§7。

## 3. SOP问题回答

哪个P0指标、阈值来源、未覆盖影响及固定证据是什么？7卡和阈值表逐项，AT/native与SDK明确scope。

## 4. 当前文档问题诊断

旧性能/兼容阈值无authority；ATfake或visualsnapshot不能抵消实际核心目标失败。

## 5. 改动前后对比

| 改前 | 改后 | 原因 |
|---|---|---|
| 旧性能/兼容阈值无authority；ATfake或visualsnapshot不能抵消实际核心目标失败。 | §7结构化裁决 | 保持正式contract/TC/EV与证据能力一致 |

## 6. 验收裁决取舍与复杂度

7实际AC映射24NFR并明确行为与guard/生产budget/支持矩阵区别。逐维度gate，真实层不足是P0blocked，不设假数值。

## 7. 结构化中间产物

### 9.1 阈值与scope

00实际7个AC-NFR分别覆盖24NFR；BASE001不存在AC-NFR008～024，本文不创造。行为底线来自00/03；八数字guard来自04，生产性能/内存/长时/兼容预算必须实际authority+测量，不拿示例或绝对上限当生产通过值。
未实测非功能项列§13遗留/阻塞处理；P0适用项未测不能风险接受为通过。候选OS/AT不当已批准支持矩阵，未来Mobile不是V1通过对象。

#### GATE-CHAT-NFR-001 响应/请求有界

| 要素 | 裁决要求 |
|---|---|
| 父AC/优先级 | AC-NFR-CHAT-001 / P0 |
| 设计契约 | 00 §13/14.3 NFR-CHAT-001～003；03相关§5～15；04 guard/source；05 §5.4/§10/12～14 |
| TC（既有planned） | TC-SAFE-009, TC-SAFE-010, TC-CONC-011, TC-CONC-013, TC-PROTO-072 |
| EV（既有planned） | EV-UNIT-001, EV-UI-001, EV-UNIT-002 |
| 固定report入口 | reports/runs/<run_id>/evidence-index.md；reports/runs/<run_id>/evidence/EV-UNIT-001.md；reports/runs/<run_id>/evidence/EV-UI-001.md；reports/runs/<run_id>/evidence/EV-UNIT-002.md |
| machine回链 | 05 §13.1对应suite/report.json→cases/<TC-ID>--<variant_id>.json→meta/context/manifest；同一批准baseline的固定run集合 |
| 通过条件 | 本地route/draft/focus/tab不等待无关owner；各section可局部进展；duplicate/resume/unknown不能请求无限放大或副作用重放；生产性能/长时资源数值有正式批准与05§10.2实际测量；所需TC参数全集/guard/负向均满足，证据scope不升级；本地contract证据可验证，不替代必要real层 |
| 失败/缺证据 | 无关owner永久阻塞本地输入、unbounded loop/retry、无authority却声称响应/容量达标；缺/failed/blocked/skipped/not_run/过期错版证据不得passed |
| 裁决影响 | P0不满足即不通过；送验baseline尚缺时保持blocked，不产生最终结论；若实际命中§11 VETO则总体强制不通过，不可waive |

#### GATE-CHAT-NFR-002 fail-closed/局部可用与恢复

| 要素 | 裁决要求 |
|---|---|
| 父AC/优先级 | AC-NFR-CHAT-002 / P0 |
| 设计契约 | 00 §13/14.3 NFR-CHAT-004～007；03相关§5～15；04 guard/source；05 §5.4/§10/12～14 |
| TC（既有planned） | TC-PROTO-016, TC-PROTO-054, TC-PROTO-056, TC-PROTO-076, TC-SAFE-002, TC-CONC-009, TC-REAL-001, TC-REAL-004 |
| EV（既有planned） | EV-UI-001, EV-UNIT-002, EV-UNIT-003, EV-SDK-001 |
| 固定report入口 | reports/runs/<run_id>/evidence-index.md；reports/runs/<run_id>/evidence/EV-UI-001.md；reports/runs/<run_id>/evidence/EV-UNIT-002.md；reports/runs/<run_id>/evidence/EV-UNIT-003.md；reports/runs/<run_id>/evidence/EV-SDK-001.md |
| machine回链 | 05 §13.1对应suite/report.json→cases/<TC-ID>--<variant_id>.json→meta/context/manifest；同一批准baseline的固定run集合 |
| 通过条件 | actor/scope/visibility不明即安全收紧；单owner失败不变全局成功或失败；restart新epoch资格，无durable稿/confirmed恢复；gap缺coverage不fresh；所需TC参数全集/guard/负向均满足，证据scope不升级；实际正式SDK能力与TC-REAL-001/004对应参数另证 |
| 失败/缺证据 | 旧缓存授权、partial/ownerfailure被掩盖、revoke/cleanupfailure复活、SDK未就绪伪ready；缺/failed/blocked/skipped/not_run/过期错版证据不得passed |
| 裁决影响 | P0不满足即不通过；送验baseline尚缺时保持blocked，不产生最终结论；若实际命中§11 VETO则总体强制不通过，不可waive |

#### GATE-CHAT-NFR-003 安全/边界/配置

| 要素 | 裁决要求 |
|---|---|
| 父AC/优先级 | AC-NFR-CHAT-003 / P0 |
| 设计契约 | 00 §13/14.3 NFR-CHAT-008～011；03相关§5～15；04 guard/source；05 §5.4/§10/12～14 |
| TC（既有planned） | TC-SAFE-001, TC-SAFE-002, TC-SAFE-004, TC-CFG-002, TC-CFG-004, TC-CFG-010, TC-CFG-012 |
| EV（既有planned） | EV-UNIT-003, EV-UNIT-004, EV-NATIVE-001, EV-UNIT-006, EV-UNIT-008 |
| 固定report入口 | reports/runs/<run_id>/evidence-index.md；reports/runs/<run_id>/evidence/EV-UNIT-003.md；reports/runs/<run_id>/evidence/EV-UNIT-004.md；reports/runs/<run_id>/evidence/EV-NATIVE-001.md；reports/runs/<run_id>/evidence/EV-UNIT-006.md；reports/runs/<run_id>/evidence/EV-UNIT-008.md |
| machine回链 | 05 §13.1对应suite/report.json→cases/<TC-ID>--<variant_id>.json→meta/context/manifest；同一批准baseline的固定run集合 |
| 通过条件 | SDK-only/正式owner/source/session，禁privateAPI/bus/共享DB/owner源码/credentials与禁正文；strictconfig与native独立批准，不silentfallback；所需TC参数全集/guard/负向均满足，证据scope不升级；本地contract证据可验证，不替代必要real层 |
| 失败/缺证据 | 绕边界/秘密泄露/授权放宽/ordinaryJSON授native或非法config被激活；缺/failed/blocked/skipped/not_run/过期错版证据不得passed |
| 裁决影响 | P0不满足即不通过；送验baseline尚缺时保持blocked，不产生最终结论；若实际命中§11 VETO则总体强制不通过，不可waive |

#### GATE-CHAT-NFR-004 安全回链/审计证据

| 要素 | 裁决要求 |
|---|---|
| 父AC/优先级 | AC-NFR-CHAT-004 / P0 |
| 设计契约 | 00 §13/14.3 NFR-CHAT-012～014；03相关§5～15；04 guard/source；05 §5.4/§10/12～14 |
| TC（既有planned） | TC-PROTO-052, TC-SAFE-005, TC-REPORT-001, TC-REPORT-002, TC-REPORT-004, TC-REPORT-007, TC-REAL-001, TC-REAL-004 |
| EV（既有planned） | EV-UNIT-001, EV-UI-002, EV-REPORT-001, EV-SDK-001 |
| 固定report入口 | reports/runs/<run_id>/evidence-index.md；reports/runs/<run_id>/evidence/EV-UNIT-001.md；reports/runs/<run_id>/evidence/EV-UI-002.md；reports/runs/<run_id>/evidence/EV-REPORT-001.md；reports/runs/<run_id>/evidence/EV-SDK-001.md |
| machine回链 | 05 §13.1对应suite/report.json→cases/<TC-ID>--<variant_id>.json→meta/context/manifest；同一批准baseline的固定run集合 |
| 通过条件 | safe source/version/visibility/result关联可复核；没有ref明确missing/unknown；真实case→suite→EV→ACbinding，客户端日志/summary非业务truth；所需TC参数全集/guard/负向均满足，证据scope不升级；实际正式SDK能力与TC-REAL-001/004对应参数另证 |
| 失败/缺证据 | 点击/ACK/stream/截图当receipt/EV，TC孤儿/分母遗漏/指纹错配/手填pass；缺/failed/blocked/skipped/not_run/过期错版证据不得passed |
| 裁决影响 | P0不满足即不通过；送验baseline尚缺时保持blocked，不产生最终结论；若实际命中§11 VETO则总体强制不通过，不可waive |

#### GATE-CHAT-NFR-005 一致性/幂等/跨端

| 要素 | 裁决要求 |
|---|---|
| 父AC/优先级 | AC-NFR-CHAT-005 / P0 |
| 设计契约 | 00 §13/14.3 NFR-CHAT-015～018；03相关§5～15；04 guard/source；05 §5.4/§10/12～14 |
| TC（既有planned） | TC-CONC-001, TC-CONC-006, TC-CONC-010, TC-CONC-012, TC-CONC-013, TC-PROTO-072, TC-REAL-001, TC-REAL-004 |
| EV（既有planned） | EV-UNIT-001, EV-UNIT-002, EV-UNIT-004, EV-SDK-001 |
| 固定report入口 | reports/runs/<run_id>/evidence-index.md；reports/runs/<run_id>/evidence/EV-UNIT-001.md；reports/runs/<run_id>/evidence/EV-UNIT-002.md；reports/runs/<run_id>/evidence/EV-UNIT-004.md；reports/runs/<run_id>/evidence/EV-SDK-001.md |
| machine回链 | 05 §13.1对应suite/report.json→cases/<TC-ID>--<variant_id>.json→meta/context/manifest；同一批准baseline的固定run集合 |
| 通过条件 | localdraft/attempt/result与formalchange分域；slot/root/source原子，cursor不排序，unknown仅probe；两端owner正式幂等与权限，各稿只本地；所需TC参数全集/guard/负向均满足，证据scope不升级；实际正式SDK能力与TC-REAL-001/004对应参数另证 |
| 失败/缺证据 | 跨owner原子假snapshot、localCAS宣称跨端exactlyonce、unknownresend、私造稿synctruth；缺/failed/blocked/skipped/not_run/过期错版证据不得passed |
| 裁决影响 | P0不满足即不通过；送验baseline尚缺时保持blocked，不产生最终结论；若实际命中§11 VETO则总体强制不通过，不可waive |

#### GATE-CHAT-NFR-006 低敏分类/可观测

| 要素 | 裁决要求 |
|---|---|
| 父AC/优先级 | AC-NFR-CHAT-006 / P0 |
| 设计契约 | 00 §13/14.3 NFR-CHAT-019～021；03相关§5～15；04 guard/source；05 §5.4/§10/12～14 |
| TC（既有planned） | TC-PROTO-064, TC-PROTO-066, TC-PROTO-082, TC-CFG-021, TC-CFG-022 |
| EV（既有planned） | EV-UNIT-005 |
| 固定report入口 | reports/runs/<run_id>/evidence-index.md；reports/runs/<run_id>/evidence/EV-UNIT-005.md |
| machine回链 | 05 §13.1对应suite/report.json→cases/<TC-ID>--<variant_id>.json→meta/context/manifest；同一批准baseline的固定run集合 |
| 通过条件 | page/VM/store/adapter/reducer状态分类一致且safe可理解；defaultdisabled，显式用户/current六字段/qualifiedsink；sink失败不改权限/结果/恢复上限；所需TC参数全集/guard/负向均满足，证据scope不升级；本地contract证据可验证，不替代必要real层 |
| 失败/缺证据 | automaticlog/metrics/后台sink补truth、raw材料输出，sinkfailed影响业务结果或自动resend；缺/failed/blocked/skipped/not_run/过期错版证据不得passed |
| 裁决影响 | P0不满足即不通过；送验baseline尚缺时保持blocked，不产生最终结论；若实际命中§11 VETO则总体强制不通过，不可waive |

#### GATE-CHAT-NFR-007 AT/平台等价

| 要素 | 裁决要求 |
|---|---|
| 父AC/优先级 | AC-NFR-CHAT-007 / P0 |
| 设计契约 | 00 §13/14.3 NFR-CHAT-022～024；03相关§5～15；04 guard/source；05 §5.4/§10/12～14 |
| TC（既有planned） | TC-AT-001, TC-AT-002, TC-AT-003, TC-AT-004, TC-AT-005, TC-REAL-002, TC-REAL-003, TC-SAFE-007, TC-SAFE-008 |
| EV（既有planned） | EV-UI-001, EV-NATIVE-001, EV-HOST-001, EV-AT-001 |
| 固定report入口 | reports/runs/<run_id>/evidence-index.md；reports/runs/<run_id>/evidence/EV-UI-001.md；reports/runs/<run_id>/evidence/EV-NATIVE-001.md；reports/runs/<run_id>/evidence/EV-HOST-001.md；reports/runs/<run_id>/evidence/EV-AT-001.md |
| machine回链 | 05 §13.1对应suite/report.json→cases/<TC-ID>--<variant_id>.json→meta/context/manifest；同一批准baseline的固定run集合 |
| 通过条件 | 适用N1～N4键盘/实际受支持AT可理解操作恢复；focus/IME/live状态安全，图/list同safe拓扑；实际Desktop与sharedWeb业务语义一致，缺平台能力不补授权；所需TC参数全集/guard/负向均满足，证据scope不升级；适用真实AT矩阵与TC-REAL-003另证 |
| 失败/缺证据 | 视觉抵消AT失败、hiddenlabel/count泄露、键盘trap/核心不可操作、Web/fakehost代Desktop、平台ACK升级结果；缺/failed/blocked/skipped/not_run/过期错版证据不得passed |
| 裁决影响 | P0不满足即不通过；送验baseline尚缺时保持blocked，不产生最终结论；若实际命中§11 VETO则总体强制不通过，不可waive |

### 9.2 质量批准与硬阈值

| 指标/阈值 | 来源 | 可判定口径 | 缺失影响 |
|---|---|---|---|
| unknown effect自动重放次数必须0 | 00BR017/03§12 | 原association dispatched之后无正式允许不第二effect；TC-PROTO-072/CONC01等 | 违例P0/VETO |
| forbiddensecret/rawtruth保留或输出必须0 | 00§11/14.4条4 | 安全writer/store/DOM/错误/诊断及reports各出口拒绝/清理，合成sentinel检查 | 违例VETO；缺测试blocked |
| once localreservation winner dispatch≤1 | 03§10/12 | 同composition同稿/同Gateaction非终态一winner；不宣称全平台exactlyonce | 违例P0/VETO |
| 数字safeint min1/max与单位 | 04§7/§9 | text65536UTF16units、attachment64、cache1024、consumed65536/单sourcegeneration、contexts128、directory512UTF16units、nodes2048、edges8192 | badinput拒绝；silentfallback不通过 |
| 图/list/AT集合与版本一致 | 00流程/03CUT-AT | safe nodes/edges/parent/source相同，hiddencounts不输出；超限unsupported_material无残图ready | 违例P0，AT/披露按VETO |
| production latency/memory/long-run/compatibility | 00NFR001～003/05§10.2 | 必须批准实际budget、环境/设备safe类别和测量方法，再在相同baseline验证 | 当前waiting/blocked，不造ms/P95/99.9% |
| supported OS/AT/versions/retentionbudget | 04/05§8/13 | 真实approved矩阵/版本/ACL与每适用目标证据齐 | 当前blocked，不能条件豁免P0 |

数值表是语义不变量/guard，不是当前测量结果。没有新质量TC或承诺值；未来authority使契约改变时必须重校准00/03/04/05/06/07后定义运行分母，当前release质量仍blocked。

### 本Step逐项停审（设计过程记录）

每项独立完成来源→contract→TC→EV/report→pass/fail→裁决影响后才处理下一项。下表通过仅代表规则审查；实际TC/EV未生成、实际验收未开始。

| 验收项 | 审查项 | local gate | 外部缺口 |
|---|---|---|---|
| GATE-CHAT-NFR-001 | AC-NFR-CHAT-001；00 §13/14.3 NFR-CHAT-001～003；03相关§5～15；04 guard/source；05 §5.4/§10/12～14；TC/EV存在且scope/路径明确；pass/fail可判定，P0无waiver | pass_with_upstream_blockers | build/run/实际证据仍waiting，real能力不借fixture推断 |
| GATE-CHAT-NFR-002 | AC-NFR-CHAT-002；00 §13/14.3 NFR-CHAT-004～007；03相关§5～15；04 guard/source；05 §5.4/§10/12～14；TC/EV存在且scope/路径明确；pass/fail可判定，P0无waiver | pass_with_upstream_blockers | build/run/实际证据仍waiting，real能力sdk仍blocked |
| GATE-CHAT-NFR-003 | AC-NFR-CHAT-003；00 §13/14.3 NFR-CHAT-008～011；03相关§5～15；04 guard/source；05 §5.4/§10/12～14；TC/EV存在且scope/路径明确；pass/fail可判定，P0无waiver | pass_with_upstream_blockers | build/run/实际证据仍waiting，real能力不借fixture推断 |
| GATE-CHAT-NFR-004 | AC-NFR-CHAT-004；00 §13/14.3 NFR-CHAT-012～014；03相关§5～15；04 guard/source；05 §5.4/§10/12～14；TC/EV存在且scope/路径明确；pass/fail可判定，P0无waiver | pass_with_upstream_blockers | build/run/实际证据仍waiting，real能力sdk仍blocked |
| GATE-CHAT-NFR-005 | AC-NFR-CHAT-005；00 §13/14.3 NFR-CHAT-015～018；03相关§5～15；04 guard/source；05 §5.4/§10/12～14；TC/EV存在且scope/路径明确；pass/fail可判定，P0无waiver | pass_with_upstream_blockers | build/run/实际证据仍waiting，real能力sdk仍blocked |
| GATE-CHAT-NFR-006 | AC-NFR-CHAT-006；00 §13/14.3 NFR-CHAT-019～021；03相关§5～15；04 guard/source；05 §5.4/§10/12～14；TC/EV存在且scope/路径明确；pass/fail可判定，P0无waiver | pass_with_upstream_blockers | build/run/实际证据仍waiting，real能力不借fixture推断 |
| GATE-CHAT-NFR-007 | AC-NFR-CHAT-007；00 §13/14.3 NFR-CHAT-022～024；03相关§5～15；04 guard/source；05 §5.4/§10/12～14；TC/EV存在且scope/路径明确；pass/fail可判定，P0无waiver | pass_with_upstream_blockers | build/run/实际证据仍waiting，real能力at仍blocked |

### 跨非功能门禁审计（设计过程记录）

| 审计项 | 结论/处理 |
|---|---|
| 缺contract/TC/EV/report | 本Step各项均回指既有03/04/05；无新TC/EV |
| 重复/冲突裁决 | 共用EV按TC/variant取子集；P0/VETO优先，parentAC仅聚合，不重复计通过 |
| source/状态/phase漂移 | 只当前正式值；planned/schema不是实测/结果，07boundary waiting |
| 范围越界 | 不验owner内部实现，不private API/bus；scope不足blocked，不伪real |


## 8. 回填草稿

正式06 §9回填本步§7裁决结论/表/schema；过程停审、差异和自检留本文件，不冒充实际结果。

## 9. 待确认事项

CHAT-UP001～009/WS-UP001～008/BASE001/native/OS/AT/生产预算/精确版本/来源/发布/归档继续open/blocked。角色、build、run_id、报告、actualEV、风险接受与签署均waiting；没有当前放行或readiness。

## 10. 自检及下一Step门禁

24NFR/7actualAC/八numericguard及zero语义红线local审查；生产预算/兼容/AT继续blocked。 本地规则设计gate pass_with_upstream_blockers；允许Step10先读取台账/flow/当前产物与对应SOP，不创建其它未来Step。
