# Step 19. 整理正式详细设计文档

> 对应 SOP: `standards/document/详细设计讨论流程_SOP.md` Step 19
> 书写规范: `standards/document/详细设计书写规范.md`
> 回填目标: `projects/L3-method-library/03-详细设计.md`
> 创建日期: 2026-06-24
> 当前模式: full-restart / step19-formal-document-assembly
> 当前状态: completed_wait_user_confirm
> 当前模块: `R19.26 §18 参考与最终闭环:再写入`
> 当前门禁: `R19.26` completed_wait_user_confirm;Step 19 completed;等待确认进入 `04-配置设计.md` full-restart 开工

---

## 0. 文件重置记录

旧 `03_ddd_step_19_formal_document_assembly.md` 曾标记为 `[x] 已确认`,但其内容围绕旧 P0 / P1、13 个 P0 实现模块、旧章节重组、旧正式 `03` 局部迁移、旧 Step 1~18 已确认状态和旧目标实现仓检查展开。该 completed 状态和旧装配结论全部失效。

当前 Step 19 不继承旧正式章节回填映射、旧自检清单、旧“可进入后续文档”判断、旧模块数量、旧 Step 文件名、旧 Command 数量或旧正式 `03` 迁移规则。旧内容只能作为 historical material 和污染审计输入,不得作为当前 L3-method-library formal `03` 装配的正向来源。

当前 Step 19 的唯一正向基线是:

- 当前已完成的 `00-需求文档.md`、`01-架构设计.md`、`02-概要设计.md`。
- 本轮 `03-详细设计` Step 1~18 已确认中间产物。
- 特别是 Step 18 的 formal §17 source map candidate、formal §17 candidate 风险表、formal §17 candidate 待确认事项表、Step 18 completion checklist 和 Step 19 entry gate。
- `详细设计讨论流程_SOP.md` Step 19。
- `详细设计书写规范.md` 18 章主链、正式章节校准来源标注和正式正文边界。
- `设计文档讨论中间产物规范.md` 的回填门禁和三层门禁。
- L1-governance Step 19 只作为框架深度参考,不得复制 governance 领域事实、模块名、协议数量或目标仓路径。

---

## R19.1 开工与必读文档:先思考

### 1. 当前模块目标

`R19.1` 只思考 Step 19 的开工边界、必读文档、Step 1~18 confirmed source map、旧正式 `03` historical material 隔离、formal assembly 门禁和 `R19.2` 写入计划。当前模块不修改正式 `03-详细设计.md`,不写正式章节正文,不跳过 Step 19,不写 04/05/06/07,也不写 implementation artifacts。

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm |
| 用户确认 | 已确认从 Step 18 completed 推进到 Step 19 `R19.1`。 |
| 当前允许 | 思考 Step 19 开工边界、必读文档、Step 1~18 confirmed source map、旧正式 `03` historical material 隔离、正式装配门禁和 R19.2 写入计划。 |
| 当前禁止 | 修改正式 `03-详细设计.md`、写正式章节正文、进入下游 04/05/06/07、写正式实施计划、phase / commit boundary、implementation ledger、evidence schema、CI command、acceptance gate 或 implementation code。 |

### 2. Step 19 开工边界思考

Step 19 的目标是把 Step 1~18 已确认的详细设计中间产物装配为正式 `03-详细设计.md`。它是 formal document assembly,不是重新讨论对象、port、protocol、flow、state、config、test、acceptance 或 implementation boundary 的步骤。

| 边界项 | R19.1 裁决 |
|---|---|
| Step 19 定位 | 正式 `03-详细设计.md` 装配与自检。 |
| 正式文档写入 | 只能在后续明确的正式装配模块中写入,且每章必须标注校准来源和延伸阅读。 |
| 当前 R19.1 | 只做开工思考和恢复记录,不修改正式 `03`。 |
| 来源原则 | 只从 Step 1~18 confirmed 中间产物装配,不得从旧正式 `03` 或旧 Step completed 状态继承结论。 |
| 摘要原则 | 正式 `03` 承载收口结论和可实现入口;字段级完整契约仍需指向对应 Step 文件。 |
| 下游边界 | 04/05/06/07 未生成或待复核,只能作为 downstream pending / owner 写入,不得由 Step 19 代写。 |
| 实现边界 | Step 19 完成不等于 implementation start;implementation 仍必须等待正式 `07` 和 implementation ledger / boundary gate。 |
| blocker 处理 | 若正式装配时发现具体 truth-source 缺口,必须暂停并回 owning Step,不得润色进正文。 |

### 3. 必读文档思考

| 文档 | Step 19 用途 | 当前 R19.1 口径 |
|---|---|---|
| `project_execution_ledger.md` | 确认 Step 18 completed、Step 19 R19.1 当前门禁、单模块推进规则。 | 每次用户确认只推进一个 R19.x 模块。 |
| `03_ddd_calibration_flow.md` | 确认 Step 1~18 completed、Step 19 pending、正式 `03` 未装配。 | R19.1 完成后只能等待 R19.2。 |
| `03_ddd_step_19_formal_document_assembly.md` | 当前 Step 文件;旧内容已重置为 historical material。 | 不继承旧 `[x] 已确认`。 |
| `00-需求文档.md` | 正式 `03` 上游关系、范围、非目标、验收红线。 | 只装配已确认上游关系,不重写需求。 |
| `01-架构设计.md` | 系统边界、依赖方向、数据所有权、一致性和横切关注点。 | 只装配详细设计承接所需架构约束。 |
| `02-概要设计.md` | 八个组成部分、对象轮廓、接口骨架、处理流、状态、异常、配置影响。 | 作为详细设计直接输入,不恢复旧概要或旧正式 03。 |
| Step 1~4 中间产物 | 上游关系、范围、runtime / 仓库约束、实现布局。 | formal §1~§4 source。 |
| Step 5~8 中间产物 | 模块主轴、对象契约、port / adapter、protocol。 | formal §5~§7 source,字段级细节回指 Step 文件。 |
| Step 9~13 中间产物 | 函数级 flow、状态机、持久化、一致性、错误、并发、幂等。 | formal §8~§12 source。 |
| Step 14~16 中间产物 | 配置绑定、可观测性、审计、测试切口。 | formal §13~§15 source;不代写 04/05/06。 |
| Step 17 中间产物 | 详细设计到实施计划承接清单。 | formal §16 source;不代写 07。 |
| Step 18 中间产物 | 风险、待确认事项、未确认前处理规则、Step 19 gate。 | formal §17 source。 |
| `详细设计讨论流程_SOP.md` Step 19 | 固定目标、输入、输出、七问、完成条件。 | R19 必须完成正式装配自检。 |
| `详细设计书写规范.md` | 固定 18 章主链、正式章节校准来源标注、正式正文边界。 | 每章必须写校准来源和延伸阅读。 |
| `设计文档讨论中间产物规范.md` | 固定回填门禁、三层门禁、正式回填不能保留过程语气。 | 正式写入前必须过门禁。 |
| `设计真相源闭环与可落码性标准.md` | 防止把缺 schema / port / DTO / state / mapper / config / evidence / phase 的缺口交给实现。 | 若装配发现缺口,暂停回设计。 |
| L1-governance Step 19 | 参考 formal assembly 组织和自检深度。 | 只参考框架,不得复制 governance 领域事实。 |

### 4. Step 1~18 confirmed source map 思考

| formal 章节 | source Step | R19.1 装配思路 |
|---|---|---|
| §1 与上游文档的关系声明 | Step 1 | 装配上游关系、旧材料隔离、本文回答 / 不回答边界。 |
| §2 本次详细设计目标与范围 | Step 2 | 装配实现范围、非范围、能力边界和后续文档边界。 |
| §3 实现约束与编码规范承接 | Step 3 | 装配 Rust、仓库、依赖、安全、提交和注释约束。 |
| §4 实现单元与文件布局 | Step 4 | 装配 workspace / crate / module / file layout 和依赖方向。 |
| §5 模块实现契约 | Step 5~7 | 以本轮模块主轴组织模块职责、对象、port、adapter 和测试切口入口。 |
| §6 全局对象 / Trait / API 索引 | Step 6~8 | 做索引,不替代 §5 和 Step 6~8 字段级契约。 |
| §7 API / Command / Query / Event / Job 协议契约 | Step 8 | 装配 protocol inventory、public shell、错误面和禁入规则。 |
| §8 逐接口函数级处理流 | Step 9 | 装配 flow inventory、共享模板和关键接口处理流摘要。 |
| §9 状态机与转换矩阵 | Step 10 | 装配状态族、合法 / 非法迁移和 no-write / no-synthetic 规则。 |
| §10 数据持久化、事务与一致性契约 | Step 11 | 装配 repository、store、index、transaction、consistency 规则。 |
| §11 错误模型、异常分支与恢复口径 | Step 12 | 装配 error model、safe error、recovery 和 degraded / unavailable 处理。 |
| §12 并发、幂等与重入保护 | Step 13 | 装配 idempotency、duplicate replay、commit unknown、race / reentry 规则。 |
| §13 配置引用与外部依赖绑定 | Step 14 | 装配代码绑定点和 adapter availability,不写完整配置手册。 |
| §14 可观测性与审计埋点契约 | Step 15 | 装配 audit、log、metric、trace、redaction 和 forbidden body 规则。 |
| §15 测试切口与最小验证清单 | Step 16 | 装配最小验证清单,不写完整测试方案或 evidence schema。 |
| §16 详细设计到实施计划的承接清单 | Step 17 | 装配 preread、handoff、pre-audit、downstream ownership。 |
| §17 风险与待确认事项 | Step 18 | 装配 formal §17 candidate tables 和未确认前处理规则。 |
| §18 参考 | Step 1~19 + standards | 列正式上游、规范和 calibration source。 |

### 5. 旧正式 `03` historical material 隔离思考

旧正式 `03-详细设计.md` 仍可用于发现旧主线残留,但不能作为本轮 formal assembly 的正向来源。R19.2 应将这个隔离规则写入 Step 19 文件,后续正式写入时还要在 formal §1 或文档开头声明。

| 旧内容类型 | 当前处理 |
|---|---|
| 旧章节结构 / 旧 15 节声明 | historical material;正式 `03` 必须使用当前 18 章主链。 |
| 旧 `MethodContent` / publish / snapshot / fingerprint / outbox / delivery | historical pollution;不得进入当前 formal source。 |
| 旧 P0 / P1 分级和旧模块数量 | invalid;当前以本轮 Step 2 / Step 5 为准。 |
| 旧对象、trait、DTO、flow、state、config、test 结论 | 只有能回指当前 Step 1~18 confirmed source 时才可重新装配。 |
| 旧风险 / 待确认事项 | invalid;以 Step 18 R18.14 formal §17 candidate 为准。 |
| 旧 Step 19 已确认状态 | invalid;当前 Step 19 从 R19.1 重新执行。 |

### 6. formal assembly 风险思考

| 风险 | R19.1 处理 |
|---|---|
| 机械拼接 Step 文件导致正式 `03` 过长且保留过程语气 | 后续装配只取收口结论,不复制 SOP 问题、诊断、取舍和 stop-review 全文。 |
| 正式 `03` 摘要过浅导致不可落码 | 每章必须标注校准来源和延伸阅读,并保留足够实现入口;字段级细节回指 Step 文件。 |
| 误把 downstream pending 写成 detailed design blocker | 按 Step 18 区分 formal assembly、downstream handoff、implementation start、production / acceptance。 |
| 误把 Step 19 完成当成实现可开工 | formal §16 / §17 必须写明 implementation starts only after formal `07` and ledger gates。 |
| 装配时发现具体 truth-source 缺口 | 必须暂停并回 owning Step,不得润色成正文或风险后继续 completed。 |

### 7. R19.2 写入计划思考

`R19.2 开工与必读文档:再写入` 应把本模块思考落成可恢复记录:

1. 写 Step 19 必读文档表与读取状态。
2. 写 Step 19 开工边界和正式装配原则。
3. 写 Step 1~18 confirmed source map。
4. 写旧正式 `03` historical material 隔离规则。
5. 写 formal assembly 风险与 stop rule。
6. 写 Step 19 模块计划,至少覆盖 L1-governance 框架对齐、正式章节主链和来源映射、正式文档 skeleton、逐章装配、全局自检、completed stop-review。
7. 写 `R19.3 L1-governance 框架对齐与装配策略:先思考` 进入门禁。
8. 不修改正式 `03-详细设计.md`,不写正式章节正文,不进入下游文档或实现。

### 8. R19.1 stop-review

| 检查项 | 结果 |
|---|---|
| 是否确认旧 Step 19 completed 作废 | pass |
| 是否只思考 Step 19 开工边界和必读文档 | pass |
| 是否形成 Step 1~18 confirmed source map 思考 | pass |
| 是否形成旧正式 `03` historical material 隔离思考 | pass |
| 是否形成 formal assembly 风险思考 | pass |
| 是否形成 R19.2 写入计划 | pass |
| 是否未修改正式 `03-详细设计.md` | pass |
| 是否未进入下游 04/05/06/07 或 implementation artifacts | pass |

next_allowed_action: 等待用户确认后进入 Step 19 `R19.2 开工与必读文档:再写入`;只允许写入 Step 19 必读文档表、读取状态、开工边界、正式装配原则、Step 1~18 confirmed source map、旧正式 `03` historical material 隔离规则、formal assembly 风险与 stop rule、Step 19 模块计划和 `R19.3` 进入门禁;不得直接修改正式 `03-详细设计.md`;不得写正式章节正文、正式实施计划、phase / commit boundary、implementation ledger、evidence schema、CI command、acceptance gate 或 implementation code。

---

## R19.2 开工与必读文档:再写入

### 1. 当前模块状态

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm |
| 用户确认 | 已确认从 `R19.1` 推进到 `R19.2`。 |
| 本模块写入范围 | Step 19 必读文档表、读取状态、开工边界、正式装配原则、Step 1~18 confirmed source map、旧正式 `03` historical material 隔离规则、formal assembly 风险与 stop rule、Step 19 模块计划和 `R19.3` 进入门禁。 |
| 本模块禁止范围 | 修改正式 `03-详细设计.md`、写正式章节正文、进入 04/05/06/07、写正式实施计划、phase / commit boundary、implementation ledger、evidence schema、CI command、acceptance gate 或 implementation code。 |

### 2. Step 19 必读文档表与读取状态

| 文档 | 读取状态 | Step 19 用途 | 本轮处理口径 |
|---|---|---|---|
| `projects/L3-method-library/design-calibration/project_execution_ledger.md` | read | 确认当前恢复点、单模块推进规则和正式 `03` 未完成状态。 | R19.2 后推进到等待 `R19.3`。 |
| `projects/L3-method-library/design-calibration/03_ddd_calibration_flow.md` | read | 确认 Step 1~18 completed、Step 19 in_progress。 | 只更新当前恢复点,不改已完成 Step 结论。 |
| `projects/L3-method-library/design-calibration/03_ddd_step_19_formal_document_assembly.md` | read/write | 当前 Step 19 中间产物。 | 记录装配规则、来源映射、风险和后续模块计划。 |
| `projects/L3-method-library/00-需求文档.md` | source_baseline | 仓定位、能力边界、依赖裁剪、业务规则和验收红线。 | 作为 formal §1/§2/§17 的上游事实来源,不在 Step 19 重写需求。 |
| `projects/L3-method-library/01-架构设计.md` | source_baseline | 系统边界、依赖方向、数据所有权、一致性和横切关注点。 | 作为 formal §1/§3/§4/§13/§14 的架构约束来源。 |
| `projects/L3-method-library/02-概要设计.md` | source_baseline | 八个组成部分、对象轮廓、接口骨架、处理流、状态、异常、配置影响。 | 作为 Step 1~18 之外的直接详细设计输入。 |
| Step 1~4 中间产物 | confirmed_source | 上游边界、范围、runtime / repo 约束和文件布局。 | 装配 formal §1~§4。 |
| Step 5~8 中间产物 | confirmed_source | 模块契约、对象契约、port / adapter 和 protocol。 | 装配 formal §5~§7;字段级细节回指 Step 文件。 |
| Step 9~13 中间产物 | confirmed_source | 函数级 flow、状态机、持久化、错误、恢复、并发和幂等。 | 装配 formal §8~§12;不得压缩关键落码入口。 |
| Step 14~16 中间产物 | confirmed_source | 配置绑定、可观测性、审计和测试切口。 | 装配 formal §13~§15;完整配置 / 测试方案交下游文档。 |
| Step 17 中间产物 | confirmed_source | 详细设计到实施计划的承接清单和预审计维度。 | 装配 formal §16;不代写 `07-实施计划.md`。 |
| Step 18 中间产物 | confirmed_source | 风险、待确认事项、未确认前处理规则和 Step 19 entry gate。 | 装配 formal §17。 |
| `standards/document/详细设计讨论流程_SOP.md` | read | Step 19 的目标、输入、输出、七问和完成条件。 | 作为 Step 19 stop-review 标准。 |
| `standards/document/详细设计书写规范.md` | read | 18 章主链、第 5 章模块主轴、校准来源 / 延伸阅读写法。 | 正式 `03` 必须按此组织。 |
| `standards/document/设计文档讨论中间产物规范.md` | read | 回填门禁、三层门禁和中间产物记录规则。 | 正式回填前必须确认门禁通过。 |
| `standards/document/设计真相源闭环与可落码性标准.md` | read | 防止缺 schema / port / DTO / state / mapper / config / evidence / phase 时交给实现补口。 | Step 19 发现具体缺口时必须停回 owning Step。 |
| `projects/L1-governance/design-calibration/03_ddd_step_19_formal_document_assembly.md` | framework_reference | 参考 formal assembly 组织方式、SOP 七问回答、自检清单和后续文档条件表达。 | 只参考框架深度,不得复制 governance 领域事实。 |

### 3. Step 19 开工边界与正式装配原则

| 原则 | 正式口径 |
|---|---|
| Step 19 定位 | 把 Step 1~18 confirmed 结论装配为正式 `03-详细设计.md`,并执行自检。 |
| 非重新设计 | 不新增对象、字段、DTO、port、adapter、protocol、flow、state、mapper、config key、test evidence schema、phase boundary 或 code。 |
| 正式 `03` 作用 | 作为实现者阅读入口、跨 Step 索引和正式边界声明;字段级完整真相仍回指中间产物。 |
| 第 5 章主轴 | 正式 §5 必须以模块实现契约为核心,不能把对象、trait、函数拆成互相割裂的全局堆表。 |
| 第 6 章边界 | 正式 §6 是全局索引,不得替代 §5 的模块内契约和 Step 6~8 字段级契约。 |
| 来源标注 | 每章开头必须列具体 calibration source 和 extension reading,不能只写目录名。 |
| 过程语气隔离 | SOP 问题、旧材料诊断、差异审计、方案取舍、模块自检和停审记录留在 calibration,不进入正式正文。 |
| 下游边界 | 04/05/06/07 只可作为 owner / pending / handoff 写入,不得由 Step 19 代写正文。 |
| 实现边界 | Step 19 完成不允许直接实现;implementation starts only after formal `07` and implementation ledger / boundary gates。 |

### 4. Step 1~18 confirmed source map

| formal 章节 | 标题 | confirmed source | 装配要求 |
|---|---|---|---|
| §1 | 与上游文档的关系声明 | Step 1 + `00/01/02` | 声明新版上游和旧材料 historical status。 |
| §2 | 本次详细设计目标与范围 | Step 2 | 固定范围、非范围、能力边界和下游文档边界。 |
| §3 | 实现约束与编码规范承接 | Step 3 | 汇总 runtime、仓库、语言、依赖、安全、提交和注释约束。 |
| §4 | 实现单元与文件布局 | Step 4 | 装配 workspace / crate / module / file layout 和依赖方向。 |
| §5 | 模块实现契约 | Step 5~7 | 以本轮模块主轴组织职责、文件、对象、port、adapter、错误和测试切口入口。 |
| §6 | 全局对象 / Trait / API 索引 | Step 6~8 | 做索引和查找入口,不替代字段级 Step。 |
| §7 | API / Command / Query / Event / Job 协议契约 | Step 8 | 装配 protocol inventory、public shell、错误面和禁入规则。 |
| §8 | 逐接口函数级处理流 | Step 9 | 装配共享模板、flow inventory、关键接口处理流和副作用顺序摘要。 |
| §9 | 状态机与转换矩阵 | Step 10 | 装配状态族、合法 / 非法迁移、no-write 和 no-synthetic 规则。 |
| §10 | 数据持久化、事务与一致性契约 | Step 11 | 装配 repository、store、index、transaction、version 和 consistency 规则。 |
| §11 | 错误模型、异常分支与恢复口径 | Step 12 | 装配 error model、safe error、retry、dead-letter、degraded / unavailable 处理。 |
| §12 | 并发、幂等与重入保护 | Step 13 | 装配 idempotency key、duplicate replay、commit unknown、race 和 reentry 规则。 |
| §13 | 配置引用与外部依赖绑定 | Step 14 | 装配 detailed-design 级 binding,不写完整配置手册或产品选型。 |
| §14 | 可观测性与审计埋点契约 | Step 15 | 装配 audit、log、metric、trace、redaction 和 forbidden body 规则。 |
| §15 | 测试切口与最小验证清单 | Step 16 | 装配最小验证清单,不写完整测试方案、run artifact schema 或 acceptance gate。 |
| §16 | 详细设计到实施计划的承接清单 | Step 17 | 装配 preread、handoff、pre-audit、implementation start 禁入规则。 |
| §17 | 风险与待确认事项 | Step 18 | 装配风险表、待确认事项、未确认前处理规则和 Step 19 truth-source watch。 |
| §18 | 参考 | Step 1~19 + standards | 列正式上游、规范和 calibration source。 |

### 5. 旧正式 `03` historical material 隔离规则

| 旧材料 | 当前定位 | Step 19 处理 |
|---|---|---|
| 旧正式 `03-详细设计.md` | historical_material | 只用于污染审计和旧结构识别,不得作为正向来源。 |
| 旧 `03_ddd_step_19_formal_document_assembly.md` completed 状态 | invalid | 已重置,不得继承旧 P0 / P1、旧模块数量或旧装配结论。 |
| 旧章节结构 | historical_material | 正式 `03` 必须使用当前书写规范 18 章主链。 |
| 旧 `MethodContent`、publish、snapshot、fingerprint、outbox / delivery | historical_pollution_candidate | 不得进入当前 formal source;如需保留事实,必须能回指当前 Step 1~18 confirmed source。 |
| 旧对象、trait、DTO、flow、state、config、test 结论 | not_authoritative | 只有经当前 Step 文件重新确认后才可装配。 |
| 旧风险 / 待确认事项 | invalid | 以 Step 18 R18.14 formal §17 candidate 为准。 |

### 6. formal assembly 风险与 stop rule

| 场景 | 处理规则 |
|---|---|
| 正式章节来源不足 | 暂停装配该章节,回 owning Step 补 source map;不得凭旧材料或实现常识补正文。 |
| 字段、DTO、state、mapper、marker、port、stored surface、replay source 缺口 | 立即 stop,回 Step 6~13 对应 owning Step 闭口。 |
| config key、adapter binding、secret、topic、URL 或 product binding 缺口 | 不在 Step 19 发明;记录为 04 / Step 14 owner。 |
| test case、fixture、run artifact、report schema、acceptance gate 缺口 | 不在 Step 19 发明;记录为 05 / 06 owner。 |
| phase / commit boundary、implementation ledger、boundary ledger 缺口 | 不在 Step 19 发明;记录为 07 owner。 |
| 正式正文过长风险 | 保留足够落码入口和索引,字段级完整契约通过延伸阅读回指 Step 文件。 |
| 正式正文过浅风险 | 不为压缩行数牺牲可落码性;关键对象、protocol、flow、state、persistence、error、idempotency 和 test cut 必须有入口。 |
| 旧材料污染 | 删除污染内容或回到当前 Step source 验证;无法验证则不得装配。 |

### 7. Step 19 模块计划

| 模块 | 主题 | 预期输出 | 正式 `03` 写入 |
|---|---|---|---|
| R19.1 | 开工与必读文档:先思考 | 开工边界、必读文档、source map、风险和 R19.2 写入计划 | no |
| R19.2 | 开工与必读文档:再写入 | 本节记录、恢复点推进、R19.3 进入门禁 | no |
| R19.3 | L1-governance 框架对齐与装配策略:先思考 | 对齐 L1-governance Step 19 的框架深度和可借鉴结构 | no |
| R19.4 | L1-governance 框架对齐与装配策略:再写入 | 写入 L1-governance framework comparison 和 L3 装配策略 | no |
| R19.5 | 正式章节主链与 source map:先思考 | 按 18 章确认每章来源、延伸阅读和禁入项 | no |
| R19.6 | 正式章节主链与 source map:再写入 | 写入 formal source map 和章节装配清单 | no |
| R19.7 | 正式文档 skeleton 与写入门禁:先思考 | 确认正式 `03` skeleton、章节顺序、校准来源模板和写入批次 | no |
| R19.8 | 正式文档 skeleton 与写入门禁:再写入 | 创建或重写正式 `03` skeleton;只允许 skeleton 和 source labels | yes |
| R19.9+ | 逐章装配模块 | 按章节 / 批次装配正式正文,每批完成后更新台账 | yes_when_current_module_allows |
| R19.final | Step 19 stop-review | SOP 七问、自检清单、正式 `03` diff check、后续文档条件 | no_or_summary_only |

### 8. R19.3 进入门禁

| gate item | 状态 | 说明 |
|---|---|---|
| R19.2 写入范围未越界 | pass | 只写入 Step 19 中间产物和恢复台账。 |
| 正式 `03-详细设计.md` 未修改 | pass | R19.2 不写 formal body。 |
| 必读文档和读取状态已记录 | pass | 已形成 Step 19 必读表。 |
| Step 1~18 confirmed source map 已记录 | pass | 已形成 18 章 source map。 |
| historical material 隔离规则已记录 | pass | 旧正式 `03` 和旧 Step 19 completed 状态不得正向继承。 |
| stop rule 已记录 | pass | 发现具体 truth-source 缺口即回 owning Step。 |
| 下一模块清楚 | pass | 下一步只能进入 `R19.3 L1-governance 框架对齐与装配策略:先思考`。 |

### 9. R19.2 stop-review

| 检查项 | 结果 |
|---|---|
| 是否写入 Step 19 必读文档表与读取状态 | pass |
| 是否写入 Step 19 开工边界与正式装配原则 | pass |
| 是否写入 Step 1~18 confirmed source map | pass |
| 是否写入旧正式 `03` historical material 隔离规则 | pass |
| 是否写入 formal assembly 风险与 stop rule | pass |
| 是否写入 Step 19 模块计划 | pass |
| 是否写入 R19.3 进入门禁 | pass |
| 是否未修改正式 `03-详细设计.md` | pass |
| 是否未写正式章节正文 | pass |
| 是否未进入 04/05/06/07 或 implementation artifacts | pass |

next_allowed_action: 等待用户确认后进入 Step 19 `R19.3 L1-governance 框架对齐与装配策略:先思考`;只允许思考 L1-governance Step 19 的 formal assembly 框架、SOP 七问组织、自检清单、正式文档装配策略和 L3-method-library 可借鉴的结构深度;不得复制 governance 领域事实、模块名、协议数量或实现仓路径;不得直接修改正式 `03-详细设计.md`;不得写正式章节正文、正式实施计划、phase / commit boundary、implementation ledger、evidence schema、CI command、acceptance gate 或 implementation code。

---

## R19.3 L1-governance 框架对齐与装配策略:先思考

### 1. 当前模块目标

`R19.3` 只思考 L1-governance Step 19 的 formal assembly 框架如何映射到 L3-method-library,并形成 `R19.4` 的写入计划。当前模块不修改正式 `03-详细设计.md`,不写正式章节正文,不提前回答 L3 Step 19 最终 SOP 七问,不进入 skeleton 写入或逐章装配,也不写 04/05/06/07 或 implementation artifacts。

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm |
| 用户确认 | 已确认从 `R19.2` 推进到 `R19.3`。 |
| 当前允许 | 思考 L1-governance Step 19 的状态块、目标、输入表、装配策略、SOP 七问、自检清单、正式装配修正和进入后续文档条件如何映射到 L3。 |
| 当前禁止 | 复制 governance 领域事实、模块名、协议数量、目标仓路径、正式正文段落;修改正式 `03-详细设计.md`;写正式章节正文;写 phase / commit boundary、implementation ledger、evidence schema、CI command、acceptance gate 或 code。 |

