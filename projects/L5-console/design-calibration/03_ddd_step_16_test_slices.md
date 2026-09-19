# Step 16. 测试切口与最小验证清单

> 对应 SOP：`standards/document/详细设计讨论流程_SOP.md` Step 16  
> 回填章节：未来正式 `03-详细设计.md` §15  
> 粒度参考：`projects/L1-governance/design-calibration/03_ddd_step_16_test_cuts.md`  
> 状态：`done / pass / self_reviewed`

## 1. 目标与事实边界

本 Step 为 Step 5～15 已收稳的 planned TypeScript 浏览器客户端契约建立最小可验证入口。它只定义测试切口、建议测试类型和阻塞条件，不定义完整测试方案、TC/EV 编号、覆盖率阈值、CI job、fixture 全集、报告模板、执行排期或验收结论。

本 Step 没有创建目标实现仓、测试文件、脚本、artifact 或 report，也没有执行测试。表中的 `pass/fail` 仅描述未来断言的预期判定，不是现存测试结果。owner exact contract 尚未闭口的正向切口必须使用“formal contract fixture 可用后执行 / 当前 blocked”，不得用自造 DTO、私有接口或静态 JSON 伪造成功。

## 2. 输入与覆盖主轴

| 输入 | 状态 | 本 Step 的验证承接 |
|---|---|---|
| Step 5 | done | 十模块职责、依赖方向、文件归属和模块测试主轴 |
| Step 6 | done | 对象字段、factory、不变量、状态 union、typed ref 和 safe payload |
| Step 7 | done | narrow port、adapter parity、取消、错误、读写和 fake failure injection |
| Step 8 | done | 5 Command、16 Query、1 conditional consumer；Event/Job 不适用 |
| Step 9 | done | 逐协议 flow、调用顺序、副作用、Query no-write 和 unknown 分支 |
| Step 10 | done | 客户端状态族、合法/非法转换和 formal-only positive recovery |
| Step 11 | done | scoped carrier、whole-record replace、安装分离和一致性边界 |
| Step 12 | done | construction/port/protocol 错误映射、恢复、取消和 redaction |
| Step 13 | done | same-scope single writer、single-flight、late result、owner replay 禁止 |
| Step 14 | done | typed binding、fail-closed startup、依赖不可用和禁止配置化 |
| Step 15 | done | body-free diagnostics、低基数指标、formal audit 分离和 sink isolation |

| 批次 | 内容 | 状态 |
|---|---|---|
| 16.1 | 目标、输入、SOP 回答、测试总图 | done |
| 16.2 | 十模块与 5 Command 测试切口 | done |
| 16.3 | 16 Query 与 conditional consumer 测试切口 | done |
| 16.4 | 状态、一致性、并发、错误、配置、观测与 a11y 切口 | done |
| 16.5 | Step 5～15 覆盖审计、回填草稿与三层门禁 | done |

## 3. SOP 问题回答

| 问题 | 收口回答 |
|---|---|
| 每个模块至少需要哪些测试？ | 十模块均需覆盖自身纯对象/guard 或注入 port 契约；`entry` 测组合与安全启动，`adapters/state/diagnostics` 测 failure injection，`features/recovery` 额外测 owner 分区与 a11y 等价。 |
| 每个接口至少需要哪些正向和异常测试？ | 5 Command、16 Query 均逐协议列正向、阻塞/异常、取消或 scope 分支；conditional consumer 当前必须验证 disabled/no-write，正向 observed 分支在正式 envelope 后执行。 |
| 状态机如何测试？ | 以 Step 6/10 的正式状态名为唯一来源；每个状态族至少验证合法收紧、非法本地抬升和新 formal observation 才能恢复的边界。 |
| 一致性、幂等和并发如何验证？ | 使用 deterministic fake port/carrier/host/sink 注入反序完成、scope mismatch、ambiguous completion、double action 和 sink failure；不引入 DB/UoW/outbox 或 owner idempotency store。 |
| 哪些细节留给测试方案？ | runner/framework、fixture 目录与真实 owner 合同、TC/EV 编号、优先级、覆盖率、浏览器/a11y matrix、性能阈值、artifact/report/evidence 结构和执行排期留给正式 `05/06/07`。 |

