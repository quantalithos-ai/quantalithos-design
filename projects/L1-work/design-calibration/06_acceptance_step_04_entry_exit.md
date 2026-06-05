# Step 4. 定义进入条件与退出条件

> 本文件是 `projects/L1-work/06-验收标准.md` 的 Step 4 中间产物。
> 本步定义什么时候可以开始正式验收、什么时候可以结束正式验收。
> 本步不裁决最终结论,不替代 Step 5~Step 14 的具体门禁、缺陷、风险和签署规则。

## 1. Step 状态

- 状态: `[~] 已生成,待用户审核`
- 对应 SOP: `standards/document/验收标准讨论流程_SOP.md` Step 4
- 回填章节: `projects/L1-work/06-验收标准.md` §4 进入条件与退出条件
- 生成日期: 2026-06-04

## 2. 本步输入

| 输入 | 内容 | 本步使用方式 |
|---|---|---|
| Step 3 验收基线 | 文档、实现、构建、环境、配置、数据、`run_id` 和证据路径基线规则 | 转为验收进入条件 |
| `05-测试方案.md` §12 | 测试进入 / 退出准则、阻断项和文档风险边界 | 转为验收开始前证据条件和退出依据 |
| `05-测试方案.md` §11 | S / A / B / C 缺陷分级、风险接受边界和复验规则 | 转为缺陷阻断进入 / 退出条件 |
| `05-测试方案.md` §13 | artifact、report、evidence index、redaction、acceptance handoff 路径 | 转为证据和报告进入条件 |
| Step 2 范围 | P0 / P1 / P2 口径和一票否决候选 | 转为退出结论和风险接受前置 |

已确认结论:

```text
测试退出不等于验收自动通过。
测试退出准则是验收输入;验收还必须检查基线、证据、一票否决、缺陷、风险接受和最终签署。
没有固定 implementation commit、build、run_id、reports 和 acceptance handoff 时,不能开始正式验收。
```

## 3. SOP 问题回答

### 3.1 开始验收前哪些基线必须确认?

开始正式验收前必须确认以下基线。任一 P0 基线缺失时,只能继续完善验收标准草案,不能进入正式验收裁决。

| 基线 | 进入条件 | 缺失时处理 |
|---|---|---|
| 文档基线 | `00`~`05` 的 commit / version 已固定 | 阻断正式验收 |
| 实现基线 | `/home/aris/Projects/quantalithos-work` 的 implementation commit 已固定 | 阻断正式验收 |
| 构建基线 | build id、package 或 image digest 已固定;如无构建产物则说明源码送验 | 阻断正式验收 |
| 依赖基线 | `core-contracts` commit 已固定;无非 core sibling path dependency | 阻断正式验收 |
| 环境基线 | P0 裁决使用的 environment id / profile 已固定 | 阻断正式验收 |
| 配置基线 | config source summary 和 config digest 已固定 | 阻断正式验收 |
| 数据基线 | dataset id、fixture version、snapshot digest 或 replay bundle 已固定 | 阻断正式验收 |
| 运行基线 | `run_id` 已固定,且不为 `latest` | 阻断正式验收 |
| 证据基线 | artifact、report、acceptance handoff 路径已存在并可读取 | 阻断正式验收 |

### 3.2 哪些测试证据必须先生成?

开始验收前必须生成并可读取以下证据。没有这些证据时,无法裁决 P0。

| 证据 | 路径 | 进入要求 |
|---|---|---|
| 原始 artifact | `artifacts/test/<run_id>/...` | 目录存在,包含 suite report、safe logs、failure reason、snapshot digest 或 redaction scan |
| gate results | `reports/runs/<run_id>/gate-results.md` | 列出阻断 / 非阻断 gate 结果 |
| evidence index | `reports/runs/<run_id>/evidence-index.md` | 每个 P0 `EV-WORK-*` 可回指 `TC-WORK-*`、`AC-WORK-*` 和设计契约 |
| redaction report | `reports/runs/<run_id>/redaction-check.md` | raw secret / token / payload / source body 零命中或列明阻断 |
| release summary | `reports/runs/<run_id>/release-summary.md` | 说明 release gate、redline、defect status 和 evidence pack |
| acceptance handoff | `reports/acceptance/handoff.md` | 提供送验事实、开放问题和残余风险入口,不写最终裁决 |
| veto checklist | `reports/acceptance/veto-checklist.md` | 初步列明 `VF-WORK-*` / redline 是否触发 |
| risk acceptance draft | `reports/acceptance/risk-acceptance.md` | 如存在 B / C 或 P1/P2 风险,记录候选风险和接受状态 |