### 2. L1-governance Step 19 框架观察

L1-governance Step 19 的价值不在具体 governance 语义,而在它把 18 个已确认 Step 转成正式 `03` 的装配工作台。它没有把 Step 6~9 的字段级真相完整复制进正式文档,而是把正式 `03` 定位为阅读入口、跨 Step 索引和边界声明。

| L1 Step 19 结构 | 框架价值 | L3 可借鉴方式 |
|---|---|---|
| Step 状态 | 明确当前 Step、输入基线、输出文件和停审方式。 | L3 需要保留 full-restart / 单模块推进状态,不采用一次性 completed。 |
| 本步目标 | 声明正式 `03` 是入口、索引和边界声明,字段级真相仍在 calibration。 | L3 正式 `03` 应同样避免复制 Step 6~9 全量字段,但必须提供可落码入口。 |
| 本步输入 | 逐 Step 列出 Step 1~18 文件、状态和用途。 | L3 需要按当前实际文件名和 Step 1~18 结论写输入表。 |
| 装配策略 | 用 18 章主链把每章映射到 source Step 和装配策略。 | L3 应先形成章节级 source map,再进入 skeleton / 逐章装配。 |
| SOP 问题回答 | 把 Step 19 七问转成正式完成前的审计项。 | L3 最终 R19.final 才能回答 pass;R19.3/R19.4 只规划问题形态。 |
| 正式装配修正 | 列旧主线、数量漂移、字段级落点、目标仓、下游文档等修正口径。 | L3 需要对应写旧 `MethodContent` / P0/P1 / publish / snapshot / outbox 等污染排除和 L3 inventory 漂移防线。 |
| 自检清单 | 将书写规范 checklist 变成 pass / explain 表。 | L3 应在正式 `03` 装配后执行,不能在 R19.3 预先打 pass。 |
| 进入后续文档条件 | 声明正式 `03` 装配、校准来源、旧主线移除和用户审查条件。 | L3 需要写成“有条件进入 04/05/06/07”,且不得绕过下游门禁。 |

### 3. L1 formal `03` 章节组织观察

L1-governance 正式 `03` 使用书写规范 18 章主链。其正文结构可以作为 L3 formal skeleton 的形态参考,但章节内容必须全部来自 L3 Step 1~18。

| 章节区间 | L1 形态观察 | L3 装配思考 |
|---|---|---|
| §1~§4 | 上游关系、范围、实现约束、文件布局先行。 | L3 也应先清旧材料、定边界、再给 runtime / layout。 |
| §5 | 以模块为主轴,模块小节承载职责和依赖。 | L3 §5 必须使用 Step 5 已确认的七个实现单元,并承接八组件横向校验。 |
| §6~§8 | 全局索引、协议契约、函数流分别成章。 | L3 应保持索引 / protocol / flow 分离,避免正式文档把字段、DTO、flow 混在同一节。 |
| §9~§12 | 状态、持久化、错误、幂等形成连续 implementation contract。 | L3 应保留足够落码入口,并把细节回指 Step 10~13。 |
| §13~§15 | 配置、观测、测试切口只写详细设计级入口。 | L3 不在 `03` 中写完整配置手册、测试方案或验收标准。 |
| §16~§17 | 实施承接、风险和待确认事项作为 handoff / watch。 | L3 必须写明 implementation starts only after formal `07` and ledger gates。 |
| §18 | 参考和 calibration source 固化。 | L3 §18 应列正式上游、规范和 Step 1~19 source。 |

### 4. L3-method-library 适配判断

L3-method-library 不能按 L1-governance 的领域粒度复制,但应按它的框架深度补齐 Step 19 装配策略。

| 适配项 | L3 判断 |
|---|---|
| 模块主轴 | L3 使用 Step 5 已确认的七个实现单元:`contracts`、`domain`、`application`、`infra`、`api`、`worker`、`jobs`。 |
| 业务横轴 | L3 保留当前 `02-概要设计.md` 的八个主要组成部分作为横向校验,不得机械改成八个 crate。 |
| 协议 inventory | L3 只能使用 Step 8 当前 confirmed protocol family / inventory,不得复制 L1 的 23 Command、14 Query 等 governance 数量。 |
| 旧材料修正 | L3 的修正重点是旧 `MethodContent`、publish、snapshot、fingerprint、outbox、delivery、P0/P1、旧 crate / module 主线。 |
| 正式章节深度 | L3 正式 `03` 不能只写总表;§5、§7、§8、§9~§12 必须有足够实现入口和 source links。 |
| 字段级真相落点 | L3 formal body 只写收口摘要和索引;字段、signature、DTO schema、flow 全量细节仍回指 Step 6~9。 |
| downstream 关系 | L3 `04/05/06/07` 当前仍 blocked_by_03_not_completed;Step 19 只能装配 handoff,不能代写下游。 |

### 5. L3 Step 19 应采用的装配策略草案

R19.4 应把以下策略写成正式 framework alignment record,供后续 R19.5+ 使用。

| 策略项 | 思考结果 |
|---|---|
| 先策略后正文 | 先完成 L1 框架对齐、章节 source map 和 skeleton gate,再允许正式 `03` 写入。 |
| 章节级门禁 | 每个 formal chapter 写入前必须确认 source Step、extension reading、assemblable / forbidden content 和 stop rule。 |
| §5 优先保护 | 正式 §5 的模块主轴必须完整覆盖七实现单元和八组件横向映射,不能因摘要化漏掉 `worker` / `jobs` 或 entry boundary。 |
| §6 只做索引 | 正式 §6 不承载对象 / trait 全量正文,但必须给实现者稳定查找路径。 |
| §7~§8 分离 | protocol contract 和 function flow 分章装配,避免把 handler 顺序写进 protocol schema。 |
| §9~§12 连贯审计 | state、persistence、error、idempotency 必须互相可回指;若装配中发现状态或 replay source 缺口,回 owning Step。 |
| §13~§15 后移边界 | 配置、观测、测试切口写详细设计级入口,完整 schema / TC / evidence / acceptance 后移到 04/05/06。 |
| §16~§17 实施红线 | formal `03` 可提供 handoff 和风险,但不得创建 `07` required_reads、phase、commit boundary 或 implementation ledger。 |

### 6. 不可复制为语义的内容

| L1 内容 | L3 处理 |
|---|---|
| governance 模块名、crate/package 名和目标仓路径 | 禁止复制;L3 使用自己的 Step 4 / Step 5 文件布局和 `/home/aris/Projects/quantalithos-method-library` 口径。 |
| governance Command / Query / Event / Job 数量 | 禁止复制;L3 使用 Step 8 当前 inventory。 |
| governance 对象、policy、visibility、outbox snapshot 等领域词 | 禁止作为 L3 正向事实;若 L3 有同类概念,必须来自 L3 Step 6~13。 |
| governance formal `03` 的 pass 结论 | 禁止继承;L3 必须等自身正式 `03` 装配和自检完成后才能判断。 |
| governance 下游文档状态 | 禁止继承;L3 的 04/05/06/07 仍按项目台账 blocked_by_03_not_completed。 |

### 7. R19.4 写入计划思考

`R19.4 L1-governance 框架对齐与装配策略:再写入` 应把本模块思考落成可恢复记录:

1. 写 L1-governance framework_reference 读取记录。
2. 写 L1 Step 19 可借鉴结构表。
3. 写 L1 formal `03` 18 章形态观察表。
4. 写 L3-method-library 适配判断表。
5. 写 L3 Step 19 装配策略表。
6. 写不可复制语义清单。
7. 写 `R19.5 正式章节主链与 source map:先思考` 进入门禁。
8. 不修改正式 `03-详细设计.md`,不写正式章节正文,不进入 skeleton 写入或逐章装配。

### 8. R19.3 stop-review

| 检查项 | 结果 |
|---|---|
| 是否只思考 L1-governance Step 19 框架对齐 | pass |
| 是否形成 L1 Step 19 可借鉴结构观察 | pass |
| 是否形成 L1 formal `03` 章节组织观察 | pass |
| 是否形成 L3-method-library 适配判断 | pass |
| 是否形成 L3 Step 19 装配策略草案 | pass |
| 是否列出不可复制语义 | pass |
| 是否形成 R19.4 写入计划 | pass |
| 是否未修改正式 `03-详细设计.md` | pass |
| 是否未写正式章节正文或下游 implementation artifacts | pass |

next_allowed_action: 等待用户确认后进入 Step 19 `R19.4 L1-governance 框架对齐与装配策略:再写入`;只允许写入 L1-governance framework_reference 读取记录、可借鉴结构表、L1 formal `03` 章节形态观察、L3-method-library 适配判断、L3 Step 19 装配策略、不可复制语义清单和 `R19.5` 进入门禁;不得复制 governance 领域事实、模块名、协议数量或实现仓路径;不得直接修改正式 `03-详细设计.md`;不得写正式章节正文、正式实施计划、phase / commit boundary、implementation ledger、evidence schema、CI command、acceptance gate 或 implementation code。

---

## R19.4 L1-governance 框架对齐与装配策略:再写入

### 1. 当前模块状态

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm |
| 用户确认 | 已确认从 `R19.3` 推进到 `R19.4`。 |
| 本模块写入范围 | L1-governance framework_reference 读取记录、可借鉴结构表、L1 formal `03` 章节形态观察、L3-method-library 适配判断、L3 Step 19 装配策略、不可复制语义清单和 `R19.5` 进入门禁。 |
| 本模块禁止范围 | 复制 governance 领域事实、模块名、协议数量或实现仓路径;修改正式 `03-详细设计.md`;写正式章节正文;写正式实施计划、phase / commit boundary、implementation ledger、evidence schema、CI command、acceptance gate 或 implementation code。 |

### 2. framework_reference 读取记录

| 参考材料 | 读取状态 | 可用范围 | 禁止范围 |
|---|---|---|---|
| `projects/L1-governance/design-calibration/03_ddd_step_19_formal_document_assembly.md` | read | Step 19 状态块、目标、输入表、装配策略、SOP 七问、自检清单、后续文档条件的组织方式。 | governance 模块名、协议数量、对象、目标仓路径、completed pass 结论。 |
| `projects/L1-governance/03-详细设计.md` | structure_read | 18 章主链的正式文档形态、章节顺序、校准来源块和章节层级。 | 正文领域事实、具体 Command / Query / Job 名称、对象语义和实现仓路径。 |
| `standards/document/详细设计书写规范.md` | normative_read | 18 章主链、第 5 章模块主轴、第 6 章索引边界、校准来源和延伸阅读写法。 | 不适用。 |
| `standards/document/详细设计讨论流程_SOP.md` Step 19 | normative_read | Step 19 七问、输出、完成条件和正式文档自检要求。 | 不适用。 |

### 3. L1 Step 19 可借鉴结构表

| 结构 | L1 框架价值 | L3-method-library 采用方式 |
|---|---|---|
| Step 状态块 | 让后续 agent 明确输入基线、输出文件和停审方式。 | 保留 full-restart、单模块推进和等待确认状态,不写一次性 completed。 |
| 本步目标 | 定义正式 `03` 是实现入口、跨 Step 索引和边界声明。 | L3 正式 `03` 也作为入口,字段级完整契约回指 Step 6~13。 |
| 本步输入 | 把 Step 1~18 逐项列为正式装配来源。 | L3 后续 R19.5/R19.6 按当前文件名和 Step 状态重建 source map。 |
| 装配策略 | 每个正式章节映射到 source Step 和装配策略。 | L3 后续必须先确认章节 source map,再允许 skeleton / 正文写入。 |
| SOP 七问 | 把书写规范和可落码性问题转成 Step 19 完成前审计。 | L3 最终 stop-review 才能回答 pass,当前只规划审计结构。 |
| 正式装配修正 | 把旧主线、数量漂移、字段级落点和下游文档单独列出。 | L3 对应处理旧 `MethodContent`、P0/P1、publish、snapshot、outbox、delivery 等污染。 |
| 自检清单 | 将正式文档完成条件表格化。 | L3 装配完成后执行,不得提前打 pass。 |
| 后续文档条件 | 标明 04/05/06/07 进入条件和用户审查状态。 | L3 后续只能写有条件进入,且不得绕过 04/05/06/07 各自门禁。 |

### 4. L1 formal `03` 章节形态观察

| 章节区间 | 可借鉴形态 | L3 装配要求 |
|---|---|---|
| §1~§4 | 上游关系、范围、实现约束、文件布局先成入口。 | L3 必须先声明当前 00/01/02 为正向输入,旧 `03` 为 historical material。 |
| §5 | 以模块为主轴,模块小节承载职责、暴露和依赖。 | L3 §5 使用七个实现单元,并保留八组件横向校验和后续 owner 路由。 |
| §6 | 全局对象 / Trait / API 索引只做查找入口。 | L3 §6 不替代 Step 6~8 的字段级契约和 protocol schema。 |
| §7~§8 | 协议契约与函数流分章。 | L3 必须保持 protocol shell 和 function flow 分离,不得把 flow 写成 DTO schema。 |
| §9~§12 | 状态、持久化、错误、幂等连续承接。 | L3 必须检查 state / repository / error / replay source 是否互相可回指。 |
| §13~§15 | 配置、观测、测试切口只写 detailed-design 级入口。 | L3 不在 `03` 中写完整 config schema、TC、evidence 或 acceptance gate。 |
| §16~§17 | 实施承接和风险作为 handoff / watch。 | L3 必须明确 implementation starts only after formal `07` and ledger gates。 |
| §18 | 参考固定正式上游、规范和 calibration source。 | L3 应列 `00/01/02`、Step 1~19 和标准文档。 |

### 5. L3-method-library 适配判断

| 适配项 | L3 当前结论 |
|---|---|
| 顶层模块主轴 | 使用 Step 5 已确认的七个实现单元:`contracts`、`domain`、`application`、`infra`、`api`、`worker`、`jobs`。 |
| 业务横轴 | 使用当前 `02-概要设计.md` 八个主要组成部分做横向校验,不把八组件机械拆成八个 crate。 |
| 协议口径 | 使用 Step 8 confirmed shared / Command / Query / Inbound / Outbound / Operations Job family 和 L3 自身 inventory。 |
| 旧材料排除 | 重点排除旧 `MethodContent`、publish、snapshot、fingerprint、outbox、delivery、P0/P1、旧 crate / module 主线。 |
| 正式摘要深度 | 正式 `03` 不复制字段级全量契约,但 §5、§7、§8、§9~§12 必须给实现者足够入口。 |
| 下游边界 | 04/05/06/07 仍 blocked_by_03_not_completed;Step 19 只写 handoff 和 owner,不代写下游正文。 |

### 6. L3 Step 19 装配策略

| 策略 | 执行规则 |
|---|---|
| 先策略后正文 | R19.4 只固化装配策略;R19.5/R19.6 再处理正式章节 source map;R19.8 以后才允许正式 `03` skeleton / body 写入。 |
| 章节级门禁 | 每章写入前必须确认 source Step、延伸阅读、assemblable content、forbidden content 和 stop rule。 |
| 第 5 章保护 | §5 必须覆盖七实现单元、八组件横向映射、依赖边界和 owner 路由,不能只写单句模块列表。 |
| 第 6 章索引边界 | §6 只做索引和查找入口;对象字段、trait 方法、DTO schema 继续回指 Step 6~8。 |
| §7 / §8 分离 | protocol contract 与 function flow 分章装配;任何 handler 顺序、事务和副作用顺序留给 §8 / Step 9。 |
| §9~§12 闭环复核 | 状态、持久化、错误恢复、幂等重放必须可互相回指;发现缺口则回 owning Step。 |
| §13~§15 下游边界 | 配置、观测、测试切口只写详细设计入口;完整配置、测试、验收文档由 04/05/06 负责。 |
| §16~§17 实施红线 | detailed design 只提供 handoff、pre-audit 和风险;phase / commit boundary、ledger、required checks 归属 07。 |

### 7. 不可复制语义清单

| 禁止复制项 | L3 正确来源 |
|---|---|
| governance 模块名、crate/package 名和目标仓路径 | L3 Step 4 / Step 5。 |
| governance Command / Query / Event / Job 数量和名称 | L3 Step 8 confirmed protocol family / inventory。 |
| governance 对象、policy、visibility、snapshot、outbox 等领域语义 | L3 Step 6~13 confirmed object / port / protocol / flow / state / persistence。 |
| governance formal `03` 的 completed pass 结论 | L3 Step 19 final stop-review。 |
| governance 下游 04/05/06/07 状态 | L3 project_execution_ledger 和后续 L3 下游文档。 |
| governance 正式正文段落 | L3 Step 1~18 confirmed source 装配结果。 |

### 8. R19.5 进入门禁

| gate item | 状态 | 说明 |
|---|---|---|
| L1 framework_reference 已登记 | pass | 已明确只参考框架,不复制语义。 |
| 可借鉴结构已写入 | pass | 已写 Step 状态、目标、输入、装配策略、SOP 七问、自检、后续条件的 L3 采用方式。 |
| L1 formal `03` 章节形态已观察 | pass | 已形成 18 章形态到 L3 装配要求的映射。 |
| L3 适配判断已写入 | pass | 已固定七模块主轴、八组件横轴、L3 协议口径和旧材料排除。 |
| L3 装配策略已写入 | pass | 已明确后续先 source map,再 skeleton,再逐章装配。 |
| 正式 `03-详细设计.md` 未修改 | pass | R19.4 不写 formal body。 |
| 下一模块清楚 | pass | 下一步只能进入 `R19.5 正式章节主链与 source map:先思考`。 |

### 9. R19.4 stop-review

| 检查项 | 结果 |
|---|---|
| 是否写入 L1-governance framework_reference 读取记录 | pass |
| 是否写入可借鉴结构表 | pass |
| 是否写入 L1 formal `03` 章节形态观察 | pass |
| 是否写入 L3-method-library 适配判断 | pass |
| 是否写入 L3 Step 19 装配策略 | pass |
| 是否写入不可复制语义清单 | pass |
| 是否写入 R19.5 进入门禁 | pass |
| 是否未复制 governance 领域事实、模块名、协议数量或实现仓路径 | pass |
| 是否未修改正式 `03-详细设计.md` | pass |
| 是否未写正式章节正文或 implementation artifacts | pass |

next_allowed_action: 等待用户确认后进入 Step 19 `R19.5 正式章节主链与 source map:先思考`;只允许思考正式 `03-详细设计.md` 18 章主链、每章 calibration source、延伸阅读、assemblable / forbidden content、旧材料隔离和 R19.6 写入计划;不得直接修改正式 `03-详细设计.md`;不得写正式章节正文、正式实施计划、phase / commit boundary、implementation ledger、evidence schema、CI command、acceptance gate 或 implementation code。

---

## R19.5 正式章节主链与 source map:先思考

### 1. 当前模块目标

`R19.5` 只思考正式 `03-详细设计.md` 的 18 章主链、每章 calibration source、延伸阅读、可装配内容、禁入内容、旧材料隔离和 `R19.6` 写入计划。当前模块不修改正式 `03-详细设计.md`,不写正式章节正文,不创建 skeleton,不进入逐章装配,不写 04/05/06/07 或 implementation artifacts。

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm |
| 用户确认 | 已确认从 `R19.4` 推进到 `R19.5`。 |
| 当前允许 | 思考 18 章主链、每章 source map、延伸阅读、assemblable / forbidden content、stop rule 和 R19.6 写入计划。 |
| 当前禁止 | 修改正式 `03-详细设计.md`;写正式章节正文;创建正式 skeleton;写正式实施计划、phase / commit boundary、implementation ledger、evidence schema、CI command、acceptance gate 或 implementation code。 |

### 2. 18 章主链 source map 思考

R19.6 应把下表固化为正式 source map。R19.5 只形成思考草案,不代表正式正文已经可写。

| formal 章节 | calibration source candidate | 延伸阅读 candidate | 可装配内容 | 禁入内容 |
|---|---|---|---|---|
| §1 与上游文档的关系声明 | `03_ddd_step_01_input_boundary.md`;`00-需求文档.md`;`01-架构设计.md`;`02-概要设计.md` | Step 1 的输入边界、旧材料隔离、上游关系判断。 | 当前 00/01/02 是正向输入;旧 03 / 旧 Step 只作 historical material。 | 旧正式 03 主线、旧 Step completed 结论、旧 MethodContent / P0/P1。 |
| §2 本次详细设计目标与范围 | `03_ddd_step_02_scope.md`;`00-需求文档.md`;`02-概要设计.md` | Step 2 的范围、非范围、能力边界和下游边界。 | 本轮详细设计目标、实现范围、非目标、下游文档边界。 | 新增需求、恢复旧范围、提前写 04/05/06/07。 |
| §3 实现约束与编码规范承接 | `03_ddd_step_03_runtime_constraints.md`;相关标准文档 | Step 3 的 runtime、仓库、语言、依赖、安全和提交约束。 | Rust / workspace / 依赖 / 安全 / 提交 / 注释约束摘要。 | 具体实现代码、未确认依赖产品、实现仓 workaround。 |
| §4 实现单元与文件布局 | `03_ddd_step_04_module_layout.md` | Step 4 的 workspace、crate、module、file layout 和依赖方向。 | 实现单元、文件布局、依赖方向和禁止反向依赖。 | 改写模块主轴、写对象字段或函数签名。 |
| §5 模块实现契约 | `03_ddd_step_05_module_contracts.md`;`03_ddd_step_06_object_contracts.md`;`03_ddd_step_07_trait_port_adapter.md` | Step 5 的七模块主轴、八组件横向映射、模块职责、owner 路由;Step 6/7 的模块内对象和 port 入口。 | 七实现单元、模块职责、暴露面、依赖边界、对象/port 入口和测试切口入口。 | 把所有 struct / trait / function 堆成全局表;复制字段级全量 schema。 |
| §6 全局对象 / Trait / API 索引 | `03_ddd_step_06_object_contracts.md`;`03_ddd_step_07_trait_port_adapter.md`;`03_ddd_step_08_protocol_contracts.md` | Step 6~8 的对象、trait、port、protocol inventory 和索引入口。 | 全局索引、查找路径、字段级真相源位置。 | 用 §6 替代 §5 模块实现契约或替代 Step 6~8 字段级契约。 |
| §7 API / Command / Query / Event / Job 协议契约 | `03_ddd_step_08_protocol_contracts.md` | Step 8 的 shared shell、Command、Query、Inbound、Outbound、Operations Job family 和 public surface audit。 | 协议 family、public shell、marker / result / page / receipt / report guardrails。 | 具体 DTO 字段 schema、HTTP/RPC/topic/job trigger、function flow。 |
| §8 逐接口函数级处理流 | `03_ddd_step_09_function_flows.md` | Step 9 的 shared template、Command / Query / Inbound / Outbound / Job flow、handoff closure。 | 逐接口 flow inventory、关键处理顺序、副作用顺序、no-synthetic 规则摘要。 | protocol schema、状态矩阵、persistence schema、测试 case。 |
| §9 状态机与转换矩阵 | `03_ddd_step_10_state_machine.md` | Step 10 的状态族、合法迁移、非法迁移、state owner。 | 状态族、转换矩阵入口、禁止迁移、状态测试入口。 | 新增状态、把错误恢复或持久化规则写成状态事实。 |
| §10 数据持久化、事务与一致性契约 | `03_ddd_step_11_persistence_tx_consistency.md` | Step 11 的 repository key、store/index、UoW、transaction、version consistency。 | 持久化、事务边界、一致性、repository / index 入口。 | 具体 DB 产品绑定、migration、SQL schema、实现仓私有 map。 |
| §11 错误模型、异常分支与恢复口径 | `03_ddd_step_12_errors_recovery.md` | Step 12 的 error model、safe message、recovery、degraded / unavailable、retry / DLQ 入口。 | 错误分层、恢复规则、安全错误、不得泄露 raw body。 | acceptance gate、运行手册、未确认产品告警策略。 |
| §12 并发、幂等与重入保护 | `03_ddd_step_13_concurrency_idempotency.md` | Step 13 的 idempotency key、duplicate replay、commit unknown、race / reentry。 | 幂等、并发、重入、stored replay source 和 no-rerun 规则摘要。 | 自行补 stored result schema、实现侧重跑 mutation、phase boundary。 |
| §13 配置引用与外部依赖绑定 | `03_ddd_step_14_config_dependencies.md` | Step 14 的 config / dependency boundary、adapter availability、binding owner。 | detailed-design 级配置引用、外部依赖绑定边界、availability 入口。 | 具体 config key/env/default/topic/URL/secret/product selection。 |
| §14 可观测性与审计埋点契约 | `03_ddd_step_15_observability_audit.md` | Step 15 的 log、metric、trace、audit、redaction、forbidden body。 | 可观测性与审计入口、安全摘要、redaction 规则。 | raw body、provider log、未确认 metrics backend、完整运维手册。 |
| §15 测试切口与最小验证清单 | `03_ddd_step_16_test_cut.md` | Step 16 的 source coverage、最小测试切口、formal §15 source map。 | 最小验证清单、测试切口入口、后续 05/06/07 handoff。 | 完整 TC ID、fixture schema、run artifact schema、acceptance threshold。 |
| §16 详细设计到实施计划的承接清单 | `03_ddd_step_17_implementation_handoff.md` | Step 17 的 source matrix、preread candidate、pre-audit、downstream ownership。 | 实施承接输入、pre-audit 维度、implementation starts only after 07 / ledger gates。 | phase / commit boundary、allowed_scope、required_checks、implementation ledger 实例。 |
| §17 风险与待确认事项 | `03_ddd_step_18_risks_open_questions.md` | Step 18 的 formal §17 candidate 风险表、待确认事项、未确认前处理规则。 | 风险表、待确认事项、未确认前不得补口规则、truth-source watch。 | 把 downstream pending 伪装为已闭口;把具体缺口交给实现仓。 |
| §18 参考 | Step 1~19;`00/01/02`;标准文档 | 当前 Step 19 source map、正式上游、规范和 calibration source。 | 正式引用索引、calibration source 列表、规范列表。 | 旧 Step completed 状态、未读外部材料、implementation commit 链。 |

### 3. 校准来源块写法思考

正式正文每章开头应使用书写规范固定结构,但 R19.5 不写入正式正文。R19.6 应记录如下模板供后续 skeleton 使用:

```md
> 校准来源：
> - `design-calibration/<具体 Step 文件>.md`
>
> 延伸阅读：
> - 建议继续阅读上述中间产物的“结构化中间产物”“回填草稿”“stop-review”和“待确认事项”小节,了解本章详细设计结论如何从讨论收敛而来。
```

| 模板规则 | R19.5 判断 |
|---|---|
| 必须引用具体文件 | 不能只写 `design-calibration` 目录。 |
| 多 Step 合并 | 每个 source 文件逐条列出。 |
| 延伸阅读要具体 | 指向结构化中间产物、回填草稿、stop-review、待确认事项或对应 source map。 |
| 正式正文不新增契约 | 只能装配已确认 Step 结论。 |
| 过程材料不进正文 | SOP 问题、旧材料诊断、方案取舍、差异审计和停审记录留在 calibration。 |

### 4. assemblable / forbidden content 分类思考

| 内容类型 | 装配判断 |
|---|---|
| Step 1~18 的回填草稿、formal candidate、source map、stop-review 结论 | 可装配,但必须改写为正式正文语气。 |
| Step 1~18 的过程推理、方案比较、旧材料扫描和自检表 | 不直接装配,只可转化为收口结论或留在 calibration。 |
| 字段级对象、trait 方法、DTO schema、flow 全量步骤 | 正式 `03` 可给入口和关键摘要;完整真相回指对应 Step。 |
| 下游 04/05/06/07 的具体正文、schema、gate 和 boundary | 禁入正式 `03`;只能写 owner / handoff / pending。 |
| 旧正式 `03` 或旧 Step completed 内容 | 禁入正向装配;只能作为 historical material exclusion。 |
| L1-governance 内容 | 只可作为框架参考;领域事实禁入。 |

### 5. 每章 stop rule 思考

