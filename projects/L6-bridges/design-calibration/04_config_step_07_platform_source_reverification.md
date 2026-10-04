# L6-bridges 04 Step7 附录：平台公开来源再核验

日期2026-10-04；当前agent串行只读访问，研究完成后才继续配置写入。公开文档不是实际SDK/账号/安装/secret/投递或运行证据。

## 1. 来源登记

| ID | 请求URL | 访问状态 | 精确使用/限制 |
|---|---|---|---|
| BR-CFG-PS-001 | https://docs.slack.dev/apis/events-api/ | read_selected_public_sections | event_id/authorizations、3秒超时重试和重复投递；验证private来源与ACK，不能当Turn提交或重试授权 |
| BR-CFG-PS-002 | https://docs.slack.dev/authentication/verifying-requests-from-slack/ | read_selected_public_sections | 原请求payload、HMAC签名/timestamp与示例五分钟防重放；窗口依实际能力/current，不开放ignore_signature |
| BR-CFG-PS-003 | https://docs.slack.dev/apis/web-api/rate-limits/ | read_selected_public_sections | per-method/workspace/app与channel、429 Retry-After、history/replies发行差异；不硬编码单一配额 |
| BR-CFG-PS-004 | https://docs.slack.dev/authentication/installing-with-oauth/ | unavailable | 本轮访问失败；沿00 PS04已登记语义，仅待核验安装scope/rotation/state，不能说本轮全文重读 |
| BR-CFG-PS-005 | https://developers.mattermost.com/integrate/plugins/interactive-messages/ | read_selected_public_sections | 官方新URL重定向、Blocks推荐/legacy integration context；context内容不是内部action authority |
| BR-CFG-PS-006 | https://developers.mattermost.com/integrate/reference/personal-access-token/ | read_selected_public_sections | PAT部署开关/账户permission及撤销/停用；PAT不是内部actor/Gate授权，无默认admin或API Key fallback |
| BR-CFG-PS-007 | https://core.telegram.org/bots/api | unavailable | 本轮仍unavailable；00 PS07原状态不关闭；PS08/09只master源码选段，不能给cloud版本/窗口资格 |
| BR-CFG-PS-008 | https://raw.githubusercontent.com/discord/discord-api-docs/main/developers/interactions/overview.mdx | read_selected_public_sections | HTTP Ed25519与timestamp验证、验签失败401；public key不等secret，但installation绑定仍须当前核验 |
| BR-CFG-PS-009 | https://raw.githubusercontent.com/discord/discord-api-docs/main/developers/interactions/receiving-and-responding.mdx | read_selected_public_sections | 初始响应3秒、followup token15分钟仅本次协议用途；ACK仍独立；首次关键词mutually exclusive命中options字段，不拿该片段证明transport互斥 |
| BR-CFG-PS-010 | https://raw.githubusercontent.com/discord/discord-api-docs/main/developers/topics/rate-limits.mdx | unavailable | 本轮unavailable；沿00 PS13具名bucket/major-resource/global与retry_after要求，不硬编码配额 |
| BR-CFG-PS-011 | https://raw.githubusercontent.com/discord/discord-api-docs/main/developers/topics/oauth2.mdx | read_selected_public_sections | state/CSRF、scope需approval、revocation/content type；没有OAuth产品选型/安装成功声明 |

成功的Mattermost请求重定向至`https://docs.mattermost.com/developers/integrate/plugins/interactive-messages`和`https://docs.mattermost.com/developers/integrate/reference/personal-access-token`；这是官方公开资料location，不是部署route授权。本轮不安装SDK、不调用平台业务API/OAuth exchange、不访问任何真实账号或token。

## 2. 只读资料快照摘要

hash只标注实际取得的公开doc字节，以便复核版本漂移；不是artifact/evidence、code commit或测试run。可变main/master/current公开资料不得冒充生产pin。

