# Step 3. 固定验收基线

> 本文件是 `projects/L1-work/06-验收标准.md` 的 Step 3 中间产物。
> 本步固定验收基线的类型、路径、占位符和不可接受引用。
> 当前尚无真实送验 build、`run_id` 和 acceptance handoff,因此本步只固定“必须如何固定”,不伪造实际送验值。

## 1. Step 状态

- 状态: `[~] 已生成,待用户审核`
- 对应 SOP: `standards/document/验收标准讨论流程_SOP.md` Step 3
- 回填章节: `projects/L1-work/06-验收标准.md` §3 验收基线
- 生成日期: 2026-06-04

## 2. 本步输入

| 输入 | 内容 | 本步使用方式 |
|---|---|---|
| Step 2 范围表 | P0 / P1 / P2 验收范围和非范围 | 决定哪些基线必须固定 |
| `00-需求文档.md`~`05-测试方案.md` | 当前已生成的新版文档基线 | 文档生成和验收标准编制基线 |
| 送验版本 | 实现仓 commit、build id、image、package 或 release candidate | 当前未提供,标记为送验前置缺口 |
| 测试报告 / 证据 run | `run_id`、suite artifacts、reports、evidence index、redaction report、acceptance handoff | 当前未提供,标记为送验前置缺口 |
| 环境配置 | `local-dev`、`ci-test`、`integration-like`、`operations-replay`、selected P1 / P2 环境 | 使用 `04` / `05` 的 profile 口径固定 |
| 测试数据 | run-scoped fixture、snapshot digest、replay bundle、cleanup 和隔离规则 | 使用 `05` 的 run-scoped 数据口径固定 |

已确认结论:

```text
Step 3 必须区分“文档编制基线”和“真实送验裁决基线”。
当前可以固定新版 00~05 是编写 06 的文档基线。
真实通过 / 有条件通过 / 不通过裁决必须等待实现仓 commit、build、run_id、artifacts 和 reports 固定后才能执行。
```

## 3. SOP 问题回答

### 3.1 按哪一版需求和设计验收?

新版 `06` 的编制基线使用当前已生成的 `projects/L1-work/00-需求文档.md`、`01-架构设计.md`、`02-概要设计.md`、`03-详细设计.md`、`04-配置设计.md` 和 `05-测试方案.md`。

正式送验时必须把这些文档对应的 git commit 或文档版本写入验收基线表。当前仓 HEAD 为 `ddffa3b`,但工作区存在未提交的 `L1-work` 文档改动,因此不能把 `ddffa3b` 写成当前 L1-work 文档最终验收基线。

| 文档基线 | 当前编制口径 | 正式送验时必须固定 |
|---|---|---|
| 需求基线 | 当前新版 `00-需求文档.md` | git commit / document version |
| 架构基线 | 当前新版 `01-架构设计.md` | git commit / document version |
| 概要基线 | 当前新版 `02-概要设计.md` | git commit / document version |
| 详细设计基线 | 当前新版 `03-详细设计.md` | git commit / document version |
| 配置设计基线 | 当前新版 `04-配置设计.md` | git commit / document version |
| 测试方案基线 | 当前新版 `05-测试方案.md` | git commit / document version |

### 3.2 按哪一版测试方案和测试结果裁决?

验收裁决必须使用正式 `05-测试方案.md` 的用例、suite、证据编号和报告路径。真实裁决必须绑定一个固定 `run_id`。

当前尚未执行真实测试 run,因此不能裁决通过 / 有条件通过 / 不通过。

| 测试基线 | 当前口径 | 正式送验要求 |
|---|---|---|
| 测试方案 | 当前新版 `05-测试方案.md` | 固定文档版本或 commit |
| 测试用例 | `TC-WORK-*` | 以 `05` §5 / §6 为准 |
| 测试证据 | `EV-WORK-*` | `reports/runs/<run_id>/evidence-index.md` 必须可追溯 |
| 阻断 suite | `unit-contract-domain`、`service-core`、`api-contract-fast`、`config-fast`、`service-all`、`integration-p0`、`worker-job-contract`、`consumer-outbox`、`config-redaction`、release suites | `reports/runs/<run_id>/gate-results.md` 必须固定结果 |
| 验收交接 | `reports/acceptance/handoff.md` | 只能提供事实和风险入口,不写最终裁决 |

