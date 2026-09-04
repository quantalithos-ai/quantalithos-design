# Step 11：定义失效模式与降级 / fail-fast 策略

> 对应 SOP：`standards/document/配置设计讨论流程_SOP.md` Step 11
> 回填章节：未来正式 `04-配置设计.md` §11“失效模式与降级 / fail-fast 策略”
> 参考粒度：`projects/L1-governance/design-calibration/04_config_step_11_failure_degradation.md`
> 执行模式：full-restart；本文件只定义失效语义，不生成运行结果、告警实例或测试证据

## 1. Step 状态

| 项目 | 记录 |
|---|---|
| 当前文档 | `04-配置设计.md`（正式文件尚未创建） |
| 当前 Step | Step 11 失效模式与降级 / fail-fast |
| 当前模块 | `failure_degradation` |
| Step 状态 | `completed / pass_with_upstream_blockers` |
| 输入基线 | Step 5 来源优先级、Step 7 配置项、Step 8 敏感配置、Step 9 加载生效、Step 10 变更回滚、`03` 错误/观测边界 |
| 正式 `04` 写入 | `false`；只允许在 Step 15 装配 |
| 实现 / 测试 / 证据 | `false`；下表是设计要求，不代表已有告警、DLQ、provider 或测试结果 |
| commit | `false` |

### 1.1 Step 内计划

- [x] 区分配置阶段错误、入口参数错误和运行期外部依赖错误。
- [x] 为 startup、job-run-start、entry-local、test-entry 固定 fail-fast / reject 行为。
- [x] 为 resolver、Runtime、Member、Images、Sandbox、carrier、publisher、handoff 等运行期接缝固定 blocked/degraded/delayed/failed marker 上限。
- [x] 明确 P0 不允许 silent fallback、低优先级 fallback、online LKG 或 hot reload。
- [x] 收敛告警安全字段、测试切口、`03` 影响判定、§11 回填草稿和跨失效审计。

## 2. 本步目标与边界

本 Step 定义配置缺失、解析失败、类型/范围/交叉字段错误、敏感信息违规、来源漂移、配置过期和运行期 adapter 不可用时，`L2-member-service` 如何保护 Host Truth、执行主语、状态机、幂等、查询只读和四层 handoff 边界。

本 Step 只定义以下策略语义：

- `fail-fast`：在启动、入口或 job 开始前拒绝不可信输入；
- `fail-closed`：安全、授权、隔离、正文排除或静态不变量不明确时拒绝危险动作；
- `blocked`：上游合同或必需装配接缝未闭合，不能形成正向宿主事实；
- `degraded`：只读或非核心运行面可继续，但必须显式暴露 stale/unavailable 标记；
- `delayed`：可重试的运行期依赖暂时不可用，保持待处理，不伪造成功；
- `failed marker`：已提交的 action/publication/handoff/job 产生失败或待人工处理标记。

本 Step 不选择告警平台、DLQ、SLO、重试数字、secret provider、容器产品、数据库、消息总线或运维命令；这些属于后续实施与运维承接。P0 没有 remote config center、admin override、online last-known-good 或 runtime hot reload。

## 3. 本步输入

| 输入 | 用途 | 状态 |
|---|---|---|
| `04_config_step_05_sources_priority_conflicts.md` | defaults/file/env 优先级、冲突和高优先级非法值规则 | completed |
| `04_config_step_07_config_items.md` | 配置项必填、类型、作用域、生效方式和初始失败策略 | completed |
| `04_config_step_08_sensitive_secrets.md` | opaque ref、raw secret/body 禁止输出和轮换边界 | completed |
| `04_config_step_09_loading_validation_activation.md` | parse/type/cross-field、builder、startup/job/entry/test 生效边界 | completed |
| `04_config_step_10_change_audit_rollback.md` | validated rollback、审计最小字段和变更作用域 | completed |
| `03_ddd_step_12_errors_recovery.md` | domain/application/port/API/worker/job disposition 与恢复方向 | completed |
| `03_ddd_step_14_config_dependencies.md` | sibling seam、availability、placeholder 和禁止配置化项 | completed |
| `03_ddd_step_15_observability_audit.md` | redacted issue、低基数日志/指标/审计约束 | completed |

