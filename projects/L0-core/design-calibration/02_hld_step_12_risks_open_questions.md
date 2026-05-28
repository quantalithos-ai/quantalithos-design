# Step 12. 设计风险与待确认事项

> 本版本承接 Step 4 ~ Step 11 已收稳的概要设计结论,只收纳仍会影响详细设计判断的风险与待确认事项。
> 本步不写项目 TODO、开发任务、排期、测试用例全集或实施方案。

## 1. Step 状态

- 状态: [x] 已确认
- 对应 SOP: `standards/document/概要设计讨论流程_SOP.md` Step 12
- 回填章节: `projects/L0-core/02-概要设计.md` §12 设计风险与待确认事项

---

## 2. 本步输入

| 输入 | 内容 | 本步使用方式 |
|---|---|---|
| Step 4 ~ Step 11 | 代码主体框架、主要组成部分、对象、接口、处理流、状态机、异常和承接清单已收稳 | 识别是否仍存在未闭环设计风险 |
| Step 10 异常与边界场景 | 已确认幂等冲突、非法迁移、兼容性不通过、快照派生失败、读面 stale、事实发布失败和引用失效 | 判断哪些异常仍需要详细设计谨慎展开 |
| Step 11 承接清单 | 已确认详细设计继续展开字段、协议、函数、事务、错误处理和测试矩阵 | 区分“风险 / 待确认”和“详细设计继续展开” |

已确认结论:

```text
本步只保留真正的设计风险和待确认事项。
已经由 Step 4 ~ Step 11 收稳的主语、对象、接口、流程、状态和异常不能在这里重新写成待确认。
```

---

## 3. SOP 问题回答

### 3.1 当前概要设计层已经明确构成风险、但尚未闭环的问题有哪些?

回答:

| 风险 | 影响 | 当前处理口径 |
|---|---|---|
| `CommandMetadata`、`QueryMetadata`、`Receipt`、`View` 等骨架名尚未正式对象化 | 影响详细设计的 DTO / value object 定义 | 详细设计必须正式定义这些骨架名,不能各实现点自行发明 |
| Outbound Event 容易被误解成 `L0-core` 自己实现 bus | 影响 `L0-core` / `L0-bus` 边界 | 本概要设计已明确只表达可感知事实输出,详细设计不得写成 bus 投递实现 |
| 读面 `stale / rebuilding` 容易被实现成普通成功或普通失败 | 影响 Query、projection 和测试矩阵 | 详细设计必须显式定义 stale 视图或 not-ready 语义 |
| 当前不纳入 Inbound Event Consumer 可能被后续外部异步输入需求重新打开 | 影响接口分类和处理流 | 若未来确需异步输入,必须回退 Step 7 / Step 8 重开接口和处理流 |
| 快照派生失败容易被误实现为 `ContractReleaseSnapshot.failed` 状态 | 影响 Step 9 状态机一致性 | 当前不新增 snapshot failed lifecycle,失败由作业失败事实表达 |
| `ContractPackageLifecycle` 当前只用表收口,未单独画状态图 | 影响消费域包的复杂演进 | 若详细设计发现包流程复杂,必须回退 Step 9 补独立状态图 |

### 3.2 当前还有哪些问题尚未形成定论,只能作为待确认事项挂起?

回答:

| 待确认 | 影响范围 | 当前挂起口径 |
|---|---|---|
| `CommandMetadata` / `QueryMetadata` 是否作为正式 L0-core value object 定义 | API / DTO / metadata 骨架 | 交给详细设计决定,但名称和用途不能改 |
| `ContractChangeReceipt`、`ContractBaselineReceipt`、`ContractLifecycleReceipt` 是否共享统一 receipt 基类 | Command API 输出骨架 | 交给详细设计决定,但不能改变 command 输出需要 receipt 的结论 |
| `ContractPackageView` 是否按消费域拆成多个专用 view | Query API / package view | 交给详细设计决定,但不能改变六个 package 对象族已存在的结论 |
| `ContractGuideSampleView` 是静态文档视图还是可派生查询视图 | Query API / guide sample | 交给详细设计决定,但不能把它升级成 SDK 本体 |
| `ExternalReference` / `EventCatalogReference` 是否需要单独测试矩阵 | Reference / trace / test | 交给测试方案与详细设计联动决定 |

