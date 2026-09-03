# 07 Step 8：配置、环境与外部依赖准备

> 对应 SOP：`standards/document/实施计划讨论流程_SOP.md` Step 8
> 回填目标：正式 `07-实施计划.md` §8
> 本步状态：`completed_with_explicit_blockers`
> 事实边界：只定义实施前检查、配置绑定和依赖分类；不创建实现仓、不安装依赖、不运行测试、不宣称外部服务可用。

## 1. 输入与原则

本步承接正式 `03-详细设计.md` §3、§13，`04-配置设计.md` §3~§14，`05-测试方案.md` §8~§9，Step 3 前置检查和 Step 5 phase 顺序。配置只能绑定既有 typed slot；不能改变 truth ownership、状态矩阵、UoW、幂等、Query no-write、marker-only inbound 或 outbound zero。

| 依赖类别 | 本项目处理方式 | 当前状态 |
|---|---|---|
| `compile` | 仅在 `MI-UP-004` 闭合并核验 Core package/API 后评估 conditional path dependency | 当前 active sibling compile dependency 为零 |
| `runtime` | 通过 application port / infra adapter / controlled seam | owner contract 未闭时 blocked/gap |
| `event` | 仅保留两个 marker-only inbound 方向；无 outbound | `MI-UP-005/009` pending |
| `ref` | typed ref、safe snapshot、safe conclusion 或 gap | 不复制 owner body |
| `adapter` | provider-neutral port 与 conservative outcome | 不探测 provider、不生成成功事实 |
| `fake` | 只在 `ci-test + TestOnly` 显式组合 | 不得泄漏到其他 profile |

## 2. 实施前准备顺序

#### 环境准备图：从设计基线到当前 boundary

```text
[authorized 07 handoff]
  -> [target worktree + user-change inventory]
  -> [immutable formal 00-07 baseline]
  -> [repo-local git identity]
  -> [Rust/toolchain preflight]
  -> [Core compatibility check]
  -> [workspace/package/name/dependency scan]
  -> [strict five-domain config validation]
  -> [profile + fake isolation]
  -> [current boundary Design/Scope/Worktree gates]
```

关键说明：

- 图表达实施激活顺序，不表达部署拓扑、容器、网络、CI、scheduler 或 provider readiness。
- 任一前置缺失时只能停在对应 boundary；不能用后续构建或 fake 反推前置通过。
- 当前目标实现仓不存在，因此 `commit-01-a` 仍为 `blocked / wait_design`。

## 3. 仓库、工具链与目录检查

| 检查项 | 目标 / 记录内容 | 当前状态 | 不可用处理 |
|---|---|---|---|
| target repository | `/home/aris/Projects/quantalithos-member-images` 精确 git worktree、branch、HEAD、status、用户文件 | `absent` | 不在设计仓创建代码；保持 `blocked`。 |
| design baseline | 正式 00~07 与对应 calibration 的不可变身份 | `not_fixed_until_handoff` | 不以日期、dirty HEAD 或文件名冒充。 |
| git identity | repo-local `quantalithos-labs` / `quantalithos.ai@gmail.com` | `not_run` | Commit Gate blocked；不修改 global。 |
| Rust toolchain | edition 2024、MSRV 1.93 兼容性、实际 `rustc`/`cargo` 版本 | `pending` | 目标仓建立后 preflight；不写 readiness。 |
| workspace | `contracts/domain/application/infra/api/worker/jobs` 七单元 | `not_created` | naming/dependency gate blocked。 |
| package/crate | `member-images-*` / `member_images_*`，无架构层编号泄漏 | `planned` | 回写 03/07，不自行改名。 |
| scripts/roots | `scripts/gates`、`scripts/reports`、`scripts/checks`；artifacts/reports 固定根 | `planned` | 只记录缺口，不生成实例。 |

## 4. 配置控制面与 profile

正式 `04-配置设计.md` 固定五域、21 key、strict JSON、startup-only 和 fail-closed。实现期只能使用一个项目级 source；不允许环境变量 leaf merge、unknown key、alias、trailing comma、LKG、partial apply、hot reload 或隐藏 default。

