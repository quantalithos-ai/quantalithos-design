# L5-chat 07 · Step 4 实施对象与交付物清单

## 1. Step状态

> done / gate_status=pass（仅设计/文档静态门禁）；2026-10-02。implementation仍planned/blocked/waiting，无实际实现或测试结果。

| field | value |
|---|---|
| gate_status | pass |
| gate_reason | 本步设计规则、来源及最终跨文档静态闭环检查通过；不关闭上游blocker，不是implementation gate结果 |
| next_allowed_action | Step5已按本轮连续授权执行；07最终停点见flow，不能据此进入代码实施 |
| source_files | 本步§2/§7所列正式00～06、对应规范与前序Step；[07flow](07_implementation_plan_calibration_flow.md)、[项目台账](project_execution_ledger.md) |


## 2. 本步输入

前序Step3已done、07flow/项目台账与对应来源；07 SOP Step4、书写规范5.4；中间产物§5.10、真相源§7/§9和实施台账规范。

## 3. SOP问题回答

实施对象只取当前Chat客户端模块；全部43local协议与17状态归既有03；fixtures/runner/机器报告取05，验收私有writer取06。跨仓只SDK编译入口，owner能力为runtime合作；无领域迁移/seed或backend交付。

## 4. 当前文档问题诊断

原03给出完整客户端树和三个脚本，但尚无实施对象/脚本support逐项完成条件及非交付表。

## 5. 改动前后对比

| 改前 | 改后 | 原因 |
|---|---|---|
| 原03给出完整客户端树和三个脚本，但尚无实施对象/脚本support逐项完成条件及非交付表。 | 本步§7收口规则 | 阶段/门禁可执行且不伪造事实 |

## 6. 设计取舍

按功能责任与真实证明粒度列交付，不将全部owner对象复制成客户端对象；新增support文件只承载05/06既有schema。

## 7. 结构化中间产物

### 4.1 本轮与未来实施交付分开

当前轮交付正式07、13份Step中间产物、flow、设计台账、一个实施项目台账和§6全部planned boundary skeleton；以下是未来获授权实施的交付计划。code/test/config/lock/scripts/runtime材料现在均不创建。交付是否完成用实际gate与来源证明判定，不能由计划文件存在判定。

### 4.2 客户端实施对象清单

下表路径均相对计划实现仓quantalithos-chat；03 §4完整树是文件基线，§6进一步逐boundary限定exact paths与shared-file内允许内容。对象不是owner的替代schema。

