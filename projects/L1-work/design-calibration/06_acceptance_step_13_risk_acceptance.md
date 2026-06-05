# Step 13. 定义风险接受与遗留项

> 本文件是 `projects/L1-work/06-验收标准.md` 的 Step 13 中间产物。
> 本步把有条件通过所需的风险接受结构、候选残余风险、不可接受风险和风险移交口径转成可裁决验收门禁。
> 本步不批准任何具体风险,不改变 P0 范围,不生成最终验收结论。

## 1. Step 状态

- 状态: `[x] 已确认`
- 对应 SOP: `standards/document/验收标准讨论流程_SOP.md` Step 13
- 回填章节: `projects/L1-work/06-验收标准.md` §13 风险接受与遗留项
- 生成日期: 2026-06-04

## 2. 本步输入

| 输入 | 内容 | 本步使用方式 |
|---|---|---|
| `05-测试方案.md` §11 | 风险接受边界、S / A / B / C 缺陷分级 | 确认哪些缺陷可进入风险接受评审 |
| `05-测试方案.md` §14 | 残余风险表、不允许进入残余风险的项目、风险移交 | 候选遗留项主来源 |
| `design-calibration/06_acceptance_step_09_non_functional_gate.md` | production-like、secret provider、config center、hot reload、old P95 SLA 等未覆盖专项 | 风险候选来源 |
| `design-calibration/06_acceptance_step_10_observability_evidence.md` | `risk-acceptance.md` 必须有接受人、owner、后续动作和截止条件 | 风险接受证据格式来源 |
| `design-calibration/06_acceptance_step_11_veto.md` | `VETO-WORK-*`、release redline、不可风险接受规则 | 排除不可接受风险 |
| `design-calibration/06_acceptance_step_12_defect_retest_release.md` | B / C 缺陷可进入风险接受评审,S / A 阻断规则 | 缺陷到风险的承接边界 |

已确认结论:

```text
风险接受只可能支撑有条件通过,不能支撑通过。
没有接受人、责任人、后续动作和截止时间的风险不能支撑有条件通过。
任一 veto failed、S 级缺陷、release redline、P0 evidence 缺失、redaction failed、重复 truth、`latest` 证据路径或核心边界配置越界不得风险接受。
风险接受不得把 P1/P2 或 production-like 能力反写为 P0 已通过。
```

## 3. SOP 问题回答

### 3.1 哪些风险可以支持有条件通过?

只有同时满足以下条件的风险,才可作为有条件通过的依据:

| 条件 | 要求 |
|---|---|
| P0 主线成立 | 核心闭环、正式工作事实、P0 协议、状态、事务、配置红线和证据闭环均已通过 |
| 无不可接受风险 | 无 veto failed、S 级、release redline、P0 evidence 缺失或安全红线 |
| 风险不改变 P0 范围 | 风险只属于 B / C 缺陷、P1/P2 未覆盖专项、非阻断 nightly / staging-like 结果或生产化后续事项 |
| 证据完整 | `reports/runs/<run_id>`、`reports/acceptance/handoff.md`、`veto-checklist.md` 和 `risk-acceptance.md` 可复核 |
| 接受记录完整 | 每项风险有影响、接受理由、后续动作、责任人、接受人和截止时间 |

可支持有条件通过的典型风险:

| 风险类型 | 示例 | 条件 |
|---|---|---|
| B 级缺陷 | 报告表达不完整、低风险 fixture 稳定性问题 | 不影响 P0 gate、证据完整、已有修复计划 |
| C 级缺陷 | 文档措辞、非事实源说明整理 | 不影响事实源、编号、执行和证据 |
| P1 接缝未完全验证 | staging-like selected 失败或未执行 | P0 fake / configured / replay 边界已通过 |
| P2 生产化专项 | 真实 DB / MQ / KMS / Vault / config center / hot reload 未定义 | 已明确不属于本轮 P0,且未被实现伪装成功 |
| 性能候选未硬化 | 旧 `100ms / 300ms` 只观察 | 有观察报告,未把候选写成硬门禁 |

### 3.2 哪些风险不能接受?

以下风险不得进入有条件通过:

