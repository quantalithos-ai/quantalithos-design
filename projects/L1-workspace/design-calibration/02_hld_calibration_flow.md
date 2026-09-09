# L1-workspace 02 概要设计校准流程

> 模式：full-restart / single-agent-serial；日期：2026-09-07。
> 用户授权：完成全部02；此前另授权03 Step1~10。当前正式02已完成，按逐文档停审纪律在此暂停；后续03仍以Step10为范围上限。
> 当前恢复点：Step 14 complete / formal_stop_review；正式02写入关闭；本轮不创建03。

## 1. 执行边界

仅修改本项目；不写实现、不运行测试、不提交。00/01 为当前正式基线，README/draft/旧 ADR 只做后置污染审计。六 L1 owner 真相、授权、runtime/tool、seed/archive、SDK/UI 均不转移到本仓。
门禁值仅用 pass/blocked/not_applicable；done 表示产物完成，不表示上游接缝已可运行。

## 2. 总流程计划及状态台账

每步均先回读项目台账、本文、前步及表内输入；每步仅在执行时创建文件。Step 5~9 逐组成部分先依据/诊断/取舍，再结构化、回填、自检；所有部分后跨部分审计。当前步骤的细分批次见本步状态区。

| Step | 主题 | 输入文件/定位 | 输出文件 | 前序 | 状态 | 当前模块 | gate_status | gate_reason / 完成门禁 | next_allowed_action |
|---|---|---|---|---|---|---|---|---|---|
| 1 | 确认上游输入边界 | 00/01；上游正式设计与台账 | `02_hld_step_01_upstream_boundary.md` | 用户完成全部02 | done | self_reviewed | pass | 本Step回填草稿及静态自检完成；上游blocker保留 | 读取并开始Step 2 |
| 2 | 目标与范围 | Step 1；00 §4/9、01 §14 | `02_hld_step_02_goals_scope.md` | Step 1 | done | self_reviewed | pass | 本Step回填草稿及静态自检完成；上游blocker保留 | 读取并开始Step 3 |
| 3 | 约束条件 | Step 2；00 §10、01 §9/13 | `02_hld_step_03_constraints.md` | Step 2 | done | self_reviewed | pass | 本Step回填草稿及静态自检完成；上游blocker保留 | 读取并开始Step 4 |
| 4 | 代码主体框架 | Step 3；01 §6~11 | `02_hld_step_04_code_subject_framework.md` | Step 3 | done | self_reviewed | pass | 本Step回填草稿及静态自检完成；上游blocker保留 | 读取并开始Step 5 |
| 5 | 组成部分与边界 | Step 4；00 §9、01 §6/9 | `02_hld_step_05_components_boundary.md` | Step 4 | done | self_reviewed | pass | 本Step回填草稿及静态自检完成；上游blocker保留 | 读取并开始Step 6 |
| 6 | 关键对象 | Step 5；01 §9；闭环标准 | `02_hld_step_06_key_objects.md` | Step 5 | done | self_reviewed | pass | 逐CP恢复补审完成 | 读取Step7 |
| 7 | 接口骨架 | Step 6；01 §10；上游接缝 | `02_hld_step_07_api_interface_skeleton.md` | Step 6 | done | self_reviewed | pass | Step7完成；文档02仍在进行 | 读取Step8处理流输入 |
| 8 | 处理流 | Step 7；Step 5/6 | `02_hld_step_08_processing_flows.md` | Step 7 | done | self_reviewed | pass | 14处理流及跨流审计完成 | 读取Step9状态规范与Step6/7/8 |
| 9 | 状态机 | Step 8；Step 6/7 | `02_hld_step_09_state_machine.md` | Step 8 | done | self_reviewed | pass | 七CP状态及传播审计完成 | 读取Step10异常边界标准 |
| 10 | 异常边界 | Step 9；00 §14 | `02_hld_step_10_exceptions_boundaries.md` | Step 9 | done | self_reviewed | pass | 28异常场景审查完成 | 读取Step11配置影响及01横切约束 |
| 11 | 配置影响 | Step 10；01 §13 | `02_hld_step_11_configuration_impact.md` | Step 10 | done | self_reviewed | pass | 配置影响及不可配置边界审查完成 | 读取Step12承接规范与Step4~11 |
| 12 | 详细设计承接 | Step 4~11 | `02_hld_step_12_detailed_design_handoff.md` | Step 11 | done | self_reviewed | pass | 稳定输入与回退规则审查完成 | 读取Step13风险和owner待回流记录 |
| 13 | 风险与待确认 | Step 12；上游台账 | `02_hld_step_13_risks_open_questions.md` | Step 12 | done | self_reviewed | pass | 风险与上游门禁审查完成 | Step14装配前全链静态审查 |
| 14 | 正式装配 | Step 1~13；概要规范 | `02_hld_step_14_formal_document_assembly.md` | Step 13 | done | formal_stop_review | pass | 正式02完成停审，外部blocker保留 | 等待本次停审后的明确继续；随后03 Step1 |

