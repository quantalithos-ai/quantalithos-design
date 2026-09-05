# Step 9. 定义 Spike、风险与待确认事项

> 对应 SOP：`standards/document/实施计划讨论流程_SOP.md` Step 9。
>
> 回填章节：未来 `07-实施计划.md` §9 Spike、风险与待确认事项。
>
> 粒度参考：`projects/L1-governance/design-calibration/07_implementation_plan_step_09_spikes_risks_open_questions.md`。只参考 Spike / 风险 / 待确认 / 截止点 / 停审结构；不继承 Governance 的对象、outbox、环境、实施或验收结论。
>
> 事实边界：以下条目是 future planning 的风险治理，不是已执行的 Spike、已关闭 blocker、已建立的实现仓、已跑的检查、已生成的 report/evidence 或任何 delivery / acceptance 结论。

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 9：定义 Spike、风险与待确认事项 |
| Step 状态 | `completed / pass_with_explicit_blockers / serial_continuation_authorized` |
| 输入基线 | Step 1 输入风险、Step 5 phase、Step 6 18 boundary、Step 7 gate、Step 8 配置 / 依赖准备；正式 `03`～`06` |
| 本步输出 | Spike、blocker / risk、待确认、回写触发、期限和跨风险审计 |
| 当前执行事实 | 所有 Spike 均为 `planned / blocked / waiting`；未创建实现仓、未执行 probe、未选择物理产品、未产生 run 或证据 |
| 停审方式 | 每项都绑定 PH / boundary、输出或关闭条件、责任方向和期限；用户已授权连续推进，下一动作只能进入 Step 10 |

## 2. 本步输入

| 输入 | 本步用途 | 使用上限 |
|---|---|---|
| Step 1～2 | 继承 full-restart、P0 member-local / fail-closed 范围和 P1/P2 隔离 | 不把历史材料或外部 positive 纳入 P0 |
| Step 3 | 继承目标仓、dirty planning baseline、Core path、阅读与 implementation ledger 前置 | 不把 planned path 当已存在仓 |
| Step 5 | 为每项风险确定 PH-01～08 影响面 | 不重排 phase |
| Step 6 | 为每项风险确定 18 boundary 的最迟处理点 | 不改名、拆分或创建 boundary |
| Step 7 | 将 redaction、dependency、report / VETO 与风险处理绑定 | 不执行 suite 或生成 artifact |
| Step 8 | 继承 compile/runtime/event/ref/adapter/fake/persistence 分类及不可用处理 | 不新增配置、provider 或 physical product |
| `03_ddd_step_18_risks_open_questions.md` | 继承 `L2M-UP-001~008`、`L2M-DDD-001~007` 与 `scope_supersede_gap` 的 owner / repair 红线 | 不将历史风险记录当作已修复 |
| `04` §14、`05` §14、`06` §13 | 对齐配置、回归、residual、VETO 和风险接受规则 | 07 不裁决 risk acceptance 或验收 |

## 3. SOP 问题回答

1. **哪些技术点需要先做 Spike？**

   仅对会改变开工许可、compile compatibility、durable realization、release evidence 或性能结论的未知项设置 Spike：目标仓 / baseline preflight、Core compatibility、physical Store / UoW realization decision、release report / static-evidence guard、P1 selected-seam eligibility 及 workload/SLO authority。对象、factory、state、Port、receipt 或 helper 缺口不是可由实现 Spike 自行裁决的事项，必须回写 owning design。

2. **哪些风险会阻塞某个阶段？**

   目标仓和 immutable baseline 阻塞 PH-01；Core path / toolchain mismatch 阻塞 compile boundary；`scope_supersede_gap`、`L2M-DDD-003~007` 阻塞各受影响 CP / Consumer / Job boundary；`L2M-UP-001~008` 阻塞 external positive lane；`L2M-UP-005` 阻塞 24 candidate 的一切 Event materialization；redaction、dependency、state/UoW/replay、evidence provenance 和 VETO 条目阻塞对应 gate 与 PH-08 handoff。

3. **哪些待确认事项会影响提交边界或验收门禁？**

   目标仓与 baseline、Core API / MSRV、physical durability、scope successor、Consumer receipt、CP04～CP07 helper / version、owner selected-run contract、workload/SLO authority、actual release-run protocol 与 acceptance review responsibility 均影响具体 boundary 或 PH-08；每项在表中有最迟处理点，不能用“后续确认”继续。

