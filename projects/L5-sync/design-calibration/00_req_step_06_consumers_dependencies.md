# 00 需求 Step 6 · 使用方与依赖

> 状态：`completed`
> 前置：`00_req_step_02_scope_boundary.md`、`00_req_step_05_users_roles.md`、全局依赖规则
> 回填章节：正式 `00` §6
> 本步只写能力级仓际关系和依赖裁剪，不写 API、DTO、事件 schema、模块或实现。

## 1. 本步目标

确认谁消费 L5-sync 的能力、Sync 依赖哪些前置 owner、哪些边属于编译期/运行期/事件协作，以及依赖失效时核心闭环的安全上限。

## 2. 使用方与输出能力

| 使用方 | 消费的能力级输出 | 依赖类型 | 当前状态 |
|---|---|---|---|
| 本地开发者/项目接手人 | working-copy 初始化、status/pull、冲突/恢复和 push-review 入口 | 外部用户入口 | 核心 |
| 产品/CLI/GUI 外壳（若获授权） | 选择、状态、冲突、handoff 的安全读面 | 运行期/adapter | GUI 形态 pending |
| `L0-sdk` 消费者 | 通过正式 SDK/API 读取 Sync 状态或发起允许操作 | 运行期/adapter | exact surface pending |
| Governance/Review Gate | 接收候选 handoff、返回 ACK/probe/decision ref | 运行期 | 协议 pending |
| `L4-observability` | 消费经裁剪的 correlation/诊断关联（若正式合同允许） | 运行期/事件（条件） | 不成为业务成功 truth |
| `L4-archive` | 读取归档项目姿态或安全引用（若正式合同允许） | 运行期/ref（条件） | 不由 Sync 归档/恢复 |

## 3. 依赖裁剪表

| 关联方 | 全局关系 | 本仓角色 | 依赖类型 | 是否进入当前主链 | 失效影响与裁剪 |
|---|---|---|---|---|---|
| `L0-core` | Layer 0 shared contract source | 共享引用/错误/trace 的定义来源 | 编译期（仅正式 shared contract） | 条件进入 | 未闭合时不复制类型；Sync 专用类型不反向写入 core。 |
| `L0-sdk` | L5 产品官方访问封装 | 平台访问入口 | 编译期/运行期（按当前正式基线） | 是 | 精确 client/version/error surface 未核验前不锁方法名；不得绕过 SDK 访问私有接口。 |
| `L1-identity` | principal owner | 认证/主体语境消费者 | 运行期/ref | 是 | 身份或认证未知即 blocked；不拥有 credential/identity truth。 |
| `L1-work` | Project/ProjectMember owner | 项目、权限和姿态来源 | 运行期/ref | 是 | 无 Project/Member/姿态结论不允许继续；不创建成员或项目。 |
| `L1-governance` | Review Gate/Decision owner | handoff 与治理结论来源 | 运行期/ref | 是 | 不把 ACK 当 accepted；Gate 协议未闭合则只能准备本地候选。 |
| `L1-artifact` | Artifact/version/Baseline owner | material source 与版本来源 | 运行期/ref | 是 | 不复制正文/版本链；source comparator/locator 缺失则 pull blocked。 |
| `L1-workspace` | read model/projection owner | 可选来源绑定/摘要消费者 | 运行期/ref | 条件进入 | 不把本地 working copy 当 projection；正式 source contract 未闭合时保持 pending。 |
| `L4-archive` | archive/restore owner | 项目归档姿态输入 | 运行期/ref | 条件进入 | archived/dissolved/retired posture 未知则 fail-closed；不执行 archive mutation。 |
| `L4-observability` | cross-cutting diagnostics owner | 诊断/关联材料消费者 | 运行期/事件（条件） | 外围/条件 | telemetry/diagnostic 不证明同步或 review 成功；不直接订阅内部 topic。 |
| Git CLI/library | 本地外部工具 | HEAD/index/tree、工具能力和受限操作 seam | 外部 adapter | 是 | remote truth 不纳入；merge/rebase/push 永不自动。 |
| filesystem/OS | 本地环境边界 | 路径、锁、原子读写、dirty/untracked 观察 | 外部 adapter | 是 | 路径/权限/未提交修改未知时停止；不删除 provenance。 |

