# Step 3. 收稳实施前置条件与阅读清单

> 对应 SOP：`standards/document/实施计划讨论流程_SOP.md` Step 3
> 回填章节：`07-实施计划.md` §3 实施前置条件与阅读清单
> 执行模式：`full-restart + single-agent-serial`

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 3 · 收稳前置条件与阅读清单 |
| 当前状态 | `done / pass / self_reviewed` |
| 输入基线 | Step 1 输入边界；Step 2 目标/范围；正式 `00`～`06`；实施计划规范与代码实施台账规范 |
| 技术形态 | planned TypeScript/ESM browser client；framework/router/bundler/package manager pending |
| 正式 07 写入 | `false`；Step 13 full-restart 前不得写入 |
| 实现移交 | `blocked / wait_design`；目标 Console 实现仓不存在，owner/SDK positive contract 未闭口 |
| 下一动作 | 进入 Step 4 · 抽取实施对象与交付物 |

## 2. 本步输入

| 输入 | 路径/范围 | 本步用途 | 状态 |
|---|---|---|---|
| Step 1 输入边界 | `07_implementation_plan_step_01_input_boundary.md` | 传递目标仓、baseline、owner contract 和 selected authority blocker | 已完成 |
| Step 2 范围结论 | `07_implementation_plan_step_02_scope.md` | 只为已收稳的 P0 safety/semantic/static/evidence path 设计前置门禁 | 已完成 |
| 正式设计 | `00-需求文档.md`～`04-配置设计.md` | 提供需求、架构、概要、详细和配置真相源 | `formal / stop_review` |
| 测试/验收 | `05-测试方案.md`、`06-验收标准.md` | 提供 future suites、artifact/report、EV/VETO 和进入/完成门禁 | `formal / stop_review` |
| 实施规范 | 实施计划 SOP/书写规范、代码实施台账规范 | 固定阅读矩阵、记忆种子和 boundary 台账入口 | 已读取 |
| 语言/目录规范 | `standards/coding/typescript.md`、`子项目目录与代码文件组织规范.md` | 固定 planned TypeScript 目录、命名和脚本/报告根 | 已读取 |
| 官方 SDK 事实 | `/home/aris/Projects/quantalithos-sdk/packages/typescript` | 仅确认公开 package boundary；不把 skeleton `unknown` 当 owner schema | package 存在、surface 不完整 |

## 3. SOP 问题回答

### 3.1 实施者必须先读什么

实施者必须先读当前项目正式 `00`～`07`（`07` 在移交时才会存在）、对应 boundary 的 calibration、TypeScript 编码规范、子项目目录与代码文件组织规范、设计真相源闭环与可落码性标准、实施计划 SOP/书写规范、代码实施台账与门禁规范、全局项目依赖关系与裁剪规则，以及目标实现仓自身的 package/build/host 事实。正式文档优先；正式文档不清楚时再读对应 calibration；两者仍不闭合时必须暂停并回写设计，不得由实现者选边。

不要求实施者一次性读取整个 `design-calibration/` 目录。Step 3 提供按未来实施范围组织的阅读 band；Step 5/6 确认 phase 与 commit boundary 后，必须把 band 替换为具体 boundary 章节和文件。

### 3.2 当前语言、工具链和依赖事实

| 项 | 当前结论 | 证据/处理 |
|---|---|---|
| 语言/runtime | planned TypeScript + ESM browser client | `03` §3 与 `03_ddd_step_03_coding_runtime_constraints.md` |
| 类型纪律 | strict typing、named exports、readonly carrier、immutable update；业务对象不使用 `any`/裸 `unknown` | `03` §3、TypeScript coding standard |
| 官方 SDK | `/home/aris/Projects/quantalithos-sdk/packages/typescript` 存在，`@quantalithos/sdk` 为 private ESM package，公开 `SdkClient/ServiceClient/EventClient` skeleton 的 service/event 参数仍为 `unknown` | 只能证明 package boundary；不能证明 exact owner methods/schema |
| framework/router/bundler | `pending` | `01` 没有 authority；旧 README/draft 不得回流 |
| package manager/lockfile | `pending` | 目标 Console 仓不存在；Step 4/目标仓 authority 再确认 |
| browser/AT matrix | `pending / selected-later` | `CON-Q-046`；当前只承诺 semantic equivalence |
| state medium/TTL | `pending`；当前上限 session-volatile | `CON-Q-044`、03 §10/§13、04 |
| diagnostic sink/envelope | `pending`；可保持 disabled/body-free facade | `CON-Q-046`、03 §14、04 |
| Rust/Cargo | `not_applicable` | Console 是客户端 TypeScript；不得迁入 Rust crate、Cargo 或服务端分层 |

