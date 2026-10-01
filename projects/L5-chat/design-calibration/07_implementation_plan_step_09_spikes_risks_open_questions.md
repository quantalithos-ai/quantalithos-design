# L5-chat 07 · Step 9 Spike、风险与待确认事项

## 1. Step状态

> done / gate_status=pass（仅设计/文档静态门禁）；2026-10-02。implementation仍planned/blocked/waiting，无实际实现或测试结果。

| field | value |
|---|---|
| gate_status | pass |
| gate_reason | 本步设计规则、来源及最终跨文档静态闭环检查通过；不关闭上游blocker，不是implementation gate结果 |
| next_allowed_action | Step10已按本轮连续授权执行；07最终停点见flow，不能据此进入代码实施 |
| source_files | 本步§2/§7所列正式00～06、对应规范与前序Step；[07flow](07_implementation_plan_calibration_flow.md)、[项目台账](project_execution_ledger.md) |


## 2. 本步输入

前序Step8已done、07flow/项目台账与对应来源；07 SOP Step9、书写规范5.9；中间产物§5.10、真相源§7/§9和实施台账规范。

## 3. SOP问题回答

九个spike围绕正式SDK/结果/Process/provider/host/AT/memory/schema与版本质量，均有具体输出、确认方及开工截止；继承blocker逐项传播，未知role/日期不造值。

## 4. 当前文档问题诊断

实施依赖易被长期待确认或已存在文件消解；必须明确缺证据时哪一boundary停。

## 5. 改动前后对比

| 改前 | 改后 | 原因 |
|---|---|---|
| 实施依赖易被长期待确认或已存在文件消解；必须明确缺证据时哪一boundary停。 | 本步§7收口规则 | 阶段/门禁可执行且不伪造事实 |

## 6. 设计取舍

read-only契约核验优先，实验只能未来授权scope；需上游/标准变更记录proposal，当前只写Chat；需求BASE001不靠新AC掩盖。

## 7. 结构化中间产物

### 9.1 Spike计划与停止条件

全部spike planned，当前不执行安装/build/应用测试/真实请求。它们在对应boundary的Design Gate前完成只读契约审查或获授权的隔离验证，不新增product功能；若实验需要可提交的源码/新工具，必须先受控追加明确boundary与全部planned台账，不能借spike越scope。时间预算以一次列明问题/证据的复核轮为界，未得结论即blocked并报缺口，不无限试库或猜export。

| ID | 类型/具体问题 | 影响phase/前置boundary | 计划输出 | 提供/确认方 | 判定与截止点 |
|---|---|---|---|---|---|
| SP-CHAT-001 | SDK exact publicexports能否覆盖22项SdkOperation资格维度 | PH02local schema审查、PH07positive前 | operation→正式export/type/版本/source/actor/visibility/result/error/coverage/safe locator逐项矩阵 | SDK与各owner | 01-a前确认pkg/编译材料；07-a/b前确认positive所需矩阵，缺一项即相应blocked |
| SP-CHAT-002 | owner命令幂等、no-effectprepare、receipt/结果/probe及跨端samekey合同 | PH04/PH07 | 输入/authority/association/key/payloaddigest/commit/resultref/unknown窗口正式来源与safe失败矩阵 | Conversation/Governance/SDK | 04-a/b前localcarrier核对；07-a/b前正式证据，unknown/not_found不当noeffect |
| SP-CHAT-003 | Process整体/stage/node可披露拓扑与token/gateway/branch/join/sourceversion | PH06/PH07 | read-onlygraph/source/parent/nodeassociation/change/resume合同；viewer/布局库source/license/精确pin、typed safegraph输入mapping与图/list/ARIAfixture核验，未批库blocked，不私造BPMN XML/执行引擎 | Process/SDK | 06-b前localcontract闭合；07-a/b前positive正式surface，原型/Work图不代source |
| SP-CHAT-004 | 项目群聊bindingowner和公司目录provider/coverage/成员分域 | PH06/PH07 | owner归属、一群≤一项目/多群、解除/撤销/targetaccess；人类+AI覆盖/querypage/三集合合同 | Work/Conversation/架构/目录provider/SDK | 06-c前local来源核；07-a前实际provider/access，缺失只blocked |
| SP-CHAT-005 | Tauri可信origin/window IPC与least-authority能否在批准OS确证 | PH08 | exact版本/source/hostpolicy/CSP/capability/可信上下文与两个probe/三拒绝mapper验证方案 | native/security/平台发布方 | 08-a前policy/版本闭合；safe_storage/controlled_open不在本spike激活 |
| SP-CHAT-006 | WebView/读屏与BPMN等价列表实际可操作 | PH03/06/08 | 批准OS/AT矩阵、核心目标/IMe/focus/zoom/graphlist的实际操作记录要求 | 产品/AToperator/native/test | 03/06先local语义；08-b前actual环境批准，未得真实结果不能代称支持 |
| SP-CHAT-007 | memory-only的重启草稿/attempt丢失、未知effect如何获准恢复 | PH02/05/07 | safe locator/partition/source查询与epoch重新资格、unknown仅probe、默认不持久化草稿的产品确认 | SDK/owner/产品/security | 02-b/05-b前local恢复界限；正式locator07-b前；durable另新设计 |
| SP-CHAT-008 | 完整machine/report/acceptance schema与JCS/materialization/DAG无循环 | PH01/09/10 | 05/06字段递归、selfdigest/bytesdigest/ExpectedInstance/e018/signature精确检查与negative fixture清单 | test/report/security/验收方 | 01-b前基础工具来源；09-b前fullEV；10-a前私有验收负例闭合，不改schema自造ref |
| SP-CHAT-009 | 精确工具版本、safe资源位置、质量预算、归档/release来源批准 | PH01/08/09/10 | npm/Rust/SDK兼容批准与实际lock计划、包内source完整性；有限capture/retention/ACL/quality支持矩阵 | 客户端/SDK/平台/test/security/release | 01-a前可build工具；08-a前native；09-a/b前质量/归档；10-b前发布批准 |

