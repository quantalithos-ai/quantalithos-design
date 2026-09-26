# Step 8. 定义敏感配置与密钥管理

> 对应 SOP：`standards/document/配置设计讨论流程_SOP.md` Step 8。
> 回填章节：未来正式 `04-配置设计.md` §8「敏感配置与密钥管理」。
> 当前模式：`full-restart + single-agent-serial`；本文件是中间产物，不是正式 04。
> 安全声明：本文不包含任何 raw secret、token、password、private key、certificate body、DSN、endpoint credential、provider response、文件正文或外部 payload。文中的 `<opaque-ref>`、`<slot>` 和 `<change-marker>` 仅为不可解析的文档占位，不是实例或凭据。

## 1. Step 状态与门禁

| 项目 | 状态 |
|---|---|
| 当前 Step | `8 / sensitive_secrets` |
| Step 状态 | `completed / stop_review` |
| `gate_status` | `pass_with_upstream_blockers` |
| 前序门禁 | Step 1～7 均 `pass_with_upstream_blockers`，Step 7 已停审 |
| 正式 04 写入 | `false`；Step 15 前不得创建 `04-配置设计.md` |
| 允许的下一动作 | `enter_step_09_loading_validation_activation` |
| 实现 / 测试 / commit | `false / false / false` |
| 当前上游 blocker | `SYNC-UP-001~010`、`SYNC-LOCAL-001~005` 原样继承 |

本 Step 的通过只表示敏感级别、opaque ref、最小暴露、轮换、审计承接和零泄露边界已形成设计契约；不表示 secret provider、SDK、外部 source、Review handoff、`.qs-sync` physical backend、Git/filesystem tool 或任何 production profile 已建立、可解析、健康、授权、`bound`、accepted 或 ready。

## 2. 本步目标、范围与非范围

### 2.1 本步目标

本 Step 将 Step 7 的 ref-bearing leaf 归一到配置规范的 `public / internal / sensitive / secret` 级别，并闭合：

1. 每个敏感或安全关键配置项的存储方式、明文禁止、轮换方式和审计要求。
2. 普通 strict JSON、allowlisted environment 和 entry-local 输入只能承载 opaque ref，不承载秘密材料。
3. credential provider 解析只发生在 adapter 私有边界；解析材料不得进入 application、domain、`ValidatedSyncRuntimeConfig`、runtime snapshot、`.qs-sync`、status、diagnostics、log、metric、span、report 或 provenance。
4. local-dev、ci-test、integration-like、operations-replay 及未来 profile 的敏感处理差异和 capability ceiling。
5. 日志、错误、审计、trace、job result 和本地 metadata 的统一禁止输出规则。

### 2.2 本步范围

| 范围 | 本 Step 结论 |
|---|---|
| Step 7 ref-bearing leaf | 逐项列出 metadata、SDK、localTools、support、operations 和 identity 的敏感语义 |
| raw secret boundary | raw credential/material 永远不是普通配置值；出现即拒绝候选/entry/job |
| provider boundary | 只定义 opaque provider ref 与 adapter-local resolution seam；不定义产品或 API |
| rotation | P0 只支持 ref replacement + cold new composition/restart，或显式 new job run；不支持 hot swap |
| audit | 规定安全 marker、slot、profile、validation outcome 和变更关联的最小字段；不新增 03 audit object |
| redaction | 复用 03 的 closed redaction/forbidden-field contract；不能由配置放宽 |

### 2.3 明确非范围

- 具体 KMS、Vault、云 secret manager、credential broker、证书服务或 endpoint 产品。
- 真实 secret 的生成、安装、挂载、权限申请、zero-downtime rotation runbook 或值班流程。
- secret material 在内存中的实现语言级清零保证；只能规定 adapter-local、短生命周期和不外泄边界，不伪造实现证据。
- config center、admin override、hot reload、动态 adapter replacement 或 secret event stream。
- 将敏感 ref 写成完整 CLI 值、环境变量实例、部署文件、测试 fixture、artifact/report/evidence 或 readiness。
- 修改 `ValidatedSyncRuntimeConfig`、Port、DTO、error、state、flow 或 `.qs-sync` physical schema。

## 3. 本步输入与权威边界

| 输入 | 权威级别 | 本 Step 承接内容 |
|---|---|---|
| `04_config_step_07_config_items.md` | 当前 04 直接输入 | 42 个 leaf 的 canonical path、Step 7 敏感标签、source、scope、生效和失败策略 |
| `04_config_step_05_sources_priority_conflicts.md` | 当前 04 直接输入 | `approved default < selected strict JSON < allowlisted environment`；raw material 永不参加 precedence |
| `04_config_step_06_environment_profiles_matrix.md` | 当前 04 直接输入 | 四个 P0 profile 的 fake/provider/replay ref ceiling；future profiles 仅方向 |
| `03-详细设计.md` §13～§15 | 当前正式直接输入 | typed ref、immutable snapshot、adapter-local boundary、redaction-first、safe signal 和 `.qs-sync` forbidden body |
| `03_ddd_step_14_config_dependencies.md` | 当前详细设计中间产物 | `Sync*Bindings`、capability classification、runtime composition 顺序和 ref 不等于 `bound` |
| `03_ddd_step_15_observability_audit.md` | 当前详细设计中间产物 | credential ref 默认不进 telemetry、raw body/secret 全面禁止、sink failure isolation |
| `00-需求文档.md`、`01-架构设计.md`、`02-概要设计.md` | 当前正式基线 | non-overwrite、provenance non-fabrication、owner truth、forbidden body 和 config redline |
| `配置设计讨论流程_SOP.md`、`配置设计书写规范.md` | 流程/结果规范 | 敏感表、禁止输出、轮换、审计、停审和跨泄露审计格式 |

