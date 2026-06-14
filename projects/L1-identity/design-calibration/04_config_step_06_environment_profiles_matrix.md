# 04 配置设计 Step 6 · 定义环境、部署 profile 与配置矩阵

> 子项目: `L1-identity`
> 目标文档: `04-配置设计.md`
> SOP Step: Step 6 定义环境、部署 profile 与配置矩阵
> 状态: 已写入;等待用户审核

---

## 1. Step 状态

| 项 | 状态 |
|---|---|
| 当前 Step | Step 6 定义环境、部署 profile 与配置矩阵 |
| 当前状态 | 已写入;等待用户审核 |
| 输入基线 | Step 3 control plane;Step 4 categories / boundaries;Step 5 sources / priority / conflicts;新版正式 `03-详细设计.md` §13~§17 |
| 输出文件 | `projects/L1-identity/design-calibration/04_config_step_06_environment_profiles_matrix.md` |
| 停审方式 | 本 Step 完成后暂停,审核通过后进入 Step 7 config items |

本 Step 定义 `L1-identity` 的环境 / profile 名称、用途、配置来源、外部依赖、敏感配置处理和测试 / 验收承接差异。

本 Step 只回答:

- local / CI / integration / replay / staging / production-like 是否适用。
- 每个环境 / profile 的配置来源是什么。
- 每个 profile 依赖哪些外部服务或 fake / controlled / disabled adapter。
- 敏感配置在不同 profile 中如何处理。
- 哪些 profile 差异影响测试方案、验收标准和实施计划。

本 Step 不定义具体配置项、JSON / TOML schema、环境变量名、secret provider API、真实 DB / bus / resolver 产品、部署命令、证书安装、容量 sizing、CI job 名、测试编号、evidence 路径或生产 runbook。

## 2. 本步输入

| 输入 | 状态 | 本 Step 用途 |
|---|---|---|
| `04_config_step_03_control_plane.md` | 已审核通过 | 提供 profile / runtime assembly 控制面和配置域 |
| `04_config_step_04_categories_boundaries.md` | 已审核通过 | 提供 startup / job-run-start / entry-local 更新边界和 P0 无 hot update 口径 |
| `04_config_step_05_sources_priority_conflicts.md` | 已审核通过 | 提供 `defaults < file < env` 普通来源规则、secret refs 和 test fixture 边界 |
| `03-详细设计.md` §13 | 已完成 | 提供 runtime builder、adapter availability、fake / controlled / disabled 语义和 product-neutral binding |
| `03-详细设计.md` §15~§17 | 已完成 | 提供 config/runtime/adapter 测试切口、下游复核风险和实现开工风险 |
| 旧 `05/06/07` | 早于新版 `03/04` | 只作为测试 / 验收 / 实施方向输入,不得继承旧环境名或旧产品假设 |
| `L1-governance` Step 6 calibration | 参考样式 | 只参考 profile 粒度和矩阵组织,不复用治理业务对象 |

## 3. SOP 问题回答

