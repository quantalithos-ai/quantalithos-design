# Step 1. 确认上游输入边界

## 1. Step 状态与计划

状态：`completed / pass_with_upstream_blockers / stop_review`；模式：`full-restart + single-agent-serial`。

### Step 内计划

- [x] 读取项目 ledger、02 flow、概要 SOP/规范和正式 00/01。
- [x] 复核专项上游正式边界及 L1-workspace 02 粒度样本。
- [x] 回答可承接、不可展开、本文不再回答与必须回答的问题。
- [x] 诊断旧 02 的 owner、对象、系统上下文、SLA 与证据污染。
- [x] 输出上游映射、依赖裁剪、完成上限和门禁。

## 2. 本步输入

正式 `00-需求文档.md` 的 A1~A9、F-AR-001~009、BR-AR-001~012、source-authority matrix 与 `AR-UP-001~009`；正式 `01-架构设计.md` 的 U1~U6、依赖六类、数据所有权、多轴一致性、交互和 ADR；全局依赖规则；专项上游正式边界。

## 3. SOP 问题回答

1. 可直接承接：归档请求/作业、逐源 binding/capture、manifest/closure、integrity/compatibility、storage/lifecycle execution、restore plan/material/handoff 六类架构单元及其 Archive-owned truth。
2. 可直接承接的边界：workspace 仅 projection，Artifact/audit 仅获准 material/ref，governance 决定和 owner commit 均在外部；恢复无跨域写权。
3. 未收稳而不可展开：各 owner exact export/receiver schema、version comparator、digest/signature/key、storage commit/probe、retention/hold/delete model、SDK compile 方向与 workload 数值。
4. 本文只将稳定边界转译为代码主体、关键对象、接口、处理流、状态和配置影响，不重做需求/架构论证。
5. 完整字段、协议、错误码、事务算法、DDL、目录/文件和 provider 配置留给 03/04，且受 blocker 约束。

## 4. 当前文档问题诊断

旧 02 把 archive 写成“ArchivedSnapshot / ArchiveRecord / ArchiveIndex / RetentionClass / LegalHold / RestoreRequest”的通用历史仓，并把 sandbox、method-library、capability-hub 等混为归档来源；它使用 `99.9%`、`100% 证据回放`、cached index 降级和默认冷热层等无来源断言，还把 retention/legal hold 当本仓 truth。其章节也沿用旧主链，无法提供新版对象/API/flow/state 交接。因此旧文件只能在 Step 14 被替换，不能局部修补。

## 5. 改动前后对比

| 改动前 | 当前校准后 |
|---|---|
| 通用 snapshot/index/retention 主语，source 范围任意扩大 | 只承接正式 U1~U6 与 source-authority matrix |
| Archive 拥有 RetentionClass/LegalHold 与 purge | 仅消费 governance/明确 owner decision，拥有执行记录 |
| restore/export/replay 混为一个历史出口 | restore 分 owner plan/material/handoff，receiver 自主 commit |
| provider、缓存、SLA 和证据成功预设 | provider-neutral seam，unknown/blocked，数值等待 baseline |
| 旧章节主链 | 新版 14 章和 14-Step 校准链 |

## 6. 设计取舍

- 采用“正式 00/01 为直接基线 + 专项上游用于 owner/接缝核验 + workspace 用作粒度样本”的输入层级。
- 不把旧 02 的对象名当候选池；对象必须从 Step 5 capability 重新发现。
- 对外合同缺口只在本地写 required seam 与负向语义，不使用 `OpaquePayload`、任意 map 或 fake 掩盖 schema 缺失。

## 7. 结构化中间产物

### 7.1 上游关系映射

| 来源文档 | 承接内容 | 本文继续展开什么 |
|---|---|---|
| 本仓正式 `00-需求文档.md` | A1~A9、F/BR/NFR、source-authority、接口类别及 blocker | capability 到对象/API/flow/state 的可实现骨架 |
| 本仓正式 `01-架构设计.md` | U1~U6、运行承载、依赖、所有权、一致性、交互、横切与 ADR | 六个主要组成部分、双轴代码主体、外部 port 与多轴状态 |
| 全局依赖规则 | Layer 4 顺序及 compile/runtime/event/ref/adapter/fake | package 候选与运行边界的持续裁剪 |
| 各 L1 truth owner 正式设计 | canonical truth、snapshot/export、receiver ownership | 本地 source/receiver port 的 required contract 与失败姿态 |
| `L1-workspace` 正式设计 | projection-only、freshness/coverage 与 archive seam | 辅助 projection 输入的类型和禁止升格边界 |
| `L1-artifact` 正式设计 | Artifact body/version/lineage/baseline authority | material/ref binding 与恢复接收边界 |
| `L4-observability` 正式设计 | audit/evidence material、redaction、backend authority | 脱敏 material/ref 绑定，不拥有完整链 |
| `L0-core` / `L0-bus` / `L0-sdk` 正式设计 | 共享契约候选、事件协作、下游 client | contract seam、event envelope 与依赖方向限制 |

### 7.2 本文不再回答 / 必须回答

本文不再回答：

- Archive 为什么存在、拥有哪些业务能力以及 source truth 属于谁。
- U1~U6、运行单元、依赖种类、数据所有权、技术机制和 ADR 是否成立。
- retention/legal hold/delete、项目状态或 receiver business commit 由谁决定。

本文必须回答：

- U1~U6 如何成为稳定主要组成部分并跨实现分层安放。
- 每个 capability 由哪些有类型字段与函数骨架的关键对象承接。
- 哪些入口是 Command、Query、Inbound Event、Outbound Event 候选或 Operations Job，以及读写边界。
- archive/capture/closure/verify/place/lifecycle/restore/handoff/reconcile 的关键处理流和状态如何分轴。
- 哪些异常与配置影响必须在概要层锁定，哪些精确合同保持 blocked 并交 03/04。

### 7.3 依赖裁剪核对

| 依赖类别 | 本仓概要口径 | 禁止替代 |
|---|---|---|
| compile | 仅 `L0-core` 已核验共享 ref/error/version 契约候选 | 名称相似不等于符号存在；SDK/sibling 不进入 |
| runtime | owner export/query/receiver、governance decision、storage/integrity capability | 不共享数据库、不直接写 owner |
| event | Bus/owner/storage/receiver 的触发与反馈候选 | 到达不等 authority、delivery 或 commit |
| ref | source/decision/artifact/audit/workspace/location/key/receiver/handoff | ref 不等正文、secret 或外部结果 |
| adapter | owner/storage/integrity/KMS/compression/receiver 与下游 SDK | adapter 不定义核心规则 |
| fake | 后续负向和本地分支测试替身 | 不证明真实集成、digest、commit 或 readiness |

### 7.4 完成上限

```text
stable_input = formal_00_and_01
local_skeleton_design = allowed
external_positive_contract = blocked_where_AR_UP_listed
implementation_and_test = not_started
formal_02_write = step_14_only
```

## 8. 回填草稿

正式 §1 摘录 §7.1~7.2；依赖裁剪作为本章边界说明或 §3 输入，不重画架构依赖图。

## 9. 待确认事项

`AR-UP-001~009` 与 `AR-ARCH-001` 原样继承。其影响是限制 exact contract 和正向路径，不阻止 Step 2 收稳本轮范围。

## 10. 进入下一步条件

可承接与不可承接输入、本文不再回答/必须回答及依赖类型已区分；未提前命名对象/API 或补外部 schema。`gate_status = pass_with_upstream_blockers`；允许创建并执行 Step 2。
