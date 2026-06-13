# Step 6. 定义环境、部署 profile 与配置矩阵

> 对应 SOP: `standards/document/配置设计讨论流程_SOP.md` Step 6
> 回填章节: `04-配置设计.md` §6 环境、部署 profile 与配置矩阵

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 6 定义环境、部署 profile 与配置矩阵 |
| 当前状态 | 已完成;待用户审查 |
| 输入基线 | Step 3 控制面;Step 4 分类边界;Step 5 来源优先级;新版 `00/01/02/03`;旧 `05/06` 方向输入 |
| 输出文件 | `projects/L1-governance/design-calibration/04_config_step_06_environment_profiles_matrix.md` |
| 停审方式 | 完成本 Step 后暂停,由用户审查后再进入 Step 7 |

## 2. 本步目标

本 Step 定义 `L1-governance` 的环境 / profile 名称、用途、配置来源、外部依赖、敏感配置处理和测试 / 验收承接差异。

本 Step 只回答:

- local / CI / integration / replay / staging / production-like 是否适用。
- 每个环境 / profile 的配置来源是什么。
- 每个 profile 依赖哪些外部服务或 fake / disabled adapter。
- 敏感配置在不同 profile 中如何处理。
- 哪些 profile 差异影响测试方案、验收标准和实施计划。

本 Step 不定义具体配置项、JSON schema、环境变量名、secret provider API、真实 DB / bus / search / external GRC 产品、部署命令、证书安装、容量 sizing 或生产 runbook。

## 3. 本步输入

| 输入 | 状态 | 本 Step 用途 |
|---|---|---|
| `04_config_step_03_control_plane.md` | 已完成 | 提供 environment / profile matrix 控制面和各配置域 |
| `04_config_step_04_categories_boundaries.md` | 已完成 | 提供 startup / job-run-start / entry-local 更新边界和 P0 无 hot update |
| `04_config_step_05_sources_priority_conflicts.md` | 已完成 | 提供 `defaults < file < env` 普通来源规则、secret refs 和 test fixture 边界 |
| `03_ddd_step_14_config_external_binding.md` | 已完成 | 提供 P0 in-memory / fake / deterministic adapter 默认口径和外部依赖 fake / disabled 策略 |
| `03-详细设计.md` §13 / §17 | 已完成 | 提供 runtime adapter availability、P0 fake、真实 adapter 后续接入和产品未锁定风险 |
| 旧 `05-测试方案.md` / `06-验收标准.md` | 旧 / 待复核方向输入 | 只承接测试 / staging 方向,不继承旧对象名、旧产品或旧验收矩阵 |

## 4. SOP 问题回答

| 问题 | 回答 |
|---|---|
| local / CI / test / staging / prod 分别是否适用? | P0 正式 profile 为 `local-dev`、`ci-test`、`integration-like`、`operations-replay`。`staging-like` 和 `production-like` 只作为 P1/P2 方向,当前不作为 P0 必过 profile,不得阻塞核心 truth center 落地。 |
| 每个环境配置来源是什么? | P0 profile 都遵守 Step 5 普通来源 `code defaults < config file < environment variables`。entry-local 只选择当前入口 / job。`local-dev` 可只用 defaults;`ci-test` 使用 test config file + CI env + fixture;`integration-like` 使用 config file + env refs;`operations-replay` 使用 replay config file + job input / report refs。 |
| 每个环境依赖哪些外部服务? | `local-dev` 和 `ci-test` 不依赖真实外部服务,使用 in-memory store、fake resolver、fake publisher、fake handoff、disabled external GRC。`integration-like` 允许 real-like / controlled seam,但仍不把 sibling repo 加入 Cargo。`operations-replay` 使用脱敏历史 state / outbox / report refs。`staging-like` / `production-like` 后续才接真实 durable store、bus、secret provider、external endpoints。 |
| 敏感配置在不同环境如何处理? | 所有 profile 都禁止 raw secret / raw token / raw body。`local-dev` / `ci-test` 只使用 fake ref 或 fixture ref。`integration-like` / `operations-replay` 可使用 credential / endpoint / handoff target ref,但 raw material 由后续 Step 8 定义。`production-like` 只允许 secret provider ref,不在 P0 定义 raw material。 |
| 哪些环境差异会影响测试和验收? | `ci-test` 提供 deterministic unit / service / fake integration evidence。`integration-like` 验证 adapter unavailable / degraded / no fake fallback / topic completeness / handoff failed marker。`operations-replay` 验证 duplicate replay、idempotency retention、outbox retry、projection rebuild、reference refresh、reconciliation 和 handoff/export reports。`staging-like` / `production-like` 的真实外部依赖验收留 P1/P2。 |

