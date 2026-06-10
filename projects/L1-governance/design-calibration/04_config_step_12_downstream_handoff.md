# Step 12. 定义测试、验收、实施与运维承接

> 对应 SOP: `standards/document/配置设计讨论流程_SOP.md` Step 12
> 回填章节: `04-配置设计.md` §12 测试、验收、实施与运维承接

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 12 定义测试、验收、实施与运维承接 |
| 当前状态 | 已完成;待用户审查 |
| 输入基线 | Step 6 环境矩阵;Step 7 配置项清单;Step 8 敏感配置;Step 9 加载校验;Step 10 变更回滚;Step 11 失效模式;测试/验收/实施/运维书写规范 |
| 输出文件 | `projects/L1-governance/design-calibration/04_config_step_12_downstream_handoff.md` |
| 停审方式 | 完成本 Step 后暂停,由用户审查后再进入 Step 13 |

## 2. 本步目标

本 Step 定义正式 `04-配置设计.md` 完成后如何被 `05-测试方案.md`、`06-验收标准.md`、`07-实施计划.md` 和 `09-部署与运维手册.md` 承接。

本 Step 只回答:

- 哪些配置场景必须进入测试方案。
- 哪些配置规则必须成为验收门禁。
- 哪些配置能力需要进入实施计划拆分。
- 哪些部署、启动、排障、回滚和告警细节留给运维手册。
- 下游文档不得重复定义或改变哪些配置契约。

本 Step 不定义:

- 完整测试用例矩阵、测试数据、脚本路径或报告模板。
- 完整验收证据包、release gate 脚本或放行流程。
- 具体实施 commit、代码文件改动或任务排期。
- 部署命令、环境变量真实值、secret provider 产品、告警阈值或 runbook。

## 3. 本步输入

| 输入 | 状态 | 本 Step 用途 |
|---|---|---|
| `04_config_step_06_environment_profiles_matrix.md` | 已完成 | 提供 local-dev、ci-test、integration-like、operations-replay、staging-like、production-like profile 承接 |
| `04_config_step_07_config_items.md` | 已完成 | 提供配置项、默认值、类型、来源、作用域、生效方式和失败策略 |
| `04_config_step_08_sensitive_secrets.md` | 已完成 | 提供 sensitive / secret / redaction / no-output 测试和验收输入 |
| `04_config_step_09_loading_validation_activation.md` | 已完成 | 提供 strict JSON、source merge、validation、runtime builder 和 activation 输入 |
| `04_config_step_10_change_audit_rollback.md` | 已完成 | 提供配置变更审计、评审、rollback 和 previous validated digest 输入 |
| `04_config_step_11_failure_degradation.md` | 已完成 | 提供 fail-fast、fail-closed、degraded、delayed、failed marker 和告警测试切口 |
| `projects/L1-governance/05-测试方案.md` | 旧 / 待复核草案 | 目前只有旧配置矩阵,后续需按新版 `04` 重写配置测试承接 |
| `projects/L1-governance/06-验收标准.md` | 旧 / 待复核草案 | 目前未覆盖新版配置门禁,后续需按新版 `04` 重写配置验收承接 |
| `projects/L1-governance/07-实施计划.md` | 当前不存在 | 后续创建时必须承接配置实现任务和每 commit 设计闭环复核 |
| `projects/L1-governance/09-部署与运维手册.md` | 当前不存在 | 后续创建时必须承接部署、启动、回滚、告警和安全输出规则 |

