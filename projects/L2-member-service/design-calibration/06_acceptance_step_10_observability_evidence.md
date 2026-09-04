# Step 10. 定义可观测性、审计与证据门禁 · L2-member-service

> 对应 SOP：`standards/document/验收标准讨论流程_SOP.md` Step 10
> 回填章节：`06-验收标准.md` §10 可观测性、审计与证据门禁

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 10 可观测性、审计与证据门禁 |
| 当前状态 | `completed / pass_with_upstream_blockers` |
| 输入基线 | Step 9；`03-详细设计.md` §14；`04-配置设计.md` §8、§10、§12；`05-测试方案.md` §9、§13、§14 |
| 输出文件 | `design-calibration/06_acceptance_step_10_observability_evidence.md` |
| 真实执行状态 | 未执行；未生成 `run_id`、artifact、report、evidence、verdict、signoff 或 readiness |
| gate_status | `pass_with_upstream_blockers` |
| gate_reason | 观测最小材料、业务审计复用边界、raw/report pairing、redaction、dependency、evidence index 和 acceptance handoff 均已定义；真实执行仍受上游合同和实现仓阻塞 |
| next_allowed_action | 进入 Step 11，定义一票否决项 |

### 1.1 Step 内计划

- [x] 读取详细设计观测 / 审计契约和测试方案证据归档规则。
- [x] 区分业务审计材料、运行观测材料、raw artifact、run report 和 acceptance report。
- [x] 清理未在 `05 §13.2` 固定的 `SESSION/HEALTH/CLOSURE/BOUNDARY` 具体证据实例引用。
- [x] 固定 P0 EV、报告路径、脱敏与真实性门禁。
- [x] 完成证据门禁停审和跨证据裁决审计。

## 2. 本步目标

本步定义“什么材料足以让验收方复查裁决”以及“什么缺失或伪造必须阻断验收”。可观测性用于定位本地处理；业务审计用于回链 Host Truth；raw artifact 和 run report 用于证明测试事实；`reports/acceptance/*` 只用于送验交接和人工审查。

本步不把日志、metric、trace、receipt、adapter `Ok`、outbox `submitted` 或 acceptance 初稿升级为 `delivered`、`observed`、`accepted`、ready 或 signoff。`EV-MS-*` 在本文件中均是未来证据注册表条目，不表示当前已经存在证据实例。

## 3. 本步输入

| 输入 | 来源 | 本步用途 |
|---|---|---|
| 安全观测与审计字段 | `03-详细设计.md` §14 | 固定低基数 safe log/metric/trace 和业务审计复用对象 |
| 配置、脱敏和失败策略 | `04-配置设计.md` §8、§10、§12 | 固定 fail-fast、no-output 和降级证据 |
| suite / artifact / report 结构 | `05-测试方案.md` §9、§13 | 固定 EV、目录、schema、digest、脚本与审查关系 |
| P0 AC、VF 与 NFR | `00-需求文档.md` §13~§14；Step 5~9 | 将证据绑定到功能、红线、状态和非功能裁决 |
| 上游 pending | `project_execution_ledger.md` | 防止把 sibling 正向联调或产品 readiness 写成已证明 |

## 4. SOP 问题回答

