# L2-member-service 05 测试方案校准流程

> 对应 SOP：`standards/document/测试方案讨论流程_SOP.md`
> 中间产物规范：`standards/document/设计文档讨论中间产物规范.md`
> 书写规范：`standards/document/测试方案书写规范.md`
> 目标正式文档：`projects/L2-member-service/05-测试方案.md`
> 执行模式：full-restart；旧 `05` / `06` 与 README 仅作 historical_material 和污染审计输入
> 本项目纪律：单 agent、严格按 `Step 1 -> ... -> Step 15` 串行；正式 `05` 完成后停审

## 1. 本轮目标

将已停审的 `00-需求文档.md`、`01-架构设计.md`、`02-概要设计.md`、`03-详细设计.md` 与 `04-配置设计.md` 转译为可执行、可追溯、可留证的测试方案。测试方案只定义验证方法，不替代需求、设计、验收裁决或实施排期。

本轮必须保持以下事实：

- 本仓测试对象分母为 7 个实现模块、29 个业务对象、10 个 Command、6 个 Query、5 个 Inbound Consumer、1 个 `HostFactMaterialEventCandidate` 和 7 个 Operations Job。
- 未闭合的 `MSVC-UP-001~008` 只能进入 pending / blocked / waiting / placeholder / unknown / fail-closed 测试语义；不得伪造真实联调、ready 或 accepted。
- 外部 owner truth、运行期协作、事件协作、ref、adapter、fake seam 必须分层；不把运行期依赖写成源码依赖。
- 不创建实现仓，不执行测试，不生成真实 run_id、artifact、report、evidence、verdict、signoff 或 readiness。

## 2. 权威输入

| 输入 | 权威级别 | 用途 | 当前处置 |
|---|---|---|---|
| `00-需求文档.md` | 正式上游 | C-MS-1~5、FR-MS、BR-MS、NFR-MS、AC-MS、VF-MS、数据归属和依赖边界 | 直接承接 |
| `01-架构设计.md` | 正式上游 | Host Truth Center、分层、依赖裁剪、通信和一致性边界 | 直接承接 |
| `02-概要设计.md` | 正式上游 | CMP-MS-01~07、对象轮廓、接口、流程、状态和异常骨架 | 直接承接 |
| `03-详细设计.md` | 直接输入 | 7 模块、29 对象、协议、flow、状态、UoW、错误、幂等、配置、观测和最小测试切口 | 直接承接 |
| `design-calibration/03_ddd_step_16_test_cut.md` | 直接输入 | 模块 / 协议 / 状态 / 一致性 / 配置 / 观测最小切口 | 直接承接 |
| `04-配置设计.md` | 直接输入 | profile、严格 JSON、来源优先级、敏感、builder、失效、回滚和测试承接 | 直接承接 |
| `projects/L1-governance/05-测试方案.md` | 粒度 / 格式参考 | 参考章节密度、矩阵、证据 schema 与审计写法 | 只作格式参考 |
| 旧 `05-测试方案.md` / `06-验收标准.md` | historical_material | 污染审计、旧风险提示 | 不覆盖新版结论 |
| `L2-member` / `L2-runtime` / `L2-member-images` 等 | 只读协作输入 | 识别 owner 方向和 pending 合同 | 不替对方定义 truth |

## 3. Step 总览

