# L4-observability 05-测试方案 Step 14 · 回归策略与残余风险

> 对应标准：`standards/document/测试方案讨论流程_SOP.md` Step 14；
> `standards/document/测试方案书写规范.md` §5.14。
> 本文件是 current calibration 中间产物，只定义未来回归与风险记录合同，不包含测试执行结果或验收裁决。

## Step 状态

| 字段 | 当前值 |
|---|---|
| project / document | `L4-observability` / `05-测试方案.md` |
| step | `14 / 定义回归策略与残余风险` |
| mode | `full-restart` |
| status | `completed_with_inherited_affected_open` |
| current_module | `regression_trigger_and_residual_risk_closure` |
| direct_input | current Step 06、09~13；current `00~04`；L1-governance / L1-artifact Step 14 |
| formal_document_write | `not_allowed_until_step_15` |
| implementation / test execution | `not_started` / `not_run` |
| artifact / report / evidence | `absent_by_design`；只有 future run-scoped contract |
| new_upstream_blocker | `none` |
| inherited_blocker / affected | 12 项保持开放，见 §12；不得降级为 residual acceptance |
| next_allowed_action | `rebuild_current_05_step_15_and_formal_document` |
| commit | 不需要；用户未要求提交 |

旧 Step 14 只有 81 行，内容主要重复通用 observability schema，没有 SOP 要求的回归触发表、全量 P0
触发条件、残余风险接受路径或 `06` 转入项；其 `pass` 结论不可信。本轮不继承旧内容，按 current 9 suite、
99 TC、82 dataset、五脚本和 Step 13 证据合同重建。

## 1. 本步目标与边界

本 Step 定义设计、实现、配置、依赖、脚本或缺陷变化后应执行的最小回归集，何时必须请求全量 P0
回归，以及哪些当前非 P0 能力只能进入 residual risk。回归只验证本仓观测与审计投影、body-free linkage、
safe telemetry、retention marker、report handoff 和 no-write boundary，不验证或改写任何外部业务 truth。

本 Step 不执行测试，不创建 `<run_id>`、artifact、report、正式 evidence alias、缺陷关闭记录、风险签署、
验收 verdict 或 release decision。回归设计通过不等于实现或测试通过。

## 2. 输入与权威顺序

| 优先级 | 输入 | 本 Step 用途 |
|---:|---|---|
| 1 | 测试 SOP Step 14 / 书写规范 §5.14 | 固定回归触发表、残余风险表、接受人和验收转入要求 |
| 2 | current Step 06 | 提供 99 个 exact `TC-OBS-*`、断言包和 affected 用例语义 |
| 3 | current Step 09 | 提供 9 个唯一 `S-OBS-*`、lane/profile、触发语境和五脚本 contract |
| 4 | current Step 10 | 提供 12 个专项主轴、无来源性能数字和 P1/P2 边界 |
| 5 | current Step 11 | 提供 `S/A/B/R` 分级、复验范围和防回归回写规则 |
| 6 | current Step 12 | 提供 entry/exit、blocked/not_run/conditional 与真实性门禁 |
| 7 | current Step 13 | 提供 99 行 TC/DS/EV/suite/path join 和 run-scoped 归档合同 |
| 8 | L1-governance / L1-artifact Step 14 | 只参考粒度和结构，不复制其业务对象、suite、脚本或编号 |

旧正式 `05`、README 和旧 Step 14 仅为 `historical_material`。其中 `TC-OBS-GRD-*`、`local-dev`、
`ci-test`、`operations-replay`、`contract-domain-fast` 等旧测试身份不得进入 current 回归集；current 唯一 suite
身份是 Step 09 的 9 个 `S-OBS-*`。

## 3. SOP 问题回答