### 3.3 哪些缺陷会阻断进入验收?

以下缺陷会阻断正式验收进入:

| 缺陷 / 状态 | 是否阻断进入 | 处理 |
|---|---|---|
| 已知 S 级缺陷未关闭 | 是 | 修复并复验后重新生成证据 |
| 已知 P0 A 级缺陷未关闭 | 是 | 修复并复验;除非上游正式降级 P0 范围 |
| release redline 失败 | 是 | 修复 redline 并重跑 release gate |
| evidence index 缺 P0 `EV-WORK-*` | 是 | 补证据或回到测试方案修正覆盖 |
| `latest` 或错误 artifact / report 路径 | 是 | 修正路径并重跑 path check |
| raw secret / token / payload / source body 命中 | 是 | 修复 redaction 并重跑 |
| B / C 缺陷 | 否,但必须记录 | 进入风险 / 遗留项候选 |
| P1 / P2 selected run 失败 | 否,除非污染 P0 truth 或证据 | 进入风险 / 条件通过讨论 |

### 3.4 退出验收需要哪些结论?

退出验收必须形成以下结论。退出不等于通过;退出可以是通过、有条件通过或不通过。

| 退出结论 | 必填内容 |
|---|---|
| P0 门禁结论 | Step 5~Step 10 的 P0 门禁逐项通过 / 失败 / 不适用,并有证据 |
| 一票否决结论 | Step 11 的 `VF-WORK-*` / redline 是否触发 |
| 缺陷结论 | S / A / B / C 缺陷状态、复验 run 和残余风险 |
| 证据结论 | `EV / TC / AC / design_contract_refs` 可追溯,路径固定,无 forbidden output |
| 风险结论 | B / C、P1/P2、selected run、非阻断 nightly / staging-like 风险是否接受 |
| 最终裁决 | 通过 / 有条件通过 / 不通过,不得使用“基本通过”等模糊结论 |
| 签署结论 | 验收人、风险接受人、时间、基线和归档路径 |

### 3.5 哪些风险必须先接受?

以下风险必须在有条件通过前明确接受;否则不能给出有条件通过。

| 风险类型 | 是否可接受 | 接受前提 |
|---|---|---|
| S 级 / 一票否决 | 否 | 不适用 |
| P0 A 级主线失败 | 原则上否 | 只有上游正式降级 P0 范围后才可重新裁决 |
| A 级非主线但影响 selected release gate | 可评审 | root cause、影响范围、绕行、补测计划、截止时间、接受人明确 |
| B / C 缺陷 | 可接受 | 不影响 P0 gate、证据完整、一票否决和安全红线 |
| P1 / P2 未覆盖 | 可接受 | 明确不在当前 P0,并进入后续专项 |
| 非阻断 nightly / staging-like 失败 | 可接受 | 不影响 P0 truth、证据和 release redline |
| 旧性能数字未硬化 | 可接受 | `AC-WORK-024` 只作观察,后续专项记录 |

## 4. 当前文档问题诊断

