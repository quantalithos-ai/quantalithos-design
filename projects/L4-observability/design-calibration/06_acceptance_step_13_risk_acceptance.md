# L4-observability 06-验收标准 Step 13 · 定义风险接受与遗留项

> 对应标准：`standards/document/验收标准讨论流程_SOP.md` Step 13；
> `standards/document/验收标准书写规范.md` §5.13。
> 本文件只定义未来风险接受合同，不记录某项风险已经被接受，不包含真实姓名、日期、运行结果、
> evidence alias、验收结论或签署事实。

## Step 状态

| 字段 | 当前值 |
|---|---|
| project / document | `L4-observability` / `06-验收标准.md` |
| step | `13 / 定义风险接受与遗留项` |
| mode | `full-restart` |
| status | `completed_with_inherited_affected_open` |
| current_module | `residual_eligibility_acceptance_record_and_expiry` |
| direct_input | current Step 09~12；current `05` Step 14；验收 SOP / 书写规范；L1 参考 |
| formal_document_write | `not_allowed_until_step_15` |
| implementation / test execution | `not_started` / `not_run` |
| acceptance record / signoff | `absent_by_design` |
| new_upstream_blocker | `none` |
| inherited_blocker / affected | 12 项保持开放，见 §12；不得通过风险接受关闭 |
| next_allowed_action | `rebuild_current_06_step_14` |
| commit | 不需要；用户未要求提交 |

旧 Step 13 只有通用 observability schema 摘要，没有回答 residual eligibility、接受记录字段、失效、重开和
遗留项承接问题，其 `pass` 结论不可信。本轮不继承旧稿，按 current `VF-OBS-001~010`、`S/A/B/R`、
99 条 exact TC 的证据合同和测试侧 `RR-OBS-*` 风险来源重建。

## 1. 本步目标与边界

本 Step 定义有条件通过所需的风险接受结构，回答哪些非 P0 遗留项可以成为候选、哪些红线永远不能接受、
接受记录必须由谁承担、何时自动失效，以及遗留项如何进入后续实施、测试、运维或产品绑定工作。

风险接受只承接“P0 已由真实证据独立成立之后仍然存在的 residual”。它不能：

1. 把 `blocked`、`not_run`、`not_evaluated` 改写为 `passed`。
2. 补造缺失的 raw artifact、suite report、evidence index、正式 evidence alias 或签署。
3. 覆盖 `VF-OBS-001~010`、S 级缺陷或 truth/no-write/redaction/dependency/active-retention 红线。
4. 宣称某个 inherited affected 的 positive capability 已经存在。
5. 把 telemetry、`Delivered`、`ReportHandoffRecord` 或 candidate EV 当成风险已被接受的事实。
6. 修改 Governance、Artifact、Identity、runtime、archive 或其他业务 truth。

本 Step 只固定验收报告侧的记录合同。实际 risk owner、acceptor、日期、决定、follow-up ref 和 evidence refs
必须在真实送验时填写；当前全部保持 `not_assigned` / `not_available`。

## 2. 输入与权威顺序

| 优先级 | 输入 | 本 Step 用途 |
|---:|---|---|
| 1 | 验收 SOP Step 13 / 书写规范 §5.13 | 固定接受人、后续动作、截止时间和不可覆盖 VETO 的最低要求 |
| 2 | current Step 11 | 提供唯一正式否决集合 `VF-OBS-001~010` 和不可风险接受边界 |
| 3 | current Step 12 | 提供 `S/A/B/R`、A 严格候选条件、B/R residual 和复验要求 |
| 4 | current Step 09~10 | 提供未冻结阈值、lane 真实性、runtime observation 与 acceptance evidence 分界 |
| 5 | current `05` Step 14 | 提供 `RR-OBS-001~009`、回归触发和 inherited affected 分流 |
| 6 | current `00~04` | 判定 P0/P1/P2、truth owner、required profile 和正式设计基线 |
| 7 | L1-governance / L1-artifact Step 13 | 只参考结构和粒度，不复制其对象、VETO、风险或角色决定 |

旧正式 `06`、README、旧 Step 13 以及其中任何 P95、SLA、TimescaleDB、Grafana、冷存天数或
“已通过”描述均为 `historical_material`，不能成为接受理由或阈值来源。

