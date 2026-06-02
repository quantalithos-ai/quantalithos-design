# L1-conversation 07 实施计划 Step 8: 配置、环境与外部依赖准备

> 所属流程: `07_implementation_plan_calibration_flow.md`
> 对应正式文档: `projects/L1-conversation/07-实施计划.md` §8 配置、环境与外部依赖准备
> 状态: `[x] 已完成`
> 日期: 2026-06-02

---

## 1. Step 状态

| 项 | 内容 |
|---|---|
| Step | Step 8 |
| 主题 | 定义配置、环境与外部依赖准备 |
| 当前状态 | `[x] 已完成` |
| 是否修改正式 `07-实施计划.md` | 否 |
| 产物位置 | `projects/L1-conversation/design-calibration/07_implementation_plan_step_08_config_env_dependencies.md` |

本步定义实施前或阶段前需要准备的配置、环境、外部服务、跨仓依赖和 fake / controlled seam 边界。本步不重排阶段，不改变 Step 6 提交边界，不创建正式 `07-实施计划.md`。

## 2. 本步输入

| 输入 | 当前状态 | 本步使用方式 |
|---|---|---|
| `07_implementation_plan_step_03_prerequisites_reading.md` | 已确认 | 继承本地 repo、工具链、path dependency、scripts 和证据目录前置检查 |
| `07_implementation_plan_step_05_phases_dependencies.md` | 已确认 | 继承 PH-01~PH-08 阶段顺序 |
| `07_implementation_plan_step_06_tasks_commits.md` | 已确认 | 继承 commit boundary 和开工前复核 |
| `07_implementation_plan_step_07_tests_acceptance_gates.md` | 已确认 | 继承 suite、artifact、report 和失败处理 |
| `04-配置设计.md` | 已完成 | 提取 JSON 配置、profile、配置项、加载校验、failure modes |
| `03-详细设计.md` §13 | 已完成 | 提取配置读取模块、外部依赖绑定和跨仓 Rust 依赖绑定 |
| `05-测试方案.md` §8~§13 | 已完成 | 提取环境矩阵、CI gate、artifact / report 输出 |
| `06-验收标准.md` §3~§11 | 已完成 | 提取验收进入条件、路径、fake-as-production 和 VETO |
| `standards/document/全局项目依赖关系与裁剪规则.md` | 已确认 | 约束编译期、运行期和事件协作依赖分类 |

## 3. 当前本地依赖状态

| 依赖仓库 | 当前本地状态 | 本步处理 |
|---|---|---|
| `/home/aris/Projects/quantalithos-core` | 存在，当前短 hash `ef0d249`，`crates/contracts` 存在 | 唯一编译期 path dependency，实施交接前需固定完整 commit |
| `/home/aris/Projects/quantalithos-bus` | 存在 | 事件协作参考和 fake publisher / event surface 对齐，不写 Cargo dependency |
| `/home/aris/Projects/quantalithos-identity` | 存在 | actor resolver / identity changed consumer 参考，不写 Cargo dependency |
| `/home/aris/Projects/quantalithos-sdk` | 存在 | 下游消费边界参考，不写 Cargo dependency |
| `/home/aris/Projects/quantalithos-conversation` | 不存在 | PH-01 创建目标仓 |
| work / governance / artifact / runtime / bridges / observability / archive / chat / workspace | 当前本机未发现对应目录 | 不阻塞 P0；通过 fake、fixture、controlled seam、ref、marker 和风险接受表达 |

## 4. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 1. 哪些外部服务或仓是实施前置依赖 | 只有 `/home/aris/Projects/quantalithos-core/crates/contracts` 是实施前置编译依赖；目标仓目录需在 PH-01 创建。 |
| 2. 哪些依赖只在特定阶段需要 | bus/outbox 在 PH-03 起有 outbox intent、PH-07 发布；identity / source resolver 在 PH-02 / PH-05；handoff 在 PH-06；reports 在 PH-01 / PH-08。 |
| 3. 哪些配置项必须在本地或 CI 环境准备 | `runtime.profile`、store kind、api / worker / job enablement、resolver / publisher / handoff kind、job limits、reports roots、redaction policy。 |
| 4. 是否允许 fake / mock，允许到什么阶段为止 | P0 允许 fake / in-memory / controlled seam；必须保留 fake marker，不得宣称 production success。 |
| 5. 外部依赖不可用时是暂停、降级还是替代 | 编译期 core 不可用则暂停；运行期 / event 依赖不可用则使用 fake / unresolved / retry / failed / quarantine / risk 语义。 |
| 6. 哪些依赖需要由其他团队或仓提供 | core contracts 由 L0-core 提供；bus / identity / source / handoff / downstream 只提供稳定边界参考，P0 不要求它们运行。 |
| 7. 已实现仓库依赖是否已经在 `/home/aris/Projects` 下存在 | core、bus、identity、sdk 存在；conversation 不存在；其它协作仓当前本机未发现。 |
| 8. 哪些依赖是编译期依赖，Cargo 本地 path dependency 写法是否已经与详细设计一致 | 仅 `core-contracts = { path = "../quantalithos-core/crates/contracts" }` 是编译期依赖。 |
| 9. 哪些依赖是运行期依赖或事件协作依赖，应该使用 API / SDK / adapter / event / projection / fake，而不是 Cargo path dependency | bus、identity、work、governance、artifact、runtime、bridges、observability、archive、sdk、chat、workspace 均不得写 Cargo path dependency。 |