4. **每个 Spike 的输出是什么？**

   Spike 只能输出可审查的 future decision record、compatibility mapping、design-reopen list、input/output contract check 或 workload authority record。它不能直接输出业务代码、mock success、commit、run_id、artifact、report、EV、verdict、signoff 或 readiness；如实施授权后实际执行，真实输出仍须遵守 Step 7 的 raw → report → review 链。

5. **每个风险的处理方式和截止点是什么？**

   hard blocker 在其最早受影响 boundary 开工前处理，P0 gate / redline 风险在对应 boundary 提交前处理，P1 selected seam 在 selected-run 前处理，性能结论在任何阈值或 release statement 前处理。未关闭时按照 `wait_design`、`blocked`、`not_run` 或 residual（仅非 P0 / 非 VETO）保留，而不是跨过截止点。

6. **哪些风险需要回写上游设计？**

   字段、DTO、state、factory、Port、receipt、selector、version、query marker、projection source、Job report、configuration binding、test/evidence schema、AC/VF/VETO 或 phase/boundary 变化，分别回写 `03`、`04`、`05`、`06` 或 `07`。Runtime、host、image、Core / Bus、Identity、Governance、Work 的 exact owner contract 由其 owner 关闭；本仓只更新 blocker 传播和受影响设计切口。

## 4. 当前文档问题诊断

| 位置 | 当前问题 | 风险 | 本 Step 处理 |
|---|---|---|---|
| Step 3 / Step 8 | 目标实现仓和 immutable baseline 未就绪 | PH-01 可能被误启动，或 dirty design 被当固定基线 | 标为 hard blocker，设 `commit-01-a` 开工前截止 |
| `03` Step 18 | local DDD gap 与 external blocker 已有，但未映射到 07 的 phase / boundary | 实施者可能将明确缺口混为一般 TODO | 用 boundary 级 deadline 和明确 `wait_design` 处理承接 |
| Step 7 | test / evidence 门禁很严格，但没有风险登记表 | static evidence、fake success 或未审查 draft 可能被误作交付 | 单列 evidence / VETO / review 风险，PH-08 前阻断 |
| Step 8 | fake、profile和依赖分类已固定 | P1 owner seam 或 physical product可能被误计入 P0 | 把 P0/P1 资格、physical durability和性能拆开登记 |
| historical material | README / 旧文档含旧 transport、token、指标等内容 | 旧结论重新混入 implementation | 列为持续 design-drift 风险，要求回到正式输入 |

## 5. 改动前后对比

| 项 | 本 Step 前 | 本 Step 后 | 原因 |
|---|---|---|---|
| blocker | 多份正式 / calibration 文件中分散记录 | 每项落到 phase / boundary、处理动作和期限 | 防止在实施时才发现不可开工 |
| Spike | 只有泛化的 future probe 意图 | 仅保留有可审查输出和关闭条件的 6 项 | 防止 Spike 代替设计或实现 |
| 待确认 | 容易写成无限期 external pending | 每项有 owner direction、未确认姿态和最迟点 | 防止“后续确认”绕过门禁 |
| P1 / P2 | 可能与 P0 local gate 混合 | selected run、durability、performance 单独列 residual / future | 防止伪通过 |
| design repair | 可能在 fake 或 adapter 内被静默解决 | 指定 `03`～`07` 的回写目标 | 防止实现侧补真相源 |

## 6. 设计取舍

| 方案 | 结论 | 理由 |
|---|---|---|
| 将所有 blocker 都列为实现 Spike | 不采用 | schema / state / Port 缺口必须由 owning design 修复，不能用实验决定 |
| 仅对开工、compatibility、durability、evidence、selected-seam、workload 设置 Spike | 采用 | 输出可审查且不会越权定义业务真相 |
| 把 external owner pending 写成普通风险并继续 positive 实现 | 不采用 | exact contract 未闭合时只能 local / blocked-aware |
| 让 P1 unavailable 计作 P0 failure 或 P0 pass | 不采用 | 两者都改变范围和事实等级 |
| 以 deadline / trigger 取代“后续确认” | 采用 | 每项都可阻断相应 boundary 或 handoff |

## 7. 结构化中间产物

### 7.1 Planned Spike 表

