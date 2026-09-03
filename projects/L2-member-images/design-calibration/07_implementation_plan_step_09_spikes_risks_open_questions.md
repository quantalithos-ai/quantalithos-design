# 07 Step 9：Spike、风险与待确认事项

> 对应 SOP：`standards/document/实施计划讨论流程_SOP.md` Step 9
> 回填目标：正式 `07-实施计划.md` §9
> 本步状态：`completed_with_explicit_blockers`
> 事实边界：本文件登记设计期不确定性和 future Spike；不把目录、测试、适配器或模拟输出写成已完成事实。

## 1. 输入与风险分类

本步输入为 Step 1 的 blocker、Step 5 的 phase 依赖、Step 6 的 boundary 复核、Step 7 的 gate 矩阵和 Step 8 的配置/环境依赖表。风险分为设计真相源 blocker、owner dependency、implementation prerequisite、evidence/tooling risk 与 future residual；不同类别不能互相抵销。

| 类别 | 识别标准 | 处理上限 |
|---|---|---|
| `design_blocker` | 字段、DTO、状态、UoW、replay、recovery 或 namespace 未闭 | 回写正式 03/04/05/06，冻结新 baseline；不得实现端补口 |
| `owner_blocker` | sibling/上游 schema、release、Artifact、consumer 或 policy 未闭 | 只保留 ref/gap/blocked/unknown；不写正向 ready |
| `environment_blocker` | 目标仓、toolchain、git、证据根未建立 | `blocked / wait_design`；不在设计仓代写代码 |
| `tooling_risk` | runner、JSON schema、digest、report pair 可能漂移 | 先做 contract Spike；没有 raw 就不能生成 EV |
| `residual` | P1/P2、性能、多架构、产品/运维增强 | 独立登记，不进入当前 P0 完成分母 |

## 2. Spike 清单

| Spike | 目标 | 影响 Phase / boundary | 必须产出 | 截止点 | 当前状态 |
|---|---|---|---|---|---|
| `SP-MI-001` | 核验目标仓、workspace、package/crate/binary 命名和 toolchain | PH-01 / `01-a` | preflight 记录与用户改动清单 | 激活 `01-a` 前 | `blocked`：仓不存在 |
| `SP-MI-002` | 核验 `L0-core` shared carrier 是否已导出且兼容 | PH-01 / `01-a` | package/API/source compatibility note | 评估 compile dependency 前 | `blocked`：`MI-UP-004` |
| `SP-MI-003` | 复核 Role-to-image mapping 的 ref/snapshot/gap 形状 | PH-02 / `02-a` | owner contract review input | `02-a` 前 | `pending`：`MI-UP-003` |
| `SP-MI-004` | 复核 member/runtime/tools component/extras release 与 seed placement 接缝 | PH-02 / `02-b` | typed pin compatibility matrix | `02-b` 前 | `pending`：`MI-UP-002/006/008` |
| `SP-MI-005` | 明确 builder/registry、qualification、Artifact 的 safe outcome 和 handoff schema | PH-03~04 / `03-b`,`04-b` | provider-neutral adapter contract | `04-b` 前 | `blocked`：`Q-MI-003/004`,`MI-UP-007` |
| `SP-MI-006` | 闭合 canonical input、stored result、Reserved recovery 和 namespace | PH-03/05/07 | re-opened 03 state/UoW/idempotency design | `03-b` 前 | `blocked`：B01/B02/OPEN-01/02 |
| `SP-MI-007` | 闭合 availability terminal persistence 和 projection unavailable recovery | PH-05/06 | transition/recovery schema and test oracle | `05-a`,`06-b` 前 | `blocked`：B03/PF |
| `SP-MI-008` | 固定 machine artifact JSON、canonicalization、digest 和 same-run pairing | PH-08 | schema/version and writer-reader contract | `08-a` 前 | `pending`：实现仓/runner 未建立 |
| `SP-MI-009` | 复核 24 boundary 的批次规模和 commit body 映射 | 全部 | boundary review note | 每次 handoff 前 | `planned` |

Spike 只输出设计决策、接口缺口或验证输入，不直接创建 provider、scheduler、container、event publisher、Artifact、consumer manifest 或实际证据。

