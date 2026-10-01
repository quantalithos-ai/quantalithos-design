# L5-chat 07 · Step 8 配置、环境与外部依赖准备

## 1. Step状态

> done / gate_status=pass（仅设计/文档静态门禁）；2026-10-02。implementation仍planned/blocked/waiting，无实际实现或测试结果。

| field | value |
|---|---|
| gate_status | pass |
| gate_reason | 本步设计规则、来源及最终跨文档静态闭环检查通过；不关闭上游blocker，不是implementation gate结果 |
| next_allowed_action | Step9已按本轮连续授权执行；07最终停点见flow，不能据此进入代码实施 |
| source_files | 本步§2/§7所列正式00～06、对应规范与前序Step；[07flow](07_implementation_plan_calibration_flow.md)、[项目台账](project_execution_ledger.md) |


## 2. 本步输入

前序Step7已done、07flow/项目台账与对应来源；07 SOP Step8、书写规范5.8；中间产物§5.10、真相源§7/§9和实施台账规范。

## 3. SOP问题回答

compile仅SDKfile与已定UI/host工具；owner是SDKruntime/event/ref。六profile的资格/十四字段检查与角色明确；fixture仅isolated scope，不替actualSDK/native/AT；缺formalcontract安全blocked。

## 4. 当前文档问题诊断

包存在、alias合法和candidateOS不代表export/profile/native/AT可用；不能给所有运行依赖加Cargo path。

## 5. 改动前后对比

| 改前 | 改后 | 原因 |
|---|---|---|
| 包存在、alias合法和candidateOS不代表export/profile/native/AT可用；不能给所有运行依赖加Cargo path。 | 本步§7收口规则 | 阶段/门禁可执行且不伪造事实 |

## 6. 设计取舍

依赖逐提供方/阶段/协作方式/检查/失败列出，精确版本与生产预算保持待批准；SDK0.1仅读取事实，baseline/环境与真实证明独立。

## 7. 结构化中间产物

### 8.1 外部依赖与阶段准备

