# L4-observability 01-架构设计校准流程

## 流程元信息

| 项 | 内容 |
|---|---|
| 目标文档 | `projects/L4-observability/01-架构设计.md` |
| 当前模式 | full-restart |
| 启动原因 | 用户确认 `00-需求文档.md` 完成后,进入 `01-架构设计.md`,且要求一个 Step 一个 Step 推进 |
| 当前状态 | Step 16 `整理正式文档` 已完成;正式 `01-架构设计.md` 已按 Step 01~15 重建;当前停审等待用户确认是否进入 `02-概要设计` |
| Step 切换门禁 | blocked_for_document_switch |
| 下一允许动作 | 等待用户确认后进入 `02-概要设计` Step 01;不得自动跨正式文档 |

## 必读输入记录

| 类型 | 文件 |
|---|---|
| 通用规范 | `standards/document/设计文档编写通则.md` |
| 通用规范 | `standards/document/设计文档讨论中间产物规范.md` |
| 通用规范 | `standards/document/设计真相源闭环与可落码性标准.md` |
| 依赖规范 | `standards/document/全局项目依赖关系与裁剪规则.md` |
| 架构 SOP | `standards/document/架构设计讨论流程_SOP.md` |
| 架构书写规范 | `standards/document/架构设计书写规范.md` |
| 当前需求基线 | `projects/L4-observability/00-需求文档.md` |
| 当前需求 flow | `projects/L4-observability/design-calibration/00_requirements_calibration_flow.md` |
| 项目台账 | `projects/L4-observability/design-calibration/project_execution_ledger.md` |
| 历史材料 | `projects/L4-observability/README.md` |
| 历史材料 | 旧 `projects/L4-observability/01-架构设计.md` 与上一轮 `01_arch_*` |
| 参考粒度 | `projects/L1-governance/design-calibration/01_arch_step_01_requirement_baseline.md` |
| 参考粒度 | `projects/L1-artifact/design-calibration/01_arch_step_01_requirement_baseline.md` |
| 参考粒度 | `projects/L1-governance/design-calibration/01_arch_step_02_goals_constraints.md` |
| 参考粒度 | `projects/L1-artifact/design-calibration/01_arch_step_02_goals_constraints.md` |
| 参考粒度 | `projects/L1-governance/design-calibration/01_arch_step_03_responsibility_boundary.md` |
| 参考粒度 | `projects/L1-artifact/design-calibration/01_arch_step_03_responsibility_boundary.md` |
| 参考粒度 | `projects/L1-governance/design-calibration/01_arch_step_04_system_context.md` |
| 参考粒度 | `projects/L1-artifact/design-calibration/01_arch_step_04_system_context.md` |
| 参考粒度 | `projects/L1-governance/design-calibration/01_arch_step_05_bounded_context_subdomains.md` |
| 参考粒度 | `projects/L1-artifact/design-calibration/01_arch_step_05_bounded_context_subdomains.md` |
| 参考粒度 | `projects/L1-governance/design-calibration/01_arch_step_06_container_deployment.md` |
| 参考粒度 | `projects/L1-artifact/design-calibration/01_arch_step_06_container_deployment.md` |
| 参考粒度 | `projects/L1-governance/design-calibration/01_arch_step_07_dependency_direction.md` |
| 参考粒度 | `projects/L1-artifact/design-calibration/01_arch_step_07_dependency_direction.md` |
| 参考粒度 | `projects/L1-governance/design-calibration/01_arch_step_08_data_ownership_consistency.md` |
| 参考粒度 | `projects/L1-artifact/design-calibration/01_arch_step_08_data_ownership_consistency.md` |
| 参考粒度 | `projects/L1-governance/design-calibration/01_arch_step_09_interactions_communication.md` |
| 参考粒度 | `projects/L1-artifact/design-calibration/01_arch_step_09_interactions_communication.md` |
| 参考粒度 | `projects/L1-governance/design-calibration/01_arch_step_10_technology_choices.md` |
| 参考粒度 | `projects/L1-artifact/design-calibration/01_arch_step_10_technology_choices.md` |
| 参考粒度 | `projects/L1-governance/design-calibration/01_arch_step_11_alternatives_tradeoffs.md` |
| 参考粒度 | `projects/L1-artifact/design-calibration/01_arch_step_11_alternatives_tradeoffs.md` |
| 参考粒度 | `projects/L1-governance/design-calibration/01_arch_step_12_cross_cutting_concerns.md` |
| 参考粒度 | `projects/L1-artifact/design-calibration/01_arch_step_12_cross_cutting_concerns.md` |
| 参考粒度 | `projects/L1-governance/design-calibration/01_arch_step_13_evolution_path.md` |
| 参考粒度 | `projects/L1-artifact/design-calibration/01_arch_step_13_evolution_path.md` |
| 参考粒度 | `projects/L1-governance/design-calibration/01_arch_step_14_risks_open_questions.md` |
| 参考粒度 | `projects/L1-artifact/design-calibration/01_arch_step_14_risks_open_questions.md` |
| 参考粒度 | `projects/L1-governance/design-calibration/01_arch_step_15_adr_traceability.md` |
| 参考粒度 | `projects/L1-artifact/design-calibration/01_arch_step_15_adr_traceability.md` |

