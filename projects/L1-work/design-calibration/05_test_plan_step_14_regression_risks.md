# Step 14. 定义回归策略与残余风险

> 本步定义 `05-测试方案.md` §14 的变更回归触发、最小 / 全量回归集、残余风险记录和验收移交规则。本步不批准风险接受,不把 S 级或影响 P0 的 A 级缺陷降级为残余风险;正式风险接受和验收裁决交给新版 `06-验收标准.md`。

## 1. Step 状态

| 字段 | 内容 |
|---|---|
| Step | 14 |
| 状态 | 已完成 |
| 回填章节 | `projects/L1-work/05-测试方案.md` §14 回归策略与残余风险 |
| 生成日期 | 2026-06-04 |

## 2. 本步输入

| 输入 | 用途 |
|---|---|
| `05_test_plan_step_06_cases_matrix.md` | 取得 `TC-WORK-*` 用例族、状态机、事务、幂等、恢复和配置用例 |
| `05_test_plan_step_09_automation_gates.md` | 取得 PR / main / nightly / release suite 与 gate 脚本 |
| `05_test_plan_step_10_special_non_functional.md` | 取得 NFR、性能观察、故障注入、redaction 和观测专项边界 |
| `05_test_plan_step_11_defects_retest.md` | 取得 S / A / B / C 缺陷分级、修复后回归矩阵和风险接受边界 |
| `05_test_plan_step_12_entry_exit.md` | 取得退出准则、P1/P2 不阻断 P0、B/C 进入残余风险的规则 |
| `05_test_plan_step_13_reports_evidence.md` | 取得 `EV-WORK-*` 证据归档、报告审查和 acceptance handoff 路径 |
| `00-需求文档.md` §13 / §15 / §16 | 取得旧性能候选、外围增强和风险后移口径 |
| `04-配置设计.md` §13 / §14 | 取得 P1/P2 production-like、secret provider、config center 和 reports / artifacts root 风险 |
| `测试方案讨论流程_SOP.md` Step 14 | 本步问题、回归触发表、残余风险表和执行约束 |

## 3. SOP 问题回答

| SOP 问题 | 本步回答 |
|---|---|
| 哪些变更触发最小回归? | 单一对象、单一协议、单一状态、单一 service、单一 repository、单一 config key、单一 report 脚本或单一 fixture 的局部变更触发对应 direct test、同族 `TC-WORK-*`、相关 suite 和 evidence check。 |
| 哪些变更触发全量回归? | public contract schema、状态机、UoW / idempotency、source truth、redaction、artifact / report path、runtime builder、config profile、job / consumer / outbox、repository persistence 或 release gate 相关变更触发 P0 全量或 release gate。 |
| 哪些风险暂不覆盖? | P1/P2 staging-like / production-like 真实依赖、secret provider / KMS / Vault、config center / hot reload、生产 durable DB / MQ / endpoint 产品绑定、旧性能数字升级硬阈值、报告保留周期和外围增强能力不进入当前 P0 阻断覆盖。 |
| 谁接受残余风险? | Step 14 只指定待接受角色:测试负责人、架构负责人、运维负责人、安全负责人、产品 / 交付负责人、验收负责人。实际接受必须在新版 `06-验收标准.md` 或后续运维 / 实施评审中确认。 |
| 哪些风险必须转入验收标准? | P1/P2 未覆盖项、旧性能候选硬阈值未定、生产化真实依赖未验证、secret provider 未定义、report / artifact retention 未定和非阻断 nightly / staging-like 结果必须转入新版 `06` 的残余风险或后续验收条件。 |

## 4. 当前文档问题诊断

| 文档 / 位置 | 当前问题 | 本步处理 |
|---|---|---|
| Step 9 | 已定义 suite 和 gate,但没有按变更类型定义回归触发 | 本步定义最小回归、全量回归和 release gate 触发条件 |
| Step 11 | 已定义缺陷修复后回归,但缺少一般代码 / 配置变更的回归策略 | 本步把缺陷回归矩阵扩展为变更回归策略 |
| Step 12 | 已规定 P1/P2 和 B/C 进入 Step 14,但未列残余风险表 | 本步明确可进入残余风险的项目和接受角色 |
| Step 13 | 已定义 acceptance handoff,但没有说明哪些风险随报告交接 | 本步定义风险移交到 `reports/acceptance` 和新版 `06` 的规则 |
| 旧 `05-测试方案.md` | 旧风险 / 回归规则无法对应新版 `TC / EV / gate` | 本步重建正式 §14 回填草稿 |

