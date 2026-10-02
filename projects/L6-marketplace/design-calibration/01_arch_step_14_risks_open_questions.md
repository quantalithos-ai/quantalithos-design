# 01 Step14 · 风险与待确认事项

## 1. 开工确认与Step内计划

模式full-restart；当前agent单独执行；前序Step已停审。已读取架构SOP本Step、架构书写规范对应章节和通用规范适用规则。输入：Step01～13、00 Step15、九owner当前架构/必要状态来源。输出为当前文件；正式回填仍待Step16。

计划：输入恢复→问题回答→诊断→取舍→结构化→复杂度/历史差异审计→回填草稿→自检/停审。前四项进入本批，后四项pending；未来Step不预建。

| gate_status | gate_reason | next_allowed_action | source_files |
|---|---|---|---|
| pass | 前序停审及用户01授权，只许可当前Step | 完成当前单元思考后才写结构化 | Step01～13、00 Step15、九owner当前架构/必要状态来源 |

## 2. SOP问题回答

已识别风险是批准误判、第二truth、未知接收当成功、撤回竞争及draft栈越级；尚缺确认的是exact合同/authority/资格基线/SLO。风险按受影响路径阻塞正向集成，不阻塞条件架构文档装配。可接受债务仅Step13承载取舍，不含审核/publisher/receiver缺口。

## 3. 输入诊断

本地MP-UP/SRC编号不是外发或owner确认blocker。Gov状态来源冲突不能由本仓选一版“已通过”；Hub工作区修复不等不可变锚点；Images/Observability文档完成不等运行资格。无全链合同不能以负向fake结论覆盖缺口。

## 4. 设计取舍

固定风险/待确认双表；另列owner及重开材料以便后续核验，不写解决任务或修改owner台账。当前Rust/Vue约束明确；draft变更仍挂起，不把冲突隐藏成无关事项。

## 5. 结构化中间产物

### 风险表

| 风险项 | 影响范围 | 当前处理口径 | 是否阻塞 | 说明 |
|---|---|---|---|---|
| R-MP-1 来源/主体/材料缺口被伪装可发布 | U1/U2/U4 | 资格不能自证，受影响正向路径blocked | 阻塞受影响集成 | MP-UP-001/003/004 |
| R-MP-2 可读摘要、扫描、签名或ACK误当批准 | U2/U3/U4 | 仅正式approved且绑定固定基线，缺合同不放行 | 阻塞上架/获取 | MP-UP-002及MP-SRC-010 |
| R-MP-3 package/财务愿景被当ownership | U1/U4及数据边界 | 不建包truth或transaction写路径，不宣称29110合规 | 阻塞对应扩展 | MP-UP-006、MP-SRC-013 |
| R-MP-4 receiver unknown被当安装成功 | U4/U5/U6 | 原意图核对、局部/外部状态分层 | 阻塞分发正向确认 | MP-UP-005 |
| R-MP-5 撤回后新分发或影响/通知/审计夸大 | U3～7 | 同局部序列化、已知范围、attempt不等结果、Archive不开lane | 阻塞受影响外部协作 | MP-UP-007/008 |
| R-MP-6 draft覆盖上位栈且无正式变更 | Web/API/Worker及后续设计 | 遵守Rust/Vue；TS/React替换不进入基线 | 有条件阻塞替换路线 | MP-SRC-003仍待确认 |
| R-MP-7 文档/原型/fake误当readiness | 全链资格与证据 | 文档检查、局部语义、真实run及signoff分开 | 阻塞未经证据的发布判断 | 不宣称运行通过 |

### 待确认事项表

