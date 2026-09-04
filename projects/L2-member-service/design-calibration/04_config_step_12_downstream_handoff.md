# Step 12：定义测试、验收、实施与运维承接

> 对应 SOP：`standards/document/配置设计讨论流程_SOP.md` Step 12
> 回填章节：未来正式 `04-配置设计.md` §12“测试、验收、实施与运维承接”
> 参考粒度：`projects/L1-governance/design-calibration/04_config_step_12_downstream_handoff.md`
> 执行模式：full-restart；本文件只定义下游输入，不创建下游正式文档或执行证据

## 1. Step 状态

| 项目 | 记录 |
|---|---|
| 当前文档 | `04-配置设计.md`（正式文件尚未创建） |
| 当前 Step | Step 12 测试、验收、实施与运维承接 |
| 当前模块 | `downstream_handoff` |
| Step 状态 | `completed / pass_with_upstream_blockers` |
| 输入基线 | Step 6 profile、Step 7 配置项、Step 8 敏感配置、Step 9 加载生效、Step 10 变更回滚、Step 11 失效策略 |
| 正式 `04` 写入 | `false`；只允许 Step 15 装配 |
| 下游文档写入 | `false`；不创建或修改 `05/06/07/09` |
| 实现 / 测试 / 证据 | `false`；本文只定义未来承接要求 |
| commit | `false` |

### 1.1 Step 内计划

- [x] 将 profile、配置项、敏感性、加载和失效策略映射到下游文档输入。
- [x] 区分测试主题、验收门禁、实施任务族和运维承接内容。
- [x] 固定下游不得重定义的配置契约及冲突回流路径。
- [x] 定义配置 evidence 的语义和安全边界，不伪造报告、artifact 或 verdict。
- [x] 完成跨下游承接审计、`03` 影响判定、§12 回填草稿和停审结论。

## 2. 本步目标与边界

本 Step 定义正式 `04-配置设计.md` 完成后，如何把配置契约交给测试、验收、实施和部署运维文档。`04` 是配置真相源；下游只消费并验证，不应在各自文档中产生第二套 key、默认值、优先级、敏感等级或失败语义。

本 Step 不定义：

- 完整测试用例、fixture 内容、脚本路径、测试报告或实际测试结果；
- 完整验收放行流程、签署、verdict、readiness 或 release decision；
- 具体代码文件、commit、排期、实现仓或实施结果；
- 具体部署命令、环境变量真实值、secret provider、容器平台、告警平台或值班 runbook；
- 任何兄弟项目的 exact protocol、endpoint、manifest、policy 或 delivery truth。

下游文档当前仍是旧材料或尚未创建状态；本 Step 的“通过”只表示承接接口已定义，不代表下游已重写或已产生证据。

## 3. 本步输入

| 输入 | 用途 | 状态 |
|---|---|---|
| `04_config_step_06_environment_profiles_matrix.md` | P0/future profile 和依赖组合 | completed |
| `04_config_step_07_config_items.md` | 配置项 schema、默认、来源、作用域和关联模块 | completed |
| `04_config_step_08_sensitive_secrets.md` | sensitive/secret、opaque ref 和 no-output 规则 | completed |
| `04_config_step_09_loading_validation_activation.md` | strict JSON、校验链、activation kind、builder 暴露条件 | completed |
| `04_config_step_10_change_audit_rollback.md` | 变更风险、audit 字段和 rollback 语义 | completed |
| `04_config_step_11_failure_degradation.md` | fail-fast、fail-closed、blocked、degraded、delayed、failed marker | completed |
| `05-测试方案.md`、`06-验收标准.md` | 仅作 historical_material / 承接差异输入 | 旧文档，待后续重写 |
| `07-实施计划.md`、`09-部署与运维手册.md` | 未来承接目标 | 当前未创建 |

## 4. SOP 问题回答

