# 01 架构 Step 7：依赖方向与层间约束

## 1. Step 状态

状态：completed / stop_review；模式：full-restart；对应 SOP：架构 SOP Step 7。
开工确认：项目台账、flow、前序 Step 已读；三层门禁允许当前 Step。formal_01_write_allowed 仍关闭。

### Step 内计划

- [x] 读取输入和前序结论：见 §2。
- [x] SOP 问题回答：见 §3。
- [x] 当前材料诊断：见 §4。
- [x] 设计取舍：见 §6。
- [x] 结构化中间产物。
- [x] 复杂度判断与按单元停审。
- [x] 回填草稿。
- [x] 自检与进入下一步条件。

模块骨架：U1 -> U2 -> U3 -> U4 -> U5 -> U6。未来 Step 不创建。

## 2. 本步输入

Step 5 U1~U6、Step 6；全局规则 §2/4/5/6；正式 00 §6；共同输入：正式 00、项目台账、架构 flow 的来源复核表、架构 SOP 对应 Step、书写规范对应章节、中间产物规范和真相源闭环标准。前序产物的未闭合 seam 仍保留。

## 3. SOP 问题回答

1. 内部层？入口与适配在外，用例编排在中，局部语义/不变量在内；外部访问经倒置边界。
2. 允许方向？入口依赖用例，用例依赖局部语义和抽象边界，适配实现边界；核心不认识传输、SDK 或数据库。
3. 编译依赖？仅 L0-core 共享契约候选；owner L1、Bus、SDK 不能因 runtime/event 关系变成 path dependency。
4. 裁剪什么？六个 L1 owner 和 bus 的只读/事件输入进主链；L2 只做边界参考；archive/product 为下游。
5. 必须倒置什么？source query/visibility、event input/recovery、本地持久和时钟等外部能力，不能污染 U1~U6。
6. 如何停审？逐单元列允许、禁止和来源入口；再检查反向写与不当 compile。

## 4. 当前文档问题诊断

正式 00 §6 的图箭头是输入流方向，与全局规范的“本仓依赖上游”箭头不同；本 Step 统一声明依赖箭头向提供者。draft/03 Outbox 候选不能反推 outbound bus contract。

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 当前架构主题 | 正式 01 未创建，draft 只作候选 | 由本步输入独立收束后进入 §7 | 阻止历史草稿升级为真相 |
| 外部依赖 | 00 已登记 pending/blocker | 保留 owner 和解锁条件 | 不以架构补外部合同 |

## 6. 设计取舍

| 方案 | 优点 | 代价 | 结论 |
|---|---|---|---|
| 倒置边界隔离 runtime/event/ref | owner schema 不侵入核心 | 适配必须显式处理缺合同 | 采用 |
| 直接引用各 L1 源码/表 | 快速复用类型 | 循环依赖与真相泄漏 | 禁止 |

## 7. 结构化中间产物

### U1 单元校准

问题：该单元允许依赖什么？正式 principal、identity/work scope 与 owning visibility resolution。
诊断：若直接接入实现层会造成 不从本地索引猜 membership，不依赖运行实例 的禁区穿透。
取舍：采用 解析 adapter 边界，拒绝直接 package/共享表；对应 WS-UP-003/005 仍为阻塞。

| 允许依赖 | 倒置接入 | 禁止依赖 | blocker |
|---|---|---|---|
| 正式 principal、identity/work scope 与 owning visibility resolution | 解析 adapter 边界 | 不从本地索引猜 membership，不依赖运行实例 | WS-UP-003/005 |

回填：本单元结构化结论进入本 Step 对应正式章节。
单元自检：职责唯一、输入来源和禁止边界清楚；未新增外部合同或提前下沉 schema。
单元门禁：思考 done / 写入 done / 自检 done / pass；停审后允许下一单元。

### U2 单元校准

问题：该单元允许依赖什么？owner no-write query、已许可 summary/ref。
诊断：若直接接入实现层会造成 不读 owner 内部表、不复制原始响应正文 的禁区穿透。
取舍：采用 source query adapter；共享契约经 Core，拒绝直接 package/共享表；对应 WS-UP-001/003 仍为阻塞。

| 允许依赖 | 倒置接入 | 禁止依赖 | blocker |
|---|---|---|---|
| owner no-write query、已许可 summary/ref | source query adapter；共享契约经 Core | 不读 owner 内部表、不复制原始响应正文 | WS-UP-001/003 |

回填：本单元结构化结论进入本 Step 对应正式章节。
单元自检：职责唯一、输入来源和禁止边界清楚；未新增外部合同或提前下沉 schema。
单元门禁：思考 done / 写入 done / 自检 done / pass；停审后允许下一单元。

### U3 单元校准

问题：该单元允许依赖什么？经边界验证的 owner event、U2 输入、本地状态承载。
诊断：若直接接入实现层会造成 不依赖 bus backend 或重定义 delivery 的禁区穿透。
取舍：采用 bus 输入与本地应用边界分开，拒绝直接 package/共享表；对应 WS-UP-002/007 仍为阻塞。

