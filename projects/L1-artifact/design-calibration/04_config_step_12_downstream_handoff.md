# Step 12. 定义测试、验收、实施与运维承接

> 对应 SOP: `standards/document/配置设计讨论流程_SOP.md` Step 12
> 回填章节: `04-配置设计.md` §12 测试、验收、实施与运维承接

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 12 定义测试、验收、实施与运维承接 |
| 当前状态 | 已完成;待用户审查 |
| 输入基线 | Step 6 环境矩阵;Step 7 配置项清单;Step 8 敏感配置;Step 9 加载校验;Step 10 变更审计与回滚;Step 11 失效模式;详细设计 Step 14 / Step 15 / Step 16;当前旧 `05/06` 历史材料 |
| 输出文件 | `projects/L1-artifact/design-calibration/04_config_step_12_downstream_handoff.md` |
| 停审方式 | 完成本 Step 后暂停,由用户审查后再进入 Step 13 |

## 2. 本步目标

本 Step 定义正式 `04-配置设计.md` 完成后,如何把当前配置结论稳定交给 `05-测试方案.md`、`06-验收标准.md`、`07-实施计划.md` 和未来的 `09-部署与运维手册.md` 承接。

本 Step 只回答:

- 哪些配置场景必须进入测试方案。
- 哪些配置规则必须成为验收门禁。
- 哪些配置能力需要进入实施计划。
- 哪些部署、启动、回滚、告警与运维细节留给运维手册。
- 下游文档不得重新定义或改写哪些配置契约。

本 Step 不定义:

- 完整测试用例矩阵、测试数据、CI job 名称或报告模板。
- 完整验收放行流程、审批流或 release 命令。
- 具体实施 commit、实现边界、代码文件改动或排期。
- 真实部署命令、环境变量值、secret provider 产品、告警阈值或 runbook。

## 3. 本步输入

| 输入 | 状态 | 本 Step 用途 |
|---|---|---|
| `04_config_step_06_environment_profiles_matrix.md` | 已完成 | 提供 `local-dev`、`ci-test`、`integration-like`、`operations-replay` 的正式 profile 语义 |
| `04_config_step_07_config_items.md` | 已完成 | 提供配置项、默认值、类型、来源、作用域、生效方式和失败策略 |
| `04_config_step_08_sensitive_secrets.md` | 已完成 | 提供 sensitive / secret / no-output / redaction 边界 |
| `04_config_step_09_loading_validation_activation.md` | 已完成 | 提供 strict JSON、source merge、validator、builder、startup / entry / job / test activation 口径 |
| `04_config_step_10_change_audit_rollback.md` | 已完成 | 提供高风险变更审计字段、rollback target 和 previous validated digest 口径 |
| `04_config_step_11_failure_degradation.md` | 已完成 | 提供 fail-fast、fail-closed、degraded、delayed、failed marker 和告警规则 |
| `03_ddd_step_14_config_external_binding.md` | 已完成 | 提供 runtime builder、adapter registry、fake / controlled seam 和禁止配置化边界 |
| `03_ddd_step_15_observability_audit.md` | 已完成 | 提供日志、指标、审计、redaction 和 forbidden output 约束 |
| `03_ddd_step_16_test_cuts.md` | 已完成 | 提供最小测试切口和 config / adapter / degraded / replay 测试主轴 |
| `projects/L1-artifact/05-测试方案.md` | 旧正式草案 / 历史材料 | 用于识别旧 `dev/test/staging` 口径和缺失的配置专项测试 |
| `projects/L1-artifact/06-验收标准.md` | 旧正式草案 / 历史材料 | 用于识别缺失的配置门禁和 evidence 输入 |
| `projects/L1-governance/design-calibration/04_config_step_12_downstream_handoff.md` | 已参考 | 提供 Step 12 粒度框架,本文件按 Artifact 语义重写 |

