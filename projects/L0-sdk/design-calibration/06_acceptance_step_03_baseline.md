# L0-sdk 06 验收标准 Step 3: 验收基线

> 本文件是 `projects/L0-sdk/06-验收标准.md` 的 Step 3 中间产物。
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
| `06_acceptance_step_02_scope.md` | 已确认 | 继承 P0 / P1 / P2 / Forbidden 验收范围 |
| `00-需求文档.md` ~ `05-测试方案.md` | 已完成 | 固定验收标准生成阶段的文档基线 |
| `04-配置设计.md` §6 / §7 / §12 | 已完成 | 固定 local-dev、ci-test、integration-test、candidate-validation 等 P0 profile 和配置项来源 |
| `05-测试方案.md` §8 / §12 / §13 / §14 | 已完成 | 提取测试环境、进入 / 退出准则、artifact / report / acceptance handoff 路径和残余风险 |
| 送验版本 / 测试 run | 当前尚未生成 | 本步定义送验时必须提供的基线字段和缺失处理 |

---

## 3. SOP 问题回答

### 3.1 按哪一版需求和设计验收?

本轮验收标准生成阶段按新版 `L0-sdk` `00~05` 文档基线生成。正式送验时,验收仍以这些文档版本为裁决依据;如果送验前任一上游文档发生改变,必须重新判断是否影响 `06`。

| 文档 | 版本 / 标识 | 基线作用 |
|---|---|---|
| `00-需求文档.md` | v0.2.0 | 定义 P0 official SDK 闭环、F-001~F-010、BR-001~BR-014、非目标和需求验收方向 |
| `01-架构设计.md` | v0.2.0 | 定义 official client access layer、依赖方向、数据所有权和架构红线 |
| `02-概要设计.md` | v0.2.0 | 定义代码主体框架、主要组成部分、对象、接口、处理流、状态机和配置影响 |
| `03-详细设计.md` | v0.2.0 | 定义实现契约、协议、状态机、事务、一致性、错误、幂等、观测和测试切口 |
| `04-配置设计.md` | v0.1.0 | 定义 strict JSON、profile、配置项、secret ref、fail-fast / fail-closed 和下游承接 |
| `05-测试方案.md` | v0.2.0 | 定义测试用例、门禁、证据编号、reports / artifacts、缺陷分级和残余风险 |

### 3.2 按哪一版测试方案和测试结果裁决?

验收标准按 `05-测试方案.md` v0.2.0 的测试范围、用例、门禁和证据结构裁决。实际测试结果不能写入验收标准草案,必须由送验时的固定 `<run_id>` 绑定。

| 裁决输入 | 基线规则 |
|---|---|
| 测试方案版本 | `05-测试方案.md` v0.2.0 |
| 测试场景 | `TS-SDK-*` 场景族 |
| 测试用例 | `TC-SDK-*` 用例族 |
| 测试证据 | `EV-SDK-*` |
| 测试报告 | `reports/runs/<run_id>` |
| 验收交接 | `reports/acceptance` |
| 禁止引用 | `latest`、`reports/<project>`、`artifacts/test/<project>/<run_id>` |

### 3.3 送验 build / commit / image 是什么?

当前还没有实现仓送验版本,因此本步不虚构 build、commit、image 或 tag。正式验收前,送验说明必须提供以下字段。

| 字段 | 要求 | 缺失时处理 |
|---|---|---|
| repository | `/home/aris/Projects/quantalithos-sdk` 或实际实现仓路径 | 不得进入正式验收 |
| commit sha | 固定提交 SHA,不得写“当前最新” | 不得进入正式验收 |
| tag / build id | 如存在则填写,没有则说明不适用 | 不阻断草案,但送验需说明 |
| crate / package version | Rust crate、Python package、TypeScript package 的 candidate 版本 | 缺失时不能裁决三语言 package candidate |
| binary / CLI artifact | 如产生 CLI / job binary 则填写 artifact ref | 缺失时不能裁决 CLI / job 交付 |
| dependency snapshot | 至少包含 `L0-core`、`L0-bus` path dependency 对应 commit / version | 缺失时不能裁决跨仓契约一致性 |
| candidate id | 本地 package candidate 的固定 ID 或 receipt ref | 缺失时不能裁决 candidate stable gate |

### 3.4 环境、配置、数据和依赖是什么?

| 基线类型 | 固定内容 | 验收用途 |
|---|---|---|
| P0 环境 profile | `local-dev`、`ci-test`、`integration-test`、`candidate-validation` | 支撑 local smoke、CI gate、integration gate、candidate gate |
| P1/P2 环境 | `staging-like`、`production-like` | 只作为风险或后续专项,不阻断当前 P0 |
| 配置基线 | strict JSON config、config artifact fingerprint、profile / source / boundary / runner / artifact / report root | 裁决 runtime graph 是否与设计一致 |
| 数据基线 | `run_id`、`DS-SDK-*` fixture、snapshot ref、artifact ref、report ref | 裁决用例是否可复现 |
| 依赖基线 | `L0-core` / `L0-bus` contracts 本地 path dependency 或正式 contract package | 裁决 SDK 是否消费上游 truth |
| fake / fixture path | fake formal API、fake bus boundary、fixture source、local runner、filesystem artifact store | 裁决 P0 默认可验证路径 |
| 禁止依赖 | 真实 registry、真实 credential provider、remote config、full service endpoint matrix 不是当前 P0 前置 | 防止 P1/P2 污染 P0 |

