# Step 12. 定义进入准则与退出准则

> 对应 SOP：`standards/document/测试方案讨论流程_SOP.md` Step 12  
> 回填章节：`05-测试方案.md` §12  
> 执行模式：full-restart / single-agent-serial

## 1. Step 状态

| 项目 | 结论 |
|---|---|
| 状态 | completed / criteria_defined_not_satisfied |
| 输入基线 | Step7~11；正式 00~04；测试规范 §5.12 |
| 本步输出 | local/controlled、formal-seam、整体退出及暂停准则 |
| 当前满足情况 | 仅测试设计准则已满足；实现、环境、执行和证据准则均未满足 |
| 事实边界 | checklist 是未来判定合同，不是已勾选结果，不构成 readiness |
| 下一动作 | Step13 定义 planned report/evidence 结构与真实性规则 |

## 2. 本步目标与输入

本步定义什么时候允许开始某一测试层、什么时候允许宣布该次验证结束，以及何时必须暂停。为避免“本地测试可跑”被误读成“workspace 已验证”，进入准则按 local/controlled 与 formal-seam 分层，退出准则要求 P0 blocked 正向接缝不得被删项或降级。

| 输入 | 本步用途 |
|---|---|
| Step7 | 19 个逻辑数据集、隔离、清理和 test-double 权限边界 |
| Step8 | 6 个执行语境到 4 个正式 profile 的映射与不可用姿态 |
| Step9 | 13 个 suite、四 gate、9 个 planned 脚本与固定输出根 |
| Step10 | NFR/红线、故障注入、资源与测量边界 |
| Step11 | S/A/B、blocker/harness 分流、复验和关闭 |

## 3. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 开始前哪些文档必须冻结？ | 某次 run 必须绑定被测试实现 revision，以及正式 00~05 的版本/内容摘要；03/04/05 影响 DTO、状态、flow、port、config、redaction、TC 或 gate 的变更必须先完成影响分析和相关 Step 重审。05 正式文档将在 Step15 装配，当前不宣称执行就绪。 |
| 哪些环境和数据必须可用？ | local/test 层需合法 profile、DS-WS-RUN-001 隔离壳、所选 TC 数据集、fake/controlled adapter、故障屏障和清理能力；formal seam 需 staging、版本化 seam manifest、正式 vector/credential/namespace/cleanup 和禁止 fake 的装配。 |
| 哪些自动化必须可运行？ | 选定 gate 的全部 P0 suite 及 dependency/redaction/output checks；release 还必须运行 formal-seam-conformance。脚本尚未实现，因此当前未满足。 |
| 退出时哪些用例必须通过？ | 59 个 P0 TC 的适用断言必须有真实执行结果；其中外部正向用例必须来自正式 seam。blocked/not_run/pending 均非 passed，不能删掉后退出。 |
| 哪些缺陷和风险阻断退出？ | 任一 S/A、任一 P0 failed/blocked/not_run、redaction/dependency/integrity 非通过、raw/report/EV断链、使用 latest、静态造证据、未具名残余风险 owner 均阻断正常退出。无 baseline 的量化 P2 不作数值失败，但必须保留 pending 风险。 |

## 4. 当前材料问题诊断

| 旧模板问题 | 风险 | 本步修正 |
|---|---|---|
| “设计实现前/本地/集成/发布”四行 | 条件不可逐项判定 | 分成设计就绪、local/controlled进入、formal进入、整体退出、暂停 |
| 写“当前仅满足设计阶段”但无状态矩阵 | 容易误勾选具体条件 | 每项明确 required evidence 与当前状态 |
| formal seam blocker未进入退出 | 可通过删除外部正向用例伪退出 | P0 blocked/not_run 明确阻断完整退出 |
| 要求05 Step1~14后才进入测试 | 与Step12当前阶段自引用且无意义 | 正式执行前要求正式05基线；设计阶段单独判定 |
| 未区分预期Blocked负例与环境blocked | 负向用例通过可能掩盖正向未跑 | 精确负向断言可pass；seam缺失只能blocked |

## 5. 改动前后对比

| 维度 | 之前 | 本步后 |
|---|---|---|
| 进入 | 泛化阶段名 | 每层有基线、实现、数据、环境、runner、输出前置 |
| 退出 | “固定run/无P0” | 59 TC、13 suite、S/A、红线、raw/report/EV、风险逐项 |
| blocked | 可被理解为不适用 | P0 blocked 正向项明确阻断完整退出 |
| 当前状态 | 一句话 | 每组准则标 not_satisfied/blocked |
| 验收边界 | 易误写发布通过 | 05 只判测试执行完整性，06 才裁决验收 |

## 6. 进入 / 退出设计取舍

