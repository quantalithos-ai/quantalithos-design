# Step 10. 定义配置变更、审计与回滚

> 对应 SOP：`standards/document/配置设计讨论流程_SOP.md` Step 10。
> 回填章节：未来正式 `04-配置设计.md` §10「配置变更、审计与回滚」。
> 当前模式：`full-restart + single-agent-serial`；本文件是中间产物，不是正式 04。
> 事实边界：本 Step 只定义既有 42 个配置 leaf 的变更权限、风险分级、评审、审计、冷生效和回退姿态；不实现配置中心、审批系统、secret provider、审计产品、rollback command 或任何运行实例。

## 1. Step 状态与门禁

| 项目 | 状态 |
|---|---|
| 当前 Step | `10 / change_audit_rollback` |
| Step 状态 | `completed / stop_review` |
| `gate_status` | `pass_with_upstream_blockers` |
| 前序门禁 | Step 1～9 均 `pass_with_upstream_blockers`；Step 9 已停审 |
| 正式 04 写入 | `false`；Step 15 前不得创建 `04-配置设计.md` |
| 允许的下一动作 | 更新 flow/ledger 后进入 Step 11；只创建 Step 11 唯一中间产物，不提前创建 Step 12～15 文件 |
| 实现 / 测试 / commit | `false / false / false` |
| 持续 blocker | `SYNC-UP-001~010`、`SYNC-LOCAL-001~005` 原样继承 |

本 Step 的通过只表示配置变更和回退规则具备可审查的设计边界；不表示审批、审计、rollback、restart、job run、provider rotation、adapter 健康、测试或任何外部系统已经存在或执行。文中 `approved candidate` / `approved ref` 仅指外部流程提供的、可作为新 cold composition 输入的配置候选或引用，不是 Review Gate accepted、Artifact、Baseline、evidence、signoff 或 readiness。

## 2. 本步目标、范围与非范围

### 2.1 本步目标

本 Step 必须闭合：

1. 谁可以在什么作用域提出配置变更，且不把 Sync 变成 Project、Artifact、Baseline、Review Gate、Workspace projection、Archive 或 Git remote 的授权者。
2. 42 个 leaf 的变更风险、评审要求、激活边界和回退路径；高风险与安全关键变更不得无评审、无审计、无回退。
3. startup/cold、job-run-start、entry-local、test harness 四类已存在生效方式的变更和失败回退语义；P0 `reload`/`hot` 继续 whole-request reject。
4. 变更审计只保存最小、可关联、经过裁剪的 metadata；不保存 raw secret、full sensitive ref、endpoint、路径正文、Git 输出、外部 payload 或 acceptance/readiness 声明。
5. sensitive opaque ref 轮换、profile/adapter 变更、redaction/digest 变更与在途 `runtimeBindingSnapshotRef` 的关系。
6. 每个变更族回指 Step 7 配置项、Step 8 敏感性、Step 9 生效方式，并预留 Step 11 失效承接而不提前伪造其结论。

### 2.2 本步不定义

- 具体工单、审批、IAM、值班、审计数据库、配置中心、KMS/Vault/credential broker 或部署系统；
- 具体变更命令、CLI flag、HTTP endpoint、package、parser、digest 算法实现或函数签名；
- P0 runtime reload、hot swap、online last-known-good、admin override、自动 restart 或自动 rollback；
- 外部副作用、Git commit、Review Gate、Artifact/Baseline、Workspace projection、Archive 或 owner truth 的回滚；
- Step 11 失效/降级矩阵、Step 12 下游测试验收承接、Step 13 迁移演进和 Step 14 风险总表；
- 任何实现、run、测试结果、artifact、report、evidence、review verdict、signoff 或 readiness。

## 3. 本步输入与权威边界

| 输入 | 权威级别 | 本 Step 承接内容 |
|---|---|---|
| `04_config_step_07_config_items.md` | 当前 04 直接输入 | 42 leaf 的 canonical path、required/nullability、scope、敏感标签、生效方式和失败策略 |
| `04_config_step_08_sensitive_secrets.md` | 当前 04 直接输入 | opaque ref、adapter-private resolution、禁止输出、rotation/no-hot 和 profile ceiling |
| `04_config_step_09_loading_validation_activation.md` | 当前 04 直接输入 | strict source、whole-candidate reject、builder gate、snapshot pinning、startup/job/entry/test/reload/hot 口径 |
| `03-详细设计.md` §10～§15 | 当前正式直接输入 | UoW/commit unknown、exact replay、error/recovery、redaction、runtime binding snapshot 和不可配置化边界 |
| `03_ddd_step_12_error_recovery.md` | 当前详细设计中间产物 | known/partial/unknown、rollback 只覆盖未提交 local write、外部 effect 不可回滚声明 |
| `03_ddd_step_15_observability_audit.md` | 当前详细设计中间产物 | technical signal 与 durable local traceability 分层、safe refs、telemetry failure isolation |
| Step 5/6 当前 04 产物 | 当前 04 直接输入 | source precedence、四个 P0 profile、future profile waiting |
| 配置 SOP/书写规范/中间产物规范 | 流程与结果规范 | 变更表、审计/回滚矩阵、逐类停审、跨变更审计和 03 影响判定 |

旧 README、旧 05/06、draft 和其他项目的审批字段或 rollback 产品只作 `historical_material`/框架参考，不成为 L5-sync 的变更真相。

## 4. SOP 问题回答

