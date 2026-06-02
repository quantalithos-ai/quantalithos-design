# L1-conversation 06 验收标准 Step 11: 定义一票否决项

> 所属流程: `06_acceptance_calibration_flow.md`
> 对应正式文档: `projects/L1-conversation/06-验收标准.md` §11 一票否决项
> 状态: `[x] 已完成`
> 日期: 2026-06-02

---

## 1. Step 状态

| 项 | 内容 |
|---|---|
| Step | Step 11 |
| 主题 | 定义一票否决项 |
| 当前状态 | `[x] 已完成` |
| 是否修改正式 `06-验收标准.md` | 否 |
| 产物位置 | `projects/L1-conversation/design-calibration/06_acceptance_step_11_veto_items.md` |

本步把需求红线、架构阻塞风险、数据边界、状态事务、非功能安全和证据门禁收敛成最终一票否决项。缺陷分级、复验和风险接受分别留给 Step 12 和 Step 13。

## 2. 本步输入

| 输入 | 用途 | 本步判定 |
|---|---|---|
| `00-需求文档.md` §14.2 | 需求层一票否决项 | 作为否决项主来源 |
| `01-架构设计.md` §15 | 架构阻塞风险和可接受 / 不可接受债务 | 作为职责边界与 P0 污染来源 |
| `05-测试方案.md` §11 | S0 / S1 缺陷和不可风险接受规则 | 作为否决项缺陷影响来源 |
| `06_acceptance_step_05_function_gate.md` | 核心功能门禁 | 作为核心闭环缺失来源 |
| `06_acceptance_step_06_data_architecture_redlines.md` | 数据边界和架构红线 | 作为数据归属、安全和 fake-as-production 来源 |
| `06_acceptance_step_08_state_tx_consistency.md` | 状态、事务、幂等和一致性失败影响 | 作为 partial commit、query write、auto repair truth 来源 |
| `06_acceptance_step_09_nonfunctional_gate.md` | 非功能阻断失败 | 作为 redaction、配置、证据路径和 production-like 伪装来源 |
| `06_acceptance_step_10_observability_evidence.md` | 证据缺失和 handoff 门禁 | 作为送验不成立和 veto checklist 来源 |

## 3. SOP 问题回答

### 3.1 哪些失败会直接导致不通过?

核心闭环缺失、Conversation 退化为消息缓存、truth 被覆盖 / 抹除 / 反写、授权视野失效、source truth 被补造、相邻仓正文或 forbidden body 泄漏、raw secret 泄漏、配置绕过红线、fake-as-production、partial commit、query / projection / report 写 truth、自动修 truth、状态非法迁移成功、关键变化不可追溯、P0 证据缺失或路径错误,均直接导致不通过。

### 3.2 否决项来自哪个需求或设计红线?

否决项来源分四组: `00` §14.2 的需求红线、`01` §15 的架构阻塞风险、Step 6 / Step 8 / Step 9 的 AC 失败影响、Step 10 的证据门禁。每个 `VETO-CONV-*` 都必须至少回指一个正式 AC 或 EV。

### 3.3 否决项如何检查?

检查方式优先使用 `reports/acceptance/veto-checklist.md`,并回指 `reports/runs/<run_id>/evidence-index.md`、`gate-results.md`、`redaction-check.md`、EV 明细和 suite / artifact 证据。不能只用人工口头确认。

### 3.4 否决项是否允许风险接受?

不允许。任何命中 `VETO-CONV-*` 的失败都不得被 `risk-acceptance.md` 覆盖。Step 13 只能接受 P1 / P2、S2 / S3 或 readiness 缺口,不能接受 S0 / S1、redaction violation、授权失效、source truth isolation 失败或证据路径错误。

### 3.5 否决项是否覆盖所有 P0 红线?

覆盖。`VETO-CONV-001~014` 覆盖核心闭环、truth 边界、授权、数据归属、source isolation、下游反写、派生反写、事务一致性、幂等、配置、安全脱敏、fake-as-production、追溯审计和证据门禁。P1/P2 未覆盖不作为否决,但伪装为 P0 production readiness 属于否决。

## 4. 当前文档问题诊断

| 文档 / 输入 | 诊断 | 本步处理 |
|---|---|---|
| 旧 `06-验收标准.md` | 否决项未承接新版 truth / redaction / evidence 主线 | 不继承旧否决口径 |
| `00-需求文档.md` §14.2 | 已有需求否决项,但缺证据检查方式 | 本步绑定 AC、TC、EV 和 report |
| Step 6 | 红线失败分散在 AC-RED | 本步提炼为最终 veto |
| Step 8 | 状态 / 事务失败有不通过和一票否决候选 | 本步明确哪些不可风险接受 |
| Step 10 | 证据缺失和 redaction failure 已定义影响 | 本步纳入送验成立否决项 |
| Step 13 未生成 | 风险接受边界尚未正式落地 | 本步先声明 veto 不可被风险接受覆盖 |

