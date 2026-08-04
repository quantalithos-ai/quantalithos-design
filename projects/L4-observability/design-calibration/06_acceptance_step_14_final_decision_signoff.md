# L4-observability 06-验收标准 Step 14 · 定义最终结论与签署口径

> 对应标准：`standards/document/验收标准讨论流程_SOP.md` Step 14；
> `standards/document/验收标准书写规范.md` §5.14。
> 本文件定义未来真实验收的裁决和签署合同，不填写当前结论、姓名、日期、签名、run、evidence alias
> 或 release authorization。

## Step 状态

| 字段 | 当前值 |
|---|---|
| project / document | `L4-observability` / `06-验收标准.md` |
| step | `14 / 定义最终结论与签署口径` |
| mode | `full-restart` |
| status | `completed_with_inherited_affected_open` |
| current_module | `final_three_value_decision_and_role_signoff_contract` |
| direct_input | current Step 03~13；验收 SOP / 书写规范；L1 参考 |
| formal_document_write | `not_allowed_until_step_15` |
| actual final decision | `absent_by_design` |
| signoff / release authorization | `absent_by_design` |
| new_upstream_blocker | `none` |
| inherited_blocker / affected | 12 项保持开放，见 §13；不得由结论或签署关闭 |
| next_allowed_action | `run_current_06_step_15_total_audit_and_assembly` |
| commit | 不需要；用户未要求提交 |

旧 Step 14 只有通用 schema 摘要，没有三值聚合、暂停与最终结论分离、签署职责、风险接受引用、
进入下一阶段和发布准备的判定。其 `pass` 只属于旧模板自述，不是 current gate。本轮按 current
31 AC、10 VF、8 NFG、9 EVG、`S/A/B/R` 和 Step 13 eligibility 合同重建。

## 1. 本步目标与边界

本 Step 固定未来真实验收的唯一最终结论集合、聚合优先级、暂停/恢复流程、签署角色和签署记录字段，
使每个最终结论都能回指固定 baseline、selected run、门禁、缺陷、风险和 review 材料。

本 Step 严格区分两件事：

1. **设计流程门禁**：Step 14 中间产物通过后，允许 Step 15 装配正式 `06`；正式 `06` 完成后才可由用户决定
   是否进入 `07` 设计。这不表示任何实现或真实验收已经通过。
2. **交付验收门禁**：未来只有真实 delivery baseline、run-scoped evidence、人工/Agent 复核和授权签署齐备后，
   才能形成产品交付物的最终结论并讨论下一阶段或发布准备。

`L4-observability` runtime、telemetry、audit projection、`ReportHandoffRecord`、`Delivered`、candidate EV 和报告
生成器都没有最终裁决或签署 authority。最终决定属于验收流程的授权角色，不反写任何业务、Governance、
Artifact、Identity、runtime 或 archive truth。

## 2. 输入与权威顺序

| 优先级 | 输入 | 本 Step 用途 |
|---:|---|---|
| 1 | 验收 SOP Step 14 / 书写规范 §5.14 | 固定三值结论、进入下一阶段、发布准备和签署表要求 |
| 2 | current Step 03~04 | 固定 baseline、canonical roots、裁决准入、正向准入、暂停和退出条件 |
| 3 | current Step 05~11 | 提供 31 AC、数据/架构、60 protocol、状态/UoW、8 NFG、9 EVG 和 10 VF 门禁 |
| 4 | current Step 12 | 提供 `S/A/B/R`、复验、关闭和放行影响 |
| 5 | current Step 13 | 提供 eligibility、有效风险记录、到期/重开和 affected 隔离 |
| 6 | current `00~05` | 判定 P0/P1/P2、truth owner、profile/lane 和测试证据主键 |
| 7 | L1-governance / L1-artifact Step 14 | 只参考结构和粒度，不复制其 VETO、角色决定或实际结论 |

旧正式 `06`、README、旧 Step 14、旧 `VETO-OBS-*`、旧缺陷等级和任何“已通过/已签署”文本均为
`historical_material`，不能成为 current signoff input。

