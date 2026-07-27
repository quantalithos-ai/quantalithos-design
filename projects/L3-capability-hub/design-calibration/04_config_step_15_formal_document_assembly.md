# L3-capability-hub 04 配置设计 Step 15：整理正式配置设计文档

> 对应 SOP: `standards/document/配置设计讨论流程_SOP.md` Step 15
> 书写规范: `standards/document/配置设计书写规范.md` §5.1~§5.15
> 目标文档: `projects/L3-capability-hub/04-配置设计.md`
> 创建日期: 2026-07-25
> 当前模式: full-restart / continuous execution
> 状态: `04_step_15_completed_continuous_execution`

---

## 1. Step 边界与当前状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 15 `整理正式配置设计文档` |
| 已完成输入 | `04_config_step_01` through `04_config_step_14`，14/14 |
| 正式目标初始状态 | missing；不存在可沿用的旧 formal 04 |
| 当前详细设计待回写 | 0 |
| 当前阻塞待确认 | 0 |
| unresolved upstream blocker | 0 |
| 本 Step 输出 | 本中间产物、正式 `04-配置设计.md`、静态审计与恢复点 |
| 本 Step 不做 | 不实现 parser/adapter/provider，不选择产品，不生成测试结果、evidence、signoff、run_id 或 commit |

本 Step 只把已校准结论装配成正式真相源。任何装配中发现的代码契约缺口都必须停止对应章节，回到 formal 03 的 owner Step；不能在 formal 04 中新增 Rust type、field、variant、Port、callable、state、flow 或 error 来掩盖缺口。

## 2. 先思考：必读输入与读取结论

| 必读输入 | 读取结论 | 装配约束 |
|---|---|---|
| 配置设计 SOP Step 15 | 只能在 Steps 1~14 完整且无 `待回写/阻塞待确认` 后装配 | 当前入口 gate 通过；仍需逐章来源和全文审计 |
| 配置设计书写规范 §§4~7 | 固定 15 章、每章最小表、严格 JSON、模块 demo、完整 JSONC、下游承接 | 不允许用摘要替代 §7 责任表和 demo |
| 设计文档编写通则 | 正式文档只保留稳定结论，过程证据留在 calibration artifact | 正文可压缩重复过程，但不能丢 key/type/default/failure/owner |
| 中间产物规范 | 必须记录问题、取舍、前后差异、影响和 stop gate | 本文件保存 source map、装配批次和审计结果 |
| 真相源闭环与可落码性标准 | 正式结论必须能映射到代码对象、失败分支、测试和验收；不得伪造实现事实 | 27 typed rows、binding cardinality、Stage 0~7 和 failure 必须可追溯 |
| formal `00/01/02/03` | 当前 active upstream authority | 04 不重定义责任、对象、协议、状态、事务、错误和观测字段 |
| config Steps 1~14 | 04 的唯一 exact assembly source | 每章列出 exact calibration source 和延伸阅读 |
| old formal `05/06`、README | historical/conflict-prone material | 只保留 disposition；不得回流旧 provider/cost/runtime/approval 口径 |
| L1-governance / L3-method-library formal 04 | 粒度、章节与审计参考 | 不复制其业务 key、产品、默认值或 owner |

## 3. 先思考：SOP 装配问题回答