| 问题 | L5-sync 回答 |
|---|---|
| 哪些配置可以由谁变更？ | startup/cold candidate 只能由经过外部授权的配置维护者或 release automation 提出；job-run-start 只能由既有显式 job caller/runner 提交 run-local bounded input；entry-local 只能由当前 entry caller 提交；test harness 只能在 test composition 提交 deterministic fixture。具体身份和权限由 Identity/Work/部署 owner 判断，Sync 不本地授予 allow。 |
| 哪些配置变更需要评审？ | 任何改变 identity/profile、metadata/SDK/Git/filesystem/support/operations binding、redaction/digest、scope ceiling、concurrency、retention-like behavior、target/provider ref 或能力注册姿态的变更至少为 high；放宽安全红线、引入 raw material、hot/reload、隐式选择、owner/review/provenance override 一律 critical，P0 reject 或回流正式设计。仅在已批准范围内收窄 timeout/limit/job budget 可按 low/medium 处理，但仍需安全审计。 |
| 变更如何生效？ | 只通过 Step 9 已定义的 cold new composition/restart、new job-run pin、current-entry validation 或 test harness rebuild 生效。没有 P0 online reload/hot path；旧 composition 和在途对象不被原地改写。 |
| 变更如何记录审计？ | 使用产品中立的 opaque change/actor/reason/reviewer/rollback/issue refs，加上 section、risk class、activation kind、redacted canonical digest、validation disposition 和 bounded timestamp/context。字段是审计载荷候选，不是新增 03 DTO、Port 或 durable truth object。 |
| 变更失败或效果异常如何回滚？ | 候选校验失败时不激活、不暴露新 facade；startup 变更需显式恢复到上一份 approved/validated candidate 并重新 cold compose/restart；job 失败只结束当前 run 并以新授权 run 处理；entry/test 失败只拒绝并重试当前边界。不能回滚已发生的 SDK/Git/filesystem effect、外部 Review、平台 truth 或用户修改，也不能以新 key 盲重放 unknown effect。 |
| 每个可变更项是否回指 Step 7/8/9/11？ | 是。§8.3 以九个 raw section 逐组回指 Step 7/8/9，并把失效处置明确标为 Step 11 handoff；不提前填入 Step 11 未完成的告警或降级结论。 |
| 每类变更是否逐类停审？ | 本文件 §8.7 对 identity/profile、limits/budgets、metadata、SDK、local tools、support、operations、critical reject 分别停审；每类都检查权限、评审、激活、审计、回退和敏感泄露。 |
| 是否存在高风险无评审/无审计/无回退或敏感泄露？ | 当前设计审计未发现 unresolved 缺口。所有 high/critical 类均要求评审或 reject、safe audit 和显式 rollback posture；具体审批产品、digest 算法和 provider rotation API 保持 pending，不伪造为已存在。 |

## 5. 当前文档问题诊断与设计取舍

### 5.1 当前问题诊断

| 观察到的缺口 | 风险 | 本 Step 的收敛方式 |
|---|---|---|
| Step 7/9 已规定来源和生效，但没有谁能提出变更 | 任意 entry 或 adapter 可能自行改写 raw config | 将 actor 作用域分为 startup maintainer/release、job-run caller、entry caller、test harness；所有权限仍由外部 owner 证明 |
| Step 8 有 ref-only 边界，但变更审计容易记录 full ref | endpoint、路径拓扑或 credential identity 可能泄露 | 审计只保存 section/slot、redacted digest、issue/change marker；full ref 永不进入 telemetry/report |
| P0 无 hot，但“回滚”容易被解释成在线切换 | 可能出现半装配 graph 或 old snapshot rebinding | 回滚是显式恢复旧 approved candidate 后重新 cold compose/restart；不提供 LKG/hot/自动切换 |
| local effect、review handoff 和 config activation 的 rollback 被混在一起 | 可能误称外部副作用已回滚 | 明确配置回退只控制后续 composition；已发生 effect 按 03 unknown/probe/manual 规则处理，不能声明外部 rollback |
| job-run-start/entry-local 可能被当成全局配置修改 | 运行中的 job 或 caller 可扩大 scope、改变 actor 或 idempotency | 仅允许 bounded pin/selector，stored result/report/old snapshot 不可改写 |
| “审计成功”可能被误读为 review accepted/evidence/readiness | 结果层和证据边界升格 | 审计记录只是安全变更关联，不是 Artifact、Baseline、Review Decision、evidence、signoff 或 readiness |

### 5.2 设计取舍

| 议题 | 采用方案 | 不采用方案 | 取舍理由 |
|---|---|---|---|
| 审批载体 | 产品中立的 opaque refs 和 risk class | 指定 ticket/approval 产品或字段 | 上游产品尚未确认；保留可替换边界 |
| 高风险判定 | 按配置族、扩权/放宽、外部拓扑和敏感性分级 | 只按“是否改数字”分级 | binding/ref/redaction 变化比普通阈值更可能改变安全语义 |
| 审计内容 | allowlisted section、risk、redacted digest、safe issue/change/rollback refs | 完整 diff、full ref、raw config/body | 满足追溯同时避免泄露和高基数扩散 |
| startup rollback | 旧 approved/validated candidate + 新 cold composition/restart | 在线回切、部分 graph 复用、自动 last-known-good | P0 没有 reload/rollback contract；保持 snapshot 不可变 |
| job rollback | reject 当前 run；新授权 run 使用明确输入和新 run identity | 修改旧 report、接管 in-flight key、换 key 盲重放 | 保留 exact replay/idempotency/unknown 语义 |
| sensitive rotation | 新 opaque ref + 新 composition；在途对象继续旧 snapshot | 原地替换 provider、重写旧 attempt、自动重提 handoff | 防止 credential 变更改变历史语境或重复副作用 |
| critical override | whole-candidate reject 或正式设计回流 | emergency flag、warning 后继续、fallback fake | 安全和 ownership 红线不可配置化 |

## 6. 结构化中间产物

### 6.1 变更 actor、权限边界与评审层级

