# L6-bridges 04 Step12：测试验收实施运维承接

## 1. Step状态与开工确认

2026-10-04；前序Step11已通过设计静态自检，授权仅全部04；正式04完成即停审。full-restart / single-agent-serial，无代理/并行工具。

| 模块 | 骨架 | 思考 | 写入/草稿 | 自检 | gate_status | next_allowed_action |
|---|---|---|---|---|---|---|
| S12 | done | done | done | done | pass | enter_step13 |

### Step内计划

| 小阶段 | 位置 | 状态 |
|---|---|---|
| 读取输入/前序 | §2 | done |
| SOP问题回答 | §3 | done |
| 当前材料诊断 | §4 | done |
| 设计取舍 | §6 | done |
| 结构化/逐域停审 | §7 | done |
| 复杂度与批次 | §6 | done |
| 回填草稿 | §8 | done |
| 自检/下一条件 | §10 | done |

## 2. 本步输入

Step6矩阵/Step7~11/schema/private/cold/failure、03§15/Step16 planned target与00§14；对应下游标准只读取配置承接条款；配置SOP Step12和书写§5.12。精确读取/使用范围随§7记录，不把旧05/06或Chat作正式输入。

## 3. SOP问题回答

| 问题 | 回答 |
|---|---|
| 1 测试 | §7.2十二planned切口承接82项/22guard/27失败；沿03十一planned target，不建TC/suite/script/run。 |
| 2 验收 | 00 AC001~038与VETO、03原状态/wholeCAS/owner结果、04配置禁止面/环境/current/no泄露；这里只提供门禁输入，不裁verdict。 |
| 3 实施 | 实际product/pin/compile/source/provider/route/store/clock/private资格与具名载入consumer；07才阶段/boundary排程，正式07完成同步全部planned skeleton/ledger。 |
| 4 运维 | 各环境受权file/挂载/profile、账户grant/revoke/轮换、排他source cold切换、original恢复与安全告警发布程序；命令09写。 |
| 5 不重复 | JSON键/类型/default/required/source/secret/current/状态/幂等/owner边界不被下游重新猜；变化回所属03/04Step并重审。 |

## 4. 当前文档问题诊断

旧05/06无当前输入资格，不能用旧fake+真实账号混合用例释实际资格。04静态JSON检查不等项目tests；现有planned target并非已创建文件，TC/EV/report路径不能因为本Step承接就实例化。跨仓runtime/event依赖不能用Cargo path代替owner准入。

## 5. 改动前后对比

| 之前 | 本步后 |
|---|---|
| 下游只概括“待测试” | 四文档职责与12切口/原target/条件输入明确 |
| 实施骨架易提前创建 | 正式07完成才ledger＋全部planned boundary；当前仍缺失 |
| evidence文件名看似存在 | 仅未来root规则、当前none/not_run/not_evaluated，无伪实例 |

## 6. 设计取舍与复杂度

采用配置设计输入，不代写05完整TC或06裁决/07phase/09命令。实际读取测试书写§2.4/5.7/5.8、验收§4.2~4.4、实施§4.6.1/5.8、运维§4.5及03 Step16原target索引；宽rg输出截断只定位，所需条款分段补读，不声称读完下游SOP/规范或进入05。

未采用以fixture/noop关闭owner/平台gate，或提前创建artifact/report/ledger。复杂度按四下游与十二设计切口闭合，实际schema/规范源唯一。

## 7. 结构化中间产物

### 7.1 下游承接图: Bridges配置输入与权威结果分离

```text
[03 runtime/objects/protocol/state + 04 config baseline]
            |
            +--> [05: cases/fixtures/env matrix/real qualification cuts]
            +--> [06: P0/veto/evidence requirements, actual verdict only]
            +--> [07: implementation/read gates/boundaries, planned ledgers]
            +--> [09: deployment/cold rotate/recover/runbooks]
```

关键说明：

