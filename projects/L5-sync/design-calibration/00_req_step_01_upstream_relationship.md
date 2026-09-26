# 00 需求 Step 1 · 与上游文档的关系声明

> 状态：`completed`
> 当前文档：`00-需求文档.md`
> 回填章节：正式 `00` §1
> 本 Step 只确认来源和承接主题，不定义 L5-sync 的功能、接口、数据或实现。

## 1. 本步目标

把 L5-sync 的需求来源限定为当前产品、全局依赖规则和专项上游正式文档，避免 README、旧正式文档或草稿中的技术选择直接成为需求真相。

## 2. 本步输入

- `standards/document/全局项目依赖关系与裁剪规则.md`
- `standards/document/设计文档编写通则.md`
- `projects/L0-sdk/00~07-*.md`
- `projects/L1-identity/00~07-*.md`
- `projects/L1-work/00~07-*.md`
- `projects/L1-governance/00~07-*.md`
- `projects/L1-artifact/00~07-*.md`
- `projects/L1-workspace/00~07-*.md` 与 `draft/01~03`
- `projects/L4-archive/00~07-*.md`
- `projects/L4-observability/00~07-*.md`
- `projects/L5-sync/draft/01~03_*.md`
- L5-sync README 与旧正式 `00/01/02/03/05/06`（仅 historical material）

## 3. 应问的问题与回答

### 3.1 本文承接哪些上游文档？

承接产品层对 L5 产品和本地开发工作区的定位、全局依赖规则对 `L5-sync` 的 Layer 5 并行窗口约束，以及专项 owner 对 SDK、principal、Project/ProjectMember、Review Gate、Artifact/version/Baseline、Workspace projection、Archive posture 和 observability 的正式边界。

### 3.2 承接上游哪一部分主题？

只承接“平台正式来源如何被本地开发工作区安全消费、观察、增量更新并交给正式 Review handoff”这一窄域产品主题。各上游对象的生命周期、正文、版本 authority、权限裁决、治理 verdict、归档事实和 Git remote truth不由本仓重新定义。

### 3.3 为什么不是重新定义上游主题？

因为 Sync 是 L5 产品入口而非真相域。它可以保存一次本地同步操作的 session、working-copy metadata、cursor、mapping、冲突、恢复和 provenance 关联；这些局部记录只解释本地操作，不能写回或替代 owner truth。

### 3.4 本仓承担什么细化作用？

把上游正式边界转化为用户可见的 `clone`、`pull`、`status`、`push-review` 和恢复/冲突行为，同时明确来源绑定、权限门禁、未提交修改保护、ACK 与 Review decision 分离，以及 Git/filesystem adapter 的安全边界。精确命令、schema、协议和模块留给后续文档。

## 4. 历史材料污染诊断

| 材料 | 污染/价值 | 当前处置 |
|---|---|---|
| L5-sync README | 有本地同步入口、Review Gate、冲突人工处理的方向；同时含 Rust/Tauri、单文件 metadata、LFS/浅克隆和旧 RPC 假设。 | 只保留产品方向；技术和字段全部后置核验。 |
| 旧 `00/01` | 接近“本地 CLI 受控同步桥”，可作边界线索。 | 不直接继承编号、指标或接口名。 |
| 旧 `02/03` | 扩张为跨 chat/console/runner 状态同步器，含统一 `SyncTask` 和跨端 replay。 | 判为越界历史材料，不进入当前主责。 |
| 旧 `05/06` | 含固定性能、LFS、浅克隆和 GUI 选择。 | 仅登记为待核验，不形成当前需求。 |
| `draft/01~03` | 已初步收束 local truth、source binding、冲突/恢复和 handoff。 | 作为 pre-calibration 输入，仍由本 Step 链重新确认。 |

## 5. 结构化来源映射

| 来源 | 当前可承接主题 | 不可承接 |
|---|---|---|
| `L0-sdk` | 正式平台访问/查询/提交的客户端入口和错误/关联边界 | Sync 自行重定义 SDK service contract |
| `L1-identity` | principal、认证语境、身份引用 | 身份生命周期、credential、授权真相 |
| `L1-work` | Project、ProjectMember、项目姿态和权限语境 | 项目事实、成员生命周期、工作真相 |
| `L1-governance` | Review Gate、decision 和治理可见性 | 批准、接受、signoff 或本地 policy |
| `L1-artifact` | Artifact/version/Baseline 的可消费 source ref | Artifact 正文、版本链、Baseline 创建 |
| `L1-workspace` | 可选 Workspace projection/read binding | 本地 working copy、projection owner |
| `L4-archive` | archived/dissolved/retired posture 与 archive ref | 归档/恢复事实 |
| `L4-observability` | correlation、诊断和安全观测材料 | 业务成功、review verdict、evidence truth |
| Git/filesystem | 本地 HEAD/index/tree、dirty 状态、路径和工具能力 | Git remote/platform truth |

## 6. 取舍与回填草稿

采用“L5 产品细化 + owner truth 外置 + 本地操作局部状态”的来源层级；不采用 README 单独定义产品、不采用旧跨端同步叙事、不采用历史技术栈/数字作为需求来源。正式 §1 将只写来源映射、承接范围和 historical material 处置，不写 API 或实现。

## 7. 自检与门禁

- [x] 已区分当前正式来源、draft 输入和 historical material。
- [x] 未把上游对象的 owner 语义转移给 Sync。
- [x] 未写接口、字段、数据库、技术栈或测试事实。
- [x] 已列出 L5-sync 需求可以细化的窄域。

`Step 1 gate_status = pass`；允许进入 Step 2。
