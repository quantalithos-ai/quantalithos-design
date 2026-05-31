# Step 11. 备选方案与取舍

### 1. Step 状态

- 状态：[x] 已确认
- 对应 SOP：`standards/document/架构设计讨论流程_SOP.md` Step 11
- 回填章节：`projects/L0-sdk/01-架构设计.md` §12 备选方案与取舍

### 2. 本步输入

- 上游文档：
  - `standards/document/架构设计书写规范.md` §4.12 备选方案与取舍
  - `standards/document/架构设计讨论流程_SOP.md` Step 11
  - `projects/L0-sdk/00-需求文档.md`
  - `projects/L0-sdk/design-calibration/01_arch_step_02_arch_goals_constraints.md`
  - `projects/L0-sdk/design-calibration/01_arch_step_07_dependency_direction.md`
  - `projects/L0-sdk/design-calibration/01_arch_step_08_data_ownership_consistency.md`
  - `projects/L0-sdk/design-calibration/01_arch_step_09_interactions_communication.md`
  - `projects/L0-sdk/design-calibration/01_arch_step_10_technology_choices.md`
- 已确认结论：
  - 当前主线是“上游契约派生视图 + 官方语义封装 + 三语言 idiomatic 表达 + formal API / fake adapter + `L0-bus` event client view + 本地 package candidate 验证”。
  - `L0-sdk` 不做 server gateway、不做 auth provider、不做 UI 组件库、不做 runtime loop、不重新定义 core / bus truth。
  - 公共注册表正式发布、完整 MCP、REST / GraphQL gateway、REPL / playground、本地缓存和全量 L1/L2/L3/L4 client 覆盖不进入当前 P0。
  - 本 Step 比较路径级结构取舍，不比较具体协议、生成器、语言包管理、目录、脚本、框架或测试命令。

### 3. SOP 问题回答

1. 这个仓有哪些主要可选架构方案？

   回答：可比较的相邻路径包括：当前主线的官方语义封装路径、raw binding-only 路径、全手写 client 路径、三语言各自独立 SDK 路径、公共发布 / registry 先行路径、全量能力覆盖先行路径。server gateway、SDK 自定义 bus runtime、auth provider、UI / runtime 承载已经被前序边界排除，不作为正式备选路径重新打开。

2. 为什么当前选择这一种？

   回答：当前主线最能同时守住上游 truth、官方 client 体验、三语言一致、运行期服务边界、事件语义边界、本地可验证闭环和后续公共发布演进空间。它比 raw binding-only 更能提供官方体验，比全手写 client 更能保护上游 truth，比三语言独立路径更能避免语义漂移，比 registry / 全量覆盖先行更适合当前 P0 收口。

3. 被放弃方案的主要优点是什么？

   回答：raw binding-only 实现成本低且契约漂移少；全手写 client 体验可高度定制；三语言独立 SDK 更贴近各语言生态；registry 先行能让分发路径更早出现；全量覆盖先行能给外部开发者更完整的能力面。这些优点都存在，但会牺牲当前最重要的边界稳定和最小可验证闭环。

4. 为什么即便有这些优点，当前仍不采用？

   回答：因为 `L0-sdk` 当前要先证明“官方三语言客户端接入层”成立，而不是先追求最轻实现、最大定制、最快发布或最大全量覆盖。任何会削弱上游 truth、制造语言语义漂移、扩大 P0 范围、或让发布渠道掩盖可验证性的路径，都不适合作为当前主线。

5. 当前选择牺牲了什么，换来了什么？

   回答：当前选择牺牲了一部分 raw binding 的简洁性、全手写 client 的定制自由、语言独立演进速度、公共发布的早期可见度和全量能力覆盖速度，换来的是官方语义边界、三语言一致、上游 truth 保护、最小可验证路径、横切默认一致和兼容演进可追溯。

### 4. 当前文档问题诊断

| 位置 | 当前问题 | 影响 |
|---|---|---|
| §3 架构风格与选型 | 旧文档只比较 binding-only、thin wrapper、hand-written clients | 有价值但太窄，缺少三语言独立、registry 先行、全量覆盖等路径级取舍 |
| §5 限界上下文 | 旧文档按 Codegen / Rust SDK / Python SDK / TS SDK 切分 | 容易滑向三语言各自独立路径，而不是统一语义基线 |
| §6 / §8 | 旧文档把 CI、registry、generated binding 和 examples 写成主线 | 发布渠道和工具链容易反向压过 SDK official client 语义 |
| §9 关键技术选型 | 旧文档提前比较具体工具与包管理 | 备选方案会变成工具横评，而不是架构路径取舍 |
| 全文 | server gateway、完整 MCP、REST / GraphQL、REPL 等外围方向容易反复回流 | 会重新打开已由需求和架构边界排除的事项 |

