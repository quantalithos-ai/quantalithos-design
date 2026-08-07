# L2-tools 06 Step 11 一票否决项校准

> 文档状态：Step 11 completed / design stop-review passed
> 当前模式：full-restart
> 回填目标：`06-验收标准.md` §11
> 事实边界：本文只定义未来否决检查与裁决合同，不表示任何实现、测试、evidence、缺陷、风险接受或签署已经发生

---

## 1. 本步输入与执行计划

### 1.1 已读取输入

| 输入 | 本步用途 |
|---|---|
| `standards/document/验收标准讨论流程_SOP.md` Step 11 | 固定逐 VETO 停审、跨 VETO 覆盖审计和进入下一步条件 |
| `standards/document/验收标准书写规范.md` §5.11 | 固定正式 §11 的必备字段和“触发即总体不通过”规则 |
| `00-需求文档.md` §14.3、§16.4 | `VF-L2T-001~013` 唯一正式分母及能力范围 |
| `01-架构设计.md` §3.1、§4.2、§8、§13 | 架构不可变约束、owner、安全、依赖和事实红线 |
| `03-详细设计.md` §3.2~§3.4、§5、§8~§14 | 模块、flow、UoW、状态、并发、配置和观测不变量 |
| `05-测试方案.md` §6.8.2~§6.8.3、§9~§11、§13~§14 | `TC-L2T-VETO-*`、`NC-L2T-*`、suite/check/report 和复验合同 |
| Step 6、Step 10 中间产物 | P0 红线全集、candidate/evidence 权威和固定 projection 路径 |

### 1.2 逐项小循环

每个 `VF-L2T-*` 按以下顺序完成：读取 00 原文 -> 回指 01/03 正式红线 -> 固定触发条件 -> 固定 concrete TC、candidate slot、suite/report/check -> 固定触发裁决与风险接受边界 -> 单项停审。13 项完成后再审计 P0 红线遗漏、重复、证据可执行性和风险接受冲突。

### 1.3 裁决语义

| 状态 | 含义 | 对总体结论的影响 |
|---|---|---|
| `not_triggered` | matching release run 中，负向注入被拒绝、禁止结构不存在，相关 concrete case、suite、mandatory check 和 final eligibility 均闭合 | 只满足该 VF；不能单独推导总体通过 |
| `triggered` | 实现、配置、依赖图、artifact、report 或发布候选包含、接受、持久化、暴露或依赖了 VF 所禁止的行为 | 缺陷级别固定为 `S`，总体结论强制“不通过” |
| `not_evaluated` | 尚无 matching run，或适用 case/check 未执行 | 不是触发事实，但该 VF 未闭合；总体不得“通过”或“有条件通过” |
| `blocked` | 适用检查因依赖、环境或 authority 缺失不可执行 | 不是触发事实；按进入/退出门禁保持不可裁决或不通过，不得当作 `not_triggered` |
| `invalid` | artifact/report/digest/redaction/pairing 或 source tuple 无效 | 不能消费该证据；相关 VF 未闭合，必要时 evidence integrity 自身触发对应 VF |

负向 fixture 中出现被禁止材料不是 VETO 触发；被测系统未能拒绝、隔离或保持零副作用，或发布制品实际包含该违规，才是触发。不存在“未发现即通过”：每个 VF 的 `not_triggered` 必须来自同一 `gate_id=release`、`config_profile=ci-test`、`status=passed` 的 final seal 及其 matching index/manifest/projection。

## 2. 一票否决项主表

所有行的 candidate slot 固定为 `EV-CAND-L2T-VETO-001`。它只是 planned slot；最终只能消费 matching final seal 中的 eligibility item。所有行的 checklist 固定投影为 `reports/acceptance/veto-checklist.md`，并须由 matching `projection-manifest.json` 和 `gate-summary.json` 绑定。

