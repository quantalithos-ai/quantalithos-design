# Step 10. 回退、暂停与变更控制校准

> 对应 SOP：standards/document/实施计划讨论流程_SOP.md Step 10
> 回填目标：正式 07-实施计划.md §10
> 状态：completed / pass-designed
> 事实边界：只定义未来实现期控制协议；没有实际回退、run、artifact、report、evidence、commit 或 readiness 事实。

## 1. 输入、问题与取舍

本步读取 Step 5 的 13 Phase / 39 boundary DAG、Step 6 的 117 IMPL/BATCH、Step 7 的 39 Gate / 9 checks / 177 TC-EV、Step 8 的 13 slots / 7 jobs / immutable RuntimeConfigSnapshot、Step 9 的 11 Spike / 20 Risk / 14 OQ。旧 12 Phase、35 boundary、105 task、4-check、109 slot、12 suite 均登记为 historical_material，不承担当前身份。

本步必须回答：何时立即停；何时 fix-forward；何时需要新 baseline 和 controlled reopen；如何保护用户改动、失败事实、Unknown、同 run evidence；如何将变更传播到正式 03/04/05/06/07、ledgers 和 skeletons。

## 2. 控制不变量

| 不变量 | 当前合同 | 违反动作 |
|---|---|---|
| single current | project ledger 只能有一个 current boundary，其余 38 个 planned / wait_until_current | 冻结推进，修 ledger 并重审 |
| one boundary one commit | 一个 commit 只覆盖一个 canonical boundary；3 batch 是同一增量的编写切片 | 拆分或 controlled reopen Step 6/11 |
| source of truth | 字段、DTO、Port、state、UoW、config、evidence、AC 只回 owning formal doc | blocked / wait_design |
| Unknown fence | external commit/effect/checkpoint/publisher/lease Unknown 保留 stable identity、fence、旧 truth | 停新 effect，只能同 authority reconcile |
| failure retention | failed/blocked/infra/invalid/cancelled run/raw/report/journal 不删除或覆盖 | 新 fixed run 或正式 repair run |
| atomic config | candidate 全量通过 V0~V12 后才发布 immutable snapshot | 丢弃候选，禁止 partial publish/fallback |
| dependency owner | 仅 verified L0-core 可成为 compile candidate；兄弟仓只用 runtime/event/ref/adapter/fake seam | 阻塞 build/activation |
| evidence pairing | raw/report/index/EV 同一 fixed run、匹配 digest；无 latest/cross-run | evidence invalid / unavailable |
| fact ceiling | pass-designed、planned、blocked、not_run、not_generated 不能升级为 actual pass/readiness | hard stop，记录违规 |

## 3. 暂停触发器

| ID | 触发器 | 立即动作 | 状态 / 恢复 |
|---|---|---|---|
| PAUSE-L2R-01 | repo、branch、baseline、Core、toolchain、git identity 缺失或冲突 | 停当前及后继 | blocked / wait_design；授权 repo + immutable baseline + compatibility |
| PAUSE-L2R-02 | field/DTO/Port/state/UoW/config/test/evidence schema 缺口 | 不在代码补口 | blocked / wait_design；修 owning formal doc + 新 baseline |
| PAUSE-L2R-03 | path 越界、跨 boundary 或 source+test >500 lines | 停编辑和暂存 | blocked / fix_gate_failure；重切 scope |
| PAUSE-L2R-04 | 用户/其他 agent 重叠改动 | 停重叠文件并报告 | blocked / handoff 或 wait_design；ownership 明确 |
| PAUSE-L2R-05 | fmt/check/build/Rustdoc/targeted test 失败 | 只修 current boundary | blocked / fix_gate_failure；保留原始输出并重跑 |
| PAUSE-L2R-06 | denominator、redaction、dependency、profile 或 mandatory check 失败 | 不激活 successor | blocked / fix_gate_failure；新同 run、完整分母 |
| PAUSE-L2R-07 | VF、secret/body leak、owner takeover、fail-open、Unknown retry | 停 commit/release/handoff | blocked / fix_gate_failure；设计复核 + 独立复测 |
| PAUSE-L2R-08 | external positive contract/product/qualification 不可用 | 只冻结受影响 lane | blocked / wait_design；owner closure + qualification |
| PAUSE-L2R-09 | formal 03/04/05/06/07 或 config baseline 漂移 | 使受影响 eligibility 失效 | blocked / wait_design；最早受影响 boundary 重开 |
| PAUSE-L2R-10 | lease/commit/effect/publisher/checkpoint Unknown | 保留 fence/cursor/old truth，停新 effect | blocked；same-authority reconcile |
| PAUSE-L2R-11 | Spike/OQ 逾期或输出不完整 | 停受影响 boundary | blocked / wait_design；adopt/reject/reopen/blocked |
| PAUSE-L2R-12 | selector 空/过滤、raw/report 不成对、index orphan | 当前 gate 无效 | blocked / fix_gate_failure；新完整同 run |
| PAUSE-L2R-13 | message、staged set、用户改动隔离或 handoff 字段不完整 | 不提交、不推进 | blocked / fix_gate_failure；重审 Commit/Handoff |

