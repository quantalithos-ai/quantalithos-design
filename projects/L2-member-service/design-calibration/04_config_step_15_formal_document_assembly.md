# Step 15：整理正式配置设计文档

> 对应 SOP：`standards/document/配置设计讨论流程_SOP.md` Step 15
> 输出正式文档：`projects/L2-member-service/04-配置设计.md`
> 参考粒度：`projects/L1-governance/design-calibration/04_config_step_15_formal_document_assembly.md`
> 执行模式：full-restart；只装配已完成 Step 1~14 的收口结论，不新增配置契约

## 1. Step 状态与装配门禁

| 项目 | 记录 |
|---|---|
| 当前文档 | `04-配置设计.md` |
| 当前 Step | Step 15 正式配置设计文档装配 |
| 当前模块 | `formal_document_assembly` |
| Step 状态 | `completed / pass_with_upstream_blockers` |
| 项目级门禁 | `project_execution_ledger.md` 已记录 Step 1~14 完成，允许本 Step 装配 |
| 文档级门禁 | `04_config_calibration_flow.md` Step 1~14 为 completed / pass_with_upstream_blockers |
| Step / 模块级门禁 | Step 1~14 均有回填草稿、自检和停审记录；本 Step 先写装配记录，再写正式正文 |
| 正式文件 | `projects/L2-member-service/04-配置设计.md`（本 Step 创建） |
| 实现 / 测试 / 证据 | `false`；正式文档不声称实现、测试、artifact、report、verdict、signoff 或 readiness 已存在 |
| commit | `false` |

### 1.1 Step 内计划

- [x] 回读项目台账、04 flow、Step 1~14 和配置设计书写规范。
- [x] 建立正式章节与校准来源的一一映射。
- [x] 只装配已确认的 P0 配置结论，明确 future / pending / blocked 边界。
- [x] 完成来源、优先级、profile、配置项、敏感、加载、变更、失效、下游和迁移的跨域审计。
- [x] 创建正式 `04-配置设计.md` 并执行污染、敏感输出、重复项和 `03` 回写审计。
- [x] 更新 flow 与项目 ledger，停在正式 `04` 审查点。

## 2. 本步目标与边界

本 Step 把 Step 1~14 的收口材料装配为可供后续 `05/06/07/09` 承接的正式配置设计。正式正文只承载：配置控制面、允许/禁止边界、来源优先级、P0 profile、配置项、敏感 ref、加载校验、生效、变更审计回滚、失效降级、下游承接、迁移演进、风险和参考。

本 Step 不：

- 新增未在 Step 1~14 出现的 key、默认值、enum、Port、builder 字段、DTO、error 或流程；
- 修改 `00/01/02/03` 或任何兄弟项目；
- 创建/修改 `05/06/07/09`；
- 选择数据库、Bus、容器、secret provider、observability、DLQ、scheduler 或审批产品；
- 生成实现仓、测试结果、artifact、report、evidence、verdict、signoff、readiness 或 commit。

## 3. 输入与章节映射

| 正式章节 | 校准来源 | 装配结论 |
|---|---|---|
| §1 与上游文档的关系声明 | `04_config_step_01_upstream_boundary.md` | 直接承接 `00/01/02/03`、专项上游、历史材料和 blocker 口径 |
| §2 本次配置设计目标与范围 | `04_config_step_02_scope.md` | P0 配置控制面、P1/P2 future、非范围和下游边界 |
| §3 配置控制面总览 | `04_config_step_03_control_plane.md` | `infra/config.rs -> runtime_builder -> typed ports/entries` 与配置域总表 |
| §4 配置分类与边界 | `04_config_step_04_categories_boundaries.md` | static/startup/job/entry/sensitive/diagnostic/test/peripheral 分类及禁止项 |
| §5 配置来源、优先级与冲突处理 | `04_config_step_05_sources_priority_conflicts.md` | `defaults < strict JSON file < env`，局部来源隔离和冲突策略 |
| §6 环境、部署 profile 与配置矩阵 | `04_config_step_06_environment_profiles_matrix.md` | 四个 P0 profile、两个 future profile 和三类矩阵 |
| §7 配置项清单 | `04_config_step_07_config_items.md` | 十列配置项清单、模块 JSON demo、完整 JSONC 文档示例 |
| §8 敏感配置与密钥管理 | `04_config_step_08_sensitive_secrets.md` | opaque ref、敏感级别、读取/轮换/禁止输出 |
| §9 配置加载、校验与生效机制 | `04_config_step_09_loading_validation_activation.md` | strict JSON、type/cross-field、builder、activation matrix |
| §10 配置变更、审计与回滚 | `04_config_step_10_change_audit_rollback.md` | 变更风险分级、安全字段和 restart/new-run/rerun rollback |
| §11 失效模式与降级 / fail-fast | `04_config_step_11_failure_degradation.md` | 配置错误与运行期依赖失败分层 |
| §12 测试、验收、实施与运维承接 | `04_config_step_12_downstream_handoff.md` | `05/06/07/09` 输入和 evidence 语义 |
| §13 配置迁移、废弃与演进 | `04_config_step_13_migration_deprecation_evolution.md` | 当前无迁移、生命周期规则和 future queue |
| §14 风险与待确认事项 | `04_config_step_14_risks_open_questions.md` | blocker、future trigger、03 回写门禁 |
| §15 参考 | Step 1~14 / flow / upstream | 只列可追溯材料，不新增结论 |