下表中的 suite report 文件名均以 `reports/runs/<run_id>/suites/` 为固定前缀；`redaction-check.md` 位于同一 run 的 safe final report 集。文件名清单必须逐行闭合，不能用 suite 聚合结论替代 concrete case records。

| VF | 正式否决项 | 正式红线来源 | 可执行触发条件 | Concrete TC / owning suite | Fixed report / mandatory checks | 触发后裁决 |
|---|---|---|---|---|---|---|
| `VF-L2T-001` | `C-L2T-1~5` 任一核心能力节点无法成立，或条件路径被写成每次调用固定外仓时序 | `00` §2.2、§14.3、§16.4；`01` §4、§6、§10；`03` §5.9、§6.5、§8.7 | 五节点 selected path 缺节点/换 owner/无法从 contract 到 local outcome-audit-handoff attempt 闭环，或 local/unbound/no-execution 路径被强制依赖 Hub/Auth/Sandbox/Bus/Obs presence | `TC-L2T-VETO-001`；`static-boundary`,`local-closure` | `static-boundary.md`,`local-closure.md`；`check_case_manifest`,`check_dependency_boundary`,`check_blocker_truth` | `S`；总体“不通过”；不可风险接受 |
| `VF-L2T-002` | identity / definition 被显示名、实现、builtin/inventory、provider、capability identity、SDK wrapper、调用方 schema 或派生视图替代 | `00` §5.1、§7、§10、§14.3；`01` `HC-L2T-001`、§4.2；`03` §5.3.1、§10.4 | 任一替代来源可创建、定位、改写 current identity/definition，或 public/store/view 中出现第二 semantic owner | `TC-L2T-VETO-002`；`static-boundary`,`contract-domain`,`application-core` | `static-boundary.md`,`contract-domain.md`,`application-core.md`；`check_dependency_boundary`,`check_redaction_boundary` | `S`；总体“不通过”；不可风险接受 |
| `VF-L2T-003` | Binding 复制 Hub truth、回退本地 registry/allowlist/字符串猜测，或把 visibility 当 authorization | `00` §5.2、§8、§10、§14.3；`01` `HC-L2T-002/005`、§4.2；`03` §5.3.2、§5.5、§13.5~§13.6 | relation/snapshot/assessment 保存 Hub 正文；缺 source 时本地猜测或 fallback 建立 binding；visibility/exposure/applicability 推导 allow/deny | `TC-L2T-VETO-003`；`static-boundary`,`application-core`,`controlled-seam` | `static-boundary.md`,`application-core.md`,`controlled-seam.md`；`check_dependency_boundary`,`check_blocker_truth`,`check_profile_isolation` | `S`；总体“不通过”；不可风险接受 |
| `VF-L2T-004` | caller/carrier 形成第二 invocation/result/error，raw request 成 truth，或 L2 吸收 agent loop/planning/orchestration/retry/recovery/checkpoint | `00` §5.3、§8~§10、§14.3；`01` `HC-L2T-003/004`、§4.2；`03` §5.4、§5.6~§5.8、§7.1、§8.1 | API/worker/Runtime/integration 使用不同 semantic frame、状态或错误；raw carrier 持久化为 invocation；L2 模块/协议出现 Runtime 主线责任 | `TC-L2T-VETO-004`；`static-boundary`,`application-core`,`entry-worker-job` | `static-boundary.md`,`application-core.md`,`entry-worker-job.md`；`check_dependency_boundary`,`check_phase_unknown_fence`,`check_case_manifest` | `S`；总体“不通过”；不可风险接受 |
| `VF-L2T-005` | L2 自我授权、来源不可验证仍放行、sandbox-required 宿主直跑或隔离要求静默降级 | `00` §5.4、§9.4、§10、§14.3；`01` `HC-L2T-005/006`、§4.2、§13；`03` §3.3、§5.3.4、§13.6~§13.8 | missing/stale/conflicting/unverifiable authorization 被映射为 allow/accepted；required Sandbox 缺失时调用 host/direct/其他 carrier；配置或 feature 关闭门禁 | `TC-L2T-VETO-005`；`static-boundary`,`application-core`,`controlled-seam`,`config-validator`,`config-assembly` | `static-boundary.md`,`application-core.md`,`controlled-seam.md`,`config-validator.md`,`config-assembly.md`；`check_blocker_truth`,`check_phase_unknown_fence`,`check_profile_isolation`,`check_dependency_boundary` | `S`；总体“不通过”；不可风险接受 |
| `VF-L2T-006` | 执行前拒绝/等待被记为已执行，或虚构 Sandbox run/capture/receipt/DLQ/cleanup、producer/route/delivery fact | `00` §5.4~§5.5、§10、§14.3；`01` `HC-L2T-006/012`、§10；`03` §5.3.4、§8、§10.2、§13.7 | rejected/blocked/Prepared/local attempt/health/ref 被升级为 accepted/executed/run/receipt/delivery；schema/report 写入不存在的外部事实 | `TC-L2T-VETO-006`；`application-core`,`controlled-seam`,`entry-worker-job`,`transaction-concurrency`,`static-boundary` | `application-core.md`,`controlled-seam.md`,`entry-worker-job.md`,`transaction-concurrency.md`,`static-boundary.md`；`check_phase_unknown_fence`,`check_blocker_truth`,`check_no_static_evidence`,`check_artifact_report_pairing` | `S`；总体“不通过”；不可风险接受 |
| `VF-L2T-007` | raw capture/provider response/Sandbox failure/Bus delivery/Obs projection/Runtime checkpoint 替代 normalized result/error/`ToolAuditEntry` | `00` §5.5、§7、§10、§14.3；`01` `HC-L2T-007`；`03` §5.3.5、§10.3~§10.4、§14.5 | 未经 authority/correlation/mapping/safety assessment 的材料直接形成 terminal outcome；outcome/audit 非原子成对；外部状态成为 local pair owner | `TC-L2T-VETO-007`；`application-core`,`transaction-concurrency`,`observability-redaction` | `application-core.md`,`transaction-concurrency.md`,`observability-redaction.md`；`check_outcome_audit_pair`,`check_phase_unknown_fence`,`check_redaction_boundary` | `S`；总体“不通过”；不可风险接受 |
| `VF-L2T-008` | secret、credential、raw prompt/caller/transport/capture/provider body、高敏完整引用或 evidence 正文进入 truth/audit/handoff，或四项安全门禁未合取 | `00` §7、§10、§13、§14.3；`01` `HC-L2T-009`、§4.2、§13；`03` §3.3、§10.4 `L2T-PERSIST-011`、§14.6 | 任一禁止正文出现在 public carrier、Store、audit、log/metric/span、error、event、report、artifact 或 projection；任一 safety gate false 仍创建 material/Port call | `TC-L2T-VETO-008`；`observability-redaction`,`static-boundary`,`contract-domain`,`config-validator` | `observability-redaction.md`,`static-boundary.md`,`contract-domain.md`,`config-validator.md`,`redaction-check.md`；`check_redaction_boundary`,`check_artifact_report_pairing` | `S`；总体“不通过”；不可风险接受 |
| `VF-L2T-009` | Bus/Obs/SDK/Runtime 消费失败回滚、覆盖或重裁决 local outcome/audit，或驱动 L2 执行 Runtime retry/recovery | `00` §5.5、§8~§10、§14.3；`01` `HC-L2T-008/010`、§10；`03` §5.3.5~§5.3.6、§5.7~§5.8、§10.3、§12 | delivery/observation/checkpoint/client status 改 terminal pair/attempt；Query/Job/Consumer 写修 core truth；unknown 自动重调或换 key | `TC-L2T-VETO-009`；`application-core`,`query-purity`,`entry-worker-job`,`transaction-concurrency`,`observability-redaction` | `application-core.md`,`query-purity.md`,`entry-worker-job.md`,`transaction-concurrency.md`,`observability-redaction.md`；`check_query_no_write`,`check_job_boundedness`,`check_phase_unknown_fence`,`check_outcome_audit_pair` | `S`；总体“不通过”；不可风险接受 |
| `VF-L2T-010` | L2 拥有/合并 Runtime orchestration、Hub registry、authorization decision、Sandbox execution、Bus delivery、Obs store、SDK client、provider control、inventory/assembly/marketplace truth | `00` §3、§6、§8、§14.3；`01` `HC-L2T-004/011`、§4~§8；`03` §2.3、§3.2、§4.3、§5、§13.6 | 模块、Store、Port、package、public protocol 或写路径赋予 L2 任一相邻 owner 的 lifecycle/write authority，或引入相应 sibling implementation dependency | `TC-L2T-VETO-010`；`static-boundary`,`query-purity`,`entry-worker-job` | `static-boundary.md`,`query-purity.md`,`entry-worker-job.md`；`check_dependency_boundary`,`check_query_no_write`,`check_job_boundedness`,`check_case_manifest` | `S`；总体“不通过”；不可风险接受 |
| `VF-L2T-011` | identity/definition/binding/invocation/前置/source/outcome/audit/handoff 的关键来源、变化或缺口不可追溯，或 late material 原地改写事实 | `00` §5~§7、§9~§10、§14.3；`01` `HC-L2T-010`、§9~§12；`03` §9~§12、§14.5 | 缺 source/time/correlation/anchor/fact/gap；CAS/UoW/append/pair 不变量破坏；late status/source/body 覆盖 current/terminal/history/attempt | `TC-L2T-VETO-011`；`contract-domain`,`application-core`,`transaction-concurrency`,`entry-worker-job` | `contract-domain.md`,`application-core.md`,`transaction-concurrency.md`,`entry-worker-job.md`；`check_outcome_audit_pair`,`check_phase_unknown_fence`,`check_case_manifest`,`check_artifact_report_pairing` | `S`；总体“不通过”；不可风险接受 |
| `VF-L2T-012` | 开放 Core/Obs/SDK contract 被写成事实，pending/future 依赖升格，runtime/event 写成 sibling dependency，或 material handoff 形成第四依赖类型 | `00` §6、§11.2、§14.3、§15；`01` `HC-L2T-011/012`、§5、§8；`03` §3.2、§13.6、§17 | manifest/import/schema/route/client/report 宣称 open seam ready；`DB-L2T-003/008` 当前化；非 Core sibling compile；handoff 被登记为新依赖类别 | `TC-L2T-VETO-012`；`static-boundary`,`config-validator`,`config-assembly`,`controlled-seam` | `static-boundary.md`,`config-validator.md`,`config-assembly.md`,`controlled-seam.md`；`check_dependency_boundary`,`check_blocker_truth`,`check_profile_isolation`,`check_no_static_evidence` | `S`；总体“不通过”；不可风险接受 |
| `VF-L2T-013` | 旧 API/event/error、builtin/MCP Client/extras、旧量化指标，或测试/evidence/签署/blocker 闭口被伪装为当前事实 | `00` §1、§11.3、§14.3、§15；`01` `HC-L2T-013/014`、§3.2；`03` §3.4；`05` §9~§14 | source/contract/code/config/report 复活历史名称/主线/无 authority 数值；静态 candidate/health/fake 被写 eligible；伪填 run/digest/verdict/signoff；`L2T-UP-*` 被静默关闭 | `TC-L2T-VETO-013`；`static-boundary`,`observability-redaction`,`release-local-smoke` | `static-boundary.md`,`observability-redaction.md`,`release-local-smoke.md` 及 matching release projections；`check_dependency_boundary`,`check_blocker_truth`,`check_no_static_evidence`,`check_artifact_report_pairing`,`check_redaction_boundary` | `S`；总体“不通过”；不可风险接受 |