| 问题 | 回答 | 裁决依据 |
|---|---|---|
| 哪些行为必须有 audit record？ | accepted Command 的 intent / decision / write-set、accepted Consumer marker、Job 选择与结果、配置校验失败、redaction / dependency / report audit、outbox materialization 和 handoff attempt 必须有 safe history、marker、report 或可回链的组合。 | `03` §10、§14；`05` §13 |
| 哪些行为必须有 trace / log / metric？ | public Command、Query、Consumer、Job、builder、resolver、publisher、handoff 和失败路径必须有低基数结构化材料；Query 不得因记录观测而写 UoW。 | `03` §14.1~§14.3 |
| 哪些测试报告必须归档？ | 所有 blocking suite 的 `report.json`、case、stdout/stderr、suite report、summary、gate-results、evidence-index、redaction-check、dependency-boundary、report-audit，以及 acceptance handoff / veto / open-issues；有条件通过候选时还需 risk-acceptance。 | `05` §13.3~§13.9 |
| 证据缺失是否导致不通过？ | 缺 P0 EV、raw artifact、report pair、digest、TC/AC/VF 追溯或硬审计报告时，不得判通过；无法判定时至少暂停送验。 | `05` §13.8；06 书写规范 §5.10 |
| 证据如何被复查？ | 先读固定 `reports/runs/<run_id>/evidence-index.md`，再沿 `report_path` 读 suite report，最后沿 `artifact_path` 复核 raw artifact、case 和 digest。 | `05` §13.6~§13.8 |
| evidence-index 是否覆盖全部 P0 EV？ | 必须覆盖 `EV-MS-CORE-001`、`CONTRACT-001`、`DOMAIN-001`、`CMD-001`、`QUERY-001`、`CONSUMER-001`、`MATERIAL-001`、`JOB-001`、`IDEMP-001`、`CONFIG-001`、`REDACTION-001`、`ARCH-001`、`NFR-001` 和 `REPORT-001`；这些是 `05 §13.2` 唯一固定的 P0 实例入口。 | `05` §13.1~§13.2 |
| gate-results 是否覆盖全部 release gate？ | 必须列出 release-main-smoke、service-flow-fast、contract-domain-fast、entry-worker-job、operations-replay-core、config-redline、redaction-boundary、dependency-boundary 和 report-generation-audit 的 blocking / non-blocking / unavailable 关系；不得用一个总数替代逐 suite 结果。 | `05` §9、§13 |
| redaction-check 是否证明 artifact 和 report 安全？ | 扫描 `artifacts/test/<run_id>` 和 `reports/runs/<run_id>`，覆盖 stdout/stderr、case、报告和 acceptance 引用；任何 raw body、secret、endpoint、token、stack 或外部正文泄露都失败。 | `03` §14.4；`05` §13.8 |
| acceptance handoff / veto / risk 文件能否替代 raw artifact？ | 不能。它们是交接和人工审查入口，不能创造 EV、覆盖失败或改变 raw status。 | `05` §13.9 |
| 每个 P0 EV 是否能回指 TC、suite、artifact、report 和 AC/VF？ | 必须能。缺任一链路即为 orphan / incomplete evidence，不能形成 P0 通过依据。 | `05` §13.7~§13.8 |
| `submitted / delivered / observed / accepted` 如何观测？ | 每层记录 target-specific key、marker、revision、correlation 和 owner feedback；本地 receipt、日志、trace、adapter `Ok`、submitted 不得推导后续层。 | `03` §6.1、§10.4、§14 |
| pending / blocked / waiting 如何进入证据？ | 实际 suite 使用 `status=unavailable|not_run` 并附 `blocker_status=blocked|waiting|pending`；校准材料只能说明 planned registry，不得写成 passed。 | `05` §13.1、§13.8 |
| 是否允许从静态映射表生成 evidence index？ | 不允许。index 只能由真实 raw artifact、suite report、case refs 和 digest 关系推导；静态映射只能作为计划，不产生 evidence。 | `05` §13.8 |
| 证据门禁完成后是否需要停审？ | 需要。逐项检查 artifact/report pairing、EV 回链、脱敏、依赖和 acceptance 文件审查状态，并记录跨证据审计。 | 验收 SOP Step 10 执行约束 |

## 5. 当前文档问题诊断

