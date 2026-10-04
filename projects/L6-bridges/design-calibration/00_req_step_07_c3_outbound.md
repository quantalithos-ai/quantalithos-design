# C-BR-3：安全外显与交付成立

> 00 Step7当前单元；design_self_review=pass；C2已停审；非用户/owner signoff。

## 1. 来源与职责

C1/C2、Conversation00 §11/12与03已提交结果、Governance00 §10/12、Artifact00 §11/12、Workspace只读边界、PS-03/05/08/11/13。只拥有投递intent/attempt/receipt及message mapping，不拥有来源正文、平台消息最终truth或读达状态。

## 2. 问题、诊断与取舍

交付必须证明内部来源已提交、对当前外部受众可见且平台效果已知。历史“成功即送达”和“低敏感默认可审批”均错误；采用安全projection与分阶段receipt，不采用内部事件到达即外发、全量Gate或附件正文持久化。

## 3. 故事目标与能力主题

参与者希望看到允许外显的结果及真实交付状态；审批者希望敏感内容不泄露；附件使用方希望只取得被授权引用。主题是安全转换与Gate降级、附件引用交接、稳定投递效果与receipt。

## 4. 输入、输出与状态

输入：committed source ref/version、installation/binding generation/target、当前visibility/Policy/Gate依据、authorized projection ref/version、operationkind及stable effectidentity。输出：intent与attempt、platform_accepted/known_rejected/retry_wait/indeterminate/blocked、确认external locator及safe reason/ref；platform_accepted不代表用户已读或内部执行完成。

语义路径：prepared -> dispatching -> platform_accepted/known_rejected/retry_wait/indeterminate；缺当前授权/material/secret进入blocked；仅已证明未产生效果的retry_wait可以再次dispatch。dispatching崩溃/lease过期不能当未发送；必须走同effect查询或indeterminate。每次attempt是同intent的尝试，不重造effect。

source/target/binding generation、operationkind及允许projection版本必须不可静默替换；创建/编辑/删除/回复分别绑定逻辑效果。重建显示材料必须仍是同一授权版本；变化是显式新语义，不能给unknown旧效果另发一个intent逃过对账。派发前重核授权、撤销、资料可用性及secret版本。

## 5. 展示、附件、差异与顺序

敏感Gate不进入外部payload，只允许owner明确批准的无敏感安全提示；安全入口ref必须有授权、目标allowlist和有效期，不能假定Chat/Console存在。若连Gate存在性/提示都不得外显则不发。低敏感只是分类，不自动允许内容或按钮；展示许可与action许可分别成立。mention必须映射已受权主体，不开放mass mention。

附件只消费Artifact准入/授权ref。外部下载、上传或链接操作仅在正式访问与传播合同明确时进行；不可用/过期/撤销显式返回，不以永久公开URL替代；raw文件不得进入Bridges durable truth。若附件是必要内容，整个相关投递blocked；只有owner允许省略时可degraded，不能默默丢附件。

平台edit/delete/thread支持按capability revision核验；已确认create定位是变化前置，不编辑/删除非mapping对象。unsupported不得转新普通消息或换频道；仅在授权语义明确时产生显式degraded结果。一个binding+location/thread lane内保持有定义的顺序，限流按真实bucket维度，跨lane不承诺总序。

## 6. 质量与验收语义

切口：未提交source、visibility撤销、敏感Gate存在性、低敏感无action、附件过期、rate-limit、create未知后edit、dispatch中崩溃、duplicate intent、HTTP成功但平台业务拒绝。否决：internal commit当外部送达、raw附件/secret落盘、动态换target、unknown盲重试、默认审批。证据不含payload、token化下载URL、审批正文或平台raw error。

## 7. blocker与进入/退出

BR-UP-001/003/004/005/007/008/009。进入需C1有效及可外显committed source；退出明确receipt或blocked/unknown。没有安全projection owner与重解析面就不可伪造payloadref。

## 8. 停审

source/展示/action/交付结果分开，receipt不宣称读达，敏感/附件缺口有保守失败，intent continuity与顺序已约束。允许C4，不宣称平台投递成功。
