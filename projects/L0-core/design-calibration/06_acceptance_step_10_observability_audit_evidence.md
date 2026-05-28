# Step 10. 定义可观测性、审计与证据门禁

## 1. Step 状态

- 状态：[x] 已确认
- 对应 SOP：`standards/document/验收标准讨论流程_SOP.md` Step 10
- 回填章节：`projects/L0-core/06-验收标准.md` §10

## 2. 本步输入

| 输入 | 内容 | 使用方式 |
|---|---|---|
| `03-详细设计.md` §14 | trace 传播、日志埋点、指标埋点、审计事件表、字段边界 | 定义观测和审计必须存在的行为 |
| `05-测试方案.md` §9 / §12 / §13 | 自动化门禁、进入 / 退出准则、证据归档表和证据字段要求 | 定义 EV 证据完整性和归档规则 |
| `05-测试方案.md` §10 / §11 | 专项测试、一票否决专项、缺陷复验要求 | 定义证据缺失对结论的影响 |
| Step 4 进入 / 退出条件 | P0 证据必须生成、证据可访问和 redaction 要求 | 定义进入验收和退出验收的证据条件 |
| Step 5~9 | 功能、红线、接口、状态、一致性、非功能门禁 | 抽取每类门禁需要的证据 |

依赖的前序 Step：Step 1~9 已确认。

## 3. SOP 问题回答

1. 哪些行为必须有 audit record?

   回答：所有高影响写路径和后台事实变化必须有 audit record,包括 draft create / update、review submit、baseline publish、lifecycle change、compatibility status change、snapshot ready、fact recorded、outbox relay published / failed。audit record 至少包含 actor_ref、trace_id、resource、state / fingerprint、action、result。

2. 哪些行为必须有 trace / log / metric?

   回答：Command、Query、Job、Outbox relay、validation / gate / reference failure、conflict / idempotency replay、port / toolchain / publisher failure 必须能通过 trace_id 或 request_id 串联。日志和指标只保留结构化字段,不得保存原始正文、凭据、token 或外部系统返回全文。

3. 哪些测试报告必须归档?

   回答：P0 验收至少要求 EV-CI-FMT-001、EV-UNIT-001、EV-SVC-001、EV-CONTRACT-001、EV-CONTRACT-002、EV-INT-001、EV-WORKER-001、EV-CONFIG-001、EV-AUDIT-001、EV-TRACE-001、EV-SEC-001、EV-SEC-002、EV-SCOPE-001、EV-E2E-001 可定位。EV-NFR-001、EV-NFR-002、EV-NIGHTLY-001 默认作为 baseline / 风险证据;若 release gate 标记必需,也必须归档并通过。

4. 证据缺失是否导致不通过?

   回答：P0 EV 缺失、证据不可访问、证据字段缺失、证据无法绑定 run_id / commit / case_id / config_profile、证据包含 raw secret 或禁止正文,均导致不通过或送验不成立。不能用口头确认替代证据。

5. 证据如何被复查?

   回答：证据必须通过 evidence_id、run_id、commit、suite、case_id、config_profile、result、trace_id 和 artifact path 复查。验收结论不直接粘贴测试日志,只引用证据 ID 和归档位置。证据必须可重跑、可定位、可 redaction 检查。

## 4. 当前文档问题诊断

| 位置 | 问题 | 影响 |
|---|---|---|
| `06-验收标准.md` 全文 | 没有单独的可观测性、审计与证据门禁章节 | P0 通过可能缺少可复查证据 |
| `06-验收标准.md` §5 / §6 | 只写 replay / audit view 等旧证据 | 不覆盖新版 EV 证据表和 trace / audit 字段要求 |
| `06-验收标准.md` §10 | 最终结论没有证据索引要求 | 无法追溯最终裁决依据 |
| `06-验收标准.md` 全文 | 没有 redaction 和证据字段完整性要求 | raw secret 或禁止正文可能进入报告 |

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 证据结构 | 泛化 trace / replay / compare | 明确 P0 EV 清单和字段要求 | 对齐 05 §13 |
| 审计门禁 | 旧 audit view | audit event、actor_ref、trace_id、resource、state / fingerprint | 对齐 03 §14 |
| 可观测门禁 | 未展开 | trace / log / metric 结构化字段与禁止正文边界 | 支撑复查和安全 |
| 缺失证据影响 | 未定义 | P0 EV 缺失则不通过或送验不成立 | 验收标准必须可裁决 |
| 证据复查 | 未定义 | evidence_id + run_id + commit + artifact path | 防止不可复现 |

