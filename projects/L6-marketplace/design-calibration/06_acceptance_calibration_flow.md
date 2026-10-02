# L6-marketplace 06 验收标准校准流

> SOP：`standards/document/验收标准讨论流程_SOP.md`
> 规范：`standards/document/验收标准书写规范.md`
> 通用规则：中间产物规范、真相源闭环标准、设计通则、全局依赖§4.1。
> 日期：2026-10-02；full-restart / single-agent / design only。
> 授权：用户“现在完成全部 06”；05→06解除，06→07未解除。

## 1. 本轮目标与边界

从当前00～05及规范性附录推导可裁决的验收门禁，不创造需求、接口、状态、测试、owner资格或财务truth。旧06/README仅historical_material，独立结论后才作差异审计，Step15先删除旧稿、建15章骨架、分批装配。

全部TC/EV/report/script引用均planned。无实际实现、run、资产包、digest、扫描、签名、付款、evidence、verdict、risk acceptance、signoff或readiness。07完成时才建立implementation ledger和全部planned/blocked/waiting skeleton。

## 2. 当前三层门禁

| 字段 | 值 |
|---|---|
| current_document | 06 验收标准 |
| current_step / unit | 15 正式装配 / completed stop_review |
| status | completed / waiting_user_confirmation |
| gate_status | pass（设计装配） |
| gate_reason | 总审计、旧稿删除、15章骨架、A/B/C分批装配和静态检查完成；无运行/签署事实 |
| next_allowed_action | 停止06；用户明确确认后读取07 SOP，不提交commit |
| source_files | 当前00～05、05规范性矩阵/schema、验收SOP/规范、九owner正式03/必要台账 |
| formal_write_gate | pass（Step15正式装配完成） |
| document_switch_gate | blocked_until_user_confirmation_after_06 |
| implementation_gate | blocked / waiting_07 |

## 3. 总流程计划

每行前序输入均包含其问题回答、诊断、取舍和待确认；future Step文件不得预建。下表文件均在本目录，只有实际进入才创建。completed/pass仅设计自检，不是运行、owner确认或签署。

| Step/主题 | 输入文件/前序依赖 | 输出文件 | 状态 | 完成门禁/下一步许可 |
|---|---|---|---|---|
| 01 输入边界 | 用户授权；00～05；九owner正式03/必要台账 | 06_acceptance_step_01_input_boundary.md | completed / pass | 权威/历史/证明上限/缺口清楚→02 |
| 02 目标范围 | Step01；00§4/14；05§2/12 | 06_acceptance_step_02_scope.md | completed / pass | 三scope/P0/P1/P2/非范围固定→03 |
| 03 基线 | Step02；03库存；04配置；05§6/9/13及schema | 06_acceptance_step_03_baseline.md | completed / pass | 实现/数据/环境/同run/report基线与失效明确→04 |
| 04 进入退出 | Step03；05§11/12；00VETO | 06_acceptance_step_04_entry_exit.md | completed / pass | 可送验与可裁决分开，无伪勾选→05 |
| 05 功能门禁 | Step04；00全部20AC；03七U；05Step5/6 | 06_acceptance_step_05_function_gate.md | completed / pass | 16业务AC逐项小循环+4全局分配→06 |
| 06 数据架构红线 | Step05；01依赖/ownership；03对象/持久化；04 | 06_acceptance_step_06_boundary_gate.md | completed / pass | owner/正文/依赖/Query/replay/config逐项停审→07 |
| 07 接口同步 | Step06；03协议/ports/flows；05 contract index | 06_acceptance_step_07_interface_sync_gate.md | completed / pass | 49入口/17ports/146methods/0Event/资格逐项→08 |
| 08 状态事务一致性 | Step07；03State/Tx/幂等/分页；05CUT | 06_acceptance_step_08_state_tx_consistency.md | completed / pass | 14carrier/222pair及frame/CAS/A-B/replay逐项→09 |
| 09 非功能 | Step08；00全部17NFR；04；05Step10 | 06_acceptance_step_09_nonfunctional.md | completed / pass | 17NFR独立停审，hard invariant和容量candidate分开→10 |
| 10 观测证据 | Step09；03观测；05Step13/schema/98EV | 06_acceptance_step_10_evidence_audit.md | completed / pass | 98EV独立停审、DAG/schema/redaction/固定入口→11 |
| 11 否决 | Step10；00五VETO；05反向映射 | 06_acceptance_step_11_veto.md | completed / pass | 五VETO逐项闭环，不可风险接受→12 |
| 12 缺陷复验放行 | Step11；05§11/14 | 06_acceptance_step_12_defects_release.md | completed / pass | S/A/B、fresh复验、失败保留、scope裁决→13 |
| 13 风险接受 | Step12；03§17/Step18；05Step14 | 06_acceptance_step_13_risk_acceptance.md | completed / pass | 12开放项/10残余/authority/七字段/失效→14 |
| 14 结论签署 | Step13；全部门禁；规范三值 | 06_acceptance_step_14_conclusion_signoff.md | completed / pass | 三值算法/范围/发布准备/角色分权，未裁决→15 |
| 15 正式装配 | Step01～14全部附录；规范15章；历史差异 | 06_acceptance_step_15_formal_document_assembly.md、06_acceptance_static_review_record.md | completed / pass | 总审计、删除/骨架/分批/静态审查完成→stop_review |