## 3. 标准与输入台账

| 材料 | 使用范围与当前判断 |
|---|---|
| 设计文档编写通则 §1；中间产物规范 §3/4；闭环标准 §2.6~2.7.1/3.6/5/6 | 先单元后装配、三层门禁、resolver-first、projection identity、幂等/rebuild 来源 |
| 概要设计讨论流程 SOP 全14步；书写规范 §二~四/ASCII/评审 | 新14章优先，旧章节参考不覆盖新规范 |
| 全局依赖规则 §4.1 | workspace 完整停审后 archive，当前不推进 archive |
| 本项目正式 00/01、01 flow、Step16、项目台账 | 当前正式需求架构输入；本轮不改 00/01 |
| L0-core / L0-bus / L0-sdk 正式02、03相关段及02 flow | 共享契约候选、bus传递/准备、SDK消费隔离；名称不等于已实现符号 |
| identity / work / conversation / process 正式02/03相关边界及02 flow | 真相与安全查询、项目成员归属；现有业务查询不等于完整 workspace 合同 |
| governance / artifact 正式02/03与02 flow、artifact项目台账 | 对象卡片/接缝/状态粒度；不继承治理/制品职责；governance无项目级台账，以现有flow辅助 |
| runtime / tools 正式02、项目台账 | 07停审、实施未启动；执行边界不入workspace |
| member / member-service / member-images 正式02及项目台账 | 07停审；项目型执行双锚、static/live分界；MI-UP-006仍开放 |

未声称本轮逐行重读全部上游00~07；本轮专题复核承接01已登记输入，精确调用/字段仍须owner核验。
上游文档残留 Draft/早期 flow 表述不作实现就绪依据；引用其稳定 ownership，开放接缝维持 blocker。

## 4. 持续 blocker 与权限边界

WS-UP-001~008、WS-UP-006-S 原样开放。对应正向 source/visibility/event/attention/export/compile 路径保持 blocked；不阻止本地对象与保守失败骨架校准，不等于可落码交付。
发现 owner 缺口只写本地待回流目标，未跨项目写入、未通知 owner，实际回写需额外授权。

### 4.1 03 Step6触发的局部回源补正

2026-09-07：只修02 §6 LocalAttentionState.read_cursor为read_cursors: ReadCursorSet，与02 Step6对应对象卡同步；各正式attention stream独立意图且集合去重，不增加公开API/状态/owner。stream来源与比较仍WS-UP-004，03不得自行定义。补正后02维持formal_stop_review，其余内容未重开。

## 5. 写入与审计纪律

每个 Step 文件保留十段、Step 内计划及写入前检查。正式装配仅摘录已完成 Step 的结构化产物/回填草稿。
读源、owner、no-write、visibility、cursor、幂等、generation、overlay、fake证据上限逐步审计。
本流程已完成并记录formal_stop_review；本次不创建03。下一轮明确继续后从03 Step1进入，不跳前序、不超过Step10，绝不伪造02已被逐章人工签署。
