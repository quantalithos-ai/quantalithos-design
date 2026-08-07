# L2-tools 01 架构设计 Step 7: 依赖方向与层间约束

> 创建日期: 2026-08-04
> 状态: completed
> 当前模式: full-restart
> 对应 SOP: `standards/document/架构设计讨论流程_SOP.md` Step 7
> 正式文档回填位置: `01-架构设计.md` 第 8 章

---

## 1. 本步输入与目标

### 1.1 本步目标

明确本仓内部允许的依赖方向、禁止的反向依赖和外部能力的倒置接入边界,并从全局依赖基线裁剪 `L2-tools` 当前子图。依赖角色不是代码目录;运行期和事件协作也不是 package dependency。

### 1.2 输入与读取结论

| 输入 | 读取结论 | 本步约束 |
|---|---|---|
| Step 5 | `A1~A5`、`S1~S3`、`P1~P6` 已完成语义单元停审。 | 每个单元必须定义允许 / 禁止依赖和倒置边界,但不重划子域。 |
| Step 6 | `R1/R2/R3` 与 `T1/T2/D1` 已形成逻辑运行承载。 | 运行单元不能直接变成代码层;技术承载不得反向定义核心。 |
| 正式 00 §6、§12 | 当前依赖子集、pending authorization 和 future SDK 已闭合。 | 保持 `DB-L2T-001~008` 状态,不得把全部记录都写成已成立关系。 |
| 全局依赖规则 | 只有 compile 可成为 package dependency;runtime/event 不可。 | 只使用 compile/runtime/event;不创建 handoff 第四类型。 |
| 架构 SOP Step 7 / 书写规范 4.8 | 需输出内部角色图、层间表、裁剪三表、裁剪图、逐单元停审和跨边界审计。 | 不写 port/adapter/repository/handler、API、schema、topic 或调用链。 |

### 1.3 Step 内计划

- [x] 恢复 flow / ledger,确认当前只允许 Step 7。
- [x] 读取 Step 7 SOP、书写规范 4.8、全局依赖规则和 Step 5~6。
- [x] 先回答内部层次、允许 / 禁止方向和倒置原则。
- [x] 逐 `A/S/P` 单元形成依赖规则并停审。
- [x] 后置审计旧源码依赖、SDK、MCP、Bus 和 Observability 污染。
- [x] 按固定格式形成裁剪表、分类表、禁止表和裁剪图。
- [x] 完成 runtime/event/package、pending/future 和反向依赖跨边界审计。

---

## 2. SOP 问题回答

### 2.1 内部依赖角色如何划分

| 角色 ID | 架构责任层 / 依赖角色 | 作用 |
|---|---|---|
| `E` | 外部接缝角色 | 隔离 Core shared authority、Hub、authorization、Sandbox、Runtime、Bus / Observability 等外部边界。 |
| `F` | 正式承接角色 | 承接同步、异步和后台输入,确保所有变化经正式工具语义规则收口。 |
| `K` | 核心与正式支撑语义角色 | 承载 `A1~A5` 的工具合同、调用、前置、outcome 与 audit 决策权,以及 `S1` 的正式演进 / 兼容影响不变量。 |
| `D` | 派生 / 维护角色 | 只读消费核心 truth,承接 `S2/S3` 的检测、对账、诊断和外围派生。 |
| `T` | 技术承载角色 | 服从核心定义的承载契约,承载 `T1/T2/D1` 逻辑状态,不定义业务语义。 |

### 2.2 允许哪些依赖方向

- 外部对象只能经 `E` 边界接入 `F`,不能直接进入 `K`。
- `F` 可以依赖 `K` 的正式语义与规则,不能让外部输入反向定义它们。
- `D` 可以只读依赖 `K` 和允许的 P 单元,正式变化必须回到 `F -> K`;`S1` 的演进 / 影响变化也必须经 `F -> K/A1` 的同一不变量收口。
- `T` 只能实现由内层定义的承载需求,在架构定义权上依赖 `K`,不能让存储、消息或缓存反向规定状态语义。
- `K` 只依赖本仓规则与 Core 正式共享类别;对 Hub/Auth/Sandbox/Runtime 等外部事实的需要必须通过 `E/F/P` 倒置边界满足。

