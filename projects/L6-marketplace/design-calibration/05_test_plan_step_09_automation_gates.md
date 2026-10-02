# Step 9：设计自动化与 CI/CD 门禁

## 1. Step 状态

2026-10-02；full-restart / single-agent；completed / selfcheck_done / stop_review；`gate_status=pass`（自动化设计）。输入Step4的11suite、Step6的98TC/EV和Step8；输出suite精确case集合、计划脚本/参数/输出、11独立停审及跨suite审计。没有创建脚本、执行CI或产report。

Step内计划：suite scope→case/EV闭包→gate/check/report参数→失败/输出配对→逐suite停审；完成。所有实现路径为planned，仅正式07后进入实施排程。

### Step内计划与门禁字段

| 计划项 | 状态 | 可审查产物/门禁 |
|---|---|---|
| 读取输入与前序结论 | done | §2；前序：05_test_plan_step_08_environment_config.md（含诊断、取舍、未确认项） |
| SOP逐问题回答 | done | §3，回答所有适用问题 |
| 当前/历史材料诊断 | done | §4，不继承historical truth |
| 设计取舍 | done | §6，采用/未采用理由 |
| 结构化产物 | done | §7，来源/失败/证明上限闭合 |
| 复杂度判断 | done | 主控内分单元/表，无需新增业务附录 |
| 回填草稿 | done | §8；只候选，正式写入等Step15 |
| 自检/下一步 | done | §9/10，实际资格与运行结果不伪填 |

`gate_status=pass`；`gate_reason`=本Step设计审查完成，执行仍not-run；`next_allowed_action`=§10下一Step阅读/设计；`source_files`=§2列出的正式输入与前序文件。上述done不表示实际环境、测试、evidence或owner签核通过。

## 2. 本步输入

[Step4](05_test_plan_step_04_strategy_layers.md)、[Step6](05_test_plan_step_06_cases.md)、[Step8](05_test_plan_step_08_environment_config.md)、测试SOP Step9/书写规范§4.6/5.9，证据schema由Step13承接；不读取06工作流，不修改实现仓或CI配置。

## 3. SOP 问题回答

| 问题 | 回答 |
|---|---|
| PR suite？ | D/S/C及依赖/脱敏快检查，报告工具schema快测；本地门禁，不等全P0。 |
| main suite？ | PR+I/P/W/B/E/X，全PG实际前置；R/M在nightly/release。 |
| nightly？ | 全11suite/全部参数化subcase；容量candidate只record trend。 |
| staging/release？ | staging仅formal selected资格；release全98TC/11suite/checks，仍非验收verdict。 |
| flaky/timeout/依赖故障？ | first failure保留、fresh run重测；timeout failed或unavailable按检测阶段，不能skip/retry洗成pass。 |
| 每suite gate？ | §7.1逐suite独立scripts/gates路径；release orchestrator另列。 |
| artifact-root默认？ | artifacts/test/<run_id>，无项目名子目录；覆盖须独立授权测试根并验证。 |
| 参数？ | run-id/artifact-root/config-profile必须支持；registry/subcase manifest/read source均显式。 |
| release checks？ | dependency/config/redaction/no-static/schema-integrity/coverage各独立check。 |
| report生成？ | suite/run报告、EV index、acceptance draft由scripts/reports；失败仍生成。 |
| suite→CUT/TC/EV？ | §7.1与§7.2 exact数组，EV唯一沿Step6，不以family通配。 |
| 手工P0？ | 本地98TC均自动化；外部owner签核不是可被手工替代的P0运行证据。 |
| 单suite停审？ | §7.5逐suite设计审查。 |
| 跨suite缺口？ | §7.6主集合互斥且合计98；附加重跑保留独立subrun，不覆盖主EV。 |

## 4. 当前文档问题诊断

初稿图出现report-generation-audit但无suite/gate；只给三总脚本，参数与case→EV未闭合。test结果若直接由静态Markdown填写会伪造evidence，失败suite若无报告也无法验收追溯。

## 5. 改动前后对比

| 前 | 后 | 原因 |
|---|---|---|
| 10suite表/11suite图 | 11主suite各gate并有exact TC集合 | 消除执行遗漏 |
| 大总脚本 | gate/check/report各计划边界及参数 | 07可逐boundary实施 |
| 只有成功report | 无条件finalizer，失败/blocked亦配对 | 保留真实性 |

## 6. 测试设计取舍

