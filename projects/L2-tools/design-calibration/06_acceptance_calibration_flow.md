# L2-tools 06 验收标准校准流程

> 创建日期：2026-08-07
> 当前模式：full-restart
> 当前状态：`06_completed_stop_review`
> 当前任务：已按 `验收标准讨论流程_SOP.md` 串行完成并终检 `06-验收标准.md`
> 正式文档写入门禁：已关闭；等待用户审阅，不自动进入 `07-实施计划.md`

---

## 1. 执行边界

| 项 | 当前口径 |
|---|---|
| 当前 truth source | 当前正式 `00-需求文档.md` 至 `05-测试方案.md`；精确字段继续回指相应 calibration Step / annex |
| 历史材料 | 旧 `06-验收标准.md`、README 和旧测试 / 签署叙事仅作 `historical_material` 差异审计 |
| 证据事实 | 本流程只定义未来 evidence consumer 和裁决合同；不生成或声称 run、artifact、digest、测试结果、缺陷实例、风险接受或签署 |
| 开放 blocker | `L2T-UP-001~009` 继续开放；local / negative / blocked-aware 验收可设计，受影响 external positive qualification 必须保持不可裁决或有条件进入 |
| 自动推进授权 | 用户已明确授权一次性完成 Step 1~15；Step 间无需再次停等，但每个 Step 必须独立完成小循环和自检 |
| 文档切换 | Step 15 完成后停审；不得自动进入 `07-实施计划.md` |
| Commit | 未授权，不提交 |

## 2. 总流程计划

| Step | 名称 | 必读文档 / 前序依赖 | 输出文件 | 模块骨架 | 当前模块 | 思考记录 | 写入记录 | 自检 | gate_status | 完成门禁 | 下一动作 | blocker |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | 确认验收输入边界 | 验收 SOP / 书写规范；通用标准；正式 `00~05`；项目 ledger | `06_acceptance_step_01_input_boundary.md` | done | completed | done | done | done | pass | 输入、证据、交付和历史材料边界可判定 | 已进入 Step 2 | none |
| 2 | 明确验收目标与范围 | Step 1；正式 00 §2/§14；05 §2 | `06_acceptance_step_02_scope.md` | done | completed | done | done | done | pass | P0/P1/P2、接缝、非范围和 VETO 候选可判定 | 已进入 Step 3 | none |
| 3 | 固定验收基线 | Step 2；05 §8/§9/§13 | `06_acceptance_step_03_baseline.md` | done | completed | done | done | done | pass | 文档、交付、环境、数据、run/seal/manifest 基线无 `latest` | 已进入 Step 4 | none |
| 4 | 定义进入条件与退出条件 | Step 3；05 §12~§14 | `06_acceptance_step_04_entry_exit.md` | done | completed | done | done | done | pass | 进入、暂停、退出条件均可机器或人工复核 | 已进入 Step 5 | none |
| 5 | 定义功能验收门禁 | Step 4；00 FR/AC；03 flows；05 TC/EV | `06_acceptance_step_05_function_gate.md` | done | completed | done | done | done | pass | 每个 P0 功能验收项逐项停审，跨项无孤儿或冲突 | 已进入 Step 6 | none |
| 6 | 定义数据边界与架构红线验收 | Step 5；00 DR/AC；01 ownership；03 redlines；05 boundary TC | `06_acceptance_step_06_data_arch_redlines.md` | done | completed | done | done | done | pass | truth/snapshot/ref/body、owner、依赖和外围隔离均有红线 | 已进入 Step 7 | none |
| 7 | 定义接口、事件与跨仓同步验收 | Step 6；03 protocols；05 interface TC；依赖裁剪规则 | `06_acceptance_step_07_interfaces_events_sync.md` | done | completed | done | done | done | pass | 37 个 protocol 与三类依赖逐项停审 | 已进入 Step 8 | none |
| 8 | 定义状态机、事务与一致性验收 | Step 7；03 §9~§12；05 state/TX/CONC TC | `06_acceptance_step_08_state_tx_consistency.md` | done | completed | done | done | done | pass | 6 状态族、10 TX、6 concurrency、7 phase gate 已停审 | 已进入 Step 9 | none |
| 9 | 定义非功能验收门禁 | Step 8；00 NFR/AC；05 §10 | `06_acceptance_step_09_nonfunctional.md` | done | completed | done | done | done | pass | 6 个 NFR AC 与 19 项 NFR 已按结构阈值裁决 | 已进入 Step 10 | none |
| 10 | 定义可观测性、审计与证据门禁 | Step 9；03 §14；05 §9/§13/§14 | `06_acceptance_step_10_observability_evidence.md` | done | completed | done | done | done | pass | 24 evidence gate、30 candidate slot 与无环证据链已停审 | 已进入 Step 11 | none |
| 11 | 定义一票否决项 | Step 10；00 VF；架构/设计/安全红线 | `06_acceptance_step_11_veto.md` | done | completed | done | done | done | pass | `VF-L2T-001~013` 全覆盖、逐项停审且不可风险接受 | 已进入 Step 12 | none |
| 12 | 定义缺陷分级、复验与放行规则 | Step 11；05 §11/§14 | `06_acceptance_step_12_defects_retest_release.md` | done | completed | done | done | done | pass | S/A/B/R、影响清单、复验层级、关闭和放行一致 | 已进入 Step 13 | none |
| 13 | 定义风险接受与遗留项 | Step 12；05 residual；`L2T-UP-*` | `06_acceptance_step_13_risk_acceptance.md` | done | completed | done | done | done | pass | eligible residual predicate、不可接受项和记录字段闭合 | 已进入 Step 14 | none |
| 14 | 定义最终结论与签署口径 | Step 13；所有门禁 | `06_acceptance_step_14_final_decision_signoff.md` | done | completed | done | done | done | pass | 三值结论、优先级、分层准入、包和角色责任闭合 | 已进入 Step 15 | none |
| 15 | 整理正式验收标准文档 | Step 1~14；验收书写规范 | `06_acceptance_step_15_formal_document_assembly.md`；正式 `../06-验收标准.md` | done | completed_stop_review | done | done | pass | pass | 15 章/15 来源块、全量追溯、停审和总审计通过 | 等待用户审阅和切换 07 的明确授权 | none |