| actor / role ref | 允许提出 | 不允许提出或执行 | 最低审计关联 |
|---|---|---|---|
| `config_maintainer_ref` | startup/cold candidate 的普通 leaf、profile、binding ref 和 approved source 变更 | 绕过 loader/validator、直接修改 owner truth、写 raw secret、启用 hot/reload | actor、change ref、reason ref、candidate digest、validation issue |
| `release_automation_ref` | 将已评审 candidate 送入 cold composition/restart 流程，记录 validation/activation 结果 | 自动批准 high/critical；以部署成功替代 capability/readiness | release/change ref、old/new digest、activation disposition |
| `authorized_job_caller_ref` | 当前显式 job 的 bounded batch/parallel/target/replay input；只能收窄 startup ceiling | 修改全局 candidate、actor/project/version/source authority、idempotency key/digest、旧 report | job run ref、input digest、profile class、validation result |
| `entry_caller_ref` | 当前 entry 已定义的 selector、scope、target、path、conflict/resume input | 把 selector 写回全局 config、扩大 scope、绕过 permission/dirty/path/state guard | entry/correlation ref、selector/input digest、rejection issue |
| `test_harness_ref` | `ci-test`/显式 test composition 的 fixed Clock/ID/Digest、fake refs、脱敏 fixture | 将 fake/fixture 注入 production-like、生成 integration evidence/readiness | test composition ref、fixture digest、profile class |
| `design_change_reviewer_ref` | 评审会改变 03 runtime/builder/Port/error/state/flow 或禁止边界的正式设计变更 | 直接让 critical runtime candidate 生效 | design-change ref、review marker、new baseline reference（若未来存在） |

权限边界说明：以上 role ref 只描述配置入口的预期 caller，不证明真实身份系统已授予权限。最终 allow/deny、ProjectMember、archived posture 和 operator policy 仍由上游 owner/部署流程决定；Sync 不把 role ref 当作本地授权事实。

| 风险层级 | 适用变更 | 评审与生效门禁 |
|---|---|---|
| `low` | 已批准范围内仅收窄 `boundary.*`、单次 timeout 或 job batch/parallel；不改变 profile、binding、redaction、ownership、scope ceiling | 至少 validation pass + actor/change marker；按 startup restart、new job run 或 current-entry 生效；仍记录 audit |
| `medium` | P0 profile 语境、test-only refs、可控 local adapter ref、非安全关键 diagnostics/clock/id provider ref、普通预算 widening（若允许） | reviewer/change ref + validation pass；startup 变更必须新 composition；不得将 fake 提升真实 capability |
| `high` | `identity.*`、metadata refs、SDK/credential/owner/source/handoff/probe refs、Git/fs/root-policy refs、digest refs、operations slots、scope/concurrency ceiling，以及任何会改变既有 retention/idempotency 语义的候选变更 | 明确评审、safe audit、rollback plan、cold activation；依赖未闭合时保持 blocked/unknown，不 fallback fake |
| `critical` | redaction 放宽、raw secret/body、implicit selection、owner/review/provenance/state/UoW/idempotency/query-write override、auto merge/rebase/push/stash、hot/reload、production-like fake | P0 whole-candidate reject；若需求真实改变，回流 00～03/上游 owner，不能作为普通配置变更 |

### 6.2 42 leaf 的变更控制分组

| 配置域（leaf 数） | 覆盖的 canonical leaf | 默认风险 | 允许的变更形态 | 明确禁止 |
|---|---:|---|---|---|
| `identity`（2） | `configRef`、`profileRef` | high | 新 candidate + canonical validation + cold composition；entry selector 只能当前入口 | 从路径/Project/version/source/target 隐式生成；用 profile 绕过 owner/permission |
| `boundary`（5） | `maxRequestBytes`、`maxPageItems`、`maxPathScopeItems`、`maxTargetScopeItems`、`maxDiagnosticItems` | low（收窄）/high（放宽） | validator 范围内的显式变更；job/entry 只能收窄，不写回 startup | zero/infinite/clamp-as-success、dirty/path/lock bypass、scope implicit expansion |
| `execution`（8） | `localReadTimeout`、`localCommitTimeout`、`metadataLockAcquireTimeout`、`sdkReadTimeout`、`externalEffectTimeout`、`localToolEffectTimeout`、`shutdownTimeout`、`maxConcurrentMutations` | low（预算）/high（并发放宽） | 新 cold composition；run-local 不改变 effect semantics | generic retry、timeout-as-not-happened、替代 lock/version 或 unknown recovery |
| `jobs`（2） | `maxBatchItems`、`maxParallelItems` | low/medium | startup baseline 或显式新 job run 的 bounded lower value | 中途扩大 scope、生成 actor/key/schedule、接管旧 in-flight run |
| `metadata`（3） | `storeAdapterRef`、`unitOfWorkAdapterRef`、`lockAdapterRef` | high | 新 opaque ref + independent validation + cold composition | 选择 physical `.qs-sync` schema、删除 provenance、last-write-wins、hot replace |
| `sdk`（7） | `sdkProfileRef`、`credentialProviderRef`、`ownerAccessAdapterRef`、`materialSourceAdapterRef`、`reviewHandoffAdapterRef`、`reviewDecisionReadAdapterRef`、`recoveryProbeAdapterRef` | high | 新 ref + profile compatibility + cold composition；provider rotation 只在 adapter-private contract 内 | raw credential/endpoint/body、local permission/source authority、ACK=accepted、盲重提 |
| `localTools`（5） | `gitObservationAdapterRef`、`gitWorktreeAdapterRef`、`filesystemInspectionAdapterRef`、`filesystemApplyAdapterRef`、`allowedTargetRootPolicyRef` | high | 新 typed ref + root/dirty/path/symlink/non-overwrite validation + cold composition | arbitrary shell/argv/remote/refspec、merge/rebase/push/stash、覆盖 dirty worktree、LFS/shallow/GUI flag |
| `support`（6） | `diagnosticsAdapterRef`、`redactionPolicyRef`、`clockAdapterRef`、`idAdapterRef`、`digestAdapterRef`、`digestAlgorithmRef` | high（redaction/digest）/medium（provider） | 新 ref + safe constructor validation + cold composition；test deterministic 仅 test harness | 放宽 deny list、高基数 raw label、重算旧 digest/ID、sink receipt=business proof |
| `operations`（4） | `accessOrPostureConsumerRef`、`materialSourceConsumerRef`、`reviewDecisionConsumerRef`、`jobRunnerRef` | high | `null`↔合法 opaque ref 仅在 formal contract/capability 允许时 cold registration | 以 ref 创建 topic/schema/daemon/schedule/actor/scope/key，或把 registration 当 bound/ready |

