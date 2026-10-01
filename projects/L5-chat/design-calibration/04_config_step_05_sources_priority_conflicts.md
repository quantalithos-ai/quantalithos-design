# L5-chat 04 · Step 5 定义配置来源、优先级与冲突处理

## 1. Step状态与开工确认

> done；gate_status：pass_with_upstream_blockers；2026-10-01。本Step已完成本地设计审查，外部blocked，实施not_started。

| 小阶段 | 输出 | 状态 |
|---|---|---|
| A | SOP回答、具体诊断与取舍 | done |
| B | 八配置域逐个结构化/停审 | done |
| C | 03影响判定、回填、自检 | done |

复杂度判断：需按配置域串行分批，每域回答/诊断/取舍/结构/回填/自检，完成才进入下一域；不建额外附录。

## 2. 本步输入

当前00～03；已通过Step4及相关前序配置域结论；配置SOP Step5和书写规范§5.5；缺正式provider/SDK/host/预算能力继续登记而不补造。

## 3. SOP问题回答

1. 普通覆盖链仅安全缺省 < 单份批准JSON；env/CLI/config center/admin override一律不读取。
2. JSON重复键、重复profile或未知层级拒绝，而非last writer wins。
3. 除schemaVersion/memoryOnly/diagnosticMode外必填；缺项invalid_input阻止装配。
4～5. 无Chat secret/config center；SDK/host解析不可用保持dependency_unbound，不能普通字符串覆盖真实权威。
6～7. 八域允许来源相同，但sdk/platform实际资格独立；每域来源停审。
8. 不继承SDK自身env机制；无跨来源默认fake或部分配置生效。

## 4. 当前材料问题诊断

普通JSON解析通常丢弃重复键信息；03 strictparser必须显式规定parse阶段拒重复键。LocalConfigSource无文件路径/CLI参数签名，不能临时增加--config/env入口。

## 5. 改动前后对比

| 位置 | 改前 | 改后 | 依据 |
|---|---|---|---|
| 本Step输入 | 前序仅提供边界/引用，当前主题未闭口 | 独立收口本Step定义配置来源、优先级与冲突处理 | 当前03与04 SOP |
| 外部正向能力 | 未绑定 | 继续blocked，不由配置授予资格 | CHAT-UP/WS-UP/host |

## 6. 配置设计取舍

采用唯一注入source及strict duplicate rejection；不增加env/CLI覆盖。文件profile由composition批准选择，UI无法传路径或业务scope。

## 7. 结构化中间产物

### 7.1 来源优先级

| 来源 | 优先级 | 适用配置 | 冲突处理 | 不可用策略 |
|---|---|---|---|---|
| 安全code defaults | 低 | app.schemaVersion=1；local_state.memoryOnly=true；diagnostic.mode=disabled | 仅缺叶子时填，显式非法值不吞掉 | 安全缺省 |
| 单份批准JSON | 高 | 八域已列字段 | 类型/版本/重复/未知键/禁项全拒绝 | missing/invalid fail-fast |
| source profileId | 选择器，非覆盖 | 批准profile文件/资源身份 | 与platform及SDK/host profile不一致拒绝 | invalid_input |
| SDK/native authority | 独立资格，不参与覆盖 | 正式profile匹配/host批准策略 | JSON引用不授予资格 | 未bound则blocked |
| env/CLI/remote/admin override | 无 | 不读取、不提供入口 | 若塞入JSON为未知键拒绝 | 无fallback |
| secret provider/raw token | 无Chat来源 | SDK/OS处理 | Chat禁止持有 | 必要资格缺失fail-closed |

### 7.2 冲突处理

| 冲突场景 | 规则 | 阻断范围 |
|---|---|---|
| 任意层JSON重复键、__proto__/constructor/prototype键 | parse/strict keys拒绝，不能先JSON.parse丢信息再覆盖 | 当前startup |
| 默认literal与显式false/非1冲突 | reject；不能安全默认掩盖非法配置 | 当前startup |
| flat字段与模块字段同时存在 | 只模块格式，flat根键未知 | 当前startup |
| required缺叶子/模块 | 不填production值 | 当前startup |
| profileId与platform/批准registry不匹配 | invalid_input；无同名fallback | startup/对应binding |
| SDK/host正式profile缺失 | 合格config不等资格，dependency_unbound | 相关业务/host面blocked |
| 环境变量恰好同名 | 不读取，不改变配置 | 无覆盖效果 |

### app来源小循环

问题回答：app.schemaVersion、app.platform只来自单份批准JSON及该域已列安全缺省。
诊断：在UI/env追加覆盖会使字段与profile资格不一致。
取舍：拒绝所有未列来源；coordinator不读取source。

| 域 | 允许来源 | 禁止来源 | 不可用处理 |
|---|---|---|---|
| app | 上表唯一JSON/批准selector | env/CLI/remote/raw secret/UI | 缺required阻装配；缺正式资格blocked |

回填：§5来源表。本域source/priority/conflict可判定，local gate通过。

### sdk来源小循环

问题回答：sdk.profileRef只来自单份批准JSON。
诊断：在UI/env追加覆盖会使字段与profile资格不一致。
取舍：拒绝所有未列来源；实际profile解析/资格由正式SDK/native批准域完成，不由JSON值生成。

