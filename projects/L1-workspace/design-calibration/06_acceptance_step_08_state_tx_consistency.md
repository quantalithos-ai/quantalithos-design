# Step 8. 定义状态机、事务与一致性验收

## 1. Step 状态

`completed / p0_consistency_gates`。

## 2. 状态与一致性验收表

| AC | 正式契约 | 通过条件 | 失败条件 | TC/EV |
|---|---|---|---|---|
| AC-STATE-001 | CoverageState | Unknown/Partial/Complete/Gap/Invalidated 按 proof 迁移；Gap 非terminal | 猜补、Invalidated复活、无 proof Complete | STATE-001/SRC-004 |
| AC-STATE-002 | AttentionState | Present/Withdrawn 只由正式 attention input 变化 | 文本推测或查询 reopen | INBOX-001~003 |
| AC-STATE-003 | RebuildStatus | Requested→…→终态按单 phase/batch | 跨 phase、终态复活 | REC-002/006 |
| AC-STATE-004 | Generation role/safety | Candidate/Current/Retired 与 Unverified/Validated/SafetyBlocked 双轴一致 | Retired 回 Current、unsafe promote | STATE-002/REC-003 |
| AC-STATE-005 | read/commit/availability | freshness、coverage、visibility、commit resolution 各轴独立 | stale冒fresh、Pending当rollback、Bound当ready | STATE-003 |
| AC-STATE-006 | atomic write sets | source/local/provision/recovery/invalidation 写集全有全无 | 半 cursor/Inbox/FK、跨 partition 假原子 | TXN-001~003 |
| AC-STATE-007 | idempotency/unknown | same digest 原值 replay；异 digest Conflict；Unknown 先 resolve | 二次效果、缺行判 rollback、盲重做 | IDEM/SRC-005 |
| AC-STATE-008 | cursor axes | source/view/read/page/generation 不可互换 | token 当授权或跨轴推进 | CONTRACT-002/PAGE |

## 3. 状态/事务停审

所有状态名使用 03 正式 variant；每 AC 都有 flow、TC、EV 和 report path。失败时检查 persisted snapshot、operation/source record、version 与副作用，而非只看 response。无旧口语状态名或后续 phase 越界。

## 4. 回填与进入下一步

正式 §8 回填八项 AC、原子性/幂等/并发规则；跨状态审计通过，允许 Step9。