## 5. 改动前后对比

| 对比项 | 改动前 | 改动后 |
|---|---|---|
| 否决项来源 | 分散在需求、架构、测试和 Step 6~10 | 统一为 `VETO-CONV-*` |
| 检查方式 | 泛写红线 | 每项绑定 AC / TC / EV / report |
| 风险接受边界 | 容易用风险接受覆盖红线 | 明确 veto 不可风险接受 |
| P1/P2 缺口 | 容易误判为 P0 fail | 只在伪装 P0 或污染 P0 时否决 |
| 证据缺失 | 可能被视为报告问题 | P0 证据缺失时送验不成立 / 不通过 |

## 6. 验收裁决取舍

| 决策点 | 方案 A | 方案 B | 推荐 | 原因 |
|---|---|---|---|---|
| 是否把所有 P0 用例失败都列为 veto | 全列为 veto | 只把破坏 truth、安全、边界、证据成立的失败列为 veto | B | S1 失败由 Step 12 分级处理,避免 veto 失去区分度 |
| P1/P2 未覆盖是否 veto | 是 | 否,除非伪装 P0 通过或污染 P0 | B | 已由 Step 9 固定为风险 / open issues |
| evidence 缺失是否 veto | 全部 evidence 缺失都 veto | P0 EV、gate、redaction、handoff 缺失才 veto / 送验不成立 | B | PR / main 非送验证据可按 CI 策略清理 |
| redaction failure 是否可风险接受 | 可接受 | 不可接受 | B | 安全边界破坏不能由风险接受覆盖 |
| fake adapter 是否允许作为 P0 evidence | 不允许 fake | 允许 controlled seam,但必须带 fake marker | B | P0 可验本仓接缝,但不能宣称 production success |

## 7. 结构化中间产物

### 7.1 一票否决项表