分组覆盖计数固定为 `2+5+8+2+3+7+5+6+4=42`。变更控制分组不会新增 leaf，也不改变 Step 7 的 source precedence 或 Step 9 activation kind。

### 6.3 变更总表（按生效边界）

| 变更类型 | 发起方 | 评审要求 | 生效方式 | 审计记录最小集 | 回滚 / 失败姿态 |
|---|---|---|---|---|---|
| 普通 startup leaf 收窄（boundary/timeout/job budget） | maintainer / release automation | low；仍需 validator 与 safe audit | 新 candidate → strict load/validate → cold composition/restart | section、risk、actor/change/reason refs、old/new redacted digest、validation result | invalid 不激活；显式恢复上一份 approved candidate 后重新 compose；不在线 patch |
| startup leaf 放宽或改变并发/作用域 | maintainer / release automation | high；需 reviewer/reason/rollback plan | 同上；不支持 hot | scope class、old/new digest、review marker、activation disposition | 失败不暴露新 graph；放宽若触及 hard boundary 直接 reject；不以 fallback fake 通过 |
| identity/profile 变更 | config maintainer / release automation | high；profile compatibility 与 owner boundary 审查 | 新 composition；entry selector 只 current entry | profile class、identity/selector safe digest、validation issue/change refs | current entry/startup reject；旧在途对象继续原 snapshot；不改历史 operation |
| metadata adapter/UoW/lock ref 变更 | config maintainer / release automation | high；三 slot 独立 capability 评审 | cold composition/restart | slot class、old/new ref digest、capability posture、rollback ref | required contract 缺失则 no mutation graph；恢复旧 approved refs 后 restart；不迁移/删除旧 metadata |
| SDK/provider/owner/source/handoff/Decision/probe ref 变更 | config maintainer / release automation | high；上游合同与敏感边界审查 | cold composition/restart；新 job 才 pin target | slot、profile class、old/new redacted digest、blocker/issue ref | affected route blocked/unknown；旧 attempt 不换 ref/不重提；不把 resolver success 当授权 |
| Git/filesystem/root policy ref 变更 | config maintainer / release automation | high；non-overwrite/dirty/path/symlink 评审 | cold composition/restart | slot/policy class、safe digest、validation/capability disposition | unsafe/unknown 不 apply；旧 working copy/history 不覆盖；新 composition 失败则保留旧设计姿态 |
| diagnostics/redaction ref 变更 | config maintainer / release automation | high；移除 deny 规则为 critical | cold composition/restart | policy class、added/removed safe digest、review/reason refs、validation result | unsafe change reject；sink failure 不触发业务 rollback；不输出 matched raw value |
| digest/clock/id provider ref 变更 | maintainer / test harness | medium；digest algorithm 变化按 high | cold composition 或 test rebuild | provider class、compatibility result、profile、old/new safe digest | 不重算旧 id/digest/truth；不兼容则 no composition；旧 snapshot 保持 |
| operations slot `null`/ref 变更 | maintainer / release automation | high；formal consumer/job contract 必须存在 | cold conditional registration；显式 job run pin | slot、null/non-null class、contract/capability disposition | null 保持未注册；blocked 不升级；不启动 daemon/scheduler，不改变 core truth |
| job-run-start bounded override | authorized job caller | low/medium；只允许 startup ceiling 内收窄 | 当前新 run 冻结 | run ref、input digest、snapshot ref、validation result | current job rejected；新授权 run；旧 report/attempt immutable |
| entry-local selector/target/path/resume input | entry caller | low if protocol-defined；安全边界冲突为 high/reject | current entry only | entry/correlation ref、input class/digest、rejection issue | current entry rejected；caller重新提交；不写回 global config |
| test fixture/deterministic provider | test harness | medium；profile isolation | test composition rebuild | test ref、fixture digest、profile/test-double marker | test composition fail-fast；不得进入 production-like 或生成 integration evidence |
| critical hard-boundary attempt | any source | critical; no approval can make it ordinary P0 config | no activation | safe forbidden-class/issue ref（若可安全记录） | no rollback; requires formal design/owner change;不执行外部 effect |

### 6.4 变更审计记录规则

审计记录是配置治理的安全关联材料，不是新的 Project/Artifact/Baseline/Review Gate/Decision/Workspace/Archive/Git truth，也不是 `03` 尚未定义的 public DTO。实现时可由既有 safe diagnostic / local traceability seam 承接；若需要新增 durable carrier，必须先回流 03。