旧 README、旧 05/06、draft 和其他项目的 secret key/产品选择仍是 `historical_material` 或框架参考，不能成为本 Step 的 secret truth。

## 4. SOP 问题回答

| 问题 | L5-sync 回答 |
|---|---|
| 哪些配置是 sensitive 或 secret？ | `sdk.*` 七个 ref、`localTools.allowedTargetRootPolicyRef`、可能指向 durable/endpoint-backed 的 metadata/local-tool/operations refs，以及 `identity.configRef` 的安全标识归为 `sensitive` 或 `internal`；`support.redactionPolicyRef` 是 `internal` safety-critical。真实 credential、token、password、private key、certificate body、DSN、endpoint credential、provider response 和外部正文属于 `secret`/forbidden material，但不是 Step 7 配置项。 |
| 敏感配置如何存储，是否允许明文？ | 普通 JSON、allowlisted environment、entry-local selector 和 job input 只保存 opaque ref 或 safe enum。raw secret/material 永不接受、永不进入文档示例、validated config、snapshot、`.qs-sync`、log、error、audit、trace、report 或 artifact。 |
| 敏感配置如何读取？ | loader 只校验 ref 形态和 canonical field；composition 将 typed ref 交给相应 adapter seam。credential provider 若未来获授权，只能在 adapter 内部解析，应用层只看到 typed call disposition；resolver 不可用保持 `blocked/unknown` 或按必需性 fail-fast。 |
| 敏感配置如何轮换？ | P0 通过新的 opaque ref、重新加载/校验、冷新 composition/restart 生效；job-run-start 的 target/replay/runner ref 只在新 run pin。旧 operation/plan/candidate/attempt 继续使用原 `runtimeBindingSnapshotRef`。不支持原地改写在途 snapshot 或热替换 provider。 |
| 读取和变更需要什么审计？ | 配置读取/校验只产生 safe slot、profile、issue ref、capability disposition 和 bounded change marker；不记录 full ref 或 material。变更由 Step 10 承接 actor/change reason/old-new redacted marker、validation result 和 activation boundary；不新增未经 03 定义的 audit truth。provider 自身的材料访问审计属于 provider/运维 owner。 |
| 日志、错误、审计中如何避免泄露？ | 只允许 closed error code、配置 section/slot、safe diagnostic ref、validation issue ref、bounded profile class 和 approved change marker；credential ref、target/route/path ref 默认不进入 telemetry。不得靠 hash raw ref 自动取得安全性。 |
| profile 如何处理敏感项？ | local-dev/ci-test 只能 fake/deterministic/absent refs；integration-like 可声明 opaque provider/target refs但解析或 capability 仍受 blocker；operations-replay 仅脱敏 replay refs且禁止外部 effect；staging-like/production-like 未来只接受 approved provider refs。 |
| ref 是否等于 secret、bound 或 ready？ | 都不是。ref 只是 binding intent；secret material 解析、constructor validation、owner permission、source freshness、tool health 和 per-entry preflight 仍独立分类为 `bound/blocked/unsupported/unknown` 或 call disposition。 |
| 若发现 raw secret 或 forbidden body 怎么办？ | whole candidate/entry/job reject；不截断、不替换为默认、不写入诊断、不回显原值、不将该事件转成 fake success。安全 issue 只携带稳定 code/opaque issue ref。 |

## 5. 敏感级别与 ref 语义归一

### 5.1 规范级别

| 级别 | L5-sync 含义 | 允许进入普通配置 | 输出/审计规则 |
|---|---|---|---|
| `public` | 不携带安全、拓扑或授权信息的固定类别/布尔语义 | 可以，但仍受 unknown-key/strict JSON 约束 | 可输出有限 closed enum；不带业务正文 |
| `internal` | timeout、limit、profile class、adapter slot、redaction policy 等内部运行信息 | 可作为 typed config；不等于公开 | telemetry 只输出 allowlisted class/code；高风险变更可审计 |
| `sensitive` | credential/provider、durable store、target/route/root policy、外部拓扑或 local identity ref | 只能保存 opaque ref；不得保存材料或正文 | full value、raw ref 和拓扑细节默认禁止；变更只用 approved marker |
| `secret` | 实际秘密材料或 provider response，例如 credential material、private key、certificate body、raw token | 不允许作为任何普通 config leaf | 永久禁止进入 config、memory carrier outside adapter、metadata、telemetry、report 或文档 |

### 5.2 Opaque ref 的四层边界

| 层 | 可承载 | 不可承载 | 当前状态 |
|---|---|---|---|
| raw candidate | canonical opaque ref string（或 `null` 的 Optional slot） | raw secret、endpoint/body、shell、path body、provider response | Step 7/9 校验；strict JSON only |
| validated config / composition | typed `OpaqueRef`、slot identity、profile context | secret material、owner/source payload、Git output、readiness | 03 已定义；new composition 冻结 |
| adapter-private resolution | provider 返回的短生命周期材料（仅在未来正式 contract 允许时） | application/domain/local store/telemetry 持有或缓存 | P0 未实例化；当前 `blocked/unknown` |
| local durable / output | 必要的 typed local relation 或 safe issue marker | secret、full sensitive ref、raw path/body、credential response | `.qs-sync` 和 observability redline 固定 |

