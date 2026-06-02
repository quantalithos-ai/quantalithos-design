# Step 13. 设计风险与待确认事项

> 对应 SOP: `standards/document/概要设计讨论流程_SOP.md` Step 13
> 回填章节: `02-概要设计.md` §13 设计风险与待确认事项
> 生成日期: 2026-06-01
> 状态: 已完成

---

## 1. 本步目标

在 Step 4 ~ Step 12 已收稳的前提下,显式收纳 `L1-conversation` 概要设计层仍未闭环的设计风险和待确认事项,避免后续详细设计把不确定内容伪装成已确认输入,也避免把任务、排期或实现 TODO 混入概要设计。

本步只写设计层风险与待确认事项。本步不写项目 backlog、开发排期、测试用例全集、实现方案、具体产品选型或未经讨论的新对象 / 新接口 / 新流程 / 新状态。

---

## 2. 本步输入

| 输入 | 状态 | 用途 |
|---|---|---|
| `02_hld_step_04_code_subject_framework.md` ~ `02_hld_step_12_detailed_design_handoff.md` | 已完成 | 提供已收稳的概要设计结论 |
| `02_hld_step_12_detailed_design_handoff.md` §3.6 / §10 | 已完成 | 提供应进入风险与待确认事项的未闭环线索 |
| `00-需求文档.md`、`01-架构设计.md` | 已重建 | 提供需求 / 架构边界和跨仓依赖关系 |
| `projects/L0-core/00~07`、`projects/L0-bus/00~07`、`projects/L0-sdk/00~07`、`projects/L1-identity/00~07` | 已完成深度校准 | 提供本仓概要设计依赖的稳定上游 / 相邻仓参考 |

---

## 3. SOP 问题回答

### 3.1 当前概要设计层已经明确构成风险、但尚未闭环的问题有哪些？

当前概要设计层的主要风险不是“主语不稳”,而是后续详细设计和实现落地时可能出现契约对齐、外部接缝能力、配置落地和正式文档重建遗漏的问题。它们不阻塞进入 Step 14,但必须在正式概要设计中暴露,以便详细设计不能绕开这些边界。

### 3.2 当前还有哪些问题尚未形成定论，只能作为待确认事项挂起？

待确认事项集中在详细设计前后需要进一步确认的执行口径:

- 跨仓 resolver / event / handoff 的字段级契约是否与相邻仓实现完全一致。
- projection / search / cursor 的具体技术承载是否在详细设计阶段确定,还是继续保持产品中立。
- `04-配置说明` 是否为本仓独立成文,以及当某些运行形态不需要配置时如何声明。
- consistency validation 是否只输出诊断,还是允许在更后续阶段引入受控修复命令。

这些事项尚未形成最终字段或实现定论,但当前都有保守挂起口径,不会阻塞概要设计收口。

### 3.3 这些未闭环项分别会影响哪些主要部分、对象、接口、处理流、状态机或配置影响轮廓？

影响范围包括:

- 主要部分:`Cross-domain manifestation`、`Local reference / snapshot / projection support`、`Derived consumption support`、`History trace / review`。
- 对象:`ExternalFactRef`、`ExternalFactSnapshot`、`ExternalReferenceProjection`、`ConversationProjectionState`、`SearchIndexProjection`、`ChangeCursorProjection`、`TraceHandoffRecord`、`ArchiveHandoffRecord`。
- 接口:来源 event consumers、outbound events、operations jobs、external resolver ports、handoff ports。
- 状态机:`ReferenceResolutionState`、`ProjectionFreshnessState`、`ConversationChangeCursorState`、`ConversationOutboxPublicationState`、handoff states。
- 配置影响:adapter config、store config、job config、runtime builder 注入和禁止配置化边界。

### 3.4 哪些问题若不先收纳，后续详细设计会被误导？

以下问题若不先收纳,详细设计容易被误导:

- 把相邻仓契约尚未逐字段对齐误认为已完成,导致实现阶段出现 blocker。
- 把 projection / search / cursor 的产品中立口径误解为可以在详细设计中随意选型并反向改变对象。
- 把配置影响误解为可以通过 feature flag 放开 forbidden body、visibility 或 state machine 红线。
- 把 consistency validation 诊断误解为可以自动修复 truth。
- 把旧 `02-概要设计.md` 当作仍然有效的正式主线。

### 3.5 哪些内容只是任务或优化项，不应被包装成设计风险或待确认事项？

以下内容不写入本步风险 / 待确认:

- 代码实现排期、commit 拆分、测试执行顺序。
- 数据库、搜索引擎、队列、HTTP 框架等产品选型偏好。
- 性能优化、缓存优化、日志格式优化等实现层优化项。
- 已由 Step 4 ~ Step 12 收稳并进入详细设计承接清单的稳定输入。
- 与 `L1-conversation` 概要设计无关的上游项目管理风险。

---

## 4. 设计风险表

