# Step 14. 定义风险与待确认事项

> 对应 SOP：`standards/document/配置设计讨论流程_SOP.md` Step 14。
> 回填章节：未来正式 `projects/L5-sync/04-配置设计.md` §14「风险与待确认事项」。
> 当前模式：`full-restart + single-agent-serial`；本文件是中间产物，不是正式 04。
> 事实边界：本文汇总配置设计风险、待确认事项和 03 回写判定，不创建实现、测试、部署、artifact、report、evidence、review verdict、signoff 或 readiness。

## 1. Step 状态与开工确认

| 项目 | 状态 |
|---|---|
| 当前 Step | `14 / risks_open_questions` |
| Step 状态 | `completed / stop_review` |
| `gate_status` | `pass_with_upstream_blockers` |
| 前序门禁 | Step 1～13 均 `completed / stop_review`；Step 13 已停审 |
| 输出文件 | `design-calibration/04_config_step_14_risks_open_questions.md` |
| 回填位置 | 未来正式 `04-配置设计.md` §14 |
| 正式 04 写入 | `false`；只能在 Step 15 装配 |
| Step 15 文件 | 未创建；不得在本 Step 预创建 |
| 实现 / 测试 / commit | `false / false / false` |
| 当前持续 blocker | `SYNC-UP-001~010`、`SYNC-LOCAL-001~005` 原样继承 |
| 下一允许动作 | 更新 flow/ledger 后进入 Step 15 正式装配 |

### 1.1 Step 内计划与执行纪律

| 计划项 | 状态 | 产物 / 判定 |
|---|---|---|
| 读取 Step 1～13 和正式 03 | done | 已复核所有配置域、影响判定、下游承接和 blocker |
| 读取 Step 14 SOP/规范 | done | 已复核风险表、待确认表、03 回写清单和 Step 15 门禁 |
| SOP 问题回答 | done | §3 覆盖落地、下游阻塞、确认方、未确认前姿态和 03 影响 |
| 当前材料诊断 | done | §4 区分当前 P0 缺口、上游 blocker、未来设计变更和旧文档污染 |
| 设计取舍 | done | §5 采用“当前 P0 可定稿、future 条件显式阻塞”的分层策略 |
| 结构化中间产物 | done | §6 风险表、待确认表、Step 1～13 汇总、回写清单和跨风险审计 |
| 回填草稿 | done | §8 可直接映射到正式 §14 |
| 自检与 Step 15 门禁 | done | §9～§11 完成；当前无 `待回写` 或 `阻塞待确认` 的 P0 03 项 |

本 Step 的“通过”只表示当前 P0 配置契约不存在未处理的 03 回写缺口；它不关闭任何上游 blocker，也不表示下游文档、实现、测试或运维已经完成。

## 2. 本步目标、输入与非范围

### 2.1 目标

本 Step 必须：

1. 汇总 Step 1～13 尚未关闭、但会影响测试、验收、实施或运维的风险；
2. 明确每个待确认事项的影响、确认方和未确认前处理方式；
3. 覆盖所有前序“未来会影响 03”的条件触发，但不把未触发条件伪装成当前待回写；
4. 明确 `SYNC-UP-*` / `SYNC-LOCAL-*` 的阻塞范围；
5. 判断是否允许 Step 15 装配正式 04。

### 2.2 权威输入