| 字段类别 | P0 规则 | 允许携带 | 永久禁止 |
|---|---|---|---|
| 变更关联 | high/critical 必须有可追踪的 `changeRef`；low 可由受控 release/entry/run ref 关联 | opaque change/release/entry/job/test ref、bounded correlation ref | 工单正文、自由文本审批内容、credential |
| 发起与评审 | 记录 caller/automation/reviewer 的 opaque role/ref 类别；不把它当本地授权证明 | actor class、review marker、reason ref、approval disposition class | principal body、token、个人敏感资料 |
| 配置范围 | 记录 raw section、leaf class、risk class 和 activation kind | `identity`、`boundary`、`execution`、`jobs`、`metadata`、`sdk`、`localTools`、`support`、`operations` 等 closed section/slot code | raw document、未裁剪 key path、full endpoint/path |
| 旧新值关联 | 只记录经过批准的 canonical/redacted digest 或 value class | old/new digest、numeric class、null/non-null class、profile class | full sensitive ref、secret、完整 diff、原始数字序列（若会泄露策略） |
| 校验结果 | 记录 source/parse/type/cross-field/sensitive/hard-boundary 的安全分类 | `validated`、`rejected`、`failed_validation`、`unsupported_activation` 等 closed disposition、issue ref | raw invalid value、parser dump、stack、provider response |
| 生效结果 | 区分 candidate validation-pass-for-composition、composition blocked、facade not exposed、job/entry rejected；不使用模糊 success | activation kind、composition/snapshot class、capability posture、safe diagnostic ref | `ready`、`accepted`、`approved`、`evidence`、`signoff`、`readiness` claim |
| 回退关联 | high 变更或失败尝试必须能关联 rollback intent；不是自动执行证明 | rollback/change ref、previous approved candidate class、new composition marker | rollback script、secret、完整旧配置、外部 effect 回滚声称 |
| 时间与顺序 | 只需 bounded observed time / ordering marker；具体时钟来源仍走 support binding | bounded timestamp class、sequence/correlation ref | 以日志时间推导 external effect、Git/source version 或 owner truth |

审计写入规则：

1. 先完成 validation 和 redaction，再创建 safe audit record；不得先序列化完整 candidate/object 再删除敏感字段。
2. source validation 失败可以产生最小技术 signal/issue marker，但不能伪造“变更已应用”的 durable audit；只有既有 local contract 允许的成功/拒绝记录才能进入对应 owning store。
3. audit sink 不可用时，不得回滚或重放配置/业务 effect；应保持既有 change outcome 和 safe degraded signal 语义，具体失效处置留 Step 11。
4. 审计记录不得写入 `.qs-sync` protected provenance、operation result、job report 或 Review/Artifact carrier，除非未来正式合同明确其 owning boundary；当前只保留关联 ref/marker 的设计要求。
5. `old_config_digest` / `new_config_digest` 不是 Artifact/Baseline digest；不能用于声明平台版本、内容证据或 review accepted。

### 6.5 生效边界与回滚规则矩阵

| 生效边界 | 变更成功判定 | 失败 / 异常判定 | 回滚或后续动作 | 不允许的动作 |
|---|---|---|---|---|
| startup/cold composition | selected candidate 通过 Step 9 全部校验；新 composition 完成既有 builder 顺序；facade 暴露门禁满足 | source/parse/type/cross-field/sensitive/hard-boundary reject；required binding 缺失；snapshot/graph 未完成；required route blocked | 不激活新 candidate；若外部已提供上一份 approved candidate，由 operator/release 流程显式选择其 ref/digest，再重新 load/validate/compose；记录 new attempt/rollback marker | 自动 last-known-good、原地 patch、半装配 facade、用低优先级 fallback、把旧 snapshot 改成新 config |
| startup 后发现 safe configuration anomaly | composition 已建立但发现与批准 candidate/digest 不一致或安全策略漂移 | anomaly 只影响当前 composition；不得推断外部 effect 或 readiness | 停止新入口、显式选择上一份 approved candidate 或修正 candidate 后重新 cold compose；在途对象继续原 snapshot | 运行中换 adapter/ref、覆盖 dirty worktree、自动迁移/删除 metadata |
| job-run-start | run-local input 在 startup ceiling 内通过 validation，并固定到该 run context | target/scope/batch/parallel/replay ref 非法、profile 不相容、required capability blocked | 只拒绝当前 run；用新 run ref 和已批准输入重新提交；既有 run/report/attempt 不改写 | 接管 in-flight run、重用不同 digest 的 key、扩大全局 config、把 partial report 改成 complete |
| entry-local | 当前显式 selector/request 通过既有 command/query/path/permission/state guards | selector/source/target/path/conflict/resume 输入非法或安全状态 unknown | 拒绝当前 entry；caller 可在新 entry 里提供修正/上一份选择；Query 保持 zero-write | 把 entry selector 写回 global config、猜 latest/default、通过日志/缓存补权限 |
| test harness | test-only composition 和脱敏 fixture 通过 deterministic validation | fixture/ref/clock/id/digest 不一致、production-like profile 注入 test double | 终止当前 test composition；选择上一份 test fixture 或修正后重新组装；不影响 production-like composition | 将 fake 变为 bound、生成 integration evidence/readiness、写平台 truth |
| reload request | N/A（P0 unsupported） | 任何 reload source/key/activation request | 生成 safe unsupported issue；保持当前 composition/snapshot 不变；由显式 startup restart 流程处理 | online LKG、部分替换、旧对象 rebinding |
| hot request | N/A（P0 unsupported） | 任何 hot flag/adapter swap/redaction relax | whole-request reject；不产生新 facade 或业务副作用 | emergency flag、无审计切换、回滚到未知状态 |
| sensitive ref rotation | 新 ref 通过 Step 8/9 shape、profile、capability 和 redaction 校验 | resolver unavailable、ref malformed、contract blocked/unknown 或 rotation attempt 泄露材料 | 新 ref 仅进入新 cold composition；旧 operation/plan/candidate/attempt 继续旧 `runtimeBindingSnapshotRef`；若新 composition 失败，保留旧 composition，显式修正后再试 | 原地替换 snapshot、复制 raw material、因 rotation 盲重提 unknown handoff/apply |
| critical hard-boundary request | N/A | raw secret/body、owner override、auto merge/rebase/push、provenance delete、query write、implicit selection 等 | no activation；记录 safe issue/change trigger；需求改变时回流 00～03/owner contract | “批准后强制执行”、warning 后继续、fallback fake/cache |