## 4. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 哪些配置场景进入测试方案? | profile 矩阵、source priority、strict JSON parse、required/type/range/cross-field validation、raw secret reject、redaction deny list、topic binding completeness、external GRC disabled/enabled、job/entry-local override boundary、query degraded no-write、publisher failure no truth rollback、rollback validated digest、config digest drift、no hot/reload、production-like fake rejection 都必须进入 `05` 的配置专项或相关集成测试。 |
| 哪些配置门禁进入验收标准? | 无 silent fallback、无高优先级非法 fallback、无 raw secret/full sensitive ref 输出、runtime builder failed 不暴露 facade、topic map 完整、external GRC disabled 不阻断 core truth、query degraded 不写修复副作用、publisher/handoff failure 不回滚 accepted truth、P0 无 config center/hot reload/online LKG、配置 digest/evidence 可追踪。 |
| 哪些配置准备进入实施计划? | `infra::config` schema/parser/validator、profile loader、source merge、redaction validator、runtime builder injection、adapter registry、entry/job validation、fake/in-memory adapters、config validation issue surface、config audit/log/metric hooks、配置测试和 release gate 都需要进入 `07`。每个配置相关 commit 必须先做设计真相源闭环复核,不闭合则先回设计。 |
| 哪些配置部署细节留给部署与运维手册? | config artifact 布置、环境变量命名、profile selection、secret provider 实接、启动/重启步骤、rollback 操作、config digest 比对、告警阈值、dashboard、runbook、生产 endpoint/topic/DSN、证书和 credential rotation 都留给 `09`。 |
| 下游文档不应重复定义哪些配置契约? | 下游不得重新定义配置项 schema、默认值、source priority、sensitive/no-output 边界、activation kind、failure strategy、forbidden config boundary、profile 语义、outbox topic-neutral key 或 external GRC truth 边界。若发现不一致,必须回到 `04` 或 `03` 修设计,不得在 `05/06/07/09` 私自改口径。 |

## 5. 当前文档问题诊断

| 位置 | 当前问题 | 本 Step 处理 |
|---|---|---|
| `05-测试方案.md` | 旧文档仅有 dev/test/staging 粗粒度配置矩阵,没有新版 Step 1~11 配置失效测试 | 本 Step 给出测试方案承接清单,不直接改写 `05` |
| `06-验收标准.md` | 旧验收聚焦治理主线,缺少配置门禁和 evidence 索引 | 本 Step 给出验收门禁输入,不直接改写 `06` |
| `07-实施计划.md` | 当前不存在 | 本 Step 定义后续实施计划必须承接的配置实现能力 |
| `09-部署与运维手册.md` | 当前不存在 | 本 Step 定义后续运维手册必须承接的部署/回滚/告警内容 |
| 正式 `04` | 尚未创建 | 本 Step 只生成中间产物,正式文档等 Step 15 装配 |

## 6. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 测试承接 | 配置测试散落在 Step 7/9/11 | 明确 `05` 需要承接的配置测试场景 | 防止测试方案只覆盖业务 happy path |
| 验收承接 | `06` 尚未覆盖配置门禁 | 明确配置 release/acceptance gate 输入 | 防止验收证据不证明配置安全 |
| 实施承接 | 还未有 `07` | 明确 parser/validator/builder/adapter/test/gate 任务族 | 防止实施计划漏配置基础设施 |
| 运维承接 | 还未有 `09` | 明确部署、重启、回滚、告警、secret 实接归属 | 防止配置设计写成运维命令 |
| 契约所有权 | 下游可能重新定义配置口径 | 固定下游只能承接,不能改写 `04` 契约 | 保持真相源闭环 |

## 7. 配置设计取舍

| 议题 | 方案 | 取舍 |
|---|---|---|
| 是否现在改写 `05/06` | A. 直接改写;B. 只给正式 `04` 的下游输入 | 采用 B。当前仍在 `04` 校准阶段 |
| 是否创建 `07/09` | A. 本 Step 直接创建;B. 留给后续对应 SOP | 采用 B。本 Step 不替实施/运维手册写正文 |
| 下游能否调整配置项 | A. 可以按测试/运维需要改;B. 不可改配置契约 | 采用 B。变更必须回 `04` 或 `03` |
| 配置测试是否只做 parser 单测 | A. 只测 parser;B. 覆盖 profile/source/sensitive/activation/failure/evidence | 采用 B。配置风险主要在跨字段和运行边界 |
| 验收是否接受手工说明 | A. 可手工说明;B. 必须有 suite/report/artifact evidence | 采用 B。配置门禁需要可追溯证据 |

