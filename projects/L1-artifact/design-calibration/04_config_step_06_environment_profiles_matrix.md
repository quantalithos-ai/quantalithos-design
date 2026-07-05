# Step 6. 定义环境、部署 profile 与配置矩阵

> 对应 SOP: `standards/document/配置设计讨论流程_SOP.md` Step 6
> 回填章节: `04-配置设计.md` §6 环境、部署 profile 与配置矩阵

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 6 定义环境、部署 profile 与配置矩阵 |
| 当前状态 | 已完成;待用户审查 |
| 输入基线 | Step 3 控制面;Step 4 分类边界;Step 5 来源优先级;新版 `00/01/02/03`;旧 `05/06` 仅作历史方向输入 |
| 输出文件 | `projects/L1-artifact/design-calibration/04_config_step_06_environment_profiles_matrix.md` |
| 停审方式 | 完成本 Step 后暂停,由用户审查后再进入 Step 7 |

## 2. 本步目标

本 Step 定义 `L1-artifact` 的环境 / profile 名称、用途、配置来源组合、外部依赖 / adapter mode 组合、敏感配置处理边界,以及这些差异如何承接到测试、验收和实施文档。

本 Step 只回答:

- 哪些 profile 属于 P0 当前必须定义的执行环境,哪些只属于 P1/P2 方向。
- profile 和 adapter mode 如何分离。
- 每个 profile 的配置来源、外部依赖、敏感配置处理和主要用途。
- 哪些 profile 主要服务本地开发、CI、接缝验证、运维重放。
- 哪些 profile 差异应交给 `05/06/07` 承接。

本 Step 不定义具体配置项名、JSON schema、env var 名、secret provider API、真实数据库 / broker / object store / HTTP 产品、部署命令、容量 sizing、网络拓扑或 runbook。

## 3. 本步输入

| 输入 | 状态 | 本 Step 用途 |
|---|---|---|
| `04_config_step_03_control_plane.md` | 已完成 | 提供 environment / profile matrix 控制面和逐配置域清单 |
| `04_config_step_04_categories_boundaries.md` | 已完成 | 提供 startup / job-run-start / entry-local 边界和 P0 无 hot update |
| `04_config_step_05_sources_priority_conflicts.md` | 已完成 | 提供 `defaults < file < env` 主优先级、entry-local / job-local 边界和 unsupported source 结论 |
| `03_ddd_step_14_config_external_binding.md` | 已完成 | 提供 P0 in-memory / fake / deterministic 默认口径和外部依赖 binding |
| `03_ddd_step_16_test_cuts.md` | 已完成 | 提供 CI、integration seam、operations replay 对测试切口的承接要求 |
| `03-详细设计.md` §13 / §15 / §17 | 已完成 | 提供 runtime binding、observability redaction 和产品未锁定风险 |
| 旧 `05-测试方案.md` / `06-验收标准.md` | 旧 / 待复核方向输入 | 只保留“需要区分 local、CI、integration、operations replay”的方向,不继承旧 profile 名或旧产品假设 |
| `L1-governance` `04_config_step_06_environment_profiles_matrix.md` | 已参考 | 提供 Step 6 粒度框架,本文件按 Artifact 语义重写 |

## 4. SOP 问题回答

