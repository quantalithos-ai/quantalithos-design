# L2-member-service 04-配置设计校准流程

> 对应 SOP：`standards/document/配置设计讨论流程_SOP.md`
> 中间产物规范：`standards/document/设计文档讨论中间产物规范.md`
> 书写规范：`standards/document/配置设计书写规范.md`
> 目标正式文档：`projects/L2-member-service/04-配置设计.md`
> 执行模式：full-restart；旧 README、旧正式 `00/01/02/03/05/06` 与 draft 仅作为历史材料 / 污染审计输入
> 创建日期：2026-09-02

## 1. 本轮目标

在正式 `03-详细设计.md` 已完成并停审后，按配置设计 SOP 从输入边界开始逐步生成 `04-配置设计.md`。本轮配置设计只定义配置控制面、配置域、配置项、来源、优先级、敏感性、加载校验、生效、变更、失效和下游承接；不替代需求、架构、概要、详细、测试、验收或实施文档。

本项目当前存在多个明确配置绑定点，因此不能走“无配置项目”捷径。完整配置项、默认值和环境矩阵必须等后续 Step 独立收敛，不能从旧 README 或旧 `05/06` 直接继承。

## 2. 权威输入与效力

| 输入 | 权威级别 | 用途 | 当前处置 |
|---|---|---|---|
| `projects/L2-member-service/00-需求文档.md` | 正式上游 | 需求边界、非功能、安全、数据归属、外部依赖、fail-closed 与交接红线 | 直接承接 |
| `projects/L2-member-service/01-架构设计.md` | 正式上游 | Host Truth Center、依赖方向、数据 owner、运行角色、产品中立和架构红线 | 直接承接 |
| `projects/L2-member-service/02-概要设计.md` | 正式上游 | CMP、主要组成、对象轮廓、接口 / 流程 / 状态边界和配置影响方向 | 直接承接 |
| `projects/L2-member-service/03-详细设计.md` | 直接输入 | `infra/config.rs`、`runtime_builder`、adapter / port、入口参数、错误、并发、观测和配置不可变边界 | 直接承接；字段级配置留给后续 Step |
| `design-calibration/03_ddd_step_14_config_dependencies.md` | 直接输入 | section、binding point、依赖分类、builder 顺序、fake / blocked 策略 | 作为字段级来源 |
| 通用设计标准与配置 SOP / 书写规范 | 流程约束 | Step 顺序、三层台账、JSON、敏感配置、回写和停审门禁 | 已读取并遵循 |
| `projects/L1-governance/04-配置设计.md`、`04_config_step_01_upstream_boundary.md` | 粒度 / 格式参考 | 参考配置设计的输入边界、回填表、问题诊断和 gate 写法 | 只作格式参考，不定义本仓 truth |
| 本仓旧 `README.md`、旧正式 `05-测试方案.md`、`06-验收标准.md` | historical_material | 识别旧环境、测试、验收和产品假设 | 不覆盖新版 `00~03` |
| `projects/L2-member-service/draft/` | 预讨论输入 | 识别仓定位、交互、能力和分层候选 | 不直接进入正式配置结论 |
| `L2-member`、`L2-member-images` 等并行项目当前文档 | 只读协作输入 | 识别 owner 方向和未闭合合同 | 只能形成 pending / blocked / placeholder |

## 3. Step 总览与文档级门禁

