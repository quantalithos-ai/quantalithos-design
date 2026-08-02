# L4-sandbox 实施计划 Step 6 拆分阶段任务、编写顺序与提交边界

> 对应SOP: `standards/document/实施计划讨论流程_SOP.md` Step 6
> 书写规范: `standards/document/实施计划书写规范.md` §5.6
> 台账规范: `standards/document/代码实施台账与门禁规范.md`
> 可落码标准: `standards/document/设计真相源闭环与可落码性标准.md` §九
> 回填章节: `07-实施计划.md` §6 阶段任务拆分、编写顺序与提交边界
> 创建日期: 2026-07-17
> 状态: completed_reviewed_passed_to_step_7
> 本Step口径: 将已审查的`PH-01~14`拆为32个稳定commit boundary,固定任务顺序、代码批次、required reads、allowed / forbidden scope、设计闭环、经验复核、required checks、Commit Gate、Handoff Gate和planned skeleton输入。本Step不创建正式`07`、implementation ledger、boundary skeleton、目标实现仓、代码、commit、run、EV、测试结果、验收结论或签署。

---

## 1. Step状态与三层开工门禁

| 门禁层 | 检查结果 | 裁决 |
|---|---|---|
| 项目级台账 | 原恢复点为`07 / Step 5 / pending_user_review`;用户已明确“同意”,Step 5获得审查确认。 | passed_for_step_6 |
| 文档级flow | Step 1~5已依次审查传递;Step 6是唯一合法下一步。 | passed_for_step_6 |
| Step级输入 | Step 5已固定`HDO-SBX-00`、`PH-01~14`、`PH-QP`、14个phase gate及39 /55 /16 /7 /21覆盖。 | passed_for_boundary_design |
| 正式文档写入 | 本Step只形成§6回填草稿;正式`07`只能由Step 13装配。 | forbidden_in_step_6 |
| 实施台账实例 | 本Step定义全部路径和骨架输入;实例只能由Step 13与正式`07`同步创建。 | forbidden_until_step_13 |
| 实现侧动作 | 目标仓、代码、测试、脚本、commit、run和evidence均不得在本设计任务形成。 | forbidden_in_design_task |
| 下游Step | 用户已确认Step 6,Step 7已获得一次性放行。 | passed_to_step_7 |

当前恢复点:

```text
current_document = `07-实施计划.md`
current_step = Step 6 `拆分阶段任务、编写顺序与提交边界`
current_module = `implementation_tasks_commit_boundaries_reviewed`
gate_status = passed_to_step_7
next_allowed_action = 由`07_implementation_plan_step_07_test_acceptance_gates.md`承接;不得跳到Step 8
phase_count = 14
commit_boundary_count = 32
first_boundary = CB-SBX-01A
last_boundary = CB-SBX-14C
formal_07_created = no
implementation_ledger_created = no
planned_boundary_skeleton_created = no
implementation_repo_exists = no
```

### 1.1 Step内计划

| 顺序 | 动作 | 状态 | 可审查产物 /完成门禁 |
|---:|---|---|---|
| 1 | 恢复项目台账、flow和Step 5审查状态。 | done | 用户放行和唯一下一动作可追溯 |
| 2 | 读取Step 6 SOP /书写 /台账 /可落码标准、正式`03~06`和L1粒度参考。 | done | 32项SOP问题均有权威来源 |
| 3 | 按高风险面和可验证增量拆32个boundary。 | done | 不按单文件、单struct、单函数或日工作量拆分 |
| 4 | 为每个boundary固定任务、批次、路径、读物、scope和检查。 | done | 32 /32均可独立review、验证和必要时回退 |
| 5 | 完成逐boundary设计闭环、经验复核、粒度判断和停审。 | done | blocker绑定exact boundary,未标为ready |
| 6 | 定义implementation ledger与32件planned skeleton输入。 | done | Step 13可一次性机械创建,当前未实例化 |
| 7 | 完成交付物、phase、依赖、证据和越界审计。 | done | 39项交付物、14 phase无orphan |
| 8 | 输出§6回填草稿、blocker、自检和停审条件。 | done | 停在Step 6待审 |

---

## 2. 本步目标、输入与硬约束

### 2.1 本步目标

1. 把每个phase转译为有稳定ID、明确commit时机和可独立回退的commit boundary。
2. 把每个boundary内部动作拆为100~300行优先的可验证代码批次;预计超过300行继续拆批,任何单批不得超过500行。
3. 将状态、事务、并发、幂等、安全、审计、恢复、evidence和cross-repo等高风险逻辑隔离为独立批次,必要时隔离为独立boundary。
4. 为实现者提供exact required reads、预计修改路径、allowed / forbidden scope、build / test / evidence checks和暂停条件。
5. 让Step 13能一次性创建项目implementation ledger和全部planned skeleton,避免实现推进中反复要求设计侧补boundary。

### 2.2 输入表

| 输入 | 状态 | 本Step使用方式 |
|---|---|---|
| `07_implementation_plan_step_05_phases_dependencies.md` | completed_reviewed | 14 phase、依赖、HDO、P0-Q支线和phase gate的唯一直接输入 |
| `07_implementation_plan_step_04_objects_deliverables.md` | completed_reviewed | 39项`DEL-SBX-*`、目标路径和完成判定 |
| `07_implementation_plan_step_03_prerequisites_reading.md` | completed_reviewed | 11个阅读包、台账入口、git / Rust /依赖 /脚本前置 |
| 正式`03-详细设计.md`§3~§16 | reviewed | 七crate、对象 / port、55协议、flow、30 owner machines /31 canonical enum entries /39 shared declarations、38错误、UoW、并发、配置和测试切口 |
| 正式`04-配置设计.md`§3~§12 | reviewed | source、40组 /101项 /44域、profile、material、generation和runtime assembly |
| 正式`05-测试方案.md`§3~§14 | reviewed | 254 TC、16 suite、7 gate、17脚本、九schema、21 slot和fixed-run路径 |
| 正式`06-验收标准.md`§5~§14 | reviewed | 功能 /协议 /状态 / NFR / evidence / VETO和最终消费边界 |
| Step 6规范与台账 /可落码标准 | normative | 任务、批次、boundary、经验复核和八类gate字段 |
| L1-governance / L1-artifact Step 6 | granularity_reference | 参考逐boundary表密度和停审方式,不继承领域内容或ID |

### 2.3 硬约束

| 约束 | 本Step应用 |
|---|---|
| 一句话边界 | 每个`CB-SBX-*`只有一个可验证目标,不拼接无关能力。 |
| 可独立审查 /验证 /回退 | 每个boundary有exact scope、checks、commit时机和handoff条件。 |
| 批次规模 | 100~300行优先;超过300行拆批;超过500行的单批禁止开工。 |
| 高风险隔离 | state / transaction / race / idempotency / security / audit / recovery / qualification均独立批次。 |
| 契约先行 | public carrier、state / error和测试切口先于service / adapter / entry。 |
| 不按文件拆commit | 文件路径只是scope,不是boundary形成理由。 |
| 不跨phase偷跑 | forbidden scope显式排除后序协议、结果、evidence和真实外部能力。 |
| 设计者先复核 | 经验复核由设计者完成;实现者只校验baseline和现实条件。 |
| 不造事实 | 所有检查均为future required check,不表示已运行或通过。 |

---

## 3. SOP 32项问题回答

| # | SOP问题 | 本Step回答 /落点 |
|---:|---|---|
| 1 | 每阶段有哪些实施动作 | §7.6逐phase任务 /批次表固定。 |
| 2 | 任务输入、输出、完成判定 | 每个`IMPL-SBX-*`行包含输入、输出和判定。 |
| 3 | 阶段内编写顺序及原因 | 统一按contract -> domain -> application -> infra / fake -> entry -> tests / producer,并在各phase按依赖裁剪。 |
| 4 | 是否先锁外部契约和测试切口 | 是;每个业务纵切A批先固定DTO / state / error / fixture,再写副作用。 |
| 5 | 同提交与分提交规则 | 同一可验证增量、共同回退且无法独立验收的子功能同提交;高风险或可独立验证面分boundary。 |
| 6 | 何时可commit | required checks、scope / worktree / staged diff / message均满足后;任何design blocker、未验证代码或混入后序scope时禁止。 |
| 7 | 提交前测试 | §7.5逐boundary列future build / test / evidence checks;Step 7继续展开TC / AC门禁。 |
| 8 | 边界过大 /过小 | §7.9逐项判断;偏大边界必须按批次分写和分段review。 |
| 9 | 无关修改混入风险 | Commit Gate要求staged path与allowed scope逐项比对,用户无关改动保持unstaged。 |
| 10 | 能否一句话描述 | 32 /32在§7.1和§7.5有唯一目标。 |
| 11 | 能否独立review /验证 /回退 | 32 /32设计上成立;现实开工仍受各自Activation / Design Gate约束。 |
| 12 | 是否有单批超过300 /500行 | 配置、协议、jobs、全量case和report面预计超过300行,已拆成多个100~300行批次;禁止单批超过500。 |
| 13 | 哪些动作必须拆批 | §7.6的state、UoW、config、consumer、job、qualification、script和report均拆批。 |
| 14 | 哪些高风险逻辑独立 | `CB-SBX-02B~D /03B /04B /05B /06B /07A~C /08A~B /10A~B /11A~C /12B /13A~B /14A~C`含独立高风险批次。 |
| 15 | 每批验证什么 | 每批有compile / targeted test / safe fixture / structural check,不以最终release替代早期验证。 |
| 16 | 批次与boundary关系 | 一个batch只归一个boundary;一个boundary可含多个按序batch,全部通过后才允许一次commit。 |
| 17 | 开工前复核什么 | §7.2通用闭环加§7.8逐boundary适用经验项。 |
| 18 | 文档冲突如何处理 | `wait_design`,回写owner正式文档与校准产物,固定新baseline后重复核;不得调整代码绕过。 |
| 19 | boundary子功能为何同提交 | §7.7逐boundary给出同提交因果。 |
| 20 | 不包含哪些后序内容 | §7.5逐boundary列forbidden scope。 |
| 21 | 涉及哪些设计面 | §7.8逐行枚举command / query / event / job / outbox / projection / state / persistence / idempotency / evidence。 |
| 22 | 触发哪些历史经验 | §7.8按可落码标准§9.2选择exact复核项。 |
| 23 | 正式证据位置在哪里 | §7.4 required reads和§7.8 evidence location指向正式`03/04/05/06`章节。 |
| 24 | 高风险不适用理由 | §7.8只列最相关不适用面及具体原因,不使用裸`N/A`。 |
| 25 | 是否存在经验blocker | 没有要求回写`00~06`才能完成Step 6的冲突;HDO、版本、Shell、RFC 8785和P0-Q现实前置绑定exact boundary。 |
| 26 | 谁复核及何时重复 | 设计者在Step 13移交前整体复核;baseline变化或blocker修复后对受影响boundary重复核。 |
| 27 | 实现agent只校验什么 | design baseline、current boundary、required reads、allowed scope、现实依赖和gate evidence;不补schema /状态 /truth。 |
| 28 | boundary台账路径 | `design-calibration/implementation-boundaries/<boundary-id>.md`,32条见§7.5;文件名保持ID大小写。 |
| 29 | allowed / forbidden scope | §7.4固定exact路径,§7.5固定行为边界;两者共同写入skeleton。 |
| 30 | required checks、Commit / Handoff Gate | §7.3通用规则与§7.5逐boundary差异化输入。 |
| 31 | boundary是否停审 | §7.10记录32 /32设计层停审,不表示实现完成。 |
| 32 | 跨boundary是否有粒度 /依赖 /门禁缺口 | §7.13审计依赖、phase泄漏、批次、测试、证据、交付物和commit scope。 |

---

## 4. 当前材料问题诊断

| 问题 | 风险 | 本Step处理 |
|---|---|---|
| Step 5只有phase,没有commit粒度 | 实现者可能一phase一大提交或按文件随意切分 | 固定32个稳定boundary和逐项commit / handoff门禁 |
| 39项交付物是跨phase累计完成 | 单个boundary可能错误宣称整体交付 | §7.12区分primary completion与增量消费 |
| 五段核心写链横跨七crate | 只写domain或只写handler会留下不可验证半成品 | 以能力纵切组织contract、truth、UoW、fake、entry和targeted test |
| config / material / generation高度耦合 | parser、secret和assembly混写会扩大安全审查面 | `03A`固定strict schema,`03B`按material / profile / publication分批 |
| Query与Consumer原有并行表述不符合单current台账 | 即使`09A`已冻结shared marker / cursor,同时激活`09B`与`10A`仍会产生两个current boundary和不可判定恢复点 | 固定`09A -> 09B -> 10A -> 10B`;phase级准备材料可预读,实现、验证、提交和handoff严格串行 |
| P0-Q现实输入缺失 | 容易删掉qualification或用fake替代 | `13A /13B`保留mandatory且标`planned_blocked_activation` |
| final automation面较大 | 容易最后静态补EV / pass /签署 | `14A /14B /14C`分离gate、report/evidence和acceptance draft |
| implementation ledger尚不存在 | 实现agent可能无恢复点开工 | Step 13按§7.11一次性创建项目台账和32件skeleton |

## 5. 改动前后对比

| 维度 | Step 5后 | 本Step后 |
|---|---|---|
| 实施粒度 | 14个可验证phase | 32个稳定commit boundary,每个含任务和批次 |
| 编写顺序 | phase级依赖 | contract / state / transaction / adapter / entry / test的exact顺序 |
| 提交时机 | 未定义 | 每boundary checks通过且staged scope干净后commit |
| 设计闭环 | phase级预判 | 逐boundary required reads、经验项和失败回写 |
| 台账 | 只有模板方向 | 项目ledger路径、32件skeleton路径和初始化字段完整 |
| blocker | 绑定phase | 绑定`HDO /01A /02C /13A /13B /14A`等exact边界 |
| 实现授权 | 无 | 仍无;Step 13和HDO完成前不得开工 |

## 6. 设计取舍

| 取舍 | 选择 | 理由 |
|---|---|---|
| boundary ID | `CB-SBX-<phase><letter>` | 稳定、可排序、可从ID识别phase,不伪造commit hash。 |
| boundary数量 | 32 | 将canonical writer与Shell入口、boundary contract与事务纵切分别隔离,同时不退化为单文件 /单函数提交。 |
| PH-05拆分 | contract / domain与事务纵切两个boundary | 前者可用schema / state测试独立验证;后者独立承担backend side effect、UoW和entry风险。 |
| PH-07拆分 | Run、Capture、Handoff三boundary | 三个truth owner、adapter side effect和failure语义可独立验证 /回退。 |
| PH-08拆分 | Control / Failure与Cleanup / Redline两boundary | failure classification和安全释放 / containment有不同事故半径。 |
| PH-11拆分 | shared job kernel、relay / refresh / handoff、安全 / projection三boundary | 保持job no-repair,同时隔离lifecycle release和projection rebuild风险。 |
| PH-14拆分 | gate、report / evidence、acceptance draft三boundary | 防止脚本编排、evidence materialization和验收裁决边界互相污染。 |
| commit与batch | 多batch可归一commit | batch控制编写 /验证规模,commit控制可验证功能回退单位,两者不机械等同。 |
| open前置 | 不把任何boundary标ready | 当前仍缺HDO、baseline、目标仓 /版本、Shell / canonical工具和P0-Q输入。 |

---

## 7. 结构化中间产物

### 7.1 Commit boundary总索引与依赖拓扑

```text
HDO-SBX-00
  -> CB-SBX-01A
  -> CB-SBX-02A -> CB-SBX-02B -> CB-SBX-02C -> CB-SBX-02D
  -> CB-SBX-03A -> CB-SBX-03B
  -> CB-SBX-04A -> CB-SBX-04B
  -> CB-SBX-05A -> CB-SBX-05B
  -> CB-SBX-06A -> CB-SBX-06B
  -> CB-SBX-07A -> CB-SBX-07B -> CB-SBX-07C
  -> CB-SBX-08A -> CB-SBX-08B
  -> CB-SBX-09A -> CB-SBX-09B -> CB-SBX-10A -> CB-SBX-10B
  -> CB-SBX-11A -> CB-SBX-11B -> CB-SBX-11C
  -> CB-SBX-12A -> CB-SBX-12B
  -> CB-SBX-13A -> CB-SBX-13B
  -> CB-SBX-14A -> CB-SBX-14B -> CB-SBX-14C
```

关键说明:

- `HDO-SBX-00`不是实现commit;它由设计Step 13同步创建正式`07`、项目ledger和全部planned skeleton。
- `CB-SBX-09B`完成Query no-write纵切并通过Handoff Gate后才激活`CB-SBX-10A`;预读或准备后序材料不得变成并行实现、并行staging或第二个current boundary。
- `PH-QP`从`01A`后准备candidate packet,不是commit boundary;其全部输入在`13A`Activation Gate消费。
- 图只表达边界先后关系,不表示任何boundary已激活、实现、测试或提交。

| Phase | Boundary | 一句话可验证目标 | 直接前置 | 设计状态 |
|---|---|---|---|---|
| PH-01 | `CB-SBX-01A` | 建立可识别七crate且只有core编译依赖的目标workspace。 | HDO-SBX-00 | planned_with_preconditions |
| PH-02 | `CB-SBX-02A` | 固定body-free typed carrier、metadata、status和public error契约。 | 01A | planned |
| PH-02 | `CB-SBX-02B` | 建立可证明rollback、version和三通道replay的semantic persistence kernel。 | 02A | planned |
| PH-02 | `CB-SBX-02C` | 建立RFC 8785 canonical machine artifact writer / verifier primitive。 | 02B | planned_with_canonical_tool_blocker |
| PH-02 | `CB-SBX-02D` | 建立最小gate / report /安全check脚本入口和safe failure语义。 | 02C | planned_with_shell_lint_blocker |
| PH-03 | `CB-SBX-03A` | 严格解析并验证40组 /101项 /44域typed config。 | 02D | planned |
| PH-03 | `CB-SBX-03B` | 原子装配material-safe profile generation和P01~05 runtime composition。 | 03A | planned |
| PH-04 | `CB-SBX-04A` | 固定受理与execution identity的contract / domain闭环。 | 03B | planned |
| PH-04 | `CB-SBX-04B` | 打通OpenControlledExecutionContext事务纵切和API entry。 | 04A | planned |
| PH-05 | `CB-SBX-05A` | 固定active execution identity前置、四维coherent isolation boundary、workspace requirement、handle和lease的contract / domain闭环。 | 04B | planned |
| PH-05 | `CB-SBX-05B` | 打通EstablishExecutionBoundary事务纵切且拒绝weak fallback。 | 05A | planned |
| PH-06 | `CB-SBX-06A` | 固定policy / authorization / high-risk fail-closed truth。 | 05B | planned |
| PH-06 | `CB-SBX-06B` | 打通EvaluatePolicyExecution并证明非允许路径0 launch。 | 06A | planned |
| PH-07 | `CB-SBX-07A` | 打通守卫后的controlled run launch truth。 | 06B | planned |
| PH-07 | `CB-SBX-07B` | 打通body-free capture事实且诚实保留partial / failed。 | 07A | planned |
| PH-07 | `CB-SBX-07C` | 打通material handoff且delivery失败不回滚capture。 | 07B | planned |
| PH-08 | `CB-SBX-08A` | 打通control与failure classification并保持unknown不成功。 | 07C | planned |
| PH-08 | `CB-SBX-08B` | 打通cleanup guard、redline containment和release=0安全闭环。 | 08A | planned |
| PH-09 | `CB-SBX-09A` | 固定13 Query的view / access / page / projection read契约。 | 08B | planned |
| PH-09 | `CB-SBX-09B` | 打通13 Query service / API并机械证明write set为0。 | 09A | planned |
| PH-10 | `CB-SBX-10A` | 打通9 Consumer的schema、dedup、receipt和marker纵切。 | 09B | planned |
| PH-10 | `CB-SBX-10B` | 打通13 Event stored payload和publisher no-rollback纵切。 | 10A | planned |
| PH-11 | `CB-SBX-11A` | 固定10 Job的typed input、selection、report和stored replay kernel。 | 10B | planned |
| PH-11 | `CB-SBX-11B` | 打通relay / reference / capability / handoff维护jobs。 | 11A | planned |
| PH-11 | `CB-SBX-11C` | 打通reaper / cleanup / redline / projection / derived / reconciliation jobs且不修core truth。 | 11B | planned |
| PH-12 | `CB-SBX-12A` | 完成55协议、30个owner-level state machines /31个Step 10 canonical status enum entries /39个Step 6 shared status declarations、38错误和237条P0-C主归属inventory。 | 11C | planned |
| PH-12 | `CB-SBX-12B` | 完成14 TXN、19 race、parity、redaction和P0-C source writer加固。 | 12A | planned |
| PH-13 | `CB-SBX-13A` | 绑定单一candidate并在任何probe前固定不可替换qualification identity。 | 12B;PH-QP | planned_blocked_activation |
| PH-13 | `CB-SBX-13B` | 执行能力面所需13 CONF harness和cleanup disposition producer。 | 13A | planned_blocked_activation |
| PH-14 | `CB-SBX-14A` | 收口7 gate和9 check的触发、阻断及四source顺序语义。 | 13B | planned |
| PH-14 | `CB-SBX-14B` | 收口九schema、21 slot、fixed-run raw / report和EV allocation guard。 | 14A | planned |
| PH-14 | `CB-SBX-14C` | 生成四份acceptance draft与release handoff而不写裁决 /签署。 | 14B | planned |

### 7.2 开工前设计闭环Profile

所有boundary先执行`CL-SBX-BASE`,再执行本表绑定的专项profile。任一适用项没有正式证据即`blocked / wait_design`;“实现时再确认”不是通过结论。

| Profile | 适用面 | 必须逐项确认 | 明确不适用条件 | 失败处理 |
|---|---|---|---|---|
| `CL-SBX-BASE` | 全部boundary | design baseline可复现;required reads已读;字段 / DTO / typed-ref owner / factory / state / error / path / phase boundary一致;allowed scope包含真实owner最小路径;无后序结果依赖 | 无 | 回写owner正式文档和校准产物,固定新baseline后重复核 |
| `CL-SBX-BOOT` | workspace /依赖 | target path、edition / rust-version、七member、package / crate / binary、only-core compile dependency、git identity和用户改动保护 | 非bootstrap boundary不重复核创建动作,但继续遵守依赖方向 | 缺任一前置不得创建 /修改目标仓 |
| `CL-SBX-CONTRACT` | public carrier / protocol | support carrier schema、exact ref kind、metadata authority、source map、body-free / redaction、roundtrip、public error / disposition和reserved variant | 完全不触碰public / entry / stored result carrier时 | 回写`03`§6~§8;实现端不得私造字段 /enum |
| `CL-SBX-TXN` | command / consumer / job mutation | UoW begin / save / cursor / stored result / idempotency / commit顺序、accepted side-effect inventory、subject identity、rollback visibility、expected version、duplicate replay | 纯workspace、纯contract或纯read-only boundary | 回写`03`§8 / §10 / §12和对应测试切口 |
| `CL-SBX-STATE` | domain truth / marker | factory初态、合法 /非法 /terminal迁移、owner enum、typed error producer、recovery、race winner和no second truth | 不新增 /不推进任何状态的纯脚本boundary | 回写`03`§9 / §11 / §12和`05/06`状态门禁 |
| `CL-SBX-CONFIG` | config / builder / adapter | single raw owner、exact item / domain / profile、validation truth、complete generation、atomic publication、availability mapping、no implicit default / fallback | 不读配置、不装配adapter且不新增script selector时 | 回写正式`04`;不得在builder或fake补default |
| `CL-SBX-MATERIAL` | sensitive material / output | descriptor / ref / provider / lease / revoke owner、raw material no-carrier、safe issue、redaction和lifecycle outcome | 不接触敏感descriptor、provider或artifact / report内容时 | 回写`04`§8~§11;泄漏风险直接阻断 |
| `CL-SBX-QUERY` | Query / projection / read | view schema、lookup typed ref、visibility resolution、status marker source、degraded mapper、paged empty seed、public read-model identity、no-write和handler disposition | 非Query且不写 /读projection、derived或reconciliation surface时 | 回写`03`§7~§12;不得从ref字符串 / error文本推marker |
| `CL-SBX-CONSUMER` | inbound event | envelope / schema / source / digest / forbidden body、dedup channel、typed receipt save/get、reference cursor / trace subject、ack / retry / quarantine | 不消费inbound event时 | 回写consumer DTO / flow / UoW;trusted source不得绕guard |
| `CL-SBX-RELAY` | outbound event / publisher | canonical payload、source-transaction snapshot、relay ref / status / version、publisher outcome enum、topic binding、publish no-rollback和dead-letter终态 | 不append / publish event时 | 回写event / relay schema和flow;不得从latest truth重建payload |
| `CL-SBX-JOB` | public operations job | job input / selector / scope expansion、idempotency、selection paging、per-item UoW、typed report、stored replay、entry result detail、partial failure和no-repair | 不接收public Job DTO且不运行maintenance selection时 | 回写job schema / port / repository / flow;不得用job修core truth |
| `CL-SBX-SAFETY` | control / failure / cleanup / redline | public target穷尽、guard-first、unknown不成功、release call budget、lease / handle version、investigation marker、containment和材料保留 | 不触发control、failure、release、cleanup、redline或destructive adapter时 | 回写安全truth / state / VETO;缺guard默认Blocked |
| `CL-SBX-EVIDENCE` | machine artifact / script / report | exact JSON schema、RFC 8785、digest、writer / reader owner、relative path、status闭集、raw/report pairing、redaction、no static EV / pass和failure preservation | boundary只产Rust业务能力且不写 /读machine artifact时 | 回写`05`§9 / §13和`06`§10~§14 |
| `CL-SBX-CANDIDATE` | P0-Q | candidate / profile / generation / environment / template / provider / material immutable identity、13 CONF输入、0-launch preflight、anti-substitution和cleanup disposition | P0-C formal fake / controlled seam boundary | 缺任一输入保持Blocked且0 launch;不得降级替代 |

设计者在Step 13移交前必须根据§7.8逐boundary复核上述profile。实现者只检查所记录结论与当前baseline是否一致;不一致时暂停并报告具体缺口。

### 7.3 通用Gate、Commit时机与Handoff规则