## 8. 结构化中间产物

### 8.1 下游承接表

| 下游文档 | 承接内容 | 本文提供的输入 |
|---|---|---|
| `05-测试方案.md` | 配置专项测试、profile 矩阵测试、source priority 测试、sensitive/no-output 测试、runtime builder fail-fast 测试、job/entry-local boundary 测试、degraded/no-write 测试 | Step 6 profile;Step 7 items;Step 8 sensitive;Step 9 validation;Step 11 test cuts |
| `06-验收标准.md` | 配置 release gate、no silent fallback veto、secret leak veto、topic completeness gate、runtime builder gate、config digest/evidence gate | Step 9 issue surface;Step 10 audit/rollback;Step 11 failure and alert tables |
| `07-实施计划.md` | config schema/parser/validator、source merge、runtime builder、adapter registry、entry/job validation、config audit/metrics、test and gate commits;每 commit 设计闭环复核 | Step 7 schema inputs;Step 9 activation;Step 11 behavior;设计真相源闭环标准 |
| `09-部署与运维手册.md` | config artifact deployment、profile selection、env key mapping、secret provider binding、restart rollback、digest compare、alert/runbook、credential rotation | Step 5 source priority;Step 8 sensitive;Step 10 rollback;Step 11 alert fields |
| implementation repo docs / README | 本地开发 profile、fake/in-memory config sample、test fixture usage | Step 6 local-dev/ci-test;Step 7 strict JSON examples |
| release evidence index | 配置验证报告、redaction report、profile matrix report、runtime builder smoke、config digest | Step 9 validation issues;Step 11 test cuts;Step 10 audit fields |

### 8.2 `05-测试方案.md` 配置测试承接表

| 测试主题 | 必测场景 | 测试层级 | 证据 |
|---|---|---|---|
| profile matrix | local-dev、ci-test、integration-like、operations-replay 可装配;production-like future fake rejected | contract/integration | profile validation report |
| strict JSON | JSONC comment、trailing comma、unknown section/field reject | unit/contract | parser validation report |
| source priority | defaults < file < env;高优先级非法不 fallback | unit/integration | source merge report |
| required/type/range | missing required、bad enum/type/range、duplicate list item | unit/contract | validation issue report |
| cross-field | topic binding completeness、external GRC enabled requires adapter/target、retention consistency、profile vs adapter mode | unit/integration | cross-field matrix report |
| sensitive/no-output | raw secret/body reject、full sensitive ref 不进 log/audit/report、redaction deny list non-empty | security/unit/integration | redaction report |
| runtime builder | invalid config -> `Failed` no facade;valid config -> `Ready` after adapter registry assembly | integration | runtime builder smoke report |
| entry-local/job-run-start | entry/job 不能覆盖 global store/topic/invariant;invalid input rejected | integration/job tests | entry/job validation report |
| outbox/publisher | missing topic fail-fast;publisher failure only marks publication state,不回滚 truth | integration/job tests | outbox publication report |
| query degraded | projection/reference unavailable 返回 degraded marker,no-write | query integration | repository write audit |
| handoff/external GRC | target disabled job rejected/failed marker;external GRC disabled 不阻断 core truth | job integration | handoff/export report |
| rollback/digest | previous validated digest 可 rollback;unvalidated rollback rejected;digest drift fail-fast | integration/release gate | config digest report |

### 8.3 `06-验收标准.md` 配置门禁承接表

