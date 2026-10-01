# L5-chat 07 · Step 1 与上游文档的关系声明

## 1. Step状态

> done / gate_status=pass（仅设计/文档静态门禁）；2026-10-02。implementation仍planned/blocked/waiting，无实际实现或测试结果。

| field | value |
|---|---|
| gate_status | pass |
| gate_reason | 本步设计规则、来源及最终跨文档静态闭环检查通过；不关闭上游blocker，不是implementation gate结果 |
| next_allowed_action | Step2已按本轮连续授权执行；07最终停点见flow，不能据此进入代码实施 |
| source_files | 本步§2/§7所列正式00～06、对应规范与前序Step；[07flow](07_implementation_plan_calibration_flow.md)、[项目台账](project_execution_ledger.md) |


## 2. 本步输入

正式00～06、当前项目台账与06停审记录；07 SOP Step1、书写规范5.1；中间产物§5.10、真相源§7/§9和实施台账规范。

## 3. SOP问题回答

输入齐否、版本、可落码程度、测试/验收一致性与缺口分类：§1.1～4逐项回答；七个正式文件指纹固定，真实SDK/native/provider等与代码实施授权分开。

## 4. 当前文档问题诊断

07文件尚不存在；直接照搬README实施条目会丢当前字段/状态、Process/provider与证据成熟度。

## 5. 改动前后对比

| 改前 | 改后 | 原因 |
|---|---|---|
| 07文件尚不存在；直接照搬README实施条目会丢当前字段/状态、Process/provider与证据成熟度。 | 本步§7收口规则 | 阶段/门禁可执行且不伪造事实 |

## 6. 设计取舍

从当前00～06重新规划；本步表格足以表达输入，无调用图。观察HEAD只记录事实，不当批准baseline。

## 7. 结构化中间产物

### 1.1 输入与职责

| 输入 | 本计划使用 | 必须先读 | 未闭合处理 |
|---|---|---|---|
| 当前00/01/02 | 需求范围、SDK/owner边界、Desktop-first、五tab/流程/目录 | 是 | 不改需求或架构，BASE001保持open |
| 当前03 §3～16 | 单TS app/单host crate、文件、43协议/flow、17主体/12enum、15error、CAS与幂等 | 是 | 契约缺失回设计，不由07补字段 |
| 当前04 §5～12 | flat14、八域、六profiles、配置source与十二cut | 是 | 示例不是生产预算或native授权 |
| 当前05 §6/9/12～14 | 216TC/16suite/16plannedEV，runner与schema/digest/maturity | 是 | 证据预约不等真实执行 |
| 当前06 §3～14 | 36AC、142子gate、10VETO，风险/缺陷/签署和私有DTO | 是 | 规则设计不等验收通过 |
| 07 SOP/书写规范、实施台账规范、真相源§9 | phase/boundary小循环、scope/checks/ledger与审计 | 是 | 当前只编写设计，实施门禁不得pass |
| 原型/draft | 已确认页面与交互约束，辅助场景核对 | 按范围 | 原型不是owner contract或运行证据 |
| 旧README及兄弟L6-bridges | historical_material/boundary_reference | 非正式输入 | 不吸收外部映射或未停审合同 |

### 1.2 固定设计输入

以下为2026-10-02读取的文件bytes SHA256，固定讨论来源；不是实现commit、build或测试证据。正式07自身不得通过内嵌自身hash制造循环，装配完成后指纹写入实施台账。

| 文件 | SHA256 | 基线 |
|---|---|---|
| [00-需求文档.md](../00-需求文档.md) | 3a203146d26425d80ad96e0c1fb3d51f87bc7398fb90f4355664e4fd4a25ff22 | 当前停审正式文件 |
| [01-架构设计.md](../01-架构设计.md) | 8c9153119a31bcb6157fa2bd0f286f893119e269e57c61080b338562a47dfccd | 当前停审正式文件 |
| [02-概要设计.md](../02-概要设计.md) | 1dc2045af896bf42eed7f67cc6c2a80720334018c88e4e0304ada8c915608a46 | 当前停审正式文件 |
| [03-详细设计.md](../03-详细设计.md) | 7ab053d19d62203b2d1df6335b8d79e867538bb3e9756cf3d0bd3e488e51475e | 当前停审正式文件 |
| [04-配置设计.md](../04-配置设计.md) | 6ae59433d3277e02a695951bcd9f0c718e180fe87798995b9ce511a18c48807a | 当前停审正式文件 |
| [05-测试方案.md](../05-测试方案.md) | 37fff31333c246b4d45c661d6000e16afaee1e75eae34282c9e97e4eb14ac39f | 当前停审正式文件 |
| [06-验收标准.md](../06-验收标准.md) | cbd5c88fafd2145eff9bcef0ffd4142e7caa7ac0547cce63d2510b4a2d153ee1 | 当前停审正式文件 |

