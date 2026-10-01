# L5-chat 04 · Step 3 建立配置控制面总览

## 1. Step状态与开工确认

> done；gate_status：pass_with_upstream_blockers；2026-10-01。本Step已完成本地设计审查，外部blocked，实施not_started。

| 小阶段 | 输出 | 状态 |
|---|---|---|
| A | SOP回答、具体诊断与取舍 | done |
| B | 八配置域逐个结构化/停审 | done |
| C | 03影响判定、回填、自检 | done |

复杂度判断：需按配置域串行分批，每域回答/诊断/取舍/结构/回填/自检，完成才进入下一域；不建额外附录。

## 2. 本步输入

当前00～03；已通过Step2及相关前序配置域结论；配置SOP Step3和书写规范§5.3；缺正式provider/SDK/host/预算能力继续登记而不补造。

## 3. SOP问题回答

1. 只允许注入LocalConfigSource读取批准本地JSON；没有env/CLI/remote/admin来源。
2. ConfigLoader为唯一读取校验入口，ApplicationComposition一次装配。
3. UI/coordinator只接immutable参数/typed ports；native批准allowlist属于独立nativebuild域。
4. 本地资源/呈现受控，authority/SDK业务重试不受控。
5. 05～07/09承接失败矩阵和版本/宿主门禁。
6～7. 十四字段拆八个功能域，所有字段一对一映射现有ClientConfig，不另设业务配置。
8～9. 每域完成来源/允许/禁止/03影响核对，最后跨域审查重复和遗漏。

## 4. 当前材料问题诊断

03运行对象为flat ClientConfig；书写规范要求外部JSON按功能模块。需明确external-only层级与唯一flatten映射，否则实现者会自行扩充runtime字段。

## 5. 改动前后对比

| 位置 | 改前 | 改后 | 依据 |
|---|---|---|---|
| 本Step输入 | 前序仅提供边界/引用，当前主题未闭口 | 独立收口本Step建立配置控制面总览 | 当前03与04 SOP |
| 外部正向能力 | 未绑定 | 继续blocked，不由配置授予资格 | CHAT-UP/WS-UP/host |

## 6. 配置设计取舍

采用外部模块JSON与现有flat对象1:1映射，保留ConfigLoader签名；在Step9反向校准loader语义。拒绝巨型common/runtime配置和组件直接读env。

## 7. 结构化中间产物

### 7.1 配置来源链图: Chat唯一启动来源

```text
[approved local source/profile selection]
  -> [one strict module JSON]
  -> [safe literal defaults only]
  -> [ConfigLoader.validate -> flat immutable ClientConfig]
  -> [ApplicationComposition -> typed deps / ports]
[native approved build policy] -> [HostBoundaryGuard constructor]
[SDK formal profile authority] -> [SdkCapabilityBinding qualification]
```

关键说明：
- 一份批准JSON是唯一普通来源；只允许省略schemaVersion/memoryOnly/diagnosticMode三安全缺省。
- native/SDK权威并非普通JSON覆盖链；profile字符串不证明其存在或授予权限。
- 不表达部署操作，也不向UI传raw client或secret。

### 7.2 app控制面

问题回答：app.schemaVersion、app.platform控制ConfigLoader/ApplicationComposition所需本地装配参数。
诊断：前序只有flat字段，外部层级未定；禁止Mobile注册、fake/session自动授权。
取舍：采用具名功能域与既有字段一对一；不让此域控制其它owner不变量。

| 域 | 来源 | 允许能力 | 对应03 | P0 | 03影响 |
|---|---|---|---|---|---|
| app | 批准local source，经loader；SDK/host资格独立 | schemaVersion、platform | §5.9/§13及ConfigLoader/ApplicationComposition | 是 | 外部层级映射在Step9闭口 |

回填：正式04 §3沿用此域边界。自检：来源、字段、consumer和禁项一一对应；本域local gate pass_with_upstream_blockers。

### 7.3 sdk控制面

问题回答：sdk.profileRef控制SdkCapabilityBinding/SDK adapters所需本地装配参数。
诊断：前序只有flat字段，外部层级未定；禁止raw endpoint/token/private bus或配置bound。
取舍：采用具名功能域与既有字段一对一；不让此域控制其它owner不变量。

| 域 | 来源 | 允许能力 | 对应03 | P0 | 03影响 |
|---|---|---|---|---|---|
| sdk | 批准local source，经loader；SDK/host资格独立 | sdkProfileRef | §5.9/§13及SdkCapabilityBinding/SDK adapters | 是 | 外部层级映射在Step9闭口 |

回填：正式04 §3沿用此域边界。自检：来源、字段、consumer和禁项一一对应；本域local gate pass_with_upstream_blockers。

### 7.4 platform控制面

问题回答：platform.hostProfileRef控制DesktopPlatformAdapter/HostBoundaryGuard所需本地装配参数。
诊断：前序只有flat字段，外部层级未定；禁止JSON自授origin/window/permissions。
取舍：采用具名功能域与既有字段一对一；不让此域控制其它owner不变量。

| 域 | 来源 | 允许能力 | 对应03 | P0 | 03影响 |
|---|---|---|---|---|---|
| platform | 批准local source，经loader；SDK/host资格独立 | hostProfileRef | §5.9/§13及DesktopPlatformAdapter/HostBoundaryGuard | 是 | 外部层级映射在Step9闭口 |

回填：正式04 §3沿用此域边界。自检：来源、字段、consumer和禁项一一对应；本域local gate pass_with_upstream_blockers。

### 7.5 intents控制面

