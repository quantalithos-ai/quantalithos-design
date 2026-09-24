# Step 10. 定义回退、暂停与变更控制

> 对应 SOP：`standards/document/实施计划讨论流程_SOP.md` Step 10  
> 书写规范：`standards/document/实施计划书写规范.md` §5.10、§10  
> 可落码标准：`standards/document/设计真相源闭环与可落码性标准.md` §九  
> 实施台账规范：`standards/document/代码实施台账与门禁规范.md`  
> 回填章节：未来正式 `projects/L5-runner/07-实施计划.md` §10  
> 执行方式：`full-restart + single-agent-serial`

## 1. Step 状态与事实边界

| 项 | 当前值 |
|---|---|
| `current_document` | `07-实施计划.md` calibration |
| `current_step` | `Step 10` |
| `current_module` | `rollback_pause_change_control` |
| `status` | `completed / self_reviewed` |
| `gate_status` | `pass_for_step_11` |
| `gate_reason` | 已为六个 phase、18 个 planned commit boundary 固定 pause、rollback、change、resume 动作、证据保留、上游回写、门禁失败、外部依赖不可用和新 baseline 重审规则；已验证边界与用户未提交改动受保护，P0/VETO/安全/证据完整性不能由风险接受绕过。 |
| `formal_07_write_allowed` | `false_until_step_13_assembly` |
| `implementation_write_allowed` | `false` |
| `test_execution_allowed` | `false` |
| `implementation_ledger_allowed` | `false_until_step_13_assembly` |
| `commit_required` | `false` |
| `next_allowed_action` | 创建并完成 `07_implementation_plan_step_11_commit_review_delivery.md`；完成后停审 |

本 Step 只收敛未来实施期间的控制规则。`pause`、`rollback`、`change`、`resume`、gate 失败、失败 artifact/report、baseline、run 和 review 均为计划语义；当前没有实现仓、实现提交、测试执行、run、artifact、report、evidence、verdict、signoff 或 readiness 实例。本 Step 不修改正式 `07-实施计划.md`，不创建 implementation ledger 或 planned boundary skeleton。

## 2. 本步输入、输出与执行约束

### 2.1 本步输入

| 输入 | 承接内容 | 使用上限 |
|---|---|---|
| `07_implementation_plan_step_06_tasks_commit_boundaries.md` | 六个 phase、18 个 boundary、代码批次、allowed/forbidden scope、Commit/Handoff Gate | 只定义边界失败时如何停、退、重审；不新增或合并 boundary |
| `07_implementation_plan_step_07_test_acceptance_gates.md` | `GATE-01`～`GATE-12`、suite/CUT/TC、AC/AR/TX/NFA/VETO、失败分类和证据成熟度 | 只把既有 gate 转为暂停/恢复动作；不新增测试分母或验收 authority |
| `07_implementation_plan_step_08_config_environment_dependencies.md` | 四 profile、五环境、七配置域、依赖分类和 unavailable posture | 只继承 `configured ≠ enabled ≠ ready` 与 fail-closed；不选技术产品或默认值 |
| `07_implementation_plan_step_09_spikes_risks_open_questions.md` | 12 个 Spike、18 个风险、16 个待确认、回写矩阵和停止规则 | 只将其执行化为控制动作；不把 planned/blocked 变成 executed/accepted |
| `03-详细设计.md`、`04-配置设计.md`、`05-测试方案.md`、`06-验收标准.md` | 当前设计、配置、测试和验收 truth source | 冲突时必须暂停并回写 owning document，不由 07 自行选边 |
| 实施计划 SOP、书写规范、中间产物规范、可落码标准、实施台账规范 | Step 10 的输出结构、恢复顺序和门禁字段 | 不以项目计划改写通用规范 |

### 2.2 本步输出

- 统一动作词表和停止优先级。
- 暂停规则表：触发条件、动作、责任方、必须保留的安全证据和恢复条件。
- 回退规则表：当前 WIP、已提交 boundary、已验证 phase、失败 artifact 和用户改动的保护范围。
- 变更控制与上游回写矩阵：03/04/05/06/07 及外部 owner seam 的触发、baseline、重审范围和禁止临时处理。
- `GATE-01`～`GATE-12` 失败处理矩阵，以及 blocked/not_run/timeout/flaky/incomplete/unknown 的保真规则。
- 外部依赖不可用、配置不可用、工具不可用和证据不可物化时的 continue / pause / fail-closed 分流。
- failed/partial artifact、report、check、run 和 predecessor/supersedes 的保留与新 run 规则。
- 六个 phase、18 个 boundary 的暂停/恢复审计和恢复前 checklist。
- 可回填未来正式 `07-实施计划.md` §10 的草稿。

### 2.3 强制约束

1. 不允许用“视情况处理”“实现时确认”或“先继续再补文档”代替明确动作。
2. 设计真相源冲突、字段/DTO/state/port/evidence 缺口和 phase 越界必须先 `pause`；实现者不得在代码中补 schema、状态、ref、mapper、port、artifact 字段或 gate 分母。
3. 回退优先保护上一已验证 boundary、失败证据和用户已有未提交改动；不得默认使用破坏性 git 操作，不得删除失败材料制造 clean history。
4. P0、VETO、truth/security/dependency/config/evidence-integrity 红线不得风险接受；risk acceptance 不能替代实现、required seam、测试或 review。
5. 失败修复后的重跑必须使用新的显式 `run_id`，通过 `predecessor`/`supersedes` 关系连接旧 run；不得覆盖旧 artifact、report、status、digest 或 verdict 输入。
6. 外部正向 seam 未闭合时只能进入已定义的 semantic negative/controlled/disabled lane；不能用 fake success、private implementation、local log、ACK、PID、port 或缓存冒充 owner truth。
7. 本 Step 的设计层 `pass_for_step_11` 不表示任何实现、测试、提交、验收或 readiness 通过。

## 3. SOP 问题回答

| SOP 问题 | Runner 收口回答 |
|---|---|
| 哪些情况必须暂停当前阶段？ | 设计 truth 冲突或缺失、字段/DTO/state/ref/port 不能 1:1 落码、phase/boundary 越界、P0 或 selected required gate 失败、VETO/安全/证据完整性红线命中、配置 fail-open、Query 写入、Consumer payload/ACK/cursor、Job owner repair/replay、event/outbox/topic 非零、private seam、静态或跨 run evidence、实现仓/工具/authority 缺失，均必须暂停受影响 boundary/phase。 |
| 哪些情况允许回退到上一个提交边界？ | 当前 boundary 尚未形成有效提交且 WIP 无法在原 scope 内修复、混入跨 boundary 改动、上游新 baseline 使 WIP 过期、或已确认当前边界粒度错误时，可撤回/重组当前 boundary；已验证 boundary、用户未提交改动和失败证据默认不回退。 |
| 哪些情况必须回写详细设计或测试方案？ | 任何 schema、DTO、状态迁移、错误/恢复、port/adapter、持久化保证、配置 key/profile/source、TC/CUT/suite/data/evidence、artifact/report schema、AC/AR/TX/NFA/VETO、phase/boundary 或 owner public seam 变化，都必须回写对应 truth source，并同步受影响的 07 表。 |
| 门禁失败后如何处理？ | 原始 failed/partial artifact、report、check、stdout/stderr 和安全摘要先保留；标记原始结果，不从分母删除；按 failure class 修复或回写设计，建立新 run，执行最小或全量受影响回归，再更新 gate 和台账。 |
| 外部依赖不可用时是否允许继续局部实施？ | 依赖分类决定动作：实现仓/技术 authority、必要编译依赖、required SDK seam、配置 builder、证据工具和当前 selected positive seam 缺失时暂停；与当前 negative lane 无关的运行期/事件协作依赖可在正式 semantic fake/controlled/disabled 合同下继续，但不能宣称 positive readiness。 |
| 恢复实施的条件是什么？ | blocker 已解除或已由 owning document 明确关闭，新的 design baseline 已固定，受影响 phase/boundary/gate/risk/evidence mapping 已重审，工作区范围干净，失败材料保留，新的 run 和 required checks 已完成，且不存在不可接受的 VETO/P0 finding。 |
| 字段缺失、状态冲突、DTO 不完整或 phase 越界如何处理？ | 立即记录 blocker 和来源位置，`pause + wait_design/change-upstream`；不在实现仓添加默认值、字符串 ref、隐式转换、私有 map、状态压缩或后续 phase 依赖。设计修复后从当前 boundary 重新执行开工闭环复核。 |