## 4. SOP 问题回答

| 问题 | 装配回答 |
|---|---|
| 正式文档是否按规范主链组织？ | 是，使用 15 个固定章节，不改变章节名称。 |
| 每章是否保留校准来源？ | 是，每章正文开始前列出具体 `design-calibration/04_config_step_*.md`。 |
| 各 Step 结论是否一致？ | 通过最终交叉审计：来源顺序、profile、配置项、敏感级别、activation、failure、rollback 和下游承接相互一致。 |
| 当前 P0 是否存在需回写 `03` 的结论？ | 否。future provider/config center/hot reload/dynamic adapter/new public schema 仅作为 design-change-required 触发器。 |
| 未闭合 sibling 合同如何呈现？ | 保留 `MSVC-UP-001~008`，使用 pending / blocked / placeholder / unknown / fail-closed，绝不写 ready。 |
| 正式文档是否等于下游完成？ | 不等于。正文只提供输入；`05/06/07/09` 仍需各自 SOP 重写，当前无执行 evidence。 |
| 是否可以在装配时补充新配置？ | 不可以。发现缺口必须回到对应 Step；若影响代码契约先回写 `03`。 |

## 5. 装配前诊断与处理

| 审计项 | 发现 | 处理 |
|---|---|---|
| 旧正式 `04` | 不存在 | 按 full-restart 新建，不继承旧结构 |
| 旧 README / `05/06` | 含历史环境、产品或数值风险 | 仅在 §1/§14 作为 historical_material，不升格为配置真相 |
| Step 7 大清单 | 需防止正式正文漏掉模块 demo 和敏感级别 | §7 保留十列清单、模块 demo 和完整 JSONC 示例 |
| Step 9~11 | 需防止错误、变更和运行期不可用混写 | §9/§10/§11 分章保留 activation、rollback、failure 语义 |
| Step 12 | 下游文档尚未重写 | §12 只写承接输入与边界，不伪造下游结果 |
| Step 13/14 | future 与当前 P0 可能混淆 | §13/§14 显式标记 future、pending、design-change-required |
| 台账历史段落 | 早期记录与当前 Step 状态存在滞后 | 装配后更新顶部当前恢复点，并保留历史段落为历史记录 |

## 6. 设计取舍

| 议题 | 采用结论 |
|---|---|
| 正式正文与中间产物的比例 | 正式正文写收口规则、表格和示例；过程诊断、方案比较和逐 Step 审计留在中间产物 |
| P0 与 future | P0 支持 `local-dev`、`ci-test`、`integration-like`、`operations-replay` 的 product-neutral/fake/blocked 语义；其中 `deterministic_fixture.*` 仅属于 `ci-test` / `operations-replay`，`local-dev` 只用普通 fake / placeholder，`integration-like` 只用 controlled seam；staging/production-like 仅 future |
| unresolved sibling | 使用 typed opaque ref、availability marker、blocked/unknown，不补 exact schema |
| 生效和回滚 | startup 通过 cold restart，job 通过 new run，entry/test 通过 rerun；P0 无 hot/reload/LKG |
| 安全 | raw secret/body、full sensitive ref、external body、manifest、endpoint secret 永不进入配置输出、日志、错误、审计、trace、report 或 artifact |
| 下游权责 | `04` 是配置真相源；`05/06/07/09` 只承接，不重定义 |

