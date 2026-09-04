# Step 3. 固定验收基线 · L2-member-service

> 对应 SOP：`standards/document/验收标准讨论流程_SOP.md` Step 3
> 回填章节：`06-验收标准.md` §3 验收基线

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 3 固定验收基线 |
| 当前状态 | `[x] 已确认` |
| 输入基线 | Step 2；`00~05` 版本信息；`04` P0 profiles；`05` §13 证据 schema |
| 输出文件 | `design-calibration/06_acceptance_step_03_baseline.md` |
| 当前模块 | `source_baseline`、`execution_baseline`、`evidence_baseline` |
| 思考记录 | `done` |
| 写入记录 | `done` |
| 自检状态 | `done` |
| gate_status | `pass` |
| gate_reason | 需求 / 设计 / 测试 / 交付 / 环境 / 数据 / artifact / report 的定位规则已固定；当前不存在真实交付或运行证据，未误写为通过 |
| next_allowed_action | 进入 Step 4，定义验收进入条件与退出条件 |

### 1.1 Step 内计划

- [x] 读取 Step 2、`04` profile 和 `05` 证据 schema。
- [x] 逐项回答版本、环境、数据、run_id 和路径问题。
- [x] 诊断旧基线中的“最新 / staging / API response”泛化问题。
- [x] 选择固定 source-ref + run-scoped artifact/report 方案。
- [x] 产出基线表、P0 profile 矩阵、变更规则和禁止引用。
- [x] 形成 §3 回填草稿并自检。

## 2. 本步目标

把验收裁决绑定到可定位、可复查的需求 / 设计 / 测试 / 交付 / 环境 / 数据和证据基线。基线是未来送验时填写的字段集合；本轮设计阶段不填写 implementation commit、build、image digest、`run_id`、artifact、report 或 verdict。

## 3. 本步输入

| 输入 | 来源 | 状态 | 用途 |
|---|---|---|---|
| 需求 / 设计文档 | `00-需求文档.md`、`01-架构设计.md`、`02-概要设计.md`、`03-详细设计.md`、`04-配置设计.md` | 已确认 | source ref 与设计真相基线 |
| 测试方案与证据结构 | `05-测试方案.md` §5~§14 | 已确认 | suite、artifact、report、EV 和 run 基线 |
| P0 profile / config binding | `04` §6~§12 | 已确认 | 环境、配置和 fixture 资格 |
| 上游 blocker | `project_execution_ledger.md` | 已确认 | 解释哪些正向基线只能标 blocked / waiting |

## 4. SOP 问题回答

| 问题 | 回答 | 依据 |
|---|---|---|
| 按哪一版需求和设计验收？ | 按送验时固定的 `00~05` source ref / document version；验收项中的字段、状态、协议和配置 key 必须与该 source ref 一致。 | 06 SOP Step 3；书写规范 §5.3 |
| 按哪一版测试方案和结果裁决？ | 按固定 `05-测试方案.md` source ref 和同一 `run_id` 下的真实 suite reports / EV index；设计阶段只预留路径。 | `05` §13.1~§13.4 |
| 送验 build / commit / image 是什么？ | 由未来送验说明填写 implementation source ref、commit / build id、镜像 digest；当前没有实现仓和交付物，不能填占位的真实值。 | 06 SOP；`05` §13.3 |
| 环境、配置、数据和依赖是什么？ | P0 允许 `local-dev`、`ci-test`、`integration-like`、`operations-replay`；profile、config digest、fixture / replay ref、依赖 availability 和 blocker 状态必须随 run 固定。 | `04` §2、§6；`05` §8 |
| 基线变更如何处理？ | 任何影响 P0 source、协议、状态、UoW、幂等、配置、redaction、dependency 或 evidence 的变更都产生新 source ref 和新 run，不覆盖旧证据，并按 `05` §14 回归。 | `05` §14.1~§14.3 |
| 固定 `run_id` 是什么？ | 当前没有运行，故不填写具体值；正式验收必须使用固定且非 `latest` 的 `<run_id>`。 | 06 书写规范 §4.4；`05` §13 |
| 原始机器证据位于哪里？ | `artifacts/test/<run_id>/...`，包含 context、config/source refs、suite report、case artifact 和 digest。 | `05` §13.3~§13.3.1 |
| 人类可读报告位于哪里？ | `reports/runs/<run_id>/...`，包含 summary、gate-results、suite reports、evidence-index、redaction、dependency、report-audit。 | `05` §13.3、§13.6 |
| 验收交接文件位于哪里？ | `reports/acceptance/handoff.md`、`veto-checklist.md`、`risk-acceptance.md`、`open-issues.md`；这些是待审交接入口，不能替代 raw artifact。 | `05` §13.6~§13.7 |
| 是否存在不可接受的路径引用？ | 是：`latest`、`artifacts/test/<project>/<run_id>`、`reports/<project>`、临时目录、无 digest 的 artifact、手写 passed 表均不得作为正式基线。 | 06 SOP Step 3；书写规范 §4.4 |