## 3. SOP 问题回答

| SOP 问题 | Current 回答 |
|---|---|
| 结论只能有哪些取值 | 只允许 `通过`、`有条件通过`、`不通过`。禁止“基本/原则/暂时/待观察通过”等变体。 |
| 何时允许进入下一阶段 | 未来真实验收中：所有 P0 与证据硬门禁成立、VF/S 为零、签署完整时可进入；仅有有效 accepted residual 时可有条件进入。设计期只按文档 gate 进入 Step 15/07，不使用产品验收结论。 |
| 何时允许发布准备 | 最终结论为通过或有条件通过，且条件不涉及 P0 truth、安全、redaction、no-write、dependency、evidence integrity、active retention；同时满足独立实施/部署门禁。本文不授权生产发布。 |
| 哪些角色必须签署 | 范围/产品、架构与 truth boundary、测试/evidence、实施/delivery、运维/安全/合规及最终验收 authority 必须按职责确认；真实人员和组织授权待送验时绑定。 |
| 签署是否代表风险接受 | 不自动代表。每项 residual 必须先由具名 acceptor 在风险记录中单独接受；最终签署只确认引用的风险集合有效且与结论一致。 |

## 4. 当前材料诊断与改动前后对比

| 议题 | 旧材料问题 | Current 处理 |
|---|---|---|
| 结论集合 | 泛写待评审或混入暂停 | 最终只保留三值；暂停是无最终结论的流程状态 |
| 聚合规则 | 没有跨门禁 precedence | VF/S/P0 hard failure 优先，conditional 次之，全 pass 才通过 |
| evidence 缺失 | 容易直接写“不通过或暂停” | 区分可裁决失败与不可裁决缺口，禁止模糊二选一 |
| 下一阶段 | 容易混淆设计推进和产品放行 | 明确 document gate 与 delivery acceptance gate 两条链 |
| 发布准备 | 容易等同 production release | 只允许进入准备，仍受 `07`、部署、运维和组织门禁约束 |
| 签署 | 只有角色占位，没有职责和输入 | 固定 role capability、必审材料、记录字段和拒签条件 |
| 风险 | 最终签署可能批量接受 | 必须逐项 `Accepted` 且未过期，签署不补字段 |
| verdict owner | runtime/report generator 可能越权 | 最终裁决只由验收 authority 形成，产品输出仅供输入 |

## 5. 裁决设计取舍

| 议题 | 采用方案 | 放弃方案 | 理由 |
|---|---|---|---|
| 最终取值 | 三值封闭集合 | 增加“暂停/不可裁决/基本通过” | 规范要求明确、可聚合结论 |
| 暂停 | 流程状态，无 final decision | 第四种最终结果 | 缺 baseline 时还没有合法裁决对象 |
| 聚合 | fail 优先，其次 conditional，最后 pass | 投票或平均分 | 红线不能被多数低风险门禁抵消 |
| 缺证据 | provenance 不足时暂停；真实 blocked/failure 可裁决不通过 | 人工说明补证或统一算失败 | 区分“证实失败”和“无法判断” |
| 签署 | 每个专业职责显式确认 | 单一 Owner 代签全部 | redaction、truth、evidence 和 delivery 需要分别审查 |
| 风险接受 | 逐项先接受，最终签署只引用 | 最终签署一次性接受全部 open issues | 防止隐藏 residual 或覆盖 VF/S |
| 发布 | 只授权进入发布准备讨论 | `06` 直接授权 production release | 部署和运行门禁不属于本 Step |

## 6. 三值最终结论合同

### 6.1 最终结论定义