| 问题 | 回答 |
|---|---|
| P0 需要哪些正式 profile? | P0 profile 固定为 `local-dev`、`ci-test`、`integration-like`、`operations-replay`。`staging-like` 和 `production-like` 只作为 P1/P2 方向保留,当前不作为 P0 必过 profile。 |
| profile 和 adapter mode 是什么关系? | profile 是一组环境假设、来源组合和能力边界的打包语义;adapter mode 是某个具体能力在当前 profile 下的绑定方式,例如 `fake`、`disabled`、`controlled`、`replay-backed`、`future-real-like`。同一 profile 可以混合多种 adapter mode;同一种 adapter mode 也可以出现在多个 profile。 |
| 每个 profile 的配置来源是什么? | 所有 P0 profile 都遵守 Step 5 的普通来源主链 `code defaults < config file < environment variables`。`entry-local` 只选择当前入口,`job-local` 只选择当前 job run。`local-dev` 可只靠 defaults 启动;`ci-test` 使用 test config file + CI env + fixture;`integration-like` 使用 file + env refs + controlled scenario;`operations-replay` 使用 replay config file + env refs + replay job input。 |
| 每个 profile 依赖哪些外部能力? | `local-dev` 和 `ci-test` 主要用 in-memory store、fake resolver、fake publisher、fake handoff、disabled consumer or fixture consumer。`integration-like` 允许 controlled seam 验证 resolver / consumer / publisher / handoff 的 unavailable / degraded / failure mapping。`operations-replay` 使用脱敏历史 state / outbox / report refs 与 replay-backed job input。`staging-like` / `production-like` 未来才接 durable store、real bus、real targets。 |
| 敏感配置在不同 profile 如何处理? | 所有 profile 都禁止 raw secret、raw token、raw password、raw endpoint body、raw payload body。`local-dev` / `ci-test` 只允许 fake ref 或 fixture ref。`integration-like` / `operations-replay` 允许 credential / endpoint / target refs。`staging-like` / `production-like` 仅允许 secret-provider-facing refs,不在 P0 展开 raw material。 |
| 哪些 profile 差异影响测试和验收? | `ci-test` 承接 deterministic contract / domain / service / fake infra 测试;`integration-like` 承接 adapter seam、topic binding completeness、handoff / publish failure mapping;`operations-replay` 承接 projection rebuild、reference refresh、reconciliation、relay replay、handoff report replay。`staging-like` / `production-like` 的真实部署验证留 P1/P2。 |

## 5. 当前文档问题诊断

| 位置 | 当前问题 | 本 Step 处理 |
|---|---|---|
| Step 5 来源规则 | 已定义来源优先级,但尚未按环境组合 | 本 Step 固定每个 profile 的来源组合 |
| Step 14 默认口径 | 已有 `local` / fixture / fake / disabled 方向,但未形成统一 profile 矩阵 | 本 Step 收束为一组正式 profile 名称和用途 |
| Step 16 测试切口 | 已要求 CI / integration seam / replay,但未对应具体环境 | 本 Step 给测试切口补上环境锚点 |
| 旧 `05/06` | 可能带旧 test / staging 名称和旧产品假设 | 本 Step 明确只把旧文档当方向输入 |
| adapter mode | 容易被误写成“某个 profile 全局 fake/real” | 本 Step 专门定义 profile 与 adapter mode 分离规则 |
| sensitive config | Step 5 只定义 ref / raw 边界,未标注 profile 差异 | 本 Step 对各 profile 标注 fake ref / credential ref / future secret-provider ref 边界 |

## 6. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| profile 名称 | 只有 local / fixture / staging 方向描述 | 固定 P0 `local-dev`、`ci-test`、`integration-like`、`operations-replay`;P1/P2 `staging-like`、`production-like` | 为测试、验收、实施提供统一锚点 |
| profile 与 adapter mode | 未显式分离 | 明确 profile 是环境包,adapter mode 是单能力绑定方式 | 避免 Step 7 把 profile 写成全局 fake / real 开关 |
| 外部依赖 | 只说 P0 fake / disabled | 每个 profile 明确 store、resolver、publisher、handoff、consumer 的 mode 组合 | 防止实现侧擅自选产品 |
| replay 环境 | 只在 jobs / idempotency 语义里隐含存在 | 独立成 `operations-replay` profile | 承接 Step 16 中的 replay / recovery / partial failure 测试 |
| 旧环境口径 | 旧 `05/06` 可能回流为真相源 | 明确只保留方向,不继承旧 profile 名和旧产品 | 保持 full-restart 纪律 |

## 7. 配置设计取舍

| 议题 | 方案 | 取舍 |
|---|---|---|
| P0 是否包含 `production-like` | A. 包含;B. 只保留方向 | 采用 B。当前产品、secret provider 和 endpoint 未锁定 |
| `integration-like` 是否要求真实 sibling service | A. 必须真实服务;B. 允许 controlled / real-like seam,仍通过 port / event / handoff | 采用 B。保持依赖裁剪和 L1 平权 |
| `operations-replay` 是否并入 `ci-test` | A. 并入;B. 独立 profile | 采用 B。replay 有独立的历史 state、report 和 idempotency 语义 |
| `local-dev` 是否允许全 fake | A. 允许;B. 不允许 | 采用 A。P0 需要本地可构造主链 |
| profile 是否等于 adapter mode | A. 等于;B. 明确分离 | 采用 B。profile 是环境组合,adapter mode 是具体能力配置 |

