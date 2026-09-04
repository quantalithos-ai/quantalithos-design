# Step 6：定义环境、部署 profile 与配置矩阵

> 对应 SOP：`standards/document/配置设计讨论流程_SOP.md` Step 6
> 回填章节：未来正式 `04-配置设计.md` §6“环境、部署 profile 与配置矩阵”
> 参考粒度：`projects/L1-governance/design-calibration/04_config_step_06_environment_profiles_matrix.md`
> 执行模式：full-restart；旧 `README`、旧 `05/06` 的环境名称和产品值不继承

## 1. Step 状态

| 项目 | 记录 |
|---|---|
| 当前文档 | `04-配置设计.md`（正式文件尚未创建） |
| 当前 Step | Step 6 环境、部署 profile 与配置矩阵 |
| 当前模块 | `environment_profiles_matrix` |
| Step 状态 | `completed / pass_with_upstream_blockers` |
| 输入基线 | Step 1~5、`01-架构设计.md` 部署边界、`03-详细设计.md` §13、L1-governance Step 6 |
| 正式 `04` 写入 | `false`；仅 Step 15 装配 |
| 实现 / 测试 / 证据 | `false`；只形成设计材料，不声称任何环境已运行 |
| commit | `false` |

### 1.1 Step 内计划

- [x] 固定 P0 环境 / profile 语义和 P1/P2 方向。
- [x] 为每个 profile 指定来源组合、外部 seam、敏感 ref 处理和测试 / 验收承接。
- [x] 区分 local、CI、integration-like、operations-replay 与 future staging/production-like。
- [x] 保留 sibling、store、Bus、Sandbox、credential 和 observability 未闭合状态。
- [x] 完成 profile 停审、跨 profile 审计、`03` 影响判定和 §6 回填草稿。

## 2. 本步目标

本 Step 只定义环境与 profile 的语义组合，不定义部署命令、容器编排、具体数据库 / 消息产品、secret provider API、容量数值或生产 runbook。profile 是经过校验的配置组合选择器，不是改变领域规则的 feature flag。

P0 需要覆盖可重复的本地主链、CI 语义验证、受控接缝验证和运维重放；真实生产依赖尚未由上游合同闭合，因此 staging-like / production-like 只记录后续方向，不成为当前 P0 的成功条件。

## 3. 本步输入

| 输入 | 状态 / 效力 | 本 Step 用途 |
|---|---|---|
| `04_config_step_05_sources_priority_conflicts.md` | completed / pass_with_upstream_blockers | 提供 `defaults < JSON file < env` 以及局部来源规则 |
| `04_config_step_04_categories_boundaries.md` | completed / pass_with_upstream_blockers | 提供 startup、job-run-start、entry-local 和 fixture 冻结边界 |
| `04_config_step_03_control_plane.md` | completed / pass_with_upstream_blockers | 提供控制面、功能域和 adapter availability 语义 |
| `01-架构设计.md` | 正式上游 | 提供部署角色、依赖裁剪和 Host Truth owner |
| `03-详细设计.md` §3、§4、§13~§15 | 正式直接输入 | 提供 builder、Port、fake、blocked、redaction 和观测边界 |
| 旧 `05-测试方案.md`、`06-验收标准.md` | historical_material | 仅识别测试 / 验收方向，不继承环境名、产品或数字 |
| L1-governance Step 6 | 只读粒度参考 | 参考环境矩阵、依赖矩阵和停审格式 |

## 4. SOP 问题回答

| 问题 | 本仓结论 |
|---|---|
| local / CI / test / staging / prod 是否适用？ | P0 采用 `local-dev`、`ci-test`、`integration-like`、`operations-replay` 四个 profile；`staging-like`、`production-like` 仅为 P1/P2 方向。 |
| 每个 profile 的配置来源是什么？ | 均遵守 Step 5 的普通优先级；`local-dev` 可只用 defaults 和普通 fake / placeholder；`ci-test` 可在 test entry 注入 test file 与 `deterministic_fixture.*`；`integration-like` 使用受控 config file 和 controlled seam；`operations-replay` 使用 replay file、job input 与 `deterministic_fixture.*` / 脱敏 replay input。 |
| 外部依赖如何表示？ | 用 in-memory、fake、disabled、controlled、placeholder 或 blocked marker；不把 sibling 仓、容器、RPC、Bus、DB 或 Sandbox backend 写成 compile dependency 或 ready 事实。 |
| 敏感配置如何处理？ | 所有 profile 只允许 opaque ref。local/CI 使用 fake ref 或缺省；integration-like 可使用待确认 credential / endpoint ref；future production-like 只允许经批准的 provider ref；raw material 永不进入配置。 |
| 环境差异怎样交给下游？ | `ci-test` 承接 deterministic 与 redaction 证据，`integration-like` 承接接缝失败映射，`operations-replay` 承接重放和恢复，future profiles 由实施 / 运维另行裁决。 |

