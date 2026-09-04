# Step 3. 收稳前置条件与阅读清单

> 对应 SOP：`standards/document/实施计划讨论流程_SOP.md` Step 3
> 本步状态：`completed / pass_with_upstream_blockers`
> 回填目标：正式 `07-实施计划.md` §3

## Step 状态

| 项 | 结论 |
|---|---|
| gate_status | completed / pass_with_upstream_blockers |
| current_module | prerequisites_reading |
| next_allowed_action | Step 4 objects/deliverables |
| implementation_allowed | false；目标仓 absent |

## 本步输入

正式 `00~06`、本项目 00~06 calibration、实施计划 SOP / 规范、代码实施台账规范、设计真相源闭环标准、Rust 编码规范、子项目目录与代码文件组织规范、全局依赖裁剪规则，以及只读上游 / 兄弟文档与台账。

## SOP 问题回答

实施者必须先读正式文档，再按阶段矩阵补读对应 calibration；若冲突以正式文档为准，仍不清楚就暂停。目标实现仓必须是 `/home/aris/Projects/quantalithos-member-service`，Rust workspace 命名沿用 03；当前目录不存在，不能在设计仓替代创建源码。项目级 git identity 必须在实现仓本地检查，设计仓本轮不提交。脚本根固定为 `scripts/gates`、`scripts/reports`、`scripts/checks`、可选 `scripts/dev`；artifact/report 只使用 `artifacts/test/<run_id>` 与 `reports/runs/<run_id>`，禁止 `latest`。

## 当前文档问题诊断

若只列“阅读正式文档”，实现者会漏读 phase-specific calibration、台账和编码规范；若把整个 calibration 目录全列为每个阶段必读，又会失去按 boundary 的可恢复性。因此必须建立阶段阅读矩阵与可机械投影的永久记忆种子。

## 改动前后对比

| 方面 | 改动前 | 改动后 |
|---|---|---|
| 阅读 | 无 07 入口 | 正式文档 + 阶段 calibration 矩阵 |
| 台账 | 未创建 | 项目级与 24 个 boundary 入口固定 |
| 记忆 | 不能自由总结 | 只允许种子表内容，带来源/刷新/失效 |
| 仓库 | 未知 | 明确目标仓 absent，PH-01 blocker |

## 设计取舍

- 阶段矩阵按功能增量裁剪，不要求每阶段重读全部文件。
- 永久记忆只保存执行规则，不复制 03 的字段、状态、DTO 或业务规则。
- 运行期 sibling 依赖通过 adapter/event/ref/fake，只有已确认 Core compile seam 才可候选 path dependency；本项目仍等 exact baseline。

## 结构化中间产物

### 全局阅读清单

| 文档 | 路径 | 目的 | 未读风险 | 确认方式 |
|---|---|---|---|---|
| 正式 `00~02` | `projects/L2-member-service/00-需求文档.md`、`01-架构设计.md`、`02-概要设计.md` | 需求、架构、概要边界 | scope / owner 越界 | 入口前逐章读取 |
| 正式 `03` | `projects/L2-member-service/03-详细设计.md` | 直接实现契约 | 自行补 schema | boundary Design Gate |
| 正式 `04` | `projects/L2-member-service/04-配置设计.md` | config/profile/binding | default/secret 漂移 | config gate |
| 正式 `05` | `projects/L2-member-service/05-测试方案.md` | suite/TC/evidence | 交付无证据 | Test/Evidence Gate |
| 正式 `06` | `projects/L2-member-service/06-验收标准.md` | AC/VF/放行 | 伪造完成 | Handoff Gate |
| 07 SOP / 规范 / 台账规范 | `standards/document/实施计划讨论流程_SOP.md`、`实施计划书写规范.md`、`代码实施台账与门禁规范.md` | phase、commit、ledger | 边界不可审计 | Step 3 check |
| Rust / 目录 / 全局依赖规范 | `standards/coding/rust.md`、`standards/document/子项目目录与代码文件组织规范.md`、`全局项目依赖关系与裁剪规则.md` | 源码与依赖命名 | 架构层级泄漏 | PH-01 check |

### 阶段实施前阅读矩阵（摘要）

| 阶段 | 正式重点 | calibration 重点 | 读取目的 | 开工门禁 |
|---|---|---|---|---|
| PH-01 | `03` §3~§4、`04` §3~§9、`05` §9/§13 | 07 Step 1/3/4/8 | 固定 workspace、配置入口、脚本根和依赖分类 | target repo、命名、脚本根可检查 |
| PH-02 | `03` §6~§12、`05` command/state、`06` §5/§8 | 03 Step 6/8/9/11/12/13 | 复核 control truth、UoW、状态和幂等来源 | intent/qualification/control 1:1 |
| PH-03 | `03` §6~§12、`06` registration/session | 03 Step 6/9/10/13 | 复核 generation、registration、session 双锚和 mapper | generation/action/session mapper 闭合 |
| PH-04 | `03` §9/§11~§14、`06` health/recovery | 03 Step 10/12/15 | 复核 signal freshness、unknown、recovery fence 与审计 | unknown/recovery/error/observability 边界闭合 |
| PH-05 | `03` §8~§12、`06` closure/reconcile | 03 Step 6/9/11/13 | 复核 cleanup、finding、case 的本地事实与外部残留分层 | cleanup/finding/case 不修复外部 truth |
| PH-06 | `03` §7/§8/§10/§14、`05` material/query | 03 Step 7/8/9/11/15 | 复核 immutable material、双 cursor、projection rebuild 与 no-write | cursor / material / no-write 闭合 |
| PH-07 | `03` §7~§12、`05` consumer/job | 03 Step 8/9/12/13 | 复核 envelope、dedup、effect key 和四层 handoff | receipt / key / job selector 闭合 |
| PH-08 | `05` §9/§13/§14、`06` §10~§14 | 07 Step 7/11/12/13 | 复核固定 run、raw/report/index、VETO 输入和人工审查 | fixed run、report pairing、VETO 输入可追溯 |

