# Step 7. 依赖方向与层间约束

## 1. Step 状态

| 当前模块 | gate_status | gate_reason | next_allowed_action | source_files |
|---|---|---|---|---|
| `dependency_direction` | pass | 内部依赖向内、5 个架构单元逐项规则、跨仓裁剪、六类 seam 与禁止依赖已收敛;无 runtime / event / ref 误作 package dependency | 进入 Step 8 数据所有权与一致性 | `01_arch_step_05_bounded_context_subdomains.md`;`01_arch_step_06_container_deployment.md`;全局依赖裁剪规则 |

### 1.1 Step 内计划

- [x] 读取 ledger、01 flow、Step 5~6、架构 SOP Step 7、书写规范 §4.8 和全局裁剪规则。
- [x] 定义架构责任层 / 依赖角色,不使用代码目录或运行单元替代。
- [x] 形成单向向内依赖和必要边界倒置结论。
- [x] 按 BC-MI-01~05 逐个收敛允许 / 禁止依赖和外部接入方式。
- [x] 每个架构单元完成后执行依赖方向停审。
- [x] 按固定表裁剪本仓跨仓依赖子图。
- [x] 将 compile / runtime / event 与 ref / adapter / fake seam 双层分类。
- [x] 形成内部依赖图、跨仓裁剪图和 2~5 条说明。
- [x] 执行反向依赖、类型误判、adapter truth 和概要承接风险审计。

## 2. 本步输入

| 输入 | 本步承接 |
|---|---|
| Step 5 | BC-MI-01~05 与 LS-MI-01~04 的语义责任边界 |
| Step 6 | 同步 / 后台 / conditional async、正式 / 派生承载和外部运行边界 |
| 正式 00 DEP-MI-001~016 | 需求层仓际方向、global type 与 seam 线索 |
| 全局项目依赖关系与裁剪规则 | 编译期 / 运行期 / 事件协作基线和三表 / 图格式 |
| Current owner ledgers | 确认 closed boundary、pending exact seam 与 cropped relation |
| MI-UP-001~009 / Q-MI-001~004 | Active / conditional / future 依赖上限 |

## 3. SOP 问题回答

1. 本仓内部层次如何划分?

   回答:使用“核心语义角色、领域承接 / 编排角色、外部接缝角色、派生读取 / 维护角色、技术承载角色”五类依赖角色。它们不是 domain/application/adapter 代码目录,也不是 Step 6 运行单元。

2. 允许哪些依赖方向?

   回答:外部接缝、派生读取和技术承载都依赖本仓向内定义的边界;领域承接 / 编排依赖核心语义;核心只依赖本仓规则和经 Core 正式认定的 shared contracts。BC-MI-01 -> 02 -> 03 -> 04 的语义前置不能反向。

3. 禁止哪些反向依赖?

   回答:禁止 registry / builder / event / Artifact / consumer / projection / storage 产品定义 definition、candidate、eligibility 或 availability;禁止 BC-MI-04 状态反向改写 BC-MI-03 资格,BC-MI-03 反写 BC-MI-02 candidate,或 consumer result 反写 BC-MI-04 local truth。

4. 外部系统通过哪些边界接入?

   回答:Method / Member Service 经 runtime + ref boundary;components、seed、Artifact 与 registry refs 经 ref boundary;Bus 经 conditional event boundary;builder / registry / evidence / Artifact handoff 经 adapter boundary;测试替身只经 fake boundary。

5. 全局基线有哪些相关边,哪些进入主链?

   回答:Core compile authority、Method Library runtime、L2 component artifacts、Bus conditional event 和 Member Service consumer 方向进入主链;Artifact 是正式协作边;Sandbox / Observability / Capability Hub / SDK / L5 / L6 当前被裁剪或 future-only。

6. 哪些依赖必须倒置?

   回答:所有非 Core source、外部执行产品、storage、registry、evidence 和 consumer transport 都必须服从本仓 inward boundary contract;核心不得引用这些产品或 sibling source。MI-UP-004 未关闭时也不得在本仓 shadow Core image schema。

7. 每个单元是否已停审,跨依赖是否冲突?

   回答:BC-MI-01~05 均已检查允许依赖、禁止依赖、倒置位置和六类 seam;无反向依赖或类型误判,未闭口 exact seams 仍保持 pending。

