# 04 配置设计 Step 12 · 定义测试、验收、实施与运维承接

> 子项目: `L1-identity`
> 目标文档: `04-配置设计.md`
> SOP Step: Step 12 定义测试、验收、实施与运维承接
> 状态: 已写入;等待用户审核

---

## 1. Step 状态

| 项 | 状态 |
|---|---|
| 当前 Step | Step 12 定义测试、验收、实施与运维承接 |
| 当前状态 | 已写入;等待用户审核 |
| 输入基线 | Step 6 environment profiles;Step 7 config items;Step 8 sensitive secrets;Step 9 loading / validation / activation;Step 10 change / audit / rollback;Step 11 failure / degradation;新版正式 `03-详细设计.md` §15~§17 |
| 输出文件 | `projects/L1-identity/design-calibration/04_config_step_12_downstream_handoff.md` |
| 停审方式 | 本 Step 完成后暂停,审核通过后进入 Step 13 migration / deprecation / evolution |

本 Step 定义正式 `04-配置设计.md` 完成后如何被 `05-测试方案.md`、`06-验收标准.md`、`07-实施计划.md` 和后续 `09-部署与运维手册.md` 承接。

本 Step 只回答:

- 哪些配置场景必须进入测试方案。
- 哪些配置规则必须成为验收门禁。
- 哪些配置能力需要进入实施计划拆分。
- 哪些部署、启动、排障、回滚、告警和 secret/provider 细节留给运维手册。
- 下游文档不得重复定义或改变哪些配置契约。
- 下游承接是否改变 `03-详细设计.md` 的 schema、port、state、error、DTO 或 flow。

本 Step 不定义:

- 完整测试用例、TC 编号、测试数据、fixture 路径、CI job、脚本路径或报告模板。
- 完整验收 evidence 包、release gate 脚本、veto 编号、放行流程或签署规则。
- 具体实施 phase / commit boundary、代码文件改动、任务排期或提交计划。
- 部署命令、环境变量真实名称、secret provider 产品、endpoint、告警阈值、dashboard 或 runbook。

## 2. 本步输入

| 输入 | 状态 | 本 Step 用途 |
|---|---|---|
| `04_config_step_06_environment_profiles_matrix.md` | 已审核通过 | 提供 `local-dev`、`ci-test`、`integration-like`、`operations-replay` 和 P1/P2 profile 方向 |
| `04_config_step_07_config_items.md` | 已审核通过 | 提供十二个配置域、配置项、默认值、类型、来源、作用域、生效方式和失败策略 |
| `04_config_step_08_sensitive_secrets.md` | 已审核通过 | 提供 sensitive / secret / forbidden body、ref-only、redaction 和 no-output 测试验收输入 |
| `04_config_step_09_loading_validation_activation.md` | 已审核通过 | 提供 strict JSON、source merge、validation、runtime builder、startup/job/entry/test activation |
| `04_config_step_10_change_audit_rollback.md` | 已审核通过 | 提供配置变更 actor、review、redacted digest、previous validated restart rollback 和 stored surface immutable |
| `04_config_step_11_failure_degradation.md` | 已审核通过 | 提供 fail-fast、fail-closed、reject-run、reject-entry、degraded、delayed、failed marker 和告警测试切口 |
| `03-详细设计.md` §15 | 已完成 | 提供 config/runtime/adapter/observability/redaction 最小测试切口 |
| `03-详细设计.md` §16 | 已完成 | 提供实施计划必须承接详细设计、测试切口和设计闭环审计的规则 |
| `03-详细设计.md` §17 | 已完成 | 提供 `04/05/06/07` 需按新版 `03` 复核或重写的风险 |
| `05-测试方案.md` | 旧 / 待复核草案 | 当前含旧对象、旧环境、旧测试口径;本 Step 只给新版承接输入 |
| `06-验收标准.md` | 旧 / 待复核草案 | 当前含旧对象和旧验收口径;本 Step 只给新版配置门禁输入 |
| `07-实施计划.md` | 旧 / 待复核草案 | 当前早于新版 `03/04`;本 Step 只给新版实施承接输入 |
| `09-部署与运维手册.md` | 当前不存在 | 本 Step 只定义后续运维手册应承接的主题边界 |
| `L1-governance` Step 12 calibration | 参考样式 | 只参考下游承接表粒度,不复用 governance 业务字段 |

