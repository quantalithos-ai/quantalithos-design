# Step 4. 定义进入条件与退出条件

> 对应 SOP: `standards/document/验收标准讨论流程_SOP.md` Step 4
> 回填章节: `06-验收标准.md` §4 进入条件与退出条件

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 4 定义进入条件与退出条件 |
| 当前状态 | 已审核通过 |
| 输入基线 | Step 1~3 已审核通过;新版 `05` 的进入 / 退出 / 暂停 / 缺陷 / residual 规则 |
| 输出文件 | `projects/L1-identity/design-calibration/06_acceptance_step_04_entry_exit.md` |
| 正式文档状态 | 本 Step 不修改正式 `06-验收标准.md` |
| 停审方式 | 用户已确认,允许进入 Step 5 |

## 2. 本步目标

把 Step 3 固定的验收基线槽位和新版 `05` 的测试进入 / 退出规则,转成新版 `06-验收标准.md` 的验收进入条件、退出条件和暂停 / 阻断条件。

本 Step 只回答:

- 开始验收前哪些基线必须确认。
- 哪些测试证据和报告必须先生成。
- 哪些缺陷会阻断进入验收。
- 退出验收需要哪些门禁、证据、缺陷和风险条件。
- 哪些风险必须先接受,哪些风险不能接受。

本 Step 不定义功能、红线、接口、状态、非功能、证据或 VETO 的具体验收项;这些分别在 Step 5~11 闭合。

## 3. 本步输入

| 输入 | 状态 | 本 Step 用途 |
|---|---|---|
| `06_acceptance_step_01_input_boundary.md` | 已审核通过 | 提供验收输入边界和旧 `06` 降级口径 |
| `06_acceptance_step_02_scope.md` | 已审核通过 | 提供 P0/P1/P2 和非范围裁决边界 |
| `06_acceptance_step_03_baseline.md` | 已审核通过 | 提供文档、交付、配置、数据、artifact/report 和 acceptance 基线槽位 |
| `05-测试方案.md` §11 | 正式输入 | 提供 S/A/B/R 缺陷分级、复验和风险接受规则 |
| `05-测试方案.md` §12 | 正式输入 | 提供 P0 测试进入、退出和暂停 / 阻断准则 |
| `05-测试方案.md` §13 | 正式输入 | 提供 raw artifact、report、evidence index 和 failure evidence 规则 |
| `05-测试方案.md` §14 | 正式输入 | 提供全量 P0 regression、residual risk 和不可风险接受项 |

## 4. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 开始验收前哪些基线必须确认? | 必须确认新版 `00/01/02/03/04/05` 与 Step 1~3 校准输入、送验 source commit、build / image / package digest、固定 `<run_id>`、config profile / config digest、数据 / fixture / replay namespace、P0 dependency mode、artifact root 和 report root。 |
| 哪些测试证据必须先生成? | 至少必须能定位 P0 blocking suite 的 raw artifact 和 report、`reports/runs/<run_id>/gate-summary.md`、`evidence-index.md`、`redaction-check.md`、`dependency-boundary.md`、`report-audit.md`,以及 `reports/acceptance/handoff.md`、`veto-checklist.md`、`risk-acceptance.md` 的初稿或待审版本。 |
| 哪些缺陷会阻断进入验收? | 已知 S 级缺陷、P0 profile 无法装配、P0 blocking suite 无法运行、artifact/report pairing 不可生成、static evidence pass、redaction / dependency / report audit 明确失败、设计闭口缺失导致 P0 用例无法构造,都会阻断进入正式验收。 |
| 退出验收需要哪些结论? | Step 5~11 所有 P0 门禁必须完成裁决,`VETO-ID-001~006` 必须全部未触发,P0 blocking suite 和 release checks 必须有通过证据,证据门禁完整,S 级缺陷为 0,A 级缺陷已修复或被允许的正式风险接受覆盖,final conclusion 可落到通过 / 有条件通过 / 不通过之一。 |
| 哪些风险必须先接受? | 所有 B/R 级 residual、P1 selected-run unavailable、真实产品未覆盖、hard SLO 未硬化、evidence retention days 未固定等非 P0 风险,若要支撑有条件通过,必须在 `reports/acceptance/risk-acceptance.md` 中记录接受人、影响范围、后续动作和截止时间。VETO、P0 truth、redaction、dependency、query no-write、job no-repair、stored replay 和 evidence integrity 不允许风险接受。 |

