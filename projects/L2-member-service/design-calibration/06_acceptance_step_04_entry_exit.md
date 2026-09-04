# Step 4. 定义进入条件与退出条件 · L2-member-service

> 对应 SOP：`standards/document/验收标准讨论流程_SOP.md` Step 4
> 回填章节：`06-验收标准.md` §4 进入条件与退出条件

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 4 定义进入条件与退出条件 |
| 当前状态 | `[x] 已确认` |
| 输入基线 | Step 3；`05` §12~§14；`00` AC / VF；`04` P0 profile |
| 输出文件 | `design-calibration/06_acceptance_step_04_entry_exit.md` |
| 当前模块 | `entry_gate`、`exit_gate`、`pause_conditions` |
| 思考记录 | `done` |
| 写入记录 | `done` |
| 自检状态 | `done` |
| gate_status | `pass` |
| gate_reason | 进入、退出、暂停 / 不可裁决条件均为可检查清单，并与证据、缺陷和 blocker 语义一致 |
| next_allowed_action | 进入 Step 5，定义功能验收门禁 |

### 1.1 Step 内计划

- [x] 读取基线、测试退出准则和 VETO 候选。
- [x] 回答进入 / 退出 / 缺陷 / 风险问题。
- [x] 诊断旧文档模糊条件。
- [x] 选择“送验准入”和“裁决准出”分离方案。
- [x] 产出进入条件、退出条件、暂停条件和来源追溯。
- [x] 形成 §4 回填草稿并自检。

## 2. 本步目标

定义什么时候可以开始正式验收、什么时候可以形成结论，以及什么时候必须暂停或判定不可裁决。进入条件不等于验收通过；退出条件要求每个 P0 门禁、VETO、证据、缺陷和风险都有明确状态。

## 3. 本步输入

| 输入 | 来源 | 用途 |
|---|---|---|
| 基线表与路径 | Step 3 | 判断 source、run、artifact、report 是否齐备 |
| 测试退出准则 | `05` §12 | 承接测试执行完成与缺陷状态 |
| P0/P1/P2 范围 | Step 2 | 防止 P1/P2 不可用阻断或污染 P0 |
| VF-MS-001~009 | `00` §14.6 | 定义硬阻断条件 |
| 配置与 fixture 资格 | `04` §6、`05` §8 | 判断环境可判定性 |

## 4. SOP 问题回答

| 问题 | 回答 | 依据 |
|---|---|---|
| 开始验收前哪些基线必须确认？ | `00~05` source ref、实现交付 ref、Core ref、P0 profile/config digest、fixture/replay root、固定 run_id 和依赖状态必须可定位。 | Step 3 基线表；书写规范 §5.3 |
| 哪些测试证据必须先生成？ | 所有 P0 blocking suite 的 raw artifact、suite report、evidence index、gate results、redaction、dependency、report-audit，以及 acceptance handoff / VETO / open issues 初稿。 | `05` §13；Step 3 |
| 哪些缺陷会阻断进入验收？ | 未关闭 S 级、VETO 相关修复未复验、redaction / dependency / report audit 阻断、P0 profile unavailable 却标 passed、缺失 raw artifact / report pair。 | `05` §11~§14；`00` VF |
| 退出验收需要哪些结论？ | 每个 P0 AC 有通过 / 失败 / 不适用理由；VETO 有真实证据；缺陷、残余风险、证据和签署状态清楚；最终仅使用通过 / 有条件通过 / 不通过。 | 06 SOP Step 4、14 |
| 哪些风险必须先接受？ | 只有不触发 VETO / S 且有影响、理由、责任人、接受人、截止时间 / trigger 的 B/R 或受限 A residual，才可支持有条件通过。 | Step 13 / `05` §14.5 |

## 5. 当前文档问题诊断

| 材料 | 问题 | 处理 |
|---|---|---|
| 旧 `06` §3 | “环境可构造”与“退出全部通过”没有区分送验准入和验收结论 | 分离 entry、exit 和 pause |
| 旧 `06` §3.2 | 只写“P0 全部通过、无 S”但无 artifact、report、VETO、risk acceptance 入口 | 增加可追溯证据条件 |
| `05` §12 | 测试方案退出准则不能直接当验收退出结论 | 仅作为验收进入输入，06 另行裁决 |
| 上游 blocker | 真实 sibling 正向不可用可能被误判为失败或通过 | 明确 blocked / waiting / unavailable 的暂停与 residual 口径 |

## 6. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 进入条件 | 环境能构造、测试可跑 | 基线、交付、P0 raw/report、缺陷和依赖状态均可定位 | 防止不可裁决送验 |
| 退出条件 | P0 “全部通过” | AC/VF/EV/缺陷/风险/签署全闭环 | 支持三值裁决 |
| blocker | 未区分 unavailable / failed | blocked / waiting / pending / unavailable 逐项处理 | 不伪造正向 readiness |

