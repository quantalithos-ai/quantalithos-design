# L2-member-images 06 验收标准 Step 3：固定验收基线

> 创建日期：2026-09-03  
> 当前状态：`completed_stop_review`  
> 对应 SOP：`standards/document/验收标准讨论流程_SOP.md` Step 3  
> 回填位置：正式 `06-验收标准.md` 第 3 章“验收基线”  
> 执行模式：`full-restart`；本 Step 只固定可复查的基线槽位，不生成执行事实。

## 1. Step 状态与执行纪律

| 项目 | 记录 |
|---|---|
| 当前 Step | Step 3：固定验收基线 |
| 当前模块 | `design_delivery_environment_and_evidence_identity` |
| 本步输入 | Step 1 输入边界、Step 2 范围；正式 `00~05`；`04` §5~§11；`05` §7~§14；验收标准 SOP/书写规范。 |
| 本步输出 | 需求/设计/测试/交付/环境/数据基线表；artifact/report/acceptance 路径表；基线变更规则；不可接受引用表；正式 §3 回填草稿。 |
| gate_status | `pass_with_explicit_blockers`：槽位和路径已固定，真实 delivery ref、config digest、`run_id`、artifact/report 实例尚不存在。 |
| next_allowed_action | 已授权进入 Step 4 `entry_exit`；进入未来实际验收前必须补齐本 Step 的所有送验槽位。 |
| 禁止事项 | 不使用 `latest`、不填示例 commit/digest/run、不得把 planned TC/EV 或静态 JSON 当 actual evidence。 |

## 2. 本步目标

验收结论必须能够被第三方复查，因此每个 P0 门禁都要绑定同一轮不可变的需求、设计、测试方案、送验交付物、profile/config、fixture 和 `run_id`。本 Step 固定“将来必须填写什么、放在哪里、何时必须换 run”，但不把缺失值伪造成已就绪。

## 3. SOP 问题回答

| SOP 问题 | 收敛回答 | 依据 |
|---|---|---|
| 按哪一版需求和设计验收？ | 按本项目当前正式 `00-需求文档.md`、`01-架构设计.md`、`02-概要设计.md`、`03-详细设计.md`、`04-配置设计.md` 和 `05-测试方案.md` 的 source ref；正式送验时须记录文档版本或不可变 source identity。 | `06` SOP Step 3；Step 1 输入映射。 |
| 按哪一版测试方案与结果裁决？ | 按当前正式 `05-测试方案.md` 与一个固定 `<run_id>` 的 suite reports/evidence index；规划 TC/EV 只能作为预先合同。 | `05` §5、§13、§14。 |
| 送验 build、实现来源或 image ref 是什么？ | 当前没有实现仓、build 或 image ref。未来必须填写 implementation source ref、build identity、必要时 immutable image/build ref 与 config digest；缺任一项不能进入实际验收。 | `03` §16；`05` §12。 |
| 环境、配置、数据和依赖是什么？ | P0 允许 `local-dev`、`ci-test`、`integration-like`、`operations-replay` 四类设计 profile，使用 fake/controlled/disabled seam；每次 run 必须绑定 profile、config identity、fixture/replay root 和 dependency disposition。 | `04` §6~§11；`05` §7~§8。 |
| 基线变化如何处理？ | 影响 P0 的需求、设计、配置、实现、suite、报告 schema 或 EV 映射变化必须重开受影响 Step，按 `05` §14 重新执行受影响/全量 suite，并生成新 `<run_id>`；不复用旧 evidence。 | `05` §14；Step 2 范围。 |
| 固定的 run_id 是什么？ | 设计阶段没有真实值；未来必须使用唯一、不可复用且非 `latest` 的 `<run_id>`，贯穿 raw artifact、run report、evidence index 和 acceptance handoff。 | `05` §13；验收书写规范 §4.4。 |
| 原始证据放哪里？ | 只能放 `artifacts/test/<run_id>/...`，按 suite/case 组织并保留原始机器结果；不得使用 project 子目录或临时路径。 | `05` §13。 |
| 人类可读报告放哪里？ | 只能放 `reports/runs/<run_id>/...`，至少含 summary、evidence-index、gate-results、redaction-check 和 suite reports。 | `05` §13。 |
| 验收交接放哪里？ | 固定 `reports/acceptance/handoff.md`、`veto-checklist.md`、`risk-acceptance.md`，必要时加 `open-issues.md`；文件必须由真实报告和审查记录支撑。 | `05` §13；验收书写规范 §4.4/§5.10。 |
| 哪些引用不可作为正式基线？ | `latest`、泛化 test/staging、无 digest 的 report、静态手写 EV/VETO passed、`artifacts/test/<project>/<run_id>`、`reports/<project>/...`、未绑定 source ref 的摘要均拒绝。 | 验收书写规范 §4.4；本 Step §7。 |