## 4. 当前材料问题诊断

| 候选依赖写法 | 问题 | 当前处理 |
|---|---|---|
| `member-images` 直接依赖 Runtime / Tools / Member 源码 | 物理装配被错误升级为 package dependency | 只消费 pinned release ref |
| 内部 core 调用 Method Library / Registry SDK | 外部产品和 sibling contract 侵入核心 | 经 external seam + orchestration 转换为本地语义 |
| Bus event 到达即触发领域状态 | Carrier 被当成 truth / authority | Event 只提供待验证输入,MI-UP-005 前 unavailable |
| Registry tag / push result 决定 availability | Mutable backend projection 反向定义 supply truth | Registry 只提供 adapter outcome / immutable ref |
| Artifact handoff result 合并进 eligibility | 两域 owner 和失败语义混写 | BC-MI-03 与 Artifact ref / gap 分层 |
| Fake adapter 进入 production fallback | 用测试替身掩盖合同缺口 | Fake 只允许 isolated negative / parity cut |
| 按 handler -> service -> repo -> db 画依赖 | 实现结构替代架构责任 | 改为五类依赖角色 |

## 5. 改动前后对比

| 维度 | 候选口径 | 当前结论 |
|---|---|---|
| 内部层次 | 代码目录 / 服务调用 | 架构责任角色向内依赖 |
| Core | 可直接调用所有上游 SDK | 只认本地规则和正式 Core shared contracts |
| Sibling | Source / path dependency | Runtime / ref 或 ref-only seam |
| Event | 默认输入 / 输出 | Conditional inbound only;no outbound authority |
| Infra | SDK 类型渗入 domain | 外部接缝和技术承载依赖 inward contract |
| Fake | 无上限替代真实集成 | 仅测试切口,不能证明 readiness |
| Cross-unit | 流水线可逆更新 | BC01 -> BC02 -> BC03 -> BC04 单向前置,历史不反写 |

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 直接以 repo / SDK / infrastructure 组织核心依赖 | 实现快 | 强耦合、owner 反转、难以 fake-safe | 不采用 |
| 用经典层名作为唯一规则 | 熟悉 | 容易变成目录口号,不能解释跨仓裁剪 | 不采用 |
| 责任角色向内 + 跨仓双层类型分类 | 可保护 core 且完整覆盖 seam | 表格较多 | 采用 |
| 所有关系统一成 runtime API | 表面简单 | ref / event / adapter / fake 语义丢失 | 不采用 |
| 将 Core image schema pending 先本地复制 | 可提前编码 | 形成 shadow shared contract | 不采用 |

## 7. 结构化中间产物

### 7.1 内部依赖方向图

图类型:架构依赖方向图

图标题:L2-member-images 责任角色向内依赖

```text
+====================================================================+
|                    L2-member-images 依赖边界                       |
|                                                                    |
|  +--------------------------+      +-----------------------------+ |
|  | 外部接缝角色              |      | 派生读取 / 维护角色          | |
|  +-------------+------------+      +--------------+--------------+ |
|                | 边界接入                          | 允许依赖        |
|                v                                   v                |
|        +-------+-----------------------------------+--------+       |
|        |              领域承接 / 编排角色                   |       |
|        +-------------------------+--------------------------+       |
|                                  | 允许依赖                          |
|                                  v                                  |
|                     +------------+-------------+                    |
|                     | 核心语义角色             |                    |
|                     +------------+-------------+                    |
|                                  ^                                  |
|                                  | 允许依赖 inward contract          |
|                     +------------+-------------+                    |
|                     | 技术承载角色             |                    |
|                     +--------------------------+                    |
+====================================================================+
```

说明:

- 核心语义角色位于最内层,不依赖 sibling source、协议、storage 或基础设施产品。
- 外部接缝把外部 ref / event / adapter outcome 转为本仓可接受语义,不能绕过承接角色直接写 core truth。
- 派生读取 / 维护只依赖正式 truth,不得通过重建、对账或缓存反向改写核心。
- 技术承载服从本仓向内定义的承载边界,产品能力不能定义领域状态。
- 箭头表示允许依赖或边界接入,不表示调用、通信或执行时序。