| 问题 | 回答 |
|---|---|
| local / CI / test / staging / prod 分别是否适用? | P0 正式 profile 固定为 `local-dev`、`ci-test`、`integration-like`、`operations-replay`。旧 `dev/test/staging` 只作为历史输入。`staging-like` 和 `production-like` 作为 P1/P2 方向,当前不作为 P0 must-pass profile。 |
| 每个环境配置来源是什么? | 所有 P0 profile 遵守 Step 5 普通来源 `code defaults < config file < environment variables`。entry-local 只选择当前入口 / job。`local-dev` 可由 defaults 启动;`ci-test` 使用 test config file、CI-safe env 和 fixture;`integration-like` 使用 config file、env refs 和 controlled seam selector;`operations-replay` 使用 replay config file、job input、run id 和 report / artifact refs。 |
| 每个环境依赖哪些外部服务? | `local-dev` 和 `ci-test` 不依赖真实外部服务,使用 in-memory store、fake resolver、fake publisher、fake handoff、fake audit sink 或 disabled adapter。`integration-like` 允许 controlled / real-like seam,但仍不得把 sibling repo 加入 Cargo。`operations-replay` 使用脱敏历史 state、outbox、projection、reference、report refs。`staging-like` / `production-like` 后续才接真实 durable store、bus、secret provider 和 endpoints。 |
| 敏感配置在不同环境如何处理? | 所有 profile 都禁止 raw secret、raw token、raw endpoint credential、raw external body。`local-dev` / `ci-test` 使用 fake ref 或 fixture ref。`integration-like` / `operations-replay` 可使用 credential / endpoint / handoff target refs,raw material 由 Step 8 定义。`staging-like` / `production-like` 只允许 secret provider refs。 |
| 哪些环境差异会影响测试和验收? | `ci-test` 提供 P0 deterministic automated evidence。`integration-like` 验证 adapter unavailable / degraded、topic completeness、no fake fallback、handoff failure mapping。`operations-replay` 验证 outbox retry、projection rebuild、reference refresh、reconciliation、handoff delivery/retry 和 stored job report replay。`staging-like` / `production-like` 的真实外部依赖验收留 P1/P2。 |
| fake / controlled / disabled 是否是 profile? | 不是。它们是 adapter mode,由 profile 选择允许组合。profile 描述运行环境和来源矩阵;adapter mode 描述某个依赖在该环境中的装配方式。 |
| profile 是否会新增 `03` runtime enum? | 不会。本 Step 只定义配置设计中的 profile ref / profile name 语义,不新增 `03` object、enum、DTO、port 或 builder signature。若后续实现需要新增强类型 schema,必须回写 `03`。 |

## 4. 当前文档问题诊断

| 位置 | 当前问题 | 本 Step 处理 |
|---|---|---|
| Step 5 来源规则 | 已定义来源优先级,但未按 profile 组合 | 本 Step 定义每个 profile 的来源组合 |
| Step 2 profile 候选 | 明确 Step 6 再正式裁决 profile | 本 Step 固定 P0 四 profile,并把 staging / production 降为 P1/P2 |
| 新版 `03` §17 风险 | durable DB、broker、metric、DLQ、external endpoints 和 production product 未锁定 | 本 Step 保持 P0 fake / controlled / disabled / product-neutral |
| 旧 `05/06/07` | 可能含旧 dev/test/staging 矩阵和旧 mock/stub 口径 | 本 Step 只保留方向输入,正式 profile 重新定义 |
| sensitive config | Step 5 只定义来源 ref 规则 | 本 Step 按 profile 标注敏感配置处理,细节留 Step 8 |

## 5. 改动前后对比

| 项 | 改动前 | 本步后 | 原因 |
|---|---|---|---|
| profile 名称 | Step 2 只保留候选,旧文档可能有 dev/test/staging | 固定 P0 `local-dev`、`ci-test`、`integration-like`、`operations-replay`;P1/P2 `staging-like`、`production-like` | 支撑测试、验收和实施引用 |
| adapter mode | 旧文档容易写 mock/stub profile | fake / controlled / disabled 是 adapter mode,不是 profile | 防止环境名与依赖装配方式混用 |
| 外部依赖 | 只说 P0 fake / disabled | 每个 profile 明确 fake、disabled、controlled seam、replay refs 或 future endpoint | 防止实现侧自行选真实产品 |
| 敏感配置 | 只说普通来源给 ref | 每个 profile 标注 fake ref / credential ref / secret provider ref 边界 | 支撑 Step 8 |
| 测试承接 | 旧 `05/06` 方向未复核 | profile 对应测试 / 验收用途重新收敛 | 避免旧矩阵回流 |
| 详细设计影响 | 可能误认为新增 runtime profile enum | 本 Step 只定义配置 profile 语义,不新增 `03` enum | 不回写 `03` |

## 6. 配置设计取舍