## 3. 风险登记

| 风险 | 描述 | 影响 boundary | 可能后果 | 缓解动作 | 触发的停审 |
|---|---|---|---|---|---|
| `R-MI-001` | 目标实现仓不存在或包含未知用户改动 | `01-a` 及全部 | 无法建立 baseline/编译/证据根 | 建仓后记录 git root/status/user files，先不写实现 | 立即 `blocked` |
| `R-MI-002` | Core carrier 未导出或 package/API 漂移 | `01-a` | 复制/shadow type 或错误 path dependency | 由 Core owner 闭口并核验；本仓 active dependency 维持零 | `MI-UP-004` |
| `R-MI-003` | mapping/component/seed/base 只给名字无可验证 ref | `02-a/b` | 实现端解析字符串、复制 body 或默认值 | 保留 typed gap，回写 owner contract | `MI-UP-002/003/006/008` |
| `R-MI-004` | canonical input/UoW/result/replay 未闭 | `02-c`,`03-a/b`,`07-b` | partial write、伪 replay、重复副作用 | 按 B01/B02 停止，重开 03 Step 6/7/9/11/13 | B01/B02 |
| `R-MI-005` | terminal availability 与 in-flight recovery 未定义 | `05-a`,`07-b` | 复活 terminal、盲重试、状态覆盖 | 不加 lease/TTL/cleanup；重开正式 03 | B03/OPEN |
| `R-MI-006` | projection unavailable 无合法 recovery edge | `06-b`,`07-b` | Query 修复 truth 或 fake 升格 Fresh | 保持 `Unavailable`，由 owner 回写 recovery | PF |
| `R-MI-007` | Artifact/consumer qualification 规则漂移 | `04-b/c`,`05-c`,`08-c` | ACK/digest 被冒充 accepted/confirmation | 只产生 gap/reopen/blocked，分离 06 handoff | MI-UP-001/007,Q-MI-004 |
| `R-MI-008` | inbound/outbound authority 未闭 | `07-a/c` | 私造 envelope、receipt、topic、publisher | marker-only inbound，`NoneAuthorized` outbound | MI-UP-005/009 |
| `R-MI-009` | report/evidence 由静态文件拼接 | `08-a/b/c` | 跨 run、orphan、伪 EV/VETO | 强制 raw→report→EV same-run pair 与 NOSTATIC | GATE-23/24 |
| `R-MI-010` | 兄弟项目并行讨论未停审 | 全部跨仓 seam | 把 pending 写成闭合合同 | 只引用正式已闭合字段，其余标 pending | owner blocker |
| `R-MI-011` | 分层被误解为七个常驻服务或部署单元 | `01-a`,`07-c` | 越界容器/生命周期实现 | 以职责型 workspace 解释，禁止部署推断 | GATE-01/21 |
| `R-MI-012` | P1/P2 性能、多架构或产品需求污染 P0 | `02~08` | 分母扩大或 readiness 误宣称 | residual/future 单列，需新授权和新 baseline | cross-gate audit |

## 4. 待确认事项与重开条件

| 事项 | owner | 当前 | 影响 | 重开条件 | 未确认前行为 |
|---|---|---|---|---|---|
| `Q-MI-001` member-service exact consumer manifest/variant/ref | `L2-member-service` | pending | `05-c`、`ResolveInstantiableEntry` | sibling 正式停审并提供可验证 contract | `ConsumerHandoffGap`/`Unavailable` |
| `Q-MI-002` member component release/compatibility | `L2-member` + runtime | pending | `02-b` | release/ref/schema 正式闭合 | blocked/gap |
| `Q-MI-003` builder/registry outcome and candidate ref | builder owner | pending | `03-b/c` | provider-neutral port 与 oracle 闭合 | no candidate/digest |
| `Q-MI-004` qualification/BOM/signature/evidence policy | governance/security/Artifact | pending | `04-a/c` | policy + Artifact handoff schema 闭合 | unknown/blocked/gap |
| `DDD-S9-B01/B02` canonical mutation and stored replay | 本仓 owner | blocked | 所有写 Command/Job | 03 重新闭合 input/UoW/result/ref | current zero-effect |
| `DDD-S11-B03` terminal transition persistence | 本仓 owner | blocked | `05-a` | history/version/transaction source 完整 | no terminal mutation |
| `DDD-S13-OPEN-01/02` in-flight/namespace | 本仓 owner | blocked | `03-b`,`07-b` | recovery/namespace matrix 重开 | no reserve/replay |
| `PF-UNAVAILABLE-RECOVERY` | 本仓 owner | blocked | `06-b`,`07-b` | formal projection recovery function/port | `Unavailable` only |
| machine artifact schema/digest | test/evidence owner | pending | `08-a/b` | writer/reader/schema/version 定稿 | no evidence instance |