| 待确认事项 | 影响范围 | 缺失确认 | 当前挂起口径 | 说明 |
|---|---|---|---|---|
| MP-UP-001 来源合同 | U1/U3/U4 | 各类型正式ref/version/digest/visibility/eligibility及SDK支持 | 逐类型positive blocked | 五UI类型不是ownerenum |
| MP-UP-002 审核合同 | U2/U3/U4 | approved outcome及application/source/material/scope绑定、失效语义 | 不批准、不上架、不据摘要获取 | publicDecisionSummary可读性不足 |
| MP-UP-003 publisher与scope authority | U1及所有actor入口 | 人类/组织验证和授权正式owner | 不自造verified/组织authority | Identity AI GlobalMember不是人类登录owner |
| MP-UP-004 供应链材料 | U1/U2 | 签名/扫描/SBOM authority、kind、适用/有效性 | 缺失材料明确blocked，不生产结果 | 材料齐备不等approval |
| MP-UP-005 分发receiver | U4/U5 | 逐类型接收intent/version/consumer/scope/outcome/probe | 缺合同不派发，unknown不盲重试 | receiver安装仍外置 |
| MP-UP-006 Billing | future/financial | 正式owner及金融truth范围 | 无支付/订阅/分成/跨境写能力 | 不是当前必做主线 |
| MP-UP-007 处置与通知 | U5/U4 | 正式撤回依据、通道/receiver/receipt | 局部禁新分发独立；外部通知positive blocked | attempt/ACK不推送达 |
| MP-UP-008 观测/归档 | U6/U7 | Observability producer准入/安全payload/receipt；Archive market source lane | 外部接收不造成功；Archive无当前接口 | Images亦无授权outbound |
| MP-SRC-003 栈变更 | §11及02～07 | 上位Rust/Vue变更明确确认 | 当前按Rust/Vue，不覆盖draft | 用户讨论不等正式上位变更 |
| MP-SRC-010 Governance基线资格 | 审核consumer合同 | flow/正式文档状态冲突的owner澄清 | 受影响正向合同资格挂起 | 不修改上游台账 |
| MP-SRC-013 MK2/29110 | 联合包/合规表达 | package owner及ISO29110类型适用 | 需求保留，包及合规positive blocked | 不造package/digest/verdict |
| Q-MP-01 容量/保留删除 | 查询、任务、通知、局部历史 | workload/延迟/通知SLO/retention/deleteauthority | 有界语义成立，生产数字/删除承诺挂起 | 不任意purge |

### 核验责任与重开边界

| 缺口 | 候选确认方，不代表已接单 | 重新核验所需正式材料 |
|---|---|---|
| MP-UP-001 | Method/Hub/Images/Artifact及SDK | exact consumer合同、当前资格、不可变来源锚点及可用support；Hub working-tree repair不替代锚点 |
| MP-UP-002、MP-SRC-010 | Governance及SDK | owner解决状态冲突、正式批准与market binding、失效/核对合同 |
| MP-UP-003/004 | 主体/组织/授权及供应链authority待定 | 正式owner及可消费材料范围，不能以Identity或Artifact名义猜测 |
| MP-UP-005/007 | 各类型receiver、通知/处置authority待定 | 匹配意图与版本的合同及可判别结果/unknown核对 |
| MP-UP-008 | Observability、Archive及SDK | producer admission、redaction、receipt/source matrix；当前Obs affected、Images implementation blocked不被本仓关闭 |
| MP-UP-006、MP-SRC-013 | Billing/package owner待定 | 正式ownership与跨仓裁剪后重新设计，不能本地补造 |
| MP-SRC-003、Q-MP-01 | 全局设计确认方、产品/运维authority待定 | 明确栈变更决定、正式profile及预算/保留删除规则 |

这些是本项目本地候选缺口，未外发、未改其他台账。01仅承诺条件结构和拒绝/挂起语义完整；不宣称所有上游正式文档已全文复读、不宣称正向合同关闭。

## 6. 复杂度判断

按七单元/路径收纳开放项；风险与待确认分开，不将缺owner误作可接受运行债务。

## 7. 后置历史差异审计

旧01仅作污染审计，位置/口径见Step01§7；本Step由当前需求与前序独立推导，不继承旧代码组织、数字、安装/支付或自造审核。

## 8. 回填草稿

正式对应章节摘录§5已收束表与边界说明；不复制问题回答/诊断，不新增合同或运行事实。具体回填范围见本Step结构化产物。

## 9. 自检与停审

来源、责任唯一、依赖方向、数据分类、conditional合同、正文排除及本Step层次审查通过；无越界代码/schema/表结构，无新增运行/evidence。计划八项done；问题回答→诊断→取舍→结构化分批形成。

| 单元 | 思考/写入/自检 | gate_status | gate_reason | next_allowed_action | source_files |
|---|---|---|---|---|---|
| 本Step已列单元 | done/done/done | pass | 已逐项自检与stop_review，外部positive缺口不关闭 | 下一Step；正式装配限Step16 | §1输入及§5结构化产物 |

## 10. 待确认事项

MP-UP-001～008、MP-SRC-003/010/013、Q-MP-01按受影响路径保留；不作为运行通过或风险接受。02及后续正式文档仍未授权。
