# L2-tools 04 配置设计 Step 8：敏感配置与密钥管理

> 对应 SOP：`standards/document/配置设计讨论流程_SOP.md` Step 8
> 对应书写规范：`standards/document/配置设计书写规范.md` §5.8
> 回填目标：`projects/L2-tools/04-配置设计.md` §8
> 状态：`completed / pass; continuous authorization`
> 模式：`full-restart / single-agent-serial`

## 1. Step 状态与 Step 内计划

| 项目 | 记录 |
|---|---|
| 当前 Step | Step 8 定义 sensitive / secret 的存储、读取、轮换、审计与禁止输出边界。 |
| 前序门禁 | Step 7 `completed / pass; stop review`；54 个 canonical item 均已标注敏感级别和来源 lane。 |
| 本步状态 | `completed / pass; continuous authorization` |
| 正式文档写入 | 关闭；本文件只形成正式 §8 的回填草稿。 |
| 当前 blocker | 无新增；`L2T-UP-001~009` 继续限制外部正向 binding。当前没有通用 secret provider / resolver 契约，production-like 继续 inactive。 |
| 下一动作 | 按连续授权进入 Step 9，定义加载、校验、装配与生效。 |
| 提交 | 不需要；未经用户明确要求不提交。 |

### 1.1 Step 内计划

- [x] 读取配置 SOP Step 8、书写规范 §5.8、Step 5/7、`03` §13~§14 和 redaction 约束。
- [x] 将 Step 7 的项目内敏感标签映射到规范的 `public/internal/sensitive/secret` 四级词表。
- [x] 逐组回指 Store/UoW/Idempotency/adapter/target/Clock/ID/policy refs。
- [x] 定义 ref-only 读取链、明文禁止、轮换、审计和生命周期。
- [x] 定义所有输出面的 allowlist / denylist 以及 secret-derived digest 禁止规则。
- [x] 完成逐组停审、跨敏感项泄露审计和 `03` 影响判定。

## 2. 本步目标与边界

本 Step 只处理配置 metadata/ref 的敏感性。L2-tools 不拥有 secret store、credential authority、证书生命周期或部署平台，也不在 `04` 中选 Vault、KMS、文件挂载、容器 Secret、云产品或具体 credential schema。

配置层只允许出现可校验的 opaque ref。真实 token、password、private key、certificate/trust body、DSN credential、URL userinfo、provider response、raw endpoint body 永远不是 `ToolsConfigCandidate` 字段，也不得进入 `ToolsRuntimeConfig`、Store、Port DTO、日志、错误、审计、trace、event、receipt、report 或文档 demo。

## 3. 本步输入

| 输入 | 已确认结论 | 本步承接 |
|---|---|---|
| Step 5 | 普通来源 `D < F < E`；R/X/L 独立；raw material 不进入普通 merge。 | 固定 ref lane 与 ordinary lane 分离。 |
| Step 7 | 54 items；17 组 adapter/target/policy refs 标为 `sensitive-ref` 或 `secret-ref-only`。 | 逐组规定存储、读取、轮换与审计。 |
| `03-详细设计.md` §13.1~§13.6 | Candidate/runtime 只含 typed ref；builder 使用 adapter registry；未定义通用 secret resolver Port。 | 不新增 secret resolver、constructor 或 raw credential field。 |
| `03-详细设计.md` §13.8、§14 | `NC-L2T-008/017`、body-free/typed redaction、配置失败安全字段。 | 形成 no-output allowlist 和 fail-closed 规则。 |
| `00~02` 安全边界 | raw body/credential、外部事实和 readiness 不归 L2。 | ref 存在不升级为 authority/readiness。 |

## 4. SOP 问题逐项回答

### 4.1 哪些配置是 sensitive 或 secret？

- Store、UoW、Idempotency、external adapter、visibility、handoff target、Clock/ID 的完整 ref 可能泄露 topology、backend family、tenant 或 deployment identity，规范级别为 `sensitive`。
- `bodyPolicyRef` 与 `redactionFloor` 若来自外部受控注册表，完整 ref 同样为 `sensitive`；它们不是 secret material。
- password、raw token、private key、certificate/trust body、DSN credential、URL userinfo 和 provider response 是 `secret`，但它们不是 L2 配置项，只是明确禁止输入的材料类别。
- profile name、closed mode/feature、schema version 与安全类别可为 `public`；有界 limit/timeout/retry/retention 等为 `internal`。

