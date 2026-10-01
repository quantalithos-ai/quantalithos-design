# L5-chat 04 · Step 6 定义环境、部署profile与配置矩阵

## 1. Step状态与开工确认

> done；gate_status：pass_with_upstream_blockers；2026-10-01。本Step已完成本地设计审查，外部blocked，实施not_started。

| 小阶段 | 输出 | 状态 |
|---|---|---|
| A | SOP回答、具体诊断与取舍 | done |
| B | 结构化产物 | done |
| C | 03影响判定、回填、自检 | done |

复杂度判断：本Step为单一边界/矩阵，可在一份独立产物中收口；长表分批写入。

## 2. 本步输入

当前00～03；已通过Step5及相关前序配置域结论；配置SOP Step6和书写规范§5.6；缺正式provider/SDK/host/预算能力继续登记而不补造。

## 3. SOP问题回答

1. local/CI/staging/prod均定义；Web只有预览local/CI，mobile不注册。
2. 各环境读取同一格式批准本地JSON，不读取env；profileId是selector不是runtime新枚举。
3. local/CI允许独立harness fixture；实际应用的正式adapter仍不能fake升级为bound。staging/prod需要真实SDK/host资格。
4. Chat无secret入口，各环境同redaction与memoryOnly=true。
5. Desktop host vs preview、fixture vs real、资源边界与late/revoke必须交测试矩阵。

## 4. 当前材料问题诊断

03只两platformvariant，不能添加native/controlled/fake/mobile字符串成为运行配置。profileId虽为string也要批准catalog，不能按未知值自动选local。

## 5. 改动前后对比

| 位置 | 改前 | 改后 | 依据 |
|---|---|---|---|
| 本Step输入 | 前序仅提供边界/引用，当前主题未闭口 | 独立收口本Step定义环境、部署profile与配置矩阵 | 当前03与04 SOP |
| 外部正向能力 | 未绑定 | 继续blocked，不由配置授予资格 | CHAT-UP/WS-UP/host |

## 6. 配置设计取舍

采用六个批准profile别名和三类成熟度边界；不增加adapterMode/env字段。生产端配置可以格式合法但因资格未绑定保持blocked。

## 7. 结构化中间产物

### 7.1 环境与profile catalog

LocalConfigInput.profileId只允许下列catalog；未配置默认profile，composition/source必须明确选择。catalog是来源身份，不进入ClientConfig新字段。配置值的引用由正式registry确认，不能靠同名或前缀推断bound。

| 环境/profileId | 用途 | platform | 来源 | 外部依赖 | 敏感处理/差异 |
|---|---|---|---|---|---|
| local / desktop-local | Desktop开发/安全blocked面 | desktop | 批准local source | SDK/host未qualify保持blocked；harness fixture隔离 | memoryOnly/disabled；不能验收真实接入 |
| CI / desktop-ci | TS/组件及native边界验证输入 | desktop | 同格式不可变fixture | native实际OS行为未验证则blocked；fake只test harness | 无真实actor/credential，不称业务通过 |
| staging / desktop-staging | 正式owner/SDK跨端集成 | desktop | 已评审staging配置 | 精确SDK/host/profile版本+正式服务 | 未闭合前blocked；禁止fixture替代 |
| prod / desktop-prod | 正式桌面分发/运行 | desktop | 批准release配置 | 同上+签名/平台兼容/资源budget批准 | 无生产推荐确值；禁止未知权限默认 |
| local / web-preview-local | 共享React展示预览 | web_preview | 批准preview输入 | SDK正式或独立harness；无native | hostProfileRef=null；无controlled open/storage |
| CI / web-preview-ci | 浏览器组件/AT逻辑切口 | web_preview | 隔离fixture输入 | 浏览器能力与正式SDK独立 | 不能代替Desktop宿主测试 |

### 7.2 必须一致和允许差异

| 项 | 全环境硬一致 | 允许差异 |
|---|---|---|
| schema/14字段/8域 | 同一schemaVersion=1/严格parser | 只批准profileId与ref/requiredlimits |
| owner/authority/fence/unknown | 不变，不自动retry | SDK正式能力缺失姿态 |
| memoryOnly/diagnostic | true；默认disabled；六字段allowlist | formal_low_sensitivity需真实sink，非fixture许可 |
| platform/host | desktop非空hostref；preview必须null | native当前OS能力/批准policy不同 |
| 资源/图/list | 同单位和绝对上限，不truncate假完整 | 显式有界数值；不同值必须评审 |
| maturity | 本地fixture不是integration事实 | 05区分unit/component/native/integration证据 |

### 7.3 包与宿主版本承接

React/TS/Vite/npm/Tauri2版本方向已由03确定；准确patch pin、npm/Cargo lock以及SDK public export/dist兼容必须07实际生成并经05验证，当前没有已验证pin。SDK 0.1.0仅现存package事实；所有未验证组合阻塞真实绑定，禁止依赖latest或私有src深链补方法。Windows/macOS/Linux不同目标逐项验证可信origin、权限与AT，不能把一个OS结果推广其它目标。

## 8. 对详细设计的影响判定

| 配置结论 | 是否影响03 | 影响类型 | 03回写位置 | 处理状态 |
|---|---|---|---|---|
| 当前Step仅细化已有配置语义/来源/失败策略 | 否 | 配置语义 | 不适用 | 无回写 |

## 9. 回填草稿

正式04 §6仅回填§7已经收口的配置契约；保留来源链接，不复制讨论问题、停审计划或旧授权记录。Step15承担全文章节来源与总审计。

## 10. 待确认事项

CHAT-UP001～009、WS-UP001～008、CHAT-BASE001、native批准权限与SDK实际profile、生产sizing/兼容测试继续open/blocked；具体影响以当前结构化表为准。未来扩展未纳入当前schema；不以未来trigger阻塞当前已闭合本地契约。

## 11. 自检与下一门禁

来源→类别→来源优先级→profile→配置项→加载/安全/变更/失败→03影响已核对本Step适用部分。无raw secret、私有业务IO、权限提升、command重试后门；下游只承接planned测试方向。当前Step local设计门禁通过；下一步读取项目台账、本flow及Step7 SOP/对应书写规范。无代码、应用测试或commit。
