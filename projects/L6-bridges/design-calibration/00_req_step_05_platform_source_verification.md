# 00 Step 5 附录：四平台来源与 adapter 需求语义核验

> 核验日期：2026-10-02；当前agent串行只读检索。
> 资格：public-source-verification，不是平台账户、安装、scope、SDKpin、运行或投递证据。
> 上级：`00_req_step_05_users_roles.md`；后续消费：Step6/7/9~15。

## 1. 来源登记

文档和源码URL指向可变current/main/master。本轮记录访问日期，不将其当成选定版本或不可变生产contract；后续01/03/04必须按部署版本重核。只摘录协议事实，不留示例token、完整HTTP正文或平台消息。

| 来源ID | 官方公开来源 | 本轮状态 / 已读主题 |
|---|---|---|
| PS-01 | https://docs.slack.dev/authentication/verifying-requests-from-slack/ | read：签名、raw body、timestamp、constant-time compare、SDK支持说明 |
| PS-02 | https://docs.slack.dev/apis/events-api/ | read：event_id、installation authorizations、scope、2xx时限、重试与best-effort |
| PS-03 | https://docs.slack.dev/apis/web-api/rate-limits/ | read：method/workspace/app与channel约束、429/Retry-After、history/replies发行类别差异 |
| PS-04 | https://docs.slack.dev/authentication/installing-with-oauth/ | read：bot/user scope、安装与code exchange、撤销、rotation分支；不选择具体flow/provider |
| PS-05 | https://developers.mattermost.com/integrate/plugins/interactive-messages/ | read：当前Blocks建议、legacy兼容、server回调context与认证说明 |
| PS-06 | https://developers.mattermost.com/integrate/reference/personal-access-token/ | read：部署启用/账户权限、最小权限建议、撤销/停用 |
| PS-07 | https://core.telegram.org/bots/api | unavailable：获准读取仍25秒连接超时；保留待核验，不声称全文已读 |
| PS-08 | https://raw.githubusercontent.com/tdlib/telegram-bot-api/master/telegram-bot-api/Client.cpp | read_selected_source：getUpdates/setWebhook互斥、offset参数、callback/edit/delete方法、thread字段、retry_after处理 |
| PS-09 | https://raw.githubusercontent.com/tdlib/telegram-bot-api/master/telegram-bot-api/WebhookActor.cpp | read_selected_source：X-Telegram-Bot-Api-Secret-Token由secret_token生成 |
| PS-10 | https://raw.githubusercontent.com/discord/discord-api-docs/main/developers/interactions/overview.mdx | read_selected_sections：每次HTTP交互验证Ed25519签名/时间戳，失败401 |
| PS-11 | https://raw.githubusercontent.com/discord/discord-api-docs/main/developers/interactions/receiving-and-responding.mdx | read_selected_sections：Gateway/HTTP两种交互入口互斥，初始3秒响应、follow-up token15分钟 |
| PS-12 | https://raw.githubusercontent.com/discord/discord-api-docs/main/developers/events/gateway.mdx | read_selected_sections：session_id、s、resume_gateway_url、Invalid Session、privileged intent |
| PS-13 | https://raw.githubusercontent.com/discord/discord-api-docs/main/developers/topics/rate-limits.mdx | read_selected_sections：bucket+major resource、global、429与retry_after，不硬编码配额 |
| PS-14 | https://raw.githubusercontent.com/discord/discord-api-docs/main/developers/topics/oauth2.mdx | read_selected_sections：安装context、bot/commands scope、state/CSRF、token撤销 |

路径/连接审计：普通网络Slack DNS失败后获准读取成功；Mattermost旧`docs.mattermost.com/integrations-guide/personal-access-tokens.html`返回404后转官方开发者路径成功；Discord旧`docs/interactions/...`返回404，经官方GitHub tree定位新路径；Discord限流/Gateway首次连接重置，重试成功。没有将失败请求算作事实核验通过。

## 2. 分平台核验结论与非推论

| 平台 | 已读取事实 | 本仓需求约束 | 不得推论 |
|---|---|---|---|
| Slack | HMAC-SHA256基于原始body与timestamp；event_id唯一；Events需3秒内2xx；有重试和scope视角 | 原始body仅瞬时验签；transport ACK单列；retry不创建新业务操作；安装与内部授权双重校验 | Slack workspace不是内部Workspace；event_ts/ts不是全局commit cursor；2xx不是内部提交 |
| Mattermost | 回调包含user/post/channel/team与context；当前文档推荐Blocks；context可携带认证token；PAT受部署和账号权限控制 | 未经验证的context不能当权限；server instance与安装版本隔离；callbacksecret只在private seam；legacy/Blocks按能力版本核验 | 不假设Slack签名头存在；新文档不证明已部署实例支持Blocks；PAT不等于内部actor授权 |
| Telegram | 官方源码有polling/webhook互斥、offset、webhooksecret header、callback及edit/delete方法、forum thread字段 | 每bot安装隔离更新；polling与webhook仅一种有效入口；callbackACK不代表Decision；cloudAPI配额/留存/文件TTL待官网复核 | 不把源码master当云服务固定版本；不承诺普通消息删除通知完整、无限回放或所有chat都支持forum topic |
| Discord | HTTP交互验签；Gateway/HTTP交互互斥；响应期限；Gateway session+sequence用于resume；intent与scope分别限制能力 | 交互token视为secret；session cursor不能跨session比较；resumable=false记gap；消息读取受intent和权限限制 | signed callback不是内部授权；Snowflake不作为跨流watermark；ACK/heartbeat不是内部commit或送达 |