## 3. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 哪些配置场景进入测试方案? | profile matrix、source priority、strict JSON parse、required/type/range/ref-shape/cross-field validation、raw secret/body reject、redaction/no-output、runtime builder fail-fast、job-run-start / entry-local override boundary、adapter explicit-disabled、query degraded no-write、publisher/handoff failure no truth rollback、audit compensation、rollback validated digest、config digest drift 都必须进入 `05-测试方案.md`。 |
| 哪些配置门禁进入验收标准? | no silent fallback、high-priority invalid no fallback、no raw secret/body/full sensitive ref output、runtime builder failed no facade、profile isolation、topic binding completeness、degraded no-write、publication/handoff failure no truth rollback、audit compensation enabled、P0 no config center/hot reload/online LKG、config digest/evidence traceability 都必须成为 `06-验收标准.md` 的配置门禁或 veto 输入。 |
| 哪些配置准备进入实施计划? | `identity-infra` config parser/validator、source merge、profile loader、redaction validator、runtime builder injection、adapter registry、entry/job validation、fake/controlled/disabled adapters、config validation issue surface、config log/metric/audit hooks、config test/gate 和每 commit 设计闭环复核都需要进入 `07-实施计划.md`。 |
| 哪些配置部署细节留给部署与运维手册? | config artifact 位置、环境变量名称、secret provider 产品、credential rotation、真实 DB/bus/audit endpoint、证书、启动/重启命令、rollback 操作、config digest 比对、告警阈值、dashboard、runbook 和生产 profile 操作都留给 `09-部署与运维手册.md`。 |
| 下游文档不应重复定义哪些配置契约? | 下游不得重新定义 profile 名称、adapter mode、配置项 schema/default/source/scope、source priority、sensitive/no-output 边界、activation kind、failure strategy、forbidden config boundary、redline guards、topic-neutral binding、query no-write、outbox/handoff no-rollback 或 stored replay immutable 规则。 |

## 4. 当前文档问题诊断

| 位置 | 当前问题 | 本 Step 处理 |
|---|---|---|
| `05-测试方案.md` | 早于新版 `03/04`,仍含旧 command/job、旧环境和旧 mock/stub 口径 | 本 Step 给出新版配置测试承接清单,不直接改写 `05` |
| `06-验收标准.md` | 早于新版 `03/04`,缺新版 profile、config digest、runtime builder 和 redaction 门禁 | 本 Step 给出配置验收门禁输入,不直接改写 `06` |
| `07-实施计划.md` | 早于新版 `03/04`,phase/commit boundary 尚未按新版真相源闭环审计 | 本 Step 给出实施任务族和设计复核点,不直接改写 `07` |
| `09-部署与运维手册.md` | 当前不存在 | 本 Step 只定义后续运维承接边界 |
| 正式 `04` | 尚未装配 | 本 Step 只生成中间产物,正式文档等 Step 15 写入 |

## 5. 改动前后对比

| 项 | 改动前 | 本步后 | 原因 |
|---|---|---|---|
| 测试承接 | 配置测试散落在 Step 6~11 | 明确 `05` 需要承接的配置场景和 evidence 类型 | 防止测试方案只覆盖业务 happy path |
| 验收承接 | `06` 未覆盖新版配置门禁 | 明确配置 release / acceptance gate 输入 | 防止验收证据不证明配置安全 |
| 实施承接 | `07` 仍是旧实施计划 | 明确 parser/validator/builder/adapter/entry/test/gate 任务族 | 防止实施计划漏配置基础设施 |
| 运维承接 | `09` 不存在 | 明确真实部署、secret provider、rollback、alert 留运维 | 防止 `04` 写成部署手册 |
| 契约所有权 | 下游可能重新定义配置口径 | 固定下游只能承接,不能改写 `04/03` 契约 | 保持真相源闭环 |

