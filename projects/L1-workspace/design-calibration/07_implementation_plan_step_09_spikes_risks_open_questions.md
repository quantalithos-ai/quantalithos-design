# Step 9. 定义 Spike、风险与待确认事项

## 1. Step 状态

`completed / risks_classified`。

## 2. Planned Spike

| ID | 类型 | 输出 | 影响阶段 | 截止点 | 当前 |
|---|---|---|---|---|---|
| SP-WS-001 | contract spike | L0-core workspace-specific type/error/event slot decision | PH-01/02 | PH-02 开工前 | blocked WS-UP-007 |
| SP-WS-002 | seam spike | owner safe query/visibility/attention conformance manifest | PH-03/04 | formal seam 前 | blocked WS-UP-001~005 |
| SP-WS-003 | durability spike | driver atomicity/unknown/restart/cleanup decision | PH-05/06 | PH-05 开工前 | blocked WS-LOCAL-001 |
| SP-WS-004 | crypto spike | UUID/CSPRNG/key ring/MSRV binding | PH-06 | PH-06 开工前 | blocked WS-LOCAL-003 |
| SP-WS-005 | evidence spike | raw→report→EV schema and retention policy | PH-07/08 | PH-07 report boundary | pending 07/retention |

## 3. 风险与待确认

| ID | 风险/问题 | 影响阶段 | 处理 | 截止点 | 状态 |
|---|---|---|---|---|---|
| R-WS-001 | owner query/version/watermark 不统一 | PH-03/08 | owning project闭合后更新 baseline | PH-03前 | blocker |
| R-WS-002 | event order/gap/replay 不统一 | PH-04/08 | L0-bus/owner contract | PH-04前 | blocker |
| R-WS-003 | visibility chain/撤销时效未定 | PH-03/08 | owner decision manifest | PH-03前 | blocker |
| R-WS-004 | attention lifecycle 未定 | PH-04 | 禁止推测，保留 blocked | PH-04前 | blocker |
| R-WS-005 | durable driver/transport/schema 未定 | PH-05/06 | infra/架构决策 | PH-05前 | blocker |
| R-WS-006 | downstream export/seed contract 未定 | PH-08 | 下游合同后置 | PH-08前 | waiting |
| R-WS-007 | baseline/workload/retention 无基线 | PH-07/08 | 后续文档定义，不填数字 | 送验前 | pending |

## 4. 禁止 workaround 与回写

发现设计字段/状态/port/证据缺口时必须暂停、登记 blocker、回写 owning truth source 或本项目相应 calibration；禁止私造 schema、字符串 ref、默认 allow、假 baseline、共享表或 fake production fallback。Spike 无输出时不得进入受影响阶段。

## 5. 回填与进入下一步

风险均绑定阶段和截止点；允许 Step10。