### 3.5 基线变更如何处理?

| 基线变更 | 处理规则 |
|---|---|
| `00~05` 任一文档改变 P0 范围 | 回到对应文档重校准,再更新 `06` |
| `05-测试方案.md` 改变用例、证据或 gate 规则 | 回到 `05` 校准,再重新生成 `06` 相关章节 |
| 实现 commit 变化但未改变文档契约 | 重新执行受影响 gate,生成新的 `<run_id>` |
| `L0-core` / `L0-bus` contract dependency 变化 | 触发跨仓契约复核和全量或接近全量 P0 回归 |
| config profile 或配置 artifact 变化 | 重新执行 config validation、runtime graph、redaction 和受影响 release gate |
| package candidate id 或 package version 变化 | 重新执行 candidate、docs、smoke、compatibility gate |
| report / artifact 路径变化 | 不接受为正式基线,必须按标准路径重生成 |
| 使用 `latest` 或 mutable tag | 不接受为正式基线 |

### 3.6 本轮验收固定的 `run_id` 是什么?

当前处于设计校准阶段,尚未有正式测试运行,因此不固定实际 `run_id`。

正式送验时必须提供唯一固定 `<run_id>`。推荐格式:

```text
candidate-gate-YYYYMMDDTHHMMSSZ
candidate-gate-YYYYMMDDTHHMMSSZ-<short-sha>
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
  suites/<suite>/failure-reason.md
```

如果 raw artifact 尚未生成,这是送验前置缺口,不是验收标准草案的缺口。

### 3.8 人类可读报告是否位于 `reports/runs/<run_id>`?

正式送验时必须位于:

```text
reports/runs/<run_id>
```

最小要求包括 summary、evidence-index、gate-results、redaction-check、suite reports 和 per-evidence markdown。需要覆盖矩阵、config-summary 或 artifact-index 时,也必须位于同一 run 目录下。

### 3.9 验收交接文件是否位于 `reports/acceptance/`?

正式送验时必须位于:

```text
reports/acceptance/
```

最小要求包括:

```text
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
| 旧 `06` 没有配置基线 | 未承接 strict JSON、profile 和 forbidden toggle | 配置可能绕过验收门禁 | 本步把 `04` 配置基线作为 P0 输入 |
| 旧 `06` 没有基线变更规则 | 文档、commit 或 package candidate 变化后不知道是否重验 | 证据与交付物不匹配 | 本步定义基线变更处理 |

---

## 5. 改动前后对比

| 维度 | 改动前 | 改动后 | 价值 |
|---|---|---|---|
| 文档基线 | `02/03/05` 笼统引用 | `00~05` 明确版本 / 标识 | 可追溯 |
| 实现基线 | 未定义 | 送验说明必须提供 repository、commit、package version、candidate id、dependency snapshot | 可定位 |
| 测试基线 | 未定义 run | 固定 `<run_id>` 绑定 reports / artifacts | 可复查 |
| 环境基线 | test / staging 粗略描述 | local-dev / ci-test / integration-test / candidate-validation / staging-like / production-like 分层 | 可裁决 |
| 证据基线 | 无路径规则 | report 优先,artifact 回链,acceptance 交接 | 可审计 |
| 变更处理 | 未定义 | 文档、commit、contract、config、candidate、path 变更均有处理 | 可维护 |

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
| 需求基线 | `projects/L0-sdk/00-需求文档.md` | v0.2.0 | F-001~F-010、BR-001~BR-014、验收方向 |
| 架构基线 | `projects/L0-sdk/01-架构设计.md` | v0.2.0 | official client access layer、依赖、数据所有权和横切关注点 |
| 概要设计基线 | `projects/L0-sdk/02-概要设计.md` | v0.2.0 | 代码主体、对象、接口、处理流、状态机和配置影响 |
| 详细设计基线 | `projects/L0-sdk/03-详细设计.md` | v0.2.0 | 实现契约、协议、状态机、事务、一致性、错误、幂等 |
| 配置设计基线 | `projects/L0-sdk/04-配置设计.md` | v0.1.0 | strict JSON、profile、配置项、secret ref、runtime graph |
| 测试方案基线 | `projects/L0-sdk/05-测试方案.md` | v0.2.0 | 用例、门禁、证据、缺陷、风险 |
| 实现仓基线 | `/home/aris/Projects/quantalithos-sdk` 或实际实现仓 | 送验说明提供 commit / package version / candidate id | 当前设计阶段不虚构 |
| 上游依赖基线 | `/home/aris/Projects/quantalithos-core`、`/home/aris/Projects/quantalithos-bus` 或正式 contract package | 送验说明提供 commit / version | 用于裁决 SDK / core / bus 契约一致性 |
| 环境基线 | `local-dev`、`ci-test`、`integration-test`、`candidate-validation` | 由 config summary 证明 | P0 验收环境 |
| 数据基线 | `run_id` + `DS-SDK-*` fixture | 由 test context / evidence index 证明 | 验收数据可复现 |

### 7.2 artifact / report / acceptance handoff 基线表

| 证据入口 | 固定路径 | 版本 / 标识 | 验收用途 |
|---|---|---|---|
| 原始 artifact | `artifacts/test/<run_id>/...` | `<run_id>` | 复核机器原始证据 |
| 运行报告 | `reports/runs/<run_id>/...` | `<run_id>` | 阅读测试摘要、EV 索引和门禁结果 |
| 证据索引 | `reports/runs/<run_id>/evidence-index.md` | `<run_id>` | 追溯 AC / TC / EV / artifact |
| 门禁结果 | `reports/runs/<run_id>/gate-results.md` | `<run_id>` | 裁决 PR / main / candidate gate |
| 脱敏检查 | `reports/runs/<run_id>/redaction-check.md` | `<run_id>` | 裁决 raw secret / raw body 泄漏红线 |
| 验收交接 | `reports/acceptance/handoff.md` | `<run_id>` | 固定送验范围、交付物和证据入口 |
| 一票否决检查 | `reports/acceptance/veto-checklist.md` | `<run_id>` | 裁决一票否决项是否触发 |
| 风险接受 | `reports/acceptance/risk-acceptance.md` | `<run_id>` | 支撑有条件通过 |
| 遗留问题 | `reports/acceptance/open-issues.md` | `<run_id>` | 记录非阻断问题和后续入口 |

### 7.3 基线变更规则

| 变更类型 | 处理规则 | 是否需要重验 |
|---|---|---|
| 00~05 任一文档版本变化 | 重新确认影响范围,更新验收基线和对应门禁 | 视影响范围 |
| 实现 commit 变化 | 重新绑定 package candidate、build artifact 和测试 run | 是 |
| 上游 core / bus dependency 变化 | 重跑 contract、semantic、event、compatibility 相关 gate | 是 |
| config_profile 或配置 artifact 变化 | 重跑配置、runtime graph、boundary、redaction 相关用例 | 是 |
| package candidate id / package version 变化 | 重跑 candidate、docs、smoke、compatibility gate | 是 |
| test_run_id 变化 | 更新证据归档基线和测试结果引用 | 是 |
| EV 证据路径变化 | 更新证据索引,确认 redaction 和完整性 | 视证据内容 |
| S0 / S1 缺陷状态变化 | 重跑对应复验用例和 candidate gate | 是 |

### 7.4 不可接受基线写法

| 禁止写法 | 原因 |
|---|---|
| 最新版本 | 不可复查 |
| 当前 commit | 验收后会漂移 |
| 当前 CI | 无法定位 run |
| 当前配置 | 无法复现 |
| 测试通过的那一版 | 循环定义,不能作为裁决基线 |
| `artifacts/test/<project>/<run_id>` | 违反当前 artifact 路径规范 |
| `reports/<project>` | 违反当前 report 路径规范 |

---

## 8. 回填草稿

> 校准来源：
> - `design-calibration/06_acceptance_step_03_baseline.md`
>
> 延伸阅读：
> - 建议继续阅读上述中间产物的“验收基线表”“artifact / report / acceptance handoff 基线表”“基线变更规则”和“不可接受基线写法”小节,了解本章如何避免“最新版本”式不可复查基线。

本轮验收不得使用“最新版本”“当前 commit”“当前 CI”作为基线。验收基线必须可定位、可复查、可复现。

文档基线固定为 `00-需求文档.md` v0.2.0、`01-架构设计.md` v0.2.0、`02-概要设计.md` v0.2.0、`03-详细设计.md` v0.2.0、`04-配置设计.md` v0.1.0 和 `05-测试方案.md` v0.2.0。实现仓 commit、package version、candidate id、dependency snapshot、config artifact fingerprint、固定 `<run_id>` 和报告路径必须由送验说明或 `reports/acceptance/handoff.md` 补齐。

正式验收只接受 `artifacts/test/<run_id>`、`reports/runs/<run_id>` 和 `reports/acceptance` 作为证据入口。不得使用 `latest`、`artifacts/test/<project>/<run_id>`、`reports/<project>`、mutable image tag、当前最新提交或本机当前状态作为正式验收基线。

---

## 9. 待确认事项

- 是否接受文档基线先固定版本,实现仓 commit / package version / candidate id / run_id 在送验时补齐。
- 是否接受无真实测试 run 时,06 只定义验收标准,不得形成通过结论。
- 是否接受任一送验 commit、上游 dependency、配置 profile 或 package candidate 变化都必须重新绑定证据并视影响重验。

---

## 10. 进入下一步条件

- [x] 基线可定位、可复查。
- [x] 已明确哪些基线当前可固定,哪些必须实施期补齐。
- [x] 已排除“最新版本 / 当前 commit / 当前 CI / latest”写法。
- [x] 已固定 artifact / report / acceptance handoff 的合法路径。
- [x] 可以进入 Step 4 定义进入条件与退出条件。
