# L5-chat 04 · Step 7 定义配置项清单

## 1. Step状态与开工确认

> done；gate_status：pass_with_upstream_blockers；2026-10-01。本Step已完成本地设计审查，外部blocked，实施not_started。

| 小阶段 | 输出 | 状态 |
|---|---|---|
| A | SOP回答、具体诊断与取舍 | done |
| B | 八配置域逐个结构化/停审 | done |
| C | 03影响判定、回填、自检 | done |

复杂度判断：需按配置域串行分批，每域回答/诊断/取舍/结构/回填/自检，完成才进入下一域；不建额外附录。

## 2. 本步输入

当前00～03；已通过Step6及相关前序配置域结论；配置SOP Step7和书写规范§5.7；缺正式provider/SDK/host/预算能力继续登记而不补造。

## 3. SOP问题回答

1. 配置名按八功能域，十四flat字段保持不变；数字全required无默认，仅三安全叶子缺省。
2. 必填platform/sdkref/hostref分支/八数字；缺任何required拒绝。
3. 来源同Step5、composition作用域同Step6，无per-tenant/业务scope覆盖。
4～5. startup/internal；数值非法fail-fast、资格不足fail-closed/degraded到blocked，consumer逐字段回03。
6～9. 八模块strict JSON+逐项表，完整strict JSON；无项目重复前缀，system wrapper不属于本地parser。
10～12. 每域串行收单位/范围/示例/失败/consumer，crossaudit检查14字段、未知schema和03loader影响。示例仅说明结构，未测生产容量。

## 4. 当前材料问题诊断

03数字仅positive safe integer，未明确定义文本unit与图budget语义；不能凭示例制造productiondefaults。Nested JSON到flat mapping、拒重复键、unit校验要在03同步，八数字上限属04配置语义。

## 5. 改动前后对比

| 位置 | 改前 | 改后 | 依据 |
|---|---|---|---|
| 本Step输入 | 前序仅提供边界/引用，当前主题未闭口 | 独立收口本Step定义配置项清单 | 当前03与04 SOP |
| 外部正向能力 | 未绑定 | 继续blocked，不由配置授予资格 | CHAT-UP/WS-UP/host |

## 6. 配置设计取舍

采用UTF-16 code units（JS string.length）和显式有限整数；不做截断/隐式归一化。图超额不靠裁边伪拓扑；不新增SDKtimeout/业务幂等窗口。

## 7. 结构化中间产物

### 7.1 外部JSON边界与配置项批次

八域均是普通对象且必填，只有已列叶子允许安全缺省；根键严格为app/sdk/platform/intents/local_state/continuity/collaboration/diagnostic。null/数组/额外键/重复键/危险prototype键拒绝。profileId在LocalConfigInput外壳中，配置文件正文不重复项目名，不含profileId/env/CLI/adapterMode。

数字统一为Number.isSafeInteger且1≤值≤下表绝对上限；上限是本轮设计的防无界接收范围，不是测得性能预算。所有数字无运行默认且不允许0；示例值仅演示和planned fixture，不能自动用于prod。文本在用户原始safe input上以JS string.length计量，不截断UTF-16或grapheme。正式owner限制更严时SDK拒绝，不能用本地预算声明可发送。

| 配置域 | 控制面/类别 | 来源/环境 | 03承接 |
|---|---|---|---|
| app | Step3本域；Step4 startup/internal | Step5唯一source；Step6六profile按platform分支 | flat schemaVersion,platform；loader映射Step9回写 |
| sdk | Step3本域；Step4 startup/internal | Step5唯一source；Step6六profile按platform分支 | flat sdkProfileRef；loader映射Step9回写 |
| platform | Step3本域；Step4 startup/internal | Step5唯一source；Step6六profile按platform分支 | flat hostProfileRef；loader映射Step9回写 |
| intents | Step3本域；Step4 startup/internal | Step5唯一source；Step6六profile按platform分支 | flat maxTextUnits,maxAttachmentRefs；loader映射Step9回写 |
| local_state | Step3本域；Step4 startup/internal | Step5唯一source；Step6六profile按platform分支 | flat maxCachedEntries,memoryOnly；loader映射Step9回写 |
| continuity | Step3本域；Step4 startup/internal | Step5唯一source；Step6六profile按platform分支 | flat maxConsumedChanges,maxConsumptionContexts；loader映射Step9回写 |
| collaboration | Step3本域；Step4 startup/internal | Step5唯一source；Step6六profile按platform分支 | flat maxDirectoryQueryUnits,maxVisibleProcessNodes,maxVisibleProcessEdges；loader映射Step9回写 |
| diagnostic | Step3本域；Step4 startup/internal | Step5唯一source；Step6六profile按platform分支 | flat diagnosticMode；loader映射Step9回写 |
### app配置域小循环

