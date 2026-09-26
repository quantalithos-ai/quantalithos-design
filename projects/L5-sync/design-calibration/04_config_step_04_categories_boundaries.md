# Step 4. 定义配置分类与禁止配置化边界

> 对应 SOP：`standards/document/配置设计讨论流程_SOP.md` Step 4。
> 回填章节：未来正式 `04-配置设计.md` §4「配置分类与禁止配置化边界」。
> 当前模式：`full-restart + single-agent-serial`；本文件是中间产物，不是正式 04。

## 1. Step 状态与门禁

| 项目 | 状态 |
|---|---|
| 当前 Step | `4 / categories_boundaries` |
| Step 状态 | `completed / stop_review` |
| `gate_status` | `pass_with_upstream_blockers` |
| 前序门禁 | Step 1～3 均 `pass_with_upstream_blockers` |
| 正式 04 写入 | `false`；Step 15 前不得创建 |
| 允许的下一动作 | `enter_step_05_sources_priority_conflicts` |
| 实现 / 测试 / commit | `false / false / false` |

本 Step 的通过表示类别、更新边界和禁止配置化红线已经可以交给 Step 5～14 继续展开；不表示任何 external adapter、secret provider、目标仓、真实 Git/filesystem 工具或 consumer/job 已实现或 `bound`。

## 2. 本步目标与输入

本 Step 只在 Step 3 控制面上定义“配置是什么类别、何时冻结、哪些内容永远不能由配置改变”。不定义 raw key、JSON schema、默认数值、环境变量名、来源优先级、secret 产品、profile 矩阵或部署命令。

| 输入 | 权威级别 | 本 Step 采用内容 |
|---|---|---|
| `04_config_step_03_control_plane.md` | 当前 04 校准输入 | 11 个配置域、唯一读取/装配边界、控制面归属和跨域审计 |
| `03-详细设计.md` §3～§13、§15～§17 | 当前正式直接输入 | TypeScript composition、状态/事务/幂等/unknown/审计不变量和现有 config family |
| `03_ddd_step_14_config_dependencies.md` | 当前详细设计中间产物 | 42 个 code-level leaf、adapter binding、四态 capability、hard-boundary 清单 |
| `00-需求文档.md`、`01-架构设计.md`、`02-概要设计.md` | 当前正式上游 | 显式选择、ownership、non-overwrite、review/provenance 和依赖方向红线 |
| 专项上游当前正式文档 | 外部 owner 语境 | 只核验 owner/ref/secret 边界；不把其 policy 或配置项导入 Sync |
| `L1-governance` 04 Step 4 | 框架参考 | 参考分类、更新时机、禁止项和逐域停审粒度；不继承其业务 truth |
| README、旧 05/06、draft | `historical_material / direction_only` | 只做污染审计；旧 LFS/浅克隆/GUI/Tauri 不得变成当前配置类别 |

## 3. SOP 问题回答

### 3.1 当前有哪些配置类别？

L5-sync 的配置类别按是否属于既有 runtime carrier 和是否具有独立生效边界划分如下：

1. **static design boundary**：不是配置；只记录不能被 candidate、profile、环境或 feature flag 覆盖的设计不变量。
2. **startup/cold runtime config**：`configRef/profileRef`、`SyncBoundaryLimits`、`SyncExecutionBudgets`、adapter binding refs、support provider refs 和 operations registration intent。它们在 composition 建立前解析、校验并冻结。
3. **job-run-start pinned parameters**：`SyncJobBudgets` 在显式 job run 开始时从已验证 composition 取快照；一个 job run 内不能改变 batch/parallel 上限，也不生成 schedule、scope 或 idempotency key。
4. **entry-local request parameters**：命令/查询协议中已经存在的显式 project/version/source/target、path scope、selection 和恢复输入。它们是调用者请求，不是对 runtime config 的覆盖；必须继续经过 03 的 DTO、权限、state、dirty/path 和 idempotency guard。
5. **sensitive opaque-ref config**：`credentialProviderRef`、SDK/profile/target/root-policy 等只保存 opaque ref 的项。raw token、证书、private key、endpoint/body 不属于配置值。
6. **diagnostic/redaction technical config**：diagnostics、redaction、digest/clock/id provider 的绑定意图和安全输出边界；不能放宽 forbidden-field 规则。
7. **test-only deterministic config**：只在显式 test composition 选择 typed fake、fixed clock、deterministic ID 或 in-memory test adapter；不能进入 production-like composition。
8. **peripheral capability intent**：`SyncOperationsBindings` 的 nullable Consumer/Job slots 以及其他已存在的外围 registration intent。它只表达是否尝试注册一个已有合同的 slot，不等于启用业务成功路径。

