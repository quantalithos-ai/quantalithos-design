# Step 6. 拆分阶段任务、编写顺序与提交边界

> 对应 SOP：`standards/document/实施计划讨论流程_SOP.md` Step 6
> 回填章节：`07-实施计划.md` §6 阶段任务拆分、编写顺序与提交边界
> 执行模式：`full-restart + single-agent-serial`
> 粒度参考：`projects/L1-governance/design-calibration/07_implementation_plan_step_06_tasks_commit_boundaries.md`

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 6 · 拆分阶段任务、编写顺序与提交边界 |
| 当前状态 | `done / pass / self_reviewed`（设计层；不是实现或测试结果） |
| 输入基线 | Step 5 `PH-01～PH-08`；正式 `03-详细设计.md`、`04-配置设计.md`、`05-测试方案.md`、`06-验收标准.md`；实施计划/台账/可落码性规范 |
| 正式 07 写入 | `false`；Step 13 full-restart 前不得创建或修改正式文件 |
| 实现移交 | `blocked / wait_design`；目标仓不存在，exact owner/SDK/host contract 与 immutable baseline 未固定 |
| 本步输出 | phase 任务表、代码批次、22 个 planned commit boundary、开工前设计闭环复核、经验复核、boundary 停审和跨 boundary 审计 |
| 下一动作 | 停审并等待用户明确授权 Step 7；授权后先重读本台账、07 flow、本文件和 Step 7 SOP/书写规范 |

本 Step 的 boundary、任务、批次、检查和 commit message 全部是 future planned contract；不表示目标仓、源码、测试、artifact、report、evidence、commit 或实现 ledger 已存在。

## 2. 本步输入

| 输入 | 读取范围 | 本步用途 | 当前事实 |
|---|---|---|---|
| Step 5 阶段顺序 | `07_implementation_plan_step_05_phases_dependencies.md` §7～§12 | 定义八个 phase 的任务归属和先后依赖 | 设计层通过；实施未开始 |
| 详细设计 | `03-详细设计.md` §4～§17 及 Step 6～17 calibration | 提供模块、对象、Port、5+16+1、状态、carrier、错误、并发与暂停条件 | formal stop review；exact owner surface pending |
| 配置设计 | `04-配置设计.md` §3～§13 | 提供四项配置、三 profile、strict/startup-only/fail-closed | formal stop review；未绑定 runtime |
| 测试方案 | `05-测试方案.md` §3～§14 | 提供 96 TC、suite、artifact/report/evidence 和失败/重跑口径 | planned/not_created；未执行 |
| 验收标准 | `06-验收标准.md` §5～§14 | 提供 AC、AR、IFG、ST/TX/CC、NFR、VETO 和 evidence 上限 | future contract；当前 `not_evaluated` |
| 实施规范 | 07 SOP、书写规范、代码实施台账规范、可落码性标准 §九 | 提供批次规模、提交、台账、经验复核和 handoff 规则 | 已读取；不生成实现事实 |

## 3. SOP 问题回答

| 问题 | 本项目结论 |
|---|---|
| 1. 每个阶段有哪些实施动作？ | PH-01 建 package/config/gate skeleton；PH-02 建 entry/access/navigation shell；PH-03 建 safe views 与 8 Core Query；PH-04 建 intent/state 与 5 Command safety；PH-05 建八主题 owner partition；PH-06 建 recovery/a11y/diagnostics；PH-07 建 narrow adapters 与 conditional invalidation；PH-08 建 release/report/evidence/handoff generator。详见 §7。 |
| 2. 每个任务的输入、输出、完成判定？ | 每个 phase 的任务表逐项给出正式章节输入、planned 输出和 blocking/conditional 完成判定；未闭口合同的正向任务只能标 `blocked / wait_design`。 |
| 3. 阶段内代码按什么顺序？ | 固定为：读取台账与 required reads → Design/Scope Gate → public safe contract/ref/reason → test fixture/ledger → pure state/mapper → consumer-owned Port → local composition → adapter/host binding → script/report → gate evidence → Commit/Handoff Gate。不得先写 owner adapter 或用例最后补。 |
| 4. 是否先锁外部契约和测试切口？ | 是。每个 boundary 的首批必须锁定正式 03/05/06 引用、safe input/output、状态名和测试切口；exact owner/SDK 不闭口时先实现 no-call/blocked/fake safety，不补 schema。 |
| 5. 哪些任务同提交、哪些分开？ | 同一可验证增量的 contract + pure mapper/state + targeted tests 可同提交；跨 phase、跨 owner truth、release evidence 与业务模块必须分开。命令、状态、并发、redaction、report pairing 等高风险面各自成 boundary 或独立批次。 |
| 6. 何时可以/不能 commit？ | 只有当前 boundary 的真实实现仓存在、Design/Scope/Worktree/Build/Test/Evidence Gate 按适用项通过、staged scope 与 message 检查完成且用户授权提交时才可 commit。本轮不提交。任何 `blocked`/`pending` gate 不得提交。 |
| 7. 提交前必须执行哪些测试？ | 依 boundary 运行 `05` 已命名的 `console-*` suite/check；并执行适用的 TypeScript/package check（命令待目标仓 authority）、`git diff --check`、redaction/pairing/no-static 或结构检查。计划中的命令不代表已执行。 |
| 8. 是否有过大/过小 boundary？ | 不按 struct、函数或文件拆；大面按可验证子能力拆为 22 个 boundary。`commit-03-c`、`commit-05-c`、`commit-07-c`、`commit-08-c` 仍可能偏大，已用代码批次拆分并要求同 boundary 内逐批 gate。 |
| 9. 如何防止无关修改混入？ | 每个 boundary 固定 allowed/forbidden scope、目标仓相对路径、`git status --short`/staged diff 复核；设计仓用户改动不纳入实现提交，任何跨项目文件均阻断。 |
| 10. 每个 boundary 能否一句话描述？ | 可以；§7.3～§7.10 的 boundary 表均给出一句话目标与 planned commit message。 |
| 11. 能否独立 review/验证/回退？ | 可以按 safe contract、state、composition、script 或 evidence seam 独立 review；若 boundary 的 required design source 未闭口，则独立状态为 `blocked / wait_design`，不得通过“临时实现”强行回退。 |
| 12. 是否存在超过 300/500 行批次？ | Query composition、topic page、adapter registry、release generator 可能超过 300 行，均拆为多个 `BATCH-*`；预计超过 500 行的批次禁止形成单批。 |
| 13. 哪些动作必须拆批？ | 8 Core Query、8 Topic Query、5 Command state/dispatch、carrier/concurrency、recovery/a11y、adapter family、invalidation、artifact/report/evidence generator 均按安全切片拆批；不引入 Event/Job 批次。 |
| 14. 哪些高风险逻辑单独批次？ | access disclosure、Query no-write、submit/unknown/no-replay、whole-record carrier、single-flight/late-drop、owner partition isolation、redaction、config fail-closed、report pairing/no-static-evidence 单独批次。 |
| 15. 每批完成后执行什么门禁？ | 批次级 pure contract/module-flow/port-adapter/controlled-composition/recovery/a11y/redaction/architecture 或 release check；必要时生成同 run raw/report。未有真实 run 时只保留 planned。 |
| 16. 批次与 boundary 关系？ | 一个 boundary 可包含少数强相关批次；批次先过 gate，boundary 再做 staged scope、message、Evidence/Handoff Gate。批次不能跨 boundary 偷渡后续能力。 |
| 17. 开工前复核什么？ | 字段/DTO 构造、状态、ref identity、validation truth、scope/visibility/safe-field、carrier/side effect、artifact materialization、phase boundary；详见 §8。 |
| 18. 发现 03/05/06 冲突怎么办？ | 暂停当前 boundary，记录 blocker，回写拥有真相的正式文档和 calibration，固定新 design baseline 后重新复核；不得通过调整代码或 fake 选边。 |
| 19. boundary 内哪些子功能必须同提交？ | 只有共同形成同一可观察增量的子功能同提交，例如 mapper + no-write ledger + mapper tests，或 report generator + pairing checker；跨 owner/phase 的功能不合并。 |
| 20. 每个 boundary 是否明确不包含？ | 是。每个 boundary 表列出 forbidden scope 和“不包含”，特别排除后续 Topic、positive adapter、invalidation、release evidence 或任何服务端单元。 |
| 21. 涉及哪些设计面？ | 各 boundary 在 §9 标出 command/query/state/persistence/idempotency/evidence；Event、Job、outbox、projection 在 Console boundary 中统一 `not_applicable`，并说明理由。 |
| 22. 触发哪些 §九经验项？ | 按 boundary 触发字段/DTO/Query response/ref-scope/validation/config/carrier/idempotency/artifact/phase boundary 等适用项；Event/Job/outbox/projection 仅在明确不适用时写理由。 |
| 23. 经验项是否有正式证据位置？ | 设计层均给出 `03`/`04`/`05`/`06` 章节或 calibration 入口；exact owner、reconcile、browser/AT、diagnostic、carrier medium 缺口标为 `blocked_for_positive`。 |
| 24. 哪些经验项不适用？ | DB/repository/UoW、projection rebuild、outbox source、Event/Job public surface 对所有 Console boundary 不适用，因为正式 03 明确 0 Event/0 Job 且无服务端 truth；每个 boundary 的理由仍在经验表列明。 |
| 25. 是否有 blocker？ | 有且已编号：`BLK-CON-07-001~003`、`RES-CON-07-001~002` 与 `CON-Q-034～047`。它们被显式写入 boundary 状态和下一动作，不被标成 pass。 |
| 26. blocker 是否必须回写 baseline？ | 是。任何 blocker 修复需回写正式真相源/校准文件并固定新 baseline；设计者重复核，同一 boundary 不得沿用旧结论。 |
| 27. 实现 agent 只做什么二次校验？ | 核对目标仓 HEAD、design baseline、required reads、allowed scope、真实 package/build/test 命令、台账 gate 与用户改动保护；不一致即暂停并回报文件/章节/影响。 |
| 28. 每个 boundary 的 ledger 路径？ | `projects/L5-console/design-calibration/implementation-boundaries/<boundary_id>.md`；当前不创建，Step 6 完成并经后续规定时点后才预创建。 |
| 29. allowed/forbidden scope 如何写？ | 用目标实现仓相对路径和明确规则，例如 `src/views/**` allowed、`src/repository/**` forbidden；设计仓只允许本项目 calibration/ledger 变更。 |
| 30. required checks/Commit/Handoff Gate？ | required checks 指正式 suite、package check、diff/redaction/pairing 等；Commit Gate 指 staged scope/message/whitespace/required checks；Handoff Gate 指真实 hash、剩余 blocker、未跑检查、下一 boundary。 |
| 31. boundary 完成后停审？ | 是；每个 boundary 必须检查一句话目标、独立 review/验证/回退、批次同属关系、设计闭环和 gate 证据。planned 设计停审不等执行通过。 |
| 32. 全部 boundary 如何审计？ | §11 检查依赖顺序、phase 越界、粒度、测试重复/遗漏、证据归属、批次规模、提交时机和 0 Event/0 Job 红线；当前设计层通过但实现移交仍 blocked。 |