## 5. 改动前后对比

| 维度 | Step 13 后 | Step 14 收敛后 |
|---|---|---|
| 回归触发 | 只有 suite 和缺陷复验规则 | 变更类型到最小 / 全量回归集明确 |
| 残余风险 | P1/P2、B/C 和非阻断项需要进入 Step 14 | 风险、未覆盖原因、影响、缓解方式和待接受角色明确 |
| 验收移交 | acceptance handoff 只定义路径 | 明确哪些风险必须交给新版 `06` |
| P0 红线 | S / P0 A 阻断退出 | 明确不得作为残余风险隐藏 |
| 上游影响 | 无 | 无;不新增需求、配置、协议、用例或验收裁决 |

## 6. 测试设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A: 每次变更都跑全量 P0 + release gate | 风险最低 | 成本高,不利于 PR 反馈 | 不采用 |
| 方案 B: 按变更影响面触发最小回归,遇到 public contract、state、UoW、redline、config profile、report path 和 release 相关变更再触发全量 | 风险和成本平衡,与 Step 9 / 11 一致 | 需要维护变更分类纪律 | 采用 |
| 方案 C: 只按失败用例回归 | 快 | 会漏掉同族状态、事务、配置和证据边界 | 不采用 |
| 方案 D: 把 P1/P2 未覆盖项直接视为通过 | 简单 | 会误导验收,隐藏生产化风险 | 不采用 |

采用方案 B。

原因:

- `L1-work` 的 P0 风险集中在 truth、state、UoW、idempotency、redaction、配置和证据链,这些变更必须扩大回归。
- 非阻断 P1/P2、外围增强和候选性能目标不能阻断当前 P0,但必须显式移交给新版 `06`。
- Step 14 不做风险接受裁决,只提供可被实施计划和验收标准引用的风险事实。

## 7. 结构化中间产物

### 7.1 回归触发表

| 变更类型 | 最小回归集 | 全量回归触发条件 | 责任人 |
|---|---|---|---|
| contracts DTO / refs / command / query / event schema | direct roundtrip / negative test、`api-contract-fast`、相关 `EV-WORK-*` evidence index check | public schema、字段必填 / 可选、状态 enum、error surface 或 event payload 变化 | 合约负责人、测试负责人 |
| domain object / state / policy | direct domain transition test、同状态机非法迁移、`unit-contract-domain`、同族 `TC-WORK-*` | 状态机、policy 默认值、terminal state、forbidden transition 或 source truth guard 变化 | 领域负责人、测试负责人 |
| application service / UoW / idempotency | direct service test、同族 `service-core`、rollback / no side effect assertion | multi-object UoW、idempotency digest、duplicate / conflict、commit unknown 或 version conflict 变化 | 应用负责人、测试负责人 |
| repository / projection / persistence | direct repository test、`integration-p0`、相关 `QUERY` / `OPS` 用例 | persistence schema、query no-write、projection freshness、rebuild source 或 snapshot digest 变化 | 基础设施负责人、测试负责人 |
| consumer / job / outbox / handoff | direct worker / job test、`worker-job-contract`、`consumer-outbox`、相关 `OPS` 用例 | event envelope、dedup、retry、outbox publication、handoff success / failure 或 recovery 变化 | worker 负责人、测试负责人 |
| configuration profile / loader / validation | direct config test、`config-fast`、相关 `CFG` 用例 | P0 profile、cross-field validation、unsupported source、adapter ref、secret boundary 或 fail-fast / fail-closed 变化 | 配置负责人、测试负责人 |
| redaction / forbidden output / fake marker | direct scanner fixture、`config-redaction`、`release-config-redline` | raw secret / payload / body 边界、report dump、fake / configured marker 或 redaction check 变化 | 安全负责人、测试负责人 |
| report / artifact / evidence scripts | report script dry-run、`check_report_paths.sh`、`check_evidence_index.sh`、`release-evidence-pack` | artifact root、report root、acceptance handoff、evidence index 字段或 no `latest` 规则变化 | 测试负责人、实施负责人 |
| runtime builder / adapter wiring | direct runtime fixture、`integration-p0`、`integration-like-seam` selected | adapter kind、configured / fake fallback、runtime dependency graph 或 unavailable marker 变化 | 基础设施负责人、架构负责人 |
| performance observation / NFR report | affected smoke sample、`nfr-summary.md`、相关 `EV-WORK-NFR-*` | 候选性能数字升级硬阈值、fixture 规模、capacity target 或 release threshold 变化 | 架构负责人、测试负责人 |
| release candidate baseline | `release-main-smoke`、`release-config-redline`、`release-evidence-pack` | 任一 release candidate、P0 A 修复后、S 级修复后、redline / evidence path 变更后 | 发布负责人、测试负责人 |