## 5. 当前材料诊断

| 位置 | 问题 | 本 Step 修正 |
|---|---|---|
| 旧 README / `05/06` | 可能将 Docker、数据库、心跳阈值或旧环境名当成正式配置 | 全部降级为历史污染输入 |
| Step 5 | 来源顺序已固定但缺少 profile 组合 | 建立来源、依赖、敏感 ref 和下游用途矩阵 |
| `03` §13 | P0 fake / blocked 与真实依赖方向未按环境拆分 | 明确 fake 不代表 ready，真实依赖仅 future |
| 并行兄弟 | Member、Images、Runtime、Sandbox、Core/Bus 仍无 exact schema | integration-like 仅允许 controlled seam；正向路径保持 blocked / unknown |

## 6. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 环境口径 | local / test / staging 泛称 | 四个 P0 profile + 两个 future profile | 让测试、验收、实施有稳定引用 |
| 依赖表达 | 可能默认为真实外部服务 | 每 profile 显式 fake / disabled / controlled / blocked | 不伪造 readiness |
| `deterministic_fixture.*` | 与普通配置混写 | 仅 `ci-test` test entry / `operations-replay` replay run | 防止其进入 `local-dev`、`integration-like` 与 future profile |
| 敏感项 | 可能写 raw endpoint / credential | 仅 opaque ref，具体 provider pending | 防止泄露和产品锁定 |

## 7. 配置设计取舍

| 议题 | 方案 | 采用结论 |
|---|---|---|
| 是否把 production-like 纳入 P0 | 纳入 / 只做方向 | 只做方向；产品、secret provider、观测后端和外部合同未闭合 |
| integration-like 是否要求真实 sibling | 必须真实 / 通过 controlled adapter seam | 采用 controlled seam；不得新增 sibling Cargo 依赖 |
| operations-replay 是否并入 CI | 并入 / 独立 profile | 独立；它需要历史事实、outbox、report 和幂等重放语义 |
| local-dev 是否默认 fake | 默认 fake / 必须真实 | 默认 fake、in-memory、disabled，且不代表验收 |
| fake evidence 是否可证明生产 ready | 可以 / 不可以 | 不可以；fake 只证明 P0 语义和可复现行为 |

## 8. 结构化中间产物

### 8.1 环境 / profile 总表

| 环境 / profile | 用途 | 配置来源 | 外部依赖 | 敏感配置处理 | 差异说明 |
|---|---|---|---|---|---|
| `local-dev` | 本地开发和手动验证 command/query/job 主链 | defaults + 可选严格 JSON + 可选 env + entry-local selector | in-memory logical stores、fake resolver、fake publisher、fake handoff、Sandbox/Runtime disabled 或 blocked | fake ref 或 absent；禁止 raw secret | 可启动、可诊断，不是验收证据 |
| `ci-test` | deterministic contract/domain/application/infra/redaction 测试 | defaults + test JSON + CI env + test-entry `deterministic_fixture.*` | 每 run 隔离的 in-memory stores、fake adapters、fixed clock/id | `deterministic_fixture.source_ref`；禁止 raw secret/body | 输出必须 run-scoped、可复现、脱敏 |
| `integration-like` | 验证 adapter unavailable、degraded、topic / handoff failure 映射 | defaults + integration JSON + env refs + entry selector | controlled / real-like Port adapter；sibling 仍是 runtime seam | credential / endpoint / destination opaque ref | 不要求真实生产 endpoint，不升级 availability |
| `operations-replay` | 重放 publication、projection、reconciliation、cleanup、handoff gap | defaults + replay JSON + env refs + job input + replay-run `deterministic_fixture.*` | 脱敏历史 state / marker / outbox / report refs；fake 或 controlled adapter | historical/fake ref；禁止 raw body | 不修复 truth，不凭 replay 伪造外部完成 |
| `staging-like` | P1 预生产接入和 dry-run | deployment material + env refs | future durable store、bus、resolver、Sandbox、observability | provider ref only | P1/P2 方向，不阻塞 P0 |
| `production-like` | P1/P2 生产运行语境 | approved deployment / operations material | future approved products and exact sibling contracts | provider ref only | 需 ADR、03 回写和运维门禁后才可落地 |

