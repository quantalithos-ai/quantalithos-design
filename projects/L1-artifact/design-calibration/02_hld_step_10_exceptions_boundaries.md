# Step 10. 异常与边界场景轮廓

> 对应 SOP: `standards/document/概要设计讨论流程_SOP.md` Step 10
> 回填章节: `02-概要设计.md` §10 异常与边界场景轮廓
> 生成日期: 2026-07-03
> 状态: 已完成

---

## 1. 本步目标

在 Step 8 处理流和 Step 9 状态机已经收稳的前提下,点名那些会改写 `L1-artifact` 主线理解、主要组成部分协作或状态传播边界的关键异常与边界场景。后续 `03-详细设计.md` 必须继续展开正式错误码、重试、补偿、幂等、并发冲突、dead-letter、恢复策略和测试矩阵。

本步不写完整错误码表、异常类、补偿脚本、重试参数、事务 rollback 细节、DLQ 结构、运维处置动作或测试用例。

---

## 2. 本步输入

| 输入 | 状态 | 用途 |
|---|---|---|
| `02_hld_step_08_processing_flows.md` | 已完成 | 提供 Command、Query、Consumer、Job 的主路径和 no-write / no-repair 边界 |
| `02_hld_step_09_state_machine.md` | 已完成 | 提供状态集合、允许迁移、禁止迁移和状态传播关系 |
| `02_hld_step_07_api_interface_skeleton.md` | 已完成 | 提供异常会落在哪类接口和读写入口 |
| `02_hld_step_03_constraints.md` | 已完成 | 提供 truth ownership、外部正文排除、配置不可越界和派生只读约束 |
| `projects/L1-artifact/00-需求文档.md` §10~14 | 当前正式需求基线 | 提供边界规则、数据归属、接口否决线和验收风险 |
| `projects/L1-artifact/01-架构设计.md` §8 / §9 / §10 / §11 / §13 | 当前正式架构基线 | 提供一致性策略、交互方式、外围增强和失败显式原则 |
| `projects/L1-governance/design-calibration/02_hld_step_10_exceptions_boundaries.md` | 已读取 | 作为 Step 10 单文件高粒度框架参考 |

---

## 3. SOP 问题回答

### 3.1 哪些关键异常路径必须在概要设计层先点名?

必须先点名的异常路径包括:

- Command 缺少 `ActorContext`、`CommandMetadata` 或 idempotency key。
- content source、definition、work / process / governance context、automation source 等外部引用 unresolved、stale、failed 或 unavailable。
- review anchor 未 ready、responsibility 未 accepted、baseline 成员不是正式 version。
- version publish 试图绕过 candidate / fact 锚点,或 lineage 建立缺少正式 basis。
- automation output 试图直接成为 fact / version / lineage truth。
- Query 遇到 restricted、stale、failed 或 unavailable 的 read surface / preview / report / reconciliation 结果。
- Consumer 遇到 duplicate、unsupported schema、乱序事件、来源过旧或正文越界。
- rebuild / refresh / reconcile / handoff 失败,以及 downstream 拒收 sync / archive / observability 交接。

### 3.2 哪些边界场景会改写主要组成部分、接口、对象或状态机的协作关系?

会改写协作关系的边界场景包括:

- 外部引用未闭口时,Command 不得继续核心 truth 主线,只能把 intake、content check、resolution 或 derived freshness 推到 pending / stale / unavailable。
- Query 遇到 freshness 或 visibility 问题时,不得顺手写 backref、refresh mirror 或 rebuild projection。
- Consumer 遇到外部事件时,只能改写 context ref、definition ref、automation source ref、resolution state、pending marker 或 stale marker,不得直接创建 `ArtifactFact`、`ArtifactVersion`、`ArtifactLineageLink`、`ArtifactBaseline`。
- Job 发现 drift、refresh failure 或 handoff failure 时,只能写 report、trace、handoff、resolution 或 freshness 结果,不得修复核心 truth。
- 下游拒收已提交 truth 的 relay / handoff 时,不得反向撤销已成立 truth。

