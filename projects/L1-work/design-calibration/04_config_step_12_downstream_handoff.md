# Step 12. 定义测试、验收、实施与运维承接

> 本文件是 `projects/L1-work/04-配置设计.md` 的 Step 12 中间产物。
> 本步定义配置设计如何被 `05-测试方案.md`、`06-验收标准.md`、`07-实施计划.md` 和后续 `09-部署与运维手册.md` 承接。
> 本步不替测试方案写完整用例,不替运维手册写部署命令,不允许下游文档重新定义配置契约。

## 1. Step 状态

- 状态: `[x] 已完成`
- 对应 SOP: `standards/document/配置设计讨论流程_SOP.md` Step 12
- 回填章节: `projects/L1-work/04-配置设计.md` §12 测试、验收、实施与运维承接

## 2. 本步输入

| 输入 | 内容 | 本步使用方式 |
|---|---|---|
| `04_config_step_06_profiles_matrix.md` | local-dev / ci-test / integration-like / operations-replay P0 profile,staging-like / production-like P1/P2 边界 | 固定测试环境矩阵和验收 profile 门禁 |
| `04_config_step_07_config_items.md` | 9 个 section / 28 个 P0 配置项、默认值、来源、生效方式和失败策略 | 固定实施读取和配置准备清单 |
| `04_config_step_08_sensitive_secrets.md` | ref-only sensitive、raw secret / raw token / raw payload 禁止、redacted 输出边界 | 固定安全测试、验收一票否决和运维密钥留白 |
| `04_config_step_09_load_validate_apply.md` | defaults -> JSON -> env -> validation -> runtime builder 加载链,P0 不支持 hot update | 固定测试切口和实施顺序 |
| `04_config_step_10_change_audit_rollback.md` | 配置变更、审计字段、回滚方式 | 固定验收门禁和运维承接方向 |
| `04_config_step_11_failure_modes.md` | fail-fast / fail-closed / unresolved / failed / stale 策略 | 固定配置失败测试场景和验收裁决 |
| `测试方案书写规范.md` / `验收标准书写规范.md` / `实施计划书写规范.md` / `部署与运维手册书写规范.md` | 下游文档职责边界 | 防止 04 替下游写完整内容或下游反向重定义 04 |

已确认结论:

```text
04-配置设计.md 是配置事实源。
05-测试方案.md 承接配置场景并定义如何验证。
06-验收标准.md 承接配置门禁并定义通过 / 失败裁决。
07-实施计划.md 承接配置准备、阅读门禁、实现批次和测试门禁。
09-部署与运维手册.md 承接真实部署位置、secret provider、发布、回滚、监控和故障处置。
下游文档不得重新定义 WorkRuntimeConfig 字段、配置来源优先级、敏感配置规则、profile 边界或失败语义。
```

## 3. SOP 问题回答

### 3.1 哪些配置场景进入测试方案?

`05-测试方案.md` 应承接配置设计中的可验证场景,但不在 04 中展开完整测试用例。至少需要进入测试方案的场景如下:

| 场景组 | 应进入测试方案的配置场景 | 输入来源 |
|---|---|---|
| profile matrix | local-dev、ci-test、integration-like、operations-replay 的启动和 job-run-start 配置矩阵 | Step 6 |
| 默认配置 | 仅 code defaults 能启动默认可验证路径 | Step 7 / Step 9 |
| JSON / env | module JSON parse、env override、source summary 和高优先级非法值 fail-fast | Step 5 / Step 7 / Step 9 |
| 错配置 | duplicate key、malformed JSON、invalid enum / duration / bool / size / retry / timeout / page limit | Step 9 / Step 11 |
| 交叉校验 | idempotency retention、reserved record max age、retry policy、batch / page / body limit | Step 7 / Step 9 / Step 11 |
| 敏感配置 | raw secret / raw token / raw payload reject,redaction gate,ref-only sensitive shape validation | Step 8 / Step 11 |
| adapter 装配 | configured adapter 缺 endpoint / credential / target ref 时 fail-fast,不得自动 fake success | Step 7 / Step 8 / Step 11 |
| fake 标识 | fake adapter 必须有 fake marker,测试报告不得把 fake success 误写成 configured success | Step 6 / Step 8 / Step 11 |
| 外部来源 | resolver unresolved、source unavailable、evidence unavailable 和 degraded marker | Step 7 / Step 11 |
| outbox / handoff | publisher failed / pending marker,handoff failed marker,truth 不回滚 | Step 7 / Step 10 / Step 11 |
| projection | projection stale / rebuilding / replace 失败 marker,不反写真相 | Step 7 / Step 11 |
| hot update | P0 不支持核心 hot reload / drift 自动修复,运行中配置变化不影响当前 runtime / job | Step 4 / Step 9 / Step 11 |
| replay | operations-replay 配置与历史 baseline / digest 不匹配时 fail-fast | Step 6 / Step 10 / Step 11 |

### 3.2 哪些配置门禁进入验收标准?

`06-验收标准.md` 应把配置设计结论转成裁决条件和一票否决项。至少应包含:

| 门禁组 | 验收门禁 | 输入来源 |
|---|---|---|
| profile 覆盖 | P0 profile 均已被文档和测试覆盖,staging-like / production-like 未被误写成 P0 必需字段全集 | Step 6 |
| 配置事实源 | `WorkRuntimeConfig` section / item / default / source / failure strategy 与 04 一致 | Step 7 |
| 来源优先级 | 普通配置严格遵守 defaults < JSON file < env,entry local args 只作局部输入 | Step 5 |
| 高优先级非法值 | env 或高优先级非法值必须 fail-fast,不得 fallback 到低优先级 | Step 5 / Step 11 |
| 敏感输出 | config / log / error / audit / report / artifact 不得出现 raw secret / raw token / raw payload / source body | Step 8 |
| configured adapter | 缺少 required ref 时不得 fake success 或 silent fallback | Step 7 / Step 11 |
| 核心边界 | 配置不能绕过 truth ownership、metadata / idempotency、visibility、audit / outbox、query no-write、projection no-write | Step 4 |
| 失败证据 | fail-fast / fail-closed / unresolved / failed / stale 必须有 sanitized evidence | Step 10 / Step 11 |
| P0 非范围 | 不得把 config center、admin override、last-known-good、核心 hot reload 写成 P0 已实现能力 | Step 4 / Step 9 / Step 11 |

### 3.3 哪些配置准备进入实施计划?

`07-实施计划.md` 应把配置设计转成实现前阅读、文件落点、批次边界和测试门禁,但不重新定义配置字段。建议承接:

| 实施准备项 | 承接方式 | 输入来源 |
|---|---|---|
| phase 开工阅读 | 在阶段阅读矩阵中要求读取正式 `04-配置设计.md` 对应章节和本目录 Step 6 至 Step 12 中间产物 | Step 12 |
| `infra::config` | 实现 defaults / JSON file / env override merge、strict parser、typed validator、cross-field validator | Step 5 / Step 7 / Step 9 |
| `runtime_builder` | 按配置装配 store、projection、jobs、external、outbox、handoff、features | Step 3 / Step 7 |
| forbidden boundary gate | 实现配置层禁止项检查,命中时 fail-fast,不得进入 domain truth path | Step 4 / Step 11 |
| sensitive gate | 实现 raw secret / raw token / raw payload reject 和 redacted evidence | Step 8 |
| adapter ref validation | 对 configured adapter 的 endpoint / credential / target ref 做条件必填和 shape validation | Step 7 / Step 8 |
| test gate | 每个实现批次至少跑对应配置 parse / validation / failure / redaction / no-hot-update 测试切口 | Step 11 / Step 12 |
| commit boundary | 不把 config center、production adapter、KMS / Vault 字段全集混入 P0 配置提交 | Step 2 / Step 6 / Step 8 |