| 缺口类型 | 装配处理 |
|---|---|
| 某章缺 confirmed source | 暂停该章,回 owning Step 补 source map。 |
| schema / field / DTO / trait / port / mapper / marker 缺来源 | 暂停,回 Step 6~8 或对应 owning Step。 |
| flow / state / persistence / replay source 不互相可回指 | 暂停,回 Step 9~13。 |
| config / test / acceptance / implementation boundary 需要具体 schema | 不在 Step 19 补;交 04/05/06/07。 |
| 旧材料才能支撑某段正文 | 删除该段或回当前 Step source 验证;无法验证则禁入。 |

### 6. R19.6 写入计划思考

`R19.6 正式章节主链与 source map:再写入` 应把本模块思考落成可恢复记录:

1. 写 18 章 formal source map 表。
2. 写每章 calibration source / extension reading 规则。
3. 写 assemblable / forbidden content 分类表。
4. 写每章 stop rule 和 owning Step return route。
5. 写 `R19.7 正式文档 skeleton 与写入门禁:先思考` 进入门禁。
6. 不修改正式 `03-详细设计.md`,不写正式章节正文,不创建 skeleton。

### 7. R19.5 stop-review

| 检查项 | 结果 |
|---|---|
| 是否只思考正式章节主链与 source map | pass |
| 是否形成 18 章 source map 草案 | pass |
| 是否形成校准来源块写法思考 | pass |
| 是否形成 assemblable / forbidden content 分类思考 | pass |
| 是否形成每章 stop rule 思考 | pass |
| 是否形成 R19.6 写入计划 | pass |
| 是否未修改正式 `03-详细设计.md` | pass |
| 是否未写正式章节正文、skeleton 或 implementation artifacts | pass |

next_allowed_action: 等待用户确认后进入 Step 19 `R19.6 正式章节主链与 source map:再写入`;只允许写入 18 章 formal source map、每章 calibration source / extension reading 规则、assemblable / forbidden content 分类、每章 stop rule、owning Step return route 和 R19.7 进入门禁;不得直接修改正式 `03-详细设计.md`;不得写正式章节正文、正式文档 skeleton、正式实施计划、phase / commit boundary、implementation ledger、evidence schema、CI command、acceptance gate 或 implementation code。

---

## R19.6 正式章节主链与 source map:再写入

### 1. 当前模块状态

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm |
| 用户确认 | 已确认从 `R19.5` 推进到 `R19.6`。 |
| 本模块写入范围 | 18 章 formal source map、每章 calibration source / extension reading 规则、assemblable / forbidden content 分类、每章 stop rule、owning Step return route 和 `R19.7` 进入门禁。 |
| 本模块禁止范围 | 直接修改正式 `03-详细设计.md`;写正式章节正文;写正式文档 skeleton;写正式实施计划、phase / commit boundary、implementation ledger、evidence schema、CI command、acceptance gate 或 implementation code。 |

### 2. 18 章 formal source map

| formal 章节 | calibration source | extension reading | 可装配内容 | 禁入内容 |
|---|---|---|---|---|
| §1 与上游文档的关系声明 | `03_ddd_step_01_input_boundary.md`;`00-需求文档.md`;`01-架构设计.md`;`02-概要设计.md` | Step 1 输入边界、旧材料隔离、上游关系判断。 | 当前 00/01/02 为正向输入;旧 03 / 旧 Step 只作 historical material。 | 旧正式 03 主线、旧 Step completed 结论、旧 MethodContent / P0/P1。 |
| §2 本次详细设计目标与范围 | `03_ddd_step_02_scope.md`;`00-需求文档.md`;`02-概要设计.md` | Step 2 范围、非范围、能力边界和下游边界。 | 详细设计目标、实现范围、非目标、下游文档边界。 | 新增需求、恢复旧范围、提前写 04/05/06/07。 |
| §3 实现约束与编码规范承接 | `03_ddd_step_03_runtime_constraints.md`;相关标准文档 | Step 3 runtime、仓库、语言、依赖、安全和提交约束。 | Rust / workspace / 依赖 / 安全 / 提交 / 注释约束摘要。 | 具体实现代码、未确认依赖产品、实现仓 workaround。 |
| §4 实现单元与文件布局 | `03_ddd_step_04_module_layout.md` | Step 4 workspace、crate、module、file layout 和依赖方向。 | 实现单元、文件布局、依赖方向和禁止反向依赖。 | 改写模块主轴、写对象字段或函数签名。 |
| §5 模块实现契约 | `03_ddd_step_05_module_contracts.md`;`03_ddd_step_06_object_contracts.md`;`03_ddd_step_07_trait_port_adapter.md` | Step 5 七模块主轴、八组件横向映射、模块职责、owner 路由;Step 6/7 模块内对象和 port 入口。 | 七实现单元、模块职责、暴露面、依赖边界、对象/port 入口和测试切口入口。 | 把所有 struct / trait / function 堆成全局表;复制字段级全量 schema。 |
| §6 全局对象 / Trait / API 索引 | `03_ddd_step_06_object_contracts.md`;`03_ddd_step_07_trait_port_adapter.md`;`03_ddd_step_08_protocol_contracts.md` | Step 6~8 对象、trait、port、protocol inventory 和索引入口。 | 全局索引、查找路径、字段级真相源位置。 | 用 §6 替代 §5 模块契约或替代 Step 6~8 字段级契约。 |
| §7 API / Command / Query / Event / Job 协议契约 | `03_ddd_step_08_protocol_contracts.md` | Step 8 shared shell、Command、Query、Inbound、Outbound、Operations Job family 和 public surface audit。 | 协议 family、public shell、marker / result / page / receipt / report guardrails。 | 具体 DTO 字段 schema、HTTP/RPC/topic/job trigger、function flow。 |
| §8 逐接口函数级处理流 | `03_ddd_step_09_function_flows.md` | Step 9 shared template、Command / Query / Inbound / Outbound / Job flow、handoff closure。 | flow inventory、关键处理顺序、副作用顺序、no-synthetic 规则摘要。 | protocol schema、状态矩阵、persistence schema、测试 case。 |
| §9 状态机与转换矩阵 | `03_ddd_step_10_state_machine.md` | Step 10 状态族、合法迁移、非法迁移、state owner。 | 状态族、转换矩阵入口、禁止迁移、状态测试入口。 | 新增状态、把错误恢复或持久化规则写成状态事实。 |
| §10 数据持久化、事务与一致性契约 | `03_ddd_step_11_persistence_tx_consistency.md` | Step 11 repository key、store/index、UoW、transaction、version consistency。 | 持久化、事务边界、一致性、repository / index 入口。 | 具体 DB 产品绑定、migration、SQL schema、实现仓私有 map。 |
| §11 错误模型、异常分支与恢复口径 | `03_ddd_step_12_errors_recovery.md` | Step 12 error model、safe message、recovery、degraded / unavailable、retry / DLQ 入口。 | 错误分层、恢复规则、安全错误、不得泄露 raw body。 | acceptance gate、运行手册、未确认产品告警策略。 |
| §12 并发、幂等与重入保护 | `03_ddd_step_13_concurrency_idempotency.md` | Step 13 idempotency key、duplicate replay、commit unknown、race / reentry。 | 幂等、并发、重入、stored replay source 和 no-rerun 规则摘要。 | 自行补 stored result schema、实现侧重跑 mutation、phase boundary。 |
| §13 配置引用与外部依赖绑定 | `03_ddd_step_14_config_dependencies.md` | Step 14 config / dependency boundary、adapter availability、binding owner。 | detailed-design 级配置引用、外部依赖绑定边界、availability 入口。 | 具体 config key/env/default/topic/URL/secret/product selection。 |
| §14 可观测性与审计埋点契约 | `03_ddd_step_15_observability_audit.md` | Step 15 log、metric、trace、audit、redaction、forbidden body。 | 可观测性与审计入口、安全摘要、redaction 规则。 | raw body、provider log、未确认 metrics backend、完整运维手册。 |
| §15 测试切口与最小验证清单 | `03_ddd_step_16_test_cut.md` | Step 16 source coverage、最小测试切口、formal §15 source map。 | 最小验证清单、测试切口入口、后续 05/06/07 handoff。 | 完整 TC ID、fixture schema、run artifact schema、acceptance threshold。 |
| §16 详细设计到实施计划的承接清单 | `03_ddd_step_17_implementation_handoff.md` | Step 17 source matrix、preread candidate、pre-audit、downstream ownership。 | 实施承接输入、pre-audit 维度、implementation starts only after 07 / ledger gates。 | phase / commit boundary、allowed_scope、required_checks、implementation ledger 实例。 |
| §17 风险与待确认事项 | `03_ddd_step_18_risks_open_questions.md` | Step 18 formal §17 candidate 风险表、待确认事项、未确认前处理规则。 | 风险表、待确认事项、未确认前不得补口规则、truth-source watch。 | 把 downstream pending 伪装为已闭口;把具体缺口交给实现仓。 |
| §18 参考 | Step 1~19;`00/01/02`;标准文档 | 当前 Step 19 source map、正式上游、规范和 calibration source。 | 正式引用索引、calibration source 列表、规范列表。 | 旧 Step completed 状态、未读外部材料、implementation commit 链。 |

### 3. calibration source / extension reading 规则

| 规则 | 正式装配要求 |
|---|---|
| 具体文件 | 每章必须列具体中间产物文件,不得只写 `design-calibration` 目录。 |
| 多源章节 | 一个正式章节由多个 Step 合并时,必须逐条列 source 文件。 |
| 延伸阅读 | 延伸阅读必须指出应读中间产物的结构化中间产物、回填草稿、source map、stop-review、待确认事项或对应章节候选。 |
| 不新增契约 | 正式章节正文不得新增未在中间产物中确认的对象、字段、DTO、port、mapper、state、config、test 或 phase。 |
| 过程语气隔离 | SOP 问题、旧材料诊断、方案取舍、差异审计、自检表和停审过程留在 calibration,正式正文只写收口结论。 |
| 行数规则 | 100~300 行只约束单次 patch / 写入批次,不得为了满足批次规模压缩可落码性。 |

### 4. assemblable / forbidden content 分类

| 内容类型 | 装配规则 |
|---|---|
| Step 1~18 的回填草稿、formal candidate、source map、stop-review 结论 | 可装配,但必须改写为正式正文语气。 |
| Step 1~18 的过程推理、方案比较、旧材料扫描和自检表 | 不直接装配;只可转化为收口结论或留在 calibration。 |
| 字段级对象、trait 方法、DTO schema、flow 全量步骤 | 正式 `03` 可给入口和关键摘要;完整真相回指对应 Step。 |
| 下游 04/05/06/07 的具体正文、schema、gate 和 boundary | 禁入正式 `03`;只能写 owner / handoff / pending。 |
| 旧正式 `03` 或旧 Step completed 内容 | 禁入正向装配;只能作为 historical material exclusion。 |
| L1-governance 内容 | 只可作为框架参考;领域事实禁入。 |

### 5. owning Step return route

| 缺口类型 | return route | Step 19 处理 |
|---|---|---|
| formal 章节缺 confirmed source | 对应 source Step 或 Step 19 source map 模块 | 暂停该章装配,不得凭旧材料补正文。 |
| schema / field / DTO / public shell 缺口 | Step 6 / Step 8 | 回 owning Step 补 schema 或 public shell。 |
| trait / port / adapter / mapper / marker 缺口 | Step 7 | 回 Step 7 补正式 port / mapper / marker 来源。 |
| function flow / side effect / no-write 规则缺口 | Step 9 | 回 Step 9 补 flow 和副作用顺序。 |
| state / transition / state owner 缺口 | Step 10 | 回 Step 10 补状态机或转换矩阵。 |
| repository key / persistence / transaction / version 缺口 | Step 11 | 回 Step 11 补持久化和一致性契约。 |
| error / recovery / safe message 缺口 | Step 12 | 回 Step 12 补错误与恢复口径。 |
| idempotency / duplicate replay / stored source 缺口 | Step 13 | 回 Step 13 补幂等与回放来源。 |
| config key / env / secret / product binding 缺口 | Step 14 或后续 `04-配置设计.md` | Step 19 只写 handoff,不得补配置真相源。 |
| TC / fixture / evidence / acceptance 缺口 | Step 16 或后续 `05/06` | Step 19 只写测试切口入口,不得补测试方案或验收标准。 |
| phase / commit boundary / ledger 缺口 | Step 17 或后续 `07-实施计划.md` | Step 19 只写 implementation start redline,不得创建 implementation ledger。 |
| risk / open question owner 缺口 | Step 18 | 回 Step 18 补风险、确认方和未确认前处理规则。 |

### 6. R19.7 进入门禁

| gate item | 状态 | 说明 |
|---|---|---|
| 18 章 source map 已写入 | pass | 已覆盖 §1~§18 的 source、extension reading、可装配和禁入内容。 |
| calibration source 规则已写入 | pass | 已固定具体文件、多源章节、延伸阅读和过程语气隔离规则。 |
| assemblable / forbidden 分类已写入 | pass | 已区分正式正文可装配内容和必须留在 calibration / 下游文档的内容。 |
| owning Step return route 已写入 | pass | 已给缺口回 owning Step / 下游文档的路径。 |
| 正式 `03-详细设计.md` 未修改 | pass | R19.6 不写 formal body 或 skeleton。 |
| 下一模块清楚 | pass | 下一步只能进入 `R19.7 正式文档 skeleton 与写入门禁:先思考`。 |

### 7. R19.6 stop-review

| 检查项 | 结果 |
|---|---|
| 是否写入 18 章 formal source map | pass |
| 是否写入 calibration source / extension reading 规则 | pass |
| 是否写入 assemblable / forbidden content 分类 | pass |
| 是否写入 owning Step return route | pass |
| 是否写入 R19.7 进入门禁 | pass |
| 是否未修改正式 `03-详细设计.md` | pass |
| 是否未写正式章节正文或正式文档 skeleton | pass |
| 是否未写 implementation artifacts | pass |

next_allowed_action: 等待用户确认后进入 Step 19 `R19.7 正式文档 skeleton 与写入门禁:先思考`;只允许思考正式 `03-详细设计.md` skeleton、章节顺序、每章校准来源块模板、正式写入批次、旧正文处理方式和 R19.8 写入门禁;不得直接修改正式 `03-详细设计.md`;不得写正式章节正文、正式实施计划、phase / commit boundary、implementation ledger、evidence schema、CI command、acceptance gate 或 implementation code。

---

## R19.7 正式文档 skeleton 与写入门禁:先思考

### 1. 当前模块目标

`R19.7` 只思考正式 `03-详细设计.md` skeleton 的结构、章节顺序、每章校准来源块模板、正式写入批次、旧正文处理方式和 `R19.8` 写入门禁。当前模块不修改正式 `03-详细设计.md`,不写正式章节正文,不创建正式 skeleton,不进入逐章装配,不写 04/05/06/07 或 implementation artifacts。

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm |
| 用户确认 | 已确认从 `R19.6` 推进到 `R19.7`。 |
| 当前允许 | 思考 formal `03` skeleton 结构、R19.8 写入范围、旧正文替换策略、章节 source block、assembly pending 标记和写入批次。 |
| 当前禁止 | 修改正式 `03-详细设计.md`;写正式章节正文;创建 skeleton;写正式实施计划、phase / commit boundary、implementation ledger、evidence schema、CI command、acceptance gate 或 implementation code。 |

### 2. 旧正式 `03` 处理方式思考

当前 `projects/L3-method-library/03-详细设计.md` 仍含旧 P0 / MethodContent / publish / snapshot / fingerprint / outbox / delivery 主线。它已经被 Step 1~18 判定为 historical material,不能作为本轮正式 `03` 的正向来源。

| 旧内容类型 | R19.8 处理建议 |
|---|---|
| 旧标题、元信息、版本记录 | 用本轮 Step 19 skeleton 元信息替换,不得继承旧版本语义。 |
| 旧 18 章正文 | 全量替换为新版 skeleton,不做局部迁移。 |
| 旧 MethodContent / publish / snapshot / fingerprint / outbox / delivery 主线 | 从正式 skeleton 中移除;如后续需要类似能力,必须来自本轮 Step 1~18 confirmed source。 |
| 旧 P0/P1 范围、旧对象、旧 port、旧 DTO、旧状态、旧测试切口 | 不迁移;后续逐章装配只从本轮 calibration source 写入。 |
| 旧风险与待确认事项 | 不迁移;§17 只从 Step 18 formal candidate 装配。 |

R19.8 可以替换正式 `03-详细设计.md` 的文件内容,但只能写 skeleton 和 source labels。替换动作不是正式正文完成,只是清除旧污染并建立后续逐章装配的安全容器。

### 3. skeleton 结构思考

R19.8 skeleton 应尽量短,但必须完整覆盖正式文档基本结构。它不应该用旧正文作为占位,也不应该写无法验证的契约。

| skeleton 区块 | 内容要求 | 禁止事项 |
|---|---|---|
| 标题 | `# 03-详细设计 · L3-method-library`。 | 保留旧 P0 MethodContent 标题语义。 |
| 文档状态块 | 标明当前为 `Step 19 skeleton` / `formal assembly in progress`,正向来源是 current `00/01/02` 与 Step 1~18。 | 声称正式 `03` 已 completed 或 implementation-ready。 |
| historical reset note | 声明旧正式 `03` 已被本轮 full-restart 判定为 historical material。 | 把旧内容作为可实现事实。 |
| 18 章标题 | 严格按书写规范主链列 §1~§18。 | 改章节顺序或恢复旧章节结构。 |
| 每章校准来源块 | 使用 R19.6 source map 的具体文件列表。 | 只写 `design-calibration` 目录。 |
| 每章 extension reading | 指向对应 Step 的结构化中间产物、回填草稿、source map、stop-review。 | 写泛泛“见上文”或复制过程推理。 |
| 每章 pending marker | 写明本章正文将在后续 R19.x 逐章装配。 | 写正式契约正文或伪装为 completed。 |
| 参考章 | 列正式上游和标准文档入口。 | 列旧 Step completed 或实现仓 commit 链。 |

### 4. 章节顺序思考

R19.8 skeleton 应只固定章节顺序和 source block,正文装配交给后续逐章模块。

| 顺序 | 章节 |
|---|---|
| 1 | 与上游文档的关系声明 |
| 2 | 本次详细设计目标与范围 |
| 3 | 实现约束与编码规范承接 |
| 4 | 实现单元与文件布局 |
| 5 | 模块实现契约 |
| 6 | 全局对象 / Trait / API 索引 |
| 7 | API / Command / Query / Event / Job 协议契约 |
| 8 | 逐接口函数级处理流 |
| 9 | 状态机与转换矩阵 |
| 10 | 数据持久化、事务与一致性契约 |
| 11 | 错误模型、异常分支与恢复口径 |
| 12 | 并发、幂等与重入保护 |
| 13 | 配置引用与外部依赖绑定 |
| 14 | 可观测性与审计埋点契约 |
| 15 | 测试切口与最小验证清单 |
| 16 | 详细设计到实施计划的承接清单 |
| 17 | 风险与待确认事项 |
| 18 | 参考 |

### 5. 每章校准来源块模板思考

R19.8 应按以下模板写每章开头。正文 pending marker 必须明确“未完成”,防止 implementation agent 误把 skeleton 当 completed 文档。

```md
## <n>. <章节标题>

> 校准来源：
> - `design-calibration/<具体 Step 文件>.md`
>
> 延伸阅读：
> - 建议继续阅读上述中间产物的结构化中间产物、回填草稿、source map、stop-review 和待确认事项。

> 装配状态：
> - pending: 本章正文将在 Step 19 后续逐章装配模块中写入。
```

| 模板项 | R19.7 判断 |
|---|---|
| `校准来源` | 必须逐条写具体 source 文件。 |
| `延伸阅读` | 章节可以复用模板,但必须与 source 文件对应。 |
| `装配状态` | R19.8 必须写 pending,后续逐章装配时再移除或改写。 |
| 正文正文 | R19.8 不写正文契约、表格、图或代码块。 |

### 6. R19.8 写入批次思考

R19.8 是第一次允许修改正式 `03-详细设计.md` 的模块,必须保持写入面极窄。

| 写入批次 | 目标 | 文件 | 允许内容 |
|---|---|---|---|
| batch 1 | 替换正式 `03` 为 skeleton | `projects/L3-method-library/03-详细设计.md` | 标题、状态块、historical reset note、18 章标题、每章 source block、pending marker、参考入口。 |
| batch 2 | 记录 R19.8 写入结果 | `03_ddd_step_19_formal_document_assembly.md` | R19.8 写入记录、范围说明、R19.9 进入门禁。 |
| batch 3 | 同步恢复点 | `03_ddd_calibration_flow.md`;`project_execution_ledger.md` | 当前模块、gate_status、next_allowed_action。 |

R19.8 单批写入以 100~300 行为宜;如果 skeleton 超过该规模,可以拆成两个 patch,但不得因此省略章节或 source block。

### 7. R19.8 写入门禁思考

| 门禁 | 进入 R19.8 前必须满足 |
|---|---|
| 用户确认 | 必须由用户确认从 R19.7 进入 R19.8。 |
| 当前恢复点 | flow / ledger / Step 文件均指向 R19.7 completed_wait_user_confirm_to_R19.8。 |
| 正式源基线 | 只使用 current `00/01/02` 和 Step 1~18 confirmed source map。 |
| 旧正文处理 | R19.8 替换旧正文,不得局部迁移旧段落。 |
| 正文边界 | R19.8 只写 skeleton 和 source labels,不写正式章节正文。 |
| 下游边界 | 不写 04/05/06/07、phase、commit、ledger、evidence、CI、acceptance 或 code。 |

### 8. R19.9 预告思考

R19.8 完成后,后续应进入正式正文逐章装配。具体 R19.9 之后的拆分可以在 R19.8 stop-review 中再细化,但当前预告如下:

| 后续模块族 | 初步职责 |
|---|---|
| R19.9+ early chapters | 装配 §1~§4 上游关系、范围、约束和布局。 |
| R19.next module core | 装配 §5~§8 模块、索引、协议和 flow。 |
| R19.next module consistency | 装配 §9~§12 状态、持久化、错误和幂等。 |
| R19.next module handoff | 装配 §13~§17 配置、观测、测试、实施承接、风险。 |
| R19.final | 执行 SOP 七问、自检清单、正式 `03` completed stop-review 和后续文档条件。 |

### 9. R19.7 stop-review

| 检查项 | 结果 |
|---|---|
| 是否只思考 formal skeleton 与写入门禁 | pass |
| 是否形成旧正式 `03` 处理方式 | pass |
| 是否形成 skeleton 结构思考 | pass |
| 是否形成 18 章章节顺序 | pass |
| 是否形成每章校准来源块模板 | pass |
| 是否形成 R19.8 写入批次与门禁 | pass |
| 是否形成后续逐章装配预告 | pass |
| 是否未修改正式 `03-详细设计.md` | pass |
| 是否未写正式章节正文、下游文档或 implementation artifacts | pass |

next_allowed_action: 等待用户确认后进入 Step 19 `R19.8 正式文档 skeleton 与写入门禁:再写入`;只允许将正式 `03-详细设计.md` 替换为 skeleton,内容限于标题、状态块、historical reset note、18 章标题、每章校准来源块、extension reading、assembly pending marker 和参考入口;允许同步 Step 19 文件、flow 和项目台账;不得写正式章节正文、正式实施计划、phase / commit boundary、implementation ledger、evidence schema、CI command、acceptance gate 或 implementation code。

---

## R19.8 正式文档 skeleton 与写入门禁:再写入

### 1. 当前模块状态

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm |
| 用户确认 | 已确认从 `R19.7` 推进到 `R19.8`。 |
| 本模块写入范围 | 正式 `03-详细设计.md` skeleton、R19.8 写入记录、flow 恢复点和项目台账恢复点。 |
| 本模块禁止范围 | 正式章节正文、字段级对象表、DTO schema、trait 签名、flow 步骤、状态矩阵、持久化表、错误矩阵、测试方案、验收标准、实施计划、phase / commit boundary、implementation ledger、evidence schema、CI command、acceptance gate 或 implementation code。 |

### 2. 正式 `03` skeleton 写入结果

R19.8 已将 `projects/L3-method-library/03-详细设计.md` 全量替换为本轮 Step 19 skeleton。该文件当前不是 completed formal detailed design,只是后续逐章装配的安全容器。

| skeleton 区块 | 写入结果 |
|---|---|
| 标题 | 已写入 `# 03-详细设计 · L3-method-library`。 |
| 状态块 | 已标明 `formal assembly skeleton / in_progress`、装配来源、当前说明和 implementation start redline。 |
| historical reset note | 已声明旧正式 `03` 是 historical material,不继承旧正文、旧 completed 状态或旧设计事实。 |
| 18 章标题 | 已按书写规范主链写入 §1~§18。 |
| 每章校准来源 | 已逐章写入具体 calibration source 和上游正式文档来源。 |
| 每章延伸阅读 | 已逐章写入阅读上述中间产物的结构化中间产物、回填草稿、source map、stop-review 和待确认事项。 |
| 每章装配状态 | 已逐章写入 pending marker,防止误判为正文完成。 |
| 参考入口 | 已写入上游正式文档、Step 19 文件和相关 standards 文档入口。 |

### 3. 未写入内容确认

| 内容 | R19.8 处理 |
|---|---|
| §1~§17 正式正文 | 未写入;等待后续逐章装配模块。 |
| 对象 / DTO / trait / port / adapter / mapper / marker 字段级契约 | 未写入;后续正文只能从 Step 5~8 confirmed source 装配。 |
| 函数级 flow、状态矩阵、持久化、错误、并发、配置、观测、测试正文 | 未写入;后续正文只能从 Step 9~16 confirmed source 装配。 |
| 04/05/06/07 正式文档内容 | 未写入;Step 19 只保留下游 pending / owner 口径。 |
| implementation artifacts | 未写入;实现仍 blocked until formal `07` and implementation ledger / boundary gates。 |

### 4. 旧正文替换确认

旧正式 `03-详细设计.md` 的历史正文已被 skeleton 替换。R19.8 没有局部迁移旧段落,也没有把旧正文作为 pending 占位。后续若逐章装配时发现某项正文缺 confirmed source,必须回 owning Step,不得从旧正式正文补口。

### 5. R19.9 进入门禁

| gate item | 状态 | 说明 |
|---|---|---|
| 用户确认 | pending | 需要用户确认后才能进入 `R19.9`。 |
| 正式 skeleton 已写入 | pass | 正式 `03` 已成为 18 章 source-labeled skeleton。 |
| 正文未写入 | pass | R19.8 未写正式章节正文。 |
| 下一步范围 | ready | `R19.9` 只允许思考正式正文装配分批计划。 |

`R19.9 正式正文装配分批计划:先思考` 的允许范围:

- 思考正式正文装配批次,包括 §1~§4、§5~§8、§9~§12、§13~§17、§18 / final 自检的分组策略。
- 思考每批读取哪些 Step source、每批写入哪些章节正文、每批 stop-review 如何判定。
- 思考哪些内容仍必须留在 calibration 或下游文档,不能进入正式 `03`。

`R19.9` 的禁止范围:

- 不得写正式章节正文。
- 不得修改 04/05/06/07。
- 不得创建 phase / commit boundary、implementation ledger、evidence schema、CI command、acceptance gate 或 implementation code。

### 6. R19.8 stop-review

| 检查项 | 结果 |
|---|---|
| 是否只按门禁替换正式 `03` 为 skeleton | pass |
| 是否写入标题、状态块和 historical reset note | pass |
| 是否写入 18 章标题 | pass |
| 是否逐章写入具体校准来源 | pass |
| 是否逐章写入延伸阅读和 pending marker | pass |
| 是否未写正式章节正文 | pass |
| 是否未写下游文档或 implementation artifacts | pass |
| 是否同步 flow 与项目台账恢复点 | pass |

next_allowed_action: 等待用户确认后进入 Step 19 `R19.9 正式正文装配分批计划:先思考`;只允许思考正式正文装配批次、每批 source 读取范围、每批写入边界、每批 stop-review 和禁入内容;不得写正式章节正文、正式实施计划、phase / commit boundary、implementation ledger、evidence schema、CI command、acceptance gate 或 implementation code。

---

## R19.9 正式正文装配分批计划:先思考

### 1. 当前模块目标

