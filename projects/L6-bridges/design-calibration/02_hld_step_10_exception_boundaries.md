# L6-bridges 02 Step 10：异常与边界场景

## 1. Step 状态与内计划

done / pass；full-restart / single-agent-serial；回填正式§10。开工：三层门禁已核；通用规范与当前SOP/书写规范已读取；Step8/9；SOP10/规范4.10已核对；前序思考/结构/自检pass。未来Step未创建。

| 计划项 | 状态 |
|---|---|
| 前序读取 | done |
| 问题/诊断/取舍 | done |
| 结构化/复杂度 | done |
| 草稿/自检 | done / pass |

## 2. 本步输入

Step8/9；SOP10/规范4.10；前序校准文件的回答/诊断/取舍/待确认；项目/flow；通则/中间产物/真相源适用纪律。历史02/README后置扫描。

## 3. SOP 问题回答

1. 必须点名来源/权限/材料/未知/crash/位置/one-use/准入/query泄漏等改变主线的失败。2~3. 每条落具体U/对象及Step8入口，body-free强制拒绝比raw inbox兜底优先。4. 说明局部结果及被禁止下一动作即可指导03。5. exact错误码、SDK响应字段、retry数值/补偿实现留03/04，本Step不把风险/upstream pending表代异常表。

## 4. 当前文档问题诊断

外部NotFound/list缺项不自动证明未生效，业务HTTP成功也不证明accepted。必须区分权威no-effect proof、可恢复safe source和仅诊断的安全局部记录，避免把异常路径变成绕过gate和泄漏材料的后门。

## 5. 改动前后对比

| 已有流/状态 | 本步落点 | 非本步 |
|---|---|---|
| blocked/unknown/gap | 按异常定位owner、限制下一动作 | 完整错误枚举与平台响应全集 |
| 当前资格/crash切口 | 受限恢复、迟到finalize、无raw兜底 | 操作脚本/业务truth补偿 |

## 6. 设计取舍

采用异常三列表加可执行限制，不补新流程图；异常不改变六U协作轴，Step8/9已有unknown/gap与传播图足以表达。思考done；不以全面错误码冒充设计闭合。

## 7. 结构化中间产物

