# Step 1. 确认实施输入边界

> 对应 SOP: `standards/document/实施计划讨论流程_SOP.md` Step 1
> 回填章节: `07-实施计划.md` §1 与上游文档的关系声明
> 当前模块: `R1.2 input boundary:再写入`

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 1 确认实施输入边界 |
| 当前模块 | `R1.2 input boundary:再写入` |
| 当前状态 | completed_confirmed |
| 输入基线 | `00-需求文档.md`;`01-架构设计.md`;`02-概要设计.md`;`03-详细设计.md`;`04-配置设计.md`;`05-测试方案.md`;`06-验收标准.md`;实施计划 SOP / 书写规范;代码实施台账规范;可落码性标准 |
| 输出文件 | `projects/L3-method-library/design-calibration/07_implementation_plan_step_01_input_boundary.md` |
| 停审方式 | 用户已确认 Step 1,允许进入 Step 2 |

## 2. 本步输入

| 输入 | 状态 | 本 Step 用途 |
|---|---|---|
| `projects/L3-method-library/00-需求文档.md` | full-restart completed | 固定仓定位、目标 / 非目标、FR-ML、BR-ML、NFR-ML、使用方、依赖和验收方向 |
| `projects/L3-method-library/01-架构设计.md` | completed | 固定 Definition vs Use、truth owner、依赖方向、数据所有权、交互方式和架构红线 |
| `projects/L3-method-library/02-概要设计.md` | completed | 固定八组件代码主体框架、关键对象轮廓、接口骨架、处理流、状态和配置影响 |
| `projects/L3-method-library/03-详细设计.md` | formal assembly completed | 固定对象、port、protocol、flow、状态、事务、错误、并发、配置、观测和实施承接 |
| `projects/L3-method-library/04-配置设计.md` | formal assembly completed | 固定 profile、config source、adapter binding、secret/redaction、加载校验、失效和下游承接 |
| `projects/L3-method-library/05-测试方案.md` | formal assembly completed | 固定 `TC-ML-*`、suite、gate、artifact/report、`EV-ML-*` 和 regression / risk 规则 |
| `projects/L3-method-library/06-验收标准.md` | formal assembly completed | 固定 AC、VETO、baseline、evidence、risk acceptance 和 final decision 口径 |
| `projects/L3-method-library/07-实施计划.md` | old_direction_input | 只用于识别旧主线污染,不得作为新版实施计划结论 |
| `standards/document/实施计划讨论流程_SOP.md` | 已读取 | 固定 Step 1~13 讨论顺序和停审纪律 |
| `standards/document/实施计划书写规范.md` | 已读取 | 固定正式 `07` 章节结构、phase / commit boundary 和正式回填规则 |
| `standards/document/代码实施台账与门禁规范.md` | 标准输入 | 固定 implementation ledger、boundary ledger、Commit Gate、Handoff Gate 和 blocker 回流 |
| `standards/document/设计真相源闭环与可落码性标准.md` | 标准输入 | 固定实现移交前 schema / port / state / mapper / config / evidence 闭口规则 |
| `projects/L1-governance/design-calibration/07_implementation_plan_*` | framework_reference | 只参考框架深度和门禁表达,不复制治理领域事实 |

## 3. SOP 问题回答

1. 当前仓是否已经具备完整的 `00` / `01` / `02` / `03` / `05` / `06` 文档。

   回答: 已具备,且还具备 full-restart 后的 `04-配置设计.md`。这些文档已形成新版 `07` 的上游输入。旧 `07-实施计划.md` 仍存在,但它属于 old_direction_input,不能继续作为正式实施计划。

2. 哪些上游文档版本是本轮实施计划的基线。

   回答: 本轮使用当前 `projects/L3-method-library/00`~`06` 作为设计输入,当前设计 HEAD 为 `867f348`。正式移交实现前,`07` 还必须在 Step 12 / Step 13 固定设计 baseline 和 source refs,不得用 `latest` 或旧 `07` 结论作为实现基线。

3. 详细设计是否已经足以支持 1:1 实现。

   回答: `03-详细设计.md` 已完成 full-restart 装配,并明确 implementation start blocked until formal `07` and implementation ledger / boundary gates。它足以进入实施计划讨论,但不等于每个 commit boundary 已经完成实现移交审计。Step 6 必须按 boundary 复核对象字段、DTO、port、state、transaction、mapper、config、evidence 和 phase scope。

