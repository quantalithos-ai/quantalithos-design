# Step 3. 固定验收基线

> 对应 SOP: `standards/document/验收标准讨论流程_SOP.md` Step 3
> 回填章节: `06-验收标准.md` §3 验收基线

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 3 固定验收基线 |
| 当前状态 | 已审核通过 |
| 输入基线 | Step 1~2 已审核通过;新版 `05` 的 suite、artifact、report、entry/exit 和 evidence 规则 |
| 输出文件 | `projects/L1-identity/design-calibration/06_acceptance_step_03_baseline.md` |
| 正式文档状态 | 本 Step 不修改正式 `06-验收标准.md` |
| 停审方式 | 用户已确认,允许进入 Step 4 |

## 2. 本步目标

定义正式验收前必须固定的需求、设计、测试、交付、环境、数据和证据基线,并明确哪些路径或口头引用不能作为正式验收基线。

本 Step 只回答:

- 按哪一版需求、设计、配置和测试方案验收。
- 送验 build / commit / image / run identity 需要如何固定。
- 环境、配置、数据、依赖协作和 adapter mode 需要如何固定。
- 原始 artifact、运行报告和 acceptance handoff 应位于哪些固定路径。
- 基线变更如何处理。
- 哪些路径或引用不能作为正式验收基线。

本 Step 不填入具体真实 commit、build、image、`<run_id>`、测试结论或签署结论;这些值必须由送验材料提供后再替换占位。

## 3. 本步输入

| 输入 | 状态 | 本 Step 用途 |
|---|---|---|
| `06_acceptance_step_01_input_boundary.md` | 已审核通过 | 提供验收输入权威顺序和旧 `06` 降级口径 |
| `06_acceptance_step_02_scope.md` | 已审核通过 | 提供 P0/P1/P2 范围和 residual 口径 |
| `05-测试方案.md` §8 | 正式输入 | 提供 `local-dev`、`ci-test`、`integration-like`、`operations-replay`、`staging-like`、`production-like` 环境 / profile / adapter 协作方式 |
| `05-测试方案.md` §9 | 正式输入 | 提供 P0 blocking suite、gate / report / check 脚本和输出路径 |
| `05-测试方案.md` §12 | 正式输入 | 提供测试进入 / 退出准则、P0 suite、`latest` 禁止和暂停 / 阻断规则 |
| `05-测试方案.md` §13 | 正式输入 | 提供 `EV-ID-*`、artifact root、report root、raw artifact 字段、reports 结构和 failure evidence 规则 |
| `05-测试方案.md` §14 | 正式输入 | 提供 residual risk、P1 selected-run 和不可风险接受项 |

## 4. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 按哪一版需求和设计验收? | 按当前新版 `00-需求文档.md`、`01-架构设计.md`、`02-概要设计.md`、`03-详细设计.md`、`04-配置设计.md` 和 `05-测试方案.md` 验收。正式 `06` Step 15 装配时必须记录这些文件的送验版本 / commit / digest。 |
| 按哪一版测试方案和测试结果裁决? | 按 Step 15 已审核通过的新版 `05-测试方案.md` 裁决测试结构。具体测试结果必须绑定单一固定 `<run_id>` 或明确列出的多个 run,每个 run 都必须有 artifact/report 配对和 evidence index。 |
| 送验 build / commit / image 是什么? | 当前 Step 不发明具体值。正式验收基线必须包含 source commit、build id、image digest 或 artifact package digest。未提供时不得进入最终验收结论。 |
| 环境、配置、数据和依赖是什么? | P0 baseline 应固定 `ci-test`、`integration-like`、`operations-replay` 和 release candidate gate 所需 profile / config digest / dependency mode。`local-dev` 不作为正式 release evidence;`staging-like` / `production-like` 只进入 P1/P2 或 residual。 |
| 基线变更如何处理? | 任何影响 C-ID / FR / BR / AC / VETO、public contract、state matrix、transaction、config、redaction、dependency boundary、artifact/report schema 或 release gate 的变更,都必须重新生成受影响 evidence,必要时回到对应 Step 复审。 |
| 本轮验收固定的 `run_id` 是什么? | 当前未固定。Step 3 只定义 `run_id` 必须由送验材料提供,并用于定位 `artifacts/test/<run_id>` 与 `reports/runs/<run_id>`。不得使用 `latest`。 |
| 原始机器证据是否位于 `artifacts/test/<run_id>`? | 这是正式基线要求。每个 blocking suite 必须有 `artifacts/test/<run_id>/suites/<suite>/...`。缺失时 Step 10 证据门禁不成立。 |
| 人类可读报告是否位于 `reports/runs/<run_id>`? | 这是正式基线要求。suite report、gate-summary、evidence-index、redaction-check、dependency-boundary、report-audit 必须在 `reports/runs/<run_id>/...` 下定位。 |
| 验收交接文件是否位于 `reports/acceptance/`? | 这是正式基线要求。`handoff.md`、`veto-checklist.md`、`risk-acceptance.md`、`open-issues.md` 是验收交接入口,可由脚本生成初稿,但验收前必须审查补充。 |
| 是否存在 `latest`、`reports/<project>` 或 `artifacts/test/<project>/<run_id>` 这类不可作为正式基线的引用? | 新版 `05` 明确禁止。正式 `06` 必须将这些引用列为非法基线;出现时不得作为验收证据。 |