| 议题 | 可选方案 | 取舍 |
|---|---|---|
| 是否沿用 `dev/test/staging` | A. 沿用旧环境名;B. 重新定义 P0 profile | 采用 B。旧环境名早于新版 `03`,语义过粗 |
| P0 是否包含 `production-like` | A. 包含;B. 只定义方向 | 采用 B。真实产品、secret provider 和 endpoints 未锁定 |
| `integration-like` 是否要求真实 sibling service | A. 必须真实服务;B. 允许 controlled / real-like seam,仍通过 port / adapter | 采用 B。保持依赖裁剪,不加 Cargo dependency |
| `operations-replay` 是否并入 CI | A. 并入 `ci-test`;B. 独立 profile | 采用 B。replay 有历史 state / report / run id / stored replay 语义 |
| `local-dev` 是否允许 default + fake 启动 | A. 允许;B. 不允许 | 采用 A。P0 需要本地可构造主链 |
| fake 成功是否可代表 production readiness | A. 可;B. 不可 | 采用 B。fake evidence 只证明 P0 语义和 deterministic behavior |

## 7. 结构化中间产物

### 7.1 环境 / profile 总表

| 环境 / profile | 用途 | 配置来源 | 外部依赖 | 敏感配置处理 | 差异说明 |
|---|---|---|---|---|---|
| `local-dev` | 本地开发、手动 smoke、快速检查 command / query / job 主链 | code defaults + optional local config file + optional env + optional entry-local selector | in-memory stores、fake role/capability source、fake publisher、fake handoff、fake audit sink、P1 adapters disabled | fake ref 或无 secret;raw secret 禁止 | 默认可启动,不代表正式验收 |
| `ci-test` | CI 自动化、contract、domain、application、infra fake、redaction、duplicate replay tests | code defaults + test config file + CI-safe env + deterministic fixture | isolated in-memory stores、deterministic fake adapters、fixed clock/id、fake outbox / handoff | fixture ref;raw secret 禁止;artifact/report redaction 必须通过 | 所有结果 run-scoped、可复现 |
| `integration-like` | 跨入口、adapter unavailable / degraded、topic completeness、no fake fallback、handoff failure mapping | config file + env refs + entry-local selector | controlled / real-like adapter seam;不加 sibling Cargo;可模拟 unavailable / degraded | credential / endpoint / destination refs only;raw material 后续 Step 8 | 验证接缝和 failure mapping,不要求生产 endpoint |
| `operations-replay` | outbox、projection、reference refresh、reconciliation、handoff、stored replay 和 report digest | replay config file + env refs + job input / run id | 脱敏历史 state、outbox、projection、reference、report refs;fake or controlled adapters | historical ref / fake ref;raw body / raw secret 禁止 | 验证恢复、重跑、partial failure 和 replay report |
| `staging-like` | P1 真实依赖 dry-run / pre-production 接入 | deployment config + env refs + secret provider refs | future durable store、real-like bus、source resolver、handoff target、observability sink | only secret provider refs;raw material 不在配置文档 | P1/P2 方向,不阻塞 P0 |
| `production-like` | P1/P2 生产运行和运维语境 | deployment / operations material | approved production DB / bus / resolver / handoff / secret provider / observability | secret provider only;raw secret 不进入普通配置 | 只定义边界,具体 runbook / product 留运维和 ADR |

### 7.2 Profile 外部依赖矩阵

| Profile | Store | Role / capability source | Work / governance / artifact / memory | Publisher / topic | Handoff / archive | Audit / trace | Clock / id |
|---|---|---|---|---|---|---|---|
| `local-dev` | in-memory | fake fixture | disabled or fake fixture | fake publisher + local topic binding | fake handoff | fake / local sink | deterministic or local system |
| `ci-test` | isolated in-memory per run | deterministic fixture | fake / disabled by suite | fake publisher with asserted topic map | fake handoff with injected failure cases | captured test sink | fixed deterministic |
| `integration-like` | in-memory or durable-like test store | controlled / real-like seam through ports | controlled seam,disabled unless tested | controlled publisher / bus seam | controlled handoff target | controlled sink | deterministic or controlled runtime clock |
| `operations-replay` | replay state store / fixture | replay snapshot | replay refs or disabled | pending outbox replay / fake publisher | replay handoff target | report sink | replay run clock / deterministic |
| `staging-like` | future durable store | future endpoint | future endpoints | future real bus binding | future handoff target | future observability | runtime clock/id |
| `production-like` | future production durable store | future approved endpoint | future approved endpoints | future production topic map | future archive / handoff target | production observability | production clock/id provider |