## 4. SOP 问题回答

| 问题 | 本仓结论 |
|---|---|
| 必填配置缺失时如何处理？ | startup 必填项缺失使 builder 进入 `Failed`，不暴露 API/worker/jobs facade；job-run-start 必填 scope/target/batch 等缺失只拒绝当前 job；entry-local 缺失或非法拒绝当前入口；`ci-test` deterministic fixture 或 `operations-replay` replay fixture 缺失使对应测试 / replay fail-fast。 |
| 类型、范围、交叉字段错误如何处理？ | 由统一 validator 产生 redacted issue；startup fail-fast，job/entry reject，test fail-fast。高优先级非法值不得回退 file/default。 |
| secret/provider 不可用如何处理？ | P0 只接受 opaque ref，不读取 raw material。未来 required provider 在 startup 不可用时 fail-fast；job target 不可用时 reject 或 failed marker；不得 fallback fake 或输出 provider body。 |
| config center 不可达如何处理？ | P0 不依赖 config center；出现该来源或相关开关直接 reject。未来引入时不得切换到未验证配置，只能以已验证 artifact 重新启动，并补 `03`/`04` 设计。 |
| 配置漂移、过期如何发现？ | 比较 redacted canonical config digest、profile、activation kind、run input digest 和 fixture digest；startup 漂移重新校验，失败则不启动；已开始的 job 不修改既有 report，只新建 run。 |
| 哪些情况可降级？ | 仅运行期外部 resolver、projection/reference read、publisher/handoff/export 等有明确 marker 的非本地 truth 面；Query 降级必须 no-write，已提交 local truth 不回滚。 |
| 哪些情况必须 fail-closed？ | raw secret/body、redaction 放宽、visibility/capability bypass、ProjectMember 主语或 Host Truth owner 改写、Sandbox binding 不明、生产 profile 使用 fake、四层 handoff 混写等。 |

## 5. 当前材料诊断

| 位置 | 改动前问题 | 本 Step 修正 |
|---|---|---|
| Step 7 | 配置项各自写了 fail-fast/reject，缺少统一策略词汇 | 固定 fail-fast、fail-closed、blocked、degraded、delayed、failed marker 的含义和适用范围 |
| Step 8 | raw secret reject 已存在，但 provider/target 不可用时容易被误写成 fallback | 对 required credential、target、binding 采用 fail-closed；禁用外围保持 disabled |
| Step 9 | loader 失败与 adapter 运行失败未分开 | 分为配置阶段、入口阶段、运行期接缝三类处理面 |
| Step 10 | previous validated rollback 已定义，缺少漂移、过期和无效回滚目标行为 | 增加 digest drift、expired artifact、unvalidated rollback target 的拒绝规则 |
| `03` | 有 blocked/unknown/degraded/no-write 语义，未形成配置失效矩阵 | 将配置结论映射到既有 domain/application/worker/job disposition，不新增 truth owner |
| 历史 `05/06` | 可能把 unavailable 当作环境失败或成功重试 | 仅作 historical_material；不覆盖本 Step 的 fail-closed 结论 |

## 6. 改动前后对比

| 项目 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| startup failure | 分散在配置项表 | 统一为 builder `Failed`、facade 不暴露 | 阻止半装配运行 |
| security failure | 主要写在敏感配置章节 | 明确安全、正文、主语、owner、隔离边界一律 fail-closed | 防止宽松默认值绕过红线 |
| runtime unavailable | 与非法配置混在一起 | 按角色区分 blocked/degraded/delayed/failed marker | 保留本地事实并暴露真实不确定性 |
| fallback | 未集中声明 | P0 禁止 silent/low-priority/fake fallback | 保证高优先级错误可见 |
| drift/expiry | 未统一 | digest revalidation、过期 artifact 和无效 rollback 均拒绝 | 保持可复核配置基线 |
| alert/test | 只有观测原则 | 增加安全告警字段和配置专项测试切口 | 供 05/06/09 承接 |

