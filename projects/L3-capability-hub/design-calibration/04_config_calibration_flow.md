# L3-capability-hub 04 配置设计校准工作台

> 对应 SOP: `standards/document/配置设计讨论流程_SOP.md`
> 书写规范: `standards/document/配置设计书写规范.md`
> 中间产物规范: `standards/document/设计文档讨论中间产物规范.md`
> 可落码性标准: `standards/document/设计真相源闭环与可落码性标准.md`
> 目标正式文档: `projects/L3-capability-hub/04-配置设计.md`
> 创建日期: 2026-07-25
> 当前模式: full-restart / continuous execution
> 当前状态: `04_completed_design_task_wait_implementation_handoff`

---

## 1. 本轮目标

按配置设计 SOP 把已完成 full-restart 的正式 `00/01/02/03` 中的配置引用、runtime assembly、adapter binding、external dependency、profile、failure 与 observability 边界，转译为可填写、可校验、可测试、可验收、可实施承接的正式 `04-配置设计.md`。

本轮必须闭合：

- Step 14 §145.1 的 27 行 typed configuration surface；
- 27 local/base Ports、9 external Ports / 14 callables、6 Inbound sources、10 Outbound routes 与 8 Jobs dispatches 的 operator-facing binding；
- JSON root、raw key、file/env/CLI source、优先级、冲突、单位、上下限、显式默认和 profile matrix；
- endpoint / credential ref / TLS / transport / secret injection 的安全边界；
- startup-only loading、validation、activation、change、audit、rollback、failure 与 evolution contract；
- 对 `05/06/07/09` 的结构化交接，不提前伪造测试、验收、实施或运维事实。

## 2. 权威输入

| 输入 | 权威级别 | 用途 | 使用边界 |
|---|---|---|---|
| `projects/L3-capability-hub/00-需求文档.md` | active formal upstream | 仓定位、范围、NFR、安全、数据、接口和验收意图 | 不重新定义需求或验收结论 |
| `projects/L3-capability-hub/01-架构设计.md` | active formal upstream | bounded ownership、依赖裁剪、一致性、运行和安全边界 | 不通过配置改变架构方案 |
| `projects/L3-capability-hub/02-概要设计.md` | active formal upstream | 组件、对象、协议、流程、状态与配置影响轮廓 | 不在 04 中新增对象或流程 |
| `projects/L3-capability-hub/03-详细设计.md` | direct active input | §13 typed config/binding、§10~12 failure/consistency、§14 observation、§15 cuts、§16~17 handoff/risk | 不重新定义 struct / enum / trait / Port / DTO / flow / state / error |
| `design-calibration/03_ddd_step_14_config_external_binding.md` | normative exact source where formal 03 points | 27-row catalog source、binding/Cargo matrix、formal 04 Step 1~15 handoff | 过程状态不是配置 schema；只使用 canonical sections |
| `design-calibration/03_ddd_step_15_observability_audit.md` | normative exact source where formal 03 points | Off/Redacted、field allowlist、observer failure 与 backend reopen | 不提前选 backend 或伪造 evidence |
| `projects/L3-capability-hub/05-测试方案.md` | historical material | 只用于识别旧环境/配置说法和污染 | 不反向定义配置项或测试证据 |
| `projects/L3-capability-hub/06-验收标准.md` | historical material | 只用于识别旧验收门禁方向和污染 | 不反向定义默认、profile 或 signoff |
| `projects/L1-governance/design-calibration/04_config_*` | granularity reference | 参考 Step 结构、表格和影响判定粒度 | 不复制 governance 领域配置 |
| `projects/L3-method-library/design-calibration/04_config_*` | granularity/recovery reference | 参考长 Step 分批、回复点和正式装配门禁 | 不复制 method-library 的 key、TTL、lease 或 product |

## 3. Formal 04 disposition

| Material | Current fact | Disposition |
|---|---|---|
| `projects/L3-capability-hub/04-配置设计.md` | absent at flow initialization; created by completed Step 15 on 2026-07-25 | active formal 04 design baseline assembled only from Steps 1~14; no implementation/test/deployment fact implied |
| old formal 04 content | none found | no historical text can be inherited or patched |
| README configuration shorthand | not yet authoritative | diagnostic input only; final disposition is T070 |
| old formal 05/06 configuration claims | conflict-prone historical material | may identify questions only; cannot set key/default/profile/product |
| implementation repository/config files | target repository absent | not an input fact; no key, parser, product or readiness may be inferred |