## 4. 诊断与设计取舍

| 诊断项 | 处理 |
|---|---|
| Step 5 已预告模块切口但未形成协议级覆盖矩阵 | 本 Step 按十模块、协议族和横切契约逐项反查。 |
| exact owner schema/positive adapter 未闭口 | 测 safe blocked/fake parity；positive contract test 标 `blocked_by_formal_contract`，不自造成功。 |
| Query flow 与 caller installation 分离 | Query test 断言零 carrier write；另由 command/coordinator cut 验证 scope recheck 后安装。 |
| state carrier 无 CAS/revision | 只验证 single-writer/serial coordinator；不得写“optimistic concurrency 已通过”。 |
| conditional consumer 尚未激活 | 当前正向切口是 disabled/pending-contract；observed/applied cut 保留为合同激活门禁。 |
| 通用规范提供 scripts 示例 | 05 Step 9 已把 `scripts/gates/*`、`scripts/checks/*`、`scripts/reports/*` 与 `artifacts/test/<run_id>`、`reports/runs/<run_id>`、`reports/acceptance` 收口为 planned boundary；本 Step 不创建脚本、artifact 或 report，也不填写执行结果。 |
| 旧 `05/06` 仍是历史材料 | 不引用其用例、指标或 evidence；后续必须按本 Step 和正式 03 full-restart。 |

采用的粒度是“每个 public protocol 独立切口 + 每个状态族独立切口 + 每个模块最小入口”。不采用只写 happy path、用视觉快照证明权限/a11y、把 fake success 当 production integration，或以测试存在推导 readiness 的方案。

## 5. 测试切口总图

```text
Step 5 module axis
  -> module/object/port dependency cuts
Step 8 protocol + Step 9 flow
  -> 5 Command + 16 Query + 1 conditional consumer cuts
Step 10 state matrix
  -> legal tightening + illegal elevation + formal-only recovery cuts
Step 11-13 carrier/error/concurrency
  -> whole-record/scope/no-write/single-flight/ambiguity/race cuts
Step 14 binding
  -> fail-closed composition + forbidden-configuration cuts
Step 15 diagnostics/audit boundary
  -> whitelist/redaction/low-cardinality/failure-isolation cuts
```

所有 future tests 必须使用 Step 6 正式类型名、Step 7 port 名、Step 8 protocol 名和 Step 10 状态值。发现不一致时回改相应 Step，不能在测试名或 fixture 中发明别名。

## 6. 十模块测试切口汇总

