# Step 5. 定义配置来源、优先级与冲突处理

> 对应 SOP：`standards/document/配置设计讨论流程_SOP.md` Step 5
> 正式回填：`04-配置设计.md` §5
> 状态：`completed / pass_with_upstream_blockers / stop_review`（连续授权下进入 Step 6）

## 1. Step 状态与输入

| 项 | 结论 |
|---|---|
| 当前 Step | Step 5：来源、优先级与冲突处理 |
| 输入 | Step 3 来源链、Step 4 分类边界、03 Step 14 typed refs/slots、secret/redaction 红线 |
| 输出 | 来源优先级、冲突矩阵、按域来源表、停审与跨来源审计 |
| 当前优先级 | 普通字段：`code declaration < strict JSON file < allow-listed environment` |
| 下一动作 | 更新 flow/台账，进入 Step 6 |

## 2. SOP 问题回答

| 问题 | 回答 |
|---|---|
| code default、file、env、secret、config center、admin override 的优先级是什么？ | 普通配置只允许 code declaration、一个 strict JSON 文件、allow-listed ENV；优先级由低到高为 `DECL < JSON < ENV`。secret resolver 只是 winner locator 的私有解析，不参与普通值覆盖。config center、admin override、CLI arbitrary override 和 remote source 当前不接受。 |
| 同名配置多处出现如何处理？ | 逐字段收集已授权 occurrence，选择最高优先级且唯一的 winner；同一来源重复键、别名、未知键、类型不一致或同优先级冲突使整个 candidate 失败。高优先级 winner 非法时拒绝，不回退到低优先级值。 |
| 必填项缺失是否阻断启动？ | required profile/config/store/context、required exposed slot、security/redaction、预算和 codec binding 缺失时 startup/new assembly fail-fast；conditional slot 只有在 exposed surface/selected target 正式要求时才 required。 |
| 配置文件或 provider 不可用怎么办？ | JSON 文件不可读、解析失败、secret locator 无法解析、required store/provider binding 不可用都返回安全 typed config/build error，禁止默认为空、切换未声明 provider 或启用 fake。仅正式 optional slot 可被显式 `DisabledByConfig`。 |
| 哪些来源不能覆盖敏感配置？ | 普通 JSON/ENV 不得携带 raw password/private key/token/DSN；只能提供 opaque reference。解析后的 secret material 不回写 root、不进入日志/错误/report/audit，也不被低优先级普通来源替换。 |

## 3. 来源优先级表

| 来源 | 优先级 | 适用配置 | 冲突处理 | 不可用策略 |
|---|---:|---|---|---|
| 显式 code declaration | R0 | schema metadata、required/source metadata、经确认的安全声明默认 | 同一声明重复属于设计错误；无 default 的 required 保持 missing | 不补 zero/empty/null |
| 一个 strict JSON 配置文件 | R1 | ordinary scalar、typed object、set、finite mapping、opaque ref | duplicate/unknown/alias/JSONC/多文件合并均拒绝；字段 winner 覆盖 R0 | selected file 不可读或非法→fail-fast |
| allow-listed environment leaf | R2 | 仅在字段 registry 明确允许的 scalar/opaque ref | 覆盖 R1/R0；空字符串按 present 解析，非法 winner 不 fallback | 未出现表示无 override；未知 namespace key→fail-fast |
| secret resolver result | 不参与覆盖 | winner locator 对应的 private material/handle | 不改变 field winner、mode、target、capability 或 authority | required resolution failure→Blocked/Unavailable |
| test fixture / fake override | test-only lane | deterministic test assembly 的显式 input | 只能在 test profile 注入；不得覆盖 production candidate | 被 production profile 发现→fail-fast |
| derived assembly / old-work snapshot | 不参与 merge | config identity、slot set、job fixed budget、old binding | 只由已验证 winner 派生；旧 work 读取 pinned identity | 缺失/不一致→Blocked；不读 current config 猜补 |
| config center / admin override / arbitrary CLI | 当前不允许 | 无 | 任何出现均为 unsupported source | fail-fast；未来需回写 03/安全审计 |

当前不引入完整 CLI、remote config center、online last-known-good 或 operator emergency override 作为配置来源。部署系统如何注入已选文件/ENV 属运维资料，不在本章定义命令或路径。

## 4. 冲突场景矩阵

| 冲突/异常场景 | 处理规则 | 是否阻断启动/操作 |
|---|---|---|
| JSON 同一对象重复键 | strict parser 拒绝 whole candidate | 阻断启动 |
| 未知 key、camelCase/历史 alias | 不做兼容别名；拒绝 whole candidate | 阻断启动 |
| 同字段 JSON 与 ENV 均出现 | ENV winner；按 ENV 做完整类型/范围/交叉校验 | 非法则阻断，不回退 JSON |
| 同级声明/来源给出不同值 | 设计 registry 冲突，拒绝 candidate | 阻断启动 |
| required 字段仅有空字符串/null | 视为 present 后校验失败；不得当缺席而取默认 | 阻断启动/相关 assembly |
| source/owner/consumer mapping 缺项或多项 | exact slot totality 校验失败；不选“第一个” | 阻断暴露/操作 |
| secret locator 与普通 raw secret 同时出现 | raw secret 违反安全 schema，whole candidate 拒绝 | 阻断启动 |
| JSON 与 ENV profile 不一致 | profile conflict，拒绝 whole candidate | 阻断启动 |
| test fixture 出现在 production-like profile | profile isolation violation | 阻断启动 |
| required provider/secret/store 不可达 | typed unavailable/blocked；不切换 fake/默认 provider | 阻断受影响 assembly/operation |
| optional slot 明确关闭 | 仅当 validated registry 标为 optional 时 `DisabledByConfig` | 不阻断无关 surface；required 仍阻断 |
| old work 使用新配置重建 | 禁止；使用 stored binding/config identity | 阻断该恢复/重放 |

