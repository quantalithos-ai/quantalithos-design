# Step 3. 固定验收基线

> 对应 SOP：`standards/document/验收标准讨论流程_SOP.md` Step 3
> 回填位置：正式 `06-验收标准.md` §3

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | 3 / baseline |
| Step 状态 | `completed / stop_review` |
| gate_status | `pass_with_upstream_blockers` |
| 当前基线姿态 | `design_baseline_defined / delivery_baseline_pending` |
| 下一步 | `Step 4 / entry_exit` |
| 正式 06 写入 | `blocked_until_step_15` |

## 2. 本步输入

| 输入 | 来源 | 状态 | 说明 |
|---|---|---|---|
| P0/P1/P2 范围 | Step 2 | `available` | 决定基线所需覆盖面 |
| 00～05 当前正式文档 | 项目目录 | `available` | 设计 source refs 待送验时固定 commit/digest |
| 4 P0 profile 与 42 leaf | 04、05 | `available` | profile/config digest 必须进入基线 |
| TC/Suite/EV 计划与 evidence root | 05 | `available` | 固定 run-scoped 证据结构 |
| implementation/build/image、fixture、run | 送验材料 | `not_provided` | 当前不得伪造或默认 latest |

## 3. SOP 问题回答

| 问题 | 回答 | 依据 |
|---|---|---|
| 按哪一版需求/设计验收？ | 送验前固定 00～05 的 source ref/commit/digest；验收不得混用未锁版本的文档或实现。 | 06 SOP Step 3；真相源闭环 §7.2 |
| 按哪一版测试方案和结果裁决？ | 固定 `05-测试方案.md` source ref 与单一 `<run_id>`；每个 EV 从该 run 的 raw artifact/report pair 追溯。 | 05 §13；验收标准规范 §4.4 |
| 送验 build/commit/image 是什么？ | 必须由送验说明填充 implementation commit/build id/image digest；当前值 `待固定`，不能用工作树状态或 `latest`。 | 06 SOP Step 3 |
| 环境、配置、数据和依赖是什么？ | 使用 `local-dev`、`ci-test`、`integration-like`、`operations-replay` 四个 P0 profile，固定 config digest、source precedence、fixture/replay root、依赖 source refs。 | 04 §6、05 §8 |
| 基线如何变更？ | 任何影响 P0 的需求/设计/实现/配置/suite/report/evidence 变化必须生成新 source refs 和新 run，旧 run 不能被覆盖或标记成 latest。 | 验收标准规范 §4.4；05 §12/§14 |
| 当前 run_id 是什么？ | 当前不存在实际 run；正式 06 只规定 `<run_id>` 占位规则，不填写伪造值。 | 项目执行台账；05 evidence ceiling |
| 允许哪些 evidence 路径？ | `artifacts/test/<run_id>/`、`reports/runs/<run_id>/`、`reports/acceptance/`；禁止 `latest`、`artifacts/test/<project>/<run_id>`、`reports/<project>`。 | 06 SOP Step 3；书写规范 §4.4 |

## 4. 当前文档问题诊断

| 问题 | 影响 | 处理 |
|---|---|---|
| 用“当前/最新”指代基线 | 不能重现验收，容易跨 run 污染 | 强制 source ref、digest、`<run_id>` |
| 将设计计划当执行结果 | 会伪造 EV/report/verdict | 计划 ID 与真实证据分层；当前全部 planned |
| 只保留人类报告 | 无 raw artifact 无法复核报告真伪 | 每个 blocking suite 必须 raw artifact + report pair |
| 只固定实现 commit 不固定配置/fixture | 同 commit 不同 profile 结果不可比 | profile、config digest、fixture/replay root 同批固定 |
| 使用项目目录级 evidence path | 跨项目审计和回链不稳定 | 采用全局 run-scoped 根 |

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 理由 |
|---|---|---|---|
| 设计基线 | 只引用文档名称 | 00～05 source ref/commit/digest 待固定 | 可复验 |
| 交付基线 | 未定义 | implementation commit/build/image digest 必填 | 绑定送验对象 |
| 运行基线 | 可能使用 latest | 单一 `<run_id>`，raw/report/acceptance 三层路径 | 防污染 |
| 数据基线 | 泛化 fixture | 脱敏、可复现 fixture/replay root + profile/config digest | 可重放且不泄密 |
| 结果状态 | 容易写“通过” | 当前只写待固定/不存在真实执行 | 不伪造事实 |

## 6. 验收裁决取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 以 latest 作为基线 | 操作简单 | 不能审计变更边界 | 拒绝 |
| 只固定报告路径 | 可读性好 | 不能证明原始结果和 digest | 拒绝 |
| source/build/config/fixture/run 五轴固定，并要求 artifact/report pair | 可复核、可追溯、能阻断伪造 | 送验准备成本较高 | 采用 |

## 7. 结构化中间产物

### 7.1 验收基线表

