# Step 12. 设计风险与待确认事项

## 1. Step 状态

- 状态：[x] 已确认
- 对应 SOP：`standards/document/概要设计讨论流程_SOP.md` Step 12
- 回填章节：`projects/L3-method-library/02-概要设计.md` §12 设计风险与待确认事项

---

## 2. 本步输入

| 输入 | 内容 |
|---|---|
| Step 4 代码主体框架 | 已收稳业务主要组成部分 + 实现分层两条轴 |
| Step 5 主要组成部分 | 已收稳 7 个业务主要组成部分及边界 |
| Step 6 关键对象 | 已收稳 P0 关键对象、projection、P1 位置对象 |
| Step 7 API / 接口骨架 | 已收稳 Command / Query / Event / Job 接口骨架 |
| Step 8 关键处理流 | 已收稳 P0 Command、关键 Query、Operations Job 处理流 |
| Step 9 状态机 | 已收稳 MethodContentLifecycle、OutboxEventStatus、P1 状态边界 |
| Step 10 异常与边界 | 已收稳发布阻断、传播失败、下游恢复、边界拒绝、P1 后置口径 |
| Step 11 承接清单 | 已明确 03 详细设计继续展开方向和回退规则 |

已确认结论：

```text
Step 12 只收纳概要设计层还需要显式提醒的风险和待确认事项。
已经收稳并进入 Step 11 承接清单的内容,不再写成待确认。
```

依赖的前序 Step：

```text
Step 1~11 已确认上游边界、范围、约束、代码主体、主要组成部分、对象、接口、处理流、状态机、异常边界和详细设计承接清单。
```

---

## 3. SOP 问题回答

### 3.1 当前概要设计层已经明确构成风险、但尚未闭环的问题有哪些？

回答：

| 风险 | 为什么属于概要设计风险 |
|---|---|
| Definition / Use 边界污染 | 会破坏 method-library 的定义真相边界,直接影响主要组成部分、接口、对象和测试 |
| P1 Plugin / Configuration 反向污染 P0 | 会让 P0 MethodContent 发布闭环被后置能力拖慢或改写 |
| event / snapshot / fingerprint 不一致 | 会导致下游同步到错误定义或无法判断 drift |
| published 缺 audit / fingerprint / outbox | 会让发布事实不可审计、不可同步、不可追溯 |
| ViewProfile 解析误配或高频读性能不足 | 会影响 UI / console 前置读取路径和默认 deny 行为 |
| MethodContent 元模型过宽或 kind-specific 字段边界不清 | 会让 7 类 P0 definition 互相污染,详细设计难以写出清晰 struct / enum |
| ProcessTemplateDef / TaskDefinition 到 process runtime 映射不匹配 | 会导致 process 消费定义后仍无法稳定生成流程执行索引 |
| AIPolicyDef 与 governance policy source 语义分叉 | 会导致 governance 同步到的 policy source 与实际 enforce 语义不一致 |

### 3.2 当前还有哪些问题尚未形成定论，只能作为待确认事项挂起？

回答：

| 待确认 | 当前状态 |
|---|---|
| `TaskDefinition` 是否直接供 `L1-work` 作为 WorkItem 模板来源 | 当前保持 P1 / 待 `L1-work` 校准 |
| ViewProfile 默认 deny / 空视图的产品语义 | 当前概要只固定“服务端解析 + 未匹配受控返回”,具体 UX 需 UI / console 校准 |
| ViewProfile 匹配优先级是否在 P0 固化 | 当前 P0 简化为 role + object_kind + scope,复杂 preset / override 后置 |
| snapshot schema 是否由 L0-core 统一定义 | 当前建议统一,但需要 L0-core / 下游契约确认 |
| P1 MethodPlugin / MethodConfiguration 何时进入正式详细设计 | 当前只保留位置和边界,不进入 P0 首批闭环 |
| Plugin dependency DAG / Variability 的算法边界 | 当前只确认 P1 后置,算法不在本轮展开 |
| Operations Job 的执行门禁和运维权限边界 | 当前只确认 job 类型和不绕过规则,具体权限 / 批量参数留详细设计或运维设计 |

### 3.3 这些未闭环项分别会影响哪些主要部分、对象、接口、处理流或状态机？

回答：