## 4. 当前文档问题诊断

| 问题 | 影响 | 本 Step 处理 |
|---|---|---|
| Step 5 只有 phase，没有 boundary | 实现者无法按 review/回退粒度推进 | 为八个 phase 拆出 22 个 planned boundary |
| 旧参考容易把 Console 当服务端 | 会引入 DB、repository、projection、outbox、Event、Job | 所有 boundary 明确 `not_applicable/forbidden` |
| 5+16+1 surface 横跨模块 | 单一大提交无法独立验证 | 按安全纵切、状态、组合和 adapter family 拆批 |
| exact owner/SDK surface 未闭口 | 正向实现会猜造 schema | positive boundary 标 `blocked_for_positive`，先收 safety/no-call |
| 测试和 evidence 可能被推迟 | release 末端才发现无证据链 | 每个 boundary 预绑定 suite/check、artifact/report 方向 |
| implementation ledger 时机容易提前 | 会伪造实现状态或 future boundary | 本 Step 只定义路径/规则；不创建 ledger/skeleton |

## 5. 改动前后对比

| 项 | 本 Step 前 | 本 Step 后 | 目的 |
|---|---|---|---|
| 任务粒度 | 只有 phase 能力描述 | 每个 phase 有 task、batch、boundary、门禁和停审 | 可执行、可 review、可回退 |
| 提交粒度 | 未定义 | 22 个稳定 `commit-XX-*` boundary | 避免文件级碎片或 phase 大包 |
| 编写顺序 | 可能先写对象/adapter | contract/fixture → state/mapper → Port → composition → adapter → evidence | 防止实现侧补设计 |
| 经验复核 | 可能由实现者现场发现 | 设计者逐 boundary 预审；缺口回写真相源 | 提前阻断 schema/状态漂移 |
| 证据责任 | 只在 PH-08 汇总 | boundary 从开始就定义 future artifact/report 归属 | 防静态 evidence 与 run mismatch |
| 实施台账 | 仅有路径概念 | 固定每个 boundary 的 future path、allowed/forbidden、Gate/Handoff 字段 | 为后续移交准备，不伪造当前文件 |

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 每个模块一个 commit | 文件落点直观 | 不能独立验证安全纵切，易跨 owner 混杂 | 不采用 |
| 每个 phase 一个 commit | 管理简单 | PH-03～PH-07 过大，状态/并发/证据难 review | 不采用 |
| 按可验证子能力拆 22 个 boundary | 便于 gate、回退和 blocker 定位 | 表格较长，需要维护边界台账 | 采用 |
| 复制 Governance 的 contracts/domain/service/repository/jobs 顺序 | 参考粒度完整 | 与 TypeScript 客户端和 0 Event/0 Job 冲突 | 不采用 |
| 真实 owner integration 先行 | 可快速展示页面 | 合同未闭口会猜 schema、绕过 fail-closed | 不采用 |
| fake/disabled safety 先行，positive 后置 | 可先验证负向、语义和静态红线 | positive 集成延后 | 采用 |
| 每个 boundary 生成正式 EV | 追溯细但易把候选伪造成结果 | 与 fixed-run 资格冲突 | 不采用；只保留 future raw/report/candidate 计划 |

## 7. 结构化中间产物

### 7.1 通用编写顺序与批次规则

```text
read project/boundary ledger
  -> Design Gate / Scope Gate
  -> public safe contract + refs + reason keys
  -> deterministic fixture / call ledger / scheduler
  -> pure state / mapper / guard
  -> consumer-owned narrow Port
  -> local composition / semantic binding
  -> approved adapter slot or disabled posture
  -> targeted suite/check and same-run artifact/report (future)
  -> Evidence Gate / Commit Gate / Handoff Gate
```

| 批次规则 | Console 适配 |
|---|---|
| 默认规模 | 每批约 100～300 行；仅为 planned estimate，不代表实际代码已存在 |
| 超过 300 行 | 拆为多个 `BATCH-*`，每批先跑对应 planned suite/check |
| 超过 500 行 | 强制拆分；状态、并发、redaction、evidence generator 即使较小也单独批次 |
| 高风险批次 | access disclosure、Query no-write、submit unknown/no-replay、carrier ambiguity、partition isolation、a11y equivalence、config fail-closed、report pairing 独立批次 |
| 不适用面 | Event、Job、outbox、DB、repository、UoW、projection、worker、BFF 不形成批次；若实现仓出现即 architecture blocker |
| 证据 | planned batch 可定义 raw/report 路径；只有真实固定 run 才能生成 artifact/report/evidence instance |

### 7.2 Boundary 编号、message 与台账规则

| 规则 | 约定 |
|---|---|
| 编号 | `commit-<phase>-<letter>`，例如 `commit-03-a`；编号稳定，不因标题润色改变 |
| planned ledger | `projects/L5-console/design-calibration/implementation-boundaries/<boundary_id>.md`；Step 6 只定义路径，后续规定时点一次性预创建 |
| 项目 ledger | `projects/L5-console/design-calibration/implementation_execution_ledger.md`；正式 07 装配/实现移交准备时创建，当前不存在 |
| future status | `status=planned`、`next_allowed_action=wait_until_current`；不得写 `pass` 或真实 hash |
| planned commit message | 英文 Conventional Commit 形态 `feat(console): <imperative subject>`、`test(console): ...` 或 `chore(console): ...`；只是计划，不执行 |
| commit 时机 | 当前 boundary 所有适用 Gate 通过、staged scope/message/diff check 通过并有用户授权时；本轮不提交 |
| blocked 时机 | 任一设计缺口、目标仓缺失、required contract 未闭口、gate pending/failed 或 evidence 不合格时，`wait_design/fix_gate_failure`，不得 commit |
| Handoff | 真实 commit hash、未关闭 blocker、未跑检查、下一 boundary、用户改动保护均需写回；未有 hash 时保持 pending |

### 7.3 Planned boundary 总表

| Phase | Boundary | 一句话目标 | planned message |
|---|---|---|---|
| PH-01 | `commit-01-a` | 建立 TypeScript/ESM package、strict config 入口和 profile 骨架 | `chore(console): establish package and config skeleton` |
| PH-01 | `commit-01-b` | 建立 gate/check/report、fixture、artifact/report 路径壳 | `chore(console): establish gate and evidence path skeleton` |
| PH-02 | `commit-02-a` | 建立 entry/access context shell 与 disclosure ceiling | `feat(console): establish guarded access shell` |
| PH-02 | `commit-02-b` | 建立 navigation selection、history、cleanup 与 semantic route binding | `feat(console): establish guarded navigation shell` |
| PH-03 | `commit-03-a` | 建立 safe material、source axes 与 view mapper contracts | `feat(console): establish safe view mapping` |
| PH-03 | `commit-03-b` | 落地前四个 Core Query 的 zero-write presentation seam | `feat(console): add core query read seam` |
| PH-03 | `commit-03-c` | 落地后四个 Core Query、safe link/reconcile/activation seam | `feat(console): complete core query read seam` |
| PH-04 | `commit-04-a` | 建立 draft、preference、discard 与 local command phase | `feat(console): establish local intent phase` |
| PH-04 | `commit-04-b` | 建立 controlled submit、receipt/result/unknown 与 no-replay seam | `feat(console): establish controlled submit safety` |
| PH-04 | `commit-04-c` | 建立 scoped whole-record carrier、single-writer 与 race guards | `feat(console): establish scoped client state safety` |
| PH-05 | `commit-05-a` | 建立八主题 descriptor、activation ceiling 与 canonical owner registry | `feat(console): establish topic activation boundaries` |
| PH-05 | `commit-05-b` | 建立八主题 partition query composition 与局部失败隔离 | `feat(console): compose owner topic partitions` |
| PH-05 | `commit-05-c` | 建立 strict empty、page semantics、filter/window 与 a11y page composition | `feat(console): establish topic page composition` |
| PH-06 | `commit-06-a` | 建立 typed degradation、immutable recovery plan 与 subject ceiling | `feat(console): establish recovery safety` |
| PH-06 | `commit-06-b` | 建立视觉/键盘/AT semantic equivalence 与 focus/announce fallback | `feat(console): establish semantic accessibility paths` |
| PH-06 | `commit-06-c` | 建立 body-free diagnostic context、redaction 与 sink isolation | `feat(console): establish diagnostic isolation` |
| PH-07 | `commit-07-a` | 建立 adapter registry、availability 和 approved slot posture | `feat(console): establish formal adapter registry` |
| PH-07 | `commit-07-b` | 绑定 query/command/reconcile/link/activation narrow adapters（合同允许时） | `feat(console): bind approved formal adapters` |
| PH-07 | `commit-07-c` | 建立 disabled/conditional invalidation 与 controlled runtime composition | `feat(console): establish conditional invalidation safety` |
| PH-08 | `commit-08-a` | 建立 gate orchestration、pairing、redaction、dependency check shell | `chore(console): establish release gate shell` |
| PH-08 | `commit-08-b` | 从真实 suite artifact/report 推导 future evidence candidates | `chore(console): generate evidence candidates from runs` |
| PH-08 | `commit-08-c` | 生成 acceptance handoff/VETO/risk/open-issues 草稿并审计来源 | `chore(console): assemble acceptance handoff drafts` |

## 8. 阶段任务、代码批次与提交边界

### 8.1 PH-01 package、配置、测试与证据骨架

#### 阶段任务表

| 任务编号 | 顺序 | 实施动作 | 输入 | Planned 输出 | 完成判定 |
|---|---:|---|---|---|---|
| `IMPL-01-01` | 1 | 在目标仓确认 TypeScript/ESM package root、strict compiler boundary 与十模块目录落点 | `03` §4；目标仓 authority | package/tsconfig/module skeleton | 目标仓、manager、build/typecheck 命令可定位；否则 `blocked / wait_design` |
| `IMPL-01-02` | 2 | 建立四项 config 的 strict whole-document validator 与三个 profile posture | `04` §3～§12 | config loader/validator planned surface | unknown key、缺 required profile、partial document、secret、silent fallback 均有拒绝分支 |
| `IMPL-01-03` | 3 | 建立 deterministic fixture、synthetic leak corpus、recording call ledger、scheduler 的接口骨架 | `05` §7～§8 | test data/ledger skeleton | 数据不含真实 body/secret；case/run 隔离字段可追溯 |
| `IMPL-01-04` | 4 | 建立 gate/check/report 路径与显式 run-id 参数壳 | `05` §9/§13；`06` §3/§10 | planned scripts and root manifests | 路径、run/profile/root 参数和失败姿态可审查；不生成静态 pass |

#### 代码实现批次