回滚含义限制：本矩阵只描述配置 candidate/composition/run/entry/test 语境的恢复。它不声明能够撤销已发生的 SDK、Git、filesystem、Review handoff 或用户工作区 effect；这些仍按 03 的 known/partial/unknown、checkpoint、probe、manual resolution 和 non-overwrite 规则处理。

### 6.6 敏感与安全关键配置的变更附加规则

| 配置族 | 允许的变更 | 轮换 / 生效 | 审计最小集 | 禁止行为 |
|---|---|---|---|---|
| `identity.configRef` / `identity.profileRef` | 新 candidate identity/profile，且 canonical/profile compatibility 通过 | 新 cold composition；旧 operation/attempt 不换 profile/snapshot | section/slot、profile class、old/new redacted digest、validation/activation disposition | 用 profile 选择 Project/version/source/target；记录 full identity |
| `metadata.*AdapterRef` | 新 opaque store/UoW/lock ref；三 slot 独立验证 | restart/new composition；旧 `.qs-sync` history、UoW、lock、provenance 不迁移或删除 | slot class、old/new ref digest、capability posture、rollback marker | 物理 schema/DSN 写入审计、hot replacement、last-write-wins |
| `sdk.credentialProviderRef` 与 SDK slots | 新 approved opaque provider/adapter ref；raw material 仍 adapter-private | 新 composition/restart；在途 handoff/attempt 继续旧 snapshot | slot、provider class、old/new redacted digest、safe outcome/issue ref | raw token/cert/private key、provider response、fallback fake、换 key 重提 |
| owner/source/handoff/Decision/probe refs | 合同已闭合时的 ref replacement；当前 blocker 下只保留 blocked/unknown | 新 composition；旧 route/attempt 不重绑 | capability/contract posture、blocker ref、change marker | 本地授权、source authority、ACK/Decision/readiness override |
| Git/fs/root-policy refs | 新 typed adapter/root policy ref，安全校验通过 | 新 composition/restart；dirty worktree 和旧 local history 不覆盖 | tool slot、root policy class、safe digest、capability disposition | raw path/argv/shell/remote、merge/rebase/push/stash、删除用户修改 |
| `support.redactionPolicyRef` | 只能收紧 deny policy；移除 deny class 视 critical | 新 composition/restart；不 hot relax | policy class、added/removed safe digest、review/reason marker | 让 sink 自行清洗、记录匹配 raw value、开启高基数原文标签 |
| `support.digest*` / clock / ID refs | 新兼容 ref；algorithm 变化需 high review | 新 composition/test rebuild；既有 ID/digest/truth 不重算 | provider/algorithm class、compatibility result、profile、change marker | 把 Git commit/时间/随机值当 ID 或 digest；重算旧 idempotency truth |
| `operations.*` nullable refs | `null` 与合法 ref 的显式变更，仅在 formal contract/capability 允许时 | cold conditional registration；旧 consumer/job 不热换 | slot、null/non-null class、registration disposition | 私造 topic/schema/schedule/daemon、将 registration 当 bound/ready |

共同规则：任何 sensitive ref 变更都不得把 full ref、endpoint、route、root path、provider body 或 secret material 写入 candidate audit、telemetry、`.qs-sync`、job report 或 error surface；只可使用 approved redacted digest/issue/change marker。

### 6.7 配置变更停审记录

| 配置域 / 变更类型 | 权限边界 | 评审 | 生效 / 回退 | 敏感与结果边界 | 03 影响 | 停审结论 |
|---|---|---|---|---|---|---|
| `identity` / profile | caller 只提交 candidate/selector；Sync 不本地授权 | high；profile conflict 或 implicit selection reject | cold new composition；entry conflict reject；旧 snapshot 不变 | 不输出 full identity；不改变 owner selection | 只承接既有 refs/snapshot | 通过（带上游 blocker） |
| `boundary` / `execution` | maintainer/release；job 只能收窄 | low for bounded narrowing；high for widening/concurrency | restart/new run/current entry；invalid 不激活 | 数值以 class/digest 记录；不改 timeout result semantics | 只承接 limits/budgets | 通过（带上游 blocker） |
| `jobs` | job caller 只提供 run-local bounded input | low/medium；不得扩大 startup ceiling | new run pin；旧 report/run 不改 | run/input digest，no key/actor synthesis | 只承接 `SyncJobBudgets` | 通过（带上游 blocker） |
| `metadata` | config maintainer/release；三 slot 分开 | high；physical schema/provenance delete 是 critical | cold restart；失败无 mutation graph；旧 metadata history 保留 | ref-only；不记录 DSN/body | `SYNC-UP-006` 保持 | 通过（带 `SYNC-UP-006`） |
| `sdk` | config maintainer/release；provider material adapter-private | high；上游合同不闭合则 blocked/unknown | cold restart；旧 handoff/attempt 不重绑 | raw secret/body 永禁；ACK 不升格 | `SYNC-UP-001~005/008` 保持 | 通过（带上游 blocker） |
| `localTools` | config maintainer/release；entry target/path 仍显式 | high；unsafe policy critical | cold restart/current entry；dirty/unknown 不 apply | 无 raw path/argv/remote；不覆盖用户修改 | `SYNC-UP-007/009/010`、`SYNC-LOCAL-*` 保持 | 通过（带上游 blocker） |
| `support` / redaction / digest | maintainer/release；test deterministic 仅 test harness | high；redaction relax/digest semantic change critical/high | cold restart/test rebuild；sink failure 不改业务结果 | safe record only；不生成 evidence/readiness | 只承接 support/redaction | 通过（带上游 blocker） |
| `operations` slots | maintainer/release；formal contract/capability 前不注册 | high；null/non-null 不等 bound | cold conditional registration；blocked 保持 | 不创建 topic/schedule/daemon/actor/scope/key | 无新增 consumer/job contract | 通过（带上游 blocker） |
| sensitive ref rotation | approved caller/provider owner；Sync 不接触 raw material | high；provider product/API 未锁定 | new composition；在途对象旧 snapshot | digest/marker only；不重提 unknown effect | 未来 provider contract 才可能回写 | 通过（当前 blocked/unknown） |
| critical hard-boundary attempt | any source | critical reject / design change | no activation/no rollback | only safe forbidden issue | 若要改变须回流 00～03 | 通过（reject） |