| 材料 / 位置 | 问题 | 本步处理 |
|---|---|---|
| 旧 `06-验收标准.md` | 以 API / DB / trace 泛化描述代替 run-scoped 证据，不能复查。 | 统一固定 `artifacts/test/<run_id>`、`reports/runs/<run_id>` 和 `reports/acceptance/*` 三类入口。 |
| `05` 早期追溯表 | 曾使用“session / health / closure / boundary”等逻辑证据别名，但 `05 §13.2` 没有固定这些实例。 | 06 只引用 `05 §13.2` 的 14 个固定实例；逻辑主题只能作为测试说明，不得作为 EV instance。 |
| 观测与业务审计混同 | 日志、metric、trace 容易被误读为 Host Truth 或外部完成。 | 明确业务审计复用 HostHistory / Material / Handoff / Outbox / Projection / Job marker；观测材料不新增 truth owner。 |
| acceptance 报告边界不清 | handoff / veto / risk 文件可能被当成最终证据。 | 固定为审查入口，不能替代 raw artifact，也不能默认 passed。 |

## 6. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| EV 实例 | 主题别名和固定实例混用 | 仅 `05 §13.2` 的 14 个实例可作为未来证据入口 | 防止 06 发明证据实例 |
| artifact / report | 泛化路径 | 固定 run-scoped 路径、schema 和 digest | 可复验、可审计 |
| 观测材料 | 日志 / receipt 可能被当完成证明 | 只说明本地处理和关联，不跨层推导 | 保留四层 handoff 语义 |
| acceptance 文件 | 可被误读为最终裁决 | 只作交接 / 审查，真实结果仍来自 raw/report | 防止人工补洞 |
| 当前状态 | 容易写成已通过 | 明确未执行、无实例、无 signoff | 保持证据诚实 |

## 7. 验收裁决取舍

| 议题 | 方案 | 结论 |
|---|---|---|
| 是否新增 SESSION / HEALTH / CLOSURE / BOUNDARY 证据实例？ | A. 新增以便语义直观；B. 复用已固定族并保持逻辑主题为说明 | 采用 B；新增实例必须先改 `05 §13.2` 并重新停审，当前不扩充分母。 |
| 是否允许 report 脚本在缺 raw artifact 时补表？ | A. 允许；B. 禁止 | 采用 B；缺 raw 即 incomplete / unavailable，不得补成 passed。 |
| 观测 backend 不可用是否抹除本地审计？ | A. 抹除；B. 保留本地 safe material 并记录 gap | 采用 B；backend 不拥有本仓 truth。 |
| `submitted` 能否作为 `delivered` 的代理？ | A. 可以；B. 不可以 | 采用 B；四层必须由各自 owner feedback 推进。 |
| acceptance handoff 能否支撑有条件通过？ | A. 单独支撑；B. 只能整理已存在 evidence / risk | 采用 B；风险仍需真实 evidence 和明确 acceptor。 |

## 8. 结构化中间产物

### 8.1 证据与观测门禁表

| 门禁主题 | 必须存在的材料 | 通过条件 | 失败条件 | 裁决影响 |
|---|---|---|---|---|
| accepted mutation audit | HostHistory / HostFactMaterial / HostOutboxRecord / stored-result safe refs | intent、decision、write-set、revision、correlation 可回链 | accepted truth 缺 history / material / result 或只能靠日志推断 | P0 不通过 |
| rejected / blocked path | safe disposition、reason ref、可选审计 marker | 非法主语、scope、缺 required seam 和 dependency gap 均有可解释结果 | 失败被吞掉、默认 allow 或无 reason | 触发 `VF-MS-002/004/009` |
| Query / view observation | query span、safe outcome、visibility / freshness marker | Query 可复查且 no-write | Query 为记录观测而 reserve / refresh / repair | 触发 `VF-MS-007` |
| Consumer observation | source/version/correlation/generation、dedup/late/gap marker | accepted / duplicate / unsupported / late 均可区分 | payload 正文落库、迟到覆盖 current 或 receipt 被升格 | 触发 `VF-MS-005/006/007` |
| Job observation | selector、item result、partial / unknown、report ref | Job 只推进已提交 work，逐项结果可复盘 | Job 创建授权 / decision、换 key 重放或无报告 | 触发 `VF-MS-006/007/009` |
| outbox / handoff observation | immutable material、publication / handoff attempt marker、target-safe ref | source cursor 已提交，四层 handoff 独立 | current truth 现查现组包或 `submitted` 推 accepted | 触发 `VF-MS-007` |
| configuration observation | validation issue ref、profile、config digest、builder outcome | invalid / unavailable / disabled 可解释且 no secret | silent fallback、partial facade 或 raw config 泄漏 | 触发 `VF-MS-004/005/009` |
| redaction observation | redaction-check 覆盖 artifact + report | 扫描完整且 clean；negative leak 安全失败 | raw body / secret / endpoint / stack / external body 泄漏 | 触发 `VF-MS-005` |
| dependency observation | dependency graph、source ref、分类报告 | 仅批准 compile seam；其余 runtime/event/ref/adapter/fake | sibling 源码依赖或分类缺失 | 触发 `VF-MS-008` |
| report / evidence observation | evidence-index、gate-results、report-audit、review status | EV 从 raw/report pair 推导，无 orphan / static evidence | 缺 artifact、缺 digest、手写 passed 或 `latest` | 触发 `VF-MS-009` |

