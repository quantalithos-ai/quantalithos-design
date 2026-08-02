# L4-sandbox 04 配置设计全量重启校准流程

> 创建日期: 2026-07-10
> 状态: completed_current_closeout_v7.9
> 当前模式: full-restart
> 设计仓: `/home/aris/Projects/quantalithos-design`
> 项目目录: `projects/L4-sandbox`
> 正式文档目标: `projects/L4-sandbox/04-配置设计.md`
> 项目级台账: `design-calibration/project_execution_ledger.md`
> 本轮口径: 正式 `00-需求文档.md` 至 `03-详细设计.md` 是当前配置设计上游；旧 README 和重建前正式材料只作 historical material。Step 1~15 full-restart 与 DesignReopen current binding 定向传播均已完成，正式 `04` 为 current 配置基线；provider / platform 资格仍未形成。

---

## 1. 文档级恢复点

| 当前 Step | 当前模块 | gate_status | gate_reason | next_allowed_action | source_files |
|---|---|---|---|---|---|
| Step 15 | `current_config_binding_closeout` | completed_design_static_only | 15章、I001~I101、D01~D44、S00~S08、ENV / PROFILE 和 current capture / handoff / publisher / ordinary-hook binding 已完成静态回查；无 `03` 待回写项。 | 设计链已关闭；下一合法动作由项目台账统一为固定 design baseline 并关闭 `CB-SBX-01A` Activation 前置，不再继续传播到下一正式文档。 | `project_execution_ledger.md`;`04_config_step_15_formal_document_assembly.md`;`04-配置设计.md`;`implementation_execution_ledger.md` |

---

## 2. 执行纪律

本流程只负责 `L4-sandbox` 的 `04-配置设计.md` full-restart。执行时必须按配置设计 SOP 一个 Step 一个 Step 推进。

固定纪律:

- 每次恢复先读取 `project_execution_ledger.md`,再读取本文档,再读取当前 Step 文件。
- 正式 `04-配置设计.md` 只在 Step 15 `整理正式配置设计文档` 时创建;Step 1~14 不创建或修改正式 `04`。
- 旧 `README.md`、旧 `05-测试方案.md`、旧 `06-验收标准.md` 只能在当前 Step 独立结论形成后做差异审计或方向输入,不得作为新版配置真相源直接继承。
- flow 可以一次列出 Step 1~15,但不得提前创建尚未到达的 Step 中间产物文件。
- 每个 Step 文件必须记录 Step 状态、本步输入、SOP 问题回答、问题诊断、改动前后对比、配置设计取舍、结构化中间产物、对 `03` 的影响判定、回填草稿、待确认事项和进入下一步条件。
- 每次用户确认只推进一个当前 Step;不得跨 Step 合并。
- Step 3 以后按“配置控制面 -> 配置域 -> 配置项 -> 来源 / 优先级 -> 敏感性 -> 加载校验 -> 生效 / 失效 -> 变更审计 -> `03` 影响判定”小循环推进。
- 若配置结论改变 `SandboxRuntimeConfigSummary`、runtime builder、adapter constructor、trait / port、error、DTO、函数流或审计 schema,必须回写 `03-详细设计.md`;存在 `待回写` 或 `阻塞待确认` 时不得进入 Step 15。
- 配置只能影响承载、adapter / store / route 绑定、profile、阈值、节奏、enablement 和失效表面,不得改变 execution isolation truth ownership、coherent boundary、policy fail-closed、capture / handoff 分层、cleanup guard、redline containment、query no-write、consumer / job no core truth repair、relay / handoff no-rollback、idempotency replay 和 body-free redaction。
- 不得把 tools semantic execution、runtime agent loop、member lifecycle orchestration、artifact truth、observability store 或 policy definition / approval / allowlist truth 混入 sandbox 配置控制面。
- 配置设计不得写部署命令、目标实现仓代码、implementation ledger、planned boundary skeleton、真实 run_id、evidence alias、测试结果、验收签署或 commit boundary。
- 即使 Step 2 判断无需配置,仍必须按 SOP 生成无配置路径要求的中间产物和正式 `04`。
- 单次写入以 100~300 行为宜;该限制只约束单次 patch / 写入批次,不限制 Step 文件或正式文档最终长度。

---

## 3. 权威输入与处理口径

