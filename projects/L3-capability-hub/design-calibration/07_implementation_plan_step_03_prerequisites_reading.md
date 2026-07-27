# L3-capability-hub 07 实施计划 Step 3：收稳前置条件与阅读清单

> 对应 SOP: `standards/document/实施计划讨论流程_SOP.md` Step 3
> 书写规范: `standards/document/实施计划书写规范.md` §3
> 中间产物规范: `standards/document/设计文档讨论中间产物规范.md`
> 代码实施台账规范: `standards/document/代码实施台账与门禁规范.md`
> 回填章节: `projects/L3-capability-hub/07-实施计划.md` §3
> 创建日期: 2026-07-26
> 当前模式: full-restart / continuous execution

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 3 收稳前置条件与阅读清单 |
| 当前状态 | completed_continuous_execution |
| 输入 | Step 1 输入边界；Step 2 P0/P1/P2 范围；formal `03/04/05/06` implementation handoff |
| 目标实现仓 | `/home/aris/Projects/quantalithos-capability-hub`；design time not found |
| 编译期 sibling candidate | `core-contracts` only; local source `/home/aris/Projects/quantalithos-core/crates/contracts` |
| unresolved upstream blocker | `0` |
| implementation prerequisite | `CH-PREREQ-TARGET-REPO-001` remains open until implementation preflight |
| 下一动作 | 进入 Step 4，抽取实施对象与交付物 |

## 2. SOP 问题回答

### 2.1 开工前必须阅读什么？

实施 agent 必须先读取项目级设计台账、当前 boundary 台账、active formal `00~07`（当前 07 仍未装配）、本 boundary 对应的 calibration 文件和标准。正式文档是 implementation authority，calibration 只解释来源和取舍；两者冲突时暂停并回写设计，不由 agent 选边。

| 文档组 | 必读路径 | 开工目的 | 未读处理 |
|---|---|---|---|
| 项目恢复 | `projects/L3-capability-hub/design-calibration/project_execution_ledger.md`; `07_implementation_plan_calibration_flow.md` | 确认当前 Step、设计 baseline、blocker 和下一动作 | `read_docs`，不得写实现 |
| 需求/架构/HLD | `00-需求文档.md`; `01-架构设计.md`; `02-概要设计.md` | 确认 scope、owner、依赖和结构边界 | 设计 gate blocked |
| direct coding contract | `03-详细设计.md` + 当前 boundary 指定的 `03_ddd_step_*` | 确认字段、类型、Port、flow、state、TX、binding、observation | 缺 exact source 时 `wait_design` |
| configuration | `04-配置设计.md` + 指定 `04_config_step_*` | 确认 source/profile/activation/failure 与 external slots | 不得猜 config key/default |
| testing/acceptance | `05-测试方案.md`; `06-验收标准.md` + 指定 `05/06` Step | 确认 TC/DS/EV、suite/gate、VETO、release/risk 规则 | 不得写 static pass 或缩小分母 |
| coding/layout | `standards/coding/rust.md`; `standards/document/子项目目录与代码文件组织规范.md` | 确认英文源码/rustdoc、workspace、package/crate/binary 命名 | scope/design gate blocked |
| execution discipline | `standards/document/代码实施台账与门禁规范.md`; `standards/document/设计真相源闭环与可落码性标准.md`; `standards/document/实施计划书写规范.md` | 确认 ledger、boundary、Commit/Handoff Gate 和经验复核 | 不得开始代码 |
| project commit policy | `projects/README.md` 相关提交章节和目标实现仓历史（如存在） | 确认实现仓英文 commit、scope、footer 和 git identity | 记录 prerequisite，不伪造历史 |

### 2.2 Rust、目录和命名是否已经收稳？

已收稳。目标实现仓采用 Rust workspace 多 crate 结构，project slug 为 `capability-hub`；设计目录中的 `L3` 只用于导航，不能进入 package/crate/module/file/type/function/binary 名称。未来所有 public declaration、struct field、enum variant/payload field、trait、method、callable 均必须有完整英文 `///`；enum struct-variant field 不写 field-level `pub`。

