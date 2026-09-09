# Step 12. 详细设计承接

## 1. Step 状态与计划

- 模式：full-restart / single-agent-serial；输入门禁 pass；思考记录、结构化、回填、自检 done。
- gate_status=pass；gate_reason=本Step静态自检完成；next_allowed_action=由flow串行推进；formal_fill_allowed=step14_only。
- source_files：Step 4~11；项目台账；02 flow；概要SOP对应Step与概要规范对应章节。
- 写入前检查：本项目/本文档授权有效；无正式正文污染；分批规模不限制最终完整性。

### Step 内计划

1. 已读取三层台账、前序及规范。
2. 问题回答、诊断、取舍见§3~6。
3. 先稳定输入表、再展开深度与回退规则；最后与Step4~11交叉核对
4. 结构化后后置历史审计；从§7摘录回填。
5. 自检通过后更新flow，不把上游pending改为闭合。

## 2. 本步输入

Step 4~11；00 FR-WS-001~010/BR-WS-001~012；01 §6/8/9/10/13/15。前步的问题回答、诊断、取舍、待确认均承接，具体依赖见flow §3。

## 3. SOP 问题回答

1~2. 七CP/五层方向、16对象、14接口与处理流及分轴状态为稳定概要输入。
3. 03补模块/目录、对象完整字段和工厂、trait/adapter、协议、函数数据流、状态矩阵、持久化/事务、配置及测试证据切口。
4. 若要改对象/入口/状态主语必须回相应02 Step，若改owner或能力需回01/00。
5. 配置影响须落为03配置实现契约，04再填写使用。
6. owner exact query/event/visibility/attention/export及Core专用schema不作为已闭合交付。

## 4. 当前文档问题诊断

把安全输入槽位列成实现就绪字段会掩盖WS-UP；仅把完整签名留03却不要求来源/工厂/状态反查，也不能防止实现agent重新发明。

## 5. 改动前后对比

| 改动前 | 改动后 |
|---|---|
| 尚无本Step正式校准；01只有架构约束 | 本Step将已核验边界转为详细设计承接，不补上游schema |

## 6. 设计取舍

稳定结构与外部未闭合接缝分开；本Step只交接已存在主语，不新增功能。单表加回退规则足够，不需要模块附录或图。

## 7. 结构化中间产物

### 7.1 稳定输入与详细设计展开

| 已由概要设计收稳 | 详细设计继续展开 |
|---|---|
| CP1~CP7业务划分与Inbound/Operations→Application→Domain/Contracts→Ports/Adapters方向 | 正式module/目录/组装、依赖可见性、每module capability与exports，不能按外部owner复制truth |
| CP1 WorkspacePartition/WorkspaceScope与Provision | 字段、唯一身份、resolver关系、生成来源、无partition id时幂等与原子创建 |
| CP2 SourceSlice/VisibilityBinding和只读ports | 本地typed contract、safe输入验证、scope/list/item访问与决定有效性，owner exact未知路径保持blocked |
| CP3 PartitionProjection/SourceApplicationRecord/SourceCoverage | 应用key/digest、终局/失败分类、cursor比较来源、原子UoW、权威结果读回与重复/乱序/缺口规则 |
| CP4 InboxItem与InboxProjector | 稳定attention映射、跨generation身份、派生字段/withdrawn与原子应用；未闭合生命周期不补 |
| CP5 LocalAttentionState/ReadCursor/WorkspaceOperationRecord | typed变体全集、read basis/未读例外、local并发、结果核对、无generation覆盖 |
| CP6 RebuildAttempt/GenerationState/InvalidationRecord | baseline/续接输入、attempt/角色/安全矩阵、worker栅栏、candidate事务、cutover、fanout失效及进度证据 |
| CP7 WorkspaceReadView/WorkspacePageCursor与六Query | 完整response/error/页绑定、Materialized/Transient、空/缺失/hidden区分、当前裁剪、export no-write |
| 2 Command/6 Query/2 Consumer/4 Operations、14独立流 | 完整签名/请求响应/函数输入输出与分支、字段来源、port方法和事务切口；不补Outbox |
| 状态集合与主迁移、28异常场景 | 穷举状态矩阵、guard、同键/并发/unknown、可恢复条件和安全错误，不以实现细节暗改终态 |
| 配置影响与不可配置边界 | RuntimeConfig/Loader/Validator/Error、adapter/job分组与runtime builder注入；04说明填写和生效 |
| no-write/no-leak/幂等/gap/cutover/overlay保留不变量 | 05/06所需可测试接口和证据来源；fake只能证明局部允许行为，不生成联调或readiness |

### 7.2 回退与承接上限

如果03发现上述主语需变更，先回02对应Step及其引用链修正，再更新正式02；不能在03暗改。owner/能力/架构边界变化还需回01/00与用户确认；已停审文档不在本Step无依据重开。

本表交付的是设计骨架，不是可编译代码或外部可调用schema。WS-UP-001~008/006-S的精确合同只进入Step13，不以任意JSON/opaque成功体/fake替身标记已闭口。

### 7.3 后置一致性核对

与Step4~11核对：七CP、16对象、14入口、两读取模式及多轴状态名称一致；draft九部分和旧FR编号不复用；未新增实现任务/排期或真实baseline。

## 8. 回填草稿

正式§12摘录本文件§7的结论表/图；模块附录只摘录已停审结论，不复制讨论过程。详细字段不越过概要粒度。

## 9. 待确认事项

WS-UP-001~008/006-S持续开放；仅允许本地骨架与负向边界收口，受影响正向合同不能交实现。

## 10. 进入下一步条件

承接表仅包含前序已讨论主语；字段/协议/函数/状态/事务/配置/测试来源深度明确；回退规则与外部blocker上限分开。
自检仅为文档静态审查，不是测试执行或上游签署。gate_status=pass；允许进入Step 13。
