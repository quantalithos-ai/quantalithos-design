# Step 4. 定义进入条件与退出条件

> 回填章节: `06-验收标准.md` §4 进入条件与退出条件
> 状态: Completed

## 1. 本步输入

| 输入 | 用途 |
|---|---|
| `05` §12 | 测试进入 / 退出准则 |
| `05` §9 / §13 | gate、artifact、report 和 evidence |
| 验收规范 | 三值结论和风险接受 |

## 2. SOP 问题回答

1. 进入验收前必须具备什么?
   回答:固定文档 / 实现 / 构建 / 环境 / 配置 / 数据 / run_id,生成 gate report、evidence index、redaction report 和 acceptance handoff。
2. 退出验收时必须裁决什么?
   回答:§5~§10 P0 门禁、§11 veto、缺陷、风险接受和最终三值结论。

## 3. 当前文档问题诊断

旧文档把测试通过近似等同验收通过,缺少 evidence / veto / risk / signoff 的裁决边界。

## 4. 结构化中间产物

| 条件组 | 进入条件 |
|---|---|
| 基线 | design commit、implementation commit、build、core baseline 固定 |
| 环境配置 | environment id、config digest、dataset digest 固定 |
| 证据 | `reports/runs/<run_id>/evidence-index.md`、`gate-results.md`、`redaction-check.md` 可读 |
| 交接 | `reports/acceptance/handoff.md`、`veto-checklist.md`、`risk-acceptance.md` 可读 |
| 缺陷 | S 级和 P0 A 级缺陷为 0 |

| 条件组 | 退出条件 |
|---|---|
| 门禁 | §5~§10 P0 门禁逐项判定 |
| veto | §11 全部未触发 |
| 缺陷 | S=0;P0 A=0;B/C 有处理计划 |
| 风险 | 有条件通过必须有风险接受记录 |
| 签署 | 最终结论绑定 baseline、run_id 和 reports |

## 5. 回填草稿

§4 使用清单表达进入和退出条件,强调测试退出不自动等于验收通过。

## 6. 待确认事项

无阻塞项。