### 7.2 回归层级选择表

| 层级 | 使用场景 | 不足时升级 |
|---|---|---|
| direct test | 单对象、单函数、单配置项或单报告脚本变更 | 涉及跨对象副作用时升级到同族 suite |
| family regression | 同一 `TC-WORK-*` 族内逻辑变更 | 涉及 UoW、state、projection 或 outbox 时升级到 P0 suite |
| impacted P0 suite | service、repository、consumer、job、config、query 影响面明确 | 涉及 public contract、redline、release 或 source truth 时升级全量 |
| P0 full regression | public contract、状态机、UoW、redaction、config profile、query no-write、source truth 变化 | release candidate 或 S / P0 A 修复后追加 release gate |
| release gate | release candidate、redline、evidence pack 或验收交接前 | 任一失败不得以残余风险方式通过 |

### 7.3 全量回归触发条件

| 触发条件 | 必跑范围 | 说明 |
|---|---|---|
| public protocol / schema 变化 | `unit-contract-domain`、`api-contract-fast`、相关 `service-*`、evidence index | 防止 DTO、状态和 error surface 与测试证据脱节 |
| source truth / ownership guard 变化 | `service-all`、`integration-p0`、`config-redaction` | 防止 Work truth 被相邻仓或 query / projection 反写 |
| UoW / transaction / idempotency 变化 | `service-core`、`service-all`、`consumer-outbox`、selected stress | 防止 duplicate、conflict、commit unknown 和 rollback 漏测 |
| redaction / forbidden output 变化 | `config-redaction`、`release-config-redline`、forbidden output scan | 任一 raw material 命中都是 S 级,不得风险接受 |
| config profile / validation 变化 | `config-fast`、`config-redaction`、`integration-p0` | 防止 unsupported P1/P2 配置被当成 P0 可用 |
| query / projection / report path 变化 | `api-contract-fast`、`integration-p0`、`check_report_paths.sh`、`check_evidence_index.sh` | 防止 query 写状态、projection 反写 truth 或证据不可复核 |
| S 级或 P0 A 缺陷修复 | direct failed test、family regression、impacted P0 suite、release gate selected | 缺陷关闭必须留失败 artifact 和复验 evidence |
| release candidate | `release-main-smoke`、`release-config-redline`、`release-evidence-pack` | release gate 失败不得进入残余风险 |

### 7.4 残余风险表