## 3. SOP 问题回答

| SOP 问题 | Current 回答 |
|---|---|
| 哪些风险可以支持有条件通过 | 只有不属于 VF/S/P0 必需证据、不污染 P0 结论、具有真实 evidence refs，且 owner、acceptor、action、deadline/trigger 全部完整的 B/R、严格受限 A、P1/P2/future/operations residual。 |
| 哪些风险不能接受 | 任一 VF/S、P0 truth/no-write/redaction/dependency/evidence authenticity/active-retention 失败、required P0 未执行、伪造 positive affected、静态造证据及目标现实缺失。 |
| 每个风险的接受人是谁 | 本 Step 只固定授权角色类型；真实姓名和授权范围由送验基线提供。缺具名 acceptor 或越权角色时不能支持有条件通过。 |
| 后续动作和截止时间是什么 | 每条记录必须同时有可验证 action、follow-up ref、deadline 或客观 trigger、补验范围和失效规则；不能只写“后续优化”。 |
| 是否同步实施计划或问题记录 | 必须。实现/测试进入 `07` boundary 或 issue，运维/retention 进入 runbook，产品 binding 进入 ADR/认证计划，阈值进入需求与性能基线；当前不提前修改 `07`。 |

## 4. 当前材料诊断与改动前后对比

| 议题 | 旧材料问题 | Current 处理 |
|---|---|---|
| 风险来源 | 泛化 schema 摘要，没有 residual 清单 | 承接 `RR-OBS-001~009` 并逐项判定 eligibility |
| 风险与前置缺失 | 真实 run/evidence 不存在也可能被列为 risk | 前置缺失单列，禁止 risk acceptance |
| affected | 上游/本仓设计缺口可能混入 residual | 12 项进入独立 affected register，不得普通接受 |
| A 级 | 没有逐项证明条件 | 要求无 VF/S、无 P0 污染、证据完整、授权完整和确定复验 |
| B/R | 可接受口径过于宽泛 | 仍需影响、证据、owner、acceptor、期限和重开条件 |
| P1/P2 | 容易反向补足 P0 | 明确 `p0_non_contamination_proof`，不得计入 AC/VF passed evidence |
| 生命周期 | 没有过期和重开 | 绑定 review version、baseline、run set、deadline/trigger；变化即失效 |
| 签署 | 风险接受与最终签署混在一起 | Step 13 只产生 risk record；Step 14 才定义最终裁决和签署责任 |

## 5. 风险接受设计取舍

| 议题 | 采用方案 | 放弃方案 | 理由 |
|---|---|---|---|
| eligibility | 白名单条件全部满足才可接受 | 除黑名单外默认可接受 | 防止遗漏 P0 污染或证据缺口 |
| P0 缺证据 | 保持 `blocked/not_run/not_evaluated` | 记录风险后有条件通过 | 风险记录不能替代执行事实 |
| A 级 | 逐项严格审查，默认阻断 | 批量由负责人接受 | A 可能跨共享 contract 和退出门禁 |
| B/R | 可成为 residual candidate | 自动支持有条件通过 | 仍需完整记录和授权 |
| RuntimeLike | 由送验基线决定 required；required 时不可接受缺失 | 永远 optional 或用 INT 代替 | lane 真实性不能被低保真结果覆盖 |
| 长期 retention | 未冻结天数可为 operations residual | 接受 active/held/reference cleanup | 时长未定与保护红线是不同问题 |
| affected | 独立保持 open/controlled | 包装为 `RR-OBS-009` 普通风险 | 设计 owner 缺口不能通过验收签署制造能力 |
| 接受有效期 | 绑定一次 review/release/baseline/run set | 永久接受或跨 release 自动续期 | 输入变化后原判断不再成立 |

## 6. Eligibility 判定合同

### 6.1 必须同时满足的条件

风险候选只有全部满足下列条件，才可进入真实 `Accepted` 记录：