当前只读观察到设计仓HEAD为 `74de0dcd2a04a39b8e69d1b479919da7d44de992`，工作树含当前正式设计改动；该HEAD不能代表本轮00～07已入commit或已批准实施。实际Design Gate必须固定包含批准设计的真实commit与工作树状态；未授权commit时 `current_design_baseline=waiting`、gate_status=blocked，不用观察HEAD或临时占位hash冒充批准基线。

### 1.3 上游消费与闭环裁剪

| 上游 | 正式阅读/当前核对 | 消费边界 | 实际可用性 |
|---|---|---|---|
| L0-sdk | 当前00～07，前序语义阅读，本轮8文件指纹；实际package @quantalithos/sdk@0.1.0 | 唯一业务compile dependency；typed auth/query/command/change/ref | skeleton不证Chat capability，CHAT-UP001 blocked |
| L1-conversation | 当前00～07/必要来源记录 | Conversation/Turn/Participant/cursor/visibility | CHAT-UP002 blocked |
| L1-identity / L1-work | 各当前00～07 | 身份、Project/WorkItem/成员安全摘要 | CHAT-UP006/009 blocked |
| L1-governance / L1-artifact | 各当前00～07与必要台账 | Gate/Decision/受控意图、Artifact ref/preview | CHAT-UP003/004 blocked |
| L1-workspace | 当前00～07及项目台账 | 只读safe view/export，source与freshness | CHAT-UP005/WS-UP001～008 blocked |
| L2-member / L2-runtime | 各当前00～07及项目台账 | 在场/交互边界与运行摘要各自owner | CHAT-UP006 blocked |
| L4-observability | 当前00～07及项目台账 | 显式低敏支持交接，不造backend/业务EV | CHAT-UP007 blocked；默认disabled |
| L1-process补充 | 已读正式01/02和本轮必要safe-topology来源 | Process whole/stage/node/fork/branch/join只正式projection | CHAT-UP008 blocked，不从Work/log重建 |
| 关系owner / 公司目录provider | 尚未正式绑定 | 群聊最多一项目、多群成员可不同、公司/项目/群聊集合分立 | CHAT-UP009 blocked |

十个指定上游共80份当前正式00～07指纹已刷新；现有必要台账按本轮相关boundary补读。以上不表示SDK public binding/owner实现可用。

### 1.4 允许规划与禁止开工

| 复核项 | 当前设计结论 | 阻塞范围/动作 |
|---|---|---|
| 字段/DTO/ports/状态/错误/CAS | 当前03/04定义齐，05/06逐名承接 | 允许讨论local实现顺序；各boundary仍需逐项复核 |
| TC/EV/gate | 已有216/16/142与10VETO正式注册 | 不新增TC/EV/AC；按boundary分配职责和分层证据 |
| SDK/Process/provider/native/预算 | 正向能力和批准来源未具备 | 保持真实集成blocked，不私补SDK/export/host授权 |
| 目标实现仓 | /home/aris/Projects/quantalithos-chat当前不存在 | planned目录；本轮不创建，不阻止编写计划 |
| 原型图库与版本 | 真正安全输入格式/许可/AT/兼容尚未确认 | 先只读viewer Spike；不私造BPMN XML，不默认批准library |
| 实施授权/approved design commit | waiting | 只能设计与创建planned台账，不能实现、运行、commit或handoff ready |

本步允许进入后续07设计；不允许将任何实际开工门禁写成pass。没有本地详细契约冲突被交给实现者补；外部缺口进入专项Spike和明确阻塞边界。

## 8. 回填草稿

正式07 §1仅回填本步§7已收口结论，过程审计留本文件；不得新增未校准phase/boundary或证据结论。

## 9. 待确认事项

CHAT-UP001～009、WS-UP001～008、CHAT-BASE001、SDK/Process/provider、native/OS/AT、质量预算/版本/source/release/归档继续open/blocked；实现授权与approved07 commitbaseline均waiting。实际实现、build/run/EV、接受与签署不存在。本地结构闭口不关闭真实集成blocker。

## 10. 自检及下一Step门禁

43协议、17主体、16suite/EV、142gate/10VETO注册已核；七个输入指纹已固定，所有真实层与实施授权保持blocked。 本步只作设计/文档静态检查，不是应用测试或readiness。本地门禁通过后仅允许Step2读取对应规范和来源。