## 5. 设计回写与风险接受边界

风险处理动作按以下顺序执行：登记 → 指定 owner → 明确影响 boundary → 回写真相源 → 固定新 baseline → 重核 Step 6/7 → 重新决定是否激活。实现端不能通过私有 alias、默认值、fake、cache、ACK、bare digest、manual report 或风险接受关闭 S/VETO/设计 blocker。

| 情况 | 可否风险接受 | 原因 |
|---|---|---|
| raw secret/body、Query write、fake positive、unauthorized outbound、staged readiness | 否 | 属于安全/真相红线和 VETO |
| B01/B02、B03、OPEN/PF、MI-UP/Q-MI 未闭 | 否（当前实施） | 不是 observed residual，而是设计/owner blocker |
| future P1/P2 性能或产品增强未选入 | 仅由 06 授权角色按正式规则处理 | 不得进入本轮 P0 分母 |
| 文案、链接或非关键 report 格式 | 可在 future 06 规则下记录 B/C | 不能改变 P0 truth 或 evidence pairing |

## 6. 回填草稿与进入下一步

### 回填草稿（正式 §9）

实施先执行 `SP-MI-001/002/008` 等前置 Spike，再按 owner 和设计 blocker 逐步解锁 boundary。所有未闭事项必须绑定 owner、影响 Phase、截止/触发和重开位置；在确认前保持 blocked、gap、unknown 或 unavailable，不得写成候选 digest、Artifact、consumer 或 readiness。

### 进入 Step 10 条件

- Spike 有明确输出和截止点。
- 风险均绑定 Phase/boundary、缓解动作和停审触发。
- 待确认事项有 owner、重开条件和未确认前姿态。
- 风险接受边界不覆盖 S/VETO/设计 blocker。

**Step 9 结论：`completed_with_explicit_blockers`。**

## Step 状态

`completed_with_explicit_blockers`

## 本步输入

Step 1/5/6/7/8、正式 00/03/04/05/06 风险

## 本步输出

Spike、风险、待确认、owner/reopen

## 事实边界

所有 blocker 保留 blocked/pending；所有真实执行事实仍保持未生成。

## SOP 问题回答

1. 哪些点先做 Spike？——目标仓/Core、owner refs、recovery/namespace、artifact schema。
2. 哪些风险会阻塞？——B01/B02/B03/OPEN/PF、MI-UP/Q-MI、仓库和证据工具链。
3. 每个 Spike 输出什么？——compatibility note、typed contract、reopen design input 或 writer/reader schema。
4. 风险能否接受？——S/VETO/设计 blocker 不可接受；P1/P2 由 06 authority 另行裁决。
## 当前文档问题诊断

- 未闭 blocker 不能伪装成普通工程风险。
- 并行 sibling 的 pending 输入没有正式 owner contract。
- 机器证据 schema 尚无实际 runner。
## 改动前后对比

| 项 | 之前 | 本步后 |
|---|---|---|
| 风险 | 分散在 00~06 | 统一 SP/R/Q 编号并绑定 boundary/owner |
| 待确认 | 无截止点风险 | 有重开条件和未确认姿态 |
| 接受 | 容易与 blocker 混淆 | S/VETO/设计 blocker 明确不可接受 |
## 设计取舍

- 采用 owner+重开条件而非泛化“后续确认”。
- 将 implementation prerequisite 与 owner/design blocker 分层。
- 保留性能、多架构和产品项为 residual/future。
## 结构化中间产物

本步结构化产物是 9 个 Spike、12 个风险、待确认事项/重开表和风险接受边界。