| 问题 | 本仓结论 |
|---|---|
| 哪些配置场景进入测试方案？ | 至少覆盖四个 P0 profile、defaults < JSON file < env、严格 JSON、unknown/duplicate/alias、required/type/range/cross-field、raw secret/body reject、redaction、runtime builder Failed/Ready 边界、job/entry-local 不能覆盖 startup invariant、Query degraded no-write、publisher/handoff failure、不完整 sibling seam、digest drift/rollback target 和 production-like fake rejection。 |
| 哪些配置规则进入验收标准？ | 必须验证无 silent fallback、高优先级非法值不回退、敏感材料不输出、invalid builder 不暴露 facade、enabled route/topic 完整、外部 GRC disabled 不阻断核心、Query degraded 不写、publication/handoff 失败不回滚 Host Truth、P0 不支持 remote/hot/LKG，以及高风险变更有安全审计与回滚输入。 |
| 哪些配置准备进入实施计划？ | `infra/config.rs` 的 schema/strict parser/source merge/validator、`runtime_builder` typed binding、logical store/adapter/fake registry、entry/job validation、redaction issue surface、config audit/metric hooks、`ci-test` / `operations-replay` fixture 组装和配置门禁任务。每项实施必须先通过设计真相源闭环复核。 |
| 哪些部署细节留给运维手册？ | artifact 文件布置和权限、profile 选择、env key 映射、secret provider 实接、restart/rollback 操作、digest 比对、告警阈值、dashboard、runbook、真实 endpoint/topic/DSN、证书和 credential rotation。 |
| 下游不应重复定义什么？ | 配置项名称/类型/默认/来源/作用域、生效方式、敏感级别、禁止输出、failure strategy、profile 语义、topic-neutral key、external GRC truth 边界及 static invariant。发现冲突必须回到 `04`，若改变代码契约则先回写 `03`。 |
| 配置 evidence 是否等于 readiness？ | 不等于。evidence 只证明对应校验或测试动作的结果；不能由日志、fake、adapter `Ok`、局部 receipt 或 submitted marker 推导 ready/healthy/delivered/observed/accepted。 |

## 5. 当前材料诊断

| 位置 | 改动前问题 | 本 Step 修正 |
|---|---|---|
| 旧 `05-测试方案.md` | 配置矩阵粗粒度，未覆盖新版 source/validation/failure 语义 | 只提供新版配置测试主题，不直接改写旧文档 |
| 旧 `06-验收标准.md` | 缺少配置安全、builder 和 digest 门禁 | 提供可判定的配置验收输入，放行由 `06` 决定 |
| `07-实施计划.md` | 当前不存在 | 明确未来 parser/validator/builder/adapter/test 任务族，不生成 commit |
| `09-部署与运维手册.md` | 当前不存在 | 明确部署、secret、restart、rollback、alert 的承接边界 |
| Step 11 | failure 策略已闭合，尚未映射 evidence 和下游 owner | 建立 failure → test/gate/ops 输入映射 |
| 下游真相权 | 可能出现各文档自行补 key 或默认值 | 固定 `04` 单一配置真相源与冲突回流规则 |

## 6. 改动前后对比

| 项目 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 测试承接 | 失效场景散落在各 Step | 形成 profile/source/validation/security/activation/failure 专项输入 | 防止只测 parser happy path |
| 验收承接 | 没有配置 veto 和 evidence 索引 | 固定 no-fallback、no-output、builder、profile、topic、no-write、audit/rollback 门禁 | 让配置结果可判定 |
| 实施承接 | 未定义配置基础设施任务边界 | 明确 schema、loader、validator、builder、adapter、observability 和 gate 任务族 | 防止实现漏掉配置闭环 |
| 运维承接 | 容易把配置设计写成部署命令 | 将真实 artifact、env、secret、restart、alert 留给运维手册 | 保持文档分工 |
| evidence | 可能把测试结果当设计结论 | 只定义 evidence 类型和必须证明的语义 | 不伪造执行结果 |

## 7. 设计取舍

