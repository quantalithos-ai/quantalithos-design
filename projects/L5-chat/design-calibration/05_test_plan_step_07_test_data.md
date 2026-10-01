# L5-chat 05 · Step 7 测试数据设计

## 1. Step状态

> done / pass_with_upstream_blockers；2026-10-01。全部用例/证据/路径均planned，未执行。

## 2. 本步输入

已通过Step6；05 SOP Step7与书写规范5.7；03 Step16、04 §12；真相源§2.15/§7。复杂cut逐个收口，前序gate成立才创建本文件。

## 3. SOP问题回答

基础、边界、异常、并发、恢复如何可重复/隔离/清理？§7逐builder回答；mock/stub只本地合同，real必须正式环境。

## 4. 当前文档问题诊断

没有typed builders/row分母与scope隔离时fake authority容易污染production证据；并发靠sleep不稳定。

## 5. 改动前后对比

| 改前 | 改后 | 原因 |
|---|---|---|
| 没有typed builders/row分母与scope隔离时fake authority容易污染production证据；并发靠sleep不稳定。 | 本步§7结构化结论 | 防止历史设计与当前owner合同分叉 |

## 6. 设计取舍与复杂度

合成fixture通过测试scope正规factory，real数据仅申请计划，优于生产数据复制。按16dataset串行审查生成与清理；表附具体TC。

## 7. 结构化中间产物

### 7.1 数据集逐cut设计

所有以下路径是未来实现仓planned测试support位置，不在设计仓创建。每dataset按合成基础→boundary/异常→调度恢复→隔离→清理小循环。禁止 `as QualifiedMaterial` 或validated=true绕过资格。

