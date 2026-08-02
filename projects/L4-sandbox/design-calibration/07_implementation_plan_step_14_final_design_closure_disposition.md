# L4-sandbox 最终设计闭环 Step 14 未决项裁决与处置登记

> 对应临时执行计划: `/tmp/L4-sandbox_final_design_closure_execution_plan.md` `DC-01`
> 上游计划: `07_implementation_plan_step_13_formal_document_assembly.md`
> 状态: `completed_design_static_only`
> 当前文档: `07-实施计划.md`
> 当前 Step: `Step 14 / DC-01 未决项裁决`
> 设计范围: 只分类设计链遗留项、设计决策项、Activation 现实前置和未来范围触发器；不实现代码、不执行测试、不生成 run/evidence/验收/commit 事实。

---

## 1. 输入门禁与判断方法

| 输入 | 读取结论 | 用途 |
|---|---|---|
| 正式 `00~07` | 当前正式设计包齐全；正文包含历史待确认项和当前实施门禁 | 分辨“当时未定”与“当前仍未定” |
| `00~07` calibration flow | `02~07` 已有 `v7.9-closeout` current 状态；`00/01`仍有旧 EOF 状态 | 识别真相源冲突 |
| `project_execution_ledger.md` | 设计恢复历史较长，物理 EOF 为 `v7.9-closeout` | 保留历史，确定项目 current source |
| `implementation_execution_ledger.md` | 32 boundary 已创建，目标实现仓不存在，实现未开始 | 区分实现 Activation blocker 与设计缺口 |
| `03` Step 19 / `07` Step 13 | 正式 `03~07` 的 current contract、库存和静态传播已声明完成 | 检验下游解决覆盖面 |
| 32 Boundary skeleton | 32/32 非空；仅少数文件保留工具/环境前置说明 | 检验是否有实现者必须自行补设计的占位 |

判断原则：物理 EOF 的 current override 只在同一真相源内部覆盖历史恢复快照；它不能替代真实 commit、运行结果、资格包、review 或验收签署。

---

## 2. 四类处置闭集

| disposition | 判定条件 | 设计侧动作 | 是否阻塞设计移交 |
|---|---|---|---|
| `resolved_by_downstream_design` | 后续正式文档已经给出 exact schema/port/state/flow/config/test/acceptance 口径 | 保留历史记录，增加 current resolution ref；清理 active 状态冲突 | 否 |
| `activation_dependency` | 需要真实目标仓、工具安装、provider、CI、权限、运行或 review authority | 保留 exact blocker、owner、boundary、证据要求和 fail-safe 路由 | 否；阻塞对应 Activation |
| `future_scope_design_reopen` | 当前明确不在 P0/当前范围，未来 scope 变化才需要设计 | 记录 trigger 和受影响文档；禁止当前实现私自扩展 | 否 |
| `actual_design_gap` | 实现 agent 仍需要自行选择正式语义或补 owner | 回写对应设计 Step 和 downstream contract；在关闭前不得移交 | 是 |

禁止使用 `resolved` 作为无证据的泛称。设计静态关闭必须写 `resolved_for_design_static_closeout`；运行/资格/验收关闭必须由真实 evidence 另行记录。

---

## 3. 设计链状态冲突裁决

| 原记录 | 当前事实 | disposition | current 处置 |
|---|---|---|---|
| `00` flow: `04-配置设计.md` missing | 正式 `04-配置设计.md` 已存在，且 `04_config_calibration_flow.md` 为 current closeout | `resolved_by_downstream_design` | `SBX-DOC-GAP-001` 仅保留为 historical gap；新增 current resolution ref 指向 `04` Step 15 和 `07` Step 13 |
| `00` flow: `07-实施计划.md` missing | 正式 `07`、implementation ledger、32 skeleton 已存在 | `resolved_by_downstream_design` | `SBX-DOC-GAP-002` 仅保留为 historical gap；新增 current resolution ref 指向 `07` Step 13 |
| `01` flow: `completed_wait_user_review` | 用户后续确认已被 `02~07` current closeout 消费；`01` 正式文档已作为下游输入 | `resolved_by_downstream_design` | 保留用户 review 历史；current 状态切换为 `completed_current_closeout` |
| `01` flow: `04/07` missing | 同上 | `resolved_by_downstream_design` | 标注为 historical/superseded，不再作为 current blocker |
| implementation ledger: 11 个 `downstream_revalidation_pending` | `03` Step 19 和 `07` Step 13 已完成 `04~07` static revalidation | `resolved_by_downstream_design` | overlay 改为 `completed_design_static_only`，保留 implementation status `planned/wait_until_current` |