## 5. 当前文档问题诊断

| 位置 | 当前问题 | 本 Step 处理 |
|---|---|---|
| 旧 `06-验收标准.md` §2 | 旧草案使用文档版本号、mock/stub 环境和泛化证据描述,未绑定新版 run-scoped artifact/report | 新版 Step 3 改为基线槽位和固定路径规则,不继承旧版本号 |
| 新版 `05` §9 / §13 | 已定义 suite、artifact、report、evidence 结构,但未给本次具体 `<run_id>` | Step 3 只定义必须固定,具体值由送验材料提供 |
| 新版 `05` §8 | 已区分 P0 profile 与 P1/P2 环境 | Step 3 明确 `local-dev` 不能作为正式 release evidence,`staging-like` / `production-like` 不进入 P0 必过 |
| 新版 `05` §12 | 已定义 P0 suite 和退出准则 | Step 3 将其纳入验收基线前置,Step 4 再转为进入 / 退出条件 |
| acceptance reports | `reports/acceptance/*` 是否存在尚未确认 | Step 3 建立基线要求;Step 10 / Step 14 再裁决完整性 |

## 6. 改动前后对比

| 项 | 改动前 | 改动后 | 理由 |
|---|---|---|---|
| 文档基线 | 旧 `06` 记录历史版本号 | 新版基线要求记录正式文件的送验 commit / digest | 防止旧版本号污染新版验收 |
| 交付基线 | 旧草案写“送验 commit / tag / build id 由验收执行时填写” | 新版拆成 source commit、build id、image/package digest、run id 等槽位 | 便于 Step 14 结论签署 |
| 环境基线 | 旧草案使用 test/staging 级环境描述 | 新版按 `05` 的 profile 和 adapter mode 固定 | 与测试证据一致 |
| 证据基线 | 旧草案泛写 API response / DB rows / outbox log | 新版使用 `artifacts/test/<run_id>`、`reports/runs/<run_id>`、`reports/acceptance` | 确保证据可复验 |
| 非法引用 | 旧草案未显式禁止 `latest` | 新版列出非法基线引用 | 防止验收证据漂移 |

## 7. 验收裁决取舍

| 议题 | 可选方案 | 取舍 |
|---|---|---|
| 是否在设计文档中填具体 run | A. 直接填一个候选 run;B. 只定义必填槽位 | 采用 B。当前没有正式送验材料,不能发明 `<run_id>`。 |
| 是否允许多 run 共同支撑验收 | A. 只允许单一 run;B. 单一主 run 优先,多 run 必须逐项列明用途 | 采用 B。主 release run 应固定;若补充 lower suite / P1 selected-run,必须列入基线表。 |
| `local-dev` 是否可作验收证据 | A. 可以;B. 不能作为正式 release evidence | 采用 B。`05` 已定义 `local-dev` 只作本地调试。 |
| P1 selected-run unavailable 是否阻断 | A. 阻断;B. 不阻断 P0,记录 residual | 采用 B。Step 2 已确认 P1 不作为 P0 必要条件。 |
| 缺 acceptance handoff 是否可通过 | A. 可以补口头说明;B. 不可作为最终通过 | 采用 B。`reports/acceptance/*` 是验收交接固定入口。 |