| 批次 | 目标 | 输入 | 输出 | 规模估计 | 验证门禁 | 提交关系 |
|---|---|---|---|---|---|---|
| `BATCH-01-01` | package/module/config source skeleton | `03` §4/§13 | planned package and strict compiler boundary | 100～200 行；目标仓未创建 | package check（future）、`git diff --check` | `commit-01-a` |
| `BATCH-01-02` | four-key validator and profile posture mapper | `04` §3～§12 | validator/config tests | 150～280 行 | `console-pure-contract`、`console-config-redline` | `commit-01-a` |
| `BATCH-01-03` | deterministic data and forbidden-material corpus contracts | `05` §7 | fixture/ledger/scheduler skeleton | 100～220 行 | `console-pure-contract`、`console-redaction-boundary` | `commit-01-b` |
| `BATCH-01-04` | gate/check/report shell and root manifest | `05` §9/§13 | scripts/root path shell | 150～300 行 | planned dry-run、`console-architecture-static` | `commit-01-b` |

#### 提交边界与台账规则

| Boundary | commit 时机 | 包含内容 | 不包含内容 | 必需检查 |
|---|---|---|---|---|
| `commit-01-a` | package/config 批次、设计/范围门禁和 future targeted checks 均具备后；实际用户授权后 | package skeleton、strict config/profile validator、config unit cuts | feature modules、owner adapter、真实 report/evidence、任何 DB/repository | target package check（命令 pending）、`console-pure-contract`、`console-config-redline`、`git diff --check` |
| `commit-01-b` | fixture/root/script shell 可 dry-run 且无静态 pass source 后 | deterministic fixtures、synthetic corpus、call ledger/scheduler shell、gate/check/report roots | 业务 flow、release verdict、acceptance signoff | `console-redaction-boundary`、`console-architecture-static`、script dry-run（future）、`git diff --check` |

台账路径分别为 `design-calibration/implementation-boundaries/commit-01-a.md` 与 `commit-01-b.md`；当前只定义字段，不创建文件。allowed scope 仅限目标仓 package/config/test-data/scripts skeleton；forbidden scope 包含十模块业务实现、owner schema、DB/private bus、Event/Job、真实 artifact/report。Handoff 必须回写真实 hash、未跑检查与下一 boundary；当前保持 pending。

### 8.2 PH-02 entry/access/navigation 安全 shell

#### 阶段任务表

| 任务编号 | 顺序 | 实施动作 | 输入 | Planned 输出 | 完成判定 |
|---|---:|---|---|---|---|
| `IMPL-02-01` | 1 | 建立 `ConsoleSessionShell` bootstrap/restrict/close 与 host-neutral lifecycle seams | `03` §5.1；§9/§11 | entry shell and lifecycle ports | state scope 与 shell posture 一致；closed 不重开 |
| `IMPL-02-02` | 2 | 建立 `AccessContext`、qualification/disclosure guards 和 formal resolution seam | `03` §5.2；`03` §6/§8 | access objects/ports/negative fixtures | formal observation 缺失时 fail-closed；不本地签发授权 |
| `IMPL-02-03` | 3 | 建立 route/selection/history/cleanup 与 semantic navigation binding | `03` §5.3、§9 | navigation state/host ports | context switch/revocation 清理旧 scope；route success 不提升 visibility |

#### 代码实现批次

| 批次 | 目标 | 输入 | 输出 | 规模估计 | 验证门禁 | 提交关系 |
|---|---|---|---|---|---|---|
| `BATCH-02-01` | shell lifecycle and restricted posture | `03` §5.1/§9 | entry shell tests | 120～260 行 | `console-module-flow` | `commit-02-a` |
| `BATCH-02-02` | access context/disclosure guard | `03` §5.2/§11 | access guard and redaction cuts | 180～300 行 | `console-module-flow`、`console-redaction-boundary` | `commit-02-a` |
| `BATCH-02-03` | guarded selection and cleanup | `03` §5.3/§8 | navigation state/cleanup tests | 180～300 行 | `console-module-flow`、`console-semantic-a11y` | `commit-02-b` |
| `BATCH-02-04` | history/host semantic binding | `03` §5.3/§15 | host-neutral binding tests | 100～220 行 | `console-semantic-a11y`、`console-redaction-boundary` | `commit-02-b` |

#### 提交边界与台账规则

| Boundary | commit 时机 | 包含内容 | 不包含内容 | 必需检查 |
|---|---|---|---|---|
| `commit-02-a` | shell/access lifecycle 与 negative context cuts 独立通过后 | `entry` + `access` shell、formal guards、restricted/minimal posture | navigation history、views/query、local role/RBAC、owner body | `console-module-flow`、`console-redaction-boundary`、`AC-CON-001/002` related checks、`git diff --check` |
| `commit-02-b` | guarded navigation、cleanup 和 semantic bindings 可独立回退后 | `navigation` selection/visibility/history/cleanup | Query material、Command submit、topic composition | `console-module-flow`、`console-semantic-a11y`、`VETO-CON-002/006` probes、`git diff --check` |

台账 allowed scope 为 `src/entry/**`、`src/access/**`、`src/navigation/**` 及其 targeted tests；forbidden scope 为 `src/views/**` 的 owner material、`src/intent/**` submit、`src/features/**` topic composition、所有 adapter implementation。exact context/visibility contract 缺失时两个 boundary 均可只交付 blocked/no-call safety，不能标 positive。

### 8.3 PH-03 safe views 与 8 Core Query

#### 阶段任务表

| 任务编号 | 顺序 | 实施动作 | 输入 | Planned 输出 | 完成判定 |
|---|---:|---|---|---|---|
| `IMPL-03-01` | 1 | 建立 safe payload、reference、五轴 status 与 whole-material mapper | `03` §5.4/§6/§8 | views contracts/mapper/negative fixtures | owner/source/ref 与五轴保真；forbidden body 整体拒绝 |
| `IMPL-03-02` | 2 | 落地 `ResolveAccessContext`、`GetNavigationVisibility`、`QueryOwnerView`、`GetSourceStatus` 的 read-only presentation seam | `03` §7.3/§8.3 | 前四 Core Query planned surface | query/carrier/owner writes=0；filter/window 在 safe mapping 后 |
| `IMPL-03-03` | 3 | 落地 `GetSafeLink`、`GetRequestPresentation`、`ReconcileRequestResult`、`GetTopicActivation` 的 read-only seam | `03` §7.3/§8.3 | 后四 Core Query planned surface | link/reconcile/activation 缺合同则 blocked；不隐式 submit |

#### 代码实现批次

| 批次 | 目标 | 输入 | 输出 | 规模估计 | 验证门禁 | 提交关系 |
|---|---|---|---|---|---|---|
| `BATCH-03-01` | safe material/reference and source axes | `03` §5.4/§6 | mapper/status unit cuts | 180～300 行 | `console-pure-contract`、`console-redaction-boundary` | `commit-03-a` |
| `BATCH-03-02` | owner snapshot/model and read-only guard | `03` §5.4/§8 | view composition/no-write ledger | 200～300 行 | `console-module-flow`、`console-port-adapter` | `commit-03-a` |
| `BATCH-03-03` | first four Core Query flows | `03` §7.3/§8.3 | query presentation and call ledger | 220～300 行 | `console-module-flow`、`console-port-adapter` | `commit-03-b` |
| `BATCH-03-04` | safe link/request presentation/reconcile | `03` §7.3/§8.3 | read-only result mapping | 180～280 行 | `console-port-adapter`、`console-concurrency-race` (future) | `commit-03-c` |
| `BATCH-03-05` | activation posture and query regression | `03` §5.6/§7.3 | activation query and no-write regression | 120～240 行 | `console-module-flow`、`console-redaction-boundary` | `commit-03-c` |

#### 提交边界与台账规则

| Boundary | commit 时机 | 包含内容 | 不包含内容 | 必需检查 |
|---|---|---|---|---|
| `commit-03-a` | safe mapper/status contracts 与 body-redaction cuts 通过后 | `views` safe types/mapper/status axes/read-only guard | concrete owner SDK methods、topic page、Command state | `console-pure-contract`、`console-redaction-boundary`、`AR-CON-003/004`、`git diff --check` |
| `commit-03-b` | 前四 Core Query 的 value/empty/blocked/unavailable/unknown 语义和 zero-write ledger 可独立验证后 | context/navigation/owner-view/source-status Query seam | 后四 Query、topic composition、carrier writes | `console-module-flow`、`console-port-adapter`、`AC-CON-003`/`IFG-CON-002` checks、`git diff --check` |
| `commit-03-c` | 后四 Query 的 read-only/blocked posture 和 regression cuts 通过后 | safe link、request presentation、reconcile、topic activation read seam | formal submit、invalidation consumer、owner positive claim | `console-port-adapter`、`console-module-flow`、`console-redaction-boundary`、`git diff --check` |

allowed scope 为 `src/views/**`、对应 `tests/{unit,contract,flow}/views*` 和 call-ledger fixtures；forbidden scope 为 owner DTO/private API、`src/repository/**`、`src/features/**` page composition、任何 Query write。`GetTopicActivation` 只产生 posture，不得把 page/flag/package 存在解释为 active。

### 8.4 PH-04 intent/state 与 5 Command 安全

#### 阶段任务表

| 任务编号 | 顺序 | 实施动作 | 输入 | Planned 输出 | 完成判定 |
|---|---:|---|---|---|---|
| `IMPL-04-01` | 1 | 建立 `DraftIntent`、preference/discard local phase 和 request presentation shell | `03` §5.5/§7.2/§9 | intent local contracts and tests | reviewable 不等 authorized；nonterminal discard only |
| `IMPL-04-02` | 2 | 建立 submit qualification、single-flight、dispatch boundary 与 observation mapper | `03` §7.2/§8.2/§12 | controlled submit safety seam | exact contract 缺失时 call=0；possible dispatch→unknown |
| `IMPL-04-03` | 3 | 建立 `ApplyRecoveryAction` command delegation and formal reconciliation read seam | `03` §7.2/§8.2/§11 | one-action/no-replay seam | 不创建 generic retry/job；reconcile 只读 |
| `IMPL-04-04` | 4 | 建立 exact-scope whole-record `ClientStateCarrierPort` 与 same-scope single writer | `03` §5.9/§10/§12 | carrier contract/fake/race fixture | malformed whole reject、ambiguous save reload、scope mismatch zero mutation |

#### 代码实现批次

