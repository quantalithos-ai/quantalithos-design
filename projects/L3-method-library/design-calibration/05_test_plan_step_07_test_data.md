# Step 7. 设计测试数据

> 对应 SOP: `standards/document/测试方案讨论流程_SOP.md` Step 7
> 回填章节: `05-测试方案.md` §7 测试数据设计
> 创建日期: 2026-06-27
> 当前模式: full-restart / step7-test-data
> 当前状态: completed_wait_user_confirm_to_R8.1
> 当前模块: `R7.14 cross-data audit / closure 数据:再写入`
> 当前门禁: `R7.14` completed_wait_user_confirm_to_R8.1;等待确认进入 Step 8 `R8.1 测试环境与配置矩阵:先思考`

---

## 0. Step 6 handoff

Step 6 已确认当前 `05-测试方案.md` 的测试场景与用例矩阵:

- 已形成 83 条 P0 候选用例行,覆盖 definition truth / identity / catalog、formal version / explicit change / state、controlled consumption / distribution / seam、traceability / consistency / job / recovery、config / dependency / redaction / observability 五个批次。
- 已修正 R6.10 的 `TC-ML-RECOVERY-001~002` 重复编号,当前 recovery 编号为 R6.6 `001~002` 和 R6.10 `003~004`。
- Step 6 只固定用例前置、操作、预期、断言、自动化候选和 evidence candidate,未固定测试数据集、fixture、builder、seed、fault injection profile、环境矩阵、CI suite 或 evidence schema。
- Step 6 后移给 Step 7 的数据需求包括 valid/invalid definition、formalization state、version state、consumption material、stored surface、commit unknown、checkpoint/report、invalid config、raw secret/body、marker source 等。
- 缺正式 schema、port、state、mapper、marker source、config key、evidence schema 或 phase boundary 时,Step 7 不得用 fixture、private fake map、raw ID、route param、字符串或旧材料补口。

Step 7 的任务是把 Step 6 的用例前置条件转成可重复生成、可隔离、可清理、可追溯到 TC 的测试数据设计。它必须按数据族和测试切口逐批推进,不得一次性写完整 fixture 实现或环境/CI 方案。

---

## R7.1 测试数据设计:先思考

### 1. 当前模块目标

`R7.1` 只思考 Step 7 的开工边界、必读文档、SOP 九问、Step 6 handoff、L1-governance Step 7 框架参考、L3-method-library 的数据族、fixture / builder / seed / fault injection 边界、数据隔离、敏感数据和 `R7.2` 写入边界。

当前模块不写最终数据集表、DS 编号全集、fixture 文件路径、builder 函数名、seed 代码、fault injection 脚本、环境矩阵、CI suite、evidence schema、验收标准或实施计划。

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm_to_R7.2 |
| 用户确认 | 已确认从 Step 6 completed 推进到 Step 7 `R7.1`。 |
| 当前允许 | 思考测试数据设计的输入边界、必读文档、数据族、构造方式分类、隔离键、清理方式、敏感数据红线、外部依赖替身边界和 R7.2 写入计划。 |
| 当前禁止 | 修改正式 `05-测试方案.md`;写最终数据集表、DS 编号全集、fixture 路径、builder 函数名、seed 代码、fault injection 脚本、环境矩阵、CI suite、evidence schema、正式验收标准、实施计划或 implementation code。 |

### 2. Step 7 启动前必须承接

| 输入 | 必须承接的内容 | 禁止继承 / 禁止提前 |
|---|---|---|
| `project_execution_ledger.md` | 当前恢复点为 Step 6 completed_wait_user_confirm_to_R7.1;每次确认只推进一个当前模块。 | 跳过 R7.1 直接写 DS 全集。 |
| `05_test_plan_calibration_flow.md` | Step 1~6 completed;Step 7 waiting_user_confirm_to_R7.1;Step 8+ blocked。 | 写环境矩阵、CI 门禁、evidence schema 或正式 `05`。 |
| `05_test_plan_step_06_cases.md` | 83 条候选用例、每条前置条件、数据需求备注、Step 6 后移一致性和 source-missing 停审规则。 | 扩充新业务 TC 或改变用例断言。 |
| `测试方案讨论流程_SOP.md` Step 7 | 输出测试数据集表、fixture / builder / seed 规则、用例前置映射、停审记录、跨数据隔离 / 清理审计。 | 依赖人工临时造数或无清理策略的数据。 |
| `测试方案书写规范.md` §5.7 | 必须区分基础、边界、异常、并发、恢复数据;每个 P0 用例回指可重复生成数据集或说明无数据前置。 | 只写“准备合法数据”或“模拟异常”。 |
| `00-需求文档.md` | FR-ML-001~009、BR-ML-001~022、NFR-ML-004~016、数据归属、禁止保存正文、下游边界。 | 把 FR-ML-E-* / BR-ML-E-* 外围增强写成 P0 数据前置。 |
| `01-架构设计.md` | 仓边界、Definition vs Use、数据所有权、相邻仓关系、依赖方向。 | 使用真实 sibling repo 内部状态作为 P0 fixture。 |
| `02-概要设计.md` | 八个组成部分、关键对象轮廓、处理流、状态、异常和配置影响。 | 用概要设计未闭口的词补正式 fixture 字段。 |
| `03-详细设计.md` | object / port / protocol / flow / state / transaction / error / idempotency / config / observability 正式契约。 | 从测试便利反向新增 schema、state、mapper、marker、stored surface。 |
| `04-配置设计.md` | profile、source priority、test fixture source、secret ref、adapter availability、redaction、failure/degradation。 | 写真实 secret provider schema、产品绑定、部署命令或 production-like 前置。 |
| L1-governance Step 7 | 参考数据集体系、用例映射、构造规则、隔离清理和停审框架。 | 复制 governance 的 DS 编号、对象、状态、事件或领域事实。 |

### 3. SOP Step 7 九问思考边界

| SOP 问题 | R7.1 思考边界 | 后续落点 |
|---|---|---|
| 哪些基础数据必须存在? | 先按 definition、catalog、formalization、version、consumption、trace、audit、idempotency、config、redaction 识别数据族,不写 DS 编号全集。 | R7.2 建立数据族框架;后续分批写数据集。 |
| 哪些边界、异常、并发和恢复数据必须构造? | 先识别 missing identity/context、raw body、not-formal、retired、same-key different digest、stored surface missing、commit unknown、rollback、invalid config 等类别。 | R7.3+ 分批展开。 |
| 数据如何隔离不同测试运行? | 初判使用 run-scoped namespace 作为最高隔离,再按 method asset ref、operation key、source ref、job run、profile/config case 分区。 | R7.2 写隔离原则;后续映射到数据集。 |
| 数据如何清理? | 初判 fake / in-memory 数据按 run namespace drop;故障 profile reset;isolated leak corpus delete;durable-like 只保留后续方向。 | R7.2 写清理原则;Step 8/9 再落环境和执行。 |
| 哪些外部依赖使用 fake / stub / real-like? | P0 只使用 fake / controlled / disabled;真实 sibling repo、真实 broker、真实 provider 和真实 secret provider 不作为 P0 数据来源。 | R7.2 写替身边界;Step 8 写环境矩阵。 |
| 每个 P0 用例的数据前置条件是否能由 fixture / builder / seed 稳定构造? | R7.1 只建立“必须能回指数据集或声明无数据前置”的规则。 | 后续每批数据映射 TC。 |
| 哪些负向、边界、并发和恢复数据需要单独数据集? | 初判 raw body/secret、source mismatch、marker missing、idempotency conflict、commit unknown、stored surface missing、rollback、profile pollution 必须单独数据集。 | R7.4+ 分批写入。 |
| 每个测试切口的数据设计完成后是否通过停审? | 先定义每批数据写完必须检查构造稳定、隔离键、清理方式、替身来源和 source gap。 | 每批再写入停审。 |
| 所有数据集完成后是否存在污染、清理缺失、替身不明确或人工造数依赖? | 先定义最终跨数据审计维度。 | Step 7 收尾模块执行。 |

### 4. L1-governance Step 7 框架参考思考

L1-governance Step 7 的价值在于“把 Step 6 用例前置条件转成数据集体系,再按切口映射用例,最后审计隔离 / 清理 / 替身一致性”。L3 采用框架,不复制领域事实。

| L1-governance 框架点 | L3 采用方式 | L3 禁止 |
|---|---|---|
| Step 状态、目标和输入基线先行 | L3 Step 7 先写 Step 6 handoff、必读文档和禁止范围。 | 不直接写 DS 全集。 |
| 数据集表稳定列 | L3 保留数据集、用途、构造方式、隔离键、清理方式、关联用例。 | 不写“手动准备数据”。 |
| 按切口映射数据前置 | L3 按 Step 6 的五个用例批次映射数据族。 | 不按实现模块随意分表。 |
| 构造规则独立成章 | L3 单独写 deterministic ids、fixed clock、canonical digest、formal refs、body-free、fake fidelity。 | 不用随机值、当前时间、raw body 或私有 fake 状态断言。 |
| 停审和跨数据审计 | L3 每批数据写完停审,最后检查污染、清理、fixture 重复、替身不一致和 source gap。 | 不把所有问题留到 Step 13 或实施阶段。 |

### 5. L3 测试数据族思考

| 数据族 | 主要承接用例 | 构造方式初判 | R7.1 裁决 |
|---|---|---|---|
| run / actor / clock / id namespace | 全部 TC | deterministic run seed、fixed clock、scoped id range。 | 必须有最高隔离壳。 |
| definition truth / catalog data | `TRUTH` / `IDENTITY` / `CATALOG` / `SHELL` / `QUERY` | formal object builder + catalog view/material seed。 | 正向和 missing/absent 分开。 |
| formalization / version / state data | `FORMALIZATION` / `VERSION` / `CHANGE` / `STATE` | accepted / rejected / blocked / terminal state builder。 | illegal transition 单独数据集。 |
| idempotency / stored surface / recovery data | `IDEMP` / `REPLAY` / `RECOVERY` / `UOW` | operation key + canonical digest + stored result / missing surface + UoW fault profile。 | 不从 current truth 重建响应。 |
| consumption / distribution / handoff data | `CONSUMPTION` / `DISTRIBUTION` / `PUBLISHER` / `HANDOFF` / `SEAM` | current material、not-formal/retired material、outcome/receipt refs、fake target status。 | 下游状态不能成为 truth fixture。 |
| trace / audit / lineage / impact data | `TRACE` / `AUDIT` / `LINEAGE` / `IMPACT` / `EVIDENCE` | safe basis refs、accepted fact refs、impact refs、lineage refs。 | 不迁入治理执行正文或 evidence file body。 |
| operations job / checkpoint / report data | `JOB` / `RECOVERY` / `DIAGNOSTIC` | job run key、checkpoint/progress/report/issue refs、partial failure profile。 | report schema 和 artifact path 后移 Step 13。 |
| config / dependency / profile data | `CONFIG` / `DEPENDENCY` / `MARKER` | valid/invalid config sample、profile case、adapter binding fake、source priority case。 | 不新增 config key 或 secret provider schema。 |
| redaction / observability data | `REDACTION` / `METRIC` / `OBSERVABILITY` | safe output corpus、isolated dummy leak corpus、metric/trace candidate capture。 | dummy raw secret/body 只进隔离负向 corpus。 |
| old material pollution data | `POLLUTION` / cross-case audit |旧 MethodContent / publish / snapshot / fingerprint / old outbox 词条样本。 | 只作污染扫描输入,不得作为当前 truth。 |

### 6. fixture / builder / seed / fault injection 边界思考

| 构造方式 | 当前允许 | 当前禁止 |
|---|---|---|
| fixture | 允许表达 raw input / config sample / DTO sample / fake adapter output 的可重复样本。 | 不允许 fixture 私自补正式 schema、marker、state、stored surface 或 config key。 |
| builder | 允许按 `03` 正式 object / DTO / state 构造 body-free typed refs 和 safe summaries。 | 不允许 builder 创建 `03` 未定义字段或从字符串拼 typed ref。 |
| seed | 允许为 fake repository / in-memory store 写入正式 truth、support state、stored result、report summary 或 material refs。 | 不允许 seed 写真实 sibling repo 状态、真实 provider payload、production-like secret 或 query-time repair。 |
| fault injection | 允许表达 repository/UoW/version conflict/commit unknown/resolver unavailable/publisher failed/handoff failed 的受控故障。 | 不允许用 log、timeout、HTTP code、adapter raw error 或 private flag 替代正式 recovery / marker source。 |

### 7. 数据隔离、清理与敏感数据红线

| 主题 | R7.1 思考结论 |
|---|---|
| 最高隔离键 | 每个数据集必须可归入 run-scoped namespace;后续 DS 表需明确 `test_run_ref` 或等价 run key。 |
| 二级隔离键 | method asset ref、definition ref、formal version ref、consumption material ref、operation key、source key、job run key、config case id 和 leak case id。 |
| 清理方式 | fake / in-memory 默认 drop run namespace;fault profile reset;leak corpus delete;durable-like cleanup 后移 Step 8/9。 |
| 敏感数据 | 不使用真实 secret、真实 DSN、真实 token、真实 provider response、真实 artifact body;负向 redaction 只用 dummy corpus。 |
| body-free | raw method body、external body、artifact body、event payload body、report body 不得进入 truth、audit、trace、metric、diagnostic 或 evidence candidate。 |
| marker source | degraded / unavailable / failed / redaction marker 只能复制正式 source;数据设计不得生成 synthetic marker。 |

### 8. R7.2 写入边界

R7.2 可以写入:

1. Step 7 开工基线、输入列表和禁止范围。
2. Step 7 数据设计总体框架。
3. 测试数据集表的列定义和命名规则。
4. fixture / builder / seed / fault injection 的正式边界规则。
5. 数据隔离、清理、敏感数据、外部依赖替身的通用规则。
6. 后续 R7.x 分批写入计划。

R7.2 禁止写入:

1. 完整 DS 编号全集或全部 TC 到数据集映射。
2. fixture 文件路径、builder 函数名、seed 代码、fault injection 脚本。
3. 环境矩阵、profile 执行矩阵、CI suite、required check、执行命令。
4. evidence ID、artifact path、JSON schema、report schema、验收 gate、release verdict。
5. 新增 schema、port、mapper、state、marker source、config key 或 implementation boundary。
6. 修改正式 `05-测试方案.md` 或 implementation code。

### 9. R7.1 stop-review

| 检查项 | 结果 |
|---|---|
| 是否只思考 Step 7 数据设计边界 | pass |
| 是否承接 Step 6 的 83 条候选用例和后移数据需求 | pass |
| 是否参考 L1-governance 框架但不复制领域事实 | pass |
| 是否识别 L3 数据族、构造方式、隔离清理和敏感数据红线 | pass |
| 是否未写最终 DS 编号全集或完整 TC 映射 | pass |
| 是否未写 fixture 路径、builder 函数、seed 代码或 fault injection 脚本 | pass |
| 是否未写环境、CI、evidence schema、验收或实施内容 | pass |
| 是否未修改正式 `05-测试方案.md` | pass |

next_allowed_action: 等待用户确认后进入 Step 7 `R7.2 测试数据设计:再写入`;只允许写入 Step 7 开工基线、输入列表、禁止范围、测试数据设计总体框架、数据集列定义和命名规则、fixture / builder / seed / fault injection 边界、隔离 / 清理 / 敏感数据 / 替身通用规则、后续 R7.x 分批写入计划;不得直接修改正式 `05-测试方案.md`;不得写完整 DS 编号全集、完整 TC 映射、环境矩阵、CI suite、evidence schema、验收标准、实施计划或 implementation code。

---

## R7.2 测试数据设计:再写入

### 1. 当前模块状态

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm_to_R7.3 |
| 用户确认 | 已确认从 `R7.1` 推进到 `R7.2`。 |
| 本模块写入范围 | Step 7 开工基线、输入列表、禁止范围、测试数据设计总体框架、数据集列定义和命名规则、fixture / builder / seed / fault injection 边界、隔离 / 清理 / 敏感数据 / 替身通用规则、后续 R7.x 分批写入计划。 |
| 本模块禁止范围 | 正式 `05-测试方案.md` 正文、完整 DS 编号全集、完整 TC 映射、fixture 路径、builder 函数、seed 代码、fault injection 脚本、环境矩阵、CI suite、evidence schema、验收标准、实施计划和 implementation code。 |

### 2. Step 7 开工基线

| 基线项 | 当前结论 | 处理口径 |
|---|---|---|
| 当前输入 | Step 1~6 中间产物、正式 `00`~`04`、SOP Step 7、测试方案书写规范 §5.7。 | 只从已确认测试输入和正式设计契约抽取数据需求。 |
| 当前输出 | `05_test_plan_step_07_test_data.md` 的测试数据中间产物。 | 正式 `05-测试方案.md` 留 Step 15 装配。 |
| 用例规模 | Step 6 已形成 83 条候选用例行。 | Step 7 逐批把前置条件映射到可重复数据集。 |
| 数据职责 | 定义数据如何构造、隔离、复用、清理和替身化。 | 不定义执行环境、CI suite、evidence schema 或验收 verdict。 |
| 停审方式 | 每个数据批次完成后停审,最终执行跨数据隔离 / 清理审计。 | 不把 fixture 冲突和 source gap 留到实施阶段。 |

### 3. 输入列表与禁止范围

| 输入 | Step 7 使用方式 | 禁止 |
|---|---|---|
| Step 6 用例矩阵 | 提取用例前置条件、触发数据、负向数据、并发 / 恢复数据需求。 | 新增 TC、改变断言或把 P1/P2 residual 提升为 P0 前置。 |
| `03-详细设计.md` | 约束 object、DTO、state、stored surface、port、flow、marker、error、transaction 和 idempotency 数据形态。 | fixture 私自补字段、状态、mapper、marker source 或 stored surface。 |
| `04-配置设计.md` | 约束 profile、source priority、test fixture source、secret ref、adapter availability、redaction 和 failure/degradation。 | 新增 config key、secret provider schema、产品绑定或 production-like fixture。 |
| `00`~`02` | 约束需求、边界、数据归属、依赖方向和相邻仓非拥有关系。 | 使用真实 sibling repo 内部 truth 或旧材料反向定义数据。 |
| L1-governance Step 7 | 参考数据集、映射、构造规则、隔离清理和停审结构。 | 复制 governance 的 DS 编号、对象、状态、事件或领域事实。 |

### 4. 测试数据设计总体框架

Step 7 采用“数据族 -> 数据集 -> 用例映射 -> 停审 -> 跨数据审计”的结构。R7.2 只固定框架和规则,后续模块再逐批写具体数据集。

| 数据族 | 后续 DS 命名族 | 覆盖方向 | 后续展开 |
|---|---|---|---|
| run / actor / deterministic base | `DS-ML-RUN-*` | run namespace、fixed clock、scoped id、actor / operation context。 | 与所有批次共享,在第一批写入基础壳。 |
| definition truth / identity / catalog | `DS-ML-DEF-*`;`DS-ML-CATALOG-*` | definition 正向 / 缺身份 / raw body 禁入 / catalog visible-empty-degraded / old material pollution。 | R7.3 / R7.4 |
| formalization / version / state | `DS-ML-FORMAL-*`;`DS-ML-VERSION-*`;`DS-ML-STATE-*` | accepted/rejected formalization、basis summary、current/superseded/retired version、illegal transition。 | R7.5 / R7.6 |
| idempotency / stored surface / recovery | `DS-ML-IDEMP-*`;`DS-ML-RECOVERY-*`;`DS-ML-UOW-*` | same digest replay、different digest conflict、stored surface missing、commit unknown、rollback/version conflict。 | R7.5~R7.10 分批承接 |
| consumption / distribution / handoff | `DS-ML-CONSUME-*`;`DS-ML-DIST-*`;`DS-ML-HANDOFF-*` | current consumption material、not-formal/retired blocked、downstream boundary、publisher/handoff outcome refs。 | R7.7 / R7.8 |
| trace / audit / lineage / impact | `DS-ML-TRACE-*`;`DS-ML-AUDIT-*`;`DS-ML-LINEAGE-*`;`DS-ML-IMPACT-*` | safe basis refs、accepted fact refs、impact refs、lineage refs、body-free audit。 | R7.9 / R7.10 |
| operations job / checkpoint / report | `DS-ML-JOB-*`;`DS-ML-REPORT-*` | stored job report、checkpoint/progress/issue refs、partial failure、job no truth repair。 | R7.9 / R7.10 |
| config / dependency / redaction / observability | `DS-ML-CONFIG-*`;`DS-ML-DEPENDENCY-*`;`DS-ML-REDACTION-*`;`DS-ML-OBS-*` | invalid config、profile pollution、adapter missing/unavailable、dummy leak corpus、metric/trace safe capture。 | R7.11 / R7.12 |

### 5. 数据集表列定义

后续数据集表必须使用以下稳定列。列定义固定,但 R7.2 不填完整 DS 编号全集。

| 列 | 含义 | 写法要求 |
|---|---|---|
| 数据集 | `DS-ML-<FAMILY>-<NNN>` 或明确的 shared dataset 名称。 | 编号只在具体数据批次写入;不得提前占满全集。 |
| 用途 | 该数据集支持的验证目标。 | 必须可回指 Step 6 的用例族或 TC。 |
| 构造方式 | fixture / builder / seed / fault profile / generated corpus。 | 必须说明来源是正式 `03/04` 契约或 Step 6 前置。 |
| 隔离键 | run key 和二级业务 / 操作 / source / config key。 | 至少有 run-scoped namespace 或等价隔离壳。 |
| 清理方式 | run namespace drop、store reset、fault reset、isolated corpus delete、no persistent cleanup。 | 不得留“人工清理”。 |
| 关联用例 | TC-ID、TC-ID range 或用例族。 | 大范围映射必须在后续具体批次收敛。 |

### 6. 命名规则