| 最终结论 | 必须同时满足 | 明确禁止 | 后续语义 |
|---|---|---|---|
| `通过` | baseline/selected run 固定；全部 required P0 门禁通过；10 VF 有真实未触发审查；S=0；A=0；无影响结论的 open B/R；证据与签署完整 | blocked/not_run/not_evaluated 冒充 pass；风险表代替 P0 证据 | 可进入下一阶段与发布准备评估，不等于上线授权 |
| `有条件通过` | 与通过相同的 P0/VF/S/evidence 硬前提；仅剩逐项有效、未过期的严格 A/B/R/P1/P2/future/operations residual | 任一 VF/S、required P0 缺失、硬门禁失败、affected positive 未闭合、无 acceptor/deadline/action | 可按签署条件进入下一阶段；条件持续跟踪，失效即重开 |
| `不通过` | 至少一个可复核 P0/VF/S/hard gate failure，或 required capability 有真实 blocked/not-run record 且基线规定其必须完成 | 用“不通过”掩盖无法定位被测物或证据被篡改 | 修复后按 Step 12 新 run 复验并重新裁决 |

三值是**最终记录**的值，不是门禁执行状态。`failed`、`blocked`、`not_run`、`not_evaluated`、`indeterminate`
先按各 Step 规则归类，再由本节聚合。

### 6.2 流程状态，不是第四种结论

| 流程状态 | 触发条件 | 唯一动作 | final decision 字段 |
|---|---|---|---|
| `pause_not_adjudicable` | delivery/baseline/run identity 不存在，required raw/report provenance 无法定位，材料被篡改或 scope 冲突 | 冻结评审，回流补基线/设计/证据，保留 finding | 必须为空 |
| `blocked_adjudicable` | required runner/capability 不可用但有真实、完整 unavailable record，且 baseline 明确 required | 作为阻断输入聚合为不通过，或按变更流程先修改 baseline 再重验 | 裁决后可为不通过 |
| `review_in_progress` | 材料齐备但专业审查/签署未完成 | 完成审查；不得发布 draft verdict | 必须为空 |
| `retest_required` | 缺陷修复、risk 失效、baseline 或 scope 变化 | 新 invocation/run，保留旧失败与决定 | 旧结论只读；新结论为空 |
| `superseded` | 新 review version 以明确 lineage 替代旧决定 | 保留旧记录，不作为当前 release input | 旧值不可改写 |

报告生成器可以投影上述流程输入，但不得填写 final decision。没有合法 final decision 与“最终结论为不通过”
不是同一件事。

## 7. 结论维度与聚合矩阵

### 7.1 必审维度

| 维度 | Current 主键 | 正向要求 | 阻断/暂停输入 |
|---|---|---|---|
| 功能能力 | `AC-OBS-001~031` | 31/31 由 exact TC、candidate linkage 和 report 独立证明 | 任一 required AC failed；orphan/missing 时暂停或 blocked |
| 数据/架构 | Step 06 redline | observation-side owner、body-free、writer graph、only-core 全成立 | truth/body/dependency violation 直接 hard failure |
| 协议/跨仓 | 60 exact protocol | schema、seam、failure、no-write、evidence 全可判定 | required positive missing；I05/J06 伪造 positive |
| 状态/事务 | 27 formal owner + 1 technical；23 transaction gate | legal/illegal、UoW、幂等、并发、恢复和 zero-write 成立 | partial/blind retry/stale/unknown guess/source write |
| 非功能 | `NFG-OBS-001~008` | required structural gate 和 selected profile/lane 成立 | hard gate failure；无来源数字不得充当失败阈值 |
| 证据 | `EVG-OBS-001~009` | 99-row join、82 DS、9 suite、5 scripts/checks、same-run provenance 完整 | wrong run/`latest`/static pass/orphan/缺 required review |
| 一票否决 | `VF-OBS-001~010` | 每项有真实证据和 reviewer 的 `not_triggered_reviewed` | 任一 triggered 即总体不通过；缺证不等于未触发 |
| 缺陷 | `S/A/B/R` | S=0；A 按结论要求；复验/关闭证据完整 | S 或影响 P0 的 A；关闭证据不完整 |
| 风险 | Step 13 `ELG-OBS-01~10` | conditional 使用的每项均 `Accepted`、有效、未过期 | Draft/Rejected/Expired/Reopened 不得支撑 conditional |
| 交接/签署 | acceptance/review package | selected run、open issue、签署输入与结论一致 | handoff 未审、角色缺失、签署引用漂移 |