### 3.3 目标仓与工作区检查

只检查不写入：`/home/aris/Projects/quantalithos-console` 当前不存在。因而以下事实均不能在计划中伪造：package.json、tsconfig、package manager lock、framework、build command、git HEAD、worktree cleanliness、project-local git user config、scripts 文件或测试 runner。

未来实现仓必须遵守：

- 仓名采用 `/home/aris/Projects/quantalithos-console`，代码目录不带 `L5` 层级前缀。
- 按 `src/<responsibility>/<file>.ts` 组织，职责模块来自正式 `03` 的十模块；不得创建 `common/`、`utils/`、`helper/` 大桶。
- 不得在代码命名中出现 `L0`/`L1`/`L5` 或 `l0_`/`l1_` 等架构层级泄漏。
- package manager、framework、router、bundler 和 host contract 必须由目标仓/正式 authority 确认后写入 boundary；不能从历史材料推断。
- 项目级 git 配置只在目标实现仓内检查/设置：`user.name=quantalithos-labs`、`user.email=quantalithos.ai@gmail.com`；当前不执行，因为目标仓不存在，也不修改设计仓 git 配置。

### 3.4 sibling 与外部依赖裁剪

| 依赖 | 类型 | 允许协作方式 | 当前状态/失败处理 |
|---|---|---|---|
| `@quantalithos/sdk` | 官方客户端访问边界 | package/public formal surface；adapter 只消费已批准类型 | package 存在；exact owner surface pending；缺口则 blocked/no-call |
| `L1-identity`、`L1-work`、`L1-process`、`L1-governance`、`L1-artifact`、`L1-workspace`、`L2-member-service`、`L3-method-library`、`L3-capability-hub`、`L4-observability`、`L4-sandbox`、`L4-archive` | 运行期 owner | 通过 SDK/正式服务 query、command、safe ref 或 approved hint | 不得作为本地源码/package path dependency；合同未闭口则 pending/read-only/partial/blocked |
| `L0-bus` | 可选事件协作 | 仅经正式 SDK invalidation hint seam | 当前 disabled/pending-contract；禁止直连 broker、cursor、replay 或 projection |
| browser host/AT | 宿主运行期 | framework-neutral host/route/focus/announcement ports | host contract/matrix pending；不可用时 restricted/minimal/semantic fallback |
| DB、private repository、BFF、private bus、owner source | 禁止依赖 | 无 | 出现即 VETO/设计 blocker，不得以测试替身掩盖 |

### 3.5 Artifact、report、script 前置

下列都是未来实现交付面，当前均为 `planned / not_created`：

| 交付面 | 规范路径 | 必须具备的前置 | 禁止 |
|---|---|---|---|
| gate/check runner | `scripts/gates/`、`scripts/checks/` | 支持显式 `--run-id`、artifact/report roots、config profile（按 05 contract） | 隐式 current run、skip-pass、将脚本放入 reports 输出目录 |
| report/evidence generator | `scripts/reports/` | 只能从真实 raw artifact 生成 run report、candidate index、acceptance draft | 手写 EV/VETO pass、无 raw source 造证据 |
| raw artifacts | `artifacts/test/<run_id>/` | immutable run id、suite/case/meta manifest | `artifacts/test/<project>/<run_id>`、`latest`、跨 run 拼接 |
| human reports | `reports/runs/<run_id>/`、`reports/acceptance/` | 同 run pairing、digest、redaction、review refs | 把 report 当 verdict/signoff/readiness |

## 4. 阶段实施前阅读矩阵（预备 band）