| 输入 | 本 Step 用途 |
|---|---|
| `04_config_step_01_upstream_boundary.md` | 上游缺口、输入等级和 blocker 不改变配置控制面结论 |
| `04_config_step_02_scope.md` | P0/P1/P2、非范围和能力上限 |
| `04_config_step_03_control_plane.md` | loader/composition、配置域和 03 绑定 |
| `04_config_step_04_categories_boundaries.md` | 禁止配置化项、冷生效、无 hot 边界 |
| `04_config_step_05_sources_priority_conflicts.md` | source precedence、冲突、config center/admin unsupported |
| `04_config_step_06_environment_profiles_matrix.md` | 四个 P0 语义 profile 与 future profile 姿态 |
| `04_config_step_07_config_items.md` | 42 leaf、required/nullable、失败和域停审 |
| `04_config_step_08_sensitive_secrets.md` | opaque ref、adapter-private resolution、redaction/no-output |
| `04_config_step_09_loading_validation_activation.md` | strict loading、cross-field、builder、snapshot、hot reject |
| `04_config_step_10_change_audit_rollback.md` | risk class、safe audit、cold rollback、外部 effect 不回滚 |
| `04_config_step_11_failure_degradation.md` | fail-fast/fail-closed、unknown、drift/expiry、safe alert |
| `04_config_step_12_downstream_handoff.md` | 05/06/07/09 承接和 evidence ceiling |
| `04_config_step_13_migration_deprecation_evolution.md` | 当前无迁移项、废弃/演进触发、metadata 双轨 |
| `projects/L5-sync/03-详细设计.md` §10～§17 | truth ownership、runtime binding、错误恢复、观测、测试和风险基线 |
| Step 14 SOP、配置规范、中间产物规范 | 风险/待确认/回写表结构与正式装配门禁 |

旧 README、旧 05/06、draft 和其他项目配置继续是 `historical_material` 或框架参考，不覆盖当前 03/04 结论。

### 2.3 明确不定义

- 具体 SDK API、RPC/DTO、Project/Artifact/Workspace/Review Gate/Archive/Git remote owner contract。
- `.qs-sync` physical schema、migration、retention、crash semantics、Git LFS/浅克隆/GUI 支持结论。
- secret provider、config center、admin override、hot reload、online LKG 或 production-like 的正式 P0 schema。
- 风险的实际关闭证明、测试报告、验收 verdict、实施 commit、部署 runbook 或 readiness。

## 3. SOP 问题回答

| 问题 | L5-sync 回答 |
|---|---|
| 哪些配置问题仍可能影响落地？ | 上游 SDK/source/access/review/probe 合同、`.qs-sync` physical metadata、增量 comparator/cursor、Git/filesystem 工具矩阵、dirty-worktree 保护细节、secret provider、精确 parser/validator/toolchain，以及未来 profile/运维产品仍影响正向落地。但它们不改变当前 P0 的 42-leaf schema、source precedence、ref-only、cold activation、failure truthfulness 和 ownership 红线。 |
| 哪些事项会阻塞测试、验收、实施或运维？ | `05/06/07/09` 的新版文档重写、真实 adapter/runner/provider、physical metadata、生产级 profile 和工具支持会阻塞相应下游实例化；不会阻塞当前 04 定稿。若实施要求新增 runtime type、Port、DTO、error、state、flow、durable carrier 或改变 03 lifecycle，则立即阻塞该变更并先回写 03。 |
| 每个待确认事项需要谁确认？ | SDK/source/access/review/probe 由相应上游 owner；metadata 由 L5-sync 架构/实现与上游存储 owner；Git/filesystem 与 LFS/浅克隆/GUI 由工具链/安全/运维 owner；secret/provider 与 redaction 由安全/运维 owner；下游 evidence/gate 由测试/验收 owner；phase/commit/runbook 由实施/运维 owner。本文不伪造具体人名或审批系统。 |
| 未确认前如何处理？ | 保持 `blocked/unsupported/unknown/waiting`，或按 P0 fail-fast/fail-closed；不 fallback fake/cache/default/旧 snapshot，不把 ref、ACK、Git commit、日志或 job report 升格为 bound/accepted/readiness。未确认项只作为风险、future queue 或下游输入，不进入新的 P0 leaf。 |
| 哪些配置结论改变了 03 代码契约？ | 当前 P0 没有。前序 Step 中所有“未来可能影响 03”的内容均是条件触发器：只有真正启用 remote config、admin override、hot/LKG、具体 provider、new retry/Consumer/Job contract、physical carrier 或产品级 adapter schema 时，才转为 03 回写项。 |
| 影响是否已经回写 03？ | 当前 P0 无需回写；所有现有 03 影响判定均为“当前无回写”。未来触发器尚未进入实现范围，不得提前修改正式 03；一旦进入范围，必须先回写 03 并重开受影响的 04 Step。 |

