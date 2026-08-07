# 06 验收标准校准 · Step 6 数据边界与架构红线

## 1. Step 状态

- 状态：[x] 已确认
- 对应 SOP：`standards/document/验收标准讨论流程_SOP.md` Step 6
- 回填章节：正式 `06-验收标准.md` §6

### 1.1 Step 内计划

- [x] 读取输入和前序结论：Step 5、00 §10~§11、01 §8~§9、03 data/redline、04 NC、安全测试切口
- [x] SOP 问题回答：禁止保存、反写、projection/cache、P1 污染、VETO
- [x] 当前材料 / 旧文档诊断：旧 06 三红线与当前 4 类数据分类不一致
- [x] 设计取舍：按 data class + owner/effect redline，而不是泛化“安全检查”
- [x] 结构化中间产物：10 个红线、data ownership matrix、dependency/projection checks、VETO escalation
- [x] 复杂度判断：按 truth/snapshot/ref/body、owner/effect、dependency/config 三组审查，无额外附录
- [x] 回填草稿：形成正式 §6
- [x] 自检与进入下一步条件：10/10 AC 覆盖、无 owner 转移、无红线孤儿

## 2. 本步输入

| 输入 | 固定事实 |
|---|---|
| `00` §10~§11 | `BR-L2T-*`、`DR-L2T-001~034`、四类数据分类和禁止行为 |
| `01` §8~§9 | compile/runtime/event 依赖分类、Single Writer、local truth first、边界红线 |
| `02`/`03` | 六组成部分对象、Query/Job/no-repair、状态和 source/ref/body boundary |
| `04` §4/§9/§10 | `NC-L2T-001~025`、safe-output floor、no fallback/no partial/no override |
| `05` §6/§10/§13 | field/ref/body TC、OBS/VETO、redaction/dependency/no-static checks 和 raw/report pairing |
| Step 5 | `AC-L2T-024~033` 是本步稳定需求分母，subordinate redline IDs 不取代 AC/VF |

## 3. SOP 问题回答

1. **哪些数据不得由本仓保存？**

   回答：`DR-L2T-006/012/018/026/034` 所列实现/库存/provider/secret、Hub/authorization/Sandbox policy 正文、raw caller/prompt/capture/provider response、Bus/Observability/evidence 正文等不得进入 L2 truth、audit、report、handoff、log/metric/trace 或 config output；加密/哈希不改变 forbidden-body 结论。

2. **哪些下游不得反向改写真相？**

   回答：Runtime、Hub、Sandbox、Bus、Observability、SDK、provider、query、diagnostic、projection、report、consumer 和 job 均不得反写 identity、definition、binding、invocation、admission、outcome、error 或 audit。外部 clue 只能进入 assessment/gap/receipt 或 formal re-entry；Job 只能写 bounded report/projection/gap。

3. **哪些 projection/cache 不得反写真相？**

   回答：search/diff/diagnostic/guidance/projection/cache freshness、report、cursor/watermark、status ref、delivery/observation summary 均是派生或快照；Query zero-write，Job no-repair，stale/rebuilding/unavailable/failed 不得 fallback 当前 truth 或隐式修复。

4. **哪些 P1 能力不得污染 P0？**

   回答：real provider、durable external store/route、Sandbox receipt/capture/cleanup/DLQ、Bus delivery、Observed、SDK client、production-like、marketplace/UI、capacity/SLO 不能成为 P0 local truth、功能或 evidence 的替代；其 positive 只有 owner closure、profile 和 scope manifest 同时成立时才可条件启用。

5. **红线失败时是否一票否决？**

   回答：forbidden body、self-authorization、host bypass、owner/reverse-write、static evidence/readiness、依赖类型错误和 P1/历史事实伪造分别命中 `VF-L2T-002~013`；这些是不可风险接受的 VETO。普通 data freshness/stale 但未越权的结构性缺口可按 gate/defect/residual 分类。

## 4. 当前文档问题诊断

