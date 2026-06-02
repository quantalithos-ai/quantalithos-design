# L1-conversation 06 验收标准 Step 12: 定义缺陷分级、复验与放行规则

> 所属流程: `06_acceptance_calibration_flow.md`
> 对应正式文档: `projects/L1-conversation/06-验收标准.md` §12 缺陷分级、复验与放行规则
> 状态: `[x] 已完成`
> 日期: 2026-06-02

---

## 1. Step 状态

| 项 | 内容 |
|---|---|
| Step | Step 12 |
| 主题 | 定义缺陷分级、复验与放行规则 |
| 当前状态 | `[x] 已完成` |
| 是否修改正式 `06-验收标准.md` | 否 |
| 产物位置 | `projects/L1-conversation/design-calibration/06_acceptance_step_12_defects_release.md` |

本步把测试方案中的 S0 / S1 / S2 / S3 缺陷规则转成验收结论规则。SOP 中的 S/A/B 口径在本仓收敛为 S0 一票否决、S1 P0-blocking、S2 boundary / readiness、S3 非阻断四级。

## 2. 本步输入

| 输入 | 用途 | 本步判定 |
|---|---|---|
| `05-测试方案.md` §11 | 缺陷分级、复验规则和阻断口径 | 作为缺陷规则主来源 |
| `05_test_plan_step_11_defects_retest.md` | 缺陷类型到回归范围、关闭证据和防回归规则 | 作为结构化输入 |
| `05-测试方案.md` §12 / §13 | 进入 / 退出准则、report 和 evidence 归档 | 作为放行和关闭证据来源 |
| `06_acceptance_step_10_observability_evidence.md` | P0 EV、gate、redaction 和 acceptance handoff 门禁 | 作为证据关闭要求来源 |
| `06_acceptance_step_11_veto_items.md` | `VETO-CONV-*` 和不可风险接受边界 | 作为 S0 与一票否决来源 |

## 3. SOP 问题回答

### 3.1 S/A/B 缺陷如何定义?

本仓不使用泛化 S/A/B,而使用已在测试方案中收敛的 S0~S3。S0 是一票否决,命中 `VETO-CONV-*`。S1 是 P0-blocking,未直接命中 veto 但会阻断 P0 用例、P0 suite、核心非功能专项或 release gate。S2 是 boundary / readiness,影响 P0/P1 边界、nightly、operations-replay 或 P0-supporting,但不破坏 P0 红线。S3 是非阻断问题,只影响文档、报告呈现、非关键统计或后续专项。

### 3.2 每级缺陷对验收结论有什么影响?

S0 命中时最终结论只能是不通过。S1 未关闭时不能通过,也不能有条件通过。S2 可以在有证据证明 P0 不受影响时进入有条件通过候选。S3 不阻断 P0,但必须进入 open issues 或 backlog,不得掩盖 S0 / S1。

### 3.3 修复后如何复验?

S0 修复必须重跑命中红线的直接 TC、release redline、redaction check 和相关 main CI suite。S1 修复必须重跑直接 TC、同场景组 TC、相关 P0 suite 和失败前同类 negative case。S2 修复必须重跑对应 nightly、operations-replay 或 staging smoke,并说明是否影响 P0。flaky、timeout、dependency failure 和 config failure 均必须保留失败 run、复验 run、failure summary 和 run-scoped report。

### 3.4 哪些缺陷可以风险接受?

只有 S2 / S3 可进入风险接受候选,且必须满足:不影响 `VETO-CONV-*`;不影响 P0 truth、安全、数据归属、证据路径和 redaction;有 owner、影响、临时规避、后续动作和截止时间。S0 / S1 不允许风险接受。

### 3.5 哪些缺陷必须阻断下一阶段?

任何未关闭 S0 / S1 必须阻断下一阶段。S2 如果影响 release readiness、controlled seam、operations-replay 或 P0/P1 边界且未完成风险接受,也必须阻断最终验收结论。S3 不阻断下一阶段,但必须可追踪。

## 4. 当前文档问题诊断

| 文档 / 输入 | 诊断 | 本步处理 |
|---|---|---|
| 旧 `06-验收标准.md` | 缺陷规则未承接新版 S0 / S1 / evidence | 不继承旧缺陷规则 |
| `05-测试方案.md` §11 | 已有测试缺陷规则,但不是验收结论格式 | 本步转成结论影响表 |
| Step 11 产物 | 已定义 `VETO-CONV-*`,但未和缺陷等级闭环 | 本步将 VETO 映射为 S0 |
| Step 10 产物 | 已定义证据缺失影响 | 本步纳入关闭证据要求 |
| Step 13 未生成 | 风险接受细节待后续 | 本步只定义哪些级别可进入风险接受 |

## 5. 改动前后对比