| 输入 | 当前状态 | 本轮使用方式 |
|---|---|---|
| `projects/L4-sandbox/00-需求文档.md` | current_reviewed_baseline | 承接 sandbox 定位、execution isolation truth ownership、依赖裁剪、核心能力主轴、NFR、安全红线和验收否决项;不发明配置 key。 |
| `projects/L4-sandbox/01-架构设计.md` | current_architecture_baseline | 承接产品中立、部署 / adapter 边界、数据所有权、一致性、fail-closed、no weak fallback、capture / handoff 分层、cleanup / redline 和横切约束。 |
| `projects/L4-sandbox/02-概要设计.md` | current_formal_baseline | 承接 §11 配置影响轮廓、允许 / 禁止配置化边界和 §12 详细设计承接清单。 |
| `projects/L4-sandbox/03-详细设计.md` | current_formal_baseline_reviewed_for_04_start | 作为直接输入,承接 §13 配置读取边界、配置引用、外部依赖和禁止配置化边界,以及 §14~§17 的观测、测试切口、实施承接和风险。 |
| `design-calibration/02_hld_step_11_configuration_impact.md` | current_explanatory_input | 提供配置影响轮廓和禁止配置化边界的讨论细节;与正式 `02` 冲突时以正式 `02` 为准。 |
| `design-calibration/03_ddd_step_14_config_external_binding.md` | current_direct_input | 提供 config section、runtime builder、store / adapter / topic / handoff / job 绑定的字段级来源。 |
| `design-calibration/03_ddd_step_15_observability_audit.md` | current_explanatory_input | 提供 log / metric / audit / diagnostic / redaction 的配置承接边界。 |
| `projects/L4-sandbox/README.md` | historical_material | 旧 Docker / gVisor、默认无出网、seccomp / AppArmor、旧目录、旧性能目标和事件名只作污染风险审计,不得直接继承。 |
| `projects/L4-sandbox/05-测试方案.md` / `06-验收标准.md` | historical_direction_input | 旧 dev / test / staging、host runtime、allowlist、artifact / observability consumer 等只作方向输入;后续必须按新版 `03/04` 重建。 |
| `projects/L4-sandbox/04-配置设计.md` | current_formal_baseline_reviewed_for_05_start | 已由Step 15从已确认Step 1~14装配为15章正式配置设计并经用户审查通过;当前只表示designed initial,作为`05`直接上游。 |

---

## 4. Step 总任务表