## 8. 结构化中间产物

### 8.1 验收基线表

| 基线类型 | 基线内容 | 版本 / 标识 | 说明 |
|---|---|---|---|
| 需求基线 | `00-需求文档.md` | `<source_commit_or_doc_digest>` | AC / VETO / data ownership 来源 |
| 架构基线 | `01-架构设计.md` | `<source_commit_or_doc_digest>` | dependency boundary / truth boundary 来源 |
| 概要基线 | `02-概要设计.md` | `<source_commit_or_doc_digest>` | 组件、对象、接口、状态边界来源 |
| 详细设计基线 | `03-详细设计.md` | `<source_commit_or_doc_digest>` | object / protocol / flow / state / transaction / error / observability 来源 |
| 配置设计基线 | `04-配置设计.md` | `<source_commit_or_doc_digest>` | profile / config / adapter / redaction 来源 |
| 测试方案基线 | `05-测试方案.md` | `<source_commit_or_doc_digest>` | TC / EV / suite / artifact / report 来源 |
| 验收标准生成基线 | `06_acceptance_step_01~14` | `<calibration_commit_or_digest>` | Step 15 装配正式 `06` 的校准来源 |
| 交付源码基线 | implementation repository source | `<source_commit>` | 必须由送验材料提供 |
| 构建基线 | binary / package / image | `<build_id_or_image_digest>` | 必须由送验材料提供 |
| 配置基线 | profile + config digest | `<config_profile>` + `<config_digest>` | P0 应固定 `ci-test` / `integration-like` / `operations-replay` / release candidate 配置 |
| 数据基线 | DS / fixture / seed / replay namespace | `<data_seed_digest_or_fixture_set>` | 必须可重复构造、隔离和清理 |
| 依赖协作基线 | fake / controlled / replay / selected-run dependency modes | `<dependency_mode_matrix>` | P0 不依赖真实 sibling repo 或真实产品 |
| 证据运行基线 | `run_id` | `<run_id>` | 必须固定,不得使用 `latest` |

### 8.2 证据入口基线表

| 证据入口 | 固定路径 | 版本 / 标识 | 验收用途 |
|---|---|---|---|
| 原始 artifact root | `artifacts/test/<run_id>/...` | `<run_id>` | 复核机器原始证据、case JSON、suite report、stdout/stderr digest |
| source commits artifact | `artifacts/test/<run_id>/meta/source-commits.json` | `<run_id>` | 复核 design / implementation / core contracts / additional source refs |
| config digest artifact | `artifacts/test/<run_id>/meta/config-digest.json` | `<run_id>` | 复核 config applicability、profile、digest、safe config sources 和 not-applicable reason |
| suite artifact | `artifacts/test/<run_id>/suites/<suite>/...` | `<run_id>` + `<suite>` | 验证每个 blocking suite 的原始执行证据 |
| 运行报告 root | `reports/runs/<run_id>/...` | `<run_id>` | 阅读测试摘要、EV 索引、suite report 和门禁结果 |
| EV 索引 | `reports/runs/<run_id>/evidence-index.md` | `<run_id>` | 连接 EV、TC、artifact、report、AC 和 VETO |
| gate summary | `reports/runs/<run_id>/gate-summary.md` | `<run_id>` | 裁决 P0 blocking suite 是否通过 |
| redaction check | `reports/runs/<run_id>/redaction-check.md` | `<run_id>` | 支撑 forbidden material / secret 0 容忍裁决 |
| dependency boundary | `reports/runs/<run_id>/dependency-boundary.md` | `<run_id>` | 支撑 no non-core sibling compile dependency |
| report audit | `reports/runs/<run_id>/report-audit.md` | `<run_id>` | 支撑 artifact/report pairing 和 no static evidence |
| 验收交接 | `reports/acceptance/handoff.md` | `<acceptance_review_version>` | 送验总说明和人 / Agent 审查补充入口 |
| 一票否决检查 | `reports/acceptance/veto-checklist.md` | `<acceptance_review_version>` | 判断 `VETO-ID-001~006` 是否触发 |
| 风险接受 | `reports/acceptance/risk-acceptance.md` | `<acceptance_review_version>` | 支撑有条件通过 |
| 未关闭问题 | `reports/acceptance/open-issues.md` | `<acceptance_review_version>` | 支撑缺陷、遗留和复验追踪 |

