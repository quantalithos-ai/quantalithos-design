# Step 5. 设计实施阶段与依赖顺序

## 1. Step 状态

`completed / phase_graph_fixed`。

## 2. 阶段依赖图

#### 阶段依赖图: L1-workspace 实施阶段顺序

```text
[PH-01 Foundation / composition]
  | enables
  v
[PH-02 Contracts / domain invariants]
  | enables
  v
[PH-03 Local command-query vertical slice]
  | enables
  v
[PH-04 Projection / consumer / idempotency]
  | depends_on
  v
[PH-05 Recovery / generation / invalidation]
  | depends_on
  v
[PH-06 Config / adapters / controlled seams]
  | enables
  v
[PH-07 API-worker-jobs / reports / evidence]
  | depends_on
  v
[PH-08 Formal seam conformance / handoff]
```

关键说明：图表达阶段依赖，不表达函数调用链；PH-08 需要 owner/bus/durable/downstream 正式 manifest；任何 blocked 阶段都不能用 fake 伪造完成。

## 3. 阶段总表

| 阶段 | 目标 | 依赖 | 核心交付物 | 门禁 | 当前 |
|---|---|---|---|---|---|
| PH-01 | 建立 crate/composition 边界与台账 | 无 | manifest、目录、builder boundary | GATE-01/DEP | planned |
| PH-02 | 闭合 typed contract 与 16对象局部不变量 | PH-01 | contracts/domain、OBJECT/STATE tests | GATE-01/02 | planned |
| PH-03 | 打通 local Command/Query 纵切 | PH-02 | provision/local/CAS、六 Query no-write | GATE-02/03/AC-FUNC | planned |
| PH-04 | 应用 source event 与 Inbox 幂等 | PH-03 | Consumer、projection、gap/unknown | GATE-03/04/AC-SYNC | blocked WS-UP-002/004 |
| PH-05 | 实现 bounded recovery 与 generation | PH-04 | 4 Operation、cutover/invalidation | GATE-04/AC-STATE | blocked WS-UP-001/002/LOCAL-001 |
| PH-06 | 接 config、adapter、controlled fault | PH-05 | RuntimeConfig、store/cursor、redaction/dependency | GATE-01/04/AC-BOUND | blocked LOCAL-002/003 |
| PH-07 | 暴露入口、报告与证据骨架 | PH-06 | API/worker/jobs、scripts/reports | GATE-04/05 | planned；无真实输出 |
| PH-08 | 正式 seam conformance 与验收交接 | PH-07 | selected run、handoff drafts | GATE-05/06 | blocked all external seams |

## 4. 阶段推进规则

每阶段先读项目级 ledger 和 boundary ledger，确认 `next_allowed_action=implement` 后再动实现仓；阶段门禁完成前不得进入下一阶段。设计/协议/状态冲突必须回写 03/04/05/06，固定新 baseline 后重审，不在实施端私补。

## 5. 回填与进入下一步

阶段图、依赖和 blocked 条件已闭合，允许 Step6。