没有单独的“domain policy config”“truth ownership config”“generic retry policy config”或“feature flag 可关闭核心命令”类别。若未来需要这些类别，必须先回流 03/架构设计。

### 3.2 哪些配置允许热更新？

P0 **不允许核心 hot update**。`ValidatedSyncRuntimeConfig`、adapter registry、metadata binding、SDK/local-tool binding、redaction policy、Clock/ID/Digest provider 和 capability classification 只能在启动/冷重建时生效。配置变化必须创建新的 composition 和新的 immutable `AdapterCapabilitySnapshot`；旧 operation/plan/candidate/attempt 继续使用其 pinned snapshot。

job budget 的“job-run-start”冻结不是热更新：它只是新 job run 取得新的已验证快照，已运行的 job 不可被中途改写。entry-local 参数只影响当前请求，不能修改全局 composition。

未来若要支持 reload、last-known-good、dynamic adapter replacement 或在途 operation 切换 snapshot，必须先新增 03 的 runtime lifecycle、builder、审计、rollback、并发和错误契约，再同步本配置文档、05、06、07；本 Step 不预留可绕过该流程的开关。

### 3.3 哪些内容只能冷更新或启动读取？

以下内容均须在 `load → validate → capability classification → new composition` 期间确定：

- `configRef/profileRef` 与 profile 语义；
- 五个 limits/budget carrier（job budget 的有效值在 run start 冻结）；
- `SyncMetadataBindings` 的 store/UoW/lock refs；
- `SyncSdkBindings` 的 SDK、credential-provider、owner/source/handoff/Decision/probe refs；
- `SyncLocalToolBindings` 的 Git/fs/root-policy refs；
- `SyncSupportBindings` 的 diagnostics/redaction/Clock/ID/Digest refs；
- `SyncOperationsBindings` 的 conditional Consumer/Job registration intent；
- capability snapshot 生成所需的 binding classification 和安全 redaction 规则。

这些项的冷更新不会自动使旧对象迁移到新语境；旧历史仍由原 snapshot/ref 解释。

### 3.4 哪些安全、审计、事务、一致性或领域规则禁止配置化？

凡是改变 truth owner、协议/状态合法性、effect 语义、审计完整性、unknown 处理或用户数据安全的项，均属于 static design boundary，不属于普通配置。具体清单见 §6。

### 3.5 禁止配置化项如需改变应走什么流程？

不得通过 JSON、环境覆盖、profile、CLI flag、feature flag、secret ref 或 adapter registry 改变。必须：

1. 在需求、架构、概要或详细设计中修改对应 truth/ownership、对象/DTO、Port、flow、state、事务、幂等或安全契约；
2. 重新审计 00→03 的追溯、上游依赖和 03 影响判定；
3. 由 04 重新分类、列来源/校验/失效；
4. 由 05/06/07 分别补测试、验收和实施边界。

在上述链路完成前，原禁止项仍 fail-closed；不得用 default、fake、cache、ACK、日志或“disabled”姿态静默改变语义。

### 3.6 每个配置域适用哪些类别？

逐域映射见 §7。总体规则是：binding/profile/limits/support 属 startup/cold；job limits 属 job-run-start pinned；调用者选择属 entry-local request；secret 只以 opaque ref 存在；capability snapshot 是 composition 产物而不是可编辑配置；static design boundary、domain policy、truth/审计/状态/事务规则对所有配置类别均不适用。

## 4. 配置分类与更新时机总表

