# L5-chat 05 · Step 14 回归策略与残余风险

## 1. Step状态

> done / pass_with_upstream_blockers；2026-10-01。全部用例/证据/路径均planned，未执行。

## 2. 本步输入

已通过Step13；05 SOP Step14与书写规范5.14；03 Step16、04 §12；真相源§2.15/§7。复杂cut逐个收口，前序gate成立才创建本文件。

## 3. SOP问题回答

如何回归、有哪些不能测的风险、谁承担？§14.1/2逐项回答；没有实际签收或release结论。

## 4. 当前文档问题诊断

只列已知缺口而不绑定真实测试层/责任，会使下游误以为上游blocked已被计划消除。

## 5. 改动前后对比

| 改前 | 改后 | 原因 |
|---|---|---|
| 只列已知缺口而不绑定真实测试层/责任，会使下游误以为上游blocked已被计划消除。 | 本步§7结构化结论 | 防止历史设计与当前owner合同分叉 |

## 6. 设计取舍与复杂度

按变化影响定义最小与全量回归，风险列明确激活条件/接受角色且未接受。安全否决不普通延期。

## 7. 结构化中间产物

### 14.1 回归触发矩阵

| 变更类型 | 最小回归集 | 全量触发 | 责任角色 |
|---|---|---|---|
| route/access/session/visibility | navigation、state01～03、revoke/late各协议、ATfocus | scope/qualification/refs语义改变 | Chat+SDK安全 |
| draft/reservation/intent/result | intent、CONC01～05/09/14、formalSDK | association/noeffect/unknown/window改变 | Chat+owner |
| source/change/resume | continuity、CONC06/11/13、fullrow state13/15 | cursor/coverage/version契约改变 | SDK+Conversation/相关owner |
| local repo/CAS/partition | persistence、CONC10、所有原slotpatch、redaction | root检查/内存/serialization变动 | Chat客户端 |
| project/process/node | process、fullrow五page、CONC07/08、ATgraphlist | parent/topology/source/version变动 | Chat+Process |
| links/directory/membership | directory、CONC07/09、公司/项目/会话各集合访问 | provider/bindingowner/coverage变动 | SDK+关系/目录owner |
| config/profile/loader | config、host-unit、所有六profiles、rollback/late | 14字段/来源/nativepolicy变动 | Chat+平台/配置 |
| shell/OS/WebView/AT/tool版本 | host-unit、Desktop/AT真实层、IME/焦点/重启 | 支持矩阵/核心平台变动 | 平台+环境 |
| reports/schema/digest/redaction | report全suite、real输出schema审计 | EV/TC命名或成熟度/路径变化 | 测试/报告 |
| dependency import/SDKpublic export | boundary/SDKbinding与formal能力全查 | 依赖层/owner/权限变动 | SDK+架构 |
| 00～04契约修订 | 先重校准对应cut/TC/variants/manifest | 状态/字段/协议/owner分母变动 | 文档/测试负责人 |

每次最小回归必须同层真实证据；影响unknown/revoke/credential或任一否决时扩为全P0与适用real layers。新增协议/矩阵行/guard先更新manifest/预约映射，不自动减少用例分母。release候选全P0/批准支持矩阵，nightly补参数顺序和sharedWeb流程。

### 14.2 残余风险与上游阻塞

| ID/风险 | 未覆盖原因 | 影响 | 缓解/激活条件 | 接受角色/状态 |
|---|---|---|---|---|
| CHAT-UP-001 | SDKpublicsurface/runtime wiring未闭 | adapter/protocol真实消费不能证 | 正式能力/版本/source与真实TC-REAL001 | SDK+技术负责人；未接受/blocked |
| CHAT-UP-002 | Conversation cursor/page/visibility/resume合同 | realtime/历史/重连 | 正式qualification/source coverage | Conversation+SDK；blocked |
| CHAT-UP-003 | Governance capability/receipt/probe | 受控审批不能确认 | 正式Gate/action/result/幂等能力与realcase | Governance+安全；blocked |
| CHAT-UP-004 | Artifact safe preview contract | refs不能open正文/URL | qualified preview/visibility及安全scope | Artifact+SDK；blocked |
| CHAT-UP-005 / WS-UP001～008 | Workspace safeview/export/freshness缺口 | 联合展示/恢复正向 | provider资格与独立provenance/源顺序 | Workspace+SDK；blocked |
| CHAT-UP-006 | Identity/Work/Member/Runtime摘要合同 | 不同成员/项目/运行状态串权风险 | 正式source/visibility/current版本 | 对应owner+SDK；blocked |
| CHAT-UP-007 | 低敏sink/handoff未闭 | diagnostic不能交付/举业务证据 | 六字段正式sink+显式用户，仍不生成truth | Observability+SDK；blocked |
| CHAT-UP-008 | Process三层projection/forkjoin/current版本 | BPMN不能真实绑定/推导join | 正式Processsafequery/change/resume | Process+SDK；blocked |
| CHAT-UP-009 | 关系owner/公司目录provider与coverage | 双向群聊入口/完整人员目录 | 明确owner/provider，逐target独立权限 | 关系/目录owner+产品；blocked |
| CHAT-BASE-001 | 00§16不存在AC-NFR008～024 | 下游索引容易伪覆盖 | 当前只引用实际7AC/24NFR；获授权后修00 | 需求负责人；open未接受 |
| native/OS/AT | origin/window/permissions/build支持矩阵未批准 | Desktop/AT实测缺失 | actualOS/versionpolicy+TC-REAL002/003 | 平台+安全+测试；blocked |
| production budget/quality | 未实测与批准 | 性能/长时资源/兼容release无证据 | §10测量+批准，回校准文档 | 产品+技术+测试；blocked |
| source/version/release | 真实SDK/宿主/packagepins/build来源未核 | compile存在不证明运行 | 07锁定+正式验证/安全refs | 实施+发布负责人；waiting |
| artifact retention/ACL/budget | 运行归档环境与责任未批准 | real reports安全持有/保留 | boundedcapture与实际ACL/保留policy | 测试+安全+环境；blocked |
| 增强/mobile | 正式能力未激活，V1不含mobile交付 | 不可宣称完整enhancement | activation重新00～07闭环 | 产品负责人；deferred未接受 |

本表记录风险与激活条件，没有风险签字/承诺期限。P0安全与实证不足不能waiver成通过；角色尚未指派，06/07记录实际审阅和批准。未实现/未运行/无EV不是缺陷“已经接受”，是当前成熟度。

## 8. 回填草稿

正式05 §14回填本步§7全部表、步骤和schema。

## 9. 待确认事项

CHAT-UP001～009、WS-UP001～008、CHAT-BASE001、native/生产预算/版本兼容/质量仍open或blocked。真实正向不得由fixture解除。无当前测试结果、EV或readiness。

## 10. 自检与下一Step门禁

所有CHAT-UP/WS-UP/BASE/native/预算/版本/归档/增强继续显式open，回归与责任可供06/07消费。 本地设计gate pass_with_upstream_blockers；进入Step15，先读本产物/台账与对应SOP。
