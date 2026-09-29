# Step 10. 定义回退、暂停与变更控制

> 对应 SOP：`standards/document/实施计划讨论流程_SOP.md` Step 10；回填位置：正式 `07-实施计划.md` §10。\
> 日期：2026-09-14；模式：`full-restart / single-agent-serial / continuous_authorization`。\
> 本产物定义未来实施控制规则，不执行 git 回退、不修改实现仓、不重写既有 raw/report，也不产生新的设计 baseline。

## 1. Step 状态与开工确认

| 项 | 结论 |
|---|---|
| 当前 Step | Step 10：回退、暂停与变更控制 |
| 输入 | Step 6 的 16 boundary；Step 7 门禁；Step 8 依赖；Step 9 风险/Spike/截止矩阵；正式 `03～06` |
| 输出 | 暂停规则、回退规则、变更分类、恢复协议、边界级控制矩阵 |
| 当前状态 | `completed / pause_rollback_change_rules_closed / continue_authorized` |
| 当前事实 | 尚无实现、diff、commit、测试 run、artifact/report/evidence 可回退或恢复 |
| implementation / test / acceptance execution | `false` |
| formal 07 | Step 13 前仍不存在；本 Step 不创建 |
| 下一动作 | `create_and_complete_step_11_commit_review_delivery` |

## 2. 输入与 SOP 问题回答

| 问题 | 回答与取舍 |
|---|---|
| 哪些情况必须暂停 | 设计真相冲突、字段/DTO/state/port/UoW 缺口、Phase/Scope 越界、required gate 非 pass、owner/formal seam 缺失、external effect finality 不明、redaction/authority/no-write/outbound 红线、用户无提交授权时均暂停相应动作。 |
| 哪些情况允许回退 | 当前未验证 boundary 的实现可按实现仓安全流程撤回或另建修复提交；已验证/已提交 boundary 不改写历史，只有正式批准的 revert/forward-fix。外部 effect 已可能发出时禁止用代码回退冒充业务补偿。 |
| 何时必须回写设计 | public/local contract、字段/DTO/status、source authority、UoW/idempotency/effect、config、TC/AC/EV/VETO、phase/boundary 任一变化都必须回写对应正式真相源并形成新 baseline。 |
| Gate 失败如何处理 | 保留失败 raw/log/report/status；`failed` 只在同一 boundary 修复并重跑，`blocked` 转 `wait_design`，`infrastructure_failed` 修环境后用新 run；不得手改 report 为 pass。 |
| 外部依赖不可用能否继续 | 只可继续与其无依赖、且正式计划明确允许的 local/negative boundary；相关 positive lane 保持 blocked。不能跳过前序 boundary，也不能用 fake 替 external authority/finality。 |
| 恢复实施条件 | blocker 已由 owner 关闭并回写、新 immutable design baseline 已固定、受影响闭环/依赖/配置审计重跑、current boundary ledger 重新激活，且用户授予相应实现/提交权限。 |
| 发现落码闭环缺口怎么办 | 当前 boundary 立即停止；记录 exact source/symbol/flow/影响；不在实现仓私补；回写 `03/04/05/06/07` 后从 Design Gate 重开。 |

## 3. 统一控制状态机

```text
planned / waiting / blocked
        |
        | owner closure + user implementation authorization
        v
read_docs -> design_gate -> implement -> run_gates -> commit_gate -> handoff_gate
                |             |            |              |
                +---- blocker/pause <------+--------------+
                              |
             +----------------+----------------+
             |                                 |
       wait_design                      fix_gate_failure
             |                                 |
       new baseline + audit               new immutable run
             +----------------+----------------+
                              |
                       reopen same boundary
```

禁止跳转：`planned→implement`、`pending/blocked→commit`、`CommitUnknown→redispatch`、`failed raw→手写 pass report`、`owner contract missing→fake production`、`current boundary→next boundary`（当前 Handoff Gate 未通过）。

## 4. 暂停规则

