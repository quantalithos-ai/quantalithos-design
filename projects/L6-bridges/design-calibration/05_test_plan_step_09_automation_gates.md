# L6-bridges 05 Step9：自动化门禁

## 1. Step状态与开工确认

2026-10-04；仅05获授权；full-restart / single-agent-serial。此步先骨架，不提前创建未来Step或正式正文。

| 模块 | 骨架 | 思考 | 写入 | 自检 | gate_status | gate_reason | next_allowed_action | source_files |
|---|---|---|---|---|---|---|---|---|
| automation_gates | done | done | done | pass_design_static | pass | step_design_review_complete_external_gates_open | begin_step10_skeleton | 本Step§2/7；实际静态审计 |

### Step内计划

| 小阶段 | 状态 |
|---|---|
| 输入/前序阅读 | done |
| SOP问题回答 | done |
| 当前材料诊断 | done |
| 测试设计取舍 | done |
| 结构化/逐切口停审 | done |
| 复杂度与批次判断 | done |
| 回填草稿 | done |
| 实际自检/下一条件 | done |

## 2. 本步输入

已读Step4/6/7/8及SOP Step9十四问题/书写§5.9、03§4/15脚本等待项。TEST-03-001完整七脚本已先登记03§4.4/15与Step4/16，实际path/参数/捕获/失败合同检查pass；没有脚本实现。Suite审查只修当前05 Step6/registry primarytarget和STATE/host参数路由，40TC默认调整，原schema/断言/十一target不变；不存在的Step4文件名检索后改真实units_file_layout。上述过程留校准。

## 3. SOP问题回答

1. 所有local SUITE-S~J及TOOLS进PR，缺case/params不绿灯。
2. main CI同PR全量且校验固定run摘要/报告；不能只跑changedfilter后宣全覆盖。
3. nightly扩已批准P1/压力组合及qualifiedactualseam，不自动secret/外部账号fallback。
4. staging/发布需REAL与local同fixed-run完整关联，再contextcheck/evidencecheck/report/handoff；不是部署或正式验收。
5. flaky/超时/依赖不可用有限失败/blocked/unavailable，不能silent retry整个real suite造新effect，旧run保留。
6~8. 三gate全部固定scripts/gates路径及run-id/artifact-root/config-profile参数，输出固定artifacts/test/<run_id>。
9~10. 两checks先于report，两report写reports/runs/<run_id>与reports/acceptance/<run_id>，不latest。
11. 每suite具体TC数组及EV由registry明确关联；STATE/host路由每instance唯一。
12. 116P0断言可自动化，actual准入/审批是人工前置，不替代case；humanhandoff不给自动verdict。
13~14. 每suite写后审完整target/TC/EV/失败/输出；跨审无孤儿P0、重复instance归属、覆盖缺口或report断链。

## 4. 当前材料问题诊断

第一target作primarysuite不一定可在该crate依赖内执行；由既有owner/对象责任修归属。M18/I、M19/J、M20/21W必须按原载体module运行；script manifest固定路由，禁止任意filter或新增逆向crate依赖。safe工具stdout/runnerschema是harness，不production协议。

## 5. 改动前后对比

| 初始风险 | 处理 |
|---|---|
| 缺脚本责任路径 | TEST-03-001具名七脚本先同步03四处 |
| suite错误module | 修40TCdefault、STATE/host实例路由，不改断言 |
| gate只exit0但没有case | expected manifest closedinstances校验；缺输出blocked |
| report从静态表造成功 | writer真caseoutput→index→EVreport，checks必过 |
| 失败dump/rawstdout | bounded私有捕获/allowlist先验、仅safe tokens写blob |

## 6. 测试设计取舍与复杂度

七脚本完整合同已有source，本Step按十三suite分别审TC/target/EV，再门禁图/输出/重跑策略。约120行，scripts只是planned路径，不创建shell/manifest/输出目录；JSONschema在Step13才落design。

## 7. 结构化中间产物

### 7.1 Planned脚本接口

七脚本完整路径/类型/参数/I-O/有限退出与安全捕获合同见[必要反校准](05_test_plan_step_09_script_contract_calibration.md)§4和03§4.4/15，均planned/not_run。这里的harnessprofile只声明固定run的批准contexts/modes/套件封闭实例及tool资源，不改变production04字段/权限。

