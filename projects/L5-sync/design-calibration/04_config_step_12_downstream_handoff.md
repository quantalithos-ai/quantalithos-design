# Step 12. 定义测试、验收、实施与运维承接

> 对应 SOP：`standards/document/配置设计讨论流程_SOP.md` Step 12。
> 回填章节：未来正式 `projects/L5-sync/04-配置设计.md` §12「测试、验收、实施与运维承接」。
> 当前模式：`full-restart + single-agent-serial`；本文件是中间产物，不是正式 04，也不是 05/06/07/09 的正式文档。
> 事实边界：本文只定义下游必须承接的配置输入、门禁、任务族和运维边界；不创建实现、测试、运行、artifact、report、evidence、review verdict、signoff 或 readiness 事实。

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | `12 / downstream_handoff` |
| Step 状态 | `completed / stop_review` |
| `gate_status` | `pass_with_upstream_blockers` |
| 前序门禁 | Step 1～11 均 `completed / stop_review`；其 gate 均为 `pass_with_upstream_blockers` |
| 对应 SOP | `standards/document/配置设计讨论流程_SOP.md` §「Step 12. 定义测试、验收、实施与运维承接」 |
| 回填章节 | 未来正式 `04-配置设计.md` §12 |
| 正式 04 写入 | `false`；只能在 Step 15 装配 |
| Step 13～15 文件 | 未创建；不得在本 Step 预创建 |
| 实现 / 测试 / commit | `false / false / false` |
| 当前停审动作 | 本 Step 完成后停止；下一允许动作是显式进入 Step 13 |

### 1.1 Step 内计划与执行纪律确认

| 计划项 | 状态 | 产物 / 判定 |
|---|---|---|
| 读取输入和前序结论 | done | Step 6～11、正式 03 配置/错误/观测/测试承接章节、相关规范均已读取 |
| SOP 问题回答 | done | §3 逐项回答五个问题 |
| 当前材料 / 旧文档诊断 | done | §4 指向 L5-sync 旧 05/06、正式 04 缺失和 07/09 缺失 |
| 设计取舍 | done | §6 至少保留采用方案与未采用方案 |
| 结构化中间产物 | done | §7～§8 的承接总表、测试/验收/实施/运维矩阵、边界审计 |
| 复杂度判断 / 拆分 | done | §7.0 明确按下游文档和配置域拆分，不把完整用例或部署命令塞入本 Step |
| 回填草稿 | done | §9 可直接映射到正式 §12 |
| 自检与下一步门禁 | done | §11 完成；无当前 03 待回写项 |

本 Step 的“通过”只表示配置契约可以被下游引用，不表示下游文档已经重写，也不表示任何 planned task、测试切口或证据载体已经实现或运行。

## 2. 本步输入

### 2.1 权威输入与用途

| 输入 | 权威级别 | 本 Step 采用内容 |
|---|---|---|
| `04_config_step_06_environment_profiles_matrix.md` | 当前 04 校准输入 | `local-dev`、`ci-test`、`integration-like`、`operations-replay` 四个 P0 语义 profile；`staging-like` / `production-like` 仅未来方向；profile 不提升 capability 或 readiness |
| `04_config_step_07_config_items.md` | 当前 04 校准输入 | 九个 raw section、42 个既有 code-level leaf、38 个 required 与 4 个 `operations` nullable leaf、来源/作用域/生效/失败策略 |
| `04_config_step_08_sensitive_secrets.md` | 当前 04 校准输入 | opaque ref、adapter-private 解析、最小暴露、rotation 只通过新 cold composition、全输出面禁止 raw material |
| `04_config_step_09_loading_validation_activation.md` | 当前 04 校准输入 | strict JSON、source precedence、whole-candidate reject、builder 顺序、immutable snapshot、P0 reload/hot reject |
| `04_config_step_10_change_audit_rollback.md` | 当前 04 校准输入 | high/critical 变更评审、safe audit、显式 previous validated candidate + cold restart、run/entry/test 局部回退 |
| `04_config_step_11_failure_degradation.md` | 当前 04 校准输入 | fail-fast、fail-closed、degraded、delayed、`failed_known`、`outcome_unknown`、drift/expiry、Query/Consumer/Job 和 effect recovery 边界 |
| `projects/L5-sync/03-详细设计.md` §7～§16 | 当前正式直接输入 | `clone` / `pull` / `status` / `push-review` 主路径、既有 Command/Query/Consumer/Job、runtime composition、17 个状态主语、错误/恢复、观测、最小 test cuts |
| `projects/L5-sync/design-calibration/03_ddd_step_14_config_dependencies.md` ～ `03_ddd_step_16_test_cuts.md` | 详细设计校准输入 | 42 leaf 的 code shape、adapter/capability seam、测试切口和 evidence ceiling；不新增 runtime type、Port、DTO 或 error |
| `standards/document/测试方案讨论流程_SOP.md` / `测试方案书写规范.md` | 下游流程规范 | 05 应展开场景、数据、环境、自动化、进入/退出准则和证据真实性；本 Step 只交付输入，不代写用例 |
| `standards/document/验收标准讨论流程_SOP.md` / `验收标准书写规范.md` | 下游流程规范 | 06 应定义通过/失败、VETO、缺陷和放行裁决；本 Step 只交付配置门禁，不代写最终 verdict |
| `standards/document/实施计划讨论流程_SOP.md` / `实施计划书写规范.md` | 下游流程规范 | 07 应按阶段/commit boundary 拆任务、嵌入测试验收和配置准备；本 Step 只交付 planned task family，不建 implementation ledger/skeleton |
| `standards/document/部署与运维手册书写规范.md` | 运维承接规范 | 09 应写部署、运行、回滚、告警、权限和 runbook；本 Step 不写部署命令或真实环境值 |
| `projects/L1-governance/04-配置设计.md` 及其 Step 12 中间产物 | 仅框架参考 | 参考下游承接表、测试/验收/实施/运维分栏和跨下游审计粒度；不继承 Governance 的 topic、GRC、outbox 或业务 truth |
| L5-sync 旧 `05-测试方案.md`、`06-验收标准.md` | `historical_material / direction_only` | 只用来识别旧配置矩阵和旧 truth 污染；不继承 `SyncTask`、旧状态、旧数字、旧实现语言或旧证据结论 |

### 2.2 前序结论冻结清单

下游只能读取并展开以下已冻结的配置边界：