| 测试切口 | 对应契约 | 验证内容 | 建议测试类型 |
|---|---|---|---|
| `entry_safe_bootstrap_and_close` | Step 5 `entry`;Step 7 entry ports;Step 10 shell | 注入依赖完整时建立 bootstrapping/restricted shell；缺 formal slot 时不伪 active；close 后不可 reopen；host present 失败不恢复敏感 page | composition unit + host fake |
| `access_context_and_disclosure_ceiling` | `AccessContext`、`QualificationBoundary`、`DisclosureGuard` | formal refs 同源；verified 只能由 formal observation；本地只收紧；revoked/unknown 清理；不从 role/menu/route 推导 | object/guard unit |
| `navigation_visibility_and_cleanup` | `TopicVisibility`、`NavigationState` | visible/restricted/disabled/unknown 显式；hidden direct entry 不泄露存在性；context change 清理选择/history；navigation 不抬升 visibility | module unit |
| `views_safe_mapping_and_no_write` | snapshot/source axes/ref/view ports | forbidden field 全拒绝；各 source axis 保真；owner 分区不压平；Query 零 carrier/owner write | mapper contract + flow fake |
| `intent_draft_request_result_separation` | draft/request/result/guards | reviewable≠authorized，submitted≠accepted，receipt≠confirmed；unknown 禁止 replay；scope/context/command 同源 | object + service unit |
| `features_partition_and_activation_gate` | descriptor/activation/topic composition | 八 topic owner set 固定；canonical partition order；局部故障；active 需要六 facet + capability + verified context；无全局 readiness | parameterized module test |
| `recovery_explicit_action_and_a11y_equivalence` | degradation/plan/action/accessibility ports | 每次恰好一个 action；stale plan 被拒；无 retry-all；视觉/键盘/AT 共用 action key/guard；host failure 不改业务结果 | flow + accessibility semantic |
| `adapters_narrow_surface_and_parity` | Step 7 formal facets/adapters | 业务模块不碰 SDK private transport；fake/formal 输出同一 union；raw error/body 只在 adapter 内分类后丢弃；missing contract fail closed | contract + architecture check |
| `state_exact_scope_whole_record` | carrier/state scope/invalidation | full-record validate/replace；scope mismatch 阻断；ambiguous write 强制 reload；load 不恢复 positive formal state；无 partial merge | carrier fake |
| `diagnostics_whitelist_and_isolation` | diagnostic factory/gate/sink | 只接收 typed refs/enums；forbidden body 不触达 sink；disabled/failed/取消均不改变业务 outcome；无递归 emission | diagnostic fake + redaction check |

## 7. Command 接口测试切口

| 测试切口 | 对应契约 | 正向断言 | 异常/边界断言 | 建议测试类型 |
|---|---|---|---|---|
| `RequestAccessContextSwitch_contract` | Step 8 §5.1;Step 9 §4.1 | formal verified/restricted observation 后清理旧 scope、替换 shell/context；presentation 独立 | scope mismatch、revoked/expired、cancel、host failure；旧 shell 不被本地恢复为 verified | flow + port fakes |
| `SaveClientPreference_contract` | Step 8 §5.2;Step 9 §4.2 | 仅 typed topic/filter/window whole-record replace；相同 patch 可 unchanged | unsafe authority field、scope mismatch、carrier unavailable/ambiguous；不改变 visibility/result/activation | flow + carrier fake |
| `DiscardDraftIntent_contract` | Step 8 §5.3;Step 9 §4.3 | editing/invalid/reviewable → discarded，且无 owner call | submitted/discarded 再丢弃返回 invalid state；replace failure 不宣称已保存 | object + flow |
| `SubmitControlledIntent_contract` | Step 8 §5.4;Step 9 §4.4 | 在 formal contract fixture 可用时：qualified/reviewable/current input 恰好一次 submit；receipt/result/ambiguous 分层映射 | 当前无 exact mapper 时 `missing-formal-surface` 且零 submit；double action 单飞；cancel-after-dispatch/timeout→unknown；carrier failure 不重发 | contract fixture (positive blocked) + flow fake |
| `ApplyRecoveryAction_contract` | Step 8 §5.5;Step 9 §4.5 | 每个允许 action 精确调用一个 narrow port；返回 recovery+a11y presentation | stale/mismatched plan、blocked action、`retry-command`、double trigger 被拒；focus/announce failure 隔离 | parameterized flow + a11y fake |

Command 共性断言：local `operationRef/requestRef/attemptRef` 不得作为 owner idempotency key；除 `SubmitControlledIntent` 外零 owner write；任何 ambiguous owner side effect 都不得映射 `confirmed/rejected` 或触发自动 replay。

## 8. Core Query 接口测试切口