| 未闭环项 | 影响范围 |
|---|---|
| work 是否直接消费 TaskDefinition | TaskDefinition、ExportDefinitionSnapshot、task_definition.published event、process / work 下游边界 |
| ViewProfile 默认 deny / 匹配优先级 | ViewProfile、ViewProfileProjection、ResolveViewProfile、ViewProfileMatchPolicy、Query 处理流 |
| snapshot schema 统一归属 | DefinitionSnapshot、ExportDefinitionSnapshot、Outbound Event payload、下游 consumer contract |
| P1 Plugin / Configuration 启动时机 | MethodPlugin、MethodConfiguration、PublishMethodPlugin、ActivateMethodConfiguration、P1 状态机 |
| Plugin dependency DAG / Variability | PluginCompositionPolicy、MethodConfiguration、effective_content_set、P1 配置激活流程 |
| Operations Job 门禁 | MethodOperationsService、Seed / Replay / Rebuild / Recalculate Job、AuditRecord、OutboxEvent |

### 3.4 哪些问题若不先收纳，后续详细设计会被误导？

回答：

| 问题 | 误导方式 |
|---|---|
| 不收纳 Definition / Use 边界风险 | 详细设计可能为 QualificationProfile、QualificationBinding、WorkItem、Artifact instance 开写接口 |
| 不收纳 P1 污染风险 | 详细设计可能把 Plugin / Configuration 写成 P0 必须实现 |
| 不收纳 work 是否直接消费 TaskDefinition | 详细设计可能提前把 WorkItem 模板契约固化到 method-library |
| 不收纳 ViewProfile 待确认 | 详细设计可能把默认 deny、空视图和复杂优先级写成未经 UI 校准的定论 |
| 不收纳 snapshot schema 归属 | 详细设计可能在本仓私自定义下游共享 schema,导致后续 L0-core 冲突 |
| 不收纳 Operations Job 门禁 | 详细设计可能把 seed / replay / rebuild 设计成绕过审计和边界规则的后门 |

### 3.5 哪些内容只是任务或优化项，不应被包装成设计风险或待确认事项？

回答：

| 不应写入 Step 12 的内容 | 原因 |
|---|---|
| 具体开发排期、任务拆分和负责人 | 属于实施计划或 WorkItem |
| 单个接口的完整错误码表 | 属于详细设计 |
| retry 次数、批大小、游标格式 | 属于详细设计或运维设计 |
| 缓存 TTL、具体 Redis / local cache 参数 | 属于详细设计 / 运维参数 |
| 完整测试用例全集 | 属于测试方案 |
| 目录结构、文件名、crate 名 | 属于详细设计实现结构 |

---

## 4. 当前文档问题诊断

| 位置 | 当前问题 | 影响 |
|---|---|---|
| 当前 02 多处风险段落 | 旧文在全局位置、约束、架构取舍中散落风险 | 正式新版需要按 §12 统一收口 |
| 旧 §5.5 关键依赖风险 | 风险有效,但混入架构依赖和可用性描述 | 需要转成概要设计层风险表 |
| 旧 §9 / §10 取舍段落 | 已说明 P1、outbox、snapshot 等取舍,但没有形成待确认表 | 03 不易判断哪些能展开、哪些仍挂起 |
| Step 11 | 已明确未闭环项不进入承接清单 | Step 12 必须承接这些未闭环项,否则上下文丢失 |
| 全文 | 容易把详细设计待展开项误写成风险 | 需要区分“稳定承接项”和“未闭环项” |

---

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 风险表达 | 散落在现有 02 多个章节 | 单独形成设计风险表 | 让概要设计收口时可审查 |
| 待确认事项 | 与 P1、work、ViewProfile 等说明混在一起 | 单独形成待确认事项表 | 防止未确认项被误写成正式结论 |
| 风险与待确认 | 有混写倾向 | 风险写当前处理口径,待确认写挂起口径 | 符合书写规范 |
| 详细设计项 | 可能被包装成风险 | 稳定承接项留在 Step 11,不在 Step 12 重复 | 避免把 03 工作误判为概要未闭环 |
| P1 表达 | 多处写“后置” | 明确 P1 是风险 / 待确认的受控边界,不是 P0 门槛 | 保持 P0 / P1 分离 |

---

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 把架构设计 §13 风险整段搬入概要设计 | 覆盖完整 | 会把上游架构风险、运维风险和概要设计风险混在一起 | 不采用 |
| 只写待确认事项,不写风险 | 简洁 | 已识别的边界污染、同步一致性和 P1 污染风险没有处理口径 | 不采用 |
| 分成设计风险表和待确认事项表 | 边界清楚,符合规范 | 需要严格筛掉任务和详细设计项 | 采用 |

---

## 7. 结构化中间产物

### 7.1 设计风险表

