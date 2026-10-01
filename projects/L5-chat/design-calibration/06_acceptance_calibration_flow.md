# L5-chat 06 验收标准校准流程

> 2026-10-01启动；2026-10-02正式停审；full-restart / single-agent-serial。
> 授权：用户“现在完成全部06”。Step1～15依次校准，前序local gate通过才创建下一Step；正式06原路径重写后立即停审，不进入07。
> 当前：Step1～15 done / formal_stop_review；gate_status pass_with_upstream_blockers；implementation not_started。
> 范围仅projects/L5-chat设计/校准/台账；不实现代码、SDK、其他项目写入、应用测试、真实run/报告/证据/验收结论或commit。

## 1. 顺序计划

| Step | 主题 | 文件 | 状态 | gate |
|---|---|---|---|---|
| 1 | 与上游文档的关系声明 | 06_acceptance_step_01_input_boundary.md | done | pass_with_upstream_blockers |
| 2 | 验收目标与范围 | 06_acceptance_step_02_scope.md | done | pass_with_upstream_blockers |
| 3 | 验收基线 | 06_acceptance_step_03_baseline.md | done | pass_with_upstream_blockers |
| 4 | 进入条件与退出条件 | 06_acceptance_step_04_entry_exit.md | done | pass_with_upstream_blockers |
| 5 | 功能验收门禁 | 06_acceptance_step_05_functional_gates.md | done | pass_with_upstream_blockers |
| 6 | 数据边界与架构红线验收 | 06_acceptance_step_06_data_architecture_redlines.md | done | pass_with_upstream_blockers |
| 7 | 接口、事件与跨仓同步验收 | 06_acceptance_step_07_interface_event_sync.md | done | pass_with_upstream_blockers |
| 8 | 状态机、事务与一致性验收 | 06_acceptance_step_08_state_consistency.md | done | pass_with_upstream_blockers |
| 9 | 非功能验收门禁 | 06_acceptance_step_09_nonfunctional_gates.md | done | pass_with_upstream_blockers |
| 10 | 可观测性、审计与证据门禁 | 06_acceptance_step_10_evidence_gates.md | done | pass_with_upstream_blockers |
| 11 | 一票否决项 | 06_acceptance_step_11_veto.md | done | pass_with_upstream_blockers |
| 12 | 缺陷分级、复验与放行规则 | 06_acceptance_step_12_defects_retest_release.md | done | pass_with_upstream_blockers |
| 13 | 风险接受与遗留项 | 06_acceptance_step_13_risk_acceptance.md | done | pass_with_upstream_blockers |
| 14 | 最终结论与签署 | 06_acceptance_step_14_verdict_signoff.md | done | pass_with_upstream_blockers |
| 15 | 参考 | 06_acceptance_step_15_formal_document_assembly.md | done | pass_with_upstream_blockers |

## 2. 验收项小循环纪律

Step5～11逐验收主题/门禁执行：来源→设计contract→TC→固定EV/report及machine追溯→通过/失败条件→裁决影响→本项local停审。全部项停审后才作跨门禁审计，不先生成全局大表再补证据。逐cut审查记录在当前Step；不得把设计停审写成实际验收通过。每patch≤180行，正式正文去问题/诊断/取舍/过程审查。

## 3. 当前输入

当前00～05与05flow/Step15；06 SOP/书写规范；中间产物§5.10、真相源§7、全局依赖Layer5窗口。前序各owner00～07及必要台账阅读沿用03/04/05来源记录，本轮核对必要SDK/owner边界；Governance06仅参考结构，未停审L6-bridges不输入。旧06/README仅historical_material，旧ChatThread/InputDraft/ChatReplyState和旧门禁不继承。

## 4. 编号与证据

00已定义36个AC（5核心+14功能+5规则+5数据+7NFR）；BASE001不造AC-NFR008～024。子项用GATE-CHAT-*，不是新增需求AC或客户端状态。继承05的216TC/16suite/16plannedEV；EV本轮只预约，不生成实际证据。05 primary ac_refs不改；06独立acceptance binding显式连接parentAC/具体TC/EV，不升级fixture scope。

## 5. blocker与下一动作

CHAT-UP001～009、WS-UP001～008、CHAT-BASE001、native/AT/预算/版本/来源/发布/质量/归档保留open/blocked。没有build/run/签署/实际riskacceptance。正式06十五章已在原路径重写，当前立即停审，不进入07。完整验收baseline缺失禁止实际送验/放行。后续只有用户授权07后才读取实施SOP/书写规范、03§16与05/06的baseline、门禁、证据成熟度和阻塞交接；implementation ledger及planned boundary skeleton仅正式07完成时创建。

## 6. 正式停审记录

2026-10-02停审复核：Step1～15逐Step完成，正式06按十五章主链装配。18份本轮文档的章节来源、相对链接、围栏、表格列及原路径重写检查通过；36实际AC、142唯一子gate、216既有plannedTC、16既有plannedEV、10VETO无孤儿或TC/EV错绑，43协议/17主体/12enum与当前03一致。验收私有schema的15个接口、117字段传递类型和必填声明已静态核对，00～05六个文件指纹未变，git diff --check通过。

反向校准在原06 Step中完成：AC-CHAT-005聚合无自依赖；ExpectedInstance不造缺case的FileRef/hash；签署inputdigest纳入defects及全部输入bytes摘要，E018不依赖final署名。过程十表/逐项/跨门禁审计留Step15等中间产物，正式只保留收口规则。这些是文档静态检查，不是应用测试、实际EV、验收结论、发布或readiness；无实现、安装、编译、真实run、签署、实施ledger/skeleton或commit。
