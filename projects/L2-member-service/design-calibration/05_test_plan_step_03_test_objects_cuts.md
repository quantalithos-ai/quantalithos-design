# Step 3. 抽取测试对象与测试切口

> 对应 SOP：`standards/document/测试方案讨论流程_SOP.md` Step 3
> 回填章节：`05-测试方案.md` §3

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 3 测试对象与测试切口 |
| 当前状态 | `completed / pass_with_upstream_blockers` |
| 直接来源 | `03` §4~§15、`03_ddd_step_16_test_cut.md`、`04` §12 |
| 停审结论 | P0 切口均有正式来源；真实 sibling / product positive 仍 blocked |

## 2. 对象与切口总表

| 测试对象 / 分母 | 设计来源 | 测试切口 | 风险 | 推荐层级 |
|---|---|---|---|---|
| `contracts` refs / metadata / DTO / outcome | `03` §5~§7 | `contracts_protocol_roundtrip`、`contracts_metadata_validation`、`contracts_redaction` | 字段漂移、引用混同、body 泄漏 | unit / contract |
| 29 个 domain object / policy | `03` §6、§9 | `domain_object_invariants`、`domain_policy_guards`、`domain_state_matrix` | 不变量缺失、非法迁移、状态越级 | domain unit |
| 10 Command | `03` §7~§8 | `application_command_orchestration`、每个 Command accepted + negative | UoW 顺序、sidecar 漏写、duplicate 重跑 | service / API |
| 6 Query | `03` §7~§8 | `application_query_no_write`、每个 Query hit + no-write | 查询修复 truth、stale 被隐藏 | service / API |
| 5 Inbound Consumer | `03` §7~§8 | `application_consumer_orchestration`、version/dedup/late | 外部正文入仓、旧 generation 覆盖 | worker / service |
| `HostFactMaterialEventCandidate` + outbox | `03` §7.5、§8.5 | `material_outbox_snapshot` | 现查现组包、提交层级误升格 | contract / integration |
| 7 Operations Job | `03` §7.5、§8.5 | `operations_job_report_no_truth_repair` | Job 反写 truth、重复执行、新 key | job runner |
| logical stores / UoW / idempotency | `03` §10~§12 | `consistency_idempotency_recovery` | revision、rollback、commit unknown、result 缺失 | fake integration |
| config / runtime builder | `04` §6~§11 | `config_validation_builder` | invalid fallback、profile 泄露、partial facade | config / builder |
| observability / redaction | `03` §14、`04` §8 | `redaction_observability` | secret、body、高基数标签泄漏 | unit + artifact scan |
| module dependency | `01` §8、`03` §4/§13 | `dependency_boundary` | runtime/event/ref 被写成 compile | architecture check |

## 3. 测试切口设计真相源表

| 切口 | 设计真相源 | 覆盖内容 | 优先级 | 用例要求 |
|---|---|---|---|---|
| `contracts_protocol_roundtrip` | `03` §7 | 10/6/5/1/7 DTO、metadata、schema/version、required fields | P0 | roundtrip、缺字段、unsupported version |
| `domain_object_invariants` | `03` §6 | 29 对象 factory、双锚、scope、ref-only、reason、revision | P0 | happy + invariant reject |
| `domain_state_matrix` | `03` §9 | 正交状态轴、合法/非法、terminal、supersedes | P0 | 每轴主线 + 非法迁移 |
| `application_command_orchestration` | `03` §8、§10~§13 | validate→reserve→UoW→truth→sidecar/result→commit | P0 | accepted、reject、duplicate、conflict、rollback |
| `application_query_no_write` | `03` §7.3、§8.3 | visible/not-visible/degraded/unavailable、严格 no-write | P0 | hit + write audit |
| `application_consumer_orchestration` | `03` §7.4、§8.4 | envelope/version/source/generation、snapshot/attempt/gap/receipt | P0 | accepted、duplicate、unsupported、delayed |
| `material_outbox_snapshot` | `03` §7.5、§10.4 | committed material、immutable payload、outbox marker | P0 | payload 不从 current truth 重算 |
| `operations_job_report_no_truth_repair` | `03` §7.5、§8.5 | 7 jobs、selector、report、partial、duplicate | P0 | 无已提交 work、no truth repair |
| `consistency_idempotency_recovery` | `03` §10~§12 | revision、cursor 分离、UoW rollback、same/different digest、unknown | P0 | 原 key 保留、缺 result 不重算 |
| `config_validation_builder` | `04` §5~§12 | strict JSON、profile、cross-field、builder、failure | P0 | invalid fail-fast、no partial facade |
| `redaction_observability` | `03` §14、`04` §8/§11 | safe context、低基数、forbidden-field scan | P0 | logs/error/audit/trace/report/output 均无正文 |
| `dependency_boundary` | `01` §8、`03` §4 | 仅允许已确认 compile seam；其余 adapter/ref/event/runtime | P0 | 静态依赖检查 |