| 配置类别 | 语义 | L5-sync 例子（仅回指既有 carrier） | 是否允许 hot update | 生效边界 | 主要风险 |
|---|---|---|---|---|---|
| `static_design_boundary` | 设计不变量，不是 raw config | ownership、state matrix、UoW、unknown、non-overwrite、review/provenance redlines | 不适用 | 正式设计变更后生效 | 被误写成 flag 会绕过需求/架构 |
| `startup_cold_runtime` | composition 前解析并冻结 | `configRef/profileRef`、`SyncBoundaryLimits`、`SyncExecutionBudgets`、八类 binding refs | 否 | 新 composition / restart | 运行中换 adapter/store 破坏 snapshot 一致性 |
| `job_run_start_pinned` | 新 job run 取得 immutable 有效值 | `SyncJobBudgets.maxBatchItems/maxParallelItems` | 否；只对新 run | job run 创建时冻结 | 中途改变导致报告和重入不可复核 |
| `entry_local_request` | 调用者显式输入，不覆盖 runtime config | project/version/source/target、path scope、resume/conflict input | 不适用 | 当前 command/query/job | 把 request 当默认选择或权限开关 |
| `sensitive_opaque_ref` | 只保存 ref，材料由私有 provider 解析 | `credentialProviderRef`、SDK/root-policy/provider refs | 否；轮换走 ref replacement + new composition | provider call context | raw secret/body/endpoint 泄露 |
| `diagnostic_redaction` | 安全输出和技术信号接缝 | `diagnosticsAdapterRef`、`redactionPolicyRef`、safe digest/provider refs | 否 | startup/cold composition | 放宽 deny list，泄露 forbidden data |
| `test_deterministic_only` | 测试 composition 的显式替身 | fake adapter、fixed clock、deterministic ID、in-memory store | 仅测试入口可重建 | test composition | fake 被误当真实 capability |
| `peripheral_registration_intent` | 既有 conditional slot 的注册意图 | nullable `SyncOperationsBindings` refs | 否；新 composition | registration time | ref 存在即误报 bound，或私造 transport/schedule |

**边界说明：** `SyncAdapterCapabilitySnapshot` 是 validated binding 的不可变结果，不是第九类可修改配置；它只记录 `bound/blocked/unsupported/unknown` 和安全原因，不能由配置直接写入 `bound`。

## 5. 更新时机与冻结规则

| 更新时机 | 允许内容 | 明确禁止 | 生效规则 |
|---|---|---|---|
| design-time | 需求/架构/对象/Port/flow/state/事务/安全红线 | 作为 JSON/env/profile/flag leaf | 走正式文档变更，重新经过 00→03 和 04 |
| startup / cold composition | profile、limits/execution、metadata/SDK/local/support/operations refs | 在途 operation 中替换 store、adapter、snapshot 或 capability | 新 composition 解析并全量校验；失败则不构造对应 graph |
| job-run-start | job batch/parallel 有效值、显式 job 请求的 bounded scope | 运行中调大 scope、切换 actor/key、改变 mutation semantics | 新 run pin 新 snapshot/预算；旧 run 不变 |
| entry-local | explicit selection/target/path/resume/conflict input 和受限呈现选项 | default/latest 选择、全局 config 覆盖、授权/状态/dirty guard 覆盖 | 仅当前 entry；按 03 protocol/guard 校验 |
| test composition | typed fakes、fixed clock/ID、in-memory adapter | 生产 profile 复用 test override、fake positive | 仅测试进程；不得产出 integration/readiness claim |
| runtime hot update | 当前 P0 不适用 | store/adapter/redaction/capability/snapshot/核心规则的无审计热替换 | 未来必须先回写 03 并建立 reload/rollback/audit contract |

## 6. 禁止配置化项表