- 四下游读取同一03/04合同，不重新发明field/ref/key/state/default。
- 这里只交设计输入；TC/EV/run/report/verdict/signoff当前均未产生。
- 正式07完成时才创建implementation ledger和全部planned boundary，不等于实施ready。

| 下游文档 | 承接内容 | 本文提供的输入 / 当前状态 |
|---|---|---|
| 05测试方案 | 本地loader/typed/current/四平台/secret/wholeCAS/unknown/冷变更及五环境矩阵；区分synthetic与真实产品资格 | 04§5~11/本节切口、03§15十一targets；planned/not_run；未建05 flow |
| 06验收标准 | 00 P0/AC/VETO、03 owner/phase/state及04禁配、完整required/current与所有泄露否决；actual证据闭环 | 本文scope/禁止/current/source/失效+真实外部blocker；not_evaluated，用户/owner未签 |
| 07实施计划 | 使用原planned路径/driver/port/carrier落码、产品pin/compat/private/clock/store资格、规范阅读和每boundary门禁 | 本文82项/14stage/22guard/03必要反校准、全依赖seam状态；waiting/blocked，ledger/boundary未建 |
| 09部署运维 | actual file授权/挂载/network/TLS/credential/rotation、source group排他、C01 CAS、old/new冷切换与original恢复/回退告警 | 五环境、三entry参数、resource/profile/secret/current/失败及审计白名单；waiting，无部署命令 |

### 7.2 Planned配置测试切口（非TC/EV）

| 设计切口 | 04来源 / 观察断言 | 03原planned target | 状态 |
|---|---|---|---|
| CFG-CUT-001 lexical/schema | size/depth/数组累计、UTF-8/duplicate/unknown/null父子/所有82项default-none；拒不吐原值 | B：crates/infra/tests/platform_boundary_tests.rs | planned / not_run |
| CFG-CUT-002 enum/numeric/selector | 十branch/四platform/八mode/五环境、五数值range/checked、@version/wrong-kind；每边界正反例 | B；S：crates/contracts/tests/protocol_surface_tests.rs仅既有public refs | planned / not_run |
| CFG-CUT-003 来源/entry | 三flag/ENV、同值/不同值/重复/缺路径、validate-only零listener/secret/Command/Job；Jobs ref非context | I：crates/api/tests/inbound_dispatch_tests.rs；J：crates/jobs/tests/job_invocation_tests.rs；W：crates/worker/tests/consumer_dispatch_tests.rs | planned / not_run |
| CFG-CUT-004 required/profile/环境 | 每branch exact闭包/实际scope，prod拒fixture和跨env；current window/配置basis不是authority | B / I / J / W | planned / not_run |
| CFG-CUT-005 installation/C01 | 七draft字段/namespace集合/C01 content/revision匹配；读取不自动CAS/activation，unknown同driver | A：crates/application/tests/authorization_flow_tests.rs；L：crates/infra/tests/local_commit_boundary_tests.rs | planned / not_run |
| CFG-CUT-006 四source/mapping/ACK | source/family/mode排他；Telegram整体group、DiscordGateway/HTTP、Slack/Mattermost验证；ACK≠owner/Turn/delivery | B / I / W；C：crates/application/tests/continuity_flow_tests.rs | planned / not_run |
| CFG-CUT-007 secret/private | 五用途exact provider/key/version/window/current revoke，no latest/env/fallback/copy/debug；所有buffer有界 | P：crates/infra/tests/private_material_boundary_tests.rs / B / I | planned / not_run |
| CFG-CUT-008 owner/附件/Gate/WS | external_id不GlobalMember、permission current/敏感裁剪、必要附件expired、Workspace选用required | A / P / B；R：crates/application/tests/safe_read_tests.rs | planned / not_run |
| CFG-CUT-009 rate/retry/continuity | 全scope max等待、原used/window/NoEffect、same epoch/full coverage、retention expiry不清key/result/unknown | C / B / L / J；D：crates/domain/tests/local_guards_tests.rs | planned / not_run |
| CFG-CUT-010 mandatory/material/evidence | producer/schema/admission缺失先拒mutation/IO；formal nonrecursive/original结果，fixed允许材料各出口 | A / C / P / R | planned / not_run |
| CFG-CUT-011 cold/rollback/CFG-03-001 | 候选不publish、C01新revision语义回退、source无双开、stop-time new budget同tuple，unknown并集不清 | W / J / B / L / C | planned / not_run |
| CFG-CUT-012 Query/drift/leak | zero write/probe/ID/repair/audit，visibility hidden counts/refs不empty成功；source drift即时阻IO、诊断不输出值 | R / P / B / I | planned / not_run |

