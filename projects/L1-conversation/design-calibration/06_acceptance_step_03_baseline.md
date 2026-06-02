# L1-conversation 06 验收标准 Step 3: 固定验收基线

> 所属流程: `06_acceptance_calibration_flow.md`
> 对应正式文档: `projects/L1-conversation/06-验收标准.md` §3 验收基线
> 状态: `[x] 已完成`
> 日期: 2026-06-02

---

## 1. Step 状态

| 项 | 内容 |
|---|---|
| Step | Step 3 |
| 主题 | 固定验收基线 |
| 当前状态 | `[x] 已完成` |
| 是否修改正式 `06-验收标准.md` | 否 |
| 产物位置 | `projects/L1-conversation/design-calibration/06_acceptance_step_03_baseline.md` |

本步固定验收裁决需要引用的需求、设计、测试、交付、环境、数据和证据基线。由于实现仓送验 commit、build、image 和实际 `<run_id>` 尚未产生，本步先固定“基线字段、证据路径和冻结规则”，并把缺失的送验值记录为最终验收结论前置条件。

## 2. 本步输入

| 输入 | 用途 | 本步判定 |
|---|---|---|
| `06_acceptance_step_02_scope.md` | 提供 P0 / P1 / P2 范围和下游接缝边界 | 作为验收基线范围来源 |
| `00-需求文档.md` | 提供需求验收基线 | 纳入设计文档生成基线 |
| `01-架构设计.md` | 提供架构边界和依赖方向基线 | 纳入设计文档生成基线 |
| `02-概要设计.md` | 提供模块、对象、接口和状态概要基线 | 纳入设计文档生成基线 |
| `03-详细设计.md` | 提供对象、协议、状态、错误、事务和观测正式基线 | 纳入设计文档生成基线 |
| `04-配置设计.md` | 提供 profile、path、redaction 和失效模式基线 | 纳入环境与配置基线 |
| `05-测试方案.md` | 提供 TC、EV、suite、entry / exit、reports / artifacts 基线 | 纳入测试和证据基线 |
| 实现仓送验说明 | 提供 `/home/aris/Projects/quantalithos-conversation` 的 commit / build / image | 当前待送验固定 |
| 测试执行 run | 提供 `<run_id>`、artifact、report 和 acceptance handoff | 当前待送验固定 |

## 3. SOP 问题回答

### 3.1 按哪一版需求和设计验收?

验收标准生成阶段按当前 `projects/L1-conversation/00-需求文档.md` 到 `05-测试方案.md` 的新版文档链收敛。当前设计仓 HEAD 为 `7998dd0`,但 L1-conversation 文档仍有未提交改动，因此该标识只能说明当前工作树起点，不能作为最终验收冻结基线。

最终验收裁决必须在送验前固定一个 design repo commit hash。该 commit 必须包含新版 `00~06`，以及如果已生成的 `07-实施计划.md`，不得引用“latest”或未提交工作树。

### 3.2 按哪一版测试方案和测试结果裁决?

测试方案基线为新版 `projects/L1-conversation/05-测试方案.md`。测试结果必须来自同一送验版本下的固定 `<run_id>`，并通过 `reports/runs/<run_id>/evidence-index.md`、`gate-results.md`、`redaction-check.md` 和 `reports/acceptance/*` 支撑裁决。

没有固定 `<run_id>` 时，可以生成验收标准，但不得给出“通过”或“有条件通过”的最终结论。

### 3.3 送验 build / commit / image 是什么?

目标实现仓为 `/home/aris/Projects/quantalithos-conversation`。当前尚未固定送验 commit、build id、image digest 或 binary artifact。正式送验时必须记录:

- implementation repo commit hash
- build id 或 artifact digest
- 如存在容器镜像,记录 image digest,不得只写 tag
- 与该送验版本匹配的 design repo commit hash

### 3.4 环境、配置、数据和依赖是什么?

P0 默认环境基线为 `ci-test` profile,in-memory store,fixed clock,deterministic id generator,fake resolver,fake publisher 和 fake handoff。release readiness 可追加 `integration-like` 与 `operations-replay` 证据,但不得把它们误写成 production-like。

数据基线来自 `05-测试方案.md` 的 `DS-CONV-*` 数据集、`TestRunId` namespace、deterministic fixture builder 和 fake script。依赖基线只裁决本仓接缝: `L0-core` shared contracts、`L0-bus` outbox publish seam、`L1-identity` actor / member ref、`L1-work` / `L1-governance` / `L1-artifact` safe snapshot、`L2-runtime` result ref、`L6-bridges` mapped ref、`L4-observability` / `L4-archive` handoff ref。