| Step | 主题 | 输出文件 | gate_status | 当前状态 / 进入条件 |
|---|---|---|---|---|
| Step 1 | 确认配置输入边界 | `04_config_step_01_upstream_boundary.md` | `completed / pass_with_upstream_blockers` | 已完成并停审；用户本轮“继续”后进入 Step 2 |
| Step 2 | 明确配置设计目标、范围和非范围 | `04_config_step_02_scope.md` | `completed / pass_with_upstream_blockers` | 已完成；本轮用户明确要求完成全部 04，允许进入 Step 3 |
| Step 3 | 建立配置控制面总览 | `04_config_step_03_control_plane.md` | `completed / pass_with_upstream_blockers` | 已完成来源链、装配入口、控制面、功能域与跨控制面审计 |
| Step 4 | 定义配置分类与禁止配置化边界 | `04_config_step_04_categories_boundaries.md` | `completed / pass_with_upstream_blockers` | 已完成分类、更新时机、禁止项和跨分类审计 |
| Step 5 | 定义配置来源、优先级与冲突处理 | `04_config_step_05_sources_priority_conflicts.md` | `completed / pass_with_upstream_blockers` | 已完成普通来源优先级、局部来源、冲突和不可用策略；允许进入 Step 6 |
| Step 6 | 定义环境、部署 profile 与配置矩阵 | `04_config_step_06_environment_profiles_matrix.md` | `completed / pass_with_upstream_blockers` | 已完成 P0 profile、来源、依赖和测试 / 验收矩阵；允许进入 Step 7 |
| Step 7 | 定义配置项清单 | `04_config_step_07_config_items.md` | `completed / pass_with_upstream_blockers` | 已完成十列清单、功能模块 JSON demo、完整 JSONC demo和跨项审计；允许进入 Step 8 |
| Step 8 | 定义敏感配置与密钥管理 | `04_config_step_08_sensitive_secrets.md` | `completed / pass_with_upstream_blockers` | 已完成敏感级别、opaque ref、读取、轮换、审计和禁止输出；允许进入 Step 9 |
| Step 9 | 定义配置加载、校验与生效机制 | `04_config_step_09_loading_validation_activation.md` | `completed / pass_with_upstream_blockers` | 已完成加载链、类型 / 交叉校验、生效时机和 P0 reload/hot 拒绝；允许进入 Step 10 |
| Step 10 | 定义配置变更、审计与回滚 | `04_config_step_10_change_audit_rollback.md` | `completed / pass_with_upstream_blockers` | 已完成变更作用域、风险分级、审计最小字段和按 activation kind 的回滚；允许进入 Step 11 |
| Step 11 | 定义失效模式与降级 / fail-fast 策略 | `04_config_step_11_failure_degradation.md` | `completed / pass_with_upstream_blockers` | 已完成配置阶段与运行期依赖失败分层、fail-fast/fail-closed/blocked/degraded/delayed/failed marker；允许进入 Step 12 |
| Step 12 | 定义测试、验收、实施与运维承接 | `04_config_step_12_downstream_handoff.md` | `completed / pass_with_upstream_blockers` | 已完成 05/06/07/09 输入、evidence 语义和下游不得改写契约边界；允许进入 Step 13 |
| Step 13 | 定义配置迁移、废弃与演进 | `04_config_step_13_migration_deprecation_evolution.md` | `completed / pass_with_upstream_blockers` | 已完成无迁移基线、引入/废弃/移除规则、永久拒绝项和 future evolution queue；允许进入 Step 14 |
| Step 14 | 定义风险与待确认事项 | `04_config_step_14_risks_open_questions.md` | `completed / pass_with_upstream_blockers` | 已完成风险、待确认、03 回写与跨风险审计；允许进入 Step 15 |
| Step 15 | 整理正式配置设计文档 | `04_config_step_15_formal_document_assembly.md` | `completed / pass_with_upstream_blockers` | 正式 `04` 已创建并完成最终审计；当前停审等待用户审查，不得进入 05 |

未来 Step 文件不得在当前 Step 提前创建。该总览只记录流程计划，不代表未来结论已成立。

## 4. 当前停审点

```text
current_document = 04-配置设计.md
current_step = Step 15 formal_document_assembly
current_module = formal_document_assembly
step_01_status = completed / pass_with_upstream_blockers
step_02_status = completed / pass_with_upstream_blockers
step_03_status = completed / pass_with_upstream_blockers
step_04_status = completed / pass_with_upstream_blockers
step_05_status = completed / pass_with_upstream_blockers
step_06_status = completed / pass_with_upstream_blockers
step_07_status = completed / pass_with_upstream_blockers
step_08_status = completed / pass_with_upstream_blockers
step_09_status = completed / pass_with_upstream_blockers
step_10_status = completed / pass_with_upstream_blockers
step_11_status = completed / pass_with_upstream_blockers
step_12_status = completed / pass_with_upstream_blockers
step_13_status = completed / pass_with_upstream_blockers
step_14_status = completed / pass_with_upstream_blockers
step_15_status = completed / pass_with_upstream_blockers
gate_status = step_15_completed / pass_with_upstream_blockers
formal_04_write_allowed = completed
formal_04_stop_review = completed; waiting_for_user_review
next_allowed_action = wait_for_user_review_before_entering_05
implementation_allowed = false
test_execution_allowed = false
commit_allowed = false
```

