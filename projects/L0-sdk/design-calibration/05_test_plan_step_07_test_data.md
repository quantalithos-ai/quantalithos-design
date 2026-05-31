# L0-sdk 05 测试方案 Step 7:设计测试数据

> 所属流程:`05_test_plan_calibration_flow.md`
> 对应正式文档:`projects/L0-sdk/05-测试方案.md` §7 测试数据设计
> 状态:已完成
> 日期:2026-05-31

---

## 1. Step 状态

| 项 | 内容 |
|---|---|
| Step | Step 7 |
| 主题 | 设计测试数据 |
| 当前状态 | 已完成 |
| 是否修改正式 `05-测试方案.md` | 否 |
| 产物位置 | `projects/L0-sdk/design-calibration/05_test_plan_step_07_test_data.md` |

本步定义 P0 用例所需测试数据如何构造、隔离、复用和清理。环境 profile、配置矩阵和 CI 命令分别留给 Step 8 和 Step 9。

## 2. 本步输入

| 输入 | 本步使用方式 |
|---|---|
| `05_test_plan_step_06_cases.md` | 继承 `TC-SDK-*` 用例的数据前置条件 |
| `03-详细设计.md` §7~§15 | 继承 DTO、状态、错误、事务、幂等、观测和脚本契约 |
| `04-配置设计.md` §7~§12 | 继承配置项、敏感配置、加载校验、失效模式和下游测试承接 |

## 3. SOP 问题回答

### 3.1 哪些基础数据必须存在?

| 基础数据 | 支撑用例 | 必须包含 |
|---|---|---|
| upstream snapshot fixture | `TC-SDK-CONTRACT-*` | core contract ref、bus semantic ref、formal API snapshot ref、digest、version |
| semantic baseline fixture | `TC-SDK-SEMANTIC-*` | baseline version、Rust / Python / TypeScript language set、capability model、concept map |
| service boundary fixture | `TC-SDK-BOUNDARY-*` | `ServiceCapabilityRef`、`CapabilitySupportState`、fake marker、diagnostic ref |
| event semantic fixture | `TC-SDK-EVENT-*` | SDK event name、bus semantic ref、payload ref、mapping version |
| policy fixture | `TC-SDK-TRACE-*`、`TC-SDK-SECURITY-*` | error mapping sample、trace context sample、redaction rule、credential ref sample |
| config fixture | `TC-SDK-SECURITY-*` | valid config、invalid config、strict JSON、source priority samples |
| candidate fixture | `TC-SDK-CANDIDATE-*` | candidate id、candidate version、language artifact metadata、artifact digest |
| docs / smoke fixture | `TC-SDK-DOCS-*`、`TC-SDK-SMOKE-*` | quickstart sample、docs example sample、runner result sample |
| compatibility fixture | `TC-SDK-COMPAT-*` | compatibility decision input、deprecated API ref、migration guide ref |

### 3.2 哪些边界、异常、并发和恢复数据必须构造?

| 数据类型 | 构造目的 | 代表样本 |
|---|---|---|
| source failure data | 触发 `Dependency` / `Validation` | unreadable source ref、digest mismatch、stale snapshot |
| drift data | 触发 semantic consistency failure | language surface missing concept、different error shape |
| boundary failure data | 验证 fake / formal / bus boundary 失败不写 truth | unsupported capability、fake marker missing、mapping missing |
| forbidden body data | 验证 raw body / payload body 被拒绝 | synthetic payload body marker、synthetic request body marker |
| sensitive data | 验证 secret / credential 禁止输出 | synthetic secret marker、synthetic token marker、credential value marker |
| evidence failure data | 验证 failed / skipped / unredacted 不支撑 stable | failed runner result、skipped result、unredacted marker |
| migration failure data | 验证 migration ref 必填 | `RequiresMigration` without `MigrationGuideRef` |
| concurrency data | 验证 expected version 和幂等冲突 | same idempotency key same digest、same key different digest、same version writes |
| recovery data | 验证 retry / duplicate / rebuild | duplicate event id、pending outbox event、missing projection |

### 3.3 数据如何隔离不同测试运行?