| 测试切口 | 对应契约 | 正向断言 | 异常/边界断言 | 建议测试类型 |
|---|---|---|---|---|
| `ResolveAccessContext_query` | Step 8/9 Resolve | formal observation 的 lifecycle/refs 原样安全映射 | unresolved/restricted/expired/revoked/conflict/unknown、cancel、malformed；零安装/写入 | query service + adapter fake |
| `GetNavigationVisibility_query` | Step 8/9 visibility | exact topic/context formal posture | mismatch、restricted/disabled/unknown/unavailable；route/menu 不作为 fallback；零 navigation write | query service |
| `QueryOwnerView_query` | Step 8/9 owner view | safe material→snapshot/source axes/view；formal empty 显式 | forbidden body、blocked/unavailable/unknown、partial/malformed；filter/window 仅在 safe mapping 后；零 cache/carrier write | mapper contract + query flow |
| `GetSourceStatus_query` | Step 8/9 source status | 每个 freshness/coverage/availability/consistency/ref axis 保持 | owner/source mismatch、missing axis、not-covered；不聚合 health/compliance/readiness | pure unit |
| `GetSafeLink_query` | Step 8/9 safe link | current formal typed target ref 返回 value | revoked/not-visible/unavailable/unknown/cancel；不返回 URL、不执行 navigation | query + adapter fake |
| `GetRequestPresentation_query` | Step 8/9 local request | exact scope/ref 命中返回 body-free presentation | missing→local empty；scope mismatch/corrupt/unavailable；不触发 reconcile/submit | carrier fake |
| `ReconcileRequestResult_query` | Step 8/9 reconciliation | formal pending/confirmed/rejected/unknown ref 原样返回 | surface missing/unavailable/cancel→blocked/unknown；零 command replay、零隐式 install | query + adapter fake |
| `GetTopicActivation_query` | Step 8/9 activation | mode×six facets×context 产生五种正式 posture | owner membership mismatch、facet missing/malformed、restricted context 不得 active；adapter/package existence 不授权 | exhaustive mapper unit |

每个 Core Query 都必须共享 `query_no_write_invariant`：不调用 `replace/invalidate/clear`，不调用 `OwnerCommandPort.submit`，不修复 owner truth，不因 diagnostic/a11y 结果改变返回值。

## 9. Management topic Query 测试切口

| 测试切口 | owner partitions | 正向/部分数据断言 | 禁止与异常断言 | 建议测试类型 |
|---|---|---|---|---|
| `QueryMemberManagementTopic_query` | identity/member-service | canonical two-partition composition；formal fixtures 可用时 read-only safe view | 无 member lifecycle/role/body 推导；任一 unavailable 只影响该 partition | parameterized topic flow |
| `QueryProjectWorkspaceTopic_query` | work/process/workspace | 三 partition 独立，partial 明示，source axes 保留 | 无 workspace projection/cursor/rebuild；不从项目状态推 readiness | parameterized topic flow |
| `QueryMethodAssetTopic_query` | method-library/artifact | safe method/artifact refs；无 command contract 时 read-only | 不复制方法/制品正文；不自造发布/审批 action | parameterized topic flow |
| `QueryGovernanceControlTopic_query` | governance/artifact | Governance/SoA/AIIA/Control/Gate safe refs/status 按 owner 分区 | 不产生 verdict、approval、evidence 或 Gate decision；局部 conflict 不压平 | parameterized topic flow |
| `QueryObservabilityTopic_query` | observability | read-only metric/audit/report ref posture | 无阈值 verdict、audit/evidence body 或 readiness；source failure 局部化 | parameterized topic flow |
| `QueryCapabilityHubTopic_query` | capability-hub | formal capability/activation posture 可安全呈现 | 无 registration/readiness 推导；当前 exact contract 缺失应 pending/blocked | parameterized topic flow |
| `QueryArchiveTopic_query` | archive | formal archive safe ref/posture 可读 | 无 archive/restore command、package body 或 recovery truth；当前可 blocked | parameterized topic flow |
| `QuerySandboxTopic_query` | sandbox | formal sandbox safe ref/posture可读 | 无 run/start/cleanup command 或 runtime readiness；当前可 blocked | parameterized topic flow |

八个 topic Query 共性断言：owner 调度可并发但输出按 `TopicDescriptor.ownerKeys` canonical order；完成顺序不改变模型；只有所有适用 partitions formal empty 且没有 partial/blocked/unavailable/unknown 时，页面才可 `empty`；Query 本身零 local write。

## 10. Conditional consumer 与不适用协议族

