# L2-tools 07 实施计划 Step 9：Spike、风险与待确认事项

## Step 状态

`accepted`

## 本步输入

| 输入 | 来源 | 用途 |
|---|---|---|
| upstream blockers | `L2T-UP-001~009` | 外部 positive seam 与 baseline 风险。 |
| config risks | `04` §14 | backend、secret、digest、profile 和目标仓风险。 |
| test residuals | `05` §14 | provider、numeric、retention、evidence runner 风险。 |
| acceptance residuals | `06` §13 `L2T-RR-001~016` | risk acceptance eligibility，不在07私改身份。 |
| phase/boundary | Step 5~8 | 绑定触发、输出、截止点和暂停范围。 |

## SOP 问题回答

| 问题 | 回答 | 依据 |
|---|---|---|
| 哪些需要 Spike？ | 只有实现仓建立后仍无法由正式设计证明的兼容性/能力：Core public surface、durable Store capability、external adapter mapping、safe digest、evidence pipeline。 | 03/04 open items。 |
| 哪些风险阻塞 phase？ | repo/baseline/Core mismatch 阻塞 PH-01/02；schema/Port/state 冲突阻塞 owning boundary；external positive 只阻塞 positive qualification；evidence integrity 阻塞 PH-11。 | Step 1/8。 |
| Spike 输出是什么？ | 有界 capability matrix、fixture/protocol diff、fault results、safe report 和 adopt/reject/reopen decision；不是“可行”口头结论。 | SOP Step 9。 |
| 哪些必须回写上游？ | public field/type/Port/state/flow/config/artifact/acceptance authority 变化；产品私有 adapter 且不改 contract 可留 infra。 | 可落码标准。 |
| 是否可预先接受风险？ | 不可。当前 accepted risk=0、acceptor/signoff not_bound；07 只记录 candidate/blocked 和 future review。 | 06 §13~§14。 |

## 当前材料问题诊断与设计取舍

| 议题 | 诊断 | 取舍 |
|---|---|---|
| `L2T-UP-*` 与 `L2T-RR-*` 是不同层 | 前者为设计/依赖 blocker，后者为验收 residual registry | 保留各自 ID，不合并或重编号。 |
| 目标仓缺失容易被误作设计 blocker | 07 可完成但实现不能启动 | 分类为 implementation prerequisite。 |
| 产品未选可能阻塞全部 P0 | P0 已有 deterministic/controlled seam | 只有 selected positive scope 触发产品 Spike。 |
| Spike 代码可能污染 boundary | 实验结果不等正式实现 | 独立 scratch/batch，adopt 前通过 design/scope/test review。 |

## Planned Spike Register

| ID | Trigger / 问题 | 影响 boundary | 必须输出 | 成功判定 | 失败/不确定动作 | 截止点 |
|---|---|---|---|---|---|---|
| `SP-L2T-001` | 目标仓建立后，Core `core-contracts` public type/package/serde surface 是否满足 L2 planned reuse | `01-a`,`02-a` | Cargo metadata、public diff、codec fixture、dependency digest safe report | 保持 path candidate，不复制 schema | mismatch -> `wait_design`，回写 03/04/05/07 | `commit-02-a` 前 |
| `SP-L2T-002` | selected durable Store/UoW 能否满足 seven Store、CAS、pair atomicity、commit tri-state、replay、watermark | selected `02-c`/`10-b` | capability/fault/rollback/unknown matrix | private adapter binding，不改 public semantic | reject product 或 controlled reopen | selected adapter 开工前 |
| `SP-L2T-003` | selected Auth/Sandbox adapter 能否只返回正式 typed safe result并保持 Prepared/one-call/unknown | `05-b`,`05-c` positive | input/output/failure/redaction/mapping matrix | configured candidate | needs body/host/retry/run truth -> reject/reopen owner | positive adapter 前 |
| `SP-L2T-004` | selected Bus/Obs collaboration 是否支持 body-free event/status refs且不写 delivery/Observed truth | `08-b`,`09-b` positive | route/status/source symmetry and fault proof | configured candidate | needs local queue/DLQ/status owner -> reject/reopen | positive route 前 |
| `SP-L2T-005` | safe config/ref digest canonical projection 是否可定义而不 hash raw/full sensitive ref | `10-a`,`11-a` | canonical field allowlist、digest fixtures、redaction proof | safe digest available | unavailable -> omit digest per04/05，不能自造 | `commit-11-a` 前 |
| `SP-L2T-006` | evidence pipeline 对 failed/missing/cross-run/static/redaction fixtures 是否产生正确 non-pass | `11-a`,`11-b` | raw/report/check/index/seal dry-run与negative matrix | worst-status/no-static/pairing成立 | schema gap回写05/06/07；不得合并 | `commit-11-a` 提交前 |

