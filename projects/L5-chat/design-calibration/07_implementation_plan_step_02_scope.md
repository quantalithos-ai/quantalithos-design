# L5-chat 07 · Step 2 实施目标与范围

## 1. Step状态

> done / gate_status=pass（仅设计/文档静态门禁）；2026-10-02。implementation仍planned/blocked/waiting，无实际实现或测试结果。

| field | value |
|---|---|
| gate_status | pass |
| gate_reason | 本步设计规则、来源及最终跨文档静态闭环检查通过；不关闭上游blocker，不是implementation gate结果 |
| next_allowed_action | Step3已按本轮连续授权执行；07最终停点见flow，不能据此进入代码实施 |
| source_files | 本步§2/§7所列正式00～06、对应规范与前序Step；[07flow](07_implementation_plan_calibration_flow.md)、[项目台账](project_execution_ledger.md) |


## 2. 本步输入

前序Step1已done、07flow/项目台账与对应来源；07 SOP Step2、书写规范5.2；中间产物§5.10、真相源§7/§9和实施台账规范。

## 3. SOP问题回答

最小交付、覆盖编号、详细设计与验收、非范围/P1误入六项：§2.1给P0与deferred范围，§2.2给owner/SDK/native和本轮授权边界。

## 4. 当前文档问题诊断

只按聊天消息功能排期将漏项目BPMN、目录、真实SDK/native/AT、恢复与证据；将增强全关也不能延期F021基础目录。

## 5. 改动前后对比

| 改前 | 改后 | 原因 |
|---|---|---|
| 只按聊天消息功能排期将漏项目BPMN、目录、真实SDK/native/AT、恢复与证据；将增强全关也不能延期F021基础目录。 | 本步§7收口规则 | 阶段/门禁可执行且不伪造事实 |

## 6. 设计取舍

按N1～N4与已确认五tab/流程/目录组织，不增加Mobile交付。此步用范围表，不画图。

## 7. 结构化中间产物

### 2.1 未来实施目标与覆盖

本轮授权完成设计与planned台账；下表“实施”表示后续已获代码授权并解除对应blocker后的交付范围，当前没有实现结果。最小产品交付是Desktop协作入口完整N1～N4：正式可见内容、安全本地交互、受控意图与正式结果、变化/离线/恢复，不能用fixture-only界面宣称Desktop已交付。

| 类别 | 内容 | 来源 | 未来实施 | 约束 |
|---|---|---|---|---|
| 会话入口/语境 | group/channel/dm/thread、back/deep-link/current access | F-CHAT-001～003；AC-FR-CHAT-001 | P0 | 缓存/URL不授权，不建Conversation |
| 正式展示 | Turn type、成员/项目/Runtime/Workspace安全摘要、GateCard/Artifact preview与降级 | F-CHAT-004～008；AC-FR-CHAT-002～004 | P0 | source/visibility/版本分立，safe refs不推body或完成 |
| 草稿/发送/审批入口 | revision冻结、optimistic反馈、reservation/单dispatch、formal结果/unknown | F-CHAT-009～012；AC-FR-CHAT-005～006 | P0 | 点击/ACK不是成功；Governance Gate/action受正式资格约束 |
| 实时/多端/恢复 | source-local change/resume、gap、断线、重启、内存展示缓存/草稿 | F-CHAT-013～016；AC-FR-CHAT-007～008 | P0 | unknown只probe/query/wait；本地草稿不私造跨设备同步truth |
| 显式低敏支持 | 六字段诊断/支持摘要与默认disabled | F-CHAT-017；AC-FR-CHAT-009 | P0边界 | 启用正式sink须解除UP007；不做automatictelemetry |
| 项目+进度统一入口 | 项目详情五tab、整体→阶段→节点，平行fork/branch/join与独立Governance Gate | F-CHAT-018/020；AC-FR-CHAT-011/013 | P0 | 不加顶层progress route，不由Work/log/tool状态推join |
| 关联群聊/公司成员 | 一群最多一项目、多群可有不同成员；关系/target访问；公司/项目/群聊集合分立 | F-CHAT-019/021；AC-FR-CHAT-012/014 | P0 | owner/provider未闭不fake建立绑定或扩大目录coverage |
| 客户端合同/安全/AT | 43协议、17主体、CAS、15error、14config、全部适用AT/OS/SDK/质量 | AC-CHAT-001～005、AC-BR/DR各001～005、AC-NFR-CHAT-001～007 | P0 | 严格承接03/04/05/06；真实层必需，不借fixture替代 |
| 证据/交接 | 216既有TC、16suite/EV、142gate、10VETO、私有acceptance DTO/签署输入 | 05§6/9/13；06§5～14 | P0交付约束 | 生成器只基于真实运行；签署不是自动按钮 |
| 搜索/通知/富文本附件增强 | E01～E03 | AC-FR-CHAT-010 | 未激活/deferred | 只实现安全禁用边界；目录基础搜索属于F021，不能被当增强延期 |
| Mobile | E04，Capacitor暂定候选 | 00/03§3；AC-FR-CHAT-010 | 不属于V1交付 | 不创建移动package/runner，不作为Desktop前置 |

### 2.2 非交付与防误入

| 非范围 | 处理 |
|---|---|
| Conversation/Turn/Participant、Project/WorkItem、Member、Gate/Decision、Artifact、Workspace、Runtime、Process truth | 归正式owner，只经SDK消费；不把Chatstore当替代truth |
| Bridges外部平台映射、Runtime推理、Tools执行、Observability backend、bus/DB/owner私有接口 | 无实现仓依赖或客户端订阅，不转入host桥执行 |
| 本地持久化稿/加密driver/跨设备草稿同步、自制BPMN引擎/流程编排 | 当前memoryOnly=true；需要新正式合同和范围批准，不偷偷启用 |
| 自研通用SDK、发布新的public业务package、多业务crate | SDK负责通用能力；Chat保持单private app+嵌入单host |
| 生产部署/自动发版、实际评审署名、实际业务审批 | 计划只定义前置/证据/责任；后续动作另需真实授权与来源 |
| 本轮代码/manifest/lock/scripts/config实例/run/artifact/EV | 不创建；只写设计文件和planned ledger skeleton |

范围变更必须先回00/01/03/04/05/06与当前07受影响boundary校准，不能靠把P0标P1或给其risk deadline缩小交付范围。BASE001只保留36实际AC，不增加AC-NFR008～024。

## 8. 回填草稿

正式07 §2仅回填本步§7已收口结论，过程审计留本文件；不得新增未校准phase/boundary或证据结论。

## 9. 待确认事项

CHAT-UP001～009、WS-UP001～008、CHAT-BASE001、SDK/Process/provider、native/OS/AT、质量预算/版本/source/release/归档继续open/blocked；实现授权与approved07 commitbaseline均waiting。实际实现、build/run/EV、接受与签署不存在。本地结构闭口不关闭真实集成blocker。

## 10. 自检及下一Step门禁

需求/AC均来自现有00，43/17/216/16/142/10不变；没有新增owner能力或实际验收结论。 本步只作设计/文档静态检查，不是应用测试或readiness。本地门禁通过后仅允许Step3读取对应规范和来源。