| 数据集 | 类型/用途 | planned builder | 构造 | 负向/边界 | 隔离/清理 | 关联TC |
|---|---|---|---|---|---|---|
| FX-context | 基础+异常 | tests/fixtures/context_builder.ts | typed session/fence、独立source A/B与原slot S1/S2；fresh immutable root；正式schema经仅测试scope mapper/registry构造 | 缺actor/session/scope/visibility、旧epoch/旧slot/跨source；空页≠不存在；ordinary ACK与formal result分开 | case instance / FX-context / device / source / query generation；dispose listener、registry清空、memory map清空；无磁盘 | TC-PROTO-001, TC-PROTO-002, TC-PROTO-003, TC-PROTO-004, TC-PROTO-005, TC-PROTO-006, TC-PROTO-007, TC-PROTO-008, TC-PROTO-009, TC-PROTO-010, TC-PROTO-011, TC-PROTO-012, TC-PROTO-013, TC-PROTO-014, TC-PROTO-015, TC-PROTO-016, TC-PROTO-017, TC-PROTO-018, TC-PROTO-019, TC-PROTO-020, TC-PROTO-021, TC-PROTO-022, TC-PROTO-023, TC-PROTO-024, TC-PROTO-025, TC-PROTO-026, TC-PROTO-027, TC-PROTO-028, TC-PROTO-029, TC-PROTO-030, TC-PROTO-031, TC-PROTO-032, TC-PROTO-049, TC-PROTO-050, TC-PROTO-051, TC-PROTO-052, TC-PROTO-053, TC-PROTO-054, TC-PROTO-055, TC-PROTO-056, TC-PROTO-057, TC-PROTO-058, TC-PROTO-059, TC-PROTO-060, TC-PROTO-061, TC-PROTO-062, TC-PROTO-067, TC-PROTO-068, TC-PROTO-069, TC-PROTO-070, TC-PROTO-071, TC-PROTO-072, TC-PROTO-073, TC-PROTO-074, TC-PROTO-075, TC-PROTO-076, TC-PROTO-077, TC-PROTO-078, TC-PROTO-079, TC-PROTO-080, TC-SAFE-002, TC-SAFE-003, TC-AT-005 |
| FX-state | 状态+guard | tests/fixtures/state_matrix_rows.ts | 冻结03 §9每主体合法row/guard/非法row，显式variant id包含subject/from/to/guard/ordinal；factory以实际入口初始化 | 所有列出合法行/From-To多值；逐guard删除/不匹配；枚举未列迁移；sharedenum主体分别建 | case instance / FX-state / device / source / query generation；每row新composition；禁止生产测试后门 | TC-STATE-001, TC-STATE-002, TC-STATE-003, TC-STATE-004, TC-STATE-005, TC-STATE-006, TC-STATE-007, TC-STATE-008, TC-STATE-009, TC-STATE-010, TC-STATE-011, TC-STATE-012, TC-STATE-013, TC-STATE-014, TC-STATE-015, TC-STATE-016, TC-STATE-017, TC-STATE-018, TC-STATE-019, TC-STATE-020, TC-STATE-021, TC-STATE-022, TC-STATE-023, TC-STATE-024, TC-STATE-025, TC-STATE-026, TC-STATE-027, TC-STATE-028, TC-STATE-029, TC-STATE-030, TC-STATE-031, TC-STATE-032, TC-STATE-033, TC-STATE-034, TC-STATE-035, TC-STATE-036, TC-STATE-037, TC-STATE-038, TC-STATE-039, TC-STATE-040, TC-STATE-041, TC-STATE-042, TC-STATE-043, TC-STATE-044, TC-STATE-045, TC-STATE-046, TC-STATE-047, TC-STATE-048, TC-STATE-049, TC-STATE-050, TC-STATE-051 |
| FX-config | 边界+异常 | tests/fixtures/config_builders.ts | 04批准8模块示例为合成输入，经strict loader得到flat14；各limit按04min/max±1 | duplicate text而非对象覆盖；getter有执行计数；8域/11required叶逐缺；六profiles各自crossfield；UTF16emoji | case instance / FX-config / device / source / query generation；清source/repo与config fixture，示例无credential | TC-CFG-001, TC-CFG-002, TC-CFG-003, TC-CFG-004, TC-CFG-005, TC-CFG-006, TC-CFG-007, TC-CFG-008, TC-CFG-009, TC-CFG-010, TC-CFG-011, TC-CFG-012, TC-CFG-013, TC-CFG-014, TC-CFG-015, TC-CFG-016, TC-CFG-017, TC-CFG-018, TC-CFG-019, TC-CFG-020, TC-CFG-021, TC-CFG-022, TC-CFG-023, TC-CFG-024 |
| FX-process | 基础+边界+恢复 | tests/fixtures/process_material_builders.ts | 来源Process整体graph G1、stage子图SG1、node N1，每图独立parent版本；fork两branch、join、循环edge、独立GovernanceGate | 隐藏node及所有关联edge先safe裁剪；G2使SG1/N1失效；edges>nodes有效图；超限不得残图ready；tool/commit/test仅safe摘要 | case instance / FX-process / device / source / query generation；断言graph/list/ARIA同集合、清parent-childrefs与内存缓存 | TC-PROTO-033, TC-PROTO-034, TC-PROTO-035, TC-PROTO-036, TC-PROTO-037, TC-PROTO-038, TC-PROTO-039, TC-PROTO-040, TC-PROTO-041, TC-PROTO-042, TC-PROTO-083, TC-PROTO-084, TC-SAFE-005, TC-AT-002 |
| FX-directory | 基础+异常 | tests/fixtures/directory_relationship_builders.ts | provider人类H1/AI A1、ProjectMembers P1/P2、Participants G1/G2三集合；群G1/G2同Project X，各成员不同；coverage独立 | 一个群两个project关系材料invalid；解除/target revoke；provider未知coverage；queryQ1→Q2旧cursor页；不可见人数不输出 | case instance / FX-directory / device / source / query generation；每provider/query代次隔离；clearpage/query缓存，无权限复用 | TC-PROTO-043, TC-PROTO-044, TC-PROTO-045, TC-PROTO-046, TC-PROTO-047, TC-PROTO-048, TC-PROTO-085, TC-PROTO-086, TC-SAFE-006 |
| FX-concurrency | 并发+恢复 | tests/fixtures/deferred_port_scheduler.ts | 具名deferred函数prepare/dispatch/query/probe/resume/delete/save；合成可控事件队列，无真实sleep | A→B、B→A、same turn；revoke/stopdeletefail；accepted change与watermark同CAS；consumed/context满 | case instance / FX-concurrency / device / source / query generation；release或abort所有pending；unsubscribe与计时器数归零 | TC-CONC-001, TC-CONC-002, TC-CONC-003, TC-CONC-004, TC-CONC-005, TC-CONC-006, TC-CONC-007, TC-CONC-008, TC-CONC-009, TC-CONC-010, TC-CONC-011, TC-CONC-012, TC-CONC-013, TC-CONC-014, TC-SAFE-009, TC-SAFE-010 |
| FX-diagnostic | 异常+观测 | tests/fixtures/diagnostic_builders.ts | requestId、sessionEpoch、category、reason、userRequested=true、platform六字段；批准mode/sink测试资格 | extra field、未显式user、wrongepoch、disabled、unbound sink、unknownreceipt | case instance / FX-diagnostic / device / source / query generation；清诊断stub计数，不记录payload；禁止自动retry | TC-PROTO-063, TC-PROTO-064, TC-PROTO-065, TC-PROTO-066, TC-PROTO-081, TC-PROTO-082 |
| FX-errors | 异常+边界 | tests/fixtures/error_injection_builders.ts | 15code按03生产入口注入；safe reason仅实际allowlist | unbound与unavailable分开；potential effect丢reply为unknown；原SDK消息/stack合成sentinel | case instance / FX-errors / device / source / query generation；清safe outputs/spy；不使用真实异常或secret | TC-ERROR-001, TC-ERROR-002, TC-ERROR-003, TC-ERROR-004, TC-ERROR-005, TC-ERROR-006, TC-ERROR-007, TC-ERROR-008, TC-ERROR-009, TC-ERROR-010, TC-ERROR-011, TC-ERROR-012, TC-ERROR-013, TC-ERROR-014, TC-ERROR-015 |
| FX-material | 安全+类型 | tests/fixtures/safe_material_builders.ts | 逐正式TurnType/ref/safe preview descriptor经factory；synthetic text与refs | 未知category/schema、unsafeURL/script、过期/撤销openRef；不给privatebody | case instance / FX-material / device / source / query generation；关闭preview、清refs/DOM，defaultmemoryOnly | TC-SAFE-008 |
| FX-boundary | 静态安全 | tests/fixtures/dependency_violation_samples.ts | 只合成AST违反规则示例用于扫描器selftest，正例approvedimport图 | UI直接SDK/网络、owner源码/privateAPI/bus、host持业务credential，runner不得真执行危险code | case instance / FX-boundary / device / source / query generation；解析不执行样例；移除临时扫描目录 | TC-SAFE-001 |
| FX-host | 技术边界 | src-tauri/tests/fixtures/approved_policy_fixture.rs | synthetic批准origin/window/kind与Lifecycle/Accessibility有限probe | emptyallowlist、未知origin/window/kind；safe_storage/controlled_open当前executionblocked | case instance / FX-host / device / source / query generation；释放测试host对象，无真实OS权限授予 | TC-SAFE-007 |
| FX-presentation | UI/AT | tests/fixtures/presentation_builders.ts | 只接safe props，graph/list、Turn、Gate、draft、source freshness各态组件 | IME、重复mount、窄窗、zoom、reducedmotion、revoke focus；hiddenlabels/counts | case instance / FX-presentation / device / source / query generation；unmount，resetfocus/media与browser context | TC-AT-001, TC-AT-003, TC-AT-004 |
| FX-redaction | 安全输出 | tests/fixtures/redaction_sentinels.ts | 纯合成固定sentinel如CHAT_TEST_SECRET_SENTINEL/CHAT_TEST_BODY_SENTINEL，不含真实secret | 通过candidate输出负向触发检查，只category/path报告；截图默认禁rawbody | case instance / FX-redaction / device / source / query generation；敏感candidate不归档；失败仅保留脱敏摘要 | TC-SAFE-004, TC-REPORT-003 |
| FX-report | 证据+失败 | tests/fixtures/report_schema_builders.ts | 只用于report脚本selftest的synthetic input；明确fixture/proof scope，不是实际run | 坏schema/path/digest/TC孤儿/crossrun/maturity；fakepass不能激活realEV | case instance / FX-report / device / source / query generation；清testonly临时目录；不写正式artifacts/reports | TC-REPORT-001, TC-REPORT-002, TC-REPORT-004, TC-REPORT-005, TC-REPORT-006, TC-REPORT-007 |
| FX-real-sdk | 真实依赖数据申请 | 未来正式测试环境，路径不保存credential | 批准owner testtenant/actor/scope/source、safe查询目标/关系/目录/流程；credential仅SDKformal session handle | 权限撤销/两device/幂等samekey及payload冲突须owner批准；当前无数据或绑定 | case instance / FX-real-sdk / device / source / query generation；owner按正式合同清理测试数据，Chat不直删DB；设备session销毁 | TC-REAL-001, TC-REAL-004 |
| FX-real-host | 真实宿主数据申请 | 未来批准OS/build/AT环境 | 签名/来源/nativeallowlist/版本与OS许可外部凭据，只记录安全引用；当前blocked | 实际键盘/读屏/restart/offline/IPC/当前disabled能力；不录屏泄露 | case instance / FX-real-host / device / source / query generation；关闭窗口、清session，遵守批准环境清理与证据保留政策 | TC-REAL-002, TC-REAL-003 |