| 允许依赖 | 倒置接入 | 禁止依赖 | blocker |
|---|---|---|---|
| 经边界验证的 owner event、U2 输入、本地状态承载 | bus 输入与本地应用边界分开 | 不依赖 bus backend 或重定义 delivery | WS-UP-002/007 |

回填：本单元结构化结论进入本 Step 对应正式章节。
单元自检：职责唯一、输入来源和禁止边界清楚；未新增外部合同或提前下沉 schema。
单元门禁：思考 done / 写入 done / 自检 done / pass；停审后允许下一单元。

### U4 单元校准

问题：该单元允许依赖什么？U1 scope、owner attention input、U3 稳定引用。
诊断：若直接接入实现层会造成 不依赖 conversation receipt/任务完成写面 的禁区穿透。
取舍：采用 只写 workspace local state，拒绝直接 package/共享表；对应 WS-UP-004 仍为阻塞。

| 允许依赖 | 倒置接入 | 禁止依赖 | blocker |
|---|---|---|---|
| U1 scope、owner attention input、U3 稳定引用 | 只写 workspace local state | 不依赖 conversation receipt/任务完成写面 | WS-UP-004 |

回填：本单元结构化结论进入本 Step 对应正式章节。
单元自检：职责唯一、输入来源和禁止边界清楚；未新增外部合同或提前下沉 schema。
单元门禁：思考 done / 写入 done / 自检 done / pass；停审后允许下一单元。

### U5 单元校准

问题：该单元允许依赖什么？U2 baseline、U3 cursor/gap、owner/bus 获准恢复能力。
诊断：若直接接入实现层会造成 不依赖 archive restore、source repair 或 SDK cache 的禁区穿透。
取舍：采用 显式恢复边界，拒绝直接 package/共享表；对应 WS-UP-001/002 仍为阻塞。

| 允许依赖 | 倒置接入 | 禁止依赖 | blocker |
|---|---|---|---|
| U2 baseline、U3 cursor/gap、owner/bus 获准恢复能力 | 显式恢复边界 | 不依赖 archive restore、source repair 或 SDK cache | WS-UP-001/002 |

回填：本单元结构化结论进入本 Step 对应正式章节。
单元自检：职责唯一、输入来源和禁止边界清楚；未新增外部合同或提前下沉 schema。
单元门禁：思考 done / 写入 done / 自检 done / pass；停审后允许下一单元。

### U6 单元校准

问题：该单元允许依赖什么？U1 可见性、U3 已提交 projection、U4 local overlay、U5 维护状态。
诊断：若直接接入实现层会造成 不反向依赖 SDK/UI/sync/archive 实现 的禁区穿透。
取舍：采用 read/export 边界，拒绝直接 package/共享表；对应 WS-UP-006 仍为阻塞。

| 允许依赖 | 倒置接入 | 禁止依赖 | blocker |
|---|---|---|---|
| U1 可见性、U3 已提交 projection、U4 local overlay、U5 维护状态 | read/export 边界 | 不反向依赖 SDK/UI/sync/archive 实现 | WS-UP-006 |

回填：本单元结构化结论进入本 Step 对应正式章节。
单元自检：职责唯一、输入来源和禁止边界清楚；未新增外部合同或提前下沉 schema。
单元门禁：思考 done / 写入 done / 自检 done / pass；停审后允许下一单元。

### 7.7 内部方向

#### 依赖方向图

依赖朝向局部语义边界。

```text
[Inbound / operations] ---> [Application use cases] ---> [Local semantics]
                                     |
                                     v
                              [Abstract boundaries]
                                     ^
                                     |
                              [External adapters]
```

图示说明：

- 箭头表示静态依赖，不是 query/事件运行顺序；适配实现边界，核心不依赖实现。
- U1~U6 是语义单元，不对应目录或包；该图不授权创建 crate。

| 架构责任层 / 依赖角色 | 允许依赖 | 禁止依赖 | 说明 |
|---|---|---|---|
| 入口/运维承接 | 正式用例 | 偷写存储、私造授权或隐式 refresh | 输入归一化不产生业务事实 |
| 用例编排 | 局部语义、抽象边界、本地原子承载 | 跨仓事务、绕过不变量 | 组织 source 只读消费 |
| 局部语义 | 本仓不变量、已核验共享契约 | 网络、数据库、SDK、总线后端 | 不知道外部实现 |
| 外部适配 | 本仓抽象边界、正式 owner 合同 | 通过私有字段补 source truth | 明确不可用、缺口与失败 |
| 状态承载 | workspace 局部事实与投影 | 共用 owner 表、反写 owner | 只维护本地状态 |

### 7.8 本仓依赖裁剪表

