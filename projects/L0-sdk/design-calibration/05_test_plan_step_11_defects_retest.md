# L0-sdk 05 测试方案 Step 11:定义缺陷管理与复验规则

> 所属流程:`05_test_plan_calibration_flow.md`
> 对应正式文档:`projects/L0-sdk/05-测试方案.md` §11 缺陷管理与复验规则
> 状态:已完成
> 日期:2026-05-31

---

## 1. Step 状态

| 项 | 内容 |
|---|---|
| Step | Step 11 |
| 主题 | 定义缺陷管理与复验规则 |
| 当前状态 | 已完成 |
| 是否修改正式 `05-测试方案.md` | 否 |
| 产物位置 | `projects/L0-sdk/design-calibration/05_test_plan_step_11_defects_retest.md` |

本步定义缺陷分级、风险接受、修复后复验范围、关闭证据和防回归自动化要求。进入 / 退出准则留给 Step 12,报告归档结构留给 Step 13。

## 2. 本步输入

| 输入 | 本步使用方式 |
|---|---|
| `05_test_plan_step_02_scope.md` | 提取 P0 / P1 / P2、Forbidden 和一票否决范围 |
| `05_test_plan_step_06_cases.md` | 提取 `TC-SDK-*` 用例、负向场景、状态非法迁移和证据 ID |
| `05_test_plan_step_09_automation_ci_gates.md` | 提取 PR / main / nightly / candidate gate 和阻断级别 |
| `05_test_plan_step_10_special_nonfunctional.md` | 提取专项红线、非功能验证和证据来源 |
| `03-详细设计.md` §10~§15 | 提取事务、一致性、错误、幂等、配置、观测和脚本契约 |

## 3. SOP 问题回答

### 3.1 哪些缺陷属于 S 级阻断?

| S 级阻断缺陷 | 触发条件 | 代表用例 / 专项 |
|---|---|---|
| 双 truth | SDK 重定义 core / bus contract、event semantic、delivery truth 或 formal API truth | `TC-SDK-CONTRACT-*`、`TC-SDK-EVENT-*` |
| 三语言语义漂移 | Rust / Python / TypeScript 核心概念、错误、trace、redaction 或 event view 含义不一致 | `TC-SDK-SEMANTIC-*`、`TC-SDK-SMOKE-*` |
| 最小接入不可运行 | local package candidate、quickstart、docs、fake / fixture target 或 smoke 不可运行 | `TC-SDK-DOCS-*`、`TC-SDK-SMOKE-*` |
| 敏感泄露 | raw secret、credential value、request / response / payload body 进入日志、错误、evidence、report 或 artifact | `TC-SDK-SECURITY-*`、`SPECIAL-SDK-SEC-*` |
| fake 污染 production | fake result 被标记为 production supported 或支撑 `Stable` | `TC-SDK-BOUNDARY-003`、`TC-SDK-CANDIDATE-*` |
| 未验证 candidate 进入 `Stable` | freshness、evidence、redaction、compatibility 任一条件缺失仍进入 `Stable` | `TC-SDK-CANDIDATE-*`、`TC-SDK-COMPAT-*` |
| 配置绕过门禁 | 配置关闭 redaction、credential protection、fake marker、compatibility gate 或启用 unsupported P0 remote config | `TC-SDK-SECURITY-*`、`SPECIAL-SDK-CONFIG-001` |
| 只读 / runtime 边界写 truth | Query、projection rebuild、runtime boundary call 写入 SDK truth | `TC-SDK-BOUNDARY-*`、`SPECIAL-SDK-CONSISTENCY-001` |

### 3.2 哪些缺陷可以风险接受?

| 缺陷类型 | 是否可风险接受 | 条件 |
|---|---|---|
| S0 / 一票否决缺陷 | 不可接受 | 必须修复并复验通过 |
| P0 自动化 gate 失败 | 默认不可接受 | 只有明确证明是基础设施故障且重跑通过,才能不按业务缺陷关闭 |
| P1 staging-like endpoint 不可用 | 可接受 | 不影响 P0,必须记录风险和后续 owner |
| P2 remote config / hot reload / registry / gateway 缺失 | 可接受 | 已在范围中定义为非 P0,不得影响 P0 判断 |
| 未固定性能微基准阈值 | 可接受 | 测量点存在,且 SDK 未成为最小路径主要瓶颈 |
| 文档措辞不清但不影响实现契约 | 可接受或低级缺陷 | 不得影响状态、DTO、用例、证据和验收判断 |