## 5. 当前文档问题诊断

| 材料 / 位置 | 问题 | 处理 |
|---|---|---|
| 旧 `06` §2 | “当前版本批次”“test / staging 级环境”未给 source ref、config digest 或 run_id | 改为可定位的 source / environment / data 基线字段 |
| 旧 `06` §4~§7 | API response、DB record、host trace 作为泛化证据，不能复查 suite 或 artifact | 统一引用 `EV-MS-*`、固定 report path 和 raw artifact pairing |
| 旧 `06` §5 | 可用性 / 成功率阈值没有 workload、依赖 profile 和 authority | Step 9 只保留有来源的结构性门禁；不在本 Step添加数字 |
| `05` §13 | 证据结构完整但均为未来 planned contract | 明确基线字段不等于已生成证据或已通过 |

## 6. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 版本标识 | “当前批次” | source ref / version / digest 字段 | 可复查 |
| 环境 | test / staging 泛称 | 四个 P0 product-neutral profile + config digest | 防止环境语义漂移 |
| 证据路径 | API / DB / trace | run-scoped artifact/report/acceptance 固定入口 | 支持证据闭环 |
| 变更处理 | 可继续沿用旧结果 | 影响 P0 即新 source + 新 run + 回归 | 防止证据污染 |

## 7. 验收裁决取舍

| 议题 | 方案 | 结论 |
|---|---|---|
| 是否使用“最新版本” | A. 使用；B. 固定 source ref / run_id | 采用 B；`latest` 不可审计 |
| 是否把设计 source ref 当交付基线 | A. 视为已交付；B. 与 implementation source 分列 | 采用 B；设计完成不代表实现可验 |
| 是否将 P1 staging 作为 P0 基线 | A. 作为必须；B. 只作为 selected-run / residual | 采用 B；P0 保持 product-neutral |
| 是否让 acceptance handoff 替代 raw artifact | A. 允许；B. 只作交接入口 | 采用 B；交接文件不能制造证据 |

## 8. 结构化中间产物

### 8.1 验收基线表

| 基线类型 | 基线内容 | 版本 / 标识 | 当前状态 | 验收用途 |
|---|---|---|---|---|
| 需求基线 | `00-需求文档.md` | source ref 待送验时固定 | 设计已确认 | C/FR/BR/D/NFR/AC/VF |
| 架构基线 | `01-架构设计.md` | source ref 待固定 | 设计已确认 | owner、四语义层、依赖裁剪 |
| 概要基线 | `02-概要设计.md` | source ref 待固定 | 设计已确认 | CMP、对象、流程范围 |
| 详细设计基线 | `03-详细设计.md` | source ref 待固定 | 设计已确认 | 协议、状态、UoW、错误、幂等 |
| 配置基线 | `04-配置设计.md` | source ref / config schema 待固定 | 设计已确认 | profile、strict JSON、builder、redaction |
| 测试基线 | `05-测试方案.md` | source ref 待固定 | 设计已确认 | TC、suite、EV、回归和证据结构 |
| 标准基线 | 06 SOP / 书写规范 / 真相源标准 | standards ref 待固定 | 已读取 | 裁决格式和证据门禁 |
| 交付基线 | implementation commit / build / image digest | 待送验填写 | 不存在 | 判断实际交付物范围 |
| Core 基线 | `L0-core` / core-contracts ref | 待闭合 | pending | 唯一允许 compile seam |
| 环境基线 | P0 profile + config digest + dependency state | 待送验填写 | planned | 判断环境资格 |
| 数据基线 | `DS-MS-*` fixture / replay root | 待送验填写 | planned | 可复现、脱敏、可清理 |

