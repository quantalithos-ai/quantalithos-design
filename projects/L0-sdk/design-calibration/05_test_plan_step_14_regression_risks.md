# L0-sdk 05 测试方案 Step 14:定义回归策略与残余风险

> 所属流程:`05_test_plan_calibration_flow.md`
> 对应正式文档:`projects/L0-sdk/05-测试方案.md` §14 回归策略与残余风险
> 状态:已完成
> 日期:2026-05-31

---

## 1. Step 状态

| 项 | 内容 |
|---|---|
| Step | Step 14 |
| 主题 | 定义回归策略与残余风险 |
| 当前状态 | 已完成 |
| 是否修改正式 `05-测试方案.md` | 否 |
| 产物位置 | `projects/L0-sdk/design-calibration/05_test_plan_step_14_regression_risks.md` |

本步定义哪些变更触发哪些回归,以及当前测试方案没有覆盖的风险如何记录、缓解和转入验收。正式 `05-测试方案.md` 仍不修改,Step 15 再统一重建。

## 2. 本步输入

| 输入 | 本步使用方式 |
|---|---|
| `05_test_plan_step_02_scope.md` | 继承 P0 / P1 / P2、非范围、一票否决和残余风险 |
| `05_test_plan_step_06_cases.md` | 继承 `TC-SDK-*` 用例族和关键断言 |
| `05_test_plan_step_09_automation_ci_gates.md` | 继承 PR / main / nightly / candidate gate 分层 |
| `05_test_plan_step_11_defects_retest.md` | 继承缺陷复验和自动化防回归规则 |
| `05_test_plan_step_13_reports_evidence.md` | 继承证据归档、风险接受报告和验收交接报告位置 |
| `00-需求文档.md` ~ `04-配置设计.md` | 作为判断变更影响面的上游契约来源 |

## 3. SOP 问题回答

### 3.1 哪些变更触发最小回归?

| 变更类型 | 最小回归集 |
|---|---|
| domain object / enum / policy 变更 | `SUITE-SDK-PR-UNIT` + 相关 `TC-SDK-*` |
| DTO / event / job schema 变更 | `SUITE-SDK-PR-CONTRACT` + schema roundtrip |
| application service 编排变更 | `SUITE-SDK-PR-SERVICE` + affected flow cases |
| config loader / validator / builder 变更 | `SUITE-SDK-PR-CONFIG` + `SPECIAL-SDK-CONFIG-001` |
| redaction / credential / boundary guard 变更 | `TC-SDK-SECURITY-*` + `scripts/checks/check_redaction.sh` |
| source / boundary / runner adapter 变更 | main integration suite + affected boundary / event cases |
| package candidate / docs / smoke runner 变更 | candidate build / docs / smoke suite |
| compatibility / deprecated 规则变更 | `TC-SDK-COMPAT-*` + nightly compatibility regression |
| artifact / report 路径或脚本变更 | report check + artifact path check + Step 13 evidence mapping |

### 3.2 哪些变更触发全量回归?

| 触发条件 | 全量回归范围 |
|---|---|
| P0 需求、业务规则或一票否决项变更 | 全部 `TC-SDK-*` + `SPECIAL-SDK-*` + PR / main / candidate gate |
| `03-详细设计.md` 的状态 enum、DTO、函数流、事务或错误契约变更 | PR / main / candidate gate + affected nightly suite |
| `04-配置设计.md` profile、配置项、敏感边界或 fail-fast 规则变更 | PR config + main integration + candidate gate |
| L0-core / L0-bus contract package 版本或语义变更 | contract / semantic / event / smoke 全量回归 |
| evidence / redaction / report 目录规则变更 | redaction check + report completeness + acceptance summary |
| 发现 S0 缺陷并修复 | 相关最小回归 + PR / main / candidate gate;必要时 nightly |

### 3.3 哪些风险暂不覆盖?