## 5. 按配置域来源覆盖表

| 配置域 | 允许来源 | 禁止来源 | 优先级 | 不可用策略 |
|---|---|---|---|---|
| `profile`/`assembly` | DECL、JSON、有限 ENV scalar | config center、admin、payload | R0<R1<R2 | invalid/missing→fail-fast |
| `stores` | DECL metadata、JSON opaque binding、必要 ENV ref | raw DSN/password、payload、test override in prod | R0<R1<R2 | missing/resolve fail→assembly blocked |
| `sources` | JSON exact per-source refs；有限 ENV ref（若 registry允许） | workspace fallback、dynamic payload mapping | R0<R1<R2 | exact source missing→target blocked |
| `authority_visibility` | JSON typed policy/adapter refs | local allow boolean、cache result、event payload | R0<R1<R2 | unknown/expired→blocked/not available |
| `integrity_compatibility` | JSON capability/target refs | algorithm/key literal、Bundle digest reuse | R0<R1<R2 | unsupported/unknown→assessment blocked |
| `storage_lifecycle` | JSON storage/decision/schedule refs | self-authored retention/hold/delete | R0<R1<R2 | missing decision/storage→blocked |
| `restore_receivers` | JSON per-owner refs、opaque credential refs | all-owner fallback、endpoint raw | R0<R1<R2 | owner target blocked/unknown |
| `inbound` | JSON exact family/schema/trust refs | topic string inferred from payload, unknown family | R0<R1<R2 | no contract→quarantine/no ACK success |
| `operation_cursor` | JSON typed codec/mapping refs、opaque key ref | debug/JSON ad hoc, Bundle digest | R0<R1<R2 | mutation/continuation blocked |
| `budgets` | DECL confirmed safe bound、JSON/ENV scalar if authorized | zero implicit, job payload override | R0<R1<R2 | absent/invalid→fail-fast/new job blocked |
| `observability` | JSON redaction/safe binding refs | raw sink endpoint/secret/body dump | R0<R1<R2 | safe telemetry may degrade; mandatory native record failure blocks UoW |

## 6. 来源优先级停审

| 配置域/来源 | 唯一优先级 | 非法高优先级行为 | secret/安全边界 | 结论 |
|---|---|---|---|---|
| profile/assembly | 是 | reject，不 fallback | 无 raw secret | 通过 |
| stores/external refs | 是 | reject/blocked | opaque ref only | 通过 |
| source/receiver mappings | 是 | exact target blocked | 不用 workspace/first-match | 通过 |
| codec/budgets | 是 | operation/continuation blocked | 不借 Bundle digest | 通过 |
| observability/redaction | 是 | safe degraded 或 UoW blocked | denylist 保持 | 通过 |

## 7. 跨来源冲突审计

| 审计项 | 结论 | 缺口/修正 |
|---|---|---|
| 覆盖顺序是否唯一 | 通过 | `DECL < JSON < ENV`；secret result/derived 不参与覆盖 |
| 非法高优先级是否静默回退 | 否 | whole candidate fail-fast |
| 同级重复/未知 key 是否可判定 | 通过 | strict parser/registry reject |
| raw secret 是否可由普通来源覆盖 | 不允许 | 仅 opaque ref，private resolution |
| test override 是否能进入 production | 不允许 | profile isolation/fail-fast |
| optional/required 是否被来源改变 | 不允许 | required set 来 frozen registry，不由 file/env 改写 |
| 旧 work 是否受 current config 漂移 | 不允许 | pinned config/binding identity |
| 是否引入 remote/admin source | 否 | unsupported；未来需回写 03 |

## 8. 对 `03-详细设计.md` 的影响判定

| 配置结论 | 是否影响 03 | 影响类型 | 03 回写位置 | 处理状态 |
|---|---|---|---|---|
| 普通配置优先级为 `DECL < JSON < ENV` | 否 | 来源语义 | 不适用 | 无回写 |
| secret resolver 不参与普通覆盖且只解析 opaque ref | 否 | 安全加载边界 | 不适用 | 无回写 |
| 非法高优先级值拒绝 whole candidate，不回退 | 否 | fail-fast 语义 | 不适用 | 无回写 |
| test fixture 仅 test assembly；remote/admin/hot source unsupported | 否 | profile/source boundary | 不适用 | 无回写 |
| future 若新增 source、admin actor、config center、builder reload 或新错误/DTO | 是（未来触发） | config/builder/audit/port/error contract | 03 §4/§7/§11～§15 | 无回写（未来触发前暂停并回写） |

## 9. 回填草稿与下一步门禁

正式 §5 应回填来源表、冲突矩阵、逐域来源规则和“不回退非法高优先级值”的硬规则；不写实际路径、ENV 名称、raw secret、CLI 或 provider 产品。

| 进入 Step 6 条件 | 状态 |
|---|---|
| 来源覆盖顺序唯一 | 通过 |
| 冲突与不可用策略可判定 | 通过 |
| sensitive source 不被普通值覆盖 | 通过 |
| 每个配置域已完成来源停审 | 通过 |
| 跨来源审计无 unresolved 冲突 | 通过 |
| 03 影响判定已记录 | 通过；future source 变化仍需回写 |