采用唯一主suite/EV归属与显式release expected manifest，不采用smoke代表全覆盖。共同约束的附加层重跑可用同TC但用不同`execution_id`，主EV只引用指定主执行，不择优覆盖失败。script boundary为本方案计划，非已实现文件；不生成静态report template假结果。

## 7. 结构化中间产物

### 7.1 Suite/gate/输出

别名沿Step6。全部blocking=P0，default profile=test；staging real-owner另selected不替代。每行artifact固定`artifacts/test/<run_id>/suites/<suite>/`，report固定`reports/runs/<run_id>/suites/<suite>.json`与同名`.md`；JSON为机器真相、Markdown为其生成展示，不两套手写结果。raw case路径为该suite下`cases/<tc_id>/<subcase_id>.json`，redacted日志为`logs/<execution_id>.jsonl`。

| suite（别名） | CUT/覆盖 | 时机 | planned gate |
|---|---|---|---|
| contract-domain-fast D | 01/02/06/依赖；codec/factory/222pair/33canonical | PR/main/nightly/release | scripts/gates/run_contract_domain_fast.sh |
| service-flow-fast S | 02/03/05/08/12；七U业务与original result | PR/main/nightly/release | scripts/gates/run_service_flow_fast.sh |
| infra-runtime-fake I | 03/05/10；公开port/资格/fault | main/nightly/release | scripts/gates/run_infra_runtime_fake.sh |
| postgres-atomicity P | 04/07/08/09/11；真实PG帧/CAS/as-of/manifest | main/nightly/release | scripts/gates/run_postgres_atomicity.sh |
| entry-worker-job W | 01/03/05/06/12；37route/12Job/fence | main/nightly/release | scripts/gates/run_entry_worker_job.sh |
| web-protocol-workflow B | 13；DTO/locale/browser/workflow | main/nightly/release | scripts/gates/run_web_protocol_workflow.sh |
| config-redline C | 10；loader/六域/七字段/八slot/profile | PR/main/nightly/release | scripts/gates/run_config_redline.sh |
| redaction-boundary X | 11；全sink/finite label/报告脱敏 | main/nightly/release；PR快检查 | scripts/gates/run_redaction_boundary.sh |
| recovery-replay R | 05/06/11/12；unknown/probe/full原report | nightly/release；恢复改动main追加 | scripts/gates/run_recovery_replay.sh |
| report-generation-audit E | 工具真实性/schema/digest/path/跨run负例 | main/nightly/release；PR schema快测 | scripts/gates/run_report_generation_audit.sh |
| release-main-smoke M | 本地受控发布→分发→撤回→恢复/Web状态 | nightly/release | scripts/gates/run_release_main_smoke.sh |

#### 自动化门禁图: Marketplace计划流水线

```text
PR -> D + S + C + dependency/redaction/schema checks
 |                  |
 +--> main -> I + P(actual PG) + W + B + X + E
                  |
                  v
       nightly / release: all 11 suites + all subcases
                  |
                  v
       report finalizer -> integrity/redaction/coverage checks
                  |
                  v
         explicit run evidence index / acceptance draft
         (no verdict / signoff / readiness)
```

关键说明：未执行不算pass；finalizer无论失败与否都尝试输出报告，最终checks失败不能生成qualified EV。smoke不代替底层suite，staging qualification不由此图批准。

### 7.2 唯一主suite→TC显式集合

TC名省略固定`TC-`，每格是显式数组元素；未来registry必须展开为完整字符串数组。EV逐TC使用Step6主表，不写`all P0`/glob/范围作为`tc_refs`。正反/并发/恢复subcase的expected manifest按Step6库存契约枚举，不仅计98行。