| Gate | 必须证明 | 不满足时 |
|---|---|---|
| `ELG-OBS-01 / source` | 有稳定 source ref：B/R defect、P1/P2/future/operations item 或未冻结的非 P0 条件 | 保持 `Draft`，不得裁决 |
| `ELG-OBS-02 / no-veto` | `VF-OBS-001~010` 均未因该风险命中，且不是 S 级 | `Ineligible` / 不通过候选 |
| `ELG-OBS-03 / p0` | 全部受影响 P0 AC、required suite/check 和退出条件有独立真实证据成立 | `blocked`；不能风险接受 |
| `ELG-OBS-04 / integrity` | raw artifact、suite report、candidate linkage、report audit 同 run 且可追溯 | `blocked`；先补真实证据 |
| `ELG-OBS-05 / boundary` | 不改变 truth owner、writer capability、redaction、body-free、dependency 或 retention protection | `Ineligible` |
| `ELG-OBS-06 / scope` | 影响面、排除面、release/review/baseline/run set 均明确 | 保持 `Draft` |
| `ELG-OBS-07 / accountability` | owner 与具名、获授权的 acceptor 均存在，职责不混淆 | 不得支持有条件通过 |
| `ELG-OBS-08 / closure` | 有可验证 action、follow-up ref、deadline/trigger、补验范围和重开规则 | 不得支持有条件通过 |
| `ELG-OBS-09 / affected` | 不把 §12 affected 的未闭合 positive capability写成 residual 完成 | `Ineligible`；回上游/设计闭合 |
| `ELG-OBS-10 / currency` | 接受记录尚未到期，绑定输入没有变化 | `Expired`，重新审查 |

`ELG-OBS-*` 是验收报告内的 eligibility 检查标签，不是新的需求、测试、evidence alias 或业务状态。

### 6.2 严格受限的 A 级候选

| 条件 | 必须材料 | 失败裁决 |
|---|---|---|
| 不触发 VF/S | 十项 VF checklist、severity rationale、review ref | 不可接受 |
| 不影响 P0 truth/evidence | 受影响 AC/TC/EV/report 列表及独立通过证据 | 不可接受 |
| 不影响正式退出条件 | Step 04/12 gate 对照和 scope proof | 继续阻断 |
| 有替代证明而非替代执行 | 同 run 原始证据证明核心行为，且缺口只在非 P0 外围 | 不可接受 |
| 有确定修复与复验 | owner、boundary/issue、targeted/family/suite/check 范围 | 不可接受 |
| 授权与期限完整 | 具名 acceptor、决定时间、deadline/trigger、expiry | 不得进入有条件通过候选 |

任何 A 级候选只按单项记录审查，禁止按版本、模块或缺陷批次一次性接受。

### 6.3 B/R 与非 P0 候选

`B/R`、P1/P2、future 和 operations 项不自动获得 eligibility。它们仍必须证明：

- 没有通过 scope 降级隐藏原本 required 的 P0 门禁。
- `not_evaluated` 的能力没有被描述为已验证。
- 对外部产品、capacity、retention 或 UX 的声明严格限于已执行范围。
- 后续动作能产生可复核的设计、实现、测试或运维材料。
- 风险到期后不会默认继承到下一次 release。

## 7. 测试侧 residual 来源处置

下表是候选分类，不是已接受风险表；`candidate` 仍需真实送验材料通过 §6。

