# Step 10. 定义回退、暂停与变更控制

> 对应 SOP：`standards/document/实施计划讨论流程_SOP.md` Step 10。
>
> 回填章节：未来 `07-实施计划.md` §10 回退、暂停与变更控制。
>
> 粒度参考：`projects/L1-governance/design-calibration/07_implementation_plan_step_10_rollback_pause_change_control.md`。只参考暂停、回退、变更、恢复及停审结构；不继承 Governance 的领域、实现、证据或裁决结论。
>
> 事实边界：本文件只定义 future implementation 的控制规则。当前没有 implementation repo、current boundary、代码、测试、artifact、report、evidence 或 commit，因此表中动作不能被理解为当前已执行或已恢复。

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 10：定义回退、暂停与变更控制 |
| Step 状态 | `completed / pass_with_explicit_blockers / serial_continuation_authorized` |
| 输入基线 | Step 6 boundary、Step 7 gate、Step 8 dependencies、Step 9 Spike / risk / OQ；正式 `03`～`06` |
| 本步输出 | pause / rollback / change / recovery rules，failure matrix 与跨控制审计 |
| 当前执行事实 | 所有 control action 为 future planned；没有可回退的 Member implementation commit |
| 停审方式 | 触发、动作、责任、保存材料、恢复条件已收稳；用户已授权连续推进，下一动作只能进入 Step 11 |

## 2. 本步输入

| 输入 | 本步用途 | 使用上限 |
|---|---|---|
| Step 6 | 以 18 个 boundary 为默认暂停、恢复和 future commit 粒度 | 不改 phase / boundary inventory |
| Step 7 | 将 P0 gate、redaction、dependency、report audit、VETO和review failure转为控制动作 | 不预先裁决任何 gate |
| Step 8 | 将 repo / Core / profile / slot / owner-seam unavailable转为 hard pause、safe posture或P1 residual | 不配置或启动依赖 |
| Step 9 | 将 Spike、blocker、OQ和期限转为操作性恢复规则 | 不关闭任何 blocker |
| `03`～`06` | 区分 design truth gap、config/test/acceptance gap、VETO和risk acceptance | 不在 07 复制字段或裁决证据 |
| 代码实施台账规范 | 承接 `wait_design`、`fix_gate_failure`、current boundary 和用户改动保护 | implementation ledger 仍只在 Step 13 创建 planned skeleton |

## 3. SOP 问题回答

1. **哪些情况必须暂停当前阶段？**

   target repo / immutable baseline / Core compile prerequisite 缺失，字段 / DTO / state / factory / Port / receipt / version / report / evidence source 未闭合，phase boundary 越界，required local slot / P0 fake 不可用，任何 P0 gate 失败，redaction / dependency / report pairing / static evidence failure，`VF-L2M-001~009` 命中，或无关用户改动混入当前 boundary 时，必须暂停。当前项目尚未进入 implementation，因此这些是 future trigger，不是当前 failure。

2. **哪些情况允许回退到上一个提交边界？**

   默认只允许清理当前 boundary 的未提交、可安全识别的试探改动；已验证历史 commit、其他 phase 文件和用户已有修改不回退。若已提交 boundary 发现 defect，默认新建修复 boundary / commit，而非 rewrite history；amend、rebase或任何 destructive action 均需要用户明确要求及实现仓规则允许。

3. **哪些情况必须回写详细设计或测试方案？**

   object / protocol / flow / state / persistence / version / receipt / Job report 等闭环缺口回写 `03`；profile / binding / redaction / secret / slot缺口回写 `04`；suite / fixture / artifact-report / EV/gate contract 缺口回写 `05`；AC / VF / VETO / risk acceptance / handoff裁决缺口回写 `06`；phase / boundary / task / gate / delivery纪律冲突回写 `07`。外部 exact contract 则由 owning upstream / sibling 修复，本仓同步影响。

4. **门禁失败后如何处理？**

   先分类为 implementation defect、test/tool defect、design truth gap、dependency unavailable或 VETO / evidence integrity failure。前两者只在 current boundary 修复并重跑；design truth gap 必须 `wait_design`；dependency unavailable按 Step 8 的 hard pause / safe degraded / P1 residual处理；VETO、S、redaction、dependency、static evidence和P0 evidence failure不允许风险接受或跨越。

5. **外部依赖不可用时是否允许继续局部实施？**

   target repo、Core path、Rust、required local Store/UoW/technical/result slot、P0 fake和output-pairing checker不可用时，不允许继续受影响 boundary。optional resolver / projection / handoff 或未闭合 external owner可保留明确 local blocked / waiting / stale / gap / unknown路径。P1 real-like / production-like unavailable仅是 residual / not_run，绝不产生 P0 pass。