## 6. 验收裁决取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| A. 只要求测试方案声明有证据 | 简单 | 不能支撑验收复查 | 不采用 |
| B. 在 06 中粘贴测试日志摘要 | 直观 | 06 会变成测试报告,且易泄露正文 | 不采用 |
| C. 06 只定义证据门禁和引用 ID,执行结果由 artifact / report 提供 | 边界清楚,可审计 | 需要实施期保证 artifact 路径稳定 | 采用 |
| D. P0 EV 缺失时允许口头确认 | 快速 | 不可审计 | 不采用 |

## 7. 结构化中间产物

### 7.1 可观测性、审计与证据门禁表

| 验收项 ID | 证据主题 | 必须存在的证据 | 通过条件 | 失败条件 |
|---|---|---|---|---|
| AC-EVID-001 | P0 自动化证据完整性 | EV-CI-FMT-001、EV-UNIT-001、EV-SVC-001、EV-CONTRACT-001、EV-CONTRACT-002、EV-INT-001、EV-WORKER-001、EV-CONFIG-001、EV-E2E-001 | P0 EV 全部可定位,并能绑定 run_id、commit、suite、case_id、config_profile、result | 任一 P0 EV 缺失、不可访问、无法绑定 run_id / commit |
| AC-EVID-002 | 安全与范围证据 | EV-SEC-001、EV-SEC-002、EV-SCOPE-001 | 禁止正文、raw secret、职责边界专项均有报告且未触发红线 | raw secret 或禁止正文进入证据;范围专项缺失 |
| AC-EVID-003 | 审计证据 | EV-AUDIT-001、audit_records、TC-AUDIT-001 | 高影响 command / job / relay 均有 audit record,字段包含 actor_ref、trace_id、resource、state / fingerprint、result | audit record 缺失、字段不足、audit 静默失败 |
| AC-EVID-004 | trace 传播证据 | EV-TRACE-001、trace_id / request_id 关联记录 | Command / Query / Job / relay 关键路径可由 trace_id 串联 | trace_id 缺失或无法串联主线 evidence |
| AC-EVID-005 | 结构化日志和指标边界 | 日志 / 指标 scan 或测试报告引用 | 日志 / 指标包含 operation、result、duration、error_code 等结构化字段,不含正文或凭据 | 日志 / 指标含 raw secret、正文或外部返回全文 |
| AC-EVID-006 | release gate 证据 | EV-E2E-001、release-like config failure gate、证据归档检查 | 发布候选通过最小闭环、配置失败门禁和证据归档检查 | release gate 缺失、失败或证据不可定位 |
| AC-EVID-007 | 非功能 baseline / 风险证据 | EV-NFR-001、EV-NFR-002、EV-NIGHTLY-001 | release gate 标记为必需时必须通过;未标记时必须形成风险记录 | 被标记为必需但缺失 / 失败;未标记且未进入风险记录 |
| AC-EVID-008 | 证据 redaction | evidence archive scan、EV-SEC-001、EV-SEC-002 | 所有证据不含 raw secret、外部正文全文、生产敏感数据 | 证据泄露敏感信息或禁止正文 |
| AC-EVID-009 | 缺陷复验证据 | defect record、复验用例、相关 EV ID | S/A 修复均有复验证据和自动化防回归说明 | S/A 修复无复验证据或未绑定 EV |
| AC-EVID-010 | 证据索引归档 | evidence index / artifact path | 证据索引包含 evidence_id、artifact path、run_id、commit、suite、case_id、config_profile、result、trace_id | 证据索引缺字段或 artifact path 漂移 |

### 7.2 P0 EV 清单

| EV ID | 验收用途 | 是否 P0 进入条件 |
|---|---|---|
| EV-CI-FMT-001 | 格式 / 静态检查 | 是 |
| EV-UNIT-001 | domain / state / policy | 是 |
| EV-SVC-001 | application service / command / query | 是 |
| EV-CONTRACT-001 | DTO / schema | 是 |
| EV-CONTRACT-002 | CloudEvent / relay boundary | 是 |
| EV-INT-001 | repository / transaction / projection | 是 |
| EV-WORKER-001 | job / worker | 是 |
| EV-CONFIG-001 | 配置加载 / fail closed | 是 |
| EV-AUDIT-001 | 审计追溯 | 是 |
| EV-TRACE-001 | trace 传播 | 是 |
| EV-SEC-001 | 禁止正文入仓 | 是 |
| EV-SEC-002 | raw secret 边界 | 是 |
| EV-SCOPE-001 | 职责边界 | 是 |
| EV-E2E-001 | 最小闭环 / release gate | 是,发布候选必需 |
| EV-NFR-001 / EV-NFR-002 | 性能 baseline | 条件必需 |
| EV-NIGHTLY-001 | 故障恢复 / nightly 风险 | 条件必需 |

