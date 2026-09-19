# Step 11. 定义一票否决项

> 对应 SOP：`standards/document/验收标准讨论流程_SOP.md` Step 11  
> 回填章节：`06-验收标准.md` §11 一票否决项

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 11 一票否决项 |
| 当前状态 | `done / pass / self_reviewed` |
| 输入基线 | 正式 00 §14.4；01/03 红线；05 §5.1/§10/§11；Step 5～10 |
| 输出文件 | `design-calibration/06_acceptance_step_11_veto.md` |
| 否决集合 | 恰好 `VETO-CON-001～007` |
| 当前检查结果 | `not_evaluated`；无 evidence instance |
| 下一动作 | 只允许进入 Step 12 |

## 2. 本步计划与目标

本步对七项正式 VETO 逐项固定红线来源、触发条件、检查 TC/EV/report、触发后总体裁决和不可风险接受规则，再审计覆盖、重复和与 S/evidence-integrity 的边界。

## 3. 本步输入

| 输入 | 用途 |
|---|---|
| `00` §14.4 | 七项唯一正式 VETO 文本 |
| `01`/`03` | SDK-only、truth、状态、写边界、redaction/a11y/partial isolation 不变量 |
| `05` §5.1 | VETO 到 TC/EV 的负向追溯 |
| `05` §10/§11 | fault injection、S 级不可降级项 |
| Step 5～10 | 功能/红线/协议/状态/NFR/evidence 详细检查 |

## 4. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 哪些失败直接导致不通过？ | 恰好七项 `VETO-CON-001～007` 任一命中；不允许“有条件通过”。 |
| 来源是什么？ | 均来自正式 00 §14.4，并由 01/03 不变量和 Step 5～10 门禁细化。 |
| 如何检查？ | 每项使用指定负向 TC、future EV instance、fixed run suite/report、artifact pair/digest 与 `veto-checklist.md`，不能静态默认 passed。 |
| 是否允许风险接受？ | 不允许。VETO、其未复验修复和相应 S 均不能被接受覆盖。 |
| 是否覆盖所有 P0 红线？ | 产品/业务红线全部覆盖；evidence integrity、config/gate tooling 等其他 S 级是送验有效性/交付红线，不扩写 VETO 集合。 |
| 是否逐项回指正式来源与 report？ | 是，见 §8.1～§8.2。 |
| 是否逐项停审？ | 是，7/7 见 §8.3。 |
| 是否存在覆盖缺口/风险冲突/不可执行检查？ | 未发现设计缺口；实际检查尚未发生。 |

## 5. 当前文档问题诊断

| 旧问题 | 本步处理 |
|---|---|
| 旧 06 没有完整七项正式 VETO | 逐项恢复并绑定当前设计/TC/EV |
| 旧 workspace/panel 示例替代真正红线 | 删除，使用 owner truth/access/phase/body/verdict/a11y/isolation |
| 空 checklist 可被默认通过 | 必须真实 evidence + reviewer conclusion |
| evidence fraud 是否新造 VETO 不清 | 固定为 S/送验无效，不新增产品 VETO |
| pending contract 可能被误判 VETO | 缺合同本身非 VETO；伪造 ready/绕 blocked 才触发相应 VETO |

## 6. 改动前后对比

| 项 | 旧 | 新 |
|---|---|---|
| 否决集合 | 缺失/混杂旧对象 | 恰好七个正式 VETO |
| 检查 | 人工描述 | TC→EV→report/artifact→checklist |
| 风险接受 | 模糊 | 一律禁止 |
| evidence fraud | 未分类 | S/送验无效，不是 VETO-008 |
| pending | 易当失败 | honest blocked 非 VETO；fake positive 可能触发 |

## 7. 验收裁决取舍

| 议题 | 裁决 |
|---|---|
| 是否增加 `VETO-CON-008` 证据造假 | 否；保持需求稳定 ID；以 S/无有效送验处理 |
| VETO 未执行检查可否默认未命中 | 否；验收不得进入/不得决定 |
| exact positive 缺失是否 VETO | 否；按 baseline blocked/fail；只有越权启用/伪造结论触发正式 VETO |
| VETO 修复后是否可原 run 改 pass | 否；新 run 全量相关回归，旧失败保留 |
| 一个 failure 命中多个 VETO 如何处理 | 可多重映射，但总体结论仍一次“不通过”；不得为去重弱化检查 |