### 3.3 送验 build / commit / image 是什么?

当前没有用户提供的实现仓送验 build、commit、image 或 package。

因此本步只能声明正式验收时的必填字段:

| 送验项 | 是否当前已知 | 正式验收要求 |
|---|---|---|
| 实现仓路径 | 目标为 `/home/aris/Projects/quantalithos-work` | 送验前确认 |
| 实现仓 commit | 未提供 | 必填,不得写“当前” |
| build id / package | 未提供 | 如有构建产物则必填 |
| image digest | 未提供 | 如以 image 送验则必须是 digest,不得只写 tag |
| release candidate 标识 | 未提供 | 如有 RC,必须固定版本号 |
| dependency baseline | 未提供 | 至少固定 `core-contracts` 依赖基线 |

### 3.4 环境、配置、数据和依赖是什么?

环境、配置、数据和依赖按 `04` / `05` 的矩阵固定。真实送验时必须选择并记录实际环境。

| 基线类型 | 当前允许口径 | 正式验收要求 |
|---|---|---|
| P0 环境 | `local-dev`、`ci-test`、`integration-like`、`operations-replay` | 至少固定用于 P0 裁决的环境组合 |
| P1 / P2 环境 | `staging-like`、`production-like` | 如纳入 selected run,必须固定并说明不阻塞 P0 或作为条件通过输入 |
| 配置 profile | `04` §6 的 profile 和 `05` §8 的环境矩阵 | 固定 config digest / config source summary |
| 数据 | `05` 的 run-scoped fixture、seed、snapshot digest、replay bundle | 固定 dataset id、fixture version、snapshot digest |
| 依赖 | 只有 `core-contracts` 是 compile dependency;其他用 runtime / event / handoff / fake / controlled adapter | 固定 fake / configured / real-like 标记,不得 fake production success |

### 3.5 基线变更如何处理?

任何正式验收基线变更都必须重新判断影响范围。

| 变更类型 | 处理规则 |
|---|---|
| `00`~`04` 任一设计文档变更 | 回到受影响 Step 重评验收范围、门禁和证据 |
| `05` 测试方案变更 | 重评 `TC / EV / suite / report` 覆盖和进入 / 退出条件 |
| 实现 commit / build 变更 | 重新生成或重新确认测试 run |
| config profile / env 变更 | 重跑配置、redaction、fake marker 和相关 gate |
| test data / replay bundle 变更 | 更新 dataset / snapshot digest 并重跑受影响用例 |
| `run_id` 变更 | 不得覆盖旧证据;新 run 必须生成独立 artifact / report |

### 3.6 本轮验收固定的 `run_id` 是什么?

当前没有固定 `run_id`。

正式验收必须固定一个不可变 `run_id`,并把所有机器证据、可读报告和验收交接材料挂在该 `run_id` 下。

| 字段 | 当前值 | 正式验收要求 |
|---|---|---|
| `run_id` | `<run_id>` | 必填,不得为 `latest` |
| run metadata | 未提供 | 记录 commit、build、environment、config digest、dataset id |
| run status | 未提供 | 记录 completed / failed / partial,并保留失败 evidence |

### 3.7 原始机器证据是否位于 `artifacts/test/<run_id>`?

正式验收要求是:必须位于 `artifacts/test/<run_id>/...`。

当前尚未生成真实 artifact,因此本项为送验前置缺口。

不允许:

```text
artifacts/test/latest
artifacts/test/L1-work/<run_id>
artifacts/test/<project>/<run_id>
artifacts/latest
```

### 3.8 人类可读报告是否位于 `reports/runs/<run_id>`?