| 验收门禁 | 通过条件 | 失败条件 | 证据 |
|---|---|---|---|
| Config schema gate | 所有 P0 config sections 通过 strict JSON + type/range/cross-field validation | 未知字段、缺必填、非法 enum/range 被接受 | config validation report |
| No silent fallback gate | 高优先级非法值导致 fail-fast/reject | env/job invalid 后使用低优先级值继续 | source priority negative evidence |
| Sensitive no-output gate | raw secret/body/full sensitive ref 不进入 log/error/audit/trace/report | 任何敏感正文出现在 artifact | redaction scan report |
| Runtime builder gate | invalid config 不暴露 facade;valid config assembled with required adapters | partial builder 暴露 service | runtime builder smoke |
| Profile isolation gate | production-like/future profile 不接受 fake/test fixture;operations-replay 只接受脱敏 replay root | fake fixture 进入生产语义 | profile validation evidence |
| Topic completeness gate | enabled outbound event keys 都有 route binding | enabled event 无 topic 仍启动 | topic map validation report |
| External GRC boundary gate | disabled 不阻断 core truth;enabled 缺 adapter/target fail-fast/reject | external GRC disabled 导致核心 command 不可用 | command/export compare |
| Degraded no-write gate | query degraded 不写 repository、不修复 projection/reference | query 触发 mark_stale/rebuild/save state | write audit report |
| Publication failure gate | publisher/handoff/export failure 不回滚 accepted truth | accepted truth 被回滚或 payload 现查现造 | outbox/handoff evidence |
| Config audit/rollback gate | high-risk config 变更有 actor/reason/digest/rollback ref | 高风险变更无审计或无 rollback | config change audit |

### 8.4 `07-实施计划.md` 配置实施承接表

| 实施任务族 | 主要内容 | 设计复核点 |
|---|---|---|
| config schema/contracts | infra-local config structs、strict JSON parser、field defaults、unknown field rejection | 对齐 Step 7;不得把 config 放入 public contracts |
| source merge | defaults/file/env/entry-local/job input merge;priority conflict issue | 对齐 Step 5;invalid high-priority no fallback |
| validation engine | type/range/cross-field/sensitive/static-boundary validators | 对齐 Step 8/9/11;issue redacted |
| runtime builder | validated refs -> store/adapter registry -> application facade | 对齐 `03` Step 14;Failed no facade |
| adapters/fakes | in-memory/fake/controlled adapter states and availability markers | profile matrix and no production fake |
| entry/job validation | API/worker/jobs entry-local and job-run-start validation | job/entry cannot override startup invariant |
| observability/audit | config validation log/metric/audit,redacted diagnostic refs | no raw config/secret/full sensitive ref |
| config tests | unit/integration/job/release gate suites | must cover Step 12 test handoff |
| commit task precheck | 每个配置相关 commit 执行设计真相源闭环复核 | 发现字段/port/flow 不闭合时先回设计,不在实现侧补 schema |

### 8.5 `09-部署与运维手册.md` 运维承接表

| 运维主题 | 运维手册承接内容 | `04` 提供的边界 |
|---|---|---|
| config artifact | 文件位置、发布方式、权限、checksum/digest | strict JSON,redacted digest,previous validated artifact |
| profile selection | 各环境如何选择 profile、禁止项 | Step 6 profile matrix;fake/fixture restrictions |
| environment variables | env key naming、注入方式、优先级说明 | Step 5 priority;high-priority invalid fail-fast |
| secret provider | provider 产品、credential rotation、访问权限 | Step 8 only refs;raw secret not in config/log |
| startup/restart | validation、builder Ready、failure diagnosis、restart sequence | Step 9 activation;Step 11 fail-fast |
| rollback | previous validated config artifact、restart rollback、audit linkage | Step 10 rollback;unvalidated rollback rejected |
| job operation | job-run-start input,scope/page/target validation,retry/rerun | Step 7/9/11 job input boundary |
| alert/runbook | alert thresholds,aggregation,pager,manual repair steps | Step 11 alert safe fields only |
| evidence archive | validation report、redaction report、runtime builder smoke、config digest | Step 12 evidence handoff |
| production hardening | product store/bus/secret provider/topic/endpoint details | `04` P0 stays product neutral;future design required |

### 8.6 下游不得重复定义的配置契约