### 3.3 哪些失败不能留到详细设计才发现?

不能留到详细设计才发现的失败,都是会打穿 truth ownership、正式版本锚点或读取边界的失败:

- 外部正文、tool output、archive package、sync private copy 试图进入 Artifact truth。
- baseline 试图用 current latest 动态解析成员,而不是显式冻结正式 version。
- preview / report / reconciliation 结果试图反向定义 `ArtifactFact`、`ArtifactVersion` 或 `ArtifactBaseline`。
- Consumer 试图以 runtime signal 或外部内容变化直接创建正式 truth。
- handoff / trace / relay 失败被误当作核心业务写入失败。

### 3.4 异常与边界场景在概要设计层需要讲到什么程度才足够?

概要层只需要讲清:

- 异常落在哪类接口、哪个主要组成部分处理。
- 它会让主流程在哪一层断开。
- 它会把哪些对象或状态推到 pending / rejected / stale / degraded / failed。
- 哪些东西绝不能被伪装成“已经成立”。

错误码、重试次数、死信结构、补偿步骤、人工处置和恢复脚本留给详细设计。

### 3.5 哪些内容仍属于详细设计,不应在本步展开?

以下内容不在本步展开:

- 各接口的正式错误码和 response schema。
- expected version、duplicate replay 和 stored result 的 exact 结构。
- refresh / rebuild / handoff 的 retry、backoff、dead-letter 和 replay 参数。
- 事务 rollback、partial failure、人工恢复和运维脚本。
- Query 中 restricted / redacted / degraded / unavailable 的字段级组合规则。

---

## 4. 异常与边界场景总览

| 异常 / 边界场景 | 影响哪些部分 / 流程 | 当前轮廓口径 | 说明 |
|---|---|---|---|
| Command 缺少 actor / metadata / idempotency key | sync entry; application service; 全部 Command 流 | 不进入 domain transition | 这是写路径入口否决线,不能交给详细设计后补 |
| content source unresolved / unavailable | intake; fact establish; read surface; refresh job | intake / content 进入 pending / unavailable | 不能假装正文位置总可达 |
| definition ref stale / unresolved | fact establish; method consumer; refresh job | 进入 stale / pending reference | 不得基于旧定义建立新事实 |
| review anchor not ready | baseline freeze; 高影响 automation accept | 命令停止在 review 前置 | 审查语境不是“可选补充” |
| responsibility 未 accepted | review; baseline freeze; explanation flow | 维持 pending responsibility | 不能把“已分配”误当成“已承担” |
| automation output 试图直接 truth 化 | automation boundary; intake; fact / version / lineage | 拒绝或转为 candidate only | 守住 runtime 结果不直接进 truth |
| publish version 缺少 candidate 或 fact 锚点 | version publish | 不产生 Published version | 正式版本不能从最新内容快捷生成 |
| lineage basis 不足或 target 非 formal version | lineage establish | 拒绝或保持 pending basis | lineage 必须锚定正式 version |
| baseline 成员含非 formal version | baseline candidate / freeze | 拒绝 freeze 或保留 candidate | baseline formal version only 是概要红线 |
| baseline 试图动态解析 current latest | baseline; consumption; sync handoff | 视为非法边界场景 | 冻结集合必须显式化 |
| Query not visible / restricted | read surface; preview; report | 只返回 restricted / redacted surface | Query 不得泄露 truth 或存在性细节 |
| read surface stale / unavailable | consumption; preview / report; external resolution | 只返回 stale / unavailable / degraded | Query 不得触发 rebuild / refresh |
| backref / trace explanation 缺口 | consumption backref; traceability; reconciliation | 标记 explained 不成立或 stale | 不能补造 trace 来掩盖缺口 |
| duplicate inbound event | consumer receipt; resolution / stale marker | 只返回 duplicate receipt | 不得重复写任何本地状态 |
| unsupported schema / forbidden body | inbound adapter; external mirror support | reject / quarantine / discard body | 正文越界不能被“先存后说” |
| out-of-order / older-source event | consumer; refresh; resolution state | 标记 stale / ignored / delayed | 不得让 mirror 或 summary 倒退 |
| external refresh degraded / failed | resolution state; content check; derived freshness | degraded / failed 只影响读取和维护面 | 不回滚核心 truth |
| rebuild preview / report failed | derived maintenance; query surface | freshness 进入 failed / unavailable | 只读层失败不能改写 truth |
| reconciliation gap detected | reconciliation; ops visibility | 只产出 report / finding | 不自动修复 core truth |
| handoff delivery failed / no receipt | archive / observability / sync handoff | handoff / trace failed 或 retryable | 不改变 fact / version / baseline 状态 |
| downstream rejects sync-safe material | sync handoff; traceability | 交付失败显式可见 | 下游副本不能反向定义 truth |