| 问题 | current 回答 |
|---|---|
| 哪些变更触发最小回归 | 受影响 exact TC 必跑，再补同 family 的关键正向/负向/恢复代表项、一个相邻 primary suite 和所有受影响 secondary check；不得只跑修改代码对应的单测。 |
| 哪些变更触发全量回归 | 需求/VF、truth ownership、public protocol、formal state、UoW/idempotency/outbox、recovery/external phase、redaction/no-write/dependency、P0 profile、9-suite primary mapping、99 行 evidence join 或 S 级缺陷变化，必须请求全量 P0 manifest。 |
| 哪些风险暂不覆盖 | 真实产品 adapter certification、production-like capacity/硬 SLO、完整跨仓 E2E、外围 dashboard/analytics、长期 retention 天数和生产运维演练当前不作为 P0 测试通过条件。 |
| 谁接受残余风险 | residual 必须在新版 `06` 或未来 `reports/acceptance/risk-acceptance.md` 中记录风险接受角色、理由、触发条件和后续动作；当前只列角色待确认，不写签署事实。 |
| 哪些风险转入验收标准 | P0 run 绑定、VETO 裁决、conditional acceptance、residual 接受角色、RuntimeLike 升级条件、性能阈值来源、保留期和真实产品认证条件必须由新版 `06` 收口。 |

## 4. 当前材料诊断与改动前后对比

| 输入位置 | 改动前问题 | current 处理 |
|---|---|---|
| 旧 Step 14 | 重复 log/metric/trace schema，未定义回归 | 整体替换为变更触发、全量集、risk 和证据合同 |
| Step 06 | 99 个 TC 完整，但没有变更后选择规则 | 固定 exact TC -> family -> adjacent suite -> check 选择顺序 |
| Step 09 | suite/gate 完整，但没有设计变更触发矩阵 | 仅使用 9 个 current suite 建立触发表 |
| Step 10 | P1/P2、性能 candidate 和外围增强分散 | 汇总为 residual risk，保留触发条件和接受角色 |
| Step 11 | 缺陷复验已定义，非缺陷变更回归未闭合 | 补充设计、配置、依赖、脚本和证据结构变更 |
| Step 12 | conditional exit 有原则，风险来源未集中 | 将可接受 residual 与不可接受 P0 红线分开 |
| Step 13 | run-scoped 归档已闭合，回归尚未要求同结构留证 | 所有回归 invocation 都复用同一 artifact/report/provenance contract |
| 旧正式 `05` | 使用 21 个旧 TC、旧 profile/gate 和错误范围 | 标记 historical，Step 15 从 current Step 01~14 重装 |

## 5. 回归设计取舍

| 议题 | 采用方案 | 放弃方案 | 原因 |
|---|---|---|---|
| 回归范围 | 风险分层最小集；红线变化强制全量 manifest | 所有变化一律全量，或只跑改单元 | 平衡执行成本，同时保留跨层约束 |
| suite 身份 | 只用 9 个 current `S-OBS-*` | 使用旧 gate alias 作为 suite | 避免一个测试被多套身份重复计数 |
| RuntimeLike 不可用 | 保留 `blocked/not_evaluated` | 用 ISO/INT 或人工截图替代 | lane 真实性不能降级 |
| 缺陷复验 | 原 TC + family + adjacent suite + affected checks | 只重跑原失败 TC | no-write、UoW、redaction 和 evidence 常跨层 |
| evidence/report 变化 | provenance audit + affected raw-producing suite | 只扫描静态模板 | 必须证明 generator 能消费真实同 run artifact |
| residual | 只容纳非 P0、非 VETO、非 inherited blocker | 把 blocked P0 写成已接受风险 | 避免风险接受绕过正式设计缺口 |
| 性能 | sample/trend，待正式 workload/threshold 后升级 | 继承 README P95/SLA | 当前无权威阈值来源 |

## 6. 回归触发表

