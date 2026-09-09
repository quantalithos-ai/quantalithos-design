# Step 12. 错误模型、异常分支与恢复口径

> SOP Step12；书写规范§5.11；回填正式03 §11。

## 1. Step 状态

completed / pass_with_external_slots。首批错误映射已回源修正；下一步Step13补审。无项目测试或实现事实。

## 2. 本步输入

[Step6-A](03_ddd_step_06a_shared_contracts.md) ContractError/DomainError/SafeFailureCode；[Step7](03_ddd_step_07_trait_port_adapter_contracts.md) ApplicationError及CommitResolution；[Step8](03_ddd_step_08_protocol_contracts.md) §7.2/consumer receipts；[Step9](03_ddd_step_09_function_flows.md)、[Step10](03_ddd_step_10_state_matrix.md)、[Step11](03_ddd_step_11_persistence_transaction_consistency.md)。参考governance Step12的逐层分类与逐分支恢复，不复制其DLQ/outbox错误。

## 3. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 模块有哪些错误？ | contracts结构校验、domain不变量、application统一12个内部分类；infra/api/worker/jobs映射已有分类，不扩公共enum。 |
| 对外如何映射？ | typed library沿Step8，失败只含availability/code；无已绑定HTTP/RPC数值。 |
| 哪些可重试？ | 确定未提交的技术暂态可受控重试；版本变化需重新决策；合同/安全缺失等新依据；损坏/溢出人工处理。 |
| 事务、冲突、重复怎么处理？ | 已存同key同digest优先返原值；异digest Conflict；unknown先resolve_commit。 |
| 哪些写日志/审计？ | accepted结果仅同事务局部记录；拒绝/暂态可安全日志；无outbound，日志不参与事实提交。 |

## 4. 当前文档问题诊断

首批把Mismatch固定为Conflict、InvalidTransition固定InvalidRequest、Gap固定SourceUnavailable，又把consumer Conflict写Rejected，无法和Step8/10一致。改为按来源语境映射，Gap沿专用receipt，内部error不直接序列化。StorageUnavailable对外code是SourceUnavailable，availability才是Unavailable。

## 5. 改动前后对比

| 首批歧义 | 本轮修正 |
|---|---|
| 无scope也显示ContractBlocked/冲突详情 | 所有可识别原因先经过当前scope可公开门禁，否则NotAvailable/Blocked |
| 自动重新读expected再改同key请求 | expected属于digest；改变语义需新显式请求，旧unknown必须先解决 |
| unknown“保存attempt” | 技术commit回执与效果同事务；不追加另一业务失败记录 |
| 任何暂态都记录Blocked | 持久Blocked必须有RecoveryFailureBasis，技术失败可零写 |

## 6. 设计取舍

错误表示“此次调用如何继续”，不新增全局状态机。当前权限无法证明时先裁剪错误；即使事务已提交，输出撤权也不回滚既有局部事实。不另画图：Step9/10已含异常顺序，本步映射表可直接指导match分支。

## 7. 结构化中间产物

### 7.1 模块错误、Domain到Application映射

| 来源 / 内部错误 | application分类 | 恢复要求 / 测试切口 |
|---|---|---|
| ContractError::InvalidIdentifier/InvalidValue/WrongKind/Unsupported | InvalidInput | 拒绝当前输入；不回显字段 |
| ContractError::Mismatch、DomainError::Mismatch | 请求不一致InvalidInput；已存数据不一致InvariantViolation | 检查调用位置，不用一条通配Conflict覆盖 |
| ContractError/DomainError::MissingBasis | 未绑定正式合同ContractBlocked；scope/visibility依据不可证分别ScopeUnavailable/VisibilityUnavailable | 缺合同与撤权不等技术超时 |
| DomainError::InvalidTransition | 已有终态上的新动作Conflict | 读状态后新显式意图；旧key合法replay仍回原值 |
| DomainError::VersionConflict/DigestConflict | Conflict | 前者读新状态后由调用方决定；后者当前key永久拒绝异digest |
| ContractError/DomainError::VersionExhausted | InvariantViolation | 无wraparound或时间替代版本；人工介入 |
| DomainError::SafetyBlocked | SafetyBlocked | 新generation与正式新baseline，不原地解除 |
| DomainError::Unsupported | InvalidInput | Strong/query未支持变体拒绝 |
| DomainError::Gap | consumer专用Gap流程；非该分支落InvariantViolation | 只有具名mark_gap及提交确认能返回Gap receipt |
| owner故障 / local store确定读失败 | SourceUnavailable / StorageUnavailable | 已授权安全语境可Unavailable；不能推删除 |
| commit无法确定 | OutcomeUnknown | 先权威resolve_commit；不能返回NotCommitted |
| FK断链/结果缺失/提交后不自洽 | InvariantViolation | 保留现状并阻塞受影响读写，不自修正文 |