| Step | 输出文件 | 主题 | 状态 | gate_status | next_allowed_action | 完成门禁 |
|---:|---|---|---|---|---|---|
| 1 | `04_config_step_01_upstream_boundary.md` | 确认配置输入边界 | done_reviewed | passed_to_step_2 | 全流程已审查完成;由`05`接续。 | 正式上游、historical material、必须回答 / 不再回答、输入风险和 `03` 回写门禁明确。 |
| 2 | `04_config_step_02_scope.md` | 明确配置设计目标、范围和非范围 | done_reviewed | passed_to_step_3 | 全流程已审查完成;由`05`接续。 | P0 / P1 / P2 配置范围、非范围和无配置路径已闭合。 |
| 3 | `04_config_step_03_control_plane.md` | 建立配置控制面总览 | done_reviewed | passed_to_step_4 | 全流程已审查完成;由`05`接续。 | 11 个控制面、44 个配置域、唯一 raw config owner、模块读取边界和跨控制面审计已闭合。 |
| 4 | `04_config_step_04_categories_boundaries.md` | 定义配置分类与禁止配置化边界 | done_reviewed | passed_to_step_5 | 全流程已审查完成;由`05`接续。 | 10 类可配置类别、1 类 design boundary、24 项禁止边界、D01~D44 分类和跨分类审计已闭合。 |
| 5 | `04_config_step_05_sources_priority_conflicts.md` | 定义配置来源、优先级与冲突处理 | done_reviewed | passed_to_step_6 | 全流程已审查完成;由`05`接续。 | S00~S08、4 条通道、C01~C27、D01~D44 来源闭集和跨来源审计已闭合。 |
| 6 | `04_config_step_06_environment_profiles_matrix.md` | 定义环境、部署 profile 与配置矩阵 | done_reviewed | passed_to_step_7 | 全流程已审查完成;由`05`接续。 | ENV-01~07、PROFILE-01~07、workload资格和D01~D44 profile差异已闭合。 |
| 7 | `04_config_step_07_config_items.md` | 定义配置项清单 | done_reviewed | passed_to_step_8 | 全流程已审查完成;由`05`接续。 | I001~I101、40模块demo、D01~D44、FC-01~06、handoff启用源和跨项审计已闭合。 |
| 8 | `04_config_step_08_sensitive_secrets.md` | 定义敏感配置与密钥管理 | done_reviewed | passed_to_step_9 | 全流程已审查完成;由`05`接续。 | 40项敏感配置、23个slot、S04 infra-private生命周期、deny floor、错误模式、停审和泄露审计已闭合。 |
| 9 | `04_config_step_09_loading_validation_activation.md` | 定义配置加载、校验与生效机制 | done_reviewed | passed_to_step_10 | 全流程已审查完成;由`05`接续。 | parse/type/range/ref/profile/cross/material/availability、freeze、builder、atomic publish和scoped snapshot已闭合。 |
| 10 | `04_config_step_10_change_audit_rollback.md` | 定义配置变更、审计与回滚 | done_reviewed | passed_to_step_11 | 全流程已审查完成;由`05`接续。 | actor / review、complete candidate、safe manifest、apply、rollback child request、desired / observed、drift、sensitive rotation和no-truth-rewrite已闭合。 |
| 11 | `04_config_step_11_failure_degradation.md` | 定义失效模式与降级 / fail-fast 策略 | done_reviewed | passed_to_step_12 | 全流程已审查完成;由`05`接续。 | startup / generation / scoped / post-publication / control failure、bounded degraded、logical alert、恢复、测试切口和no weak fallback闭合。 |
| 12 | `04_config_step_12_downstream_handoff.md` | 定义测试、验收、实施与运维承接 | done_reviewed | passed_to_step_13 | 全流程已审查完成;由`05`接续。 | `05/06/07/09`责任、planned evidence、profile /控制面 / 40组 / 44域覆盖、blocker分发和historical material闭合,未伪造测试或实施 evidence。 |
| 13 | `04_config_step_13_migration_deprecation_evolution.md` | 定义配置迁移、废弃与演进 | done_reviewed | passed_to_step_14 | 全流程已审查完成;由`05`接续。 | 当前无迁移项、baseline /兼容 /废弃 /移除协议、source / profile / sensitive / 40组 / 44域审计、future queue和planned MER闭合。 |
| 14 | `04_config_step_14_risks_open_questions.md` | 风险与待确认事项 | done_reviewed | passed_to_step_15 | 全流程已审查完成;由`05`接续。 | 风险、待确认、`03`回写、veto、blocked scope、profile / 40组 / 44域和下游关闭门禁闭合。 |
| 15 | `04_config_step_15_formal_document_assembly.md` | 整理正式配置设计文档 | done_reviewed | passed_to_05 | 用户已确认;由`05` Step 1接续。 | 正式 `04` 已按15章主链装配,每章有校准来源,机械审计无unresolved冲突且无未处理`03`回写项。 |

---

## 5. 文档级 blocker 台账