1. 普通 source precedence 为 `approved code-declared default < selected strict JSON < allowlisted environment`；高优先级非法值不得 fallback。`identity.configRef` 仍需 selected strict JSON 和 canonical identity 校验。
2. 运行时只接受 strict JSON；JSONC 注释、尾逗号、duplicate key、alias、unknown key、forbidden field 或 hard-boundary intent 导致 whole-candidate reject。
3. 九个 raw section 共 42 个 leaf；38 个 required，4 个 `operations` leaf 允许显式 `null`。任何下游表格不得新增第 43 个 leaf。
4. 只有 `src/config/*`（计划单元，尚未创建）读取 raw source；`ValidatedSyncRuntimeConfig`、composition、capability snapshot 和既有 ports 才能向 application 暴露 typed binding；Domain 不读 raw config。
5. `bound | blocked | unsupported | unknown` 只表示 capability posture；不表示健康、授权、source freshness、clean worktree、Review accepted、evidence 或 readiness。
6. P0 生效面只有 startup/cold、job-run-start、entry-local、test harness；reload/hot、config center、admin override、online LKG、自动 retry/rollback 均不在当前契约。
7. raw secret、credential、endpoint/body、provider response、文件正文、Git stdout/stderr、完整 sensitive ref、evidence/report/verdict/signoff/readiness 不得进入 config、snapshot、`.qs-sync`、日志、诊断、审计或 report carrier。
8. Sync 不拥有 Project、Artifact、Baseline、Review Gate/Decision、Workspace projection、Archive 或 Git remote truth；不自动 merge/rebase/push/stash，不覆盖 dirty worktree，不把 local Git commit 当 Artifact/Baseline，不把上传 ACK 当 accepted。
9. 配置 rollback 只能恢复到显式已验证候选并重新 cold compose/restart；不能撤销已经发生的 SDK、Git、filesystem 或 Review handoff effect；unknown effect 继续走 checkpoint/probe/manual。

## 3. SOP 问题回答

### 3.1 哪些配置场景进入测试方案？

回答：05 必须把配置作为跨层测试输入，而不是只写 parser 单测。至少承接以下场景族，并将每个场景映射到正式 03 的 Command/Query/Consumer/Job、状态、错误或安全边界：

- profile/source 组合：四个 P0 profile 的来源组合、profile selector 与 candidate 冲突、future profile/test double 隔离。
- source/parse/structure：default → strict JSON → allowlisted environment 的覆盖顺序；高优先级非法不 fallback；JSONC、尾逗号、duplicate、alias、unknown、forbidden whole-candidate reject。
- 42 leaf 校验：required/nullable、类型、finite safe positive integer、单位、范围、cross-field ceiling、ref grammar 和 `null` 语义。
- sensitive/redaction：raw secret、provider payload、full sensitive ref、endpoint/path/body、Git 输出和 stack 不进入任一输出面；redaction 放宽被拒绝。
- composition/capability：malformed ref 与合法但 `blocked/unsupported/unknown` 分层；builder 失败不暴露半装配 facade；四态不升级为健康/授权/readiness。
- activation/freeze：startup/cold、job-run-start、entry-local、test harness 的边界；在途对象保持原 `runtimeBindingSnapshotRef`；reload/hot whole-request reject。
- 主路径与本地安全：`clone`、`pull`、`status`、`push-review` 的显式 project/version/source/target 选择、permission/source binding、dirty/untracked/path/symlink/lock unknown、non-overwrite 和禁止 Git 动作。
- 增量/冲突/恢复：cursor/mapping/gap/expiry/drift、conflict/checkpoint/resume/replan/manual、commit/effect `unknown`、不推进 cursor、不换 key 盲重放。
- Query/Consumer/Job：13 Query zero-write；依赖不可用时既有 partial/unavailable/degraded；3 Consumer 的 conservative transition；3 bounded Job 的 scope、snapshot、partial/unknown 和旧 carrier 不变。
- review/provenance：candidate freeze、handoff attempt 的 transport/unknown/probe/Decision 分层；upload ACK 不等 accepted；provenance append/protect/supersede/degrade、禁止 delete/伪造。
- change/failure/rollback：high/critical 变更的 safe audit；previous validated candidate 的冷回退；drift/expiry、diagnostics sink failure 和 no-silent-fallback。

05 负责把这些场景展开成真实用例、fixture、fault injection、runner、执行顺序和报告/证据索引；本 Step 不创建用例、fixture、runner、run 或结果。

### 3.2 哪些配置门禁进入验收标准？

回答：06 至少承接下列可判定门禁，其中带 `VETO` 的项目是配置层一票否决输入。VETO 只引用正式 03/04 红线和未来由 05/07 产生的验证材料，不在本 Step 预填通过结论：

1. `VETO` strict schema：unknown/alias/duplicate/JSONC/forbidden key、required 缺失、类型/范围/cross-field 错误不得被接受。
2. `VETO` no silent fallback：高优先级 environment/selector 非法时不得继续使用 JSON/default/cache/旧 snapshot。
3. `VETO` sensitive no-output：raw secret、provider/body、full ref、path/body、Git stdout/stderr 不得进入 config/snapshot/metadata/log/diagnostic/audit/report。
4. `VETO` builder exposure：required binding、redaction、snapshot 或 route graph 失败时不得暴露半装配 mutation facade。
5. `VETO` truth boundary：配置不得改变 Project/Artifact/Baseline/Review Gate/Workspace/Archive/Git remote ownership，不得将 local result、Git commit、ACK、telemetry 或 job report 升格。
6. `VETO` local safety：dirty/untracked/path/symlink/lock 状态 unknown 或 non-overwrite guard 不成立时不得 apply；不得自动 merge/rebase/push/stash。
7. `VETO` review/provenance：不得绕过 Review Gate、创建 Decision、删除/伪造 provenance；ACK 只能是 transport 事实。
8. capability ceiling：合法 ref 的 `blocked/unsupported/unknown` 必须保留；fake、cache、profile 名或日志不能提升为 `bound`、健康、授权、accepted 或 readiness。
9. activation/freeze：P0 不得出现 config center/admin override/reload/hot/online LKG；新配置只进入新 cold composition，在途 snapshot 不重绑。
10. failure/recovery：`commit_status_unknown`、`outcome_unknown`、partial、gap、drift、expiry 不能被当作未发生或成功；不得换 key 盲重试或自动 rollback 外部 effect。
11. Query/operations：Query 保持 zero-write；`operations.* = null` 不注册资源；未闭合 Consumer/Job contract 不得启动 daemon/scheduler/topic/scope/key。
12. evidence boundary：未来测试/验收材料必须能区分 planned input、实际 run、artifact、report、evidence、verdict、signoff 和 readiness；本 Step 的设计表不构成任何一种实际材料。

06 负责定义最终通过/失败、VETO、缺陷分级、复验和放行裁决；本 Step 不填写 verdict、签署人或 readiness。

### 3.3 哪些配置准备进入实施计划？

回答：07 必须把配置闭环拆为可追溯的 planned task family，并在后续每个 phase/commit boundary 复核 03/04/05/06 的一致性。至少包括：

