# L1-workspace 00 需求 Step 12：接口与依赖

> 状态：`done / pass_with_blockers`；回填位置：正式 §12

需求层只定义能力级边界，不锁 route、DTO、payload、port、transport、数据库或 worker。

| 类型 | 能力接口 | 输入/输出语义 | 依赖类别 |
|---|---|---|---|
| Query | scope/read model query | 输入 principal/scope/view selector；输出 read model、provenance、coverage、status。 | runtime/ref；no-write |
| Query | owner safe source query | 输入 source selector；输出 safe summary/ref、version/watermark、visibility context。 | runtime/ref；owner contract pending |
| Change | local attention state | 输入 read/pin/mute/preference/focus change；输出 workspace local result/version。 | local command；不得转为上游 command |
| Event input | owner fact change | 输入经 Bus 传递的已授权变化；输出 projection apply/gap/duplicate 结论。 | event；family/cursor pending |
| Background | refresh/rebuild/diagnostics | 输入 gap/invalidation/maintenance trigger；输出 attempt/generation/status。 | runtime/adapter；replay/baseline pending |
| Reference/export | product/SDK/sync/archive read handoff | 输出稳定 ref、revision、coverage 和降级状态。 | adapter/ref；下游 contract pending |

## 2. 依赖边界

`L0-core` 是唯一 compile 候选；`L0-bus` 为 event seam；各 L1 owner 为 runtime/ref/event 输入；SDK/product/sync/archive 为下游 adapter/ref。禁止将运行期或事件协作写入 Cargo path dependency，禁止共享数据库或反写 owner truth。

## 3. Blocker

`WS-UP-001/002/003/005/006/007` 使 exact query、event、visibility、replay、export schema 继续 pending；需求层只保留能力级上限。

## 4. 门禁

```text
gate_status = pass_with_blockers
next_allowed_action = create_step_13_non_functional_requirements
```
