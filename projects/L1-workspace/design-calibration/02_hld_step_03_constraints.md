# Step 3. 约束条件

## 1. Step 状态与计划

- 模式：full-restart / single-agent-serial；输入门禁 pass；思考记录、结构化、回填、自检 done。
- gate_status=pass；gate_reason=本Step静态自检完成；next_allowed_action=由flow串行推进；formal_fill_allowed=step14_only。
- source_files：Step 2；00 §10、01 §9/13；项目台账；02 flow；概要SOP对应Step与概要规范对应章节。
- 写入前检查：本项目/本文档授权有效；无正式正文污染；分批规模不限制最终完整性。

### Step 内计划

1. 已读取三层台账、前序及规范。
2. 问题回答、诊断、取舍见§3~6。
3. 按安全、只读、版本、原子、恢复和消费列约束，不提前建状态矩阵
4. 结构化后后置历史审计；从§7摘录回填。
5. 自检通过后更新flow，不把上游pending改为闭合。

## 2. 本步输入

Step 2；00 §10、01 §9/13；00 FR-WS-001~010/BR-WS-001~012；01 §6/8/9/10/13/15。前步的问题回答、诊断、取舍、待确认均承接，具体依赖见flow §3。

## 3. SOP 问题回答

1. 约束集中于scope、source safety、只读、原子、版本与世代。2. 来源为00 BR与01 §9/13。3. 最易串线是授权、cursor与local attention。4. 不写泛化性能口号。5. 每条约束必须落到后续对象或流门禁。

## 4. 当前文档问题诊断

若把partial当作已授权、把projection miss当空列表或用source cursor做分页，将改变安全和一致性语义。上游版本比较与撤销合同缺口不能用时间戳/TTL替代。

## 5. 改动前后对比

| 改动前 | 改动后 |
|---|---|
| 尚无本Step正式校准；01只有架构约束 | 本Step将已核验边界转为约束条件，不补上游schema |

## 6. 设计取舍

采用不可配置化的结构约束；不采用统一状态机、读触发refresh或默认展示的可用性捷径。

## 7. 结构化中间产物

| 约束 | 说明 |
|---|---|
| HC01 唯一owner | WorkspacePartition、application、projection、local intent、maintenance为局部事实；其余owner事实不进入本地truth |
| HC02 query no-write | scope查询、聚合、分页、诊断、export不能建分区、写snapshot/read/last-opened或创建job |
| HC03 resolver-first | 正式owner解析principal/scope/subject与决定；projection/ref字符串不提供授权 |
| HC04 安全先于可用 | 缺失、冲突、过期、撤销、无法证明有效性时fail-closed；内容/ref/count/provenance一致裁剪 |
| HC05 元数据分轴 | source version/watermark/cursor、view revision、generation、local revision/ReadCursor、page cursor互不替代 |
| HC06 局部原子 | source application、cursor、projection、revision/coverage同分区提交；重复返回原结果，未知提交先查 |
| HC07 顺序有来源 | owner给比较/接续规则，不能按收到顺序或cursor加一补gap |
| HC08 派生/意图区分 | Inbox仅从owner attention；pin/mute/read/preference独立保留，不产生receipt/任务完成 |
| HC09 恢复显式 | 正式baseline+可证明事件接续构造候选；cutover原子，不混世代、不重置局部意图 |
| HC10 请求绑定 | page cursor绑定主体/scope/filter/order/稳定view语境；失效重新读，不充当凭证 |
| HC11 缺失不等于空 | partition/projection缺失、filtered、complete empty是不同来源状态，外部不得泄露隐藏存在性 |
| HC12 输出非下游事实 | export只返回安全read model；无archive accepted/frozen，无默认workspace outbound family |
| HC13 有界但不减安全 | 查询/来源/批次/候选预算可以影响可用性，不能关闭鉴权/幂等/原子/正文拒绝 |
| HC14 依赖分类 | Core compile候选，其余runtime/event/ref/adapter/fake；不得引入L1源码依赖 |
| HC15 合同未闭合 | 本地定义消费需求与负向语义；不能用Opaque成功载荷/fake/任意map隐蔽补上游schema |

约束来源：HC01/02/08/12来自00 BR与01 §4；HC03~11来自01 §9/10；HC13~15来自01 §8/13/15与闭环标准。
本章不画图：约束直接作用后续主体，不另造架构图。

## 8. 回填草稿

正式§3摘录本文件§7的结论表/图；模块附录只摘录已停审结论，不复制讨论过程。详细字段不越过概要粒度。

## 9. 待确认事项

WS-UP-001~008/006-S持续开放；仅允许本地骨架与负向边界收口，受影响正向合同不能交实现。

## 10. 进入下一步条件

15条约束均有正式来源与后续影响；query副作用、权限时效、游标、重建与下游truth无混淆。
自检仅为文档静态审查，不是测试执行或上游签署。gate_status=pass；允许进入Step 4。
