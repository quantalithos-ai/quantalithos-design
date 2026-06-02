# Step 12. 定义测试、验收、实施与运维承接

> 本文件是 `projects/L1-conversation/04-配置设计.md` 的 Step 12 中间产物。
> 本步定义配置设计如何被 `05-测试方案.md`、`06-验收标准.md`、`07-实施计划.md` 和后续部署运维文档承接。
> 本步不替测试方案写完整用例,不替验收标准写裁决全集,不替实施计划排 phase,不替运维手册写部署命令。

## 1. Step 状态

- 状态: `[x] 已完成`
- 对应 SOP: `standards/document/配置设计讨论流程_SOP.md` Step 12
- 回填章节: `projects/L1-conversation/04-配置设计.md` §12 测试、验收、实施与运维承接

## 2. 本步输入

| 输入 | 内容 | 本步使用方式 |
|---|---|---|
| `04_config_step_06_profiles_matrix.md` | local-dev、ci-test、integration-like、operations-replay 为 P0 | 定义测试环境、验收 profile 和实施准备输入 |
| `04_config_step_07_config_items.md` | 12 个配置模块、配置项清单、模块级 JSON demo、完整 JSONC demo | 定义下游可引用的配置契约 |
| `04_config_step_08_sensitive_secrets.md` | sensitive-ref、raw secret 禁止和输出防泄露 | 定义安全测试、验收和实施检查输入 |
| `04_config_step_09_load_validate_apply.md` | loader / validator / runtime builder 生效机制 | 定义 config loader / validator 测试切口和实施顺序 |
| `04_config_step_10_change_audit_rollback.md` | 配置变更、脱敏审计和回滚 | 定义验收证据和运维回滚承接 |
| `04_config_step_11_failure_modes.md` | fail-fast、fail-closed、unresolved、retry pending、failed、stale、diagnostic | 定义负向测试、验收一票否决和实施失败处理 |
| `03-详细设计.md` §15 | 脚本、artifacts 和 reports 最小契约 | 固定 `artifacts/test/<run_id>` 和 `reports/` 路径规则 |

已确认结论:

```text
04 是配置契约来源。
05 负责把配置契约转为测试对象、测试场景、自动化门禁和证据归档。
06 负责把配置契约转为通过条件、失败条件、一票否决项和可接受遗留项。
07 负责把配置契约转为实施前置、编码顺序、阶段验证和回退点。
部署与运维文档负责真实环境路径、env 注入、secret provider、endpoint、告警、轮换和运行命令。
```

## 3. SOP 问题回答

### 3.1 哪些配置场景进入测试方案?

| 测试方向 | 需要覆盖的配置场景 | 证据输入 |
|---|---|---|
| profile matrix | local-dev、ci-test、integration-like、operations-replay | 启动日志、job receipt、profile 摘要 |
| source priority | defaults / JSON / env 覆盖顺序;entry args 只作 selector 或局部参数 | 配置来源摘要、负向测试输出 |
| JSON schema | unknown key、duplicate key、非法 enum / bool / path / ref | loader / validator 测试报告 |
| cross-field validate | credential ref、fake marker、batch / rebuild、retention / cursor、report path | validator 测试证据 |
| sensitive boundary | raw secret 拒绝、sensitive ref 脱敏、报告 / 日志泄露扫描 | redaction check report |
| fail-fast / fail-closed | 高优先级非法不回退、unsupported hot reload 拒绝 | 失败注入测试 |
| runtime support failure | resolver unresolved、outbox retry / failed、handoff retry / failed、projection stale / failed | job receipt、report、state marker |
| reports / artifacts | `artifacts/test/<run_id>`、`reports/runs/<run_id>`、不加项目名层级 | 目录检查、报告索引 |

### 3.2 哪些配置门禁进入验收标准?

| 验收方向 | 通过条件 | 失败条件 |
|---|---|---|
| 配置契约追溯 | 配置项、类型、默认值和失败策略可追溯到 04 | 下游另造 key、字段类型或默认值 |
| 来源优先级 | 覆盖顺序稳定且可验证 | 高优先级非法值 silent fallback |
| profile 覆盖 | P0 profile 均有通过证据 | 任一 P0 profile 无法加载或生成证据 |
| 敏感边界 | raw secret 不进入配置、日志、错误、审计、reports、artifacts、event | 任一输出泄露 secret material |
| 禁止配置化 | redaction、visibility、truth ownership、state machine、idempotency、audit chain 不可绕过 | 存在可生效绕过配置 |
| 失效策略 | fail-fast / fail-closed / unresolved / retry / failed / stale 与 04 一致 | 错误配置继续运行或默认放行 |
| 证据归档 | artifacts / reports 路径、run id 和 config summary 可追溯 | 证据缺失、路径混乱或无法关联 run |

