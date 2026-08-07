# 06 验收标准校准 · Step 9 非功能验收门禁

## 1. Step 状态

- 状态：[x] 已确认
- 对应 SOP：`standards/document/验收标准讨论流程_SOP.md` Step 9
- 回填章节：正式 `06-验收标准.md` §9

### 1.1 Step 内计划

- [x] 读取 Step 8、00 §13/§14、05 §5.5/§10/§13~§14
- [x] 固定 `AC-L2T-034~039` 与 `NFR-L2T-001~019` 六维分母
- [x] 区分结构性 P0、external positive、future quantitative qualification
- [x] 为每维定义有来源阈值、方法、concrete TC/theme、candidate slot、report 与失败影响
- [x] 审计旧数字、未执行项、P1/P2 和 VETO 边界
- [x] 形成回填草稿和进入 Step 10 门禁

## 2. 本步输入

| 输入 | 固定事实 |
|---|---|
| `00-需求文档.md` §13 | 六类 19 项 NFR；明确当前无负载模型、测量对象、evidence authority，禁止继承旧百分比/P95/P99/QPS/SLA |
| `00` §14 | 六个稳定 AC：`AC-L2T-034~039`，均不表示已通过 |
| `05-测试方案.md` §10 | 21 个 `NFS-*` 专项方法与结构性 oracle；NFS 是专项 ID，不是 concrete TC |
| `05` §5.5/§13.2 | NFR candidate 由同 run concrete cases 派生；`EV-CAND-L2T-NFR-*` 不是 evidence instance |
| `05` §9/§14 | release 必须覆盖 11 个 P0 suite 与 11 个 mandatory check；provider positive 不减少 local denominator |
| Step 6~8 | data/security redline、37 protocol、29 state/TX/consistency gate 已固定，本步不重定义其 pass/fail |

## 3. SOP 问题回答

1. **哪些非功能指标是 P0？**

   六维都进入当前验收。性能为 structural P0：核心不被外围阻塞、优化不破坏 correctness、sample provenance 完整；不是数字延迟 P0。可用性、安全、审计追溯、幂等一致性、可观测性均为结构性 P0，其中 forbidden body、自授权/旁路、owner/reverse-write、pair/unknown/duplicate、static evidence 等失败可升级 VETO。

2. **阈值来自哪里？**

   只来自正式 00/03/04/05：零 forbidden body/secret，零 Query write/Port，零 Job core repair，safe handoff 四门全部成立，applicable concrete denominator 和 mandatory check 全部 closed，same-UoW pair、at-most-one side effect、one CAS winner 等结构阈值。不存在 latency/QPS/capacity/availability percentage authority。

3. **哪些专项未覆盖，是否影响验收？**

   production-like、真实 provider、数字 performance/capacity、SDK client 和物理 route qualification 当前未覆盖；它们不能支撑当前 positive readiness，也不能减少 local P0。若 scope manifest 把某项声明为当前送验目标而证据缺失，则对应门禁不通过/不可进入；否则保留 residual/future，不伪称完成。

4. **哪些失败阻断？**

   任一 P0 structural oracle 失败、证据 invalid/missing、redaction/dependency/pair/phase/purity/boundedness 失败均使总体不得通过；命中 `VF-L2T-001~013` 则强制不通过且不可风险接受。P1 positive blocked 不等 P0 failure，除非被谎报为 ready/pass。

5. **证据来自哪里？**

   同一 fixed release run 的 concrete case raw/suite reports、NFR derived candidate pages、mandatory check outputs 与 matching final seal。`evidence-index.json` 只给 derivation，最终资格只能由 passed release `gate-summary.json` 给出。

## 4. 当前文档问题诊断

