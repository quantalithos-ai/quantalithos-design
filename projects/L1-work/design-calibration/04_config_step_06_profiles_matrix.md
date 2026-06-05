# Step 6. 定义环境、部署 profile 与配置矩阵

> 本文件是 `projects/L1-work/04-配置设计.md` 的 Step 6 中间产物。
> 本步定义 local、CI、integration-like、staging-like、production-like 和 operations-replay 下的配置来源、依赖和差异。
> 本步不定义完整配置项清单,不写部署命令,不新增 `RuntimeProfile` 字段或 enum 值,不回写 `03-详细设计.md`。

## 1. Step 状态

- 状态: `[x] 已完成`
- 对应 SOP: `standards/document/配置设计讨论流程_SOP.md` Step 6
- 回填章节: `projects/L1-work/04-配置设计.md` §6 环境、部署 profile 与配置矩阵

## 2. 本步输入

| 输入 | 内容 | 本步使用方式 |
|---|---|---|
| `04_config_step_05_sources_priority_conflicts.md` | 已确认普通来源优先级和 entry local args 局部输入限制 | 固定各 profile 的配置来源和 override 方式 |
| `04_config_step_04_classification_boundaries.md` | 已确认 P0 核心配置冷更新、禁止配置化项和敏感引用边界 | 固定各 profile 的生效方式和不可越界项 |
| `04_config_step_02_scope.md` | 已确认 P0 聚焦默认可验证路径,P1/P2 后移生产字段全集 | 判断哪些 profile 阻塞 P0,哪些只作后续承接 |
| `01-架构设计.md` §7 / §10 / §13 | 运行承载、关键交互和横切关注点 | 确认 api / worker / jobs 可拆分,但配置不得改变 truth 边界 |
| `03-详细设计.md` §13 / §15 | 配置引用、外部依赖绑定、测试切口和报告目录 | 将 profile 差异映射到既有配置控制面和报告路径 |

已确认结论:

```text
L1-work 的 profile 是配置矩阵分类,不是新的详细设计代码契约。
P0 必须覆盖 local-dev、ci-test、integration-like 和 operations-replay。
staging-like 与 production-like 是 P1/P2 承接方向,当前只说明边界,不写真实 DB / MQ / endpoint / KMS 字段全集。
所有 profile 都遵守 code defaults < JSON config file < environment variables,entry local args 只作局部输入。
```

## 3. SOP 问题回答

### 3.1 local / CI / test / staging / prod 分别是否适用?

| 环境 | 是否适用 | 当前口径 |
|---|---|---|
| local | 适用,P0 | 使用 in-memory store、fake resolver、fake publisher、fake handoff、deterministic clock / id 和 local reports 跑通默认可验证路径 |
| CI / test | 适用,P0 | 使用隔离目录、deterministic fake adapters、重复 key / illegal env / redaction gate 验证 |
| integration-like | 适用,P0 / P1 边界 | 使用 configured local / controlled adapter refs,验证跨入口和跨仓接缝,但不要求真实生产 endpoint |
| staging | 适用,P1 | 后续跨仓集成与部署演练语境,不作为当前 P0 必需配置 |
| prod | 适用,P1/P2 | 生产运行和运维语境,真实 endpoint、secret provider、rollout 和 runbook 留给部署运维 |
| operations-replay | 适用,P0 | 用于 outbox、projection、reference refresh、handoff、reconciliation 和 cleanup 的恢复 / 重跑验证 |

### 3.2 每个环境配置来源是什么?

| profile | 配置来源 |
|---|---|
| local-dev | code defaults + optional JSON config file + optional env override + entry local args |
| ci-test | code defaults + test JSON config file + CI environment variables + job local args |
| integration-like | JSON config file + environment variables + entry local args |
| staging-like | 后续部署材料定义,但仍遵守 file / env / secret ref 边界 |
| production-like | 后续部署材料定义,但仍遵守 secret ref、credential ref 和 fail-fast 规则 |
| operations-replay | replay JSON config file + environment variables + job local args |

### 3.3 每个环境依赖哪些外部服务?

P0 local-dev 和 ci-test 不依赖真实外部服务。integration-like 可以接入 controlled fake / configured adapters,但不能要求真实生产 endpoint。operations-replay 依赖本地或脱敏的历史状态、outbox、projection、reference snapshot、handoff 和 report root。

真实 durable database、real event bus、real identity / conversation / method / process / governance / artifact / runtime adapter、real observability / archive handoff 和 secret provider 属于 P1/P2 接入,不作为 P0 通过前置。

### 3.4 敏感配置在不同环境如何处理?

| profile | 敏感配置处理 |
|---|---|
| local-dev | 不需要真实 secret;可使用 fake `CredentialRef` / `SecretRef`;raw secret 禁止 |
| ci-test | 只允许 fixture ref 或不可解析假引用;报告和日志必须证明无 raw secret |
| integration-like | 允许 configured credential ref;真实 material 不进入普通配置 |
| staging-like | 只允许运维注入 secret material,04 只写 ref 边界 |
| production-like | 真实 material 由安全运维和 secret provider 管理,04 不写真实值 |
| operations-replay | 只读取脱敏引用和 historical ref;不得把历史 raw secret 写入配置或报告 |