### 2.3 禁止哪些反向依赖

- `K ->` 外部 sibling 实现、SDK client、provider protocol、Bus/Observability store。
- `K -> D/T` 的派生模型或技术产品语义。
- `D -> K` 的直接反写,以及 `T -> K` 的产品约束反向定义。
- Runtime/Hub/Sandbox/Bus/Observability 直接写入 `T1/T2`。
- `P1~P6` 成为外部 truth 的复制源或核心写入口。

### 2.4 哪些依赖必须倒置

Hub controlled view、authorization result、Sandbox handoff/source、Runtime caller refs、Bus/Observability status/material 都必须先进入 `E/F/P` 的受控边界。核心只表达“需要哪类可验证 ref/snapshot/safe summary”和失败规则,不依赖对方代码、schema、route 或物理模型。Core 是例外的唯一 compile authority,但 Tools-specific package/type 仍必须由正式 authority 闭口。

### 2.5 全局哪些边进入当前主链

- `L0-core`:compile,当前进入。
- `L3-capability-hub`:runtime,当前进入。
- `L4-sandbox`:runtime,当前进入。
- `L2-runtime`:runtime consumer,当前进入。
- `L0-bus`:event,当前进入。
- `L4-observability`:event collaboration,当前进入,但没有 L2 direct positive route。
- Authorization owner:不适用 / owner-pending,不进入当前依赖图。
- `L0-sdk`:不适用 / future-excluded,不进入当前依赖图。

### 2.6 最容易失控的规则

最危险的是把 sibling runtime/event seam 写成 path dependency,把 Sandbox material handoff 发明成第四依赖类型,把 authorization pending 边界默认指向 Governance,把 Observability current collaboration 写成 direct ready route,以及让 SDK wrapper 或旧 provider model 反向定义服务端工具合同。

---

## 3. 旧材料诊断

| 旧依赖口径 | 问题 | 当前处理 |
|---|---|---|
| Tools package 被 Runtime 同进程 import | 将 runtime consumption 写成源码拥有关系。 | Runtime 只保留运行期消费边。 |
| L2 直接依赖 Hub model / local registry | 复制 capability truth 和生命周期。 | 只经 runtime controlled ref/safe summary。 |
| L2 直接依赖 Sandbox client/model | 把 execution truth 和 mapping 写入核心。 | 只经 runtime logical seam;mapping/receipt blocked。 |
| Governance policy package / local allowlist | 默认关闭 authorization owner/source 缺口。 | `DB-L2T-003` 保持不适用 / owner-pending。 |
| SDK package / client DTO 定义 server contract | 形成层级循环和第二服务端 truth。 | `DB-L2T-008` 保持 future/excluded。 |
| Bus client 作为工具执行路径 | Bus 只拥有传递 truth。 | 仅 post-truth event collaboration。 |
| Observability emitter/store 直接依赖 | 观察模型反向定义 result/audit,并伪造 route。 | 保留经 event carrier 的逻辑协作;positive route blocked。 |
| MCP/A2A/API provider registry 直连 | 绕过 Hub,吸收 endpoint/secret/route/quota。 | 经 Hub 和后续受控 adapter seam,不形成当前直边。 |

---

## 4. 设计取舍

### 4.1 内部角色取舍

- 采用 `E -> F -> K` 的单向定义保护结构,其中 `K` 同时保护核心语义与 `S1` 的正式演进 / 影响不变量,而不是 controller/service/repository 等实现分层。
- `D` 和 `T` 都朝内服从 `K`;这表示架构定义权,不表示函数调用或运行时数据流。
- `P1~P6` 属于 `E/F/D` 可受控消费的影子边界,不能被核心直接视为外部 truth 本体。