- strict JSON candidate reader、closed-section/duplicate/alias/unknown/forbidden scanner；不得锁定尚未确认的 parser/package。
- source composer：approved default、selected JSON、allowlisted environment 的优先级、冲突和高优先级非法 fail-fast。
- 42-leaf typed validator：required/nullable、type/range/unit/ref/sensitive/cross-field 校验；不得扩展 schema。
- profile/composition validator：四个 P0 profile、test-double ceiling、future profile blocked/waiting。
- sensitive/ref boundary：opaque ref、adapter-private resolution、redaction policy、safe issue/audit marker、rotation 的新 composition 语义。
- runtime composition/builder：`ValidatedSyncRuntimeConfig` → existing adapters/ports → immutable `AdapterCapabilitySnapshot` → read-only graph → mutation facade → conditional operations；失败不暴露半图。
- CLI entry seam：既有 `clone`、`pull`、`status`、`push-review` 的显式 selection、config/profile selector、safe presentation 和 entry-local validation；parser、binary、flag、exit-code 仍按 `SYNC-LOCAL-004/005` 待确认，不得在 07 自猜。
- metadata/local-tools/SDK binding adapters：只实现 03 已定义的 inward ports；physical `.qs-sync` schema、SDK DTO、Git library、LFS/shallow/GUI 仍由 blocker 控制。
- Query/Consumer/Job guards：Query zero-write、Consumer conservative transition、bounded Job run pin、partial/unknown/replay；不得新增 operation truth 或 scheduler。
- configuration change/audit/failure hooks：safe audit、diagnostic/metric seam、fail-fast/fail-closed/degraded/delayed/unknown mapping；不把 issue class 变成未回写的 public error。
- planned test/gate integration：把 05/06 的配置切口和 VETO 作为实施前置输入；当前不创建 implementation ledger、boundary skeleton、代码文件或提交记录。

07 负责阶段顺序、依赖、commit boundary、门禁命令和实施台账；本 Step 只给任务族、输入和禁止越界。

### 3.4 哪些部署细节留给部署与运维手册？

回答：09 承接运行态事实和操作步骤，而 04 只提供不可改变的配置语义。09 可展开但不得改写：

- profile 在各环境的选择、candidate 的放置/发布方式、环境变量 key 映射和权限；不得改变 source precedence 或把环境名隐式当 profile。
- secret provider 产品、credential/endpoint ref 注入、最小权限、rotation/expiry、provider outage 处置；不得把 raw material 写进配置或手册正文。
- startup/cold compose/restart、validation failure、previous validated candidate rollback、config digest/marker 比对和人工确认；不得引入 online LKG/hot reload。
- Git/filesystem 工具支持矩阵、target-root/path/dirty-worktree 检查、non-overwrite 止血和未知 effect 的 probe/manual 流程；不得写自动 merge/rebase/push/stash。
- safe alert、指标聚合、Dashboard、值班升级、runbook、备份/恢复/保留和审计留痕；不得把告警 receipt 当 evidence/accepted/readiness。
- staging/production-like 的真实 adapter、owner、endpoint、secret provider 和发布门禁；在 blocker 未关闭前只能标记 `planned/blocked/waiting`，不能声称实例存在。

09 不得在运维命令、环境文件或 runbook 中新增配置 leaf、改变 04 的 failure strategy，或以操作便利绕过 03/04 红线。

### 3.5 下游文档不应重复定义哪些配置契约？

回答：下游可以把 04 结论转换为场景、门禁、任务和操作步骤，但不得重新定义或另存一份相冲突的：

- 42-leaf schema、canonical key、类型、required/nullable、默认值允许性、单位和范围。
- source precedence、selected strict JSON、allowlisted environment、冲突和高优先级非法处理。
- profile 名称/语义、test-double ceiling、P0/P1/P2 上限和 profile 选择规则。
- sensitive/ref-only/no-output/redaction 规则、rotation 生命周期和安全字段粒度。
- startup/job-run-start/entry-local/test activation、immutable snapshot pinning、reload/hot 禁止。
- fail-fast/fail-closed/degraded/delayed/`failed_known`/`outcome_unknown` 及 Query/Consumer/Job disposition。
- capability 四态及其不得升级为健康、授权、accepted、evidence 或 readiness 的边界。
- Project/Artifact/Baseline/Review Gate/Workspace/Archive/Git remote ownership、dirty non-overwrite、provenance protection、ACK≠accepted。
- 配置 rollback 不撤销外部 effect、unknown 走 checkpoint/probe/manual、不得盲 retry/merge/rebase/push/stash 的红线。

发现不一致时，05/06/07/09 必须暂停相应产物，回指 04；若需要改变 runtime type、Port、DTO、error、state、flow 或 durable carrier，先回写 03，再重新审查受影响 Step。

## 4. 当前文档问题诊断

| 位置 / 材料 | 当前问题 | 对下游的影响 | 本 Step 处理 |
|---|---|---|---|
| `projects/L5-sync/05-测试方案.md` §4、§6、§12 | 旧文档按旧 `SyncTask`/delivery/replay 词汇组织，环境矩阵没有 04 的四个 P0 profile、42 leaf、strict source、sensitive/no-output、capability ceiling 或 effect unknown 边界 | 测试人员可能沿用旧对象、旧状态和旧证据措辞，遗漏 `clone/pull/status/push-review` 与 local safety | 只给新版配置测试输入和禁止继承清单；不修改旧 05 |
| `projects/L5-sync/06-验收标准.md` §3～§7 | 旧验收未覆盖 config schema、no fallback、builder no-facade、review ACK 分层、dirty non-overwrite 和 evidence boundary | 可能把 local sync result 当平台接受，或让高风险配置失败降级为普通风险 | 只给配置门禁/VETO 输入；不修改旧 06 |
| 正式 `projects/L5-sync/04-配置设计.md` | 当前不存在，Step 1～11 尚未装配 | 下游没有单一配置真相源 | §9 提供未来 §12 回填草稿；正式 04 仍留到 Step 15 |
| `projects/L5-sync/07-实施计划.md` | 当前不存在 | 没有配置 task family、phase/commit boundary 或实现门禁承接 | §8.4 定义 planned task family；不创建 07、implementation ledger 或 skeleton |
| `projects/L5-sync/09-部署与运维手册.md` | 当前不存在，且不属于本轮 04 正式装配 | 运维无法知道哪些细节可实例化、哪些仍是 blocker | §8.5 划分配置语义与运行态操作；不创建 09 |
| 旧 README / `draft/` / 其他项目正式文档 | 含 Rust/Tauri、LFS、浅克隆、GUI、固定 metadata 等历史或他域 truth | 可能污染当前 TypeScript/SDK/physical metadata 未闭合口径 | 仅作 historical/framework material；不作为下游配置事实 |

诊断结论：当前缺口是“下游尚未承接”，不是允许下游自行发明配置契约。所有承接均必须保留上游 blocker 和 planned/blocked/waiting 状态。

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 测试输入 | 旧 05 只有粗粒度环境和旧主线场景 | 05 获得 profile/source/42-leaf/sensitive/composition/activation/failure/CLI safety 的场景族 | 让测试覆盖配置跨层风险，而非只验证 happy path |
| 验收输入 | 旧 06 没有配置 VETO 和 evidence boundary | 06 获得 schema、no fallback、no leakage、builder、truth ownership、local safety、review、unknown recovery 等可判定门禁 | 防止配置安全问题被“风险接受”掩盖 |
| 实施输入 | 07 尚未创建，配置实现责任未分层 | 07 获得 parser/source/validator/profile/composition/adapter/entry/job/audit/test task family | 使后续 phase/commit boundary 能回指 03/04，而不在代码侧补猜 |
| 运维输入 | 09 尚未创建，profile、secret、restart、rollback、alert 归属不清 | 09 获得运行态细节清单和不得改变的 04 边界 | 防止 04 变成部署命令，也防止运维绕过配置红线 |
| 证据边界 | 旧材料把日志、local history、ACK 或报告词汇混用 | 明确 planned evidence input、实际执行材料和平台 truth 的层级分离 | 避免提前伪造 evidence、accepted 或 readiness |
| 契约所有权 | 下游可能复制或改写配置字段 | 04 是 schema/source/activation/failure/profile/truth boundary 的唯一配置真相源 | 保持设计真相源闭环 |

