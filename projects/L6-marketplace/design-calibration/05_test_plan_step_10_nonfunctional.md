# Step 10：专项测试与非功能验证

## 1. Step 状态

2026-10-02；full-restart / single-agent；completed / selfcheck_done / stop_review；`gate_status=pass`（专项设计）。输入00全部NFR/VETO、03一致性/恢复/观测、04与Step6/9；输出P0安全/一致性/恢复及候选容量矩阵。没有baseline、SLO测量或运行pass。

Step内计划：NFR逐项反查→fault/安全方法与EV→阈值来源及candidate分层→停审；完成。

### Step内计划与门禁字段

| 计划项 | 状态 | 可审查产物/门禁 |
|---|---|---|
| 读取输入与前序结论 | done | §2；前序：05_test_plan_step_09_automation_gates.md（含诊断、取舍、未确认项） |
| SOP逐问题回答 | done | §3，回答所有适用问题 |
| 当前/历史材料诊断 | done | §4，不继承historical truth |
| 设计取舍 | done | §6，采用/未采用理由 |
| 结构化产物 | done | §7，来源/失败/证明上限闭合 |
| 复杂度判断 | done | 主控内分单元/表，无需新增业务附录 |
| 回填草稿 | done | §8；只候选，正式写入等Step15 |
| 自检/下一步 | done | §9/10，实际资格与运行结果不伪填 |

`gate_status=pass`；`gate_reason`=本Step设计审查完成，执行仍not-run；`next_allowed_action`=§10下一Step阅读/设计；`source_files`=§2列出的正式输入与前序文件。上述done不表示实际环境、测试、evidence或owner签核通过。

## 2. 本步输入

[00§13/14](../00-需求文档.md)、[Step5追溯](05_test_plan_step_05_traceability_coverage.md)、[Step6](05_test_plan_step_06_cases.md)、[Step9](05_test_plan_step_09_automation_gates.md)、03 Step11～15、04失效/敏感矩阵；SOP Step10、书写规范§5.10。

## 3. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 必须验证性能？ | 分页/维护/等待有界行为P0；query latency/throughput/scan/rebuild耗时仅candidate实测，无编造数值。 |
| 安全红线？ | 正文/secret/scope/approval/installed/paid/withdraw/no-write/生产fake，逐负例。 |
| 一致性/恢复？ | 原结果、frame/CAS/as-of、A/B unknown、late/oldfence/shutdown逐点fault。 |
| 日志/指标/审计证据？ | sentinel捕获、finite label allowlist、safe六字段sameTx、原auditset/O防递归、raw/report配对。 |
| 阈值来源？ | BR/VETO/03精确不变量为硬条件；Q-MP-01容量/预算/保留未定，不创造SLO。 |

## 4. 当前文档问题诊断

初稿专项仅列级别，没有环境/EV/阈值来源；Attempt/Notice Unknown名称漂移。本步以正式CommitUnknown、Review ContractBlocked及Recovery/Work Blocked区分，不添加状态。

## 5. 改动前后对比

| 前 | 后 | 原因 |
|---|---|---|
| “P0验证安全” | 具体TC/EV/方法/环境/来源 | 可复验可归档 |
| 候选性能混入pass | 硬不变量与candidate样本分列 | 不造SLO |

## 6. 测试设计取舍

采用正式不变量作为binary gate，容量只测量已声明profile；不采用无来源P95/99、送达率、重试次数或retention天数。非功能通过不能抵消业务红线，观测采样成功不能证明local audit或owner acceptance。

## 7. 结构化中间产物

### 7.1 专项矩阵

所有EV为计划；TC/EV省略固定前缀。环境test，PG项必须实际隔离PG；staging真实owner另外blocked。阈值列是未来断言条件，不是已有结果。

