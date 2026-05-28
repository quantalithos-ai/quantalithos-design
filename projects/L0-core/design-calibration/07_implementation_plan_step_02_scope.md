## Step 2. 明确实施目标、范围和非范围

### 1. Step 状态

- 状态：[x] 已确认
- 对应 SOP：`standards/document/实施计划讨论流程_SOP.md` Step 2
- 回填章节：`07-实施计划.md` §2 实施目标与范围

### 2. 本步输入

- 上游文档：
  - `projects/L0-core/00-需求文档.md` §9 功能需求
  - `projects/L0-core/02-概要设计.md` §2 本次设计目标与范围
  - `projects/L0-core/03-详细设计.md` §2 本次详细设计目标与范围、§4 实现单元与文件布局
  - `projects/L0-core/04-配置设计.md` §2 本次配置设计目标与范围
  - `projects/L0-core/05-测试方案.md` §2 本次测试目标与范围
  - `projects/L0-core/06-验收标准.md` §2 验收目标与范围、§5 功能验收门禁
- 已确认结论：
  - L0-core P0 是跨仓共享契约来源仓的最小可运行、可测试、可验收闭环。
  - P0 主线必须覆盖契约范围收束、契约语义表达、契约演进兼容追溯、下游消费派生基础。
  - F-005~F-007 是外围增强能力,但在 06 中已被收束为 P0-min 最小切口,本轮只实现最小切口。
  - 多语言 binding 完整体验、样例仓、可视化、真实 L0-bus runtime、真实 L0-sdk developer experience、真实下游业务联调不进入本轮 P0。
- 依赖的前序 Step：
  - `07_implementation_plan_step_01_input_boundary.md`

### 3. SOP 问题回答

1. 本轮实施的最小可交付结果是什么。

   回答：最小可交付结果是 L0-core P0 契约来源仓闭环：可以建立 Rust workspace 和本地运行入口,维护契约定义 truth,执行 draft -> review -> publish / release 主线,生成 release snapshot,支持只读 query / trace / package / sample view,写入 audit / outbox / idempotency,执行 P0 operations jobs,并通过 05/06 定义的 P0 测试与验收门禁。

2. 哪些需求编号必须覆盖。

   回答：必须覆盖 F-001、F-002、F-003、F-004 的 P0 核心能力。F-005、F-006、F-007 只覆盖 06 验收标准中定义的 P0-min 最小切口,不扩展为完整外围增强体验。

3. 哪些详细设计章节必须落地。

   回答：必须落地 `03-详细设计.md` §4 实现单元与文件布局、§5 模块实现契约、§6 对象契约、§7 trait / port / adapter 契约、§8 协议契约、§9 函数级处理流、§10 状态矩阵、§11 持久化事务一致性、§12 错误恢复、§13 并发幂等、§14 配置依赖、§15 观测审计、§16 测试切口中 P0 相关内容。实施计划不得重新定义这些契约,只能安排其落地顺序。

4. 哪些验收项必须在本轮可判定。

   回答：必须可判定 AC-FUNC-001~AC-FUNC-008、数据边界与架构红线 AC-RED-*、接口事件与跨仓同步 AC-SYNC-*、状态事务一致性 AC-CONS-*、非功能和证据门禁中的 P0 项、一票否决项、S/A 缺陷规则和最终通过 / 有条件通过 / 不通过结论。

5. 哪些能力明确不在本轮实施。

   回答：不实施在线 HTTP / gRPC server、认证授权、真实 L0-bus publish / subscribe / ack / retry / dead-letter runtime、L0-sdk 高层客户端、L1 业务语义、真实 L4 观测存储和归档恢复、配置中心 / hot reload / admin override、真实 KMS / Vault、多语言 binding 完整生成发布体验、样例仓和可视化产品体验。

6. 是否存在 P1 / P2 能力容易被误做进 P0。

   回答：存在。最容易误做进 P0 的包括完整多语言 binding、外部包发布中心、真实 bus 投递、SDK developer experience、真实下游联调、config center、hot reload、admin override、package write protocol、完整性能容量压测和生产级 secret provider。本轮必须只保留边界、fake / stub、contract suite 或风险接受,不能把这些能力写成 P0 必填入口、配置、schema、command 或验收阻断项。

### 4. 当前文档问题诊断

| 位置 | 当前问题 | 影响 |
|---|---|---|
| `07-实施计划.md` | 尚未创建实施目标与范围章节 | 后续阶段拆分缺少统一范围边界 |
| Step 1 中间产物 | 已确认输入基线,但未转成实施范围 | 还不能判断哪些能力本轮必须做、哪些不做 |
| `00-需求文档.md` F-005~F-007 | 标为外围增强能力 | 若不处理,可能被误判为全部不做或全部做 |
| `06-验收标准.md` AC-FUNC-005~007 | 已定义 P0-min 最小切口 | 需要在实施范围中明确“只做最小切口” |
| P1 / P2 能力 | 散落在上游文档的非范围、后置项和风险中 | 需要集中列为非范围,防止实施阶段自然膨胀 |