这些处置不修改当时记录的发生时事实，也不将任何 boundary 激活。

---

## 4. 技术前置裁决

| blocker | 设计层判断 | disposition | 当前保留动作 |
|---|---|---|---|
| `BLK-SBX-VERSION-001` | 目标实现仓 exact manifest 尚未落盘，但组织现有 Rust 基线为 edition `2024` / rust-version `1.93`；实现仓兼容性仍需真实核验 | `activation_dependency`，设计决定待 `DC-02` 固定 | 设计 owner 固定目标值和 core revision 绑定规则；目标仓 bootstrap 前做真实 manifest/graph 核验 |
| `BLK-SBX-CANONICAL-001` | 业务契约已固定 RFC 8785、UTF-8、self-digest 排除和 SHA-256 profile；writer/verifier 具体实现仍未选 | `actual_design_gap` 的工具选择部分，转 `DC-02` | 设计 owner 固定 provider-neutral implementation strategy、版本锁定方式和 fixture contract；fixture 执行仍属 Activation/Build |
| `BLK-SBX-SHELL-001` | 17 个脚本入口和失败传播语义已固定；dialect/lint exact contract 未固定 | `actual_design_gap` 的规则选择部分，转 `DC-02` | 设计 owner 固定 Bash 入口、strict mode、lint/equivalent check 和 safe nonzero 规则；实际 lint 仍未执行 |
| `BLK-SBX-BASELINE-001` | 设计仓尚无可复现 commit baseline | `activation_dependency` | 保持 open；仅在 `DC-07` 经用户授权形成真实 commit 后关闭 |
| `BLK-SBX-REPO-001` | `/home/aris/Projects/quantalithos-sandbox` 不存在 | `activation_dependency` | 保持 open；实现 agent/owner 后续处理，不在设计仓创建代码 |
| `BLK-SBX-GIT-001` | 目标仓 local identity/hooks 尚未核验 | `activation_dependency` | 保持 open；不得用设计仓身份代替目标仓事实 |
| `BLK-SBX-P0Q-001` | candidate、ENV-05、provider/material/lab packet 未形成 | `activation_dependency` | P0-Q 保持 blocked + zero launch，不反向削弱 P0-C 设计 |
| `BLK-SBX-CI-001` | CI provider/workflow/source authority 未形成 | `activation_dependency` | local fixture 可设计；不得声明 CI/source 存在 |
| `BLK-SBX-REVIEW-001` | 实际 reviewer/acceptor/signer identity 未形成 | `activation_dependency` | 保持 acceptance `NotEntered`，不得预填签署 |

---

## 5. Future scope / DesignReopen 条目

以下条目不是当前设计缺口，且不得由实现 agent临时扩大范围：

| 条目 | 触发条件 | 处置 |
|---|---|---|
| P06/P07 production 或 long-soak/fleet rollout | 产品明确进入生产或 fleet 交付 | DesignReopen，重审 `00~07` 的范围、NFR、配置、测试、验收和实施计划 |
| 高级 replay/inspect/operator control、trend、backend comparison | 被提升为当前核心能力或验收前置 | DesignReopen；当前仅保留只读派生/外围增强边界 |
| retention physical carrier/TTL、法规/合同义务 | 形成权威 records/compliance 条件 | 进入对应 `04/05/06/07` owner，形成条件化 gate；不得猜测天数 |
| operator delegation 或新的 actor authority | 新 actor kind 或授权路径进入 P0 | 重开 actor/authority contract、状态/错误/测试/验收映射 |

---

## 6. DC-01 完成判定

| 检查项 | 结果 |
|---|---|
| 所有已知 stale document-gap 记录均已分类 | 通过，2 项 `resolved_by_downstream_design` |
| 所有 implementation blocker 均已区分 design 部分和 Activation 部分 | 通过，9 项均有 exact route |
| RFC 8785 与 Shell/lint 未被错误写成 runtime 已通过 | 通过 |
| future scope 未混入当前 P0 主线 | 通过 |
| actual design gap 是否仍存在 | 仅剩 DC-02 技术决策待执行；无 schema/port/state/flow owner 缺口 |

```text
dc_task = DC-01
dc_status = completed_design_static_only
disposition_count = resolved_by_downstream_design:5|activation_dependency:7|actual_design_gap_to_DC-02:2|future_scope_design_reopen:4
new_l1_l2_blocker = 0
implementation_started = no
real_test_execution = not_started
real_evidence_created = no
acceptance_signoff = no
commit_required = no
next_allowed_action = start_DC-02_technical_decision_register
```
