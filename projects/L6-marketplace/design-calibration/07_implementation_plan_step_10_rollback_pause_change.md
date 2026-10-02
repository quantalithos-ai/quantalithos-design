# 07 Step 10：回退、暂停与变更控制

## Step 状态

| 字段 | 值 |
|---|---|
| status | completed / selfcheck_done / stop_review |
| gate_status | pass (design-only) |
| gate_reason | 本Step结构化/定向回修及正式传播已完成；Step13实际文档静态核验通过，见07_implementation_static_review_record.md；仅design，不表示实施或资格 |
| next_allowed_action | waiting_user_confirmation |
| source_files | Step 6/7/8/9；03 §9～§17；04 §10/12；05 §11/12/14；06 §4/11/12/13；闭环标准 §九 |

### Step 内计划

| 项 | 状态 | 产物 |
|---|---|---|
| 读输入/逐问题/诊断/取舍 | done | 下方逐项及原结构化产物 |
| 定向修复/复杂度/回填 | done | 排程/数量/来源/安全及成熟度按新版Step5～8对齐；业务schema不复制 |
| 自检/停审 | done | Step13实际文档静态核验通过；外部资格/实施Gate不通过 |

## 本步目标

规定实施遇到设计缺口、门禁失败、外部依赖不可用、需求变化或不确定外部效果时，何时暂停、回退、回写设计、重建 baseline 和恢复。规则保护已验证 boundary，不允许实现者自行放松字段、状态、scope、证据或 owner 边界。

## 本步输入

| 输入 | 作用 |
|---|---|
| Step 6 boundary | 提供回退粒度、allowed/forbidden scope、Commit/Handoff Gate |
| Step 7 gate matrix | 提供 test/acceptance/evidence failure 触发 |
| Step 8 dependencies | 提供环境、PG、SDK、owner unavailable 处理 |
| Step 9 blockers | 提供 Spike、external/capacity/future 截止点 |

## SOP 问题回答

| SOP问题 | 回答 |
|---|---|
| 1. 哪些情况必须暂停当前阶段。 | 设计schema/状态/phase冲突，requiredgate失败、VETO、secretleak、Unknown无probe及baseline漂移必须pause。 |
| 2. 哪些情况允许回退到上一个提交边界。 | 只在授权且保护用户/其他boundary改动后对当前增量修复/revert；不执行reset/checkout破坏工作区，不删run/history。 |
| 3. 哪些情况必须回写详细设计或测试方案。 | 新fields/state/port/ownertruth、配置/证据/phase变化必须回所属truth/calibration并审影响。 |
| 4. 门禁失败后如何处理。 | 保留actualrawfailure和redactedcontext，修当前增量，重跑新run/新execution，不覆盖已完成run。 |
| 5. 外部依赖不可用时是否允许继续局部实施。 | 可设计/实现不依赖缺口的localnegative，但当前required依赖不足不能跨界；受影响selected仍blocked，fake不升格。 |
| 6. 恢复实施的条件是什么。 | 新immutablebaseline（若设计变）、用户授权、scope/worktree/环境与必要qualification成立，再Design→Scope→Worktree→Build/Test→Evidence→Commit/Handoff。 |
| 7. 发现字段缺失、状态冲突、DTO 构造不完整或 phase boundary 越界时如何处理。 | 实现者不临场补schema或缩scope；pause精确source/affected记录→设计者回写→重核55项/横扫同类boundary→新baseline。 |

## 当前文档问题诊断

| 问题 | 影响 | 处理 |
|---|---|---|
| “先继续，最后统一修” | 会让错误状态/字段传播多个 boundary | design closure failure 立即 pause |
| 直接回滚数据库/删除原结果 | 丢失审计、Unknown 责任和复现上下文 | 只按正式 rollback/recovery 契约，保留原 result/history |
| 外部服务 unavailable 当作暂时 skip | 证据链缺口，可能被误写 pass | 标 blocked/unavailable，保留 raw failure/context |
| 需求添加字段在代码里临时实现 | 第二套 truth | 回写 00～03/04/05/06，重新编号 boundary |
| report/redaction 失败仍交付 | 泄露敏感数据或伪造验收 | 当前 gate 阻断，修脚本/脱敏后使用新 run_id 与新 execution_id 重跑，旧失败不覆盖 |

