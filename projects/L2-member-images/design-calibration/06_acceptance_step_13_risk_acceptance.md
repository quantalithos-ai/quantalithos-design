# L2-member-images 06 验收标准 Step 13：风险接受与遗留项

> 对应 SOP：`standards/document/验收标准讨论流程_SOP.md` Step 13
> 对应书写规范：`standards/document/验收标准书写规范.md` §5.13
> 回填位置：正式 `06-验收标准.md` 第 13 章“风险接受与遗留项”
> 方法粒度：参考 `L1-governance` 的“风险登记 → 资格判定 → 接受人/责任人 → 动作与截止/触发 → 问题记录同步 → 关闭复核”链路；不继承治理项目的风险 ID、对象、阈值、验收事实或签署事实。

本文是 `full-restart` 下的 future acceptance contract。它只定义哪些事项有资格进入未来风险接受、哪些事项绝不能被接受，以及未来记录必须怎样闭环；不创建实际风险接受报告、缺陷、run、artifact、report、evidence、digest、verdict、signoff 或 readiness。

## 1. Step 开工确认、状态与边界

| 项目 | 记录 |
|---|---|
| 当前 Step | Step 13：定义风险接受与遗留项 |
| 输出文件 | `projects/L2-member-images/design-calibration/06_acceptance_step_13_risk_acceptance.md` |
| 开工授权 | 用户以“同意”解除 Step 12 停审；本 Step 独立执行，完成后停审，不自动进入 Step 14。 |
| 已读取规范 | 验收标准讨论流程 SOP、验收标准书写规范、设计文档讨论中间产物规范、设计文档编写通则及项目级执行台账。 |
| 已读取输入 | 正式 `00~05`；06 Step 9、10、11、12；`05_test_plan_step_14_regression_risks.md`；`04_config_step_14_risks_open_questions.md`；L1-governance Step 13（仅作粒度参考）。 |
| 当前模式 | `full-restart`；历史正式 `06` 仅作污染审计输入，不能继承其风险接受结论。 |
| 当前实际事实 | 没有获授权的实现仓、送验版本、固定 `run_id`、artifact、report、EV instance、observed defect、风险接受记录、verdict 或 signoff。 |
| 正式回填 | 仅生成 §13 回填草稿；正式 `06-验收标准.md` 仍只能在 Step 15 删除 historical 文件后重建。 |
| 下一动作 | Step 13 完成后等待用户确认，再决定是否进入 Step 14；不得创建或修改 07、implementation ledger 或 planned boundary skeleton。 |

### 1.1 本步目标

本 Step 收敛五件事：

1. 定义有条件通过可承接的 residual 范围，并把它与 P0、VETO、过程硬门禁和设计/依赖 blocker 分开。
2. 为每个遗留项固定影响、接受理由、责任人、接受人、截止日期或触发条件和后续记录入口。
3. 保留 `DDD-*`、`PF-*`、`MI-UP-*`、`Q-MI-*` 及无实现/无阈值等未闭合项的真实状态，不把它们伪装成已接受风险。
4. 规定未来 `reports/acceptance/risk-acceptance.md`、`open-issues.md`、实施计划和运维材料之间的同步关系。
5. 保证风险接受不能解除 VETO、P0 evidence 不可裁决、owner contract、设计 blocker、数据/依赖越界或证据完整性失败。

### 1.2 不做事项

- 不填写真实接受人姓名、审批日期、defect/run/evidence 引用、关闭状态或条件通过结论。
- 不把 `planned`、`blocked`、`gap`、`unknown`、`unavailable`、`not_evaluable` 或 `absent` 直接改名为风险已接受。
- 不把兄弟项目或上游未停审内容写成 manifest、variant、ref、Artifact、consumer、event、digest、release 或 readiness 事实。
- 不为未闭合的 `DDD-*` / `MI-UP-*` / `Q-MI-*` 私造 deadline、SLA、恢复函数、schema、产品、policy 或 owner signoff。
- 不创建 `reports/acceptance/` 下的实际报告，不执行测试，不生成证据实例，不修改正式 `06-验收标准.md`。

## 2. 输入承接与来源审计

| 输入 | 当前状态 | 本 Step 承接 | 不得推导 |
|---|---|---|---|
| 验收 SOP Step 13 | 已读取 | 风险接受表、不可接受清单、接受人/动作/截止和同步要求。 | 不改变 SOP 的正式回填位置或三值结论。 |
| 验收标准书写规范 §5.13 | 已读取 | 固定七列表：风险/遗留项、影响、接受理由、后续动作、责任人、接受人、截止时间。 | 不把本文件写成验收报告或审批记录。 |
| 06 Step 9 | 已完成 | 承接 P0 structural NFR 与性能/容量/SLO/retention 的 residual 边界。 | 不把 planned benchmark 或无阈值 sample 作为通过事实。 |
| 06 Step 11 | 已完成 | 承接 `VETO-MI-001~007` 和过程硬门禁不可风险接受规则。 | 不新增 VETO，不宣告实际 VETO 命中或通过。 |
| 06 Step 12 | 已完成 | 承接 S/A/B/R、记录类型、new-run 复验和放行影响。 | 不把 B/R 直接视为已接受，不把 blocker 当 observed defect。 |
| `05-测试方案.md` §14 与 calibration | 已完成 | 承接回归触发、残余风险、owner 候选和问题记录方向。 | 不承接实际测试结果、缺陷数量或报告。 |
| `04-配置设计.md` §14 与 calibration | 已完成 | 承接配置、产品、seed、依赖和 future 演进风险。 | 不把配置组合状态或 optional marker 当 readiness。 |
| L1-governance Step 13 | 仅作格式参考 | 借鉴风险资格谓词、责任/接受双角色、动作和关闭审计粒度。 | 不复制 `VETO-GOV-*`、治理对象、角色事实或报告结果。 |