| 契约 | 真相源 | 下游允许做什么 | 下游不得做什么 |
|---|---|---|---|
| config item schema/default/type/source/scope | `04` Step 7 | 转成测试/实施/运维输入 | 改字段含义或默认值 |
| sensitive/no-output boundary | `04` Step 8 and `03` Step 15 | 写 redaction tests/gates/runbook | 输出 raw secret/full sensitive ref |
| activation kind | `04` Step 9 | 测试 startup/job/entry/test | 引入 hot/reload |
| change audit/rollback | `04` Step 10 | 验收 audit fields and ops rollback | 假定具体 ticket system 或改写 stored report |
| failure/degradation strategy | `04` Step 11 | 写 failure tests and alert handoff | 把非法 config 当 degraded 成功 |
| truth/query/outbox/static boundary | `03` and `04` Step 4 | 写 negative tests/gates | 用配置开关绕过 invariant |
| outbound topic-neutral key | `03` Step 8 and `04` Step 7/9 | 绑定 transport route and test completeness | 改 event kind/payload schema |
| profile semantics | `04` Step 6 | 映射环境部署 | 让 fake/test fixture 进入 production-like |

### 8.7 配置证据承接表

| Evidence | 生成来源 | 消费方 | 必须证明 |
|---|---|---|---|
| config validation report | config validator / release gate | `05/06/07/09` | strict JSON、type/range/cross-field、sensitive validation 结果 |
| profile matrix report | profile validation suite | `05/06` | 每个 P0 profile 的 adapter/store/job/fixture 组合合法 |
| redaction scan report | redaction/security suite | `05/06/09` | raw secret/body/full sensitive ref 未输出 |
| runtime builder smoke | integration startup suite | `05/06/07` | valid config Ready;invalid config Failed no facade |
| source priority negative report | config source tests | `05/06` | high-priority invalid no fallback |
| topic completeness report | outbox config validation | `05/06/07` | enabled event topic-neutral keys complete |
| job validation report | job runner tests | `05/06/07` | job-run-start input cannot override startup invariant |
| config change audit | config change/release process | `06/09` | actor/reason/digest/rollback ref present |
| rollback report | operations/release gate | `06/09` | rollback target validated and restart succeeds |

### 8.8 下游承接停审记录

| 下游目标 | 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|---|
| `05-测试方案.md` | 配置测试输入是否完整且不代写完整用例 | 通过 | 当前 `05` 旧草案需后续按新版 `04` 重写 |
| `06-验收标准.md` | 配置门禁和 evidence 是否明确 | 通过 | 当前 `06` 旧草案需后续补配置门禁 |
| `07-实施计划.md` | 实施任务族和每 commit 设计复核是否明确 | 通过 | 文档当前不存在,后续按实施 SOP 创建 |
| `09-部署与运维手册.md` | 运维承接和禁止写部署命令边界是否明确 | 通过 | 文档当前不存在,后续按运维规范创建 |
| 下游契约边界 | 是否禁止下游重新定义配置契约 | 通过 | 不一致必须回 `04/03` |
| evidence handoff | 是否给出配置证据类型 | 通过 | 具体路径/脚本留 `05/06/07/09` |

### 8.9 跨下游承接审计表

| 审计项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 是否替测试方案写完整用例 | 否 | 只给测试主题和证据输入 |
| 是否替验收标准写完整放行流程 | 否 | 只给门禁输入 |
| 是否替实施计划拆具体 commit | 否 | 只给任务族和复核要求 |
| 是否替运维手册写部署命令 | 否 | 只给运维承接边界 |
| 是否允许下游改写配置契约 | 不允许 | 真相源仍是 `04` 和必要的 `03` |
| 是否覆盖 Step 6/7/11 输入 | 覆盖 | profile/items/failure all mapped |
| 是否需要回写 `03` | 当前无 | 下游承接不改变代码契约 |

## 9. 对详细设计的影响判定

