## Step 13. 设计风险与待确认事项

### 1. Step 状态

- 状态：[x] 已确认
- 对应 SOP：`standards/document/概要设计讨论流程_SOP.md` Step 13
- 回填章节：`projects/L0-sdk/02-概要设计.md` §13 设计风险与待确认事项

### 2. 本步输入

- Step 4 ~ Step 12 已确认的代码主体框架、主要组成部分、关键对象、接口、处理流、状态机、异常边界、配置影响和详细设计承接清单
- Step 7 / Step 8 中关于 runtime client command、stream / query、上游变化 Consumer 和 public registry 的待确认记录
- Step 9 / Step 10 中关于 `VerificationEvidence` redaction marker、`RequiresMigration`、public registry、runtime boundary failure 的待确认记录
- Step 11 / Step 12 中关于 `RuntimeConfig` 拆分、JSON 顶层结构和 P0 验证目标的待确认记录

已确认结论：

```text
Step 13 不写任务清单。
它只收纳概要设计层仍需提醒详细设计注意的风险和待确认问题。
```

### 3. SOP 问题回答

1. 当前概要设计层已经明确构成风险、但尚未闭环的问题有哪些？

   回答：主要风险集中在七类：三语言语义漂移、上游派生视图 stale / unknown 被误用于 candidate、runtime client 边界滑向 server gateway、event client 边界滑向 bus runtime、verification evidence 的 result 与 redaction marker 混淆、配置开关绕过安全与状态红线、public registry / release 概念污染 P0 candidate 状态机。这些风险不阻塞 Step 14，但必须在正式概要设计中提示 03 按保守口径展开。

2. 当前还有哪些问题尚未形成定论，只能作为待确认事项挂起？

   回答：仍需挂起的问题包括：`VerificationEvidence` 是否拆成 `EvidenceResult` 与 `EvidenceRedactionStatus` 两个 enum、`RequiresMigration` 进入 `Stable` 的完整门禁条件、`CompatibilityPolicy` 是否从 `CompatibilityDecision` 中拆成独立 policy、`RuntimeConfig` 是否按 language / adapter / job / policy 拆分、JSON 顶层结构如何组织、P0 最小验证目标采用真实服务 endpoint 还是 fake / fixture target。

3. 这些未闭环项分别会影响哪些主要部分、对象、接口、处理流、状态机或配置影响轮廓？

   回答：evidence 拆分影响 `VerificationEvidence`、candidate gate、测试证据和状态机；migration gate 影响 `PackageCandidateStatus`、`CompatibilityDecision`、`MigrationGuideRef` 和 stable 判断；`CompatibilityPolicy` 拆分影响文档兼容与演进部分的对象边界；`RuntimeConfig` 拆分和 JSON 顶层结构影响配置设计、builder 注入和 04-配置说明；真实服务或 fake / fixture 验证目标影响 `InvokeServiceCapability`、`RunCrossLanguageSmoke`、`VerifyBoundaryPolicies`、测试方案和验收标准。

4. 哪些问题若不先收纳，后续详细设计会被误导？

   回答：最容易误导详细设计的是：把 `Stable` 当成公共 registry 发布、把 `Redacted` 当成 `Passed`、把 fake success 当成生产成功、把 runtime service call 写成 SDK 本地 truth、把 bus publish / subscribe 写成 bus runtime、把配置写成可关闭 redaction / credential protection 的开关、把 query / projection rebuild 写成状态推进入口。

5. 哪些内容只是任务或优化项，不应被包装成设计风险或待确认事项？

   回答：crate / package / module 命名、完整 DTO 字段、HTTP path、event schema 字段、错误码编号、retry backoff、runner 命令、artifact / report 目录、JSON 配置示例、测试用例全集、commit boundary、开发排期和公共发包操作属于详细设计、配置说明、测试方案、验收标准或实施计划，不应在本步包装成概要设计风险。

### 4. 当前文档问题诊断

| 位置 | 当前问题 | 影响 |
|---|---|---|
| Step 7 ~ Step 12 | 每一步都有局部待确认项或推荐口径 | 如果不集中收纳，正式概要设计容易遗漏或误写成已确认 |
| Step 9 / Step 10 | `VerificationEvidence` 的 result 与 redaction marker 仍需 03 决定类型拆分 | 详细设计可能把 redaction 当成验证通过 |
| Step 11 | 配置影响已收稳，但实现配置结构未定 | 详细设计和配置说明需要知道哪些是可变结构，哪些是禁止开关 |
| Step 12 | 已明确待确认项不进入承接清单 | 需要 Step 13 作为正式挂起位置 |