## 4. 当前文档问题诊断

| 材料 | 问题 | 本 Step 处置 |
|---|---|---|
| 历史 `06-验收标准.md` | 使用“当前批次”“test/staging”“API/DB/trace”等不可复查基线，并有无来源阈值。 | 只作污染输入；Step 15 删除后重建。 |
| 正式 `05` | 已有 suite/TC/EV/path 规划，但没有实际 run、artifact 或 report。 | 固定为 future evidence contract；缺实例时不得裁决通过。 |
| 正式 `04` | profile 与 21 个 P0 key 有定义，但没有 config digest 或激活实例。 | 将 profile/config identity 列为送验前置。 |
| sibling/upstream | member、member-service、Artifact、event、gate policy 合同未闭合。 | 依赖 disposition 固定为 pending/blocked/unknown；不填 positive ref。 |

## 5. 改动前后对比

| 项 | 历史/未校准口径 | 本 Step 后口径 | 理由 |
|---|---|---|---|
| source 基线 | “当前 02/03/05” | 每个正式 `00~05` 的不可变 source ref/版本槽位 | 保证需求到测试链可复查。 |
| 交付基线 | 未定义或暗示已有发布 | implementation source、build/image identity、config digest 全部必填槽位 | 没有不可变交付物不能验收。 |
| 环境基线 | test/staging 泛称 | profile + config identity + fixture/replay + dependency disposition | 防止环境名代替事实。 |
| 证据基线 | API/DB/trace 泛引用 | `<run_id>` 下 artifact/report pair 与 acceptance 固定入口 | 防止静态造证据。 |
| 变更处理 | 可继续沿用旧报告 | 影响 P0 即新 run，受影响 Step/套件重开 | 旧证据不能支撑新基线。 |

## 6. 验收裁决取舍

| 议题 | 备选方案 | 结论 | 原因 |
|---|---|---|---|
| 设计阶段是否填真实 commit/run | A. 用示例值；B. 留 future 槽位 | 采用 B | 当前没有实现或执行事实。 |
| 是否允许 `latest` | A. 允许；B. 禁止 | 采用 B | 无法证明复查时点。 |
| P1 real-like 是否代替 P0 | A. 代替；B. 分开 | 采用 B | P1 产品/环境不应污染 P0。 |
| acceptance 文件是否可默认 passed | A. 可默认；B. 必须由真实 evidence 推导 | 采用 B | VETO/risk 需要可审计来源。 |
| 基线变化是否复用旧 run | A. 复用；B. 新 run | 采用 B | 变更可能改变测试 oracle 或证据语义。 |

## 7. 结构化中间产物

### 7.1 验收基线表