| 议题 | 采用方案 | 未采用方案及原因 |
|---|---|---|
| 是否允许只完成 local 后整体退出 | 只允许形成 local run 报告；不得形成完整测试退出 | P0 formal seam 是风险链组成部分 |
| 是否把 blocked 用例标 N/A | 保持 blocked，只有正式范围变更才能移除 | 防止用环境缺失消除风险 |
| 是否要求 production 才测试 | P0 formal seam 用 staging；production 当前 not_scheduled | 04 已区分 profile，当前无生产授权 |
| A 缺陷能否带出 | 正常退出要求 A=0 | 05 不预设验收豁免；未来06另行裁决也不得改写测试事实 |
| 无数字 baseline 是否阻断 | 阻断量化 verdict，不阻断语义专项设计 | 不发明性能门槛，也不伪造量化通过 |

## 7. 结构化中间产物

### 7.1 测试设计完成准则

以下是本设计文档 Step12 的完成判断，不是目标实现仓测试进入条件：

- [x] 正式 00~04 已作为测试真相源。
- [x] 59 个 TC 与 59 个 EV 槽位已唯一注册并定义断言。
- [x] 19 个数据集、6 个执行语境、13 个 suite 与 9 个 planned 脚本已定义。
- [x] 专项、缺陷、blocker 和事实边界已定义。
- [x] WS-UP-001~008/006-S 与 WS-LOCAL-001~003 未被伪关闭。

这五项只允许继续 Step13~15，不允许执行测试、生成证据或宣称 readiness。

### 7.2 Local / controlled 测试进入准则

| ID | 可判定条件 | 所需证明 | 当前状态 |
|---|---|---|---|
| EN-L-01 | 正式 05 与被测 source revision 已固定 | context 中 design/source revision | not_satisfied；05未装配、实现仓未核验 |
| EN-L-02 | 目标测试入口、13 suite聚合与所选 gate 脚本存在且可枚举 | discovery dry-run/raw manifest | not_satisfied |
| EN-L-03 | local/test profile 所有 required 配置显式且校验通过 | safe config digest + validator result | not_satisfied |
| EN-L-04 | DS-WS-RUN-001 与所选 TC 数据集可构造、隔离和清理 | fixture manifest + cleanup result | not_satisfied |
| EN-L-05 | fake/controlled adapter只承担本地机制，七写 spy与故障屏障可用 | composition/fault capability manifest | not_satisfied |
| EN-L-06 | synthetic cursor key与redaction canary安全可用，无真实 credential/body | data provenance + boundary check | not_satisfied |
| EN-L-07 | 固定且非 latest 的 run_id、artifact-root、report-root 可写 | invocation context | not_satisfied |
| EN-L-08 | 缺陷分类、首次失败保留和新run复验规则已接入runner流程 | runner behavior/check | not_satisfied |

任一项不满足：该层不得启动，或已启动则记录 infrastructure_failed/blocked；不得把未运行用例写成 passed。

### 7.3 Formal-seam selected-run 进入准则

| ID | 可判定条件 | 所需证明 | 当前状态 |
|---|---|---|---|
| EN-F-01 | owner query/scope/visibility/attention 合同均有版本化 manifest/vector | owner-published refs | blocked WS-UP-001/003~005 |
| EN-F-02 | event family/order/cursor/replay/baseline/continuation 合同闭合 | owner+bus versioned refs | blocked WS-UP-002/007 |
| EN-F-03 | durable store 的原子、隔离、commit resolution/restart合同已选择 | driver conformance manifest | blocked WS-LOCAL-001 |
| EN-F-04 | owner/bus transport、endpoint与 approved staging credential 绑定 | safe binding inventory | blocked WS-LOCAL-002 |
| EN-F-05 | cursor secret provider/crypto依赖与rotation场景可用 | provider/key-id-only manifest | blocked WS-LOCAL-003 |
| EN-F-06 | staging namespace、数据provider、隔离和cleanup获批准 | provider setup/cleanup proof | blocked |
| EN-F-07 | production fake fallback静态/装配检查通过 | dependency/composition raw result | not_satisfied |
| EN-F-08 | formal-seam gate能拒绝缺slot/假vector并输出blocked非0 | gate negative dry-run | not_satisfied |
| EN-F-09 | downstream只读兼容合同若被选入run，已版本化且无archive反向写 | consumer contract ref | blocked WS-UP-006/006-S |

只有本表中该次选定能力的全部 required 条件满足，才可运行正式正向用例；未选/未满足项保持 blocked，不能由 fake 替代。

### 7.4 完整测试退出准则

