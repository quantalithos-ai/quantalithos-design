# Step 8. 定义敏感配置与密钥管理

> 对应 SOP: `standards/document/配置设计讨论流程_SOP.md` Step 8
> 回填章节: `04-配置设计.md` §8 敏感配置与密钥管理

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 8 定义敏感配置与密钥管理 |
| 当前状态 | 已完成;待用户审查 |
| 输入基线 | Step 5 来源优先级;Step 6 profile 矩阵;Step 7 配置项清单;`00/01/02/03` 安全与正文排除红线 |
| 输出文件 | `projects/L1-governance/design-calibration/04_config_step_08_sensitive_secrets.md` |
| 停审方式 | 完成本 Step 后暂停,由用户审查后再进入 Step 9 |

## 2. 本步目标

本 Step 单独收稳 `L1-governance` 配置中的 secret、credential、endpoint、target、route、artifact root 和 redaction 安全关键项的存储、读取、轮换、审计和禁止输出边界。

本 Step 只回答:

- 哪些 Step 7 配置项属于 `sensitive` 或安全关键配置。
- 哪些真实秘密材料属于 `secret`,并且不得进入普通 JSON / env / entry-local / report / log / audit 正文。
- P0 中普通配置如何只保存 opaque ref,而不是保存 secret 或外部正文。
- integration-like、operations-replay、staging-like、production-like profile 中敏感 ref 如何处理。
- 敏感 ref 如何读取、轮换、审计和禁止输出。
- 每个敏感配置是否回指 Step 7 配置项、Step 5 来源规则、Step 9 加载机制和 Step 10 变更审计。

本 Step 不定义:

- 具体 secret provider / KMS / Vault / cloud secret manager 产品。
- 具体 endpoint URL、DSN、token、password、private key、certificate body、bus credential、archive package body、external GRC credential 或外部系统响应正文。
- 具体部署挂载、证书安装、权限申请、值班流程或生产密钥轮换 runbook。
- runtime hot reload。P0 仍按 Step 4 结论,敏感配置变化通过 restart 或 new job run 生效。

## 3. 本步输入

| 输入 | 状态 | 本 Step 用途 |
|---|---|---|
| `04_config_step_05_sources_priority_conflicts.md` | 已完成 | 提供 ordinary sources 只能承载 refs、raw secret 不进入普通优先级链的规则 |
| `04_config_step_06_environment_profiles_matrix.md` | 已完成 | 提供不同 profile 的敏感配置处理:fake ref、credential ref、secret provider ref、replay ref |
| `04_config_step_07_config_items.md` | 已完成 | 提供字段级配置项、敏感级别和失败策略 |
| `00-需求文档.md` 安全 / 数据归属 / 验收红线 | 已完成 | 提供禁止保存相邻仓正文、运行时正文、observability body、external GRC body 的需求红线 |
| `03-详细设计.md` §13 / §14 | 已完成 | 提供 config binding、forbidden body、日志 / metric / audit / trace 禁止输出规则 |
| `配置设计书写规范.md` §4.7 / §5.8 | 已完成 | 提供敏感级别定义和敏感配置章节格式 |

