# L6-marketplace 04 配置设计 calibration flow

## 07装配审计定向回修（2026-10-02）

07 Step13发现正式04 §7.1“前七个服务字段”误按JSON叶子计数，与本flow原则、Step7映射和正式03 §13冲突。已先登记Step7/项目台账，再仅改该句为七个Rust字段及owner_bindings整体映射；不增加字段、slot或运行配置，不重开历史04全部讨论。回修已由07实际文档静态检查核验，记录为07_implementation_static_review_record.md；历史完成记录保留，当前恢复点以项目台账07停审为准。无需commit。

## 授权与当前恢复点

2026-10-02；用户明确授权“完成全部04”，覆盖Step1～15与正式`04-配置设计.md`，完成后立即停审，不进入05。full-restart / single-agent；只修改本项目设计文档、calibration和项目台账；不实现、不运行、不提交commit。03正式稿是当前配置输入，旧04或draft只作historical_material。

当前文档：04配置设计；当前Step：15 / completed / selfcheck_done / stop_review；gate_status：pass（04静态审查完成）；外部资格：blocked/affected。下一动作：等待用户确认04，未经确认不得读取05 SOP。配置设计不得改变03的RuntimeConfig字段、trait/port、错误、状态或flow；若未来发现代码契约影响，必须回写03并停止后续装配。

## 总流程计划

| Step | 名称 | 输出文件 | 状态 | 回填章节 |
|---|---|---|---|---|
| 1 | 确认配置输入边界 | 04_config_step_01_upstream_boundary.md | completed / selfcheck_done / stop_review | §1 |
| 2 | 明确目标、范围、非范围 | 04_config_step_02_scope.md | completed / selfcheck_done / stop_review | §2 |
| 3 | 配置控制面总览 | 04_config_step_03_control_plane.md | completed / selfcheck_done / stop_review | §3 |
| 4 | 配置分类与禁止配置化边界 | 04_config_step_04_categories_boundaries.md | completed / selfcheck_done / stop_review | §4 |
| 5 | 来源、优先级与冲突处理 | 04_config_step_05_sources_priority.md | completed / selfcheck_done / stop_review | §5 |
| 6 | 环境、profile与矩阵 | 04_config_step_06_environment_matrix.md | completed / selfcheck_done / stop_review | §6 |
| 7 | 配置项清单与JSON demo | 04_config_step_07_item_inventory.md | completed / selfcheck_done / stop_review | §7 |
| 8 | 敏感配置与密钥管理 | 04_config_step_08_secrets.md | completed / selfcheck_done / stop_review | §8 |
| 9 | 加载、校验与生效 | 04_config_step_09_loading_validation.md | completed / selfcheck_done / stop_review | §9 |
| 10 | 变更、审计与回滚 | 04_config_step_10_change_audit.md | completed / selfcheck_done / stop_review | §10 |
| 11 | 失效、降级与fail-fast | 04_config_step_11_failure_modes.md | completed / selfcheck_done / stop_review | §11 |
| 12 | 测试、验收、实施、运维承接 | 04_config_step_12_handoff.md | completed / selfcheck_done / stop_review | §12 |
| 13 | 迁移、废弃与演进 | 04_config_step_13_evolution.md | completed / selfcheck_done / stop_review | §13 |
| 14 | 风险与待确认事项 | 04_config_step_14_risks_open_questions.md | completed / selfcheck_done / stop_review | §14 |
| 15 | 正式配置设计装配 | 04_config_step_15_formal_document_assembly.md | completed / selfcheck_done / stop_review / waiting_user_confirmation | §1～15 |

## 配置设计总原则

- 外部JSON是配置载体；`schema_version`和`profile`是loader envelope metadata，经过校验后只装配03既有七字段`RuntimeConfig`，不成为新的业务对象。
- 当前配置域为`api`、`storage`、`sdk`、`owner`、`worker`、`web`；不使用`common`、`runtime`、`misc`等泛化模块。
- server配置全部startup生效；当前没有未经批准的hot/reload控制面。Web公共API绑定为build-time输入，locale只影响展示。
- source priority、secret ref、profile差异只决定装配与资源姿态，不能决定approval、visibility、publisher资格、installed/paid、审计证据或状态迁移。
- owner/SDK positive qualification、human publisher/auth、receiver/materialization、notice channel、Observation producer和容量预算仍分别受MP-UP-001～008、MP-SRC-003/010/013、Q-MP-01影响。

## 影响判定总规则

Step1～13若只定义配置来源、键名、profile、敏感级别、校验、启动/变更/失效策略，记录“无回写”；若新增RuntimeConfig字段、adapter constructor、port、error、DTO或flow，必须“待回写”并停止Step15。本轮不新增契约，Step14最终回写表必须无`待回写`或`阻塞待确认`。

## 05切换门禁

Step15完成后，04正式文档状态为`completed / selfcheck_done / stop_review / waiting_user_confirmation`；未获用户确认前不读取05 SOP、不创建05 calibration、不创建实现台账或boundary skeleton。实现与运行证据上限沿03保持planned/not-run/blocked。

## 04正式完成停审记录（2026-10-02）

当前agent单独完成04 Step1～15。新增/更新范围为本项目`design-calibration/04_config_*`、正式`04-配置设计.md`、`04_config_static_review_record.md`和项目执行台账；不修改其他项目正式文档、draft、原型或实现仓，不提交commit。

配置结论：严格JSON envelope；`schema_version/profile`仅loader metadata；六域映射03七字段；八slot只接typed ref；server startup、Web API base build-time、locale展示；仅En安全默认；无config center/admin/hot/reload。配置不能产生Governance approval、publisher资格、visibility/state、安装/付费/通知/evidence，也不能打开Billing、Archive或active event lane。

静态审查已完成：15章、Step来源、七字段映射、六域、八slot、profile、JSON/JSONC demo、敏感引用、失败矩阵、禁配项、链接/表格/围栏均通过。没有运行测试、部署、真实配置加载、secret读取、资产/扫描/支付/evidence/verdict/signoff/readiness。

外部`MP-UP-001～008`、`MP-SRC-003/010/013`、`Q-MP-01`及受影响owner/SDK/provider/PG资格保持pending/blocked/affected/future。下一动作仅等待用户确认04；确认前不读取05 SOP。
