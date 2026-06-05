# Step 12. 定义缺陷分级、复验与放行规则

> 本文件是 `projects/L1-work/06-验收标准.md` 的 Step 12 中间产物。
> 本步把缺陷分级、复验矩阵、缺陷记录字段和放行规则转成可裁决验收门禁。
> 本步不批准风险接受,不写最终结论,不新增测试用例或 release gate。

## 1. Step 状态

- 状态: `[~] 已生成,待用户审核`
- 对应 SOP: `standards/document/验收标准讨论流程_SOP.md` Step 12
- 回填章节: `projects/L1-work/06-验收标准.md` §12 缺陷分级、复验与放行规则
- 生成日期: 2026-06-04

## 2. 本步输入

| 输入 | 内容 | 本步使用方式 |
|---|---|---|
| `05-测试方案.md` §11 | S / A / B / C 分级、风险接受边界、修复后回归矩阵、缺陷记录字段 | 缺陷和复验主来源 |
| `05-测试方案.md` §12 | 进入 / 退出准则、退出阻断项 | 放行规则来源 |
| `05-测试方案.md` §14 | 不允许进入残余风险的项目 | 风险接受边界来源 |
| `design-calibration/06_acceptance_step_11_veto.md` | `VETO-WORK-*`、veto checklist、不可风险接受规则 | S 级和 veto 优先级来源 |
| Step 1~10 中间产物 | 验收基线、P0 门禁、证据路径、redline、evidence gate | 分级和复验证据边界来源 |

已确认结论:

```text
一票否决项优先于缺陷分级。
S 级、veto failed、release redline、P0 evidence 缺失、redaction failed、重复 truth 和 `latest` 证据路径不得风险接受。
A 级缺陷默认阻断受影响 P0 / release gate;只有上游正式降级 P0 范围后,才可能改变裁决边界。
B / C 级缺陷只有在不影响 P0 gate、证据完整且无 veto 时,才可进入后续风险接受或排期。
```

## 3. SOP 问题回答

### 3.1 S/A/B 缺陷如何定义?

本轮验收沿用 `05-测试方案.md` 的 S / A / B / C 四级,其中 SOP 提到的 S/A/B 在本项目中补 C 级以承接文档和低风险整理项。

| 缺陷级别 | 定义 | 示例 |
|---|---|---|
| S | 一票否决、P0 核心闭环断裂、truth / security / evidence redline、release gate redline 或无法复核证据 | Work 保存相邻仓正文、raw secret 泄露、duplicate 产生第二 WorkItem、`latest` 进入正式证据 |
| A | P0 主线能力、P0 service / API / job 编排、状态机、事务、恢复或配置失败,但未触发一票否决 | `CreateWorkItem` happy path 失败、projection rebuild failed 后不能恢复 |
| B | P1/P2、非阻断专项、报告表达、低风险 fixture 或局部稳定性问题 | staging-like smoke 失败、性能观察报告缺非必填字段 |
| C | 文档错字、非事实源说明、测试描述清晰度或不影响执行的整理项 | 中间产物措辞不统一 |

### 3.2 每级缺陷对验收结论有什么影响?

| 缺陷级别 | 对验收结论的影响 |
|---|---|
| S | 不得通过,不得有条件通过;必须修复并复验 |
| A | 阻断受影响 P0 / release gate;影响 P0 gate 或 release gate 时不得通过 |
| B | 不直接阻断 P0,但必须记录影响、owner、后续动作;是否支持有条件通过由 Step 13 裁决 |
| C | 不影响验收结论,但不得改变事实源、编号、证据和执行口径 |

### 3.3 修复后如何复验?

修复后复验必须至少覆盖 direct failed test、同族 family、受影响 suite / gate、redline / evidence check。S / A 缺陷必须新增或更新自动化防回归。

