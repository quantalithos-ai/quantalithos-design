# 03 Step 9：逐接口定义函数级处理流

## 1. Step状态

2026-10-01；full-restart / single-agent；用户授权Step5～10。completed / selfcheck_done，正式03仍historical_material。

### Step内计划

| 单元 | 状态 |
|---|---|
| P1读取输入 | done |
| P2问题回答 | done |
| P3诊断 | done |
| P4取舍 | done |
| P5逐单元结构化 | done |
| P6复杂度与跨单元审计 | done |
| P7候选草稿 | done |
| P8自检与停审 | done |

## 2. 本步输入

当前00/01/02，前序Step的问题、诊断、取舍及未闭合资格；详细设计SOP Step9、书写规范对应章节、通则/中间产物/闭环标准；Governance对应Step适用契约组织。不继承其业务truth或运行证据。

## 3. SOP问题回答

1. 哪些协议必须拥有函数级处理流？

答：全部49入口必须独立flow，0event不增流程。

2. 这些处理流应按 Command、Query、Inbound Event、Outbound Event、Operations Job 或所属模块如何分批？

答：按七U逐小循环，Command/Query/Job分支独立，common runner不替代逐入口调用链。

3. 每个处理流的入口函数是什么？

答：每flow与Step8同名snake_case方法，typedEnvelope输入，completefamilyresult/readsurface/report输出。

4. 入口函数调用哪些 application service、domain method、repository 和 outbox？

答：各flow逐条列Step6factory/member与Step7get/save/formalports；没有outbox。

5. 入口 DTO 在哪一步被校验、派生、转换或用于构造 Domain 对象？

答：prepare验证当前actor/disclosure→原result lookup→fresh typed读取/formalprecheck→短UoW→具体factory/member；字段映射逐项source。

6. 如果构造目标对象所需字段缺失，处理流在哪个函数返回错误或进入恢复路径？

答：缺record/typebinding reject rollback；缺ownerqualifiedblocked；externalunknown原intentprobe，不新效应。

7. 每个 port 调用是否已在 Step 7 定义,读取面 / 写入面是否足以支撑该 flow？

答：只使用已声明ports；发现compoundcursor/原jobcheckpoint/notice scope/typedread不足先回修Step6/7，不留fake私口。

8. 事务在哪里开始，在哪里提交，哪些错误触发回滚？

答：Command全部accepted在同UoW；Jobclaim/permission先commit、外call无tx、result另短UoW；所有错误rollback或unknown持久边界明确。

9. 哪些状态会被修改，哪些事件会被写入？

答：14carrier与safeaudit/fullresult/必要work，本地维护不写ownertruth，0event。

10. 每个处理流至少需要哪些测试切口？

答：每flow首调/replay/diffintent/missing/scope/CAS/rollback与特有binding/unknown/late测试切口。

11. 当前 flow 完成后,DTO 构造、对象方法、port、事务、错误、状态和副作用是否通过停审？

答：每flow停审检查DTO→methods→ports→Tx→完整result→状态与副作用，不futureplaceholder。

12. 所有 flow 完成后,是否存在跨 flow 事务边界冲突、状态触发冲突、outbox / trace / audit 副作用冲突或 phase boundary 越界？

答：跨flow重审版本撤回/许可/取消竞态、unknown重试、current披露、原完整result、typedshadow来源，Step10承接。

## 4. 当前文档问题诊断

Step8完整请求揭露三处必须回修：notice localscope缺稳定field，dispatch进程crash后需要typed原Job checkpoint而不是只fingerprint，projection shadow需明确完整manifest而非半数据称Fresh。HLD函数名与Port可调用面必须严格对齐；不能让shared runner覆盖全部业务流程而省略具体对象动作。

## 5. 改动前后对比

| 项 | 前 | 后 |
|---|---|---|
| 契约深度 | 前序概念骨架 | 本Step按模块/对象/入口独立展开，类型、来源与失败边界可追溯 |
| 外部资格 | retained pending | 不因文档深化变为ready；受影响positive仍blocked |

## 6. 设计取舍

采用49独立图+Rust风格伪代码+精确source/Tx/effect/test表；公共runner仅声明重复的scope/replay/complete原子语义。拒绝长SQL跨SDKeffect、过期lease盲发、Query刷新、取消覆盖late结果、projection当truthsource。原Jobcheckpoint是局部技术支撑，OperationRecord为生命周期authority，不增GlobalState。

## 7. 结构化中间产物

### 49独立flow与分批停审

