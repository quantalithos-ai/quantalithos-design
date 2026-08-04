# L4-observability 07-实施计划 Step 10：回退、暂停与变更控制

> 对应 SOP：`standards/document/实施计划讨论流程_SOP.md` Step 10
> 对应书写规范：`standards/document/实施计划书写规范.md` §5.10
> 直接输入：current Step 06~09、`代码实施台账与门禁规范.md`、`03/04/05/06` current 正式文档
> 文档性质：设计讨论中间产物。本文规定未来实现边界的控制动作，不声称发生过 rollback、gate execution、代码修复或 evidence 生成。

## 1. Step 状态

| 项 | 当前值 |
|---|---|
| project | `L4-observability` |
| document | `07-实施计划` |
| step | `Step 10 / 回退、暂停与变更控制` |
| mode | `full-restart` |
| status | `completed_current_step_10` |
| current module | `rollback-pause-change-control` |
| input baseline | current Step 01~09；current formal `03/04/05/06` |
| implementation state | 未开始；目标实现仓 absent；没有真实 boundary execution |
| design gate | `pass_with_affected_and_reality_preconditions` |
| new upstream blocker | `none` |
| inherited affected | `12` 项继续 `open` / `controlled` / `conditional` |
| next allowed action | `continue_to_step_11` |
| current commit | 不需要；用户未要求提交 |

## 2. 本步输入与阅读记录

| 输入 | current 用法 | 结果 |
|---|---|---|
| Step 06 boundary matrix | 固定暂停/回退的最小单位、allowed/forbidden scope 和提交前门禁 | 16 个 boundary 均可作为独立控制对象 |
| Step 07 gate matrix | 定义 gate failure 分类、证据保留和不得继续规则 | `GATE-OBS-01~12` 只规划，不填执行状态 |
| Step 08 environment/dependency matrix | 区分 compile dependency、required runtime、optional seam 和 P1/P2 reality | 不可用状态不得被降级成 pass |
| Step 09 Spike/risk/affected register | 将风险、affected、截止点和回写触发转成操作规则 | 12 项 affected 不由控制流程关闭 |
| 可落码性标准 §九 | 定义字段、DTO、state、ref、metadata、projection、artifact 的设计缺口处理 | 设计冲突必须回写真相源，不由实现者临时取舍 |
| 代码实施台账规范 | 定义 ledger、current boundary、Commit/Handoff Gate 和恢复顺序 | Step 13 才重建 current implementation assets |

## 3. SOP 问题回答

1. **必须暂停的情况。** 目标仓/core dependency 不可用；正式字段、DTO、state、port、source、version、marker、report ref 或 config binding 不闭合；实现越过 boundary；blocking gate、redaction、dependency、no-write、report audit 或 VF 失败；无关用户改动混入；均必须暂停当前 boundary。
2. **允许回退的情况。** 默认只清理当前 boundary 的未提交试探改动；已验证 boundary 不能被擅自回退。已提交 boundary 的缺陷优先新增修复 boundary/commit，只有用户明确要求才 amend/rebase。
3. **必须回写的情况。** 对象/协议/flow/state/UoW/source owner 回写 `03`；配置/profile/ENV/entry 回写 `04`；TC/DS/suite/artifact/report 回写 `05`；AC/VF/EVG/review authority 回写 `06`；phase/boundary/gate/ledger 回写 `07`。
4. **门禁失败处理。** 先保留失败输入和输出，区分实现 bug、测试工具缺口、设计真相源冲突、依赖不可用和 hard redline；除 P1/P2 真实环境缺失外，不允许继续或提交。
5. **依赖不可用时的局部实施。** LocalTest 的设计/纯语义测试可在不依赖外部 provider 的范围继续；required durable/INT、target repo、core compile dependency 不可用时，相关 boundary 保持 blocked/not_run；RuntimeLike 不得由 ISO 或 Controlled 冒充。
6. **恢复条件。** blocker 已修复或设计已回写并固定新 baseline；current boundary closure review 重做；worktree 仅含授权改动；相关 gate 重跑并有可追溯证据；ledger 状态重新激活。
7. **如何处理字段缺失、状态冲突和 phase 越界。** 立即停止当前 boundary，记录文件/章节/行号和影响 ID，回写真相源并更新 Step 06~10；禁止临时字段、alias、默认状态、字符串 ref、shadow DTO 或后续 phase 结果。