### Spike 执行纪律

| 规则 | 要求 |
|---|---|
| isolation | 使用当前 boundary 的独立 scratch/batch；不提前实现后续功能。 |
| output | 记录 input version/config、commands、safe results、limitations 和 decision。 |
| adoption | 只有 design closure、scope、targeted tests 和 review 通过后才能进入 boundary。 |
| evidence | Spike artifact 不是 concrete TC evidence、release seal 或 acceptance proof。 |
| failure | 失败/不确定保持 paused/blocked，不得先 merge 后补设计。 |

## Risk Register

| ID | 风险/分类 | 影响 | 当前缓解 | Stop/Reopen trigger | Owner/截止点 |
|---|---|---|---|---|---|
| `R-L2T-001` | implementation prerequisite: target repo absent | 全部实现 | 07/ledger/skeleton 先完成 | repo仍不存在或非授权 git worktree | repository owner；`01-a` 前 |
| `R-L2T-002` | implementation prerequisite: immutable design baseline absent | 所有 Design Gate | `not_fixed_until_handoff`，不推断 hash | 交付时仍无授权 baseline | design/repo owner；implementation handoff 前 |
| `R-L2T-003` | Core tools-specific authority/compatibility | `01-a`,`02-a`+ | candidate-only，no copy | public/API/bytes mismatch | Core/Tools contracts；`02-a` 前 |
| `R-L2T-004` | Auth owner/taxonomy/schema/freshness open | PH-05 positive | missing/stale/conflict fail-closed | positive flow requested | upstream owner；positive adapter 前 |
| `R-L2T-005` | Sandbox mapping/receipt/cleanup/DLQ open | PH-05/08 positive | local attempt/mapping blocked/unknown/no host | positive run/receipt claim requested | Sandbox owner；positive gate 前 |
| `R-L2T-006` | Bus/Obs source/route/status open | PH-06/08/09 positive | body-free material/local attempt/status independent | delivery/Observed/readiness claim | Bus/Obs owner；positive gate 前 |
| `R-L2T-007` | durable Store/UoW product unselected | PH-02/10 selected | Port/fake parity, capability fail-fast | deployment-like claim | architecture/storage/ops；selected boundary 前 |
| `R-L2T-008` | secret provider/TLS/material unresolved | selected external/profile | ref-only/no output/production inactive | Configured production path | security/ops；first selected configured boundary |
| `R-L2T-009` | safe digest not closed | PH-10/11 evidence | omit digest if unavailable, no raw hash | evidence requires digest | security/test owner；`11-a` 前 |
| `R-L2T-010` | evidence runner/report builder absent | PH-01/11 | planned schemas/scripts/self-tests | static/cross-run/manual evidence attempt | test tooling；scripts by `01-b`, proof by `11-a` |
| `R-L2T-011` | numeric performance/SLO authority absent | PH-11/future | structural P0 only; numeric not_evaluated | numeric pass/release claim | product/SRE/acceptance；before claim |
| `R-L2T-012` | artifact retention/access/cutover policy pending | release/operations | retain failed run, explicit roots | real release/deployment | ops/security/release；before real release |
| `R-L2T-013` | historical README/API pollution | all | formal 00~07 outrank historical material | old name/owner reappears | design/reviewer；every boundary |
| `R-L2T-014` | SDK client seam absent | future consumer | server contract only | client/readiness claim | SDK owner；future qualification |