---

## 5. 按处理流族归类的异常口径

### 5.1 Command 写路径异常

| 异常 | 影响状态 | 概要口径 |
|---|---|---|
| 入口参数缺失或非法 | 无 truth 状态变化 | 在 inbound / application 层拒绝,不进入 domain object |
| policy guard 不通过 | 保持原 truth 状态 | 命令返回失败 surface,不得写成功 trace / relay |
| review / responsibility 前置未闭口 | `Draft` / `PendingResponsibility` 维持 | 命令停止,等待显式前置闭口 |
| formal version / lineage / baseline 条件不满足 | candidate / pending basis / baseline candidate 保持原态 | 不得偷偷跳过 formality 要求 |
| 事务边界内任一 truth / history / trace 写失败 | 不形成 accepted truth | 详细设计闭口事务,概要层只要求同一成立边界 |

### 5.2 Query 只读异常

| 异常 | 影响状态 | 概要口径 |
|---|---|---|
| not visible | 无持久状态变化 | 返回 restricted / redacted surface |
| preview / report stale | 无持久状态变化 | 返回 freshness / degraded,不触发 rebuild |
| read surface unavailable | 无持久状态变化 | 返回 unavailable,不补临时正文 |
| external resolution stale / failed | 无持久状态变化 | 返回 degraded / unresolved,不 refresh |
| trace explanation missing | 无持久状态变化 | 显式暴露 trace gap,不补造 backref |

### 5.3 Consumer 异常

| 异常 | 影响状态 | 概要口径 |
|---|---|---|
| duplicate source event | receipt only | 不重复写 context / resolution / stale |
| unsupported schema version | delayed / rejected / quarantine surface | 不猜 payload,不写核心 truth |
| source body 越界 | 无 truth 状态变化 | 只提取 ref / summary,正文丢弃或拒绝 |
| source version 过旧或乱序 | `Stale` / ignored / delayed | 不让本地状态倒退 |
| source unavailable | `PendingReference` / `Failed` / `Waiting` | 只推动 pending / stale / degraded 语义 |

### 5.4 Operations Job 异常

| 异常 | 影响状态 | 概要口径 |
|---|---|---|
| rebuild failed | `ArtifactDerivedFreshnessState::Failed` | Query degraded,truth 不变 |
| refresh failed | `ArtifactExternalResolutionState::Failed` / `ExternalMirrorRefreshState::Failed` | resolution degraded,truth 不变 |
| refresh degraded | `ExternalMirrorRefreshState::Degraded` | 允许降级读取,但不得冒充 resolved |
| reconciliation gap | `ArtifactReconciliationState::GapDetected` | 只产出 finding / report |
| handoff / delivery failed | `ArtifactTraceState::Failed` / `Retryable`;`ArtifactHandoffState::Failed` / `Retryable` | 只影响外围交付可见面 |

---

## 6. 异常影响图