## 4. 当前材料与问题诊断

| 位置 / 材料 | 当前问题 | 本 Step 收口 |
|---|---|---|
| Step 1～13 影响表 | future/conditional 项较多，若不分层容易阻塞或污染 P0 | 统一区分“当前 P0 无回写”和“未来触发时必须回写” |
| `SYNC-UP-001~005/008` | SDK、source、permission、handoff、Decision、probe、comparator 未闭合 | 只限制 positive capability；配置仍可合法解析并保留 blocked/unknown |
| `SYNC-UP-006` | `.qs-sync` physical metadata、migration、retention、crash 未闭合 | 只保留 logical refs/relations；不锁物理 migration |
| `SYNC-UP-007/009/010` | Git remote/local tool/support matrix、LFS/浅克隆/GUI、dirty safety 未闭合 | 只允许 typed adapter/root-policy refs；apply unknown/dirty 继续 fail-closed |
| `SYNC-LOCAL-001~005` | Node/package/parser/validator/test runner/Git library/SDK dependency syntax 未确认 | 不把本地工具选择写进 raw runtime config；交给后续实施前确认 |
| 旧 05/06、07/09 | 新版下游尚未重写或创建 | 04 只提供承接输入；不把静态表当测试/验收/实施/运维事实 |
| Step 13 future queue | config center、secret provider、hot/LKG、production-like、迁移自动化仍未定 | 保留 future/design-change-required；不进入 P0 schema |

诊断结论：当前 04 需要处理的是“设计风险与边界传播”，不是补写上游真相或假定正向实现。Step 15 可以装配已确认的 P0 配置结论，同时保留 future 风险和上游 blocker。

## 5. 设计取舍

| 议题 | 采用方案 | 不采用方案 | 理由 |
|---|---|---|---|
| future 03 影响项是否一律阻塞 Step 15 | 仅当前 P0 已触发的 03 影响阻塞；未触发 future 条件进入风险/演进说明 | 把所有潜在未来能力当作当前待回写 | 避免 P0 定稿被未授权范围拖住，同时不丢失回写触发 |
| 上游 blocker 是否转成配置错误 | 保持 `blocked/unsupported/unknown` 能力姿态和明确下游影响 | 通过 default/fake/cache/ACK/log 关闭 blocker | 保持真相源和证据边界真实 |
| 产品未锁定是否写入 P0 | 使用 product-neutral opaque refs、nullable slot 和 future 状态 | 写具体 provider/endpoint/driver/topic/GUI 选择 | 上游合同和本地工具链未闭合 |
| 旧 05/06 是否覆盖 04 | 只作 historical/direction input；新版 04 是配置唯一真相 | 继承旧 SyncTask、旧状态或旧环境默认 | full-restart 纪律 |
| 下游文档未重写是否阻塞 04 | 记录承接风险，不把下游缺口写成 04 契约缺口 | 在 04 代写 05/06/07/09 | 保持文档职责和 evidence maturity 分层 |

## 6. 结构化中间产物

### 6.1 风险表

