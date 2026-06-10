# Step 13. 定义风险接受与遗留项

> 对应 SOP: `standards/document/验收标准讨论流程_SOP.md` Step 13
> 回填章节: `06-验收标准.md` §13 风险接受与遗留项

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 13 定义风险接受与遗留项 |
| 当前状态 | 已完成;自动连续推进 |
| 输入基线 | Step 9 非功能残余;Step 11 VETO;Step 12 缺陷放行;`05-测试方案.md` §14 |
| 输出文件 | `projects/L1-governance/design-calibration/06_acceptance_step_13_risk_acceptance.md` |
| 停审方式 | 本轮按用户要求不停审连续推进;本文件保留独立停审记录 |

## 2. 本步目标

定义有条件通过时允许保留哪些风险、哪些风险不能接受、风险接受必须具备哪些字段。

本 Step 只回答:

- 哪些 P1/P2 / future / sample/trend 风险可作为 residual。
- 哪些 VETO/S/P0 硬门禁不能风险接受。
- `reports/acceptance/risk-acceptance.md` 必须包含哪些内容。
- 风险接受与最终签署、后续实施计划或运维标准如何衔接。

本 Step 不填写真实接受人姓名,不宣告任何当前风险已被接受,只定义正式结构和裁决口径。

## 3. 本步输入

| 输入 | 状态 | 本 Step 用途 |
|---|---|---|
| `06_acceptance_step_09_nonfunctional.md` | 已完成 | 提供性能 sample、P1/P2 非功能 residual |
| `06_acceptance_step_11_veto.md` | 已完成 | 提供不可风险接受的 VETO |
| `06_acceptance_step_12_defects_retest_release.md` | 已完成 | 提供 S/A/B/R 缺陷与放行规则 |
| `05-测试方案.md` §14 | 已完成 | 提供 residual risk 表和不可风险接受项 |
| `04-配置设计.md` §14 | 已完成 | 提供 future 配置 / 产品 / 运维风险 |

## 4. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 哪些风险可以支持有条件通过? | P1 selected-run unavailable、真实 DB/bus/search/object storage 未覆盖、external GRC vendor 深度行为、production-like capacity、旧 P95/SLA 未硬化、高级 DSL/dashboard、长期证据保留天数待定等可在不影响 P0 truth 时进入 residual。 |
| 哪些风险不能接受? | VETO-GOV-001~013、S 级缺陷、redaction leak、dependency boundary failed、evidence integrity failure、P0 profile unavailable but marked passed、query/job truth repair、accepted truth 缺 trace/audit/outbox/result。 |
| 每个风险的接受人是谁? | 正式文档只固定角色和必填字段,实际接受人由 `reports/acceptance/risk-acceptance.md` 填写。缺接受人时不得作为有条件通过依据。 |
| 后续动作和截止时间是什么? | 每个 residual 必须有 action、owner、acceptor、deadline / trigger condition,并说明是否同步 `07-实施计划.md`、`09-部署与运维手册.md` 或 future ADR。 |
| 风险是否需要同步到实施计划或问题记录? | 是。影响实现、测试、运维或后续 release 的 residual 必须同步到实施计划 / 运维 / issue 记录,不能只留在 `06`。 |

## 5. 当前文档问题诊断

| 位置 | 当前问题 | 本 Step 处理 |
|---|---|---|
| 旧 `06-验收标准.md` | 风险接受只有泛化列表,缺接受人 / 截止 / VETO 边界 | 重建风险接受字段和不可接受清单 |
| Step 9 | P1/P2 residual 已识别但未给接受结构 | 本 Step 固定 residual 表 |
| Step 12 | A/B/R 可接受规则已定义 | 本 Step 补接受人、动作和截止条件 |

## 6. 改动前后对比

| 项 | 改动前 | 改动后 | 理由 |
|---|---|---|---|
| 风险表 | 影响 / 处理策略 | 风险、影响、接受理由、后续动作、责任人、接受人、截止时间 | 支撑有条件通过 |
| 不可接受项 | 分散在缺陷/VETO | 独立列出并禁止覆盖 | 防止越权 |
| P1/P2 | 容易伪 pass | residual / selected-run unavailable / future | 防止污染 P0 |
| 后续同步 | 未固定 | 同步实施计划、运维或 issue | 确保闭环 |

## 7. 验收裁决取舍

| 议题 | 方案 | 取舍 |
|---|---|---|
| 无接受人风险能否支持有条件通过 | A. 可以;B. 不可以 | 采用 B。无接受人不得有条件通过 |
| P1 selected-run unavailable 是否必须阻断 P0 | A. 必须;B. 不必须 | 采用 B。除非 Step 3/4 将其升为本轮进入条件 |
| 性能 sample 高于旧目标是否接受 | A. 可记录 residual;B. 直接失败 | 采用 A。当前无硬阈值 |
| A 级缺陷是否可风险接受 | A. 一律可;B. 严格限制 | 采用 B。不得影响 P0 truth/VETO/证据完整性 |

## 8. 结构化中间产物

### 8.1 风险接受表