## 6. 设计取舍

| 议题 | 采用方案 | 未采用方案 | 取舍原因 |
|---|---|---|---|
| 05 的承接粒度 | 交付场景族、profile/失败矩阵和 planned evidence 输入 | 在 Step 12 直接写完整 test case、fixture、runner、报告路径 | 遵守测试 SOP 边界；完整用例需结合 05 的测试对象、数据和 runner 再展开 |
| 06 的承接粒度 | 交付可判定 gate/VETO、失败条件和证据类型上限 | 直接写“验收通过”或预填证据链接/verdict | 当前没有运行或验收事实；裁决必须由 06 结合真实材料完成 |
| 07 的承接粒度 | 交付 planned task family、输入、依赖和禁止越界 | 在 04 中写 phase、commit hash、代码文件完成状态或 implementation ledger | 实施顺序和 boundary 需要 07 按详细设计、测试和验收共同裁决；本轮不实现 |
| 09 的承接粒度 | 交付 profile/secret/restart/rollback/alert 的运行态主题和红线 | 在 04 中写部署命令、真实 endpoint、secret 值、阈值或值班联系人 | 配置设计不是运维手册；具体环境事实尚未确认 |
| evidence 语义 | 使用“planned evidence input / future generated material”并明确当前不存在 | 把 calibration 表、safe audit、local commit、ACK、job report 或 telemetry 当 evidence | 保持 artifact/report/evidence/verdict/signoff/readiness 分层 |
| profile 处理 | P0 四 profile 固定语义；未来 profile 只 `planned/blocked/waiting` | 允许下游按环境名私造 profile 或让 fake 进入 production-like | profile 是配置控制面语义，不是部署实例或能力证明 |
| 配置契约变更 | 下游发现冲突时回到 04；改变代码契约时先回 03 | 由 05/06/07/09 直接覆盖 04 字段或 failure strategy | 避免多真相源和实现侧猜测 |

## 7. 结构化中间产物

### 7.0 复杂度判断与拆分规则

本 Step 的复杂度来自四个下游文档、九个配置 section、42 个 leaf、四个 activation surface 和多层 evidence boundary 的交叉，而不是来自新增代码对象。为保持可审查性，承接按“下游文档 × 配置风险主题”拆成独立表格：

```text
04 truth
  ├─ profile/source/schema/sensitive/activation/failure
  ├─ 05: test scenarios + data/environment/evidence input
  ├─ 06: acceptance gates + VETO + failure/evidence boundary
  ├─ 07: planned task families + phase/commit preconditions
  └─ 09: deployment/runtime/runbook handoff
```

本 Step 不再拆出新的 config leaf、runtime object、Port、DTO、error、state、flow、topic、scheduler、artifact root 或报告路径。完整用例、最终 gate ID、实现 boundary ID 和运维命令分别留给 05/06/07/09 的正式流程。

### 7.1 下游总承接表

| 下游文档 | 必须承接的配置输入 | 允许展开 | 明确禁止 | 当前状态 / 证据上限 |
|---|---|---|---|---|
| `05-测试方案.md` | profile/source/schema/42-leaf/sensitive/composition/activation/failure、主路径和 local safety 场景 | 测试对象、用例、数据、fixture、runner、fault injection、自动化和未来执行材料 | 改写 schema/source/failure；把 fake、planned cut 或 local result 写成 run/evidence/readiness | `planned input only`；当前无 test run、artifact、report 或 evidence |
| `06-验收标准.md` | 配置 gate、VETO、失败条件、truth/evidence boundary、与 05 的引用关系 | AC/VETO 编号、通过/失败、缺陷/复验/风险接受和最终裁决 | 预填 verdict/signoff/readiness；允许下游覆盖 VETO；把 ACK/日志/Git commit 当 accepted | `planned gate input only`；当前无验收结论 |
| `07-实施计划.md` | task family、依赖、配置准备、测试/验收门禁、blocker 和设计回写规则 | phase、commit boundary、文件批次、命令、台账和真实实现状态 | 在 04 创建 implementation ledger/skeleton；实现侧新增 schema/port/error 或绕过 blocker | `planned/blocked/waiting`；当前无实现、commit 或 boundary 事实 |
| `09-部署与运维手册.md` | profile 选择、配置发布、secret/ref、cold restart、rollback、alert/runbook、安全边界 | 真实环境、产品、命令、权限、阈值、值班和恢复步骤（待确认后） | 修改 04 契约；写 raw secret；引入 hot/LKG/自动 merge/rebase/push 或把 alert receipt 当证据 | `future handoff`；当前无部署实例、runbook 或 readiness |

### 7.2 05 测试方案的配置承接矩阵（仅 planned 输入）

| 测试主题 | 至少覆盖的场景 | 关联 04 输入 | 关联 03 边界 | 未来证据类型（当前未生成） |
|---|---|---|---|---|
| profile composition | `local-dev`、`ci-test`、`integration-like`、`operations-replay` 合法组合；future profile/test double 隔离 | Step 6 profile matrix | §13 capability snapshot / test-double ceiling | profile validation material |
| source precedence | approved default、strict JSON、allowlisted env 覆盖；高优先级非法无 fallback | Step 5 | §13.1 loader boundary | source precedence negative material |
| strict syntax | JSONC、尾逗号、duplicate、alias、unknown、forbidden key reject | Step 7/9 | config parser/validator seam | parser/validation material |
| required/nullability | 38 required 缺失；4 operations leaf 显式 `null` 不注册 | Step 7 | `SyncOperationsBindings` | required/nullability material |
| type/range/unit | non-finite、zero、negative、overflow、单位错误、ceiling 冲突 | Step 7/9 | `SyncBoundaryLimits` / `SyncExecutionBudgets` / `SyncJobBudgets` | validation issue material |
| ref/profile validation | malformed ref、canonical mismatch、selector conflict、future profile | Step 7/9 | typed config refs | ref/profile rejection material |
| sensitive/no-output | raw secret/provider response/full ref/path/body/stdout/stderr 不出现在任何 carrier | Step 8/11 | §14 redaction | redaction scan material |
| builder exposure | invalid required binding、unsafe redaction、partial graph 不暴露 facade | Step 9/11 | runtime composition order | builder disposition material |
| capability ceiling | `bound/blocked/unsupported/unknown` 分层；不升格为 health/auth/accepted/readiness | Step 6/9/11 | `AdapterCapabilitySnapshot` | capability classification material |
| activation freeze | cold composition、job pin、entry-local、test rebuild；old snapshot immutable；reload/hot reject | Step 9/10 | `runtimeBindingSnapshotRef` | activation/freeze material |
| CLI explicit selection | `clone`/`pull`/`status`/`push-review` 的 project/version/source/target/selector 显式且不猜 latest/default | Step 6/9/11 | §7/§8 entry flows | entry validation material |
| permission/source binding | owner/access/source/ref unavailable、stale、archived posture fail-closed | Step 6/11 | selection/access/source adapters | dependency disposition material |
| metadata/local safety | `.qs-sync` logical binding、dirty/untracked/path/symlink/lock unknown、non-overwrite | Step 7/9/11 | metadata/Git/fs ports | local safety material |
| incremental and conflict | cursor/mapping gap、drift/expiry、conflict/checkpoint, no cursor advance on partial/unknown | Step 6/11 | materialization/conflict/recovery flows | recovery material |
| effect unknown | commit/effect timeout, `commit_status_unknown`/`outcome_unknown`, checkpoint/probe/manual, no blind retry | Step 9/11 | §10～§12 | unknown-effect material |
| Query isolation | every Query zero-write, no refresh/repair/probe/diagnostic emit | Step 9/11 | §7.3/§8.3 | forbidden-call material |
| Consumer/Job posture | conditional consumer blocked/conservative; bounded job rejection/partial/unknown; old carrier immutable | Step 6/11 | §7.4/§8.3 | consumer/job disposition material |
| review handoff | candidate freeze, attempt layering, ACK≠accepted, Decision/probe unavailable, no resubmit | Step 8/11 | §5.6/§8.2 | handoff-layer material |
| provenance | append/protect/supersede/degrade; no delete/repair/fabrication | Step 8/11 | §10/§14 | provenance integrity material |
| config change/rollback | safe audit, previous validated candidate, cold restart, no external-effect rollback claim | Step 10/11 | §13/§14 recovery | change/rollback material |