| 规则 | 正式口径 |
|---|---|
| DS 前缀 | L3 测试数据统一使用 `DS-ML-`。 |
| family 名 | family 必须对应 Step 6 用例族或 Step 7 共享基础族,例如 `RUN`、`DEF`、`CATALOG`、`FORMAL`、`VERSION`、`CONSUME`、`TRACE`、`CONFIG`。 |
| 编号 | 每个 family 内使用三位递增编号;编号在具体写入批次内分配。 |
| shared 数据 | 跨批次共享数据可以使用 `DS-ML-RUN-*` 或在具体批次声明 shared。 |
| negative 数据 | 负向、边界、并发、恢复数据必须单独编号,不得隐藏在 happy-path 数据集里。 |
| old material | 旧材料污染样本只能命名为 pollution / guard 数据,不得使用当前 truth family 名称。 |

### 7. fixture / builder / seed / fault injection 正式边界

| 构造方式 | 可承载 | 不可承载 | 停审点 |
|---|---|---|---|
| fixture | DTO sample、config sample、dummy leak corpus、fake adapter output、old material pollution sample。 | 正式 schema 新字段、真实 secret、真实 provider payload、真实 artifact body、evidence artifact schema。 | 是否只作为输入样本,且不反向定义正式对象。 |
| builder | 正式 object / DTO / state / typed ref / safe summary 的可重复构造。 | `03` 未定义字段、私造 marker、从 raw string 拼 typed ref、绕过 state guard。 | 是否完全回指 `03` object/protocol/state。 |
| seed | fake repository / in-memory store 的 truth/support/material/stored surface/report summary 前置。 | 真实 sibling repo 状态、query repair、production-like secret、旧 MethodContent truth。 | 是否有 expected version、run namespace 和清理方式。 |
| fault profile | UoW failure、version conflict、commit unknown、resolver unavailable、publisher failed、handoff failed。 | 以 log、timeout、HTTP code、raw adapter error、private flag 作为正式 marker 或 recovery source。 | 是否只触发已存在的正式 failure / recovery branch。 |

### 8. 隔离、清理、敏感数据与替身规则

| 主题 | 规则 | 后续检查 |
|---|---|---|
| run 隔离 | 所有持久或可观察数据必须归入 `test_run_ref` 或等价 run namespace。 | 后续每个 DS 必须写隔离键。 |
| 操作隔离 | command / inbound / job / replay 数据必须再按 operation key、source key、job run key 或 idempotency key 分区。 | duplicate / conflict 用例不得复用无关 key。 |
| state 隔离 | definition、version、consumption material、trace、report 等数据必须有正式 ref 或 owner ref。 | 不用 route param、filename、topic 或旧 ID 替代 typed ref。 |
| 清理 | in-memory / fake store 默认 run namespace drop;fault profile reset;isolated leak corpus delete。 | 不接受人工临时清理。 |
| 敏感数据 | 禁用真实 secret、真实 token、真实 DSN、真实 provider response、真实 artifact body。 | 负向 redaction 只能使用 dummy value。 |
| body-free | raw method body、external body、artifact body、event payload body、transport response body、report body 不得进入 truth/audit/trace/metric/evidence candidate。 | 后续 redaction 数据集必须隔离。 |
| 替身 | P0 只允许 fake / controlled / disabled;real-like 仅作为后续环境方向,不作为当前 P0 数据前置。 | Step 8 再写环境矩阵。 |
| source gap | 若正式 marker/source/schema/port/state 缺失,数据设计只能停审或回 owning source。 | 不用 fixture、private fake map 或旧材料补口。 |

### 9. 后续 R7.x 分批写入计划

| 模块 | 主题 | 目标 |
|---|---|---|
| R7.3 | definition truth / identity / catalog 数据:先思考 | 思考 `TRUTH` / `IDENTITY` / `CATALOG` / `SHELL` / `QUERY` / `POLLUTION` 用例的数据集和边界。 |
| R7.4 | definition truth / identity / catalog 数据:再写入 | 写入第一批数据集、用例前置映射和批次停审。 |
| R7.5 | formal version / explicit change / state 数据:先思考 | 思考 `FORMALIZATION` / `VERSION` / `CHANGE` / `STATE` / command replay / recovery 数据。 |
| R7.6 | formal version / explicit change / state 数据:再写入 | 写入第二批数据集、用例前置映射和批次停审。 |
| R7.7 | controlled consumption / distribution / seam 数据:先思考 | 思考 consumption material、downstream boundary、publisher/handoff seam 和 marker source 数据。 |
| R7.8 | controlled consumption / distribution / seam 数据:再写入 | 写入第三批数据集、用例前置映射和批次停审。 |
| R7.9 | traceability / consistency / job / recovery 数据:先思考 | 思考 trace/audit/lineage/impact、stored surface、UoW、checkpoint/report/job 数据。 |
| R7.10 | traceability / consistency / job / recovery 数据:再写入 | 写入第四批数据集、用例前置映射和批次停审。 |
| R7.11 | config / dependency / redaction / observability 数据:先思考 | 思考 config/profile/dependency/redaction/metric/trace/marker 数据。 |
| R7.12 | config / dependency / redaction / observability 数据:再写入 | 写入第五批数据集、用例前置映射和批次停审。 |
| R7.13 | cross-data audit / closure 数据:先思考 | 思考跨数据污染、清理缺失、fixture 重复、替身不一致、source gap 和 Step 8 进入门禁。 |
| R7.14 | cross-data audit / closure 数据:再写入 | 写入 Step 7 总停审和 Step 8 进入门禁。 |

### 10. R7.2 stop-review

| 检查项 | 结果 |
|---|---|
| 是否只写 Step 7 数据设计总体框架 | pass |
| 是否固定数据集列定义和命名规则 | pass |
| 是否固定 fixture / builder / seed / fault injection 边界 | pass |
| 是否固定隔离、清理、敏感数据和替身通用规则 | pass |
| 是否形成后续 R7.x 分批计划 | pass |
| 是否未写完整 DS 编号全集或完整 TC 映射 | pass |
| 是否未写 fixture 路径、builder 函数、seed 代码或 fault injection 脚本 | pass |
| 是否未写环境、CI、evidence schema、验收或实施内容 | pass |
| 是否未修改正式 `05-测试方案.md` | pass |

next_allowed_action: 等待用户确认后进入 Step 7 `R7.3 definition truth / identity / catalog 数据:先思考`;只允许思考 definition truth / identity / catalog 数据批次的输入边界、用例范围、数据集候选、fixture / builder / seed / fault profile 边界、隔离清理、source gap 和 `R7.4` 写入边界;不得直接修改正式 `05-测试方案.md`;不得写最终 DS 全集、其他批次数据、环境矩阵、CI suite、evidence schema、验收标准、实施计划或 implementation code。

---

## R7.3 definition truth / identity / catalog 数据:先思考

### 1. 当前模块目标

`R7.3` 只思考 Step 6 R6.4 第一批用例的数据设计边界,覆盖 definition truth、identity/catalog、Definition vs Use、public shell、query no-write 和 old material pollution。当前模块不写最终数据集表、DS 编号行、完整 TC 映射、fixture 路径、builder 函数、seed 代码、环境矩阵、CI suite 或 evidence schema。

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm_to_R7.4 |
| 用户确认 | 已确认从 `R7.2` 推进到 `R7.3`。 |
| 当前允许 | 思考本批输入边界、用例范围、数据集候选、fixture / builder / seed / fault profile 边界、隔离清理、source gap 和 R7.4 写入边界。 |
| 当前禁止 | 修改正式 `05-测试方案.md`;写最终 DS 编号表、完整 TC 映射、其他批次数据、环境矩阵、CI suite、evidence schema、验收标准、实施计划或 implementation code。 |

### 2. 本批用例范围

| 用例族 | 用例 ID | 数据设计关注点 |
|---|---|---|
| definition truth | `TC-ML-TRUTH-001~004` | valid definition intent、invalid definition intent、external body violation、downstream use attempt。 |
| identity / catalog | `TC-ML-IDENTITY-001~002`;`TC-ML-CATALOG-001~002` | catalog entry visible / missing / state source / stale or unavailable view。 |
| boundary / shell / query | `TC-ML-BOUNDARY-001`;`TC-ML-SHELL-001`;`TC-ML-QUERY-001` | downstream use boundary input、public shell safe refs、query visible/empty/degraded/no-write surfaces。 |
| pollution guard | `TC-ML-POLLUTION-001` | old `MethodContent` / publish / snapshot / fingerprint / old outbox sample as negative scan input。 |

本批不覆盖 formalization、formal version、semantic change、controlled consumption、distribution、traceability、job、config、redaction/observability 的完整数据集;这些留 R7.5 以后。

### 3. 数据集候选思考

| 候选数据族 | 目标 | 后续 R7.4 可能写入 |
|---|---|---|
| run baseline | 给所有本批数据提供 run namespace、fixed clock、scoped id 和 actor / operation context。 | `DS-ML-RUN-*` shared dataset。 |
| valid definition | 支撑 `MethodAssetDefinition` 正向建立、public shell、catalog visible。 | definition builder + catalog seed。 |
| invalid definition | 缺 stable identity、缺 applicability context、非法 basis summary。 | negative definition intent fixture / builder。 |
| external body violation | raw external standard body、artifact body、provider payload、secret-like dummy body。 | isolated dummy body violation fixture。 |
| downstream use attempt | process / identity / runtime / UI / artifact 等下游 use input。 | boundary input fixture with safe refs only。 |
| catalog state | visible、missing、hidden、deprecated、retired、stale/degraded/unavailable view。 | catalog entry seed + read material seed。 |
| query no-write spy input | visible / empty / not-visible / degraded / unavailable read surface。 | fake read repository seed + write spy reset profile。 |
| old material pollution | old `MethodContent`、publish、snapshot、fingerprint、old outbox 词条样本。 | isolated pollution scan fixture。 |

### 4. 构造方式边界思考

| 数据类型 | 允许构造 | 禁止构造 |
|---|---|---|
| definition builder | 按 `03` 的 `MethodAssetDefinition`、typed ref、safe summary 和 expected version 构造。 | 增加未定义字段、用旧 `MethodContent` 字段替代 definition、保存 raw body。 |
| catalog seed | 按 `MethodAssetCatalogEntry` 和正式 catalog state / read surface 构造。 | 用 catalog view 反写 catalog truth;用 query 结果修复 truth。 |
| boundary fixture | 只表达下游 use context 的 safe refs / summary / source category。 | 载入真实 sibling repo 内部状态、运行 truth、UI state、artifact body。 |
| body violation fixture | 使用 dummy raw body / dummy secret / dummy provider payload 触发禁入。 | 使用真实 secret、真实标准正文、真实 artifact body 或真实 provider response。 |
| query no-write profile | fake repository write spy、read surface seed、degraded/unavailable marker source seed。 | 用 private fake map 合成 marker;让 query seed 产生隐藏写入。 |
| pollution fixture | 只作为扫描 / 审计输入。 | 作为当前 truth、catalog、event、evidence 或 positive assertion 来源。 |

### 5. 隔离与清理思考

| 主题 | 本批要求 |
|---|---|
| run 隔离 | 所有 definition、catalog、query spy、pollution fixture 均归入 `test_run_ref` 或等价 run namespace。 |
| truth 隔离 | definition ref、catalog entry ref、read surface ref 和 operation key 必须在本批唯一,不得与后续 formalization / consumption 数据混用。 |
| negative 隔离 | invalid definition、raw body violation、downstream use attempt、old material pollution 必须独立数据集,不得复用正向 definition。 |
| 清理方式 | fake / in-memory truth/catalog/read store 走 run namespace drop;write spy reset;body violation / pollution fixture 删除或隔离目录清理。 |
| 敏感数据 | 只允许 dummy secret/body,不得复制真实 secret、标准全文、artifact 包体、provider response 或旧证据正文。 |

### 6. source gap 与停审风险

| 风险 | 判断 | 处理 |
|---|---|---|
| catalog degraded marker 缺正式来源 | 数据设计不能合成 marker。 | R7.4 只写“需要正式 marker source seed”;若正式设计缺口命中,标 blocker。 |
| identity missing / not-visible surface 缺正式 public shell | 不能用 route param 或 raw ID 补。 | 回 `03` read decision / protocol source。 |
| body boundary violation 缺正式 error / rejection surface | 不能用 fixture 造错误类型。 | 回 `03` error / protocol source。 |
| write spy 发现 query 需要修复 material | Query no-write 红线优先。 | R7.4 数据只能准备 stale/degraded read surface,不得准备 query repair seed。 |
| old material pollution 样本被误用为 positive fixture | 旧材料只作污染扫描。 | R7.4 必须单独命名 pollution guard dataset。 |

### 7. R7.4 写入边界

R7.4 可以写入:

1. 本批测试数据集表,只覆盖 definition truth / identity / catalog / boundary / shell / query / pollution。
2. 本批用例到数据集的前置映射表。
3. 本批 fixture / builder / seed / fault profile 规则。
4. 本批隔离清理规则。
5. 本批 stop-review 和 R7.5 进入门禁。

R7.4 禁止写入:

1. formal version、controlled consumption、traceability、job、config 等后续批次数据。
2. fixture 文件路径、builder 函数名、seed 代码、fault injection 脚本。
3. 环境矩阵、CI suite、evidence schema、验收标准、实施计划或 implementation code。
4. 正式 `05-测试方案.md` 正文。
5. 任何未在 `03/04` 闭合的 schema、port、state、mapper、marker source 或 config key。

### 8. R7.3 stop-review

| 检查项 | 结果 |
|---|---|
| 是否只思考 definition truth / identity / catalog 数据批次 | pass |
| 是否覆盖 R6.4 的 12 条用例范围 | pass |
| 是否识别本批数据集候选而未写最终 DS 行 | pass |
| 是否明确 fixture / builder / seed / query spy / pollution fixture 边界 | pass |
| 是否明确隔离清理和敏感数据红线 | pass |
| 是否识别 marker / public shell / body boundary source gap 风险 | pass |
| 是否未写其他批次数据、环境、CI、evidence、验收或实施内容 | pass |
| 是否未修改正式 `05-测试方案.md` | pass |

next_allowed_action: 等待用户确认后进入 Step 7 `R7.4 definition truth / identity / catalog 数据:再写入`;只允许写入本批测试数据集表、本批用例到数据集前置映射、本批 fixture / builder / seed / fault profile 规则、本批隔离清理规则、本批 stop-review 和 R7.5 进入门禁;不得直接修改正式 `05-测试方案.md`;不得写其他批次数据、环境矩阵、CI suite、evidence schema、验收标准、实施计划或 implementation code。

---

## R7.4 definition truth / identity / catalog 数据:再写入

### 1. 当前模块状态

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm_to_R7.5 |
| 用户确认 | 已确认从 `R7.3` 推进到 `R7.4`。 |
| 本模块写入范围 | 本批测试数据集表、本批用例到数据集前置映射、本批 fixture / builder / seed / fault profile 规则、本批隔离清理规则、本批 stop-review 和 R7.5 进入门禁。 |
| 本模块禁止范围 | 正式 `05-测试方案.md` 正文、formal version / controlled consumption / traceability / job / config 等其他批次数据、fixture 路径、builder 函数、seed 代码、环境矩阵、CI suite、evidence schema、验收标准、实施计划和 implementation code。 |

### 2. 本批测试数据集表

| 数据集 | 用途 | 构造方式 | 隔离键 | 清理方式 | 关联用例 |
|---|---|---|---|---|---|
| DS-ML-RUN-001 | 本批共享 run namespace、fixed clock、scoped id、actor / operation context。 | deterministic run seed;fake clock;scoped typed ref range。 | `test_run_ref`;actor ref;operation namespace。 | drop run namespace;reset fake clock/id generator。 | 本批全部 TC |
| DS-ML-DEF-001 | 合法 `MethodAssetDefinition` intent 与 accepted truth 前置。 | builder 构造 stable identity、applicability context、safe basis summary、expected version。 | `test_run_ref`;definition ref;operation key。 | run namespace drop。 | TC-ML-TRUTH-001;TC-ML-SHELL-001 |
| DS-ML-DEF-002 | 缺 stable identity / applicability context 的 invalid definition intent。 | negative builder 删除必需身份或适用语境,保留 safe rejection 可判定输入。 | `test_run_ref`;negative case id。 | run namespace drop。 | TC-ML-TRUTH-002 |
| DS-ML-BODY-001 | raw external body / artifact body / provider payload 禁入。 | isolated dummy raw body、dummy provider payload、dummy secret-like value fixture。 | `test_run_ref`;body violation case id。 | delete isolated dummy corpus。 | TC-ML-TRUTH-003 |
| DS-ML-BOUNDARY-001 | 下游 use 尝试替代 definition truth 的边界输入。 | process / identity / runtime / UI / artifact use context fixture,只含 safe refs / summary category。 | `test_run_ref`;downstream source category;boundary case id。 | run namespace drop。 | TC-ML-TRUTH-004;TC-ML-BOUNDARY-001 |
| DS-ML-CATALOG-001 | visible catalog entry 与 identity/catalog 正向读取。 | seed formal definition ref、catalog entry visible state、view shell safe refs。 | `test_run_ref`;definition ref;catalog entry ref。 | run namespace drop。 | TC-ML-IDENTITY-001;TC-ML-CATALOG-001;TC-ML-SHELL-001 |
| DS-ML-CATALOG-002 | missing / absent / not-visible identity/catalog selector。 | seed absent selector and empty read surface;no catalog truth created。 | `test_run_ref`;selector case id。 | run namespace drop。 | TC-ML-IDENTITY-002;TC-ML-QUERY-001 |
| DS-ML-CATALOG-003 | hidden / deprecated / retired / stale / degraded / unavailable catalog read material。 | seed catalog states and read material surface with formal marker source placeholder。 | `test_run_ref`;catalog entry ref;read surface case id。 | run namespace drop;reset read material store。 | TC-ML-CATALOG-001;TC-ML-CATALOG-002;TC-ML-QUERY-001 |
| DS-ML-QUERY-001 | identity/catalog query no-write 观察输入。 | fake read repository seed + write spy reset profile + visible/empty/degraded surfaces。 | `test_run_ref`;query selector;write spy case id。 | reset write spy;drop run namespace。 | TC-ML-QUERY-001;TC-ML-CATALOG-002 |
| DS-ML-POLLUTION-001 | 旧材料污染扫描输入。 | isolated old material terms fixture: `MethodContent`、publish、snapshot、fingerprint、old outbox。 | `test_run_ref`;pollution case id。 | delete isolated pollution fixture。 | TC-ML-POLLUTION-001 |

### 3. 本批用例到数据集前置映射

| 用例 ID | 数据集 | fixture / builder / seed | fake / stub / real-like | 清理方式 |
|---|---|---|---|---|
| TC-ML-TRUTH-001 | DS-ML-RUN-001;DS-ML-DEF-001 | definition accepted builder + expected version seed | fake repository / fake UoW | run namespace drop |
| TC-ML-TRUTH-002 | DS-ML-RUN-001;DS-ML-DEF-002 | invalid definition builder | fake repository with write spy | run namespace drop |
| TC-ML-TRUTH-003 | DS-ML-RUN-001;DS-ML-BODY-001 | dummy raw body / provider payload fixture | body-boundary checker fake | delete isolated corpus |
| TC-ML-TRUTH-004 | DS-ML-RUN-001;DS-ML-BOUNDARY-001 | downstream use context fixture | fake boundary guard input | run namespace drop |
| TC-ML-IDENTITY-001 | DS-ML-RUN-001;DS-ML-DEF-001;DS-ML-CATALOG-001 | definition + catalog visible seed | fake read repository | run namespace drop |
| TC-ML-IDENTITY-002 | DS-ML-RUN-001;DS-ML-CATALOG-002 | absent selector seed | fake read repository | run namespace drop |
| TC-ML-CATALOG-001 | DS-ML-RUN-001;DS-ML-CATALOG-001;DS-ML-CATALOG-003 | catalog state seed | fake catalog repository | run namespace drop |
| TC-ML-CATALOG-002 | DS-ML-RUN-001;DS-ML-CATALOG-003;DS-ML-QUERY-001 | stale/degraded read material seed + write spy | fake read repository / write spy | reset write spy;run namespace drop |
| TC-ML-BOUNDARY-001 | DS-ML-RUN-001;DS-ML-BOUNDARY-001 | downstream safe refs fixture | fake boundary guard input | run namespace drop |
| TC-ML-SHELL-001 | DS-ML-RUN-001;DS-ML-DEF-001;DS-ML-CATALOG-001 | definition/catalog public shell seed | fake shell assembler input | run namespace drop |
| TC-ML-QUERY-001 | DS-ML-RUN-001;DS-ML-CATALOG-001;DS-ML-CATALOG-002;DS-ML-CATALOG-003;DS-ML-QUERY-001 | visible/empty/not-visible/degraded query surfaces | fake read repository / write spy | reset write spy;run namespace drop |
| TC-ML-POLLUTION-001 | DS-ML-RUN-001;DS-ML-POLLUTION-001 | old material pollution fixture | none | delete isolated fixture |

### 4. 本批构造规则

| 规则 | 本批口径 |
|---|---|
| definition builder | 只能构造 `MethodAssetDefinition` 正式字段、typed refs、safe basis summary 和 expected version;不得恢复旧 `MethodContent` 字段。 |
| invalid builder | negative case 只删除或变更 Step 6 前置所需字段;不得创造新的 rejection schema。 |
| body violation fixture | 只用 dummy raw body / dummy secret-like value;不得复制真实标准正文、artifact body、provider payload 或 secret。 |
| catalog seed | catalog truth、catalog entry state、read material surface 必须分开;view 不反写 truth。 |
| marker source | degraded / unavailable / hidden / not-visible marker 必须来自正式 read decision / resolver / mapper seed;缺来源时 R7.4 只记录 blocker,不得合成。 |
| query write spy | 只用于观察 query no-write;不得把 write spy 作为正式业务对象或 evidence schema。 |
| pollution fixture | 只用于扫描旧词条污染;不得作为任何 positive fixture 或 current truth source。 |