三个gate支持required `--run-id`/`--config-profile`及default `--artifact-root=artifacts/test/<run_id>`；两check/两report同参数。exit0本工具通过；1断言/check失败；2参数/schema/path错误；3blocked资格/coverage/baseline；4unavailable工具/环境/IO。非0保已有安全材料与有限reason，不echo raw/canary/凭证/配置。

`run-bridge-local.sh`固定11membermanifest/target（S例如`cargo test --manifest-path crates/contracts/Cargo.toml --test protocol_surface_tests -- --test-threads=1`，其余按原路径），TOOLS复用S/P的case_harness组；不会同instance重复执行。test-only传递五个BR_TEST_*非敏感上下文key见03合同，无rawconfig/secret环境变量。actualcase不由local执行，realgate只批准sandbox及原same-op参数，不automatic effect retries。

### 7.2 Suite到TC/EV/输出映射

每suite仅收自己的参数实例；TC族跨suite时由expectedmanifest按object_family/machine/host路由，instance_id唯一，不能每target各生成同TC的假passed。下表cases均具体数组，planned。

| Suite / 原target | 具体TC数组 | plannedEV数组 | 执行位置/触发 | gate/阻断级别 |
|---|---|---|---|---|
| SUITE-S / `crates/contracts/tests/protocol_surface_tests.rs` | TC-SURFACE-001、TC-SURFACE-002、TC-SURFACE-003 | EV-CONTRACT-001 | PR/main全量；nightly受控扩组合 | `scripts/gates/run-bridge-local.sh`；P0非0/缺instance阻local |
| SUITE-D / `crates/domain/tests/local_guards_tests.rs` | TC-STATE-001、TC-STATE-002、TC-STATE-003、TC-STATE-004、TC-STATE-005、TC-STATE-006、TC-SURFACE-001、TC-SURFACE-002 | EV-CONTRACT-020、EV-CONTRACT-001 | PR/main全量；nightly受控扩组合 | `scripts/gates/run-bridge-local.sh`；P0非0/缺instance阻local |
| SUITE-A / `crates/application/tests/authorization_flow_tests.rs` | TC-BIND-001、TC-BIND-002、TC-BIND-003、TC-BIND-004、TC-MAP-001、TC-MAP-002、TC-MAP-003、TC-MAP-004、TC-MAP-005、TC-PRESENT-001、TC-PRESENT-002、TC-PRESENT-003、TC-PRESENT-004、TC-ATTACH-001、TC-ATTACH-002、TC-ATTACH-003、TC-CALLBACK-001、TC-CALLBACK-002、TC-CALLBACK-003、TC-CALLBACK-004、TC-AUDIT-002、TC-CONFIG-005、TC-CONFIG-008 | EV-CONTRACT-002、EV-CONTRACT-003、EV-CONTRACT-006、EV-CONTRACT-007、EV-CONTRACT-009、EV-CONTRACT-016、EV-CONTRACT-017 | PR/main全量；nightly受控扩组合 | `scripts/gates/run-bridge-local.sh`；P0非0/缺instance阻local |
| SUITE-C / `crates/application/tests/continuity_flow_tests.rs` | TC-SURFACE-004、TC-DELIVERY-001、TC-DELIVERY-002、TC-DELIVERY-003、TC-DELIVERY-004、TC-DELIVERY-005、TC-KEY-001、TC-KEY-002、TC-KEY-003、TC-KEY-004、TC-KEY-005、TC-CURSOR-001、TC-CURSOR-002、TC-CURSOR-003、TC-CURSOR-004、TC-RATE-001、TC-RATE-003、TC-RATE-004、TC-RATE-005、TC-RECOVERY-001、TC-RECOVERY-002、TC-RECOVERY-003、TC-RECOVERY-004、TC-RECOVERY-005、TC-AUDIT-001、TC-AUDIT-003、TC-AUDIT-004、TC-AUDIT-005、TC-CONFIG-009、TC-CONFIG-010 | EV-CONTRACT-001、EV-CONTRACT-008、EV-CONTRACT-010、EV-CONTRACT-011、EV-CONTRACT-012、EV-CONTRACT-013、EV-CONTRACT-016、EV-CONTRACT-017 | PR/main全量；nightly受控扩组合 | `scripts/gates/run-bridge-local.sh`；P0非0/缺instance阻local |
| SUITE-R / `crates/application/tests/safe_read_tests.rs` | TC-READ-001、TC-READ-002、TC-READ-003、TC-READ-004 | EV-CONTRACT-015 | PR/main全量；nightly受控扩组合 | `scripts/gates/run-bridge-local.sh`；P0非0/缺instance阻local |
| SUITE-B / `crates/infra/tests/platform_boundary_tests.rs` | TC-CHANGE-001、TC-CHANGE-002、TC-CHANGE-003、TC-CHANGE-004、TC-ATTACH-004、TC-RATE-002、TC-CONFIG-001、TC-CONFIG-002、TC-CONFIG-004、TC-CONFIG-006、TC-CONFIG-012 | EV-CONTRACT-005、EV-CONTRACT-007、EV-CONTRACT-012、EV-CONTRACT-017 | PR/main全量；nightly受控扩组合 | `scripts/gates/run-bridge-local.sh`；P0非0/缺instance阻local |
| SUITE-L / `crates/infra/tests/local_commit_boundary_tests.rs` | TC-LOCAL-001、TC-LOCAL-002、TC-LOCAL-003、TC-LOCAL-004、TC-LOCAL-005 | EV-CONTRACT-014 | PR/main全量；nightly受控扩组合 | `scripts/gates/run-bridge-local.sh`；P0非0/缺instance阻local |
| SUITE-P / `crates/infra/tests/private_material_boundary_tests.rs` | TC-CALLBACK-005、TC-CONFIG-007、TC-PRIVATE-001、TC-PRIVATE-002、TC-PRIVATE-003、TC-PRIVATE-004、TC-PRIVATE-005 | EV-CONTRACT-009、EV-CONTRACT-017、EV-CONTRACT-018 | PR/main全量；nightly受控扩组合 | `scripts/gates/run-bridge-local.sh`；P0非0/缺instance阻local |
| SUITE-I / `crates/api/tests/inbound_dispatch_tests.rs` | TC-INBOUND-001、TC-INBOUND-002、TC-INBOUND-003、TC-INBOUND-004、TC-INBOUND-005、TC-CONFIG-003、TC-ENTRY-001、TC-ENTRY-004、TC-ENTRY-005、TC-ENTRY-007、TC-STATE-001、TC-STATE-002、TC-STATE-003、TC-STATE-004、TC-STATE-005、TC-STATE-006 | EV-CONTRACT-004、EV-CONTRACT-017、EV-CONTRACT-019、EV-CONTRACT-020 | PR/main全量；nightly受控扩组合 | `scripts/gates/run-bridge-local.sh`；P0非0/缺instance阻local |
| SUITE-W / `crates/worker/tests/consumer_dispatch_tests.rs` | TC-CONFIG-011、TC-ENTRY-002、TC-ENTRY-003、TC-CONFIG-003、TC-ENTRY-001、TC-STATE-001、TC-STATE-002、TC-STATE-003、TC-STATE-004、TC-STATE-005、TC-STATE-006 | EV-CONTRACT-017、EV-CONTRACT-019、EV-CONTRACT-020 | PR/main全量；nightly受控扩组合 | `scripts/gates/run-bridge-local.sh`；P0非0/缺instance阻local |
| SUITE-J / `crates/jobs/tests/job_invocation_tests.rs` | TC-ENTRY-006、TC-CONFIG-003、TC-ENTRY-001、TC-STATE-001、TC-STATE-002、TC-STATE-003、TC-STATE-004、TC-STATE-005、TC-STATE-006 | EV-CONTRACT-019、EV-CONTRACT-017、EV-CONTRACT-020 | PR/main全量；nightly受控扩组合 | `scripts/gates/run-bridge-local.sh`；P0非0/缺instance阻local |
| SUITE-TOOLS / `原S/P testtarget + 两checks` | TC-EVIDENCE-001、TC-EVIDENCE-002、TC-EVIDENCE-003、TC-EVIDENCE-004、TC-EVIDENCE-005 | EV-CONTRACT-021 | PR/main全量；nightly受控扩组合 | `scripts/gates/run-bridge-local.sh`；P0非0/缺instance阻local |
| SUITE-REAL / `actual B/L/A/C/P/I/W/J；无新Rusttarget` | TC-LOCAL-006、TC-REAL-001、TC-REAL-002、TC-REAL-003、TC-REAL-004、TC-REAL-005、TC-REAL-006、TC-REAL-007 | EV-CONTRACT-014、EV-REAL-001 | 批准test/staging actualscope，release候选 | `scripts/gates/run-bridge-real-seams.sh`；缺资格blocked，阻受影响actualAC |

