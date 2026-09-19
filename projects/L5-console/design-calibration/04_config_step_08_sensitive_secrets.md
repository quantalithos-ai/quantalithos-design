# Step 8. 定义敏感配置与密钥管理

> 对应 SOP：`standards/document/配置设计讨论流程_SOP.md` Step 8
> 回填章节：`04-配置设计.md` §8
> 粒度参考：`projects/L1-governance/design-calibration/04_config_step_08_sensitive_secrets.md`
> 状态：`done / pass / self_reviewed`

## 1. 目标与输入

本 Step 单独审计四项 P0 配置及未来候选，确保浏览器配置、客户端 state、diagnostic、错误和示例不承载 secret。当前结论是“P0 无敏感配置项”；这不是放宽规则，而是明确所有 secret/credential 类输入在本配置边界之外。

| 输入 | 用途 |
|---|---|
| Step 7 配置项表 | 判断每项敏感级别和可能的泄露面 |
| 03 Step 6/7/12/14/15 | safe ref、forbidden-body、typed error、bindingRef、diagnostic whitelist |
| `01`/`02`/`03` 安全红线 | 禁止 raw body、credential、token、URL、DOM、Error/stack |
| Step 6 profile矩阵 | 验证所有环境均零 raw secret |

## 2. SOP 问题回答、诊断与取舍

| 问题 | 收口回答 |
|---|---|
| 哪些配置是 sensitive/secret？ | 当前四项均为 `internal`；`bindingRef` 是 local opaque correlation，不是 secret/ref provider。未来 endpoint、token、password、private key、cookie、credential、DSN、secret ref均视为 sensitive/secret候选，但不进入本 P0 schema。 |
| 如何存储？ | P0 不存储、不读取、不解析 secret。host/SDK正式认证边界自行处理；Console config loader遇到 secret-like key/value 直接拒绝。 |
| 如何轮换？ | 不适用当前 P0；未来 secret provider/credential binding若引入，必须先回写03 runtime builder/adapter constructor，再重开04/05/09。 |
| 如何审计？ | Console不拥有正式 secret audit；只允许记录安全 issue kind/section/ref，不记录 raw value。轮换/访问审计留host/正式安全 owner。 |
| 如何避免日志/错误泄露？ | parser、validator、adapter、diagnostic、state carrier、host a11y均只输出安全枚举/issue ref；拒绝对象不回显原值；禁止把整份 config、URL、body、stack送入诊断。 |

## 3. 敏感级别归一规则

| 级别 | 本项目含义 | 当前示例 | 处理要求 |
|---|---|---|---|
| `public` | 可公开常量或模块名 | 无 P0配置项 | 若未来出现仍需 schema审查 |
| `internal` | 客户端装配语义，不应作为外部业务数据 | `runtime.profile`、slot、boolean switch、local bindingRef（opaque） | 可进入严格 JSON；不进业务诊断/owner请求 |
| `sensitive` | 暴露会泄露运行/安全上下文 | future endpoint ref、trace/host integration ref、credential ref | 不进入普通 browser config；只允许受控 ref且需03/04回写 |
| `secret` | 真实秘密材料 | raw token/password/private key/cookie/DSN | 永远不进入 Console config/state/log/error/diagnostic；由正式安全边界处理 |

## 4. 敏感配置读取边界图

#### 敏感配置读取图: L5-console 配置与安全边界

```text
[host/SDK authentication boundary]
          |  (opaque authenticated session; raw material not exposed)
          v
[ConsoleRuntimeDependencies / formal adapters]
          ^
          |
[Console strict JSON config]
  profile / slots / local ref / booleans only
          |
          v
[validator + redaction gate]
          |
  secret-like key/value -> reject, no echo
```

关键说明：

- 图表达“Console 配置不读取 secret”的边界，不表达具体 KMS/Vault、cookie、CSP、网络或部署命令。
- `bindingRef` 不可作为 endpoint、credential、URL 或 secret ref 的别名；它只关联本地 configuration correlation。
- 认证凭据即使由 SDK/host 使用，也不能进入 `ClientStateRecord`、`DiagnosticContext`、错误或页面状态。

## 5. 敏感配置表