### 3.4 哪些配置部署细节留给部署与运维手册?

`09-部署与运维手册.md` 应承接真实运行环境的操作细节。04 只给边界和输入,不写命令或值班流程。

| 运维承接项 | 留给 09 的内容 | 04 提供的边界 |
|---|---|---|
| 配置文件位置 | 各环境实际路径、挂载方式、发布产物目录 | JSON file 是普通配置来源 |
| 环境变量名称 | 实际 env key 命名、注入方式、环境隔离方式 | env override 优先级和非法值 fail-fast |
| secret provider | KMS / Vault / Secret Manager 产品、权限、轮换和注入流程 | 04 只允许 ref,不允许 material |
| credential / endpoint refs | 真实 ref 命名、生命周期、轮换窗口 | 04 定义 ref-only sensitive 和条件必填 |
| 发布 / 回滚 | 启停、发布、回滚、灰度和止血命令 | 04 定义冷重启 / 新 job run 生效和 truth 不回滚 |
| 监控 / 告警 | dashboard、alert threshold、on-call、runbook | 04 定义需要可见的 failed / stale / unresolved marker |
| 生产依赖 | durable DB、MQ、event bus、identity、method、artifact、runtime 等实际产品绑定 | staging-like / production-like 为 P1/P2,不进入 P0 字段全集 |
| config center | 若未来引入,其权限、审计、reload、last-known-good 和恢复流程 | P0 明确不支持 |

### 3.5 下游文档不应重复定义哪些配置契约?

下游文档只能引用,不得改写以下配置契约:

| 不得重复定义的配置契约 | 正式来源 |
|---|---|
| P0 profile 名称和 P1/P2 profile 边界 | `04-配置设计.md` §6 |
| 普通配置来源优先级和 conflict 处理 | `04-配置设计.md` §5 |
| `WorkRuntimeConfig` section、配置项、默认值、来源、作用域、生效和失败策略 | `04-配置设计.md` §7 |
| ref-only sensitive、raw secret / raw token / raw payload 禁止规则 | `04-配置设计.md` §8 |
| 加载链、typed validation、cross-field validation 和 no-hot-update 语义 | `04-配置设计.md` §9 |
| 配置变更审计字段、回滚方式和 truth 不回滚边界 | `04-配置设计.md` §10 |
| fail-fast / fail-closed / unresolved / failed / stale / degraded 使用范围 | `04-配置设计.md` §11 |
| 禁止配置化边界: truth ownership、metadata / idempotency、visibility、audit / outbox、query no-write、projection no-write | `04-配置设计.md` §4 |

## 4. 当前文档问题诊断

| 位置 | 当前问题 | 本步处理 |
|---|---|---|
| 当前旧 `05-测试方案.md` | 本 Step 撰写时仍是旧版草案;当前已生成正式 `05` | 历史风险已关闭;配置测试矩阵以正式 `05` 为准 |
| 当前旧 `06-验收标准.md` | 本 Step 撰写时仍是旧版草案;当前已生成正式 `06` | 历史风险已关闭;配置验收门禁以正式 `06` 为准 |
| 当前 `07-实施计划.md` | 本 Step 撰写时尚未生成新版正式文档;当前已生成正式 `07` | 历史风险已关闭;实施门禁以正式 `07` 为准 |
| 当前 `09-部署与运维手册.md` | 尚未生成 | 本步明确哪些真实部署细节由 09 承接 |
| `04-配置设计.md` | 本 Step 撰写时尚未存在 §12;当前已回填正式 §12 | 本步提供回填来源 |
| 下游文档边界 | 容易把配置契约在 05 / 06 / 07 / 09 中重复定义并产生第二真相 | 本步明确下游只能引用 04 的配置事实源 |

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 测试承接 | 配置测试切口散落在 Step 6 / 7 / 11 | 汇总为 profile、来源、错配、敏感、adapter、outbox、projection、replay 等场景 | 支撑新版 05 |
| 验收承接 | 配置门禁尚未集中 | 明确 P0 profile、来源优先级、raw secret、非法高优先级、configured adapter、核心边界等裁决项 | 支撑新版 06 |
| 实施承接 | 只有配置设计结论,缺实现准备映射 | 映射到 `infra::config`、`runtime_builder`、validation、sensitive gate、commit boundary | 支撑新版 07 |
| 运维承接 | 04 可能被误写成部署手册 | 明确真实路径、env key、secret provider、发布回滚、监控告警留给 09 | 防止 04 越界 |
| 下游事实源 | 05 / 06 / 07 / 09 可能重复定义配置字段和失败语义 | 明确下游不得重复定义的配置契约清单 | 防止设计双真相 |