| 不可接受项 | 原因 | 处理 |
|---|---|---|
| 任一 `VETO-WORK-*` failed | 一票否决优先于风险接受 | 修复并复验 |
| S 级缺陷 | 代表核心闭环、truth、安全或证据红线失败 | 修复并新增防回归 |
| 影响 P0 gate / release gate / P0 evidence 的 A 级缺陷 | P0 退出条件不成立 | 修复;除非上游正式降级 P0 范围 |
| release redline 失败 | release gate 硬条件失败 | 修复并重跑 release gate |
| raw secret / token / payload / source body 命中 | 安全和正文边界失败 | 修复并重跑 redaction |
| Work truth 被 query / projection / report / adjacent input 反写 | source truth 红线失败 | 修复并补 no-write 自动化 |
| duplicate / commit unknown 产生重复 truth | 幂等一致性红线失败 | 修复并回归 |
| evidence index 缺 P0 `EV-WORK-*` 或使用 `latest` | 证据不可复核 | 补证据或重跑 |
| configured adapter fallback fake success | 外部协作事实被伪造 | 修复 fake marker / unavailable 处理 |

### 3.3 每个风险的接受人是谁?

本步只定义接受角色和记录规则,不替真实验收签署人批准具体风险。

| 风险类别 | 最小接受角色 |
|---|---|
| P1/P2 production-like / durable store / event bus / endpoint | 架构负责人、运维负责人、验收负责人 |
| secret provider / KMS / Vault | 安全负责人、运维负责人、验收负责人 |
| config center / admin override / hot reload | 架构负责人、运维负责人 |
| 性能候选 / 容量模型未硬化 | 产品 / 交付负责人、架构负责人、测试负责人 |
| report / artifact retention 未定 | 测试负责人、实施负责人、运维负责人 |
| nightly extended stress 非阻断失败 | 测试负责人、架构负责人 |
| 外围增强能力未进入 P0 | 产品 / 交付负责人、架构负责人 |
| B / C 缺陷 | 缺陷 owner、测试负责人、验收负责人 |

正式 `reports/acceptance/risk-acceptance.md` 中必须填入具体接受人或可审计的接受角色。只写“团队接受”“后续处理”或“暂不影响”不成立。

### 3.4 后续动作和截止时间是什么?

风险接受必须绑定后续动作和截止条件。

| 风险类型 | 后续动作 | 截止时间口径 |
|---|---|---|
| P1 接缝风险 | 补 selected run、adapter contract、fixture 或 staging-like evidence | 下一轮 P1 接缝验收前 |
| P2 生产化风险 | 补生产化详细设计、配置、测试、部署运维和安全专项 | 进入 production-like / release hardening 前 |
| B 级缺陷 | 建缺陷、排期、修复后精准复验 | 指定 release / iteration / 日期 |
| C 级缺陷 | 随文档或低风险批次修复 | 指定文档整理批次 |
| 性能观察风险 | 固定环境、容量模型、数据规模和阈值来源 | 性能 SLA 升级为硬门禁前 |
| retention / 运维风险 | 补保留周期、归档、清理和访问控制 | 运维手册定稿前 |

### 3.5 风险是否需要同步到实施计划或问题记录?

需要。风险接受不是验收文档内部注释,必须能被下游执行。

| 风险 / 遗留项 | 同步目标 |
|---|---|
| B / C 缺陷 | 缺陷系统或 issue list,并回指 `defect_id` |
| P1 接缝 / selected gate | `07-实施计划.md` 的实施批次、测试命令和证据门禁 |
| production-like / secret / config center / retention | `09-部署与运维手册.md` 或后续生产化专项 |
| 性能 SLA 硬化 | `00-需求文档.md`、`05-测试方案.md`、`06-验收标准.md` 后续版本 |
| 外围增强能力 | 后续需求 / 设计 / 测试专项 |

## 4. 当前文档问题诊断

| 位置 | 当前问题 | 影响 | 本步处理 |
|---|---|---|---|
| 旧 `06-验收标准.md` | 风险接受和最终结论混在一起 | 有条件通过边界不清 | 本步单独定义风险接受结构 |
| Step 10 | 已要求 `risk-acceptance.md`,但未定义可接受风险类型 | 有条件通过证据不足 | 本步补风险类型和字段 |
| Step 11 | 已声明 veto 不可风险接受 | 需要在风险表再次排除 | 本步重复列为硬约束 |
| Step 12 | 已定义 B / C 可进入风险接受评审 | 需要补接受人、owner 和截止时间 | 本步收口 |
| `05-测试方案.md` §14 | 残余风险表已有候选项 | 需要转成验收层风险接受表 | 本步承接 |

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 风险接受 | 泛化“可后续处理” | 固定接受条件、接受人、owner、动作和截止时间 | 可裁决 |
| 不可接受项 | 分散在 Step 10~12 | 集中排除 veto / S / redline / P0 evidence 缺失 | 防止红线降级 |
| 残余风险 | `05` 中作为测试风险移交 | 转成 `06` 有条件通过候选输入 | 支撑最终裁决 |
| 下游同步 | 只说明风险移交 | 明确 issue / `07` / `09` / 后续专项承接 | 防止风险丢失 |
| 接受人 | 仅写角色候选 | 要求正式报告填具体接受人或可审计角色 | 防止无主风险 |