`<opaque-ref>`、`<slot>`、`<change-marker>` 等文字只用于本文件说明，不是可解析实例；不得复制到生产配置后误认为 provider 已存在。

### 5.3 安全关键但非秘密的配置

`support.redactionPolicyRef`、redaction deny vocabulary 和 `support.digestAlgorithmRef` 本身不是秘密材料，但它们决定禁止输出、摘要和幂等边界，故按 `internal / safety-critical` 处理：缺失或无法证明安全时 fail-fast；不得由高优先级 source 放宽 deny policy、打开高基数 raw labels 或切换 digest semantics。

## 6. 敏感配置读取与生命周期图

```text
[strict JSON candidate / allowlisted env / explicit job input]
             |
             | opaque ref only; duplicate/alias/forbidden/raw material reject
             v
[config loader + sensitive-shape validator]
             |
             | validated typed ref; no provider payload
             v
[runtime composition + capability classification]
       |                         |
       | slot/ref only            | optional future provider resolution
       v                         v
[immutable snapshot]      [adapter-private resolver]
       |                         |
       | no raw secret/body      | material never crosses adapter boundary
       v                         v
[application ports]       [single bounded external/local call]
       |
       +--> [typed known/denied/unavailable/unsupported/invalid/unknown]

[safe telemetry / local records]
       ^
       | slot + safe code + issue/change marker only
       |
[redaction-first constructor; no post-hoc sink cleaning]
```

生命周期规则：

1. loader 先检查 strict JSON、canonical field、ref grammar 和 forbidden content，再进入 typed validation；原值非法时不写入任何诊断载体。
2. composition 只把 typed ref 和局部 policy 注入 adapter；`AdapterCapabilitySnapshot` 可保存协议所需的 typed binding ref，但不得包含 provider payload、endpoint、credential material、文件正文或 Git stdout/stderr。
3. 若未来 provider 解析材料，材料只能在 adapter 调用的最小生命周期内存在；本 Step 不宣称内存清零、缓存、连接池或 provider 产品实现已经存在。
4. `bound` 仅来自 constructor/static capability validation；credential resolver 成功不自动产生 owner authorization、source freshness、review accepted、Git clean 或 readiness。
5. rotation/rebind 产生新的 composition/snapshot；旧 snapshot 不被覆盖，旧 operation 不读取新 ref。

## 7. 敏感配置清单

> 表中“条件敏感”表示某些 test/in-memory binding 可能不含秘密，但 canonical 设计仍按最严格敏感边界处理。`是否可明文`只讨论配置/输出材料；所有 raw secret material 均为“否”。

