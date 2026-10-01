# L5-chat 04 · Step 4 定义配置分类与禁止配置化边界

## 1. Step状态与开工确认

> done；gate_status：pass_with_upstream_blockers；2026-10-01。本Step已完成本地设计审查，外部blocked，实施not_started。

| 小阶段 | 输出 | 状态 |
|---|---|---|
| A | SOP回答、具体诊断与取舍 | done |
| B | 八配置域逐个结构化/停审 | done |
| C | 03影响判定、回填、自检 | done |

复杂度判断：需按配置域串行分批，每域回答/诊断/取舍/结构/回填/自检，完成才进入下一域；不建额外附录。

## 2. 本步输入

当前00～03；已通过Step3及相关前序配置域结论；配置SOP Step4和书写规范§5.4；缺正式provider/SDK/host/预算能力继续登记而不补造。

## 3. SOP问题回答

1. 全十四字段为startup内部配置，native allowlist属于build-time批准policy。
2～3. V1无hot/reload；profile切换需新composition/epoch，旧refs不得沿用。
4～5. SDK-only、visibility、fence/CAS、unknown、resultauthority、no durable和redaction禁止配置绕过；变化须先设计审议。
6～8. 八域同一startup分类，敏感ref与普通数值分开，逐域审边界。
9. fake/preview不能成为生产模式，宿主available不能升级业务资格。

## 4. 当前材料问题诊断

diagnosticMode可选择模式但不是自动上报开关；memoryOnly是literal不是用户可变布尔；native白名单不能嵌在普通JSON中成为动态权限。

## 5. 改动前后对比

| 位置 | 改前 | 改后 | 依据 |
|---|---|---|---|
| 本Step输入 | 前序仅提供边界/引用，当前主题未闭口 | 独立收口本Step定义配置分类与禁止配置化边界 | 当前03与04 SOP |
| 外部正向能力 | 未绑定 | 继续blocked，不由配置授予资格 | CHAT-UP/WS-UP/host |

## 6. 配置设计取舍

采用startup冻结+静态硬约束；拒绝运行时热变更和所有disable_guard键。外部来源不提供认证，缺资格只降级。

## 7. 结构化中间产物

| 类别 | 说明/示例 | 允许热更新 | 主要风险 |
|---|---|---|---|
| startup | 14字段，一次loader/新composition | 否 | 旧slot/profile混用 |
| build-time | native origin/window/CSP/capability批准策略 | 否 | 任意origin或wildcard权限 |
| sensitive/secret | 当前普通配置不接收；SDK/OS独立处理 | 不适用 | secret进入UI/报告 |
| static | memoryOnly=true、authority/fence/redaction | 否 | 安全规则被开关化 |
| debug | 原型及test harness隔离，非active schema字段 | 否 | fake错标production |

### app分类边界小循环

问题：本域哪些参数能变？app.schemaVersion、app.platform仅在新启动受校验读取。
诊断：把startup数值/ref当热开关会导致旧store/资格残留。
取舍：startup冻结；不添加hot/reload字段。

| 域 | 适用分类 | 不适用 | 禁配项/03依据 |
|---|---|---|---|
| app | startup/internal | hot/remote/admin raw secret | Mobile注册、fake/session自动授权；03 §5/§9/§11～13 |

回填：§4此域边界。自检：无运行时提高权限或保留旧epoch方式；local gate通过。

### sdk分类边界小循环

问题：本域哪些参数能变？sdk.profileRef仅在新启动受校验读取。
诊断：把startup数值/ref当热开关会导致旧store/资格残留。
取舍：startup冻结；不添加hot/reload字段。

| 域 | 适用分类 | 不适用 | 禁配项/03依据 |
|---|---|---|---|
| sdk | startup/internal | hot/remote/admin raw secret | raw endpoint/token/private bus或配置bound；03 §5/§9/§11～13 |

回填：§4此域边界。自检：无运行时提高权限或保留旧epoch方式；local gate通过。

### platform分类边界小循环

问题：本域哪些参数能变？platform.hostProfileRef仅在新启动受校验读取。
诊断：把startup数值/ref当热开关会导致旧store/资格残留。
取舍：startup冻结；native批准policy另经build-time评审。

| 域 | 适用分类 | 不适用 | 禁配项/03依据 |
|---|---|---|---|
| platform | startup/internal | hot/remote/admin raw secret | JSON自授origin/window/permissions；03 §5/§9/§11～13 |

回填：§4此域边界。自检：无运行时提高权限或保留旧epoch方式；local gate通过。

### intents分类边界小循环

问题：本域哪些参数能变？intents.maxTextUnits、intents.maxAttachmentRefs仅在新启动受校验读取。
诊断：把startup数值/ref当热开关会导致旧store/资格残留。
取舍：startup冻结；不添加hot/reload字段。

| 域 | 适用分类 | 不适用 | 禁配项/03依据 |
|---|---|---|---|
| intents | startup/internal | hot/remote/admin raw secret | 改变owner发送限值或unknown重发；03 §5/§9/§11～13 |