上述十一target全部原03 Step4/16归属，没有额外Rust/test/script路径。fixture只在未来隔离test code中构造严格typed记录与private内存canary，不用真实外部账号/token/body/审批；泄露失败报告也不能打印canary/可还原派生。product driver/真实平台或owner契约验证须具体授权和qualified source，不由mock闭口。

### 7.3 实施 / 证据承接限制

| 交接面 | 必须材料 / 未来门禁 | 当前姿态 |
|---|---|---|
| core compile | 实际路径/exports：目标workspace根../quantalithos-core/crates/contracts；package core-contracts/lib core_contracts；真实compile资格后核 | path已读，不代表本仓编译通过 |
| SDK / 四platform / 六owner | exact pin/features/依赖闭包与实际installation/method/scope/compat、no hidden retry/raw output | not_selected/not_established；BR-UP001~009保open |
| secret/KMS/router/store/Bus/executor/clock/private | §7 typed descriptor/source/version/scope/current、所有原contract/私有生命周期/同driver/clock/scoped Future | 未选择或未建立，不能实施者猜 |
| 正式07 ledger | implementation_execution_ledger.md + implementation-boundaries全部planned骨架，required_reads/allowed_scope/check/commit/handoff gate | 本轮不创建；正式07获准完成时才同步，planned/blocked/waiting |
| 未来artifact/report | 只能真实受权run固定ID后按artifacts/test/<run_id>与reports/runs/<run_id>、reports/acceptance固定入口及安全材料规范 | 当前未物化，不能给伪run/path/EV/verdict/signoff |
| 脚本契约 | 05/07若确认需要先回03 Step4/16同步类型/参数/输入输出/失败/路径与boundary | waiting，不用临时脚本替代正式门禁 |

下游不得覆写本文JSON/默认/来源/精确selector、hot禁用/冷变更、secret/private、required/owner/material/原state/幂等/cursor/current事实边界；若用例或产品需要新carrier/method/key，先回03对应Step/04域或更上游重审，不能测试stub先给“成功”再补合同。

### 7.4 对详细设计的影响判定

| 配置结论 | 是否影响03 | 影响类型 | 03回写位置 | 处理状态 |
|---|---|---|---|---|
| 十二配置测试切口沿十一原planned target/四下游职责 | 否 | 既有测试输入细化，不新增测试文件/脚本/API | 03§15/17来源无需修改 | 无回写 |

## 8. 回填草稿

正式§12逐字装配§7.1~7.4。配置下游输入完整，但05/06/07/09未进入，所有TC/EV/真实资格/运行与验收仍waiting/not_run/not_evaluated；正式07才全部planned ledger skeleton。未实现、跑测试、物化材料或commit。

## 9. 待确认事项

BR-UP001~009=open、010=reference_only；WS十二开放项及Observability十二affected保原状态；平台/SDK/OAuth/API Key/KMS/router/DB/executor实际资格未建立。不实现、运行项目测试、stage或commit。

## 10. 自检与下一Step条件

实际只读检查：十段齐，§3~8未写占位0、03影响表存在，errors=[]。人工按本Step SOP问题与具名03消费点逐项核对，本步范围/禁止面/来源/失效语义通过设计静态自检；十二切口/十一原target逐名反查，四下游无角色越权，规范只读对应承接条款，未启动05/06/07。

self_review=pass_design_static；下一仅enter_step13。BR-UP/WS/affected及真实产品资格不释放；没有编译、项目测试或平台投递，不stage/commit。