## 5. 当前文档问题诊断

| 问题 | 表现 | 风险 | 本步处理 |
|---|---|---|---|
| 编译期与运行期依赖容易混淆 | 多个 sibling repo 在需求 / 架构中出现 | 实施者可能把运行期关系写进 Cargo | 本步按依赖类型固定协作方式 |
| 目标实现仓不存在 | `/home/aris/Projects/quantalithos-conversation` 未创建 | 不知道建仓是否前置 | PH-01 明确创建并检查 |
| fake / controlled seam 容易被误报为 production | P0 默认大量 fake / in-memory | 验收 fake-as-production VETO | 本步要求 fake marker 和 acceptance 风险说明 |
| 配置项很多 | `04` 已定义多个模块和 cross-field validation | 实施时漏配或绕过红线 | 本步按阶段抽取配置检查 |
| 缺失协作仓可能被误判阻塞 | work / governance 等当前本地缺失 | P0 被不必要阻塞 | 本步明确 P0 使用 fixture / resolver fake |

## 6. 实施计划取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 所有相关仓都作为 Cargo path dependency | 类型直接可用 | 破坏依赖裁剪，形成循环和范围膨胀 | 不采用 |
| 只有 core contracts 作为编译期 path dependency | 符合全局依赖规则，边界清晰 | 其它边界需要 DTO / fake / port 表达 | 采用 |
| P0 要求真实 DB / broker / resolver / handoff | 接近生产 | 当前成本高，且不在 P0 裁决范围 | 不采用 |
| P0 使用 in-memory / fake / controlled seam | 可稳定完成 P0 truth center 验证 | 需要严禁 fake-as-production | 采用 |
| 配置失败 runtime fallback | 本地启动更宽松 | 会绕过 redaction、path、truth 红线 | 不采用 |
| 配置失败 fail-fast / fail-closed | 证据可审查，风险可定位 | 实施时需更多负向测试 | 采用 |

## 7. 结构化中间产物

### 7.1 依赖裁剪图: L1-conversation

```text
L1-conversation
  -> [compile] L0-core / core-contracts
  -> [event]   L0-bus event collaboration
  -> [runtime] L1-identity actor resolver
  -> [runtime] L1-work / L1-governance / L1-artifact source resolver
  -> [event]   L2-runtime / L6-bridges inbound results
  -> [runtime] L4-observability / L4-archive handoff
  -> [runtime] L0-sdk / L5-chat / L1-workspace downstream consumption
```

图示说明:

- 只有 `[compile]` 可进入 Cargo dependency。
- `[runtime]` 和 `[event]` 必须通过 port、adapter、event、query、projection、handoff、fixture 或 fake 表达。
- 图只展示 L1-conversation 相关依赖裁剪，不展示全 27 仓。
- 箭头表达依赖 / 消费 / 协作方向，不表达函数调用顺序。

### 7.2 外部依赖准备表