S/D主要protocol/model，A授权，C连续性，R只读，Badapter/config，Lwholecommit，P禁材，IAPI/Runtime，Wsource/batch，Jboundedjob。跨cut参与targets只用于回归选择，不复制instance或让fake释放real。原20协议roundtrip及19modelfactory各在原S/D所属target完整测试，不能contracts测试依赖domain造逆向compile边。

每suite固定输出 `artifacts/test/<run_id>/suites/<suite_id>/<context_id>/report.json`及`stdout.log`/`stderr.log`；case JSON在`cases/<instance_id>.json`，安全blob由runner预验仅有限tokens，不存自由raw。report对应`reports/runs/<run_id>/summary.md`与`evidence/<EV-ID>.json`，EV关联具体TC/instance/suite/context/digest，不用“全部P0”。Step13定义完整localDTO与canonicalization。

### 7.3 CI/CD门禁图: 固定run验证与交接

```text
[immutable safe run context + closed expected-instance manifest]
                   |
          +--------+---------+
          v                  v
[local gate S..J/TOOLS] [real-seam gate: qualified sandbox only]
          |                  |
          +------ safe case/suite artifacts ------+
                                                  v
                                   [check run context]
                                                  |
                                   [check test evidence]
                                                  |
                                   [release aggregation gate]
                                                  |
                                   [build run report + EV pages]
                                                  |
                                   [acceptance handoff draft]
                                                  |
                              [human/Agent review, no auto verdict]

[fail/blocked/unavailable] -> [keep existing SAFE output + finite reason]
[qualification missing]  -> [blocked, never fixture fallback]
```