问题回答：本域2字段只控制ConfigLoader/ApplicationComposition；读取范围为当前composition，不是owner业务policy。
诊断：platform及版本不能按缺项猜测。
取舍：采用startup显式值及下述有界检查；拒绝Mobile注册、fake/session自动授权。

#### app严格JSON demo

```json
{
  "app": {
    "schemaVersion": 1,
    "platform": "desktop"
  }
}
```

| 配置项 | 类型 | 默认值 | 是否必填 | 来源 | 作用域 | 生效方式 | 敏感级别 | 失败策略 | 关联模块 |
|---|---|---|---|---|---|---|---|---|---|
| app.schemaVersion | literal 1 | 1 | 否，允许安全缺省 | 批准JSON＋安全缺省 | composition | startup | internal | 配置非法fail-fast；不partial激活 | ConfigLoader/ApplicationComposition |
| app.platform | desktop 或 web_preview | 无 | 是 | 批准JSON | composition | startup | internal | 配置非法fail-fast；不partial激活 | ConfigLoader/ApplicationComposition |

| 配置项 | 示例值 | 约束/校验/单位 | 业务失败与安全策略 | flat字段 |
|---|---|---|---|---|
| app.schemaVersion | `1` | 只允许1；外壳schemaVersion与此相同 | 未知版本invalid_input，阻装配 | schemaVersion |
| app.platform | `"desktop"` | 与六profile catalog匹配；mobile非法 | invalid_input阻装配 | platform |

回填：正式04 §7此域demo及完整两表；配置项来自Step3～6相同域。自检：字段类型/默认/required/来源/作用域/生效/敏感/失败与consumer齐全；示例非资格/生产默认。本域pass_with_upstream_blockers。
### sdk配置域小循环

问题回答：本域1字段只控制SdkCapabilityBinding/SDK adapters；读取范围为当前composition，不是owner业务policy。
诊断：profile引用合法不等正式registry已提供；不得把字符串当bound证据。
取舍：采用startup显式值及下述有界检查；拒绝raw endpoint/token/private bus或配置bound。

#### sdk严格JSON demo

```json
{
  "sdk": {
    "profileRef": "sdk-profile:desktop-local"
  }
}
```

| 配置项 | 类型 | 默认值 | 是否必填 | 来源 | 作用域 | 生效方式 | 敏感级别 | 失败策略 | 关联模块 |
|---|---|---|---|---|---|---|---|---|---|
| sdk.profileRef | string | 无 | 是；Desktop/preview均非空 | 批准JSON | composition | startup | internal | 配置非法fail-fast；资格不足fail-closed | SdkCapabilityBinding/SDK adapters |

| 配置项 | 示例值 | 约束/校验/单位 | 业务失败与安全策略 | flat字段 |
|---|---|---|---|---|
| sdk.profileRef | `"sdk-profile:desktop-local"` | 非空批准非敏感alias，必须独立正式registry解析 | 结构错invalid_input；无正式profile dependency_unbound | sdkProfileRef |

回填：正式04 §7此域demo及完整两表；配置项来自Step3～6相同域。自检：字段类型/默认/required/来源/作用域/生效/敏感/失败与consumer齐全；示例非资格/生产默认。本域pass_with_upstream_blockers。
### platform配置域小循环

问题回答：本域1字段只控制DesktopPlatformAdapter/HostBoundaryGuard；读取范围为当前composition，不是owner业务policy。
诊断：profile引用合法不等正式registry已提供；不得把字符串当bound证据。
取舍：采用startup显式值及下述有界检查；拒绝JSON自授origin/window/permissions。

#### platform严格JSON demo

```json
{
  "platform": {
    "hostProfileRef": "host-profile:desktop-local"
  }
}
```

| 配置项 | 类型 | 默认值 | 是否必填 | 来源 | 作用域 | 生效方式 | 敏感级别 | 失败策略 | 关联模块 |
|---|---|---|---|---|---|---|---|---|---|
| platform.hostProfileRef | string 或 null | 无 | 是；preview显式null | 批准JSON | composition | startup | internal | 配置非法fail-fast；资格不足fail-closed | DesktopPlatformAdapter/HostBoundaryGuard |

| 配置项 | 示例值 | 约束/校验/单位 | 业务失败与安全策略 | flat字段 |
|---|---|---|---|---|
| platform.hostProfileRef | `"host-profile:desktop-local"` | desktop非空批准alias；preview必须null | 结构错invalid_input；无正式profile dependency_unbound | hostProfileRef |

