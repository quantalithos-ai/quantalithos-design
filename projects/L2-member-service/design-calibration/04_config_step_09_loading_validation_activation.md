# Step 9：定义配置加载、校验与生效机制

> 对应 SOP：`standards/document/配置设计讨论流程_SOP.md` Step 9
> 回填章节：未来正式 `04-配置设计.md` §9“配置加载、校验与生效机制”
> 参考粒度：`projects/L1-governance/design-calibration/04_config_step_09_loading_validation_activation.md`
> 执行模式：full-restart；本文件只记录已收口的配置控制面，不创建实现或运行证据

## 1. Step 状态

| 项目 | 记录 |
|---|---|
| 当前文档 | `04-配置设计.md`（正式文件尚未创建） |
| 当前 Step | Step 9 加载、校验与生效 |
| 当前模块 | `loading_validation_activation` |
| Step 状态 | `completed / pass_with_upstream_blockers` |
| 输入基线 | Step 5 来源优先级、Step 6 profile 矩阵、Step 7 配置项、Step 8 敏感配置、`03` §13 |
| 正式 `04` 写入 | `false`；只允许在 Step 15 装配 |
| 实现 / 测试 / 证据 | `false`；只定义可实现规则，不声称 loader、provider 或 backend 已实现 |
| commit | `false` |

### 1.1 Step 内计划

- [x] 固定普通来源合并、严格 JSON parse 和 canonical key 检查。
- [x] 为配置域补齐 type、range、ref-shape 和 cross-field validation。
- [x] 固定 `ValidatedMemberServiceConfig` 与 `infra/runtime_builder.rs` 的组装顺序。
- [x] 区分 startup、job-run-start、entry-local 和 test fixture 的生效边界。
- [x] 明确 P0 不支持 reload / hot，并定义非法生效方式的拒绝行为。
- [x] 完成配置域停审、跨加载校验审计、`03` 影响判定和 §9 回填草稿。

## 2. 本步目标与边界

本 Step 定义配置从来源到运行装配的完整闭环：合并、解析、类型校验、交叉字段校验、敏感/禁止内容检查、装配 validated config、绑定 logical stores 与 typed ports、再向 API、worker 和 jobs 暴露冻结参数。

本 Step 不定义：

- Rust loader 的具体函数签名、错误 enum 字段或实现代码；
- 具体数据库、消息总线、容器平台、secret provider、observability backend 或 scheduler 产品；
- 上游 sibling 的 register、heartbeat、runtime session、image manifest、Sandbox policy、Core/Bus envelope 或 receipt schema；
- 在线 secret rotation、remote config、admin override、hot reload 的实现契约；
- 配置变更审批、审计和回滚流程（Step 10）；
- 失效模式矩阵和测试用例（Step 11 / 下游 05）。

## 3. 本步输入

| 输入 | 用途 | 状态 |
|---|---|---|
| `04_config_step_05_sources_priority_conflicts.md` | 普通来源唯一优先级、冲突与不可用策略 | completed |
| `04_config_step_06_environment_profiles_matrix.md` | P0 profile、fake / controlled / replay / future 边界 | completed |
| `04_config_step_07_config_items.md` | 配置域、类型、默认值、必填性、作用域、生效方式、失败策略 | completed |
| `04_config_step_08_sensitive_secrets.md` | `public/internal/sensitive/secret`、opaque ref、禁止输出和轮换边界 | completed |
| `03-详细设计.md` §13 | `infra/config.rs`、`ValidatedMemberServiceConfig`、`infra/runtime_builder.rs` 绑定顺序 | completed |
| `03_ddd_step_14_config_dependencies.md` | section 与 code binding、P0 fake/blocked 口径 | completed |

## 4. SOP 问题回答