## 4. 当前文档问题诊断

| 位置 | 问题 | 风险 | 本 Step 修正 |
|---|---|---|---|
| 旧正式 `07` | 只有“失败后修复”的概括，没有 pause/rollback/recovery 状态机 | 实现者可能继续临时取舍 | 建立触发、责任、证据、恢复条件表 |
| 旧 implementation ledger | 可能把 planned、current 和 execution 混用 | 会伪造 handoff readiness | 规定 Step 13 重建；当前不激活 |
| Step 09 affected | 已有控制面但没有统一停止动作 | affected 可能被误报为 positive | 每项受影响 boundary 都有 controlled/blocked 处置 |
| Step 07 evidence | failure artifact、wrong-run、static pass 的处理分散 | evidence provenance 断裂 | 统一 gate failure matrix 和保留规则 |
| 工作区 | 存在用户已有改动 | 回退命令可能伤害用户内容 | 明确只处理当前 boundary 授权范围，禁止 destructive reset/checkout |

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 暂停条件 | 分散在各 phase/boundary | 统一按 truth、gate、dependency、scope、user change 分类 | 实现者可直接判断 |
| 回退范围 | 未明确 | 默认仅当前 boundary 未提交改动 | 保护已验证阶段和用户改动 |
| 设计回写 | 只写“回写设计” | 按 `03/04/05/06/07/standards` 精确分流 | 防止错误真相源 |
| evidence 失败 | 可能被重新生成覆盖 | raw failure 保留，fixed run 另建并回链 | 保持审计可追溯 |
| affected | 可能作为 residual 被吞掉 | 保留 exact ID、状态、主 boundary 和禁止声明 | 防止观测面越权关闭上游条件 |

## 6. 设计取舍

| 方案 | 结论 | 原因 |
|---|---|---|
| 实现者自行补字段或状态继续 | 不采用 | 会破坏 current 03/04/05/06 真相源 |
| 任一失败都回退整个 phase | 不采用 | 会破坏已验证增量和审计边界 |
| 按 boundary 暂停，按 failure class 分流 | 采用 | 与 Step 06、ledger 和 review 粒度一致 |
| 用新的 run 覆盖失败 run | 不采用 | 失败材料必须可追溯，且禁止跨 run 拼接 |
| 以风险接受绕过 redaction/no-write/VF | 不采用 | 这些是 hard blocker，不是 residual capability |
| P1/P2 环境不可用阻断全部 P0 | 不采用 | 只记录 `not_evaluated`/residual，不冒充 P0 通过 |

## 7. 结构化中间产物

### 7.1 暂停规则表

