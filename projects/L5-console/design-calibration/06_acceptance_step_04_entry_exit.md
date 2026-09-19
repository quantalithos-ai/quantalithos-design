# Step 4. 定义进入条件与退出条件

> 对应 SOP：`standards/document/验收标准讨论流程_SOP.md` Step 4  
> 回填章节：`06-验收标准.md` §4 进入条件与退出条件

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 4 定义进入条件与退出条件 |
| 当前状态 | `done / pass / self_reviewed` |
| 输入基线 | Step 3；正式 05 §11～§14 |
| 输出文件 | `design-calibration/06_acceptance_step_04_entry_exit.md` |
| 当前准入结果 | `not_entered / blocked_by_missing_baseline` |
| 下一动作 | 只允许进入 Step 5 calibration |

## 2. 本步计划与目标

本步把“准入前置”“暂停/送验无效”“准出门禁”分开，建立验收生命周期。设计校准能继续，不代表实际验收可进入；三值 verdict 只有在进入后、证据完整并完成裁决时才产生。

## 3. 本步输入

| 输入 | 用途 |
|---|---|
| Step 3 baseline manifest | 检查实际准入是否具备 |
| `05` §11 | S/A/B/R 与复验阻断 |
| `05` §12 | future 测试进入/退出/暂停条件 |
| `05` §13 | artifact/report/evidence 资格 |
| `05` §14 | full P0、residual 和不可接受项 |
| `00` 七 VETO | 准出前一票否决检查 |

## 4. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 开始验收前哪些基线必须确认？ | Step 3 的 design、delivery、environment、config/facet、data/dependency、fixed run、review baseline 必须完整且相互一致。 |
| 哪些测试证据必须先生成？ | 全部 in-scope P0 blocking suites/checks 的 raw artifact、run reports、八 EV families 的合格 instance/blocked 状态、pairing/redaction/no-static-evidence 结果。 |
| 哪些缺陷阻断进入？ | 任一未关闭 S、P0 baseline/suite/runner 不可装配、run mismatch、redaction/dependency/evidence-integrity failure、VETO 修复未复验。 |
| 退出需要哪些结论？ | 每个 in-scope P0 门禁有结论，七 VETO 均有证据，缺陷/复验/风险明确，evidence 完整，三值 verdict 和 signoff 完成。 |
| 哪些风险必须先接受？ | 仅允许的 A/B/R residual 若支撑有条件通过，必须有逐项 acceptor/owner/deadline/follow-up；VETO/S/P0 证据完整性不可接受。 |

## 5. 当前文档问题诊断

| 旧问题 | 处理 |
|---|---|
| 进入条件只有“实现/测试完成”等泛化描述 | 改为可定位 baseline + fixed run + evidence checks |
| 缺少 not_entered 与 failed 的区分 | 建立验收生命周期 |
| 空签署表可被误当作准出 | signoff 必须绑定 decided verdict 与 review version |
| blocked positive 易被当失败或通过 | 按 baseline enabled manifest 判定 |
| evidence 缺失只作为普通缺陷 | 作为准入/送验有效性硬门禁，必要时 S 级 |

## 6. 改动前后对比

| 项 | 旧 | 新 | 原因 |
|---|---|---|---|
| 生命周期 | 无 | `not_entered→entered→decision_pending→decided` | 避免文档状态混入 verdict |
| 准入 | 泛化 checklist | baseline + execution + evidence integrity | 可判定 |
| 暂停 | 未定义 | run/pair/redaction/baseline drift 明确暂停 | 防止坏证据继续裁决 |
| 准出 | 缺陷/签署泛化 | 全 P0/VETO/evidence/risk/signoff 闭环 | 可复验 |

## 7. 验收裁决取舍

| 议题 | 裁决 |
|---|---|
| 缺 baseline 是“不通过”吗 | 在尚未进入时不是三值 verdict，而是 `not_entered/blocked`; 已进入后关键 baseline 丢失则暂停并使裁决无效 |
| selected 环境不可用是否阻断 | 只有 baseline/authority 将其声明 release-required 时阻断；否则 residual，不贡献 positive |
| conditional facet disabled 是否允许准出 | 若 baseline 明确未启用且安全 posture/证据合格，允许；不得写成 positive integrated |
| 可否风险接受 S/VETO/evidence fraud | 不可 |
| 可否用一次成功 run 覆盖失败 run | 不可；失败保留，复验新 run 并显式关联 |

## 8. 结构化中间产物

### 8.1 验收生命周期

```text
not_entered
  -- all entry conditions satisfied --> entered
entered
  -- evidence and gate review complete --> decision_pending
entered / decision_pending
  -- baseline/evidence invalid --> suspended (return to entered only after new valid run)
decision_pending
  -- three-value verdict + required signoff --> decided
```

关键说明：

- `formal_stop_review` 是文档状态，不在该生命周期内。
- `not_entered`、`entered`、`decision_pending` 不是“通过/有条件通过/不通过”。
- `decided` 必须保存三值 verdict，不能保存“待补证据”。
- 新 baseline 或复验 run 可能使既有决定失效并开启新验收实例。

### 8.2 进入条件