## 6. 配置设计取舍

| 议题 | 可选方案 | 取舍 |
|---|---|---|
| 是否现在改写 `05/06/07` | A. 直接改写;B. 只给正式 `04` 的下游输入 | 采用 B。当前仍在 `04` 校准阶段 |
| 是否创建 `09` | A. 本 Step 创建;B. 留给部署与运维手册 SOP | 采用 B。本 Step 不替运维手册写正文 |
| 下游能否调整配置项 | A. 可以按测试/运维需要改;B. 不可改配置契约 | 采用 B。变更必须回 `04` 或 `03` |
| 配置测试是否只做 parser 单测 | A. 只测 parser;B. 覆盖 profile/source/sensitive/activation/failure/evidence | 采用 B。配置风险主要在跨字段和运行边界 |
| 验收是否接受手工说明 | A. 可手工说明;B. 必须有 suite/report/artifact evidence | 采用 B。配置门禁需要可追溯证据 |
| 实施计划是否可私补 runtime config type | A. 可按实现需要补;B. 需要 `03` 正式来源 | 采用 B。影响代码契约必须回写 `03` |

## 7. 结构化中间产物

### 7.1 下游承接表

| 下游文档 | 承接内容 | 本文提供的输入 |
|---|---|---|
| `05-测试方案.md` | 配置专项测试、profile matrix 测试、source priority 测试、sensitive/no-output 测试、runtime builder fail-fast 测试、job/entry-local boundary 测试、adapter disabled/degraded 测试、redline negative 测试 | Step 6 profile;Step 7 config items;Step 8 sensitive;Step 9 validation;Step 11 failure test cuts |
| `06-验收标准.md` | 配置 release gate、no silent fallback veto、secret/body leak veto、runtime builder gate、profile isolation gate、topic completeness gate、degraded no-write gate、publication no-rollback gate、config digest/evidence gate | Step 8 no-output;Step 9 issue surface;Step 10 audit/rollback;Step 11 failure and alert tables |
| `07-实施计划.md` | config schema/parser/validator、source merge、runtime builder、adapter registry、entry/job validation、config audit/metrics、test and gate commits;每个配置相关 boundary 必须做设计闭环复核 | Step 7 schema inputs;Step 9 activation;Step 11 behavior;`03` §16 implementation handoff |
| `09-部署与运维手册.md` | config artifact deployment、profile selection、env key mapping、secret provider binding、restart rollback、digest compare、alert/runbook、credential rotation、real endpoint/topic/store product binding | Step 5 source priority;Step 8 sensitive;Step 10 rollback;Step 11 alert fields |
| implementation repo README / local guide | `local-dev` / `ci-test` 启动说明、strict JSON sample、fake fixture usage、config smoke command 入口 | Step 6 local/CI profiles;Step 7 JSON demos;Step 9 strict JSON boundary |
| release evidence index | 配置验证报告、profile matrix report、redaction scan、runtime builder smoke、source priority negative report、config digest | Step 9 validation issues;Step 10 audit fields;Step 11 test cuts |

### 7.2 `05-测试方案.md` 配置测试承接表

