# L4-observability 05-测试方案 Step 12 · 进入准则与退出准则

## Step 状态

| 字段 | 当前值 |
|---|---|
| project / document | `L4-observability` / `05-测试方案.md` |
| step | `12 / 定义进入准则与退出准则` |
| mode | `full-restart` |
| status | `completed_current_with_inherited_affected_open` |
| current_module | `entry_exit_blocked_not_run_truthfulness` |
| direct_input | current Step 06~11、`04` lane/config、`06` entry/VETO/exit inputs、Step 09 artifact/report contract |
| formal_document_write | `not_allowed_until_step_15` |
| implementation / test execution | `not_started` / `not_run` |
| run / artifact / report / evidence | `absent_by_design`; 只定义未来 producer contract |
| new_upstream_blocker | `none` |
| inherited_blocker | 12 项 inherited blocker / affected 保持开放，见 §10 |
| next_allowed_action | `rebuild_current_05_step_13` |
| commit | 不需要；用户未要求提交 |

旧 81 行稿只重复 generic schema 摘要，未区分设计装配门禁、真实测试轮次门禁、lane 真实性、blocked/not-run 和
证据完整性，已作为 `historical_material` 删除并重建。本文件只定义规则，不填写任何实际执行结果。

## 1. 本步目标与边界

本 Step 同时固定两种进入/退出语义：

1. **测试方案内部推进门禁**：判断 Step 11 完成后是否可以进入 Step 13，并确保中间产物链没有缺失。
2. **未来测试轮次门禁**：判断真实测试是否可以开始，以及何时可结束当前测试轮次。真实测试仍必须使用固定
   `run_id`、raw artifact、report 和 defect record；设计阶段不得填充这些事实。

退出结论只允许描述测试轮次状态：`eligible_to_exit`、`blocked`、`conditional_with_recorded_residual` 或
`not_run`。它不等于 `06` 的最终验收 verdict、signoff 或 release decision。

## 2. SOP 问题回答

| 问题 | 当前回答 |
|---|---|
| 开始测试前哪些文档必须冻结 | 正式 `00-需求文档.md`、`01-架构设计.md`、`02-概要设计.md`、`03-详细设计.md`、`04-配置设计.md` 的 current baseline；Step 01~11 的输入/用例/数据/环境/gate/专项/缺陷结论；影响 DTO、state、flow、config、redaction、dependency、query no-write 或 Job recovery 的变更必须先回流并重审。正式 `05` 是否已装配不是未来测试设计启动的前置，但必须在验收/实施交接前装配。 |
| 哪些环境和数据必须可用 | 当前 P0 主证据需要 `ENV-CI-ISO` 与适用的 `ENV-CI-INT`；82 个 dataset 中对应 P0 TC 的数据必须可构造、隔离、清理。`ENV-STG-RT` 未建立时其 RuntimeLike cases 保持 `planned_not_evaluated/not_run`，不得用 ISO/INT 结果替代。 |
| 哪些自动化必须可运行 | `run_ci_gate.sh`、`generate_reports.sh`、`check_redaction.sh`、`check_metric_labels.sh`、`check_dependency_boundary.sh` 的输入、root、profile 和 exit semantics 必须已固定；真实执行时每个 required suite 必须产生同 run raw result，check 不可执行即对应 gate blocked。 |
| 退出时哪些用例必须通过 | 所有可运行的 P0 TC 及其 required suite/check 必须有真实 run-scoped 结果；inherited affected 只可产生显式 `blocked/conditional` 条目，不可伪造 pass。所有 `VF-OBS-001~010` 必须没有未关闭的 S 缺陷；影响 P0 truth/release chain 的 A 缺陷必须为零或有明确且允许的条件性记录。 |
| 哪些缺陷和风险阻断退出 | S 级一律阻断；A 级若影响 P0、truth ownership、no-write、redaction、dependency、retention、report authenticity 或 required lane，一律阻断；B/R 和无来源性能数字只要有记录、owner、触发条件和后续动作，可不阻断当前 P0。缺 raw artifact、report pairing、静态 evidence 或 `latest` 引用也阻断。 |

## 3. 当前材料诊断与设计取舍