### 5. 本批隔离与清理规则

| 数据类型 | 隔离键 | 清理方式 | 注意事项 |
|---|---|---|---|
| run baseline | `test_run_ref`;actor ref;operation namespace | reset fake clock/id;drop run namespace | 不与后续 formalization / consumption 批次共享 mutable object。 |
| definition / catalog truth seed | `definition_ref`;`catalog_entry_ref`;expected version | run namespace drop | expected version 只作为正式 repository 前置,不得当 cursor。 |
| query read material | query selector;read surface case id | reset read store;drop run namespace | query 不 repair、不 append audit、不 publish event。 |
| body violation corpus | body violation case id | delete isolated corpus | 只包含 dummy value。 |
| boundary fixture | downstream source category;boundary case id | run namespace drop | 不接真实 sibling repo。 |
| pollution fixture | pollution case id | delete isolated fixture | 旧词条不得进入正式数据族。 |

### 6. 本批停审

| 停审项 | 结论 | 说明 |
|---|---|---|
| 是否覆盖 R6.4 全部 12 条用例 | pass | 每条用例均已映射到至少一个可重复数据集。 |
| 是否区分正向、负向、边界、query no-write 和 pollution 数据 | pass | invalid、body violation、boundary、query spy、pollution 均为独立数据集。 |
| 是否有隔离键和清理方式 | pass | 每个数据集均有 run / case / ref 级隔离和清理方式。 |
| 是否未使用真实 sibling repo / real provider / real secret | pass | 本批只使用 fake / isolated dummy corpus。 |
| 是否未补 schema / marker / config key | pass | marker source 缺口按 blocker 处理,不由 fixture 合成。 |
| 是否未写其他批次数据 | pass | formalization / version / consumption / trace / job / config 数据未展开。 |
| 是否未写环境、CI、evidence schema、验收或实施内容 | pass | 仅记录数据设计中间产物。 |
| 是否未修改正式 `05-测试方案.md` | pass | 当前仍只更新中间产物。 |

### 7. R7.5 进入门禁

| 门禁项 | 裁决 |
|---|---|
| R7.4 是否已写入本批测试数据集表 | pass |
| R7.4 是否已写入本批用例到数据集映射 | pass |
| R7.4 是否已写入本批构造 / 隔离 / 清理规则 | pass |
| R7.4 是否已完成本批停审 | pass |
| 是否未写后续批次数据 | pass |
| 是否未修改正式 `05-测试方案.md` | pass |

next_allowed_action: 等待用户确认后进入 Step 7 `R7.5 formal version / explicit change / state 数据:先思考`;只允许思考 formalization、formal version、semantic change、state guard、idempotency、stored surface、commit unknown、expected version conflict 数据批次的输入边界、用例范围、数据集候选、构造边界、隔离清理、source gap 和 `R7.6` 写入边界;不得直接修改正式 `05-测试方案.md`;不得写 controlled consumption、traceability、job、config 等后续批次数据;不得写环境矩阵、CI suite、evidence schema、验收标准、实施计划或 implementation code。

---

## R7.5 formal version / explicit change / state 数据:先思考

### 1. 当前模块目标

`R7.5` 只思考 Step 6 R6.6 第二批用例的数据设计边界,覆盖 formalization、formal version、explicit semantic change、state guard、command idempotency、stored replay、commit unknown 和 expected version conflict。

当前模块不写最终数据集表、DS 编号行、完整 TC 映射、fixture 路径、builder 函数、seed 代码、fault injection 脚本、环境矩阵、CI suite、evidence schema、验收标准或实施计划。`R7.6` 才允许把本批思考转成第二批测试数据集行和用例前置映射。

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm_to_R7.6 |
| 用户确认 | 已确认从 `R7.4` 推进到 `R7.5`。 |
| 当前允许 | 思考本批输入边界、用例范围、数据集候选、formalization / version / idempotency / recovery 构造边界、隔离清理、source gap 和 R7.6 写入边界。 |
| 当前禁止 | 修改正式 `05-测试方案.md`;写 DS 编号行、完整 TC 映射、controlled consumption、traceability、job、config 等后续批次数据;写 fixture 路径、builder 函数、seed 代码、环境矩阵、CI suite、evidence schema、验收标准、实施计划或 implementation code。 |

### 2. 本批用例范围

| 用例族 | 用例 ID | 数据设计关注点 |
|---|---|---|
| formalization | `TC-ML-FORMALIZATION-001~004` | accepted / rejected / blocked / not-started / in-review 状态、basis eligibility、safe basis summary、raw body boundary、no implicit formalization。 |
| formal version | `TC-ML-VERSION-001~003` | candidate / current / superseded / retired 状态、正式版本建立、stable current 判断、terminal version 不当 current。 |
| explicit change | `TC-ML-CHANGE-001` | 语义变化输入、existing formal ref 稳定、impact candidate / summary ref 的正式来源边界。 |
| state guard | `TC-ML-STATE-001~002` | accepted 后非法回退、terminal version guard、invalid transition / rejection surface。 |
| idempotency / replay | `TC-ML-IDEMP-001~003` | same key same digest replay、same key different digest conflict、stored result missing / wrong kind / unreadable。 |
| recovery / concurrency | `TC-ML-RECOVERY-001~002` | commit unknown 不私判成功、expected version conflict 防 lost update。 |

本批不覆盖 controlled consumption / distribution / handoff、trace / audit / lineage、operations job / report、config / dependency / redaction / observability 的完整数据集;这些留 R7.7 以后。R6.10 的 recovery 扩展用例也不在本批展开,仅保持与 R6.6 的 command / version recovery 语义一致。

### 3. 正式输入约束思考

| 输入 | 对本批数据的约束 | 禁止由数据设计补口 |
|---|---|---|
| `00-需求文档.md` FR-ML-003~004 | 数据必须能表达正式化、正式 / 非正式区分和稳定版本边界。 | 不能用 publish、snapshot、fingerprint 或旧 MethodContent 代替正式化 / 版本语义。 |
| `00-需求文档.md` BR-ML-004 / 009~011 | 数据必须保护既有正式引用语义、显式正式化、显式版本变化和消费影响识别入口。 | 不能让 query、sync、runtime use 或 catalog material 隐式推进 formalization / version。 |
| `02-概要设计.md` 状态框架 | Formalization decision 与 Formal version lifecycle 分离;BasisAccepted 不等于 formal version active。 | 不能把 eligibility、basis accepted 或 catalog active 当成 current formal version。 |
| `03-详细设计.md` §9 | `FormalizationState` 和 `FormalMethodAssetVersion` 状态来源分别是 command / basis / policy 与 formal version command / basis refs / repository。 | 不能用 latest timestamp、fingerprint、raw artifact body 或 raw source body 生成 accepted/current。 |
| `03-详细设计.md` §10~§12 | duplicate 只能复制 stored surface;expected version 防 lost update;commit unknown 只能靠 stored surface、formal read-back 或正式 recovery source。 | 不能从 current truth、日志、timeout、adapter note、query surface 或 private fake map 重建响应。 |
| `04-配置设计.md` static boundary | 配置不得改变 state transition、transaction boundary、stored replay、marker source 或 body-free 规则。 | 不能准备“配置放宽状态迁移 / 关闭 replay / 忽略 expected version”的正向数据。 |

### 4. 数据集候选思考

| 候选数据族 | 目标 | 后续 R7.6 可能写入 |
|---|---|---|
| formalization baseline | 构造 definition 已存在但 formalization not-started / in-review 的安全前置。 | `DS-ML-FORMAL-*` not-started / in-review dataset。 |
| accepted formalization | 支撑 eligibility pass、basis summary accepted、policy diagnostic pass、UoW accepted 写入。 | accepted formalization builder + stored accepted result seed。 |
| rejected / blocked formalization | 支撑 basis rejected、basis missing、eligibility blocked、governance summary unavailable。 | negative formalization dataset。 |
| raw body boundary | raw source body / provider payload 尝试作为 formalization basis 时被拒绝。 | isolated dummy body-boundary fixture,不进入 truth。 |
| formal version lifecycle | 构造 candidate、current、superseded、retired 版本状态和 current resolution 前置。 | `DS-ML-VERSION-*` lifecycle dataset。 |
| explicit change | 已有 current version + semantic change input + impact candidate source。 | semantic change dataset,不直接写 downstream truth。 |
| illegal state transition | accepted formalization rollback、terminal version revive。 | `DS-ML-STATE-*` invalid transition dataset。 |
| duplicate replay | completed guard + same digest + readable stored result。 | `DS-ML-IDEMP-*` replay dataset。 |
| digest conflict | completed / reserved guard + same key different digest。 | conflict dataset with original stored surface preserved。 |
| stored surface missing | completed guard + stored result missing / wrong kind / unreadable。 | manual / consistency dataset,不重建 response。 |
| commit unknown | UoW commit unknown fault profile + controlled stored/read-back source variants。 | `DS-ML-RECOVERY-*` commit unknown dataset。 |
| expected version conflict | 两个写路径共享 initial expected version,一个 accepted,一个 conflict。 | version conflict / lost-update prevention dataset。 |

### 5. 构造方式边界思考

| 数据类型 | 允许构造 | 禁止构造 |
|---|---|---|
| formalization builder | 按正式 `FormalizationState`、basis summary refs、policy diagnostic refs、expected version 和 safe rejection / accepted surface 构造。 | 保存治理执行正文、raw source body、provider payload、旧 publish 信息或未定义 basis 字段。 |
| formal version builder | 按 `FormalMethodAssetVersion` candidate/current/superseded/retired、basis refs、version repository expected version 构造。 | 用 timestamp、fingerprint、snapshot、artifact body 或 catalog view 反推 current。 |
| explicit change fixture | 只表达 semantic change input、existing formal ref、impact candidate / summary ref 的安全入口。 | 直接修改 downstream truth、执行消费修复、创建 trace/audit 详细数据或人工约定 marker。 |
| idempotency seed | 写入正式 operation key、canonical digest、guard state、stored accepted/rejected/conflict surface。 | 用 current truth、log、query result、private fake state 或 raw DTO body 重建 replay response。 |
| fault profile | commit unknown、stored result unreadable、expected version conflict、UoW rollback 的受控触发。 | 用 timeout、adapter note、HTTP/SQL code 或 exception text 作为正式 recovery 结论。 |
| call / write spy | 只验证 duplicate no-rerun、query/use no implicit formalization、conflict no mutation。 | 把 spy 结果作为业务 truth、stored surface 或 evidence schema。 |

### 6. 隔离与清理思考

| 主题 | 本批要求 |
|---|---|
| run 隔离 | 所有 formalization、version、idempotency、stored result、fault profile 均归入 `test_run_ref` 或等价 run namespace。 |
| identity 隔离 | formalization ref、formal version ref、basis summary ref、operation key、digest pair、expected version 必须在本批唯一。 |
| state 隔离 | accepted / rejected / blocked / current / superseded / retired / terminal guard 使用独立数据集,不得复用 happy-path 数据掩盖非法迁移断言。 |
| replay 隔离 | same digest replay、different digest conflict、stored surface missing 三类必须分别准备,不得通过一个 shared replay seed 表达。 |
| recovery 隔离 | commit unknown 与 expected version conflict 使用独立 fault profile;fault profile 用后必须 reset。 |
| 清理方式 | fake / in-memory truth、version、idempotency、stored surface store 走 run namespace drop;fault profile reset;dummy raw body corpus delete。 |
| 敏感数据 | governance basis、external standard、artifact body、provider payload 和 secret 只能使用 safe summary refs 或 dummy negative corpus。 |

### 7. source gap 与停审风险

| 风险 | 判断 | 处理 |
|---|---|---|
| accepted / rejected stored surface schema 缺正式字段 | R7.6 不能私造 replay JSON 或 public DTO body。 | 只写可回指正式 stored surface 的数据;若正式 schema 缺口命中,标 blocker。 |
| impact candidate / summary marker 来源不闭合 | `TC-ML-CHANGE-001` 只能覆盖显式识别入口。 | 不写完整 impact / trace 数据;后移 R7.9/R7.10 或回 `03` source。 |
| commit unknown read-back / recovery source 不闭合 | 不能从 timeout、log、current truth snapshot 或 adapter note 判成功。 | R7.6 必须把 stored/read-back/formal recovery source 分开写;缺口则停审。 |
| version conflict safe surface 不闭合 | expected version conflict 不能被当作 retry success。 | 数据只触发 reload-required / conflict surface;错误名以 `03` 为准。 |
| raw body basis 边界不闭合 | 不能为了测试方便保存 raw body。 | 使用 dummy isolated corpus,并断言不进入 truth / audit / stored result。 |
| no implicit formalization 无观察点 | 读取、引用、同步不能写 formalization / version。 | R7.6 需映射 write spy / call spy,但 spy 不成为正式业务对象。 |

### 8. R7.6 写入边界

R7.6 可以写入:

1. 本批测试数据集表,只覆盖 formalization、formal version、explicit change、state guard、idempotency、stored surface、commit unknown 和 expected version conflict。
2. 本批用例到数据集的前置映射表。
3. 本批 fixture / builder / seed / fault profile 规则。
4. 本批隔离清理规则。
5. 本批 stop-review 和 R7.7 进入门禁。

R7.6 禁止写入:

1. controlled consumption、distribution、handoff、trace/audit/lineage、operations job、config、dependency、redaction、observability 等后续批次数据。
2. fixture 文件路径、builder 函数名、seed 代码、fault injection 脚本。
3. 环境矩阵、CI suite、evidence schema、验收标准、实施计划或 implementation code。
4. 正式 `05-测试方案.md` 正文。
5. 任何未在 `03/04` 闭合的 schema、port、state、mapper、marker source、stored surface、recovery source 或 config key。

### 9. R7.5 stop-review

| 检查项 | 结果 |
|---|---|
| 是否只思考 formal version / explicit change / state 数据批次 | pass |
| 是否覆盖 R6.6 的 15 条用例范围 | pass |
| 是否识别 formalization、version、state guard、idempotency、stored surface、commit unknown 和 expected version conflict 数据候选 | pass |
| 是否明确 builder / seed / fault profile / spy 的边界 | pass |
| 是否明确隔离清理和 body-free 红线 | pass |
| 是否识别 stored surface、impact source、recovery source 和 no implicit formalization 观察点风险 | pass |
| 是否未写 DS 编号行、完整 TC 映射、其他批次数据、环境、CI、evidence、验收或实施内容 | pass |
| 是否未修改正式 `05-测试方案.md` | pass |

next_allowed_action: 等待用户确认后进入 Step 7 `R7.6 formal version / explicit change / state 数据:再写入`;只允许写入本批测试数据集表、本批用例到数据集前置映射、本批 fixture / builder / seed / fault profile 规则、本批隔离清理规则、本批 stop-review 和 R7.7 进入门禁;不得直接修改正式 `05-测试方案.md`;不得写 controlled consumption、traceability、job、config 等后续批次数据;不得写环境矩阵、CI suite、evidence schema、验收标准、实施计划或 implementation code。

---

## R7.6 formal version / explicit change / state 数据:再写入

### 1. 当前模块状态

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm_to_R7.7 |
| 用户确认 | 已确认从 `R7.5` 推进到 `R7.6`。 |
| 本模块写入范围 | 本批测试数据集表、本批用例到数据集前置映射、本批 fixture / builder / seed / fault profile 规则、本批隔离清理规则、本批 stop-review 和 R7.7 进入门禁。 |
| 本模块禁止范围 | 正式 `05-测试方案.md` 正文、controlled consumption / distribution / handoff / traceability / job / config 等后续批次数据、fixture 路径、builder 函数、seed 代码、环境矩阵、CI suite、evidence schema、验收标准、实施计划和 implementation code。 |

### 2. 本批测试数据集表

| 数据集 | 用途 | 构造方式 | 隔离键 | 清理方式 | 关联用例 |
|---|---|---|---|---|---|
| DS-ML-FORMAL-001 | formalization not-started / in-review 基线。 | builder 构造 definition ref、formalization ref、safe basis candidate refs、expected version;不创建 formal version current。 | `test_run_ref`;definition ref;formalization ref。 | run namespace drop。 | TC-ML-FORMALIZATION-003 |
| DS-ML-FORMAL-002 | 方法资产显式正式化 accepted 前置。 | seed definition truth、accepted basis summary、eligibility pass、policy diagnostic pass、fresh operation key。 | `test_run_ref`;definition ref;basis summary ref;operation key。 | run namespace drop。 | TC-ML-FORMALIZATION-001 |
| DS-ML-FORMAL-003 | 不满足 basis 的 rejected / blocked 前置。 | negative seed: basis missing、basis rejected、eligibility blocked、governance summary unavailable 四类 safe refs。 | `test_run_ref`;negative basis case id。 | run namespace drop。 | TC-ML-FORMALIZATION-002 |
| DS-ML-FORMAL-004 | raw source body 不能作为 accepted basis。 | isolated dummy raw body / provider payload fixture + clean safe basis ref absence。 | `test_run_ref`;body-boundary case id。 | delete isolated dummy corpus。 | TC-ML-FORMALIZATION-004 |
| DS-ML-FORMAL-005 | query / reference / sync 不隐式推进正式化。 | formalization not-started / in-review seed + write spy reset profile + read/use/sync input shell。 | `test_run_ref`;selector case id;write spy case id。 | reset write spy;run namespace drop。 | TC-ML-FORMALIZATION-003 |
| DS-ML-VERSION-001 | 建立 `FormalMethodAssetVersion` current。 | accepted formalization seed + version candidate builder + version repository expected version。 | `test_run_ref`;formalization ref;version ref。 | run namespace drop。 | TC-ML-VERSION-001 |
| DS-ML-VERSION-002 | 语义变化必须形成新版本或等价正式变化口径。 | current version seed + semantic change input + new candidate/current refs + impact candidate safe source。 | `test_run_ref`;old version ref;new version ref;change case id。 | run namespace drop。 | TC-ML-VERSION-002;TC-ML-CHANGE-001 |
| DS-ML-VERSION-003 | current / superseded / retired 判定边界。 | seed current、superseded、retired version refs and safe read shells。 | `test_run_ref`;version state case id。 | run namespace drop。 | TC-ML-VERSION-003 |
| DS-ML-STATE-001 | accepted 后非法回退被拒绝。 | accepted formalization state seed + invalid transition command input + empty accepted side-effect slots。 | `test_run_ref`;formalization ref;transition case id。 | run namespace drop;reset side-effect spy。 | TC-ML-STATE-001 |
| DS-ML-STATE-002 | terminal formal version guard。 | superseded / retired version seed + revive-current command input + empty accepted side-effect slots。 | `test_run_ref`;terminal version ref;transition case id。 | run namespace drop;reset side-effect spy。 | TC-ML-STATE-002 |
| DS-ML-IDEMP-001 | duplicate same digest replay stored accepted result。 | completed idempotency guard + canonical digest + readable stored accepted result / effect summary shell。 | `test_run_ref`;operation key;digest ref。 | run namespace drop;reset call spy。 | TC-ML-IDEMP-001 |
| DS-ML-IDEMP-002 | same key different digest conflict。 | completed guard with original digest + conflicting digest input + original stored surface preserved。 | `test_run_ref`;operation key;original digest;conflict digest。 | run namespace drop。 | TC-ML-IDEMP-002 |
| DS-ML-IDEMP-003 | completed guard 但 stored surface missing / wrong-kind / unreadable。 | completed guard + stored result absence / wrong-kind / unreadable variants。 | `test_run_ref`;operation key;stored surface case id。 | run namespace drop;reset fault profile。 | TC-ML-IDEMP-003 |
| DS-ML-RECOVERY-001 | commit unknown 不私判成功。 | UoW commit-unknown fault profile + stored surface present/read-back present/no-proof variants。 | `test_run_ref`;operation key;commit fault case id。 | reset UoW fault profile;run namespace drop。 | TC-ML-RECOVERY-001 |
| DS-ML-RECOVERY-002 | expected version conflict 防止 lost update。 | two-writer seed with same initial expected version;one accepted path;one stale save input。 | `test_run_ref`;resource ref;expected version pair。 | run namespace drop;reset concurrency profile。 | TC-ML-RECOVERY-002 |

### 3. 本批用例到数据集前置映射