暂停是可恢复保护状态，不是失败或 readiness。fake、目录、ping、ACK、口头同意都不能关闭暂停。

## 4. 回退策略

| ID | 场景 | 允许 | 禁止 | 验证 |
|---|---|---|---|---|
| RB-L2R-01 | 未提交 current defect | allowed scope 内 fix-forward，保留失败测试/journal | reset/checkout/clean 用户文件 | current boundary 全 Gate |
| RB-L2R-02 | 已提交 defect | 新 fix/revert boundary；仅 owner 明确授权才 revert | amend、历史重写、跨 boundary cherry-pick | impact + regression |
| RB-L2R-03 | formal design correction | 新 baseline，从最早受影响 boundary 重开 | 两套 truth、private alias | affected Design/Scope |
| RB-L2R-04 | config/build graph failure | 丢弃 candidate，保留 prior valid snapshot（若 formal 允许） | partial publish、invalid fallback、hot patch | V0~V12 + builder |
| RB-L2R-05 | external Unknown | stable request/fence/status，status-only reconcile | blind retry、新 identity、猜结果 | matching owner source |
| RB-L2R-06 | checkpoint CommitUnknown | Prepared/Unknown non-stable，禁止 resume | 新 identity 重做物理提交 | matching receipt |
| RB-L2R-07 | job page/lease/cursor Unknown | old committed cursor 权威，停止 page | 内存 cursor、失效 lease 继续 | 新 claim |
| RB-L2R-08 | test/release run failure | 保留失败 run，创建新 fixed run | 覆盖、删除、cross-run cherry-pick | 新 run 完整分母 |
| RB-L2R-09 | report/evidence failure | 保留 raw/generator failure，按规则 rerun | 手写 report/evidence/verdict | pairing/digest/redaction |
| RB-L2R-10 | adapter Spike fail | reject 或 reopen owner design | TestFake 冒充 Ready | 重新 qualification |
| RB-L2R-11 | outbound handoff failure | local outcome 不变，append-only attempt/gap | 反改 outcome、自闭 gap | source/status reconcile |
| RB-L2R-12 | baseline drift | 使当前和受影响后继失效 | 继续用旧 report/baseline | 新 baseline + affected rerun |

## 5. 回退层级

    Batch failure
      -> fix current batch
      -> rerun current boundary checks
      -> Commit/Handoff Gate

    Boundary failure after commit
      -> preserve committed history
      -> new fix/revert boundary
      -> re-audit affected successors

    Formal truth change
      -> controlled reopen owning Step
      -> freeze new immutable baseline
      -> reopen earliest affected boundary
      -> regenerate Step 6/7/11/12/13 consumers

## 6. 变更传播矩阵

