# Step 6. 使用方与依赖

## 1. Step 状态

`pass / stop_review`；SOP Step 6、规范 §4.6、全局规则 §5/§6、中间产物 §5.6 已读；正式回填 §6。

### 1.1 Step 内计划

- [x] 前序/全局读取、九问回答、诊断与取舍。
- [x] 逐依赖裁剪、分类、禁止、图及 path 判定。
- [x] 复杂度、草稿、自检与停审。

## 2. 本步输入

Step 1～5 的问题/取舍/pending；全局规则 §4 的市场行、§4.1 Layer 5、仓库拆分 §11；补读 Core/Bus 正式 00 §1～§2：Core 是共享契约，Bus 是投递主干，不能从 ACK 得到业务成功。

## 3. SOP 问题回答

1. 向谁提供？SDK 接入的市场读取/申请/关系状态，以及潜在 Console 管理协作；不假定 Website 是市场网站或已接入下游。
2. 依赖谁？Core/SDK、五类资产 owner、Governance/Artifact、安全来源、分发接收方、审计交接。
3. 全局是什么边？Core/SDK 可编译；owner 消费为运行期；事件只经 SDK 的已授权语义，不能源码引用 owner。
4. 哪些主链/裁剪？可信发布、获取与撤回的实际来源纳入；Archive 恢复、Billing、其他产品集成非当前已成立前置。
5. 类型？共享 package 是编译；能力调用是运行；正式变更提示是条件事件，不直接扩 Bus package 依赖。
6. 前置？owner 引用、publisher 验证与授权、正式审核绑定、接收合同在对应正向路径前置；审计 producer 准入在外部审计交接前置。
7. 失效影响？受影响发布/获取拒绝或等待，查询只输出安全范围内的缺失/陈旧/不可见；不默认绕过为免费/公开。
8. 消费还是强阻塞？AI Identity 摘要仅在 AI actor 使用时相关；publisher 人类认证不是 Identity。缺少正向验证时强阻塞相应写路径，不阻塞无泄漏的局部状态查看。
9. 非阶段前置？真实归档恢复、支付、跨产品通知通道未正式绑定；不能因此声称市场完整实现可验收。

## 4. 当前文档问题诊断

draft01 §5 错把 SDK 表为被依赖/协作，且将 Identity 认证纳入主链；§4 把 Website 当市场目录端。旧 README 上游列表可被误读为 owner 源码依赖。上游总矩阵不是具体已存在 client contract。

## 5. 改动前后对比

| 项 | 改前 | 改后 | 原因 |
|---|---|---|---|
| SDK | 模糊方向 | 市场编译使用 client、运行经正式 client 消费 owner | 遵守全局矩阵 |
| Identity | publisher 认证前置 | 条件 AI 身份引用，不提供认证 | 当前 owner 边界 |
| 事件 | 假定可订阅全部资产事件 | owner 明确授权且 SDK 支持才启用 | 镜像当前 zero outbound |

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 正式能力依赖+路径级 blocker | 不夸大也不绕 gate | 需逐 owner 核验 | 采用 |
| 全项目完成即接口 ready | 简单 | 状态冲突/logic-only/缺字段被掩盖 | 不采用 |
| 各 owner 直接源码/共享表 | 少 adapter | 破坏分层与唯一 truth | 不采用 |

## 7. 结构化中间产物

### 全局基线引用

规则：`standards/document/全局项目依赖关系与裁剪规则.md` §4～§6；矩阵：`architecture/仓库拆分方案.md` §十一。以下只裁剪市场相关边，不转录 27 仓矩阵。

### 内部仓依赖

| 方向 | 对方 | 提供 / 依赖内容 | 是否闭环前置 | 失效影响 |
|---|---|---|---|---|
| 输入 | L0-core | 正式共享引用、错误及 metadata | 是 | 不得本地 shadow shared truth |
| 输入 | L0-sdk | 正式 owner 客户端支持与接入语义 | 对应集成是 | 不绕过 client 私连 L1 |
| 输入 | L3-method-library | 方法、模板、角色正式定义消费 | 对应三类发布是 | 受影响来源不能上架/新获取 |
| 输入 | L3-capability-hub | 正式能力只读曝光 | 能力类发布是 | registry 不得冒充 listing 版本 |
| 输入 | L2-member-images | 镜像 pinned 来源及供给资格 | 镜像类发布是 | logic-only 不证明可分发 |
| 输入 | L1-artifact | 材料/版本的可消费引用 | 涉及制品材料是 | 任意文件不能替代正式引用 |
| 输入 | L1-governance | 绑定市场申请的正式决定 | 上架是 | 未匹配决定不得上架 |
| 输入 | L1-identity | AI actor/member 引用 | 条件 | 不影响人类认证 owner 判定 |
| 输出 | L4-observability | 市场安全审计材料交接 | 外部审计闭环是 | 不声明交接完成，保留局部追溯 |
| 输出 | L4-archive | 市场状态导出/恢复协作候选 | 否，合同 pending | 不开放跨域恢复 |
| 输出 | L5-console | 市场管理摘要候选 | 非独立市场前置 | 无合同不声明已集成 |

### 外部系统依赖

当前没有已指定且正式绑定的外部系统。publisher 认证/组织验证、授权、分发接收、通知通道和供应链材料签发仍是必需能力缺口，不虚构具体外部服务为已成立依赖；Billing 全部 future/blocker。

