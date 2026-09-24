# Step 8. 定义敏感配置与密钥管理

> 对应 SOP：`standards/document/配置设计讨论流程_SOP.md` Step 8
> 回填章节：`04-配置设计.md` §8
> 粒度参考：`projects/L1-governance/design-calibration/04_config_step_08_sensitive_secrets.md`
> 输入：Step 5～7、03 Step 12/14/15
> 状态：`completed / pass / self_reviewed`

## 1. Step 状态与结论

| 项 | 当前值 |
|---|---|
| current_document | `04-配置设计.md` |
| current_step | Step 8 |
| current_module | `sensitive:refs_resolution_and_zero_leakage` |
| gate_status | `pass_for_step_09` |
| gate_reason | sensitive/secret 分类、opaque ref 解析边界、最小暴露、轮换、审计、逐项停审和零泄露审计均已闭合；真实 provider 仍受 authority blocker。 |
| formal_04_write_allowed | `false_until_step_15` |
| next_allowed_action | 创建并完成 `04_config_step_09_loading_validation_activation.md` |

当前 JSON 中没有 raw secret 配置项，但存在 `sensitive_ref`。`bindingRef`/store/cache/target/policy refs 可能暴露拓扑或关联敏感 provider，因此允许保存 opaque ref，禁止保存或输出解析后的 endpoint、credential、token、DSN、key、cert、path 或正文。

## 2. SOP 问题回答、诊断与取舍

| 问题 | 收口回答 |
|---|---|
| 哪些是 sensitive/secret？ | store/cache/external/observability/archive refs、redaction policy ref、fixture ref 归 `sensitive`；profile/slot/limits/booleans归 `internal`；raw token/password/key/cert/credential-bearing endpoint/DSN/secret material 为 `secret` 且禁止成为配置项。 |
| 如何存储，能否明文？ | strict JSON 可保存 opaque sensitive ref，但不能保存 raw material。完整 ref 也不进入普通日志/错误/report；只用 safe classification、slot、redacted digest 或 issue ref。 |
| 如何轮换？ | P0 无 hot reload。生成/选择新 opaque ref → 新文档身份 → 新 assembly；Job 已冻结旧 snapshot。Provider-side material rotation若不改变 ref，也必须让新调用/新 assembly重新做 availability，不能原地改 owner truth。 |
| 是否需要审计？ | config source/validation/变更需安全记录 source ref、config ref、profile、section/slot、old/new redacted digest、actor/change ref（若正式来源提供）和结果；Runner 本地记录不是正式安全审计/evidence。 |
| 如何防日志/错误泄露？ | parser/validator绝不回显 value/whole document；adapter把 raw SDK/OS/provider错误映射为 safe issue ref；metrics只用低基数类别；trace/report/handoff只携带正式 safe refs。 |
| provider 不可用怎么办？ | required ref 解析/能力验证失败则 assembly/operation fail-closed；不回退 raw value、旧 material、test fixture、private API 或 fake success。 |

| 议题 | 风险方案 | 当前取舍 | 理由 |
|---|---|---|---|
| ref 是否可明文日志 | 便于排障但可能暴露拓扑/目标 | 只记录 slot + redacted digest/class | 最小暴露 |
| env secret | 常见部署方式但违背单文档/安全链 | 不支持 raw/leaf env；只由 provider解析 ref | 避免普通配置成为 secret store |
| 具体 KMS/Vault | 可落地但无技术 authority/port | 不选产品；定义 resolver行为上限 | 不伪造实现 |
| zero-downtime rotation | 需要 hot/reload lifecycle | P0 restart/new assembly | 与 Step 4 一致 |
| provider access audit | Runner 自建正式审计 | 只保留 safe local config marker；正式审计由 owner | 保持 Observability/security truth边界 |

## 3. 敏感级别与读取边界

| 级别 | Runner 含义 | 示例 | 处理要求 |
|---|---|---|---|
| `public` | 无安全/运行拓扑含义的 schema label | `runner-config/v1` | 可在文档/log 中出现 |
| `internal` | 本地控制面语义 | profile、slot、positive finite limit、feature false/true | 可入 JSON；日志只按需要输出，不能升级 truth |
| `sensitive` | 暴露可能泄露拓扑、provider、target、store或policy身份 | 所有 `*Ref`（除纯 schema/profile）、binding/store/cache/policy/fixture/target ref | JSON 只保存 opaque ref；普通输出不得明文；解析最小化 |
| `secret` | 真实认证/加密/连接材料 | token、password、private key、cert body、credential URL、raw DSN | 永不进入 JSON、domain/store/log/error/trace/report/handoff |
| `forbidden_body` | 相邻 owner/运行/诊断正文 | manifest body、Release body、SDK response body、stdout/stderr、raw log | 不得借配置或 provider 进入 Runner truth |

