# L2-tools 07 实施计划 Step 3：收稳前置条件与阅读清单

## Step 状态

`accepted`

## 本步输入

| 输入 | 来源 | 用途 |
|---|---|---|
| Step 1 输入边界 | `07_implementation_plan_step_01_input_boundary.md` | 固定真相源和 blocker。 |
| Step 2 范围 | `07_implementation_plan_step_02_scope.md` | 按 phase/boundary 选择阅读材料。 |
| Rust/layout/ledger 标准 | `standards/coding/rust.md`、目录规范、代码台账规范 | 实现仓开工门禁。 |
| 05/06 artifact contract | `05` §9、§13；`06` §10~§14 | 脚本、报告和验收交接准备。 |

## SOP 问题回答

| 问题 | 回答 | 依据 |
|---|---|---|
| 开工前必须读什么？ | 当前 boundary 的正式 00~07 章节、对应 calibration Step、标准文档、Rust 编码和提交规范；不要求无差别扫描全部 calibration。 | SOP Step 3、03 §16.1。 |
| git 如何配置？ | 目标实现仓使用 repo-local `quantalithos-labs` / `quantalithos.ai@gmail.com`；当前不得声称已配置。 | 实施计划书写规范 §5.3、代码台账规范。 |
| 目标仓和成员命名？ | `/home/aris/Projects/quantalithos-tools`；`crates/<role>`；package `<project>-<role>`；crate `<project>_<role>`；不含 L2/L1 名称。 | 子项目目录规范、03 §4。 |
| sibling dependency 如何处理？ | 只有实际确认的 Core 编译候选可用 local path；Hub/Auth/Sandbox/Runtime/Bus/Obs/SDK 不写 Cargo path dependency。 | 全局依赖规则、01 §8、03 §16.3。 |
| scripts/artifacts/reports 如何准备？ | 实现仓 `scripts/gates|reports|checks|dev`；raw `artifacts/test/<run_id>`；human report `reports/runs/<run_id>`；不使用 `latest`。 | 05 §9/§13、目录规范。 |
| 永久记忆如何生成？ | 只从本步种子表机械投影，包含规则、来源、刷新和冲突处理；不复制 schema。 | SOP Step 3、实施计划规范 §5.3。 |

## 当前文档问题诊断

| 问题 | 影响 | 处理 |
|---|---|---|
| 实现仓尚不存在 | 无法预先验证 Cargo、git identity、toolchain | 记录为 PH-01 blocker；只列检查，不写 pass。 |
| Rust 规范路径需在实现期确认 | 过早硬编码技术栈细节 | 阅读清单引用 `standards/coding/rust.md`，实现期复核。 |
| calibration 文件很多 | 造成实施者阅读负担 | 建立 boundary-specific reading matrix。 |

## 改动前后对比

| 项 | 改动前 | 改动后 | 理由 |
|---|---|---|---|
| 阅读策略 | 全量阅读或只读正式文档 | 正式文档为入口、boundary 精确读取校准文件 | 降低漏读和过读风险。 |
| 台账责任 | 可能由实现 agent 临时创建 | 07 预创建项目级和全部 boundary skeleton | 避免反复回设计侧补台账。 |
| 记忆内容 | 自由总结 | 可机械投影的种子表 | 防止永久记忆复制设计 truth。 |

## 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 在设计仓先创建实现仓 | 可提前运行检查 | 超出只做设计文档范围，且可能改变用户环境 | 不采用。 |
| 只写“准备环境” | 简短 | 无法审查路径、脚本、依赖和 gate | 不采用。 |
| 明确检查项与失败动作，执行期再验证 | 事实边界清晰 | 需要实现者执行 preflight | 采用。 |

## 结构化中间产物

### 阅读清单