| 批次 | 目标 | 输入 | 输出 | 规模估计 | 验证门禁 | 提交关系 |
|---|---|---|---|---|---|---|
| `BATCH-04-01` | draft/preference/discard state transitions | `03` §5.5/§9 | local command tests | 180～300 行 | `console-module-flow`、`console-pure-contract` | `commit-04-a` |
| `BATCH-04-02` | request phase/receipt/result/unknown presentation | `03` §5.5/§9/§11 | phase mapper and negative tests | 180～300 行 | `console-module-flow`、`console-redaction-boundary` | `commit-04-b` |
| `BATCH-04-03` | submit single-flight and dispatch ambiguity | `03` §7.2/§8.2/§12 | recording owner port and race cases | 180～300 行 | `console-concurrency-race`、`console-port-adapter` | `commit-04-b` |
| `BATCH-04-04` | recovery delegation/reconcile no replay | `03` §7.2/§8.2/§11 | recovery command seam | 120～240 行 | `console-module-flow`、`console-recovery-matrix` | `commit-04-b` |
| `BATCH-04-05` | whole-record carrier and scope guard | `03` §10/§12 | carrier fake/contract tests | 220～300 行 | `console-pure-contract`、`console-controlled-composition` | `commit-04-c` |
| `BATCH-04-06` | late result/single writer/concurrent replacement | `03` §12 | scheduler/call-ledger race tests | 180～280 行 | `console-concurrency-race`、`console-redaction-boundary` | `commit-04-c` |

#### 提交边界与台账规则

| Boundary | commit 时机 | 包含内容 | 不包含内容 | 必需检查 |
|---|---|---|---|---|
| `commit-04-a` | local draft/preference/discard transitions 与 carrier-independent tests 通过后 | draft/local command phase、nonterminal discard、typed reason key | owner submit、reconciliation、durable state | `console-pure-contract`、`console-module-flow`、`ST-CON-005` related checks、`git diff --check` |
| `commit-04-b` | submit/receipt/result/unknown/recovery safety cuts 独立通过后 | controlled submit guard、唯一 owner write seam、reconcile/read-only、one-action recovery | exact owner idempotency implementation、invalidation、topic pages | `console-port-adapter`、`console-concurrency-race`、`console-recovery-matrix`、`AC-CON-004`/`VETO-CON-003` probes、`git diff --check` |
| `commit-04-c` | carrier whole-record/scope/race tests 通过后 | state carrier, single-writer, late-drop, ambiguous reload | durable/cross-tab/CAS, owner truth, DB/repository | `console-pure-contract`、`console-controlled-composition`、`console-concurrency-race`、`AR-CON-006`、`git diff --check` |

allowed scope 为 `src/intent/**`、`src/state/**` 和对应 state/flow/consistency tests；forbidden scope 为 owner idempotency store、DB/repository/UoW、cross-session durability、automatic replay、`src/features/**`。`SubmitControlledIntent` 的 positive branch 只有 exact contract 到达后才可从 blocked posture 解锁。

### 8.5 PH-05 八主题 owner partition 与 composition

#### 阶段任务表

| 任务编号 | 顺序 | 实施动作 | 输入 | Planned 输出 | 完成判定 |
|---|---:|---|---|---|---|
| `IMPL-05-01` | 1 | 建立八个 `TopicDescriptor`、固定 owner 映射、activation ceiling 和 canonical order registry | `03` §5.6/§7.4 | descriptor/activation contracts | owner 顺序稳定；active 需 formal capability+mode+facets+context |
| `IMPL-05-02` | 2 | 建立八 Topic Query 的独立 partition read/composition seam | `03` §7.4/§8.4 | topic query composition | 单 owner failure 局部化；不跨 owner 原子化 |
| `IMPL-05-03` | 3 | 建立 strict empty、partial/unavailable/unknown mapping 与 page semantic composition | `03` §5.6/§9/§15 | TopicView/PageModel and a11y binding | 仅全适用 owner formal empty 才能 empty；不合成 readiness |

#### 代码实现批次

| 批次 | 目标 | 输入 | 输出 | 规模估计 | 验证门禁 | 提交关系 |
|---|---|---|---|---|---|---|
| `BATCH-05-01` | descriptors/activation/owner registry | `03` §5.6/§9 | feature registry and activation tests | 180～300 行 | `console-pure-contract`、`console-module-flow` | `commit-05-a` |
| `BATCH-05-02` | member/project/workspace/method partitions | `03` §7.4/§8.4 | first four topic composition slices | 250～300 行，必要时拆 topic batch | `console-controlled-composition` | `commit-05-b` |
| `BATCH-05-03` | governance/observability/capability partitions | `03` §7.4/§8.4 | middle topic slices | 250～300 行，必要时拆 topic batch | `console-controlled-composition`、`console-redaction-boundary` | `commit-05-b` |
| `BATCH-05-04` | archive/sandbox partitions and failure isolation | `03` §7.4/§8.4 | final topic slices | 180～280 行 | `console-controlled-composition`、`console-recovery-matrix` | `commit-05-b` |
| `BATCH-05-05` | strict empty/page semantics/filter-window | `03` §5.6/§15 | page model and semantic binding tests | 220～300 行 | `console-module-flow`、`console-semantic-a11y` | `commit-05-c` |
| `BATCH-05-06` | canonical order/completion permutation regression | `03` §8.4/§12 | deterministic scheduler/call ledger tests | 150～260 行 | `console-controlled-composition`、`console-concurrency-race` | `commit-05-c` |

#### 提交边界与台账规则

| Boundary | commit 时机 | 包含内容 | 不包含内容 | 必需检查 |
|---|---|---|---|---|
| `commit-05-a` | descriptor/activation registry 与 exhaustive posture tests 通过后 | `features` descriptors、owner map、activation ceiling | topic body/query fan-out、owner positive adapter | `console-pure-contract`、`console-module-flow`、`AR-CON-010`/`ST-CON-007`、`git diff --check` |
| `commit-05-b` | 八个 owner partition 均有独立 failure/partial/blocked path 后 | topic query partition composition、canonical owner order、local failure isolation | page final semantics、runtime formal binding、readiness/health | `console-controlled-composition`、`console-redaction-boundary`、`AC-CON-005`/`VETO-CON-007` probes、`git diff --check` |
| `commit-05-c` | strict empty/page/a11y/filter-window and order regression 独立通过后 | TopicView/PageModel semantic composition、filter/window after safe mapping、completion-order tests | browser compatibility verdict、production owner integration | `console-module-flow`、`console-semantic-a11y`、`console-concurrency-race`、`git diff --check` |

allowed scope 为 `src/features/**` 与 topic/composition tests；forbidden scope 为 owner domain copy、projection/cursor/rebuild、跨 owner transaction、统一 health/readiness、未停审 L5/L6 private link。每个 topic batch 只使用正式 descriptor/Port，不得用字符串或页面存在猜 activation。

### 8.6 PH-06 recovery、semantic a11y 与 diagnostics

#### 阶段任务表

| 任务编号 | 顺序 | 实施动作 | 输入 | Planned 输出 | 完成判定 |
|---|---:|---|---|---|---|
| `IMPL-06-01` | 1 | 建立 typed degradation、immutable recovery plan、subject-specific action guard | `03` §5.7/§9/§11 | recovery state/plan/guard | normal 轴不制造 degradation；stale plan 不执行危险动作 |
| `IMPL-06-02` | 2 | 建立 visual/keyboard/AT semantic action binding、focus/announcement fallback | `03` §5.7/§15 | a11y mapper/host port | 三通道共享 action key/guard/input/outcome/ceiling |
| `IMPL-06-03` | 3 | 建立 body-free diagnostic context、redaction gate、optional sink isolation | `03` §5.10/§14；`04` §8～§12 | diagnostics facade/sink posture | disabled/failed/cancelled sink 不改变业务 state/result，无递归 |

#### 代码实现批次

| 批次 | 目标 | 输入 | 输出 | 规模估计 | 验证门禁 | 提交关系 |
|---|---|---|---|---|---|---|
| `BATCH-06-01` | degradation/recovery state and one-action ceiling | `03` §9/§11 | recovery unit/flow cuts | 180～300 行 | `console-recovery-matrix`、`console-module-flow` | `commit-06-a` |
| `BATCH-06-02` | stale/mismatch/blocked plan guards | `03` §11/§12 | negative recovery tests | 120～240 行 | `console-recovery-matrix`、`console-concurrency-race` | `commit-06-a` |
| `BATCH-06-03` | semantic channel binding/focus announcement | `03` §5.7/§15 | a11y semantic tests | 200～300 行 | `console-semantic-a11y` | `commit-06-b` |
| `BATCH-06-04` | focus/announce host failure fallback | `03` §11/§15 | fallback/no-business-change tests | 120～220 行 | `console-semantic-a11y`、`console-redaction-boundary` | `commit-06-b` |
| `BATCH-06-05` | diagnostic context/whitelist/redaction | `03` §5.10/§14 | body-free diagnostic tests | 180～300 行 | `console-redaction-boundary`、`console-pure-contract` | `commit-06-c` |
| `BATCH-06-06` | sink disabled/failed/cancelled/recursion isolation | `03` §14 | sink isolation tests | 120～220 行 | `console-redaction-boundary`、`console-recovery-matrix` | `commit-06-c` |

#### 提交边界与台账规则

| Boundary | commit 时机 | 包含内容 | 不包含内容 | 必需检查 |
|---|---|---|---|---|
| `commit-06-a` | recovery state/plan/guard 与 stale/no-loop tests 通过后 | typed degradation、immutable plan、one-action recovery | generic retry、job/repair、production sink | `console-recovery-matrix`、`console-module-flow`、`ST-CON-008`、`git diff --check` |
| `commit-06-b` | semantic equivalence、focus/announce fallback 与 core paths 可独立验证后 | a11y channel mapping、host focus/announcement fallback | browser/AT compatibility verdict、guard bypass | `console-semantic-a11y`、`AC-FR-012`/`VETO-CON-006` probes、`git diff --check` |
| `commit-06-c` | body-free whitelist/redaction and sink isolation 通过后 | diagnostics context/factory/gate/sink/emission | audit/evidence/report ownership、raw body、metric thresholds | `console-redaction-boundary`、`console-recovery-matrix`、`AR-CON-003/011`、`git diff --check` |

allowed scope 为 `src/recovery/**`、`src/diagnostics/**` 及 a11y/diagnostic tests；forbidden scope 为 owner audit/evidence/report、production log backend、automatic retry/worker/job、raw body/secret/full ref。具体 browser/AT 与 sink authority 缺失时，boundary 可只交付 semantic/body-free safety。

### 8.7 PH-07 runtime adapter、conditional invalidation 与受控组合

#### 阶段任务表

| 任务编号 | 顺序 | 实施动作 | 输入 | Planned 输出 | 完成判定 |
|---|---:|---|---|---|---|
| `IMPL-07-01` | 1 | 建立 formal adapter availability、slot registry、approved binding posture | `03` §5.8/§13；`04` §8～§12 | adapter registry and availability mapper | slot/package/flag 存在不等 bound；mandatory 缺失 fail-closed |
| `IMPL-07-02` | 2 | 在 exact contract 到达时绑定 query/command/reconcile/link/activation narrow adapters | `03` §6/§7/§13；owner/SDK authority | safe request/response mapper and parity harness | 无 exact schema 则 no-call/blocked；raw error/body 不越界 |
| `IMPL-07-03` | 3 | 建立 `ConsumeSdkInvalidationHint` disabled/conditional branch 与 controlled runtime composition | `03` §7.5/§8.5/§12；`CON-Q-034/038/044` | optional consumer/monotonic marker seam | disabled zero-write；future only validated source/scope/envelope and tighten |