| 问题 | 本仓结论 |
|---|---|
| 配置在什么时机加载？ | startup 配置在 runtime builder 暴露任何 facade 前加载并冻结；job-run-start 配置在 job reserve 幂等键前解析并冻结到本次 run；entry-local 参数只影响当前入口；`deterministic_fixture.*` 仅由 `ci-test` test harness 或 `operations-replay` job 使用，`local-dev` 与 `integration-like` 不启用该配置域。 |
| 如何 parse 和 type validate？ | 普通运行文件必须是严格 JSON；先合并 defaults/file/env，再解析 object、canonical key、枚举、布尔、正整数、毫秒/秒 duration、可空 ref、唯一列表和受限 map。JSONC 仅是文档示例，运行时必须拒绝注释。 |
| 哪些字段需要 cross-field validate？ | profile 与 availability、store kind 与 ref、enabled 与 target/ref、topic-neutral event key 与 publication、retention 与 replay window、batch 与 page limit、fixture 与 profile、redaction deny list 与 label allowlist 均需要交叉校验。 |
| 哪些配置 startup / reload / hot / build-time / static？ | P0 只有 startup、job-run-start、entry-local、test-entry；`reload` / `hot` 不支持。Rust feature / workspace 依赖是 build-time 设计边界而非运行配置。truth owner、状态、幂等、Query no-write、Job no-authorization 和 handoff 层级是 static design boundary。 |
| 校验失败怎么处理？ | startup 失败不暴露 facade；job-run-start 失败只拒绝当前 job；entry-local 失败拒绝当前入口；fixture 失败令测试或 replay job fail-fast。高优先级非法值不得回退低优先级。raw secret、外部正文或禁止配置键直接 reject。 |
| 是否与 Step 7 一致？ | 一致。每一项的加载时机、生效方式和失败策略在本 Step 的配置域表中逐项回指 Step 7；未确认的 provider / sibling contract 仅生成 blocked / placeholder availability。 |
| 是否存在未校验必填项或热更新回滚缺口？ | 当前配置域均有 parse、type、cross-field、assemble 和 failure 行；P0 不支持 reload / hot，因此不存在假设性的无回滚热更新。未来支持时必须先回写 `03`。 |

## 5. 当前材料诊断

| 位置 | 改动前问题 | 本 Step 修正 |
|---|---|---|
| Step 7 配置项 | 有字段清单，但加载顺序和最终暴露面未集中说明 | 固定 source merge → parse → validate → assemble → expose 链 |
| Step 8 敏感配置 | ref 和 raw body 的边界已定义，但未进入 loader reject 规则 | 将 raw secret/body、非法 ref shape 和敏感错误输出纳入验证 |
| `03` §13 | builder 顺序已存在，但未映射每个配置域的目标和失败时机 | 增加域到 `ValidatedMemberServiceConfig`、store、adapter、entry 的映射 |
| Step 4 / 5 | P0 禁止 hot、remote/admin override 已声明，未定义输入层行为 | 对 `reload`、`hot`、config center、admin override 和 invariant override 统一 reject |
| 正式 `04` | 尚未创建 | 本 Step 只生成 §9 回填草稿 |

## 6. 设计取舍

| 议题 | 备选 | 采用结论 |
|---|---|---|
| 运行文件格式 | 支持 JSONC / 只支持严格 JSON | 只支持严格 JSON；JSONC 仅为文档注释示例 |
| 高优先级 env 非法值 | 回退 file/default / fail-fast | fail-fast，避免错误配置被低优先级掩盖 |
| adapter 探活时机 | loader 调用所有外部服务 / 只校验 ref 并生成 availability marker | 只校验 ref 和 profile 组合；外部可用性由 adapter seam 返回并保持 blocked/unknown |
| job 参数 | 覆盖 startup 配置 / 只冻结 run-local 参数 | 只冻结 run-local 参数，不能改写全局 invariant |
| reload / hot | 预留半实现 / P0 明确 unsupported | P0 明确 unsupported；未来必须新增 03 contract、回滚和观测门禁 |
| secret provider 不可用 | fallback fake / fail-closed 或 blocked | 启用的高风险目标 fail-closed；可选外围 disabled/degraded；禁止静默 fallback |

## 7. 配置加载流程图

#### 配置加载流程图: L2-member-service 配置加载与校验