正式验收要求是:必须位于 `reports/runs/<run_id>/...`。

当前尚未生成真实 report,因此本项为送验前置缺口。

不允许:

```text
reports/latest
reports/L1-work
reports/<project>
reports/runs/latest
```

### 3.9 验收交接文件是否位于 `reports/acceptance/`?

正式验收交接摘要必须位于 `reports/acceptance/handoff.md`。

同时需要配套:

- `reports/acceptance/veto-checklist.md`
- `reports/acceptance/risk-acceptance.md`
- `reports/acceptance/open-issues.md`

当前这些文件尚未生成,因此是送验前置缺口,但不阻塞 Step 4 继续定义进入 / 退出条件。

### 3.10 是否存在不可作为正式基线的引用?

本步检查当前设计中的规则引用,确认正式 `06` 必须禁止以下引用作为基线:

| 禁止引用 | 原因 |
|---|---|
| `latest` | 不可复核,会随运行漂移 |
| `当前版本` / `当前 commit` | 不可审计,必须替换为具体 commit / build |
| `reports/<project>` | 缺少 run 维度,无法绑定证据 |
| `artifacts/test/<project>/<run_id>` | 与 `05` 规定路径冲突 |
| image tag without digest | tag 可移动 |
| fake adapter success as production result | fake 只能支撑 P0 / CI / controlled seam,不能伪装生产成功 |

## 4. 当前文档问题诊断

| 位置 | 当前问题 | 影响 | 本步处理 |
|---|---|---|---|
| 旧 `06-验收标准.md` §2 | 基线只写 `00/02/03/05` 和“当前文档批次”,缺少 `01/04`、commit、run_id、report 路径 | 无法定位和复验 | 重新定义基线表 |
| 旧 `06-验收标准.md` §2 | 环境基线写成 test / staging 级接缝环境 | 与新版 `04` / `05` profile 不一致 | 使用 `local-dev`、`ci-test`、`integration-like`、`operations-replay`、P1/P2 profile |
| 旧 `06-验收标准.md` | 无 artifact / report / acceptance handoff 基线 | 无法支撑 evidence review | 引入 `artifacts/test/<run_id>`、`reports/runs/<run_id>`、`reports/acceptance/handoff.md` |
| 当前实际状态 | 没有真实送验 build、run_id、reports | 不能裁决最终结论 | 标为送验前置缺口 |
| 当前 git 状态 | `L1-work` 文档存在未提交改动 | 不能把 HEAD `ddffa3b` 直接当作最终 L1-work 文档基线 | 正式送验时必须固定包含这些文档的 commit |

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 基线类型 | 只写需求 / 设计 / 测试 / 版本 / 环境 | 拆成文档、测试、交付、环境、配置、数据、证据和验收交接基线 | 验收裁决需要可定位和可复验 |
| 文档基线 | 旧 `02/03/05` | 新版 `00/01/02/03/04/05` | 新版 06 必须承接完整上游 |
| 送验版本 | “当前文档批次” | 必须写具体 implementation commit / build / image digest / RC | 避免模糊基线 |
| 证据路径 | 未定义 | 固定 `artifacts/test/<run_id>`、`reports/runs/<run_id>`、`reports/acceptance/handoff.md` | 支撑复核和审计 |
| 未提供真实 run | 未说明 | 标记为送验前置缺口 | 不伪造验收结果 |

## 6. 验收裁决取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A: 当前直接填 `ddffa3b` 作为验收基线 | 有具体 commit | 工作区有未提交 L1-work 文档改动,会形成错误基线 | 不采用 |
| 方案 B: 将 Step 3 定义为基线规则,真实送验值作为 Step 4 / Step 14 前置输入 | 不伪造 build / run,且能继续推进验收标准结构 | 正式裁决前仍需补真实基线 | 采用 |
| 方案 C: 等实现仓完成后再写 Step 3 | 可以一次性填真实值 | 当前 06 无法继续定义门禁和进入条件 | 不采用 |