| 输入 | 历史问题 | current 处置 |
|---|---|---|
| 旧 Step 12 | 把所有条件压缩为“文档已完成/可运行”，未定义 machine-checkable predicate | 按文档、数据、环境、automation、defect、evidence 六组 checklist 重建 |
| 旧 `05` / `06` | 混淆测试退出与验收签署，且使用 `latest` / 静态 EV 风险 | 测试退出只判断 run evidence 和缺陷状态；验收裁决留给 `06` |
| Step 08 | lane contract 已定义但实例未建立 | 保留 `defined` 与 `not_established` 双状态；不可用不 fallback |
| Step 09 | suite/check 和路径已闭合但没有总 entry/exit gate | 本 Step 将 required suite、script、artifact/report pairing 汇总为门禁 |
| Step 10 | 性能和 RuntimeLike 口径可能被误当硬阈值 | 只要求结构性 sample/trend 和显式 not-run；不继承历史 P95/SLA |
| Step 11 | 缺陷分级已独立定义但未接入退出 | 将 S/A/B/R 与退出阻断和条件性 residual 直接连接 |

### 3.1 设计取舍

| 议题 | 采用 | 放弃 | 理由 |
|---|---|---|---|
| 正式 `05` 是否阻断测试设计启动 | Step 中间产物完成即可；正式装配在 Step 15 | 以未装配正式文档阻止所有设计验证 | 装配是文档输出，不替代 current 设计事实 |
| local lane 是否能作为退出证据 | 只用于 sanity/debug | 用 local Fake 结果填充 CI/INT/RT | 防止环境等级和证据等级混淆 |
| RuntimeLike 缺失 | 保持 not-evaluated，报告缺前置 | 以 CI/controlled 结果冒充 | 保持真实性边界 |
| 正式 EV 是否是测试退出前置 | 需要真实 run->artifact->report->candidate linkage；正式 alias/验收签署后置 | 设计期预填 EV alias | candidate 不是正式 evidence |
| 性能退出 | sample/count/trend 存在且可追溯 | 继承历史数值作为硬 fail | 没有正式负载/阈值来源 |

## 4. 进入准则

以下 checklist 是未来开始一轮真实测试的必要条件。每一项必须能由固定文件、命令输出、环境探针或 dataset
manifest 判定，不得使用“基本可用”“大致完成”等措辞。

### 4.1 设计与追溯输入

- [ ] `00~04` current baseline identity 已记录，且没有待处理的影响 P0 case 的 schema/state/flow/config 变更。
- [ ] Step 01~11 的中间产物文件存在，flow 与 `project_execution_ledger.md` 的 current 状态一致。
- [ ] Step 06 的 99 个唯一 `TC-OBS-*`、Step 07 的 82 个 dataset、Step 09 的 9 suite / 5 script contract 均可被解析。
- [ ] 每个 required TC 有唯一 primary suite、dataset、lane/profile、候选 evidence linkage；不得引用不存在的编号。
- [ ] Step 10 的 12 个专项和 Step 11 的 S/A/B/R 规则未被后续文档冲突覆盖。
- [ ] inherited blocker / affected 已列入本轮 scope；需要 upstream positive capability 的 case 已标 `blocked/conditional/not_run`。

### 4.2 数据与隔离

- [ ] 当前 run 能分配 deterministic `test_run_ref`、独立 namespace、clock/ID policy 和 cleanup owner。
- [ ] 该轮 required `DS-OBS-*` 可构造，负向 sentinel、sensitive ref、write spy、truth comparison 和 corruption fixture 可重复加载。
- [ ] 每个 dataset 明确 builder/fake/durable/read-only 方式、允许 profile、污染面和清理动作。
- [ ] forbidden corpus 和 metric label allowlist 可供同 run checks 读取；corpus 缺失按 blocked，不按 clean。
- [ ] dataset cleanup 不触碰 source owner truth、相邻仓 store 或其他 run namespace。

### 4.3 环境与配置

- [ ] `ENV-CI-ISO` / `LocalTest` 能运行 required contract/domain/service/static suites，且 profile validation 通过。
- [ ] 需要 durable、restart、CAS、claim/fence、outbox 或 external phase 的 case 已有 `ENV-CI-INT` / `IntegrationLike`；缺失时按原 lane blocked/not_run。
- [ ] `ENV-STG-RT` / `RuntimeLike` 若被选择，必须有 approved Durable/Endpoint/Disabled、managed locator、body-free canary 和独立 run；不允许 Fake/Controlled/InMemory shortcut。
- [ ] config snapshot、source/config digest、profile/lane identity、dependency availability 和 secret/provider reference 均可回指；不得在报告中写 secret value。
- [ ] only `core-contracts` compile dependency 可由 graph snapshot 证明；其他 sibling 通过 runtime/event/handoff seam。