以下 `RB-*` 是 Step 3 的阅读分组，不是实施 phase、commit boundary 或授权。Step 5/6 必须把它们替换/细化为正式 phase/boundary；在此之前不得开工。

| 阅读 band | 必读正式章节 | 必读 calibration | 读取目的 | 开工门禁 |
|---|---|---|---|---|
| `RB-01 bootstrap/config` | `03` §3～§5、§13；`04` §3～§12；`05` §8～§9；`06` §3、§6、§10 | `03_ddd_step_03_coding_runtime_constraints.md`、`03_ddd_step_04_units_file_layout.md`、`03_ddd_step_14_config_dependencies.md`、`04_config_step_06_environment_profiles_matrix.md`、`05_test_plan_step_09_automation_gates.md` | 确认 TypeScript package、十模块落点、四配置/三 profile、script/root 和 fail-closed | 目标仓/package/build 事实已核实；config/binding 不发明 |
| `RB-02 access/navigation/views` | `03` §5～§9、§11；`05` §3～§7；`06` §5～§8 | `03_ddd_step_05_module_contracts_axis.md`、`03_ddd_step_06_object_contracts.md`、`03_ddd_step_07_trait_port_adapter_contracts.md`、`03_ddd_step_08_protocol_contracts.md`、`03_ddd_step_09_function_flows.md`、`03_ddd_step_10_state_matrix.md` | 确认 formal context、visibility、safe mapping、16 Query、zero-write 与状态上限 | 字段来源、safe-field、empty/blocked/unknown 和 Query no-write 可 1:1 复核 |
| `RB-03 intent/adapters/state` | `03` §5～§12；`05` §6～§8、§11；`06` §5、§7、§8、§12 | `03_ddd_step_06_object_contracts.md`、`03_ddd_step_07_trait_port_adapter_contracts.md`、`03_ddd_step_09_function_flows.md`、`03_ddd_step_11_persistence_transaction_consistency.md`、`03_ddd_step_12_error_recovery.md`、`03_ddd_step_13_concurrency_idempotency.md` | 确认 5 Command、submit 唯一 owner write、carrier whole-record、single-flight、unknown/no-replay | owner command/reconcile surface 未闭口时只能 blocked/no-call |
| `RB-04 topics/recovery/a11y` | `03` §5、§8～§12、§15；`05` §6、§10～§12；`06` §5、§8～§11 | `03_ddd_step_05_module_contracts_axis.md`、`03_ddd_step_09_function_flows.md`、`03_ddd_step_10_state_matrix.md`、`03_ddd_step_12_error_recovery.md`、`05_test_plan_step_06_cases.md`、`06_acceptance_step_08_state_tx_consistency.md` | 确认八主题 canonical partition、局部 failure、recovery ceiling、三通道 semantic equivalence | 不生成统一 readiness；具体 browser/AT 未选则保持 semantic-only |
| `RB-05 evidence/handoff` | `04` §9～§12；`05` §9～§14；`06` §10～§14 | `05_test_plan_step_09_automation_gates.md`、`05_test_plan_step_13_evidence.md`、`05_test_plan_step_14_regression_risks.md`、`06_acceptance_step_10_observability_evidence.md`、`06_acceptance_step_11_veto.md`、`06_acceptance_step_14_final_decision_signoff.md` | 确认 fixed-run artifact/report/evidence、VETO、缺陷/风险/签署边界 | run/baseline/review 未固定时不得宣称可送验 |

## 5. Agent 启动与永久记忆种子表

种子只保存执行规则、规范索引和刷新条件，不复制 DTO 字段、状态矩阵、owner 规则或业务正文。实现 agent 只能机械投影下表，不得自由扩写。