| 议题 | 备选 | 采用结论 |
|---|---|---|
| 是否现在重写 `05/06` | 当前直接修改 / 只提供承接输入 | 只提供承接输入，后续按各自 SOP 重写 |
| 是否现在创建 `07/09` | 由本 Step 顺手创建 / 留给对应文档流程 | 留给对应流程；本仓不越界 |
| 下游能否调整配置 key | 可以自行补充 / 必须回 `04` | 必须回 `04`，改变代码契约时先回 `03` |
| evidence 是否可手工声明通过 | 手工说明足够 / 由可追溯 suite/report/artifact 证明 | 采用可追溯 evidence 要求；当前不生成 evidence |
| external GRC 是否成为核心验收前置 | 是 / disabled 时核心仍可用 | disabled 不阻断核心 Host Truth；enabled 的失败按独立 job marker 处理 |
| 运维是否定义 P0 生产产品 | 在 `04` 锁定 / 留给 `09` 与 ADR | 留给 `09`/ADR；`04` 保持 product-neutral |

## 8. 结构化中间产物

### 8.1 下游承接总表

| 下游文档 / 表面 | 承接内容 | `04` 提供的输入 | 不得做的事 |
|---|---|---|---|
| `05-测试方案.md` | profile、source、strict JSON、validation、sensitive、builder、job/entry、degraded/no-write、publication/handoff failure 测试主题 | Step 6~11 矩阵和失败策略 | 不改配置契约、不把 fake 当真实 readiness |
| `06-验收标准.md` | config schema、no-fallback、no-output、builder、profile isolation、topic completeness、no-write、audit/rollback 门禁 | Step 9~11 结果语义和 evidence 输入 | 不把说明文字当 evidence，不重定义默认值 |
| `07-实施计划.md` | schema/loader/source merge/validator/builder/adapter/fake/entry-job/audit/test 任务族 | Step 7~11 配置边界 | 不先实现后补 schema，不伪造 commit/代码仓 |
| `09-部署与运维手册.md` | artifact、权限、env/profile、secret、restart/rollback、digest、alert/runbook | Step 5/8/10/11 的语义边界 | 不在运维文档改写 owner、state、failure strategy |
| implementation README / local guide | `local-dev` 普通 fake / placeholder、`ci-test` deterministic fixture 的严格 JSON 使用说明 | Step 6/7 示例 | 不带入真实 secret、生产 endpoint 或 sibling body；不把 deterministic fixture 用于 `integration-like` |
| release evidence index | validation、redaction、profile、builder、source priority、topic、job、rollback evidence 索引 | Step 9~11 的证据语义 | 不生成当前 run_id、artifact、report 或 verdict |

### 8.2 `05-测试方案.md` 配置测试承接表

| 测试主题 | 必须覆盖的边界 | 预期 evidence 类型 |
|---|---|---|
| profile matrix | `local-dev` 使用普通 fake / placeholder；`ci-test` / `operations-replay` 可使用各自 fixture；`integration-like` 仅 controlled seam；future profile 拒绝 `deterministic_fixture.*` | profile validation report（未来生成） |
| source priority | defaults < strict JSON file < env；高优先级非法不 fallback | source merge negative report |
| parser/schema | JSONC、尾逗号、unknown section/field、duplicate/alias | parser validation report |
| type/range/cross-field | required、enum、ref shape、topic/target、retention、batch/page、profile compatibility | validation issue report |
| sensitive/no-output | raw secret/body/manifest/endpoint secret reject；日志/错误/trace/report 脱敏 | redaction scan report |
| runtime builder | invalid → `Failed` no facade；valid local assembly → builder boundary 可判定 | builder smoke report（未来生成） |
| entry/job isolation | entry-local/job-run-start 不能改 store、owner、topic、state、metadata 或 invariant | entry/job validation report |
| runtime / sandbox dependency failure | resolver、Member、Images、Runtime、Sandbox unavailable 的 blocked/degraded/delayed 语义 | dependency disposition report |
| carrier / publication / handoff dependency failure | carrier availability marker、publisher、handoff feedback unavailable 的 blocked/delayed/failed marker/gap 语义 | dependency disposition report |
| query/publication | Query degraded no-write；publisher/handoff failure 不回滚 local truth | no-write / handoff report |
| change/rollback | only previous validated artifact；digest drift、过期、无效 rollback target reject | config change/rollback report |