| 别名 | 主TC数组 |
|---|---|
| D | [CROSS-001,CROSS-002,CROSS-011,CROSS-012,CROSS-013,CROSS-020] |
| S | [SOURCE-001,SOURCE-002,SOURCE-003,SOURCE-006,REVIEW-001,REVIEW-002,REVIEW-003,REVIEW-004,REVIEW-005,REVIEW-007,REVIEW-009,REVIEW-010,WITHDRAWAL-001,WITHDRAWAL-002,WITHDRAWAL-003,WITHDRAWAL-004,WITHDRAWAL-005,WITHDRAWAL-006,WITHDRAWAL-007,WITHDRAWAL-008,WITHDRAWAL-009,WITHDRAWAL-010] |
| I | [SOURCE-004,SOURCE-005,REVIEW-006,REVIEW-008,CROSS-014] |
| P | [CATALOG-001,CATALOG-002,CATALOG-003,CATALOG-004,CATALOG-005,CATALOG-006,CATALOG-007,CATALOG-008,CATALOG-009,CATALOG-010,REFERENCE-001,REFERENCE-002,REFERENCE-003,REFERENCE-004,REFERENCE-005,REFERENCE-006,CROSS-003,CROSS-004,CROSS-015,CROSS-016,CROSS-017] |
| W | [DISTRIBUTION-001,DISTRIBUTION-002,DISTRIBUTION-003,DISTRIBUTION-004,DISTRIBUTION-005,DISTRIBUTION-006,DISTRIBUTION-007,DISTRIBUTION-008,DISTRIBUTION-009,DISTRIBUTION-010,CROSS-005,CROSS-007,CROSS-018,CROSS-019] |
| B | [CROSS-008,CROSS-021] |
| C | [CONFIG-001,CONFIG-002,CONFIG-003,CONFIG-004,CONFIG-005,CONFIG-006,CONFIG-007,CONFIG-008,CONFIG-009,CONFIG-010,CONFIG-011,CONFIG-012,CROSS-009,CROSS-022] |
| X | [CROSS-006] |
| R | [RECOVERY-001,RECOVERY-002,RECOVERY-003,RECOVERY-004,RECOVERY-005,RECOVERY-006,RECOVERY-007,RECOVERY-008,RECOVERY-009,RECOVERY-010,RECOVERY-011] |
| E | [CROSS-010] |
| M | [CROSS-023] |

主TC计数：D6/S22/I5/P21/W14/B2/C14/X1/R11/E1/M1=98。service覆盖所有flow的编排要求由CROSS-014与各族主case共同实现，不意味着S单独囊括98主case。纯guard/codec/PG/API/Worker/Web补层可重跑同TC，不能偷换EV的证明层级。

### 7.3 脚本参数与退出契约（全部planned）

| 计划脚本/类别 | 必须输入 | 输出/失败处理 |
|---|---|---|
| 上述11 suite gate | --run-id、--artifact-root、--config-profile、--registry-ref、--subcase-manifest-ref | 原始case/log与suite JSON/MD；实际未执行case=not_run；finalizer不可吞原exit |
| scripts/gates/run_release_gate.sh | 同上+--report-root；不接受latest或自动取最近run | 串行/受控执行全11，收集所有失败；生成run报告/index/draft，不自动deploy/签核 |
| scripts/checks/check_dependency_boundary.sh | --run-id、--artifact-root、--report-root、--implementation-root | 验证正式package依赖/Core SDK exports/0active event等；只有未来存在实现仓时运行 |
| scripts/checks/check_config_redline.sh | 同run roots、--config-profile、--redacted-config-ref | 校验配置/profile/bypass，与CONFIG主case一致 |
| scripts/checks/check_redaction.sh | 同run roots、--scope raw-and-report | 扫logs/raw/report/bundle安全范围；发现secret阻gate，原敏感输出不归档 |
| scripts/checks/check_no_static_evidence.sh | 同run roots、--registry-ref | 静态pass/latest/跨run/无raw/report拒绝；不放reports目录 |
| scripts/checks/check_schema_integrity.sh | 同run roots、--schema-version | 严格schema、路径/摘要/引用、自引用排除规则检查；失败不能index为qualified |
| scripts/checks/check_coverage.sh | 同run roots、--registry-ref、--subcase-manifest-ref、--gate-stage | 校验TC/EV/49/43/14/222/17/146/33/7参数化集合；release全闭包 |
| scripts/reports/build_suite_report.sh | 同run roots、--suite-id、--raw-manifest-ref | 从actual raw生成JSON/MD，即使failed/blocked/unavailable仍输出 |
| scripts/reports/build_run_report.sh | 同run roots、--expected-suites-ref | 聚合suite+checks+环境状态，不择优覆盖失败 |
| scripts/reports/build_evidence_index.sh | 同run roots、--registry-ref | 只生成validated same-run EV/index；缺配对保留gap，不能补手写结果 |
| scripts/reports/build_acceptance_draft.sh | 同run roots、--evidence-index-ref | reports/acceptance/<run_id>-draft.json及md；仅交接，不verdict/signoff |