Step 1 已完成输入边界、历史污染和详细设计回写判定；Step 2 已完成配置目标、P0/P1/P2 范围、非范围和无配置路径判定。下句是当时的历史快照：两步均没有创建正式 `04-配置设计.md`，也没有定义具体配置项、默认值、profile、secret 或生效数值；正式 `04` 已在 Step 15 装配完成。

## 4.1 Step 2 停审记录

| 项目 | 结论 |
|---|---|
| 输出文件 | `design-calibration/04_config_step_02_scope.md` |
| Step 状态 | `completed / pass_with_upstream_blockers` |
| 配置项目判定 | 本仓不是“无配置项目”；Step 3~13 适用 |
| P0 口径 | local / fake / in-memory / placeholder / disabled / blocked 条件下的语义可装配、可判定和可测试；不代表真实 readiness |
| P1 / P2 口径 | P1 为 durable / real-like / observability / handoff / secret 等产品化承接；P2 为多区域、多租户、容量和深度集成演进 |
| 详细设计回写 | 当前无回写；若后续配置结论改变 `03` 代码契约或 owner，必须先暂停并回写 |
| 上游 blocker | `MSVC-UP-001~008`、cursor、产品、measurement、policy / credential owner 继续 pending / blocked / waiting |
| 正式 `04` | 仍未创建；仅允许在 Step 15 装配 |
| 下一动作 | `complete_step_03_control_plane_then_self_check` |

## 4.2 Step 3 开工确认（2026-09-02）

| 项目 | 记录 |
|---|---|
| Step | Step 3 建立配置控制面总览 |
| 输出文件 | `design-calibration/04_config_step_03_control_plane.md` |
| 已读取通用规范 | yes |
| 已读取 SOP / 书写规范 | yes |
| 已读取前序输入 | yes（项目 ledger、04 flow、Step 1、Step 2、00/01/02/03、03 Step 14、L1-governance 参考） |
| 当前模式 | full-restart / normal continuation under explicit user authorization |
| 本 Step 模块骨架 | done（runtime、stores、qualification、lifecycle、publication、jobs、read、安全与测试） |
| 进入条件 | pass_with_upstream_blockers |

## 4.3 Step 3 完成记录与 Step 4 开工确认（2026-09-02）

| 项目 | 记录 |
|---|---|
| Step 3 状态 | `completed / pass_with_upstream_blockers` |
| Step 3 已收口 | 配置来源链、`infra/config.rs -> infra/runtime_builder.rs`、读取层、控制面 / 配置域、允许 / 禁止能力和跨控制面审计 |
| 详细设计影响 | 当前无回写；未来 hot reload、动态替换、新 runtime 字段或构造参数需先回写 `03` |
| Step 4 输入 | Step 1/2/3、`03-详细设计.md` §13、配置 SOP / 书写规范、L1-governance Step 4 参考 |
| Step 4 状态 | `in_progress / pass_with_upstream_blockers`；正式 `04` 仍禁止创建 |

## 5. 配置设计总执行约束

- 先读项目级 `project_execution_ledger.md`，再读本 flow 和当前 Step 文件；任何“继续”不得绕过三层台账。
- 每个 Step 独立回答 SOP 问题、记录诊断与取舍、形成结构化产物、写回草稿、自检并停审。
- 正式 `04-配置设计.md` 必须等 Step 15 装配；当前不得提前创建。
- 默认运行配置格式按严格 JSON 设计；具体 key、默认值、环境变量和 secret provider 只能在对应 Step 收敛。
- 配置只能驱动允许的运行装配、adapter、runner、刷新或降级行为，不能改变 `ProjectMemberRef` 执行主语、Host Truth owner、状态机、事务、幂等、Query no-write、Job no-authorization、redaction 或四层 handoff。
- `domain`、`contracts`、application use-case、API / worker / job handler 不读取 raw config、环境变量或 secret body；只有 `infra/config.rs` 负责加载校验，`infra/runtime_builder.rs` 负责 typed binding。
- `compile`、`runtime`、`event`、`ref`、`adapter`、`fake` 依赖不得互相转换；兄弟仓、容器、RPC、事件、数据库和 SDK 运行期协作不得伪装成源码依赖。
- unresolved sibling contract 只能使用 `pending`、`blocked`、`waiting`、`placeholder`、`unknown`、`degraded` 或 `fail-closed`；fake、receipt、timeout、availability 和局部 assembly 不得升级为 ready / healthy / delivered / observed / accepted。
- token、password、certificate、private key、DSN、credential body、外部正文、manifest 和 endpoint secret 不得进入普通配置、domain、日志、错误、审计、trace、report 或 artifact。
- 不锁定具体数据库、消息总线、容器 / 编排平台、RPC、observability backend、DLQ、scheduler 或外部 GRC 产品；产品选择需由后续 ADR / 实施门禁确认。

