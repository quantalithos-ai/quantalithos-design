# Step 7. 依赖方向与层间约束

> 对应 SOP: `standards/document/架构设计讨论流程_SOP.md` Step 7
> 对应书写规范: `standards/document/架构设计书写规范.md` §4.8
> 依赖 authority: `standards/document/全局项目依赖关系与裁剪规则.md`
> 回填位置: 正式 `01-架构设计.md` §8
> 日期: 2026-08-22
> 当前状态: `pass`;BC-L2M-01~07 dependency 与 cross-dependency audit 全部通过
> 串行门禁: BC01~07 逐单元停审和跨依赖审计完成前,禁止创建 Step 8

## 1. 本步输入与禁区

| 输入 | 本步承接 |
|---|---|
| Step 5 BC-L2M-01~07 | 每个架构单元的语义职责、shadow boundary 与关系。 |
| Step 6 RU-L2M-01~08 | 入口、truth、Runtime boundary、handoff、projection、storage responsibility。 |
| 正式 00 §6 / §12 | 跨仓裁剪、依赖分类、禁止依赖和能力面。 |
| 全局依赖裁剪规则 §2 / §4 / §5 / §6 | compile / runtime / event 三类 authority 与固定输出格式。 |
| L1-governance Step 7 粒度 | 参考核心语义、承接、外部接缝、派生辅助、技术承载五类依赖角色。 |

本步不写代码目录、crate / package 名、trait / repository / handler 名、API、event schema、数据库或调用时序。`ref` 是 runtime / event / build 协作中的受控材料形态,不是第四类跨仓依赖;adapter 是倒置实现边界;fake 只可替代 boundary 做测试,不表示真实集成。

## 2. 架构责任层 / 依赖角色

| 层 / 角色 ID | 架构责任 | 允许依赖 | 禁止依赖 |
|---|---|---|---|
| `DL-L2M-01` Member Core Semantics | BC01~05 的决定、状态责任、不变量与统一语言 | Core shared primitives / local semantic rules | transport、host / Runtime / Bus / Governance / Tools 实现、projection、database 产品。 |
| `DL-L2M-02` Use-case Coordination | 承接 entry / consumption / handoff / continuation,组织 local commit 与 boundary result | Core Semantics、正式 inward boundary contract | 绕过 core 直接写 truth;以下游 result 定义本地成功。 |
| `DL-L2M-03` External Boundary Seams | 把 host / Bus / Runtime / Work / Identity / Governance / Tools 等翻译为本地 ref / snapshot / result / gap | Core 定义的共享契约与本仓需要的 inward boundary | 外部 schema / SDK / transport 侵入 Core Semantics;通用外部 adapter。 |
| `DL-L2M-04` Derived Consumption | BC07 projection、diagnostic / explanation / safe read,只消费 committed source | Core committed fact / trace ref、BC06 freshness | 反写 core / mirror;成为 authorization、registry 或 external truth。 |
| `DL-L2M-05` Technical Carriers | state responsibility、outbox / handoff、projection carrier、调度与物理 adapter 的候选承载 | inward contract、Core shared primitives | 以 DB / queue / scheduler / process manager 定义业务语义。 |

允许方向概括为:入口 / adapter / technical carrier 依赖 inward contract,coordination 依赖 core semantics,derived consumption 依赖 committed facts;Core Semantics 不反向依赖任何外层或具体产品。

## 3. 依赖方向图

```text
+=====================================================================+
|                 L2-member dependency direction                      |
+=====================================================================+
|                                                                     |
|  External systems / transports / technical products                 |
|                 |                         |                         |
|                 v                         v                         |
|  +---------------------------+  +---------------------------+      |
|  | External Boundary Seams   |  | Technical Carriers        |      |
|  +-------------+-------------+  +-------------+-------------+      |
|                | inward contract               | inward contract    |
|                +---------------+---------------+                    |
|                                v                                    |
|                   +---------------------------+                     |
|                   | Use-case Coordination     |                     |
|                   +-------------+-------------+                     |
|                                 |                                   |
|                                 v                                   |
|                   +---------------------------+                     |
|                   | Member Core Semantics     |                     |
|                   +-------------+-------------+                     |
|                                 | committed facts                   |
|                                 v                                   |
|                   +---------------------------+                     |
|                   | Derived Consumption       |                     |
|                   +---------------------------+                     |
|                                                                     |
+=====================================================================+
| Core Semantics compile candidate: L0-core only                       |
+=====================================================================+
```

图示说明:

- 箭头表示允许的依赖方向,不表示调用、事件、部署或执行顺序。
- External Boundary 和 Technical Carrier 的具体实现都依赖本仓 inward contract,不能反向定义 core。
- Derived Consumption 只依赖 committed fact / ref,Core Semantics 不依赖 projection。
- 跨仓中只有 L0-core 可成为 compile dependency;其他箭头必须留在 runtime / event boundary。

## 4. 架构单元依赖停审计划

| 顺序 | 单元 | 状态 | 下一动作 |
|---:|---|---|---|
| 1 | BC-L2M-01 Presence and Host Collaboration | pass | BC02 |
| 2 | BC-L2M-02 Inbound Boundary | pass | BC03 |
| 3 | BC-L2M-03 Runtime Mediation | pass | BC04 |
| 4 | BC-L2M-04 Outbound Boundary | pass | BC05 |
| 5 | BC-L2M-05 Interaction Trace | pass | BC06 |
| 6 | BC-L2M-06 External Context Mirror | pass | BC07 |
| 7 | BC-L2M-07 Member Read Model | pass | cross audit |
| 8 | cross-dependency audit + crop tables | pass | Step 8 allowed |

## 5. BC-L2M-01 依赖规则

| 维度 | 结论 |
|---|---|
| 所属依赖角色 | Core Semantics + Use-case Coordination;外部解析经 External Boundary / BC06。 |
| 允许内部依赖 | Core shared primitives;BC06 已翻译的 subject / identity / credential / host ref resolution result。 |
| 允许被依赖 | BC02 / BC03 / BC04 消费 committed presence context;BC05 / BC07 消费 committed ref。 |
| 禁止内部依赖 | BC07 projection、host / Identity / Work SDK / schema、process manager、credential product、Runtime state。 |
| 必须倒置 | Work / Identity ref resolution、credential verification、host collaboration transport / feedback。 |
| 外部接入 | 经 External Boundary Seam 转换为 source-anchored ref / safe result / gap;不得直写 presence。 |

### 5.1 单元停审

| 检查项 | 结果 |
|---|---|
| 层级与 inward direction 是否清楚 | pass |
| Core 是否直接依赖 host / Work / Identity implementation | pass:未依赖 |
| runtime / ref 关系是否误写 package dependency | pass:未误写 |
| projection 是否反向进入 presence | pass:未进入 |
| adapter / repository / handler 是否被当架构规则 | pass:未使用 |

`BC-L2M-01 dependency gate = pass`。下一允许单元仅为 BC-L2M-02。

## 6. BC-L2M-02 依赖规则

| 维度 | 结论 |
|---|---|
| 所属依赖角色 | Core Semantics + Use-case Coordination;event / rule 输入经 External Boundary / BC06。 |
| 允许内部依赖 | BC01 committed subject / presence context、BC06 已翻译 fact / rule source resolution、Core shared primitives。 |
| 允许被依赖 | BC03 消费 screened controlled context;BC05 / BC07 消费 committed screening ref / summary source。 |
| 禁止内部依赖 | Bus implementation / route、Governance schema / engine、Runtime adapter、BC07 diagnostics、raw body store。 |
| 必须倒置 | Bus fact intake、Policy result / safe snapshot receipt、授权瞬时 inspection material access。 |
| 外部接入 | External Boundary 只能提供 source-anchored ref / snapshot / transient inspection window / gap;不能提交 screening conclusion。 |

### 6.1 单元停审

| 检查项 | 结果 |
|---|---|
| Core 是否只依赖本地语义和已翻译输入 | pass |
| Bus / Governance / Runtime 是否直接侵入 | pass:未侵入 |
| transient body access 是否被误写持久依赖 | pass:未误写 |
| event / runtime 关系是否写成 package dependency | pass:未写 |
| diagnostic / projection 是否反向定义 screening | pass:未定义 |

`BC-L2M-02 dependency gate = pass`。下一允许单元仅为 BC-L2M-03。

## 7. BC-L2M-03 依赖规则

| 维度 | 结论 |
|---|---|
| 所属依赖角色 | Core Semantics + Use-case Coordination;Runtime transport 实现位于 External Boundary。 |
| 允许内部依赖 | BC02 screened controlled context、BC01 committed presence context、BC06 Runtime ref / freshness result、Core shared primitives。 |
| 允许被依赖 | BC04 消费 committed material reception ref;BC05 / BC07 消费 delivery / gap committed ref。 |
| 禁止内部依赖 | `L2-runtime` package / internal objects、IPC implementation、Runtime state store、Tools / Sandbox / model adapters、BC07 projection。 |
| 必须倒置 | Runtime entry submission、result correlation、committed material receipt、boundary availability / backpressure expression。 |
| 外部接入 | Runtime adapter 只能返回 transport-neutral accepted / rejected / unknown ref 或 safe material ref;不能写 member decision。 |