## 7. 设计取舍

| 议题 | 备选 | 采用结论 |
|---|---|---|
| 非法 startup config | 使用默认值继续 / fail-fast | fail-fast；不可信配置不能装配宿主 |
| 高优先级 env 非法 | 回退低优先级 / fail-fast | fail-fast；承接 Step 5 |
| 安全边界不明确 | fail-open / fail-closed | fail-closed；特别是 Sandbox、credential、redaction 和主语 |
| 外部 adapter 不可用 | 全部阻止启动 / 按角色降级 | required startup binding 阻止启动；运行期非核心接缝用显式 degraded/delayed/failed marker |
| LKG | 在线继续使用旧配置 / restart rollback | P0 只允许先前已验证 artifact + restart；无 online LKG |
| 外部 GRC / publication | 依赖其可用才允许核心 truth / 独立外围 job | 外围 disabled 或失败不回滚核心 Host Truth |
| Query stale | Query 自动修复 / 只读 degraded | 只读 degraded；不写 projection、reference 或 truth |

## 8. 结构化中间产物

### 8.1 策略术语定义

| 策略 | 本仓含义 | 适用范围 | 不适用范围 |
|---|---|---|---|
| `fail-fast` | 在输入或构造阶段立即拒绝，不暴露半成品 facade | startup、job-run-start、entry-local、test-entry | 已提交 Host Truth 的事后改写 |
| `fail-closed` | 安全/隔离/授权/静态边界不明确时拒绝危险动作 | raw body、credential、Sandbox、主语、owner、redaction、production fake | 普通低风险 batch 收窄 |
| `blocked` | 合同或必需资格未闭合，保持等待/阻塞 marker | Member、Images、Runtime、Sandbox 的正向 seam；carrier availability 不足时的 handoff 交接 | 不得当作 ready/healthy |
| `degraded` | 返回可消费但不完整的 safe surface，并暴露 stale/unavailable | Query projection/reference、非核心运行期 resolver | 非法配置或安全违规 |
| `delayed` | 暂时不可用，保持待处理并等待重试/新 run | worker consumer、outbox scan、可重试 adapter | invalid config、unsupported version |
| `failed marker` | 记录已提交动作/发布/交接/job 的失败结果 | outbox、handoff、external export、cleanup/reconcile | 回滚 accepted/local truth |
| `restart rollback` | 恢复先前 validated artifact 后重新启动 | startup config change | 在线 hot switch |
| `last-known-good` | 在线使用上一份配置 | P0 不支持 | 不得作为隐式 fallback |

### 8.2 配置失效模式表

