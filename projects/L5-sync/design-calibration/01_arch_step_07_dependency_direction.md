# L5-sync 架构 Step 7 · 依赖方向与层间约束

## 1. Step 状态

| 字段 | 内容 |
|---|---|
| 状态 | `completed / pass_with_upstream_blockers` |
| 对应 SOP | `架构设计讨论流程_SOP.md` Step 7 |
| 输入 | Step 5~6、全局项目依赖关系与裁剪规则、专项上游边界 |
| 回填章节 | 正式 01 §8 |
| 下一步 | Step 8：数据所有权与一致性策略 |

## 2. Step 内计划

- [x] 定义内部责任层与单向依赖。
- [x] 按每个架构单元给出允许、禁止、倒置边界和外部接入方式。
- [x] 从全局矩阵裁剪本仓依赖子图，区分编译期、运行期、事件协作。
- [x] 输出固定格式的依赖裁剪表、分类表、禁止依赖表和 ASCII 图。
- [x] 逐单元停审并审计反向依赖、类型误判和私有 seam 风险。

## 3. 本步输入

| 输入 | 关键约束 |
|---|---|
| Step 5 | Selection、Working Copy、Materialization、Recovery、Handoff、References |
| Step 6 | entry → orchestration → ports → external/local adapters；local store 独立 |
| 全局依赖矩阵 | `L5-sync` 编译期 `L0-core`/`L0-sdk`，运行期 workspace/archive/artifact 经 SDK |
| 上游正式 01 | Work/Governance/Artifact/Workspace/Archive owner 不得被源码耦合或反向定义 |

## 4. SOP 问题回答

### 4.1 内部层次如何划分？

划分为：Entry/Presentation（意图与结果显示）→ Application Orchestration（用例编排和门禁）→ Local Domain/Core（session/binding/cursor/conflict/recovery/handoff 语义）→ Ports（SDK/Git/filesystem/local state/clock/lock 等抽象能力）→ Adapters（外部具体接入）。依赖始终向核心语义收敛，adapter 实现依赖 port，而不是 core 依赖具体 adapter。

### 4.2 允许和禁止哪些方向？

允许 entry 依赖 application；application 依赖 local core 和 ports；core 依赖 `L0-core` 的共享值语义候选，不依赖具体 SDK/Git/fs；adapters 依赖 ports 与外部 SDK/tooling。禁止 core 依赖 CLI/UI、SDK concrete client、Git command/library、filesystem layout、数据库、network transport 或 sibling domain implementation。

### 4.3 外部系统如何接入？

平台能力只能经 `L0-sdk` 正式 boundary adapter；Git/filesystem 经白名单 local adapter；local state 经受控 store port；Observability 通过安全 telemetry/audit boundary；不得通过共享数据库、内部表、任意 bus、私有 endpoint 或跨仓事务接入。

### 4.4 哪些跨仓边进入主链？

`L0-core`、`L0-sdk` 是编译期候选；`L1-work`、`L1-artifact`、`L1-workspace`、`L1-governance`、`L4-archive`、`L4-observability` 经 SDK 或正式运行期/交接边界进入；`L1-identity` 通过 SDK 提供 principal/actor 语境，必要但不直接形成 sibling 源码依赖。直接 bus 协作当前不进入主链，除非 SDK 正式提供并且后续需求明确。

## 5. 当前文档问题诊断

| 历史依赖描述 | 问题 | 当前修正 |
|---|---|---|
| `shared sync core -> sdk truth / local git truth` | SDK/Git 被写成同类 truth 且方向模糊 | core 只依赖 ports；SDK owner refs 与 Git observation 分类不同 |
| 固定 `ProjectAccessAdapter` 等 interface 名称 | 架构阶段提前锁代码接口 | 只定义 port 类别和能力，不锁名称/signature |
| Artifact/Work/Governance 被写成直接依赖 | 容易形成源码依赖或私有 endpoint | 统一经 L0-sdk 正式运行期边界 |
| 未包含 Workspace/Archive/Observability | 与当前正式上游不完整 | 加入 owner-neutral runtime/handoff/telemetry edges |

## 6. 设计取舍

| 方案 | 结论 | 理由 |
|---|---|---|
| A. Core 直接依赖 SDK 与 Git concrete APIs | 不采用 | 使业务语义被传输/工具细节反向控制。 |
| B. Hexagonal/ports-and-adapters 依赖方向（架构机制） | 采用 | 保护 local domain，允许 SDK/Git/fs 适配替换和测试切口。 |
| C. 各命令直接访问不同 owner 服务 | 不采用 | 重复门禁、破坏一致性和可恢复语义。 |