| 测试切口 | 对应契约 | 验证内容 | 当前可执行性 | 建议测试类型 |
|---|---|---|---|---|
| `ConsumeSdkInvalidationHint_disabled` | Step 8 §7;Step 9 §7 | port 返回 disabled/pending-contract；零 state write、零 receipt/cursor/event store | 可作为设计/fake 切口 | consumer fake |
| `ConsumeSdkInvalidationHint_scope_and_body_guard` | candidate envelope | unsupported/scope mismatch 只有可证明时 ignored；malformed/forbidden body blocked 且不保留正文 | formal envelope 后执行 | contract test `blocked_by_CON-Q-034_038_044` |
| `ConsumeSdkInvalidationHint_monotonic_apply` | observation→marker→carrier | exact source/contract/scope 后只收紧；duplicate 等价；无 local timestamp/LWW | event id/order/dedup 合同后执行 | flow test `blocked_by_CON-Q-034_038_044` |
| `no_outbound_event_surface` | Step 8 §8 | public exports/flow 不出现 Console business event/outbox/publisher | 可静态检查 | architecture check |
| `no_operations_job_surface` | Step 8 §8 | 无 scheduler/worker/job/report/DLQ；recovery 均为用户显式 flow | 可静态检查 | architecture check |

## 11. 状态机测试切口

| 测试切口 | 正式状态族 | 合法转换 / 正向断言 | 非法转换 / 安全断言 | 建议测试类型 |
|---|---|---|---|---|
| `context_lifecycle_transitions` | `unresolved/verified/restricted/expired/revoked/conflict/unknown` | unresolved 经 formal observation 到 verified/restricted；current context 可被收紧；新 formal observation 可恢复 | route/cache/carrier/render 不得到 verified；revoked refs 不复用 | object/state unit |
| `qualification_visibility_tightening` | qualification + `TopicVisibility` | qualified/visible 可本地收紧；新 formal observation 可重新计算 | menu/role/feature flag 不得产生 qualified/visible；navigation 不抬升 | guard unit |
| `navigation_selection_cleanup` | empty/selected/restricted presentation | guarded select、switch selection、cleanup 幂等 | hidden/unknown topic 不可 selected；context change 后旧 entry/history 不得返回 | state unit |
| `source_axes_and_reference_validity` | freshness/coverage/availability/consistency/currentness | formal material 建立 axes；local invalidation 只向 conservative 值 | timer/cache hit/DOM success 不得 fresh/complete/available/coherent/current；axes 不压成单值 | exhaustive value test |
| `draft_lifecycle_transitions` | editing/invalid/reviewable/submitted/discarded | edit/validate/review/submit/discard 合法边 | submitted/discarded 不可编辑或复活；reviewable 不等于 authorized | object unit |
| `request_result_transitions` | submitted/accepted/pending/confirmed/rejected/unknown | receipt/result/reconciliation formal-driven；ambiguous→unknown | receipt/toast/transport/cache 不得 confirmed；unknown 不得 auto replay | state + mapper unit |
| `topic_activation_transitions` | pending/read-only/partial/active/blocked | formal facets 可映射全部 posture；local 可收紧 | 无 capability/verified context/six facets 不得 active；pending/blocked 不由 config 抬升 | table-driven unit |
| `degradation_recovery_plan` | none/degradation + immutable plan | non-normal axes 产生 degradation；formal observation 可修订/清除；allowed action 精确执行 | normal combination 不得制造 degradation；timer/action completion 不证明 recovery；stale plan blocked | state/flow unit |
| `carrier_disposition` | missing/loaded/unknown-to-caller | replace/invalidate/clear exact scope；duplicate invalidation 幂等收紧 | scope mismatch 不迁移；ambiguous completion 不假定旧/新；load 不恢复 positive formal state | carrier fake |
| `session_shell_transitions` | bootstrapping/presentable/restricted/closed | safe page+formal context 才 presentable；restrict/close 合法 | state load 不得 restricted→presentable；closed 不 reopen | entry unit |
| `accessibility_diagnostic_states` | action/focus/announcement + emitted/disabled/failed | same semantic guard 产生各 channel binding；diagnostic 每次独立结果 | host/sink failure 不改变 context/result/activation/recovery；无第二 action path | accessibility + diagnostic fake |