## 7. 正式正文写入前检查

| 门禁 | 结果 | 依据 |
|---|---|---|
| 项目级允许装配 | pass | `project_execution_ledger.md` Step 14 完成、Step 15 开工 |
| 文档级 Step 1~14 完成 | pass_with_upstream_blockers | `04_config_calibration_flow.md` |
| Step 1~14 回填草稿齐全 | pass | 各 Step 文件均有回填草稿和自检 |
| 当前 P0 `03` 回写项 | none | Step 14 §8.3~§8.4 |
| 正式正文是否新增未讨论结论 | no | 仅按章节映射装配 |
| 敏感正文检查 | pass | 仅 opaque ref、类别、digest 语义；不写 raw material |
| sibling ready 误写检查 | pass | `MSVC-UP-001~008` 保持 pending/blocked/placeholder |
| 下游文件范围检查 | pass | 不修改 `05/06/07/09` |

## 8. 结构化最终审计

### 8.1 跨配置域总审计表

| 审计项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 章节主链完整 | pass | §1~§15 全部存在 |
| 每章有具体校准来源 | pass | 章节开头逐项列出 |
| source priority 唯一 | pass | `code defaults < strict JSON file < environment variables`；局部来源不参与全局覆盖 |
| profile 与配置项一致 | pass_with_correction | 四个 P0 profile；`deterministic_fixture.*` 仅 ci-test / operations-replay，future profile 不进入 P0 必过 |
| 配置项按功能模块拆分 | pass | profile、identity、stores、resolvers、bindings、session、health、publication、handoff、jobs、read/security、clock、deterministic_fixture |
| 十列最小字段齐全 | pass | key/type/default/required/source/scope/activation/sensitivity/failure/module |
| sensitive/secret 分离 | pass | opaque ref 为 sensitive；真实秘密为 secret 且禁止进入普通配置 |
| loader 覆盖 parse/type/cross-field | pass | §9 与 Step 9 一致 |
| 变更有 audit/rollback | pass | §10 只定义安全元数据和 validated rollback |
| 失效策略无 silent fallback | pass | §11 明确 fail-fast/fail-closed/degraded/delayed/failed marker |
| 下游承接不越界 | pass | §12 明确输入、evidence 和禁止重定义 |
| 当前无迁移项已声明 | pass | §13 明确首版无正式旧 schema |
| 当前 P0 无 `03` 待回写 | pass | future trigger 单独列出 |
| cross-project blocker 未伪造 ready | pass_with_upstream_blockers | `MSVC-UP-001~008` 保持开放 |
| 正式正文无实现/测试/evidence 谎称 | pass | 所有执行状态留在未来下游 |

### 8.2 配置项 / 示例 / 敏感项一致性检查

| 检查项 | 结论 |
|---|---|
| 模块 demo 与清单 key 一致 | pass |
| 完整 JSONC 示例只作为文档注释示例 | pass |
| 运行时严格 JSON 与 JSONC 区分 | pass |
| 示例中的 ref 不含 endpoint、credential、manifest 或 body | pass |
| `public/internal/sensitive/secret` 使用统一 | pass |
| 默认值没有关闭安全边界 | pass |
| `body-free`、`queryWriteRepair=false`、deny list 不能被覆盖 | pass |
| enabled target/topic 的条件校验已在 §9 重申 | pass |
| profile fixture/fake 隔离已在 §6、§9、§11 重申 | pass_with_correction | `deterministic_fixture.*` 仅 `ci-test` / `operations-replay`；`local-dev` 仅普通 fake / placeholder；`integration-like` 仅 controlled seam |

### 8.3 本轮最终修正记录

| 问题 | 修正 | 影响范围 |
|---|---|---|
| `carrier_binding.binding_ref` 未在 Step 7 权威清单中闭合 | 从正式配置项、示例、敏感表和说明中撤回；保留 `carrier_binding.availability`，carrier ref / release 合同继续由上游 owner 闭合 | §7、§8、§9 与对应 calibration |
| deterministic fixture profile 口径冲突 | 统一为仅 `ci-test` / `operations-replay`；`local-dev` 使用普通 fake / placeholder，`integration-like` 使用 controlled adapter seam 场景选择 / 故障注入 | §5、§6、§7、§8、§9、§10、§11 与对应 calibration |
| carrier marker 与 ref-bearing lifecycle seam 表述过度合并 | 将 Sandbox 与 carrier availability marker 拆为独立配置组、校验、变更、失败和下游测试语义；carrier 不适用 binding ref / release schema 条件 | §7.6、§9、§10.1、§11、§12 与 Step 3/9~12 calibration |
| §7 模块 demo 使用聚合伪 key | 改为明确列出四个 ref-bearing binding 的 availability / ref 集合；不引入新的运行时 key | §7.7 与 Step 3/7/9 calibration |
| 台账当前恢复点滞后 | 刷新三层台账为 Step 15 完成、正式 04 已装配并停审等待用户复核 | flow、Step 15、project ledger |

