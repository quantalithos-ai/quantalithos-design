# Step 6. 定义环境、部署 profile 与配置矩阵

> 本文件是 `projects/L1-process/04-配置设计.md` 的 Step 6 中间产物。
> 本步定义不同环境和部署 profile 下配置来源、外部依赖、敏感配置处理和差异。

## 1. Step 状态

- 状态: `[x] 已完成`
- 对应 SOP: `standards/document/配置设计讨论流程_SOP.md` Step 6
- 回填章节: `projects/L1-process/04-配置设计.md` §6 环境、部署 profile 与配置矩阵

## 2. 本步输入

| 输入 | 用途 | 结论 |
|---|---|---|
| Step 5 来源优先级 | 定义 profile 下配置来源 | P0 profile 使用 defaults / JSON / env / entry args |
| `01-架构设计.md` 部署边界 | 区分 local / CI / integration / production | 生产真实产品字段不在本轮硬编码 |
| `03_ddd_step_14_config_external_binding.md` adapter defaults | 定义 fake / in-memory / deterministic path | local / CI 默认 fake / in-memory |
| `03_ddd_step_16_test_cuts.md` | 定义配置测试输入 | config validation、fake adapter wiring、forbidden dependency scan 必须可测试 |

## 3. SOP 问题回答

### 3.1 local / CI / test / staging / prod 分别是否适用?

适用。P0 正式覆盖 `local-dev`、`ci-test`、`integration-like` 和 `operations-replay`。`staging-like` 与 `production-like` 作为 P1/P2 承接方向,不阻塞 P0。

### 3.2 每个环境配置来源是什么?

见 §4 环境配置矩阵。P0 均使用 defaults、JSON、env 和 entry args 的组合,不要求 config center。

### 3.3 每个环境依赖哪些外部服务?

local / CI 默认不依赖真实外部服务,使用 fake resolver、fake publisher、fake handoff、in-memory store。integration-like 可配置受控 resolver / publisher / handoff / store。production-like 后续由部署与运维定义。

### 3.4 敏感配置在不同环境如何处理?

所有 profile 都禁止 raw secret。local / CI 可使用 fake ref 或不可解析假引用验证 redaction。integration-like / staging-like / production-like 只能提供 secret / credential / endpoint ref,真实解析由受控 adapter 或运维 secret provider 完成。

### 3.5 哪些环境差异会影响测试和验收?

| 差异 | 影响 |
|---|---|
| fake vs configured adapter | 测试必须区分 fake marker 和 configured success / failure |
| in-memory vs durable store | 验收不能把 in-memory 结果当作生产容量证明 |
| fixed clock / sequence id vs system runtime | CI 需要 deterministic;runtime profile 需要记录时间来源 |
| outbox fake publisher vs bus publisher | publish success 语义和 retry marker 需要分开验证 |
| handoff fake vs real sink | trace / archive handoff 不得保存 sink body |

## 4. 结构化中间产物

### 4.1 环境配置矩阵

| 环境 / profile | 用途 | 配置来源 | 外部依赖 | 敏感配置处理 | 差异说明 |
|---|---|---|---|---|---|
| local-dev | 本地开发、api / worker / job 手动验证、最小主链调试 | defaults + optional JSON + optional env + entry args | in-memory store、fake resolver、fake publisher、fake handoff、fixed clock / sequence id | fake ref 或无 secret;raw secret 禁止 | 不代表验收通过,但必须跑通默认路径 |
| ci-test | 自动化测试、隔离目录、确定性 fixture | defaults + test JSON + CI env + job args | temporary in-memory store、deterministic fake adapters、fake publisher / handoff | fixture ref 或不可解析假引用;报告不得泄露 | 所有路径 run-scoped,失败可复现 |
| integration-like | 跨入口和跨仓接缝验证 | JSON + env + entry args | configured local / controlled resolver、publisher、handoff、store profile | configured credential ref;raw material 不进入普通配置 | 验证接口接缝,不要求真实生产 endpoint |
| operations-replay | outbox、projection、reference refresh、handoff、recovery maintenance、reconciliation 重跑 | replay JSON + env + job args | 脱敏历史状态、outbox、projection、reference snapshot、handoff 和 report ref | historical ref / fake ref;raw secret 禁止 | 验证恢复、幂等、partial failure 和 diagnostic |
| staging-like | 后续跨仓集成和部署演练 | 部署材料定义,仍遵守 file / env / ref 边界 | real-like DB、event bus、resolver、handoff、secret provider | 只允许 ref,secret material 由运维注入 | P1,不阻塞 P0 |
| production-like | 生产运行和运维语境 | 部署 / 运维材料定义 | real DB / event bus / source adapters / handoff / secret provider | raw secret 不进入 04;由安全运维管理 | P1/P2,04 只定义设计边界 |

### 4.2 profile 到测试验收承接

| profile | 应进入测试方案的场景 | 应进入验收标准的门禁 |
|---|---|---|
| local-dev | 默认配置启动、fake adapter、local reports、非法路径 fail-fast | 默认可验证路径可运行,但不能单独代表生产验收 |
| ci-test | duplicate key、illegal env、missing required、redaction check、deterministic fixtures | CI 能稳定复现成功路径和配置错误 |
| integration-like | configured resolver / publisher / handoff、external unavailable、fake marker 区分 | configured 接缝不伪造 production success |
| operations-replay | replay、rerun、partial failure、idempotency window、reconciliation report | 恢复不产生第二 truth,证据路径稳定 |
| staging-like | 真实依赖 dry-run、secret ref、deployment config validation | P1 接入前不能泄露 secret 或绕过红线 |
| production-like | 运维变更、rollout / rollback、secret provider、audit | 真实值和 runbook 不在 04 中硬编码 |

## 5. 对详细设计的影响判定

| 配置结论 | 是否影响 03 | 影响类型 | 03 回写位置 | 处理状态 |
|---|---|---|---|---|
| P0 profile 为 local-dev / ci-test / integration-like / operations-replay | 否 | 配置矩阵分类,不新增代码 enum | 无 | 无回写 |
| staging-like / production-like 后移 P1/P2 | 否 | 范围裁剪 | 无 | 无回写 |
| fake / in-memory profile 必须输出 fake marker,不得伪装 production | 否 | 配置安全语义 | 无 | 无回写 |

## 6. 回填草稿

`04-配置设计.md` §6 应说明 P0 profile 包括 `local-dev`、`ci-test`、`integration-like` 和 `operations-replay`。`staging-like` 与 `production-like` 只作为 P1/P2 承接方向。所有 profile 都禁止 raw secret,configured adapter 必须使用 ref,不得把 fake success 当作 production success。

## 7. 待确认事项

- 无阻塞 Step 7 的待确认事项。
- Step 7 需要按 profile 默认值展开 P0 配置项。

## 8. 进入下一步条件

- P0 环境和 profile 差异可定位。
- 敏感配置处理方向明确。
- 详细设计影响判定为无回写。