### 8.3 P0 blocking suite 基线表

| Suite / check | Blocking | 必须定位的 artifact/report |
|---|---|---|
| `contract-domain-fast` | P0 | `artifacts/test/<run_id>/suites/contract-domain-fast/`;`reports/runs/<run_id>/suites/contract-domain-fast.md` |
| `service-flow-fast` | P0 | `artifacts/test/<run_id>/suites/service-flow-fast/`;`reports/runs/<run_id>/suites/service-flow-fast.md` |
| `config-redline` | P0 | `artifacts/test/<run_id>/suites/config-redline/`;`reports/runs/<run_id>/suites/config-redline.md` |
| `dependency-boundary` | P0 | `artifacts/test/<run_id>/suites/dependency-boundary/`;`reports/runs/<run_id>/dependency-boundary.md` |
| `infra-runtime-fake` | P0 | `artifacts/test/<run_id>/suites/infra-runtime-fake/`;`reports/runs/<run_id>/suites/infra-runtime-fake.md` |
| `entry-worker-job` | P0 | `artifacts/test/<run_id>/suites/entry-worker-job/`;`reports/runs/<run_id>/suites/entry-worker-job.md` |
| `operations-replay-core` | P0 | `artifacts/test/<run_id>/suites/operations-replay-core/`;`reports/runs/<run_id>/suites/operations-replay-core.md` |
| `redaction-boundary` | P0 | `artifacts/test/<run_id>/suites/redaction-boundary/`;`reports/runs/<run_id>/redaction-check.md` |
| `report-generation-audit` | P0 | `artifacts/test/<run_id>/suites/report-generation-audit/`;`reports/runs/<run_id>/report-audit.md` |
| `release-main-smoke` | P0 | `artifacts/test/<run_id>/suites/release-main-smoke/`;`reports/runs/<run_id>/suites/release-main-smoke.md` |

### 8.4 P1 / P2 基线槽位

| 范围 | 是否 P0 必需 | 基线要求 |
|---|---|---|
| `p1-real-like-selected-run` | 否 | 若执行,必须有 selected-run artifact;若未执行,记录 unavailable / residual |
| `staging-like` | 否 | 仅作为 P1 dry-run 或 pre-production selected-run,不可替代 P0 fake / controlled evidence |
| `production-like` | 否 | 当前不执行;不得伪造 production evidence |
| hard SLO / capacity | 否 | 当前无正式阈值;若硬化必须有正式容量模型和 baseline |

### 8.5 非法基线引用清单

以下内容不得作为正式验收基线:

- `latest`
- `artifacts/test/<project>/<run_id>`
- `reports/<project>/...`
- 只有聊天记录、口头确认或手写 pass 的 evidence。
- 无 `run_id` 的 artifact 或 report。
- 无 artifact/report pairing 的 suite result。
- 被删除 failed artifact 后重生的 pass report。
- P1 selected-run 替代 P0 blocking suite。
- `local-dev` 手动 smoke 替代 release evidence。
- 真实产品不可用时的 fake success 或 silent fallback。

### 8.6 基线变更规则

| 变更类型 | 必须动作 |
|---|---|
| `00` AC / VETO 语义变更 | 回到 Step 1 / Step 2 复核输入和范围,重生受影响 evidence |
| `01` dependency / truth boundary 变更 | 回到 Step 6 / Step 7 复核红线和跨仓接缝 |
| `03` public protocol / state / flow / transaction 变更 | 回到 Step 5 / Step 7 / Step 8 复核验收项 |
| `04` profile / adapter / redaction 变更 | 回到 Step 3 / Step 9 / Step 10 复核基线和非功能 / 证据门禁 |
| `05` TC / EV / artifact / report 变更 | 回到 Step 3 / Step 10 / Step 11 复核 evidence 和 VETO |
| source commit / build / image 变更 | 重新固定交付基线,重新执行受影响 blocking suite |
| `<run_id>` 变更 | 重新定位 artifact / report / acceptance handoff,不得混用未列明 run |

