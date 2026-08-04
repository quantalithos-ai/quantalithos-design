# L4-observability 00-需求文档校准流程

## 流程元信息

| 项 | 内容 |
|---|---|
| 目标文档 | `projects/L4-observability/00-需求文档.md` |
| 当前模式 | full-restart |
| 启动原因 | 用户指出上一轮实现过于粗糙,并要求从头开始 `00` |
| 当前状态 | Step 17 正式装配已完成;正式 `00-需求文档.md` 已按 Step 01~16 已确认结论重建;用户已确认进入 `01-架构设计.md`,当前 00 已移交给 01 Step 01 |
| 文档切换门禁 | pass_to_01_after_user_confirmation |
| 下一允许动作 | 由 `01_architecture_calibration_flow.md` 驱动 `01-架构设计.md` 逐 Step 推进;不得自动跨 Step |

## 必读输入记录

| 类型 | 文件 |
|---|---|
| 通用规范 | `standards/document/设计文档编写通则.md` |
| 通用规范 | `standards/document/设计文档讨论中间产物规范.md` |
| 通用规范 | `standards/document/设计真相源闭环与可落码性标准.md` |
| 依赖规范 | `standards/document/全局项目依赖关系与裁剪规则.md` |
| 需求 SOP | `standards/document/需求文档讨论流程_SOP.md` |
| 需求书写规范 | `standards/document/需求文档书写规范.md` |
| 项目输入 | `projects/L4-observability/README.md` |
| 历史材料 | 旧 `projects/L4-observability/00~07` 正式文档与上一轮 design-calibration |
| 上游参考 | `projects/L0-bus/00~07` |
| 上游参考 | `projects/L1-governance/00~07` |
| 上游参考 | `projects/L1-artifact/00~07` |
| 上游参考 | `projects/L1-identity/00~07` |

## 历史材料处理原则

上一轮生成的 `00~07` 文档、`implementation_execution_ledger.md` 和 `implementation-boundaries/*` 均降级为 historical material。它们只能作为旧材料诊断输入,不得作为当前需求基线直接复制。旧 README 中的 TimescaleDB、Grafana、Prometheus、OTel Collector、P95、冷存期限、hash chain 分片、目录树和具体产品栈不进入当前需求硬结论;如后续需要,必须在 `01~07` 对应文档重新闭口。

## Step 状态台账

