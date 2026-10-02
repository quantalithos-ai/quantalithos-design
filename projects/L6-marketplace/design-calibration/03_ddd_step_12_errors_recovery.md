# 03 Step 12：错误模型、异常分支与恢复口径

## 1. Step状态

2026-10-02；full-restart / single-agent；completed / selfcheck_done / stop_review（文档）。只03，正式装配等待Step19。已读详细SOP Step12、书写规范5.11、前序Step11与finite错误/恢复；保留外部blocker。

### Step内计划

| 项 | 状态 | 位置 |
|---|---|---|
| 输入 / 问题 / 诊断 / 取舍 | done | §2～6 |
| 错误映射单元 | done | §7.1～7.2 |
| 恢复单元与跨单元审计 | done | §7.3～7.5 |
| 草稿 / 自检 / 台账 | done | §8/10 |

## 2. 本步输入

[Step11](03_ddd_step_11_persistence_transactions.md)及问题/codec/cursor诊断与取舍、[Step6 DomainError/ErrorCode/MarketError](03_ddd_step_06_shared_types.md)、[Step7 PortError/ExternalPortError](03_ddd_step_07_typed_ports.md)、[Step8协议](03_ddd_step_08_protocol_contracts.md)、[Step9 Job边界](03_ddd_step_09_job_execution.md)、[U6恢复流](03_ddd_step_09_part_u6.md)、[Step10](03_ddd_step_10_state_matrix.md)。前序retention/performance与exact owner/SDK待确认不关闭。

## 3. SOP问题回答

1. 每模块错误？contracts/domain用十种DomainError，经application映射十八种ErrorCode与MarketError；infra只提供七种PortError和八种ExternalPortError；API统一安全映射，Worker捕获typed实际gap，Web只渲染。不增每模块第二套错误enum。
2. HTTP/RPC/Event？37HTTP统一code映射；12Job只typed Rust report/error，不开放RPC/HTTP；0activeevent无需event nack。Query typed Missing/NotVisible/Degraded与error分开，不能把源失败映成Empty。
3. 重试/人工？读Unavailable可有界重读；本地CAS在证实rollback后可同intent再读取；提交unknown只能原key核对；可能外发只能原intentprobe；无probe/缺原完整报告/破坏codec需正式人工依据或owner修复，不能改DB补成功。
4. 事务/重复/外部失败？A前rollback无外效应；A后失败保留职责。Completed读原完整结果，Reserved给OperationInProgress，不重跑。不同指纹conflict。read timeout是Unavailable，dispatch timeout是Unknown，不相互替代。
5. 审计/日志/event？业务preaccept拒绝无成功audit；仅安全运行分类日志。合法Job保存处理gap/report/audit。0event；本地audit不等外部观测准入/evidence，raw请求/SQL/SDK错误不得记录。

## 4. 当前文档问题诊断

Step8主控只列HTTP码集合，尚缺每finite code→status/Query surface映射。Step11 commitunknown与B失败需将“可重试”限为已知无effect的分支；若API/Worker通用retry重跑将双发。Step9 RunMarketRecovery代码是A/B插入点，A保存后B必须新reload/revision，不能复用A对象或旧revision；本步回修明确。

## 5. 改动前后对比

| 项 | 前 | 后 | 原因 |
|---|---|---|---|
| code/transport | 有限code与码集合 | 穷尽映射/Query安全姿态 | 避免实现自己定失败口径 |
| retry | 各flow自然语言 | 按阶段/确定性/原intent分类 | Unknown不被当notcommit |
| recovery A/B | 插入点复用符号 | B重新加载typed对象/CAS | 不使用陈旧对象覆盖 |

## 6. 设计取舍

| 方案 | 收益 | 风险 | 结论 |
|---|---|---|---|
| HTTP自动retry全部5xx | 简单 | Unknown双发/第二intent | 拒绝 |
| finite safe code+阶段语义 | 可审查恢复 | 调用方须保留原key | 采用 |
| direct SQL manual repair | 快 | 改truth/伪造原结果 | 拒绝 |
| 正式authority的typed recovery/reconcile | 历史连续 | 无证据可长期waiting | 采用 |

