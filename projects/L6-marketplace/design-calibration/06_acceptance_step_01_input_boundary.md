# Step 1：确认验收输入边界

## 1. Step 状态

对应验收SOP Step1；回填正式§1。status=completed/selfcheck_done/stop_review；gate_status=pass（设计）；gate_reason=权威表、历史差异与证明上限完成；next_allowed_action=读取Step2范围输入。无实际验收。

### 1.1 Step 内计划

| 小阶段 | 状态 | 产物/门禁 |
|---|---|---|
| 读取输入和前序结论 | done | §2/九owner恢复来源 |
| SOP逐问题回答 | done | §3 |
| 当前/历史材料诊断 | done | §4；旧06后置读取 |
| 设计取舍 | done | §6 |
| 结构化中间产物 | done | §7权威与证明上限 |
| 复杂度/附录判断 | done | 九owner表留主控，不新增业务schema |
| 回填草稿 | done | §8→正式§1 |
| 自检/进入下一步 | done | §9/10→Step2 |

## 2. 本步输入

source_files：当前正式00～05及05Step15/静态记录；00§14/15、03§17及Step18、04§14、05§12～14；验收SOP全文/书写规范全文；通用规范开工/重建/八项计划/闭环§2.15及§7；九owner正式03及必要ledger/flow。05已由用户“现在完成全部 06”确认为输入。历史README/draft/旧06不是当前设计输入。

九owner为SDK、Identity、Governance、Artifact、Method、Hub、Images、Obs、Archive。前三项目ledger未找到时读取正式03和03 flow，记录现有状态，不推断已实现。其余读取project_execution_ledger当前恢复点；本轮不修改其文档/台账。

## 3. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 依据哪些需求和设计？ | 当前00～04；五能力/104ID/20AC/五VETO、七U、43对象/17ports/146methods/49入口/14carrier/222pair及配置。 |
| 哪些测试证据支撑？ | 05的98TC↔98EV、13CUT/13DS、11suite/22planned脚本、same-run schema/DAG；不是已运行报告。 |
| 交付、环境、数据基线？ | 未来actual implementation baseline、test/qualified staging、13DS/manifest及explicit run；当前均未提供，Step3固定必填语义。 |
| 哪些属于05/07？ | 不重新定义TC/数据构造/执行编排或phase/commit；DTO/port/state/error/config/owner资格也不由06新造。 |
| 哪些输入不足？ | 真实实现/run/owner positive/auth/Gov binding/材料/receiver/notice/Obs资格缺失；只限制受影响formal scope，不阻断本轮设计。 |

## 4. 当前文档问题诊断

05§13仅run-scoped机器draft与notes，验收规范另要求三个固定入口；Step3/10须明确入口只为人工导航，不能成为跨run机器truth。04§14误称MP-SRC-003的语义沿03§17解释为技术栈差异，human/auth只MP-UP-003，不改04。

独立结论后全文读取旧06（185行）：旧§1/4以PackageRelease/InstallRecord/EntitlementView/RatingReview/RankingView为正式对象，旧§5有无来源P95<200ms，旧§9以TL/finance/growth槽位冒风险接受。全部废弃，不继承旧10章、状态、百分比样本承诺、付款订阅或评审人。保留其“市场不等源truth”的方向，仅因当前00～05再次独立确认后进入新文档。

## 5. 改动前后对比

| 项 | 旧风险 | 独立结论/原因 |
|---|---|---|
| 基线 | 原型/旧稿被当交付 | 正式00～05唯一输入，避免第二truth |
| 资格 | 设计07或fake被当支持 | exact consumer/operation/type/scope单独资格 |
| 裁决 | 写文档便填通过 | 未送验/未裁决，不产生verdict |

## 6. 设计取舍

采用需求/设计/测试三角闭环且scope显式绑定。未采用继承旧06结论或补造owner接口：会与full-restart及truth归属冲突。固定入口采用人工记录方向，机器证据仍由05 schema约束；具体字段与绑定待Step3/10收口。

## 7. 结构化中间产物