### 3.3 修复后必须回归哪些用例?

| 修复区域 | 必须回归 |
|---|---|
| contract / DTO / event / job schema | `TC-SDK-CONTRACT-*`、`TC-SDK-EVENT-*`、PR contract suite |
| semantic baseline / language surface | `TC-SDK-SEMANTIC-*`、`TC-SDK-SMOKE-*`、candidate smoke |
| boundary / fake marker / runtime call | `TC-SDK-BOUNDARY-*`、`TC-SDK-EVENT-*`、boundary policy专项 |
| redaction / credential / forbidden body | `TC-SDK-SECURITY-*`、`SPECIAL-SDK-SEC-*`、redaction check |
| candidate / evidence / compatibility | `TC-SDK-CANDIDATE-*`、`TC-SDK-DOCS-*`、`TC-SDK-SMOKE-*`、`TC-SDK-COMPAT-*` |
| transaction / idempotency / outbox / projection | `SPECIAL-SDK-CONSISTENCY-001`、`SPECIAL-SDK-IDEMPOTENCY-001`、`SPECIAL-SDK-RECOVERY-001` |
| config load / validate / runtime builder | `TC-SDK-SECURITY-001~002`、`SPECIAL-SDK-CONFIG-001` |
| observability / audit / reports | `SPECIAL-SDK-OBS-001`、report completeness check、redaction scan |

### 3.4 缺陷关闭需要哪些证据?

| 证据 | 要求 |
|---|---|
| failing evidence | 保留首次失败的 `run_id`、suite、case id、artifact path、report path |
| fix evidence | 记录修复后的 `run_id`、复验 suite、case id 和通过结果 |
| impact analysis | 说明影响的需求、设计章节、用例族、配置或脚本 |
| regression evidence | 对应回归用例和专项必须重新通过 |
| redaction evidence | 涉及安全 / report / artifact 的缺陷必须附 forbidden field scan 结果 |
| risk acceptance record | 仅适用于可接受缺陷;必须有 owner、原因、到期条件和后续处理入口 |

### 3.5 是否需要新增自动化防回归?

| 缺陷类型 | 是否必须新增自动化 |
|---|---|
| S0 / 一票否决缺陷 | 必须新增或扩展自动化,防止同类缺陷复发 |
| P0 gate 业务断言失败 | 必须新增或修正自动化 |
| flaky / timeout | 必须新增隔离、超时或稳定性检查 |
| P1 / P2 风险接受 | 视风险决定,至少需要风险追踪 |
| 纯文档措辞缺陷 | 不强制新增自动化,但若影响实现理解应补文档一致性检查 |

## 4. 当前文档问题诊断

| 文档 | 诊断 |
|---|---|
| 当前旧 `05-测试方案.md` | 缺陷分级未绑定新版一票否决、gate、证据和复验规则 |
| `05_test_plan_step_02_scope.md` | 已定义 Forbidden / 一票否决,但还未转成缺陷处理规则 |
| `05_test_plan_step_06_cases.md` | 已定义用例和证据,但还未定义修复后回归范围 |
| `05_test_plan_step_10_special_nonfunctional.md` | 已定义专项红线,本步需要明确这些红线缺陷不得降级 |

## 5. 改动前后对比

| 对比项 | 改动前 | 改动后 |
|---|---|---|
| 缺陷等级 | 泛化严重 / 普通缺陷 | S0 / S1 / S2 / S3 与 P0 / P1 / P2 / Forbidden 绑定 |
| 一票否决处理 | 可能被当作普通风险 | 明确不可风险接受、不可降级 |
| 复验范围 | 修哪里测哪里 | 按影响区域回归对应用例族、专项和 gate |
| 关闭证据 | 可能只看修复说明 | 必须保留失败证据、修复证据、影响分析和回归证据 |
| 防回归 | 未系统要求 | S0 / P0 业务缺陷必须新增或修正自动化 |

## 6. 测试设计取舍

| 取舍 | 结论 | 原因 |
|---|---|---|
| 是否允许 S0 缺陷风险接受 | 不允许 | 一票否决缺陷直接破坏 P0 核心闭环 |
| 是否允许基础设施故障按业务缺陷处理 | 不直接按业务缺陷处理 | 但必须保留失败 artifact 并用重跑证据证明 |
| 是否所有缺陷都要求新增自动化 | 不要求 | S0 / P0 业务断言必须新增;低风险文档缺陷可不新增 |
| 是否把 P1/P2 失败作为 P0 退出阻断 | 不作为 P0 阻断 | 但必须记录风险 owner 和后续入口 |