### 本仓依赖裁剪表

| 关联项目 | 全局关系 | 本仓角色 | 依赖类型 | 是否进入当前文档主链 | 裁剪理由 |
|---|---|---|---|---|---|
| L0-core | 市场允许依赖 | 依赖方 | 编译期 | 是 | 仅已导出的 shared contracts |
| L0-sdk | 市场允许依赖 | 依赖方 | 编译期/运行期 | 是 | package 与服务消费关系分开 |
| L3-method-library | method/role 发布能力 | 依赖方 | 运行期/条件事件协作 | 是 | 三类来源；不引用业务源码 |
| L3-capability-hub | tool 发布能力 | 依赖方 | 运行期/条件事件协作 | 是 | 只读曝光，不合并 listing |
| L2-member-images | 镜像协作经正式边界 | 依赖方 | 运行期 | 是，路径级 | 无已授权 outbound，不假想事件 |
| L1-governance | 发布审核能力 | 依赖方 | 运行期/条件事件协作 | 是 | SDK 消费正式决定 |
| L1-artifact | 资产/审核材料引用 | 依赖方 | 运行期/条件事件协作 | 是 | SDK 消费，不复制正文 |
| L1-identity | 条件身份消费 | 依赖方 | 运行期 | 条件 | AI 身份非人类认证 |
| L4-observability | 横切审计协作 | 协作方 | 运行期/条件事件协作 | 是，交接条件 | producer 准入待闭合 |
| L4-archive | 横切归档协作 | 协作方 | 运行期候选 | 否 | current source matrix 未含市场 |
| L0-bus | SDK 事件封装底座 | 间接消费者 | 事件协作，经 SDK | 条件 | 不新增直接 package 依赖 |
| L5-console | 产品管理消费 | 潜在被依赖方 | 运行期候选 | 否 | 不是当前已绑定消费方 |
| L5-website / sync / bridges | 非当前市场前置 | 潜在协作方 | 运行期候选 | 否 | 不从历史图推导正式集成 |

### 本仓依赖类型分类表

| 依赖类型 | 关联项目 | 本仓如何使用 / 提供能力 | 后续文档落点 |
|---|---|---|---|
| 编译期 | L0-core / L0-sdk | 使用已发布契约/client，不 shadow 类型 | 01/03/07 |
| 运行期 | 资产 owner、Governance、Artifact、条件 Identity | 官方 SDK 与 owner 正式 consumer 边界 | 01/03 |
| 运行期 | Observability；候选 Archive/Console | 安全材料/受控状态交接 | 01/03/05 |
| 条件事件协作 | 已声明 owner，经 SDK/Bus | 只处理授权 schema 与失效提示 | 03/05；无合同不启用 |

### 本仓禁止依赖表

| 禁止依赖 | 禁止原因 | 正确协作方式 |
|---|---|---|
| 市场 -> L1/L2/L3 业务源码/内部表 | 运行依赖不能变编译或共享事务 | SDK/正式 owner 消费边界 |
| owner -> 市场编译依赖 | 反向分层、形成循环 | body-free runtime 消费候选 |
| 市场 -> L1 私有 gRPC 绕 SDK | 违反全局接入约束 | 等 SDK 支持，不临时直连 |
| 市场 -> 未授权 image 事件 | owner 当前 0 outbound | 正式 query 与待绑定状态 |
| 市场 -> 本地 Billing truth | 无正式财务 owner | future/blocker |

#### 依赖裁剪图: L6-marketplace

```text
Global baseline
  |
  | crop only related edges
  v
+--------------------+
| L6-marketplace     |--[compile]--> L0-core
+--------------------+--[compile]--> L0-sdk
  |                     |
  | [runtime via SDK]   +--[event, conditional]--> L0-bus
  +--> L3-method-library
  +--> L3-capability-hub
  +--> L2-member-images
  +--> L1-governance / L1-artifact
  +--> L1-identity (AI references only)
  +--> L4-observability (handoff contract pending)
  +--> L4-archive (future contract, no active lane)
```

- 只展示市场裁剪边；各 owner 箭头表示消费依赖，不表示调用顺序。
- 仅 `[compile]` 可成为 package dependency；runtime/event 不得引用业务源码。
- 事件必须同时有 owner 授权与 SDK 支持，镜像不在当前 outbound 事件候选中。
- Archive 候选不表示已纳入 source-authority matrix。

### path dependency 判定

| 关联项目 | 依赖类型 | 是否允许 package dependency | 当前处理 |
|---|---|---|---|
| L0-core / L0-sdk | 编译期 | 是，正式导出前提 | 具体 package/path 由 03/07 核验 |
| 所有其他关联 owner / Bus | 运行期/条件事件 | 否 | SDK、正式 adapter、query、handoff 或测试 fake |

复杂度：关系表与类型表已拆分，图不替代失败后果表。无需全平台矩阵或时序图。

## 8. 回填草稿

摘录 §7；接口名及已读 exact-contract 限制留 Step 12/15，不混入正式 §6。

## 9. 待确认事项

MP-UP 与 MP-SRC 保留，路径级影响见 Step 1。依赖裁剪不授予 consumer contract；缺口回流仅本地记录，未改 upstream 或发送外部消息。

## 10. 进入下一步条件

关系方向/主链/前置/失效、三表、ASCII、path 判定已自检；无接口、源码依赖误导。计划 done；`pass / stop_review`，允许 Step 7。