| 否决项 ID | 否决项 | 原因 | 证据 / 检查方式 |
|---|---|---|---|
| VETO-CONV-001 | 核心能力闭环任一必要节点缺失 | space / scope、fact append、authorized consumption、manifestation、trace / history 任一缺失时,Conversation truth center 不成立 | `AC-FUNC-*`;`EV-CONV-TRUTH-001`;`EV-CONV-FACT-001`;`EV-CONV-AUTH-001`;`EV-CONV-MAN-001`;`EV-CONV-HANDOFF-001` |
| VETO-CONV-002 | Conversation 退化为消息缓存、UI 副本或 runtime memory | 破坏本仓一等对话真相定位 | `AC-RED-001`;`AC-FUNC-001`;design baseline review;`reports/acceptance/veto-checklist.md` |
| VETO-CONV-003 | Conversation truth 被覆盖、抹除、反写或自动修复 | 已成立 fact、scope、manifestation、trace 只能按正式状态机推进 | `AC-RED-006`;`AC-RED-007`;`AC-TX-003`;`AC-CONS-002`;`TC-CONV-CONSISTENCY-001`;`EV-CONV-DERIVED-001` |
| VETO-CONV-004 | 授权视野失效 | 任一消费方读取隐藏 fact、sealed visibility 被扩张或追溯读取绕过 scope,会破坏安全边界 | `AC-RED-004`;`AC-NFR-005`;`TC-CONV-SCOPE-002`;`TC-CONV-QUERY-*`;`EV-CONV-AUTH-001` |
| VETO-CONV-005 | 相邻仓正文、forbidden body 或 raw payload 进入 truth / event / log / audit / report | 破坏数据归属和 redaction 边界 | `AC-RED-002`;`AC-NFR-006`;`AC-EVID-003`;`TC-CONV-FACT-004`;`TC-CONV-CONSUMER-003`;`EV-CONV-REDACTION-001` |
| VETO-CONV-006 | raw secret、raw token、private key 或 raw credential 进入配置、artifact、report 或 handoff | 破坏安全底线,不能风险接受 | `AC-RED-003`;`AC-NFR-006`;`TC-CONV-CONFIG-001`;`TC-CONV-REDACTION-001`;`EV-CONV-CONFIG-001`;`EV-CONV-REDACTION-001` |
| VETO-CONV-007 | source truth isolation 被破坏 | 本仓补造成员、项目、治理、产物、runtime 或 bridge 的来源 truth,会串仓 | `AC-RED-005`;`AC-NFR-004`;`TC-CONV-MAN-*`;`TC-CONV-CONSUMER-*`;`EV-CONV-MAN-001`;`EV-CONV-CONSUMER-001` |
| VETO-CONV-008 | 下游或外围增强反向定义 Conversation truth | SDK、Chat、Workspace、Runtime、Bridges、Observability、Archive 不得覆盖本仓 truth | `AC-RED-006`;`AC-NFR-003`;`TC-CONV-QUERY-*`;`TC-CONV-OUTBOX-*`;`EV-CONV-AUTH-001`;`EV-CONV-OUTBOX-001` |
| VETO-CONV-009 | command / consumer truth 事务出现 partial commit | truth、trace / receipt、outbox、idempotency 必须原子闭合 | `AC-TX-001`;`TC-CONV-TX-001`;`EV-CONV-FACT-001`;`EV-CONV-CONSUMER-001` |
| VETO-CONV-010 | query、projection、cursor、report 或 consistency validation 写入业务 truth | 派生 / 读取 / 报告只能消费既有 truth,不得成为第二 truth | `AC-RED-007`;`AC-TX-003`;`AC-CONS-002`;`TC-CONV-QUERY-*`;`TC-CONV-CONSISTENCY-001`;`EV-CONV-DERIVED-001` |
| VETO-CONV-011 | duplicate / conflict 形成冲突 truth 或重复外部副作用 | 幂等失败会生成互相矛盾事实或重复交接 / publish | `AC-IDEM-001`;`AC-IDEM-002`;`AC-NFR-008`;`TC-CONV-FACT-002`;`TC-CONV-FACT-003`;`TC-CONV-OUTBOX-003` |
| VETO-CONV-012 | 配置绕过 visibility、redaction、idempotency、audit、state machine 或 path shape | 配置不得暗改架构红线或安全下限 | `AC-RED-008`;`AC-NFR-009`;`TC-CONV-CONFIG-001`;`TC-CONV-REPORT-001`;`EV-CONV-CONFIG-001` |
| VETO-CONV-013 | fake / controlled adapter 被标记为 production success | controlled seam 可验 P0 接缝,但不得宣称真实生产集成通过 | `AC-RED-010`;`AC-NFR-012`;`TC-CONV-CONFIG-001`;`EV-CONV-CONFIG-001`;`reports/acceptance/handoff.md` |
| VETO-CONV-014 | P0 证据缺失、redaction 失败、路径错误或 veto checklist 未覆盖 | 验收结论必须可复查,不能用口头确认替代证据 | `AC-EVID-001~008`;`EV-CONV-GATE-001`;`EV-CONV-ACCEPT-001`;`reports/runs/<run_id>`;`reports/acceptance/veto-checklist.md` |

### 7.2 否决项到前序门禁映射表

| 否决项 | 主要来源 AC | 主要证据 |
|---|---|---|
| VETO-CONV-001 | `AC-FUNC-001~008` | `EV-CONV-TRUTH-001`;`EV-CONV-FACT-001`;`EV-CONV-AUTH-001`;`EV-CONV-MAN-001`;`EV-CONV-HANDOFF-001` |
| VETO-CONV-002 | `AC-RED-001`;`AC-FUNC-001` | design baseline;veto checklist |
| VETO-CONV-003 | `AC-RED-006`;`AC-RED-007`;`AC-CONS-002` | `EV-CONV-DERIVED-001`;consistency report |
| VETO-CONV-004 | `AC-RED-004`;`AC-NFR-005` | `EV-CONV-AUTH-001` |
| VETO-CONV-005 | `AC-RED-002`;`AC-NFR-006`;`AC-EVID-003` | `EV-CONV-REDACTION-001` |
| VETO-CONV-006 | `AC-RED-003`;`AC-NFR-006`;`AC-EVID-003` | `EV-CONV-CONFIG-001`;`EV-CONV-REDACTION-001` |
| VETO-CONV-007 | `AC-RED-005`;`AC-NFR-004` | `EV-CONV-MAN-001`;`EV-CONV-CONSUMER-001` |
| VETO-CONV-008 | `AC-RED-006`;`AC-NFR-003` | `EV-CONV-AUTH-001`;`EV-CONV-OUTBOX-001` |
| VETO-CONV-009 | `AC-TX-001` | `EV-CONV-FACT-001`;`EV-CONV-CONSUMER-001` |
| VETO-CONV-010 | `AC-TX-003`;`AC-CONS-002` | `EV-CONV-AUTH-001`;`EV-CONV-DERIVED-001` |
| VETO-CONV-011 | `AC-IDEM-001`;`AC-IDEM-002`;`AC-NFR-008` | `EV-CONV-FACT-001`;`EV-CONV-OUTBOX-001`;`EV-CONV-HANDOFF-001` |
| VETO-CONV-012 | `AC-RED-008`;`AC-NFR-009` | `EV-CONV-CONFIG-001` |
| VETO-CONV-013 | `AC-RED-010`;`AC-NFR-012` | `reports/acceptance/handoff.md`;`risk-acceptance.md` |
| VETO-CONV-014 | `AC-EVID-001~008` | `EV-CONV-GATE-001`;`EV-CONV-ACCEPT-001` |