| Gate | future通过条件 | 允许下一动作 | 失败 /未执行处理 |
|---|---|---|---|
| Activation Gate | HDO完成;项目ledger存在;全部32件skeleton存在;当前boundary唯一;前序Handoff Gate通过;该boundary现实前置关闭 | `read_docs` | future boundary保持`planned / wait_until_current`;不得并行激活 |
| Design Gate | baseline为真实commit;required reads有记录;§7.2适用profile和§7.8经验复核无blocker;DEL / protocol / TC / AC归属未漂移 | `verify_scope` | `blocked / wait_design`;修复后固定新baseline并重复核 |
| Scope Gate | touched path都在§7.4;行为都在§7.5 included scope;forbidden scope未命中 | `implement` | 缩小改动或回写boundary;不得顺手实现后序 |
| Worktree Gate | 记录初始`git status`;识别用户已有改动;无关文件不暂存;目标仓root和current HEAD明确 | `implement` / `run_checks` | 保护用户改动,解决冲突后重跑 |
| Build Gate | Rust boundary运行`cargo fmt --all -- --check`、受影响package `cargo check`和适用clippy;script-only boundary做syntax / lint等价检查 | `run_tests` | 只修当前scope;设计缺口转`wait_design` |
| Test Gate | §7.5 targeted checks和受影响case / suite全部按正式status输出;Blocked / NotRunConditional不被吞并 | `verify_evidence` | 修复并重跑;不得以其他phase结果替代 |
| Evidence Gate | 需要artifact的boundary按fixed-run schema写raw / report pair;不需要runtime artifact时以“not_applicable: no artifact producer”记录原因 | `prepare_commit` | 缺schema / pair / redaction时阻断commit |
| Commit Gate | staged files仅当前allowed scope;`git diff --cached --check`;required checks有证据;英文message对应一个boundary;无真实结果伪造 | `commit` | 清理staging /修message /重跑checks;不得提交 |
| Handoff Gate | 真实hash和message写回boundary /项目ledger;post-commit worktree记录;blocker与未跑项诚实保留;下一boundary由项目ledger唯一激活 | `read_docs` for next | 当前boundary不得标completed,下一boundary不得开工 |

Commit时机固定为: 当前boundary所有batch写完并逐批验证,Design / Scope / Worktree / Build / Test / Evidence / Commit Gate均有真实记录后,才允许形成一笔实现commit。批次中间允许本地未提交状态,但不得把未闭合boundary拆成没有独立可验证意义的“临时提交”。

### 7.4 Boundary required_reads与预计修改路径

以下路径均相对future目标仓`/home/aris/Projects/quantalithos-sandbox`。`tests/<area>/**`表示该正式测试分区下当前boundary新增 /修改的文件,不是允许横扫其他测试分区。

| Boundary | Required reads: exact正式章节 /标识 | Required calibration /标准 | Allowed path baseline | 禁止路径 /越界 |
|---|---|---|---|---|
| `CB-SBX-01A` | `03`§3.1~§4.5 / §16.2~§16.3;`05`§15.3~§15.5 | `03_ddd_step_04_file_layout.md`;Step 3 §7.8~§7.10;Rust /目录 /依赖规范 | `Cargo.toml`;`Cargo.lock`;`.gitignore`;`.codex/implementation_ledger.md`;七个`crates/*/Cargo.toml`;七个`crates/*/src/lib.rs`;正式binary空入口 | 任何业务DTO / state / service / adapter / test结果 / script实现 |
| `CB-SBX-02A` | `03`§6.1~§7.7 / §11.1;`05`§3.2~§3.4 / §6.4;`06`§7.5 | `03_ddd_step_06_object_contracts.md`;`03_ddd_step_08_protocol_contracts.md`;`03_ddd_step_16_test_cuts.md` | `crates/contracts/src/{lib,refs,metadata,kinds,status,errors,fixtures}.rs`;`tests/contracts/**`;`crates/contracts/Cargo.toml` | command业务DTO、domain state、repository / entry |
| `CB-SBX-02B` | `03`§5.6~§5.7 / §10.1~§10.5 / §12.1~§12.4 / §15.4;`05`§6 TXN / RACE | `03_ddd_step_11_persistence_transaction_consistency.md`;`03_ddd_step_13_concurrency_idempotency.md` | `crates/application/src/{ports,repositories,unit_of_work,idempotency,stored_results,errors}.rs`;`crates/infra/src/{truth_repositories,idempotency_store,result_store,clock_id,fakes}.rs`;`tests/{service,integration,support}/**` | 具体Command flow、domain-specific repository callable、config loader、real adapter、Query / Job |
| `CB-SBX-02C` | `05`§7.1~§7.5 / §9.4 / §13.1~§13.5;`06`§10.1~§10.4 | `05_test_plan_step_13_evidence.md`;`05_test_plan_step_13_evidence_schemas.md`;Step 3 PRE-SBX-008 | `tests/support/**`;canonical writer / verifier support及fixtures | script编排;static EV / pass;业务case;acceptance draft |
| `CB-SBX-02D` | `05`§9.2~§9.4 / §13.5;`06`§10.6~§10.8 | `05_test_plan_step_09_automation_gates.md`;Step 3 PRE-SBX-007 | `scripts/gates/run_ci_gate.sh`;`scripts/reports/generate_reports.sh`;`scripts/checks/{check_dependency_boundary,check_redaction,check_no_static_evidence}.sh`;script fixtures | 完整release编排;业务case;acceptance draft;静态EV / pass |
| `CB-SBX-03A` | `04`§3~§5 / §7 / §9.1~§9.10 / §11;`05`CFG-001~030 / ARCH-001~003 | `04_config_step_07_config_items.md`;`04_config_step_09_loading_validation_activation.md`;`04_config_step_11_failure_degradation.md` | `crates/infra/src/config.rs`;`tests/{integration,support}/**`;`crates/infra/Cargo.toml` | runtime service assembly、candidate、raw secret / implicit default |
| `CB-SBX-03B` | `03`§13.1~§13.5;`04`§6 / §8~§12;`05`§8.4~§8.5 / §10.3 | `04_config_step_06_environment_profiles_matrix.md`;`04_config_step_08_sensitive_secrets.md`;`04_config_step_12_downstream_handoff.md` | `crates/application/src/ports.rs`;`crates/infra/src/{config,runtime_builder,fakes,*_adapters}.rs`;`tests/{integration,support}/**` | concrete candidate产品;真实material;hot reload / LKG / P07 activation;业务service实现 |
| `CB-SBX-04A` | `03`§6 / §7.2~§7.3 / §8.2 / §9 intake / §11;`05`CMD-001/002,STA-001~003,ERR-014/015;`06`PG-SBX-001 | `03_ddd_step_06_object_contracts.md`;`03_ddd_step_10_state_matrix.md`;`06_acceptance_step_05_function_gate.md` | `crates/contracts/src/{commands,events,views}.rs`;`crates/domain/src/{context,identity,reference,audit,relay,errors}.rs`;`tests/{contracts,domain}/**` | application transaction、API handler、boundary / policy / run状态 |
| `CB-SBX-04B` | `03`§8.2 / §8.5 Open flow;§10 / §12;§14;`05`CMD-001/002及intake TXN / RACE;`06`AC-SBX-006~008 | `03_ddd_step_09_function_flows.md`;`03_ddd_step_11_persistence_transaction_consistency.md`;`03_ddd_step_15_observability_audit.md` | `crates/application/src/{commands,services,ports,repositories}.rs`;`crates/infra/src/{context_resolvers,truth_repositories,fakes}.rs`;`crates/api/src/{command_handlers,errors,bin/sandbox-api.rs}`;`tests/{service,integration}/**` | PH-05+ truth;Query;publisher;真实相邻仓集成 |
| `CB-SBX-05A` | `03`§6 boundary objects / §7.3 Command 2 / §9 boundary states / §11;`05`CMD-003/004,STA-004~009;`06`PG-SBX-002 | `03_ddd_step_06_object_contracts.md`;`03_ddd_step_08_protocol_contracts.md`;`03_ddd_step_10_state_matrix.md`;`04_config_step_06_environment_profiles_matrix.md` | `crates/contracts/src/{commands,events,views,errors}.rs`;`crates/domain/src/{boundary,reference,relay,audit,errors}.rs`;`tests/{contracts,domain}/**` | backend call;application UoW;real candidate probe;policy / launch;cleanup release |
| `CB-SBX-05B` | `03`§8.2 / §8.5 boundary flow / §10~§13 / §14;`04`I039/I040/I041/I065;`05`CMD-003/004及boundary TXN / RACE;`06`AC-SBX-009~011 | `03_ddd_step_07_trait_port_adapter_contracts.md`;`03_ddd_step_09_function_flows.md`;`03_ddd_step_11_persistence_transaction_consistency.md`;`03_ddd_step_14_config_external_binding.md`;`04_config_step_07_config_items.md` | `crates/application/src/{commands,services,ports,repositories}.rs`;`crates/infra/src/{backend_capability_adapters,isolation_backend_adapters,truth_repositories,fakes}.rs`;`crates/api/src/command_handlers.rs`;`tests/{service,integration}/**` | real candidate probe;policy decision;run launch;partial / weak fallback;cleanup release |
| `CB-SBX-06A` | `03`§6 policy / §7.3 Command 3 / §9 policy states / §11;`05` `TC-SBX-CMD-005`,`TC-SBX-CMD-006`,`TC-SBX-STA-010`,`TC-SBX-STA-011`,`TC-SBX-STA-012`,`TC-SBX-ERR-005`;`06` PG-SBX-003 | `03_ddd_step_06_object_contracts.md`;`03_ddd_step_10_state_matrix.md`;`04_config_step_11_failure_degradation.md` | `crates/contracts/src/{commands,events,views,errors}.rs`;`crates/domain/src/{policy,audit,relay,errors}.rs`;`tests/{contracts,domain}/**` | policy DSL / body;application side effect;backend launch |
| `CB-SBX-06B` | `03`§8.2 / §8.5 policy flow / §10 / §12 / §14;`05`policy targeted;`06`AC-SBX-012~015 | `03_ddd_step_07_trait_port_adapter_contracts.md`;`03_ddd_step_09_function_flows.md`;`03_ddd_step_11_persistence_transaction_consistency.md`;`03_ddd_step_13_concurrency_idempotency.md`;`06_acceptance_step_05_function_gate.md` | `crates/application/src/{commands,services,ports,repositories}.rs`;`crates/infra/src/{policy_adapters,truth_repositories,fakes}.rs`;`crates/api/src/command_handlers.rs`;`tests/{service,integration}/**` | backend launch / run / capture;caller推断allow;config allowlist;real unauthorized probe |
| `CB-SBX-07A` | `03`§6 run / §7.3 Command 4 / §8.5 run flow / §9 run / §10~§12;`04`I041/I065;`05`CMD-007/008;`06`PG-SBX-004 | `03_ddd_step_06_object_contracts.md`;`03_ddd_step_07_trait_port_adapter_contracts.md`;`03_ddd_step_09_function_flows.md`;`03_ddd_step_11_persistence_transaction_consistency.md`;`04_config_step_07_config_items.md` | `crates/contracts/src/{commands,events,views}.rs`;`crates/domain/src/{run,relay,audit,errors}.rs`;`crates/application/src/{commands,services,ports,repositories}.rs`;`crates/infra/src/{isolation_backend_adapters,truth_repositories,fakes}.rs`;`crates/api/src/command_handlers.rs`;`crates/worker/src/fulfillment_worker.rs`;`tests/{domain,service,integration}/**` | tool semantic execution;agent loop;lease profile / window重算;capture / handoff;real candidate |
| `CB-SBX-07B` | `03`§6 capture / §7.3 Command 5 / §8.5 capture flow / §9 / §11;`05`CMD-009/010;`06`PG-SBX-005 | capture / material / observability handoff校准;`04`§8 | `crates/contracts/src/{commands,events,views}.rs`;`crates/domain/src/{capture,relay,audit,errors}.rs`;`crates/application/src/{commands,services,ports,repositories}.rs`;`crates/infra/src/{handoff_adapters,truth_repositories,fakes}.rs`;`crates/api/src/command_handlers.rs`;`tests/{domain,service,integration}/**` | raw process output;Artifact / observability truth;handoff delivery;failure classification |
| `CB-SBX-07C` | `03`§6 handoff / §7.3 Command 6 / §8.5 handoff flow / §10~§12;`05`CMD-011/012;`06`PG-SBX-006 | handoff adapter / no-rollback校准;`06_acceptance_step_05_function_gate.md` | `crates/contracts/src/{commands,events,views}.rs`;`crates/domain/src/{handoff,relay,audit,errors}.rs`;`crates/application/src/{commands,services,ports,repositories}.rs`;`crates/infra/src/{handoff_adapters,truth_repositories,fakes}.rs`;`crates/api/src/command_handlers.rs`;`tests/{domain,service,integration}/**` | retry Job / feedback Consumer;downstream truth;capture rollback;acceptance结论 |
| `CB-SBX-08A` | `03`§6 failure / control / §7.3 Commands 7~8 / §8.5 flows / §9 / §11~§12;`05`CMD-013~016;`06`PG-SBX-007/008 | `03_ddd_step_12_error_recovery.md`;`05_test_plan_step_06_cases_errors_recovery.md` | `crates/contracts/src/{commands,events,views}.rs`;`crates/domain/src/{failure,control,run,relay,audit,errors}.rs`;`crates/application/src/{commands,services,ports,repositories}.rs`;`crates/api/src/command_handlers.rs`;`crates/worker/src/control_worker.rs`;`tests/{domain,service,integration}/**` | runtime recovery orchestration;cleanup / release;redline;unknown=>success |
| `CB-SBX-08B` | `03`§6 cleanup / redline / lease / §7.3 Commands 9~10 / §8.5 / §9 / §11~§12;`05`CMD-017~020;`06`PG-SBX-009/010,VETO safety | `03_ddd_step_10_state_matrix.md`;`04_config_step_11_failure_degradation.md`;`06_acceptance_step_11_veto.md` | `crates/contracts/src/{commands,events,views}.rs`;`crates/domain/src/{cleanup,redline,boundary,handoff,relay,audit,errors}.rs`;`crates/application/src/{commands,services,ports,repositories}.rs`;`crates/infra/src/{isolation_backend_adapters,handoff_adapters,fakes}.rs`;`crates/api/src/command_handlers.rs`;`tests/{domain,service,integration}/**` | public Jobs;force cleanup;真实teardown;risk acceptance;材料删除 |
| `CB-SBX-09A` | `03`§7.2 / §7.4 / §7.7 / §8.3 / §9 read states / §10;`05`QRY-001~026;`06`PG-SBX-011~023 | `03_ddd_step_08_protocol_contracts.md`;`05_test_plan_step_06_cases_commands_queries.md` | `crates/contracts/src/{queries,views,status,errors}.rs`;`crates/domain/src/{projection,reference,audit,errors}.rs`;`crates/application/src/{queries,ports,repositories}.rs`;`tests/{contracts,domain,support}/**` | query service side effect;API handler;rebuild / refresh;rich preview / analytics |
| `CB-SBX-09B` | `03`§8.3 / §8.5 query flows / §10.4 Query read / §11~§12 / §15.1;`05`SUITE-004/014;`06`AC-SBX-030/036 | `03_ddd_step_09_function_flows.md`;`03_ddd_step_11_persistence_transaction_consistency.md` | `crates/application/src/{queries,services,ports,repositories}.rs`;`crates/infra/src/{projection_repositories,truth_repositories,fakes}.rs`;`crates/api/src/{query_handlers,errors,bin/sandbox-api.rs}`;`tests/{service,integration}/**` | any write UoW / audit append / repair;storage scan;PH-10 consumer markers as prerequisite |
| `CB-SBX-10A` | `03`§7.2 / §7.5 / §7.7 / §8.4~§8.5 / §10.4 Consumer / §12;`05`CNS-001~022;`06`PG-SBX-024~032 | `03_ddd_step_08_protocol_contracts.md`;consumer / state / replay校准 | `crates/contracts/src/{events,receipts,status,errors}.rs`;`crates/domain/src/{reference,handoff,control,relay,audit,errors}.rs`;`crates/application/src/{consumers,services,ports,repositories}.rs`;`crates/infra/src/{truth_repositories,fakes}.rs`;`crates/worker/src/{consumers,control_worker,worker_runtime,errors}.rs`;`tests/{contracts,service,integration}/**` | outbound publisher;core success creation;raw body;Job;real bus |
| `CB-SBX-10B` | `03`§7.6 / §8.4~§8.5 relay / §10.4 Relay / §11~§12;`05`EVT-001~015,SUITE-005;`06`PG-SBX-033~045 | event payload / outbox / no-rollback校准;`06_acceptance_step_07_interfaces_events_sync.md` | `crates/contracts/src/events.rs`;`crates/domain/src/relay.rs`;`crates/application/src/{commands,consumers,services,ports,repositories}.rs`;`crates/infra/src/{publishers,truth_repositories,fakes}.rs`;`crates/worker/src/{event_relay_worker,worker_runtime}.rs`;`tests/{contracts,service,integration}/**` | payload从latest truth重建;source rollback;public Job;real topic provisioning |
| `CB-SBX-11A` | `03`§7.2 / §7.6 / §7.7 / §8.4 / §10.4 Job / §12;`05`JOB-001~012;`06`PG-SBX-046~055 | job surface / stored report / idempotency校准 | `crates/contracts/src/{jobs,status,errors}.rs`;`crates/application/src/{jobs,services,ports,repositories,stored_results}.rs`;`crates/jobs/src/{lib,job_runtime,errors}.rs`;`tests/{contracts,service,support}/**` | concrete job behavior;core truth repair;scheduler;release reports |
| `CB-SBX-11B` | `03`§8.4 Job flow / §10~§12;`05`JOB-001~004;`06`PG-SBX-046~049 | relay / refresh / handoff job校准;`04`retry / page policy | `crates/application/src/{jobs,services,ports,repositories}.rs`;`crates/infra/src/{publishers,handoff_adapters,backend_capability_adapters,truth_repositories,fakes}.rs`;`crates/jobs/src/{event_relay_publish,reference_refresh,backend_capability_refresh,handoff_retry,bin/**}.rs`;`tests/{service,integration}/**` | cleanup / release;projection / reconciliation;source truth rewrite;real scheduler |
| `CB-SBX-11C` | `03`§8.4 / §9 read-safety states / §10~§12;`05`JOB-005~010,SUITE-006/012;`06`PG-SBX-050~055 | safety / projection / reconciliation job校准;`06_acceptance_step_11_veto.md` | `crates/application/src/{jobs,services,ports,repositories}.rs`;`crates/infra/src/{isolation_backend_adapters,handoff_adapters,projection_repositories,truth_repositories,fakes}.rs`;`crates/jobs/src/{lease_orphan_reaper,cleanup_guard_evaluation,redline_handoff_maintenance,projection_rebuild,derived_maintenance,reconciliation,bin/**}.rs`;`tests/{service,integration}/**` | command-owned core success mutation;force release;query-triggered repair;hidden partial failure |
| `CB-SBX-12A` | `03`§6~§9 / §11 / §15;`05`§3.3~§6.4 / §9.1;`06`§7.2~§8.4 | protocol / state / error inventory校准;Step 5 §9.2~§9.3 | `crates/{contracts,domain,application,api,worker,jobs}/src/**`;`tests/{contracts,domain,service}/**`;expected protocol / TC manifest under`tests/support/**` | 新协议 /状态 /错误;infra product;candidate;report / release结论 |
| `CB-SBX-12B` | `03`§10~§15;`05`§6 TXN/RACE/ERR / §9~§13;`06`§8~§11 | consistency / evidence / architecture校准;Step 5 §9.3~§9.4 | `crates/{application,infra,api,worker,jobs}/src/**`;`tests/{service,integration,support}/**`;`scripts/checks/**`;P0-C source-writer support | candidate probe;PROFILE-06 claim;release aggregation;静态EV / pass |
| `CB-SBX-13A` | `03`§13;`04`§6 / §8~§12;`05`§7~§10 / §13;`06`§3 / §9~§11 | candidate / qualification identity校准;PH-QP packet | `crates/application/src/ports.rs`;`crates/infra/src/{config,runtime_builder,isolation_backend_adapters}.rs`;`tests/support/**`;`scripts/checks/check_qualification_identity.sh` | probe launch;fake / host substitution;多candidate;真实credential写仓 |
| `CB-SBX-13B` | `05`CONF-001~013 / SUITE-013 / GATE-P0Q / §13;`06`P0-Q适用AC / VETO | `05_test_plan_step_06_cases_config_security_qualification.md`;`06_acceptance_step_03_baseline.md` | `crates/infra/src/isolation_backend_adapters.rs`;`tests/{integration,support}/**`;`scripts/gates/run_backend_conformance_gate.sh`;`scripts/checks/{check_redaction,check_qualification_identity,check_cleanup_disposition,check_blocked_propagation}.sh` | static qualification result;PROFILE-06;production / capacity;缺identity仍launch |
| `CB-SBX-14A` | `05`§9.2~§9.4 / §12 / §13;`06`§3.4 / §10~§11 / §14 | gate / check contract校准;Step 5 §9.3 | `scripts/gates/{run_ci_gate,run_operations_gate,run_backend_conformance_gate,run_release_gate,run_selected_real_like_gate}.sh`;`scripts/checks/**`;`tests/support/**` | report renderer;acceptance draft;业务功能;静态gate pass |
| `CB-SBX-14B` | `05`§9.4 / §13.1~§13.5;`06`§10.1~§10.8 | machine schema / slot / report校准;`05_test_plan_step_13_evidence_schemas.md` | `scripts/reports/{generate_reports,generate_gate_results}.sh`;`tests/support/**`;report / schema fixtures | acceptance verdict /签署;修改source status;无raw分配EV |
| `CB-SBX-14C` | `05`§12~§14;`06`§4 / §11~§14 | acceptance handoff / final decision contract校准;`06_acceptance_step_14_final_decision_signoff.md` | `scripts/reports/generate_acceptance_handoff.sh`;acceptance / review path fixtures under`tests/support/**`;script tests | risk accepted;Pass / ConditionalPass verdict;review内容;签署;新业务 /协议 |

### 7.5 Boundary Gate Matrix、提交范围与时机

通用Commit Gate记为`CG-SBX-BASE`:检查staged path、cached whitespace、required checks、用户无关改动保护和英文message结构。通用Handoff Gate记为`HG-SBX-BASE`:真实commit hash / message、post-commit worktree、未完成check / blocker和下一boundary状态写回两级ledger。下表中的`CG+` / `HG+`是每个boundary必须叠加的专属条件,不能替代通用门禁。

#### 7.5.1 PH-01~PH-08