### 7.2 层间约束

| 架构责任层 / 依赖角色 | 允许依赖 | 禁止依赖 | 说明 |
|---|---|---|---|
| 核心语义角色 | 本仓不变量、正式 Core shared contracts、经承接角色验证的本地值语义 | Sibling source、外部 body、event / adapter / storage / registry / consumer / fake 产品语义 | Definition、candidate、eligibility、availability 只能由本仓规则定义。 |
| 领域承接 / 编排角色 | 核心语义角色、inward seam contracts、正式状态读取 | 以 adapter success / projection / consumer state 覆盖核心判断 | 负责收束输入和推进用例,不发明上游 truth。 |
| 外部接缝角色 | 本仓 inward seam contract、外部正式 contract | 直接写核心、把外部 DTO / SDK / body 暴露给核心 | 负责防腐、验证和 conservative translation。 |
| 派生读取 / 维护角色 | 核心 truth、受控 ref / snapshot | 正式写路径、外部 body、consumer truth | Trace、projection、reconciliation 可失败 / 重建但不得反写。 |
| 技术承载角色 | 本仓 inward carrier contract 与正式状态语义 | 定义 revision / candidate / gate / availability 规则 | Storage / scheduler / registry 等只承载能力。 |

### 7.3 按架构单元组织的依赖规则

| 架构单元 | 允许依赖 | 禁止依赖 | 倒置 / 外部接入 |
|---|---|---|---|
| BC-MI-01 定义与装配基线 | 本地规则、BC-MI-05 提供的 verified mapping / component / seed refs | Method / component source、live body、mutable selector | Mapping / component / seed 均经 ref / runtime seam 转换 |
| BC-MI-02 构建意图与候选 | BC-MI-01 完整 revision、BC-MI-05 的 conservative execution outcome | Scheduler / builder / registry SDK truth、incomplete input | 外部执行经 adapter;registry ref 经 ref seam |
| BC-MI-03 Provenance 与资格 | BC-MI-02 candidate、本地 gate 规则、BC-MI-05 safe conclusions | Policy / evidence body、Artifact version / lineage、backend pass default | Gate / evidence / Artifact 经 ref / adapter seam |
| BC-MI-04 供给与入口 | BC-MI-03 eligibility、BC-MI-05 immutable ref / handoff gap | Registry mutable tag、container / consumer / product readiness | Registry / Artifact / consumer 经 ref / runtime / adapter seam |
| BC-MI-05 外部引用与派生维护 | Inward seam contracts、核心 truth 的只读语义 | 创建任何 BC-MI-01~04 positive truth、复制外部 body | 唯一外部防腐 / shadow 层;fake 仅挂这里的测试边界 |

### 7.4 架构单元依赖停审

| 单元 | 层级清楚 | 禁止依赖明确 | Runtime / event 未误作 package | 外部接入可保守失败 | gate_status |
|---|---|---|---|---|---|
| BC-MI-01 | pass | pass | pass | pass | pass |
| BC-MI-02 | pass | pass | pass | pass | pass |
| BC-MI-03 | pass | pass | pass | pass | pass |
| BC-MI-04 | pass | pass | pass | pass | pass |
| BC-MI-05 | pass | pass | pass | pass | pass |

### 7.5 本仓依赖裁剪表