| 配置项（回指 Step 7） | 敏感级别 | 存储方式 | 是否可明文 | 轮换方式 | 审计要求 |
|---|---|---|---|---|---|
| `identity.configRef` | `internal/sensitive`（身份标识） | validated config/snapshot 只保留 typed identity ref；普通输出只用 slot/issue marker | 不在 log/metric/span/error 中明文 | 新 candidate identity + cold composition；旧 snapshot 不变 | 记录 section/slot、profile class、validation outcome、change marker；不记录 full ref |
| `identity.profileRef` | `internal` | typed profile ref；telemetry 仅允许 closed profile class（且按 03 允许） | 可在受控配置中存在；不输出业务选择或路径 | 新 profile candidate + cold composition | 记录 profile class 与 activation disposition；不推断 project/version/source/target |
| `metadata.storeAdapterRef` | `sensitive`（durable/endpoint-backed 时） | strict JSON/env 只保存 opaque adapter ref；`.qs-sync` 不保存 provider material | 不可输出 full ref、DSN、credential 或 endpoint body | 新 adapter ref + cold composition/restart；旧 operation 继续旧 snapshot | Step 10 记录 slot、old/new change marker、validation/capability outcome |
| `metadata.unitOfWorkAdapterRef` | `sensitive`（durable 时） | typed UoW ref；不把 connection/credential 放入 runtime snapshot | 否 | 新 ref + cold composition；commit-unknown 历史不迁移 | 记录 UoW slot、activation boundary、safe issue/change marker |
| `metadata.lockAdapterRef` | `sensitive`（durable/remote lock 时） | typed lock ref；不存 lease secret/endpoint | 否 | 新 ref + cold composition；在途 lock 不热换 | 记录 lock slot 和 capability disposition；不记录 lease/body |
| `sdk.sdkProfileRef` | `sensitive` | typed SDK profile ref；不保存 endpoint、version payload 或 provider response | 否（full ref 默认不输出） | 新 SDK profile ref + cold composition | 记录 SDK slot、compatibility issue ref、change marker；不伪造 surface bound |
| `sdk.credentialProviderRef` | `sensitive`（指向 secret boundary） | 只保存 opaque provider ref；材料仅 adapter-private、短生命周期 | 否；raw material 永禁 | 新 provider ref + cold composition/restart；P0 不支持 in-place rotation/hot reload | 只记录 provider slot、safe outcome/issue ref、change marker；provider 自身审计在外部 owner |
| `sdk.ownerAccessAdapterRef` | `sensitive` | typed owner-access ref；不保存权限响应或 principal body | 否 | 新 ref + cold composition；权限变化由 owner read/preflight 重新分类 | 记录 slot、safe disposition、blocker ref；不记录 allow/deny body |
| `sdk.materialSourceAdapterRef` | `sensitive` | typed source adapter ref；不保存 Artifact/Workspace body、endpoint 或 comparator private data | 否 | 新 ref + cold composition；source authority 变化不得由 rotation 隐藏 | 记录 source slot、blocked/unknown reason、change marker |
| `sdk.reviewHandoffAdapterRef` | `sensitive` | typed handoff ref；不保存 credential、request/response body 或 ACK payload | 否 | 新 ref + cold composition；unknown attempt 不因 rotation 自动重发 | 记录 handoff slot、attempt/checkpoint safe refs、change marker |
| `sdk.reviewDecisionReadAdapterRef` | `sensitive` | typed decision-read ref；不保存 Decision body | 否 | 新 ref + cold composition；旧 attempt 的 snapshot 不改写 | 记录 decision-read slot、safe disposition；不输出 decision content |
| `sdk.recoveryProbeAdapterRef` | `sensitive` | typed probe ref；不保存 probe response body | 否 | 新 ref + cold composition；probe-required history 保留 | 记录 probe slot、safe probe disposition、issue/change marker |
| `localTools.gitObservationAdapterRef` | `sensitive`（tool identity/topology） | typed observation ref；不保存 executable path、stdout/stderr、remote URL | 否 | 新 ref + cold composition；不在运行中换工具 | 记录 tool slot、capability disposition；不输出 Git raw result |
| `localTools.gitWorktreeAdapterRef` | `sensitive` | typed worktree ref；不保存 shell/argv/refspec/remote credential | 否 | 新 ref + cold composition；partial/unknown 旧 attempt 不重放 | 记录 apply slot、safe effect disposition、change marker |
| `localTools.filesystemInspectionAdapterRef` | `sensitive`（path/tool policy） | typed inspection ref；不保存 raw path listing/body | 否 | 新 ref + cold composition | 记录 inspection slot、safe issue ref；绝不回显 path body |
| `localTools.filesystemApplyAdapterRef` | `sensitive` | typed apply ref；不保存 file body/diff/permission output | 否 | 新 ref + cold composition；用户 dirty state 不被 rotation 覆盖 | 记录 apply slot、partial/unknown disposition；不记录 diff |
| `localTools.allowedTargetRootPolicyRef` | `sensitive`（path safety） | opaque root-policy ref；entry path 单独校验，不把 raw absolute path写入 telemetry | 否 | 新 policy ref + cold composition；不热扩大 root | 记录 policy slot、validation issue/change marker；不记录 root path |
| `support.diagnosticsAdapterRef` | `internal` / conditional sensitive | typed diagnostics ref；sink credential不进入 config/snapshot | 否（full ref 默认不输出） | 新 ref + cold composition；sink outage不改业务 result | 记录 sink capability/disposition；不把 signal receipt当 evidence |
| `support.redactionPolicyRef` | `internal/safety-critical` | typed redaction ref + closed deny vocabulary；不得保存匹配到的 raw value | policy ref 不在 telemetry 明文；deny field code 可按 allowlist使用 | 新 policy ref + restart/cold composition；禁止 hot relax | 记录 policy change marker、validation outcome、review requirement；不记录 raw match |
| `support.clockAdapterRef` | `internal` | typed provider ref；不保存 clock secret/material | 可在受控 config 存 ref；不输出 full ref | 新 ref + cold composition；旧 snapshot 时间语境不变 | 记录 provider class/issue marker；不将时间值作 secret digest |
| `support.idAdapterRef` | `internal` | typed provider ref；不保存 generator state outside defined port | 同上 | 新 ref + cold composition；不重写既有 IDs | 记录 provider class/activation marker；不输出 ID stream |
| `support.digestAdapterRef` | `internal` | typed digest ref；不保存原文、digest input 或 raw body | 否（输入正文永不明文） | 新 ref + cold composition；算法变化不重算旧 truth | 记录 algorithm/provider slot 与 compatibility outcome |
| `support.digestAlgorithmRef` | `internal/safety-critical` | typed algorithm ref；不保存原文或未批准算法参数 | 可保存 closed algorithm identity；不得输出 raw input | 新 algorithm ref + cold composition；不隐式切换 | 记录 compatibility/change marker；幂等冲突仍按旧语境处理 |
| `operations.accessOrPostureConsumerRef` | `sensitive`（若外部 transport-backed） | nullable typed ref；不保存 topic credential、event body | 否（full ref 默认不输出） | 新 ref + cold registration；旧 consumer 不热换 | 记录 registration intent/disposition；不证明 consumer bound |
| `operations.materialSourceConsumerRef` | `sensitive`（若外部 transport-backed） | nullable typed ref；不保存 source event/body | 否 | 新 ref + cold registration；不改变 source authority | 记录 slot/disposition/change marker；不记录 payload |
| `operations.reviewDecisionConsumerRef` | `sensitive`（若外部 transport-backed） | nullable typed ref；不保存 Decision event/body/credential | 否 | 新 ref + cold registration；ACK/receipt不升格 accepted | 记录 registration disposition；不输出 Decision content |
| `operations.jobRunnerRef` | `sensitive`（若 runner/target-backed） | nullable typed ref；不保存 scheduler credential、job body 或 target path | 否 | 新 ref + cold composition；新 job 才可使用 | 记录 runner slot、job disposition、change marker；不启动隐式 daemon |

以上清单覆盖 Step 7 的所有 ref-bearing leaf；`boundary.*`、`execution.*`、`jobs.*` 数值仍按 `internal` 技术配置处理，不属于 secret，但继续受 Step 7 的 strict validation、审计和禁止输出边界约束。

