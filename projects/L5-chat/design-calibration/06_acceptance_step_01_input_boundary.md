# L5-chat 06 · Step 1 与上游文档的关系声明

## 1. Step状态

> done / pass_with_upstream_blockers；2026-10-01。这里只定义验收规则，所有TC/EV为planned预约，无实际验收结果或签署。

## 2. 本步输入

当前00～05/05停审台账；06 SOP Step1、书写规范5.1；00实际36AC、03契约、04配置、05TC/EV和证据schema；中间产物§5.10与真相源§7。

## 3. SOP问题回答

依据什么、消费哪些证据、版本环境如何固定、哪些超范围、缺口是否阻碍规则设计？§1.1～3明确；缺实际数据阻断送验，不阻断定义。

## 4. 当前文档问题诊断

旧06主语是旧ChatThread等体验对象，旧版本/假Accepted状态不能承接当前设计；SDK/native/run缺失仍应定义可判定条件。

## 5. 改动前后对比

| 改前 | 改后 | 原因 |
|---|---|---|
| 旧06主语是旧ChatThread等体验对象，旧版本/假Accepted状态不能承接当前设计；SDK/native/run缺失仍应定义可判定条件。 | §7结构化裁决 | 保持正式contract/TC/EV与证据能力一致 |

## 6. 验收裁决取舍与复杂度

基于当前00～05full-restart；private子gate便于粒度且不污染05AC注册。输入表为简单裁剪，保留历史后置诊断。

## 7. 结构化中间产物

### 1.1 输入与裁决职责

| 来源 | 正式输入 | 本文裁决 | 来源成熟度 |
|---|---|---|---|
| [00需求](../00-需求文档.md) §9～14 | 21F/4增强、28BR/4增强、五数据类别、24NFR、36AC及七否决 | 继承parentAC与红线，不改需求 | 设计停审，BASE001 open |
| [01架构](../01-架构设计.md) | Desktop-first/sharedUI、SDK-only/owner划分 | 编译/runtime/event边界、平台证明 | 设计停审，正向binding未闭 |
| [02概要](../02-概要设计.md) | 会话/项目/成员入口、项目五tab、whole-stage-node、目录 | 功能入口/状态安全等价 | 设计停审 |
| [03详细](../03-详细设计.md) §5～15 | 43协议/flow、17主体/12enum、15error、root/slot CAS、单dispatch | 字段/状态/副作用与恢复符合合同 | 全部实现planned |
| [04配置](../04-配置设计.md) §6～12 | 八域14字段/6profiles/12cuts、严格来源/预算 | 配置fail-closed，批准native来源独立 | 示例非production预算 |
| [05测试](../05-测试方案.md) §5/6/12～14 | 216TC族、16suite/EV、scope与schema/digest/退出条件 | 证据可采信、完整且同层，不重写测试 | EV只是预约，无真实run |
| 交付/环境/数据/实际报告 | actualbuild/source/SDKcapability/native/AT/预算/权限 | 固定送验baseline后才能实际裁决 | 当前全部waiting/blocked |
| SDK/各owner正式00～07/台账 | formal safe public contract/authority/cursor/result | 只验Chat消费边界，不验owner内部全实现 | 前序阅读记录继承，上游blocker保留 |
| L1-governance06 | 逐门禁/否决/风险结构参考 | 不复制后端UoW/outbox/audit或宽松P0waiver | reference-only |
| 旧06/README、未停审L6-bridges | 历史污染/兄弟边界审计 | 旧ChatThread/InputDraft/ChatReplyState不输入 | historical_material/boundary-only |

### 1.2 编号、证据与裁决分域

00的36个AC原ID保留，子门禁GATE-CHAT-*只是06私有裁决索引，不进入00需求或03客户端enum。七个00否决方向在§11固定VETO-CHAT-001～007；证据造假/硬门禁绕过可根据同一红线设专项VETO，不能被risk覆盖。
TC与EV唯一来源05，不新增用例/EV或声称其已执行。05 evidence-index.ac_refs按原声明校验，06通过独立acceptance bindings把parentAC/子gate/具体TC与EV连接；共享EV必须取正确TC/variant及proof_scope，不擅自改测试索引或给fixture加formal能力。
本文定义三值最终裁决规则，不填任何当前最终结论/签署；actualbaseline、build/run缺失时送验posture blocked，不把规则设计完成称为通过。

### 1.3 边界

不安排开发/commit/boundary/上线runbook，不建立Conversation/Governance/Process/目录truth，不发起审批/工具/推理/观测backend行为。07完成才创建implementationledger和全部planned boundary skeleton，本轮不创建。

## 8. 回填草稿

正式06 §1回填本步§7裁决结论/表/schema；过程停审、差异和自检留本文件，不冒充实际结果。

## 9. 待确认事项

CHAT-UP001～009/WS-UP001～008/BASE001/native/OS/AT/生产预算/精确版本/来源/发布/归档继续open/blocked。角色、build、run_id、报告、actualEV、风险接受与签署均waiting；没有当前放行或readiness。

## 10. 自检及下一Step门禁

六类当前来源/历史与边界分清，36AC与216TC/16EV不变。 本地规则设计gate pass_with_upstream_blockers；允许Step2先读取台账/flow/当前产物与对应SOP，不创建其它未来Step。