| 缺陷影响面 | 必回归 | 新增自动化要求 |
|---|---|---|
| Contract / DTO / refs | direct contract test、`api-contract-fast`、同对象 roundtrip | S / A 必须新增 roundtrip 或 negative test |
| Domain state / policy | direct domain transition test、同状态机非法迁移、`unit-contract-domain` | S / A 必须新增状态或 policy 断言 |
| Application service / UoW | 直接 `TC-WORK-*`、同族 family、`service-core` / `service-all` | S / A 必须新增 rollback / no side effect 断言 |
| Repository / projection | direct repository / integration test、`integration-p0`、相关 `QUERY` / `OPS` | S / A 必须新增 source truth / no-write 断言 |
| Idempotency / concurrency | `CORE-004`、`NFR-004`、same key conflict、version conflict | S / A 必须新增 duplicate / conflict 防回归 |
| Config / redaction | `CFG-*`、`NFR-003`、`config-fast`、`config-redaction` | S / A 必须新增 config 或 scan case |
| Handoff / outbox / job recovery | `OPS-*`、`worker-job-contract`、`consumer-outbox` | S / A 必须新增 failure injection / rerun 断言 |
| Report / evidence path | path check、evidence index check、`release-evidence-pack` | S 必须新增 path / evidence check fixture |

### 3.4 哪些缺陷可以风险接受?

| 缺陷类型 | 是否可风险接受 | 条件 |
|---|---|---|
| S 级 | 否 | 不适用 |
| A 级 P0 主线失败 | 原则上否 | 只有上游正式降级 P0 范围后才可改变 |
| A 级非主线但影响 release gate | 仅可评审,不得自动接受 | 需要 root cause、绕行说明、影响范围、补测计划、无 S 级触发证明 |
| B 级 | 可进入 Step 13 评审 | 不影响 P0 gate、证据完整、无一票否决 |
| C 级 | 可随批处理 | 不影响事实源、编号、执行和证据 |

本步只定义“可否进入风险接受评审”,不批准任何具体风险。具体接受人、截止时间和后续动作留给 Step 13。

### 3.5 哪些缺陷必须阻断下一阶段?

| 阻断项 | 处理 |
|---|---|
| 任一 S 级缺陷未关闭 | 阻断退出,必须修复并复验 |
| 任一 `VETO-WORK-*` failed | 阻断通过 / 有条件通过,不得风险接受 |
| 影响 P0 gate、release gate 或 P0 evidence 的 A 级缺陷未关闭 | 阻断退出,除非上游正式降级 P0 范围 |
| release redline 失败 | 阻断退出,不得风险接受 |
| raw secret / token / payload / source body 命中 | 阻断退出,修复后重跑 redaction |
| Work truth 被 query / projection / report / adjacent input 反写 | 阻断退出,修复并补自动化 |
| duplicate 产生重复 truth | 阻断退出,修复幂等并回归 |
| evidence index 缺 P0 `EV-WORK-*` 或引用 `latest` | 阻断 release evidence pack |
| configured adapter 自动 fake success | 阻断退出,修复 fake marker 和 unavailable 处理 |

## 4. 当前文档问题诊断

| 位置 | 当前问题 | 影响 | 本步处理 |
|---|---|---|---|
| 旧 `06-验收标准.md` | 缺陷规则与新版 S/A/B/C、veto 和证据红线未闭合 | 无法判断缺陷对通过 / 有条件通过 / 不通过的影响 | 重建分级与复验规则 |
| Step 11 | 已定义 veto,但非 veto 缺陷如何处理尚未裁决 | 缺陷和风险接受边界不清 | 本步定义 S/A/B/C 和放行规则 |
| `05-测试方案.md` §11 | 已有缺陷分级和回归矩阵 | 需要转成验收门禁 | 本步承接 |
| `05-测试方案.md` §12 / §14 | 已有退出阻断项和不可残余风险项 | 需要进入验收放行规则 | 本步承接 |

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 缺陷级别 | 旧 06 未稳定区分 veto / S / A / B / C | 明确 veto 优先,S/A/B/C 分级 | 可裁决 |
| 复验 | 泛化“修复后复测” | 固定 direct / family / suite / redline / evidence check | 防止漏回归 |
| 自动化防回归 | 未作为验收条件 | S / A 必须新增或更新自动化 | 防止同类复发 |
| 风险接受 | 缺陷可否接受边界不清 | S / veto / release redline / P0 evidence 缺失不可接受 | 对齐 Step 11 和 `05` |
| 放行 | 泛化通过 / 不通过 | 绑定 P0 gate、release gate、evidence pack 和缺陷关闭状态 | 可执行 |

## 6. 验收裁决取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A: 所有 P0 失败都按一票否决处理 | 严格 | 与 Step 11 边界冲突,风险接受无意义 | 不采用 |
| 方案 B: veto 优先,S/A/B/C 分级处理;S/A 阻断规则明确,B/C 进入风险或排期 | 与 `05` 一致,可复验 | 需要 Step 13 继续处理具体风险接受 | 采用 |
| 方案 C: 只按测试 suite pass / fail 判定 | 简单 | 无法表达证据、redline、风险和局部缺陷 | 不采用 |