### 8.2 Profile 外部依赖矩阵

| Profile | logical store | resolver / consumer | publication | Sandbox / handoff | observability | clock / id |
|---|---|---|---|---|---|---|
| `local-dev` | in-memory | fake / placeholder | fake publisher | disabled / fake | local safe sink | deterministic or local |
| `ci-test` | isolated in-memory | deterministic fake | fake with asserted topic-neutral binding | fake failure injection | deterministic test sink | fixed / sequence |
| `integration-like` | in-memory or controlled durable-like | controlled seam, unavailable 可模拟 | controlled publisher / bus seam | controlled / blocked | safe diagnostic sink | controlled |
| `operations-replay` | de-identified replay-input store | snapshot / replay resolver | pending outbox replay + fake publisher | replay target / blocked | redacted report sink | replay clock / deterministic |
| `staging-like` | future durable | future approved adapters | future bus | future approved target | future backend | runtime provider |
| `production-like` | future production durable | future exact contracts | future production route | future sandbox / handoff | future backend | approved provider |

### 8.3 Profile 配置来源矩阵

| Profile | Defaults | JSON file | Environment | Entry-local | `deterministic_fixture.*` / replay input | Secret ref |
|---|---|---|---|---|---|---|
| `local-dev` | required and sufficient | optional | optional | optional selector | ordinary fake / placeholder only；不使用 `deterministic_fixture.*` | fake / absent |
| `ci-test` | required | test file when suite needs override | CI-safe selector only | run-scoped selector | only test-entry deterministic scenarios may enable it | fake ref only |
| `integration-like` | required baseline | required | allowed refs / selector | current entry / job only | controlled adapter seam 的场景选择 / 故障注入；不使用 `deterministic_fixture.*` | credential / endpoint ref only |
| `operations-replay` | required baseline | required replay file | allowed selectors | required job request source | replay-run `deterministic_fixture.*` / de-identified replay ref as required by the scenario | historical / fake ref only |
| `staging-like` | required baseline | required deployment file | operations-controlled refs | restricted | `deterministic_fixture.*` rejected | provider ref |
| `production-like` | required baseline | approved deployment file | restricted refs | restricted | `deterministic_fixture.*` and replay override rejected | provider ref |

### 8.4 Profile 测试 / 验收承接矩阵

| Profile | 测试承接 | 验收承接 | 不得误用 |
|---|---|---|---|
| `local-dev` | smoke、手工边界检查 | 不作为正式验收 evidence | 不证明外部联调或 production readiness |
| `ci-test` | contract、domain、application、fake adapter、forbidden-body、duplicate replay | P0 自动化语义证据 | 不证明真实 DB/Bus/Runtime/Sandbox |
| `integration-like` | unavailable/degraded、无 fake fallback、handoff gap、topic key 完整性 | seam / failure mapping evidence | 不要求 sibling 已 ready |
| `operations-replay` | outbox/projection/reconciliation/cleanup/handoff 重放 | operations recovery evidence | 不修改 Host Truth 或使用 raw history |
| `staging-like` | future deployment / real-like dry-run | P1 release evidence | 不阻塞 P0 |
| `production-like` | future production validation / runbook | P1/P2 operations evidence | 不能由本 Step 宣称已通过 |

### 8.5 Profile 停审记录

| Profile | 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|---|
| `local-dev` | defaults 可装配且 fake 不越界 | 通过 | 不作为验收 |
| `ci-test` | 隔离、确定性、脱敏、失败注入 | 通过 | fixture key 由 Step 7 收口 |
| `integration-like` | 不增加源码依赖且能表达 blocked/degraded | 通过（保留上游 blocker） | exact adapter schema pending |
| `operations-replay` | 不修复 truth、重放输入可定位 | 通过 | report/artifact 细节交给 Step 12 |
| `staging-like` | 明确 P1/P2，不锁具体产品 | 通过 | ADR / 运维文档承接 |
| `production-like` | 不引入 raw secret、不是 P0 门禁 | 通过 | 需 future 设计变更 |