| Source | 当前分类 | 可候选的前提 | 升级为阻断的条件 |
|---|---|---|---|
| `RR-OBS-001` 真实产品 seam 未认证 | `candidate_product_binding` | 本次基线只要求 product-neutral seam，且 exact contract/no-write 已有真实证据 | 本次 release 明确绑定真实产品，或产品行为是 required P0 |
| `RR-OBS-002` RuntimeLike 未建立 | `candidate_scope_dependent` | 本次基线未把 `ENV-STG-RT` 设为 required，且不得声称 RuntimeLike pass | Step 03/04 或 release profile 将其设为 required |
| `RR-OBS-003` capacity / 硬 P95/SLO 未验证 | `candidate_threshold_absent` | current 需求没有正式 workload、样本、阈值和统计 owner，只声明 sample/trend | 正式需求冻结 numeric gate，或结构性资源/正确性失败 |
| `RR-OBS-004` 完整跨仓 E2E 未执行 | `candidate_scope_dependent` | P0 范围只验 L4 product-neutral seam 与 truth boundary | 送验范围要求真实多仓工作流 |
| `RR-OBS-005` 长期 retention 天数未固定 | `candidate_operations` | marker/hold/reference/cleanup protection 已独立验证，只缺期限/介质策略 | active/held/referenced material 可能被清理，或法规期限成为 P0 |
| `RR-OBS-006` 外部 archive/APM/GRC/dashboard 未验证 | `candidate_product_binding` | 外部产品不是 truth owner、不是 current hard prerequisite | release 绑定该产品或其行为成为 required |
| `RR-OBS-007` 高级 dashboard/analytics/alert UX 未覆盖 | `candidate_p2` | 明确 Out of Scope/P2，不能反向改本仓 schema/state/gate | 正式需求把该能力升级为 required |
| `RR-OBS-008` 真实 evidence alias / 签署不存在 | `ineligible_prerequisite_absent` | 无；它是当前验收事实缺失，不是 residual | 始终阻断真实正向结论，直至真实执行和裁决完成 |
| `RR-OBS-009` affected positive path 未闭合 | `separated_inherited_affected` | 不进入普通风险接受；只按 §12 回上游/设计/实现闭合 | 伪造 positive DTO、Completed、owner 或 evidence 时按 VF/S 裁决 |

## 8. 风险接受记录合同

真实 `reports/acceptance/risk-acceptance.md` 的每一行至少包含：

| 字段 | 必填 | 约束 |
|---|---|---|
| `risk_id` | 是 | 稳定唯一；不能只有自由文本标题 |
| `source_ref` | 是 | B/R defect、`RR-OBS-*`、正式待确认项或其他可追溯来源 |
| `residual_class` | 是 | `A-restricted` / `B` / `R` / `P1` / `P2` / `future` / `operations` |
| `review_version` | 是 | 绑定本次验收 review；禁止 `latest` |
| `baseline_refs` | 是 | 需求、设计、配置、测试和送验基线引用 |
| `affected_scope` | 是 | 受影响 AC/NFR/协议/profile/lane/consumer/release；禁止“影响较小” |
| `excluded_redlines` | 是 | 明确 VF/S/truth/redaction/no-write/dependency/evidence/retention 均不被覆盖 |
| `impact` | 是 | 对用户、运维、合规、性能、产品绑定或下一阶段的具体影响 |
| `acceptance_reason` | 是 | 为什么是 residual，为什么不阻断已证实 P0 |
| `p0_non_contamination_proof` | 是 | P0 AC/TC/EV/report 独立成立的引用；不得由风险记录自身证明 |
| `evidence_refs` | 是 | 真实同 run raw/report/index/review refs；candidate ID 单独不足 |
| `owner` | 是 | 后续动作具名责任人及角色 |
| `acceptor` | 是 | 获授权且具名的风险接受人；角色占位符不算填写 |
| `follow_up_action` | 是 | 可执行、可验证，不得写“持续观察”或“后续优化” |
| `follow_up_ref` | 是 | issue、实施 boundary、ADR、runbook、认证或性能基线引用 |
| `deadline_or_trigger` | 是 | 明确日期或可客观判定的事件；二者并存时先到者生效 |
| `retest_scope` | 是 | targeted/family/suite/check/full gate 中的确定组合 |
| `expiry_rule` | 是 | release/review/baseline/run set 变化、截止或触发时自动失效 |
| `reopen_conditions` | 是 | VF/S、新证据、范围升级、复发或 follow-up 失败时重开 |
| `decision_status` | 是 | 见 §9；当前不能预填 `Accepted` |
| `decision_ref` | 接受时是 | 风险审查记录；不能引用自动生成的 telemetry 或 handoff ack |

风险表不得包含 secret、raw body、evidence/artifact body、credential 或 full sensitive ref。证据仅使用
body-free ref、digest、run identity 和 canonical report path。

## 9. 生命周期、失效与重开

### 9.1 报告侧状态