## 4. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 哪些配置是 sensitive 或 secret? | Step 7 中 `sensitive-ref`、`ref-sensitive` 和 endpoint/target/route/store/replay 相关 refs 统一归为 `sensitive`。真实 password、private key、raw token、cert body、DSN、raw endpoint credential、raw bus credential、raw external payload body 等属于 `secret`,但不得作为普通配置项出现。redaction deny list 属 `internal` 且安全关键,必须审计变更。 |
| 敏感配置如何存储,是否允许明文? | 普通 JSON / env / entry-local 只能存 opaque ref,例如 store config ref、adapter ref、target ref、route ref、replay artifact root ref。真实 secret material 不允许明文进入普通配置、文档示例、log、error、audit、trace、outbox、report 或 artifact。P0 只校验 ref 形态;真实 secret provider 属 P1/P2 或部署运维材料。 |
| 敏感配置如何轮换? | P0 无 hot update。startup 敏感 ref 轮换通过生成新 ref、更新配置、重启 runtime 后生效。job-run-start target/replay refs 通过新 job input / new run 生效。future secret provider 中的原地密钥轮换不改变 Governance truth,但必须写变更审计并重新校验 adapter availability。 |
| 读取和变更是否需要审计? | 需要。读取时只能记录 safe diagnostic ref、config validation issue ref、adapter slot、profile、config digest,不得记录 full sensitive ref 或 raw secret。变更时必须记录 actor / operator ref、change request ref、old/new redacted ref digest、profile、scope、reason、validation result 和生效方式。Step 10 会细化变更审计表。 |
| 日志、错误返回、审计中如何避免泄露? | log/error/audit/report/metric/trace 只允许输出 redacted issue ref、safe diagnostic ref、adapter slot、sensitive ref digest 或类别;不得输出完整 sensitive ref、secret material、endpoint、route、external response body、package body、artifact body、conversation body、runtime body 或 external GRC body。 |
| 每个敏感配置是否回指 Step 7 配置项、来源规则和加载 / 变更机制? | 是。§8.3 敏感配置表逐项回指 Step 7 配置项。来源规则统一承接 Step 5:普通来源只提供 refs,高优先级非法值 fail-fast。加载机制由 Step 9 承接;变更审计由 Step 10 承接。 |
| 每个敏感配置完成后是否通过停审? | 已通过。§8.8 逐项记录存储方式、明文禁止、轮换、审计和禁止输出。 |
| 所有敏感配置完成后是否存在 raw secret 入文档、普通配置误归类、日志泄露或轮换审计缺口? | 已审计。当前文档只保存 placeholder refs 和类别说明,未写实际 secret。真实 secret provider、remote config center、admin override、production endpoint schema 留 Step 13/14 风险或 P1/P2 设计。 |

## 5. 当前文档问题诊断

| 位置 | 当前问题 | 本 Step 处理 |
|---|---|---|
| Step 7 配置项总表 | 使用了 `sensitive-ref`、`ref-sensitive`、`security-critical` 等工程标签,尚未归一到书写规范的敏感级别 | 本 Step 归一为 `public` / `internal` / `sensitive` / `secret` |
| Step 5 来源规则 | 已规定 ordinary source 只能提供 refs,但未列出每类敏感 ref 的存储 / 轮换 / 审计 | 本 Step 逐项给敏感配置表 |
| Step 6 profile 矩阵 | 已说明 local/CI fake ref、integration-like credential ref、production-like secret provider ref,但未定义统一禁止输出规则 | 本 Step 定义 profile 级敏感处理表 |
| `03` §14 可观测性 | 已写 forbidden body / secret 不得输出,但未映射到配置字段 | 本 Step 把 redaction、adapter refs、target refs、route refs 和 replay refs纳入禁止输出审计 |
| 正式 `04` | 尚未创建 | 本 Step 只生成中间产物,正式文档等 Step 15 装配 |

## 6. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 敏感级别 | Step 7 表中存在非正式标签 | 统一映射到规范级别,并保留安全关键说明 | 后续正式 `04` 需要稳定术语 |
| secret 存储 | 只说 raw secret 禁止 | 明确普通配置、env、entry-local、report、log、audit、trace 都不得存 raw secret | 防止实现侧把 secret 当字符串配置 |
| sensitive refs | 分散在 store / resolver / publisher / handoff / external GRC / replay | 汇总成敏感配置表 | 支撑 Step 9 loader 和 Step 10 audit |
| 轮换 | 未定义 | startup ref 通过新 ref + restart;job-run-start ref 通过 new job run | 与 P0 无 hot update 保持一致 |
| 禁止输出 | 只在 Step 7 / `03` 中散落 | 定义日志、错误、审计、report、metric、trace 的统一 redaction 规则 | 防止 observability 泄露 |
| 详细设计影响 | Step 7 无回写 | 本 Step 仍不新增 `03` port / DTO;真实 secret provider 属未来回写点 | 避免配置设计静默修改 runtime contract |