回填：正式04 §7此域demo及完整两表；配置项来自Step3～6相同域。自检：字段类型/默认/required/来源/作用域/生效/敏感/失败与consumer齐全；示例非资格/生产默认。本域pass_with_upstream_blockers。
### intents配置域小循环

问题回答：本域2字段只控制DraftPolicy/冻结输入工厂；读取范围为当前composition，不是owner业务policy。
诊断：用户输入计量与owner发送限制不同，示例数值不能成为发送成功保证。
取舍：采用startup显式值及下述有界检查；拒绝改变owner发送限值或unknown重发。

#### intents严格JSON demo

```json
{
  "intents": {
    "maxTextUnits": 4096,
    "maxAttachmentRefs": 8
  }
}
```

| 配置项 | 类型 | 默认值 | 是否必填 | 来源 | 作用域 | 生效方式 | 敏感级别 | 失败策略 | 关联模块 |
|---|---|---|---|---|---|---|---|---|---|
| intents.maxTextUnits | number / positive safe integer | 无 | 是 | 批准JSON | composition | startup | internal | 配置非法fail-fast；不partial激活 | DraftPolicy/冻结输入工厂 |
| intents.maxAttachmentRefs | number / positive safe integer | 无 | 是 | 批准JSON | composition | startup | internal | 配置非法fail-fast；不partial激活 | DraftPolicy/冻结输入工厂 |

| 配置项 | 示例值 | 约束/校验/单位 | 业务失败与安全策略 | flat字段 |
|---|---|---|---|---|
| intents.maxTextUnits | `4096` | 1～65536；UTF-16 code units，JS string.length；不trim/normalize后计量 | 保留编辑稿/标invalid；不截断、不dispatch | maxTextUnits |
| intents.maxAttachmentRefs | `8` | 1～64；一份draft内附件引用数组元素数 | 拒绝增加超额引用；不上传正文 | maxAttachmentRefs |

回填：正式04 §7此域demo及完整两表；配置项来自Step3～6相同域。自检：字段类型/默认/required/来源/作用域/生效/敏感/失败与consumer齐全；示例非资格/生产默认。本域pass_with_upstream_blockers。
### local_state配置域小循环

问题回答：本域2字段只控制PersistenceSafetyGuard/repository；读取范围为当前composition，不是owner业务policy。
诊断：持有map不是业务结果存储；memoryOnly不得false。
取舍：采用startup显式值及下述有界检查；拒绝正文/credential/ref持久化或durable开启。

#### local_state严格JSON demo

```json
{
  "local_state": {
    "maxCachedEntries": 128,
    "memoryOnly": true
  }
}
```

| 配置项 | 类型 | 默认值 | 是否必填 | 来源 | 作用域 | 生效方式 | 敏感级别 | 失败策略 | 关联模块 |
|---|---|---|---|---|---|---|---|---|---|
| local_state.maxCachedEntries | number / positive safe integer | 无 | 是 | 批准JSON | composition | startup | internal | 配置非法fail-fast；不partial激活 | PersistenceSafetyGuard/repository |
| local_state.memoryOnly | literal true | true | 否，允许安全缺省 | 批准JSON＋安全缺省 | composition | startup | internal | 配置非法fail-fast；不partial激活 | PersistenceSafetyGuard/repository |

| 配置项 | 示例值 | 约束/校验/单位 | 业务失败与安全策略 | flat字段 |
|---|---|---|---|---|
| local_state.maxCachedEntries | `128` | 1～1024；当前composition内memory projection map条目总数 | 按03版本化安全清理；不blind覆盖、不声明durable | maxCachedEntries |
| local_state.memoryOnly | `true` | false/非boolean拒绝 | invalid_input；不能开启durable | memoryOnly |

回填：正式04 §7此域demo及完整两表；配置项来自Step3～6相同域。自检：字段类型/默认/required/来源/作用域/生效/敏感/失败与consumer齐全；示例非资格/生产默认。本域pass_with_upstream_blockers。
### continuity配置域小循环

问题回答：本域2字段只控制reducer/consumer slots/cleanup；读取范围为当前composition，不是owner业务policy。
诊断：去重容量耗尽不允许丢identity后沿用旧coverage。
取舍：采用startup显式值及下述有界检查；拒绝丢去重后仍fresh、跨source排序。

#### continuity严格JSON demo

```json
{
  "continuity": {
    "maxConsumedChanges": 2048,
    "maxConsumptionContexts": 16
  }
}
```