### 4.2 如何存储，是否允许明文？

严格 JSON 与 allowlisted env 只能保存 typed opaque ref 的编码，不能保存引用所指向的材料。完整 sensitive ref 只存在于受保护配置输入和 infra-private candidate 生命周期；公开输出只允许 section、slot、kind 与不可逆的安全投影 identity。Secret material 明文在 JSON/env/CLI/document/fixture metadata 中一律拒绝。

### 4.3 如何读取？

当前 P0 没有通用 secret provider Port。Loader 只读取 ref；validator 只校验 ref type、profile、family、requiredness 和组合关系；runtime builder 只用该 ref 在部署/实现提供的 adapter registry 中选择已经满足 `03` capability contract 的构造入口或 handle。任何未来需要 L2 主动解析 credential material 的方案，都必须先回写 `03` 的 constructor/lifecycle/error contract，再重开 `04`。

### 4.4 如何轮换？

P0 全部是 startup-frozen。轮换通过“创建新的完整候选配置 -> 全量验证 -> 构建新 runtime graph -> 切换进程/assembly”完成，不在既有 graph 中热替换 ref。job-startup target 只允许新 Job 选择已验证 target snapshot；旧 Job、旧 attempt、旧 receipt/report 不被改写。已 compromised/revoked/expired 的 material 不能通过回滚重新启用。

### 4.5 读取和变更如何审计？

L2 配置审计只记录 actor/change/reason/config/profile/section/slot、old/new safe digest、validation result 与 issue ref。它不记录 raw value、full ref、provider access body 或 secret-derived hash。Secret provider 自身的材料读取/轮换审计属于 provider/运维 owner；L2 只能引用其 safe audit ref，不能伪造该记录。

### 4.6 如何避免输出泄露？

使用固定安全字段 allowlist，不做“先打印再正则脱敏”。任意字段无法证明通过 typed redaction / forbidden-body guard 时，输出必须 fail closed。特别禁止通过 hash 让 secret 变成“可输出”：secret-derived digest 仍是 secret side-channel，不进入 L2 surface。

### 4.7 是否影响 `03`？

不影响。这里把 `03` 已有 typed-ref 和 redaction 边界落实为配置规则，没有增加 field、Port、constructor、lifecycle 或 error。未来引入主动 secret resolution、live rotation 或 credential-bearing constructor 时才触发回写。

## 5. 当前材料诊断与改动前后对比

| 诊断项 | Step 8 前 | Step 8 后 |
|---|---|---|
| 敏感词表 | Step 7 使用 `sensitive-ref/secret-ref-only` 项目内标签。 | 映射为规范 `sensitive` metadata/ref；raw material 单独为 `secret` 且不是配置项。 |
| ref 与 material | 已禁止 raw secret，但读取责任未完全展开。 | loader/validator 只读 ref；builder 只绑定 registry handle；无通用 material resolver。 |
| 轮换 | 仅知道 startup 冻结。 | 新候选全量重装配；无 hot/reload；旧 Job/attempt/report 不改写。 |
| 审计 | 仅有 redacted config identity。 | 明确 actor/change/reason/section/safe digest/result allowlist 与 provider audit owner 分离。 |
| 输出 | 仅有 body-free 总则。 | 覆盖 log/error/metric/span/audit/event/receipt/report/demo；禁止 full ref 与 secret-derived digest。 |

## 6. 设计取舍

| 议题 | 当前选择 | 原因与代价 |
|---|---|---|
| 是否把 `secret-ref-only` 当 secret | 否；它是只能保存 ref 的 `sensitive` 配置 | 防止把 locator 与授权材料混为一类，同时保持明文禁入。 |
| 是否定义通用 secret provider | 不定义 | `03` 没有对应 Port/constructor；配置设计不能静默扩展代码契约。 |
| 是否允许 env 存 raw secret | 不允许 | env 只可编码已登记 opaque ref；非法高优先级值 fail-fast。 |
| 是否输出 ref hash | 仅允许已定义 canonical safe projection 的不可逆 digest | full ref hash 可能成为稳定拓扑标识；secret-derived hash 永远禁止。 |
| 是否支持 live rotation | P0 不支持 | 保持 immutable runtime graph 和可复现 config identity；代价是需新 assembly/restart。 |
| 是否用 fake 代替不可用 secret | 不允许 | CI fixture 是显式 profile，不是 real-like fallback，更不能证明 provider readiness。 |