| 基线类型 | 必须固定内容 | 标识 | 当前状态 | 变化处理 |
|---|---|---|---|---|
| 需求基线 | `00-需求文档.md` source ref/digest | `<design-ref-00>` | 待固定 | 需求变化新 ref + 新 run |
| 架构基线 | `01-架构设计.md` source ref/digest | `<design-ref-01>` | 待固定 | 架构变化触发 P0 回归 |
| 概要基线 | `02-概要设计.md` source ref/digest | `<design-ref-02>` | 待固定 | CP/对象/flow 变化触发回归 |
| 详细基线 | `03-详细设计.md` source ref/digest | `<design-ref-03>` | 待固定 | field/state/protocol/UoW 变化触发回归 |
| 配置基线 | `04-配置设计.md` source ref/digest | `<design-ref-04>` | 待固定 | leaf/profile/source/redaction 变化触发回归 |
| 测试方案基线 | `05-测试方案.md` source ref/digest | `<test-plan-ref>` | 待固定 | TC/Suite/EV 变化重新生成 run |
| 标准基线 | 06 SOP/书写规范/真相源标准 source ref | `<standard-ref>` | 待固定 | 标准变化重审校准链 |
| 交付基线 | implementation commit、build id、image digest | `<delivery-ref>` | 未提供 | 缺失不得开始正式验收 |
| 依赖基线 | L0 SDK/core contract 与各 owner source refs | `<dependency-ref-set>` | 合同部分待定 | unknown/unavailable 保持 blocked |
| 环境基线 | 四个 P0 profile + config digest + runtime composition ref | `<profile-ref-set>` | 设计已定义，实例待固定 | profile/config 改变需新 run |
| 数据基线 | 脱敏 fixture、seed、replay root、数据清理说明 | `<fixture-ref-set>` | 未提供 | 不可复现或含敏感内容不得送验 |

### 7.2 证据入口基线

| 证据入口 | 固定路径 | 必须包含 | 当前姿态 |
|---|---|---|---|
| raw artifact | `artifacts/test/<run_id>/` | suite `report.json`、case refs、stdout/stderr（已脱敏）、artifact digest、profile/config ref | planned；不存在实例 |
| run report | `reports/runs/<run_id>/` | summary、gate-results、evidence-index、suite reports、redaction/dependency/report audit | planned；不存在实例 |
| acceptance handoff | `reports/acceptance/handoff.md` | source/build/run、范围、未覆盖、P0/P1/P2、审查记录 | planned；不存在实例 |
| veto checklist | `reports/acceptance/veto-checklist.md` | 5 个 VETO 的来源、EV/report/defect 关系和结论栏 | planned；不得默认 passed |
| risk acceptance | `reports/acceptance/risk-acceptance.md` | risk id、影响、理由、owner、acceptor、deadline/trigger、follow-up | planned；只有有条件通过时必需 |

### 7.3 不可接受引用

| 引用 | 处置 |
|---|---|
| `latest`、未固定分支、工作树当前状态 | 拒绝作为基线 |
| `artifacts/test/<project>/<run_id>`、`reports/<project>` | 拒绝作为正式 evidence root |
| 只有手写 evidence index / VETO checklist | 拒绝；必须有 raw artifact/report 关系 |
| local Git commit 作为 Artifact/Baseline | 拒绝；commit 仅是交付基线标识 |
| HTTP 200/ACK/remote object/cache/log/telemetry/job report | 拒绝作为 accepted/approved/signoff/readiness |

### 7.4 基线固定门禁

```text
00~05 source refs + standard refs
        |
delivery commit/build/image + dependency refs
        |
P0 profile/config/fixture/replay refs
        |
single run_id -> raw artifact pair -> run report -> acceptance handoff
```

## 8. 回填草稿

正式 §3 应声明：验收必须固定 00～05、标准、交付、依赖、四个 P0 profile、config digest、脱敏 fixture/replay root 和单一 `<run_id>`。原始证据只能位于 `artifacts/test/<run_id>/`，人类可读报告只能位于 `reports/runs/<run_id>/`，验收交接入口只能位于 `reports/acceptance/`；禁止 latest、项目子目录路径和静态手写证据。当前设计阶段不填写实际 source ref、implementation/build、config digest、fixture 或 run_id。

## 9. 待确认事项

| 事项 | 影响 | 截止点 |
|---|---|---|
| 送验 source/build/config/fixture/run_id | 没有固定基线就不能裁决 | 验收进入前 |
| raw artifact/report schema 真实生成方式 | 影响 evidence index 是否可追溯 | 05/07 implementation contract |
| P1 owner/Git/fs contract | 影响 P1 是否可从 blocked 转可执行 | blocker 解锁后 |

## 10. 进入下一步条件

- [x] 设计、交付、环境、配置、数据和证据五轴基线结构已定义。
- [x] 固定 run-scoped 路径和禁止路径已明确。
- [x] 当前无真实 run/报告/证据的上限已保留。
- [x] 正式 §3 回填草稿已形成。
- [x] 本步已停审；进入 Step 4 前需读取 flow、台账、本文件和 05 进入/退出相关产物。

## 11. Step 停审记录

- 本步裁决：`pass_with_upstream_blockers`；delivery/evidence 实例缺失不是本设计阶段的伪造理由，而是正式送验前置缺口。
- 下一步阅读：05 §12、`05_test_plan_step_12_entry_exit.md`、06 SOP Step 4，创建 Step 4。