| Boundary / ledger file | Included scope / exact交付物与协议 | Commit时机与required checks | Evidence边界 | CG+ / HG+ | Excluded scope |
|---|---|---|---|---|---|
| `CB-SBX-01A` / `implementation-boundaries/CB-SBX-01A.md` | `DEL-SBX-CODE-001`;七crate / binary skeleton、Cargo依赖图、target version、local git / scratch入口 | HDO、version / core revision关闭且`cargo metadata --no-deps`;`cargo check --workspace`;package / binary / dependency direction检查完成后 | 只形成future ARCH producer基础;无run / EV | CG+: staged仅workspace / skeleton;HG+: `PHG-SBX-01`设计义务和`CB-SBX-02A`激活输入写回 | DTO、state、service、adapter、script实现 |
| `CB-SBX-02A` / `implementation-boundaries/CB-SBX-02A.md` | `DEL-SBX-CODE-002`共享carrier增量;`CODE-010 /012`,`DATA-001`,`TEST-001`基础;`SandboxProtocolMetadataDto`,`ActorContext`,`Command / Query metadata`,`Page`,`Receipt`,`JobReport`,`PublicError` | carrier roundtrip、missing field、typed-ref family、digest input boundary、body-free / redaction contract tests和`cargo check -p sandbox-contracts`完成后 | `ESLOT-SBX-001`producer contract起点;不分配EV | CG+: contracts owner路径 / contract tests同提交;HG+: exact carrier inventory传02B | 10 Command业务字段、domain、UoW、entry |
| `CB-SBX-02B` / `implementation-boundaries/CB-SBX-02B.md` | `DEL-SBX-CODE-004`;`DEL-SBX-CODE-005`;`DEL-SBX-CODE-011`;`DEL-SBX-ADP-001`;`DEL-SBX-TEST-005`共享kernel增量;UoW、version、cursor、idempotency、stored result、fake repository | staged commit / rollback / unique / version / cursor / stored replay tests;`cargo check -p sandbox-application -p sandbox-infra`完成后 | `ESLOT-SBX-010 /011`primitive;只保存测试输出,无业务EV | CG+: transaction files与kernel tests同提交;HG+: rollback / replay contract可供02C消费 | 具体Command / Consumer / Job flow、raw config、real adapter |
| `CB-SBX-02C` / `implementation-boundaries/CB-SBX-02C.md` | `DEL-SBX-EVD-001`;`DEL-SBX-EVD-003`;`DEL-SBX-DATA-001`增量;九schema共享identity / path / status / RFC 8785 / sha256 writer-verifier primitive | `SBX-IMP-CANONICAL-JSON-001`关闭;canonical / noncanonical / self-digest / path escape / redaction fixtures和writer-reader roundtrip完成后 | 只生成synthetic fixture;无真实`run_id` / EV | CG+: canonical工具选择和fixture同提交;HG+:算法 /版本 /失败surface传02D /14B | gate编排、report renderer、业务suite、static pass |
| `CB-SBX-02D` / `implementation-boundaries/CB-SBX-02D.md` | `DEL-SBX-AUTO-001`;`DEL-SBX-AUTO-002`;`DEL-SBX-AUTO-003`最小增量;`run_ci_gate`,`generate_reports`,dependency / redaction / no-static入口 | `SBX-IMP-SCRIPT-STANDARD-001`关闭;`bash -n`;选定Shell lint;参数 / missing-input / nonzero / safe-output fixtures完成后 | script只处理synthetic raw;不得形成release source或EV | CG+: 6个最小入口及script fixtures同提交;HG+:脚本参数 /退出码稳定后传03A | 完整suite orchestration、release / acceptance、业务测试结果 |
| `CB-SBX-03A` / `implementation-boundaries/CB-SBX-03A.md` | `DEL-SBX-CFG-001`;`DEL-SBX-CFG-002`;`DEL-SBX-CFG-003`;`DEL-SBX-CODE-005`;`DEL-SBX-DATA-001`;`DEL-SBX-DATA-002`增量;S01~S06 lane、40组、I001~I101、D01~D44、NCFG / FC / XVAL | `CFG-001~030`,`ARCH-001~003`适用;strict unknown / duplicate / ambiguous / unsupported / redacted issue fixtures;config coverage index完整后 | `ESLOT-SBX-013 /014 /016`schema producer增量;无runtime结论 | CG+: loader / validator / fixtures不可拆;HG+: validated generation input传03B | runtime publication、material resolve、candidate、implicit default |
| `CB-SBX-03B` / `implementation-boundaries/CB-SBX-03B.md` | `DEL-SBX-CFG-004`;`DEL-SBX-CFG-005`;`DEL-SBX-CFG-006`;`DEL-SBX-ADP-001`;`DEL-SBX-CODE-005`;`DEL-SBX-CODE-012`;P01~05 eligibility、23 material slots、complete generation、atomic runtime builder、P01~04 fake registry | profile / generation / material lease / revoke / redaction / partial publication / P05 missing-input / P06 conditional / P07 reopen tests完成后 | config / material safe machine records可由future gate消费;不得写raw material | CG+: material / generation / builder batches全部通过;HG+: complete assembly和availability contract传04A | candidate实现、真实secret、hot reload / LKG、业务service实例 |
| `CB-SBX-04A` / `implementation-boundaries/CB-SBX-04A.md` | `DEL-SBX-CODE-002`;`DEL-SBX-CODE-003`;`DEL-SBX-CODE-009`;`DEL-SBX-CODE-010`;`DEL-SBX-CODE-012`增量;`OpenControlledExecutionContext` request/result、`SandboxExecutionContextChanged` payload、intake / identity / reference truth与STA-001~003 | `CMD-001/002`,`STA-001~003`,`ERR-014/015`;contract roundtrip、factory invariant、illegal / terminal / forbidden-body tests完成后 | `ESLOT-SBX-002 /008 /012 /015`producer schema增量;不写accepted runtime evidence | CG+: protocol / truth / state / tests同提交;HG+: factory和payload source map传04B | resolver call、UoW、API、boundary / policy / run |
| `CB-SBX-04B` / `implementation-boundaries/CB-SBX-04B.md` | `DEL-SBX-CODE-004`;`DEL-SBX-CODE-005`;`DEL-SBX-CODE-006`;`DEL-SBX-CODE-007`;`DEL-SBX-CODE-009`;`DEL-SBX-CODE-011`;`DEL-SBX-CODE-012`;`DEL-SBX-ADP-001`;Command 1 resolver -> UoW -> truth / audit / relay / stale / stored result -> API | accepted / rejected / unresolved / duplicate / digest conflict / version race / rollback / backend-call-budget tests;affected crates check完成后 | `ESLOT-SBX-002 /008 /010 /011 /015`future producer可执行;仍无EV alias | CG+: full intake vertical slice同提交;HG+:`PHG-SBX-04`义务满足并传05A | Query / publisher /真实相邻仓;Command 2~10 |
| `CB-SBX-05A` / `implementation-boundaries/CB-SBX-05A.md` | `DEL-SBX-CODE-002`;`DEL-SBX-CODE-003`;`DEL-SBX-CODE-009`;`DEL-SBX-CODE-010`;`DEL-SBX-CODE-012`增量;`EstablishExecutionBoundary` carrier、`SandboxBoundaryChanged` payload、resource / filesystem / network / process四维隔离requirement、workspace requirement、decision / coherent set / handle / lease与STA-004~009 | `CMD-003/004`,`STA-004~009`,`ERR-006/007/027/029/030`;accepted context / active identity /四维隔离requirement + workspace requirement / profile / template / generation构造闭环、all-or-nothing、illegal state、weak-fallback factory tests完成后 | `ESLOT-SBX-003 /008 /012 /015`schema增量;P0-Q仍NotEvaluated | CG+: boundary carrier / state / errors / tests同提交;HG+:无policy输入的exact backend port input传05B | adapter call、UoW、candidate probe、policy / launch / release |
| `CB-SBX-05B` / `implementation-boundaries/CB-SBX-05B.md` | `DEL-SBX-CODE-004`;`DEL-SBX-CODE-005`;`DEL-SBX-CODE-006`;`DEL-SBX-CODE-009`;`DEL-SBX-CODE-011`;`DEL-SBX-CODE-012`;`DEL-SBX-ADP-001`;Command 2 context / identity / requirement -> capability -> I065-bound backend outcome -> decision / coherent boundary / handle / bounded lease grouped save -> audit / relay / replay -> API | controlled backend success / unsupported / stale / unavailable / race / rollback / duplicate / partial failed handle preservation;grouped-save coherence;`get_boundary_requirement`与boundary -> handle -> lease exact reads;adapter call budget完成后 | P0-C `ESLOT-SBX-003 /011~013 /015`;P0-Q不得由fake升格 | CG+: backend side effect、I065 window mapping、grouped UoW、typed reads、entry与tests同提交;HG+:`PHG-SBX-05`、immutable requirement ref、persisted handle / lease refs和P0-Q open状态传06A | real candidate;policy decision;run launch;cleanup release |
| `CB-SBX-06A` / `implementation-boundaries/CB-SBX-06A.md` | `DEL-SBX-CODE-002`;`DEL-SBX-CODE-003`;`DEL-SBX-CODE-009`;`DEL-SBX-CODE-010`;`DEL-SBX-CODE-012`增量;`EvaluatePolicyExecution` carrier、`SandboxPolicyDecisionChanged` payload、applicability / decision / high-risk truth与STA-010~012 | `TC-SBX-CMD-005`;`TC-SBX-CMD-006`;`TC-SBX-STA-010`;`TC-SBX-STA-011`;`TC-SBX-STA-012`;`TC-SBX-ERR-005`;missing / stale / conflict / unsupported均不Accepted的domain tests完成后 | `ESLOT-SBX-004 /008 /012 /015`schema增量 | CG+: policy carrier / state / errors / tests同提交;HG+:fail-closed source map传06B | policy body / DSL、port调用、launch |
| `CB-SBX-06B` / `implementation-boundaries/CB-SBX-06B.md` | `DEL-SBX-CODE-004`;`DEL-SBX-CODE-005`;`DEL-SBX-CODE-006`;`DEL-SBX-CODE-009`;`DEL-SBX-CODE-011`;`DEL-SBX-CODE-012`;`DEL-SBX-ADP-001`;Command 3按typed requirement ref读取前序事实,summary port一次返回body-free policy / authorization / high-risk snapshot,再原子保存snapshot / decision / audit / relay / replay并映射API | accepted / rejected / fail-closed / blocked / duplicate;requirement-context mismatch、stale snapshot、current config重建均拒绝;本boundary不调用backend launch | `ESLOT-SBX-004 /010~013 /015`future producer可执行 | CG+: exact requirement read、policy port / UoW / entry /tests同提交;HG+:`PHG-SBX-06`、Accepted / non-Allowed decision ref与guard义务传07A | backend launch / run / capture;local allowlist;real unauthorized probe |
| `CB-SBX-07A` / `implementation-boundaries/CB-SBX-07A.md` | `DEL-SBX-CODE-002`;`DEL-SBX-CODE-003`;`DEL-SBX-CODE-004`;`DEL-SBX-CODE-005`;`DEL-SBX-CODE-006`;`DEL-SBX-CODE-007`;`DEL-SBX-CODE-009`;`DEL-SBX-CODE-010`;`DEL-SBX-CODE-011`;`DEL-SBX-CODE-012`;`DEL-SBX-ADP-001`适用增量;Command 4、`SandboxRunChanged`、run truth及boundary -> handle -> persisted lease exact reads + Accepted policy guarded backend launch | `TC-SBX-CMD-007`;`TC-SBX-CMD-008`;Preparing / Running / terminal;boundary / handle / lease mismatch、inactive / expired lease或non-Accepted policy时call=0;launch failed before accepted、duplicate no-relaunch、rollback / race tests | `ESLOT-SBX-005 /008 /010~012 /015`run slice;无candidate证明 | CG+: exact typed reads / four-way guard、launch adapter / run UoW /entry /tests同提交;HG+:run result surface传07B,lease仍由前序group拥有 | tool semantics / agent loop、lease profile / window重算、capture、real candidate |
| `CB-SBX-07B` / `implementation-boundaries/CB-SBX-07B.md` | 同上适用增量;Command 5、`SandboxCaptureChanged`、capture truth、body-free material / observability refs | `TC-SBX-CMD-009`;`TC-SBX-CMD-010`;Complete / Partial / Failed / Unavailable、raw-body rejection、duplicate no-recapture、capture race / rollback tests | `ESLOT-SBX-005 /008 /010~012 /015`capture slice;Artifact / Obs truth仍外部 | CG+: capture adapter / truth /event /tests同提交;HG+:immutable capture refs传07C | handoff delivery、Artifact body、failure / cleanup |
| `CB-SBX-07C` / `implementation-boundaries/CB-SBX-07C.md` | 同上适用增量;Command 6、`SandboxMaterialHandoffChanged`、handoff truth / target / outcome和no-capture-rollback | `TC-SBX-CMD-011`;`TC-SBX-CMD-012`;Delivered / Retryable / Failed、target mismatch、duplicate、version conflict、delivery failure source unchanged tests | `ESLOT-SBX-005 /008~012 /015`handoff slice;不宣称下游接受 | CG+: handoff adapter / UoW /event /tests同提交;HG+:`PHG-SBX-07`和retry marker传08A | retry Job / feedback Consumer、downstream truth、acceptance |
| `CB-SBX-08A` / `implementation-boundaries/CB-SBX-08A.md` | `DEL-SBX-CODE-002`;`DEL-SBX-CODE-003`;`DEL-SBX-CODE-004`;`DEL-SBX-CODE-005`;`DEL-SBX-CODE-006`;`DEL-SBX-CODE-007`;`DEL-SBX-CODE-009`;`DEL-SBX-CODE-010`;`DEL-SBX-CODE-011`;`DEL-SBX-CODE-012`适用增量;Commands 7~8、Control / Failure events、control / failure truth | `CMD-013~016`;accepted / conflict / duplicate / pending input / classified / unknown-not-success / terminal guard / race tests | `ESLOT-SBX-006 /008 /010~012 /015`control / failure slice | CG+: two tightly coupled safety commands、state / UoW /entry tests同提交;HG+:classification markers传08B | runtime recovery orchestration、cleanup / redline / release |
| `CB-SBX-08B` / `implementation-boundaries/CB-SBX-08B.md` | 同上及`ADP-001`;Commands 9~10、Cleanup / Redline events、guard / containment / lease / release-call primitive | `CMD-017~020`;Allowed / blocked / pending evidence / investigation、non-Allowed release=0、redline non-advisory、no early delete / race tests | `ESLOT-SBX-006 /010~012 /015`;VETO-SBX-014/015 producer面 | CG+: guard / containment / adapter budget /tests同提交;HG+:`PHG-SBX-08`和read seed传09A | public Job、force cleanup、real teardown、risk acceptance |

#### 7.5.2 PH-09~PH-14

| Boundary / ledger file | Included scope / exact交付物与协议 | Commit时机与required checks | Evidence边界 | CG+ / HG+ | Excluded scope |
|---|---|---|---|---|---|
| `CB-SBX-09A` / `implementation-boundaries/CB-SBX-09A.md` | `DEL-SBX-CODE-002 /003 /009 /010`增量;13 Query DTO / views / access / page / marker、read repository trait与STA-020~023 | `QRY-001~026`schema / constructor;visibility / empty / stale / degraded / missing mappings;typed lookup / no-scan contract tests | `ESLOT-SBX-007 /008 /012 /015`schema增量 | CG+: all 13 public read carriers / repository reads / tests同提交;HG+:shared marker / cursor冻结,唯一激活09B | service / API、write / repair、consumer DTO、rich analytics |
| `CB-SBX-09B` / `implementation-boundaries/CB-SBX-09B.md` | `DEL-SBX-CODE-004`;`DEL-SBX-CODE-005`;`DEL-SBX-CODE-006`;`DEL-SBX-CODE-009`;`DEL-SBX-CODE-011`;`DEL-SBX-CODE-012`;`DEL-SBX-ADP-001`;13 Query services / API、projection / derived / comparison / reconciliation / audit read fakes | `QRY-001~026`,`RACE-019`,SUITE-004/014 targeted;visible / empty / restricted / stale / degraded / missing;write audit=0 | `ESLOT-SBX-007 /008 /011 /015`;no-write producer | CG+: 13 Query mapping / read adapters /tests同提交;HG+:`PHG-SBX-09`和read contract传10B /11A | refresh / rebuild / retry / cleanup / storage scan |
| `CB-SBX-10A` / `implementation-boundaries/CB-SBX-10A.md` | `DEL-SBX-CODE-002`;`DEL-SBX-CODE-003`;`DEL-SBX-CODE-004`;`DEL-SBX-CODE-005`;`DEL-SBX-CODE-007`;`DEL-SBX-CODE-009`;`DEL-SBX-CODE-010`;`DEL-SBX-CODE-011`;`DEL-SBX-CODE-012`;`DEL-SBX-ADP-001`;9 Consumer envelope / payload / service / worker / receipt / marker | `CNS-001~022`;schema / source / forbidden body / dedup / accepted / duplicate / delayed / quarantine / target mismatch / rollback tests | `ESLOT-SBX-008 /010~012 /015 /016`consumer slice | CG+: all 9 Consumer vertical slices and receipts同提交;HG+:receipt / marker / cursor contract传10B | outbound publisher;consumer建core success;real bus / topic |
| `CB-SBX-10B` / `implementation-boundaries/CB-SBX-10B.md` | `DEL-SBX-CODE-002`;`DEL-SBX-CODE-003`;`DEL-SBX-CODE-004`;`DEL-SBX-CODE-005`;`DEL-SBX-CODE-007`;`DEL-SBX-CODE-009`;`DEL-SBX-CODE-010`;`DEL-SBX-CODE-011`;`DEL-SBX-CODE-012`;`DEL-SBX-ADP-001`;13 Event payload / mapping、relay repository、publisher worker / outcome / route binding | `EVT-001~015`,SUITE-005 targeted,`RACE-014/015`;stored payload immutable、retry / dead-letter、source unchanged、topic key闭集 | `ESLOT-SBX-008~012 /015 /016`relay slice | CG+: payload snapshots /publisher /tests同提交;HG+:`PHG-SBX-10`和relay selection传11A | public Job runner、latest-truth rebuild、real bus provisioning |
| `CB-SBX-11A` / `implementation-boundaries/CB-SBX-11A.md` | `DEL-SBX-CODE-002`;`DEL-SBX-CODE-004`;`DEL-SBX-CODE-008`;`DEL-SBX-CODE-009`;`DEL-SBX-CODE-010`;`DEL-SBX-CODE-011`;`DEL-SBX-CODE-012`增量;10 Job DTO / scope / selection / report / item / stored replay / jobs entry kernel | `JOB-001~012`shared contract;invalid input / empty selection / duplicate report / idempotency conflict / partial status / entry detail tests | `ESLOT-SBX-008 /010~012 /015`job kernel | CG+: public job schema / application kernel /entry shell /tests同提交;HG+:stable report / selection surface传11B | concrete job side effect、scheduler、release reports |
| `CB-SBX-11B` / `implementation-boundaries/CB-SBX-11B.md` | `DEL-SBX-CODE-004`;`DEL-SBX-CODE-005`;`DEL-SBX-CODE-008`;`DEL-SBX-CODE-009`;`DEL-SBX-CODE-010`;`DEL-SBX-CODE-011`;`DEL-SBX-CODE-012`;`DEL-SBX-ADP-001`;Jobs 1~4: publish relay、reference refresh、capability refresh、handoff retry | `JOB-001~004`,`JOB-011/012`;bounded page、per-item UoW、duplicate owner calls=0、relay / handoff no-rollback、partial refs | `ESLOT-SBX-007~010 /013~015`maintenance slice | CG+: four collaboration jobs / binaries /tests同提交;HG+:markers / report传11C | reaper / cleanup / projection;source truth repair;real scheduler |
| `CB-SBX-11C` / `implementation-boundaries/CB-SBX-11C.md` | 同上;Jobs 5~10: lease reaper、cleanup eval、redline handoff、projection rebuild、derived maintenance、reconciliation | `JOB-005~010`,`JOB-011/012`,SUITE-006/012 targeted;guard-first、committed source rebuild、atomic latest report、partial / no-repair | `ESLOT-SBX-006~010 /013~015`;operations producer | CG+: safety / projection jobs按独立batch全过后同phase提交;HG+:`PHG-SBX-11`及55协议汇合传12A | core truth repair、force release、query repair、release conclusion |
| `CB-SBX-12A` / `implementation-boundaries/CB-SBX-12A.md` | `DEL-SBX-CODE-002`;`DEL-SBX-CODE-003`;`DEL-SBX-CODE-004`;`DEL-SBX-CODE-005`;`DEL-SBX-CODE-006`;`DEL-SBX-CODE-007`;`DEL-SBX-CODE-008`;`DEL-SBX-CODE-009`;`DEL-SBX-CODE-010`;`DEL-SBX-TEST-001`;`DEL-SBX-TEST-002`P0-C inventory增量;10 Command +13 Query +9 Consumer +13 Event +10 Job、30 state、38 error、237主case | protocol 55 /55、state 30 /30、error 38 /38、P0-C TC 237 unique-owner manifest;SUITE-001~006 /010 /011 targeted | `ESLOT-SBX-001~012 /015 /016`manifest完整性;无EV | CG+: inventory修复只限既有owner / tests;HG+:zero orphan清单传12B | 新协议 /状态 /错误 /case语义、candidate、release report |
| `CB-SBX-12B` / `implementation-boundaries/CB-SBX-12B.md` | `DEL-SBX-CODE-005`;`DEL-SBX-CODE-011`;`DEL-SBX-CODE-012`;`DEL-SBX-ADP-001`;`DEL-SBX-TEST-001`;`DEL-SBX-TEST-002`;`DEL-SBX-TEST-005`;`DEL-SBX-AUTO-003`;`DEL-SBX-EVD-001`;`DEL-SBX-EVD-002`;`DEL-SBX-EVD-003`P0-C增量;14 TXN、19 RACE、SUITE-001~012 /014 /016、MAIN / OPS writers | all 14 TXN /19 deterministic race;fake parity;dependency / redaction / coverage / protocol / pairing / blocked checks;MAIN-CONTRACT / MAIN-SEAM / OPS role separation | `ESLOT-SBX-001~016`producer / pairing能力;不声明source run Pass | CG+: consistency hardening与P0-C writer / checks同提交;HG+:`PHG-SBX-12`,P0-C自身状态和PH-QP packet传13A | candidate result、P1 claim、RELEASE aggregation、static EV |
| `CB-SBX-13A` / `implementation-boundaries/CB-SBX-13A.md` | `DEL-SBX-ADP-002`;`DEL-SBX-DATA-003`;`DEL-SBX-CFG-004`;`DEL-SBX-CFG-005`;`DEL-SBX-CFG-006`binding消费;单一candidate adapter / immutable qualification manifest / 0-launch preflight | candidate ADR、revision、PROFILE-05、SBX-ENV-05、generation、template、provider / material identity全闭合;identity mismatch / missing -> Blocked且launch=0 | 只形成qualification identity / preflight raw能力;不形成资格结论 | CG+: activation inputs及adapter mapping同提交;HG+:不可变packet /preflight传13B | CONF probe结果、多candidate、host / fake fallback、credential正文 |
| `CB-SBX-13B` / `implementation-boundaries/CB-SBX-13B.md` | `DEL-SBX-TEST-001`;`DEL-SBX-TEST-002`;`DEL-SBX-TEST-004`;`DEL-SBX-AUTO-001`;`DEL-SBX-AUTO-003`;`DEL-SBX-EVD-001`;`DEL-SBX-EVD-002`;`DEL-SBX-EVD-003`;`DEL-SBX-DATA-001`;`DEL-SBX-DATA-002`;`DEL-SBX-DATA-003`;SUITE-013、CONF-001~013、P0Q writer / checks / teardown | identity preflight -> 13 CONF harness -> redaction / identity / cleanup checks;Blocked / Failed保留;teardown / containment有disposition | `ESLOT-SBX-017~019`producer能力;真实结果只能future authorized run产生 | CG+: harness / checks / writer同提交且无静态result;HG+:`PHG-SBX-13`,P0-Q source contract传14A | PROFILE-06、production / capacity、多candidate、预填Passed |
| `CB-SBX-14A` / `implementation-boundaries/CB-SBX-14A.md` | `DEL-SBX-TEST-002`;`DEL-SBX-TEST-003`;`DEL-SBX-AUTO-001`;`DEL-SBX-AUTO-003`;5 gate入口、7 gate语义、9 checks、四source RELEASE顺序、P1 / scope入口 | script contract / syntax / lint / failure fixtures;missing / wrong role / order / identity / digest / Blocked传播均nonzero或正式status | 只消费synthetic fixture验证orchestration;不产release pass | CG+: gate / check完整入口同提交;HG+:source selector / result contract传14B | report renderer、acceptance draft、新业务 / TC |
| `CB-SBX-14B` / `implementation-boundaries/CB-SBX-14B.md` | `DEL-SBX-AUTO-002`;`DEL-SBX-EVD-001`;`DEL-SBX-EVD-002`;`DEL-SBX-EVD-003`;`DEL-SBX-EVD-004`;九machine schema、21 slot catalog、fixed-run raw / report pairing、EV allocation guard、run / suite / evidence renderer | schema / digest / path / status fixture;21 /21 expected / missing;pairing / no-static;missing raw / schema mismatch nonzero;source status原样保留 | renderer只从fixed raw生成;无合法pair不分配`EV-SBX-*` | CG+: schema writer / two report scripts / fixtures同提交;HG+:report packet传14C | acceptance verdict / risk / review /签署;修改source raw |
| `CB-SBX-14C` / `implementation-boundaries/CB-SBX-14C.md` | `DEL-SBX-TEST-001`;`DEL-SBX-TEST-002`;`DEL-SBX-TEST-003`;`DEL-SBX-AUTO-002`;`DEL-SBX-EVD-002`;`DEL-SBX-EVD-004`;`DEL-SBX-EVD-005`;conditional contract、handoff / veto / risk / open-issues四draft和review入口 | acceptance generator fixtures;四source binding、VETO / defect / risk fields保真、no verdict / no signature / redaction / path audit;scope check | 只生成draft能力;真实review / final decision仍future human process | CG+: acceptance generator / fixtures同提交;HG+:`PHG-SBX-14`,全部32 boundary和未决现实前置写回ledger | Pass / ConditionalPass / risk accepted /签署;新功能 /协议 /配置 |

### 7.6 逐Phase任务、代码批次与精确编写顺序

规模均指future production code +当前批targeted tests的预计有效改动,不含自动格式化或`Cargo.lock`机械变化。实现前若任一批重新估算超过300行,必须在同一boundary内按`-01a / -01b`继续切成可单独验证子批;任何单批超过500行均不得开工。

#### 7.6.1 PH-01 实现开工与仓基础

| 任务ID | 顺序 | Boundary | 实施动作 | 输入 | 输出 /完成判定 |
|---|---:|---|---|---|---|
| `IMPL-SBX-01-01` | 1 | 01A | 核对HDO、design / core baseline、target version、目标路径和本地git身份 | Step 3前置;HDO | 所有值有真实ledger记录,未关闭即停止 |
| `IMPL-SBX-01-02` | 2 | 01A | 创建root workspace和七member manifest | `03`§4.2~§4.3 | Cargo metadata识别七member且依赖方向可检查 |
| `IMPL-SBX-01-03` | 3 | 01A | 建立library / binary空skeleton和scratch恢复入口 | `03`§4.3~§4.4 | workspace独立check,未引入业务行为 |

| Batch | 目标 | 输入 -> 输出 | 预计规模 | 批后验证 | Commit关系 |
|---|---|---|---:|---|---|
| `BATCH-SBX-01A-01` | root / member manifest | target baseline -> root +七crate Cargo | 100~200 | `cargo metadata --no-deps`;dependency graph | 归01A |
| `BATCH-SBX-01A-02` | crate / binary skeleton | layout map -> lib / bin empty entry | 200~300 | `cargo check --workspace`;binary inventory | 归01A |
| `BATCH-SBX-01A-03` | repo guard / scratch | Step 3规则 -> git local config / ignore / scratch | 100~200 | repo root、git config、status保护检查 | 归01A |

#### 7.6.2 PH-02 Contract / Persistence / Harness Kernel

| 任务ID | 顺序 | Boundary | 实施动作 | 输入 | 输出 /完成判定 |
|---|---:|---|---|---|---|
| `IMPL-SBX-02-01` | 1 | 02A | 编写typed refs、metadata、authority、page和status carrier | `03`§7.2 | carrier可构造 / roundtrip且body-free |
| `IMPL-SBX-02-02` | 2 | 02A | 编写receipt / job report / public error共享面及contract fixtures | `03`§7.2 / §11 | exact disposition和safe mapping可测 |
| `IMPL-SBX-02-03` | 3 | 02B | 编写repository / UoW / version / cursor / idempotency / stored-result traits | `03`§10 / §12 | trait签名与transaction ordering闭合 |
| `IMPL-SBX-02-04` | 4 | 02B | 编写semantic fake、fault schedule与rollback / replay tests | TXN / RACE切口 | staging、winner和duplicate不重算可测 |
| `IMPL-SBX-02-05` | 5 | 02C | 选择并实现RFC 8785 canonical writer / verifier与九schema共享identity | `05`§13 | canonical bytes / self-digest / relative path可测 |
| `IMPL-SBX-02-06` | 6 | 02D | 编写最小gate / report / dependency / redaction / no-static shell入口 | `05`§9.3 | 参数、nonzero和safe finding可测 |

| Batch | 目标 | 输入 -> 输出 | 预计规模 | 批后验证 | Commit关系 |
|---|---|---|---:|---|---|
| `BATCH-SBX-02A-01` | ref / metadata carrier | shared source map -> refs / metadata / authority | 200~300 | roundtrip;missing / wrong kind | 归02A |
| `BATCH-SBX-02A-02` | status / result carrier | disposition contract -> page / receipt / report / error | 200~300 | status closed-set;redaction | 归02A |
| `BATCH-SBX-02B-01` | persistence traits | transaction contract -> repository / UoW / cursor traits | 200~300 | compile;trait contract tests | 归02B |
| `BATCH-SBX-02B-02` | idempotency / stored replay | key / digest contract -> reserve / result fake | 200~300 | same / different digest;missing result | 归02B |
| `BATCH-SBX-02B-03` | high-risk UoW parity | fault schedule -> commit / rollback / version / cursor fake | 200~300 | rollback visibility;single winner | 归02B |
| `BATCH-SBX-02C-01` | machine identity / path | schema contract -> shared structs / path validator | 150~250 | path escape / enum / required fixture | 归02C |
| `BATCH-SBX-02C-02` | canonical digest | selected RFC 8785 tool -> writer / verifier | 200~300 | canonical / noncanonical / self-digest | 归02C |
| `BATCH-SBX-02D-01` | gate / report shell | script contract -> two minimal entrypoints | 150~250 | syntax / lint / missing input | 归02D |
| `BATCH-SBX-02D-02` | safety check shell | safe finding contract -> three check entrypoints | 200~300 | deny fixture;no raw echo;nonzero | 归02D |

#### 7.6.3 PH-03 Strict Config / Profile / Runtime Assembly