| 失效模式 | 影响 | 系统行为 | 是否告警 | 测试切口 |
|---|---|---|---|---|
| required startup config missing | 无法确定 store/binding/runtime | builder `Failed`，不暴露 facade | 是 | 每个 required domain 缺失测试 |
| strict JSON parse failure | 配置不可信 | fail-fast | 是 | 注释、尾逗号、非法 JSON reject |
| unknown section/field or alias | 可能拼写错误或越权 | fail-fast，除非未来 schema 明确保留 | 是 | unknown/alias issue |
| invalid enum/type/range | 无法形成 typed config | fail-fast 或拒绝当前 job/entry | 是 | profile/mode/batch/ref shape |
| duplicate list/key | family/topic/job kind 不唯一 | fail-fast | 是 | duplicate resolver/topic/item |
| high-priority env invalid | 低优先级值被错误掩盖 | fail-fast，不 fallback | 是 | env invalid vs file/default |
| conflicting ordinary sources | 语义不确定 | fail-fast 或当前 entry reject | 是 | source conflict |
| job/entry tries global override | 绕过 startup invariant | 当前 job/entry reject | 是/安全 | store/topic/owner override reject |
| raw secret/body/manifest/endpoint secret | 发生泄露或越界 | fail-closed，配置不激活 | 是/安全 | forbidden-body scanner |
| redaction deny list empty/unsafe | 输出边界失守 | fail-closed，builder `Failed` | 是/安全 | empty list/high-cardinality reject |
| static boundary override | 改写主语、owner、state、query/no-write 等 | fail-closed，配置不激活 | 是/安全 | invariant key reject |
| production-like fake/fixture | 环境隔离失效 | fail-closed | 是/安全 | profile guard |
| required Member/Images/Runtime/Sandbox binding unavailable at startup | 宿主无法安全装配 | fail-fast 或绑定 `Blocked`，不得 Ready | 是 | required seam availability |
| optional binding disabled | 外围能力不启用 | builder 可继续；依赖 job disabled/rejected | 信息/可选 | external feature disabled 不阻断核心 |
| Identity/Work qualification unavailable during command | 执行主语或身份不能验证 | command rejected/blocked；不写 accepted truth | 是 | resolver unavailable rollback |
| qualification unavailable during query | safe view 不完整 | query degraded/unavailable；no-write | 可聚合 | stale read no-write |
| resolver unavailable during consumer | 不能安全解释输入 | worker delayed 或 failed reference marker | 是/聚合 | no snapshot from unknown |
| runtime session contract pending/unavailable | 不能形成 Runtime association | session blocked/unknown；不伪造 run | 是 | MSVC-UP-001 placeholder |
| Sandbox binding unavailable/ambiguous | 隔离边界不明 | 高风险动作 fail-closed；local attempt 可保存 | 是/安全 | no host fallback |
| carrier unavailable after local action | 外部承载未完成 | action remains submitted/unknown/gap；不回滚 local truth | 是 | carrier failure marker |
| publisher unavailable | outbox 未送出 | retryable/failed marker；payload 仍 immutable | 是 | no truth rollback |
| publisher permanent failure | 需要人工处理 | terminal failed/DLQ marker（产品待定） | 是/严重 | terminal marker |
| handoff/export target disabled | 目标不接受交接 | job rejected 或 failed marker | 是/信息 | disabled target surface |
| external GRC disabled | 外部 export 不执行 | export disabled/rejected；核心 command unaffected | 否/信息 | core truth comparison |
| projection/reference store unavailable | derived read 不可用 | query degraded；不触发修复写 | 是/聚合 | repository write audit |
| job batch/timeout/retry invalid at run start | 当前 run 不可复核 | job rejected；不改写 report | 是 | run input validation |
| idempotency/result retention conflict | duplicate replay 不可靠 | startup fail-fast | 是 | retention cross-field |
| config digest drift | runtime 与批准基线不一致 | startup/release gate fail-fast，需重验证 | 是 | expected vs actual digest |
| config artifact expired | 不能证明配置基线有效 | reject；不得隐式用旧文件 | 是 | expired artifact |
| rollback target unvalidated | 回滚可能引入坏配置 | rollback rejected | 是 | invalid rollback target |
| fixture/replay root missing or not de-identified | 重放不可复核或可能泄露 | test fail-fast / replay job rejected | 是/安全 | replay guard |
| clock/id port unavailable | mutation 缺少稳定时间/ID | startup fail-fast 或 mutation reject before UoW | 是 | missing port |
| runtime builder partial assembly | 可能暴露半可用服务 | builder `Failed`，facade 不暴露 | 是 | partial assembly |

### 8.3 按配置域组织的失败策略表