| 禁止配置化项 | 禁止原因 | 回指来源 | 如需改变的正式流程 |
|---|---|---|---|
| Project、Artifact、Baseline、Workspace projection、Archive、Git remote 的 truth ownership | Sync 只能引用/读取，不能本地夺取 owner | `00` ownership；`01` boundary；`03` §1/§12 | 修改需求/架构 ownership，再同步 02/03/04/05/06/07 |
| implicit actor/project/version/source/target/default/latest 选择 | 会绕过显式选择、权限和 provenance | `00` explicit selection；`03` CP1/协议 | 修改 request/Port/flow 和安全验收，不加配置开关 |
| owner permission、archived posture、local allow 或 capability override | 配置不能替代 Identity/Work/Archive owner truth | `01` dependency boundary；`03` access flow | 修改 owner 合同与 access evaluation 设计 |
| state machine 合法迁移、terminal reopen、unknown/needs-action 语义 | profile/flag 不能改变 domain lifecycle | `03` Step 10/状态矩阵 | 修改状态/transition 契约和测试切口 |
| repository expected version、UoW atomicity、lock ownership、commit-unknown recovery | 关闭它会产生 stale overwrite 或伪原子写 | `03` Step 11～13 | 修改 repository/UoW/错误恢复契约 |
| idempotency key、canonical digest、duplicate replay 和 retry equivalence | 不能用配置重新执行副作用或绕过 unknown | `03` §7/§13、Step 12/13 | 修改协议 carrier、effect/probe/recovery 合同 |
| query zero-write、status/inspect hidden refresh、repair/rebind/migrate side effect | Query 不能成为隐式 mutation | `02` query boundary；`03` §8/§13 | 修改 Query/Command flow 和权限审计 |
| source authority、version comparator、cursor/gap/full-fallback 或 partial 推进 | Sync 不拥有 Artifact/Workspace source truth | `00`/`01` source boundary；`03` CP3 | 由上游 owner 先闭合合同，再回写 03/04 |
| `.qs-sync` physical schema、provenance retention/deletion、protected history | 不能用配置改写或删除 local provenance | `SYNC-UP-006`；`03` Step 11/14 | 上游 metadata 合同 + 03 targeted repair + 07 实施 |
| dirty/untracked/path/symlink/root/lock unknown 时继续或覆盖 | 保护用户未提交修改和受控 namespace | `00` safety；`03` CP2/CP3、`SYNC-UP-010` | 修改 filesystem/Git safety contract 和验收 |
| auto fetch/merge/rebase/push/stash、arbitrary shell/remote/refspec | 不属于受控 local sync effect | `00`/`01` hard redlines；`03` adapters | 需求/架构重新授权并重审依赖边界 |
| Git commit 当 Artifact/Baseline，上传 ACK 当 Review accepted/Decision/readiness | 结果层不可升格为平台事实 | `00` review/provenance；`03` CP5/§13～15 | 修改 Governance/SDK handoff 合同与跨文档门禁 |
| handoff/probe blind retry、timeout-as-not-happened、换 key 重放 | effect unknown 必须保持 unknown/manual/probe | `SYNC-UP-004/005`；`03` Step 12 | 先闭合 effect equivalence/probe，再修改恢复设计 |
| raw token、credential、provider body、file body、Git stdout/stderr、diff、evidence/report/verdict/signoff/readiness | 防止敏感或外部正文进入 config/metadata/status/diagnostics | `00` security；`03` §14/15 | 修改 security/redaction/data contract，不放宽配置 |
| capability `bound`、健康、授权、source freshness 或 readiness 的手工 override | ref/flag 不能伪造 capability | `03` `AdapterAvailability`/snapshot invariants | 修改 adapter contract 和正式 probe/health boundary |
| fake/cache/log/ACK/default 把 blocker 变成 positive capability | 保持上游 blocker 的真实性 | `03` Step 14/18；`SYNC-UP-*` | 关闭真实 blocker 后再更新 binding；不能由配置关闭 |
| LFS、浅克隆、GUI/Tauri、daemon/scheduler 作为当前 positive capability | 历史选择尚无当前支持矩阵，且会新增 runtime surface | `SYNC-UP-009`；`03` §3/§4/§13 | 新需求/架构/详细设计和上游支持矩阵后再评估 |
| 配置来源定义新 Port/DTO/error/state/flow 或 generic retry policy | 04 不能静默改变 03 code shape | `04` flow boundary；`03` §4～§13 | 先回流 03，再由 04 重新分类 |

### 6.1 禁止项变更门禁

任何 candidate、profile 或 ref 出现上述字段/意图时，处理顺序必须是：

```text
whole-candidate reject
  -> redacted typed config issue
  -> no runtime composition / no capability promotion
  -> record design-change trigger (not a runtime workaround)
```

不能忽略未知禁止字段、把它降级成 warning、用默认值替代、或仅关闭某个外围 adapter 来宣称候选可用。

## 7. 按配置域组织的分类边界

