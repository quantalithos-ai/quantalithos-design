# Step 3. 固定验收基线

> 对应 SOP：standards/document/验收标准讨论流程_SOP.md Step 3
> 回填章节：06-验收标准.md §3
> 粒度参考：projects/L1-governance/design-calibration/06_acceptance_step_03_baseline.md

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 3 固定验收基线 |
| 当前状态 | 已完成；本轮连续授权并保留独立停审记录 |
| 输入基线 | Step 1~2；04 §6~§12；05 §8、§12、§13、§14 |
| 输出文件 | projects/L2-member/design-calibration/06_acceptance_step_03_baseline.md |

## 2. 本步目标

固定正式验收必须绑定的文档、交付、Core、环境、配置、数据、run、artifact、report 和 acceptance handoff 基线，同时明确当前设计阶段没有真实值。

## 3. 本步输入

| 输入 | 用途 | 当前事实等级 |
|---|---|---|
| Step 1~2 | 输入边界与验收范围 | 已校准 |
| 05 §8 | profile、配置、依赖和数据集 | planned |
| 05 §12~§14 | 进入退出、证据、回归和 residual | planned |
| 04 §6~§12 | profile、config source、validation、生效和降级 | planned |

## 4. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 按哪一版需求和设计验收？ | 当前正式 00-需求文档.md、01-架构设计.md、02-概要设计.md、03-详细设计.md、04-配置设计.md、05-测试方案.md；正式执行前记录每份 source ref / design commit。 |
| 按哪一版测试方案和结果裁决？ | 按当前正式 05；结果必须绑定一个非 latest 的固定 run_id，并由 reports / artifacts pair 支撑。 |
| 送验 build / commit / image 是什么？ | 当前没有送验交付物；未来必须固定 implementation commit / build id / image digest（若该 image 属 owner）和 L0-core source ref。 |
| 环境、配置、数据和依赖是什么？ | P0 profile 只能从 local-dev、ci-test、integration-like、operations-replay 中按目的选择；配置 digest、fixture / replay root、依赖分类和 slot posture 必须记录。 |
| 基线变更如何处理？ | 影响 P0 的 00~05、实现、Core、profile、config digest、suite、report schema 或 EV schema 变更触发新的固定 run 和 05 §14 回归。 |
| 当前 run_id 是什么？ | 未分配；本轮只固定格式 <run_id>，不生成伪造值。 |
| raw artifact / report / acceptance 路径是什么？ | 分别为 artifacts/test/<run_id>/...、reports/runs/<run_id>/... 和 reports/acceptance/{handoff.md,veto-checklist.md,risk-acceptance.md}。 |
| 是否允许 latest 或 project 子目录路径？ | 不允许；latest、reports/<project>/...、artifacts/test/<project>/<run_id>/... 和无 digest pair 均不是正式基线。 |

## 5. 当前文档问题诊断

| 位置 | 问题 | 处理 |
|---|---|---|
| 旧 06 | 使用“当前批次 / test / staging”泛化基线 | 改为 source ref、profile、config digest、run 和路径约束 |
| 05 | 只有 planned schema，无真实 run | 06 记录为验收前置缺口 |
| 04 | profile / config 设计无执行 digest | 送验时补固定 digest；不在设计阶段推断 |

## 6. 改动前后对比

| 项 | 旧口径 | 新口径 |
|---|---|---|
| source | 泛化“当前版本” | 每份 00~05 的固定 source ref |
| run | latest / 未绑定 | 非 latest 的唯一 run_id |
| evidence | report 名称 | raw artifact + run report + digest + EV index |
| handoff | 无固定入口 | reports/acceptance/* 固定入口 |

## 7. 验收裁决取舍

| 议题 | 方案 | 结论 |
|---|---|---|
| 当前填写 source ref | 推断 / 留占位 | 留占位，正式送验前固定 |
| 当前生成 run | 生成示例 / 不生成 | 不生成 |
| profile 不可用 | 视为通过 / fail-fast 或 blocked | fail-fast / blocked，不能静默回退 |

## 8. 结构化中间产物

### 8.1 验收基线表

| 基线类型 | 内容 | 版本 / 标识 | 当前状态 |
|---|---|---|---|
| 需求 / 设计 | 00~04 | source ref / design commit 待固定 | planned |
| 测试方案 | 05-测试方案.md | source ref 待固定 | planned |
| 标准 | 验收 SOP、书写规范、真相源标准 | standards ref 待固定 | planned |
| 交付物 | implementation commit / build / owner image digest | 待固定 | not available |
| Core | core-contracts source ref / package version | 待固定 | not available |
| 环境 / 配置 | P0 profile + config digest | 待固定 | planned |
| 数据 | DS-L2M-* fixture / replay root | run namespace 待固定 | planned |

### 8.2 证据入口基线

| 入口 | 固定路径 | 必须满足 |
|---|---|---|
| raw artifact | artifacts/test/<run_id>/... | 真实机器产物、digest、suite output |
| run report | reports/runs/<run_id>/... | summary、suite、gate、EV、redaction、dependency、report audit |
| acceptance handoff | reports/acceptance/handoff.md | 送验范围、source refs、未覆盖项 |
| VETO checklist | reports/acceptance/veto-checklist.md | 每项 VETO 有真实检查结论 |
| risk acceptance | reports/acceptance/risk-acceptance.md | 每项 residual 有 owner、acceptor、deadline / trigger |

## 9. 回填草稿

正式 §3 应保留上述基线表与路径表，并明确当前没有真实 source ref、run、artifact、report、evidence 或 verdict。

## 10. 待确认事项

| 事项 | 影响 | 当前处理 |
|---|---|---|
| implementation / image baseline | 影响送验资格 | 未生成，待实施和 owner 合同 |
| run_id / config digest | 影响所有 EV | 执行前固定 |
| artifact retention | 影响复核期限 | 后续运维 / 验收交接确定 |

## 11. 进入下一步条件

- [x] 基线内容和固定格式可定位。
- [x] 禁止 latest、泛化环境和无 report pair 的规则已明确。
- [x] 当前未伪造任何执行值。