## 3. SOP 问题回答

| SOP 问题 | L2-member-images 裁决 |
|---|---|
| 哪些风险可以支持有条件通过？ | 只有已证明不影响当前 P0 truth、VETO、过程硬门禁和证据完整性的 B/R residual，或经过逐项严格审查、影响范围受控的 A 候选，才可进入未来有条件通过候选。典型包括 P1 real-like selected-run 未覆盖、真实 DB/bus/search/object storage 或 external GRC vendor 深度行为未覆盖、production-like capacity/SLO 未硬化、旧 P95/SLA 无正式来源、高级 DSL/dashboard、长期 evidence retention 未定。它们必须有 future evidence/ref、责任人、接受人、动作和 deadline/trigger；当前没有任何实际接受。 |
| 哪些风险不能接受？ | `VETO-MI-001~007`、S 级缺陷、redaction leak、evidence integrity/report-audit 失败、dependency/zero-outbound 失败、P0 profile 缺失却标记 passed、strict config fail-open、Query/Job/Inbound 反写真相、无 authority 生成 candidate/digest/ref、不合格版本进入 availability、历史覆盖或 local 状态冒充 consumer/container/readiness，均不可风险接受。仍影响当前 P0 的设计/依赖 blocker 也不能借 R 降级。 |
| 每个风险的接受人是谁？ | 本 Step 只固定角色槽位，不填写人名。未来风险接受记录必须指定一名有相应授权的验收接受人，并与后续动作责任人分离；缺接受人、授权范围不明或只有执行人自签时，不得支撑有条件通过。 |
| 后续动作和截止时间是什么？ | 每个候选 residual 必须写可验证动作、责任人、具体日期或可判定触发条件；不能只写“后续补充”。动作至少包括重新基线/重开 Step、补测试或报告、更新实施/运维/ADR/问题记录中的一个，且要规定逾期或触发后的升级。当前只保留 `<date-or-trigger>` 槽位。 |
| 是否需要同步到实施计划或问题记录？ | 需要。影响实现、配置、测试、运行、发布或下游 handoff 的事项必须同步未来 `07-实施计划.md`、相应运维材料或 `open-issues.md`；影响正式验收结论的事项还必须进入 `reports/acceptance/risk-acceptance.md`。本 Step 不创建这些实际报告或计划。 |

## 4. 当前材料诊断与改动前后对比

### 4.1 当前材料问题诊断

| 位置 / 现象 | 风险 | 本 Step 处置 |
|---|---|---|
| historical `06-验收标准.md` 只有泛化“风险可接受”文字。 | 无法区分 P0 blocker、residual、责任人和接受人，容易形成伪条件通过。 | 采用固定七列表，并增加资格谓词、不可接受清单和同步要求。 |
| Step 9 的性能/容量/retention 数字尚无 authority。 | 旧 P95/SLA 或 benchmark 设计可能被误读成硬门禁。 | 仅作为 R residual / baseline input；若 selected delivery 要求数字，必须重开 Step 3/4/9。 |
| Step 12 已区分 S/A/B/R，但 A/B/R 尚无接受记录结构。 | B/R 可能被静默算入 P0 passed，A 可能绕过 VETO。 | A 严格逐项审查；B/R 仅作为候选，均需 owner/acceptor/action/deadline。 |
| `DDD-*`、`MI-UP-*`、`Q-MI-*` 同时出现在设计、依赖和测试材料。 | blocker 可能被写成缺陷、风险已接受或 readiness。 | 保持 `design_blocker` / `dependency_blocker` / `pending`；只登记重开条件，不登记接受事实。 |
| 兄弟项目仍在并行窗口。 | 把 pending consumer、component、event 或 Artifact 关系写成闭合合同。 | 所有正向 owner lane 保持 pending/blocked/gap/unavailable；未来双方重新校准后才可重开。 |

### 4.2 改动前后对比

| 项 | 进入 Step 13 前 | 本 Step 后 | 原因 |
|---|---|---|---|
| 风险表 | 只有 residual 主题和缓解方向。 | 每项固定风险 ID/范围、影响、接受理由、动作、责任人、接受人、截止/触发和跟踪入口。 | 支撑可审查的有条件通过，而不是口头承诺。 |
| 风险资格 | S/A/B/R 已有分级，接受边界分散。 | S/VETO/过程硬门禁明确排除；A 仅严格候选；B/R 需逐项记录。 | 防止风险接受覆盖 P0 红线。 |
| blocker 处理 | 可能与 residual 混写。 | `DDD-*`、`PF-*`、`MI-UP-*`、`Q-MI-*` 和无基线项维持 blocker/pending/not_evaluable。 | 未闭合合同不能靠接受人补齐。 |
| 后续同步 | 未明确问题记录和实施交接。 | 固定 `risk-acceptance.md`、`open-issues.md`、07/运维/ADR 的 future follow-up 入口。 | 确保遗留项闭环。 |
| 当前事实 | 历史材料可能含旧结论。 | 明确当前无 actual acceptance、defect、run、evidence 或 signoff。 | 防止历史污染回流。 |

## 5. 设计取舍与风险接受资格

