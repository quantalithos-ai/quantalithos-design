# Step 6. 定义环境、部署 profile 与配置矩阵

> 对应 SOP：`standards/document/配置设计讨论流程_SOP.md` Step 6
> 正式回填：`04-配置设计.md` §6
> 状态：`completed / pass_with_upstream_blockers / stop_review`（连续授权下进入 Step 7）

## 1. Step 状态与输入

| 项 | 结论 |
|---|---|
| 当前 Step | Step 6：环境、部署 profile 与配置矩阵 |
| 输入 | Step 5 的 `DECL < strict JSON < allow-listed ENV` 来源链；03 §13～§15；架构部署边界；旧 05/06 仅作方向输入 |
| 输出 | profile 语义、依赖矩阵、来源矩阵、敏感配置处理、测试/验收差异和停审记录 |
| 本步限制 | 不给真实 endpoint、DSN、provider、密钥、容量/RTO/RPO 数值、部署命令或生产就绪结论 |
| 下一动作 | 更新 flow/台账后进入 Step 7 |

## 2. SOP 问题回答

| 问题 | 回答 |
|---|---|
| local / CI / test / staging / prod 是否适用？ | 定义 `local-dev`、`ci-test`、`integration-like`、`operations-replay` 四个当前可用于校准和负向验证的逻辑 profile；`staging-like` 与 `production-like` 只作为 P1/P2 方向，不是当前必须通过的 profile。`local-dev` 和 `ci-test` 明确属于 test assembly lane，不代表生产能力。 |
| 每个 profile 的配置来源是什么？ | 所有 profile 均遵循 Step 5 的 `DECL < strict JSON < allow-listed ENV`。profile 选择和普通值只能来自已登记字段；测试 fixture、回放输入和 job input 是 test/entry 数据，不得成为生产配置覆盖源。 |
| 每个 profile 依赖哪些外部服务？ | `local-dev`/`ci-test` 使用 in-memory 或确定性 test adapter；`integration-like` 通过 runtime/adapter seam 连接受控 real-like 能力；`operations-replay` 使用脱敏 replay refs；`staging-like`/`production-like` 仅声明未来正式 store、source、integrity、storage、receiver、observability 合同，产品未锁定前保持 blocked。 |
| 敏感配置如何处理？ | 所有 profile 都禁止 raw secret、token、private key、DSN 和 provider response 进入普通 JSON/ENV。local/CI 只允许 test-only opaque ref；integration/replay 允许经审计的 opaque endpoint/credential ref；staging/production 只允许未来 secret-provider ref。 |
| 环境差异如何影响测试和验收？ | `ci-test` 验证类型、冲突、缺 slot、redaction、幂等和 fail-closed；`integration-like` 验证 adapter unavailable/degraded、路由错配和 unknown；`operations-replay` 验证旧 binding、partial、reconcile 和报告闭包；staging/production 的真实外部成功仍由后续测试/验收与 owner 合同决定。 |

## 3. 当前材料问题诊断

| 材料 | 问题 | 当前处置 |
|---|---|---|
| 旧 README / 旧 05/06 | 含 S3/MinIO、PostgreSQL、Glacier、固定保留年限、旧性能数字和未核验环境假设 | 仅 `historical_material`；不进入 profile 名称、依赖或默认值 |
| 03 §13/Step 14 | 已固定 reader、builder、11 类 slot 和 fake 仅测试边界，但没有 profile 矩阵 | 本步补齐 profile 语义，不新增 runtime enum 或 provider |
| 外部 owner 合同 | source/export、governance、storage、integrity、receiver、observability 未闭合 | 每个 profile 继续标 `Blocked`/`Unknown`/`Unsupported`；不以环境名关闭 blocker |
| 部署细节 | 文件路径、环境变量名、挂载、拓扑未授权 | 留给部署/运维；本步只定义配置来源类别 |

## 4. 设计取舍

| 议题 | 采用方案 | 理由 |
|---|---|---|
| 是否把 production-like 纳入 P0 必过 | 否，仅作未来方向 | 真实 provider、secret、容量和 owner 合同均未闭合 |
| local-dev 是否允许 fake | 允许，但仅标为 test assembly lane | 与 03 的 fake-only-test 边界一致；绝不作为 production fallback |
| integration-like 是否要求 sibling 仓真实部署 | 否，通过 runtime/event/ref/adapter seam | 保持全局依赖分类，不把运行期依赖伪装成 compile dependency |
| operations-replay 是否并入 CI | 否，单独 profile | 回放有 pinned config/binding identity、脱敏材料和 partial/reconcile 语义 |
| profile 是否能改变 required slot | 不能 | required set 由 exposed surface/selected target 在 assembly begin 冻结 |