05 应将每行进一步绑定到正式测试对象、用例、数据、层级和未来证据索引；本表不代表任何切口已运行或通过。

### 7.3 06 验收标准的配置门禁与 VETO 承接矩阵（仅 planned 输入）

| 门禁类别 | 通过条件（未来裁决条件） | 失败条件 / VETO 边界 | 04 来源 | 未来证据类型（当前未生成） |
|---|---|---|---|---|
| `VETO-CONFIG-SCHEMA` | strict JSON、closed section、42 leaf、required/nullability、type/range/ref/cross-field 全部按契约拒绝非法候选 | 任一非法候选被接受、忽略或静默修正 | Step 7/9/11 | config validation material |
| `VETO-CONFIG-SOURCE` | source precedence 唯一且高优先级非法不 fallback | env/selector 非法后继续使用低优先级、cache 或旧 snapshot | Step 5/9 | negative precedence material |
| `VETO-CONFIG-SECRET` | raw sensitive material 和 forbidden body 在所有输出面均不可见 | config/snapshot/metadata/log/diagnostic/audit/report 出现原文或完整 ref | Step 8/11；03 §14 | redaction material |
| `VETO-CONFIG-BUILDER` | composition/build failure 不暴露半装配 mutation facade | required binding/redaction/snapshot/route graph 失败仍可写 | Step 9/11；03 §13 | builder material |
| `VETO-CONFIG-TRUTH` | Sync 只保留 local session/metadata/cursor/mapping/conflict/recovery/handoff/provenance refs | 配置或 local result 被当 Project/Artifact/Baseline/Gate/Workspace/Archive/Git remote truth | Step 2/4/6/11；03 §1/§2 | ownership/boundary material |
| `VETO-CONFIG-SAFETY` | dirty/path/symlink/lock unknown 时 fail-closed，apply non-overwrite | 覆盖用户修改、自动 merge/rebase/push/stash 或 root escape | Step 4/6/11；03 §3/§5 | local safety material |
| `VETO-CONFIG-REVIEW` | handoff transport、probe、Decision 分层；ACK 仅 transport | ACK/upload/local commit 被宣称 accepted、Decision、Artifact/Baseline 或 readiness | Step 8/11；03 §5.6 | handoff/provenance material |
| `VETO-CONFIG-ACTIVATION` | 只允许 cold/new run/current entry/test composition；old snapshot pinning | hot/reload/LKG/原地 adapter swap/在途 rebind | Step 9/10/11 | activation material |
| `VETO-CONFIG-UNKNOWN` | unknown/partial/commit unknown 保留 checkpoint/probe/manual | timeout 被当作未发生、换 key 盲重试、自动 rollback 外部 effect | Step 10/11；03 §10～§12 | recovery material |
| `VETO-CONFIG-QUERY` | Query zero-write；Consumer/Job 按既有 disposition | Query 修复/refresh/probe/write，或 null slot 私造 daemon/topic/schedule | Step 9/11；03 §7.3/§7.4 | forbidden-call material |
| `VETO-CONFIG-EVIDENCE` | 未来材料能区分 run/artifact/report/evidence/verdict/signoff/readiness，且有真实来源 | 静态映射、日志、telemetry、local report、ACK 或 calibration 表被当最终证据 | Step 6/8/10/11；可落码标准 | evidence provenance material |

06 必须在正式流程中给每个门禁唯一编号、证据来源、失败裁决和复验规则；当前表的 `VETO-*` 只是设计输入标签，不是已注册验收项或结论。

### 7.4 07 实施计划的 planned task family 承接

| Task family（planned） | 配置/代码边界输入 | 依赖与阻塞 | 实施时必须验证 | 当前状态 |
|---|---|---|---|---|
| candidate reader / strict parser | 九 section、strict JSON、duplicate/alias/unknown/forbidden reject | parser/package 选择受 `SYNC-LOCAL-004`；不锁实现库 | raw unknown 只存在 loader 边界；无宽松 fallback | `planned / waiting` |
| source composition | default < JSON < allowlisted env；special `configRef` rule | source contract、env naming 待后续运维确认 | 高优先级非法值不 fallback；source kind 可安全追踪 | `planned / waiting` |
| typed validator | 42 leaf、38 required、4 nullable、type/range/ref/cross-field | exact parser/validator syntax 未确认 | 不新增 leaf；invalid candidate 不生成 typed config | `planned / waiting` |
| profile and test composition | 四个 P0 profile、future profile ceiling、deterministic refs | test runner/fake registry `SYNC-LOCAL-004` | fake 不进 production-like；replay carrier 脱敏 | `planned / blocked` |
| sensitive/ref handling | opaque refs、adapter-private material、redaction/no-output、rotation | secret provider/API 未闭合 | raw material 不进入任何 carrier；rotation 仅新 composition | `planned / blocked` |
| runtime builder/composition | `ValidatedSyncRuntimeConfig`、existing ports、capability snapshot、read graph/mutation facade | SDK/metadata/Git/fs positive seams `SYNC-UP-001~010` | builder order、required binding、partial graph no facade | `planned / blocked` |
| CLI entry integration | `clone`、`pull`、`status`、`push-review`；explicit selection/profile/source/target | binary/parser/flag/exit-code `SYNC-LOCAL-005` | 不猜 selection；safe presenter 不泄露 path/body/secret | `planned / waiting` |
| metadata adapter seam | logical `.qs-sync` store/UoW/lock/snapshot/cursor/mapping/provenance | physical schema/migration/retention `SYNC-UP-006` | no silent migrate/delete/repair；commit unknown reload | `planned / blocked` |
| SDK adapter registry | owner/access/source/handoff/Decision/probe bindings | `SYNC-UP-001~005/008` | owner access≠source authority；ACK≠accepted；unknown 不重提 | `planned / blocked` |
| Git/filesystem adapters | observation/apply/root policy/non-overwrite | `SYNC-UP-007/009/010` + `SYNC-LOCAL-001~003` | dirty/path/tool unknown fail-closed；无 merge/rebase/push/stash | `planned / blocked` |
| Query/Consumer/Job guards | Query zero-write；conditional consumer；bounded jobs and run snapshot | formal Consumer/Job contract、runner 未闭合 | no hidden write/daemon/scheduler；old carrier immutable | `planned / blocked` |
| config change/audit/failure hooks | safe audit markers、diagnostic seam、failure disposition mapping | audit carrier/alert sink exact contract 待确认 | no raw values；Step 11 dispositions remain layered | `planned / waiting` |
| test and acceptance integration | 05 planned cuts、06 VETO、redaction/boundary scans | 05/06 尚未重写；不生成结果 | each boundary has future test/gate input and evidence provenance | `planned / blocked` |