## 7. 配置设计取舍

| 议题 | 方案 | 取舍 |
|---|---|---|
| 是否在 P0 引入具体 secret provider | A. 直接指定产品;B. 只定义 secret ref / provider boundary | 采用 B。P0 不锁产品,且 `03` 未定义 secret provider port |
| env 是否可保存 raw token / password | A. 可保存;B. 只能保存 opaque ref | 采用 B。Step 5 已规定 ordinary source 不进入 raw secret |
| 是否记录完整 sensitive ref 到日志 | A. 记录完整 ref 方便排障;B. 只记录 redacted digest / issue ref | 采用 B。完整 ref 可能暴露目标、route 或 credential identity |
| route / target ref 是否算 sensitive | A. 视作 public;B. endpoint-backed / production-like route target 视作 sensitive | 采用 B。真实 route/target 可能揭示外部拓扑或审计目标 |
| redaction deny list 是否是 secret | A. 作为 secret;B. 作为 internal safety-critical | 采用 B。deny list 本身不是秘密,但变更高风险且必须审计 |
| 轮换是否 hot 生效 | A. hot reload;B. restart / new job run | 采用 B。P0 无 reload contract |

## 8. 结构化中间产物

### 8.1 敏感级别归一规则

| 规范级别 | 本项目含义 | Step 7 标签映射 | 处理要求 |
|---|---|---|---|
| `public` | 可公开、无安全含义的 feature label 或 false/true feature gate | `non-sensitive` 中可公开部分 | 可进入普通配置和文档示例 |
| `internal` | 内部运行配置、阈值、retry/batch/timeout、redaction field refs 等 | `non-sensitive`、`security-critical` | 可进入内部配置;变更可能需要审计;不得输出 external body |
| `sensitive` | 暴露会产生安全、运营、拓扑或审计风险的 refs | `sensitive-ref`、`ref-sensitive`、endpoint/target/route/replay refs | 普通配置只能保存 opaque ref;日志/错误/report/audit不得输出 full value |
| `secret` | 真实秘密材料,例如 password、private key、raw token、cert body、raw DSN、raw credential | Step 7 不允许出现 | 不得写入普通配置、文档示例、日志、错误、审计、trace、outbox、report |

### 8.2 敏感配置读取图

#### 敏感配置读取图: L1-governance opaque refs 到 runtime adapter

```text
[ordinary config sources]
  -> [opaque sensitive refs only]
  -> [infra::config parse / validate]
  -> [redacted config identity + validation issue refs]
  -> [runtime builder]
  -> [adapter registry / store registry]
  -> [application ports]

[future secret provider]
  -> [adapter-internal credential resolution]
  -> [never exposed to application/domain/contracts]
```

关键说明:

- 普通 config file、env、entry-local 只能给 opaque ref,不能给真实 secret material。
- `infra::config` 只输出 validated refs、digest、redacted validation issues,不输出 raw secret 或 endpoint body。
- `application`、`domain`、`contracts` 不读取 secret provider,也不持有 raw secret。
- future secret provider 只在 adapter 内部解析 credential,解析结果不得写入 Governance truth、outbox、trace、audit 或 report。
- secret provider 不可用时,必须按 profile / adapter 规则 fail-fast、reject job 或返回 failed marker,不得 fallback fake success。

### 8.3 敏感配置表