| 层级 | 固定口径 |
|---|---|
| implementation repo | `/home/aris/Projects/quantalithos-capability-hub` |
| workspace members | `crates/contracts`, `crates/domain`, `crates/application`, `crates/infra`, `crates/api`, `crates/worker`, `crates/jobs` |
| Cargo packages | `capability-hub-contracts`, `capability-hub-domain`, `capability-hub-application`, `capability-hub-infra`, `capability-hub-api`, `capability-hub-worker`, `capability-hub-jobs` |
| Rust libraries | `capability_hub_contracts`, `capability_hub_domain`, `capability_hub_application`, `capability_hub_infra`, `capability_hub_api`, `capability_hub_worker`, `capability_hub_jobs` |
| entry binaries | `capability-hub-api`, `capability-hub-worker`; Jobs action names remain exact design-owned callables |
| forbidden naming | `L0`, `L1`, `L2`, `L3`, `l0_`, `l1_`, `l2_`, `l3_`, `quantalithos_l3` in code identity |

### 2.3 编译期、运行期和事件依赖如何裁剪？

只有 `core-contracts` 具备 Cargo path dependency 候选资格，预计 root manifest 采用：

```toml
[workspace.dependencies]
core-contracts = { path = "../quantalithos-core/crates/contracts" }
```

`quantalithos-bus`、governance、method-library、SDK、runtime、tools、marketplace、observability、secret/KMS 和外部 MCP/A2A/API 不得作为 sibling Cargo dependency。它们只能通过 application Port、infra adapter、event/ref/safe-summary seam、controlled fake 或 selected external binding 协作。`core-contracts` 的 package/lib 名和实际 source revision 必须在 PH-01 preflight 重新核对；设计仓当前不声称其 compatibility 已通过。

### 2.4 目标仓、git 和环境前置怎么检查？

| 检查 | 设计期状态 | 实现前通过条件 | 失败处理 |
|---|---|---|---|
| target repo path | not found | exact path exists and is the intended repository | create/confirm before code; no substitute path |
| repository root | unknown | `git rev-parse --show-toplevel` equals target path | stop; do not use design repo |
| worktree | unknown | baseline status recorded; unrelated changes isolated | scope gate blocked |
| git identity | unknown | project-local `user.name=quantalithos-labs`, `user.email=quantalithos.ai@gmail.com` | fix target repo config before commit |
| Rust toolchain | unverified | `cargo`, `rustfmt`, `clippy`, `rustdoc` versions recorded | prerequisite blocked |
| core sibling | exists locally | package `core-contracts`, lib `core_contracts`, path and revision verified | PH-01 blocked |
| bus/other siblings | some exist | no Cargo edge; seam contract or fake selected | dependency violation blocks |
| scripts/roots | not created | scripts and run-scoped roots exist only in implementation repo and match `05` | PH-01 boundary required |

### 2.5 证据脚本和路径前置是否固定？

固定为 future implementation contracts，不是当前执行事实：

```text
artifacts/test/<run_id>/
reports/runs/<run_id>/
reports/acceptance/
reports/review/
```

gate/report/check scripts 必须接受显式 `--run-id`、`--artifact-root`、`--report-root` 和适用的 `--config-profile`；禁止 `latest`、`artifacts/test/<project>/<run_id>`、`reports/<project>`、跨 run 拼接和静态 passed JSON。脚本缺失是 implementation prerequisite，不能由设计文档声称已通过。

## 3. 必读文档与阶段阅读矩阵

### 3.1 Common mandatory reads

| 用途 | Formal source | Calibration source | 开工确认 |
|---|---|---|---|
| scope/owner | `00` §1~§16; `01` §1~§18 | `00_req_step_01..17`; `01_arch_step_01..16` | boundary 不扩责任 |
| HLD structure | `02` §1~§14 | `02_hld_step_01..14` | 不新增 HLD subject |
| exact coding | `03` §4~§16 | boundary 指定 DDD Step | 每个 touched item 有 source |
| config | `04` §1~§15 | boundary 指定 Config Step | key/profile/failure source closed |
| tests | `05` §1~§15 | boundary 指定 Test Step | exact TC/DS/EV selectors mapped |
| acceptance | `06` §1~§15 | boundary 指定 Acceptance Step | no VETO/responsibility leak |
| plan/ledger | `07` §1~§12; code ledger standard | `07` Step 1~12; implementation-ledger templates | current boundary and gates match |

