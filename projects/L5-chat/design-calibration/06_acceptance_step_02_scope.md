# L5-chat 06 · Step 2 验收目标与范围

## 1. Step状态

> done / pass_with_upstream_blockers；2026-10-01。这里只定义验收规则，所有TC/EV为planned预约，无实际验收结果或签署。

## 2. 本步输入

前序Step1 local gate已通过；06 SOP Step2、书写规范5.2；00实际36AC、03契约、04配置、05TC/EV和证据schema；中间产物§5.10与真相源§7。

## 3. SOP问题回答

目标/P0范围、下游接入边界、非范围与最终影响分别是什么？范围表逐功能回答，必要real层不剔除。

## 4. 当前文档问题诊断

以“全部验收”或把未知能力当非范围，会绕过Desktop与正式SDK要求；mobile/增强需要明确激活边界。

## 5. 改动前后对比

| 改前 | 改后 | 原因 |
|---|---|---|
| 以“全部验收”或把未知能力当非范围，会绕过Desktop与正式SDK要求；mobile/增强需要明确激活边界。 | §7结构化裁决 | 保持正式contract/TC/EV与证据能力一致 |

## 6. 验收裁决取舍与复杂度

V1 Desktop核心P0与未激活增强边界分开，现有全部TC仍P0；不扩大工具/backend验证范围。

## 7. 结构化中间产物

### 2.1 范围与优先级

| 范围 | 来源/priority | 裁决目标 | 非范围/对结论影响 |
|---|---|---|---|
| group/channel/dm/thread入口与恢复 | F001～003/AC-FR-CHAT-001 P0 | 当前actor/scope/visibility、thread-parent、safe返回/深链 | 不创建Conversation，缺正式入口阻断产品通过 |
| Turn/跨owner/Gate/Artifact显化 | F004～008/AC-FR-CHAT-002～004 P0 | 正式type/provenance/freshness/visibility，受控preview | 不验owner正文/Decision内部，客户端旁路则VETO |
| 草稿/发送/审批意图/结果 | F009～012/AC-FR-CHAT-005～006 P0 | 双reservation/单dispatch、frozenrevision、formal结果、unknown | 点击/ACK不是成功，owner业务结果缺证据阻断通过 |
| realtime/多端/离线/重启 | F013～016/AC-FR-CHAT-007～008 P0 | source-local去重/gap/coverage/revoke、内存安全缓存 | 无durable稿或私造draftsync；正式source未闭blocked |
| 显式低敏支持 | F017/AC-FR-CHAT-009 P0边界 | 默认disabled/六字段/当前sink与未知结果 | 不要求automatictelemetry/backend；声称启用须正式sink |
| 项目五tab与三层BPMN | F018/020/AC-FR-CHAT-011/013 P0 | overview/progress/conversations/work_items/evidence；whole→stage→node；fork/branch/join与GovernanceGate分开 | 不从Work/log/工具成功重建Process/join |
| 群聊↔项目/公司人员 | F019/021/AC-FR-CHAT-012/014 P0 | 一群最多一项目、多群不同成员，关系/target独立access，三成员集合与coverage | 不当地建立binding，Identity不等全公司 |
| 43接口、17主体、CAS/config/host、安全/AT/证据 | AC-BR/DR/NFR P0 | 完整合同/guard/非法迁移、受支持核心目标可操作与证据可追溯 | 不验owner全系统；必要SDK/native实际层不能排除 |
| E01搜索/E02通知/E03富文本引用 | AC-FR-CHAT-010：禁止越权边界P0；新增activation另行批准 | 缺合同禁用、搜索不扩权、通知非提交、安全ref | 未激活不能宣称交付；不是整体P0豁免 |
| E04 Mobile | AC-FR-CHAT-010：保留边界；V1 non-delivery | 不成为Desktop业务前置、不绕SDK | mobile真交付须新baseline，当前无mobile通过结论 |
| 非核心视觉/可维护性 | 05 P1/P2范围定义，未列当前新TC | 只在明确变更与证据后可有限遗留 | 不能用视觉或P1抵消AT/安全/P0失败 |

### 2.2 裁决单位

现有216TC全为P0，子门禁按父36AC分组，不把相同EV重复计成多份独立证据。parentAC只有相关子gate全部满足才可passed；AC-CHAT-005是全局合取，不允许部分owner成功显示全局完成。
local contract/阶段验证只能报告相应scope；Desktop产品实际验收必须正式SDK、native/适用AT、支持矩阵与批准质量全部满足。safe read-only/unavailable是未开放能力的正确姿态，其边界可验证，但不等于其正向能力已经交付。

## 8. 回填草稿

正式06 §2回填本步§7裁决结论/表/schema；过程停审、差异和自检留本文件，不冒充实际结果。

## 9. 待确认事项

CHAT-UP001～009/WS-UP001～008/BASE001/native/OS/AT/生产预算/精确版本/来源/发布/归档继续open/blocked。角色、build、run_id、报告、actualEV、风险接受与签署均waiting；没有当前放行或readiness。

## 10. 自检及下一Step门禁

P0/增强/mobile/owner内部范围可判定，项目五tab与三层流程一致。 本地规则设计gate pass_with_upstream_blockers；允许Step3先读取台账/flow/当前产物与对应SOP，不创建其它未来Step。
