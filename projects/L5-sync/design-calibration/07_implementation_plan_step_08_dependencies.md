# Step 8. 定义配置、环境与外部依赖准备

> 对应 SOP：`standards/document/实施计划讨论流程_SOP.md` Step 8
> 回填目标：正式 `07-实施计划.md` §8

## Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | 8 / configuration_environment_and_dependencies |
| Step 状态 | `completed / stop_review` |
| gate_status | `pass_with_upstream_blockers` |
| 下一步 | Step 9；整理 Spike、风险和待确认事项 |

## 本步输入

| 输入 | 来源 | 状态 |
|---|---|---|
| adapter/port 依赖矩阵 | `03-详细设计.md` §3.3、§5.7、§13 | formal / stop_review |
| 42 leaf、profiles、builder | `04-配置设计.md` §7～§11 | formal / stop_review |
| 四个 P0 profile/environment | `05-测试方案.md` §8 | formal / stop_review |
| 阶段顺序 | Step 5 | completed / stop_review |
| 本地 sibling repo 检查 | `/home/aris/Projects` 只读目录事实 | 已核验目录存在性；不改变其内容 |

## SOP 问题回答

| 问题 | 收口回答 | 依据 |
|---|---|---|
| 哪些是编译期依赖？ | 当前没有已确认的本地编译期 sibling dependency；`@quantalithos/sdk` 只是 TypeScript candidate，语法和版本受 `SYNC-LOCAL-005`。 | 03 §3.3 |
| 哪些是运行期依赖？ | L0-sdk、L1-identity/work/artifact/workspace/governance、L4-archive/observability、Git/filesystem、metadata store/UoW/lock。均经 typed port/adapter，不写 Cargo/path dependency。 | 01/03/05/06 |
| 哪些是事件协作依赖？ | 3 inbound consumer 的 envelope/source/schema/order/topic/dedup；由正式 event/SDK seam 提供，当前 blocked。 | 03 §7.4、`SYNC-UP-001/004/005/017` |
| fake/mock 可用到什么程度？ | 只证明 local invariant、call order、write set、negative/unknown 和 receipt/replay；不能关闭 owner、physical metadata、Git/fs、Review positive blocker。 | 03 §15、05 §2/§14 |
| 依赖不可用怎么办？ | 读 surface 显式 unavailable/blocked/unknown；mutation/handoff/apply fail-closed；暂停对应 boundary，不切换到隐式 fallback。 | 04 §11、06 §4/§11 |

## 当前文档问题诊断

| 问题 | 影响 | 处理 |
|---|---|---|
| SDK 仓存在但 public surface 未逐项闭合 | 不能把本地目录存在当作 API 可用 | 只记录 candidate，adapter contract gate 仍 blocked |
| sibling 项目多为 Rust | L5-sync 当前是 TypeScript，不能引入 Cargo path dependency | 运行期协作走 SDK/adapter；不复制 Rust 架构 |
| 目标实现仓不存在 | 无法准备 node_modules、runner、Git test fixture | 记录 TARGET-REPO-001，保持 waiting |
| secret provider/physical metadata 未定 | 可能泄露或错误 fallback | ref-only config、adapter-private material、fail-fast/fail-closed |

## 改动前后对比

| 项 | 改动前 | 改动后 | 理由 |
|---|---|---|---|
| 依赖分类 | 上游名称并列 | compile/runtime/event/local/tool/config 分层 | 防止把 runtime 依赖写成 path dependency |
| fake | 泛化替代 | 明确可证明/不可证明边界 | 保留 evidence ceiling |
| 环境 | 未定义 | 四个 P0 profile + 阶段准备/失败处理 | 与 05 对齐 |

## 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 先把 sibling repo 全部编译进 workspace | 可复用现成代码 | 类型/版本/层级越界，L5 不是 Rust workspace | 拒绝 |
| 所有外部依赖用 fake | 易启动 | 会伪造正向 truth，无法关闭 blocker | 拒绝 |
| 只锁已确认 compile surface，其余 typed runtime/event/local seam + 明确 fake ceiling | 保持依赖方向和安全边界 | 需要多阶段解锁 | 采用 |

## 结构化中间产物

### 外部依赖准备表