### 3.5 基线变更如何处理?

任何影响 `00~05` 设计链、送验 commit / build、profile、配置、fixture seed、`run_id`、artifact path、report path 或 acceptance handoff 的变更,都必须生成新的基线记录。旧 raw artifact 不得被原地修改。

如果证据执行完成后只补充人工审查意见或风险接受说明,可以更新 `reports/acceptance/*` 的 review version,但必须保留原始 `artifacts/test/<run_id>` 和 `reports/runs/<run_id>` 不变。

### 3.6 本轮验收固定的 `run_id` 是什么?

当前没有实际测试执行 run,因此 `<run_id>` 状态为 `待送验固定`。最终验收时必须固定为一个具体值,并且所有 EV、suite report、redaction check、gate result 和 acceptance handoff 都必须引用同一个 `<run_id>` 或显式说明跨 run 复验关系。

### 3.7 原始机器证据是否位于 `artifacts/test/<run_id>`?

当前尚未生成。正式证据必须位于 `artifacts/test/<run_id>`，不得位于 `artifacts/test/<project>/<run_id>`，不得引用 `latest`。

### 3.8 人类可读报告是否位于 `reports/runs/<run_id>`?

当前尚未生成。正式运行报告必须位于 `reports/runs/<run_id>`，包括 `summary.md`、`evidence-index.md`、`gate-results.md`、`redaction-check.md`、suite 报告和 EV 证据页。

### 3.9 验收交接文件是否位于 `reports/acceptance/`?

当前尚未生成。正式验收交接必须位于 `reports/acceptance/`，至少包括 `handoff.md`、`veto-checklist.md` 和必要时的 `risk-acceptance.md`、`open-issues.md`。

### 3.10 是否存在不可作为正式基线的引用?

本步禁止在正式验收基线中使用以下引用:

- `latest`
- `reports/<project>`
- `artifacts/test/<project>/<run_id>`
- 只有 branch name、tag name 或 image tag,但没有 commit hash / digest 的交付标识
- 未提交设计工作树或未固定实现工作树

## 4. 当前文档问题诊断

| 文档 / 输入 | 诊断 | 本步处理 |
|---|---|---|
| 旧 `06-验收标准.md` | 旧稿没有新版基线冻结口径,并可能继承旧 Turn / StreamEvents 主线 | 不继承；Step 15 删除重建 |
| `00~05` 文档链 | 已足以生成验收标准,但当前仍是未提交工作树 | 作为生成基线；最终验收前必须提交并固定 hash |
| 实现仓送验说明 | 当前未提供 commit / build / image | 记录为 `待送验固定` |
| 测试执行证据 | 当前未提供 `<run_id>`、artifact、report 和 handoff | 记录为最终验收结论前置条件 |
| `05-测试方案.md` §13 | 已固定 artifacts / reports / acceptance 路径 | 本步直接承接为证据基线 |

## 5. 改动前后对比

| 对比项 | 改动前 | 改动后 |
|---|---|---|
| 文档基线 | 旧 `06` 未区分设计生成基线和最终送验基线 | 明确 design commit 与 implementation commit 都必须冻结 |
| 测试结果 | 旧稿可能泛写测试报告 | 必须绑定固定 `<run_id>` 和 EV / report 路径 |
| artifact 路径 | 未统一为新版 path shape | 固定 `artifacts/test/<run_id>` |
| report 路径 | 未统一为 run-scoped report | 固定 `reports/runs/<run_id>` 与 `reports/acceptance` |
| 缺失送验证据 | 容易被忽略 | 明确不阻塞文档生成,但阻塞最终通过结论 |

## 6. 验收裁决取舍

| 决策点 | 方案 A | 方案 B | 推荐 | 原因 |
|---|---|---|---|---|
| 当前未提交设计工作树能否作为最终基线 | 可以直接使用当前工作树 | 只能作为生成基线,最终必须固定 design commit | B | 验收裁决必须可复查、可定位 |
| 缺少送验 commit / run_id 时如何处理 | 停止生成验收标准 | 继续生成标准,把 commit / run_id 列为最终结论前置 | B | AC 可先定义,通过结论必须等待证据 |
| 是否允许 `latest` | 可作为方便引用 | 禁止作为正式基线 | B | `latest` 不可审计且会漂移 |
| acceptance handoff 未生成是否阻塞 Step 4 | 阻塞所有后续 Step | 不阻塞 Step 4,但记录为送验前置缺口 | B | 后续 Step 仍需定义门禁和裁决规则 |
| 是否把 P1 integration-like 证据纳入 P0 | 纳入 P0 | 作为 release readiness / 风险接受证据 | B | Step 2 已区分 P0 与 readiness 范围 |