| 议题 | 备选方案 | 采用结论 | 理由 |
|---|---|---|---|
| 无接受人能否支持有条件通过 | A. 先通过再补人；B. 缺接受人不得通过 | 采用 B。 | 接受授权和责任不可由后续口头补记。 |
| P1 selected-run unavailable 是否自动阻断 P0 | A. 一律阻断；B. 在 P0 structural gate 已成立且 Step 4 未列入本轮进入条件时作为 residual 候选 | 采用 B，但不得写成 P0 已验证。 | 本仓不拥有真实产品 adapter / consumer truth；范围必须由送验基线决定。 |
| 无正式阈值的性能 sample 如何处理 | A. 继承历史数字；B. 仅作为 baseline input / residual | 采用 B。 | `R-MI-009` 与 06 Step 9 明确没有获权量化基线。 |
| A 级缺陷是否批量接受 | A. 可批量接受；B. 逐项严格审查 | 采用 B；默认不可接受。 | A 仍可能影响 P0 可信证明，必须逐项排除 VETO 和 truth 影响。 |
| 设计/依赖 blocker 能否登记为 residual | A. 可以降级；B. 维持 blocker 并重开 | 采用 B。 | 接受风险不能替代设计合同、owner 合同或 evidence 基线。 |
| 未来报告是否可由本 Step 代填 | A. 可以；B. 本 Step 只提供结构和槽位 | 采用 B。 | 当前没有真实 run、evidence、授权人和日期。 |

### 5.1 风险接受资格谓词

未来一个事项只有同时满足以下条件，才可进入 `reports/acceptance/risk-acceptance.md` 的候选清单：

```text
eligible_residual(r) :=
  stable_risk_id(r)
  && scope_is_not_current_P0(r)
  && no_veto_or_process_hard_gate(r)
  && impact_is_bounded_and_explicit(r)
  && evidence_or_formal_ref_supports_disposition(r)
  && named_owner(r)
  && named_authorized_acceptor(r)
  && action_is_verifiable(r)
  && deadline_or_trigger_is_decidable(r)
  && follow_up_record_exists_or_is_created_in_same_handoff(r)
```

缺任一条件时，事项只能保持 `pending`、`blocked` 或 `not_evaluable`，不能支撑“有条件通过”。`evidence_or_formal_ref` 在当前设计阶段仍是未来必备输入；本文件中的 planned TC、EV family、固定路径和静态表不是 evidence instance。

### 5.2 资格分类矩阵

| 事项类型 | 未来可否作为 residual 候选 | 当前/未来处理 |
|---|---|---|
| `S`、任一 `VETO-MI-*`、P0 过程硬门禁失败 | 否 | 总体不通过或暂停；保留首次失败和新 run 复验链。 |
| 仍影响 P0 truth 的 `A` | 默认否；仅可严格条件候选 | 逐项证明不影响 P0、无 VETO、证据完整，并由授权接受人记录。 |
| 已证明不影响 P0 的 `B` | 是，候选 | 记录影响范围、owner、acceptor、动作和 deadline；不计入 P0 passed。 |
| 范围外 / future / 无正式阈值的 `R` | 是，候选 | 记录 authority、触发条件、重开 Step 和后续计划；不得宣称已验证。 |
| `design_blocker` / `dependency_blocker` / `not_evaluable` | 否（不等同 residual） | 保持 blocker/pending；合同闭合或执行基线可用后重开受影响 Step。 |
| `expected_negative`（`Blocked`、`Unavailable`、`Unknown`、marker-only、zero outbound） | 否（不等同风险） | 有同 run 证据时按原 oracle 判定；不能用风险接受替代正向 lane。 |

### 5.3 Step 内模块骨架与复杂度判断

本 Step 风险项同时跨越验收硬门禁、详细设计 blocker、上游/兄弟 owner、产品范围和实施交接，不能压缩成一张“全部可接受”清单。按以下模块顺序收敛；每个模块完成自检后才进入下一个模块：

| 模块 | 先回答的问题 | 结构化产物 | 自检 | 状态 |
|---|---|---|---|---|
| M1 hard-gate exclusion | 哪些事项无论谁批准都不能接受？ | VETO/S/过程硬门禁不可接受表 | 是否覆盖 Step 11、Step 12 和 redaction/dependency/report/config 硬门禁？ | `done` |
| M2 design/dependency blockers | 哪些事项是设计或 owner 合同未闭，而非 defect/residual？ | `DDD-*`、`PF-*`、`MI-UP-*`、`Q-MI-*` blocker 登记 | 是否保留 blocked/pending/not_evaluable，未降级为 R？ | `done` |
| M3 eligible residual candidates | 哪些 B/R 或受限 A 可以进入条件通过候选？ | 七列表风险接受表、资格谓词和 role slots | 是否有影响边界、证据入口、动作、owner、acceptor、deadline/trigger？ | `done` |
| M4 follow-up and synchronization | 风险接受后如何进入问题、实施和运维闭环？ | report schema、同步矩阵、重开规则 | 是否禁止只写在 06，且未创建实际报告/计划？ | `done` |

复杂度结论：本 Step 不拆出新的正式验收章节；模块 M1~M4 在本文件内分别保留，未来正式 §13 只回填收口后的表、不可接受边界和同步规则。

## 6. 结构化中间产物

### 6.1 风险 / 遗留项登记表

下表是未来风险记录的资格与字段模板，不是当前的风险接受结果。`接受人` 和 `截止时间` 仅使用角色槽位或 `<date-or-trigger>`；`不适用（不可风险接受）` 明确表示该事项不得通过风险接受覆盖。