### 8.2 P0 Evidence 追溯表（未来注册表）

| Evidence ID | 测试用例族 | suite artifact | report path | 关联 AC / VF | 缺失影响 |
|---|---|---|---|---|---|
| `EV-MS-CORE-001` | representative core cases | `artifacts/test/<run_id>/suites/release-main-smoke/` | `reports/runs/<run_id>/suites/release-main-smoke.md` | AC-MS-001~005；VF-MS-001 | 核心闭环不可裁决 |
| `EV-MS-CONTRACT-001` | `TC-CONTRACT-*` | `artifacts/test/<run_id>/suites/contract-domain-fast/` | `reports/runs/<run_id>/suites/contract-domain-fast.md` | AC-MS-006~017 | contracts / DTO 不可裁决 |
| `EV-MS-DOMAIN-001` | `TC-DOMAIN-*`、`TC-STATE-*` | `artifacts/test/<run_id>/suites/contract-domain-fast/` | `reports/runs/<run_id>/suites/contract-domain-fast.md` | AC-MS-022~027；VF-MS-004/006 | 状态与红线不可裁决 |
| `EV-MS-CMD-001` | `TC-INTENT-*`…`TC-CLOSE-*` | `artifacts/test/<run_id>/suites/service-flow-fast/` | `reports/runs/<run_id>/suites/service-flow-fast.md` | AC-MS-006~017；VF-MS-002~007 | Command 主链不可裁决 |
| `EV-MS-QUERY-001` | `TC-QUERY-*` | `artifacts/test/<run_id>/suites/service-flow-fast/` | `reports/runs/<run_id>/suites/service-flow-fast.md` | AC-MS-012/017/021；VF-MS-007 | Query no-write 不可裁决 |
| `EV-MS-CONSUMER-001` | `TC-CONSUMER-*` | `artifacts/test/<run_id>/suites/entry-worker-job/` | `reports/runs/<run_id>/suites/entry-worker-job.md` | AC-MS-011~017；VF-MS-006/007 | Consumer seam 不可裁决 |
| `EV-MS-MATERIAL-001` | `TC-MATERIAL-001` | `artifacts/test/<run_id>/suites/infra-runtime-fake/` 或 replay suite | 对应 suite report | AC-MS-017/032；VF-MS-007 | immutable material 不可裁决 |
| `EV-MS-JOB-001` | `TC-JOB-*` | `artifacts/test/<run_id>/suites/operations-replay-core/` | `reports/runs/<run_id>/suites/operations-replay-core.md` | AC-MS-015~017/039；VF-MS-007 | Job / reconciliation 不可裁决 |
| `EV-MS-IDEMP-001` | `TC-IDEMP-*` | `artifacts/test/<run_id>/suites/service-flow-fast/` 或 replay suite | 对应 suite report | AC-MS-007/014/038；VF-MS-006 | duplicate / unknown 不可裁决 |
| `EV-MS-CONFIG-001` | `TC-CONFIG-*` | `artifacts/test/<run_id>/suites/config-redline/` | `reports/runs/<run_id>/suites/config-redline.md` | AC-MS-023/029/036；VF-MS-004/008 | config gate 不可裁决 |
| `EV-MS-REDACTION-001` | `TC-REDACTION-*` | `artifacts/test/<run_id>/suites/redaction-boundary/` | `reports/runs/<run_id>/redaction-check.md` | AC-MS-028~032/036~039；VF-MS-005 | 泄漏 / no-output 不可裁决 |
| `EV-MS-ARCH-001` | `TC-ARCH-001` | `artifacts/test/<run_id>/suites/dependency-boundary/` | `reports/runs/<run_id>/dependency-boundary.md` | AC-MS-027/036；VF-MS-008 | 依赖边界不可裁决 |
| `EV-MS-NFR-001` | `TC-NFR-*` 与相关 representative cuts | 各 contributing suite artifact root | `reports/runs/<run_id>/summary.md` 及 contributing reports | AC-MS-034~039 | NFR 不可裁决 |
| `EV-MS-REPORT-001` | report-audit cases | `artifacts/test/<run_id>/suites/report-generation-audit/` | `reports/runs/<run_id>/report-audit.md` | AC-MS-037；VF-MS-009 | 证据诚实不可裁决 |