## 5. 当前文档问题诊断

| 位置 | 当前问题 | 本 Step 处理 |
|---|---|---|
| 旧 `06-验收标准.md` §3 | 旧进入 / 退出条件使用泛化“测试报告 / CI 记录 / 缺陷清单”,未绑定新版 evidence path | 新版进入 / 退出条件绑定 Step 3 的 run-scoped 基线和 `05` 的 P0 suite |
| `05-测试方案.md` §12 | 进入 / 退出准则是测试执行视角 | 本 Step 转成验收裁决视角,强调送验材料、门禁裁决和签署前置 |
| `05-测试方案.md` §11 / §14 | 缺陷、复验、风险接受已有测试口径 | 本 Step 只定义进入 / 退出影响,具体缺陷分级和风险接受表留到 Step 12 / Step 13 |
| `reports/acceptance/*` | 是否存在和是否审查未确认 | 进入条件要求至少有初稿或待审入口;退出条件要求完成审查 |
| P1 selected-run | 可不存在 | 不阻断进入 / 退出 P0,但若作为有条件通过依据必须记录 residual |

## 6. 改动前后对比

| 项 | 改动前 | 改动后 | 理由 |
|---|---|---|---|
| 进入条件 | 旧草案要求文档、环境、报告和数据准备 | 新版要求基线槽位、P0 profile、suite/report/check 可运行且路径固定 | 与新版 `05` artifact/report 规则对齐 |
| 退出条件 | 旧草案要求 P0 通过、无 S 缺陷、证据归档 | 新版加入 VETO、report audit、artifact/report pairing、acceptance reports、risk acceptance 审查 | 满足验收裁决闭环 |
| 阻断条件 | 旧草案未区分测试暂停和验收不可进入 | 新版单独列入暂停 / 阻断条件 | 防止带 blocker 进入正式验收 |
| 风险接受 | 旧草案只泛化说风险需接受 | 新版区分可接受 residual 与不可接受 VETO / P0 红线 | 符合 `05` §11 / §14 |
| P1/P2 | 旧草案容易被误读为缺项 | 新版明确 P1/P2 unavailable 不阻断 P0,但不得伪装已验收 | 保持 Step 2 范围边界 |

## 7. 验收裁决取舍

| 议题 | 可选方案 | 取舍 |
|---|---|---|
| 是否要求所有 P0 测试都已通过才允许进入验收 | A. 是;B. 进入时要求 evidence 可定位和执行完成,退出时裁决通过 | 采用 B。进入验收是开始裁决,退出验收才是通过 / 不通过结论。 |
| `reports/acceptance/*` 是进入条件还是退出条件 | A. 进入前必须最终完成;B. 进入前有初稿或待审入口,退出前完成审查 | 采用 B。acceptance report 可以由脚本生成初稿,验收过程审查补充。 |
| A 级缺陷是否阻断进入 | A. 一律阻断;B. 影响 P0 release 且未有处理口径时阻断 | 采用 B。Step 12 将细化分级,本 Step 只设进入 / 退出边界。 |
| P1 selected-run unavailable 是否阻断退出 | A. 阻断;B. 不阻断 P0,但需要 residual 记录 | 采用 B。Step 2 已确认其非 P0 必要条件。 |
| 是否提前声明最终结论 | A. 在 Step 4 声明;B. 只定义退出所需条件 | 采用 B。最终结论与签署在 Step 14。 |

## 8. 结构化中间产物

### 8.1 进入条件