#### 代码实现批次

| 批次 | 目标 | 输入 | 输出 | 规模估计 | 验证门禁 | 提交关系 |
|---|---|---|---|---|---|---|
| `BATCH-07-01` | registry/availability/slot selection | `03` §13、`04` §8～§12 | registry and fail-closed tests | 180～300 行 | `console-port-adapter`、`console-architecture-static` | `commit-07-a` |
| `BATCH-07-02` | query/link/topic safe adapters | `03` §6/§7 | safe mapper/parity tests | 250～300 行，按 owner family 拆 | `console-port-adapter`、`console-controlled-composition` | `commit-07-b` |
| `BATCH-07-03` | command/reconcile adapter safety | `03` §7/§8/§12 | ambiguity/no-replay tests | 220～300 行 | `console-port-adapter`、`console-concurrency-race` | `commit-07-b` |
| `BATCH-07-04` | disabled invalidation consumer | `03` §7.5/§8.5 | zero-write disabled tests | 100～180 行 | `console-port-adapter`、`console-architecture-static` | `commit-07-c` |
| `BATCH-07-05` | future envelope validation/monotonic marker seam | `03` §10/§12；exact contract only | conditional branch tests | 150～260 行 | `console-concurrency-race`、`console-controlled-composition` | `commit-07-c` |

#### 提交边界与台账规则

| Boundary | commit 时机 | 包含内容 | 不包含内容 | 必需检查 |
|---|---|---|---|---|
| `commit-07-a` | registry/availability posture、forbidden dependency scan 和 disabled slot tests 通过后 | adapter registry/slot/availability/typed error shell | concrete SDK method/path、owner body、bus/DB | `console-port-adapter`、`console-architecture-static`、`IFG-CON-007`、`git diff --check` |
| `commit-07-b` | exact contract 逐项 fixed 且 query/command/reconcile/link adapters 有 parity/negative evidence 后 | approved narrow adapters and safe mappers | 未闭口 owner positive、private sibling import、owner domain copy | `console-port-adapter`、`console-controlled-composition`、`console-concurrency-race`、`git diff --check` |
| `commit-07-c` | invalidation disabled/conditional branch 与 conservative race tests 通过后 | optional consumer, body-free marker mapper, monotonic invalidation | broker client、cursor/replay/store、outbound Event/Job | `console-architecture-static`、`console-concurrency-race`、`AR-CON-004/005`、`git diff --check` |

allowed scope 为 `src/adapters/**`、formal-boundary fakes/parity tests、conditional consumer tests；forbidden scope 为 DB/repository/private bus/BFF/owner source、new event/job、guessed endpoint/path/schema。`commit-07-b` 在当前事实下为 `blocked_for_positive`，不可被 planned message 解释为已绑定。

### 8.8 PH-08 release gate、report、evidence 与 handoff

#### 阶段任务表

| 任务编号 | 顺序 | 实施动作 | 输入 | Planned 输出 | 完成判定 |
|---|---:|---|---|---|---|
| `IMPL-08-01` | 1 | 建立 gate orchestration、config/redaction/dependency/pairing/no-static checks | `05` §9/§13；`06` §3/§10/§11 | release script/check shell | 显式 run/profile/root 参数；无 raw source 则失败 |
| `IMPL-08-02` | 2 | 从同 run raw artifact/report 生成 report/evidence candidate index | `05` §13；`06` §10 | evidence generator/report audit | 不生成 orphan、无 pair/digest 不生成 candidate |
| `IMPL-08-03` | 3 | 生成 handoff/VETO/risk/open-issues 初稿并保留人工/Agent review | `06` §10～§14 | acceptance draft reports | 失败/blocked/residual 保真；不得写 verdict/signoff/readiness |

#### 代码实现批次

| 批次 | 目标 | 输入 | 输出 | 规模估计 | 验证门禁 | 提交关系 |
|---|---|---|---|---|---|---|
| `BATCH-08-01` | release gate/check orchestration shell | `05` §9 | gate/check scripts | 180～300 行 | planned release dry-run | `commit-08-a` |
| `BATCH-08-02` | pairing/redaction/no-static/dependency checker | `05` §9/§13；`06` §10/§11 | check reports | 220～300 行 | report-pairing/no-static/redaction checks | `commit-08-a` |
| `BATCH-08-03` | run report and evidence candidate generator | `05` §13；`06` §10 | run reports/evidence index | 250～300 行，必要时拆 generator | report-generation-audit | `commit-08-b` |
| `BATCH-08-04` | release safety/config/dependency summary | `05` release suites；`06` AC/VETO | release summaries | 180～280 行 | release safety/config/dependency | `commit-08-b` |
| `BATCH-08-05` | acceptance handoff/VETO/risk/open-issues draft | `06` §10～§14 | acceptance drafts | 180～280 行 | human/Agent review gate | `commit-08-c` |

#### 提交边界与台账规则

| Boundary | commit 时机 | 包含内容 | 不包含内容 | 必需检查 |
|---|---|---|---|---|
| `commit-08-a` | gate/check shell 可在显式 run/root/profile 下 dry-run，且无静态 pass source 后 | release orchestration、config/redaction/dependency/pairing/no-static shell | business feature、final EV/VETO result、signoff | planned release dry-run、`git diff --check` |
| `commit-08-b` | run report/evidence candidate generator 由真实 artifact/report source 约束并通过 audit 后 | run reports、candidate index、release summary mapping | 手写 evidence、acceptance verdict、production readiness | report-generation-audit、pairing/redaction/no-static、`git diff --check` |
| `commit-08-c` | handoff/VETO/risk/open-issues drafts 由同 run source 生成并完成人/Agent review 后 | `reports/acceptance/*` draft generators and review notes | 自动 signoff、风险接受事实、真实 final decision | VETO checklist audit、review completeness、`git diff --check` |

allowed scope 为 `scripts/gates/**`、`scripts/checks/**`、`scripts/reports/**`、未来 report roots 与 tooling tests；forbidden scope 为业务模块、owner truth、真实 verdict/signoff/readiness、修改 raw artifact 以补 pass。当前无 run/artifact/report，因此所有 boundary 只能 planned/blocked。

## 9. Commit boundary 开工前设计闭环复核

### 9.1 通用复核规则

设计者在实现移交前、每个 boundary 开工前和任何设计修复后，必须按下表逐项复核。`通过`只表示正式 03/04/05/06 已给出可引用的计划入口；若当前 boundary 需要的 exact owner/SDK/host/runner事实尚未固定，则结论为 `blocker / wait_design`，不能由实现者补齐。`不适用`必须有 Console 专属理由。

| 复核项 | 适用条件 | Console 检查内容 | 失败处理 |
|---|---|---|---|
| 字段闭环 | boundary 新增/修改 safe object、state 或 config | 字段来源、必填条件、redaction、状态条件和 local/formal 主语可回指 `03`/`04` | 回写正式真相源；`wait_design` |
| DTO/Port 构造闭环 | 新增 command/query/consumer request/response | 5+16+1 名称、输入输出、empty/blocked/unavailable/unknown/cancelled 语义和 narrow Port 已在 `03` | 禁止实现侧新 schema；阻断 |
| Query response 闭环 | 新增 view/page/query | source/status 五轴、visibility、strict empty、degraded、zero-write 有来源 | 回写 `03/05/06` |
| ref/scope identity | 使用 owner/context/session/request/result/link ref | ref kind、scope、correlation 与禁止反推规则明确；opaque ref 不解析 | 补正式 resolver/contract；阻断 |
| validation truth | 需要判定 visibility/qualification/activation/safe-field | 判定来自 formal observation/approved mapper；route、flag、page、cache 不作 truth | 缩窄为 blocked/read-only；回写设计 |
| command side-effect | boundary 涉及 5 Command | owner write inventory 仍只有 `OwnerCommandPort.submit`；其余 zero-write；dispatch boundary 明确 | 回写 `03` §7～§12；阻断 |
| state/carrier | boundary 涉及 local state/restore/invalidation | exact scope、whole-record、single-writer、session-volatile、ambiguous reload、no formal elevation 已闭合 | 回写 `03`/`04`/`05` |
| reconciliation/idempotency | submit/unknown/reconcile boundary | formal reconcile surface、possible dispatch→unknown、no replay；未闭口时 positive branch blocked | 等 owner/SDK authority；阻断 |
| config binding | boundary 读 config/注册 slot | 四 key、三 profile、startup-only、fail-fast/fail-closed/disabled/partial 映射与 source priority 固定 | 回写 `04` |
| error/recovery | typed error、degrade、a11y action | error kind→safe posture/message key→subject-specific action，不能 raw body/stack | 回写 `03`/`05`/`06` |
| redaction/diagnostic | boundary 输出 body/ref/diagnostic | whitelist、body-free、sink isolation、no echo、diagnostic≠audit/evidence | 阻断；全量相关安全复核 |
| artifact materialization | boundary 产生 raw/report/candidate | run_id、root、schema、digest/pairing、redaction、failed/blocked 保真和 reader/writer 责任 | 回写 `05/06`；无 raw 不生成 candidate |
| phase boundary | 每个 boundary | 不引用后续 phase 的对象/结果/证据；不引入 Event/Job/DB/service-side unit | 调整 Step 6 或回写真相源 |

### 9.2 Boundary 经验适用性总表