## 6. 配置设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A: 04 只给下游引用入口,不列承接矩阵 | 简短 | 下游容易漏掉 raw secret、非法高优先级、configured ref 等关键门禁 | 不采用 |
| 方案 B: 04 给承接矩阵,下游负责测试用例、验收裁决、实施批次和运维命令 | 事实源清晰,职责边界稳定 | 04 篇幅略长 | 采用 |
| 方案 C: 04 直接写完整测试用例和部署命令 | 看似完整 | 混淆测试方案和运维手册职责,后续维护困难 | 不采用 |
| 方案 D: 让 05 / 06 / 07 / 09 各自定义配置字段 | 下游自洽 | 形成第二真相,实现 agent 容易选边 | 不采用 |

推荐方案 B。

原因:

- 配置设计必须把配置事实交给下游,但不能替代下游文档。
- L1-work 已有多轮设计经验表明,类型名、字段、状态和门禁只写一处最稳;下游文档应引用同一真相源。
- 05 / 06 / 07 / 09 的关注点不同,用承接矩阵能避免同一配置规则被多次改写。

## 7. 结构化中间产物

### 7.1 下游承接总表

| 下游文档 | 承接内容 | 本文提供的输入 |
|---|---|---|
| `05-测试方案.md` | 配置环境矩阵、配置加载 / 校验 / 失败场景、敏感输出 gate、adapter ref、outbox / handoff / projection / replay 场景 | Step 6 profile matrix,Step 7 config items,Step 8 sensitive rules,Step 9 load chain,Step 11 failure modes |
| `06-验收标准.md` | 配置裁决门禁、一票否决项、失败证据要求、P0 非范围确认 | Step 4 forbidden boundaries,Step 5 priority,Step 8 secret rules,Step 10 audit / rollback,Step 11 failure semantics |
| `07-实施计划.md` | 配置实现批次、阅读门禁、文件落点、validation gate、测试命令与证据归档门禁 | Step 3 control plane,Step 7 config items,Step 9 builder chain,Step 12 handoff matrix |
| `09-部署与运维手册.md` | 真实环境文件位置、env 注入、secret provider、发布回滚、监控告警、故障处置、P1/P2 生产依赖绑定 | Step 6 profile boundary,Step 8 ref-only sensitive,Step 10 change / rollback,Step 11 failure / marker semantics |

### 7.2 配置场景到测试承接表

| 测试切口 | 测试方案应验证 | 不在 04 中展开 |
|---|---|---|
| default startup | defaults 能构造 local-dev 默认 runtime | 具体测试函数、断言代码 |
| strict JSON | malformed JSON、duplicate key、unknown key / alias 冲突 fail-fast | 测试夹具路径 |
| env override | env 高优先级非法值 fail-fast,不回退 JSON / defaults | 具体 env key 命名 |
| profile matrix | ci-test、integration-like、operations-replay 的差异配置可判定 | 完整 case 编号 |
| cross-field validation | retention、retry、timeout、batch、page、body limit 组合边界 | 参数穷举 |
| sensitive output | raw secret / token / payload / source body 不进 config、log、audit、report、artifact | 实际扫描脚本 |
| adapter refs | configured adapter ref 缺失 / 不可解析时 fail-fast 或 fail-closed | 真实 provider 接入脚本 |
| external unresolved | resolver failure 产生 explicit unresolved / failed marker | 外部系统 mock 细节 |
| outbox / handoff | publisher / handoff failed marker 不回滚 truth | 运行命令 |
| projection | projection stale / rebuilding marker 不反写真相 | projection rebuild 脚本 |
| no hot update | 运行中配置变化不影响当前 runtime / job | 文件监听实现 |
| replay | operations-replay baseline digest mismatch fail-fast | 历史数据生成命令 |