回填：§4此域边界。自检：无运行时提高权限或保留旧epoch方式；local gate通过。

### local_state分类边界小循环

问题：本域哪些参数能变？local_state.maxCachedEntries、local_state.memoryOnly仅在新启动受校验读取。
诊断：把startup数值/ref当热开关会导致旧store/资格残留。
取舍：startup冻结；不添加hot/reload字段。

| 域 | 适用分类 | 不适用 | 禁配项/03依据 |
|---|---|---|---|
| local_state | startup/internal；memoryOnly static | hot/remote/admin raw secret | 正文/credential/ref持久化或durable开启；03 §5/§9/§11～13 |

回填：§4此域边界。自检：无运行时提高权限或保留旧epoch方式；local gate通过。

### continuity分类边界小循环

问题：本域哪些参数能变？continuity.maxConsumedChanges、continuity.maxConsumptionContexts仅在新启动受校验读取。
诊断：把startup数值/ref当热开关会导致旧store/资格残留。
取舍：startup冻结；不添加hot/reload字段。

| 域 | 适用分类 | 不适用 | 禁配项/03依据 |
|---|---|---|---|
| continuity | startup/internal | hot/remote/admin raw secret | 丢去重后仍fresh、跨source排序；03 §5/§9/§11～13 |

回填：§4此域边界。自检：无运行时提高权限或保留旧epoch方式；local gate通过。

### collaboration分类边界小循环

问题：本域哪些参数能变？collaboration.maxDirectoryQueryUnits、collaboration.maxVisibleProcessNodes、collaboration.maxVisibleProcessEdges仅在新启动受校验读取。
诊断：把startup数值/ref当热开关会导致旧store/资格残留。
取舍：startup冻结；不添加hot/reload字段。

| 域 | 适用分类 | 不适用 | 禁配项/03依据 |
|---|---|---|---|
| collaboration | startup/internal | hot/remote/admin raw secret | 拓扑截断假完整、显示hidden count/关系；03 §5/§9/§11～13 |

回填：§4此域边界。自检：无运行时提高权限或保留旧epoch方式；local gate通过。

### diagnostic分类边界小循环

问题：本域哪些参数能变？diagnostic.mode仅在新启动受校验读取。
诊断：把startup数值/ref当热开关会导致旧store/资格残留。
取舍：startup冻结；不添加hot/reload字段。

| 域 | 适用分类 | 不适用 | 禁配项/03依据 |
|---|---|---|---|
| diagnostic | startup/internal | hot/remote/admin raw secret | 自动日志/后台交付或扩展六字段；03 §5/§9/§11～13 |

回填：§4此域边界。自检：无运行时提高权限或保留旧epoch方式；local gate通过。

| 禁止配置化项 | 原因/依据 | 变更流程 |
|---|---|---|
| allowAckConfirm/autoResendUnknown | 03 §11业务结果/副作用边界 | 回00～03与SDK/owner正式合同 |
| disableVisibility/disableFence/ignoreSlots | 03 §5/§8～12撤销与CAS | 正式安全设计审议 |
| persistRawBody/memoryOnly=false | 03 §10持有和清理 | durable新需求、schema/host闭包 |
| Process/关系/目录owner、join判定、人员覆盖 | 00～03 owner边界 | 对应owner/SDK能力确认 |
| hidden节点/人员总数/关联显示 | 03 safe topology/visibility | 禁止用普通配置改变 |
| raw endpoint/token/internal topic、bus直订 | 01 SDK-only/03 §13 | SDK正式接缝设计 |
| debug grants/fake=true绕qualifiedregistry | 03 §5/§7结果资格 | 禁止生产接入 |

跨分类审查：十四字段全startup；static literal优先拒绝冲突而非覆盖；没有P1新字段混入P0，所有禁止项均有03依据。

## 8. 对详细设计的影响判定

| 配置结论 | 是否影响03 | 影响类型 | 03回写位置 | 处理状态 |
|---|---|---|---|---|
| 当前Step仅细化已有配置语义/来源/失败策略 | 否 | 配置语义 | 不适用 | 无回写 |

## 9. 回填草稿

正式04 §4仅回填§7已经收口的配置契约；保留来源链接，不复制讨论问题、停审计划或旧授权记录。Step15承担全文章节来源与总审计。

## 10. 待确认事项

CHAT-UP001～009、WS-UP001～008、CHAT-BASE001、native批准权限与SDK实际profile、生产sizing/兼容测试继续open/blocked；具体影响以当前结构化表为准。未来扩展未纳入当前schema；不以未来trigger阻塞当前已闭合本地契约。

## 11. 自检与下一门禁

来源→类别→来源优先级→profile→配置项→加载/安全/变更/失败→03影响已核对本Step适用部分。无raw secret、私有业务IO、权限提升、command重试后门；下游只承接planned测试方向。当前Step local设计门禁通过；下一步读取项目台账、本flow及Step5 SOP/对应书写规范。无代码、应用测试或commit。
