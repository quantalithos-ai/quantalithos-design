# L0-bus 06 验收标准 Step 3: 验收基线

> 本文件是 `projects/L0-bus/06-验收标准.md` 的 Step 3 中间产物。
> 本步固定验收标准使用的需求、设计、测试、交付、环境、数据和证据基线规则。
> 本步不修改正式 `06-验收标准.md`。

---

## 1. Step 状态

| 项 | 内容 |
|---|---|
| Step | Step 3 |
| 主题 | 固定验收基线 |
| 状态 | 已确认 |
| 正式回填位置 | `06-验收标准.md` §3 |
| 是否修改正式 `06-验收标准.md` | 否 |

---

## 2. 本步输入

| 输入 | 当前状态 | 本步使用方式 |
|---|---|---|
| `06_acceptance_step_01_input_boundary.md` | 已确认 | 继承文档基线、送验基线和 evidence / report 绑定规则 |
| `06_acceptance_step_02_scope.md` | 已确认 | 继承 P0 / P0-min / P1 / P2 验收范围 |
| `00-需求文档.md` ~ `05-测试方案.md` | 已完成 | 固定验收标准生成阶段的文档基线 |
| `05-测试方案.md` §12 / §13 | 已完成 | 提取进入 / 退出准则、artifact / report / acceptance handoff 路径 |
| 送验版本 / 测试 run | 当前尚未生成 | 本步定义送验时必须提供的基线字段和缺失处理 |
| `04-配置设计.md` | 已完成 | 固定 `ci-test`、`integration-test`、`operations-recovery` profile 作为 P0 验收环境基线 |

---

## 3. SOP 问题回答

### 3.1 按哪一版需求和设计验收?

本轮验收标准生成阶段按新版 `L0-bus` `00~05` 文档基线生成。正式送验时,验收仍以这些文档版本为裁决依据;如果送验前任一上游文档发生改变,必须重新判断是否影响 `06`。

| 文档 | 版本 / 标识 | 基线作用 |
|---|---|---|
| `00-需求文档.md` | v0.2.0 | 定义 P0 主闭环、F-001~F-008、BR-001~BR-012、非目标和需求验收方向 |
| `01-架构设计.md` | v0.2.0 | 定义系统边界、依赖方向、数据所有权和架构红线 |
| `02-概要设计.md` | v0.2.0 | 定义主要组成部分、对象、接口、处理流和状态机轮廓 |
| `03-详细设计.md` | v0.2.0 | 定义实现契约、状态机、事务、一致性、错误、幂等、观测和测试切口 |
| `04-配置设计.md` | v0.1.0 | 定义配置来源、profile、loader / validator、secret ref、失效模式和下游承接 |
| `05-测试方案.md` | v0.2.0 | 定义测试用例、门禁、证据编号、reports / artifacts、缺陷分级和残余风险 |

### 3.2 按哪一版测试方案和测试结果裁决?

验收标准按 `05-测试方案.md` v0.2.0 的测试范围、用例、门禁和证据结构裁决。实际测试结果不能写入验收标准草案,必须由送验时的固定 `<run_id>` 绑定。

| 裁决输入 | 基线规则 |
|---|---|
| 测试方案版本 | `05-测试方案.md` v0.2.0 |
| 测试用例 | `TC-BUS-*` 用例族 |
| 测试证据 | `EV-BUS-*`、`RP-BUS-*` |
| 测试报告 | `reports/runs/<run_id>` |
| 验收交接 | `reports/acceptance` |
| 禁止引用 | `latest`、`reports/<project>`、`artifacts/test/<project>/<run_id>` |

### 3.3 送验 build / commit / image 是什么?

当前还没有实现仓送验版本,因此本步不虚构 build、commit、image 或 tag。正式验收前,送验说明必须提供以下字段。