| 配置域 | 设计用途 | 失败姿态 | 不得配置化 |
|---|---|---|---|
| `composition` | profile/mode/harness 与 local assembly | whole-config `Blocked` | owner decision、状态、readiness |
| `local_persistence` | local truth/history/projection/idempotency slot | required slot `Blocked` | 外部 database 产品与 lifecycle |
| `static_references` | mapping/component/seed/base 的 typed ref/placement | missing/mutable/unknown -> `Blocked/Gap` | owner body、live memory/workspace |
| `external_boundaries` | builder/qualification/Artifact/member-service seam selector | pending -> `Blocked/Unknown/Gap` | provider endpoint、credential、Artifact/consumer body |
| `diagnostics` | safe diagnostic category | reject raw/sensitive | debug bypass、raw output、secret |

| Profile | 允许内容 | fake | 证据上限 |
|---|---|---|---|
| `local-dev` | local contract、safe absence、controlled ref | 不自动绑定 | design/local semantics |
| `ci-test` | deterministic fixture、fault seam | 仅显式 `TestOnly` | negative/no-write/fake parity |
| `integration-like` | controlled runtime/adapter/ref seam | 禁止 fallback fake | candidate/blocked/gap |
| `staging-like` | future owner-closed controlled adapter | 禁止 TestOnly fake | P1/P2 candidate，不 readiness |
| `production-like` | future approved composition | 禁止 fake | 需新 baseline 与授权 |

## 5. 上游与 sibling 依赖准备表

| 依赖 | 类型 | 受影响 Phase | 提供方 / owner | 当前检查 | 不可用处理 |
|---|---|---|---|---|---|
| `L0-core` shared carrier | conditional `compile` | PH-01 | `L0-core` | 检查 package/crate/export/API 与 immutable baseline | `MI-UP-004`；active dependency 维持零。 |
| `L3-method-library` Role/mapping | `runtime + ref` | PH-02 | Method Library | 只验证 typed ref/safe snapshot/gap 形状 | `MI-UP-003`；不读 body、不 hardcode。 |
| `L2-runtime` components/extras | `runtime + ref` | PH-02 | Runtime | 检查 immutable component/extras ref | `MI-UP-002`；blocked/gap。 |
| `L2-tools` controlled capabilities | `runtime + ref` | PH-02/03 | Tools | 检查 typed capability/release ref | pending；不做 execution。 |
| seed/template owner | `ref + adapter` | PH-02 | member/member-service/seed owner | 检查 static placement/ref | `MI-UP-006`；不读 live state。 |
| builder/registry | `runtime + adapter` | PH-03 | builder owner | 仅检查 boundary kind/contract selector | `Q-MI-003`；不产生 candidate/digest。 |
| governance/qualification | `runtime + adapter + ref` | PH-04 | governance/security | 检查 safe conclusion/gate ref | `Q-MI-004`；blocked/unknown。 |
| `L1-artifact` | `ref + adapter` | PH-04/05 | Artifact owner | 检查 handoff relation shape | `MI-UP-007`；不 mint Artifact acceptance。 |
| `L2-member-service` | `runtime + ref + adapter` | PH-05 | sibling owner | 检查 consumer selector/entry seam | `MI-UP-001`；`ConsumerHandoffGap`。 |
| Bus / event authority | `event + adapter` | PH-07 | Core/Bus owner | 检查是否正式授权 inbound | `MI-UP-005/009`；marker-only、zero outbound。 |
| Sandbox/base | `ref + adapter` | PH-02 | Sandbox owner | 检查 base ref kind/scope | `MI-UP-008`；blocked/gap。 |

## 6. Fake / mock 使用边界

| 使用场景 | 允许 | 禁止 |
|---|---|---|
| local repository/UoW/CAS | deterministic local/CI fake | 把 fake persistence 当生产 durability |
| external ref/provider seam | finite blocked/unknown/gap fake | fake success 关闭 owner blocker |
| redaction/fault injection | TestOnly fixture | raw secret/body 流入任何输出 |
| API/worker/jobs | facade mapping fake | direct store/adapter/event bus |
| acceptance/report | report generator test fixture | 手写 passed、静态 EV/VETO 或 readiness |

Fake 必须复用正式错误、状态、safe disposition 和 no-write 规则；任何 fake、cache、ACK、registry presence、tag、bare digest 都不能生成 `Eligible`、`Available`、Artifact acceptance、consumer confirmation 或 readiness。

## 7. 阶段级准备与失败处理