状态测试必须逐字使用 Step 6/10 状态值。`confirmed/rejected` 是同一 formal result observation 的 presentation terminal；只有 Step 10 允许的新 formal reconciliation 才能替换非终态分支，不得用旧 `05/06` 的口语状态。

## 12. 持久化、一致性、并发与幂等切口

| 测试切口 | 对应契约 | 验证内容 | 建议测试类型 |
|---|---|---|---|
| `carrier_full_record_validation` | Step 11 §§3～4 | 全对象先验证再暴露；duplicate key/forbidden field/malformed record 整体拒绝；不 partial salvage/merge | carrier contract |
| `carrier_exact_scope_operations` | carrier load/replace/invalidate/clear | `(sessionRef, contextRef?)` exact match；错误 scope 零 mutation；clear 不表示 owner revoke | carrier fake |
| `formal_call_and_local_install_not_atomic` | Step 9/11 | formal query/command 与 local replace 是两个边界；install failure 返回 safe observation+local failure，不反向补偿 owner | flow fake |
| `query_no_write_invariant` | Step 8/9/11 | 全 16 Query 零 carrier mutation、command submit、refresh/reconcile side effect | port spy matrix |
| `same_scope_single_writer` | Step 11/13 | queued local mutations 确定顺序、无定义范围内丢失更新；当前不声称 CAS/multi-tab safety | deterministic scheduler + carrier fake |
| `context_switch_rejects_late_install` | Step 13 correlation guard | old context query/page completion 不写入新 scope；敏感旧页不重现 | deferred promise flow |
| `owner_partition_completion_order` | Step 13 fan-out | 正/逆完成顺序产生同一 canonical page 与逐 owner posture | deferred port fakes |
| `double_submit_shared_action_key` | Step 13 single-flight | visual/keyboard/AT 同时触发仅一次 owner submit；第二次 blocked | concurrency flow fake |
| `command_cancel_dispatch_boundary` | Step 12/13 | adapter 证明未 dispatch 可 cancelled；可能 dispatch 则 unknown；两者均无自动 replay | controlled adapter fake |
| `carrier_ambiguous_write_reload` | Step 11～13 | adapter 先写后 timeout 时 caller reload/minimal shell；不得重复 owner command | carrier failure injection |
| `overlapping_reconciliation_install_guard` | Step 13 | older pending 不覆盖 newer formal terminal；不同 request/context 不互写 | deferred reconciliation fake |
| `invalidation_query_race_conservative` | Step 11/13 | 无 formal ordering proof 时 query 不越过 invalidation 恢复 current；不比较本地时钟 | deterministic race test |
| `owner_idempotency_not_invented` | Step 8/13 | local refs/hash/timestamp/UUID 均不传作 owner key；exact contract 缺失时 submit blocked | contract/architecture check |

本仓没有 repository、DB transaction、UnitOfWork、outbox、projection、consumer receipt 或 job replay，因此这些通用测试项明确 `not-applicable`，不得为了套模板创建 fake 服务端真相。

## 13. 错误、恢复、配置与依赖切口