| 配置项 | 敏感级别 | 存储方式 | 是否可明文 | 轮换方式 | 审计要求 |
|---|---|---|---|---|---|
| `stores.truth.configRef` when durable-backed | `sensitive` | 普通配置只保存 `GovernanceStoreConfigRef` | 不可保存 DSN / credential / URL body | 新 store ref + restart;future provider rotation 后重建 adapter | 记录 redacted old/new ref digest、profile、validation result |
| `stores.projection.configRef` when durable-backed | `sensitive` | 普通配置只保存 store ref | 不可保存 DSN / credential / URL body | 新 ref + restart | 记录 redacted ref digest 和 projection store slot |
| `stores.reference.configRef` when durable-backed | `sensitive` | 普通配置只保存 store ref | 不可保存 external body / credential | 新 ref + restart | 记录 redacted ref digest 和 reference store slot |
| `stores.outbox.configRef` when durable-backed | `sensitive` | 普通配置只保存 store ref | 不可保存 DSN / queue credential | 新 ref + restart | 记录 redacted ref digest 和 outbox store slot |
| `stores.idempotency.configRef` when durable-backed | `sensitive` | 普通配置只保存 store ref | 不可保存 DSN / credential | 新 ref + restart | 记录 redacted ref digest 和 duplicate replay retention compatibility |
| `externalResolvers.families[].adapterRef` when endpoint-backed | `sensitive` | 普通配置只保存 resolver adapter ref | 不可保存 endpoint credential、HTTP body 或 sibling response body | 新 adapter ref + restart;job retry sees new runtime only after restart | 记录 resolver family、redacted ref digest、availability marker |
| `outbox.publisher.adapterRef` when transport-backed | `sensitive` | 普通配置只保存 publisher adapter ref | 不可保存 bus credential、route secret 或 publish response body | 新 publisher ref + restart | 记录 publisher slot、redacted ref digest、topic completeness validation |
| `outbox.transportTopicBindings` for real transport | `sensitive` | 普通配置只保存 topic-neutral key 到 route ref 的映射 | 不可保存 credential、raw topic secret 或 payload body | 新 route refs + restart;enabled keys must validate before serving | 记录 changed keys、redacted route digest、enabled event coverage |
| `handoff.traceTargets[]` | `sensitive` | 普通配置 / job input 只保存 `TraceHandoffTargetRef` | 不可保存 observability target credential、ledger body 或 package body | 新 target ref + restart or new job run | 记录 target digest、job run id、handoff marker refs |
| `handoff.archiveTargets[]` | `sensitive` | 普通配置 / job input 只保存 target ref | 不可保存 archive credential、archive package body | 新 target ref + restart or new job run | 记录 target digest、archive marker refs、validation result |
| `externalGrc.adapterRef` | `sensitive` | 普通配置只保存 optional adapter ref | 不可保存 external GRC credential or export body | 新 adapter ref + restart;enabled false disables export | 记录 enabled change、redacted adapter digest、validation result |
| `externalGrc.targetRef` | `sensitive` | 普通配置 / job input 只保存 target ref | 不可保存 external GRC endpoint credential or response body | 新 target ref + restart or new export job | 记录 target digest、job run id、export marker refs |
| `testFixtures.replayArtifactRootRef` | `sensitive` | replay config / job input 只保存脱敏 artifact root ref | 不可保存 raw historical body、raw artifact、external payload | new replay ref per run | 记录 run id、artifact root digest、de-identification marker |
| `redaction.denyFieldRefs[]` | `internal` safety-critical | 普通配置保存 forbidden field refs | 可保存 field refs;不可保存 matched raw values | 新 deny list + restart;Step 10 要求评审 | 记录 added/removed field refs、actor、reason、validation result |
| `redaction.safeDiagnosticRefPrefix` | `internal` | 普通配置保存 prefix | 可明文保存 prefix;不得包含 secret/body | 新 prefix + restart | 记录 prefix digest and collision validation |
| `redaction.allowHighCardinalityLabels` | `internal` safety-critical | 普通配置保存 bool | 可明文保存 bool;P0 必须 false | P0 不允许改为 true;future 改动需正式设计 | rejected attempts must create config validation issue ref |
| future raw secret material | `secret` | 不得存储于普通配置;future 仅由 approved secret provider 承载 | 不可明文 | provider-side rotation;Governance runtime只重读 ref / restart | 只记录 provider ref digest,不得记录 material |

### 8.4 Profile 敏感配置处理表