| 风险 / 遗留项 | 影响 | 接受理由 | 后续动作 | 责任人 | 接受人 | 截止时间 |
|---|---|---|---|---|---|---|
| `DDD-S9-B01` canonical input / mutation UoW 未闭合 | 10 Command、6 Job 的正向 mutation、保存顺序和副作用不可裁决。 | 不适用：`design_blocker` 不是可接受 residual。 | 重开 03 对应 canonical input、UoW、mapper 与同边界测试；完成后重建基线。 | 详细设计负责人（角色槽位） | 不适用（不可风险接受） | `<design-closure-trigger>` |
| `DDD-S9-B02` stored result / result-ref / replay 未闭合 | duplicate/replay 不能证明从已存结果返回且不重算 truth。 | 不适用：接受人不能替代缺失的持久化合同。 | 重开 03 object/protocol/state/transaction 相关 Step，并补原 TC/family 复验。 | 详细设计负责人（角色槽位） | 不适用（不可风险接受） | `<design-closure-trigger>` |
| `DDD-S11-B03` availability terminal persistence 未闭合 | publish/replace/rollback/retire 的历史终结和 supersede 不可安全裁决。 | 不适用：不能用风险接受允许覆盖或重插 history。 | 选择正式 terminal model，回写 03/05/06 后执行 supply/history 复验。 | 详细设计负责人（角色槽位） | 不适用（不可风险接受） | `<design-closure-trigger>` |
| `DDD-S13-OPEN-01` in-flight / Reserved recovery 未闭合 | 并发 first/second writer、crash re-entry 和 durable recovery 无正式语义。 | 不适用：不得以 lease、TTL、cleanup 或口头约定代替设计。 | 重开并发、错误恢复、幂等和 UoW 设计；在新 baseline 后复验。 | 详细设计负责人（角色槽位） | 不适用（不可风险接受） | `<design-closure-trigger>` |
| `DDD-S13-OPEN-02` channel/name/key namespace 未闭合 | 跨 Command/Job 的 replay/conflict 归属不唯一。 | 不适用：不能建立 global raw-key index 作为临时接受。 | 闭合 namespace、lookup 和 conflict policy，重开受影响协议/测试。 | 详细设计负责人（角色槽位） | 不适用（不可风险接受） | `<design-closure-trigger>` |
| `PF-UNAVAILABLE-RECOVERY` projection `Unavailable` 无恢复函数 | projection recovery 正向 lane 不可验；Query 不能代替 recovery。 | 不适用：不能接受 invented `Unavailable -> Rebuilding/Fresh`。 | 定义 committed source、recovery function、version/UoW、error 和测试，再重开 03/05/06。 | 详细设计负责人（角色槽位） | 不适用（不可风险接受） | `<recovery-contract-trigger>` |
| `MI-UP-001` member-service consumer contract 未闭合 | `ConsumerHandoffGap`、instantiable entry 和 confirmation 的正向 consumer lane 不可验。 | 可作为 future owner gap，但不构成当前 P0 通过依据。 | owner 闭合 exact manifest/variant/ref/qualification/confirmation 后，重开接口、供给和验收 seam。 | `L2-member-service` owner（待确认） | 验收负责人（角色槽位，待指定） | `<owner-contract-trigger>` |
| `MI-UP-002` member component release / compatibility 未闭合 | component pin、assembly completeness 和 compatibility positive lane 不可验。 | 可作为 future owner gap；本仓不复制 member truth。 | owner 提供正式 pinned release/compatibility 合同后重建相关 fixture 与复验。 | `L2-member` / runtime owner（待确认） | 验收负责人（角色槽位，待指定） | `<owner-contract-trigger>` |
| `MI-UP-003` Role-to-variant mapping authority 未闭合 | definition、baseline、revision 缺正式 mapping input。 | 可作为 future owner gap；不能 hardcode 或缓存默认值。 | `L3-method-library` 正式提供 body-free query/snapshot/ref 合同后重开 mapping lane。 | 方法资产 owner（待确认） | 验收负责人（角色槽位，待指定） | `<mapping-contract-trigger>` |
| `MI-UP-004` Core shared carrier 未闭合 | image-specific shared type 的 compile 使用和包边界不可确认。 | 可作为 dependency blocker；当前 active sibling compile dependency 保持零。 | Core owner 正式接受 shared contract，目标实现仓复核 package/path 后重开依赖审计。 | `L0-core` owner（待确认） | 架构/验收负责人（角色槽位） | `<core-contract-trigger>` |
| `MI-UP-005` inbound build/source event authority 未闭合 | event-triggered BuildIntent、identity、dedup、receipt 和 accepted input 不可验。 | 可作为 future event gap；marker-only 不等 accepted event。 | Bus/Core/event owner 闭合 family/schema/identity/version/dedup/receipt/transport 后重开。 | Bus/Core/event owner（待确认） | 验收负责人（角色槽位，待指定） | `<event-authority-trigger>` |
| `MI-UP-006` policy/memory/workspace/role-extra seed owner 未闭合 | static seed placement 和 static/live boundary 的正向完整性不可验。 | 可作为 future template gap；不能把 seed body 或 live state 纳入本仓。 | template owner 闭合 semantic owner/ref/placement 后重建 assembly fixture 与 redaction 复验。 | seed/template owner（待确认） | 安全/验收负责人（角色槽位） | `<seed-contract-trigger>` |
| `MI-UP-007` Artifact consumable handoff 未闭合 | qualification、formal ref、lineage 和 consumer handoff 的正向结果不可验。 | 可作为 future Artifact gap；不得 mint `ConsumableArtifactReference`。 | `L1-artifact` 提供 image handoff schema 和 acceptance contract 后重开 qualification/supply lane。 | `L1-artifact` owner（待确认） | Artifact/验收负责人（角色槽位） | `<artifact-contract-trigger>` |
| `MI-UP-008` hardened base / Sandbox direction 未闭合 | base ref 不能解释为 hardened result、sandbox policy 或隔离 readiness。 | 可作为 future scope gap；当前不进入 baseline。 | scope owner 闭合 pinned base boundary；若启用，先重开范围和上游设计。 | `L4-sandbox` / scope owner（待确认） | 架构/验收负责人（角色槽位） | `<sandbox-scope-trigger>` |
| `MI-UP-009` outbound build/release event authority 未闭合 | publisher、outbox、delivery、receipt、retry 均无 authority。 | 不是可接受的 P0 缺口；当前 outbound inventory 必须严格为零。 | 只有 Bus/Core owner 给出正式 authority、consumer、schema 和 failure semantics 后，才可重开范围。 | Bus/Core/event owner（待确认） | 不适用（当前禁止 outbound） | `<outbound-authority-trigger>` |
| `Q-MI-001` restricted/read-only variant scope 未定 | 特殊 Role variant 不能进入当前核心分母。 | 可作为 future scope residual；未裁定前不枚举、不供给。 | scope/governance authority 定义范围后回写 00~06 并重新基线。 | scope/governance owner（待确认） | 产品/验收负责人（角色槽位） | `<scope-decision-trigger>` |
| `Q-MI-002` multi-architecture dimension 未定 | variant identity、snapshot、catalog 和 coverage 语义未定。 | 可作为 future scope residual；不自创 architecture enum 或 coverage 结论。 | product/SRE authority 定义 identity basis 后重开范围、对象和测试。 | product/SRE owner（待确认） | 产品/验收负责人（角色槽位） | `<architecture-scope-trigger>` |
| `Q-MI-003` builder/registry/store/evidence product 未定 | real adapter、provider outcome、immutable output 和生产组合不可验。 | 可作为 future product residual；fake/ACK/tag/cache 不能成为 positive evidence。 | infrastructure/config authority 提供 safe adapter/product contract 后重开 03~06。 | infrastructure/config owner（待确认） | 架构/验收负责人（角色槽位） | `<product-contract-trigger>` |
| `Q-MI-004` applicable gate/evidence inventory and priority 未定 | `EligibilityDecision`、gate result 和 Artifact interaction 的正向资格不可验。 | 可作为 future policy residual；不枚举 BOM/scanner/signature 或 default-pass。 | security/governance/Artifact authority 确认 evidence kind、priority 和 safe conclusion 后重开。 | security/governance/Artifact owner（待确认） | 安全/验收负责人（角色槽位） | `<policy-decision-trigger>` |
| `RES-MI-001` 无实现仓、CI、真实环境和送验基线 | 不能产生 actual run、artifact、report、EV、defect 或 release verdict。 | 不是已接受风险；属于实施/执行前置缺口。 | 未来 07 先核验实现 activation、profile、fixture、run 和证据路径，再决定是否送验。 | 实施负责人（角色槽位） | 不适用（执行前置缺口） | `<implementation-activation-trigger>` |
| `R-MI-009` 性能/容量/SLO、旧 P95/SLA 与 image size 阈值未获正式 authority | 不能作数量化通过、失败或 production readiness 结论。 | 若不在本轮 P0 进入条件，可作为 R residual；若被选入则缺阈值即阻断进入。 | 定义 workload、measurement baseline、阈值来源和 runbook；重开 03/04/05/06 相关 Step。 | 测试/运维负责人（角色槽位） | 产品/验收负责人（角色槽位，待指定） | `<baseline-authority-trigger>` |
| `RES-MI-003` evidence retention 天数和归档介质未定 | 不能证明长期审计保留，但不改变当前 same-run 证据要求。 | 可作为 operations residual，前提是当前验收期间的证据完整性已独立满足。 | 在运维标准中确定 retention、归档介质、访问和销毁规则，并同步问题记录。 | 运维/合规负责人（角色槽位） | 合规/验收负责人（角色槽位，待指定） | `<retention-policy-trigger>` |
| `RES-MI-004` historical `05/06` 污染清理与正式重建尚未完成 | 旧数字、产品、接口、报告或签署语义可能回流新版。 | 不是可接受的产品 residual；在 Step 15 前不得作为正式基线。 | 逐章重建正式 06 并做来源/编号/状态/路径静态审计；保留旧材料仅作差异输入。 | 验收文档负责人（角色槽位） | 不适用（正式装配前置） | `<step-15-assembly-trigger>` |