### 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 风险位置 | 分散在各 Step 的待确认事项和边界说明 | 集中形成设计风险表 | 便于正式概要设计收口 |
| 待确认项 | 每步各自说明 | 统一列影响范围和当前挂起口径 | 防止 03 误读为稳定输入 |
| 任务与风险 | 容易混写 | 排除开发任务、配置示例、测试全集和实施指令 | 对齐 SOP 边界 |
| 推荐方案 | 容易变成硬结论 | 明确“当前挂起口径”和“若变更需回退位置” | 保持后续设计可追溯 |

### 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A：把前序所有待确认项都写成风险 | 不会遗漏 | 风险泛化，真正影响概要成立性的事项不突出 | 不采用 |
| 方案 B：把前序推荐方案全部转为稳定结论 | 正式文档更短 | 可能把未正式确认的方案写死 | 不采用 |
| 方案 C：设计风险和待确认事项分表，待确认项给当前挂起口径 | 边界清楚，可进入 Step 14 | 正式文档仍需保留少量未闭环项 | 采用 |

### 7. 结构化中间产物

#### 7.1 设计风险表

| 风险 | 影响 | 当前处理口径 |
|---|---|---|
| 三语言语义漂移 | 影响 `SdkSemanticBaseline`、`CrossLanguageConceptMap`、`LanguageBindingView` 和 public SDK surface | 以共同语义基线、概念映射和 cross-language smoke 约束，语言 idiomatic 不能改变平台含义 |
| stale / unknown 上游派生视图被误用于 candidate | 影响 `DerivedBindingView`、`SnapshotFreshnessState`、`PackageCandidate` 和 candidate gate | 只有 `Fresh` 视图可用于 candidate，stale / unsupported / unknown 必须阻断 verified / stable |
| runtime client 边界滑向 server gateway | 影响 `InvokeServiceCapability`、`ServiceClientView`、formal API / fake adapter 和服务端 truth 边界 | SDK 只封装 formal API / fake boundary，不拥有服务端业务事实，不执行 auth / governance |
| event client 边界滑向 bus runtime | 影响 `PublishBusEvent`、`OpenEventSubscription`、`BusEventClientView` 和 `EventSemanticMapping` | SDK 只提供 bus semantic client view，不实现 publication / delivery / retry / replay truth |
| evidence result 与 redaction marker 混淆 | 影响 `VerificationEvidence`、`PackageCandidateStatus`、报告证据和验收口径 | `Redacted` 只表达证据安全引用条件，不等于 `Passed`；failed / skipped / unredacted 不支撑 stable |
| fake / fixture success 被误写成生产成功 | 影响 `CapabilitySupportState`、`BoundaryGuard`、`RunCrossLanguageSmoke` 和 candidate gate | fake / fixture 只能证明最小接入，必须显式标记，不能宣称生产可用 |
| 配置开关绕过安全与状态红线 | 影响 redaction、credential protection、trace、error mapping、freshness、compatibility 和 candidate gate | 配置只能选择已批准策略或收紧策略，不能关闭最低保护或直接改写状态 |
| public registry / release 概念污染 P0 状态机 | 影响 `PackageCandidateStatus=Stable`、实施计划和验收口径 | `Stable` 只是 SDK 本地稳定基线，不等于公共 registry 发布；release / rollback 后移 |
| 详细设计暗改概要主语 | 影响对象、接口、处理流、状态机、配置契约和测试矩阵 | 03 发现主语变化时必须回退对应概要 Step，不得在详细设计中暗改 |

#### 7.2 待确认事项表