### 8.4 blocker 与历史污染审计

| 审计项 | 结论 |
|---|---|
| 旧 README/旧 `05/06` 是否覆盖新版配置结论 | 否，仅 historical_material |
| 并行兄弟未停审内容是否写成正式 truth | 否，仅消费需求级方向并保留 exact contract pending |
| `L1-governance` 是否被当成本仓 truth | 否，仅作粒度 / 格式参考 |
| 是否把容器、RPC、事件、SDK、数据库运行期协作写成源码依赖 | 否，均按 compile/runtime/event/ref/adapter/fake 分类 |
| 是否把 Runtime/Member/Images/Sandbox/Policy/GRC/Observability truth 合入本仓 | 否，均有 owner 和禁止项 |
| 是否伪造 run_id、artifact、report、verdict、signoff、readiness | 否 |

## 9. 对 `03-详细设计.md` 的最终影响判定

| 配置结论 | 是否影响 03 | 处理状态 |
|---|---|---|
| P0 strict JSON、source priority、profile、opaque ref、startup/job/entry/test activation | 否 | 无回写 |
| P0 fail-fast/fail-closed、blocked/degraded/delayed/failed marker | 否 | 无回写 |
| P0 change audit / restart rollback / new-run rerun | 否 | 无回写 |
| P0 下游承接和 migration governance | 否 | 无回写 |
| Future config center/admin override/hot reload/online LKG/provider health/dynamic adapter/new public schema | 是 | 当前不进入 P0；未来先回写 `03` 并重开受影响 Step |

当前不存在 `待回写` 或 `阻塞待确认` 的 P0 配置结论。`MSVC-UP-001~008` 仍是跨项目 blocker，影响真实正向集成，不改变本版配置设计的 fail-closed 表达。

## 10. 正式装配记录

正式 `04-配置设计.md` 已按 §3 映射创建。正文不包含本文件的 SOP 问题原文、过程诊断、取舍、内部推理、历史聊天、实际测试结果或 readiness 判断。

## 11. 待确认事项

| 事项 | 影响 | 当前处理 |
|---|---|---|
| 用户审查正式 `04` | 决定是否允许进入后续 `05` | 当前停在正式 `04` 审查点 |
| `MSVC-UP-001~008` exact contract | 影响后续真实 adapter / integration | 保持 pending / blocked / placeholder |
| future product/provider/config center/hot reload | 影响未来 `03/04/07/09` | 先走设计变更，不进入 P0 |
| `05/06/07/09` 新版文档 | 影响后续测试、验收、实施、运维 | 尚未创建或重写，不伪造完成 |

## 12. 自检与停审结论

| 检查项 | 结果 | 说明 |
|---|---|---|
| 正式文档使用 15 章主链 | pass | §1~§15 |
| 每章保留校准来源 | pass | 具体 Step 文件已列 |
| 配置项、profile、来源、敏感、加载、变更、失效互相一致 | pass | 跨域审计通过 |
| 下游承接明确且不越界 | pass | §12 |
| 当前 P0 无需回写 `03` | pass | future trigger 已隔离 |
| 上游 blocker 未伪造 ready | pass_with_upstream_blockers | `MSVC-UP-001~008` |
| 正式正文无 raw secret/body 或实际 evidence | pass | 安全和执行边界通过 |
| 只修改本项目目录 | pass | 无兄弟项目写入 |
| commit / implementation | prohibited | 未执行 |

```text
step_15_status = completed / pass_with_upstream_blockers
step_15_gate = pass_with_upstream_blockers
formal_04_write_allowed = completed
formal_04_stop_review = completed; waiting_for_user_review
implementation_allowed = false
test_execution_allowed = false
commit_allowed = false
next_allowed_action = wait_for_user_review_before_entering_05
```