| 变更类型 | 最小回归集 | 全量 P0 触发条件 | 责任角色 |
|---|---|---|---|
| `FR/BR/DO/NFR/AC/VF` 或五能力边界 | 受影响 TC family；`S-OBS-STATIC-REDLINE` historical/trace scan；相关 release composite design audit | 任一核心 `FR-OBS-001~013`、`VF-OBS-001~010` 或 truth/non-goal 语义变化 | 设计负责人 + 测试负责人 |
| 架构、truth ownership、跨仓依赖类型 | `S-OBS-STATIC-REDLINE`；受影响 contract/service suite；dependency check | compile/runtime/event/handoff 分类、owner、no-write 或 only-core 边界变化 | 架构负责人 |
| typed ref、DTO、metadata、error、protocol schema | `S-OBS-CONTRACT-DOMAIN`；受影响 `S-OBS-SERVICE-FLOW`；入口相关则加 entry suite | 任一 60 exact public protocol、operation identity、schema/binding 或 error surface 变化 | contracts 负责人 |
| domain object、policy、27 formal states/technical item state | `S-OBS-CONTRACT-DOMAIN`；受影响 service/repository state row | owner、field invariant、legal/illegal/terminal/reserved transition 变化 | domain 负责人 |
| Command / Consumer accepted flow | 受影响 `S-OBS-SERVICE-FLOW` TC；`S-OBS-ENTRY-CAPABILITY`；必要时 repository suite | UoW 顺序、ack/completion、history/outbox/stored result 或 source no-write 变化 | application + worker 负责人 |
| Query / diagnostic / visibility / freshness | 受影响 service/entry TC；telemetry/static no-write secondary check | Q01~Q14 strict no-write、read fence、visibility/degraded 或 diagnostic authority 变化 | application 负责人 |
| repository、UoW、CAS/cursor、idempotency、outbox | `S-OBS-REPOSITORY-CONFORMANCE`；受影响 service/recovery TC | atomic write-set、rollback、commit unknown、stored result、snapshot publication 或 fence 变化 | infra 负责人 |
| Job、rebuild/replay、claim/fence、report fold | `S-OBS-RECOVERY-REPLAY`；repository/entry adjacent suite；no-write check | immutable plan、resume、terminal replay、J06 guard、item/final report 语义变化 | jobs 负责人 |
| external prepare/call/probe/finalize | recovery suite 的 `RPT/UOW/NW/EXT` rows；telemetry/report provenance check | token/binding/material identity、unknown outcome、retry accounting 或 Delivered 语义变化 | application + adapter 负责人 |
| redaction、body-free、correlation、safe telemetry | `S-OBS-TELEMETRY-SAFETY`；contract/service affected rows；redaction/metric checks | forbidden material、redaction-before-serialization、metric allowlist、trace authority 或 recursion guard 变化 | observability/safety 负责人 |
| evidence linkage、authenticity、report handoff | service/recovery/telemetry affected rows；`generate_reports.sh` provenance audit | body-free evidence、handoff input/readiness、candidate EV 或 final-verdict boundary 变化 | report/evidence 负责人 |
| retention、active protection、archive eligibility | contract/service/repository/telemetry 的 `RET-*` rows；cleanup spy | active/held/referenced precedence、release eligibility 或 source-delete authority 变化 | retention 负责人 |
| config schema、profile、source priority、activation | `S-OBS-CONFIG-REDLINE`；受影响 suite；dependency/redaction checks | `LocalTest/IntegrationLike/RuntimeLike` legality、13-stage activation、required capability 或 fail-fast 变化 | config/runtime 负责人 |
| gate/report/check 脚本及 artifact/report schema | 受影响 raw-producing suite sample；三个 checks；Step 13 99-row join audit | 五脚本 CLI、run identity、canonical root、status fold、99-row mapping 或 no-static-evidence 规则变化 | test tooling 负责人 |
| historical/documentation source map | `S-OBS-STATIC-REDLINE` 的 `HIST/NFR` rows；traceability audit | historical material 被提升为 current truth、正式 ID 或 threshold source 变化 | 设计负责人 |
| S 级缺陷修复 | 原失败 TC、同 family、相邻 suite、全部 affected checks | 任一 VETO/P0 truth、安全、证据、依赖、retention 或 required lane 真实性缺陷 | 缺陷 owner + 测试负责人 |
| A 级缺陷修复 | 原失败 TC + family + affected suite/check | 影响共享 contract、跨 suite 行为或连续两次复发时升级全量 | 缺陷 owner |