| 任务ID | 顺序 | Boundary | 实施动作 | 输入 | 输出 /完成判定 |
|---|---:|---|---|---|---|
| `IMPL-SBX-03-01` | 1 | 03A | 编写S01~S06分lane source selector和single raw owner | `04`§3~§5 | unknown / duplicate / ambiguous稳定拒绝 |
| `IMPL-SBX-03-02` | 2 | 03A | 编写40组、I001~I101、D01~D44 typed schema和coverage index | `04`§7 | 101 /44机械闭集,无implicit default |
| `IMPL-SBX-03-03` | 3 | 03A | 编写NCFG / FC / XVAL validator和safe issue mapping | `04`§9 / §11 | invalid composition在builder前关闭 |
| `IMPL-SBX-03-04` | 4 | 03B | 编写23 material slot descriptor / lease / revoke provider-neutral面 | `04`§8 | raw material不进入ordinary carrier |
| `IMPL-SBX-03-05` | 5 | 03B | 编写P01~05 eligibility、P06 conditional、P07 reopen语义 | `04`§6 | profile状态无fallback或伪激活 |
| `IMPL-SBX-03-06` | 6 | 03B | 编写complete generation、atomic publication、registry和runtime builder | `04`§9~§12 | partial / mixed generation不可见 |

| Batch | 目标 | 输入 -> 输出 | 预计规模 | 批后验证 | Commit关系 |
|---|---|---|---:|---|---|
| `BATCH-SBX-03A-01` | source selector / parse | S lanes -> strict raw parse | 200~300 | unknown / duplicate / unreadable fixtures | 归03A |
| `BATCH-SBX-03A-02` | typed schema part A | I001~I101 owner table -> typed groups 1~20 | 200~300 | coverage index subset | 归03A |
| `BATCH-SBX-03A-03` | typed schema part B | owner table -> typed groups 21~40 / D01~D44 | 200~300 | 101 /44 complete coverage | 归03A |
| `BATCH-SBX-03A-04` | validation high risk | NCFG / FC / XVAL -> stable safe issues | 200~300 | CFG negative corpus | 归03A |
| `BATCH-SBX-03B-01` | sensitive registry | 23 slot contract -> descriptor / lifecycle | 200~300 | no-output / lease / revoke tests | 归03B |
| `BATCH-SBX-03B-02` | profile eligibility | PROFILE-01~07 -> eligibility / rejection | 150~250 | P05 missing;P06 conditional;P07 reopen | 归03B |
| `BATCH-SBX-03B-03` | generation publication | validated groups -> complete immutable generation | 200~300 | partial / mixed rollback tests | 归03B |
| `BATCH-SBX-03B-04` | runtime assembly | generation + registry -> atomic service target set | 200~300 | availability / fake parity / no default | 归03B |

#### 7.6.4 PH-04 受理与Execution Identity

| 任务ID | 顺序 | Boundary | 实施动作 | 输入 | 输出 /完成判定 |
|---|---:|---|---|---|---|
| `IMPL-SBX-04-01` | 1 | 04A | 编写Command 1 request / result、context event payload和source map | `OpenControlledExecutionContext`;PG-SBX-001 | DTO exact构造和event body-free |
| `IMPL-SBX-04-02` | 2 | 04A | 编写context / identity / resolution / reference factory与STA-001 /002 /003 | `03`§6 / §9 | invariant和illegal / terminal可测 |
| `IMPL-SBX-04-03` | 3 | 04B | 编写resolver / repository / subject mapper和Command 1 UoW | `OpenControlledExecutionContextFlow` | accepted group原子commit |
| `IMPL-SBX-04-04` | 4 | 04B | 编写fake、API handler / fulfillment wiring和targeted tests | CMD-001 / CMD-002 | accepted / unresolved / duplicate / rollback闭合 |

| Batch | 目标 | 输入 -> 输出 | 预计规模 | 批后验证 | Commit关系 |
|---|---|---|---:|---|---|
| `BATCH-SBX-04A-01` | intake contracts | formal protocol -> command / result / payload | 200~300 | contract roundtrip / source map | 归04A |
| `BATCH-SBX-04A-02` | intake truth / state | object contract -> factories / guards / errors | 200~300 | STA-001 /002 /003;ERR-014 /015 | 归04A |
| `BATCH-SBX-04B-01` | resolver / persistence surface | port contract -> resolver / repository / mapper | 200~300 | fake parity / missing mapping | 归04B |
| `BATCH-SBX-04B-02` | high-risk intake UoW | shared template -> reserve / save / side effects / replay | 200~300 | rollback / race / no recompute | 归04B |
| `BATCH-SBX-04B-03` | entry / evidence producer | service result -> API / worker mapping / tests | 150~250 | CMD-001 /002;safe error / redaction | 归04B |

#### 7.6.5 PH-05 Coherent Boundary

| 任务ID | 顺序 | Boundary | 实施动作 | 输入 | 输出 /完成判定 |
|---|---:|---|---|---|---|
| `IMPL-SBX-05-01` | 1 | 05A | 编写Command 2、boundary event和显式四维隔离requirement + workspace requirement / decision carrier | `EstablishExecutionBoundary`;PG-SBX-002 | accepted context / active identity、resource / fs / network / process / workspace、profile / template / generation字段齐全且无policy输入 |
| `IMPL-SBX-05-02` | 2 | 05A | 编写coherent set、handle / lease factory、STA-004~009和typed errors | boundary object contract | partial / weak状态不可构造;failed partial handle可诚实保存 |
| `IMPL-SBX-05-03` | 3 | 05B | 编写capability / backend ports、I065-bound outcome mapping、group repository exact reads和fake | boundary flow;I065 | supported / unsupported / unavailable稳定分类;window有界且typed reads无scan |
| `IMPL-SBX-05-04` | 4 | 05B | 编写Command 2 grouped-save事务、API映射和all-or-nothing tests | CMD-003 / CMD-004 | requirement / decision / boundary / optional handle / lease原子;partial failed handle保留;rollback / race / replay闭合 |

| Batch | 目标 | 输入 -> 输出 | 预计规模 | 批后验证 | Commit关系 |
|---|---|---|---:|---|---|
| `BATCH-SBX-05A-01` | isolation + workspace requirement contracts | request + service-injected source map -> DTO / payload / immutable requirement | 200~300 | CMD schema / body-free / no-policy-input checks | 归05A |
| `BATCH-SBX-05A-02` | boundary state high risk | formal matrix -> decision / coherent truth / handle / lease / errors | 200~300 | STA-004~009;weak fallback / partial-handle honesty | 归05A |
| `BATCH-SBX-05B-01` | capability / backend / lease seam | formal ports + I065 -> bounded outcome / fake / exact typed reads | 200~300 | failure injection / window validation / no scan | 归05B |
| `BATCH-SBX-05B-02` | coherent grouped transaction | command template -> atomic requirement / decision / boundary / optional handle / lease | 200~300 | grouped coherence / rollback / version race / duplicate | 归05B |
| `BATCH-SBX-05B-03` | entry / slice checks | service -> API / audit / relay / tests | 150~250 | CMD-003 /004;P0-Q no-substitution | 归05B |

#### 7.6.6 PH-06 Policy与Launch Enforcement

| 任务ID | 顺序 | Boundary | 实施动作 | 输入 | 输出 /完成判定 |
|---|---:|---|---|---|---|
| `IMPL-SBX-06-01` | 1 | 06A | 编写Command 3、policy event、applicability / decision / high-risk carrier | `EvaluatePolicyExecution`;PG-SBX-003 | body-free source map完整 |
| `IMPL-SBX-06-02` | 2 | 06A | 编写STA-010 /011 /012、fail-closed guards和ERR-005 | policy matrix | 非Applicable不可Accepted |
| `IMPL-SBX-06-03` | 3 | 06B | 编写typed requirement read、policy summary port / fake和Command 3 UoW | policy flow | 只读前序requirement;snapshot / decision / audit / relay / replay原子 |
| `IMPL-SBX-06-04` | 4 | 06B | 编写API映射和non-Allowed guard-result contract tests | `TC-SBX-CMD-005`;`TC-SBX-CMD-006` | blocked / fail-closed产生durable non-Allowed decision;backend调用不属于本boundary;`TC-SBX-CMD-008`留07A |

| Batch | 目标 | 输入 -> 输出 | 预计规模 | 批后验证 | Commit关系 |
|---|---|---|---:|---|---|
| `BATCH-SBX-06A-01` | policy contracts | formal summaries -> DTO / payload | 150~250 | roundtrip / no policy body | 归06A |
| `BATCH-SBX-06A-02` | fail-closed state | state matrix -> policy / high-risk truth / errors | 200~300 | missing / stale / conflict / terminal | 归06A |
| `BATCH-SBX-06B-01` | policy seam | typed requirement read + one-shot body-free snapshot port -> fake / repository | 150~250 | context mismatch / availability / stale outcome | 归06B |
| `BATCH-SBX-06B-02` | policy transaction | shared UoW -> snapshot / high-risk / decision / side effects / stored replay | 200~300 | duplicate / rollback / no current-config rebuild | 归06B |
| `BATCH-SBX-06B-03` | policy entry | service -> API / durable non-Allowed tests | 150~250 | `TC-SBX-CMD-005`;`TC-SBX-CMD-006`;no backend dependency | 归06B |

#### 7.6.7 PH-07 Run / Capture / Handoff

| 任务ID | 顺序 | Boundary | 实施动作 | 输入 | 输出 /完成判定 |
|---|---:|---|---|---|---|
| `IMPL-SBX-07-01` | 1 | 07A | 编写Command 4 / Run event / run truth、boundary -> handle -> persisted lease exact reads和Accepted policy guarded launch flow | `StartControlledExecutionRun`;PG-SBX-004 | mismatch / inactive / expired / non-Accepted均0 call,duplicate不relaunch,不得重算lease window |
| `IMPL-SBX-07-02` | 2 | 07B | 编写Command 5 / Capture event / capture truth和adapter mapping | `RecordCaptureResult`;PG-SBX-005 | partial / failed不伪Complete,无raw body |
| `IMPL-SBX-07-03` | 3 | 07C | 编写Command 6 / Handoff event / handoff truth和delivery flow | `OpenMaterialHandoff`;PG-SBX-006 | delivery失败只改handoff,不回滚capture |

| Batch | 目标 | 输入 -> 输出 | 预计规模 | 批后验证 | Commit关系 |
|---|---|---|---:|---|---|
| `BATCH-SBX-07A-01` | run contract / state | formal run schema -> DTO / truth / event | 200~300 | state / redaction / source map | 归07A |
| `BATCH-SBX-07A-02` | launch side effect | exact boundary / handle / lease / policy guard + backend port -> UoW / fake / service | 200~300 | mismatch / expired / denied call=0;failure / replay | 归07A |
| `BATCH-SBX-07A-03` | run entry tests | service result -> API / fulfillment mapping | 150~250 | CMD-007 /008;race / rollback | 归07A |
| `BATCH-SBX-07B-01` | capture contract / state | formal capture schema -> DTO / truth / event | 200~300 | status / material refs / no body | 归07B |
| `BATCH-SBX-07B-02` | capture side effect | capture port -> service / fake / UoW | 200~300 | complete / partial / failed / duplicate | 归07B |
| `BATCH-SBX-07B-03` | capture entry tests | service -> API / producer tests | 100~200 | CMD-009 /010;safe mapping | 归07B |
| `BATCH-SBX-07C-01` | handoff contract / state | target / material refs -> DTO / truth / event | 200~300 | target / terminal / no truth promotion | 归07C |
| `BATCH-SBX-07C-02` | delivery no-rollback | handoff port -> outcome / service / UoW | 200~300 | retryable / failed source unchanged | 归07C |
| `BATCH-SBX-07C-03` | handoff entry tests | service -> API / producer tests | 100~200 | CMD-011 /012;version / replay | 归07C |

#### 7.6.8 PH-08 Failure / Control / Cleanup / Redline

| 任务ID | 顺序 | Boundary | 实施动作 | 输入 | 输出 /完成判定 |
|---|---:|---|---|---|---|
| `IMPL-SBX-08-01` | 1 | 08A | 编写Commands 7~8、Control / Failure events和owner states | PG-SBX-007 /008 | conflict / unknown / terminal规则闭合 |
| `IMPL-SBX-08-02` | 2 | 08A | 编写control / classification UoW、worker mapping和race / replay tests | CMD-013~016 | unknown不成功,不做runtime recovery |
| `IMPL-SBX-08-03` | 3 | 08B | 编写Commands 9~10、Cleanup / Redline events和guard / containment states | PG-SBX-009 /010 | non-Allowed不可release |
| `IMPL-SBX-08-04` | 4 | 08B | 编写investigation / release ports、service和no-early-delete tests | CMD-017~020 | guard-first / containment / call budget闭合 |

| Batch | 目标 | 输入 -> 输出 | 预计规模 | 批后验证 | Commit关系 |
|---|---|---|---:|---|---|
| `BATCH-SBX-08A-01` | control contract / state | Command 7 -> DTO / truth / event / guard | 200~300 | accepted / conflict / duplicate | 归08A |
| `BATCH-SBX-08A-02` | failure contract / state | Command 8 -> classification / event / errors | 200~300 | pending / classified / unknown / terminal | 归08A |
| `BATCH-SBX-08A-03` | safety transaction | two formal flows -> UoW / worker / tests | 200~300 | race / rollback / no runtime recover | 归08A |
| `BATCH-SBX-08B-01` | cleanup guard contract | Command 9 -> DTO / guard / lease linkage | 200~300 | allowed / blocked / pending branches | 归08B |
| `BATCH-SBX-08B-02` | redline containment | Command 10 -> DTO / containment / investigation | 200~300 | non-advisory / no raw finding | 归08B |
| `BATCH-SBX-08B-03` | destructive-side-effect guard | ports -> call budget / UoW / entry / tests | 200~300 | non-Allowed=0;no early delete / race | 归08B |

#### 7.6.9 PH-09 Query / Projection / Audit Read

| 任务ID | 顺序 | Boundary | 实施动作 | 输入 | 输出 /完成判定 |
|---|---:|---|---|---|---|
| `IMPL-SBX-09-01` | 1 | 09A | 编写13 Query request / response / view / page / marker schema | PG-SBX-011~023 | visible / empty / restricted / degraded等surface齐全 |
| `IMPL-SBX-09-02` | 2 | 09A | 编写read repository / visibility / typed lookup traits和read states | `03`§8.3 / §9 | 无string-ref lookup或unbounded scan |
| `IMPL-SBX-09-03` | 3 | 09B | 编写13 Query service、degraded mapper和read fake | QRY-001~026 | 每个branch有正式source且write set=0 |
| `IMPL-SBX-09-04` | 4 | 09B | 编写API query handler / disposition和no-write / page / race tests | SUITE-004 /014 | 13 /13 entry可验证,无repair |

| Batch | 目标 | 输入 -> 输出 | 预计规模 | 批后验证 | Commit关系 |
|---|---|---|---:|---|---|
| `BATCH-SBX-09A-01` | core status views | Query 1~8 -> DTO / exact views | 200~300 | schema / visibility / degraded surfaces | 归09A |
| `BATCH-SBX-09A-02` | projection / derived views | Query 9~13 -> DTO / page / cursor / views | 200~300 | empty / page / marker / body-free | 归09A |
| `BATCH-SBX-09A-03` | read ports / identity | lookup matrix -> repository / resolver traits | 200~300 | typed keys / missing / no-scan contract | 归09A |
| `BATCH-SBX-09B-01` | status query services | Query 1~8 -> service / fake / mapper | 200~300 | QRY-001~016;write audit=0 | 归09B |
| `BATCH-SBX-09B-02` | projection / audit services | Query 9~13 -> service / fake / mapper | 200~300 | QRY-017~026;RACE-019 | 归09B |
| `BATCH-SBX-09B-03` | API read entry | service result -> handler disposition / tests | 200~300 | 13 protocol inventory / no repair | 归09B |

#### 7.6.10 PH-10 Consumer / Event Relay

| 任务ID | 顺序 | Boundary | 实施动作 | 输入 | 输出 /完成判定 |
|---|---:|---|---|---|---|
| `IMPL-SBX-10-01` | 1 | 10A | 编写9 Consumer envelope / payload / receipt / error carrier | PG-SBX-024~032 | source / schema / digest / forbidden-body闭合 |
| `IMPL-SBX-10-02` | 2 | 10A | 编写dedup UoW、marker updates、stored receipt和worker disposition | CNS-001~022 | accepted / duplicate / delayed / quarantine闭合 |
| `IMPL-SBX-10-03` | 3 | 10B | 编写13 Event payload builders、source snapshot和relay repository | PG-SBX-033~045 | payload immutable且来自source tx |
| `IMPL-SBX-10-04` | 4 | 10B | 编写publisher outcome、relay loop、topic map和no-rollback tests | EVT-001~015 | retry / dead-letter不回滚source |

| Batch | 目标 | 输入 -> 输出 | 预计规模 | 批后验证 | Commit关系 |
|---|---|---|---:|---|---|
| `BATCH-SBX-10A-01` | reference consumers | Consumers 1~3 -> carrier / service / markers | 200~300 | CNS common +005~010 | 归10A |
| `BATCH-SBX-10A-02` | lifecycle / handoff consumers | Consumers 4~6 -> carrier / service / markers | 200~300 | CNS-011~016;target / identity | 归10A |
| `BATCH-SBX-10A-03` | control / investigation / relay feedback | Consumers 7~9 -> formal path / receipt | 200~300 | CNS-017~022;no core success | 归10A |
| `BATCH-SBX-10A-04` | high-risk consumer UoW / entry | all 9 -> dedup / stored receipt / worker | 200~300 | duplicate / rollback / quarantine | 归10A |
| `BATCH-SBX-10B-01` | core event payloads | Events 1~6 -> stored payload builders | 200~300 | EVT-001~006 + common | 归10B |
| `BATCH-SBX-10B-02` | safety / read event payloads | Events 7~13 -> stored payload builders | 200~300 | EVT-007~013 + common | 归10B |
| `BATCH-SBX-10B-03` | relay append / repository | source side-effect inventory -> relay records | 200~300 | immutable snapshot / source cursor | 归10B |
| `BATCH-SBX-10B-04` | publisher high risk | outcome / route -> worker / retry / dead-letter | 200~300 | EVT-014/015;RACE-014/015;no rollback | 归10B |

#### 7.6.11 PH-11 Operations Jobs

| 任务ID | 顺序 | Boundary | 实施动作 | 输入 | 输出 /完成判定 |
|---|---:|---|---|---|---|
| `IMPL-SBX-11-01` | 1 | 11A | 编写10 Job input、scope / selector、report / item / exit carrier | PG-SBX-046~055 | full public job surface和source map齐全 |
| `IMPL-SBX-11-02` | 2 | 11A | 编写job idempotency、selection paging、per-item UoW、stored report和entry kernel | shared job flow | duplicate不重复owner calls,partial可见 |
| `IMPL-SBX-11-03` | 3 | 11B | 编写publish / reference / capability / handoff四jobs及binary | Jobs 1~4 | bounded、no rollback、no core repair |
| `IMPL-SBX-11-04` | 4 | 11C | 编写reaper / cleanup / redline三安全jobs及binary | Jobs 5~7 | guard-first、non-Allowed无release |
| `IMPL-SBX-11-05` | 5 | 11C | 编写projection / derived / reconciliation三read-maintenance jobs及binary | Jobs 8~10 | committed source、immutable report、no repair |

| Batch | 目标 | 输入 -> 输出 | 预计规模 | 批后验证 | Commit关系 |
|---|---|---|---:|---|---|
| `BATCH-SBX-11A-01` | Job schemas 1~5 | formal inventory -> inputs / reports / items | 200~300 | roundtrip / status / required refs | 归11A |
| `BATCH-SBX-11A-02` | Job schemas 6~10 | formal inventory -> inputs / reports / items | 200~300 | roundtrip / scope / partial | 归11A |
| `BATCH-SBX-11A-03` | job orchestration kernel | shared flow -> selection / per-item UoW / replay | 200~300 | empty / duplicate / partial / conflict | 归11A |
| `BATCH-SBX-11A-04` | jobs entry kernel | application report -> runtime / exit disposition | 150~250 | entry detail / no repository bypass | 归11A |
| `BATCH-SBX-11B-01` | relay publish job | stored relay -> publish / report | 200~300 | JOB-001;terminal / retry / duplicate | 归11B |
| `BATCH-SBX-11B-02` | reference / capability refresh | typed scope -> marker / report | 200~300 | JOB-002/003;cursor / no boundary create | 归11B |
| `BATCH-SBX-11B-03` | handoff retry | retryable selection -> outcome / report | 200~300 | JOB-004;no capture rollback | 归11B |
| `BATCH-SBX-11B-04` | four job binaries | service set -> input / output wiring | 150~250 | entry job tests / bounded page | 归11B |
| `BATCH-SBX-11C-01` | reaper safety | orphan / guard -> release outcome / report | 200~300 | JOB-005;non-Allowed=0 | 归11C |
| `BATCH-SBX-11C-02` | cleanup / redline maintenance | markers -> eligibility / handoff report | 200~300 | JOB-006/007;no containment weaken | 归11C |
| `BATCH-SBX-11C-03` | projection rebuild | committed truth plan -> projection / report | 200~300 | JOB-008;full body-free input / version | 归11C |
| `BATCH-SBX-11C-04` | derived / reconciliation | source refs -> derived / immutable report | 200~300 | JOB-009/010;atomic latest / no repair | 归11C |
| `BATCH-SBX-11C-05` | six job binaries / ops suite | services -> entry / report artifacts | 200~300 | SUITE-006 /012 targeted | 归11C |

#### 7.6.12 PH-12 P0-C一致性与协议全量加固

| 任务ID | 顺序 | Boundary | 实施动作 | 输入 | 输出 /完成判定 |
|---|---:|---|---|---|---|
| `IMPL-SBX-12-01` | 1 | 12A | 建立55协议、30个owner-level state machines /31个Step 10 canonical status enum entries /39个Step 6 shared status declarations、38错误、254 TC expected manifests | formal inventories | 缺失 /重复 /错族 /同义项机械失败 |
| `IMPL-SBX-12-02` | 2 | 12A | 补齐237条P0-C主case和SUITE-001~006 /010 /011 harness | `05`§6 / §9 | P0-C主归属唯一,无candidate补偿 |
| `IMPL-SBX-12-03` | 3 | 12B | 补齐14 TXN、19 RACE、repository / adapter parity和structural boundedness | SUITE-007~009 /014 | deterministic / two-order / no-sleep |
| `IMPL-SBX-12-04` | 4 | 12B | 补齐SUITE-001~012 /014 /016 orchestration、checks和MAIN / OPS source writer | `05`§9 / §13 | roles / identity / raw pairing诚实 |

| Batch | 目标 | 输入 -> 输出 | 预计规模 | 批后验证 | Commit关系 |
|---|---|---|---:|---|---|
| `BATCH-SBX-12A-01` | protocol / state manifests | formal tables -> 55 /30 expected index | 150~250 | exact counts / no duplicate | 归12A |
| `BATCH-SBX-12A-02` | error / TC manifests | error / case owners -> 38 /254 index | 150~250 | 38 /254 /237 split | 归12A |
| `BATCH-SBX-12A-03` | contract / domain completion | manifests -> missing owner tests / fixes | 200~300 | SUITE-001/002/010 | 归12A |
| `BATCH-SBX-12A-04` | service / entry completion | protocol manifest -> missing family tests / fixes | 200~300 | SUITE-004~006/011 | 归12A |
| `BATCH-SBX-12B-01` | TXN 1~7 | transaction table -> deterministic cases | 200~300 | exact rollback / replay assertions | 归12B |
| `BATCH-SBX-12B-02` | TXN 8~14 | transaction table -> deterministic cases | 200~300 | no-write / no-repair / no-rollback | 归12B |
| `BATCH-SBX-12B-03` | RACE 1~10 | race table -> controlled schedules | 200~300 | both orderings / winner / loser | 归12B |
| `BATCH-SBX-12B-04` | RACE 11~19 | race table -> controlled schedules | 200~300 | no sleeps / stable disposition | 归12B |
| `BATCH-SBX-12B-05` | parity / boundedness | store / adapter contract -> SUITE-008/014 | 200~300 | page / version / no-scan / call budget | 归12B |
| `BATCH-SBX-12B-06` | checks / P0-C writers | manifests + raw schema -> checks / source writers | 200~300 | MAIN roles / OPS / pairing / blocked | 归12B |

#### 7.6.13 PH-13 P0-Q Candidate Qualification

| 任务ID | 顺序 | Boundary | 实施动作 | 输入 | 输出 /完成判定 |
|---|---:|---|---|---|---|
| `IMPL-SBX-13-01` | 1 | 13A | 固定candidate ADR / revision和immutable qualification manifest schema / packet | PH-QP;PROFILE-05 | identity六维连续且不可从path猜测 |
| `IMPL-SBX-13-02` | 2 | 13A | 实现single candidate adapter和0-launch preflight / anti-substitution check | formal backend port | missing / mismatch为Blocked且0 launch |
| `IMPL-SBX-13-03` | 3 | 13B | 编写CONF-001~006四维 / capability / lifecycle probe harness | SUITE-013 | 同identity packet且无weak fallback |
| `IMPL-SBX-13-04` | 4 | 13B | 编写CONF-007~013 capture / failure / reaper / redline / material / cleanup harness | SUITE-013 | teardown / containment disposition完整 |
| `IMPL-SBX-13-05` | 5 | 13B | 编写P0Q gate writer和identity / redaction / cleanup / blocked checks | `05`§9 / §13 | raw / report可生成但无静态结论 |

| Batch | 目标 | 输入 -> 输出 | 预计规模 | 批后验证 | Commit关系 |
|---|---|---|---:|---|---|
| `BATCH-SBX-13A-01` | qualification identity | ADR / ENV / profile / generation -> immutable manifest | 200~300 | missing / mismatch / digest / no credential | 归13A |
| `BATCH-SBX-13A-02` | candidate binding | formal port -> concrete adapter mapping | 200~300 | capability / launch / capture / release outcome | 归13A |
| `BATCH-SBX-13A-03` | zero-launch preflight | packet + adapter -> activation guard / check | 150~250 | substitution / missing => call budget 0 | 归13A |
| `BATCH-SBX-13B-01` | CONF-001~003 | resource / fs / network probes | 200~300 | identity / boundary assertions | 归13B |
| `BATCH-SBX-13B-02` | CONF-004~006 | process / lifecycle / launch probes | 200~300 | no host fallback / honest outcome | 归13B |
| `BATCH-SBX-13B-03` | CONF-007~010 | capture / failure / terminate / reaper probes | 200~300 | body-free / guard / disposition | 归13B |
| `BATCH-SBX-13B-04` | CONF-011~013 | redline / material / anti-leak probes | 200~300 | containment / provider / scanner | 归13B |
| `BATCH-SBX-13B-05` | P0Q writer / checks | all probe raw -> gate / report source | 200~300 | identity / redaction / cleanup / blocked | 归13B |