```text
+====================================================================+
|                  Artifact Exception Boundary Map                   |
+====================================================================+
| Command exception                                                   |
|   | invalid actor / metadata / policy / readiness / formality      |
|   v                                                                 |
| Reject or pending surface                                           |
|   | no accepted truth unless truth + history boundary succeeds      |
|   v                                                                 |
| ArtifactFact / Version / Lineage / Baseline remain unchanged        |
|                                                                     |
| Query exception                                                     |
|   | restricted / stale / unresolved / unavailable                  |
|   v                                                                 |
| Read surface / preview / report degraded surface                    |
|   | never writes backref / refresh / rebuild                        |
|   v                                                                 |
| Consumer sees explicit freshness and visibility limits              |
|                                                                     |
| Consumer exception                                                  |
|   | duplicate / unsupported / forbidden body / old source          |
|   v                                                                 |
| Receipt + resolution + pending / stale markers only                 |
|   | never creates ArtifactFact / Version / Lineage / Baseline       |
|   v                                                                 |
| Main truth remains command-owned                                    |
|                                                                     |
| Job exception                                                       |
|   | rebuild / refresh / reconcile / handoff failed                 |
|   v                                                                 |
| Derived / resolution / report / trace / handoff failure state       |
|   | never repairs or rolls back core truth                          |
|   v                                                                 |
| Operations visibility only                                          |
+====================================================================+
```

关键说明:

- 该图只表达异常落点和边界断开位置,不表达错误码、补偿脚本、重试参数或死信结构。
- Command 异常的关键红线是“无 accepted truth,就无 committed relay / handoff / success trace”。
- Query 异常的关键红线是“只能显式暴露受限 / 降级,不能顺手修复”。
- Consumer 和 Job 异常都只能影响外围或支撑状态,不能改写核心 truth 所有权。

---

## 7. 状态机影响清单

| 异常类别 | 可能进入的状态 | 禁止进入的状态 |
|---|---|---|
| external reference unresolved / failed | `PendingReference`、`PendingCheck`、`Stale`、`Waiting`、`Failed` | `Established` by assumption |
| review / responsibility not closed | `Draft`、`PendingResponsibility`、`Assigned` | `Ready` / `Accepted` by shortcut |
| invalid automation candidate | `PendingReview`、`Rejected`、`Superseded` | `Accepted` without convergence |
| formal version / lineage / baseline violation | `Open`、`Candidate`、`PendingBasis` | `Published` / `Established` / `Frozen` by shortcut |
| read surface visibility / freshness issue | `Restricted`、`Stale`、`Unavailable` | implicit `Ready` |
| derived maintenance failure | `Failed`、`Unavailable` | core truth mutation |
| handoff / delivery failure | `Failed`、`Retryable` | rollback of fact / version / baseline |

---

## 8. 异常归属停审记录

| 主要组成部分 | 停审结果 | 说明 |
|---|---|---|
| `Artifact fact management` | pass | 已点名 truth 建立前置缺失、正文不可达和正文越界异常 |
| `Artifact version management` | pass | 已点名 candidate 缺失、formal publish 违规和 supersede 边界 |
| `Artifact lineage management` | pass | 已点名 basis 不足和非 formal version 锚点异常 |
| `Artifact baseline management` | pass | 已点名 non-formal member 和 dynamic current resolution 异常 |
| `Artifact intake convergence` | pass | 已点名 unresolved source、invalid metadata 和 duplicate input 场景 |
| `Artifact review and responsibility context` | pass | 已点名 not ready / not accepted 前置异常 |
| `Automation output control boundary` | pass | 已点名 automation truth 化越界异常 |
| `Artifact consumption and traceability` | pass | 已点名 restricted / stale / trace gap / read no-write 异常 |
| `Derived maintenance and handoff preparation` | pass | 已点名 rebuild / reconcile / handoff failure 不反写真相 |
| `External reference and local mirror support` | pass | 已点名 refresh degraded / failed / older-source / forbidden body 场景 |

