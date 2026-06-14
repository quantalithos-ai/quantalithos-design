# Step 10. 定义回退、暂停与变更控制

> 对应 SOP: `standards/document/实施计划讨论流程_SOP.md` Step 10
> 回填章节: `07-实施计划.md` §10 回退、暂停与变更控制

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 10 定义回退、暂停与变更控制 |
| 当前状态 | 已完成,按用户授权自动进入后续 Step |
| 输入基线 | Step 6 commit boundary、Step 7 gate、Step 8 外部依赖准备、Step 9 blocker / risk / spike |
| 输出文件 | `projects/L1-identity/design-calibration/07_implementation_plan_step_10_rollback_change_control.md` |
| 正式文档状态 | 本 Step 不修改正式 `07-实施计划.md` |
| 停审方式 | 每个模块先思考、再写入、再局部停审;全部模块完成后做暂停 / 回退 / 变更 / 恢复条件审计 |

## 2. 本步目标

本 Step 定义实施过程中遇到设计缺口、门禁失败、外部依赖不可用、boundary 粒度失衡、证据无法物化或需求 / 基线变化时,如何暂停、回退、变更和恢复。

本 Step 只回答:

- 哪些情况必须暂停当前 phase / commit boundary。
- 哪些情况允许回退到上一个已验证 boundary。
- 哪些情况必须回写 `03/04/05/06/07` 或标准。
- 门禁失败后如何保留证据、修复、复跑和恢复。
- 外部依赖不可用时是否允许继续局部实施。
- 发现字段缺失、状态冲突、DTO 构造不完整、port 缺口、artifact schema 缺口或 phase boundary 越界时如何处理。
- baseline 更新后如何重审 boundary、gate、risk 和经验复核。

本 Step 不新增 phase、commit boundary、测试用例、证据 ID、config key、schema、port 或状态。若变更控制发现必须新增这些内容,只能回到对应上游真相源闭口。

## 3. 本步输入

| 输入 | 状态 | 本 Step 用途 |
|---|---|---|
| `实施计划讨论流程_SOP.md` Step 10 | 当前标准 | 提供暂停、回退、变更、恢复的讨论问题和输出表 |
| `实施计划书写规范.md` §5.10 | 当前标准 | 提供触发条件、动作、责任方、证据和恢复条件表 |
| `设计真相源闭环与可落码性标准.md` §九 | 当前标准 | 提供 boundary 开工前复核、实现侧不得补口和 blocker 经验回写规则 |
| `07_implementation_plan_step_05_phases_dependencies.md` | 已完成 | 提供 PH-01~PH-08 的阶段保护边界 |
| `07_implementation_plan_step_06_tasks_commit_boundaries.md` | 已完成 | 提供 commit-01-a 到 commit-08-c 的回退 / 重审单元 |
| `07_implementation_plan_step_07_test_acceptance_gates.md` | 已完成 | 提供 GATE-01~12 和门禁失败处理 |
| `07_implementation_plan_step_08_config_environment.md` | 已完成 | 提供外部依赖不可用、config failure 和 artifact/report root 处理 |
| `07_implementation_plan_step_09_spikes_risks.md` | 已完成 | 提供 blocker、risk、spike、residual 和回写路径 |
| `03-详细设计.md` | 正式设计输入 | 提供 schema、port、flow、state、persistence、error、idempotency 和 observability 真相源 |
| `05-测试方案.md` | 正式测试输入 | 提供门禁失败、缺陷复验、回归触发和 evidence integrity 规则 |
| `06-验收标准.md` | 正式验收输入 | 提供 VETO、不可风险接受、risk acceptance 和 final handoff 约束 |

## 4. 模块计划 / 模块目录