## 4. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 哪些配置场景进入测试方案? | `05` 必须承接 profile 矩阵、source priority、strict JSON parse、required/type/range/cross-field validation、raw secret reject、redaction deny list、runtime builder fail-fast、entry/job override boundary、topic binding completeness、query degraded no-write、relay / handoff failure no truth rollback、rollback target validation、config digest drift 和 operations-replay 恢复场景。 |
| 哪些配置门禁进入验收标准? | `06` 必须把 no silent fallback、no raw secret/full sensitive ref output、invalid config no facade、enabled topic map completeness、query degraded no-write、relay / handoff failure 不回滚 truth、rollback target validated、P0 无 config center / hot reload / online last-known-good 作为明确门禁。 |
| 哪些配置准备进入实施计划? | `07` 必须承接 strict JSON parser、source merge、validator、runtime builder、adapter registry、entry/job validation、redaction hooks、config evidence suite 和 config-related commit 的设计闭环复核。 |
| 哪些配置部署细节留给部署与运维手册? | `09` 承接 config artifact 布置、profile 选择、env key 命名、secret provider 接入、启动/重启步骤、rollback drill、digest compare、alerts/runbook、credential rotation 和 evidence archive。 |
| 下游文档不应重复定义哪些配置契约? | 下游不得重定义字段 schema、默认值、source priority、profile 语义、sensitive/no-output 边界、activation kind、failure strategy、topic-neutral key、truth/query/handoff boundary 或 runtime builder contract。若不一致,必须回到 `04` 或必要的 `03` 重新校准。 |

## 5. 当前文档问题诊断

| 位置 | 当前问题 | 本 Step 处理 |
|---|---|---|
| `05-测试方案.md` | 仍使用旧 `dev/test/staging` 环境语义,未覆盖当前四个 P0 profile、strict JSON、redaction、config evidence | 本 Step 只给 `05` 的配置测试承接表,不直接改写旧 `05` |
| `06-验收标准.md` | 仍聚焦 artifact 主语/版本/基线真相,缺配置 gate 和 config evidence | 本 Step 给出配置验收门禁输入,不直接改写旧 `06` |
| `07-实施计划.md` | 当前不存在 | 本 Step 明确后续 `07` 必须承接的配置实施任务族 |
| `09-部署与运维手册.md` | 当前不存在 | 本 Step 明确后续 `09` 必须承接的运维边界和非正文事项 |
| 当前 `04` | 尚未装配正式文档 | 本 Step 只生成承接关系和输入清单,不替下游文档写正文 |

## 6. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 测试承接 | 配置测试散落在 Step 7 / 9 / 11 | 汇总成 `05` 的配置测试承接表 | 防止测试方案只覆盖业务 happy path |
| 验收承接 | 旧 `06` 无配置 gate | 增加 `06` 配置门禁承接表 | 防止 release gate 不能证明配置安全 |
| 实施承接 | `07` 缺失 | 明确 `07` 必需的任务族和设计复核点 | 防止 parser / validator / builder 被遗漏 |
| 运维承接 | `09` 缺失 | 明确 `09` 只承接部署 / 重启 / 回滚 / 告警 / credential rotation | 防止 `04` 写成运维手册 |
| 契约所有权 | 下游可能私改配置口径 | 固定下游只能承接,不能改真相源 | 保持 `04` / `03` 闭环 |

## 7. 配置设计取舍

| 议题 | 方案 | 取舍 |
|---|---|---|
| 是否现在重写 `05/06` | A. 当前直接改写;B. 先只给下游输入 | 采用 B。当前仍在 `04` 校准链 |
| 是否创建 `07/09` | A. 本 Step 直接创建;B. 留给对应文档链 | 采用 B。本 Step 只交代承接 |
| 下游能否调整配置契约 | A. 可按测试/运维需要调整;B. 不可改写 `04` 契约 | 采用 B。任何冲突都必须回 `04/03` |
| 测试承接是否只写 parser | A. 只写 parser;B. 覆盖 profile/source/sensitive/activation/failure/evidence | 采用 B。配置风险主要在跨字段和运行边界 |
| 运维承接是否包含命令 | A. 写具体部署命令;B. 只定义运维主题和边界 | 采用 B。命令和真实值不在 `04` |

## 8. 结构化中间产物

### 8.1 下游承接表

| 下游文档 | 承接内容 | 本文提供的输入 |
|---|---|---|
| `05-测试方案.md` | 配置专项测试、profile 矩阵、source priority、strict JSON、sensitive/no-output、builder fail-fast、job/entry boundary、degraded/no-write、rollback/digest、operations-replay | Step 6 / 7 / 8 / 9 / 10 / 11;`03` Step 16 |
| `06-验收标准.md` | 配置 release gate、invalid config veto、no secret leak veto、topic completeness gate、builder gate、degraded/no-write gate、rollback validated gate | Step 9 issue surface;Step 10 audit / rollback;Step 11 failure / alert |
| `07-实施计划.md` | parser / merge / validator / builder / adapter registry / observability hooks / config evidence / design closure precheck | Step 7 / 9 / 11;`03` Step 14 / Step 15 |
| `09-部署与运维手册.md` | config artifact、profile 选择、env 映射、secret provider 接入、restart rollback、digest compare、alert/runbook、evidence retention | Step 5 / 8 / 10 / 11 |
| implementation README / local docs | `local-dev` / `ci-test` 用法、strict JSON sample、fixture / replay 入口说明 | Step 6 / 7 |

