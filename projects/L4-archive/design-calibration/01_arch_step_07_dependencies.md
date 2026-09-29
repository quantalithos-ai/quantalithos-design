# 01 架构 Step 7：依赖方向与层间约束

## 1. Step 状态与计划

状态：`completed / pass_with_upstream_blockers / stop_review`；对应架构 SOP Step 7。

### Step 内计划

- [x] 读取 U1~U6、运行承载、正式 00 依赖分类与全局依赖规则。
- [x] 回答责任角色、允许/禁止方向、倒置边界与外部接入。
- [x] 诊断旧文档的源码层、运行拓扑和跨域写入混层。
- [x] 按 U1~U6 逐单元停审依赖。
- [x] 输出裁剪表、类型表、禁止依赖表、裁剪图与跨单元审计。

## 2. 问题回答、历史诊断与取舍

依赖保护结构分为核心语义角色、编排/承接角色、外部接缝角色和技术承载角色。外部材料、decision、storage、integrity、receiver 都必须经接缝进入；技术能力不得反向定义 Bundle、closure 或 restore 语义。

旧文档使用 `domain/application/infra`、Repository、PostgreSQL、object storage、worker 来表达依赖，并保留“restore 例外写 L1”。这些是代码/运行/产品混层。当前只确定架构责任角色与关系类型，不把 runtime、event、ref、adapter 或 fake 写成 package dependency。

关键取舍：`L0-core` 仅为已核验共享契约的 compile candidate；L1 sibling、workspace、observability、Bus、外部设施与 receivers 均通过 runtime/event/ref/adapter seam。全局矩阵把 `L0-sdk` 列为 L4-archive 编译期依赖，而本仓正式 00 与 `L0-sdk` 正式边界把 Archive 视为 SDK 的运行期封装目标/下游消费关系；本轮保持不引入 SDK compile dependency，并登记 `AR-ARCH-001` 待全局依赖标准 owner 与 `L0-sdk` 对齐。

## 3. 依赖角色结构

### 3.1 依赖方向图

```text
      +====================================================+
      |              L4-archive dependency boundary       |
      |                                                    |
      |   +--------------------------------------------+   |
      |   | external seams                            |   |
      |   | source / decision / storage / receiver    |   |
      |   +--------------------+-----------------------+   |
      |                        | boundary access           |
      |                        v                           |
      |   +--------------------------------------------+   |
      |   | orchestration / acceptance roles          |   |
      |   +--------------------+-----------------------+   |
      |                        | allowed dependency        |
      |                        v                           |
      |   +--------------------------------------------+   |
      |   | core archive semantics                    |   |
      |   | manifest closure / restore handoff rules  |   |
      |   +--------------------------------------------+   |
      |                                                    |
      |   technical carriers depend on local semantics     |
      |   through inward contracts; never define them      |
      +====================================================+
```

图后说明：

- 箭头表示边界接入和允许依赖，不表示调用顺序、运行拓扑或代码 import。
- U3/U6 的核心语义不依赖供应商、外部 owner 实现或 SDK。
- 外部能力只能通过接缝被编排；技术承载不能反向决定 authority、closure 或 business outcome。

### 3.2 层间约束

| 架构责任层 / 依赖角色 | 允许依赖 | 禁止依赖 | 说明 |
|---|---|---|---|
| 核心 Archive 语义 | 已核验共享值语义；本仓内部规则 | 外部 provider、transport、storage 产品、SDK、owner 实现 | 核心判断必须可在外部不可用时仍给出 blocked/unknown。 |
| 编排 / 承接角色 | 核心语义、外部接缝抽象、本地状态承载 | owner 私有表、跨域事务、产品 UI | 只协调本仓状态和正式外部意图。 |
| 外部接缝角色 | 外部正式合同、核心/编排所定义的边界 | 反向改写核心规则、复制外部 truth | 负责翻译，不获得 authority。 |
| 技术承载角色 | 核心定义的持久化/处理需要 | 业务 decision、source truth、restore commit 语义 | 产品/设施只承载，不定义业务边界。 |

## 4. U1~U6 逐单元依赖校准

| 单元 | 允许内部依赖 | 外部接入类型 | 禁止依赖 | 停审 |
|---|---|---|---|---|
| U1 Request/Job | 本仓范围/幂等/作业规则 | runtime/ref/event 入口；actor/decision ref | 直接依赖项目状态库、UI 或治理实现 | pass |
| U2 Source Binding | U1 请求范围与 source-authority 声明 | owner runtime/ref；event 仅作变化提示 | workspace/audit/cache 替代 canonical owner；L1 package | pass_with AR-UP-001/006/007/008 |
| U3 Manifest/Closure | U1/U2 的已捕获关系 | material carrier adapter/ref | 存储 ack、签名结果或业务状态反向决定 closure | pass |
| U4 Integrity/Compatibility | U3 manifest/material boundary | digest/signature/KMS/schema runtime adapter/ref | 固定算法/密钥/provider 或自动猜兼容 | pass_with AR-UP-004 |
| U5 Storage/Lifecycle | U3/U4 与本仓 execution rule | governance ref/event；storage runtime/adapter | policy engine、secret truth、供应商 SDK 进入核心 | pass_with AR-UP-003/005 |
| U6 Restore/Handoff | U1、U3~U5 的计划前置 | owner receiver runtime/adapter/ref；feedback event | 上游 DB、跨域 UoW、SDK client cache | pass_with AR-UP-002/009 |

逐单元结论：每个单元均可在外部不可用时产生本地明确姿态；event 只传递触发/事实提示，ref 只定位，adapter 只翻译，均不转移 owner。

## 5. 跨仓依赖裁剪

