# Step 2. 明确配置设计目标、范围和非范围

> 本文件是 `projects/L1-process/04-配置设计.md` 的 Step 2 中间产物。
> 本步定义本轮配置设计要覆盖的 P0 配置控制面、后移的 P1/P2 配置方向和明确非范围。

## 1. Step 状态

- 状态: `[x] 已完成`
- 对应 SOP: `standards/document/配置设计讨论流程_SOP.md` Step 2
- 回填章节: `projects/L1-process/04-配置设计.md` §2 本次配置设计目标与范围

## 2. 本步输入

| 输入 | 用途 | 结论 |
|---|---|---|
| Step 1 输入边界 | 固定配置设计事实源 | 以 `00/01/02/03` 为上游,不由 `05/06` 反向定义配置 |
| `03_ddd_step_14_config_external_binding.md` | 固定 `ProcessRuntimeConfig` section | store、boundary、idempotency、projection、jobs、external、outbox、handoff、features、runtime 均进入 P0 配置范围 |
| `02-概要设计.md` §11 | 识别配置影响轮廓 | command / query / consumer / jobs / outbox / handoff / external mirror 均受配置影响 |
| `03-详细设计.md` §17 | 识别下游缺口 | `04` 缺失阻塞配置实现和 production adapter |

## 3. SOP 问题回答

### 3.1 P0 必须定义哪些配置才能运行主链?

P0 必须定义:

- runtime bootstrap: 配置加载、校验和 runtime builder 装配。
- store: in-memory / durable adapter kind、transaction timeout、optimistic conflict assertion。
- boundary: command body size、query page limit、query timeout。
- idempotency: command retention、event dedup retention、job retention、reserved record max age。
- projection: projection adapter、stale threshold、rebuild batch size。
- jobs: default batch size、max parallelism、job timeout、retry backoff。
- external: 7 个 source resolver adapter、resolver timeout、resolver retry。
- outbox: publisher adapter、publish batch、publish retry、topic map。
- handoff: trace target、archive target、delivery timeout、delivery retry。
- features: derived views、search。
- runtime: clock kind、id generator kind。
- redaction / forbidden body: 作为禁止配置化和验证策略,不得变成可关闭开关。

### 3.2 哪些配置属于 P1 / P2 或后续扩展?

| 阶段 | 配置方向 | 当前口径 |
|---|---|---|
| P1 | durable store 产品字段、真实 event bus、真实 resolver endpoint、真实 handoff endpoint、secret provider | 保留 adapter / ref / credential 控制面,不写产品字段全集 |
| P1 | staging-like / production-like profile | 保留矩阵和门禁,不填真实生产值 |
| P2 | remote config center、admin override、hot reload、dashboard / alert threshold | 只在演进和风险中说明 |
| P2 | full production runbook、容量 / SLO 数值硬化 | 后移部署与运维、测试 / 验收专项 |

### 3.3 哪些配置细节应留给部署与运维手册?

- 真实环境文件路径和挂载方式。
- 容器、systemd、Kubernetes、secret provider、config center 操作步骤。
- 真实 DB / MQ / KMS / Vault / object storage 产品字段全集。
- 告警阈值、dashboard、on-call 处置和变更流程工具字段。
- 真实 secret material 的生成、分发和轮换操作。

### 3.4 哪些配置细节应留给实施计划?

- 哪个 commit 实现 config loader、validator、runtime builder 和 adapter binding。
- P0 fake / in-memory / deterministic adapters 的编码顺序。
- 配置测试和门禁脚本进入哪个 phase。
- 实现仓 git config、branch / commit boundary 和回退策略。

### 3.5 哪些非范围仍有残余风险?

| 非范围 | 残余风险 | 本轮处理 |
|---|---|---|
| production durable store 产品字段 | 实现者可能临时发明 DSN / pool / migration 字段 | 在 Step 14 记录,未回写 03 前不得实现真实 durable adapter |
| real event bus / source resolver endpoint | topic / endpoint / credential 可能漂移 | 保留 topic map 和 endpoint ref,不填 raw endpoint secret |
| remote config / hot reload | 运行中变更可能绕过 validation | 当前 P0 不支持 hot reload |
| 真实运维 runbook | 配置变更流程不完整 | Step 12 交给部署与运维手册 |

## 4. 结构化中间产物

### 4.1 配置设计目标

| 目标 | 说明 | 交付给下游的结果 |
|---|---|---|
| 定义 P0 默认可验证配置路径 | 让 api、worker、jobs 和 runtime builder 能在 local / CI / test 下启动 | `05` 可据此设计配置测试矩阵;`07` 可据此安排 config loader 和 runtime builder 实现 |
| 定义配置控制面边界 | 明确哪些运行行为由配置控制,哪些 truth 和安全下限禁止配置化 | `06` 可据此设置配置红线验收 |
| 定义配置来源和 profile 口径 | 明确 defaults、JSON、env、secret / credential ref、entry local args 如何生效 | 实现者不会临时发明配置覆盖顺序 |
| 定义敏感配置和 credential ref 边界 | 防止 raw secret、raw token、外部正文和业务正文进入配置、状态、日志或证据 | 安全测试、验收和实施门禁可引用 |
| 定义配置加载、校验和失效策略 | 明确 loader、validator、builder 如何处理缺失、冲突、非法和不可达 | 实现者可以实现一致的 fail-fast / fail-closed / degraded 行为 |
| 定义下游承接关系 | 说明测试、验收、实施和运维如何使用配置设计 | 避免 `05/06/07/运维` 重复定义配置事实 |