### 4.4 自动化与产物

- [ ] `scripts/gates/run_ci_gate.sh` 输入的 `--run-id`、`--artifact-root`、`--config-profile` 合法且 root 与 run 一致。
- [ ] `scripts/reports/generate_reports.sh` 能只读取同一 `artifacts/test/<run_id>`，缺输入时返回 nonzero/blocked report，不补默认成功。
- [ ] `check_redaction.sh`、`check_metric_labels.sh`、`check_dependency_boundary.sh` 的 source/config/corpus 输入已存在且不可执行即阻断对应 gate。
- [ ] required suite 的 raw artifact、stdout/stderr、report.json、failure reason 和 provenance metadata 目录可写且不会覆盖既有 run。
- [ ] reports root 固定为 `reports/runs/<run_id>`；当前不使用 `latest`，不提前写 `reports/acceptance` 的最终裁决。

### 4.5 缺陷与真实性

- [ ] Step 11 的 `S/A/B/R`、升级、targeted/family/full-retest 和关闭证据规则已加载。
- [ ] 既有未关闭 S 缺陷为零；影响本轮 P0 chain 的 A 缺陷已阻断或有明确允许的条件性记录。
- [ ] 当前没有把 planned/blocked/not-run material 标为 passed/green/accepted，也没有真实 EV alias、verdict、signoff。
- [ ] 运行前已指定 reviewer/Agent 对失败原因、report provenance 和 redaction finding 的审查责任。

## 5. 退出准则

退出必须同时满足适用的 P0、证据和缺陷条件。任何“不适用”必须给出规则来源和 lane 状态，不能用空白勾选代替。

### 5.1 可运行 P0 结果

- [ ] 本轮所有可运行 P0 `TC-OBS-*` 均有同一规则下的真实结果；`passed`、`failed`、`blocked`、`not_run` 状态与 suite raw artifact 一致。
- [ ] 每个 required suite 都生成 `report.json`、stdout/stderr、failure reason 和 provenance metadata；失败 suite 不能省略产物。
- [ ] `S-OBS-CONTRACT-DOMAIN`、`S-OBS-SERVICE-FLOW`、`S-OBS-CONFIG-REDLINE`、`S-OBS-STATIC-REDLINE`、`S-OBS-TELEMETRY-SAFETY` 的 ISO required cases 已有结果。
- [ ] 需要 durable 的 `S-OBS-REPOSITORY-CONFORMANCE`、`S-OBS-RECOVERY-REPLAY`、INT service subset 已在 `ENV-CI-INT` 独立 run 中记录；ISO 结果不能替代。
- [ ] `S-OBS-ENTRY-CAPABILITY` 的可运行路径已验证；I05 positive landing 仍受 inherited blocker 时必须保持 blocked/conditional。
- [ ] `S-OBS-RELEASE-SMOKE` 只有在 `ENV-STG-RT` 建立时才参与正向退出；未建立时必须输出 not_evaluated/blocked reason，不得升级 CI 结果。

### 5.2 P0 redline 与缺陷

- [ ] `VF-OBS-001~010` 均没有未关闭触发记录。
- [ ] 未发现 raw body/secret/evidence body、source truth write、query/job repair、active reference delete、non-core compile edge、静态 evidence 或 `latest` 伪造。
- [ ] 没有未关闭 S 级缺陷；影响 P0 truth/release chain 的 A 级缺陷为零，或按 §6 形成允许的条件性状态和 owner。
- [ ] duplicate、commit unknown、missing/corrupt stored result、outbox/external unknown、claim/fence 和 retention race 的适用 fault case 均有明确结果。
- [ ] `check_redaction.sh`、`check_metric_labels.sh`、`check_dependency_boundary.sh` 在同一 run 上成功执行；不能以脚本未运行当作通过。

### 5.3 证据与报告完整性