### 8.2 证据入口基线表

| 证据入口 | 固定路径 | 必要内容 | 当前状态 |
|---|---|---|---|
| 原始 artifact | `artifacts/test/<run_id>/...` | context、source/config refs、suite report、case、digest | 未生成 |
| 运行报告 | `reports/runs/<run_id>/...` | summary、gate-results、suite reports、EV index、redaction、dependency、audit | 未生成 |
| 验收交接 | `reports/acceptance/handoff.md` | 送验范围、基线、P0/P1/P2、未覆盖 | 未生成 |
| VETO 检查 | `reports/acceptance/veto-checklist.md` | 每个 VF 的真实证据与裁决 | 未生成 |
| 风险接受 | `reports/acceptance/risk-acceptance.md` | residual、影响、接受人、截止 / trigger | 未生成 |

### 8.3 P0 环境 / 配置基线

| Profile | 允许用途 | 必须证明 | 正向限制 |
|---|---|---|---|
| `local-dev` | 本地开发 / 手工结构检查 | safe default、fake / placeholder、body-free | 不证明真实 sibling / backend |
| `ci-test` | contracts、domain、service、redaction、config gate | deterministic fixture、strict JSON、negative boundary | `deterministic_fixture.*` 仅本 profile |
| `integration-like` | controlled adapter seam | availability / failure mapping / opaque refs | exact sibling contract 未闭合则 blocked |
| `operations-replay` | outbox、projection、cleanup、handoff、replay | stable key、unknown / gap、no-truth-repair | 不代表 external delivery / acceptance |

### 8.4 基线变更处理规则

1. 影响需求、设计、配置、测试、证据脚本或 gate 语义的变更必须生成新 source ref。
2. 影响 P0 的实现、配置、fixture、依赖或测试变更必须生成新 `<run_id>`，新 artifact/report pair，不覆盖旧 run。
3. 仅文档排版变化若不影响字段、状态、门禁或路径，可保留同一设计 source，但必须记录变更审计。
4. 发现 source ref 与 artifact/report 中的 schema、profile、TC、AC、VF 不一致时，验收暂停，不得手工修正 evidence index。

### 8.5 不可接受基线引用

- `latest`、无固定 run 的“当前测试结果”或无 digest 的 artifact。
- `artifacts/test/<project>/<run_id>`、`reports/<project>`、临时目录或聊天截图。
- 只有 acceptance handoff、静态 JSON、手写 VETO checklist 或手写 passed 表，没有 suite raw artifact。
- 将 `placeholder`、`blocked`、`unavailable`、fake 或 adapter `Ok` 当作交付 ready。

## 9. 回填草稿

正式 §3 应列出需求、架构、概要、详细、配置、测试、标准、交付、Core、环境和数据基线，并明确当前设计阶段只固定字段和路径，不填写真实 implementation source、build、image、run、artifact、report 或结果。正式证据统一使用 `artifacts/test/<run_id>/...`、`reports/runs/<run_id>/...` 和 `reports/acceptance/...`；禁止 `latest`、项目嵌套路径和静态证据。

## 10. 待确认事项

| 事项 | 影响 | 当前处理 |
|---|---|---|
| implementation source / build / image digest | Step 4 进入条件 | 送验前必须固定，当前不伪造 |
| Core-contracts source ref | compile boundary | `MSVC-UP-007/008` 闭合前 pending |
| fixture / replay root 与 config digest | 可重复性和 redaction | 由未来真实运行生成 |
| run_id 与 report 版本 | 正式裁决 | 送验时固定且禁止 `latest` |

## 11. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| 基线类型完整 | 通过 | 见 §8.1 |
| artifact / report / acceptance 入口固定 | 通过 | 见 §8.2 |
| P0 profile 和正向限制清楚 | 通过 | 见 §8.3 |
| 基线变更和禁止引用明确 | 通过 | 见 §8.4~§8.5 |
| 可进入 Step 4 | 通过 | 定义进入 / 退出条件 |
