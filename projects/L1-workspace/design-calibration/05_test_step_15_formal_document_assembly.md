# Step 15. 整理正式测试方案文档

> 对应 SOP：`standards/document/测试方案讨论流程_SOP.md` Step 15  
> 正式输出：`projects/L1-workspace/05-测试方案.md`  
> 执行模式：full-restart / single-agent-serial

## 1. Step 状态

| 项目 | 结论 |
|---|---|
| 状态 | completed / formal_stop_review |
| 前置 | Step1~14 均已逐步补审通过 |
| formal_05_write_allowed | true |
| 当前模块 | assembly_mapping_and_cross_document_audit |
| 思考记录 | done |
| 写入记录 | completed；正式05已装配 |
| 自检 | completed；15章、59 TC/EV、14入口、15 CUT与事实边界已静态审计 |
| 完成门禁 | 正式05真实存在、15章齐全、静态审计通过并转formal_stop_review |

## 2. 装配输入与规则

| 正式章节 | 主要校准来源 | 装配重点 |
|---|---|---|
| §1 | Step1 | 上游关系、owner边界、blocker与下游消费 |
| §2 | Step2 | P0/P1/P2×执行状态、范围/非范围、一票否决 |
| §3 | Step3 | 7模块、16对象、7 service、14入口、15 CUT |
| §4 | Step4 | 分层、首要发现层、real seam边界 |
| §5 | Step5 | 10 FR、12 BR、NFR、59 TC/EV双向映射 |
| §6 | Step6 | 59用例、14入口主例、精确断言和blocked |
| §7 | Step7 | 19数据集、authority、构造/隔离/清理 |
| §8 | Step8 | 6语境→4 profile、依赖类型、环境失败 |
| §9 | Step9 | 13 suite、4 gate、9脚本、planned输出 |
| §10 | Step10 | 安全/一致性/恢复/资源/观测/测量 |
| §11 | Step11 | S/A/B、升级、复验、关闭与防回归 |
| §12 | Step12 | 分层进入、完整退出、暂停及当前未满足 |
| §13 | Step13 | 59 EV实例、raw/report、真实性与审查 |
| §14 | Step14 | 变更触发、全量回归、风险与06承接 |
| §15 | Step1~14及标准 | 正式参考、校准入口和状态上限 |

装配要求：

1. 每章开头保留具体校准来源与延伸阅读入口。
2. 正文是可执行结论，不复制SOP问题、诊断、方案比较或停审过程。
3. 59个TC/EV保持稳定编号；不创建第60个report证据。
4. `planned/blocked/pending/not_scheduled` 是唯一当前事实；不写真实run/artifact/report/evidence/verdict/signoff/readiness。
5. 不新增生产对象、字段、协议、状态、配置、outbound event、outbox或archive handoff。

## 3. 跨文档一致性复核

### 3.1 对象、字段与构造闭环

| 正式设计面 | 05测试承接 | 缺失处理 | 结论 |
|---|---|---|---|
| 16个局部对象 | OBJECT/STATE与入口族；Step3/6 | 无正式proof的成功构造blocked | pass |
| typed ID/version/key/digest | CONTRACT/PAGE/IDEM | wrong-kind/missing拒绝；owner codec缺失blocked | pass |
| WorkspaceReadView axes | QRY/VIS/STATE/PAGE | visibility不可验证fail-closed | pass |
| operation/source/gap/commit records | IDEM/TXN/SRC/QRY-004 | unknown只Pending；Gap无terminal | pass |
| WorkspaceLimits/RuntimeConfig | CONFIG/RES | profile值L/L+1；缺配置fail-fast | pass |

### 3.2 输入协议与Query response闭环

| 协议面 | 入口数量 | 必填测试语义 | 结论 |
|---|---:|---|---|
| Command | 2 | metadata/expected/key/digest、原子结果 | pass |
| Query | 6 | 当前visibility、safe empty/degraded、七写为0 | pass |
| Consumer | 2 | typed envelope、receipt、Gap/Unknown、非ACK | pass |
| Operation | 4 | 单phase/有界、terminal、cutover/invalidation | pass |

### 3.3 状态闭环

| 状态族 | 测试用例 | 禁止迁移/混同 | EV槽位 |
|---|---|---|---|
| Coverage/Attention | STATE-001、SRC/INBOX | Gap猜进、Invalidated复活、Withdrawn猜reopen | 同序EV |
| Rebuild/Generation | STATE-002、REC-* | 四终态复活、Retired回Current、SafetyBlocked绕过 | 同序EV |
| Read/Commit/Availability | STATE-003、QRY/SRC/CONFIG | freshness/coverage/availability混轴、Pending回滚 | 同序EV |
| Cursor/version axes | CONTRACT-002、PAGE-* | source/view/read/page/generation互换 | 同序EV |

### 3.4 依赖与phase闭环

| 检查 | 正式口径 | 05承接 | 结论 |
|---|---|---|---|
| compile | 仅L0-core候选 | DEP-001静态检查 | pass_with_WS-UP-007 |
| runtime/event/ref/adapter/fake | 不得写成compile | Step8依赖矩阵、DEP-002 | pass |
| Query | no-write/no refresh | QRY-*、BOUND-001 | pass |
| Consumer | receipt非ACK、无outbound | SRC-*、BOUND-001 | pass |
| Recovery | Request不baseline、Advance不跨phase | REC-* | pass |
| Export | read model，不产archive truth/handoff | QRY-006、BOUND-* | pass |

## 4. 编号与覆盖审计计划

| 审计 | 目标 |
|---|---|
| 章节 | 恰好15个一级编号章节，每章有具体校准来源 |
| FR/BR | FR-WS-001~010、BR-WS-001~012均出现且可回指TC |
| 对象/服务/入口/CUT | 16对象、7service、14入口、15CUT |
| TC/EV | 17族合计59；每个TC/EV唯一且同族同序 |
| suite/script/profile/data | 13suite、9脚本、4profile/6语境、19数据集 |
| 关键语义 | no-write、现时visibility、Gap非terminal、Unknown只Pending、stale/partial/blocked/unavailable |
| 禁止能力 | 无owner反写/outbound event/outbox/archive handoff/runtime/tools/UI/SDK truth |
| 事实边界 | 无真实run/artifact/report/EV/verdict/signoff/readiness或测试通过声称 |
| blocker | WS-UP-001~008/006-S、WS-LOCAL-001~003均保留 |

## 5. 写入批次

| 批次 | 范围 | 状态 |
|---|---|---|
| A | 元信息、§1~4 | completed |
| B | §5~6 | completed |
| C | §7~10 | completed |
| D | §11~15 | completed |
| E | 全文静态/人工语义审计与修正 | completed |

## 6. 完成门禁

已满足。正式05已装配并通过静态审计；所有外部接缝和本地实施前置仍保留为 blocker/pending，未生成任何真实执行或验收事实。按当前“完成全部”授权，下一动作是逐步完成06；06完成后仍须独立停审再进入07。