## 4. 当前文档问题诊断

| 问题 | Step 10 前的风险 | 本 Step 处理 |
|---|---|---|
| Step 6 有 boundary，但没有统一停工语言 | 实现者可能在 gate 失败后继续写后续 boundary | 固定 `pause / local-fix / rollback-current / change-upstream / controlled-revert / resume` 六类动作 |
| Step 7 有失败分类，但失败材料可能被覆盖 | 复验和审计缺少原始上下文 | 规定 failed/partial raw、report、check、safe failure reason 永久保留，修复使用新 run |
| Step 8 有依赖 posture，但未绑定恢复 | fake、disabled、blocked 可能被误当 ready | 增加按依赖类型分流、selected seam fail-closed 和恢复条件 |
| Step 9 有回写矩阵，但未明确 baseline 重建顺序 | 设计改动后旧 gate/evidence mapping 可能继续使用 | 规定 pause → 回写 truth source → 固定新 baseline → 受影响表重审 → 新 run/resume |
| Query/Consumer/Job/事件零残留红线不同 | 统一回退可能漏掉副作用 | 分别在 GATE-05/06/07/09 和对应 boundary 中设置独立停止条件 |
| 实现移交前不得创建 implementation ledger/skeleton | 过早文件会伪造实施事实 | 所有恢复规则只写计划口径；Step 13 前仍保持 `implementation_ledger_allowed=false` |

## 5. 改动前后对比与设计取舍

### 5.1 改动前后对比

| 议题 | Step 10 前 | Step 10 后 | 作用 |
|---|---|---|---|
| 暂停 | blocker 分散于 Step 7～9 | 触发、动作、责任、证据、恢复条件成表 | 可直接执行和审计 |
| 回退 | 只知道 boundary 可回退 | 只回退当前未验证 WIP，保护前序验证、用户改动和失败证据 | 限制影响面 |
| 变更 | 有回写触发但无顺序 | 统一 baseline 更新和受影响 boundary 重审顺序 | 防止文档/代码双真相 |
| 门禁失败 | 可能只保留最后一次结果 | 原始失败不可覆盖，新 run 通过 predecessor/supersedes 连接 | 保留可追溯故障链 |
| 外部不可用 | 有 blocked posture 但恢复点分散 | 按 compile/runtime/event/tool/authority/selected seam 分流 | 防止 fake success 或过度暂停 |
| phase/boundary 审计 | 只有 phase 停审 | 六 phase、18 boundary 都有 pause/resume 入口 | 防止局部变化漏审 |

### 5.2 设计取舍

| 方案 | 优点 | 风险/代价 | 结论 |
|---|---|---|---|
| gate 失败后继续后续 boundary | 表面推进快 | 污染后续设计和证据，返工范围不可控 | 不采用 |
| 只暂停受影响 boundary，允许无关 negative lane 继续 | 保留可验证增量 | 需要明确 carve-out 和 blocker 记录 | 采用，且不得把 negative lane 写成 positive ready |
| 默认回退多个已验证 boundary | 操作简单 | 破坏已验证证据和用户改动 | 不采用 |
| 只回退当前未验证 WIP，已提交错误用新修复或受控 revert | 保护稳定点、可审计 | 需要保留更多历史材料 | 采用 |
| 删除失败 artifact 后重跑 | 输出看起来整洁 | 丢失缺陷上下文、无法审计 | 不采用 |
| 失败材料保留，新 run 证明修复 | 可追溯、可比较 | 存储量增加 | 采用 |
| 实现者先补字段再回写 | 短期可编译 | 破坏 truth ownership 和 1:1 落码 | 不采用 |
| 先回写真相源、固定新 baseline，再恢复实现 | 设计与实现可复现 | 需要等待设计闭环 | 采用 |

## 6. 结构化中间产物

### 6.1 统一动作词表

| 动作 | 语义 | 允许范围 | 禁止误用 |
|---|---|---|---|
| `pause` | 停止当前 boundary/phase 的继续实现、提交或 handoff，保留现场 | 设计缺口、gate 失败、红线、依赖或证据阻塞 | 不能以“先继续其他 boundary”掩盖未记录 blocker |
| `local-fix` | 不改变正式 truth source、scope 或 gate 分母，在当前 boundary 内修复已知实现/fixture/报告问题 | 普通实现缺陷、确定性工具错误、已闭合设计内的修复 | 不能新增 schema、port、state、scope 或隐式 fallback |
| `rollback-current` | 撤回当前 boundary 未验证 WIP，回到上一已验证状态 | 方向错误、越界混入、无法安全修复的未提交改动 | 不能触碰用户已有未提交改动或删除失败证据 |
| `change-upstream` | 回写拥有 truth 的 03/04/05/06/07 或标准，并生成新的设计基线 | schema、状态、配置、测试、验收、依赖和 boundary 变化 | 不能只改实现仓或只改 Step 10 表 |
| `controlled-revert` | 对已提交且确认错误的 boundary 使用显式修复提交或受控 revert | P0 缺陷、错误依赖或无法局部修复的已提交内容 | 不能重写公共历史或覆盖后续已验证结果 |
| `resume` | 依恢复条件重新读取基线、重跑闭环和门禁后继续当前/重审 boundary | blocker 已解除且证据链完整 | 不能仅凭口头同意或 risk note 恢复 |

动作优先级固定为：

```text
truth / security / evidence / dependency / VETO finding
        -> pause
        -> preserve failed material
        -> wait_design 或 local-fix
        -> 必要时 rollback-current / controlled-revert
        -> change-upstream + new baseline
        -> affected gate / regression
        -> resume
```

### 6.2 暂停规则表（设计、边界与安全）

| 编号 | 触发条件 | 动作 | 责任方（候选） | 必须保留的证据 | 恢复条件 |
|---|---|---|---|---|---|
| `PAUSE-01` | 03 的字段、DTO、typed ref、状态、transition、error、port 或 UoW 不能闭合 | `pause + change-upstream` | 实现负责人、03 truth owner | blocker note、正式章节/Step 引用、影响 boundary | 03 与受影响 05/06/07 已同步，新 baseline 固定，boundary 复核通过 |
| `PAUSE-02` | 04 的 profile/source/selector/secret/readiness 或 failure semantics 不足 | `pause + change-upstream` | 配置负责人、安全 reviewer | config item、来源冲突、profile/environment 影响 | 04 truth 闭合，strict whole-document 和 fail-closed 复核通过 |
| `PAUSE-03` | 05 的 TC/CUT/suite/data/artifact/report/evidence schema、分母或状态冲突 | `pause + change-upstream` | 测试负责人、实施计划负责人 | 旧/新 mapping、缺字段、slot/路径影响 | 05 更新并完成 Step 7/9/10 受影响审计，新的 run 规则明确 |
| `PAUSE-04` | 06 的 AC/AR/TX/NFA/VETO、target tier、risk eligibility 或 exit semantics 改变 | `pause + change-upstream` | 验收负责人、产品/GRC authority | acceptance diff、VETO/target-tier 影响、旧 verdict 输入（若存在） | 06 更新，VETO/证据/回归 mapping 重审；当前无实际 verdict |
| `PAUSE-05` | phase/boundary 引入后续 phase 对象、结果、证据或 owner truth | `pause + change-upstream` | 实施计划负责人、设计负责人 | boundary scope diff、依赖图、越界代码/计划位置 | Step 6/7/9/10/11/12 同步，boundary 可独立验证 |
| `PAUSE-06` | 发现 private Sandbox/Runtime/SDK、直接 DB/bus/topic、缓存当 authority 或 `latest` | `pause + rollback-current`；必要时 `change-upstream` | 架构/安全 reviewer | dependency scan、调用路径、违规引用（安全脱敏） | 正式 public seam/negative lane 闭合，boundary scan clean |
| `PAUSE-07` | Query/read-model/refresh/reconcile/probe 写入、创建 identity 或改变 owner truth | `pause + local-fix` 或 `change-upstream` | 应用/读模型负责人 | before/after identity、write trace、no-write report | no-write gate 和受影响 TC/AC/VETO 复验通过 |
| `PAUSE-08` | Consumer 解析 payload、hash、写 cursor、ACK 或 Runner outbound event/outbox/topic 非零 | `pause + controlled-revert` 或 `change-upstream` | Consumer/架构/安全负责人 | call/write trace、event-zero scan、header/receipt 记录 | header-first/no-ACK/no-payload 和 event-zero 检查通过 |
| `PAUSE-09` | Job repair/replay/reclaim/resume owner truth，或 Unknown/Blocked 被压成 Failed/Partial | `pause + rollback-current` | operations/安全/03 truth owner | claim/checkpoint/report、terminal mapping、replay trace | local-only/no-repair/no-replay 复验通过，状态映射不丢失 |
| `PAUSE-10` | raw body/secret/path/URL/PID/port/stack/upstream body 进入 view/log/report/artifact/handoff | `pause + local-fix`，必要时隔离材料 | 安全/Observability/测试负责人 | redaction finding、受控位置和类别；不回显秘密 | 移除泄露面，redaction/forbidden corpus 全量复扫通过 |
| `PAUSE-11` | static evidence、cross-run pairing、digest/source mismatch、缺 raw/report pair 或 cleanup residue | `pause + change-upstream` 或 `local-fix` | 测试/验收/实施负责人 | link/pairing/cleanup report、run refs、残留摘要 | same-run pair、cleanup、no-static 检查通过；不生成 EV/handoff |
| `PAUSE-12` | worktree 混入用户改动、无关 boundary 文件或目标仓路径不符 | `pause + rollback-current` | 实施负责人 | `git status`/scope snapshot、ownership note | 当前 boundary 范围恢复，用户改动保持原样，Scope Gate 通过 |