| 问题 | 收口答案 |
|---|---|
| 1. Steps 1~14 是否都形成稳定结论？ | 是。14/14 completed；27 rows、18 modules、21 env leaves、3 profiles、24 global failure modes、17 risks 均闭合。 |
| 2. 是否存在未回写的详细设计影响？ | 否。Steps 1~13 current impact ledger 为 `13/13 无回写`；Step 14 无新增 code contract。 |
| 3. 哪些内容必须保留在 formal 04？ | 15 章固定结构、来源链/优先级、profile、完整 key catalog、module demos、sensitive path、V0~V8、Stage 0~7、change/rollback、failure、05/06/07/09 handoff、evolution、risks。 |
| 4. 哪些过程内容可留在中间产物？ | batch stop-review、候选比较、完整 24-mode/27-row 重复审计、详细风险推导可由正文摘要并回指 exact source。 |
| 5. 如何避免 §7 失真？ | 保留 18 顶层模块、27/27 raw-to-typed rows、21 bounded env leaves、9 external slots、6 Worker sources、10 routes、材料 registry、模块 demo 与完整 JSONC。 |
| 6. 如何避免把设计写成实现事实？ | 全文使用 must/shall/design contract；产品、仓、路径、命令、运行、证据和签署均保持 planned/unselected/not executed。 |
| 7. 如何处理未来 Rust 契约？ | 本轮不新增 Rust declaration。未来任何 struct、每个 field、enum variant及payload field、trait/method/callable 必须有英文 `///`；缺一即阻塞实现边界。 |
| 8. 是否可以进入正式装配？ | 可以；current pending writeback=0、blocking confirmation=0、upstream blocker=0。 |

## 4. 正式章节来源映射

| Formal chapter | Exact calibration source | 必须保留的稳定内容 |
|---:|---|---|
| §1 | `04_config_step_01_upstream_boundary.md` | active 00~03 authority、historical disposition、03 impact=`无回写` |
| §2 | `04_config_step_02_scope.md` | `CFG-G-01..08`、P0/P1/P2、scope/non-scope owner |
| §3 | `04_config_step_03_control_plane.md` | source chain、sole raw reader/builder、CP-01~CP-10 |
| §4 | `04_config_step_04_categories_boundaries.md` | 9 categories、startup-only、22 forbidden surfaces |
| §5 | `04_config_step_05_sources_priority_conflicts.md` | constants < strict JSON < bounded env、selector/CLI、conflict fail-fast |
| §6 | `04_config_step_06_environment_profiles_matrix.md` | Local/Integration/Deployment、environment-purpose mapping、four-state predicates |
| §7 | `04_config_step_07_config_items.md` | 18 modules、27 rows、21 env leaves、binding/material catalogs、strict JSON demos、full JSONC |
| §8 | `04_config_step_08_sensitive_secrets.md` | four sensitivity levels、provider-to-constructor path、rotation/output suppression |
| §9 | `04_config_step_09_loading_validation_activation.md` | source candidate、V0~V8、Stage 0~7、entry barriers、atomic disposal |
| §10 | `04_config_step_10_change_audit_rollback.md` | immutable artifact/change identity、review/audit、restart cutover、rollback eligibility |
| §11 | `04_config_step_11_failure_degradation.md` | six strategy terms、24 modes、18-domain/27-row coverage、safe observation |
| §12 | `04_config_step_12_downstream_handoff.md` | 05/06/07/09 exact owner contracts、future evidence truthfulness |
| §13 | `04_config_step_13_migration_deprecation_evolution.md` | zero released legacy、future version/deprecation/removal gates |
| §14 | `04_config_step_14_risks_open_questions.md` | 17 risks、open questions、blocking scopes、13/13 impact、reopen triggers |
| §15 | Steps 1~14 plus applicable standards actually read | active sources and normative references only |

每章必须以 `校准来源` 和 `延伸阅读` 开头。延伸阅读指向该 Step 中的结构化产物、正式回填草稿、影响判定和风险/门禁，不使用泛化“见上文”。

## 5. 分批写入方案

| Batch | 正式写入 | 校验重点 | 完成条件 |
|---|---|---|---|
| `15.A` | 元信息、§§1~6 | authority、scope、10 control planes、9 categories、source precedence、3 profiles | 每章 exact source；无旧 05/06/README authority 回流 |
| `15.B` | §7 | 18 modules、27 rows、21 env leaves、9/6/10 cardinality、module demos、full JSONC | key/type/default/required/source/effect/sensitivity/failure/owner 可追溯 |
| `15.C` | §§8~14 | secret、loading、change、failure、handoff、evolution、risk | 无 raw secret；无 dynamic fallback；无 fake evidence；03 impact 完整 |
| `15.D` | §15 与全文审计 | references、source/key/profile/failure/cross-document/Rustdoc/truthfulness | 七类审计全部 pass，flow/ledger/T021 同步 |