| 用例 ID | 数据集 | fixture / builder / seed | fake / stub / real-like | 清理方式 |
|---|---|---|---|---|
| TC-ML-FORMALIZATION-001 | DS-ML-RUN-001;DS-ML-FORMAL-002 | accepted formalization builder + basis summary seed | fake repository / fake UoW | run namespace drop |
| TC-ML-FORMALIZATION-002 | DS-ML-RUN-001;DS-ML-FORMAL-003 | rejected / blocked basis seed | fake repository / fake policy diagnostic | run namespace drop |
| TC-ML-FORMALIZATION-003 | DS-ML-RUN-001;DS-ML-FORMAL-001;DS-ML-FORMAL-005 | no-implicit-formalization seed + write spy | fake read/use/sync input + write spy | reset write spy;run namespace drop |
| TC-ML-FORMALIZATION-004 | DS-ML-RUN-001;DS-ML-FORMAL-004 | dummy raw body boundary fixture | body-boundary checker fake | delete isolated corpus |
| TC-ML-VERSION-001 | DS-ML-RUN-001;DS-ML-VERSION-001 | accepted formalization + version candidate seed | fake version repository / fake UoW | run namespace drop |
| TC-ML-VERSION-002 | DS-ML-RUN-001;DS-ML-VERSION-002 | current version + semantic change input | fake version repository / impact candidate source | run namespace drop |
| TC-ML-VERSION-003 | DS-ML-RUN-001;DS-ML-VERSION-003 | current/superseded/retired version state seed | fake version read repository | run namespace drop |
| TC-ML-CHANGE-001 | DS-ML-RUN-001;DS-ML-VERSION-002 | explicit semantic change + impact candidate source | fake repository / safe impact source | run namespace drop |
| TC-ML-STATE-001 | DS-ML-RUN-001;DS-ML-STATE-001 | accepted formalization + invalid rollback input | fake repository / side-effect spy | reset side-effect spy;run namespace drop |
| TC-ML-STATE-002 | DS-ML-RUN-001;DS-ML-STATE-002 | terminal version + revive-current input | fake version repository / side-effect spy | reset side-effect spy;run namespace drop |
| TC-ML-IDEMP-001 | DS-ML-RUN-001;DS-ML-IDEMP-001 | completed guard + readable stored accepted result | fake idempotency store / call spy | reset call spy;run namespace drop |
| TC-ML-IDEMP-002 | DS-ML-RUN-001;DS-ML-IDEMP-002 | completed guard + conflicting digest input | fake idempotency store | run namespace drop |
| TC-ML-IDEMP-003 | DS-ML-RUN-001;DS-ML-IDEMP-003 | completed guard + missing/wrong/unreadable stored surface | fake idempotency store / fault profile | reset fault profile;run namespace drop |
| TC-ML-RECOVERY-001 | DS-ML-RUN-001;DS-ML-RECOVERY-001 | commit unknown profile + formal recovery source variants | fake UoW / fake stored surface / formal read-back fake | reset UoW profile;run namespace drop |
| TC-ML-RECOVERY-002 | DS-ML-RUN-001;DS-ML-RECOVERY-002 | same expected version two-writer seed | fake versioned repository / concurrency profile | reset concurrency profile;run namespace drop |

### 4. 本批构造规则

| 规则 | 本批口径 |
|---|---|
| formalization state | 只能构造 not-started / in-review / accepted / rejected / blocked 及其正式 safe surface;不得用 raw body 或 query/use/sync 推进状态。 |
| basis summary | governance basis 只进入 safe refs、digest / summary refs 和 safe reason;治理执行正文、外部标准正文和 provider payload 不入 truth。 |
| formal version | candidate / current / superseded / retired 由 formal version command、basis refs、version repository expected version 构造;不得用 timestamp、fingerprint、snapshot 或 artifact body。 |
| semantic change | 本批只构造 change input 和 impact candidate safe source;完整 trace / impact material 留 R7.9/R7.10。 |
| state guard | illegal transition 数据必须独立于 accepted happy path,并准备 side-effect spy 证明无 accepted truth rewrite、stored accepted result 或 event candidate。 |
| idempotency digest | same digest / different digest 使用 deterministic canonical digest;digest 不能来自 raw DTO body、log 或 adapter note。 |
| stored surface | duplicate replay 只能读取正式 stored result / effect summary shell;missing / wrong-kind / unreadable 单独数据集触发 manual / consistency surface。 |
| commit unknown | fault profile 只表达 commit ambiguity;成功判定只能来自 stored surface、formal read-back 或正式 recovery source。 |
| expected version | version conflict 通过 stale expected version 触发;checkpoint、cursor、lease、timestamp 不替代 expected version。 |

### 5. 本批隔离与清理规则

| 数据类型 | 隔离键 | 清理方式 | 注意事项 |
|---|---|---|---|
| formalization / basis | definition ref;formalization ref;basis summary ref | run namespace drop | basis summary 不携带治理正文。 |
| formal version | version ref;version state case id | run namespace drop | current / superseded / retired 不能靠 latest timestamp 判定。 |
| semantic change | old version ref;new version ref;change case id | run namespace drop | 不触碰 downstream truth。 |
| state guard | transition case id;side-effect spy case id | reset spy;run namespace drop | illegal transition 与 happy path 分离。 |
| idempotency replay | operation key;digest ref;stored surface case id | reset call/fault spy;run namespace drop | replay / conflict / missing surface 三类不可复用。 |
| recovery / concurrency | commit fault case id;expected version pair | reset UoW / concurrency profile;run namespace drop | commit unknown 与 version conflict 不混用。 |
| body boundary | body-boundary case id | delete isolated dummy corpus | 只包含 dummy raw body / dummy provider payload。 |

### 6. 本批停审

| 停审项 | 结论 | 说明 |
|---|---|---|
| 是否覆盖 R6.6 全部 15 条用例 | pass | 每条用例均映射到可重复数据集。 |
| 是否区分正向、负向、边界、并发和恢复数据 | pass | accepted、rejected/blocked、raw body、illegal transition、replay、conflict、missing surface、commit unknown、version conflict 均独立。 |
| 是否有隔离键和清理方式 | pass | 每个数据集均有 run / ref / operation / fault case 隔离和清理方式。 |
| 是否未使用真实治理正文、真实 provider payload 或真实 secret | pass | 本批只使用 safe summary refs 和 isolated dummy corpus。 |
| 是否未补 stored surface / recovery source / marker schema | pass | 数据只引用正式 stored surface / formal recovery source;缺口按 blocker 处理。 |
| 是否未写后续批次数据 | pass | consumption、trace、job、config 等数据未展开。 |
| 是否未写环境、CI、evidence schema、验收或实施内容 | pass | 仅记录数据设计中间产物。 |
| 是否未修改正式 `05-测试方案.md` | pass | 当前仍只更新中间产物。 |

### 7. R7.7 进入门禁

| 门禁项 | 裁决 |
|---|---|
| R7.6 是否已写入本批测试数据集表 | pass |
| R7.6 是否已写入本批用例到数据集映射 | pass |
| R7.6 是否已写入本批构造 / 隔离 / 清理规则 | pass |
| R7.6 是否已完成本批停审 | pass |
| 是否未写后续批次数据 | pass |
| 是否未修改正式 `05-测试方案.md` | pass |

next_allowed_action: 等待用户确认后进入 Step 7 `R7.7 controlled consumption / distribution / seam 数据:先思考`;只允许思考 controlled consumption material、distribution boundary、publisher / handoff seam、not-formal / retired blocked、downstream boundary、outcome / receipt refs、marker source 数据批次的输入边界、用例范围、数据集候选、构造边界、隔离清理、source gap 和 `R7.8` 写入边界;不得直接修改正式 `05-测试方案.md`;不得写 traceability、job、config 等后续批次数据;不得写环境矩阵、CI suite、evidence schema、验收标准、实施计划或 implementation code。

---

## R7.7 controlled consumption / distribution / seam 数据:先思考

### 1. 当前模块目标

`R7.7` 只思考 Step 6 R6.8 第三批用例的数据设计边界,覆盖 controlled consumption material、consumption query no-write、sibling boundary input、distribution context、publisher seam、handoff seam、availability / degraded marker copy-only 和 body-free public shell。

当前模块不写最终数据集表、DS 编号行、完整 TC 映射、fixture 路径、builder 函数、seed 代码、fault injection 脚本、环境矩阵、CI suite、evidence schema、验收标准或实施计划。`R7.8` 才允许把本批思考转成第三批测试数据集行和用例前置映射。

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm_to_R7.8 |
| 用户确认 | 已确认从 `R7.6` 推进到 `R7.7`。 |
| 当前允许 | 思考本批输入边界、用例范围、consumption / distribution / publisher / handoff / availability 数据集候选、构造边界、隔离清理、source gap 和 R7.8 写入边界。 |
| 当前禁止 | 修改正式 `05-测试方案.md`;写 DS 编号行、完整 TC 映射、traceability、job、config 等后续批次数据;写 fixture 路径、builder 函数、seed 代码、环境矩阵、CI suite、evidence schema、验收标准、实施计划或 implementation code。 |

### 2. 本批用例范围

| 用例族 | 用例 ID | 数据设计关注点 |
|---|---|---|
| consumption material | `TC-ML-CONSUMPTION-001~003` | current formal version 可消费、not-formal / retired blocked、下游私有定义不能替代本仓 material。 |
| consumption query | `TC-ML-QUERY-002~003` | visible / empty / not-visible / stale / degraded / unavailable surface、query no-write、marker copy-only。 |
| sibling boundary | `TC-ML-BOUNDARY-002~008` | process、identity、governance、capability-hub、marketplace、UI、artifact/archive 的越界输入样本。 |
| distribution context | `TC-ML-DISTRIBUTION-001~002` | distribution context/material 正向、旧 publish / topic / route / manual sync 不能证明 distribution truth。 |
| publisher seam | `TC-ML-PUBLISHER-001~002` | event candidate body-free source、publisher failed / unavailable 不回滚 truth。 |
| handoff seam | `TC-ML-HANDOFF-001~002` | prepared / delivered-marker 分离、failed / blocked / unavailable 不回滚本地 truth。 |
| availability / shell | `TC-ML-AVAILABILITY-001`;`TC-ML-SHELL-002` | resolver / publisher / handoff marker copy-only、consumption / distribution / handoff shell body-free。 |

本批不覆盖 trace / audit / lineage、operations job / report、config / dependency / redaction / observability 的完整数据集。R7.7 只处理 seam 数据前置,不定义 topic、URL、secret、artifact path、report schema、delivery receipt schema 或 evidence schema。

### 3. 正式输入约束思考

| 输入 | 对本批数据的约束 | 禁止由数据设计补口 |
|---|---|---|
| `00-需求文档.md` FR-ML-005~006 | 数据必须表达下游按边界消费正式方法资产语义,以及分发 / 同步语境知道哪些正式资产可进入受控消费链路。 | 不能让消费方拥有 definition truth,不能让手工同步成为唯一口径。 |
| `00-需求文档.md` BR-ML-012~018 | 数据必须覆盖 process、identity、governance、capability-hub、marketplace、UI、artifact/archive 七类相邻仓边界。 | 不能把运行状态、身份状态、治理裁决、provider access、交易履约、UI payload、artifact body 写入 method truth。 |
| `02-概要设计.md` 受控消费 / 分发状态 | `catalog active` 不等于 `consumption available`;distribution available 不等于交易可用或下游已安装。 | 不能用 catalog view、marketplace listing、install record 或 downstream runtime state 反推消费成立。 |
| `03-详细设计.md` flow / state / recovery | Query no-write;Publisher candidate 与 outcome 分离;Handoff delivered-marker 不等于下游 truth;marker 只能复制正式来源。 | 不能用 query repair、publisher delivery ack、topic、route、HTTP code、private map 或 raw adapter error 补 marker / truth。 |
| `04-配置设计.md` adapter / target binding | fake / controlled target 可作为测试 seam;target unavailable / failed 只产生 safe marker / issue,不回滚 truth。 | 不能在 Step 7 写具体 config key、secret、URL、topic、产品绑定或真实 broker 依赖。 |

### 4. 数据集候选思考

| 候选数据族 | 目标 | 后续 R7.8 可能写入 |
|---|---|---|
| consumable current material | current formal version + supported boundary + available consumption material。 | `DS-ML-CONSUME-*` positive dataset。 |
| not-formal / retired blocked material | not-started / in-review formalization、superseded / retired version、retired boundary。 | negative consumption dataset。 |
| downstream private definition | 下游私有方法定义、运行快照、本地模型、identity/process runtime summary 等越界输入。 | sibling boundary negative fixture。 |
| consumption query surfaces | visible、empty、not-visible、stale、degraded、unavailable consumption read surface。 | query read material seed + write spy。 |
| process / identity / governance boundary | process use context、identity role context、governance basis / policy context 的 safe ref 输入。 | boundary dataset with safe refs only。 |
| capability / marketplace / UI / artifact boundary | provider/tool ref、marketplace context、UI view policy request、artifact/archive ref body-boundary input。 | boundary dataset + isolated dummy body corpus。 |
| distribution context | body-free distribution context/material refs for current formal version and relation/distribution source。 | distribution positive dataset。 |
| distribution pollution | old publish、old outbox、topic、route、manual sync、snapshot/fingerprint 样本。 | distribution pollution guard dataset。 |
| publisher candidate | accepted command effect、bounded inbound stored fact 或 completed report safe refs 作为 candidate source。 | publisher candidate dataset。 |
| publisher failed / unavailable | event candidate persisted + target registry failed/blocked/unavailable。 | publisher fault profile dataset。 |
| handoff prepared / delivered-marker | handoff-safe refs、target ready summary、body-free receipt marker。 | handoff positive dataset。 |
| handoff failed / blocked / unavailable | target failed / blocked / unavailable、outcome persistence ambiguity。 | handoff fault profile dataset。 |
| availability marker source | resolver、publisher、handoff、target registry 返回正式 unavailable / degraded / blocked marker。 | availability marker dataset。 |
| shell body-free corpus | consumption view、distribution context、publication outcome、handoff outcome 的 safe shell 与 dummy leak corpus。 | shell / body-free negative dataset。 |

### 5. 构造方式边界思考

| 数据类型 | 允许构造 | 禁止构造 |
|---|---|---|
| consumption material builder | 按正式 current version、boundary decision、availability marker、safe material refs 构造。 | 复制 definition body、下游运行状态、消费方私有定义或 raw runtime snapshot。 |
| consumption query seed | seed visible / empty / not-visible / stale / degraded / unavailable surface,并配 write spy。 | query-time 创建 material、repair stale surface、append audit、publish event、启动 job 或存 query replay。 |
| sibling boundary fixture | process / identity / governance / capability / marketplace / UI / artifact 只以 safe refs、summary、context category 表达。 | 接入真实 sibling repo 内部状态、交易 payload、UI payload、provider payload、artifact/archive body。 |
| distribution material seed | 构造 body-free distribution context、material refs、relation/distribution safe summary。 | 旧 publish/outbox/topic/route、marketplace listing、install record 或 broker ack 成为 truth。 |
| publisher seed | event candidate 来源于 stored body-free fact、accepted effect 或 completed report safe refs。 | publisher 重读 current truth 拼 payload、保存 raw event body、topic body 或 delivery receipt body。 |
| handoff seed | prepared / delivered-marker / failed / blocked / unavailable 只承载 local outcome、receipt marker 和 target summary。 | delivered 代表下游业务 truth、handoff package body / receipt body 入 truth、failure 回滚 local truth。 |
| availability fault profile | resolver / publisher / handoff / target registry 的 unavailable / degraded / failed summary。 | 以 raw adapter error、HTTP/SQL code、metric/log、health probe 或 private fake flag 合成 public marker。 |
| body-free scan corpus | 使用 dummy raw body、dummy secret、dummy receipt body、dummy artifact body 做负向扫描。 | 使用真实 secret、真实 provider payload、真实 receipt body、真实 artifact/archive body。 |

### 6. 隔离与清理思考

| 主题 | 本批要求 |
|---|---|
| run 隔离 | 所有 consumption material、query surface、boundary fixture、distribution material、candidate、outcome、fault profile 均归入 `test_run_ref`。 |
| material 隔离 | formal version ref、consumption material ref、boundary ref、distribution context ref、candidate ref、outcome ref 必须独立。 |
| boundary 隔离 | 七类 sibling boundary 输入必须分开,避免 process / identity / governance / marketplace 等越界样本互相污染断言。 |
| seam 隔离 | publisher candidate、publication outcome、handoff outcome、target registry availability 分别准备,不得用同一 fake flag 表达全部结果。 |
| negative 隔离 | old publish / topic / route 污染样本、dummy body leak corpus、private definition input 必须独立于 positive material。 |
| 清理方式 | fake read/material store run namespace drop;write spy reset;publisher / handoff / availability fault profile reset;dummy corpus delete。 |
| 敏感数据 | 不使用真实 topic secret、bus credential、provider payload、delivery receipt body、artifact/archive body、UI payload 或 marketplace transaction body。 |

### 7. source gap 与停审风险

| 风险 | 判断 | 处理 |
|---|---|---|
| consumption degraded / unavailable marker 来源不闭合 | Query surface 不能由 fixture 合成 marker。 | R7.8 只能引用正式 resolver / mapper / availability output;缺口标 blocker。 |
| sibling boundary decision 缺 formal guard 输出 | 不能用字符串 category 或 route/source 名替代 decision。 | 回 `03` DefinitionUseBoundaryGuard / DownstreamConsumptionBoundary source。 |
| publisher candidate source 不闭合 | 不能从 current truth 或 old outbox 重建 candidate。 | R7.8 必须把 accepted effect / stored body-free fact / completed report source 分开。 |
| handoff delivered-marker schema 不闭合 | delivered 不能等同下游 truth 或 raw receipt。 | 只写正式 receipt marker source;缺 schema 留 Step 13 或回 `03`。 |
| distribution context 与 marketplace 交易边界混淆 | marketplace listing / order / install 不能成为 distribution truth。 | 使用 isolated marketplace boundary fixture,只断言 safe refs。 |
| body-free shell 检测范围过宽 | Step 7 不定义 scanner、artifact path 或 evidence schema。 | 只准备 dummy leak corpus 和 shell corpus;scanner / evidence 留 Step 9 / Step 13。 |

### 8. R7.8 写入边界

R7.8 可以写入:

1. 本批测试数据集表,只覆盖 controlled consumption、distribution、publisher seam、handoff seam、availability marker 和 body-free shell。
2. 本批用例到数据集的前置映射表。
3. 本批 fixture / builder / seed / fault profile 规则。
4. 本批隔离清理规则。
5. 本批 stop-review 和 R7.9 进入门禁。

R7.8 禁止写入:

1. traceability、consistency、operations job、config、dependency、redaction、observability 等后续批次数据。
2. fixture 文件路径、builder 函数名、seed 代码、fault injection 脚本。
3. 环境矩阵、CI suite、evidence schema、验收标准、实施计划或 implementation code。
4. 正式 `05-测试方案.md` 正文。
5. 任何未在 `03/04` 闭合的 schema、port、state、mapper、marker source、availability source、receipt schema、target binding、config key 或 downstream phase boundary。

### 9. R7.7 stop-review

| 检查项 | 结果 |
|---|---|
| 是否只思考 controlled consumption / distribution / seam 数据批次 | pass |
| 是否覆盖 R6.8 的 20 条用例范围 | pass |
| 是否识别 consumption、query、boundary、distribution、publisher、handoff、availability 和 shell 数据候选 | pass |
| 是否明确 builder / seed / fault profile / write spy / body-free corpus 的边界 | pass |
| 是否明确隔离清理和敏感数据红线 | pass |
| 是否识别 marker source、boundary decision、candidate source、receipt marker 和 body-free shell 风险 | pass |
| 是否未写 DS 编号行、完整 TC 映射、trace/job/config 后续批次数据、环境、CI、evidence、验收或实施内容 | pass |
| 是否未修改正式 `05-测试方案.md` | pass |

next_allowed_action: 等待用户确认后进入 Step 7 `R7.8 controlled consumption / distribution / seam 数据:再写入`;只允许写入本批测试数据集表、本批用例到数据集前置映射、本批 fixture / builder / seed / fault profile 规则、本批隔离清理规则、本批 stop-review 和 R7.9 进入门禁;不得直接修改正式 `05-测试方案.md`;不得写 traceability、job、config 等后续批次数据;不得写环境矩阵、CI suite、evidence schema、验收标准、实施计划或 implementation code。

---

## R7.8 controlled consumption / distribution / seam 数据:再写入

### 1. 当前模块状态

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm_to_R7.9 |
| 用户确认 | 已确认从 `R7.7` 推进到 `R7.8`。 |
| 本模块写入范围 | 本批测试数据集表、本批用例到数据集前置映射、本批 fixture / builder / seed / fault profile 规则、本批隔离清理规则、本批 stop-review 和 R7.9 进入门禁。 |
| 本模块禁止范围 | 正式 `05-测试方案.md` 正文、traceability / consistency / operations job / config / dependency / redaction / observability 等后续批次数据、fixture 路径、builder 函数、seed 代码、环境矩阵、CI suite、evidence schema、验收标准、实施计划和 implementation code。 |

### 2. 本批测试数据集表