## 7. 结构化中间产物

### 7.1 验收基线表

| 基线类型 | 基线内容 | 版本 / 标识 | 说明 |
|---|---|---|---|
| 需求基线 | `00-需求文档.md` | `待固定 design commit` | 生成阶段使用当前新版文档；最终验收前必须提交 |
| 架构基线 | `01-架构设计.md` | `待固定 design commit` | 裁决职责边界、依赖方向和数据所有权 |
| 概要设计基线 | `02-概要设计.md` | `待固定 design commit` | 裁决主要组成部分、接口骨架和状态边界 |
| 详细设计基线 | `03-详细设计.md` | `待固定 design commit` | 裁决正式对象、协议、状态、事务、错误和观测 |
| 配置设计基线 | `04-配置设计.md` | `待固定 design commit` | 裁决 profile、配置项、path、redaction 和失效模式 |
| 测试方案基线 | `05-测试方案.md` | `待固定 design commit` | 裁决 TC、EV、suite、entry / exit 和证据归档 |
| 验收标准基线 | `06-验收标准.md` | Step 15 重建后固定 | 不继承旧稿；正式发布前必须固定 commit |
| 实现交付基线 | `/home/aris/Projects/quantalithos-conversation` | `待送验固定` | 必须记录 commit hash、build id / digest、image digest |
| 环境基线 | `ci-test`; `integration-like`; `operations-replay` | `待送验固定` | P0 默认 `ci-test`; readiness 可追加后两者 |
| 配置基线 | JSON config + env / job args | `待送验固定` | 必须匹配 `04-配置设计.md` path 和 profile 规则 |
| 数据基线 | `DS-CONV-*`; `TestRunId`; deterministic fixture | `待送验固定` | 必须可由 seed / builder / fake script 重建 |
| 依赖基线 | L0 / L1 / L2 / L4 / L6 接缝 | `待送验固定` | 只裁决本仓 ref / safe snapshot / marker / handoff seam |

### 7.2 证据入口基线表

| 证据入口 | 固定路径 | 版本 / 标识 | 当前状态 | 验收用途 |
|---|---|---|---|---|
| 原始 artifact | `artifacts/test/<run_id>/...` | `<run_id>` | `待送验固定 / 未生成` | 复核机器原始证据 |
| 运行报告 | `reports/runs/<run_id>/...` | `<run_id>` | `待送验固定 / 未生成` | 阅读测试摘要、EV 索引和门禁结果 |
| EV 索引 | `reports/runs/<run_id>/evidence-index.md` | `<run_id>` | `待送验固定 / 未生成` | 将 AC、TC、EV 和 suite result 绑定 |
| 门禁结果 | `reports/runs/<run_id>/gate-results.md` | `<run_id>` | `待送验固定 / 未生成` | 判断 P0-blocking suite 是否通过 |
| 脱敏检查 | `reports/runs/<run_id>/redaction-check.md` | `<run_id>` | `待送验固定 / 未生成` | 判断 forbidden body / raw secret / raw payload 是否泄露 |
| 验收交接 | `reports/acceptance/handoff.md` | `<review version>` | `待送验固定 / 未生成` | 送验总说明 |
| 一票否决检查 | `reports/acceptance/veto-checklist.md` | `<review version>` | `待送验固定 / 未生成` | 判断 VETO 是否触发 |
| 风险接受 | `reports/acceptance/risk-acceptance.md` | `<review version>` | `按需生成 / 当前未生成` | 支撑有条件通过 |
| 未关闭问题 | `reports/acceptance/open-issues.md` | `<review version>` | `按需生成 / 当前未生成` | 记录 S2 / S3 或 P1 / P2 遗留 |

### 7.3 基线冻结关系图

图类型: 验收基线关系图

图标题: L1-conversation 验收基线冻结链路