- [ ] raw artifact 根为 `artifacts/test/<run_id>`，report 根为 `reports/runs/<run_id>`，两者 run identity 一致且没有 `latest`。
- [ ] 每个 candidate EV 都能从真实 raw case -> suite report -> report index 回指 TC、dataset、suite、lane/profile 和 AC/VF；孤儿 EV 或静态映射阻断退出。
- [ ] redaction、metric label、dependency 和 report provenance check report 均存在；finding 不含敏感正文。
- [ ] report 只折叠已提交的 observation projection/linkage/gap/authenticity material；不得生成最终 verdict、signoff 或真实 evidence alias。
- [ ] performance sample/trend 对每个执行 profile 记录 operation、duration/count、输入完整性和环境语境；无来源历史数值未达不单独阻断。

### 5.4 条件退出与不允许退出

| 状态 | 允许条件 | 必须记录 | 是否可进入后续文档 |
|---|---|---|---|
| `eligible_to_exit` | 所有适用 P0、redline、artifact/report、缺陷和真实性条件满足 | run summary、coverage、open residual=0 或仅非阻断 | 是 |
| `conditional_with_recorded_residual` | 无 VETO、无 S；未触及 P0 truth 的 A 已明确接受；B/R、P1、RuntimeLike unavailable 有 owner/trigger | residual table、接受人、截止/触发条件、受影响 lane | 是，但 `06` 只能据此决定有条件结论 |
| `blocked` | required lane/data/script 缺失、P0 case 未运行、S/A blocker、raw/report pairing 缺失、check 未执行或 VETO 命中 | blocked reason、缺失输入、恢复动作；不得生成 pass | 否，先修复/补齐 |
| `not_run` | 整轮没有合法 environment/run，或仅设计阶段 | `not_run` 状态和原因 | 否，不能作为测试退出 |

## 6. 暂停、阻断与恢复规则

| 触发条件 | 即时动作 | 恢复前置 | 禁止替代 |
|---|---|---|---|
| 设计字段/state/phase/config 未闭口，TC 无法稳定构造 | 暂停并回流受影响设计 Step | 更新 formal/current source，重审 traceability/cases/data/gates | 实现端临时补字段 |
| P0 profile/config validation 失败 | lane blocked；停止该 lane | 修复 config/环境并建立新 run | fallback 到低等级 lane 记 pass |
| `ENV-CI-INT` 缺失 | INT-only cases blocked/not_run | durable schema/UoW/CAS/fence/restart 等前置建立 | ISO fake 结果填充 INT |
| `ENV-STG-RT` 缺失 | RuntimeLike cases not_evaluated | managed endpoint/config/credential/canary 建立 | CI/controlled 结果升级为 RT |
| redaction/metric/dependency check 不可执行或失败 | 直接阻断对应 gate | 同 run 输入完整且 check 成功 | 手工浏览或空报告替代 |
| source writer spy 非零、truth snapshot 改变 | S 级阻断 | 修复 boundary 并重跑 affected/full gate | 只看日志声称 no-write |
| report 缺 raw artifact、wrong run、orphan EV 或使用 latest | 阻断退出 | 重新生成同 run report；保留失败材料 | 手写 index/summary |
| J06/I05 inherited capability 不可用 | 保持 controlled blocked/conditional | 上游 owner/binding/schema 闭合后另起 run | 本地 canonical DTO、positive H13、真实 EV |
| 旧性能数字未达但 sample 完整 | 记录 B/R residual | future baseline 回写需求/验收后再定 | 把历史数字当当前 S/A |

## 7. 入口/出口来源追溯

| 门禁组 | 主要来源 | 可判定产物 |
|---|---|---|
| design baseline | formal `00~04`、Step 01~06 | source identity、TC/AC/VF/协议/状态解析结果 |
| dataset readiness | Step 07 | dataset manifest、namespace、cleanup and corpus checks |
| environment/config | Step 08 | lane/profile probe、config snapshot、dependency classification |
| automation | Step 09 | suite registry、script contract、raw/report root checks |
| special quality | Step 10 | redaction/no-write/fault/performance/evidence matrix |
| defect/retest | Step 11 | severity ledger、open blocker/residual list、retest plan |
| report/evidence | Step 13 (下游) | run-scoped report、candidate linkage、archive audit |

## 8. 停审与跨准则审计

