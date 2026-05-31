# Step 13. 演进路线

### 1. Step 状态

- 状态：[x] 已确认
- 对应 SOP：`standards/document/架构设计讨论流程_SOP.md` Step 13
- 回填章节：`projects/L0-sdk/01-架构设计.md` §14 演进路线

### 2. 本步输入

- 上游文档：
  - `standards/document/架构设计书写规范.md` §4.14 演进路线
  - `standards/document/架构设计讨论流程_SOP.md` Step 13
  - `projects/L0-sdk/00-需求文档.md` §4 目标与非目标 / §7 核心能力闭环 / §15 风险与待确认事项
  - `projects/L0-sdk/design-calibration/01_arch_step_10_technology_choices.md`
  - `projects/L0-sdk/design-calibration/01_arch_step_11_alternatives_tradeoffs.md`
  - `projects/L0-sdk/design-calibration/01_arch_step_12_cross_cutting.md`
- 已确认结论：
  - 当前主线是先让官方三语言 SDK 基础闭环成立，而不是一次性完成公共发布、完整 MCP、REST / GraphQL、REPL、本地缓存或全量 L1/L2/L3/L4 client 覆盖。
  - 当前 P0 以本地 package candidate、最小可验证接入、三语言语义一致、event client view、横切默认和兼容治理为结构边界。
  - 公共注册表、完整 MCP、REST / GraphQL、REPL、本地缓存、全量服务覆盖和更强外部生态能力均需要后续重新裁剪，不得自然膨胀进当前主线。
  - 本 Step 写架构主线阶段演进，不写排期、版本号、任务拆单、待办清单、实施命令或项目管理计划。

### 3. SOP 问题回答

1. 当前阶段做到哪里才算足够？

   回答：当前阶段做到本地 package candidate 可形成、三语言官方 client 语义一致、能通过 formal API 或 fake / fixture 完成最小可验证接入、能提供 `L0-bus` 语义事件客户端视图、error / trace / redaction / credential protection 默认一致、candidate 有可追溯验证证据，就足够支撑架构主线成立。

2. 第一批必须守住哪些结构？

   回答：第一批必须守住上游派生视图与官方语义封装分层、三语言语义基线、formal API / fake adapter、`L0-bus` event client view、本地 candidate 证明链、禁止正文和凭据进入 SDK truth、显式失败 / stale / pending / unsupported / not verified 口径。

3. 哪些能力或约束留到后续阶段演进？

   回答：公共注册表正式发布、更多 L1/L2/L3/L4 client 覆盖、完整 MCP Client、REST / GraphQL gateway、REPL / playground、本地缓存 / 离线状态、第三方企业级生态承诺和更强发布运营规则均后移；这些能力有价值，但必须由稳定需求和边界压力触发，而不是自动进入当前主线。

4. 哪些设计债务当前可接受，哪些不可接受？

   回答：当前可接受的债务包括只覆盖最小服务边界或 fake target、公共发布后移、性能阈值后移、报告格式后移、全量 client 覆盖后移。不可接受的债务包括三语言语义漂移、SDK 重定义 core / bus truth、保存正文或凭据、candidate 无验证证据、用公共发布掩盖不可验证、SDK 成为 gateway / auth / runtime。

5. 未来哪些触发条件会迫使架构调整？

   回答：当本地 candidate 已稳定且下游需要公共分发时，进入公共发布阶段；当多个 formal API 稳定且下游依赖私有封装增多时，进入更多服务覆盖阶段；当 runtime、生态或第三方明确需要 MCP、REST / GraphQL、REPL 或缓存能力时，重新做需求边界裁剪；当三语言一致性、redaction、trace、兼容治理或验证证据开始压垮当前结构时，进入更强治理和自动化阶段。

### 4. 当前文档问题诊断

| 位置 | 当前问题 | 影响 |
|---|---|---|
| §12.1 当前状态与已知债务 | 旧文档把 TS transport、internal-python split、AG-UI 类型作为主要债务 | 过早聚焦局部技术和产品接入，未表达 SDK 主线阶段边界 |
| §12.2 触发条件 | 旧文档写第三方接入失败率、migration guide 缺失等指标 | 有价值但偏验收或运营，缺少“什么结构压力触发下一阶段”的架构判断 |
| §12.3 演进步骤 | 旧文档写 generate raw binding、thin wrapper、examples、MCP / AG-UI | 容易回到旧版工具链中心路径，且把外围增强自然写成第 4 阶段 |
| §12.4 目标架构 | 旧文档强调常见接入路径顺手且允许下潜 binding | 方向可迁移，但缺少 candidate、event client、横切默认和兼容治理主线 |
| 全文 | 公共发布、完整 MCP、REST / GraphQL、REPL、本地缓存容易被写成必然演进 | 会把前文裁剪出的外围增强重新包装为未来必做主线 |