## 8. 结构化中间产物

### 8.1 一票否决项表

| 否决项 | 否决情形 | 原因 | 检查 TC / EV | 触发后裁决 |
|---|---|---|---|---|
| `VETO-CON-001` | DB/internal repository/private bus/sibling source/BFF/本地聚合规则取得或修改业务事实；形成第二 truth；Query/side path 写 owner truth | 破坏 SDK-only 与 owner ownership | ARCH/VIEW/ADAPTER/DIAG；ARCH/FLOW/SECURITY | 总体不通过；S；不可接受 |
| `VETO-CON-002` | actor/scope/visibility/qualification 不可验证、撤销、过期或冲突仍披露受保护内容/存在性或危险动作 | 越权/泄露 | CTX/NAV/INTENT/SEC/CONFIG；UNIT/FLOW/SECURITY | 总体不通过；S；不可接受 |
| `VETO-CON-003` | HTTP/SDK/receipt/toast/cache/optimistic state 宣称完成，或 unknown 副作用请求无依据 replay/double submit | 伪完成与重复副作用 | INTENT/STATE/CONSISTENCY；FLOW/INTEGRATION | 总体不通过；S；不可接受 |
| `VETO-CON-004` | credential/secret/raw/hidden/owner/governance/evidence/audit/report/business body 进入 Console 生命周期 | 敏感/正文越界 | VIEW/ADAPTER/DIAG/SEC/CONFIG/ARCH；SECURITY/ARCH/RELEASE | 总体不通过；S；不可接受 |
| `VETO-CON-005` | UI、固定 control/metric 数量、客户端阈值/flag/cache/partial result 生成 approval/compliance/audit/capability/archive/runtime/readiness 结论 | 客户端越权裁决 | VIEW/TOPIC/STATE/SEC/CONFIG；UNIT/FLOW/INTEGRATION/SECURITY | 总体不通过；S；不可接受 |
| `VETO-CON-006` | 任一适用 C1～C6 目标不能通过 keyboard/screen reader/受支持 AT 理解、操作或安全恢复，而以视觉路径抵消 | 核心可访问性断裂 | NAV/INTENT/RECOVERY/A11Y；ACCESSIBILITY/INTEGRATION | 总体不通过；S；不可接受 |
| `VETO-CON-007` | 单一 owner failure 被扩散为全局事实，或其他 owner success 掩盖该 failure/stale/conflict/unknown | 跨域误导与错误隔离失败 | TOPIC/RECOVERY/SEC/CONSISTENCY；FLOW/INTEGRATION/SECURITY | 总体不通过；S；不可接受 |

### 8.2 VETO 闭环矩阵

共同固定入口：`reports/runs/<run_id>/evidence-index.md`、相应 suite reports/raw artifacts，以及 `reports/acceptance/veto-checklist.md`。

| VETO | 红线来源 | 主要正式契约 | 主要 report | Checklist 必填 |
|---|---|---|---|---|
| 001 | BR-010/012/021/025；AC-BR-003/005；01 §8/§9；03 §7/§10 | 16 Query zero-write、5+16+1/0/0、SDK-only、unique owner write | architecture-static/module-flow/port-adapter/release-dependency | source refs、negative TC、EV、graph/call-ledger result、reviewer conclusion |
| 002 | BR-001～008/018/026；AC-BR-001/002；03 §9 | context/visibility/qualification/current/min disclosure | module-flow/redaction/semantic-a11y/config | invalid-state matrix、protected call/body counts、EV/result |
| 003 | BR-013～017；AC-BR-004；03 §7～§12 | request/result phases、single-flight、dispatch ambiguity、no replay | module-flow/concurrency-race/recovery | submit count、phase assertions、unknown/reconcile evidence |
| 004 | DR-004/008/012/016/024/030；AC-DR-004；03 §11/§14 | whole reject/no echo/body-free diagnostic/config/artifact | redaction-boundary/release-redaction/config | corpus scope、scan result、no-echo proof、safe reviewer note |
| 005 | BR-022～027；AC-BR-005；03 §9/§14 | active≠ready、diagnostic≠audit、profile≠readiness、axes independent | composition/redaction/config/release safety | inference probes、formal refs, no synthetic verdict |
| 006 | BR-032～033；AC-NFR-007；03 §5/§9 | same semantic action/guard/outcome/recovery ceiling | semantic-a11y + selected matrix if required | core path manifest、channel/focus/announcement results |
| 007 | BR-029/031；AC-BR-006；01 §9；03 §8.4/§12 | partition-local status、canonical aggregation、failure isolation | controlled-composition/recovery/concurrency | per-owner permutations、visible failure/sibling preservation |