`R19.9` 只思考正式 `03-详细设计.md` 正文装配的分批计划。当前模块不修改正式 `03-详细设计.md`,不写任何章节正文,不移除 skeleton pending marker,不进入 04/05/06/07,也不写 implementation artifacts。

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm |
| 用户确认 | 已确认从 `R19.8` 推进到 `R19.9`。 |
| 当前允许 | 思考正式正文装配批次、每批 source 读取范围、每批写入边界、stop-review、缺口回退路线和 R19.10 写入计划。 |
| 当前禁止 | 修改正式 `03-详细设计.md`;写正式章节正文;补对象 / DTO / port / flow / state / config / evidence / phase;进入 04/05/06/07 或 implementation code。 |

### 2. L1-governance 框架借鉴思考

L1-governance Step 19 使用一份完整 assembly 记录完成正式 `03`。该框架可借鉴的是 18 章主链、每章校准来源、SOP 问题回答、自检清单和进入后续文档条件;不可复制的是 governance 领域事实、模块数量、协议数量、实现仓路径和一次性装配节奏。

| L1-governance 形态 | L3-method-library 适配 |
|---|---|
| Step 19 直接装配正式 `03` 完整正文 | L3 不直接一次性装配;先 skeleton,再逐批装配正文。 |
| §4 装配策略表覆盖 18 章 | L3 需要在 R19.10 固化更细的正文写入批次。 |
| §5 SOP 问题回答 | L3 放到 final self-check 批次,不能在正文未完成前提前声称通过。 |
| §7 自检清单 | L3 每批都要有局部 stop-review,最终再执行全局自检。 |
| §8 进入后续文档条件 | L3 只能在 §1~§18 正文完成后判断,不得在 skeleton 阶段通过。 |

### 3. 正文装配分批原则思考

正式正文装配需要比 skeleton 更严格,因为一旦进入正式 `03`,实现 agent 会把它当作真相源入口。分批时必须保持每批来源闭合、章节邻接、写入面可审查。

| 原则 | R19.9 判断 |
|---|---|
| 先计划后正文 | R19.10 先写分批计划;R19.11 以后才允许正式正文写入。 |
| 每批一个主题族 | 不把对象契约、协议、flow、状态、持久化和测试混在一次写入里。 |
| 每批先思考再写入 | 每个正文批次继续采用 `先思考 -> 再写入`。 |
| 正式正文只写收口结论 | 字段级全量细节仍回指 Step 文件,不复制中间产物全文。 |
| pending marker 有序移除 | 只有写入某章正文时,才能替换该章 pending marker。 |
| 缺口立即暂停 | 若正文需要的 schema / port / state / mapper / config / evidence / phase 不闭合,必须回 owning Step。 |
| 单批写入规模 | 100~300 行是单次 patch 规模建议,不是正式文件最终长度上限。 |

### 4. 推荐正文批次思考

正式正文应按“入口与边界 -> 模块契约 -> 协议与 flow -> 一致性闭环 -> 横切与承接 -> 最终自检”的顺序推进。

| 批次族 | 章节 | source | 装配重点 | 写入风险 |
|---|---|---|---|---|
| early boundary | §1~§4 | Step 1~4 + `00/01/02` | 上游关系、范围、实现约束、文件布局 | 容易把旧正文或下游文档内容带入。 |
| module core | §5 | Step 5~7 | 模块实现契约主轴、职责、对象 / port / adapter 边界 | 容易退化为全局对象堆表。 |
| index and protocol | §6~§7 | Step 6~8 | 全局索引、API / Command / Query / Event / Job public surface | 容易替代字段级 Step 或漏 public marker。 |
| function flow | §8 | Step 9 | 逐接口 flow inventory、共享模板、关键副作用顺序 | 容易写得过浅或一次性压缩重要 flow。 |
| consistency core | §9~§12 | Step 10~13 | 状态机、持久化、错误恢复、并发幂等 | 容易出现 state / persistence / replay 口径不一致。 |
| cross-cutting and test | §13~§15 | Step 14~16 | 配置绑定、观测审计、最小测试切口 | 容易越界到完整配置设计或测试方案。 |
| handoff and risk | §16~§17 | Step 17~18 | 实施承接、风险、待确认事项、未确认前处理规则 | 容易提前写 phase / commit boundary。 |
| reference and final gate | §18 + SOP self-check | Step 19 + standards | 参考索引、SOP 七问、自检、后续文档条件 | 只能在正文完成后判断 completed。 |

### 5. 建议 R19.x 小循环思考

| 模块 | 类型 | 职责 | 是否允许修改正式 `03` |
|---|---|---|---|
| R19.10 | 分批计划:再写入 | 固化正文分批计划、每批 source、写入边界和 stop-review。 | no |
| R19.11 | §1~§4:先思考 | 思考 early boundary 正文结构和禁入内容。 | no |
| R19.12 | §1~§4:再写入 | 写正式 §1~§4 正文。 | yes |
| R19.13 | §5:先思考 | 思考模块实现契约正文结构。 | no |
| R19.14 | §5:再写入 | 写正式 §5 正文。 | yes |
| R19.15 | §6~§7:先思考 | 思考索引与协议正文结构。 | no |
| R19.16 | §6~§7:再写入 | 写正式 §6~§7 正文。 | yes |
| R19.17 | §8:先思考 | 思考 flow 正文结构和 flow inventory 摘要粒度。 | no |
| R19.18 | §8:再写入 | 写正式 §8 正文。 | yes |
| R19.19 | §9~§12:先思考 | 思考状态、持久化、错误、幂等正文结构。 | no |
| R19.20 | §9~§12:再写入 | 写正式 §9~§12 正文。 | yes |
| R19.21 | §13~§15:先思考 | 思考配置、观测、测试切口正文结构。 | no |
| R19.22 | §13~§15:再写入 | 写正式 §13~§15 正文。 | yes |
| R19.23 | §16~§17:先思考 | 思考实施承接、风险和待确认事项正文结构。 | no |
| R19.24 | §16~§17:再写入 | 写正式 §16~§17 正文。 | yes |
| R19.25 | §18 与全局自检:先思考 | 思考参考章、SOP 七问、全局自检和进入后续文档条件。 | no |
| R19.26 | §18 与全局自检:再写入 | 写正式 §18,执行 Step 19 completed stop-review。 | yes |

### 6. 每批 stop-review 思考

每个正文写入批次完成后,Step 19 文件必须留下局部 stop-review,并同步 flow / 项目台账。局部 stop-review 至少回答:

| 检查项 | 说明 |
|---|---|
| source 是否闭合 | 所写章节是否只来自已确认 Step source。 |
| pending marker 是否只移除已写章节 | 未写章节必须继续保留 pending marker。 |
| 正文是否足够作为入口 | 是否能指导实现者找到对象、port、protocol、flow、state、test 的正式入口。 |
| 是否复制过程语气 | SOP 问题、取舍过程、差异审计和 stop-review 不进入正式正文。 |
| 是否越界下游 | 04/05/06/07、phase、commit、ledger、evidence、CI、acceptance 不得被提前写成正式结论。 |
| 是否存在闭口缺口 | 若发现缺 schema / port / DTO / state / mapper / config / evidence / phase,必须暂停回 owning Step。 |

### 7. R19.10 写入计划思考

`R19.10 正式正文装配分批计划:再写入` 应写入以下内容:

1. 固化正文装配批次总表。
2. 固化每批 source 读取清单。
3. 固化每批正式 `03` 写入范围和禁入范围。
4. 固化每批 pending marker 处理规则。
5. 固化每批 stop-review 必答项。
6. 写入 `R19.11 §1~§4 正式正文装配:先思考` 进入门禁。
7. 不修改正式 `03-详细设计.md`,不写正式正文。

### 8. R19.9 stop-review

| 检查项 | 结果 |
|---|---|
| 是否只思考正式正文装配分批计划 | pass |
| 是否参考 L1-governance 框架但未复制领域事实 | pass |
| 是否形成正文分批原则 | pass |
| 是否形成推荐正文批次 | pass |
| 是否形成 R19.x 小循环建议 | pass |
| 是否形成每批 stop-review 思考 | pass |
| 是否形成 R19.10 写入计划 | pass |
| 是否未修改正式 `03-详细设计.md` | pass |
| 是否未写正式章节正文、下游文档或 implementation artifacts | pass |

next_allowed_action: 等待用户确认后进入 Step 19 `R19.10 正式正文装配分批计划:再写入`;只允许写入正文装配批次总表、每批 source 读取清单、每批正式 `03` 写入范围和禁入范围、pending marker 处理规则、每批 stop-review 必答项和 `R19.11` 进入门禁;不得修改正式 `03-详细设计.md`;不得写正式章节正文、正式实施计划、phase / commit boundary、implementation ledger、evidence schema、CI command、acceptance gate 或 implementation code。

---

## R19.10 正式正文装配分批计划:再写入

### 1. 当前模块状态

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm |
| 用户确认 | 已确认从 `R19.9` 推进到 `R19.10`。 |
| 本模块写入范围 | 正文装配批次总表、每批 source 读取清单、每批正式 `03` 写入范围和禁入范围、pending marker 处理规则、每批 stop-review 必答项和 `R19.11` 进入门禁。 |
| 本模块禁止范围 | 修改正式 `03-详细设计.md`;写正式章节正文;写正式实施计划、phase / commit boundary、implementation ledger、evidence schema、CI command、acceptance gate 或 implementation code。 |

### 2. 正文装配批次总表

正式 `03-详细设计.md` 正文装配从 `R19.11` 开始。每个正文批次继续保持“先思考 -> 再写入”,且只有 `再写入` 模块允许修改正式 `03` 对应章节。

| 批次 | 模块 | 章节 | 批次目标 | 正式 `03` 写入 |
|---|---|---|---|---|
| B1 | R19.11 / R19.12 | §1~§4 | 装配上游关系、范围、实现约束和文件布局。 | R19.12 |
| B2 | R19.13 / R19.14 | §5 | 装配模块实现契约主轴。 | R19.14 |
| B3 | R19.15 / R19.16 | §6~§7 | 装配全局索引和协议契约。 | R19.16 |
| B4 | R19.17 / R19.18 | §8 | 装配逐接口函数级处理流入口。 | R19.18 |
| B5 | R19.19 / R19.20 | §9~§12 | 装配状态、持久化、错误恢复、并发幂等。 | R19.20 |
| B6 | R19.21 / R19.22 | §13~§15 | 装配配置、观测审计、测试切口。 | R19.22 |
| B7 | R19.23 / R19.24 | §16~§17 | 装配实施承接、风险和待确认事项。 | R19.24 |
| B8 | R19.25 / R19.26 | §18 + 全局自检 | 装配参考章、SOP 七问、全局 stop-review 和后续文档条件。 | R19.26 |

### 3. 每批 source 读取清单

| 批次 | 必读 source | 辅助 source |
|---|---|---|
| B1 §1~§4 | `00-需求文档.md`;`01-架构设计.md`;`02-概要设计.md`;`03_ddd_step_01_input_boundary.md`;`03_ddd_step_02_scope.md`;`03_ddd_step_03_runtime_constraints.md`;`03_ddd_step_04_module_layout.md` | `详细设计书写规范.md`;`设计文档讨论中间产物规范.md` |
| B2 §5 | `03_ddd_step_05_module_contracts.md`;`03_ddd_step_06_object_contracts.md`;`03_ddd_step_07_trait_port_adapter.md` | `02-概要设计.md`;L1-governance Step 19 framework reference |
| B3 §6~§7 | `03_ddd_step_06_object_contracts.md`;`03_ddd_step_07_trait_port_adapter.md`;`03_ddd_step_08_protocol_contracts.md` | `设计真相源闭环与可落码性标准.md` |
| B4 §8 | `03_ddd_step_09_function_flows.md` | Step 6~8 source maps;`详细设计书写规范.md` |
| B5 §9~§12 | `03_ddd_step_10_state_machine.md`;`03_ddd_step_11_persistence_tx_consistency.md`;`03_ddd_step_12_errors_recovery.md`;`03_ddd_step_13_concurrency_idempotency.md` | Step 8~9 protocol / flow source maps |
| B6 §13~§15 | `03_ddd_step_14_config_dependencies.md`;`03_ddd_step_15_observability_audit.md`;`03_ddd_step_16_test_cut.md` | `04/05/06/07` blocked status in project ledger |
| B7 §16~§17 | `03_ddd_step_17_implementation_handoff.md`;`03_ddd_step_18_risks_open_questions.md` | `设计真相源闭环与可落码性标准.md`;implementation ledger standards as downstream reference only |
| B8 §18 + final | `03_ddd_step_19_formal_document_assembly.md`;`03_ddd_calibration_flow.md`;`project_execution_ledger.md`;Step 1~18 files | `详细设计讨论流程_SOP.md`;`详细设计书写规范.md`;`设计文档讨论中间产物规范.md` |

### 4. 每批正式 `03` 写入范围和禁入范围

| 批次 | 允许写入正式 `03` 的内容 | 禁入内容 |
|---|---|---|
| B1 | §1~§4 的正式正文、上游关系、范围、非范围、实现约束、文件布局摘要。 | 对象字段、DTO、port、protocol、flow、状态、持久化、测试、实施 phase。 |
| B2 | §5 的模块主轴、模块职责、模块内对象 / port / adapter 边界入口。 | 把 §5 写成全局对象清单;新增 Step 5~7 未闭口对象或 port。 |
| B3 | §6~§7 的全局索引、protocol inventory、public shell 摘要和回指入口。 | 替代字段级 Step;自行补 DTO field、marker、mapper 或 response schema。 |
| B4 | §8 的 flow inventory、共享处理模板、关键副作用顺序和异常分支入口。 | 重写 Step 9 全量 flow;补未确认 side effect、transaction 或 fallback。 |
| B5 | §9~§12 的状态族、持久化 / transaction、一致性、错误恢复、幂等摘要。 | 自行修正 state owner、repository key、replay source 或 error schema。 |
| B6 | §13~§15 的配置引用、外部依赖绑定、观测审计、最小测试切口。 | 写完整配置设计、测试方案、验收标准、CI matrix 或 evidence schema。 |
| B7 | §16~§17 的实施承接、未确认前处理规则、风险和待确认事项。 | 创建正式 phase / commit boundary、allowed_scope、required_checks 或 implementation ledger。 |
| B8 | §18 参考、SOP 七问、全局自检、进入后续文档条件。 | 在正文未完成前声称 completed;跳过 04/05/06/07 条件。 |

### 5. pending marker 处理规则

| 规则 | 正式处理 |
|---|---|
| 只替换当前批章节 | 每个 `再写入` 模块只能移除或替换本批章节的 pending marker。 |
| 未写章节保留 pending | 未进入对应批次的章节必须继续保留 pending marker。 |
| source block 保留 | 已有校准来源和延伸阅读块保留,必要时可补充但不得删除 source 入口。 |
| 正文完成标记 | 章节正文写入后,装配状态必须从 pending 改为 assembled_by_R19.xx,并标明 source。 |
| 缺口处理 | 如果本批正文无法闭口,不得半写正式正文;必须在 Step 19 记录 blocker 并回 owning Step。 |

### 6. 每批 stop-review 必答项

| 必答项 | pass 条件 |
|---|---|
| source closure | 本批正式正文只来自列明 source,无旧正式 `03` 正向迁移。 |
| body boundary | 正式正文只写收口结论和实现入口,不复制中间产物过程语气。 |
| implementation usability | 实现者能通过本章找到字段级 source、protocol source、flow source 或 downstream owner。 |
| no hidden schema | 没有在正式正文中新造对象、字段、DTO、port、mapper、marker、config key 或 evidence schema。 |
| pending marker discipline | 只更新本批章节装配状态,未写章节仍 pending。 |
| downstream boundary | 未提前写 04/05/06/07、phase / commit boundary、implementation ledger、CI 或 acceptance。 |
| recovery sync | Step 19 文件、flow 和项目台账同步到下一模块。 |

### 7. R19.11 进入门禁

| gate item | 状态 | 说明 |
|---|---|---|
| 正文分批计划已固化 | pass | 已固化 B1~B8 批次和 R19.11~R19.26 小循环。 |
| 每批 source 已列明 | pass | 已列出每批必读 source 和辅助 source。 |
| 每批写入边界已列明 | pass | 已列出正式 `03` 写入范围和禁入内容。 |
| pending marker 规则已列明 | pass | 已固定只替换当前批章节。 |
| 本模块未修改正式 `03` | pass | R19.10 只写 Step 19 计划。 |

`R19.11 §1~§4 正式正文装配:先思考` 的允许范围:

- 读取并思考 §1~§4 source。
- 思考 §1 上游关系、旧材料隔离、本文回答 / 不回答边界。
- 思考 §2 详细设计目标、范围、非范围和下游文档边界。
- 思考 §3 实现约束、编码规范、仓库 / runtime / 安全边界。
- 思考 §4 实现单元、文件布局、依赖方向和 layout 摘要。
- 形成 `R19.12 §1~§4 正式正文装配:再写入` 写入计划。

`R19.11` 的禁止范围:

- 不得修改正式 `03-详细设计.md`。
- 不得写 §1~§4 正文。
- 不得写 §5 以后正文、下游文档、phase / commit boundary、implementation ledger、evidence schema、CI command、acceptance gate 或 implementation code。

### 8. R19.10 stop-review

| 检查项 | 结果 |
|---|---|
| 是否固化正文装配批次总表 | pass |
| 是否固化每批 source 读取清单 | pass |
| 是否固化每批正式 `03` 写入范围和禁入范围 | pass |
| 是否固化 pending marker 处理规则 | pass |
| 是否固化每批 stop-review 必答项 | pass |
| 是否写入 R19.11 进入门禁 | pass |
| 是否未修改正式 `03-详细设计.md` | pass |
| 是否未写正式章节正文、下游文档或 implementation artifacts | pass |

next_allowed_action: 等待用户确认后进入 Step 19 `R19.11 §1~§4 正式正文装配:先思考`;只允许读取并思考 §1~§4 source、正文结构、禁入内容和 `R19.12` 写入计划;不得修改正式 `03-详细设计.md`;不得写正式章节正文、正式实施计划、phase / commit boundary、implementation ledger、evidence schema、CI command、acceptance gate 或 implementation code。

---

## R19.11 §1~§4 正式正文装配:先思考

### 1. 当前模块目标

`R19.11` 只思考正式 `03-详细设计.md` §1~§4 的正文结构、source 读取结果、压缩规则、禁入内容和 `R19.12` 写入计划。当前模块不修改正式 `03-详细设计.md`,不写 §1~§4 正文,不移除 pending marker,不进入 §5 或后续章节,也不写下游文档或 implementation artifacts。

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm |
| 用户确认 | 已确认从 `R19.10` 推进到 `R19.11`。 |
| 当前允许 | 读取并思考 §1~§4 source、正文结构、压缩规则、禁入内容、pending marker 处理和 R19.12 写入计划。 |
| 当前禁止 | 修改正式 `03-详细设计.md`;写正式章节正文;写 §5 以后正文;补对象 / DTO / port / mapper / state / config / evidence / phase;进入 04/05/06/07 或 implementation code。 |

### 2. source 读取结果

| 章节 | 主要 source | 读取结论 | R19.12 用法 |
|---|---|---|---|
| §1 与上游文档的关系声明 | `03_ddd_step_01_input_boundary.md` R1.12;`00/01/02` | 已有 §1 可回填草稿,包含上游关系映射、本文不再回答、本文必须回答和 historical material 声明。 | 可直接压缩装配;Step 1 的 §17 草稿不进入本批。 |
| §2 本次详细设计目标与范围 | `03_ddd_step_02_scope.md` R2.14;`00/02` | 已有 §2 可回填草稿,包含设计目标、覆盖范围与展开深度、非范围、历史范围替换口径和回退承接。 | 可按 2.1~2.5 装配,但需删除中间产物说明和代码围栏。 |
| §3 实现约束与编码规范承接 | `03_ddd_step_03_runtime_constraints.md` R3.16;书写规范 / Rust 规范 | 已有 §3 中间产物草稿,包含编码规范承接、语言注释约束、runtime / framework、本地多仓依赖、安全边界、历史差异和后续 Step 承接。 | 可装配为正式约束章,但不得把示例 path dependency 当 implementation-ready 结论。 |
| §4 实现单元与文件布局 | `03_ddd_step_04_module_layout.md` R4.16;`02-概要设计.md` | 已有 §4 中间产物草稿,包含 workspace 多 crate 裁决、七个实现单元、目录 / package / crate / binary 映射、文件布局树、职责表、依赖排除和命名检查。 | 可完整装配主体,但应保留“实施前复核目标仓路径 / core-contracts 相对路径”的红线。 |

### 3. §1 正文结构思考

正式 §1 应承接 Step 1 的可回填草稿,但不复制 Step 1 的过程记录、风险表和 §17 草稿。§1 的作用是告诉实现者“本文从哪里来、本文不回答什么、本文必须回答什么、旧材料如何处理”。

| 正式小节 | 写入策略 | 禁入内容 |
|---|---|---|
| `1.1 上游关系映射` | 保留 `00/01/02` 与规范的输入关系表,把 `02_hld_step_12`~`02_hld_step_14` 标为解释性输入。 | 复制 Step 1 开工、框架学习、旧材料扫描过程。 |
| `1.2 本文不再回答` | 保留需求目标、架构边界、Definition vs Use、八组件成立性和 peripheral 边界不在 03 重答。 | 重新讨论需求、架构、业务背景或验收目标。 |
| `1.3 本文必须回答` | 保留 Step 3~17 的承接问题清单,作为正文后续章节导航。 | 提前写对象字段、port 签名、protocol schema 或 test evidence。 |
| `1.4 历史材料声明` | 保留旧 `03` / 旧 Step 文件 historical material 定位和旧主线禁入。 | 把旧内容作为正式来源或补口依据。 |

### 4. §2 正文结构思考

正式 §2 应从 Step 2 R2.14 草稿装配,用于固定本轮详细设计目标、覆盖深度、非范围和回退规则。它不应成为对象、port、状态或持久化章节。

| 正式小节 | 写入策略 | 禁入内容 |
|---|---|---|
| `2.1 设计目标` | 保留九项目标表,覆盖八组件和横切契约。 | 使用旧 P0 / P1、旧 publish / snapshot / outbox 主线作为目标。 |
| `2.2 覆盖范围与展开深度` | 保留 core / support / operation / peripheral / cross-cutting 分层表和后续 Step 落点。 | 写对象字段、trait 方法、protocol field 或 DDL。 |
| `2.3 非范围` | 保留相邻仓 truth、外部正文、配置、测试、验收、实施、运维、未确认范围的归属表。 | 用非范围排除已纳入 support / operation / peripheral 的有界 contract。 |
| `2.4 历史范围替换口径` | 保留旧主线到当前口径的替换表。 | 恢复旧 `MethodContent`、publish lifecycle、snapshot / fingerprint、outbox / delivery。 |
| `2.5 回退与后续承接` | 保留概要层和后续文档回退规则。 | 把 04/05/06/07 的完整正文提前写入 03。 |

### 5. §3 正文结构思考

正式 §3 应从 Step 3 R3.16 装配为全局实现约束章,让后续对象、port、protocol、flow 和 implementation agent 都知道不能越过哪些边界。

| 正式小节 | 写入策略 | 禁入内容 |
|---|---|---|
| `3.1 编码规范承接` | 保留 Rust 编码规范、详细设计书写规范、可落码标准、README / git config 的承接表。 | 把设计文档 Rust 片段当成可直接复制的生产源码。 |
| `3.2 语言、注释与契约表达约束` | 保留设计文档可中文说明、实现仓源码必须英文的分层规则。 | 要求实现仓写中文 rustdoc、中文错误文本或中文测试名。 |
| `3.3 Runtime / framework 约束` | 保留不锁定 HTTP / RPC / database / queue / scheduler / worker / cache / object storage 的口径。 | 在 §3 固定 PostgreSQL、L0-bus transport、cache、queue 或 worker 实现。 |
| `3.4 本地多仓依赖约束` | 保留 `core-contracts` compile dependency candidate 和运行期 / 事件协作排除。 | 把 `L0-bus`、process、identity、runtime、member-images 写成 Cargo dependency。 |
| `3.5 安全 / 鉴权 / 外部边界` | 保留 actor / metadata / source context、外部正文禁区、下游运行 truth 禁区和安全观测边界。 | 写 auth / gateway / credential store / external body storage 实现。 |
| `3.6 旧 Step 3 差异审计结论` | 保留旧口径 ban / defer / redefine 摘要。 | 复制旧审计长表或旧正式正文。 |
| `3.7 后续 Step 承接与停审规则` | 保留 Step 4~15 必须继承的约束和缺口暂停规则。 | 把后续 Step 的字段、schema、config key 或 evidence schema 提前补齐。 |

### 6. §4 正文结构思考

正式 §4 可比 §1~§3 更完整,因为文件布局树和文件职责表是实现者直接需要的入口。R19.12 应尽量完整装配 Step 4 R4.16 草稿,但仍避免把对象字段、trait 方法、DTO schema 或状态矩阵提前写入。

| 正式小节 | 写入策略 | 禁入内容 |
|---|---|---|
| `4.1 布局形态决策` | 保留四类候选布局和采用 / 不采用理由。 | 复制 L1-governance crate 数量或恢复旧单体 /旧 P0 布局。 |
| `4.2 实现单元总表` | 保留 `contracts/domain/application/infra/api/worker/jobs` 七个实现单元。 | 按八个业务组成部分机械拆 crate。 |
| `4.3 目录 / Package / Crate / Binary 映射表` | 保留目标仓、slug、member、package、crate / binary 映射。 | 把路径复核从实施门禁中移除。 |
| `4.4 文件布局树` | 完整保留可创建文件树。 | 在树中写对象字段、trait method、数据库迁移、具体 transport 或 auth 实现。 |
| `4.5 文件职责表` | 保留文件路径、所属模块、定义内容、主要责任。 | 模糊文件名或万能 `utils.rs` / `helper.rs`。 |
| `4.6 编译期依赖与非 Cargo 依赖排除` | 保留 `core-contracts` 候选、内部依赖方向预告和外部关系排除。 | 把 runtime / event collaboration 写成 Cargo dependency。 |
| `4.7 命名检查与禁入项` | 保留命名检查、旧主线泄漏和外部仓泄漏禁入。 | 使用 L0/L1/L2/L3 层级名作为 crate / package 主语。 |
| `4.8 Step 5 进入条件` | 保留 Step 5 只能基于当前布局继续的门禁。 | 在 §4 继续写 §5 模块契约正文。 |

### 7. R19.12 写入计划思考

`R19.12 §1~§4 正式正文装配:再写入` 应只修改正式 `03-详细设计.md` 的 §1~§4 区域,并同步 Step 19 文件、flow 和项目台账。

| 写入批次 | 文件 | 内容 |
|---|---|---|
| batch 1 | `projects/L3-method-library/03-详细设计.md` | 替换 §1~§4 的 pending skeleton 为正式正文,保留每章校准来源和延伸阅读,装配状态改为 `assembled_by_R19.12`。 |
| batch 2 | `03_ddd_step_19_formal_document_assembly.md` | 记录 R19.12 写入结果、§1~§4 source closure、pending marker 处理和 stop-review。 |
| batch 3 | `03_ddd_calibration_flow.md`;`project_execution_ledger.md` | 恢复点推进到 `R19.13 §5 正式正文装配:先思考`。 |

R19.12 禁止:

- 修改 §5~§18 正文或移除其 pending marker。
- 写 §17 风险正文;Step 1 的 §17 草稿留给 B7 / Step 18 source 汇总。
- 新增对象字段、DTO schema、port 方法、mapper、state、config key、evidence schema、phase / commit boundary 或 implementation ledger。
- 把旧正式 `03` 或旧 Step completed 状态作为正向来源。

### 8. R19.11 stop-review

| 检查项 | 结果 |
|---|---|
| 是否读取 §1~§4 主要 source | pass |
| 是否确认 §1~§4 均有可装配中间产物草稿 | pass |
| 是否形成 §1 正文结构思考 | pass |
| 是否形成 §2 正文结构思考 | pass |
| 是否形成 §3 正文结构思考 | pass |
| 是否形成 §4 正文结构思考 | pass |
| 是否形成 R19.12 写入计划 | pass |
| 是否未修改正式 `03-详细设计.md` | pass |
| 是否未写正式章节正文、下游文档或 implementation artifacts | pass |