### 8.3 `06-验收标准.md` 配置门禁承接表

| 门禁 | 通过条件 | 失败条件 | 证据输入 |
|---|---|---|---|
| schema gate | P0 sections 通过 strict JSON、type、range、cross-field | unknown/required/invalid 值被接受 | validation report |
| no silent fallback | 高优先级非法来源导致 fail-fast/reject | env/job 非法后使用低优先级值继续 | source negative report |
| sensitive no-output veto | raw secret/body/full sensitive ref 未进入任何输出面 | 日志、error、audit、trace、report 出现敏感正文 | redaction report |
| builder exposure gate | invalid config 不暴露 facade；必要 local binding 完成后才暴露 | partial builder 对外可用 | builder smoke |
| profile isolation gate | P0/future profile 不越界，production-like 不接受 fake/fixture | fake/fixture 被写成生产正向事实 | profile report |
| route/topic completeness | enabled publication key 有完整 binding | 缺 route 仍启动或发布 | topic validation |
| core truth independence | external GRC/handoff disabled 不阻断 core Host Truth | 外围依赖失败回滚或阻塞核心 mutation | command/export comparison |
| degraded no-write | query/read degraded 只返回 marker，不写 source/projection/reference | Query 触发 repair/write | write audit |
| publication/handoff layering | failure 只写 marker/gap/unknown，保留 local truth | submitted 被当 delivered/accepted 或回滚 truth | handoff/outbox evidence |
| change audit/rollback | high-risk 变更有 review/audit/rollback reference，目标已验证 | 无审计、无回滚或使用未验证 artifact | change/rollback evidence |

### 8.4 `07-实施计划.md` 配置实施承接表

| 任务族 | 未来实施内容 | 设计闭环检查 |
|---|---|---|
| local config schema | infra-local typed sections、严格 JSON、unknown field/alias reject | 对齐 Step 7；不进入 public contracts |
| source merge | defaults/file/env 及局部 entry/job 输入 | 对齐 Step 5；高优先级非法不 fallback |
| validation | type/range/ref/cross-field/sensitive/static-boundary validator | 对齐 Step 8/9/11；issue 脱敏 |
| runtime builder | validated config → logical stores/UoW → typed ports/adapters → facade | 对齐 `03` §13；Failed 不暴露 |
| fake/controlled seams | profile-aware availability marker、failure injection、fake parity | 不把 fake/placeholder 当 ready |
| entry / worker / job guard | job-run-start 和 entry-local schema、边界收窄、scope 检查 | 不覆盖 startup invariant 或 authorization |
| audit / telemetry | config digest、validation issue、redacted audit、低基数 metric | 不写 raw config/secret/body |
| configuration tests / gates | 05/06 所列专项和发布前门禁 | 每项回指 04/03 来源 |
| implementation handoff review | 每个配置相关 commit 前做真相源、字段、状态、依赖闭环 | 缺口先回设计，不在实现侧脑补 |

### 8.5 `09-部署与运维手册.md` 运维承接表

| 运维主题 | 未来运维文档承接 | `04` 的边界 |
|---|---|---|
| config artifact | 文件位置、权限、交付、checksum/digest、previous validated artifact | 只定义 strict JSON 和 digest 语义 |
| profile / env | 环境如何选 profile、env key 映射和优先级 | 不写真实环境值 |
| secret provider | 具体 provider、权限、credential rotation/revoke | 只定义 opaque ref 和 no-output |
| startup / restart | 校验、builder 状态、启动失败诊断和重启 | 只定义 activation/failure |
| rollback | 选取已验证 artifact、restart、审计关联 | 不生成 rollback 执行结果 |
| jobs | run-local input、target、batch、retry、rerun 和 partial report | 不改 job authority 或 metadata |
| alert / runbook | 阈值、聚合、pager、人工处理步骤 | 只给安全字段和 failure category |
| evidence archive | validation/redaction/profile/builder/rollback 报告存放 | 不创建当前 artifact/report |
| production hardening | durable store、bus、secret、endpoint、SLO 产品细节 | 留给未来 ADR / 运维文档 |