### 4.2 跨仓裁剪取舍

- 全局矩阵中的“按需 SDK”被当前正式 00 进一步裁剪为 future/excluded,因此不进入当前分类表或图。
- Observability 当前保留 event collaboration,但依赖图通过 `L4-observability -> L0-bus` 表达正式 carrier 关系,不画 `L2-tools -> Observability` direct route。
- Sandbox 双向能力协作仍按 L2 消费 isolation provider 的 runtime 关系记一条依赖类型;不会因双向材料形成第二条或第四类依赖。

### 4.3 倒置表达取舍

- 本步只用“正式边界、ref、snapshot、safe summary、relation、event collaboration”表达倒置。
- 不命名 Port、adapter、client、repository、DTO 或 event,防止开放合同在架构阶段被实现词汇伪闭口。

---

## 5. 结构化中间产物

### 5.1 内部依赖方向图

#### 图类型

架构责任层依赖方向图。

#### 图标题

L2-tools 单向依赖保护结构。

```text
+====================================================+
|                L2-tools 依赖边界                   |
|                                                    |
|  +------------------------------+                  |
|  | E 外部接缝角色               |                  |
|  +---------------+--------------+                  |
|                  | 边界接入                         |
|                  v                                  |
|  +------------------------------+                  |
|  | F 正式承接角色               |                  |
|  +---------------+--------------+                  |
|                  | 允许依赖                         |
|                  v                                  |
|  +------------------------------+                  |
|  | K 核心/正式支撑语义角色      |                  |
|  +------------------------------+                  |
|          ^                ^                        |
|          | 允许依赖       | 允许依赖               |
|  +-------+--------+ +-----+------------------+     |
|  | D 派生/维护角色 | | T 技术承载角色        |     |
|  +----------------+ +------------------------+     |
+====================================================+
```

- 箭头表达允许的架构依赖和定义权方向,不表达调用、数据流、时序或代码 import。
- 外部事实只能经 `E/F` 进入;核心不依赖 sibling 实现或其物理模型。
- `D/T` 向内服从核心语义,不得反写或反向定义 `K`。
- Core compile authority 仍通过正式共享边界进入,具体 Tools package/type 未在本图定稿。

### 5.2 层间约束

| 架构责任层 / 依赖角色 | 允许依赖 | 禁止依赖 | 说明 |
|---|---|---|---|
| `E` 外部接缝 | 正式外部 owner 的允许 contract/ref/snapshot/safe summary;`F`。 | 外部正文直接进入 `K/T1/T2`;未闭口 provider/schema/route。 | 隔离外部模型和失败语义。 |
| `F` 正式承接 | `K` 正式规则;允许的 `E/P` 输入。 | 直接按外部状态写核心;绕过受理 / 前置 / outcome 规则。 | 所有正式变化经核心语义收口。 |
| `K` 核心 / 正式支撑语义 | 本仓规则;Core 正式共享类别;经倒置边界得到的可验证事实。 | Hub/Auth/Sandbox/Runtime/Bus/Obs/SDK/provider 实现和正文。 | 保护 `A1~A5` 独立 owner 与 `S1` 的正式演进 / 影响不变量。 |
| `D` 派生 / 维护 | `K` 只读 truth;允许 `P` ref/snapshot。 | 直接写 `K/T1/T2`;修正 A1/A2/A5/S1;外部 recovery。 | 只承接 `S2/S3`;派生可滞后、重建,变化重入 `F/K`。 |
| `T` 技术承载 | `K` 定义的语义和承载需求。 | 用数据库、缓存、broker、搜索或 client 模型定义业务状态。 | 技术实现服从核心,不是 truth owner。 |

### 5.3 按架构单元的依赖规则