| Blocker ID | Step | 状态 | 描述 | 处理口径 |
|---|---|---|---|---|
| SBX-CFG-BOOT-001 | Step 1 | resolved_for_cfg_step_1 | L4-sandbox 原缺当前重启状态下的 `04` 配置校准 flow。 | 本文件已创建,并完成 Step 1。 |
| SBX-CFG-HIST-001 | Step 1 | contained_as_historical_material | 旧 README / 旧 `05/06` 把 Docker+gVisor、默认无出网、seccomp / AppArmor、host runtime、旧 allowlist、旧对象和旧环境矩阵写成事实。 | Step 1 已降级为 historical material / 下游方向输入;后续不得直接继承。 |
| SBX-CFG-SCOPE-001 | Step 2 | resolved_for_cfg_step_2 | Step 1 只形成候选配置域,尚未区分 P0 / P1 / P2、无配置路径和非范围去向。 | Step 2 已明确完整配置路径、范围分层、重点边界覆盖和非范围风险。 |
| SBX-CFG-CONTROL-001 | Step 3 | resolved_for_cfg_step_3 | Step 2 已确定配置范围,但 raw config owner、validated assembly、配置控制面、配置域 owner 和跨控制面关系尚未形成可审查全景。 | Step 3 已建立唯一 raw config owner、11 个控制面、44 个配置域、逐控制面停审和跨控制面审计;CP-10 exact carrier 与 CP-11 P2 overlay 仅保留为后续 watch。 |
| SBX-CFG-BOUNDARY-001 | Step 4 | resolved_for_cfg_step_4 | Step 3 已定义配置域允许 / 禁止能力,但配置类别、更新时机、逐域闭集和禁止项正式变更流程尚未统一。 | Step 4 已定义 10 类可配置类别、1 类 design boundary、6 类更新时机、24 项禁止边界和 D01~D44 逐域分类;P0 无核心 hot update。 |
| SBX-CFG-SOURCE-001 | Step 5 | resolved_for_cfg_step_5 | Step 3 仅预览来源类型,Step 4 仅定义类别和更新边界,尚无正式覆盖顺序、分通道规则、冲突判定和逐域不可用策略。 | Step 5 已定义 S00~S08、4 条解析通道、S01 < S02 < S03、C01~C27 和 D01~D44 来源闭集;remote / admin 当前 unsupported。 |
| SBX-CFG-PROFILE-001 | Step 6 | resolved_for_cfg_step_6 | Step 5 已定义来源通道,但环境适用性、contract / conformance资格、部署角色、adapter mode、敏感配置和逐域profile差异尚未形成矩阵。 | Step 6 已定义 ENV-01~07、PROFILE-01~07并分离P0 non-executing contract、P1 backend conformance和conditional deployment target;P07当前inactive。 |
| SBX-CFG-ITEM-001 | Step 7 | resolved_for_cfg_step_7 | Step 6已定义profile差异,但缺少字段级schema、默认值、必填性、来源、作用域、生效、敏感性、失败策略、JSON demo和跨项启用约束。 | Step 7已定义I001~I101、40个功能模块、D01~D44映射、FC-01~06、三类handoff唯一启用源和P0内建引用目录;全部机械门禁通过。 |
| SBX-CFG-SECRET-001 | Step 8 | resolved_for_cfg_step_8 | Step 7只有sensitive标签和M lane,尚无逐项存储、轮换、审计、禁止输出和material生命周期。 | Step 8已闭合40项分类、23个slot、PROFILE-01~07资格、lease / rotation / revocation、SEC-01~18和跨泄露审计。 |
| SBX-CFG-SECRET-PROVIDER-001 | Step 8 / P05+ activation | open_for_p05_p06_p07_activation | provider产品、principal、endpoint和真实binding未选择。 | 不阻塞Step 9或P0;Step 9仅定义产品中立LD-18门禁,P05/P06/P07激活前必须在后续ADR / `07` /运维手册中完成资格闭环。 |
| SBX-CFG-SECRET-REVOCATION-001 | Step 8 / `03` reopen watch | contained_by_current_baseline | immediate push revocation和adapter hot-stop callback无当前`03` port / flow。 | 当前只承诺bounded lease、provider deny / expiry与runtime termination / restart;若要求callback必须先回写`03`。 |
| SBX-CFG-SECRET-PLATFORM-001 | Step 8 / downstream qualification | open_for_05_06_07_09 | swap、core dump、SDK memory、zeroization和provider audit等平台事实未验证。 | 不阻塞Step 9;P05/P06资格必须由后续测试、验收、实施和运维闭合。 |
| SBX-CFG-LOAD-001 | Step 9 | resolved_for_cfg_step_9 | Step 7/8尚无完整load / validate / activate / assemble / publish顺序。 | Step 9已闭合V01~10、FZ-01~06、LD-01~30、40组、44域、XVAL、issue和atomic publication。 |
| SBX-CFG-LOAD-CARRIER-001 | Step 9 | resolved_no_writeback | `03`没有Step 9私有阶段 / issue / activation名称。 | 全部保持infra-private logical semantics,不新增public object / port / DTO。 |
| SBX-CFG-LOAD-DEGRADED-001 | Step 9 | contained_by_existing_carrier | `RuntimeConfigStatus::Degraded`可能被误作hard guard放宽。 | 只允许read / maintenance / optional telemetry surface;policy、boundary、audit、cleanup、redline和redaction不可degraded allow。 |
| SBX-CFG-LOAD-RELOAD-001 | Step 9 / future reopen | contained_as_unsupported | remote config、admin override、reload、LKG、partial generation和hot adapter swap无`03` contract。 | XVAL-36统一reject;未来要求时先回写`03`并重开`04`。 |
| SBX-CFG-CHANGE-001 | Step 10 | resolved_for_cfg_step_10 | Step 7~9尚无actor、review、change、rollback和drift闭环。 | Step 10已闭合CCA / CRL / CCT / CCS / CAP / CRB / CDR、40组回指和逐类停审。 |
| SBX-CFG-CHANGE-CARRIER-001 | Step 10 / carrier watch | resolved_ops_private_no_writeback | `03`没有完整configuration change object / port。 | 完整record归release / operations plane;runtime只复用既有config validation / adapter availability safe surface。 |
| SBX-CFG-CHANGE-RUNTIME-API-001 | Step 10 / future blocker | blocker_if_requested | runtime mutation API、change query或内部持久化record会改变protocol / authorization / audit / idempotency。 | 当前禁止;若被要求,必须先回写`03` Step 6~15。 |
| SBX-CFG-CHANGE-DRIFT-001 | Step 10 / downstream carrier gap | open_for_07_09 | rollout scope、desired marker store和fleet observation物理载体未选择。 | 不阻塞Step 10;`07/09`必须选择carrier并保持scope唯一desired和no-auto-overwrite。 |
| SBX-CFG-CHANGE-ROLLBACK-001 | Step 10 / downstream operations gap | open_for_07_09 | process orchestration、traffic / drain和software / config compatibility runbook未定义。 | 不阻塞Step 10;本Step只定义prior candidate全量重建和诚实成功判定,不伪造部署能力。 |
| SBX-CFG-CHANGE-PROVIDER-001 | Step 10 / P05+ activation | open_for_p05_p06_p07_activation | provider rotation / revocation产品和principal未选择。 | 不阻塞P0或Step 10;激活前闭合CCT-15 / 16和provider native audit。 |
| SBX-CFG-FAILURE-001 | Step 11 | resolved_for_cfg_step_11 | Step 5/7/8/9/10失败面分散,尚无统一fail-fast / fail-closed / degraded / alert / recovery / test闭环。 | Step 11已闭合FDP / FDS / CFM / ALC / RCV / FDT、40配置组、44域和逐组停审。 |
| SBX-CFG-FAILURE-ALERT-001 | Step 11 / downstream operations gap | open_for_05_06_07_09 | 告警产品、阈值、聚合窗口、notification和runbook未定义。 | 不阻塞Step 11;当前只定义logical alert class和safe fields。 |
| SBX-CFG-FAILURE-PROVIDER-001 | Step 11 / P05+ activation gap | open_for_p05_p06_p07_activation | provider产品、principal、native audit、revocation hook和平台anti-leak未验证。 | 不阻塞P0或Step 11;激活前由`05/06/07/09`闭合资格。 |
| SBX-CFG-FAILURE-ROLLOUT-001 | Step 11 / downstream carrier gap | open_for_07_09 | desired / observed / rollout observation物理载体和fleet completion未选择。 | 不阻塞Step 11;保持scope-bound marker、no-auto-overwrite和诚实失败状态。 |
| SBX-CFG-HANDOFF-001 | Step 12 | resolved_for_cfg_step_12 | Step 6~11分别有下游方向,但缺少统一责任链、证据成熟度、逐集合覆盖和冲突回退规则。 | Step 12已闭合DSH / TSH / AHG / EHR / IMH / OPH、profile、控制面、40组 / 101项、44域和跨下游审计。 |
| SBX-CFG-HANDOFF-HIST-001 | Step 12 / historical material | contained | 旧`05/06`对象、host runtime、旧环境和空checkbox可能回流为当前测试 /验收事实。 | Step 12已后置审计并隔离;后续`05/06`必须各自full-restart。 |
| SBX-CFG-HANDOFF-TEST-001 | Step 12 / downstream document gap | resolved_reviewed_for_06_start | 正式`05`原为旧文档链。 | 正式`05`已按full-restart重建并经用户审查;测试执行 /evidence仍未形成。 |
| SBX-CFG-HANDOFF-ACCEPT-001 | Step 12 / downstream document gap | resolved_reviewed_for_07_start | 正式`06`原为旧文档链且无当前evidence裁决。 | 正式`06`已重建并经用户审查;验收过程仍`NotEntered`且无runtime evidence。 |
| SBX-CFG-HANDOFF-IMPLEMENT-001 | Step 12 / downstream document gap | resolved_by_07_step_13_review | 正式`07`、implementation ledger和planned boundaries原不存在。 | `07` Step 13已同步创建正式文档、项目ledger和32件非空planned skeleton,通过机械审计并获用户审查确认;不产生实现授权。 |
| SBX-CFG-HANDOFF-OPS-001 | Step 12 / downstream document gap | open_for_09 | 正式`09`不存在,真实产品 /路径 /命令 /阈值未定义。 | 不阻塞Step 12;只在implemented / qualified baseline后创建。 |
| SBX-CFG-HANDOFF-ACTIVATION-001 | Step 12 / P05+ activation gap | open_for_p05_p06_p07_activation | backend、provider、anti-leak、rollout carrier、alert、runbook和真实evidence未闭合。 | 不阻塞P0或Step 12;任何P05+资格声明前必须由`05/06/07/09`逐项关闭。 |
| SBX-CFG-HANDOFF-FUTURE-001 | Step 12 / future blocker | blocker_if_requested | remote / admin / reload / LKG / hot swap / immediate callback会越过当前`03/04`。 | 当前unsupported;任一下游要求时先回写`03`,再重开`04`对应Step。 |
| SBX-CFG-EVOLUTION-001 | Step 13 | resolved_for_cfg_step_13 | Step 5~12有演进触发器,但无统一current baseline、compatibility、deprecation、removal和逐项审计。 | Step 13已闭合EBU / ELS / ECW / EIP / EVC / DSG / ERG / FEQ / MER、S00~S08、profile、sensitive、40组 / 101项和44域。 |
| SBX-CFG-EVOLUTION-BASELINE-001 | Step 13 / maturity guard | contained_as_designed_initial | 正式`04`、目标实现仓、首个software / config release和资格事实均未形成。 | 当前明确无迁移项;I001~I101只处于designed initial,不伪造v1 /日期 /consumer。 |
| SBX-CFG-EVOLUTION-HIST-001 | Step 13 / historical material | contained | 旧README / `05/06`可能被误写成legacy schema / product / environment。 | Step 13已后置审计为非迁移输入,不生成mapping。 |
| SBX-CFG-EVOLUTION-VERSION-001 | Step 13 / carrier watch | contained_by_current_baseline | 当前无config schema-version / runtime negotiation carrier;marker / ref / generation可能被误用。 | 当前不新增carrier;若要求runtime negotiation先回写`03`并重开Step 5 / 7 / 9~13。 |
| SBX-CFG-EVOLUTION-DUAL-READ-001 | Step 13 / future design reopen | blocker_if_requested | 当前C05 / C06 strict reject,无alias / deprecated warning / dual-parser contract。 | rename兼容要求出现时重开Step 5 / 7 / 9~13;public carrier变化先回`03`。 |
| SBX-CFG-EVOLUTION-ROLLBACK-001 | Step 13 / downstream gap | open_for_05_06_07_09 | 尚无真实software baseline、prior candidate或rollback drill。 | 不阻塞Step 13;真实release前按MER-04/11与ERG-06闭合。 |
| SBX-CFG-EVOLUTION-PROFILE-001 | Step 13 / P05+ activation gap | open_for_p05_p06_p07_activation | backend / provider / products / anti-leak / rollout / evidence / runbook未闭合。 | 不阻塞P0或Step 13;任何P05+ migration / promotion前关闭。 |
| SBX-CFG-EVOLUTION-REPO-001 | Step 13 / implementation precheck | open_for_07 | 目标实现仓与software baseline当前不存在。 | 不阻塞Step 13;`07`首个precheck确认,不得伪造version / commit。 |
| SBX-CFG-EVOLUTION-FUTURE-001 | Step 13 / future blocker | blocker_if_requested | S07 / S08 / reload / LKG / hot / schema negotiation / callback / public migration API会越过当前`03/04`。 | 触发时按FEQ先回写`03`,再重开`04`对应Step。 |
| SBX-CFG-RISK-001 | Step 14 | resolved_for_cfg_step_14 | Step 1~13风险、待确认、blocked scope和`03`影响分散。 | Step 14已闭合RSK / OQ / BTR / WR / VETO、逐Step / profile / 40组 / 44域和跨风险审计。 |
| SBX-CFG-RISK-WRITEBACK-001 | Step 14 / `03` gate | resolved_no_current_writeback | conditional `影响03=是`可能被误读为永久no-writeback。 | WR-07~26均为future trigger;触发时先转blocker并回写`03`。 |
| SBX-CFG-RISK-DOWNSTREAM-001 | Step 14 / downstream | resolved_for_formal_05_06_and_07_step_13_review | 正式`05/06`原未重建且`07`原无当前实施准备编排。 | `05/06`已重建审查,`07` Step 13正式文档与全部台账骨架已形成并获用户审查确认;目标仓、真实产品、资格、runtime evidence与实现事实仍未形成。 |
| SBX-CFG-RISK-ACTIVATION-001 | Step 14 / P05+ | open_for_p05_p06_p07_activation | backend、provider、anti-leak、rollout、alert、runbook与真实evidence未闭合。 | P05/P06保持unqualified,P07 inactive;不得宣称ready。 |
| SBX-CFG-RISK-FUTURE-001 | Step 14 / future blocker | blocker_if_requested | dynamic source / reload / callback / public config或migration surface越过当前`03/04`。 | 按BTR-12~16和WR清单先回写`03`,再重开`04`。 |
| SBX-CFG-DOC-GAP-001 | Step 15 | resolved_for_cfg_step_15 | 正式 `04-配置设计.md` 原缺失。 | Step 15已由确认的Step 1~14装配重建、完成自检并经用户审查通过;当前由`05`接续。 |
| SBX-CFG-WRITEBACK-001 | Step 1~15 | active_guard | 后续配置结论可能改变 `03` runtime config、builder、adapter constructor、port、error、DTO、flow 或 audit schema。 | 每个 Step 必须维护“对详细设计的影响判定”;Step 15确认当前无具体回写项。WR-07~26仍为未激活future trigger,进入current scope时必须重新判定并阻塞。 |
| SBX-IMP-LEASE-RUN-GUARD-001 | downstream `07` Step 6 writeback | resolved_by_07_step_6_writeback | I065在部分已审查材料中仍被表述为launch时消费,与generation-scoped Boundary establishment及持久化lease owner冲突。 | 已回写Step 3 /4 /5 /7 /8 /9和正式`04`:I065由同代backend adapter在boundary establishment消费并保存bounded window;Run / reaper只读已保存window / status,不得重算。配置项仍为101,控制面 /域 /profile计数不变。 |
| SBX-IMP-DOWNSTREAM-STATUS-STEP8-001 | downstream `07` Step 8 | resolved_by_07_step_8_dynamic_writeback | 正式`04`§12.3 / §14.11与本flow仍把`05/06`写为旧链或把`07`写为完全未推进,与Step 8已完成待审冲突。 | 只更新下游进度;不改I001~I101、profile、material、资格或runtime事实。 |
| SBX-IMP-DOWNSTREAM-STATUS-STEP9-001 | downstream `07` Step 9 | resolved_by_07_step_9_dynamic_writeback | 正式`04`§12.3 / §14.11与本flow仍把`07`写为Step 8待审,与Step 9已完成待审冲突。 | 只更新Spike /风险 /待确认事项和boundary风险反查进度;不改I001~I101、profile、material、资格或runtime事实。 |
| SBX-IMP-DOWNSTREAM-STATUS-STEP10-001 | downstream `07` Step 10 | resolved_by_07_step_10_dynamic_writeback | 正式`04`§12.3 / §14.11与本flow仍把`07`写为Step 9待审,与Step 10已完成待审冲突。 | 只更新暂停 /回退 /变更 /恢复、boundary控制和失效传播进度;不改I001~I101、profile、material、资格或runtime事实。 |
| SBX-IMP-DOWNSTREAM-STATUS-STEP11-001 | downstream `07` Step 11 | resolved_by_07_step_11_dynamic_writeback | 正式`04`§12.3 / §14.11与本flow仍把`07`写为Step 10待审,与Step 11已完成待审冲突。 | 只更新提交 /评审 /交付纪律、32 boundary message映射和canonical artifact / report审计进度;不改I001~I101、profile、material、资格或runtime事实。 |
| SBX-IMP-DOWNSTREAM-STATUS-STEP12-001 | downstream `07` Step 12 | resolved_by_07_step_12_dynamic_writeback | 正式`04`§12.3 / §14.11与本flow仍把`07`写为Step 11待审,与Step 12已完成待审冲突。 | 只更新完成分层、39 /39交付、14 /14 phase、32 /32 boundary可落码审计、canonical证据和未完成处置;不改I001~I101、profile、material、资格或runtime事实。 |
| SBX-IMP-DOWNSTREAM-STATUS-STEP13-001 | downstream `07` Step 13 | resolved_by_07_step_13_review_writeback | 正式`04`§12.3 / §14.11与本flow曾把`07`写为正式文档和台账未形成或装配待审,与Step 13已装配并获用户审查确认的当前状态冲突。 | 只更新正式`07`、implementation ledger、32件planned skeleton、机械审计和文档审查进度;不改I001~I101、profile、material、资格或runtime事实。 |
| SBX-DOC-GAP-TEST-001 | downstream | resolved_reviewed_for_06_start | 正式`05-测试方案.md`原未按新版`03/04`重建。 | 已按full-restart重建并经用户审查;当前无测试执行事实。 |
| SBX-DOC-GAP-ACCEPT-001 | downstream | resolved_reviewed_for_07_start | 正式`06-验收标准.md`原未按新版`03/04/05`重建。 | 已按full-restart重建并经用户审查;验收过程仍`NotEntered`。 |
| SBX-DOC-GAP-002 | downstream | resolved_step_13_reviewed | 正式`07-实施计划.md`原缺失。 | `07` Step 13已同步创建正式`07`、implementation ledger和全部32件planned boundary skeleton并获用户审查确认。 |

