# Step 14. 定义回归策略与残余风险

> 对应 SOP: `standards/document/测试方案讨论流程_SOP.md` Step 14
> 回填章节: `05-测试方案.md` §14 回归策略与残余风险

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 14 定义回归策略与残余风险 |
| 当前状态 | 已完成;待用户审查 |
| 输入基线 | Step 6 用例矩阵;Step 9 自动化门禁;Step 10 专项测试;Step 11 缺陷复验;Step 12 进入/退出准则;Step 13 证据归档 |
| 输出文件 | `projects/L1-artifact/design-calibration/05_test_plan_step_14_regression_risks.md` |
| 停审方式 | 完成本 Step 后暂停,由用户审查后再进入 Step 15 |

## 2. 本步目标

定义 Artifact 在设计、实现、配置、脚本和证据发生变化时应触发哪些最小回归、何时必须重跑全量 P0 回归,以及哪些当前未覆盖项只能进入 residual risk,不能冒充 P0 已验证结论。

本 Step 只回答:

- 哪些变更触发最小回归。
- 哪些变更触发全量 P0 回归。
- 哪些风险暂不覆盖,但必须记录接受人或待确认角色。
- 哪些 residual 必须转入后续新版 `06-验收标准.md`。
- 回归 run 如何与 Step 13 的 artifact / report / candidate evidence 归档衔接。

本 Step 不执行回归,不填写真实缺陷状态,不裁决 release pass / fail,不替代新版 `06-验收标准.md` 的风险接受流程。

## 3. 本步输入

| 输入 | 状态 | 本 Step 用途 |
|---|---|---|
| `05_test_plan_step_06_cases.md` | 已完成 | 提供 `TC-ART-*` 用例族、共用负向和 worker-only relay facade 用例 |
| `05_test_plan_step_09_automation_gates.md` | 已完成 | 提供 PR / main / nightly / release / selected-run suites、blocking checks 和脚本契约 |
| `05_test_plan_step_10_nonfunctional.md` | 已完成 | 提供 truth ownership、cross-repo consumption、redaction、dependency、recovery、observability 和性能 sample 边界 |
| `05_test_plan_step_11_defects_retest.md` | 已完成 | 提供 `S/A/B/R` 缺陷分级、复验范围和防回归动作 |
| `05_test_plan_step_12_entry_exit.md` | 已完成 | 提供 blocker / residual 边界和退出门禁 |
| `05_test_plan_step_13_evidence.md` | 已完成 | 提供 candidate evidence index、artifact/report 归档和 acceptance draft 结构 |
| `projects/L1-governance/design-calibration/05_test_plan_step_14_regression_risks.md` | 已读取 | 只作为 Step 14 粒度参考,本文件按 Artifact 语义重写 |

## 4. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 哪些变更触发最小回归? | contract/domain/state、command/query/consumer、outbox/relay/job、idempotency/UoW、config/profile、redaction、dependency、report/evidence 脚本等任一局部变更,至少触发对应 suite family、相邻 suite 和相关 blocking check。 |
| 哪些变更触发全量回归? | truth object、public protocol、state matrix、UoW/idempotency、outbox/relay/job、P0 profile、redaction/dependency gate、candidate evidence index 或任一 S 级缺陷修复变更时,必须重跑全量 P0 regression。 |
| 哪些风险暂不覆盖? | `p1-real-like-selected-run`、真实 upstream/downstream seam 产品行为、真实 archive/observability/sync target 行为、production-like / staging-like、容量 / 硬性能阈值、长期归档保留天数和新版 `06` 的 formal veto 编号都暂不作为当前 P0 阻断。 |
| 谁接受残余风险? | P0 红线不可接受;P1/P2/future residual 必须在新版 `06` 或 `reports/acceptance/risk-acceptance.md` 中由验收负责人、架构负责人、产品负责人或运维/合规负责人确认。当前若未定具体人名,至少列角色待确认。 |
| 哪些风险必须转入验收标准? | formal veto / acceptance 引用样式、selected-run 是否强制、性能阈值是否硬化、evidence retention period、真实产品 seam 验收边界、production-like / capacity gate 都必须转入新版 `06`。 |

## 5. 当前文档问题诊断