### 7.3 Profile 配置来源矩阵

| Profile | Defaults | Config file | Environment variables | Entry-local | Fixture / replay input | Secret refs |
|---|---|---|---|---|---|---|
| `local-dev` | required and sufficient | optional | optional | optional selector | optional fake seed | fake / absent |
| `ci-test` | required | required test file when suite needs overrides | CI-safe refs only | allowed for run id / selected config | required for deterministic fixture tests | fake refs only |
| `integration-like` | required baseline | required | allowed refs and profile selector | allowed for current entry / job | optional controlled scenario file | credential / endpoint refs only |
| `operations-replay` | required baseline | required replay config | allowed refs and request metadata | required job request source / run identity | required replay artifacts / state refs | historical / fake refs only |
| `staging-like` | required baseline | required deployment config | allowed refs | limited operator entry params | no test fixture override | secret provider refs |
| `production-like` | required baseline | deployment material | operations-controlled refs | restricted | no fixture / replay override | secret provider refs only |

### 7.4 旧环境口径映射表

| 旧口径 | 新 profile / 概念 | 处理 |
|---|---|---|
| `dev` | `local-dev` | 只保留本地开发和手动 smoke 语义 |
| `test` | `ci-test` | 保留 CI 自动化、contract、repository、outbox、projection、redaction 测试 |
| `staging` | `integration-like` + P1 `staging-like` | P0 只保留 controlled / real-like seam;真实依赖留 P1 |
| mock / stub | adapter mode,非 profile | 映射为 fake / controlled / disabled |
| replay / recovery | `operations-replay` | 独立 profile,承接 ops evidence 和 stored replay 验证 |

### 7.5 Profile 测试 / 验收承接矩阵

| Profile | 测试方案承接 | 验收标准承接 | 不得误用 |
|---|---|---|---|
| `local-dev` | local smoke / manual checks | 不作为正式验收证据 | 不得证明 release readiness |
| `ci-test` | P0 automated suites、contract、redline、repository / outbox / projection / duplicate replay tests | P0 自动化基础 evidence | 不得证明真实外部服务接入 |
| `integration-like` | adapter unavailable / degraded、topic map completeness、handoff failed marker、no fake fallback | integration seam evidence | 不得要求真实生产 endpoint |
| `operations-replay` | outbox retry、projection rebuild、reference refresh、reconciliation、handoff retry、stored job report replay | operations evidence | 不得修复 truth,不得使用 raw historical body |
| `staging-like` | P1 release candidate / dry-run | P1 / release candidate evidence | 不阻塞 P0 |
| `production-like` | production validation / runbook tests | production operations evidence | 不在 P0 中定义为 must-pass |

### 7.6 Profile 停审记录

| Profile | 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|---|
| `local-dev` | 是否可用 defaults 启动;fake 是否越界 | 通过 | 不作为验收 |
| `ci-test` | deterministic、isolated、redacted 是否成立 | 通过 | fixture 细节留 Step 7 / Step 12 |
| `integration-like` | 是否不加 sibling Cargo;是否验证 failure mapping | 通过 | controlled seam 具体 config 留 Step 7 |
| `operations-replay` | 是否不修复 truth;是否承载 report / replay refs | 通过 | replay artifact 细节留 Step 12 |
| `staging-like` | 是否明确 P1/P2;是否不锁产品 | 通过 | 产品和 secret provider 留 ADR / Step 13 / Step 14 |
| `production-like` | 是否只定义边界;是否不引入 raw secret | 通过 | 运维 runbook 不在 `04` P0 中展开 |

### 7.7 跨 profile 审计表