| 状态 | 含义 | 是否可支持有条件通过 |
|---|---|---|
| `Draft` | 只有候选来源，字段或证据未齐 | 否 |
| `EligibilityChecked` | 已完成 §6 机械检查，尚未授权 | 否 |
| `Accepted` | 真实具名 acceptor 在授权范围内接受，记录完整且未失效 | 是，但只作为 Step 14 输入 |
| `Rejected` | 风险不在授权范围、影响不可接受或应先修复 | 否 |
| `Expired` | 截止/触发已到或绑定输入变化 | 否 |
| `Closed` | follow-up 完成且新证据通过复核 | 否；关闭不是历史 release 的重新签署 |
| `Reopened` | 复发、新证据或范围变化使原判断失效 | 否，重新进入 eligibility 审查 |

这些状态只描述 acceptance report 条目，不是本仓 domain state，也不能反写 defect、业务或外部 truth。

### 9.2 自动失效条件

任一条件发生时，原 `Accepted` 立即失效，不等待人工把旧记录改成绿色：

1. `review_version`、release candidate、需求/设计/配置/测试 baseline 或绑定 run set 变化。
2. 风险影响的 AC、NFR、VF、协议、状态、profile、lane 或退出条件升级。
3. 出现 VF/S、redaction leak、source write、dependency violation、evidence mismatch 或 protected cleanup。
4. 到达 `deadline_or_trigger`，follow-up 尚未闭合。
5. owner/acceptor 失去授权，follow-up ref 无效，或 evidence refs 不再可追溯。
6. 同类缺陷复发，或新证据扩大 affected scope。

### 9.3 关闭与重开

风险关闭必须提供 follow-up 产物、新 invocation/run 的复验证据、原风险到新证据的关联和 reviewer 结论。
不得覆盖原 acceptance record，也不得把 `Closed` 解释为原 release 的“通过”补签。

复发、输入变化或期限违约时，新记录必须引用原 `risk_id` 和决定记录，保留历史；禁止删除、改写日期或滚动
延长期限来避免 `Expired`。

## 10. 角色与职责分离

| 角色 | 责任 | 明确禁止 |
|---|---|---|
| risk proposer | 描述影响、来源、候选范围和初始证据 | 自行宣告接受 |
| follow-up owner | 执行动作、维护 issue/boundary/runbook、请求复验 | 以工作进行中替代关闭证据 |
| test/evidence reviewer | 验证 same-run provenance、P0 不污染和复验范围 | 生成最终业务/验收 truth |
| design/architecture reviewer | 验证 truth owner、依赖和 affected 没有被绕过 | 用风险记录修补正式设计冲突 |
| risk acceptor | 在授权范围内承担明确 residual | 接受 VF/S 或缺失 P0 证据 |
| final acceptance authority | 在 Step 14 汇总门禁、缺陷和有效风险记录 | 把单项风险接受等同总体签署 |

建议角色映射只作为送验模板，不是当前签署事实：产品范围风险由产品/验收授权角色接受；架构和产品 binding
由架构授权角色复核；operations/retention 由运维及合规授权角色复核；测试证据由独立测试/evidence reviewer
确认。涉及多域时必须全部具名，不得由单一 owner 代签所有职责。

## 11. 遗留项到下游的承接

| 遗留类型 | 正式承接位置 | 最低承接内容 | 当前动作 |
|---|---|---|---|
| implementation / protocol / owner | 后续 `07-实施计划.md` boundary 或 issue | exact owner、affected contract、完成条件、复验 suite/check | 仅记录 handoff 要求；本 Step 不修改 `07` |
| test / RuntimeLike / E2E | 测试补充计划或 release test manifest | profile/lane、dataset、TC、run/report/evidence 路径 | 真实环境建立后填写 |
| external product binding | ADR / adapter certification plan | 产品版本、seam、failure、no-write、认证退出条件 | 产品选定后填写 |
| performance / capacity | 需求、配置、性能基线 | workload、样本、阈值、统计方法、owner | 来源冻结前只保留 trend |
| retention / operations | runbook / operations baseline | owner、介质、期限、hold、cleanup、restore | 不影响 active protection 红线 |
| P2 UX / analytics | 产品需求或后续 roadmap | scope、truth boundary、验收条件 | 不反向污染 current P0 |

风险记录关闭前必须能从 `follow_up_ref` 回到上述承接物；只有自由文本承诺的条目保持 `Draft`。