逐域停审结论：每个变更族均明确了 caller 作用域、风险层级、评审门禁、activation kind、audit 最小集、回退姿态和敏感输出边界；不存在以配置变更夺取 owner truth、以 rollback 删除 provenance、或以审计/ACK/本地结果宣称 accepted/readiness 的路径。

### 6.8 跨变更审计 / 回滚审计表

| 审计项 | 结论 | 证据 / 修正 |
|---|---|---|
| 每个可变更 leaf 是否回指 Step 7 来源、scope、生效、失败策略 | 通过 | §6.2 按 42 leaf 分组，§6.3 按 activation boundary；Step 7 是唯一字段清单 |
| sensitive/ref-bearing leaf 是否回指 Step 8 存储、轮换、禁止输出 | 通过 | §6.6 与 Step 8 ref-only/adapter-private 规则一致 |
| 每个变更是否回指 Step 9 loader/validation/activation | 通过 | 仅允许 new cold composition、new job pin、entry/test rebuild；reload/hot reject |
| Step 11 失效承接是否被提前伪造 | 无 | 本 Step 只登记失败/回退接口和 handoff；不写告警、降级或测试结果 |
| 高风险配置是否都有评审要求 | 通过 | identity、metadata、SDK、localTools、support/redaction/digest、operations、scope/retention 等均 high/critical |
| 高风险配置是否都有安全 audit | 通过 | §6.4 只允许 section/risk/actor/reviewer/digest/issue/rollback refs |
| 高风险配置是否都有回退姿态 | 通过 | startup restore+restart；job new run；entry reject/rerun；test rebuild；critical no activation |
| 是否假定具体工单/审批/审计产品 | 未假定 | 只使用产品中立 opaque refs 和 closed classes |
| 是否可能泄露 raw secret/full sensitive ref/endpoint/path/body | 不允许 | full value 永不进 audit/log/report/metadata；只保留 redacted digest/marker |
| 是否把 old/new digest 当 Artifact/Baseline 或 evidence | 不允许 | digest 只关联配置 candidate；明确不构成平台 truth |
| startup rollback 是否提供 online LKG/hot patch | 不允许 | 只允许显式 previous approved candidate + new cold composition/restart |
| job rollback 是否修改旧 report、接管旧 key 或换 key 重放 | 不允许 | stored report/attempt immutable；新授权 run 使用新 run identity |
| external SDK/Git/fs/Review effect 是否宣称可回滚 | 不允许 | 只按 03 known/partial/unknown/probe/manual；配置回退不撤销外部 effect |
| entry-local 是否持久化覆盖 global config | 不允许 | current entry only；selector/input rejected or rerun |
| test fake 是否进入 production-like 或生成 integration evidence | 不允许 | test composition isolation；capability ceiling 保持 |
| critical override 是否可用 emergency flag 通过 | 不允许 | whole-candidate reject；需求变化必须回流正式设计 |
| 是否需要回写 03 | 当前无 | 只细化变更治理；future config center/hot/secret API/new audit carrier 才触发回流 |

跨变更审计结论：没有 unresolved 的高风险评审、敏感泄露、回退路径或结果层升格缺口。具体审批主体、审计存储、digest 算法和 provider rotation 合同仍是 pending，不影响当前 P0 变更边界设计。

## 7. 对详细设计的影响判定

| 配置结论 | 是否影响 03 | 影响类型 | 03 回写位置 | 处理状态 |
|---|---|---|---|---|
| 变更 actor/评审使用产品中立 opaque refs，不把 caller 当本地授权 | 否 | 配置治理/外部权限边界 | 不适用 | 无回写 |
| high/critical 变更必须审计、评审和 rollback posture | 否 | 配置变更控制面 | 不适用 | 无回写 |
| startup rollback 只恢复 previous approved candidate 后重新 cold compose/restart | 否 | 承接 Step 9 immutable snapshot 和 03 builder 顺序 | 不适用 | 无回写 |
| job-run-start/entry-local/test 只影响当前 run/entry/composition，旧 carrier 不改写 | 否 | 承接 03 idempotency/report/snapshot pinning | 不适用 | 无回写 |
| sensitive ref 只以 redacted digest/marker 审计，raw material adapter-private | 否 | 承接 Step 8/03 redaction boundary | 不适用 | 无回写 |
| 配置回退不声明撤销 SDK/Git/fs/Review 外部 effect | 否 | 承接 03 effect unknown/probe/manual recovery | 不适用 | 无回写 |
| 若未来引入 config center/admin override/hot reload/online LKG/secret rotation API 或新的 durable change-audit carrier | 是（未来触发） | 会改变 loader、builder、adapter lifecycle、audit/error/rollback contract | `03` §13～§15、Step 12/14/15 及上游 owner contract | 阻塞待确认（未来变更；当前不进入正式 04） |

当前计数：`待回写=0`；`阻塞待确认=0`（最后一行是未来触发条件，不是当前待回写项）。`SYNC-UP-001~010` 与 `SYNC-LOCAL-001~005` 继续保持原状态。

## 8. 回填草稿（未来正式 `04-配置设计.md` §10）

> 校准来源：
> - `design-calibration/04_config_step_10_change_audit_rollback.md`
>
> 延伸阅读：
> - 建议继续阅读本文件的“变更 actor、权限边界与评审层级”“42 leaf 的变更控制分组”“变更总表（按生效边界）”“变更审计记录规则”“生效边界与回滚规则矩阵”“敏感与安全关键配置的变更附加规则”“配置变更停审记录”和“跨变更审计 / 回滚审计表”。

