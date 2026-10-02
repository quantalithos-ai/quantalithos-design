# 04 Step 7：定义配置项清单与 JSON demo

## 1. Step状态

2026-10-02；`completed / selfcheck_done / stop_review`。本步完成六个配置域的小循环和跨域审计；配置项只映射03既有七个RuntimeConfig字段，Web build-time项单独标注。

07 Step13定向回修：本表与上述SOP回答本身正确，正式04 §7.1末句错误把前七个JSON叶子当七字段。先登记此来源，再将正式句改为显式七字段：owner.bindings的两个entry叶子整体映射owner_bindings；web.default_locale映射default_locale。首轮静态还发现locale枚举的表格竖线需转义，只修Markdown表示。当前回修static-check=pass（design-only），已由07实际文档检查核验；不改schema、demo值或运行结果，完成记录进入07静态审查。

## 2. 本步目标

**目标**：为每个允许配置项固定名称、类型、必填性、来源、作用域、敏感级别、生效方式和失败策略，使05/06可以直接建立配置边界用例。

### 本步输入

Step3控制面、Step4分类、Step5来源优先级、Step6 profile矩阵、03§13七字段/八slot。

### 本步输出

按域清单、模块级JSON demo、完整JSONC说明demo、配置域停审记录和跨项审计，回填正式04§7。

## 3. 应问的问题与SOP回答

1. **配置文件是否增加业务字段？** 不增加。`schema_version`、`profile`只属于loader envelope metadata；服务RuntimeConfig仍只有`api_bind`、`postgres_config_ref`、`sdk_profile_ref`、`owner_bindings`、`worker_batch_limit`、`lease_millis`、`default_locale`七字段。
2. **六个域如何对应？** `api.bind`→`api_bind`；`storage.postgres_config_ref`→`postgres_config_ref`；`sdk.profile_ref`→`sdk_profile_ref`；`owner.bindings`→`owner_bindings`；`worker.batch_limit`/`lease_millis`→两个worker字段；`web.default_locale`→`default_locale`。`web.api_base`是build-time，不进入RuntimeConfig。
3. **默认值是什么？** 只有`web.default_locale`安全默认`En`；其他服务项显式必填或由缺失slot产生明确Blocked，不写生产数值默认。
4. **八个slot如何表达？** 每个entry只有`kind`和typed `configuration_ref`；不允许文件写`disposition=Bound`、approval、visibility、installed或paid。
5. **模块是否泛化？** 只使用`api`、`storage`、`sdk`、`owner`、`worker`、`web`，拒绝`common`、`runtime`、`misc`等混合域。

### 当前材料问题诊断与取舍

旧draft没有可校验的配置项表，容易把UI标签、owner正文、扫描结果和业务开关混入配置。采用六个功能域、七个03字段、一个Web build-time项；使用严格JSON/JSONC说明demo，不提供生产数值默认，不让文件声明adapter disposition。

### 改动前后对比

| 之前 | 本步后 |
|---|---|
| 技术栈描述代替配置清单 | 每项有类型、必填、来源、敏感、生效和失败策略 |
| `runtime/common`式泛化域 | 六域按运行职责拆分 |
| owner状态可能被配置伪造 | 只保存kind/ref，资格由validator计算 |

## 4. 配置项总清单

| 配置项 | 类型 | 默认值 | 必填 | 来源 / 作用域 | 生效 | 敏感级别 | 失败策略 | 关联模块 |
|---|---|---|---:|---|---|---|---|---|
| `api.bind` | SocketAddr字符串 | 无 | 是 | JSON/profile | startup | internal | 解析失败拒API启动 | api |
| `storage.postgres_config_ref` | 非空opaque ref | 无 | 是 | JSON/profile + secret provider | startup | sensitive | 无法解析/连接拒存储装配 | storage/infra |
| `sdk.profile_ref` | typed profile ref | 无 | 是 | JSON/profile + provider | startup | sensitive | 缺失或不兼容不装positive | sdk/infra |
| `owner.bindings[].kind` | 八kind枚举 | 无 | 条件 | JSON/profile | startup | internal | unknown/duplicate拒绝；缺slot形成Blocked | owner |
| `owner.bindings[].configuration_ref` | typed ref字符串 | 无 | 条件 | JSON/profile + provider | startup | sensitive | ref错拒当前slot；不自称Bound | owner/infra |
| `worker.batch_limit` | u32，>0且profile上限内 | 无 | 是（Worker） | JSON/profile | startup | internal | 缺失/0/超限拒Worker启动 | worker |
| `worker.lease_millis` | u64，>0且checked-add安全 | 无 | 是（Worker） | JSON/profile | startup | internal | 缺失/0/溢出拒Worker启动 | worker |
| `web.api_base` | build-time受控origin URL | 无 | 是（Web） | `VITE_MARKETPLACE_API_BASE` | build-time | internal | 非allowlist/含凭证则构建失败 | web |
| `web.default_locale` | `En`或`Zh` | `En` | 否 | JSON或安全静态默认 | startup/display | public | 非法值拒绝；缺失回退En | web |