| 配置项 | 类型 | 默认值 | 是否必填 | 来源 | 作用域 | 生效方式 | 敏感级别 | 失败策略 | 关联模块 |
|---|---|---|---|---|---|---|---|---|---|
| continuity.maxConsumedChanges | number / positive safe integer | 无 | 是 | 批准JSON | composition | startup | internal | 配置非法fail-fast；不partial激活 | reducer/consumer slots/cleanup |
| continuity.maxConsumptionContexts | number / positive safe integer | 无 | 是 | 批准JSON | composition | startup | internal | 配置非法fail-fast；不partial激活 | reducer/consumer slots/cleanup |

| 配置项 | 示例值 | 约束/校验/单位 | 业务失败与安全策略 | flat字段 |
|---|---|---|---|---|
| continuity.maxConsumedChanges | `2048` | 1～65536；当前source消费代次accepted去重身份数；总slots另受context上限 | 先失效source/旧slot、stale，再正式requery；不LRU丢身份后fresh | maxConsumedChanges |
| continuity.maxConsumptionContexts | `16` | 1～128；当前composition存活消费槽位总数 | 先invalidate/hide/stop旧slot；late结果拒绝，无authority升级 | maxConsumptionContexts |

回填：正式04 §7此域demo及完整两表；配置项来自Step3～6相同域。自检：字段类型/默认/required/来源/作用域/生效/敏感/失败与consumer齐全；示例非资格/生产默认。本域pass_with_upstream_blockers。
### collaboration配置域小循环

问题回答：本域3字段只控制search factory/Process renderer/safe topology；读取范围为当前composition，不是owner业务policy。
诊断：简单裁剪BPMN边会改变fork/join含义，图和等价列表必须共用同安全材料。
取舍：采用startup显式值及下述有界检查；拒绝拓扑截断假完整、显示hidden count/关系。

#### collaboration严格JSON demo

```json
{
  "collaboration": {
    "maxDirectoryQueryUnits": 128,
    "maxVisibleProcessNodes": 256,
    "maxVisibleProcessEdges": 1024
  }
}
```

| 配置项 | 类型 | 默认值 | 是否必填 | 来源 | 作用域 | 生效方式 | 敏感级别 | 失败策略 | 关联模块 |
|---|---|---|---|---|---|---|---|---|---|
| collaboration.maxDirectoryQueryUnits | number / positive safe integer | 无 | 是 | 批准JSON | composition | startup | internal | 配置非法fail-fast；不partial激活 | search factory/Process renderer/safe topology |
| collaboration.maxVisibleProcessNodes | number / positive safe integer | 无 | 是 | 批准JSON | composition | startup | internal | 配置非法fail-fast；不partial激活 | search factory/Process renderer/safe topology |
| collaboration.maxVisibleProcessEdges | number / positive safe integer | 无 | 是 | 批准JSON | composition | startup | internal | 配置非法fail-fast；不partial激活 | search factory/Process renderer/safe topology |

| 配置项 | 示例值 | 约束/校验/单位 | 业务失败与安全策略 | flat字段 |
|---|---|---|---|---|
| collaboration.maxDirectoryQueryUnits | `128` | 1～512；用户目录搜索UTF-16 code units；不接任意SQL/DSL | 拒绝新搜索输入，保留合法当前状态，不泄露provider | maxDirectoryQueryUnits |
| collaboration.maxVisibleProcessNodes | `256` | 1～2048；当前整体或阶段safe topology中visible节点数组元素数 | 过预算不接收为ready完整图；安全unsupported/stale，不伪完整裁剪 | maxVisibleProcessNodes |
| collaboration.maxVisibleProcessEdges | `1024` | 1～8192；同一safe topology中visible边数组元素数 | 同node预算规则；图/list同材料，不泄露hidden计数 | maxVisibleProcessEdges |

回填：正式04 §7此域demo及完整两表；配置项来自Step3～6相同域。自检：字段类型/默认/required/来源/作用域/生效/敏感/失败与consumer齐全；示例非资格/生产默认。本域pass_with_upstream_blockers。
### diagnostic配置域小循环

问题回答：本域1字段只控制DiagnosticHandoffAdapter；读取范围为当前composition，不是owner业务policy。
诊断：模式不是background日志开关，六字段和显式请求不变。
取舍：采用startup显式值及下述有界检查；拒绝自动日志/后台交付或扩展六字段。

#### diagnostic严格JSON demo

```json
{
  "diagnostic": {
    "mode": "disabled"
  }
}
```

| 配置项 | 类型 | 默认值 | 是否必填 | 来源 | 作用域 | 生效方式 | 敏感级别 | 失败策略 | 关联模块 |
|---|---|---|---|---|---|---|---|---|---|
| diagnostic.mode | disabled 或 formal_low_sensitivity | disabled | 否，允许安全缺省 | 批准JSON＋安全缺省 | composition | startup | internal | 配置非法fail-fast；不partial激活 | DiagnosticHandoffAdapter |