| 位置 | 当前问题 | 本 Step 处理 |
|---|---|---|
| Step 6 | 用例矩阵完整,但变更后应跑哪些 family 未显式化 | 本 Step 固定变更类型到最小回归集 |
| Step 9 | suites / gates 已定义,但何时必须重跑 release chain 未显式化 | 本 Step 固定全量 P0 回归触发条件 |
| Step 10 | performance sample、P1/P2、real-like seam 都是 residual 候选,但没有总表 | 本 Step 汇总 residual risk 表 |
| Step 11 | 只覆盖“缺陷修复后怎么复验”,还没覆盖“非缺陷设计/配置/脚本变更怎么回归” | 本 Step 补齐非缺陷变更回归 |
| Step 13 | 定义了归档结构,但没说明“每次回归 run 也必须走同一证据链” | 本 Step 明确回归 run 也必须按 Step 13 留证 |

## 6. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 回归触发 | 只有缺陷复验矩阵 | 固定变更类型 -> 最小回归 / 全量回归 | 让后续实施和验收都可直接引用 |
| residual 风险 | 分散在 Step 2 / 10 / 12 / 13 | 汇总为统一 residual 表 | 防止未覆盖项在交付时失踪 |
| relay facade | 只在 Step 6 / 9 被单列 | 在回归触发表里继续单列 `PublishPendingArtifactRelays` | 防止回归时被误并入 public jobs |
| 证据链 | 只定义了测试 run 归档 | 明确每次回归也必须产出同结构 evidence | 便于审计修复链与回归链 |
| performance | 只有“不要硬化”的规则 | 固定为 residual / candidate,并列出转入 `06` 的条件 | 防止实现侧自行变成 release blocker |

## 7. 回归设计取舍

| 议题 | 方案 | 取舍 |
|---|---|---|
| 是否所有变更都全量回归 | A. 一律全量;B. 风险分层最小回归 + 红线变更全量 | 采用 B。保持执行效率,但 P0 红线不降级。 |
| 回归是否只跑原失败用例 | A. 只跑原 case;B. 原 case + family + 相邻 suite + 红线 check | 采用 B。Artifact 的 truth / replay / report 语义常跨层。 |
| P1 selected-run unavailable 是否算 P0 failed | A. 算失败;B. 只记 residual | 采用 B。它不在当前 P0 证据主链内。 |
| evidence / report 脚本变更是否只跑 report audit | A. 只跑 audit;B. audit + 受影响 suite sample | 采用 B。要验证脚本仍能消费真实 artifacts。 |
| advanced / product-specific 风险是否提前硬化 | A. 直接升为当前 gate;B. 保持 residual,转入后续 `06` | 采用 B。当前正式输入没有这些硬基线。 |

## 8. 结构化中间产物

### 8.1 回归触发表