- [ ] `00/01/02/03/04/05` 和 `06_acceptance_step_01~03` 已固定为本轮验收输入,且无影响 P0 的未复审变更。
- [ ] 送验 source commit、build id / image digest / package digest 已由送验材料提供。
- [ ] 固定 `<run_id>` 已提供,且 artifact root 为 `artifacts/test/<run_id>`、report root 为 `reports/runs/<run_id>`。
- [ ] config profile、config digest、P0 dependency mode、adapter mode 和 data / fixture / replay namespace 已记录。
- [ ] P0 profile 可装配:`ci-test`、`integration-like`、`operations-replay` 与 release candidate gate 相关配置不得 fallback 为 pass。
- [ ] P0 blocking suite、check scripts 和 report scripts 可运行,且输出路径符合 Step 3。
- [ ] P0 `TC-ID-*` 用例族、DS 数据集、EV 候选和 assertion point 已在新版 `05` 中可追溯。
- [ ] P0 不依赖真实 sibling repo、真实 DB / bus / archive / object storage / secret provider / observability backend / HR / IdP 产品。
- [ ] `reports/acceptance/handoff.md`、`veto-checklist.md`、`risk-acceptance.md` 至少有生成入口或待审初稿计划。
- [ ] 当前无已知 S 级缺陷。
- [ ] 当前无会导致 P0 用例无法构造的设计闭口缺口。
- [ ] 当前无已知 redaction / dependency / report audit / static evidence / artifact-report pairing blocker。

### 8.2 退出条件

- [ ] Step 5~11 的 P0 功能、数据边界、接口同步、状态事务、非功能、证据和 VETO 门禁已逐项裁决。
- [ ] `VETO-ID-001~006` 均未触发;任何触发均不得通过或风险接受。
- [ ] 所有 P0 blocking suite 均有 raw artifact 和 run report 配对,且裁决结果可从 `reports/runs/<run_id>` 复核。
- [ ] `contract-domain-fast`、`service-flow-fast`、`config-redline`、`dependency-boundary`、`infra-runtime-fake`、`entry-worker-job`、`operations-replay-core`、`redaction-boundary`、`report-generation-audit`、`release-main-smoke` 已按 Step 10 证据门禁裁决。
- [ ] release checks 通过或有明确不通过结论,包括 redaction、dependency、artifact/report pairing 和 no static evidence。
- [ ] `reports/runs/<run_id>/gate-summary.md`、`evidence-index.md`、suite reports、`redaction-check.md`、`dependency-boundary.md`、`report-audit.md` 可定位并完成审查。
- [ ] `reports/acceptance/handoff.md` 已审查并说明送验范围、基线、结论候选和缺口。
- [ ] `reports/acceptance/veto-checklist.md` 已覆盖全部 `VETO-ID-001~006`。
- [ ] `reports/acceptance/risk-acceptance.md` 已覆盖所有支撑有条件通过的 residual,且无 VETO 或 P0 红线被风险接受覆盖。
- [ ] 当前无 S 级缺陷。
- [ ] 当前无未修复且未正式处理的 P0 A 级缺陷。
- [ ] B/R 或 P1/P2 residual 风险均记录接受人、影响范围、后续动作和截止时间。
- [ ] 性能结构性 sample 存在;旧 P95/SLA 候选未达不作为 P0 退出失败,除非 Step 9 后续正式硬化。
- [ ] 最终结论可在 Step 14 中落为 `通过`、`有条件通过` 或 `不通过`。

### 8.3 暂停 / 阻断条件

| 场景 | 处理 |
|---|---|
| 发现 `03/04/05` 闭口缺失导致 P0 验收项或用例无法构造 | 暂停对应验收项,回写上游设计或测试方案后复审 |
| 送验 source commit、build id、`<run_id>` 或 config digest 缺失 | 阻断进入正式验收 |
| 使用 `latest`、`reports/<project>`、`artifacts/test/<project>/<run_id>` 或口头 pass | 阻断进入或退出 |
| P0 profile 无法装配 | 阻断进入或退出;不得 fallback 为 pass |
| redaction / dependency / report audit failed | 阻断退出 |
| static evidence pass 或缺 raw artifact/report pairing | 阻断退出 |
| query write、job truth repair、duplicate replay rerun mutation | 阻断退出,并进入 VETO / S 级缺陷审查 |
| P1 selected-run unavailable | 不阻断 P0;记录 residual / unavailable |
| 旧性能候选数字未达但 sample 存在 | 不阻断 P0;记录 residual,除非 Step 9 正式硬化 |