## 9. 对上游 / 下游文档的影响判定

| 结论 | 是否影响上游 / 下游 | 影响类型 | 处理状态 |
|---|---|---|---|
| 基线槽位足够进入 Step 4 | 否 | 验收基线结构闭合 | 无需回写 |
| 具体送验 commit / build / image / `<run_id>` 尚未固定 | 否 | 送验材料待补 | Step 4 可定义进入条件;Step 14 前必须闭合 |
| `reports/acceptance/*` 尚未确认存在 | 否 | 验收交接材料待补 | Step 10 检查,Step 14 裁决 |
| 如果送验材料使用非法路径或 `latest` | 是 | 验收证据不可裁决 | Step 10 / Step 14 阻断 |
| 如果 P0 suite 缺 artifact/report pairing | 是 | evidence integrity 缺口 | Step 10 阻断,不得手写补 pass |

## 10. 回填草稿

> 校准来源:
> - `design-calibration/06_acceptance_step_03_baseline.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“SOP 问题回答”“结构化中间产物”“基线变更规则”和“待确认事项”小节,了解验收基线如何从新版 `05` 的 artifact/report 规则收敛。

正式 `06-验收标准.md` §3 应回填:

- 本轮验收必须固定需求、架构、概要、详细设计、配置设计、测试方案、校准中间产物、交付源码、构建产物、配置、数据、依赖协作和证据运行基线。
- 正式 evidence 必须位于 `artifacts/test/<run_id>`、`reports/runs/<run_id>` 和 `reports/acceptance`。
- P0 blocking suite 必须有 raw artifact 与 report 配对;缺任一项不得裁决为通过。
- `latest`、`reports/<project>`、`artifacts/test/<project>/<run_id>`、口头 pass、手写 pass、删除 failed artifact 后补 report 均不得作为正式验收基线。
- P1 selected-run、`staging-like`、`production-like` 和 hard SLO / capacity 不得替代 P0 baseline。
- 基线发生影响 AC / VETO / contract / state / transaction / config / redaction / evidence 的变更时,必须重新复核对应 Step 并重生受影响证据。

## 11. 待确认事项

| 待确认事项 | 影响 | 当前处理 |
|---|---|---|
| 送验 source commit 未提供 | 影响交付基线 | Step 4 进入条件要求补齐;Step 14 前必须闭合 |
| build id / image digest / package digest 未提供 | 影响可复验性 | Step 4 进入条件要求补齐 |
| 固定 `<run_id>` 未提供 | 影响 artifact/report 定位 | Step 4 进入条件要求补齐 |
| config profile 与 config digest 未提供 | 影响环境基线 | Step 4 进入条件要求补齐 |
| P0 blocking suite 的实际 artifact/report 是否齐全未确认 | 影响 evidence gate | Step 10 裁决 |
| `reports/acceptance/*` 是否已生成和审查未确认 | 影响 handoff / VETO / risk acceptance | Step 10 / Step 14 裁决 |
| evidence retention days 未固定 | 影响长期审计 | Step 10 / Step 13 继续处理 |

## 12. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| 文档基线槽位明确 | 通过 | 见 §8.1 |
| 交付基线槽位明确 | 通过 | 见 §8.1 / §11 |
| 环境、配置和数据基线槽位明确 | 通过 | 见 §8.1 / §8.4 |
| artifact/report/acceptance 路径明确 | 通过 | 见 §8.2 |
| P0 blocking suite 基线明确 | 通过 | 见 §8.3 |
| 非法基线引用明确 | 通过 | 见 §8.5 |
| 未发明具体送验值 | 通过 | 当前只定义必填槽位 |
| 可进入 Step 4 | 通过 | 用户已确认,进入 Step 4: 定义进入条件与退出条件 |