## 6. 验收裁决取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A: 只要 P0 通过,所有 P1/P2 自动进入风险 | 简单 | 风险无 owner / deadline,无法支持有条件通过 | 不采用 |
| 方案 B: 只允许非阻断风险进入接受表,并要求接受人、owner、后续动作和截止时间 | 可裁决,可移交 | 需要真实验收时填写接受记录 | 采用 |
| 方案 C: 不允许任何风险接受,只有通过 / 不通过 | 严格 | 与三值结论和 P1/P2 范围裁剪不一致 | 不采用 |

推荐方案 B。

原因:

- 验收标准需要支持有条件通过,但条件必须可追踪。
- veto、S 级、release redline 和 P0 evidence 缺失不能被包装成风险。
- P1/P2 和生产化专项需要被移交,不能阻塞 P0,也不能被宣称已完成。

## 7. 结构化中间产物

### 7.1 风险接受前置检查表

| 检查项 | 必须满足 | 不满足时裁决 |
|---|---|---|
| P0 gates | 已通过或无阻断缺陷 | 不得有条件通过 |
| Veto checklist | 全部 passed 或明确 not_applicable 且有证据 | 不得通过 / 有条件通过 |
| S 级缺陷 | 无未关闭 S 级 | 不得通过 / 有条件通过 |
| A 级缺陷 | 无影响 P0 / release / P0 evidence 的未关闭 A 级 | 不得通过 |
| Redaction / release redline | 全部通过 | 不得通过 / 有条件通过 |
| Evidence index | P0 `EV-WORK-*` 完整,无 `latest` | 送验不成立 |
| Risk acceptance record | 每项风险有 owner、接受人、动作、截止时间 | 不得有条件通过 |

### 7.2 风险接受候选表

| 风险 / 遗留项 | 影响 | 接受理由 | 后续动作 | 责任人 | 接受人 | 截止时间 |
|---|---|---|---|---|---|---|
| staging-like / production-like 真实依赖未进入 P0 阻断测试 | 真实部署前仍需专项验证 | P0 只裁决 local-dev、ci-test、integration-like、operations-replay 和 controlled seam | P1/P2 前补生产化详细设计、配置、部署运维和 staging-like 测试 | 架构负责人 / 运维负责人 | 架构负责人 / 运维负责人 / 验收负责人 | 进入 production-like 验证前 |
| secret provider / KMS / Vault 未定义 | 真实 secret 读取、轮换、吊销和 fail-closed 不能按 P0 执行 | P0 只允许 ref-only sensitive 和 fake / configured ref,且 redaction 必须通过 | 补 provider、轮换、审计、redaction 和 failure tests | 安全负责人 / 运维负责人 | 安全负责人 / 运维负责人 / 验收负责人 | 启用真实 secret provider 前 |
| config center / admin override / hot reload 未定义 | 未来应急 override 和热更新不能直接落地 | P0 明确 unsupported fail-fast,不阻断核心闭环 | 补权限、审计、reload、回滚、一致性和测试门禁 | 架构负责人 / 运维负责人 | 架构负责人 / 运维负责人 | 进入动态配置专项前 |
| 旧 `100ms / 300ms` 性能候选未升级为硬阈值 | 不能声称满足生产性能 SLA | 当前缺固定环境、容量模型、数据规模和验收来源,只做样本观察 | 若升级,先回写 `00 / 05 / 06` 并补性能专项 | 产品 / 交付负责人 / 架构负责人 / 测试负责人 | 产品 / 交付负责人 / 架构负责人 / 测试负责人 | 性能 SLA 成为硬门禁前 |
| production-like durable store / event bus / endpoint 产品绑定未验证 | 生产事务、重试、超时和部署风险未完全覆盖 | P0 使用 in-memory / fake / controlled adapter 验核心 truth 和接缝 | 补 adapter contract、配置字段、部署手册和 staging evidence | 架构负责人 / 运维负责人 | 架构负责人 / 运维负责人 | 生产化实现前 |
| report / artifact 保留周期未定 | 长期审计和追溯保存策略不完整 | P0 已固定 `<run_id>` 路径和证据字段,不承诺长期 retention | `07` / `09` 或运维规范补 retention、清理、归档和访问控制 | 测试负责人 / 实施负责人 / 运维负责人 | 测试负责人 / 实施负责人 / 运维负责人 | 运维手册定稿前 |
| 非阻断 nightly extended stress 未作为 P0 退出硬条件 | 罕见并发缺陷可能在 P0 退出后暴露 | 当前 P0 阻断核心 suite 和 release gate,nightly extended 为增强信号 | 失败建缺陷;进入 release 前相关 blocker 必须关闭 | 测试负责人 / 架构负责人 | 测试负责人 / 架构负责人 | 下一次 release candidate 前 |
| 外围增强能力未进入 P0 用例全集 | 当前 P0 只证明核心 Work truth 闭环 | 容量趋势、跨项目依赖、组合风险等属于外围增强 | 后续需求 / 设计 / 测试专项单独补 FR / TC / EV | 产品 / 交付负责人 / 架构负责人 | 产品 / 交付负责人 / 架构负责人 | 外围增强立项前 |
| B 级缺陷 | 不直接阻断 P0,但可能影响体验、报告或局部稳定性 | 不影响 P0 gate、证据完整、无 veto | 建缺陷并排期;修复后精准复验 | 缺陷 owner / 测试负责人 | 验收负责人 / 相关领域负责人 | 指定 release / iteration / 日期 |
| C 级缺陷 | 不影响验收结论 | 不影响事实源、编号、执行和证据 | 随文档或低风险批次修复 | 文档 owner | 验收负责人 | 指定文档整理批次 |