#### 7.6.14 PH-14 Gate / Report / Release汇总

| 任务ID | 顺序 | Boundary | 实施动作 | 输入 | 输出 /完成判定 |
|---|---:|---|---|---|---|
| `IMPL-SBX-14-01` | 1 | 14A | 收口5 gate scripts、7 gate selector / status / source role和9 checks | `05`§9 | failure / missing / Blocked不归一Pass |
| `IMPL-SBX-14-02` | 2 | 14A | 实现四source固定顺序RELEASE、P1 conditional和scope-reopen入口 | GATE-SBX-* | wrong role / order / identity / digest阻断 |
| `IMPL-SBX-14-03` | 3 | 14B | 收口九schema、21 slot catalog、allocation / pairing guards | `05`§13;`06`§10 | 无pair无EV,source raw不可修改 |
| `IMPL-SBX-14-04` | 4 | 14B | 实现run / suite / evidence / gate report renderer | fixed raw | missing / invalid raw nonzero,状态保真 |
| `IMPL-SBX-14-05` | 5 | 14C | 实现handoff / veto / risk / open-issues四draft和review入口 | `06`§11~§14 | 无verdict / risk accept / signature |
| `IMPL-SBX-14-06` | 6 | 14C | 完成conditional case契约、release handoff index和scope audit | TEST-001~003 | 254主归属 /16 suite /7 gate完整且诚实 |

| Batch | 目标 | 输入 -> 输出 | 预计规模 | 批后验证 | Commit关系 |
|---|---|---|---:|---|---|
| `BATCH-SBX-14A-01` | PR / MAIN gate | suite / role contract -> selectors / writers | 200~300 | missing role / wrong ENV / nonzero | 归14A |
| `BATCH-SBX-14A-02` | OPS / P0Q gate | source contracts -> operations / qualification gates | 200~300 | Blocked propagation / cleanup | 归14A |
| `BATCH-SBX-14A-03` | RELEASE / P1 / scope | four sources -> fixed-order aggregation / conditional | 200~300 | wrong order / identity / digest / no latest | 归14A |
| `BATCH-SBX-14A-04` | nine checks closure | check contracts -> stable safe findings | 200~300 | all 9 entry / deny / nonzero | 归14A |
| `BATCH-SBX-14B-01` | schema family 1~5 | formal schema -> writer / reader / fixtures | 200~300 | required / enum / digest / redaction | 归14B |
| `BATCH-SBX-14B-02` | schema family 6~9 | formal schema -> writer / reader / fixtures | 200~300 | path / status / digest / failure | 归14B |
| `BATCH-SBX-14B-03` | slot / allocation / pairing | 21 catalog -> expected / missing / EV guard | 200~300 | 21 /21;no pair no alias | 归14B |
| `BATCH-SBX-14B-04` | run / suite renderer | fixed raw -> human reports | 200~300 | roundtrip / source status preserved | 归14B |
| `BATCH-SBX-14B-05` | evidence / gate renderer | paired raw -> evidence / gate reports | 200~300 | digest backlink / missing nonzero | 归14B |
| `BATCH-SBX-14C-01` | handoff / veto drafts | release packet -> two drafts | 200~300 | no verdict / no signature / VETO fidelity | 归14C |
| `BATCH-SBX-14C-02` | risk / open-issues drafts | defect / risk inputs -> two drafts | 200~300 | no risk acceptance / unresolved preserved | 归14C |
| `BATCH-SBX-14C-03` | review / release index | four drafts -> review entry / handoff index | 150~250 | path / identity / no review fabrication | 归14C |
| `BATCH-SBX-14C-04` | conditional / scope audit | 254 /16 /7 manifests -> final planned coverage checks | 150~250 | P1 no P0 compensation;scope reopen | 归14C |

### 7.7 Commit boundary子功能分组

| Boundary | 子功能分组 | 必须同提交的原因 | Batches | 验证闭口 | 明确不包含 |
|---|---|---|---|---|---|
| `CB-SBX-01A` | workspace manifests + crate / binary skeleton + repo guard | 共同形成唯一可编译、可恢复、可审查的bootstrap graph;任一缺失都不能独立交付 | 01A-01~03 | metadata / workspace check / git identity | 业务行为 |
| `CB-SBX-02A` | refs / metadata + status / receipt / report / error carrier | 下游三通道共用同一metadata和safe disposition,拆开会产生临时私有carrier | 02A-01~02 | carrier contract suite | 业务协议 / UoW |
| `CB-SBX-02B` | UoW / repository + idempotency / stored result + semantic fake | fake必须与同一transaction / replay contract一起review,否则不能证明parity | 02B-01~03 | rollback / version / replay tests | concrete flow |
| `CB-SBX-02C` | machine identity / path + canonical digest | writer与verifier必须共享同一schema identity、canonical bytes和self-digest规则 | 02C-01~02 | canonical roundtrip fixtures | scripts / reports |
| `CB-SBX-02D` | minimal gate / report shell + safe checks | 共同建立统一参数、退出码、safe failure和目录协议,不承载最终编排 | 02D-01~02 | syntax / lint / failure fixtures | full gates / EV |
| `CB-SBX-03A` | raw selector + typed schema + validator | 只有三者同提交才能保证invalid config在publication前被完整拒绝 | 03A-01~04 | CFG / ARCH negative corpus | runtime publication |
| `CB-SBX-03B` | material registry + profile eligibility + generation + runtime builder | complete generation必须携带适用material和adapter availability,不能发布半组合 | 03B-01~04 | material / profile / atomic publication | concrete candidate |
| `CB-SBX-04A` | intake protocol + context / identity / reference truth | Command 1构造目标与状态必须在同一contract-domain增量闭口 | 04A-01~02 | CMD schema / STA / ERR | transaction / entry |
| `CB-SBX-04B` | resolver / repository + intake UoW + API / worker mapping | 共同构成首个accepted纵切,拆开任一部分都不能验证原子受理 | 04B-01~03 | CMD / TXN / RACE / rollback | Command 2+ |
| `CB-SBX-05A` | active identity + four-dimension isolation / workspace requirement carrier + coherent boundary / handle / lease truth | accepted context / active identity、显式四维隔离要求 + workspace requirement、profile / template / generation、decision和owner state必须同步,防止policy反向依赖或partial / weak形态进入代码 | 05A-01~02 | CMD schema / STA / no-policy-input / weak-fallback | backend side effect |
| `CB-SBX-05B` | capability / I065-bound backend seam + grouped UoW / exact reads + API | bounded outcome、requirement / decision / boundary / optional handle / lease原子可见和后序typed reads共同构成all-or-nothing boundary事实 | 05B-01~03 | unsupported / grouped rollback / exact read / call budget | candidate / policy decision / run launch |
| `CB-SBX-06A` | policy carrier + applicability / decision / high-risk truth | fail-closed语义由DTO source map和owner states共同定义 | 06A-01~02 | CMD schema / STA / ERR | summary port / launch |
| `CB-SBX-06B` | typed requirement read + policy snapshot / decision UoW + entry | 只有同一纵切才能证明policy仅消费前序requirement并持久化durable Accepted / non-Allowed truth;backend调用严格后置 | 06B-01~03 | CMD / duplicate / context mismatch / no backend dependency | run / local allowlist |
| `CB-SBX-07A` | run carrier / truth + boundary / handle / persisted lease / policy guard + entry | run事实只在四类前序truth精确匹配且backend outcome与UoW同组时成立 | 07A-01~03 | mismatch / expired / denied call=0;state / replay / race | lease重算 / capture / agent loop |
| `CB-SBX-07B` | capture carrier / truth + capture side effect + entry | capture status与material refs必须由同一adapter outcome诚实形成 | 07B-01~03 | complete / partial / failed / no-body | handoff / Artifact truth |
| `CB-SBX-07C` | handoff carrier / truth + delivery + entry | delivery outcome、owner state与no-capture-rollback必须同一审查单元 | 07C-01~03 | retry / failed / source unchanged | retry Job / downstream truth |
| `CB-SBX-08A` | control + failure classification + safety transaction | formal control可影响failure source marker,二者共同保证single truth和unknown不成功 | 08A-01~03 | conflict / unknown / race / replay | cleanup / runtime recovery |
| `CB-SBX-08B` | cleanup guard + redline containment + guarded destructive seam | release资格、containment和call budget必须同提交防止guard与副作用分离 | 08B-01~03 | non-Allowed=0 / no early delete | public Job / force cleanup |
| `CB-SBX-09A` | 13 Query carriers + read identities / ports | 所有public read surface共享visibility、page、marker和typed lookup规则 | 09A-01~03 | schema / empty / lookup / no-scan | service / write |
| `CB-SBX-09B` | status queries + projection / audit queries + API mapping | 13 entry共同证明read-only facade和一致disposition,不留某族私自写入 | 09B-01~03 | QRY-001~026 / write audit=0 | maintenance / repair |
| `CB-SBX-10A` | three Consumer groups + shared dedup / receipt / worker UoW | 9 Consumer必须复用同一trusted-source、dedup、receipt和quarantine协议 | 10A-01~04 | CNS-001~022 / rollback | outbound publish / core success |
| `CB-SBX-10B` | two Event payload groups + relay append + publisher | 13 payload、stored snapshot和publisher status共同闭合no-rollback outbox链 | 10B-01~04 | EVT-001~015 / race / topic map | public Job / real bus |
| `CB-SBX-11A` | 10 Job schemas + orchestration / report replay + entry kernel | 所有public Jobs必须先共享同一idempotency、partial report和entry detail面 | 11A-01~04 | JOB common / duplicate report | concrete maintenance |
| `CB-SBX-11B` | relay publish + ref / capability refresh + handoff retry + binaries | 四个collaboration jobs都只推进formal marker / relay / handoff owner并共享page / report | 11B-01~04 | JOB-001~004 / no rollback | cleanup / projection |
| `CB-SBX-11C` | safety jobs + projection / derived / reconciliation jobs + binaries | 都属于no-repair operations汇合,但按五个高风险batch独立验证后共同完成PH-11 | 11C-01~05 | JOB-005~010 / SUITE-012 | core truth repair / release |
| `CB-SBX-12A` | inventories + P0-C contract / domain / service completion | counts与缺口修复必须在同一baseline闭合,避免manifest与实现漂移 | 12A-01~04 | 55 /30 owner machines /31 enum entries /39 shared declarations /38 /237 exact | 新语义 / candidate |
| `CB-SBX-12B` | TXN + RACE + parity + checks / source writers | 共同证明P0-C一致性和source真实性;按六批独立执行后统一冻结 | 12B-01~06 | 14 /19 / suites / checks | candidate / release aggregation |
| `CB-SBX-13A` | immutable identity + candidate binding + zero-launch preflight | adapter在probe前必须被同一不可替换packet授权,否则不能安全提交 | 13A-01~03 | identity / substitution / call budget | CONF result / credentials |
| `CB-SBX-13B` | 13 CONF groups + P0Q writer / checks | probe、teardown、redaction和result writer必须共享同一qualification identity | 13B-01~05 | CONF-001~013 / cleanup disposition | P1 / static qualification |
| `CB-SBX-14A` | PR / MAIN + OPS / P0Q + RELEASE / P1 / scope + nine checks | 7 gate的status传播和四source顺序必须由同一selector / check语义审查 | 14A-01~04 | failure fixtures / 7 /9 inventory | report / verdict |
| `CB-SBX-14B` | nine schemas + slot / pairing + run / evidence renderers | renderer只有消费同一canonical raw和allocation guard才不会静态补洞 | 14B-01~05 | schema / 21 slot / pairing / roundtrip | acceptance decision |
| `CB-SBX-14C` | four acceptance drafts + review / handoff index + conditional scope audit | 全部是同一release packet的无裁决handoff投影,共同保证不预填结论 | 14C-01~04 | no verdict / no signature / 254 /16 /7 | 新功能 /真实review |

### 7.8 逐Boundary设计闭环与经验复核

`结论`只裁决当前设计是否足以定义boundary,不是Activation / Design Gate的runtime `pass`。`passed_design`仍要求Step 13固定真实baseline并由实现者二次校验;`blocked_pre_implementation`表示本Step可完成,但对应boundary不得开工。

#### 7.8.1 PH-01~PH-08

| Boundary | 设计面 / Closure profiles | 适用经验项 | 正式证据位置 | 具体不适用理由 | 结论 /处理 |
|---|---|---|---|---|---|
| `CB-SBX-01A` | build / dependency;BASE+BOOT | path baseline;typed-ref owner scope for future crates;phase boundary;用户改动保护 | `03`§3~§4;Step 3 §7.8~§7.10 | DTO / state / UoW不适用:本boundary禁止业务类型和行为 | `blocked_pre_implementation`:HDO、design baseline、target version / core revision、目标仓待固定 |
| `CB-SBX-02A` | contract / refs / metadata;BASE+CONTRACT | support carrier闭口;typed-ref kind owner;metadata authority;public disposition;body-free | `03`§6~§7 / §11;`05`§3 / §6;`06`§7.5 | UoW / projection rebuild不适用:只定义shared carrier | `passed_design`;开工仍等待01A handoff |
| `CB-SBX-02B` | persistence / idempotency;BASE+TXN | generic / typed ref分离;accepted cursor;idempotency context;stored result;rollback / version fake parity;domain-specific finder后置 | `03`§10 / §12 / §15.4;`05`TXN / RACE | public protocol / artifact / concrete boundary finder不适用:本boundary只实现共享kernel | `passed_design`;不得由fake添加私有index /状态 / latest scan |
| `CB-SBX-02C` | evidence schema;BASE+EVIDENCE | machine JSON schema;artifact materialization;path baseline;canonical digest;writer / reader owner | `05`§13.1~§13.5;`06`§10.1~§10.4 | command / query / job不适用:只处理synthetic schema fixture | `blocked_pre_implementation`:RFC 8785实现库 /工具待设计owner固定 |
| `CB-SBX-02D` | automation shell;BASE+EVIDENCE | path baseline;machine input failure;safe finding;blocked propagation;no-static boundary | `05`§9.3~§9.4 / §13.5;`06`§10.6~§10.8 | DTO / state / persistence不适用:脚本不拥有业务truth | `blocked_pre_implementation`:Shell规则和lint /等价检查待固定 |
| `CB-SBX-03A` | config schema / validation;BASE+CONFIG | validation truth;single raw owner;exact item owner;unsupported branch;safe issue / no default | `04`§3~§5 / §7 / §9 / §11;`05`CFG / ARCH | idempotency / outbox不适用:config load不写业务transaction | `passed_design`;新增key / default须wait_design |
| `CB-SBX-03B` | material / generation / assembly;BASE+CONFIG+MATERIAL | config binding;material lifecycle;complete generation;adapter availability;atomic publication;phase boundary | `03`§13;`04`§6 / §8~§12 | public command / Query不适用:builder只装配已定义service target | `passed_design`;candidate仍只拒绝面,不得实现产品 |
| `CB-SBX-04A` | Command / state / event;BASE+CONTRACT+STATE | DTO construction;factory signature;initial state;accepted subject identity;event payload source;forbidden body | `03`§6~§9 / §11;`05`CMD / STA / ERR;`06`PG-001 | adapter outcome / UoW不适用:本boundary止于contract-domain | `passed_design`;04B不得反向改schema |
| `CB-SBX-04B` | command / UoW / entry;BASE+TXN+CONTRACT | resolver truth;entry context factory;side-effect inventory;cursor;stale identity;stored replay;API disposition | `03`§8.2 / §10 / §12 / §14;`05`CMD-001/002;`06`AC-006~008 | Query empty / job surface不适用:只处理Command 1 | `passed_design`;unresolved / duplicate / rollback均有formal surface |
| `CB-SBX-05A` | active identity + four-dimension isolation / workspace requirement state;BASE+CONTRACT+STATE | DTO construction;accepted context / active identity;explicit four-dimension isolation + workspace requirement;profile / template / generation;handle / lease ref identity;state / error closure;no policy input | `03`§6 / §7.3 / §9 / §11;`05`CMD / STA;`06`PG-002 | transaction / candidate不适用:仅定义P0-C contract-domain | `passed_design`;partial / weak / policy-dependent variant不得私增 |
| `CB-SBX-05B` | backend / lease / transaction / entry;BASE+TXN+CONFIG+STATE | validation truth;I065-bound bounded outcome;grouped save;partial failed handle;exact requirement / handle / lease reads;version / replay;no weak fallback | `03`§8 / §10~§14;`04`I039~I041 / I065;`05`CMD-003/004 | real qualification与policy decision不适用:仅P01~04 formal fake,Boundary先于Policy | `passed_design`;P0-Q保持Blocked / NotEvaluated |
| `CB-SBX-06A` | policy contract / state;BASE+CONTRACT+STATE | summary typed read;applicability / high-risk markers;factory / state;public target;body-free policy refs | `03`§6 / §7.3 / §9 / §11;`05`CMD / STA;`06`PG-003 | backend launch / UoW不适用:只定义policy truth | `passed_design`;不得保存DSL /正文 |
| `CB-SBX-06B` | policy port / UoW / entry;BASE+TXN+CONFIG | exact requirement read;context ownership;one-shot body-free snapshot;idempotency;side effects;stale snapshot;durable non-Allowed | `03`§8 / §10 / §12~§13;`06`AC-012~015 | Query / job / backend launch不适用:只执行formal Command 3并输出launch guard truth | `passed_design`;不得从current config或latest boundary重建requirement |
| `CB-SBX-07A` | run / backend side effect;BASE+CONTRACT+STATE+TXN | public intent;exact boundary / handle / lease / policy reads;active / expiry guard;adapter outcome;run initial / terminal state;duplicate no-relaunch;event payload | `03`§6~§12;`04`I065;`05`CMD-007/008;`06`PG-004 | capture / lease selection / agent loop不适用:run只校验前序lease且不解释tool semantics | `passed_design`;四类guard任一失败backend call=0 |
| `CB-SBX-07B` | capture / material refs;BASE+CONTRACT+STATE+TXN+MATERIAL | capture outcome;material typed refs;state honesty;event source;raw body redaction;duplicate no-recapture | `03`§6~§12;`04`§8;`05`CMD-009/010;`06`PG-005 | handoff delivery不适用:capture owner独立结束 | `passed_design`;Partial / Failed不得升格 |
| `CB-SBX-07C` | handoff / external delivery;BASE+CONTRACT+STATE+TXN | target identity;adapter outcome;marker trace subject;no-rollback;stored result;terminal guard | `03`§6~§12;`05`CMD-011/012;`06`PG-006 | retry Job / feedback Consumer不适用:用formal outcome fake验证owner truth | `passed_design`;不拥有下游truth |
| `CB-SBX-08A` | control / failure;BASE+CONTRACT+STATE+TXN+SAFETY | public command intent;source marker;single truth;unknown mapping;terminal state;race / replay | `03`§6~§12;`05`CMD-013~016;`06`PG-007/008 | cleanup / release不适用:不触发destructive adapter | `passed_design`;不得引入runtime recovery orchestration |
| `CB-SBX-08B` | cleanup / redline / destructive guard;BASE+CONTRACT+STATE+TXN+SAFETY | guard truth;lease / handle version;investigation marker;public target;release outcome;material retention;non-advisory | `03`§6~§12;`04`§11;`05`CMD-017~020;`06`VETO | public Job不适用:本boundary用direct service / fake证明primitive | `passed_design`;non-Allowed release=0 |

#### 7.8.2 PH-09~PH-14

| Boundary | 设计面 / Closure profiles | 适用经验项 | 正式证据位置 | 具体不适用理由 | 结论 /处理 |
|---|---|---|---|---|---|
| `CB-SBX-09A` | query contract / read ports;BASE+CONTRACT+QUERY | Query response;visibility resolution;degraded mapper;empty seed;typed lookup;read-model identity;page cursor | `03`§7.4 / §8.3 / §9~§10;`05`QRY;`06`PG-011~023 | UoW / outbox不适用:read contract禁止write surface | `passed_design`;13 /13 exact view / marker source可定位 |
| `CB-SBX-09B` | query service / API;BASE+QUERY | handler disposition;projection lookup;sidecar read;visibility / degraded sources;no-write;RACE-019 | `03`§8.3 / §10~§12 / §15;`05`SUITE-004/014 | idempotency / audit append不适用:Query明确不reserve /不写 | `passed_design`;任何repair触发scope failure |
| `CB-SBX-10A` | consumer / receipt / marker;BASE+CONTRACT+TXN+CONSUMER | envelope source;dedup context;typed receipt save/get;reference cursor / trace subject;entry disposition;body-free | `03`§7.5 / §8.4 / §10 / §12;`05`CNS;`06`PG-024~032 | outbound payload不适用:本boundary不publish | `passed_design`;consumer不得创建core success |
| `CB-SBX-10B` | event / relay / publisher;BASE+CONTRACT+TXN+RELAY | canonical payload;accepted side effects;subject / cursor;relay version;adapter outcome;topic binding;no-rollback | `03`§7.6 / §8.4 / §10~§12;`05`EVT;`06`PG-033~045 | public Job不适用:publisher为worker loop,Job后续只复用 | `passed_design`;payload不得从current truth重建 |
| `CB-SBX-11A` | public job surface;BASE+CONTRACT+TXN+JOB | job DTO / selector / source map;scope expansion;report details;stored replay;entry context;partial status | `03`§7.6~§8.4 / §10 / §12;`05`JOB;`06`PG-046~055 | concrete adapter side effect不适用:只建立shared kernel | `passed_design`;job_run_ref不得作idempotency key |
| `CB-SBX-11B` | collaboration jobs;BASE+TXN+JOB+RELAY | maintenance typed output;bounded selection;reference cursor;publisher / handoff outcome;report refs;no rollback | `03`§8.4 / §10~§12;`05`JOB-001~004 | projection rebuild / release不适用:四jobs只推进marker / relay / handoff | `passed_design`;partial failure不可隐藏 |
| `CB-SBX-11C` | safety / read maintenance jobs;BASE+TXN+JOB+SAFETY+QUERY | guard-first;job policy summary;projection complete input;rebuild source;scope expansion;atomic report index;no repair | `03`§8.4 / §9~§12;`05`JOB-005~010;`06`PG-050~055 | command success mutation不适用:jobs只写正式marker / derived / report | `passed_design`;缺plan / source即wait_design |
| `CB-SBX-12A` | protocol / state / error / TC inventory;BASE+CONTRACT+STATE | exact owner counts;support carrier;reserved variants;typed producer;phase boundary;test owner uniqueness | `03`§6~§9 / §11;`05`§3 / §6 / §9;`06`§7~§8 | adapter / artifact runtime不适用:本boundary只修既有contract / case缺口 | `passed_design`;55 /30 owner machines /31 enum entries /39 shared declarations /38 /237无orphan为commit前门禁 |
| `CB-SBX-12B` | consistency / parity / P0-C evidence;BASE+TXN+EVIDENCE+QUERY+JOB+RELAY | transaction / race;fake parity;no-write / no-repair / no-rollback;machine schema;role identity;pairing;blocked status | `03`§10~§15;`05`§6 / §9~§13;`06`§8~§11 | candidate qualification不适用:P0-C不得依赖P0-Q | `passed_design`;不得把source writer能力写成source run Pass |
| `CB-SBX-13A` | candidate identity / adapter;BASE+CONFIG+MATERIAL+CANDIDATE | immutable identity;config binding;adapter outcome;anti-substitution;zero-launch preflight;credential no-store | `03`§13;`04`§6 / §8~§12;`05`§8 / §13 | probe result不适用:本boundary只固定授权和adapter | `blocked_pre_implementation`:candidate ADR / revision、ENV-05、generation / template、provider / material identity待关闭 |
| `CB-SBX-13B` | candidate probe / evidence;BASE+CANDIDATE+SAFETY+EVIDENCE | 13 CONF identity continuity;artifact schema;redaction;cleanup / containment disposition;blocked propagation | `05`CONF-001~013 / §9 / §13;`06`P0-Q AC / VETO | P1 real-like不适用:PROFILE-06不可补P0-Q | `blocked_pre_implementation`:依赖13A全部Activation inputs;缺失时0 launch |
| `CB-SBX-14A` | gate / checks;BASE+EVIDENCE | shared selector;path / identity;failure status;four-source order;blocked propagation;no-static;scope reopen | `05`§9 / §12~§13;`06`§3 / §10~§11 / §14 | business DTO / state不适用:只编排既有suite source | `passed_design`;CI provider binding由Step 8固定,不得改变gate语义 |
| `CB-SBX-14B` | schema / slots / reports;BASE+EVIDENCE | machine schema;canonical digest;artifact materialization;pairing;EV allocation;source status fidelity;redaction | `05`§13;`06`§10 | acceptance verdict / risk不适用:renderer无裁决authority | `passed_design`;无raw / pair不得补洞 |
| `CB-SBX-14C` | acceptance drafts / handoff;BASE+EVIDENCE | fixed source identity;VETO / defect / risk source;draft / review separation;path;phase boundary;conditional honesty | `05`§12~§14;`06`§11~§14 | runtime authorization / signing不适用:脚本无审查或签署权 | `passed_design`;四draft只能保留待审状态 |

### 7.9 提交粒度判断

| Boundary集合 | 粒度 | 一句话 /独立review /独立验证 /可回退 | 规模控制 | 调整结论 |
|---|---|---|---|---|
| 01A;02A~D | 适中 | 5 /5均是 | 2~3 batches / boundary | 保留;canonical与Shell已分boundary |
| 03A~B | 偏大但内聚 | 2 /2均是 | 各4 batches;schema / security独立批 | 保留;不得把03A /03B再合并 |
| 04A~B;05A~B;06A~B | 适中 | 6 /6均是 | contract-domain与transaction-entry分离 | 保留 |
| 07A~C | 适中 | 3 /3均是 | 每owner 3 batches | 保留;Run / Capture / Handoff不可合并 |
| 08A~B | 适中 | 2 /2均是 | safety topics各3 batches | 保留 |
| 09A~B | 适中 | 2 /2均是 | contract / service各3 batches | 保留;09A -> 09B严格串行,09B handoff后才进入10A |
| 10A~B | 偏大但同族 | 2 /2均是 | 各4 protocol-family batches | 保留;若单批>300按consumer / event子族继续切批,commit ID不变 |
| 11A~C | 偏大但可分段review | 3 /3均是 | 4 /4 /5 batches | 保留;11C五批逐批停审,不得一次写完再测 |
| 12A~B | 偏大且高风险 | 2 /2均是 | 4 /6 batches | 保留为inventory freeze与consistency freeze;每批独立验证 |
| 13A~B | 适中 | 2 /2均是 | 3 /5 batches | 保留;identity binding与probe结果严格分离 |
| 14A~C | 偏大但职责分离 | 3 /3均是 | 4 /5 /4 batches | 保留;gate / report / acceptance不得合并 |