```text
[code defaults]
      |
      v
[optional strict JSON file]
      |
      v
[environment variable overrides]
      |
      v
[canonical-key / duplicate / alias check]
      |
      v
[strict JSON parse]
      |
      v
[type / enum / range / ref-shape validation]
      |
      v
[cross-field + profile + forbidden-body validation]
      |
      v
[assemble ValidatedMemberServiceConfig]
      |
      v
[runtime_builder: stores + UoW + result + ports + adapters]
      |
      v
[availability markers: enabled / disabled / blocked / unknown]
      |
      v
[application facade + typed API / worker / jobs parameters]
```

关键说明：

- `entry-local` 与 job input 只在最后的入口参数阶段收窄，不成为全局覆盖层。
- builder `Ready` 前不得暴露 API、worker 或 jobs facade；任何必需 local binding 缺失均 fail-fast。
- adapter availability 不是 ready、healthy、delivered、observed 或 accepted 的证明。
- P0 没有 reload / hot path；配置变化通过 cold restart 或 new job run 生效。

## 8. 结构化加载与校验产物

### 8.1 配置组加载表

| 配置组 | 加载时机 | parse / type 校验 | 生效方式 | 失败策略 |
|---|---|---|---|---|
| `profile`、`config_identity` | startup | object、已支持 profile/schema version、canonical source label | builder 前冻结 | startup fail-fast |
| `truth_store_binding` | startup | 五个 logical owner binding、enum、非空 | runtime builder store registry | 缺失或跨 owner 混淆 fail-fast |
| `maintenance_store_binding` | startup | history/material/outbox/projection binding enum | repository / UoW assembly | history/material/outbox 缺失 fail-fast；projection 不可用可 degraded |
| `idempotency_result_binding` | startup | reservation 与 stored-result binding 完整性 | command/consumer/job facade 注入 | mutation entry rejected，不静默重跑 |
| `qualification_resolvers` | startup | resolver mode、family enum、placeholder/fake/blocked 状态 | typed qualification ports | 未闭合 resolver 保持 blocked |
| `member_binding`、`images_binding`、`runtime_session_binding` | startup | availability + optional opaque ref shape | adapter registry | enabled 但 unavailable 时 launch/session blocked |
| `sandbox_binding` | startup | sandbox opaque ref shape + profile compatibility | Sandbox bind/release port seam | 高风险动作 fail-closed，local record 可保留 |
| `carrier_binding.availability` | startup | availability enum；本版不接受 carrier ref 或 release schema | carrier handoff seam 的 availability marker | unavailable => handoff blocked / gap，不装配 carrier adapter |
| `registration_session`、`health_assessment` | startup；health threshold 可 job-run-start | mode enum、credential ref shape、positive duration | registration/signal adapter 与 health job params | contract 未闭合时 blocked/unknown；非法输入 reject |
| `publication`、`handoff_feedback` | startup | enabled 与 event/target ref 的条件校验 | publisher/feedback adapter registry | disabled 可启动；显式 enabled 缺 ref 则 fail-fast 或 job rejected |
| `operation_jobs` | startup；batch/parallelism/timeout/retry 可 job-run-start | 非负/正整数、mode enum、profile compatibility | 本次 job run 冻结 | 当前 job rejected，不改变 Host Truth |
| `safe_read_boundary`、`security_redaction` | startup | body-free、query_write_repair=false、deny list 非空、低基数标签 | query mapper、diagnostic hooks | startup fail-fast / fail-closed |
| `clock_id` | startup；`deterministic_fixture.*` 仅可在 `ci-test` test-entry / `operations-replay` replay run 搭配使用 | clock/id mode 与 profile compatibility | ClockPort / IdGeneratorPort | 缺失或 handler synthesis 尝试 fail-fast |
| `deterministic_fixture` | ci-test test-entry / operations-replay job-run-start | 仅允许 profile、脱敏 fixture / replay ref、timestamp / source ref | fake runtime seed 或 replay input | `local-dev`、`integration-like` 和 future profile 直接 reject |

### 8.2 按配置域组织的加载 / 校验 / 组装表