| 隔离维度 | 规则 |
|---|---|
| `run_id` | 每次测试运行必须生成唯一 `run_id`，用于 artifact、report、job、event 和 idempotency namespace |
| path root | artifacts 使用 `artifacts/test/<run_id>`，reports 使用 `reports/runs/<run_id>` |
| object id | candidate、baseline、evidence、decision、deprecated record 均使用带 `run_id` 前缀或命名空间的 id |
| idempotency key | key 必须包含 operation scope + `run_id` + case id |
| event id | inbound / outbound event 使用 case scoped event id，不跨用例复用 |
| in-memory store | 每个 test case 或 test suite 独立初始化 store，不能共享可变 truth |
| filesystem store | 每个 run 使用独立临时 root，禁止写入全局默认目录 |

### 3.4 数据如何清理?

| 数据位置 | 清理规则 |
|---|---|
| in-memory store | 每个用例结束后 drop runtime 或 reset store |
| temporary source / boundary fixture | 用例结束后删除临时目录或重置 fake adapter state |
| artifacts | `artifacts/test/<run_id>` 在报告生成前保留，报告归档完成后可按实施策略清理 |
| reports | `reports/runs/<run_id>` 作为人工可读证据默认保留，不由单测自动删除 |
| outbox / projection local root | 每个 run 独立 root，测试结束可整体删除 |
| synthetic sensitive samples | 不得进入 reports / evidence 正文；只允许在临时输入和扫描器测试中出现 |

### 3.5 哪些外部依赖使用 fake / stub / real-like?

| 外部依赖 | P0 数据策略 |
|---|---|
| `L0-core` contracts | 使用本地 path 或 fixture snapshot，不复制 core truth |
| `L0-bus` contracts / semantic | 使用本地 path 或 fixture semantic snapshot，不实现 bus runtime |
| formal API | 默认使用 fixture snapshot；runtime call 可用 fake / real-like boundary |
| fake / fixture endpoint | P0 默认可用，必须保留 fake marker |
| bus event boundary | 使用 fake / fixture boundary，验证 ref / digest / failure semantics |
| runners | 使用 local stub / local process runner，返回 deterministic result |
| public registry | 不使用；不可用不影响 P0 |
| credential provider | P0 不接入真实 provider，只使用 credential ref / fake ref |

## 4. 当前文档问题诊断

| 文档 | 诊断 |
|---|---|
| 当前旧 `05-测试方案.md` | 旧数据设计停留在 proto-ref、artifact、auth、subscription、release manifest 样本，不覆盖新版状态、证据、配置和报告路径 |
| `03-详细设计.md` | 已定义 DTO、状态、事务和脚本契约，但未定义测试数据集 |
| `04-配置设计.md` | 已定义配置项和敏感边界，测试数据必须避免 raw secret 进入证据输出 |

## 5. 改动前后对比

| 对比项 | 改动前 | 改动后 |
|---|---|---|
| 数据主线 | contract lock、wrapper、subscription、release manifest | snapshot、semantic baseline、boundary、event、policy、candidate、evidence、docs、compatibility、config |
| 隔离方式 | 未统一 | 统一使用 `run_id`、case id、isolated root 和 scoped idempotency key |
| 敏感样本 | 可能进入错误 / report snapshot | 只允许 synthetic marker 进入临时输入，输出必须被 redaction gate 拦截 |
| 外部依赖 | fake / real 边界不清 | P0 以 fixture / fake / local stub 为主，public registry 和真实 credential provider 不进入 |

## 6. 测试设计取舍

| 取舍 | 结论 | 原因 |
|---|---|---|
| 是否使用人工临时造数 | 不允许 | 测试数据必须可重复生成 |
| 是否保留 generated artifacts | 保留到报告生成完成 | artifacts 是验收证据来源 |
| 是否使用真实 secret | 不允许 | P0 只能使用 synthetic marker 和 credential ref |
| 是否依赖真实 production endpoint | 不依赖 | P0 用 fake / fixture / real-like boundary 验证最小接入 |
| 是否在本步写具体 JSON 文件内容 | 不写完整文件 | Step 7 定义数据集和规则，具体 fixture 文件由实施阶段按本表生成 |

## 7. 结构化中间产物

### 7.1 测试数据集表

