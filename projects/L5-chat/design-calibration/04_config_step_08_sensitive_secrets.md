# L5-chat 04 · Step 8 定义敏感配置与密钥管理

## 1. Step状态与开工确认

> done；gate_status：pass_with_upstream_blockers；2026-10-01。本Step已完成本地设计审查，外部blocked，实施not_started。

| 小阶段 | 输出 | 状态 |
|---|---|---|
| A | SOP回答、具体诊断与取舍 | done |
| B | 八配置域逐个结构化/停审 | done |
| C | 03影响判定、回填、自检 | done |

复杂度判断：需按配置域串行分批，每域回答/诊断/取舍/结构/回填/自检，完成才进入下一域；不建额外附录。

## 2. 本步输入

当前00～03；已通过Step7及相关前序配置域结论；配置SOP Step8和书写规范§5.8；缺正式provider/SDK/host/预算能力继续登记而不补造。

## 3. SOP问题回答

1. 十四项均internal，sdk/host alias仅非敏感标识；含secret/token/路径/endpoint的ref非法。真实credential/cert/privatekey属于SDK/OS。
2. Chat不得存取raw secret，也不把secret provider配置纳入JSON。
3. SDK凭据轮换由正式SDK边界，新sessionepoch失效旧slice；profile引用变更需新composition。
4. 配置变更审计属于release/change管理，不增加Chat AuditPort或automatic logs。
5. 错误只code，支持交付仍六字段；配置值/源文件/raw key与stack不进UI/报告。
6～8. 按现有项及外部secret边界审查存储/读取/轮换/输出；与Step5/9/10闭环。

## 4. 当前材料问题诊断

SDK04有sensitive refs，但Chat只有非敏感sdkProfileRef不是credentialRef。若把hostProfile解析失败原消息透传，会泄露nativeorigin/path；必须安全码输出。

## 5. 改动前后对比

| 位置 | 改前 | 改后 | 依据 |
|---|---|---|---|
| 本Step输入 | 前序仅提供边界/引用，当前主题未闭口 | 独立收口本Step定义敏感配置与密钥管理 | 当前03与04 SOP |
| 外部正向能力 | 未绑定 | 继续blocked，不由配置授予资格 | CHAT-UP/WS-UP/host |

## 6. 配置设计取舍

采用普通非敏感alias+SDK独立secret管理；不添加secretRef/KMS产品字段。无真实secret项，仍完整记录外部轮换与失败切口。

## 7. 结构化中间产物

### 7.1 敏感边界

| 项 | 敏感级别 | 存储/读取边界 | 明文 | 轮换 | 审计 |
|---|---|---|---|---|---|
| sdk.profileRef | internal，必须非敏感alias | 批准JSON→immutableconfig；SDK正式解析，不传UI | alias可存在JSON，禁止日志/诊断导出 | ref变更新composition；SDKcredential轮换按正式SDK | release评审仅记录字段名/受控版本，不导出ref |
| platform.hostProfileRef | internal，必须非敏感alias | 批准JSON；nativebuild批准policy另管理 | 不含origin/windowtitle/path/secret | build policy/release变更需native审核/重启 | native安全评审，不由Chat写backend审计 |
| 其余literal/数值 | internal | 本地配置/必要typed deps | 可进入批准JSON，错误不复述原值 | 新composition，性能/安全评审 | Step10变更元信息，非运行自动日志 |
| 真实token/password/privatekey/cert secret | secret，非Chat配置项 | SDK/OS受控provider，禁止进入Chat store/draft/locator | 否 | 由SDK/OS正式机制；session改变失效旧epoch | owner/SDK审计，Chat不证明轮换成功 |
| future credentialRef/secretRef/provider | sensitive / design-change-required | 当前schema未知键拒绝 | 不纳入普通JSON | 先SDK/03/04设计审议 | 未纳入当前active结论 |

### 7.2 敏感配置读取图: SDK秘密材料与Chat分域