## 历史材料处理原则

旧 `README.md`、旧 `01-架构设计.md`、旧 `01_architecture_calibration_flow.md` 的全 Step pass 状态、旧 implementation ledger 和旧 implementation boundaries 均降级为 historical material。旧 `01_arch_step_01~15` 已由当前产物替换;旧 `01_arch_step_16` 仍只作为历史诊断输入,不得作为当前架构基线直接复制。旧材料中的 OTel、Prometheus、Grafana、TimescaleDB、对象存储、P95 / SLA、冷存期限、hash chain 分片、事件数量、目录结构、测试证据路径和旧 implementation boundary 不进入当前架构硬结论;如后续需要,必须在对应 Step 重新闭口。

## Step 状态台账

| Step | 必读文档 | 输出文件 | 模块骨架 | 当前模块 | 思考记录 | 写入记录 | 自检状态 | gate_status | gate_reason | 下一动作 | blocker |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Step 01 确认需求基线 | 项目台账;00 正式文档;00 flow;架构 SOP;架构书写规范;通用规范;旧 01 historical material;L1 参考粒度 | `01_arch_step_01_requirements_baseline.md` | done | requirements-baseline | done | done | done | pass | 已按新版 00 需求基线重写,逐项回答 SOP 问题,旧 Step 01 薄产物和旧 flow 全 pass 状态已降级为 historical material;已由 Step 02 承接 | completed_by_step_02 | none |
| Step 02 明确架构目标与约束 | Step 01;架构 SOP 4.2 / 4.3;架构书写规范 4.2 / 4.3 | `01_arch_step_02_arch_goals_constraints.md` | done | goals-constraints | done | done | done | pass | 已按 Step 01 需求基线重写,明确结构性架构目标、不可变约束、当前阶段取舍和架构非目标,旧 Step 02 薄产物和旧产品 / 指标口径已降级为 historical material;已由 Step 03 承接 | completed_by_step_03 | none |
| Step 03 职责边界 | Step 01~02;架构 SOP Step 3;架构书写规范 4.4;正式 00 §2 / §10 / §11;L1 参考粒度 | `01_arch_step_03_responsibility_boundary.md` | done | responsibility-boundary | done | done | done | pass | 已按 Step 01~02 和新版 00 重写,明确 Observability 做 / 不做 / 易混淆职责和边界红线,旧 Step 03 schema 式薄产物、旧产品栈和旧职责混写已降级为 historical material;已由 Step 04 承接 | completed_by_step_04 | none |
| Step 04 系统边界与上下文 | Step 01~03;架构 SOP Step 4;架构书写规范 4.5;正式 00 §6 / §12;全局依赖裁剪规则;L1 参考粒度 | `01_arch_step_04_system_context.md` | done | system-context | done | done | done | pass | 已按 Step 01~03、新版 00、依赖裁剪规则和 L1 参考粒度重写,明确正式上下文图、上下游输入 / 输出面、依赖失效降级口径和外部产品不作为 truth source 的边界 | completed_by_step_05 | none |
| Step 05 限界上下文与子域划分 | Step 01~04;架构 SOP Step 5;架构书写规范 4.6;正式 00 §7 / §9 / §10 / §11 / §12 / §14 / §15;L1 参考粒度 | `01_arch_step_05_bounded_context.md` | done | bounded-context | done | done | done | pass | 已按 Step 01~04、新版 00、架构 SOP、书写规范和 L1 参考粒度重写,明确核心子域、支撑上下文、本地索引 / 投影 / 引用层、上下文映射关系和不能混层的原因 | completed_by_step_06 | none |
| Step 06 容器 / 部署架构 | Step 01~05;架构 SOP Step 6;架构书写规范 4.7;正式 00 §7 / §9 / §10 / §11 / §12 / §13 / §14 / §15;L1 参考粒度 | `01_arch_step_06_container_deployment.md` | done | container-deployment | done | done | done | pass | 已按 Step 01~05、新版 00、架构 SOP、书写规范和 L1 参考粒度重写,明确同步入口、异步观察材料消费、后台维护交接、观察面真相承载、派生投影 / 报告交接承载和外部运行边界 | completed_by_step_07 | none |
| Step 07 依赖方向与层间约束 | Step 01~06;架构 SOP Step 7;全局依赖裁剪规则;架构书写规范 4.8;需求 Step 06 / 12;L1 参考粒度 | `01_arch_step_07_dependency_direction.md` | done | dependency-direction | done | done | done | pass | 已按 Step 03~06、需求依赖 / 接口边界、全局依赖裁剪规则、架构 SOP、书写规范和 L1 参考粒度重写,明确依赖角色、允许 / 禁止依赖、倒置边界、跨仓裁剪表、分类表、禁止依赖表和依赖裁剪图;已由 Step 08 承接 | completed_by_step_08 | none |
| Step 08 数据所有权与一致性策略 | Step 01~07;架构 SOP Step 8;架构书写规范 4.9;需求 Step 11;正式 00 §11 / §13 / §14 / §15;L1 参考粒度 | `01_arch_step_08_data_ownership_consistency.md` | done | data-ownership-consistency | done | done | done | pass | 已按 Step 03~07、需求数据归属、正式 00、架构 SOP、书写规范和 L1 参考粒度重写,明确正式真相、快照 / 投影、引用关系、明确不拥有正文、一致性口径、失败处理、按架构单元的数据所有权和跨数据边界审计;已由 Step 09 承接 | completed_by_step_09 | none |
| Step 09 关键交互与通信方式 | Step 03~08;架构 SOP Step 9;架构书写规范 4.10;正式 00 §7 / §9 / §10 / §11 / §12 / §13 / §14 / §15;L1 参考粒度 | `01_arch_step_09_interactions_communication.md` | done | interactions-communication | done | done | done | pass | 已按 Step 03~08、正式 00、架构 SOP、书写规范和 L1 参考粒度重写,明确关键交互场景、同步 / 异步 / 后台通信方式、失败降级、按架构单元的交互方式、交互停审和跨交互边界审计;已由 Step 10 承接 | completed_by_step_10 | none |
| Step 10 关键技术选型 | Step 02 / 06 / 07 / 08 / 09;架构 SOP Step 10;架构书写规范 4.11;正式 00 §10 / §11 / §12 / §13 / §14 / §15;L1 参考粒度 | `01_arch_step_10_technology_choices.md` | done | technology-choices | done | done | done | pass | 已按 Step 02 / 06 / 07 / 08 / 09、正式 00、架构 SOP、书写规范和 L1 参考粒度重写,明确机制级技术选型、机制适用表、不采用口径、技术边界说明和产品硬选型延后;已由 Step 11 承接 | completed_by_step_11 | none |
| Step 11 备选方案与取舍 | Step 02 / 03 / 06 / 07 / 08 / 09 / 10;架构 SOP Step 11;架构书写规范 4.12;正式 00 §10~§15;L1 参考粒度 | `01_arch_step_11_alternatives_tradeoffs.md` | done | alternatives-tradeoffs | done | done | done | pass | 已按路径级方案比较重写,明确独立 observation truth + 正式边界协作主线,并比较纯监控平台、业务聚合、外部产品主导、audit ledger 反写、report-first、全同步、全异步和 ES / hash-chain-first 等替代路径;已由 Step 12 承接 | completed_by_step_12 | none |
| Step 12 横切关注点 | Step 02 / 03 / 06 / 07 / 08 / 09 / 10 / 11;架构 SOP Step 12;架构书写规范 4.13;正式 00 §13~§15;L1 参考粒度 | `01_arch_step_12_cross_cutting.md` | done | cross-cutting-concerns | done | done | done | pass | 已按主线横切约束重写,明确安全边界、审计与可追溯、可观测性、韧性 / 恢复能力、性能 / 容量约束、配置与变更控制,并按架构单元完成适用性停审和跨横切审计;已由 Step 13 承接 | completed_by_step_13 | none |
| Step 13 演进路线 | Step 01~12;架构 SOP Step 13;架构书写规范 4.14;正式 00 §13~§15;L1 参考粒度 | `01_arch_step_13_evolution_roadmap.md` | done | evolution-roadmap | done | done | done | pass | 已按 Step 02 / 03 / 06 / 07 / 08 / 09 / 10 / 11 / 12、正式 00、架构 SOP、架构书写规范 4.14 和 L1 参考粒度重写,明确当前主线成立阶段、可接受 / 不可接受债务、后续结构演进项、触发条件、不作为演进项和演进边界;旧 Step 13 对象 / 字段式薄产物、旧产品栈、旧指标、旧完整性链设想和旧自动跨步门禁已降级为 historical material;已由 Step 14 承接 | completed_by_step_14 | none |
| Step 14 风险与待确认事项 | Step 01~13;架构 SOP Step 14;架构书写规范 4.15;正式 00 §15;L1 参考粒度 | `01_arch_step_14_risks_open_questions.md` | done | risks-open-questions | done | done | done | pass | 已按 Step 01~13、正式 00 需求风险、架构 SOP、架构书写规范 4.15 和 L1 参考粒度重写,明确正式风险表、待确认事项表、当前处理口径说明、阻塞 / 不阻塞 / 有条件阻塞判断;旧 Step 14 对象 / schema 式薄产物、旧产品栈、旧指标、真实 evidence 污染和旧自动跨步门禁已降级为 historical material;已由 Step 15 承接 | completed_by_step_15 | none |
| Step 15 ADR 与需求追溯 | Step 01~14;架构 SOP Step 15;架构书写规范 4.16 / 4.17;正式 00 §16;L1 参考粒度 | `01_arch_step_15_adr_traceability.md` | done | adr-traceability | done | done | done | pass | 已按 Step 01~14、正式 00 需求追溯、架构 SOP Step 15、架构书写规范 4.16 / 4.17 和 L1 参考粒度重写,明确需求追溯矩阵、漏项检查表、ADR 决策候选索引、架构决定停审记录和跨 ADR / 需求追溯审计;旧 Step 15 对象 / schema 式薄产物、旧产品栈、旧指标、真实 evidence 污染和旧自动跨步门禁已降级为 historical material | completed_by_step_16 | none |
| Step 16 整理正式文档 | Step 01~15;项目台账;本文 flow;正式 `01-架构设计.md` historical material;架构 SOP Step 16;架构书写规范正式装配要求 | `01_arch_step_16_formal_document_assembly.md`;`../01-架构设计.md` | done | formal-document-assembly | done | done | done | pass | 已按 Step 01~15 当前中间产物重建正式 `01-架构设计.md`,每个正式章节均列出具体校准来源;旧正式 01、旧 Step 16、旧产品 / 指标 / implementation 资产继续作为 historical material | wait_user_confirmation_before_02 | none |