### 3.5 哪些环境差异会影响测试和验收?

| 差异 | 影响的测试 / 验收方向 |
|---|---|
| in-memory vs durable-like store | repository transaction、rollback、idempotency 和 projection rebuild 测试 |
| fake vs configured resolver | unresolved、source unavailable、evidence unavailable 和 degraded marker 测试 |
| fake vs configured publisher | outbox publish、retry、failed 和 fake marker 验收 |
| fake vs configured handoff | trace / archive handoff retry、failed、redaction 和 evidence 验收 |
| deterministic vs system clock / id | fixture repeatability、id ordering、trace / audit / outbox id 断言 |
| local report root vs run-scoped artifact root | `artifacts/test/<run_id>` 与 `reports/` 证据路径门禁 |
| redaction strictness | forbidden body、raw secret、raw payload 一票否决项 |
| operations-replay | rerun、partial failure、idempotency window 和 reconciliation diagnostic 验收 |

## 4. 当前文档问题诊断

| 位置 | 当前问题 | 影响 |
|---|---|---|
| `04-配置设计.md` | 本 Step 撰写时尚未存在 profile 配置矩阵;当前已回填正式 §6 | 历史风险已关闭;实现时以正式 `04` 为准 |
| `04_config_step_05_sources_priority_conflicts.md` | 已有来源优先级,但未落到具体 profile | 测试方案无法直接形成环境矩阵 |
| `03-详细设计.md` §13 | 已有配置引用,但不写环境差异 | 需要 04 补充 profile 与来源 / 依赖关系 |
| 当前旧 `05/06` | 本 Step 撰写时未按新版 profile 重校准;当前已生成正式 `05/06` | 历史风险已关闭;测试验收以正式 `05/06` 为准 |

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 环境口径 | 只有 local / CI / integration-like / production-like 的方向 | 明确 local-dev、ci-test、integration-like、operations-replay 为 P0 主 profile | 支撑默认可验证路径和恢复验证 |
| staging / prod | 容易被写成当前完整配置 | 明确为 P1/P2 承接方向 | 避免虚构生产字段 |
| 敏感配置 | 只有 ref 边界 | 按 profile 说明 fake ref、fixture ref、configured ref 和 ops secret material 的边界 | 支撑 Step 8 |
| 测试验收承接 | 未定位差异项 | 明确 store、resolver、publisher、handoff、clock / id、report、redaction、replay 的测试影响 | 支撑 `05/06` 重校准 |

## 6. 配置设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A: 只按 dev / test / staging / prod 四环境写 | 通用易懂 | 无法表达 operations replay 和 integration-like 接缝验证 |
| 方案 B: P0 按 local-dev / ci-test / integration-like / operations-replay 写,P1/P2 保留 staging-like / production-like | 覆盖默认实现、CI、接缝和恢复验证,同时不虚构生产字段 | profile 名称更多,需要解释 |
| 方案 C: 直接把 staging / prod 字段全集写入 04 | 看似完整 | 会预支 DB / MQ / endpoint / KMS 产品字段 |
| 方案 D: 新增详细设计 `RuntimeProfile` enum 值 | 实现显式 | 当前只是配置矩阵分类,过早回写代码契约 |

推荐方案 B。

原因:

- L1-work 既有 api / worker / jobs,也有 outbox、projection、reference refresh、handoff 和 reconciliation job,只写 dev / test / prod 不足以指导测试。
- integration-like 能验证跨仓接缝,operations-replay 能验证恢复和报告证据,都属于 P0 默认可验证路径的一部分。
- staging-like / production-like 需要真实外部依赖和运维材料,当前只保留边界更稳妥。

## 7. 结构化中间产物

### 7.1 环境 / profile 配置矩阵

| 环境 / profile | 用途 | 配置来源 | 外部依赖 | 敏感配置处理 | 差异说明 |
|---|---|---|---|---|---|
| local-dev | 本地开发、api / worker / job 手动验证、最小主链调试 | defaults + optional JSON + optional env + entry args | 本地进程、in-memory store、fake resolver、fake publisher、fake handoff、deterministic clock / id | fake ref 或无 secret;raw secret 禁止 | 不代表验收通过,但必须跑通默认路径 |
| ci-test | 自动化测试、隔离目录、确定性 fixture | defaults + test JSON + CI env + job args | 临时目录、deterministic fake adapters、no-op / fake publisher | fixture ref 或不可解析假引用;报告不得泄露 | 所有路径 run-scoped,失败可复现 |
| integration-like | 跨入口和跨仓接缝验证 | JSON + env + entry args | configured local / controlled resolver、publisher、handoff、store profile | configured credential ref;raw material 不进入普通配置 | 验证接口接缝,不要求真实生产 endpoint |
| operations-replay | outbox、projection、reference refresh、handoff、reconciliation、cleanup 重跑 | replay JSON + env + job args | 脱敏历史状态、outbox、projection、reference snapshot、handoff 和 report root | historical ref / fake ref;raw secret 禁止 | 验证恢复、幂等、partial failure 和 diagnostic |
| staging-like | 后续跨仓集成和部署演练 | 部署材料定义,仍遵守 file / env / ref 边界 | real-like DB、event bus、resolver、handoff、secret provider | 只允许 ref,secret material 由运维注入 | P1,不阻塞 P0 |
| production-like | 生产运行和运维语境 | 部署 / 运维材料定义 | real DB / event bus / source adapters / handoff / secret provider | raw secret 不进入 04;由安全运维管理 | P1/P2,04 只定义设计边界 |