## 4. Public protocol 入口清单

| 协议族 | 数量 | P0 入口要求 |
|---|---:|---|
| Command | 10 | 每条至少 accepted、invalid、duplicate / conflict 候选 |
| Query | 6 | 每条至少 visible / no-write，代表性 missing / degraded |
| Inbound Consumer | 5 | 每条 accepted、duplicate、unsupported / delayed |
| Material helper | 1 | committed source → immutable safe payload；缺 cursor blocked |
| Operations Job | 7 | completed candidate、invalid / partial / duplicate、no truth repair |

## 5. 字段 / 状态 / 引用混同负向切口

| 风险 | 测试切口 | 正式断言 |
|---|---|---|
| 缺 ProjectMember / GlobalMember / source / scope | `invalid_request_no_uow` | `Rejected` / `Blocked`，不 begin write UoW |
| non-project 主语或默认 actor | `unsupported_subject_fail_closed` | 不创建 HostIntent / Host |
| `Complete`、`Associated`、`Succeeded` 被当作 `Ready` | `state_axis_non_transitive` | 各状态轴独立，返回正式非正向结果 |
| old generation feedback | `old_generation_feedback_is_late` | 只写 late/gap/unknown，不覆盖 current |
| raw body / secret / manifest / endpoint | `forbidden_body_rejected` | 不保存、不输出、不进入 artifact/report |
| Query 触发 refresh/rebuild/repair | `query_write_audit` | 无 write UoW、reservation、stale marker 或 audit append |
| Job 创建 decision/generation/new effect key | `job_no_authorization_or_new_key` | 只推进既有 work/report |
| cursor 被当 version 或第三 cursor | `cursor_separation_guard` | 两类 cursor 语义分离，缺 exact type 时保持 type hole |
| adapter `Ok` 被当 external completion | `adapter_ok_not_completion` | 保留 local attempt / submitted / unknown |

## 6. P0 切口停审记录

| 切口 | 来源明确 | 风险具体 | 层级合理 | 可留证 | 结论 |
|---|---|---|---|---|---|
| contracts | 是 | 是 | 是 | 是 | pass |
| domain/state | 是 | 是 | 是 | 是 | pass |
| commands/queries/consumers | 是 | 是 | 是 | 是 | pass |
| material/jobs | 是 | 是 | 是 | 是 | pass |
| consistency/config/redaction/dependency | 是 | 是 | 是 | 是 | pass |

## 7. 跨切口设计来源审计

| 审计项 | 结论 | 处理 |
|---|---|---|
| 29 对象是否都有入口 | 已覆盖 | 由 domain object / protocol / flow 切口承接 |
| 10/6/5/1/7 分母是否漂移 | 无漂移 | 以 `03` 为准，不引入 outbound event 伪分母 |
| 状态名是否使用正式名称 | 已覆盖 | 以 `03` §9 为准 |
| P0 是否依赖真实 sibling | 否 | 受控 fake / placeholder / blocked |
| 孤儿设计契约 | 未发现 | Step 5/6 再做双向审计 |

## 8. 回填草稿

正式 §3 应按模块、对象 / policy、协议、状态、一致性、配置、观测和依赖切口列出测试对象；明确 10/6/5/1/7 分母，避免把未定义的 outbound event family 写成已闭合事实。

## 9. 待确认与进入条件

| 事项 | 当前状态 |
|---|---|
| Core / Bus exact envelope、route、receipt | pending；协议测试使用 placeholder |
| Member / Images / Runtime / Sandbox exact mapper | blocked；测试只验证 safe boundary |
| cursor exact type | pending；只测分离红线 |

- [x] 每个 P0 对象有测试切口。
- [x] 每个切口有来源、风险和推荐层级。
- [x] 可进入 Step 4。