| 位置 | 当前问题 | 影响 | 本步处理 |
|---|---|---|---|
| 旧 `06-验收标准.md` §3 | 进入 / 退出条件仍是旧草案,缺少 run_id、evidence index、redaction、acceptance handoff | 无法判断何时可正式验收 | 重建进入 / 退出 checklist |
| 旧 `06-验收标准.md` §3 | 使用“02/03/05 已冻结”等模糊条件 | 与新版 `00~05` 和 Step 3 基线规则不一致 | 改为 commit / version / path 可判定条件 |
| 旧 `06-验收标准.md` §8 / §9 | 缺陷和风险规则过粗 | 不能支持有条件通过或不通过 | 引用 `05` §11 / §12 并在验收层裁决 |
| 当前实际状态 | 真实 build、run_id、reports 和 acceptance handoff 尚未生成 | 当前不能进入正式验收 | 标为进入条件前置 |
| `05-测试方案.md` §12 | 测试退出准则已定义 | 测试退出需转译为验收输入,不能自动等同于验收通过 | 本步区分测试退出和验收退出 |

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 进入条件 | 文档冻结、数据可构造、接缝足够 | 文档 / 实现 / 构建 / 依赖 / 环境 / 配置 / 数据 / run / 证据全固定 | 验收必须可复核 |
| 测试证据 | 泛化写“测试报告” | 固定 artifact、gate results、evidence index、redaction、release summary、acceptance handoff | 支撑裁决 |
| 缺陷阻断 | 仅写 S 级缺陷 | S、P0 A、release redline、evidence / path / redaction 失败均阻断进入 | 与新版测试方案一致 |
| 退出条件 | 全部 P0 通过、一票否决满足、无 S 级 | 增加三值结论、缺陷复验、风险接受和签署归档 | 验收需要正式裁决闭环 |
| 风险接受 | 遗留问题进入清单 | 明确哪些可接受、哪些不可接受、接受前提是什么 | 支撑有条件通过 |

## 6. 验收裁决取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A: 直接复用 `05` 的测试进入 / 退出准则 | 简洁,不重复 | 测试退出不是验收裁决,缺少签署和风险接受 | 不采用 |
| 方案 B: 以 `05` 为输入,在 `06` 追加验收进入 / 退出裁决条件 | 区分测试证据和验收结论,可支持三值裁决 | 条件更多,需要后续 Step 5~14 继续细化 | 采用 |
| 方案 C: 等真实 run 完成后再定义条件 | 可用真实状态填充 | 当前无法继续生成验收标准 | 不采用 |

推荐方案 B。

原因:

- 验收标准是裁决文档,必须在测试证据之外检查基线、缺陷、风险和签署。
- Step 3 已明确当前缺真实 run;Step 4 应把缺口转成进入条件,不是阻断文档继续设计。
- 有条件通过必须有清晰风险接受边界,不能由测试方案代替。

## 7. 结构化中间产物

### 7.1 进入条件

- [ ] `00-需求文档.md`、`01-架构设计.md`、`02-概要设计.md`、`03-详细设计.md`、`04-配置设计.md`、`05-测试方案.md` 的 commit / version 已固定。
- [ ] `/home/aris/Projects/quantalithos-work` 的 implementation commit 已固定。
- [ ] build id、package 或 image digest 已固定;如源码送验,已明确无独立构建产物。
- [ ] `core-contracts` 依赖基线已固定,且无非 core sibling path dependency。
- [ ] P0 裁决环境、配置 profile、config digest、dataset id / snapshot digest / replay bundle 已固定。
- [ ] `run_id` 已固定,且不为 `latest`。
- [ ] `artifacts/test/<run_id>/...` 已生成并可读取。
- [ ] `reports/runs/<run_id>/gate-results.md` 已生成并可读取。
- [ ] `reports/runs/<run_id>/evidence-index.md` 已生成,且 P0 `EV-WORK-*` 可回指 `TC-WORK-*`、`AC-WORK-*` 和设计契约。
- [ ] `reports/runs/<run_id>/redaction-check.md` 已生成,且无 raw secret / token / payload / source body 命中。
- [ ] `reports/runs/<run_id>/release-summary.md` 已生成并列明 release gate / redline / defect status。
- [ ] `reports/acceptance/handoff.md` 已生成,且只写送验事实、开放问题和残余风险入口,不写最终裁决。
- [ ] `reports/acceptance/veto-checklist.md` 已生成。
- [ ] `reports/acceptance/risk-acceptance.md` 已生成;如无风险,明确写无待接受风险。
- [ ] 已知 S 级缺陷为 0。
- [ ] 已知 P0 A 级缺陷为 0。
- [ ] release redline、evidence path、redaction 和 fake marker 检查没有阻断项。

### 7.2 退出条件

