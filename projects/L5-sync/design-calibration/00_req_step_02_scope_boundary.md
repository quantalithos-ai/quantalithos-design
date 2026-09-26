# 00 需求 Step 2 · 本仓定位与边界

> 状态：`completed`
> 前置：`00_req_step_01_upstream_relationship.md`、`draft/01_项目作用与交互对象.md`
> 回填章节：正式 `00` §2

## 1. 本步目标

用需求层语言明确 L5-sync 是什么、为什么需要独立存在、拥有什么局部责任，以及哪些真相和动作永远留在相邻 owner。

## 2. 应问的问题与回答

### 2.1 一句话定义

`L5-sync` 是平台与本地开发工作区之间的受控同步入口：在用户显式选择 project/version/source 且 principal、权限、来源和本地目标均可验证时，初始化、观察、增量更新和准备 review handoff，并维护一次同步操作的本地 session、metadata、cursor、mapping、冲突、恢复和 provenance 关联。

### 2.2 为什么必须单独成仓？

平台 Artifact/Workspace 与本地 Git/filesystem 的事实生命周期不同，Review Gate 又要求本地修改回流不能绕过治理。若没有独立 Sync，客户端会各自猜测项目/版本、重复实现来源绑定和 dirty-state 保护，容易把 Git commit、上传 ACK 或本地缓存误当平台事实。Sync 作为窄域入口可以统一这些本地安全纪律，但不需要成为新的平台真相域。

### 2.3 本仓不是什么？

- 不是 Project、Artifact、Baseline、Review Gate、Workspace projection、Archive 或 Git remote truth owner。
- 不是跨 chat/console/runner 的统一状态同步器、bus delivery/replay 协调器或跨端一致性中心。
- 不是 Git 替代品；不自动 merge、rebase、push，不覆盖用户未提交修改。
- 不是权限/身份授权中心；不创建 principal、ProjectMember 或 Review decision。

## 3. 边界声明表

| 主题 | L5-sync 拥有 | 只消费/回链 | 禁止拥有或执行 |
|---|---|---|---|
| session | 本地同步尝试、阶段、幂等关联、恢复点和安全诊断关联 | 外部请求 correlation、source ref、probe 结果 | 平台任务生命周期或审计 verdict |
| working copy | 本地目标绑定、Git/filesystem 观察、受控 materialization 记录 | Artifact/Workspace source ref 与版本语境 | Workspace projection、Artifact 正文或 remote truth |
| metadata | 受控 `.qs-sync` provenance、generation、mapping、cursor 关联 | owner ref、版本/水位、迁移提示 | 伪造/静默删除 provenance，credential 入 metadata |
| conflict/recovery | dirty-state 保护、冲突记录、checkpoint、unknown outcome 关联 | Git/fs 结果、外部 probe | 自动 merge/rebase/push、强制覆盖、盲重试 |
| review handoff | 本地候选冻结/准备、提交 attempt 和返回 ref | Review Gate 接收/decision 状态 | 接受、批准、signoff、Baseline 创建 |
| project posture | 本地可执行性缓存和失效标记 | Project/ProjectMember/Archive 正式姿态 | 猜测 active、绕过 archived/dissolved 限制 |

## 4. 相邻概念易混淆边界

| 易混淆概念 | L5-sync 与其区别 |
|---|---|
| Git HEAD/commit | 只表示本地 Git 观察结果；不能证明 Artifact、Baseline 或 Review accepted。 |
| Workspace projection | 是服务侧跨域 read model；本地 working copy 和 `.qs-sync` 不构成 projection。 |
| upload ACK | 是 transport/接收层结果；不等于 Gate accepted、approved 或 signed off。 |
| local sync status | 只描述一次本地操作的局部状态；不是 Project/Artifact/Review 的业务状态。 |
| provenance metadata | 是本地来源关联材料；不替代上游 owner 的 provenance truth。 |

## 5. 结构化结论与取舍

采用“受控入口 + local truth”定位，保留 clone/pull/status/push-review 作为用户可见能力方向；拒绝旧材料中的跨系统状态协调器、统一 SyncTask 和全平台 replay/resync 扩张。`.qs-sync` 仅作为受控 metadata 主题，不提前确认单文件布局、字段、数据库或保留期限。

## 6. 回填草稿

正式 §2 回填一句话定义、独立成仓原因、边界表和相邻概念区分；不写 CLI 参数、API、模块、schema、技术栈或指标。

## 7. 自检与门禁

- [x] 一句话定义能区分平台来源、local working copy 和 review handoff。
- [x] 已列出拥有、消费、禁止拥有三类边界。
- [x] 已否定跨端同步器扩张和 Git/ACK 越权解释。
- [x] 未滑入实现组织或协议细节。

`Step 2 gate_status = pass`；允许进入 Step 3。