| 数据集 | 用途 | 构造方式 | 隔离键 | 清理方式 | 关联用例 |
|---|---|---|---|---|---|
| DS-ML-CONSUME-001 | current formal version 可被受控消费。 | seed current formal version、supported boundary、available consumption material、safe material refs。 | `test_run_ref`;formal version ref;consumption material ref。 | run namespace drop。 | TC-ML-CONSUMPTION-001 |
| DS-ML-CONSUME-002 | not-formal / superseded / retired / boundary retired 不可消费。 | seed not-started/in-review formalization、superseded/retired version、retired boundary variants。 | `test_run_ref`;negative consumption case id。 | run namespace drop。 | TC-ML-CONSUMPTION-002 |
| DS-ML-CONSUME-003 | 下游私有定义不能替代本仓 consumption material。 | downstream private definition / runtime snapshot / local model fixture,只含 safe refs 和 source category。 | `test_run_ref`;downstream source category;boundary case id。 | run namespace drop。 | TC-ML-CONSUMPTION-003 |
| DS-ML-QUERY-002 | consumption query visible / empty / not-visible no-write。 | read material seed + write spy reset profile。 | `test_run_ref`;query selector;write spy case id。 | reset write spy;run namespace drop。 | TC-ML-QUERY-002 |
| DS-ML-QUERY-003 | stale / degraded / unavailable consumption material 不被 query 修复。 | stale/degraded/unavailable read surface seed + formal marker source placeholder。 | `test_run_ref`;read surface case id;marker source ref。 | reset read store;run namespace drop。 | TC-ML-QUERY-003 |
| DS-ML-BOUNDARY-002 | process-facing consumption boundary。 | process use context fixture with template/task/method safe refs。 | `test_run_ref`;process boundary case id。 | run namespace drop。 | TC-ML-BOUNDARY-002 |
| DS-ML-BOUNDARY-003 | identity-facing role / method semantic boundary。 | identity role context fixture with safe identity summary/ref only。 | `test_run_ref`;identity boundary case id。 | run namespace drop。 | TC-ML-BOUNDARY-003 |
| DS-ML-BOUNDARY-004 | governance basis / policy summary boundary。 | governance basis safe summary/ref seed;no governance execution body。 | `test_run_ref`;governance boundary case id。 | run namespace drop。 | TC-ML-BOUNDARY-004 |
| DS-ML-BOUNDARY-005 | capability-hub provider access boundary。 | provider/tool/capability safe ref and unavailable summary fixture。 | `test_run_ref`;capability boundary case id。 | run namespace drop。 | TC-ML-BOUNDARY-005 |
| DS-ML-BOUNDARY-006 | marketplace distribution boundary。 | marketplace-facing source/package/distribution context fixture with no transaction fields。 | `test_run_ref`;marketplace boundary case id。 | run namespace drop。 | TC-ML-BOUNDARY-006 |
| DS-ML-BOUNDARY-007 | UI / console view policy boundary。 | UI-facing view policy request fixture with safe view refs and no raw UI payload。 | `test_run_ref`;ui boundary case id。 | run namespace drop。 | TC-ML-BOUNDARY-007 |
| DS-ML-BOUNDARY-008 | artifact / archive body boundary。 | artifact/archive ref fixture + isolated dummy body violation corpus。 | `test_run_ref`;artifact boundary case id。 | delete isolated dummy corpus;run namespace drop。 | TC-ML-BOUNDARY-008 |
| DS-ML-DIST-001 | 正式可消费语境形成 distribution context。 | distribution context/material refs seed from current formal version and relation/distribution source。 | `test_run_ref`;distribution context ref;material ref。 | run namespace drop。 | TC-ML-DISTRIBUTION-001 |
| DS-ML-DIST-002 | 旧 publish / topic / route 不能证明 distribution truth。 | isolated pollution fixture: old publish/outbox/topic/route/manual sync/snapshot/fingerprint samples。 | `test_run_ref`;distribution pollution case id。 | delete isolated pollution fixture。 | TC-ML-DISTRIBUTION-002 |
| DS-ML-PUBLISHER-001 | event candidate 从 stored body-free fact 组装。 | stored accepted effect / bounded inbound stored fact / completed report safe refs as candidate source。 | `test_run_ref`;candidate source ref;event candidate ref。 | run namespace drop。 | TC-ML-PUBLISHER-001 |
| DS-ML-PUBLISHER-002 | publisher failed / blocked / unavailable 不回滚 committed truth。 | persisted event candidate + target registry failed/blocked/unavailable fault profile。 | `test_run_ref`;event candidate ref;target case id。 | reset publisher fault profile;run namespace drop。 | TC-ML-PUBLISHER-002 |
| DS-ML-HANDOFF-001 | handoff prepared 与 delivered-marker 分离。 | handoff-safe refs、target ready summary、body-free receipt marker seed。 | `test_run_ref`;handoff ref;receipt marker ref。 | run namespace drop。 | TC-ML-HANDOFF-001 |
| DS-ML-HANDOFF-002 | handoff failed / blocked / unavailable 不回滚本地 truth。 | handoff target failed/blocked/unavailable fault profile and safe outcome refs。 | `test_run_ref`;handoff ref;target case id。 | reset handoff fault profile;run namespace drop。 | TC-ML-HANDOFF-002 |
| DS-ML-AVAILABILITY-001 | resolver / publisher / handoff marker copy-only。 | formal availability / degraded / blocked marker source seed for resolver、publisher、handoff、target registry。 | `test_run_ref`;availability source ref;marker case id。 | run namespace drop。 | TC-ML-AVAILABILITY-001;TC-ML-QUERY-003 |
| DS-ML-SHELL-002 | consumption / distribution / handoff shell body-free。 | safe shell corpus + isolated dummy raw body / secret / receipt body / artifact body leak corpus。 | `test_run_ref`;shell case id;leak corpus id。 | delete isolated dummy corpus;run namespace drop。 | TC-ML-SHELL-002 |

### 3. 本批用例到数据集前置映射

| 用例 ID | 数据集 | fixture / builder / seed | fake / stub / real-like | 清理方式 |
|---|---|---|---|---|
| TC-ML-CONSUMPTION-001 | DS-ML-RUN-001;DS-ML-CONSUME-001 | current formal version + available consumption material seed | fake material repository / boundary guard | run namespace drop |
| TC-ML-CONSUMPTION-002 | DS-ML-RUN-001;DS-ML-CONSUME-002 | not-formal / retired negative material seed | fake material repository / boundary guard | run namespace drop |
| TC-ML-CONSUMPTION-003 | DS-ML-RUN-001;DS-ML-CONSUME-003 | downstream private definition fixture | fake boundary guard input | run namespace drop |
| TC-ML-QUERY-002 | DS-ML-RUN-001;DS-ML-QUERY-002 | visible/empty/not-visible read material seed + write spy | fake read repository / write spy | reset write spy;run namespace drop |
| TC-ML-QUERY-003 | DS-ML-RUN-001;DS-ML-QUERY-003;DS-ML-AVAILABILITY-001 | stale/degraded/unavailable surface seed + marker source | fake read repository / availability fake | reset read store;run namespace drop |
| TC-ML-BOUNDARY-002 | DS-ML-RUN-001;DS-ML-BOUNDARY-002 | process use context fixture | fake boundary guard input | run namespace drop |
| TC-ML-BOUNDARY-003 | DS-ML-RUN-001;DS-ML-BOUNDARY-003 | identity role context fixture | fake boundary guard input | run namespace drop |
| TC-ML-BOUNDARY-004 | DS-ML-RUN-001;DS-ML-BOUNDARY-004 | governance basis summary seed | fake boundary guard input | run namespace drop |
| TC-ML-BOUNDARY-005 | DS-ML-RUN-001;DS-ML-BOUNDARY-005 | capability/provider safe ref fixture | fake external source adapter | run namespace drop |
| TC-ML-BOUNDARY-006 | DS-ML-RUN-001;DS-ML-BOUNDARY-006 | marketplace context fixture | fake distribution boundary input | run namespace drop |
| TC-ML-BOUNDARY-007 | DS-ML-RUN-001;DS-ML-BOUNDARY-007 | UI view policy request fixture | fake query shell input | run namespace drop |
| TC-ML-BOUNDARY-008 | DS-ML-RUN-001;DS-ML-BOUNDARY-008 | artifact/archive ref + dummy body corpus | fake body-boundary checker | delete isolated corpus;run namespace drop |
| TC-ML-DISTRIBUTION-001 | DS-ML-RUN-001;DS-ML-DIST-001 | distribution context/material seed | fake distribution repository | run namespace drop |
| TC-ML-DISTRIBUTION-002 | DS-ML-RUN-001;DS-ML-DIST-002 | old publish/topic/route pollution fixture | none | delete isolated fixture |
| TC-ML-PUBLISHER-001 | DS-ML-RUN-001;DS-ML-PUBLISHER-001 | stored body-free fact + candidate source seed | fake candidate assembler input | run namespace drop |
| TC-ML-PUBLISHER-002 | DS-ML-RUN-001;DS-ML-PUBLISHER-001;DS-ML-PUBLISHER-002 | persisted candidate + publisher target fault profile | fake publisher / target registry fake | reset publisher fault profile;run namespace drop |
| TC-ML-HANDOFF-001 | DS-ML-RUN-001;DS-ML-HANDOFF-001 | handoff-safe refs + delivered-marker seed | fake handoff adapter | run namespace drop |
| TC-ML-HANDOFF-002 | DS-ML-RUN-001;DS-ML-HANDOFF-002 | handoff target failure profile | fake handoff adapter / target registry fake | reset handoff fault profile;run namespace drop |
| TC-ML-AVAILABILITY-001 | DS-ML-RUN-001;DS-ML-AVAILABILITY-001 | formal availability/degraded marker seed | resolver/publisher/handoff availability fake | run namespace drop |
| TC-ML-SHELL-002 | DS-ML-RUN-001;DS-ML-SHELL-002 | safe shell corpus + dummy leak corpus | redaction/body-free checker candidate | delete isolated corpus;run namespace drop |

### 4. 本批构造规则

| 规则 | 本批口径 |
|---|---|
| consumption material | 只能由 current formal version、supported boundary、available material source 和 safe material refs 构造;不得复制 definition body 或 downstream runtime truth。 |
| negative consumption | not-formal、superseded、retired、boundary retired 必须单独数据集,不得混入 current happy path。 |
| consumption query | query seed 只能准备 read surface;write spy 只用于证明 no-write,不成为正式业务对象或 evidence schema。 |
| sibling boundary | process、identity、governance、capability、marketplace、UI、artifact/archive 输入只承载 safe refs / summary / context category。 |
| distribution material | distribution context/material 不使用旧 publish/outbox/topic/route/manual sync/snapshot/fingerprint 证明 truth。 |
| publisher candidate | candidate 只能从 stored body-free fact、accepted effect 或 completed report safe refs 组装;不重读 current truth 拼 payload。 |
| handoff outcome | prepared、delivered-marker、failed、blocked、unavailable 只表达本地 outcome / marker;delivered 不代表 downstream truth。 |
| availability marker | degraded / unavailable / blocked / failed marker 必须复制 resolver / mapper / availability / target registry 输出;缺源即 blocker。 |
| body-free corpus | dummy leak corpus 只用于负向扫描;不得使用真实 secret、provider payload、delivery receipt body、artifact/archive body 或 UI payload。 |

### 5. 本批隔离与清理规则

| 数据类型 | 隔离键 | 清理方式 | 注意事项 |
|---|---|---|---|
| consumption material | formal version ref;consumption material ref;boundary ref | run namespace drop | positive / negative material 分开。 |
| query read surface | query selector;read surface case id;write spy case id | reset write spy;drop read store namespace | query 不 repair、不 append audit、不 publish event。 |
| sibling boundary fixture | boundary type;boundary case id | run namespace drop | 七类边界不得复用同一输入。 |
| distribution material / pollution | distribution context ref;pollution case id | run namespace drop;delete isolated pollution fixture | 旧 publish/topic/route 只作负向污染样本。 |
| publisher seam | candidate ref;target case id | reset publisher fault profile;run namespace drop | candidate、outcome、truth 三层分开。 |
| handoff seam | handoff ref;receipt marker ref;target case id | reset handoff fault profile;run namespace drop | receipt marker 不含 receipt body。 |
| availability marker | availability source ref;marker case id | run namespace drop | marker source 缺失不得合成。 |
| shell / leak corpus | shell case id;leak corpus id | delete isolated dummy corpus;run namespace drop | 只含 dummy body / secret / receipt / artifact value。 |

### 6. 本批停审

| 停审项 | 结论 | 说明 |
|---|---|---|
| 是否覆盖 R6.8 全部 20 条用例 | pass | 每条用例均映射到至少一个可重复数据集。 |
| 是否区分 consumption、query、boundary、distribution、publisher、handoff、availability、shell 数据 | pass | 各切口均有独立数据集或明确共享基础数据。 |
| 是否区分正向、负向、边界、seam failure 和 body-free 负向数据 | pass | not-formal/retired、private definition、old publish/topic、publisher/handoff failure、dummy leak corpus 均独立。 |
| 是否有隔离键和清理方式 | pass | 每个数据集均有 run / ref / case / fault profile 级隔离和清理方式。 |
| 是否未使用真实 sibling repo / broker / provider / secret / artifact body | pass | 本批只使用 fake、safe refs、formal markers 和 isolated dummy corpus。 |
| 是否未补 marker / receipt / target binding / config key | pass | marker、receipt 和 target 只作为正式来源引用;缺口按 blocker 处理。 |
| 是否未写 traceability、job、config 等后续批次数据 | pass | trace / audit / job / config 数据未展开。 |
| 是否未写环境、CI、evidence schema、验收或实施内容 | pass | 仅记录数据设计中间产物。 |
| 是否未修改正式 `05-测试方案.md` | pass | 当前仍只更新中间产物。 |

### 7. R7.9 进入门禁

| 门禁项 | 裁决 |
|---|---|
| R7.8 是否已写入本批测试数据集表 | pass |
| R7.8 是否已写入本批用例到数据集映射 | pass |
| R7.8 是否已写入本批构造 / 隔离 / 清理规则 | pass |
| R7.8 是否已完成本批停审 | pass |
| 是否未写后续批次数据 | pass |
| 是否未修改正式 `05-测试方案.md` | pass |

next_allowed_action: 等待用户确认后进入 Step 7 `R7.9 traceability / consistency / job / recovery 数据:先思考`;只允许思考 trace / audit / lineage / impact、stored surface、UoW、checkpoint / report / job、recovery source、job no truth repair 数据批次的输入边界、用例范围、数据集候选、构造边界、隔离清理、source gap 和 `R7.10` 写入边界;不得直接修改正式 `05-测试方案.md`;不得写 config、dependency、redaction、observability 等后续批次数据;不得写环境矩阵、CI suite、evidence schema、验收标准、实施计划或 implementation code。

---

## R7.9 traceability / consistency / job / recovery 数据:先思考

### 1. 当前模块目标

`R7.9` 只思考 Step 6 R6.10 第四批用例的数据设计边界,覆盖 trace / audit / lineage / impact、evidence lineage、stored replay、UoW、commit unknown、stored surface missing、checkpoint / progress / report / issue 和 job no truth repair。

当前模块不写最终数据集表、DS 编号行、完整 TC 映射、fixture 路径、builder 函数、seed 代码、fault injection 脚本、环境矩阵、CI suite、evidence schema、验收标准或实施计划。`R7.10` 才允许把本批思考转成第四批测试数据集行和用例前置映射。

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm_to_R7.10 |
| 用户确认 | 已确认从 `R7.8` 推进到 `R7.9`。 |
| 当前允许 | 思考本批输入边界、用例范围、trace / audit / lineage / impact / evidence / replay / UoW / recovery / job 数据集候选、构造边界、隔离清理、source gap 和 R7.10 写入边界。 |
| 当前禁止 | 修改正式 `05-测试方案.md`;写 DS 编号行、完整 TC 映射、config / dependency / redaction / observability 等后续批次数据;写 fixture 路径、builder 函数、seed 代码、环境矩阵、CI suite、evidence schema、验收标准、实施计划或 implementation code。 |

### 2. 本批用例范围

| 用例族 | 用例 ID | 数据设计关注点 |
|---|---|---|
| trace material | `TC-ML-TRACE-001~003` | accepted formalization、semantic version change、formal consumption 的 trace material 必须只含 definition / version / basis / material / context refs。 |
| audit trail | `TC-ML-AUDIT-001~002` | accepted business fact audit 与 rejected / duplicate / query observation 分离,并保持 refs-only。 |
| lineage / evidence | `TC-ML-LINEAGE-001`;`TC-ML-EVIDENCE-001` | version / publish / reference / handoff lineage 只承载 safe refs、marker 和 summary,不定义 EV / artifact schema。 |
| impact protection | `TC-ML-IMPACT-001~002` | semantic change 影响既有消费必须有 impact summary / protection decision;下游回报不能反写 truth。 |
| stored replay | `TC-ML-REPLAY-001~002` | duplicate command / inbound / job 只能读取 stored result / receipt / report。 |
| UoW atomicity | `TC-ML-UOW-001~002` | accepted logical commit 全有或全无;rollback 后不得残留 truth、stored result、candidate、audit 或 trace。 |
| recovery source | `TC-ML-RECOVERY-003~004` | commit unknown 和 stored surface missing 只能依赖正式 stored surface、formal read-back 或 manual / consistency-safe source。 |
| operations job | `TC-ML-JOB-001~004` | job duplicate report replay、checkpoint resume、partial issue/report、no core truth repair。 |

本批不覆盖 config validation、dependency unavailable、secret / redaction、metric / log / trace 专项和 cross-case audit 的完整数据集。R7.9 只处理 trace / consistency / recovery / job 数据前置,不定义 artifact path、report JSON schema、EV 编号、CI 命令或验收 gate。

### 3. 正式输入约束思考

| 输入 | 对本批数据的约束 | 禁止由数据设计补口 |
|---|---|---|
| `00-需求文档.md` FR-ML-007~009 | 数据必须表达追溯、消费一致性保护和证据线索承接。 | 不能把证据文件正文、治理执行正文或人工说明写成 truth。 |
| `00-需求文档.md` BR-ML-019~022 | governance basis 只能以 safe ref / summary 承接;版本、发布、引用证据线索必须可追溯。 | 不能迁入治理裁决、投票、approval body、enforcement state 或下游运行 truth。 |
| `03-详细设计.md` object / protocol / flow | trace、audit、lineage、impact、stored result、receipt、report、checkpoint、issue 均必须来自正式对象或 public shell。 | 不能通过 fixture 私加 stored surface、mapper、checkpoint source、report schema 或 marker source。 |
| `03-详细设计.md` transaction / recovery / idempotency | duplicate replay no-rerun、commit unknown、stored surface missing、UoW atomicity 和 rollback no residue 是正式一致性规则。 | 不能用 log、metric、timeout、adapter note、private flag 或 current truth rebuild 证明 accepted。 |
| `04-配置设计.md` forbidden config boundary | 配置不得关闭 stored replay、改变 transaction boundary、让 job 修 truth 或用 replay root 覆盖 marker/source。 | 不能写 config key、profile matrix、job batch/retry 数值或 report target schema。 |
| Step 6 R6.10 | 已固定 19 条候选用例的前置、操作、预期和断言。 | Step 7 不新增 TC、不改断言、不把 evidence candidate 扩成正式 evidence schema。 |

### 4. 数据集候选思考

| 候选数据族 | 目标 | 后续 R7.10 可能写入 |
|---|---|---|
| trace material basis | accepted formalization / version change / consumption context 的 body-free trace refs。 | trace positive data with formal basis / version / material context refs。 |
| audit accepted / negative split | accepted UoW audit refs 与 rejected / duplicate / query observation 分离。 | accepted audit data、negative audit observation data。 |
| lineage / evidence safe chain | version、publication candidate、reference / handoff context 和 evidence candidate 的 safe refs 链。 | lineage safe-chain data,但不写 EV ID / artifact path。 |
| impact protection | current version 被消费引用、semantic change input、affected refs、protection decision source。 | impact summary / downstream-return boundary data。 |
| stored replay surface | command stored result、inbound stored receipt、job stored report 的 present / missing / kind mismatch variants。 | replay present data、stored missing / mismatch recovery data。 |
| UoW atomicity / rollback | accepted transaction success 组合、repository / stored result / candidate save failure profile。 | atomic commit data、rollback fault profile data。 |
| commit unknown source | commit unknown 后 stored surface present / absent / formal read-back variants。 | recovery source data,只表达正式 source 是否可读。 |
| checkpoint / progress / report / issue | job interrupted / partial / completed 的 checkpoint、progress、report、issue safe refs。 | job report replay、checkpoint resume、partial failure data。 |
| no truth repair guard | core truth 缺失 / 损坏 / 与派生 material 不一致的 guard input。 | job no-repair negative data with write guard。 |

### 5. 构造方式边界思考

| 数据类型 | 允许构造 | 禁止构造 |
|---|---|---|
| trace material builder | 按正式 definition ref、formalization basis ref、version ref、material context ref、safe reason ref 构造 trace shell。 | 保存 governance body、method body、artifact body、downstream runtime body、old snapshot / fingerprint。 |
| audit seed / spy | seed accepted business fact audit refs;用 spy 区分 rejected / duplicate / query 不产生 accepted audit。 | 把 rejected、duplicate、query observation 写成 accepted audit;保存 raw reason、stack、external body。 |
| lineage seed | 用 source version ref、candidate ref、outcome / receipt marker ref、safe summary 形成 lineage chain。 | 定义 EV schema、report path、artifact JSON、event payload body、receipt body。 |
| impact seed | 用 current version consumed refs、semantic change input、affected refs 和 formal protection decision source 构造。 | 下游回报直接修改 definition truth、formal version、trace material 或 accepted audit。 |
| replay seed | seed stored result / receipt / report present、missing、kind mismatch 和 digest conflict variants。 | 从 current truth、query surface、adapter scan、job body 或 log 重建 stored surface。 |
| UoW fault profile | 注入 repository save、stored result save、candidate save、commit unknown 等受控失败。 | 用 runtime log、metric、private flag 作为 rollback / success proof。 |
| job seed | seed job run key、checkpoint/progress/report/issue refs、partial failed item safe summary。 | 用 queue offset、scheduler lease、report body、stack trace 或 raw external payload 作为 checkpoint / report。 |
| no-repair guard | 为 core truth store 准备 write guard / mutation spy,证明 job 不修 truth。 | 让 job 创建、更新、删除 definition truth、formal version、accepted audit 或 stored command result。 |

### 6. 隔离与清理思考

| 主题 | 本批要求 |
|---|---|
| run 隔离 | trace、audit、lineage、impact、stored surface、UoW fault、checkpoint、report、issue 和 no-repair guard 均归入 `test_run_ref`。 |
| operation 隔离 | command replay、inbound replay 和 job replay 分别使用 operation key、source key、job run key,不得交叉复用。 |
| trace / audit 隔离 | accepted trace/audit positive 数据与 rejected / duplicate / query negative observation 数据分开。 |
| stored surface 隔离 | stored result、stored receipt、stored report 的 present / missing / kind mismatch case 分开,避免一条数据同时证明多种 recovery 分支。 |
| job 隔离 | completed report、interrupted checkpoint、partial issue、no-repair guard 分别隔离,不得用同一 fake run state 表达。 |
| 清理方式 | fake truth/support/material/replay/report store run namespace drop;fault profile reset;write guard reset;partial issue/report namespace drop。 |
| 敏感数据 | 不使用真实 governance body、external response、event payload、receipt body、report body、artifact body、secret、endpoint 或 stack trace。 |

### 7. source gap 与停审风险