| 触发条件 | 立即动作 | 责任方 | 必须保留 | 恢复条件 |
|---|---|---|---|---|
| formal 03～07 字段、DTO、状态、port、错误或 flow 不闭合 | pause 当前 boundary；`gate_status=blocked`、`next_allowed_action=wait_design` | implementer 记录；L4 design owner 修复 | blocker note、设计引用、当前 diff、复现输入 | 正式设计修复、新 baseline、闭环审计通过 |
| owner truth/版本/fence/coverage/material/receiver 合同缺失或冲突 | 停对应 positive lane；不调用/不写 owner | owning project + adapter owner | owner response/ref、typed mismatch、safe diagnostic | owner 正式合同/vector/binding 经核验 |
| source 缺失且有人提出 workspace/sibling fallback | 停 capture/closure；记录 boundary violation | implementer/design reviewer | source-authority row、attempt/finding、无 fallback 证明 | exact owner source 可用；workspace 仍仅 Auxiliary |
| Query 发生任何 write、repair、retrieve、probe、cache 或影响业务的 telemetry effect | 停 PH-03 及相关 release；按 P0/VETO 处理 | query owner + reviewer | write/effect spy raw、request/snapshot、safe trace | 根因修复；QUERY/SECURITY/OBSERVE 全量重跑 |
| local UoW 半提交、CAS/read-set/fence 不一致、result/report 丢失 | 停当前和所有依赖 boundary；不清理可诊断状态 | infra/application owner | transaction probe、before/after versions、raw/log | 修复同一 boundary；fault/restart/race/replay 重跑 |
| external effect 为 `MayHaveDispatched/CommitUnknown` | 冻结原 intent/key；禁止换 key 或盲重派 | effect owner | intent、key、input digest、dispatch knowledge、provider correlation | exact probe/reconcile 得到正式结论，或进入授权补偿 |
| governance decision 缺失/过期/冲突或 legal hold 生效 | effect=0；暂停 lifecycle/delete lane | governance owner + lifecycle implementer | decision/hold refs、applicability result、zero-effect raw | current owner decision 明确允许且 dispatch-time 重检通过 |
| restore receiver/material 映射缺失、漂移或结果不明 | 仅暂停对应 owner item；不影响已知其他 item，但不宣称全局完成 | receiver/material owner | frozen owner set、plan revision、intent/outcome、probe/compensation refs | exact owner receiver/material closure；新 plan revision 如需 |
| integrity/schema/key/algorithm 未闭合或校验失败 | 停 assessment/placement/restore positive lane；不得写 Verified | integrity/schema owner | fixed input/target、finding、raw error、无伪 digest 证明 | 正式 capability/schema 与验证向量通过 |
| outbox/topic/publisher/delivery/config/evidence 意外出现 | 停整个 release；触发 `VETO-AR-009` 检查并移除未授权 surface | architecture/Bus/implementation owner | dependency/config/store/report scan | 未解锁时恢复全面 absence；若要保留则重开 02～07 |
| dependency graph 反向依赖 SDK 或非 Core sibling | 停 PH-01/Build/Release Gate | architecture owner | actual graph、lock/manifest diff | owning docs 对齐且 graph clean |
| redaction leak、secret/body 写入 raw/report/log | 隔离输出，暂停交付；按 S/VETO 风险处理 | security/evidence owner | 被隔离的受控 incident ref、scanner result；禁止扩散正文 | 清理按 owner 规则完成；修复后新 run 全量重验 |
| test/gate `failed`、`blocked`、`not_run` 或 `infrastructure_failed` | 不进入下一 boundary/Phase；状态保真 | current boundary owner | 完整 raw/stdout/stderr/report、reason、environment identity | 同 boundary 修复，以新 run 重跑 required denominator |
| 未获用户 implementation/commit 授权 | 保持 design-only / working tree；不实现或提交 | current agent / implementer | ledger 与 diff 状态 | 用户新的明确授权；其他 Gate 仍需独立满足 |

## 5. 回退、补偿与历史保护规则

