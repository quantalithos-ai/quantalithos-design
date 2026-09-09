# Step 3. 固定验收基线

## 1. Step 状态

`completed / fixed_run_required`。基线结构已定义，真实版本和 run 尚不存在。

## 2. 基线表

| 基线类别 | 固定内容 | 当前值 |
|---|---|---|
| 需求 | `00-需求文档.md` | formal stop_review |
| 架构/概要/详细 | `01`、`02`、`03` | formal stop_review |
| 配置 | `04-配置设计.md` | formal stop_review |
| 测试 | `05-测试方案.md` | formal stop_review；59 TC/EV slots |
| 实现 revision | 目标实现仓 revision | 未存在/未核验 |
| environment profile | local/test/staging/production | 由 04 固定；真实绑定 pending |
| data/conformance | DS-WS-* 与 owner vectors | 逻辑设计；owner vectors blocked |
| evidence run | `<run_id>` | 未生成；禁止 `latest` |

## 3. 证据入口基线

未来每个 P0 AC 必须回指 `reports/runs/<run_id>/evidence-index.md`、对应 suite report 和 `artifacts/test/<run_id>/cases/<TC-ID>.json`；redaction、integrity、gate-results 和 acceptance handoff 也必须来自同一 run。当前没有任何实例。

## 4. SOP 问题回答与取舍

固定文档版本与设计 refs，运行时再固定实现 revision、profile、data revision、runner version 和 run_id；不把当前日期或 planned path 当证据。缺任一 required source，AC 为 blocked/not_run。

## 5. 回填草稿

正式 §3 写明验收基线字段、固定 run 规则、禁止 latest/跨 run 拼接和当前“无实例”事实。

## 6. 进入下一步条件

基线分层、证据入口和缺失处理已可判定；允许 Step4。