## 8. 结构化中间产物

### 8.1 环境 / profile 总表

| 环境 / profile | 用途 | 配置来源 | 外部依赖 | 敏感配置处理 | 差异说明 |
|---|---|---|---|---|---|
| `local-dev` | 本地开发、手动跑 command / query / job 主链 | code defaults + optional local config file + optional env + entry-local selector | in-memory stores、fake resolver、fake publisher、fake handoff、consumer disabled or fixture-only | fake ref 或无 secret;raw secret 禁止 | 默认可启动,不代表正式验收 |
| `ci-test` | deterministic contract / domain / service / fake infra tests | code defaults + test config file + CI env + test fixture | in-memory stores、deterministic fake adapters、fixed clock/id、fixture consumer、fake relay / handoff | fixture ref only;raw secret 禁止 | 所有结果 run-scoped、可复现 |
| `integration-like` | 跨入口、adapter unavailable / degraded、topic binding completeness、handoff / publish failure mapping | config file + env refs + entry-local selector + controlled scenario input | controlled resolver / consumer / publisher / handoff seam;不加 sibling Cargo | credential / endpoint / target refs only | 验证接缝和 failure mapping,不要求真实生产 endpoint |
| `operations-replay` | relay replay、projection rebuild、reference refresh、reconciliation、handoff report replay、idempotency recovery | replay config file + env refs + replay job input / report refs | replay-backed state / outbox / report refs;fake or controlled adapters | historical ref / fake ref only;raw body / raw secret 禁止 | 验证恢复、重跑、partial failure 和 report digest |
| `staging-like` | P1 真实依赖 dry-run / release candidate 接入 | deployment config + env refs + secret-provider-facing refs | future durable store、future publisher / handoff / consumer adapters | secret-provider-facing refs only | P1/P2 方向,不阻塞 P0 |
| `production-like` | P1/P2 生产运行和运维语境 | deployment / operations-controlled material | future approved durable store、bus、resolver、handoff、consumer | secret-provider-facing refs only | 只定义边界,不在 P0 展开 runbook |

### 8.2 Profile 与 adapter mode 分离表

| 概念 | 定义 | 例子 | 禁止误用 |
|---|---|---|---|
| profile | 环境级组合语义,描述来源、能力边界、测试 / 验收用途 | `ci-test`、`integration-like`、`operations-replay` | 不得把 profile 当成单个 adapter 的真假开关 |
| adapter mode | 某个具体能力在当前 profile 下的绑定方式 | `fake`、`disabled`、`controlled`、`replay-backed`、`future-real-like` | 不得把一个 adapter mode 推广成整个 profile 的全局语义 |
| profile -> mode 映射 | 一个 profile 内可混合多个 mode | `integration-like` 中 store 可为 `in-memory`,publisher 为 `controlled`,handoff 为 `controlled`,consumer 为 `disabled` 或 `controlled` | 不得要求 profile 内所有能力 mode 一致 |
| mode -> profile 复用 | 同一个 mode 可在多个 profile 中复用 | `fake` 可出现在 `local-dev`、`ci-test`;`controlled` 可出现在 `integration-like`、`operations-replay` | 不得把 mode 名直接当成 profile 名 |

### 8.3 Profile 外部依赖 / adapter mode 矩阵

| Profile | Store mode | Resolver / consumer mode | Publisher / topic mode | Handoff mode | Clock / id mode |
|---|---|---|---|---|---|
| `local-dev` | `in-memory` | `fake` or `fixture-only` | `fake` + local topic binding | `fake` or `disabled` | `deterministic` or local system |
| `ci-test` | `in-memory-isolated` | `deterministic-fake` | `fake-with-asserted-binding` | `fake-with-failure-injection` | `fixed-deterministic` |
| `integration-like` | `in-memory` or `durable-like-test-store` | `controlled` | `controlled` | `controlled` | `controlled` or runtime-like |
| `operations-replay` | `replay-backed-state` | `replay-backed` or `controlled` | `controlled` or `fake` | `controlled` or `fake` | `deterministic-replay` |
| `staging-like` | `future-durable` | `future-real-like` | `future-real-like` | `future-real-like` | `runtime-like` |
| `production-like` | `future-production-durable` | `future-production-approved` | `future-production-approved` | `future-production-approved` | `production-provider` |