| 配置域 | 适用配置类别 | 明确不适用类别 | 冻结/生效边界 | 禁止配置化项 | 分类理由 |
|---|---|---|---|---|---|
| `config_identity` | `startup_cold_runtime`、`diagnostic_redaction`（仅 redacted identity） | `entry_local_request` 作为覆盖、raw sensitive、`runtime_hot_update` | 新 composition 固定 `configRef`；旧对象不改写 | raw document/secret/endpoint/body、identity 冒充 readiness | identity 是 candidate 语境，不是业务输入 |
| `profile_context` | `startup_cold_runtime`、受限 `entry_local_request`（显式 profile selector 若未来由入口承接）、`test_deterministic_only` | hot replacement、domain policy、implicit selection | profile 参与 composition；不在运行中换 profile | Project/version/source/target/permission/posture override | profile 只描述 adapter/environment 语义 |
| `boundary_limits` | `startup_cold_runtime`；entry-local 只允许协议已定义的 bounded request | hot update、authorization/state config、job scope synthesis | 新 composition 固定；entry request 另行校验 | truncate-as-success、dirty/path/lock bypass、无限/零 fallback | limit 是拒绝边界，不是业务准入 |
| `execution_budgets` | `startup_cold_runtime`；job-run-start 只 pin 已验证值 | generic retry policy、hot update、effect semantics | 每次调用读取 immutable budget；timeout 映射沿 03 | timeout-as-not-happened、blind retry、替代 lock/version | budget 只限制时间/并发，不改变结果层 |
| `job_budgets` | `startup_cold_runtime`、`job_run_start_pinned` | entry-local 任意 scope、hot mid-run update、daemon schedule | run start pin；每 item 仍独立 UoW/version | 扩 scope、生成 key/actor、auto repair/materialize/handoff | job carrier 已在 03 预留，不能变成 scheduler |
| `metadata_bindings` | `startup_cold_runtime`、`sensitive_opaque_ref`、`test_deterministic_only`（仅测试 composition） | job-local physical migration、hot replacement、cache authority | composition 前 static capability validation；不足则 mutation blocked | schema/retention/delete/provenance/last-write-wins/lock bypass | local truth adapter 不是可调的业务策略 |
| `sdk_bindings` | `startup_cold_runtime`、`sensitive_opaque_ref`、`test_deterministic_only`（仅 fake negative mechanics） | entry-local endpoint/method/DTO、hot provider swap、local authorization | 每个 slot 独立分类；ref 不自动 bound | owner/source/handoff/Decision/readiness override、raw body/secret | external owner truth 不在 Sync 配置所有权内 |
| `local_tool_bindings` | `startup_cold_runtime`、`sensitive_opaque_ref`（只 ref）、`test_deterministic_only` | arbitrary entry command、hot executable swap、Git strategy config | typed adapter/root policy 在 composition 固定 | shell/argv/remote/refspec/merge/rebase/push/stash/dirty overwrite | local adapter 必须白名单且不拥有 remote truth |
| `support_bindings` | `startup_cold_runtime`、`sensitive_opaque_ref`（provider ref）、`diagnostic_redaction`、`test_deterministic_only` | hot redaction relax、domain policy、raw secret | snapshot 固定 safe output/provider refs | forbidden body/raw output、高基数标签、日志升格 truth | support failure 与业务结果隔离 |
| `operations_bindings` | `startup_cold_runtime`、`peripheral_registration_intent`、`test_deterministic_only` | entry flag 开核心 mutation、hot registration、daemon schedule | 仅在 formal contract/capability bound 时注册；否则 blocked | topic/schema/scope/key synthesis、auto consumer action、daemon truth | nullable slot 是接缝，不是业务开关 |
| `capability_snapshot_context` | 仅 `startup_cold_runtime` 的 composition 产物；测试可显式构造 test snapshot | 任意 raw edit、entry override、hot mutation | immutable；operation/plan/candidate/attempt pin exact ref | manual bound/health/readiness、snapshot rewrite/delete、raw payload | 这是事实载体，不是配置输入 |

## 8. 分类边界逐域停审记录

