# Step 8. 定义状态机、事务与一致性验收

> 回填章节: `06-验收标准.md` §8 状态机、事务与一致性验收
> 状态: Completed

## 1. 本步输入

| 输入 | 用途 |
|---|---|
| `03` §9~§12 | 16 状态机、UoW、错误、幂等和恢复 |
| `05` §6 | state、transaction、idempotency、recovery 测试 |

## 2. SOP 问题回答

1. 状态机数量是什么?
   回答:16 组正式状态机,包括 11 组核心 truth 状态和 5 组派生 / 引用 / 发布 / handoff / report 状态。
2. 一致性硬门禁是什么?
   回答:accepted command 同 UoW 保存 truth、trace / audit、outbox、operation result 和 idempotency complete;reject / conflict / invalid path 无 accepted side effect。
3. duplicate 如何裁决?
   回答:same key same digest 通过 `OperationResultRepository` replay stored result,不得重放 domain transition。

## 3. 当前文档问题诊断

旧文档未固定正式 enum variant、rollback、duplicate replay、commit unknown 和 job partial failure 的验收口径。

## 4. 结构化中间产物

| 验收项 | 通过条件 | 失败条件 | 证据 |
|---|---|---|---|
| `ST-PROC-STATE-001` | 16 状态机使用正式 enum variant | 旧状态名 / 临时状态 / 未定义 variant | `EV-DOMAIN-001` |
| `ST-PROC-TX-001` | accepted Command 同 UoW 完成 truth、trace、outbox、operation result、idempotency | partial commit 或 complete 指向缺失 result | `EV-SERVICE-003` |
| `ST-PROC-TX-002` | reject / rollback 无 accepted side effect | reject 写 truth / outbox / business trace | `EV-SERVICE-003` |
| `ST-PROC-QUERY-001` | 11 Query no-write | Query 写 truth / projection / snapshot / audit | `EV-SERVICE-002` |
| `ST-PROC-JOB-001` | Job 不自动修复业务 truth | reconciliation / maintenance 修改核心 truth | `EV-JOB-001` |
| `ST-PROC-IDEM-001` | duplicate replay 不重放 | duplicate 产生第二份 truth / outbox | `EV-SERVICE-004` |
| `ST-PROC-IDEM-002` | same key different digest conflict | conflict 被 accepted | `EV-SERVICE-004` |
| `ST-PROC-REC-001` | commit unknown 先查 idempotency / operation result | blind retry | `EV-INTEGRATION-001` |

## 5. 回填草稿

§8 按状态、事务、query no-write、job no-truth-repair、幂等和恢复分表裁决。

## 6. 待确认事项

无阻塞项。