| 数据集 | 用途 | 构造方式 | 隔离键 | 清理方式 | 关联用例 |
|---|---|---|---|---|---|
| `DS-SDK-UPSTREAM` | upstream snapshot 和 freshness | fixture builder 生成 refs / digest / versions | `run_id + source_kind` | 删除临时 source root | `TC-SDK-CONTRACT-*` |
| `DS-SDK-SEMANTIC` | baseline、capability、concept map | deterministic builder | `run_id + baseline_id` | reset in-memory store | `TC-SDK-SEMANTIC-*` |
| `DS-SDK-BOUNDARY` | service / fake boundary | fake adapter seed | `run_id + capability_id` | reset adapter state | `TC-SDK-BOUNDARY-*` |
| `DS-SDK-EVENT` | bus event mapping | fixture semantic mapping | `run_id + event_name` | reset event boundary | `TC-SDK-EVENT-*` |
| `DS-SDK-POLICY` | error / trace / redaction / credential | policy sample builder | `run_id + policy_id` | discard temporary inputs | `TC-SDK-TRACE-*`、`TC-SDK-SECURITY-*` |
| `DS-SDK-CONFIG` | config validation | valid / invalid config fixture builder | `run_id + config_case` | delete temp config root | `TC-SDK-SECURITY-*` |
| `DS-SDK-CANDIDATE` | package candidate and artifact metadata | candidate builder + artifact metadata builder | `run_id + candidate_id` | artifacts retained until report | `TC-SDK-CANDIDATE-*` |
| `DS-SDK-DOCS` | quickstart and docs examples | docs fixture builder | `run_id + docs_case` | reports retained | `TC-SDK-DOCS-*` |
| `DS-SDK-SMOKE` | cross-language smoke evidence | runner result fixture | `run_id + smoke_case` | artifacts retained until report | `TC-SDK-SMOKE-*` |
| `DS-SDK-COMPAT` | compatibility / deprecated | compatibility fixture builder | `run_id + decision_id` | reset in-memory store | `TC-SDK-COMPAT-*` |
| `DS-SDK-CONCURRENCY` | idempotency / expected version / duplicate event | deterministic conflict builder | `run_id + operation_scope` | reset store | concurrency cases in Step 6 |
| `DS-SDK-OBSERVABILITY` | logs / audit / report scan | safe log / audit fixture builder | `run_id + artifact_root` | report retention policy | `TC-SDK-SECURITY-004` |

### 7.2 Fixture / builder / seed 规则

| 规则 | 要求 |
|---|---|
| deterministic builder | 同一 `run_id + case_id` 必须生成可预测 id、ref、digest 和 timestamps |
| no real secret | 所有敏感输入必须使用 synthetic marker，不得使用真实 token、password、private key 或 credential value |
| ref-only output | evidence、logs、reports、outbox event 只能输出 ref、digest、status、marker 和 safe summary |
| case scoped mutation | 每个用例只修改自己命名空间下的数据 |
| negative data explicit | 负向样本必须显式标记为 invalid / forbidden / unavailable / stale / skipped |
| fake marker required | fake endpoint、fake credential、fake boundary result 必须带 marker |
| artifact digest required | package artifact、runner artifact、report input 必须带 digest 或 fingerprint |

## 8. 回填草稿

以下内容供 Step 15 汇总正式 `05-测试方案.md` §7 时摘录。

```markdown
## 7. 测试数据设计

> 校准来源：
> - `design-calibration/05_test_plan_step_07_test_data.md`

本轮测试数据按 `DS-SDK-*` 数据集组织，覆盖 upstream snapshot、semantic baseline、boundary、event、policy、config、candidate、docs、smoke、compatibility、concurrency 和 observability。所有数据必须通过 fixture / builder / seed 规则可重复生成，不允许人工临时造数。

所有测试运行必须使用 `run_id` 隔离 object id、idempotency key、event id、artifact root 和 report root。P0 不使用真实 secret、真实 credential provider 或 public registry；敏感负向样本只能以 synthetic marker 进入临时输入，并必须被 redaction / forbidden body gate 拦截。
```

## 9. 待确认事项

| 事项 | 建议方案 | 原因 |
|---|---|---|
| 是否保留 artifacts 到测试结束后 | 是,至少保留到报告生成完成 | artifacts 是 `EV-SDK-*` 证据来源 |
| 是否把 fixture 文件名固定在本步 | 不固定 | 文件布局和命令由实施计划和实现仓决定 |
| 是否需要真实 service endpoint 数据 | 不需要 P0 | P0 使用 fake / fixture / real-like boundary |

## 10. 进入下一步条件

| 条件 | 状态 |
|---|---|
| P0 基础数据集已定义 | 已满足 |
| 边界、异常、并发和恢复数据已定义 | 已满足 |
| 数据隔离规则已定义 | 已满足 |
| 数据清理规则已定义 | 已满足 |
| fake / stub / real-like 依赖策略已定义 | 已满足 |

Step 8 可以在本文件被确认后开始,主题是设计测试环境与配置矩阵。
