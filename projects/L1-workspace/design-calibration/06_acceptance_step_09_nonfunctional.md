# Step 9. 定义非功能验收门禁

## 1. Step 状态

`completed / baseline_pending`。

## 2. 非功能验收表

| AC | 维度 | 通过条件 | 失败条件/当前上限 | 证据 |
|---|---|---|---|---|
| AC-NFR-001 | 正确性/可追溯 | 每个 view/projection/local/recovery/export 可回链 source/visibility/revision/coverage | 无 basis 标 fresh；缺 ref 继续展示 | STATE/QRY/BOUND |
| AC-NFR-002 | 一致性/幂等 | 写集原子、duplicate 原值、Unknown Pending、Gap 非terminal | 半提交、二次 apply、静默跳 gap | TXN/IDEM/SRC |
| AC-NFR-003 | 安全/最小化 | current visibility、hidden metadata/secret/body 零泄漏 | missing decision 仍展示或 redaction 失败 | VIS/SEC |
| AC-NFR-004 | 可用性/退化 | stale/partial/blocked/unavailable/Unknown 正交可解释 | 伪空成功、blocked冒充ready | QRY/STATE/CONFIG |
| AC-NFR-005 | 资源有界 | 使用 04 profile 的 L/L+1；超限拒绝或显式 continuation | clamp、截断 Complete、无界循环 | RES/CONFIG |
| AC-NFR-006 | 可演进/依赖 | unknown version 安全拒绝；无 shadow schema、非 core compile、fake fallback | 猜字段、错误 dependency type | CONTRACT/DEP |

## 3. 数值基线边界

P95、吞吐、容量、SLA、RTO/RPO、retention 没有正式 workload/baseline，保持 pending；不能用 local fake 或 telemetry 生成阈值 verdict。

## 4. 回填与进入下一步

正式 §9 回填六项 AC、来源与 pending 规则；非功能方法可裁决，允许 Step10。