### 3.1 可恢复执行台账

每行必读/输出沿§3同Step，开工确认见各Step§1/2及本flow通用纪律；blocker精确来源[Step13§7](06_acceptance_step_13_risk_acceptance.md#7-结构化中间产物)，不据设计pass关闭。下表done均为设计动作。

| Step / 当前模块 | 模块骨架 | 思考 | 写入 | 自检 | gate_status / reason | 下一动作 | blocker |
|---|---|---|---|---|---|---|---|
| 01 input/owner | done | done | done | done | pass / 权威与证明上限闭口 | 已进入02 | 十二项 |
| 02 scope | done | done | done | done | pass / 三scope冻结 | 已进入03 | 同上 |
| 03 baseline/人工导航 | done | done | done | done | pass / 基线与失效完整 | 已进入04 | 同上 |
| 04 entry/exit | done | done | done | done | pass / 可送验与放行分离 | 已进入05 | 同上 |
| 05 16AC+4G | done | done | done | done | pass / 独立停审 | 已进入06 | 同上 |
| 06 eight boundary | done | done | done | done | pass / owner与只读红线 | 已进入07 Step | 同上 |
| 07 49entry+4shared | done | done | done | done | pass / 正式入口与资格 | 已进入08 | 同上 |
| 08 14carrier+9Tx | done | done | done | done | pass / 全pair与事务 | 已进入09 | 同上 |
| 09 17NFR | done | done | done | done | pass / 阈值与candidate分层 | 已进入10 | 同上 |
| 10 12E+98EV | done | done | done | done | pass / 归档/schema/DAG，反向锚点由15复核 | 已进入11 | 同上 |
| 11 five VETO | done | done | done | done | pass / 不可risk接受 | 已进入12 | 同上 |
| 12 defects/retest | done | done | done | done | pass / fresh全量与失败保留 | 已进入13 | 同上 |
| 13 12open+10risk | done | done | done | done | pass / 七字段/authority未伪填 | 已进入14 | 同上 |
| 14 decision/signoff | done | done | done | done | pass / 三值与权限独立 | 已进入15 | 同上 |
| 15 cross audit/assembly | done | done | done | done | pass / 总审计、15章装配和静态记录完成 | 停止06，等待用户确认 | 同上；07未授权 |

## 4. 单元与证据纪律

主Step固定十段、八项Step内计划、source_files/gate_status/gate_reason/next_allowed_action。先问题/诊断/取舍，后结构化/草稿/自检，逐Step更新本flow和项目台账。复杂Step5～11逐验收项设计→TC/EV/report→通过/失败→裁决影响→独立停审，再跨项审计；不得用全局总表替代。

保留20个`AC-MP-*`和5个`VETO-MP-*`为canonical。专项细分`GT-MP-*`只为06内部子门禁，必须回指AC，不进入05 schema的canonical AC enum，不新增TC/EV编号。

固定根`artifacts/test/<run_id>/`、`reports/runs/<run_id>/`、`reports/acceptance/`，无latest/跨run/自引用/静态pass。reviewer人工报告与05机器draft分层；实际固定入口的绑定规则等Step3/10确认，不伪造已生成报告。

## 5. 外部缺口与完成停审

MP-UP-001～008、MP-SRC-003/010/013、Q-MP-01及受影响owner/SDK资格继续pending/blocked/affected/future。本地contract/fake/actual PG可设计，不证明formal positive；Billing/支付/订阅/分成/跨境只future/blocker，0Archive writer/0active Event/outbox不变。

正式06完成后必须同步design completed/selfcheck_done/stop_review/waiting_user_confirmation。等待用户明确确认才可读取07 SOP并启动07；本轮无需提交commit。