| 模块 | Command | Query | Job | 独立附录 |
|---|---|---|---|---|
| U1 来源/发布责任 | 3 | 1 | 0 | [逐入口flow](03_ddd_step_09_part_u1.md) |
| U2 申请/正式审核交接 | 5 | 1 | 2 | [逐入口flow](03_ddd_step_09_part_u2.md) |
| U3 目录/市场版本 | 5 | 5 | 0 | [逐入口flow](03_ddd_step_09_part_u3.md) |
| U4 受控分发 | 3 | 2 | 2 | [逐入口flow](03_ddd_step_09_part_u4.md) |
| U5 撤回/影响/通知 | 4 | 2 | 3 | [逐入口flow](03_ddd_step_09_part_u5.md) |
| U6 审计/恢复 | 1 | 3 | 3 | [逐入口flow](03_ddd_step_09_part_u6.md) |
| U7 引用/snapshot/索引 | 0 | 2 | 2 | [逐入口flow](03_ddd_step_09_part_u7.md) |

共同Job事务/report/crash契约：[Job执行](03_ddd_step_09_job_execution.md)。Step7完整runner/gate/support签名：[application callables](03_ddd_step_07_application_callables.md)。各flow有独立ASCII、typed构造、精确对象/port调用、Tx/error/effect/test与停审；不是通用模板替代。

### 跨flow审计与已完成回修

| 审计项 | 设计结论 / 回修 |
|---|---|
| 请求→对象→port | 49同名入口，21C/16Q/12J；C/Q字面量字段对照完整schema无缺失/多余；callable名与17ports/runner定义核对。Job变量来源与条件分支单独表，不宣称可编译实现 |
| Core authority | Command唯一meta.request.idempotency_key；Worker唯一context.request，fence.work_ref唯一工作ID；当前actor/disclosure在fulloriginalreplay之前 |
| local publisher release | UnitOfWork.lock_publisher，先publisher后version；正向重新读取Bound与预检relation一致，Release相同序列化点；remote当前validity仍需正式owner消费合同，不自证 |
| 版本/许可/撤回/取消 | acceptance/dispatch permission/restrict/withdraw同version锁；许可前失效不send，许可后formal late outcome持久化+Impact.include更高cursor+必要枚举/通知责任 |
| 原结果与Job重入 | JobCheckpoint保存原typedbody与preallocated result/audit/framecursor；完整原report，不以当前projection重建；旧报告不能完整证明就等待，不强Complete |
| negative outcomes | RecordReceiverOutcome/RecordNoticeOutcome仅Confirmed正式候选；负向/Unknown由对应Jobtypedprobe/dispatch保存。失败不attach relation，ACK不审核或正式结果 |
| 读取与分页 | 显式async Result+readonlyrollback；formalowner prechecks前关闭本地读取事务。page_listed_versions在repo先过滤Listed/currentvisibility再count/token；unknown_attemptrefs逐current披露裁剪 |
| 枚举完整性 | scan_known_impact联合源同compoundcursor/fixedupper，不双表共after漏读；successor完整after在DeferredPlan；lateimpact所有适用disposition分页遍历不截断，事务预算超限rollback等待正式恢复 |
| projection | typed非空plan、逐key Rendered/Omitted完整manifest；Fresh缺本体integrity failure；旧index非source，fixedcursor源读不能证明就blocked |
| 字段/文件单authority | publisher_ref/notice.scope/category.scope、Observation完整factory输入已回填；contracts immutable组合类型/result，domain re-export，无反向依赖；Step4既有215path承接 |
| 副作用范围 | audit/fullresult/work同局部UoW；JobA许可与B结果分段，外部效应不跨SQL；0event/outbox/Billing/Archive。Job审计不自动递归Obs发自身audit |
| evidence / qualification | 仅静态文档检查，actual Core/SDK导出只证明通用路径；exactownerconversion受影响positive仍blocked |



## 8. 候选正式草稿

候选§8：按U1～7摘录49独立入口图、完整请求/对象/port/source/事务/报告/错误/测试表，并保留Job A/B/原intentprobe、当前披露与原完整重放约束。正式03仍不装配。

## 9. 待确认事项

MP-UP-001～008、MP-SRC-003/010/013、Q-MP-01及受影响Hub/Images/Obs/SDK资格仍pending/blocked；本地候选不冒充owner确认。Billing/支付/订阅/分成/跨境均future/blocker，Archive无active lane。

## 10. 自检与下一门禁

文档内停审完成：49入口逐流覆盖、字段构造与port调用名、表格列数/围栏、当前本地链接检查已执行。类型闭口/反向依赖与状态pair将在Step10最终再交叉核对，不能宣称编译/集成或owner资格通过。允许授权内进入Step10，完成后立即停止；Step11未授权。无需提交commit。