正式文档创建后不能先标记 Step 完成。只有 Batch `15.D` 审计关闭，才允许把本文件、calibration flow、project ledger 和 `/tmp` task ledger 更新为 completed。

## 6. 装配保真规则

### 6.1 Source and key fidelity

- raw content precedence 固定为 `parser constants < strict JSON < bounded env`；bootstrap selector 只选文档或断言 profile/entry。
- present but invalid env 必须失败，不得回退 JSON。
- P0 required item 没有 semantic default；固定 schema/compatibility literal 不是 operator fallback。
- 21 个 env leaf 是闭集；reserved prefix 下未知变量拒绝；named registry、结构、secret、endpoint 不可由 env 新增。
- 18 个顶层模块名称、field spelling、symbolic reference grammar 和 strict unknown-field rejection 不得在装配时重命名。

### 6.2 Profile and binding fidelity

- profile 只有 `local`、`integration`、`deployment`。
- Deployment 必须 durable local authority、system clock/ID、selected fake/fixture count=0；network transport 必须 authenticated TLS。
- 9 external Port slots 始终 total；Worker entry 必须 6 source slots；configured collaboration 必须 10 route refs。
- `Missing` 始终启动失败；只有显式 `Disabled` 才构造既有 typed unavailable/`NotConfigured`。
- constructor/provider/probe 失败不得 fallback Fake、Disabled、inMemory、plaintext 或其他 product。

### 6.3 Runtime and security fidelity

- root 为 startup-loaded process-lifetime immutable value；invocation/Job run 不重读 raw source。
- P0 不支持 config center、admin override、watch、hot reload、online last-known-good。
- raw token/password/DSN/private key/certificate/body/provider response 不进入 JSON/env/CLI/root/output。
- diagnostics 只有 `off/redacted`，observer failure 不改变业务结果，配置设计不生成 acceptance evidence。

### 6.4 Responsibility fidelity

- Hub 只拥有 capability identity/registry/adapter descriptor 和 body-free relations/seams/exposure truth。
- runtime/tools execution、marketplace listing、governance approval、method body/source lifecycle、provider route/quota/cost/failover、SDK product lifecycle 不进入配置。
- 04 不重新定义 Rust object/Port/protocol/state/error/flow；只定义 raw source、validation、assembly、operator lifecycle。

## 7. 装配前审计

| Audit | Checked source | Result before formal write |
|---|---|---|
| chapter availability | Steps 1~14 | pass, 14/14 |
| detailed-design impact | Step 14 §8.3 | pass, `13/13 无回写` |
| pending writeback | Step 14 | 0 |
| blocking confirmation | Step 14 | 0 |
| upstream blocker | flow/project ledger | 0 |
| canonical rows | Step 7 §24 | pass, 27/27 |
| top-level modules | Step 7 §8.2/§32 | pass, 18 |
| env leaves | Step 7 §22 | pass, 21 |
| profile set | Steps 6/7 | pass, 3 |
| external/source/route cardinality | Step 7 | pass, 9/6/10 |
| raw secret/body examples | Steps 7/8 | 0 |
| fabricated implementation/test/evidence/signoff | Steps 1~14 | 0 |
| Rust code-contract delta | Steps 1~14 | 0; Rustdoc delta=0 |

## 8. 正式装配后审计框架