### 7.3 不可风险接受清单

| 项目 | 原因 | 处理 |
|---|---|---|
| 任一一票否决项 failed | 交付物不能被接受 | 修复并复验 |
| S 级缺陷 | 核心闭环、truth、安全或证据红线失败 | 修复并新增 / 更新自动化防回归 |
| 影响 P0 gate / release gate / P0 evidence 的 A 级缺陷 | P0 退出条件不成立 | 修复;若要降级必须回写上游范围 |
| raw secret / token / payload / source body 泄露 | 安全红线 | 修复后重跑 redaction |
| Work truth 被 query / projection / report / adjacent input 反写 | source truth 红线 | 修复并补 no-write 自动化 |
| duplicate 产生重复 truth | 幂等一致性红线 | 修复并回归 |
| evidence index 缺 P0 `EV-WORK-*` 或引用 `latest` | 证据不可复核 | 补证据或重跑 evidence pack |
| release redline 失败 | release gate 硬条件 | 修复并重跑 release gate |
| configured adapter fake fallback success | 外部依赖不可用被伪装成功 | 修复 fail-fast / fail-closed / marker |

### 7.4 风险接受记录最小字段

| 字段 | 必填 | 说明 |
|---|---|---|
| `risk_id` | 是 | 稳定风险编号 |
| `risk_title` | 是 | 风险 / 遗留项名称 |
| `risk_type` | 是 | B defect / C defect / P1 seam / P2 specialty / NFR observation / operations |
| `impact` | 是 | 对交付、发布、运维、用户或后续专项的影响 |
| `acceptance_reason` | 是 | 为什么不阻断当前 P0 |
| `non_acceptance_checks` | 是 | 明确无 veto / S / redline / P0 evidence 缺失 |
| `evidence_refs` | 是 | `EV-WORK-*`、report 或 artifact |
| `defect_refs` | 有缺陷时必填 | 对应缺陷 ID |
| `owner` | 是 | 后续动作责任人 |
| `accepted_by` | 是 | 风险接受人 |
| `follow_up_action` | 是 | 后续动作 |
| `deadline` | 是 | 截止时间或阶段门禁 |
| `tracking_ref` | 是 | issue、实施计划条目、运维专项或后续文档引用 |
| `review_status` | 是 | pending / accepted / rejected / closed |

### 7.5 风险移交表