## 7. 结构化中间产物

### 7.1 内部依赖方向图

```text
+----------------------------+
| command / interaction entry|
+-------------+--------------+
              |
              v
+-------------+--------------+
| application orchestration  |
+------+------+--------------+
       |      |
       v      v
+------+--+  +----------------+
| local   |  | capability     |
| core    |  | ports          |
+---------+  +-------+--------+
                     ^
                     |
             +-------+---------+
             | SDK / Git / fs  |
             | state adapters  |
             +-----------------+
```

图示说明：

1. 箭头表达编译/语义依赖方向，不表达运行时调用顺序。
2. Core 不依赖 concrete adapter；adapter 向内实现 port。
3. Entry 不得绕过 application 直接获得外部 mutation capability。

### 7.2 层间约束表

| 层/角色 | 允许依赖 | 禁止依赖 | 倒置边界 |
|---|---|---|---|
| Entry | application contracts、safe result | Git/SDK/store concrete adapter、domain mutation internals | 所有副作用交 application |
| Application orchestration | local core、capability ports | 私有 owner endpoint、shared DB、任意 shell | owner/tool/fs 通过 ports |
| Local core | shared value/ID/error/correlation 候选 | SDK concrete client、Git/fs/network/storage concrete | 由 ports 提供外部能力 |
| Capability ports | local value semantics | provider schema/body、CLI/UI concern | adapters 实现有限能力 |
| Adapters | ports、`L0-sdk`/tool/fs concrete facilities | 修改 core invariants、直接组合 owner truth | 只翻译与执行，不裁决 |

### 7.3 按架构单元组织的依赖规则

| 架构单元 | 允许依赖 | 禁止依赖 | 外部接入 |
|---|---|---|---|
| Selection & Access | principal/project/source eligibility ports | 本地 default allow、Git remote 推断 | SDK owner checks |
| Working Copy & Metadata | local state、Git/fs observation ports | Workspace DB、remote truth、外部正文 | local controlled store + Git/fs adapter |
| Source Materialization | source read/compare、mapping、apply ports | Artifact/Workspace private implementation、automatic merge | SDK source seam + local apply seam |
| Conflict & Recovery | checkpoint/probe/lock ports | arbitrary retry、provider-specific error parsing | local state + SDK probe capability |
| Review Handoff & Provenance | handoff/probe/read-decision ports | Governance DB、direct remote push、decision mutation | SDK governance boundary |

### 7.4 本仓依赖裁剪表

| 关联项目 | 全局关系 | 本仓角色 | 依赖类型 | 是否进入当前文档主链 | 裁剪理由 |
|---|---|---|---|---|---|
| `L0-core` | L5-sync 编译期候选 | 依赖方 | 编译期 | 是 | shared ID/ref/error/trace/correlation 候选；精确使用待后续设计 |
| `L0-sdk` | L5 产品默认能力入口 | 依赖方 | 编译期 + 运行期 | 是 | 统一访问 owner capabilities；精确 surface 受 `SYNC-UP-001` 阻塞 |
| `L1-identity` | principal/actor truth owner | 间接依赖方 | 运行期（经 SDK） | 是 | 操作语境需要 principal，不直接依赖实现 |
| `L1-work` | Project/ProjectMember truth owner | 依赖方 | 运行期（经 SDK） | 是 | 权限、项目 posture 和 allowed action |
| `L1-artifact` | Artifact/version/lineage/baseline owner | 依赖方 | 运行期（经 SDK） | 是 | source/version/materialization 候选 owner |
| `L1-workspace` | Workspace projection owner | 依赖方/协作方 | 运行期（经 SDK） | 是 | projection/source view；local working copy 与之分离 |
| `L1-governance` | Gate/Policy/Decision owner | 依赖方/交接方 | 运行期（经 SDK） | 是 | review handoff/probe/decision read |
| `L4-archive` | archive/restore owner | 依赖方/交接方 | 运行期（经 SDK） | 是 | archive posture/ref；不拥有 package |
| `L4-observability` | observation/audit owner | 被消费/协作方 | 运行期/telemetry | 是 | bounded diagnostics/correlation；不决定成功 |
| `L0-bus` | 事件协作主干 | 间接关系 | 事件协作 | 否（当前主链） | Sync 不直接订阅内部事件；只有 SDK 正式提供且需求明确时再裁剪 |