推荐方案 B。

原因:

- 验收标准文档可以先定义基线规则,但不能假装真实测试 run 已存在。
- 当前 `L1-work` 文档未提交,真实文档基线必须等提交后固定。
- 真实通过 / 不通过必须依赖固定 `run_id` 的证据,不能靠文档编制阶段判断。

## 7. 结构化中间产物

### 7.1 验收基线表

| 基线类型 | 基线内容 | 版本 / 标识 | 说明 |
|---|---|---|---|
| 需求基线 | `projects/L1-work/00-需求文档.md` | `<design_commit_or_version>` | 正式送验时填写 |
| 架构基线 | `projects/L1-work/01-架构设计.md` | `<design_commit_or_version>` | 正式送验时填写 |
| 概要基线 | `projects/L1-work/02-概要设计.md` | `<design_commit_or_version>` | 正式送验时填写 |
| 详细设计基线 | `projects/L1-work/03-详细设计.md` | `<design_commit_or_version>` | 正式送验时填写 |
| 配置设计基线 | `projects/L1-work/04-配置设计.md` | `<design_commit_or_version>` | 正式送验时填写 |
| 测试方案基线 | `projects/L1-work/05-测试方案.md` | `<design_commit_or_version>` | 正式送验时填写 |
| 实现基线 | `/home/aris/Projects/quantalithos-work` | `<implementation_commit>` | 当前未提供 |
| 构建基线 | build / package / image | `<build_id_or_image_digest>` | 当前未提供 |
| 依赖基线 | `core-contracts` | `<core_contracts_commit>` | 必须固定唯一 compile dependency |
| 环境基线 | `ci-test` / `integration-like` / `operations-replay` / selected P1 | `<environment_id>` | 当前未提供 |
| 配置基线 | config source summary / config digest | `<config_digest>` | 当前未提供 |
| 数据基线 | run-scoped fixture / seed / snapshot / replay bundle | `<dataset_id_or_digest>` | 当前未提供 |
| 测试运行基线 | test run | `<run_id>` | 当前未提供 |

### 7.2 artifact / report / acceptance handoff 基线表

| 证据入口 | 固定路径 | 版本 / 标识 | 验收用途 | 当前状态 |
|---|---|---|---|---|
| 原始 artifact | `artifacts/test/<run_id>/...` | `<run_id>` | 复核机器原始证据、stdout / stderr、safe logs、snapshot digest、redaction scan | 待送验生成 |
| 运行报告 | `reports/runs/<run_id>/...` | `<run_id>` | 阅读测试摘要、suite 结果、EV 索引、NFR、redaction 和 release summary | 待送验生成 |
| evidence index | `reports/runs/<run_id>/evidence-index.md` | `<run_id>` | 检查 `EV / TC / AC / design_contract_refs` 可追溯 | 待送验生成 |
| redaction report | `reports/runs/<run_id>/redaction-check.md` | `<run_id>` | 检查 raw secret / token / payload / source body 零命中 | 待送验生成 |
| gate results | `reports/runs/<run_id>/gate-results.md` | `<run_id>` | 判断阻断 / 非阻断 gate 结果 | 待送验生成 |
| 验收交接 | `reports/acceptance/handoff.md` | `<run_id>` | 送验事实摘要、开放问题和残余风险入口,不写裁决 | 待送验生成 |
| 一票否决检查 | `reports/acceptance/veto-checklist.md` | `<review_version>` | 判断 VF / redline 是否触发 | 待送验生成 |
| 风险接受 | `reports/acceptance/risk-acceptance.md` | `<review_version>` | 支撑有条件通过或风险拒绝 | 待送验生成 |

### 7.3 禁止基线引用清单

| 禁止写法 | 替代写法 |
|---|---|
| `latest` | `<run_id>` |
| `当前版本` | `<commit>` / `<build_id>` / `<document_version>` |
| `reports/<project>` | `reports/runs/<run_id>` |
| `artifacts/test/<project>/<run_id>` | `artifacts/test/<run_id>` |
| image tag only | image digest |
| fake success as production | fake / configured / real-like 标记分开 |