| ID | Spike | 影响 phase / boundary | future 可审查输出 | 关闭 / 不可替代规则 | 最迟点 |
|---|---|---|---|---|---|
| `SP-L2M-07-001` | target-repo / immutable-baseline preflight | PH-01 / `commit-01-a` | implementation authorization、target path、baseline manifest 和 dirty-worktree disposition 的 decision record | 未获授权或 baseline 不可固定即 `blocked`；不得在 design 仓创建实现仓 | `commit-01-a` 开工前 |
| `SP-L2M-07-002` | `core-contracts` Rust edition / MSRV / export compatibility mapping | PH-01 / `commit-01-a` | planned Cargo dependency graph 和 Core type / missing-export mapping | 只在目标仓存在后执行；缺 export 回写设计或 Core owner，不建 shadow type | `commit-01-a` 提交前 |
| `SP-L2M-07-003` | physical Store / UoW / durability realization decision | PH-02～07 / first durable boundary | product-authority decision或明确 fake-only P0 与 durable qualification reopen list | 不在 Spike 中自行选 DB / lock / migration；未定时不得宣称 durable / crash proof | 首个声称 durable 行为的 boundary 前 |
| `SP-L2M-07-004` | release raw→report→evidence / static-evidence guard dry-run | PH-08 / `commit-08-a` | generator input/output mapping、negative static-evidence check 和 review handoff checklist | future generator only consumes real raw output；不生成虚假 EV / verdict | `commit-08-a` 提交前 |
| `SP-L2M-07-005` | P1 selected-seam eligibility review | P1 lane / `owner-seam-selected` | owner-contract closure matrix、profile/credential/subject preconditions and blocked residual list | 不执行 positive integration，不替代 owner contract；P0 不依赖其成功 | any selected run 前 |
| `SP-L2M-07-006` | workload / SLO authority discovery | PH-08 / performance qualification | product workload、environment class、measurement ownership and threshold decision record | 无 authority 时只保留 duration/count sample；不填 P95/SLO 通过结论 | any performance / capacity conclusion 前 |

### 7.2 Blocker 与风险表

| ID | 类型 | 描述 | 影响 phase / boundary | 处理方式 | 最迟点 |
|---|---|---|---|---|---|
| `R-L2M-07-001` | blocker | target repo 不存在且当前设计工作区是 dirty planning baseline | PH-01～08 / `commit-01-a` | 等待 implementation authorization、目标仓和 immutable baseline manifest；当前不写代码或 implementation ledger execution | `commit-01-a` 开工前 |
| `R-L2M-07-002` | blocker | Core path、package/export、Rust compatibility 尚未在 Member workspace 实测 | PH-01 / `commit-01-a` | 仅 future Core mapping；不兼容则暂停并回写 03 / 07 或请求 Core owner closure | `commit-01-a` 提交前 |
| `R-L2M-07-003` | blocker | `scope_supersede_gap` 与 `L2M-DDD-003` Consumer receipt gap | PH-03、PH-07 / `commit-03-b`、`07-a/b` | 回写 03 owning object / protocol / flow / state / Store source；不 direct Store update或重算 receipt | affected boundary 开工前 |
| `R-L2M-07-004` | blocker | `L2M-DDD-004~007` 的 CP04～CP07 attempt/gap/helper/version缺口 | PH-05～07 / `commit-05-a`～`07-d` | `wait_design`，补齐 factory / relation / legal helper / CAS provenance 后重新做 boundary closure review | each affected boundary 开工前 |
| `R-L2M-07-005` | blocker | `L2M-UP-001~008` exact host、image、Runtime、credential、screening、subject合同未闭合 | PH-02～07 P1 positive lane | P0 只保留 local / negative / blocked posture；owner 合同关闭后才可 selected run | affected selected run 前 |
| `R-L2M-07-006` | blocker | `L2M-UP-005` 前 24 semantic candidate 被物化为 Event / publisher / outbox / route 的风险 | all PH，尤其 PH-05/07 | dependency boundary 检查；任何物化请求均回写 Core / Bus owner，不创建本仓事件设施 | any candidate-related boundary 前 |
| `R-L2M-07-007` | risk | physical Store / UoW / durability 产品未定 | PH-02～08 / durable qualification | 保留 logical semantics和 fake parity；产品选择需要独立 authority，不能反改 truth owner | durable claim 前 |
| `R-L2M-07-008` | blocker | raw body、secret、hidden reasoning 或定义正文泄漏 | PH-03～08 / all redaction boundaries | redaction source / serializer / artifact / report gate失败即停止；`VF-L2M-004` 不可风险接受 | each affected boundary 提交前 |
| `R-L2M-07-009` | blocker | illegal state、UoW / CAS / replay、Query / Job truth repair或 external-success localization | PH-02～07 | 修复当前 local implementation或回写 03；保留 failure disposition，不跨 boundary 继续 | each affected boundary 提交前 |
| `R-L2M-07-010` | blocker | fake、blocked、not_run、static artifact或未审查 draft 被伪装为 evidence / verdict | PH-08 / `commit-08-a/b` | raw→report pairing、dependency / redaction / static-evidence guard与 human / Agent review；`VF-L2M-008` 不可接受 | release handoff 前 |
| `R-L2M-07-011` | risk | fake / controlled seam 失去正式 version、UoW、receipt、report、Unknown 语义 | PH-02～07 | fake-parity / replay / negative check；不以 deterministic map 代替正式 Port | each fake boundary 提交前 |
| `R-L2M-07-012` | risk | P1 selected seam、staging-like / production-like 或 external success 混入 P0 | PH-01～08 | profile / evidence / acceptance 分开记录；unavailable 只 residual / not_run | PH-08 handoff 前 |
| `R-L2M-07-013` | risk | workload、SLO、capacity、retention authority 未定 | PH-08 | 只收集 future sample / authority，未定时不声明数值或 readiness | performance / release statement 前 |
| `R-L2M-07-014` | risk | historical CloudEvents、AG-UI、UDS、launch token、fixed port / P95、旧产品选择回流 | all PH | 以正式 00～06 和 current Core authority 复核；冲突则隔离 / 回写，不兼容迁移 | every design / dependency change 前 |