| 模块 | 目标 | 输入 | 输出 | 停审门禁 |
|---|---|---|---|---|
| M1 Step 10 规则与控制范围 | 固定 pause / rollback / change / resume 的定义和禁止事项 | SOP Step 10、书写规范 §5.10 | 规则分类和动作词表 | 不使用“视情况处理” |
| M2 暂停规则 | 定义设计缺口、门禁失败、红线命中、外部依赖缺失时的暂停动作 | Step 7~9、标准 §九 | 暂停规则表 | 每条必须有证据和恢复条件 |
| M3 回退规则 | 定义如何保护已验证阶段并回到上一安全边界 | Step 5/6 boundary | 回退规则表 | 不得破坏用户未提交改动或已验证证据 |
| M4 变更控制与回写 | 定义 baseline 更新、上游回写、boundary 重审和标准经验沉淀 | Step 9 回写规则、标准 §九 | 变更控制表 | 设计变化必须回写上游,不能只改代码 |
| M5 门禁失败与缺陷恢复 | 定义 failed/partial artifact 保留、修复、复跑、risk acceptance | Step 7、`05/06` | 门禁失败处理表 | P0 红线不得风险接受 |
| M6 外部依赖不可用处理 | 定义 compile/runtime/event dependency 不可用时的继续 / 暂停口径 | Step 8 | 外部依赖处理表 | runtime/event 不得转 path dependency |
| M7 实现侧禁止补口规则 | 固定实现 agent 只能二次校验和阻塞回报 | 标准 §九、Step 9 blocker | 禁止补口清单 | schema/port/state/evidence 缺口必须暂停 |
| M8 恢复条件与跨表停审 | 审计恢复条件、baseline 标签和进入 Step 11 条件 | M1~M7 | 恢复表、回填草稿、审计表 | 暂停 / 回退 / 变更 / 恢复条件完整 |

### 4.1 模块思考与写入记录

| 模块 | 思考重点 | 写入位置 | 局部停审结论 |
|---|---|---|---|
| M1 | Step 10 必须给动作和恢复条件,不能留“实现时判断” | §8.1 | 通过 |
| M2 | 设计真相源冲突、P0 gate failure、VETO、artifact 缺失和 fake 私有补口都必须暂停 | §8.2 | 通过 |
| M3 | 回退是回到上一已验证 boundary 或撤销本 boundary WIP,不是回滚用户未提交改动 | §8.3 | 通过 |
| M4 | 任何正式设计变化都要更新 baseline 并重审受影响 boundary / gate / risk | §8.4~§8.5 | 通过 |
| M5 | failed/partial artifact 必须保留;P0 红线不可风险接受 | §8.6 | 通过 |
| M6 | external runtime/event unavailable 只能走 formal fake/controlled/disabled 或 residual,不能改 Cargo dependency | §8.7 | 通过 |
| M7 | 实现者不得补 schema、port、状态、artifact schema 或 phase scope | §8.8 | 通过 |
| M8 | 恢复必须有新 baseline、复审记录、重跑门禁和证据 | §8.9~§8.13 | 通过 |

## 5. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 哪些情况必须暂停当前阶段? | 设计真相源缺 schema/port/state/flow/persistence/evidence;boundary 越界;P0 gate failed;VETO 或 S 级红线命中;artifact/report 无法 run-scoped 物化;config silent fallback;query/job 写 truth;fake 私有补口;core compile dependency 缺失。 |
| 哪些情况允许回退到上一个提交边界? | 当前 boundary WIP 无法在不越界补口的情况下完成、门禁失败需重做当前 boundary、实现规模超阈值需重拆、或 Spike 证明当前 boundary 范围错误时,可以回退到上一已验证 boundary 并保护已生成证据。 |
| 哪些情况必须回写详细设计或测试方案? | 需要新增或修改 schema、DTO、state、port、flow、repository、version source、config key、adapter outcome、TC、EV、artifact JSON 字段、AC/VETO、phase / commit boundary 时,必须回写对应 `03/04/05/06/07`。 |
| 门禁失败后如何处理? | 保留 failed/partial raw artifact、stdout/stderr、safe failure reason 和 run report;修复后按 `05` 回归触发表选择最小或全量回归;P0 红线失败不得风险接受。 |
| 外部依赖不可用时是否允许继续局部实施? | 编译期 core 缺失不允许继续相关 phase。运行期 / 事件协作依赖若有正式 fake/controlled/disabled 语义,可继续局部实施并记录 mode;required ref 缺失或 endpoint enabled 无 ref 必须 fail-fast / reject-run。 |
| 恢复实施的条件是什么? | blocker 已回写并形成新 baseline;受影响 boundary 重新做经验复核;相关 gate 复跑通过或按正式 risk acceptance 记录;artifact/report/run_id 证据完整;工作树未混入无关回滚。 |
| 发现字段缺失、状态冲突、DTO 构造不完整或 phase boundary 越界时如何处理? | 暂停当前 boundary,记录 blocker note,回写对应上游设计或重审实施计划,不得在实现代码中临时补字段、拼 key、改状态名或扩大 phase scope。 |

## 6. 当前文档问题诊断