| Profile | 允许的敏感表示 | 禁止项 | 不可用策略 |
|---|---|---|---|
| `local-dev` | fake refs、in-memory store refs、fake target refs | raw secret、real endpoint credential、external body | invalid ref fail-fast;missing optional fake target only when feature disabled |
| `ci-test` | deterministic fixture refs、fake store/adapter refs、fixed clock/id refs | production secret、real target credential、raw fixture body in config | fixture missing test fail-fast |
| `integration-like` | controlled / real-like adapter refs、credential refs、endpoint refs、target refs | raw credential material、sibling body、fake fallback after controlled adapter selected | unavailable -> degraded / delayed / failed marker according to adapter role |
| `operations-replay` | replay artifact root refs、historical de-identified refs、fake or controlled target refs | raw historical body、raw secret、raw external payload | missing replay ref rejected;failed target enters job report |
| `staging-like` | future secret provider refs、durable store refs、transport route refs | raw secret in JSON/env;test fixture override | provider unavailable fail-fast or job rejected |
| `production-like` | future approved secret provider refs only | ordinary raw secret、fake override、test fixture,raw endpoint/body | provider unavailable fail-fast;no fake fallback |

### 8.5 禁止输出规则

| 输出面 | 允许输出 | 禁止输出 |
|---|---|---|
| structured log | operation name、adapter slot、profile、safe error code、safe diagnostic ref、redacted config issue ref | full sensitive ref、secret material、endpoint、route、credential、external response body |
| error response | public / internal error code、validation issue ref、safe message | secret、full target ref、full route ref、raw body、adapter error body |
| audit record | actor ref、change request ref、config section、old/new redacted digest、reason ref、validation result | raw config,raw secret,full sensitive ref,external body |
| trace / span | trace context ref、operation ref、adapter slot、safe diagnostic ref | secret,credential,package body,payload body,high-cardinality raw value |
| metric labels | low-cardinality outcome、adapter slot、profile、error class | full ref、endpoint、route、actor free text、external body digest not approved as safe |
| job report | marker refs、failed reference refs、safe issue refs、counts | full secret/target credential,package body,external GRC response body |
| outbox payload | stored public event payload snapshot from accepted truth | config refs that are not part of public payload,secret,credential,adapter route |
| generated artifacts | redacted evidence indexes and safe report refs | raw config files with secrets,secret provider response,external payload body |

### 8.6 读取 / 轮换 / 审计承接表

| 敏感配置族 | Step 7 回指 | Step 5 来源规则 | Step 9 加载机制承接 | Step 10 变更审计承接 |
|---|---|---|---|---|
| durable store refs | `stores.*.configRef` | ordinary sources only carry refs | validate ref shape,assemble store registry,fail-fast on required store missing | high-risk startup config change,requires old/new redacted digest |
| resolver adapter refs | `externalResolvers.families[].adapterRef` | refs only;fixture only test | validate family coverage,mode/profile compatibility,availability marker | adapter binding change audit per resolver family |
| publisher / route refs | `outbox.publisher.adapterRef`, `outbox.transportTopicBindings` | refs only;topic completeness required | validate enabled event keys and publisher availability | publisher/topic binding change audit |
| handoff / archive target refs | `handoff.traceTargets[]`, `handoff.archiveTargets[]` | config refs or job input refs | validate target enabled before job;reject missing target | target change and per-run target use audit |
| external GRC refs | `externalGrc.adapterRef`, `externalGrc.targetRef` | defaults disabled;explicit refs only when enabled | enabled requires adapter+target;disabled skips export | external export enablement high-risk audit |
| replay artifact refs | `testFixtures.replayArtifactRootRef` | replay config/job input only | operations-replay requires de-identified root ref | replay run audit with artifact root digest |
| redaction safety config | `redaction.*` | defaults/file/env,high-priority invalid fail-fast | validate deny list not empty and unsafe relax rejected | critical audit;changes require review in Step 10 |
| future raw secret provider refs | no raw Step 7 item;future ref extension only | ordinary source may carry provider ref,not material | requires future `03` contract or adapter-local resolution | provider rotation audit without material |

