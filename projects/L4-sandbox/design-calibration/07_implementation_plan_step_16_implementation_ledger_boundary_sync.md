# L4-sandbox Step 16. Implementation Ledger 与 Planned Boundary 同步

> 对应临时执行计划: `/tmp/L4-sandbox_final_design_closure_execution_plan.md` `DC-05`
> 上游输入: Step 13~15、正式 `00~07`、implementation ledger、32 件 planned boundary skeleton
> 状态: `completed_design_static_only`
> 范围: 只同步设计移交真相源；不激活 Boundary，不创建目标仓，不运行测试，不生成 evidence，不提交 commit。

---

## 1. Step 状态与开工门禁

| 项 | 结果 |
|---|---|
| 项目台账恢复点 | `DC-05_implementation_ledger_and_boundary_sync` |
| 文档级 flow | Step 15 技术基线决策已完成，允许同步 ledger / Boundary |
| 上游正式文档 | `00~07` final-closure 回填已完成 |
| 主体设计是否重开 | 否 |
| 实现仓是否存在 | 否 |
| 允许写实现代码 | 否 |
| 允许产生运行事实 | 否 |

## 2. 输入与必读结论

| 输入 | 本 Step 消费的 current truth |
|---|---|
| `07_implementation_plan_step_14_final_design_closure_disposition.md` | 未决项必须分为 downstream resolved、Activation dependency、future scope 或 actual design gap |
| `07_implementation_plan_step_15_technical_baseline_decisions.md` | Rust/core、canonical、Shell/lint 的设计选择唯一；现实验证仍未运行 |
| 正式 `03/05/06/07` | 技术基线、planned verification、验收传播和 handoff 路由已回填 |
| `implementation_execution_ledger.md` | 唯一 current Boundary、blocker、overlay、真实性计数的项目级入口 |
| 32 件 `implementation-boundaries/CB-SBX-*.md` | 每个 Boundary 的 allowed/forbidden scope、checks、Gate 和初始事实 |
| 代码实施台账规范 | `blocked` 只能路由 `wait_design`、`fix_gate_failure` 或 `handoff`；future Boundary 必须 `planned / wait_until_current` |

## 3. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 当前是否仍有实现者必须自行做出的设计选择 | 否；三项技术选择已由 Step 15 固定 |
| 旧 blocker 是否可以直接删除 | 否；保留原 ID 追溯，并标为 `resolved_for_design_selection` |
| 尚未运行的现实验证如何表达 | 拆为 `TOOLCHAIN/CANONICAL/SHELL-VERIFY` Activation blocker |
| baseline 未提交是否代表设计语义未闭合 | 否；它代表尚未形成可复现发布载体，继续开放 `BLK-SBX-BASELINE-001` |
| 是否可以把 Step 15 观察写成 target build/test pass | 否；目标仓不存在，所有 target check 保持 `not_run` |
| planned Boundary 是否需要逐件改为 ready | 否；31 件 future Boundary 必须保持 `planned / wait_until_current` |
| 是否允许 01A 继续 `wait_design` | 技术选择已闭合，current安全路由改为 `blocked / activation_gate / handoff`；真实 API 冲突时才回 `wait_design` |

## 4. 问题诊断与前后对比

| 面 | 同步前 | current 同步后 |
|---|---|---|
| 11 项 downstream overlay | `downstream_revalidation_pending` | `completed_design_static_only`，回指 Step 19 / Step 13 / final closure |
| Rust/core blocker | 同时混合设计选择和现实核验 | VERSION 设计选择 resolved；TOOLCHAIN-VERIFY 开放 |
| canonical blocker | 同时要求选 provider 和跑 fixtures | CANONICAL 设计选择 resolved；CANONICAL-VERIFY 开放 |
| Shell blocker | 同时要求定规则和跑 lint | SHELL 设计选择 resolved；SHELL-VERIFY 开放 |
| `CB-SBX-01A` 路由 | `blocked / wait_design` | `blocked / activation_gate / handoff` |
| `CB-SBX-02C/02D` | 含“待 design owner 固定” | 精确依赖、算法、Shell 和 exit contract；运行状态仍 `not_run` |
| `CB-SBX-14A~14C` | 可能被理解为自行选择工具 | 明确复用 02C/02D owner；CI/review 保持 Activation 事实 |

## 5. Current Blocker 闭集