### 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 比较对象 | binding、wrapper、hand-written、语言工具 | 路径级 SDK 架构方案 | 对齐规范 4.12 |
| 当前主线 | generated binding + thin wrapper | 上游派生视图 + 官方语义封装 + 三语言表达 + adapter + candidate 验证 | 更准确表达 SDK 不是 binding-only |
| 不采用原因 | 主要围绕开发成本和漂移风险 | 围绕边界、依赖、数据、一致性、验证和演进代价 | 架构取舍需要说明结构得失 |
| 边界外方向 | 容易作为候选反复进入 | 单独说明不作为正式备选方案 | 防止推翻前序 Step |
| 发布路径 | 公共 registry 像当前主线 | 本地 candidate 先行，公共发布后移 | 当前 P0 先证明可验证闭环 |

### 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A：只保留 raw binding / thin wrapper / hand-written 三分法 | 简洁，贴近旧文档 | 不能覆盖当前 P0 的验证、三语言一致、服务边界和发布阶段取舍 | 不采用 |
| 方案 B：比较相邻路径级方案，并排除边界外方向 | 能解释当前主线得失，又不重新打开已关闭边界 | 表比旧版更重，需要后续概要继续落结构 | 采用 |
| 方案 C：把 server gateway、SDK bus runtime、auth provider 也放进主表 | 看起来覆盖全面 | 这些已经被前文排除，会破坏校准链条 | 不采用 |
| 方案 D：不写备选方案，只写当前主线 | 最简洁 | 缺少取舍判断，读者难以理解为什么旧路径不采用 | 不采用 |

### 7. 结构化中间产物

#### 7.1 方案路径比较表

| 方案路径 | 解决的问题 | 主要收益 | 主要代价 / 约束 | 当前结论 | 说明 |
|---|---|---|---|---|---|
| 官方语义封装主线：上游派生视图 + 官方语义封装 + 三语言表达 + formal API / fake adapter + event client view + candidate 验证 | 同时解决上游 truth 消费、官方 client 体验、三语言一致、最小可验证接入和兼容演进问题 | 边界清晰，SDK 不重定义 core / bus truth；三语言语义一致；P0 可通过本地 candidate 验证 | 初期结构较重，需要维护语义基线、adapter、验证证据和兼容治理 | 采用 | 这是当前主线，最符合 SDK 作为官方客户端接入层的定位。 |
| Raw binding-only 路径 | 解决多语言类型生成和基础契约消费问题 | 实现成本低，直接消费上游契约，漂移风险较小 | 使用体验弱，error / trace / redaction / event client / docs 示例难以统一；无法形成官方 client 体验 | 不采用 | 该路径适合作为底层派生视图，但不能作为 SDK 主线。 |
| 全手写 client 路径 | 解决开发者体验高度定制问题 | API 体验可以完全按语言和场景设计，短期产品手感好 | 容易重定义 core / bus / service 语义，维护成本高，三语言 drift 风险大 | 不采用 | 手写封装可以存在于官方语义层，但不能脱离上游派生视图成为主线。 |
| 三语言各自独立 SDK 路径 | 解决各语言生态适配和独立演进速度问题 | 每种语言都能最大化 idiomatic，局部迭代快 | 平台概念、错误、trace、redaction、deprecated 语义容易分裂 | 不采用 | 语言表达可以 idiomatic，但必须依赖统一 SDK 语义基线。 |
| 公共发布 / registry 先行路径 | 解决外部分发和可见性问题 | 更早形成 crates.io / PyPI / npm 等公开消费路径，便于外部试用 | 发布渠道可能掩盖 candidate 是否可安装、可运行、可追溯；也会扩大 P0 验收范围 | 不采用为当前 P0 | 公共发布有后续价值，但当前先以本地 package candidate 和验证证据证明闭环。 |
| 全量能力覆盖先行路径 | 解决开发者希望一次性获得完整 L1/L2/L3/L4 client 的问题 | 能力面完整，外部使用心智直接 | P0 范围过大，formal API 稳定度不足时会拖累 SDK 基础闭环 | 不采用为当前 P0 | 当前先完成最小可验证接入，按服务边界稳定度逐步扩展 client 覆盖。 |