| 来源ID | 实際字节数 | 公开资料SHA-256 / 失败 |
|---|---|---|
| BR-CFG-PS-001 | 155384 | 9f2a9113fa2e8b11c445ba12908519b6373d308a8d44d2e07f6629b482b7a3c4 |
| BR-CFG-PS-002 | 65062 | 73998caa019bde1d71d4dabdda421e3ef430a6a66f80183459f4ed8419b4844b |
| BR-CFG-PS-003 | 56394 | dc19afc198afb353ba3b3bd3b61978cc1beba4bb39fde14f9f9a38f927136b08 |
| BR-CFG-PS-004 | 未取得 | unavailable；URLError |
| BR-CFG-PS-005 | 129317 | 5dec323b740202e7a2582273111322017e5e32e9aaeeda912e20b3aefc7c6e94 |
| BR-CFG-PS-006 | 34860 | 78bdb9c1e20fe9cf7eb812bb98c765e68e8cf8a29c01c71aa9bfedbf4633f8ad |
| BR-CFG-PS-007 | 未取得 | unavailable；URLError |
| BR-CFG-PS-008 | 11566 | 9fe52a34bde4a9d7e409a76ed08a4e5d5202f71a50a2b118b9fc41829e2acfce |
| BR-CFG-PS-009 | 59589 | f9c9efe2d882830ae14649f22ee1e33a156ac789eeba5174ca9fb72d34c99a13 |
| BR-CFG-PS-010 | 未取得 | unavailable；URLError |
| BR-CFG-PS-011 | 41391 | c1ad4fe2ee08895034185dd5b52c93f775b6745c634aae9e0218455affc5c57b |

## 3. Adapter/config/secret产品seam重判

| seam | 已核边界 | product/pin/install当前状态 | 释放所需材料 |
|---|---|---|---|
| 四Platform SDK或API wrapper | 03十二driver method/lease/ACK/known-unknown/rate、关闭隐式retry/logging/redirect、scoped Future与private存活 | not_selected / not_established | 具体产品版本/features/依赖闭包与安装逐method/scope/probe/comparator兼容 |
| SDK客户端 | core真实export/path已读；SDK实际manifest传递Application/Domain/Infra/Bus，不能默认轻client | conditionally_not_selected | 真实pin/exports/传递闭包与no-write/error/private/retry契约 |
| OAuth/PAT/API Key | 安装grant/scope/revoke与内部授权分离；本轮无OAuth接纳产品/回调路由 | not_selected / not_established | provider负责state/CSRF（适用）/code exchange/expiry/rotation/revoke/private持有和scope，无rawcode日志 |
| Secret resolver/KMS | 03 exact provider/key/revision/purpose/scope/window与route，private错误清洗/复制销毁/权限 | not_selected / not_established | 具名产品/pin、KMS decrypt资格、私有生命周期、撤销查询及driver无复制/Debug；KMS不自动等全套secret管理 |
| Router/HTTP/socket/poll/Gateway | 固定受权route、TLS/SSRF/proxy/redirect、source family排他、ACK期限、raw预算 | not_selected / not_established | actualhost注册/endpoint授权与公私网策略；docs重定向不能授权网络重定向 |
| DB/Bus/executor/clock/material | 03同driverwhole commit/probe、正式producer transport、scoped Future、同域clock/private short lease | not_selected / not_established | 具名产品/pin及分支全部能力/secret/route/current注册 |

任何产品如不能禁止hidden retry、raw日志/debug/error-source/private复制/detached task，binding不合格而非“degraded可用”。Webhook-only/incoming webhook不能填满platform source/owner/probe需求。代码产品选择与实际installation/branch资格是两个门禁。

## 4. 过程记录与来源限制

首次curl head-only访问Slack验签URL返回200，仅证明可访问，不登记为正文阅读。后续sandbox DNS失败按权限规则立即require_escalated重试；HTML用标准HTMLParser选取正文文本，源码mdx取选段，未用简单strip-tag代替解析。Python只做串行公开网络读取/HTML解析/摘要，无文件读写、没有运行项目测试。

两次单URL与一个九URL串行研究均已实际结束，没有遗留exec session。一次存储undefined session_id失败只发生在资料成功记录后，未造成文档或产品变化；没有把空字节摘要/关键词未命中当成功读取。少数URLError已如实登记unavailable，不猜cloud或版本细节。

本轮刷新不改00/01/03历史PS登记，BR-UP007/008仍open；Telegram官网服务合同仍未建立，Discord transport排他沿03正式已确认规则，不拿本轮错位关键词当新依据。