4. 测试方案和验收标准是否足以定义阶段门禁。

   回答: `05-测试方案.md` 已定义 `TC-ML-*`、suite family、artifact/report 和 `EV-ML-*`;`06-验收标准.md` 已定义 AC、VETO、baseline、evidence、risk acceptance 和 final decision。它们足以进入 Step 7 讨论,但真实 run_id、implementation commit、config digest、artifact/report pair 属于实施 / 验收执行期,不得在设计阶段伪造。

5. 是否存在上游文档之间的冲突。

   回答: Step 1 未发现阻塞继续讨论的新版 `00`~`06` 显性冲突。已知主要风险来自旧 `07` 正文:它仍以 `MethodContent`、publish、snapshot、outbox、fingerprint、PostgreSQL、GATE-T、AC-P0 等旧主线组织实施阶段,与当前八组件和 `TC-ML/EV-ML` 口径不一致。该风险必须在新版 `07` 中隔离。

6. 详细设计是否已经完成字段闭环、DTO 构造闭环、状态闭环和 phase boundary 复核。

   回答: 详细设计正文和 Step 17 / Step 19 已完成实施承接预复核,但 phase / commit boundary 尚未由新版 `07` 定义,因此 boundary 级复核尚未完成。该复核由 Step 5~Step 7 尤其 Step 6 承担。

7. 测试方案和验收标准是否使用详细设计正式字段、状态、接口和证据名称。

   回答: `05` 和 `06` 已使用 current `TC-ML-*`、`EV-ML-*`、suite family、artifact/report、VETO-ML 和 `reports/runs/<run_id>` 口径。新版 `07` 必须继续引用这些名称,不得恢复旧 GATE-T / AC-P0 / EV-001 静态编号主线。

8. 哪些缺口会阻塞实施计划,哪些缺口可以记录为风险继续推进。

   回答: 当前没有阻塞进入 Step 2 的缺口。阻塞正式移交实现的缺口包括新版 `07` 尚未完成、implementation ledger / boundary ledger 尚未设计、phase / commit boundary 审计尚未完成、真实 implementation baseline 尚未固定。可继续推进但需记录的风险包括正式 `07` 旧正文污染、目标实现仓需后续检查、实际 evidence 尚未产生。

## 4. 当前文档问题诊断

| 位置 | 当前问题 | 影响 | 本 Step 处理 |
|---|---|---|---|
| `projects/L3-method-library/07-实施计划.md` | 仍是旧方向正文,主线包含 `MethodContent`、publish、snapshot、outbox、fingerprint、PostgreSQL、GATE-T、AC-P0 等旧口径 | 若继续沿用,会把已废弃实施边界反向污染新版 `00`~`06` | 标记为 old_direction_input;Step 13 前不修改 |
| `design-calibration/07_*` | 之前不存在新版实施计划校准链 | 无法追踪新版 `07` 如何从 `00`~`06` 收敛 | 新建 flow 和 Step 1 中间产物 |
| phase / commit boundary | 新版 `07` 尚未定义 | 无法给实现 agent 合法开工边界和 evidence 归属 | Step 5~7 分步收敛 |
| implementation ledger | 尚未定义路径、字段、状态和恢复流程 | 实现 agent 容易自行发挥台账或跳 boundary | Step 3 / 6 / 7 / 11 / 12 必须固定 |
| target implementation repo | `/home/aris/Projects/quantalithos-method-library` 存在,但仓内规范、历史提交、workspace 和 git config 未检查 | 影响实施前置条件和提交纪律 | Step 3 前置检查;不得在 Step 1 直接承诺代码落点 |
| evidence / report | `05/06` 已定义门禁,但未有真实 run artifact | 不阻塞设计,阻塞验收裁决 | Step 7 / Step 12 固定执行期门禁 |

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| `07` 入口 | 旧正式文档直接存在,无新版 flow | 新增 `07_implementation_plan_calibration_flow.md` | 避免直接在旧正文上续写 |
| 输入边界 | 旧 `07` 混用旧 `00`~`06` 口径 | 明确 current `00`~`06` 是权威输入 | 防止旧 MethodContent / publish 主线回流 |
| 实施台账 | 旧 `07` 未承接当前代码实施台账规范 | 明确后续必须收敛 implementation ledger / boundary ledger | 防止实现 agent 自行发明流程 |
| boundary 审计 | 旧 `07` 以阶段任务和 gate 为主 | 明确 Step 6 必须做 commit boundary 经验复核 | 符合可落码性标准和近期实践 |
| 正式写入 | 可能直接改正式 `07` | Step 13 前不修改正式 `07` | 符合中间产物规范 |

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 直接修旧 `07` | 快速得到正文 | 旧主线污染严重,容易遗漏新版八组件和 implementation ledger | 不采用 |
| 删除旧 `07` 并立即重写正式正文 | 能清掉旧内容 | 跳过 Step 1~12 中间产物,不可追溯 | 不采用 |
| 先建立 flow 和 Step 1,逐步收敛后 Step 13 重写正式 `07` | 可追溯,可停审,可对齐 L1-governance 框架和当前标准 | 需要多轮确认 | 采用 |
| 将目标实现仓未检查视为当前 blocker | 最保守 | 会阻断实施计划讨论,且仓目录已存在 | 不采用;放入 Step 3 前置检查 |