| 风险 | 判断 | 处理 |
|---|---|---|
| trace / audit 字段来源不闭合 | 数据不能私加 trace field、audit field 或 accepted fact carrier。 | R7.10 只能引用 `03` 已闭口对象 / summary;缺口回 owning Step。 |
| evidence lineage schema 被提前发明 | Step 7 不能定义 EV ID、artifact path、JSON schema 或 report schema。 | R7.10 只写 safe refs 数据;schema 留 Step 13。 |
| stored report / receipt replay source 不闭合 | duplicate replay 不能扫描 adapter 或重跑 job。 | present / missing / mismatch variants 必须回指正式 stored surface。 |
| commit unknown recovery source 不闭合 | timeout / log / metric / private flag 不能判定 accepted。 | 只允许 stored surface、formal read-back 或正式 manual / consistency source。 |
| checkpoint 来源被 lease / queue offset 替代 | job resume 不能用 scheduler 私有状态。 | checkpoint/progress/report/issue 必须是正式 safe source。 |
| job no truth repair 数据过界 | no-repair guard 不能变成 repair policy。 | 只验证 job 返回 issue / report,不写 repair fixture 或 truth patch。 |
| UoW rollback 证明来源不安全 | rollback proof 不能依赖日志或 private flag。 | 使用正式 store absence / write guard / stored surface absence 作为数据断言方向。 |

### 8. R7.10 写入边界

R7.10 可以写入:

1. 本批测试数据集表,只覆盖 trace / audit / lineage / impact / evidence / stored replay / UoW / recovery / job。
2. 本批用例到数据集的前置映射表。
3. 本批 fixture / builder / seed / fault profile / write guard 规则。
4. 本批隔离清理规则。
5. 本批 stop-review 和 R7.11 进入门禁。

R7.10 禁止写入:

1. config、dependency、redaction、observability、cross-case audit 等后续批次数据。
2. fixture 文件路径、builder 函数名、seed 代码、fault injection 脚本。
3. 环境矩阵、CI suite、evidence schema、验收标准、实施计划或 implementation code。
4. 正式 `05-测试方案.md` 正文。
5. 任何未在 `03/04` 闭合的 schema、port、state、mapper、marker source、stored surface、checkpoint source、report schema、artifact path、config key 或 phase boundary。

### 9. R7.9 stop-review

| 检查项 | 结果 |
|---|---|
| 是否只思考 traceability / consistency / job / recovery 数据批次 | pass |
| 是否覆盖 R6.10 的 19 条用例范围 | pass |
| 是否识别 trace、audit、lineage、impact、evidence、stored replay、UoW、recovery 和 job 数据候选 | pass |
| 是否明确 builder / seed / fault profile / write guard / stored surface 的边界 | pass |
| 是否明确隔离清理和敏感数据红线 | pass |
| 是否识别 evidence schema、stored surface、commit unknown、checkpoint、job no-repair 和 UoW rollback 风险 | pass |
| 是否未写 DS 编号行、完整 TC 映射、config / redaction / observability 后续批次数据、环境、CI、evidence、验收或实施内容 | pass |
| 是否未修改正式 `05-测试方案.md` | pass |

next_allowed_action: 等待用户确认后进入 Step 7 `R7.10 traceability / consistency / job / recovery 数据:再写入`;只允许写入本批测试数据集表、本批用例到数据集前置映射、本批 fixture / builder / seed / fault profile / write guard 规则、本批隔离清理规则、本批 stop-review 和 R7.11 进入门禁;不得直接修改正式 `05-测试方案.md`;不得写 config、dependency、redaction、observability 等后续批次数据;不得写环境矩阵、CI suite、evidence schema、验收标准、实施计划或 implementation code。

---

## R7.10 traceability / consistency / job / recovery 数据:再写入

### 1. 当前模块状态

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm_to_R7.11 |
| 用户确认 | 已确认从 `R7.9` 推进到 `R7.10`。 |
| 本模块写入范围 | 本批测试数据集表、本批用例到数据集前置映射、本批 fixture / builder / seed / fault profile / write guard 规则、本批隔离清理规则、本批 stop-review 和 R7.11 进入门禁。 |
| 本模块禁止范围 | 正式 `05-测试方案.md` 正文、config / dependency / redaction / observability / cross-case audit 等后续批次数据、fixture 路径、builder 函数、seed 代码、环境矩阵、CI suite、evidence schema、验收标准、实施计划和 implementation code。 |

### 2. 本批测试数据集表

| 数据集 | 用途 | 构造方式 | 隔离键 | 清理方式 | 关联用例 |
|---|---|---|---|---|---|
| DS-ML-TRACE-001 | accepted formalization trace 可追到 basis refs。 | seed accepted formalization、definition ref、formalization basis ref、accepted fact ref、safe reason ref。 | `test_run_ref`;definition ref;formalization ref;basis ref。 | run namespace drop。 | TC-ML-TRACE-001 |
| DS-ML-TRACE-002 | semantic version change trace 可追到变化依据。 | seed old/current version refs、semantic change input、change basis refs、safe change reason refs。 | `test_run_ref`;version ref pair;change case id。 | run namespace drop。 | TC-ML-TRACE-002 |
| DS-ML-TRACE-003 | formal consumption trace 可回到定义来源和版本语境。 | seed consumption material ref、definition ref、formal version ref、material context ref、distribution context ref。 | `test_run_ref`;consumption material ref;context ref。 | run namespace drop。 | TC-ML-TRACE-003 |
| DS-ML-AUDIT-001 | accepted business fact audit refs-only。 | seed accepted UoW audit refs、actor ref、safe reason refs、stored result ref。 | `test_run_ref`;audit subject ref;stored result ref。 | run namespace drop。 | TC-ML-AUDIT-001 |
| DS-ML-AUDIT-002 | rejected / duplicate / query observation 不写 accepted audit。 | rejected surface、duplicate replay、query read 分支 seed + accepted audit write spy。 | `test_run_ref`;negative audit case id;operation key。 | reset audit spy;run namespace drop。 | TC-ML-AUDIT-002 |
| DS-ML-LINEAGE-001 | version / publish / reference lineage body-free。 | seed source version refs、event candidate ref、handoff outcome / receipt marker refs、safe lineage summary。 | `test_run_ref`;lineage case id;candidate ref。 | run namespace drop。 | TC-ML-LINEAGE-001 |
| DS-ML-IMPACT-001 | semantic change 形成 consumption impact summary。 | seed current version consumed refs、semantic change input、affected refs、protection decision source。 | `test_run_ref`;version ref;impact case id。 | run namespace drop。 | TC-ML-IMPACT-001 |
| DS-ML-IMPACT-002 | 下游回报不能反向改写本仓 truth。 | downstream impact / conflict / failed / unavailable summary fixture + truth write guard。 | `test_run_ref`;downstream return case id;truth guard id。 | reset truth guard;run namespace drop。 | TC-ML-IMPACT-002 |
| DS-ML-EVIDENCE-001 | evidence lineage 承接验收 / 审计语境。 | seed evidence candidate safe refs、marker refs、summary refs,不写 EV ID / artifact path。 | `test_run_ref`;evidence candidate ref;lineage ref。 | run namespace drop。 | TC-ML-EVIDENCE-001 |
| DS-ML-REPLAY-001 | duplicate command replay stored result only。 | seed accepted / rejected stored operation result、same operation key / digest replay input。 | `test_run_ref`;operation key;digest case id。 | run namespace drop。 | TC-ML-REPLAY-001 |
| DS-ML-REPLAY-002 | duplicate inbound / job replay stored receipt / report only。 | seed inbound stored receipt、job stored report、same source key / run key replay input。 | `test_run_ref`;source key;job run key。 | run namespace drop。 | TC-ML-REPLAY-002 |
| DS-ML-UOW-001 | accepted path atomic commit。 | seed accepted command input with truth/support/material、stored result、trace/audit/lineage、candidate refs in one logical boundary。 | `test_run_ref`;operation key;UoW case id。 | run namespace drop。 | TC-ML-UOW-001 |
| DS-ML-UOW-002 | rollback 后无 accepted 残留。 | repository / stored result / candidate save failure fault profile + store absence assertions。 | `test_run_ref`;operation key;fault case id。 | reset UoW fault profile;run namespace drop。 | TC-ML-UOW-002 |
| DS-ML-RECOVERY-003 | commit unknown 不用日志 / timeout 私判成功。 | commit unknown fault profile + stored surface present / read-back present / no-proof variants。 | `test_run_ref`;operation key;commit fault case id。 | reset UoW fault profile;run namespace drop。 | TC-ML-RECOVERY-003 |
| DS-ML-RECOVERY-004 | stored surface missing 进入 manual / consistency-safe。 | completed guard seed with stored result / receipt / report missing or kind mismatch variants。 | `test_run_ref`;replay guard key;stored surface case id。 | run namespace drop。 | TC-ML-RECOVERY-004 |
| DS-ML-JOB-001 | job duplicate replay stored report。 | seed completed job run、stored report summary、same run key duplicate input。 | `test_run_ref`;job run key;report ref。 | run namespace drop。 | TC-ML-JOB-001 |
| DS-ML-JOB-002 | checkpoint resume 使用正式 progress / checkpoint / issue source。 | seed interrupted job run、checkpoint ref、progress ref、issue ref、resume input。 | `test_run_ref`;job run key;checkpoint ref。 | run namespace drop。 | TC-ML-JOB-002 |
| DS-ML-JOB-003 | partial failure 记录 safe issue 和 report summary。 | seed partial item failure / unavailable summary、safe issue refs、failed-with-issue report summary。 | `test_run_ref`;job run key;partial issue ref。 | run namespace drop。 | TC-ML-JOB-003 |
| DS-ML-JOB-004 | operations job 不修 core truth。 | seed core truth missing/damaged/inconsistent guard input + truth mutation spy。 | `test_run_ref`;job run key;truth guard id。 | reset truth spy;run namespace drop。 | TC-ML-JOB-004 |

### 3. 本批用例到数据集前置映射

| 用例 ID | 数据集 | fixture / builder / seed | fake / stub / real-like | 清理方式 |
|---|---|---|---|---|
| TC-ML-TRACE-001 | DS-ML-RUN-001;DS-ML-TRACE-001 | formalization trace seed with basis refs | fake trace material repository | run namespace drop |
| TC-ML-TRACE-002 | DS-ML-RUN-001;DS-ML-TRACE-002 | version change trace seed | fake trace/version repository | run namespace drop |
| TC-ML-TRACE-003 | DS-ML-RUN-001;DS-ML-TRACE-003 | consumption trace / material context seed | fake trace/material repository | run namespace drop |
| TC-ML-AUDIT-001 | DS-ML-RUN-001;DS-ML-AUDIT-001 | accepted audit refs seed | fake audit repository | run namespace drop |
| TC-ML-AUDIT-002 | DS-ML-RUN-001;DS-ML-AUDIT-002 | negative branch seed + audit write spy | fake audit repository / spy | reset audit spy;run namespace drop |
| TC-ML-LINEAGE-001 | DS-ML-RUN-001;DS-ML-LINEAGE-001 | safe lineage chain seed | fake lineage repository | run namespace drop |
| TC-ML-IMPACT-001 | DS-ML-RUN-001;DS-ML-IMPACT-001 | consumed version + impact summary seed | fake impact repository / protection policy fake | run namespace drop |
| TC-ML-IMPACT-002 | DS-ML-RUN-001;DS-ML-IMPACT-002 | downstream return fixture + truth guard | fake inbound summary / truth write spy | reset truth guard;run namespace drop |
| TC-ML-EVIDENCE-001 | DS-ML-RUN-001;DS-ML-EVIDENCE-001 | evidence candidate safe refs seed | fake lineage/evidence candidate repository | run namespace drop |
| TC-ML-REPLAY-001 | DS-ML-RUN-001;DS-ML-REPLAY-001 | stored command result present seed | fake idempotency guard / stored result store | run namespace drop |
| TC-ML-REPLAY-002 | DS-ML-RUN-001;DS-ML-REPLAY-002;DS-ML-JOB-001 | stored receipt / stored report seed | fake consumer receipt store / job report store | run namespace drop |
| TC-ML-UOW-001 | DS-ML-RUN-001;DS-ML-UOW-001 | atomic accepted boundary seed | fake UoW / fake repositories | run namespace drop |
| TC-ML-UOW-002 | DS-ML-RUN-001;DS-ML-UOW-002 | rollback fault profile | fake UoW / repository fault fake | reset UoW profile;run namespace drop |
| TC-ML-RECOVERY-003 | DS-ML-RUN-001;DS-ML-RECOVERY-003 | commit unknown source variants | fake UoW / stored surface / read-back fake | reset UoW profile;run namespace drop |
| TC-ML-RECOVERY-004 | DS-ML-RUN-001;DS-ML-RECOVERY-004 | completed guard with missing / mismatched stored surface | fake stored result/receipt/report store | run namespace drop |
| TC-ML-JOB-001 | DS-ML-RUN-001;DS-ML-JOB-001 | completed job report seed | fake job report store | run namespace drop |
| TC-ML-JOB-002 | DS-ML-RUN-001;DS-ML-JOB-002 | checkpoint / progress / issue seed | fake job checkpoint store | run namespace drop |
| TC-ML-JOB-003 | DS-ML-RUN-001;DS-ML-JOB-003 | partial issue / report seed | fake job runner / report store | run namespace drop |
| TC-ML-JOB-004 | DS-ML-RUN-001;DS-ML-JOB-004 | no-repair guard + truth mutation spy | fake job runner / truth write spy | reset truth spy;run namespace drop |

### 4. 本批构造规则

| 规则 | 本批口径 |
|---|---|
| trace material | trace 数据只承载 definition / version / basis / material / context typed refs 和 safe reason refs;不保存治理执行正文、method body、artifact body 或 snapshot。 |
| audit split | accepted audit 与 rejected / duplicate / query observation 分离;negative branch 只能使用 safe diagnostic / observation surface 和 spy 验证无 accepted audit。 |
| lineage / evidence | lineage 和 evidence candidate 只写 safe refs / marker / summary;EV ID、artifact path、JSON schema、report schema 后移 Step 13。 |
| impact protection | impact 数据必须显式表达 affected refs 和 protection decision source;下游回报只作为 safe summary 输入,不能改写本仓 truth。 |
| stored replay | command、inbound、job replay 数据必须回指 stored result / receipt / report;missing / kind mismatch 单独数据集,不得从 current truth 重建。 |
| UoW / recovery | rollback 和 commit unknown 通过正式 stored surface、formal read-back、store absence 或 consistency-safe surface 表达;不使用日志、metric、timeout 或 private flag。 |
| job checkpoint/report | checkpoint、progress、report、issue 均为正式 safe refs;queue offset、lease、scheduler private state 和 report body 不作为数据前置。 |
| no truth repair | job no-repair 数据只验证 job 返回 issue / manual / report surface,并用 write spy 证明未修改 core truth。 |

### 5. 本批隔离与清理规则

| 数据类型 | 隔离键 | 清理方式 | 注意事项 |
|---|---|---|---|
| trace / lineage | definition ref;version ref;lineage case id | run namespace drop | trace、lineage、evidence candidate 分开。 |
| audit | audit subject ref;negative audit case id | reset audit spy;run namespace drop | accepted audit positive 与 negative observation 不复用。 |
| impact | version ref;impact case id;truth guard id | reset truth guard;run namespace drop | downstream return 不得成为 truth seed。 |
| stored replay | operation key;source key;job run key;stored surface case id | run namespace drop | command / inbound / job replay key 不交叉复用。 |
| UoW / recovery | operation key;fault case id;commit fault case id | reset UoW fault profile;run namespace drop | present、missing、kind mismatch variants 分开。 |
| job report / checkpoint | job run key;report ref;checkpoint ref;issue ref | run namespace drop | completed、interrupted、partial 和 no-repair job state 分开。 |
| no-repair guard | truth guard id;truth spy case id | reset truth spy;run namespace drop | guard 只证明未写 truth,不定义 repair policy。 |

### 6. 本批停审

| 停审项 | 结论 | 说明 |
|---|---|---|
| 是否覆盖 R6.10 全部 19 条用例 | pass | 每条用例均映射到至少一个可重复数据集。 |
| 是否区分 trace、audit、lineage、impact、evidence、replay、UoW、recovery 和 job 数据 | pass | 各切口均有独立数据集或明确共享基础数据。 |
| 是否区分正向、负向、stored missing、rollback、commit unknown、partial failure 和 no-repair guard | pass | negative / recovery / job failure 均有独立数据集。 |
| 是否有隔离键和清理方式 | pass | 每个数据集均有 run / operation / source / job / guard / fault 级隔离和清理方式。 |
| 是否未使用 raw governance body、event payload、receipt body、report body、artifact body、secret 或 stack trace | pass | 本批只使用 typed refs、safe summaries、formal markers 和 fake store。 |
| 是否未补 stored surface、checkpoint source、report schema、marker source 或 evidence schema | pass | 相关来源只作为正式 source 引用;缺口按 blocker 处理。 |
| 是否未写 config / dependency / redaction / observability 后续批次数据 | pass | 后续批次尚未展开。 |
| 是否未写环境、CI、evidence schema、验收或实施内容 | pass | 仅记录数据设计中间产物。 |
| 是否未修改正式 `05-测试方案.md` | pass | 当前仍只更新中间产物。 |

### 7. R7.11 进入门禁

| 门禁项 | 裁决 |
|---|---|
| R7.10 是否已写入本批测试数据集表 | pass |
| R7.10 是否已写入本批用例到数据集映射 | pass |
| R7.10 是否已写入本批构造 / 隔离 / 清理规则 | pass |
| R7.10 是否已完成本批停审 | pass |
| 是否未写后续批次数据 | pass |
| 是否未修改正式 `05-测试方案.md` | pass |

next_allowed_action: 等待用户确认后进入 Step 7 `R7.11 config / dependency / redaction / observability 数据:先思考`;只允许思考 config/profile/dependency/redaction/metric/trace/marker 数据批次的输入边界、用例范围、数据集候选、构造边界、隔离清理、source gap 和 `R7.12` 写入边界;不得直接修改正式 `05-测试方案.md`;不得写环境矩阵、CI suite、evidence schema、验收标准、实施计划或 implementation code。

---

## R7.11 config / dependency / redaction / observability 数据:先思考

### 1. 当前模块目标

`R7.11` 只思考 Step 6 R6.12 第五批横切用例的数据设计边界,覆盖 config validation、source conflict、forbidden configurable boundary、dependency availability、profile / fixture isolation、secret / raw body redaction、safe diagnostic、metric low-cardinality、trace/span/audit/report body-free、marker copy-only 和 source-missing stop。

当前模块不写最终数据集表、DS 编号行、完整 TC 映射、fixture 路径、config sample 文件、builder 函数、seed 代码、redaction scanner、metric scanner、环境矩阵、CI suite、evidence schema、验收标准或实施计划。`R7.12` 才允许把本批思考转成第五批测试数据集行和用例前置映射。

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm_to_R7.12 |
| 用户确认 | 已确认从 `R7.10` 推进到 `R7.11`。 |
| 当前允许 | 思考本批输入边界、用例范围、config / dependency / redaction / diagnostic / observability / metric / marker 数据集候选、构造边界、隔离清理、source gap 和 R7.12 写入边界。 |
| 当前禁止 | 修改正式 `05-测试方案.md`;写 DS 编号行、完整 TC 映射、cross-case audit / closure 后续内容;写 fixture 路径、config sample 文件、scanner、环境矩阵、CI suite、evidence schema、验收标准、实施计划或 implementation code。 |

### 2. 本批用例范围

| 用例族 | 用例 ID | 数据设计关注点 |
|---|---|---|
| config validation | `TC-ML-CONFIG-001~004` | 高优先级非法值、重复 key、forbidden boundary override、config center / admin override watch-only。 |
| profile isolation | `TC-ML-CONFIG-005` | production-like / staging-like 不得引用 test fixture、fake adapter 或 raw replay body。 |
| dependency availability | `TC-ML-DEPENDENCY-001~003` | required missing fail-fast;optional unavailable / target failed 复制正式 marker,不 fake fallback、不回滚 truth。 |
| redaction | `TC-ML-REDACTION-001~003` | config/env/job input、adapter output、report/generated artifact 不含 raw secret/body/full sensitive ref。 |
| diagnostic | `TC-ML-DIAGNOSTIC-001` | safe diagnostic 只作为 issue/ref 输出,不得成为 accepted / replay / checkpoint / recovery truth。 |
| metric / observability | `TC-ML-METRIC-001`;`TC-ML-OBSERVABILITY-001~002` | metric label 低基数;trace/span/audit/operations fact/report body-free 且不伪造 accepted fact。 |
| marker source | `TC-ML-MARKER-001~002` | public degraded / unavailable marker copy-only;source missing 时停审或 formal safe failure。 |

本批不覆盖 cross-case audit、最终覆盖闭环、环境矩阵、CI suite、evidence schema、验收标准或实施计划。R7.11 只处理数据前置思考,不定义具体 config key/default/profile schema、secret provider、metric schema、log field schema、artifact path 或 scanner 命令。

### 3. 正式输入约束思考

| 输入 | 对本批数据的约束 | 禁止由数据设计补口 |
|---|---|---|
| `04-配置设计.md` §4 / §5 | 数据必须表达 source priority、冲突处理、forbidden configurable boundary、watch-only source 和 no silent fallback。 | 不能新增 config key、default、profile enum、hot reload、admin override 或 remote config success path。 |
| `04-配置设计.md` §6 / §8 | 数据必须表达 profile isolation、opaque sensitive ref、secret/body 禁输、redacted digest 和 safe output。 | 不能写真实 secret、真实 endpoint、真实 DSN、真实 provider response 或 secret provider schema。 |
| `04-配置设计.md` §9 / §11 | 数据必须表达 fail-fast、fail-closed、rejected、degraded、failed marker、no activation 和 safe issue。 | 不能把 invalid config 降级成成功启动,不能由配置层合成 marker。 |
| `03-详细设计.md` §13 / §14 / §15 | 数据必须保护 config 不改语义、observability body-free、low-cardinality metric、source-missing stop。 | 不能新增 DTO/schema/port/mapper/marker source/log field/metric schema/evidence schema。 |
| Step 6 R6.12 | 已固定 17 条候选用例的前置、操作、预期和断言。 | Step 7 不新增 TC、不改断言、不把 evidence candidate 扩成正式 evidence artifact。 |