这些是实施计划的任务族，不是已创建模块、文件、对象、命令或 commit。正式 07 才能把它们拆成 phase/commit boundary，并按代码实施台账规范创建 implementation ledger 和 boundary skeleton；本 Step 明确不创建。

### 7.5 09 部署与运维手册承接表

| 运维主题 | 09 未来应写 | 04 提供的不可变输入 | 09 禁止改写 / 当前状态 |
|---|---|---|---|
| config artifact / 发布 | candidate 文件或受控载体的位置、权限、发布/校验流程 | strict JSON、closed schema、redacted digest、previous validated candidate | 不改变 key/schema/source precedence；真实载体未定，`waiting` |
| profile selection | local/CI/integration/replay/staging/production-like 的环境选择和权限 | Step 6 profile semantics、future ceiling | 不用环境名隐式推断 profile；P1/P2 未实例化 |
| environment mapping | allowlisted env key、注入方式、冲突诊断 | Step 5 precedence、invalid high-priority fail-fast | 不将任意 env 变成新 leaf；名称/权限待确认 |
| secret provider | provider 产品、ref 注入、rotation、expiry、最小权限 | Step 8 opaque ref、adapter-private material、no-output | 不写 raw secret/provider body；provider 未闭合，`blocked` |
| startup / restart | load→validate→compose→snapshot→facade 门禁、失败诊断和重启顺序 | Step 9 activation/freeze、Step 11 fail-fast | 不引入 hot/reload/LKG；当前无运行实例 |
| config rollback | 选择 previous validated candidate、重新 cold compose/restart、safe audit linkage | Step 10 rollback semantics | 不声明外部 SDK/Git/fs/Review effect 已回滚；流程未实例化 |
| drift / expiry / unknown | 停止新入口、保留 old snapshot、checkpoint/probe/manual 处置 | Step 11 drift/expiry/unknown matrix | 不自动 refresh/repair/retry/overwrite；runbook 待写 |
| Git/filesystem safety | tool support matrix、root/path/dirty 检查、non-overwrite 止血 | Step 4/6/11 localTools boundary | 不启用 LFS/shallow/GUI/merge/rebase/push/stash；matrix 未闭合 |
| alerts / dashboards | safe fields、阈值、聚合、路由、值班升级和静默规则 | Step 11 safe observation fields | 不把 alert receipt 当证据/accepted/readiness；阈值未定 |
| audit / retention | change marker、redacted digest、provenance/metadata 保留和恢复 | Step 8/10/11 audit/no-delete boundary | 不删除 protected provenance 或写 raw body；physical retention 未定 |
| release gate / handoff | 与 05/06/07 未来材料的发布前检查和人工确认 | 04 gate/VETO 输入 | 不预填 release verdict/signoff；未来文档承接 |

### 7.6 下游不得重复定义的配置契约矩阵

| 契约 | 唯一真相源 | 下游可做 | 下游不可做 |
|---|---|---|---|
| raw key / type / required / nullable / range | 04 Step 7 + 03 §13 | 映射测试数据、实现 validator、运维表格 | 增删 leaf、改默认/单位/范围或把 candidate 值写成实例 |
| source priority / conflict | 04 Step 5/9 | 设计 negative test、部署注入说明 | 让 env/file/default 顺序漂移、非法 fallback 或读取任意 source |
| profile semantics / ceiling | 04 Step 6 | 组织环境/fixture/adapter 矩阵 | 按环境私造 profile、fake promotion、生产 readiness claim |
| sensitive/ref/no-output | 04 Step 8 + 03 §14 | 做 redaction scan、provider/runbook 输入 | 记录 raw secret/full ref/body/path/Git output或放宽 deny policy |
| activation/freeze | 04 Step 9/10 | 测试 restart/job/entry/test composition | 引入 hot/reload/LKG、原地替换或重绑 in-flight snapshot |
| failure/degradation | 04 Step 11 + 03 §11/§12 | 映射测试失败和运维处置 | 把 invalid config 当 degraded success、timeout 当未发生或自动重试 |
| truth ownership / review | 00～03 + 04 Step 4/8/11 | 写 boundary negative tests and VETO | 创建/修改外部 owner truth、ACK→accepted、local commit→Artifact/Baseline |
| local safety / provenance | 03 §5/§9/§10/§14 | 写 filesystem/Git/metadata checks | 覆盖 dirty worktree、删除/伪造 provenance、repair unknown history |
| evidence maturity | 设计真相源标准 + 05/06/07 | 生成真实材料后建立 link/index | 静态 calibration 表、日志、telemetry、ACK、job report 当 evidence/readiness |

### 7.7 planned evidence boundary map（当前不生成）

| 未来材料类别 | 可能由谁产生 | 必须回指 | 当前允许表述 | 当前禁止表述 |
|---|---|---|---|---|
| config validation material | 05/07 测试或 gate runner | source、schema、validator、profile、run context | “planned input / future generated” | “validation report 已存在/已通过” |
| redaction/boundary scan material | 05/06/07 | forbidden-field matrix、safe output surface | “需要证明无泄露” | “scan 已完成/无泄露事实” |
| runtime builder material | 05/07 integration seam | builder order、snapshot、facade gate | “未来验证 invalid no-facade/valid composition” | “Ready/运行成功” |
| capability/adapter material | 05/07 controlled integration | adapter contract、blocker、four-state mapping | “能力姿态需被分类” | “bound/healthy/authorized” |
| Git/fs safety material | 05/07/09 | dirty/path/non-overwrite/tool matrix | “需证明保护用户修改” | “工作区已 clean/已 apply” |
| review/provenance material | 05/06/09 与上游 owner | attempt/transport/probe/Decision/provenance refs | “需保持 ACK 分层” | “accepted/Decision/evidence/readiness 已产生” |
| rollback/restart material | 06/07/09 | previous validated candidate、cold activation、safe audit | “未来需验证显式回退路径” | “rollback 已执行/外部 effect 已撤销” |