| 字段 | 要求 | 缺失时处理 |
|---|---|---|
| repository | `/home/aris/Projects/quantalithos-bus` 或实际实现仓路径 | 不得进入正式验收 |
| commit sha | 固定提交 SHA,不得写“当前最新” | 不得进入正式验收 |
| tag / build id | 如存在则填写,没有则说明不适用 | 不阻断草案,但送验需说明 |
| image digest | 如产生容器镜像则使用 digest,不得只写 mutable tag | 缺失时不能裁决镜像交付 |
| dependency snapshot | 至少包含 `L0-core` path dependency 对应 commit / version | 缺失时不能裁决跨仓契约一致性 |

### 3.4 环境、配置、数据和依赖是什么?

| 基线类型 | 固定内容 | 验收用途 |
|---|---|---|
| 环境 profile | `ci-test`、`integration-test`、`operations-recovery` | 支撑 PR / CI / release gate 裁决 |
| P1 环境 | `staging-like` | 只作为 P1 smoke 或风险记录,不阻断当前 P0 |
| 配置 profile | 由 `04-配置设计.md` 定义,并由 config summary 证明 | 裁决 runtime graph 是否与设计一致 |
| 数据基线 | `TestRunBuilder` 生成的 `run_id`、actor、metadata、deterministic namespace、`DS-BUS-*` fixture | 裁决用例是否可复现 |
| 依赖基线 | `L0-core` shared contracts 本地 path dependency 可编译 | 裁决 core / bus 契约一致性 |
| fake / in-memory path | in-memory store、fake backend、fixture source、in-memory publisher sink | 裁决 P0 默认可验证路径 |
| 禁止依赖 | 真实 MQ / DB / KMS / config center 不是当前 P0 前置 | 防止 P1/P2 污染 P0 |

### 3.5 基线变更如何处理?

| 基线变更 | 处理规则 |
|---|---|
| `00~05` 任一文档改变 P0 / P0-min 范围 | 回到对应文档重校准,再更新 `06` |
| `05-测试方案.md` 改变用例、证据或 gate 规则 | 回到 `05` 校准,再重新生成 `06` 相关章节 |
| 实现 commit 变化但未改变文档契约 | 重新执行受影响 gate,生成新的 `<run_id>` |
| `L0-core` contract dependency 变化 | 触发跨仓契约复核和全量 P0 回归 |
| config profile 变化 | 重新执行 config validation、runtime graph 和受影响 release gate |
| report / artifact 路径变化 | 不接受为正式基线,必须按标准路径重生成 |
| 使用 `latest` 或 mutable tag | 不接受为正式基线 |

### 3.6 本轮验收固定的 `run_id` 是什么?

当前处于设计校准阶段,尚未有正式测试运行,因此不固定实际 `run_id`。

正式送验时必须提供唯一固定 `<run_id>`。推荐格式:

```text
release-gate-YYYYMMDDTHHMMSSZ
release-gate-YYYYMMDDTHHMMSSZ-<short-sha>
```

验收标准中的所有证据引用必须用同一个送验 `<run_id>` 或明确列出多个 run 的关系;不得引用 `latest`。

### 3.7 原始机器证据是否位于 `artifacts/test/<run_id>`?

正式送验时必须位于:

```text
artifacts/test/<run_id>
```

最小要求包括:

```text
artifacts/test/<run_id>/
  meta/context.json
  evidence-index.json
  suites/<suite>/report.json
  suites/<suite>/stdout.log
  suites/<suite>/stderr.log
```

如果 raw artifact 尚未生成,这是送验前置缺口,不是验收标准草案的缺口。

### 3.8 人类可读报告是否位于 `reports/runs/<run_id>`?

正式送验时必须位于:

```text
reports/runs/<run_id>
```

最小要求包括 summary、evidence-index、gate-results、coverage-matrix、config-summary、redaction-check、artifact-index 和 suite reports。

### 3.9 验收交接文件是否位于 `reports/acceptance/`?

正式送验时必须位于:

```text
reports/acceptance/
```

最小要求包括:

```text
reports/acceptance/<run_id>-index.md
reports/acceptance/handoff.md
reports/acceptance/veto-checklist.md
reports/acceptance/risk-acceptance.md
reports/acceptance/open-issues.md
```

其中 `handoff.md`、`veto-checklist.md`、`risk-acceptance.md` 允许脚本生成初稿,但必须经过人或 Agent 审查补充。

### 3.10 是否存在不可作为正式基线的引用?

当前 Step 3 中不固定实际证据路径,因此不存在已引用的非法实际基线。正式送验时以下引用一律不可作为正式验收基线:

```text
latest
artifacts/test/latest
artifacts/test/<project>/<run_id>
reports/latest
reports/<project>
mutable image tag
当前最新提交
本机当前状态
```

---

## 4. 当前文档问题诊断

| 问题 | 表现 | 风险 | 本步处理 |
|---|---|---|---|
| 旧 `06` 基线过于笼统 | 只写 `02/03/05` 和 test / staging 环境 | 无法定位到文档版本、commit、run_id、report | 本步拆分文档基线、送验版本基线、测试运行基线和证据基线 |
| 旧 `06` 使用“当前文档批次” | 没有固定版本或标识 | 验收时可能漂移 | 本步使用明确文档版本,实现基线由送验说明固定 |
| 旧 `06` 没有 artifact / report 基线 | 证据路径不可复查 | 验收无法审计 | 本步固定 `artifacts/test/<run_id>`、`reports/runs/<run_id>`、`reports/acceptance` |
| 旧 `06` 可能把测试环境当验收环境 | 未区分 ci / integration / recovery / staging-like | P1 环境可能误阻断 P0 | 本步明确 P0 profile 和 P1 staging-like 差异 |
| 旧 `06` 没有基线变更规则 | 文档或 commit 变化后不知道是否重验 | 证据与交付物不匹配 | 本步定义基线变更处理 |

---

## 5. 改动前后对比

| 维度 | 改动前 | 改动后 | 价值 |
|---|---|---|---|
| 文档基线 | `02/03/05` 笼统引用 | `00~05` 明确版本 / 标识 | 可追溯 |
| 实现基线 | 未定义 | 送验说明必须提供 repository、commit、tag / build、image digest | 可定位 |
| 测试基线 | 未定义 run | 固定 `<run_id>` 绑定 reports / artifacts | 可复查 |
| 环境基线 | test / staging 粗略描述 | ci-test / integration-test / operations-recovery / staging-like 分层 | 可裁决 |
| 证据基线 | 无路径规则 | report 优先,artifact 回链,acceptance 交接 | 可审计 |
| 变更处理 | 未定义 | 文档、commit、core contract、config、path 变更均有处理 | 可维护 |

---

## 6. 验收设计取舍

### 6.1 是否在当前文档中写死实际 commit 和 run_id

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| A. 现在写死实际 commit / run_id | 看起来完整 | 实现尚未送验,会虚构基线 |
| B. 当前固定基线规则,正式送验时由 handoff 填入实际值 | 不虚构证据,且约束明确 | 需要送验材料配合 | 采用 |
| C. 不提 commit / run_id | 文档更短 | 验收无法定位交付物和证据 | 不采用 |

### 6.2 是否允许 `latest` 作为验收便利入口

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| A. 允许正式验收使用 `latest` | 使用方便 | 不可审计,会漂移 | 不采用 |
| B. 本地可有便利 alias,正式验收只用固定 `<run_id>` | 可审计 | 需要报告中写明固定 run | 采用 |
| C. 完全不允许任何 alias | 最严格 | 本地开发不便,不影响正式基线 | 不作为正式验收要求 |