### 6.3 暂停规则表（门禁、依赖与事实边界）

| 编号 | 触发条件 | 动作 | 未确认前姿态 | 恢复条件 |
|---|---|---|---|---|
| `PAUSE-13` | 任一 required Test/Evidence Gate failed、unavailable 或 status 被压平 | `pause`；按 gate 类型 `local-fix`/`change-upstream` | `blocked/not_run/incomplete`，不提交、不 handoff | 原始失败保留，修复后新 run 通过受影响 gate |
| `PAUSE-14` | `VETO-RUN-*`、P0 truth/security/dependency/config/evidence integrity finding | `pause`，禁止 risk acceptance | 不得形成 verdict/signoff/readiness | 红线修复、VETO checklist 不触发、独立复核完成 |
| `PAUSE-15` | `RUN-DDD-001~003` 或技术 authority/实现仓/本地 store guarantee 未闭合 | `pause + wait_design` | 不创建仓、不填 baseline、不锁 package/path/backend | authority 与 required guarantee 正式到达并重审 PH-01/受影响 boundary |
| `PAUSE-16` | `RUN-UP-001~008` required positive seam 未闭合 | `pause` 受影响 positive lane；可继续独立 negative lane | `blocked/waiting/not_run`，禁止 private fallback | owner public contract 到达，03/04/05/06 mapping 更新，新 baseline 固定 |
| `PAUSE-17` | `RUN-OPS-001~002` 真实 integration/GRC/SLO/retention/baseline 不可裁决 | `pause` PH-06/release lane | `baseline_blocked/not_run` | authority、环境、fixed run、review/retention 条件全部具备 |
| `PAUSE-18` | formal 07、implementation ledger 或 boundary skeleton 被提前创建/伪造 | `pause + rollback-current` | 设计移交不允许继续 | 删除/隔离越界计划性产物（仅在用户授权且安全可恢复时），回到 Step 时序 |
| `PAUSE-19` | 用户要求扩大范围、改变 target tier 或继承 README/旧技术选择 | `pause + change-upstream` | 不自动采纳，不改变历史 truth | 用户/authority 明确范围，00/01/03/04/05/06/07 影响审计完成 |
| `PAUSE-20` | 需要实际 run、baseline、artifact、report、evidence、verdict 或 signoff 才能继续，但无授权/环境 | `pause + wait_design` | `not_created/not_entered` | 获得相应 authority 后按新 run/preflight 规则启动 |

### 6.4 回退规则表

| 编号 | 触发条件 | 允许回退范围 | 必须保护 | 必须保留的证据 | 恢复条件 |
|---|---|---|---|---|---|
| `ROLLBACK-01` | 当前 boundary 尚未提交且实现方向无法在既有设计内修复 | 仅当前 boundary 的未提交 WIP | 上一已验证 boundary、用户已有未提交改动、失败材料 | worktree snapshot、当前 diff、失败 gate 和 blocker note | 回到上一已验证状态；重新读取当前 boundary 后再开工 |
| `ROLLBACK-02` | 当前 boundary 混入后续 phase、无关文件或其他 boundary 的改动 | 越界文件/代码和未验证批次 | 同 boundary 已通过且仍有效的代码、用户改动 | scope 分类表、路径清单、boundary diff | scope 恢复到 allowed scope，Scope Gate 重新通过 |
| `ROLLBACK-03` | 上游 truth source 形成新 baseline，旧 WIP 已不能 1:1 对应 | 与旧 baseline 相关的未提交 WIP；必要时对已提交内容作受控修复 | 新旧 baseline、无关已验证 boundary、原始失败报告 | baseline diff、影响 boundary 矩阵、旧 run lineage | 新 baseline 固定，受影响 boundary 经验复核和 gate 重跑 |
| `ROLLBACK-04` | 已提交 boundary 发现 P0/VETO/安全或 truth 缺陷 | 优先新修复提交；无法局部修复时才对该 boundary 做 controlled-revert | 后续已验证 boundary、公共历史、失败证据 | defect、原 commit 引用、revert/修复理由、回归结果 | 修复提交或受控 revert 完成，受影响 phase 全量回归通过 |
| `ROLLBACK-05` | report/check writer 生成了错误 schema、错误 run link 或静态 evidence | 当前 report/check capability 的未验证改动；不删除已生成失败材料 | raw run、source digest、同 run 关系 | 错误报告、pairing/link 检查、writer diff | writer 修复，新 run 重新物化 raw/report/check；旧材料保留 |
| `ROLLBACK-06` | external effect 状态 Unknown、lease/cleanup 保护轴未知或 orphan 未能确认 | 不回滚/删除外部资源；只回退本地未验证 WIP 到 RecoveryCase 可表达的状态 | lease、保护资源、owner truth、RecoveryCase | effect receipt、readback 缺口、cleanup journal、人工处置引用 | 正式 readback/lease/cleanup seam 到达并通过 guard 复核；不得用删除制造成功 |
| `ROLLBACK-07` | cleanup failure、redaction failure 或 evidence residue 影响完整性 | 当前 boundary 的未验证输出和受污染的派生报告；受保护 raw 按安全策略隔离 | 原始失败材料、受保护资源和审计链 | cleanup/redaction incident、隔离位置和安全摘要 | 清理/隔离完成、扫描通过、新 run 重新生成完整 pair |
| `ROLLBACK-08` | 用户工作区已有未提交改动与 boundary WIP 无法区分 | 只撤回可证明属于本 boundary 的 WIP | 用户改动、未识别归属的文件 | 起始/当前 `git status`、ownership note、文件 hash（若可安全记录） | Scope Gate 明确归属后继续；不能猜测或覆盖用户改动 |

回退硬规则：

- 不以 `git reset --hard`、批量删除或覆盖目录作为默认恢复手段；实现阶段如需破坏性动作必须另获授权，本设计阶段不执行任何回退。
- 已验证阶段不是可随意重写的缓存；若整体设计变化确实波及它，必须通过新 baseline 和影响矩阵显式重开，而不是静默回滚。
- failed/partial artifact、report、check、cleanup journal 和 blocker note 不是噪声，不得删除、覆盖或改写成 `pass`。
- external effect 未知时，回退本地决策不得等同于回退外部副作用；必须保持 `Unknown/RecoveryCase` 和人工/owner 交接边界。

### 6.5 变更控制与上游回写矩阵