## 12. Inherited blocker / affected 隔离

以下 12 项继续开放，不能进入普通风险接受，不能由“有条件通过”宣称其 positive capability 已完成：

`S08-E-I05-PAYLOAD-SCHEMA-01`、`S08-E-I05-PRODUCER-EVENT-BINDING-01`、`R06.6-F2-H13-UPSTREAM`、
`R06-F-AFFECT-UOW-01`、`S08-RECOVERY-CLASS-OWNER-01`、`R07-EXTERNAL-PHASE-LINK-01`、
`R07-EXTERNAL-PHASE-RETRY-ACCOUNTING-01`、`S08-CONSUMER-OUTBOX-SURFACE-01`、
`S08-CONSUMER-INDETERMINATE-COMPLETION-01`、`S08-JOB-REPORT-REF-OWNER-01`、
`S08-M1-SECONDARY-TYPE-OWNER-01`、`03-RPR-S09-PER-FLOW`。

隔离规则：

1. I05 只允许 pre-parse/schema/binding fail-closed；不得本地发明 payload DTO、producer binding 或 positive landing。
2. J06 只允许 observation-side controlled `Blocked/manual`；不得发明 H13 positive execution、external receipt、
   `Completed`、真实 run 或 evidence alias。
3. UoW、recovery、external phase、consumer completion、report ref、secondary owner 和 per-flow proof 继续保持
   `open/controlled/blocked/conditional`，由其正式 owner 和后续 implementation boundary 闭合。
4. 若某次 release 正式排除相应 capability，必须先通过基线/范围变更重新审查受影响 AC/TC/VF；不能只写一条
   risk acceptance 来完成降级。
5. 只有真实实现绕过 fail-closed、发生 source write、伪造 positive 或破坏证据时，才按实际 finding 进入 VF/S；
   affected 的存在本身不是已触发的缺陷，也不是可接受风险。

本 Step 没有发现新的上游 blocker。目标实现仓、CI、RuntimeLike、真实 artifact/report/evidence 和签署仍未建立，
这是 delivery/acceptance reality，不是可风险接受的 P0 residual。

## 13. 风险接受到最终裁决的输入规则

| 当前材料 | 交给 Step 14 的状态 | 允许的总体候选 |
|---|---|---|
| 无 residual，全部 required P0 真实通过，无 VF/S | 无风险接受输入 | `通过`候选 |
| 仅有完整、有效、未过期的 `Accepted` residual，全部 P0 独立成立 | 带 risk record 进入签署 | `有条件通过`候选 |
| risk 仍为 Draft/EligibilityChecked，缺 acceptor/action/deadline/evidence | open | 不得正向裁决 |
| risk 为 Rejected/Expired/Reopened | invalid | 不得有条件通过 |
| 任一 VF/S、required P0 未执行、证据失真或 inherited affected 被伪造完成 | blocked/failed | `不通过`或流程暂停；最终三值由 Step 14 固定 |

单项 `Accepted` 永远不直接生成总体结论。Step 14 必须重新检查全部门禁、风险记录有效性、签署授权和
进入下一阶段/发布准备条件。

## 14. 正式 `06` §13 回填草稿

> 校准来源：
> - `design-calibration/06_acceptance_step_13_risk_acceptance.md`
>
> 延伸阅读：
> - 建议继续阅读本文件的“Eligibility 判定合同”“测试侧 residual 来源处置”“风险接受记录合同”
>   “生命周期、失效与重开”“Inherited blocker / affected 隔离”和“风险接受到最终裁决的输入规则”。

正式 §13 只承载以下收口结论：

- 风险接受只适用于 P0 已由真实证据独立成立后的严格受限 A、B/R、P1/P2/future/operations residual。
- 任一 `VF-OBS-001~010`、S 级、P0 required execution/evidence 缺失、truth/no-write/redaction/dependency/
  evidence authenticity/active-retention 红线均不可风险接受。
- `RR-OBS-008` 是验收前置缺失，`RR-OBS-009` 与 12 项 inherited affected 单独隔离，均不得包装为普通 residual。
- 风险记录必须有 source/scope/impact/P0 不污染证明/evidence/owner/acceptor/action/follow-up/deadline/
  retest/expiry/reopen/decision 字段；缺任一关键字段不能支持有条件通过。