所有未来材料都必须有真实执行来源、脱敏检查、上下游引用和相应文档的停审；本 Step 不创建其目录、文件、run、report 或索引。

### 7.8 跨下游承接审计表

| 审计项 | 结论 | 修正 / 依据 |
|---|---|---|
| 是否替 05 写完整测试用例、数据和 runner | 否 | §7.2 只交付场景族和 planned 输入 |
| 是否替 06 写完整 AC/VETO verdict、签署和放行 | 否 | §7.3 只交付 gate/VETO 条件和证据类型上限 |
| 是否替 07 写 phase、commit、implementation ledger/skeleton | 否 | §7.4 只交付 planned task family；正式 07 才能创建实现台账 |
| 是否替 09 写部署命令、真实 endpoint、阈值或值班流程 | 否 | §7.5 只交付运行态主题和不可变边界 |
| 是否覆盖四个 P0 profile 与 future profile ceiling | 是 | §2.2、§7.2、§7.5 |
| 是否覆盖 42 leaf、38 required、4 nullable | 是 | §2.2、§7.2～§7.4；不新增 leaf |
| 是否覆盖 source precedence 与 high-priority no fallback | 是 | §2.2、§3.1、§7.2/§7.3 |
| 是否覆盖 sensitive/ref-only/no-output | 是 | §2.2、§3.2、§7.2/§7.3/§7.5 |
| 是否覆盖 activation/freeze/reload-hot prohibition | 是 | §2.2、§7.2/§7.3/§7.5 |
| 是否覆盖 Query zero-write、Consumer/Job 和 effect unknown | 是 | §3.1、§7.2/§7.3/§7.4 |
| 是否把 local result/ACK/log/telemetry 当 owner truth | 否 | §2.2、§3.2、§7.6～§7.7 |
| 是否为 concrete SDK/Git/fs/parser/provider/runner 作未核验选型 | 否 | blocker 保持 `SYNC-UP-001~010`、`SYNC-LOCAL-001~005` |
| 是否生成测试、验收、实现或运维事实 | 否 | 全文状态均为 planned/blocked/waiting；无 run/result/artifact/report/evidence/verdict/signoff/readiness |

### 7.9 blocker 传播与完成上限

| blocker | 对下游承接的影响 | 下游可做的最小动作 | 不可宣称 |
|---|---|---|---|
| `SYNC-UP-001~005/008` SDK/source/access/handoff/probe | 正向 owner/source/review capability 只能 `blocked/unknown` | 设计 negative/controlled seam、保留 blocker ref | SDK API/DTO、授权、source freshness、accepted 或 probe success |
| `SYNC-UP-006` `.qs-sync` physical metadata | 只能承接 logical store/UoW/cursor/mapping/provenance contract | 规划 logical/fake contract 和 failure cuts | physical file/table/schema/migration/retention 或 crash result |
| `SYNC-UP-007/009/010` Git/fs/tool safety | apply 和支持矩阵只能 blocked/waiting | 规划 observation/non-overwrite negative seam | clean worktree、Git remote truth、LFS/shallow/GUI 支持或 apply result |
| `SYNC-LOCAL-001~005` 本地工具链/包/parser/runner | 不能锁 Node/package/bin/parser/validator/test runner/Git library | 将选择保留为 07/实现前置待确认 | package 安装、命令运行、测试结果或 commit |

完成上限：Step 12 可以使 05/06/07/09 知道“应承接什么”和“不得改变什么”，但不能把任何 blocker 转换为 `bound`、健康、授权、accepted、evidence、signoff 或 readiness。

## 8. 设计回填中间产物

### 8.1 未来正式 `04-配置设计.md` §12 回填草稿

> 校准来源：
> - `design-calibration/04_config_step_06_environment_profiles_matrix.md`
> - `design-calibration/04_config_step_07_config_items.md`
> - `design-calibration/04_config_step_08_sensitive_secrets.md`
> - `design-calibration/04_config_step_09_loading_validation_activation.md`
> - `design-calibration/04_config_step_10_change_audit_rollback.md`
> - `design-calibration/04_config_step_11_failure_degradation.md`
> - `design-calibration/04_config_step_12_downstream_handoff.md`
>
> 延伸阅读：建议继续阅读上述中间产物的“结构化中间产物”“回填草稿”“待确认事项”和“自检与进入下一步门禁”小节，了解下游输入如何从 04 配置控制面收敛。

正式 §12 应先声明：`04` 是配置 schema、source precedence、profile、sensitive/no-output、activation、failure/degradation 和 truth boundary 的唯一配置真相源；`05/06/07/09` 只能承接，不得重新定义。

随后按以下顺序回填：

1. 回填下游总承接表：05 测试、06 验收、07 实施、09 部署运维各自的承接内容、允许展开、禁止重复定义和当前状态。
2. 回填测试输入：profile/source/strict JSON/42 leaf/sensitive/composition/activation/local safety/incremental/conflict/recovery/review/provenance/Query/Consumer/Job/change/rollback 场景族；明确完整用例留给 05。
3. 回填验收输入：schema、no fallback、no leakage、builder、truth ownership、local safety、review、activation、unknown recovery、Query/operations、evidence boundary 门禁；明确最终裁决留给 06。
4. 回填实施输入：candidate reader、source composer、validator、profile/test composition、sensitive/ref、builder、CLI entry、metadata/SDK/Git/fs adapters、Query/Consumer/Job guards、audit/failure hooks 和 test/gate integration task family；明确 phase/commit/implementation ledger 留给 07。
5. 回填运维输入：artifact/profile/env mapping/secret provider/startup/restart/rollback/drift/expiry/Git-fs safety/alerts/audit/release gate；明确具体命令、产品、阈值、值班和真实环境留给 09。
6. 回填“下游不得重复定义的配置契约”矩阵，特别保留 42 leaf、source precedence、strict JSON、ref-only、cold activation、four-state capability、failure vocabulary、truth ownership、non-overwrite、ACK≠accepted 和 evidence maturity。
7. 回填 planned evidence boundary 声明：配置表、safe audit、local result、ACK、telemetry 和 calibration 不是实际 artifact/report/evidence/verdict/signoff/readiness；未来材料必须有真实 run 和脱敏来源。
8. 回填 blocker 传播和 `03` 影响判定；当前无 03 待回写，未来 config center/hot/reload/secret API/new durable carrier 仍需先回流 03。

正式 §12 不得新增配置项、默认值、source、secret provider、runtime type、Port、DTO、error、state、flow、topic、scheduler、部署命令、测试结果或验收结论。

### 8.2 正式章节写入前门禁草稿

| 门禁 | 判定 |
|---|---|
| Step 6～11 的 source/profile/schema/sensitive/activation/change/failure 结论均可回指 | 必须通过；缺任一输入不得装配正式 §12 |
| 四个下游边界分别有承接表且不互相改写真相 | 必须通过 |
| 05 未被代写完整用例，06 未被代写 verdict，07 未被代写 commit，09 未被代写命令 | 必须通过 |
| 所有 planned evidence 明确“当前未生成” | 必须通过 |
| `SYNC-UP-001~010`、`SYNC-LOCAL-001~005` 仍保留真实状态 | 必须通过 |
| 当前 03 影响判定无 `待回写` 或 `阻塞待确认` | 必须通过；若出现则先回流 03/暂停 Step 15 |
| 正式 04 仍不存在直到 Step 15 | 必须通过 |