## 7. 敏感级别归一规则

| 规范级别 | L2-tools 精确定义 | Step 7 标签映射 | 允许输入 | 输出规则 |
|---|---|---|---|---|
| `public` | closed technical label，无 topology/identity/credential 意义 | `public` | D/F/E/X/L 按字段规则 | 仅 fixed allowlist。 |
| `internal` | 非秘密但有运营含义的 bounded parameter/category | `internal` | 受保护 JSON/env | 只输出 category/section，不输出原值。 |
| `sensitive` | topology、adapter/store/target/policy identity 或 provider locator | `sensitive-ref`、`secret-ref-only` | 只能是 typed opaque ref | full value 禁止；仅 slot/kind/safe projection digest。 |
| `secret` | 可授权或包含受保护正文的材料 | 不得成为 Step 7 item | 不允许进入 L2 config | 任何 L2 输出面均禁止。 |

`secret-ref-only` 中的 `secret` 表示“该配置只可保存 locator/ref，禁止内联 material”，不表示 locator 本身可以获得 `secret` 输出豁免。

## 8. 结构化中间产物

### 8.1 敏感配置读取图：ref-only startup binding

```text
[protected strict JSON / allowlisted env]
              |
              | typed opaque ref only
              v
[infra/config loader + source attribution]
              |
              v
[type/profile/family/cross-section validation]
              |
              v
[validated ref + redacted config identity]
              |
              v
[runtime builder -> pre-registered adapter/target/policy registry]
              |
              v
[typed Store/UoW/Port/Clock/ID handle]
              |
              v
[complete runtime graph exposed]

Never enters candidate/runtime/output:
raw token/password/private key/cert body/DSN credential/provider body
```

关键说明：

- 图中的 registry 是 `03` 已有 composition seam，不是 L2-owned capability registry 或 secret store。
- ref 可通过 type/slot/family 校验，但 ref 存在不证明 provider authority、readiness、delivery 或 observation。
- 任一 required ref 或 capability 不满足时丢弃 partial graph，不暴露 entry bundle。
- 真实材料读取与保管由部署选择的 adapter/provider owner 负责；本轮没有材料级成功路径声明。

### 8.2 敏感配置总表

| 配置项 / 配置组 | 规范级别 | 存储方式 | 是否可明文 | 轮换方式 | 审计要求 |
|---|---|---|---:|---|---|
| `stores.{contract,binding,invocation,handoff,outcomeAudit,submission,projection}.adapterRef` | sensitive | protected JSON/env 中 typed opaque ref | 仅 ref；材料否 | 新完整 Store graph + restart | Store slot、kind、old/new safe digest、validation result；无 full ref。 |
| `stores.uow.bindingRef` | sensitive | typed UoW capability ref | 仅 ref | 与七 Store 作为一个原子配置组重装配 | pair atomicity/CAS capability class、result；无 connection material。 |
| `idempotency.{commandConsumer,continuationJob}.adapterRef` | sensitive | typed sidecar ref | 仅 ref | 与 retention/replay surface 一起重装配 | sidecar slot、replay capability、safe digest、result。 |
| `adapters.core.adapterRef` | sensitive | typed Core adapter ref | 仅 ref | 新 candidate/blocked-aware binding + restart | slot、blocked category、result；不声明 Core readiness。 |
| `adapters.visibility.adapterRef` | sensitive | typed visibility resolver ref | 仅 ref | 新 resolver graph + restart | slot/result/safe issue ref；不输出 scope material。 |
| `adapters.bodyPolicyRef` | sensitive | typed policy ref | 仅 ref | 仅可等强或收紧；新 assembly | policy class、old/new safe digest、validation result。 |
| `handoff.targetRefs` | sensitive | bounded typed ref list | 仅 ref | startup 新 registry；job-startup 选已验证 snapshot | target count/class/set safe digest；无 endpoint/credential。 |
| `clockId.clockRef` | sensitive | typed adapter ref | 仅 ref | 新 assembly；CI deterministic ref 仅 CI | slot/profile/result；无 seed/time body。 |
| `clockId.idGeneratorRef` | sensitive | typed adapter ref | 仅 ref | 新 assembly；CI deterministic ref 仅 CI | slot/profile/result；无 raw seed/namespace body。 |
| `features.redactionFloor` | sensitive when external | typed policy ref | 仅 ref | 只可等强/收紧；新 assembly | floor class、result、issue ref；无 rule body。 |
| password/token/private key/cert/trust body/DSN credential/URL userinfo/provider response | secret, non-item | provider-owned material | 否 | provider/ops owner 操作后新 assembly | provider-owned access audit；L2 只可持 safe audit ref。 |