| 专项/需求 | 指标或风险 | 方法/TC | 环境/层 | 硬条件/来源 | EV |
|---|---|---|---|---|---|
| 来源安全 NFR-MP-101/102/103 | body/scope/材料/资格错配 | SOURCE-003/004/005/006、REFERENCE-002 | fake service | exacttyped/body-free、缺口不Qualified；U1/U7 | DOMAIN-003/004/005/006、PG-012 |
| 审核一致 NFR-MP-201/202 | basis/decision/上架并发 | REVIEW-003/007/008/010、CROSS-016 | service+PG | Submit freeze、current Approved才List、原完整report；U2/U3/Step11 | DOMAIN-009/013/014/016、PG-020 |
| 查询有界 NFR-MP-301/302/303 | scope/分页/count/短ZH | CROSS-004/017、CATALOG-008 | actual PG | currentfilter parity、稳定cursor/as-of/no-write；Step11/13 | PG-018/021/008 |
| 分发稳定 NFR-MP-401/402 | duplicate/unknown/cancel/late | DISTRIBUTION-003/004/006/007/010 | Worker+fake | fulloriginal、IdempotencyConflict、CommitUnknown/原probe；U4/Step12 | WORKER-003/004/006/007/010 |
| 撤回恢复 NFR-MP-501/502/503 | late impact/notice/A-B/shutdown | WITHDRAWAL-004/005/008、RECOVERY-006/010 | service+Worker/PG补层 | upper本地范围、late Partial、no复活/no blind retry；U5/6 | DOMAIN-020/021/024、RECOVERY-006/010 |
| 全入口安全 NFR-MP-G01/VETO1～4 | credential/authority/paid/fake bypass | CROSS-006/007/009、CONFIG-012 | entry/capture/config | sentinel零泄漏、Core唯一meta、无审批/交易truth；Step12/15/04 | REDACTION-001、API-002、CONFIG-013/012 |
| 原子一致 NFR-MP-G02/VETO5 | partial writes/history/result/O | CROSS-003/015/016 | actual PG | sameTx frame/CAS/as-of/fullresult/late职责；Step11/15 | PG-017/019/020 |
| 有界可用 NFR-MP-G03 | lock/claim/scan/等待/commitunknown | CROSS-017/019、RECOVERY-005 | PG/Worker | 声明upper/after/batch/lease，超限安全失败或完整continuation；无伪Complete | PG-021、WORKER-021、RECOVERY-005 |
| 体验真实性 NFR-MP-G04 | locale/DTO/loading/empty/unknown | CROSS-008/021、CONFIG-011 | Web/config | 初次En、全部状态可辨，ref/key/enum不变；无伪预览/评分/证据 | WEB-001/002、CONFIG-011 |
| schema/state全库存 | field/condition/terminal遗漏 | CROSS-011/012/013/014 | unit/domain/port | 49/43/14/222/17/146完整参数化集合；03库存 | UNIT-003/004、DOMAIN-027/028 |
| Query/replay no-write | hidden side effect | CROSS-005 | API/application spy | 16Q/33replay全资源零write/ID/Clock/context/work/audit/O/P/effect；03 | API-001 |
| safe审计/观测 | 原auditset/递归/缺producer | RECOVERY-007/008/009、CROSS-015 | capture/service+PG | 六字段refs-only、21C+8J O、Recovery只P、Obs2/Rebuild无O/P；Step15 | RECOVERY-007/008/009、PG-019 |
| 报告真实性 | raw/report/latest/跨run | CROSS-010 | tooling test | Step13严格schema/摘要/脱敏/配对，不静态pass | RELEASE-001 |
| 容量candidate Q-MP-01 | latency/throughput/scan/rebuild/锁等待 | 声明workload后future selected benchmark | 获准test/staging | 仅记录样本/趋势；无生产threshold，无SLO pass | 未分配正式EV；不能混入98P0证据 |

### 7.2 故障/观测断言边界

| 窗口 | 实际注入点/观察 | 断言 |
|---|---|---|
| C fresh写段 | reserve/fact/history/work/plan/audit/result/complete/commit逐点 | knownrollback全无accepted；unknown按原key正式终局核对 |
| Job A | claim/checkpoint/permission/write/commit | A未KnownCommitted零effect；原IDs/完整request冻结 |
| external | malformed/timeout/ACK/no-probe | Dispatching/CommitUnknown保责任，不KnownNotCommitted、不approval/install/delivery |
| Job B | 新load/fence/save/audit/fullreport/complete | 新frame/revision；失败保A，原报告不足Reserved等待 |
| projection/impact | missingplan/body/history/late upper | 非Fresh；KnownScopeComplete仅完整原upper本地范围，late→Partial |
| shutdown/lease | stop、expiredclaim、oldfence late | 停新claim、保责任、probe-only；no强制Settled |

trace仅原Core trace关联；metric只finite entry/adapter/code/phase/state/kind，不用id/key/digest/trace/path/endpoint/free text。local audit六字段与真实basis/result同frame；receipt与正式evidence独立。failure log也须redacted，不能把“诊断必要”作为rawsecret保存理由。

### 7.3 候选容量与阈值变更

未来测量必须固定run_id、hardware/PG版本与extension、数据规模/分布/scope/type、page/batch/lease/workload、冷暖缓存、并发/持续时间和raw samples；owner等待与本地SQL耗时分开。报告只能sampled/trend，不能当前填数字。阈值需Q-MP-01正式authority，受控回00/03/04/05/06形成profile与gate，再分配新增TC/EV；不能把candidate统计“通过”当当前退出证据。

## 8. 回填草稿

正式§10收录专项矩阵、fault窗口、观测边界与capacity candidate。NFR逐条追溯仍由Step5唯一承担，不在本步私增全局质量编号。

## 9. 待确认事项

生产容量/PG/网络/retention/timeout正式baseline、owner contract与human auth仍pending/blocked。详细设计影响判定：没有新增metric字段、SLO、state或config；candidate硬化必须受控回源。MP-UP/SRC/Q不关闭。

## 10. 进入下一步条件

17NFR与全部VETO均有TC/EV/环境/来源，硬条件与candidate分层；设计门禁pass。下一读SOP Step11、规范§5.11及红线/复验影响；不提交commit。