| 依赖 | 类型/全局依赖类型 | 使用阶段/提供方 | 本地路径/正式协作方式 | 检查 | 不可用处理 |
|---|---|---|---|---|---|
| SDK TS package | repo / 编译 | PH01包源检查、PH07formal绑定；L0-sdk | /home/aris/Projects/quantalithos-sdk/packages/typescript；file:../quantalithos-sdk/packages/typescript | private @quantalithos/sdk@0.1.0仅骨架事实；读package/barrel/dist/types与exactpublicexports，版本/来源兼容 | 本地shape/fixture可检安全失败；缺编译材料暂停受影响build，缺formal能力blockedadapter，不深链src |
| Conversation/Turn/Participant/session | service / runtime+event | PH02～05local合同；PH07actual；L1-conversation/L0-sdk | SDK Entry/Collaboration/Command/Probe/Change/Resume ports | actor/scope/visibility、pagination、幂等authority、source cursor/coverage、result/error | CHAT-UP001/002；unknown只probe；无私有HTTP/WS ACK成功 |
| Governance | service / runtime+event | PH03/04local；PH07actual；L1-governance | SDK Gate safe material与受控IntentCommand/Probe | action/capability/reason/association/receipt/result及权限撤销 | CHAT-UP003；GateCard显示与操作独立，点击不confirm |
| Artifact | service / runtime/ref | PH03local；PH07actual；L1-artifact | SDK safe ref/preview/locator | version/visibility/open资格/安全descriptor与正式locator | CHAT-UP004；preview blocked，不拼URL/body/持久化handle |
| Work/Workspace | service / runtime+event | PH03/06local；PH07actual；L1-work/L1-workspace | SDK readProject/List/Detail/summary/safe view | 项目/进度/section source/freshness；WS-UP001～008当前消费合同 | CHAT-UP005/006与WS-UP；局部partial/stale/unavailable，不client汇聚truth |
| Identity/Member/Runtime | service / runtime+event | PH03/06local；PH07actual；L1-identity/L2-member/L2-runtime | SDK安全summary/readMemberContext | GlobalMember身份、ProjectMember作用域、Participant、在场/run source独立 | CHAT-UP006；不runtime推目录、不指令执行/Tools |
| Process整体/stage/node | service / runtime+event | PH06local；PH07actual；L1-process经SDK | SDK三个Process safe read及正式change/resume | topology/state/parentversion/branch/join/loop/association及node独立section access | CHAT-UP008；无合同时blocked，不Work/log推图 |
| 项目↔群聊关系、公司目录 | service / runtime+event | PH06local；PH07actual；正式owner/provider待确认 | SDK links/directory/member/search分页 | 一群≤一项目、多群及成员差异；逐target access、coverage/人类AI/provider/querylineage | CHAT-UP009；未知providercoverage不能显示公司全员已完整 |
| 低敏diagnostic/handoff | service / runtime | PH05local；PH07资格；L4-observability经SDK | SDK DiagnosticPort，仅批准finite六字段 | explicituser/currentepoch/mode/formalsink/receiptfailure，无rawlog | CHAT-UP007；默认disabled零IO；unknown不自动重送 |
| Node/npm/TS/React/Vite/test/JCS/crypto | tool / 编译及验证 | PH01起；发布/工具来源批准方 | 实现仓resolver/lock，JS/TS public APIs，RFC8785经核验实现 | 精确版本、license/source/兼容、package scripts、lock真实解析 | waiting；不虚构pin或安装成功，受影响boundary暂停 |
| Rust/Tauri2/host/WebView | tool/host / 编译+runtime | PH08；native负责人/OS批准方 | src-tauri host only；trusted IPC Lifecycle/Accessibility probe | toolchain锁定/来源、trusted origin/window/kind、main capability最小许可 | blocked；未批准不能hostavailable或添safe_storage/controlled_open执行 |
| Desktop/AT矩阵 | environment / actual验证 | PH08；环境/AT operator | Windows/NVDA、macOS/VoiceOver、Linux/Orca仅候选 | OS/AT/WebView/source/build exact批准与实际操作 | blocked；Web/axe/fake不替实际AT |
| CI/artifact保留/访问/release | environment/policy / 验证交付 | PH01工具后逐级；PH09/10真实归档/交付 | approved CI roots/ACL/retention/sourcepolicy | sanitized输出、容量/保留/删除/访问职责、不可覆盖run和审阅角色 | release/正式归档blocked，不任意设30天/永久预算 |
| core/bus/owner仓/Bridges | 禁止直接依赖 | 全phase | 无npm/Cargo path、topic/offset或private API；Bridges仅边界参考 | source AST与manifest检查 | 不提供fallback；未来变更先回正式设计 |

Chat native host不引用任何Quantalithos sibling Cargo crate；所有owner仓可以阅读正式设计，但不作为直接源码依赖。跨仓public能力新增由owner/SDK闭合，当前本轮不修改上游。中期SDK private tag/rev只在获批准后替换file且重测全部消费能力。

### 8.2 六profile与有效配置

| profile | 计划用途/phase | 资格/检查 | 缺失/失败 |
|---|---|---|---|
| desktop-local | PH01～06local安全fail-closed；future本机 | platform=desktop，批准非空hostalias；SDKalias结构合法≠bound | 无真实SDK/host许可保持blocked；isolatedharness非productpositive |
| desktop-ci | 同格式immutable fixture；local/guard/report | 13local suite分层、TS/Rusthost-unit联合分母；noactor/credential | 缺后序variant完整PRblocked；不能nativeactualpass |
| desktop-staging | PH07～10formalSDK/native/AT | 各operation能力及exactsource/permissions与env批准 | 缺contract/OS/AT/版本预算即blocked，不fixture替代 |
| desktop-prod | PH10 future批准release/smoke | production来源/签名/支持矩阵/预算/保留ACL | 当前不部署/连接prod；无推荐确值 |
| web-preview-local | PH03起共享UI/独立harness | platform=web_preview、hostProfileRef=null，无nativeopen/storage | 不代Desktop；代码仍SDK-only |
| web-preview-ci | component/Web/ARIA逻辑 | safe fixture或formalSDK分别scope，候选browser经批准 | 不替staging/release/native/manualAT |

04八域十四叶子全startup immutable；八域必填，三个安全叶schemaVersion=1/memoryOnly=true/diagnosticMode=disabled可缺省，其余11叶required。八numeric以04范围/JS UTF16单位严格校验，超限拒绝不clamp；示例非production测量预算。alias仅非敏感catalog标识符，不是URL/path/permission，nativepolicy单独由trustedhost来源。