| 配置域 | 配置阶段失败 | 运行期依赖失败 | 对外 / 对 job 表面 |
|---|---|---|---|
| `profile` / `config_identity` | fail-fast | 不适用 | runtime failed，无 facade |
| `truth_store_binding` | fail-fast | required store unavailable 阻止 mutation；read 可按正式 surface degraded | command rejected；query safe degraded |
| `maintenance_store_binding` | history/material/outbox 缺失 fail-fast；projection 缺失可受控 degraded | maintenance adapter unavailable delayed/failed marker | local truth 不回滚 |
| `idempotency_result_binding` | fail-fast | reservation/result store unavailable 时 mutation rejected | 不静默重跑 |
| `qualification_resolvers` | family/mode/ref invalid fail-fast | command blocked/rejected；query degraded；consumer delayed | 不推导 ready |
| `member_binding` / `images_binding` | enabled 缺 ref 或 profile 不兼容 fail-fast | register/supply unavailable => launch blocked | 不声明 registration/image verified |
| `runtime_session_binding` | ref/availability invalid fail-fast | session unavailable => waiting/unknown | 不创建 Runtime run |
| `sandbox_binding` | unsafe or missing Sandbox binding fail-closed | bind/release failure => blocked/gap/failed marker | 不 host fallback |
| `carrier_binding.availability` | marker 非法或未知 fail-closed | carrier unavailable => handoff blocked/gap/failed marker；不装配 carrier adapter | 不推导 carrier ready / release success |
| `registration_session` / `health_assessment` | mode/credential/threshold invalid reject | heartbeat stale/unavailable => health unknown/stale；不等于 healthy | health job report explicit marker |
| `publication` / `handoff_feedback` | enabled 缺 event/target fail-fast/reject | publisher/feedback unavailable => submitted/unknown/gap | 不推导 delivered/observed/accepted |
| `operation_jobs` | invalid kind/limits/profile fail-fast | target/lease/store unavailable => delayed/partial/failed report | Job 不拥有 authorization |
| `safe_read_boundary` / `security_redaction` | fail-closed | redaction sink unavailable => 不输出敏感面 | Query body-free remains fixed |
| `clock_id` | fail-fast | port lost before mutation => reject | 不自取时间或拼 ID |
| `deterministic_fixture` | `ci-test` / `operations-replay` test/replay fail-fast | fixture read unavailable => test/job rejected | 不进入 `local-dev`、`integration-like` 或 future profile |

### 8.4 生效方式到失效策略矩阵

| 生效方式 | 检测点 | 失败策略 | 恢复方式 |
|---|---|---|---|
| `startup` | source merge、parse、type/range/cross-field、sensitive、builder | fail-fast/fail-closed；不暴露 facade | 修复或恢复 previous validated artifact 后 restart |
| `job-run-start` | job metadata、scope、target、batch、retry、replay root | reject current run；已存 report 不改写 | 以有效输入创建新 run |
| `entry-local` | config/profile/request selector | reject current entry | caller 用有效 selector 重试 |
| `test-entry` / replay run | `ci-test` fixture、`operations-replay` replay fixture、fixed clock/id | test fail-fast；replay job rejected；`integration-like` 只走 controlled seam | 修复 fixture 后 rerun |
| runtime resolver / consumer | 调用返回 unavailable/unknown/stale | command blocked；query degraded；consumer delayed 或 failed marker | retry / new run / manual recovery 按后续 owner 规则 |
| publication / handoff | adapter result、feedback gap | submitted 保留；failed/gap/unknown marker | retry same key 或新 job，禁止换 key 绕过 fence |
| rejected critical change | forbidden key/body/hot/reload | 不激活，fail-closed | 正式设计变更或移除非法输入 |

### 8.5 告警与安全记录规则