| 风险 | 影响 | 当前处理口径 |
|---|---|---|
| 跨仓字段级契约在详细设计 / 实现时可能与相邻仓文档或代码不一致 | 影响 `ExternalFactRef`、来源 event consumer、resolver port、outbound event、handoff port 和配置 adapter | 概要设计保持 reference / snapshot / port 抽象;详细设计必须逐字段对齐 `L0-core`、`L0-bus`、`L0-sdk`、`L1-identity` 等稳定仓,发现冲突回退 Step 6 / Step 7 / Step 8 |
| 来源仓能力可能不足以支撑所有 cross-domain manifestation 场景 | 影响 `Cross-domain manifestation`、`ExternalFactSnapshot`、`ReferenceResolutionState` 和 `ManifestExternalFact` | 当前以 `Unresolved`、`Invalid`、`Stale` 和 degraded marker 保守承接,不得补造来源 truth |
| projection / search / cursor 的技术承载若过早选型,可能反向污染概要对象 | 影响 `Derived consumption support`、`Authorized consumption`、`ConversationProjectionState`、`SearchIndexProjection`、`ChangeCursorProjection` | 当前保持产品中立,详细设计只能在 port / adapter / projection store 层展开,不得改变 truth / state machine |
| outbox / handoff 与 bus / observability / archive 的实际交付语义可能出现差异 | 影响 `ConversationOutboxRecord`、`TraceHandoffRecord`、`ArchiveHandoffRecord`、outbound events 和 operations jobs | 当前固定“失败不回滚 truth”;详细设计需对齐交付 receipt / failure marker / retry 语义 |
| 配置落地可能被误用为绕过领域边界的开关 | 影响 forbidden body、visibility、state machine、audit chain 和 consistency 分层 | Step 11 已列禁止配置化边界;详细设计必须在 validator / runtime builder / policy guard 中固化红线 |
| consistency validation 的诊断结果若被自动修复实现滥用,可能覆盖 truth | 影响 `ValidateConversationConsistency`、truth repository、projection store、outbox / handoff 状态 | 当前只允许生成 diagnostic marker 和 evidence;任何修复命令必须回退概要设计重新讨论 |
| 旧 `02-概要设计.md` 仍存在,可能在 Step 14 前被误读为正式主线 | 影响正式文档阅读者和后续详细设计输入 | 工作台已声明 Step 14 删除旧文件并按新文件标准重建;正式文档必须引用新 calibration 来源 |
| 详细设计可能把未闭环事项当作已收稳输入 | 影响对象契约、接口协议、状态矩阵和配置契约 | Step 12 已规定主语变更回退规则;本步将未闭环项单列,不得写入承接清单 |

---

## 5. 待确认事项表

| 待确认 | 影响范围 | 当前挂起口径 |
|---|---|---|
| 来源仓 resolver / event / snapshot 的字段级契约是否已与相邻仓完全一致 | `ExternalFactRef`、`ExternalFactSnapshot`、来源 event consumer、reference refresh job | 当前按 reference / snapshot 抽象推进;详细设计逐字段核对,发现冲突回退 Step 6 / Step 7 |
| projection / search / cursor 的具体技术产品是否在详细设计阶段确定 | `ConversationProjectionState`、`SearchIndexProjection`、`ChangeCursorProjection`、query fallback | 当前保持产品中立;详细设计只定义 port / adapter / store contract,产品选择不得进入概要主语 |
| `04-配置说明` 是否为 `L1-conversation` 独立成文,以及哪些运行形态需要配置 | Step 11 配置影响、ConversationRuntimeConfig、AdapterConfig、JobConfig | 当前按“需要独立配置说明”挂起;如判断某运行形态无需配置,仍需产出配置说明并声明不需要配置 |
| consistency validation 是否永远只诊断,还是未来允许受控修复命令 | `ValidateConversationConsistency`、diagnostic marker、truth / projection 对账 | 当前只诊断不修复;任何自动修复或修复命令都必须回退概要设计新增接口和状态口径 |
| trace / archive handoff payload 的脱敏材料边界是否需要更细粒度分类 | `TraceHandoffRecord`、`ArchiveHandoffRecord`、`TraceRetentionPolicy`、handoff ports | 当前只允许引用和脱敏摘要;详细设计可细分 payload ref 类型,不得允许 forbidden body |
| AI member / human actor / system actor 展示快照是否由 identity resolver 统一供给 | `ParticipantScope`、`FactSourceRef`、`ExternalReferenceProjection`、identity event consumer | 当前只保存 actor / participant 引用和展示 snapshot marker;详细设计需与 `L1-identity` 契约核对 |

---

## 6. 待确认项方案建议