| 变更类型 | 最小回归集 | 全量回归触发条件 | 责任人 |
|---|---|---|---|
| 需求 / 五类验收方向 / `VF-ART-*` 变更 | 受影响 `TC-ART-*` family + `release-main-smoke` + traceability review | 任一 `VF-ART-001~004` 语义变化;第 14 章方向变化影响 P0 判定 | 设计负责人 + 测试负责人 |
| 架构 / truth ownership / cross-repo boundary 变更 | `dependency-boundary`;受影响 suite;`report-generation-audit` | compile-time sibling boundary、ownership、consumption boundary 或 seam contract 变化 | 架构负责人 |
| public contracts / typed refs / DTO / error surface 变更 | `contract-domain-fast`;关联 `service-flow-fast`;必要时 `entry-worker-job` | protocol schema、metadata、typed ref、error/rejection surface 变化 | contracts 负责人 |
| fact / version / lineage / baseline / consumable domain object 变更 | `contract-domain-fast`;受影响 command/query suite | truth fields、policy、factory、formal state、history meaning 变化 | domain 负责人 |
| state matrix / transition guard 变更 | `contract-domain-fast`;`service-flow-fast`;受影响非法转换用例 | terminal / legal / illegal transition 变化 | domain 负责人 |
| command flow 变更 | 受影响 `TC-ART-CMD-*`;`service-flow-fast`;必要时 `operations-replay-core` | UoW 顺序、trace/audit/history/outbox/stored result 语义变化 | application 负责人 |
| query flow / visibility / degraded 变更 | 受影响 `TC-ART-QUERY-*`;`service-flow-fast`;`TC-ART-IDEMP-006` | query no-write、selector、degraded / stale / no-rebuild 语义变化 | application 负责人 |
| inbound consumer 变更 | 受影响 `TC-ART-CONSUMER-*`;`entry-worker-job`;必要时 redaction check | duplicate/unsupported/delayed、snapshot/reference/receipt 语义变化 | worker 负责人 |
| outbound event / topic map 变更 | 受影响 `TC-ART-OUTBOX-*`;`operations-replay-core`;`config-redline` | payload snapshot、topic binding、publish marker、failure path 变化 | worker 负责人 |
| `PublishPendingArtifactRelays` 变更 | `TC-ART-RELAY-001`;`entry-worker-job`;`operations-replay-core`;`report-generation-audit` | relay snapshot source、retryable/terminal failure、truth unchanged 语义变化 | worker 负责人 |
| 6 public jobs 变更 | 受影响 `TC-ART-JOB-*`;`operations-replay-core`;必要时 `release-main-smoke` | no-truth-repair、report replay、handoff/export marker、partial failure 语义变化 | jobs 负责人 |
| idempotency / UoW / repository / replay root 变更 | 受影响 `TC-ART-IDEMP-*`;`infra-runtime-fake`;`operations-replay-core` | duplicate replay、commit unknown、rollback、stored result no recompute 语义变化 | infra 负责人 |
| config schema / profile / source priority 变更 | `config-redline`;必要时 `infra-runtime-fake`;release config check | P0 profile、source merge、strict JSON、topic completeness、fail-fast 变化 | config 负责人 |
| redaction / observability / safe output 变更 | `redaction-boundary`;受影响 suite sample;release redaction check | forbidden fields、log/metric/audit/report output 范围变化 | observability 负责人 |
| evidence / report scripts 变更 | `report-generation-audit`;受影响 suite sample;`check_no_static_evidence.sh` | candidate evidence schema、acceptance draft、artifact/report pairing 变化 | test tooling 负责人 |
| release gate script 变更 | `release-main-smoke` + all release checks | blocking 分类、release summary、run contract 变化 | release 负责人 |
| S 级缺陷修复 | 原失败 case + same family + related suite + related check | 命中任一 P0 红线或 release 主证据链 | 缺陷 owner + 测试负责人 |

### 8.2 全量 P0 回归集

全量 P0 regression 至少包含:

- `contract-domain-fast`
- `service-flow-fast`
- `config-redline`
- `dependency-boundary`
- `infra-runtime-fake`
- `entry-worker-job`
- `operations-replay-core`
- `redaction-boundary`
- `report-generation-audit`
- `release-main-smoke`
- release config / redaction / dependency / report-audit checks
- Step 13 candidate evidence index 和 acceptance drafts 生成

触发全量 P0 regression 的条件:

- 任一 `VF-ART-001~004` 相关修复或设计变更。
- `03-详细设计.md` 中 fact / version / lineage / baseline / consumable truth、protocol、flow、state、UoW、idempotency、outbox、job、redaction 正式口径变化。
- `04-配置设计.md` 中 P0 profile、source priority、topic map、builder fail-fast、degraded/no-write 或 replay 语义变化。
- 任一 S 级缺陷修复。
- 任一 release gate、candidate evidence index、artifact/report pairing 或 no-static-evidence 逻辑变化。

### 8.3 最小回归选择规则

| 规则 | 说明 |
|---|---|
| 原影响用例必跑 | 受影响 `TC-ART-*` 不能省略 |
| 同 family 代表项必跑 | 同一 family 的正向、负向、duplicate、no-write 或 partial 代表项至少覆盖一轮 |
| 相邻 suite 必跑 | contract/domain 变更要带 service;service 变更要带 replay/report;job/relay 变更要带 report audit |
| 红线 checks 必跑 | redaction、dependency、artifact/report pairing、no-static-evidence 相关变更必须补跑对应 checks |
| 回归 run 必须留证 | 每次回归都必须按 Step 13 产出 raw artifact、suite report、candidate evidence index |
| 不能用 P1 替代 P0 | selected-run 不得替代 fake/controlled/replay 的 P0 回归 |

### 8.4 残余风险表