---

## 6. 当前 next_allowed_action

```text
current_document = `04-配置设计.md`
current_step = Step 15 `整理正式配置设计文档`
gate_status = passed_to_05
next_allowed_action = 用户已确认正式`04`;由`05_test_plan_calibration_flow.md`和`05_test_plan_step_01_input_boundary.md`接续
formal_document_write = completed_reviewed_for_05_start
commit_required = no
```

## PHYSICAL EOF Current Override: DesignReopen binding propagation completed

Step 3 与正式 `04` 已从 current `03` 机械同步 capture / handoff / publisher / ordinary-hook binding。这不改变
I001~I101、D01~D44、profile 或 product-neutral 结论，也不产生 provider 资格或 runtime 事实。

```text
current_document = 04-配置设计.md
current_step = DesignReopen current binding propagation completed
source_contract = CaptureCollectionPort|HandoffTargetDeliveryPort|SandboxEventPublisherPort|ordinary_observability_hook
legacy_material_handoff_port = historical_material_only
config_inventory_changed = no
provider_selected = no
provider_conformance = not_started
implementation_started = no
real_test_execution = not_started
real_evidence_created = no
acceptance_signoff = no
commit_required = no
design_chain_status = completed_current_closeout
next_required_reads = project_execution_ledger.md|implementation_execution_ledger.md|07-实施计划.md|implementation-boundaries/CB-SBX-01A.md
next_allowed_action = fixed_design_baseline_then_close_01A_activation_prerequisites
```