## 7. 结构化中间产物

### 7.1 实施输入边界表

| 上游文档 | 本轮定位 | 本计划如何使用 | 风险 |
|---|---|---|---|
| `00-需求文档.md` | authority | 定义仓定位、FR-ML、BR-ML、NFR-ML、相邻仓边界和验收方向 | 不得恢复旧 F-001~F-008 / AC-P0 口径 |
| `01-架构设计.md` | authority | 定义 truth owner、Definition vs Use、依赖方向、数据所有权和架构红线 | 不得恢复旧 snapshot / outbox 作为架构前置 |
| `02-概要设计.md` | authority | 定义八组件和代码主体框架 | 不得退回对象清单式阶段拆分 |
| `03-详细设计.md` | authority | 定义 schema、port、protocol、flow、state、transaction、error、config、observability 和 test cut | Step 6 需逐 boundary 复核可落码闭口 |
| `04-配置设计.md` | authority | 定义 profile、config item、adapter binding、degraded/unavailable 和 secret/redaction | Step 8 需转成实施准备和 config gate |
| `05-测试方案.md` | authority | 定义 `TC-ML-*`、suite、artifact/report、`EV-ML-*` | Step 7 需映射到 phase / commit boundary |
| `06-验收标准.md` | authority | 定义 AC、VETO、baseline、risk acceptance 和 final verdict | Step 12 需转成完成判定 |
| 旧 `07-实施计划.md` | old_direction_input | 只用于旧材料差异审计 | 不得作为新版实施结论 |

### 7.2 旧 `07` 污染风险表

| 旧口径 | 当前问题 | 新版处理 |
|---|---|---|
| `P0 方法定义发布同步闭环` | 当前需求 / 设计已改为方法资产定义 truth、正式化与版本、受控消费、追溯一致性等八组件主线 | Step 2 重新定义实施目标 |
| `7 类 MethodContent` | 当前 `03` 明确不恢复旧 `MethodContent` 总对象 | Step 4 重新抽取实施对象 |
| publish / snapshot / outbox / fingerprint | 当前 `03/04/05/06` 不把这些旧机制作为正向主线 | 若仍有等价问题,必须用 current 对象和协议重新命名 |
| PostgreSQL / object storage / concrete bus | 当前配置设计保持 product-neutral binding,不在 Step 1 锁具体产品 | Step 8 再按 `04` 检查实现环境 |
| GATE-T / AC-P0 / EV-001 | 当前测试 / 验收使用 `TC-ML-*`、`EV-ML-*`、AC/VETO-ML 和 report path | Step 7 / 12 使用 current 编号 |
| 旧 phase / commit | 旧边界不能覆盖 current eight-component design | Step 5 / 6 全量重拆 |

### 7.3 闭环复核预判表