### 7.3 风险接受边界表

| 类型 | 是否可风险接受 | 说明 |
|---|---|---|
| `VETO-CONV-*` 任一命中 | 否 | 必须修复并复验 |
| S0 一票否决 | 否 | 与本步等价,不得有条件通过 |
| S1 P0-blocking | 否 | Step 12 定义复验后才能继续 |
| S2 boundary / readiness | 可有条件接受 | 仅当 P0 truth、安全、证据和 redline 未受影响 |
| S3 非阻断 | 可接受 | 进入 backlog 或 open issues |
| production-like / 真实下游 / 生产容量数字缺口 | 可接受 | 不得伪装 P0 production readiness |

### 7.4 否决检查流程图

```text
[P0 AC / EV / Gate Result]
  | check redlines
  v
[VETO-CONV-* Checklist]
  | any hit?
  +-- yes --> [Not Passed]
  |
  +-- no --> [Step 12 Defect Grading]
                |
                v
          [Step 13 Risk Acceptance]
```

关键说明:

- `VETO-CONV-*` 命中时直接不通过,不进入风险接受。
- 未命中 veto 仍可能因 S1 P0-blocking 缺陷不通过。
- 风险接受只处理 P1/P2、S2/S3 或 readiness 缺口。
- `veto-checklist.md` 必须覆盖本步全部否决项。

## 8. 回填草稿

以下内容供 Step 15 汇总正式 `06-验收标准.md` §11 时摘录。

```markdown
## 11. 一票否决项

> 校准来源：
> - `design-calibration/06_acceptance_step_11_veto_items.md`
>
> 延伸阅读：
> - 建议继续阅读 `design-calibration/06_acceptance_step_11_veto_items.md` 的“一票否决项表”“否决项到前序门禁映射表”“风险接受边界表”和“否决检查流程图”小节，了解哪些失败不可被风险接受覆盖。

本轮一票否决项以 `VETO-CONV-001~014` 为准。任一否决项命中时,最终结论只能是不通过,不得进入风险接受。`reports/acceptance/veto-checklist.md` 必须覆盖全部 `VETO-CONV-*`,并回指 `reports/runs/<run_id>/evidence-index.md`、`gate-results.md`、`redaction-check.md`、EV 明细和 suite / artifact 证据。

风险接受只允许处理 P1 / P2、S2 / S3 或 readiness 缺口。核心闭环缺失、授权失效、正文或 secret 泄漏、source truth 被补造、truth 反写、partial commit、幂等冲突形成 truth、配置绕过红线、fake-as-production 和 P0 证据缺失均不得风险接受。
```

## 9. 待确认事项

无阻塞进入 Step 12 的待确认事项。

后续必须继续收口:

- Step 12 将把本步 `VETO-CONV-*` 与 S0 / S1 / S2 / S3 缺陷分级、复验和放行规则对齐。
- Step 13 将定义在未命中 veto 的情况下,哪些 P1 / P2、S2 / S3 或 readiness 缺口可以风险接受。
- Step 14 将基于本步否决结果、Step 12 缺陷结果和 Step 13 风险接受结果给出最终结论口径。

## 10. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| 直接不通过失败已列清 | 通过 | `VETO-CONV-001~014` 覆盖核心、边界、事务、安全和证据 |
| 否决项来源可追溯 | 通过 | 每项绑定 AC、TC、EV 或 report |
| 检查方式明确 | 通过 | `veto-checklist.md` 和 run-scoped reports 作为入口 |
| 风险接受边界明确 | 通过 | VETO / S0 / S1 不得风险接受 |
| P0 红线覆盖完整 | 通过 | Step 5~Step 10 的 P0 红线均已映射 |
| 可以进入 Step 12 | 通过 | 下一步定义缺陷分级、复验与放行规则 |