| 来源 | 验收输入 | 如何裁决/限制 |
|---|---|---|
| 00 | 五能力、20AC、五VETO、104ID | AC稳定，不增财务范围；VETO触发必不通过 |
| 01/02 | 运行单元、依赖、七U/ownership | frontend无authority，listing独立于Method/Hub |
| 03及规范性附录 | 对象/协议/状态/frame/error/replay/paging | 以完整schema、flow、enum作断言来源，不接受口语近似 |
| 04 | 六域/七字段/八slot/四profile | config不能产生资格；test fake不外推生产 |
| 05及规范性附录 | 98TC/EV/11suite/13DS、schema/DAG | actual同run raw/report才可引用；工具不是verdict |

| 上游当前正式03/状态入口 | 市场消费边界 | 本轮恢复结论 |
|---|---|---|
| [SDK](../../L0-sdk/03-详细设计.md) / [flow](../../L0-sdk/design-calibration/03_ddd_calibration_flow.md) | ReadServiceCapability/InvokeServiceCapability、正式consumer映射 | generic facade不保证五type及operation支持，MP-UP-001/002等保留 |
| [Identity](../../L1-identity/03-详细设计.md) / [flow](../../L1-identity/design-calibration/03_ddd_calibration_flow.md) | AI主体body-free ref | 非human/org/auth owner，MP-UP-003不关闭 |
| [Governance](../../L1-governance/03-详细设计.md) / [flow](../../L1-governance/design-calibration/03_ddd_calibration_flow.md) | GetGateDecision及formal result refs | exact basis/material/scope/current/probe仍待核；MP-SRC-010保留 |
| [Artifact](../../L1-artifact/03-详细设计.md) / [ledger](../../L1-artifact/design-calibration/project_execution_ledger.md) | immutable source/material refs | 设计07待审不证明材料/市场exports，正文血缘归owner |
| [Method](../../L3-method-library/03-详细设计.md) / [ledger](../../L3-method-library/design-calibration/project_execution_ledger.md) | Method/Role/ProcessTemplate定义及消费材料 | 实施进度非市场资格；其旧commerce归属口径不授权Billing |
| [Hub](../../L3-capability-hub/03-详细设计.md) / [ledger](../../L3-capability-hub/design-calibration/project_execution_ledger.md) | registry/adapter body-free directory material | 独立reason修复anchor pending，exact consumer仍affected，不合并listing |
| [Images](../../L2-member-images/03-详细设计.md) / [ledger](../../L2-member-images/design-calibration/project_execution_ledger.md) | local supply/immutable image refs | B01/B02/consumer/material资格仍blocked；entry非安装确认 |
| [Obs](../../L4-observability/03-详细设计.md) / [ledger](../../L4-observability/design-calibration/project_execution_ledger.md) | safe producer/admission/receipt/probe | 12affected保留，receipt非evidence/signoff |
| [Archive](../../L4-archive/03-详细设计.md) / [ledger](../../L4-archive/design-calibration/project_execution_ledger.md) | 当前没有market source lane | 0market writer/restore，不能借Archive修市场truth |

文档静态检查只证明设计链接/库存；本地实现测试只证明声明scope语义；formal integration只证明该run/exact contract；三者均不是批准、安装、支付、送达、风险接受或生产readiness。

## 8. 回填草稿

正式§1候选：当前00～05为正式输入，03/05指向的规范性附录必须随读。旧06/README/draft/原型只历史或讨论输入。06仅固定scope/baseline、消费actual TC/EV/report、定义三值裁决/否决/风险/签署；不重复测试或实施计划，不改变ownertruth，未送验时不填写verdict。

## 9. 待确认事项

十二开放项不关闭；MP-SRC-003标签冲突不影响当前规则，不擅自回写04。没有接受人/签署人/运行实例。

## 10. 进入下一步条件

设计自检：五个SOP问题、五类输入、九owner来源/状态、旧06污染和证明上限齐备；无新接口/TC/资格。Step1独立停审通过，连续06授权允许Step2；下一读SOP Step2/规范5.2、00§4/14和05§2/12。正式装配等Step15，无需提交。