### 6.3 是否把 `reports/acceptance/*` 缺失视为当前文档阻塞

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| A. 当前阻塞 `06` 生成 | 确保送验材料完整 | 当前尚未实施,会阻断设计校准 |
| B. 当前记录为送验前置缺口,正式验收前必须补齐 | 符合阶段现实 | 需要 Step 4 / Step 10 / Step 14 继续承接 | 采用 |
| C. 不要求 acceptance handoff | 文档更短 | 验收交接不可裁决 | 不采用 |

---

## 7. 结构化中间产物

### 7.1 验收基线表

| 基线类型 | 基线内容 | 版本 / 标识 | 说明 |
|---|---|---|---|
| 需求基线 | `projects/L0-bus/00-需求文档.md` | v0.2.0 | F-001~F-008、BR-001~BR-012、验收方向 |
| 架构基线 | `projects/L0-bus/01-架构设计.md` | v0.2.0 | 边界、依赖、数据所有权和横切关注点 |
| 概要设计基线 | `projects/L0-bus/02-概要设计.md` | v0.2.0 | 主要组成部分、对象、接口、处理流、状态机 |
| 详细设计基线 | `projects/L0-bus/03-详细设计.md` | v0.2.0 | 实现契约、协议、事务、一致性、错误、幂等 |
| 配置设计基线 | `projects/L0-bus/04-配置设计.md` | v0.1.0 | profile、loader / validator、secret ref、runtime graph |
| 测试方案基线 | `projects/L0-bus/05-测试方案.md` | v0.2.0 | 用例、门禁、证据、缺陷、风险 |
| 实现仓基线 | `/home/aris/Projects/quantalithos-bus` | 送验说明提供 commit / tag / build | 当前设计阶段不虚构 |
| 上游依赖基线 | `/home/aris/Projects/quantalithos-core` | 送验说明提供 commit / version | 用于裁决 core / bus 契约一致性 |
| 环境基线 | `ci-test`、`integration-test`、`operations-recovery` | 由 config summary 证明 | P0 验收环境 |
| 数据基线 | `run_id` + `DS-BUS-*` fixture | 由 test context / evidence index 证明 | 验收数据可复现 |

### 7.2 artifact / report / acceptance handoff 基线表

| 证据入口 | 固定路径 | 版本 / 标识 | 验收用途 |
|---|---|---|---|
| 原始 artifact | `artifacts/test/<run_id>/...` | `<run_id>` | 复核机器原始证据 |
| 运行报告 | `reports/runs/<run_id>/...` | `<run_id>` | 阅读测试摘要、EV 索引和门禁结果 |
| 证据索引 | `reports/runs/<run_id>/evidence-index.md` | `<run_id>` | 追溯 AC / TC / EV / artifact |
| 门禁结果 | `reports/runs/<run_id>/gate-results.md` | `<run_id>` | 裁决 PR / CI / release gate |
| 覆盖矩阵 | `reports/runs/<run_id>/coverage-matrix.md` | `<run_id>` | 裁决 P0 / P0-min 覆盖 |
| 配置摘要 | `reports/runs/<run_id>/config-summary.md` | `<run_id>` | 裁决 profile 和 runtime graph |
| 脱敏检查 | `reports/runs/<run_id>/redaction-check.md` | `<run_id>` | 裁决 S0 红线 |
| 验收索引 | `reports/acceptance/<run_id>-index.md` | `<run_id>` | 验收证据入口 |
| 验收交接 | `reports/acceptance/handoff.md` | review version | 送验总说明 |
| 一票否决检查 | `reports/acceptance/veto-checklist.md` | review version | 判断 VETO 是否触发 |
| 风险接受 | `reports/acceptance/risk-acceptance.md` | review version | 支撑有条件通过 |
| 遗留问题 | `reports/acceptance/open-issues.md` | review version | 支撑后续动作 |

### 7.3 基线变更处理表