### 3.2 Phase-level reading seed (to be refined in Step 6)

| Phase | Required formal reads | Required calibration reads | Purpose |
|---|---|---|---|
| PH-01 layout/tooling | `03` §3~§5; `04` §3~§9; `05` §9/§13; `06` §3 | `03_ddd_step_03`, `03_ddd_step_04`, `04_config_step_06`, `05_test_plan_step_09` | workspace, dependency, config/profile, scripts and roots |
| PH-02 contracts/domain | `03` §5~§12; `05` §3~§7; `06` §5~§8 | DDD Steps 6~13; Test Steps 3~7; Acceptance Steps 5~8 | exact declarations, flow/state/TX and redlines |
| PH-03~PH-05 core vertical slices | `03` §6~§13; `04` §7~§11; `05` flow/state/TX cuts; `06` functional/redline gates | DDD Steps 6~14; Config Steps 7~12 | identity/registry/descriptor/seam/relation/exposure truth |
| PH-06 derived/trace | `03` §7~§13; `05` query/derived/observation; `06` §6~§10 | DDD Steps 9~15; Test Steps 6~10 | query no-write, trace/impact, projection and redaction |
| PH-07 collaboration | `03` §8~§15; `04` §9~§12; `05` inbound/outbound; `06` §7/§8 | DDD Steps 8~15; Test Steps 6~10 | capture/ref/receipt, A/B/C, no reverse write |
| PH-08 jobs/release | `04` §9~§15; `05` §9~§14; `06` §10~§15 | Test Steps 9~14; Acceptance Steps 10~15 | report/evidence/VETO/release/handoff |

Step 6 must replace this seed with an exact boundary-by-boundary matrix. “Read all DDD” alone is insufficient for implementation handoff.

## 4. 实施台账与 Gate 前置

| 台账 | 固定路径 | 创建时机 | 缺失处理 |
|---|---|---|---|
| design project ledger | `projects/L3-capability-hub/design-calibration/project_execution_ledger.md` | 已存在；每次设计恢复读取 | 不能继续设计 |
| implementation project ledger | `projects/L3-capability-hub/design-calibration/implementation_execution_ledger.md` | T068；formal 07 完成后、实现移交前 | 不得移交实现 |
| boundary ledger | `projects/L3-capability-hub/design-calibration/implementation-boundaries/<boundary_id>.md` | T069；按 Step 6 全量预创建 | 缺 current 或 future skeleton 均阻塞 handoff |
| implementation scratch ledger | `<target_repo>/.codex/implementation_ledger.md` | 实现仓策略确定后 | 只能辅助恢复，不能替代 design ledger |

实现 agent 修改代码前必须有唯一 `current_boundary`，且 Design Gate、Scope Gate、Worktree Gate 为 `pass`；Commit Gate 和 Handoff Gate 必须在真实实现时填写证据。未来 planned skeleton 的状态只能是 `planned` / `wait_until_current`，不得预填 pass、commit hash、run 或 completion。

## 5. Agent 永久记忆种子

永久记忆只保存执行规则和规范索引，不复制 DTO 字段、状态矩阵、业务规则或 evidence schema。以下种子在真实实现移交前机械投影，当前不表示已写入实现仓记忆：