### 3.1 敏感配置读取图

```text
[one strict JSON document]
      | opaque refs only
      v
[strict parser + secret-like/URL/path/body reject]
      |
      v
[validated ref snapshot + redacted config identity]
      |
      v
[controlled ref resolver / adapter factory]
      | runtime material stays inside provider/adapter
      v
[capability/readiness marker + safe issue ref]
      |
      v
[typed application port]

raw material --X--> config snapshot/domain/repository/log/error/report/trace
```

- Resolver/factory 是逻辑安全边界，不是已存在的 `SecretProviderPort` 或具体产品；若真实实现需要新增跨模块 callable contract，必须先回写 03。
- Application/domain/contracts 只收到 typed port/policy/marker，不持有 raw material。
- 配置 ref、resolved material、adapter readiness 分离；ref 存在不等 material 有效或能力 Ready。

## 4. 敏感配置表

| 配置项族 | 级别 | 存储/读取 | 可明文 | 轮换 | 安全记录要求 | 当前状态 |
|---|---|---|---:|---|---|---|
| `stores.*StoreRef`、`materialCacheRef` | sensitive | JSON opaque ref → store/cache capability resolver | ref可入文档；输出不可完整 | new ref + new assembly | section/slot + redacted digest + safe result | physical blocked `RUN-DDD-003` |
| `bindings.adapterBindings[].bindingRef` | sensitive | JSON ref → closed slot factory/registry | 同上 | new ref + new assembly | slot + digest + readiness class；不记录 endpoint/method | upstream blocked |
| `limits.jobs.retryPolicyRef` | sensitive/internal policy ref | JSON ref → typed policy resolver | ref仅文档可见 | new ref + new Job/assembly | policy family/digest/result；不输出内部规则正文 | authority pending |
| `observability.redactionBindingRef` / `redactionPolicyRef` | sensitive/security-critical | JSON ref → mandatory redaction adapter/policy | ref仅文档可见 | new ref + new assembly；不可降级旧 policy | 记录 policy digest、validation result、issue ref | upstream blocked |
| diagnostic/handoff/telemetry refs | sensitive | JSON optional ref → adapter factory | ref仅文档可见 | new ref + new assembly | slot + digest + safe availability；无 raw diagnostic | upstream blocked |
| clock/id/digest refs | sensitive/internal | JSON ref → deterministic/provider factory | ref仅文档可见 | new ref + new assembly | provider family/digest/result | physical authority pending |
| `fixtureSetRef` | sensitive/test-only | JSON ref → isolated fixture registry | ref仅 test document可见 | new test document | fixture family/digest；禁止 fixture正文/secret | planned test only |
| presentation/archive refs | sensitive | JSON optional ref → capability/adapter registry | ref仅文档可见 | new ref + new assembly | slot + digest + safe status | peripheral blocked |
| raw provider material | secret | adapter/provider 内存最小生命周期；当前未选实现 | 否 | provider-owned | 只记 provider ref digest/result；不记 material | forbidden in config |
| owner/diagnostic/runtime正文 | forbidden_body | 不由配置解析 | 否 | N/A | 只允许 safe typed refs/summary | forbidden |

## 5. Profile、读取、轮换与变更边界

| profile | 允许敏感表示 | 禁止 | resolver 不可用 | 轮换方式 |
|---|---|---|---|---|
| local-safe | blocked/disabled local opaque refs | raw secret、真实 credential、success fake | builder/slot blocked | new document/new assembly |
| test-deterministic | explicit fake/fixture refs | product secret、credential、raw fixture body | test fail-fast | new test document/fixture identity |
| integration-pending | controlled/formal opaque refs | leaf raw env、private SDK/backend、test fallback | per-slot blocked/unsupported；core missing可阻断 assembly | new ref + new assembly |
| product-pending | approved provider refs only | all fake/test refs、raw material、old ref fallback | fail-fast/affected operation blocked | provider rotation + validated new assembly；无 hot patch |

| 生命周期点 | 行为 | 禁止 |
|---|---|---|
| source load | 读取 bytes，严格 parse；问题只产生 redacted issue | dump whole document/value/path |
| ref validate | 校验 non-empty、family、slot、profile、forbidden lexical class | 解析 URL/path/credential 当合法 opaque ref |
| resolve/factory | material 只在 adapter/provider 最小范围；生成 safe marker | material 注入 domain/application DTO/store |
| runtime use | typed port 调用；每次按既有 readiness/authority gate | 以 ref 存在绕过 capability probe |
| rotation | 新 source/config identity/new assembly；已开始 Job 保留旧 snapshot | 原地改变已暴露 marker/truth，自动 replay |
| rollback | 选择前一份仍获批准且重新验证的 document/ref；新 assembly | 使用旧 raw material/LKG 绕过验证 |