| 变更类型 | 是否允许继续使用原基线 | 处理 |
|---|---|---|
| 文档 P0 范围改变 | 否 | 回到对应文档和 `06` 重校准 |
| 测试方案用例 / 证据改变 | 否 | 回到 `05` 重校准并重建 `06` 相关章节 |
| 实现 commit 改变 | 视影响 | 重新执行受影响 gate,生成新 `<run_id>` |
| `L0-core` contract 改变 | 否 | 全量跨仓契约复核 + P0 回归 |
| config profile 改变 | 否 | 重新执行 config validation 和相关 gate |
| artifact / report 路径改变 | 否 | 按标准路径重生成 |
| 只修改 acceptance handoff 文字 | 可以 | 保留同一 run,记录 review version |

### 7.4 非法基线引用清单

| 非法引用 | 原因 |
|---|---|
| `latest` | 会漂移,不可审计 |
| `artifacts/test/latest` | 不能证明固定 run |
| `artifacts/test/<project>/<run_id>` | 不符合统一目录规则 |
| `reports/latest` | 会漂移,不可审计 |
| `reports/<project>` | 不符合统一目录规则 |
| mutable image tag | 无法证明镜像不可变 |
| 当前最新提交 | 无法定位 commit |
| 本机当前状态 | 无法复现 |

---

## 8. 回填草稿

> 校准来源：
> - `design-calibration/06_acceptance_step_03_baseline.md`
>
> 延伸阅读：
> - 建议继续阅读上述中间产物的“验收基线表”“artifact / report / acceptance handoff 基线表”和“基线变更处理表”小节，了解本章如何固定文档、交付、环境、数据和证据基线。

本轮验收标准生成阶段以 `00-需求文档.md` v0.2.0、`01-架构设计.md` v0.2.0、`02-概要设计.md` v0.2.0、`03-详细设计.md` v0.2.0、`04-配置设计.md` v0.1.0 和 `05-测试方案.md` v0.2.0 作为文档基线。正式送验时,还必须由 `reports/acceptance/handoff.md` 或等价送验说明提供实现仓路径、commit、tag / build id、image digest、`L0-core` 依赖版本和固定测试 `<run_id>`。

验收证据必须绑定固定 `<run_id>`。原始机器证据位于 `artifacts/test/<run_id>`,人类可读报告位于 `reports/runs/<run_id>`,验收交接位于 `reports/acceptance`。正式验收不得引用 `latest`、`reports/<project>`、`artifacts/test/<project>/<run_id>`、mutable image tag、当前最新提交或本机当前状态。

如果 `reports/acceptance/*` 尚未生成,它不是验收标准草案的阻塞项,但属于正式送验前置缺口。正式验收前必须补齐 handoff、veto checklist、risk acceptance 和 open issues。

---

## 9. 待确认事项

当前没有阻塞进入 Step 4 的待确认事项。

| 事项 | 方案 | 建议 | 原因 |
|---|---|---|---|
| 是否现在固定实际 commit / run_id | A. 现在固定;B. 当前固定规则,送验时提供实际值;C. 不提 | 采用 B | 当前尚未实现送验,不能虚构基线 |
| 是否允许正式验收使用 `latest` | A. 允许;B. 禁止,仅固定 run_id;C. 完全不允许 alias | 采用 B | 正式验收必须可审计 |
| `reports/acceptance/*` 未生成是否阻塞 `06` 草案 | A. 阻塞;B. 作为送验前置缺口;C. 不要求 | 采用 B | 当前处于设计校准阶段,正式送验前必须补齐 |

---

## 10. 进入下一步条件

| 条件 | 状态 |
|---|---|
| 需求、设计、测试文档基线已定义 | 已满足 |
| 送验 build / commit / image 的绑定规则已定义 | 已满足 |
| 环境、配置、数据和依赖基线已定义 | 已满足 |
| 基线变更处理规则已定义 | 已满足 |
| 固定 `<run_id>` 规则已定义 | 已满足 |
| artifact / report / acceptance handoff 路径基线已定义 | 已满足 |
| 不可作为正式基线的引用已列出 | 已满足 |

结论: 可以进入 Step 4,定义进入条件与退出条件。