| 文档 | 路径 | 阅读目的 | 未读风险 | 确认方式 |
|---|---|---|---|---|
| 需求 | `projects/L2-tools/00-需求文档.md` | 范围/FR/BR/AC方向 | 越权扩边 | boundary read log |
| 架构 | `projects/L2-tools/01-架构设计.md` | owner/依赖/写权 | sibling 合并 | design gate |
| 概要 | `projects/L2-tools/02-概要设计.md` | 组成部分/协议总量 | 漏对象 | design gate |
| 详细 | `projects/L2-tools/03-详细设计.md` | exact implementation source | 实现自补字段 | type/callable audit |
| 配置 | `projects/L2-tools/04-配置设计.md` | keys/profiles/failure | fallback/secret leak | config gate |
| 测试 | `projects/L2-tools/05-测试方案.md` | TC/suite/artifact | 假测试结果 | test gate |
| 验收 | `projects/L2-tools/06-验收标准.md` | AC/VF/evidence/signoff | 伪裁决 | acceptance gate |
| 07 flow/step | `design-calibration/07_implementation_plan_*` | 当前 boundary 计划 | 漏读校准结论 | required-read table |
| 可落码标准 | `standards/document/设计真相源闭环与可落码性标准.md` §9 | field/DTO/Port/state/evidence audit | 代码补设计 | Design Gate |
| 台账规范 | `standards/document/代码实施台账与门禁规范.md` | state machine/gates | 无台账开工 | ledger preflight |
| 目录规范 | `standards/document/子项目目录与代码文件组织规范.md` | workspace/scripts/paths | 命名污染 | static check |
| Rust 编码 | `standards/coding/rust.md` | source/rustdoc/style | 语言违规 | review/fmt |
| 实施计划书写 | `standards/document/实施计划书写规范.md` | phase/commit/evidence | 计划不完整 | Step 13 audit |

### 阶段实施前阅读矩阵（摘要）

| 阶段 | 必读正式章节 | 必读 calibration | 开工门禁 |
|---|---|---|---|
| PH-01 | 03 §3~§4；04 §3~§12；05 §9/§13；06 §3/§10 | 03 Step 3~4；04 Step 6/9；05 Step 9/13 | workspace/path/script/root/ledger 预检。 |
| PH-02 | 03 §5~§13；05 §3/§6/§7；06 §5/§8 | 03 Step 5~13/R-6/R-7/R-8 | field/DTO/state/Port/UoW/Rustdoc 闭环。 |
| PH-03 | 03 §5.3.1、§7.3、§8/§9 | 03 contract annex；05 contract/state；06 AC-006~008 | identity/evolution exact source。 |
| PH-04 | 03 §5.3.2、§7.3、§8/§9、§12 | binding annex；05 BIND；06 AC-009~011 | Hub seam/assessment/CAS blocked mapping。 |
| PH-05 | 03 §5.3.3~§5.3.4、§7~§12 | invocation/precondition/handoff annex；05 PRE/TX | no-execution/Prepared/unknown。 |
| PH-06 | 03 §5.3.5、§7.6、§8/§10~§14 | outcome/safe-handoff annex；05 OUTCOME/HANDOFF/OBS | pair/material/redaction/one-call。 |
| PH-07 | 03 §5.3.6、§7.4、§8/§9/§15 | integrity/query/job annex；05 QUERY/CONC | no-write/watermark/derived source。 |
| PH-08 | 03 §7.5~§7.6、§8；05 entry suites；06 AC-018~022 | consumer/event flow annex；05 consumer/continuation | claim/receipt/re-entry/status separation。 |
| PH-09 | 03 §7.7、§8/§10~§13；05 JOB;06 AC-023/025/031 | job flow/state/replay annex | bounded scope/report/no-repair。 |
| PH-10 | 03 §13、§5.5~§5.8；04 §9~§13 | config external binding；05 config assembly | composition/strict activation/adapter parity。 |
| PH-11 | 05 §6/§9/§13/§14；06 §3/§10~§14 | 05 evidence；06 evidence/veto/signoff | 234 denominator/11 checks/30 slots/no static。 |

### 实施台账入口表

