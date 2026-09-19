# L5-console 04 配置设计校准流程

> 对应 SOP：`standards/document/配置设计讨论流程_SOP.md`
> 中间产物规范：`standards/document/设计文档讨论中间产物规范.md`
> 书写规范：`standards/document/配置设计书写规范.md`
> 目标正式文档：`projects/L5-console/04-配置设计.md`
> 启动日期：2026-09-18
> 当前状态：Step 1～15 `done / pass / self_reviewed`；正式 04 `formal_stop_review`

## 1. 执行边界

- 用户已明确授权“完成全部 04”；本授权覆盖 Step 1～15 的串行推进，不授权进入 05。
- 本轮只修改 `projects/L5-console/` 下配置 calibration、正式 04 与项目台账；不修改其它项目正式文档，不实现代码，不执行项目测试，不提交 commit。
- 当前仓采用 `full-restart`：README、旧正式 `05/06` 只作 `historical_material` 与污染审计输入，不反向定义配置真相。
- `L1-governance` 只提供配置文档的粒度与框架参考；不得迁移 Governance 服务端、store、consumer、job、outbox 或 secret 语义。
- 04 只展开 `03-详细设计.md` 已存在的 `ConsoleClientBindingConfig`、`ConsoleRuntimeDependencies`、binding points 和 fail-closed 边界；不得静默新增 runtime config、Port、DTO、错误或函数流。
- 配置项、环境矩阵、示例和失效策略均是设计契约，不表示配置文件、实现仓、部署、测试、证据或 readiness 已存在。

## 2. 三层门禁与写入纪律

| 层级 | 当前状态 | 规则 |
|---|---|---|
| 项目级 | `formal_stop_review` | 04 已完成并停审；禁止自行进入 05、实现或提交 |
| 文档级 | `formal_stop_review` | 15 章正式文档已装配，跨域/污染/事实审计通过 |
| Step 级 | Step 1～15 `done / pass / self_reviewed` | Step 15 已完成最终审计与台账回写 |
| 正式正文 | `formal_04_write_allowed=false_formal_stop_review` | 正式 04 已冻结；未来变更须明确重开对应 Step |

## 3. 权威输入

| 输入 | 权威级别 | 本轮用途 |
|---|---|---|
| 正式 `00-需求文档.md` | 已停审上游 | 行为、安全、数据归属、降级、可访问性和验收红线 |
| 正式 `01-架构设计.md` | 已停审上游 | 浏览器客户端边界、SDK-only、owner truth、状态与诊断红线 |
| 正式 `02-概要设计.md` | 已停审上游 | 组成部分、对象、接口、flow、state 和配置影响轮廓 |
| 正式 `03-详细设计.md` | 直接输入 | `ConsoleClientBindingConfig`、runtime builder、Port、状态、错误、配置引用和测试切口 |
| `03_ddd_step_14_config_dependencies.md` | 字段级直接输入 | typed binding、依赖矩阵、装配顺序、禁止配置矩阵 |
| `03_ddd_step_17_implementation_handoff.md` / Step 18 | 风险与下游输入 | 实施暂停条件、开放 blocker、事实诚实边界 |
| 旧 `05-测试方案.md` / `06-验收标准.md` | historical material | 只做污染审计和下游方向检查，不作为配置合同 |
| `L1-governance` 04 与 calibration | 粒度参考 | 迁移 15-Step 结构、逐域停审和跨域审计方法，不迁移领域语义 |

## 4. Step 状态台账