### 8.3 一票否决逐项停审记录

| VETO | 正式来源 | 检查可执行 | TC/EV/report 固定 | 不可风险接受 | 设计停审 |
|---|---|---|---|---|---|
| `VETO-CON-001` | yes | yes | yes | yes | pass |
| `VETO-CON-002` | yes | yes | yes | yes | pass |
| `VETO-CON-003` | yes | yes | yes | yes | pass |
| `VETO-CON-004` | yes | yes | yes | yes | pass |
| `VETO-CON-005` | yes | yes | yes | yes | pass |
| `VETO-CON-006` | yes | yes | yes | yes | pass |
| `VETO-CON-007` | yes | yes | yes | yes | pass |

### 8.4 S / 送验无效但非新增 VETO

| 情形 | 处理 |
|---|---|
| static evidence/VETO pass、伪 signoff | S；送验无效；不得三值裁决；修复生成链并新 run |
| run mismatch、缺 artifact/report pair/digest、orphan P0 EV | S；送验无效/不可裁决 |
| P0 runner/config/gate silent skip/fallback | S；不进入/不通过，按影响复验 |
| failed/blocked run 被删除或“latest success”掩盖 | S；evidence integrity failure |
| acceptance draft 未经审查 | handoff 不完整；不得签署 |

这些情形可能同时帮助掩盖正式 VETO，但其自身作为证据/交付完整性红线处理，不改变 `VETO-CON-001～007` 的稳定集合。

### 8.5 跨 VETO 覆盖审计

| 审计项 | 结论 |
|---|---|
| 正式 VETO 数量 | 7，恰好一致 |
| P0 truth/access/phase/body/inference/a11y/isolation 红线 | 全覆盖 |
| 重复 VETO 是否导致冲突 | no；允许同一 failure 多映射 |
| 风险接受是否可能覆盖 | no |
| pending contract 是否误触发 | no；honest blocked 本身非 VETO |
| evidence fraud 是否伪装成新 VETO | no；S/送验无效 |
| report/check 路径是否固定 | yes |
| 实际 VETO result | not_evaluated；无 evidence/checklist |

## 9. 回填草稿

正式 §11 应逐字保留七项正式 VETO，并附 TC/EV/check 方式与“任一命中总体不通过、不可风险接受”。同时明确证据欺诈/run mismatch/pair 缺失属于 S/送验无效，不增设第八项；当前 checklist 不存在，不能宣称七项未命中。

## 10. 待确认事项

| 事项 | 当前处理 |
|---|---|
| 实际 VETO reviewer/结论/date | 正式验收填写 |
| baseline-enabled selected checks | 按 Step 3 manifest 加入相关 VETO evidence，不改变 VETO ID |

## 11. 下一步门禁

| 条件 | 结果 |
|---|---|
| 七项 VETO 逐项来源/检查/证据/裁决闭合 | pass |
| 不可风险接受规则明确 | pass |
| S/evidence-integrity 边界无第八 VETO | pass |
| 跨 VETO 审计无 unresolved 冲突 | pass |
| 允许进入 Step 12 | yes |
| 当前 VETO verdict | none / not_evaluated |
| 允许修改正式 06 | no |