### 4.2 范围 / 非范围

| 类型 | 内容 | 本轮处理口径 |
|---|---|---|
| 范围 | runtime profile、config loader、config validator、runtime builder 配置语义 | 承接 `03`,说明来源、优先级、profile、校验和失败策略 |
| 范围 | store、boundary、idempotency、projection、jobs、external、outbox、handoff、features、runtime | 定义 P0 local / fake / in-memory 默认路径和后续 production 接缝 |
| 范围 | local / CI / integration-like / operations-replay 配置矩阵 | 定义环境差异,不写真实生产值 |
| 范围 | security boundary / secret ref / credential ref / forbidden body 拒绝策略 | 定义敏感配置和禁止配置化边界 |
| 非范围 | 完整 production DB / MQ / endpoint / KMS 产品字段全集 | 后续 production adapter、部署与运维专项 |
| 非范围 | 部署命令、容器挂载、Kubernetes manifest、值班 playbook | 部署与运维手册 |
| 非范围 | 完整测试用例、脚本、报告证据格式 | `05-测试方案.md` |
| 非范围 | 验收通过 / 不通过标准和一票否决清单 | `06-验收标准.md` |
| 非范围 | 实施批次、commit boundary、编码顺序和 git 规范 | `07-实施计划.md` |

### 4.3 P0 / P1 / P2 配置口径

| 阶段 | 配置口径 | 当前是否进入正式配置设计 |
|---|---|---|
| P0 | `ProcessRuntimeConfig` 既有 10 个 section 的默认可验证配置 | 是,必须完整说明 |
| P0-min | in-memory store、fake publisher、fake resolver、fake handoff、fixed clock、sequence id、small batch、strict redaction | 是,必须说明默认配置和限制 |
| P1 | durable store、real event bus、real source resolver、real handoff endpoint、secret provider、production-like profile、search backend | 只保留接缝和风险,不写字段全集 |
| P2 | remote config、hot reload、full production runbook、advanced dashboard / alert threshold | 不进入当前配置项清单,只在风险与演进中说明 |

#### 配置来源链图: L1-process 配置设计范围

```text
04 Configuration design scope
|
+-- In scope
|   +-- P0 runtime config semantics
|   +-- source priority and profile matrix
|   +-- module-level JSON demos and config item table
|   +-- secret / credential ref and forbidden boundary rules
|   +-- load / validate / apply / fail behavior
|   +-- downstream handoff to 05 / 06 / 07 / operations
|
+-- Explicitly out of scope
    +-- production DB / MQ / endpoint / KMS full product fields
    +-- deployment commands and operations runbook
    +-- test cases and acceptance gates
    +-- commit boundaries and implementation schedule
```

关键说明:

- 图表达 `04` 的配置设计范围,不表达部署拓扑。
- P0 配置项必须可实现、可校验、可测试。
- P1/P2 只保留接缝,不得在当前配置项清单中虚构生产字段。

## 5. 对详细设计的影响判定

| 配置结论 | 是否影响 03 | 影响类型 | 03 回写位置 | 处理状态 |
|---|---|---|---|---|
| 本轮覆盖 `ProcessRuntimeConfig` 已有 section,不新增 top-level section | 否 | 无代码契约变化 | 无 | 无回写 |
| P0 使用 fake / in-memory / deterministic 默认可验证路径 | 否 | 配置默认语义,不改变 adapter trait | 无 | 无回写 |
| production 产品字段全集后移,不得临时实现 | 否 | 文档边界裁剪 | 无 | 无回写 |

## 6. 回填草稿

`04-配置设计.md` §2 应说明本轮配置设计目标是定义 L1-process 的 P0 默认可验证配置路径、配置控制面边界、来源与 profile 口径、敏感配置和 credential ref 边界、加载校验失效策略,以及下游测试、验收、实施和运维承接关系。P0 覆盖 `ProcessRuntimeConfig` 的 store、boundary、idempotency、projection、jobs、external、outbox、handoff、features、runtime section。production DB / MQ / endpoint / KMS 字段全集、部署命令、测试用例、验收裁决和 commit boundary 均不在本章定义。

## 7. 待确认事项

- 无阻塞 Step 3 的待确认事项。
- Step 7 需要从 `03_ddd_step_14_config_external_binding.md` 的配置引用表逐项生成 P0 配置清单。

## 8. 进入下一步条件

- 配置范围和非范围已收稳。
- P0 / P1 / P2 口径明确。
- 详细设计影响判定为无回写。
