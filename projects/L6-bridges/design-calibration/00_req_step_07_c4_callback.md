# C-BR-4：受控交互责任成立

> 00 Step7当前单元；design_self_review=pass；C3已停审；非用户/owner signoff。

## 1. 来源与职责

C1/C3、Governance00 §10/12、Conversation正式输入边界、PS-01/05/09/10/11/14。只拥有callback验证/重放与交接结果，不拥有Approval/Gate/Decision。回调认证、内部主体认证、当前授权三者必须分别成立。

## 2. 问题、诊断与取舍

按钮必须指向同一bound action、target和当前actor责任。历史把signed callback或低敏感分类视为批准资格；采用owner二次核验与单次语义约束，不采用按钮本地改Gate、reaction直接批准或HTTP200证明Decision。

## 3. 故事目标与能力主题

审批者需要被允许的外部动作可追溯且过期/重复不会误批准；参与者需要伪造、跨用户或旧按钮不能成为自己的操作。主题：平台回调验证与绑定、正式owner动作交接及结果分离。

## 4. 输入、输出、状态与数据

输入：platform verified interaction、installation/binding generation、source message/intent relation、one-use interaction/action identity、expected owner target/version、当前actor/action/Policy/Gate依据、expiry。输出：invalid/expired/replayed/blocked或owner-handoff及accepted/rejected/pending/indeterminate、安全结果ref；transport/deferred response单列。

动作payload必须绑定安装、用户责任、来源消息、目标、动作种类与有效期，不能信任客户端回传的gate id/role/context。tampered、跨tenant、跨target、撤销、过期或owner状态变化先拒绝；有效action才交接owner。相同interaction重复不产生第二次owner效果，既有结果必须按当前读取资格做安全摘要，撤销后不回显敏感旧结果。owner command outcome未知保持unknown，同identity对账而非新command重交。

签名secret/interaction token、response_url和私有context只在adapter/private seam；tokenized URL不能落日志/证据或作为普通可分享ref。延期响应仅在平台明确允许的协议中使用，不能续长平台token期限；超时/过期只能报告协议结果，不能伪造内部批准。Mattermost回调要具体server信任认证，Telegramsecret header不提供人类授权，Discord入口二选一，Slack签名不授Gate权限。

## 5. 接口与失败

能力面是已验证交互输入、owning command交接与结果消费；不能直接调用Runtime/Tools。低敏感外部动作必须有明确外显+action合同；完整敏感审批回受控入口，入口未建立不得借Chat草案补路由。相同action安全response不等于Decision已提交；缺owner结果query/幂等能力则blocked/indeterminate。

## 6. 质量与验收语义

切口：伪造签名、过期interaction、context篡改、binding撤销、跨user/target、owner状态变更、重复按钮、deferred到期、提交未知。否决：本地批准Gate、低敏感默认审批、callbackACK冒充Decision、token/审批正文泄露。证据仅受控action/resultref及安全类别。

## 7. blocker与进入/退出

BR-UP-002/003/007/008/009。进入需验证、binding、source mapping及当前owner授权；退出为明确owner结果或验证/授权失败/未知，外部按钮颜色不是truth。

## 8. 停审

验证、责任、时效、重放、命令及效果分别成立；平台差异保留；没有私有审批truth。允许C5，不声称审批成功。