### 3.3 哪些配置准备进入实施计划?

`07-实施计划.md` 必须承接:

- 配置 schema 和 JSON key。
- defaults、JSON file、env、entry local args 的合并顺序。
- loader、validator、runtime builder 和 adapter constructor 实施顺序。
- `api`、`worker`、`jobs` 启动配置和 job run id 处理。
- sensitive-ref、redaction check、forbidden body 拒绝和报告脱敏。
- `scripts/gates/run_ci_gate.sh`、`scripts/reports/generate_reports.sh`、`scripts/checks/check_redaction.sh` 的配置输入。
- 负向测试、失败报告和回退点。

实施计划不得在 04 之外发明配置字段、profile、错误语义、hot reload 或 config center。

### 3.4 哪些配置部署细节留给部署与运维手册?

| 运维内容 | 留给运维的原因 |
|---|---|
| 真实配置文件路径、挂载和权限 | 属于环境操作 |
| CI / job / release 系统中的环境变量注入方式 | 属于平台实现细节 |
| KMS / Vault / secret provider 绑定步骤 | P1/P2 安全运维专项 |
| real DB / real event bus / real resolver / real handoff endpoint | P1/P2 生产接入 |
| 进程重启、job invocation、rollback 命令 | 属于 runbook |
| 告警阈值、监控面板和事故处置 | 属于运维观测 |
| secret ref 轮换、吊销和审计流程 | 属于安全运维流程 |

### 3.5 下游文档不应重复定义哪些配置契约?

下游文档不得重复定义 JSON top-level key、字段级 key、字段类型、默认值、敏感级别、来源优先级、profile、加载时机、失败策略、禁止配置化项、reports / artifacts 根目录规则和是否需要回写 03 的门禁。

## 4. 当前文档问题诊断

| 位置 | 当前问题 | 影响 |
|---|---|---|
| `04-配置设计.md` | 尚未创建下游承接章节 | 05/06/07/运维不知道承接边界 |
| 当前旧 `05/06` | 未按新版配置控制面、profile 和失效模式重校准 | 后续测试验收可能漏掉配置门禁 |
| `07-实施计划.md` | 尚未创建 | 实施者可能脑补 schema、env 或 hot reload |
| 部署 / 运维文档 | 尚未创建 | 真实 endpoint、secret provider 和部署命令缺承接位置 |

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 05 承接 | 未明确 | 承接 profile、schema、来源、校验、敏感、失效和证据路径 | 测试可按配置风险设计 |
| 06 承接 | 未明确 | 承接 raw secret、silent fallback、fake-as-production、non-strict redaction 等门禁 | 验收可裁决配置红线 |
| 07 承接 | 未明确 | 承接 loader / validator / builder / scripts / tests | 防止实现脑补配置契约 |
| 运维承接 | 未明确 | 真实路径、env 注入、provider、endpoint、告警、轮换留给运维 | 防止 04 膨胀成部署手册 |

## 6. 配置设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A: 04 直接写完整测试、验收、实施和运维 | 单篇文档看似完整 | 越界替代 05/06/07/运维,重复维护 | 不采用 |
| 方案 B: 04 定义下游输入、承接边界和禁止重复定义契约 | 边界清楚,下游可追溯 | 需要后续继续校准 05/06/07/运维 | 采用 |
| 方案 C: 下游各自重新定义配置项 | 下游自包含 | 极易产生 key、默认值和失败策略漂移 | 不采用 |

推荐方案 B。

原因:

- `04` 是配置契约来源,不是测试方案、验收标准、实施计划或运维 runbook。
- 下游需要稳定输入和边界,不需要第二套配置定义。

## 7. 结构化中间产物

### 7.1 下游承接图

```text
[04 Configuration Design]
    |
    +--> [05 Test Plan]
    |       uses: profile matrix / schema / failure modes / evidence roots
    |
    +--> [06 Acceptance Criteria]
    |       uses: config gates / veto rules / evidence checks
    |
    +--> [07 Implementation Plan]
    |       uses: loader / validator / builder / scripts / commit boundaries
    |
    +--> [Deployment and Operations]
            uses: env injection / provider binding / runtime operation / rollback runbook
```