| 位置 | 问题 | 修正 |
|---|---|---|
| 旧 06 §6 | “三红线”未覆盖当前四类 data、owner 和 projection/job effect | 扩展为 10 个可执行红线并回指 DR/BR/NC |
| 旧 06 §7 | 安全治理与数据 ownership 混为一体 | 将 owner/effect/data class 分离；安全 VETO 由 Step 11 汇总 |
| 旧 06 | 没有 compile/runtime/event 依赖验收 | 增加 dependency type / package boundary / seam-only 检查 |
| 旧 06 | 未定义 Query/Job no-write/no-repair | 纳入红线和 concrete `QUERY/JOB/OBS/VETO` 证据 |
| 旧 06 | P1 真实执行可能补 P0 | 明确 P1 positive 只可条件启用，不能救 P0 |

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 数据分类 | 泛化工具数据 | truth/snapshot/ref/forbidden body 四类 | 与 `00` DR authority 一致 |
| Owner 检查 | 只看“是否安全” | 每个写/读/effect 绑定 owner 和 permitted effect | 可落码、可扫描 |
| Projection | 未定义 | stale/read-only/no-repair/identity lookup 约束 | 防第二 truth |
| 依赖 | 旧文档暗含 host/provider | compile/runtime/event 三类及禁止 sibling package | 对齐全局依赖规则 |
| 失败影响 | 普通失败 | VETO 或 gate-specific，不能风险接受红线 | 结论可判定 |

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 用一张“安全红线”大表覆盖一切 | 简短 | 无法判断 data class、owner 和 effect | 不采用 |
| 按 34 个 DR 各自生成 34 个验收项 | 可逐项 | 与 `AC-L2T-030~033` 重复且噪声高 | 不采用；在矩阵中逐项回指 |
| 10 个行为红线 + 完整 DR/BR/NC 覆盖矩阵 | 可执行、避免第二需求分母 | 需要交叉审计 | 采用 |

## 7. 结构化中间产物

### 7.1 Data ownership matrix

| Data class | Canonical refs | Owner | Allowed consumer/effect | Forbidden behavior | Test/evidence direction |
|---|---|---|---|---|---|
| L2 truth | `DR-001~003,007~009,013~015,019~021,027~030` | L2-tools | formal Command/flow/UoW/append-only audit/handoff attempt | external/projection/query/job overwrite | `FOUNDATION/CONTRACT/BIND/INV/PRE/OUTCOME/HANDOFF/STATE/TX` |
| snapshot | `DR-004,010,016,022~023,031~032` | source owner remains external; L2 stores bounded consumption snapshot | same invocation/time-bound assessment/view | snapshot becomes registry/auth/execution truth; late overwrite | `BIND/PRE/OUTCOME/QUERY/JOB/CONC` |
| reference | `DR-005,011,017,024~025,033` | referenced owner external; L2 owns relation only | typed ref/correlation/lookup | dereference body, infer by string, lifecycle takeover | `FOUNDATION/BIND/INV/PRE/CONSUMER/CONT` |
| forbidden body | `DR-006,012,018,026,034` | no L2 storage/output owner | only safe marker/ref when formally allowed | raw/secret/body/full ref in any surface | `FOUNDATION-006/018,OUTCOME-008,OBS-008,VETO-008,redaction check` |

### 7.2 Architecture redline gate table

| Redline ID | Requirement mapping | Through condition | Failure condition | Evidence / report | VETO / impact |
|---|---|---|---|---|---|
| `RL-L2T-001` single truth owner | `AC-024,030` / `BR-001~003` | identity/definition/evolution/binding/invocation/outcome/audit each has one L2 writer | display/provider/inventory/SDK/local registry or duplicate writer becomes truth | `static-boundary`, `FOUNDATION/CONTRACT`; `...RULE-001` | `VF-002/010`; hard |
| `RL-L2T-002` external truth isolation | `AC-027,032` / `DR-005,011,017,024~025,033` | only typed refs/safe snapshots/relations cross owner seam | Hub/Auth/Sandbox/Bus/Obs/Runtime/provider正文或 lifecycle进入 L2 | `dependency-boundary`,`BIND/PRE/CONSUMER`; `...DATA-001` | `VF-003/010/012`; hard |
| `RL-L2T-003` forbidden body floor | `AC-033` / `DR-006,012,018,026,034`,`BR-039` | all persisted/emitted/logged/report/config surfaces pass allowlist and redaction | raw body/secret/credential/full sensitive ref or encrypted/hash body enters | `observability-redaction`,`check_redaction_boundary`; `...NFR-SEC-001` | `VF-008`; hard |
| `RL-L2T-004` no external inference | `AC-024~025,031` / `BR-007,013,015,020,034` | missing/late/failed external source produces typed assessment/gap/unknown | provider/health/route/observation/projection inferred as L2 truth | `BIND/PRE/OUTCOME/OBS`,`check_blocker_truth` | `VF-003/006/007/009`; hard |
| `RL-L2T-005` no self-authorization | `AC-028` / `BR-023~025` | requirement and formal result consumption separated; missing => fail closed | Hub visibility/risk/feature/fake/default becomes allow | `PRE/CONSUMER/VETO`,`check_blocker_truth` | `VF-005`; hard |
| `RL-L2T-006` isolation no bypass | `AC-024,027` / `BR-026~028` | sandbox-required only accepted through formal handoff; no host fallback | direct/host/local executor, fabricated run/capture/receipt | `PRE/HANDOFF/CONTROLLED`,`phase check` | `VF-005/006`; hard |
| `RL-L2T-007` local truth first | `AC-029,030` / `BR-032~037,040~041` | local outcome/audit/attempt independent of delivery/observation | external failure rolls back/overwrites local pair or drives retry | `OUTCOME/HANDOFF/OBS`,`pair check` | `VF-007/009`; hard |
| `RL-L2T-008` query/job no-write | `AC-025,031` / `BR-E01,041` | Query/Job only read/derive bounded reports/projections/gaps | read path repairs, rescans, writes core, creates missing identity | `QUERY/JOB/OBS`,`check_query_no_write`,`check_job_boundedness` | `VF-009`; hard |
| `RL-L2T-009` dependency type integrity | `AC-027,030` / `DB-001~008` | only Core compile; Hub/Sandbox/Runtime runtime; Bus/Obs event; SDK future | sibling runtime/event as package/path dependency or fourth handoff type | `static-boundary`,`check_dependency_boundary` | `VF-010/012`; hard |
| `RL-L2T-010` P1/legacy/evidence isolation | `AC-023,025,033` / `BR-042`,`NC-024` | open blocker, candidate, fake, historical, draft and health remain non-truth | static EV/result/signoff/readiness or old contract enters current truth | `VETO`,`check_no_static_evidence`,`check_blocker_truth` | `VF-012/013`; hard |