### 8.6 下游不得重复定义的契约

| 契约 | 唯一真相源 | 下游可做 | 下游不可做 |
|---|---|---|---|
| 配置项 schema/default/source/scope | `04` §7 | 映射测试、实施和运维输入 | 改 key、默认或含义 |
| sensitive/no-output | `04` §8 + `03` 观测边界 | 写 redaction 测试与门禁 | 输出 raw secret/full ref/body |
| activation kind | `04` §9 | 测 startup/job/entry/test | 引入 P0 hot/reload |
| change/audit/rollback | `04` §10 | 检查字段和回滚条件 | 假定具体审批产品、改写 stored result |
| failure/degradation | `04` §11 + `03` error | 写 failure tests/alerts | 把 invalid config 当 degraded success |
| profile semantics | `04` §6 | 准备环境输入 | 让 fixture/fake 越界 |
| topic-neutral event key | `03` + `04` §7/9 | 做 route completeness 检查 | 改 event schema或本地 shadow Core/Bus |
| static owner/state/query/outbox boundary | `03` + `04` §4/9 | 做 negative test/gate | 用 flag 绕过 invariant |

### 8.7 配置 evidence 承接表

| Evidence 类型 | 未来生成来源 | 消费方 | 必须证明 |
|---|---|---|---|
| config validation report | loader/validator suite | `05/06/07/09` | strict JSON、type/range/cross-field 和 redacted issue |
| profile matrix report | profile suite | `05/06` | profile 与 adapter/store/fixture 组合合法 |
| redaction scan | security/test suite | `05/06/09` | 无 raw secret/body/full sensitive ref 输出 |
| builder smoke | integration suite | `05/06/07` | invalid 不暴露 facade；valid 仅证明 local assembly |
| source priority negative | parser/source suite | `05/06` | 高优先级非法不 fallback |
| topic completeness | config validator / outbox suite | `05/06/07` | enabled key route 完整 |
| dependency disposition | adapter integration suite | `05/06/09` | blocked/degraded/delayed/failed marker 语义真实 |
| change audit | release/change process | `06/09` | actor/reason/digest/rollback refs 安全存在 |
| rollback report | operations/release suite | `06/09` | 回滚目标已验证，历史 truth 未被改写 |

### 8.8 下游承接停审记录

| 目标 | 审查项 | 结论 | 当前缺口 |
|---|---|---|---|
| `05` | 测试输入是否覆盖 profile、source、security、activation、failure | 通过 | 旧 `05` 仍待后续重写 |
| `06` | 配置门禁、veto 和 evidence 是否可判定 | 通过 | 旧 `06` 仍待后续重写 |
| `07` | 实施任务族是否覆盖 loader/builder/adapter/test/gate | 通过 | 正式 `07` 尚未创建 |
| `09` | 运维 artifact、secret、restart、rollback、alert 边界 | 通过 | 正式 `09` 尚未创建 |
| 契约所有权 | 下游是否会私自改 key/default/failure | 通过 | 冲突回 `04/03` |
| evidence | 是否避免伪造 run/report/readiness | 通过 | 当前无执行 evidence |

### 8.9 跨下游承接审计表

| 审计项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 是否替 `05` 写完整用例 | 否 | 只定义主题和 evidence 类型 |
| 是否替 `06` 写完整放行流程 | 否 | 只定义配置门禁输入 |
| 是否替 `07` 拆具体 commit | 否 | 只定义任务族和复核要求 |
| 是否替 `09` 写部署命令 | 否 | 只定义运维承接边界 |
| 下游是否可能重定义配置契约 | 不允许 | 冲突必须回 `04`，必要时回 `03` |
| 是否把 fake、receipt、日志或局部 assembly 当 readiness | 不允许 | evidence 与 readiness 严格分层 |
| unresolved sibling 是否被伪造 ready | 不允许 | `MSVC-UP-001~008` 保持 pending/blocked |