| 位置 | 当前问题 | 本 Step 处理 |
|---|---|---|
| Step 6 | boundary 已固定,但实现中仍可能发现粒度过大或前置 surface 缺失 | 本 Step 定义 boundary 重审和回退规则 |
| Step 7 | gate failure 处理已写方向,但未统一 pause / resume 条件 | 本 Step 写门禁失败恢复规则 |
| Step 8 | external dependency 不可用处理已有表,但未纳入变更控制 | 本 Step 写 compile/runtime/event 分流规则 |
| Step 9 | blocker / risk / spike 已分类,但缺实际中断和恢复流程 | 本 Step 将其转为 pause / rollback / change 表 |
| `05/06` | 缺陷、VETO、risk acceptance 已定义,但实施计划需连接到 boundary | 本 Step 绑定 P0 红线和风险接受条件 |
| 可落码性标准 | 要求实现 blocker 修复后沉淀经验 | 本 Step 把经验回写纳入恢复条件 |

## 7. 改动前后对比

| 议题 | Step 10 前 | Step 10 后 | 作用 |
|---|---|---|---|
| 暂停 | 只有 blocker 概念 | 触发条件、证据、责任方、恢复条件成表 | 实现中断可审计 |
| 回退 | 只有 commit boundary | 明确回退到上一已验证 boundary,保护证据和用户改动 | 防止误回滚 |
| 变更 | 只有回写路径 | 增加 baseline 更新、受影响 boundary 重审和 gate 复跑 | 设计变更可恢复 |
| 门禁失败 | 分散在 Step 7/05/06 | 汇总为 failed artifact 保留、修复和复跑规则 | 证据不中断 |
| 实现侧补口 | 标准已有禁止 | 实施计划明确暂停而不是补口 | 降低重复 blocker |

## 8. 设计取舍

| 议题 | 可选方案 | 取舍 |
|---|---|---|
| 设计缺口是否允许实现先补后回写 | A. 允许;B. 必须先暂停回写 | 采用 B。保护 1:1 落码和正式真相源。 |
| 回退是否可以回滚多个已验证 boundary | A. 可以;B. 只回退当前未验证 boundary,已验证 boundary 优先保护 | 采用 B。符合“回退规则必须优先保护已验证阶段”。 |
| gate failed 是否可以删掉失败 artifact 重跑 | A. 可以;B. 必须保留 failed/partial artifact | 采用 B。失败证据是缺陷和复验输入。 |
| external endpoint 不可用是否改成 fake path dependency | A. 可以;B. 不可 | 采用 B。runtime/event dependency 只能走正式 adapter/fake/controlled/disabled。 |
| boundary 过大是否由实现者自由拆 | A. 自由拆;B. 超阈值后按 Step 10/11 重审 | 采用 B。保持 commit boundary 和证据归属可追溯。 |

## 9. 结构化中间产物

### 9.1 动作词表

| 动作 | 含义 | 允许范围 |
|---|---|---|
| pause | 暂停当前 phase / commit boundary,不继续写实现或正式装配 | 设计缺口、门禁失败、红线命中、证据缺口 |
| rollback | 回退当前未验证 boundary 的 WIP 或重新组织本 boundary,保留已验证 boundary 和证据 | 当前 boundary 未通过或范围错误 |
| change | 修改正式真相源、实施 boundary、gate 映射或标准经验 | 必须有新 baseline 和重审 |
| resume | 在恢复条件满足后继续当前或重审后的 boundary | 需要复核记录和门禁结果 |
| residual | 非 P0 或已验收允许遗留的风险记录 | 不得证明 P0 pass |

### 9.2 暂停规则表