| 风险 | 暂不覆盖原因 |
|---|---|
| public registry 正式发布、签名、撤回和回滚 | P1/P2 release / operations 专项,当前 P0 只验证 local candidate |
| production formal API endpoint 全集 | 当前只验证最小 formal / fake boundary,全量服务覆盖依赖各服务 formal API 稳定 |
| 真实 credential provider / KMS / Vault | P0 只验证 ref-only 和 raw secret 禁止,不接入真实 secret provider |
| remote config / hot reload / admin override | P0 明确拒绝或 unsupported,不验证在线变更一致性 |
| MCP / REST / GraphQL / REPL / offline cache | 生态增强能力,当前不作为 SDK 核心闭环 |
| 固定微基准阈值 | 需求阶段只要求可测量和不成为明显瓶颈 |
| 全量 L1/L2/L3/L4 client coverage | 当前只验证 official SDK 最小接入和封装边界 |

### 3.4 谁接受残余风险?

| 风险类别 | 接受人 |
|---|---|
| public registry / release operations | release / operations owner |
| production formal API endpoint coverage | service capability owner |
| real credential provider | security reviewer |
| remote config / hot reload | configuration owner |
| gateway / MCP / REST / GraphQL / REPL / offline cache | architecture owner |
| fixed performance threshold | SDK maintainer + acceptance owner |
| full service client coverage | SDK maintainer + service capability owner |

正式验收前,`reports/acceptance/risk-acceptance.md` 必须记录实际接受人、原因、到期条件和后续入口。

### 3.5 哪些风险必须转入验收标准?

| 风险 | 验收标准承接方式 |
|---|---|
| 一票否决项 | 进入 `06-验收标准.md` veto checklist |
| public registry 非 P0 | 验收明确 local candidate 通过不等同公网发布 |
| fake / fixture 不等同 production support | 验收明确 fake marker 必须保留 |
| 性能阈值未固定 | 验收明确必须有测量点,不得声明微基准达标 |
| P1/P2 未覆盖项 | 验收明确不作为 P0 失败,但必须有风险接受记录 |
| report / artifact 安全 | 验收明确 raw secret / body 泄露次数为 0 |

## 4. 当前文档问题诊断

| 文档 | 诊断 |
|---|---|
| 当前旧 `05-测试方案.md` | 没有按新版变更影响面定义回归触发,残余风险也没有接受人 |
| Step 2 | 已列出非范围和残余风险,但还未定义验收承接 |
| Step 9 | 已定义自动化 gate,本步需要说明变更如何触发 gate |
| Step 11 | 已定义缺陷复验,本步需要把复验规则扩展为回归策略 |
| Step 13 | 已定义风险接受报告,本步需要指定风险记录内容 |

## 5. 改动前后对比

| 对比项 | 改动前 | 改动后 |
|---|---|---|
| 回归触发 | 按经验判断 | 按变更类型映射最小回归和全量回归 |
| 全量回归 | 未明确 | P0 需求、详细契约、配置契约、上游 contract、证据规则和 S0 修复触发 |
| 残余风险 | 只列非范围 | 每项风险有未覆盖原因、影响、缓解方式和接受人 |
| 验收承接 | 容易遗漏 | 一票否决、P1/P2、fake / registry / 性能阈值均转入 `06` |

## 6. 测试设计取舍

| 取舍 | 结论 | 原因 |
|---|---|---|
| 是否每次小变更都跑全量回归 | 不要求 | 按影响面触发最小回归,降低成本 |
| 是否 S0 修复一定触发 candidate gate | 是 | S0 破坏 P0 核心闭环,必须用 gate 证明修复 |
| 是否把 P1/P2 风险隐藏在非范围中 | 不允许 | 必须记录接受人并转入验收或后续计划 |
| 是否固定性能阈值作为残余风险关闭条件 | 不固定 | 当前只能要求测量点和明显瓶颈判断 |

## 7. 结构化中间产物

### 7.1 回归触发表

| 变更类型 | 最小回归集 | 全量回归触发条件 | 责任人 |
|---|---|---|---|
| Domain / policy | unit + affected service cases | 状态 enum 或一票否决规则变化 | SDK maintainer |
| Protocol / DTO / event / job | PR contract suite | DTO 字段、event topic、job receipt 破坏兼容 | SDK maintainer |
| Application flow | PR service suite | UoW、idempotency、outbox、projection 顺序变化 | SDK maintainer |
| Config | PR config + config专项 | profile、配置项、敏感边界或 fail-fast 变化 | configuration owner |
| Boundary / event adapter | main integration + event gate | formal / fake / bus boundary 协作方式变化 | SDK maintainer |
| Package / docs / smoke | candidate build / docs / smoke | candidate state gate 或三语言 surface 变化 | SDK maintainer |
| Compatibility / deprecated | compat cases + nightly compat | breaking / migration / deprecated lifecycle 变化 | SDK maintainer |
| Security / redaction | security cases + redaction check | 泄露规则、credential boundary 或 forbidden body 变化 | security reviewer |
| Reports / artifacts | report checks + acceptance summary | 输出路径、evidence index 或 report schema 变化 | test owner |