### 8.2 `05-测试方案.md` 配置测试承接表

| 测试主题 | 必测场景 | 测试层级 | 证据 |
|---|---|---|---|
| profile matrix | `local-dev`、`ci-test`、`integration-like`、`operations-replay` 各自装配合法 | contract / integration | profile matrix report |
| source priority | `defaults < file < env`;高优先级非法不 fallback | unit / integration | source priority report |
| strict JSON | JSONC comment、trailing comma、unknown field/section reject | unit / contract | parser validation report |
| required/type/range | missing required、bad enum/type/range、duplicate list item | unit / contract | validation issue report |
| cross-field | topic completeness、handoff feature/topic relation、retention consistency、profile vs mode | unit / integration | cross-field matrix report |
| sensitive/no-output | raw secret/body reject、full sensitive ref 不进 log/audit/report、redaction deny list non-empty | security / integration | redaction scan report |
| runtime builder | invalid config -> `Failed` no facade;valid config -> `Ready` after registry assembly | integration | runtime builder smoke |
| entry/job boundary | entry-local / current job run 不能覆盖 startup invariant | integration / job | entry-job validation report |
| query degraded | projection/reference unavailable -> degraded no-write | query integration | query no-write evidence |
| relay / handoff failure | publish / handoff failure 只写 marker / report,truth unchanged | integration / job | outbox-handoff report |
| rollback / digest | previous validated digest 可 rollback;unvalidated target rejected;digest drift blocks startup | integration / release gate | rollback and digest report |
| operations-replay | replay root required、去标识化、report replay、partial failure 和 no truth repair | integration / ops replay | replay evidence report |

### 8.3 `06-验收标准.md` 配置门禁承接表

| 验收门禁 | 通过条件 | 失败条件 | 证据 |
|---|---|---|---|
| Config schema gate | 所有 P0 config sections 通过 strict JSON + type/range/cross-field/sensitive validation | 未知字段、缺必填、非法 range 被接受 | config validation report |
| No silent fallback gate | 高优先级非法 source 直接失败 | 非法 env/job 值回退到低优先级继续运行 | negative source report |
| Sensitive no-output gate | raw secret/body/full sensitive ref 不进入 log/error/audit/trace/report | 任一输出面泄露敏感正文 | redaction scan report |
| Runtime builder gate | invalid config 不暴露 facade;valid config only `Ready` after full assembly | partial builder 暴露 services | runtime builder smoke |
| Profile isolation gate | fixture/replay 只进入允许 profile;future production-like fake not accepted | fake / fixture 进入非测试语义 | profile validation evidence |
| Topic completeness gate | enabled outbound keys 全部有 route binding | enabled event 缺 binding 仍启动 | topic completeness report |
| Degraded no-write gate | query degraded 不修复 projection/reference,不写 repo | degraded query 产生副作用写入 | write audit evidence |
| Relay / handoff immutability gate | publish / handoff failure 不回滚 accepted truth | accepted truth 被回滚或现查现造 payload | outbox / handoff evidence |
| Rollback validated gate | rollback target 必须是 previous validated digest / input | 未验证目标被允许回滚 | rollback drill report |
| Unsupported feature gate | P0 无 config center / hot reload / online LKG / secret provider runtime reload | 下游以 P0 名义要求这些能力 | acceptance checklist |

### 8.4 `07-实施计划.md` 配置实施承接表

| 实施任务族 | 主要内容 | 设计复核点 |
|---|---|---|
| config schema and parser | infra-local config structs、strict JSON parser、unknown field reject | 对齐 Step 7;不得进入 public contracts |
| source merge pipeline | defaults/file/env/entry-local/job input merge 和 conflict issue | 对齐 Step 5;invalid high-priority no fallback |
| validation engine | type/range/cross-field/sensitive/static-boundary validators | 对齐 Step 8 / 9 / 11;issue redacted |
| runtime builder | validated refs -> store / adapter registry -> `Ready` facade | 对齐 `03` Step 14;`Failed` no facade |
| fake and controlled adapters | local-dev / ci-test / integration-like / operations-replay 所需 fake / controlled / replay-backed states | 对齐 Step 6;no production-like fake |
| entry and job validation | current entry / current job run validation and reject surface | 不得覆盖 startup invariant |
| observability and audit hooks | config validation log/metric/audit,redacted diagnostic refs | 对齐 `03` Step 15;no raw config/secret |
| config evidence suite | parser/validator/builder/redaction/digest/replay test suites | 覆盖 Step 12 测试与验收输入 |
| commit precheck | 每个配置相关 commit 先做设计真相源闭环复核 | 若 schema / builder / flow 未闭合,先回设计不在实现侧补 |