| Phase | 进入前准备 | 当前可做 | 外部缺口处理 |
|---|---|---|---|
| PH-01 | target repo、baseline、Rust/Core preflight | 设计校准和 planned ledger | repo/baseline 缺失即 blocked。 |
| PH-02 | contracts、local fake、ref shape | pure definition/assembly guard | component/mapping/seed/base pending -> negative only。 |
| PH-03 | build contracts、bounded selector | outcome/unknown/blocked mapper | B01/B02 -> no candidate/digest。 |
| PH-04 | safe gate/provenance carrier | qualification gap/redaction | Q-MI/Artifact pending -> no positive eligibility。 |
| PH-05 | local availability/read model | local query/no-write | B03/member-service pending -> no terminal/confirmation。 |
| PH-06 | query/view/freshness carrier | strict Query/marker mapping | PF -> `Unavailable`；不 repair。 |
| PH-07 | inbound/job contract | marker-only/bounded job | MI-UP-005/B01/PF -> no receipt/scheduler/recovery。 |
| PH-08 | runner/report contract | planned script/report shell | no target repo/run -> not_generated。 |

## 8. 配置与依赖停审审计

| 审计项 | 结论 | 处置 |
|---|---|---|
| 依赖分类 | `compile/runtime/event/ref/adapter/fake` 已区分 | 消费关系不自动转 Cargo dependency。 |
| active sibling compile | 零 | `MI-UP-004` 闭合前不加 path dependency。 |
| strict config | 五域 21 key、startup-only、fail-closed | 不添加 key、default、reload 或 LKG。 |
| profile/fake | 仅 `ci-test + TestOnly` | 生产/集成 profile fake leak 即 S/VETO。 |
| owner blocker | MI-UP/Q-MI、B/PF 显式保留 | 不由配置、cache、ACK、fake 关闭。 |
| environment fact | 目标仓缺失，未运行 preflight | 不写工具链、服务、run 或 readiness 事实。 |

## 9. 回填草稿、待确认事项与进入下一步

### 回填草稿（正式 §8）

实施前先核验目标仓、immutable baseline、repo-local git identity、Rust/Core compatibility、七单元 workspace、严格五域配置与 profile/fake 隔离；依赖按 compile/runtime/event/ref/adapter/fake 分类。目标仓缺失、Core shared carrier 未核验、owner 合同未闭或 PF/B01/B02/B03 未解除时，保持 `blocked / wait_design`，只允许 local pure contract、no-write、marker、gap 或 bounded selector。

### 待确认事项

1. 目标实现仓建立及其 repo-local git identity。
2. `MI-UP-004` 是否最终导出可消费 Core carrier；若否，需先回写上游而非本仓复制。
3. 各 sibling/owner 的 selector、schema、profile 和正向资格何时闭合。
4. 未来 machine artifact JSON schema、digest algorithm 与 report writer 是否维持 05/06 口径。

### 进入 Step 9 条件

- 依赖类别、准备方式、阶段使用、失败姿态和 fake 边界完整。
- 配置 key/profile/strict/fail-closed 约束与正式 04 一致。
- 不可用依赖不会被实现者临场替换成默认、cache 或 fake success。

**Step 8 结论：`completed_with_explicit_blockers`。**

## Step 状态

`completed_with_explicit_blockers`

## 本步输入

正式 03/04/05、Step 3/5/7、目录与 Rust/ledger 规范

## 本步输出

环境准备、五域 21 key、依赖分类、fake boundary

## 事实边界

配置/环境 planned contract，不绑定真实依赖；所有真实执行事实仍保持未生成。

## SOP 问题回答

1. 依赖如何分类？——compile/runtime/event/ref/adapter/fake 分开登记。
2. 配置如何生效？——严格五域 21 key，startup-only whole-candidate validation。
3. fake 何时允许？——仅 `ci-test + TestOnly`。
4. 依赖不可用时怎么办？——blocked/gap/unknown/unavailable，不用 default/cache/fake success。
## 当前文档问题诊断

- 目标实现仓、toolchain、Core compatibility 尚未核验。
- sibling 消费关系容易被误写为 Cargo path dependency。
- 配置不能改变业务 truth 或 blocker。
## 改动前后对比

| 项 | 之前 | 本步后 |
|---|---|---|
| 环境 | 分散在上游文档 | 有统一 preflight 顺序和失败姿态 |
| 依赖 | 只写消费关系 | 明确六类依赖与协作方式 |
| fake | 容易默认可用 | profile/entry 隔离且禁止正向伪成功 |
## 设计取舍

- 不选定具体数据库、broker、builder、registry 或 secret backend。
- 用 provider-neutral adapter seam 保留 future qualification。
- 采用 whole-config reject，避免 partial apply。
## 结构化中间产物

本步结构化产物是环境准备图、仓库/toolchain 检查表、五域配置矩阵、依赖准备表和 fake/mock 边界表。
