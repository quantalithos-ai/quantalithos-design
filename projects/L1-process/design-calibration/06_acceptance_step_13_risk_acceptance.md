# Step 13. 定义风险接受与遗留项

> 回填章节: `06-验收标准.md` §13 风险接受与遗留项
> 状态: Completed

## 1. 本步输入

| 输入 | 用途 |
|---|---|
| `05` §14 | 残余风险和 P1/P2 风险 |
| `04` §14 | 配置 P1/P2 风险 |
| Step 11 / Step 12 | 不可接受风险边界 |

## 2. SOP 问题回答

1. 什么风险可接受?
   回答:P1 real-like smoke 不阻断、performance hard threshold 未定、production adapter 产品未定、remote config / hot reload 后置等。
2. 什么风险不可接受?
   回答:veto、S 级、P0 evidence missing、redaction fail、fake production success、核心边界被配置关闭。
3. 风险接受记录必须包含什么?
   回答:接受人、owner、影响、后续动作、截止时间、tracking ref 和退出条件。

## 3. 当前文档问题诊断

旧文档的遗留项没有接受人、owner、截止条件和不可接受风险边界。

## 4. 结构化中间产物

| 风险 ID | 风险 | 是否可接受 | 要求 |
|---|---|---|---|
| `RA-PROC-001` | P1 real-like adapter smoke 未跑或失败 | 可有条件接受 | 不影响 P0;不得伪装 production success |
| `RA-PROC-002` | performance hard threshold 未定 | 可有条件接受 | 有 sample report;后续性能基线 |
| `RA-PROC-003` | production durable store / bus / secret provider 未定 | 可接受为 P1/P2 | P0 使用 fake / in-memory marker |
| `RA-PROC-004` | remote config / hot reload 未实现 | 可接受为 P2 | P0 启用即 fail-fast |
| `RA-PROC-NO-001` | 任一 `VF-PROC-*` failed | 不可接受 | 只能不通过 |
| `RA-PROC-NO-002` | redaction failed 或 raw secret / body 命中 | 不可接受 | 只能不通过 |
| `RA-PROC-NO-003` | P0 evidence index 缺失 | 不可接受 | 只能不通过 |

## 5. 回填草稿

§13 列出风险接受条件、候选风险、不可接受风险和最小记录字段。

## 6. 待确认事项

真实接受人名单由送验评审填写。