| 测试主题 | 必测场景 | 测试层级 | 证据 |
|---|---|---|---|
| profile matrix | `local-dev`、`ci-test`、`integration-like`、`operations-replay` 可判定;future production-like fake rejected | contract/integration | profile validation report |
| strict JSON | JSONC comment、trailing comma、unknown section/field rejected | unit/contract | parser validation report |
| source priority | `defaults < file < env`;高优先级非法不 fallback | unit/integration | source merge negative report |
| required/type/range/ref-shape | missing required、bad enum/type/range/ref、duplicate key/list item | unit/contract | validation issue report |
| cross-field | profile vs fixture、store vs dsn ref、publisher vs topic map、operations replay roots、audit compensation、redline guards | unit/integration | cross-field matrix report |
| sensitive/no-output | raw secret/body rejected、full sensitive ref 不进 log/audit/report/evidence、redaction unsafe rejected | security/unit/integration | redaction scan report |
| runtime builder | invalid config -> `Failed` no facade;valid config -> assembled only after validation | integration | runtime builder smoke report |
| entry-local/job-run-start | entry/job 不能覆盖 global store/topic/redline/static invariant;invalid input rejected | integration/job tests | entry/job validation report |
| adapter disabled/degraded | explicit disabled 不伪造 success;resolver unavailable maps to rejected/degraded/delayed by role | application/integration | adapter outcome report |
| outbox/publisher | missing topic fail-fast;publish failure marks failed/retryable,truth unchanged | integration/job tests | outbox publication report |
| query degraded no-write | projection/reference unavailable returns degraded;no repository write/rebuild/refresh | query integration | repository write audit |
| handoff/report writer | target/report root missing rejected;runtime failure creates formal failed marker/report where flow allows | job integration | handoff/report writer report |
| audit compensation | audit sink unavailable uses compensation/local marker;compensation false fail-fast | observability/integration | audit compensation evidence |
| rollback/digest | previous validated digest can restart rollback;unvalidated rollback rejected;digest drift fail-fast/reject-run | integration/release gate | config digest report |

### 7.3 `06-验收标准.md` 配置门禁承接表

| 验收门禁 | 通过条件 | 阻断条件 | 证据 |
|---|---|---|---|
| Config schema gate | 所有 P0 config sections 通过 strict JSON + known-field + type/range/ref-shape + cross-field validation | 未知字段、缺必填、非法 enum/range 被接受 | config validation report |
| No silent fallback gate | 高优先级非法值导致 fail-fast/reject | env/job invalid 后使用低优先级值继续 | source priority negative evidence |
| Sensitive no-output gate | raw secret/body/full sensitive ref 不进入 log/error/audit/trace/report/evidence | 任何敏感正文出现在 artifact | redaction scan report |
| Runtime builder gate | invalid config 不暴露 facade;valid config assembled with required adapters | partial builder 暴露 API/worker/jobs service | runtime builder smoke |
| Profile isolation gate | test fixture only in local/CI;future production-like 不接受 fake/deterministic override | fake fixture 进入生产语义 | profile validation evidence |
| Topic completeness gate | enabled outbound event keys 都有 topic-neutral binding | enabled event 无 topic 仍启动或发布 | topic map validation report |
| Degraded no-write gate | query degraded 不写 repository、不修复 projection/reference | query 触发 mark stale/rebuild/save state | write audit report |
| Publication/handoff failure gate | publisher/handoff failure 不回滚 accepted truth、不现查现造 payload | accepted truth 被回滚或 payload 由当前 truth 拼出 | outbox/handoff evidence |
| Audit compensation gate | audit sink unavailable 有 compensation/local marker;compensation 不可关闭 | audit sink 失败后静默丢审计 | audit compensation evidence |
| Config audit/rollback gate | high-risk config change 有 actor/reason/digest/rollback ref;rollback target validated | 高风险变更无审计或 rollback 使用未验证 config | config change audit |
| Unsupported activation gate | P0 无 config center、admin override、reload/hot、online LKG | 任一 unsupported source / activation 成功 | activation negative report |

### 7.4 `07-实施计划.md` 配置实施承接表

| 实施任务族 | 主要内容 | 设计复核点 |
|---|---|---|
| prerequisite reading | 开工前阅读新版 `03` §13~§17、`04` Step 1~12、设计真相源闭环标准 | 不得使用旧 `04/05/06/07` 反向约束实现 |
| config schema/contracts | infra-local config shape、strict JSON parser、defaults、known-field rejection | 对齐 Step 7;不得把 runtime config 放入 public contracts/domain |
| source merge | defaults/file/env/entry-local/job input merge;priority conflict issue | 对齐 Step 5;high-priority invalid no fallback |
| validation engine | type/range/ref-shape/cross-field/sensitive/static-boundary validators | 对齐 Step 8/9/11;issue redacted |
| runtime builder | validated refs -> store/adapter registry -> application facade | 对齐 `03` §13;Failed no facade |
| adapters/fakes | in-memory/fake/controlled/disabled adapter states and availability markers | profile matrix and no fake success |
| entry/job validation | API/worker/jobs entry-local and job-run-start validation | job/entry cannot override startup invariant |
| observability/audit | config validation log/metric/audit,redacted diagnostic refs | no raw config/secret/full sensitive ref |
| config tests | unit/integration/job/release gate suites | must cover Step 12 test handoff |
| boundary audit | 每个配置相关 commit 执行设计真相源闭环复核 | 发现字段/port/flow 不闭合时先回设计,不在实现侧补 schema |

