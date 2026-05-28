## Step 12. 定义实施完成判定

### 1. Step 状态

- 状态：[x] 已确认
- 对应 SOP：`standards/document/实施计划讨论流程_SOP.md` Step 12
- 回填章节：`07-实施计划.md` §12 实施完成判定

### 2. 本步输入

- 上游文档：
  - `projects/L0-core/06-验收标准.md` §11 / §12 / §13 / §14
  - `standards/document/实施计划书写规范.md` §5.12
- 已确认结论：
  - 本轮范围是 F-001~F-004 P0 核心闭环 + F-005~F-007 P0-min 最小切口。
  - Step 4 已定义代码、配置、测试、证据和文档同步交付物。
  - Step 7 已定义 PH-01~PH-06 阶段门禁、commit boundary 门禁和 P0 EV。
  - Step 9 已定义 blocker / risk / spike / open question。
  - Step 10 已定义暂停、回退、变更和恢复条件。
  - Step 11 已定义提交、评审、交付证据和实现仓提交纪律。
- 依赖的前序 Step：
  - `07_implementation_plan_step_02_scope.md`
  - `07_implementation_plan_step_04_deliverables.md`
  - `07_implementation_plan_step_07_test_acceptance_gates.md`
  - `07_implementation_plan_step_09_spikes_risks.md`
  - `07_implementation_plan_step_10_rollback_change_control.md`
  - `07_implementation_plan_step_11_commit_review_delivery.md`

### 3. SOP 问题回答

1. 本轮需求覆盖如何判定。
   回答：F-001~F-004 必须完整落地并通过对应 AC-FUNC、AC-RED、AC-SYNC、AC-CONS、AC-EVID；F-005~F-007 只按 P0-min 最小切口判定。完整多语言 binding、样例仓、可视化、真实 L0-bus / L0-sdk / L1+ 联调不作为本轮完成条件。
2. 交付物是否全部完成。
   回答：Step 4 的 workspace、contracts、domain、application、infra、cli、jobs、JSON profile、fixture、P0 suite、evidence index 和文档同步记录必须全部有实现或明确的非范围 / 风险接受记录。P0 交付物缺失不能宣称完成。
3. 测试门禁和验收门禁是否全部通过或有明确风险接受。
   回答：所有 P0 suite、P0 EV、release gate、redline scan 和 evidence archive check 必须通过。只有真实外部联调、NFR / nightly 未标记 release gate 必需项、B/C 非阻断缺陷等可进入风险接受；P0 门禁失败不得风险接受。
4. 风险、Spike 和待确认事项是否关闭。
   回答：blocker 必须关闭；Spike 必须输出方案、fixture、命令、证据路径或决策；open question 必须转为决策、风险接受或 blocker。不能把 open question 留成“完成后再确认”。
5. 是否存在一票否决项。
   回答：不得存在。任一 AC-BLOCKER、S/A 缺陷未关闭、P0 EV 缺失、raw secret、禁止正文、truth / audit / outbox 半提交、失败伪成功、引用 fail open、release gate 必需项失败，均导致本轮实施不能宣称完成。
6. 未完成项如何进入延期、风险接受或 blocker。
   回答：P0 / P0-min 范围内未完成项进入 blocker；P1 / P2 或相邻仓事项可进入延期或风险接受，但必须有 owner、接受人、截止时间、后续动作、影响范围和复验方式。没有证据、没有 owner 或影响 P0 / release gate 的未完成项不能延期。

### 4. 当前文档问题诊断

| 位置 | 当前问题 | 影响 |
|---|---|---|
| Step 2 范围 | 已明确 P0 / P0-min / 非范围 | 需要转为完成判定矩阵 |
| Step 4 交付物 | 已列交付物，但未形成最终交付清单 | 实施者可能只按代码完成判断 |
| Step 7 门禁 | 已列测试、AC、EV | 需要定义哪些失败会阻断“完成” |
| Step 9 风险 | 已分类风险和待确认事项 | 需要定义完成前必须关闭或接受的项 |
| `06-验收标准.md` | 有最终通过 / 有条件通过 / 不通过规则 | 需要被 07 引用为实施完成判定依据 |