| 测试切口 | 对应契约 | 验证内容 | 建议测试类型 |
|---|---|---|---|
| `port_error_kind_mapping_complete` | Step 7 error union;Step 12 | 每个 `ConsolePortErrorKind` 映射到 Command/Query/recovery safe surface；无裸 Error/message/stack 穿透 | table-driven mapper test |
| `construction_violation_mapping` | Step 6/12 | empty/duplicate/unsafe/missing source/mismatch 均得到规定的 typed error；失败对象不安装 | factory unit |
| `partial_owner_failure_isolated` | Step 12 | 一个 owner unavailable 只降级对应 partition；其余 safe partition 保留；不产生 global healthy/failed | topic flow fake |
| `forbidden_material_rejected_whole` | Step 12 | raw body/error text/policy rationale/evidence body 出现时整份 affected material 拒绝且不写 state/diagnostic | adapter + redaction test |
| `recovery_ceiling_by_subject` | Step 12 §6 | context/view/request/state/host/diagnostic 各只暴露允许 action；无 retry-all、hidden loop 或 command replay | recovery mapper unit |
| `safe_user_explanation` | Step 12 §8 | message 从 typed kind/posture 选择 controlled key；不可见对象不因错误文案泄露存在性 | presentation unit |
| `runtime_binding_fail_closed` | Step 14 §§2～5 | slot 缺失/disabled/pending 映射正确；仅 local-fake 设计 profile 可装配假端口；package/method/config flag 不激活 owner capability | composition test |
| `forbidden_configuration_rejected` | Step 14 §6 | config 无法改变 truth owner、关闭 guard、令 Query 写入、抬升状态、启用无 contract command/invalidation 或写 forbidden body | config validation test |
| `external_dependency_partial_availability` | Step 14 §4 | 每个 owner/host/state/sink 独立 availability；一个失败不摧毁无关 shell/partition；安全关键缺口保持 blocked | composition + adapter fakes |
| `no_direct_sibling_or_private_dependency` | Step 3/5/14 | 计划依赖只经 `@quantalithos/sdk`/formal service narrow seam；无 owner repo/DB/private bus/source import | architecture/static check |

## 14. 观测、审计边界与可访问性切口

| 测试切口 | 对应契约 | 验证内容 | 建议测试类型 |
|---|---|---|---|
| `diagnostic_candidate_whitelist` | Step 15 §§2/6 | candidate 仅有批准 typed refs/enums；DOM、URL、draft、payload、error message/stack、secret、storage/config 值均拒绝 | factory/redaction unit |
| `diagnostic_disabled_or_failed_isolated` | Step 15 §§2/7 | disabled 是正常 optional posture；sink fail/cancel 不递归、不改原业务响应/状态、不触发 retry | diagnostic fake |
| `metrics_low_cardinality_dimensions` | Step 15 §4 | 标签只含 phase/safe outcome/owner key/topic key/operation kind 等批准枚举；无 opaque ref/free text/fingerprint | metric contract/static check |
| `formal_audit_absent` | Step 15 §5 | Console 无 audit/evidence/report/verdict/signoff store/event/object；owner `traceRef` 只关联，不被当证明 | architecture + protocol check |
| `diagnostic_flow_locations` | Step 15 §3 | bootstrap/context/query/submit/reconcile/invalidate/recovery/a11y 的 safe cut 可调用；缺 sink 不改变 flow | flow spies |
| `visual_keyboard_at_action_equivalence` | Step 6/7/13 | 三 channel 共享同一 `InteractionActionSemantic`、guard、single-flight；hidden/disabled 同步 | accessibility semantic test |
| `focus_announcement_failure_fallback` | Step 7/12 | focus/announce 失败保留业务结果与可替代等价通道/exit；不绕过资格/visibility | host a11y fake |
| `page_binding_region_integrity` | page/accessibility models | focus key 属于 presentable semantic region；status announcement body-free；partial/error 通过语义而非颜色单独表达 | accessibility model test |

浏览器/辅助技术支持矩阵和自动化工具尚无 authority（`CON-Q-046`）；本 Step 只固定语义等价断言，不宣称具体浏览器、读屏器或 WCAG 自动扫描结果。

## 15. Step 5～15 覆盖与粒度审计