| 基线类型 | 基线内容 | 版本/标识（未来必填） | 当前状态与用途 |
|---|---|---|---|
| 需求 | `projects/L2-member-images/00-需求文档.md` | `<design_source_ref_00>` | 当前正式文本已存在；送验时绑定不可变 source。 |
| 架构 | `projects/L2-member-images/01-架构设计.md` | `<design_source_ref_01>` | 固定 owner、分层、依赖与红线。 |
| 概要 | `projects/L2-member-images/02-概要设计.md` | `<design_source_ref_02>` | 固定五 capability、对象/流程骨架。 |
| 详细设计 | `projects/L2-member-images/03-详细设计.md` | `<design_source_ref_03>` | 固定 28 logical surface、19 状态矩阵、UoW/错误/观测。 |
| 配置 | `projects/L2-member-images/04-配置设计.md` | `<design_source_ref_04>` + `<config_digest>` | 固定五域 21 key、profile、strict validation、startup-only。 |
| 测试方案 | `projects/L2-member-images/05-测试方案.md` | `<test_plan_source_ref>` | 固定 TC/EV/suite/data/path 规划。 |
| 标准 | 验收 SOP、书写规范、通用规范、真相源闭环标准、依赖裁剪规则 | `<standards_source_ref_set>` | 控制本轮 06 的格式与可落码性。 |
| 交付 | implementation source/build/image（按实际交付形态） | `<implementation_ref>`、`<build_ref>`、`<immutable_image_ref>` | 没有真实值不能进入实际验收。 |
| 依赖 | L0-core、method、runtime、tools、member、Artifact、event、consumer disposition | `<dependency_disposition_ref>` | 只记录 owner-approved ref/adapter/gap；未闭合不升级。 |
| 环境 | `local-dev` / `ci-test` / `integration-like` / `operations-replay` | `<profile>` + `<config_digest>` | P0 允许的 profile；staging/production 不作默认前置。 |
| 数据 | `DS-BASE-VALID` 等 05 规划 fixture/replay set | `<fixture_set_ref>`、`<run_namespace>` | 必须脱敏、可重复、可清理。 |

### 7.2 证据入口基线表

| 证据入口 | 固定路径 | 必须绑定 | 用途 | 当前状态 |
|---|---|---|---|---|
| raw artifact | `artifacts/test/<run_id>/...` | `<run_id>`、suite、case、artifact identity | 机器原始结果与复核 | 未生成；送验前置。 |
| run summary | `reports/runs/<run_id>/summary.md` | 同一 `<run_id>`、source refs | 运行概览 | 未生成。 |
| evidence index | `reports/runs/<run_id>/evidence-index.md`；raw index 为 `artifacts/test/<run_id>/evidence-index.json` | 每个 EV→TC→artifact/report/AC/VETO | P0 证据闭环 | 未生成。 |
| gate results | `reports/runs/<run_id>/gate-results.md` | release/P0/VETO gate 结果 | 门禁裁决输入 | 未生成。 |
| redaction | `reports/runs/<run_id>/redaction-check.md` | 扫描版本与 artifact root | 证明无 raw secret/body/live state | 未生成。 |
| acceptance handoff | `reports/acceptance/handoff.md` | review version、run、source set | 送验范围与交接 | 未生成。 |
| VETO checklist | `reports/acceptance/veto-checklist.md` | 全部 `VETO-MI-001~007` | 不可否决项检查 | 未生成。 |
| risk acceptance | `reports/acceptance/risk-acceptance.md` | risk id、evidence、owner、acceptor、deadline | 有条件通过依据 | 未生成。 |
| open issues | `reports/acceptance/open-issues.md` | blocker/defect refs | 未闭合项追踪 | 未生成。 |
| reviewer notes | `reports/review/reviewer-notes.md`、`agent-review.md` | review version、争议与复查结论 | 人工/Agent 审查 | 未生成。 |

### 7.3 P0 profile 与依赖 disposition

| Profile | 允许的依赖方式 | 必须固定 | 不得推导 |
|---|---|---|---|
| `local-dev` | local/fake/disabled | profile、config identity、fixture | 不得作为 release evidence。 |
| `ci-test` | deterministic TestOnly fake、in-memory/controlled store | harness、config digest、fixture set | 不得产生真实 digest/gate/Artifact/consumer result。 |
| `integration-like` | controlled adapter/failure injection | adapter slot identity、profile、config | 不得替代 owner contract。 |
| `operations-replay` | bounded replay fixture、controlled recovery seam | replay root、namespace、config | 不得把 replay 当线上 run。 |
| `staging-like`/`production-like` | 仅 future/P1/P2 approved seam | 另行基线 | 不作为 P0 默认前置。 |

### 7.4 基线变更规则