| 场景 | 应落在哪个部分处理 | 当前概要口径 |
|---|---|---|
| 跨平台/installation/server/kind相同ID | U1 MappingApplication | C03要求完整locator+双方basis，冲突不覆原mapping；不自动建GlobalMember或目标。 |
| 平台OAuth/PAT/管理员/signed输入但无内部basis | U1/U2/U4资格port | pending/blocked/denied；认证不是绑定，source可信也不替action资格。 |
| human actor/participant或AI责任链未确定 | U1 ExternalIdentityMapping / U4 ActorResponsibilityPort | BR-UP-002分支blocked；AppendFact Integration来源例外不取消active/scope/visibility等owner guard。 |
| config/secret/route/capability当前失效 | U1 BridgeInstallation / J05，U3 J01 | 引用unknown/revoked即阻IO，raw secret/private errors不输出；旧generation不续交。 |
| 关系撤销与外呼竞态 | U1 ExternalBinding / U3 DeliveryAttempt / U4 one-use | 未IO阻止；已经可能在途保unknown/真实结果finalize，不宣称平台请求被撤回。 |
| forged/replayed source或用户自报bridged marker | U2 PlatformIngressPort / E01 | 只verified来源+本地self-send关系判回环；伪造reject/quarantine，显示名/前缀不作依据。 |
| ACK期限到但无safe可恢复接管/owner接纳 | U2/U4 private ingress | 按已核验平台合同受控拒绝/明确丢弃，不承诺无损replay；不存raw inbox挽救ACK。 |
| owner target mode/actor/material/required digest缺失 | U2 ConversationHandoffPort / E01 | blocked或invalid quarantine；qualified material提供digest；不存rawbody/hash补证据，不造submitTurn。 |
| edit/delete在create mapping之前或错原message | U1 message mapping / U2 E01 / U3 J01 | quarantine/gap/unsupported；不编辑任意locator，不伪装新发言，不内部物理删truth。 |
| thread/topic不支持或父子不可解释 | U1 location mapping / U2/U3 adapter | unsupported；只有owner明确允许的无敏感降级，不能默换channel、scope或target。 |
| source committed状态不明/producer schema未绑定 | U3 E02 / C04 | missing_source/blocked，事件仅正式producer事实；不从缓存/Chat草稿造committed source。 |
| 敏感Gate外显、存在性或action缺basis | U3 PresentationApplication / U4 CallbackApplication | 敏感审批正文永不外发；提示/受控入口/action各独立授权；缺正式入口不造URL/按钮。 |
| 必要附件ref过期、传播或可见性缺资格 | U3 plan / PrivateMaterialPort | blocked；可省略只owner明示basis，不能缓存文件或永久公开链接；signedURL不日志。 |
| C04与E02不同namespace同语义effect | U3 intent / U5 continuity | 原子semantic effect唯一复用intent；不是两个key各自成功产生双发。 |
| HTTP 2xx但平台business error/locator不可核 | U3 PlatformDeliveryPort | known_rejected或indeterminate按正式结果；无accepted proof不构造PlatformReceipt。 |
| SDK包装自动retry或吞rate limit | U3 adapter / U5 DispatchLane | 产品资格不通过；不能在Bridges attempt之外产生未知重复IO，SDK选型保持pending。 |
| request可能离开后timeout/crash，UoW-B失败 | U3 attempt/intent / U2/U4 owner交接 / U6 handoff | indeterminate保原op/effect；先查权威结果，只known finalize；不新建逻辑效果。 |
| 迟到结果或旧fence返回 | U3 DeliveryAttempt / U5 RecoveryRecord | 允许验证原attempt/effect的真实结果落局部；旧fence禁止发新IO，不能抹已发生事实。 |
| NotFound、列表空、lease失效、queue空 | U5 AuthoritativeRecoveryPort | 不自动等no-effect/coverage；须该source明确权威合同，不满足继续unknown/gap/manual。 |
| 429/多级bucket/global限流 | U3 adapter / U5 DispatchLane | 保存有限动态下界；共同等待且预算/current basis有效；429是否无效果须方法合同，非一概retry。 |
| 不同epoch/session/位置不可比 | U5 StreamCursor / GapRecord | incomparable/gap；不以timestamp/Snowflake/message ID拼水位，protocol/owner/delivery位置分开。 |
| partial coverage或source/replay窗口过期 | U5 J03 / GapRecord | 未覆盖子范围保持open/manual，不从page完成关gap；无安全source不重建raw replay。 |
| dedup保留窗口到期或same-key变义 | U5 DedupRecord | expired/conflict/quarantine；原unknown仍受限，不能删去键再执行或hash body判同义。 |
| callback cross-actor/target/action、expiry或owner revision变化 | U4 E03 / ExternalActionBinding | rejected/blocked；platform proof只是来源，one-use需当前责任与owner二核。 |
| one-use消费后crash或owner结果未知 | U4 CallbackHandoffRecord / J02 | claimed不复活，不重新approve；只原owner operation权威对账和当前可见的原result。 |
| consumer准入/schema缺口或真实拒绝 | U6 SafeHandoffApplication | audit-only或blocked/consumer_rejected；无canonical材料不造every-mutation outbox，不造accepted/evidence。 |
| Query denied/not-ready/stale、隐含count/ref泄漏 | U6 SafeReadApplication | explicit denied/unavailable/qualified/degraded；过滤父ref/count，不能当empty也不刷新/修复/写审计。 |
| 平台raw error/header/下载URL含token或敏感内容 | U1~U6 private seams | private瞬时转换为有限reason；durable/log/trace/handoff/证据不得记录原string或可还原派生。 |
| 局部CAS冲突、事务失败或提交结果未知 | 所属Application / LocalUnitOfWorkPort | definite失败才报告subject/dedup/result/audit原子回滚；无权威提交结果保indeterminate，不换key/effect重应用，原operation受权只读核验由03闭口；已发生网络事实不回滚，B未知仍权威finalize。 |

不新增异常图：主线及跨U传播已经在§8/9表达，表仅给已有失败路径落点。完整platform error mapping、guard返回类型、幂等/补偿及测试矩阵由03/05展开。


## 8. 回填草稿

正式§10回填异常三列表与不新增图原因；不混风险/pending或执行记录。

## 9. 待确认事项

BR-UP-001~009=open；010=reference_only；不关闭上游。

## 10. 进入下一步条件

自检pass；gate_status=pass；gate_reason=exception_scenarios_with_local_owner_closed；next_allowed_action=step11_config_impact；formal_backfill_allowed=after_step14；commit_required=false。