### 实施台账入口

| 台账 | 路径 | 创建时机 | 读取时机 | 缺失处理 |
|---|---|---|---|---|
| 项目级 | `design-calibration/implementation_execution_ledger.md` | Step 13 装配前 | 每次恢复 / boundary 切换 | 不得实现 |
| boundary 级 | `design-calibration/implementation-boundaries/<boundary_id>.md` | Step 13 全量预创建 | 修改 / gate / commit / handoff 前 | 不得进入 boundary |
| implementation scratch | `<implementation_repo>/.codex/implementation_ledger.md` | future implementation | 本地恢复 | 按目标仓规则决定 |

### 永久记忆种子表

| ID | 适用范围 | 规则（可机械投影） | 规范路径来源 | 来源文档 / 章节 | 刷新触发 | 失效条件 | 冲突处理 | 禁止改写 |
|---|---|---|---|---|---|---|---|---|
| MEM-MS-001 | project / phase / commit-boundary | 目标实现仓固定为 `/home/aris/Projects/quantalithos-member-service`；不存在则 PH-01 暂停。 | `projects/L2-member-service/07-实施计划.md` §3.4 | 07 §3.4 / MSVC-IMPL-001 | 首次开工、路径变化 | 正式路径变更 | 正式文档优先并刷新 | 是 |
| MEM-MS-002 | project / phase / commit-boundary | 只按正式 00~07 和当前 boundary ledger 实施；不清楚就回写设计。 | `projects/L2-member-service/07-实施计划.md` §1、§3 | 07 §1/§3 | 每次恢复、baseline 变化 | 新 baseline 取代旧基线 | 正式文档优先并刷新 | 是 |
| MEM-MS-003 | phase / commit-boundary | Query 必须 no-write，Job 必须 no-truth-repair。 | `projects/L2-member-service/03-详细设计.md` §7.3/§7.5；`06-验收标准.md` §8 | 03 §7.3/§7.5、06 §8 | 每个 query/job boundary | 正式边界变更 | 正式文档优先并刷新 | 是 |
| MEM-MS-004 | phase / commit-boundary | `submitted/delivered/observed/accepted` 独立，缺 owner feedback 保持 unknown/gap/waiting。 | `projects/L2-member-service/03-详细设计.md` §7.6；`06-验收标准.md` §7 | 03 §7.6、06 §7 | 每次 handoff 变更 | handoff contract 重开 | 正式文档优先并刷新 | 是 |
| MEM-MS-005 | project / phase / commit-boundary | Runtime/member/images/sandbox/Core/Bus 未闭合时只用 typed ref、placeholder、disabled 或 fail-closed。 | `projects/L2-member-service/design-calibration/project_execution_ledger.md` | `project_execution_ledger.md` blocker 表 | 依赖状态变化 | blocker 关闭并有新 baseline | owning source 优先 | 是 |
| MEM-MS-006 | project / phase / commit-boundary | evidence 必须从固定 run 的 raw artifact/report 生成，禁止 latest、静态 passed 表或伪造 signoff。 | `projects/L2-member-service/05-测试方案.md` §13；`06-验收标准.md` §10 | 05 §13、06 §10 | PH-08 / 证据规则变化 | 证据规范变更 | 正式文档优先并刷新 | 是 |
| MEM-MS-007 | project / phase / commit-boundary | 实现移交前按 phase/boundary 审计正式 03/05/06/07。 | `standards/document/实施计划讨论流程_SOP.md` Step 6/12/13 | 07 SOP Step 6/12/13 | 每次设计修复、移交前、baseline 变化 | 实施规范变更 | 标准 / 正式文档优先并刷新 | 是 |
| MEM-MS-008 | project / phase / commit-boundary | 设计修复后先判断是否应回写同项目，再检查是否需要沉淀可复用经验并补标准/SOP/记忆与示例。 | `standards/document/实施计划书写规范.md`、`standards/document/实施计划讨论流程_SOP.md` | 07 SOP、实施计划书写规范 | 设计修复完成 | 规则被正式替换 | 正式规范优先并刷新 | 是 |

### 前置检查表

| 检查 | 当前结论 | 失败处理 |
|---|---|---|
| Rust toolchain / workspace naming | planned，待目标仓 | 暂停 PH-01 |
| git `user.name/email` | future implementation check | 不在设计仓代设 |
| Core compile target | pending `MSVC-UP-007/008` | fake/blocked |
| gate/report/check script roots | planned deliverable | 不能把输出目录当脚本目录 |
| artifact/report paths | fixed template, no actual run | 不生成实例 |

## 回填草稿

正式 §3 应包含全局必读、阶段实施前阅读矩阵、永久记忆种子、台账入口、工程命名、依赖分类、脚本和证据路径；明确所有检查是未来实施门禁，当前没有目标仓或真实结果。

## 待确认事项

- Core / SDK 的准确 compile target。
- 实现仓 Cargo package / crate / binary 的最终命名核对。
- 是否允许在 implementation repo 使用 `.codex/implementation_ledger.md`。

## 进入下一步条件

阅读、台账、记忆和工程前置口径已闭合，允许进入 Step 4 抽取实施对象与交付物。