风险 `R-L2T-004~006` 对应 `L2T-UP-001~006` 和 `L2T-RR-001~006`；`R-L2T-002/003/014` 分别承接 `L2T-UP-007/008/009`。本表是实施风险投影，不替代原始 registry。

### 不可接受/不可豁免风险

以下只能修复、复验、回写或保持 blocked：任一 VF、一票否决、安全 body/secret 泄漏、self-authorization、host fallback、half outcome/audit pair、blind retry、Query write、Job repair、non-Core sibling compile dependency、responsibility leakage、static/cross-run evidence、P0 denominator 缺失、伪造 commit/run/verdict/signoff。

## Open Questions

| ID | 待确认事项 | 未确认前规则 | 影响 | 截止点/逾期动作 |
|---|---|---|---|---|
| `OQ-L2T-001` | target repo 创建/授权方式 | 不创建替代仓、不落代码 | `01-a` | 开工前；逾期 pause |
| `OQ-L2T-002` | repo branch/worktree/git identity/initial baseline | ledger保持 blocked/read_docs | first commit | commit前；不得提交 |
| `OQ-L2T-003` | Core exact public reuse surface | candidate-only | `02-a` | 开工前；触发 SP-L2T-001 |
| `OQ-L2T-004` | durable backend/product/migration | fake/local parity only | selected PH-02/10 | selected前；未选则 selected blocked |
| `OQ-L2T-005` | Auth/Sandbox/Bus/Obs positive products/contracts | blocked/disabled/controlled negative | PH-05/08/09 | positive gate前；不执行 positive |
| `OQ-L2T-006` | secret/TLS provider | ref-only, production inactive | selected config | first Configured前；blocked |
| `OQ-L2T-007` | actual acceptance/review/risk/signoff role assignments | drafts only, no names/signatures | `11-b` / 06 process | review前；保持 not_decided/not_bound |
| `OQ-L2T-008` | artifact retention/permissions/runbook | local run-scoped contract only | real release | release前；no readiness |
| `OQ-L2T-009` | numeric SLO/capacity requirements | numeric not_evaluated | future NFR | claim前；no numeric verdict |
| `OQ-L2T-010` | SDK tools client requirement | future consumer seam only | future | proposal before implementation; reopen design |

未来 closure record 必须含 ID、confirmer role、decision、affected boundary、source refs、effective baseline、reopen trigger 和 provenance；当前不填真实人名、签名、commit 或时间。

## Upstream Writeback Matrix

| Trigger | 首个 authority | 动作 | 禁止捷径 |
|---|---|---|---|
| public field/type/Port/callable delta | `03` owning Step | pause, update declaration/flow/state/test, new baseline | private alias/helper |
| state/UoW/idempotency/unknown delta | `03` §9~§13 | update state/TX/replay and 05/06/07 | code-only behavior |
| config key/profile/source/lifecycle delta | `04` | reopen 03 if semantic, then 04/05/06/07 | env alias/fallback |
| TC/suite/artifact schema delta | `05` | update 05/06/07 and runner | static hand-written report |
| AC/VF/evidence/signoff authority delta | `06` | update acceptance contract, then 07 gate mapping | implementation-side verdict |
| phase/boundary delta | `07` Step 5/6 | update formal07 and all ledgers/skeletons | implementation improvisation |

## 回填草稿

正式 07 §9 应保留 SP-L2T-001~006、R-L2T-001~014、OQ-L2T-001~010、不可接受风险和 writeback matrix；明确当前 accepted residual=0，Spike/风险记录不产生执行或验收事实。

## 进入下一步条件

- [x] Spike 有 trigger、输出、成功/失败动作和截止点。
- [x] 风险绑定 phase/boundary 和 owner。
- [x] open question 无无限期“后续确认”。
- [x] upstream/design/implementation/selected/operations 风险已分层。