6. **恢复实施的条件是什么？**

   需要新 baseline / target repo可核验，blocker修复或正式 design回写完成，current boundary重新读取且 design closure review通过，worktree仅含授权范围，required gates已重跑并有真实结果；若涉及真实执行，failure raw artifact必须保留并让 fixed run report可回链。所有条件都适用时才允许从同一 boundary恢复。

7. **发现字段缺失、状态冲突、DTO 构造不完整或 phase boundary 越界时如何处理？**

   立即停止 current boundary，记录 affected boundary、正式 / calibration source、缺口、影响、禁止 workaround与建议回写目标，设 `next_allowed_action = wait_design`。实现者不得追加默认字段、私有 fake map、direct Store mutation、pseudo-version、string-only carrier、通用 adapter或跨 boundary内容；待正式 source和baseline更新后重新做闭环复核。

## 4. 当前文档问题诊断

| 位置 | 当前问题 | 影响 | 本 Step 处理 |
|---|---|---|---|
| Step 6 | 已有 boundary，但无统一回退 / 停止规则 | implementation 可能越过已定义边界 | 将 boundary固定为默认恢复单位 |
| Step 7 | 失败处理散布在 phase / boundary gate表 | 失败可能被错误降级为 notes | 形成 failure classification 和不可继续规则 |
| Step 8 | external unavailable分为 hard / optional / P1，但未转为控制流程 | 实施者可能临场选择 fake 或 default | 明确 pause、safe posture和 residual分流 |
| Step 9 | blocker和OQ已有期限 | 无操作规则时仍可能继续 | 将到期未闭合直接转为 `wait_design` / blocked |
| 当前 worktree | 设计仓有用户 / current planning changes | future implementation 可能误用 destructive cleanup | 明确任何回退均保护 user-owned / unrelated changes |

## 5. 改动前后对比

| 项 | 本 Step 前 | 本 Step 后 | 原因 |
|---|---|---|---|
| pause | 分散在 blocker、gate、config和测试规则 | 单一触发表、动作、责任和恢复条件 | 使停止可审查 |
| rollback | 仅有 boundary概念 | 明确只回退当前未提交范围、保护历史和用户改动 | 避免破坏可追溯性 |
| change | 只提“回写设计” | 按 03 / 04 / 05 / 06 / 07 / owner分类 | 避免 implementation补 schema |
| external unavailable | 只有 blocked语义 | hard pause / local posture / P1 residual 分流 | 避免 fake或external success混淆 |
| recovery | 未集中列出 | baseline、closure、scope、gate、evidence五项 | 防止未修复即继续 |

## 6. 设计取舍

| 方案 | 结论 | 理由 |
|---|---|---|
| 实现者自行临时调整 schema / scope 后继续 | 不采用 | 破坏真相源和commit boundary |
| 一律回退所有工作区改动 | 不采用 | 会破坏用户改动和已验证历史 |
| 按 implementation defect、tool defect、design gap、dependency unavailable和 VETO 分类 | 采用 | 既能修局部问题，也阻止越权补设计 |
| 把 P1 unavailable 视为 P0 failure / pass | 不采用 | 都会污染范围和事实等级 |
| 已提交缺陷默认 amend / rebase | 不采用 | 默认增加受控修复，历史重写仅在明确授权下处理 |

## 7. 结构化中间产物

### 7.1 暂停规则表

| 触发条件 | 动作 | 责任方向 | 必须保留的 future record | 恢复条件 |
|---|---|---|---|---|
| target repo、implementation authorization或immutable baseline缺失 | `pause / wait_design` | implementation / project authority | path / authorization / baseline disposition | target repo和固定baseline均可核验 |
| Core path、package/export或toolchain不兼容 | `pause / wait_design` | implementation + Core owner / designer | dependency error、path、compatibility mapping | Core / design closure后重新核验 |
| field / DTO / factory / state / Port / receipt / version / selector / report source缺口 | `pause / wait_design` | member design owner | affected boundary、source refs、gap、forbidden workaround | 03对应源修复并固定新baseline |
| config / profile / secret/redaction / slot binding缺口 | `pause / wait_design` | config design owner | config group、failure posture、affected entry | 04与必要03 binding回写并复核 |
| suite、artifact/report、EV provenance、AC/VF/VETO/handoff缺口 | `pause / wait_design` | QA / acceptance design owner | failed/absent pair、gate和source refs | 05 / 06回写，gate mapping复核 |
| phase / boundary越界或无关改动混入 | `pause / change` | implementation + design owner | diff范围、boundary map、user-change separation | scope拆回当前boundary，或07更新后重新授权 |
| required local Store / UoW / technical / result slot、P0 fake或pairing checker不可用 | `pause / fix_gate_failure` | implementation | availability/error posture和current config profile | required local capability恢复且gate重跑 |
| optional resolver / projection / handoff或external owner seam unavailable | local path only；positive lane `blocked / not_run` | owner coordination | blocked reason、safe local attempt/gap/status | owner contract闭合后另行selected run |
| redaction leak、non-Core dependency、candidate materialization、static evidence、P0 truth repair或VETO / S命中 | `pause / fix_gate_failure` or `wait_design` | implementation + security / design / acceptance | failed raw/report（if run）、diff、VETO / VF mapping | 修复、受影响family复验、redline / report audit通过；不得风险接受 |