| 风险 ID | 风险 | 影响 | 缓解方式 | 负责人 / 待确认方 | 当前状态 |
|---|---|---|---|---|---|
| `CFG-RISK-001` | L0-sdk 的 project/version/source/artifact/workspace/review-handoff exact surface 未闭合 | `sdk.*` binding 无法成为正向 `bound`；clone/pull/push-review 只能 blocked/unknown | 保留 typed adapter refs、显式选择、prepare→call→probe/finalize；不锁 API/DTO | L0-sdk 与相关上游 owner | `SYNC-UP-001/002/004/005/008` pending |
| `CFG-RISK-002` | ProjectMember/archived/dissolved/retired/access matrix 未闭合 | Sync 不能本地授权或对归档项目继续写操作 | owner/access 只作外部读取；unknown/failure fail-closed | L1-identity/L1-work owner | `SYNC-UP-003` pending |
| `CFG-RISK-003` | `.qs-sync` physical schema、migration、retention、crash semantics 未闭合 | metadata refs、cursor/mapping/provenance recovery 不能实例化 | 只固定 logical store/UoW/lock/snapshot seam；不写 physical schema | L5-sync 架构/实现、metadata owner | `SYNC-UP-006` blocked |
| `CFG-RISK-004` | cursor/comparator/gap/replay/跨版本兼容未闭合 | pull 增量和断点恢复不能安全推进 cursor | 无 comparator 时 blocked/needs-action；partial/unknown 不推进 cursor | Artifact/Workspace/source owner | `SYNC-UP-002/008` pending |
| `CFG-RISK-005` | Git remote 与本地 materialization 关系及工具支持矩阵未闭合 | clone/pull/status/apply 的 tool posture、LFS/浅克隆/GUI 不能承诺 | typed Git/fs refs；dirty/path/symlink/lock unknown fail-closed；不自动 merge/rebase/push/stash | Git/filesystem/toolchain owner | `SYNC-UP-007/009/010` pending |
| `CFG-RISK-006` | 用户未提交修改、root/path/non-overwrite 和人工冲突决策细节未闭合 | 可能覆盖 dirty worktree 或误把 unknown 当 clean | preflight observation、non-overwrite guard、checkpoint/manual；不覆盖用户修改 | L5-sync/安全/运维 owner | `SYNC-UP-010` pending |
| `CFG-RISK-007` | Node/package/parser/validator/test runner/Git library/SDK dependency 选择未确认 | Step 5+ 的可落码实现和后续测试 runner 未锁定 | 设计只锁 seam/语义；07/实现前再确认，不把选择写入 P0 raw schema | L5-sync 实施负责人 | `SYNC-LOCAL-001~005` pending |
| `CFG-RISK-008` | 真实 secret provider、rotation、provider-side audit 未闭合 | `sdk.credentialProviderRef` 只能是 opaque ref；无法声明健康或 rotation success | adapter-private future resolution；raw material 永禁；new cold composition | 安全/运维/provider owner | future / blocked |
| `CFG-RISK-009` | remote config center/admin override/hot reload/online LKG 未闭合 | source priority、lifecycle、rollback、audit、in-flight snapshot 会变化 | P0 直接 unsupported/reject；若采纳先回写 03/04 | 架构/运行时/安全 owner | future design-change-required |
| `CFG-RISK-010` | production-like/staging-like 和真实运行阈值未实例化 | 不能把 profile、endpoint、secret、alert/SLO 写成当前事实 | 四个 P0 语义 profile；future profile 只记录方向 | 架构/运维/测试 owner | future waiting/blocked |
| `CFG-RISK-011` | 旧 05/06 和新版 07/09 尚未重写 | 测试、验收、实施、运维不能直接执行当前边界 | 04 提供唯一承接表；后续按各自 SOP 重写 | 测试/验收/实施/运维 owner | downstream pending |
| `CFG-RISK-012` | redacted canonical digest、迁移自动化和告警阈值尚未产品化 | 漂移、迁移和运维 evidence 的实现细节未锁定 | 04 只定义语义和安全边界；具体算法/阈值留后续流程 | 实施/测试/release/运维 owner | waiting |

风险表中的状态只表示设计 blocker 或 future waiting，不表示真实运行故障、测试失败或 readiness。

### 6.2 待确认事项表