## 7. 全量 P0 回归合同

### 7.1 全量 manifest

全量 P0 regression request 必须列出 Step 09 的全部 9 个 primary suite，并以 Step 13 的 99 行 exact index
作为 case manifest：

| primary suite | TC 数 | required lane/profile | 当前真实性处置 |
|---|---:|---|---|
| `S-OBS-CONTRACT-DOMAIN` | 10 | `ENV-CI-ISO` / `LocalTest` | 真实 runner 未建立，设计期仅 planned |
| `S-OBS-SERVICE-FLOW` | 24 | ISO；指定 durable rows 另跑 INT | INT 不可用不得由 ISO 覆盖 |
| `S-OBS-REPOSITORY-CONFORMANCE` | 12 | `ENV-CI-INT` / `IntegrationLike` | durable lane 缺失为 blocked/not_run |
| `S-OBS-ENTRY-CAPABILITY` | 5 | exact ISO/INT row | I05 positive 保持 blocked_upstream |
| `S-OBS-RECOVERY-REPLAY` | 12 | `ENV-CI-INT` / `IntegrationLike` | J06 positive 保持 controlled blocked |
| `S-OBS-CONFIG-REDLINE` | 6 | `ENV-CI-ISO` / `LocalTest` | profile/legal matrix 必须完整 |
| `S-OBS-TELEMETRY-SAFETY` | 11 | ISO；必要时 INT | redaction/metric checks 同 run |
| `S-OBS-STATIC-REDLINE` | 12 | `ENV-CI-ISO` / `LocalTest` | dependency/historical/owner scan blocking |
| `S-OBS-RELEASE-SMOKE` | 7 | `ENV-STG-RT` / `RuntimeLike` | lane 未建立时只能 not_evaluated/blocked |
| **合计** | **99** | 3 profile 分 invocation 保存 | 不允许跨 profile 拼成单一 pass |

### 7.2 全量触发条件

以下任一变化必须请求全量 P0 manifest：

1. `00` 的核心 FR、BR、DO ownership、AC 或 `VF-OBS-001~010` 变化。
2. `01/02/03` 的 dependency direction、truth owner、60 protocol、27 formal state、UoW、idempotency、outbox、
   recovery、external phase、no-write 或 redaction 正式语义变化。
3. `04` 的 profile legality、required capability、source priority、activation atomicity、sensitive reference 或
   fail-fast/degraded 语义变化。
4. Step 06 的 TC/断言包、Step 07 的 dataset、Step 09 的 primary suite/lane、Step 13 的 99 行 join 或
   canonical artifact/report contract 变化。
5. 五个 script contract、status precedence、forbidden corpus、metric allowlist 或 dependency scan 变化。
6. 任一 S 级缺陷修复，或 A 级缺陷影响共享 contract/多个 suite/连续复发。

“请求全量”不等于“全量通过”。required lane 不可用、inherited blocker 仍开放或 artifact/report 不完整时，
结果必须保持 `blocked/not_run/conditional/indeterminate`，不得删减 manifest 后宣称全量完成。

### 7.3 最小回归选择规则

| 规则 | 必须动作 |
|---|---|
| exact impact first | 先列受影响的 exact `TC-OBS-*`，禁止只写 family wildcard |
| family closure | 至少覆盖同 family 的正向、关键负向及 applicable recovery/phase 代表项 |
| adjacent suite | contract 带 service；service 带 repository/entry；job/external 带 recovery/report；telemetry 带 checks |
| redline closure | redaction、metric、dependency、truth/no-write、report provenance 的变化必须跑对应 secondary check |
| lane fidelity | ISO/INT/RT 分 invocation、分 run identity；低等级 lane 不替代高等级 lane |
| failure preservation | failed/blocked/not_run/indeterminate attempt 全部保留，重跑不能覆盖原记录 |
| affected preservation | I05/J06 等 positive blocked row 继续进入 manifest，不因回归而变成 passed |
| evidence closure | 每次回归按 Step 13 留存 raw case、suite report、candidate linkage 和 provenance |