| 场景 | 允许动作 | 禁止动作 | 历史/证据保护 |
|---|---|---|---|
| boundary 未提交且仅本地代码失败 | 在 current allowed scope 内 forward-fix；必要时按实现仓安全流程恢复明确属于 agent 的改动 | destructive reset/checkout 覆盖用户改动；顺手改下一 boundary | 保留初始 status、失败 diff/命令和用户无关改动清单 |
| boundary 已提交但 Handoff 未完成 | 新的 fix/revert 必须单独获授权并绑定原 boundary | amend/rebase 已共享历史、伪造原 commit record | 原 hash/message/checks 不覆盖；记录 superseded/reverted relation |
| 已验证前序 boundary 被后续变化影响 | 先 pause 后续；做影响分析，必要时新 baseline 下重验前序 | 直接删除已验证功能或复用旧 pass | 保留旧 run/report；新 run 不覆盖且不能跨 run 拼接 |
| external effect 明确 `NotDispatched` | 可使用原 stable key 按正式 retry policy 重试 | 新 key 绕过幂等或未重检 authority | 原 intent/attempt 和 retry decision 保留 |
| external effect `MayHaveDispatched/CommitUnknown` | 只 exact probe/reconcile；必要时经 owner authority 进入 compensation | blind retry、把 timeout 当 failed、覆盖 original outcome | intent、knowledge、probe、compensation 独立 immutable record |
| receiver item 已 committed，其他 item 失败 | 保持 partial；只推进未决 item或正式补偿 | 跨 owner rollback、把局部成功变全局 restored | per-owner outcome 与 plan revision 均保留 |
| manifest/assessment/plan immutable revision 错误 | 创建新 revision 并显式 supersede；旧 revision 不再用于新 action | in-place overwrite、删除旧 finding/basis | 旧 revision/basis/findings 可追溯 |
| raw/report/EV 生成错误 | 从原 raw 只读重建新 report；raw 错则创建新 run | 手改 raw/pass、使用 `latest`、拼接不同 run | old raw/report 标明 invalid/superseded，不删除证据链 |
| formal design baseline 变化 | 关闭当前 activation；更新 ledger 后重跑 Design/Scope Gate | 静默继续用旧 baseline、只改 commit body | old/new baseline、change reason、affected boundaries 全记录 |

“代码回退”“业务补偿”“知识对账”是三个不同动作：代码回退不撤销外部 effect，补偿不抹除原 outcome，对账不自动重派命令。

## 6. 变更分类与回写矩阵

| 变化类别 | 回写真相源 | 必须重开 | 最小回归 / 再审范围 |
|---|---|---|---|
| requirement、owner、项目状态或 policy authority | owning project + L4 `00`，再级联 | 00→01→02→03→04→05→06→07 受影响链 | 所有相关 source/effect/restore AC、VETO 和 boundary |
| bounded context、依赖类型、compile/runtime/event/ref/adapter/fake | L4 `01` + 全局依赖 owner | 01→02→03→04→05→06→07 | dependency graph、assembly、adapter、VETO-008/009 |
| object/field/DTO/helper/port/flow/state/error | L4 `03` 对应 Step/正式章 | 03→04/05/06/07 受影响部分 | contract/object/state/service/UoW/idempotency/query/source/effect tests |
| operation/cursor codec、store/UoW、config/profile/secret/budget | L4 `03/04` | 03/04→05/06/07 | negative/tamper/restart/fault/assembly and config gates |
| source/material/integrity/storage/receiver binding | owning project + L4 adapter/config references | 对应 01/03/04/05/06/07 | formal seam suite、authority、redaction、unknown/finality |
| TC/suite/gate/raw/report/EV schema或分母 | L4 `05`，验收口径变更再回写 `06` | 05→06→07 | denominator、script/report、same-run、evidence/VETO audit |
| AC/RL/NFR/EVID/VETO/裁决规则 | L4 `06`，必要时上溯 00～05 | 06→07 | acceptance baseline、risk/veto/signoff、completion criteria |
| Phase、batch、boundary、commit discipline | L4 `07` Step 5/6/7/8/11 | 07 受影响 Steps | boundary ledger skeleton、scope、checks、body groups、handoff |
| outbound 从 0 解锁为非零 | 02 Step 6～9 后级联 03～07 | 02→03→04→05→06→07 | payload/outbox/UoW/topic/consumer/delivery/evidence 全链 |
| 仅文案、不改变正式语义/分母/门禁 | owning formal doc | 受影响文档 review | link/terminology/diff check；不得借“文案”改变 contract |