表中所有 `<...-trigger>` 均是未来需由相应 authority 定义的占位符，不是当前日期、SLA 或已批准承诺。`RES-MI-*` 是本校准材料提出的临时记录键，不是正式需求或验收编号，未来需映射到稳定 issue。`MI-UP-*`、`Q-MI-*` 和 `DDD/PF-*` 的“可作为 future gap”不等于已接受；只有未来实际风险记录满足 §5.1 资格谓词，并被授权接受人签署，才可能进入有条件通过。

特别约束：`MI-UP-*` 或 `Q-MI-*` 只有在明确排除当前 P0、且有正式 authority/ref 支撑时，才可能按 R 进入候选；若其正向能力被本轮选入，或缺口影响 P0 evidence、truth、owner、dependency 或阶段门禁，则必须保持 `dependency_blocker` / `not_evaluable`，不能填写 accepted。

### 6.2 不可风险接受清单

| 项 | 不可接受原因 | 未来裁决 |
|---|---|---|
| `VETO-MI-001~006` 或 `VETO-MI-007` 任一实际命中 | 七项项目红线覆盖 truth、阶段、owner、依赖和证据，属于一票否决。 | 总体“不通过”；保留首次失败，按 Step 12 新 run 复验。 |
| 任一 `S` 级缺陷 | 破坏 P0 truth、安全、数据边界、证据完整性或阶段隔离。 | 不得风险接受、不得以 release smoke 或人工说明覆盖。 |
| redaction leak / raw secret / live state / 外部正文进入 truth、input、artifact 或 report | 静态/运行时边界已被越过，后续报告也不可信。 | 立即阻断并完成泄露清理、二次扫描和相关 P0 回归。 |
| evidence index 静态造证据、orphan EV、跨 run 拼接、覆盖失败 raw 或 report-audit 失败 | 验收裁决不可复核，无法证明真实执行链。 | evidence gate 失败；不允许以风险接受补报告。 |
| dependency boundary failed、sibling compile/path 越界或 outbound 非零 | 破坏依赖裁剪和 owner truth；`NoneAuthorized` 不得被覆盖。 | 总体不通过或暂停；重开依赖/接口/验收。 |
| P0 profile unavailable 却标记 passed、strict config silent fallback/partial apply、Production 使用 TestOnly fake | 运行基线和 fail-closed 语义不可信。 | 相关 P0 gate 失败；不得风险接受。 |
| Query / marker-only inbound / Job / report / handoff 反写真相或修复 projection | 违反本仓 data ownership 和 no-write 边界。 | 相关 VETO/过程硬门禁失败；回滚越界并重开设计。 |
| 无 authority 或 failed/blocked/unknown builder 结果仍生成 candidate、digest、formal ref、availability 或 consumer readiness | 形成伪造的构建/资格/供给事实。 | 视为 S/VETO；不得以外部 owner 缺口接受。 |
| `DDD-*`、`PF-*`、未闭合 `MI-UP-*` / `Q-MI-*` 被写成“已接受风险”以跳过正向门禁 | 这些是设计或依赖条件，不是可替代合同的 residual。 | 保持 blocker/pending，待 authority 闭合后重开。 |

