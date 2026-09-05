# Step 15. 整理正式验收标准文档

> 对应 SOP：`standards/document/验收标准讨论流程_SOP.md` Step 15
> 回填章节：完整 `projects/L2-member/06-验收标准.md`
> 粒度参考：`projects/L1-governance/design-calibration/06_acceptance_step_15_formal_document_assembly.md`

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 15 整理正式验收标准文档 |
| 当前状态 | 已完成；正式 06 已按 full-restart 装配并停审 |
| 输入基线 | Step 1～14 中间产物、当前正式 `00~05`、验收标准 SOP / 书写规范 |
| 输出文件 | `projects/L2-member/06-验收标准.md`；本文件 |
| 事实等级 | 仅完成设计级验收标准；没有真实 run、artifact、report、EV 实例、verdict、signoff 或 readiness |
| 停审方式 | 完成 06 后等待用户确认；未经新的明确确认不得创建或进入 `07-实施计划.md` |

## 2. 本步目标

把 Step 1～14 的验收中间产物装配为可裁决的正式 `06-验收标准.md`，同时保持：

- 规范固定的 15 章主链；
- 每章具有具体 calibration source 和延伸阅读入口；
- `C-L2M-1~5`、`AC-L2M-001~033`、`VF-L2M-001~009`、`NFR-L2M-001~016` 可回指当前正式 `00~05`；
- 10 Command、16 Query、14 Consumer、24 outbound semantic candidate、5 Job、28 个状态主语和七模块分母完整；
- `L2M-UP-001~008`、`L2M-DDD-001~007`、`scope_supersede_gap` 和 `L2M-UP-005` 下 24 candidate 继续保持 blocked / pending / reserved；
- 不把 planned 设计、fake、blocked、not_run 或静态映射写成真实验收事实。

## 3. 本步输入

| 输入 | 主要用途 | 状态 |
|---|---|---|
| `06_acceptance_step_01_input_boundary.md` | 正式输入、历史隔离、事实等级 | completed |
| `06_acceptance_step_02_scope.md` | P0/P1/P2、范围和非范围 | completed |
| `06_acceptance_step_03_baseline.md` | source ref、run、artifact、report 基线 | completed |
| `06_acceptance_step_04_entry_exit.md` | 进入、退出、暂停门禁 | completed |
| `06_acceptance_step_05_function_gate.md` | C1～C5 与 AC-L2M-001~018 | completed |
| `06_acceptance_step_06_boundary_gate.md` | AC-L2M-019~026、数据和架构红线 | completed |
| `06_acceptance_step_07_interface_sync_gate.md` | 10/16/14/24/5 协议与跨仓协作 | completed |
| `06_acceptance_step_08_state_tx_consistency.md` | 28 状态、事务、幂等、一致性 | completed |
| `06_acceptance_step_09_nonfunctional.md` | NFR 与结构性非功能门禁 | completed |
| `06_acceptance_step_10_evidence_audit.md` | EV、报告、审计和真实性 | completed |
| `06_acceptance_step_11_veto.md` | VF-L2M-001~009 一票否决 | completed |
| `06_acceptance_step_12_defects_release.md` | S/A/B/R、复验、放行 | completed |
| `06_acceptance_step_13_risk_acceptance.md` | residual、owner、acceptor、截止和后续动作 | completed |
| `06_acceptance_step_14_conclusion_signoff.md` | 三值结论与签署口径 | completed |
| 当前正式 `00~05` | 唯一项目设计输入 | authoritative |
| 验收标准 SOP / 书写规范 | 章节、证据、结论和审计规则 | normative |

## 4. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 正式文档是否按 15 章主链组织？ | 是：关系声明、范围、基线、进入/退出、功能、红线、接口同步、状态一致性、非功能、证据、一票否决、缺陷放行、风险接受、结论签署、参考。 |
| 正式文档是否重新定义需求或实现？ | 否。正文只把已冻结的需求、设计、配置和测试契约转成裁决门禁；字段、状态、Port、transport、物理产品和实现任务仍由 owning 文档负责。 |
| 每条 P0 门禁是否可追溯？ | 是。每项绑定正式 `AC-L2M-*` / `VF-L2M-*`、`TC-L2M-*` 或 planned EV family、固定 report path 和失败影响。 |
| 24 candidate 如何处理？ | 只验 non-materialization 和 zero configuration；`L2M-UP-005` 关闭前不创建 envelope、publisher、outbox、route、topic、retry 或 DLQ。 |
| 当前是否有真实验收结论？ | 没有。正式 06 只保留 `<run_id>`、`<source-ref>`、`<signoff>` 等执行期占位；设计文档完成不等于验收通过。 |
| blocker 是否被当成通过？ | 没有。受影响正向 qualification 标记 blocked / not_run / pending；不以 fake、planned 或静态报告替代。 |

## 5. 当前文档问题诊断与处理

| 问题 | 处理 |
|---|---|
| 旧 06 以过时的 persona / endpoint 叙述为主，且缺少当前协议、状态和证据门禁 | 旧文件只作 historical material；按 15 章 full-restart 删除重建。 |
| 旧文档把外部成功、事件协作和本地事实压平 | 正式文档固定 local decision、attempt、gap、unknown 与 foreign truth 的层次。 |
| 旧文档没有 10/16/14/24/5 分母和 28 状态 | 正文加入完整分母和矩阵，细节由 Step 7～8 继续承接。 |
| 旧文档使用泛化环境、性能数字或未绑定证据 | 改为固定 source ref、profile、config digest、非 `latest` 的 run、artifact/report pair；性能只保留结构性 sample。 |
| 设计缺口容易被“有条件通过”掩盖 | `VF-L2M-001~009`、S 级、redaction、dependency 和 evidence integrity 不得风险接受；residual 必须有 owner / acceptor / deadline / follow-up。 |