## 6. Step 2 之后的停审规则

Step 2 的 `gate_status` 仅表示配置目标、范围和非范围已收稳，并不表示任何上游 exact contract、adapter、存储、事件路由、观测后端或运行环境已 ready。未经用户明确确认 Step 3，不得：

1. 创建 `04_config_step_03_control_plane.md` 或任何未来 Step 文件；
2. 创建或修改正式 `04-配置设计.md`；
3. 将旧 `05/06` 环境矩阵、旧产品和旧性能数字升格为配置真相；
4. 进入 05 / 06 / 07、实施、代码、测试、证据、signoff、readiness 或 commit。

该停审规则已被用户“完成全部的 04”明确授权覆盖；当前按 Step 5 继续，仍不得提前创建正式 `04`。

## 4.4 Step 4 完成记录与 Step 5 开工确认（2026-09-02）

| 项目 | 记录 |
|---|---|
| Step 4 状态 | `completed / pass_with_upstream_blockers` |
| Step 4 已收口 | 九类配置类别、startup / job-run-start / entry-local 更新时机、P0 无 hot update、禁止配置化项、按域分类矩阵和跨分类审计 |
| 详细设计影响 | 当前无回写；未来 hot reload / 动态替换仍为 `03` 回写触发器 |
| Step 5 输入 | Step 1~4、`03` §13、配置 SOP / 书写规范、L1-governance Step 5 参考 |
| Step 5 状态 | `in_progress / pass_with_upstream_blockers`；正式 `04` 仍禁止创建 |

## 4.5 Step 5 完成记录与 Step 6 开工确认（2026-09-02）

| 项目 | 记录 |
|---|---|
| Step 5 状态 | `completed / pass_with_upstream_blockers` |
| Step 5 已收口 | 普通来源唯一顺序为 `code defaults < strict JSON file < environment variables`；entry-local、job-run-start、test fixture 局部隔离；duplicate / alias / 非法高优先级值 / raw secret / enabled target 缺失按 fail-fast、rejected、blocked 或 fail-closed 处理 |
| `03` 影响 | 当前 P0 无回写；future remote config、admin override、hot reload、在线 LKG 或真实 provider 触发时必须先回写 `03` |
| Step 6 输入 | Step 5 来源优先级、`01` 部署边界、`03` 配置绑定、测试 / 验收方向和 L1-governance Step 6 粒度参考 |
| Step 6 状态 | `in_progress / pass_with_upstream_blockers`；正式 `04` 仍禁止创建 |

## 4.6 Step 6 完成记录与 Step 7 开工确认（2026-09-02）

| 项目 | 记录 |
|---|---|
| Step 6 状态 | `completed / pass_with_upstream_blockers` |
| Step 6 已收口 | P0 为 `local-dev`、`ci-test`、`integration-like`、`operations-replay`；`staging-like` / `production-like` 仅 future；来源、外部依赖、敏感 ref、测试 / 验收承接矩阵已完成 |
| `03` 影响 | 当前无回写；future 真实产品、动态替换、provider health 或新 profile enum 触发时先回写 `03` |
| Step 7 输入 | Step 3~6、`03` 配置 binding、配置项最小列要求、L1-governance Step 7 粒度参考 |
| Step 7 状态 | `in_progress / pass_with_upstream_blockers`；按功能域逐批写入，正式 `04` 仍禁止创建 |

## 4.7 Step 7 完成记录与 Step 8 开工确认（2026-09-02）

| 项目 | 记录 |
|---|---|
| Step 7 状态 | `completed / pass_with_upstream_blockers` |
| Step 7 已收口 | P0 配置项十列清单、按功能域模块拆分、严格 JSON demo、完整 JSONC demo、默认值 / 必填 / 失败策略、跨项闭环审计 |
| `03` 影响 | 当前无回写；未来新增 runtime 字段、adapter constructor、Port、DTO、error 或 reload API 仍需先回写 `03` |
| Step 8 输入 | Step 5 来源规则、Step 7 sensitive/ref 配置项、`03` redaction / forbidden-body、L1-governance Step 8 |
| Step 8 状态 | `in_progress / pass_with_upstream_blockers`；正式 `04` 仍禁止创建 |