| 风险 | 未覆盖原因 | 影响 | 缓解方式 | 接受人 |
|---|---|---|---|---|
| staging-like / production-like 真实依赖未进入 P0 阻断测试 | 当前 P0 只定义 local-dev、ci-test、integration-like、operations-replay;真实 DB / MQ / endpoint 字段全集未定义 | 真实部署前仍需专项验证 | P1/P2 前补生产化详细设计、配置设计、部署运维和 staging-like 测试 | 架构负责人、运维负责人、验收负责人 |
| secret provider / KMS / Vault 未定义 | P0 只允许 ref-only sensitive 和 fake / configured ref,不定义真实 provider API | 真实 secret 读取、轮换、吊销和 fail-closed 不能按 P0 执行 | 安全运维专项补 provider、轮换、审计、redaction 和 failure tests | 安全负责人、运维负责人、验收负责人 |
| config center / admin override / hot reload 未定义 | P0 明确 unsupported fail-fast,不实现远程配置治理 | 未来应急 override 和热更新不能直接落地 | P1/P2 先补权限、审计、reload、回滚、一致性和测试门禁 | 架构负责人、运维负责人 |
| 旧 `100ms / 300ms` 性能候选未升级为硬阈值 | 缺固定环境、容量模型、数据规模和验收来源 | 不能声称满足生产性能 SLA | 当前只做样本观察;若升级,先回写 `00 / 05 / 06` 并补性能专项 | 产品 / 交付负责人、架构负责人、测试负责人 |
| production-like durable store / event bus / endpoint 产品绑定未验证 | P0 使用 in-memory / fake / controlled adapter,不选具体产品 | 生产事务、重试、超时和部署风险未完全覆盖 | 生产化前补 adapter contract、配置字段、部署手册和 integration / staging evidence | 架构负责人、运维负责人 |
| report / artifact 保留周期未定 | Step 13 只定义路径和 `<run_id>` 绑定,不定保存期限 | 长期审计和追溯保存策略不完整 | `07` / `09` 或运维规范补 retention、清理、归档和访问控制 | 测试负责人、实施负责人、运维负责人 |
| 非阻断 nightly extended stress 未作为 P0 退出硬条件 | 当前 P0 只阻断核心 suite 和 release gate,长耗时 stress 按 nightly / release selected 管理 | 罕见并发缺陷可能在 P0 退出后暴露 | 失败建缺陷;进入 release 前相关 blocker 必须关闭;高风险变更触发 selected stress | 测试负责人、架构负责人 |
| 外围增强能力未进入 P0 用例全集 | 容量趋势、跨项目依赖、组合风险等属于外围增强 | 当前 P0 只能证明核心 Work truth 闭环,不证明外围分析能力 | 后续需求 / 设计 / 测试专项单独补 FR / TC / EV | 产品 / 交付负责人、架构负责人 |

### 7.5 不允许进入残余风险的项目

| 项目 | 原因 | 处理 |
|---|---|---|
| 任一 S 级缺陷 | 一票否决或 release redline | 必须修复并复验,不得风险接受 |
| 影响 P0 gate / release gate / P0 evidence 的 A 级缺陷 | 直接破坏 P0 退出条件 | 必须修复,除非上游正式降级 P0 范围 |
| raw secret / token / payload / source body 泄露 | 安全红线 | 阻断退出,修复后重跑 redaction |
| Work truth 被 query / projection / report / adjacent input 反写 | source truth 红线 | 阻断退出,修复并补自动化 |
| duplicate 产生重复 truth | 幂等一致性红线 | 阻断退出,修复并回归 |
| evidence index 缺 P0 `EV-WORK-*` 或引用 `latest` | 证据不可复核 | 阻断 release evidence pack |
| release redline 失败 | release gate 硬条件 | 不得进入残余风险 |

### 7.6 风险移交表

| 移交目标 | 输入 | 输出 |
|---|---|---|
| `reports/acceptance/handoff.md` | 残余风险表、B / C 缺陷、非阻断 nightly / staging-like 结果 | 验收交接摘要,不写裁决 |
| 新版 `06-验收标准.md` | Step 14 风险、Step 13 evidence index、Step 12 退出准则 | 风险接受或拒绝的正式裁决 |
| `07-实施计划.md` | 回归触发表、P0 gate、报告脚本和实现前置项 | 实施阶段批次、提交前测试和回归执行纪律 |
| `09-部署与运维手册.md` | production-like、secret provider、retention、config center 风险 | P1/P2 部署、运维、保留和真实依赖专项 |

### 7.7 回归触发图

图类型: 回归触发图

图标题: L1-work 变更到回归范围选择

```text
[Change detected]
  |
  v
[Classify impact]
  |
  +-- local object / config / report --> [Direct test]
  |
  +-- same TC family -------------> [Family regression]
  |
  +-- service / repository / job --> [Impacted P0 suite]
  |
  +-- public schema / state / UoW / redline / path
  |                                 --> [P0 full regression]
  |
  +-- release candidate / S fix / P0 A fix
                                    --> [Release gate]
```