| 触发条件 | 动作 | 责任方 | 必须保留 | 恢复条件 |
|---|---|---|---|---|
| target repo absent 或 workspace 不可定位 | `pause` 当前 `commit-01-a` | 实施负责人/设计者 | path check、ledger 状态、用户改动说明 | target/worktree/toolchain 前置通过 |
| core path/package/crate/type 不匹配 | `pause + wait_design` | 实施负责人/core owner | Cargo metadata/error、差异表 | core 或设计依赖修复并重新核验 |
| 字段/DTO/state/port/ref/source/version/marker/report ref 缺口 | `pause + change` | 设计者 | 文件、章节、行号、影响 ID、建议闭口点 | 对应真相源回写并固定新 baseline |
| phase 或 boundary scope 越界 | `pause + change` | 设计者/实现负责人 | diff、Step 06 scope、调用关系 | 调整实现范围或 current `07` 后重核 |
| redaction/body-free/secret finding | `pause + defect` | 实施/安全/架构负责人 | scanner finding、raw input、safe failure report | finding 修复且 GATE-OBS-08 重跑通过 |
| Query、rebuild、handoff、job 或 exporter 取得 writer capability | `pause + hard_block` | 架构/实现负责人 | writer spy、dependency/static finding | capability 移除、no-write gate 通过 |
| business truth、source owner 或 audit truth 被反写 | `pause + change` | 架构负责人 | write trace、调用栈/静态定位、相关 VF | 回写 `03`/`07`，修复并重跑 VF |
| compile/unit/service/query/consumer/job gate failed | `pause` 当前 boundary | 实施负责人 | failed raw/report、命令和 diff | 实现 bug 修复或设计回写后重跑 |
| report/audit 使用 `latest`、跨 run 或 static pass | `pause + hard_block` | 测试/报告负责人 | report-audit finding、输入 manifest | generator 修复，同 run audit 通过 |
| required INT/durable/runner unavailable | `pause` 相关 boundary | 环境/实施负责人 | capability check、lane 状态 | 依赖可用并重新执行；不得 ISO 替代 |
| RuntimeLike unavailable | `not_evaluated`；不阻断可独立的 P0 design/ISO | 测试/验收负责人 | unavailable marker、scope | 真实 lane 建立后独立 run；不得改写历史状态 |
| inherited affected 未闭合 | `controlled/blocked` 对应 surface | 设计者/上游 owner | affected register、negative fixture | 上游 owner、source、test/evidence closure 完整 |
| 无关用户改动进入当前 diff | `pause` staging/commit | 实施负责人 | `git status`、name-only diff | 只 stage 当前 boundary；用户改动原样保留 |
| VF-OBS-001~010 或 EVG hard failure | `pause + no_release` | 实施/测试/验收负责人 | raw/report/checklist | 修复、复验、人工审查；不得风险接受替代 |

### 7.2 回退规则表

| 场景 | 允许范围 | 禁止事项 | 保留材料 | 恢复条件 |
|---|---|---|---|---|
| 当前 boundary 未提交试探失败 | 清理当前 boundary 未提交改动 | 不触碰用户文件、其他 phase 或历史提交 | failed diff、日志、设计引用 | 重新从同一 boundary 的 closure review 开始 |
| 当前 boundary 实现 bug | 修改当前 boundary 文件并重跑 gate | 不用 reset/checkout 抹掉用户改动；不删除 failed raw | failure report、修复 diff、重跑结果 | required checks 全部通过 |
| 当前 boundary 发现设计缺口 | 暂停并保留或清理试探改动 | 不新增 schema/state/port/alias | blocker note、回写 diff、new baseline | 设计者复核通过，ledger 重新激活 |
| 已提交 boundary 发现缺陷 | 新增修复 commit/boundary | 未经用户要求不得 amend/rebase 或回写已验证历史 | 原 commit 引用、缺陷 report、修复关联 | 修复 commit gate/handoff gate 通过 |
| staged scope 混入无关文件 | 只调整 staging 区当前 boundary 文件 | 不使用 destructive reset；不删除用户文件 | pre/post staged name list | scope gate 通过 |
| report/evidence generator 错误 | 修改 generator，并保留旧失败 raw | 不手写 pass、alias、verdict，不覆盖旧 run | raw/report audit、fixed run linkage | same-run provenance audit 通过 |
| 外部调用结果 indeterminate | 不回退或盲重试业务 truth | 不换 token、target、binding 或新 intent | probe/manual record、stored token | same-token finalize/probe 规则完成 |

### 7.3 变更控制表

| 变更触发 | 真相源/变更目标 | 必须同步 | 变更动作 | 恢复条件 |
|---|---|---|---|---|
| Command/Consumer/Query/Job object、flow、state、persistence、idempotency 缺口 | `03-详细设计.md` + 对应 calibration | Step 06 boundary、Step 07 gate、Step 09 affected | 回写正式设计和中间产物；不在代码补设 | new baseline + closure review |
| config profile、ENV、CLI、entry、adapter binding 缺口 | `04-配置设计.md`，必要时 `03` | Step 08 readiness、`07-a/b` gate | 更新 exact config/source/failure mapping | config negative/positive contract review |
| TC/DS/suite、artifact/report、redaction/metric/dependency script 缺口 | `05-测试方案.md` | Step 07 gate/boundary evidence | 更新测试真相源和 manifest；保留旧失败输入 | 99/82/9 join 和 audit design 通过 |
| AC/NFR/VF/EVG、review、risk acceptance 或 signoff 权限缺口 | `06-验收标准.md` | Step 07、Step 12、`08-b` | 回写裁决和责任边界 | authorized review rule fixed |
| phase、boundary、batch、commit、ledger 或 gate 规则缺口 | `07-实施计划.md` + calibration | flow、project ledger、boundary matrix | 先停实施，再重建受影响 Step | cross-boundary audit 通过 |
| 可复用闭环经验未进入标准 | `设计真相源闭环与可落码性标准.md` | Step 03 memory seed、正式 07 reference | 先判断是否可泛化，再补正反例 | standard review 通过；本次仅记录候选 |

