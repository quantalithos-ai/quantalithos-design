# L4-archive 04 配置设计校准流程

> 对应规范：`standards/document/配置设计讨论流程_SOP.md`、`standards/document/配置设计书写规范.md`、`standards/document/设计文档讨论中间产物规范.md`。
> 模式：`full-restart / single-agent-serial`。
> 本轮授权：用户已明确连续完成正式 04 的 Step 1～15；完成正式 04 后立即停审，不进入 05。
> 目标正式文档：`projects/L4-archive/04-配置设计.md`。

## 1. 本轮目标与硬边界

本流程把已停审的 `00-需求文档.md`、`01-架构设计.md`、`02-概要设计.md`、`03-详细设计.md` 中已经存在的配置引用和外部绑定，收敛为可审查、可测试、可实施承接的配置控制面。配置设计只定义配置语义、来源、优先级、校验、生效、失效、变更和演进，不实现代码、不选择未闭合供应商、不创建真实密钥或部署文件。

本轮只修改 `projects/L4-archive/` 下的设计文档、校准材料和台账。旧 README、旧正式 05/06、`draft/` 和其他历史材料只作 `historical_material` / 污染审计输入。不得改写任何 owning project 的正式文档，不创建目标实现仓，不执行项目测试，不生成真实 bundle/digest/artifact/report/evidence/verdict/signoff/readiness，不提交 commit。

## 2. 权威输入与顺序

| 输入 | 权威级别 | 用途 |
|---|---|---|
| 本项目正式 00～03 | 直接正式基线 | 需求边界、架构依赖、概要组件和详细设计 binding/slot/flow/state/错误/测试切口 |
| `03_ddd_step_14_config_external_binding.md` | 详细设计配置基线 | raw reader、typed ref、11 类 `ArchiveAdapterSlot`、runtime builder 顺序和 fail-closed |
| `03_ddd_step_15_observability_audit.md` | 详细设计观测基线 | safe telemetry、redaction、native durable record 和 sink 边界 |
| L1 truth owner、`L1-workspace`、`L1-artifact`、`L4-observability` 正式文档 | 专项上游 | source-authority、projection、material/ref、审计材料和 receiver 边界 |
| `L0-core`、`L0-bus`、`L0-sdk` 正式文档与全局依赖规则 | 平台边界 | compile/runtime/event/ref/adapter/fake 分类与 SDK 方向 blocker |
| 旧 `05/06`、README、draft | historical_material | 仅污染审计和下游方向，不得反向定义配置 |

## 3. Step 计划与状态

| Step | 主题 | 中间产物 | 状态 | 正式回填 |
|---|---|---|---|---|
| 1 | 上游配置输入边界 | `04_config_step_01_upstream_boundary.md` | `completed / pass_with_upstream_blockers` | §1 |
| 2 | 目标、范围、非范围 | `04_config_step_02_scope.md` | `completed / pass_with_upstream_blockers` | §2 |
| 3 | 配置控制面总览 | `04_config_step_03_control_plane.md` | `completed / pass_with_upstream_blockers` | §3 |
| 4 | 配置分类与禁止配置化边界 | `04_config_step_04_categories_boundaries.md` | `completed / pass_with_upstream_blockers` | §4 |
| 5 | 配置来源、优先级与冲突处理 | `04_config_step_05_sources_priority_conflicts.md` | `completed / pass_with_upstream_blockers / stop_review` | §5 |
| 6 | 环境、部署 profile 与配置矩阵 | `04_config_step_06_environment_profiles_matrix.md` | `completed / pass_with_upstream_blockers / stop_review` | §6 |
| 7 | 配置项清单 | `04_config_step_07_config_items.md` | `completed / pass_with_upstream_blockers / stop_review` | §7 |
| 8 | 敏感配置与密钥管理 | `04_config_step_08_sensitive_secrets.md` | `completed / pass_with_upstream_blockers / stop_review` | §8 |
| 9 | 配置加载、校验与生效机制 | `04_config_step_09_loading_validation_activation.md` | `completed / pass_with_upstream_blockers / stop_review` | §9 |
| 10 | 配置变更、审计与回滚 | `04_config_step_10_change_audit_rollback.md` | `completed / pass_with_upstream_blockers / stop_review` | §10 |
| 11 | 失效模式与降级/fail-fast | `04_config_step_11_failure_degradation.md` | `completed / pass_with_upstream_blockers / stop_review` | §11 |
| 12 | 测试、验收、实施与运维承接 | `04_config_step_12_downstream_handoff.md` | `completed / pass_with_upstream_blockers / stop_review` | §12 |
| 13 | 配置迁移、废弃与演进 | `04_config_step_13_migration_deprecation_evolution.md` | `completed / pass_with_upstream_blockers / stop_review` | §13 |
| 14 | 风险与待确认事项 | `04_config_step_14_risks_open_questions.md` | `completed / pass_with_upstream_blockers` | §14 |
| 15 | 正式文档装配 | `04_config_step_15_formal_document_assembly.md` | `completed / formal_stop_review` | 正式 04 全文 |