```text
[Chat approved non-secret profile alias] -> [SDK public binding qualification]
                                            ^
[SDK/OS controlled credential provider] -----|  [no material crosses into Chat]
[Chat support request] -> [six-field DiagnosticContext only]
```

关键说明：
- Chat没有secret读取port、credential缓存或keychain原生执行能力。
- SDK缺正式provider/profile资格时blocked，不用fixture或环境token兜底。
- 六字段diagnostic不增profile/ref/raw配置值，且默认disabled。

### 7.3 输出最小边界

| surface | 禁止 | 允许 |
|---|---|---|
| UI配置失败面 | rawJSON/key/value、路径、origin、endpoint/secret、stack | invalid_input/dependency_unbound及有限本地化消息 |
| 支持交付 | profileId/profileRef/fieldValues、token/ownerrefs | 既有六字段DiagnosticContext，只显式userRequested |
| logs/metrics/backend audit | 所有自动配置导出/transport | 当前无输出能力；blocked |
| 未来artifact/report | 原config全文、credential、raw错误 | 05定义脱敏配置身份/有限结果码，非当前新schema |
| release评审记录 | rawsecret/真实ref/provider返回体 | 受控版本/变更字段/理由/批准与回滚指针，留管理流程 |

### app敏感性小循环

问题回答：本域app.schemaVersion、app.platform只有internal配置；无secret/provider读取。
诊断：内部配置不等可发日志，错误回显可能包含用户注入内容。
取舍：严格拒额外键/非法类型；只code安全反馈，不留原始失败JSON。存储仅批准source与必要immutable参数，轮换/变更按新composition。
结构化结论：Step7同名字段敏感级别不变；读取Step9唯一loader、审计Step10外部release流程、失败Step11，diagnostic仍六字段。
回填：§8上表。自检：无rawsecret、日志、错误或report泄露路径；本域local gate通过。

### sdk敏感性小循环

问题回答：本域sdk.profileRef只有internal配置；alias必须满足非敏感格式且解析不泄露authority材料。
诊断：内部配置不等可发日志，错误回显可能包含用户注入内容。
取舍：严格拒额外键/非法类型；只code安全反馈，不留原始失败JSON。存储仅批准source与必要immutable参数，轮换/变更按新composition。
结构化结论：Step7同名字段敏感级别不变；读取Step9唯一loader、审计Step10外部release流程、失败Step11，diagnostic仍六字段。
回填：§8上表。自检：无rawsecret、日志、错误或report泄露路径；本域local gate通过。

### platform敏感性小循环

问题回答：本域platform.hostProfileRef只有internal配置；alias必须满足非敏感格式且解析不泄露authority材料。
诊断：内部配置不等可发日志，错误回显可能包含用户注入内容。
取舍：严格拒额外键/非法类型；只code安全反馈，不留原始失败JSON。存储仅批准source与必要immutable参数，轮换/变更按新composition。
结构化结论：Step7同名字段敏感级别不变；读取Step9唯一loader、审计Step10外部release流程、失败Step11，diagnostic仍六字段。
回填：§8上表。自检：无rawsecret、日志、错误或report泄露路径；本域local gate通过。

### intents敏感性小循环

问题回答：本域intents.maxTextUnits、intents.maxAttachmentRefs只有internal配置；无secret/provider读取。
诊断：内部配置不等可发日志，错误回显可能包含用户注入内容。
取舍：严格拒额外键/非法类型；只code安全反馈，不留原始失败JSON。存储仅批准source与必要immutable参数，轮换/变更按新composition。
结构化结论：Step7同名字段敏感级别不变；读取Step9唯一loader、审计Step10外部release流程、失败Step11，diagnostic仍六字段。
回填：§8上表。自检：无rawsecret、日志、错误或report泄露路径；本域local gate通过。

### local_state敏感性小循环