| 单元 | 允许依赖 | 禁止依赖 | 倒置 / 接入边界 |
|---|---|---|---|
| `A1` | 本仓合同规则;Core 正式共享类别。 | Hub/Sandbox/Runtime/SDK/provider/inventory 实现。 | `P1` 只提供正式 authority/ref,不默认持久化。 |
| `A2` | `A1`;Hub 正式 controlled view/ref。 | Hub model/body、本地 registry/allowlist、authorization。 | 经 `P2` 和 `E/F` 消费,影响调用的判断由 A2 形成。 |
| `A3` | `A1`;适用 `A2`;允许 caller/work/trace refs。 | Runtime plan/loop/raw body;carrier 私有合同。 | 经 `P5` 和正式入口承接,各 ref 保留自身 owner。 |
| `A4` | `A3`;正式 auth / Sandbox 允许输入。 | Governance/Sandbox 源码模型;decision/run/capture/receipt truth。 | `P3` owner-pending 缺失即 gap/fail closed;`P4` mapping/receipt open。 |
| `A5` | `A3/A4`;正式 execution source ref;本地 outcome 规则。 | Raw capture/provider body;Bus/Obs store;Runtime recovery。 | 经 `P4/P6` 受控读取;safe output 附着 current event carrier。 |
| `S1` | `A1/A3/A5` 正式事实和同一 `K` 语义不变量。 | 直接改写当前 definition、另建 current definition truth 或经 `D` 旁路写入。 | 正式变化必须回到 `F -> K/A1`;演进 / 兼容影响历史由 `S1` 记录并保持可追溯。 |
| `S2` | `A1~A5` 只读事实;`P1~P6` 允许 refs。 | 修正 binding、外部 truth 或核心终态。 | 仅检测 / 对账 / 追溯,问题经正式边界重入。 |
| `S3` | 核心 truth 只读;允许 `P6` 材料。 | 裁决 safe eligibility、记录 local attempt、声明 delivered/observed。 | 只读组装 / 派生 / 消费辅助。 |
| `P1` | Core 正式 contract authority。 | 私造 Tools-specific package/type;运行时外部正文。 | 唯一 compile seam,来源未闭口时保持候选。 |
| `P2` | Hub controlled snapshot/ref。 | Registry/descriptor/exposure/applicability 正文或本地复制。 | Runtime seam,stale/conflict 时由 A2 fail closed。 |
| `P3` | 未来正式 authorization result ref/safe summary。 | 无来源时伪造 snapshot;本地 decision。 | Owner-pending 逻辑位置,当前允许 missing/unverifiable gap。 |
| `P4` | Sandbox consumption-time readiness/source ref。 | Ready/accepted/receipt/run/capture/cleanup truth。 | Runtime logical seam,mapping/carrier/receipt 保持 open。 |
| `P5` | Caller/actor/work/trace 正式 refs。 | 将不同 owner 全归 Runtime;保存 plan/checkpoint/recovery 正文。 | 各 ref 经正式来源进入,不形成统一外部 truth。 |
| `P6` | Bus delivery 与 Observability observation/material refs 分别承接。 | Direct Obs route;合并 delivered/observed;外部正文。 | Bus current event seam;Obs logical pending consumer,两类状态分离。 |

### 5.4 本仓依赖裁剪表

| 关联项目 | 全局关系 | 本仓角色 | 依赖类型 | 是否进入当前文档主链 | 裁剪理由 |
|---|---|---|---|---|---|
| `L0-core` | L2-tools 基础 contract 关系 | 依赖方 | 编译期依赖 | 是 | 只消费正式 shared categories;Tools-specific schema/package authority 仍 pending。 |
| `L3-capability-hub` | L2-tools 运行期消费 capability | 依赖方 | 运行期依赖 | 是 | 只消费 controlled ref/safe summary,不复制 registry。 |
| `L4-sandbox` | Isolation execution provider | 依赖方 | 运行期依赖 | 是 | Sandbox-required 场景消费执行能力和 source refs;material 附着同一 runtime carrier。 |
| `L2-runtime` | Runtime 运行期消费 Tools | 被依赖方 | 运行期依赖 | 是 | 直接消费者,不反向定义工具 truth。 |
| `L0-bus` | 工具安全变化按需进入 Bus | 协作方 | 事件协作依赖 | 是 | 只承接 post-truth safe material,拥有 delivery truth。 |
| `L4-observability` | 经 Bus 消费安全观察材料 | 协作方 | 事件协作依赖 | 是 | 当前只成立 event collaboration boundary;Tools-specific producer/source/route/readiness 仍 blocked。 |
| `L1-governance` | 全局矩阵无 L2-tools 确定直边 | 依赖方 | 不适用 | 否 | 仅 owner-pending authorization 候选,不得从领域职责推导当前直边。 |
| `L0-sdk` | 未来封装正式服务端工具合同 | 被依赖方 | 不适用 | 否 | Future/excluded;Tools-specific client seam 未成立。 |