后续 Step 文件只在进入对应 Step 时创建；每个 Step 独立记录问题回答、诊断、取舍、结构化产物、回填草稿、详细设计影响和进入下一步门禁。即使连续授权也不得把多个 Step 合并成一个文件。

## 4. 三层门禁

| 层级 | 文件 | 本轮要求 |
|---|---|---|
| 项目级 | `project_execution_ledger.md` | 记录当前文档/Step、全局 blocker、是否允许装配和下一动作 |
| 文档级 | 本文件 | 记录 Step 状态、Step 切换门禁和正式回填门禁 |
| Step 级 | 各 Step 文件 | 记录模块停审、影响判定、回填状态和自检结果 |

进入 Step 15 的硬条件是：Step 1～14 均已完成；Step 3～11 的配置域/配置项均停审；跨域审计无 unresolved 冲突；不存在 `待回写` 或 `阻塞待确认` 的 03 代码契约影响。若发现会改变 `CoreRuntimeConfig`、runtime builder、adapter constructor、trait/port、error、DTO 或 flow 的结论，必须先回写 03 或停止装配。

## 5. 持续 blocker 与本地 pending

| ID | 范围 | 本轮处置 |
|---|---|---|
| `AR-UP-001~009` | source/export、lifecycle、governance、integrity、storage、artifact、observability、workspace、receiver | 逐 slot / owner 保持 `Blocked`、`Partial`、`Unknown` 或 `Unsupported`；不以配置补齐事实 |
| `AR-ARCH-001` | SDK 依赖方向 | Archive 服务端不引入 SDK compile dependency |
| `AR-HLD-Q-001` | outbound event/outbox/publisher | 不创建 outbound 配置、topic、publisher 或 delivery truth |
| `AR-HLD-Q-002` | workload 与预算数值 | 配置项可定义类型/必填/失败策略，但不填写未经 authority 的数值 |
| `AR-03-LOCAL-001` | operation key/digest codec | 只保存 binding ref；未闭合时 mutation reserve blocked |
| `AR-03-LOCAL-002` | public/repository cursor mapping | continuation blocked；不回传 private cursor |
| `AR-03-LOCAL-003` | durable store/UoW driver | production store binding blocked；fake 仅测试 |
| `AR-03-LOCAL-004` | complete schema/provider refs/numbers | 无隐式默认；缺失即 fail-fast/blocked |
| `AR-03-LOCAL-005` | telemetry runtime binding | safe signal 可保留；sink failure 不改变业务结果 |
| `AR-03-LOCAL-006` | 正式 04～07 与 implementation start | 正式 04 已完成并停审；05～07、planned ledger/skeleton、目标仓事实核验和实施授权继续 pending |

以上事项是当前设计上限，不是已关闭的集成、测试或 readiness 证明。任何配置文档中的 `Ready` 只指本地 validated assembly 语义，不指产品或外部能力成功。

## 6. 恢复与结束状态

继续本流程时必须先读取 `project_execution_ledger.md` 和本文件，再读取 `04_config_step_15_formal_document_assembly.md`、Step 1～14 及正式 00～03。Step 15 已完成正式 04 的装配、静态审计并停审；除 04 审查修订外，当前不再允许写入正式 04。下一步只能在用户明确授权后读取 05 的 SOP/书写规范并创建 05 校准流，不能自动进入 05。

## 7. Step 15 完成后的文档门禁

```text
formal_04_status = formal / stop_review
config_current_step = 15_completed_formal_stop_review
config_next_allowed_action = wait_for_user_review_and_explicit_05_authorization
formal_04_write_allowed = false_except_review_fixes
implementation_write_allowed = false
test_execution_allowed = false
commit_required = false
```

本次静态审计分母为：15 个正式主章、15 个 Step 来源、12 个配置域、55 个 P0 配置项、12 个严格 JSON demo、1 个 JSONC demo、12 个上游 blocker 和 6 个本地 pending。审计不构成实现、测试、外部集成、验收或 readiness 证明。