| 关联项目 | 全局关系 | 本仓角色 | 依赖类型 | 是否进入当前文档主链 | 裁剪理由 |
|---|---|---|---|---|---|
| `L0-core` | L2 可消费共享契约 | 依赖方 | 编译期 | 是,条件型 | 只允许正式已认定 shared contracts;image-specific schema 受 MI-UP-004 限制。 |
| `L3-method-library` | L2 消费 method / role 定义 | 依赖方 | 运行期 | 是 | Mapping owner;只经 runtime + ref,不形成源码依赖。 |
| `L2-runtime` | L2 component artifact source | 依赖方 | 运行期 | 是 | 只消费 pinned release ref,不消费 loop / live state。 |
| `L2-tools` | L2 component artifact source | 依赖方 | 运行期 | 是 | 只消费 tools / extras release ref,不拥有 contract / execution。 |
| `L2-member` | Layer 3 sibling component source | 依赖方 | 运行期 | 是,pending | MI-UP-002 未闭口时 assembly positive lane blocked。 |
| `L2-member-service` | Layer 3 sibling consumer | 被依赖方 | 运行期 | 是,pending | 只提供 pinned entry;MI-UP-001 未闭口时无 positive launch / confirmation。 |
| `L1-artifact` | Artifact truth / handoff owner | 协作方 | 运行期 | 是,pending | 只经 ref / handoff;MI-UP-007 未闭口时不声明 formal ref。 |
| `L0-bus` | 镜像构建事件主干 | 依赖方 / event consumer | 事件协作 | 是,条件型 | 仅获准入站方向;MI-UP-005 未闭口,MI-UP-009 禁止当前输出。 |
| 正式 seed owner | 未确定的静态来源 | 依赖方 | 运行期 | 是,pending | 只消费 pinned template ref;MI-UP-006 未闭口时不建 owner-specific active edge。 |
| `L4-sandbox` | 隔离基础设施 | Future 依赖方 | 运行期 | 否,current | Hardened base 是 MI-UP-008 future-only,不消费 Sandbox truth。 |
| `L3-capability-hub` | 能力 registry / adapter owner | 无直接关系 | 运行期 | 否 | Capability registry 与 external adapters 不进入镜像核心。 |
| `L4-observability` | 横切观测 | Future summary source | 运行期 | 否,current | Usage summary 未启用;observed truth 不反写本仓。 |
| `L0-sdk` / L5 / L6 | Client / 产品 / 生态 | 无直接主链 | 运行期 | 否 | 产品与 marketplace 不反向进入静态镜像资产主链。 |

### 7.6 本仓依赖类型分类

| 依赖类型 | 关联项目 / 能力 | 本仓如何使用 / 提供能力 | 后续文档落点 |
|---|---|---|---|
| compile | `L0-core` | 只消费 formally recognized shared contract;MI-UP-004 未闭口部分不进入 active package set | 02 / 03 / 07 |
| runtime | `L3-method-library`;`L2-member-service` | 消费 mapping 语义;提供 pinned entry / gap | 01 / 02 / 03 |
| event | `L0-bus` | Conditional inbound verified build intent only;当前无 output | 01 / 03 / 05 / 06 |
| ref | Runtime / Tools / Member、seed owner、registry、Artifact、gate authority | 绑定 pinned component / template / immutable image / formal external refs 或 safe snapshots | 02 / 03 / 04 |
| adapter | Scheduler / builder / registry / evidence backend / Artifact handoff | 产品中立交接,把 outcome 转成 conservative local input | 02 / 03 / 04 / 05 |
| fake | 所有 pending external seams | 只验证 isolated negative、contract parity 和 fail-closed 行为 | 03 / 05;不得进入 production / readiness |

说明:全局规范的三类依赖决定是否可能成为 package dependency;`ref/adapter/fake` 是本仓必须进一步标明的边界 seam。某关系被标为 runtime / event 并不因同时带 ref / adapter 而获得 compile 权限。

### 7.7 本仓禁止依赖

| 禁止依赖 | 禁止原因 | 正确协作方式 |
|---|---|---|
| Method Library -> 本仓 source / path dependency | 会让 mapping contract 和实现绑定 | runtime + ref / safe snapshot |
| Runtime / Tools / Member -> 本仓 package dependency | 物理 component 消费不等于源码依赖 | Pinned release ref |
| Member Service <-> 本仓反向源码依赖 | 会形成 sibling 循环和 owner 反转 | Runtime + ref supply contract |
| 本仓本地 shadow Core image schema | MI-UP-004 未闭口,会产生第二 shared contract | 等 Core 正式认定或保持仓内私有语义 |
| 本仓定义 ArtifactVersion / lineage / baseline | 形成 Artifact 第二 truth | Formal ref + pending handoff |
| Core semantics 直接依赖 builder / registry / evidence SDK | 外部产品会定义领域状态 | Inward adapter contract + conservative outcome |
| Bus arrival / carrier payload 直接写 candidate / availability | Event carrier 不是 truth authority | Validate input -> local intent / domain rules |
| Projection / cache / report 反写正式 truth | 派生面成为第二写源 | Read-only derived role + explicit rebuild |
| Fake adapter 进入 production composition | 假结果会掩盖 contract gap | 正式 adapter;fake 仅测试 |
| Consumer / container state 反写 local availability | 下游生命周期反转本仓 owner | Handoff / consumer gap 分层 |