### 7.5 `09-部署与运维手册.md` 运维承接表

| 运维主题 | 运维手册承接内容 | `04` 提供的边界 |
|---|---|---|
| config artifact | 文件位置、发布方式、权限、checksum/digest | strict JSON、redacted digest、previous validated artifact |
| profile selection | 各环境如何选择 profile、禁止项、future production-like 操作 | Step 6 profile matrix;fake/fixture restrictions |
| environment variables | env key naming、注入方式、优先级说明 | Step 5 priority;high-priority invalid fail-fast |
| secret provider | provider 产品、credential rotation、访问权限、失败排障 | Step 8 only refs;raw secret not in config/log |
| startup/restart | validation、builder state、failure diagnosis、restart sequence | Step 9 activation;Step 11 fail-fast |
| rollback | previous validated config artifact、restart rollback、audit linkage | Step 10 rollback;unvalidated rollback rejected |
| job operation | job-run-start input、scope/page/target validation、retry/rerun | Step 7/9/11 job input boundary |
| alert/runbook | alert thresholds、aggregation、pager、manual repair steps | Step 11 alert safe fields only |
| evidence archive | validation report、redaction scan、runtime builder smoke、config digest | Step 12 evidence handoff |
| production hardening | product store/bus/secret provider/topic/endpoint details | `04` P0 stays product neutral;future design/ADR required |

### 7.6 下游不得重复定义的配置契约

| 契约 | 真相源 | 下游允许做什么 | 下游不得做什么 |
|---|---|---|---|
| config item schema/default/type/source/scope | `04` Step 7 | 转成测试/实施/运维输入 | 改字段含义、默认值、来源优先级 |
| sensitive/no-output boundary | `04` Step 8 and `03` §14 | 写 redaction tests/gates/runbook | 输出 raw secret、full sensitive ref、external body |
| activation kind | `04` Step 9 | 测试 startup/job/entry/test | 引入 reload/hot/config center/admin override |
| change audit/rollback | `04` Step 10 | 验收 audit fields and ops rollback | 假定具体 ticket system 或改写 stored report |
| failure/degradation strategy | `04` Step 11 | 写 failure tests and alert handoff | 把非法 config 当 degraded 成功 |
| truth/query/outbox/static boundary | `03` and `04` Step 4 | 写 negative tests/gates | 用配置开关绕过 invariant |
| outbound topic-neutral key | `03` §7/§8 and `04` Step 7/9 | 绑定 transport route and test completeness | 改 event kind/payload schema |
| profile semantics | `04` Step 6 | 映射环境部署 | 让 fake/test fixture 进入 production-like |
| stored result/report/receipt immutability | `03` §12/§13 and `04` Step 10 | 写 duplicate replay tests | 通过配置 rollback 改写 stored surface |

### 7.7 配置证据承接表

| Evidence | 生成来源 | 消费方 | 必须证明 |
|---|---|---|---|
| config validation report | config validator / release gate | `05/06/07/09` | strict JSON、known-field、type/range/ref-shape、cross-field、sensitive validation 结果 |
| profile matrix report | profile validation suite | `05/06` | 每个 P0 profile 的 adapter/store/job/fixture 组合合法 |
| redaction scan report | redaction/security suite | `05/06/09` | raw secret/body/full sensitive ref 未输出 |
| runtime builder smoke | integration startup suite | `05/06/07` | valid config assembled;invalid config Failed no facade |
| source priority negative report | config source tests | `05/06` | high-priority invalid no fallback |
| topic completeness report | outbox config validation | `05/06/07` | enabled event topic-neutral keys complete |
| job validation report | job runner tests | `05/06/07` | job-run-start input cannot override startup invariant |
| config change audit | config change/release process | `06/09` | actor/reason/digest/rollback ref present |
| rollback report | operations/release gate | `06/09` | rollback target validated and restart succeeds |