## 4.8 Step 8 完成记录与 Step 9 开工确认（2026-09-02）

| 项目 | 记录 |
|---|---|
| Step 8 状态 | `completed / pass_with_upstream_blockers` |
| Step 8 已收口 | 所有敏感项按 `public/internal/sensitive/secret` 分类；普通配置只保存 opaque ref；raw secret/body 禁入配置、日志、错误、审计、trace、report、artifact；P0 以 restart/new-job-run 轮换 |
| `03` 影响 | 当前无回写；future provider API、online rotation、credential health 或新 handle 类型需先回写 `03` |
| Step 9 输入 | Step 7 配置项、Step 8 敏感规则、`03` `infra/config.rs` / `runtime_builder`、L1-governance Step 9 |
| Step 9 状态 | `in_progress / pass_with_upstream_blockers`；正式 `04` 仍禁止创建 |

## 4.9 Step 9 完成记录与 Step 10 开工确认（2026-09-02）

| 项目 | 记录 |
|---|---|
| Step 9 状态 | `completed / pass_with_upstream_blockers` |
| Step 9 已收口 | 严格 JSON source merge、canonical key、parse/type/range/ref-shape 校验、cross-field 与 forbidden-body 校验、`ValidatedMemberServiceConfig` 装配、runtime builder 暴露顺序和 startup/job-run-start/entry-local/test-entry 生效矩阵 |
| reload / hot | P0 明确 unsupported；未来支持必须回写 `03` 的 builder、Port、rollback 和 observability contract |
| `03` 影响 | P0 无回写；future remote/admin/online rotation/dynamic replacement 仅记录为 design-change-required |
| 未闭合 blocker | `MSVC-UP-001~008`、cursor、durable store、lease/lock、DLQ、observability backend、具体 provider/产品和数值继续 pending / blocked / placeholder |
| 正式 `04` | 仍未创建；只允许在 Step 15 装配 |
| Step 10 输入 | Step 7 配置项、Step 8 敏感规则、Step 9 生效矩阵和配置变更规范 |
| Step 10 状态 | `in_progress / pass_with_upstream_blockers`；开始定义权限、评审、审计、回滚和敏感变更边界 |

## 4.10 Step 10 完成记录与 Step 11 开工确认（2026-09-03）

| 项目 | 记录 |
|---|---|
| Step 10 状态 | `completed / pass_with_upstream_blockers` |
| Step 10 已收口 | 外部授权前提、low / medium / high / forbidden 分级、变更控制表、安全 audit 字段上限、startup / new-job-run / entry / test 回滚规则及敏感 ref 附加规则 |
| `03` 影响 | 当前 P0 无回写；future remote config、admin override、online LKG、hot reload、动态 adapter swap 或真实 provider rotation 必须先回写 `03` |
| 未闭合 blocker | `MSVC-UP-001~008`、配置 artifact / approval / provider / audit sink owner、具体产品与保留期继续 pending；不妨碍本地 fail-closed 规则定稿 |
| 正式 `04` | 仍未创建；只允许在 Step 15 装配 |
| Step 11 输入 | Step 5 来源策略、Step 7 配置项、Step 8 敏感边界、Step 9 activation、Step 10 change / rollback |
| Step 11 状态 | `in_progress / pass_with_upstream_blockers`；开始定义失效、降级、告警输入和测试切口 |

## 4.11 Step 11 完成记录与 Step 12 开工确认（2026-09-03）

| 项目 | 记录 |
|---|---|
| Step 11 状态 | `completed / pass_with_upstream_blockers` |
| Step 11 已收口 | startup/job/entry/test 的 fail-fast、security/isolated boundary 的 fail-closed、运行期 sibling/adapter 的 blocked/degraded/delayed/failed marker、drift/expiry/rollback target 规则、告警安全字段和测试切口 |
| P0 边界 | 不支持 config center、online LKG、hot reload 或 raw provider body；非法配置不降级成可用运行态 |
| `03` 影响 | 当前无回写；future provider health、remote source、online LKG、production alert contract 先回写 `03` |
| 正式 `04` | 仍未创建；只允许在 Step 15 装配 |
| Step 12 输入 | Step 6 profile、Step 7 item、Step 9 validation、Step 10 audit/rollback、Step 11 failure/test cuts |
| Step 12 状态 | `in_progress / pass_with_upstream_blockers`；开始定义 05/06/07/09 承接但不创建下游文档 |