### 7.3 待确认事项与处理截止点

| ID | 待确认事项 | 影响 | 需要确认方向 | 未确认前处理 | 最迟点 |
|---|---|---|---|---|---|
| `OQ-L2M-07-001` | 实现仓创建授权、初始化来源和 immutable design baseline manifest | 全部实施 / 台账 execution | 用户 / implementation authority | 保持 design-only；global implementation ledger 不进入 active boundary | `commit-01-a` 开工前 |
| `OQ-L2M-07-002` | Core contracts 的实际 export / MSRV 与 Member workspace兼容 | PH-01 compile | `L0-core` + implementation authority | 只保留 planned path；不兼容时 pause / reopen design | `commit-01-a` 提交前 |
| `OQ-L2M-07-003` | physical Store / UoW product、durability / retention scope | durable、crash / operations claim | architecture / implementation / operations authority | fake-only local semantics；不写 DB / queue / migration / lock | first durable claim 前 |
| `OQ-L2M-07-004` | `Active -> Superseded` helper、scope relation和expected-version来源 | CP02 Replace scope | member 03 owning Step | `blocked / wait_design`，不让 repository save 冒充 transition | `commit-03-b` 开工前 |
| `OQ-L2M-07-005` | Consumer source/context/receipt、typed stored carrier和replay source | 14 Consumer / continuation | member 03 owning Step + source owner | finite refusal only；不 reconstruct receipt或扫描 current truth | `commit-07-a/b` 开工前 |
| `OQ-L2M-07-006` | CP04～CP07 factory / relation / helper / version closure | outbound、trace、mirror、projection、Job lane | member 03 owning Step | affected lane `wait_design`；不新增 fake helper或pseudo-version | respective `commit-05-a`～`07-d` 开工前 |
| `OQ-L2M-07-007` | exact host / image / Runtime / Core-Bus / credential / screening / subject contracts | P1 positive qualification | respective owner | P0 remains local / blocked-aware；no shadow schema or positive claim | selected run 前 |
| `OQ-L2M-07-008` | P1 selected-run 是否在本轮授权范围 | PH-08 / acceptance residual | product / acceptance authority | do not schedule as P0; record residual / not_run only | release handoff 前 |
| `OQ-L2M-07-009` | workload / SLO / capacity / retention authority | performance / operations conclusion | product / QA / SRE / archive authority | no hard threshold; no readiness conclusion | performance or retention claim 前 |
| `OQ-L2M-07-010` | actual release-run parameters、report generator invocation和acceptance review responsibility | PH-08 evidence / handoff | implementation / QA / acceptance authority | `<run_id>` remains future variable; scripts only create drafts; no automatic verdict | `commit-08-a/b` execution 前 |

### 7.4 设计回写触发与禁止 workaround