### 8.1 单项停审

| 审查项 | 结论 |
|---|---|
| entry checklist 是否都有固定输入或机器可判定谓词 | pass |
| exit checklist 是否区分 passed/blocked/not_run/conditional | pass |
| P0 lane 与 RuntimeLike lane 是否分离 | pass |
| missing environment 是否允许 fallback | no |
| S/VF、raw artifact、report provenance 是否阻断退出 | yes |
| 性能无来源数字是否被误当硬阈值 | no |
| 正式 EV/verdict/signoff 是否提前生成 | no |

### 8.2 跨准则审计

| 审计项 | 结论 | 说明 |
|---|---|---|
| 文档、数据、环境、自动化、专项、缺陷是否全进入 entry | pass | §4.1~§4.5 |
| P0 TC、VETO、suite/check、缺陷、run evidence 是否全进入 exit | pass | §5.1~§5.3 |
| 是否存在“无 raw artifact 也能退出”路径 | no | §5.3 是硬门禁 |
| 是否存在“CI 代替 RuntimeLike”路径 | no | §5.1/§6 显式禁止 |
| 是否把 inherited blocker 当作已通过或实现缺陷 | no | §6 |
| 是否产生真实执行结果 | no; `not_run` by design |

## 9. 对上游设计的影响判定

| 结论 | 是否影响上游 | 处理 |
|---|---|---|
| Step 中间产物完成即可启动测试设计准备，不必等待正式 `05` 装配 | 否 | 文档装配与测试执行分工明确 |
| RuntimeLike 未建立时保持 not_evaluated | 否 | 已由 Step 08/09/10 定义 |
| exit 需要 raw artifact/report pairing | 否 | 与 Step 09 和测试方案规范一致 |
| future 将 selected RuntimeLike 或 numeric performance 升为 P0 | 是 | 必须回写 `00/05/06/07`、环境和门禁 |

## 10. inherited blocker / affected

保持开放：`S08-E-I05-PAYLOAD-SCHEMA-01`、`S08-E-I05-PRODUCER-EVENT-BINDING-01`、`R06.6-F2-H13-UPSTREAM`、
`R06-F-AFFECT-UOW-01`、`S08-RECOVERY-CLASS-OWNER-01`、`R07-EXTERNAL-PHASE-LINK-01`、
`R07-EXTERNAL-PHASE-RETRY-ACCOUNTING-01`、`S08-CONSUMER-OUTBOX-SURFACE-01`、
`S08-CONSUMER-INDETERMINATE-COMPLETION-01`、`S08-JOB-REPORT-REF-OWNER-01`、
`S08-M1-SECONDARY-TYPE-OWNER-01`、`03-RPR-S09-PER-FLOW`。

本 Step 没有发现新的上游 blocker；目标实现仓、CI、RuntimeLike、真实 artifact/report/evidence 仍未建立，均保留
真实性状态，不得写成通过或阻断已关闭。

## 11. 正式 §12 回填草稿

正式 `05-测试方案.md` §12 应装配：

- 进入测试前固定 `00~04` baseline、Step 01~11、P0 dataset、合法 lane/profile、五脚本和 run/report roots。
- `ENV-CI-ISO` 承担确定性 P0 contract/service/static；需要 durable/restart/CAS/fence/external phase 的 case 必须在
  独立 `ENV-CI-INT` 运行；`ENV-STG-RT` 未建立时保持 not_evaluated。
- 退出测试前必须有可运行 P0 的真实 run-scoped 结果、required suite/check、raw artifact/report pairing、无 VETO/S，
  以及明确的 A/B/R residual 记录。
- `blocked`、`not_run` 和 `conditional` 不得折叠为 pass；正式 EV、验收 verdict 和 signoff 不由本章生成。

## 12. Step 门禁

| 条件 | 状态 |
|---|---|
| SOP 五个问题已回答 | pass |
| entry/exit checklist 可判定 | pass |
| blocked/not_run/conditional 与 pass 语义分离 | pass |
| lane、script、artifact、report、defect、VETO 互相可追溯 | pass |
| 新上游 blocker | none |
| gate_status | `pass_current_step_12_with_inherited_affected_open` |
| next_allowed_action | `rebuild_current_05_step_13` |
| commit | 不需要；用户未要求提交 |