## 4. 依赖类型分类表

| 关系 | 能力级含义 | 全局依赖类型 | 是否可写为 package/path dependency |
|---|---|---|---|
| L0-core shared contract | 使用已正式发布的共享 ref/error/trace 语义 | 编译期依赖 | 仅在正式 package/contract 可检索时允许 |
| L0-sdk access surface | 查询来源、权限、handoff 和 probe | 运行期依赖/SDK adapter | 否，不把远程服务写成 path dependency |
| identity/work/artifact/governance/workspace/archive | 获取 owner 结论和安全 ref | 运行期依赖 | 否 |
| observability | 诊断关联或安全交接 | 运行期/事件协作（条件） | 否 |
| Git/filesystem | 本地观察和受限 I/O | 外部能力依赖 | 不属于内部仓 package |

## 5. 当前主链与失效后果

核心前置链是：principal/Project 语境 → Artifact/Workspace source 与版本 → 本地目标保护 → materialization/status/pull → Governance handoff。任何前置 owner 返回 unknown、stale、revoked、archived、conflicting 或 unsupported，Sync 都不能用本地缓存或日志升格为可执行。Observability、Archive 只在其正式合同允许的外围路径进入主链，不阻塞本地安全 status，但不能被缺省为成功。

## 6. 禁止依赖/做法

| 禁止依赖或做法 | 原因 | 正确协作方式 |
|---|---|---|
| 读取上游内部表、共享数据库或跨仓事务 | 会把运行期协作伪装成编译期/共享真相 | 经正式 SDK/API/ref/adapter seam |
| Sync 直接订阅任意 bus topic 或拥有 delivery/replay | 越界为 bus/projector owner | 仅消费 SDK/正式事件面（若合同闭合） |
| 把 Git remote branch/commit 当 Artifact/Baseline | 造成本地与平台双真相 | 由 Artifact/Workspace source ref 明确绑定 |
| 把上传 ACK/HTTP 200/日志当 Review accepted | 混淆 transport 与 governance decision | 查询正式 Gate/Decision 状态 |
| 依赖 GUI、LFS、浅克隆作为闭环前置 | 当前无权威支持矩阵 | 标为 pending/unsupported，不能放宽安全门禁 |
| 以本地缓存代替 identity/work/governance 权限结论 | 可能 fail-open | owner 结论未知即 blocked |

## 7. 依赖裁剪图

```text
 principal / Project / posture
          | runtime/ref
          v
      +---+---------------------+
      |        L5-sync          |
      | local session + copy    |
      | cursor/conflict/handoff |
      +---+----------+----------+
          ^          ^
          |          |
  Artifact/Workspace | Git/filesystem
  source/version     | local observation/I/O
          |          |
          +----+-----+
               v
       Governance Review Gate
       handoff/decision ref

 L0-sdk/L0-core = formal access/shared contracts
 L4-archive      = conditional posture/ref
 L4-observability= conditional diagnostics only
```

## 8. 取舍与回填草稿

正式 §6 回填使用方表、依赖裁剪表、依赖类型表、禁止依赖表和裁剪图；不写命令、事件名、DTO、模块或 package manifest。未闭合依赖统一保留 `pending/blocked`，不阻止描述安全上限，但阻止正向实现承诺。

## 9. 自检与门禁

- [x] 已从全局关系裁剪 L5-sync 相关边，没有复制总矩阵。
- [x] 已区分编译期、运行期、事件协作和外部 adapter 关系。
- [x] 已说明核心前置和失效后的安全上限。
- [x] 已明确禁止内部表、任意 bus、remote truth、ACK-as-accept 和历史技术选择越界。

`Step 6 gate_status = pass_with_blockers`；允许进入 Step 7，保留 `SYNC-UP-001~010`。
