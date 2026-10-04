# L6-bridges 01 Step 8：数据所有权与一致性策略

> full-restart；done / pass；本Step不直接写正式01。

## 1. 状态与 Step 内计划

开工：Step3/5/7 pass；已读00§11、Step5六卡、SOP Step8、规范§4.9。按U1~U6逐单元先确定truth/snapshot/projection/reference/forbidden，再做跨数据边界审计；不写表结构、字段、DDL或事务实现。

| 单元 | 思考 | 写入 | 停审 | gate_status / 下一动作 |
|---|---|---|---|---|
| U1 绑定映射 | done | done | done | pass / U1_data_stopped |
| U2 入站交接 | done | done | done | pass / U2_data_stopped |
| U3 外显交付 | done | done | done | pass / U3_data_stopped |
| U4 交互责任 | done | done | done | pass / U4_data_stopped |
| U5 连续性恢复 | done | done | done | pass / U5_data_stopped |
| U6 安全读取追溯 | done | done | done | pass / U6_data_stopped |

## 2. SOP逐项问题回答与共同判断

本仓正式真相只包括桥接配置、受权relation/mapping、局部处理disposition、intent/attempt/receipt、callback验证、cursor/dedup/gap、恢复和handoff局部状态。能力快照、owner basis、safe material、identity/action/visibility、Artifact/Observability对象均是引用或受限快照；内部Conversation/Turn、Identity、Gate/Decision、Artifact、Workspace及平台消息正文明确不拥有。内部同一局部变更要求强一致；owner/platform到本仓消费采用最终一致加引用有效性/安全边界；未知结果保留indeterminate，不以重放补齐。

## 3. 当前材料诊断与取舍

旧01§6.4把Conversation/Turn、Gate truth、ExternalMapping和审计记录平列且未分真相/引用；当前按00 DR001~020和六卡重分。采用“本仓局部truth + owner ref/snapshot + forbidden body”四类模型；未采用复制平台消息、缓存敏感Gate或以摘要代替owner事实。

## 4. 逐单元数据所有权卡

### 4.1 U1绑定映射

| 数据项 | 数据类型 | 归属说明 | 边界说明 |
|---|---|---|---|
| 配置/能力版本与binding generation | 正式真相数据 | 本仓拥有局部版本与关系生命周期 | 不证明平台安装或内部basis有效。 |
| external-binding relation与typed mapping | 正式真相数据 | 本仓拥有受权关系/映射记录 | basis/owner授权真相仍外部。 |
| capability/provider安全快照 | 快照/投影数据 | 本仓可保存带来源/版本的最小摘要 | stale不默认支持。 |
| actor/target/basis/secret ref | 引用关系数据 | 只保存owner/ref/opaque版本 | 不存认证正文、token或授权文档。 |
| 外部账号/位置实体与内部实体 | 明确不拥有的正文/真相 | 外部平台/owner拥有 | mapping存在不迁移实体。 |

U1一致性：配置、relation、mapping的局部版本和撤销代际强一致；owner授权/平台安装到本地快照最终一致并需引用有效性；缺basis/secret/版本为waiting/blocked，不能回退身份或目标。

### 4.2 U2入站交接

| 数据项 | 数据类型 | 归属说明 | 边界说明 |
|---|---|---|---|
| 来源验证、ACK与owner_handoff disposition | 正式真相数据 | 本仓拥有adapter-local处理位置与阶段结果 | 不等Conversation接纳或平台消息truth。 |
| accepted fact/manifestation/result | 引用关系数据 | 只回链Conversation正式结果 | 不在本地重建Turn或body。 |
| source/mapping/material/cursor安全摘要 | 快照/投影数据 | 为解释处理阶段保留最小安全摘要 | 不扩大来源正文。 |
| raw事件、平台消息、附件正文 | 明确不拥有的正文/真相 | 仅瞬时转换 | 不落durable、日志或证据。 |

U2一致性：验证/ACK/disposition及其局部position在一次局部变更内强一致；owner结果消费最终一致，引用失效进入pending/indeterminate；变化与原mapping不可比则gap/quarantine，不以正文缓存补偿。

### 4.3 U3安全外显交付

| 数据项 | 数据类型 | 归属说明 | 边界说明 |
|---|---|---|---|
| delivery intent/attempt/known receipt | 正式真相数据 | 本仓拥有投递意图、尝试和已知观察 | 不拥有平台message/read receipt。 |
| source/projection/attachment/policy ref | 引用关系数据 | 回链已提交source、Artifact和治理依据 | 引用无效则阻塞。 |
| platform capability/rate snapshot | 快照/投影数据 | 记录来源版本与限流观察摘要 | 不宣称平台全量能力。 |
| source正文、敏感Gate、附件文件、tokenized URL | 明确不拥有的正文/真相 | owner/平台/私有seam拥有 | 不进入intent、receipt、日志或handoff。 |

U3一致性：intent与attempt/receipt局部关联强一致，attempt不替换effect；source/target/projection引用有效性必须一致；平台结果最终一致且unknown不能升级known，内部commit与receipt不互证。

### 4.4 U4交互责任