### 8.3 Profile 敏感处理矩阵

| Profile | 允许 | 禁止 | 不可用时 |
|---|---|---|---|
| `local-dev` | local adapter refs、显式 fake refs | raw secret、隐式 real credential、未标记 fixture | required ref/capability fail-fast。 |
| `ci-test` | deterministic fixture/Clock/ID refs | 真实 secret、production target、把 fake 标 ready | fixture/ref 缺失使 test assembly 不成立。 |
| `integration-like` | controlled adapter/target refs | raw material、CI fake fallback、endpoint-as-ready | required local binding fail-fast；外部 contract gap 保持 blocked/unverifiable。 |
| `staging-like` | future approved opaque refs only | 当前启用、fixture、raw material | inactive/blocked，待 owner/schema/ops contract。 |
| `production-like` | 当前无成功配置 | 所有当前 fake/fixture/ref-only readiness claim | inactive/blocked；不能借 secret ref 关闭 blocker。 |

### 8.4 读取、生命周期与轮换规则

| 阶段 | 可见数据 | owner / 保留期 | 失败行为 |
|---|---|---|---|
| source load | raw JSON bytes、allowlisted env ref encoding | `infra/config.rs`，仅 parse 生命周期 | raw-secret/forbidden key/value-free typed reject。 |
| candidate | typed ordinary value + opaque ref + source ref | infra-private，validation 生命周期 | 不进入 application/domain/contracts。 |
| cross validation | ref kind/family/profile/requiredness/safe floor | config validator | mismatch/orphan/unsafe override fail-fast。 |
| builder binding | validated ref + pre-registered registry | runtime builder | missing/capability mismatch 丢弃 partial graph。 |
| runtime | typed Store/UoW/Port/Clock/ID handles + redacted config ref | process/assembly 生命周期 | 不保留 raw candidate 或 material。 |
| rotation | new complete candidate | 新 assembly | 旧 assembly 不被局部修改；失败不切换。 |
| job target selection | validated target snapshot | 当前 Job 生命周期 | invalid selector 只拒绝 Job；不修改 global registry。 |

### 8.5 禁止输出规则

| 输出面 | 允许字段 | 禁止字段 |
|---|---|---|
| config validation log/error | `config_source_ref`、section、slot、profile、issue kind/ref、diagnostic ref | raw config/value、full ref、secret、parser/backend body、stack。 |
| metric/span | section、slot、result、issue class、profile、low-cardinality availability | ref/address/target/actor、secret-derived hash、高基数 body。 |
| config change audit | actor/change/reason refs、section、activation kind、safe old/new digest、result、rollback ref | raw old/new document/diff、full ref、material、provider response。 |
| `ToolAuditEntry` | 只使用 `03` 已允许的 invocation/outcome safe fields | 任何 config ref/material；配置审计不得混入业务审计。 |
| event/receipt/report | 既有 body-free typed carrier、safe issue/ref/count | config body、target credential、secret、endpoint/provider body。 |
| JSON/demo/README | symbolic non-operational refs | 真实 endpoint、secret、credential、certificate、route、evidence alias。 |
| diagnostic artifact | stable issue code/ref 和 canonical safe projection | raw input、full sensitive ref、secret-derived digest。 |

### 8.6 逐组停审记录