`owner.bindings`要求kind集合只能来自`Source`、`Publisher`、`Material`、`Governance`、`Scope`、`Receiver`、`Notice`、`Observation`。validator根据正式consumer contract、SDK exact mapping、current authority和provider结果计算`Bound/Blocked/Disabled`；配置文件不能提供该结果。没有`Billing`、`Archive`、`Bus` slot。

## 5. 模块级 JSON demos

以下示例用于说明结构；`<required ...>`是不可直接运行的占位符，不能视为生产值。

### `api`配置demo

```json
{"api":{"bind":"<required SocketAddr>"}}
```

| 配置项 | 类型 | 示例值 | 作用 | 约束 / 校验 | 失败策略 |
|---|---|---|---|---|---|
| `api.bind` | SocketAddr | `"<required SocketAddr>"` | API listener绑定 | 可解析；不继承原型`0.0.0.0:9090` | startup fail-fast |

### `storage`配置demo

```json
{"storage":{"postgres_config_ref":"<required opaque ref>"}}
```

| 配置项 | 类型 | 示例值 | 作用 | 约束 / 校验 | 失败策略 |
|---|---|---|---|---|---|
| `storage.postgres_config_ref` | opaque ref | `"<required opaque ref>"` | 取得正式PG连接/预算能力 | 非空；不允许raw DSN | storage assembly拒绝 |

### `sdk`配置demo

```json
{"sdk":{"profile_ref":"<required typed profile ref>"}}
```

| 配置项 | 类型 | 示例值 | 作用 | 约束 / 校验 | 失败策略 |
|---|---|---|---|---|---|
| `sdk.profile_ref` | typed ref | `"<required typed profile ref>"` | 选择正式SDK operation/schema映射 | generic client不等exact qualification | positive adapter Blocked |

### `owner`配置demo

```json
{"owner":{"bindings":[
  {"kind":"Source","configuration_ref":"<ref>"},
  {"kind":"Publisher","configuration_ref":"<ref>"},
  {"kind":"Material","configuration_ref":"<ref>"},
  {"kind":"Governance","configuration_ref":"<ref>"},
  {"kind":"Scope","configuration_ref":"<ref>"},
  {"kind":"Receiver","configuration_ref":"<ref>"},
  {"kind":"Notice","configuration_ref":"<ref>"},
  {"kind":"Observation","configuration_ref":"<ref>"}
]}
```

| 配置项 | 类型 | 示例值 | 作用 | 约束 / 校验 | 失败策略 |
|---|---|---|---|---|---|
| `owner.bindings[].kind` | enum | `"Source"`等八值 | 选择adapter slot | 不得重复/未知；不含Billing/Archive | schema fail-fast |
| `owner.bindings[].configuration_ref` | typed ref | `"<ref>"` | 提供绑定输入 | 不得携带approval、正文或disposition | 当前slot Blocked |

### `worker`配置demo

```json
{"worker":{"batch_limit":"<required positive u32>","lease_millis":"<required positive u64>"}}
```

| 配置项 | 类型 | 示例值 | 作用 | 约束 / 校验 | 失败策略 |
|---|---|---|---|---|---|
| `worker.batch_limit` | u32 | `"<required positive u32>"` | 有界维护窗口 | >0且不超过获准profile上限 | Worker拒启动 |
| `worker.lease_millis` | u64 | `"<required positive u64>"` | claim lease预算 | >0且checked time add不溢出 | Worker拒启动 |