## PHYSICAL EOF Current Override: final design closure calibration (`DC-03`)

`04` 的 I001~I101、D01~D44、S00~S08、ENV/PROFILE 与业务 invariant 不重开。Step 15 仅获准核验最终技术
基线是否需要新增配置 binding；技术版本必须是构建期锁定，不得被降级为运行时可配置项。

```text
current_plan = /tmp/L4-sandbox_final_design_closure_execution_plan.md
current_document = 04-配置设计.md
current_step = Step 15 post-closeout technical binding audit authorized
flow_status = completed_current_closeout_pending_DC-04_audit
subject_config_reopen = no
next_allowed_action = DC-04_audit_formal_04_technical_binding
commit_required = no
```

## PHYSICAL EOF Current Override: `DC-06` current-truth repair authorized

```text
current_plan = /tmp/L4-sandbox_final_design_closure_execution_plan.md
current_document = 04-配置设计.md
current_step = Step 15 final static audit repair
flow_status = current_truth_repair_authorized
subject_config_reopen = no
formal_delta = section_12_3_boundary_route_only
current_boundary_status = blocked|activation_gate|handoff
config_inventory_changed = no
implementation_started = no
real_test_execution = not_started
real_evidence_created = no
acceptance_signoff = no
next_allowed_action = update_formal_04_current_boundary_route
commit_required = no
```