### 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 阶段主语 | generate、wrapper、examples、MCP / AG-UI | 官方 SDK 基础闭环、发布分发、服务覆盖、生态增强、治理自动化 | 演进路线应表达架构结构阶段 |
| 当前完成标准 | raw binding + thin wrapper | 本地 candidate + 三语言一致 + 最小接入 + event view + 横切默认 + evidence | 对齐当前需求和 Step 10~12 |
| 可接受债务 | 技术方案未定 | 公共发布、全量覆盖、性能阈值、报告格式后移 | 债务必须说明为什么不打穿当前边界 |
| 不可接受债务 | 未清楚列出 | drift、双真相、正文泄露、无证据、gateway/auth/runtime 越界 | 明确第一批红线 |
| 触发条件 | 运营指标和任务式触发 | 边界压力、下游依赖、服务稳定度、生态需求、治理压力 | 避免写成项目排期 |

### 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A：沿用旧版 generate -> wrapper -> docs -> MCP / AG-UI 路线 | 接近旧草案，实现直觉强 | 以工具链和外围增强为主，不能表达当前架构主线成立条件 | 不采用 |
| 方案 B：按结构阶段表达，从基础闭环到发布、覆盖、生态、治理演进 | 能说明当前做到哪里算成立，哪些后移以及何时触发 | 需要后续实施计划再拆任务 | 采用 |
| 方案 C：把公共发布、完整 MCP、REST / GraphQL、REPL、全量覆盖都写成必做路线 | 生态叙事完整 | 会重新打开已裁剪范围，扩大当前主线 | 不采用 |
| 方案 D：只写当前阶段，不写后续触发 | 简短 | 无法指导后续何时重新裁剪和演进 | 不采用 |

### 7. 结构化中间产物

#### 7.1 演进路线表

| 阶段 | 当前目标 / 范围 | 当前可接受债务 | 后续演进项 | 触发条件 | 说明 |
|---|---|---|---|---|---|
| 当前基础闭环阶段 | 形成本地 package candidate；三语言官方语义一致；通过 formal API 或 fake / fixture 完成最小可验证接入；提供 `L0-bus` event client view；横切默认和兼容治理可追溯 | 公共注册表后移；只覆盖最小服务边界；报告格式和性能阈值后移；完整 MCP / REST / GraphQL / REPL / 本地缓存后移 | 进入公共发布、更多服务覆盖和生态增强前，先补齐对应设计裁剪 | candidate 已可重复验证，且下游消费需要稳定分发或更多能力面 | 当前目标不是“全量 SDK 生态”，而是证明官方三语言客户端接入层成立。 |
| 公共发布与分发阶段 | 在不改变 SDK truth 的前提下，把已验证 candidate 推向正式 package 分发渠道 | 仍可不覆盖全量 L1/L2/L3/L4；仍不承诺完整 MCP / REPL / 本地缓存 | 发布治理、包签名 / provenance、公共 release evidence、迁移公告和回滚口径 | 本地 candidate 多轮通过，且下游不再满足本地 path / workspace 消费 | 公共发布是已验证 candidate 的分发演进，不是当前 truth 来源。 |
| 服务能力覆盖扩展阶段 | 按 formal API 稳定度逐步扩展 L1/L2/L3/L4 client 覆盖 | 不要求一次覆盖全部服务；不稳定服务仍可保持 unsupported / pending | 服务 client 覆盖矩阵、能力分组、更多 fake / fixture target、跨服务一致性验证 | 多个服务边界稳定，且下游开始重复私有封装或绕开 SDK | 覆盖扩展必须服务于官方接入层，不得让 SDK 吸收服务端业务 truth。 |
| 生态增强重新裁剪阶段 | 评估完整 MCP Client、REST / GraphQL gateway、REPL / playground、本地缓存 / 离线状态等是否进入主线 | 当前仍可不提供这些能力；缺失不影响基础闭环成立 | 若进入主线，必须重新生成需求、架构、概要和详细设计裁剪 | runtime、第三方或产品侧出现稳定需求，且现有 SDK 边界无法承接 | 这些能力不是自然演进项，必须由明确需求和边界压力触发。 |
| 治理与自动化强化阶段 | 强化三语言一致性、redaction、trace、compatibility、deprecated、evidence 和 reports 的自动化治理 | 当前可先用较轻量验证证据；但不得无证据标记 verified / stable | 更强 drift 检测、兼容矩阵、报告规范、自动化迁移提示和安全回归门禁 | 手工审查无法承受 candidate 数量、语言差异或下游规模 | 自动化强化是横切治理压力触发的演进，不替代当前边界判断。 |