| 场景 | 告警 | 允许安全字段 | 禁止字段 |
|---|---|---|---|
| startup validation rejected | 是 | profile、section、source class、issue ref、config digest | raw config、secret、full ref |
| builder failed / partial assembly | 是 | builder state、logical slot、issue ref、correlation | adapter body、URL、credential |
| high-priority source invalid | 是 | source kind、section、issue ref | env value、file body |
| raw secret/body or unsafe redaction | 是/安全 | forbidden class、issue ref、profile | matched value/body |
| sibling binding blocked | 是/聚合 | binding kind、availability、blocker id | sibling response body、manifest |
| resolver / projection degraded | 可聚合 | operation kind、surface kind、freshness/disposition | external body、high-cardinality id |
| publisher/handoff/export failure | 是 | local record ref、event/target category、failure class、report ref | payload、transport credential |
| digest drift/expiry | 是 | expected/actual redacted digest、profile、artifact class | full config |
| invalid job/entry input | warn or test failure | job/entry kind、issue ref、run/entry ref | request body、target secret |

### 8.6 测试切口表

| 测试切口 | 预期 |
|---|---|
| missing required startup field | builder `Failed`，不暴露 facade |
| JSONC/comment/trailing comma/unknown field | strict parser reject |
| invalid env does not fallback | 高优先级值导致 fail-fast |
| cross-field topic/target/retention/profile conflict | validation reject |
| raw secret/body/manifest detection | fail-closed 且 issue/log 不含原文 |
| redaction deny list empty or high-cardinality enabled | startup fail-fast |
| static owner/state/query-write override | 配置拒绝，不进入 builder Ready |
| unresolved Member/Images/Runtime seam | blocked/unknown，不生成 ready |
| Sandbox unavailable | dangerous action fail-closed；无 host fallback |
| carrier availability unavailable | handoff blocked/gap/unknown；不装配 carrier adapter，不回滚 local truth |
| external GRC disabled | core command/local truth unaffected |
| projection/reference unavailable | query degraded，无 repository write |
| publisher/handoff failure | failed/gap marker；local truth/outbox snapshot 不回滚 |
| job/entry global override attempt | current job/entry rejected |
| digest drift / expired artifact / invalid rollback target | release/startup/rollback rejected |
| `deterministic_fixture.*` in `local-dev`、`integration-like` or future profile | fail-closed |
| clock/id missing | mutation rejected before UoW |

### 8.7 配置失效模式停审记录

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 配置阶段与运行期依赖失败已分离 | 通过 | §8.2~§8.4 分层 |
| 高优先级非法来源不得 fallback | 通过 | 承接 Step 5/9 |
| 安全、隔离、主语、owner 和正文边界 fail-closed | 通过 | raw body、Sandbox、static override 覆盖 |
| degraded/delayed 只用于有 marker 的运行期接缝 | 通过 | 非法配置不降级成成功 |
| P0 无 online LKG/config center/hot reload | 通过 | unsupported/rejected |
| 变更漂移、过期和无效回滚目标 | 通过 | digest revalidation |
| 告警字段和测试切口安全 | 通过 | 不含 raw secret/body/full ref |

### 8.8 跨失效策略审计表

| 审计项 | 结论 | 缺口 / 修正 |
|---|---|---|
| required config missing 是否会半启动 | 不允许 | builder Failed，无 facade |
| invalid high-priority source 是否低优先级 fallback | 不允许 | fail-fast |
| config error 是否被 degraded 掩盖 | 不允许 | degraded 仅运行期依赖/read surface |
| fake/placeholder 是否被写成 ready | 不允许 | availability marker 保持 blocked/unknown |
| query degraded 是否写修复副作用 | 不允许 | Query no-write |
| publisher/handoff failure 是否回滚 local truth | 不允许 | marker/report only |
| external GRC disabled 是否阻断核心 | 不阻断 | 外围 job disabled/rejected |
| Sandbox 不可用是否 host fallback | 不允许 | fail-closed |
| raw secret/body 是否进入日志/告警/审计 | 不允许 | issue ref only |
| rollback 是否接受未验证 artifact | 不允许 | validated target required |
| 是否需要回写 `03` | 当前 P0 无 | future provider/config center/hot reload 等需回写 |

## 9. 对 `03-详细设计.md` 的影响判定

