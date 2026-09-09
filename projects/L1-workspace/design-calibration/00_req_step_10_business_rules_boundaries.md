# L1-workspace 00 需求 Step 10：业务规则与边界约束

> 状态：`done / pass_with_blockers`；回填位置：正式 §10

| ID | 类型 | 规则 | 保护能力 |
|---|---|---|---|
| `BR-WS-001` | 不变量 | workspace 只拥有 view/projection/local state，不拥有任何 L1 truth。 | C1~C6 |
| `BR-WS-002` | 边界 | 所有 source query 必须 no-write，不得共享表或事务。 | C2 |
| `BR-WS-003` | 安全 | visibility/membership/治理决定来自 owner；缺失/冲突/撤销时 fail-closed。 | C1/C2/C4 |
| `BR-WS-004` | 一致性 | source cursor、view revision、read cursor 三者不可互相替代。 | C3/C4/C5 |
| `BR-WS-005` | 幂等 | 重复 source input 不得重复产生投影事实或 unread。 | C3 |
| `BR-WS-006` | 乱序 | 无法证明版本顺序时必须保留 conflict/gap，不得猜补。 | C3 |
| `BR-WS-007` | 显式变化 | invalidation、refresh、rebuild 和 generation cutover 必须可追溯。 | C6 |
| `BR-WS-008` | 局部状态 | pin/mute/read/preference 只能作用于绑定 principal/scope 的 workspace state。 | C5 |
| `BR-WS-009` | Inbox | 只有 owner 明示 attention input 才能形成 InboxItem；workspace 不推断 priority。 | C4/C5 |
| `BR-WS-010` | 降级 | stale、partial、blocked、fail-closed 必须可区分，不得压平为空或 ready。 | C4/C6 |
| `BR-WS-011` | 禁止 | projection、query、维护和导出不得反写上游 truth。 | 全部 |
| `BR-WS-012` | 依赖 | runtime/event/ref/adapter/fake 不得写成 compile；fake 不证明集成。 | C2/C3/C6 |

## 2. 一票否决候选

将 workspace view 当作身份/成员/授权/业务 truth；缺 visibility 默认展示；query 修改事实；cursor gap 静默跳过；stale 冒充 fresh；projection 反写 owner；伪造未闭合 event/query 合同，均应否决。

## 3. 门禁

```text
gate_status = pass_with_blockers
next_allowed_action = create_step_11_data_ownership
```