The missing formal 04 is a pending deliverable, not an upstream blocker. The current typed surface is sufficiently closed by formal 03 to start Step 1. Concrete product selection may become a scoped controlled reopen or implementation prerequisite, but cannot be presented as already deployed.

## 4. Step 状态表

| Step | 主题 | 中间产物 | 状态 |
|---|---|---|---|
| Step 1 | 确认配置输入边界 | `04_config_step_01_upstream_boundary.md` | [x] completed; active 00~03、27-row/binding input、historical 05/06、SOP five questions and no-writeback gate closed |
| Step 2 | 明确配置设计目标、范围和非范围 | `04_config_step_02_scope.md` | [x] completed; 8 goals, P0/P1/P2 semantics, scope/non-scope ownership and 7 residual risks closed |
| Step 3 | 建立配置控制面总览 | `04_config_step_03_control_plane.md` | [x] completed; source chain, raw-reader/builder ownership, 10 control planes, domain boundaries and overlap audit closed |
| Step 4 | 定义配置分类与禁止配置化边界 | `04_config_step_04_categories_boundaries.md` | [x] completed; 9 categories, startup-only source/frozen-view distinction, 22 prohibited surfaces, CP-01~CP-10 review and no-writeback gate closed |
| Step 5 | 定义配置来源、优先级与冲突处理 | `04_config_step_05_sources_priority_conflicts.md` | [x] completed; 7 source lanes, constants < JSON < bounded env precedence, conflict/unavailable gates, ref-only sensitive boundary and 10/10 source ownership closed |
| Step 6 | 定义环境、部署 profile 与配置矩阵 | `04_config_step_06_environment_profiles_matrix.md` | [x] completed; 3 canonical profiles, 6 environment-purpose mappings, 10 binding surfaces, four-state/activation matrix and historical shorthand disposition closed |
| Step 7 | 定义完整配置项清单 | `04_config_step_07_config_items.md` | [x] completed; 18 modules, strict parser bounds, 27/27 raw-to-typed traceability, 21 bounded env leaves, 9/6/10 binding inventories, module demos, complete JSONC and cross-item audit closed |
| Step 8 | 定义敏感配置与密钥管理 | `04_config_step_08_sensitive_secrets.md` | [x] completed; four-level sensitivity, provider-to-constructor injection, restart rotation, audit ownership, output suppression and leakage audit closed |
| Step 9 | 定义配置加载、校验与生效机制 | `04_config_step_09_loading_validation_activation.md` | [x] completed; single strict source chain, V0~V8 validation, 18/18 modules, 27/27 canonical rows, provider-to-constructor resolution, Stage 0~7 and three activation barriers closed |
| Step 10 | 定义配置变更、审计与回滚 | `04_config_step_10_change_audit_rollback.md` | [x] completed; 18/18 module and 27/27 row change classes, actor/review, safe audit, sensitive rotation, restart cutover, rollback eligibility and no-business-rewrite closed |
| Step 11 | 定义失效模式与降级 / fail-fast 策略 | `04_config_step_11_failure_degradation.md` | [x] completed; 6 strategy terms, 24 global modes, 18/18 modules, 27/27 rows, 7/7 runtime layers, safe observation intents and 18 future test cuts closed |
| Step 12 | 定义测试、验收、实施与运维承接 | `04_config_step_12_downstream_handoff.md` | [x] completed; four-owner handoff, 11 test groups, 11 acceptance gates, 10 implementation families, 11 operations topics and future-evidence truthfulness closed |
| Step 13 | 定义配置迁移、废弃与演进 | `04_config_step_13_migration_deprecation_evolution.md` | [x] completed; zero released legacy items, value/schema/typed change classes, future version/deprecation/removal gates and historical isolation closed |
| Step 14 | 定义风险与待确认事项 | `04_config_step_14_risks_open_questions.md` | [x] completed; 17 active risks, 13/13 current 03 impact ledger, future trigger register and zero pending-writeback/blocking-confirmation entry gate closed |
| Step 15 | 整理正式配置设计文档 | `04_config_step_15_formal_document_assembly.md` | [x] completed; formal 15/15 chapters, 18/27/21 inventory, 9/6/10 cardinality, 24 failure modes, 17 risks, JSONC parse and seven audits closed |

## 5. 当前恢复点