## 改动前后对比

| 项 | 原有风险 | 本步规则 |
|---|---|---|
| 暂停 | 依赖 agent 判断 | 触发条件、责任、证据和恢复条件固定 |
| 回退 | 可能破坏已验证状态 | boundary 粒度回退，保留历史/原 result/ledger |
| 变更 | 需求变化直接插入当前 phase | 变更分类、影响审计、baseline 和 boundary 重建 |
| Unknown | retry 或失败混淆 | probe/reconcile/waiting 三分支 |

## 设计取舍

| 方案 | 结论 | 理由 |
|---|---|---|
| 用 feature flag 绕过设计 blocker | 拒绝 | 配置不能产生 truth/approval/qualification |
| 把 blocked boundary 改为 not_applicable | 拒绝 | not_applicable 只用于确实不涉及该门禁 |
| 只回退代码不更新 ledger/report | 拒绝 | 无法恢复或审计 baseline |
| 保留本地正确性、隔离外部 blocked | 采用 | 最大化可验证增量且不伪造 ready |

## 结构化中间产物

### 暂停规则表

| 触发条件 | 动作 | 责任方 | 保留证据 | 恢复条件 |
|---|---|---|---|---|
| 字段/DTO/状态/port 缺失或冲突 | pause boundary；回写所属 03/04/05/06 | design owner + implementation agent | ledger blocker、diff、source refs | 新 baseline、闭环复核 pass |
| phase boundary 依赖后续结果 | pause；拆 boundary 或补 reserved 标记 | design owner | dependency audit | phase order 修正 |
| Design/Scope Gate 不通过 | 不改代码/不提交 | implementation agent | boundary ledger gate | gate evidence 完整 |
| test/build gate 失败 | 保留 raw failure，修当前 boundary | implementation agent | run artifact/report | targeted rerun pass |
| VETO 命中 | 阻断 phase/handoff；不得 risk accept | reviewer | veto checklist + raw | 设计/代码修复并全量复验 |
| external contract unavailable | affected boundary blocked/waiting | owner/SDK + implementation | qualification record | exact contract/probe available |
| CommitUnknown/remote effect unknown | 保留 intent，probe/reconcile，不盲重试 | application/owner | original operation + probe | formal terminal or reconciled result |
| secret/raw body/redaction leak | 立即 pause，隔离输出并修复 | security/reviewer | redaction failure、受控日志 | clean rerun + reviewer pass |
| evidence/report schema or DAG invalid | 不生成 acceptance handoff | test/release reviewer | raw/schema error | schema/check pass |

### 回退规则表

| 场景 | 回退目标 | 允许动作 | 禁止动作 |
|---|---|---|---|
| 当前 boundary 未提交 | 当前 worktree 到上一个已通过 boundary | 只在用户授权且已记录用户/无关改动后，保护性撤回自己当前增量，保留design notes；不reset/checkout/删目录 | 删除前序 evidence/history |
| boundary 已提交但未 handoff | 当前 boundary commit 后的 fix/revert | 保持同boundary scope/保护用户改动；获得提交授权后可审计fix/revert，新run重跑 | 混入下一 boundary |
| gate 失败但未改变 design | 同一 boundary | 修 bug/测试/脚本后重跑 | 改 AC/TC/VETO 规避失败 |
| design baseline 变化 | 旧 boundary 标 superseded，重建受影响 boundary | 新 baseline + impact audit | 在旧 baseline 上继续 |
| PG migration/Tx failure | 数据库测试环境重建/回滚到受控 fixture | 按 migration 版本和 ledger 记录 | 删除正式 history/result |
| external side effect unknown | 不回退本地原 intent | probe/reconcile/late result | blind retry/cancel-as-success |

### 变更控制表