| 配置组 | ref/material 分离 | 明文禁止 | 轮换 | 审计/no-output | 结论 |
|---|---|---|---|---|---|
| seven Stores + UoW | 清楚 | 清楚 | complete graph restart | slot/capability only | 通过 |
| Idempotency/replay sidecars | 清楚 | 清楚 | retention 同组重装配 | replay class only | 通过 |
| external/visibility adapters | 清楚 | 清楚 | blocked-aware graph restart | no readiness/body | 通过 |
| handoff targets | 清楚 | 清楚 | registry restart / Job snapshot | count/class/digest only | 通过 |
| Clock/ID | 清楚 | 清楚 | restart；fixture profile fence | no seed/time body | 通过 |
| body/redaction policies | 清楚 | 清楚 | equal-or-stricter restart | no rule body | 通过 |
| secret material non-items | 明确不入 L2 | 全面禁止 | provider owner + new assembly | provider audit owner | 通过 |

### 8.7 跨敏感配置泄露风险审计

| 审计项 | 结论 | 缺口 / 修正 |
|---|---|---|
| raw secret 是否进入 JSON/env/demo/candidate | 通过 | 全面禁止；检测即 typed reject。 |
| locator 是否被误当 material 或 public | 通过 | 统一为 sensitive opaque ref；full value 禁止输出。 |
| 是否新增未在 03 定义的 secret resolver | 通过 | 未新增；future material resolution 触发回写。 |
| 是否存在 fake/fixture fallback | 通过 | 仅显式 Local/CI；real-like 不回退。 |
| 轮换是否修改 in-flight truth | 通过 | 新 assembly；旧 Job/attempt/result/report immutable。 |
| 日志/错误/审计/report 是否泄露 | 通过 | fixed allowlist；无法证明 redaction 时 fail closed。 |
| hash 是否成为泄露旁路 | 通过 | secret-derived digest 禁止；sensitive digest 仅 safe projection。 |
| ref 是否被升级为 readiness/evidence | 通过 | ref 只表达 binding candidate；`L2T-UP-001~009` 保持 open。 |

## 9. 对详细设计的影响判定

| 配置结论 | 是否影响 03 | 影响类型 | 03 回写位置 | 处理状态 |
|---|---|---|---|---|
| opaque ref 与 raw material 分离 | 否 | config sensitivity detail | 03 §13.2、§13.8 已定义 | 无回写 |
| builder 只用已验证 ref 绑定既有 registry | 否 | existing composition detail | 03 §13.3~§13.6 | 无回写 |
| startup rotation 使用新 assembly | 否 | existing startup lifecycle | 03 §13.3 | 无回写 |
| fixed safe output allowlist | 否 | redaction detail | 03 §14 | 无回写 |
| future 通用 secret resolver、material-bearing constructor、live rotation | 是 | Port/constructor/lifecycle/error | 先回写 03 §4~§15 | future trigger，当前未触发 |

## 10. 正式 04 §8 回填草稿

正式 §8 应装配：四级敏感词表、ref-only 读取图、敏感配置总表、profile 矩阵、读取/生命周期/轮换表和禁止输出表。必须显式写明：本轮没有通用 secret resolver；secret material 不是 L2 配置项；production-like 无成功配置；ref 存在不等于 authority/readiness。

## 11. 待确认事项

| 事项 | 影响 | 待确认方 | 未确认前处理 |
|---|---|---|---|
| durable adapter registry 如何获得 provider material | future staging/production | 实施/安全/运维及 adapter owner | 不新增 L2 Port；production-like inactive。 |
| sensitive ref canonical safe projection 算法 | config audit/test | 安全/实施 | 未定义前省略 digest，不输出 full ref/hash。 |
| compromised material 的 provider-side撤销证据 | future 运维 | secret/provider owner | L2 不声明撤销完成或 evidence。 |

以上均为 future deployment/implementation 输入，不构成当前 `03` 回写 blocker。

## 12. Step 8 review gate

| 门禁 | 状态 | 说明 |
|---|---|---|
| sensitive/secret 词表统一 | 通过 | 项目内标签已映射到规范四级；raw material 为 non-item。 |
| 存储/读取/轮换/审计闭合 | 通过 | ref-only、new assembly、owner 分离均明确。 |
| 禁止输出覆盖完整 | 通过 | log/error/metric/span/audit/event/receipt/report/demo 均覆盖。 |
| 敏感项逐组停审 | 通过 | 七组全部通过。 |
| 泄露风险跨项审计 | 通过 | 无 unresolved leak path。 |
| 03 影响判定 | 通过 | 当前无回写；future triggers 已记录。 |
| 下一动作 | 允许 | 连续授权下进入 Step 9。 |