spike输出是来源与检查计划或未来真实实验记录，不是已实现/已测EV。某项需要上游新schema/权限/返回面时列精确gap，回owner/SDK正式闭口；当前不越目录范围写其他项目或standards。已定义经验可覆盖新发现时不另发明标准；缺新通用经验必须记录proposal/正反例、请求相应scope授权后才能回写标准，移交保持blocked。

### 9.2 继承blocker与解除条件

下列ID沿用正式设计，不因07已完成或上游正式00～07文件存在而关闭。写法中的连字符与旧文档省略形式指同一项，不注册第二套ID。

| blocker | 影响phase/正向能力 | 明确解除证据/确认方 | 未关闭行为/阶段截止 |
|---|---|---|---|
| CHAT-UP-001 | 全businessadapter/PH07 | SDK逐operation正式export/type、source/actor/visibility/error/redaction/兼容批准和actualbinding | blocked；07-a正式调用前 |
| CHAT-UP-002 | group/channel/dm/thread/历史/变化/跨端/恢复 | Conversation+SDK正式parent/lineage/changeidentity/cursor/coverage/resume与actual测试 | stale/gap/blocked；PH07 changes前 |
| CHAT-UP-003 | GateCard审批/幂等/result/probe | Governance+SDK action/actor/正式authority/noeffectprepare/receipt/probe与actual证据 | 按钮callback不confirm；04-blocal核/07-apositiv前 |
| CHAT-UP-004 | Artifactpreview/ref/安全locator | Artifact+SDK safe descriptor/visibility/expiry/locator，native open另批准 | previewunavailable；PH07前；不拼URL或注册openvariant |
| CHAT-UP-005 | Workspace safe view/export/source | Workspace+SDK正式readonlysafeview/source/freshness/cursor及WS-UP闭合 | partial/unavailable；PH07 Workspace调用前 |
| CHAT-UP-006 | Work/Identity/Member/Runtime各summary/refs | 各owner+SDK currentaccess/分域safe摘要 | 不推成员/项目/运行truth；PH07实际summary前 |
| CHAT-UP-007 | 显式低敏supportsink | Observability+SDK正式six-field/redaction/receipt/错误与允许sink | disabled零IO；任何启用前，无需P0宣称自动telemetry |
| CHAT-UP-008 | whole/stage/node/parallel/join/parent/change | Process+SDK正式safeprojection/state/topology/version/关联/coverage；需求来源受控同步 | blocked；06-blocal核/07positive前；不原型推truth |
| CHAT-UP-009 | 群聊项目关系/公司目录coverage | 正式bindingowner/provider、constraint/unbind/revoke/targetaccess、人类AIcoverage/querypage/权限 | provider未确认不称全员；06-clocal核/07positive前 |
| WS-UP-001 | 多owner safe查询/摘要/version | Workspace相关owner正式safe source | PH07 Workspace消费前，不跨owner原子化 |
| WS-UP-002 | event/cursor/replay/rebuild | 正式sourcebaseline/coverage/resume | PH07前，无任意offset |
| WS-UP-003 | visibility/revoke/时效 | 每source正式owningchain | 每实际披露前；先收紧，不用治理替所有授权 |
| WS-UP-004 | attention输入/去重/lifecycle | Workspace正式attentionprojection | 未闭合不从未读Turn/run推attention |
| WS-UP-005 | Personal/Project saferef/scope | 正式subject/safequeryscope | 缺subject fail-closed |
| WS-UP-006 | SDK/product/sync/archive read/export | 正式consumer/export/locator边界 | 实际sync/export前，Chat当前不自行提供export |
| WS-UP-007 | shared type/error/event | SDK正式exports/sharedowner闭口 | 不复制shared DTO或直引core |
| WS-UP-008 | personal执行subject | execution owner正式主语 | 不创建第三执行主语/Run；不在Chat关闭 |
| CHAT-BASE-001 | 00未定义AC-NFR008～024旧索引/完整需求追溯 | 需求维护者获授权原位修00后，逐受影响03/05/06/07和台账重新校准 | 当前只用36actualAC，移交/送验前必须解释或修复，不伪关闭 |
| CFG-HOST-001 / native/OS/AT | hostpolicy/实际origin/window/kind与支持矩阵 | native/security/OS/AT实际批准+REAL002/003 | PH08前；Web不能代Desktop |
| CFG-BUDGET-001 / productionquality | numeric上限非生产质量预算 | 产品/test实际工作负载、阈值/测量批准 | PH09质量前；不写2s/P95/99.9%等旧承诺 |
| CFG-VERSION-001 / source/version | 精确pin/SDKdist/source/兼容 | 实施/SDK/平台futureactualresolver/lock/source批准 | 受影响build前；SDK0.1.0只观察事实 |
| CFG-SOURCE-001 | 批准source资源位置/完整性/catalog | native/release正式来源与具体安装/build证据 | 生产装配前，不UI/env/CLI选路径 |
| CFG-MEMORY-001 / storage | 重启稿/attempt丢失；无durable资格 | 产品/SDK受控查询恢复；持久化另全schema/crypto/driver/cleanup设计 | PH05恢复前确认产品限制；durable当前排除 |
| CFG-CHANGE-001 / release | 配置审批/回退/签名分发与角色 | release/security真实流程/授权source/版本 | PH10交付前；设计记录不是已审计部署 |
| retention / ACL / capture预算 | actualartifact安全归档/有限capture/删除责任 | test/security/env批准policy+实际检查 | 正式归档/PH09-b前；无rawcandidate保留 |
| approved baseline / 实施授权 | 目标实现仓不存在；当前design工作树dirty、07未获批准commit | 用户确认范围、含00～07批准不可变designcommit及逐boundary审计；来源HEAD仅观察值 | 第一boundary blocked/wait_design；不开代码、commit/run |
| review / signoffs / readiness | 无actualrun/EV/角色审阅/签署/发布 | 06真实输入/六角色同digest裁决与实际发布批准 | PH10前/交付时；不自动填人名/日期或接受风险 |