### 3.3 这些未闭环项分别会影响哪些主要部分、对象、接口、处理流或状态机?

回答:

| 未闭环项 | 影响范围 |
|---|---|
| Metadata / Receipt / View 正式对象化 | `ContractCommandApi`、`ContractQueryApi`、详细设计 DTO |
| Outbound Event 与 bus 边界 | `PublishContractFactJob`、`ContractFactRecord`、`OutboxPort` |
| stale / rebuilding 语义 | `ContractReadModel`、`ContractTraceProjection`、`CompatibilityTraceIndex` |
| Inbound Event Consumer 是否未来引入 | Step 7 接口骨架、Step 8 处理流、Step 10 异常 |
| snapshot failed 不作为 lifecycle 状态 | `ContractReleaseSnapshot`、`DeriveReleaseSnapshotJob`、异常处理 |
| package view 是否拆分 | 六个 `ContractPackage` 对象族、`GetContractPackage` 查询 |

### 3.4 哪些问题若不先收纳,后续详细设计会被误导?

回答:

- 如果不收纳 metadata / receipt / view 正式对象化风险,详细设计可能在不同接口里各自发明 DTO。
- 如果不收纳 Outbound Event 与 bus 边界风险,详细设计可能把 `L0-core` 写成事件总线实现。
- 如果不收纳 stale / rebuilding 风险,读面查询可能伪装成强一致读。
- 如果不收纳 snapshot failed 状态风险,详细设计可能新增与 Step 9 不一致的状态。
- 如果不收纳 package view 拆分风险,消费域包可能在详细设计阶段重新发明主语。

### 3.5 哪些内容只是任务或优化项,不应被包装成设计风险或待确认事项?

回答:

以下内容不进入本步:

- 编码顺序。
- crate / module 目录拆分细节。
- 具体 HTTP / RPC path。
- 具体错误码编号。
- 具体测试用例全集。
- 具体 CI / 代码生成命令。
- 实施排期和提交计划。

---

## 4. 当前文档问题诊断

| 位置 | 当前问题 | 影响 |
|---|---|---|
| 旧版 Step 12 缺位 | 原 `02` 没有区分风险和待确认 | 详细设计不知道哪些问题已收稳,哪些需要小心展开 |
| 旧版风险表达 | 容易把实现任务写成风险 | 会污染概要设计层 |
| 旧版待确认 | 容易把已经确认的取舍重新挂起 | 会导致后续反复讨论 |

---

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 风险表达 | 无独立清单 | 只列会影响详细设计判断的风险 | 防止风险散落 |
| 待确认表达 | 混入普通 TODO | 只列尚未形成定论但会影响设计的问题 | 防止把任务包装成设计问题 |
| 已确认结论 | 可能被重新挂起 | 明确已确认内容不能写成待确认 | 保持前序 Step 收口有效 |

---

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A: 不写风险与待确认 | 简洁 | 详细设计会踩隐藏坑 | 不采用 |
| 方案 B: 只列设计层风险和待确认 | 边界清晰 | 需要筛选 | 采用 |
| 方案 C: 把 TODO、任务、测试和实施全写进来 | 看起来完整 | 会污染概要设计 | 不采用 |

---

## 7. 结构化中间产物

### 7.1 设计风险清单

| 风险 | 影响 | 当前处理口径 |
|---|---|---|
| Metadata / Receipt / View 骨架未正式对象化 | DTO / value object 定义 | 详细设计正式定义,不许各实现点自造 |
| Outbound Event 与 bus 边界被误解 | `L0-core` / `L0-bus` 边界 | 只表达可感知事实输出 |
| `stale / rebuilding` 被误写成普通成功或失败 | Query / projection / test | 详细设计显式定义 read-side 状态语义 |
| 未来引入 Inbound Event Consumer | 接口 / 处理流 | 必须回退 Step 7 / Step 8 |
| Snapshot 派生失败被误写成 snapshot lifecycle failed | 状态机 | 失败由作业失败事实表达 |
| Package view 拆分不足 | 消费域契约包 | 详细设计可拆 view,但不能改 package 对象族 |

### 7.2 设计待确认事项清单