### 8.3 Report 完整性检查表

| 检查项 | 固定路径 | 通过条件 | 失败影响 |
|---|---|---|---|
| EV 索引 | `reports/runs/<run_id>/evidence-index.md` | 14 个 P0 EV 可回指 TC、AC/VF、suite、artifact、report、digest、review status | P0 不可裁决 |
| 门禁结果 | `reports/runs/<run_id>/gate-results.md` | blocking / non-blocking / unavailable 分类完整 | P0 不通过或暂停 |
| 脱敏检查 | `reports/runs/<run_id>/redaction-check.md` | artifact 和 report 全范围 clean | `VF-MS-005` |
| 依赖边界 | `reports/runs/<run_id>/dependency-boundary.md` | 仅允许 Core compile seam | `VF-MS-008` |
| 报告审计 | `reports/runs/<run_id>/report-audit.md` | no orphan、no static evidence、artifact/report pairing 完整 | `VF-MS-009` |
| 验收交接 | `reports/acceptance/handoff.md` | 经人 / Agent 审查并说明基线、范围、未覆盖和 blocker | 送验交接不完整 |
| 否决清单 | `reports/acceptance/veto-checklist.md` | 每个 VF 有真实证据 / 缺陷状态，不默认 passed | 不得通过 |
| 风险接受 | `reports/acceptance/risk-acceptance.md` | 每个可接受 residual 有 owner、acceptor、理由、后续动作和 deadline/trigger | 不得有条件通过 |

### 8.4 证据状态与 blocker 规则

| 场景 | 允许状态 | 必须附加 | 禁止解释 |
|---|---|---|---|
| 真实 suite 通过 | `passed` | raw artifact、report、digest、review | 不得仅凭静态表产生 |
| 真实 suite 失败 / 部分 | `failed` / `partial` | safe failure reason、完整失败材料 | 不得删除或改写为 passed |
| 上游合同不可用 | `unavailable` | `blocker_status=blocked|waiting|pending` | 不得当作 P0 positive passed |
| 尚未运行 | `not_run` | safe reason | 不得当作未触发 VETO |
| 跳过 | `skipped` | skip reason 和范围 | 不得当作覆盖完成 |
| 设计期注册表 | 无实际 status | 仅保留计划、路径和绑定 | 不得生成 run、artifact 或 evidence instance |

### 8.5 证据流图：从原始材料到验收交接

```text
suite / gate execution
        |
        v
artifacts/test/<run_id>/
  report.json + cases + logs + digest
        |
        v
report scripts / checks
        |
        +--> reports/runs/<run_id>/evidence-index.md
        +--> reports/runs/<run_id>/gate-results.md
        +--> redaction / dependency / report-audit
        |
        v
reports/acceptance/
  handoff + veto-checklist + risk-acceptance + open-issues
        |
        v
06 acceptance decision
```