| 配置域 | 必填 / 条件项 | cross-field validate | assemble target | 失败策略 |
|---|---|---|---|---|
| profile identity | `profile.name`、`schema_version` | profile 与 `deterministic_fixture.*`、adapter mode、store kind 组合合法 | `ValidatedMemberServiceConfig.profile` | startup fail-fast |
| logical truth stores | control、qualification、progression、session、closure | 五个 owner 均存在且不把 maintenance store 当 truth store | logical repositories + UoW | startup fail-fast |
| maintenance stores | history/material、outbox 必须存在；projection 可选受控 | outbox 不得从 current truth 临时重构；projection 不得反写 source | maintenance repositories | outbox 缺失 fail-fast；projection disabled/degraded |
| idempotency / result | reservation、stored_result | mutation/replay window 与 job retry / redelivery window 覆盖 | idempotency and stored-result ports | mutation rejected |
| resolver set | identity、work、member、images、runtime、sandbox | family 不重复；placeholder 只可表达 blocked/unknown | qualification / session / health adapters | unresolved => blocked |
| ref-bearing lifecycle bindings | member/images/runtime/sandbox availability/ref | enabled ⇒ non-null opaque ref；null 只用于 disabled / blocked placeholder | Member / Images / Runtime / Sandbox adapter registry | launch / session fail-closed 或 blocked |
| carrier availability marker | carrier availability enum only | 不接受 carrier ref、release schema 或 contract body；不得推导 ready | handoff carrier marker seam | handoff blocked / gap；不装配 carrier adapter |
| registration / health | registration mode、heartbeat mode、credential ref、stale threshold | credential 仅 opaque ref；heartbeat 不等于 healthy；threshold 启用时为正 | registration and health entry params | entry/job rejected or unknown |
| publication / feedback | enabled、event family、target、acceptance mode | enabled ⇒ required ref；submitted/delivered/observed/accepted 分层 | publication/handoff adapters | blocked/unknown，不升级 accepted |
| operation jobs | batch、parallelism、retry、timeout、unknown item | batch ≤ safe boundary；parallelism 不绕过 lease/幂等；unknown 只能 hold/reject | frozen job runner params | job rejected |
| safe read / redaction | max page、body mode、query repair、deny list、label allowlist | body-free 固定；deny list 包含 secret/body/manifest 类；不允许高基数标签 | query / logging / diagnostics | startup fail-fast |
| clock / deterministic fixture | clock mode、id mode、fixture enabled/ref | fixture 只能 `ci-test` / `operations-replay`；`local-dev` 不启用，`integration-like` 只走 controlled seam；domain 不自取 clock/id | port adapters + test seed | startup/test/replay fail-fast |

### 8.3 必须通过的 cross-field 规则

| 规则 | 输入 | 校验 | 失败结果 |
|---|---|---|---|
| profile 与 deterministic fixture | `profile.name`, `deterministic_fixture.enabled` | 仅 `ci-test` / `operations-replay` 可启用；`local-dev`、`integration-like` 和 future profile 均不得启用 | startup fail-fast |
| profile 与 availability | profile、各 binding availability | `blocked` / `placeholder` 可存在；fake 不可被标成 ready | config reject |
| logical owner 完整性 | 五个 truth binding | 每个 owner 恰有一个 logical binding；maintenance/projection 不得替代 truth | startup fail-fast |
| enabled ref-bearing binding | availability、binding_ref | enabled / controlled / real-like 需要 opaque ref；null 只能用于 disabled/blocked placeholder；carrier 不属于该 ref-bearing 集合 | startup fail-fast 或 action blocked |
| publication topic | `publication.enabled`、`event_family_ref` | enabled 必须有待确认的 event-family ref；本仓不补 topic schema | startup fail-fast / publication blocked |
| handoff target | `handoff_feedback.enabled`、`target_ref` | enabled 必须有 target ref；target feedback 未知保持 unknown | startup fail-fast / job rejected |
| retention / replay | idempotency、job retry、health/report/replay retention | retention 不得小于所需 duplicate/replay 窗口；具体数值待实施确认 | startup fail-fast |
| batch / page | job batch、safe read max page | batch 必须为正且不超过安全上限；job input 只能降低 | startup fail-fast / job rejected |
| redaction safety | forbidden classes、metric label allowlist | 核心禁止类不可删除；label 只允许低基数安全字段 | startup fail-fast |
| safe body boundary | `safe_read_boundary.body_mode`, `query_write_repair` | 只允许 `body-free` 且 repair 必须 false | config reject |
| raw forbidden material | 所有 string/ref 来源 | 匹配 secret、credential body、external body、manifest、endpoint secret 时直接 reject | source rejected |
| invariant override | 任意来源 | 出现改变执行主语、truth owner、state、metadata、幂等、outbox 或 handoff 层级的 key 时 reject | source rejected |