| 数据项 | 数据类型 | 归属说明 | 边界说明 |
|---|---|---|---|
| callback验证、one-use/replay disposition | 正式真相数据 | 本仓拥有验证与重放局部状态 | 不拥有审批/Decision。 |
| owner action/Gate/Decision result | 引用关系数据 | 仅回链正式owner结果 | callback ACK不等Decision。 |
| interaction capability/expiry安全摘要 | 快照/投影数据 | 保存解释验证所需最小版本/时限 | 不把签名变授权。 |
| callback token/context/response URL、审批正文 | 明确不拥有的正文/真相 | 私有入口/治理owner拥有 | 仅private seam瞬时使用。 |

U4一致性：验证与one-use结果强一致，owner action结果最终一致且同operation对账；当前责任/visibility失效fail-closed；读取旧结果不改变局部状态。

### 4.5 U5连续性恢复

| 数据项 | 数据类型 | 归属说明 | 边界说明 |
|---|---|---|---|
| dedup/effect关联、source/processing/delivery cursor、gap、恢复disposition | 正式真相数据 | 本仓拥有局部位置/去重/恢复事实 | 不拥有平台或Bus完整性水位。 |
| source/owner/platform probe结果与baseline ref | 引用关系数据 | 只回链权威对账来源 | 不以本地猜测关闭gap。 |
| rate-limit/lease/coverage安全摘要 | 快照/投影数据 | 记录受限预算/覆盖解释 | 不创造平台配额。 |
| 外部重解析body、完整平台历史、owner修复 | 明确不拥有的正文/真相 | 对应owner/平台负责 | 不能复制到本仓恢复。 |

U5一致性：同namespace同义键与结果强一致，跨stream/epoch不比较；外部probe/owner结果最终一致；缺comparator/coverage/window保gap/indeterminate/manual，恢复不得生成新effect。

### 4.6 U6安全读取追溯

| 数据项 | 数据类型 | 归属说明 | 边界说明 |
|---|---|---|---|
| body-free local trace/handoff/attempt disposition | 正式真相数据 | 本仓拥有局部交接与安全处理事实 | 不等Observability consumer/evidence。 |
| owner/consumer/material/visibility ref | 引用关系数据 | 保存外部正式读取/消费关系 | ref不携带正文或权限。 |
| safe read model/diagnostic summary | 快照/投影数据 | 由本仓truth派生供只读消费 | 可stale/rebuild，不反写真相。 |
| 日志正文、指标高基数标识、证据/报告正文 | 明确不拥有的正文/真相 | Observability/真实测试与owner拥有 | 禁止body/secret/敏感审批/伪证据。 |

U6一致性：局部accepted change与safe handoff marker强一致；consumer disposition最终一致且可为unknown；query只读既有状态，缺scope/visibility返回denied/unavailable，不创建或修复数据。

## 5. 简化关系示意图

#### 简化关系示意图: 局部truth与外部引用

```text
+---------------------------+       +----------------------------+
| Bridges local truth       |------>| owner/platform safe refs   |
| relation, effect, cursor  |       | basis, material, result    |
+-------------+-------------+       +--------------+-------------+
              |                                     |
              | no body / no truth migration       | validity required
              v                                     v
      +-------+-------------------------------------+-------+
      | forbidden: platform body, Conversation/Turn,        |
      | Identity, Gate/Decision, Artifact, Workspace,       |
      | secret, private callback, evidence/report bodies    |
      +-----------------------------------------------------+
```

图示说明：

- 本图只表达真相、引用/快照和禁止正文的大致边界，不表达存储或同步流程。
- 本仓的局部truth可以强一致，但引用目标仍由owner决定；引用存在不迁移正文。
- unknown/stale/blocked是可见结果，不被空值或缓存改写。

Step16表示复核：图改用等宽ASCII标签、统一禁止边界墙线，与§4六卡及正式§9一致；只重排truth/ref/forbidden表示，不改数据归属或引入正文快照。

## 6. 跨数据边界审计、回填与门禁

| 审计面 | 结果 |
|---|---|
| 双真相 | 未发现把Conversation/Identity/Governance/Artifact/Workspace/平台实体列为Bridges正式truth。 |
| projection反写 | U6/U1快照和读取均no-write；U5恢复只修局部位置，不能修owner/platform。 |
| 引用正文 | 20DR禁止body/secret/private callback/敏感审批覆盖所有单元，队列/日志/证据无例外。 |
| 一致性误用 | 局部mutation强一致，owner/platform消费最终一致；安全资格与引用有效性独立硬约束。 |
| 失败补偿 | unknown/gap/blocked/missing_source保守停写，不以盲retry、空值或换target补齐。 |

正式§9拟摘录§4~§6表及图；不写数据库/缓存/outbox/事务脚本。上游BR-UP保留。

自检：六单元逐项停审通过，所有20DR语义可定位；跨审无双真相、反写、正文入仓或一致性冲突。当前agent设计自检pass。

gate_status=pass；gate_reason=data_ownership_and_consistency_cross_audit_passed；next_allowed_action=read_step_09_then_create；source_files=Step3/5/7/00§11/SOP8/规范4.9；formal_backfill_allowed=after_step_16_three_level_gate；commit_required=false。