- [ ] Step 5 功能验收门禁已有逐项结论和证据。
- [ ] Step 6 数据边界与架构红线验收已有逐项结论和证据。
- [ ] Step 7 接口、事件与跨仓同步验收已有逐项结论和证据。
- [ ] Step 8 状态机、事务与一致性验收已有逐项结论和证据。
- [ ] Step 9 非功能验收门禁已有逐项结论和证据。
- [ ] Step 10 可观测性、审计与证据门禁已有逐项结论和证据。
- [ ] Step 11 一票否决项已逐项判定。
- [ ] S 级缺陷为 0。
- [ ] 影响 P0 gate、release gate 或 P0 evidence 的 A 级缺陷为 0,或已有上游正式降级证明。
- [ ] B / C 缺陷已记录影响范围、处理计划、是否接受和责任人。
- [ ] P1/P2 未覆盖项、selected run 失败和非阻断结果已进入风险 / 遗留项。
- [ ] 风险接受表已由具名接受人确认,且没有不可接受风险。
- [ ] 最终结论只使用通过 / 有条件通过 / 不通过三值之一。
- [ ] 最终结论已绑定 `<design_commit_or_version>`、`<implementation_commit>`、`<run_id>` 和 reports 路径。
- [ ] 签署和归档路径已记录。

### 7.3 进入 / 退出关系图

#### 验收裁决图: 从送验输入到退出结论

```text
Entry baseline fixed
  -> implementation / build / config / data / run_id
  -> artifacts + reports + acceptance handoff
  -> no known S or P0 A blocker
        |
        v
Acceptance review
  -> function gates
  -> redline gates
  -> interface / state / NFR / evidence gates
  -> veto check
  -> defect and risk review
        |
        v
Exit conclusion
  -> pass / conditional pass / fail
  -> signoff + archive
```

关键说明:

- 进入验收前必须先有固定基线和证据包。
- 测试退出准则是验收输入,不是自动通过结论。
- 有条件通过必须先完成风险接受。
- 一票否决触发时直接进入不通过或重新修复后复验。

## 8. 验收输入影响判定

| 验收结论 | 是否影响上游设计 / 测试 | 影响类型 | 回写位置 | 处理状态 |
|---|---|---|---|---|
| 确认正式验收进入前必须固定文档、实现、构建、依赖、环境、配置、数据、run 和证据基线 | 否 | 验收门禁规则 | 无 | 无回写 |
| 确认测试退出不等于验收自动通过 | 否 | 验收裁决规则 | 无 | 无回写 |
| 确认 S / P0 A / release redline / evidence path / redaction / fake marker 阻断进入或退出 | 否 | 缺陷与证据门禁 | 无 | 无回写 |
| 确认风险接受是有条件通过前置 | 否 | 风险裁决规则 | Step 13 / Step 14 | 待后续 Step |

说明:

```text
本步没有改变测试方案、缺陷分级或报告路径。
本步把测试方案中的进入 / 退出准则提升为验收开始和结束的可判定条件。
```

## 9. 回填草稿

正式 `06-验收标准.md` §4 建议采用以下结构:

```text
4. 进入条件与退出条件
  4.1 进入条件
  4.2 退出条件
  4.3 进入阻断项
  4.4 退出阻断项
  4.5 测试退出与验收退出的关系
```

正文草稿:

```text
正式验收开始前必须先固定文档、实现、构建、依赖、环境、配置、数据、`run_id` 和证据路径。测试方案退出准则只是验收输入,不自动等同于验收通过。

验收退出必须形成通过 / 有条件通过 / 不通过三值结论之一,并完成功能、红线、接口、状态、一致性、非功能、证据、一票否决、缺陷、风险和签署归档闭环。
```

## 10. 待确认事项

无阻塞进入 Step 5 的待确认事项。

后续 Step 必须继续收口:

- Step 5 定义功能验收门禁。
- Step 6 定义数据边界与架构红线验收。
- Step 10 定义证据完整性和 redaction 门禁。
- Step 11 定义一票否决项。
- Step 13 / Step 14 定义风险接受和最终签署。

## 11. 进入下一步条件

- [x] 正式验收进入条件已经列成可判定 checklist。
- [x] 正式验收退出条件已经列成可判定 checklist。
- [x] 测试退出和验收退出已经区分。
- [x] 阻断进入 / 退出的缺陷和证据条件已经列明。
- [x] 风险接受作为有条件通过前置已经列明。
- [ ] 用户审核并确认本 Step。