| Boundary | 涉及设计面 | 适用经验项 | 明确不适用项及理由 | 当前结论 | 复核责任 |
|---|---|---|---|---|---|
| `commit-01-a` | config/state skeleton/package | 字段、config binding、phase boundary | idempotency/outbox/projection/job 不适用：不写业务 truth/异步协议 | config/package authority pending；`blocked_for_implementation` | 设计者；实现者二次校验 |
| `commit-01-b` | test data/evidence path/scripts | artifact materialization、path/run、redaction、phase boundary | command/query/event/job 不适用：只建工具壳 | runner/package path pending；planned only | 设计者；实现者二次校验 |
| `commit-02-a` | access/state/recovery | 字段、DTO/Port、validation truth、ref/scope、state、redaction、phase boundary | persistence/idempotency/outbox/job 不适用：无 owner write/异步协议 | exact access authority pending；`wait_design` | 设计者；实现者二次校验 |
| `commit-02-b` | navigation/state/a11y | validation truth、ref/scope、error/recovery、a11y、phase boundary | owner command/query schema、event/job/outbox/projection 不适用 | host contract pending；planned safety only | 设计者；实现者二次校验 |
| `commit-03-a` | view/query response/refs/redaction | DTO、Query response、ref identity、validation truth、redaction、phase boundary | command idempotency/event/job/outbox/projection 不适用：Query no-write | safe-field/owner material pending；`blocked_for_positive` | 设计者；实现者二次校验 |
| `commit-03-b` | Core Query/no-write | DTO、Query response、scope/visibility、no-write、artifact test ledger、phase boundary | persistence/idempotency/event/job/outbox 不适用：只读查询 | exact query surface pending；safety planned | 设计者；实现者二次校验 |
| `commit-03-c` | link/reconcile/activation query | DTO、ref identity、validation truth、reconciliation boundary、phase boundary | owner write/event/job/outbox/projection 不适用：全部 Query zero-write | reconcile/activation contract pending；`blocked_for_positive` | 设计者；实现者二次校验 |
| `commit-04-a` | local command/state | fields、DTO、state、carrier、scope、phase boundary | owner idempotency/outbox/event/job/projection 不适用：local-only commands | carrier medium pending；safety planned | 设计者；实现者二次校验 |
| `commit-04-b` | submit/reconcile/unknown/idempotency | DTO、validation truth、dispatch/idempotency、result/ref、error/recovery、phase boundary | outbox/event/job/projection 不适用：Console submit 不创建这些面 | exact owner/idempotency/reconcile pending；`blocked_for_positive` | 设计者；实现者二次校验 |
| `commit-04-c` | carrier/persistence/concurrency | fields、scope、whole-record、single-writer、ambiguous reload、phase boundary | durable DB/UoW/CAS/projection/outbox/job 不适用：正式 03 禁止 | medium/TTL pending；session-only planned | 设计者；实现者二次校验 |
| `commit-05-a` | topic descriptor/activation | DTO、validation truth、ref/owner scope、phase boundary | persistence/event/job/outbox/projection 不适用：静态 composition only | owner facet authority pending | 设计者；实现者二次校验 |
| `commit-05-b` | topic query/partition | Query response、owner scope、partial/empty/degraded、concurrency/order、phase boundary | cross-owner transaction/projection/event/job/outbox 不适用：局部读取/组合 | exact topic schema pending；safety planned | 设计者；实现者二次校验 |
| `commit-05-c` | page/filter/a11y composition | Query response、strict empty、a11y、redaction、phase boundary | owner truth/readiness/projection/job 不适用：presentation only | browser matrix pending；semantic planned | 设计者；实现者二次校验 |
| `commit-06-a` | recovery/state/error | state、error/recovery、action source、phase boundary | job/worker/outbox/event 不适用：显式 one-action 不是 job | formal observation pending；safety planned | 设计者；实现者二次校验 |
| `commit-06-b` | semantic a11y/host | a11y binding、error/recovery、host source、phase boundary | browser verdict/event/job/audit 不适用：semantic contract only | host/AT authority pending | 设计者；实现者二次校验 |
| `commit-06-c` | diagnostic/redaction | fields、redaction、sink availability、artifact/report boundary | formal audit/evidence/job/event 不适用：diagnostic side path only | sink/envelope pending；body-free planned | 设计者；实现者二次校验 |
| `commit-07-a` | adapter registry/config/dependency | config binding、slot/availability、dependency/phase boundary | DB/repository/private bus/event/job/outbox/projection 不适用且 forbidden | target package/SDK exports pending | 设计者；实现者二次校验 |
| `commit-07-b` | formal adapters/owner integration | DTO、validation truth、safe mapping、ref/source、error/cancel/unknown、phase boundary | owner domain/persistence/event/job/outbox/projection 不适用：SDK-only client | exact contracts blocker；`blocked_for_positive` | 设计者；实现者二次校验 |
| `commit-07-c` | invalidation/state/concurrency | consumer DTO、scope/order/dedup、carrier marker、monotonicity、phase boundary | broker/cursor/store/event publisher/job/outbox 不适用/forbidden | invalidation contract pending；disabled planned | 设计者；实现者二次校验 |
| `commit-08-a` | scripts/checks/path | artifact materialization、path/run、redaction/no-static、phase boundary | business DTO/state/owner integration/event/job 不适用：tooling only | target runner pending; planned shell | 设计者；实现者二次校验 |
| `commit-08-b` | report/evidence candidate | artifact materialization、schema/digest/pairing、evidence source、phase boundary | owner truth/command/query/event/job 不适用：derive only | fixed run/evidence absent; blocked until baseline | 设计者；实现者二次校验 |
| `commit-08-c` | acceptance handoff/VETO/risk drafts | evidence source、review/defect/risk linkage、redaction、phase boundary | verdict/signoff/readiness creation 不适用/forbidden：由 06 lifecycle 负责 | review authority/run absent; blocked | 设计者；实现者二次校验 |

经验复核的 `pending` 或 `blocked_for_positive` 不是“允许实现时再确认”；它表示对应 boundary 只能保留 safe/disabled posture，或者在设计 authority 到达前不得开工。

### 9.3 每个 boundary 的最小 Gate / Handoff 规则

每个 future boundary 台账必须至少包含以下字段（实际文件按后续时点创建）：

| Boundary | Required reads | Allowed scope（摘要） | Forbidden scope（摘要） | Required checks | Commit Gate | Handoff Gate |
|---|---|---|---|---|---|---|
| `commit-01-a` | 03 §4/§13；04 §3～§12；Step 3 RB-01 | package/config skeleton | owner/feature/DB | package check、config suite、diff | staged package/config、message、whitespace、checks | hash/blockers/next `01-b` |
| `commit-01-b` | 05 §7/§9/§13；06 §3/§10 | test data/scripts/roots | business implementation/evidence pass | dry-run、redaction/architecture checks、diff | staged tooling only | hash/blockers/next `02-a` |
| `commit-02-a` | 03 §5.1/§5.2/§8/§9/§11；05 CTX/SEC；06 AC-CON-001/002 | entry/access | navigation/query/owner | module-flow/redaction | staged shell only | hash/blockers/next `02-b` |
| `commit-02-b` | 03 §5.3/§8/§9/§15；05 NAV/A11Y；06 ST-CON-003 | navigation/host semantic | views/intent/features | module-flow/a11y | staged navigation only | hash/blockers/next `03-a` |
| `commit-03-a` | 03 §5.4/§6/§8；05 VIEW/SEC；06 AC-CON-003 | views mapper/status | owner schema/query writes | pure/redaction | staged safe mapper | hash/blockers/next `03-b` |
| `commit-03-b` | 03 §7.3/§8.3；05 VIEW/ADAPTER；06 IFG-CON-002 | first four queries | command/topic/adapter positive | module-flow/port | staged read-only query | hash/blockers/next `03-c` |
| `commit-03-c` | 03 §7.3/§8.3；05 ADAPTER/INTENT/TOPIC；06 ST/IFG | last four queries | submit/invalidation | port/module/redaction | staged read-only query | hash/blockers/next `04-a` |
| `commit-04-a` | 03 §5.5/§9；05 INTENT/STATE；06 ST-CON-005 | local intent | owner submit/durable | pure/module | staged local phase | hash/blockers/next `04-b` |
| `commit-04-b` | 03 §7.2/§8.2/§11/§12；05 INTENT/CONSISTENCY；06 AC-CON-004/VETO-003 | submit/reconcile safety | owner schema/idempotency store | flow/adapter/race/recovery | staged side-effect seam | hash/blockers/next `04-c` |
| `commit-04-c` | 03 §10/§12；05 STATE/CONSISTENCY；06 ST/TX | carrier/race | durable/CAS/DB | pure/composition/race | staged carrier only | hash/blockers/next `05-a` |
| `commit-05-a` | 03 §5.6/§7.4/§9；05 TOPIC;06 ST-CON-007 | descriptors/activation | topic body/owner truth | pure/module | staged registry | hash/blockers/next `05-b` |
| `commit-05-b` | 03 §7.4/§8.4；05 TOPIC/CONSISTENCY；06 AC-CON-005/IFG-006 | partitions/composition | readiness/projection | composition/redaction | staged topic reads | hash/blockers/next `05-c` |
| `commit-05-c` | 03 §5.6/§8.4/§15；05 TOPIC/A11Y；06 AC-FR-005～010 | page/empty/a11y | browser verdict/owner positive | module/a11y/race | staged page composition | hash/blockers/next `06-a` |
| `commit-06-a` | 03 §5.7/§9/§11；05 RECOVERY；06 ST-CON-008 | recovery state/guard | generic retry/job | recovery/module | staged recovery | hash/blockers/next `06-b` |
| `commit-06-b` | 03 §5.7/§15；05 A11Y；06 AC-FR-012/VETO-006 | semantic channels | AT verdict/guard bypass | semantic a11y | staged semantics | hash/blockers/next `06-c` |
| `commit-06-c` | 03 §5.10/§14；04 §8～§12；05 DIAG/SEC；06 AR-CON-003/011 | diagnostics/redaction | audit/evidence/body | redaction/recovery | staged body-free sink | hash/blockers/next `07-a` |
| `commit-07-a` | 03 §6/§13；04 §8～§12；05 ADAPTER/ARCH | registry/availability | private source/DB/bus | port/architecture | staged registry | hash/blockers/next `07-b` |
| `commit-07-b` | 03 §6/§7/§8；05 ADAPTER/INTEGRATION；06 IFG-007 | approved adapters only | guessed positive/owner body | port/composition/race | staged approved adapters | hash/blockers/next `07-c` |
| `commit-07-c` | 03 §7.5/§10/§12；05 consumer/CONSISTENCY；06 IFG-003/CC-006 | invalidation disabled/conditional | broker/cursor/replay | architecture/race | staged consumer | hash/blockers/next `08-a` |
| `commit-08-a` | 05 §9/§13；06 §3/§10/§11 | scripts/checks/roots | business feature/static pass | dry-run/checks/diff | staged tooling/message | hash/blockers/next `08-b` |
| `commit-08-b` | 05 §13/§14；06 §10 | report/candidate derivation | hand-written EV/VETO | report/pairing/redaction/no-static | staged generator/source | hash/blockers/next `08-c` |
| `commit-08-c` | 06 §10～§14；05 §13 | acceptance drafts/review | verdict/signoff/readiness | VETO/review completeness/diff | staged drafts/source | hash/blockers/next handoff |

当前所有 `Required checks`、Commit Gate、Handoff Gate 均为 planned；没有任何 pass evidence 或 commit hash。

## 10. Commit boundary 子功能分组与粒度判断

### 10.1 子功能分组