### 7.2 聚合优先级

```text
不可裁决前置缺失
  -> pause；不产生 final decision

可裁决输入中存在 VF / S / required P0 / hard gate failure
  -> 不通过

无上述 failure，但存在有效且允许的 Accepted residual
  -> 有条件通过

无 failure、无 conditional residual，全部 required gate 与签署完整
  -> 通过
```

聚合规则：

1. 任一维度的 hard failure 不能被其他维度通过抵消。
2. 任何 `conditional` 都必须回指 Step 13 的有效风险记录；自由文本说明不算。
3. optional/P1/P2 `not_evaluated` 只有在 baseline 明确非 required 且已合法记录 residual 时，才不污染 P0。
4. inherited affected 不自动等于 finding；但对应 positive capability 未闭合时，不能将相关 AC 写为无条件通过。
5. evidence integrity failure 优先于绿色 suite summary；summary 不能修复 provenance。

## 8. 进入下一阶段与发布准备

| 场景 | 是否可进入下一阶段 | 是否可进入发布准备 | 约束 |
|---|---|---|---|
| 最终 `通过` 且签署完整 | 是 | 可进入独立发布准备评估 | 仍需实施计划、部署、运维、安全和组织门禁 |
| 最终 `有条件通过` 且全部条件在授权范围 | 有条件 | 仅当每个条件不影响 release hard gate | 按 deadline/trigger 跟踪；任一失效立即重开 |
| 最终 `不通过` | 否 | 否 | 修复、复验、新 review 后重新裁决 |
| `pause_not_adjudicable` / `review_in_progress` | 否 | 否 | final decision 为空，不得使用 draft |
| 文档 Step 15 完成 | 可由用户决定进入 `07` 设计 | 不适用 | 只表示设计文档链完整，不是产品放行 |

`06` 不授予 production deploy、traffic enable、data migration、cleanup、archive deletion 或 external product activation
authority。特别是 `RetentionMarker`、handoff `Delivered`、Job `Completed` 和 telemetry clean 均不是 release authorization。

## 9. 签署角色与最小职责

### 9.1 角色能力矩阵

| 签署角色能力 | 必须确认 | 必须拒签的情形 |
|---|---|---|
| scope / product owner | P0/P1/P2、Out of Scope、用户/产品影响、进入下一阶段条件 | scope 与 baseline 不一致、required 能力被隐式降级 |
| architecture / truth-boundary owner | observation-side owner、no-write、only-core、60 protocol、affected 边界 | source truth 反写、非法依赖、产品成为 truth、affected 被伪造关闭 |
| test / evidence owner | selected run、99 TC/82 DS/9 suite/5 check、before/after、same-run provenance | missing raw/report、wrong run、`latest`、static pass、required lane 替代 |
| implementation / delivery owner | immutable delivery ref、build/config/dependency manifest、实现范围和 open technical issue | 被测物不固定、实现范围与送验声明不一致 |
| operations / security / compliance owner | redaction、safe telemetry、retention protection、profile、external handoff、运维 residual | forbidden body、secret、高基数、protected cleanup、未授权外部 binding |
| final acceptance authority | 三值聚合、VF checklist、defect、risk、open issue、全部专业签署一致 | 任一 required role 缺失、risk 过期、材料 digest 漂移、模糊结论 |

真实组织可以把多个能力授予同一人，也可以拆得更细，但必须记录 authority scope，并逐项保留上述责任；
不得因角色合并删除 test/evidence 或 truth-boundary 审查。涉及风险时，risk acceptor 仍需满足 Step 13 的独立授权。

### 9.2 签署输入与顺序

```text
sealed baseline + selected run
  -> gate / evidence / VF / defect review
  -> per-risk acceptance (conditional only)
  -> professional role signoffs
  -> final acceptance authority aggregation
  -> immutable decision/signature record
```