## 9. 待确认事项

以下事项是下游实施/运维输入或未来演进触发，不把当前 Step 阻塞为失败；在未确认前保持 `planned/blocked/waiting`，不得写成正式实例：

| 事项 | 当前影响 | 需要谁确认 | 未确认前处理 |
|---|---|---|---|
| 05 的测试 runner、fixture store、fault injection 和实际证据布局 | 无法执行真实测试或生成报告 | 测试/实施 owner | 只承接 planned scenario；不创建 run、artifact、report 或 evidence |
| 06 的正式 AC/VETO 编号、证据引用和放行流程 | 无法形成最终验收裁决 | 验收 owner | 使用本 Step 的 gate 输入；不填 verdict/signoff/readiness |
| 07 的 phase/commit boundary、目标实现仓和 implementation ledger | 无法开始实现 | 实施 owner/用户授权 | 保留 task family；不创建代码、ledger、skeleton 或 commit |
| 09 是否需要独立部署/运行/应急手册及其真实环境 | 无法写具体操作 | 运维/安全 owner | 只保留运行态主题；不写命令、endpoint、阈值或联系人 |
| exact parser/validator/package/bin/test-runner/Git library | 影响实现选择和可执行命令 | `SYNC-LOCAL-001~005` owner | 不锁依赖；由 07/实现前 precheck 处理 |
| L0-sdk 与上游 owner/source/review/probe 合同 | 影响 positive integration | `SYNC-UP-001~005/008` owner | controlled/fake/blocked seam；不升格 capability |
| physical `.qs-sync` schema/migration/retention/crash semantics | 影响 metadata adapter、恢复和运维 | `SYNC-UP-006` owner | 只写 logical contract；不写文件/表/迁移事实 |
| Git/LFS/shallow/GUI/tool support matrix | 影响 localTools adapter 和 09 支持范围 | `SYNC-UP-007/009/010` owner | 禁止旧选择进入 schema；保留 blocked/waiting |
| future config center/admin override/hot reload/online LKG/secret rotation API | 可能改变 loader/builder/lifecycle/error/audit/rollback | 需求与上游 owner | P0 明确拒绝；若提出必须先回流 03 与 04 Step 13/14 |

当前 03 影响计数：`待回写=0`；`阻塞待确认=0`。上述未确认事项不构成当前 Step 的代码契约缺口；任何新 code shape、owner contract 或 durable evidence carrier 都必须重新走设计回写门禁。

## 10. 对详细设计的影响判定

| 配置结论 | 是否影响 03 | 影响类型 | 03 回写位置 | 处理状态 |
|---|---|---|---|---|
| 05/06/07/09 只能承接 04，不得重定义配置 schema/source/profile/failure | 否 | 文档所有权与下游边界 | 不适用 | 无回写 |
| 测试承接覆盖四 profile、42 leaf、strict JSON、sensitive/no-output、composition/failure/local safety/recovery | 否 | 承接 03 §13～§15 既有 seam | 不适用 | 无回写 |
| 验收承接 VETO truth/local safety/review/evidence 边界 | 否 | 承接 03 ownership、redaction、effect/recovery | 不适用 | 无回写 |
| 实施承接 task family，不新增 runtime type/Port/DTO/error/state/flow | 否 | 实施输入编排 | 不适用 | 无回写 |
| 运维承接 profile/secret/restart/rollback/alert 运行细节，不改变配置契约 | 否 | 运行态文档边界 | 不适用 | 无回写 |
| 未来 config center/admin override/hot reload/online LKG/secret API/new durable audit/evidence carrier | 是（未来触发） | 会改变 loader、builder、lifecycle、error、rollback、audit 或 public evidence boundary | 03 §13～§16、受影响 owner contract；并回到 04 Step 13/14 | 当前不触发；必须先回流 |

本 Step 不改变 03 的字段、Port、DTO、错误、状态、函数流、持久化或测试切口；持续 blocker 仍为 `SYNC-UP-001~010`、`SYNC-LOCAL-001~005`。

## 11. Step 自检与进入下一步门禁

| 检查项 | 结果 | 依据 |
|---|---|---|
| 已逐项回答 SOP 的五个问题 | pass | §3.1～§3.5 |
| 05 的测试场景输入完整且未代写完整用例 | pass | §7.2；场景族覆盖 profile/source/schema/sensitive/activation/failure/recovery/review/CLI safety |
| 06 的配置门禁/VETO 可判定且未预填 verdict | pass | §7.3；每项含通过、失败、来源和未来材料上限 |
| 07 的 planned task family 可回指 03/04 且未创建实现台账/骨架 | pass | §7.4；全部标 `planned/blocked/waiting` |
| 09 的运行态承接完整且未写部署命令/真实值 | pass | §7.5 |
| 42 leaf、38 required、4 nullable 在下游承接中保持一致 | pass | §2.2、§7.2～§7.4 |
| source precedence、strict JSON、no fallback、ref-only、activation/failure 口径未漂移 | pass | §2.2、§3、§7.6 |
| truth ownership、dirty non-overwrite、review ACK 分层、provenance protection 未被下游弱化 | pass | §2.2、§3.2、§7.3、§7.6 |
| planned evidence 与实际 artifact/report/evidence/verdict/signoff/readiness 分离 | pass | §7.7、§8.1 |
| 未新增 runtime type/Port/DTO/error/state/flow/leaf/provider/product | pass | §3.5、§7.0、§7.4、§8.1 |
| 上游 blocker 未被 profile/fake/ACK/log/job report 关闭 | pass | §7.9；`SYNC-UP-001~010`、`SYNC-LOCAL-001~005` 保持 |
| 当前 03 影响无待回写/阻塞待确认 | pass | §10 |
| 正式 04、05/06/07/09 和未来 Step 文件均未被提前创建 | pass | 文件静态审计；正式 04 仍 absent |
| 未实现代码、未运行测试、未生成 artifact/report/evidence/verdict/signoff/readiness、未提交 commit | pass | Step 状态和台账边界 |

### Step 12 结论

`Step status = completed / stop_review`；`gate_status = pass_with_upstream_blockers`。

本 Step 已闭合 04 配置真相向 05 测试、06 验收、07 实施和 09 部署运维的承接关系：下游获得了可判定的场景、门禁、planned task family、运维主题和 evidence boundary，同时明确不得重复定义 04 的 schema、source precedence、profile、sensitive/no-output、activation、failure、truth ownership 或安全红线。当前不创建 Step 13、正式 `04-配置设计.md`、05/06/07/09 正式文档、implementation ledger/skeleton，也不实现代码或运行测试。

允许的下一动作是：在用户/流程允许后进入 `04_config_step_13_migration_deprecation_evolution.md`；本轮在 Step 12 停审。