| 变更 | 首要权威 | 分析范围 | 必须同步 | 恢复门禁 |
|---|---|---|---|---|
| wording-only | owning formal doc | prove no semantic/ID/boundary delta | formal + calibration + ledger note | doc review + diff |
| field/type/variant/callable/Port | formal 03 | constructors/readers/writers/flows/states/tests | 03 -> 05 -> 06 -> 07 -> ledgers/skeletons | new baseline + Design Gate |
| state/UoW/idempotency/Unknown | formal 03 §9~13 | replay/fence/outbox/evidence/phase | 03/05/06/07 + tasks/gates | transaction/replay audit |
| config key/profile/source | formal 04 (semantic first 03) | loader/precedence/snapshot/builder/replay | 03/04/05/06/07 | V0~V12 |
| TC/CUT/suite/check/artifact/report/evidence | formal 05 | denominator/writers/readers/generators | 05/06/07 + PH-13 | same-run negative audit |
| AC/VF/NFR/EG/risk/signoff | formal 06 | evidence/review/handoff/veto | 06/07 + gate mapping | acceptance review |
| phase/boundary split/order | formal 07 Step 5~7/11/12 | predecessor/IDs/tasks/gates/messages/ledger | 07 + all consumers + skeletons | set equality |
| private adapter/product | infra/config | prove no public/semantic/status delta | scope/profile/tests | targeted qualification |
| Rustdoc language | formal 03 + coding standard | all Rust boundary source | 03 + affected reads | L2R-LANG-002 closure |

## 7. Blocker 与恢复记录

每个 blocker 必须记录 blocker_id、boundary、gate、status、reason、affected_paths、design_sources、source_owner、forbidden_workarounds、requested_closure、next_allowed_action。关闭时再增加 design_fix_baseline、resolution_source、resolution_summary、affected_reruns、provenance。

当前 source blockers L2R-UP-001~008、L2R-CP-001、L2R-ENTRY-001、L2R-IMPL-001、L2R-LANG-001/002 均保持 open/pending；没有 closure record。path 存在、TestFake pass、ACK、设计期 pass-designed 不能替代 closure。

## 8. 恢复协议

    owning authority closure
      -> freeze new immutable formal/config baseline
      -> update project ledger and 07 flow
      -> update Step 6/7/11/12 consumers
      -> regenerate affected Step 13 ledger/skeletons
      -> set earliest affected boundary current/blocked
      -> reread exact Required Reads and protect user changes
      -> rerun Activation/Design/Scope/Worktree
      -> fix-forward current boundary only
      -> run new Build/Test/Evidence
      -> Commit Gate
      -> Handoff Gate
      -> explicitly advance project ledger

baseline 变化影响已完成 boundary 时，不能只重跑最后测试；其后的 boundary 必须回到 planned / wait_until_current 或 blocked。

## 9. 影响审计

| 影响对象 | 下游审计 |
|---|---|
| vocabulary/ref/digest | 39 boundaries、8 suites、dependency/redaction checks |
| loop state/reservation | PH-03 后全部 capability service、replay、jobs、entry |
| command/query/event/job | service、facade、inbox/outbox、projection、selectors |
| state/UoW/Unknown | writers/readers、reconcile、VF/NFR、evidence precedence |
| config root/slot/job | builder、profiles、13 slots、7 jobs、dependency/fake/security |
| evidence denominator/check | PH-13 manifests/reports/index/drafts，禁止缩分母 |
| phase/boundary identity | Step 5/6/7/11/12/13、两级 ledger、39 skeleton |
| external owner seam | 仅冻结 positive lane；negative/fail-closed 可继续但不宣称 positive |

## 10. Step 关闭审计

| 检查 | 结果 |
|---|---|
| 13 pause triggers 有动作、状态、保留物、恢复条件 | pass-designed |
| 12 rollback scenarios 区分允许/禁止/验证 | pass-designed |
| Unknown、config、same-run evidence、用户改动保护独立覆盖 | pass-designed |
| 10 change classes 绑定 authority、传播和门禁 | pass-designed |
| blocker schema 与 baseline propagation 可执行 | pass-designed |
| 当前口径为 13 Phase / 39 boundary / 117 task-batch / 39 Gate | pass-designed |
| 实际回退、run、artifact、report、evidence、commit、readiness | none / not_started |

## 11. 回填草稿与进入条件

正式 §10 只回填第 2~8 节控制结论。进入 Step 11 前，Step 10 必须 completed / pass-designed，flow 与 project ledger 原子推进到 Step 11，旧 12/35/105/4-check 仅保留为 historical_material，实现状态仍 not_started，且不得创建实现仓、写代码或提交。