## 当前上游 blocker 判断

| blocker | 判断 |
|---|---|
| 新版 `00-需求文档.md` 是否阻塞 Step 16 | 不阻塞。正式 00 已提供需求层追溯、NFR、验收否决项和风险边界,可支撑正式 `01-架构设计.md` 装配。 |
| `L0-core` / `L0-bus` 是否阻塞 Step 16 | 不阻塞。正式 01 只保留 `L0-core` 唯一编译期依赖和 `L0-bus` 事件协作边界,不定义 bus 主干协议或 ownership。 |
| `L1-governance` / `L1-artifact` / `L1-identity` / `L2-runtime` / `L4-sandbox` 是否阻塞 Step 16 | 不阻塞。正式 01 只把这些上游或相邻仓作为 truth ownership、safe ref / summary / snapshot / signal / gap、body-free linkage 和 no-write 边界来源,不替它们定义主体事实、正文、生命周期、执行 truth、治理裁决或 evidence body。 |
| `L4-archive` / `L0-sdk` / `L5-console` / report handoff consumers / external audit / GRC 是否阻塞 Step 16 | 不阻塞。正式 01 只追溯只读派生、交接、retention protection、archive handoff、external audit / GRC export 和产品中立适配,不定义归档包、展示状态、真实 evidence、最终验收结论、签署或外部 GRC truth。 |
| 旧 L4-observability 01 文档和旧中间产物是否阻塞 Step 16 | 不阻塞,但已降级为 historical material。旧 schema 字段、旧产品栈、旧性能指标、旧事件 / topic / outbox 口径、旧 hash chain / 冷存 / 事件数量口径、旧 formal 结构和旧自动跨步门禁不得沿用。 |
| 进入 `02-概要设计` 是否允许 | 当前不允许自动进入。必须等待用户确认后,再按 `02-概要设计` 对应 SOP 从 Step 01 开始。 |

## 当前门禁

| 门禁 | 状态 | 说明 |
|---|---|---|
| 项目级门禁 | blocked_for_document_switch | Step 16 已完成;进入 `02-概要设计` 必须等待用户确认。 |
| 文档级门禁 | completed | `01-架构设计.md` 已完成 full-restart 正式装配。 |
| Step 级门禁 | pass_for_step_16 | `01_arch_step_16_formal_document_assembly.md` 已完成并自检通过。 |
| 正文污染检查 | pass | 正式 `01-架构设计.md` 已重建;未创建正式 ADR 文件,未创建 implementation ledger 或 boundary skeleton,未引入旧产品栈、旧指标、旧 implementation boundary、API / event / topic / outbox / transaction 实现、真实 evidence 或验收签署。 |
| 停审门禁 | active | 当前停审;不得自动进入 `02-概要设计`。 |