### 7.8 依赖裁剪图: L2-member-images

图类型:跨仓依赖裁剪图

图标题:L2-member-images 从全局依赖基线裁剪出的当前关系

```text
Global baseline
  |
  | crop only L2-member-images related edges
  v
                         +-------------------------+
                         | L3-method-library       |
                         +------------+------------+
                                      | [runtime/ref]
                                      v
+-------------+ [compile]  +----------+-----------+  [runtime/ref]  +-------------------+
| L0-core     +----------->| L2-member-images    +--------------->| L2-member-service |
+-------------+            +----+------------+----+                +-------------------+
                                ^            |
          [event, inbound only]  |            | [runtime/ref/adapter]
                                |            v
                           +----+----+   +---+----------------------+
                           | L0-bus |   | L1-artifact              |
                           +---------+   +--------------------------+

L2-runtime / L2-tools / L2-member ----[runtime/ref]----> L2-member-images
External build / registry / evidence --[adapter/ref]----> L2-member-images
```

图示说明:

- 本图只展示本仓当前主链相关边,不复制全 27 仓矩阵。
- `[compile]` 仅允许 `L0-core` 已正式认定的 shared contracts;MI-UP-004 不产生 active image schema。
- `[runtime]`、`[event]`、`[ref]` 和 `[adapter]` 均不得写成 package dependency。
- Bus 只有 conditional inbound;Artifact 和 Member Service positive contracts 继续受 MI-UP-007 / 001 限制。
- 箭头只表达依赖 / 消费 / 协作方向,不表达调用、构建或事件传播时序。

### 7.9 跨依赖边界审计

| 审计项 | 结果 | 说明 |
|---|---|---|
| 反向依赖 | pass | Consumer、Artifact、registry、projection 均不能反写上游核心语义。 |
| Global crop 一致性 | pass | Core / Method / L2 artifacts / Bus 主边与全局矩阵一致;新增 sibling / Artifact 关系保持 pending owner input。 |
| 类型误判 | pass | 只有正式 Core 可 compile;runtime / event / ref / adapter / fake 无 package 权限。 |
| 外部产品侵入 | pass | Builder / registry / evidence 均停在外部接缝 / technical carrier。 |
| 架构单元方向 | pass | BC01 -> BC02 -> BC03 -> BC04,BC05 只支撑不创 core truth。 |
| 概要承接风险 | pass | 后续可从责任角色映射代码主体,但不得机械生成目录或依赖。 |
| Pending / readiness | pass | MI-UP-001~009、Q-MI-001~004 无伪关闭。 |

## 8. 回填草稿

正式 01 §8 回填 §7.1~7.3 的内部方向、§7.5~7.8 的跨仓裁剪和 §7.9 审计结论。正式章必须同时保留全局三类依赖和本仓 ref / adapter / fake seam,不能只写“依赖上游”。

## 9. 待确认事项

- MI-UP-004 决定 image-specific Core schema 是否能成为 active compile contract;当前不得 shadow。
- MI-UP-001 / 003 / 005 / 007 决定 runtime / event / Artifact exact seam,但不改变当前依赖类型。
- MI-UP-006 在 seed owner 明确前不产生 owner-specific active edge。
- MI-UP-009 关闭前始终不存在 event output dependency。
- Q-MI-003 / 004 不影响 adapter-neutral 架构,只影响具体绑定与 gate inventory。

## 10. 进入下一步条件

| 检查项 | 结果 |
|---|---|
| 五类责任角色和向内依赖是否明确 | pass |
| BC-MI-01~05 是否逐个完成依赖停审 | pass |
| 跨仓三表与裁剪图是否完整 | pass |
| compile/runtime/event/ref/adapter/fake 是否均有定义和边界 | pass |
| 非 Core 关系是否均未获得 package dependency 权限 | pass |
| 跨依赖审计是否无 unresolved 冲突 | pass |

`gate_status = pass`;允许更新 flow / ledger 后创建 Step 8,不得跳到 Step 9 或修改正式 01。