next_allowed_action: 等待用户确认后进入 Step 19 `R19.12 §1~§4 正式正文装配:再写入`;只允许替换正式 `03-详细设计.md` §1~§4 pending skeleton 为正式正文、保留 source / extension reading、标记 `assembled_by_R19.12`,并同步 Step 19 文件、flow 和项目台账;不得修改 §5~§18 正文或 pending marker;不得写正式实施计划、phase / commit boundary、implementation ledger、evidence schema、CI command、acceptance gate 或 implementation code。

---

## R19.12 §1~§4 正式正文装配:再写入

### 1. 当前模块状态

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm |
| 用户确认 | 已确认从 `R19.11` 推进到 `R19.12`。 |
| 本模块写入范围 | 正式 `03-详细设计.md` §1~§4 正文、每章 `assembled_by_R19.12` 状态、正式 `03` 顶部 partial assembly 状态说明、Step 19 / flow / 项目台账恢复点。 |
| 本模块禁止范围 | 修改 §5~§18 正文或 pending marker;写 §17 风险正文;新增对象字段、DTO schema、port 方法、mapper、state、config key、evidence schema、phase / commit boundary、implementation ledger、CI command、acceptance gate 或 implementation code。 |

### 2. 正式 `03-详细设计.md` 写入结果

| 章节 | 写入结果 | 装配状态 |
|---|---|---|
| §1 与上游文档的关系声明 | 已写入上游关系映射、本文不再回答、本文必须回答、历史材料声明。 | `assembled_by_R19.12` |
| §2 本次详细设计目标与范围 | 已写入设计目标、覆盖范围与展开深度、非范围、历史范围替换口径、回退与后续承接。 | `assembled_by_R19.12` |
| §3 实现约束与编码规范承接 | 已写入编码规范、语言注释、runtime / framework、多仓依赖、安全边界、旧 Step 3 差异审计、后续章节承接规则。 | `assembled_by_R19.12` |
| §4 实现单元与文件布局 | 已写入布局形态、七个实现单元、目录 / package / crate / binary 映射、文件布局树、职责表、依赖排除、命名检查和 §5 进入条件。 | `assembled_by_R19.12` |
| §5~§18 | 未修改正文;仍保留 pending marker。 | pending |

正式 `03` 顶部状态同步为 partial assembly:§1~§4 已装配,§5~§18 待后续 R19.x 逐章装配。historical reset note 中的 “skeleton” 表述同步为 “本文件”,避免与部分装配状态冲突。

### 3. source closure

| 章节 | 正向 source | 装配裁决 |
|---|---|---|
| §1 | `03_ddd_step_01_input_boundary.md` R1.12;正式 `00/01/02` | 只装配 Step 1 的 §1 草稿;Step 1 的 §17 草稿未进入本批。 |
| §2 | `03_ddd_step_02_scope.md` R2.14;正式 `00/02` | 删除中间产物围栏和过程语气,保留范围 / 非范围 / 回退收口结论。 |
| §3 | `03_ddd_step_03_runtime_constraints.md` R3.16;`详细设计书写规范.md` | 保留约束和后续承接规则;`core-contracts` path 仅作为实施前核对候选,不是 implementation-ready 保证。 |
| §4 | `03_ddd_step_04_module_layout.md` R4.16;正式 `02` | 保留 layout、file tree、职责表和依赖排除;未写对象字段、trait 方法、DTO schema 或状态矩阵。 |

### 4. pending marker 处理

| marker | 处理 |
|---|---|
| §1~§4 pending | 已替换为 `assembled_by_R19.12`。 |
| §5~§18 pending | 保持不变,等待 R19.14 及后续正文装配模块。 |
| source / extension reading block | 每章均保留。 |
| missing source / blocker | 本批未发现需要回 owning Step 的 blocker。 |

### 5. 禁入内容确认

| 禁入项 | 结果 |
|---|---|
| 是否修改 §5~§18 正文或 pending marker | no |
| 是否写入 §17 风险正文 | no |
| 是否新增对象字段、DTO schema、port 方法、mapper、state、config key 或 evidence schema | no |
| 是否写入正式实施计划、phase / commit boundary、implementation ledger、CI command 或 acceptance gate | no |
| 是否把旧正式 `03` 或旧 Step completed 状态作为正向来源 | no |

### 6. R19.13 进入门禁

`R19.13 §5 正式正文装配:先思考` 的允许范围:

- 读取并思考 §5 source。
- 思考模块实现契约正文结构、模块主轴、对象 / port / adapter 回指方式、禁入内容和 `R19.14` 写入计划。
- 不修改正式 `03-详细设计.md`。

`R19.13` 的禁止范围:

- 不得写正式 §5 正文。
- 不得修改 §1~§4 已装配正文或 §6~§18 pending marker。
- 不得新增对象字段、DTO schema、port 方法、mapper、state、config key、evidence schema、phase / commit boundary、implementation ledger、CI command、acceptance gate 或 implementation code。

### 7. R19.12 stop-review

| 检查项 | 结果 |
|---|---|
| 是否按 R19.11 计划装配 §1~§4 | pass |
| 是否保留每章校准来源和延伸阅读 | pass |
| 是否只使用 Step 1~4 confirmed source 和正式 `00/01/02` | pass |
| 是否清除 §1~§4 pending marker 并标记 `assembled_by_R19.12` | pass |
| 是否保留 §5~§18 pending marker | pass |
| 是否未写下游 04/05/06/07 或 implementation artifacts | pass |
| 是否同步 flow 和项目台账到 R19.13 等待确认 | pass |

next_allowed_action: 等待用户确认后进入 Step 19 `R19.13 §5 正式正文装配:先思考`;只允许读取并思考 §5 source、模块实现契约正文结构、禁入内容和 `R19.14` 写入计划;不得修改正式 `03-详细设计.md`;不得写正式章节正文、正式实施计划、phase / commit boundary、implementation ledger、evidence schema、CI command、acceptance gate 或 implementation code。

---

## R19.13 §5 正式正文装配:先思考

### 1. 当前模块目标

`R19.13` 只思考正式 `03-详细设计.md` §5 的 source 读取结果、正文结构、压缩规则、禁入内容和 `R19.14` 写入计划。当前模块不修改正式 `03-详细设计.md`,不写 §5 正文,不移除 §5 pending marker,不进入 §6 或后续章节,也不写下游文档或 implementation artifacts。

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm |
| 用户确认 | 已确认从 `R19.12` 推进到 `R19.13`。 |
| 当前允许 | 读取并思考 §5 source、模块实现契约正文结构、对象 / port / adapter 回指方式、禁入内容和 R19.14 写入计划。 |
| 当前禁止 | 修改正式 `03-详细设计.md`;写正式 §5 正文;修改 §1~§4 已装配正文或 §6~§18 pending marker;新增对象字段、DTO schema、port 方法、mapper、state、config key、evidence schema、phase / commit boundary、implementation ledger、CI command、acceptance gate 或 implementation code。 |

### 2. source 读取结果

| source | 读取结论 | R19.14 用法 |
|---|---|---|
| `03_ddd_step_05_module_contracts.md` R5.12 | 已裁决七个实现单元作为顶层模块主轴,并形成模块总览、依赖图、模块职责表、八组件横向映射、归属预告和测试切口预告。 | §5 的主 source。 |
| `03_ddd_step_05_module_contracts.md` R5.16 | 已形成可装配到正式 §5 的中间草稿,包含 5.1~5.9。 | R19.14 可直接压缩装配,去除中间产物说明和过程语气。 |
| `03_ddd_step_06_object_contracts.md` R6.26 / R6.28 | 已按七模块主轴闭合对象 owner、字段来源、状态主语预筛和 Step 7 输入门禁。 | 只作为 §5 owner 路由校验;不得把对象卡片和字段表写入 §5。 |
| `03_ddd_step_07_trait_port_adapter.md` R7.26 | 已确认 application 为 port owner、infra 为 adapter implementer、entry 只调用 facade,并形成 family coverage / entry restriction。 | 只作为 §5 port / adapter 归属预告校验;不得写具体 trait 方法、adapter method 或 repository contract。 |
| 正式 `03-详细设计.md` §5 skeleton | 当前仍是 pending,校准来源块完整。 | R19.14 只替换 §5 pending skeleton 为正文;§6~§18 不动。 |

### 3. §5 正文结构思考

正式 §5 应以 Step 5 R5.16 草稿为主体,保持“紧凑但不浅”。它要让实现者知道七个实现单元如何分责、如何依赖、如何承接八个业务组成部分,以及后续对象、port、protocol、flow、state、persistence、error、config、observability、test 分别从哪里继续闭口。

| 正式小节 | 写入策略 | 禁入内容 |
|---|---|---|
| `5.1 模块主轴裁决` | 写明七个实现单元是顶层模块主轴,八组件是横向校验轴,后续 Step 6~16 按模块 + capability 小循环推进。 | 恢复旧 13 模块、旧 P0/P1 或旧 `MethodContent` 主轴。 |
| `5.2 模块总览` | 装配 contracts / domain / application / infra / api / worker / jobs 的实现单元、核心职责、暴露面和直接依赖。 | 写对象字段、trait 方法、DTO schema 或 flow。 |
| `5.3 依赖图与边界` | 保留 crate dependency 图和 allowed / forbidden dependency 规则。 | 新增非 `core-contracts` sibling Cargo dependency 或产品绑定。 |
| `5.4 逐模块实现契约` | 以 owner / supporting / forbidden responsibility 和后续闭口位置表达每个模块。 | 把 Step 6 对象卡片、Step 7 port family 或 Step 8 DTO schema 复制进 §5。 |
| `5.5 八个业务组成部分横向映射` | 保留八组件到 primary owner、supporting modules、entry / runner 的映射。 | 把八组件机械拆成八个 crate。 |
| `5.6 后续 Step owner 路由` | 明确 public shell、truth object、service / port、adapter、handler、consumer、job runner 分别在哪些后续 Step 闭口。 | 代写 §6~§16 的字段级内容。 |
| `5.7 单模块展开模板` | 保留后续 Step 每个模块小节的固定模板。 | 用模板新增未确认模块或改写 Step 4 文件树。 |
| `5.8 模块测试切口预告` | 保留模块级测试责任预告。 | 写 test case id、assertion schema、evidence artifact schema。 |
| `5.9 进入后续章节前置条件` | 写明 Step 5 只完成模块主轴和 owner 路由,对象 / port 等仍需后续章节闭口。 | 声称实现可开工或创建 implementation boundary。 |

### 4. Step 6 / Step 7 回指方式思考

§5 的作用是 owner routing,不是把 §6 和 §7 摘成一章。R19.14 应保留以下回指关系:

| 回指对象 | §5 可写 | §5 不写 |
|---|---|---|
| Step 6 对象契约 | 对象类别由 `contracts/domain/application/infra/api/worker/jobs` 归属,字段级对象卡片见 §6 / Step 6。 | 具体对象字段、factory 入参、状态字段、不变量详表。 |
| Step 7 port / adapter 契约 | `application` 定义 port、`infra` 实现 adapter、entry 只调用 facade。 | trait 方法签名、adapter method、repository contract、fake/durable 具体实现。 |
| Step 8 protocol 契约 | `contracts` 承载 public shell,`api/worker/jobs` 承载 entry / runner assembly。 | command/query/event/job DTO schema。 |
| Step 9 flow 契约 | 每个模块的 flow owner / entry owner 路由。 | transaction order、分支步骤、异常流。 |
| Step 16 test cut | 模块级测试责任预告。 | case id、assertion item、run artifact 或 evidence schema。 |

### 5. R19.14 写入计划思考

`R19.14 §5 正式正文装配:再写入` 应只修改正式 `03-详细设计.md` 的 §5 区域,并同步 Step 19 文件、flow 和项目台账。

| 写入批次 | 文件 | 内容 |
|---|---|---|
| batch 1 | `projects/L3-method-library/03-详细设计.md` | 替换 §5 pending skeleton 为正式正文,保留校准来源和延伸阅读,装配状态改为 `assembled_by_R19.14`。 |
| batch 2 | `03_ddd_step_19_formal_document_assembly.md` | 记录 R19.14 写入结果、§5 source closure、pending marker 处理和 stop-review。 |
| batch 3 | `03_ddd_calibration_flow.md`;`project_execution_ledger.md` | 恢复点推进到 `R19.15 §6~§7 正式正文装配:先思考`。 |

R19.14 禁止:

- 修改 §1~§4 已装配正文或 §6~§18 pending marker。
- 写 §6 对象正文、§7 port 正文、§8 protocol 正文或后续章节。
- 新增对象字段、DTO schema、port 方法、mapper、state、config key、evidence schema、phase / commit boundary 或 implementation ledger。
- 把旧正式 `03`、旧 Step 5 completed 状态、旧 13 模块、旧 `MethodContent` / publish / snapshot / outbox / PostgreSQL 主线作为正向来源。

### 6. R19.13 stop-review

| 检查项 | 结果 |
|---|---|
| 是否读取 §5 主要 source | pass |
| 是否确认 R5.16 有可装配 §5 草稿 | pass |
| 是否确认 Step 6 / Step 7 只作 owner / boundary 校验 | pass |
| 是否形成 §5 正文结构思考 | pass |
| 是否形成 R19.14 写入计划 | pass |
| 是否未修改正式 `03-详细设计.md` | pass |
| 是否未写正式章节正文、下游文档或 implementation artifacts | pass |

next_allowed_action: 等待用户确认后进入 Step 19 `R19.14 §5 正式正文装配:再写入`;只允许替换正式 `03-详细设计.md` §5 pending skeleton 为正式正文、保留 source / extension reading、标记 `assembled_by_R19.14`,并同步 Step 19 文件、flow 和项目台账;不得修改 §1~§4 已装配正文或 §6~§18 pending marker;不得写 §6~§18 正文、正式实施计划、phase / commit boundary、implementation ledger、evidence schema、CI command、acceptance gate 或 implementation code。

---

## R19.14 §5 正式正文装配:再写入

### 1. 当前模块状态

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm |
| 用户确认 | 已确认从 `R19.13` 推进到 `R19.14`。 |
| 本模块写入范围 | 正式 `03-详细设计.md` §5 正文、`assembled_by_R19.14` 状态、正式 `03` 顶部 partial assembly 状态说明、Step 19 / flow / 项目台账恢复点。 |
| 本模块禁止范围 | 修改 §1~§4 已装配正文或 §6~§18 pending marker;写 §6~§18 正文;新增对象字段、DTO schema、port 方法、mapper、state、config key、evidence schema、phase / commit boundary、implementation ledger、CI command、acceptance gate 或 implementation code。 |

### 2. 正式 `03-详细设计.md` 写入结果

| 章节 | 写入结果 | 装配状态 |
|---|---|---|
| §5 模块实现契约 | 已写入模块主轴裁决、模块总览、依赖图与边界、逐模块实现契约、八组件横向映射、后续章节 owner 路由、单模块展开模板、模块测试切口预告和后续章节前置条件。 | `assembled_by_R19.14` |
| §1~§4 | 未修改正文;仍保持 R19.12 装配结果。 | `assembled_by_R19.12` |
| §6~§18 | 未修改正文;仍保留 pending marker。 | pending |

正式 `03` 顶部状态同步为 partial assembly:§1~§4 已由 R19.12 装配,§5 已由 R19.14 装配,§6~§18 待后续 R19.x 逐章装配。

### 3. source closure

| source | 装配裁决 |
|---|---|
| `03_ddd_step_05_module_contracts.md` R5.12 | 作为 §5 模块主轴、依赖边界、职责表和 owner 路由的主体来源。 |
| `03_ddd_step_05_module_contracts.md` R5.16 | 作为正式 §5 结构的直接草稿来源,去除中间产物说明和过程语气后装配。 |
| `03_ddd_step_06_object_contracts.md` R6.26 / R6.28 | 只用于校验对象 owner 和字段级内容后移;未把对象卡片写入 §5。 |
| `03_ddd_step_07_trait_port_adapter.md` R7.26 | 只用于校验 `application` port owner、`infra` adapter implementer 和 entry restriction;未写具体 trait 方法或 adapter method。 |

### 4. pending marker 处理

| marker | 处理 |
|---|---|
| §5 pending | 已替换为 `assembled_by_R19.14`。 |
| §1~§4 装配状态 | 保持 `assembled_by_R19.12`。 |
| §6~§18 pending | 保持不变,等待 R19.16 及后续正文装配模块。 |
| source / extension reading block | §5 source 和 extension reading 块已保留。 |
| missing source / blocker | 本批未发现需要回 owning Step 的 blocker。 |

### 5. 禁入内容确认

| 禁入项 | 结果 |
|---|---|
| 是否修改 §1~§4 已装配正文或 §6~§18 pending marker | no |
| 是否写入 §6 对象正文、§7 port 正文或后续章节正文 | no |
| 是否新增对象字段、DTO schema、port 方法、mapper、state、config key 或 evidence schema | no |
| 是否写入正式实施计划、phase / commit boundary、implementation ledger、CI command 或 acceptance gate | no |
| 是否把旧正式 `03`、旧 Step 5 completed 状态、旧 13 模块或旧 `MethodContent` 主线作为正向来源 | no |

### 6. R19.15 进入门禁

`R19.15 §6~§7 正式正文装配:先思考` 的允许范围:

- 读取并思考 §6~§7 source。
- 思考对象 / Trait / Port / Adapter 索引与协议契约之间的正文结构、压缩深度、禁入内容和 `R19.16` 写入计划。
- 不修改正式 `03-详细设计.md`。

`R19.15` 的禁止范围:

- 不得写正式 §6~§7 正文。
- 不得修改 §1~§5 已装配正文或 §8~§18 pending marker。
- 不得新增对象字段、DTO schema、port 方法、mapper、state、config key、evidence schema、phase / commit boundary、implementation ledger、CI command、acceptance gate 或 implementation code。

### 7. R19.14 stop-review

| 检查项 | 结果 |
|---|---|
| 是否按 R19.13 计划装配 §5 | pass |
| 是否保留 §5 校准来源和延伸阅读 | pass |
| 是否只使用 Step 5 confirmed source,并让 Step 6 / Step 7 只作 owner / boundary 校验 | pass |
| 是否清除 §5 pending marker 并标记 `assembled_by_R19.14` | pass |
| 是否保留 §6~§18 pending marker | pass |
| 是否未写下游 04/05/06/07 或 implementation artifacts | pass |
| 是否同步 flow 和项目台账到 R19.15 等待确认 | pass |

next_allowed_action: 等待用户确认后进入 Step 19 `R19.15 §6~§7 正式正文装配:先思考`;只允许读取并思考 §6~§7 source、正文结构、禁入内容和 `R19.16` 写入计划;不得修改正式 `03-详细设计.md`;不得写正式章节正文、正式实施计划、phase / commit boundary、implementation ledger、evidence schema、CI command、acceptance gate 或 implementation code。

---

## R19.15 §6~§7 正式正文装配:先思考

### 1. 当前模块状态

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm |
| 用户确认 | 已确认从 `R19.14` 推进到 `R19.15`。 |
| 本模块目标 | 只思考正式 `03-详细设计.md` §6~§7 的 source 读取结果、章节结构、编号归一、压缩深度、禁入内容和 `R19.16` 写入计划。 |
| 本模块允许范围 | 读取 Step 6 / Step 7 / Step 8 中间产物,确认 §6 全局索引和 §7 protocol contract 的装配方式。 |
| 本模块禁止范围 | 不修改正式 `03-详细设计.md`;不写正式 §6~§7 正文;不修改 §1~§5 已装配正文或 §8~§18 pending marker;不新增对象字段、trait 方法、DTO 字段、mapper、state、config key、evidence schema、phase / commit boundary、implementation ledger、CI command、acceptance gate 或 implementation code。 |

### 2. source 读取结果

| source | 读取结论 | R19.16 用法 |
|---|---|---|
| `03_ddd_step_06_object_contracts.md` R6.26 | 已形成可装配的对象契约候选草稿,覆盖 contracts shared refs / markers / public shell、domain truth / support / policy、application helper、infra runtime state、api / worker / jobs entry object、字段来源与状态主语闭环、历史污染过滤和 Step 7 输入门禁。 | 作为正式 §6 的对象索引主体来源,但正式 §6 只做索引和查找入口,不复制全部字段级对象卡片。 |
| `03_ddd_step_07_trait_port_adapter.md` R7.24 / R7.26 | 已确认 application 是 port owner、infra 是 adapter implementer、api / worker / jobs 只能调用 application facade;family 覆盖基础 helper、truth repository、support/material、resolver/mapper/builder、inbound/publisher/handoff、jobs/runtime、infra/entry restriction。 | 用于 §6 的 Trait / Port / Adapter 索引和 owner 边界,不写具体 trait 方法签名或 adapter method。 |
| `03_ddd_step_08_protocol_contracts.md` R8.24 / R8.26 | 已形成 protocol family 候选草稿,覆盖 shared helper、Command、Query、Inbound Consumer、Outbound Event、Operations Job、protocol-to-object / port closure 和 cross-protocol public surface guardrails。 | 作为正式 §7 protocol contract 主体来源,压缩装配为 family 级 public shell 和 guardrail,不写具体 DTO 字段 schema。 |
| 正式 `03-详细设计.md` §6~§7 skeleton | §6 和 §7 仍是 pending,校准来源块完整。 | R19.16 只替换 §6~§7 pending skeleton,保留 source / extension reading,并标记 `assembled_by_R19.16`。 |

### 3. 章节编号归一

Step 8 中间产物内部将 protocol 候选草稿标为“正式 §8 候选草稿”,这是 Step 8 自身编号语境。当前正式 `03-详细设计.md` 的 18 章主链中,protocol contract 位于第 7 章,第 8 章是逐接口函数级处理流。

| 项 | 裁决 |
|---|---|
| source 编号 | 保留 Step 8 原文中的 `§8` 作为中间产物历史编号。 |
| 正式装配编号 | 在 R19.16 装配到正式 `03-详细设计.md` 时统一写入正式 §7。 |
| 禁止处理 | 不修改 Step 8 原文编号;不把 Step 9 function flow 写入正式 §7;不把正式 §8 function flow 改名为 protocol。 |

### 4. §6 正文结构思考

正式 §6 应是“全局对象 / Trait / API 索引”,不是 Step 6~8 的字段级真相源替代。它需要让实现者快速定位对象、port、protocol 的 owner 与详细来源。

| 候选小节 | 写入重点 | 禁入内容 |
|---|---|---|
| 6.1 阅读规则与索引边界 | 声明 §6 是索引 / lookup entry;字段、方法、schema 仍回指 Step 6~8。 | 对象字段全集、factory 入参、Rust struct。 |
| 6.2 对象族索引 | 按 contracts/domain/application/infra/api/worker/jobs 列对象族和主要对象。 | 复制所有对象卡片和不变量详表。 |
| 6.3 Trait / Port / Adapter family 索引 | 按 Step 7 family 列 port owner、adapter implementer、entry restriction。 | 具体 trait 方法签名、repository method、adapter method。 |
| 6.4 Protocol family 索引入口 | 将 shared / Command / Query / Inbound / Outbound / Job 指向 §7。 | DTO 字段、HTTP / RPC / topic / job trigger。 |
| 6.5 字段来源与暂停条件 | 摘要 typed ref、marker、decision、diagnostic、cursor / checkpoint 的合法来源和停审条件。 | 为缺失来源私造 mapper、marker 或 schema。 |
| 6.6 历史污染过滤与后续承接 | 固化旧 `MethodContent`、publish、snapshot、fingerprint、outbox、P0/P1 禁入,并指向 §8~§16 后续闭口。 | 把旧材料作为当前对象或接口来源。 |

### 5. §7 正文结构思考

正式 §7 应只装配 API / Command / Query / Event / Job 协议契约的 family 级 public surface。它不承担函数级处理流、状态、持久化、配置、测试或 transport 产品绑定。

| 候选小节 | 写入重点 | 禁入内容 |
|---|---|---|
| 7.1 协议范围与禁入边界 | shared、Command、Query、Inbound、Outbound、Operations Job 六类协议 family 和 no-transport 边界。 | HTTP route、RPC name、event topic、scheduler、queue。 |
| 7.2 shared protocol helper | metadata、actor/source、idempotency/replay、result/rejection、page/cursor、marker、receipt/report 的统一壳。 | 具体字段 schema、JSON/Rust 定义。 |
| 7.3 Command protocol family | command envelope、request intent、accepted/rejected/duplicate/effect summary。 | mutation flow、transaction order、outbox delivery。 |
| 7.4 Query protocol family | query envelope、selector、response view、page、empty/not-visible/stale/degraded/unavailable surface。 | read flow、projection state 判断、marker 合成。 |
| 7.5 Inbound consumer protocol family | inbound envelope、typed payload boundary、intake、duplicate/quarantine/delayed/no-op、worker result。 | broker raw payload、ack/retry/dead-letter。 |
| 7.6 Outbound event protocol family | event family、body-free event shell、event candidate、publication outcome、blocked/degraded/unavailable、publisher result。 | topic、outbox、delivery receipt、payload body。 |
| 7.7 Operations job protocol family | job input/result/progress/checkpoint/report boundary、partial/degraded/unavailable、duplicate/replay。 | scheduler、queue、lease、job trigger、job body flow。 |
| 7.8 closure 与 guardrails | protocol-to-object / port closure、secondary type、naming drift、page/cursor/version、receipt/report/result、body-free、replay、marker、actor/source 规则。 | 把 watch 项写成字段级完全闭合。 |

### 6. R19.16 写入计划思考

`R19.16 §6~§7 正式正文装配:再写入` 应只修改正式 `03-详细设计.md` 的 §6~§7 区域,并同步 Step 19 文件、flow 和项目台账。

| batch | 文件 | 写入内容 |
|---|---|---|
| batch 1 | `projects/L3-method-library/03-详细设计.md` | 替换 §6~§7 pending skeleton 为正式正文,保留校准来源和延伸阅读,装配状态改为 `assembled_by_R19.16`。 |
| batch 2 | `03_ddd_step_19_formal_document_assembly.md` | 记录 R19.16 写入结果、§6~§7 source closure、编号归一、pending marker 处理和 stop-review。 |
| batch 3 | `03_ddd_calibration_flow.md`;`project_execution_ledger.md` | 恢复点推进到 `R19.17 §8 正式正文装配:先思考`。 |

R19.16 禁止:

- 修改 §1~§5 已装配正文或 §8~§18 pending marker。
- 写 §8 function flow、§9 state、§10 persistence、§11 error、§12 concurrency、§13 config、§14 observability、§15 test、§16 handoff、§17 risk 或 §18 final closure 正文。
- 新增对象字段、trait 方法、DTO 字段 schema、mapper、state、config key、evidence schema、phase / commit boundary、implementation ledger、CI command、acceptance gate 或 implementation code。
- 把 Step 8 内部“§8 候选草稿”编号原样写入正式 §7 标题。

### 7. R19.15 stop-review

| 检查项 | 结果 |
|---|---|
| 是否读取 Step 6 对象候选草稿 | pass |
| 是否读取 Step 7 port / adapter family stop-review | pass |
| 是否读取 Step 8 protocol candidate 与 stop-review | pass |
| 是否识别 Step 8 候选编号与正式 §7 的编号归一问题 | pass |
| 是否形成 §6 索引正文结构思考 | pass |
| 是否形成 §7 protocol 正文结构思考 | pass |
| 是否形成 R19.16 写入计划 | pass |
| 是否未修改正式 `03-详细设计.md` | pass |
| 是否未写正式章节正文、下游文档或 implementation artifacts | pass |

next_allowed_action: 等待用户确认后进入 Step 19 `R19.16 §6~§7 正式正文装配:再写入`;只允许替换正式 `03-详细设计.md` §6~§7 pending skeleton 为正式正文、保留 source / extension reading、标记 `assembled_by_R19.16`,并同步 Step 19 文件、flow 和项目台账;不得修改 §1~§5 已装配正文或 §8~§18 pending marker;不得写 §8~§18 正文、正式实施计划、phase / commit boundary、implementation ledger、evidence schema、CI command、acceptance gate 或 implementation code。

---

## R19.16 §6~§7 正式正文装配:再写入