| Step | 必读文档 | 输出文件 | 模块骨架 | 当前模块 | 思考记录 | 写入记录 | 自检状态 | gate_status | gate_reason | 下一动作 | blocker |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Step 01 与上游文档的关系声明 | 通用规范;需求 SOP;需求书写规范;全局依赖规则;上游 `00~07`;历史材料 | `00_req_step_01_upstream_relation.md` | done | upstream-map-strengthening | done | done | done | pass | 已完成审查后补强,来源分层、historical material 降级、`L0-core` 直接稳定上游和“不重新定义清单”已收束 | wait_user_or_start_step_02_strengthening_after_confirmation | none |
| Step 02 本仓定位与边界 | Step 01;全局依赖规则;上游 truth 边界 | `00_req_step_02_position_boundary.md` | done | position-boundary-strengthening | done | done | done | pass | 已完成审查后补强,一句话定义、非职责、边界对象、单独成仓原因和“只读交接不等于最终结论”边界已收束 | wait_user_or_start_step_15_strengthening_after_confirmation | none |
| Step 03 背景与问题定义 | Step 02;历史 README / 旧 00 | `00_req_step_03_problem_context.md` | done | problem-context-strengthening | done | done | done | pass | 已完成审查后补强,业务背景、现状问题和业务 / 技术问题分类已收束,且旧产品栈、旧性能数字和后续对象词已降级为 historical material | wait_user_or_start_step_09_strengthening_after_confirmation | none |
| Step 04 目标与非目标 | Step 02;Step 03 | `00_req_step_04_goals_non_goals.md` | done | goals-non-goals-strengthening | done | done | done | pass | 已完成审查后补强,目标、非目标和范围收束结论已形成,且目标可验证、非目标具体、不含功能、规则或实现方案 | wait_user_or_start_step_09_strengthening_after_confirmation | none |
| Step 05 用户与角色 | Step 02;Step 04 | `00_req_step_05_users_roles.md` | done | users-roles-strengthening | done | done | done | pass | 已完成审查后补强,角色识别口径、主要人类角色、系统角色、接触场景和能力级权限差异已收束,且未混写仓际依赖、用户故事、接口动作或实现方式 | wait_user_or_start_step_09_strengthening_after_confirmation | none |
| Step 06 使用方与依赖 | Step 02;Step 05;全局依赖规则 | `00_req_step_06_consumers_dependencies.md` | done | consumers-dependencies-strengthening | done | done | done | pass | 已完成审查后补强,依赖候选分层、内部仓依赖表、外部依赖结论、依赖裁剪表、依赖类型分类表、禁止依赖表和 ASCII 图已收束,且未混写角色、主链步骤、接口细节或实现方案 | wait_user_or_start_step_09_strengthening_after_confirmation | none |
| Step 07 核心能力闭环 | Step 02;Step 04;Step 06 | `00_req_step_07_core_capability_loop.md` | done | core-capability-loop | done | done | done | pass | 仓存在必要性、核心能力闭环、节点讨论顺序、能力停审清单、外围增强、边界外能力和功能回填映射已收束 | wait_user_or_start_step_09_strengthening_after_confirmation | none |
| Step 08 用户故事 | Step 05;Step 07 | `00_req_step_08_user_stories.md` | done | user-stories-strengthening | done | done | done | pass | 已完成审查后补强,故事候选分层、核心闭环故事、外围增强故事、故事与闭环映射、能力级故事停审和边界外故事裁剪已收束,且未混写功能、规则、数据、接口、验收或实现方案 | wait_user_or_start_step_09_strengthening_after_confirmation | none |
| Step 09 功能需求 | Step 07;Step 08 | `00_req_step_09_functional_requirements.md` | done | functional-requirements-strengthening | done | done | done | pass | 已完成审查后补强,核心功能需求、外围增强功能、能力类型、闭环映射、故事映射、能力级功能停审和边界外功能裁剪已收束,且未混写规则、数据、接口、非功能、验收或实现方案 | wait_user_or_start_step_11_strengthening_after_confirmation | none |
| Step 10 业务规则与边界约束 | Step 02;Step 07;Step 09 | `00_req_step_10_rules_boundary_constraints.md` | done | rules-boundary-constraints-strengthening | done | done | done | pass | 已完成审查后补强,规则候选分层、`BR-OBS-001~026`、规则类型、功能映射、跨能力规则审计和边界外规则裁剪已收束,且未混写数据归属、接口、NFR、验收或实现方案 | wait_user_or_start_step_09_strengthening_after_confirmation | none |
| Step 11 数据需求与数据归属 | Step 02;Step 07;Step 09;Step 10 | `00_req_step_11_data_requirements_ownership.md` | done | data-requirements-ownership-strengthening | done | done | done | pass | 已完成审查后补强,真相 / 快照 / 引用 / 禁止保存正文四类数据、归属说明、生命周期口径、功能 / 规则映射、能力级数据停审和边界外数据裁剪已收束,且未混写接口、非功能、验收或实现方案 | wait_user_or_start_step_12_strengthening_after_confirmation | none |
| Step 12 接口与依赖 | Step 06;Step 09;Step 11 | `00_req_step_12_interfaces_dependencies.md` | done | interfaces-dependencies-strengthening | done | done | done | pass | 已完成审查后补强,对外能力接口、外部依赖边界、接口类型、依赖类型、全局依赖类型映射、功能映射、能力级接口停审和边界外接口裁剪已收束,且主表严格使用 4.12 固定列,未混写协议、字段、实现、非功能或验收方案 | wait_user_or_start_step_13_strengthening_after_confirmation | none |
| Step 13 非功能需求 | Step 07;Step 10;Step 11;Step 12 | `00_req_step_13_non_functional_requirements.md` | done | non-functional-requirements-strengthening | done | done | done | pass | 已完成审查后补强,能力级非功能要求、全仓质量约束、六类类别结论、非功能主表、判断口径 / 目标值、映射、停审和边界外裁剪已收束,且主表严格使用 4.13 固定列,未混写监控配置、实现方案、验收或测试方案 | wait_user_or_start_step_14_strengthening_after_confirmation | none |
| Step 14 验收标准 | Step 07;Step 09;Step 10;Step 11;Step 13 | `00_req_step_14_acceptance_criteria.md` | done | acceptance-criteria-strengthening | done | done | done | pass | 已完成审查后补强,验收类别、能力级验收项、验收条件、一票否决项、验收映射、能力级停审和跨能力审计已收束,且主表严格使用 4.14 固定列,未混写测试步骤、接口调用、证据路径、实现门禁或真实验收结果 | wait_user_or_start_step_15_strengthening_after_confirmation | none |
| Step 15 风险与待确认事项 | Step 01~14 | `00_req_step_15_risks_open_questions.md` | done | risks-open-questions-strengthening | done | done | done | pass | 已完成审查后补强,风险、待确认事项、当前不阻塞项、后续阻塞项、当前文档问题诊断、改动前后对比和设计取舍均已收束,且未把设计层 / 实施层细节误写入需求层 | wait_user_or_start_step_16_strengthening_after_confirmation | none |
| Step 16 需求追溯矩阵 | Step 07~15 | `00_req_step_16_traceability_matrix.md` | done | traceability-matrix-strengthening | done | done | done | pass | 已完成审查后补强,主追溯矩阵、跨能力追溯审计、漏项检查表和正式回填输入均已收束,且没有孤儿功能、孤儿规则、孤儿数据、孤儿接口、孤儿 NFR、孤儿验收或新增未确认项 | completed_by_step_17_formal_assembly | none |
| Step 17 正式整理为 00-需求文档 | Step 01~16;项目台账;本文 flow;正式 `00-需求文档.md` 历史材料 | `00_req_step_17_formal_document_assembly.md`;`../00-需求文档.md` | done | formal-document-assembly | done | done | done | pass | 已完成 Step 17 正式装配;正式 `00-需求文档.md` 已按 16 章结构重建,每章均标注校准来源,并保留 Step 05 以后可落码粒度;未新增 Step 01~16 以外结论;用户已确认进入 `01-架构设计.md` | handed_off_to_01_step_01 | none |