| 记忆 ID | 适用范围 | 必须写入的记忆文本 | 来源 | 刷新触发 | 失效/冲突处理 |
|---|---|---|---|---|---|
| `MEM-CON-001` | project | 实现仓为 `/home/aris/Projects/quantalithos-console`；不存在时先按当前 07 的 PH-01/前置门禁处理，不得在 design 仓写实现代码。 | `03` §4；07 Step 1/3 | 仓路径或 phase 变更 | 路径偏离即暂停，正式计划优先 |
| `MEM-CON-002` | project/boundary | 所有业务 query/command/result/ref 只能经官方 SDK 或正式服务边界；不得引用 owner 源码、数据库、private bus、BFF 或 sibling 私有 package。 | `01`、`03` §3 | dependency/boundary 变更 | 发现越界即 blocked/VETO 回流 |
| `MEM-CON-003` | boundary | 无法按正式文档 1:1 落码时，不能自行补字段、DTO、Port、状态、错误码、owner schema、reconciliation 或 phase boundary；必须暂停并回写设计。 | 可落码性标准；`03` §16～§17 | 每个 boundary 开工/设计变化 | 等设计 baseline 更新 |
| `MEM-CON-004` | query/intent/state | Query 必须 zero-write；只有正式 owner observation 可建立 positive state；ambiguous outcome 保持 unknown，未经正式依据不得 replay。 | `03` §3、§9～§12；`05`/`06` | protocol/state/adapter 变更 | 触发全量 P0 复核 |
| `MEM-CON-005` | test/evidence | raw artifact 使用 `artifacts/test/<run_id>`，report 使用 `reports/runs/<run_id>` 与 `reports/acceptance`；正式引用禁止 `latest`。 | `05` §9/§13；`06` §3/§10 | script/path/schema 变更 | 修正路径并使旧 evidence 失效 |
| `MEM-CON-006` | handoff | 实现移交前必须按 phase/commit boundary 审计正式 `03/05/06/07`；未闭口项先回写设计并固定新 baseline。 | 实施计划规范；可落码性标准 | handoff/baseline 变化 | 暂停移交 |
| `MEM-CON-007` | design maintenance | 修复设计后先判断改动归属与提交合并方式，再检查是否需要沉淀可复用经验；需要时同步补标准/SOP/项目记忆并加正反例。 | 中间产物规范；可落码性标准 | 每次设计修复后 | 正式文档优先，避免重复或跨项目沉淀 |
| `MEM-CON-008` | memory generation | 永久记忆只能逐条来自本种子表；不得把临时用户约束、planned path、schema 摘要或当前执行事实自由写入长期记忆。 | 实施计划 SOP/书写规范 | 规范路径或项目范围变化 | 删除自由总结并回到种子表 |

### 5.1 永久记忆生成门禁

| 检查项 | 通过标准 | 失败处理 |
|---|---|---|
| 种子表存在 | 正式 07 §3 引用本 Step 的 `MEM-CON-*` 表 | 不生成项目永久记忆 |
| 来源完整 | 每条有正式来源、刷新触发和冲突处理 | 删除该条或补齐来源 |
| 不复制设计 truth | 不出现 DTO 字段、owner schema、完整状态矩阵或业务正文 | 改为索引正式文档 |
| 技术栈诚实 | 只记 TypeScript/ESM 已确认事实；framework/package manager pending 不写成定论 | 回到目标仓 authority |
| 交付前审计 | `MEM-CON-006` 存在并覆盖 03/05/06/07 | 暂停移交 |
| 设计修复经验 | `MEM-CON-007` 存在并含正反例要求 | 补种子后再交付 |
| 临时规则隔离 | “不提交 commit”等本轮对话约束不写入实现永久记忆 | 删除临时条目 |

## 6. 实施台账入口与 Boundary Gate Matrix 规则

本步只定义路径和门禁，不创建实现台账或 boundary 文件；Step 6 确定正式 boundary 后预创建全部 planned skeleton，Step 13 装配正式 07 时同步核对项目级实施台账。

| 台账 | 路径 | 创建/更新时机 | 每次继续读取 | 缺失处理 |
|---|---|---|---|---|
| 设计讨论项目台账 | `design-calibration/project_execution_ledger.md` | 当前设计 Step 每次切换 | 是 | 停在当前 Step，先修复恢复点 |
| 实施项目台账 | `design-calibration/implementation_execution_ledger.md` | 正式 07 装配/实现移交准备时创建；只在 07 计划允许后维护 | 实现阶段每次继续、baseline 变化、handoff | 不得把实现状态塞进设计台账 |
| boundary 台账 | `design-calibration/implementation-boundaries/<boundary_id>.md` | Step 6 确认全部 boundary 后一次性预创建 | 修改代码、跑 gate、commit、handoff 前 | 缺任一 planned skeleton 不得移交 |
| 实现仓 scratch | `<implementation_repo>/.codex/implementation_ledger.md` | 目标仓策略允许时 | 本地恢复工作区 | 不替代设计仓台账 |

