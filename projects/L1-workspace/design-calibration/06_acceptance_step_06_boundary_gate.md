# Step 6. 定义数据边界与架构红线验收

## 1. Step 状态

`completed / veto_candidates_fixed`。

## 2. 架构红线验收表

| AC | 红线 | 通过条件 | 失败条件 | 证据 |
|---|---|---|---|---|
| AC-BOUND-001 | owner truth 所有权 | persisted fields 仅 workspace view/projection/local/recovery/safe refs | 保存 identity、conversation、work、process、governance、artifact、runtime、tools、archive truth | BOUND-002 / EV-WS-BOUND-002 |
| AC-BOUND-002 | Query no-write | 6 Query 与 owner safe query 写调用=0 | 初始化、refresh、read cursor/last_opened 或 audit 写 | QRY/BOUND-001 / EV-* |
| AC-BOUND-003 | visibility owning chain | current decision 缺失/冲突/撤销时 fail-closed | 本地 allow bool、旧 token 授权、hidden metadata 泄漏 | VIS/SEC / EV-* |
| AC-BOUND-004 | 禁止反写/出站 | projection/maintenance/export 无 owner mutation、outbound event、outbox、archive handoff | 任一调用或持久字段出现 | BOUND-001/003 |
| AC-BOUND-005 | 依赖裁剪 | 仅 L0-core 为 compile candidate，其他为 runtime/event/ref/adapter/fake | sibling path dependency、共享表/跨仓事务、production fake fallback | DEP-001/002 |

## 3. 不得由本仓保存的外部真相

L1 正文、策略/授权决定、对话/成员/项目/流程生命周期、runtime/tool/capability/sandbox、SDK/client/cache、产品 UI、archive package/freeze/restore/accepted state 均外置。workspace 只能保存安全引用、来源版本、visibility binding 和局部派生状态。

## 4. 回填与审计

正式 §6 使用五项 AC；任一红线失败直接触发 VETO，不进入风险接受。跨红线审计无遗漏，允许 Step7。