### 8.4 生效方式矩阵

| 生效方式 | P0 口径 | 适用项 | 失败处理 |
|---|---|---|---|
| `static` | 设计不变量，不是可覆盖配置 | truth owner、state、ProjectMember 主语、Query no-write、Job no-authorization、四层 handoff | 出现 override key 直接 reject |
| `startup` | builder 前加载并冻结，变更需 cold restart | profile、stores、bindings、redaction、publication、clock/id | 无效则不暴露 facade |
| `job-run-start` | 每次 job run 解析后冻结，不能中途改变 | batch、parallelism、retry、timeout、health threshold、target snapshot | 当前 job rejected，保留已提交记录不改写 |
| `entry-local` | 当前 API/worker/jobs invocation 的局部参数 | profile/source selector、job request source、diagnostic selector | 当前 entry rejected |
| `test-entry` / replay run | `ci-test` test harness 或 `operations-replay` 的 fake / fixture 组装 | deterministic fixture、fixed clock/id、failure injection；`integration-like` 仅走 controlled seam | test/replay fail-fast |
| `reload` / `hot` | P0 unsupported | 无 | 配置 key、flag 或调用意图均 rejected；未来需先回写 `03` |

### 8.5 配置域停审记录

| 配置域 | 必填 / 类型 | 交叉校验 | 生效 / 失败 | 结论 |
|---|---|---|---|---|
| identity / stores | 完整、canonical、owner 分离 | profile、store completeness、ref shape | startup fail-fast | 通过（上游 blocker 保留） |
| resolver / ref-bearing lifecycle bindings | availability 与 opaque ref 分离 | profile、enabled target、未闭合合同 | startup assemble；action blocked | 通过（MSVC-UP-001~006 pending） |
| carrier availability marker | 仅 availability enum | carrier contract 未闭合；不适用 ref 条件 | startup marker；handoff blocked / gap | 通过（carrier contract pending） |
| registration / health | mode、credential ref、threshold | heartbeat ≠ healthy、credential 不落 body | startup/job-run-start | 通过（owner / exact contract pending） |
| publication / feedback | enabled、event family、target、acceptance mode | 四层 handoff、topic/ref 条件 | startup 或 job rejected | 通过（MSVC-UP-007 pending） |
| operation jobs | 正整数、非负 retry、unknown mode | batch/page、retention、profile | new-job-run | 通过 |
| safe read / redaction | body-free、deny list、label allowlist | forbidden-body / high-cardinality | startup fail-closed | 通过 |
| clock / fixture | injected port、test-only fixture | profile guard | startup/test-entry | 通过（SDK / product details pending） |

## 9. 对 `03-详细设计.md` 的影响判定