| 事项 ID | 事项 | 当前影响 | 需要谁确认 | 未确认前处理方式 | 阻塞范围 |
|---|---|---|---|---|---|
| `CFG-Q-001` | L0-sdk exact project/version/source/artifact/workspace/handoff/Decision/probe surface 与 error/version compatibility | 正向 SDK route、review handoff 和 probe 无法实例化 | L0-sdk、Governance、Artifact/Workspace owner | 只保留 typed refs、blocked/unknown 和 ACK≠accepted | P1/P2 adapter integration；不阻塞 P0 schema |
| `CFG-Q-002` | Artifact/Workspace material source、version waterline、comparator、gap/replay contract | pull/增量/断点恢复无法安全推进 | Artifact/Workspace owner | 新 pull 需要显式 source/comparator；未闭合则 blocked/needs-action | pull positive path；不阻塞 config 定稿 |
| `CFG-Q-003` | ProjectMember/access 与 archived/dissolved/retired action matrix | permission unknown 时不能继续写操作 | Identity/Work owner | fail-closed；不本地授权或猜 owner | access-gated commands |
| `CFG-Q-004` | `.qs-sync` physical schema、migration、retention、crash/recovery | metadata binding、rollback、replay 的实现细节未定 | L5-sync metadata owner、实施/运维 | logical seam only；不锁文件/表/driver/retention | metadata implementation |
| `CFG-Q-005` | Git/fs support matrix：LFS、浅克隆、GUI/Tauri、executable/library、root/path/dirty semantics | local tool capability 和性能/安全承诺未定 | Git/toolchain、安全、运维 owner | 不提供 alias/flag/default；unknown fail-closed | local-tool positive implementation |
| `CFG-Q-006` | Node/package/parser/validator/test runner/SDK dependency 选择 | 可落码命令与测试 runner 未定 | L5-sync 实施/测试 owner | 仅保留 semantic seam；07/实现前确认 | implementation/test execution |
| `CFG-Q-007` | 真实 secret provider/KMS/Vault、rotation 和 provider audit | credential resolution、rotation、outage 处理未定 | 安全/运维/provider owner | opaque ref；adapter-private；raw secret reject | future provider integration |
| `CFG-Q-008` | remote config center/admin override/hot reload/online LKG 是否进入路线 | 将改变 source/lifecycle/audit/rollback | 架构/运行时/安全 owner | P0 unsupported/reject；若采纳先回写 03 | future runtime design |
| `CFG-Q-009` | staging-like/production-like 是否进入近期路线、真实 profile 和 release gates | 不能写真实 endpoint/threshold/readiness | 产品/架构/运维/测试 owner | 只保留 future direction；禁止 fake promotion | future deployment/ops |
| `CFG-Q-010` | deprecated warning 是否进入 public protocol，以及 migration automation/report carrier | 可能改变 DTO/error/evidence boundary | 架构/实施/测试/release owner | 仅 safe issue/log/planned input；public surface 变化先回 03 | future migration tooling |
| `CFG-Q-011` | exact redacted canonical digest algorithm、canonicalization 和保留边界 | drift/rollback/migration correlation 只能定语义 | 实施/测试/安全 owner | 不输出 raw/full ref；未闭合保持 waiting | implementation/evidence |
| `CFG-Q-012` | 05/06/07/09 的重写排期和承接载体 | 下游尚不能执行新版配置门禁 | 各下游负责人 | 04 只提供 planned inputs，不伪造下游结果 | downstream docs |

这些事项不得在正式 04 中写成已确认 leaf、产品、命令、阈值、运行实例或证据；正式 04 只能写其影响、未确认前姿态和 future trigger。

### 6.3 Step 1～13 影响 `03-详细设计.md` 汇总