### 7.2 下游承接表

| 下游文档 | 承接内容 | 本文提供的输入 |
|---|---|---|
| `05-测试方案.md` | 配置测试对象、场景、自动化门禁、脚本检查和证据归档 | Step 6 profile;Step 7 配置项;Step 8 敏感配置;Step 9 加载校验;Step 11 失效模式 |
| `06-验收标准.md` | 配置验收门禁、通过 / 失败条件、一票否决项 | 禁止 silent fallback、raw secret、fake-as-production、non-strict redaction、证据路径规则 |
| `07-实施计划.md` | 实施前置、编码顺序、阶段测试门禁、回退点 | schema、env / entry args、loader / validator / builder、scripts、负向测试 |
| 部署与运维文档 | 真实环境路径、env 注入、credential provider、endpoint、告警、备份、恢复和轮换 | profile 语义、ref-only、变更审计、回滚原则、P1/P2 外部集成边界 |
| `reports/` 与 `artifacts/test/` 产物规范 | 配置摘要、redaction check、failure category、run id、profile、evidence index | Step 8 禁止输出;Step 10 审计摘要;Step 11 失效模式;`03` §15 |

### 7.3 下游不得重复定义的配置契约

| 契约 | 说明 |
|---|---|
| JSON top-level key 和字段级 key | 以 04 Step 7 / 正文 §7 为准 |
| 字段类型、默认值、敏感级别和失败策略 | 以 04 Step 7 / 正文 §7 为准 |
| 来源优先级和冲突处理 | 以 04 Step 5 / 正文 §5 为准 |
| profile 定义和 P0 / P1 / P2 范围 | 以 04 Step 6 / 正文 §6 为准 |
| sensitive ref-only 和 raw secret 禁止规则 | 以 04 Step 8 / 正文 §8 为准 |
| 加载、校验和生效机制 | 以 04 Step 9 / 正文 §9 为准 |
| 配置变更、审计和回滚原则 | 以 04 Step 10 / 正文 §10 为准 |
| 失效模式与失败策略 | 以 04 Step 11 / 正文 §11 为准 |
| reports / artifacts 根目录规则 | 以 03 §15 和 04 Step 7 / Step 12 为准 |

## 8. 对详细设计的影响判定

| 配置结论 | 是否影响 03 | 影响类型 | 03 回写位置 | 处理状态 |
|---|---|---|---|---|
| 定义 05/06/07/运维对配置设计的承接关系 | 否 | 文档承接关系 | 无 | 无回写 |
| 明确下游不得重复定义 P0 配置项、profile 和失败策略 | 否 | 文档一致性规则 | 无 | 无回写 |
| 将测试、验收、实施和运维细节留给对应文档 | 否 | 文档边界规则 | 无 | 无回写 |
| 要求 07 承接 loader / validator / builder / scripts / reports,但不改变函数签名 | 否 | 实施承接规则 | 无 | 无回写 |

## 9. 回填草稿

正式 `04-配置设计.md` §12 建议采用以下结构:

```text
12. 测试、验收、实施与运维承接
  12.1 下游承接图
  12.2 下游承接表
  12.3 下游不得重复定义的配置契约
  12.4 对 03-详细设计的影响判定
```

必须引用:

| 正式章节 | 引用来源 |
|---|---|
| §12.1 | `design-calibration/04_config_step_12_downstream_handoff.md` §7.1 |
| §12.2 | `design-calibration/04_config_step_12_downstream_handoff.md` §7.2 |
| §12.3 | `design-calibration/04_config_step_12_downstream_handoff.md` §7.3 |
| §12.4 | `design-calibration/04_config_step_12_downstream_handoff.md` §8 |

## 10. 待确认事项

无阻塞进入 Step 13 的待确认事项。

后续 Step 必须继续收口:

- Step 13 定义配置迁移、废弃与演进。
- Step 14 汇总所有风险、待确认事项和对 `03` 的影响判定。
- Step 15 组装正式 `04-配置设计.md` 时必须保留对本中间产物的引用。

## 11. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| 下游承接表已形成 | 通过 | §7.2 |
| 下游不得重复定义契约已明确 | 通过 | §7.3 |
| 运维承接边界已明确 | 通过 | §3.4 |
| 对 03 影响已有判定 | 通过 | §8 当前无回写 |
| 可以进入 Step 13 | 通过 | 下一步定义配置迁移、废弃与演进 |