| 配置项 | 示例值 | 约束/校验/单位 | 业务失败与安全策略 | flat字段 |
|---|---|---|---|---|
| diagnostic.mode | `"disabled"` | 后者只显式支持操作且正式sinkbound；缺资格blocked零IO | 类型invalid_input；sink未绑定不降为fake | diagnosticMode |

回填：正式04 §7此域demo及完整两表；配置项来自Step3～6相同域。自检：字段类型/默认/required/来源/作用域/生效/敏感/失败与consumer齐全；示例非资格/生产默认。本域pass_with_upstream_blockers。
### 完整严格JSON demo

以下是desktop-local结构示例。SDK/host alias仅占位名称，未解析/未qualify时正式能力仍blocked；不得把本例复制为生产默认或声称已运行。本配置不得含注释。

```json
{
  "app": {
    "schemaVersion": 1,
    "platform": "desktop"
  },
  "sdk": {
    "profileRef": "sdk-profile:desktop-local"
  },
  "platform": {
    "hostProfileRef": "host-profile:desktop-local"
  },
  "intents": {
    "maxTextUnits": 4096,
    "maxAttachmentRefs": 8
  },
  "local_state": {
    "maxCachedEntries": 128,
    "memoryOnly": true
  },
  "continuity": {
    "maxConsumedChanges": 2048,
    "maxConsumptionContexts": 16
  },
  "collaboration": {
    "maxDirectoryQueryUnits": 128,
    "maxVisibleProcessNodes": 256,
    "maxVisibleProcessEdges": 1024
  },
  "diagnostic": {
    "mode": "disabled"
  }
}
```

### 7.2 唯一映射、单位与跨项审计

八域叶子共14，逐项对应flat ClientConfig，保留existing signatures；只有sdk.profileRef→sdkProfileRef和diagnostic.mode→diagnosticMode别名，platform.hostProfileRef同名叶子。根app.schemaVersion与外壳schemaVersion同为1。所有域必填，safe defaults只省叶子。嵌套JSON不得混入flat字段。

profile alias仅ASCII受限标识符，长度1～128；允许小写字母开头、后续小写字母/数字/点/下划线/冒号/短横线，不允许URL、path、userinfo、空白、wildcard、secret material；格式检查只是本地结构，正式catalog与registry必须独立匹配。禁止把用户可控alias直接用作文件路径。

maxVisibleProcessEdges不强制≤nodes或其它经验公式，fork/join/loop/平行边由正式拓扑定义。预算均检查可披露safe数组，不查看hidden数据或输出hidden总数。超预算映射unsupported_material，已有view可stale/unsupported安全姿态，不能设置ready并提供残缺拓扑；list与图同裁剪/披露规则。所有数字required，无自动defaults与静默clamp。maxCachedEntries同时约束LocalPageRequest.limit，本地上限不保证SDK接受。

跨项审计：无重复/孤儿/泛化配置桶，八域使用同source/schema/profile；native allowlist非JSON字段；无secret或业务retry配置。模块JSON解析/映射、unit/duplicate规则在Step9回写03后才可正式装配。

## 8. 对详细设计的影响判定

| 配置结论 | 是否影响03 | 影响类型 | 03回写位置 | 处理状态 |
|---|---|---|---|---|
| 模块JSON到flat ClientConfig的严格loader映射/单位/重复键检查 | 是 | loader输入解释与validation | 03 §5.9/§13；Step6/14 | 已回写 |
| 数值required/有界区间与安全缺省 | 否 | 配置语义/数值 | 不适用 | 无回写 |

## 9. 回填草稿

正式04 §7仅回填§7已经收口的配置契约；保留来源链接，不复制讨论问题、停审计划或旧授权记录。Step15承担全文章节来源与总审计。

## 10. 待确认事项

CHAT-UP001～009、WS-UP001～008、CHAT-BASE001、native批准权限与SDK实际profile、生产sizing/兼容测试继续open/blocked；具体影响以当前结构化表为准。未来扩展未纳入当前schema；不以未来trigger阻塞当前已闭合本地契约。

## 11. 自检与下一门禁

来源→类别→来源优先级→profile→配置项→加载/安全/变更/失败→03影响已核对本Step适用部分。无raw secret、私有业务IO、权限提升、command重试后门；下游只承接planned测试方向。当前Step local设计门禁通过；下一步读取项目台账、本flow及Step8 SOP/对应书写规范。无代码、应用测试或commit。