| Step | 主题 | 中间产物 | 状态 | 回填章节 |
|---|---|---|---|---|
| 1 | 确认测试输入边界 | `05_test_plan_step_01_input_boundary.md` | [x] completed / pass_with_upstream_blockers | §1 |
| 2 | 明确测试目标、范围和非范围 | `05_test_plan_step_02_scope.md` | [x] completed / pass_with_upstream_blockers | §2 |
| 3 | 抽取测试对象与测试切口 | `05_test_plan_step_03_test_objects_cuts.md` | [x] completed / pass_with_upstream_blockers | §3 |
| 4 | 制定测试策略与分层 | `05_test_plan_step_04_strategy_layers.md` | [x] completed / pass_with_upstream_blockers | §4 |
| 5 | 建立需求追溯与覆盖矩阵 | `05_test_plan_step_05_traceability_coverage.md` | [x] completed / pass_with_upstream_blockers | §5 |
| 6 | 设计测试场景与用例矩阵 | `05_test_plan_step_06_cases.md` | [x] completed / pass_with_upstream_blockers | §6 |
| 7 | 设计测试数据 | `05_test_plan_step_07_test_data.md` | [x] completed / pass_with_upstream_blockers | §7 |
| 8 | 设计测试环境与配置矩阵 | `05_test_plan_step_08_environment_config.md` | [x] completed / pass_with_upstream_blockers | §8 |
| 9 | 设计自动化与 CI/CD 门禁 | `05_test_plan_step_09_automation_gates.md` | [x] completed / pass_with_upstream_blockers | §9 |
| 10 | 设计专项测试与非功能验证 | `05_test_plan_step_10_nonfunctional.md` | [x] completed / pass_with_upstream_blockers | §10 |
| 11 | 定义缺陷管理与复验规则 | `05_test_plan_step_11_defects_retest.md` | [x] completed / pass_with_upstream_blockers | §11 |
| 12 | 定义进入准则与退出准则 | `05_test_plan_step_12_entry_exit.md` | [x] completed / pass_with_upstream_blockers | §12 |
| 13 | 定义测试报告与证据归档 | `05_test_plan_step_13_evidence.md` | [x] completed / pass_with_upstream_blockers | §13 |
| 14 | 定义回归策略与残余风险 | `05_test_plan_step_14_regression_risks.md` | [x] completed / pass_with_upstream_blockers | §14 |
| 15 | 整理正式测试方案文档 | `05_test_plan_step_15_formal_document_assembly.md` | [x] completed / pass_with_upstream_blockers | 全文 |

## 4. 统一执行约束

- 先读取项目台账，再读取本 flow 和当前 Step 文件；每个 Step 独立形成输入、问题回答、诊断、取舍、结构化产物、回填草稿、待确认事项和进入条件。
- P0 测试切口必须回指 `03` / `04` 的正式对象、字段、状态、协议、错误、配置或观测契约；发现缺口时回写设计，不在 `05` 自造 schema。
- 每个 P0 切口至少包含正向主线和关键负向 / 边界 / 并发 / 恢复断言；Query 必须验证 no-write，Job 必须验证 no-truth-repair。
- 原始机器证据统一使用 `artifacts/test/<run_id>/`；人类可读报告统一使用 `reports/runs/<run_id>/`；验收交接使用 `reports/acceptance/`；不得引用 `latest`。
- `deterministic_fixture.*` 仅允许 `ci-test` 的 test-entry 和 `operations-replay` 的 replay run；`local-dev` 使用普通 fake / placeholder，`integration-like` 使用 controlled seam。
- 测试方案不填写执行结果；P1/P2 不能伪装成 P0 通过，pending 合同不升级为 ready。

## 5. 跨 Step 质量门禁

| 门禁 | 判定 |
|---|---|
| 来源闭环 | 每个正式章节均能指向具体 Step 文件；每个 P0 用例均能指向 `00`/`03`/`04` 契约 |
| 对象与协议分母 | 7 模块、29 对象、10/6/5/1/7 入口分母不增不减 |
| 字段 / 状态闭环 | 断言只使用正式字段、状态、错误、disposition 和 phase；不使用旧口语名 |
| 边界闭环 | L1、Member、Images、Runtime、Sandbox、carrier、Bus、Observability truth 不迁移 |
| 证据诚实 | 只定义未来 artifact / report / evidence 结构，不生成运行结论或静态 pass |
| 跨项目 blocker | `MSVC-UP-001~008` 的正向联调明确标记 pending / blocked / waiting |

## 6. 当前停审点

```text
current_document = 05-测试方案.md
current_step = Step 15 formal_document_assembly
step_15_status = completed / pass_with_upstream_blockers
formal_05_write_allowed = completed
formal_05_stop_review = completed; waiting_for_user_review
implementation_allowed = false
test_execution_allowed = false
commit_allowed = false
next_allowed_action = wait_for_user_review_before_entering_06
```