| 旧 06 问题 | 影响 | 本步修正 |
|---|---|---|
| 写死 100%、0、无 drift、恢复成功率 | 没有 measurement authority 且对象不清 | 删除无来源数值，只保留正式结构阈值 |
| 把 runtime/member/observability 全部消费作为当前一致性成功 | 要求下游完整实现并扩大范围 | local seam 与 external positive 分层 |
| “audit/metrics/trace 补偿恢复” | 让观测层取得 truth 修复权 | 观测只发现/关联，不修复或驱动 Runtime recovery |
| 没有 NFR 到 concrete source/report | 无法复验 | 每维固定 NFS method、concrete family、candidate、suite/report/check |
| 未执行项默认列风险即可通过 | 绕过 P0 | applicable P0 evidence 缺失不得通过；只有 eligible residual 才可能条件通过 |

## 5. 改动前后与裁决取舍

| 项 | 改动前 | 改动后 | 理由 |
|---|---|---|---|
| 性能 | 百分比/速度口号 | structural independence + provenance；数字 future | 当前无测量 authority |
| 可用性 | 所有依赖可用 | dependency failure 的保守收束与 local truth first | 外部 owner 未闭口 |
| 安全 | 未授权成功率=0 | forbidden/owner/auth/isolation/four-gate 全 surface oracle | 可执行且来源正式 |
| 一致性 | “无 drift” | digest/replay/CAS/pair/late material/carrier parity | 可定位到 TC/effect journal |
| 可观测性 | 有日志即可 | safe fields/closed labels/owner/status separation/no repair | log 不等 audit/truth/evidence |

## 6. 结构化中间产物

### 6.1 非功能证据共同规则

```text
nfr_gate_pass :=
  every applicable structural NFR oracle has eligible same-run evidence
  AND all related mandatory checks are passed in the matching release seal
  AND no VF trigger or invalid/missing artifact exists
  AND quantitative claims are made only when a formal measurement authority exists
  AND blocked/future/external-positive scope is not promoted to current readiness
```

各表 report 固定在 `reports/runs/<run_id>/suites/<suite>.md`，raw 固定在 `artifacts/test/<run_id>/suites/<suite>/`。NFR derived slot 必须回指同 run concrete cases，不能作为独立 synthetic test result。

### 6.2 六维非功能验收表