### 7.1 单元停审

| 检查项 | 结果 |
|---|---|
| Runtime package / internal model 是否进入 member Core | pass:未进入 |
| screening / delivery / Runtime acceptance 是否依赖方向清楚 | pass |
| transport / schema / backpressure 是否保持 boundary pending | pass |
| BC04 / BC07 是否反向定义 mediation | pass:未定义 |
| runtime relation 是否误写 compile dependency | pass:未误写 |

`BC-L2M-03 dependency gate = pass`。下一允许单元仅为 BC-L2M-04。

## 8. BC-L2M-04 依赖规则

| 维度 | 结论 |
|---|---|
| 所属依赖角色 | Core Semantics + Use-case Coordination;Bus / downstream handoff 位于 External Boundary / Technical Carrier。 |
| 允许内部依赖 | BC03 committed material reception ref、BC01 subject / presence context、BC06 target / route / feedback resolution、Core shared primitives。 |
| 允许被依赖 | BC05 / BC07 消费 outbound / attempt / gap committed ref;RU05 coordination 执行 handoff。 |
| 禁止内部依赖 | Bus SDK / backend、Conversation / Artifact / Observability write model、provider / MCP / A2A / API adapter、BC07 projection。 |
| 必须倒置 | safe material handoff、Bus publication、external feedback receipt、target / route resolution。 |
| 外部接入 | adapter / event boundary 只提交 material 或返回 local receipt / external ref / gap;不得写 outbound decision 或 delivered truth。 |

### 8.1 单元停审

| 检查项 | 结果 |
|---|---|
| Outbound Core 是否依赖 Bus / downstream implementation | pass:未依赖 |
| Runtime ref 是否只从 BC03 进入 | pass |
| provider / capability adapter 是否越界 | pass:未进入 |
| event relation 是否误写 package dependency | pass:未误写 |
| projection / external feedback 是否反向定义 decision | pass:未定义 |

`BC-L2M-04 dependency gate = pass`。下一允许单元仅为 BC-L2M-05。

## 9. BC-L2M-05 依赖规则

| 维度 | 结论 |
|---|---|
| 所属依赖角色 | Core Semantics;safe material handoff 由 Use-case Coordination / External Boundary 承接。 |
| 允许内部依赖 | BC01~04 committed fact ref、BC06 external ref resolution marker、Core trace / metadata primitives。 |
| 允许被依赖 | BC07 消费 trace / gap / safe material committed ref;RU05 handoff coordination 消费 safe material。 |
| 禁止内部依赖 | Observability SDK / backend / store、logging product、Evidence / report system、BC07 query model、source context mutable model。 |
| 必须倒置 | observation / audit material handoff、external receipt / observed feedback、trace physical carrier。 |
| 外部接入 | backend adapter 只能接受 safe material 并返回 local receipt / external ref / gap;不得把 observed 状态写成 trace source truth。 |

### 9.1 单元停审

| 检查项 | 结果 |
|---|---|
| Trace 是否只依赖 committed ref 而非 source mutable model | pass |
| Observability / log / evidence implementation 是否进入 Core | pass:未进入 |
| trace carrier 是否服从 inward contract | pass |
| event / handoff relation是否写成 compile dependency | pass:未写 |
| BC07 是否反向修改 trace | pass:未修改 |

`BC-L2M-05 dependency gate = pass`。下一允许单元仅为 BC-L2M-06。

## 10. BC-L2M-06 依赖规则

| 维度 | 结论 |
|---|---|
| 所属依赖角色 | External Boundary support semantics;source-specific adapters 位于 External Boundary / Technical Carrier 并依赖 inward contract。 |
| 允许内部依赖 | Core shared ref / metadata / error primitives、本地 resolution / freshness / gap rules。 |
| 允许被依赖 | BC01~05 的 coordination 消费 neutral resolution / snapshot result;BC07 消费 freshness / gap marker。 |
| 禁止内部依赖 | 任一 sibling package / SDK / private schema、external registry、provider / MCP / A2A / API adapter、BC07 presentation model。 |
| 必须倒置 | source ref resolver、safe snapshot receipt、external feedback receipt、source-specific translation。 |
| 外部接入 | 每个 source-specific adapter 只实现本仓 inward boundary,输出 neutral ref / snapshot / state / gap;不得输出 source body 或创建业务决定。 |