| ID | Scope | 必须写入的记忆文本 | 来源 | 刷新触发 | 冲突处理 |
|---|---|---|---|---|---|
| `MEM-CH-001` | project | 本项目实现仓固定为 `/home/aris/Projects/quantalithos-capability-hub`；不存在时先按正式 07 的 PH-01 前置确认，禁止在 design 仓写实现代码。 | `03` §16; `07` §3 | 首次开工/路径变化 | 正式 07 优先，暂停并刷新 |
| `MEM-CH-002` | project | 唯一允许的编译期 sibling dependency 是 `core-contracts = { path = "../quantalithos-core/crates/contracts" }`；其他 sibling 只能通过 runtime/event/adapter/fake seam。 | `03` §13.11; `07` §3 | Cargo/dependency 变化 | dependency gate blocked |
| `MEM-CH-003` | project | Rust 标识符、rustdoc、普通注释、错误说明和测试名使用英文；公共声明和嵌套字段/variant/method/callable 必须有完整英文 `///`。 | `standards/coding/rust.md`; `05` §3/§9 | toolchain or lint rule change | formal standard wins |
| `MEM-CH-004` | commit-boundary | 实现不得自行补字段、DTO、Port、state、mapper、config key、evidence schema、job report surface 或 phase boundary；无法 1:1 落码就暂停并回写设计。 | 可落码性标准; `03` §16 | every boundary start | `wait_design` |
| `MEM-CH-005` | project/phase | raw artifact 使用 `artifacts/test/<run_id>`，run report 使用 `reports/runs/<run_id>`，acceptance/review 使用固定目录；禁止 `latest` 和跨 run 拼接。 | `05` §9/§13; `06` §3/§10 | script/path change | evidence gate blocked |
| `MEM-CH-006` | project | 修改实现前必须读取 design project ledger、implementation project ledger 和 current boundary ledger；缺任一不得开工。 | code ledger standard | every resume/boundary change | `read_docs` |
| `MEM-CH-007` | project/phase | 交付实现前按 phase/commit boundary 审计正式 `03/05/06/07`；未通过先回写设计并固定新 baseline。 | `07` §3/§12 | handoff or baseline change | pause handoff |
| `MEM-CH-008` | project | 修复设计文档后必须检查项目归属、提交合并方式以及是否需要沉淀可复用经验；需要时补标准/SOP/记忆和正反例。 | `07` §3; 可落码性标准 §9 | every design repair | formal docs and current project win |

### 5.1 永久记忆生成门禁

| 检查项 | 通过标准 | 失败处理 |
|---|---|---|
| seed completeness | `MEM-CH-001..008` 有 scope/source/trigger/conflict | 不生成 |
| rule-only | 只投影“必须写入的记忆文本” | 删除自由总结 |
| no second truth | 不含 schema/state/business/evidence 正文 | 改为 source index |
| implementation handoff audit | 包含 `MEM-CH-007` | 暂停移交 |
| design-repair experience | 包含 `MEM-CH-008` | 补种子后再审 |
| temporary rule isolation | 不把本轮“禁止提交”等临时设计仓纪律写入实现记忆 | 删除临时项 |

## 6. 回填草稿

正式 `07` §3 应固定：开工前读取矩阵、目标仓与命名、唯一编译期依赖、项目级/ boundary 级 implementation ledger、Rustdoc 和英文源码门禁、显式 run-scoped artifact/report 根路径、git identity 检查以及 MEM-CH-001~008 机械记忆生成规则。当前 target repo 未建立、真实 baseline/run/evidence 不存在，均不得在正式文档中写成已完成事实。

## 7. 待确认事项

| 事项 | 当前状态 | 影响 |
|---|---|---|
| target repo 创建/归属 | 未确认 | 阻塞任何代码 boundary |
| core-contracts compatible baseline | 需 implementation preflight | 阻塞 contracts/dependency boundary |
| concrete external products | 未选择 | 只阻塞对应 selected boundary；触发 formal 04 controlled reopen |
| target repo project git identity | 未确认 | 阻塞真实 commit，不阻塞设计 |

## 8. 进入下一步条件

| 条件 | 结果 |
|---|---|
| common reading list and authority precedence | pass |
| target path/naming/dependency gates | pass-designed; target repo remains prerequisite |
| evidence paths and script contract | pass-designed; no scripts executed |
| implementation ledger and planned skeleton rules | pass |
| permanent memory seed/generation gate | pass |
| fabricated implementation/commit/run/evidence | `0` |
| next | `enter_07_step_04_objects_deliverables` |