## 7. Design baseline 变更协议

1. 实现侧先将当前 boundary 标为 `blocked / wait_design`，记录 exact design source、冲突与最小复现，不自行改正式语义。
2. 由 owning design project 在其正式文档/校准流程中处理；跨仓问题由 L4-archive 只保留 blocker 和 owner pointer。
3. 设计变更完成且获审查后，取得真实 immutable design commit/hash；本轮设计阶段不预填该值。
4. 更新 project implementation ledger 与受影响 boundary ledger 的 baseline、required reads、allowed/forbidden scope、checks 和 blocker 状态。
5. 按表 6 重跑前可落码闭环审计；受影响范围不确定时按全量 P0 处理。
6. 使用新 run 执行门禁；旧 raw/report/EV 不能证明新 baseline。
7. 只有 Design/Scope/Worktree Gate 重新满足，才允许恢复同一 boundary；不能直接跳到下一个 boundary。

聊天确认、working tree 状态、未提交 diff、静态文档日期或 `latest` 引用都不是 immutable design baseline。

## 8. Phase / boundary 控制矩阵

| Phase / boundary | 主要暂停点 | 可保留的独立进度 | 恢复前最小条件 |
|---|---|---|---|
| PH-01 / 01-a | target repo/Core/graph/baseline | 仅设计仓 planned skeleton | repo+授权+Core closure+clean graph |
| PH-01 / 01-b | 55-key schema、required slots、artifact schema | 01-a 若已真实通过可保留 | config/evidence schema 回写并重新 Design Gate |
| PH-02 / 02-a | DTO/state/operation codec | PH-01 已验证结果 | contract/codec vectors 完整 |
| PH-02 / 02-b | UoW/CAS/read-set/fence/replay | 02-a 的 immutable contract | durable decision + local fault/restart gate |
| PH-03 / 03-a | visibility、view mapping、zero-write | PH-02 committed fixture | exact visibility source + zero-write tests |
| PH-03 / 03-b | cursor mapping/auth/restart | 03-a 非 continuation read surface | cursor ADR/schema/vector + security gate |
| PH-04 / 04-a | 8 source owner/fence/coverage/material | 已验证 local framework/negative fixtures | per-source formal conformance；workspace Auxiliary |
| PH-04 / 04-b | exact closure/read-set/material | 04-a 已提交的 valid bindings | closure basis + durable range proof |
| PH-05 / 05-a | target/schema/outcome taxonomy | PH-04 exact Bundle input | integrity authority/schema/vector |
| PH-05 / 05-b | capability/UoW/replay/Q03 binding | 05-a contracts | formal capability + durable save/replay proof |
| PH-06 / 06-a | storage finality/probe/intent | prior immutable assessment | storage contract + intent/probe fault tests |
| PH-06 / 06-b | current governance/project decision | 06-a placement/retrieval truth（若未被变更影响） | current decision/hold vector + zero-effect proof |
| PH-07 / 07-a | owner set/material eligibility/receiver mapping | exact Bundle/assessment | artifact + receiver contracts；new plan on drift |
| PH-07 / 07-b | handoff finality/partial/unknown/compensation | immutable plan revision | exact receiver/material + intent/probe/compensation proof |
| PH-08 / 08-a | machine artifact/report schema/redaction | prior business commits，不含证据结论 | writer/reader schema + no-static/link/redaction gate |
| PH-08 / 08-b | any required lane blocked、VETO undetermined、review缺失 | 08-a capability（若对应 baseline 未变） | all P0 prerequisites + fixed run + named reviews |