## 6. 禁止输出规则

| 输出面 | 允许 | 永久禁止 | 失败处理 |
|---|---|---|---|
| parser/validator issue | source/config ref、section、safe key class、issue kind | whole JSON、raw value、path/URL/secret | reject；不回显 |
| structured log | operation、profile、slot、safe outcome、redacted digest/issue ref | full sensitive ref、material、endpoint/topic/path/stack/body | log redaction失败则舍弃敏感字段/事件并保留安全计数 |
| public/internal error | typed code、safe issue ref、retry disposition | config value、SDK/provider/OS raw error、credential | map to safe blocked/invalid/unavailable |
| metric | low-cardinality profile/slot/outcome/error class | IDs、full refs、endpoint、free text、body digest | drop unsafe label；业务结果不变 |
| trace/local history | safe operation/ref/state/source version | secret、config body、adapter response、raw log | safe span only；local trace非 formal audit |
| stored result/Job report | public safe surface、bounded issue/marker refs/counts | target credential、provider material、full config/ref、payload | produce safe blocked/failed/unknown surface |
| handoff | already-redacted safe material refs + target ref carrier per 03 | secret/raw log/package/config | redaction/validation失败则不提交 |
| UI/CLI/page | safe status、next step、redacted issue ref | raw validation value、endpoint/path/secret/stack | restricted/blocked presentation |

## 7. 逐项停审与跨敏感配置审计

| 配置族 | 存储方式 | 明文禁止 | 轮换 | 审计/输出 | 结论 |
|---|---|---|---|---|---|
| stores/cache | opaque ref | yes | new assembly | digest/slot only | pass with physical blocker |
| external/platform binding | opaque ref | yes | new assembly | slot/readiness only | pass with upstream blocker |
| retry/redaction policy | opaque policy ref | yes | new Job/assembly | policy digest/result | pass pending authority |
| diagnostics/handoff/telemetry/archive | optional opaque ref | yes | new assembly | safe marker only | pass with blockers |
| deterministic/fixture | typed ref | yes | new test assembly | family/digest only | pass, test-only |
| raw material/body | no config storage | absolute | provider-owned/N/A | never output | pass |

| 审计项 | 结论 | 修正/说明 |
|---|---|---|
| 文档/demo 是否含 raw secret | no | 示例只有 opaque refs |
| ordinary JSON 是否允许 secret-like key/value | no | strict schema/lexical guard reject |
| full sensitive ref 是否进入普通输出 | no | digest/class/slot only |
| material 是否进入 application/domain/store | no | typed port only |
| provider unavailable 是否 fake/LKG fallback | no | fail-closed |
| fixture 是否进入 non-test | no | profile reject |
| rotation 是否热改已暴露 truth | no | new assembly |
| Runner local record 是否冒充 formal secret audit/evidence | no | 明确 local-only |
| 是否需要当前 03 回写 | no | 仅展开既有 adapter/config/redaction boundary；具体 provider callable 未来可能触发回写 |

## 8. 03 影响、回填与门禁

| 结论 | 是否影响 03 | 影响类型 | 03 回写位置 | 状态 |
|---|---|---|---|---|
| ordinary config只保存opaque sensitive refs | 否 | 安全配置语义 | N/A | 无回写 |
| resolved material不出adapter/provider最小边界 | 否 | 承接既有 port/redaction boundary | N/A | 无回写 |
| P0 rotation通过new assembly | 否 | 承接no reload | N/A | 无回写 |
| 若真实secret resolver需要新增port/constructor/error/hot rotation | 是 | code contract/lifecycle | 03 Step 6/7/9/12/14/15 | 未来触发时重开；本轮不声明实现 |

未来正式 §8 应回填敏感级别、读取边界图、敏感配置表、profile/rotation 表和禁止输出表；正文不能出现真实或看似可用的 secret placeholder。

| 待确认事项 | 当前处理 |
|---|---|
| exact provider/product/API、memory zeroization、OS key store | `RUN-DDD-002/UP-008`；不伪造 |
| provider access/rotation formal audit owner | security/Observability authority pending；Runner只留 local safe marker |
| opaque ref exact grammar与digest algorithm | implementation/SDK authority pending；禁止从 ref 解析拓扑 |

| 进入 Step 9 条件 | 结论 |
|---|---|
| sensitive/secret/body 分类和逐项回指完整 | pass |
| 存储、明文、读取、轮换、审计、输出规则可判定 | pass with explicit provider blockers |
| 跨配置泄露审计无 unresolved 内部冲突 | pass |
| 无当前 `待回写`/`阻塞待确认` 的 03 影响 | pass |

Step 8 完成，允许进入 Step 9；正式 04 仍不可写。