### 8.4 Profile 配置来源矩阵

| Profile | Defaults | Config file | Environment variables | Entry-local / job-local | Fixture / replay input | Secret refs |
|---|---|---|---|---|---|---|
| `local-dev` | required and sufficient | optional | optional | optional selector | optional fake seed | fake / absent |
| `ci-test` | required | required when suite needs overrides | CI-safe refs only | allowed for run id / selected config | required for deterministic fixture cases | fake refs only |
| `integration-like` | required baseline | required | allowed refs and selectors | allowed for current entry / current job local scope | optional controlled scenario input | credential / endpoint / target refs only |
| `operations-replay` | required baseline | required replay file | allowed refs and replay metadata | required current job replay input | required replay state / report refs | historical / fake refs only |
| `staging-like` | required baseline | required deployment config | allowed refs | limited operator entry params | no fixture override | secret-provider-facing refs |
| `production-like` | required baseline | deployment material | operations-controlled refs | restricted | no fixture / replay override | secret-provider-facing refs only |

### 8.5 Profile 测试 / 验收承接矩阵

| Profile | 测试方案承接 | 验收标准承接 | 不得误用 |
|---|---|---|---|
| `local-dev` | smoke / local manual checks | 不作为正式验收证据 | 不得证明 production readiness |
| `ci-test` | contract、domain、application、infra fake、redaction、duplicate replay tests | P0 自动化基础证据 | 不得证明真实外部依赖接入 |
| `integration-like` | resolver / consumer / publisher / handoff seam、topic completeness、degraded / unavailable mapping | integration seam evidence | 不得要求真实生产 endpoint |
| `operations-replay` | operations job replay、partial failure、idempotency recovery、report digest | operations evidence | 不得修复 truth 或使用 raw historical body |
| `staging-like` | P1 deployment / dry-run / real-like dependency tests | release-candidate evidence | 不得阻塞 P0 |
| `production-like` | production validation / runbook tests | production operations evidence | 不在 P0 定义为 must-pass |

### 8.6 Profile 停审记录

| Profile | 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|---|
| `local-dev` | 是否可用 defaults 启动;是否全 fake 不越界 | 通过 | 不代表验收 |
| `ci-test` | deterministic / isolated / redacted 是否成立 | 通过 | fixture key 细节留 Step 7 |
| `integration-like` | 是否不加 sibling Cargo;是否验证 failure mapping | 通过 | controlled seam 的具体配置项留 Step 7 |
| `operations-replay` | 是否不修复 truth;是否承载 replay refs | 通过 | replay artifact root 留 Step 7 / Step 12 |
| `staging-like` | 是否明确为 P1/P2;是否不锁产品 | 通过 | 产品和 secret-provider 细节留 Step 13 / 14 |
| `production-like` | 是否只定义边界;是否不引入 raw secret | 通过 | 运维 runbook 不在 `04` P0 中展开 |

### 8.7 跨 profile 审计表

| 审计项 | 结论 | 缺口 / 修正 |
|---|---|---|
| P0 profile 是否足够支撑本地、CI、接缝和运维重放 | 通过 | `local-dev`、`ci-test`、`integration-like`、`operations-replay` 覆盖 |
| 是否把 profile 与 adapter mode 混为一谈 | 否 | 已在 §8.2 分离 |
| 是否把 `staging-like` / `production-like` 写成 P0 must-pass | 否 | 仅作为 P1/P2 方向 |
| 是否让 fake adapter 代表 production success | 否 | fake 只证明 P0 语义和 deterministic behavior |
| 是否引入非 core sibling Cargo dependency | 否 | 所有 profile 仍通过 port / event / handoff / fake |
| 是否允许 raw secret / raw body | 否 | 所有 profile 禁止 |
| 是否保留旧 `05/06` 为真相源 | 否 | 只保留方向输入 |
| 是否需要回写 `03` runtime profile enum | 未发现 | 当前使用 `ArtifactRuntimeProfileRef` 配置语义,不新增 enum |