| 风险 | 未覆盖原因 | 影响 | 缓解方式 | 接受人 |
|---|---|---|---|---|
| `p1-real-like-selected-run` 不进入当前 P0 主链 | 真实 provider / 环境未锁定 | 不能证明真实 adapter 端到端行为 | P0 先用 fake/controlled/replay;条件具备时跑 selected-run | 验收负责人待确认 |
| 真实 upstream seam 行为未覆盖 | work/process/governance/method/runtime/external-content 的真实产品未锁定 | 不能证明各上游真实消息 / contract 演化行为 | 当前只验证 formal seam contract;产品绑定后补 P1 | 架构负责人待确认 |
| 真实 archive / observability / sync target 行为未覆盖 | downstream 产品未锁定 | 不能证明真实 handoff target 的集成表现 | 当前只验证 handoff marker / report / no ownership transfer | 架构负责人待确认 |
| `staging-like` / `production-like` 未执行 | 不在当前 P0 范围 | 不能证明真实部署拓扑行为 | 当前只保留 P1/P2 候选和 residual | 运维负责人待确认 |
| production-like capacity / hard P95 / SLA 未覆盖 | 无正式容量模型和性能阈值 | 不能按 numeric threshold 裁决 pass | 只保留 sample/trend;若硬化需新版 `06` 明确 | 验收负责人待确认 |
| 跨仓完整 E2E 协同未覆盖 | 当前只验证 Artifact side seam | 不能证明多仓联调体验 | 先验证 seam contract,后续独立 E2E 方案 | 产品负责人待确认 |
| 长期 evidence retention 天数未固定 | 属于归档运维策略 | 不能证明长期审计保留要求 | 当前只要求覆盖验收和复验关闭周期 | 运维负责人待确认 |
| formal veto / acceptance 引用样式未固定 | 新版 `06` 尚未重建 | 当前 acceptance draft 只能直接引用 `14.x` 和 `VF-ART-*` | 后续新版 `06` 收口正式裁决样式 | 验收负责人待确认 |
| 高级 dashboard / analytics / derived UX 未覆盖 | 当前 P0 只证明 formal read surface | 不能证明复杂浏览和分析体验 | 基础 query / report P0;高级视图留 P2 | 产品负责人待确认 |

### 8.5 不可风险接受项

| 项 | 处理 |
|---|---|
| `VF-ART-001~004` 命中 | 必须修复并重跑全量 P0 regression |
| query no-write 失守 | 必须修复;复跑 `service-flow-fast` + 相关 checks |
| public job 或 relay facade 出现 truth repair | 必须修复;复跑 `entry-worker-job`、`operations-replay-core` 和相关 report audit |
| redaction leak | 必须修复;复跑 `redaction-boundary` 和 release redaction check |
| non-core sibling compile dependency | 必须修复;复跑 `dependency-boundary` |
| accepted truth 缺 trace / audit / outbox / stored result | 必须修复;复跑 `service-flow-fast` 与 `release-main-smoke` |
| candidate evidence index 静态造证据 | 必须修复;复跑 `report-generation-audit` |
| raw artifact / report pairing 缺失 | 必须修复;不得进入 acceptance draft |
| P0 profile unavailable 却被标为 passed | 必须修复;不得风险接受 |

### 8.6 必须转入新版 `06-验收标准.md` 的事项

| 事项 | 转入原因 | 建议 `06` 收口 |
|---|---|---|
| formal veto / acceptance 引用样式 | `05` 只定义测试与证据 | 建立最终裁决表和引用规则 |
| `p1-real-like-selected-run` 是否在某些 release 强制 | 当前非 P0 | 明确何时从 residual 升级为 gate |
| hard performance threshold | 当前只有 sample/trend | 若要变成 pass/fail,必须定义阈值和环境 |
| evidence retention period | 当前不固定天数 | 定义保留时长、介质和责任人 |
| residual risk acceptance role | 当前只列角色待确认 | 固定接受人和批准规则 |
| `staging-like` / `production-like` / capacity gate | 当前 P1/P2 | 明确何时升级为验收前置 |
| real upstream / downstream product certification | 当前 product-neutral | 明确产品绑定后的验收补充项 |

### 8.7 回归证据归档规则

| 回归类型 | 证据要求 |
|---|---|
| 最小回归 | 按 Step 13 产出 run artifact、suite report、candidate evidence index,并标记 regression scope |
| 全量 P0 回归 | 产出完整 `reports/runs/<run_id>`、acceptance drafts、redaction/dependency/report-audit 报告 |
| 缺陷复验 | 必须关联 failed run、fixed run、原 `TC-ART-*`、复验 suite 和是否新增防回归测试 |
| residual review | 必须更新 `reports/acceptance/risk-acceptance.md` 与 `reports/review/*` |
| P1 selected-run unavailable | 产出 unavailable marker,不得计入 P0 passed evidence |