### 1. 当前模块状态

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm |
| 用户确认 | 已确认从 `R19.15` 推进到 `R19.16`。 |
| 本模块写入范围 | 正式 `03-详细设计.md` §6~§7 正文、`assembled_by_R19.16` 状态、正式 `03` 顶部 partial assembly 状态说明、Step 19 / flow / 项目台账恢复点。 |
| 本模块禁止范围 | 修改 §1~§5 已装配正文或 §8~§18 pending marker;写 §8~§18 正文;新增对象字段、trait 方法、DTO 字段 schema、mapper、state、config key、evidence schema、phase / commit boundary、implementation ledger、CI command、acceptance gate 或 implementation code。 |

### 2. 正式 `03-详细设计.md` 写入结果

| 章节 | 写入结果 | 装配状态 |
|---|---|---|
| §6 全局对象 / Trait / API 索引 | 已写入阅读规则与索引边界、对象族索引、Trait / Port / Adapter family 索引、Protocol family 索引入口、字段来源与暂停条件、历史污染过滤与后续承接。 | `assembled_by_R19.16` |
| §7 API / Command / Query / Event / Job 协议契约 | 已写入协议范围与禁入边界、shared protocol helper、Command、Query、Inbound、Outbound、Operations Job、protocol-to-object / port closure、cross-protocol guardrails 和 stop-review 承接。 | `assembled_by_R19.16` |
| §1~§5 | 未修改正文;仍保持 R19.12 / R19.14 装配结果。 | `assembled_by_R19.12` / `assembled_by_R19.14` |
| §8~§18 | 未修改正文;仍保留 pending marker。 | pending |

正式 `03` 顶部状态同步为 partial assembly:§1~§4 已由 R19.12 装配,§5 已由 R19.14 装配,§6~§7 已由 R19.16 装配,§8~§18 待后续 R19.x 逐章装配。

### 3. source closure

| source | 装配裁决 |
|---|---|
| `03_ddd_step_06_object_contracts.md` R6.26 / R6.28 | 作为 §6 对象族索引、字段来源、状态主语和历史污染过滤的主体来源;未复制对象字段全集或 factory 细节。 |
| `03_ddd_step_07_trait_port_adapter.md` R7.24 / R7.26 | 作为 §6 Trait / Port / Adapter family 索引、application port owner、infra adapter implementer、entry restriction 和 stop-review 边界来源;未写具体方法签名。 |
| `03_ddd_step_08_protocol_contracts.md` R8.24 / R8.26 | 作为 §7 protocol family、shared helper、closure 和 guardrails 的主体来源;未写 DTO 字段 schema、transport binding 或 function flow。 |

### 4. 编号归一处理

| 项 | 处理 |
|---|---|
| Step 8 中间产物编号 | 保留在 source 中作为 Step 8 自身历史编号。 |
| 正式文档编号 | 已将 protocol contract 装配到正式 `03-详细设计.md` §7。 |
| 正式 §8 | 未修改;仍作为逐接口函数级处理流 pending 章节。 |
| 编号风险 | 未把 Step 8 内部“§8 候选草稿”标题原样写入正式 §7。 |

### 5. pending marker 处理

| marker | 处理 |
|---|---|
| §6 pending | 已替换为 `assembled_by_R19.16`。 |
| §7 pending | 已替换为 `assembled_by_R19.16`。 |
| §1~§5 装配状态 | 保持不变。 |
| §8~§18 pending | 保持不变,等待 R19.18 及后续正文装配模块。 |
| source / extension reading block | §6~§7 source 和 extension reading 块已保留。 |
| missing source / blocker | 本批未发现需要回 owning Step 的 blocker。 |

### 6. 禁入内容确认

| 禁入项 | 结果 |
|---|---|
| 是否修改 §1~§5 已装配正文或 §8~§18 pending marker | no |
| 是否写入 §8 function flow 或后续章节正文 | no |
| 是否新增对象字段、trait 方法、DTO 字段 schema、mapper、state、config key 或 evidence schema | no |
| 是否写入 HTTP route、RPC name、event topic、scheduler、queue、phase / commit boundary、implementation ledger、CI command 或 acceptance gate | no |
| 是否把旧正式 `03`、旧 `MethodContent`、publish、snapshot、fingerprint、outbox 或 P0/P1 主线作为正向来源 | no |

### 7. R19.17 进入门禁

`R19.17 §8 正式正文装配:先思考` 的允许范围:

- 读取并思考 §8 source,即 `03_ddd_step_09_function_flows.md` 的回填草稿、source map、stop-review 和待确认事项。
- 思考 function flow 正文结构、flow 与 protocol 的衔接、禁入内容和 `R19.18` 写入计划。
- 不修改正式 `03-详细设计.md`。

`R19.17` 的禁止范围:

- 不得写正式 §8 正文。
- 不得修改 §1~§7 已装配正文或 §9~§18 pending marker。
- 不得新增对象字段、DTO schema、port 方法、mapper、state、config key、evidence schema、phase / commit boundary、implementation ledger、CI command、acceptance gate 或 implementation code。

### 8. R19.16 stop-review

| 检查项 | 结果 |
|---|---|
| 是否按 R19.15 计划装配 §6~§7 | pass |
| 是否保留 §6~§7 校准来源和延伸阅读 | pass |
| 是否将 §6 保持为索引 / lookup entry,而非字段级对象全文 | pass |
| 是否将 §7 保持为 protocol family / public shell,而非 function flow 或 DTO 字段 schema | pass |
| 是否处理 Step 8 候选编号到正式 §7 的归一 | pass |
| 是否清除 §6~§7 pending marker 并标记 `assembled_by_R19.16` | pass |
| 是否保留 §8~§18 pending marker | pass |
| 是否未写下游 04/05/06/07 或 implementation artifacts | pass |
| 是否同步 flow 和项目台账到 R19.17 等待确认 | pass |

next_allowed_action: 等待用户确认后进入 Step 19 `R19.17 §8 正式正文装配:先思考`;只允许读取并思考 §8 source、function flow 正文结构、flow 与 protocol 的衔接、禁入内容和 `R19.18` 写入计划;不得修改正式 `03-详细设计.md`;不得写正式章节正文、正式实施计划、phase / commit boundary、implementation ledger、evidence schema、CI command、acceptance gate 或 implementation code。

---

## R19.17 §8 正式正文装配:先思考

### 1. 当前模块状态

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm |
| 用户确认 | 已确认从 `R19.16` 推进到 `R19.17`。 |
| 本模块目标 | 只思考正式 `03-详细设计.md` §8 的 source 读取结果、function flow 正文结构、flow 与 protocol 的衔接、禁入内容和 `R19.18` 写入计划。 |
| 本模块允许范围 | 读取 `03_ddd_step_09_function_flows.md` 的 flow inventory、L1 粒度 execution overlay、正式 §8 候选草稿、watch / blocker ledger 和 final stop-review。 |
| 本模块禁止范围 | 不修改正式 `03-详细设计.md`;不写正式 §8 正文;不修改 §1~§7 已装配正文或 §9~§18 pending marker;不新增对象字段、DTO schema、port 方法、mapper、state、config key、evidence schema、phase / commit boundary、implementation ledger、CI command、acceptance gate 或 implementation code。 |

### 2. source 读取结果

| source | 读取结论 | R19.18 用法 |
|---|---|---|
| `03_ddd_step_09_function_flows.md` R9.27 | 记录 Step 9 重写原因、旧 completed 作废、L1-governance 框架对齐、58 Command / 57 Query / 4 Inbound / 34 Outbound / 8 Job 的 flow inventory。 | 作为 §8 flow 覆盖数量、family 顺序和旧污染过滤来源。 |
| `03_ddd_step_09_function_flows.md` R9.35 | 建立 L1 粒度统一补全模板,定义 Command / Query / Inbound / Outbound / Job 的 shared execution overlay。 | 作为 §8 shared execution template 小节来源。 |
| `03_ddd_step_09_function_flows.md` R9.36~R9.40 | 分别补全 58 个 Command、57 个 Query、4 个 Inbound、34 个 Outbound、8 个 Operations Job 的 execution overlay、formal sources、branch / replay surface 和 review gate。 | R19.18 应压缩装配为 flow family 与 group-level execution guarantee,不逐条复制 161 条 flow 表。 |
| `03_ddd_step_09_function_flows.md` R9.41 | 完成 L1 粒度 cross-flow closure audit,覆盖 entry restriction、transaction ordering、query no-write、body-free、duplicate replay、marker copy-only、page/cursor/version separation。 | 作为 §8 cross-flow guardrails 来源。 |
| `03_ddd_step_09_function_flows.md` R9.42 | 记录 watch ledger: stored result / replay、expected version、query marker、inbound receipt、event candidate persistence、job checkpoint/report、safe diagnostic、runtime availability;hard blocker 为 none。 | 作为 §8 watch /后续 Step handoff 来源,不得写成已闭合 schema。 |
| `03_ddd_step_09_function_flows.md` R9.43 | 替代 R9.34 compact 草稿,形成正式 §8 最新候选草稿。 | 作为 R19.18 的直接正文压缩来源。 |
| `03_ddd_step_09_function_flows.md` R9.44 | final gate 确认 Step 9 达到 L1-governance 粒度,但未修改正式 `03-详细设计.md`,未进入 Step 10。 | 作为 Step 9 completion / source closure 来源。 |

### 3. source hygiene 与使用裁决

Step 9 文件顶部 header 仍残留 `R9.27 / in_progress`,但同文件 `R9.44` final gate、`03_ddd_calibration_flow.md` Step 状态表和项目台账均确认 Step 9 completed。R19.18 装配正式 §8 时只锚定 `R9.43` 最新候选草稿和 `R9.44` final gate,不依赖 Step 9 文件顶部陈旧 header。

| source hygiene 项 | 裁决 |
|---|---|
| R9.34 compact candidate | 已被 R9.35~R9.44 superseded,不得作为正式 §8 主体来源。 |
| R9.43 L1 粒度候选草稿 | 作为正式 §8 的直接来源。 |
| R9.44 final gate | 作为 Step 9 completed / no hard blocker / Step 10~16 handoff 的确认来源。 |
| Step 9 顶部 header 残留 | 本模块不修改 owning Step 文件;R19.18 不引用该 header 作为完成证据。 |

### 4. §8 正文结构思考

正式 §8 应写“逐接口函数级处理流”的可落码入口,但不能复制 161 条 flow 的全部 overlay 表。正式正文应保留 family 结构、shared templates、关键执行顺序、branch/replay surface、cross-flow guardrails 和后续 watch/handoff。

| 候选小节 | 写入重点 | 禁入内容 |
|---|---|---|
| 8.1 function flow 边界与覆盖 | 写明 58 Command、57 Query、4 Inbound、34 Outbound、8 Job,总计 161 个 flow 候选;说明 Command 唯一业务写入口、Query no-write、Inbound body-free、Outbound candidate/publisher 分离、Job no repair。 | 具体 Rust 函数签名、HTTP route、RPC name、event topic、scheduler/queue trigger。 |
| 8.2 shared execution templates | 压缩写 Command / Query / Inbound / Outbound / Job 的统一执行序列。 | UoW / repository / port 的具体方法签名;具体 persistence schema。 |
| 8.3 Command flow groups | 按八个业务组成部分写 Command group execution guarantee。 | 逐条复制 58 个 flow overlay;写状态矩阵或 stored result schema。 |
| 8.4 Query flow groups | 写 57 Query 的 no-write、resolver/repository/mapper、safe surface、marker copy-only。 | 创建 material、刷新 view、append audit、publish event、start job。 |
| 8.5 Inbound consumer flows | 写 4 个 inbound 的 envelope、dedup、body-free adapter、receipt/replay、no truth mutation。 | broker ack/retry/dead-letter、raw payload、provider body。 |
| 8.6 Outbound event / publication flows | 写 34 outbound 的 stored fact source、candidate assembly、target registry、publisher outcome。 | old outbox relay、topic、payload schema、delivery receipt body、publisher 重读 current truth。 |
| 8.7 Operations job flows | 写 8 job 的 run/resume/checkpoint/partial/report、derived material/progress/recovery issue。 | repair core truth、scheduler/queue/lease、metrics/report body。 |
| 8.8 Cross-flow guardrails | 写 body-free、copy-only marker、replay source、no hidden repair、no old source、phase boundary。 | 把 watch 项写成已闭合 schema。 |
| 8.9 Watch / Step 10~16 handoff | 写 watch ledger 和后续章节承接,标明 hard blocker none。 | 在 §8 内补 state matrix、persistence、error、idempotency、config、observability、test schema。 |

### 5. 与 §7 protocol 的衔接

§8 必须消费 §7 的 protocol family,不能反向修改 protocol shell。

| §7 protocol family | §8 flow owner | 衔接口径 |
|---|---|---|
| shared protocol helper | all flow families | 所有 flow 复用 metadata、actor/source、idempotency/replay、result/rejection、page/cursor、marker、receipt/report。 |
| Command | 58 Command flows | command envelope 进入 API/application command facade;duplicate replay 从 stored result 读取。 |
| Query | 57 Query flows | query envelope 进入 no-write read facade;empty/not-visible/stale/degraded/unavailable surface 只复制正式来源。 |
| Inbound Consumer | 4 inbound flows | inbound envelope 进入 worker/application intake;receipt/replay 从 stored receipt 读取。 |
| Outbound Event | 34 outbound flows | event candidate 来自 stored accepted fact/job/intake source;publisher 只处理 candidate shell。 |
| Operations Job | 8 job flows | job shell 进入 job application facade;duplicate/resume/report 从 checkpoint/run history/stored report 读取。 |

### 6. R19.18 写入计划思考

`R19.18 §8 正式正文装配:再写入` 应只修改正式 `03-详细设计.md` 的 §8 区域,并同步 Step 19 文件、flow 和项目台账。

| batch | 文件 | 写入内容 |
|---|---|---|
| batch 1 | `projects/L3-method-library/03-详细设计.md` | 替换 §8 pending skeleton 为正式正文,保留校准来源和延伸阅读,装配状态改为 `assembled_by_R19.18`。 |
| batch 2 | `03_ddd_step_19_formal_document_assembly.md` | 记录 R19.18 写入结果、§8 source closure、pending marker 处理、watch/handoff 和 stop-review。 |
| batch 3 | `03_ddd_calibration_flow.md`;`project_execution_ledger.md` | 恢复点推进到 `R19.19 §9~§12 正式正文装配:先思考`。 |

R19.18 禁止:

- 修改 §1~§7 已装配正文或 §9~§18 pending marker。
- 写 §9 state、§10 persistence、§11 error、§12 concurrency、§13 config、§14 observability、§15 test、§16 handoff、§17 risk 或 §18 final closure 正文。
- 新增对象字段、DTO schema、port 方法、mapper、state、config key、evidence schema、phase / commit boundary、implementation ledger、CI command、acceptance gate 或 implementation code。
- 修正 Step 9 文件顶部 header;该修正若需要,应另走 owning Step / housekeeping 门禁。

### 7. R19.17 stop-review

| 检查项 | 结果 |
|---|---|
| 是否读取 Step 9 R9.43 最新正式 §8 候选草稿 | pass |
| 是否读取 Step 9 R9.44 final gate | pass |
| 是否识别 R9.34 compact 草稿已 superseded | pass |
| 是否识别 Step 9 顶部 header 残留并限定 source 使用 | pass |
| 是否形成 §8 正文结构思考 | pass |
| 是否形成 §7 protocol 到 §8 flow 的衔接思考 | pass |
| 是否形成 R19.18 写入计划 | pass |
| 是否未修改正式 `03-详细设计.md` | pass |
| 是否未写正式章节正文、下游文档或 implementation artifacts | pass |

next_allowed_action: 等待用户确认后进入 Step 19 `R19.18 §8 正式正文装配:再写入`;只允许替换正式 `03-详细设计.md` §8 pending skeleton 为正式正文、保留 source / extension reading、标记 `assembled_by_R19.18`,并同步 Step 19 文件、flow 和项目台账;不得修改 §1~§7 已装配正文或 §9~§18 pending marker;不得写 §9~§18 正文、正式实施计划、phase / commit boundary、implementation ledger、evidence schema、CI command、acceptance gate 或 implementation code。

---

## R19.18 §8 正式正文装配:再写入

### 1. 当前模块状态

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm |
| 用户确认 | 已确认从 `R19.17` 推进到 `R19.18`。 |
| 本模块写入范围 | 正式 `03-详细设计.md` §8 正文、`assembled_by_R19.18` 状态、正式 `03` 顶部 partial assembly 状态说明、Step 19 / flow / 项目台账恢复点。 |
| 本模块禁止范围 | 修改 §1~§7 已装配正文或 §9~§18 pending marker;写 §9~§18 正文;新增对象字段、DTO schema、port 方法、mapper、state、config key、evidence schema、phase / commit boundary、implementation ledger、CI command、acceptance gate 或 implementation code。 |

### 2. 正式 `03-详细设计.md` 写入结果

| 章节 | 写入结果 | 装配状态 |
|---|---|---|
| §8 逐接口函数级处理流 | 已写入 function flow 边界与覆盖、shared execution templates、Command / Query / Inbound / Outbound / Operations Job flow groups、cross-flow guardrails、watch ledger 与后续承接。 | `assembled_by_R19.18` |
| §1~§7 | 未修改正文;仍保持 R19.12 / R19.14 / R19.16 装配结果。 | assembled |
| §9~§18 | 未修改正文;仍保留 pending marker。 | pending |

正式 `03` 顶部状态同步为 partial assembly:§1~§4 已由 R19.12 装配,§5 已由 R19.14 装配,§6~§7 已由 R19.16 装配,§8 已由 R19.18 装配,§9~§18 待后续 R19.x 逐章装配。

### 3. source closure

| source | 装配裁决 |
|---|---|
| `03_ddd_step_09_function_flows.md` R9.27 | 作为 flow inventory、旧 completed 作废、L1 粒度重写原因和 161 flow 覆盖数量来源。 |
| `03_ddd_step_09_function_flows.md` R9.35 | 作为 shared Command / Query / Inbound / Outbound / Job execution template 来源。 |
| `03_ddd_step_09_function_flows.md` R9.36~R9.40 | 作为 Command / Query / Inbound / Outbound / Job group execution guarantee 来源;未逐条复制全部 161 条 overlay。 |
| `03_ddd_step_09_function_flows.md` R9.41 | 作为 cross-flow guardrails 来源。 |
| `03_ddd_step_09_function_flows.md` R9.42 | 作为 watch ledger 和 hard blocker none 来源。 |
| `03_ddd_step_09_function_flows.md` R9.43 / R9.44 | 作为正式 §8 最新候选草稿和 final completion gate 来源。 |

### 4. pending marker 处理

| marker | 处理 |
|---|---|
| §8 pending | 已替换为 `assembled_by_R19.18`。 |
| §1~§7 装配状态 | 保持不变。 |
| §9~§18 pending | 保持不变,等待 R19.20 及后续正文装配模块。 |
| source / extension reading block | §8 source 和 extension reading 块已保留。 |
| missing source / blocker | 本批未发现需要回 owning Step 的 blocker。 |

### 5. 禁入内容确认

| 禁入项 | 结果 |
|---|---|
| 是否修改 §1~§7 已装配正文或 §9~§18 pending marker | no |
| 是否写入 §9 state、§10 persistence、§11 error、§12 concurrency 或后续章节正文 | no |
| 是否新增对象字段、DTO schema、port 方法、mapper、state、config key 或 evidence schema | no |
| 是否写入 HTTP route、RPC name、event topic、scheduler、queue、phase / commit boundary、implementation ledger、CI command 或 acceptance gate | no |
| 是否把 R9.34 compact 草稿、旧 `MethodContent`、publish、snapshot、fingerprint、outbox 或 P0/P1 主线作为正向来源 | no |

### 6. R19.19 进入门禁

`R19.19 §9~§12 正式正文装配:先思考` 的允许范围:

- 读取并思考 §9~§12 source,即 Step 10~13 的回填草稿、source map、stop-review 和待确认事项。
- 思考 state / persistence / error / concurrency 正文结构、与 §8 flow 的承接、禁入内容和 `R19.20` 写入计划。
- 不修改正式 `03-详细设计.md`。

`R19.19` 的禁止范围:

- 不得写正式 §9~§12 正文。
- 不得修改 §1~§8 已装配正文或 §13~§18 pending marker。
- 不得新增对象字段、DTO schema、port 方法、mapper、config key、evidence schema、phase / commit boundary、implementation ledger、CI command、acceptance gate 或 implementation code。

### 7. R19.18 stop-review

| 检查项 | 结果 |
|---|---|
| 是否按 R19.17 计划装配 §8 | pass |
| 是否保留 §8 校准来源和延伸阅读 | pass |
| 是否使用 R9.43 / R9.44 作为最新来源 | pass |
| 是否避免将 R9.34 compact 草稿作为主体来源 | pass |
| 是否保留 161 flow 覆盖与 L1 粒度结论 | pass |
| 是否未逐条复制全部 overlay 表,但保留 family / group / guardrail / watch 导航 | pass |
| 是否清除 §8 pending marker 并标记 `assembled_by_R19.18` | pass |
| 是否保留 §9~§18 pending marker | pass |
| 是否未写下游 04/05/06/07 或 implementation artifacts | pass |
| 是否同步 flow 和项目台账到 R19.19 等待确认 | pass |

next_allowed_action: 等待用户确认后进入 Step 19 `R19.19 §9~§12 正式正文装配:先思考`;只允许读取并思考 §9~§12 source、state / persistence / error / concurrency 正文结构、与 §8 flow 的承接、禁入内容和 `R19.20` 写入计划;不得修改正式 `03-详细设计.md`;不得写正式章节正文、正式实施计划、phase / commit boundary、implementation ledger、evidence schema、CI command、acceptance gate 或 implementation code。

---

## R19.19 §9~§12 正式正文装配:先思考

### 1. 当前模块状态

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm |
| 用户确认 | 已确认从 `R19.18` 推进到 `R19.19`。 |
| 本模块目标 | 只思考正式 `03-详细设计.md` §9~§12 的 source 读取结果、state / persistence / error / concurrency 正文结构、与 §8 flow 的承接、禁入内容和 `R19.20` 写入计划。 |
| 本模块允许范围 | 读取 Step 10~13 的候选正文、cross-step closure audit、handoff、stop-review 和正式 `03` §9~§12 pending skeleton。 |
| 本模块禁止范围 | 不修改正式 `03-详细设计.md`;不写正式 §9~§12 正文;不修改 §1~§8 已装配正文或 §13~§18 pending marker;不新增对象字段、DTO schema、port 方法、mapper、state、config key、evidence schema、phase / commit boundary、implementation ledger、CI command、acceptance gate 或 implementation code。 |

### 2. source 读取结果

| source | 读取结论 | R19.20 用法 |
|---|---|---|
| `03_ddd_step_10_state_machine.md` R10.22 | 完成跨状态机审计,覆盖状态词族 owner namespace、trigger coverage、forbidden transition、side-effect boundary、watch / blocker closure 和 Step 11~16 handoff。 | 作为 §9 cross-state audit、禁入转换、side-effect 边界和后续承接来源。 |
| `03_ddd_step_10_state_machine.md` R10.24 | 形成正式 §9 候选结构,包括 §9.1~§9.10:状态机原则、状态主语筛选、business truth、source/reference/body-boundary、trace/audit、read/material、maintenance/job、idempotency/runtime、outbound/handoff 和跨状态机审计。 | 作为 §9 的直接正文压缩来源。 |
| `03_ddd_step_11_persistence_tx_consistency.md` R11.24 | 完成 Step 6~10 到持久化/事务/一致性闭口审计,形成 §10.1~§10.8 候选草稿:范围、logical store family、repository 语义、version/append/checkpoint、transaction boundary、consistency strategy、body-free/replay redline、Step 12~16 handoff。 | 作为 §10 的直接正文压缩来源。 |
| `03_ddd_step_12_errors_recovery.md` R12.16 | 完成 Step 6~11 到错误/恢复闭口审计,形成 §11.1~§11.8 候选草稿:范围、错误层级、Command / Query / IOH / Job recovery、audit/side-effect failure、blocker/handoff。 | 作为 §11 的直接正文压缩来源。 |
| `03_ddd_step_13_concurrency_idempotency.md` R13.16 | 完成 Step 6~12 到并发/幂等/重入闭口审计,形成 §12.1~§12.8 候选草稿:scope、protection layers、Command、Query、Inbound/Outbound/Handoff、Job checkpoint、retry/lock/lease、closure/handoff。 | 作为 §12 的直接正文压缩来源。 |
| `03-详细设计.md` §9~§12 skeleton | §9~§12 仍为 pending,仅保留校准来源和延伸阅读。 | R19.20 只替换这四章 pending skeleton,不得触碰其他章节。 |

### 3. source hygiene 与使用裁决

| source hygiene 项 | 裁决 |
|---|---|
| Step 10 候选来源 | 以 R10.24 正式 §9 候选草稿为主体,并用 R10.22 cross-state audit 补充禁入与 handoff;不从更早中间模块直接拼正式正文。 |
| Step 11 候选来源 | 以 R11.24 的 §10 candidate draft 和 closure audit 为主体;logical persistence 只写语义,不写物理 DB/SQL/DDL。 |
| Step 12 候选来源 | 以 R12.16 的 §11 candidate draft、coverage index 和 open blocker / handoff 为主体;不提前写 Step 13 retry 算法或 Step 15 evidence schema。 |
| Step 13 候选来源 | 以 R13.16 的 §12 candidate draft、coverage index 和 final watch/handoff 为主体;不提前写 Step 14 config key、TTL、lease duration 或 scheduler policy。 |
| 正式 `03` skeleton | R19.19 不修改;R19.20 才能把 §9~§12 pending 替换为正文。 |
| watch / handoff 项 | 只写为后续承接或 implementation pause 条件;不得伪装成已闭合 schema、port、mapper、config 或 test evidence。 |

### 4. §9~§12 正文结构思考

| 正式章节 | 装配结构 | 写入重点 | 禁入内容 |
|---|---|---|---|
| §9 状态机与转换矩阵 | §9.1 原则;§9.2 状态主语筛选;§9.3 business truth;§9.4 source/reference/body-boundary;§9.5 trace/audit;§9.6 read/material;§9.7 maintenance/job/report;§9.8 idempotency/runtime;§9.9 outbound/handoff;§9.10 cross-state audit。 | 保留 state owner、source、trigger、precondition、transition、forbidden transition 和 side-effect boundary。 | 持久化 schema、错误 taxonomy、retry/TTL/lock、config key、test case、旧 `MethodContent`/publish/outbox/snapshot/fingerprint。 |
| §10 数据持久化、事务与一致性契约 | §10.1 scope;§10.2 logical store;§10.3 repository semantics;§10.4 version/append/checkpoint;§10.5 transaction boundary;§10.6 consistency;§10.7 redline;§10.8 handoff。 | 把 §8 flow 和 §9 state 的写入/读取责任落成 logical persistence contract,强调 query no-write、duplicate no-rerun、body-free persistence 和 no private port。 | 物理数据库、SQL、索引语法、retry 数字、TTL、lease、topic/URL/secret、metric label、test fixture。 |
| §11 错误模型、异常分支与恢复口径 | §11.1 scope;§11.2 error layer;§11.3 Command;§11.4 Query;§11.5 Inbound/Outbound/Handoff;§11.6 Job;§11.7 audit/side-effect;§11.8 closure/handoff。 | 把 §8 flow branch、§9 invalid/degraded/unavailable/failed state 和 §10 rollback/no-rollback 语义映射到 safe public recovery surface。 | HTTP/RPC 数字、adapter raw error、raw body、retry algorithm、config binding、observability artifact、test case ID。 |
| §12 并发、幂等与重入保护 | §12.1 scope;§12.2 protection layers;§12.3 Command;§12.4 Query;§12.5 IOH;§12.6 Job;§12.7 retry/lock/lease;§12.8 closure/handoff。 | 说明 formal key/digest/version/checkpoint/stored surface/outcome 的来源,保持 duplicate replay、query repeatability、worker reentry 和 lease/runtime boundary。 | physical lock table、DB isolation、retry numeric policy、TTL、lease duration、config key、metrics、implementation code。 |

### 5. 与 §8 flow 的承接关系