| 配置项/材料 | 敏感级别 | 存储方式 | 是否可明文 | 轮换方式 | 审计要求 | 当前状态 |
|---|---|---|---|---|---|---|
| `runtime.profile` | internal | strict JSON | 可在配置 artifact中 | 无 | 仅配置变更审计，不作为业务诊断 | active |
| `bindings.adapterBindings[].slot/profile` | internal | strict JSON | 可 | 无 | 记录结构化变更，不记录依赖正文 | active |
| `bindings.adapterBindings[].bindingRef` | internal/opaque | strict JSON中的非空opaque值 | 不视为secret；仍不得展开/解析 | 无 | 可记录 redacted digest/ref classification | active |
| `enableSdkInvalidation` | internal | strict JSON | 可 | 无 | 记录 enabled/disabled 变更 | active |
| `enableDiagnostics` | internal | strict JSON | 可 | 无 | 记录 enabled/disabled 变更；sink内容另受诊断规则 | active |
| endpoint/URL/raw SDK config | sensitive/forbidden | 不得进入Console config | 否 | 由host/SDK边界决定 | Console只记录安全拒绝类别 | rejected/future design |
| token/password/private key/cookie/DSN/raw credential | secret | 不得进入Console任一材料 | 否 | 正式安全owner/provider | 外部安全审计；Console不接触 | rejected |
| owner body/response/event/command payload | forbidden body | 不得进入 config/state/diagnostic | 否 | 不适用 | safe-field/redaction审计 | rejected |

## 6. Profile敏感配置处理

| profile | raw secret | sensitive ref | diagnostic output | 错误输出 |
|---|---|---|---|---|
| `local-fake` | reject | 不配置；fake只使用安全fixture ref | body-free，可disabled | safe enum/issue ref |
| `integration-pending` | reject | 由test host/SDK外部处理，不进入document | 当前disabled | safe enum/issue ref |
| `production-pending` | reject | 需未来正式03/04合同；当前不接受 | 当前disabled | safe enum/issue ref |

## 7. 禁止输出与泄露风险审计

| 输出面 | 必须允许 | 必须拒绝 | 失败处理 |
|---|---|---|---|
| parser/validator issue | section、safe key class、issue kind、profile、local diagnosticRef | raw JSON、raw value、path/URL、secret/body | reject whole document；不回显 |
| ConsolePortError | kind/source/operationRef/reasonRef/retryDisposition | HTTP body/status、SDK exception、credential、stack | existing typed error；安全 message key |
| DiagnosticContext | typed phase/outcome/ref/redaction marker | config、bindingRef raw value、body、secret、DOM、URL | factory/gate failed；不发sink |
| ClientStateRecord | approved local interaction fields | config、adapter、SDK、secret、raw response | whole-record reject |
| host focus/announce | approved action/status key | error text、user input、owner rationale、secret | equivalent fallback |
| audit/change record | redacted config digest、safe diff class、actor/ref if external | full document/raw secret/body | external audit boundary；Console不拥有正式审计 |

## 8. 读取、轮换与审计承接

| 能力 | 当前 P0 | 未来触发条件 | 必须先回写 |
|---|---|---|---|
| secret provider/KMS/Vault | 不调用 | host/SDK要求 Console解析受控 ref | 03 runtime builder/adapter constructor/error；04来源/加载/失败 |
| credential rotation | 不实现 | production host定义轮换生命周期 | 03 dependency lifecycle；04 Step 10/11/13 |
| endpoint ref | 不接受 | formal owner/host要求 endpoint binding | 03 Port/adapter config；04 Step 5/7/9 |
| browser auth cookie/token | 不接触 | host平台明确注入方式 | 架构/安全/host设计，非普通配置项 |
| audit of secret access | Console不拥有 | formal security/audit owner提供边界 | 05/06/09承接外部证据 |

## 9. 对详细设计的影响判定

| 配置结论 | 是否影响03 | 影响类型 | 03回写位置 | 状态 |
|---|---|---|---|---|
| 当前四项均为internal，P0无secret | 否 | 敏感级别细化 | N/A | 无回写 |
| secret-like key/value在loader边界拒绝 | 否 | existing forbidden-body/redaction执行化 | N/A | 无回写 |
| host/SDK认证材料不进入Console config/state | 否 | 承接既有依赖边界 | N/A | 无回写 |
| future secret provider/endpoint/credential ref | 是 | builder/adapter/error/lifecycle contract | 03 Step 3/7/14/15 | 当前排除，触发时回写 |

## 10. 回填、待确认与门禁

正式 §8 应明确“当前没有可配置 secret”，并列出 future secret/endpoint 的拒绝和回写触发器；不得在 demo 或参考中出现 placeholder raw secret。

| 跨敏感配置审计 | 结论 |
|---|---|
| raw secret是否进入正文/demo | no |
| 普通配置是否暗含secret provider | no |
| bindingRef是否被当secret/endpoint解析 | no |
| 错误/诊断/state是否可能回显 | no；安全枚举/whole-record gate |
| 轮换/访问审计是否被伪造 | no；外部owner待定 |
| 当前是否有03待回写 | no |

| 进入 Step 9 条件 | 结论 |
|---|---|
| 敏感级别、存储、明文、轮换、审计边界完整 | pass |
| 禁止输出规则可执行 | pass |
| 跨敏感配置泄露审计无 unresolved | pass |

Step 8 `done / pass / self_reviewed`；允许串行进入 Step 9。