### 6.3 未来风险接受记录的最小字段与不变量

未来 `reports/acceptance/risk-acceptance.md` 的每条记录必须至少具备以下字段；本 Step 不创建该文件，也不填写实例：

| 字段 | 必填 | 约束 |
|---|---:|---|
| `risk_id` | 是 | 稳定且可回指本表/正式 issue；不能只写自由文本。 |
| `classification` | 是 | 只能是合资格的 `B`、`R` 或经过严格审查的 A candidate；`S`/VETO/blocker 不得填写为 accepted。 |
| `scope` | 是 | 明确影响 P1/P2/future/operations 或不影响 P0 的边界。 |
| `impact` | 是 | 说明对当前验收、下一阶段、生产或下游 handoff 的实际影响。 |
| `acceptance_reason` | 是 | 解释为什么不阻断 P0，并引用正式 evidence/ref；不能写“后续补”。 |
| `evidence_refs` | 是 | 固定 `<run_id>` 的 EV/report/defect 或正式 authority ref；planned family 不算实例。 |
| `owner` | 是 | 对后续动作负责的角色/人；不得与接受授权混淆。 |
| `acceptor` | 是 | 有相应授权的接受角色/人；缺失、未确认或自签不合规时不得有条件通过。 |
| `deadline_or_trigger` | 是 | 可判定日期或触发条件；不能填 `latest`、空值或无界“以后”。 |
| `follow_up_ref` | 是 | `open-issues.md`、未来 `07-实施计划.md`、运维材料或 ADR 的稳定入口。 |
| `escalation_trigger` | 是 | 超期、范围升级、P0 影响、owner contract 变化或新 VETO 事实的升级条件。 |
| `status` | 是 | 先是 `candidate/pending`；只有正式审查后才可记录 accepted/closed，当前一律未生成。 |

不变量：接受记录不得改变原始 defect、VETO、artifact/report、digest、availability 或 owner truth；不得以新的风险记录覆盖首次失败；风险接受只改变“是否允许在明确条件下继续”的裁决，不改变事实本身。

### 6.4 风险接受裁决流

图类型：风险接受资格与放行裁决流

```text
future finding / residual
          |
          v
 classify record type
          |
          +--> S / VETO / hard gate / P0 not_evaluable
          |          |
          |          +--> block or fail; no risk acceptance
          |
          +--> design_blocker / dependency_blocker
          |          |
          |          +--> keep blocked; reopen owner/design; no residual downgrade
          |
          +--> B / R (or strictly bounded A candidate)
                     |
                     v
          prove scope and non-P0 impact
                     |
                     v
          attach evidence/ref + owner + acceptor
                     |
                     v
          attach action + deadline/trigger + follow-up
                     |
                     +--> missing field -> pending / no conditional pass
                     |
                     +--> complete -> future risk review
                                      |
                                      +--> accepted -> conditional-pass candidate
                                      +--> rejected/expired -> block or reopen
```

关键说明：

- 该图描述未来裁决顺序，不代表当前已经存在 finding、接受记录或放行结果。
- `not_evaluable` 先阻断 P0；只有查明是合资格 residual，且满足 §5.1，才可转入风险审查。
- “accepted” 仍不是本项目当前事实；最终总体结论和签署留 Step 14。

## 7. 后续动作、问题记录与跨文档同步

| 风险类别 | 必须同步的 future 入口 | 同步内容 | 当前状态 |
|---|---|---|---|
| B/R 候选、合资格 A 候选 | `reports/acceptance/risk-acceptance.md`、`open-issues.md` | risk_id、影响、证据、owner、acceptor、动作、deadline/trigger、升级条件、状态。 | 仅规划，文件未创建。 |
| 影响实现/配置/协议/状态的遗留项 | `07-实施计划.md` 或 future ADR | 阶段、boundary、依赖、回写 Step、重新基线和回归范围。 | 07 尚未授权/创建。 |
| 影响部署、运行、retention 或恢复的遗留项 | future `09-部署与运维手册.md` 或运维问题记录 | runbook、监控/归档、触发器、回滚/升级路径；不创造本仓 owner truth。 | 运维材料未创建。 |
| owner contract / sibling gap | 对应 owner issue、双方 handoff 记录和 `open-issues.md` | contract ref、确认方、版本、重开 Step 和关闭证据。 | 仍 pending；不得写确认结果。 |
| 证据或缺陷关闭 | `reports/runs/<run_id>/...`、`reports/acceptance/handoff.md` | 同 run artifact/report pair、EV mapping、首次失败、复验和 closure review。 | 没有实际 run 或报告。 |