final authority 不能先签空白结论再由脚本回填；任何输入 digest、risk set 或 scope 在签署过程中变化，当前
review version 失效并回到 `review_in_progress`。

## 10. 签署记录字段合同

实际受控签署记录至少包含：

| 字段 | 必填 | 约束 |
|---|---|---|
| `review_version` | 是 | 非 `latest`；与 acceptance/review package 一致 |
| `baseline_id` / `baseline_digest` | 是 | 回指冻结的 design/delivery/config/data/dependency baseline |
| `selected_run_refs` | 是 | 一个合法选择集合；不得跨 run 拼接 |
| `acceptance_package_digest` | 是 | 固定 handoff/veto/risk/open-issues/review 输入 |
| `decision_dimension_results` | 是 | §7 十个维度逐项三值输入或暂停原因 |
| `final_decision` | 最终裁决时是 | 只能 `通过` / `有条件通过` / `不通过` |
| `decision_reason` | 是 | 回指 gate、VF、defect、risk，不写“综合考虑” |
| `accepted_risk_refs` | conditional 时是 | 只引用有效、未过期的逐项 `Accepted` 记录 |
| `blocking_refs` | fail 时是 | 回指真实 finding/defect/report；不得只写摘要 |
| `next_stage_disposition` | 是 | `allow` / `allow_with_conditions` / `deny`，必须与三值一致 |
| `release_preparation_disposition` | 是 | 只表示准备评估；不等于 production release |
| `role` / `principal_ref` | 是 | 具名主体和职责角色；不能只有“团队” |
| `authority_scope_ref` | 是 | 证明该主体对对应范围有签署 authority |
| `role_decision` / `exceptions` | 是 | `agree` / `reject` 及具体异常；禁止模糊同意 |
| `signed_at` / `signature_ref` | 是 | 由真实签署系统生成；设计期不得预填 |
| `supersedes_ref` | 条件必填 | 新 review 替代旧记录时保持 lineage |

签署记录属于验收流程 truth，不属于 `L4-observability` runtime truth。产品 runtime 和 report generator 只能提供
body-free input refs/digests；不能生成 principal、authority、签名或 final decision。当前标准未冻结实际签署系统和
最终记录 backing path，本 Step 不伪造该绑定；真实验收启动前必须由组织验收流程固定，并由
`reports/acceptance/handoff.md` 以 body-free ref 交接。

## 11. Canonical 验收与审查包

| 材料 | 必需性 | 最终签署用途 | 不得表达 |
|---|---|---|---|
| `reports/acceptance/handoff.md` | 必需 | selected run、scope、baseline、roots、open state 交接 | generator final verdict/signoff |
| `reports/acceptance/veto-checklist.md` | 必需 | 10 VF 逐项 evidence/finding/review 输入 | 缺证据自动未触发 |
| `reports/acceptance/open-issues.md` | 必需 | defect、affected、blocked、pending、owner 和恢复路径 | 删除或改写开放项 |
| `reports/acceptance/risk-acceptance.md` | conditional 必需 | 引用有效 Accepted residual | 接受 VF/S/缺 P0 证据 |
| `reports/review/reviewer-notes.md` | 必需 | 人工专业复核、冲突、回流和决定输入 | 修改 raw/report 或代签 |
| `reports/review/agent-review.md` | 按实际流程 | 自动/Agent provenance review 辅助输入 | 作为唯一签署主体或自动通过 |
| `reports/runs/<run_id>/evidence-index.md` | 必需 | 99-row evidence join | 手写 alias 或跨 run 拼接 |
| `reports/runs/<run_id>/gate-results.md` | 必需 | 9 suite、5 check、profile/lane/status 汇总 | 吞掉 blocked/failed/not_run |
| `reports/runs/<run_id>/redaction-check.md` | 必需 | forbidden material 与全 root scan | 未执行却写 clean |
| `reports/runs/<run_id>/metric-label-check.md` | 必需 | label allowlist/cardinality | 只查 descriptor 不查样本 |
| `reports/runs/<run_id>/dependency-boundary.md` | 必需 | only-core、writer/product/history 边界 | 只扫描直接 manifest |
| `reports/runs/<run_id>/report-audit.md` | 必需 | raw/report/index same-run provenance | summary 代替 raw relation |

