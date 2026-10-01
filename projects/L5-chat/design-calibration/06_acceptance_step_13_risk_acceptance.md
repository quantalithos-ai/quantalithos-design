# L5-chat 06 · Step 13 风险接受与遗留项

## 1. Step状态

> done / pass_with_upstream_blockers；2026-10-01。这里只定义验收规则，所有TC/EV为planned预约，无实际验收结果或签署。

## 2. 本步输入

前序Step12 local gate已通过；06 SOP Step13、书写规范5.13；00实际36AC、03契约、04配置、05TC/EV和证据schema；中间产物§5.10与真相源§7。

## 3. SOP问题回答

哪些可接受、谁负责/接受、动作/截止怎么要求、何处同步？§13处理表与时效规则，每缺口都有约束而无虚假签收。

## 4. 当前文档问题诊断

scope排除、deferred与实际风险接受容易混淆；用无期限或未指定接受人绕过P0未验证。

## 5. 改动前后对比

| 改前 | 改后 | 原因 |
|---|---|---|
| scope排除、deferred与实际风险接受容易混淆；用无期限或未指定接受人绕过P0未验证。 | §7结构化裁决 | 保持正式contract/TC/EV与证据能力一致 |

## 6. 验收裁决取舍与复杂度

当前上游/quality/归档阻塞继续open，只有未来具体非P0问题能按严格结构接受；不填实际姓名/日期。逐项风险处理而非默认waiver。

## 7. 结构化中间产物

### 13.1 风险接受资格

有条件通过的必要前提：全部适用P0 parent/gate与真实层成立、VETO全部actualclear、证据与baseline可信，遗留只非P0。RiskAcceptance（§10）只P1/P2、affects_p0=false，不能表示下面P0blocked已经接受。
每个可接受项必须有实际影响范围/理由、owner/acceptor与授权角色、可回链后续动作、实际deadline和accepted_at；未指定/待确认/null/逾期不支持conditionalpass。产品/技术/安全/发布角色只能在其实际权限scope内接受，不得反写owner权限/业务truth。
当前**没有已接受风险**、姓名或截止日期；只列处理口径。角色名称是待指定责任，不是实际署名。

### 13.2 当前阻塞/遗留处理

