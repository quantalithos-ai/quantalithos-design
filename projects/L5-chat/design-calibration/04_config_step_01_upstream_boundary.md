# L5-chat 04 · Step 1 确认配置输入边界

## 1. Step状态与开工确认

> done；gate_status：pass_with_upstream_blockers；2026-10-01。本Step已完成本地设计审查，外部blocked，实施not_started。

| 小阶段 | 输出 | 状态 |
|---|---|---|
| A | SOP回答、具体诊断与取舍 | done |
| B | 结构化产物 | done |
| C | 03影响判定、回填、自检 | done |

复杂度判断：本Step为单一边界/矩阵，可在一份独立产物中收口；长表分批写入。

## 2. 本步输入

当前00～03；04配置SOP/书写规范及项目恢复台账；配置SOP Step1和书写规范§5.1；缺正式provider/SDK/host/预算能力继续登记而不补造。

## 3. SOP问题回答

1. 承接Desktop-first、SDK-only、safe展示和未知effect不可重发；配置不改变owner及结果权威。
2. 当前03 §5.9/§13已有14字段、ConfigLoader/LocalConfigSource/ApplicationComposition，native guard两个allowlist；04补来源、限值、profile、格式与失败。
3. 05/06尚未校准；只用03 §15的planned配置/host/CAS/SDK测试切口。
4. 不回答路由/DTO/状态重设计、owner profile、部署命令或实现。
5. 上游exact SDK/Process/关系/目录/host能力缺失阻塞真实绑定；本地配置设计可先确定拒绝与降级规则。

## 4. 当前材料问题诊断

当前正式04尚不存在；03 §13明确把数值、profile与优先级交04。SDK04允许自身env/secret引用不代表Chat也允许；native approved_origins不能从用户JSON自授。

## 5. 改动前后对比

| 位置 | 改前 | 改后 | 依据 |
|---|---|---|---|
| 本Step输入 | 前序仅提供边界/引用，当前主题未闭口 | 独立收口本Step确认配置输入边界 | 当前03与04 SOP |
| 外部正向能力 | 未绑定 | 继续blocked，不由配置授予资格 | CHAT-UP/WS-UP/host |

## 6. 配置设计取舍

采用从03字段与消费位置抽取配置；不复制SDK服务端profile或Governance store/outbox配置。无04旧正文可继承。

## 7. 结构化中间产物

### 7.1 输入与章节映射

| 来源 | 配置输入 | 回填章节 |
|---|---|---|
| 当前00需求 | Desktop/跨端体验、离线恢复、安全与可访问性 | 2/4/6/11 |
| 当前01架构 | SDK-only、truth分域、least authority宿主 | 3/4/8 |
| 当前02概要 | 应用/体验/意图/材料/连续性/本地缓存/平台接缝 | 3/7/9 |
| 当前03 §5.9/§13 | 14字段与ConfigLoader、composition、binding | 5～9 |
| 当前03 §5.11/§9/§11～12 | native白名单、不可配置安全、unknown/CAS/fence | 4/8/10/11 |
| 当前03 §15～17 | planned测试切口、承接与风险 | 12/14 |
| L0-sdk当前04 §5/§8/§14 | SDK自身profile/credential边界，非Chat配置继承 | 5/8/14 |

### 7.2 必须回答与不再回答

必须闭合十四字段、模块JSON映射、profile选择、单一source、required缺项、数值范围/单位、敏感级别、加载冻结/全量拒绝、回滚安全与外部blocked区别。已经确定的技术方案、页面五tab、BPMN拓扑与owner authority不重新选择；没有业务权限/流程参数配置。真实SDK/host资格由对应正式边界提供。

### 7.3 基线门禁

有配置，不能跳Step3～13。生产limits无自动默认；示例与质量验证分开。04可能规范loader外部JSON映射，影响代码契约时先回写03；当前只登记待审议方向，不形成尚未回写的正式结论。

## 8. 对详细设计的影响判定

| 配置结论 | 是否影响03 | 影响类型 | 03回写位置 | 处理状态 |
|---|---|---|---|---|
| 当前Step仅细化已有配置语义/来源/失败策略 | 否 | 配置语义 | 不适用 | 无回写 |

## 9. 回填草稿

正式04 §1仅回填§7已经收口的配置契约；保留来源链接，不复制讨论问题、停审计划或旧授权记录。Step15承担全文章节来源与总审计。

## 10. 待确认事项

CHAT-UP001～009、WS-UP001～008、CHAT-BASE001、native批准权限与SDK实际profile、生产sizing/兼容测试继续open/blocked；具体影响以当前结构化表为准。未来扩展未纳入当前schema；不以未来trigger阻塞当前已闭合本地契约。

## 11. 自检与下一门禁

来源→类别→来源优先级→profile→配置项→加载/安全/变更/失败→03影响已核对本Step适用部分。无raw secret、私有业务IO、权限提升、command重试后门；下游只承接planned测试方向。当前Step local设计门禁通过；下一步读取项目台账、本flow及Step2 SOP/对应书写规范。无代码、应用测试或commit。