所有材料保持 canonical roots：`artifacts/test/<run_id>/`、`reports/runs/<run_id>/`、
`reports/acceptance/`、`reports/review/`。不新增 `latest`、project-prefixed root 或第二套 evidence identity。

## 12. 签署含义与失效

| 签署对象 | 表示 | 不表示 |
|---|---|---|
| `通过`签署 | 本次冻结输入下，P0/VF/S/evidence/风险条件满足三值规则 | P1/P2/future 已完成；生产已授权 |
| `有条件通过`签署 | P0 硬门禁成立，引用 residual 已逐项承担 | VF/S/affected positive/缺证据可被接受 |
| `不通过`签署 | 本次被测物存在可复核阻断 | 项目永久终止或旧失败证据可删除 |
| 专业角色签署 | 对本角色职责内材料确认或拒绝 | 替代其他角色或最终聚合 |
| risk acceptor 签署 | 接受指定 residual、动作和期限 | 接受未列风险或自动同意总体结论 |
| final authority 签署 | 最终结论与所有输入、签署和风险集合一致 | 反写业务 truth 或授权产品 runtime 生成 verdict |

签署在 baseline、selected run、scope、gate result、risk set、open issue、authority 或 package digest 变化时失效。
旧记录必须保留为只读历史；新 review 必须通过 `supersedes_ref` 建立 lineage，不得修改旧日期、签名或结论。

## 13. Inherited affected 与当前真实性

以下 12 项继续开放：

`S08-E-I05-PAYLOAD-SCHEMA-01`、`S08-E-I05-PRODUCER-EVENT-BINDING-01`、`R06.6-F2-H13-UPSTREAM`、
`R06-F-AFFECT-UOW-01`、`S08-RECOVERY-CLASS-OWNER-01`、`R07-EXTERNAL-PHASE-LINK-01`、
`R07-EXTERNAL-PHASE-RETRY-ACCOUNTING-01`、`S08-CONSUMER-OUTBOX-SURFACE-01`、
`S08-CONSUMER-INDETERMINATE-COMPLETION-01`、`S08-JOB-REPORT-REF-OWNER-01`、
`S08-M1-SECONDARY-TYPE-OWNER-01`、`03-RPR-S09-PER-FLOW`。

I05 只允许 pre-parse/schema/binding fail-closed；J06 只允许 controlled `Blocked/manual`。签署不得把这些
受控负向行为写成 positive capability complete，也不得用总体结论改变其 owner 或状态。未来范围若明确排除相关
positive capability，必须先按 baseline/scope 变更重审 AC/TC/VF，不得由签署表临时降级。

目标实现仓、delivery commit/build、CI、RuntimeLike、真实 run/artifact/report/evidence、risk acceptance 和签署均未建立。
因此本轮只完成**裁决合同设计**，当前没有真实 final decision，也没有新的上游 blocker。

## 14. 正式 `06` §14 回填草稿

> 校准来源：
> - `design-calibration/06_acceptance_step_14_final_decision_signoff.md`
>
> 延伸阅读：
> - 建议继续阅读本文件的“三值最终结论合同”“结论维度与聚合矩阵”“进入下一阶段与发布准备”
>   “签署角色与最小职责”“签署记录字段合同”“Canonical 验收与审查包”和“签署含义与失效”。

正式 §14 应承载：

- 最终结论只允许 `通过`、`有条件通过`、`不通过`；暂停/不可裁决是 final decision 为空的流程状态。
- VF/S/required P0/hard gate failure 优先聚合为不通过；无 failure 但有有效 accepted residual 才可有条件通过；
  全部 required gate 和签署成立且无 residual 才可通过。