没有boundary按单文件、单struct、单函数或每日工作量定义。10A /10B、11C、12B、13B、14A~C属于受控偏大边界,其可回退目标仍唯一,但实现必须按批次逐批review /验证;若实际变化出现两个独立目标,必须先回写Step 6新增stable boundary,不得临时多提交。

### 7.10 Exact协议、状态与高风险测试Owner矩阵

#### 7.10.1 55个协议Owner

`Contract boundary`负责正式carrier / source map;`Executable boundary`负责service / entry / transaction或publisher。二者相同表示同一boundary内按batch先contract后flow。所有名称逐字来自正式`03`§7,不得建立缩写协议名。

| Family | Exact protocol | Contract boundary | Executable boundary | Exact primary TC |
|---|---|---|---|---|
| Command | `OpenControlledExecutionContext` | 04A | 04B | `TC-SBX-CMD-001`;`TC-SBX-CMD-002` |
| Command | `EstablishExecutionBoundary` | 05A | 05B | `TC-SBX-CMD-003`;`TC-SBX-CMD-004` |
| Command | `EvaluatePolicyExecution` | 06A | 06B | `TC-SBX-CMD-005`;`TC-SBX-CMD-006` |
| Command | `StartControlledExecutionRun` | 07A | 07A | `TC-SBX-CMD-007`;`TC-SBX-CMD-008` |
| Command | `RecordCaptureResult` | 07B | 07B | `TC-SBX-CMD-009`;`TC-SBX-CMD-010` |
| Command | `OpenMaterialHandoff` | 07C | 07C | `TC-SBX-CMD-011`;`TC-SBX-CMD-012` |
| Command | `SubmitSandboxControl` | 08A | 08A | `TC-SBX-CMD-013`;`TC-SBX-CMD-014` |
| Command | `ClassifySandboxFailure` | 08A | 08A | `TC-SBX-CMD-015`;`TC-SBX-CMD-016` |
| Command | `EvaluateCleanupReadiness` | 08B | 08B | `TC-SBX-CMD-017`;`TC-SBX-CMD-018` |
| Command | `RecordRedlineContainment` | 08B | 08B | `TC-SBX-CMD-019`;`TC-SBX-CMD-020` |
| Query | `GetSandboxExecutionStatus` | 09A | 09B | `TC-SBX-QRY-001`;`TC-SBX-QRY-002` |
| Query | `GetBoundaryStatus` | 09A | 09B | `TC-SBX-QRY-003`;`TC-SBX-QRY-004` |
| Query | `GetPolicyDecisionSummary` | 09A | 09B | `TC-SBX-QRY-005`;`TC-SBX-QRY-006` |
| Query | `GetCaptureSummary` | 09A | 09B | `TC-SBX-QRY-007`;`TC-SBX-QRY-008` |
| Query | `GetMaterialHandoffStatus` | 09A | 09B | `TC-SBX-QRY-009`;`TC-SBX-QRY-010` |
| Query | `GetFailureControlStatus` | 09A | 09B | `TC-SBX-QRY-011`;`TC-SBX-QRY-012` |
| Query | `GetCleanupReadiness` | 09A | 09B | `TC-SBX-QRY-013`;`TC-SBX-QRY-014` |
| Query | `GetRedlineContainmentStatus` | 09A | 09B | `TC-SBX-QRY-015`;`TC-SBX-QRY-016` |
| Query | `GetSandboxReadProjection` | 09A | 09B | `TC-SBX-QRY-017`;`TC-SBX-QRY-018` |
| Query | `GetDerivedInspectPreviewTrend` | 09A | 09B | `TC-SBX-QRY-019`;`TC-SBX-QRY-020` |
| Query | `GetBackendCapabilityComparison` | 09A | 09B | `TC-SBX-QRY-021`;`TC-SBX-QRY-022` |
| Query | `GetSandboxReconciliationReport` | 09A | 09B | `TC-SBX-QRY-023`;`TC-SBX-QRY-024` |
| Query | `GetSandboxAuditTrace` | 09A | 09B | `TC-SBX-QRY-025`;`TC-SBX-QRY-026` |
| Consumer | `ConsumeCallerContextReferenceChanged` | 10A | 10A | `TC-SBX-CNS-001`;`TC-SBX-CNS-002`;`TC-SBX-CNS-003`;`TC-SBX-CNS-004`;`TC-SBX-CNS-005`;`TC-SBX-CNS-006` |
| Consumer | `ConsumePolicySummaryChanged` | 10A | 10A | `TC-SBX-CNS-001`;`TC-SBX-CNS-002`;`TC-SBX-CNS-003`;`TC-SBX-CNS-004`;`TC-SBX-CNS-007`;`TC-SBX-CNS-008` |
| Consumer | `ConsumeBackendCapabilitySummaryChanged` | 10A | 10A | `TC-SBX-CNS-001`;`TC-SBX-CNS-002`;`TC-SBX-CNS-003`;`TC-SBX-CNS-004`;`TC-SBX-CNS-009`;`TC-SBX-CNS-010` |
| Consumer | `ConsumeIsolationBackendLifecycleSignal` | 10A | 10A | `TC-SBX-CNS-001`;`TC-SBX-CNS-002`;`TC-SBX-CNS-003`;`TC-SBX-CNS-004`;`TC-SBX-CNS-011`;`TC-SBX-CNS-012` |
| Consumer | `ConsumeMaterialHandoffStatusChanged` | 10A | 10A | `TC-SBX-CNS-001`;`TC-SBX-CNS-002`;`TC-SBX-CNS-003`;`TC-SBX-CNS-004`;`TC-SBX-CNS-013`;`TC-SBX-CNS-014` |
| Consumer | `ConsumeObservabilityHandoffStatusChanged` | 10A | 10A | `TC-SBX-CNS-001`;`TC-SBX-CNS-002`;`TC-SBX-CNS-003`;`TC-SBX-CNS-004`;`TC-SBX-CNS-015`;`TC-SBX-CNS-016` |
| Consumer | `ConsumeSandboxControlRequested` | 10A | 10A | `TC-SBX-CNS-001`;`TC-SBX-CNS-002`;`TC-SBX-CNS-003`;`TC-SBX-CNS-004`;`TC-SBX-CNS-017`;`TC-SBX-CNS-018` |
| Consumer | `ConsumeInvestigationHandoffStatusChanged` | 10A | 10A | `TC-SBX-CNS-001`;`TC-SBX-CNS-002`;`TC-SBX-CNS-003`;`TC-SBX-CNS-004`;`TC-SBX-CNS-019`;`TC-SBX-CNS-020` |
| Consumer | `ConsumeSandboxTruthRelayFeedback` | 10A | 10A | `TC-SBX-CNS-001`;`TC-SBX-CNS-002`;`TC-SBX-CNS-003`;`TC-SBX-CNS-004`;`TC-SBX-CNS-021`;`TC-SBX-CNS-022` |
| Outbound Event | `SandboxExecutionContextChanged` | 04A | 10B publisher | `TC-SBX-EVT-001`;`TC-SBX-EVT-014`;`TC-SBX-EVT-015` |
| Outbound Event | `SandboxBoundaryChanged` | 05A | 10B publisher | `TC-SBX-EVT-002`;`TC-SBX-EVT-014`;`TC-SBX-EVT-015` |
| Outbound Event | `SandboxPolicyDecisionChanged` | 06A | 10B publisher | `TC-SBX-EVT-003`;`TC-SBX-EVT-014`;`TC-SBX-EVT-015` |
| Outbound Event | `SandboxRunChanged` | 07A | 10B publisher | `TC-SBX-EVT-004`;`TC-SBX-EVT-014`;`TC-SBX-EVT-015` |
| Outbound Event | `SandboxCaptureChanged` | 07B | 10B publisher | `TC-SBX-EVT-005`;`TC-SBX-EVT-014`;`TC-SBX-EVT-015` |
| Outbound Event | `SandboxMaterialHandoffChanged` | 07C | 10B publisher | `TC-SBX-EVT-006`;`TC-SBX-EVT-014`;`TC-SBX-EVT-015` |
| Outbound Event | `SandboxFailureChanged` | 08A | 10B publisher | `TC-SBX-EVT-007`;`TC-SBX-EVT-014`;`TC-SBX-EVT-015` |
| Outbound Event | `SandboxControlChanged` | 08A | 10B publisher | `TC-SBX-EVT-008`;`TC-SBX-EVT-014`;`TC-SBX-EVT-015` |
| Outbound Event | `SandboxCleanupChanged` | 08B | 10B publisher | `TC-SBX-EVT-009`;`TC-SBX-EVT-014`;`TC-SBX-EVT-015` |
| Outbound Event | `SandboxRedlineContainmentChanged` | 08B | 10B publisher | `TC-SBX-EVT-010`;`TC-SBX-EVT-014`;`TC-SBX-EVT-015` |
| Outbound Event | `SandboxProjectionChanged` | 10B | 10B publisher | `TC-SBX-EVT-011`;`TC-SBX-EVT-014`;`TC-SBX-EVT-015` |
| Outbound Event | `SandboxDerivedViewChanged` | 10B | 10B publisher | `TC-SBX-EVT-012`;`TC-SBX-EVT-014`;`TC-SBX-EVT-015` |
| Outbound Event | `SandboxReconciliationFindingAvailable` | 10B | 10B publisher | `TC-SBX-EVT-013`;`TC-SBX-EVT-014`;`TC-SBX-EVT-015` |
| Job | `PublishSandboxEventRelay` | 11A | 11B | `TC-SBX-JOB-001`;`TC-SBX-JOB-011`;`TC-SBX-JOB-012` |
| Job | `RefreshSandboxReferenceStates` | 11A | 11B | `TC-SBX-JOB-002`;`TC-SBX-JOB-011`;`TC-SBX-JOB-012` |
| Job | `RefreshBackendCapabilitySummaries` | 11A | 11B | `TC-SBX-JOB-003`;`TC-SBX-JOB-011`;`TC-SBX-JOB-012` |
| Job | `RetryPendingMaterialHandoffs` | 11A | 11B | `TC-SBX-JOB-004`;`TC-SBX-JOB-011`;`TC-SBX-JOB-012` |
| Job | `RunLeaseOrphanReaper` | 11A | 11C | `TC-SBX-JOB-005`;`TC-SBX-JOB-011`;`TC-SBX-JOB-012` |
| Job | `EvaluatePendingCleanupGuards` | 11A | 11C | `TC-SBX-JOB-006`;`TC-SBX-JOB-011`;`TC-SBX-JOB-012` |
| Job | `MaintainRedlineContainmentHandoffs` | 11A | 11C | `TC-SBX-JOB-007`;`TC-SBX-JOB-011`;`TC-SBX-JOB-012` |
| Job | `RebuildSandboxReadProjections` | 11A | 11C | `TC-SBX-JOB-008`;`TC-SBX-JOB-011`;`TC-SBX-JOB-012` |
| Job | `MaintainDerivedInspectPreviewTrend` | 11A | 11C | `TC-SBX-JOB-009`;`TC-SBX-JOB-011`;`TC-SBX-JOB-012` |
| Job | `RunSandboxReconciliation` | 11A | 11C | `TC-SBX-JOB-010`;`TC-SBX-JOB-011`;`TC-SBX-JOB-012` |

机械计数: Command 10、Query 13、Consumer 9、Outbound Event 13、Job 10,合计55。`CB-SBX-12A`只做55 /55全量inventory与既有owner缺口修复,不得把protocol owner迁移到hardening boundary。

#### 7.10.2 状态Owner与Canonical Enum Inventory

| Exact state enum / TC | First owner boundary | Later consumer / hardening boundary | 不得越界 |
|---|---|---|---|
| `ControlledExecutionIntakeStatus`;`TC-SBX-STA-001` | 04A | 04B;12A | Consumer / Query不得重开intake |
| `ExecutionEnvironmentIdentityStatus`;`TC-SBX-STA-002` | 04A | 04B;05B;07A;12A | 不拥有member / host lifecycle truth |
| `ReferenceResolutionStatus`;`TC-SBX-STA-003` | 04A | 04B;10A;11B;12A | reference marker不反写core truth |
| `BoundaryDecisionStatus`;`TC-SBX-STA-004` | 05A | 05B;12A | stale capability不得Established |
| `BoundaryCoherenceStatus`;`TC-SBX-STA-005` | 05A | 05B;08B;12A | partial四维不得Coherent |
| `BackendCapabilityStatus`;`TC-SBX-STA-006` | 05A | 05B;10A;11B;12A | technical status不授权launch |
| `IsolationHandleStatus`;`TC-SBX-STA-007` | 05A | 05B;08B;10A;11C;12A | Released不复活;release受guard |
| `LeaseStatus`;`TC-SBX-STA-008` | 05A | 05B;08B;10A;11C;12A | lease不等于backend truth |
| `OrphanRecoveryStatus`;`TC-SBX-STA-009` | 05A | 08B;10A;11C;12A | recovery不绕cleanup guard |
| `PolicyApplicabilityStatus`;`TC-SBX-STA-010` | 06A | 06B;10A;11B;12A | 非Applicable不得allow |
| `PolicyExecutionDecisionStatus`;`TC-SBX-STA-011` | 06A | 06B;07A;10A;12A | 同decision终态不得改Accepted |
| `HighRiskActionDecisionStatus`;`TC-SBX-STA-012` | 06A | 06B;07A;12A | 非Allowed backend调用为0 |
| `ControlledExecutionRunStatus`;`TC-SBX-STA-013` | 07A | 08A;10A;12A | agent-loop状态不得写入run enum |
| `CaptureFactStatus`;`TC-SBX-STA-014` | 07B | 07C;10A;12A | `CaptureFact::record(...)`创建即定格;无`Pending`;Partial / Failed不得改Complete |
| `HandoffFactStatus`;`TC-SBX-STA-015` | 07C | 10A;11B;12A | 从完整target progress set机械派生;failure不回滚capture;无material `DeadLetter` |
| `FailureClassificationStatus`;`TC-SBX-STA-016` | 08A | 10A;11C;12A | Unknown不得成功 |
| `ControlFactStatus`;`TC-SBX-STA-017` | 08A | 10A;12A | duplicate不得创建第二truth |
| `CleanupGuardStatus`;`TC-SBX-STA-018` | 08B | 10A;11C;12A | non-Allowed release=0 |
| `RedlineContainmentStatus`;`TC-SBX-STA-019` | 08B | 10A;11C;12A | redline不得advisory-only |
| `QueryAccessStatus`;`TC-SBX-STA-020` | 09A | 09B;12A | query不得通过repair变Visible |
| `SandboxProjectionStatus`;`TC-SBX-STA-021` | 09A | 09B;10A;11C;12A | query不rebuild;job不修truth |
| `DerivedFreshnessStatus`;`TC-SBX-STA-022` | 09A | 09B;11C;12A | derived failure不建core failure |
| `ReconciliationReportStatus`;`TC-SBX-STA-023` | 09A | 09B;11C;12A | report不驱动truth repair |
| `SandboxEventRelayStatus`;`TC-SBX-STA-024` | 10B | 11B;12A | success=`Published`;`Published` / `DeadLetter`不复活 |
| `IdempotencyRecordStatus`;`TC-SBX-STA-025` | 02B | 04B~08B;10A;11A;12A | one executor;Failed不可同record改Completed |
| `StoredResultStatus`;`TC-SBX-STA-026` | 02B | 04B~08B;10A;11A;12A | missing / wrong kind不得重算 |
| `ConsumerReceiptStatus`;`TC-SBX-STA-027` | 10A | 12A | Duplicate不重跑;Delayed不写accepted truth |
| `JobReportStatus`;`TC-SBX-STA-028` | 11A | 11B;11C;12A | partial不得伪Succeeded |
| `AdapterAvailabilityStatus`;`TC-SBX-STA-029` | 03B | 04B~08B;09B~11C;12A | Degraded / Disabled不放宽hard guard |
| `RuntimeConfigStatus`;`TC-SBX-STA-030` | 03B | all runtime boundaries;12A | invalid / partial必须StartupBlocked |
| `HandoffTargetProgressStatus`;`TC-SBX-STA-031` | 07C | 11B;12A | `Pending -> Attempting`;eligible `Retryable -> Attempting`;同一attempt只允许一次`deliver`，unknown只inspect same attempt |

计数必须分层：30个owner-level state machines、31个Step 10 canonical status enum entries、39个Step 6 shared status declarations。`STA-001~031`是稳定测试 /验收索引，不等于31个独立可变状态机。`CB-SBX-12A`执行三层exact inventory和existing-owner缺口修复,不得集中重定义状态；`CB-SBX-12B`只运行跨owner transaction / race加固,不得新增enum variant。

#### 7.10.3 38个Typed Error Producer Owner

| Exact error TC / formal error | First producer boundary | Required full-inventory boundary | 关键恢复禁令 |
|---|---|---|---|
| `TC-SBX-ERR-001`;`ContractError::InvalidCarrier` | 02A | 12A | invalid carrier不得进入service |
| `TC-SBX-ERR-002`;`ContractError::UnsupportedProtocolVersion` | 10A | 12A | 不支持schema不得写core success |
| `TC-SBX-ERR-003`;`DomainError::InvalidStateTransition` | 04A | 12A | owner state不变,不得口语替代 |
| `TC-SBX-ERR-004`;`DomainError::TerminalStateReopen` | 04A | 12A | terminal恢复必须new truth / record |
| `TC-SBX-ERR-005`;`DomainError::PolicyFailClosedBypass` | 06A | 12A | 新summary后新decision,不得改旧decision |
| `TC-SBX-ERR-006`;`DomainError::WeakBoundaryFallbackRejected` | 05A | 12A | 无host / partial fallback |
| `TC-SBX-ERR-007`;`DomainError::BoundaryCoherenceViolation` | 05A | 12A | partial group全不可见 |
| `TC-SBX-ERR-008`;`DomainError::ForbiddenExternalBodyPersistence` | 04A | 12A | quarantine / reject,不得保存正文 |
| `TC-SBX-ERR-009`;`DomainError::NoRollbackInvariantViolation` | 07C | 12A | source / capture保持committed |
| `TC-SBX-ERR-010`;`DomainError::CleanupGuardRejected` | 08B | 12A | guard变化后new flow;release=0 |
| `TC-SBX-ERR-011`;`DomainError::RedlineContainmentRequired` | 08B | 12A | containment与材料保留 |
| `TC-SBX-ERR-012`;`DomainError::HandoffTargetMismatch` | 07C | 12A | 不猜target;owner truth不变 |
| `TC-SBX-ERR-013`;`ApplicationError::Validation` | 09A | 12A | selector / scope不得scan /拼ref |
| `TC-SBX-ERR-014`;`ApplicationError::ReferenceUnresolved` | 04B | 12A | 不猜external truth |
| `TC-SBX-ERR-015`;`ApplicationError::NotAuthorized` | 04B | 12A | hidden response不得含view body |
| `TC-SBX-ERR-016`;`ApplicationError::VersionConflict` | 02B | 12A | rollback;fresh read后按same identity重试 |
| `TC-SBX-ERR-017`;`ApplicationError::IdempotencyConflict` | 02B | 12A | 原record / result不可覆盖 |
| `TC-SBX-ERR-018`;`ApplicationError::DuplicateMissingResult` | 02B | 12A | manual integrity;不得重算 |
| `TC-SBX-ERR-019`;`ApplicationError::NoWriteViolation` | 09B | 12A | mutation=0;修query实现 |
| `TC-SBX-ERR-020`;`ApplicationError::JobNoRepairViolation` | 11A | 12A | report Failed;core write=0 |
| `TC-SBX-ERR-021`;`ApplicationError::CursorInvariantViolation` | 02B | 12A | cursor不得猜测转换 |
| `TC-SBX-ERR-022`;`ApplicationError::TransactionBeginFailed` | 02B | 12A | reserve / write=0 |
| `TC-SBX-ERR-023`;`ApplicationError::TransactionCommitFailed` | 02B | 12A | 不自动重放side effect |
| `TC-SBX-ERR-024`;`ApplicationError::RollbackFailed` | 02B | 12A | 不宣称clean rollback / success |
| `TC-SBX-ERR-025`;`ApplicationError::ProjectionMissing` | 09B | 12A | Query不rebuild;Job按formal selection |
| `TC-SBX-ERR-026`;`ApplicationError::QueryMaterialDegraded` | 09B | 12A | safe marker;write / repair=0 |
| `TC-SBX-ERR-027`;`InfraError::AdapterUnavailable` | 04B | 12A | 不改业务success;formal retry identity不变 |
| `TC-SBX-ERR-028`;`InfraError::AdapterDisabled` | 03B | 12A | 新generation修复;hard guard保持 |
| `TC-SBX-ERR-029`;`InfraError::OutcomeClassificationMissing` | 03B | 12A | 不解析error string或default success |
| `TC-SBX-ERR-030`;`InfraError::RuntimeBuilderFailed` | 03B | 12A | publication 0或完整,无partial |
| `TC-SBX-ERR-031`;`ApiError::InvalidEntryMetadata` | 04B | 12A | service / repository / port调用0 |
| `TC-SBX-ERR-032`;`WorkerError::EnvelopeInvalid` | 10A | 12A | reserve前失败,不伪receipt truth |
| `TC-SBX-ERR-033`;`WorkerError::UnsafeExternalBody` | 10A | 12A | quarantine且不重试不可信正文 |
| `TC-SBX-ERR-034`;`JobsError::ReportPersistenceFailed` | 11A | 12A | 不宣称job / report success |
| `TC-SBX-ERR-035`;`RelayError::RetryablePublishFailure` | 10B | 12A | source truth不回滚 |
| `TC-SBX-ERR-036`;`RelayError::DeadLetter` | 10B | 12A | same relay terminal不复活 |
| `TC-SBX-ERR-037`;`HandoffError::RetryableDeliveryFailure` | 07C | 12A | capture / guard不回滚 |
| `TC-SBX-ERR-038`;`HandoffError::PermanentDeliveryFailure` | 07C | 12A | capture保持,cleanup可继续blocked |

#### 7.10.4 14 TXN与19 RACE Owner

| Test group | Exact test IDs | First executable boundary / supporting boundary | Full hardening | 不得替代 |
|---|---|---|---|---|
| Shared command UoW | `TC-SBX-TXN-001`;`TC-SBX-TXN-002`;`TC-SBX-TXN-003`;`TC-SBX-TXN-004` | 02B kernel;04B first command slice | 12B | 单happy-path transaction |
| Reference-only UoW | `TC-SBX-TXN-005` | 10A;11B refresh | 12B | source version / dedup key作cursor |
| Query consistency | `TC-SBX-TXN-006` | 09B | 12B | write lock / repair |
| Command replay | `TC-SBX-TXN-007` | 04B;05B~08B复用 | 12B | response equality without call audit |
| Consumer replay | `TC-SBX-TXN-008` | 10A | 12B | re-run then same receipt |
| Job replay | `TC-SBX-TXN-009` | 11A | 12B | reselect / rebuild report |
| Cross-channel conflict / integrity | `TC-SBX-TXN-010`;`TC-SBX-TXN-011`;`TC-SBX-TXN-012` | 02B kernel;各channel消费 | 12B | overwrite / recompute / second executor |
| Version / unique create | `TC-SBX-TXN-013`;`TC-SBX-TXN-014` | 02B kernel;各write slice消费 | 12B | fake auto-merge / overwrite |
| Intake races | `TC-SBX-RACE-001`;`TC-SBX-RACE-002`;`TC-SBX-RACE-003` | 02B reserve kernel;04B truth races | 12B | sleep / probability |
| Boundary races | `TC-SBX-RACE-004`;`TC-SBX-RACE-005` | 05B | 12B | partial handle / refresh owns truth |
| Policy race | `TC-SBX-RACE-006` | 06B +10A policy consumer | 12B | stale summary auto-allow |
| Run / capture races | `TC-SBX-RACE-007`;`TC-SBX-RACE-008` | 07A /07B +08A | 12B | terminal run reopen |
| Handoff race | `TC-SBX-RACE-009` | 07C +10A /11B | 12B | target guess / capture rollback |
| Control race | `TC-SBX-RACE-010` | 08A +10A | 12B | API / event双truth |
| Safety races | `TC-SBX-RACE-011`;`TC-SBX-RACE-012`;`TC-SBX-RACE-013` | 08A /08B +10A /11C | 12B | unknown success / guard bypass |
| Relay race | `TC-SBX-RACE-014` | 10B | 12B | source rollback / terminal reopen |
| Reference race | `TC-SBX-RACE-015` | 10A +11B | 12B | event key作cursor |
| Projection race | `TC-SBX-RACE-016` | 11C with 09A contract | 12B | half view / query rebuild |
| Derived / reconciliation races | `TC-SBX-RACE-017`;`TC-SBX-RACE-018` | 11C | 12B | core repair / non-atomic latest |
| Query / mutation race | `TC-SBX-RACE-019` | 09B | 12B | mid-commit half group |

所有race必须使用controlled schedule并运行两个关键顺序;不得以压力测试偶现、sleep或单一ordering代替。`CB-SBX-12B`只补齐全量和parity,不能把前序纵切应有的targeted race推迟到最后。

#### 7.10.5 Exact Rust-facing Carrier与Flow Owner