## 3. 检查与证据消费合同

### 3.1 固定证据链

```text
TC-L2T-VETO-001~013 + mapped NC-L2T-001~025
  -> owning suite raw case / effect journal / suite report
  -> reports/runs/<run_id>/suites/<suite>.md
  -> evidence-index.json derivation for EV-CAND-L2T-VETO-001
  -> exact mandatory checks
  -> acceptance-draft/veto-checklist.md
  -> fixed reports/acceptance/veto-checklist.md + projection-manifest.json
  -> gate-summary.json final eligibility
  -> 06 reviewer per-VF decision
```

机器证据必须来自一个 fixed release run，不能跨 run 拼接。`evidence-index.json` 只记录 derivation，`veto-checklist.md` 只作 working projection，二者都不能独立宣称 `not_triggered`、验收结论或签署。审查者必须同时验证 final seal、index、manifest、四份 exact-byte projection 和对应 raw/report/check refs。

### 3.2 VF checklist 最低字段

未来 `veto-checklist.md` 的每个 VF block 至少包含：`vf_id`、正式 registry/source refs、`tc_refs`、mapped `nc_refs`、owning suites、raw artifact refs/digests、human report refs/digests、applicable check refs/digests/status、candidate slot、final eligibility、safe finding refs、review disposition。不得包含 raw body、真实 secret、未脱敏 diagnostic、预填 verdict/signoff 或 risk acceptance。