推荐方案 B。

原因:

- 验收标准需要支持三值结论,不能把所有缺陷都压成 veto。
- S / A / B / C 已在 `05` 中形成正式测试口径。
- Step 12 负责缺陷和复验,Step 13 才负责具体风险接受。

## 7. 结构化中间产物

### 7.1 缺陷分级表

| 缺陷级别 | 定义 | 对结论的影响 | 复验要求 |
|---|---|---|---|
| S | 一票否决、P0 核心闭环断裂、truth / security / evidence redline、release gate redline 或无法复核证据 | 不得通过 / 有条件通过;必须修复 | direct failed test + impacted family + release redline + evidence pack;新增自动化防回归 |
| A | P0 主线、service / API / job、状态机、事务、恢复或配置失败,但未触发一票否决 | 阻断受影响 P0 / release gate;影响 P0 时不得通过 | direct failed test + impacted suite / gate;新增自动化防回归 |
| B | P1/P2、非阻断专项、报告表达、低风险 fixture 或局部稳定性问题 | 不直接阻断 P0;可进入 Step 13 风险接受评审 | 精准复验或排期;记录 owner、影响和截止条件 |
| C | 文档错字、非事实源说明、测试描述清晰度或不影响执行的整理项 | 不影响结论 | 随文档批次修复;确认不影响事实源和证据 |

### 7.2 放行规则表

| 裁决场景 | 放行规则 |
|---|---|
| 任一 veto failed | 不得通过 / 有条件通过 |
| S 级缺陷未关闭 | 不得通过 / 有条件通过 |
| 影响 P0 gate / release gate / P0 evidence 的 A 级缺陷未关闭 | 不得通过;除非上游正式降级 P0 范围 |
| P0 suite 或 release gate 未通过 | 不得通过 |
| P0 evidence index / gate results / redaction / veto checklist 缺失 | 不得通过 / 有条件通过 |
| 仅存在 B 级缺陷 | 可进入 Step 13 风险接受评审;未接受前不得有条件通过 |
| 仅存在 C 级缺陷 | 可通过或有条件通过,但需记录修复计划 |
| P1/P2 未覆盖专项 | 不阻断 P0,但必须进入 Step 13 风险或后续专项 |

### 7.3 修复后复验矩阵

| 缺陷影响面 | 必须复验 | 关闭条件 |
|---|---|---|
| Contract / DTO / refs | direct contract test、`api-contract-fast`、roundtrip / negative | 新旧 DTO / ref schema 与 evidence 一致 |
| Domain state / policy | direct domain test、非法迁移、`unit-contract-domain` | 状态和错误符合 `03`,无非法副作用 |
| Application / UoW | direct `TC-WORK-*`、family、`service-core` / `service-all` | accepted / rejected / duplicate 副作用符合 Step 8 |
| Repository / projection | repository / integration、`integration-p0`、`QUERY` / `OPS` | no-write、source truth、projection stale / fresh 正确 |
| Idempotency / concurrency | `CORE-004`、`NFR-004`、conflict、version conflict、commit unknown | 无重复 truth、无盲重试、single-winner 成立 |
| Config / redaction | `CFG-*`、`config-fast`、`config-redaction`、redaction report | fail-fast / fail-closed、forbidden output 零命中 |
| Job / outbox / handoff | `OPS-*`、`worker-job-contract`、`consumer-outbox` | failure marker、rerun 幂等、no truth repair |
| Report / evidence | path check、evidence index、`release-evidence-pack` | `<run_id>` 固定、EV 可回指 AC / TC / artifact |

### 7.4 缺陷记录最小字段

