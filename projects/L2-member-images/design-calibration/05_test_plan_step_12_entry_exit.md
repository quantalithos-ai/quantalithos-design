# L2-member-images 05 测试方案 Step 12：进入准则与退出准则

> 状态：`completed`
> 对应 SOP：`standards/document/测试方案讨论流程_SOP.md` Step 12
> 回填位置：正式 `05-测试方案.md` 第 12 章

## 0. Step 状态与输入

| 项目 | 记录 |
|---|---|
| 本步目标 | 定义何时可开始执行、何时可结束并交接 06，且把 blocker、未实现和证据缺口从 pass 条件中排除。 |
| 本步输入 | Step 1~11；03/04 当前状态；测试规范 §5.12；06 仍为 historical material。 |
| 本步输出 | 可判定进入清单、退出清单、blocked 处理和停审交接规则。 |
| gate_status | `pass_with_explicit_blockers` |

## 1. 进入准则

进入测试执行前必须全部满足：

- [ ] 当前 00~04 版本、对应 calibration 和本方案版本已被项目门禁确认；任何未确认设计差异已登记。
- [ ] 目标实现仓、工具链、测试框架和可写证据目录由后续 07/执行 owner 核验；本方案不代替核验。
- [ ] P0 fixture 可按 Step 7 重复构造，隔离键和清理策略明确，禁止数据已脱敏。
- [ ] `local-dev`/`ci-test` 配置可严格解析；invalid config、fake/profile 混用和 raw secret 负向样本齐备。
- [ ] P0 suite、TC、EV、脚本和报告路径有规划映射；没有实际路径时测试必须停止，不得手工补证据。
- [ ] B01/B02、PF、MI-UP、Q-MI 的受影响 lane 已标记；执行者知道只能得到 zero-effect/no-write/marker/blocked 结论。

## 2. 退出准则

只有在未来执行阶段同时满足以下条件，才可把测试报告交给 06：

- [ ] 所有 P0 planned TC 已执行或有正式 blocker 记录；未执行项不能标成通过。
- [ ] 所有 S 级/VETO 用例通过；Query no-write、inbound marker-only、outbound zero 和 redaction/dependency gate 无违规。
- [ ] P0 阻断缺陷为 0，A 级缺陷有修复证据或 06 明确风险接受；B/C 级有跟踪。
- [ ] 每个 suite 产出固定 run 的 artifacts、report 和 EV→TC→需求索引；没有 `latest` 引用。
- [ ] 外部 owner 未闭合的正向 lane 明确为 blocked/pending，不被纳入 readiness 或 release pass 分母。
- [ ] 退出报告与 06 的验收引用、残余风险和 signoff 角色完成交接；本方案不代写裁决。

## 3. Blocked 与停审处理

| 情况 | 处理 | 是否算通过 |
|---|---|---|
| 实现仓/环境不存在 | 标记 `environment_blocked`，停止该 suite | 否 |
| owner contract 未闭合 | 标记对应 `MI-UP/Q-MI`，保留 negative seam | 不算正向通过 |
| B01/B02/PF 未闭 | 只执行可合法的 zero-effect/no-write/blocked TC | 不解除 blocker |
| 证据路径或报告生成失败 | suite failure，重新执行/修复工具 | 否 |

## 4. 改动前后、回填草稿与进入下一步条件

旧 `05` 以“功能完成”作为结束；本轮把设计基线、证据、VETO、blocker 和验收交接拆开。正式 §12 回填清单与表格。进入 Step 13 的条件是准入/退出均可操作判定且没有隐含 readiness。