## 5. 结构化中间产物

### 5.1 环境 / profile 总表

| 环境 / profile | 用途 | 配置来源 | 外部依赖 | 敏感配置处理 | 差异说明 |
|---|---|---|---|---|---|
| `local-dev` | 本地 schema、domain、编排和安全负向验证 | DECL；可选 strict JSON；allow-listed ENV | in-memory local store；test-only deterministic adapters；未闭合 slot 保持 blocked | test-only opaque ref 或 absent；禁止 raw secret | 可构造局部 assembly；不证明 owner、storage、integrity、restore 成功 |
| `ci-test` | 可重复的 contract/domain/application/infra 测试 | DECL；测试 JSON；CI-safe ENV leaves | isolated in-memory store；deterministic fake/fixture；故障注入 | fixture ref；禁止真实凭据和原文 | 产物只作为 planned test input；不得作为验收/readiness 事实 |
| `integration-like` | adapter seam、slot mismatch、degraded、unknown 和路由验证 | strict JSON；allow-listed ENV refs | controlled/real-like adapter seam；仍不进入 Cargo graph | opaque endpoint/credential ref；解析失败即 blocked | 仅验证边界和失败映射，不承诺生产端点可用 |
| `operations-replay` | pinned operation/job replay、partial、probe/reconcile 校准 | strict replay JSON；allow-listed ENV；job input 仅作入口数据 | 脱敏历史 state/ref、受控 test adapter | replay/ref locator；禁止 raw body/secret | 必须使用旧 operation 的 config/binding identity；不以当前配置重建 |
| `staging-like` | P1/P2 真实依赖接入前的预生产方向 | deployment material + allow-listed ENV + future secret refs | future durable store、source、storage、receiver、observability | 仅 opaque secret-provider ref | 不属于当前 P0 gate；合同未闭合时仍 blocked |
| `production-like` | P1/P2 生产运行边界 | deployment/operations material + secret-provider ref | future approved external adapters | secret-provider ref only；禁止普通配置明文 | 不声明真实可用、合规、RTO/RPO、readiness 或验收通过 |

### 5.2 Profile 外部依赖矩阵

| Profile | local store/UoW | source/authority/visibility | integrity/compatibility | archive storage/lifecycle | restore receiver | observability |
|---|---|---|---|---|---|---|
| `local-dev` | in-memory/test-only；无原子能力不得标 Ready | deterministic test seam 或 blocked | fake/blocked；不生成真实 digest/signature | fake/blocked；不生成 commit | fake/blocked；不写 owner truth | safe local sink/test capture；不成为 evidence |
| `ci-test` | isolated deterministic test store | exact fake per `SourceClass`/owner；可注入 missing/conflict | deterministic negative/contract outcomes | fake effect/probe；commit-unknown 可注入 | per-owner fake outcome/compensation | redaction canary；sink failure不改业务结果 |
| `integration-like` | controlled durable-like seam，能力未闭合则 blocked | runtime adapter/ref；不使用 workspace fallback | capability ref；Unknown/Unsupported 保留 | target/effect/probe seam；ACK不等 commit | per-owner receiver seam | safe telemetry + optional handoff ref；backend未选 |
| `operations-replay` | replay store/read model；不绕过 UoW 语义 | pinned source refs/coverage；不读取当前 owner body 猜补 | replayed assessment refs；不可重算或升级姿态 | pinned placement/action identity；只 reconcile | pinned owner handoff refs | redacted replay signals；不生成新 audit truth |
| `staging-like` | future approved durable store/UoW | future owner contracts | future approved capability | future storage/governance contract | future owner receiver contract | future observability material seam |
| `production-like` | future production durable store/UoW | formal owner bindings required | formal algorithm/key/schema authority required | formal location/tier/commit/probe required | formal per-owner import/restore required | formal safe sink/material contract required |

### 5.3 Profile 来源与敏感矩阵