| 当前 Step | 当前模块 | gate_status | gate_reason | next_allowed_action | 细节入口 |
|---|---|---|---|---|---|
| Step 15 `整理正式配置设计文档` | formal assembly completed | `design_task_completed` | Formal 04 has 15/15 sourced chapters; static audits closed 18/27/21 inventory, 9/6/10 cardinality, 3 profiles, 24 failure modes, Rustdoc and truthfulness. Subsequent `05~07` and T070/T071/T072 are complete. | `wait_for_authorized_implementation_handoff` | `project_execution_ledger.md`;正式 `04~07`;`T071_full_restart_final_audit.md` |

## 6. 执行纪律

- 每个 Step 独立生成中间产物，不合并 Step；用户已授权按 `/tmp/L3-capability-hub_full_restart_remaining_tasks.md` 连续执行。
- 每个 Step 必须包含本步目标、输入、SOP 问题回答、问题诊断、取舍、结构化产物、对 03 影响判定、回填草稿、待确认事项和下一步门禁。
- 正式 `04-配置设计.md` 只能由 Step 15 从完成的 Step 1~14 装配，每章标明 exact calibration source。
- 配置只能定义 source、precedence、default、profile、sensitivity、validation、activation 和 failure；不得静默新增/modify Rust type、field、variant、trait、Port、method、DTO、flow、state、error 或 phase。
- 所有可能影响实现 Rust 结构的结论都必须按“结构体及字段、enum variant/payload、trait/method/callable 逐项英文 `///`”门禁反查；04 不得用 raw map 绕过注释和 typed schema。
- 任何改变 `CapabilityRuntimeConfig`、builder、adapter constructor、Port、error、DTO 或 function flow 的配置结论记为 `待回写` 或 `阻塞待确认`，正式 04 定稿前必须受控回开 03。
- runtime/tools execution、marketplace listing、governance approval、method body、provider routing/cost、secret value、raw audit/evidence body 与 local delivery lifecycle 禁止配置化。
- 不创建实现仓代码、implementation ledger 或 boundary skeleton；后两者只在正式 07 完成后同步创建。
- 不声称配置已部署、adapter 已连通、测试已运行、验收已签署、evidence/run/commit 已存在。

## 7. 初始库存与回写门禁

| Inventory | Active baseline | 04 obligation | Reopen trigger |
|---|---:|---|---|
| canonical typed configuration rows | 27 | preserve shape/owner/presence/failure and assign raw catalog entries | new/removed/merged typed field |
| local/base Port binding | 27 | one authority and complete constructor inputs | second authority/optional local Port |
| external Port/callable | 9/14 | named four-state slot and product-neutral material | new Port/callable/binding kind |
| Worker source | 6 | exact named source, feed ref and trusted actor ref | source identity/schema/actor gate change |
| Outbound route | 10 | exact named destination ref under configured collaboration | route alters event/digest/state/intent |
| Jobs dispatch | 8 | one selected entry and typed technical parameters | alias/scheduler business identity/entry retry |
| runtime profile | Local/Integration/Deployment | exact allowed binding matrix | Deployment fake or Missing fallback |
| diagnostics | Off/Redacted | no raw/full/verbose, exact allowlist | observer changes business result/surface |

Every Step uses this fixed impact table:

| 配置结论 | 是否影响 03 | 影响类型 | 03 回写位置 | 处理状态 |
|---|---|---|---|---|
| per-Step conclusion | yes/no | config-only or code-contract | exact formal chapter / DDD Step | `无回写` / `待回写` / `已回写` / `阻塞待确认` |

## 8. 当前 next_allowed_action

```text
document = 04-配置设计.md
flow = completed
current_step = 15_completed
next_allowed_action = initialize_05_test_plan_full_restart
formal_04_exists = true
unresolved_upstream_blocker = none
commit_required = no
```
## Final closure overlay

T072 已关闭本轮设计任务。本文前部的 Step 状态、历史恢复点和文档切换记录保留原始讨论轨迹；当前项目级恢复入口以 `project_execution_ledger.md` 和 `T071_full_restart_final_audit.md` 为准。

| field | value |
|---|---|
| formal_document | `04-配置设计.md` |
| document_status | `configuration design completed` |
| current_step | `Step 15 completed` |
| final_audit | `design-calibration/T071_full_restart_final_audit.md` |
| unresolved_upstream_design_blocker | `0` |
| implementation_status | `pre_implementation_blocked` |
| implementation_current_boundary | `commit-01-a` |
| implementation_next_allowed_action | `wait_design` |
| commit_required | `no` |

不得依据本文历史段落中的旧 `next_allowed_action` 重新进入已完成 Step。有效的下一动作是 `wait_for_authorized_implementation_handoff`；目标实现仓、immutable baseline、实现代码、测试 run、evidence instance、verdict、signoff 和 commit 均不存在。