| 前序 Step | 审查问题 | 覆盖位置 | 结论 |
|---|---|---|---|
| Step 5 模块主轴 | 十模块是否均有独立测试入口，依赖红线是否可静态检查 | §6、§13～14 | pass |
| Step 6 对象/字段/状态 | 关键 factory、不变量、typed ref、状态和 forbidden field 是否可断言 | §6、§11、§13～14 | pass |
| Step 7 Port/Adapter | narrow port、fake parity、cancel/error/read-write、availability 是否可注入 | §6～10、§12～14 | pass |
| Step 8 协议 | 5 Command、16 Query、1 consumer 是否逐一有正向/异常切口；Event/Job N/A 是否受保护 | §7～10 | pass；positive owner/consumer 分支保留 blocker |
| Step 9 函数流 | 每条 flow 的顺序、副作用和调用 port 是否进入切口 | §7～10、§12 | pass |
| Step 10 状态矩阵 | 正式状态名、合法/非法和 formal-only recovery 是否覆盖 | §11 | pass |
| Step 11 一致性 | exact scope、whole-record、no-write、安装分离、失败恢复是否覆盖 | §12 | pass |
| Step 12 错误恢复 | typed mapping、redaction、取消、恢复上限和 partial failure 是否覆盖 | §7～14 | pass |
| Step 13 并发幂等 | single-writer、late result、single-flight、ambiguous/no replay、race 是否覆盖 | §12 | pass |
| Step 14 配置绑定 | fail-closed binding、partial availability、禁止配置化是否覆盖 | §13 | pass |
| Step 15 观测审计 | whitelist、low-cardinality、sink isolation、formal audit absence 是否覆盖 | §14 | pass |

审计未发现需要回改 Step 5～15 的命名或主语断裂。发现的输入缺口均已由原 Step 显式标为 `pending/blocked`，本 Step 没有用测试 fixture 将其伪关闭。

## 16. 后续测试方案边界

正式 `05-测试方案.md` 应在 full-restart 后继续展开：runner/环境、TC/EV 编号、fixture 和正式 owner contract、browser/a11y matrix、优先级、覆盖率/性能 authority、artifact/report/evidence 路径、执行与停止条件。它必须引用本 Step 的切口，不复制 Step 6/8/10 schema 形成第二真相源。

当前不创建脚本或执行脚本。05 Step 9 只定义未来 `scripts/gates|checks|reports` 的 planned boundary、固定 artifact/report 根路径和失败语义入口；具体命令、runner、输入输出 schema 与实施文件仍由目标仓/07 authority 承接。不得预造 run_id、artifact、report、evidence 或 verdict。

## 17. 回填草稿

未来正式 `03-详细设计.md` §15 应收口：

- 十模块最小测试入口；
- 5 Command、8 core Query、8 topic Query 和 conditional consumer 的逐协议切口；
- Outbound Event / Operations Job 的明确不适用保护；
- 状态机合法/非法/formal-only recovery 切口；
- scoped carrier、Query no-write、并发/single-flight/unknown、配置/依赖、diagnostic/redaction 和 a11y 等价切口；
- positive production adapter、consumer activation、browser/a11y matrix 与量化事项的 blocked 边界；
- “本 Step 未执行测试、未生成任何结果/evidence/readiness”的事实声明。

## 18. 三层门禁与结论

| 门禁 | 条件 | 结论 |
|---|---|---|
| Step / 模块级 | 十模块有入口；每个关键协议有正向与异常切口；状态合法/非法覆盖 | pass |
| 文档级 | 测试切口可回指 Step 5～15；没有替代正式 05 或伪造脚本/结果 | pass |
| 项目级 | blocker 保真；正式 03 仍关闭；未创建目标仓或执行测试 | pass |

持续 blocker：`CON-Q-034～047`，尤其 exact owner Query/Command/Result/Ref、scope/visibility/qualification/safe-field、owner idempotency/reconciliation、SDK invalidation envelope/order/dedup、state medium/serialization/TTL、diagnostic sink/vocabulary、framework/router/package manager、browser/a11y matrix 和量化 authority。它们阻塞相应 positive contract/integration/compatibility tests 与实现，不阻塞本 Step 的安全测试骨架。

Step 16 `done / pass / self_reviewed`。未运行测试，未生成 baseline、run_id、artifact、report、evidence、verdict、signoff 或 readiness；允许更新 flow/ledger 后串行进入 Step 17。