| 域 | 允许来源 | 禁止来源 | 不可用处理 |
|---|---|---|---|
| sdk | 上表唯一JSON/批准selector | env/CLI/remote/raw secret/UI | 缺required阻装配；缺正式资格blocked |

回填：§5来源表。本域source/priority/conflict可判定，local gate通过。

### platform来源小循环

问题回答：platform.hostProfileRef只来自单份批准JSON。
诊断：在UI/env追加覆盖会使字段与profile资格不一致。
取舍：拒绝所有未列来源；实际profile解析/资格由正式SDK/native批准域完成，不由JSON值生成。

| 域 | 允许来源 | 禁止来源 | 不可用处理 |
|---|---|---|---|
| platform | 上表唯一JSON/批准selector | env/CLI/remote/raw secret/UI | 缺required阻装配；缺正式资格blocked |

回填：§5来源表。本域source/priority/conflict可判定，local gate通过。

### intents来源小循环

问题回答：intents.maxTextUnits、intents.maxAttachmentRefs只来自单份批准JSON。
诊断：在UI/env追加覆盖会使字段与profile资格不一致。
取舍：拒绝所有未列来源；coordinator不读取source。

| 域 | 允许来源 | 禁止来源 | 不可用处理 |
|---|---|---|---|
| intents | 上表唯一JSON/批准selector | env/CLI/remote/raw secret/UI | 缺required阻装配；缺正式资格blocked |

回填：§5来源表。本域source/priority/conflict可判定，local gate通过。

### local_state来源小循环

问题回答：local_state.maxCachedEntries、local_state.memoryOnly只来自单份批准JSON及该域已列安全缺省。
诊断：在UI/env追加覆盖会使字段与profile资格不一致。
取舍：拒绝所有未列来源；coordinator不读取source。

| 域 | 允许来源 | 禁止来源 | 不可用处理 |
|---|---|---|---|
| local_state | 上表唯一JSON/批准selector | env/CLI/remote/raw secret/UI | 缺required阻装配；缺正式资格blocked |

回填：§5来源表。本域source/priority/conflict可判定，local gate通过。

### continuity来源小循环

问题回答：continuity.maxConsumedChanges、continuity.maxConsumptionContexts只来自单份批准JSON。
诊断：在UI/env追加覆盖会使字段与profile资格不一致。
取舍：拒绝所有未列来源；coordinator不读取source。

| 域 | 允许来源 | 禁止来源 | 不可用处理 |
|---|---|---|---|
| continuity | 上表唯一JSON/批准selector | env/CLI/remote/raw secret/UI | 缺required阻装配；缺正式资格blocked |

回填：§5来源表。本域source/priority/conflict可判定，local gate通过。

### collaboration来源小循环

问题回答：collaboration.maxDirectoryQueryUnits、collaboration.maxVisibleProcessNodes、collaboration.maxVisibleProcessEdges只来自单份批准JSON。
诊断：在UI/env追加覆盖会使字段与profile资格不一致。
取舍：拒绝所有未列来源；coordinator不读取source。

| 域 | 允许来源 | 禁止来源 | 不可用处理 |
|---|---|---|---|
| collaboration | 上表唯一JSON/批准selector | env/CLI/remote/raw secret/UI | 缺required阻装配；缺正式资格blocked |

回填：§5来源表。本域source/priority/conflict可判定，local gate通过。

### diagnostic来源小循环

问题回答：diagnostic.mode只来自单份批准JSON及该域已列安全缺省。
诊断：在UI/env追加覆盖会使字段与profile资格不一致。
取舍：拒绝所有未列来源；coordinator不读取source。

| 域 | 允许来源 | 禁止来源 | 不可用处理 |
|---|---|---|---|
| diagnostic | 上表唯一JSON/批准selector | env/CLI/remote/raw secret/UI | 缺required阻装配；缺正式资格blocked |

回填：§5来源表。本域source/priority/conflict可判定，local gate通过。

跨来源审查：无secret普通覆盖、无重复字段、无环境隐式默认；原型服务器参数和SDK env完全隔离。strict parse/模块mapping的03影响集中Step9回写。

## 8. 对详细设计的影响判定

| 配置结论 | 是否影响03 | 影响类型 | 03回写位置 | 处理状态 |
|---|---|---|---|---|
| 当前Step仅细化已有配置语义/来源/失败策略 | 否 | 配置语义 | 不适用 | 无回写 |

## 9. 回填草稿

正式04 §5仅回填§7已经收口的配置契约；保留来源链接，不复制讨论问题、停审计划或旧授权记录。Step15承担全文章节来源与总审计。

## 10. 待确认事项

CHAT-UP001～009、WS-UP001～008、CHAT-BASE001、native批准权限与SDK实际profile、生产sizing/兼容测试继续open/blocked；具体影响以当前结构化表为准。未来扩展未纳入当前schema；不以未来trigger阻塞当前已闭合本地契约。

## 11. 自检与下一门禁

来源→类别→来源优先级→profile→配置项→加载/安全/变更/失败→03影响已核对本Step适用部分。无raw secret、私有业务IO、权限提升、command重试后门；下游只承接planned测试方向。当前Step local设计门禁通过；下一步读取项目台账、本flow及Step6 SOP/对应书写规范。无代码、应用测试或commit。