| 待确认 | 影响范围 | 当前挂起口径 |
|---|---|---|
| `CommandMetadata` / `QueryMetadata` 是否正式 value object | API / DTO | 详细设计决定 |
| `Receipt` 输出是否抽统一基类 | Command API 输出 | 详细设计决定 |
| `ContractPackageView` 是否按消费域拆分 | Query / package | 详细设计决定 |
| `ContractGuideSampleView` 是静态文档视图还是派生查询视图 | Query / guide | 详细设计决定 |
| 引用状态是否需要单独测试矩阵 | Reference / test | 测试方案与详细设计联动 |

---

## 8. 回填草稿

可直接回填到 `02-概要设计.md` 的起草结构:

```md
## 12. 设计风险与待确认事项

> 校准来源:
> - `design-calibration/02_hld_step_12_risks_open_questions.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“设计风险清单”“设计待确认事项清单”小节,了解当前概要设计仍需详细设计谨慎承接的未闭环项。

### 12.1 设计风险清单

| 风险 | 影响 | 当前处理口径 |
|---|---|---|
| Metadata / Receipt / View 骨架未正式对象化 | DTO / value object 定义 | 详细设计正式定义,不许各实现点自造 |
| Outbound Event 与 bus 边界被误解 | `L0-core` / `L0-bus` 边界 | 只表达可感知事实输出 |
| `stale / rebuilding` 被误写成普通成功或失败 | Query / projection / test | 详细设计显式定义 read-side 状态语义 |
| 未来引入 Inbound Event Consumer | 接口 / 处理流 | 必须回退 Step 7 / Step 8 |
| Snapshot 派生失败被误写成 snapshot lifecycle failed | 状态机 | 失败由作业失败事实表达 |
| Package view 拆分不足 | 消费域契约包 | 详细设计可拆 view,但不能改 package 对象族 |

### 12.2 设计待确认事项清单

| 待确认 | 影响范围 | 当前挂起口径 |
|---|---|---|
| `CommandMetadata` / `QueryMetadata` 是否正式 value object | API / DTO | 详细设计决定 |
| `Receipt` 输出是否抽统一基类 | Command API 输出 | 详细设计决定 |
| `ContractPackageView` 是否按消费域拆分 | Query / package | 详细设计决定 |
| `ContractGuideSampleView` 是静态文档视图还是派生查询视图 | Query / guide | 详细设计决定 |
| 引用状态是否需要单独测试矩阵 | Reference / test | 测试方案与详细设计联动 |
```

### 9. 待确认事项

#### 9.1 待确认项处理建议

| 待确认项 | 备选方案 | 推荐方案 | 推荐理由 | 当前状态 |
|---|---|---|---|---|
| 是否把 DTO 正式对象化作为 HLD 风险 | A. 是; B. 否; C. 移到实施计划 | A | 这会直接影响详细设计,属于设计层风险 | 已确认采用 A |
| 是否把 package view 拆分写成待确认 | A. 是; B. 否; C. 直接在 HLD 定死 | A | 详细设计可在不改变 package 对象族的前提下决定视图拆分 | 已确认采用 A |

#### 9.2 本 Step 未确认事项

无。

### 10. 进入下一步条件

- 已明确当前概要设计层的风险和待确认事项。
- 已排除任务、排期、实施和测试用例全集等非设计层事项。
- 可以进入 Step 13 整理正式概要设计文档。
```

---

## 9. 待确认事项

#### 9.1 待确认项处理建议

| 待确认项 | 备选方案 | 推荐方案 | 推荐理由 | 当前状态 |
|---|---|---|---|---|
| 是否把 DTO 正式对象化作为 HLD 风险 | A. 是; B. 否; C. 移到实施计划 | A | 这会直接影响详细设计,属于设计层风险 | 已确认采用 A |
| 是否把 package view 拆分写成待确认 | A. 是; B. 否; C. 直接在 HLD 定死 | A | 详细设计可在不改变 package 对象族的前提下决定视图拆分 | 已确认采用 A |

#### 9.2 本 Step 未确认事项

无。

### 10. 进入下一步条件

- 已明确当前概要设计层的风险和待确认事项。
- 已排除任务、排期、实施和测试用例全集等非设计层事项。
- 可以进入 Step 13 整理正式概要设计文档。
```