同步规则：

1. 风险接受记录只引用证据和问题记录，不生成或修补 raw artifact/report，也不反写任何 domain truth。
2. 影响实现或设计的事项必须先回写 `03/04/05` 对应 calibration，再更新验收 oracle 和实施交接；不能只在风险表里“接受”。
3. 影响范围、阈值、owner、字段、状态、port、错误、配置、依赖或证据 schema 发生变化时，按 Step 12 的回归升级条件重开相关 Step。
4. 任何 acceptance record 逾期、触发条件满足、P0 影响扩大或 owner 合同变更，都必须从 conditional-pass candidate 回到 pending/block，不能继续沿用旧接受。

## 8. 与前序 Step 的一致性与重开规则

| 检查主题 | 本 Step 结论 | 需要重开的条件 |
|---|---|---|
| Step 9 非功能 | 结构性 P0 gate 与无阈值 performance/capacity/SLO residual 分离。 | 新 workload、正式阈值、SLO、retention 或产品环境进入本轮范围。 |
| Step 10 证据 | 风险接受必须依赖同 run、可追溯、脱敏的 evidence/report；不能补造证据。 | evidence schema、report-audit、redaction 或 retention policy 改变。 |
| Step 11 VETO | `VETO-MI-001~007` 与过程硬门禁不可接受。 | 任何新红线、适用范围变化或实际 VETO 命中。 |
| Step 12 缺陷/复验 | S/A/B/R 资格和 new-run 复验规则继续有效。 | 缺陷严重度、复验 family、关闭证据或 release gate 改变。 |
| 03/04/05 设计与测试 | blocker 不能降级，风险动作需回写 owning Step。 | `DDD-*`、`PF-*`、配置/状态/协议/测试证据语义闭合或变化。 |
| sibling/upstream owner | pending 只限制正向 lane，不产生 ready/accepted 事实。 | `MI-UP-*` / `Q-MI-*` owner 正式停审并提供可验证合同。 |

## 9. 当前事实、待确认与停审记录

### 9.1 当前实际状态

| 事项 | 当前状态 | 说明 |
|---|---|---|
| 实际风险接受记录 | `absent` | 未创建 `reports/acceptance/risk-acceptance.md`，无真实 acceptor 或日期。 |
| 实际 observed defect / defect closure | `absent` | Step 12 只定义规则，未执行测试或分诊。 |
| 实际 `run_id`、artifact、report、EV instance | `absent` | 所有 TC/EV/path 仍是 planned future contract。 |
| 实际 conditional pass / release verdict / signoff | `absent` | 本 Step 不作总体结论，不产生 readiness。 |
| `DDD-*` / `PF-*` blocker | `open` | 保持 design_blocker；不转为 defect 或 accepted residual。 |
| `MI-UP-*` / `Q-MI-*` | `pending` | 兄弟/上游并行内容不写成闭合合同。 |

### 9.2 待确认事项

| 待确认事项 | 影响 | 当前处理 | 未来确认方 |
|---|---|---|---|
| 真实风险接受人及授权范围 | 无法形成 conditional-pass 依据。 | 只保留 role slot；缺失时保持 pending。 | 验收/项目授权方（待指定） |
| 每个 residual 的具体日期或触发条件 | 无法判断逾期、升级和关闭。 | 使用 `<date-or-trigger>`，不填写真实日期。 | 对应 owner 与验收负责人 |
| 哪些 A 级缺陷可接受 | 可能影响 P0 truth 或可信证明。 | 默认不可接受，逐项审查。 | 验收与架构授权方 |
| performance/capacity/SLO/retention authority | 不能作数量化或长期运维结论。 | 作为 R/baseline gap；若进入本轮则重开。 | 产品、测试、运维、合规 authority |
| `MI-UP-001~009` / `Q-MI-001~004` owner 合同 | 影响正向接口、Artifact、事件、组件、mapping 和范围。 | 保持 pending/blocked/gap/unavailable。 | 相应唯一 owner |
| 07 实施计划和问题记录入口 | 不能交接阶段、boundary、commit 或实际动作。 | 不创建 implementation ledger/skeleton；等待 06 完成和用户授权。 | 实施计划维护者/用户 |

### 9.3 Step 内停审审计

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 是否明确可支持有条件通过的风险范围 | `pass_with_explicit_blockers` | 仅 B/R 和严格受限 A candidate；当前没有 accepted instance。 |
| 是否明确不可风险接受项 | `pass` | VETO、S、过程硬门禁、P0 not_evaluable 和 owner/design blocker 均已排除。 |
| 是否要求责任人、接受人、动作和截止/触发 | `pass` | 七列表和未来 report schema 均强制要求。 |
| 是否将 blocker 与 residual 分离 | `pass` | `DDD-*`、`PF-*`、`MI-UP-*`、`Q-MI-*` 保持原状态。 |
| 是否同步实施/运维/问题记录 | `pass_with_explicit_blockers` | 入口和字段已固定，但 07/报告/运维文件尚未创建。 |
| 是否存在真实风险接受或放行事实 | `absent` | 未执行、未生成、未签署；不得推导通过。 |
| 是否越过当前 Step | `blocked` | Step 13 完成后必须停审，等待用户确认 Step 14。 |