| 对比项 | 改动前 | 改动后 |
|---|---|---|
| 缺陷等级 | 测试方案已有 S0~S3 | 验收标准明确每级对结论的影响 |
| VETO 与缺陷 | 分散 | `VETO-CONV-*` 等价 S0 |
| 复验 | 测试视角的重跑规则 | 验收视角明确关闭证据和放行条件 |
| 风险接受 | 待 Step 13 | 本步先限定 S0 / S1 不可接受 |
| 放行 | 只看 suite 是否通过 | 同时检查缺陷关闭、证据、redaction、handoff 和风险记录 |

## 6. 验收裁决取舍

| 决策点 | 方案 A | 方案 B | 推荐 | 原因 |
|---|---|---|---|---|
| 是否改用 SOP 的 S/A/B 名称 | 改名 | 沿用 S0~S3 并说明映射 | B | 测试方案和前序步骤已稳定使用 S0~S3 |
| S1 是否可有条件通过 | 可以 | 不可以,必须关闭后再评估 | B | S1 仍是 P0-blocking |
| S2 是否全部可接受 | 全部可接受 | 仅 P0 红线不受影响且记录完整时可接受 | B | 防止用 S2 包装 P0 失败 |
| 修复后是否只跑失败 TC | 只跑失败 TC | 直接 TC + 同组 TC + suite + redline / redaction | B | 红线和状态一致性常跨用例 |
| flaky 是否可忽略 | 可忽略 | 必须按缺陷处理并留证 | B | 不稳定证据不能支撑验收 |

## 7. 结构化中间产物

### 7.1 缺陷分级表

| 缺陷级别 | 定义 | 对结论的影响 | 复验要求 |
|---|---|---|---|
| S0 一票否决 | 命中 `VETO-CONV-*` 或需求 / 架构红线,破坏 truth、authorization、data ownership、traceability 或 P0 evidence | 直接不通过;不得风险接受;不得进入有条件通过 | 修复后重跑直接 TC、release redline、redaction check、相关 main CI suite;补自动化防回归 |
| S1 P0-blocking | P0 用例、P0 suite、核心非功能专项或 release gate 失败,但未直接命中 S0 | 未关闭时不通过;不得风险接受 | 重跑直接 TC、同场景组 TC、相关 P0 suite、同类 negative case;保留失败和复验 report |
| S2 Boundary / readiness | P0/P1 边界、nightly、operations-replay、controlled seam 或 P0-supporting 失败,且不破坏 P0 红线 | 可进入有条件通过候选;未记录风险接受时不得放行 | 重跑对应 nightly / operations-replay / staging smoke;证明 P0 不受影响;补风险接受记录 |
| S3 非阻断 | 文档、报告呈现、非关键统计、P2 production-like 缺口或后续专项不完整 | 不阻断 P0;可通过或有条件通过 | 进入 backlog / open issues;必要时局部检查;不得影响 P0 evidence |

### 7.2 缺陷到结论影响表

| 缺陷状态 | 通过 | 有条件通过 | 不通过 |
|---|---|---|---|
| 无 S0 / S1,无未接受 S2,仅有已记录 S3 | 可以 | 可选 | 否 |
| 无 S0 / S1,存在已接受 S2 | 否 | 可以 | 否 |
| 存在未接受 S2 | 否 | 否 | 是,或暂停结论 |
| 存在 S1 未关闭 | 否 | 否 | 是 |
| 存在 S0 / VETO 命中 | 否 | 否 | 是 |
| P0 证据缺失导致无法分级 | 否 | 否 | 送验不成立 / 不通过 |

### 7.3 复验规则表

| 场景 | 复验规则 | 不足以关闭的情况 |
|---|---|---|
| S0 修复 | 重跑命中红线的直接 TC、release redline、redaction check、相关 main CI suite,并更新 veto checklist | 只提供手工说明;只跑单个 unit;无 redaction report |
| S1 修复 | 重跑直接 TC、同场景组 TC、相关 P0 suite、失败前同类 negative case | 只跑失败 TC;未覆盖同组状态 / 幂等 / path |
| S2 修复 | 重跑对应 nightly、operations-replay、staging smoke 或 controlled seam,并说明 P0 是否受影响 | 只更新文档;未证明 P0 redline 不受影响 |
| flaky 修复 | 用同一 seed / failure mode 记录 first failure 和 fixed run | 只因本次未复现就关闭 |
| timeout 修复 | 记录 profile、seed、duration、修复后 duration;无量化阈值时只写 no-regression | 删除 timeout 测试或改成无限等待 |
| dependency failure 修复 | 证明 fake / controlled failure 仍保留 retry / failed / unresolved marker | 直接跳过依赖场景或把失败当成功 |
| config failure 修复 | 重跑 parse、unknown key、unsupported profile、path shape、redaction lower bound negative | 只验证 happy path config |

### 7.4 放行规则表