## 9. 对详细设计的影响判定

| 配置结论 | 是否影响 03 | 影响类型 | 03 回写位置 | 处理状态 |
|---|---|---|---|---|
| P0 profile 固定为 `local-dev`、`ci-test`、`integration-like`、`operations-replay` | 否 | 配置矩阵分类,不新增 runtime enum | 不适用 | 无回写 |
| profile 与 adapter mode 明确分离 | 否 | 配置语义澄清 | 不适用 | 无回写 |
| `staging-like` / `production-like` 仅作为 P1/P2 方向 | 否 | 范围裁剪 | 不适用 | 无回写 |
| integration-like 允许 controlled seam,但不加 sibling Cargo dependency | 否 | 承接依赖裁剪 | 不适用 | 无回写 |
| 若后续要求 production-like 动态 adapter replacement、真实 secret provider 或产品级 endpoint schema | 是 | runtime config / adapter constructor / secret loading contract | `03` §13 / Step 14 | 阻塞待确认 |

## 10. 回填草稿

> 校准来源:
> - `design-calibration/04_config_step_06_environment_profiles_matrix.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“环境 / profile 总表”“Profile 与 adapter mode 分离表”“Profile 外部依赖 / adapter mode 矩阵”“Profile 配置来源矩阵”“Profile 测试 / 验收承接矩阵”“Profile 停审记录”和“跨 profile 审计表”小节,了解环境矩阵如何从 Step 5 来源优先级与 Step 14 binding 收敛。

正式 `04-配置设计.md` §6 应回填:

- 环境 / profile 总表。
- Profile 与 adapter mode 分离表。
- Profile 外部依赖 / adapter mode 矩阵。
- Profile 配置来源矩阵。
- Profile 测试 / 验收承接矩阵。
- Profile 停审记录。
- 跨 profile 审计表。
- 对详细设计的影响判定。

回填要求:

- 不得写真实 DB / bus / object store / HTTP 产品。
- 不得把 `staging-like` / `production-like` 写成 P0 must-pass。
- 不得让 profile 改变 truth、state、transaction、visibility、relay snapshot source 或 idempotency 不变量。
- 不得把 profile 名写成某个具体 adapter mode 的别名。

## 11. 待确认事项

| 待确认事项 | 影响 | 当前处理 |
|---|---|---|
| `integration-like` controlled seam 的具体配置项 | 影响 Step 7 配置项清单 | Step 7 定义 |
| `operations-replay` 的 replay artifact root / report root 是否需要正式 key | 影响 Step 7 / Step 12 | 后续定义 |
| `staging-like` / `production-like` 的产品和 secret-provider 选择 | 影响 P1/P2 配置项、ADR 和运维 | Step 13 / 14 记录 |
| 旧 `05/06` 是否按新版 profile 矩阵重写 | 影响测试和验收 | Step 12 给下游承接输入 |
| 哪些 consumer 在 `local-dev` 默认 disabled,哪些允许 fixture-only | 影响 Step 7 配置项和 Step 12 测试承接 | Step 7 / Step 12 再定 |

## 12. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| P0 profile 差异已定位 | 通过 | `local-dev` / `ci-test` / `integration-like` / `operations-replay` |
| profile 与 adapter mode 已分离 | 通过 | 见 §8.2 |
| profile 配置来源已明确 | 通过 | 见 §8.4 |
| profile 外部依赖与 mode 组合已明确 | 通过 | 见 §8.3 |
| 敏感配置处理已按 profile 标注 | 通过 | 所有 profile 禁 raw secret / raw body |
| 测试 / 验收承接已明确 | 通过 | 见 §8.5 |
| profile 停审和跨 profile 审计已完成 | 通过 | 见 §8.6 / §8.7 |
| 对 `03` 的影响判定已记录 | 通过 | 当前无回写 |
| 可进入 Step 7 | 通过 | 下一步定义配置项清单 |