### 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 完成口径 | 尚未定义 | 完成必须由覆盖、交付物、门禁、证据、风险和签署共同判定 | 避免主观宣称完成 |
| 未完成项 | 只在风险表中分散出现 | 分类为 blocker、风险接受、延期或非范围 | 让交付收口可审查 |
| 证据要求 | Step 7 已定义 EV | Step 12 要求完成判定必须引用 EV / artifact / release gate | 防止口头确认 |
| 风险接受 | Step 9 已有风险 | 明确不可覆盖 P0、S/A、一票否决和 release gate | 对齐 06 验收标准 |
| 最终交付 | 尚未集中列出 | 建立最终交付清单 | 支持交给其他 agent 或 reviewer 复核 |

### 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 以代码写完为完成 | 简单 | 无法证明测试、验收、证据和风险状态 | 不采用 |
| 以所有功能零遗留为完成 | 最严格 | 会把 P1/P2 和真实外部联调拖入 P0 | 不采用 |
| P0 全通过 + P1/P2 风险可接受 | 兼顾底座闭环和后续演进 | 需要严格区分可接受和不可接受风险 | 采用 |
| 未完成项统一延期 | 推进快 | 可能掩盖 P0 blocker | 不采用 |
| 未完成项按 blocker / risk accepted / deferred / non-scope 分类 | 可审查、可追踪 | 需要维护 owner 和截止时间 | 采用 |

### 7. 结构化中间产物

#### 7.1 实施完成判定表

| 判定项 | 标准 | 证据 | 结论 |
|---|---|---|---|
| 需求覆盖 | F-001~F-004 完整覆盖，F-005~F-007 P0-min 覆盖 | trace matrix、AC-FUNC、release gate | 通过 / 不通过 |
| 交付物完成 | Step 4 P0 交付物均存在且可运行 / 可测试 | 代码 diff、fixture、config、evidence index | 通过 / 不通过 |
| 阶段门禁 | PH-01~PH-06 阶段门禁全部通过 | Step 7 suite / EV / AC | 通过 / 不通过 |
| Commit boundary | commit-01-a ~ commit-06-a 均完成且提交合规 | git log、commit message、PR review | 通过 / 不通过 |
| 配置与环境 | local-dev、ci-test、integration、release-like P0 profile 可用 | config smoke、negative config、release-like run | 通过 / 不通过 |
| 证据完整性 | P0 EV 字段完整、可定位、无 raw secret / 禁止正文 | evidence index、EV scan、redline scan | 通过 / 不通过 |
| 风险处理 | blocker 关闭，risk 有接受人、期限和后续动作 | risk register、handoff note、签署记录 | 通过 / 不通过 |
| Spike / open question | Spike 有输出，open question 已决策 / 接受 / 阻断 | Spike 记录、决策记录 | 通过 / 不通过 |
| 一票否决 | 无 AC-BLOCKER，无 S/A 未关闭，无 release gate 必需项失败 | `06-验收标准.md` §11~§14 | 通过 / 不通过 |
| 交付说明 | handoff note / PR 说明可定位代码、测试、证据和风险 | final delivery package | 通过 / 不通过 |

#### 7.2 未完成项处理表

| 未完成项类型 | 处理方式 | 是否允许宣称完成 | 必备字段 |
|---|---|---|---|
| P0 功能 / P0-min 切口缺失 | blocker，修复后复验 | 否 | owner、失败证据、修复计划、复验 EV |
| P0 suite / P0 EV / release gate 失败或缺失 | blocker，补跑或修复 | 否 | run_id、suite、case_id、failure log、复验结果 |
| AC-BLOCKER / S/A 缺陷 | blocker，不得风险接受 | 否 | blocker ID、根因、修复提交、复验证据 |
| 真实 L0-bus / L0-sdk / L1+ 未联调 | 风险接受 / 后续仓承接 | 是，前提是 boundary suite 通过 | owner、接受人、截止时间、后续仓 |
| EV-NFR / EV-NIGHTLY 未标记 release gate 必需 | 风险接受 | 是，前提是 P0 主线通过 | baseline / 风险说明、接受人、后续动作 |
| B/C 非阻断缺陷 | 风险接受或延期 | 是，前提是不影响 P0 / release gate | 缺陷 ID、影响范围、owner、截止时间 |
| P1 / P2 功能未做 | 非范围或延期 | 是 | 非范围来源、后续承接位置 |
| 设计偏离未回写 | change blocker | 否 | 受影响文档、回写 diff、复核记录 |

#### 7.3 最终交付清单