### 3.3 触发优先级

1. 任一可验证 `triggered` 优先于其他 AC、defect、residual 或签署记录，总体立即裁决“不通过”。
2. 多个 VF 可由同一 finding 同时触发；分别记录 VF，不复制 defect truth，也不以“主要 VF”隐藏其他触发。
3. `not_evaluated/blocked/invalid` 不是 `not_triggered`；是否形成“不可裁决”或“不通过”由 Step 14 的进入/退出优先级统一裁决，但绝不允许“通过/有条件通过”。
4. 修复只能在新 fixed release run 中证明 `not_triggered`；旧 failure run 和 finding 只读保留。

## 4. `NC-L2T-001~025` 辅助映射

`NC-L2T-*` 是配置/边界负向断言，不形成第二套 VETO 分母，也不改变 `VF-L2T-001~013` 的唯一编号。每项只能作为相应 VF 的 concrete supporting assertion。

| NC | VF / VETO case | 最小断言 |
|---|---|---|
| `NC-L2T-001` | `VF-L2T-002` / `VETO-002` | profile/ref/feature 不创建或改写 identity/definition/invocation/outcome/audit truth |
| `NC-L2T-002` | `VF-L2T-010` / `VETO-010` | config 不引入 sibling/reverse dependency 或第二协作主链 |
| `NC-L2T-003` | `VF-L2T-002` / `VETO-002` | Clock/ID adapter 不改变 semantic identity/revision |
| `NC-L2T-004` | `VF-L2T-011` / `VETO-011` | config/reload/alias 不切 current definition |
| `NC-L2T-005` | `VF-L2T-003` / `VETO-003` | availability/feature 不改 Binding mode/history |
| `NC-L2T-006` | `VF-L2T-003` / `VETO-003` | Hub visibility/inventory/fake 不推 authorization allow |
| `NC-L2T-007` | `VF-L2T-004` / `VETO-004` | caller/carrier 共享 canonical invocation/result/error |
| `NC-L2T-008` | `VF-L2T-008` / `VETO-008` | raw body/secret/capture/provider response 不进入 local surface |
| `NC-L2T-009` | `VF-L2T-005` / `VETO-005` | admission gate 不可关闭或被 timeout/retry 绕过 |
| `NC-L2T-010` | `VF-L2T-005` / `VETO-005` | auth missing/stale/conflict/unverifiable 全部 fail closed |
| `NC-L2T-011` | `VF-L2T-003` / `VETO-003` | requirement/auth/Sandbox requirement 三 owner 不合并 |
| `NC-L2T-012` | `VF-L2T-005` / `VETO-005` | sandbox-required 不 host/direct bypass |
| `NC-L2T-013` | `VF-L2T-006` / `VETO-006` | local attempt/ref/health 不推 accepted/run/receipt |
| `NC-L2T-014` | `VF-L2T-007` / `VETO-007` | source 经 authority/correlation/mapping assessment 后才 normalized |
| `NC-L2T-015` | `VF-L2T-007` / `VETO-007` | 每 invocation 最多一个 immutable terminal outcome |
| `NC-L2T-016` | `VF-L2T-007` / `VETO-007` | outcome/audit 同一 UoW 原子成对 |
| `NC-L2T-017` | `VF-L2T-008` / `VETO-008` | safe handoff 四门缺一即无 material |
| `NC-L2T-018` | `VF-L2T-009` / `VETO-009` | submission/delivery/observation 不参与 local terminal |
| `NC-L2T-019` | `VF-L2T-009` / `VETO-009` | Bus delivery 与 Observation status 分离 |
| `NC-L2T-020` | `VF-L2T-009` / `VETO-009` | Query/Consumer/Job 不越过 no-write/no-repair fence |
| `NC-L2T-021` | `VF-L2T-011` / `VETO-011` | gap resolve 需 subject owner repair + L2 reread |
| `NC-L2T-022` | `VF-L2T-011` / `VETO-011` | stale/unavailable projection/report 不替代 core truth |
| `NC-L2T-023` | `VF-L2T-011` / `VETO-011` | 状态词表、合法迁移、append-only/immutable 不可配置 |
| `NC-L2T-024` | `VF-L2T-012` / `VETO-012` | candidate/pending/blocked/fake/ref 不等 implementation ready |
| `NC-L2T-025` | `VF-L2T-010` / `VETO-010` | 不引入 Runtime planning/orchestration/retry/recovery/DLQ truth |