## 9. 对 `03-详细设计.md` 的影响判定

| 配置结论 | 是否影响 03 | 影响类型 | 03 回写位置 | 处理状态 |
|---|---|---|---|---|
| 下游只承接 `04` 配置契约，不自行定义 key/default/failure | 否 | 文档治理与追溯 | 不适用 | 无回写 |
| 测试/验收/实施/运维需覆盖 builder、redaction、no-write、handoff 分层 | 否 | 下游输入 | 不适用 | 无回写 |
| evidence 只证明对应动作，不等于 ready/healthy/delivered/accepted | 否 | 承接既有 `03` 观测和 handoff 边界 | `03` §14~§15 已有 | 无回写 |
| 若下游提出新的 hot reload、config center、provider health port 或 runtime builder contract | 是 | runtime / adapter / error / observability 新契约 | `03` §13~§15 | future design-change-required；当前不进入 P0 |

当前没有 P0 `待回写` 或 `阻塞待确认` 的详细设计影响项；下游尚未重写不阻塞 `04` 定稿，但不应被解释为下游已完成。

## 10. 回填草稿：正式 `04-配置设计.md` §12

> 校准来源：
> - `design-calibration/04_config_step_12_downstream_handoff.md`
>
> 延伸阅读：
> - 建议阅读“下游承接总表”“`05` 配置测试承接表”“`06` 配置门禁承接表”“`07` 配置实施承接表”“`09` 运维承接表”“下游不得重复定义的契约”“配置 evidence 承接表”和“跨下游承接审计表”。

正式 §12 应写入下游承接边界、测试主题、验收门禁、实施任务族、运维承接、契约所有权和 evidence 语义。不得把下游未执行的测试、报告、artifact、verdict、signoff 或 readiness 写成现状。

## 11. 待确认事项

| 事项 | 影响 | 未确认前处理 |
|---|---|---|
| `05/06` 新版文档重写时点 | 影响配置测试 / 验收闭环 | 只保留承接表，不修改旧文档 |
| `07` 是否创建及实施边界 | 影响 parser/builder/adapter 的 commit 规划 | 只保留任务族，不生成实现计划 |
| `09` 是否创建及产品选择 | 影响 artifact、secret、告警和 runbook | `04` 保持 product-neutral |
| evidence 的具体载体和路径 | 影响 release gate 与归档 | 只定义 evidence 语义，不生成 artifact/report |
| sibling exact feedback / route | 影响 positive integration tests | 保持 pending / blocked / placeholder |

## 12. 自检与停审结论

| 检查项 | 结果 | 说明 |
|---|---|---|
| `05/06/07/09` 承接内容已分层 | pass | 见 §8.1~§8.5 |
| 下游不得重定义配置契约 | pass | 见 §8.6 |
| evidence 与 readiness 已分离 | pass | 见 §8.7~§8.9 |
| 不代写测试、验收、实施、运维正文 | pass | 仅提供输入与边界 |
| sensitive / forbidden-body 安全边界可承接 | pass | raw secret/body 禁止 |
| unresolved sibling contract 未伪造 ready | pass_with_upstream_blockers | `MSVC-UP-001~008` 持续 pending / blocked |
| `03` 影响已判定 | pass | 当前 P0 无回写，future 需先回写 |
| 正式正文未提前创建 | pass | 仅形成 Step 12 中间产物 |
| 进入下一步条件 | pass_with_upstream_blockers | 允许进入 Step 13 |

```text
step_12_status = completed / pass_with_upstream_blockers
step_12_gate = pass_with_upstream_blockers
formal_04_write_allowed = false
next_allowed_action = enter_step_13_migration_deprecation_evolution
implementation_allowed = false
test_execution_allowed = false
commit_allowed = false
```