| 变更类型 | 触发条件 | 必须回写的真相源 | 需同步的 07 产物 | 评审/恢复门禁 | 禁止临时处理 |
|---|---|---|---|---|---|
| `design-schema` | domain 字段、DTO、typed ref、enum、transition、error、mapper、UoW 或 persistence guarantee 变化 | `03-详细设计.md` 对应 Step 6～15；必要时 `02-概要设计.md` | Step 4/5/6/7/9/10，受影响 boundary ledger 计划 | 字段/DTO/state/metadata/idempotency/phase closure；新 baseline | 实现端新增字段、默认值、字符串 ref、隐式转换 |
| `flow-state` | Accepted/Running/Confirmed/Cleaned、Unknown、RecoveryCase、claim/checkpoint、no-replay 语义变化 | `03` flow/state/error/recovery/concurrency；必要时 `06` | Step 6/7/9/10/12，AC/TX/VETO mapping | state matrix、UoW、failure/recovery、受影响 TC/AC 复核 | 把 Unknown 压成 Failed、用 ACK/PID/log 推导 truth |
| `config-profile` | profile、source、selector、limit、feature、secret resolver、readiness 或 failure mode 变化 | `04-配置设计.md` 及 04 calibration | Step 7/8/9/10，CFG/SECURITY boundary | strict whole-document、configured/enabled/ready、redaction、profile isolation | leaf override、hot reload、LKG、历史默认值、fake product fallback |
| `test-evidence` | TC/CUT/suite/data/environment/slot、artifact/report schema、分母、pairing 或 blocker 分类变化 | `05-测试方案.md` 及 05 calibration | Step 7/9/10/12，主归属和 Boundary Gate Matrix | direct + impacted regression；same-run/link/pairing/no-static | 直接改 07 映射、删除 blocked TC、跨 run 补 evidence |
| `acceptance` | AC/AR/TX/NFA/VETO、target tier、entry/exit、risk eligibility、review authority 变化 | `06-验收标准.md` 及 06 calibration | Step 7/9/10/12，handoff/decision 条件 | VETO/target-tier/fixed-run/independent review 重审 | 风险签字绕过 VETO、降低 tier 不重建 baseline、手写 verdict |
| `implementation-plan` | phase、boundary、required read、gate、ledger、handoff 或 rollback scope 变化 | 07 flow 与对应 Step 文件；必要时正式 07 仅在 Step 13 | Step 5/6/7/8/9/10/11/12、项目台账 | phase/boundary 独立性、证据归属、停审和回退矩阵 | 在 Step 13 前创建正式 07/implementation ledger/skeleton |
| `owner-seam` | Artifact/Governance/Sandbox/Runtime/Observability/Archive/platform/L0-sdk public contract、version、error、redaction、lease 或 transport 到达/变化 | 对应上游项目正式文档与台账；再回写 Runner 03/04/05/06 | SP、dependency matrix、受影响 phase/boundary、risk/open-question | public seam compatibility、negative/positive lane、selected run 重新 preflight | 猜 DTO/API、复制 private implementation、直接关闭 blocker |
| `scope-tier` | 用户扩大范围、改变 target tier、把历史技术选择升级为正式约束 | 00/01/03/04/05/06/07 按影响链 | Step 2/5/7/8/9/10/12、授权记录 | 用户/authority 明确、全链影响审计、新 baseline | 自动继承 README/draft/旧文档或偷偷把 P1/P2 纳入 P0 |
| `reusable-experience` | 新 blocker 可泛化到多个项目或反复出现 | 对应标准/SOP/可落码标准或项目记忆种子（按规范） | Step 3/10/11/12、设计修复记录 | 横向扫描、正反例、项目归属和提交合并检查 | 仅在聊天中总结；把项目临时事实写成永久规则 |

### 6.6 新 baseline 与重开顺序

```text
发现冲突 / 失败 / 依赖变化
  -> pause 受影响 boundary 与 phase
  -> 记录 blocker、source 引用、scope、当前 gate 和证据位置
  -> 回写 owning truth source
  -> 固定新的 design baseline（不覆盖旧 baseline）
  -> 重审 Step 4/5/6/7/8/9/10 中受影响映射
  -> 重审 boundary required reads / allowed scope / forbidden scope / checks
  -> 重新建立 run predecessor/supersedes 关系（若需要执行）
  -> 通过恢复前 checklist 和 affected gates
  -> resume 当前或重新规划的 boundary
```

| 变更来源 | 最小必须重审范围 | 额外动作 |
|---|---|---|
| `03` 对象/协议/flow/state/错误/持久化变化 | Step 4 deliverables；Step 5 phases；Step 6 boundary；Step 7 gate；Step 9 risk；本 Step pause/rollback | 检查所有 `Accepted ≠ Running`、`Confirmed ≠ Cleaned`、Unknown/RecoveryCase、Query/Consumer/Job 红线是否仍闭合 |
| `04` 配置/profile/source/readiness 变化 | Step 7 CFG/SECURITY；Step 8 profile/environment/dependency；Step 9 risk；本 Step | 重新核验 whole-document、source priority、redaction 和 `configured ≠ enabled ≠ ready` |
| `05` TC/suite/evidence/report/分母变化 | Step 7 全部 gate/主归属；Step 9 risk；本 Step gate-failure；Step 12 completion | 旧 slot/mapping 标为 superseded 或 incomplete，不跨 run 拼接 |
| `06` AC/VETO/NFA/target-tier/review 变化 | Step 7 acceptance mapping；Step 9 residual/risk；本 Step；Step 12 | required/VETO 变化时不得沿用旧 verdict 输入，必须重新 preflight |
| `07` phase/boundary/gate/handoff 变化 | Step 5～12 受影响表、项目台账和 flow | 保持正式 07 与 implementation ledger 的 Step 13 时序 |
| 上游 owner seam 到达/变化 | 对应 SP、Step 8 dependency、Step 7 controlled gate、Step 9 risk；Runner 03/04/05/06 | 先验证 public seam，再允许 positive lane；不能因目录存在自动清 blocker |

### 6.7 门禁失败处理矩阵

| Gate | 典型失败/不可用 | 动作与状态 | 必须保留 | 恢复/复验 | 是否可风险接受 |
|---|---|---|---|---|---|
| `GATE-01` contract/schema/typed carrier | DTO、ref、schema、entry result 无法构造或 public seam 不一致 | `pause + change-upstream`；boundary `blocked` | contract diff、编译/构造失败摘要、影响 mapping | 03/owner seam 闭合，新 baseline，contract TC 新 run | 否，P0 truth/contract |
| `GATE-02` domain/state/axis | enum、transition、axis separation 或 factory 不一致 | `pause + local-fix` 或 `change-upstream` | state failure、case/report、旧/新状态映射 | state/domain TC 与 AC/TX 受影响回归 | 否，状态 truth 不可接受 |
| `GATE-03` service/UoW/idempotency/recovery | 保存顺序、duplicate、version、RecoveryCase 或 no-replay 失败 | `pause + local-fix`；必要时回写 03 | UoW trace、stored result、失败 run | 新 run 的 service/UoW/replay gates；保持 predecessor | 否 |
| `GATE-04` controlled/public owner seam | selected seam 不可用、private fallback 或错误 outcome | 受影响 positive lane `blocked/not_run`；禁止 fake success | dependency report、slot posture、blocked reason | owner public contract、compatibility matrix、controlled gate 新 run | 否，不能用风险接受替代 required seam |
| `GATE-05` Query/read-model no-write | query refresh/reconcile/probe/upsert/write 或隐式 identity | `pause + rollback-current`；VETO candidate | write trace、before/after identity、no-write report | 修复后 Query/no-write/visibility 新 run | 否 |
| `GATE-06` Consumer header-first/no-ACK | payload parse/hash、cursor/owner write、ACK、event/outbox/topic 非零 | `pause + controlled-revert/change-upstream` | call graph、header/receipt、event-zero scan | header-first/no-ACK/no-payload 和 event-zero 新 run | 否 |
| `GATE-07` Job local-only/no-repair | owner repair、replay/reclaim/resume、claim fence 或 terminal mapping 丢失 | `pause + rollback-current` | claim/checkpoint/report、replay trace、terminal result | job/replay/no-repair 新 run；Blocked/Unknown 保真 | 否 |
| `GATE-08` strict config/readiness | unknown/duplicate/invalid、leaf override、profile contamination、fail-open | `pause + change-upstream` 或 local fix | full-document validation、redaction、profile marker | config/controlled/security 新 run；不 LKG fallback | 否 |
| `GATE-09` security/dependency/redaction | raw secret/body/path/URL/PID/port、private dependency、scanner unavailable | `pause`；隔离材料，必要时 rollback | 安全摘要、扫描状态、受控位置；不回显秘密 | 修复/工具恢复后全量相关扫描，新 run | 否 |
| `GATE-10` artifact/report/pairing | missing pair、cross-run、digest mismatch、static evidence、cleanup residue | `pause + local-fix/change-upstream` | raw/report/check、link/pairing/cleanup 失败报告 | same-run 重新物化；旧材料不覆盖 | 否 |
| `GATE-11` AC/VETO/target-tier | required gate failed/blocked、VETO hit、baseline/fixed run 缺失 | `pause` PH-06/release；`baseline_blocked/not_run` | selected run、VETO checklist、open issues | target-tier、baseline、fixed-run、required checks 和独立 review 新 run | 否 |
| `GATE-12` handoff/review/completion | review 缺失/争议、open issues 未处理、伪 handoff/verdict | `pause + wait_design` 或补 review | draft、review/dispute、source digest、handoff 输入 | 独立 review、pairing、VETO 和 completion inputs 重新通过 | 否；不生成 signoff |