| 交付物/最小对象与行为 | 类型 | 正式来源 | 预计落点 | 完成判定 |
|---|---|---|---|---|
| single private app/host工程与strict配置 | code/config | 03 §3/4/5.9/5.10/5.11；04 §3～11 | package.json、tsconfig.json、vite.config.ts、index.html、src/main.tsx；src-tauri/Cargo.toml等03 tree | 实际resolver锁定批准版本；TS与native分域build；无owner直接依赖 |
| ApplicationComposition/ClientRequest/Reply/facade、shell与React binding | code | 03 §5.10/7.1/8/16 | src/app/application_composition.ts、client_application_shell.tsx、page_registry.tsx、client_routes.ts、client_state_binding.ts、client_styles.css | 初始化安全、类型无未提供后序实现；StrictMode/dispose无重复提交或晚到写入 |
| RouteContext/AccessPosture/ClientConsumptionContext、guards/coordinator | code | 03 §5.1/7.4.1/8.4/9.4 | src/navigation/四个既定文件 | group/channel/dm/thread/deep link/back显式scope；当前epoch/slot/source隔离；hidden零泄露 |
| SafeMaterialSnapshot/OwnerReference/Provenance/Freshness、factory/composer/preview | code | 03 §5.2/7.4/9.7/11 | src/materials/五个既定文件 | qualified source唯一；empty/hidden/stale/unavailable分支完整；无ref反解与rawbody补全 |
| ClientStateStore/DraftStore、LocalProjectionRepository/MemoryRepository、PersistenceSafetyGuard/Eviction | code | 03 §5.6/10～12 | src/local_state/七个既定文件 | root CAS/检查不部分写；partition与repo key不互cast；revoke先stop，delete失败restricted；无durable假成功 |
| ConversationSurfaceViewModel/TurnPresentationModel/Selection、surface coordinator/assembler | code | 03 §5.3/7.4/8.4/9.5 | src/collaboration既定对话model/coordinator；pages/collaboration_entry_page.tsx、conversation_page.tsx、thread_page.tsx | 所有正式Turn变体与unknown fallback；只消费props/snapshot/callback；无组件IO |
| GateCard、Artifact ref/preview、Member/Work/Runtime/Workspace safe摘要 | code | 03 §5.3/7/8；06 §5～7 | src/collaboration/components/gate_card.tsx、artifact_reference.tsx、artifact_preview.tsx、各status/summary panel | 权限/来源/freshness显化；Gate显示不等Decision；preview需独立资格；safe摘要不等证据 |
| DraftState/CommandAttemptState、IntentFeedback、UserIntent/DraftCoordinator/CommandResultGate | code | 03 §5.4/7.3/7.4.6～7/8.3/9.6/12 | src/intents/七个既定文件 | optimistic/confirmed/failed/unknown按正式多轴词表；prepare/幂等association同源；ACK不终结；retry显式且probe先行 |
| ContinuityState/ChangeReducer/Resume/Recovery、恢复view与status | code | 03 §5.5/7.7/7.9/8.7/8.9/9.7/10～12 | src/continuity/六个既定文件 | source-local cursor/duplicate/gap/CAS；跨端只刷新正式材料；离线不重发；重启重新资格 |
| ProjectNavigation/Detail、ProjectContextCoordinator | code | 03 §5.3/7.6.1～2/7.10.1/8.6/8.10/9.5 | src/collaboration/project_*；pages/project_list_page.tsx、project_detail_page.tsx | 项目列表→同项目五tab（overview/progress/chats/work/evidence）；选任务进入progress上下文；不另造顶层进度 |
| ProcessFlow/NodeDetail、ProcessDrilldownCoordinator、readonly renderer/list/node panel | code | 03 §5.3/7.6.3～5/8.6/9.5 | src/collaboration/process_*；components/read_only_process_renderer.tsx、process_node_detail_panel.tsx | 整体→阶段子图→节点独立授权；BPMN event/task/gateway/edge与分支/汇聚/循环来自Process；图/list/ARIA同安全集合 |
| ProjectConversationLink/CompanyDirectory、DirectoryCoordinator/成员上下文 | code | 03 §5.3/7.6.6～8/7.10.2/8.6/8.10/9.5 | src/collaboration/project_conversation_link_view_model.ts、company_directory_view_model.ts、directory_coordinator.ts；components/project_conversation_links.tsx、pages/company_directory_page.tsx | 一群至多一项目、多群同项目不同Participant；关系与target access各验；公司人员/provider覆盖与ProjectMember/Participant三集合不混合 |
| SdkCapabilityBinding与query/command/change/reference/diagnostic adapter | code/跨仓协作 | 03 §5.7/7/13；SDK/owner当前正式contract | src/sdk/六个既定文件；仅@quantalithos/sdk正式exports | blocked/disabled零业务IO；formal export/error/result/cursor/safe locator/source逐operation证实，真实层TC独立 |
| PlatformPort/Capability/生命周期/AT、Web-preview/DesktopAdapter | code | 03 §5.8/7.5/7.7.6/9.8；04；05 §8/10 | src/platform/七个既定文件；src-tauri/src/main.rs、lib.rs、platform.rs、capabilities/main.json | origin/window/kind来自trusted host；least authority；键盘/IME/focus/公告/zoom/reduced motion；preview不能证明native/AT |
| Typed ClientConfig/ConfigLoader | code/config | 03 §5.9/13；04 §3～13 | src/config/client_config.ts、config_loader.ts；approved有效profile输入 | 八域十四字段与strict/source/激活映射；memoryOnly及disabled不被配置绕开 |

### 4.3 测试、工具与证据交付物