### 10.1 单元停审

| 检查项 | 结果 |
|---|---|
| BC06 是否依赖 external SDK / schema / registry | pass:未依赖 |
| source-specific adapter 是否依赖 inward boundary | pass |
| ref / snapshot 是否被误作 compile dependency 类型 | pass:未误作 |
| BC06 是否成为通用 integration / capability hub | pass:未成为 |
| Core contexts 是否依赖 BC06 implementation 而非 neutral result | pass:只消费 neutral result |

`BC-L2M-06 dependency gate = pass`。下一允许单元仅为 BC-L2M-07。

## 11. BC-L2M-07 依赖规则

| 维度 | 结论 |
|---|---|
| 所属依赖角色 | Derived Consumption;projection / read carrier 位于 Technical Carrier 并依赖 inward projection contract。 |
| 允许内部依赖 | BC01~05 committed fact / trace ref、BC06 freshness / gap marker、Core shared primitives。 |
| 允许被依赖 | 只读 consumer boundary 可消费 body-free projection;核心 / mirror 不得依赖 BC07。 |
| 禁止内部依赖 | source mutable model / write boundary、Tools / method body / registry、SDK / UI product、external query store 语义。 |
| 必须倒置 | projection carrier、rebuild trigger、read delivery、downstream SDK / product binding。 |
| 外部接入 | consumer 只能读取 projection / freshness / gap;任何 change intent 必须回到拥有该 truth 的正式 entry,不能通过 read model 写回。 |

### 11.1 单元停审

| 检查项 | 结果 |
|---|---|
| 是否只单向依赖 committed source | pass |
| Core / BC06 是否反向依赖 projection | pass:未依赖 |
| SDK / UI / store 是否定义 projection 语义 | pass:未定义 |
| capability outlet 是否引入 Tools / method package | pass:未引入 |
| rebuild / reconciliation 是否可写 truth | pass:不可写 |

`BC-L2M-07 dependency gate = pass`。七个单元依赖规则均已停审;下一允许动作仅为跨依赖边界审计和固定格式裁剪输出。

## 12. 本仓依赖裁剪表

| 关联项目 | 全局关系 | 本仓角色 | 依赖类型 | 是否进入当前文档主链 | 裁剪理由 |
|---|---|---|---|---|---|
| `L0-core` | L2-member 编译期依赖 | 依赖方 | 编译期依赖 | 是 | 唯一 compile candidate;共享 ID / ref / metadata / error 与 envelope / trace authority,member-specific schema 仍 pending。 |
| `L0-bus` | 订阅 / 发布成员运行事件 | 协作方 | 事件协作依赖 | 是 | 入站事实与出站 / 观测 material 主干;delivery truth 外置。 |
| `L2-runtime` | member-service / runtime IPC 边界 | 协作方 | 运行期依赖 | 是 | controlled entry / result ref / committed safe material;mapping pending,不得 package。 |
| `L2-member-service` | member host lifecycle / IPC boundary | 协作方 | 运行期依赖 | 是,pending | host context 与 request / signal / report 协作;正式 00 未停审,字段 / transport / credential pending。 |
| `L1-work` | ProjectMember truth source | 依赖方 | 运行期依赖(ref form) | 是 | ProjectMemberRef 执行主语;不引入 Work lifecycle / package。 |
| `L1-identity` | GlobalMember truth source | 依赖方 | 运行期依赖(ref form) | 是 | GlobalMemberRef 身份锚;不引入 Identity lifecycle / credential body。 |
| `L1-governance` | Policy / Decision truth source | 依赖 / 协作方 | 运行期 + 事件协作依赖 | 是 | 消费 Policy effective result / safe snapshot;unknown 保守处置。 |
| `L2-tools` | 工具行动契约 owner | 依赖方(弱) | 运行期依赖(ref form) | 是,可裁剪 | 只为 capability outlet 消费 contract / definition safe ref;不依赖 invocation / execution package。 |
| `L3-method-library` | method definition source | 依赖方(弱) | 运行期依赖(ref form) | 是,可裁剪 | 只为 capability outlet 消费 definition ref;不复制 body。 |
| `L1-conversation` | 对话真相下游 | 被依赖 / 协作方 | 事件协作依赖 | 是,输出侧 | 经正式事件边界消费 body-free material;member 不直写 conversation。 |
| `L4-observability` | 观测材料消费方 | 被依赖 / 协作方 | 事件协作依赖 | 是,输出侧 | 消费 low-sensitive material;observed / backend truth 外置。 |
| `L2-member-images` | member component 静态打包 / pinned supply | 被打包方 | 不适用(构建供给关系,非运行依赖) | 否,仅部署边界说明 | 不进入 BC01~07 runtime truth;manifest / compatibility / readiness 属于 images 且 pending。 |
| `L0-sdk` / 产品层 | 下游封装 / 消费 | 被依赖方 | 下游运行消费 | 否,当前核心主链外 | 未来只读 member view;不反向成为 package dependency。 |
| `L3-capability-hub` / external MCP / A2A / API | capability / adapter owner | 禁止直连 | 禁止依赖 | 否 | member 不经营 registry 或 provider adapter;经 Runtime -> Tools 正式链或安全 ref。 |
| `L4-sandbox` | isolation truth owner | 禁止直连 | 禁止依赖 | 否 | member 不执行隔离或消费 backend;只允许未来正式上游 safe result。 |