## 8. Profile 敏感配置处理矩阵

| Profile | 允许的敏感表示 | 允许的解析姿态 | 禁止项 | 不可用 / 泄露处理 | 能力上限 |
|---|---|---|---|---|---|
| `local-dev` | fake、absent 或本地受控 opaque ref；仅用于显式本地 composition | adapter 可返回 `blocked`、`unsupported` 或 `unknown`；不要求真实 provider | raw credential/material、真实 endpoint 内容、自动从目录/Git remote 推断 ref、将 fake 升格 `bound` | malformed ref → startup fail-fast；provider/adapter unavailable → blocked/unknown；不回显原值 | 可构造安全 facade 与负向路径；不证明真实 clone/pull/push-review 或授权 |
| `ci-test` | deterministic fixture ref、fake adapter ref、固定 Clock/ID/Digest ref | 仅 test composition；fixture 本身必须脱敏并与 profile 隔离 | production credential、真实 target、raw fixture body、把 test double 送入 production-like composition | fixture/ref 缺失或 profile 错配 → test composition fail-fast（仅设计状态，未运行） | 只能验证 redaction、拒绝和 unknown mechanics；不生成 integration evidence |
| `integration-like` | controlled/real-like adapter、credential-provider、target/root-policy 的 opaque ref | 解析和 capability 分类仍在 adapter seam；未闭合合同保持 blocked/unknown | raw provider material、source/owner body、fake fallback、通过 ref 覆盖权限/Review Gate | selected ref resolver unavailable → affected route blocked/unknown；必需 slot 可使 composition fail-fast | 可审查跨 adapter 接缝；不等于真实集成成功、accepted 或 readiness |
| `operations-replay` | 脱敏 replay root/target/provider ref、历史 local marker ref | 只读 local carrier/replay；不发新的外部 effect | raw historical body、外部 credential、用 replay ref 重新 submit/handoff/repair、扩大 scope | replay ref 缺失/不可验证 → current job rejected；旧 unknown 仍 unknown/manual | 可设计 exact replay/恢复检查；不自动修复或提交外部副作用 |
| `staging-like`（未来方向） | future approved secret-provider/target/store ref | 需另有 deployment/operations contract | 将未来 ref 写成当前 P0 schema、把 provider availability 当 readiness | 当前 `planned / waiting / blocked`；不产生实例或证据 | 非 P0 gate |
| `production-like`（未来方向） | future approved provider ref only | 需 owner、运维、rotation、observability 和安全合同先闭合 | raw secret、fake override、test fixture、普通 env 明文材料、配置绕过 safety/review | provider 不可用 → fail-fast/blocked；绝不 fallback fake 或 last-known-good 伪装 ready | 当前不实例化、不声明 readiness |

共同不变量：profile 只改变 adapter/ref/test composition 语境，不改变 Project、Artifact、Baseline、Review Gate/Decision、Workspace projection、Archive、Git remote ownership；不改变 state、UoW、idempotency、query zero-write、dirty-worktree、provenance、ACK≠accepted 或 evidence boundary。profile 也不能改变 Step 5 的普通来源优先级。

## 9. 禁止输出与最小暴露规则

### 9.1 输出面矩阵

| 输出面 | 允许的最小字段 | 永久禁止 |
|---|---|---|
| strict validation issue | stable issue code、section/slot code、opaque issue ref、bounded profile class | raw key/value、full ref、provider material、endpoint、path、body、stack |
| structured log | closed event code、adapter slot、capability/disposition、bounded correlation ref、safe diagnostic ref | credential/target/route/root ref 明文、secret、raw request/response、Git/fs output、source/owner body |
| metric label | closed low-cardinality profile class、slot class、capability、disposition、error kind | 任意 ref/key/digest/path/version/cursor/actor、secret 或 endpoint |
| span | approved span name、stage、slot class、bounded operation/correlation ref、instrumentation disposition | credential ref、target/root path、provider payload、raw body、exception dump |
| safe diagnostic | stable diagnostic code、capability、bounded local issue/provenance refs、redaction marker | secret、full sensitive ref、raw path/body、external response、evidence/report/verdict/readiness |
| `.qs-sync` durable metadata | 仅 owning contract 所需 typed ref、binding/snapshot relation、redacted integrity marker | secret/material、credential ref（除非协议明确要求且仍不含材料）、provider body、file body/diff/stdout/stderr、完整 endpoint/root path |
| command/query/job result | typed disposition、safe issue ref、bounded local refs、manual/probe requirement | raw config、full sensitive ref、secret、external payload、Git commit 升格、ACK/receipt 伪装 accepted |
| provenance / local audit | local actor/change marker（按既有 contract）、section/slot、redacted old/new marker、validation outcome | raw config、full ref、provider response、secret、审计正文、formal evidence/verdict/signoff |
| error response | public/internal error code、safe message、validation issue ref、retry/manual posture | 原始异常、stack、provider error body、token、credential、path/body、低层命令输出 |
| documentation/demo | `<opaque-ref>`、`<slot>`、`<change-marker>` 等不可解析占位和类别说明 | 看似真实的 secret、token、URL credential、私钥/证书内容、可复制生产凭据 |

### 9.2 最小暴露原则