## 5. 当前文档问题诊断

| 位置 | 当前问题 | 本 Step 处理 |
|---|---|---|
| Step 5 来源规则 | 已定义来源优先级,但未按 profile 组合 | 本 Step 定义每个 profile 的来源组合 |
| `03` §17 风险 | durable DB / broker / search / HTTP 和 external GRC 未锁定 | 本 Step 保持 P0 fake / disabled,将真实产品留 P1/P2 |
| Step 14 默认口径 | 写 `local` / fixture profile,但未形成正式 profile 矩阵 | 本 Step 固定 P0 profile 名称和用途 |
| 旧 `05/06` | 可能含旧 test / staging 矩阵和旧产品假设 | 本 Step 只保留方向,不继承旧产品或旧对象主线 |
| sensitive config | Step 5 只定义来源 ref 规则 | 本 Step 按 profile 标注敏感配置处理,细节留 Step 8 |

## 6. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| profile 名称 | 只有 local / fixture / test / staging 方向 | 固定 P0 `local-dev`、`ci-test`、`integration-like`、`operations-replay`;P1/P2 `staging-like`、`production-like` | 支撑测试、验收和实施引用 |
| 外部依赖 | 只说 P0 fake / disabled | 每个 profile 明确 fake、disabled、controlled seam、replay 或 future endpoint | 防止实现侧自行选真实产品 |
| 敏感配置 | 只说普通来源给 ref | 每个 profile 标注 fake ref / credential ref / secret provider ref 边界 | 支撑 Step 8 |
| 测试承接 | 旧 `05/06` 方向未复核 | profile 对应测试 / 验收用途重新收敛 | 避免旧矩阵回流 |
| 详细设计影响 | 可能需要新增 runtime profile enum | 本 Step 只定义配置 profile 字符串 / ref 语义,不新增 `03` enum | 不回写 `03` |

## 7. 配置设计取舍

| 议题 | 方案 | 取舍 |
|---|---|---|
| P0 是否包含 production-like | A. 包含;B. 只定义方向 | 采用 B。真实产品、secret provider 和 endpoints 未锁定 |
| integration-like 是否要求真实 sibling service | A. 必须真实服务;B. 允许 controlled / real-like seam,仍通过 port / adapter | 采用 B。保持 L1 平权和不加 Cargo dependency |
| operations replay 是否属于普通 CI | A. 并入 CI;B. 独立 profile | 采用 B。replay 有历史 state / report / run id / idempotency 语义 |
| local-dev 是否允许默认全 fake | A. 允许;B. 不允许 | 采用 A。P0 需要本地可构造主链 |
| fake 成功是否可代表生产验收 | A. 可;B. 不可 | 采用 B。fake evidence 只证明 P0 语义和 deterministic behavior |

## 8. 结构化中间产物

### 8.1 环境 / profile 总表

| 环境 / profile | 用途 | 配置来源 | 外部依赖 | 敏感配置处理 | 差异说明 |
|---|---|---|---|---|---|
| `local-dev` | 本地开发、手动跑 command / query / job 主链 | code defaults + optional local config file + optional env + entry-local | in-memory stores、fake resolver、fake publisher、fake handoff、external GRC disabled | fake ref 或无 secret;raw secret 禁止 | 默认可启动,不代表正式验收 |
| `ci-test` | deterministic contract / domain / service / fake integration tests | code defaults + test config file + CI env + test fixture | in-memory stores、deterministic fake adapters、fixed clock/id、fake outbox / handoff | fixture ref;raw secret 禁止;artifact/report redaction 必须通过 | 所有结果 run-scoped、可复现 |
| `integration-like` | 跨入口、adapter unavailable / degraded、topic completeness、handoff / export failure mapping | config file + env refs + entry-local selector | controlled / real-like adapter seam;不加 sibling Cargo;可模拟 unavailable / degraded | credential / endpoint / destination refs only;raw material 后续 Step 8 | 验证接缝和 failure mapping,不要求生产 endpoint |
| `operations-replay` | outbox、projection、reference refresh、reconciliation、handoff/export、idempotency replay | replay config file + env refs + job input / run id | 脱敏历史 state、outbox、projection、reference、report refs;fake or controlled adapters | historical ref / fake ref;raw body / raw secret 禁止 | 验证恢复、重跑、partial failure 和 report digest |
| `staging-like` | P1 真实依赖 dry-run / pre-production 接入 | deployment config + env refs + secret provider refs | durable store、real-like bus、source resolver、handoff / external export target | only secret provider refs;raw material 不在配置文档 | P1/P2,不阻塞 P0 |
| `production-like` | P1/P2 生产运行和运维语境 | deployment / operations material | real DB / bus / resolver / handoff / secret provider / external GRC as approved | secret provider only;raw secret 不进入普通配置 | 只定义边界,具体 runbook / product 留运维和 ADR |