- [ ] 正式 00～06 的 immutable design source ref 与适用范围已固定。
- [ ] implementation commit 与适用 delivery build/image/package digest 已固定；不适用项有理由。
- [ ] environment ref、runner/tool versions、SDK/host/owner dependency refs 可定位。
- [ ] 一个正式 profile 与完整 strict config document/config digest 已固定；恰好四项配置，禁止隐式 default profile。
- [ ] facet manifest 逐项声明 enabled/disabled/blocked；enabled facet 有 exact contract/authority。
- [ ] fixture/data/synthetic leak corpus/scheduler manifest 可复现且不含真实敏感正文。
- [ ] fixed `run_id` 明确且不是 `latest`；P0 suite/check manifest 与 blocking classification 固定。
- [ ] 所有 P0 blocking suites/checks 已产生同 run raw artifacts 和 reports；失败/blocked 也必须保真归档。
- [ ] evidence index、pairing、redaction、no-static-evidence、architecture/dependency 结果均存在且可读。
- [ ] handoff、VETO checklist、open issues 已生成并经审查；有 residual 时 risk-acceptance 文件存在。
- [ ] 无未关闭 S、未复验 VETO 修复、静态 evidence、run mismatch、缺 artifact/report pair 或伪 signoff。

当前逐项结果：上述送验条件均未实际满足，因为实现与执行基线不存在；实际验收保持 `not_entered / blocked_by_missing_baseline`。

### 8.3 暂停 / 送验无效条件

| 触发 | 生命周期处理 | 后续动作 |
|---|---|---|
| baseline 字段缺失或互相矛盾 | 不进入 / 暂停 | 固定新 baseline |
| design/implementation/config/dependency 变更 | 当前 run 不再覆盖 | 影响分析、必要设计回写、新 run |
| P0 runner/suite/check 无法执行 | 不进入 / 暂停 | 修复 harness，不得 skip-pass |
| artifact/report 缺失、run mismatch、digest/pairing 失败 | 送验无效；S | 修复生成链并新 run |
| redaction/forbidden material/私有依赖失败 | 暂停；S/VETO 候选 | 修复并全量 P0 |
| enabled facet 缺 exact contract/positive evidence | 对应范围失败或不可进入 | fail-closed，补 authority/证据 |
| selected facet unavailable 且非 release-required | 不暂停 P0 | 记录 residual，不生成 positive EV |
| VETO 命中/未关闭 S | 不得进入决定或准出 | 修复、全量复验 |

### 8.4 退出条件

- [ ] 所有当前 in-scope P0 验收项均有明确 passed/failed/not-applicable-with-authority 的 item result；blocked 只按基线规则解释。
- [ ] `AC-CON-001～007`、`AC-FR-001～012` 与适用 `AC-FR-013` 均闭环到设计、TC、EV instance、固定 report 和裁决影响。
- [ ] `AC-BR-001～007`、`AC-DR-001～005`、`AC-NFR-001～007` 全部有适用红线/NFR/证据结论。
- [ ] 七项 VETO 均由真实 evidence 检查且未命中；不得静态默认 passed。
- [ ] 所有 enabled conditional facets 有 contract-derived positive evidence；未启用 facet 的 disabled/read-only/partial/blocked posture 保真。
- [ ] 全部 P0 raw artifact/report/EV/digest/pairing/redaction/no-static-evidence 资格完整，无 orphan TC/EV。
- [ ] 无未关闭 S；A 已修复或在不损害 P0 时获逐项授权接受；B/R 已记录。
- [ ] 复验使用新 run 并保留失败 run；baseline 变化已触发所需回归。
- [ ] 风险接受文件具备 owner、acceptor、impact、reason、deadline/trigger、follow-up 和 evidence refs。
- [ ] 最终结论仅为通过/有条件通过/不通过，并与签署角色、handoff、VETO 和 risk review version 一致。
- [ ] 未由 verdict 推导 production readiness；是否进入发布准备只按明确范围与 authority 表达。

### 8.5 进入/退出来源追溯

| 条件组 | 来源 |
|---|---|
| design/delivery/environment/config/facet baseline | Step 3；04 §5～§9 |
| P0 suite/check/run | 05 §8～§10/§12 |
| defect/retest | 05 §11/§14 |
| artifact/report/evidence | 05 §13 |
| AC/VETO closure | 00 §14；Step 5～11（后续） |
| risk/signoff | Step 12～14（后续） |

## 9. 回填草稿

正式 §4 应列可勾选的进入/退出条件、暂停表和生命周期图。当前必须明确展示实际准入结果为 `not_entered / blocked_by_missing_baseline`，而非勾选任何尚不存在的实现、run、evidence、defect 或 signoff。

## 10. 待确认事项

| 事项 | 当前处理 |
|---|---|
| 某次 release-required selected facets | 由 baseline/authority 决定 |
| 实际验收实例标识与 review version | 实施/送验阶段创建 |
| 谁可以批准 A 级例外 | Step 13 固定角色，实际姓名后填 |

## 11. 下一步门禁

| 条件 | 结果 |
|---|---|
| 进入、暂停、退出均可判定 | pass |
| lifecycle 与三值 verdict 已分离 | pass |
| 当前准入结果诚实 | pass |
| 允许进入 Step 5 calibration | yes |
| 实际验收可进入 | no |
| 允许修改正式 06 | no |