## 3. 对象与 mapping 语义下限

以下为需求必须表达的语义维度，不是已经选定的DTO/数据库schema。API字段 spelling、可选性和编码必须在具体adapter合同按pin重新核验；无法证明来源维度就blocked，不从显示名称或字符串解析补齐。

| 对象 | mandatory semantic dimensions | 权威来源与失败 |
|---|---|---|
| adapter configuration | platform kind、server/region环境、installation scope、capability/schema revision、enabled方向、route policy、opaque secret ref/version | 管理配置和provider binding；不明版本/目标/secret不可激活 |
| external-binding relation | installation namespace、external subject/location、internal typed target、显式授权basis/ref/version、allowed direction/action、有效期与撤销generation | owning authorization chain；平台安装不是binding basis |
| identity mapping | external account定位、主体种类human/AI/integration、内部正式actor或AI member安全引用、mapping generation/basis | Identity仅AI身份锚点；human认证/责任链未知拒绝，不建GlobalMember |
| location mapping | platform installation、channel/chat/DM位置、thread/topic关系、内部Conversation或scope ref、授权binding generation | 平台位置与内部owner各自确认；Workspace投影不能反推授权 |
| message mapping | external message locator、create/edit/delete语义、source ref/version、内部accepted fact/manifestation ref、binding generation、方向及来源标记 | 平台/内部source各自权威；找不到原始mapping不得编辑其他消息 |
| cursor/dedup | source namespace、session/epoch、opaque position及正式comparator、处理disposition、operation identity、immutable result ref | 无comparator不比较；相同ID不同语义为conflict，不覆写 |
| delivery intent/attempt/receipt | committed source ref/version、target/binding generation、allowed projection ref/version、operation kind、stable logical effect identity、attempt identity、known result category、opaque external locator | 本仓局部effects；不保存消息body或伪造delivered |

定位范围最低要求：Slack以installation/workspace与channel/message/thread定位；Mattermost以server instance/team/channel/post及root关系定位；Telegram以bot安装/chat/message及可选topic定位；Discord以application安装/guild或DM/channel/message及thread channel定位。仅有external_id不足以唯一定位，不跨平台或租户复用。平台opaque ID不转成GlobalMember、scope或权限。

## 4. 三条协议链与结果分离

| 链路 | 必须输入 | 必须输出 | 失败语义 |
|---|---|---|---|
| inbound | 验证过的平台来源、binding/mapping版本、source operation identity、授权及允许材料ref、明确内部target mode | transport ACK outcome、owner handoff outcome、accepted ref或明确拒绝/未知、局部disposition | 无授权/材料源拒绝；冲突隔离；内部结果未知不重建新提交 |
| outbound | 已提交且允许外显的source ref/version、binding target快照、safe projection ref、stable effect identity | attempt、platform accepted/known rejection/indeterminate、external locator映射、限流/恢复原因 | 不能因内部已提交直接标外部送达；超时不假定失败后盲发 |
| callback | 验证过的入口、interaction/source message映射、actor责任链、bound action、时效/one-use依据、当前owner状态 | transport response与owner command/result分别记录；可选新outbound intent | expired/tampered/replayed/cross-target拒绝；Gate未知不放行 |

Conversation正式03已有bridge输入的AppendFact/ManifestExternalFact分支和Integration source actor约束。这里只承接语义，不另外定义泛用“提交Turn”方法。平台原始正文不得成为Bridges durable truth；安全材料owner/ref不能由该输入合同推定，仍BR-UP-001/004。

## 5. 可靠性、secret、测试与证据下限

| 边界 | 必须满足 |
|---|---|
| 幂等 | inbound/callback/outbound/recovery分别namespace；相同operation复用结果，冲突隔离；attempt不等于新effect |
| cursor | 接收位置、业务处理位置、投递位置分开；ACK可先于内部提交，但只能有明确可恢复的安全接管或显式受控丢弃记录；不越过未解决gap冒称complete |
| 顺序 | 只承诺已定义mapping lane内的顺序；edit/delete依赖已确认create locator，不做全平台总序 |
| 限流 | Slack method/workspace/channel；Mattermost按实例部署核验；Telegram重核cloud contract与retry_after；Discord bucket/major resource/global；不得共享一个全球速率常量 |
| retry/unknown | 可证明未产生副作用的retryable失败才自动重试；未知走权威probe/同effect查询或人工对账；无平台幂等/probe能力保持indeterminate |
| secret | OAuth安装/refresh、PAT/API key、bot token、webhooksecret、interaction token、签名材料仅opaque ref/版本；raw值只在private seam，绝不日志/证据/URL回显 |
| 选型 | SDK包装、直接API、plugin、HTTP/Gateway入口均未定案；KMS/provider与路由产品未选择，缺binding保持waiting |
| 测试切口 | 平台认证、跨tenant mapping、ACK/commit分离、重复/冲突、callback过期、429、未知发送、session gap、附件过期、编辑删除权限、body/secret泄漏反例 |
| 证据 | 只允许安全ref、版本、operation/attempt类别、有限reason、cursor/gap摘要及handoff ref；不得留原始消息、下载URL中的token、敏感Gate或凭证 |

此附录自检：来源获取状态、事实与需求约束分别可查；未承诺四平台等价、SDK/provider就绪或已运行。正式00只在对应章节摘录需求结论，官方事实仍按版本核验。