| 配置结论 | 是否影响 03 | 影响类型 | 03 回写位置 | 处理状态 |
|---|---|---|---|---|
| `05/06/07/09` 只能承接配置契约,不得重新定义配置项和 failure strategy | 否 | 文档治理规则 | 不适用 | 无回写 |
| 配置测试必须覆盖 profile/source/sensitive/activation/failure/evidence | 否 | 测试承接 | 不适用 | 无回写 |
| 配置验收必须有 validation/redaction/runtime builder/digest evidence | 否 | 验收承接 | 不适用 | 无回写 |
| 实施计划需为配置相关 commit 增加设计闭环复核 | 否 | 实施计划治理 | 不适用 | 无回写 |
| 运维手册承接真实部署、secret provider、env key、rollback、alert 阈值 | 否 | 运维承接 | 不适用 | 无回写 |
| 若下游要求新增 hot reload、config center、production secret provider health port 或改变 runtime builder contract | 是 | runtime config / builder / adapter / error contract | `03` §13 / §14 / §15 or corresponding calibration Step | 阻塞待确认 |

## 10. 回填草稿

> 校准来源:
> - `design-calibration/04_config_step_12_downstream_handoff.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“下游承接表”“测试方案配置测试承接表”“验收标准配置门禁承接表”“实施计划配置实施承接表”“部署与运维手册承接表”“下游不得重复定义的配置契约”“配置证据承接表”“下游承接停审记录”和“跨下游承接审计表”小节,了解 `04` 如何向 `05/06/07/09` 传递配置契约。

正式 `04-配置设计.md` §12 应回填:

- 下游承接表。
- `05-测试方案.md` 配置测试承接表。
- `06-验收标准.md` 配置门禁承接表。
- `07-实施计划.md` 配置实施承接表。
- `09-部署与运维手册.md` 运维承接表。
- 下游不得重复定义的配置契约。
- 配置证据承接表。
- 下游承接停审记录。
- 跨下游承接审计表。
- 对详细设计的影响判定。

回填要求:

- 不得替测试方案写完整用例。
- 不得替验收标准写完整放行流程。
- 不得替实施计划写具体 commit 排期。
- 不得替运维手册写部署命令或真实 secret/provider/product 参数。
- 必须明确下游不得重定义 `04` 配置契约。
- 不得提前创建正式 `04-配置设计.md`;正式文档只能在 Step 15 装配。

## 11. 待确认事项

| 待确认事项 | 影响 | 当前处理 |
|---|---|---|
| `05-测试方案.md` 何时按新版 `04` 重写 | 影响配置测试矩阵 | 当前只给承接输入 |
| `06-验收标准.md` 何时按新版 `04` 重写 | 影响配置验收门禁 | 当前只给门禁输入 |
| `07-实施计划.md` 是否创建及 commit 边界 | 影响实施排期 | 当前只给任务族和复核要求 |
| `09-部署与运维手册.md` 是否创建及产品选型 | 影响部署/运维细节 | 当前只给运维承接边界 |
| 真实 secret provider、config center、hot reload 是否进入未来版本 | 影响 `03/04/07/09` | 当前 P0 不定义,进入 Step 13/14 风险 |

## 12. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| 下游承接关系明确 | 通过 | 见 §8.1 |
| 配置测试承接明确 | 通过 | 见 §8.2 |
| 配置验收门禁明确 | 通过 | 见 §8.3 |
| 配置实施任务族明确 | 通过 | 见 §8.4 |
| 部署与运维承接明确 | 通过 | 见 §8.5 |
| 下游不得重复定义的配置契约明确 | 通过 | 见 §8.6 |
| 配置 evidence 承接明确 | 通过 | 见 §8.7 |
| 下游承接停审完成 | 通过 | 见 §8.8 |
| 跨下游承接审计没有 unresolved 冲突 | 通过 | 见 §8.9 |
| 对 `03` 的影响判定已记录 | 通过 | 当前无回写 |
| 可进入 Step 13 | 通过 | 下一步定义配置迁移、废弃与演进 |