### 7.4 基线冻结图

#### 验收基线图: 从文档到送验证据

```text
Document baseline
  -> 00 / 01 / 02 / 03 / 04 / 05 at <design_commit_or_version>

Implementation baseline
  -> quantalithos-work at <implementation_commit>
  -> build / package / image at <build_id_or_digest>

Run baseline
  -> environment at <environment_id>
  -> config at <config_digest>
  -> data at <dataset_id_or_digest>
  -> test run at <run_id>

Evidence baseline
  -> artifacts/test/<run_id>
  -> reports/runs/<run_id>
  -> reports/acceptance/handoff.md
```

关键说明:

- 文档基线和真实送验基线不能混用。
- `run_id` 是证据基线核心,不得使用 `latest`。
- 任何基线变更都需要重评影响范围。
- 没有真实 implementation commit / run_id / reports 时,只能生成验收标准草案,不能裁决最终结论。

## 8. 验收输入影响判定

| 验收结论 | 是否影响上游设计 / 测试 | 影响类型 | 回写位置 | 处理状态 |
|---|---|---|---|---|
| 确认 `00~05` 是当前 06 编制文档基线 | 否 | 文档基线规则 | 无 | 无回写 |
| 确认正式送验必须固定 implementation commit / build / `run_id` / reports | 否 | 送验基线规则 | `06` Step 3 / Step 4 / Step 14 | 待送验填值 |
| 确认 `latest`、`当前版本`、`reports/<project>` 和 `artifacts/test/<project>/<run_id>` 不可作为基线 | 否 | 证据路径规则 | 无 | 无回写 |
| 确认当前缺真实 build / run_id / acceptance handoff 是送验前置缺口 | 否 | 验收执行前置 | Step 4 进入条件 | 待后续 Step |

说明:

```text
本步没有改变设计或测试方案。
本步只定义验收基线如何固定,并把当前缺失的真实送验值标记为后续前置条件。
```

## 9. 回填草稿

正式 `06-验收标准.md` §3 建议采用以下结构:

```text
3. 验收基线
  3.1 文档基线
  3.2 实现 / 构建基线
  3.3 环境、配置、数据和依赖基线
  3.4 测试运行与证据基线
  3.5 禁止基线引用
  3.6 基线变更规则
```

正文草稿:

```text
本章区分文档编制基线和真实送验裁决基线。新版 `00~05` 是 `06` 的编制输入;正式通过 / 有条件通过 / 不通过裁决必须另行固定实现仓 commit、build 或 image digest、环境、配置 digest、数据集、`run_id`、artifact、report 和 acceptance handoff。

正式验收不得使用 `latest`、`当前版本`、`reports/<project>`、`artifacts/test/<project>/<run_id>` 或可移动 image tag 作为基线。任何基线变更都必须重新判断影响范围并按需重跑测试证据。
```

## 10. 待确认事项

无阻塞进入 Step 4 的待确认事项。

送验前必须补齐:

- `<design_commit_or_version>`
- `<implementation_commit>`
- `<build_id_or_image_digest>`
- `<core_contracts_commit>`
- `<environment_id>`
- `<config_digest>`
- `<dataset_id_or_digest>`
- `<run_id>`
- `artifacts/test/<run_id>/...`
- `reports/runs/<run_id>/...`
- `reports/acceptance/handoff.md`
- `reports/acceptance/veto-checklist.md`
- `reports/acceptance/risk-acceptance.md`

## 11. 进入下一步条件

- [x] 文档基线和真实送验基线已经分开。
- [x] 验收基线类型已经列明。
- [x] artifact / report / acceptance handoff 路径已经固定为规则。
- [x] 禁止基线引用已经列明。
- [x] 当前缺失的真实送验值已经标为后续前置缺口。
- [ ] 用户审核并确认本 Step。
