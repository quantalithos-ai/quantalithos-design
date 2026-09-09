# L1-workspace 00 需求 Step 7：核心能力闭环

> 状态：`done / pass_with_blockers`；回填位置：正式 §7

## 1. 仓存在必要性

没有 workspace，产品和同步方会各自聚合跨域数据、解释可见性和维护未读状态，造成多套 read model、来源版本不可解释和越权风险。workspace 的成立条件是“可验证 scope + owner-safe query + 可维护投影 + workspace local state + 可重建/降级读取”共同成立。

## 2. 能力节点与顺序

```text
C-WS-1 scope/principal 语境
        -> C-WS-2 owner query 与 visibility 裁剪
        -> C-WS-3 event/cursor 投影维护
        -> C-WS-4 可解释 read model
        -> C-WS-5 workspace-only attention state
        -> C-WS-6 refresh/rebuild/degraded closure
```

| 节点 | 进入条件 | 退出条件 |
|---|---|---|
| C1 | principal/scope selector 可受理 | scope/ref/visibility 基础可验证，否则 fail-closed。 |
| C2 | owner safe query 可调用 | source version/watermark/coverage 可解释。 |
| C3 | baseline 或 owner event 可用 | cursor、幂等、乱序、gap 结果可判断。 |
| C4 | projection 有 provenance | 返回 view revision、coverage、降级状态。 |
| C5 | local state scope 已绑定 | read/unread/pin/mute 等不越权、不回写。 |
| C6 | gap/invalidation/refresh 已发现 | rebuild generation、cutover 或 blocked 结果可解释。 |

外围增强：搜索、统计、历史比较、预测性 ranking、archive freeze。边界外：所有 L1 truth、授权裁决、业务命令、runtime/tools/sandbox、SDK/UI/cache、archive truth。

## 3. 门禁

```text
gate_status = pass_with_blockers
next_allowed_action = create_step_08_user_stories
```