| 配置结论 | 是否影响 03 | 影响类型 | 03 回写位置 | 处理状态 |
|---|---|---|---|---|
| startup 配置错误统一 fail-fast、不暴露 facade | 否 | 承接既有 builder state | `03` §13 已有 | 无回写 |
| 高优先级非法值不回退低优先级来源 | 否 | 来源与校验语义 | 不适用 | 无回写 |
| raw secret/body、redaction unsafe、静态边界和 Sandbox 不明 fail-closed | 否 | 承接既有安全/隔离边界 | `03` §13~§15 已有 | 无回写 |
| runtime resolver/read/publication 按角色 degraded/delayed/failed marker | 否 | 承接既有 error/recovery/no-write | `03` §12~§15 已有 | 无回写 |
| P0 无 online LKG、remote config、hot reload | 否 | activation/rollback 裁剪 | `03` §13 已有 | 无回写 |
| future provider health、config center fallback、production alert contract | 是 | builder / Port / error / observability 新契约 | `03` §13~§15 | future design-change-required；当前不进入 P0 |

当前没有 P0 `待回写` 或 `阻塞待确认` 的详细设计影响项；未闭合 sibling 合同继续以 blocked/unknown/placeholder 承接。

## 10. 回填草稿：正式 `04-配置设计.md` §11

> 校准来源：
> - `design-calibration/04_config_step_11_failure_degradation.md`
>
> 延伸阅读：
> - 建议阅读“策略术语定义”“配置失效模式表”“按配置域组织的失败策略表”“生效方式到失效策略矩阵”“告警与安全记录规则”“测试切口表”和“跨失效策略审计表”。

正式 §11 应装配失效策略术语、P0 配置失效矩阵、按配置域的失败行为、生效方式映射、告警安全字段、配置测试切口和跨失效审计。正文必须区分非法配置的 fail-fast/fail-closed 与运行期依赖的 blocked/degraded/delayed/failed marker，不得声明告警平台、DLQ、SLO 或测试已执行。

## 11. 待确认事项

| 事项 | 影响 | 未确认前处理 |
|---|---|---|
| future secret provider health / rotation contract | 影响 credential、builder 和 error surface | P0 opaque ref + fail-closed；先回写 `03` |
| config center / online LKG | 影响 source、activation、rollback 和 audit | P0 不支持；相关 key 直接 reject |
| DLQ、retry/backoff、alert threshold 产品 | 影响 worker/job 运维行为 | 只保留 failed marker / delayed 语义，不锁数值或产品 |
| Runtime/Member/Images/Sandbox exact availability and feedback | 影响正向 seam | 保持 pending/blocked/unknown，不伪造 ready |
| digest canonicalization、artifact expiry authority | 影响实施证据 | 当前只定义语义，算法/权威方留实施门禁 |

## 12. 自检与停审结论

| 检查项 | 结果 | 说明 |
|---|---|---|
| P0 配置失效模式已覆盖 | pass | required、parse/type、cross-field、sensitive、drift、rollback 均覆盖 |
| fail-fast / fail-closed / blocked / degraded / delayed / failed marker 已区分 | pass | §8.1 |
| 高风险失败无 silent fallback | pass | §8.2、§8.8 |
| 上游依赖不可用不被写成 ready | pass_with_upstream_blockers | `MSVC-UP-001~008` 保持 pending/blocked |
| Query degraded 不写修复副作用 | pass | no-write 规则已固定 |
| 告警和测试字段不泄露敏感材料 | pass | raw secret/body/full ref 禁止 |
| `03` 影响已判定 | pass | P0 无回写，future 先回写 |
| 正式正文未提前创建 | pass | 仅生成 Step 11 中间产物 |
| 进入下一步条件 | pass_with_upstream_blockers | 允许进入 Step 12 |

```text
step_11_status = completed / pass_with_upstream_blockers
step_11_gate = pass_with_upstream_blockers
formal_04_write_allowed = false
next_allowed_action = enter_step_12_downstream_handoff
implementation_allowed = false
test_execution_allowed = false
commit_allowed = false
```