### 8.7 错误模式与处理表

| 场景 | 正式处理 | 不允许的处理 |
|---|---|---|
| ordinary config includes raw secret material | config validation reject | parse as string and continue |
| env contains malformed sensitive ref | fail-fast,do not fallback to lower priority | silently ignore env |
| production-like selects fake resolver/publisher/target | profile validation reject | fallback fake success |
| external GRC enabled but adapter/target missing | startup fail-fast or export job rejected | disable silently |
| route/topic binding missing for enabled event key | startup fail-fast | drop event or ad hoc topic |
| redaction deny list empty | startup fail-fast | allow all fields |
| job input contains raw target credential | job rejected | store in report for adapter |
| replay artifact root points to raw body bundle | job rejected / validation issue | replay raw historical body |
| adapter returns raw external error body | map to redacted failure ref | persist adapter error body |
| future secret provider unavailable | fail-fast / rejected / failed marker by profile | fallback to test fixture in production-like |

### 8.8 敏感配置停审记录

| 配置项 | 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|---|
| `stores.*.configRef` durable path | 存储方式、明文禁止、轮换、审计、输出 | 通过 | P0 in-memory;durable 产品留 P1/P2 |
| `externalResolvers.families[].adapterRef` | endpoint credential 和 sibling body 是否排除 | 通过 | controlled adapter 不保存 raw response |
| `outbox.publisher.adapterRef` | bus credential 和 publish response 是否排除 | 通过 | publisher failure 只给 redacted failure ref |
| `outbox.transportTopicBindings` | route ref 是否不改变 schema | 通过 | topic-neutral key 不变 |
| `handoff.traceTargets[]` / `handoff.archiveTargets[]` | target credential、package body 是否排除 | 通过 | failed target 只进 failed ref / marker |
| `externalGrc.adapterRef` / `externalGrc.targetRef` | external GRC credential/body 是否排除 | 通过 | default disabled |
| `testFixtures.replayArtifactRootRef` | replay raw body 是否排除 | 通过 | operations-replay 必须脱敏 ref |
| `redaction.denyFieldRefs[]` | deny list 是否安全关键、变更需审计 | 通过 | Step 10 细化评审 |
| raw secret material | 是否进入普通配置 | 通过 | 明确 forbidden |
| log/error/audit/report/trace | 是否禁止输出 sensitive / secret | 通过 | 只允许 redacted digest / issue ref |

### 8.9 跨敏感配置泄露风险审计表

| 审计项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 文档是否包含实际 secret material | 未发现 | 仅使用类别名和 opaque ref 示例 |
| 普通配置是否可保存 raw secret | 不可 | validation reject |
| env 是否可覆盖为 raw credential | 不可 | env 只能提供 ref;malformed fail-fast |
| entry-local 是否可传 raw target credential | 不可 | job/entry rejected |
| test fixture 是否可进入 production-like | 不可 | profile validation reject |
| sensitive ref 是否会进入日志 / 错误 / audit | 不应 | 只允许 redacted digest / issue ref |
| route / target ref 是否误判 public | 已修正 | real transport / target ref 视为 sensitive |
| redaction deny list 是否可能被放空 | 不可 | empty fail-fast |
| future secret provider 是否新增 `03` 契约 | 是,若进入 P0/P1 implementation | 当前记录为未来回写点 |
| 轮换是否需要 hot reload | 否 | P0 restart / new job run |
| external body 是否可能通过 config 入仓 | 不可 | forbidden body validation reject |
| 是否需要回写 `03` | 当前无 | 真实 secret provider / hot reload / product schema 需要未来回写 |

## 9. 对详细设计的影响判定

