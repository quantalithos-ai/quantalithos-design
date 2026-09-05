# Step 4. 定义进入条件与退出条件

> 对应 SOP：standards/document/验收标准讨论流程_SOP.md Step 4
> 回填章节：06-验收标准.md §4
> 粒度参考：projects/L1-governance/design-calibration/06_acceptance_step_04_entry_exit.md

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 4 定义进入条件与退出条件 |
| 当前状态 | 已完成；本轮连续授权并保留独立停审记录 |
| 输入基线 | Step 3；05 §12~§14；04 profile / validation / degradation |
| 输出文件 | projects/L2-member/design-calibration/06_acceptance_step_04_entry_exit.md |

## 2. 本步目标

定义验收何时可以开始、何时可以结束、何时必须暂停或判定不可裁决。条件必须可检查，不能用“基本可用”“大体正常”等模糊谓词。

## 3. 本步输入

| 输入 | 关键内容 |
|---|---|
| Step 3 基线 | source ref、交付、profile、config、data、run、artifact / report 路径 |
| 05 §12 | 测试进入 / 退出、暂停和 blocker 规则 |
| 05 §9 / §13 | blocking suite、EV schema、report audit |
| 00 AC / VF | P0 门禁和一票否决红线 |

## 4. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 开始验收前哪些基线必须确认？ | 正式 00~05 source ref、实现 / Core baseline、profile / config digest、fixture / replay root、固定 run_id 和 artifact/report root 必须全部可定位。 |
| 哪些证据必须先生成？ | 所有 P0 blocking suite 的真实 suite artifact / report、evidence-index、gate-results、redaction-check、dependency-boundary、report-audit，以及 acceptance handoff / VETO checklist。 |
| 哪些缺陷阻断进入？ | 未分类的 P0 失败、S 级缺陷、redaction / dependency / report integrity 失败、必需 slot 不可用却标通过、设计字段无法 1:1 落码。 |
| 退出需要哪些结论？ | 每个 P0 AC 有通过 / 失败 / 不适用且有理由；每个 VF 有真实检查；证据完整；S=0；A 级已修复或合法接受；residual 有责任人与接受人。 |
| 哪些风险必须先接受？ | 只有不触发 VETO、S 或 P0 truth / security / evidence 红线的 residual 可在有条件通过前接受；没有接受人不得关闭。 |

## 5. 当前文档问题诊断

| 问题 | 处理 |
|---|---|
| 旧 06 只写“02/03/05 冻结” | 改为可验证 source / run / artifact / report / handoff 条件 |
| 旧文档没有暂停条件 | 增加 blocker、证据缺失、schema 不可落码和 redaction 失败暂停 |
| 当前设计阶段没有真实结果 | 退出条件保持未满足，不把设计完成当验收通过 |

## 6. 改动前后对比

| 项 | 改动前 | 改动后 |
|---|---|---|
| 进入 | 泛化 test / staging | 固定 source、run、profile、data、artifact / report |
| 退出 | 功能“正常” | AC / VF / defect / evidence 全部可判定 |
| 不可用 | 默认为失败或成功 | 按依赖类型进入 blocked / not_run / residual |

## 7. 验收裁决取舍

| 议题 | 方案 | 结论 |
|---|---|---|
| 缺少真实 run | 允许设计级通过 / 暂停正式验收 | 暂停，不进入正式裁决 |
| P1 owner unavailable | 计为 P0 失败 / 记录 residual | 记录 residual；除非本轮明确把该 seam 提升为 P0 |
| P0 evidence 缺失 | 口头说明 / 阻断 | 阻断 |

## 8. 结构化中间产物

### 8.1 进入条件

- [ ] 当前正式 00~05 的 source ref / design commit 已固定。
- [ ] implementation commit / build id / 适用 image digest 已固定。
- [ ] Core source ref / package version 已固定。
- [ ] P0 profile、config digest、fixture / replay root 和 dependency posture 已固定。
- [ ] 非 latest 的 run_id 已固定。
- [ ] artifacts/test/<run_id> 与 reports/runs/<run_id> 存在真实配对产物。
- [ ] P0 blocking suite、redaction、dependency、report audit 已运行并保留失败理由。
- [ ] reports/acceptance/handoff.md 和 veto-checklist.md 已由审查者补充；存在 residual 时有 risk-acceptance.md。

### 8.2 退出条件

- [ ] 每个 P0 AC 有通过 / 失败 / 不适用的正式结论和证据。
- [ ] VF-L2M-001~009 均由真实证据证明未触发，或命中后结论为不通过。
- [ ] 所有 P0 suite 有 artifact / report pair、failure reason 和 digest。
- [ ] Query no-write、Job no-source-truth-repair、duplicate / conflict / unknown / CAS / rollback 均可回链。
- [ ] 无 raw body、secret、hidden reasoning、foreign body、full stack trace 或高基数敏感标签。
- [ ] S 级缺陷为零；影响 P0 的 A 级缺陷已修复并复验，或验收不退出。
- [ ] P1/P2、upstream blocker 和 DDD gap 已进入 open issues / risk acceptance，且不被写成 P0 pass。

### 8.3 暂停 / 不可裁决条件

| 条件 | 处理 |
|---|---|
| source ref、run、artifact、report 缺失 | 暂停；不得填写通过 |
| P0 suite 失败但未分类 | 暂停，先按 Step 12 分级 |
| owner schema / route / credential / subject 未闭合 | 受影响 lane blocked / not_run |
| redaction 或 dependency 失败 | 直接阻断；不得风险接受 |
| 设计字段 / 状态 / helper 无法 1:1 落码 | 回写 owning 03/04，不在 06 临时补 schema |

## 9. 回填草稿

正式 §4 应使用可勾选的进入 / 退出 / 暂停清单，并明确本轮设计阶段尚未满足真实验收进入条件。

## 10. 待确认事项

| 事项 | 影响 | 当前处理 |
|---|---|---|
| 真实送验 baseline | 所有 P0 结论 | 待实施阶段固定 |
| acceptance handoff 审查人 | 交接有效性 | 执行时指定 |
| residual 接受人 | 有条件通过 | 缺失则不得有条件通过 |

## 11. 进入下一步条件

- [x] 进入、退出和暂停条件均可检查。
- [x] 缺证据不被默认为通过。
- [x] blocker 与真实失败的 disposition 已分开。