## 6. 装配取舍

| 议题 | 采用方案 | 原因 |
|---|---|---|
| 正文是否复制全部 SOP 问题和测试步骤 | 只保留裁决规则，细节回指 calibration / 05 | 保持正式 06 可读且不变成第二份测试方案 |
| 是否填入真实执行值 | 不填，保留明确占位 | 当前没有实现和送验 run |
| 是否继承旧 06 的历史协议、指标或部署假设 | 不继承 | 与当前正式上游和 blocker 状态不一致 |
| 是否要求真实外部正向联调作为 P0 前置 | 不要求；按 P0 local / negative / blocked-aware 与 P1 selected-run 分层 | 保持兄弟项目并行窗口的边界和事实等级 |
| 是否允许 VETO / S / P0 红线进入有条件通过 | 不允许 | 防止风险接受越权 |

## 7. 正式章节来源映射

| 正式章节 | calibration 来源 |
|---|---|
| §1 与上游文档的关系声明 | `06_acceptance_step_01_input_boundary.md` |
| §2 验收目标与范围 | `06_acceptance_step_02_scope.md` |
| §3 验收基线 | `06_acceptance_step_03_baseline.md` |
| §4 进入条件与退出条件 | `06_acceptance_step_04_entry_exit.md` |
| §5 功能验收门禁 | `06_acceptance_step_05_function_gate.md` |
| §6 数据边界与架构红线验收 | `06_acceptance_step_06_boundary_gate.md` |
| §7 接口、事件与跨仓同步验收 | `06_acceptance_step_07_interface_sync_gate.md` |
| §8 状态机、事务与一致性验收 | `06_acceptance_step_08_state_tx_consistency.md` |
| §9 非功能验收门禁 | `06_acceptance_step_09_nonfunctional.md` |
| §10 可观测性、审计与证据门禁 | `06_acceptance_step_10_evidence_audit.md` |
| §11 一票否决项 | `06_acceptance_step_11_veto.md` |
| §12 缺陷分级、复验与放行规则 | `06_acceptance_step_12_defects_release.md` |
| §13 风险接受与遗留项 | `06_acceptance_step_13_risk_acceptance.md` |
| §14 最终结论与签署 | `06_acceptance_step_14_conclusion_signoff.md` |
| §15 参考 | 本文件与 Step 1～14 全部来源 |

## 8. 跨门禁裁决总审计

| 审计项 | 设计级结论 | 说明 |
|---|---|---|
| 15 章结构 | 通过 | 正文章节与验收标准书写规范一致。 |
| 每章具体来源 | 通过 | 每章开头标注对应 calibration 文件，并提供延伸阅读。 |
| P0 能力覆盖 | 通过 | C1～C5、AC-001~018、红线、状态、证据和 VETO 均有入口。 |
| 接口分母 | 通过 | 10 Command、16 Query、14 Consumer、24 candidate、5 Job 全部列出。 |
| 状态与一致性 | 通过 | 28 个正式状态主语、UoW、CAS、append-only、replay、rollback、unknown fence 均有门禁。 |
| 外部 owner 边界 | 通过 | Runtime、Tools、host、image、Governance、Conversation、Artifact、Bus、Observability 等只以 ref / safe material / attempt / gap 协作。 |
| 证据真实性 | 通过（规划） | 固定 artifact/report 路径和 index schema；实际实例待执行。 |
| blocker 传递 | 通过 | `L2M-UP-*`、`L2M-DDD-*`、scope gap 和 24 candidate 继续 blocked / pending。 |
| 历史污染隔离 | 通过 | 旧文件没有作为当前协议、指标、部署或结论来源。 |
| 真实事实伪造 | 通过 | 未写真实 run、artifact、report、EV、verdict、signoff 或 readiness。 |

## 9. 回填草稿

正式 `06-验收标准.md` 应直接使用 15 章正文，并在每章保留本文件第 7 节的具体来源。正式文档只写设计级规则与执行期占位，不产生任何测试或验收实例。

## 10. 待确认事项

| 事项 | 影响 | 当前处理 |
|---|---|---|
| 真实 `00~05` source ref、实现 commit、Core source ref | 进入真实验收 | 正文保留占位，执行前固定。 |
| `run_id`、profile、config digest、fixture / replay root | 证据和结论 | 禁止使用 `latest`；执行前固定。 |
| 上游 exact contract / helper | 正向 qualification | 继续记为 `L2M-UP-*` / `L2M-DDD-*`，受影响 lane blocked。 |
| 风险接受人、签署人和日期 | 有条件通过 / 最终签署 | 执行时填写；当前不生成姓名或结论。 |

## 11. 进入下一步条件

- [x] 正式 06 已按 full-restart 重建并完成 15 章装配。
- [x] 每章均有具体 calibration 来源和可追读入口。
- [x] AC / VF / TC / EV / report path、接口分母、状态分母和 blocker 均可追溯。
- [x] 未创建任何实现、测试、artifact、report、evidence 或签署实例。
- [x] 正式 06 完成后停审；只有用户新的明确确认才可进入 07。
