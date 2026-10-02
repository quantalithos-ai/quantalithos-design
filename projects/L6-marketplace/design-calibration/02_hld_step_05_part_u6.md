# Step5 U6 审计与恢复

## 思考与诊断

来源：00§9 FR-MP-503/504、00§10相关BR与01§6 U6。本部分职责是局部原子追溯、完整原结果重放、外部审计交接、原意图受控恢复。输入必须为U1～5已提交变化及原intent、正式恢复依据，输出仅local audit/operation result/deferred work、recovery进度。现有01只划责任，未给功能到对象的承接；若继承产品词会越权到Obs准入truth/Archive包/改owner/删历史/新intent盲重发。

取舍：以审计与恢复局部功能为轴，拒绝把Obs准入truth/Archive包/改owner/删历史/新intent盲重发纳入本地对象。计划：功能→候选六维→边界接缝→回填→停审；当前功能表尚未写入。

## 结构化结果

| 功能 / capability | 输入 | 输出 | 状态 / 副作用 | 后续展开 |
|---|---|---|---|---|
| 安全局部审计/完整原结果/外部交接 | accepted局部变化/原operation+qualifiedproducer合同 | audit/result/work及独立ObservationBinding | local原子，externalunknown单独 | §6～9；FR-MP-503；CUT-MP-6 |
| 受控恢复/重放/原意图核对 | formalauthority+typed原目标/probe/重建计划 | RecoveryIntent/report或Blocked | 不改外部truth/旧历史/复活version | §6～9；FR-MP-504；CUT-MP-6 |

| 代码主体 / 模块 | 类型 | 作用 | 后续展开位置 |
|---|---|---|---|
| AuditRecoveryService | Application Service | 编排本部分意图/当前依据与局部变化 | Step7/8、03函数/UoW |
| RecoveryPolicy | Domain policy | 守来源/当前资格/禁止事项，不从配置授权 | Step6/8/9 |
| MarketStorePort / OperationStorePort | inside-owned port | typed存取本部分已成立对象/原结果；不改外部truth | Step7/8、03typed方法 |

| 维度 | 候选对象 | Step 6 展开要求 |
|---|---|---|
| Truth / State | MarketAuditRecord、OperationRecord、StoredOperationResult、DeferredWork、RecoveryIntent | 每独立carrier成卡；enum在carrier状态表，禁止全局Done |
| Policy / Invariant | RecoveryPolicy | 独立卡片，guard输入来源必须闭合 |
| Projection / Read model | AuditRecoveryView | 独立typed read卡片或明确仅U7共享投影切片，不另造存储truth |
| Reference / Boundary | ObservationOutcomeBinding | 独立binding/上下文卡片；纯ref标量列排除 |
| Audit / History | 安全append-only审计本身 | U6 MarketAuditRecord唯一承接，其余只typed关联 |

## 接缝与禁止

U6与U1～5 accepted共UoW；外部审计异步，恢复调用所属flow不直接SQL修改状态。 不承担Obs准入truth/Archive包/改owner/删历史/新intent盲重发。

## 回填与停审

正式§5摘录本功能/代码/候选/边界结果；Step6按候选正式化。已核对功能来源、输入输出、局部状态与证明上限；本部分P1～P8完成，internal stop_review/pass，允许下一个部分。没有创建实现或external evidence。