### 8.2 Profile 外部依赖矩阵

| Profile | Store | Resolver / consumer | Publisher / topic | Handoff / archive | External GRC | Clock / id |
|---|---|---|---|---|---|---|
| `local-dev` | in-memory | fake / fixture | fake publisher + local topic binding | fake handoff | disabled | deterministic or local system |
| `ci-test` | in-memory isolated per run | deterministic fake | fake publisher with asserted topic map | fake handoff with injected failure cases | disabled / fake export only when test enables | deterministic fixed |
| `integration-like` | in-memory or durable-like test store | controlled / real-like seam through ports | controlled publisher / bus seam | controlled handoff target | disabled by default;controlled fake when enabled | deterministic or controlled runtime clock |
| `operations-replay` | replay state store / fixture | replay snapshot / resolver refs | pending outbox replay / fake publisher | replay handoff target | fake / disabled unless job explicitly enables | replay run clock / deterministic |
| `staging-like` | future durable store | future real adapter | future real bus binding | future handoff target | future external export target | runtime clock/id |
| `production-like` | future production durable store | future approved adapters | future production topic map | future archive / observability handoff | future approved external GRC | production clock/id provider |

### 8.3 Profile 配置来源矩阵

| Profile | Defaults | Config file | Environment variables | Entry-local | Fixture / replay input | Secret refs |
|---|---|---|---|---|---|---|
| `local-dev` | required and sufficient | optional | optional | optional selector | optional fake seed | fake / absent |
| `ci-test` | required | required test file when suite needs overrides | CI-safe refs only | allowed for run id / selected config | required for deterministic fixture tests | fake refs only |
| `integration-like` | required baseline | required | allowed refs and profile selector | allowed for current entry / job | optional controlled scenario file | credential / endpoint refs only |
| `operations-replay` | required baseline | required replay config | allowed refs and request metadata | required full job request source | required replay artifacts / state refs | historical / fake refs only |
| `staging-like` | required baseline | required deployment config | allowed refs | limited operator entry params | no test fixture override | secret provider refs |
| `production-like` | required baseline | deployment material | operations-controlled refs | restricted | no fixture / replay override | secret provider refs only |

### 8.4 Profile 测试 / 验收承接矩阵

| Profile | 测试方案承接 | 验收标准承接 | 不得误用 |
|---|---|---|---|
| `local-dev` | smoke / local manual checks | 不作为验收证据 | 不得证明 production readiness |
| `ci-test` | contract、domain、application、infra fake、redaction、duplicate replay tests | P0 自动化基础证据 | 不得证明真实外部服务接入 |
| `integration-like` | adapter unavailable / degraded、topic map completeness、handoff/export failed marker、no fake fallback | integration seam evidence | 不得要求真实生产 endpoint |
| `operations-replay` | operations job replay、partial failure、idempotency retention、report digest | operations evidence | 不得修复 truth 或使用 raw historical body |
| `staging-like` | P1 deployment / dry-run / real-like dependency tests | P1 / release candidate evidence | 不得阻塞 P0 |
| `production-like` | production validation / runbook tests | production operations evidence | 不在 P0 定义为 must-pass |

### 8.5 Profile 停审记录

| Profile | 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|---|
| `local-dev` | 是否可用 defaults 启动;是否全 fake 不越界 | 通过 | 不代表验收 |
| `ci-test` | deterministic / isolated / redacted 是否成立 | 通过 | fixture 细节留 Step 7 / Step 12 |
| `integration-like` | 是否不加 sibling Cargo;是否验证 failure mapping | 通过 | controlled seam 具体 config 留 Step 7 |
| `operations-replay` | 是否不修复 truth;是否承载 report / replay refs | 通过 | replay artifact 细节留 Step 12 |
| `staging-like` | 是否明确 P1/P2;是否不锁产品 | 通过 | 产品和 secret provider 留 ADR / Step 13 / 14 |
| `production-like` | 是否只定义边界;是否不引入 raw secret | 通过 | 运维 runbook 不在 `04` P0 中展开 |