### 8.5 `09-部署与运维手册.md` 运维承接表

| 运维主题 | 运维手册承接内容 | `04` 提供的边界 |
|---|---|---|
| config artifact | 文件位置、发布方式、权限、checksum / digest | strict JSON,redacted digest,previous validated artifact |
| profile selection | 环境如何选择 `local-dev` / `ci-test` / `integration-like` / `operations-replay` | Step 6 profile matrix |
| environment variables | env key naming、注入方式、优先级和冲突说明 | Step 5 source priority |
| secret provider | provider 产品、credential rotation、访问权限、break-glass 流程 | Step 8 only refs;raw secret not in config/output |
| startup / restart | validation、builder `Ready`、failed diagnosis、restart sequence | Step 9 activation;Step 11 fail-fast |
| rollback | previous validated digest、restart rollback、audit linkage | Step 10 rollback;unvalidated rollback rejected |
| operations replay | replay root、replay input、evidence archive、rerun boundary | Step 6 / 7 / 11 replay rules |
| alert / runbook | thresholds,aggregation,pager,manual repair | Step 11 alert safe fields only |
| evidence retention | validation report、redaction report、builder smoke、digest report | Step 12 evidence handoff |

### 8.6 下游不得重复定义的配置契约

| 契约 | 真相源 | 下游允许做什么 | 下游不得做什么 |
|---|---|---|---|
| config item schema/default/type/source/scope | `04` Step 7 | 转成测试 / gate / 运维输入 | 改字段含义或默认值 |
| profile semantics | `04` Step 6 | 映射测试 / 环境 / 运维场景 | 把旧 `dev/test/staging` 当当前真相源 |
| sensitive/no-output boundary | `04` Step 8 and `03` Step 15 | 写 redaction tests / gates / runbook | 输出 raw secret/full sensitive ref |
| activation kind | `04` Step 9 | 测 startup / entry / job / test | 引入 hot reload 或 online LKG |
| change audit / rollback | `04` Step 10 | 承接审计字段和 rollback drill | 改写 stored result / report 语义 |
| failure strategy | `04` Step 11 | 写 negative tests、acceptance gate、alert handoff | 把非法 config 当 degraded success |
| runtime builder contract | `03` Step 14 and `04` Step 9 | 写 builder smoke 和 ops check | 在下游私造半装配 facade |
| topic-neutral key and core boundaries | `03` Step 8 and `04` Step 7 / 9 | 做 route binding 和 completeness test | 改 event kind/payload schema |

### 8.7 配置证据承接表

| Evidence | 生成来源 | 消费方 | 必须证明 |
|---|---|---|---|
| config validation report | validator / release gate | `05/06/07/09` | strict JSON、type/range/cross-field/sensitive validation 结果 |
| profile matrix report | profile suite | `05/06` | 四个 P0 profile 的装配与隔离语义 |
| source priority negative report | merge tests | `05/06` | high-priority invalid no fallback |
| redaction scan report | security suite | `05/06/09` | no raw secret/body/full sensitive ref output |
| runtime builder smoke | startup integration suite | `05/06/07` | valid config `Ready`;invalid config `Failed` |
| topic completeness report | config validation / relay suite | `05/06/07` | enabled outbound keys complete |
| entry-job validation report | entry/job tests | `05/06/07` | current entry / job cannot override startup invariant |
| rollback drill report | release / ops drill | `06/09` | rollback target validated and restart succeeds |
| operations-replay report | replay suite | `05/06/09` | replay root policy、report replay、partial failure、no truth repair |

### 8.8 下游承接停审记录