计数审计：`NC-L2T-001~025` 共 25 项且每项恰映射一个主要 VF；它们可被其他 VF 的检查共同消费，但不扩展 `VF-L2T-*` 或 `TC-L2T-VETO-*` 的正式编号范围。

## 5. 逐项停审记录

停审维度固定为：`R` 正式红线来源；`T` 触发条件可判定；`C` concrete TC/suite/check 可执行；`E` candidate/report/final eligibility 权威固定；`A` 触发即 S/不通过且不可风险接受。`pass` 仅表示设计停审，不是该 VF 的实际运行结果。

| VF | R | T | C | E | A | 设计停审 |
|---|---:|---:|---:|---:|---:|---|
| `VF-L2T-001` | pass | pass | pass | pass | pass | pass |
| `VF-L2T-002` | pass | pass | pass | pass | pass | pass |
| `VF-L2T-003` | pass | pass | pass | pass | pass | pass |
| `VF-L2T-004` | pass | pass | pass | pass | pass | pass |
| `VF-L2T-005` | pass | pass | pass | pass | pass | pass |
| `VF-L2T-006` | pass | pass | pass | pass | pass | pass |
| `VF-L2T-007` | pass | pass | pass | pass | pass | pass |
| `VF-L2T-008` | pass | pass | pass | pass | pass | pass |
| `VF-L2T-009` | pass | pass | pass | pass | pass | pass |
| `VF-L2T-010` | pass | pass | pass | pass | pass | pass |
| `VF-L2T-011` | pass | pass | pass | pass | pass | pass |
| `VF-L2T-012` | pass | pass | pass | pass | pass | pass |
| `VF-L2T-013` | pass | pass | pass | pass | pass | pass |