| 触发条件 | 动作 | 责任方 | 保留证据 | 恢复条件 |
|---|---|---|---|---|
| `03` schema / DTO / state / flow / port / repository / persistence / error / idempotency 缺口 | pause + change | implementer / designer | blocker note、引用章节、影响 boundary | `03` 或校准文件补齐并固定 baseline;boundary 重审通过 |
| `04` config key / loader / adapter constructor / profile 语义缺口 | pause + change | implementer / config designer | blocker note、config item、影响 entry/runtime | `04` 补齐;commit-08-a 或相关 boundary 重审 |
| `05` suite / TC / fixture / artifact JSON / report / evidence 字段缺口 | pause + change | implementer / test designer | blocker note、artifact/report path、缺字段 | `05` 补齐;GATE-11 口径重审 |
| `06` AC / VETO / risk acceptance / final conclusion 缺口 | pause + change | implementer / acceptance owner | blocker note、AC/VETO/risk item | `06` 补齐;acceptance handoff 重审 |
| phase / commit boundary 越界或引用后续 surface | pause + change | implementer / implementation planner | boundary note、涉及 BATCH | Step 6/10 重审并更新 baseline |
| P0 gate failed | pause | implementer | failed raw artifact、stdout/stderr、run report、safe failure reason | 修复并按 `05` 复跑最小或全量回归 |
| VETO / S 级红线命中 | pause | implementer / acceptance owner | failed evidence、veto checklist item | 修复、复跑相关 gate、VETO 不触发 |
| raw artifact / report 缺失、static pass 或使用 `latest` | pause | implementer / test tooling owner | report audit failure | 修复 writer/check scripts,重跑 GATE-11/12 |
| compile dependency core 缺失或非 core sibling 进入 Cargo | pause | implementer / core owner | dependency report | 修复 dependency boundary,GATE-01 通过 |
| fake / controlled adapter 使用 private map、默认成功或错误字符串分类 | pause | implementer / infra owner | fake parity failure、test case | 补正式 port/outcome 或回写 `03`;fake/durable 等价测试通过 |
| query/job/consumer missing target 隐式创建 truth 或写 truth | pause | implementer / service owner | write-audit / failed case | 修复 no-write/no-repair;复跑 GATE-05/06/08 |

### 9.3 回退规则表

| 触发条件 | 动作 | 责任方 | 保留证据 | 恢复条件 |
|---|---|---|---|---|
| 当前 boundary WIP 无法通过 gate | rollback 当前 boundary WIP 到上一已验证 boundary 状态 | implementer | failed artifact、diff summary、gate report | 修复方案明确后重新进入该 boundary |
| Spike 证明 boundary 范围过大或错误 | rollback / split proposal | implementer / planner | Spike report、affected BATCH | Step 10/11 重审 boundary 并更新计划 |
| 设计 baseline 更新导致当前 WIP 过期 | rollback affected WIP 或 rebase to new baseline | implementer | baseline diff、影响表 | 新 baseline 审核、boundary 经验复核重做 |
| 当前 boundary 混入无关文件或用户改动风险 | rollback only own WIP or split changes | implementer | worktree status、file ownership note | 无关改动隔离;相关 diff 可 review |
| gate/report/check script 生成错误证据 | rollback script boundary WIP | test tooling owner | bad report、audit failure | writer/check 修复后重跑 report audit |

回退约束:

- 不得回滚用户已有未提交改动。
- 不得删除 failed/partial artifact 来制造 clean history。
- 不得为了回退而破坏上一已验证 phase / commit boundary。
- 不得使用 destructive git 操作作为默认回退方式;需要时必须由用户明确授权。

### 9.4 变更控制表

| 触发条件 | 动作 | 责任方 | 保留证据 | 恢复条件 |
|---|---|---|---|---|
| 上游设计变更影响对象 / protocol / flow / state | change `03` baseline | designer | design diff、影响 boundary 表 | 受影响 boundary 重新经验复核 |
| 配置 profile / adapter / source priority 变更 | change `04` baseline | config designer | config diff、GATE-09 impact | config-redline 重审 |
| 测试 suite / TC / evidence / artifact schema 变更 | change `05` baseline | test designer | test diff、EV/TC impact | gate matrix 和 report audit 重审 |
| AC / VETO / risk acceptance 变更 | change `06` baseline | acceptance owner | acceptance diff、裁决影响 | final handoff 规则重审 |
| phase / commit boundary 需要拆分或合并 | change `07` Step 6/7/9/10 | implementation planner | boundary change note | gate / risk / rollback 表同步 |
| 新型 blocker 未被标准覆盖 | change standard | design maintainer | blocker复盘、正反例、横向扫描 | 标准更新后重跑相关 boundary 经验复核 |

### 9.5 Baseline 更新与重审顺序

```text
发现变更触发
  -> pause affected boundary
  -> 写 blocker / change note
  -> 回写对应真相源
  -> 固定新的 design baseline
  -> 重审受影响 phase / commit boundary
  -> 重审 gate / evidence / risk / rollback 表
  -> 必要时更新经验标准
  -> resume with new baseline
```

| 更新项 | 必须同步重审 |
|---|---|
| `03` 改动 | Step 4 deliverables、Step 5 phase、Step 6 boundary、Step 7 gate、Step 9 risk、Step 10 rollback |
| `04` 改动 | Step 8 config environment、GATE-09、commit-08-a、相关 entry/runtime boundary |
| `05` 改动 | Step 7 gate、Step 9 risk、Step 10 gate failure、Step 12 done criteria |
| `06` 改动 | Step 7 acceptance gate、Step 9 residual、Step 12/13 final readiness |
| `07` boundary 改动 | Step 6/7/9/10/11/12 全部相关表 |
| 标准改动 | 所有受影响 boundary 的经验复核 |