| §8 flow concern | §9 承接 | §10 承接 | §11 承接 | §12 承接 |
|---|---|---|---|---|
| Command accepted / rejected / duplicate | 定义 accepted/rejected/blocked/conflict/manual 等状态边界。 | 定义 accepted UoW、stored result 和 rollback/no-rollback。 | 定义 safe rejection、conflict、commit unknown、stored missing。 | 定义 idempotency key/digest、reserve/complete、duplicate replay。 |
| Query no-write / marker copy-only | 定义 read decision、degraded decision、freshness、availability 状态来源。 | 定义 query read-only UoW 和 projection/material read authority。 | 定义 visible/empty/not-visible/stale/degraded/unavailable recovery surface。 | 定义 repeatability、cursor/version/checkpoint 分离。 |
| Inbound body-free intake | 定义 intake / source summary / boundary violation 状态。 | 定义 receipt / intake summary 持久化边界。 | 定义 unsupported/malformed/delayed/quarantine safe receipt。 | 定义 redelivery duplicate replay 和 receipt missing 处理。 |
| Outbound candidate / publisher outcome | 定义 candidate、target registry、publication outcome、handoff outcome 状态。 | 定义 candidate/outcome/handoff shell 的持久化和 no rollback。 | 定义 publisher/handoff unavailable、failed、blocked surface。 | 定义 publication retry、handoff retry 和 no rollback reentry。 |
| Operations Job checkpoint / report | 定义 task/progress/run/checkpoint/report/issue 状态。 | 定义 progress/checkpoint/report shell 和 per item/page UoW。 | 定义 partial/manual/job failed/report persistence failure。 | 定义 checkpoint resume、stored report replay 和 partial retry。 |

### 6. R19.20 写入计划思考

`R19.20 §9~§12 正式正文装配:再写入` 应只替换正式 `03-详细设计.md` §9~§12 pending skeleton,并同步 Step 19 文件、flow 和项目台账。

| batch | 文件 | 写入内容 |
|---|---|---|
| batch 1 | `projects/L3-method-library/03-详细设计.md` | 替换 §9~§12 pending skeleton 为正式正文,保留每章校准来源和延伸阅读,装配状态改为 `assembled_by_R19.20`。 |
| batch 2 | `03_ddd_step_19_formal_document_assembly.md` | 记录 R19.20 写入结果、§9~§12 source closure、pending marker 处理、watch/handoff 和 stop-review。 |
| batch 3 | `03_ddd_calibration_flow.md`;`project_execution_ledger.md` | 恢复点推进到 `R19.21 §13~§15 正式正文装配:先思考`。 |

R19.20 禁止:

- 修改 §1~§8 已装配正文或 §13~§18 pending marker。
- 写 §13 config、§14 observability、§15 test、§16 handoff、§17 risk 或 §18 final closure 正文。
- 新增对象字段、DTO schema、port 方法、mapper、state、config key、evidence schema、phase / commit boundary、implementation ledger、CI command、acceptance gate 或 implementation code。
- 把 Step 10~13 的 watch / handoff 写成已闭合字段、schema、port、mapper、config 或测试证据。

### 7. R19.19 stop-review

| 检查项 | 结果 |
|---|---|
| 是否读取 Step 10 R10.22 / R10.24 | pass |
| 是否读取 Step 11 R11.24 | pass |
| 是否读取 Step 12 R12.16 | pass |
| 是否读取 Step 13 R13.16 | pass |
| 是否确认正式 `03` §9~§12 仍为 pending skeleton | pass |
| 是否形成 §9~§12 正文结构思考 | pass |
| 是否形成 §8 flow 到 §9~§12 的承接思考 | pass |
| 是否形成 R19.20 写入计划 | pass |
| 是否未修改正式 `03-详细设计.md` | pass |
| 是否未写正式章节正文、下游文档或 implementation artifacts | pass |

next_allowed_action: 等待用户确认后进入 Step 19 `R19.20 §9~§12 正式正文装配:再写入`;只允许替换正式 `03-详细设计.md` §9~§12 pending skeleton 为正式正文、保留 source / extension reading、标记 `assembled_by_R19.20`,并同步 Step 19 文件、flow 和项目台账;不得修改 §1~§8 已装配正文或 §13~§18 pending marker;不得写 §13~§18 正文、正式实施计划、phase / commit boundary、implementation ledger、evidence schema、CI command、acceptance gate 或 implementation code。

---

## R19.20 §9~§12 正式正文装配:再写入

### 1. 当前模块状态

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm |
| 用户确认 | 已确认从 `R19.19` 推进到 `R19.20`。 |
| 本模块写入范围 | 正式 `03-详细设计.md` §9~§12 正文、`assembled_by_R19.20` 状态、正式 `03` 顶部 partial assembly 状态说明、Step 19 / flow / 项目台账恢复点。 |
| 本模块禁止范围 | 修改 §1~§8 已装配正文或 §13~§18 pending marker;写 §13~§18 正文;新增对象字段、DTO schema、port 方法、mapper、state、config key、evidence schema、phase / commit boundary、implementation ledger、CI command、acceptance gate 或 implementation code。 |

### 2. 正式 `03-详细设计.md` 写入结果

| 章节 | 写入结果 | 装配状态 |
|---|---|---|
| §9 状态机与转换矩阵 | 已写入状态机原则、状态主语筛选、business truth、source/reference/body-boundary、trace/audit、read/material、maintenance/job、idempotency/runtime、outbound/handoff 和 cross-state audit。 | `assembled_by_R19.20` |
| §10 数据持久化、事务与一致性契约 | 已写入 logical store family、repository 语义、version/append/checkpoint、transaction boundary、consistency strategy、body-free/replay redline 和 handoff。 | `assembled_by_R19.20` |
| §11 错误模型、异常分支与恢复口径 | 已写入 error layer、Command / Query / Inbound / Outbound / Handoff / Job recovery、audit/side-effect failure 和 blocker/handoff。 | `assembled_by_R19.20` |
| §12 并发、幂等与重入保护 | 已写入 protection layers、Command idempotency、Query repeatability、IOH reentry、Job checkpoint resume、retry/lock/lease boundary 和 closure/handoff。 | `assembled_by_R19.20` |
| §1~§8 | 未修改正文;仍保持 R19.12 / R19.14 / R19.16 / R19.18 装配结果。 | assembled |
| §13~§18 | 未修改正文;仍保留 pending marker。 | pending |

正式 `03` 顶部状态同步为 partial assembly:§1~§4 已由 R19.12 装配,§5 已由 R19.14 装配,§6~§7 已由 R19.16 装配,§8 已由 R19.18 装配,§9~§12 已由 R19.20 装配,§13~§18 待后续 R19.x 逐章装配。

### 3. source closure

| source | 装配裁决 |
|---|---|
| `03_ddd_step_10_state_machine.md` R10.22 / R10.24 | 作为正式 §9 的直接来源;保留状态 owner、transition、forbidden transition、side-effect boundary 和 Step 11~16 handoff。 |
| `03_ddd_step_11_persistence_tx_consistency.md` R11.24 | 作为正式 §10 的直接来源;只装配 logical persistence、transaction 和 consistency contract,不写 physical schema。 |
| `03_ddd_step_12_errors_recovery.md` R12.16 | 作为正式 §11 的直接来源;只装配 safe error / recovery surface 和 blocker rule,不写 retry/config/observability/test schema。 |
| `03_ddd_step_13_concurrency_idempotency.md` R13.16 | 作为正式 §12 的直接来源;只装配 semantic guard、duplicate replay、checkpoint resume 和 retry/lease boundary,不写 TTL/config key。 |

### 4. pending marker 处理

| marker | 处理 |
|---|---|
| §9~§12 pending | 已替换为 `assembled_by_R19.20`。 |
| §1~§8 装配状态 | 保持不变。 |
| §13~§18 pending | 保持不变,等待 R19.22 及后续正文装配模块。 |
| source / extension reading block | §9~§12 source 和 extension reading 块已保留。 |
| missing source / blocker | 本批未发现需要回 owning Step 的 blocker。 |

### 5. 禁入内容确认

| 禁入项 | 结果 |
|---|---|
| 是否修改 §1~§8 已装配正文或 §13~§18 pending marker | no |
| 是否写入 §13 config、§14 observability、§15 test 或后续章节正文 | no |
| 是否新增对象字段、DTO schema、port 方法、mapper、state、config key 或 evidence schema | no |
| 是否写入 physical DB schema、HTTP/RPC 数字、retry numeric policy、TTL、lease duration、topic/URL/secret、phase / commit boundary、implementation ledger、CI command 或 acceptance gate | no |
| 是否把 watch / handoff 伪装成已闭合 schema、port、mapper、config 或 test evidence | no |

### 6. R19.21 进入门禁

`R19.21 §13~§15 正式正文装配:先思考` 的允许范围:

- 读取并思考 §13~§15 source,即 Step 14~16 的回填草稿、source map、stop-review 和待确认事项。
- 思考 config / dependency、observability / audit、test cut 正文结构、与 §9~§12 的承接、禁入内容和 `R19.22` 写入计划。
- 不修改正式 `03-详细设计.md`。

`R19.21` 的禁止范围:

- 不得写正式 §13~§15 正文。
- 不得修改 §1~§12 已装配正文或 §16~§18 pending marker。
- 不得新增对象字段、DTO schema、port 方法、mapper、state、config key、evidence schema、phase / commit boundary、implementation ledger、CI command、acceptance gate 或 implementation code。

### 7. R19.20 stop-review

| 检查项 | 结果 |
|---|---|
| 是否按 R19.19 计划装配 §9~§12 | pass |
| 是否保留 §9~§12 校准来源和延伸阅读 | pass |
| 是否使用 Step 10~13 final candidate / stop-review 作为最新来源 | pass |
| 是否清除 §9~§12 pending marker 并标记 `assembled_by_R19.20` | pass |
| 是否保留 §13~§18 pending marker | pass |
| 是否未写下游 04/05/06/07 或 implementation artifacts | pass |
| 是否同步 flow 和项目台账到 R19.21 等待确认 | pass |

next_allowed_action: 等待用户确认后进入 Step 19 `R19.21 §13~§15 正式正文装配:先思考`;只允许读取并思考 §13~§15 source、config / dependency、observability / audit、test cut 正文结构、与 §9~§12 的承接、禁入内容和 `R19.22` 写入计划;不得修改正式 `03-详细设计.md`;不得写正式章节正文、正式实施计划、phase / commit boundary、implementation ledger、evidence schema、CI command、acceptance gate 或 implementation code。

---

## R19.21 §13~§15 正式正文装配:先思考

### 1. 当前模块状态

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm |
| 用户确认 | 已确认从 `R19.20` 推进到 `R19.21`。 |
| 本模块目标 | 只思考正式 `03-详细设计.md` §13~§15 的 source 读取结果、config / dependency、observability / audit、test cut 正文结构、与 §9~§12 的承接、禁入内容和 `R19.22` 写入计划。 |
| 本模块允许范围 | 读取 Step 14~16 的 final closure、source map、handoff、stop-review 和正式 `03` §13~§15 pending skeleton。 |
| 本模块禁止范围 | 不修改正式 `03-详细设计.md`;不写正式 §13~§15 正文;不修改 §1~§12 已装配正文或 §16~§18 pending marker;不新增对象字段、DTO schema、port 方法、mapper、state、config key、evidence schema、phase / commit boundary、implementation ledger、CI command、acceptance gate 或 implementation code。 |

### 2. source 读取结果

| source | 读取结论 | R19.22 用法 |
|---|---|---|
| `03_ddd_step_14_config_dependencies.md` R14.14 | Step 14 completed,写入 forbidden configurable boundary、Step 6~13 closure audit、`04/15/16/19/07` handoff、正式 §13 candidate structure/source map、watch/blocker closure;no hard blocker to Step 15。 | 作为 §13 config / dependency 正文的直接来源。 |
| `03_ddd_step_15_observability_audit.md` R15.16 | Step 15 completed,写入 Step 6~14 closure audit、Step 16 test handoff、formal §14 source map、forbidden carryover、Step 16 entry gate;未写正式 §14 candidate body。 | 作为 §14 observability / audit 正文的直接来源。 |
| `03_ddd_step_16_test_cut.md` R16.18 | Step 16 completed,写入 Step 5~15 source coverage audit、R16.1~R16.16 coverage index、formal §15 source map、forbidden carryover、downstream handoff、Step 17 entry gate;未写 formal §15 candidate body。 | 作为 §15 test cut 正文的直接来源。 |
| `03-详细设计.md` §13~§15 skeleton | §13~§15 仍为 pending,仅保留校准来源和延伸阅读。 | R19.22 只替换这三章 pending skeleton,不得触碰其他章节。 |

### 3. source hygiene 与使用裁决

| source hygiene 项 | 裁决 |
|---|---|
| Step 14 候选来源 | 以 R14.14 的 final source map 和 closure audit 为主体;R14.2~R14.12 只作为追溯来源,不直接拼正文。 |
| Step 15 候选来源 | 以 R15.16 的 formal §14 source map、closure audit、forbidden carryover 为主体;不写告警阈值、SLO、dashboard、采样率、retention 或 runbook。 |
| Step 16 候选来源 | 以 R16.18 的 formal §15 source map、coverage index、downstream handoff 为主体;不写完整 test case schema、fixture、evidence schema、CI pipeline、验收标准或实施代码。 |
| 正式 `03` skeleton | R19.21 不修改;R19.22 才能把 §13~§15 pending 替换为正文。 |
| downstream handoff | `04/05/06/07`、Step 17、Step 19 的 handoff 只能写为承接边界,不得提前落成配置键、测试用例、验收门禁或实施 commit。 |

### 4. §13~§15 正文结构思考

| 正式章节 | 装配结构 | 写入重点 | 禁入内容 |
|---|---|---|---|
| §13 配置引用与外部依赖绑定 | §13.1 scope;§13.2 config ownership/read boundary;§13.3 config reference families;§13.4 external dependency binding;§13.5 cross-repo dependency;§13.6 runtime builder/entry binding;§13.7 forbidden configurable boundary;§13.8 closure/handoff。 | 写 config 只绑定代码运行点和 adapter/runtime slot,不改变 truth/state/DTO/transaction/replay;only `core-contracts` compile dependency candidate;runtime/event/handoff/downstream 通过 port / target / fake 协作。 | 具体 env/profile/secret/topic/URL、实际 default、部署 profile、transport product、观测 schema、测试 case、commit boundary。 |
| §14 可观测性与审计埋点契约 | §14.1 layering;§14.2 structured log cuts;§14.3 metric cuts;§14.4 trace/span/correlation;§14.5 audit/operations fact;§14.6 redaction/sensitive boundary;§14.7 handoff。 | 写 log/metric/trace/audit/report/diagnostic 的分层、safe refs、低基数 label、body-free、redaction、source-missing stop。 | 具体 metric name、log field schema、span payload schema、告警阈值、SLO、dashboard、采样率、retention、runbook。 |
| §15 测试切口与最小验证清单 | §15.1 scope;§15.2 source map;§15.3 module cuts;§15.4 protocol/interface cuts;§15.5 state machine cuts;§15.6 consistency/idempotency/concurrency cuts;§15.7 error/config/observability cuts;§15.8 closure/handoff。 | 写最小测试切口、source Step、minimum assertion direction、forbidden shortcut 和 downstream handoff。 | TC ID、case priority、fixture JSON、evidence artifact schema、CI command、coverage target、acceptance gate、implementation code。 |

### 5. 与 §9~§12 的承接关系

| §9~§12 concern | §13 承接 | §14 承接 | §15 承接 |
|---|---|---|---|
| 状态 owner / forbidden transition | Config 不得新增、跳过、放宽或重命名状态迁移。 | Observability 只复制正式 state / marker,不得从后端反推状态。 | 覆盖 legal/illegal transition、state source 和 forbidden shortcut。 |
| logical persistence / transaction | Storage config 只选 adapter,不改变 logical store、UoW、stored replay 或 outcome persistence。 | log/metric 不替代 durable replay/report/audit source。 | 验证 accepted atomicity、rollback/no-commit、stored replay no-rerun。 |
| error / recovery surface | Disabled/degraded/unavailable/failed surfaces 复制正式 summary/outcome;raw config/adapter error 不生成 public marker。 | rejected/failed/degraded/unavailable/manual issue 只暴露 safe diagnostic。 | 验证 safe error、manual/design blocker、source-missing stop。 |
| concurrency / idempotency | Retry/lease/TTL 数值属于配置,semantic guard、duplicate replay、checkpoint source 不可配置关闭。 | duplicate replay 只记录 correlation,不新增 audit/candidate/truth mutation。 | 验证 same/different digest、in-flight、race、commit unknown、job resume。 |
| body-free / redaction | Config、fake、route/header、raw body 不得合成 source/marker。 | log/metric/span/audit/report/handoff 不含 raw body、secret、provider payload 或 synthetic marker。 | 验证 no raw body、no secret、low-cardinality labels、audit refs-only。 |

### 6. R19.22 写入计划思考

`R19.22 §13~§15 正式正文装配:再写入` 应只替换正式 `03-详细设计.md` §13~§15 pending skeleton,并同步 Step 19 文件、flow 和项目台账。

| batch | 文件 | 写入内容 |
|---|---|---|
| batch 1 | `projects/L3-method-library/03-详细设计.md` | 替换 §13~§15 pending skeleton 为正式正文,保留每章校准来源和延伸阅读,装配状态改为 `assembled_by_R19.22`。 |
| batch 2 | `03_ddd_step_19_formal_document_assembly.md` | 记录 R19.22 写入结果、§13~§15 source closure、pending marker 处理、watch/handoff 和 stop-review。 |
| batch 3 | `03_ddd_calibration_flow.md`;`project_execution_ledger.md` | 恢复点推进到 `R19.23 §16~§17 正式正文装配:先思考`。 |

R19.22 禁止:

- 修改 §1~§12 已装配正文或 §16~§18 pending marker。
- 写 §16 implementation handoff、§17 risk/open questions 或 §18 reference / final closure 正文。
- 新增对象字段、DTO schema、port 方法、mapper、state、config key、evidence schema、phase / commit boundary、implementation ledger、CI command、acceptance gate 或 implementation code。
- 把 Step 14~16 handoff 写成具体配置键、测试用例、fixture、证据 artifact、验收门禁或实施计划。

### 7. R19.21 stop-review

| 检查项 | 结果 |
|---|---|
| 是否读取 Step 14 R14.14 | pass |
| 是否读取 Step 15 R15.16 | pass |
| 是否读取 Step 16 R16.18 | pass |
| 是否确认正式 `03` §13~§15 仍为 pending skeleton | pass |
| 是否形成 §13~§15 正文结构思考 | pass |
| 是否形成 §9~§12 到 §13~§15 的承接思考 | pass |
| 是否形成 R19.22 写入计划 | pass |
| 是否未修改正式 `03-详细设计.md` | pass |
| 是否未写正式章节正文、下游文档或 implementation artifacts | pass |

next_allowed_action: 等待用户确认后进入 Step 19 `R19.22 §13~§15 正式正文装配:再写入`;只允许替换正式 `03-详细设计.md` §13~§15 pending skeleton 为正式正文、保留 source / extension reading、标记 `assembled_by_R19.22`,并同步 Step 19 文件、flow 和项目台账;不得修改 §1~§12 已装配正文或 §16~§18 pending marker;不得写 §16~§18 正文、正式实施计划、phase / commit boundary、implementation ledger、evidence schema、CI command、acceptance gate 或 implementation code。

---

## R19.22 §13~§15 正式正文装配:再写入

### 1. 当前模块状态

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm |
| 用户确认 | 已确认从 `R19.21` 推进到 `R19.22`。 |
| 本模块写入范围 | 正式 `03-详细设计.md` §13~§15 正文、`assembled_by_R19.22` 状态、正式 `03` 顶部 partial assembly 状态说明、Step 19 / flow / 项目台账恢复点。 |
| 本模块禁止范围 | 修改 §1~§12 已装配正文或 §16~§18 pending marker;写 §16~§18 正文;新增对象字段、DTO schema、port 方法、mapper、state、config key、evidence schema、phase / commit boundary、implementation ledger、CI command、acceptance gate 或 implementation code。 |

### 2. 正式 `03-详细设计.md` 写入结果

| 章节 | 写入结果 | 装配状态 |
|---|---|---|
| §13 配置引用与外部依赖绑定 | 已写入 scope、config ownership/read boundary、config reference families、external dependency binding、cross-repo dependency、runtime builder/entry binding、forbidden configurable boundary 和 handoff。 | `assembled_by_R19.22` |
| §14 可观测性与审计埋点契约 | 已写入 observability layering、structured log cuts、metric cuts、trace/span/correlation、audit/operations fact、redaction/sensitive boundary 和 downstream handoff。 | `assembled_by_R19.22` |
| §15 测试切口与最小验证清单 | 已写入 scope/source baseline、source map、module cuts、protocol/interface cuts、state machine cuts、consistency/idempotency/concurrency cuts、error/config/observability cuts 和 closure/handoff。 | `assembled_by_R19.22` |
| §1~§12 | 未修改正文;仍保持 R19.12 / R19.14 / R19.16 / R19.18 / R19.20 装配结果。 | assembled |
| §16~§18 | 未修改正文;仍保留 pending marker。 | pending |

正式 `03` 顶部状态同步为 partial assembly:§1~§4 已由 R19.12 装配,§5 已由 R19.14 装配,§6~§7 已由 R19.16 装配,§8 已由 R19.18 装配,§9~§12 已由 R19.20 装配,§13~§15 已由 R19.22 装配,§16~§18 待后续 R19.x 逐章装配。

### 3. source closure

| source | 装配裁决 |
|---|---|
| `03_ddd_step_14_config_dependencies.md` R14.14 | 作为正式 §13 的直接来源;保留 code binding point、forbidden configurable boundary、runtime builder、dependency binding 和 `04/15/16/07` handoff。 |
| `03_ddd_step_15_observability_audit.md` R15.16 | 作为正式 §14 的直接来源;装配 log/metric/trace/audit/operations/redaction boundary,不写 backend/schema/threshold/runbook。 |
| `03_ddd_step_16_test_cut.md` R16.18 | 作为正式 §15 的直接来源;装配最小测试切口和验证方向,不写 TC ID、fixture、evidence schema、CI、验收标准或 implementation code。 |

### 4. pending marker 处理

| marker | 处理 |
|---|---|
| §13~§15 pending | 已替换为 `assembled_by_R19.22`。 |
| §1~§12 装配状态 | 保持不变。 |
| §16~§18 pending | 保持不变,等待 R19.24 及后续正文装配模块。 |
| source / extension reading block | §13~§15 source 和 extension reading 块已保留。 |
| missing source / blocker | 本批未发现需要回 owning Step 的 blocker。 |

### 5. 禁入内容确认

| 禁入项 | 结果 |
|---|---|
| 是否修改 §1~§12 已装配正文或 §16~§18 pending marker | no |
| 是否写入 §16 implementation handoff、§17 risk/open questions 或 §18 reference/final closure 正文 | no |
| 是否新增对象字段、DTO schema、port 方法、mapper、state、config key 或 evidence schema | no |
| 是否写入具体 env/profile/secret/topic/URL、metric/log/span schema、TC ID、fixture、evidence artifact、CI command、acceptance gate、phase / commit boundary 或 implementation code | no |
| 是否把 Step 14~16 handoff 伪装成具体配置、测试方案、验收标准或实施计划 | no |

### 6. R19.23 进入门禁

`R19.23 §16~§17 正式正文装配:先思考` 的允许范围:

- 读取并思考 §16~§17 source,即 Step 17~18 的回填草稿、source map、stop-review 和待确认事项。
- 思考 implementation handoff、risk/open questions 正文结构、与 §13~§15 的承接、禁入内容和 `R19.24` 写入计划。
- 不修改正式 `03-详细设计.md`。

`R19.23` 的禁止范围:

- 不得写正式 §16~§17 正文。
- 不得修改 §1~§15 已装配正文或 §18 pending marker。
- 不得新增正式实施计划、commit boundary、代码文件清单、evidence schema、CI command、acceptance gate 或 implementation code。

### 7. R19.22 stop-review

| 检查项 | 结果 |
|---|---|
| 是否按 R19.21 计划装配 §13~§15 | pass |
| 是否保留 §13~§15 校准来源和延伸阅读 | pass |
| 是否使用 Step 14~16 final closure / source map 作为最新来源 | pass |
| 是否清除 §13~§15 pending marker 并标记 `assembled_by_R19.22` | pass |
| 是否保留 §16~§18 pending marker | pass |
| 是否未写下游 04/05/06/07 或 implementation artifacts | pass |
| 是否同步 flow 和项目台账到 R19.23 等待确认 | pass |

next_allowed_action: 等待用户确认后进入 Step 19 `R19.23 §16~§17 正式正文装配:先思考`;只允许读取并思考 §16~§17 source、implementation handoff、risk/open questions 正文结构、与 §13~§15 的承接、禁入内容和 `R19.24` 写入计划;不得修改正式 `03-详细设计.md`;不得写正式章节正文、正式实施计划、phase / commit boundary、implementation ledger、evidence schema、CI command、acceptance gate 或 implementation code。

---

## R19.23 §16~§17 正式正文装配:先思考

### 1. 当前模块状态

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm |
| 用户确认 | 已确认从 `R19.22` 推进到 `R19.23`。 |
| 本模块目标 | 只思考正式 `03-详细设计.md` §16~§17 的 source 读取结果、implementation handoff、risk/open questions 正文结构、与 §13~§15 的承接、禁入内容和 `R19.24` 写入计划。 |
| 本模块允许范围 | 读取 Step 17~18 的 final source map candidate、assemblable / forbidden content、completion checklist、entry / assembly gate 和正式 `03` §16~§17 pending skeleton。 |
| 本模块禁止范围 | 不修改正式 `03-详细设计.md`;不写正式 §16~§17 正文;不修改 §1~§15 已装配正文或 §18 pending marker;不新增正式实施计划、phase / commit boundary、implementation ledger、evidence schema、CI command、acceptance gate 或 implementation code。 |

### 2. source 读取结果

| source | 读取结论 | R19.24 用法 |
|---|---|---|
| `03_ddd_step_17_implementation_handoff.md` R17.14 | Step 17 completed,给出 formal §16 source map candidate、assemblable / forbidden content、Step 17 completion checklist、Step 18 entry gate、Step 19 assembly boundary 和 implementation starts only after formal 07 and ledger gates。 | 作为 §16 detailed design to implementation handoff 正文的直接来源。 |
| `03_ddd_step_18_risks_open_questions.md` R18.14 | Step 18 completed,给出 formal §17 source map candidate、assemblable / forbidden content、风险判断基线、已关闭风险族、风险表、待确认事项表、未确认前处理规则和 Step 19 entry gate。 | 作为 §17 risks / open questions 正文的直接来源。 |
| `03-详细设计.md` §16~§17 skeleton | §16~§17 仍为 pending,仅保留校准来源和延伸阅读;§1~§15 已装配,§18 pending。 | R19.24 只替换 §16~§17 pending skeleton,不得触碰其他章节。 |

### 3. source hygiene 与使用裁决

| source hygiene 项 | 裁决 |
|---|---|
| Step 17 候选来源 | 以 R17.14 的 formal §16 source map candidate 和 assembly boundary 为主体;R17.1~R17.13 只作为追溯来源,不直接拼完整过程记录。 |
| Step 18 候选来源 | 以 R18.14 的 formal §17 candidate 风险表、待确认事项表、未确认前处理规则和 Step 19 gate 为主体;不恢复旧 Step 18 或旧 formal `03` 风险口径。 |
| 正式 `03` skeleton | R19.23 不修改;R19.24 才能把 §16~§17 pending 替换为正文。 |
| implementation handoff | §16 只能写 detailed design 到 implementation plan 的输入、边界和 ownership;不得替 `07-实施计划.md` 写 required_reads、allowed_scope、required_checks、commit boundary 或 implementation ledger。 |
| risk / open questions | §17 只能写当前风险与待确认事项、owner 和未确认前处理规则;不得借风险表补对象字段、DTO、port、state、mapper、config key、evidence schema 或代码策略。 |

### 4. §16 正文结构思考