## 4.12 Step 12 完成记录与 Step 13 开工确认（2026-09-03）

| 项目 | 记录 |
|---|---|
| Step 12 状态 | `completed / pass_with_upstream_blockers` |
| Step 12 已收口 | `05/06/07/09` 的配置测试、验收门禁、实施任务族、运维承接、evidence 类型和下游不得重定义契约的边界；未创建或修改下游文档 |
| evidence 边界 | 只定义未来证据语义；当前不存在测试结果、artifact、report、verdict、signoff 或 readiness |
| `03` 影响 | 当前无回写；下游若提出新 runtime / reload / provider contract 必须先回写 `03` |
| 正式 `04` | 仍未创建；只允许在 Step 15 装配 |
| Step 13 输入 | Step 7 配置项、Step 8 敏感规则、Step 9 activation、Step 10 rollback、Step 11 failure、Step 12 downstream handoff |
| Step 13 状态 | `in_progress / pass_with_upstream_blockers`；开始定义迁移、废弃、兼容窗口和 future evolution |

## 4.13 Step 13 完成记录与 Step 14 开工确认（2026-09-03）

| 项目 | 记录 |
|---|---|
| Step 13 状态 | `completed / pass_with_upstream_blockers` |
| Step 13 已收口 | 当前无已发布配置迁移项；active/introduced/deprecated/rejected/removed/design-change-required 生命周期、兼容窗口、迁移 evidence 和 P0 永久拒绝项已定义 |
| 历史材料处置 | 旧 README、旧 `05/06` 配置文字不构成迁移基线，仅用于污染审计 |
| `03` 影响 | 当前 P0 无回写；future config center、hot reload、provider health 或新 adapter contract 触发前必须回写 `03` |
| 正式 `04` | 仍未创建；只允许在 Step 15 装配 |
| Step 14 输入 | Step 1~13 风险、未闭合合同、详细设计影响判定和下游承接状态 |
| Step 14 状态 | `in_progress / pass_with_upstream_blockers`；开始汇总风险、待确认事项和回写门禁 |

## 4.14 Step 14 完成记录与 Step 15 开工确认（2026-09-03，历史开工快照）

| 项目 | 记录 |
|---|---|
| Step 14 状态 | `completed / pass_with_upstream_blockers` |
| Step 14 已收口 | 汇总 `MSVC-UP-001~008`、产品 / provider / config-center / hot-reload、下游重写、digest/retention 数值等风险；当前 P0 无待回写或阻塞待确认配置结论；future 项明确为触发器 |
| 历史污染 | 旧 README、旧 `05/06`、旧产品/数值不作为配置基线；正式 `04` 仍以 Step 1~14 结论装配 |
| 正式 `04` | 本记录后允许进入 Step 15 装配；装配前仍必须完成三层门禁与最终跨域审计 |
| Step 15 输入 | Step 1~14 中间产物、`04` flow、项目 ledger、配置设计书写规范、L1-governance 粒度参考 |
| Step 15 状态 | 历史状态：`in_progress / pass_with_upstream_blockers`；当时准备创建正式装配中间产物和正式 `04` |

## 4.15 Step 15 完成与正式 `04` 停审（2026-09-03）

| 项目 | 记录 |
|---|---|
| Step 15 状态 | `completed / pass_with_upstream_blockers` |
| 正式文档 | `projects/L2-member-service/04-配置设计.md` 已按 Step 1~14 章节映射装配；未新增未讨论配置契约 |
| 最终修正 | 已将 carrier availability marker 与 Member / Images / Runtime / Sandbox 的 ref-bearing lifecycle seam 分开；修正 Step 3 / §7 聚合伪 key；同步 Step 9~12 calibration 口径 |
| 终审结果 | 章节、配置项十列、严格 JSON / JSONC 边界、profile / fixture 隔离、敏感输出、source priority、activation、rollback、failure 和下游承接通过；`MSVC-UP-001~008` 仍为 pending / blocked |
| `03` 回写 | 当前 P0 无需回写；future provider、remote/admin、hot/reload、dynamic adapter 或新 public schema 仍是 design-change-required |
| 执行边界 | 未实现代码、未执行测试、未生成 artifact/report/evidence/verdict/signoff/readiness，未提交 commit；只修改本项目目录 |
| 停审 | `formal_04_stop_review = completed; waiting_for_user_review`；未经用户明确确认不得进入 `05-测试方案.md` |