1. **先裁剪再序列化**：只能从 typed disposition 和 allowlisted safe field 构造输出；禁止先序列化完整 config/exception/object 再做字符串替换。
2. **ref 不是自动安全**：对 full opaque ref、target/route/root-policy ref、credential provider ref 默认不进 log/metric/span；必要的 owning local record 仅保存协议要求的 typed ref，不把它复制到观测面。
3. **hash 不自动脱敏**：对 raw ref、path、actor、key、body 做 hash 仍可能造成 linkability，除非未来正式威胁模型批准专用类型；本 Step 不批准此类 hash。
4. **sink 不是清洗边界**：diagnostics/telemetry adapter 只能接收 closed safe record；sink 不承担从任意 map 中删除秘密的责任。
5. **失败不回显**：高优先级 source 非法、provider 失败、adapter malformed 和 forbidden-field reject 均只返回 stable issue/disposition；不回显被拒值。
6. **外部材料不落盘**：即便调用成功，provider response、owner/source payload、Git/fs raw output、Review ACK body 也不进入 config、snapshot、`.qs-sync`、report 或 provenance。

## 10. 读取、轮换与审计承接

| 敏感配置族（回指 Step 7） | Step 5 来源规则 | 读取 / Step 9 承接 | 轮换 / Step 10 承接 | 最小审计载体 |
|---|---|---|---|---|
| `identity.configRef`、`identity.profileRef` | configRef 只能经 selected candidate canonical 校验；profile selector 冲突 reject | strict ref grammar、profile allowlist、canonical identity；不读取业务 truth | 新 candidate + cold composition；旧 snapshot 不改 | section/slot、profile class、validation disposition、change marker |
| `metadata.storeAdapterRef`、`unitOfWorkAdapterRef`、`lockAdapterRef` | ordinary source 只能给 opaque ref；test ref 仅 test composition | 逐 slot shape/contract/capability 校验；物理 backend/schema 未闭合则 blocked | new ref + cold composition/restart；旧 UoW/lock/history 不迁移 | slot、capability posture、old/new redacted marker、activation boundary |
| `sdk.sdkProfileRef`、`credentialProviderRef` | ref-only；resolver 不参加普通 raw precedence | ref parse → adapter-local resolution（若获授权）→ per-call disposition；resolver unavailable 不 fallback | new provider/profile ref + cold composition；in-flight attempt pin old snapshot | SDK slot、safe issue/disposition、change marker；材料审计归 provider owner |
| `sdk.ownerAccessAdapterRef`、`materialSourceAdapterRef` | ordinary source 只能给 ref；不能覆盖 owner/source authority | adapter contract、permission/posture/source comparator 逐项判定；unknown fail-closed | new adapter ref + cold composition；不以 rotation 隐藏 source/permission 变化 | slot、blocker/unknown marker、validation outcome；不记录 owner/source body |
| `sdk.reviewHandoffAdapterRef`、`reviewDecisionReadAdapterRef`、`recoveryProbeAdapterRef` | ref-only；ACK/Decision/probe body 不进 candidate | handoff/decision/probe contract validation；effect unknown 保留 | new ref + cold composition；unknown attempt 不换 key/盲重试 | slot、attempt/checkpoint/probe safe refs、disposition、change marker |
| `localTools.gitObservationAdapterRef`、`gitWorktreeAdapterRef` | typed adapter ref；不得从 env 提供 shell/argv/remote | tool capability/root/dirty/path/symlink safety checks | new tool ref + cold composition；不在运行中切 tool | slot、safe disposition、validation marker；不输出 stdout/stderr/remote |
| `localTools.filesystemInspectionAdapterRef`、`filesystemApplyAdapterRef`、`allowedTargetRootPolicyRef` | root policy 只 ref；entry path 是显式 request，不是 secret source | root/path/symlink/non-overwrite contract；unknown reject current entry | new policy/tool ref + cold composition；不热扩大 root | policy/slot、safe issue/change marker；不输出 absolute path/body |
| `support.diagnosticsAdapterRef`、`redactionPolicyRef` | safe provider ref；redaction source 不能放宽 forbidden fields | closed safe-record constructor、deny vocabulary、sink capability | new ref/policy + cold composition；sink outage隔离 | slot、redaction policy version/marker、sink disposition；不记录 signal body |
| `support.clockAdapterRef`、`idAdapterRef`、`digestAdapterRef`、`digestAlgorithmRef` | deterministic ref 仅 test composition；普通 source 不携带 provider material | typed provider/algorithm compatibility；不隐式 fallback system time/random/Git oid | new provider/algorithm ref + cold composition；旧 snapshot/ID/digest 不重算 | provider/algorithm class、compatibility result、change marker |
| `operations.*ConsumerRef`、`jobRunnerRef` | nullable ref；不由 entry flag 隐式启用 | formal contract/capability validation；null 保持未注册 | new ref + cold registration；job run pin old runner | slot、registration intent/disposition、job marker；不记录 topic/body/credential |

审计边界：Step 10 可要求 actor/change-request/reason refs，但不能凭本 Step 发明新的 durable audit object、外部工单字段或 evidence carrier。provider 对真实材料的访问日志归 provider/运维 owner；L5-sync 只保存安全关联 marker。

## 11. 敏感配置错误模式与处理