| 待确认 | 影响范围 | 当前挂起口径 |
|---|---|---|
| `VerificationEvidence` 是否拆成 `EvidenceResult` 与 `EvidenceRedactionStatus` 两个 enum | `VerificationEvidence`、`PackageCandidateStatus`、Step 9 状态机、测试证据 | 03 可以根据 Rust 类型清晰度拆分；概要设计只坚持 redaction 不替代 passed / failed |
| `RequiresMigration` 进入 `Stable` 的完整门禁条件 | `PackageCandidate`、`CompatibilityDecision`、`MigrationGuideRef`、兼容治理 | 当前只允许“有 migration ref 且门禁满足”进入 stable；完整门禁由 03 定义 |
| `CompatibilityPolicy` 是否独立成节 | `CompatibilityDecision`、文档兼容与演进、compatibility job | 当前不在概要 Step 6 独立展开；03 可在规则复杂时拆为 policy 类型，但不能改变 compatibility 状态语义 |
| `RuntimeConfig` 是否按 language / adapter / job / policy 拆分 | Step 11 配置影响、runtime builder、adapter / job constructor | 当前只确认配置影响轮廓；03 结合代码组织选择拆分方式 |
| JSON 顶层是否按模块拆分、是否保留 common 段 | 04-配置说明、配置示例、配置校验 | 当前不作为 02 硬结论；04 按模块给 demo 并说明配置项作用 |
| P0 最小验证目标使用真实服务 endpoint 还是 fake / fixture target | `InvokeServiceCapability`、`RunCrossLanguageSmoke`、`VerifyBoundaryPolicies`、测试方案和验收标准 | 当前允许 stable formal API 或 fake / fixture 证明最小接入，但 fake 不能宣称生产可用 |
| `OpenEventSubscription` 是否需要独立 stream API 类别 | Query API、event client view、bus subscription boundary | 当前按只读 Query 处理；03 可展开 stream / callback 契约，但不能实现 bus runtime |
| 上游变化 Consumer 是否拆成三条独立处理流 | core / bus / formal API changed consumer、freshness 状态 | 当前概要层合并为一条上游变化消费流；03 应按 event schema 和来源差异拆具体 consumer |

#### 7.3 不应列为风险或待确认的事项

| 事项 | 不进入本步的原因 | 后续位置 |
|---|---|---|
| Rust crate / module / file tree、Python / TypeScript package layout | 属于详细设计和实施计划 | `03-详细设计.md` / `07-实施计划.md` |
| 完整 command / query / event / job DTO 字段 | 属于协议详细设计 | `03-详细设计.md` |
| HTTP path、stream callback、event topic、CloudEvent 字段 | 属于接口详细设计 | `03-详细设计.md` |
| 错误码编号、adapter exception mapping、retry backoff | 属于错误与恢复详细设计 | `03-详细设计.md` |
| JSON 配置示例、默认值、环境变量、secret 引用 | 属于配置说明 | `04-配置说明.md` |
| runner 命令、artifact / report 目录和 CI 参数 | 属于测试方案、配置说明或实施计划 | `04-配置说明.md` / `05-测试方案.md` / `07-实施计划.md` |
| 测试用例全集和验收脚本 | 属于测试方案和验收标准 | `05-测试方案.md` / `06-验收标准.md` |
| commit boundary、开发排期、发包操作 | 属于实施计划 | `07-实施计划.md` |

#### 7.4 进入 Step 14 的收口口径

| 类型 | Step 14 处理方式 |
|---|---|
| 设计风险 | 写入正式 §13 设计风险表，保持当前处理口径 |
| 待确认事项 | 写入正式 §13 待确认事项表，保持当前挂起口径 |
| 不进入本步的任务项 | 不写入正式 §13，交给后续 03~07 文档 |
| 若用户在 Step 14 前确认某项 | 从待确认事项移入对应稳定章节或详细设计承接清单 |

### 8. 回填草稿

本步回填 `02-概要设计.md` §13 时建议使用以下结构：

```text
## 13. 设计风险与待确认事项
### 13.1 设计风险表
### 13.2 待确认事项表
### 13.3 不应列为风险或待确认的事项
```

回填时可引用本文件 `7.1` ~ `7.3` 的结构化中间产物，不需要重复保留 SOP 问题回答、问题诊断和设计取舍。

### 9. 待确认事项

| 待确认项 | 方案 | 建议 | 原因 |
|---|---|---|---|
| Step 13 是否保留待确认项 | A：全部转稳定结论；B：保留待确认表并给当前挂起口径 | 建议 B | 用户尚未逐项确认，不能伪装成稳定输入 |
| 是否把实施任务写入风险表 | A：写；B：不写，交给实施计划 | 建议 B | 本步只收纳设计层未闭环项 |
| 是否画风险矩阵图 | A：画；B：不画 | 建议 B | 本章以表格收口更清楚，且不需要表达流程关系 |

以上待确认项不阻塞进入 Step 14。除非后续讨论明确改变，否则 Step 14 按“建议方案”整理正式文档。

### 10. 进入下一步条件

- [x] 已明确概要设计层哪些问题构成设计风险。
- [x] 已明确哪些问题仍待确认，并给出当前挂起口径。
- [x] 已说明这些问题会影响哪些对象、接口、处理流、状态机、配置影响或下游边界。
- [x] 已排除项目任务、TODO、开发排期、测试用例全集和实施指令。
- [x] 已足以进入 Step 14 “整理正式概要设计文档”。