| 风险 / 遗留项 | 影响 | 接受理由 | 后续动作 | 责任人 | 接受人 | 截止时间 |
|---|---|---|---|---|---|---|
| P1 real-like selected-run 不作为 P0 阻断 | 不能证明真实 adapter 端到端行为 | P0 已由 fake / controlled / disabled seam 证明;真实产品未锁定 | 产品/环境可用后执行 selected-run,结果进入下一轮验收 | 测试负责人待填 | 验收负责人待填 | `<date-or-trigger>` |
| 真实 DB / bus / search / object storage 行为未覆盖 | 不能证明具体产品性能和故障模式 | 当前 P0 不锁产品,只验 repository/port 语义 | 产品选型后补 P1/P2 adapter and failure tests | 架构负责人待填 | 验收负责人待填 | `<date-or-trigger>` |
| external GRC vendor 深度行为未覆盖 | 不能证明 vendor API 兼容性 | P0 只要求 disabled/fake/controlled export 不定义 truth | vendor target 确认后补 external GRC selected-run | 集成负责人待填 | 合规负责人待填 | `<date-or-trigger>` |
| production-like capacity / SLO 未覆盖 | 不能证明长时间运行和容量 | 当前无正式容量模型和 production-like 基线 | 定义负载模型、SLO、profile 和运维 runbook 后补验收 | 运维负责人待填 | 验收负责人待填 | `<date-or-trigger>` |
| 旧 P95 / SLA 数字未硬化 | 不能按 numeric threshold 裁决 | 当前只要求 duration/count sample,无阈值来源 | 基于 sample 建立 performance baseline 后决定是否升级 | 测试负责人待填 | 产品负责人待填 | `<date-or-trigger>` |
| 高级 Policy DSL / simulation 未覆盖 | 不能证明复杂策略表达能力 | P0 只验证 PolicyEffectiveFact 和 shared rules | advanced DSL 入范围前回写 `03/04/05/06` | 产品负责人待填 | 架构负责人待填 | `<date-or-trigger>` |
| 高级 dashboard / analytics 未覆盖 | 不能证明复杂展示体验 | P0 只验基础 query/dashboard read model | 产品层需求确定后补 UI/analytics 验收 | 产品负责人待填 | 验收负责人待填 | `<date-or-trigger>` |
| evidence retention 天数未固定 | 不能证明长期审计保留 | 当前只要求验收和复验期间可追溯 | 运维标准中定义保留期和归档介质 | 运维负责人待填 | 合规负责人待填 | `<date-or-trigger>` |

### 8.2 不可风险接受项

| 项 | 原因 |
|---|---|
| VETO-GOV-001~013 | 一票否决不得被接受覆盖 |
| S 级缺陷 | 破坏 P0 truth、安全、证据或架构红线 |
| redaction leak | 外部正文 / secret 泄露不可接受 |
| dependency boundary failed | 架构依赖裁剪破坏不可接受 |
| evidence index 静态造证据 / orphan EV | 验收裁决不成立 |
| P0 profile unavailable but marked passed | 运行基线不可信 |
| Query / job / report / handoff 反写 truth | 破坏 Governance truth ownership |
| accepted truth 缺 trace/audit/outbox/result | 核心追溯和发布链断裂 |

### 8.3 风险接受文件要求

| 字段 | 必填 | 说明 |
|---|---|---|
| `risk_id` | 是 | 稳定 ID,不得只写自由文本 |
| `scope` | 是 | 影响 P1/P2/future/operations 或 B/R 缺陷 |
| `impact` | 是 | 对本轮验收、下一阶段或生产的影响 |
| `acceptance_reason` | 是 | 为什么不阻断 P0 |
| `evidence_refs` | 是 | 支撑其为 residual 而非 VETO 的 EV/report/defect |
| `owner` | 是 | 后续动作责任人 |
| `acceptor` | 是 | 风险接受人;缺失则不得有条件通过 |
| `deadline_or_trigger` | 是 | 截止日期或触发条件 |
| `follow_up_ref` | 是 | issue / implementation plan / ops doc / ADR ref |

### 8.4 风险接受停审记录

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 可接受 residual 是否与 P1/P2/future 匹配 | 通过 | 不影响 P0 truth |
| 不可接受项是否覆盖 VETO/S | 通过 | 全部禁止 |
| 是否要求接受人 | 通过 | 缺接受人不得有条件通过 |
| 是否要求后续动作和截止 | 通过 | 必填 |
| 是否存在风险接受覆盖 VETO | 未发现 | Step 14 继续约束最终结论 |

## 9. 回填草稿

> 校准来源:
> - `design-calibration/06_acceptance_step_13_risk_acceptance.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“风险接受表”“不可风险接受项”“风险接受文件要求”和“风险接受停审记录”小节,了解有条件通过所需的 residual 结构和不可接受边界。

正式 `06-验收标准.md` §13 应回填:

- 风险接受只适用于 B/R residual、P1/P2 selected-run unavailable、future capability、无硬阈值 sample/trend 或已严格限制的 A 级缺陷。
- VETO-GOV-001~013、S 级缺陷、redaction leak、dependency boundary failed、evidence integrity failure、query/job truth repair、P0 config silent fallback 不得风险接受。
- `reports/acceptance/risk-acceptance.md` 必须包含 risk_id、impact、acceptance_reason、evidence_refs、owner、acceptor、deadline_or_trigger 和 follow_up_ref。
- 缺接受人、缺后续动作或缺截止条件的风险不能作为有条件通过依据。

## 10. 待确认事项

| 待确认事项 | 影响 | 当前处理 |
|---|---|---|
| 真实接受人名单 | 影响有条件通过 | 正式验收时填写,本文只固定角色和必填字段 |
| evidence retention 具体天数 | 影响合规 / 运维 | 当前作为 residual;后续进入运维标准 |
| 哪些 A 级缺陷可接受 | 影响放行 | 必须逐项审查,不得批量接受 |

## 11. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| 所有残余风险都有处理口径 | 通过 | 见 §8.1 |
| 不可接受风险已明确 | 通过 | 见 §8.2 |
| 风险接受结构完整 | 通过 | 见 §8.3 |
| 可进入 Step 14 | 通过 | 下一步定义最终结论与签署口径 |