### 7.2 残余风险表

| 风险 | 未覆盖原因 | 影响 | 缓解方式 | 接受人 |
|---|---|---|---|---|
| public registry 发布 | P1/P2 非范围 | local candidate 不代表公网分发可用 | 后续 release / operations 专项 | release / operations owner |
| production endpoint 全量覆盖 | 依赖各服务 API 稳定 | fake / fixture 通过不代表所有服务能力可用 | 服务能力稳定后逐步纳入 | service capability owner |
| real credential provider | P0 只做 ref-only | 未验证真实 secret provider 故障 | 安全 / 运维专项 | security reviewer |
| remote config / hot reload | P0 拒绝 | 未验证在线配置变更一致性 | 配置 P1/P2 设计 | configuration owner |
| gateway / MCP / REST / GraphQL / REPL | 生态增强非范围 | SDK 不证明这些入口体验 | 后续架构裁剪 | architecture owner |
| fixed performance threshold | 需求未收稳 | 不能宣称具体微基准达标 | 保留测量点,后续补阈值 | SDK maintainer + acceptance owner |
| full service client coverage | P1/P2 扩展 | 当前只证明最小接入 | 按 formal API 稳定度分批加入 | SDK maintainer + service capability owner |

### 7.3 风险转验收映射

| 风险类别 | 转入 `06-验收标准.md` 的章节方向 |
|---|---|
| 一票否决 | veto checklist |
| P0 非功能 | 非功能验收 |
| reports / artifacts | 证据验收 |
| P1/P2 残余风险 | 风险接受验收 |
| fake / fixture boundary | 边界验收 |
| local candidate vs public release | 范围验收 |

## 8. 回填草稿

以下内容供 Step 15 汇总正式 `05-测试方案.md` §14 时摘录。

```markdown
## 14. 回归策略与残余风险

> 校准来源：
> - `design-calibration/05_test_plan_step_14_regression_risks.md`

回归策略按变更影响面触发。domain / policy、protocol / DTO、application flow、config、boundary / event adapter、package / docs / smoke、compatibility / deprecated、security / redaction、reports / artifacts 分别有最小回归集。P0 需求、一票否决项、详细设计状态 / DTO / 函数流 / 事务 / 错误契约、配置 profile / 敏感边界、上游 L0-core / L0-bus contract 和证据规则发生变化时,必须触发全量或接近全量回归。

残余风险包括 public registry 发布、production endpoint 全量覆盖、真实 credential provider、remote config / hot reload、gateway / MCP / REST / GraphQL / REPL、固定性能阈值和全量服务 client coverage。这些风险不阻断 P0,但必须在 `reports/acceptance/risk-acceptance.md` 中记录接受人、原因、到期条件和后续入口,并转入 `06-验收标准.md`。
```

## 9. 待确认事项

| 事项 | 建议方案 | 原因 |
|---|---|---|
| 是否每个残余风险都必须有人接受 | 是 | SOP 要求未覆盖风险必须有接受人或待确认项 |
| 是否把 public registry 纳入本轮回归 | 不纳入 P0 | 当前只证明 local candidate |
| 是否把 performance threshold 固化为退出门槛 | 不固化 | 需求阶段未定义具体数值 |
| 是否允许 S0 修复只跑最小用例 | 不允许 | S0 必须追加 gate 级回归证明 |

## 10. 进入下一步条件

| 条件 | 状态 |
|---|---|
| 最小回归触发规则已定义 | 已满足 |
| 全量回归触发规则已定义 | 已满足 |
| 暂不覆盖风险已定义 | 已满足 |
| 残余风险接受人已定义 | 已满足 |
| 必须转入验收标准的风险已定义 | 已满足 |
| 回归策略和残余风险可被实施计划 / 验收标准引用 | 已满足 |

Step 15 可以在本文件被确认后开始,主题是整理正式测试方案文档。