| Audit ID | 检查对象 | Pass rule | Current status |
|---|---|---|---|
| `CH-CFG-A15-SOURCE` | 15 chapters | 15/15 exact calibration sources and active upstream references | pass; 15/15 chapter source blocks, formal 00~03 and exact Steps 1~15 referenced |
| `CH-CFG-A15-KEY` | §7 | 18/18 modules、27/27 rows、21 env leaves、all required columns/demos | pass; 18 module rows, 27 canonical rows, 3 bootstrap + 21 content env rows, 18 demos and full JSONC present |
| `CH-CFG-A15-PROFILE` | §§6~9/11 | three profiles, complete cardinalities, no Deployment fake/fallback | pass; Local/Integration/Deployment only, 9/6/10 exact cardinalities, Deployment durable/system/TLS/fake=0 retained |
| `CH-CFG-A15-FAILURE` | §§5/7/9~11 | invalid/missing/unavailable/drift/expiry all have non-silent behavior | pass; 24/24 `FM-*`, invalid env no JSON fallback, Missing fail-fast, explicit Disabled only, drift/expiry at new activation |
| `CH-CFG-A15-CROSSDOC` | §§1/4/12~15 | 00~03 aligned; 05/06 historical; 07/09 future owner; no responsibility leakage | pass; 05/06 historical, 07/09 downstream, execution/listing/approval/method/provider-route/SDK ownership rejected |
| `CH-CFG-A15-RUSTDOC` | all Rust examples/references | no new declaration; future struct/field/variant/payload/trait/method/callable full English `///` gate explicit | pass; code-contract/Rustdoc delta `0/0`, future full English `///` gate stated in §§1/7/12/13 |
| `CH-CFG-A15-TRUTH` | whole document | no product/repo/implementation/run/evidence/signoff/deployment/commit fact fabricated | pass; only design/static-audit facts stated; execution facts remain absent/unselected/not run |

### 8.1 机械核对记录

| Check | Result | Meaning |
|---|---|---|
| formal main chapters | `15/15` exactly once | structure audit only |
| chapter calibration-source blocks | `15/15` | each chapter points to its exact Step source |
| Markdown fences | `54`, balanced | formatting audit only |
| complete JSONC | comment-stripped JSON parser pass; top-level keys `18` | syntax/shape audit, not runtime parser test |
| canonical inventory | modules/rows/env leaves=`18/27/21` | exact formal table counts |
| binding inventory | external/source/route=`9/6/10` | exact formal table counts |
| profile inventory | Local/Integration/Deployment=`3/3` | no fourth runtime profile |
| failure/risk inventory | `FM=24/24`; `CH-CFG-R=17/17` | no missing ID in formal tables |
| current 03 impact | `13/13 无回写`; pending/blocking=`0/0` | no formal 03 reopen required by current 04 |

These are document-static checks. They do not claim that a parser was implemented, a binary was built, a test was run, an environment was activated, evidence was archived or acceptance was signed.

## 9. 对 03 的影响判定

| Assembly action | Changes formal 03? | Reason | Treatment |
|---|---|---|---|
| copy calibrated raw schema/source/profile/failure contracts | no | formal 03 explicitly delegates operator-facing detail to 04 | no writeback |
| retain adapter-private product-neutral material | no | no value crosses or changes existing constructor/Port boundary | no writeback |
| retain startup-only lifecycle and existing Stage 0~7 | no | exact formal 03 lifecycle restatement | no writeback |
| discover any new typed field/Port/error/flow during assembly | would be yes | code-contract delta | stop; reopen owning DDD Step before formalizing |

Final assembly result: `待回写=0`, `阻塞待确认=0`, upstream blocker=`0`. Formal 03 does not require writeback.

## 10. Step completion gate

| Completion condition | Result |
|---|---|
| Steps 1~14 complete before assembly | pass, `14/14` |
| formal `04-配置设计.md` assembled from exact sources | pass, `15/15` chapters |
| batches `15.A~15.D` complete | pass, `4/4` |
| seven final audits | pass, `7/7` |
| JSONC static parse/top-level audit | pass, `18/18` keys |
| current 03 writeback/blocking/upstream blocker | `0/0/0` |
| fabricated implementation/test/evidence/signoff/deployment/commit | `0` |

Step 15 is complete. Next allowed task is `T022`: read the test-plan SOP and writing standard, initialize `05_test_plan_calibration_flow.md` in full-restart mode, and record the old formal 05 as historical material. Do not edit formal 05 before its Step 15 assembly.