### 7.3 证据缺失对最终结论的影响

| 情况 | 结论影响 |
|---|---|
| 任一 P0 EV 缺失 | 不通过或送验不成立 |
| EV 可访问但字段不完整 | 不通过,除非补证并重验 |
| EV 含 raw secret 或禁止正文 | 一票否决 |
| release gate EV-E2E-001 缺失 | 不通过 |
| EV-NFR-* / EV-NIGHTLY-001 未标记 release gate 必需但缺少风险记录 | 不能判定通过,需进入风险接受 |
| 缺陷修复无复验证据 | 不通过或保持缺陷未关闭 |

## 8. 回填草稿

```md
## 10. 可观测性、审计与证据门禁

> 校准来源：
> - `design-calibration/06_acceptance_step_10_observability_audit_evidence.md`
>
> 延伸阅读：
> - 建议继续阅读上述中间产物的“可观测性、审计与证据门禁表”“P0 EV 清单”和“证据缺失对最终结论的影响”小节,了解证据门禁如何从详细设计观测审计和 05 证据归档表收敛。

| 验收项 ID | 证据主题 | 必须存在的证据 | 通过条件 | 失败条件 |
|---|---|---|---|---|
| AC-EVID-001 | P0 自动化证据完整性 | P0 EV 全量清单 | P0 EV 全部可定位,并能绑定 run_id、commit、suite、case_id、config_profile、result | 任一 P0 EV 缺失、不可访问、无法绑定 run_id / commit |
| AC-EVID-002 | 安全与范围证据 | EV-SEC-001、EV-SEC-002、EV-SCOPE-001 | 禁止正文、raw secret、职责边界专项均有报告且未触发红线 | raw secret 或禁止正文进入证据;范围专项缺失 |
| AC-EVID-003 | 审计证据 | EV-AUDIT-001、audit_records、TC-AUDIT-001 | 高影响 command / job / relay 均有 audit record | audit record 缺失、字段不足、audit 静默失败 |
| AC-EVID-004 | trace 传播证据 | EV-TRACE-001 | 关键路径可由 trace_id 串联 | trace_id 缺失或无法串联主线 evidence |
| AC-EVID-005 | 日志和指标边界 | 日志 / 指标 scan 或测试报告引用 | 日志 / 指标结构化且不含正文或凭据 | 日志 / 指标含 raw secret、正文或外部返回全文 |
| AC-EVID-006 | release gate 证据 | EV-E2E-001、release-like config failure gate、证据归档检查 | 发布候选通过最小闭环、配置失败门禁和证据归档检查 | release gate 缺失、失败或证据不可定位 |
| AC-EVID-007 | 非功能 baseline / 风险证据 | EV-NFR-001、EV-NFR-002、EV-NIGHTLY-001 | release gate 标记为必需时必须通过;未标记时形成风险记录 | 被标记为必需但缺失 / 失败;未标记且未进入风险记录 |
| AC-EVID-008 | 证据 redaction | evidence archive scan、EV-SEC-001、EV-SEC-002 | 证据不含 raw secret、外部正文全文、生产敏感数据 | 证据泄露敏感信息或禁止正文 |
| AC-EVID-009 | 缺陷复验证据 | defect record、复验用例、相关 EV ID | S/A 修复均有复验证据和自动化防回归说明 | S/A 修复无复验证据或未绑定 EV |
| AC-EVID-010 | 证据索引归档 | evidence index / artifact path | 证据索引字段完整且路径可访问 | 证据索引缺字段或 artifact path 漂移 |
```

## 9. 待确认事项

- 是否接受 P0 EV 缺失时不允许口头确认替代。
- 是否接受 EV-NFR-* / EV-NIGHTLY-001 的条件必需口径延续 Step 9。
- 是否接受证据 redaction 失败直接进入 Step 11 一票否决候选。

## 10. 进入下一步条件

- [x] P0 证据门禁完整。
- [x] audit、trace、日志、指标和 evidence archive 均有裁决口径。
- [x] 证据缺失、证据泄露和复验证据缺失的结论影响已明确。
- [x] 可以进入 Step 11 定义一票否决项。