问题回答：intents.maxTextUnits、intents.maxAttachmentRefs控制DraftPolicy/冻结输入工厂所需本地装配参数。
诊断：前序只有flat字段，外部层级未定；禁止改变owner发送限值或unknown重发。
取舍：采用具名功能域与既有字段一对一；不让此域控制其它owner不变量。

| 域 | 来源 | 允许能力 | 对应03 | P0 | 03影响 |
|---|---|---|---|---|---|
| intents | 批准local source，经loader；SDK/host资格独立 | maxTextUnits、maxAttachmentRefs | §5.9/§13及DraftPolicy/冻结输入工厂 | 是 | 外部层级映射在Step9闭口 |

回填：正式04 §3沿用此域边界。自检：来源、字段、consumer和禁项一一对应；本域local gate pass_with_upstream_blockers。

### 7.6 local_state控制面

问题回答：local_state.maxCachedEntries、local_state.memoryOnly控制PersistenceSafetyGuard/repository所需本地装配参数。
诊断：前序只有flat字段，外部层级未定；禁止正文/credential/ref持久化或durable开启。
取舍：采用具名功能域与既有字段一对一；不让此域控制其它owner不变量。

| 域 | 来源 | 允许能力 | 对应03 | P0 | 03影响 |
|---|---|---|---|---|---|
| local_state | 批准local source，经loader；SDK/host资格独立 | maxCachedEntries、memoryOnly | §5.9/§13及PersistenceSafetyGuard/repository | 是 | 外部层级映射在Step9闭口 |

回填：正式04 §3沿用此域边界。自检：来源、字段、consumer和禁项一一对应；本域local gate pass_with_upstream_blockers。

### 7.7 continuity控制面

问题回答：continuity.maxConsumedChanges、continuity.maxConsumptionContexts控制reducer/consumer slots/cleanup所需本地装配参数。
诊断：前序只有flat字段，外部层级未定；禁止丢去重后仍fresh、跨source排序。
取舍：采用具名功能域与既有字段一对一；不让此域控制其它owner不变量。

| 域 | 来源 | 允许能力 | 对应03 | P0 | 03影响 |
|---|---|---|---|---|---|
| continuity | 批准local source，经loader；SDK/host资格独立 | maxConsumedChanges、maxConsumptionContexts | §5.9/§13及reducer/consumer slots/cleanup | 是 | 外部层级映射在Step9闭口 |

回填：正式04 §3沿用此域边界。自检：来源、字段、consumer和禁项一一对应；本域local gate pass_with_upstream_blockers。

### 7.8 collaboration控制面

问题回答：collaboration.maxDirectoryQueryUnits、collaboration.maxVisibleProcessNodes、collaboration.maxVisibleProcessEdges控制search factory/Process renderer/safe topology所需本地装配参数。
诊断：前序只有flat字段，外部层级未定；禁止拓扑截断假完整、显示hidden count/关系。
取舍：采用具名功能域与既有字段一对一；不让此域控制其它owner不变量。

| 域 | 来源 | 允许能力 | 对应03 | P0 | 03影响 |
|---|---|---|---|---|---|
| collaboration | 批准local source，经loader；SDK/host资格独立 | maxDirectoryQueryUnits、maxVisibleProcessNodes、maxVisibleProcessEdges | §5.9/§13及search factory/Process renderer/safe topology | 是 | 外部层级映射在Step9闭口 |

回填：正式04 §3沿用此域边界。自检：来源、字段、consumer和禁项一一对应；本域local gate pass_with_upstream_blockers。

### 7.9 diagnostic控制面

问题回答：diagnostic.mode控制DiagnosticHandoffAdapter所需本地装配参数。
诊断：前序只有flat字段，外部层级未定；禁止自动日志/后台交付或扩展六字段。
取舍：采用具名功能域与既有字段一对一；不让此域控制其它owner不变量。

| 域 | 来源 | 允许能力 | 对应03 | P0 | 03影响 |
|---|---|---|---|---|---|
| diagnostic | 批准local source，经loader；SDK/host资格独立 | diagnosticMode | §5.9/§13及DiagnosticHandoffAdapter | 是 | 外部层级映射在Step9闭口 |

回填：正式04 §3沿用此域边界。自检：来源、字段、consumer和禁项一一对应；本域local gate pass_with_upstream_blockers。

### 7.10 跨控制面审查

八域合计14字段各出现一次；native build批准策略无ordinary覆盖路径；SDK只profile选择不定义协议；intent与diagnostic都不自动retry；resource上限不改变sourceauthority。模块JSON映射仍待Step7/9细化，但不是新增runtime字段。

## 8. 对详细设计的影响判定

| 配置结论 | 是否影响03 | 影响类型 | 03回写位置 | 处理状态 |
|---|---|---|---|---|
| 当前Step仅细化已有配置语义/来源/失败策略 | 否 | 配置语义 | 不适用 | 无回写 |

## 9. 回填草稿

正式04 §3仅回填§7已经收口的配置契约；保留来源链接，不复制讨论问题、停审计划或旧授权记录。Step15承担全文章节来源与总审计。

## 10. 待确认事项

CHAT-UP001～009、WS-UP001～008、CHAT-BASE001、native批准权限与SDK实际profile、生产sizing/兼容测试继续open/blocked；具体影响以当前结构化表为准。未来扩展未纳入当前schema；不以未来trigger阻塞当前已闭合本地契约。

## 11. 自检与下一门禁

来源→类别→来源优先级→profile→配置项→加载/安全/变更/失败→03影响已核对本Step适用部分。无raw secret、私有业务IO、权限提升、command重试后门；下游只承接planned测试方向。当前Step local设计门禁通过；下一步读取项目台账、本flow及Step4 SOP/对应书写规范。无代码、应用测试或commit。