### 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 实施目标 | 只有上游设计目标,没有实施目标 | 明确 P0 最小可交付闭环 | 实施计划必须指导代码落地 |
| F-005~F-007 | 容易被理解为全量外围增强 | 仅纳入 P0-min 最小切口 | 对齐 06 验收标准,避免 P1/P2 膨胀 |
| 非范围 | 分散在 00~06 | 集中列入实施非范围 | 防止实现者临时扩展范围 |
| 验收覆盖 | 未绑定实施范围 | 明确 AC-FUNC / AC-RED / AC-SYNC / AC-CONS / P0 EV | 让阶段门禁有边界 |

### 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 只实现 F-001~F-004 | P0 主线更小 | 会缺少 P0-min 的 job、trace、sample / package view,无法满足 06 验收 | 不采用 |
| 实现 F-001~F-007 全量能力 | 功能完整 | 会把外围增强、binding、示例体验和可视化拖入 P0,范围过大 | 不采用 |
| 实现 F-001~F-004 + F-005~F-007 P0-min | 覆盖核心闭环和验收最小切口,同时控制范围 | 需要后续明确 P1/P2 不进入 P0 | 采用 |
| 把真实 L0-bus / L0-sdk / L1 联调作为 P0 必须完成 | 真实集成价值高 | 违反 L0-core 边界,会阻塞底座仓实施 | 不采用 |
| 只验 boundary suite,真实联调进入风险接受 | 保持仓边界清晰,可独立推进 | 后续仍需相邻仓单独验收 | 采用 |

### 7. 结构化中间产物

#### 7.1 实施目标表

| 目标 | 说明 | 成功判定 |
|---|---|---|
| 建立 L0-core P0 Rust workspace | 按 `03-详细设计.md` §4 建立 asset root、contracts、domain、application、infra、cli、jobs | `cargo check` / 基础测试可运行,crate 边界符合详细设计 |
| 打通契约定义 truth 主线 | 支持合法跨仓契约进入范围,拒绝边界外对象和禁止正文 | AC-FUNC-001 / AC-RED-* 可判定 |
| 打通契约语义表达主线 | Command / Query / Event / Job DTO、错误和 metadata 可稳定表达 | AC-FUNC-002 / AC-SYNC-* 可判定 |
| 打通契约演进兼容追溯主线 | draft -> review -> publish / release、compatibility、audit、trace 成立 | AC-FUNC-003 / AC-CONS-* 可判定 |
| 打通下游消费派生基础 | release snapshot、query、package view、guide sample、outbox boundary 成立 | AC-FUNC-004 / AC-FUNC-008 可判定 |
| 落地 P0-min operations 能力 | validate、derive snapshot、rebuild index、recalculate fingerprint、publish fact、outbox relay | AC-FUNC-005~007 可判定 |

#### 7.2 实施范围表

| 类别 | 内容 | 来源 | 是否本轮实施 | 说明 |
|---|---|---|---|---|
| 功能能力 | 共享契约范围管理 | F-001 / AC-FUNC-001 | 是 | P0 核心 |
| 功能能力 | 跨仓契约语义表达 | F-002 / AC-FUNC-002 | 是 | P0 核心 |
| 功能能力 | 契约演进兼容与追溯 | F-003 / AC-FUNC-003 | 是 | P0 核心 |
| 功能能力 | 下游消费与派生基础 | F-004 / AC-FUNC-004 / AC-FUNC-008 | 是 | P0 核心 |
| 最小增强切口 | 契约检查与派生辅助 | F-005 / AC-FUNC-005 | 是,限 P0-min | 只做 validate / derive / rebuild / recalculate / publish fact job |
| 最小增强切口 | 契约追溯查看 | F-006 / AC-FUNC-006 | 是,限 P0-min | 只做 trace query、projection stale、audit trace 对齐 |
| 最小增强切口 | 契约接入说明与示例 | F-007 / AC-FUNC-007 | 是,限 P0-min | 只做 package view 和 guide sample query |
| 实现结构 | Rust workspace 多 crate | DD §4 | 是 | contracts / domain / application / infra / cli / jobs |
| 配置 | P0 runtime config | 04 §2 / §7 | 是 | 只覆盖 CLI / job runtime、storage roots、reference resolver |
| 测试 | P0 unit / service / integration / contract-worker / E2E-release gate | 05 §2~§10 | 是 | 嵌入阶段门禁 |
| 验收 | P0 AC、EV、一票否决、缺陷分级 | 06 §2~§14 | 是 | 作为完成判定输入 |