## 当前上游 blocker 判断

| blocker | 判断 |
|---|---|
| 上游 `L0-bus` 是否阻塞 Step 17 | 不阻塞。正式 00 只承接事件协作边界、bus 主干不属于本仓 truth,以及 `L0-bus` 不进入编译期依赖的既有结论。 |
| 上游 `L1-governance` 是否阻塞 Step 17 | 不阻塞。正式 00 只承接治理 truth 不归本仓、报告交接不生成治理结论、审计投影只读消费的既有边界。 |
| 上游 `L1-artifact` 是否阻塞 Step 17 | 不阻塞。正式 00 只承接 artifact / evidence body ownership 和 body-free evidence linkage 边界。 |
| 上游 `L1-identity` 是否阻塞 Step 17 | 不阻塞。正式 00 只承接 actor / subject safe refs 与身份正文不入仓边界。 |
| 旧 L4-observability 文档是否阻塞 Step 17 | 不阻塞,但已继续降级为 historical_material;正式 00 未直接沿用旧测试证据路径、旧 TC / EV、旧 P95 / SLA、旧产品依赖、旧 implementation boundary、旧候选指标或旧追溯关系。 |

## 正式文档装配门禁

| 门禁 | 状态 | 说明 |
|---|---|---|
| 项目级门禁 | pass_to_01_after_user_confirmation | Step 17 已完成,正式 `00-需求文档.md` 已重建;用户已确认进入 `01-架构设计.md`,当前由 01 flow 控制逐 Step 推进。 |
| 文档级门禁 | pass_for_00 | `00-需求文档.md` full-restart 正式装配完成。 |
| Step 级门禁 | pass | Step 17 中间产物、正式 00、flow 和项目台账已同步。 |
| 正文污染检查 | pass | 正式 00 只装配 Step 01~16 已确认结论;未写入旧产品栈、旧指标、旧 implementation boundary 或真实 evidence。 |
| 停审门禁 | transferred_to_01 | 正式 00 已完成并已移交;当前停审点位于 `01-架构设计.md` Step 01 完成后,不得自动进入 Step 02。 |