| 风险/遗留项 | 影响 | 接受理由/资格 | 后续动作 | 责任角色 | 接受角色 | 截止 |
|---|---|---|---|---|---|---|
| CHAT-UP-001 | SDKpublic/runtime不能正式消费 | P0，不可豁免 | 正式SDK能力/版本/来源绑定与TC-REAL-001 | SDK/技术 | 无接受，解除真实阻塞 | waiting，送验前 |
| CHAT-UP-002 | Conversation页/cursor/visibility/resume | P0，不可豁免 | 合同/coverage资格与formal消费证据 | Conversation/SDK | 无接受 | waiting，送验前 |
| CHAT-UP-003 | Gate/action/result/probe/幂等 | P0，不可豁免 | 正式治理授权/结果与两设备幂等证据 | Governance/SDK/安全 | 无接受 | waiting，送验前 |
| CHAT-UP-004 | Artifactpreview/ref/visibility | P0，不可豁免 | safe descriptor/资格/expiry与formalquery | Artifact/SDK | 无接受 | waiting，送验前 |
| CHAT-UP-005/WS-UP001～008 | Workspace safesummary/export/恢复source | P0，不可豁免 | 正式provider/只读source/版本/coverage | Workspace/SDK | 无接受 | waiting，送验前 |
| CHAT-UP-006 | 各成员/项目/运行摘要隔离 | P0，不可豁免 | Identity/Work/Member/Runtime各safe层资格 | 相应owner/SDK | 无接受 | waiting，送验前 |
| CHAT-UP-007 | 启用诊断sink缺合同 | 未启用按disabled边界验；宣称启用时不可豁免 | defaultdisabledP0验证，启用前正式六字段sink | Observability/SDK | 不接受假启用；只deferred | activation前waiting |
| CHAT-UP-008 | Processwhole/stage/node/forkjoin未绑定 | P0，不可豁免 | 正式Processsafe拓扑/parentversion/变化与SDK | Process/SDK | 无接受 | waiting，送验前 |
| CHAT-UP-009 | bindingowner/directoryprovider与coverage | P0，不可豁免 | 正式关系/人类AI目录/targetaccess/解除资格 | owner/provider/产品 | 无接受 | waiting，送验前 |
| CHAT-BASE-001 | 00§16假AC索引 | current只用36actualAC；不虚构关闭 | 经授权修00再重校准受影响链 | 需求/技术 | 未接受/仍open | 修复授权后指定 |
| native/OS/AT | actualpolicy/签名/OS/AT支持matrix缺失 | 必要P0，不可豁免 | approvedbuild/origin/window/kind+REAL002/003 | 平台/安全/测试 | 无接受 | waiting，送验前 |
| productionquality/budget | 性能/长时资源/兼容无authority/实测 | P0质量批准缺失，不造数值通过 | 05§10.2测量/批准并回校准文档 | 产品/技术/测试 | 无接受 | waiting，release前 |
| source/version/release | SDK/host/pins/build来源未核 | necessarybaseline，不可豁免 | 07实际固定/锁定/验证/来源安全refs | 实施/平台/发布 | 无接受 | waiting，送验前 |
| artifactretention/ACL/budget | realreports安全持有/有限捕获/删除责任未批准 | P0安全归档，不可豁免 | 批准policy+实际检查，失败安全材料保留 | 测试/安全/环境 | 无接受 | waiting，归档前 |
| 无实现/build/run/EV/review | 无可裁决送验 | 不可风险接受为已实现/已验证 | 07获授权后计划实施，真实运行逐阶段 | 实施/测试/审阅 | 无接受 | not_started，无日期 |
| 未激活enhancement/mobile | V1范围不含mobile交付 | 只scope/deferred，不是真实现有风险签收 | activation新baseline/00～07闭环 | 产品 | 将来实际范围批准 | waiting，activation前 |
| 非核心layout/docs/maintenance | 将来具体P1/P2小遗留 | P0/VETO成立且有真实impact与签署才可接受 | 明确issue/action/复验集合并定实际截止 | 对应owner/技术/测试 | 产品+相关实际授权role | 未登记，不能conditionalpass |

### 13.3 时效、同步与撤销

接受deadline必须实际RFC3339时间，action与responsible/acceptor不能为空；日期可由实际评审明确，不按当前日期自动生成期限。逾期未完成或P0影响扩大，原条件放行失效，标expired/reopen→重评估，必要时不通过，不能自动续期。
本表风险/阻塞写入实际open-issues，eligible已接受项进入risk-acceptance与baseline.risks，余项不得被写成affects_p0=false掩盖。07获授权后只映射planned boundary/责任/阻塞，不能把它们当既有实现或acceptedrisk。
任何风险变更更新review_id与inputdigest，使旧signoffs无效；actual签署不等业务审批或生产发布授权。

## 8. 回填草稿

正式06 §13回填本步§7裁决结论/表/schema；过程停审、差异和自检留本文件，不冒充实际结果。

## 9. 待确认事项

CHAT-UP001～009/WS-UP001～008/BASE001/native/OS/AT/生产预算/精确版本/来源/发布/归档继续open/blocked。角色、build、run_id、报告、actualEV、风险接受与签署均waiting；没有当前放行或readiness。

## 10. 自检及下一Step门禁

17类风险/阻塞有处理角色/前置与deadline缺口，无实际riskaccepted，P0/VETO一律不可豁免。 本地规则设计gate pass_with_upstream_blockers；允许Step14先读取台账/flow/当前产物与对应SOP，不创建其它未来Step。