### 8.6 跨 profile 审计表

| 审计项 | 结论 | 缺口 / 修正 |
|---|---|---|
| P0 是否覆盖本地、CI、受控接缝、运维重放 | 通过 | 四个 P0 profile 已覆盖 |
| staging / production 是否被误写成 P0 must-pass | 否 | 仅 future direction |
| fake 是否被升级为 ready / healthy / delivered / accepted | 否 | 保持 fake / unknown / blocked |
| `deterministic_fixture.*` 是否能进入 `local-dev`、`integration-like`、staging / production-like | 否 | profile validator 应拒绝 |
| 是否新增 sibling compile dependency | 否 | 全部通过 Port / event / ref / adapter / fake seam |
| raw secret / body 是否跨 profile 流动 | 否 | 所有 profile fail-closed |
| profile 是否改变主语、state、UoW、幂等或 handoff 层级 | 否 | 这些是 static design boundary |

## 9. 对 `03-详细设计.md` 的影响判定

| 配置结论 | 是否影响 03 | 影响类型 | 03 回写位置 | 处理状态 |
|---|---|---|---|---|
| 固定四个 P0 profile 的配置语义 | 否 | profile 分类，不新增 domain enum | 不适用 | 无回写 |
| future staging / production 仅作方向 | 否 | 范围裁剪 | 不适用 | 无回写 |
| controlled / real-like seam 仍经 Port，不加 sibling Cargo | 否 | 承接依赖裁剪 | 不适用 | 无回写 |
| profile 所有正向未闭合依赖保持 blocked / unknown | 否 | 承接既有错误 / availability 语义 | 不适用 | 无回写 |
| future 真实产品、动态替换、secret provider health 或新 profile enum | 是 | builder / adapter / error / lifecycle 契约 | `03` §4、§13~§15 | future design-change-required；当前不进入 P0 |

## 10. 回填草稿：正式 `04-配置设计.md` §6

> 校准来源：
> - `design-calibration/04_config_step_06_environment_profiles_matrix.md`
>
> 延伸阅读：
> - 建议阅读本文件的“环境 / profile 总表”“Profile 外部依赖矩阵”“Profile 配置来源矩阵”“Profile 测试 / 验收承接矩阵”“停审记录”和“跨 profile 审计表”。

正式 §6 应装配四个 P0 profile、两个 future profile、三张矩阵（外部依赖、来源、测试 / 验收承接）以及 profile 边界说明。正文不得写真实产品、部署命令或 raw secret，不得把 fake evidence 写成生产 readiness。

## 11. 待确认事项

| 事项 | 影响 | 未确认前处理 |
|---|---|---|
| integration-like 的 controlled adapter 具体实现 | 影响 Step 7 配置项和 Step 12 测试承接 | 只保留 adapter ref / blocked marker |
| replay state / report ref 的最终载体 | 影响 operations-replay 的 Step 7/12 字段 | 使用 opaque ref，不锁产品 |
| staging / production 的 durable store、Bus、secret provider、observability | 影响 P1/P2 实施和运维 | 不作为 P0 配置或验收门禁 |
| parallel sibling exact schema | 影响 positive mapper / route | 保持 pending / blocked / placeholder |

## 12. 自检与停审结论

| 检查项 | 结果 | 说明 |
|---|---|---|
| P0 profile 差异可定位 | pass | local-dev、ci-test、integration-like、operations-replay |
| 来源、外部依赖、敏感 ref 和下游用途齐全 | pass | 见 §8.1~§8.4 |
| 普通 fake 与 `deterministic_fixture.*` / future profile 未越界 | pass | profile validator 应 fail-closed |
| 上游 blocker 未伪装 ready | pass_with_upstream_blockers | exact contracts 继续 pending |
| `03` 影响已判定 | pass | 当前无回写 |
| 正式正文未提前创建 | pass | 仅形成回填草稿 |
| 下一步条件 | pass_with_upstream_blockers | 允许进入 Step 7 配置项清单 |

```text
step_06_status = completed / pass_with_upstream_blockers
step_06_gate = pass_with_upstream_blockers
formal_04_write_allowed = false
next_allowed_action = enter_step_07_config_items
implementation_allowed = false
test_execution_allowed = false
commit_allowed = false
```