| 来源 Step | 当前配置结论 | 当前是否影响 03 | 当前处理状态 |
|---:|---|---|---|
| 1 | 配置输入只承接已校准的 03/上游边界；上游 blocker 不等于新增 code contract | 否（当前） | 无回写；保留 blocker |
| 2 | P0 只覆盖既有 42 leaf、cold composition、显式 profile/source；P1/P2 另行触发 | 否（当前） | 无回写 |
| 3 | 只有 `src/config/*` 读 raw source；composition/application/domain 边界不变 | 否（当前） | 无回写 |
| 4 | 分类、冻结和禁止配置化项承接既有 invariant；P0 无 hot | 否（当前） | 无回写 |
| 5 | default < selected strict JSON < allowlisted env；config center/admin unsupported | 否（当前） | 无回写 |
| 6 | 四个 P0 语义 profile；staging/production 仅 future direction | 否（当前） | 无回写 |
| 7 | 42 leaf 一对一映射到既有 config families；无第 43 leaf | 否（当前） | 无回写 |
| 8 | sensitive ref-only、adapter-private resolution、no-output、cold rotation | 否（当前） | 无回写 |
| 9 | strict parse/validation/composition/snapshot；reload/hot whole-request reject | 否（当前） | 无回写 |
| 10 | safe audit、previous validated candidate + cold restart；不回滚外部 effect | 否（当前） | 无回写 |
| 11 | fail-fast/fail-closed/degraded/delayed/unknown 分层；Query no-write | 否（当前） | 无回写 |
| 12 | 下游只能承接 04 输入，不能重定义配置契约或证据成熟度 | 否（当前） | 无回写 |
| 13 | 当前无迁移项；future config center/provider/hot/LKG/production-like 等需先回写 | 否（当前） | 未来触发器；未进入当前实现范围 |

当前 `待回写=0`、`阻塞待确认=0`。上表的“否（当前）”不否认未来变更可能影响 03；它表示当前正式 P0 04 没有未处理的代码契约变更。

### 6.4 未来 03 回写触发器（不构成当前待回写）

| 触发器 | 一旦发生的代码契约影响 | 必须先回写的位置 | 未确认前姿态 |
|---|---|---|---|
| 新 raw leaf/section/profile 或 changed required/nullability | `ValidatedSyncRuntimeConfig`、validator、builder、schema | 03 §13/受影响对象与 flow；再重开 04 Step 7～11 | design-change-required |
| remote config center/admin override | source priority、actor/auth、lifecycle、audit、rollback | 03 §10～§15 与上游 owner contract | P0 reject |
| secret provider API/health/rotation | adapter constructor、resolver lifecycle、error/audit | 03 §13～§15、Step 12/14/15 | opaque ref / blocked |
| hot reload/online LKG/dynamic adapter replacement | snapshot lifecycle、in-flight pin、partial failure、rollback | 03 §10～§15 与对应状态/flow | P0 unsupported |
| new retry/backoff/Consumer/Job contract | idempotency、effect unknown、state/operation flow | 03 §7～§12、Step 13/16 | 不新增配置 key |
| physical `.qs-sync` carrier/migration | durable carrier、UoW、retention、crash recovery | 03 §10/§12～§15、metadata owner contract | `SYNC-UP-006` blocked |
| product-specific endpoint/DSN/tool/LFS/shallow/GUI positive support | adapter constructor、capability matrix、security/ops | 03 §4/§5/§13～§17、上游工具矩阵 | historical/pending |

### 6.5 未关闭事项处理规则

| 类型 | 可否进入正式 P0 04 | 未确认前处理 |
|---|---|---|
| 当前 P0 已决策的 42 leaf/source/profile/activation/failure 红线 | 可以 | 作为正式配置契约写入 |
| 上游正向 adapter/metadata/Git/source 合同未闭合 | 只能写 ref/boundary/blocker | 保持 `blocked/unknown`；不写 positive capability |
| Future/P1/P2 能力 | 只能写 future/evolution/risk | 不新增 P0 leaf，不写实例/产品 |
| 会改变 03 代码契约的候选 | 不可写成当前支持 | 标记 design-change-required，先回写 03 |
| 下游 05/06/07/09 尚未重写 | 可写承接输入 | 不把静态输入当执行结果或 signoff |
| 安全边界未确认或输出面不安全 | 不可放宽 | fail-fast/fail-closed/reject |