## 7. 结构化中间产物

### 7.1 错误类型与归属

错误单元依据§3.1～3.2与§4有限映射缺口，采用现有enum，不新建owner错误truth。

| 错误类型 | 所属模块 | 触发条件 | 是否可重试 | 对外映射 |
|---|---|---|---|---|
| DomainError | contracts声明/domain产生 | schema/transition/gate/condition/fence | 输入错不重试；current gate需新正式basis | 下列穷尽ErrorCode |
| PortError | application port/infra产生 | PG CAS/UK/codec/readonly/commit/availability/cursor | 按阶段确定性，不port隐式retry | 下列穷尽ErrorCode |
| ExternalPortError | application port/SDK adapter | exact资格/披露/绑定/不提交/unknown/material | 只有read有界重读；effect走probe | 下列ErrorCode或Job正式outcome |
| MarketError | application/contracts对外 | 有限code+optional安全reason/operation_ref | 无自动retry含义 | API码与Worker safe error |
| ReadSurface<T> | query facade/contracts | Ready/Empty/NotVisible/Missing/Degraded | 不含mutation或恢复许可 | Query统一JSON安全面 |

DomainError完整映射：InvalidInput/WrongReferenceKind→InvalidInput；BindingMismatch→BindingMismatch；IllegalTransition→IllegalTransition；CurrentGateDenied→CurrentGateDenied；MissingSource/MissingAuthority→ContractBlocked；UnsafeMaterial→UnsafeMaterial；IncompleteRecord→IntegrityFailure；FenceMismatch→FenceMismatch。

PortError完整映射：VersionConflict→VersionConflict；UniqueConflict在operation唯一键竞争先重新find并比fingerprint，same原值replay/busy，异指纹IdempotencyConflict，其他业务UK→VersionConflict；IntegrityFailure/ReadOnlyViolation→IntegrityFailure；CommitUnknown→ExternalCommitUnknown；Unavailable→Unavailable；InvalidCursor→InvalidInput。SafeFailureRef.reason_ref只在当前披露允许时保留，不暴露SQL constraint名字。

ExternalPortError完整映射：ContractBlocked→ContractBlocked；NotVisible→NotVisible；NotFound→Missing（需scope允许区分，否则NotVisible）；BindingMismatch→BindingMismatch；Unavailable→Unavailable（只读）或ExternalCommitUnknown（已经dispatch且没有正式notcommit证明）；UnsafeMaterial→UnsafeMaterial；CommitUnknown→ExternalCommitUnknown。KnownNotCommitted必须formal proof且exact intent绑定，Job转其有限outcome分支，不虚造新的HTTP成功或ErrorCode；非Job无正式effect时仅CurrentGateDenied/ContractBlocked安全拒绝。

### 7.2 HTTP与Query映射

HTTP不是业务状态。21C成功200携原family result；37routes照Step8声明，不造通用执行入口。命令局部accepted不等外部完成。对可见操作的replay可返回安全`Idempotency-Replayed: true` header，payload仍原值；隐藏操作不返回此header/operation_ref。Query整体success200为ReadSurface，包含明确Degraded（不是Empty）；invalid输入才走安全error。