| 风险 | 影响 | 当前处理口径 |
|---|---|---|
| Definition / Use 边界污染 | 影响 MethodContent、接口边界、下游 consumer、边界测试 | 保留 DefinitionUseBoundaryGuard、接口红线、BoundaryViolation、contract test;下游 Use truth 不进入本仓 |
| P1 Plugin / Configuration 反向污染 P0 | 影响主要组成部分、对象、接口、处理流和状态机范围 | P1 只保留位置和边界;PublishMethodPlugin / ActivateMethodConfiguration 不阻塞 P0 |
| event / snapshot / fingerprint 不一致 | 影响下游同步、drift 判断、审计追溯 | event 只通知变化,snapshot 承载完整定义,fingerprint 由 canonical 内容生成,下游保存 source_version / fingerprint |
| published 缺 audit / fingerprint / outbox | 影响发布一致性、审计和可靠传播 | PublishMethodContent 必须同一 unit_of_work 写 state、version、fingerprint、AuditRecord、OutboxEvent |
| ViewProfile 解析误配或高频读性能不足 | 影响 UI / console 查询路径、默认 deny 和用户可见性 | P0 只支持 role + object_kind + scope,服务端解析,projection / cache 可重建,未匹配受控返回 |
| MethodContent 元模型过宽或 kind-specific 字段边界不清 | 影响 7 类 definition 的 struct / enum 设计和校验规则 | 固定 7 类 P0 kind,共同字段在 MethodContent,专属字段在 subtype,详细设计继续展开字段边界 |
| ProcessTemplateDef / TaskDefinition 到 process runtime 映射不匹配 | 影响 process 下游同步和流程模板执行索引 | P0 明确 process 是 TaskDefinition / ProcessTemplateDef 消费方;method-library 只供 definition event / snapshot |
| AIPolicyDef 与 governance policy source 语义分叉 | 影响 governance 消费 policy source 和审计链 | method-library 只拥有 AIPolicyDef definition,governance 拥有 enforce result;通过 source_ref / version / fingerprint 对齐 |

### 7.2 待确认事项表

| 待确认 | 影响范围 | 当前挂起口径 |
|---|---|---|
| `TaskDefinition` 是否直接供 `L1-work` 作为 WorkItem 模板来源 | TaskDefinition、work 边界、ExportDefinitionSnapshot、task_definition.published event | P0 只确认 process 消费;work 直接消费保持 P1 / 待 `L1-work` 校准 |
| ViewProfile 默认 deny / 空视图的产品语义 | ResolveViewProfile、ViewProfileMatchPolicy、UI / console 体验 | P0 只写“未匹配受控返回 / 默认 deny”,精确文案和 UI 行为待 UI / console 校准 |
| ViewProfile 复杂优先级、preset / override 是否进入 P0 | ViewProfileProjection、ResolveViewProfile 查询流、缓存策略 | P0 只支持 role + object_kind + scope;复杂规则后置 |
| snapshot schema 是否由 L0-core 统一定义 | DefinitionSnapshot、event payload、consumer contract、schema version | 当前建议统一;详细设计前需要与 L0-core / 下游消费方确认 |
| P1 MethodPlugin / MethodConfiguration 何时进入正式详细设计 | P1 对象、P1 API、P1 状态机、marketplace metadata | P0 不阻塞;待 P0 发布同步闭环稳定后启动 P1 详细设计 |
| Plugin dependency DAG / Variability 算法边界 | PluginCompositionPolicy、MethodConfiguration、effective_content_set | 当前只保留 P1 位置;算法规则待 P1 设计 |
| Operations Job 的执行门禁和运维权限边界 | Seed / Replay / Rebuild / Recalculate、AuditRecord、OutboxEvent | 当前只确认 job 不绕过规则;具体权限、批量参数和审批门禁留详细设计 / 运维设计 |

### 7.3 不进入本章的内容

| 内容 | 处理方式 |
|---|---|
| 已收稳的对象、接口、处理流和状态机 | 已进入 Step 11 承接清单 |
| ErrorCode、HTTP status、retry 参数 | 进入 03 详细设计 |
| 测试用例全集 | 进入测试方案或详细设计测试章节 |
| 开发任务、排期、负责人 | 进入实施计划或 WorkItem |
| 上游标准完整争议 | 留在架构设计或 ADR,本章只写影响本仓概要设计的部分 |

---

## 8. 回填草稿

以下内容可回填到新版 `02-概要设计.md` §12。