## 13. 本仓依赖类型分类表

| 依赖类型 | 关联项目 | 本仓如何使用 / 提供能力 | 后续文档落点 |
|---|---|---|---|
| 编译期依赖 | `L0-core` | shared primitive / ref / metadata / error / envelope / trace authority;准确 symbol 待 03 / 07 骨架收敛 | 03 详细设计 / 07 实施计划 |
| 运行期依赖 | Runtime、member-service、Work、Identity、Governance、Tools / method(弱) | 通过 inward seam 消费能力 / ref / safe snapshot / result,提供 local material / request / status | 01 / 02 / 03 / 04 |
| 事件协作依赖 | Bus、Governance、Conversation、Observability | 入站 fact / rule result 与出站 interaction / observation material;delivery / observed 外置 | 01 / 03 / 04 / 05 |

### 13.1 Seam 形式矩阵

| 术语 | 性质 | 可以做什么 | 绝不能伪装成什么 |
|---|---|---|---|
| `compile` | 跨仓依赖类型 | 后续 package 可引用 Core 正式 shared contract | 未闭口 member-specific schema 或 sibling package。 |
| `runtime` | 跨仓依赖类型 | 经能力 boundary / adapter 交换 ref / snapshot / result | path dependency、共享可变 model 或集成已通过。 |
| `event` | 跨仓依赖类型 | 经 Bus 传播已提交 fact / material | 直接写外部 truth、delivery 成功或 package dependency。 |
| `ref` | runtime / event / build 关系的材料形态 | 保留 owner、scope、source、correlation | 第四类依赖、正文副本或 resolved = authorized。 |
| `adapter` | dependency inversion 的实现位置 | 将 source-specific transport / schema 翻译为 inward boundary | 核心语义、通用外呼能力或真实 readiness。 |
| `fake` | 测试替身 | 在后续测试中验证 inward boundary 与失败分类 | positive integration、外部 evidence、delivered / observed。 |

## 14. 本仓禁止依赖表

| 禁止依赖 | 禁止原因 | 正确协作方式 |
|---|---|---|
| `L2-member -> L2-runtime` package / internal model | 复制 run / outcome truth并形成跨仓编译耦合 | runtime seam + ref / safe material。 |
| `L2-member -> L2-member-service` package / host model | 吸收 registry / session / health / lifecycle | runtime seam + host refs / request / signal / report。 |
| `L2-member -> L0-bus` 业务 package | 把 delivery / backend 机制侵入核心 | event boundary / adapter;Core shared envelope authority only。 |
| `L2-member -> L1-work / L1-identity` package | 吸收 ProjectMember / GlobalMember lifecycle | runtime resolver + typed ref / safe summary。 |
| `L2-member -> L1-governance` package / policy engine | 形成第二 policy model / local allowlist | runtime / event result + safe snapshot。 |
| `L2-member -> L2-tools / L3-method-library` package | 复制 tool / method body与调用模型 | weak runtime ref / safe view,capability outlet 可裁剪。 |
| `L2-member -> L1-conversation / L1-artifact / L4-observability` package | 让正文 / evidence / observed truth 进入 member | event / handoff material + external ref。 |
| `L2-member -> L2-member-images` package | 静态构建供给反向进入运行语义 | pinned build supply boundary,由 images / host owner 协调。 |
| `L2-member -> L3-capability-hub / Sandbox / external provider` direct | 经营 registry / isolation / external adapter,绕过 Runtime -> Tools 链 | 正式上游 safe result / ref;否则禁止。 |
| `L2-member -> L0-sdk` reverse package | SDK 是下游封装边界 | 下游经 public / read boundary 消费。 |
| BC07 / report / query / reconciliation -> BC01~06 writes | 派生结构反写真相 | committed fact 单向派生 + rebuild。 |
| DB / cache / queue / scheduler / process manager -> Core semantics | 技术产品反向定义 truth / failure | Technical Carrier 实现 inward contract。 |

