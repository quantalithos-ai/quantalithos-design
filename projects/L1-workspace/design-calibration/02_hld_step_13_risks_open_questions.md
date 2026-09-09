# Step 13. 风险与待确认

## 1. Step 状态与计划

- 模式：full-restart / single-agent-serial；输入门禁 pass；思考记录、结构化、回填、自检 done。
- gate_status=pass；gate_reason=本Step静态自检完成；next_allowed_action=由flow串行推进；formal_fill_allowed=step14_only。
- source_files：Step 12；上游台账；项目台账；02 flow；概要SOP对应Step与概要规范对应章节。
- 写入前检查：本项目/本文档授权有效；无正式正文污染；分批规模不限制最终完整性。

### Step 内计划

1. 已读取三层台账、前序及规范。
2. 问题回答、诊断、取舍见§3~6。
3. 先风险、再待确认与逐路径门禁；核对当前owner台账及01待回流目标；本Step单文件表格足够
4. 结构化后后置历史审计；从§7摘录回填。
5. 自检通过后更新flow，不把上游pending改为闭合。

## 2. 本步输入

Step 12；上游台账；00 FR-WS-001~010/BR-WS-001~012；01 §6/8/9/10/13/15。前步的问题回答、诊断、取舍、待确认均承接，具体依赖见flow §3。

## 3. SOP 问题回答

1. 概要设计风险在安全输入/覆盖证明不足、断点恢复/保留范围不明、attention身份未定、exact Core与下游接缝未闭合。
2. 待确认沿WS-UP-001~008/006-S，只补当前对象/接口受影响面，不伪造关闭。
3. 影响分别到CP1/2/7 scope与可见性，CP3/6消费恢复，CP4/5attention与意图映射及CP7 export。
4. 不能让本地DTO名称、假数据或参考项目的同名接口冒充正式上游能力。
5. 调优、排期与实际实现仓准备不是本Step风险项；不包装成新增业务功能。

## 4. 当前文档问题诊断

已有blocker台账只写大类，若正式02不指出具体source slice/coverage/binding/cursor/attempt受阻位置，03可能把语义槽位实装为无类型JSON成功体。

## 5. 改动前后对比

| 改动前 | 改动后 |
|---|---|
| 尚无本Step正式校准；01只有架构约束 | 本Step将已核验边界转为风险与待确认，不补上游schema |

## 6. 设计取舍

风险表列已识别结构影响和保守处置，待确认表列owner与关闭条件；不把Step12稳定骨架重新悬空。实际owner回流未获跨项目写权限，保留本地待回流登记。

## 7. 结构化中间产物

### 7.1 设计风险

| 风险 | 影响 | 当前处理口径 |
|---|---|---|
| HR01 安全快照槽位被误当可用schema | CP2 SourceSlice/VisibilityBinding与CP7读出 | 正式safe字段、list/item决定、source版本与有效性未证实就不构造允许结果；本地消费需求非owner事实 |
| HR02 消费终局与coverage证明脱节 | CP3应用、CP6baseline续接 | 成功记录、cursor与projection同事务；Gap/Blocked不占终局键；没有正式比较不跳位置 |
| HR03 失效/并发切换交叉导致旧内容复活 | CP6全generation失效与CP7旧页 | 角色/安全双轴，cutover再验；fanout不假装全局原子，现时授权失败即拒绝 |
| HR04 稳定attention关系不足 | CP4 Inbox与CP5 read intent | 只消费owner明示输入；跨generation不能映射就Unknown，意图保留 |
| HR05 保留范围与允许重放不相容 | application/operation记录、coverage/candidate | 03/04必须证明保留/清理不破坏重取和恢复；当前不承诺任意历史重放 |
| HR06 下游/共享命名越权 | Core候选、CP7export、static seed/执行主语 | 不建shadow schema、不声明archive接受、不把live workspace当seed或execution owner |

### 7.2 待确认与路径门禁

| 待确认 | 影响范围 | 当前挂起口径 / 关闭来源 |
|---|---|---|
| WS-UP-001 owner-safe query/summary/version/watermark | SourceSlice、SourceCoverage、Transient与baseline | 每owner正式safe读取及覆盖证明核验前受影响正向输入blocked；001不因本地类型命名关闭 |
| WS-UP-002 event identity/schema/cursor/replay/baseline | ConsumeSourceChange、SourceApplicationRecord、AdvanceWorkspaceRecovery | 六owner事件合同与bus获准续接能力逐项核验；preparation非executor；缺口不猜 |
| WS-UP-003 visibility owning chain/有效性/撤销 | 全部scope/list/item输出与cutover | 各owning chain提供可适用证明前fail-closed；空页亦须访问证明；无全域统一授权假设 |
| WS-UP-004 attention identity/version/lifecycle | InboxItem、ReadCursor | 正式明示输入与稳定关系未闭合则不派生、不自动复活Withdrawn；Unknown不猜已读 |
| WS-UP-005 Personal/Project safe refs及关系 | WorkspaceScope、分区唯一性、操作键 | identity提供Personal、work提供Project/ProjectMember关系；不从字符串/投影反推 |
| WS-UP-006 SDK/product/sync/archive read/export | 六Query外部消费者适配特别是Export | 本地只读语义可定，外部schema/分页/有效性消费约定未定则blocked；archive后续串行 |
| WS-UP-006-S MI-UP-006静态seed owner | member-images边界 | owner正式裁决前不默认live workspace供seed；不影响现有只读view职责 |
| WS-UP-007 Core workspace专用共享类型/error/event | compile复用与公共契约 | L0-core正式符号/版本及授权未证实不复制schema，不创建outbound family |
| WS-UP-008 非项目personal execution subject | 下游执行边界 | workspace不执行；交owning execution authority，不能在Personal view内补宿主truth |

### 7.3 当前完成上限与回流

这些项阻塞受影响正向schema、联调、可运行交接和真实readiness，不阻塞七CP/16对象/14入口的本地责任与保守失败骨架。语言/目录/存储实现约束由03 Step3按正式标准继续确定，并非外部owner blocker的替代。

Owning项目待回流目标沿用本项目01_arch_step_14_risks_open_questions.md §7.4。当前只登记本项目补充需求：empty/list access、成功去重键与可重试Gap、candidate全世代失效、attention撤回后同身份生命周期、export页语境。未回写其他项目flow/ledger，未通知owner；实际回流需要另行跨项目写授权。

后置审计：与本项目台账、member/service/images当前停审登记及MI-UP-006核对，既有未闭合项未因其07停审而自动关闭；draft中的候选接缝不升级为证据。

## 8. 回填草稿

正式§13摘录本文件§7的结论表/图；模块附录只摘录已停审结论，不复制讨论过程。详细字段不越过概要粒度。

## 9. 待确认事项

WS-UP-001~008/006-S持续开放；仅允许本地骨架与负向边界收口，受影响正向合同不能交实现。

## 10. 进入下一步条件

风险与待确认分表；影响对象/接口与关闭来源明确。Step12稳定结构未重新悬空；跨项目回流诚实标未执行，未伪造实现或上游签署。
自检仅为文档静态审查，不是测试执行或上游签署。gate_status=pass；允许进入Step 14。