```md
## 12. 设计风险与待确认事项

### 12.1 设计风险

| 风险 | 影响 | 当前处理口径 |
|---|---|---|
| Definition / Use 边界污染 | 影响 MethodContent、接口边界、下游 consumer、边界测试 | 保留 DefinitionUseBoundaryGuard、接口红线、BoundaryViolation、contract test;下游 Use truth 不进入本仓 |
| P1 Plugin / Configuration 反向污染 P0 | 影响主要组成部分、对象、接口、处理流和状态机范围 | P1 只保留位置和边界;PublishMethodPlugin / ActivateMethodConfiguration 不阻塞 P0 |
| event / snapshot / fingerprint 不一致 | 影响下游同步、drift 判断、审计追溯 | event 只通知变化,snapshot 承载完整定义,fingerprint 由 canonical 内容生成,下游保存 source_version / fingerprint |
| published 缺 audit / fingerprint / outbox | 影响发布一致性、审计和可靠传播 | PublishMethodContent 必须同一 unit_of_work 写 state、version、fingerprint、AuditRecord、OutboxEvent |
| ViewProfile 解析误配或高频读性能不足 | 影响 UI / console 查询路径、默认 deny 和用户可见性 | P0 只支持 role + object_kind + scope,服务端解析,projection / cache 可重建,未匹配受控返回 |
| MethodContent 元模型过宽或 kind-specific 字段边界不清 | 影响 7 类 definition 的 struct / enum 设计和校验规则 | 固定 7 类 P0 kind,共同字段在 MethodContent,专属字段在 subtype,详细设计继续展开字段边界 |
| ProcessTemplateDef / TaskDefinition 到 process runtime 映射不匹配 | 影响 process 下游同步和流程模板执行索引 | P0 明确 process 是 TaskDefinition / ProcessTemplateDef 消费方;method-library 只供 definition event / snapshot |
| AIPolicyDef 与 governance policy source 语义分叉 | 影响 governance 消费 policy source 和审计链 | method-library 只拥有 AIPolicyDef definition,governance 拥有 enforce result;通过 source_ref / version / fingerprint 对齐 |

### 12.2 待确认事项

| 待确认 | 影响范围 | 当前挂起口径 |
|---|---|---|
| `TaskDefinition` 是否直接供 `L1-work` 作为 WorkItem 模板来源 | TaskDefinition、work 边界、ExportDefinitionSnapshot、task_definition.published event | P0 只确认 process 消费;work 直接消费保持 P1 / 待 `L1-work` 校准 |
| ViewProfile 默认 deny / 空视图的产品语义 | ResolveViewProfile、ViewProfileMatchPolicy、UI / console 体验 | P0 只写“未匹配受控返回 / 默认 deny”,精确文案和 UI 行为待 UI / console 校准 |
| ViewProfile 复杂优先级、preset / override 是否进入 P0 | ViewProfileProjection、ResolveViewProfile 查询流、缓存策略 | P0 只支持 role + object_kind + scope;复杂规则后置 |
| snapshot schema 是否由 L0-core 统一定义 | DefinitionSnapshot、event payload、consumer contract、schema version | 当前建议统一;详细设计前需要与 L0-core / 下游消费方确认 |
| P1 MethodPlugin / MethodConfiguration 何时进入正式详细设计 | P1 对象、P1 API、P1 状态机、marketplace metadata | P0 不阻塞;待 P0 发布同步闭环稳定后启动 P1 详细设计 |
| Plugin dependency DAG / Variability 算法边界 | PluginCompositionPolicy、MethodConfiguration、effective_content_set | 当前只保留 P1 位置;算法规则待 P1 设计 |
| Operations Job 的执行门禁和运维权限边界 | Seed / Replay / Rebuild / Recalculate、AuditRecord、OutboxEvent | 当前只确认 job 不绕过规则;具体权限、批量参数和审批门禁留详细设计 / 运维设计 |
```

---

## 9. 待确认事项

| 问题 | 当前建议 | 是否阻塞 Step 12 |
|---|---|---|
| 是否同意设计风险与待确认事项分表表达 | 建议同意,符合书写规范 | 阻塞 |
| 是否同意 `TaskDefinition -> work` 仍保持 P1 / 待确认 | 建议同意,避免提前绑定 L1-work | 阻塞 |
| 是否同意 ViewProfile 复杂语义只保留待确认,不在本轮定死 | 建议同意 | 阻塞 |
| 是否同意 P1 Plugin / Configuration 风险只写边界,不写任务计划 | 建议同意 | 阻塞 |

---

## 10. 进入下一步条件

进入 Step 13 前需要确认：

- [x] 是否同意本步的设计风险表
- [x] 是否同意本步的待确认事项表
- [x] 是否同意本步不写任务、排期、错误码、retry 参数和测试用例全集
- [x] 是否同意 Step 13 开始整理正式 `02-概要设计.md`