Boundary Gate Matrix 的每个 boundary 必须有以下门禁，初始均为 `planned/pending`，不得提前写 `pass`：

| Gate | 必须回答 | 失败后的唯一安全方向 |
|---|---|---|
| Design Gate | design baseline、正式 03/05/06/07 来源、字段/状态/Port/phase 是否闭合 | `blocked / wait_design` |
| Scope Gate | allowed/forbidden files、是否越过当前 boundary、是否吸收用户无关改动 | `blocked / fix_gate_failure` |
| Worktree Gate | 目标仓、分支、未跟踪/未提交状态是否可定位 | `blocked / fix_gate_failure` |
| Build Gate | 目标仓实际 package/build/typecheck 命令及结果 | `pending` 直到真实执行；不伪造 |
| Test Gate | 当前 boundary 的正式 TC/suite/gate 及失败处理 | `pending` 直到真实执行 |
| Evidence Gate | 同 run artifact/report、digest、redaction/pairing/no-static 资格 | `pending` 或 `blocked`；不得静态造证据 |
| Commit Gate | staged scope、message、whitespace、required checks | `pending`；用户未授权不得提交 |
| Handoff Gate | commit/ref、剩余 blocker、未跑检查、下一 boundary | `pending`；无真实 hash 不得填写 |

允许值沿用代码实施台账规范：`gate_status=pending/pass/blocked/not_applicable`；`next_allowed_action=read_docs/open_boundary/implement/run_gates/fix_gate_failure/commit/wait_design/handoff/start_next_boundary`。未来 boundary 固定为 `status=planned`、`next_allowed_action=wait_until_current`；只有一个 boundary 可被项目级台账标为 current。

## 7. 前置检查清单

| 检查面 | 通过条件 | 当前结果 | 处理 |
|---|---|---|---|
| 正式文档读取 | `00`～`06` 与相关 calibration 可追溯 | `pass for planning` | 按 RB band 继续细化 |
| 目标 Console 仓 | 目录、package、toolchain、git ref 可定位 | `blocked`；目录不存在 | 不创建；等待目标仓 authority |
| SDK boundary | 官方 package 存在且版本/exports 可记录 | package `0.1.0` 存在；exact owner surface pending | 只允许 typed seam/fail-closed |
| package/framework | manager、framework、router、bundler 固定 | `pending` | Step 4/目标仓确认 |
| git identity | 目标仓 project-local config 正确 | `not_checked`；仓不存在 | 目标仓建立后检查，不改 design 仓 |
| sibling dependency | 无 private source/DB/bus path dependency | `pass for planning` | runtime SDK/formal boundary only |
| scripts/roots | planned paths和显式 run id 规则存在 | `pass for planning`；文件未创建 | Step 4/6 交付面确认 |
| baseline/run/evidence | immutable refs 和实例存在 | `blocked/not_created` | Step 12/13 前不得移交 |

## 8. 改动前后对比

| 项 | 进入本步前 | 收口后 |
|---|---|---|
| 阅读方式 | 可能一次性扫全部 calibration 或依赖历史 README | 按 RB band 和未来 boundary 读取正式章节/校准来源 |
| 技术栈 | 容易把旧 Rust/框架候选当成定论 | TypeScript/ESM 已确认；framework/package manager pending |
| 依赖 | 可能把 owner 仓、bus 或数据库写成 package dependency | 仅 SDK/formal service runtime seam；禁止 private source/DB/bus |
| 实施台账 | 只知道需要台账，缺少入口和门禁 | 固定项目级、boundary 级、scratch 级路径与 Gate Matrix 规则 |
| 永久记忆 | 容易自由复制 schema/状态或临时约束 | 仅允许 `MEM-CON-001~008` 机械投影 |