---

## 9. 跨异常一致性审计表

| 审计项 | 结果 | 说明 |
|---|---|---|
| 是否有异常要求 Query 写状态 | pass | Query 始终只返回 surface |
| 是否有异常要求 Consumer 直接写核心 truth | pass | Consumer 只写 ref / resolution / pending / stale |
| 是否有异常要求 Job 修复核心 truth | pass | Job 只写 derived / refresh / reconcile / handoff 结果 |
| 是否把下游拒收当作 truth 未成立 | pass | handoff / relay failure 与 truth 成立分离 |
| 是否把外部正文越界写成可接受输入 | pass | 正文一律拒绝或丢弃,只允许 ref / summary |
| 是否把 baseline formality 降成实现细节 | pass | non-formal member 和 dynamic latest 已在概要层点名 |
| 是否把 preview / report / reconciliation 失败误当成业务失败 | pass | 只影响只读和运维面 |

---

## 10. 当前文档问题诊断

| 风险来源 | 问题 | 本轮处理 |
|---|---|---|
| 历史 `02-概要设计.md` | 异常大多停留在“上传失败 / 查询失败”这类功能表述 | 改成按 truth、read、consumer、job 边界组织 |
| Step 8 relay / handoff 流 | 容易误把交付失败理解成 truth rollback | 明确分离 accepted truth 与外围交付结果 |
| Step 9 多状态机 | 容易遗漏 formal version、baseline 和 review 前置异常 | 单独把这些状态前置异常提出来 |
| 自动化与外部引用 | 容易在失败时偷渡正文或直接 truth 化 | 明确 candidate only 和正文越界拒绝线 |

---

## 11. 设计取舍

| 取舍 | 结论 | 理由 |
|---|---|---|
| 是否列完整错误码 | 不列 | 错误码属于详细设计协议契约 |
| 是否逐接口写异常表 | 不逐接口写 | 概要层按处理流族和边界类别归纳足够 |
| 是否补异常影响图 | 补 1 张 | 读 / 写 / 消费 / 维护四类异常会改变边界理解 |
| 是否展开 retry / compensation | 不展开 | 这些属于恢复机制,不属于概要轮廓 |
| 是否把所有开放风险提前写到本步 | 不写 | 这里只保留会扭曲主线理解的异常 |

---

## 12. 回填草稿

正式 `02-概要设计.md` 后续整理时:

- §10 引用本文件 §4 的异常与边界场景总览。
- §10 摘录本文件 §5 的按处理流族归类异常口径。
- §10 摘录本文件 §6 的异常影响图和关键说明。
- §10 摘录本文件 §7 的状态机影响清单。
- `03-详细设计.md` 必须基于本文件继续展开错误码、response surface、幂等结果、expected version、retry、dead-letter、恢复与测试矩阵。

---

## 13. 待确认事项

本步不新增阻塞 Step 11 的待确认事项。详细设计阶段需要继续闭合:

- read surface 中 restricted / degraded / unavailable / redacted 的正式字段组合。
- duplicate replay 的 stored result、ignored result 和 delayed result 结构。
- refresh degraded 与 refresh failed 的 exact response / report 区别。
- handoff retry、receipt、manual recovery 和 target error mapping。
- baseline freeze 失败时 candidate / membership 的回滚或保留策略。

这些属于 `03-详细设计.md` 契约闭口,不阻塞概要设计进入 Step 11。

---

## 14. 进入下一步条件

- 已明确关键异常路径和边界场景。
- 已说明异常落在哪个主要部分、接口类别或状态机处理。
- 已说明异常对读取面、支撑状态、交付状态和 truth 边界的影响。
- 已明确 Query no-write、Consumer 不写核心 truth、Job 不修复 truth 的异常红线。
- 未写入完整错误码、重试参数、补偿脚本、DLQ 结构、事务细节或测试用例。
- 可以进入 Step 11 `配置影响轮廓`。