| 交付物 | 类型 | 来源章节 | 预计落点 | 完成判定 |
|---|---|---|---|---|
| 8 TS/TSX测试入口与host测试入口 | test | 03 §15；05 §3/6/9 | tests/navigation_boundary_tests.ts、intent_result_tests.ts、continuity_recovery_tests.ts、persistence_boundary_tests.ts、presentation_accessibility_tests.tsx、sdk_binding_tests.ts、project_process_boundary_tests.tsx、directory_relationship_boundary_tests.tsx；src-tauri/tests/platform_boundary_tests.rs | 216唯一TC保持；每variant有真实runner/断言；host-unit TS/Rust联合分母；TC族存在不等参数全过 |
| 14合成fixture builders与2真实环境数据申请 | test/support | 05 §7.1 | tests/fixtures/context_builder.ts、state_matrix_rows.ts、config_builders.ts、process_material_builders.ts、directory_relationship_builders.ts、deferred_port_scheduler.ts、diagnostic_builders.ts、error_injection_builders.ts、safe_material_builders.ts、dependency_violation_samples.ts、presentation_builders.ts、redaction_sentinels.ts、report_schema_builders.ts；src-tauri/tests/fixtures/approved_policy_fixture.rs | 正式local schema/typed资格构造，无强转和fake-only状态；case隔离/清理；真实SDK/host数据不写credential |
| runner/profile/manifest配置 | test/config | 05 §4/6/8/9 | vitest.config.ts、playwright.config.ts；package scripts；scripts/gates/run_manifest.ts | proven runner实际执行；每TC/variant/source/scope一一映射；缺后序TC或真实层如实blocked |
| source依赖安全检查 | check | 03 §3/5.0；05 TC-SAFE-001 | scripts/checks/check_source_boundaries.ts；FX-boundary及tests/sdk_binding_tests.ts boundary分组 | 结构化AST检查实际import/IO；合成违反样例仅解析不执行 |
| gate入口与机器artifact writer/validator | script/check | 03 §4.6/15.5；05 §9/13.3～6 | scripts/gates/run_ci_gate.sh、run_manifest.ts、machine_artifacts.ts；scripts/checks/artifact_schema_checks.ts | 05 CLI原样；完整machine DTO非猜字段；RFC8785/JCS proven实现+sha256双digest；路径/materialize/分母fail-closed |
| 两次redaction检查 | script/check | 05 §9.3/13；06 §10/11 | scripts/checks/check_redaction.sh、redaction_policy.ts | 初次machine→候选报告→final；writer先脱敏；失败有限category/path不输出命中正文 |
| report generator与批准成熟度校验 | script/report | 05 §13；06 §10；07 §7 | scripts/reports/generate_reports.sh、report_writer.ts | index_shell不补EVdetail；full_ev完整16EV及不足；读取实际machine不造result |
| acceptance私有writer/reader/检查 | script/report | 06 §10.4～6/12～14 | scripts/reports/acceptance_writer.ts；scripts/checks/acceptance_schema_checks.ts；generate_reports既定入口 | chat.acceptance.v1仅私有报告；ExpectedInstance≠实际FileRef；nested digest、defect、E018前置审阅、六签署按正式06；writer不签署 |
| 实际run与报告（未来） | runtime/report | 05 §13/06 §10 | artifacts/test/<run_id>、reports/runs/<run_id>、reports/acceptance/、reports/review/ | 只在授权run、成熟度/ACL/保留批准后实际生成，same-run/schema/digest/redaction/审阅有效 |
| lock/build/release与交付说明（未来） | build/doc | 03 §3/4；04 §12；06 §3/14 | package-lock.json、src-tauri/Cargo.lock；实现仓README.md、reports/README.md及获批准发布位置 | resolver实产、来源/精确兼容版本批准；代码hash/实际checks/未跑test/blocker和批准release记录 |

这些support脚本只实现既有schema与runner/report连接，不新增owner API、domain字段或业务transport。其exact paths在§6分配；schema或工具参数若需变化先回正式设计，不能靠support helper填入缺失truth。

### 4.4 非交付物与跨仓边界

不交付Conversation/Turn/Participant、Project/WorkItem、GlobalMember/ProjectMember/Runtime、Gate/Decision、Artifact/Workspace、ProcessInstance/Activity/Token/Gateway的truth store、API、UoW/outbox或server projection；不交付内部bus consumer、BFF、Bridges平台映射、Runtime推理、Tools执行或Observability backend。safe node摘要中的工单、Agent/tool、commit/test只读正式owner材料，不自动执行或证明完成。

V1仅Desktop；Mobile保留适配方向，不创建mobile包、driver、platform实现或发布gate。本地持久化仅memory合法fallback，durable/crypto/storage插件、通知/托盘/任意URL/shell/file权限均未获闭合，不进入当前交付。

跨仓唯一编译入口是SDK TS package；owner/runtime/Process/directory/关系/观测是SDK正式runtime/event/ref合作，不改其仓库。新增正式public能力由owner/SDK另行闭合，再受控刷新Chat基线；当前可设计unavailable与typed fixture的local scope，不能宣称业务集成已完成。

## 8. 回填草稿

正式07 §4仅回填本步§7已收口结论，过程审计留本文件；不得新增未校准phase/boundary或证据结论。

## 9. 待确认事项

CHAT-UP001～009、WS-UP001～008、CHAT-BASE001、SDK/Process/provider、native/OS/AT、质量预算/版本/source/release/归档继续open/blocked；实现授权与approved07 commitbaseline均waiting。实际实现、build/run/EV、接受与签署不存在。本地结构闭口不关闭真实集成blocker。

## 10. 自检及下一Step门禁

03所有模块/九测试入口、05十六合成/真实数据族与16suite、三脚本、06私有验收writer均可回源；非交付/跨仓边界明确且没有真实产物。 本步只作设计/文档静态检查，不是应用测试或readiness。本地门禁通过后仅允许Step5读取对应规范和来源。