#### 7.2 边界外方向说明表

| 方向 | 不作为正式备选方案的原因 | 正确处理口径 |
|---|---|---|
| SDK server gateway / facade | 已违反客户端接入层边界，会让 SDK 拥有服务端业务编排 | 由正式服务边界、gateway 或对应服务仓承载。 |
| SDK 自定义 bus runtime | 会重定义 delivery、retry、dead-letter、replay、tap truth | SDK 只提供 `L0-bus` 语义下的事件客户端视图。 |
| SDK auth provider / governance executor | 会侵入身份认证、权限裁决和治理审批边界 | 由安全入口、identity、gateway 或 governance 承载。 |
| UI component library / runtime loop | 会混入产品层或运行时执行层职责 | 由 L5/L6 产品仓或 L2 runtime 承载。 |
| 完整 MCP、REST / GraphQL gateway、REPL、本地缓存 | 已被裁剪为外围增强或后续阶段 | 后续重新进入需求边界裁剪，不作为当前主线备选。 |

#### 7.3 轻量取舍对照表

| 当前方案得到什么 | 当前方案失去什么 | 取舍说明 |
|---|---|---|
| 官方 client 语义边界 | 不如 raw binding-only 轻量 | SDK 的价值不只是类型搬运。 |
| 上游 truth 与客户端体验同时成立 | 不如全手写 client 自由 | 自由定制不能以双真相为代价。 |
| 三语言共同心智 | 不如三语言独立演进快 | 平台语义一致优先于单语言局部速度。 |
| 本地可验证闭环 | 不如公共发布先行更早曝光 | 未验证 candidate 不应被发布渠道粉饰。 |
| P0 范围可控 | 不如全量覆盖先行完整 | 基础接入层先成立，再逐步扩展服务覆盖。 |

#### 7.4 方案边界说明短文

本章只比较仍处在 `L0-sdk` 客户端接入层边界内的相邻路径，不重新打开 server gateway、bus runtime、auth provider、UI / runtime 承载等已排除方向。raw binding、全手写、三语言独立、registry 先行和全量覆盖先行都能解决真实问题，但它们分别牺牲了官方语义、三语言一致、上游 truth 或当前 P0 可验证性。当前主线选择不是“最轻”或“最大”，而是先让官方三语言 SDK 的边界、最小可验证路径和兼容演进成立。

### 8. 回填草稿

正式 `01-架构设计.md` 后续生成时：

- §12 “备选方案与取舍”直接摘录并整理本文件 §7.1、§7.2、§7.3、§7.4。
- 不在本 Step 重复粘贴完整正式章节，避免与结构化中间产物重复。

### 9. 待确认事项

#### 9.1 待确认项处理建议

| 待确认项 | 备选方案 | 推荐方案 | 推荐理由 | 当前状态 |
|---|---|---|---|---|
| 当前主线是否表述为“上游派生视图 + 官方语义封装 + 三语言表达 + adapter + event client view + candidate 验证” | A. 采用该表述;B. 回到 generated binding + thin wrapper;C. 改为公共发布主线 | A | A 能完整承接 Step 7~10 的依赖、数据、交互和技术机制结论 | 已确认采用 A |
| raw binding-only、全手写、三语言独立是否进入主表 | A. 进入主表;B. 只放边界说明;C. 完全不提 | A | 这些是旧文档和实现直觉中最容易回退的相邻路径，需要写清不采用原因 | 已确认采用 A |
| 公共发布先行和全量覆盖先行是否进入主表 | A. 进入主表但标记不作为当前 P0;B. 完全删除;C. 作为当前主线 | A | 它们有后续价值，但不能阻塞当前最小可验证闭环 | 已确认采用 A |
| server gateway、SDK bus runtime、auth provider 是否进入主表 | A. 进入主表;B. 不进入主表，只作为边界外方向说明;C. 完全不提 | B | 这些方向已被前序边界排除，不能重新包装成正式备选方案 | 已确认采用 B |

#### 9.2 本 Step 未确认事项

- 无阻塞 Step 12 的待确认事项。
- 具体协议、生成器、package manager、public registry 阶段、完整 MCP、REST / GraphQL、REPL、本地缓存和全量 client 覆盖节奏后移到后续文档。

### 10. 进入下一步条件

- 已明确当前架构主线方案。
- 已明确主要相邻替代路径、收益、代价和不采用原因。
- 已确认边界外方向不作为正式备选方案重新打开。
- 可以进入 Step 12 横切关注点。