#### 7.2 触发条件小表

| 触发条件 | 进入的演进方向 | 判断口径 |
|---|---|---|
| 本地 candidate 已稳定通过多轮验证，且下游需要非本地依赖消费 | 公共发布与分发阶段 | 先证明 candidate 可验证，再扩展发布渠道。 |
| 多个 formal API 已稳定，且下游出现重复私有 client 封装 | 服务能力覆盖扩展阶段 | 以服务边界稳定度和重复封装成本作为触发，不按愿望全量覆盖。 |
| runtime / 第三方 / 产品侧对 MCP、REST / GraphQL、REPL 或缓存形成稳定需求 | 生态增强重新裁剪阶段 | 必须重新走需求边界裁剪，不能直接塞入当前主线。 |
| 三语言 drift、redaction 漏洞、trace 断裂或 compat 判断开始频繁出现 | 治理与自动化强化阶段 | 横切风险超过人工审查能力时，提升自动化治理。 |
| reports / artifacts 证据难以支撑验收和实现交接 | 治理与自动化强化阶段 | 证据链不足以复核 stable / verified 结论时，强化报告规范。 |

#### 7.3 当前不可接受债务表

| 不可接受债务 | 原因 | 当前处理口径 |
|---|---|---|
| 三语言核心语义漂移 | 会破坏官方 SDK 共同心智 | 阻断 candidate stable / verified 结论。 |
| SDK 重定义 `L0-core` / `L0-bus` truth | 会形成双真相源 | 必须回到上游派生视图和 event client view。 |
| 业务正文、事件正文、观测正文或凭据正文进入 SDK truth | 会打穿数据所有权和安全边界 | 必须拒绝、脱敏或只保留引用。 |
| 无验证证据却标记 candidate verified / stable | 会让发布或使用结论不可复核 | 必须保持 not verified / failed / pending。 |
| SDK 演变为 server gateway、auth provider、UI 组件库或 runtime loop | 会越过职责边界 | 作为边界外方向处理，不进入主线。 |

#### 7.4 阶段边界说明短文

`L0-sdk` 当前不是“全量生态完成”才算成立，而是先证明官方三语言客户端接入层的最小闭环成立。公共发布、更多服务覆盖和生态增强都有价值，但它们必须在 candidate、三语言一致、最小接入、event client view、横切默认和 evidence 已经稳定之后再进入。演进由边界压力、下游消费方式、服务稳定度和治理压力触发，而不是由愿望池或旧文档中已有名词自动触发。

### 8. 回填草稿

正式 `01-架构设计.md` 后续生成时：

- §14 “演进路线”直接摘录并整理本文件 §7.1、§7.2、§7.3、§7.4。
- 不在本 Step 重复粘贴完整正式章节，避免与结构化中间产物重复。

### 9. 待确认事项

#### 9.1 待确认项处理建议

| 待确认项 | 备选方案 | 推荐方案 | 推荐理由 | 当前状态 |
|---|---|---|---|---|
| 当前阶段是否以“官方三语言 SDK 基础闭环”作为成立标准 | A. 是;B. 以公共发布作为成立标准;C. 以全量服务覆盖作为成立标准 | A | A 最符合当前 P0 和前序边界，B / C 会扩大范围 | 已确认采用 A |
| 公共注册表是否作为后续分发阶段，而非当前 P0 | A. 后续阶段;B. 当前 P0;C. 完全删除 | A | 公共发布有价值，但不能替代本地 candidate 验证 | 已确认采用 A |
| 完整 MCP、REST / GraphQL、REPL、本地缓存是否写为必然演进项 | A. 是;B. 否，只在稳定需求触发后重新裁剪 | B | 它们是外围增强，不能自然膨胀为主线 | 已确认采用 B |
| 是否列出不可接受债务 | A. 列出;B. 不列，全部放风险章节 | A | 第一批红线需要在演进路线中说明，风险章节再收纳未关闭风险 | 已确认采用 A |

#### 9.2 本 Step 未确认事项

- 无阻塞 Step 14 的待确认事项。
- 具体公共发布渠道、服务覆盖顺序、MCP / REST / GraphQL / REPL / 缓存是否进入主线、自动化治理工具和报告格式后移到后续需求裁剪、配置设计、测试方案、验收标准或实施计划。

### 10. 进入下一步条件

- 已明确当前阶段主线成立的最低结构边界。
- 已明确当前可接受债务、不可接受债务、后续演进项和触发条件。
- 已确认未把项目排期、待办清单、愿望池或已排除事项写成架构演进路线。
- 可以进入 Step 14 风险与待确认事项。