### 8.4 风险接受前置规则

| 风险类型 | 是否可作为有条件通过依据 | 进入 / 退出影响 |
|---|---|---|
| `VETO-ID-001~006` 命中 | 否 | 直接不通过 |
| P0 truth、redaction、dependency、query no-write、job no-repair、stored replay、evidence integrity 失败 | 否 | 阻断退出 |
| P1 selected-run unavailable | 是 | 记录 residual,不阻断 P0 |
| 真实产品深度行为未覆盖 | 是 | 记录 residual,不得宣告已验收 |
| hard SLO / production capacity 未硬化 | 是 | 记录 residual 或 future trigger |
| report 文案清晰度但 raw evidence 完整 | 是 | 可有条件通过,需后续动作 |

## 9. 对上游 / 下游文档的影响判定

| 结论 | 是否影响上游 / 下游 | 影响类型 | 处理状态 |
|---|---|---|---|
| Step 4 条件足够进入 Step 5 | 否 | 验收流程闭合 | 无需回写 |
| 进入条件仍包含待送验材料槽位 | 否 | 送验材料待补 | Step 14 前必须闭合 |
| 若进入条件发现 P0 用例无法构造 | 是 | 设计 / 测试闭口缺口 | 回写 `03/05` 后复审 |
| 若退出条件发现 evidence path 缺失 | 是 | 证据闭环缺口 | Step 10 阻断,不得手写补 pass |
| 若风险接受试图覆盖 VETO | 是 | 验收红线冲突 | Step 11 / Step 13 阻断 |

## 10. 回填草稿

> 校准来源:
> - `design-calibration/06_acceptance_step_04_entry_exit.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“SOP 问题回答”“结构化中间产物”“暂停 / 阻断条件”和“风险接受前置规则”小节,了解验收进入与退出条件如何从基线和测试准则收敛。

正式 `06-验收标准.md` §4 应回填:

- 进入验收前必须固定正式输入文档、送验源码 / 构建、`<run_id>`、config digest、data fixture、dependency mode、artifact root、report root 和 acceptance report 入口。
- 进入验收前必须确认 P0 profile 可装配、P0 blocking suite / check / report scripts 可运行、当前无已知 S 级缺陷和 P0 构造 blocker。
- 退出验收前必须完成 Step 5~11 所有 P0 门禁裁决,并确保 `VETO-ID-001~006` 未触发。
- 退出验收前必须确认 raw artifact / report pairing、gate summary、evidence index、redaction check、dependency boundary、report audit 和 acceptance reports 完整。
- S 级缺陷、VETO、P0 redaction / dependency / query no-write / job no-repair / stored replay / evidence integrity 缺口不得风险接受。
- P1 selected-run unavailable、真实产品未覆盖、hard SLO 未硬化等只可作为 residual,不得替代 P0 evidence。

## 11. 待确认事项

| 待确认事项 | 影响 | 当前处理 |
|---|---|---|
| 送验 source commit / build / `<run_id>` 仍未提供 | 影响进入正式验收 | 进入条件列为必须项 |
| `reports/acceptance/*` 是否已有初稿或生成入口未确认 | 影响进入和退出 | 进入要求有入口,退出要求审查完成 |
| P0 blocking suite 是否实际均可运行未确认 | 影响进入 | 进入条件列为必须项 |
| A 级缺陷是否允许进入验收需 Step 12 细化 | 影响缺陷裁决 | Step 12 闭合 |
| evidence retention days 仍未固定 | 影响长期审计 | Step 10 / Step 13 继续处理 |

## 12. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| 进入条件可判定 | 通过 | 见 §8.1 |
| 退出条件可判定 | 通过 | 见 §8.2 |
| 暂停 / 阻断条件明确 | 通过 | 见 §8.3 |
| 风险接受前置边界明确 | 通过 | 见 §8.4 |
| 未提前定义 Step 5~11 具体验收项 | 通过 | 本 Step 只定义进入 / 退出门禁 |
| 可进入 Step 5 | 通过 | 用户已确认,进入 Step 5: 定义功能验收门禁 |