### 6.6 风险停审记录

| 审查项 | 结论 | 依据 / 修正 |
|---|---|---|
| Step 1～13 风险是否全部汇总 | 通过 | §6.1、§6.2、§6.3 |
| 每个上游 blocker 的影响范围是否明确 | 通过 | `SYNC-UP-001~010`、`SYNC-LOCAL-001~005` 与 §6.1/§6.2 |
| 当前 P0 是否存在待回写 03 项 | 无 | §6.3；当前所有结论均承接既有 03 shape |
| 当前 P0 是否存在阻塞待确认项 | 无 | future/conditional 只作为触发器，不进入当前 schema |
| future 条件是否被误写为 P0 契约 | 否 | §6.4/§6.5；P0 reject/blocked/waiting |
| 是否保留旧文档 historical 边界 | 是 | §4；旧 README/05/06/draft 不覆盖真相 |
| 是否把下游静态输入当执行事实 | 否 | §6.2、Step 12 边界 |
| 是否满足 Step 15 装配条件 | 是（带上游 blocker） | 无当前待回写/阻塞待确认；允许装配正式 04 |

### 6.7 跨风险 / 回写审计表

| 审计项 | 结论 | 修正 / 依据 |
|---|---|---|
| 配置来源/优先级与风险表一致 | 通过 | Step 5/9 与 §6.3 一致；非法高优先级不 fallback |
| 42 leaf、38 required、4 nullable 在风险汇总中无漂移 | 通过 | Step 7/9/11/13 计数一致 |
| sensitive/ref/no-output 与风险表一致 | 通过 | Step 8/10/13；raw/full ref 永不进入输出面 |
| cold activation、snapshot pinning、hot reject 与风险表一致 | 通过 | Step 9/10/11/13 |
| truth ownership、dirty non-overwrite、ACK≠accepted 与风险表一致 | 通过 | 03、Step 4/8/11/12/13 |
| `.qs-sync` physical migration 是否被误关闭 | 否 | `SYNC-UP-006` 保持 blocked |
| Git LFS/浅克隆/GUI 是否被误写为支持 | 否 | `SYNC-UP-009` 与 local blockers 保持 pending |
| 是否存在当前未处理的 03 代码契约变更 | 否 | §6.3；future 只在触发时回写 |
| 是否有真实测试/evidence/verdict/readiness | 否 | 全文仅 planned/blocked/waiting |

## 7. 对详细设计的影响判定

| 配置结论 | 是否影响 03 | 影响类型 | 03 回写位置 | 处理状态 |
|---|---|---|---|---|
| 当前 P0 42-leaf schema、source、profile、activation、failure 和 redaction 承接既有 03 | 否 | 当前契约收口 | 不适用 | 无回写 |
| 上游 blocker 使 capability 保持 blocked/unknown，不改变 runtime shape | 否 | 外部依赖姿态 | 不适用 | 无回写，blocker 保留 |
| 下游尚未重写，只影响承接排期，不改变 03 | 否 | 文档交接风险 | 不适用 | 无回写 |
| future remote/provider/hot/LKG/retry/physical carrier/tool support 若进入实现 | 是（未来触发） | loader、builder、adapter、error、state、flow、durable carrier 或 audit 变化 | 03 §4～§17 与受影响 calibration Step | 当前未触发；不得进入 P0 04 |

当前正式装配门禁：`待回写=0`、`阻塞待确认=0`；允许进入 Step 15，但必须保留上游 blocker、future trigger 和下游 planned boundary。

## 8. 回填草稿（未来正式 `04-配置设计.md` §14）