| 台账 | 路径 | 创建时机 | 缺失处理 |
|---|---|---|---|
| 项目级 | `projects/L2-tools/design-calibration/implementation_execution_ledger.md` | 07 完成时预创建，首个 boundary 前读取 | 不得修改实现代码。 |
| boundary 级 | `design-calibration/implementation-boundaries/<boundary_id>.md` | 07 完成时全部预创建 | 缺任一 planned skeleton 不得移交。 |
| 实现 scratch | `/home/aris/Projects/quantalithos-tools/.codex/implementation_ledger.md` | 实现仓建立后按项目需要 | 标 `not_applicable` 或创建，不能替代设计台账。 |

### Agent 永久记忆种子表

| 记忆 ID | 必须写入的记忆文本 | 来源 | 刷新触发 | 冲突处理 |
|---|---|---|---|---|
| MEM-L2T-001 | 开工前必须读取当前 boundary 的正式设计、校准来源、编码规范、目录规范和台账；不得凭旧 README 实现。 | 07 §3、SOP | 首次开工/规范变更 | 正式文档优先，暂停刷新。 |
| MEM-L2T-002 | 只有当前 boundary 可实现；未来 boundary 必须保持 `planned / wait_until_current`。 | 代码台账规范 | boundary 切换 | 修正台账，禁止越界。 |
| MEM-L2T-003 | 发现字段、DTO、状态、Port、配置、证据或 phase 缺口时设 `blocked / wait_design`，不得代码补口。 | 可落码标准 §9 | 设计冲突 | 回写 owner 文档并固定新 baseline。 |
| MEM-L2T-004 | Query 必须 zero-write/zero-refresh/zero-external-Port；Job 必须 bounded/no-repair。 | 03 §7.4/§7.7、05 | 每次相关 boundary | 以正式 source 复核。 |
| MEM-L2T-005 | Prepared/unknown side-effect fence 不得自动重试或升级为成功。 | 03 §8/§10~§13 | handoff/event boundary | 暂停并保留 marker。 |
| MEM-L2T-006 | 实现移交前必须按每个 phase/boundary 审计正式 03/05/06/07，并在设计修复后检查是否需要回写可复用经验。 | SOP/书写规范 | 设计修复/移交 | 设计者完成复核。 |
| MEM-L2T-007 | 真实 run/evidence/acceptance/signoff 只能来自同一 fixed run；不得使用 `latest`、cross-run 或 static pass。 | 05/06/台账规范 | gate/release | 标 invalid_artifact。 |

### 其他前置检查

| 检查项 | 要求 | 当前状态 |
|---|---|---|
| toolchain | Rust 版本与 workspace manifest 一致 | `pending`；目标仓不存在。 |
| Core path | `/home/aris/Projects/quantalithos-core` Cargo workspace 可读取 | 已发现，实施期需复核。 |
| git identity | repo-local name/email 正确 | `pending`。 |
| scripts | gates/reports/checks/dev 目录与命名正确 | `planned`。 |
| artifact/report | `artifacts/test/<run_id>` / `reports/runs/<run_id>` | `planned`；无实际目录。 |

## 回填草稿

正式 07 §3 应引用本清单、阶段阅读矩阵、台账入口和永久记忆种子；明确目标仓不存在、baseline 未冻结、外部 positive 未闭口时的暂停动作。

## 待确认事项

| 事项 | 影响 | 截止点 |
|---|---|---|
| Rust toolchain/MSRV 现场版本 | PH-01 build gate | 创建目标仓后。 |
| implementation repo git identity | commit gate | commit-01-a 前。 |
| scripts 是否使用 shell 或 xtask | PH-01/PH-11 | 首个脚本 batch 前；不改变 contract。 |

## 进入下一步条件

- [x] 阅读清单、阶段矩阵和台账入口完整。
- [x] 永久记忆种子可机械投影且不复制业务 schema。
- [x] 前置检查的当前/待执行状态明确。