- 缺 baseline/run/provenance、材料篡改或 scope 冲突时暂停，不得伪填第四种结论或人工通过。
- 签署按 scope、architecture/truth、test/evidence、implementation/delivery、operations/security/compliance 和
  final authority 职责分离；签署记录绑定 review、baseline、selected run、package digest 和风险集合。
- 风险必须在 `risk-acceptance.md` 逐项先接受；最终签署不批量接受 open issue，不覆盖 VF/S/affected。
- 通过或有条件通过只允许进入下一阶段/发布准备评估，不直接授权 production release。
- 当前不填写真实结论、主体、日期、签名、run、evidence alias 或 release authorization。

## 15. 待确认事项

| ID | 待确认事项 | 当前状态 | 影响 |
|---|---|---|---|
| `Q-06-14-01` | 实际组织的具名 signer、authority scope 和职责合并规则 | `not_assigned` | 未绑定前不能签署 |
| `Q-06-14-02` | 真实签署系统及最终 decision record backing/ref 格式 | `not_frozen` | 验收启动前必须固定；本文不发明路径 |
| `Q-06-14-03` | 某次 release 的 required profile/lane 与 RuntimeLike 要求 | `not_selected` | 决定 blocked 与 optional residual |
| `Q-06-14-04` | 外部合规/安全是否需要独立 signer | `not_decided` | 根据数据、区域和产品 binding 决定 |
| `Q-06-14-05` | 真实 delivery、run、evidence 和 risk records | `target_absent` | 当前无法形成任何实际三值结论 |

## 16. Step 自检与 gate

| 检查项 | 结论 | 说明 |
|---|---|---|
| 最终结论是否只有三值 | `pass_design` | 无第四种最终结果 |
| 暂停与不通过是否分离 | `pass_design` | 不可裁决时 final decision 为空 |
| 跨门禁聚合 precedence 是否明确 | `pass_design` | fail > conditional > pass；前置缺失先暂停 |
| 进入下一阶段和发布准备是否可判定 | `pass_design` | §8；不授权 production release |
| 签署角色职责是否完整 | `pass_design` | 六类能力和最小拒签条件 |
| 签署是否自动接受风险 | `no` | Step 13 逐项先接受 |
| runtime/report 是否可生成 verdict/signoff | `no` | 只提供 body-free input refs/digests |
| 12 项 affected 是否被签署关闭 | `no` | 继续开放 |
| 是否填写真实结论或签署 | `no` | current final decision absent |
| 是否发现新上游 blocker | `none` | target reality 和 inherited affected 保持原状态 |
| 正式 `06` 是否修改 | `no` | Step 15 才允许装配 |
| `gate_status` | `pass_for_final_decision_signoff_design` | 可进入 Step 15；不是实际验收通过 |
| `next_allowed_action` | `run_current_06_step_15_total_audit_and_assembly` | 先同步 flow/ledger，再做全文总审计 |

## 17. 参考

- `standards/document/验收标准讨论流程_SOP.md` Step 14
- `standards/document/验收标准书写规范.md` §5.14
- `standards/document/设计文档讨论中间产物规范.md`
- `standards/document/设计真相源闭环与可落码性标准.md`
- `projects/L4-observability/00-需求文档.md`
- `projects/L4-observability/03-详细设计.md`
- `projects/L4-observability/04-配置设计.md`
- `projects/L4-observability/05-测试方案.md`
- `projects/L4-observability/design-calibration/06_acceptance_step_03_baseline.md`
- `projects/L4-observability/design-calibration/06_acceptance_step_04_entry_exit.md`
- `projects/L4-observability/design-calibration/06_acceptance_step_05_function_gate.md` through
  `06_acceptance_step_13_risk_acceptance.md`
- `projects/L1-governance/design-calibration/06_acceptance_step_14_final_decision_signoff.md`
- `projects/L1-artifact/design-calibration/06_acceptance_step_14_final_decision_signoff.md`