> 校准来源：
> - `design-calibration/04_config_step_14_risks_open_questions.md`
>
> 延伸阅读：建议继续阅读本文件的“风险表”“待确认事项表”“Step 1～13 影响 `03-详细设计.md` 汇总”“未来 03 回写触发器”“未关闭事项处理规则”“风险停审记录”和“跨风险 / 回写审计表”。

正式 §14 应按以下顺序回填：

1. 当前 P0 风险表，逐项标出 blocker、影响范围、缓解方式和确认方。
2. 待确认事项表，保留未确认前的 `blocked/unsupported/unknown/waiting` 姿态。
3. Step 1～13 的 03 影响汇总；明确当前 `待回写=0`、`阻塞待确认=0`。
4. Future 03 回写触发器；不得把未来能力写成当前支持。
5. 未关闭事项处理规则、风险停审和跨风险审计。

正式正文不得把待确认事项写成配置 leaf、产品、默认值、命令、阈值、运行实例、测试结果或 readiness。

## 9. 待确认事项（Step 15 前的处理边界）

| 待确认事项 | Step 15 处理 |
|---|---|
| 上游正向合同、physical metadata、工具链、provider、future profile | 作为风险/未来触发写入正式 §14，不阻止当前 P0 04 装配 |
| 当前 P0 是否存在 03 待回写 | 不存在；Step 15 必须保留“当前无回写”判定 |
| 下游文档是否已重写 | 未重写；正式 §12 只写 planned handoff，不伪造下游完成 |
| 正式 04 版本号/日期 | Step 15 元信息中填写当前文档状态，不伪造发布版本/发布时间 |

## 10. Step 自检与进入下一步门禁

| 检查项 | 结果 | 依据 |
|---|---|---|
| 已回答 SOP Step 14 六个问题 | pass | §3 |
| Step 1～13 风险、待确认和 03 影响已汇总 | pass | §6.1～§6.4 |
| 每个 blocker 的阻塞范围、确认方和未确认前姿态明确 | pass | §6.1、§6.2、§6.5 |
| 当前 P0 不存在待回写或阻塞待确认的 03 项 | pass | §6.3、§7 |
| future 能力未被写成 P0 正式契约 | pass | §6.4、§6.5 |
| 下游缺口未被伪造成测试/验收/实施/运维结果 | pass | §6.2、§6.7 |
| 42 leaf/source/profile/sensitive/activation/failure 红线无漂移 | pass | §6.7 |
| formal 04 仍未创建；未实现/测试/提交 | pass | 文件与台账纪律 |
| 可进入 Step 15 正式装配 | pass_with_upstream_blockers | 当前无 03 回写缺口；保留 blocker/future/planned 状态 |

## 11. 进入下一步条件与停审记录

| 条件 | 状态 | 说明 |
|---|---|---|
| 所有未关闭事项都有记录和处理方式 | 通过 | §6.1、§6.2、§6.5 |
| Step 1～13 的 03 影响项已完整覆盖 | 通过 | §6.3、§6.4 |
| 当前无 `待回写` 或 `阻塞待确认` 的 03 项 | 通过 | 当前 P0 不改变 03 契约 |
| future blocker 的阻塞范围已明确 | 通过 | 不阻塞 P0 04；阻塞相应 future/下游实例化 |
| 待确认项未写成正式配置契约 | 通过 | 只写风险、future 或 planned handoff |
| 正式文档可进入装配 | 通过（带上游 blocker） | 下一动作是更新 flow/ledger 后进入 Step 15 |

### Step 14 结论

`Step status = completed / stop_review`；`gate_status = pass_with_upstream_blockers`。

当前 P0 没有需要回写 03 的配置结论，也没有阻止 Step 15 的 `待回写/阻塞待确认` 项。上游和本地 blocker 仍必须在正式 04 中保留；下一动作是更新 04 flow/项目台账，然后进入 Step 15 装配正式 `04-配置设计.md`。