| 变更 | 强制动作 | 是否可复用旧 run |
|---|---|---|
| `00~05` P0 内容/字段/状态/协议变化 | 重开受影响 06 Step，按 05 §14 回归 | 否，除非新审计证明不影响且仍生成新 review identity。 |
| implementation/build/image 变化 | 固定新交付 ref，重跑受影响 P0 suite | 默认否。 |
| profile/config digest/key/source 变化 | 重跑 config/security、affected suite 与 gate audit | 否。 |
| TC/EV/suite/report schema 变化 | 重建 index、重跑受影响 suite | 否。 |
| owner/sibling contract 关闭或变更 | 重开 Step 2、5~11、13/14 的受影响 seam | 否。 |
| 仅文档排版且不改变语义 | 记录 review note，静态审计 | 可不重跑，但不得更换 source identity。 |

### 7.5 不可接受的基线引用

| 引用/说法 | 处理 |
|---|---|
| `latest`、未锁定 tag 或 mutable selector | 拒绝；要求 immutable ref。 |
| `artifacts/test/<project>/<run_id>` 或 `reports/<project>/...` | 拒绝；迁移/重跑到固定根路径。 |
| 无 artifact/report pair 的 EV | 只能保留 planned，不可支撑 P0 结论。 |
| 静态 JSON/手写表直接宣告 EV/VETO passed | 证据完整性失败，不能验收。 |
| “test/staging 环境”无 profile/config digest | 基线不可定位，不能进入验收。 |
| P1 unavailable 计入 P0 passed | 改为 residual/blocked，不得通过。 |

## 8. 回填草稿（正式 §3）

> 校准来源：
> - `design-calibration/06_acceptance_step_03_baseline.md`
>
> 延伸阅读：
> - 建议继续阅读本中间产物的“验收基线表”“证据入口基线表”“P0 profile 与依赖 disposition”“基线变更规则”和“不可接受的基线引用”小节。

正式 §3 应规定：验收必须同时固定正式 `00~05` source refs、implementation/build/image ref、profile/config digest、fixture/replay identity、dependency disposition、唯一 `<run_id>` 以及 `artifacts/test/<run_id>/...`、`reports/runs/<run_id>/...`、`reports/acceptance/...`、`reports/review/...` 路径。任何 `latest`、泛化环境、project 子目录、无 artifact/report pair 或静态 passed 声明均不可作为正式基线。当前所有真实值均未生成，缺失时只能停在未进入/不可裁决状态。

## 9. 待确认事项与持续 blocker

| 事项 | 影响 | 当前处理 / 重开点 |
|---|---|---|
| 真实 implementation/build/image ref | 所有实际 P0 裁决 | 送验前由未来实施/发布 owner 固定；当前留槽位。 |
| profile、config digest、fixture/replay root | 配置与可重复性 | 未来执行前固定；缺失阻断 Step 4 进入条件。 |
| `run_id`、artifact/report/handoff 实例 | 全部 EV/VETO/risk 结论 | 当前不存在；Step 10~14 只定义读取规则。 |
| owner/sibling disposition | P1 positive lane | `MI-UP-*`/`Q-MI-*` 保持 pending；合同关闭后重开受影响 Step。 |
| 量化性能 baseline | Step 9 | 无来源阈值不进入 pass/fail。 |

## 10. 自检与进入下一步条件

| 自检项 | 结论 | 依据 |
|---|---|---|
| 需求、设计、配置、测试、交付、环境、数据基线槽位完整 | 通过 | §7.1。 |
| artifact/report/acceptance 固定路径符合规范 | 通过 | §7.2。 |
| `latest`、项目子目录和静态证据已拒绝 | 通过 | §7.5。 |
| 基线变化触发新 run/重开规则 | 通过 | §7.4。 |
| 当前未伪造真实值 | 通过 | 全文使用 future placeholder。 |
| 可进入 Step 4 | 通过 | Step 2 范围已完成，Step 3 槽位可用于进入/退出门禁。 |

```text
step_03 = completed_stop_review
step_content_gate_status = pass_with_explicit_blockers
document_gate_status = allowed_for_step_04
next_allowed_action = create_and_complete_step_04_entry_exit
actual_run_or_evidence_generated = false
```