| Boundary | 必须同提交的子功能 | 必须同提交的原因 | 主要批次 | 不包含 |
|---|---|---|---|---|
| `commit-01-a` | package root + strict config/profile validator | 后续所有 phase 必须共享同一 package/config posture，拆开会产生不可定位的启动基线 | `BATCH-01-01/02` | tests/scripts、业务模块 |
| `commit-01-b` | fixture/corpus/ledger shell + gate/report roots | 测试数据隔离与证据路径必须在第一批工具壳中一致 | `BATCH-01-03/04` | 业务 flow、静态 pass |
| `commit-02-a` | session shell + access/disclosure guards | shell 的 restricted/closed posture 与 formal access guard 共同构成安全入口 | `BATCH-02-01/02` | navigation、query |
| `commit-02-b` | guarded selection + history + cleanup + semantic route binding | selection 清理、host binding 和 semantic action 是同一导航安全增量 | `BATCH-02-03/04` | views、intent、topic |
| `commit-03-a` | safe material types + source axes + mapper + read-only guard | Core Query 必须先有统一 safe mapper 和 no-write invariant，不能先按 query 各自映射 | `BATCH-03-01/02` | concrete owner integration |
| `commit-03-b` | context/navigation/owner-view/source-status Query seams | 四个 Query 共同验证 safe read/no-write 基础，能独立回退 | `BATCH-03-03` | link/reconcile/activation |
| `commit-03-c` | safe link + request presentation + reconcile + activation Query seams | 后四 Query 都是只读引用/状态呈现，需共享 blocked/unknown 规则但不写 carrier | `BATCH-03-04/05` | submit/invalidation |
| `commit-04-a` | draft/preference/discard local transitions | 三个 local Command 共同构成不触碰 owner 的 intent phase | `BATCH-04-01` | submit/reconcile |
| `commit-04-b` | controlled submit + observation mapping + reconcile + one-action recovery delegation | dispatch/unknown/no-replay 与 recovery delegation 需要共同的 request correlation 和 side-effect inventory | `BATCH-04-02/03/04` | durable idempotency/owner schema |
| `commit-04-c` | whole-record carrier + single writer + late-result/race guard | carrier 语义和并发保护不可拆成互相不一致的两个 local truth | `BATCH-04-05/06` | cross-tab/durable store |
| `commit-05-a` | descriptors + owner registry + activation ceiling | canonical owner mapping 和 activation 约束必须同一来源 | `BATCH-05-01` | topic page body |
| `commit-05-b` | eight partition reads + canonical aggregation + local failure isolation | partition 组合必须以同一 order/partial 规则验证；每个 topic 不是独立 truth | `BATCH-05-02/03/04` | final page semantics |
| `commit-05-c` | strict empty + page semantic regions + filter/window + completion permutation | 页面 empty、语义绑定和排序稳定性共同构成可观察组合结果 | `BATCH-05-05/06` | browser compatibility verdict |
| `commit-06-a` | degradation state + immutable plan + stale/action guard | recovery ceiling 只有与 plan guard 同提交才可独立证明 | `BATCH-06-01/02` | generic retry/job |
| `commit-06-b` | semantic action channels + focus/announcement fallback | 视觉/键盘/AT 等价必须共享 action key 与 host fallback | `BATCH-06-03/04` | selected browser/AT verdict |
| `commit-06-c` | diagnostic context + redaction + sink isolation | whitelist、no-echo 和 sink failure isolation 是同一 side-path safety increment | `BATCH-06-05/06` | formal audit/evidence |
| `commit-07-a` | slot registry + availability + forbidden dependency scan | adapter 是否 bound 的判断必须在同一 registry/availability seam 内收口 | `BATCH-07-01` | concrete owner methods |
| `commit-07-b` | approved query/command/reconcile/link/activation adapters + parity harness | 这些 adapter 都必须遵循同一 safe mapper/error/cancel posture；合同缺失则整体 blocked | `BATCH-07-02/03` | guessed schema/private source |
| `commit-07-c` | disabled invalidation + future envelope mapper + monotonic race checks | consumer 的 disabled 与 future conservative branch 必须共享 carrier marker/invalidation invariant | `BATCH-07-04/05` | broker/cursor/replay |
| `commit-08-a` | gate orchestration + pairing/redaction/dependency/no-static checks | release gate 只有同时具备输入完整性和静态证据防伪检查才可 dry-run | `BATCH-08-01/02` | candidate/handoff conclusions |
| `commit-08-b` | run report + evidence candidate derivation + release summary mapping | candidate 必须由同一 run raw/report 生成，不能把 generator 与 source mapping 分开 | `BATCH-08-03/04` | VETO/signoff |
| `commit-08-c` | handoff/VETO/risk/open-issues draft + review notes | acceptance 草稿必须同时保留 failed/blocked/residual 和人工审查责任 | `BATCH-08-05` | automatic verdict/signoff/readiness |

### 10.2 提交粒度判断

| Boundary | 粒度判断 | 一句话描述 | 可独立 review/验证/回退 | 调整结论 |
|---|---|---|---|---|
| `commit-01-a` | 适中 | package + config skeleton | 是（目标仓存在后） | 保留 |
| `commit-01-b` | 适中 | test/evidence path skeleton | 是（dry-run） | 保留 |
| `commit-02-a` | 适中 | guarded access shell | 是（negative flow） | 保留 |
| `commit-02-b` | 适中 | guarded navigation shell | 是（semantic flow） | 保留 |
| `commit-03-a` | 适中 | safe view mapping invariant | 是（unit/redaction） | 保留 |
| `commit-03-b` | 适中 | first Core Query read seam | 是（read-only flow） | 保留 |
| `commit-03-c` | 适中 | remaining Core Query read seam | 是（read-only flow） | 保留 |
| `commit-04-a` | 适中 | local intent phase | 是（state flow） | 保留 |
| `commit-04-b` | 偏大但受控 | controlled submit safety | 是（按三个 batch 顺序） | 保留；不得扩大到 owner schema |
| `commit-04-c` | 适中 | scoped state/race safety | 是（contract/race） | 保留 |
| `commit-05-a` | 适中 | topic activation boundaries | 是（exhaustive posture） | 保留 |
| `commit-05-b` | 偏大但必要 | owner partition composition | 是（按 topic batches） | 保留；batch 必须逐个 gate |
| `commit-05-c` | 适中 | page semantics and order stability | 是（flow/a11y/race） | 保留 |
| `commit-06-a` | 适中 | recovery safety | 是（recovery matrix） | 保留 |
| `commit-06-b` | 适中 | semantic accessibility paths | 是（semantic harness） | 保留 |
| `commit-06-c` | 适中 | diagnostic isolation | 是（redaction） | 保留 |
| `commit-07-a` | 适中 | formal adapter registry | 是（architecture/port） | 保留 |
| `commit-07-b` | 偏大且合同阻塞 | approved adapter binding | 合同固定后可独立；当前不可开工 | 保留；`blocked_for_positive` |
| `commit-07-c` | 适中 | conditional invalidation safety | 是（disabled branch） | 保留 |
| `commit-08-a` | 适中 | release gate shell | 是（dry-run） | 保留 |
| `commit-08-b` | 适中 | evidence candidate derivation | 是（report audit） | 保留 |
| `commit-08-c` | 适中 | acceptance handoff drafts | 是（review audit） | 保留 |

没有采用单函数、单文件、单 struct 或当天工作量作为默认提交边界；偏大的 boundary 均通过批次控制，而不是混入无关 phase。

## 11. Commit boundary 停审记录

| Boundary | 一句话目标是否成立 | 子功能是否同属一个增量 | 开工闭环是否完整 | 提交前门禁/回退是否明确 | 设计层结论 |
|---|---|---|---|---|---|
| `commit-01-a` | 是 | 是 | package/config authority 仍待目标仓 | planned package/config gate；可回退 | 通过设计停审；实施 blocked |
| `commit-01-b` | 是 | 是 | runner/root schema 仍待目标仓 | planned dry-run/redaction/architecture | 通过设计停审；实施 blocked |
| `commit-02-a` | 是 | 是 | access formal surface pending | module-flow/redaction | 通过设计停审；positive blocked |
| `commit-02-b` | 是 | 是 | host route/a11y contract pending | module-flow/semantic-a11y | 通过设计停审；host binding pending |
| `commit-03-a` | 是 | 是 | safe-field/owner material pending | pure/redaction | 通过设计停审；positive blocked |
| `commit-03-b` | 是 | 是 | query exact surface pending | module-flow/port/no-write | 通过设计停审；safety planned |
| `commit-03-c` | 是 | 是 | reconcile/activation pending | port/module/redaction | 通过设计停审；positive blocked |
| `commit-04-a` | 是 | 是 | local state fields are planned in 03 | pure/module | 通过设计停审；carrier medium pending |
| `commit-04-b` | 是 | 是 | owner dispatch/idempotency pending | flow/adapter/race/recovery | 通过设计停审；submit blocked |
| `commit-04-c` | 是 | 是 | medium/TTL/CAS authority pending | pure/composition/race | 通过设计停审；session-only ceiling |
| `commit-05-a` | 是 | 是 | owner facet authority pending | pure/module | 通过设计停审；activation conditional |
| `commit-05-b` | 是 | 是 | topic positive schema pending | composition/redaction | 通过设计停审；safety planned |
| `commit-05-c` | 是 | 是 | browser/AT matrix pending | module/a11y/race | 通过设计停审；semantic-only |
| `commit-06-a` | 是 | 是 | formal recovery observation pending | recovery/module | 通过设计停审；safe ceiling fixed |
| `commit-06-b` | 是 | 是 | host/AT authority pending | semantic-a11y | 通过设计停审；selected blocked |
| `commit-06-c` | 是 | 是 | sink/envelope pending | redaction/recovery | 通过设计停审；body-free only |
| `commit-07-a` | 是 | 是 | package/SDK exports pending | port/architecture | 通过设计停审；registry planned |
| `commit-07-b` | 是 | 是 | exact owner/SDK contract missing | port/composition/race | 设计通过；实现 blocker |
| `commit-07-c` | 是 | 是 | invalidation envelope pending | architecture/race | 通过设计停审；disabled only |
| `commit-08-a` | 是 | 是 | runner/schema pending | dry-run/checks | 通过设计停审；not executable now |
| `commit-08-b` | 是 | 是 | no fixed run/artifact/report | report/pairing/no-static | 通过设计停审；blocked until run |
| `commit-08-c` | 是 | 是 | review authority/run absent | VETO/review completeness | 通过设计停审；handoff blocked |

所有 boundary 的设计层停审均通过“结构可审查”门槛，但没有一个 boundary 获得实际 `pass`、commit hash 或执行证据。任何 blocker 修复后必须回写对应正式真相源并重复该 boundary 的停审。

## 12. 跨 boundary 粒度、依赖、门禁和证据审计