问题回答：本域local_state.maxCachedEntries、local_state.memoryOnly只有internal配置；无secret/provider读取。
诊断：内部配置不等可发日志，错误回显可能包含用户注入内容。
取舍：严格拒额外键/非法类型；只code安全反馈，不留原始失败JSON。存储仅批准source与必要immutable参数，轮换/变更按新composition。
结构化结论：Step7同名字段敏感级别不变；读取Step9唯一loader、审计Step10外部release流程、失败Step11，diagnostic仍六字段。
回填：§8上表。自检：无rawsecret、日志、错误或report泄露路径；本域local gate通过。

### continuity敏感性小循环

问题回答：本域continuity.maxConsumedChanges、continuity.maxConsumptionContexts只有internal配置；无secret/provider读取。
诊断：内部配置不等可发日志，错误回显可能包含用户注入内容。
取舍：严格拒额外键/非法类型；只code安全反馈，不留原始失败JSON。存储仅批准source与必要immutable参数，轮换/变更按新composition。
结构化结论：Step7同名字段敏感级别不变；读取Step9唯一loader、审计Step10外部release流程、失败Step11，diagnostic仍六字段。
回填：§8上表。自检：无rawsecret、日志、错误或report泄露路径；本域local gate通过。

### collaboration敏感性小循环

问题回答：本域collaboration.maxDirectoryQueryUnits、collaboration.maxVisibleProcessNodes、collaboration.maxVisibleProcessEdges只有internal配置；无secret/provider读取。
诊断：内部配置不等可发日志，错误回显可能包含用户注入内容。
取舍：严格拒额外键/非法类型；只code安全反馈，不留原始失败JSON。存储仅批准source与必要immutable参数，轮换/变更按新composition。
结构化结论：Step7同名字段敏感级别不变；读取Step9唯一loader、审计Step10外部release流程、失败Step11，diagnostic仍六字段。
回填：§8上表。自检：无rawsecret、日志、错误或report泄露路径；本域local gate通过。

### diagnostic敏感性小循环

问题回答：本域diagnostic.mode只有internal配置；无secret/provider读取。
诊断：内部配置不等可发日志，错误回显可能包含用户注入内容。
取舍：严格拒额外键/非法类型；只code安全反馈，不留原始失败JSON。存储仅批准source与必要immutable参数，轮换/变更按新composition。
结构化结论：Step7同名字段敏感级别不变；读取Step9唯一loader、审计Step10外部release流程、失败Step11，diagnostic仍六字段。
回填：§8上表。自检：无rawsecret、日志、错误或report泄露路径；本域local gate通过。

跨敏感性审查：无14字段被误归secret；外部provider/轮换不假装Chat能力，diagnostic不扩字段；未知键与非法ref均fail-fast。SDK安全资格不足仅blocked，不变成普通输入默认。

## 8. 对详细设计的影响判定

| 配置结论 | 是否影响03 | 影响类型 | 03回写位置 | 处理状态 |
|---|---|---|---|---|
| 当前Step仅细化已有配置语义/来源/失败策略 | 否 | 配置语义 | 不适用 | 无回写 |

## 9. 回填草稿

正式04 §8仅回填§7已经收口的配置契约；保留来源链接，不复制讨论问题、停审计划或旧授权记录。Step15承担全文章节来源与总审计。

## 10. 待确认事项

CHAT-UP001～009、WS-UP001～008、CHAT-BASE001、native批准权限与SDK实际profile、生产sizing/兼容测试继续open/blocked；具体影响以当前结构化表为准。未来扩展未纳入当前schema；不以未来trigger阻塞当前已闭合本地契约。

## 11. 自检与下一门禁

来源→类别→来源优先级→profile→配置项→加载/安全/变更/失败→03影响已核对本Step适用部分。无raw secret、私有业务IO、权限提升、command重试后门；下游只承接planned测试方向。当前Step local设计门禁通过；下一步读取项目台账、本flow及Step9 SOP/对应书写规范。无代码、应用测试或commit。