### 5.5 本仓依赖类型分类表

| 依赖类型 | 关联项目 | 本仓如何使用 / 提供能力 | 后续文档落点 |
|---|---|---|---|
| 编译期依赖 | `L0-core` | 使用正式 shared identity/context/error/trace/metadata/envelope 类别。 | `02/03/07`;authority 闭口前不定具体 package/type。 |
| 运行期依赖 | `L3-capability-hub`;`L4-sandbox`;`L2-runtime` | 消费 capability / isolation seam,向 Runtime 提供工具合同和 outcome。 | `02~05/07`;不得写 package dependency。 |
| 事件协作依赖 | `L0-bus`;`L4-observability` | 交接 post-truth safe material;Obs positive route 继续 blocked。 | `02~05/07`;不得写 package dependency。 |

### 5.6 本仓禁止依赖表

| 禁止依赖 | 禁止原因 | 正确协作方式 |
|---|---|---|
| `L2-tools -> L0-sdk` 源码 / package | Client 反向定义 server truth并形成层级循环。 | SDK future 经正式服务边界封装。 |
| `L2-tools -> Hub` 源码 / model | 复制 capability truth 和 lifecycle。 | Runtime controlled view/ref/safe summary。 |
| `L2-tools -> Sandbox` 源码 / model | 吸收 execution truth、mapping 和生命周期。 | Runtime logical handoff/source seam。 |
| `L2-tools -> Governance` 源码 / Policy | 自行关闭 owner/source 缺口并吸收 decision truth。 | Owner-pending 正式 result ref/safe summary;fail closed。 |
| `L2-tools -> Runtime` 源码 | 反向吸收 agent loop、planning 和 recovery。 | Runtime 消费 L2 正式服务边界。 |
| `L2-tools -> Bus` 作为执行链 | Bus 只拥有传递 truth。 | 本地 truth 后通过 event collaboration 输出安全材料。 |
| `L2-tools -> Observability` direct store / route | 观察模型反向定义 result/audit,且 route 未成立。 | 经正式 event carrier 的逻辑安全消费。 |
| `L2-tools -> external registry/provider` 作为本地 truth | 绕过 Hub并吸收 endpoint/secret/route/quota。 | Hub controlled ref + 后续受控执行适配。 |
| `L2-tools -> inventory/member-images/marketplace` 核心依赖 | 产品装配 / 分发不定义工具合同。 | 后续产品层正式消费或引用。 |
| 任一非 Core sibling path/package dependency | 破坏层级和 truth isolation。 | Runtime boundary、event collaboration、safe ref/summary。 |
| 派生 / 技术角色反写核心 | 形成第二 truth 或由技术产品定义语义。 | 只读派生;正式变化经 `F -> K`。 |

### 5.7 依赖裁剪图: L2-tools

```text
Global baseline
  |
  | crop only L2-tools related edges
  v
L2-tools --[compile]--> L0-core
L2-tools --[runtime]--> L3-capability-hub
L2-tools --[runtime]--> L4-sandbox
L2-tools --[event]----> L0-bus

L4-observability --[event]--> L0-bus
L2-runtime ------[runtime]--> L2-tools
```