| 配置结论 | 是否影响 03 | 影响类型 | 03 回写位置 | 处理状态 |
|---|---|---|---|---|
| 严格 JSON、canonical key 和 source merge 顺序 | 否 | 配置输入语义 | 不适用 | 无回写 |
| startup → `ValidatedMemberServiceConfig` → builder 暴露 facade | 否 | 承接既有 builder | `03` §13 已有 | 无回写 |
| job-run-start 只生成冻结 run-local 参数 | 否 | entry / job 作用域收窄 | `03` §13、§15 已有 | 无回写 |
| raw secret/body、invariant override 由 loader reject | 否 | 承接既有 redaction / static boundary | `03` §13、§14 已有 | 无回写 |
| P0 不支持 reload / hot | 否 | 生效方式裁剪 | `03` §13 已有 | 无回写 |
| future remote config、admin override、online rotation 或动态 adapter replacement | 是 | builder / Port / error / rollback / observability 新契约 | `03` §5、§7、§12~§15 | future design-change-required；当前不进入 P0 |
| 未来若增加新的 runtime field、constructor 参数或 profile enum | 是 | 代码契约扩展 | 对应对象 / Port / builder 小节 | blocked until 03 回写 |

当前没有 `待回写` 或 `阻塞待确认` 的 P0 配置结论；上游 exact schema 仍以 `pending / blocked / placeholder` 方式承接。

## 10. 回填草稿：正式 `04-配置设计.md` §9

> 校准来源：
> - `design-calibration/04_config_step_09_loading_validation_activation.md`
>
> 延伸阅读：
> - 建议阅读本文件的“配置加载流程图”“配置组加载表”“按配置域组织的加载 / 校验 / 组装表”“cross-field 规则”“生效方式矩阵”和“配置域停审记录”。

正式 §9 应装配严格 JSON 来源合并、parse / type / cross-field / forbidden-body 校验链，`ValidatedMemberServiceConfig` 与 `infra/runtime_builder.rs` 的绑定顺序，startup / job-run-start / entry-local / test-entry 生效矩阵，以及 P0 对 reload / hot 的拒绝规则。正文不得新增 loader API、secret provider API 或 sibling schema。

## 11. 待确认事项

| 事项 | 影响 | 未确认前处理 |
|---|---|---|
| `MSVC-UP-001~004` exact adapter/ref schema | 影响 binding ref 的具体形态和正向 availability | 仅 placeholder / blocked / unknown；loader 只校验 opaque ref shape |
| `MSVC-UP-005` policy owner、`MSVC-UP-006` credential owner | 影响 enabled binding 和 credential ref 生命周期 | fail-closed；不解析或保存 raw material |
| `MSVC-UP-007` Core/Bus route、envelope、receipt | 影响 publication event family 与 target ref 的精确校验 | 保留 topic-neutral ref；不得 shadow schema |
| cursor、durable store、lease/lock、DLQ、observability backend | 影响 retention、retry、job boundary 的具体数值或产品 | 只记录语义和占位 ref，具体值留后续 ADR / 实施门禁 |
| `MSVC-UP-008` SDK target / self-test | 影响 compile seam 与 deterministic fixture 组织 | 不声明编译或自测 ready |

## 12. 自检与停审结论

| 检查项 | 结果 | 说明 |
|---|---|---|
| source merge、strict JSON、canonical key 已固定 | pass | defaults < file < env；JSONC 运行时拒绝 |
| type / range / ref-shape 校验覆盖 Step 7 | pass | 见 §8.1~§8.2 |
| cross-field 校验无孤儿域 | pass | 见 §8.3 |
| startup / job-run-start / entry-local / test-entry 边界明确 | pass | 见 §8.4 |
| hot / reload 无回滚假设 | pass | P0 明确 unsupported |
| raw secret、外部正文和 invariant override fail-closed | pass | 见 §8.3 |
| unresolved sibling contract 未伪装 ready | pass_with_upstream_blockers | `MSVC-UP-001~008` 保持 pending / blocked |
| `03` 影响已判定 | pass | P0 无回写，future 变更需先回写 |
| 正式正文未提前创建 | pass | 仅生成回填草稿 |
| 进入下一步条件 | pass_with_upstream_blockers | 允许进入 Step 10 |

```text
step_09_status = completed / pass_with_upstream_blockers
step_09_gate = pass_with_upstream_blockers
formal_04_write_allowed = false
next_allowed_action = enter_step_10_change_audit_rollback
implementation_allowed = false
test_execution_allowed = false
commit_allowed = false
```