| 场景 | L5-sync 必须行为 | 影响范围 | 禁止行为 |
|---|---|---|---|
| raw secret/material 出现在 JSON、env、job input 或 entry | whole candidate/entry/job reject；生成无值 safe issue ref | source、启动或当前入口 | 解析为普通 string、截断、mask 后继续、写入日志 |
| sensitive ref 类型非法、为空字符串或 alias 碰撞 | fail-fast；不回退低优先级 | startup/current entry | 静默忽略、fallback fake、使用历史 ref |
| 高优先级 ref 存在但 resolver 不可用 | 保留 `blocked/unknown`；若该 slot 对 profile/route 必需则 fail-fast/reject | affected capability/route | 回退文件/default/cache、把 ref 当 bound |
| provider 返回材料但 adapter 合同不完整 | material 不外泄；call disposition `unsupported/unknown` | affected call | 把 provider success 当 owner permission/accepted/readiness |
| production-like profile 选择 fake/deterministic ref | profile/candidate reject | startup | fake-positive、切换到较宽松 profile |
| `support.redactionPolicyRef` 缺失、deny vocabulary 空或 unsafe relax | startup fail-fast；不构造可写 graph | whole composition | 允许 all-fields、只发 warning、依赖 sink 清洗 |
| full ref/endpoint/path 被 telemetry constructor 接收 | constructor reject/drop；不发送 | signal only | 发送后再清洗、hash 后默认允许 |
| sensitive value 出现在 error/audit/report | 以 stable issue/change marker 替换；原值不回显 | output surface | 把完整 ref/body写入排障记录 |
| rotation 与在途 operation 的 snapshot 不一致 | 新 composition 使用新 ref；旧对象继续旧 snapshot | new vs in-flight | 原地 mutate snapshot、换 key 重放 unknown effect |
| optional operations ref 为 `null` | 保持未注册；受影响能力不升级 | corresponding slot | 报告 disabled=ready、自动创建 daemon/scheduler |
| replay ref 指向未脱敏 carrier | current replay job rejected；不读取 body | operations-replay | 复制 raw历史正文、自动修复或外部提交 |

## 12. 敏感配置逐域停审记录

| 配置域 | 敏感识别 | 存储/读取 | 轮换/审计 | 禁止输出 | 03 影响 | 停审结论 |
|---|---|---|---|---|---|---|
| `identity` | configRef 为 internal/sensitive identity；profile 为 internal | typed ref；不回显 full identity | cold new composition；记录 class/marker | telemetry 默认不出 full ref | 无新增 identity type | 通过（带上游 blocker） |
| `metadata` | durable/endpoint-backed refs 为 sensitive | adapter-local typed ref；physical schema/material 不进入 | ref replacement + restart；slot/capability marker | DSN/credential/endpoint/lease 禁止 | `SYNC-UP-006` 保留 | 通过（`SYNC-UP-006`） |
| `sdk` | profile/credential/owner/source/handoff/decision/probe refs 为 sensitive | ref-only；provider material仅 adapter-private（P0未实例化） | cold replacement；provider owner 审计材料 | ref/body/ACK/Decision/source body 禁止 | `SYNC-UP-001~005/008` 保留 | 通过（上游 blocker） |
| `localTools` | tool/root-policy refs 为 sensitive | typed adapter/root policy；不存命令/path/body | cold replacement；旧 effect 不重放 | executable path/remote/stdout/path body 禁止 | `SYNC-UP-007/009/010`、LOCAL blockers保留 | 通过（上游 blocker） |
| `support` | redaction/provider refs 为 internal/safety-critical | closed safe record；不保存 raw match | policy change需审计；sink failure隔离 | secret/ref/body/high-cardinality 禁止 | 无新增 telemetry truth | 通过（带上游 blocker） |
| `operations` | consumer/runner refs 条件敏感 | nullable typed intent；不含 topic/body/credential | cold registration/new job；不热换 | payload/topic/credential/daemon output 禁止 | consumer/job contract blocker 保留 | 通过（上游 blocker） |

逐域结论：每个有风险的 ref 都有存储、读取、轮换、审计和禁止输出边界；没有把 raw secret 当普通字符串、把 ref 当 bound、或用日志/ACK/report 代替安全事实。

## 13. 跨敏感配置泄露风险审计

| 审计项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 文档是否含 raw secret/material | 未发现 | 仅使用不可解析占位和类别名；正式 04 同样不得写实例材料 |
| Step 7 sensitive 标签是否统一为规范级别 | 通过 | 使用 `public/internal/sensitive/secret`；`secret` 仅表示禁止材料，不是当前 leaf |
| ordinary file/env 是否可承载 raw credential/body | 不可 | Step 5 source validator whole-candidate reject |
| entry-local/job input 是否可绕过 ref-only | 不可 | 当前 entry/job reject；不写 raw target/provider material |
| full opaque ref 是否泄露到 log/metric/span | 默认不可 | 只允许 slot/class/safe issue marker；owning local record 例外仍不进 telemetry |
| redaction policy 是否可被高优先级 source 放宽 | 不可 | unsafe/empty deny policy startup fail-fast；禁止 hot relax |
| provider response/owner/source/Git/fs body 是否落入 metadata | 不可 | 03 forbidden-field matrix 与 `.qs-sync` logical boundary 固定 |
| fake/deterministic ref 是否进入 production-like | 不可 | profile validation reject；不 fallback fake |
| rotation 是否会改写历史 snapshot/provenance | 不可 | new composition/snapshot；旧 operation/attempt pin 原 ref |
| unknown resolver/adapter 是否被当作 bound | 不可 | 四态 capability 和 call disposition 分层；affected route blocked/unknown |
| hash 是否被误当作通用脱敏 | 不可 | 未经 threat model/approved type 不 hash raw ref/path/key/body |
| sensitive audit 是否创建新业务 truth | 不可 | 只使用既有 safe local marker/Step 10 change audit seam |
| config reject 是否写入 `.qs-sync` fake audit record | 不可 | best-effort safe telemetry；不伪造 business provenance |
| profile 差异是否放宽安全红线 | 不可 | 四个 P0 profile 统一禁止 raw material；future profile waiting |
| 是否需要回写 03 | 当前不需要 | 只细化敏感级别/输出/轮换；secret provider product、hot reload、new audit object 会触发未来回流 |