### 8.6 跨 profile 审计表

| 审计项 | 结论 | 缺口 / 修正 |
|---|---|---|
| P0 profile 是否足够支撑本地、CI、接缝和运维重放 | 通过 | `local-dev`、`ci-test`、`integration-like`、`operations-replay` 覆盖 |
| 是否把 staging / production 作为 P0 must-pass | 否 | 仅 P1/P2 方向 |
| 是否让 fake adapter 代表 production success | 否 | fake 只证明 P0 语义和 deterministic behavior |
| 是否引入非 core sibling Cargo dependency | 否 | 所有 profile 均通过 port / event / handoff / fake |
| 是否允许 raw secret / raw body | 否 | 所有 profile 禁止 |
| 是否需要回写 `03` runtime profile enum | 未发现 | 当前使用 `GovernanceRuntimeProfileRef` 配置语义,不新增 enum |
| 是否保留旧 `05/06` 为真相源 | 否 | 仅作为测试 / 验收方向输入 |

## 9. 对详细设计的影响判定

| 配置结论 | 是否影响 03 | 影响类型 | 03 回写位置 | 处理状态 |
|---|---|---|---|---|
| P0 profile 固定为 `local-dev`、`ci-test`、`integration-like`、`operations-replay` | 否 | 配置矩阵分类,不新增 runtime enum | 不适用 | 无回写 |
| `staging-like` / `production-like` 只作为 P1/P2 方向 | 否 | 范围裁剪 | 不适用 | 无回写 |
| integration-like 使用 controlled / real-like seam 但不加 sibling Cargo dependency | 否 | 承接架构依赖裁剪 | 不适用 | 无回写 |
| external GRC 在 P0 disabled / fake only when test enables | 否 | 承接 Step 14 默认 disabled 口径 | 不适用 | 无回写 |
| 若后续要求 production-like 动态 adapter replacement、真实 secret provider 或产品级 endpoint schema | 是 | runtime config / adapter constructor / secret loading contract | `03` §13 / Step 14 | 阻塞待确认 |

## 10. 回填草稿

> 校准来源:
> - `design-calibration/04_config_step_06_environment_profiles_matrix.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“环境 / profile 总表”“Profile 外部依赖矩阵”“Profile 配置来源矩阵”“Profile 测试 / 验收承接矩阵”“Profile 停审记录”和“跨 profile 审计表”小节,了解环境矩阵如何从 Step 5 来源优先级收敛。

正式 `04-配置设计.md` §6 应回填:

- 环境 / profile 总表。
- Profile 外部依赖矩阵。
- Profile 配置来源矩阵。
- Profile 测试 / 验收承接矩阵。
- Profile 停审记录。
- 跨 profile 审计表。
- 对详细设计的影响判定。

回填要求:

- 不得写真实 DB / bus / search / external GRC 产品。
- 不得把 `staging-like` / `production-like` 写成 P0 must-pass。
- 不得让 fake adapter 代表 production success。
- 不得让 profile 改变 truth、state、transaction、visibility、outbox 或 idempotency 不变量。

## 11. 待确认事项

| 待确认事项 | 影响 | 当前处理 |
|---|---|---|
| controlled / real-like adapter seam 的具体 config item | 影响 Step 7 配置项 | Step 7 定义 |
| operations replay artifact root / report root 是否需要正式 key | 影响 Step 7 / Step 12 | 后续定义 |
| staging-like / production-like 产品和 secret provider | 影响 P1/P2 配置项、ADR 和部署 | Step 13 / 14 记录演进和风险 |
| 旧 `05/06` 是否按新版 profile 矩阵重写 | 影响测试验收 | Step 12 给下游承接输入 |
| external GRC fake export 是否进入 P0 test profile | 影响 external export job tests | Step 7 / Step 12 决定 |

## 12. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| P0 profile 差异已定位 | 通过 | local-dev / ci-test / integration-like / operations-replay |
| profile 配置来源已明确 | 通过 | 见 §8.3 |
| profile 外部依赖已明确 | 通过 | 见 §8.2 |
| 敏感配置处理已按 profile 标注 | 通过 | 所有 profile 禁 raw secret / raw body |
| 测试 / 验收承接已明确 | 通过 | 见 §8.4 |
| profile 停审和跨 profile 审计已完成 | 通过 | 见 §8.5 / §8.6 |
| 对 `03` 的影响判定已记录 | 通过 | 当前无回写 |
| 可进入 Step 7 | 通过 | 下一步定义配置项清单 |