### 7.3 Redline-to-DR/NC coverage

| Coverage | Source set | Result |
|---|---|---|
| truth | `DR-001~003,007~009,013~015,019~021,027~030` | RL-001/004/005/007; covered |
| snapshot | `DR-004,010,016,022~023,031~032` | RL-002/004/007; covered |
| ref | `DR-005,011,017,024~025,033` | RL-002/009; covered |
| forbidden body | `DR-006,012,018,026,034` | RL-003/010; covered |
| configuration | `NC-001~006,009~012,017~025` | RL-001/003/005/006/008/010; covered |
| projection/job | `NC-020~023` | RL-008; covered |
| dependency | `DB-001~008` | RL-009; covered |

### 7.4 Redline test oracle

```text
redline_pass :=
  owner/write/effect scan is clean
  AND every mapped concrete case/check is present in same release run
  AND no forbidden body/static evidence/open blocker promotion exists
  AND Query/Job effect journals are zero for core mutation
  AND any applicable redline VETO item is not triggered
```

任何 redline failure先按 invalid/failed/ineligible 真实分类；命中 VETO 时总体不通过，不能用风险接受、P1 成功或后续修复口头承诺覆盖。

### 7.5 跨红线审计

| 审计项 | 结论 | 修正 |
|---|---|---|
| 34 DR 全覆盖 | pass | 四类 data matrix 逐段涵盖 |
| 42 BR 与 25 NC 交叉 | pass | 红线表映射 BR/NC，Step 11 再汇总 VF |
| owner/write/read effect | pass | 每个红线指定 permitted effect 与 forbidden effect |
| projection/query/job | pass | no-write/no-repair、stale/degraded 分型独立 |
| dependency type | pass | 无 sibling package、无第四依赖类型 |
| P1/legacy/evidence | pass | candidate/draft/health/historical 不入 truth |
| redline/VETO overlap | pass | overlap 是 intentional escalation，不是重复分母 |

## 8. 回填草稿

正式 §6 应包含四类数据 ownership 表、`RL-L2T-001~010` 红线表、DR/BR/NC 覆盖和“红线失败命中 VETO 不可风险接受”规则。尤其要明确外部正文、execution truth、delivery/observation、evidence/signoff、Runtime/Hub/Auth/Sandbox/SDK/provider truth 均不进入 L2；Query/Job/projection/report 不能写核心 truth；compile/runtime/event 依赖不能混写。

## 9. 待确认事项

| 事项 | 影响 | 当前处理 |
|---|---|---|
| tools-specific Core schema authority | compile redline / future positive | `L2T-UP-008` candidate only；不复制 schema |
| provider/body mapping | external inference redline | `L2T-UP-001~006` blocked/fail-closed |
| actual redaction scanner output | real VETO evidence | 05/runner future；当前不填结果 |

## 10. 进入下一步条件

- [x] `AC-L2T-024~033` 全覆盖，四类 data boundary 可检查。
- [x] 10 条 architecture redline 各有通过/失败、证据和 VETO 影响。
- [x] DR/BR/NC/dependency/projection/query/job 交叉审计无孤儿。
- [x] 红线失败与风险接受边界明确。
- [x] 允许进入 Step 7：接口、事件与跨仓同步验收。