正式 §10 应按以下顺序回填：

1. 先声明 P0 只支持 cold new composition/restart、new job-run pin、current-entry reject/rerun、test composition rebuild；reload/hot whole-request reject。
2. 回填 §6.1 actor/role 与 low/medium/high/critical 风险层级，保留“role ref 不等于 local authorization”。
3. 回填 §6.2/§6.3，确保 42 leaf 的变更族、发起方、评审要求、activation、audit 最小集和 rollback/失败姿态逐项可追溯到 Step 7～9。
4. 回填 §6.4 审计字段边界；只写 allowlisted section、risk、opaque refs、redacted digest、validation/activation/rollback disposition；不得写 raw config、secret、full ref、endpoint、path/body。
5. 回填 §6.5/§6.6，明确配置回退不等于外部 effect rollback，不改写旧 operation/plan/candidate/attempt 或用户 dirty worktree。
6. 回填 §6.7/§6.8 和 03 影响判定；Step 11 只接收失效入口，不在 §10 伪造告警、降级、run、测试或 readiness。

正式正文不得：

- 指定未核验的工单、审批、审计、secret provider、部署或 rollback 产品；
- 把 previous digest、audit receipt、local commit、job report、ACK 或 telemetry 当 Artifact/Baseline/Review accepted/evidence/readiness；
- 暗示在线 LKG、hot adapter replacement、自动 restart/rollback、blind retry、自动 merge/rebase/push/stash 或 dirty overwrite；
- 通过 job/entry/test caller 改写 global config、actor、scope、idempotency、UoW、state、provenance 或 owner truth；
- 把 `blocked/unsupported/unknown` 或 test fake 变成 `bound`、健康或授权。

## 9. 待确认事项与当前处理

| 待确认事项 | 影响 | 当前处理 |
|---|---|---|
| 未来审批/工单/审计产品及 `changeRef` 解析 | 变更关联载体 | P0 只保留 opaque refs/closed classes；不指定产品 |
| redacted canonical digest 算法 | old/new candidate 关联与比较 | 只要求稳定、不可泄露、可关联；算法留实施规范/未来 03 回写，不写实现事实 |
| previous approved candidate 的保留、选择与恢复载体 | startup rollback 运维流程 | 只定义显式选择旧 approved/validated candidate + cold restart；物理保存/命令留部署/运维文档 |
| secret provider rotation API 与 zero-downtime 需求 | adapter lifecycle、snapshot pinning、rollback | P0 ref replacement + cold composition；future provider contract 先回流 03 |
| exact permissions for config maintainer/release/job caller | actor authorization | Sync 不本地授权；由 Identity/Work/部署 owner 确认，当前只记 role/ref class |
| audit sink / `.qs-sync` owning store | durable audit visibility | 只规定 safe audit payload boundary；不新建 audit truth 或物理 metadata schema |
| whether numeric widening requires human reviewer | risk policy | 当前 widening high；具体审批门禁可在后续运维/实施文档细化 |
| Step 11 告警、降级、config drift detection | failure behavior | 本 Step 只留 handoff；Step 11 逐项定义，不提前宣称 |
| formal Consumer/Job registration contracts | operations rollback/registration | nullable/blocked；不因变更审计创建 topic/daemon/scheduler |

这些事项属于后续 owner/实施/Step 11～14 输入，不构成当前 Step 的 unresolved 设计缺口；若任何事项要求新增 runtime type/Port/DTO/error/state/flow/durable carrier，必须先回流 03。

## 10. Step 10 自检与进入下一步门禁

| 检查项 | 结果 | 依据 |
|---|---|---|
| 已回答 SOP Step 10 八个问题 | pass | §4；覆盖权限、评审、激活、审计、回退、逐项回指、逐类停审和跨变更审计 |
| 42 leaf 均有变更族与风险姿态 | pass | §6.2；计数 `2+5+8+2+3+7+5+6+4=42` |
| 变更 actor/权限边界产品中立且不伪造本地授权 | pass | §6.1 |
| low/medium/high/critical 评审层级可判定 | pass | §6.1；critical hard-boundary 直接 reject/设计回流 |
| startup/job/entry/test/reload/hot 变更生效与回退闭合 | pass | §6.3、§6.5；P0 reload/hot unsupported |
| sensitive ref 轮换、redaction、digest、provider boundary 无泄露 | pass | §6.4、§6.6；只保留 redacted digest/marker |
| 高风险配置均有评审、safe audit 与 rollback posture | pass | §6.7、§6.8 |
| 配置回退未被误写为外部 effect / platform truth 回滚 | pass | §5.1、§6.5、§8 |
| job/entry/test 不可覆盖 global invariant 或旧 carrier | pass | §6.3、§6.5 |
| Step 7/8/9 回指完整，Step 11 未被提前伪造 | pass | §6.3、§6.8、§9 |
| 03 影响判定已记录且当前无待回写 | pass | §7；未来 contract 变更触发回流 03 |
| 未新增 runtime type/Port/DTO/error/state/flow；未伪造实现/审计/rollback/run | pass | §2.2、§6.4、§7、§9 |
| 正式 04 仍未创建；未实现代码、未运行测试、未提交 commit | pass | 台账与工作区静态审计 |

### Step 10 结论

`Step status = completed / stop_review`；`gate_status = pass_with_upstream_blockers`。

本 Step 已闭合配置变更权限与风险分级、评审门禁、safe audit payload、cold/new-run/entry/test 回退、sensitive ref rotation、critical reject 和跨变更审计。允许的下一动作是：更新 `04_config_calibration_flow.md` 与 `project_execution_ledger.md`，然后进入 Step 11「失效模式与降级 / fail-fast 策略」。不创建 Step 11 文件或正式 `04-配置设计.md`，直到下一动作获流程授权。