| AC / NFR / dimension | Current threshold and through condition | Failure condition | Method / concrete source | Candidate / reports / checks | Decision |
|---|---|---|---|---|---|
| `AC-L2T-034`; `NFR-L2T-001~003`; performance | core contract/binding/precondition/local outcome 可在外围 search/diff/job/event/observer disabled 时独立完成或 typed 收束；bounded variations 不改变 state/error/digest/redaction/phase/purity；sample 带 run/profile/suite/case/dataset/clock provenance；**无 numeric pass** | 外围或下游成为核心隐式前置；为速度关闭 UoW/CAS/pair/redaction/phase/purity/bound；无 authority 却声称 latency/QPS/capacity 达标 | `NFS-PERF-01~02`; `QUERY/PRE/OUTCOME/HANDOFF/TX/CFG/OBS` concrete cases | `EV-CAND-L2T-NFR-AVAIL-001`,`EV-CAND-L2T-NFR-CONS-001`; `query-purity`,`application-core`,`transaction-concurrency`,`config-*`,`observability-redaction`,`local-closure` reports；profile/case manifest checks | structural P0；数字 qualification `unverifiable/future` |
| `AC-L2T-035`; `NFR-L2T-004~006`; availability | peripheral/Bus/Obs/SDK unavailable 不回滚 core/local pair；Hub/Auth/Sandbox missing/stale/conflict/unverifiable 仅影响适用 path 并 fail closed/no-execution/gap；unaffected local reads 成立 | overall collapse、default allow、host fallback、fake run/receipt、external failure rollback/overwrite、blocked 改 pass | `NFS-AVAIL-01~02`,`NFS-REC-03`; concrete `PRE/OUTCOME/HANDOFF/QUERY/CONSUMER/JOB/ERR/OBS` | `EV-CAND-L2T-NFR-AVAIL-001`; fixed `application-core`,`query-purity`,`entry-worker-job`,`transaction-concurrency`,`observability-redaction`,`controlled-seam` reports；blocker/profile checks | local/negative P0；provider positive conditional |
| `AC-L2T-036`; `NFR-L2T-007~010`; security | forbidden-body corpus 在 persistence/public carrier/log/metric/trace/audit/report/config/handoff 全部零泄漏；missing auth fail closed；sandbox-required no host；Hub/owner truth 不复制；safe material 四门全部真才有 material/Port | 任一正文/secret/full sensitive ref 泄漏；self-auth/default allow/host run；local registry/owner takeover；四门缺一仍交接 | `NFS-SEC-01~03`,`NFS-DEP-01`; concrete `FOUNDATION/PRE/HANDOFF/CFG/OBS/VETO` | `EV-CAND-L2T-NFR-SEC-001`,`EV-CAND-L2T-VETO-001`; fixed `static-boundary`,`contract-domain`,`application-core`,`config-*`,`observability-redaction` reports；dependency/redaction/blocker checks | P0 hard；applicable failure usually VETO |
| `AC-L2T-037`; `NFR-L2T-011~013`; audit/traceability | identity -> definition/revision -> binding -> invocation/anchor/admission -> requirement/source -> outcome/audit pair -> material/attempt/gap 可由 safe refs 和 time-point facts 回链；owner/failure/status 分层 | 链路断裂、pair 不原子、正文替代 ref、delivery/observation/checkpoint 替代 audit、late overwrite | `NFS-OBS-01~03`,`NFS-CONS-01/03`; concrete `OUTCOME/HANDOFF/CONSUMER/CONT/OBS/TX` | `EV-CAND-L2T-NFR-AUDIT-001`,`EV-CAND-L2T-OBS-001`; fixed `application-core`,`entry-worker-job`,`transaction-concurrency`,`observability-redaction` reports；pair/redaction checks | P0；外部 status 可 unknown，不降低本地追溯 |
| `AC-L2T-038`; `NFR-L2T-014~016`; idempotency/consistency | same digest exact replay、different digest conflict、one CAS winner、pair atomic、one-call/unknown manual、carrier parity、late material append-only、newer watermark wins | duplicate truth/effect、private carrier contract、half pair、blind retry、stale overwrite、current truth reconstruction、Query write/Job repair | `NFS-CONS-01~03`,`NFS-REC-01~03`,`NFS-CONC-01~02`; concrete `CONTRACT/BIND/INV/STATE/TX/CONC/ERR` | `EV-CAND-L2T-NFR-CONS-001`; fixed `contract-domain`,`application-core`,`transaction-concurrency`,`query-purity`,`entry-worker-job`,`controlled-seam` reports；purity/bounded/phase/pair checks | P0 hard；failure may VETO |
| `AC-L2T-039`; `NFR-L2T-017~019`; observability | all entry/Store/UoW/Port/config branches 含 required safe operation/state/error/phase/correlation/diagnostic refs；closed low-cardinality labels；boundary/error/owner/status/gap 可辨；observer cancellation 不影响 business flow | missing key safe signal、body/high-cardinality label、random trace、observer write/repair/cancel、status=local truth、producer/route readiness 伪造 | `NFS-OBS-01~03`; concrete `FOUNDATION/OUTCOME/HANDOFF/QUERY/CONSUMER/JOB/OBS/VETO` | `EV-CAND-L2T-NFR-OBS-001`,`EV-CAND-L2T-OBS-001`; fixed `observability-redaction` + owning suite reports；redaction/blocker checks | P0 local；Obs route/readiness conditional |

### 6.3 阈值来源与禁止数字审计