### 9.6 门禁失败处理表

| 门禁失败 | 动作 | 保留证据 | 恢复条件 |
|---|---|---|---|
| `GATE-01` dependency boundary | pause commit | dependency report、manifest diff | dependency clean,非 core sibling removed |
| `GATE-02` contract/domain/state | pause commit | failed tests、state/schema failure | 修复 schema/state,复跑 suite |
| `GATE-03` infra fake/replay | pause commit | fake parity artifact | 修复 fake/durable parity,复跑 suite |
| `GATE-04` command flow | pause commit | service-flow artifact、stored result evidence | 修复 accepted/rejected/duplicate/conflict,复跑 command subset |
| `GATE-05` query no-write | pause commit | write-audit,visibility failure | 修复 no-write/visibility,复跑 query subset |
| `GATE-06` consumer/callback | pause commit | receipt/replay artifact | 修复 no-create/receipt,复跑 entry-worker subset |
| `GATE-07` outbox/propagation | pause commit | outbox/job report | 修复 accepted-only/publish outcome,复跑 operations subset |
| `GATE-08` operations job | pause commit | stored job report、write-audit | 修复 no-repair/report replay,复跑 job subset |
| `GATE-09` config redline | pause commit | config failure report | 修复 strict config/source priority/profile isolation |
| `GATE-10` redaction | pause commit / security fix | redaction report | forbidden material removed,复扫 clean |
| `GATE-11` report audit | pause release/evidence | report-audit failure | raw artifact/report pairing and no static evidence pass |
| `GATE-12` release smoke | pause final handoff | release gate summary | 修复 failed blocking suite,重跑 release |

### 9.7 外部依赖不可用处理表

| 依赖不可用 | 是否可继续局部实施 | 处理 |
|---|---|---|
| `quantalithos-core` compile dependency | 否 | 暂停 PH-01 / commit-01-a |
| 目标实现仓不可用 | 否 | 暂停实现,不得在设计仓代写 |
| runtime source endpoint 不可用 | 是,若有 formal fake/controlled/disabled | 使用正式替身;不得 fake success |
| required endpoint ref missing | 否 | fail-fast / reject-run |
| event bus真实服务不可用 | 是,若 P0 用 fake publisher/topic map | 使用 fake/controlled;topic map required missing 则 fail-fast |
| P1/P2 selected-run product 不可用 | 是 | 记录 unavailable / residual,不计 P0 pass |
| artifact/report root 不可写 | 否 | gate failed,修路径或 writer |

### 9.8 实现侧禁止补口清单

实现 agent 遇到以下情况必须暂停并回报,不得自行补:

- 新增或猜测 schema 字段、DTO 二级类型、state variant、state transition helper。
- 拼接 typed ref、trace subject、view ref、scope ref、cursor、idempotency key 或 report ref。
- 为当前 boundary 新增未在 `03` 定义的 repository / port / resolver / adapter 方法。
- 用 fake private map、错误字符串、timestamp、version、trace id、dedup key 代替正式来源。
- 为 artifact/report/evidence JSON 自行决定字段名、枚举值、digest canonicalization 或 writer owner。
- 把 runtime / event sibling repo 写成 Cargo path dependency。
- 扩大 phase / commit boundary 来吸收后续 surface。
- 把 P1/P2 residual、selected-run unavailable 或 report draft 当成 P0 pass。

### 9.9 恢复实施条件表

| 暂停原因 | 恢复条件 |
|---|---|
| 设计缺口 | 对应上游文档已补齐,新 baseline 固定,受影响 boundary 经验复核通过 |
| 门禁失败 | failed artifact 已保留,修复完成,按 `05` 复跑最小 / 全量回归通过 |
| VETO / S 级 | 红线修复,相关 evidence clean,VETO checklist 不触发 |
| 外部依赖不可用 | dependency 恢复或切换到正式允许的 fake/controlled/disabled;记录 mode |
| boundary 过大 | Step 10/11 重审拆分方式,gate/risk/report 归属同步 |
| artifact/report 缺口 | `05/06/07` schema / writer / report audit 闭口,GATE-11 通过 |
| 新经验标准缺失 | 标准已更新或给出不需更新理由,同类 flow 横向扫描完成 |

### 9.10 Boundary 变更重审矩阵