### 4. 数据集候选思考

| 候选数据族 | 目标 | 后续 R7.12 可能写入 |
|---|---|---|
| config source conflict | 合法 lower-priority base + 非法 high-priority override、重复 key / legacy alias 并存。 | config validation negative data。 |
| forbidden boundary override | query write、stored replay disable、state transition override、marker synthesis config attempt。 | config redline data。 |
| watch-only / unsupported source | P0 profile 中 remote config center / admin live override / hot reload candidate。 | unsupported source data。 |
| profile contamination | production-like / staging-like 引用 test fixture、fake adapter、raw replay body。 | profile isolation negative data。 |
| dependency missing / unavailable | required store/resolver missing、optional read/resolver unavailable、publisher/handoff target failed。 | dependency availability and target failure data。 |
| secret / raw body redaction | dummy password/token/DSN/endpoint body/payload body/provider error/report body corpus。 | redaction negative corpus;only dummy values。 |
| safe diagnostic | safe issue/ref、redacted digest、diagnostic sink unavailable variants。 | diagnostic safe surface data。 |
| metric / trace capture | safe label candidate、unsafe high-cardinality label candidate、trace/span safe refs candidate。 | metric / observability capture data。 |
| marker source guard | formal marker source present、source missing、synthetic marker attempt variants。 | marker copy-only and source-missing data。 |

### 5. 构造方式边界思考

| 数据类型 | 允许构造 | 禁止构造 |
|---|---|---|
| config sample fixture | 合法 / 非法 source chain、重复 key、unsupported source、forbidden boundary attempt 的最小样本。 | 真实 key 文件路径、真实 secret、真实 endpoint、产品绑定、热更新契约或 migration schema。 |
| profile fixture | local / ci / integration / operations-replay / production-like 的污染检测输入。 | production-like 成功使用 fake / fixture / raw replay body。 |
| dependency fake | required missing、optional unavailable、publisher/handoff failed 的 formal availability / failed marker source。 | fake fallback 到无关 adapter、raw adapter error 作为 public marker、delivery proves truth。 |
| redaction corpus | dummy raw secret/body/provider error/report body 负向语料,只用于 safe-output 检测。 | 使用真实 secret、真实 provider payload、真实 report body 或 full sensitive ref。 |
| metric / trace capture | low-cardinality label candidate、safe correlation ref candidate、unsafe label/body negative candidate。 | 定义正式 metric name/schema、trace backend、dashboard、threshold 或 sampling policy。 |
| marker guard | formal marker source present / missing / synthetic attempt 的审查输入。 | 从 route、raw ID、private map、test helper、metric/log、HTTP code 合成正式 marker。 |

### 6. 隔离与清理思考

| 主题 | 本批要求 |
|---|---|
| run 隔离 | config samples、dependency fakes、redaction corpus、metric/trace capture、marker guard 均归入 `test_run_ref`。 |
| source 隔离 | config source conflict、unsupported source、forbidden boundary attempt、profile contamination 分开。 |
| dependency 隔离 | required missing、optional unavailable、publisher failed、handoff failed 和 diagnostic sink unavailable 分开。 |
| redaction 隔离 | dummy secret/body/provider error/report body corpus 与 safe output corpus 分开,且不得复用真实材料。 |
| observability 隔离 | safe metric label candidate 与 unsafe high-cardinality candidate 分开;trace/span/audit/report safe corpus 单独准备。 |
| marker 隔离 | formal marker source present、source missing、synthetic attempt 分开,避免一条数据同时证明 copy-only 和 source-missing。 |
| 清理方式 | config sample namespace drop;dependency fake reset;redaction dummy corpus delete;metric/trace capture reset;marker guard reset。 |

### 7. source gap 与停审风险

| 风险 | 判断 | 处理 |
|---|---|---|
| config key / profile schema 未闭合 | Step 7 不能发明正式 key/default/profile enum。 | R7.12 只能写样本类别和验证目标;具体 schema 回 `04` owning source。 |
| secret provider / endpoint 格式未闭合 | 测试数据不能使用真实 secret provider 或 endpoint body。 | 只用 opaque ref / dummy raw value;provider schema 留 future owner。 |
| marker source 不闭合 | degraded / unavailable / failed marker 不能由 fixture 合成。 | 只引用 formal resolver / mapper / availability source;缺口记录 source-missing stop。 |
| diagnostic / metric / log schema 被提前定义 | Step 7 不能固定日志字段、metric name、span payload 或 report schema。 | 只准备 safe / unsafe corpus;正式 schema 留 Step 9 / Step 13 或 observability owner。 |
| dependency fake 与 production-like 混淆 | fake 可用于 local/ci/control seam,不能证明 production readiness。 | R7.12 必须把 profile contamination 作为负向数据独立写。 |
| redaction corpus 污染 evidence | dummy leak corpus 不能进入正式 evidence body 或 report body。 | 只作为负向扫描输入;artifact path/schema 留 Step 13。 |

### 8. R7.12 写入边界

R7.12 可以写入:

1. 本批测试数据集表,只覆盖 config / dependency / redaction / diagnostic / metric / observability / marker。
2. 本批用例到数据集的前置映射表。
3. 本批 fixture / seed / fake / corpus / capture / guard 规则。
4. 本批隔离清理规则。
5. 本批 stop-review 和 R7.13 进入门禁。

R7.12 禁止写入:

1. cross-case audit / final coverage closure / Step 7 总审计等后续内容。
2. fixture 文件路径、config sample 文件名、builder 函数名、seed 代码、scanner 命令。
3. 环境矩阵、CI suite、evidence schema、验收标准、实施计划或 implementation code。
4. 正式 `05-测试方案.md` 正文。
5. 任何未在 `03/04` 闭合的 config key、profile schema、secret provider、availability marker、diagnostic sink、metric schema、log field schema、redaction rule schema、artifact path、evidence schema 或 phase boundary。

### 9. R7.11 stop-review

| 检查项 | 结果 |
|---|---|
| 是否只思考 config / dependency / redaction / observability 数据批次 | pass |
| 是否覆盖 R6.12 的 17 条用例范围 | pass |
| 是否识别 config、dependency、redaction、diagnostic、metric、observability 和 marker 数据候选 | pass |
| 是否明确 fixture / fake / corpus / capture / guard 的边界 | pass |
| 是否明确隔离清理和敏感数据红线 | pass |
| 是否识别 config schema、secret provider、marker source、metric/log schema 和 redaction corpus 风险 | pass |
| 是否未写 DS 编号行、完整 TC 映射、cross-case audit 后续内容、环境、CI、evidence、验收或实施内容 | pass |
| 是否未修改正式 `05-测试方案.md` | pass |

next_allowed_action: 等待用户确认后进入 Step 7 `R7.12 config / dependency / redaction / observability 数据:再写入`;只允许写入本批测试数据集表、本批用例到数据集前置映射、本批 fixture / seed / fake / corpus / capture / guard 规则、本批隔离清理规则、本批 stop-review 和 R7.13 进入门禁;不得直接修改正式 `05-测试方案.md`;不得写 cross-case audit / final coverage closure 后续内容;不得写环境矩阵、CI suite、evidence schema、验收标准、实施计划或 implementation code。

---

## R7.12 config / dependency / redaction / observability 数据:再写入

### 1. 当前模块状态

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm_to_R7.13 |
| 用户确认 | 已确认从 `R7.11` 推进到 `R7.12`。 |
| 本模块写入范围 | 本批测试数据集表、本批用例到数据集前置映射、本批 fixture / seed / fake / corpus / capture / guard 规则、本批隔离清理规则、本批 stop-review 和 R7.13 进入门禁。 |
| 本模块禁止范围 | 正式 `05-测试方案.md` 正文、cross-case audit / final coverage closure / Step 7 总审计等后续内容、fixture 路径、config sample 文件名、builder 函数、seed 代码、scanner 命令、环境矩阵、CI suite、evidence schema、验收标准、实施计划和 implementation code。 |

### 2. 本批测试数据集表

| 数据集 | 用途 | 构造方式 | 隔离键 | 清理方式 | 关联用例 |
|---|---|---|---|---|---|
| DS-ML-CONFIG-001 | 高优先级非法配置 fail-fast / rejected。 | legal lower-priority baseline + illegal env / entry-local override sample,只表达 source family 和 issue class。 | `test_run_ref`;config source case id;profile id。 | drop config sample namespace。 | TC-ML-CONFIG-001 |
| DS-ML-CONFIG-002 | 单文件重复 key 不采用 last-write-wins。 | duplicate key / alias / legacy key conflict sample,不定义正式 key schema。 | `test_run_ref`;config file case id;conflict class。 | drop config sample namespace。 | TC-ML-CONFIG-002 |
| DS-ML-CONFIG-003 | forbidden configurable boundary 不可覆盖语义。 | query write / stored replay disable / state transition / marker synthesis override attempt samples。 | `test_run_ref`;forbidden boundary case id。 | drop config sample namespace。 | TC-ML-CONFIG-003 |
| DS-ML-CONFIG-004 | config center / admin override 不进入 P0。 | remote config center / admin live override / hot reload watch-only source sample。 | `test_run_ref`;unsupported source case id。 | drop config sample namespace。 | TC-ML-CONFIG-004 |
| DS-ML-CONFIG-005 | profile fixture 不污染 production-like。 | production-like / staging-like profile contamination sample with test fixture、fake adapter、raw replay body dummy ref。 | `test_run_ref`;profile case id;fixture pollution id。 | delete isolated profile fixture;drop config sample namespace。 | TC-ML-CONFIG-005 |
| DS-ML-DEPENDENCY-001 | required store / adapter binding missing fail-fast。 | required repository / material store / resolver binding missing or invalid fake registry state。 | `test_run_ref`;adapter slot case id;runtime builder case id。 | reset dependency registry fake。 | TC-ML-DEPENDENCY-001 |
| DS-ML-DEPENDENCY-002 | optional read / resolver unavailable 返回正式 marker。 | optional read material stale、resolver unavailable、diagnostic sink unavailable marker source variants。 | `test_run_ref`;dependency case id;marker source ref。 | reset dependency fake;run namespace drop。 | TC-ML-DEPENDENCY-002 |
| DS-ML-DEPENDENCY-003 | publisher / handoff target failed 不回滚 truth。 | publisher / handoff target failed marker source + accepted truth / stored result guard seed。 | `test_run_ref`;target case id;truth guard id。 | reset target fake;reset truth guard;run namespace drop。 | TC-ML-DEPENDENCY-003 |
| DS-ML-REDACTION-001 | ordinary config / env 禁 raw secret / raw body。 | dummy password/token/DSN/endpoint body/payload body input corpus。 | `test_run_ref`;redaction corpus id;source case id。 | delete isolated dummy corpus。 | TC-ML-REDACTION-001 |
| DS-ML-REDACTION-002 | adapter raw error / provider response 必须 redacted。 | dummy HTTP/SQL/provider error body from resolver / publisher / handoff / job failure fake。 | `test_run_ref`;adapter error corpus id;failure case id。 | delete isolated dummy corpus;reset adapter fake。 | TC-ML-REDACTION-002 |
| DS-ML-REDACTION-003 | report / generated artifact 不含 raw config 或 package body。 | safe report summary corpus + dummy raw config/package/external response/evidence body leak corpus。 | `test_run_ref`;report corpus id;leak corpus id。 | delete isolated dummy corpus;run namespace drop。 | TC-ML-REDACTION-003 |
| DS-ML-DIAGNOSTIC-001 | diagnostic safe surface 不作为 recovery truth。 | safe issue/ref/redacted digest seed + recovery source guard showing diagnostic text is non-proof。 | `test_run_ref`;diagnostic case id;recovery guard id。 | reset diagnostic fake;run namespace drop。 | TC-ML-DIAGNOSTIC-001 |
| DS-ML-METRIC-001 | metric labels 保持低基数。 | safe label candidate and unsafe high-cardinality label candidate corpus。 | `test_run_ref`;metric capture case id。 | reset metric capture。 | TC-ML-METRIC-001 |
| DS-ML-OBS-001 | trace/span 只记录 correlation refs 和 safe marker。 | trace/span capture seed with operation context refs、stored surface refs、candidate/outcome/report/checkpoint refs、safe marker refs。 | `test_run_ref`;trace capture case id。 | reset trace capture。 | TC-ML-OBSERVABILITY-001 |
| DS-ML-OBS-002 | audit / operations fact body-free 且不伪造 accepted fact。 | accepted/rejected/duplicate/query/job/publication/handoff branch observation corpus with audit/operations fact guard。 | `test_run_ref`;observability case id;audit guard id。 | reset audit/operations capture;run namespace drop。 | TC-ML-OBSERVABILITY-002 |
| DS-ML-MARKER-001 | public degraded / unavailable marker copy-only。 | formal resolver / mapper / availability marker source present variants。 | `test_run_ref`;marker source ref;marker case id。 | run namespace drop。 | TC-ML-MARKER-001 |
| DS-ML-MARKER-002 | source-missing stop 不由 fixture 私补。 | marker/source/mapper/port/schema missing or unreadable review input + synthetic marker attempt sample。 | `test_run_ref`;source-missing case id;synthetic attempt id。 | delete synthetic attempt sample;run namespace drop。 | TC-ML-MARKER-002 |

### 3. 本批用例到数据集前置映射

| 用例 ID | 数据集 | fixture / builder / seed | fake / stub / real-like | 清理方式 |
|---|---|---|---|---|
| TC-ML-CONFIG-001 | DS-ML-RUN-001;DS-ML-CONFIG-001 | source conflict config sample | config validator fake | drop config namespace |
| TC-ML-CONFIG-002 | DS-ML-RUN-001;DS-ML-CONFIG-002 | duplicate key / alias conflict sample | config loader fake | drop config namespace |
| TC-ML-CONFIG-003 | DS-ML-RUN-001;DS-ML-CONFIG-003 | forbidden boundary override sample | config validator / runtime builder fake | drop config namespace |
| TC-ML-CONFIG-004 | DS-ML-RUN-001;DS-ML-CONFIG-004 | watch-only unsupported source sample | config source chain fake | drop config namespace |
| TC-ML-CONFIG-005 | DS-ML-RUN-001;DS-ML-CONFIG-005;DS-ML-REDACTION-001 | production-like fixture contamination sample | profile validator fake | delete isolated fixture;drop config namespace |
| TC-ML-DEPENDENCY-001 | DS-ML-RUN-001;DS-ML-DEPENDENCY-001 | required binding missing fake registry state | runtime builder / adapter registry fake | reset dependency registry |
| TC-ML-DEPENDENCY-002 | DS-ML-RUN-001;DS-ML-DEPENDENCY-002;DS-ML-MARKER-001 | optional unavailable marker source variants | resolver/read/diagnostic dependency fake | reset dependency fake;run namespace drop |
| TC-ML-DEPENDENCY-003 | DS-ML-RUN-001;DS-ML-DEPENDENCY-003 | target failed marker + truth guard | publisher/handoff target fake | reset target fake;reset truth guard |
| TC-ML-REDACTION-001 | DS-ML-RUN-001;DS-ML-REDACTION-001 | dummy secret/body input corpus | config/env/job input validator fake | delete isolated corpus |
| TC-ML-REDACTION-002 | DS-ML-RUN-001;DS-ML-REDACTION-002 | dummy adapter raw error corpus | resolver/publisher/handoff/job adapter fake | delete isolated corpus;reset adapter fake |
| TC-ML-REDACTION-003 | DS-ML-RUN-001;DS-ML-REDACTION-003 | safe report corpus + dummy leak corpus | report generator fake / body-free checker candidate | delete isolated corpus;run namespace drop |
| TC-ML-DIAGNOSTIC-001 | DS-ML-RUN-001;DS-ML-DIAGNOSTIC-001 | safe diagnostic seed + recovery guard | diagnostic sink fake / recovery source fake | reset diagnostic fake;run namespace drop |
| TC-ML-METRIC-001 | DS-ML-RUN-001;DS-ML-METRIC-001 | safe/unsafe metric label candidate corpus | metric capture fake | reset metric capture |
| TC-ML-OBSERVABILITY-001 | DS-ML-RUN-001;DS-ML-OBS-001 | trace/span safe ref capture seed | trace capture fake | reset trace capture |
| TC-ML-OBSERVABILITY-002 | DS-ML-RUN-001;DS-ML-OBS-002;DS-ML-AUDIT-002 | audit/operations fact body-free corpus | audit/operations capture fake | reset capture;run namespace drop |
| TC-ML-MARKER-001 | DS-ML-RUN-001;DS-ML-MARKER-001 | formal marker source present variants | resolver/mapper/availability fake | run namespace drop |
| TC-ML-MARKER-002 | DS-ML-RUN-001;DS-ML-MARKER-002 | source missing + synthetic attempt review input | design gate / marker guard fake | delete synthetic attempt sample;run namespace drop |

### 4. 本批构造规则

| 规则 | 本批口径 |
|---|---|
| config samples | 只表达 source family、issue class、profile case 和 forbidden boundary attempt;不定义正式 key、default、profile enum、file path 或 migration schema。 |
| profile isolation | fake / fixture / replay root 只用于 local / ci / controlled / operations-replay 数据;production-like contamination 必须作为负向数据。 |
| dependency fake | required missing 与 optional unavailable 分开;optional unavailable 只能复制 formal marker source,不能 fallback 或合成 marker。 |
| redaction corpus | 所有 secret/body/error/report leak 样本均为 dummy corpus;不得使用真实 secret、endpoint、provider response、report body 或 full sensitive ref。 |
| diagnostic | diagnostic 只承载 safe issue/ref/redacted digest;不得作为 accepted、stored replay、checkpoint、recovery 或 publication truth。 |
| metric / observability | 数据只准备 safe/unsafe capture corpus;不定义正式 metric name、log field schema、span payload schema、dashboard 或 threshold。 |
| marker source | formal marker source present、source missing、synthetic attempt 必须分开;缺 source 时只允许 stop / safe failure,不得由 fixture 私补。 |

### 5. 本批隔离与清理规则

| 数据类型 | 隔离键 | 清理方式 | 注意事项 |
|---|---|---|---|
| config sample | config source case id;profile id;forbidden boundary case id | drop config sample namespace | 不写真实 config 文件路径。 |
| dependency fake | adapter slot case id;dependency case id;target case id | reset dependency / target fake | required missing 与 optional unavailable 分开。 |
| redaction corpus | redaction corpus id;leak corpus id;failure case id | delete isolated dummy corpus | corpus 只含 dummy value。 |
| diagnostic | diagnostic case id;recovery guard id | reset diagnostic fake;run namespace drop | diagnostic 不作为 recovery proof。 |
| metric / trace capture | metric capture case id;trace capture case id;observability case id | reset metric/trace/audit capture | safe / unsafe capture 分开。 |
| marker guard | marker source ref;source-missing case id;synthetic attempt id | delete synthetic attempt sample;run namespace drop | marker copy-only 与 source-missing 分开。 |

### 6. 本批停审

| 停审项 | 结论 | 说明 |
|---|---|---|
| 是否覆盖 R6.12 全部 17 条用例 | pass | 每条用例均映射到至少一个可重复数据集。 |
| 是否区分 config、dependency、redaction、diagnostic、metric、observability 和 marker 数据 | pass | 各切口均有独立数据集或明确共享基础数据。 |
| 是否区分 source conflict、forbidden override、profile contamination、dependency unavailable、dummy leak、unsafe metric 和 source-missing | pass | 负向和边界数据均独立。 |
| 是否有隔离键和清理方式 | pass | 每个数据集均有 run / source / profile / dependency / corpus / capture / marker 级隔离和清理方式。 |
| 是否未使用真实 secret、endpoint、DSN、provider response、report body、metric backend 或 trace backend | pass | 本批只使用 dummy corpus、fake dependency、safe refs 和 capture candidate。 |
| 是否未补 config key、profile schema、secret provider、metric schema、log schema、marker source 或 evidence schema | pass | 相关内容只作为正式来源引用;缺口按 blocker 处理。 |
| 是否未写 cross-case audit / final closure 后续内容 | pass | Step 7 总审计留 R7.13/R7.14。 |
| 是否未写环境、CI、evidence schema、验收或实施内容 | pass | 仅记录数据设计中间产物。 |
| 是否未修改正式 `05-测试方案.md` | pass | 当前仍只更新中间产物。 |

### 7. R7.13 进入门禁

| 门禁项 | 裁决 |
|---|---|
| R7.12 是否已写入本批测试数据集表 | pass |
| R7.12 是否已写入本批用例到数据集映射 | pass |
| R7.12 是否已写入本批构造 / 隔离 / 清理规则 | pass |
| R7.12 是否已完成本批停审 | pass |
| 是否未写 cross-case audit / final closure 后续内容 | pass |
| 是否未修改正式 `05-测试方案.md` | pass |

next_allowed_action: 等待用户确认后进入 Step 7 `R7.13 cross-data audit / closure 数据:先思考`;只允许思考 Step 7 已写数据集的跨数据污染、清理缺失、fixture 重复、替身不一致、source gap、用例映射缺口、命名冲突和 `R7.14` 总停审 / Step 8 进入门禁;不得直接修改正式 `05-测试方案.md`;不得写环境矩阵、CI suite、evidence schema、验收标准、实施计划或 implementation code。

---

## R7.13 cross-data audit / closure 数据:先思考

### 1. 当前模块目标

`R7.13` 只思考 Step 7 已写测试数据全集的跨数据审计和收尾闭合方式,为 `R7.14` 的最终写入做准备。审计对象仅限 R7.4、R7.6、R7.8、R7.10、R7.12 已写入的数据集、用例前置映射、构造规则、隔离清理规则和批次停审记录。