| 审计项 | 结论 | 缺口 / 修正 |
|---|---|---|
| P0 profile 是否覆盖本地、CI、接缝和运维重放 | 通过 | 四 profile 覆盖 |
| 是否把 staging / production 作为 P0 must-pass | 否 | 仅 P1/P2 方向 |
| 是否让 fake adapter 代表 production success | 否 | fake 只证明 P0 语义和 deterministic behavior |
| 是否引入非 core sibling Cargo dependency | 否 | 所有 profile 通过 port / event / handoff / fake |
| 是否允许 raw secret / raw body | 否 | 全部禁止 |
| 是否保留旧 dev/test/staging 为正式 profile | 否 | 已映射 |
| 是否需要回写 `03` runtime profile enum | 未发现 | 当前只定义配置 profile 语义,不新增 enum |

## 8. 对详细设计的影响判定

| 配置结论 | 是否影响 `03` | 影响类型 | `03` 回写位置 | 处理状态 |
|---|---|---|---|---|
| P0 profile 固定为 `local-dev`、`ci-test`、`integration-like`、`operations-replay` | 否 | 配置矩阵分类,不新增 runtime enum | 不适用 | 无回写 |
| `staging-like` / `production-like` 只作为 P1/P2 方向 | 否 | 范围裁剪 | 不适用 | 无回写 |
| `integration-like` 使用 controlled / real-like seam,但不加 sibling Cargo dependency | 否 | 承接架构依赖裁剪 | 不适用 | 无回写 |
| fake / controlled / disabled 是 adapter mode,不是 profile | 否 | 配置语义澄清 | 不适用 | 无回写 |
| `operations-replay` 独立承接 ops evidence 和 stored replay 验证 | 否 | profile 分类 | 不适用 | 无回写 |
| 若后续要求 production-like dynamic adapter replacement、真实 secret provider 或产品级 endpoint schema | 是 | runtime config / adapter constructor / secret loading contract | `03` §13 / runtime assembly / port binding | 阻塞待确认 |

## 9. 回填草稿

正式 `04-配置设计.md` §6 可回填:

```md
## 6. 环境、部署 profile 与配置矩阵

> 校准来源:
> - `design-calibration/04_config_step_06_environment_profiles_matrix.md`

`L1-identity` 的 P0 profile 固定为 `local-dev`、`ci-test`、`integration-like`、`operations-replay`。旧 `dev/test/staging` 只作为历史输入,分别映射为本地开发、CI 自动化和 controlled / real-like integration seam。真实 staging / production 依赖属于 P1/P2 方向,不作为 P0 must-pass profile。

所有 profile 都禁止 raw secret、raw token、raw endpoint credential 和 raw external body。`fake`、`controlled`、`disabled` 是 adapter mode,不是 profile 名。`operations-replay` 独立承接 outbox、projection、reference refresh、reconciliation、handoff 和 stored replay 的运维重放 evidence。
```

## 10. 待确认事项

| 编号 | 待确认事项 | 影响 | 当前处理 |
|---|---|---|---|
| ID-CONFIG-Q21 | controlled / real-like adapter seam 的具体 config item | 影响 Step 7 配置项 | Step 7 定义 |
| ID-CONFIG-Q22 | operations replay artifact root / report root 是否需要正式 key | 影响 Step 7 / Step 12 | 后续定义 |
| ID-CONFIG-Q23 | staging-like / production-like 产品和 secret provider | 影响 P1/P2 配置项、ADR 和部署 | Step 13 / 14 记录演进和风险 |
| ID-CONFIG-Q24 | 旧 `05/06` 是否按新版 profile 矩阵重写 | 影响测试验收 | Step 12 给下游承接输入 |
| ID-CONFIG-Q25 | profile 名称是否需要在 implementation 中落为强类型 enum | 影响 runtime config schema | 若 Step 7/9 需要强类型对象,必须回写 `03` |

## 11. 进入下一步条件

- P0 profile 差异已定位。
- profile 配置来源已明确。
- profile 外部依赖已明确。
- 敏感配置处理已按 profile 标注。
- 测试 / 验收承接已明确。
- profile 停审和跨 profile 审计已完成。
- 对 `03-详细设计.md` 的影响判定已记录,当前无必须回写项。
- 未提前定义配置 key、env var、默认值、schema、secret provider、测试编号、evidence 路径或实施 boundary。

下一步进入 Step 7:定义配置项清单。