| Threshold / claim | Authority | Current handling |
|---|---|---|
| forbidden body / secret / credential | `DR-L2T-006/012/018/026/034`,`NFR-007` | zero occurrence across applicable surfaces；hard P0/VETO |
| Query write/refresh/repair/Port | 03 §7.4、`NFR-014~016`、05 `QUERY` | zero effect；hard P0 |
| Job core repair / unbounded scan | 03 §7.7/§12、05 `JOB` | zero core mutation + explicit bound；hard P0 |
| Safe handoff | `BR-L2T-038~040`,`NFR-010` | 4/4 gates required；no material/Port otherwise |
| pair / winner / side effect | 03 §9~§12、`NFR-014~016` | complete pair、one CAS winner、at most one Port call |
| applicable P0 denominator | 05 §9/§14 | all 11 owning suites + all 11 mandatory checks closed in one release run |
| latency/P95/P99/QPS/capacity/availability % | none | prohibited current pass claim；sample only with provenance |
| production-like/provider/SDK readiness | upstream/profile authority not closed | conditional/future; not current P0 positive |

### 6.4 未执行 / 未覆盖裁决

| Situation | Allowed disposition | Forbidden conclusion |
|---|---|---|
| applicable P0 concrete case/check absent | `not_evaluated` / `unavailable` / `invalid`；gate not passed | 通过、有条件通过、用别的 suite 补齐 |
| external owner positive blocked but local negative complete | local structural item may pass；positive item `blocked_dependency` | provider ready、Sandbox accepted、delivered/Observed |
| quantitative authority absent | `unverifiable` residual/future | “性能通过”、旧百分比/P95 达标 |
| P1/P2 feature out of scope | absent does not fail P0；if present must preserve isolation | 用 feature 成功替代 core failure |
| scope manifest explicitly includes conditional target | missing/blocked prevents that target qualification and may block requested release scope | 默默裁剪 denominator |

### 6.5 跨非功能门禁审计

| 审计项 | 结论 | 缺口 / 修正 |
|---|---|---|
| `AC-L2T-034~039` coverage | pass | 6/6；`NFR-L2T-001~019` 连续无孤儿 |
| Threshold authority | pass | 只使用正式结构阈值；所有旧数字删除/禁止 |
| Concrete source | pass | NFS 只定义方法，实际 evidence 回指 concrete TC family |
| Evidence phase | pass | candidate 不等实例；derived item 必须 same-run concrete source + final seal |
| P0/P1/P2 | pass | local structural、external positive、quantitative future 分层 |
| Security/VETO | pass | security hard failures不得转 residual；Step 11 汇总 VF |
| Availability/truth | pass | dependency failure 保守收束，不回滚或伪造本地 truth |
| Audit/observability | pass | audit 与 log/trace/Obs store/evidence 分离，observer no repair/cancel |
| Consistency/recovery | pass | unknown/manual、pair/CAS/replay/late/watermark 与 Step 8 一致 |
| Unexecuted item | pass | applicable P0 missing 不能通过；out-of-scope future 不污染 denominator |

## 7. 回填草稿

正式 §9 使用 §6.2 六行完整门禁，并保留共同 evidence rule、阈值 authority 表和未执行裁决表。不得把 `NFS-*` 写成 concrete TC，不得省略 candidate slot/suite/report/check，也不得在无 measurement authority 时出现数字性能 pass。当前没有实际 run，因此所有门禁实例仍为 `not_entered`，正文只定义将来如何裁决。

## 8. 待确认事项

| 事项 | 影响 | 当前处理 |
|---|---|---|
| load model / measurement registry / numeric threshold | quantitative performance/capacity | `L2T-RR-010` / future；不阻塞 structural P0 design |
| production-like/provider qualification | availability/readiness | `L2T-UP-*` 与 `L2T-RR-014`；conditional/inactive |
| implementation runner/report | actual evidence | 当前不存在，不伪造结果；Step 10 定义消费门禁 |

无新增上游 blocker。

## 9. 进入下一步条件

- [x] 六个稳定 NFR AC 全部有来源、结构阈值、失败条件、方法、candidate/report/check 与影响。
- [x] 19 项 NFR 无孤儿，NFS method 未被误作 concrete TC。
- [x] 数字、production-like、provider、SDK 与 P1/P2 边界无伪造或 P0 污染。
- [x] applicable 未执行项不得通过，VETO 不得风险接受。
- [x] 允许进入 Step 10：可观测性、审计与证据门禁。