| ErrorCode | HTTP（Command或Query硬错误） | Query实际语义 / 调用方处理 |
|---|---|---|
| InvalidInput | 400 | 修正typed输入/token；不回显坏内容 |
| MissingIdempotencyKey | 400 | 仅C/J；Query不要求key |
| NotAuthorized | 403 | 当前actor/scope权限不能成立，no payload existence |
| NotVisible | 404 | ReadSurface::NotVisible，无refs/count/cursor/token |
| Missing | 404 | 只有current disclosure允许区分才Missing |
| BindingMismatch | 422 | exact source/basis/target绑定不同；不自动换版本 |
| IllegalTransition | 409 | 显式新业务意图，不能复活Withdrawn |
| VersionConflict | 409 | 读取最新revision，原提交确定性先核对 |
| IdempotencyConflict | 409 | 同key异intent；不换key掩盖已执行意图 |
| OperationInProgress | 409 | 原Reserved，GetOperationResult/正式恢复；不新dispatch |
| ContractBlocked | 503 | Query Degraded Unsupported/Unavailable按实际缺口；保留原key |
| CurrentGateDenied | 422 | qualification Query可明确eligible=false/真实safe原因；不造intent |
| FenceMismatch | 409 | 旧worker不得完成/外发；新授权reconcile保存late正式结果 |
| IntegrityFailure | 503 | 缺原result/codec/manifest；安全Degraded Failed，不假Empty |
| Unavailable | 503 | 只读可有界重读；写提交未明先原key核对 |
| ExternalCommitUnknown | 503 | 本地commit未知或已许可effect未知；不暗示失败/未提交 |
| Unsupported | 422 | Query可Degraded Unsupported，不能生产fake fallback |
| UnsafeMaterial | 422 | 拒绝body/credential/raw扫描，no-echo |

MarketError字段仍`code/reason_ref/operation_ref`原schema，不加入raw error stack、URL、SQL、token或“重试=true”。可选operation_ref只有当前已披露合法本地原record时返回，未commit/未获scope不凭生成ID泄漏。

Query当前披露门必须先于operation/result存在性；涉及items/count/page token的过滤相同。source unavailable而非真实空列表时返回Degraded。错误单元停审：10 DomainError/7 PortError/8 ExternalPortError/18 ErrorCode逐个有映射；不存在ActiveEvent/RPC处理口。

### 7.3 恢复单元开工

承接错误单元。问题是已committed A与尚未保存B间每个crash点的责任。诊断：不能把超时与HTTP503统一当可重试，也不能因lease到期把已许可任务重新外发。采用保留原checkpoint/intent与formalprobe的阶段矩阵；拒绝删除OperationRecord或以current projection补全原report。Recovery只安排有正式authority的typed续责，本地目标没有remote proof。

### 7.4 异常、重试与恢复矩阵