## 8. 残余风险表

下表只收纳当前范围内明确不作为 P0 通过条件的风险。`inherited blocker / affected` 另列于 §12，不能通过本表的
风险接受流程关闭。接受人目前只记录角色，不伪造具体姓名、签署或日期。

| 风险 ID | 风险 | 未覆盖原因 | 影响 | 缓解与升级条件 | 接受人 |
|---|---|---|---|---|---|
| `RR-OBS-001` | 真实 upstream/downstream 产品 seam 未完成认证 | 当前只锁定 product-neutral port、body-free ref、snapshot 和 handoff contract，目标产品实例未建立 | 不能证明真实相邻产品的协议演化、网络行为或端到端体验 | 先以 ISO/INT controlled contract 作为设计基线；产品绑定后增加 selected-run，并在 `06` 明确是否成为 release 前置 | 架构负责人待确认 |
| `RR-OBS-002` | `ENV-STG-RT` / RuntimeLike 未建立 | 目标 runtime、拓扑、managed endpoint、secret provider 和 runbook 尚不存在 | 不能证明真实部署拓扑或 managed binding 行为 | 保持 `S-OBS-RELEASE-SMOKE` 为 `planned_not_evaluated`；建立真实 lane 后按同一 99-row provenance contract 重跑 | 运维负责人待确认 |
| `RR-OBS-003` | production-like capacity、硬 P95/SLO 未验证 | `00` 没有正式 workload、样本量、阈值和统计 owner；历史数字已标为 historical | 不能按数值阈值裁决容量或服务等级 | 只保留 duration/count sample 与 trend；若硬化，先回写 `00/04/05/06` 并定义 workload、阈值和环境 | 验收负责人待确认 |
| `RR-OBS-004` | 完整跨仓 E2E 协同未执行 | 当前测试只验证 L4 seam 和 no-write boundary，不拥有相邻仓 truth | 不能证明多仓真实消息、重试、部署或用户工作流 | 保留 exact seam contract；产品和环境锁定后新增独立 E2E 计划，不把其缺失写成 P0 pass | 产品负责人待确认 |
| `RR-OBS-005` | 长期 evidence/artifact retention 天数未固定 | retention owner、介质、法规期限和 cleanup policy 未在 current 输入中冻结 | 不能证明长期审计保留或自动清理期限 | 当前只验证 marker/hold/reference/cleanup decision；由归档 owner 在 `06` 或运维基线固定期限 | 运维/合规负责人待确认 |
| `RR-OBS-006` | 外部 archive、APM、metric backend、GRC 或 dashboard 产品行为未验证 | 它们是 runtime consumer/adapter，不是本仓 truth owner，也未建立产品实例 | 不能证明外部存储、展示或消费端 SLA | 验证本仓 safe output、handoff marker、report provenance 和 no ownership transfer；后续按产品单独认证 | 架构负责人待确认 |
| `RR-OBS-007` | 高级 dashboard、analytics、alert、derived UX 未覆盖 | 当前 P0 只冻结 formal query/diagnostic/report surface，没有高级产品 schema | 不能证明复杂浏览、聚合和交互体验 | 留为 P2；高级产品不得反向改变本仓 owner、schema、state 或 gate | 产品负责人待确认 |
| `RR-OBS-008` | 真实 acceptance evidence alias 和最终签署尚不存在 | 当前仅有 `EV-CAND-OBS-*` planned linkage；目标仓和真实 run 未建立 | 不能形成正式验收结论 | 按 Step 13 从真实 raw/report 生成候选 linkage，再由新版 `06` 做独立裁决；当前不生成 alias | 验收负责人待确认 |
| `RR-OBS-009` | 某些 affected 正向路径仍需上游 owner 闭合 | I05 payload/binding、H13 replay、recovery owner、external phase 等输入未闭口 | 相关 positive case 只能 blocked/conditional | 保留 fail-closed、controlled blocked 和 no-fabrication case；上游闭口后回写 Step 06~14 并全量回归 | 设计负责人 + 上游 owner 待确认 |

