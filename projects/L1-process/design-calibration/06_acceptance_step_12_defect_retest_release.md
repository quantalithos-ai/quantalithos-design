# Step 12. 定义缺陷分级、复验与放行规则

> 回填章节: `06-验收标准.md` §12 缺陷分级、复验与放行规则
> 状态: Completed

## 1. 本步输入

| 输入 | 用途 |
|---|---|
| `05` §11 | 缺陷分级与复验规则 |
| Step 11 | veto 与 S 级边界 |

## 2. SOP 问题回答

1. 哪些缺陷不可放行?
   回答:S 级、veto、release redline、P0 evidence missing、redaction fail 和 P0 A 级缺陷不可放行。
2. 有条件通过允许什么?
   回答:只允许已记录、已接受、有 owner 和截止时间的 B / C 或 P1/P2 残余风险。

## 3. 当前文档问题诊断

旧文档只有 S/A/B 粗略放行规则,缺少 P0 evidence、veto、redaction 和风险接受的联动。

## 4. 结构化中间产物

| 级别 | 定义 | 放行规则 | 复验要求 |
|---|---|---|---|
| S | veto、核心闭环断裂、正文入仓、恢复分叉、非 core 依赖 | 不允许 | 修复后全量相关 P0 suite + veto checklist |
| A | P0 command / query / state / config / evidence gate 失败 | P0 A 不允许 | 修复后对应 suite + regression |
| B | P1 / selected run 或非阻断功能缺陷 | 可风险接受 | 定向复验 |
| C | 文档、报告展示或低影响问题 | 可带出 | owner 跟踪 |

## 5. 回填草稿

§12 固定缺陷分级、复验矩阵、放行规则和缺陷记录最小字段。

## 6. 待确认事项

具体 issue tracker 字段由实现仓协作流程补充,不阻塞验收标准。