| 交付项 | 内容 | 完成证据 |
|---|---|---|
| 代码交付 | workspace、contracts、domain、application、infra、cli、jobs | git commit boundary、build/test 结果 |
| 配置交付 | JSON profile、状态根 fixture、release-like 配置 | config smoke、negative config EV |
| 测试交付 | unit、service、contract、config、integration、worker、relay、E2E | suite report、CI log、EV |
| 验收交付 | AC 结果、一票否决检查、缺陷状态、release gate | acceptance evidence、signoff |
| 证据交付 | evidence index、run_id、suite、case_id、evidence_id、config_profile、result | artifact path / report index |
| 风险交付 | 已接受风险、后续动作、owner、截止时间 | risk register / handoff note |
| 文档同步 | 设计偏离回写或无偏离说明 | design diff / review note |
| 提交交付 | 合规 commit message、footer、scope、body 分组 | git log / review checklist |

#### 7.4 不允许宣称完成的情形

| 情形 | 结论 |
|---|---|
| 任一 P0 / P0-min 交付物缺失 | 未完成 |
| 任一 P0 suite、P0 EV 或 release gate 必需项失败 | 未完成 |
| 任一 AC-BLOCKER、S 级或 A 级缺陷未关闭 | 未完成 |
| raw secret、禁止正文、truth / audit / outbox 半提交、失败伪成功、引用 fail open | 未完成 |
| 证据不可定位，run_id / commit / artifact 缺失 | 送验不成立 |
| open question 未决且影响 P0 范围、提交边界或验收门禁 | 未完成 |
| 设计偏离未回写 | 未完成 |

### 8. 回填草稿

以下内容回填到正式 `07-实施计划.md` §12。

```md
## 12. 实施完成判定

> 校准来源：
> - `design-calibration/07_implementation_plan_step_12_completion.md`
>
> 延伸阅读：
> - 建议继续阅读上述中间产物的“实施完成判定表”“未完成项处理表”“最终交付清单”和“不允许宣称完成的情形”小节，了解本轮实施如何收口。

本轮不得使用“基本完成”作为结论。只有需求覆盖、交付物、阶段门禁、commit boundary、配置环境、证据完整性、风险处理、Spike / open question、一票否决检查和交付说明均可审查时，才允许宣称本轮实施完成。

| 判定项 | 标准 | 证据 | 结论 |
|---|---|---|---|
| 需求覆盖 | F-001~F-004 完整覆盖，F-005~F-007 P0-min 覆盖 | trace matrix、AC-FUNC、release gate | 通过 / 不通过 |
| 交付物完成 | Step 4 P0 交付物均存在且可运行 / 可测试 | 代码 diff、fixture、config、evidence index | 通过 / 不通过 |
| 阶段门禁 | PH-01~PH-06 门禁全部通过 | suite / EV / AC | 通过 / 不通过 |
| 证据完整性 | P0 EV 可定位且不含 raw secret / 禁止正文 | evidence index、EV scan、redline scan | 通过 / 不通过 |
| 风险处理 | blocker 关闭，risk 有接受人、期限和后续动作 | risk register、handoff note、签署记录 | 通过 / 不通过 |
| 一票否决 | 无 AC-BLOCKER、无 S/A 未关闭、无 release gate 必需项失败 | `06-验收标准.md` §11~§14 | 通过 / 不通过 |

P0 功能、P0-min 切口、P0 suite、P0 EV、release gate、AC-BLOCKER、S/A 缺陷、证据完整性或设计回写缺失时，不得宣称完成。真实 L0-bus / L0-sdk / L1+ 未联调、EV-NFR / EV-NIGHTLY 未标记 release gate 必需、B/C 非阻断缺陷或 P1/P2 未做，只有在不影响 P0 / release gate 且具备 owner、接受人、截止时间、后续动作和复验方式时，才可作为风险接受或延期项。
```

### 9. 待确认事项

- 当前建议：EV-NFR / EV-NIGHTLY 默认不作为本轮 P0 完成阻断项，除非 release gate 明确标记为必需。原因是当前没有生产负载模型，先形成 baseline / risk record 更符合 L0-core 底座仓 P0 边界。
- 当前建议：真实 L0-bus / L0-sdk / L1+ 未联调不阻断 L0-core 实施完成，但必须有 boundary suite 通过和后续仓承接记录。原因是本仓交付的是共享契约来源和可消费接缝，不交付真实下游运行时。
- 当前建议：目标实现仓路径、CI 命令和 artifact 物理路径必须在正式实施开工前补齐；若缺失则不能开始 PH-01 或 PH-06 收口。

### 10. 进入下一步条件

- 实施完成判定表明确。
- 未完成项处理口径明确。
- 最终交付清单明确。
- 不允许宣称完成的情形明确。
- 可以进入 Step 13，整理正式 `07-实施计划.md`。