### 8.1 Residual 接受门槛

residual 只有同时满足以下条件，才可在未来进入 `conditional_with_recorded_residual`，不能直接写成通过：

1. 不涉及 `VF-OBS-001~010`、raw body/secret、source truth write、only-core dependency 或 active/held/reference cleanup。
2. 不属于 §12 的 inherited blocker；如果是设计输入缺口，必须先回写正式设计真相源。
3. 有真实 run-scoped raw artifact、report、影响范围、owner 角色、触发条件和后续动作。
4. 新版 `06` 明确允许该 residual 影响哪一项 AC、何时升级为阻断以及谁做最终裁决。

## 9. 不可风险接受项

| 红线 | 发现时动作 | 必须重跑 |
|---|---|---|
| raw body、secret、credential、provider/evidence/artifact body 或 full sensitive ref 出现在输出 | 立即阻断；保留原始 finding，不以脱敏后的摘要覆盖 | `S-OBS-TELEMETRY-SAFETY`、受影响 suite、`check_redaction.sh`、release checks |
| Query、diagnostic、rebuild、report assembly、export 或 telemetry sink 写 source truth | 立即阻断；记录 no-write violation，禁止风险接受 | `S-OBS-SERVICE-FLOW`、`S-OBS-ENTRY-CAPABILITY`、`S-OBS-STATIC-REDLINE` 和 write-spy checks |
| 引入非 `core-contracts` sibling compile dependency 或反向 writer capability | 立即阻断 | `S-OBS-STATIC-REDLINE`、`check_dependency_boundary.sh`、全量 P0 |
| static template、`latest`、手写表或旧 run 生成 passed evidence、真实 run 或 final verdict | 立即阻断 | `S-OBS-STATIC-REDLINE`、`generate_reports.sh` provenance audit、全量 P0 |
| `EV-CAND-OBS-*` 与 TC/suite/dataset/run 不一致，或 99-row join 发生 orphan/duplicate | 立即阻断；不能猜测修正 | affected raw suite、Step 13 join audit、全量 P0 |
| required lane unavailable 却被低等级 lane 替代或标为 passed | 立即阻断；保留 `blocked/not_run/not_evaluated` | 对应 required suite、config/environment checks、全量 P0 |
| active/held/referenced material 被删除、释放或误标为 eligible | 立即阻断 | retention suites、repository/recovery、cleanup spy、全量 P0 |
| accepted local truth 缺 native history/outbox/result/completion 或跨 phase 盲重试 | 立即阻断 | service/repository/recovery、report provenance、全量 P0 |
| I05/H13 positive path 被本地假 DTO、positive fake 或静态报告填充 | 立即阻断并回写 affected register | entry/recovery suites、Step 06~13 affected audit、全量 P0 |

## 10. 回归执行与证据归档合同

| 回归类型 | 必须生成的设计期要求 | 失败/不可用语义 | 禁止解释 |
|---|---|---|---|
| 最小回归 | exact TC manifest、primary suite、lane/profile、Step 07 DS、run-scoped raw case、suite report、candidate linkage | failed/blocked/not_run/indeterminate 原样保留 | 不能只留下绿色 summary，不能用 P1 替代 P0 |
| 全量 P0 | 9 suite、99-row index、全部 required checks、source/config/dataset manifest、report-audit | 任一 required 输入缺失或 lane 未建立则标记对应 blocked/not_run | 不得删减 manifest 后声称全量完成 |
| 缺陷复验 | failed run 与 fixed run 的独立 identity、原 TC、family/adjacent suite、影响 checks、防回归回写 | 原失败 artifact 永不覆盖；unknown/flaky 由 Step 11 裁决 | 不能只保留修复后的结果 |
| residual review | `reports/acceptance/risk-acceptance.md` 初稿、`reports/review/*` 审查输入、owner/trigger/action | 无接受角色或证据不完整则保持 open | 不得由测试方案代填签署 |
| RuntimeLike unavailable | precondition marker、not-evaluated suite metadata、恢复动作 | `not_evaluated`/`blocked`，不计 P0 passed | 不得以 ISO/INT 或人工截图替代 |