失败状态保真：`blocked`、`not_run`、`timeout`、`flaky_suspected`、`dependency_unavailable`、`harness_infra_failure`、`redaction_failure`、`cleanup_failure`、`incomplete`、`unknown`、`review_disputed` 不得从分母删除、不得压为 `pass`，也不得通过风险接受改写成 readiness。

### 6.8 外部依赖不可用处理矩阵

| 依赖/资源 | 缺失或不可用时 | 允许继续的最小范围 | 禁止动作 | 恢复条件 |
|---|---|---|---|---|
| 目标实现仓、语言/runtime/GUI/CLI/packaging authority | `pause + wait_design`，停止 PH-01 | 仅设计仓 calibration 记录 | 创建仓、猜 package/crate/binary/path | authority、仓和工具基线正式到达，重审 PH-01 |
| L0-sdk exact package/export/version/error/redaction seam | 受影响 boundary `blocked/not_run` | 已定义 contract/negative lane | 复制 private SDK、猜方法或把目录存在当 ready | public seam compatibility matrix 通过，重跑受影响 gate |
| Artifact/Governance release/approval/integrity seam | PH-02/PH-06 positive lane blocked | explicit selector、negative qualification、blocked UI/state | 本地批准、latest、cache-as-authority、读内部 DB | owner public contract、scope/baseline/revoke/integrity 闭合 |
| Sandbox/Runtime/platform request/readback/lease/cleanup seam | PH-03/PH-06 blocked | typed Unknown/Conflict/RecoveryCase 和 controlled negative | ACK/PID/port/log 推导 Running，自动 replay/reclaim/delete | request/effect/readback/lease/cleanup public seam 通过 |
| Observability/Archive safe view/handoff/retention seam | PH-04 附加视图或 PH-06 handoff blocked | bounded no-content/Degraded/Blocked view | local log 作为 evidence/audit，复制 Archive truth | safe DTO、redaction、visibility/freshness/retention 合同通过 |
| local store/cache atomicity/locking/migration/corruption guarantee | 受影响 UoW/IDM/JOB/PROJECTION boundary blocked | 只做不宣称 durable 的 contract/semantic negative | 用 in-memory fake 冒充 product durable、LKG fallback | guarantee authority 到达并通过 restart/fault/cleanup checks |
| config source/secret resolver/scanner/report writer | 当前 CFG/SECURITY/EVIDENCE gate fail-closed | schema/invalid corpus 的纯设计检查 | 默认值、leaf override、真实 secret、关闭 scanner | source/resolver/tool authority 恢复，新的同 run checks |
| Consumer transport/header/schema/dedup/receipt seam | PH-05-a positive lane blocked | header-first negative/strict stored duplicate（若契约已闭合） | parse payload、hash、ACK、写 cursor、创建 outbound event | public header/receipt contract 和 event-zero scan 通过 |
| Job scheduler/store/claim/checkpoint authority | PH-05-b/c blocked | local job contract、negative claim/replay cases | owner repair、自动 replay/resend/reclaim/resume | scheduler/store/claim authority 和 durable parity 通过 |
| cross-platform host resource/port allocation authority | PH-03/PH-06 blocked | conflict/unknown/unsupported posture | 锁 OS 命令、资源数值或自行 allocation | platform taxonomy、allocation/cleanup ownership 正式闭合 |
| integration/GRC/SLO/capacity/retention authority | PH-06 release/handoff `baseline_blocked/not_run` | P0 semantic/controlled negative，不计 product readiness | 继承 README 阈值、手写 verdict/signoff | target tier、fixed run、review/GRC、retention/SLO authority 全部到达 |

依赖类别规则：编译期依赖缺失停止需要它的 boundary；运行期/事件协作依赖只能按正式 semantic adapter/fake/controlled/disabled lane 分流；任何 unavailable 都不能静默变成 success、ready 或 qualified。

### 6.9 失败材料、run lineage 与证据保留规则

#### 6.9.1 失败材料保留表

| 材料类别 | 失败/暂停时必须保留 | 禁止行为 | 后续使用 |
|---|---|---|---|
| 原始 case/suite/check artifact | 原始 `run_id`、case/suite/check 状态、输入引用、source/config digest、safe failure category | 删除、覆盖、把 `blocked` 改成 `pass`、从分母删除 | 缺陷诊断、复验输入、回归比较 |
| stdout/stderr 或工具输出 | 仅保留已按安全规则脱敏的摘要、退出分类和位置引用 | 将 raw secret、body、path、URL、PID、port 或 stack 回显到 report | 工具故障定位、redaction 复核 |
| report / summary | 失败版本、生成器版本/身份（若正式可得）、输入 pair、未决项和状态 | 用新成功报告覆盖旧报告、跨 run 拼接、静态报告冒充 runtime evidence | 新 run 的 predecessor 对照、review/dispute |
| redaction/dependency/link/pairing/cleanup check | 检查状态、失败类别、受影响范围和安全位置引用 | scanner unavailable 记 clean；隐藏 finding；修改 raw digest | GATE-09/GATE-10/VETO 复验 |
| worktree / scope snapshot | boundary、allowed scope、用户已有改动和当前 diff 的归属记录 | 把用户改动纳入回退、用宽泛 reset 覆盖未知文件 | Scope Gate 恢复、controlled rollback |
| blocker/change note | blocker ID、truth source、引用位置、影响 phase/boundary/gate、责任方和恢复条件 | 只在聊天中记录、以“已知问题”代替状态 | 设计回写、baseline 重建、台账恢复 |
| cleanup / lease / RecoveryCase journal | 保护轴、未知外部 effect、lease/orphan/cleanup 状态及人工交接引用 | 强制 delete/release/evict 以制造清理成功 | PH-03/PH-06 恢复和安全交接 |

#### 6.9.2 新 run 与 predecessor/supersedes 规则

| 场景 | run 规则 | 证据规则 | gate 影响 |
|---|---|---|---|
| 同一 boundary 的普通修复复验 | 必须创建新的显式 `run_id`，记录 `predecessor=<failed_run>` | 新 raw/report/check 只引用同一新 run；旧 run 只读保留 | 旧 gate 仍为 failed/blocked；新 run 通过后才可更新当前 gate |
| 设计 baseline 变化 | 新 run 记录 `supersedes=<old_run>` 和新 design baseline；不得复用旧 baseline | 旧 mapping 标记 superseded/incomplete，不与新 run 合并 | 受影响 boundary/phase 全部重新 preflight |
| flaky/timeout/harness failure | 每次尝试使用独立 run；保存尝试序列和固定输入 | 不挑选绿色尝试；报告列出所有 attempt | 直到稳定复验或正式裁决前保持 blocked |
| dependency unavailable 后恢复 | 依赖恢复后的 run 必须记录 slot/authority/config 变化 | unavailable 期间的 blocked/not_run 不变为 positive result | selected gate 重新执行，不能用旧 negative 替代 |
| redaction/cleanup failure 后重跑 | 新 run 必须与隔离/清理记录关联 | 被污染材料按安全策略保留或隔离，不进入 evidence pair | GATE-09/10、VETO 候选重新判断 |
| phase 汇总/acceptance handoff | 只可引用同一 target tier、design/config/environment identity 下的有效 run | evidence index 只接受同 run raw/report/check pair | 缺 pair、跨 run 或 review 缺失时 incomplete/blocked |

固定规则：