```text
[design repo commit]
  |-- 00-需求文档.md
  |-- 01-架构设计.md
  |-- 02-概要设计.md
  |-- 03-详细设计.md
  |-- 04-配置设计.md
  |-- 05-测试方案.md
  `-- 06-验收标准.md
          |
          v
[implementation commit / build / image digest]
          |
          v
[artifacts/test/<run_id>]
          |
          v
[reports/runs/<run_id>] ----> [reports/acceptance]
          |
          v
[通过 / 有条件通过 / 不通过]
```

关键说明:

- design repo commit 和 implementation commit 必须同时固定,不能只写“当前最新”。
- `<run_id>` 是机器证据和人类报告的共同锚点。
- `reports/acceptance/*` 只能基于固定 run 审查补充,不能反向修改 raw artifact。
- 没有上述任一冻结项时,Step 14 不得给出最终“通过”结论。

### 7.4 基线变更处理表

| 变更类型 | 是否需要新基线 | 处理规则 |
|---|---|---|
| `00~06` 任一正式文档变化 | 是 | 固定新的 design commit,并复核 AC / TC / EV 映射 |
| 实现 commit / build / image 变化 | 是 | 重新执行对应 gate,生成新的 `<run_id>` |
| profile / config / env 变化 | 是 | 重新验证 path、redaction、fake marker 和 unsupported profile |
| fixture seed / fake script 变化 | 是 | 重新生成数据基线和 suite result |
| raw artifact 或 run report 变化 | 是 | 不得原地覆盖；创建新 `<run_id>` |
| acceptance review 文本补充 | 不一定 | 保留 raw artifact,更新 review version 并说明依据 |
| S0 / S1 缺陷修复 | 是 | 修复后必须重新执行直接 TC、同组 TC、redline 和必要 redaction |
| S2 / S3 风险接受 | 不一定 | 记录 owner、截止时间、规避措施和 P0 不受影响说明 |

## 8. 回填草稿

以下内容供 Step 15 汇总正式 `06-验收标准.md` §3 时摘录。

```markdown
## 3. 验收基线

> 校准来源：
> - `design-calibration/06_acceptance_step_03_baseline.md`
>
> 延伸阅读：
> - 建议继续阅读 `design-calibration/06_acceptance_step_03_baseline.md` 的“验收基线表”“证据入口基线表”“基线冻结关系图”和“基线变更处理表”小节，了解本章如何固定设计、交付、环境、数据、artifact、report 和 acceptance handoff 基线。

本轮验收必须固定设计基线、实现交付基线、环境配置基线、测试数据基线和证据基线。设计基线必须是包含 `00~06` 的 design repo commit；实现基线必须是 `/home/aris/Projects/quantalithos-conversation` 的具体 commit hash、build id / artifact digest 和必要时的 image digest。

机器原始证据固定为 `artifacts/test/<run_id>`，人类可读报告固定为 `reports/runs/<run_id>`，验收交接固定为 `reports/acceptance`。正式验收不得引用 `latest`，不得使用 `reports/<project>` 或 `artifacts/test/<project>/<run_id>`。

当前若尚未产生送验 commit、build、`<run_id>` 或 `reports/acceptance/*`，只能完成验收标准定义，不能给出最终“通过”或“有条件通过”结论。
```

## 9. 待确认事项

无阻塞进入 Step 4 的待确认事项。

后续必须在最终验收前确认:

- design repo commit hash 已固定,且包含新版 `00~06`。
- implementation repo commit hash、build id / artifact digest 和必要时的 image digest 已固定。
- `<run_id>` 已固定,且 `artifacts/test/<run_id>` 与 `reports/runs/<run_id>` 已生成。
- `reports/acceptance/handoff.md`、`veto-checklist.md` 和必要的 `risk-acceptance.md` 已审查补充。
- 所有正式引用均未使用 `latest`、`reports/<project>` 或 `artifacts/test/<project>/<run_id>`。

## 10. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| 文档生成基线可定位 | 通过 | 当前以新版 `00~05` 为生成基线,Step 15 固定到正式 `06` |
| 最终冻结字段已定义 | 通过 | design commit、implementation commit、build、run_id、reports 均有字段 |
| 证据路径形态已固定 | 通过 | 固定 `artifacts/test/<run_id>`、`reports/runs/<run_id>`、`reports/acceptance` |
| 缺失送验证据已分类 | 通过 | 不阻塞标准生成,但阻塞最终验收结论 |
| 可以进入 Step 4 | 通过 | 下一步定义进入条件与退出条件 |