### 9.3 本地规划风险与待确认截止

| 项 | 风险/问题 | 影响 | 处理/截止点 |
|---|---|---|---|
| R-CHAT-PLAN-001 | earlytargeted被误称completePR/EV | PH01～09 | §7冻结current与missing分母；完整PR前不得合并交付分支，逐boundaryreview |
| R-CHAT-PLAN-002 | type-only前置被实现成后序行为或partialComposition | PH02～06 | §6.1 exact owner declarations/currentinitial与reserved；06-c前不activate完整create |
| R-CHAT-PLAN-003 | sharedfile scope被误视整文件授权 | 全boundary | exactpaths之外还审content/TCdescribe；每批编辑前Scope Gate |
| R-CHAT-PLAN-004 | 增加acceptance参数后旧reportEV失效 | PH10 | 新manifest/newrun/actualEV-REPORT，既有CLI扩检查path同boundary重审 |
| R-CHAT-PLAN-005 | 缺P0合同被riskaccept/skip | PH07～10 | 06 P0/VETO不可豁免；保留blocked/nofinalclaim，验收进入前 |
| Q-CHAT-PLAN-001 | 谁批准designcommit与首次实现授权 | 全项目 | 用户/设计维护者真实确认；07停审后、任何实现前 |
| Q-CHAT-PLAN-002 | 精确版本/库工具与包内configsource最终取值 | PH01/08 | SP001/005/009；01-a/08-a前，当前无虚构版本 |
| Q-CHAT-PLAN-003 | actual test/AT/review/release角色指派与日期 | PH07～10 | 各实际owner/产品/test/security/release批准；实际送验/签署前，无计划日期冒timestamp |
| Q-CHAT-PLAN-004 | Mobile/durable/扩展native权限何时激活 | V1之外 | 当前reserved；新范围获授权前不能建包/driver/执行variant |

未决项有功能/阶段截止而无虚构calendar deadline；截至阶段仍缺正式证明就暂停该能力/移交，不写长期“后续再说”。此表本地规划风险已给约束/解决途径；所有上游blocker保持open，当前没有acceptedrisk。

## 8. 回填草稿

正式07 §9仅回填本步§7已收口结论，过程审计留本文件；不得新增未校准phase/boundary或证据结论。

## 9. 待确认事项

CHAT-UP001～009、WS-UP001～008、CHAT-BASE001、SDK/Process/provider、native/OS/AT、质量预算/版本/source/release/归档继续open/blocked；实现授权与approved07 commitbaseline均waiting。实际实现、build/run/EV、接受与签署不存在。本地结构闭口不关闭真实集成blocker。

## 10. 自检及下一Step门禁

9spike/阶段截止、CHAT-UP九项/WS-UP八项/BASE与CFG/source/native/quality/ACL/授权/角色逐项归属齐全，未关闭P0或声称接受风险。 本步只作设计/文档静态检查，不是应用测试或readiness。本地门禁通过后仅允许Step10读取对应规范和来源。