| 配置结论 | 是否影响 03 | 影响类型 | 03 回写位置 | 处理状态 |
|---|---|---|---|---|
| Step 7 非正式标签归一为 `public` / `internal` / `sensitive` / `secret` | 否 | 配置文档术语收敛 | 不适用 | 无回写 |
| 普通 JSON / env / entry-local 只能保存 opaque sensitive refs,不能保存 raw secret material | 否 | 承接 Step 5 / `03` forbidden body 边界 | 不适用 | 无回写 |
| P0 不指定具体 secret provider 产品或 API | 否 | 范围裁剪 | 不适用 | 无回写 |
| 敏感 ref 轮换通过 restart 或 new job run 生效 | 否 | 承接 P0 无 hot update | 不适用 | 无回写 |
| 日志、错误、审计、trace、report 只能输出 redacted digest / issue ref | 否 | 承接 `03` 可观测性安全字段 | 不适用 | 无回写 |
| 若后续要求 adapter 在 runtime builder 中解析真实 secret provider、支持 hot reload、admin override 或产品级 credential schema | 是 | runtime config / adapter constructor / secret loading / audit rollback contract | `03` §13 / Step 14 / object-port-flow 对应 Step | 阻塞待确认 |

## 10. 回填草稿

> 校准来源:
> - `design-calibration/04_config_step_08_sensitive_secrets.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“敏感级别归一规则”“敏感配置读取图”“敏感配置表”“Profile 敏感配置处理表”“禁止输出规则”“读取 / 轮换 / 审计承接表”“敏感配置停审记录”和“跨敏感配置泄露风险审计表”小节,了解 secret / credential / route / target / replay refs 如何从 Step 7 配置项收敛。

正式 `04-配置设计.md` §8 应回填:

- 敏感级别归一规则。
- 敏感配置读取图。
- 敏感配置表。
- Profile 敏感配置处理表。
- 禁止输出规则。
- 读取 / 轮换 / 审计承接表。
- 错误模式与处理表。
- 敏感配置停审记录。
- 跨敏感配置泄露风险审计表。
- 对详细设计的影响判定。

回填要求:

- 正式正文不得出现实际 secret material。
- 不得把 `secret` 当普通字符串配置。
- 不得把 target / route / endpoint-backed refs 输出到 log、error、audit、trace 或 job report 的明文字段。
- 不得把 redaction deny list 放空或允许 high-cardinality labels。
- 不得把 future secret provider 写成 P0 已实现能力。
- 不得提前创建正式 `04-配置设计.md`;正式文档只能在 Step 15 装配。

## 11. 待确认事项

| 待确认事项 | 影响 | 当前处理 |
|---|---|---|
| future secret provider 产品和 API 是否进入 staging/production-like | 影响 adapter constructor、runtime builder、loading validation | P0 不定义;Step 13/14 风险记录 |
| secret rotation 是否需要 zero-downtime reload | 影响 `03` reload contract、rollback、audit | P0 不支持;需要 future design change |
| route / target ref 是否需要更细粒度 redaction 格式 | 影响 log/error/report schema | Step 9 / Step 10 可进一步定义 digest 规则 |
| redaction deny list 变更的审批层级 | 影响变更审计 | Step 10 定义 |
| operations-replay artifact root 的脱敏证明格式 | 影响测试 / 验收证据 | Step 12 下游承接 |

## 12. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| 敏感配置项已识别 | 通过 | 见 §8.3 |
| secret / sensitive / internal 级别已归一 | 通过 | 见 §8.1 |
| 存储方式和明文禁止已明确 | 通过 | 普通配置只保存 refs;raw secret forbidden |
| 轮换方式已明确 | 通过 | P0 restart / new job run |
| 读取和变更审计承接已明确 | 通过 | 见 §8.6 |
| 日志、错误、审计、trace、report 禁止输出已明确 | 通过 | 见 §8.5 |
| 敏感配置停审完成 | 通过 | 见 §8.8 |
| 跨敏感配置泄露风险审计没有 unresolved 冲突 | 通过 | 见 §8.9 |
| 对 `03` 的影响判定已记录 | 通过 | 当前无回写 |
| 可进入 Step 9 | 通过 | 下一步定义配置加载、校验与生效机制 |