| 字段 | 必填 | 说明 |
|---|---|---|
| `defect_id` | 是 | 稳定缺陷编号 |
| `severity` | 是 | S / A / B / C |
| `source_gate` | 是 | PR / main / nightly / release / manual review |
| `suite` | 是 | 失败 suite 或 review source |
| `test_case_ids` | 是 | 一个或多个 `TC-WORK-*` |
| `evidence_ids` | 是 | 一个或多个 `EV-WORK-*` 或 redline report |
| `affected_requirements` | 是 | `FR-WORK-*` / `BR-WORK-*` / `AC-WORK-*` |
| `run_id` | 是 | 失败 run id,不得写 `latest` |
| `artifact_refs` | 是 | `artifacts/test/<run_id>/...` |
| `report_refs` | 是 | `reports/runs/<run_id>/...` |
| `root_cause` | S / A 必填 | 设计缺口、实现缺陷、fixture、环境、脚本、文档等 |
| `fix_ref` | 修复后必填 | commit / patch / design baseline |
| `retest_run_id` | 关闭前必填 | 复验 run id |
| `regression_scope` | 关闭前必填 | direct、family、suite、redline、evidence check |
| `residual_risk` | A / B 必填 | 若未全量修复,进入 Step 13 |

### 7.5 缺陷裁决图

#### 缺陷裁决图: Veto / Severity / Release

```text
Defect found
  -> veto check
        |
        +-- veto failed
        |     -> S
        |     -> no pass / no conditional pass
        |
        +-- no veto
              -> severity S / A / B / C
                    |
                    +-- S -> must fix and retest
                    +-- A -> blocks affected P0 / release gate
                    +-- B -> Step 13 risk acceptance review
                    +-- C -> record and batch fix
```

关键说明:

- veto failed 直接进入 S 级阻断。
- A 级缺陷不会自动变成 veto,但会阻断受影响 P0 / release gate。
- B / C 不能隐藏证据缺失、redaction 失败或 P0 主线失败。
- 风险接受只在 Step 13 对非阻断遗留项裁决。

## 8. 验收输入影响判定

| 验收结论 | 是否影响上游设计 / 测试 | 影响类型 | 回写位置 | 处理状态 |
|---|---|---|---|---|
| 确认 S / A / B / C 分级承接 `05-测试方案.md` | 否 | 缺陷分级门禁承接 | 无 | 无回写 |
| 确认 veto failed、S 级、release redline、P0 evidence 缺失不得风险接受 | 否 | 风险接受边界承接 | Step 13 | 待后续 Step |
| 确认 S / A 缺陷必须新增或更新自动化防回归 | 否 | 复验门禁承接 | 无 | 无回写 |
| 确认普通 P0 gate 失败不自动升级为 veto,但仍按 A 或 S 阻断受影响 gate | 否 | 缺陷裁决边界 | 无 | 无回写 |

说明:

```text
本步没有新增缺陷级别、测试用例、suite、EV 字段或 release gate。
本步只把 `05` 已确认的缺陷管理和复验口径转成验收裁决规则。
```

## 9. 回填草稿

正式 `06-验收标准.md` §12 建议采用以下结构:

```text
12. 缺陷分级、复验与放行规则
  12.1 缺陷分级
  12.2 缺陷对验收结论的影响
  12.3 修复后复验矩阵
  12.4 缺陷记录最小字段
  12.5 放行规则
```

正文草稿:

```text
本章用于裁决缺陷如何影响 `L1-work` 的通过、有条件通过或不通过结论。一票否决项优先于缺陷分级;任一 `VETO-WORK-*` failed 直接阻断通过和有条件通过。S 级缺陷、release redline、P0 evidence 缺失、redaction failed、重复 truth、`latest` 证据路径和核心边界配置越界不得风险接受。

缺陷按 S / A / B / C 分级。S 级必须修复并复验;A 级阻断受影响 P0 / release gate,影响 P0 gate 或 release gate 时不得通过;B 级可进入 Step 13 风险接受评审;C 级可随文档或低风险批次修复。S / A 缺陷修复后必须新增或更新自动化防回归,并从 direct failed test 扩展到 impacted family、suite、redline 和 evidence check。
```

## 10. 待确认事项

无阻塞进入 Step 13 的待确认事项。

后续 Step 必须继续收口:

- Step 13 将 B 级、C 级、P1/P2 未覆盖专项和非阻断残余风险转成风险接受表。
- Step 13 必须再次排除 S 级、veto failed、release redline、P0 evidence 缺失和 raw secret / body 泄露。
- Step 14 将依据 veto checklist、缺陷分级和风险接受表生成最终结论口径。

## 11. 进入下一步条件

- [x] S / A / B / C 缺陷定义已经列明。
- [x] 每级缺陷对验收结论的影响已经列明。
- [x] 修复后复验要求已经列明。
- [x] 可风险接受和不可风险接受缺陷边界已经列明。
- [x] 阻断下一阶段的缺陷已经列明。
- [ ] 用户审核并确认本 Step。