当前模块不写最终跨数据隔离 / 清理审计表,不宣布 Step 7 completed,不进入 Step 8,不写环境矩阵、CI suite、evidence schema、验收标准、实施计划或正式 `05-测试方案.md`。

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm_to_R7.14 |
| 用户确认 | 已确认从 `R7.12` 推进到 `R7.13`。 |
| 当前允许 | 思考跨数据污染、清理缺失、fixture 重复、替身不一致、source gap、TC-to-DS 映射缺口、DS 命名冲突、R7.14 总停审和 Step 8 进入门禁。 |
| 当前禁止 | 修改正式 `05-测试方案.md`;写最终审计结论表;写 Step 8 环境矩阵、Step 9 CI suite、Step 13 evidence schema、验收标准、实施计划或 implementation code。 |

### 2. 已写数据批次回顾

| 批次 | 已写数据族 | R7.13 审计关注 |
|---|---|---|
| R7.4 | run、definition、body-free、boundary、catalog、query、pollution | 共享 `DS-ML-RUN-001` 是否只承载 run 壳;catalog / query / pollution 是否未反向定义 truth。 |
| R7.6 | formalization、version、state、idempotency、recovery | duplicate replay / conflict / recovery 数据是否与 later replay / UoW 数据命名不冲突。 |
| R7.8 | consumption、query、boundary、distribution、publisher、handoff、availability、shell | downstream / handoff 数据是否只证明边界,不把外部状态写成本仓 truth。 |
| R7.10 | trace、audit、lineage、impact、evidence、replay、UoW、recovery、job | trace / audit / evidence / report 候选是否保持 body-free,不提前定义 evidence schema。 |
| R7.12 | config、dependency、redaction、diagnostic、metric、observability、marker | redaction dummy corpus、metric/trace capture、marker source guard 是否与真实 secret / marker source 隔离。 |

### 3. 跨数据污染审计思考

`R7.14` 需要检查每个数据集是否只证明自己的测试切口,不会借共享数据掩盖断言。

| 审计维度 | 需要检查的问题 | 预期处理口径 |
|---|---|---|
| happy-path 与 negative 混用 | 边界、异常、并发、恢复、source-missing 数据是否误用 happy-path 数据集。 | 负向 / 边界 / 恢复数据必须独立编号或明确只共享 `DS-ML-RUN-001`。 |
| old material 污染 | `DS-ML-POLLUTION-001` 是否只作为旧口径污染扫描输入。 | 不得进入 definition truth、catalog material、report truth 或 evidence truth。 |
| redaction corpus 污染 | dummy raw secret/body/provider error/report leak corpus 是否只用于 redaction negative。 | 不得被 trace、audit、metric、evidence、report 或 diagnostic 正向数据复用。 |
| downstream truth 污染 | publisher/handoff/outcome target 数据是否被误当作 Method Library truth。 | 下游数据只能证明边界、target failed / delivered marker 或 handoff outcome。 |
| diagnostic 污染 | safe diagnostic issue/ref 是否被误当作 accepted / replay / recovery proof。 | diagnostic 只能作为 safe surface,不能成为 stored surface 或 recovery source。 |
| observability 污染 | metric/trace/audit capture corpus 是否携带 raw body 或 high-cardinality truth。 | capture 数据只能保留 safe refs、safe marker、low-cardinality label candidate。 |

### 4. 清理缺失审计思考

`R7.14` 需要确认没有“人工清理”“临时删库”“靠测试顺序覆盖”的数据策略。

| 数据类型 | 需要确认的清理方式 | 风险点 |
|---|---|---|
| fake / in-memory truth | run namespace drop。 | 多个 DS 共享同一 method ref 时可能泄漏 previous state。 |
| operation / replay / idempotency | operation key / source key / job run key 分区后 drop。 | duplicate 与 conflict 数据复用 key 会掩盖 digest 差异。 |
| fault profile | reset UoW / resolver / publisher / handoff / dependency fake。 | fault case 未 reset 会污染后续正向用例。 |
| config sample | drop config sample namespace。 | profile / source conflict 样本若复用会混淆 source priority。 |
| dummy leak corpus | delete isolated dummy corpus。 | redaction corpus 若进入 report/evidence 输出会形成二次污染。 |
| metric / trace / audit capture | reset capture sink。 | capture sink 未 reset 会产生跨用例低基数误判。 |

### 5. fixture 重复与构造一致性思考

`R7.14` 需要避免同一种前置条件被多个 fixture 名义重复表达,也要避免一个 fixture 承载过多互斥语义。

| 检查对象 | 需要检查的问题 | 可能的修正方式 |
|---|---|---|
| definition / catalog data | `DS-ML-DEF-*`、`DS-ML-CATALOG-*` 是否重复构造同一合法 definition。 | 合并为共享正向 dataset,负向 dataset 独立保留。 |
| query data | `DS-ML-QUERY-001~003` 是否分别对应 definition catalog query、consumption query、boundary query。 | 若语义不同则保留,但在 R7.14 说明 family 内编号用途。 |
| recovery data | `DS-ML-RECOVERY-001~004` 是否跨 R7.6 / R7.10 语义连续且无重复。 | 保留编号连续性,明确 command recovery 与 UoW/job recovery 的切分。 |
| audit / observability data | `DS-ML-AUDIT-*` 与 `DS-ML-OBS-*` 是否重复证明 body-free。 | audit 数据证明业务审计;obs 数据证明 capture surface,不可混用。 |
| marker data | `DS-ML-MARKER-*` 与 dependency availability marker 数据是否重复。 | marker dataset 保留 copy-only/source-missing 规则,dependency dataset 引用 marker source。 |

### 6. fake / stub / real-like 替身一致性思考

Step 7 只能固定测试数据协作方式,不能定义 Step 8 环境矩阵。`R7.14` 仍需审计每类替身是否一致。

| 替身类别 | R7.14 需要核对 | 不允许的结果 |
|---|---|---|
| repository / store fake | 是否只承载正式 truth / support state / stored surface。 | 用 private fake map 补 schema、marker、state 或 query repair。 |
| resolver / mapper fake | 是否只返回正式 marker/source summary。 | 从 route、raw ID、HTTP code、log 或 metric 合成 public marker。 |
| publisher / handoff target fake | 是否只证明 target outcome / failed marker / no rollback。 | 把 delivered / failed target 反写为本仓 truth。 |
| config validator fake | 是否只消费 config sample 和 source priority case。 | 定义正式 config key、profile enum、hot reload 或 admin override 成功路径。 |
| metric / trace / audit capture fake | 是否只捕获 safe refs 和 safe marker。 | 固定正式 metric schema、dashboard、span payload 或 evidence artifact path。 |

### 7. source gap 审计思考

`R7.14` 必须把 source gap 分成“Step 7 已阻断补口”和“可进入后续 Step 8~13 的自然后移”,不能把后移内容伪装成已闭合。

| 缺口类型 | R7.14 判断口径 |
|---|---|
| object / DTO / state / port / mapper 缺口 | 若数据集需要此类来源但 `03` 未闭合,Step 7 必须记录 source-missing stop,不得用 fixture 私补。 |
| config key / profile schema 缺口 | 若 `04` 未闭合,Step 7 只保留 sample 类别和验证目标,不写正式 key/default。 |
| marker source 缺口 | degraded / unavailable / failed / redaction marker 必须来自正式 resolver / mapper / availability source;缺失即停审。 |
| evidence / artifact schema 缺口 | Step 7 不定义 evidence JSON、artifact path、report schema;自然后移到 Step 13。 |
| environment / CI 缺口 | Step 7 不定义执行环境、suite、脚本、gate;自然后移到 Step 8 / Step 9。 |

### 8. TC-to-DS 映射与命名冲突思考

`R7.14` 需要对 Step 6 的 83 条候选用例逐条检查是否能回指可重复生成的数据集,并检查 DS 命名是否稳定。

| 审计项 | 需要确认 |
|---|---|
| P0 用例映射 | 每个 `TC-ML-*` 至少有 `DS-ML-RUN-001` 加一个业务 / 边界 / 故障 / corpus / marker 数据集,或明确无额外数据前置。 |
| 大范围映射 | `TC-ML-*~*` 范围不能掩盖单条用例缺数据;R7.14 需要以 Step 6 用例全集核对。 |
| DS family 唯一性 | family 名必须对应 Step 6 用例族或共享基础族,不得混用 `SHELL`、`BOUNDARY`、`QUERY` 的语义。 |
| 编号冲突 | 同一 DS 编号只能定义一次;跨映射重复引用允许,重复定义不允许。 |
| shared run data | `DS-ML-RUN-001` 只能作为 deterministic run / actor / clock / namespace 壳,不能承载业务事实。 |

### 9. R7.14 写入边界

R7.14 可以写入:

1. Step 7 跨数据隔离 / 清理审计表。
2. Step 7 fixture / builder / seed / fake / corpus / fault profile 总审计表。
3. Step 7 TC-to-DS 覆盖闭合表或缺口表。
4. Step 7 DS 命名 / source gap / forbidden supplement 总审计。
5. Step 7 completed stop-review 和 Step 8 进入门禁。

R7.14 禁止写入:

1. Step 8 环境矩阵、依赖服务矩阵、profile 执行矩阵或环境拓扑。
2. Step 9 自动化 suite、CI gate、脚本、artifact 输出或 report 输出。
3. Step 13 evidence schema、artifact path、run-scoped report schema 或 JSON 字段。
4. Step 12 验收进入 / 退出准则、release verdict 或实施 gate。
5. 正式 `05-测试方案.md` 正文、implementation code 或新 schema / port / state / mapper / config key / marker source。

### 10. R7.13 stop-review

| 检查项 | 结果 |
|---|---|
| 是否只思考 Step 7 数据全集的跨数据审计和闭合方式 | pass |
| 是否覆盖污染、清理、fixture 重复、替身一致性、source gap、TC-to-DS 映射和命名冲突 | pass |
| 是否只规划 R7.14 写入边界,未写最终审计结论表 | pass |
| 是否未宣布 Step 7 completed 或进入 Step 8 | pass |
| 是否未写环境矩阵、CI suite、evidence schema、验收或实施内容 | pass |
| 是否未修改正式 `05-测试方案.md` | pass |

next_allowed_action: 等待用户确认后进入 Step 7 `R7.14 cross-data audit / closure 数据:再写入`;只允许写入 Step 7 跨数据隔离 / 清理审计表、fixture / builder / seed / fake / corpus / fault profile 总审计表、TC-to-DS 覆盖闭合表或缺口表、DS 命名 / source gap / forbidden supplement 总审计、Step 7 completed stop-review 和 Step 8 进入门禁;不得直接修改正式 `05-测试方案.md`;不得写 Step 8 环境矩阵、Step 9 CI suite、Step 13 evidence schema、验收标准、实施计划或 implementation code。

---

## R7.14 cross-data audit / closure 数据:再写入

### 1. 当前模块状态

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm_to_R8.1 |
| 用户确认 | 已确认从 `R7.13` 推进到 `R7.14`。 |
| 本模块写入范围 | Step 7 跨数据隔离 / 清理审计表、fixture / builder / seed / fake / corpus / fault profile 总审计表、TC-to-DS 覆盖闭合表、DS 命名 / source gap / forbidden supplement 总审计、Step 7 completed stop-review 和 Step 8 进入门禁。 |
| 本模块禁止范围 | 正式 `05-测试方案.md` 正文、Step 8 环境矩阵、Step 9 CI suite、Step 13 evidence schema、验收标准、实施计划和 implementation code。 |

### 2. 数据全集规模

| 项 | 结果 | 说明 |
|---|---:|---|
| 唯一 DS 定义 | 81 | R7.4 / R7.6 / R7.8 / R7.10 / R7.12 共写入 81 个唯一 `DS-ML-*` 数据集定义。 |
| 唯一 TC 映射 | 83 | Step 7 已映射 Step 6 的 83 条唯一 `TC-ML-*` 候选用例。 |
| 共享基础数据 | 1 | `DS-ML-RUN-001` 只作为 run namespace、fixed clock、scoped id、actor / operation context 壳。 |
| 批次停审 | 5 | 五个数据批次均已写入本批数据表、TC 映射、构造规则、隔离清理和 stop-review。 |

### 3. 跨数据隔离 / 清理审计表

| 审计项 | 结论 | 缺口 / 修正 |
|---|---|---|
| run namespace 隔离 | pass | 所有 DS 均可归入 `test_run_ref` 或等价 run namespace;`DS-ML-RUN-001` 不承载业务事实。 |
| operation / source / job key 隔离 | pass | command、inbound replay、idempotency、UoW、job、publisher、handoff 数据均有 operation key、source key、job run key 或 target case id。 |
| happy-path 与 negative 分离 | pass | invalid definition、not-formal、retired、stored missing、commit unknown、rollback、source-missing、dummy leak corpus 均独立编号。 |
| old material 污染隔离 | pass | `DS-ML-POLLUTION-001` 和 `DS-ML-DIST-002` 仅作旧 MethodContent / publish / snapshot / fingerprint / old outbox 污染输入。 |
| redaction corpus 隔离 | pass | `DS-ML-BODY-*`、`DS-ML-SHELL-002`、`DS-ML-REDACTION-*` 使用 isolated dummy corpus,不得进入 truth、trace、audit、report 或 evidence body。 |
| fault profile 清理 | pass | UoW、resolver、publisher、handoff、dependency、adapter、metric/trace/audit capture 均声明 reset fault / capture profile。 |
| write spy / truth guard 清理 | pass | query no-write、audit no-write、truth no-repair、side-effect spy 均要求 reset spy 或 run namespace drop。 |
| 人工造数依赖 | pass | 未出现“手工准备”“临时删库”“按测试顺序覆盖”作为数据策略。 |

### 4. fixture / builder / seed / fake / corpus / fault profile 总审计表

| 构造类别 | 覆盖数据族 | 结论 | 缺口 / 修正 |
|---|---|---|---|
| builder | definition、formalization、version、state、impact、safe summary | pass | builder 只构造 `03` 已定义对象 / state / typed ref / safe summary,不新增字段或 marker。 |
| seed | truth、catalog、material、stored surface、trace、audit、lineage、job report | pass | seed 只写 fake / in-memory 正式 truth 或 support state,不写真实 sibling repo 内部状态。 |
| fixture | downstream boundary、old material pollution、config sample、profile contamination、dummy body corpus | pass | fixture 只作为输入样本或污染检测,不反向定义正式 schema / state / config key。 |
| fake / stub | repository、UoW、resolver、publisher、handoff、config validator、metric/trace/audit capture | pass | fake 只复制正式 source 或触发正式 failure branch,不合成 public marker 或补 private map。 |
| corpus | raw body、secret-like value、provider error、report leak、unsafe metric label | pass | 全部为 dummy corpus,不得使用真实 secret、endpoint、DSN、provider response、artifact body 或 report body。 |
| fault profile | commit unknown、version conflict、rollback、target failed、dependency unavailable、stored surface missing | pass | fault profile 只触发已存在 recovery / degraded / failed branch,不以 log/timeout/private flag 作为 proof。 |

### 5. TC-to-DS 覆盖闭合表

| 用例批次 | TC 范围 | TC 数 | DS 覆盖 | 裁决 |
|---|---|---:|---|---|
| definition truth / identity / catalog | `TRUTH` / `IDENTITY` / `CATALOG` / `BOUNDARY-001` / `SHELL-001` / `QUERY-001` / `POLLUTION-001` | 12 | `RUN`、`DEF`、`BODY`、`BOUNDARY`、`CATALOG`、`QUERY`、`POLLUTION` | pass |
| formal version / explicit change / state | `FORMALIZATION` / `VERSION` / `CHANGE` / `STATE` / `IDEMP` / `RECOVERY-001~002` | 15 | `FORMAL`、`VERSION`、`STATE`、`IDEMP`、`RECOVERY-001~002` | pass |
| controlled consumption / distribution / seam | `CONSUMPTION` / `QUERY-002~003` / `BOUNDARY-002~008` / `DISTRIBUTION` / `PUBLISHER` / `HANDOFF` / `AVAILABILITY` / `SHELL-002` | 20 | `CONSUME`、`QUERY`、`BOUNDARY`、`DIST`、`PUBLISHER`、`HANDOFF`、`AVAILABILITY`、`SHELL` | pass |
| traceability / consistency / job / recovery | `TRACE` / `AUDIT` / `LINEAGE` / `IMPACT` / `EVIDENCE` / `REPLAY` / `UOW` / `RECOVERY-003~004` / `JOB` | 19 | `TRACE`、`AUDIT`、`LINEAGE`、`IMPACT`、`EVIDENCE`、`REPLAY`、`UOW`、`RECOVERY-003~004`、`JOB` | pass |
| config / dependency / redaction / observability | `CONFIG` / `DEPENDENCY` / `REDACTION` / `DIAGNOSTIC` / `METRIC` / `OBSERVABILITY` / `MARKER` | 17 | `CONFIG`、`DEPENDENCY`、`REDACTION`、`DIAGNOSTIC`、`METRIC`、`OBS`、`MARKER` | pass |

### 6. DS 命名与重复审计

| 审计项 | 结论 | 缺口 / 修正 |
|---|---|---|
| DS 前缀 | pass | 全部数据集使用 `DS-ML-`。 |
| DS 定义唯一性 | pass | 81 个唯一 DS 定义无重复定义;重复引用只发生在 TC 映射中。 |
| family 语义 | pass | `QUERY-*` 分别对应 catalog query、consumption query、stale/degraded read;`BOUNDARY-*` 分别对应具体跨仓 / 跨面边界。 |
| recovery 编号 | pass | `RECOVERY-001~002` 承接 command/version recovery;`RECOVERY-003~004` 承接 stored surface / job recovery,与 Step 6 修正一致。 |
| shared run 数据 | pass | `DS-ML-RUN-001` 只作为所有批次共享基础壳,不证明业务断言。 |
| old material family | pass | 旧材料只落在 `POLLUTION` / distribution pollution 输入,未进入当前 truth family。 |

### 7. source gap 与 forbidden supplement 总审计

| 缺口类型 | Step 7 裁决 | 后续处理 |
|---|---|---|
| object / DTO / state / port / mapper 缺口 | pass_no_supplement | 数据设计未新增 schema、state、port、mapper 或 stored surface;缺失时只能回 owning `03`。 |
| config key / profile schema 缺口 | pass_no_supplement | Step 7 只写 config sample 类别和 issue class,不定义正式 key、default、profile enum 或 hot reload。 |
| marker source 缺口 | pass_no_supplement | degraded / unavailable / failed / redaction marker 只能复制正式 source;source-missing 使用 `DS-ML-MARKER-002` 停审输入。 |
| environment / CI 缺口 | expected_deferral | 环境、依赖服务、执行位置、脚本、suite、gate 留 Step 8 / Step 9。 |
| evidence / artifact schema 缺口 | expected_deferral | evidence ID、artifact path、JSON schema、run report schema 留 Step 13。 |
| acceptance / implementation boundary 缺口 | expected_deferral | entry/exit、veto、release verdict、commit boundary 留 Step 12、Step 15 之后的 `06/07`。 |

### 8. Step 7 completed stop-review

| 停审项 | 裁决 | 说明 |
|---|---|---|
| 是否完成 Step 7 planned R7.x 模块 | pass | R7.1~R7.14 均已完成。 |
| 是否完成测试数据集表 | pass | 五批共 81 个唯一 DS 定义,覆盖基础、边界、异常、并发、恢复、配置、依赖、观测和 redaction 数据。 |
| 是否完成 TC 到 DS 前置映射 | pass | 83 条唯一 TC 均映射到可重复数据集或共享 run 壳。 |
| 是否完成 fixture / builder / seed / fake / corpus / fault profile 规则 | pass | 构造方式均有正式边界和禁止补口规则。 |
| 是否完成隔离 / 清理审计 | pass | 所有数据族均有 run / operation / source / job / corpus / fault / spy 级隔离和清理方式。 |
| 是否存在数据污染、清理缺失、替身不明确或人工造数依赖 | pass | 未发现阻断 Step 7 closure 的缺口。 |
| 是否未写环境矩阵 / CI suite / evidence schema / 验收 / 实施内容 | pass | 相关内容全部后移到 Step 8 / Step 9 / Step 12 / Step 13 / 后续 `06/07`。 |
| 是否未修改正式 `05-测试方案.md` | pass | 当前仍只更新 `design-calibration/05_test_plan_step_07_test_data.md`。 |

### 9. Step 8 进入门禁

| 门禁项 | 裁决 |
|---|---|
| Step 7 是否已完成数据集、映射、构造规则和总审计 | pass |
| Step 8 是否有明确输入 | pass;承接 Step 1~7、正式 `00`~`04`、SOP Step 8、测试方案书写规范 §5.8。 |
| Step 8 是否仍禁止修改正式 `05-测试方案.md` | pass |
| Step 8 是否仍禁止写 CI suite、evidence schema、验收标准、实施计划或 implementation code | pass |
| 是否等待用户确认后才进入 Step 8 `R8.1 测试环境与配置矩阵:先思考` | pass |

next_allowed_action: 等待用户确认后进入 Step 8 `R8.1 测试环境与配置矩阵:先思考`;只允许创建 / 更新 `design-calibration/05_test_plan_step_08_environment_config.md`,读取 Step 1~7 中间产物、正式 `00`~`04`、SOP Step 8、测试方案书写规范 §5.8,思考测试环境与配置矩阵的输入边界、环境族、依赖类型、测试协作方式、数据策略承接、拓扑边界和 `R8.2 测试环境与配置矩阵:再写入` 边界;不得直接修改正式 `05-测试方案.md`;不得写 Step 9 CI suite、Step 13 evidence schema、验收标准、实施计划或 implementation code。