## 10. 正式 `06-验收标准.md` §13 回填草稿（当前禁止装配）

只有 Step 14 完成、Step 15 获准且项目/文档/Step 三层门禁均允许时，才可将以下收口内容写入正式 `06`：

```md
## 13. 风险接受与遗留项

> 校准来源：
> - `design-calibration/06_acceptance_step_13_risk_acceptance.md`
>
> 延伸阅读：
> - 建议继续阅读该中间产物的“风险接受资格谓词”“风险 / 遗留项登记表”“不可风险接受清单”“未来风险接受记录的最小字段与不变量”“后续动作、问题记录与跨文档同步”和“与前序 Step 的一致性与重开规则”小节。

风险接受只适用于已证明不影响当前 P0 truth、VETO、过程硬门禁和证据完整性的 B/R residual，或经逐项严格审查且影响范围受控的 A candidate。VETO-MI-001~007、S 级缺陷、redaction/evidence/dependency/report/config hard gate 失败、P0 evidence 不可裁决、设计/依赖 blocker、无 authority 生成 candidate/digest/ref、Query/Job/Inbound 反写真相、不合格版本进入 availability 和 pending/fake 冒充 readiness，均不得风险接受。

未来 `reports/acceptance/risk-acceptance.md` 每条记录必须包含 `risk_id`、`scope`、`impact`、`acceptance_reason`、`evidence_refs`、`owner`、`acceptor`、`deadline_or_trigger`、`follow_up_ref` 和升级条件。缺接受人、后续动作、截止/触发、证据或问题入口时，不得支持有条件通过。风险接受不改变原始事实，不覆盖首次失败，不解除设计/owner 合同，也不代替 Step 14 最终结论和签署。

影响实现、测试、运维或下游 handoff 的遗留项必须同步未来实施计划、运维材料或 `open-issues.md`；范围、阈值、字段、状态、协议、配置、依赖或证据 schema 变化时，先回写 owning calibration Step，再重建基线并按 Step 12 复验。当前未生成风险接受记录、实际证据、conditional pass、release verdict、signoff 或 readiness。
```

## 11. Step 自检与停审门禁

### 11.1 自检清单

- [x] 已读取并遵守验收 SOP Step 13、书写规范 §5.13、中间产物规范和 L1-governance 粒度参考。
- [x] 已按 M1~M4 模块分别收敛 hard gate、blocker、residual candidate 与同步闭环，并在模块间完成自检。
- [x] 已回答哪些风险可支持有条件通过、哪些风险不可接受、接受人是谁、动作/截止如何定义、是否同步实施/问题记录。
- [x] 已保留 `DDD-S9-B01/B02`、`DDD-S11-B03`、`DDD-S13-OPEN-01/02`、`PF-UNAVAILABLE-RECOVERY`、`MI-UP-001~009`、`Q-MI-001~004`、`R-MI-009` 和实施/历史污染风险。
- [x] 已明确 S、VETO、P0 hard gate、evidence integrity、owner/design blocker 不能借风险接受降级。
- [x] 已要求每条 future risk record 具备 stable ID、scope、impact、evidence、owner、acceptor、action、deadline/trigger、follow-up 和 escalation。
- [x] 已区分责任人和接受人；当前只保留角色槽位、`<date-or-trigger>` 和 pending，不填写真实人名/日期。
- [x] 已规定风险接受与 `reports/acceptance/risk-acceptance.md`、`open-issues.md`、未来 07/运维/ADR 的同步与重开规则。
- [x] 未创建实际风险报告、缺陷、run、artifact、report、EV instance、digest、verdict、signoff、readiness、implementation ledger 或 boundary skeleton。
- [x] 未修改正式 `06-验收标准.md`、07 或任何上游/兄弟项目文档。

### 11.2 Step 停审结论

| 条件 | 状态 | 说明 |
|---|---|---|
| 可接受 residual 的资格和边界清楚 | `pass_with_explicit_blockers` | B/R 可候选，A 严格限制；外部正向 lane 仍 pending。 |
| 不可接受项覆盖 VETO、S 和过程硬门禁 | `pass` | 见 §6.2；不可由 acceptor 覆盖。 |
| 风险表满足 SOP 七列 | `pass` | 见 §6.1；具体人名/日期留 future acceptance report。 |
| 后续动作、责任人、接受人、截止/触发可审查 | `pass_with_explicit_blockers` | 结构已固定，实际 owner/acceptor/日期尚未产生。 |
| 问题记录与实施/运维同步闭环 | `pass_with_explicit_blockers` | future 入口已固定；相关文件尚未授权创建。 |
| 当前实际 risk acceptance / conditional pass | `absent` | 没有实际 evidence、acceptor、verdict 或 signoff。 |
| 是否允许进入 Step 14 | `pending_user_review` | 本 Step 完成后立即停审，等待用户再次明确确认。 |

```text
step_13_status = completed_stop_review
step_content_gate_status = pass_with_explicit_blockers
document_gate_status = pending_user_review_for_step_14
eligible_classes = B, R, strictly_bounded_A_candidate
non_acceptance_classes = S, VETO, process_hard_gate, P0_not_evaluable, design_blocker, dependency_blocker
actual_risk_acceptance = absent
actual_conditional_pass = absent
actual_evidence_generated = false
formal_06_write_allowed = false_until_step_15
step_14_creation_allowed = false_until_user_confirmation
implementation_ledger_allowed = false
planned_boundary_skeleton_allowed = false
test_execution_allowed = false
commit_required = false
```