### 5.1 本仓依赖裁剪表

| 关联项目 | 全局关系 | 本仓角色 | 依赖类型 | 是否进入主链 | 裁剪理由 |
|---|---|---|---|---|---|
| `L0-core` | L4-archive 编译期依赖 | 依赖方 | compile candidate | 条件 | 仅已核验共享 ref/error/version 契约；未核验则本地 seam/pending。 |
| `L0-bus` | 消费归档相关事件 | 协作方 | event + adapter | 是 | 触发/反馈协作；不拥有 delivery/replay truth。 |
| identity/conversation/work/process | L1 snapshot/export | 依赖方/协作方 | runtime + ref + event | 是 | 提供 canonical-owner material 并接收恢复交接。 |
| `L1-governance` | 正式治理决定 | 依赖方 | runtime + ref + event | 是 | 只消费 decision，不复制 policy engine。 |
| `L1-artifact` | 制品材料/血缘 authority | 依赖方/协作方 | runtime + ref + event | 是 | approved material/ref；Artifact truth 不转移。 |
| `L1-workspace` | Layer 4 强串行前置 | 依赖方 | runtime + ref | 受限 | 只允许 projection 辅助输入。 |
| `L4-observability` | 审计/证据协作 | 依赖方/协作方 | runtime + ref + event | 受限 | 只接收获准脱敏 material/ref。 |
| `L0-sdk` | 全局矩阵列为 compile；专项边界视 Archive 为 runtime target | 下游适配方 | adapter + ref；compile disputed | 否（作为上游） | 本仓不以 SDK 调自身/访问 sibling；由 SDK 封装 Archive 对外边界。 |
| 对象存储/完整性/KMS/压缩 | 外部设施 | 依赖方 | runtime + adapter + ref | 条件 | 产品/算法/密钥未闭合。 |
| owner restore receivers | 恢复接收边界 | 协作方 | runtime + adapter + ref + event | 是 | owner 决定业务 commit。 |
| Console/Sync/审计 consumer | 下游消费 | 被依赖方 | adapter + ref | 否 | 不反向进入 Archive 核心。 |

### 5.2 本仓依赖类型分类表

| 依赖类型 | 关联项目/能力 | 本仓如何使用或提供 | 后续落点 |
|---|---|---|---|
| compile | `L0-core` 核验通过的共享契约候选 | 复用公共 ref/error/version 语义；否则不建依赖 | 02/03 核验，07 仅计划 |
| runtime | L1 owners、governance、artifact、workspace、observability、外部设施、receivers | 经正式 query/export/restore/capability boundary 协作 | 01/02/03/04 |
| event | `L0-bus` 与可用 owner feedback | 触发、变化提示、结果传播；不等于权威读取或投递成功 | 01/03/05 |
| ref | source/decision/artifact/audit/workspace/location/key/handoff refs | 保存可追溯关系，不保存外部 truth/secret | 01/02/03 |
| adapter | storage/integrity/KMS/compression/receiver/SDK/product | 翻译外部能力与结果，不定义核心规则 | 01/02/03/04 |
| fake | 后续测试替身 | 只验证本地分支和错误分类 | 05；不证明集成/readiness |

### 5.3 本仓禁止依赖表

| 禁止依赖 | 禁止原因 | 正确协作方式 |
|---|---|---|
| Archive 源码依赖任一 L1/L4 sibling 实现 | 把 runtime/ref/event 伪装成 compile 并形成真相耦合 | formal API/export/event/ref adapter |
| Archive 通过 `L0-sdk` 访问自身或 sibling | 方向倒置且可能形成循环；全局矩阵有待对齐 | 服务端 formal seams；SDK 作为下游 client |
| Archive 共享 owner 数据库/事务 | 获得跨域写权并产生双真相 | owner snapshot/export 与 restore receiver |
| 核心语义依赖 storage/KMS/provider SDK | 供应商反向定义 Bundle 语义 | 本仓 port + external adapter |
| workspace/observability/material cache 替代 owner | projection/观察材料被升格 | source-authority matrix + explicit auxiliary class |
| fake 结果进入 production/readiness 声明 | 替身不能证明 authority、commit 或签名 | 真实合同与证据门禁 |

### 5.4 依赖裁剪图: L4-archive

```text
L0-core --[compile candidate]----------------------> L4-archive
L0-bus  --[event]---------------------------------> L4-archive
L1 owners / governance / artifact --[runtime/ref]-> L4-archive
L1-workspace / L4-observability --[runtime/ref]---> L4-archive
external storage / integrity / KMS --[runtime]----> L4-archive
L4-archive --[runtime/adapter]--------------------> owner restore receivers
L0-sdk / products --[runtime adapter consumer]----> L4-archive public boundary
```

图示说明：

- 本图只展示 L4-archive 相关边，不展示 27 仓总图，也不表达调用顺序。
- 只有核验通过的 `L0-core` 共享契约可能进入 package dependency。
- runtime/event/ref/adapter/fake 均不得写成 Archive 源码依赖。
- `L0-sdk` 的全局矩阵方向冲突由 `AR-ARCH-001` 挂起，本轮按服务端不反向依赖 client 的保守边界处理。

## 6. 跨单元审计、回填与门禁

反向依赖、跨仓类型误判、技术产品反向定义核心、projection 替代 owner 均已检查，未发现内部 unresolved 冲突。新增上游 blocker：`AR-ARCH-001`，owner 指向全局依赖标准维护方与 `L0-sdk`；不修改上游文档。

正式 §8 承接依赖图、角色表、三张裁剪表、禁依赖和裁剪图。`gate_status = pass_with_upstream_blockers`；`next_allowed_action = Step 8 数据所有权与一致性`。