Domain映射依flow语境，不能仅实现无上下文From<DomainError>后猜原因。匹配非法外部schema时拒绝；损坏已存schema时InvariantViolation。ScopeService永远不由role_refs自行生成allow。

### 7.2 Application到公共响应的唯一映射

| ApplicationError | SafeFailureCode | FailureAvailability |
|---|---|---|
| InvalidInput | InvalidRequest | Blocked |
| ScopeUnavailable / VisibilityUnavailable / NotFound / SafetyBlocked | NotAvailable | Blocked |
| ContractBlocked | ContractBlocked | Blocked |
| SourceUnavailable / StorageUnavailable | SourceUnavailable | Unavailable |
| Conflict | Conflict | Blocked |
| CursorInvalid | CursorInvalid | Blocked |
| OutcomeUnknown | OutcomeUnknown | Unavailable |
| InvariantViolation | NotAvailable | Blocked |

表内ContractBlocked、Conflict、SourceUnavailable等只在当前scope可公开后使用，否则统一NotAvailable/Blocked。SafeReadFailure不得附scope、record、ref、count或provenance。Cursor malformed、旧版本、篡改、错误主体统一CursorInvalid，不泄露解密/密钥原因。

### 7.3 Consumer与Operations分支

| 分支 | 条件 / 输出 | 持久效果 / 恢复 |
|---|---|---|
| source Applied/LateIgnored | terminal record可权威回读 | Step11原子集合；交付不是ACK |
| source Duplicate | 同完整source key+digest且已存终局 | 原record与cursor/revision；不重算 |
| source Conflict | 已有key异digest | receipt Conflict；记录不变，不改Rejected |
| source Gap | mark_gap提交确认 | 非terminal gap，等待owner bridge |
| source Blocked | schema/安全依据缺失 | 不占source成功key |
| source Retry | 技术暂态且无未决写 | 由正式transport政策重投；本仓不认定ACK/DLQ |
| source Rejected | 已验证为非法输入 | 不追加成功记录 |
| source Unknown | commit未决 | 权威lookup，未解前不apply |
| invalidation NoTargets | 当次枚举空 | 无永久global成功键；之后可重枚举 |
| invalidation多目标 | Step8 PageReceipt逐partition结果 | 未决目标先解决再推进next；已成功目标保持结果 |
| Operations保存Blocked/Failed | 具名failure_basis且commit确认 | WriteDelivery::Committed只表示已存失败终态 |
| Operations终态重试 | 同key返历史结果；新key尝试迁移Conflict | 不复活Blocked/Failed/Superseded/Completed |

### 7.4 异常检测与恢复矩阵

| 检测位置 / 场景 | 处理 | 写入和观测 |
|---|---|---|
| SourceReadService合同缺失 | ContractBlocked | 零projection写；安全slot日志 |
| AtomicStore确定回滚 | NotCommitted | 不存operation；可以同语义key重新准备 |
| store连接断开/超时 | Unknown或Pending | 不能发新失败事务掩盖原提交 |
| query旧token | CursorInvalid，调用方明确重新首读 | 零写，不自动刷新 |
| Ready候选有合法新数据 | 按Step10回Validating | candidate撤销validation与attempt同事务 |
| safety invalidation | source范围与目标正式验证 | 保存局部record及SafetyBlocked；Query即时owner检查补扫描延迟 |
| 无法证明新baseline覆盖旧失效 | 保持blocked | 不清失效引用 |
| 日志sink不可用 | 保留业务结果，丢弃安全技术观测可计本地丢失数 | 不重执行业务，不伪造独立审计证据 |

## 8. 回填草稿

正式§11保留§7分类与恢复表，字段定义继续按Step6-A/Step7/Step8。所有错误可回指模块、flow、状态与Step16测试；无HTTP/topic虚构。

## 9. 待确认事项

WS-UP原九项持续；WS-LOCAL-001阻塞driver终局证明，WS-LOCAL-002由后续04/07确认transport和数值策略。未确认为Pending/ContractBlocked，不声称已验证重试或回滚。

## 10. 进入下一步条件

本步九种DomainError、七种ContractError与十二种ApplicationError均有位置相关映射；consumer保留专用receipt、恢复终态和日志边界。补审通过，允许Step13；正式03仍待装配。