| 待确认项 | 备选方案 | 推荐方案 | 推荐理由 |
|---|---|---|---|
| 来源仓字段级契约对齐 | A. 概要阶段逐字段锁死;B. 详细设计逐字段核对;C. 实现阶段再对齐 | B | 概要层不写 schema 细节,但详细设计必须在落码前对齐,避免实现阶段 blocker |
| projection / search / cursor 技术承载 | A. 概要阶段选产品;B. 详细设计定义 port / adapter,产品留到配置 / 实施;C. 实现自由选择 | B | 能保持概要产品中立,同时让详细设计有可测试的契约 |
| `04-配置说明` 是否独立成文 | A. 不写配置说明;B. 独立成文,若无配置也说明无配置;C. 并入详细设计 | B | 符合已收稳的配置文档规则,也避免后续 agent 误判配置缺失 |
| consistency validation 是否修复 | A. 只诊断;B. 自动修复 projection;C. 自动修复 truth | A | 当前概要没有定义修复命令或补偿状态,只诊断最符合 truth 不被派生反写原则 |
| handoff payload 脱敏边界 | A. 概要层细分全部 payload 类型;B. 概要层固定 forbidden body 红线,详细设计细分 ref 类型;C. 交给实现处理 | B | 红线必须概要层固定,细分类型属于详细设计对象契约 |
| actor 展示快照来源 | A. Conversation 自建 actor truth;B. 依赖 identity resolver / event 快照;C. 下游自行解析 | B | Conversation 不拥有 identity truth,但本仓需要可控展示 snapshot 和 stale marker |

---

## 7. 当前设计层未闭环项说明

当前未闭环项不阻塞 Step 14 正式概要设计整理,原因如下:

- 它们不要求新增概要设计主语、关键对象、接口类别、处理流或状态机。
- 它们都有当前保守挂起口径,不会让详细设计自由选边。
- 它们主要影响详细设计的字段级契约、port / adapter contract、配置说明和测试矩阵。
- 若详细设计发现这些事项需要改概要主线,必须按 Step 12 回退规则回到对应 Step 修正。

---

## 8. 当前文档问题诊断与修正结果

| 诊断项 | 修正前风险 | 本步修正 |
|---|---|---|
| 未闭环项可能被遗漏 | 详细设计可能以为所有字段级契约都已确认 | 单列风险和待确认事项 |
| 待确认事项可能写成空话 | 后续仍不知道临时口径 | 每项给出当前挂起口径 |
| 用户需要方案建议 | 待确认项没有推荐方案会导致后续再次分歧 | 单列方案建议、推荐方案和理由 |
| 已收稳内容可能被重复挂起 | 稳定输入被削弱 | 明确已进入承接清单的内容不再写成待确认 |
| 风险与任务可能混写 | Step 13 变成 backlog | 排除开发排期、任务拆分和实现优化项 |

---

## 9. 输出约束检查

| 检查项 | 结果 | 说明 |
|---|---|---|
| 是否使用设计风险表 | 通过 | §4 使用规范要求的三列表 |
| 是否使用待确认事项表 | 通过 | §5 使用规范要求的三列表 |
| 是否拆开风险与待确认事项 | 通过 | 风险、待确认和方案建议分节表达 |
| 是否给待确认项当前挂起口径 | 通过 | 每项均说明定论前如何处理 |
| 是否避免任务 / TODO / 排期 | 通过 | 未写开发任务、排期或实施指令 |
| 是否避免把已收稳输入重新挂起 | 通过 | 已进入 Step 12 承接清单的稳定结论未重新写成待确认 |
| 是否禁止画图 | 通过 | 本步未输出任何图 |

---

## 10. 回填草稿

正式 `02-概要设计.md` §13 可以按以下结构回填:

```text
## 13. 设计风险与待确认事项

### 13.1 设计风险表
摘录 `design-calibration/02_hld_step_13_risks_open_questions.md` §4。

### 13.2 待确认事项表
摘录 `design-calibration/02_hld_step_13_risks_open_questions.md` §5。

### 13.3 待确认项方案建议
摘录 `design-calibration/02_hld_step_13_risks_open_questions.md` §6。

### 13.4 当前设计层未闭环项说明
摘录 `design-calibration/02_hld_step_13_risks_open_questions.md` §7。
```

回填时必须在 §13 开头列出本章引用来源:

- `design-calibration/02_hld_step_04_code_subject_framework.md`
- `design-calibration/02_hld_step_05_components_boundary.md`
- `design-calibration/02_hld_step_06_key_objects.md`
- `design-calibration/02_hld_step_07_api_interface_skeleton.md`
- `design-calibration/02_hld_step_08_processing_flows.md`
- `design-calibration/02_hld_step_09_state_machine.md`
- `design-calibration/02_hld_step_10_exceptions_boundaries.md`
- `design-calibration/02_hld_step_11_configuration_impact.md`
- `design-calibration/02_hld_step_12_detailed_design_handoff.md`
- `design-calibration/02_hld_step_13_risks_open_questions.md`

---

## 11. 待确认事项

当前 Step 13 无阻塞 Step 14 的待确认事项。

Step 14 需要执行:

- 删除旧 `02-概要设计.md`。
- 按新文件标准创建正式概要设计文档。
- 从 Step 1 ~ Step 13 中间产物摘录内容,并在各章节列出引用来源。
- 不新增未经讨论的新结论。

---

## 12. 进入下一步条件

Step 13 已满足进入 Step 14 的条件:

- 已明确概要设计层哪些问题构成风险。
- 已明确哪些问题仍待确认,并给出当前挂起口径。
- 已为待确认项列出可选方案、推荐方案和推荐理由。
- 未把任务层事项、上游风险或已收稳输入混写进本步。