| 小节 | 装配结构 | 写入重点 | 禁入内容 |
|---|---|---|---|
| §16.1 Scope and boundary | 声明 Step 17 是 detailed design handoff,不是正式实施计划。 | 写 implementation via formal `07` and ledger gates 的总规则。 | phase / commit boundary、排期、任务分解。 |
| §16.2 Handoff overview | 概述 L3 source family、downstream consumer 和 implementation use。 | 写 Step 1~16 如何被 `04/05/06/07/18/19` 消费。 | governance 领域对象或旧 MethodContent 主线。 |
| §16.3 Source matrix | 精简装配 Step 1~16 到下游文档 / implementation via 07 的映射。 | 写 consumer、forbidden inference、blocker handling。 | 全量对象字段表、DTO 表、flow、状态矩阵或测试用例。 |
| §16.4 Preread and gate input | 写 preread candidate、gate ownership、agent redline、ledger handoff requirement。 | 强调它们是 07 输入,不是当前正式 required_reads。 | 具体 implementation ledger 实例、allowed_scope、required_checks。 |
| §16.5 Cross-document pre-audit | 写 field/marker/ref/state、protocol、query、persistence、replay、downstream、旧材料残留预复核维度。 | 保留发现 truth-source 缺口即回 owning Step 的 stop rule。 | 宣称所有 04/05/06/07、CI 或 evidence gate 已 pass。 |
| §16.6 Deferred ownership | 写 04/05/06/07/18/19 的职责边界和不得推断项。 | 防止实现侧补 config/test/acceptance/phase/evidence/schema。 | concrete config、TC ID、acceptance gate、CI command、code file list。 |
| §16.7 Assembly boundary | 写 Step 17 completion 和 Step 19 使用边界。 | formal §16 只作为移交清单,不能放行 implementation start。 | 直接进入实现、提交实现仓或生成 boundary 台账。 |

### 5. §17 正文结构思考

| 小节 | 装配结构 | 写入重点 | 禁入内容 |
|---|---|---|---|
| §17.1 Risk judgement baseline | 说明风险只来自当前 `00/01/02` 和 Step 1~17。 | 区分 downstream pending、implementation start blocker、formal assembly blocker。 | 恢复旧 Step 18 风险表或旧 P0/P1。 |
| §17.2 Closed risks | 装配已关闭风险族。 | 明确已闭口对象、port、flow、state、persistence、error、config binding、observability、test cut 不重复列 active risk。 | 用 closed risk 表新增设计事实。 |
| §17.3 Risk table | 装配 R18.14 formal candidate 风险表。 | 保留影响、阻塞范围、缓解方式、owner。 | 把下游 pending 误写为 detailed design blocker。 |
| §17.4 Open questions | 装配 R18.14 待确认事项表。 | 每项保留当前影响、确认方、未确认前处理方式。 | 无 owner 的泛化问题、实现侧自行决定的口径。 |
| §17.5 Handling rules | 装配未确认前处理规则。 | 缺 schema / port / state / mapper / config / evidence / phase 时必须回 owning source。 | synthetic marker、private map、测试 helper 或 fake 补正式缺口。 |
| §17.6 Step 19 / implementation note | 写 Step 19 可装配 formal `03`,但 implementation 仍等待 formal `07` and ledger gates。 | 保持 formal design completed 与 implementation start 的门禁分离。 | 直接放行实现或下游文档完成声明。 |

### 6. 与 §13~§15 的承接关系

| §13~§15 concern | §16 handoff 承接 | §17 risk/open questions 承接 |
|---|---|---|
| config / dependency | `04` 负责 concrete config schema、profile、secret、adapter binding;implementation via `07` 只能读正式配置设计。 | `04` 未生成属于 downstream pending;不得由实现侧补 config key、default、topic、URL 或 product binding。 |
| observability / audit | `07` 需要把 no raw body、safe marker、low-cardinality、audit refs-only 写成 implementation gate 输入。 | backend、threshold、SLO、dashboard、retention、runbook 未定不阻塞 detailed design,但阻塞 production / acceptance。 |
| test cut | `05/06/07` 分别承接 TC、suite、evidence、acceptance gate 和 required checks。 | `05/06` 未生成时不得声明正式测试覆盖或验收通过,不得由实现仓定义 evidence schema。 |
| source-missing stop | Step 17 handoff 要求发现 truth-source 缺口即回 owning Step。 | Step 18 将这个规则写为 active watch;不是允许实现侧 workaround。 |

### 7. R19.24 写入计划思考

`R19.24 §16~§17 正式正文装配:再写入` 应只替换正式 `03-详细设计.md` §16~§17 pending skeleton,并同步 Step 19 文件、flow 和项目台账。

| batch | 文件 | 写入内容 |
|---|---|---|
| batch 1 | `projects/L3-method-library/03-详细设计.md` | 替换 §16~§17 pending skeleton 为正式正文,保留每章校准来源和延伸阅读,装配状态改为 `assembled_by_R19.24`。 |
| batch 2 | `03_ddd_step_19_formal_document_assembly.md` | 记录 R19.24 写入结果、§16~§17 source closure、pending marker 处理、watch/handoff 和 stop-review。 |
| batch 3 | `03_ddd_calibration_flow.md`;`project_execution_ledger.md` | 恢复点推进到 `R19.25 §18 参考与最终闭环:先思考`。 |

R19.24 禁止:

- 修改 §1~§15 已装配正文或 §18 pending marker。
- 写 §18 参考 / final closure 正文。
- 写正式 `04/05/06/07` 正文、implementation ledger、boundary ledger、phase / commit boundary、CI command、acceptance gate 或 implementation code。
- 新增对象字段、DTO schema、port 方法、mapper、state、config key、test evidence schema 或 code workaround。
- 把 Step 17 handoff candidate 写成正式实施计划,或把 Step 18 downstream pending 写成已完成下游文档。

### 8. R19.23 stop-review

| 检查项 | 结果 |
|---|---|
| 是否读取 Step 17 R17.14 | pass |
| 是否读取 Step 18 R18.14 | pass |
| 是否确认正式 `03` §16~§17 仍为 pending skeleton | pass |
| 是否形成 §16 implementation handoff 正文结构思考 | pass |
| 是否形成 §17 risk/open questions 正文结构思考 | pass |
| 是否形成 §13~§15 到 §16~§17 的承接思考 | pass |
| 是否形成 R19.24 写入计划 | pass |
| 是否未修改正式 `03-详细设计.md` | pass |
| 是否未写正式章节正文、下游文档或 implementation artifacts | pass |

next_allowed_action: 等待用户确认后进入 Step 19 `R19.24 §16~§17 正式正文装配:再写入`;只允许替换正式 `03-详细设计.md` §16~§17 pending skeleton 为正式正文、保留 source / extension reading、标记 `assembled_by_R19.24`,并同步 Step 19 文件、flow 和项目台账;不得修改 §1~§15 已装配正文或 §18 pending marker;不得写 §18 正文、正式实施计划、phase / commit boundary、implementation ledger、evidence schema、CI command、acceptance gate 或 implementation code。

---

## R19.24 §16~§17 正式正文装配:再写入

### 1. 当前模块状态

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm |
| 用户确认 | 已确认从 `R19.23` 推进到 `R19.24`。 |
| 本模块写入范围 | 正式 `03-详细设计.md` §16~§17 正文、`assembled_by_R19.24` 状态、正式 `03` 顶部 partial assembly 状态说明、Step 19 / flow / 项目台账恢复点。 |
| 本模块禁止范围 | 修改 §1~§15 已装配正文或 §18 pending marker;写 §18 正文;新增正式实施计划、phase / commit boundary、implementation ledger、evidence schema、CI command、acceptance gate 或 implementation code。 |

### 2. 正式 `03-详细设计.md` 写入结果

| 章节 | 写入结果 | 装配状态 |
|---|---|---|
| §16 详细设计到实施计划的承接清单 | 已写入 scope and boundary、handoff overview、source matrix、preread and gate input、cross-document pre-audit、deferred ownership 和 final implementation start rule。 | `assembled_by_R19.24` |
| §17 风险与待确认事项 | 已写入 risk judgement baseline、closed risks、active risk table、open questions、handling rules 和 implementation note。 | `assembled_by_R19.24` |
| §1~§15 | 未修改正文;仍保持 R19.12 / R19.14 / R19.16 / R19.18 / R19.20 / R19.22 装配结果。 | assembled |
| §18 | 未修改正文;仍保留 pending marker。 | pending |

正式 `03` 顶部状态同步为 partial assembly:§1~§4 已由 R19.12 装配,§5 已由 R19.14 装配,§6~§7 已由 R19.16 装配,§8 已由 R19.18 装配,§9~§12 已由 R19.20 装配,§13~§15 已由 R19.22 装配,§16~§17 已由 R19.24 装配,§18 待后续 R19.x 逐章装配。

### 3. source closure

| source | 装配裁决 |
|---|---|
| `03_ddd_step_17_implementation_handoff.md` R17.14 | 作为正式 §16 的直接来源;保留 detailed design handoff 定位、implementation via formal `07` and ledger gates、source matrix、pre-audit、downstream ownership 和 historical pollution exclusion。 |
| `03_ddd_step_18_risks_open_questions.md` R18.14 | 作为正式 §17 的直接来源;保留 risk judgement baseline、closed risk families、active risk / open question tables、handling rules 和 implementation start blocker。 |
| `03-详细设计.md` §16~§17 skeleton | 已替换为正式正文;校准来源和延伸阅读块保留。 |

### 4. pending marker 处理

| marker | 处理 |
|---|---|
| §16~§17 pending | 已替换为 `assembled_by_R19.24`。 |
| §1~§15 装配状态 | 保持不变。 |
| §18 pending | 保持不变,等待 R19.26 或后续正文装配模块。 |
| source / extension reading block | §16~§17 source 和 extension reading 块已保留。 |
| missing source / blocker | 本批未发现需要回 owning Step 的 blocker。 |

### 5. 禁入内容确认

| 禁入项 | 结果 |
|---|---|
| 是否修改 §1~§15 已装配正文或 §18 pending marker | no |
| 是否写入 §18 参考 / final closure 正文 | no |
| 是否写入正式 `04/05/06/07` 正文、implementation ledger、boundary ledger 或 phase / commit boundary | no |
| 是否新增对象字段、DTO schema、port 方法、mapper、state、config key 或 evidence schema | no |
| 是否写入 CI command、acceptance gate、代码文件清单或 implementation code | no |
| 是否把 Step 17 handoff candidate 写成正式实施计划 | no |
| 是否把 Step 18 downstream pending 写成已完成下游文档 | no |

### 6. R19.25 进入门禁

`R19.25 §18 参考与最终闭环:先思考` 的允许范围:

- 读取并思考 §18 source,即正式 `00/01/02`、Step 1~19 source、SOP / 书写规范 / 中间产物规范 / 可落码性标准。
- 思考 final reference chapter、document-wide source closure、pending marker cleanup、final self-check、Step 19 completed stop-review 和下游文档进入门禁。
- 不修改正式 `03-详细设计.md`。

`R19.25` 的禁止范围:

- 不得写正式 §18 正文。
- 不得修改 §1~§17 已装配正文。
- 不得进入 `04/05/06/07`。
- 不得写正式实施计划、phase / commit boundary、implementation ledger、evidence schema、CI command、acceptance gate 或 implementation code。

### 7. R19.24 stop-review

| 检查项 | 结果 |
|---|---|
| 是否按 R19.23 计划装配 §16~§17 | pass |
| 是否保留 §16~§17 校准来源和延伸阅读 | pass |
| 是否使用 Step 17~18 final source map / stop-review 作为最新来源 | pass |
| 是否清除 §16~§17 pending marker 并标记 `assembled_by_R19.24` | pass |
| 是否保留 §18 pending marker | pass |
| 是否未写正式 `04/05/06/07`、implementation ledger 或 implementation artifacts | pass |
| 是否同步 flow 和项目台账到 R19.25 等待确认 | pass |

next_allowed_action: 等待用户确认后进入 Step 19 `R19.25 §18 参考与最终闭环:先思考`;只允许读取并思考 §18 source、final reference chapter、document-wide source closure、pending marker cleanup、final self-check、Step 19 completed stop-review 和下游文档进入门禁;不得修改正式 `03-详细设计.md`;不得写正式章节正文、正式实施计划、phase / commit boundary、implementation ledger、evidence schema、CI command、acceptance gate 或 implementation code。

---

## R19.25 §18 参考与最终闭环:先思考

### 1. 当前模块状态

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm |
| 用户确认 | 已确认从 `R19.24` 推进到 `R19.25`。 |
| 本模块目标 | 只思考正式 `03-详细设计.md` §18 的 source 读取结果、final reference chapter、document-wide source closure、pending marker cleanup、final self-check、Step 19 completed stop-review 和下游文档进入门禁。 |
| 本模块允许范围 | 读取正式 `00/01/02`、Step 1~19 source、SOP / 书写规范 / 中间产物规范 / 可落码性标准、正式 `03` §18 pending skeleton。 |
| 本模块禁止范围 | 不修改正式 `03-详细设计.md`;不写正式 §18 正文;不修改 §1~§17 已装配正文;不进入 `04/05/06/07`;不写正式实施计划、phase / commit boundary、implementation ledger、evidence schema、CI command、acceptance gate 或 implementation code。 |

### 2. source 读取结果

| source | 读取结论 | R19.26 用法 |
|---|---|---|
| `03-详细设计.md` §18 skeleton | §18 仍为 pending,已列当前 `00/01/02`、Step 19、SOP、书写规范、中间产物规范和可落码性标准。 | R19.26 替换为正式参考正文并标记 `assembled_by_R19.26`。 |
| `详细设计讨论流程_SOP.md` Step 19 | Step 19 目标是整理正式 `03` 并检查书写规范和可还原标准;完成条件是正式详细设计可交给实现者并通过评审清单。 | 作为 final self-check 和 completed stop-review 的直接依据。 |
| `详细设计书写规范.md` §5.18 / §6 | §18 必须输出参考文档表;评审清单要求上游承接、校准来源、模块展开、对象/port/protocol/flow/state/persistence/error/idempotency/test/downstream boundary 完整。 | 作为 §18 结构和 final review checklist 的依据。 |
| `设计文档讨论中间产物规范.md` §8 | 正式回填必须满足中间产物、结构化产物、回填草稿、待确认事项不写成正式结论和用户确认。 | 作为 R19.26 写入门禁和 stop-review 依据。 |
| `设计真相源闭环与可落码性标准.md` §8 | 提供字段、DTO、query、maintenance job、artifact、config、evidence、phase / boundary 等正反例。 | 作为 final source-closure watch,不在 §18 复制全表。 |
| Step 1~18 confirmed source | 已分别装配到 §1~§17;§18 应列参考入口,不重新复制每个 Step 的正文。 | R19.26 用于 source family table 和 final closure summary。 |

### 3. §18 正文结构思考

| 小节 | 装配结构 | 写入重点 | 禁入内容 |
|---|---|---|---|
| §18.1 Reference scope | 说明 §18 只列引用与追溯入口。 | 区分正式上游、calibration source、standards、framework reference。 | 新增设计事实、对象字段、port、flow、状态或风险。 |
| §18.2 Formal upstream references | 列 `00/01/02`。 | 写每份上游对 `03` 的用途。 | 重写需求、架构或概要结论。 |
| §18.3 Calibration source references | 列 `03_ddd_calibration_flow.md` 和 Step 1~19 source families。 | 按章节映射 Step 1~19,作为追溯入口。 | 全量复制 Step 内容或过程讨论。 |
| §18.4 Standards references | 列 SOP、书写规范、中间产物规范、可落码性标准。 | 写各规范在 Step 19 / final self-check 中的用途。 | 把规范内容改写成项目专属新规则。 |
| §18.5 Framework reference | 标注 L1-governance 只作为框架深度参考。 | 明确不得复制 governance 领域事实、模块名、协议数量或实现路径。 | 引入 governance 领域语义。 |
| §18.6 Final closure note | 写 formal `03` 装配完成和下游文档仍需按门禁生成。 | 明确 implementation 仍等待 formal `07` and ledgers。 | 创建 `04/05/06/07` 正文或 implementation ledger。 |

### 4. document-wide source closure 思考

| Formal section family | Source closure | R19.26 final check |
|---|---|---|
| §1~§4 | 已由 R19.12 装配,来源 Step 1~4 与 current `00/01/02`。 | 保留 `assembled_by_R19.12`;不改正文。 |
| §5 | 已由 R19.14 装配,来源 Step 5。 | 保留 `assembled_by_R19.14`;确认模块主轴仍清楚。 |
| §6~§7 | 已由 R19.16 装配,来源 Step 6~8。 | 保留 `assembled_by_R19.16`;确认 object / trait / protocol index 不互相冲突。 |
| §8 | 已由 R19.18 装配,来源 Step 9。 | 保留 `assembled_by_R19.18`;确认 flow summary 未越界成 code。 |
| §9~§12 | 已由 R19.20 装配,来源 Step 10~13。 | 保留 `assembled_by_R19.20`;确认 state / persistence / error / idempotency 主链完整。 |
| §13~§15 | 已由 R19.22 装配,来源 Step 14~16。 | 保留 `assembled_by_R19.22`;确认 config / observability / test cut 未写下游 schema。 |
| §16~§17 | 已由 R19.24 装配,来源 Step 17~18。 | 保留 `assembled_by_R19.24`;确认 implementation start 仍 blocked until `07` and ledgers。 |
| §18 | 仍 pending。 | R19.26 写正式参考表并标记 `assembled_by_R19.26`。 |

### 5. final self-check 思考

R19.26 的 final self-check 应在 Step 19 文件中记录,正式 `03` 只写 §18 参考与简短 final closure note,不把完整自检过程塞进正式正文。

| Review item | Check basis | Expected R19.26 result |
|---|---|---|
| 18 章主链 | `详细设计书写规范.md` §3 / §5 | §1~§18 均存在且无 pending marker。 |
| 每章校准来源 | `详细设计书写规范.md` §4.5 | §1~§18 均有校准来源和延伸阅读。 |
| 上游承接 | SOP Step 19 / 书写规范评审清单 | §1~§2 明确承接 `00/01/02`。 |
| 模块主轴 | 书写规范评审清单 | §5 以模块为主轴,不是全局对象堆叠。 |
| object / trait / protocol / flow / state closure | SOP Step 19 七问 / 可落码性标准 | §5~§12 有索引与 source,缺口不交给实现侧。 |
| config / observability / test boundary | 书写规范 / Step 14~16 | §13~§15 不替 `04/05/06`。 |
| implementation handoff | 书写规范 §5.16 / Step 17 | §16 不替 `07`,只提供 handoff 输入。 |
| risks / open questions | 书写规范 §5.17 / Step 18 | §17 不把待确认写成已确认。 |
| downstream boundary | 书写规范评审清单 | `04/05/06/07` 仍由下游文档生成,implementation 不直接开工。 |
| old material exclusion | Step 1~2 / Step 18 | 旧 MethodContent / P0 / P1 等未进入正式主线。 |

### 6. pending marker cleanup 思考

| Marker family | Current state | R19.26 expected action |
|---|---|---|
| §1~§17 pending marker | 已清除。 | 保持不变。 |
| §18 pending marker | 仍存在。 | 替换为 `assembled_by_R19.26`。 |
| document top current note | 仍写 §18 待后续装配。 | 改为 formal assembly completed;§1~§18 已完成装配。 |
| flow / ledger status | Step 19 in_progress / waiting R19.25。 | 改为 Step 19 completed_wait_user_confirm 或 completed,等待用户确认进入 `04-配置设计.md` full-restart 开工。 |
| downstream documents | `04/05/06/07` blocked_by_03_not_completed。 | R19.26 可把 blocker 改为 waiting_user_confirm_to_start,但不得创建或写下游正文。 |

### 7. R19.26 写入计划思考

`R19.26 §18 参考与最终闭环:再写入` 应完成正式 `03-详细设计.md` 的最后装配,并同步 Step 19 / flow / 项目台账。

| batch | 文件 | 写入内容 |
|---|---|---|
| batch 1 | `projects/L3-method-library/03-详细设计.md` | 替换 §18 pending skeleton 为正式参考章节,保留校准来源和延伸阅读,标记 `assembled_by_R19.26`,顶部状态改为 formal assembly completed。 |
| batch 2 | `03_ddd_step_19_formal_document_assembly.md` | 记录 R19.26 写入结果、source closure、pending marker cleanup、final self-check 和 Step 19 completed stop-review。 |
| batch 3 | `03_ddd_calibration_flow.md`;`project_execution_ledger.md` | 将 Step 19 / `03-详细设计.md` 标记为 completed,下一动作等待用户确认进入 `04-配置设计.md` full-restart 开工。 |

R19.26 禁止:

- 修改 §1~§17 已装配正文,除非发现明确 blocker 并暂停回 owning Step。
- 写 `04/05/06/07` 正文、正式实施计划、phase / commit boundary、implementation ledger、evidence schema、CI command、acceptance gate 或 implementation code。
- 把 downstream pending 写成已完成下游文档。
- 把 final self-check 中发现的问题压进 §18 参考章节后继续 completed。

### 8. R19.25 stop-review

| 检查项 | 结果 |
|---|---|
| 是否读取 formal §18 pending skeleton | pass |
| 是否读取 SOP Step 19 | pass |
| 是否读取详细设计书写规范 §5.18 / §6 | pass |
| 是否读取中间产物规范回填门禁 | pass |
| 是否读取可落码性标准正反例总表 | pass |
| 是否形成 §18 正文结构思考 | pass |
| 是否形成 document-wide source closure 思考 | pass |
| 是否形成 pending marker cleanup 和 final self-check 思考 | pass |
| 是否形成 R19.26 写入计划 | pass |
| 是否未修改正式 `03-详细设计.md` | pass |
| 是否未写正式章节正文、下游文档或 implementation artifacts | pass |

next_allowed_action: 等待用户确认后进入 Step 19 `R19.26 §18 参考与最终闭环:再写入`;只允许替换正式 `03-详细设计.md` §18 pending skeleton 为正式参考章节、标记 `assembled_by_R19.26`、完成 document-wide source closure / pending marker cleanup / final self-check / Step 19 completed stop-review,并同步 flow 和项目台账;不得修改 §1~§17 已装配正文;不得写 `04/05/06/07` 正文、正式实施计划、phase / commit boundary、implementation ledger、evidence schema、CI command、acceptance gate 或 implementation code。

---

## R19.26 §18 参考与最终闭环:再写入

### 1. 当前模块状态

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm |
| 用户确认 | 已确认从 `R19.25` 推进到 `R19.26`。 |
| 本模块写入范围 | 正式 `03-详细设计.md` §18 正文、`assembled_by_R19.26` 状态、正式 `03` 顶部 completed 状态、Step 19 final self-check、Step 19 / flow / 项目台账 completed 状态。 |
| 本模块禁止范围 | 修改 §1~§17 已装配正文;写 `04/05/06/07` 正文;新增正式实施计划、phase / commit boundary、implementation ledger、evidence schema、CI command、acceptance gate 或 implementation code。 |

### 2. 正式 `03-详细设计.md` 写入结果

| 章节 | 写入结果 | 装配状态 |
|---|---|---|
| §18 参考 | 已写入 reference scope、formal upstream references、calibration source references、standards references、framework reference 和 final closure note。 | `assembled_by_R19.26` |
| §1~§17 | 未修改正文;仍保持 R19.12 / R19.14 / R19.16 / R19.18 / R19.20 / R19.22 / R19.24 装配结果。 | assembled |
| 文档顶部状态 | 已从 `formal assembly in_progress` 改为 `formal assembly completed`。 | completed |

正式 `03` 顶部状态同步为 formal assembly completed:§1~§18 已由 Step 19 R19.12~R19.26 逐章装配完成。implementation start 仍 blocked until formal `07-实施计划.md` and implementation ledger / boundary gates。

### 3. source closure

| source | 装配裁决 |
|---|---|
| current `00-需求文档.md` / `01-架构设计.md` / `02-概要设计.md` | 作为正式上游 references 写入 §18.2。 |
| Step 1~19 calibration source | 作为 calibration source references 写入 §18.3,按 formal section coverage 映射。 |
| SOP / 书写规范 / 中间产物规范 / 可落码性标准 | 作为 standards references 写入 §18.4。 |
| L1-governance | 作为 framework reference 写入 §18.5,明确仅参考框架深度,不得复制领域事实。 |

### 4. pending marker cleanup

| marker | 处理 |
|---|---|
| §18 pending | 已替换为 `assembled_by_R19.26`。 |
| §1~§17 装配状态 | 保持不变。 |
| formal `03` 全文 pending marker | 已清除。 |
| source / extension reading block | §18 source 和 extension reading 块已保留。 |
| missing source / blocker | 本批未发现需要回 owning Step 的 blocker。 |

### 5. final self-check

| Review item | Basis | Result | Note |
|---|---|---|---|
| 18 章主链 | `详细设计书写规范.md` §3 / §5 | pass | §1~§18 均存在。 |
| 每章校准来源 | `详细设计书写规范.md` §4.5 | pass | §1~§18 均保留校准来源、延伸阅读和装配状态。 |
| 上游承接 | SOP Step 19 / 书写规范评审清单 | pass | §1~§2 明确承接 current `00/01/02`。 |
| 模块主轴 | 书写规范评审清单 | pass | §5 以 L3-method-library 模块实现契约为主轴。 |
| object / trait / protocol / flow / state closure | SOP Step 19 七问 / 可落码性标准 | pass | §5~§12 提供索引和 source;字段级细节回指 Step 5~13。 |
| config / observability / test boundary | 书写规范 / Step 14~16 | pass | §13~§15 未替 `04/05/06` 写具体 schema、TC 或验收门禁。 |
| implementation handoff | 书写规范 §5.16 / Step 17 | pass | §16 不替 `07`,只提供 handoff 输入和 gate ownership。 |
| risks / open questions | 书写规范 §5.17 / Step 18 | pass | §17 保留风险、待确认事项、owner 和未确认前处理规则。 |
| reference chapter | 书写规范 §5.18 | pass | §18 写入参考文档表和 final closure note。 |
| downstream boundary | 书写规范评审清单 | pass | `04/05/06/07` 仍由后续文档生成,implementation 不直接开工。 |
| old material exclusion | Step 1~2 / Step 18 | pass | 旧 MethodContent / P0 / P1 / publish / snapshot / fingerprint / outbox / delivery 未进入正式主线。 |
| pending marker cleanup | Step 19 R19.25 plan | pass | 正式 `03` 不再包含 pending 装配状态。 |

### 6. 禁入内容确认

| 禁入项 | 结果 |
|---|---|
| 是否修改 §1~§17 已装配正文 | no |
| 是否写入 `04/05/06/07` 正文 | no |
| 是否创建正式实施计划、phase / commit boundary、implementation ledger 或 boundary ledger | no |
| 是否新增对象字段、DTO schema、port 方法、mapper、state、config key 或 evidence schema | no |
| 是否写入 CI command、acceptance gate、代码文件清单或 implementation code | no |
| 是否把 downstream pending 写成已完成下游文档 | no |
| 是否把 final self-check 中的问题压进 §18 后继续 completed | no;未发现 Step 19 阻塞项 |

### 7. Step 19 completed stop-review

| 检查项 | 结果 |
|---|---|
| 是否按书写规范装配正式 `03-详细设计.md` 18 章主链 | pass |
| 是否从 current `00/01/02` 与 Step 1~18 confirmed source 装配正文 | pass |
| 是否保留每章校准来源和延伸阅读 | pass |
| 是否完成 §1~§18 全部 pending marker cleanup | pass |
| 是否执行 document-wide source closure 和 final self-check | pass |
| 是否未继承旧 formal `03`、旧 Step completed、旧 MethodContent / P0 / P1 主线 | pass |
| 是否未写 `04/05/06/07` 正文或 implementation artifacts | pass |
| 是否明确 implementation still blocked until formal `07` and implementation ledgers | pass |
| 是否同步 flow 和项目台账为 `03-详细设计.md` completed | pass |

Step 19 final status: completed_wait_user_confirm。

next_allowed_action: `03-详细设计.md` full-restart formal assembly completed;等待用户确认后进入 `04-配置设计.md` full-restart 开工;只允许按配置设计 SOP 创建 / 更新 `04` 的 calibration flow 和 Step 1 开工记录;不得直接写实现仓代码、正式实施计划、phase / commit boundary、implementation ledger、evidence schema、CI command、acceptance gate 或 implementation code。