### 7.5 本仓依赖类型分类表

| 依赖类型 | 关联项目/边界 | 本仓如何使用 | 后续落点 |
|---|---|---|---|
| 编译期 | `L0-core`、`L0-sdk` | shared contracts / official client；精确 package 依赖待 03/07 | 详细设计 / 实施计划 |
| 运行期 | identity/work/artifact/workspace/governance/archive 经 SDK | owner checks、source reads、handoff、posture | 架构 / 详细设计 |
| 运行期本地 | Git/filesystem | observation、locks、safe apply | 概要 / 详细设计 |
| 运行期横切 | observability | redacted telemetry/audit correlation | 架构 / 配置 / 测试 |
| 事件协作 | `L0-bus` | 当前不直接接入 | 风险 / 后续重评 |

### 7.6 本仓禁止依赖表

| 禁止依赖 | 禁止原因 | 正确协作方式 |
|---|---|---|
| Core → SDK/Git/fs concrete implementation | 外部技术控制核心语义 | capability ports + inward adapters |
| Sync → sibling owner 源码/private endpoint | 破坏层级与版本边界 | 经 `L0-sdk` 正式能力边界 |
| Sync → owner/shared database/internal table | 绕过单一 truth 与权限 | owner query/command/handoff seam |
| Sync → arbitrary `L0-bus` subscription | 可能绕过 SDK 和 schema owner | 仅在正式 SDK/event contract 成立后接入 |
| Entry/UI → Git/SDK mutation adapter | 绕过应用门禁 | 通过 application orchestration |
| Git adapter → platform decision | 工具状态不能定义业务 truth | observation only；owner decision via SDK |

### 7.7 依赖裁剪图: L5-sync

```text
Global baseline
  |
  | crop only L5-sync related edges
  v
+-----------------------+
| L5-sync               |
+----+------------------+
     |
     +--> [compile] L0-core
     +--> [compile/runtime] L0-sdk
     +--> [runtime via SDK] identity / work / artifact / workspace
     +--> [runtime via SDK] governance / archive
     +--> [runtime] local Git / filesystem
     +--> [runtime] observability boundary
     -X-> [event] direct L0-bus (not in current mainline)
```

图示说明：

1. 本图只展示 L5-sync 相关依赖，不展示全 27 仓。
2. `[compile]` 才可进入 package dependency；`[runtime]` 和 `[event]` 不得误写为 path dependency。
3. 所有 sibling owner 运行期依赖默认经 `L0-sdk`，不直连其实现或数据存储。
4. 直接事件协作当前被裁剪出主链，不等于永久禁止未来 SDK 受控事件能力。

### 7.8 依赖方向停审记录

| 单元 | 方向清楚 | 禁止依赖明确 | 依赖类型正确 | 结论 |
|---|---|---|---|---|
| Selection & Access | 是 | 是 | 是 | pass_with_sdk_surface_pending |
| Working Copy & Metadata | 是 | 是 | 是 | pass_with_store_schema_pending |
| Source Materialization | 是 | 是 | 是 | pass_with_source_contract_pending |
| Conflict & Recovery | 是 | 是 | 是 | pass_with_probe_contract_pending |
| Review Handoff & Provenance | 是 | 是 | 是 | pass_with_governance_contract_pending |

跨依赖审计：无反向依赖；未把 runtime/event 误写为 package dependency；未把 adapter 名词当成业务规则；未形成 sibling repo 源码依赖承诺。

## 8. 回填草稿

正式 §8 回填内部图、层间约束、裁剪表/分类表/禁止表/裁剪图；停审记录留在本文件。正文明确 `L0-core`/`L0-sdk` 只是编译期候选，精确依赖由后续设计与真实发布合同确认。

## 9. 待确认事项

- `L0-core` 与 `L0-sdk` 的精确类型/package surface：`SYNC-UP-001`。
- Artifact/Workspace source seam 与 comparator：`SYNC-UP-002/008`。
- Governance handoff/probe/decision seam：`SYNC-UP-004/005`。
- 是否存在任何受控事件协作需要进入主链：当前否，后续须有正式 SDK/upstream contract。

## 10. 自检与进入下一步条件

- [x] 内部层次、允许/禁止方向和倒置边界已明确。
- [x] 固定格式四类跨仓依赖产物齐全。
- [x] 五个架构单元完成依赖停审；跨单元无反向依赖。
- [x] 运行期与事件协作未误写为编译期依赖。

`gate_status = pass_with_upstream_blockers`；可进入 Step 8。