关键说明：

- 图表达 raw artifact、可读 report、审查入口和验收裁决之间的单向证据关系。
- 图不表达任何具体实现、CI 产品、消息路由或外部 backend 的 ready 状态。
- acceptance 文件不能反向创建 artifact、修改 suite status 或补齐缺失 digest。

### 8.6 证据门禁停审记录

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| EV 实例命名 | 通过 | 06 已删除未由 `05 §13.2` 固定的具体 SESSION/HEALTH/CLOSURE/BOUNDARY 实例引用 |
| P0 EV 覆盖 | 通过（设计层） | 14 个固定实例均有 TC、AC/VF、suite、artifact、report 入口；真实状态待执行 |
| artifact/report pairing | 通过（规则层） | 缺 pair、digest 或 case 时必须 incomplete/unavailable |
| redaction | 通过（规则层） | 扫描 artifact 与 report；发现泄漏触发 VF-MS-005 |
| dependency | 通过（规则层） | 只允许批准的 Core compile seam；其余保持 runtime/event/ref/adapter/fake |
| acceptance handoff | 通过（边界层） | handoff/veto/risk 只能作审查入口，不替代 raw artifact |
| 当前真实证据 | 未执行 | 无 run_id、artifact、report、verdict、signoff、readiness |

### 8.7 跨证据裁决审计表

| 审计项 | 结论 | 后续要求 |
|---|---|---|
| orphan EV | 已禁止 | report-audit 必须逐项检查回链 |
| 静态造证据 | 已禁止 | evidence index 只能从 raw/report pair 推导 |
| 缺 report / raw artifact | 已禁止 | blocking suite 缺失即暂停或不通过 |
| failed suite 被改写 | 已禁止 | 保留失败材料和 safe failure reason |
| redaction 扫描不完整 | 已禁止 | 扫描必须覆盖 artifact + report + logs |
| acceptance 初稿未经审查 | 已禁止作为最终证据 | 人 / Agent 审查状态必须明确 |
| unsupported sibling 正向 | 已约束 | `unavailable/not_run + blocker_status`，不计 P0 passed |

## 9. 回填草稿

正式 §10 应写明：P0 证据必须固定到 `reports/runs/<run_id>` 和 `artifacts/test/<run_id>`；14 个 `EV-MS-*-001` 实例只能由真实 raw artifact / report pair 推导；`gate-results`、`redaction-check`、`dependency-boundary`、`report-audit` 和 acceptance handoff 均为固定入口；任何 orphan、静态造证据、缺 digest、redaction 泄漏或 handoff 未审查都不得支持通过。业务审计复用 HostHistory / Material / Handoff / Outbox / Projection / Job marker，观测材料不新增 truth owner。

## 10. 待确认事项

| 事项 | 影响 | 当前处理 |
|---|---|---|
| 实现仓实际报告脚本名称 | 影响执行路径 | 06 只固定语义、参数和输出路径；具体脚本由实施计划 / 实现仓对齐 |
| 观测 backend、采样、保留和告警策略 | 影响长期运维证据 | 保留 `MSVC-OBS-001` residual，不写产品或数字 |
| Core/Bus trace envelope 与 receipt | 影响跨仓正向交互证据 | `MSVC-UP-007` pending；只保留 topic-neutral、body-free seam |
| Member/Runtime/Sandbox/Images 正向 feedback | 影响 selected integration | `MSVC-UP-001~004/006` blocked/waiting；不伪造 positive EV |

## 11. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| 最小安全观测与业务审计边界明确 | 通过 | 见 §8.1 |
| P0 EV / artifact / report 关系固定 | 通过（计划层） | 见 §8.2~§8.4；真实执行未发生 |
| redaction / dependency / report audit 为硬门禁 | 通过 | 失败不得风险接受 |
| 跨证据审计无设计冲突 | 通过 | 见 §8.7 |
| 可进入 Step 11 | 允许 | 定义一票否决项，不代表任何证据已通过 |