- `predecessor` 说明失败/被替代的前一 run；`supersedes` 说明新 baseline 或新 scope 取代旧输入；二者不能用来抹除旧状态。
- `same-run` 的最小闭环为同一 run 的 raw case/suite/check、report、source/config/design identity、digest 和 cleanup 状态；receipt、local log 或 handoff draft 不能单独形成 evidence。
- 新 run 不能继承旧 run 的 `pass`、verdict、signoff 或 readiness；只能继承可追溯的失败上下文和输入引用。
- 当前没有实际 run，因此上述字段、路径和关系仅为计划合同，不得填写示例 hash、digest 或 run ID。

### 6.10 恢复实施检查清单

恢复动作必须按顺序执行；任一项未满足，`resume` 不可用。

| 顺序 | 恢复前检查 | 通过口径 | 失败动作 |
|---:|---|---|---|
| 1 | 读取项目级设计台账、07 flow、当前 Step、受影响正式文档和 calibration | 当前 Step、模块、gate、blocker、next action 与文件状态一致 | `pause`，修正台账/读取冲突 |
| 2 | 确认 source truth 与 design baseline | 正式 03/04/05/06/07（若已装配）与对应 calibration 无未解决冲突；owner seam 有版本/authority 记录 | `wait_design` + 回写 owning source |
| 3 | 确认 worktree/scope | 仅当前 boundary allowed scope；用户已有未提交改动保持原样；无越界文件 | `rollback-current` 或隔离改动 |
| 4 | 确认 blocker 状态 | 受影响 blocker 已关闭、转为明确 allowed negative lane，或保留为 blocked 且不再要求该 lane | 未关闭则不能 resume；更新 blocker note |
| 5 | 重新执行可落码闭环 | 字段、DTO、状态、typed ref、validation truth、metadata/idempotency、projection/rebuild、artifact materialization 和 phase boundary 逐项有正式来源 | 回写 03/04/05/06/07，不在代码补口 |
| 6 | 重新执行配置/环境 preflight | 完整 profile、source、environment、slot readiness、`configured/enabled/ready` 和 sensitive handling 可判定 | fail-fast，保持 blocked/not_run |
| 7 | 重新执行受影响 gate 选择 | 目标 Test/Evidence/Acceptance gate、TC/CUT/suite、AC/AR/TX/NFA/VETO 和 evidence owner 映射仍有效 | 重审 Step 7/9/10，不能沿用旧 mapping |
| 8 | 确认失败材料与 lineage | 旧失败材料只读保留，新 run 规划了 predecessor/supersedes；不跨 run 拼 pair | `pause`，补 retention/lineage 记录 |
| 9 | 确认红线扫描计划 | no `latest`、no private implementation、no direct DB/bus/topic、Query no-write、Consumer no-ACK、Job no-repair、event=0、redaction 和 cleanup 检查均有入口 | `pause`；不能把 scanner unavailable 记 clean |
| 10 | 确认 reviewer/authority 分离 | 设计、测试/证据、安全、验收/GRC 角色及权限来源已明确；实施者不自签 verdict | `wait_design`/`wait_review` |
| 11 | 运行新 run（未来才可执行） | 所有命令显式带 `run_id`、artifact/report root、profile；实际状态完整保留 | 失败则回到 6.9，创建下一新 run |
| 12 | 回写 boundary/项目台账 | 真实 gate 状态、blocker、next action、baseline 和 run lineage 已写入对应实施台账 | 不得进入下一 boundary/handoff |

恢复后仍必须满足：`Accepted ≠ Running`、`Confirmed ≠ Cleaned`、`Complete ≠ Verified ≠ Qualified`；`Unknown/Blocked/RecoveryCase` 不得被 UI、报告或汇总器压平。

### 6.11 六 phase 暂停与恢复审计

| Phase | 主要暂停触发 | 暂停时允许保留的局部工作 | 恢复前必须重审 | 不能宣称 |
|---|---|---|---|---|
| `PH-01` | 仓/语言/runtime/入口 authority、strict config、fixture/path、redaction 或 evidence root 未闭合 | 设计层 logical composition、invalid corpus、negative contract 计划 | `RUN-DDD-001~003`、Step 3/4/8/9/10、`commit-ph-01-a/b` | 不得宣称实现仓、工具链、配置 ready 或 evidence 可写 |
| `PH-02` | explicit selector、Artifact/Governance/integrity seam、qualification 轴或 cache authority 不明 | context/selection/material 的 typed negative/domain 计划 | 03 object/protocol/state、04 profile/source、GATE-01/02/04/08/09、`commit-ph-02-a/b/c` | 不得宣称下载、验证、approved、qualified 或可启动 |
| `PH-03` | Sandbox/Runtime/platform effect/readback、resource/lease/cleanup、UoW/store guarantee 缺失 | intent/state/guard/RecoveryCase 的 semantic negative 计划 | 03 flow/state/UoW/recovery/concurrency、GATE-03/04/05/07、`commit-ph-03-a/b/c/d` | 不得宣称 Running、Stopped、Cleaned、owner result 或自动恢复 |
| `PH-04` | safe DTO、redaction、visibility/freshness/source、Observability handoff 或 Query no-write 不闭合 | bounded no-content/Blocked/Degraded view 计划 | 03 query/presentation/observability、04 sensitive config、GATE-05/09/10、`commit-ph-04-a/b/c` | 不得宣称本地诊断是正式审计/evidence 或 Query 可刷新 |
| `PH-05` | Consumer header/receipt seam、Job claim/checkpoint/report、scheduler/store、event-zero 或 pairing 工具缺失 | header-first negative、local-only Job contract、report schema 计划 | 03 consumer/job/protocol/flow、05 evidence/report、GATE-06/07/09/10、`commit-ph-05-a/b/c/d` | 不得宣称 payload apply、ACK、owner repair、replay、outbound event 或 final evidence |
| `PH-06` | approved public seams、baseline/fixed run/environment、GRC/review/retention、same-run pair 或 VETO 清除缺失 | preflight checklist、blocked lane、审查模板计划 | 05/06 fixed-run、evidence、VETO、risk eligibility、Step 7/9/10/12、`commit-ph-06-a/b` | 不得宣称 release、verdict、signoff、risk acceptance 或 readiness |

### 6.12 18 boundary 暂停与恢复审计

| Boundary 组 | 暂停入口 | 恢复最小条件 | 默认未确认状态 |
|---|---|---|---|
| `commit-ph-01-a` | authority/path/dependency/event-zero 不闭合 | target repo/authority、逻辑 composition、dependency scan 和 scope gate 重审 | `blocked / wait_design` |
| `commit-ph-01-b` | config schema、profile/readiness、redaction/path/pairing 不闭合 | strict config、invalid corpus、artifact/report contract、GATE-08/09/10 重审 | `blocked / not_created` |
| `commit-ph-02-a` | selection DTO/state/generation/scope 不闭合 | explicit selector、typed ref、state/generation TC 和 GATE-01/02 复验 | `blocked / waiting` |
| `commit-ph-02-b` | material/integrity/cache/qualification/UoW 不闭合 | Complete/Verified/Qualified 分轴、duplicate/version、GATE-02/03 新 run | `blocked / not_run` |
| `commit-ph-02-c` | public SDK/authority/source/verifier seam、Query no-write 或 cache authority 不闭合 | compatibility matrix、semantic outcome、GATE-04/05/09 复验 | `blocked / waiting` |
| `commit-ph-03-a` | run/control/resource/guard state 或 Accepted/Confirmed shortcut | state/ref/source、resource conflict、guard TC 和 GATE-01/02 复验 | `blocked / waiting` |
| `commit-ph-03-b` | effect ordering、UoW、idempotency、stored result、Unknown mapper 不闭合 | reserve→call→readback/unknown→commit 设计闭合、GATE-03/04/09 新 run | `blocked / not_run` |
| `commit-ph-03-c` | RecoveryCase/manual review/no-replay、lease/orphan/readback 不闭合 | recovery matrix、manual review、claim/no-replay 和 GATE-03/07 复验 | `blocked / waiting` |
| `commit-ph-03-d` | lifecycle service、safe Query、store/entry authority 或 no-write 不闭合 | C07～C10/Q06～Q08、GATE-03/05/09 和 service/query regression | `blocked / not_run` |
| `commit-ph-04-a` | bounded preview/diagnosis/handoff schema、forbidden fields/redaction 不闭合 | safe field source、all-or-nothing redaction、GATE-01/09 复验 | `blocked / no_content` |
| `commit-ph-04-b` | Observability seam、visibility/freshness、handoff receipt/no-resend 不闭合 | public safe DTO、redaction/source/unknown、GATE-04/05/09/10 新 run | `blocked / waiting` |
| `commit-ph-04-c` | Q12 projection identity、generation/read section、Query no-write 不闭合 | committed read source、identity guard、static call/write audit | `blocked / not_run` |
| `commit-ph-05-a` | Consumer header/schema/dedup/receipt、payload/ACK/event-zero 不闭合 | header-first/no-ACK/no-payload、event-zero、GATE-01/06/09 新 run | `blocked / not_run` |
| `commit-ph-05-b` | Job DTO/claim/checkpoint/report/idempotency 不闭合 | public/local Job result surface、stored report/replay、GATE-01/03/07 复验 | `blocked / waiting` |
| `commit-ph-05-c` | local Job runner、generation/claim guard、no-repair/no-replay 不闭合 | local-only terminal matrix、durable/scheduler authority、GATE-07/09 新 run | `blocked / not_run` |
| `commit-ph-05-d` | script/check/report/index、same-run/pairing/no-static 不闭合 | tool authority、writer/check contract、GATE-09/10 复验 | `blocked / not_created` |
| `commit-ph-06-a` | approved seam、baseline/environment/fixed run、selected preflight 不闭合 | authority、target tier、fixed run、required checks、GATE-04/08/09/11 | `baseline_blocked / not_run` |
| `commit-ph-06-b` | same-run evidence/VETO/link/review/handoff 不闭合 | valid raw/report/check pair、independent review、GATE-10/11/12 | `incomplete / blocked` |