| Boundary 范围 | 触发变更时必须重审 |
|---|---|
| PH-01 | workspace layout、core path、dependency boundary、git/worktree safety |
| PH-02 | public schema、state matrix、body-free / redaction |
| PH-03 | port/fake parity、idempotency/stored replay、config binding foundation |
| PH-04 | command UoW、accepted side effects、high-risk basis、stored result |
| PH-05 | query visibility、stable lookup、no-write evidence |
| PH-06 | consumer no-create、receipt replay、outbox material |
| PH-07 | job report replay、maintenance no-repair、adapter outcome |
| PH-08 | entry facade、config redline、artifact/report writer、release/evidence/acceptance |

### 9.11 跨表审计

| 审计项 | 结论 | 说明 |
|---|---|---|
| 暂停规则是否有恢复条件 | 通过 | §9.2 |
| 回退规则是否保护已验证阶段 | 通过 | §9.3 |
| 设计变化是否要求回写上游 | 通过 | §9.4 |
| 门禁失败是否保留证据 | 通过 | §9.6 |
| 外部依赖不可用是否有分流 | 通过 | §9.7 |
| 实现侧禁止补口是否明确 | 通过 | §9.8 |
| 新 baseline 是否要求重审 | 通过 | §9.5 / §9.10 |
| 是否使用“视情况处理” | 未使用 | 所有触发均有动作 |

## 10. 对上游 / 下游文档的影响判定

| 影响项 | 是否需要回写上游 | 说明 | 下游处理 |
|---|---|---|---|
| 当前 Step 10 规则 | 否 | 只把已有设计 / 测试 / 验收风险转成控制规则 | Step 11 提交纪律继续承接 |
| 新 baseline 重审顺序 | 否 | 属于实施计划控制面 | Step 12 完成判定使用 |
| 设计缺口触发回写 | 条件是 | 触发时回写 `03/04/05/06/07` | 实现中按 blocker note 执行 |
| blocker 经验沉淀 | 条件是 | 标准未覆盖时更新可落码性标准 | Step 11 写入交付纪律 |

## 11. 回填草稿

> 回填目标: `07-实施计划.md` §10 回退、暂停与变更控制
> 正式 `07` 在 Step 13 统一装配,本节仅作为草稿。

### 11.1 暂停与恢复总原则

- 设计真相源冲突必须暂停当前 boundary,不得由实现者临时取舍。
- schema、port、state、DTO、flow、persistence、config、artifact、evidence 或 boundary 缺口必须回写上游真相源。
- P0 gate failure 必须保留 failed/partial artifact 和 safe failure reason。
- VETO、S 级、redaction、dependency、evidence integrity、query no-write、job no-repair、stored replay 和 config fail-fast 红线不得风险接受。
- 恢复实施必须有新 baseline、重审记录、必要门禁复跑和证据归档。

### 11.2 回退与变更总原则

- 回退优先保护上一已验证 phase / commit boundary。
- 默认只回退当前未验证 boundary 的 WIP 或重新组织本 boundary。
- 不得回滚用户已有未提交改动。
- 不得删除失败证据来制造 clean pass。
- boundary 改动必须同步更新 Step 6/7/9/10/11/12 相关表。
- 新型 blocker 修复后必须检查是否需要更新 `设计真相源闭环与可落码性标准.md`。

## 12. 待确认事项

| 事项 | 影响 | 当前处理 |
|---|---|---|
| 实现中是否触发 SP-ID-005 的 boundary 重拆 | 影响 commit 粒度 | Step 11 继续定义提交 / review 纪律 |
| 新型 blocker 是否需要更新标准 | 影响经验总结后序任务 | Step 11 写入交付纪律和提交前检查 |
| 实际 failed artifact / report 路径是否由 PH-08-b writer 完成 | 影响门禁失败证据 | commit-08-b 前由 SP-ID-003/004 验证 |

## 13. 进入下一步条件

| 条件 | 结论 |
|---|---|
| 已列出本 Step 必读文档 | 通过 |
| 已先写模块计划 / 模块目录 | 通过 |
| 已按模块记录思考、写入位置和停审结论 | 通过 |
| 暂停、回退、变更、恢复条件明确 | 通过 |
| 规则与 Step 6 commit boundary、Step 7 gate、Step 8 dependency、Step 9 risk 一致 | 通过 |
| 实现侧禁止补 schema / port / state / evidence / boundary 规则明确 | 通过 |
| 可以进入 Step 11 定义提交、评审与交付纪律 | 是 |