独立进度能否保留必须由影响分析证明；不能仅因 commit 已存在就默认不受新设计影响。

## 9. 门禁失败与恢复矩阵

| 状态 | 含义 | next_allowed_action | 恢复方式 |
|---|---|---|---|
| `pending` | 尚未执行或证据缺失 | `read_docs` / `run_gates`（由 ledger 当前状态决定） | 补齐前置后执行，不能提交 |
| `blocked` | 设计、依赖、环境、测试或权限阻塞 | `wait_design` / `fix_gate_failure` / `handoff` | owner closure 或同 boundary 修复后重开 |
| `failed`（测试报告姿态） | 真实断言失败 | `fix_gate_failure` | 保留失败 run；修复后新 run 重跑原 TC+同族+邻接 suite |
| `infrastructure_failed` | runner/environment/writer/cleanup 失败 | `fix_gate_failure` | 修环境；新 run，不计产品 pass/fail |
| `not_run` | 计划 lane 未执行 | `run_gates` 或保持 blocked | 不能转换为 pass；P0 required 不允许退出 |
| `not_applicable` | 当前 boundary 确实不适用 | 由当前 Gate 决定 | 必须写明正式依据，不能掩盖 required lane |
| `pass` | 真实证据与 baseline 匹配 | 按 ledger 下一动作 | baseline/scope变化后失效并重开，不永久继承 |

## 10. 变更评审、冻结与紧急修复纪律

| 场景 | 控制规则 |
|---|---|
| boundary 实施中提出新功能 | 不扩 current scope；登记 change，回写设计并安排新的正式 boundary；未确认前 blocked |
| 安全/数据泄露紧急修复 | 可由用户另行授权独立 fix，但仍须最小 Design/Scope/Test/Evidence Gate；不得借紧急名义伪造 pass或清除证据 |
| owner contract 版本升级 | 当前 binding 不自动兼容；固定新 version/fence/schema，重跑 affected conformance 与 restore/compatibility tests |
| config-only 变更 | 若改变 capability、authority、state、retry/finality 或 evidence，即视为设计变更；不可只改配置 |
| test-only 变更 | 若改变 denominator/assertion/EV/VETO，即回写 05/06；测试放宽不能使旧失败变 pass |
| documentation-only 修正 | 必须证明不改变 contract/phase/gate；否则按表 6 处理 |

## 11. 回填草稿、审计与进入 Step 11 条件

正式 `07` §10 应保留统一控制状态机、暂停/回退/补偿规则、变更分类、新 baseline 协议、16 boundary 控制矩阵和 gate 状态恢复语义。不得给出实际 rollback commit、实际 baseline 或已恢复结论。

| 审计项 | 结论 | 当前限制 |
|---|---|---|
| 每个 pause trigger 是否有动作/责任/保留/恢复 | 通过（计划层） | 当前无执行实例 |
| 回退是否保护已验证阶段和用户改动 | 通过 | 不授权 destructive git 操作 |
| code rollback / business compensation / reconcile 是否分离 | 通过 | formal provider/receiver seams 仍 blocked |
| 设计变更是否回写真相源并要求新 baseline | 通过 | 当前没有 baseline 值 |
| external unavailable 是否可被 fake 绕过 | 否 | 只允许无依赖的 local/negative slice |
| 16 boundary 是否都有具体暂停与恢复点 | 通过 | 全部仍 planned/blocked/waiting |
| 当前是否可 commit / handoff implementation | 否 | 无实现授权、仓、run 或 Gate 证据 |

- [x] 暂停、回退、变更和恢复条件明确，无“视情况处理”。
- [x] 规则与 Step 6 boundary、Step 7 gate、Step 8 dependency、Step 9 blocker 截止一致。
- [x] owner truth、workspace Auxiliary、Query no-write、intent-before-effect、outbound absence 与证据历史均受保护。
- [x] 设计偏离必须回写并产生新 baseline；实现端无临时取舍权。

`gate_status = pass_with_execution_still_blocked`；`next_allowed_action = create_and_complete_step_11_commit_review_delivery`。