### 7.3 配置门禁到验收承接表

| 验收门禁 | 通过口径 | 失败口径 |
|---|---|---|
| P0 profile 完整 | local-dev / ci-test / integration-like / operations-replay 均有配置测试和证据 | 缺 profile 或把 production-like 写成 P0 必需 |
| 配置项一致 | 实现、测试和文档使用同一 28 项 P0 配置清单 | 下游新增未回写 04 / 03 的配置项 |
| 来源优先级一致 | defaults < JSON file < env,entry local args 局部有效 | env 非法值 fallback 或 entry args 变成全局配置 |
| secret 安全 | 无 raw secret / token / payload / source body 泄露 | 任一 config / log / report / artifact 泄露 |
| configured adapter 安全 | 缺 ref fail-fast / fail-closed,无 fake success | configured 缺 ref 后自动 fake 成功 |
| 核心边界不可配置 | 配置不能绕过 truth、idempotency、visibility、audit / outbox、query / projection 边界 | 存在关闭核心门禁的配置 |
| 失败证据可审计 | fail-fast / fail-closed / marker 均有 sanitized evidence | 失败无证据或证据含敏感材料 |
| P0 非范围清楚 | no config center、no admin override、no hot reload、no last-known-good 自动吞错 | 文档或实现暗示 P0 已支持这些能力 |

### 7.4 实施计划承接表

| 实施计划章节 / 机制 | 应承接内容 | 不应写入 |
|---|---|---|
| 开工前阅读清单 | 读取 `04-配置设计.md` §5 至 §12 和对应 Step 5 至 Step 12 中间产物 | 重新定义配置来源和字段 |
| 阶段阅读矩阵 | 与 config / runtime builder / adapter / test gates 相关的 phase 必须列 04 章节 | 把中间产物当成优先于正式文档的真相源 |
| 实现批次 | defaults、JSON / env merge、typed validation、cross-field validation、sensitive gate、adapter ref validation | config center、production secret provider、hot reload |
| 测试门禁 | 每批配置实现都带对应 parse / validation / redaction / failure 测试 | 只写“运行测试”而无配置切口 |
| 提交边界 | P0 配置实现不混入 P1/P2 生产依赖字段全集 | 把运维部署细节写入代码实现 boundary |
| 证据归档 | 配置测试证据进入 run-scoped artifact / report,不使用 `latest` 作正式证据 | raw env value、secret material 或 payload body |

### 7.5 部署与运维手册承接表

| 运维主题 | 09 应写 | 04 不写 |
|---|---|---|
| 配置文件 | 真实路径、挂载、权限、版本管理 | 具体文件路径命令 |
| 环境变量 | 真实 key 名、注入方式、隔离策略 | 本项目 P0 env key 全量命令 |
| secret / credential | provider、权限、轮换、审计、应急吊销 | raw secret、raw token、credential material |
| 发布 / 回滚 | 冷重启、新 job run、恢复上一版 config 的操作步骤 | shell / orchestration 命令 |
| 监控 / 告警 | fail-fast、failed marker、stale marker、unresolved marker 的 dashboard 和告警 | dashboard 具体截图 |
| 故障处置 | 配置 parse 失败、provider 不可用、outbox / handoff 失败、projection stale 的 runbook | 值班排班 |
| P1/P2 生产化 | DB / MQ / event bus / KMS / Vault / config center 的真实绑定 | 在 P0 配置项中预支字段全集 |