关键说明:

- 回归范围由变更影响面决定,不是由实现者主观选择。
- source truth、redaction、idempotency、query no-write 和 evidence path 变更直接升级全量。
- release gate 失败不得进入残余风险。
- P1/P2 未覆盖项只进入风险移交,不代表 P0 已覆盖。

## 8. 对上游设计的影响判定

| 测试结论 | 是否影响上游设计 | 影响类型 | 回写位置 | 处理状态 |
|---|---|---|---|---|
| 回归触发规则承接既有 `TC-WORK-*`、suite、gate 和 `EV-WORK-*`,不新增用例编号族 | 否 | 测试执行策略,无设计契约变化 | 无 | 无回写 |
| P1/P2 production-like、secret provider、config center、durable adapter 等进入残余风险 | 否 | 范围裁剪,承接 00 / 04 | 无 | 无回写 |
| 旧 `100ms / 300ms` 不作为 P0 release 硬阈值,继续作为风险移交项 | 否 | 承接需求文档候选目标口径 | 无 | 无回写 |
| S 级和影响 P0 的 A 级不得进入残余风险 | 否 | 承接 Step 11 / Step 12 | 无 | 无回写 |

说明:

```text
本步没有发现必须回写 `00/01/02/03/04` 的设计冲突。
如果后续把 P1/P2 生产化、性能硬阈值、secret provider、config center 或 reports / artifacts root 变成 P0 要求,必须先回写对应上游文档,再重开测试方案相关 Step。
```

## 9. 回填草稿

正式 `05-测试方案.md` §14 建议采用以下结构:

```text
14. 回归策略与残余风险
  14.1 回归触发表
  14.2 回归层级选择表
  14.3 全量回归触发条件
  14.4 残余风险表
  14.5 不允许进入残余风险的项目
  14.6 风险移交表
  14.7 回归触发图
  14.8 对上游设计的影响判定
```

必须引用:

| 正式章节 | 引用来源 |
|---|---|
| §14.1 | `design-calibration/05_test_plan_step_14_regression_risks.md` §7.1 |
| §14.2 | `design-calibration/05_test_plan_step_14_regression_risks.md` §7.2 |
| §14.3 | `design-calibration/05_test_plan_step_14_regression_risks.md` §7.3 |
| §14.4 | `design-calibration/05_test_plan_step_14_regression_risks.md` §7.4 |
| §14.5 | `design-calibration/05_test_plan_step_14_regression_risks.md` §7.5 |
| §14.6 | `design-calibration/05_test_plan_step_14_regression_risks.md` §7.6 |
| §14.7 | `design-calibration/05_test_plan_step_14_regression_risks.md` §7.7 |
| §14.8 | `design-calibration/05_test_plan_step_14_regression_risks.md` §8 |

## 10. 待确认事项

无阻塞进入 Step 15 的设计待确认事项。

人工审核时建议重点确认:

| 审核点 | 期望 |
|---|---|
| 回归触发 | 是否接受 public schema / state / UoW / redline / evidence path 变化触发 P0 全量 |
| 残余风险边界 | 是否确认 S 级和影响 P0 的 A 级不得进入残余风险 |
| P1/P2 风险 | 是否确认 production-like、secret provider、config center 和真实 durable adapter 不阻塞当前 P0 |
| 性能候选 | 是否确认旧 `100ms / 300ms` 继续作为候选风险,不作为 P0 release 硬阈值 |
| 验收移交 | 是否确认实际风险接受由新版 `06-验收标准.md` 裁决 |

## 11. 进入下一步条件

| 条件 | 状态 |
|---|---|
| 回归触发表已定义 | 通过 |
| 全量回归触发条件已定义 | 通过 |
| 残余风险表包含未覆盖原因、影响、缓解方式和接受人 / 待确认角色 | 通过 |
| 不允许进入残余风险的 P0 红线已定义 | 通过 |
| 风险可被实施计划 / 验收标准引用 | 通过 |
| formal `05-测试方案.md` 未被本步修改 | 通过 |