| 配置域 / 边界 | 类别归属 | 热/冷规则 | 禁止项可执行性 | 03 影响检查 | 停审结论 |
|---|---|---|---|---|---|
| `config_identity` / `profile_context` | startup + limited entry/test context | cold only；旧 snapshot 不换 | whole-candidate reject raw/implicit selection | 仅引用 `configRef/profileRef` | 通过（带上游 blocker） |
| `boundary_limits` / `execution_budgets` | startup；job run pin | immutable per composition/call | reject clamp/infinite/timeout bypass | 沿用 limits/budgets carrier | 通过（带上游 blocker） |
| `job_budgets` | startup + job-run-start pin | no mid-run mutation | reject schedule/scope/key synthesis | 不新增 job contract | 通过（带上游 blocker） |
| `metadata_bindings` | startup/ref/test | cold; capability不足 blocked | reject physical truth/provenance bypass | `SYNC-UP-006` 原样保留 | 通过（`SYNC-UP-006` blocker） |
| `sdk_bindings` | startup/ref/test-negative | cold; per-slot classification | reject local owner/source/ACK override | `SYNC-UP-001~005/008` 原样保留 | 通过（上游 blocker） |
| `local_tool_bindings` | startup/ref/test-negative | cold; no arbitrary executable | reject Git remote/effect bypass | `SYNC-UP-007/009/010`、LOCAL blockers保留 | 通过（上游 blocker） |
| `support_bindings` | startup/ref/diagnostic/test | cold; redaction cannot relax | reject raw/forbidden output | 仅承接 support family | 通过（带上游 blocker） |
| `operations_bindings` | startup/peripheral/test | registration-time; no daemon | reject hidden consumer/job action | Consumer/Job remains blocked | 通过（上游 blocker） |
| `capability_snapshot_context` | composition result | immutable, pinned | reject manual promotion/rewrite | 复用 03 snapshot invariant | 通过（带上游 blocker） |

逐域停审结论：所有 Step 3 配置域均有唯一类别归属和冻结边界；禁止项均能在 candidate validation / composition boundary 被拒绝或保持 blocked，不需要通过业务模块自行解释。

## 9. 跨分类 / 禁止项审计

| 审计项 | 结论 | 缺口 / 修正 |
|---|---|---|
| P0 是否出现核心 hot update | 无 | startup/cold 或 new job-run pin；未来 reload 需回 03 |
| 同一 timeout/budget 是否在多个类别产生冲突 | 无 | execution budget 负责调用；job budget 负责 item；均不表达 retry/业务 scope |
| entry-local 是否偷渡 implicit selection 或全局覆盖 | 无 | 只允许显式 protocol input；继续走 03 guards |
| sensitive ref 是否被误列为普通 raw value | 无 | 仅 opaque ref；材料解析和轮换留 Step 8/运维 |
| diagnostics/redaction 是否能放宽安全红线 | 无 | deny/forbidden 规则只能收紧；不能 hot relax |
| test fake 是否能产生 positive integration/readiness | 无 | 仅 test composition；capability ceiling 显式保留 |
| operations slot 是否变成 scheduler/daemon/核心 feature flag | 无 | registration intent only；formal contract 缺失时 blocked |
| static design boundary 是否遗漏 | 无 | ownership、selection、state、UoW、idempotency、source、dirty/provenance/review 全列入 §6 |
| 历史 LFS/浅克隆/GUI/Tauri 是否进入类别 | 无 | 不进入 current positive config 或 capability union |
| 领域不变量、数据所有权、append-only 是否被开放 | 无 | 均只能走正式设计变更 |
| P1/P2 是否污染 P0 contract | 无 | real adapter/production profile/hot source 仍为后续或 blocker |
| 分类是否新增 03 code shape | 无 | 没有新 runtime type、Port、DTO、error、state 或 flow |

## 10. 对详细设计的影响判定

| 结论 | 是否影响 03 | 影响类型 | 处理状态 |
|---|---|---|---|
| P0 仅支持 startup/cold composition，job budgets 在新 run pin，entry-local 只是显式 request | 否 | 细化已有 immutable config / flow 语义 | `无回写` |
| sensitive values 只以 opaque ref 存在，raw secret/body 永不进入 carrier | 否 | 重申 03 redaction/ref-only 不变量 | `无回写` |
| test fixture 只在 test composition，不能把 fake 变 positive capability | 否 | 承接 03 test-double ceiling | `无回写` |
| operations bindings 只表达 conditional slot，不新增 scheduler/event contract | 否 | 承接既有 nullable refs / blocked posture | `无回写` |
| 若未来要求 hot reload、dynamic adapter replacement、配置改变核心 flow | 是（未来触发） | 将改变 runtime lifecycle、builder、snapshot pinning 或 flow | `当前不触发；变更前必须回流 03` |