### 7.2 资格与隔离

测试scope注册器只accept test-only authority，production SDKbinding拒绝测试token/registry。共用正式factory解析合成raw输入→qualified safe材料，但proof_scope强制isolated_fixture；不得提供全局“信任fake”开关。TypeScript test support不得进入appproduction bundle/export，AST gate检查导入图。
real_sdk必须正式public SDK runtime、正式actor/session与各owner qualified资料；两个device各root/source/slots隔离，local CAS不模拟server事务。禁止测试stub确认真实attempt。

全部fixture deterministic：case ID+variant ordinal生成局部ID，时钟由注入clock，显式deferred release顺序。不写真实姓名/项目/secret、不复制/tmp原型内容作为formal topology。
DOM、ARIA、breadcrumb、列表计数、诊断、error及report使用同safe素材；禁止body/secret进入截图、失败diff、console/stdout/stderr。失败debug只有限code/合成variant/count，redaction自身错误也不得echo原材料。

### 7.3 撤销与恢复数据

当前scope正式revoke作用于已闭node、selected preview和缓存材料，不要求旧node active slot才hide。hide/invalidate同步先于stop/delete；故障数据stopfailed/deletefailed后仍不能恢复可见。
source A cursor与B cursor故意不相同格式、不排序；gap覆盖0/partial/complete，unknown probe区分not_found与正式no_effect proof；无正式window合同即blocked。memoryOnly测试重启不期待durable draft/confirmed或旧access恢复。

## 8. 回填草稿

正式05 §7回填本步§7全部表、步骤和schema。

## 9. 待确认事项

CHAT-UP001～009、WS-UP001～008、CHAT-BASE001、native/生产预算/版本兼容/质量仍open或blocked。真实正向不得由fixture解除。无当前测试结果、EV或readiness。

## 10. 自检与下一Step门禁

16数据集覆盖216TC及参数实例；合成与正式资格分开，无seed/真实secret/测试代码。 本地设计gate pass_with_upstream_blockers；进入Step8，先读本产物/台账与对应SOP。