| 依赖项 | 类型 | 全局依赖类型 | 使用阶段 | 提供方/路径 | 检查方式 | 不可用时处理 |
|---|---|---|---|---|---|---|
| `@quantalithos/sdk` candidate | SDK | runtime/possible compile candidate | PH-01～PH-05 | `/home/aris/Projects/quantalithos-sdk`；精确 package surface pending | 读取正式 SDK docs、版本/类型/错误核验 | adapter blocked；不猜 DTO/method |
| Identity/Work owner access | owner service | runtime | PH-02 | L1-identity/L1-work via SDK | typed access/posture request/response | unknown/denied/stale fail-closed |
| Artifact/Workspace material source | owner service | runtime | PH-03 | L1-artifact/L1-workspace via SDK | source authority/version/cursor/comparator check | gap/unknown；不 pull/materialize |
| Governance handoff/Decision | owner service | runtime | PH-05 | L1-governance via SDK | candidate/attempt/ACK/probe/Decision contract | transport pending/unknown；不 resubmit |
| Archive posture | owner service | runtime/read | PH-02/05 | L4-archive via SDK | archived/dissolved/retired read | block dangerous action |
| Observability | sink/service | runtime | all; PH-07/08 | L4-observability seam | closed signal/redaction/sink failure | isolate sink; preserve business result |
| Git observation/worktree | local tool | local runtime | PH-03/06 | adapter, no remote truth | dirty/path/root/symlink/lock/support matrix | inspect unavailable/apply blocked |
| Filesystem inspection/apply | local tool | local runtime | PH-03 | adapter, non-overwrite | path allowlist, atomic materialize, partial/unknown | block; no overwrite/stash |
| `.qs-sync` metadata store/UoW/lock | local persistence | local runtime | PH-02～PH-04 | future metadata adapter | physical schema/migration/crash/atomicity | logical-only; `SYNC-UP-006` blocked |
| Event source/bus | event collaboration | runtime/event | PH-07 | formal event/SDK seam | envelope/schema/source/order/idempotency | consumer not registered/blocked |
| Job scheduler/runner | operations tool | runtime | PH-07 | explicit job entry, provider pending | bounded invocation/run metadata | no daemon/schedule assumption |
| TypeScript runtime/package manager | toolchain | local build | PH-01 onward | target repo | Node/package/lock/parser/runner check | implementation blocked |
| Test runner/coverage | toolchain | local build/test | all | target repo/05 plan | command and output shape | planned gate only |
| Report generator/checks | scripts | local tool | PH-08 | target repo `scripts/*` | args/path/redaction/link checks | no acceptance handoff |

### 配置与环境检查表

| 检查项 | 未来要求 | 当前姿态 |
|---|---|---|
| `local-dev` | synthetic/deterministic data、local fake、redaction canary | planned |
| `ci-test` | clean composition、bounded suite、fixed run id | planned |
| `integration-like` | controlled adapter seam/failure mapping | blocked until owner/tool contracts |
| `operations-replay` |脱敏 local carrier、bounded recovery/replay、不新发 effect | planned/blocked |
| 42 leaf/4 profile | strict JSON、source precedence、immutable cold composition | planned; no instance |
| credentials | ref-only、adapter-private resolution if formally supported | blocked; no raw secret |
| Git/fs fixture | dirty/untracked/path/symlink/partial/unknown cases | blocked until support matrix |
| metadata fixture | generation/corrupt/migration/commit-unknown cases | blocked until physical schema |

### fake/mock 使用边界

| 场景 | 允许 fake/mock 证明 | 不得证明 |
|---|---|---|
| domain/policy | invariants、state transition、canonical digest | owner authorization/source truth |
| application flow | call order、UoW write set、forbidden port calls | external effect equivalence |
| SDK adapter | malformed/unavailable/unknown mapping | real SDK compatibility |
| Git/fs | dirty/path/partial/unknown negative contract | real tool/library support matrix |
| metadata | logical version/atomicity model | physical crash/retention/schema durability |
| Review | transport/ACK/Decision layer separation | accepted/approved truth |
| Consumer/Job | receipt/idempotency/conservative transition | real topic/scheduler registration |
| evidence | path/index/redaction/link checks | real test result/readiness |

### 配置生效前置顺序

```text
Clock/ID/Digest
  -> metadata store/UoW/lock/snapshot
  -> filesystem/Git
  -> SDK owner/source/handoff/probe
  -> diagnostics
  -> capability classification
  -> immutable snapshot
  -> read graph
  -> mutation facade
  -> conditional Consumer/Job registration
```

关键说明：
- 图表达 04 的 builder 顺序，不表示外部服务内部调用链。
- 任一 required capability unknown/blocked 时，受影响 mutation/entry 保持 blocked；Query 只返回显式 degraded surface。
- 不使用 hot reload、online LKG、config center/admin override 或 implicit fallback。

## 回填草稿

正式 §8 将回填依赖分类、阶段使用、检查方式、不用时处理、四个 P0 profile、fake ceiling 和 builder 顺序；不声明任一 sibling 仓、SDK、Git/fs、metadata 或 scheduler 已准备完成。

## 待确认事项

| 事项 | 影响 | 截止点 |
|---|---|---|
| SDK exact package/version/API/error | PH-01～05 | commit-01-a/02-a 前 |
| metadata physical driver/schema | PH-02～04 | commit-02-b 前 |
| Git/fs library/support matrix | PH-03/06 | commit-03-b 前 |
| event topic/source/order/scheduler | PH-07 | commit-07-a 前 |
| report runner and reviewer | PH-08 | commit-08-a/b 前 |

## 进入下一步条件

- [x] 依赖按 compile/runtime/event/local/config 分类。
- [x] 每项有检查方式和不可用处理。
- [x] fake/mock 证明上限和四个 P0 profile 已定义。