| Boundary | Exact input / output carrier | Exact flow / facade | Closure要求 |
|---|---|---|---|
| 02A | `SandboxProtocolMetadataDto`;`SandboxActorContextDto`;`SandboxCommandMetadataDto`;`SandboxQueryMetadataDto`;`SandboxPageRequestDto`;`SandboxPageInfoDto`;`SandboxPagedResponseDto<T>`;`SandboxCommandResultDto`;`SandboxStoredOperationResultDto`;`SandboxConsumerReceiptDto`;`SandboxJobReportDto`;`SandboxJobReportItemDto`;`SandboxPublicErrorDto` | shared contracts only | 字段 / enum / ref family / body-free / stored replay shape必须在具体协议前冻结 |
| 04A /04B | `OpenControlledExecutionContextRequestDto` -> `SandboxCommandResultDto`;`SandboxExecutionContextChangedPayloadDto` | `OpenControlledExecutionContextFlow`;`SandboxCommandService::open_controlled_execution_context` | request字段能构造context / identity / resolution;04B不得改04A carrier |
| 05A /05B | `EstablishExecutionBoundaryRequestDto` -> `SandboxCommandResultDto`;`SandboxBoundaryChangedPayloadDto` | `EstablishExecutionBoundaryFlow`;`SandboxCommandService::establish_execution_boundary` | accepted context / active identity / explicit four-dimension isolation + workspace requirement / profile / template / generation与capability能构造decision / coherent set / handle / I065-bounded lease;无policy输入 |
| 06A /06B | `EvaluatePolicyExecutionRequestDto` -> `SandboxCommandResultDto`;`SandboxPolicyDecisionChangedPayloadDto` | `EvaluatePolicyExecutionFlow`;`SandboxCommandService::evaluate_policy_execution` | 按typed requirement ref读取前序事实;policy / authorization summary / high-risk markers只有body-free来源且一次snapshot携带 |
| 07A | `StartControlledExecutionRunRequestDto` -> `SandboxCommandResultDto`;`SandboxRunChangedPayloadDto` | `StartControlledExecutionRunFlow`;`SandboxCommandService::start_controlled_execution_run` | boundary -> handle -> persisted lease exact refs与policy ref匹配;handle / lease Active且未过期;launch summary不含tools语义正文 |
| 07B | `RecordCaptureResultRequestDto` -> `SandboxCommandResultDto`;`SandboxCaptureChangedPayloadDto` | `RecordCaptureResultFlow`;`SandboxCommandService::record_capture_result` | capture output只为refs / digest / safe summary,不升格Artifact truth |
| 07C | `OpenMaterialHandoffRequestDto` -> `SandboxCommandResultDto`;`SandboxMaterialHandoffChangedPayloadDto` | `OpenMaterialHandoffFlow`;`SandboxCommandService::open_material_handoff` | target / capture / material / obs refs构造完整;delivery outcome独立于capture truth |
| 08A | `SubmitSandboxControlRequestDto`;`ClassifySandboxFailureRequestDto` -> `SandboxCommandResultDto`;`SandboxControlChangedPayloadDto`;`SandboxFailureChangedPayloadDto` | `SubmitSandboxControlFlow`;`ClassifySandboxFailureFlow` | control intent / failure source marker结构化;unknown不猜kind |
| 08B | `EvaluateCleanupReadinessRequestDto`;`RecordRedlineContainmentRequestDto` -> `SandboxCommandResultDto`;`SandboxCleanupChangedPayloadDto`;`SandboxRedlineContainmentChangedPayloadDto` | `EvaluateCleanupReadinessFlow`;`RecordRedlineContainmentFlow` | blocking refs / investigation / guard source完整;command不直接release |
| 09A /09B | `GetSandboxExecutionStatusRequestDto` -> `SandboxExecutionStatusViewDto`;`GetBoundaryStatusRequestDto` -> `BoundaryStatusViewDto`;`GetPolicyDecisionSummaryRequestDto` -> `PolicyDecisionSummaryViewDto`;`GetCaptureSummaryRequestDto` -> `CaptureSummaryViewDto`;`GetMaterialHandoffStatusRequestDto` -> `MaterialHandoffStatusViewDto`;`GetFailureControlStatusRequestDto` -> `FailureControlStatusViewDto`;`GetCleanupReadinessRequestDto` -> `CleanupReadinessViewDto`;`GetRedlineContainmentStatusRequestDto` -> `RedlineContainmentViewDto` | `GetSandboxExecutionStatusFlow`;`GetBoundaryStatusFlow`;`GetPolicyDecisionSummaryFlow`;`GetCaptureSummaryFlow`;`GetMaterialHandoffStatusFlow`;`GetFailureControlStatusFlow`;`GetCleanupReadinessFlow`;`GetRedlineContainmentStatusFlow` | 09A冻结request / view / marker;09B只装配read sources / disposition,write set=0 |
| 09A /09B | `GetSandboxReadProjectionRequestDto` -> `SandboxReadProjectionDto`;`GetDerivedInspectPreviewTrendRequestDto` -> `DerivedInspectPreviewTrendViewDto`;`GetBackendCapabilityComparisonRequestDto` -> `BackendCapabilityComparisonViewDto`;`GetSandboxReconciliationReportRequestDto` -> `SandboxReconciliationReportDto`;`GetSandboxAuditTraceRequestDto` -> `SandboxPagedResponseDto<SandboxAuditTraceItemDto>` | `GetSandboxReadProjectionFlow`;`GetDerivedInspectPreviewTrendFlow`;`GetBackendCapabilityComparisonFlow`;`GetSandboxReconciliationReportFlow`;`GetSandboxAuditTraceFlow` | projection / derived / report / audit typed lookup和empty / degraded来源完整 |
| 10A | `SandboxInboundEventEnvelopeDto<CallerContextReferenceChangedPayloadDto>`;`<PolicySummaryChangedPayloadDto>`;`<BackendCapabilitySummaryChangedPayloadDto>`;`<IsolationBackendLifecycleSignalPayloadDto>`;`<MaterialHandoffStatusChangedPayloadDto>`;`<ObservabilityHandoffStatusChangedPayloadDto>`;`<SandboxControlRequestedPayloadDto>`;`<InvestigationHandoffStatusChangedPayloadDto>`;`<SandboxTruthRelayFeedbackPayloadDto>` -> `SandboxConsumerReceiptDto` | `ConsumeCallerContextReferenceChangedFlow`;`ConsumePolicySummaryChangedFlow`;`ConsumeBackendCapabilitySummaryChangedFlow`;`ConsumeIsolationBackendLifecycleSignalFlow`;`ConsumeMaterialHandoffStatusChangedFlow`;`ConsumeObservabilityHandoffStatusChangedFlow`;`ConsumeSandboxControlRequestedFlow`;`ConsumeInvestigationHandoffStatusChangedFlow`;`ConsumeSandboxTruthRelayFeedbackFlow` | envelope字段不在payload重复;9 flow复用dedup / receipt / quarantine模板 |
| 10B | `SandboxOutboundEventEnvelopeDto<SandboxExecutionContextChangedPayloadDto>`;`<SandboxBoundaryChangedPayloadDto>`;`<SandboxPolicyDecisionChangedPayloadDto>`;`<SandboxRunChangedPayloadDto>`;`<SandboxCaptureChangedPayloadDto>`;`<SandboxMaterialHandoffChangedPayloadDto>`;`<SandboxFailureChangedPayloadDto>`;`<SandboxControlChangedPayloadDto>`;`<SandboxCleanupChangedPayloadDto>`;`<SandboxRedlineContainmentChangedPayloadDto>`;`<SandboxProjectionChangedPayloadDto>`;`<SandboxDerivedViewChangedPayloadDto>`;`<SandboxReconciliationFindingAvailablePayloadDto>` | `AppendSandboxOutboundRelayFlow`;`PublishSandboxEventRelayFlow` | 13 payload各有committed source / cursor;publisher只读stored payload |
| 11A /11B | `SandboxJobInputDto<PublishSandboxEventRelayJobSpecDto>`;`<RefreshSandboxReferenceStatesJobSpecDto>`;`<RefreshBackendCapabilitySummariesJobSpecDto>`;`<RetryPendingMaterialHandoffsJobSpecDto>` -> `SandboxJobReportDto` | `PublishSandboxEventRelayFlow`;`RefreshSandboxReferenceStatesFlow`;`RefreshBackendCapabilitySummariesFlow`;`RetryPendingMaterialHandoffsFlow` | 11A冻结spec / report / item refs;11B实现selection / per-item UoW |
| 11A /11C | `SandboxJobInputDto<RunLeaseOrphanReaperJobSpecDto>`;`<EvaluatePendingCleanupGuardsJobSpecDto>`;`<MaintainRedlineContainmentHandoffsJobSpecDto>`;`<RebuildSandboxReadProjectionsJobSpecDto>`;`<MaintainDerivedInspectPreviewTrendJobSpecDto>`;`<RunSandboxReconciliationJobSpecDto>` -> `SandboxJobReportDto` | `RunLeaseOrphanReaperFlow`;`EvaluatePendingCleanupGuardsFlow`;`MaintainRedlineContainmentHandoffsFlow`;`RebuildSandboxReadProjectionsFlow`;`MaintainDerivedInspectPreviewTrendFlow`;`RunSandboxReconciliationFlow` | 11C不得从opaque ref / old view / error text推plan、view字段或finding |

以上carrier / flow只来自正式`03`与其已审查校准源。若实现时发现字段名、variant、port output或function signature无法1:1落码,当前boundary立即`blocked / wait_design`;不得在Step 6或实现仓发明“近似DTO”。

#### 7.10.6 剩余测试Family Owner

| Family / exact IDs | First owner boundary | Full inventory / final boundary | 归属规则 |
|---|---|---|---|
| `TC-SBX-CTR-001`;`TC-SBX-CTR-002`;`TC-SBX-CTR-003`;`TC-SBX-CTR-004`;`TC-SBX-CTR-005`;`TC-SBX-CTR-006` | 02A;02C负责CTR-004 canonical primitive;后续协议边界消费 | 12A | shared carrier测试不重复计入每协议主归属 |
| `TC-SBX-CFG-001`;`TC-SBX-CFG-002`;`TC-SBX-CFG-003`;`TC-SBX-CFG-004`;`TC-SBX-CFG-005`;`TC-SBX-CFG-006`;`TC-SBX-CFG-007`;`TC-SBX-CFG-008`;`TC-SBX-CFG-011` | 03A | 12B cross-flow复验 | source / strict schema / validation owner |
| `TC-SBX-CFG-009`;`TC-SBX-CFG-010`;`TC-SBX-CFG-012`;`TC-SBX-CFG-013`;`TC-SBX-CFG-014`;`TC-SBX-CFG-015`;`TC-SBX-CFG-016`;`TC-SBX-CFG-017`;`TC-SBX-CFG-024`;`TC-SBX-CFG-025`;`TC-SBX-CFG-026`;`TC-SBX-CFG-027`;`TC-SBX-CFG-028`;`TC-SBX-CFG-029`;`TC-SBX-CFG-030` | 03B | 12B /13B适用复验 | material / generation / publication / evolution安全owner |
| `TC-SBX-CFG-018` | 04B /05B /06B各消费正式后置依赖 | 12B | post-publication fail-closed不是03B单独完成 |
| `TC-SBX-CFG-019` | 09B | 12B | query degraded / no-write owner |
| `TC-SBX-CFG-020` | 10A | 12B | inbound delayed / quarantine owner |
| `TC-SBX-CFG-021` | 07C /10B /11B | 12B | handoff / relay no-rollback owner |
| `TC-SBX-CFG-022` | 08B /11C | 12B /13B适用 | cleanup / redline guard owner |
| `TC-SBX-CFG-023` | 11B /11C | 12B | maintenance partial report owner |
| `TC-SBX-ARCH-001` | 01A | 12B /14A | only-core sibling dependency |
| `TC-SBX-ARCH-002`;`TC-SBX-ARCH-003` | 03A静态absence / responsibility基础 | 12B /14A | future surface / domain leakage触发DesignReopen |
| `TC-SBX-CONF-001`;`TC-SBX-CONF-002`;`TC-SBX-CONF-003`;`TC-SBX-CONF-004`;`TC-SBX-CONF-005`;`TC-SBX-CONF-006`;`TC-SBX-CONF-007`;`TC-SBX-CONF-008`;`TC-SBX-CONF-009`;`TC-SBX-CONF-010`;`TC-SBX-CONF-011`;`TC-SBX-CONF-012`;`TC-SBX-CONF-013` | 13B after 13A identity | 13B | 当前execution blocked;缺identity 0 launch |
| `TC-SBX-COND-004` | 12B | 14C inventory | 唯一P0-C structural conditional family case,无量化claim |
| `TC-SBX-COND-001`;`TC-SBX-COND-002`;`TC-SBX-COND-003`;`TC-SBX-COND-005` | 14C只交付contract / selector / scope checks | 14C | conditional non-P0;未激活`NotRunConditional`,不得补P0 |

至此14个TC family的254条主归属均有boundary去向:237 P0-C、13 P0-Q、4 conditional。Step 7必须继续把每个boundary的required checks展开到exact suite / AC / VETO / artifact path,不得改变本表owner。

### 7.11 Implementation ledger schema与32件planned skeleton初始化规则

#### 7.11.1 实施台账入口与实例化时机

| 台账对象 | 固定路径 | Step 6结论 | Step 13实例化门禁 |
|---|---|---|---|
| 项目级implementation ledger | `projects/L4-sandbox/design-calibration/implementation_execution_ledger.md` | 作为全部实现恢复、唯一current boundary和blocker状态的权威入口 | 与正式`07`和32件skeleton同步创建;不得早建 |
| Boundary ledger根目录 | `projects/L4-sandbox/design-calibration/implementation-boundaries/` | 只容纳本Step列出的32个`CB-SBX-*`文件 | 32 /32一次性创建;不得只创建当前件 |
| 实现仓scratch ledger | `/home/aris/Projects/quantalithos-sandbox/.codex/implementation_ledger.md` | 可选本地工作区恢复入口,不能替代设计仓两级ledger | 仅在目标仓实际创建且项目规则要求时由实现侧建立 |

Step 13创建文件时必须使用真实可获得值。若design baseline、目标仓、edition / rust-version或其他Activation输入仍未固定,字段写`not_fixed` / `not_created`,项目与01A ledger保持`blocked / wait_design`;不得填示例hash、猜测版本或把`read_docs`写成已授权。只有HDO-SBX-00与01A全部现实前置关闭时,才把01A设为`pending / read_docs`。

#### 7.11.2 项目级implementation ledger schema

```md
# L4-sandbox implementation execution ledger

## Current Implementation State

| field | value |
|---|---|
| project | L4-sandbox |
| design_repo | /home/aris/Projects/quantalithos-design |
| implementation_repo | /home/aris/Projects/quantalithos-sandbox |
| implementation_repo_state | not_created |
| current_design_baseline | not_fixed |
| current_boundary | CB-SBX-01A |
| gate_status | blocked |
| gate_reason | activation prerequisites not closed |
| next_allowed_action | wait_design |
| current_recovery_point | CB-SBX-01A / activation_gate |
| last_updated_by | design_handoff |
| last_updated_at | not_recorded |

## Boundary Ledger

| boundary | design_baseline | status | last_gate | next_allowed_action | notes |
|---|---|---|---|---|---|
| CB-SBX-01A | not_fixed | blocked | activation_gate | wait_design | unique current;switch to pending/read_docs only after prerequisites close |
| <future_boundary> | not_fixed | planned | activation_gate | wait_until_current | pre-created skeleton;not authorized |

## Open Blockers

| blocker_id | boundary | source | status | design_fix_baseline | next_action |
|---|---|---|---|---|---|
```

项目级ledger还必须保留`Design Baseline History`、`Gate Transition Log`和`Handoff History`空表。空表表示尚无事实,不得预填commit、gate pass、agent、时间或验收结果。任何baseline变化都必须先阻断current boundary,更新受影响skeleton的required reads / scope / checks并重新通过Design Gate。

#### 7.11.3 Boundary skeleton schema

每个`implementation-boundaries/<boundary_id>.md`必须由本Step §7.4、§7.5、§7.6、§7.8和后续Step 7 /10 /11的已审查输入机械装配,至少包含:

```md
# <boundary_id> implementation ledger

| field | value |
|---|---|
| project | L4-sandbox |
| boundary_id | <boundary_id> |
| phase | <PH-xx> |
| design_baseline | not_fixed |
| implementation_repo | /home/aris/Projects/quantalithos-sandbox |
| status | planned |
| next_allowed_action | wait_until_current |
| direct_predecessor | <boundary-id-or-HDO-SBX-00> |
| task_ids | <IMPL-SBX-*> |
| batch_ids | <BATCH-SBX-*> |

## Required Reads
| document | required_section | status | notes |
|---|---|---|---|

## Allowed Scope
| type | path_or_rule | status |
|---|---|---|

## Forbidden Scope
| rule | status | failure_action |
|---|---|---|

## Required Checks
| check_id | command_or_assertion | required_status | actual_status | evidence |
|---|---|---|---|---|

## Gate Matrix
| gate | status | evidence | next_if_failed |
|---|---|---|---|
| activation_gate | planned | not_run | wait_until_current |
| design_gate | pending | not_run | wait_design |
| scope_gate | pending | not_run | fix_gate_failure |
| worktree_gate | pending | not_run | fix_gate_failure |
| build_gate | pending | not_run | fix_gate_failure |
| test_gate | pending | not_run | fix_gate_failure |
| evidence_gate | pending | not_run | fix_gate_failure |
| commit_gate | pending | not_run | fix_gate_failure |
| handoff_gate | pending | not_run | handoff |

## Commit Record
| field | value |
|---|---|
| planned_commit_message | pending_step_11 |
| staged_files_checked | not_run |
| commit_message_checked | not_run |
| committed_hash | not_committed |
| committed_message | not_committed |
| post_commit_status | not_run |

## Blockers
| blocker_id | gate | status | reason | next_allowed_action |
|---|---|---|---|---|
```

Skeleton不是空占位。`Required Reads`必须逐项复制§7.4,allowed / forbidden scope必须复制§7.4~§7.5,`Required Checks`由§7.5与Step 7补齐,经验复核结论来自§7.8,Commit / Handoff纪律由Step 11补齐。任何字段仍为泛化`<TBD>`时不得移交实现。

#### 7.11.4 32件planned skeleton路径与初态

| # | Boundary / skeleton path | Phase | 直接前置 | Step 13初态 | 激活时仍需检查的现实前置 |
|---:|---|---|---|---|---|
| 1 | `CB-SBX-01A` / `implementation-boundaries/CB-SBX-01A.md` | PH-01 | HDO-SBX-00 | unique current;默认`blocked / wait_design`,全部前置关闭才`pending / read_docs` | design baseline、target repo策略、edition / rust-version、core revision、git identity |
| 2 | `CB-SBX-02A` / `implementation-boundaries/CB-SBX-02A.md` | PH-02 | 01A | `planned / wait_until_current` | 01A Handoff Gate |
| 3 | `CB-SBX-02B` / `implementation-boundaries/CB-SBX-02B.md` | PH-02 | 02A | `planned / wait_until_current` | 02A Handoff Gate |
| 4 | `CB-SBX-02C` / `implementation-boundaries/CB-SBX-02C.md` | PH-02 | 02B | `planned / wait_until_current` | RFC 8785实现库 / verifier工具固定 |
| 5 | `CB-SBX-02D` / `implementation-boundaries/CB-SBX-02D.md` | PH-02 | 02C | `planned / wait_until_current` | Shell规范、lint /等价检查固定 |
| 6 | `CB-SBX-03A` / `implementation-boundaries/CB-SBX-03A.md` | PH-03 | 02D | `planned / wait_until_current` | strict schema baseline未漂移 |
| 7 | `CB-SBX-03B` / `implementation-boundaries/CB-SBX-03B.md` | PH-03 | 03A | `planned / wait_until_current` | profile / material / generation表未漂移 |
| 8 | `CB-SBX-04A` / `implementation-boundaries/CB-SBX-04A.md` | PH-04 | 03B | `planned / wait_until_current` | complete runtime assembly可供contract owner消费 |
| 9 | `CB-SBX-04B` / `implementation-boundaries/CB-SBX-04B.md` | PH-04 | 04A | `planned / wait_until_current` | resolver / UoW fake可用 |
| 10 | `CB-SBX-05A` / `implementation-boundaries/CB-SBX-05A.md` | PH-05 | 04B | `planned / wait_until_current` | Context -> active Identity -> four-dimension isolation + workspace requirement -> Boundary顺序和carrier未漂移 |
| 11 | `CB-SBX-05B` / `implementation-boundaries/CB-SBX-05B.md` | PH-05 | 05A | `planned / wait_until_current` | I039 / I040 / I041 / I065同代binding;grouped-save与exact reads闭合 |
| 12 | `CB-SBX-06A` / `implementation-boundaries/CB-SBX-06A.md` | PH-06 | 05B | `planned / wait_until_current` | immutable requirement ref可读;无Boundary反向Policy依赖 |
| 13 | `CB-SBX-06B` / `implementation-boundaries/CB-SBX-06B.md` | PH-06 | 06A | `planned / wait_until_current` | body-free policy / authorization / high-risk snapshot contract稳定 |
| 14 | `CB-SBX-07A` / `implementation-boundaries/CB-SBX-07A.md` | PH-07 | 06B | `planned / wait_until_current` | boundary / handle / persisted lease / policy exact reads与clock可用 |
| 15 | `CB-SBX-07B` / `implementation-boundaries/CB-SBX-07B.md` | PH-07 | 07A | `planned / wait_until_current` | run owner状态和capture adapter contract稳定 |
| 16 | `CB-SBX-07C` / `implementation-boundaries/CB-SBX-07C.md` | PH-07 | 07B | `planned / wait_until_current` | immutable capture refs和handoff target registry可用 |
| 17 | `CB-SBX-08A` / `implementation-boundaries/CB-SBX-08A.md` | PH-08 | 07C | `planned / wait_until_current` | run / capture / handoff markers可定位;runtime recovery仍外部 |
| 18 | `CB-SBX-08B` / `implementation-boundaries/CB-SBX-08B.md` | PH-08 | 08A | `planned / wait_until_current` | cleanup / investigation / redline guard来源完整 |
| 19 | `CB-SBX-09A` / `implementation-boundaries/CB-SBX-09A.md` | PH-09 | 08B | `planned / wait_until_current` | formal read identities / status sources稳定 |
| 20 | `CB-SBX-09B` / `implementation-boundaries/CB-SBX-09B.md` | PH-09 | 09A | `planned / wait_until_current` | typed read callable surface完整;write audit可执行 |
| 21 | `CB-SBX-10A` / `implementation-boundaries/CB-SBX-10A.md` | PH-10 | 09B | `planned / wait_until_current` | 09B Handoff Gate通过;shared marker / cursor / receipt contract稳定 |
| 22 | `CB-SBX-10B` / `implementation-boundaries/CB-SBX-10B.md` | PH-10 | 10A | `planned / wait_until_current` | consumer marker和read contract均已由前序handoff冻结 |
| 23 | `CB-SBX-11A` / `implementation-boundaries/CB-SBX-11A.md` | PH-11 | 10B | `planned / wait_until_current` | relay / marker owner汇合;job report / replay contract稳定 |
| 24 | `CB-SBX-11B` / `implementation-boundaries/CB-SBX-11B.md` | PH-11 | 11A | `planned / wait_until_current` | bounded selection / page / retry profiles稳定 |
| 25 | `CB-SBX-11C` / `implementation-boundaries/CB-SBX-11C.md` | PH-11 | 11B | `planned / wait_until_current` | reaper / cleanup / redline / projection sources可定位;no-repair guard完整 |
| 26 | `CB-SBX-12A` / `implementation-boundaries/CB-SBX-12A.md` | PH-12 | 11C | `planned / wait_until_current` | 55协议、30个owner-level state machines /31个Step 10 canonical status enum entries /39个Step 6 shared status declarations、38错误、237 P0-C owner集合冻结 |
| 27 | `CB-SBX-12B` / `implementation-boundaries/CB-SBX-12B.md` | PH-12 | 12A | `planned / wait_until_current` | 14 TXN /19 RACE / parity / source-writer工具链可执行 |
| 28 | `CB-SBX-13A` / `implementation-boundaries/CB-SBX-13A.md` | PH-13 | 12B +PH-QP | `planned / wait_until_current` | candidate ADR / revision、PROFILE-05、SBX-ENV-05、generation / template、provider / material identity全部固定 |
| 29 | `CB-SBX-13B` / `implementation-boundaries/CB-SBX-13B.md` | PH-13 | 13A | `planned / wait_until_current` | 13A immutable packet有效;缺一项仍Blocked且0 launch |
| 30 | `CB-SBX-14A` / `implementation-boundaries/CB-SBX-14A.md` | PH-14 | 13B | `planned / wait_until_current` | Shell规则 / lint、CI binding和四source角色输入固定 |
| 31 | `CB-SBX-14B` / `implementation-boundaries/CB-SBX-14B.md` | PH-14 | 14A | `planned / wait_until_current` | RFC 8785工具、九schema和source status contract稳定 |
| 32 | `CB-SBX-14C` / `implementation-boundaries/CB-SBX-14C.md` | PH-14 | 14B | `planned / wait_until_current` | 四source report packet、VETO / defect / risk schema稳定;无裁决authority |

#### 7.11.5 Planned skeleton预创建审计

| 检查项 | Step 13通过标准 | 失败处理 |
|---|---|---|
| 全量文件 | 上表32个路径全部存在且无额外未登记boundary | HDO-SBX-00失败;停在设计移交 |
| 名称稳定 | 文件名与`CB-SBX-*` ID大小写完全一致,每个ID恰有一个文件 | 修正路径与所有引用;不得用alias |
| 当前唯一 | 项目ledger只把01A列为current;01A未闭现实前置时保持`blocked / wait_design` | 清除多current /伪授权状态 |
| Future不授权 | 02A~14C全部`planned / wait_until_current` | 改回planned;不得提前读写实现仓 |
| 内容非空壳 | 每件均有exact required reads、allowed / forbidden scope、task / batch、required checks、9 gate、commit / blocker表 | 从本Step与后续已审查Step机械补齐;不得保留泛化TBD |
| 无伪事实 | baseline未固定写`not_fixed`;未执行写`not_run`;未提交写`not_committed`;无run / EV / pass / signoff | 删除伪值并登记阻断原因 |
| 顺序一致 | 前置关系与§7.1一致;`09A -> 09B -> 10A -> 10B`逐一handoff,任何时刻只有一个current | 清除并行激活或跳过前序的状态;不得用ledger算法掩盖双current |
| Blocker绑定 | HDO /01A /02C /02D /13A /13B /14A的现实前置写入对应ledger | 缺失则HDO不得通过 |

### 7.12 39 /39交付物到Commit Boundary主完成映射

`增量形成Boundary`表示该交付物在多个纵切中逐步形成;`主要完成Owner`表示首次满足Step 4完整完成判定的位置。主要完成不允许前序boundary提前宣称整体交付,也不允许12A /12B以inventory或hardening为由重写前序owner语义。