| blocker | status | owner | 关闭证据 | 失败路由 |
|---|---|---|---|---|
| `BLK-SBX-BASELINE-001` | `open_wait_explicit_commit_authorization` | design owner / user | 用户明确授权后的真实 design commit hash | `handoff` |
| `BLK-SBX-REPO-001` | `open` | implementation owner | 目标仓 root、HEAD、初始 worktree | `handoff` |
| `BLK-SBX-TOOLCHAIN-VERIFY-001` | `open_activation_validation` | implementation/build owner | manifest/toolchain/core HEAD/API/graph/Cargo checks | dependency failure `handoff`；API conflict `wait_design` |
| `BLK-SBX-GIT-001` | `open` | implementation owner | local identity、hooks、branch/commit policy | `handoff` |
| `BLK-SBX-CANONICAL-VERIFY-001` | `open_activation_validation` | evidence/tooling owner | exact resolution及官方/负向/roundtrip fixtures | `handoff`；schema conflict `wait_design` |
| `BLK-SBX-SHELL-VERIFY-001` | `open_activation_validation` | automation owner | Bash、17/17 syntax、ShellCheck、negative/exit fixtures | `handoff`；contract conflict `wait_design` |
| `BLK-SBX-P0Q-001` | `open` | qualification owner | candidate / profile / provider / material / lab packet | `handoff` |
| `BLK-SBX-CI-001` | `open` | CI/release owner | CI binding、credential-safe invocation、source authority | `handoff` |
| `BLK-SBX-REVIEW-001` | `open` | review/acceptance owner | 真实 reviewer / acceptor / signer identity与authority | `handoff` |

原 `BLK-SBX-VERSION-001`、`BLK-SBX-CANONICAL-001`、`BLK-SBX-SHELL-001` 保留为
`resolved_for_design_selection`，不再出现在 open Activation blocker 闭集中。

## 6. 六件受影响 Boundary 同步

| Boundary | current 设计绑定 | 保持开放的现实面 |
|---|---|---|
| `CB-SBX-01A` | edition `2024`、rust-version `1.93`、toolchain `1.93.0`、resolver `2`、core path/revision | baseline、repo、toolchain/core核验、git |
| `CB-SBX-02C` | `serde_json_canonicalizer = "=0.3.2"`、`serde_json = "=1.0.145"` + `float_roundtrip`、`sha2 = "=0.10.9"`，02C唯一owner | dependency resolution、fixtures |
| `CB-SBX-02D` | Bash `>=5.2`、strict mode、ShellCheck `0.10.0`、`0/2/3/4/5/6/>=7`映射 | runtime、17/17 syntax/lint、negative fixtures |
| `CB-SBX-14A` | 复用02D Shell contract | 前序、Shell验证、CI/source binding |
| `CB-SBX-14B` | 复用02C canonical owner与02D Shell contract | canonical/Shell验证、raw/report pairing |
| `CB-SBX-14C` | 复用02D Shell contract，继续 draft-only authority | Shell验证、review/acceptance authority |

六件 Boundary 的 `design_baseline` 仍为 `not_fixed`。02C/02D/14A~14C 仍是
`planned / wait_until_current`，没有因设计选择闭合而提前激活。

## 7. 32/32 Skeleton 反向扫描

| 检查项 | 结果 |
|---|---|
| 文件存在性 | `32/32` |
| `boundary_id` 唯一字段 | `32/32` |
| `design_baseline` 字段 | `32/32 = not_fixed` |
| `status` 字段 | `01A = blocked`；其余 `31 = planned` |
| `next_allowed_action` header | `01A = handoff`；其余 `31 = wait_until_current` |
| Gate Matrix | `32/32` |
| Initial Fact Boundary | `32/32` |
| 实现已开始 | `0/32` |
| stale inventory 命中 | `0` |
| old port / `wait_dependency` 命中 | `0` |
| active `downstream_revalidation_pending` | `0`；只允许 historical occurrence |

其余26件 Boundary 无技术选择差异，不做批量文本重写。它们 blocker 表中的 baseline 等待不覆盖 header 的
`planned / wait_until_current`；未来只有项目级 ledger 能推进唯一 current。

## 8. 真实性边界

| 事实 | current value |
|---|---|
| implementation repo | absent |
| implementation commit | `0 / not_committed` |
| run | `0 / absent` |
| test result | `not_started / not_run` |
| evidence alias | `absent` |
| review | `not_reviewed` |
| acceptance | `NotEntered` |
| acceptance signoff | no |
| code modification authorization | no |
| design commit authorization | no |

## 9. 回填草稿与写入处置

- implementation ledger 顶部 current state、Boundary Ledger、11项overlay和Blocker Register作为current查询入口。
- implementation ledger物理EOF增加`DC-05` override，覆盖历史`v7.9-closeout`恢复点。
- 六件受影响Boundary增加Step 15 Required Read、精确blocker拆分和物理EOF current override。
- 项目ledger与flow切换到`DC-06_final_design_static_audit`。
- 本 Step 不回填正式`07`主体章节；正式`07`已在DC-04完成技术决定汇总。

## 10. 完成门禁

| 门禁 | 结果 |
|---|---|
| 实现者无需选择schema、port、state、algorithm或tool口径 | 通过 |
| 设计选择与Activation验证分离 | 通过 |
| 32件Boundary单current规则 | 通过 |
| 未伪造实现、commit、run、test、evidence或验收 | 通过 |
| 可进入DC-06 | 通过 |

```text
dc_task = DC-05
dc_status = completed_design_static_only
affected_boundary_sync = 6/6
boundary_reverse_scan = 32/32
current_boundary = CB-SBX-01A
current_boundary_status = blocked|activation_gate|handoff
future_boundary_status = planned|wait_until_current|31/31
next_allowed_action = DC-06_final_design_static_audit
commit_required = no
```