## 7. 验收裁决取舍

| 议题 | 方案 | 结论 |
|---|---|---|
| 缺 raw artifact 是否可人工补表 | A. 可以；B. 不可以 | 采用 B；证据缺失即不可裁决或不通过 |
| P1 real-like 未运行是否阻断 P0 | A. 阻断；B. 进入 residual | 采用 B，前提是 P0 seam 真实可证且不触发 VETO |
| S 级缺陷是否可有条件通过 | A. 可以；B. 不可以 | 采用 B，S / VETO 不得风险接受 |
| acceptance handoff 是否等于退出 | A. 是；B. 仅是交接材料 | 采用 B，仍需 AC/VF/EV 和签署判断 |

## 8. 结构化中间产物

### 8.1 进入条件

- [ ] `00~05` 设计 source refs 已固定，且本次送验版本与其一致。
- [ ] implementation commit / build id / image digest 已固定；不存在“未实现但可验收”的交付空洞。
- [ ] Core / core-contracts ref 已固定或明确为 pending，且不伪造 compile readiness。
- [ ] P0 profile、config digest、fixture / replay root 和依赖 availability 已固定。
- [ ] 固定 `<run_id>` 已生成且不是 `latest`。
- [ ] 每个 P0 blocking suite 都有 `artifacts/test/<run_id>/...` raw artifact、case refs 和 digest。
- [ ] `reports/runs/<run_id>/...` 至少有 summary、gate-results、evidence-index、suite reports、redaction-check、dependency-boundary 和 report-audit。
- [ ] `reports/acceptance/handoff.md`、`veto-checklist.md`、`open-issues.md` 已生成；有 residual 时还需 risk-acceptance 草稿。
- [ ] 未关闭 S 级 / VETO 修复、redaction、dependency 或 report integrity 阻断项为零。

### 8.2 退出条件

- [ ] `AC-MS-001~039` 每项都有通过 / 失败 / 不适用且有正式理由。
- [ ] `VF-MS-001~009` 均由真实 evidence / report / defect 状态检查，未静态默认通过。
- [ ] 每个 P0 EV 能回指 TC、suite artifact、report path、digest 和 AC/VF。
- [ ] Query no-write、Job no-truth-repair、generation/effect/handoff key fence、immutable material 和四层 handoff 均有证据。
- [ ] redaction、dependency-boundary、report-audit 通过；失败则总体不通过或暂停。
- [ ] S=0；A 已修复复验或有合规风险接受且不触发 VETO；B/R 进入风险或开放项。
- [ ] 最终结论使用三值口径，签署角色和日期齐备。

### 8.3 暂停 / 不可裁决条件

| 条件 | 裁决 |
|---|---|
| 缺 implementation source、run_id、raw artifact 或 report pair | 暂停；不得写通过 / 有条件通过 |
| EV index 静态生成、orphan EV、digest / TC / AC / VF 追溯断裂 | 不可裁决；修复报告生成和证据链 |
| redaction / dependency / report audit failed | 不通过或暂停；必要时触发 VETO |
| 上游 exact contract 未闭合但仅影响真实 P1 正向 seam | P0 可在 controlled / disabled seam 裁决，正向部分记 residual |
| 上游 exact contract 未闭合且本地无法证明负向 / fail-closed | 暂停受影响 AC；不得以 placeholder positive 代替 |
| 设计 source 与交付 source 不一致 | 暂停并触发新基线 / 回归 |

### 8.4 进入 / 退出来源追溯

| 条件组 | 主要来源 |
|---|---|
| 进入条件 | Step 3、`04` §6、`05` §12~§13 |
| 退出条件 | 06 SOP Step 4、`00` AC/VF、`05` §13~§14 |
| 暂停条件 | `05` §13.7~§13.8、全局 blocker 台账 |

## 9. 回填草稿

正式 §4 应列出可检查的进入条件和退出条件，并单列缺基线、缺 artifact/report、证据审计失败、设计闭口缺失和 sibling 正向 blocked 的暂停口径。进入验收不表示通过；退出必须满足 AC/VF/EV/缺陷/风险/签署全闭环。

## 10. 待确认事项

| 事项 | 影响 | 当前处理 |
|---|---|---|
| 具体送验 run_id、实现 ref 和责任角色 | 进入 / 退出时填写 | 当前保持待送验 |
| P1 selected-run 是否在特定版本强制 | 影响 residual / release | 当前不作为 P0 entry |
| 风险接受组织权限 | Step 13 / 14 | 必须由正式接受人填写，不能由文档默认 |

## 11. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| 进入条件可判定 | 通过 | 见 §8.1 |
| 退出条件可判定 | 通过 | 见 §8.2 |
| 暂停 / 不可裁决条件明确 | 通过 | 见 §8.3 |
| 来源追溯完整 | 通过 | 见 §8.4 |
| 可进入 Step 5 | 通过 | 开始功能验收门禁逐项闭环 |