停审计数为 13/13。当前实际状态仍全部 `not_evaluated`，不存在 run、finding、defect 或验收裁决实例。

## 6. 跨 VETO 覆盖审计

| 审计项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 唯一分母 | pass | `VF-L2T-001~013` 与 00 §14.3 完全对应；未新增、改名、合并或删减 VF |
| 五核心节点 | pass | `VF-001` 验整体定位；`VF-002~009/011` 验各节点 owner、输入、终态和时点；无节点孤儿 |
| 相邻 owner | pass | Runtime/Hub/Auth/Sandbox/Bus/Obs/SDK/provider/inventory/marketplace 由 `VF-003~010/012` 覆盖 |
| Security / forbidden body | pass | self-auth、isolation bypass、raw/external body 和四门合取由 `VF-005/008` 覆盖 |
| Local truth / consistency | pass | no-execution、pair、late material、external reverse-write、unknown/retry 由 `VF-006~009/011` 覆盖 |
| Dependency pruning | pass | compile/runtime/event、pending/future、handoff 非第四类由 `VF-010/012` 覆盖 |
| Historical / evidence truth | pass | 旧合同/指标、blocker closure、static evidence、伪造结果/签署由 `VF-013` 覆盖 |
| 25 条 NC | pass | 25/25 映射到既有 VF；没有第二 denominator 或孤儿 NC |
| Concrete TC | pass | `TC-L2T-VETO-001~013` 与 VF 一一对应；没有主题标签冒充 concrete case |
| Candidate / report | pass | 单一 candidate slot 回指所有 concrete records；fixed checklist、manifest 和 final seal authority 无歧义 |
| Check 可执行性 | pass | 每个 VF 至少有 owning suite、fixed report 和 applicable mandatory check；不存在只靠人工口号的 VF |
| 缺证据语义 | pass | missing/blocked/invalid 不推 `not_triggered`；也不伪造触发事实 |
| 重复触发 | pass | 同一 finding 可触发多个 VF，但每个 VF 独立记录；defect truth 不复制 |
| 风险接受冲突 | pass | 13/13 均为 S 且禁止风险接受；Step 13 不得覆盖 |
| 当前事实 | pass | 未生成 run_id、commit、digest、case result、finding、defect、risk decision、verdict 或 signoff |
| 上游 blocker | pass | `L2T-UP-001~009` 继续开放；只影响受影响 positive qualification，不被本步静默关闭 |