- 接受记录绑定 review、release、baseline 和 run set；输入变化、期限到达、VF/S、新证据或复发会自动失效并重开。
- 风险接受不改变 AC/TC/EV 的结果，不生成 final verdict，不反写任何业务 truth。

正式正文不得填写真实 risk ID、姓名、日期、决定、run、artifact digest、evidence alias、follow-up issue 或签署。

## 15. 待确认事项

| ID | 待确认事项 | 当前状态 | 影响 |
|---|---|---|---|
| `Q-06-13-01` | 真实送验的具名 risk acceptor 与授权范围 | `not_assigned` | 缺失时不能有条件通过 |
| `Q-06-13-02` | 本次 release 是否把 `ENV-STG-RT` 设为 required | `not_selected` | 决定 `RR-OBS-002` 是 candidate 还是 blocker |
| `Q-06-13-03` | 产品 adapter / archive / APM / GRC 的实际绑定范围 | `not_selected` | 决定 `RR-OBS-001/006` 的验收前置 |
| `Q-06-13-04` | workload、numeric SLO 与统计 owner | `not_frozen` | 未冻结前只允许 sample/trend，不宣称 capacity pass |
| `Q-06-13-05` | 长期 retention 期限、介质、cleanup/restore owner | `not_frozen` | 只影响 operations residual，不弱化 active protection |
| `Q-06-13-06` | 实现仓、CI、suite producer、真实 run/evidence | `target_absent` | 当前不能产生 risk acceptance 或正向验收事实 |

## 16. Step 自检与 gate

| 检查项 | 结论 | 说明 |
|---|---|---|
| residual eligibility 是否可判定 | `pass_design` | 10 个 ELG gate 全部固定 |
| 是否覆盖 SOP 的接受人、动作、截止和同步要求 | `pass_design` | §8、§10、§11 |
| VF/S 是否能被风险接受覆盖 | `no` | 全部列为 ineligible |
| required P0 缺证据是否可包装为 residual | `no` | 保持 blocked/not_run/not_evaluated |
| A 是否默认可接受 | `no` | 仅逐项严格候选 |
| B/R/P1/P2 是否污染 P0 | `no` | 必须提供独立 P0 non-contamination proof |
| 12 项 affected 是否被错误关闭 | `no` | 独立隔离，继续开放 |
| 失效、重开和历史保留是否明确 | `pass_design` | §9 固定，不允许自动续期 |
| 是否填写真实接受事实或签署 | `no` | 当前只有角色和字段合同 |
| 是否发现新上游 blocker | `none` | inherited affected 保持开放 |
| 正式 `06` 是否修改 | `no` | 仅 Step 15 允许装配 |
| `gate_status` | `pass_for_risk_acceptance_design` | 可进入 Step 14；不是风险已接受或验收通过 |
| `next_allowed_action` | `rebuild_current_06_step_14` | 先同步 flow/ledger，再读取 Step 14 输入 |

## 17. 参考

- `standards/document/验收标准讨论流程_SOP.md` Step 13
- `standards/document/验收标准书写规范.md` §5.13
- `standards/document/设计文档讨论中间产物规范.md`
- `standards/document/设计真相源闭环与可落码性标准.md`
- `projects/L4-observability/00-需求文档.md`
- `projects/L4-observability/03-详细设计.md`
- `projects/L4-observability/04-配置设计.md`
- `projects/L4-observability/05-测试方案.md` §9~§14
- `projects/L4-observability/design-calibration/05_test_plan_step_14_regression_risks.md`
- `projects/L4-observability/design-calibration/06_acceptance_step_09_nonfunctional.md`
- `projects/L4-observability/design-calibration/06_acceptance_step_10_observability_evidence.md`
- `projects/L4-observability/design-calibration/06_acceptance_step_11_veto.md`
- `projects/L4-observability/design-calibration/06_acceptance_step_12_defects_retest_release.md`
- `projects/L1-governance/design-calibration/06_acceptance_step_13_risk_acceptance.md`
- `projects/L1-artifact/design-calibration/06_acceptance_step_13_risk_acceptance.md`