## PHYSICAL EOF Current Override: `DC-06` completed, `DC-07` current

```text
current_plan = /tmp/L4-sandbox_final_design_closure_execution_plan.md
current_document = 04-配置设计.md
current_step = DC-06 current-truth repair and final audit completed
flow_status = completed_design_static_only
formal_delta = section_12_3_boundary_route|section_14_11_boundary_route
design_conclusion = design_closed_ready_for_baseline_publication
project_current_document = 07-实施计划.md
project_current_step = Step 18 baseline publication disposition
current_dc_task = DC-07
design_baseline = not_fixed
current_boundary_status = blocked|activation_gate|handoff
config_inventory_changed = no
implementation_started = no
real_test_execution = not_started
real_evidence_created = no
acceptance_signoff = no
next_allowed_action = DC-07_record_baseline_publication_disposition
commit_required = no
```

## PHYSICAL EOF Current Override: `DC-07` disposition completed

```text
current_plan = /tmp/L4-sandbox_final_design_closure_execution_plan.md
current_document = 04-配置设计.md
current_step = DC-07 baseline publication disposition consumed
flow_status = completed_design_static_only
project_design_status = closed_without_baseline_publication
completed_dc_tasks = DC-00|DC-01|DC-02|DC-03|DC-04|DC-05|DC-06|DC-07
project_current_design_task = none
design_conclusion = design_closed_ready_for_baseline_publication
design_baseline = not_fixed
baseline_publication_disposition = completed_without_publication
baseline_publication_status = not_published
commit_authorization = absent
current_boundary_status = blocked|activation_gate|handoff
config_inventory_changed = no
implementation_started = no
real_test_execution = not_started
real_evidence_created = no
acceptance_signoff = no
next_allowed_action = wait_explicit_commit_authorization
commit_required = no
```