## 7. 结构化中间产物

### 7.1 缺陷分级表

| 级别 | 定义 | 示例 | 处理要求 | 是否阻断 |
|---|---|---|---|---|
| S0 | 一票否决或 P0 核心闭环被破坏 | 双 truth、敏感泄露、未验证 stable、只读写 truth | 立即修复;必须复验;必须新增 / 修正自动化 | 是 |
| S1 | P0 用例或 gate 失败,但不属于一票否决 | DTO 缺字段、runner failed、config fail-fast 缺失 | 当前迭代修复;复跑相关 suite | 是 |
| S2 | P1 接缝、staging-like 或后续扩展风险 | staging endpoint unavailable、真实 credential provider 未接入 | 可风险接受;记录 owner 和后续计划 | 不阻断 P0 |
| S3 | 文档、报告展示或低风险可维护性问题 | 文案不清、报告字段排序不一致 | 排期修复;不影响证据裁决 | 不阻断 P0 |

### 7.2 复验规则表

| 缺陷影响面 | 最小复验 | 扩展复验 |
|---|---|---|
| one-vote / S0 | 相关 `TC-SDK-*` + 对应专项 + candidate gate | 全量 PR gate + main gate |
| protocol / DTO | contract suite + affected service test | language package surface smoke |
| security / redaction | security cases + redaction check | candidate gate + report completeness |
| candidate / evidence / compatibility | candidate cases + docs / smoke / compat | nightly compatibility regression |
| consistency / recovery | consistency / idempotency / recovery专项 | nightly concurrency |
| config | config negative cases + runtime builder | PR config suite + main integration |
| observability / report | observability专项 + report check | acceptance summary generation |

### 7.3 缺陷处理流

```text
[failure detected]
        |
        v
[classify S0 / S1 / S2 / S3]
        |
        +-- S0 / S1 --> [fix required]
        |                  |
        |                  v
        |          [rerun required cases]
        |                  |
        |                  v
        |          [attach evidence and close]
        |
        +-- S2 / S3 --> [risk acceptance or scheduled fix]
                           |
                           v
                  [owner + reason + follow-up]
```

说明:

- S0 不允许走风险接受分支。
- 所有关闭动作都必须能回到 `run_id`、case id、artifact 和 report。
- 复验失败时必须重新打开缺陷或创建关联缺陷。

## 8. 回填草稿

以下内容供 Step 15 汇总正式 `05-测试方案.md` §11 时摘录。

```markdown
## 11. 缺陷管理与复验规则

> 校准来源：
> - `design-calibration/05_test_plan_step_11_defects_retest.md`

缺陷分为 S0、S1、S2、S3。S0 表示一票否决或 P0 核心闭环被破坏,包括双 truth、三语言语义漂移、最小接入不可运行、敏感泄露、fake 污染 production、未验证 candidate 进入 `Stable`、配置绕过门禁、只读 / runtime 边界写 truth。S0 不允许风险接受,必须修复、复验并新增或修正自动化防回归。

缺陷关闭必须保留失败证据、修复证据、影响分析和回归证据。涉及安全、报告、artifact 或 evidence 的缺陷必须附 redaction / forbidden field scan 结果。P1 / P2 缺陷可以风险接受,但必须记录 owner、原因、到期条件和后续处理入口,不得影响 P0 退出判断。
```

## 9. 待确认事项

| 事项 | 建议方案 | 原因 |
|---|---|---|
| 是否允许 S0 风险接受 | 不允许 | S0 对应一票否决或 P0 核心闭环破坏 |
| 基础设施故障是否可关闭 | 可关闭,但必须有重跑通过证据 | 防止把真实业务失败伪装成环境波动 |
| S1 是否必须新增自动化 | 如果是业务断言缺口,必须新增或修正自动化 | 防止同类 P0 缺陷复发 |
| S2 / S3 是否阻断 P0 | 不阻断 P0 | 但必须进入风险登记或后续计划 |

## 10. 进入下一步条件

| 条件 | 状态 |
|---|---|
| S 级阻断缺陷已定义 | 已满足 |
| 可风险接受缺陷已定义 | 已满足 |
| 修复后回归范围已定义 | 已满足 |
| 缺陷关闭证据已定义 | 已满足 |
| 自动化防回归规则已定义 | 已满足 |
| 缺陷分级和复验规则可执行 | 已满足 |

Step 12 可以在本文件被确认后开始,主题是定义进入准则与退出准则。