| 依赖项 | 类型 | 全局依赖类型 | 使用阶段 | 提供方 | 检查方式 | 不可用时处理 |
|---|---|---|---|---|---|---|
| `/home/aris/Projects/quantalithos-conversation` | repo | 不适用 | PH-01 | implementation agent | 目录不存在则创建，存在则检查不是 design 仓 | 若已有冲突目录，暂停并回报 |
| `core-contracts` | repo / crate | 编译期依赖 | PH-01+ | `quantalithos-core` | 检查 `../quantalithos-core/crates/contracts/Cargo.toml` 和 fixed commit | 暂停；不得复制 core 类型 |
| Rust toolchain | tool | 不适用 | PH-01+ | local / CI | `cargo check`、`cargo fmt`、必要时 clippy | 暂停或修复工具链后重跑 |
| JSON config file | config | 不适用 | PH-01+ | conversation repo | 解析、未知 key、profile、cross-field validation | fail-fast |
| in-memory stores | adapter | 运行期依赖替身 | PH-02+ | conversation infra | store kind 为 `in_memory`，rollback / unique key tests | fail-fast 或修复 adapter |
| actor resolver | adapter | 运行期依赖 | PH-02 / PH-05+ | identity boundary | fake / configured resolver 能返回 actor ref 或 unresolved marker | fake unresolved；不得写 identity Cargo dependency |
| external fact resolver | adapter | 运行期依赖 | PH-05+ | work / governance / artifact boundary | fake resolver 支持 safe snapshot、unresolved、digest mismatch | unresolved / stale / mismatch marker |
| inbound event source | event input | 事件协作依赖 | PH-05+ | runtime / bridges / identity / source domains | event envelope fixture、event id、source ref、idempotency key | quarantine invalid；skip duplicate |
| outbox publisher | adapter | 事件协作依赖 | PH-03 / PH-07+ | bus boundary | fake publisher 支持 success、failure、state write failure once | outbox `RetryPending` / `Failed`；truth 不回滚 |
| trace handoff adapter | adapter | 运行期依赖 | PH-06+ | observability boundary | fake handoff success / transient / permanent failure | retry / failed；truth 不回滚 |
| archive handoff adapter | adapter | 运行期依赖 | PH-06+ | archive boundary | fake archive handoff returns package ref only | retry / failed；package body absent |
| downstream consumers | query / event surface | 运行期 / 事件协作 | PH-04+ / PH-08 | sdk / chat / workspace | query / event / projection surface tests and fake marker | 不阻塞 P0；记录 readiness risk |
| report scripts | script | 不适用 | PH-01 / PH-08 | conversation repo | `scripts/reports/generate_reports.sh --run-id <run_id>` | failure summary; fix and rerun |
| redaction checker | script | 不适用 | PH-03+ / PH-08 | conversation repo | `scripts/checks/check_redaction.sh` scans artifacts and reports | redaction failure 阻断 |

### 7.3 配置与环境检查表

| 配置 / 环境项 | 使用阶段 | 检查方式 | 失败处理 |
|---|---|---|---|
| `runtime.profile` | PH-01+ | 只允许 `local-dev`、`ci-test`、`integration-like`、`operations-replay` 和后续已定义 profile | unsupported fail-fast |
| `runtime.config_version` | PH-01+ | P0 只支持 `v1` | fail-fast |
| `storage.*.kind` | PH-02+ | local / CI 默认为 `in_memory`；durable-like 需要 explicit configured ref | unsupported fail-fast |
| `api.command_intake.enabled` / `api.query_intake.enabled` | PH-02 / PH-04 | bool 校验；metadata policy strict | invalid fail-fast |
| `worker.inbound_event_sources` | PH-05+ | fake / configured profile 必须带 fake marker 或 configured refs | invalid fail-fast |
| `outbox.publisher` | PH-03 / PH-07+ | fake marker、credential ref 条件必填、timeout / retry profile 校验 | invalid fail-fast；publish failure 写 retry / failed |
| `resolver.actor` / `resolver.external_fact_sources` | PH-02 / PH-05+ | fake / configured、credential ref 条件必填、source body exclusion | invalid fail-closed；source unavailable unresolved |
| `handoff.trace` / `handoff.archive` | PH-06+ | kind、credential ref、`redaction_required=true` | invalid fail-closed；handoff failure retry / failed |
| `jobs.batch_limits` / `retry_policy` / `timeout_policy` | PH-07+ | positive integer、default batch 不超过 max batch | out of range fail-fast |
| `retention.*` | PH-02+ | idempotency、trace、cursor TTL 不低于安全下限 | fail-fast |
| `projection.*` | PH-04 / PH-07+ | read model enabled；search optional；rebuild batch 不超过 max batch | invalid fail-fast；runtime failure stale / failed |
| `reports.artifacts_root` | PH-01 / PH-08 | 必须形成 `artifacts/test/<run_id>` | unwritable or wrong shape fail-fast |
| `reports.output_root` | PH-01 / PH-08 | 固定为 `reports` 根目录，不加项目名层级 | unwritable or wrong shape fail-fast |
| `reports.run_id_source` | PH-01 / PH-08 | gate / job 必须携带或生成 run id | missing run id fail-fast |
| `security.redaction_policy` | PH-01+ | P0 只允许 `strict` | non-strict rejected |

### 7.4 阶段级配置 / 依赖准备矩阵

| 阶段 | 必备配置 / 环境 | 必备依赖 | 不可用时处理 |
|---|---|---|---|
| PH-01 | Rust toolchain、target repo、workspace、JSON defaults、scripts root、artifact / report roots | `core-contracts` path | core 缺失暂停；path / config / script fail-fast |
| PH-02 | `api.*`、`storage.truth_store`、`storage.idempotency_store`、strict metadata | actor resolver fake | actor unresolved 不得绕过 visibility；schema 缺失暂停 |
| PH-03 | fact store、outbox store、idempotency、strict redaction | fake outbox enqueue | outbox enqueue failure 回滚；redaction failure 阻断 |
| PH-04 | projection store、query intake、cursor retention、search optional | downstream query consumer fake | query 不写 truth；search 不可用返回 marker |
| PH-05 | resolver fake、worker event source fake、snapshot store、quarantine store | source resolver / event fixtures | source unavailable unresolved；invalid envelope quarantine |
| PH-06 | handoff fake、trace retention、redaction required | observability / archive controlled seam | handoff failure retry / failed；不得保存正文 |
| PH-07 | job profile、outbox publisher fake、projection / cursor / consistency config | operations replay fixtures | partial failure 写 report；不得 auto repair truth |
| PH-08 | release profile、fixed run id、report root、redaction checker、acceptance report inputs | all previous EV artifacts | P0 EV / VETO / redaction / path 缺失则不通过 |