## 15. 依赖裁剪图

#### 依赖裁剪图: L2-member

```text
Global baseline
  |
  | crop only L2-member related edges
  v
 +-----------+ [compile]   +-------------------+   [runtime] +-------------+
 | L0-core   +------------>| L2-member         |<----------->| L2-runtime  |
 +-----------+             +---------+---------+             +-------------+
                                    ^  ^
            [runtime]               |  |               [runtime]
 work / identity / governance ------+  +------ member-service
             (ref / snapshot form)  |            (contract pending)
                                    |
              +---------------------+---------------------+
              | [event]                                   | [event]
              v                                           v
          +--------+                         conversation / observability
          | L0-bus |<-------------------------------- member material
          +--------+

 tools / method --[runtime]--> L2-member  (weak ref path; outlet optional)
```

图示说明:

- 本图只展示 L2-member 当前架构主链,不展示全 27 仓或静态 member-images 构建供给。
- `[compile]` 只有 `L0-core`;只有它可进入后续 package dependency 讨论。
- `[runtime]` / `[event]` 不得写成 package dependency;图中的 ref / snapshot 只是受控材料形态。
- Conversation / Observability 位于 event 输出消费侧;它们不反写 member truth。
- host / Runtime / member-specific route 的正向合同仍 pending,箭头不表示 integration ready。

## 16. 跨依赖边界审计

| 审计项 | 结果 | 说明 |
|---|---|---|
| 反向依赖 | pass | Core 不依赖 adapter / carrier / projection;BC01~06 不依赖 BC07。 |
| compile dependency 唯一性 | pass | 仅 L0-core;member-specific shared schema 仍 pending。 |
| runtime / event 误写 package | pass | 全部通过 inward seam / adapter / event / ref 表达。 |
| ref 误作第四类依赖 | pass | 仅标材料形态。 |
| adapter / repository 名词误作架构规则 | pass | 只使用 adapter 作为倒置位置;未定义具体实现对象。 |
| fake 伪装集成 | pass | fake 只定义测试替身上限。 |
| sibling pending 升格 | pass | service / images 正向合同继续 pending。 |
| external adapter 直穿 | pass | capability / provider / Sandbox 直边被裁剪。 |
| 历史技术回流 | pass | UDS / gRPC / Rust / supervisord / Bus guarantee 未进入依赖结论。 |
| 02 概要承接风险 | pass_with_constraint | 后续代码主体必须保留五类依赖角色和 BC boundaries,不得按旧 B1~B6 反向组织。 |

## 17. 结构化中间产物与回填草稿

- 架构依赖角色: `DL-L2M-01~05`。
- BC01~07 依赖停审: 7 / 7 pass。
- 跨仓依赖: Core compile;Runtime / host / Work / Identity / Governance / Tools / method runtime;Bus / Governance / downstream event。
- member-images 是 build supply 关系,不是运行依赖或 package。
- ref / adapter / fake 均已与 compile / runtime / event 分类分开。

正式 §8 回填依赖方向图、层间约束、裁剪表、类型分类表、Seam 形式矩阵、禁止表和裁剪图。过程停审 / historical audit 留在本文件;不得把 pending 箭头写成已实现 integration。

## 18. Step 7 总门禁

| 检查项 | 结果 |
|---|---|
| 每个架构单元是否定义允许 / 禁止 / 倒置 / external access | pass;7 / 7 |
| 每个单元是否独立停审 | pass;7 / 7 |
| 是否输出固定裁剪表、分类表、禁止表与 ASCII 图 | pass |
| 是否完成跨依赖审计 | pass |
| compile / runtime / event / ref / adapter / fake 是否分类清楚 | pass |
| 是否写代码目录、接口 schema、DB 或技术产品 | pass:未写 |
| Step 7 总门禁 | `pass` |

下一允许动作仅为创建 `01_arch_step_08_data_ownership_consistency.md`;正式 `01` 仍禁止修改。