#### 7.3 非范围表

| 非范围 | 来源 | 本轮处理 |
|---|---|---|
| 在线 HTTP / gRPC server | 03 §2 | 不实现,后续 gateway / 独立服务设计 |
| 认证、授权、凭据处理 | 03 §2 / 06 AC-RED | 不实现,只接收可信 actor / metadata / gate ref |
| L0-bus runtime | 01 / 03 / 06 | 不实现 ack / retry / dead-letter,只实现 outbox / relay boundary |
| L0-sdk 高层客户端 | 01 / 03 / 06 | 不实现 developer experience,只保证 DTO / schema / package view |
| L1 业务聚合和业务状态机 | 00 / 01 / 06 | 不实现,只提供共享契约基线 |
| 真实 L4 观测存储和归档恢复 | 01 / 06 | 不实现,只保证 trace / audit / evidence 字段 |
| config center、hot reload、admin override | 04 / 06 | P2,不进入 P0 配置项 |
| 真实 KMS / Vault / secret provider | 04 / 06 | P1/P2,本轮只禁止 raw secret |
| 完整多语言 binding、样例仓、可视化 | 00 / 06 | 不作为 P0 完整功能,只保留 P0-min 接缝或风险 |
| 完整性能容量压测 | 06 | 不作为 P0 阻断,先形成 baseline / 风险记录 |

### 8. 回填草稿

以下内容回填到正式 `07-实施计划.md` §2。

```md
## 2. 实施目标与范围

> 校准来源：
> - `design-calibration/07_implementation_plan_step_02_scope.md`
>
> 延伸阅读：
> - 建议继续阅读上述中间产物的“实施目标表”“实施范围表”和“非范围表”小节,了解本轮为何采用 F-001~F-004 核心闭环 + F-005~F-007 P0-min 的实施边界。

本轮实施目标是把 L0-core 落成可独立构建、可测试、可验收的 P0 跨仓共享契约来源仓。最小可交付结果包括 Rust workspace 多 crate 骨架、契约定义 truth、Command / Query / Event / Job DTO、发布基线、release snapshot、query / trace / package / sample view、audit / outbox / idempotency、P0 operations jobs、配置加载和 P0 测试验收门禁。

| 类别 | 内容 | 来源 | 是否本轮实施 | 说明 |
|---|---|---|---|---|
| P0 核心 | 共享契约范围管理 | F-001 / AC-FUNC-001 | 是 | 合法跨仓契约准入,边界外对象拒绝 |
| P0 核心 | 跨仓契约语义表达 | F-002 / AC-FUNC-002 | 是 | Command / Query / Event / Job schema 稳定 |
| P0 核心 | 契约演进兼容与追溯 | F-003 / AC-FUNC-003 | 是 | 生命周期、compatibility、audit、trace |
| P0 核心 | 下游消费与派生基础 | F-004 / AC-FUNC-004 / AC-FUNC-008 | 是 | release snapshot、query、outbox boundary、最小闭环 |
| P0-min | 契约检查与派生辅助 | F-005 / AC-FUNC-005 | 是,限最小切口 | validate、derive snapshot、rebuild index、recalculate fingerprint、publish fact job |
| P0-min | 契约追溯查看 | F-006 / AC-FUNC-006 | 是,限最小切口 | trace query、projection stale、audit trace 对齐 |
| P0-min | 契约接入说明与示例 | F-007 / AC-FUNC-007 | 是,限最小切口 | package view 和 guide sample query |

本轮明确不实现在线 HTTP / gRPC server、认证授权、真实 L0-bus runtime、L0-sdk 高层客户端、L1 业务语义、真实 L4 观测存储和归档恢复、config center、hot reload、admin override、真实 KMS / Vault、完整多语言 binding、样例仓、可视化和完整性能容量压测。
```

### 9. 待确认事项

- 是否接受 F-005~F-007 只实现 P0-min 最小切口,不扩展为完整外围增强能力。
- 是否接受真实 L0-bus / L0-sdk / L1+ 联调不作为本轮 P0 阻断项,只进入 boundary suite 和风险接受。
- 是否接受完整多语言 binding、样例仓、可视化、config center、hot reload、admin override 不进入本轮实施范围。

建议方案：接受。原因是该范围与 `06-验收标准.md` 的 P0 / P0-min / P1 后置边界一致,可以保证 L0-core 作为底座仓先独立闭环。

### 10. 进入下一步条件

- 本轮目标明确为 L0-core P0 契约来源仓闭环。
- P0、P0-min 和非范围已经明确。
- 可以进入 Step 3,继续收稳前置条件与阅读清单。