当前计数：`待回写=0`；`阻塞待确认=0`。`SYNC-UP-001~010`、`SYNC-LOCAL-001~005` 是外部依赖 blocker，不因本 Step 的分类结论而关闭或升级。

## 11. 回填草稿（未来正式 §4）

正式 `04-配置设计.md` §4 应回填本文件的配置分类表、更新时机与冻结规则、禁止配置化项表、逐域分类边界、停审记录和跨分类审计。

回填时必须保留以下结论：

- P0 没有核心 hot update；binding/profile/support 走 startup/cold，job budget 在新 job run pin，entry-local 仅是显式请求输入。
- `AdapterCapabilitySnapshot` 是不可编辑的 composition 事实载体，不是可通过 config 手工设置的 readiness 开关。
- raw secret、endpoint/body、文件正文、Git 输出、evidence/report/verdict/signoff/readiness 永不进入普通配置或其诊断/metadata carrier。
- Project、Artifact、Baseline、Review Gate/Decision、Workspace projection、Archive、Git remote truth 以及 state/transaction/idempotency/provenance/dirty-worktree/review 红线均不可配置化。
- 任何改变禁止项或要求 hot reload 的需求都必须先回流正式 03，再重启 04～07 校准。

本节不引入 raw key、默认数值、env 名、secret 产品、部署命令或测试/验收结果。

## 12. 待确认事项

| 事项 | 影响 | 当前姿态 | 归属 |
|---|---|---|---|
| 是否未来支持 hot reload / last-known-good | 需要新的 03 lifecycle、snapshot、rollback、audit contract | P0 明确不支持；未确认前保持 `unsupported`，不创建开关 | 未来需求/03/04 Step 13～14 |
| production-like 是否允许 dynamic adapter replacement | 会影响在途 operation 和 capability snapshot pinning | P0 不支持；必须先有 ADR 和 03 回写 | 未来架构/03 |
| job budget 是否需要不同 profile 的 run-start override | 只影响 Step 5/6/7 的来源/矩阵，不改变 carrier | 当前只允许新 run pin；不允许中途覆盖 | 04 Step 5～7 |
| feature/peripheral registration 的最终实例 | 可能受 consumer/runner upstream contract 影响 | nullable/blocked；不以 ref 证明 bound | 上游/04 Step 12 |
| secret ref 的轮换和审计细节 | 影响 Step 8/09 运维承接 | 本 Step 只规定 opaque ref 和冷替换边界 | 04 Step 8/09 |

这些事项不构成当前 03 回写或 Step 4 阻塞；它们必须在所属后续 Step 或未来正式设计变更中保持显式。

## 13. Step 自检与进入下一步门禁

| 检查项 | 结果 |
|---|---|
| 配置类别已定义，且均能回指 Step 3/03 carrier | pass |
| startup、job-run-start、entry-local、test-only 与非配置 design boundary 已区分 | pass |
| P0 hot update 明确禁止，旧 snapshot 历史语境不被改写 | pass |
| 每个配置域适用/不适用类别、冻结方式和禁止项已写明 | pass |
| 禁止项回指 00/01/02/03 的 ownership、安全、状态、事务、幂等、审计或依赖红线 | pass |
| raw secret/body、Git remote/commit、ACK/accepted、fake-positive、LFS/shallow/GUI 等红线已覆盖 | pass |
| 分类冲突、P1 污染 P0、遗漏禁止项和跨域重叠已审计 | pass |
| 未来 hot reload 等变更触发已标为回流 03，而非静默配置 | pass |
| 当前无 03 待回写、无阻塞待确认 | pass |
| 未创建正式 04、未创建 Step 5 文件、未实现/测试/提交 | pass |

### Step 4 结论

`gate_status = pass_with_upstream_blockers`；`Step status = completed / stop_review`。允许进入 `04_config_step_05_sources_priority_conflicts.md`。正式 `04-配置设计.md` 仍保持不存在，直到 Step 15。