## 3. 逐 Step 固定小循环

```text
读取本 Step 标准、正式上游与前序 Step
  -> 写 Step 内计划和模块骨架
  -> 逐项回答 SOP 问题
  -> 诊断旧正式 06 对应内容
  -> 比较改动前后并裁决取舍
  -> 写结构化中间产物
  -> 判断是否需要拆模块 / 附录
  -> 形成正式章节回填草稿
  -> 自检并更新 flow / project ledger
```

Step 5、7、8、10、11 额外执行：

```text
逐验收项问题回答 -> 来源核对 -> 通过/失败/证据/裁决定义
  -> 单项停审 -> 下一验收项
  -> 全部完成后跨项覆盖与冲突审计
```

## 4. 稳定编号与事实边界

| 类别 | 当前唯一分母 / 规则 |
|---|---|
| 需求验收 | `AC-L2T-001~039`，不得删减、改名或声称已通过 |
| 一票否决 | `VF-L2T-001~013`，任何触发均强制总体“不通过”，不得风险接受 |
| 测试用例 | 正式 05 的 234 个 concrete `TC-L2T-*`；主题标签不形成第二 TC namespace |
| Evidence slot | `EV-CAND-L2T-*` 仅为 candidate slot；实例身份只能由固定 release run 派生 |
| Evidence eligibility | 只从 matching `gate_id=release`、`status=passed` 的 `gate-summary.json` 消费；不得从 `evidence-index.json` 推断最终资格 |
| Acceptance projection | 同 run `projection-manifest.json` 必须绑定四个固定文件且 digest 匹配；seal 与 manifest 无环 |
| Reviewer record | seal 后 append-only 审查记录；不能回写 machine eligibility 或伪装成测试事实 |
| 当前执行事实 | 无 run、commit、artifact、report、digest、缺陷、风险接受、结论或签署实例 |

## 5. 历史材料判定

旧 `projects/L2-tools/06-验收标准.md` 只有 10 章，使用历史 `ToolPolicy`、`ToolScope`、host callback 和无 authority 的百分比门槛，且缺少当前两阶段 evidence、release seal、projection manifest、blocker 和三值裁决闭环。它只用于各 Step 的差异审计；Step 15 已将其整体替换，未追加或沿用旧验收项。

## 6. 当前恢复点

```text
current_document = 06-验收标准.md
document_status = 06_completed_stop_review
current_step = Step 15 completed / pass; stop review
current_module = formal_document_assembly:completed_stop_review
gate_status = pass
gate_reason = 正式 06 已按 15 章整体重建并终检；39 AC、13 VF、234 TC、37 protocol、29 state/TX、19 NFR、24 evidence gate、30 slot、11 checks 和 16 residual 全量闭合，无 unresolved assembly conflict
next_allowed_action = wait_for_user_review_and_explicit_07_authorization
formal_document_write_allowed = false
future_step_files_allowed = false_until_user_authorizes_07
next_formal_document = 07-实施计划.md awaiting_explicit_user_authorization
commit_required = false
```
