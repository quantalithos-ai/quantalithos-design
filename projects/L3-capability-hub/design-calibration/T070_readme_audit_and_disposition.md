# T070 README 审计与处置

> 目标项目：`L3-capability-hub`
> 任务：对 README 与 active formal `00~07` 基线进行一致性审计，并决定 README 是否需要重写。
> 当前状态：completed

## 1. 输入与优先级

| 输入 | 处置 |
|---|---|
| `projects/L3-capability-hub/README.md` | 旧仓级说明，只作为 historical material 和冲突诊断输入。 |
| `projects/L3-capability-hub/00-需求文档.md` 至 `07-实施计划.md` | active formal authority；README 不得覆盖这些文档的职责、对象、边界或状态。 |
| `design-calibration/00_requirements_calibration_flow.md` | 提供旧 README 的历史降级结论和当前需求主轴。 |
| `design-calibration/01_architecture_calibration_flow.md` | 提供系统上下文、依赖方向和责任红线。 |
| `design-calibration/07_implementation_plan_calibration_flow.md` | 提供实施移交入口、真实性边界和 implementation ledger 入口。 |

## 2. 历史冲突清单

| 旧 README 口径 | 当前处置 | 原因 |
|---|---|---|
| MCP 白名单是 runtime 调用必经 hub | 删除为当前职责；保留为历史冲突记录 | registry 不等于 runtime allowlist 或 execution gateway。 |
| `Provider Contract`、API key、配额、成本记账 | 删除为当前职责；保留为历史冲突记录 | descriptor 只表达接入描述和安全引用，不拥有 provider route/quota/cost/secret truth。 |
| LLM routing | 删除为当前职责 | 路由和执行属于 runtime/provider 边界。 |
| Policy 下发更新白名单 | 改为 governance/policy result seam 的引用边界 | governance approval / policy effective truth 归 `L1-governance`。 |
| KMS/Vault、密钥加密存储 | 删除为当前职责 | secret/KMS 平台不属于 Hub truth。 |
| marketplace 发布或注册 | 删除为当前职责 | listing、交易、定价和履约归 marketplace。 |
| 所有外部调用在本仓审计并记账 | 删除为当前职责 | execution、cost、observability backend truth 不由 Hub 承担。 |
| `src/mcp_registry`、`provider_contract`、`cost_accounting`、`llm_router` 等目录承诺 | 删除为当前目录承诺 | active formal `07` 以 phase/boundary 和未来实现仓合同为准，README 不预设代码布局。 |

## 3. 当前 README 允许表达的内容

README 只保留以下仓级导航信息：

1. 项目身份和当前设计状态。
2. capability identity、capability registry、adapter descriptor 三条核心主线。
3. governance/policy approval seam、method-library asset relation、SDK exposure boundary 三条跨仓接缝。
4. 明确排除 runtime/tools execution、governance approval truth、method body/source、marketplace、provider route/quota/cost/secret、SDK client/cache 和 observability backend truth。
5. active formal `00~07`、calibration flow、project ledger、implementation ledger 和 26 个 boundary skeleton 的入口。
6. 当前实施真实性：target implementation repo 未建立，未有 implementation commit、run、artifact、report、evidence、verdict 或 signoff。

README 不定义 Rust type、field、enum、Port、配置 key、测试 case、验收阈值、commit hash 或运行结果；这些内容必须回到对应 formal/calibration source。

## 4. 决策

旧 README 与 active formal baseline 冲突，不能沿用。T070 重写 README 为导航型仓说明，并将旧使命、旧职责、旧目录和旧维护纪律视为 historical material；不建立同义 alias，也不把历史职责迁移回正式文档。

## 5. 完成条件

| 条件 | 状态 |
|---|---|
| 旧职责冲突已逐项记录 | completed |
| README 指向 active formal `00~07` | completed after rewrite |
| README 明确责任排除 | completed after rewrite |
| README 不伪造实现事实 | completed after rewrite |
| implementation ledger / boundary skeleton 入口已列出 | completed after rewrite |
| upstream blocker | 0 |
| commit required | historical snapshot: `no`; superseded by explicit three-group design-repository commit authorization on 2026-07-27 |