## 14. 对详细设计的影响判定与回填草稿

### 14.1 影响判定

| 配置结论 | 是否影响 03 | 影响类型 | 03 回写位置 | 处理状态 |
|---|---|---|---|---|
| Step 7 标签归一为 `public/internal/sensitive/secret` | 否 | 文档术语收敛 | 不适用 | `无回写` |
| 普通 source 只能保存 opaque ref，raw material 永远拒绝 | 否 | 承接既有 ref-only/forbidden-body invariant | 不适用 | `无回写` |
| provider 解析（若未来授权）只在 adapter-private 边界 | 否 | 细化既有 adapter seam，不新增 Port | 不适用 | `无回写` |
| rotation 通过 new ref + cold new composition/restart 或 new job run | 否 | 承接既有 immutable snapshot pinning/no hot update | 不适用 | `无回写` |
| telemetry、error、audit、report 只携带 safe marker，credential ref 默认禁止 | 否 | 承接 `03` §14/§15 closed redaction | 不适用 | `无回写` |
| 若未来引入具体 secret provider API、runtime hot reload、admin override、原地 key rotation、provider event 或新的 durable audit object | 是（未来触发） | 改变 config carrier、builder、adapter lifecycle、audit/rollback contract | `03` §13、Step 14/15 及对应 object/flow | 当前不触发；变更前必须回流 |

当前计数：`待回写=0`；`阻塞待确认=0`。上游 blocker 仍限制正向 capability，不构成 Step 8 的 code-contract 回写。

### 14.2 正式 §8 回填草稿

正式 `04-配置设计.md` §8 应依次装配：

1. 敏感级别归一规则和 opaque ref 四层边界；
2. 敏感配置读取与生命周期图；
3. 逐项敏感配置表（回指 Step 7）；
4. P0/future profile 处理矩阵；
5. 输出面与最小暴露规则；
6. Step 5/9/10 读取、轮换、审计承接表；
7. 错误模式、逐域停审、跨泄露审计和 03 影响判定。

正式正文必须继续声明：示例不会包含秘密材料；ref 不等于 bound/health/permission/accepted/readiness；P0 不支持 hot reload 或具体 secret provider；`.qs-sync` 不承载 raw secret、provider payload、外部正文或 telemetry dump。

## 15. 待确认事项（不阻塞本 Step）

| 待确认事项 | 影响 | 未确认前处理 | 归属 |
|---|---|---|---|
| future secret provider 的产品/API、内存生命周期和 provider-side audit | Step 9 adapter resolution、Step 10 change audit、未来 07 | P0 只接受 opaque ref；positive provider capability `blocked/waiting` | 上游/未来 03/07 |
| route/target/root-policy ref 的最终安全显示规则 | Step 9 safe presenter、Step 10 audit marker | 默认不进 telemetry；仅 slot/class/safe issue marker | Step 9/10 |
| redaction policy 变更的评审角色与外部变更请求载体 | Step 10 high-risk audit | 仅记录待确认 marker；不发明工单字段 | Step 10 |
| zero-downtime rotation / overlapping provider generations | 03 lifecycle、rollback、concurrency | P0 restart/new composition；旧 snapshot 不动 | 未来架构/03 |
| operations-replay carrier 的脱敏证明和保留期 | Step 12/13、05/06 方向 | 只接受脱敏 ref；未验证则 job rejected | `SYNC-UP-006`/下游 |
| `identity.configRef` full ref 是否允许出现在 owning local record | Step 9/10 schema | 当前只存 typed relation；telemetry 永不输出 | 03/Step 9 |

## 16. Step 自检与进入下一步门禁

| 检查项 | 结果 |
|---|---|
| sensitive/secret/internal/public 级别已统一 | pass |
| 每个敏感 ref-bearing leaf 均回指 Step 7，并有存储、明文、轮换、审计口径 | pass |
| raw secret/material 未进入正文、demo、candidate、snapshot、`.qs-sync` 或输出面 | pass |
| Step 5 source precedence、非法高优先级 fail-fast 和 ref-only 规则已承接 | pass |
| 四个 P0 profile 与 future profile 的敏感处理、能力上限和泄露边界已区分 | pass |
| provider 解析、adapter capability、owner permission、accepted/readiness 没有混层 | pass |
| log/error/metric/span/diagnostic/report/provenance 禁止输出规则完整 | pass |
| rotation 不改写在途 snapshot、不会换 key 盲重放未知 effect | pass |
| 每个敏感域已停审，跨配置泄露审计无 unresolved 冲突 | pass |
| 03 影响判定无待回写、无阻塞待确认 | pass |
| 未创建正式 04、未创建 Step 9 文件、未实现/测试/提交 | pass |

### Step 8 结论

`gate_status = pass_with_upstream_blockers`；`Step status = completed / stop_review`。允许进入 `04_config_step_09_loading_validation_activation.md`。正式 `04-配置设计.md` 仍不存在；本文件不构成任何 secret provider、实现、测试、artifact、report、evidence、review verdict、signoff 或 readiness 事实。