Boundary 恢复不自动激活后续 boundary；项目级实施台账只能有一个 `current_boundary`，其余保持 `planned / wait_until_current`（该骨架仅在 Step 13 创建）。

### 6.13 不得风险接受的事项

| 类别 | Runner 例子 | 处理 |
|---|---|---|
| Truth / contract | 本地判定 approved、把 ACK/PID/log 当 Running、把 Complete 当 Qualified、Unknown 压成 Failed | 必须修复或回写真相源，不得接受 |
| Security | raw body、secret、URL/path/PID/port/stack、private implementation 或 scanner unavailable | 立即隔离和修复，不得接受 |
| Dependency | required public seam 缺失、直接 DB/bus/topic、private SDK/Sandbox 复用 | 保持 blocked/not_run，不得接受 |
| Side effect | Query 写入、Consumer payload/ACK/cursor、Job owner repair/replay、Runner event/outbox/topic 非零 | VETO/P0，不能以局部绿色抵消 |
| Evidence integrity | static evidence、cross-run pairing、missing raw/report pair、digest mismatch、cleanup residue | evidence/handoff 不完整，不得接受 |
| Config | latest、leaf override、hot reload、LKG fallback、profile contamination、configured/enabled/ready 混淆 | fail-closed，不能用风险签字放行 |
| Baseline / authority | 无实现仓、技术 authority、fixed run、GRC/review、retention 或 target-tier | `baseline_blocked/not_run`，不生成 verdict/signoff/readiness |

其余非 P0 residual 也只有在 `06` 定义的 eligibility、target-tier evidence、VETO clear、授权 acceptor、scope/期限/触发/closure 全部具备后，才可进入正式风险裁决；当前不存在任何实际接受记录。

## 7. 跨表审计与回填草稿

### 7.1 规则一致性审计

| 审计项 | 结论 | 依据 | 当前事实边界 |
|---|---|---|---|
| 每个 pause 触发是否有明确动作 | `pass`（设计层） | `PAUSE-01~20` 均指定 `pause`、`wait_design`、`local-fix`、`rollback-current` 或 `change-upstream` | 未触发实际实现动作 |
| 每个 pause 是否保留证据并给出恢复条件 | `pass`（设计层） | §6.2～§6.3 每行包含责任、证据和恢复口径 | 无实际 artifact/report/run |
| rollback 是否绑定 commit boundary 且保护已验证结果 | `pass`（设计层） | `ROLLBACK-01~08` 与 Step 6 的 18 boundary 对齐；硬规则保护用户改动和失败材料 | 未执行 git 回退或提交 |
| schema/state/port/evidence 缺口是否回写 truth source | `pass`（设计层） | §6.5 `design-schema`、`flow-state`、`test-evidence`、`acceptance`、`owner-seam` 分流 | 未产生新 schema 或 baseline |
| 03 变化是否同步 04/05/06/07 影响 | `pass`（计划层） | §6.6 按来源列出最小重审范围 | 正式文档保持只读 |
| 配置是否保持 fail-closed 与 profile/environment 分离 | `pass` | §6.5、§6.8 维持 `configured ≠ enabled ≠ ready`、无 latest/leaf override/LKG | 未加载任何 profile |
| Query/Consumer/Job/event-zero 是否独立阻断 | `pass` | `PAUSE-07~09`、GATE-05/06/07/09、18 boundary matrix | 未执行静态或运行检查 |
| failed/partial artifact 是否不可覆盖 | `pass` | §6.9 明确保留 raw/report/check/cleanup/blocker material | 未生成实例 |
| 新 run 是否不继承旧 pass/verdict | `pass` | §6.9.2 的 predecessor/supersedes 与 same-run 规则 | 无真实 run lineage |
| external unavailable 是否有 continue/pause 分流 | `pass` | §6.8 按 authority、compile/runtime/event/tool/selected seam 分类 | 所有正向 seam 仍 blocked/waiting |
| VETO/P0 是否不可 risk-accept | `pass` | §6.7、§6.13；风险接受不替代实现/门禁/evidence | 无风险接受记录 |
| Step 13 时序是否保持 | `pass` | `PAUSE-18`、§6.12、flow §4 规定正式 07/implementation ledger/skeleton 后置 | 三类产物均未创建 |

### 7.2 Phase / boundary / gate 交叉审计

| 覆盖维度 | 检查结果 | 发现/处理 |
|---|---|---|
| `PH-01`～`PH-06` 均有暂停、回退、恢复入口 | `pass`（计划层） | §6.11 逐 phase 绑定 blocker、可保留 negative lane、恢复前重审和禁止宣称 |
| `commit-ph-01-a`～`commit-ph-06-b` 共 18 个均有停止条件 | `pass`（计划层） | §6.12 逐 boundary 绑定最小恢复条件和默认 blocked 状态 |
| Step 7 `GATE-01`～`GATE-12` 均有失败动作和复验 | `pass`（计划层） | §6.7 12/12 映射到 pause、保留物、新 run 和 risk-accept 口径 |
| Step 8 依赖类别均有 unavailable posture | `pass`（计划层） | §6.8 覆盖实现仓、SDK、owner seam、store、tool、platform、GRC |
| Step 9 Spike/risk/OQ 均有暂停或重开入口 | `pass`（计划层） | §6.5/§6.6 和 `PAUSE-15~20` 连接；未把 planned 变成 executed |
| evidence owner / same-run / cleanup 规则一致 | `pass`（计划层） | §6.9 与 Step 7 GATE-10/11/12 对齐；handoff receipt 不等 evidence |
| 上游变化是否可能遗漏下游 | `pass`（设计审计） | 03→04/05/06/07、04→07、05→07、06→07、owner seam→Runner 全部列有重审入口 |
| 当前是否存在未处理冲突 | `none observed`（仅当前输入审计） | 持续 blocker 仍开放；无权限关闭或绕过 |

### 7.3 回填草稿（未来正式 `07-实施计划.md` §10）

正式 §10 仅在 Step 13 装配时写入以下收口结论；详细表、审计和证据边界继续保留在本 Step 中间产物：