| 闭环复核项 | 当前来源 | 当前状态 | 后续处理 |
|---|---|---|---|
| schema / object 字段闭环 | `03` §6 和 Step 6 object contracts | 可进入规划 | Step 6 按 commit boundary 复核 |
| port / adapter 闭环 | `03` §5 / §7 / Step 7 trait port adapter | 可进入规划 | Step 6 标记 required reads 和 blocker rule |
| protocol / DTO / event / job 闭环 | `03` §7 / Step 8 protocol contracts | 可进入规划 | Step 6 / 7 绑定测试门禁 |
| flow / state / transaction 闭环 | `03` §8~§12 | 可进入规划 | Step 6 拆写入顺序,Step 7 绑定 suite |
| config / dependency 闭环 | `04` §3~§12 | 可进入规划 | Step 8 固定实施环境和 redline |
| evidence / report 闭环 | `05` §13;`06` §3 / §10 | 可进入规划 | Step 7 / 12 固定 run-scoped artifact/report 规则 |
| implementation ledger 闭环 | 代码实施台账规范 | 尚未在 L3 `07` 收敛 | Step 3 / 6 / 7 / 11 / 12 必须补齐 |

### 7.4 是否允许进入实施计划讨论

| 判定项 | 结论 | 理由 |
|---|---|---|
| 是否允许进入 Step 2 | 允许 | 当前 `00`~`06` 可作为新版实施计划输入,旧材料风险已隔离 |
| 是否允许直接移交实现 | 不允许 | 新版 `07` 未完成,implementation ledger / boundary ledger 未定义,boundary 复核未完成 |
| 是否允许修改正式 `07` | 暂不允许 | 必须等 Step 13 根据 Step 1~12 中间产物装配 |
| 是否允许创建真实 implementation boundary ledger | 暂不允许 | 需要 Step 6 定义 phase / commit boundary 后再生成正式口径 |

## 8. 回填草稿

> 校准来源:
> - `design-calibration/07_implementation_plan_step_01_input_boundary.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“SOP 问题回答”“旧 `07` 污染风险表”“闭环复核预判表”和“是否允许进入实施计划讨论”小节。

正式 `07-实施计划.md` §1 后续应回填:

本实施计划只承接 `L3-method-library` 当前 full-restart 后的 `00-需求文档.md`、`01-架构设计.md`、`02-概要设计.md`、`03-详细设计.md`、`04-配置设计.md`、`05-测试方案.md` 和 `06-验收标准.md`。旧 `07-实施计划.md` 属于历史方向材料,不得反向定义本轮 phase、commit boundary、测试门禁、验收证据、配置前置或实现仓结构。

本实施计划不重新定义方法资产需求、架构边界、对象 schema、port、protocol、flow、state、config key、test case、evidence schema 或 acceptance verdict。若在拆分 phase / commit boundary 时发现任一 schema、port、state、mapper、config、evidence 或 phase scope 无法 1:1 回指正式设计真相源,必须暂停并回写对应设计文档,不得由实现 agent 自行补口。

正式实现移交前,本实施计划必须定义 implementation ledger、boundary ledger、required reads、allowed scope、forbidden scope、required checks、Commit Gate、Handoff Gate 和 boundary 经验复核结论。

## 9. 待确认事项

| 待确认事项 | 影响 | 当前处理 |
|---|---|---|
| Step 1 R1.2 是否需要把本思考稿转为“已确认写入”状态 | 影响是否进入 Step 2 | 等待用户确认 |
| 目标实现仓 `/home/aris/Projects/quantalithos-method-library` 的具体 workspace / crate / 提交规范 | 影响 Step 3 前置条件 | 后续 Step 3 检查 |
| implementation ledger 路径和 boundary ledger 文件命名 | 影响 Step 6 / 7 / 11 / 12 | 后续按规范收敛 |
| 旧 `07` 正式文件何时删除重写 | 影响 Step 13 装配 | Step 13 才执行,当前只隔离 |

## 10. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| 上游输入基线明确 | 通过 | current `00`~`06` 已映射 |
| 旧 `07` 风险已分类 | 通过 | old_direction_input,不得作为 current truth |
| 未直接修改正式 `07` | 通过 | 正式文件留到 Step 13 |
| implementation ledger 需求已进入后续 Step | 通过 | Step 3 / 6 / 7 / 11 / 12 必须收敛 |
| 可进入 R1.2 / Step 2 | 通过 | 用户已确认,允许进入 Step 2 |

## 11. R1.2 用户确认记录

| 项 | 状态 |
|---|---|
| 用户确认 | 已确认 |
| 确认内容 | Step 1 输入边界、旧 `07` 隔离口径、Step 13 前不修改正式 `07`、implementation ledger / boundary ledger 后续收敛要求 |
| 后续动作 | 进入 Step 2 `R2.1 scope:先思考` |