### 7.2 profile 到测试验收承接表

| profile | 应进入测试方案的场景 | 应进入验收标准的门禁 |
|---|---|---|
| local-dev | 默认配置启动、fake adapter、local reports、非法路径 fail-fast | 默认可验证路径可运行,但不能单独代表生产验收 |
| ci-test | duplicate key、illegal env、missing required、redaction check、deterministic fixtures | CI 能稳定复现成功路径和配置错误 |
| integration-like | configured resolver / publisher / handoff、external unavailable、fake marker 区分 | configured 接缝不伪造 production success |
| operations-replay | replay、rerun、partial failure、idempotency window、reconciliation report | 恢复不产生第二 truth,证据路径稳定 |
| staging-like | 真实依赖 dry-run、secret ref、deployment config validation | P1 接入前不能泄露 secret 或绕过红线 |
| production-like | 运维变更、rollout / rollback、secret provider、audit | 真实值和 runbook 不在 04 中硬编码 |

### 7.3 profile 阶段映射表

| profile | 阶段 | 是否阻塞 P0 | 说明 |
|---|---|---|---|
| local-dev | P0 | 是 | 最小开发和默认路径验证 |
| ci-test | P0 | 是 | 自动化测试和门禁 |
| integration-like | P0 / P1 边界 | 是,但只要求 controlled adapter | 验证接缝,不要求真实生产 endpoint |
| operations-replay | P0 | 是 | 验证恢复、重跑、报告和 diagnostic |
| staging-like | P1 | 否 | 跨仓集成与部署演练 |
| production-like | P1/P2 | 否 | 生产配置和运维专项 |

## 8. 对详细设计的影响判定

| 配置结论 | 是否影响 03 | 影响类型 | 03 回写位置 | 处理状态 |
|---|---|---|---|---|
| profile 作为配置矩阵分类,不新增 `RuntimeProfile` 字段或 enum 值 | 否 | 无代码契约变化 | 无 | 无回写 |
| local-dev / ci-test / integration-like / operations-replay 通过既有配置控制面表达差异 | 否 | 配置取值差异 | 无 | 无回写 |
| staging-like / production-like 只作 P1/P2 承接方向 | 否 | 范围裁剪 | 无 | 无回写 |
| profile 差异将由 `05/06/07` 承接测试、验收和实施 | 否 | 下游承接 | 无 | 无回写 |

说明:

```text
本步没有新增 runtime builder 参数、profile enum、adapter constructor 参数或错误枚举。
如果 Step 7 需要把 profile 固化为正式 enum value,必须在 Step 14 记录是否回写 `03-详细设计.md`。
```

## 9. 回填草稿

正式 `04-配置设计.md` §6 建议采用以下结构:

```text
6. 环境、部署 profile 与配置矩阵
  6.1 环境 / profile 配置矩阵
  6.2 profile 到测试验收承接表
  6.3 profile 阶段映射表
  6.4 对 03-详细设计的影响判定
```

必须引用:

| 正式章节 | 引用来源 |
|---|---|
| §6.1 | `design-calibration/04_config_step_06_profiles_matrix.md` §7.1 |
| §6.2 | `design-calibration/04_config_step_06_profiles_matrix.md` §7.2 |
| §6.3 | `design-calibration/04_config_step_06_profiles_matrix.md` §7.3 |
| §6.4 | `design-calibration/04_config_step_06_profiles_matrix.md` §8 |

## 10. 待确认事项

无阻塞进入 Step 7 的待确认事项。

后续 Step 必须继续收口:

- Step 7 按本步 profile 说明每个配置项的默认值、来源、作用域和失败策略。
- Step 8 明确各 profile 下 `SecretRef` / `CredentialRef` 的存储、轮换和审计要求。
- Step 11 明确 local / CI / integration-like / operations-replay 下配置缺失和外部依赖不可用的 fail-fast / degraded 策略。
- `05/06/07` 后续必须按本 profile 矩阵重新校准。

## 11. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| P0 profile 已明确 | 通过 | §7.1 / §7.3 |
| staging / prod 适用口径已明确 | 通过 | §3.1 / §7.1 |
| 敏感配置 profile 边界已明确 | 通过 | §3.4 |
| 对 03 影响已有判定 | 通过 | §8 当前无回写 |
| 可以进入 Step 7 | 通过 | 下一步定义配置项清单和模块级 JSON demo |