所有回归 invocation 必须复用 Step 13 的 canonical 根：`artifacts/test/<run_id>`、
`reports/runs/<run_id>`、`reports/acceptance` 和 `reports/review`。禁止使用 `latest`，禁止生成第二套 evidence
identity，禁止把 report generated、sink acknowledgement 或 local `Delivered` 写成验收结论。

## 11. 必须转入新版 `06-验收标准.md` 的事项

| 转入项 | 当前 `05` 结论 | 新版 `06` 必须收口 |
|---|---|---|
| P0 run / evidence 引用规则 | Step 13 定义真实 run-scoped provenance contract | 固定验收引用的最小字段、缺失处理和允许的 run 状态 |
| VETO 与回归关系 | §9 定义不可接受红线和重跑方向 | 建立 VETO -> AC -> evidence/check -> final decision 的裁决矩阵 |
| conditional acceptance | residual 只能有条件存在，不能自行通过 | 明确可接受 residual 类型、接受角色、截止/触发条件和升级规则 |
| RuntimeLike / selected-run | 当前未建立，不能替代 P0 | 明确哪些 release 必须有真实 RuntimeLike、何时 `not_evaluated` 仍不可送验 |
| 性能 / 容量阈值 | 当前只允许 sample/trend | 若需要硬门禁，定义 workload、环境、样本、阈值、统计和 owner |
| evidence/artifact retention | 当前只定义 marker/hold/reference，不定天数 | 固定保留期、介质、cleanup authority 和 active reference 保护 |
| 真实 upstream/downstream certification | 当前只测 product-neutral seam | 明确产品绑定后的验收补充项和是否阻断发布 |
| inherited blocker closure | I05/H13 等保持开放 | 明确 owner、关闭证据、重跑范围和不可绕过的前置 |

## 12. Inherited blocker / affected

本 Step 没有发现新的上游 blocker。以下项目级 affected 继续开放，不能通过回归策略或风险接受表关闭：

`S08-E-I05-PAYLOAD-SCHEMA-01`、`S08-E-I05-PRODUCER-EVENT-BINDING-01`、`R06.6-F2-H13-UPSTREAM`、
`R06-F-AFFECT-UOW-01`、`S08-RECOVERY-CLASS-OWNER-01`、`R07-EXTERNAL-PHASE-LINK-01`、
`R07-EXTERNAL-PHASE-RETRY-ACCOUNTING-01`、`S08-CONSUMER-OUTBOX-SURFACE-01`、
`S08-CONSUMER-INDETERMINATE-COMPLETION-01`、`S08-JOB-REPORT-REF-OWNER-01`、
`S08-M1-SECONDARY-TYPE-OWNER-01`、`03-RPR-S09-PER-FLOW`。

处置原则：

- I05 只允许 pre-parse / binding 缺失的 fail-closed 证据；不创建 positive payload/schema fixture。
- J06 只允许 observation-side controlled `Blocked` / manual outcome；不创建 H13 positive execution、external receipt 或 Completed truth。
- UoW、recovery class、external phase、consumer completion、report ref 和 secondary owner 缺口只能写成
  conditional/blocked，并在恢复后回写 Step 06~14 的 exact contract。
- 目标实现仓、CI、RuntimeLike 和真实 artifact/report/evidence 仍未建立；这是当前真实性状态，不是可接受的
  P0 residual，也不应伪造成测试结果。

## 13. 对上游与下游的影响判定

| 结论 | 是否影响上游 | 处理 |
|---|---|---|
| 变更到 suite 的最小回归映射已闭合 | 否 | 可由 Step 15、`06` 和 `07` 引用 |
| 全量 P0 manifest 固定为 9 suite / 99 TC | 否 | 承接 Step 09/13，不改协议或用例语义 |
| 每次回归必须复用 Step 13 provenance | 否 | 只补执行策略，不新增脚本或 evidence identity |
| residual owner/trigger 需由 `06` 固定 | 是（下游） | 新版 `06` 必须定义正式风险接受与裁决 |
| RuntimeLike、硬性能或真实产品认证升级为 gate | 是 | 先回写 `00/04/05/06/07`，再更新环境和回归 manifest |