### 7.5 fake / controlled seam 使用边界

| seam | 允许阶段 | 允许行为 | 禁止行为 |
|---|---|---|---|
| in-memory store | PH-01~PH-08 P0 | 支持 truth、projection、snapshot、outbox、idempotency 的可测试语义 | 声称 durable production store 已通过 |
| fake actor resolver | PH-02+ | 返回 stable actor ref、not found 或 unresolved marker | 保存 identity 正文或绕过 visibility |
| fake external fact resolver | PH-05+ | 返回 safe snapshot、unresolved、digest mismatch | 补造 source truth 或保存来源正文 |
| fake inbound event source | PH-05+ | 提供 valid / invalid envelope、duplicate、forbidden body sentinel | 无 envelope 写 truth 或吞掉 quarantine |
| fake outbox publisher | PH-07+ | success、transport failure、state write failure once、stable event id | publish failure 回滚 truth 或重复 downstream record |
| fake handoff adapter | PH-06+ | success、retry、failed、package ref only、safe diagnostic | 保存 trace body、archive package body 或 raw secret |
| controlled integration-like adapter | PH-05~PH-08 readiness | 验证 resolver / publisher / handoff 接缝和 failure semantics | 作为 production success 或 P0 必需外部服务 |

## 8. 回填草稿

以下内容用于 Step 13 回填 `07-实施计划.md` §8。正式文档生成时应从本文件摘录，不重新分类依赖。

````markdown
## 8. 配置、环境与外部依赖准备

> 校准来源：
> - `design-calibration/07_implementation_plan_step_08_config_env_dependencies.md`
>
> 延伸阅读：
> - 建议继续阅读上述中间产物的“依赖裁剪图”“外部依赖准备表”“配置与环境检查表”“阶段级配置 / 依赖准备矩阵”和“fake / controlled seam 使用边界”小节，了解本项目哪些依赖可以进入 Cargo、哪些只能通过运行期接缝、事件协作或测试替身表达。

正式 §8 应摘录：

1. §7.1 依赖裁剪图。
2. §7.2 外部依赖准备表。
3. §7.3 配置与环境检查表。
4. §7.4 阶段级配置 / 依赖准备矩阵。
5. §7.5 fake / controlled seam 使用边界。

正式 §8 必须明确：`core-contracts = { path = "../quantalithos-core/crates/contracts" }` 是唯一编译期 sibling dependency。运行期依赖和事件协作依赖不得写成 Cargo path dependency。
````

## 9. 待确认事项

| 事项 | 方案 | 推荐 | 原因 |
|---|---|---|---|
| 缺失的 work / governance / artifact / runtime / bridges / observability / archive 仓是否阻塞 P0 | A: 阻塞；B: 使用 fake / fixture / controlled seam | 推荐 B | P0 裁决 Conversation truth center，不裁决真实跨仓 E2E |
| `quantalithos-bus` 本地存在时是否写 Cargo dependency | A: 写 path dependency；B: 只作为事件协作参考 | 推荐 B | bus 是事件协作主干，不能被业务仓源码依赖 |
| integration-like 是否作为 PH-05/PH-07 必须通过 | A: P0 必须；B: readiness blocking，但非 P0 truth 阻断 | 推荐 B | controlled 接缝可提高信心，但真实外部服务不属于 P0 |

建议接受上述推荐。原因是它们符合全局依赖裁剪规则，同时避免把本机缺失仓或真实外部服务变成 P0 交付阻塞。

## 10. 进入下一步条件

| 条件 | 状态 |
|---|---|
| 关键依赖均有检查方式和失败处理 | 已满足 |
| 阶段级依赖关系与 Step 5 不冲突 | 已满足 |
| 编译期、运行期和事件协作依赖已区分 | 已满足 |
| fake / controlled seam 边界已明确 | 已满足 |
| 配置 fail-fast / fail-closed 口径已明确 | 已满足 |
| 未创建正式 `07-实施计划.md` | 已满足 |

Step 8 可以进入 Step 9。Step 9 应继续严格单 Step 执行，专门定义 Spike、风险与待确认事项，不重写配置、环境和依赖表。