| 审计项 | 结论 | 缺口 / 修正 |
|---|---|---|
| boundary 是否按可验证增量而非对象/文件拆分 | 通过 | 22 个 boundary 均有一句话目标和 phase 归属；模块只是 allowed scope。 |
| 编写顺序是否先 contract/fixture 再实现 | 通过 | 所有 phase 采用 §7.1 顺序；exact contract 缺失时先 safe/disabled。 |
| 是否存在 phase 越界 | 通过 | Query、topic、recovery、adapter、evidence 按 PH 顺序；不提前引入后续结果。 |
| 0 Event/0 Job/无服务端单元是否保持 | 通过 | 无 Event/Job/outbox/worker/projection/repository/UoW boundary；出现即 architecture blocker。 |
| Query zero-write/唯一 owner write 是否贯穿 | 通过 | `commit-03-b/c`、`commit-05-b/c`、`commit-07-b/c` 均禁止 Query/side-path write；唯一潜在 write 仍 `OwnerCommandPort.submit`。 |
| state/carrier/transaction 边界是否一致 | 通过 | `commit-04-a/c` 固定 whole-record/session-volatile/single-writer；无 DB/CAS/durable 假设。 |
| access/visibility/qualification truth 是否被重定义 | 通过 | 只允许 formal observation；route/menu/flag/page/cache 不作为 truth。 |
| owner partition 是否产生跨 owner 原子性或 readiness | 通过 | `commit-05-b/c` 只做 canonical/local isolation；不合成 health/compliance/readiness。 |
| recovery/a11y/diagnostic 是否改变业务结论 | 通过 | `commit-06-*` 只收紧/提供语义等价/side-path isolation；不改 formal result/activation/audit。 |
| positive adapter 是否在 exact contract 前置 | 通过 | `commit-07-b` 明确 `blocked_for_positive`；不猜 DTO/path/error/idempotency。 |
| invalidation 是否绕过正式边界 | 通过 | `commit-07-c` 默认 disabled；不直连 broker/cursor/replay/store。 |
| config/profile 是否改变安全不变量 | 通过 | `commit-01-a/07-a` 只 strict startup/fail-closed；不得用 flag/package/page 激活。 |
| 测试是否后补 | 通过 | 每个 boundary 至少有 planned suite/check；高风险逻辑单独 batch。 |
| artifact/report/evidence 是否可追溯 | 通过 | `commit-01-b/08-*` 固定 `<run_id>` roots、pairing、digest、redaction、no-static；无 raw 不生成 candidate。 |
| Commit/Handoff Gate 是否定义 | 通过 | §9.3 为每 boundary 指定 required reads/scope/checks/gate/handoff；当前均 pending。 |
| 实施台账创建时机是否遵守规则 | 通过 | Step 6 只定义路径和字段；implementation ledger/boundary skeleton 仍未创建，后续规定时点再创建。 |
| 设计 blocker 是否有唯一安全方向 | 通过 | `wait_design`/`blocked_for_positive`；不允许实现者现场补 schema 或 commit。 |
| 提交 message scope 是否一致 | 通过 | 全部 planned message 使用 `console` scope；无真实 commit。 |
| 批次规模是否受控 | 通过但有受控大批风险 | `BATCH-05-02/03`、`BATCH-07-02`、`BATCH-08-03` 超过 300 风险已要求拆分；超过 500 禁止单批。 |
| 是否存在无关改动混入 | 通过 | allowed/forbidden scope 与 staged diff 规则明确；设计仓既有用户改动不纳入实现。 |

### 12.1 跨 boundary 审计结论

设计层没有 unresolved 的顺序或粒度冲突。当前仍有实施移交 blockers：目标仓不存在、package/toolchain/host 未固定、exact owner/SDK/query/command/reconcile/invalidation contract 未闭口、design baseline/run/evidence 未固定。故所有 boundary 只能保持 `planned` 或 `blocked / wait_design`；不得创建 implementation ledger、boundary skeleton、实现代码或 commit 事实来“提前关闭”这些项。

## 13. 回填草稿

以下内容仅供 Step 13 full-restart 装配到正式 `07-实施计划.md` §6；本文件之外不得提前写正式 07。

### 6.1 阶段任务与编写顺序

每个 phase 采用以下顺序：读取项目/当前 boundary 台账 → Design/Scope Gate → public safe contract/ref/reason → fixture/call ledger/scheduler → pure state/mapper/guard → consumer-owned narrow Port → local composition/semantic binding → approved adapter 或 disabled posture → planned suite/check → same-run artifact/report → Evidence/Commit/Handoff Gate。具体 `IMPL-*` 任务、`BATCH-*` 批次和 `commit-*` boundary 回填本文件 §8。

### 6.2 提交边界与台账

正式 §6 应回填本文件 §7.3、§8 和 §9.3 的 22 个 boundary 总表与最小台账规则。每个 planned boundary 的 ledger path 为 `design-calibration/implementation-boundaries/<boundary_id>.md`；项目级 ledger 为 `design-calibration/implementation_execution_ledger.md`。未来 skeleton 只能使用 `status=planned`、`next_allowed_action=wait_until_current`，真实 hash/check/evidence 只能在实现期回写。当前 blockers 或 gate pending 时，唯一安全方向是 `wait_design`/`fix_gate_failure`，不可 commit。

### 6.3 设计者复核与实现者二次校验

正式 §6 必须要求设计者在移交前及设计修复后逐 boundary 复核字段、DTO/Port、Query response、ref/scope、validation truth、state/carrier、reconciliation、config、redaction、artifact materialization 和 phase boundary；经验不适用项要给 Console 专属理由。实现 agent 只做 baseline、required reads、目标仓、scope、真实命令和用户改动保护的二次校验，发现不符即暂停回报；不得在代码中补设计。

## 14. 待确认事项

| 事项 | 当前状态 | 影响 boundary | 处理时点 |
|---|---|---|---|
| 实现仓 `/home/aris/Projects/quantalithos-console` | `BLK-CON-07-001 / not_created` | 全部 | PH-01/移交前；不创建、不在 design 仓实现 |
| package manager/framework/router/bundler/host | `RES-CON-07-002 / pending` | 01-a、02-b、07-a/b | 目标仓/host authority 固定后回写 |
| exact owner/SDK DTO、query/command/result/ref、scope/qualification/safe-field | `BLK-CON-07-002 / pending` | 03-a/b/c、04-b、05-b、07-b | 对应 boundary 开工前回写 03/05/06 |
| reconciliation/idempotency/dispatch boundary | `pending` | 03-c、04-b、07-b | owner/SDK authority 到达；unknown 不 replay |
| carrier medium/TTL/migration/cross-tab | `CON-Q-044 / pending` | 04-c、07-c | 只保留 session-volatile；升级需回写 03/04/05/06 |
| browser/AT matrix、diagnostic sink/envelope | `RES-CON-07-001 / pending` | 05-c、06-b/c | authority+baseline 同时固定后才 selected |
| invalidation envelope/version/order/dedup | `pending` | 07-c | 默认 disabled；enabled 前 exact contract 必须闭口 |
| immutable design/delivery/environment/dependency baseline | `BLK-CON-07-003 / not_fixed` | 01-a、08-a/b/c、handoff | Step 12/13 前固定；不填写 hash/digest |
| future boundary ledger skeleton 时机 | `deferred by rule` | 全部 | Step 6 产物完成；按后续规定时点一次性预创建 |

## 15. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| 每个 phase 有任务表、编写顺序、批次和 boundary | `pass` | PH-01～PH-08 与 22 boundary 已收敛 |
| 每个 boundary 有一句话目标、包含/不包含、required checks | `pass` | §7.3、§8、§9.3、§10 完成 |
| 每个 boundary 有设计闭环与经验复核 | `pass with blockers` | 入口、来源和责任清楚；exact external contracts 仍阻塞 positive |
| Commit Gate/Handoff Gate 规则明确 | `pass` | staged scope/message/whitespace/checks/hash/blocker/next boundary 已定义 |
| boundary 停审与跨 boundary 审计完成 | `pass` | §11/§12 通过设计层审计 |
| implementation ledger/boundary 文件是否已创建 | `not_created_by_rule` | Step 6 只定义 future path；不得提前伪造 implementation state |
| 正式 07 是否可写 | `false` | Step 13 full-restart 前关闭 |
| 可进入 Step 7 | `pass` | 需用户明确授权；下一步只收测试/验收/证据门禁 |

## 16. Step 自审记录

- [x] 已按恢复门禁读取项目台账、07 flow、Step 5 产物、正式 `03/04/05/06` 和 L1-governance Step 6 粒度参考。
- [x] 已回答 Step 6 全部 SOP 问题，并按 phase/commit boundary 而非文件或对象裸拆。
- [x] 已为 PH-01～PH-08 定义 `IMPL-*` 任务、`BATCH-*` 批次、22 个 boundary、planned message、allowed/forbidden scope、required checks、Commit/Handoff Gate。
- [x] 已逐 boundary 提供开工前设计闭环复核、经验适用性/不适用理由、子功能分组、粒度判断和停审记录。
- [x] 已完成跨 boundary 依赖、越界、测试、证据、提交粒度和 0 Event/0 Job 审计。
- [x] 未创建 implementation ledger、boundary skeleton、目标仓、代码、测试、脚本、artifact/report/evidence 或 commit；未运行测试。
- [x] 正式 `07-实施计划.md` 仍不存在；本文件只作为 calibration 中间产物。

## 17. 最终静态审计与停审回写

| 审计项 | 结果 | 证据/边界 |
|---|---|---|
| Phase 覆盖 | `pass` | PH-01～PH-08 共 8 个 phase；每个 phase 均有阶段任务表、代码批次和提交边界规则。 |
| Planned boundary 完整性 | `pass` | 22 个唯一 boundary：`commit-01-a/b`、`commit-02-a/b`、`commit-03-a/b/c`、`commit-04-a/b/c`、`commit-05-a/b/c`、`commit-06-a/b/c`、`commit-07-a/b/c`、`commit-08-a/b/c`；总表、批次归属、门禁、粒度和停审记录无缺失。 |
| Boundary 依赖与粒度 | `pass` | 无对象/文件裸拆、无 phase 越界；偏大 boundary 已以 `BATCH-*` 受控，并保留逐批 gate 要求。 |
| Console ownership 红线 | `pass` | 16 Query zero-write；唯一潜在 owner write 仍为 `OwnerCommandPort.submit`；0 Outbound Event、0 Operations Job；无 DB/repository/projection/outbox/worker/BFF。 |
| Blocker 保真 | `pass with blockers` | `BLK-CON-07-001~003`、`RES-CON-07-001~002`、`CON-Q-034～047` 继续为 `blocked / wait_design` 或 `conditional`；未补造 owner/SDK schema、baseline 或 runtime authority。 |
| 事实诚实 | `pass` | 未创建正式 `07-实施计划.md`、implementation ledger、boundary skeleton、实现仓、源码、测试、脚本、run、artifact、report、evidence、verdict、signoff、readiness 或 commit；未运行项目测试。 |
| 静态工作树检查 | `pass` | `git diff --check -- projects/L5-console` 无输出/无 whitespace error；本 Step 不需要提交。 |

本 Step 的 `pass` 仅表示实施计划设计与静态自审通过，不表示任何实现、测试、证据、提交或验收事实已发生。Step 6 现正式停审；下一允许动作是用户明确授权后进入 Step 7，不能在当前停审状态自动创建 Step 7 产物或开始执行。