## 14. 正式 §14 回填草稿

> 校准来源：
> - `design-calibration/05_test_plan_step_14_regression_risks.md`
>
> 延伸阅读：
> - 建议继续阅读本文件的“回归触发表”“全量 P0 回归合同”“残余风险表”“不可风险接受项”和“必须转入新版 `06` 的事项”。

正式 `05-测试方案.md` §14 只承载以下收口结论：

1. 局部变更先跑受影响 exact TC，再跑同 family 关键代表项、相邻 primary suite 和受影响 redline/provenance checks；
   不能只跑改单元，也不能用 wildcard 代替 exact manifest。
2. 需求、truth ownership、public protocol、formal state、UoW/idempotency/outbox、recovery/external phase、
   redaction/no-write/dependency、P0 profile、suite/evidence join 或 S 级缺陷变化，必须请求 9 suite / 99 TC 的
   全量 P0 manifest。
3. 每次回归按 Step 13 保存同一 run 的 raw artifact、suite report、99-row candidate linkage 和 provenance；
   failed、blocked、not_run、indeterminate 和 RuntimeLike unavailable 不得被汇总为 passed。
4. raw body/secret、source truth write、non-core dependency、static evidence、latest、active material cleanup、
   required lane 替代和 affected positive fabrication 都不可风险接受。
5. 真实产品 seam、RuntimeLike、容量/硬阈值、长期 retention 和高级外围能力属于 residual，必须由新版 `06`
   固定接受角色、升级条件和最终裁决方式。

## 15. Step 自检与进入下一步条件

| 检查项 | 结论 |
|---|---|
| SOP 五个问题均已回答 | `pass` |
| 回归触发表具备变更类型、最小集、全量条件和责任角色 | `pass_design`；见 §6 |
| 全量 P0 集可被 `05/06/07` 引用 | `pass_design`；9 suite / 99 TC，见 §7 |
| residual 风险均有影响、缓解、触发条件和接受角色 | `pass_design_with_roles_pending`；见 §8 |
| P0/VETO/affected 不可风险接受边界明确 | `pass`；见 §9、§12 |
| 回归证据承接 Step 13 且禁止 `latest`/静态证据 | `pass_design`；见 §10 |
| 转入新版 `06` 的事项完整 | `pass`；见 §11 |
| 新上游 blocker | `none` |
| 真实测试、run、artifact、report、evidence、签署 | `not_run_by_design` |
| gate_status | `pass_current_step_14_with_inherited_affected_open` |
| next_allowed_action | `rebuild_current_05_step_15_and_formal_document` |
| commit | 不需要；用户未要求提交 |

## 16. 参考

- `standards/document/测试方案讨论流程_SOP.md` Step 14
- `standards/document/测试方案书写规范.md` §5.14
- `projects/L4-observability/design-calibration/05_test_plan_step_06_cases.md`
- `projects/L4-observability/design-calibration/05_test_plan_step_09_automation_gates.md`
- `projects/L4-observability/design-calibration/05_test_plan_step_10_nonfunctional.md`
- `projects/L4-observability/design-calibration/05_test_plan_step_11_defects_retest.md`
- `projects/L4-observability/design-calibration/05_test_plan_step_12_entry_exit.md`
- `projects/L4-observability/design-calibration/05_test_plan_step_13_evidence.md`
- `projects/L4-observability/00-需求文档.md`
- `projects/L4-observability/03-详细设计.md`
- `projects/L4-observability/04-配置设计.md`
- `projects/L1-governance/design-calibration/05_test_plan_step_14_regression_risks.md`
- `projects/L1-artifact/design-calibration/05_test_plan_step_14_regression_risks.md`
