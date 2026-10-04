# L6-bridges 01 Step 3：职责边界

> full-restart；done / pass；正式01不写。

## 1. 状态与 Step 内计划

开工：Step2 pass；已读Step1/2、00§2/4/10、SOP Step3/规范§4.4以及七owner边界。单一职责单元；思考先于边界表；通用门禁沿flow，不画上下文或提前拆子域。

| 单元 | 思考 | 写入 | 自检 | gate_status / 下一动作 |
|---|---|---|---|---|
| 仓级职责与红线 | done | done | done | pass / read_step_04 |

## 2. 输入

00五能力、局部状态允许集/禁止集；Step2结构目标、九硬约束；owner正式truth边界。

## 3. SOP逐项问题回答

| 问题 | 回答 |
|---|---|
| 具体做什么？ | 显式受权关系、平台差异转换、带来源的owner交接、安全表达、投递/回调局部效果、位置/去重/恢复和body-free追溯。 |
| 具体不做什么？ | 不创建内部对话/Turn/AI身份/Decision/Artifact/Workspace实体，不维护外部实体truth、不拥有body/auth/执行truth。 |
| 哪些相关能力属其他仓？ | 会话事实属Conversation，AI身份属Identity，责任/Policy/Gate属Governance，附件准入属Artifact，只读聚合属Workspace，观察接受属Observability。 |
| 不能隐式发生什么？ | external账号建GlobalMember/Conversation；低敏感默认审批；target fallback；unknown换effect重发；查询修复。 |
| 最容易串线什么？ | relation≠授权、source actor≠human、mapping≠双端实体、renderer≠Gate owner、receipt≠送达/已读、审计材料≠EV。 |

## 4. 当前材料诊断

Step1明确owner语义，但若“绑定/渲染/恢复”被描述成全域truth同步会越界；安全材料缺口不能靠本仓缓存补偿。责任项应表达归属，不能把FR逐条或技术结构直接列为职责。

## 5. 前后对比与历史定位

旧01§1.2/2.1将bridged Turn、external_id/GlobalMember和默认外部低敏感处理混入本仓责任。当前改为经授权relation、正式owner引用和独立阶段，不继承字段/默认审批；旧正文保留待Step16删除。

## 6. 取舍与复杂度

采用三类型职责表与短红线；未采用“所有平台相关信息归Bridges”或全域同步中心。一个仓级单元无需拆附录；数据/接口/容器不混入职责说明。

## 7. 结构化中间产物

| 职责项 | 类型 | 说明 |
|---|---|---|
| 桥接配置与受权external-binding relation | 做 | 本仓拥有接入局部关系，不拥有其授权basis。 |
| 平台协议转换与来源定位 | 做 | 隔离外部协议差异但不迁移平台truth。 |
| 外部identity/channel/message/thread映射 | 做 | 只承载获准typed引用关系，不创建两端实体。 |
| 受权owner交接与安全外显 | 做 | 只转换已获准材料并回链正式owner结果。 |
| 投递、callback、去重与位置局部记录 | 做 | 局部处理/效果观察不替代内部提交或平台truth。 |
| 有界恢复与安全追溯交接 | 做 | 只修局部状态，真实consumer结果独立。 |
| 内部Conversation/Turn及AI身份 | 不做 | 分别归Conversation与Identity。 |
| Gate/Decision与全域认证授权 | 不做 | 治理owner和正式入口负责，不能在桥接自建。 |
| Artifact正文及Workspace真相 | 不做 | 只消费正式附件ref与带来源只读语境。 |
| 外部实体truth、正文备份与直接工具执行 | 不做 | 平台与执行owner负责，本仓不得持有或绕边界执行。 |
| 安装认证与内部显式binding | 易混淆职责 | 安装scope/验签不替代内部主体/目标/action授权。 |
| Integration来源与human责任 | 易混淆职责 | 可信来源例外不授予human参与或审批资格。 |
| mapping与实体、renderer与裁决 | 易混淆职责 | 关系和表达不产生业务事实或审批。 |
| ACK、owner接纳、Turn与平台receipt | 易混淆职责 | 各阶段独立，平台接受不证明已读。 |
| 审计handoff与consumer接受/证据 | 易混淆职责 | 本地交接不形成外部接受、EV或signoff。 |

红线：无隐式建身份/对话/权限；无低敏感默认action；无owner/platform第二truth；无禁止材料durable/观测；无未知盲retry或换effect/target；无query维护；无adapter直接执行/裁决。

## 8. 回填草稿

章4只摘录§7职责表及红线；做/不做清单由表三类型概括，不重画系统图或对象表。

## 9. 待确认事项

BR-UP-001~009的正向合同不改变本仓职责；human入口/材料provider未明确时不任命本仓或上游新owner。

## 10. 门禁

自检：15项仅三职责类型，均有owner或边界解释；未混入系统图、容器、DDL、库或方法；禁止与Step2/00一致。表与红线可回填，正向合同不被宣布closed。当前agent设计自检pass。

gate_status=pass；gate_reason=responsibility_boundary_self_reviewed；next_allowed_action=read_step_04_then_create；source_files=Step1/2/00/owner_boundary/SOP3/规范4.4；formal_backfill_allowed=after_step_16_three_level_gate；commit_required=false。