- 本图只展示 `L2-tools` 相关依赖边,不展示全 27 仓。
- `[compile]` 仅适用于 Core;`[runtime]` 和 `[event]` 不得写成 package dependency。
- 箭头按消费者指向 provider 表达依赖 / 消费关系,不表示调用、材料或事件传播时序。
- Authorization owner 和 SDK 分别为 owner-pending、future/excluded,不进入当前图。
- Observability 经 Bus 形成事件协作,图不授权 L2 direct producer/source/route。

### 5.8 架构单元依赖停审

| 单元范围 | 允许方向清楚 | 禁止方向清楚 | Runtime/event 未误写 compile | Pending/open 保留 | 结论 |
|---|---|---|---|---|---|
| `A1` | 是 | 是 | 是 | Core authority pending | pass |
| `A2` | 是 | 是 | 是 | Hub details open | pass |
| `A3` | 是 | 是 | 是 | Runtime contract later | pass |
| `A4` | 是 | 是 | 是 | Auth/Sandbox open | pass |
| `A5` | 是 | 是 | 是 | Sandbox/Obs open | pass |
| `S1` | 是 | 是 | 是 | 正式演进 / 影响不变量未旁路 A1 | pass |
| `S2~S3` | 是 | 是 | 是 | 派生 / 外围状态未升格 | pass |
| `P1~P6` | 是 | 是 | 是 | P3/P4/P6 状态诚实 | pass |

### 5.9 跨依赖边界审计

| 检查项 | 结果 | 说明 |
|---|---|---|
| 内部反向依赖 | 无 | E/F/K/D/T 定义权单向朝内。 |
| 派生 / 技术反写 | 禁止 | D/T 不定义 K;S1 正式变化经 F/K/A1 收口。 |
| Runtime/event 误写 compile | 无 | 只有 Core 为 compile。 |
| 第四种 handoff dependency | 无 | Sandbox material 附着 runtime,Bus/Obs material 附着 event。 |
| Pending/future 升格 | 无 | Governance/Auth 与 SDK 不进入当前图 / 分类表。 |
| Observability direct route | 无 | 通过 Bus 逻辑协作,positive route 仍 blocked。 |
| 外部 model/body 侵入 | 无 | 全部经 ref/snapshot/safe summary 倒置。 |
| 实现名词误作规则 | 无 | 未写 port/adapter/repository/handler 或包目录。 |
| 全局裁剪一致性 | pass | 三表与图使用同一当前关系子集。 |

---

## 6. 回填草稿

正式 01 第 8 章使用 §5.1 内部依赖图、§5.2 层间约束、§5.4~5.7 裁剪三表与裁剪图,并保留“只有 Core 可为 package dependency”“Obs 无 direct route”“Auth/SDK 不进入当前图”说明。

---

## 7. 待确认事项

依赖类型已经闭合,具体正向合同仍未闭合。`L2T-UP-001~009` 不阻塞本 Step,但继续阻塞 Core Tools-specific package/type、authorization provider、Sandbox mapping/carrier/receipt、Observability producer/route 和 SDK client 的实现依赖被确认。

---

## 8. 自检与门禁

| 检查项 | 结果 |
|---|---|
| 是否形成内部角色与单向依赖 | pass |
| 是否逐架构单元定义并停审 | pass |
| 是否输出固定裁剪三表和合规图 | pass |
| 是否仅使用 compile/runtime/event | pass |
| 是否只有 Core 可进入 package dependency | pass |
| 是否保留 pending/future/open | pass |
| 是否完成跨依赖审计 | pass |

```text
current_step = Step 7 dependency_direction completed
gate_status = pass
gate_reason = internal dependency roles, per-unit rules and cropped compile/runtime/event relationships passed cross-boundary audit
next_allowed_action = create_and_complete_01_arch_step_08_data_ownership_consistency
formal_document_write_allowed = false
commit_required = false
```