### 7.4 门禁失败处理矩阵

| 失败项 | 失败分类 | 动作 | 是否可继续 |
|---|---|---|---|
| workspace/format/compile/dependency | implementation/readiness | 修复 target/core/workspace；若设计冲突则回写 | 否 |
| contract/domain owner/body-free/state factory | design closure | 回写 `03`，保留 failure | 否 |
| UoW/idempotency/consumer completion/no-write | implementation or design hard block | 修复当前 boundary 或回写；不默认 action | 否 |
| redaction/metric/trace safety | VF/hard redline | 修复 source/scanner；保留 finding | 否 |
| query visibility/freshness/absence | design or implementation | 修复 source map/mapper；禁止 empty fallback/rebuild | 否 |
| external phase/recovery unknown | controlled/indeterminate | 保留 token/binding；manual/finalize-only | 只可继续不相关 boundary |
| missing raw artifact/wrong run/orphan TC/DS | evidence integrity | 修复 runner/generator；原失败材料不覆盖 | 否 |
| static evidence/latest/cross-run join | evidence/VF blocker | 删除伪造来源，改为 same-run materialization | 否 |
| required INT/RuntimeLike unavailable | environment readiness | 标 `blocked/not_run/not_evaluated` | 仅可继续不依赖该环境的设计/ISO工作 |
| P1/P2 product or performance threshold unavailable | residual/future | 写入 open issue/risk acceptance draft | P0 可继续，不得计完成 |
| user-owned unrelated diff | scope/control | 分离 staging，停止 commit | 否 |

### 7.5 恢复实施流程

```text
pause trigger
  -> classify failure and freeze current boundary
  -> preserve error, raw artifact, report, diff and design line references
  -> fix implementation/tool or write back the correct truth source
  -> record new design/target baseline (if any)
  -> repeat boundary closure and experience review
  -> rerun only the affected boundary gates
  -> update project/implementation ledger
  -> continue from the same boundary or explicitly open the next one
```

| 恢复检查 | 通过条件 | 设计期状态 |
|---|---|---|
| baseline | design baseline、target repo HEAD（若已存在）和 Step 06 boundary 一致 | `planned; not verified` |
| worktree | 只包含当前 boundary 的授权改动；用户已有改动未被回退或 stage | `planned; not verified` |
| closure | 字段、DTO、state、ref、source、metadata、idempotency、projection、artifact、phase boundary 复核通过 | `planned gate` |
| dependency | required capability 已可用；profile/lane 合法；无 fallback | `planned gate` |
| gate | 当前 boundary 的 required checks 重跑并达到允许状态 | `planned; no result claimed` |
| evidence | failed raw 保留；fixed run/report 可按同一 identity 回链 | `planned; no run claimed` |
| ledger | current boundary、gate_status、blocker、next action 已同步 | `planned; Step 13 asset pending` |

### 7.6 暂停、回退与变更停审记录

| 审查项 | 结论 | 说明 |
|---|---|---|
| Step 09 blocker 是否都有操作动作 | pass | 每项可映射 pause、controlled、residual 或 change |
| 回退单位是否与 16 boundary 一致 | pass | 默认以当前 boundary 未提交改动为单位 |
| 用户改动和已验证历史是否受保护 | pass | 禁止 destructive reset/checkout；未经授权不 amend/rebase |
| 设计回写目标是否分流 | pass | `03/04/05/06/07/standards` 各有明确责任 |
| no-write/redaction/evidence hard blocker 是否可绕过 | no | 不允许风险接受替代 |
| external unknown 是否有安全恢复路径 | pass | same-token probe/finalize-only/manual |
| 恢复是否要求重跑 closure 和 gate | pass | 不允许从旧 pass 直接恢复 |