### 8.8 回归停审记录

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 变更类型是否都有最小回归集 | 通过 | 见 §8.1 |
| 全量 P0 回归触发是否明确 | 通过 | 见 §8.2 |
| relay facade 是否持续独立于 public jobs | 通过 | 见 §8.1 / §8.5 |
| residual 是否都有接受人角色或待确认项 | 通过 | 见 §8.4 |
| P0 红线是否全部不可接受 | 通过 | 见 §8.5 |
| 回归证据是否承接 Step 13 | 通过 | 见 §8.7 |

### 8.9 跨回归 / 残余风险审计表

| 审计项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 是否存在无回归触发的 P0 变更 | 通过 | 所有 P0 面已映射 |
| 是否把 P1/P2 unavailable 写成 P0 passed | 通过 | 只作为 residual |
| 是否把性能 candidate 写成硬阈值 | 通过 | 只保留 sample/trend |
| 是否存在 residual 无接受角色 | 通过 | 当前全部列角色待确认 |
| 是否存在可接受的 P0 红线 | 否 | 见 §8.5 |
| 是否可被实施计划引用 | 通过 | 见 §8.1 / §8.2 |
| 是否可被新版 `06` 引用 | 通过 | 见 §8.4 / §8.6 |

## 9. 对上游设计的影响判定

| 回归 / 风险结论 | 是否影响上游 | 影响类型 | 处理状态 |
|---|---|---|---|
| 最小 / 全量回归策略已可收口 | 否 | 测试方案执行策略 | 可回填 `05` |
| relay facade 独立回归策略已固定 | 否 | 测试与验收统计纪律 | 可回填 `05` |
| residual 风险保持不阻断 P0 | 否 | 范围边界 | 与 Step 2 / 10 / 12 一致 |
| formal veto / acceptance 样式未固定 | 是 | 验收标准闭口 | 新版 `06` 必须收口 |
| 若 future 要求 real-like selected-run 或 hard performance 变成 gate | 是 | 范围 / 验收基线变更 | 需回写 `05/06/07` |

## 10. 回填草稿

> 校准来源:
> - `design-calibration/05_test_plan_step_14_regression_risks.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“回归触发表”“全量 P0 回归集”“残余风险表”“不可风险接受项”和“必须转入新版 `06-验收标准.md` 的事项”小节。

正式 `05-测试方案.md` §14 应回填:

- 回归策略按变更风险分层。局部变更触发最小回归集;truth、protocol、state、UoW/idempotency、outbox/relay/job、config、redaction、dependency、evidence 脚本或 S 级缺陷修复触发全量 P0 回归。
- 全量 P0 回归至少包含 `contract-domain-fast`、`service-flow-fast`、`config-redline`、`dependency-boundary`、`infra-runtime-fake`、`entry-worker-job`、`operations-replay-core`、`redaction-boundary`、`report-generation-audit`、`release-main-smoke` 和 release checks。
- `PublishPendingArtifactRelays` 必须保持独立回归路径,不得在回归或残余风险讨论里并入 6 个 public jobs。
- 每次回归 run 都必须按 Step 13 产出 raw artifact、suite report 和 candidate evidence index。
- `VF-ART-*`、query no-write、job / relay no truth repair、redaction、dependency、accepted truth traceability、evidence integrity 和 P0 profile unavailable 都不得风险接受。
- `p1-real-like-selected-run`、真实 seam 产品、production-like / capacity、hard performance threshold、formal veto 样式和长期保留策略属于 residual,需要在新版 `06` 或 acceptance risk 文档中明确接受人和触发条件。

## 11. 待确认事项

| 待确认事项 | 影响 | 当前处理 |
|---|---|---|
| 各 residual 的实际接受人姓名 | 影响风险接受签署 | 当前按角色列为待确认 |
| 新版 `06` 的 formal veto / acceptance 引用样式 | 影响最终送验 | 当前只列转入事项 |
| hard performance threshold 是否未来硬化 | 影响 P0/P1/P2 边界 | 当前不硬化 |
| `p1-real-like-selected-run` 是否在某些 release 必跑 | 影响退出门禁和 gate | 当前不阻断 P0 |

## 12. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| 回归触发表可被实施计划引用 | 通过 | 见 §8.1 / §8.2 |
| 残余风险均有接受角色或待确认项 | 通过 | 见 §8.4 |
| 不可接受 P0 红线明确 | 通过 | 见 §8.5 |
| 转入新版 `06` 的事项明确 | 通过 | 见 §8.6 |
| 可进入 Step 15 | 通过 | 下一步装配正式 `05-测试方案.md`;进入前等待用户审查 |