| 风险类型 | 移交目标 | 必须带出的字段 |
|---|---|---|
| B / C 缺陷 | 缺陷系统 / issue list / `reports/acceptance/open-issues.md` | `defect_id`、owner、retest scope、deadline |
| P1 接缝 | `07-实施计划.md` 和后续测试计划 | selected suite、adapter / endpoint、evidence gap、owner |
| P2 生产化 | `09-部署与运维手册.md` 或生产化专项设计 | provider、profile、secret / endpoint、rollback、retention |
| 性能 SLA 硬化 | 后续 `00 / 05 / 06` 更新 | 环境、数据规模、阈值来源、容量模型 |
| 外围增强 | 后续需求 / 设计 / 测试专项 | FR / TC / EV 待新增范围、验收门禁 |

### 7.6 风险接受裁决图

#### 风险接受裁决图: Conditional Pass Only

```text
Acceptance candidate
  -> P0 gates and evidence complete?
        |
        +-- no -> cannot conditional pass
        |
        +-- yes
              -> veto / S / redline / P0 evidence check
                    |
                    +-- failed -> risk acceptance forbidden
                    |
                    +-- passed
                          -> residual risks exist?
                                |
                                +-- no -> Step 14 pass candidate
                                |
                                +-- yes
                                      -> risk-acceptance.md complete?
                                            |
                                            +-- no -> cannot conditional pass
                                            +-- yes -> Step 14 conditional pass candidate
```

关键说明:

- 风险接受只支持有条件通过,不支持通过。
- 没有 `risk-acceptance.md` 或接受记录不完整时,不得有条件通过。
- veto、S 级、release redline 和 P0 evidence 缺失不能风险接受。
- P1/P2 风险被接受后仍不得宣称对应能力已完成。

## 8. 验收输入影响判定

| 验收结论 | 是否影响上游设计 / 测试 | 影响类型 | 回写位置 | 处理状态 |
|---|---|---|---|---|
| 确认风险接受只支撑有条件通过,不支撑通过 | 否 | 验收裁决规则 | 无 | 无回写 |
| 确认无接受人、owner、后续动作、截止时间的风险不得支撑有条件通过 | 否 | 风险接受门禁 | 无 | 无回写 |
| 确认 production-like、secret provider、config center、hot reload、old P95 SLA 硬化等进入 P1/P2 风险承接,不进入 P0 硬门禁 | 否 | 范围裁剪承接 | 无 | 无回写 |
| 确认 veto、S 级、release redline、P0 evidence 缺失、raw secret / body 泄露、重复 truth 和 `latest` 路径不得风险接受 | 否 | 不可接受风险承接 | 无 | 无回写 |

说明:

```text
本步没有新增需求、设计、测试用例、证据编号、release gate 或生产化能力。
本步只把 `05` 和 Step 9~12 已确认的残余风险与不可接受边界转成验收层风险接受结构。
```

## 9. 回填草稿

正式 `06-验收标准.md` §13 建议采用以下结构:

```text
13. 风险接受与遗留项
  13.1 风险接受前置条件
  13.2 可接受风险类型
  13.3 不可风险接受清单
  13.4 风险接受表
  13.5 风险移交与跟踪
```

正文草稿:

```text
本章用于裁决哪些非阻断遗留项可以支撑有条件通过。风险接受只支持有条件通过,不支持通过。没有接受人、责任人、后续动作和截止时间的风险不得作为有条件通过依据。

可进入风险接受评审的项目仅限 B / C 缺陷、P1/P2 未覆盖专项、非阻断 nightly / staging-like 结果、生产化后续事项和性能观察候选未硬化等不影响 P0 主线的风险。任一 `VETO-WORK-*` failed、S 级缺陷、影响 P0 gate / release gate / P0 evidence 的 A 级缺陷、release redline、P0 evidence 缺失、redaction failed、重复 truth、`latest` 证据路径和 configured adapter fake fallback success 不得风险接受。
```

## 10. 待确认事项

无阻塞进入 Step 14 的待确认事项。

后续 Step 必须继续收口:

- Step 14 将基于 P0 gate、veto checklist、缺陷分级、risk acceptance 和签署角色定义最终通过 / 有条件通过 / 不通过口径。
- Step 14 必须明确签署不自动等于风险接受;风险接受必须先在 `risk-acceptance.md` 中完整记录。
- Step 15 才能整理正式 `06-验收标准.md`。

## 11. 进入下一步条件

- [x] 可支持有条件通过的风险类型已经列明。
- [x] 不可风险接受清单已经列明。
- [x] 风险接受人和责任人规则已经列明。
- [x] 后续动作和截止时间口径已经列明。
- [x] 风险移交目标已经列明。
- [x] 用户审核并确认本 Step。