### `web`配置demo

```json
{"web":{"default_locale":"En"}}
```

| 配置项 | 类型 | 示例值 | 作用 | 约束 / 校验 | 失败策略 |
|---|---|---|---|---|---|
| `web.default_locale` | `En\|Zh` | `"En"` | 展示默认语言 | 不改变ref、key、fingerprint或业务状态 | 非法拒绝；缺失En |
| `VITE_MARKETPLACE_API_BASE` | allowlisted URL | `"<required build-time origin>"` | Web公共API地址 | 不含凭证/owner端点 | 构建失败 |

## 6. 完整配置说明demo（JSONC）

```jsonc
{
  // 仅loader metadata；不会进入RuntimeConfig。
  "schema_version": 1,
  "profile": "<local|test|staging|production>",
  "api": {"bind": "<required SocketAddr>"},
  "storage": {"postgres_config_ref": "<required opaque ref>"},
  "sdk": {"profile_ref": "<required typed profile ref>"},
  "owner": {"bindings": [
    {"kind":"Source","configuration_ref":"<ref>"},
    {"kind":"Publisher","configuration_ref":"<ref>"},
    {"kind":"Material","configuration_ref":"<ref>"},
    {"kind":"Governance","configuration_ref":"<ref>"},
    {"kind":"Scope","configuration_ref":"<ref>"},
    {"kind":"Receiver","configuration_ref":"<ref>"},
    {"kind":"Notice","configuration_ref":"<ref>"},
    {"kind":"Observation","configuration_ref":"<ref>"}
  ]},
  "worker": {"batch_limit":"<required>","lease_millis":"<required>"},
  "web": {"default_locale":"En"}
}
```

实际运行文件必须是严格JSON（删除注释），并且占位符必须替换为经批准的值/ref；本demo不产生配置digest、运行证据或readiness。

## 7. 配置域停审与跨项审计

| 配置域 | 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|---|
| api | 类型、来源、startup、原型边界 | 通过 | 生产bind仍待平台值 |
| storage | ref而非DSN、关键失败 | 通过 | PG provider/预算待确认 |
| sdk | profile ref不等资格 | 通过 | exact operation mapping pending |
| owner | 八kind、缺slot、disposition计算 | 通过 | MP-UP/SRC资格仍blocked |
| worker | 正值、无默认、无retry/state开关 | 通过 | Q-MP-01上限待确认 |
| web | build-time API base、En默认 | 通过 | auth/TLS/CORS未形成新字段 |

| 跨项审计项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 重复键 / 泛化域 | 无重复；无`common/runtime/misc` | 解析器需拒未知键 |
| 必填项失败策略 | 全部有startup/build/Blocked策略 | 不得加静默default |
| sensitive与secret边界 | 只存ref，raw值由provider处理 | provider合同待Step14 |
| 七字段映射 | 一一对应，无第八业务字段 | `schema_version/profile`留在envelope |
| 禁止项 | 无approval/visibility/state/payment/installed开关 | 未知键拒绝 |

## 8. 详细设计影响判定

| 配置结论 | 是否影响03 | 影响类型 | 03回写位置 | 处理状态 |
|---|---|---|---|---|
| 六域键映射七字段，Web API base单列build-time | 否 | 配置命名/来源 | 03§13已有边界 | 无回写 |
| 八slot只接ref，disposition由validator计算 | 否 | 资格装配语义 | 03§13已有定义 | 无回写 |
| `schema_version`/`profile`不进入RuntimeConfig | 否 | envelope metadata | 03§13已有七字段约束 | 无回写 |

## 9. 回填草稿、待确认与进入下一步条件

正式§7回填清单、六个模块demo和完整JSONC说明；不把占位符、原型端口或profile姿态写成可部署值。待确认：正式profile数值、provider/endpoint schema、owner exact mapping和Q-MP-01预算，进入Step14。

进入Step8条件：每个项都有类型、默认/必填、来源、作用域、生效、敏感级别、失败策略和关联模块；跨域审计没有未处理冲突。