| 配置/环境检查 | 承接source/消费者 | 实施准备/失败 |
|---|---|---|
| app schemaVersion/platform | 03 ClientConfig/04 app | unknown/extra/duplicate/prototype/accessor/版本拒绝，invalid_input不partialactivate |
| sdk profileRef | binding→SDK正式catalog | 结构合法后还需formalregistry/exports，缺即dependency_unbound |
| hostProfileRef | DesktopAdapter/NativeGuard | desktop非空，previewnull；trustedorigin/window不由JSON授予 |
| intents maxTextUnits/maxAttachmentRefs | DraftPolicy/冻结input | 04范围/UTF16；本地通过不等owner可发送 |
| memoryOnly/maxCachedEntries | PersistenceSafetyGuard/MemoryRepo/page | literaltrue；分页limit同上限，safe有界，不打开durable |
| maxConsumedChanges/maxConsumptionContexts | reducer/slotregistry | 达限失效source/slot后重取，不忘身份继续fresh |
| directory/node/edge预算 | safe search/Processfactory/renderer | hidden不计/不露总数；edges不强制≤nodes；超限图/list不残图ready |
| diagnosticMode | 六字段factory/正式sink | 默认disabled；formal_low_sensitivity同时需explicituser和正式sink，不自动retry |
| exactversions/source/locks | npm/Rust/Tauri/JCS/SDK/tooling | future resolver实产；待批准值不得写成已锁/兼容测试通过 |
| credential/session | SDK/OS正式provider | 不进入Chat config/store/fixture/reports，轮换由owner，Chat新epoch重新资格 |
| output roots/ACL/retention | 05/06 machine/reportreview | 任一未批releaseblocked；无rawsecret候选归档或latest |

启动/配置变更按04执行：LocalConfigSource一次读取→strictvalidate→platform/profile资格→SDKbinding/session→immutableinit/store/memory→coordinators→订阅；profile变更新composition/epoch，invalidate/hide→unsubscribe/cancelreads→clear memory；postdispatch取消不证明owner无effect。完整装配激活遵§6.1的06-c停点，不制造partialconstructor。

### 8.3 fake与真实能力边界

PH01～06及其它phase的isolated_fixture regression可用05 FX-*的typed test composition/registry；只在tests建立synthetic资格，body-free字段与collection/empty/失败/版本规则和正式local契约一致。禁止生产入口as QualifiedMaterial、validated=true或fake-only枚举；fixture不能替formalSDK publicexport、owner权限/resultauthority/cursor、safe locator/nativeorigin或actualAT。

sdk-real永远formal_sdk；desktop-real永远native_host；at-real永远manual_at；localunit永远isolated_fixture。failed/blocked不能因fixture通过转真实passed；unboundadapter必须零IO，已有formalread短暂失效dependency_unavailable，未发生effect可安全失败，已可能dispatch则effect_unknown。没有formalstore/durable/source不能新建driver补位。

各phase完成开工环境核验才激活boundary；环境记录只安全versions/profile/sourcepolicy引用，不采username/host路径/token/正文。profile/source/版本变更重审requiredscope并新run；不得用配置开关重试unknown、跳visibility/currentfence、恢复hidden或发布未经审阅材料。

## 8. 回填草稿

正式07 §8仅回填本步§7已收口结论，过程审计留本文件；不得新增未校准phase/boundary或证据结论。

## 9. 待确认事项

CHAT-UP001～009、WS-UP001～008、CHAT-BASE001、SDK/Process/provider、native/OS/AT、质量预算/版本/source/release/归档继续open/blocked；实现授权与approved07 commitbaseline均waiting。实际实现、build/run/EV、接受与签署不存在。本地结构闭口不关闭真实集成blocker。

## 10. 自检及下一Step门禁

六profile/十四字段/三缺省/十一required、SDK相对file、owner no-path、TS/native分域、fixture/real scopes与05/06一致，未生成任何config/lock/环境run。 本步只作设计/文档静态检查，不是应用测试或readiness。本地门禁通过后仅允许Step9读取对应规范和来源。