## 9. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 复制 L1-governance 的 Rust/Cargo 前置模板 | 表面完整 | 与 Console TypeScript 形态冲突，会制造不存在的 workspace/path dependency | 不采用 |
| 把整个 calibration 目录列为所有 boundary 必读 | 不易漏文件 | 成本高、无法说明当前判断来自何处 | 不采用 |
| 先用阅读 band，再由 Step 5/6 细化到 phase/boundary | 适应当前 pending 技术栈，同时可审查 | 需要后续更新矩阵 | 采用 |
| 让实现 agent 自由生成永久记忆/台账 | 省设计工作 | 可能复制 truth、漏门禁或伪造事实 | 不采用 |

## 10. 回填草稿

正式 `07-实施计划.md` §3 应声明：实现者必须按 phase/commit boundary 阅读正式 `00`～`07` 与对应 calibration；正式文档优先，冲突时暂停回写设计。当前实现形态是 planned TypeScript/ESM browser client，官方 `@quantalithos/sdk` package 是唯一已核实的客户端访问边界，framework/router/bundler/package manager、exact owner/SDK surface、browser/AT、carrier medium 和 diagnostic sink 仍 pending。目标 Console 实现仓不存在，不能在 design 仓写代码或伪造 package/build/git 事实。artifact/report 未来路径固定为 `artifacts/test/<run_id>`、`reports/runs/<run_id>` 和 `reports/acceptance`，禁止 `latest`。永久记忆只能从 `MEM-CON-*` 种子表机械生成；实施台账和全部 planned boundary skeleton 必须在正式移交前按后续 Step 规则准备。

## 11. 待确认事项

| 事项 | 影响 | 当前状态 | 处理时点 |
|---|---|---|---|
| `/home/aris/Projects/quantalithos-console` 创建方式与 owner | 所有实现 boundary | `BLK-CON-07-001` | PH-01/实施移交前 |
| package manager、framework、router、bundler、host lifecycle contract | 具体 entry/build/UI wiring | `RES-CON-07-002` | Step 4/8；未确认保持 framework-neutral |
| exact SDK owner methods/schema/ref/qualification/reconcile | positive adapters、submit、active posture | `BLK-CON-07-002` | 对应 boundary 开工前 |
| design immutable baseline | commit/handoff gate | `BLK-CON-07-003` | Step 12/13 移交前 |
| browser/AT authority、carrier medium/TTL、diagnostic sink、quantitative authority | selected/P2 gates | `RES-CON-07-001` | Step 8/9 |

## 12. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| 阅读清单覆盖正式输入、规范和关键 calibration | `pass` | 采用按 band/boundary 的渐进读取 |
| TypeScript 与非适用 Rust/Cargo 边界明确 | `pass` | 不把 L1-governance 模板迁入 Console |
| 目标仓、SDK、sibling、script/root 检查已记录 | `pass with blockers` | 目标仓和 exact positive contract 保持 blocked |
| 永久记忆种子与生成门禁完整 | `pass` | `MEM-CON-001~008` 可机械投影 |
| 实施台账入口与 Boundary Gate Matrix 规则完整 | `pass` | Step 6 再预创建全部 boundary skeleton |
| 正式 07 仍未写入、无实现事实伪造 | `pass` | 允许进入 Step 4 |

## 13. Step 自审记录

- [x] 已读取 Step 1、Step 2、正式 `00`～`06`、07 SOP/书写规范/台账规范及 TypeScript/目录规范。
- [x] 已核对官方 SDK package 的只读事实，并明确 unknown skeleton 不等于 owner contract。
- [x] 已检查目标 Console 仓不存在；未创建目录、package、脚本、测试或实现文件。
- [x] 已输出阅读清单、预备阅读 band、永久记忆种子、台账入口、Gate Matrix 和前置检查。
- [x] 未把未来 band 当成正式 phase/boundary；未提前创建 boundary skeleton。
- [x] 已保留 `BLK-CON-07-001~003`、`RES-CON-07-001` 和 `RES-CON-07-002`，允许进入 Step 4。