| 放行类型 | 必须满足 | 禁止放行条件 |
|---|---|---|
| 通过 | 无 S0 / S1;无未接受 S2;P0 EV、gate、redaction、handoff 完整;所有 P0 AC 可裁决通过 | 任一 `VETO-CONV-*` 命中;S1 未关闭;P0 evidence 缺失 |
| 有条件通过 | 无 S0 / S1;S2 风险已接受;S3 已记录;P0 truth、安全、redaction、evidence 未受影响 | 用风险接受覆盖 S0 / S1;S2 无 owner / deadline;fake-as-production |
| 不通过 | S0 命中、S1 未关闭、P0 evidence 缺失、redaction failure、授权失效、truth 反写或 source truth isolation 失败 | 不适用 |
| 暂停 / 送验不成立 | run id、baseline、implementation commit / build、reports 或 artifacts 缺失导致无法裁决 | 用口头确认替代缺失证据 |

### 7.5 关闭证据要求表

| 缺陷级别 | 关闭证据 | 路径约束 |
|---|---|---|
| S0 | 修复说明、设计来源、失败 run、复验 run、release redline、redaction-check、veto checklist 更新、自动化防回归说明 | `artifacts/test/<run_id>`;`reports/runs/<run_id>`;`reports/acceptance` |
| S1 | 修复说明、失败 suite、复验 suite、直接 TC 与同组 TC 结果、failure summary 消失 | `artifacts/test/<run_id>`;`reports/runs/<run_id>` |
| S2 | 影响评估、风险接受记录或修复 run、nightly / operations / staging 结果、P0 不受影响说明 | `artifacts/test/<run_id>`;`reports/runs/<run_id>`;`reports/acceptance/risk-acceptance.md` |
| S3 | backlog / open issue、文档或报告修正记录、必要时局部检查结果 | `reports/acceptance/open-issues.md` 或后续 backlog |

### 7.6 自动化防回归要求表

| 缺陷来源 | 防回归要求 | 进入 suite |
|---|---|---|
| 新 veto / redline 漏洞 | 新增 negative TC 或扩展现有断言 | release redline + main CI |
| 状态机非法迁移 | 新增 domain / service 状态断言 | PR unit + main service |
| 事务 / 幂等漏洞 | 新增 rollback、duplicate、conflict 或 rerun 用例 | main service / worker / job |
| 配置失效模式 | 新增 config negative fixture | main config + release gate |
| 观测 / redaction 泄漏 | 新增 forbidden field check | release redline |
| evidence path 问题 | 新增 path shape / report generation check | release report |
| P1 boundary 问题 | 新增 nightly / staging smoke subset | nightly / staging smoke |

## 8. 回填草稿

以下内容供 Step 15 汇总正式 `06-验收标准.md` §12 时摘录。

```markdown
## 12. 缺陷分级、复验与放行规则

> 校准来源：
> - `design-calibration/06_acceptance_step_12_defects_release.md`
>
> 延伸阅读：
> - 建议继续阅读 `design-calibration/06_acceptance_step_12_defects_release.md` 的“缺陷分级表”“缺陷到结论影响表”“复验规则表”“放行规则表”和“关闭证据要求表”小节，了解缺陷如何影响通过 / 有条件通过 / 不通过。

本轮缺陷分为 S0 一票否决、S1 P0-blocking、S2 boundary / readiness 和 S3 非阻断四级。S0 等价命中 `VETO-CONV-*`,结论只能是不通过。S1 未关闭时不得通过或有条件通过。S2 只有在证明 P0 truth、安全、redaction 和 evidence 不受影响,且完成风险接受记录后,才能支撑有条件通过。S3 不阻断 P0,但必须进入 open issues 或 backlog。

任何 S0 / S1 修复都必须完成直接 TC、同组 TC、相关 suite、release redline 或 redaction check 的复验,并保留 run-scoped artifact 与 report。关闭证据必须回指 `artifacts/test/<run_id>`、`reports/runs/<run_id>` 和必要的 `reports/acceptance`。
```

## 9. 待确认事项

无阻塞进入 Step 13 的待确认事项。

后续必须继续收口:

- Step 13 将把 S2 / S3、P1 / P2 和 readiness 缺口展开为风险接受与遗留项表。
- Step 14 将根据 VETO、S0 / S1、S2 风险接受和证据完整性给出最终结论模板。
- Step 15 汇总正式文档时必须保证 §12 不重新定义测试用例,只承接缺陷裁决。

## 10. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| 缺陷等级定义清楚 | 通过 | S0 / S1 / S2 / S3 已定义 |
| 对结论影响可判定 | 通过 | 通过 / 有条件通过 / 不通过 / 送验不成立均有规则 |
| 复验规则明确 | 通过 | S0、S1、S2、flaky、timeout、dependency、config 均有复验口径 |
| 风险接受边界明确 | 通过 | S0 / S1 不可接受,S2 / S3 进入 Step 13 |
| 放行规则明确 | 通过 | 通过、有条件通过、不通过和暂停均已定义 |
| 可以进入 Step 13 | 通过 | 下一步定义风险接受与遗留项 |