跨 VETO 审计无 unresolved 冲突，无新增上游 blocker。

## 7. 旧正式 06 差异与取舍

| 旧内容 | 当前裁决 |
|---|---|
| 只有零散安全门禁，没有 13 项需求 VF 分母 | historical only；正式 §11 必须完整展开 `VF-L2T-001~013` |
| `ToolPolicy/ToolScope`、host callback、builtin/MCP/extras 主线 | 与当前 owner/identity/invocation 边界冲突，不继承 |
| 百分比、SLA、回放率和“待签署”表格 | 无 measurement/evidence/signoff authority，不继承 |
| model review / compare trace 等非固定证据 | 替换为 concrete TC、raw/report/check、candidate、manifest/seal 和 reviewer decision 链 |
| S 级示例只有少量旧对象 | 替换为 VF 全集；缺陷/复验细节由 Step 12 承接 |

## 8. 正式章节回填草稿

正式 §11 应包含：裁决语义、`VF-L2T-001~013` 主表、每行正式来源/触发/TC/suite/report/check/裁决、固定 evidence chain、25 个 NC 辅助映射、逐项停审和跨项审计。正文必须明确：candidate/checklist 不等 evidence；没有 matching release seal 时 VF 不能标 `not_triggered`；任一触发强制 S 和总体“不通过”；任何 VF 都不可风险接受。

## 9. 进入下一步条件

- [x] `VF-L2T-001~013` 与需求分母一一对应，正式红线来源可回指。
- [x] 13/13 均固定触发条件、concrete TC、candidate、suite、report 和 mandatory check。
- [x] 13/13 均固定为 S、触发即总体“不通过”、不可风险接受。
- [x] `NC-L2T-001~025` 25/25 映射且不形成第二 VETO 分母。
- [x] 逐项停审 13/13 通过，跨 VETO 审计无 unresolved 冲突。
- [x] 允许进入 Step 12：缺陷分级、复验与放行规则。