| 场景 | 检测位置 | 处理 / 恢复 | 审计 / event |
|---|---|---|---|
| malformed / key缺 / unsafe输入 | entry/codec | 安全拒绝，不存坏body | 仅有限runtime分类；0业务successaudit/0event |
| 当前actor/scope或publisher资格缺 | resolver/FreshGate | fail closed；等待formal owner，Identity AI不能human免校验 | 拒绝无accepted audit |
| 材料未获准/ACK/签名当approval | U1/U2/U3/U4 gate | ContractBlocked/CurrentGateDenied；不能List/Request | 无falseapproval audit |
| fixedbasis不匹配/Submitted改输入 | U2/member | 拒绝；新申请基线显式intent | 不覆盖旧basis/decision |
| samekey completed | runner prepare/reserve | current disclosure后load原完整result；不业务precheck/ID | 原audit不追加 |
| samekey reserved | runner | OperationInProgress；原checkpoint probe/typed recovery | 不complete假report |
| samekey异指纹 | runner | IdempotencyConflict；保留旧record | 无新accepted fact |
| 任一local写失败且已知rollback | Command/JobA/B | 整个本Txnrollback；本地无effect可samekey重进；B保留A并先probe | 本地失败不伪成功；有限诊断 |
| Local commit Unknown | commit边界 | 新RO find原key/load_context/load_checkpoint/load_result。Completed且完整matched才原payload；Reserved保持in-progress；无record并非立即证明rollback，须旧事务正式终局或重新取得写帧锁后核对 | 无重跑effect/不虚造audit |
| A committed但dispatch前退出 | Worker | 有permission即按可能外发；原intentprobe，不凭“没看到调用”证明notcommit | 原A职责保存 |
| ACK/transport timeout | effect adapter | Unknown而非Failed；review ACK仅formaldispatch_outcome存在时WaitingDecision，不approved | B真实unknown/gap报告可保存 |
| formal notcommitted | probe/matched proof | 当下gate允许才同intentretry；distribution新attempt，review/notice正式sameintent/fence规则 | 新处理audit不改旧报告 |
| formal Confirmed | U2/U4/U5/U6结果匹配 | exact application/source/target/scope/binding后保存；非安装/送达/支付/证据 | 本地结果audit，formalreceipt只ref |
| late Confirmed与cancel/withdraw | U4 B/reconcile | 保存原attempt/relation，所有适用disposition增量impact+durable责任同B；不重开admission | late audit，原Cancel/Withdraw仍有效 |
| old fence结果 | Work/Job B | 拒绝覆盖；正式结果待新授权Reconcile，不丢弃或借旧context强写 | 合法新处理保存audit |
| 缺probe / formal outcome字段 | effect恢复 | Blocked/Unknown与真实gap，等待owner或正式manual basis；不可改true/新intent发一次 | Job真实报告/职责保留 |
| 原result missing/wrongkind或原report不足 | OperationStore/finish_original | IntegrityFailure，冻结replay。不得currentview重建/删key；当前reconcile报告可先保存，旧Reserved等待 | 安全诊断/合法recovery audit |
| fixedupper scan不完整/cursor非法 | U5/U7 | partial/gap，exact compound after存DeferredPlan；不可省页KnownScopeComplete | 真实partial report |
| snapshot refresh失败 | U7 | 旧合法safe材料Stale；无合法材料Unavailable；不更新source truth | B真实gap/report |
| rebuild空plan/缺manifest/源变动 | U7 | 不Fresh，Stale/Unavailable，完整typed item gap；源变动新typed维护工作 | no truth repair |
| observation不可用 | U6 | local audit成立；Obs职责独立Unknown/Blocked，对账原operation/auditset | 不admitted/evidence/archive |
| 锁等待/预算超限 | local Tx / scan | knownrollback→Unavailable，不partial accepted；unknown原key解析 | 不记录raw SQL/请求 |
| recovery越界/递归/任意SQL | RecoveryPolicy | Unsupported/NotAuthorized，只八种typed target按合同 | 不改owner、不恢复Listing |

恢复target：Review/Distribution/Notice/Observation必须Some formal inspection并保留完整原结果类型；Snapshot/Projection/Impact为None+原typed维护计划；Recovery variant拒绝；Operation结果问题通过GetOperationResult与原checkpoint读取，不新增MarketWorkTargetRef::Operation。formal人工依据必须已定义RecoveryAuthorityRef与owner适用结果/检查合同，缺则waiting。

### 7.5 跨单元自检

| 检查 | 结果 |
|---|---|
| HTTP503不等业务失败 | code保留unknown，Query Degraded，Job原typed状态；没有自动重发 |
| 原结果/当前披露 | 完整重放或全部安全拒绝，不删字段后冒原结果；旧payload immutable |
| A/B revision | A提交后B typed load取得新revision，不复用A variable |
| no-probe与manual | blocked/waiting，不能用ACK/signature/扫描补proof |
| successaudit边界 | preaccept reject与合法Job负向处理区分；0event，local audit非external证据 |
| scope/order | NotVisible不暴露missing、总数、token或原key存在性 |

## 8. 回填草稿

正式§11使用7.1 finite错误归属与完整映射、7.2十八codes/HTTP/Query口径、7.4阶段化异常/恢复矩阵。完整schema仍以Step6/7为authority，不复制新enum或新增错误字段。

## 9. 待确认事项

MP-UP/SRC/Q及affected consumer保持blocked；不能以error mapping替代owner正式dispatch/probe支持。无probe的manual basis仍需正式owner合同，不新增管理员强制成功入口。

## 10. 进入下一步条件

十八codes、三类错误映射、A/B/unknown/late/missing-original/current disclosure逐项文档自检完成；恢复target不新增variant。允许读取详细SOP Step13、规范5.12、原key/fingerprint/fence与cursor；没有运行验证、owner资格关闭或04授权。