| 变更类型 | 示例 | 必须回写 | 影响审计 | 恢复条件 |
|---|---|---|---|---|
| 需求范围 | 新增 rating/payment/安装 | 00/01/02/03/05/06/07 | ownership、FR/AC/VETO、phase/boundary | 用户/owner确认 + full restart affected docs |
| domain schema | 新字段/enum/state | 03、05、06 | factory/flow/Tx/test/AC 全链 | 1:1 closure pass |
| external contract | SDK operation/schema/version/scope | 01/03/04/05/06 | adapter/slot/negative/positive | exact qualification |
| phase/boundary | 合并/拆分/改顺序 | 07 Step 5/6/7/12 | dependencies、ledger、commit scope | cross-boundary audit |
| evidence schema | raw/report/EV 字段或 DAG | 05/06/07 | redaction、integrity、AC/VETO | same-run schema/review |
| config | 新字段/slot/hot reload | 03/04/05/07 | security/secret/profile/ownership | reopen 00～04 |
| toolchain | Rust/MSRV/codec/PG major | 03/04/05/07 | compile/golden/fixtures | compatibility Spike |

#### 恢复流程图: 原责任与新run

```text
[pause; preserve original operation/history/failed run]
  -> [redacted failure + ledger + affected scope]
  -> [fix owning design/current increment; protect user changes]
  -> [freeze new baseline when design changes; re-read]
  -> [new run / execution; Design > Scope > Worktree > Build/Test > Evidence]
     +--> failure: remain blocked
     +--> success + authority: Commit > Handoff > next current only
```

关键说明：
- 图表达恢复控制顺序，不表达实际部署或自动 rollback。
- 未完成 probe/reconcile 时，Unknown 仍是 waiting，不是失败或成功。
- 任何设计修复后都要检查是否需回写闭环标准/SOP/永久记忆及正反例。

### 跨 boundary 变更审计

| 审计项 | 结论 |
|---|---|
| pause triggers cover design/build/test/evidence/external/VETO | pass |
| rollback protects accepted history/result | pass |
| change requires source doc + impact audit | pass |
| recovery requires new baseline and gate rerun | pass |
| blocked cannot become not_applicable/pass by convenience | pass |

### 本次经验回写与正反例

现有标准§9.2的phase/config/schema/artifact/path已覆盖本轮缺口，不新增通用规则；只回写本项目04句、07所属Step、15scope与MEM-MP-007/010，禁止越权改标准/SOP。若未来出现标准未覆盖的新型blocker，登记具体待回写/横扫并停止相关移交，取得范围授权后再更新规则。

正例：catalog所需四kind typedplan/get/lookup放02-b，refresh/rebuild在03-b与目录闭合；owner.bindings整体→owner_bindings、web.default_locale→default_locale；报告工具01-a能保留失败raw/minimal壳，07-a才final。

反例：搜索先上线却把builder推05，JSON两个leaf当两Rust字段，缺subcase仍把earlyindex标complete，直接reset丢用户改动或同run覆写失败。修复必须对15boundary及03/04/05/06/07同类面横扫，不只修一句或单test。

## 回填草稿

> 实施计划必须在字段/DTO/state/port/phase 冲突、VETO 命中、Unknown 无 probe、外部 qualification 缺失、证据/脱敏失败或 design baseline 漂移时暂停。回退以 commit boundary 为单位，保留 history、原 operation/result、raw failure 和 ledger；不得删除 Unknown 责任或用 blind retry/配置 flag 绕过门禁。
>
> 需求、schema、external contract、phase/boundary、evidence schema、config 或 toolchain 变化必须回写相应正式文档并完成影响审计。恢复需要新 baseline、重读正式文档、重新执行 Design/Scope/Build/Test/Evidence Gate；否则保持 blocked/waiting。

## 待确认事项

| 事项 | 影响 | 截止点 |
|---|---|---|
| 实现仓使用的回退/分支策略 | boundary commit gate | 首个实现 boundary 前 |
| PG test fixture reset 权限 | PH-02 recovery | PG boundary 前 |
| external probe/late result owner | PH-04/05 | distribution boundary 前 |
| security incident/redaction 处理责任 | PH-07 handoff | script/evidence boundary 前 |

## 进入下一步条件

- [x] 暂停、回退、变更和恢复均有触发、责任、证据和恢复条件。
- [x] 规则覆盖设计、测试、外部依赖、Unknown、VETO、证据和需求变化。
- [x] 回退不删除历史/原结果，不把 Unknown 改写为成功。

## 停审记录

本Step及其定向回修已通过Step13实际文档静态检查，正式来源与结构化产物一致。状态为completed / selfcheck_done / stop_review；本轮全部07设计已完成，现在等待用户确认07，不跨文档或实施。上游blocker、immutablebaseline与实际实现Gate仍未通过；无业务测试run或commit。