### 7.7 跨控制规则审计表

| 审计项 | 结论 | 处理 |
|---|---|---|
| pause 规则覆盖 target/core/design/gate/dependency/user diff | pass | §7.1 全覆盖 |
| rollback 规则保护已验证 phase 和失败证据 | pass | §7.2 |
| change target 与上游文档 ownership 一致 | pass | §7.3 |
| gate failure 与 Step 07 状态优先级一致 | pass | blocked/not_run/conditional/not_evaluated 不折叠为 pass |
| affected 是否被回退流程误关闭 | no | 仍按 Step 09 register 维护 |
| 代码仓 destructive command 是否被隐式授权 | no | 只记录原则，不执行命令 |
| 新 upstream blocker | none | 仅继承已知现实和 affected 条件 |

## 8. 回填草稿

正式 `07` §10 应保留四组规则：暂停触发、boundary 级回退、按真相源分流的变更控制、恢复实施的五类检查。正文应明确 failed raw/report 保留、same-run 约束、no-write/redaction/VF 不可风险接受，以及不触碰用户已有改动；不写任何实际回退命令输出、commit hash 或修复结果。

## 9. 待确认事项

| 编号 | 事项 | 当前处理 | 截止点 |
|---|---|---|---|
| `OQ-OBS-10-001` | 已提交 boundary 的修复是否由新增 commit 还是用户授权 amend | 默认新增修复 commit；amend/rebase 需明确授权 | 首个已提交缺陷前 |
| `OQ-OBS-10-002` | failed artifact/report 的保存周期和存储责任 | 至少保留至 fixed run/report 可回链；具体 retention 由 `04/06` 既有规则承接 | 首个真实 runner 前 |
| `OQ-OBS-10-003` | 设计修复后是否形成可泛化标准经验 | 由 Step 11/13 复核；本 Step 不擅自修改标准 | Step 13 cross-audit |
| `OQ-OBS-10-004` | 环境不可用的人工授权和 residual owner | 由 Step 12/06 的责任矩阵承接 | release handoff 前 |

未关闭事项不得授权受影响 boundary；它们不构成新的 upstream blocker，但必须以 `open`/`conditional` 进入后续台账。

## 10. 进入下一步条件

| 条件 | 结论 | 依据 |
|---|---|---|
| 暂停触发、责任、证据和恢复条件明确 | pass | §7.1 |
| 回退范围不伤害用户改动和已验证历史 | pass | §7.2 |
| 设计变更按正确真相源回写 | pass | §7.3 |
| 门禁失败分类和继续规则明确 | pass | §7.4 |
| 恢复流程要求重新闭环和重跑门禁 | pass | §7.5 |
| 与 Step 06 boundary、Step 07 gate、Step 08 dependency 一致 | pass | §7.7 |
| 新 upstream blocker | none | 未发现新的上游冲突 |
| gate_status | `pass_with_affected_and_reality_preconditions` | 设计规则完成，执行现实未建立 |
| next_allowed_action | `continue_to_step_11` | 进入提交/评审/交付纪律重建 |

## 11. 参考

- `standards/document/实施计划讨论流程_SOP.md` Step 10
- `standards/document/实施计划书写规范.md` §5.10
- `standards/document/代码实施台账与门禁规范.md`
- `standards/document/设计真相源闭环与可落码性标准.md` §九
- `projects/L4-observability/design-calibration/07_implementation_plan_step_06_tasks_commit_boundaries.md`
- `projects/L4-observability/design-calibration/07_implementation_plan_step_07_test_acceptance_gates.md`
- `projects/L4-observability/design-calibration/07_implementation_plan_step_08_config_environment_dependencies.md`
- `projects/L4-observability/design-calibration/07_implementation_plan_step_09_spikes_risks_open_questions.md`