### 7.2 回退规则表

| 场景 | 允许回退范围 | 禁止事项 | 恢复条件 |
|---|---|---|---|
| current boundary 未提交试探失败 | 仅 current boundary、明确属于本次试探且不含用户改动的文件改动 | 不碰 user-owned / unrelated changes；不使用 destructive broad reset | 回到 boundary required reads和design closure review |
| current boundary gate failed且属于 implementation defect | current boundary的最小修复 / 局部清理 | 不用回退代替缺陷分析；不删除 failure record | 修复后重跑当前boundary门禁 |
| current boundary暴露 design truth gap | 可保留安全的未提交诊断，或仅撤回可识别试探改动 | 不写半成品commit、不补schema / port / state | design回写和新baseline后重新开始该boundary |
| staged范围混入无关文件 | 仅撤出错纳入的stage / current boundary staging selection | 不清空工作区或删除用户文件 | staged清单只含当前boundary allowed scope |
| 已提交boundary发现bug | 新的受控fix boundary / commit | 不擅自amend、rebase、reset已验证历史 | 修复范围、gate和交接记录独立可审查 |
| generator或report映射错误 | current boundary的generator / generated output（如果真实执行已获授权） | 不手写pass、不得删除failed raw artifact | 修复generator并从真实raw重新生成 / 审计 |

### 7.3 变更控制表

| 触发 | 变更目标 | 必须动作 | 必须同步 | 恢复前验证 |
|---|---|---|---|---|
| object / protocol / flow / state / persistence / UoW / replay / version / receipt / Job report闭环缺口 | `03-详细设计.md` + owning calibration | 回写正式 / Step source，不能实现端脑补 | affected Step 6/7/10/11/12、05/06/07 mapping和blocker ledger | 重新完成 current boundary closure review |
| config source / profile / raw-validated binding / slot / secret / redaction缺口 | `04-配置设计.md` | 回写配置语义和 failure posture | affected 03 binding、05 config gate、07 Step 8 | config / redaction requirement重新核验 |
| test suite / fixture / script / artifact-report / EV contract缺口 | `05-测试方案.md` | 回写测试 / output规则 | affected 06 acceptance和07 Step 7 | targeted + report audit mapping重新核验 |
| AC / VF / VETO / defect / residual / review responsibility缺口 | `06-验收标准.md` | 回写裁决和风险接受规则 | Step 7、Step 9、Step 12 | VETO / evidence规则一致性审查 |
| phase / batch / commit boundary / gate / rollback / delivery纪律冲突 | `07-实施计划.md` + calibration | 修改计划并重新串行校准受影响Step | implementation ledger skeleton（若已创建）和project ledger | phase / boundary / gate cross-audit |
| host / image / Runtime / Core-Bus / Identity / Governance / Work exact contract缺口 | respective owner；本仓记录影响 | 等待 owner可引用合同，再做drift audit | affected 03～07 source、blocker ledger | owner contract与本仓boundary一致 |
| 可复用、跨项目且已证实的流程经验 | applicable standard only after authority | 先判定是否新经验，再按标准维护规则处理 | project memory / formal reference | 不能用当前项目假设修改通用规范 |

### 7.4 门禁失败处理矩阵

| 失败 / 不可用 | 初始分类 | 行动 | 是否可进入下一boundary |
|---|---|---|---|
| fmt / build / targeted suite失败 | implementation defect或dependency问题 | 当前boundary内修复后重跑；设计缺口则`wait_design` | 否 |
| state、UoW、CAS、replay、Query no-write、Job source-repair failure | P0 consistency / owner boundary | 停止；修实现或回写03；受影响family复验 | 否 |
| redaction leak | `VF-L2M-004` / S | 停止；修泄漏源 / checker，再重跑redaction和affected suites | 否 |
| non-Core Cargo / generic external adapter / candidate materialization | `VF-L2M-006/007` | 移除越界内容或回写架构 / Core-Bus owner | 否 |
| raw/report pair缺失、static EV、未审查acceptance draft | `VF-L2M-008` / evidence integrity | 修generator/source / reviewer path；不得静态补洞 | 否 |
| external owner positive seam unavailable | external blocker | P0仅保留local / blocked测试；记录not_run / residual | P0可继续；selected lane不可继续 |
| DDD helper / receipt / version / scope gap | design truth gap | `wait_design`；不得fake-only或direct Store workaround | affected boundary否 |
| workload / SLO authority unavailable | future / residual | 保留sample / unknown；不得作capacity / readiness结论 | P0可继续；performance conclusion不可继续 |
| user / unrelated change混入 | scope / worktree issue | 停止staging，隔离当前boundary范围 | 否，直到scope clean |