| ID | 可判定条件 | 当前状态 |
|---|---|---|
| EX-01 | 固定 run context 与 source/design/profile/seam manifest 可回指，且不用 `latest` | not_satisfied |
| EX-02 | 59 个 P0 TC 均有该固定 run 的权威状态；无缺失、skip、ignored | not_satisfied |
| EX-03 | 所有适用 TC 均 passed；外部正向用例由 formal seam 执行，blocked/not_run/pending 不算 passed | blocked |
| EX-04 | 13 个 suite 的适用 P0 集均有真实 report；formal-seam-conformance passed | blocked |
| EX-05 | no-write、visibility fail-closed、Gap非terminal、Unknown只Pending、generation/cursor隔离与无owner/outbound/archive写全部通过 | not_satisfied |
| EX-06 | config/redaction/dependency/output-integrity checks 全部通过；无法扫描也非通过 | not_satisfied |
| EX-07 | raw case→suite report→EV→run report 的路径/digest/状态一致，无静态造证据 | not_satisfied |
| EX-08 | S=0、A=0；B均有具名角色、范围、缓解、触发/到期 | not_satisfied |
| EX-09 | failed/infrastructure_failed/blocked/not_run 均保留，不被重跑或报告生成器覆盖 | not_satisfied |
| EX-10 | P2数值baseline未闭合项保留pending，报告不含P95/吞吐/容量/SLA/RTO/RPO伪verdict | not_satisfied |
| EX-11 | 验收交接只形成待审输入，不出现 verdict/signoff/readiness | not_satisfied |

当前完整退出明确不满足。05 文档完成与测试执行退出是两个不同事件。

### 7.5 暂停 / 阻断准则

| 触发 | 分类 | 必须动作 | 可否继续其他独立面 |
|---|---|---|---|
| 正式设计字段/状态/phase与TC断言冲突 | design inconsistency | 暂停受影响面，回源03/04/05 | 可，若无共享影响 |
| local/test profile、runner、fixture、清理不可用 | infrastructure failure | 停止所选suite，保留失败上下文 | 可，独立suite可继续 |
| owner/bus/durable/secret/downstream seam缺失 | external blocker | formal正向保持blocked | local negative可继续 |
| 预期注入Unavailable/Blocked且exact断言匹配 | testcase passed | 只证明该负向处理 | 可；不得关闭正向blocker |
| S/A缺陷 | product/harness defect | 隔离影响面、修复、新run复验 | S共享红线通常阻断全部退出 |
| redaction/dependency/integrity无法运行或失败 | gate failure | 阻断退出 | 可诊断，不可出完整报告 |
| 缺 workload/baseline | measurement pending | 不产生数值verdict | 语义/资源边界可继续 |

### 7.6 准则来源追溯

| 准则组 | 来源 | 核心约束 |
|---|---|---|
| 设计/编号就绪 | Step1~6 | 正式来源、15 CUT、59 TC/EV、14入口 |
| 数据进入 | Step7 | 19数据集、authority、隔离/清理 |
| 环境进入 | Step8 | 四profile、六语境、blocked不可pass |
| suite/gate进入与输出 | Step9 | 13 suite、9脚本、fixed run/no latest |
| 专项退出 | Step10 | 红线、fault、有界、telemetry非证据 |
| 缺陷退出 | Step11 | S/A/B、S/A=0、真实复验 |
| 证据退出 | Step13（下一步） | raw/report/EV真实性与归档 |

### 7.7 停审与跨准则审计

| 审计项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 条件是否均可判定 | pass；使用ID、所需证明、状态 | 无“基本完成” |
| 设计完成是否误作测试就绪 | no | 单独§7.1并声明权限上限 |
| local成功是否可冒充完整退出 | no | EX-03/04强制formal seam |
| blocked/not_run能否当N/A | no | 只有正式范围变更可移除 |
| 预期负向Blocked是否关闭正向blocker | no | §7.5明确分离 |
| 当前是否伪勾选实现/环境/证据 | no | EN/EX均not_satisfied/blocked |
| 是否要求无来源数字 | no | 量化项pending且禁止伪verdict |
| 06裁决是否被提前完成 | no | EX-11只允许待审输入 |

## 8. 对详细设计 / 配置的影响判定

当前条件均能回指 03/04，未发现新的设计空洞。若实施时 EN-L-05 的七写 spy或具名fault point不可实现，应回写03可测性；若formal manifest缺字段，应由对应owner闭口，不在workspace测试计划补schema。

## 9. 回填草稿

正式 §12 回填设计完成边界、local/controlled进入、formal-seam进入、完整退出、暂停和来源追溯。所有 checklist 在正式05中作为未来条件呈现，不打勾，不得把当前设计完成写成测试或发布 ready。

## 10. 待确认事项与进入下一步条件

- 当前仅满足测试设计继续条件；EN-L、EN-F、EX 均未满足。
- P0 formal seam仍被既有WS-UP/WS-LOCAL阻塞，不能降级或删除。
- 准则完全可判定且无模糊项；Step12通过，允许进入Step13。