| Profile | JSON 文件 | ENV leaves | fixture/replay/job input | secret locator | production fake 是否允许 |
|---|---|---|---|---|---|
| `local-dev` | 可选；存在则 strict | 仅 allow-listed | fixture 仅 test assembly | test ref/absent | 否，production lane 不适用 |
| `ci-test` | 测试场景需要时必需 | CI-safe allow-list | fixture 必须显式注入 | test ref only | 否 |
| `integration-like` | 必需 | ref/profile leaves | scenario input 不覆盖 config | opaque ref | 否 |
| `operations-replay` | 必需 | replay/job binding leaves | replay ref 必须 pinned | historical/test ref | 否 |
| `staging-like` | 必需 | 受控 ref leaves | 不接收 fixture override | future secret-provider ref | 否 |
| `production-like` | 必需 | 受控 ref leaves | fixture/replay override 拒绝 | future secret-provider ref only | 否 |

### 5.4 测试 / 验收承接矩阵

| Profile | 05 测试承接 | 06 验收承接 | 不得误用 |
|---|---|---|---|
| `local-dev` | schema、domain、局部编排和安全负向 | 不形成外部成功证据 | 不证明 production readiness |
| `ci-test` | source precedence、strict parse、slot closure、fake parity、redaction、duplicate replay | P0 本地可判定门禁 | 不证明真实 owner/storage/receiver |
| `integration-like` | adapter unavailable/degraded、wrong slot、unknown/commit-unknown、route mismatch | 接缝证据输入 | 不要求真实供应商成功 |
| `operations-replay` | pinned binding、partial/resume、probe/reconcile、history/result 对称 | 运维回放输入 | 不修复上游 truth，不伪造 digest/evidence |
| `staging-like` | P1 real-like 合同测试 | P1 gate（未来） | 当前不阻塞 P0 |
| `production-like` | 真实外部与运维测试（未来） | 生产门禁（未来） | 不在本轮声明通过 |

## 6. Profile 停审与跨 profile 审计

| 审计项 | 结论 | 缺口 / 修正 |
|---|---|---|
| P0 是否覆盖本地、CI、接缝、回放 | 通过 | `local-dev`、`ci-test`、`integration-like`、`operations-replay` 各有用途 |
| staging/production 是否被误写成 P0 must-pass | 否 | 明确 P1/P2 方向 |
| fake 是否可能作为 production fallback | 否 | production-like 明确拒绝 test fixture/fake |
| profile 是否改变 source authority、项目状态、UoW、Query no-write 或恢复写权 | 否 | 这些属于禁止配置化红线 |
| profile 是否引入 sibling compile dependency | 否 | 所有外部服务均 runtime/event/ref/adapter |
| profile 是否携带 raw secret/body | 否 | 全部使用 opaque locator 或 test ref |
| 旧 05/06 是否覆盖当前矩阵 | 否 | 仅作为 historical direction |

## 7. 对 `03-详细设计.md` 的影响判定

| 配置结论 | 是否影响 03 | 影响类型 | 03 回写位置 | 处理状态 |
|---|---|---|---|---|
| 六个 profile 只定义配置语义和测试/运行姿态，不新增 runtime enum | 否 | profile 矩阵 | 不适用 | 无回写 |
| local/CI 的 fake 只进入 test assembly，production builder 不 fallback | 否 | 既有 adapter 边界承接 | 不适用 | 无回写 |
| integration/replay 使用 runtime/ref/adapter，不改变 compile graph | 否 | 依赖分类承接 | 不适用 | 无回写 |
| future 若新增动态 adapter replacement、secret provider API、profile-specific constructor/port/error/DTO/flow | 是（未来触发） | 代码契约变化 | 03 §4～§15 与对应 Step | 无回写（未来触发前暂停并回写） |

最后一项是未来能力触发器，不是当前已确认契约；在触发前不得进入实现或正式配置项。

## 8. 回填草稿与进入下一步条件

正式 §6 应回填 §5.1～§5.4 的四张矩阵、P0/P1/P2 说明、fake 与 blocker 边界及本步影响判定。不得写真实 endpoint、产品名、部署路径、secret 名、容量数字或 production readiness。

| 条件 | 状态 |
|---|---|
| P0 profile 差异可定位 | 通过 |
| 每个 profile 的来源、依赖和敏感处理可判定 | 通过 |
| 测试/验收能直接承接 profile 差异 | 通过 |
| 外部 blocker 未被 profile 名称掩盖 | 通过 |
| 03 影响判定无当前待回写项 | 通过；future 能力仍为硬门禁 |
| 可进入 Step 7 | 通过 |