| 下游目标 | 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|---|
| `05-测试方案.md` | 配置测试输入是否完整且不代写完整用例 | 通过 | 旧 `05` 需后续按新版 `04` full-restart |
| `06-验收标准.md` | 配置门禁和 evidence 是否明确 | 通过 | 旧 `06` 需后续补配置 release gate |
| `07-实施计划.md` | 任务族和 design closure precheck 是否明确 | 通过 | 文档当前不存在,后续按实施链创建 |
| `09-部署与运维手册.md` | 运维承接和不写部署命令边界是否明确 | 通过 | 文档当前不存在,后续按运维链创建 |
| 下游契约边界 | 是否禁止下游私改真相源 | 通过 | 不一致必须回 `04/03` |
| evidence handoff | 是否给出配置证据类型 | 通过 | 具体脚本路径留后续文档链 |

### 8.9 跨下游承接审计表

| 审计项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 是否替测试方案写完整用例 | 否 | 只给测试主题、层级和证据 |
| 是否替验收标准写完整放行流程 | 否 | 只给门禁输入 |
| 是否替实施计划拆具体 commit | 否 | 只给任务族和复核点 |
| 是否替运维手册写部署命令 / 真实值 | 否 | 只给运维主题和边界 |
| 是否允许下游改写配置契约 | 不允许 | 真相源仍是 `04` 和必要的 `03` |
| 是否覆盖 Step 6 / 7 / 11 输入 | 覆盖 | profile / items / failure all mapped |
| 是否保留旧 `05/06` 为当前真相源 | 否 | 只作为历史材料和差异审计输入 |
| 是否需要回写 `03` | 当前无 | 下游承接不改变代码契约 |

## 9. 对详细设计的影响判定

| 配置结论 | 是否影响 03 | 影响类型 | 03 回写位置 | 处理状态 |
|---|---|---|---|---|
| `05/06/07/09` 只能承接配置契约,不得重新定义字段 / source / failure strategy | 否 | 文档治理规则 | 不适用 | 无回写 |
| 配置测试必须覆盖 profile/source/sensitive/activation/failure/evidence | 否 | 测试承接 | 不适用 | 无回写 |
| 配置验收必须有 validation / redaction / builder / digest evidence | 否 | 验收承接 | 不适用 | 无回写 |
| 配置实施必须包含 design closure precheck | 否 | 实施治理 | 不适用 | 无回写 |
| 运维手册承接真实部署、provider、rollback、alerts,但不改变 runtime builder contract | 否 | 运维承接 | 不适用 | 无回写 |
| 若下游要求新增 hot reload、config center、provider runtime health contract 或改 runtime builder | 是 | runtime config / builder / adapter / error contract | `03` Step 12 / Step 14 / Step 15 | 阻塞待确认 |

## 10. 回填草稿

> 校准来源:
> - `design-calibration/04_config_step_12_downstream_handoff.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“下游承接表”“`05-测试方案.md` 配置测试承接表”“`06-验收标准.md` 配置门禁承接表”“`07-实施计划.md` 配置实施承接表”“`09-部署与运维手册.md` 运维承接表”“下游不得重复定义的配置契约”“配置证据承接表”和“跨下游承接审计表”小节。

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

- 不得替 `05` 写完整用例。
- 不得替 `06` 写完整放行流程。
- 不得替 `07` 写具体 commit 排期。
- 不得替 `09` 写部署命令、真实 env 值或真实 secret/provider 参数。
- 必须明确旧 `05/06` 不是当前配置真相源。
- 正式 `04-配置设计.md` 仍需等 Step 15 装配。

## 11. 待确认事项

| 待确认事项 | 影响 | 当前处理 |
|---|---|---|
| 旧 `05-测试方案.md` 何时按新版 `04` full-restart | 影响配置测试矩阵 | 当前只给承接输入 |
| 旧 `06-验收标准.md` 何时按新版 `04` full-restart | 影响配置 release gate | 当前只给承接输入 |
| `07-实施计划.md` 何时建立 | 影响配置实现任务拆分 | 当前只记录任务族 |
| `09-部署与运维手册.md` 何时建立 | 影响运维 runbook 和 provider 接入 | 当前只记录边界 |

## 12. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| 下游承接关系已明确 | 通过 | 见 §8.1 |
| `05/06/07/09` 的配置输入边界已明确 | 通过 | 见 §8.2 ~ §8.5 |
| 下游不得重定义的配置契约已明确 | 通过 | 见 §8.6 |
| 配置证据 handoff 已明确 | 通过 | 见 §8.7 |
| 下游承接停审和跨文档审计已完成 | 通过 | 见 §8.8 / §8.9 |
| 对 `03` 的影响判定已记录 | 通过 | 当前无回写 |
| 可进入 Step 13 | 通过 | 下一步定义配置迁移、废弃与演进 |
