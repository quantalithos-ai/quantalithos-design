# L5-chat 04 配置设计校准流程

> 日期：2026-10-01；模式：full-restart / single-agent-serial。
> 授权：用户要求完成全部04。依次Step1～15，本地门禁通过才进入下一Step；正式04完成立即停审，不进入05。
> 当前恢复点：Step15 done / formal_stop_review；gate_status：pass_with_upstream_blockers；implementation：not_started。
> 范围：仅projects/L5-chat/设计/校准/台账；允许必要03反向校准；无实现、应用测试、SDK或其他项目写入、commit。

## 1. 总流程计划与状态

| Step | 主题 | 输入/前序依赖 | 输出文件 | 状态 | gate_status / 完成门禁 | 下一动作 |
|---|---|---|---|---|---|---|
| 1 | 确认配置输入边界 | 当前00～03与04规范 | 04_config_step_01_upstream_boundary.md | done | pass_with_upstream_blockers；来源/取舍/配置域审计、03影响判定闭口 | 完成后进入Step2 |
| 2 | 明确配置设计目标、范围和非范围 | Step1 pass及该Step SOP/规范 | 04_config_step_02_scope.md | done | pass_with_upstream_blockers；来源/取舍/配置域审计、03影响判定闭口 | 完成后进入Step3 |
| 3 | 建立配置控制面总览 | Step2 pass及该Step SOP/规范 | 04_config_step_03_control_plane.md | done | pass_with_upstream_blockers；来源/取舍/配置域审计、03影响判定闭口 | 完成后进入Step4 |
| 4 | 定义配置分类与禁止配置化边界 | Step3 pass及该Step SOP/规范 | 04_config_step_04_categories_boundaries.md | done | pass_with_upstream_blockers；来源/取舍/配置域审计、03影响判定闭口 | 完成后进入Step5 |
| 5 | 定义配置来源、优先级与冲突处理 | Step4 pass及该Step SOP/规范 | 04_config_step_05_sources_priority_conflicts.md | done | pass_with_upstream_blockers；来源/取舍/配置域审计、03影响判定闭口 | 完成后进入Step6 |
| 6 | 定义环境、部署profile与配置矩阵 | Step5 pass及该Step SOP/规范 | 04_config_step_06_environment_profiles_matrix.md | done | pass_with_upstream_blockers；来源/取舍/配置域审计、03影响判定闭口 | 完成后进入Step7 |
| 7 | 定义配置项清单 | Step6 pass及该Step SOP/规范 | 04_config_step_07_config_items.md | done | pass_with_upstream_blockers；来源/取舍/配置域审计、03影响判定闭口 | 完成后进入Step8 |
| 8 | 定义敏感配置与密钥管理 | Step7 pass及该Step SOP/规范 | 04_config_step_08_sensitive_secrets.md | done | pass_with_upstream_blockers；来源/取舍/配置域审计、03影响判定闭口 | 完成后进入Step9 |
| 9 | 定义配置加载、校验与生效机制 | Step8 pass及该Step SOP/规范 | 04_config_step_09_loading_validation_activation.md | done | pass_with_upstream_blockers；来源/取舍/配置域审计、03影响判定闭口 | 完成后进入Step10 |
| 10 | 定义配置变更、审计与回滚 | Step9 pass及该Step SOP/规范 | 04_config_step_10_change_audit_rollback.md | done | pass_with_upstream_blockers；来源/取舍/配置域审计、03影响判定闭口 | 完成后进入Step11 |
| 11 | 定义失效模式与降级策略 | Step10 pass及该Step SOP/规范 | 04_config_step_11_failure_degradation.md | done | pass_with_upstream_blockers；来源/取舍/配置域审计、03影响判定闭口 | 完成后进入Step12 |
| 12 | 定义下游承接 | Step11 pass及该Step SOP/规范 | 04_config_step_12_downstream_handoff.md | done | pass_with_upstream_blockers；来源/取舍/配置域审计、03影响判定闭口 | 完成后进入Step13 |
| 13 | 定义配置迁移、废弃与演进 | Step12 pass及该Step SOP/规范 | 04_config_step_13_migration_deprecation_evolution.md | done | pass_with_upstream_blockers；来源/取舍/配置域审计、03影响判定闭口 | 完成后进入Step14 |
| 14 | 定义风险与待确认事项 | Step13 pass及该Step SOP/规范 | 04_config_step_14_risks_open_questions.md | done | pass_with_upstream_blockers；来源/取舍/配置域审计、03影响判定闭口 | 完成后进入Step15 |
| 15 | 整理正式配置设计文档 | Step14 pass及该Step SOP/规范 | 04_config_step_15_formal_document_assembly.md | done | pass_with_upstream_blockers；来源/取舍/配置域审计、03影响判定闭口 | 装配04并停审 |

## 2. 每Step执行与写入纪律

每Step先读项目台账→本flow→当前文件；问题回答→具体诊断→取舍→结构化产物→复杂度判断→回填→自检。Step3～11按八配置域逐个小循环，未通过本域审查不写下域结论。单次patch≤180行；未来Step仅计划路径，不预建文件。gate pass_with_upstream_blockers仅表示本地设计闭合，不是正向接入可用。

## 3. 当前权威输入与blocker

当前00～03、03配置14字段/装配/SDK-only/fence/CAS/unknown/no durable；配置SOP、书写规范、中间产物规范、真相源闭环与全局Layer5规则。L0-sdk及各owner当前00～07阅读沿用03来源记录，本轮按配置风险补读SDK04/宿主/必要台账；L1-governance04仅参考结构，L6-bridges未停审设计不输入。

CHAT-UP001～009、WS-UP001～008、CHAT-BASE001保留；SDK真实profile/public能力、native可信origin与OS权限、生产资源预算与版本兼容尚未闭合。它们阻塞对应正向集成/生产装配，不以示例或fake解除。

## 4. 配置域与反向校准门禁

八域：app、sdk、platform、intents、local_state、continuity、collaboration、diagnostic。启动immutable；默认memoryOnly=true/diagnosticdisabled。数字项无生产自动默认，示例不是测量或生产推荐。新增DTO/loaderflow/constructor/port/error先回写03及对应calibration，Step14清单不得有待回写或阻塞待确认的当前结论。未来扩展仅trigger，未进入当前代码契约。

## 5. 完成记录

Step1～15已串行完成，正式04原路径十五章已装配并停审。八域14叶子、8模块+1完整strict JSON、6profile catalog、12planned CUT-CFG；JSON可解析/模块与完整demo一致，类型/来源/default/profile/单位/范围/敏感/加载/变更/失败及03影响闭口；围栏/表格/章节编号/相对文件链接及git diff --check通过。

必要03反向校准只修改本项目正式03与03 Step6/14：模块JSON→flat14字段、strict重复键/plain-data校验、UTF-16单位、全量startupfreeze；当前没有待回写项。03flow记录已同步。SDK/owner/host/production预算/版本兼容仍blocked。没有实现、应用测试、发布证据、验收、readiness、commit或implementation ledger；不进入05。下一步获授权后读取05 SOP/书写规范，当前03 §15、04 §6～12/§14及真实SDK/native能力门禁。