| 发现的缺口 | 必须回写 | 禁止 workaround | 恢复条件 |
|---|---|---|---|
| field、DTO、factory、state transition、Port、UoW、version、receipt、selector、stored result / Job report不闭合 | `03-详细设计.md` 与 owning calibration Step | default field、private map、direct Store update、string-only error、shadow type | 正式 / calibration source 修复并固定新 baseline |
| config key、profile、raw/validated binding、secret/redaction、slot failure不闭合 | `04-配置设计.md` | entry 自行发明 env / flag、silent fallback、raw secret fixture | 04 和受影响 03 binding 复核完成 |
| suite、fixture、artifact/report pair、script、EV provenance不闭合 | `05-测试方案.md` | hand-written pass、static evidence、latest reference | test / report contract回写并重映射 gate |
| AC、VF、VETO、risk acceptance、handoff / reviewer责任不闭合 | `06-验收标准.md` | P0/VETO口头豁免、script signoff | acceptance source更新并有获授权审查路径 |
| phase、batch、commit boundary、gate、rollback或delivery纪律冲突 | `07-实施计划.md` / current calibration Step | 在 implementation repo 临时改范围或跨 boundary 混入 | Step 5～12受影响项重新校准 |
| host、image、Runtime、Core/Bus、Identity、Governance、Work contract缺口 | corresponding upstream / sibling owner；本仓同步 blocker | local schema、generic adapter、event facility、external success claim | owner 发布可引用合同后，重新审计受影响 Step |

### 7.5 风险 / Spike 停审与跨审计

| 审查项 | 结论 | 缺口 / 处理 |
|---|---|---|
| 每个 Spike 是否有输出和最迟点 | `pass_for_design` | 所有输出均为 future decision / mapping，不是执行事实 |
| 每个 blocker / risk 是否绑定 phase 或 boundary | `pass_for_design` | 表 7.2 已覆盖 PH-01～08和受影响 18 boundary |
| 待确认事项是否存在无限期“后续确认” | `pass_for_design` | 每项有 explicit boundary / selected-run / claim trigger |
| DDD 与 UP 是否区分 owner和回写路径 | `pass_for_design` | 03 targeted repair 与 external owner closure分开 |
| P0 / P1 / P2 和 VETO是否分离 | `pass_for_design` | P1 residual不会成为P0 pass；VF/S不可接受 |
| evidence / report风险是否未被预先写成已通过 | `pass_for_design` | all run / artifact / report / review remain absent |
| 是否仍有实际阻塞 | `pass_with_explicit_blockers` | `L2M-DDD-001~007`、`scope_supersede_gap`、`L2M-UP-001~008`、dirty baseline、workload authority持续开放 |

## 8. 回填草稿

未来正式 `07-实施计划.md` §9 应保留六项 planned Spike：implementation baseline preflight、Core compatibility、durability realization decision、release evidence guard、P1 selected-seam eligibility和workload/SLO authority；每项均只能产出可审查的 future decision / mapping，不能替代代码、测试或验收。目标仓 / baseline、Core、scope / receipt / CP04～CP07 helper、owner contracts、24 candidate non-materialization、redaction / consistency / evidence、fake parity和性能 authority分别在表 7.2 绑定 PH / commit boundary。所有待确认事项必须在表 7.3 所列最迟点关闭；未关闭时只能 `blocked`、`wait_design`、`not_run` 或合规 residual，不能扩大 P0、伪造 external success或跳过 VETO。

## 9. 待确认事项

| 事项 | 当前处理 |
|---|---|
| 实现授权、目标仓和 immutable baseline | `L2M-DDD-001`；PH-01 前 hard blocker |
| Core compatibility / physical durability | planned Spike；不在当前设计仓执行或选型 |
| `scope_supersede_gap`、DDD receipt / helper / version gaps | 03 owning Step targeted repair；affected boundary `wait_design` |
| external exact contracts和P1 selected run | owner closure / explicit authorization 前保持 blocked |
| workload / SLO、release parameters、acceptance reviewer | future authority；不填数值、run_id、verdict或signoff |

## 10. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| Spike 表 | `pass_for_design` | 输出、边界、截止点和非替代规则完整 |
| blocker / risk 表 | `pass_for_design` | PH / boundary、处理和最迟点明确 |
| 待确认表 | `pass_for_design` | 无无限期事项 |
| 回写触发 | `pass_for_design` | 实现者不能自行补设计 |
| 跨风险审计 | `pass_with_explicit_blockers` | external / DDD / baseline / execution facts继续开放 |
| 可进入 Step 10 | `authorized` | 下一步只定义回退、暂停与变更控制 |