### 7.5 恢复实施流程与检查表

```text
pause trigger
  -> classify: implementation defect / tool defect / design gap / dependency unavailable / VETO
  -> preserve allowed diagnostic record: source refs, error, diff scope, raw/report if actually run
  -> fix locally or wait for design / owner closure
  -> fix target repo + immutable baseline posture
  -> reread current boundary and repeat design-closure review
  -> rerun required gate(s)
  -> resume the same boundary only
```

| 恢复检查 | 通过条件 |
|---|---|
| baseline / repo | current design baseline、target repo和current boundary均可核验；没有以dirty state代替baseline |
| design closure | fields、DTO、state、Port、Store、version、receipt / report、evidence与phase boundary均有正式来源 |
| worktree | staged / touched scope只含current boundary；用户无关改动未触碰 |
| dependency / profile | required Core、toolchain、local slots、P0 fake和profile可用；external positives仍正确blocked |
| gate / evidence | current boundary必需gate重新执行并留下真实结果；失败raw记录保留，fixed report可追溯（仅实际执行时） |
| next action | 仅在所有适用gate通过后进入future commit或next boundary；否则保持`fix_gate_failure` / `wait_design` |

### 7.6 暂停 / 回退 / 变更停审与跨审计

| 审查项 | 结论 | 缺口 / 处理 |
|---|---|---|
| hard pause与safe local posture是否区分 | `pass_for_design` | required local依赖暂停；optional/external seam不伪装positive |
| 回退是否默认保护用户和已验证历史 | `pass_for_design` | current uncommitted boundary only |
| 03～07与external owner的回写目标是否明确 | `pass_for_design` | 表7.3逐类指定 |
| 失败是否能区分fix_gate_failure与wait_design | `pass_for_design` | design缺口不允许local workaround |
| VETO / S / evidence integrity是否不可风险接受 | `pass_for_design` | 06规则原样承接 |
| 规则是否与18 boundaries、Step7 gates、Step8依赖、Step9 deadline一致 | `pass_for_design` | current implementation仍not_started |
| 是否存在“视情况处理”或隐式destructive rollback | `pass_for_design` | 无；任何历史重写需独立明确授权 |

## 8. 回填草稿

未来正式 `07-实施计划.md` §10 应明确：target repo / baseline / Core、P0 local slots、design truth缺口、phase越界、P0 gate、redaction / dependency / evidence failure、VETO / S和用户改动混入都必须暂停当前 boundary。回退默认仅限当前未提交 boundary 的可识别试探改动，保护用户改动和已验证历史；已提交问题默认新增受控fix，而非历史重写。对象 / 状态 / Port等回写03，配置回写04，测试证据回写05，验收裁决回写06，phase / boundary /gate纪律回写07，external exact contracts回到各owner。恢复必须有新baseline、closure review、clean scope、required gate重跑和真实结果的可追溯性；P1 unavailable只能residual，不能成为P0 pass。

## 9. 待确认事项

| 事项 | 当前处理 |
|---|---|
| 若将来已提交boundary需要amend / rebase / destructive rollback | 默认禁止；需用户明确要求、目标仓规则和安全scope核验 |
| failed artifact的保留期与archival介质 | 真实执行后按05 / 06 / archive authority确定；当前不生成artifact |
| 设计修复是否构成可复用标准经验 | 在真实设计修复时按适用标准判断；当前不假定有新经验 |
| external blocker closure后的drift audit责任 | owner合同可引用后，由member design owner复核受影响03～07范围 |

## 10. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| pause rules | `pass_for_design` | hard / optional / VETO触发明确 |
| rollback rules | `pass_for_design` | boundary范围和用户改动保护明确 |
| change control | `pass_for_design` | 03～07及owner回写目标明确 |
| gate failure matrix | `pass_for_design` | 不允许failed / blocked伪继续 |
| recovery rules | `pass_for_design` | baseline / closure / scope / gate / evidence可检查 |
| cross-control audit | `pass_with_explicit_blockers` | implementation与真实执行仍未开始 |
| 可进入 Step 11 | `authorized` | 下一步只定义提交、评审与交付纪律 |