### 7.8 下游文档复核建议表

| 文档 | 当前状态 | 建议后续动作 | 优先级 |
|---|---|---|---|
| `05-测试方案.md` | 旧草案,含旧对象和旧环境口径 | 按新版 `03/04` 重写或复核,加入配置专项测试和 evidence | 高 |
| `06-验收标准.md` | 旧草案,缺新版配置门禁 | 增加 config validation、redaction、profile、runtime builder、digest gate | 高 |
| `07-实施计划.md` | 旧草案,未按新版 detailed design boundary audit | 按新版 `03/04/05/06` 重新做 phase / commit boundary 和设计闭环审计 | 高 |
| `09-部署与运维手册.md` | 当前不存在 | 后续按运维手册 SOP 创建,承接真实部署、secret provider、rollback、alert | 中 |

### 7.9 下游承接停审记录

| 下游目标 | 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|---|
| `05-测试方案.md` | 配置测试输入是否完整且不代写完整用例 | 通过 | 当前 `05` 旧草案需后续按新版 `04` 复核或重写 |
| `06-验收标准.md` | 配置门禁和 evidence 是否明确 | 通过 | 当前 `06` 旧草案需后续补配置门禁 |
| `07-实施计划.md` | 实施任务族和每 commit 设计复核是否明确 | 通过 | 当前 `07` 旧草案需后续重做 boundary 审计 |
| `09-部署与运维手册.md` | 运维承接和禁止写部署命令边界是否明确 | 通过 | 文档当前不存在,后续按运维规范创建 |
| 下游契约边界 | 是否禁止下游重新定义配置契约 | 通过 | 不一致必须回 `04/03` |
| evidence handoff | 是否给出配置证据类型 | 通过 | 具体路径/脚本留 `05/06/07/09` |

### 7.10 跨下游承接审计表

| 审计项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 是否替测试方案写完整用例 | 否 | 只给测试主题和证据输入 |
| 是否替验收标准写完整放行流程 | 否 | 只给门禁输入 |
| 是否替实施计划拆具体 commit | 否 | 只给任务族和复核要求 |
| 是否替运维手册写部署命令 | 否 | 只给运维承接边界 |
| 是否允许下游改写配置契约 | 不允许 | 真相源仍是 `04` 和必要的 `03` |
| 是否覆盖 Step 6~11 输入 | 覆盖 | profile/items/sensitive/loading/change/failure all mapped |
| 是否需要回写 `03` | 当前无 | 下游承接不改变代码契约 |

## 8. 对详细设计的影响判定

| 配置结论 | 是否影响 `03` | 影响类型 | `03` 回写位置 | 处理状态 |
|---|---|---|---|---|
| `05/06/07/09` 只能承接配置契约,不得重新定义配置项和 failure strategy | 否 | 文档治理规则 | 不适用 | 无回写 |
| 配置测试必须覆盖 profile/source/sensitive/activation/failure/evidence | 否 | 测试承接 | 不适用 | 无回写 |
| 配置验收必须有 validation/redaction/runtime builder/digest evidence | 否 | 验收承接 | 不适用 | 无回写 |
| 实施计划需为配置相关 boundary 增加设计闭环复核 | 否 | 实施计划治理 | 不适用 | 无回写 |
| 运维手册承接真实部署、secret provider、env key、rollback、alert 阈值 | 否 | 运维承接 | 不适用 | 无回写 |
| 若下游要求新增 hot reload、config center、production secret provider health port、formal config evidence schema 或改变 runtime builder contract | 是 | runtime config / builder / adapter / error / evidence contract | `03` §13~§15 或对应详细设计校准 Step | 阻塞待确认 |

## 9. 回填草稿

正式 `04-配置设计.md` §12 可回填:

```md
## 12. 测试、验收、实施与运维承接

> 校准来源:
> - `design-calibration/04_config_step_12_downstream_handoff.md`

`05-测试方案.md` 应承接 profile matrix、source priority、strict JSON parse、required/type/range/ref-shape/cross-field validation、raw secret/body reject、redaction/no-output、runtime builder fail-fast、job-run-start / entry-local boundary、adapter disabled/degraded、query degraded no-write、publication failure no truth rollback、audit compensation、rollback digest 和 config drift 测试。

`06-验收标准.md` 应承接 no silent fallback、high-priority invalid no fallback、no raw secret/body/full sensitive ref output、runtime builder failed no facade、profile isolation、topic completeness、degraded no-write、publication/handoff failure no truth rollback、audit compensation enabled、P0 no config center/hot reload/online LKG 和 config digest/evidence traceability 门禁。

`07-实施计划.md` 应承接 config parser/validator、source merge、profile loader、runtime builder injection、adapter registry、entry/job validation、observability/audit hooks、config tests 和每 boundary 设计闭环复核。真实 config artifact 部署、环境变量名称、secret provider 产品、credential rotation、真实 endpoint/topic/store、restart/rollback 命令、告警阈值和 runbook 留给 `09-部署与运维手册.md`。

下游文档不得重新定义 `04` 的配置项 schema/default/source/scope、source priority、sensitive/no-output 边界、activation kind、failure strategy、profile semantics、redline guards、topic-neutral binding、query no-write、outbox/handoff no-rollback 或 stored replay immutable 规则。
```

回填要求:

- 必须保留 SOP 规定的下游承接表。
- 不得替测试方案写完整用例。
- 不得替验收标准写完整 release gate 或 veto 编号。
- 不得替实施计划写具体 commit 排期。
- 不得替运维手册写部署命令或真实 secret/provider/product 参数。
- 不得提前创建正式 `04-配置设计.md`;正式文档只能在 Step 15 装配。

## 10. 待确认事项

| 编号 | 待确认事项 | 影响 | 当前处理 |
|---|---|---|---|
| ID-CONFIG-Q54 | `05-测试方案.md` 何时按新版 `03/04` 复核或重写 | 影响配置测试矩阵和 evidence | 当前只给承接输入;Step 14 汇总风险 |
| ID-CONFIG-Q55 | `06-验收标准.md` 何时按新版 `03/04` 复核或重写 | 影响配置验收门禁 | 当前只给门禁输入;Step 14 汇总风险 |
| ID-CONFIG-Q56 | `07-实施计划.md` 何时完成新版 phase / commit boundary 审计 | 影响实现 agent 开工 | 当前只给任务族和设计复核要求 |
| ID-CONFIG-Q57 | `09-部署与运维手册.md` 是否作为本轮后续文档创建 | 影响真实环境、secret provider 和 rollback 操作 | 当前不阻塞 `04`;真实部署留 09 |
| ID-CONFIG-Q58 | release evidence index 是否需要统一 config digest schema | 影响验收自动化 | 已由 `05` Step 13 / 正式 `05` 和 `06` 基线承接为 run-scoped `meta/config-digest.json` 测试 artifact schema;该 schema 不进入产品配置 DTO / port |
| ID-CONFIG-Q59 | 实现是否需要 formal runtime config/error/evidence type | 影响 `03` 回写 | 当前不新增;实施发现需要时先回写 `03` |

## 11. 进入下一步条件

- 下游承接表已覆盖 `05/06/07/09`。
- 配置测试承接明确。
- 配置验收门禁明确。
- 配置实施任务族明确。
- 部署与运维承接明确。
- 下游不得重复定义的配置契约明确。
- 配置 evidence 承接明确。
- 下游承接停审完成。
- 跨下游承接审计没有 unresolved 冲突。
- 对 `03-详细设计.md` 的影响判定已记录,当前无必须回写项。
- 未提前定义测试编号、验收 veto、实施 commit boundary、部署命令、secret provider 产品、config evidence schema 或 implementation boundary。

下一步进入 Step 13:定义配置迁移、废弃与演进。