| 交付物 | 增量形成Boundary | 主要完成Owner | Boundary级完成门禁 | 审计结论 |
|---|---|---|---|---|
| `DEL-SBX-CODE-001` | 01A | 01A | 七crate / binary可识别;dependency direction与only-core sibling可机械检查 | covered |
| `DEL-SBX-CODE-002` | 02A;04A;05A;06A;07A~C;08A~B;09A;10A~B;11A | 12A | 55协议全部carrier / view / receipt / report / public error inventory与roundtrip无orphan | covered |
| `DEL-SBX-CODE-003` | 04A;05A;06A;07A~C;08A~B;09A;10A;11C | 12A | 30 owner machines /31 canonical enum entries /39 shared declarations、factory invariant、illegal / terminal迁移完整 | covered |
| `DEL-SBX-CODE-004` | 02B;04B;05B;06B;07A~C;08A~B;09A~B;10A~B;11A~C | 12A | 10 Command /13 Query /9 Consumer /10 Job application orchestration及no-write / no-repair完整 | covered |
| `DEL-SBX-CODE-005` | 02B;03A~B;04B;05B;06B;07A~C;09B;10A~B;11B~C | 12B | repository / adapter / builder与fake parity、rollback / version / cursor完整 | covered |
| `DEL-SBX-CODE-006` | 04B;05B;06B;07A~C;08A~B;09B | 12A | 23 Command / Query entry只调application且safe mapping完整 | covered |
| `DEL-SBX-CODE-007` | 04B;07A;08A;10A~B | 12A | consumer / control / fulfillment / relay worker authority、receipt / retry / quarantine完整 | covered |
| `DEL-SBX-CODE-008` | 11A~C | 12A | 10 Job runner / binary、partial report、stored replay和no-repair完整 | covered |
| `DEL-SBX-CODE-009` | 04A~11C逐协议family | 12A | 10 +13 +9 +13 +10 =55且每协议有flow / TC owner | covered |
| `DEL-SBX-CODE-010` | 02A;03A~11C逐producer / mapper | 12A | ERR-001~038命中正式producer和唯一safe surface | covered |
| `DEL-SBX-CODE-011` | 02B;04B~11C | 12B | 14 TXN、19 deterministic race、三通道replay、no-write / no-repair / no-rollback完整 | covered |
| `DEL-SBX-CODE-012` | 02A/02D;03B;04A~11C | 12B | safe log / metric / audit / receipt / report与redaction scanner全链完整 | covered |
| `DEL-SBX-CFG-001` | 03A | 03A | 单一raw owner、source selector、strict loader和safe issue可测 | covered |
| `DEL-SBX-CFG-002` | 03A;12B coverage复核 | 03A | 40组 /101项 /44域exact key / type / required / default / ref index完整 | covered |
| `DEL-SBX-CFG-003` | 03A;后序composition消费 | 03A | NCFG / FC / XVAL在builder前关闭且不静默补default | covered |
| `DEL-SBX-CFG-004` | 03B;13A消费P05资格 | 03B | P01~05 eligibility、P06 conditional、P07 DesignReopen拒绝语义完整 | covered |
| `DEL-SBX-CFG-005` | 03B;04B~13A消费complete set | 03B | complete generation、scoped snapshot、atomic publication无mixed / partial set | covered |
| `DEL-SBX-CFG-006` | 03B;13A绑定真实provider输入 | 03B | 23 material slot descriptor / lifecycle / bounded material lease且raw material无carrier | covered |
| `DEL-SBX-ADP-001` | 03B registry;04B~11C按能力补formal fake | 12B | P01~04 outcome injection、UoW / version / cursor / replay / call-budget parity完整 | covered |
| `DEL-SBX-ADP-002` | PH-QP准备;13A binding;13B消费 | 13A | 单一candidate、immutable identity、四维 / launch / capture / lease / release mapping且无fallback | covered_with_activation_blocker |
| `DEL-SBX-DATA-001` | 02A~13B逐family builder | 13B | 13类fixture / builder / controlled schedule可按seed重建且identity隔离 | covered |
| `DEL-SBX-DATA-002` | 03A~13B逐family dataset | 13B | 28 /28数据集、单主违规、namespace / barrier / scan root / cleanup disposition完整 | covered |
| `DEL-SBX-DATA-003` | 02C schema primitive;13A immutable manifest;13B probe消费 | 13A | manifest绑定candidate / profile / generation / ENV / template / provider / cleanup义务且无credential | covered_with_external_input_blocker |
| `DEL-SBX-TEST-001` | 02A~12B形成237 P0-C;13B形成13 P0-Q;14C保留4 conditional | 14C | 254主归属完整唯一,conditional不补P0 | covered |
| `DEL-SBX-TEST-002` | 02A~12B形成P0-C suite;13B形成013;14C形成conditional / final inventory | 14C | 16 /16 suite可执行或诚实Blocked / NotRunConditional | covered |
| `DEL-SBX-TEST-003` | 02D基础;11B /12B /13B形成source;14A聚合 | 14A | 7 /7 gate触发、source role、identity、顺序和Blocked传播完整 | covered |
| `DEL-SBX-TEST-004` | PH-QP准备;13A identity;13B harness | 13B | CONF-001~013、anti-substitution、redaction、cleanup disposition完整;缺identity 0 launch | covered_with_activation_blocker |
| `DEL-SBX-TEST-005` | 02B kernel;04B~11C增量;12B全量 | 12B | 14 TXN /19 RACE / replay / no-write专项可重复且不用sleep /概率 | covered |
| `DEL-SBX-AUTO-001` | 02D `run_ci`;11B operations;13B P0Q;14A全量gate入口 | 14A | 5 /5 gate脚本参数 / context writer / nonzero / blocked语义完整 | covered |
| `DEL-SBX-AUTO-002` | 02D report primitive;14B reports;14C acceptance handoff | 14C | 3 /3 report脚本只从fixed raw生成且不写裁决 /签署 | covered |
| `DEL-SBX-AUTO-003` | 02D三check;12B /13B补强;14A收口 | 14A | 9 /9 check入口、stable safe finding和阻断语义完整 | covered |
| `DEL-SBX-EVD-001` | 02C canonical primitive;03A~13B producer增量;14B收口 | 14B | 九schema、RFC 8785、sha256 self-digest、path / status fixtures完整 | covered_with_tool_blocker |
| `DEL-SBX-EVD-002` | 02A~12B形成001~016;13B形成017~019;14B形成020 /021与allocation guard | 14B | 21 /21 slot catalog;无合法raw / report pair不分配EV | covered |
| `DEL-SBX-EVD-003` | 02C writer primitive;12B /13B source writers;14B pairing | 14B | fixed-run context / suite report / stdout / stderr / checks pair与失败保留完整 | covered |
| `DEL-SBX-EVD-004` | 02D renderer primitive;14B完整renderer | 14B | run / suite / evidence human report只从fixed raw生成并回链digest | covered |
| `DEL-SBX-EVD-005` | 14C | 14C | acceptance四draft与review入口分离;无verdict / risk acceptance / signoff | covered |
| `DEL-SBX-DOC-001` | Step 1~12章节输入 | HDO-SBX-00 /设计Step 13 | 正式`07`只从已审查Step装配并在PH-01前存在 | covered_as_pre_implementation_handoff |
| `DEL-SBX-DOC-002` | Step 3 /5 /6 /后续门禁输入 | HDO-SBX-00 /设计Step 13 | 项目ledger schema、32 boundary index、open blocker与唯一current完整 | covered_as_pre_implementation_handoff |
| `DEL-SBX-DOC-003` | 本Step32 boundary定义;Step 7 /10 /11补门禁 | HDO-SBX-00 /设计Step 13 | 32 /32 skeleton非空壳,唯一current,未来全`planned / wait_until_current` | covered_as_pre_implementation_handoff |

机械闭集: 12 CODE +6 CFG +2 ADP +3 DATA +5 TEST +3 AUTO +5 EVD +3 DOC =39。39 /39均有且仅有一个主要完成Owner;DOC-001~003不进入实现commit,由HDO-SBX-00在任何PH-01动作前完成。

### 7.13 Commit boundary停审与跨Boundary审计

#### 7.13.1 32 /32 Commit boundary停审记录

本表是设计层停审,回答一句话目标、独立review /验证 /回退、闭环与门禁是否成立。`PassDesignBlockedActivation`表示boundary设计已闭合但现实前置未关闭,不得解释为实现ready或测试通过。

| Boundary | 一句话目标成立 | 独立review /验证 /回退 | 闭环与经验复核 | 提交 / Handoff门禁 | 停审结论 |
|---|---|---|---|---|---|
| `CB-SBX-01A` | 是:只建立七crate workspace与依赖图 | 是:metadata / check可独立验证并整体回退 | BASE / BOOT完整;无业务DTO / state | scope / workspace / dependency / git identity明确 | `PassDesignBlockedActivation`:HDO、baseline、目标仓策略、edition / rust-version、core revision未固定 |
| `CB-SBX-02A` | 是:冻结shared typed carrier | 是:contract roundtrip独立 | CONTRACT完整;不触发UoW | carrier suite + staged contract scope | `PassDesign` |
| `CB-SBX-02B` | 是:形成semantic persistence kernel | 是:rollback / replay / parity独立 | TXN完整;domain finder后置 | kernel tests + fake parity + no concrete flow | `PassDesign` |
| `CB-SBX-02C` | 是:形成canonical writer / verifier | 是:synthetic fixture独立 | EVIDENCE完整;无业务协议 | roundtrip / digest / path checks | `PassDesignBlockedActivation`:RFC 8785实现库 / verifier工具未固定 |
| `CB-SBX-02D` | 是:形成最小脚本安全入口 | 是:syntax / failure fixture独立 | EVIDENCE完整;脚本无业务truth | syntax / lint等价 / no-static checks | `PassDesignBlockedActivation`:Shell规则和lint工具未固定 |
| `CB-SBX-03A` | 是:严格解析40组 /101项 /44域 | 是:invalid corpus可独立验证 | CONFIG完整;不写业务UoW | CFG / ARCH negative + no implicit default | `PassDesign` |
| `CB-SBX-03B` | 是:原子发布完整runtime generation | 是:builder / material / publication共同回退 | CONFIG / MATERIAL完整 | eligibility / material / atomic publication | `PassDesign` |
| `CB-SBX-04A` | 是:冻结intake / identity contract-domain | 是:CMD / STA / ERR独立 | CONTRACT / STATE完整 | carrier / factory tests;无transaction | `PassDesign` |
| `CB-SBX-04B` | 是:打通首个accepted command纵切 | 是:resolver / UoW / entry共同构成单增量 | TXN / CONTRACT完整 | CMD / rollback / replay / race + entry mapping | `PassDesign` |
| `CB-SBX-05A` | 是:冻结active identity前置、四维coherent isolation / workspace requirement、handle / lease truth | 是:contract-domain无backend side effect | CONTRACT / STATE完整;明确无policy输入 | CMD / STA / weak-fallback / no-policy-input | `PassDesign` |
| `CB-SBX-05B` | 是:原子建立coherent boundary组 | 是:backend outcome + grouped UoW共同回退 | TXN / CONFIG / STATE完整;I065在establish消费 | unsupported / rollback / exact-read / call-budget | `PassDesign` |
| `CB-SBX-06A` | 是:冻结fail-closed policy truth | 是:contract-domain独立 | CONTRACT / STATE完整;无launch | CMD / STA / ERR / body-free | `PassDesign` |
| `CB-SBX-06B` | 是:持久化Policy decision纵切 | 是:summary snapshot + UoW + entry共同验证 | TXN / CONFIG完整;只读前序requirement | duplicate / stale / mismatch / backend dependency=0 | `PassDesign` |
| `CB-SBX-07A` | 是:守卫后启动controlled run | 是:launch truth与call budget可独立验证 | CONTRACT / STATE / TXN完整;exact boundary -> handle -> lease + policy | inactive / expired / denied call=0;race / replay | `PassDesign` |
| `CB-SBX-07B` | 是:诚实保存body-free capture | 是:capture side effect与truth同回退单元 | CONTRACT / STATE / TXN / MATERIAL完整 | complete / partial / failed / no-body | `PassDesign` |
| `CB-SBX-07C` | 是:形成handoff owner truth | 是:delivery outcome不回滚capture | CONTRACT / STATE / TXN完整 | retryable / failed / source unchanged | `PassDesign` |
| `CB-SBX-08A` | 是:形成control与failure single truth | 是:unknown / conflict / race可独立验证 | CONTRACT / STATE / TXN / SAFETY完整 | conflict / unknown / replay / no runtime recovery | `PassDesign` |
| `CB-SBX-08B` | 是:闭合cleanup / redline destructive guard | 是:guard与release adapter同一回退单元 | CONTRACT / STATE / TXN / SAFETY完整 | non-Allowed release=0 / no early delete | `PassDesign` |
| `CB-SBX-09A` | 是:冻结13 Query read contract | 是:carrier / lookup / marker独立 | CONTRACT / QUERY完整;无write | QRY schema / empty / no-scan / no-write surface | `PassDesign` |
| `CB-SBX-09B` | 是:完成13 Query service / API | 是:RACE-019与write audit可独立验证 | QUERY完整;不reserve /不repair | QRY-001~026 + write set=0 | `PassDesign` |
| `CB-SBX-10A` | 是:完成9 Consumer纵切 | 是:dedup / receipt / marker共同回退 | CONTRACT / TXN / CONSUMER完整 | CNS-001~022 / rollback / quarantine | `PassDesign`;只在09B handoff后激活 |
| `CB-SBX-10B` | 是:完成13 Event no-rollback relay | 是:stored payload / relay / publisher共同回退 | CONTRACT / TXN / RELAY完整 | EVT-001~015 / race / topic / source unchanged | `PassDesign` |
| `CB-SBX-11A` | 是:冻结10 Job shared kernel | 是:typed input / report / replay独立 | CONTRACT / TXN / JOB完整 | common JOB / duplicate report / no concrete side effect | `PassDesign` |
| `CB-SBX-11B` | 是:完成四类collaboration jobs | 是:marker / relay / handoff owner一致 | TXN / JOB / RELAY完整 | JOB-001~004 / partial / no rollback | `PassDesign` |
| `CB-SBX-11C` | 是:完成六类safety / read jobs | 是:五个高风险batch分段验证后共同回退 | TXN / JOB / SAFETY / QUERY完整 | JOB-005~010 / SUITE-012 / no repair | `PassDesign` |
| `CB-SBX-12A` | 是:冻结协议 /状态 /错误 / P0-C inventory | 是:inventory与缺口修复同一baseline | CONTRACT / STATE完整 | 55 /30 owner machines /31 enum entries /39 shared declarations /38 /237 exact owner checks | `PassDesign` |
| `CB-SBX-12B` | 是:冻结P0-C一致性与source writer能力 | 是:六批独立验证后统一hardening回退 | TXN / EVIDENCE / QUERY / JOB / RELAY完整 | 14 TXN /19 RACE / parity / checks / pairing | `PassDesign` |
| `CB-SBX-13A` | 是:固定不可替换candidate identity | 是:identity / adapter / zero-launch preflight独立 | CONFIG / MATERIAL / CANDIDATE完整 | anti-substitution / credential no-store / call=0 | `PassDesignBlockedActivation`:candidate、ENV-05、generation / template、provider / material identity未固定 |
| `CB-SBX-13B` | 是:执行13 CONF harness并产诚实source | 是:probe / teardown / writer共享identity | CANDIDATE / SAFETY / EVIDENCE完整 | CONF-001~013 / redaction / cleanup disposition | `PassDesignBlockedActivation`:13A全部输入与dedicated environment未形成 |
| `CB-SBX-14A` | 是:收口7 gate /9 check语义 | 是:selector / status / source order整体回退 | EVIDENCE完整;不触发业务state | failure fixture / role / order / identity / Blocked传播 | `PassDesign`;CI binding仍为开工前置 |
| `CB-SBX-14B` | 是:收口九schema /21 slot / renderer | 是:schema、pairing、renderer共同验证 | EVIDENCE完整;无verdict authority | roundtrip / pairing / no static EV / redaction | `PassDesign`;RFC 8785工具在02C前关闭后复用 |
| `CB-SBX-14C` | 是:生成无裁决acceptance handoff drafts | 是:四draft / review entry / scope audit共同回退 | EVIDENCE完整;明确无签署权 | 254 /16 /7 inventory + no verdict / no signature | `PassDesign` |

停审闭集: 32 /32一句话目标成立,32 /32可独立review /验证 /必要时回退,32 /32有required reads、allowed / forbidden scope、batch、required checks、Commit Gate和Handoff Gate输入。5个boundary为`PassDesignBlockedActivation`(`01A /02C /02D /13A /13B`);其余27个为`PassDesign`。这不是实现授权或门禁执行结果。

#### 7.13.2 跨Boundary粒度 /依赖 /门禁审计

| 审计项 | 检查范围 | 结论 | 缺口 /修正 |
|---|---|---|---|
| Boundary闭集 | §7.1 / §7.4~§7.8 / §7.11 | passed:32个ID唯一,路径唯一 | 无额外boundary;Step 13不得增删ID |
| 单current纪律 | 全拓扑 / ledger schema | passed after correction | 已把09B与10A并行改为`09A -> 09B -> 10A -> 10B`;任何时刻只激活一个boundary |
| Phase顺序 | PH-01~14 / PH-QP | passed | PH-QP仅准备材料,不形成实现commit;13A显式消费 |
| 后序依赖泄漏 | 04A~08B核心写链 | passed after writeback | Boundary不再消费后序Policy;Policy消费requirement;Run同时消费boundary / handle / persisted lease / Accepted policy |
| Lease owner / Run guard | 05A /05B /07A /配置I065 | passed after writeback | I065由generation-scoped backend adapter在boundary establishment消费并保存window;Run只exact-read /校验,不重算 |
| Query / Consumer顺序 | 09A~10B | passed after correction | 09B先证明no-write,再激活10A;10B只消费已冻结read / marker / receipt契约 |
| 粒度过细 | 32 boundary | passed | 无单文件 /单struct /单函数 /日工作量boundary |
| 粒度过粗 | 03A~B;10A~B;11C;12B;13B;14A~C | passed_with_batch_control | 受控偏大项均拆为3~6个100~300行batch;单批>300继续拆,>500禁止 |
| 高风险批次 | state / TXN / race / idempotency / safety / evidence / candidate | passed | 高风险逻辑均有独立batch与targeted check,未全部后置到12B /14A |
| Required reads | §7.4 32行 | passed | 每个boundary均绑定正式章节与calibration /标准;实现不得只读本计划 |
| Allowed / forbidden scope | §7.4 / §7.5 | passed | 每个boundary均有路径与行为双重scope;禁止后序功能、truth越权和伪事实 |
| Commit时机 | §7.3 / §7.5 / §7.7 | passed | 一boundary一commit;所有batch与checks完成且staged scope干净后才commit |
| Handoff时机 | §7.3 / §7.11 | passed | 真实hash / message / post-status回写后才唯一激活下一boundary;当前未产生hash |
| 经验复核 | §7.2 / §7.8 | passed_design | 32 /32有适用经验、证据、不适用理由、结论与失败回写;5项现实前置保留阻断 |
| 测试归属 | §7.5 / §7.10 | passed_for_step_6 | 55协议、30个owner-level state machines /31个Step 10 canonical status enum entries /39个Step 6 shared status declarations、38错误、14 TXN、19 RACE及254 TC family均有owner;exact suite / AC / VETO由Step 7展开 |
| Evidence归属 | §7.5 / §7.10 / §7.12 | passed_for_step_6 | source writer、九schema、21 slot、pairing、renderer和draft owner明确;无EV / pass实例 |
| 交付物覆盖 | §7.12 | passed:39 /39 | 每项唯一主要完成Owner;DOC-001~003归HDO,不伪装实现commit |
| Planned skeleton完整性 | §7.11 | passed_as_schema | 32路径、初态、9 gate、commit / blocker表和非空壳规则完整;实例仍禁止到Step 13 |
| 上游动态回写 | 正式`03/04`;02 /03 /04 /05 calibration | resolved | `SBX-IMP-BOUNDARY-POLICY-CYCLE-001`及lease owner / run guard已回写;未改变55协议、30个owner-level state machines /31个Step 10 canonical status enum entries /39个Step 6 shared status declarations、38错误、101配置项或254 TC计数 |
| 现实前置绑定 | HDO /01A /02C /02D /13A /13B /14A | passed_as_open_blockers | design baseline、目标仓 /版本、core revision、RFC 8785、Shell、candidate / provider / ENV-05 / material、CI仍诚实开放 |
| 伪事实扫描 | 全Step | passed | 未创建代码、implementation commit、run_id、EV alias、测试结果、验收结论、风险接受或签署 |

跨boundary审计没有阻塞Step 6设计收口的unresolved冲突。开放项均已绑定未来Activation / Design Gate,不允许把`open_before_*`改写为ready。

---

## 8. 正式`07` §6回填草稿

Step 13装配正式`07-实施计划.md`§6时必须从本Step机械回填,不得压缩为phase摘要或新增未经审查的boundary。正式章节至少包含:

1. 32个commit boundary总索引和严格串行拓扑,含HDO-SBX-00与PH-QP非commit说明。
2. 每phase任务表、编写顺序和108个代码批次的目标、输入、预计规模、批后验证及commit归属。
3. Boundary Gate Matrix:一句话目标、required reads、allowed / forbidden scope、required checks、Commit Gate、Handoff Gate和commit时机。
4. 逐boundary子功能分组、设计闭环Profile、经验复核和粒度判断。
5. 55协议、30个owner-level state machines /31个Step 10 canonical status enum entries /39个Step 6 shared status declarations、38错误、14 TXN、19 RACE、254 TC family与39交付物owner索引。
6. implementation ledger schema、32件planned skeleton路径 /初态和单current推进规则。
7. 开放前置与暂停口径:设计baseline、目标仓 /版本、core revision、RFC 8785、Shell、candidate / ENV-05 / provider / material、CI和retention物理策略。

正式§6必须显式保留以下关键规则:

```text
Context -> Boundary -> Policy -> Run
I065 lease profile -> generation-scoped boundary establishment -> persisted bounded lease
Run guard -> exact boundary -> handle -> lease reads + Accepted policy -> backend launch
CB-SBX-09A -> CB-SBX-09B -> CB-SBX-10A -> CB-SBX-10B
one current boundary -> one verified commit -> one handoff -> activate next
```

Step 13可以调整正式排版和交叉引用,不得改变boundary ID、顺序、owner、scope、门禁、blocked activation或无伪事实口径。Step 7~11只允许补充exact test / acceptance gate、环境 /风险、回退与commit message纪律,不得静默重切boundary。

---

## 9. Blocker、待确认事项与上游影响

### 9.1 本Step已解决的设计冲突

| Blocker ID | 状态 | 冲突 | 本Step修正 | 计数 /范围影响 |
|---|---|---|---|---|
| `SBX-IMP-BOUNDARY-POLICY-CYCLE-001` | resolved_by_07_step_6_writeback | Boundary establishment原消费后序policy snapshot / decision,形成PH-05 -> PH-06循环 | 回写概要对象 /接口 /flow、详细对象 /port /协议 /flow /持久化 /配置绑定 /测试切口,固定Boundary只消费context / active identity /四维隔离requirements + workspace requirement / generation-scoped profile / capability;Policy后序消费requirement | 不改变14 phase、32 boundary、55协议、30个owner-level state machines /31个Step 10 canonical status enum entries /39个Step 6 shared status declarations、38错误 |
| `SBX-IMP-LEASE-RUN-GUARD-001` | resolved_by_07_step_6_writeback | 配置材料曾把I065表达为launch时消费,详细设计缺少Run exact handle / lease读取surface | 固定I065在boundary establishment由同代backend adapter消费并保存bounded lease;新增正式repository exact reads和domain active / expiry guards;Run不得scan latest或从current config重算window | 不新增协议 /配置项 /状态 /TC;只闭合既有owner与callable surface |
| `SBX-IMP-BOUNDARY-SERIAL-001` | resolved_in_07_step_6 | `09B`与`10A`有限并行会违反项目ledger单current约束 | 线性化为`09A -> 09B -> 10A -> 10B`;后序只可预读材料 | boundary数量仍为32 |

### 9.2 开放但不阻塞Step 6审查的现实前置

| 前置 / blocker | Exact boundary / gate | 当前状态 | 未关闭时处理 |
|---|---|---|---|
| design commit baseline与HDO-SBX-00 | HDO /01A Activation | open_before_handoff | `blocked / wait_design`;不得开目标仓 |
| 目标仓策略、edition / rust-version、core revision、git identity | 01A Activation / Design | open_before_bootstrap | 01A保持blocked |
| RFC 8785实现库 / verifier | 02C Activation / Design;14B复用 | open_before_schema_writer | 不得用`jq`或命令存在性代替canonical fixture证明 |
| Shell规范、lint /等价检查 | 02D Activation / Design;14A复用 | open_before_script | script boundary不得开工 |
| candidate ADR / revision、PROFILE-05、SBX-ENV-05、generation / template、provider / material identity | 13A Activation | open_before_p0q | 13A /13B保持Blocked且0 launch |
| dedicated environment与13A immutable packet | 13B Activation | open_before_probe | 不执行CONF,不生成P0-Q source |
| CI provider / binding | 14A Activation / Step 8 | open_before_ci_binding | 可验证script fixture,不得宣称CI已接入 |
| retention物理介质 /数值策略 | Step 8 /9 / future `09` | open_conditional | 继续遵守condition-based guard,不发明TTL |

当前没有阻塞Step 6设计停审的上游blocker。上述事项阻塞对应future implementation boundary或真实执行,不阻塞用户审查本Step。

---

## 10. 自检、停审与进入Step 7条件

| 自检项 | 结果 |
|---|---|
| Step 6 SOP 32项问题是否全部回答 | 通过,32 /32 |
| phase是否全部有任务、顺序、batch和boundary | 通过,14 /14 phase;62 task;108 batch;32 boundary |
| 每个boundary是否一句话、独立review /验证 /回退 | 通过,32 /32 |
| 每个boundary是否有required reads、scope、checks、Commit / Handoff Gate | 通过,32 /32 |
| 每个boundary是否有子功能分组、经验复核和粒度判断 | 通过,32 /32 |
| 是否完成逐boundary停审 | 通过,32 /32;5项保留blocked activation |
| 是否完成跨boundary粒度 /依赖 /门禁审计 | 通过,无unresolved设计冲突 |
| 是否保持单current | 通过,已线性化09A -> 09B -> 10A -> 10B |
| 上游Boundary / Policy / Run / lease闭环是否单向可落码 | 通过,冲突已回写owner材料并登记resolved |
| 39交付物、55协议、30个owner-level state machines /31个Step 10 canonical status enum entries /39个Step 6 shared status declarations、38错误和测试owner是否无orphan | 通过 |
| implementation ledger与32 skeleton是否已实例化 | 否,按纪律留待Step 13与正式`07`同步创建 |
| 是否写入正式`07`或进入Step 7 | 否 |
| 是否创建实现代码、commit、run、EV、结果、结论或签署 | 否 |

本Step已完成停审并经用户确认,由Step 7承接。正式`07`、implementation ledger实例、32件boundary skeleton和目标实现仓仍不得在Step 7创建。

```text
step_6_result = completed_reviewed_passed_to_step_7
current_document = `07-实施计划.md`
current_step = Step 6 `拆分阶段任务、编写顺序与提交边界`
current_module = `implementation_tasks_commit_boundaries_reviewed`
gate_status = passed_to_step_7
next_allowed_action = 由`07_implementation_plan_step_07_test_acceptance_gates.md`承接;不得跳到Step 8
phase_count = 14
commit_boundary_count = 32
task_count = 62
batch_count = 108
deliverable_owner_count = 39
formal_07_created = no
implementation_ledger_created = no
planned_boundary_skeleton_created = no
implementation_repo_exists = no
commit_required = no
```