| 关联项目 | 全局关系 | 本仓角色 | 依赖类型 | 是否进入当前文档主链 | 裁剪理由 |
|---|---|---|---|---|---|
| L0-core | 唯一共享契约来源 | 依赖方 | compile | 是，候选 | 专用 type 必须经 Core 确认；无本地 shadow。 |
| L0-bus | 事件协作主干 | 依赖方/协作方 | event | 是 | 不形成源码依赖。 |
| L1-identity | 身份 truth owner | 依赖方 | runtime/event/ref | 是 | Personal 身份锚点、安全摘要；seam pending。 |
| L1-work | 项目/成员/工作 owner | 依赖方 | runtime/event/ref | 是 | Project scope 来源；seam pending。 |
| L1-conversation | 对话 owner | 依赖方 | runtime/event/ref | 是，按来源开放 | 安全摘要及明示 attention，非正文。 |
| L1-process | 流程 owner | 依赖方 | runtime/event/ref | 是，按来源开放 | 可见活动/流程引用。 |
| L1-governance | 治理 owner | 依赖方 | runtime/event/ref | 是，按来源开放 | 不新增全域授权中心。 |
| L1-artifact | 制品 owner | 依赖方 | runtime/event/ref | 是，按来源开放 | 安全摘要/版本引用，不复制正文。 |
| L0-sdk / L5 产品 / L5-sync | 正式访问与消费 | 被依赖方 | runtime/adapter/ref | 输出边界 | 本仓不编译依赖客户端。 |
| L4-archive | 后续归档消费者 | 被依赖方 | runtime/ref | 仅下游边界 | 串行后续；不提供本仓 rebuild truth。 |
| L2-runtime/tools/member/service/images | 相邻运行边界 | 非依赖，仅参考 | 文档参考，不是运行依赖 | 否 | 不消费执行或镜像 live state。 |

### 7.9 本仓依赖类型分类表

| 依赖类型 | 关联项目 | 本仓如何使用 / 提供能力 | 后续文档落点 |
|---|---|---|---|
| 编译期 compile | L0-core | 经核验的共享 ref/error/trace | 03/07 核验符号来源，不在 01 承诺路径 |
| 运行期 runtime | 六个 L1 owner | 正式只读 query/visibility/recovery | 02/03 接缝，缺口保持 blocked |
| 事件协作 event | L0-bus + owner | 订阅允许的事实变化 | 03 event/consumer、05 故障场景 |
| 引用 ref | 六个 L1 owner、下游 | 回链 provenance/版本/主体 | 02/03 typed ref，不默认字符串等价 |
| 适配 adapter | 外部输入、存储、下游 | 隔离机制，不是新 owner | 02/03 接缝、04 绑定 |
| fake | 后续测试替身 | 模拟已定义语义及失败 | 05，不能证明真实集成或补未知合同 |

### 7.10 本仓禁止依赖表

| 禁止依赖 | 禁止原因 | 正确协作方式 |
|---|---|---|
| workspace -> L1 owner 源码/内部表 | 打穿 owner 与编译边界 | query/ref/event |
| workspace -> bus backend / delivery store | 传递真相越权 | bus 正式消费边界 |
| workspace -> SDK cache / UI | 下游反向定义 read model | 本仓 read surface |
| projection -> 上游 command | 形成反写 | 调用者访问 owner |
| workspace -> archive package 作为当前事实 | 下游定义上游 truth | owner baseline + 获准事件 |
| workspace -> runtime/tools/sandbox 执行状态 | 执行越权 | 只作禁止边界 |
| fake -> production source truth | 伪造成功 | TestOnly 与 unresolved seam |

#### 依赖裁剪图: L1-workspace

```text
Global baseline
  |
  | crop only related edges
  v
+---------------------+
| L1-workspace        |
+----------+----------+
           +--[compile] candidate-> L0-core
           +--[event]-------------> L0-bus
           +--[runtime/ref]-------> L1 owning domains

SDK/products/sync --[runtime/adapter/ref]--> L1-workspace
L4-archive         --[runtime/ref]---------> L1-workspace
```

图示说明：

- 箭头表示依赖/消费方向，不是事件传播方向；与 §5 的输入/输出图不同。
- 只有 compile 候选可进入后续 package 判定；其他关系不自动生成 package 依赖。
- archive 箭头仅为后续消费方向，不代表本轮解锁归档。

跨依赖审计：U1~U6 均通过抽象边界消费来源；无 SDK 反依赖、跨域表连接、bus backend 侵入或 projection 反写；01 不给 Cargo path。

## 8. 回填草稿

正式 §8 承接 §7 已收束的表、图和结论；图注随图一起回填。不复制 §3~6 的讨论过程。

复杂度判断：逐六单元停审，再形成内部方向与仓级依赖裁剪。

## 9. 待确认事项

WS-UP-001~008 仍保持 open；exact query/event/ref/visibility/cursor/export 和共享 schema 必须由 owner 关闭，不由本 Step 补全。

## 10. 进入下一步条件

固定三表与图齐全；无依赖类型混淆、循环和未确认 compile；输入方向与依赖方向明确。

写入前检查：模块思考已完成，结构化结论仅整理 §3/6；正式回填草稿无新增协议。
思考记录 = done；写入记录 = done；自检状态 = done；gate_status = pass；gate_reason = 本步架构结论可引用，未闭合外部能力已隔离为 blocker；next_allowed_action = 进入 Step 8。
本 pass 只指设计静态自检，不是测试、集成、证据、用户 signoff 或 readiness。
