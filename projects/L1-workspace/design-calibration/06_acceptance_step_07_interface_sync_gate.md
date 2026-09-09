# Step 7. 定义接口、事件与跨仓同步验收

## 1. Step 状态

`completed / formal_seam_blocked`。

## 2. 依赖类型裁决

| 关系 | 类型 | 验收方式 | 当前 |
|---|---|---|---|
| L0-core | compile candidate | contract compile/typed compatibility | WS-UP-007 blocked |
| L0-bus | event | envelope, delivery boundary, replay/receipt distinction | WS-UP-002 blocked |
| 六 L1 owners | runtime/ref + event | safe query、visibility、attention、owner event vector | WS-UP-001~005 blocked |
| SDK/product/sync/archive | adapter/ref | read/export compatibility selected-run | WS-UP-006/006-S blocked |

## 3. 接口/事件/operation 验收矩阵

| AC | 表面 | 通过条件 | 失败条件 | TC/EV |
|---|---|---|---|---|
| AC-SYNC-001 | 2 Command | metadata/key/digest/expected 正确，写集原子 | CAS/幂等错或 owner write | SCOPE/LOCAL/IDEM |
| AC-SYNC-002 | 6 Query | safe response、current visibility、七写=0 | 隐式维护或安全字段泄漏 | QRY/VIS |
| AC-SYNC-003 | ConsumeSourceChange | typed envelope、Applied/LateIgnored、Gap非terminal、Unknown Pending | 猜顺序、伪 ACK、二次 apply | SRC/IDEM/TXN |
| AC-SYNC-004 | ConsumeSourceInvalidation | per-target bounded fanout，effect 有 owner proof | global success 或 payload bool 决定安全 | SRC-006/TXN-003 |
| AC-SYNC-005 | 4 Recovery operations | Request/Advance/Supersede/Invalidate 的 phase、basis、terminal 正确 | 自动循环、终态复活、跨 partition | REC/STATE |
| AC-SYNC-006 | downstream read/export | schema/status/provenance 稳定、read-only | archive accepted 或下游私有状态进入 workspace | QRY-006/BOUND |

## 4. 下游未就绪裁决

缺正式 owner/bus/durable/downstream seam 时，相关 AC 保留为 `blocked`，不判失败也不判通过；必须在新 fixed run 使用版本化 manifest 重新证明，不能升级旧 fake EV。

## 5. 回填与停审

正式 §7 回填六项 AC、依赖类型表和 blocked 规则。每项均回指 03 协议/flow、05 TC/EV 与固定 report path；跨接口审计无协议名漂移，允许 Step8。