### 7.6 下游不得重复定义清单

```text
05 不重新定义配置字段,只定义如何验证字段。
06 不重新定义配置规则,只定义通过 / 失败裁决。
07 不重新定义配置契约,只定义如何按设计实现和验证。
09 不重新定义 P0 配置模型,只定义真实部署和运维操作。
```

## 8. 对详细设计的影响判定

| 配置结论 | 是否影响 03 | 影响类型 | 03 回写位置 | 处理状态 |
|---|---|---|---|---|
| 下游文档承接 04 的配置场景、门禁、实施准备和运维留白 | 否 | 文档承接规则,无代码契约变化 | 无 | 无回写 |
| 05 / 06 / 07 / 09 不得重新定义配置契约 | 否 | 文档事实源规则,不改变对象 / trait / DTO | 无 | 无回写 |
| 配置测试和验收必须覆盖 profile、来源、敏感、adapter、outbox、projection、replay 等切口 | 否 | 测试 / 验收承接,不新增正式测试 ID | 无 | 无回写 |
| 真实部署路径、env key、secret provider、发布回滚命令留给 09 | 否 | 运维边界规则,不新增 runtime config 字段 | 无 | 无回写 |

说明:

```text
本步没有新增 WorkRuntimeConfig 字段、adapter constructor、trait、DTO、error 或函数流。
如果后续 05 / 06 / 07 / 09 需要新增配置项或改变失败语义,必须先回到 04;若改变代码契约,再回写 03。
```

## 9. 回填草稿

正式 `04-配置设计.md` §12 建议采用以下结构:

```text
12. 测试、验收、实施与运维承接
  12.1 下游承接总表
  12.2 测试方案承接
  12.3 验收标准承接
  12.4 实施计划承接
  12.5 部署与运维手册承接
  12.6 下游不得重复定义的配置契约
  12.7 对 03-详细设计的影响判定
```

必须引用:

| 正式章节 | 引用来源 |
|---|---|
| §12.1 | `design-calibration/04_config_step_12_downstream_handoff.md` §7.1 |
| §12.2 | `design-calibration/04_config_step_12_downstream_handoff.md` §7.2 |
| §12.3 | `design-calibration/04_config_step_12_downstream_handoff.md` §7.3 |
| §12.4 | `design-calibration/04_config_step_12_downstream_handoff.md` §7.4 |
| §12.5 | `design-calibration/04_config_step_12_downstream_handoff.md` §7.5 |
| §12.6 | `design-calibration/04_config_step_12_downstream_handoff.md` §7.6 |
| §12.7 | `design-calibration/04_config_step_12_downstream_handoff.md` §8 |

## 10. 待确认事项

无阻塞进入 Step 13 的待确认事项。

后续 Step 必须继续收口:

- Step 13 判断未来新增 config center、secret provider、production-like durable adapters、advanced search 或 last-known-good 时的迁移、废弃和兼容窗口。
- Step 14 汇总 P1/P2 profile、真实外部依赖、部署运维留白和下游重写配置契约的风险。
- Step 15 生成正式 `04-配置设计.md` 时,必须从 Step 1 至 Step 14 中间产物整理,不得直接新增未确认配置项。

## 11. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| 测试方案承接内容已明确 | 通过 | §3.1 / §7.2 |
| 验收标准承接门禁已明确 | 通过 | §3.2 / §7.3 |
| 实施计划承接准备已明确 | 通过 | §3.3 / §7.4 |
| 部署与运维手册承接留白已明确 | 通过 | §3.4 / §7.5 |
| 下游不得重复定义的配置契约已明确 | 通过 | §3.5 / §7.6 |
| 对 03 影响已有判定 | 通过 | §8 当前无回写 |
| 可以进入 Step 13 | 通过 | 下一步定义配置迁移、废弃与演进 |