关键说明：run gate生成真实实例；release gate只汇总/校验既有同run输出，不重新dispatch effects。index minimal shell未完成case不能是最终EV，自动工具不决定06验收signoff/readiness。

### 7.4 失败、重跑与真实性

工具capability先用TC-EVIDENCE-001~005自测；每run prewriter allowlist/size校验，两check必须在报告/交接前成功。未实现case/harness/tool或actual依赖 unavailable=非0；不伪造case填洞。timeout/flaky是失败待缺陷复验，不能默认re-run平台effects；授权复验新run保旧output，业务原op/unknown窗口不重置。

真实case不论passed/failed必须有限assertion记录与suiteexit一致；not_run/blocked缺coverage不能整体pass。安全output不存在时不能仅exit0构造context/index/case，更不能从静态caseplan物化report。所有reports需人审追溯，acceptance handoff不是verdict/signoff。

## 8. 回填草稿

正式§9保suite/script接口图和失败规则。七脚本contract可完整装配正文或明确具名03规范来源；具体schema和report材料等Step13，不把校准自检写tool capability通过。

## 9. 待确认事项

actualgate当前blocked，script能力尚未实现/自测；必需tool产品/依赖不选具体实现语言库，shell允许调用已批准工具缺失返回4。07才建立implementationboundaries。

## 10. 自检与进入下一步条件

实际自检：十三suite具体TC/EV/十一target及七script合同配对审查；actual仍blocked；audit对专项附录不强制十节，主Step仍十节；SURFACE wire/model与STATE/host按原module逐instance路由。已运行当前05校准Markdown/编号章节/相对文件链接检查，errors=[]；仅设计静态，不是项目测试或运行证据。

self_review=pass_design_static_external_gates_open；gate_status=pass；gate_reason=step_design_review_complete_external_gates_open；next_allowed_action=begin_step10_skeleton；source_files=本Step§2/7及对应SOP/规范。
formal_document_write_allowed=false；implementation_write_allowed=false；test_execution_allowed=false；commit_required=false。