run_id必须由harness明确给出，非空且符合Step13有限path段语法；artifact-root默认`artifacts/test/<run_id>`，report-root默认`reports/runs/<run_id>`。自定义根须为获准隔离测试目录，realpath验证同run、不允许生产路径/目录逃逸/symlink；正式evidence仍映射为统一相对逻辑路径。config-profile只四值，CI=test，staging不能自动fake；配置输入按04选择器加载，不在argv放secret。execution_id/subcase_id不可重复，既有completed run不得覆写。

gate exit：0=本scope所有expected subcase及checks通过；1=断言/被测失败；2=基础设施unavailable；3=qualification/precondition blocked；4=输入/schema/integrity/redaction/report工具失败。2/3/4全阻P0；空suite/缺subcase/not_run不0。check/report也返回0或对应非0；report生成失败另记tooling gap并保留原gate状态，不能因生成报告成功而gate pass。

六check均支持`--stage artifact|seal`；默认artifact，release另显式运行seal。machine输出`artifacts/test/<run_id>/checks/<stage>-<check_id>.json`、MD输出`reports/runs/<run_id>/checks/<stage>-<check_id>.md`；两stage不覆盖。artifact阶段核验raw/report，seal阶段核验final index/EV/MD/run报告；不引用自身check输出，也不让index回指seal形成摘要循环。

### 7.4 Artifact/report配对与自动化边界

每case raw记录实际assertions、design refs、dataset/seed、执行状态与safe日志引用；suite report聚合全部subcases及raw摘要，run report聚合suite/checks；index的EV精确指向该TC主suite所有required subcase，不能只挑passed。格式/required/摘要规则在Step13规范性schema。

所有11suite为本地P0可自动化候选，没有以手工替代的P0。owner正式qualification/current contract、producer redaction授权和人类publisher/org/auth签核为外部前置，保持blocked；性能/长期保留/真实送达selected P1/P2未形成硬阈值。人工Web可用性spot与后续证据审阅只能补充，不能代替TC或伪造owner结果。

### 7.5 逐suite/gate停审

| suite | 设计停审 | 具体检查/未关闭缺口 |
|---|---|---|
| contract-domain-fast | pass | 6主TC+完整参数化库存，D脚本、raw/report配对，无actual compile |
| service-flow-fast | pass | 22主TC七U编排/原result，无fake私补方法 |
| infra-runtime-fake | pass | 5主TC qualification/fault/146method，同正式port，不real ready |
| postgres-atomicity | pass | 21主TC实际PG必须，资源缺即unavailable |
| entry-worker-job | pass | 14主TC，37route/Job私有、fence/A-B/no-write |
| web-protocol-workflow | pass | 2主TC全部UI状态/locale/browser，无原型充数 |
| config-redline | pass | 14主TC，七字段/八slot/四profile与04一致 |
| redaction-boundary | pass | 1主TC全sink参数化，report failure也scan |
| recovery-replay | pass | 11主TC，probe/full原report/finite target，无强制成功 |
| report-generation-audit | pass | 1主TC工具负例，生成器/validator也必须测试 |
| release-main-smoke | pass | 1主TC最小本地闭环，不能代替全98 |

### 7.6 跨suite门禁/证据审计

11suite均有gate、exact主TC集合、EV主表、统一raw/report路径、阻断状态和finalizer；主TC并集=98且无重复。补层执行保留独立execution_id、不覆盖主EV/原失败；release expected manifest全库存、不以代表case缩减。no-static/redaction/依赖/coverage/schema-integrity均入release，失败suite报告不遗漏；tooling synthetic输入不进入final EV，工具真实执行的raw/assertions可按CROSS-010生成其EV。当前全部planned，没有真实脚本能力或报告。

## 8. 回填草稿

正式§9采用11suite+gate表、exact TC集合入口、门禁图/参数/exit与路径配对。本文件为规范性自动化附录；逐suite审查过程不复制到正式正文。

## 9. 待确认事项

实际CI runner/PG/browser/provider与formal owner资格仍blocked/pending；本轮不新增部署/commit权限。详细设计影响判定：新增的是测试脚本计划边界，不是业务接口/配置字段；正式07须同步全部planned skeleton，未在当前创建。工具实现若要求私有schema/owner truth须回03/04。

## 10. 进入下一步条件

11suite独立停审，98主TC闭包/EV唯一与输出配对设计完整；本步gate pass。下一读SOP Step10/规范§5.10、00全部17NFR、03故障/observability与Q-MP-01阈值边界；不提交commit。