| Step | 主题 | 中间产物 | 前置 | 状态 | 门禁摘要 |
|---|---|---|---|---|---|
| 1 | 配置输入边界 | `04_config_step_01_upstream_boundary.md` | 正式 00～03、03 handoff/risk | `done / pass / self_reviewed` | 输入、权威级别与问题边界闭口；无当前 03 回写 |
| 2 | 目标、范围和非范围 | `04_config_step_02_scope.md` | Step 1 | `done / pass / self_reviewed` | 四域 P0、P1/P2、非范围与无配置判定闭口 |
| 3 | 配置控制面 | `04_config_step_03_control_plane.md` | Step 2 | `done / pass / self_reviewed` | 单一装配链、四域停审与跨域审计通过 |
| 4 | 分类与禁止配置化边界 | `04_config_step_04_categories_boundaries.md` | Step 3 | `done / pass / self_reviewed` | startup-only 类别、域内禁止项与跨分类审计通过 |
| 5 | 来源、优先级与冲突 | `04_config_step_05_sources_priority_conflicts.md` | Step 4 | `done / pass / self_reviewed` | defaults + 单文档来源、冲突与跨来源审计通过 |
| 6 | 环境 / profile 矩阵 | `04_config_step_06_environment_profiles_matrix.md` | Step 5 | `done / pass / self_reviewed` | 环境到三profile映射、依赖与跨profile审计通过 |
| 7 | 配置项清单 | `04_config_step_07_config_items.md` | Step 6 | `done / pass / self_reviewed` | 四项 P0、模块严格 JSON demo、字段映射与跨项审计通过 |
| 8 | 敏感配置与密钥 | `04_config_step_08_sensitive_secrets.md` | Step 7 | `done / pass / self_reviewed` | P0 无 secret；raw secret/ref/credential 零进入与禁止输出审计通过 |
| 9 | 加载、校验与生效 | `04_config_step_09_loading_validation_activation.md` | Step 8 | `done / pass / self_reviewed` | strict parse、type/cross-field、装配与 startup-only 生效闭口 |
| 10 | 变更、审计与回滚 | `04_config_step_10_change_audit_rollback.md` | Step 9 | `done / pass / self_reviewed` | startup-only、外部审计语义与整文档回滚闭口 |
| 11 | 失效与降级 | `04_config_step_11_failure_degradation.md` | Step 10 | `done / pass / self_reviewed` | fail-fast/fail-closed/disabled矩阵、记录边界与测试切口闭口 |
| 12 | 下游承接 | `04_config_step_12_downstream_handoff.md` | Step 11 | `done / pass / self_reviewed` | 05/06/07/09输入、禁止重复定义和事实边界闭口 |
| 13 | 迁移、废弃与演进 | `04_config_step_13_migration_deprecation_evolution.md` | Step 12 | `done / pass / self_reviewed` | initial schema、历史污染拒绝和future演进触发闭口 |
| 14 | 风险与待确认 | `04_config_step_14_risks_open_questions.md` | Step 13 | `done / pass / self_reviewed` | 风险/待确认/03影响总审计通过；无当前待回写 |
| 15 | 正式文档装配 | `04_config_step_15_formal_document_assembly.md` + 正式 04 | Step 14 pass | `done / pass / self_reviewed / formal_stop_review` | 15 章、来源、跨域、污染、03 回写与事实审计通过；已停审 |

## 5. 配置域收敛结论

| 配置域 | 直接承接的 03 字段 / binding | 当前安全上限 |
|---|---|---|
| runtime | `ConsoleClientBindingConfig.profile` | 三个既有 profile；名称不等 readiness |
| bindings | `adapterBindings[]` | local correlation only；配置存在不等 `bound` |
| invalidation | `enableSdkInvalidation` | 默认且当前正式上限为 `false` |
| diagnostics | `enableDiagnostics` | 默认 `false`；仅受控 local fake 可正向启用 |

## 6. 持续 blocker / pending

- `CON-Q-034～047` 继续 `open/pending`；04 不用 endpoint、secret、flag 或示例值伪造 exact owner/SDK contract。
- framework/router/bundler/package manager、browser/a11y matrix、configured state medium/TTL/migration、production diagnostic sink/envelope 和量化阈值未闭口。
- 这些事项阻止 production positive binding、invalidation activation、configured durability、production diagnostics 和 release readiness；不阻止当前四域 fail-closed 配置合同的设计。

## 7. 当前恢复点

```text
current_document = 04-配置设计.md
current_step = 04_config_step_15_formal_document_assembly
current_module = formal-document-assembly
gate_status = formal_stop_review
next_allowed_action = wait_for_explicit_user_authorization_for_05
formal_04_write_allowed = false_formal_stop_review
formal_05_write_allowed = false
implementation_write_allowed = false
test_execution_allowed = false
commit_required = false
```

## 8. Step 15 正式装配与停审记录

| 项 | 结果 |
|---|---|
| 正式文档 | `projects/L5-console/04-配置设计.md` 已按书写规范重建为恰好 §1～§15。 |
| 来源追溯 | 15/15 章均有具体 calibration 来源与延伸阅读；正式结论只来自已完成 Step。 |
| 配置合同 | 四域四项与 03 `ConsoleClientBindingConfig` 1:1 映射；profile 必填无默认，optional defaults 为 `[]/false/false`。 |
| 控制面 | one external strict JSON document、whole-document validation、startup-only、外部 change/audit/whole rollback。 |
| 安全与失效 | P0 zero-secret；invalid document fail-fast、formal facet fail-closed、optional path disabled/failed、partial dependency restricted/minimal/partial。 |
| 03 回写 | 当前无 `待回写` 或 `阻塞待确认`；future endpoint/owner/state/hot/remote/new-profile 等触发器必须先重开 03。 |
| 历史污染 | Provider Contract、RBAC、workspace/panel/store、固定框架/数字/阈值只作为 rejected historical material，未成为 key 或合同。 |
| 事实诚实 | 未实现代码、未运行项目测试，未伪造 repo/baseline/commit/run_id/artifact/report/evidence/verdict/signoff/readiness。 |
| 静态审计 | 章节、来源、JSON key、profile/default、禁止材料和 `git diff --check` 审计通过。 |
| 门禁 | `done / pass / self_reviewed / formal_stop_review`；未经用户明确授权不得进入 05。 |