1. **暂停原则**：设计真相源冲突、可落码闭环缺口、phase/boundary 越界、P0/VETO、Query 写入、Consumer payload/ACK/cursor、Job owner repair/replay、event residue、redaction、证据 pairing、required dependency 或 baseline 缺失，必须暂停受影响 boundary/phase。
2. **回退原则**：默认只回退当前未验证 WIP；保护上一已验证 boundary、用户已有未提交改动、失败 artifact/report/check 和外部保护轴。已提交错误优先用新修复提交，必要时才 controlled-revert；不得删除失败材料或静默重写历史。
3. **变更原则**：字段、DTO、state、flow、port、config、测试/证据、验收、owner seam 或 phase/boundary 变化必须先回写 owning truth source，固定新 baseline，重审受影响 Step/boundary/gate/risk，再恢复实施。
4. **失败与新 run**：`blocked/not_run/timeout/flaky/incomplete/unknown` 保留原语义；失败材料不覆盖。修复或 baseline 变化用新的显式 `run_id`，以 `predecessor`/`supersedes` 连接旧 run；只允许同 run raw/report/check pair 进入 evidence。
5. **依赖不可用**：实现仓、技术 authority、required public seam、配置 builder、证据工具或 selected positive seam 缺失时 fail-closed；独立 negative/controlled/disabled lane 可按合同继续，但不得宣称 positive readiness。
6. **恢复条件**：重新读取台账和正式 truth source，确认新 baseline、worktree scope、可落码闭环、配置/环境 preflight、受影响 gate、review authority、redaction/cleanup 和 lineage 均闭合；任一 P0/VETO 未清除时不得 handoff。
7. **事实声明**：当前 Step 10 只完成设计控制计划；没有实现仓、baseline、commit、run、artifact、report、evidence、verdict、signoff、risk acceptance 或 readiness 实例。

### 7.4 未来实施台账回写要求（计划口径）

当 Step 13 创建 implementation ledger 后，每次 pause/rollback/change/resume 至少应回写以下字段；本 Step 不创建该文件：

| 事件 | 项目级实施台账字段 | boundary 台账字段 | 设计仓回写 |
|---|---|---|---|
| `pause` | `gate_status=blocked`、`gate_reason`、`next_allowed_action=wait_design/fix_gate_failure/handoff`、`current_recovery_point` | blocker、failed gate、保留证据、恢复条件 | 设计缺口时更新对应 flow/Step |
| `rollback-current` | 当前 boundary 保持 blocked/pending，记录 scope 和恢复点 | WIP diff、rollback reason、上一已验证 boundary | 若 scope/boundary 变化则更新 07 Step 6/10 |
| `change-upstream` | 旧 baseline 不覆盖，记录 `design_fix_baseline`（实际存在时） | required reads、scope、gate/risk mapping 重审 | 更新 owning 03/04/05/06/07 与必要标准 |
| `resume` | 只有 gate/status/next action 有真实证据后才可继续 | 新 run lineage、复验结果、remaining blocker | 设计修复完成后更新 flow gate |
| `handoff` | 记录真实 baseline、实际 gate、blocker 和下一 boundary | Commit/Handoff Gate 证据 | 不生成伪造 hash/verdict/readiness |

## 8. 待确认事项、持续 blocker 与重开触发

| 编号 | 待确认/ blocker | 对本 Step 的影响 | 未确认前处理 | 重开入口 | 当前状态 |
|---|---|---|---|---|---|
| `OQ-RUN-001~002` | 实现仓、语言/runtime、入口和 packaging authority | 无法执行真实 rollback、scope 或 toolchain gate | 只写逻辑规则，不创建仓/命令 | `SP-RUN-001`、PH-01、`commit-ph-01-a` | `blocked` |
| `OQ-RUN-004` | local store/cache durability、locking、migration、atomicity/corruption | 无法证明 UoW/cleanup/recovery 的实际恢复 | 只保留 guarantee；受影响 boundary blocked | `SP-RUN-004`、`commit-ph-03-b`/`05-b/c` | `blocked` |
| `OQ-RUN-005~010` | Artifact/Governance/Sandbox/Runtime/Consumer/Job public seam | 不能确认 positive lane 的 pause/resume 或 run lineage | semantic negative/Unknown/RecoveryCase，不猜 DTO/API | `SP-RUN-005~009`、对应 owner 文档 | `blocked/waiting` |
| `OQ-RUN-012` | gate/check/report 技术 authority、scanner availability、reviewer | 不能执行 failed artifact、pairing 或恢复 gate | 只保留计划合同；工具 unavailable 不记 clean | `SP-RUN-010`、PH-05-d/06-b | `waiting` |
| `OQ-RUN-013~014` | target tier、fixed run、GRC/review、SLO/retention/capacity | PH-06/release 只能 `baseline_blocked/not_run` | 不生成 verdict/signoff/readiness | `SP-RUN-012`、PH-06 | `blocked` |
| `RUN-DOC-003` | 正式 07、implementation ledger、planned boundary skeleton 尚未建立 | 不能进行真实实施 handoff 或台账恢复 | Step 13 前保持未创建 | Step 13 full-restart | `open/blocking` |
| 任何 03/04/05/06 truth source 变化 | 旧 boundary/gate/evidence mapping 可能失效 | 立即 pause，先回写真相源再重审 | §6.6 来源矩阵 | `waiting` |

本表不是授权列表；它只记录控制规则受哪些未闭合事实约束。任何 blocker 关闭都必须有正式来源、审查记录和新的设计 baseline（若实际需要），不能由本 Step 自行清除。

## 9. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| 暂停规则覆盖设计缺口、门禁失败、红线、依赖和事实边界 | `pass` | `PAUSE-01~20` 有动作、证据、责任/姿态和恢复条件 |
| 回退规则绑定 18 个 boundary 并保护已验证成果 | `pass` | `ROLLBACK-01~08`、用户改动/失败材料/外部保护轴规则完整 |
| 变更控制能回写 03/04/05/06/07 与 owner seam | `pass` | §6.5～§6.6 有 source、同步产物、复审和禁止临时处理 |
| Gate failure matrix 覆盖 GATE-01～12 | `pass` | §6.7 逐 gate 定义状态、材料、复验、不可 risk-accept |
| failed artifact/report 和新 run lineage 规则明确 | `pass` | §6.9 保留失败、same-run pair、predecessor/supersedes；不跨 run 拼接 |
| 恢复前 baseline/worktree/设计闭环/gate/reviewer 检查明确 | `pass` | §6.10 12 项有序 checklist |
| 六 phase 与 18 boundary pause/resume 审计完成 | `pass` | §6.11～§6.12 逐项覆盖 |
| 当前事实边界保真 | `pass` | 未创建实现仓、baseline、commit、run、artifact/report/evidence、verdict/signoff/readiness |
| 可进入 Step 11 | `pass_for_step_11` | 下一步创建并完成 `07_implementation_plan_step_11_commit_review_delivery.md`；正式 07、implementation ledger、boundary skeleton 仍禁止提前创建 |

## 10. Step 自审记录

| 自审项 | 结论 | 说明 |
|---|---|---|
| 是否只承接 Step 6～9 和现有 truth source | `pass` | 未新增业务需求、对象、DTO、配置 key、测试分母或验收 authority |
| 是否按实施计划规范回答 pause/rollback/change/resume | `pass` | 结构包含状态、输入、问题回答、诊断、取舍、结构化产物、回填、待确认和门禁 |
| 是否保护上一已验证 boundary、失败材料和用户改动 | `pass` | 回退硬规则与 `ROLLBACK-01~08` 明确禁止覆盖/删除 |
| 是否要求设计冲突回写而非实现补口 | `pass` | `PAUSE-01~05`、§6.5/§6.10 明确 owner truth 和 wait_design |
| 是否保持 Query/Consumer/Job/event-zero 红线 | `pass` | `PAUSE-07~09`、GATE-05/06/07/09 和 boundary audit 独立覆盖 |
| 是否区分 planned、blocked、not_run、incomplete 与实际 pass | `pass` | 全文使用计划状态；没有实际执行结论 |
| 是否保持 Step 13 文件时序 | `pass` | 未创建正式 07、implementation ledger 或 boundary skeleton |

## 11. Step 结论与门禁

```text
current_document = 07-实施计划.md
current_step = 10
current_module = rollback_pause_change_control
gate_status = completed / pass / self_reviewed
gate_reason = 暂停、回退、变更、门禁失败、依赖不可用、失败材料保留、new-run lineage、恢复前复核、六 phase/18 boundary 审计和 P0/VETO 不可风险接受规则均已收敛；所有规则仍是计划合同，执行层保持 blocked/not_run/not_created。
next_allowed_action = create_and_complete_07_step_11_commit_review_delivery
formal_07_write_allowed = false_until_step_13_assembly
implementation_ledger_allowed = false_until_step_13_assembly
implementation_write_allowed = false
test_execution_allowed = false
commit_required = false
```
