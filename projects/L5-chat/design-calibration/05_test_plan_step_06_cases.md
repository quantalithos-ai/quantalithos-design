# L5-chat 05 · Step 6 测试场景与用例设计

## 1. Step状态

> done / pass_with_upstream_blockers；2026-10-01。全部用例/证据/路径均planned，未执行。

## 2. 本步输入

已通过Step5；05 SOP Step6与书写规范5.6；03 Step16、04 §12；真相源§2.15/§7。复杂cut逐个收口，前序gate成立才创建本文件。

## 3. SOP问题回答

每P0如何执行、用何数据、断言什么、何层留证？§6逐ID动作/前置/断言/来源/自动化；无ownerUoW，CAS失败全不写代替客户端事务回滚测试。

## 4. 当前文档问题诊断

旧05未给每协议异常、状态矩阵guard、配置精确边界、unknown调度和machine报告失败用例。

## 5. 改动前后对比

| 改前 | 改后 | 原因 |
|---|---|---|
| 旧05未给每协议异常、状态矩阵guard、配置精确边界、unknown调度和machine报告失败用例。 | 本步§7结构化结论 | 防止历史设计与当前owner合同分叉 |

## 6. 设计取舍与复杂度

按43协议→17主体→12配置→14竞态→15错误→全局安全/AT/report/real七族串行小循环。状态源完整合法矩阵保留；非法组合全枚举，不以表格计数冒充覆盖率。成熟工具参数化，不实现runner。

## 7. 结构化中间产物

### 6.1 通用执行规约

下列每一个case ID都是planned P0。执行器将参数行展开为独立case instance（TC ID + variant_id），不得只运行一条代表。先fresh composition→注入唯一fixture scope→建立当前actor/session/scope/source/fence/原request slots→执行列中顺序→读取root/port调用记录/安全DOM→检查字段和副作用→销毁。测试side-channel只记录调用名/有限计数/合成数据身份，不输出body/secret。

协议positive使用隔离测试scope正规factory/mapper/qualification入口，不能用类型断言铸造production QualifiedMaterial。真实layer用TC-REAL独立验证，fixture不证明SDK接通。
所有异步material patch在应用时检查root版、当前fence与**所有原始slots**，失败不得更新slice、accepted change、watermark或权限。local repo版/fence检查与mutation同JS turn；同步用户导航本身不是业务IO。
Outcome失败断言03同名卡定义code（§11），不从文本推断；已发生可能effect的异常保守unknown，零second dispatch。纯读guard失败零effect；hide/invalidate是安全收紧允许写入，不把其误判为“失败root完全不变”。

### 6.2 43协议逐cut场景

每小循环按来源→正向动作/断言→异常参数/断言→层/数据/预约证据→local gate；继承§6.1共用前置。所有表均planned。EV-CAND-<suite>是设计预约，不是artifact。

#### 6.2.1 SubmitConversationIntent

来源：03 §7/§8 SubmitConversationIntent；CUT-P-01。数据：FX-context；suite：intent；预约证据：EV-CAND-intent。

| 用例ID | 场景/优先级 | 前置 | 输入/操作 | 预期/断言 | 自动化 |
|---|---|---|---|---|---|
| TC-PROTO-001 | 正向 P0 | §6.1；FX-context当前原slots；正式合同测试scope；必要dependency已注入 | 1 建立03同名typed input；2 调用SubmitConversationIntent；3 受控完成当前port返回；4 读root/DOM与计数 | 冻结当前draft→预留→单dispatch→formal confirmed，只清同revision；qualified/版本匹配，未触发其它owner effect | Vitest/typed port；展示补组件 |
| TC-PROTO-002 | 异常/边界 P0 | 同正向；每负向variant重建fixture | 1 分别注入以下失败：双击/IME/ACK/断线unknown，新稿不被旧确认清；2 执行同名flow；3 对late先推进context/slot再release旧返回 | 双击/IME/ACK/断线unknown，新稿不被旧确认清；匹配03错误/安全姿态，无越权披露/second dispatch；原slot不改为current | deferred port与负向参数集 |

本cut审查：正向与异常均有原context和effect计数观察；仅本地测试scope证据，不解除real binding blocker。

#### 6.2.2 SubmitGovernanceIntent

来源：03 §7/§8 SubmitGovernanceIntent；CUT-P-02。数据：FX-context；suite：intent；预约证据：EV-CAND-intent。

| 用例ID | 场景/优先级 | 前置 | 输入/操作 | 预期/断言 | 自动化 |
|---|---|---|---|---|---|
| TC-PROTO-003 | 正向 P0 | §6.1；FX-context当前原slots；正式合同测试scope；必要dependency已注入 | 1 建立03同名typed input；2 调用SubmitGovernanceIntent；3 受控完成当前port返回；4 读root/DOM与计数 | formal Gate/action capability→single dispatch→正式结果反馈；qualified/版本匹配，未触发其它owner effect | Vitest/typed port；展示补组件 |
| TC-PROTO-004 | 异常/边界 P0 | 同正向；每负向variant重建fixture | 1 分别注入以下失败：点击/transport不确认，Gate capability撤销/unknown不重发；2 执行同名flow；3 对late先推进context/slot再release旧返回 | 点击/transport不确认，Gate capability撤销/unknown不重发；匹配03错误/安全姿态，无越权披露/second dispatch；原slot不改为current | deferred port与负向参数集 |

本cut审查：正向与异常均有原context和effect计数观察；仅本地测试scope证据，不解除real binding blocker。

#### 6.2.3 RequestSafePreview

来源：03 §7/§8 RequestSafePreview；CUT-P-03。数据：FX-context；suite：presentation；预约证据：EV-CAND-presentation。

| 用例ID | 场景/优先级 | 前置 | 输入/操作 | 预期/断言 | 自动化 |
|---|---|---|---|---|---|
| TC-PROTO-005 | 正向 P0 | §6.1；FX-context当前原slots；正式合同测试scope；必要dependency已注入 | 1 建立03同名typed input；2 调用RequestSafePreview；3 受控完成当前port返回；4 读root/DOM与计数 | 正式无effect安全preview query；qualified/版本匹配，未触发其它owner effect | Vitest/typed port；展示补组件 |
| TC-PROTO-006 | 异常/边界 P0 | 同正向；每负向variant重建fixture | 1 分别注入以下失败：有副作用能力/未bound/hidden禁止open；2 执行同名flow；3 对late先推进context/slot再release旧返回 | 有副作用能力/未bound/hidden禁止open；匹配03错误/安全姿态，无越权披露/second dispatch；原slot不改为current | deferred port与负向参数集 |

本cut审查：正向与异常均有原context和effect计数观察；仅本地测试scope证据，不解除real binding blocker。

#### 6.2.4 AcknowledgeLocalRecoveryAction

来源：03 §7/§8 AcknowledgeLocalRecoveryAction；CUT-P-04。数据：FX-context；suite：continuity；预约证据：EV-CAND-continuity。

| 用例ID | 场景/优先级 | 前置 | 输入/操作 | 预期/断言 | 自动化 |
|---|---|---|---|---|---|
| TC-PROTO-007 | 正向 P0 | §6.1；FX-context当前原slots；正式合同测试scope；必要dependency已注入 | 1 建立03同名typed input；2 调用AcknowledgeLocalRecoveryAction；3 受控完成当前port返回；4 读root/DOM与计数 | current source下允许resume/requery/probe/clear；qualified/版本匹配，未触发其它owner effect | Vitest/typed port；展示补组件 |
| TC-PROTO-008 | 异常/边界 P0 | 同正向；每负向variant重建fixture | 1 分别注入以下失败：非法action或unknown resend拒绝；2 执行同名flow；3 对late先推进context/slot再release旧返回 | 非法action或unknown resend拒绝；匹配03错误/安全姿态，无越权披露/second dispatch；原slot不改为current | deferred port与负向参数集 |

本cut审查：正向与异常均有原context和effect计数观察；仅本地测试scope证据，不解除real binding blocker。

#### 6.2.5 ResolveEntryAccess

来源：03 §7/§8 ResolveEntryAccess；CUT-P-05。数据：FX-context；suite：navigation；预约证据：EV-CAND-navigation。

| 用例ID | 场景/优先级 | 前置 | 输入/操作 | 预期/断言 | 自动化 |
|---|---|---|---|---|---|
| TC-PROTO-009 | 正向 P0 | §6.1；FX-context当前原slots；正式合同测试scope；必要dependency已注入 | 1 建立03同名typed input；2 调用ResolveEntryAccess；3 受控完成当前port返回；4 读root/DOM与计数 | group/channel/dm/thread与项目/目录入口正式资格解析；qualified/版本匹配，未触发其它owner effect | Vitest/typed port；展示补组件 |
| TC-PROTO-010 | 异常/边界 P0 | 同正向；每负向variant重建fixture | 1 分别注入以下失败：深链伪actor/无parent/旧epoch/hidden不泄露；2 执行同名flow；3 对late先推进context/slot再release旧返回 | 深链伪actor/无parent/旧epoch/hidden不泄露；匹配03错误/安全姿态，无越权披露/second dispatch；原slot不改为current | deferred port与负向参数集 |

本cut审查：正向与异常均有原context和effect计数观察；仅本地测试scope证据，不解除real binding blocker。

#### 6.2.6 LoadConversationSurface

来源：03 §7/§8 LoadConversationSurface；CUT-P-06。数据：FX-context；suite：presentation；预约证据：EV-CAND-presentation。

| 用例ID | 场景/优先级 | 前置 | 输入/操作 | 预期/断言 | 自动化 |
|---|---|---|---|---|---|
| TC-PROTO-011 | 正向 P0 | §6.1；FX-context当前原slots；正式合同测试scope；必要dependency已注入 | 1 建立03同名typed input；2 调用LoadConversationSurface；3 受控完成当前port返回；4 读root/DOM与计数 | qualifiedsafe surface一次current CAS；qualified/版本匹配，未触发其它owner effect | Vitest/typed port；展示补组件 |
| TC-PROTO-012 | 异常/边界 P0 | 同正向；每负向variant重建fixture | 1 分别注入以下失败：切换会话后late response不覆写，hidden清refs；2 执行同名flow；3 对late先推进context/slot再release旧返回 | 切换会话后late response不覆写，hidden清refs；匹配03错误/安全姿态，无越权披露/second dispatch；原slot不改为current | deferred port与负向参数集 |

本cut审查：正向与异常均有原context和effect计数观察；仅本地测试scope证据，不解除real binding blocker。

#### 6.2.7 LoadTurnPage

来源：03 §7/§8 LoadTurnPage；CUT-P-07。数据：FX-context；suite：presentation；预约证据：EV-CAND-presentation。

| 用例ID | 场景/优先级 | 前置 | 输入/操作 | 预期/断言 | 自动化 |
|---|---|---|---|---|---|
| TC-PROTO-013 | 正向 P0 | §6.1；FX-context当前原slots；正式合同测试scope；必要dependency已注入 | 1 建立03同名typed input；2 调用LoadTurnPage；3 受控完成当前port返回；4 读root/DOM与计数 | SDK排序/page lineage正向，Turn类型安全分派；qualified/版本匹配，未触发其它owner effect | Vitest/typed port；展示补组件 |
| TC-PROTO-014 | 异常/边界 P0 | 同正向；每负向variant重建fixture | 1 分别注入以下失败：未知category/错cursor lineage/旧页/无限分页拒绝；2 执行同名flow；3 对late先推进context/slot再release旧返回 | 未知category/错cursor lineage/旧页/无限分页拒绝；匹配03错误/安全姿态，无越权披露/second dispatch；原slot不改为current | deferred port与负向参数集 |

本cut审查：正向与异常均有原context和effect计数观察；仅本地测试scope证据，不解除real binding blocker。

#### 6.2.8 LoadOwnerSummary

来源：03 §7/§8 LoadOwnerSummary；CUT-P-08。数据：FX-context；suite：presentation；预约证据：EV-CAND-presentation。

| 用例ID | 场景/优先级 | 前置 | 输入/操作 | 预期/断言 | 自动化 |
|---|---|---|---|---|---|
| TC-PROTO-015 | 正向 P0 | §6.1；FX-context当前原slots；正式合同测试scope；必要dependency已注入 | 1 建立03同名typed input；2 调用LoadOwnerSummary；3 受控完成当前port返回；4 读root/DOM与计数 | source provenance/freshness独立保持；qualified/版本匹配，未触发其它owner effect | Vitest/typed port；展示补组件 |
| TC-PROTO-016 | 异常/边界 P0 | 同正向；每负向variant重建fixture | 1 分别注入以下失败：raw body/跨owner版本/无visibility拒绝；2 执行同名flow；3 对late先推进context/slot再release旧返回 | raw body/跨owner版本/无visibility拒绝；匹配03错误/安全姿态，无越权披露/second dispatch；原slot不改为current | deferred port与负向参数集 |

本cut审查：正向与异常均有原context和effect计数观察；仅本地测试scope证据，不解除real binding blocker。

#### 6.2.9 LoadArtifactPreview

来源：03 §7/§8 LoadArtifactPreview；CUT-P-09。数据：FX-context；suite：presentation；预约证据：EV-CAND-presentation。

| 用例ID | 场景/优先级 | 前置 | 输入/操作 | 预期/断言 | 自动化 |
|---|---|---|---|---|---|
| TC-PROTO-017 | 正向 P0 | §6.1；FX-context当前原slots；正式合同测试scope；必要dependency已注入 | 1 建立03同名typed input；2 调用LoadArtifactPreview；3 受控完成当前port返回；4 读root/DOM与计数 | safe ref→正式preview descriptor；qualified/版本匹配，未触发其它owner effect | Vitest/typed port；展示补组件 |
| TC-PROTO-018 | 异常/边界 P0 | 同正向；每负向variant重建fixture | 1 分别注入以下失败：过期/撤销/unsupported清openRef，不拼URL；2 执行同名flow；3 对late先推进context/slot再release旧返回 | 过期/撤销/unsupported清openRef，不拼URL；匹配03错误/安全姿态，无越权披露/second dispatch；原slot不改为current | deferred port与负向参数集 |

本cut审查：正向与异常均有原context和effect计数观察；仅本地测试scope证据，不解除real binding blocker。

#### 6.2.10 LoadIntentCapability

来源：03 §7/§8 LoadIntentCapability；CUT-P-10。数据：FX-context；suite：intent；预约证据：EV-CAND-intent。

| 用例ID | 场景/优先级 | 前置 | 输入/操作 | 预期/断言 | 自动化 |
|---|---|---|---|---|---|
| TC-PROTO-019 | 正向 P0 | §6.1；FX-context当前原slots；正式合同测试scope；必要dependency已注入 | 1 建立03同名typed input；2 调用LoadIntentCapability；3 受控完成当前port返回；4 读root/DOM与计数 | 当前actor/scope/intent/Gate正式能力；qualified/版本匹配，未触发其它owner effect | Vitest/typed port；展示补组件 |
| TC-PROTO-020 | 异常/边界 P0 | 同正向；每负向variant重建fixture | 1 分别注入以下失败：缓存/host available不授予提交；2 执行同名flow；3 对late先推进context/slot再release旧返回 | 缓存/host available不授予提交；匹配03错误/安全姿态，无越权披露/second dispatch；原slot不改为current | deferred port与负向参数集 |

本cut审查：正向与异常均有原context和effect计数观察；仅本地测试scope证据，不解除real binding blocker。

#### 6.2.11 ProbeCommandAttempt

来源：03 §7/§8 ProbeCommandAttempt；CUT-P-11。数据：FX-context；suite：intent；预约证据：EV-CAND-intent。

| 用例ID | 场景/优先级 | 前置 | 输入/操作 | 预期/断言 | 自动化 |
|---|---|---|---|---|---|
| TC-PROTO-021 | 正向 P0 | §6.1；FX-context当前原slots；正式合同测试scope；必要dependency已注入 | 1 建立03同名typed input；2 调用ProbeCommandAttempt；3 受控完成当前port返回；4 读root/DOM与计数 | matched formal probe收敛unknown；qualified/版本匹配，未触发其它owner effect | Vitest/typed port；展示补组件 |
| TC-PROTO-022 | 异常/边界 P0 | 同正向；每负向variant重建fixture | 1 分别注入以下失败：not_found无no-effect仍unknown，错association拒绝；2 执行同名flow；3 对late先推进context/slot再release旧返回 | not_found无no-effect仍unknown，错association拒绝；匹配03错误/安全姿态，无越权披露/second dispatch；原slot不改为current | deferred port与负向参数集 |

本cut审查：正向与异常均有原context和effect计数观察；仅本地测试scope证据，不解除real binding blocker。

#### 6.2.12 LoadResumeContext

来源：03 §7/§8 LoadResumeContext；CUT-P-12。数据：FX-context；suite：continuity；预约证据：EV-CAND-continuity。

| 用例ID | 场景/优先级 | 前置 | 输入/操作 | 预期/断言 | 自动化 |
|---|---|---|---|---|---|
| TC-PROTO-023 | 正向 P0 | §6.1；FX-context当前原slots；正式合同测试scope；必要dependency已注入 | 1 建立03同名typed input；2 调用LoadResumeContext；3 受控完成当前port返回；4 读root/DOM与计数 | 当前单source恢复候选；qualified/版本匹配，未触发其它owner effect | Vitest/typed port；展示补组件 |
| TC-PROTO-024 | 异常/边界 P0 | 同正向；每负向variant重建fixture | 1 分别注入以下失败：跨source/cursor字符串排序/旧request拒绝；2 执行同名flow；3 对late先推进context/slot再release旧返回 | 跨source/cursor字符串排序/旧request拒绝；匹配03错误/安全姿态，无越权披露/second dispatch；原slot不改为current | deferred port与负向参数集 |

本cut审查：正向与异常均有原context和effect计数观察；仅本地测试scope证据，不解除real binding blocker。

#### 6.2.13 LoadLocalProjection

来源：03 §7/§8 LoadLocalProjection；CUT-P-13。数据：FX-context；suite：persistence；预约证据：EV-CAND-persistence。

| 用例ID | 场景/优先级 | 前置 | 输入/操作 | 预期/断言 | 自动化 |
|---|---|---|---|---|---|
| TC-PROTO-025 | 正向 P0 | §6.1；FX-context当前原slots；正式合同测试scope；必要dependency已注入 | 1 建立03同名typed input；2 调用LoadLocalProjection；3 受控完成当前port返回；4 读root/DOM与计数 | 同partition load含entry版/null；qualified/版本匹配，未触发其它owner effect | Vitest/typed port；展示补组件 |
| TC-PROTO-026 | 异常/边界 P0 | 同正向；每负向variant重建fixture | 1 分别注入以下失败：错partition不泄露存在性，cache不授权；2 执行同名flow；3 对late先推进context/slot再release旧返回 | 错partition不泄露存在性，cache不授权；匹配03错误/安全姿态，无越权披露/second dispatch；原slot不改为current | deferred port与负向参数集 |

本cut审查：正向与异常均有原context和effect计数观察；仅本地测试scope证据，不解除real binding blocker。

#### 6.2.14 LoadDraft

来源：03 §7/§8 LoadDraft；CUT-P-14。数据：FX-context；suite：persistence；预约证据：EV-CAND-persistence。

| 用例ID | 场景/优先级 | 前置 | 输入/操作 | 预期/断言 | 自动化 |
|---|---|---|---|---|---|
| TC-PROTO-027 | 正向 P0 | §6.1；FX-context当前原slots；正式合同测试scope；必要dependency已注入 | 1 建立03同名typed input；2 调用LoadDraft；3 受控完成当前port返回；4 读root/DOM与计数 | 当前context内存稿/root版；qualified/版本匹配，未触发其它owner effect | Vitest/typed port；展示补组件 |
| TC-PROTO-028 | 异常/边界 P0 | 同正向；每负向variant重建fixture | 1 分别注入以下失败：项目/目录伪Conversation/跨scope稿拒绝；2 执行同名flow；3 对late先推进context/slot再release旧返回 | 项目/目录伪Conversation/跨scope稿拒绝；匹配03错误/安全姿态，无越权披露/second dispatch；原slot不改为current | deferred port与负向参数集 |

本cut审查：正向与异常均有原context和effect计数观察；仅本地测试scope证据，不解除real binding blocker。

#### 6.2.15 ProbePlatformCapability

来源：03 §7/§8 ProbePlatformCapability；CUT-P-15。数据：FX-context；suite：host-unit；预约证据：EV-CAND-host-unit。

| 用例ID | 场景/优先级 | 前置 | 输入/操作 | 预期/断言 | 自动化 |
|---|---|---|---|---|---|
| TC-PROTO-029 | 正向 P0 | §6.1；FX-context当前原slots；正式合同测试scope；必要dependency已注入 | 1 建立03同名typed input；2 调用ProbePlatformCapability；3 受控完成当前port返回；4 读root/DOM与计数 | 四host能力各自probe姿态；qualified/版本匹配，未触发其它owner effect | Vitest/typed port；展示补组件 |
| TC-PROTO-030 | 异常/边界 P0 | 同正向；每负向variant重建fixture | 1 分别注入以下失败：假origin/旧window/无合同unknown，不授予业务权；2 执行同名flow；3 对late先推进context/slot再release旧返回 | 假origin/旧window/无合同unknown，不授予业务权；匹配03错误/安全姿态，无越权披露/second dispatch；原slot不改为current | deferred port与负向参数集 |

本cut审查：正向与异常均有原context和effect计数观察；仅本地测试scope证据，不解除real binding blocker。

#### 6.2.16 LoadAccessibilityContext

来源：03 §7/§8 LoadAccessibilityContext；CUT-P-16。数据：FX-context；suite：presentation；预约证据：EV-CAND-presentation。

| 用例ID | 场景/优先级 | 前置 | 输入/操作 | 预期/断言 | 自动化 |
|---|---|---|---|---|---|
| TC-PROTO-031 | 正向 P0 | §6.1；FX-context当前原slots；正式合同测试scope；必要dependency已注入 | 1 建立03同名typed input；2 调用LoadAccessibilityContext；3 受控完成当前port返回；4 读root/DOM与计数 | safe page派生region/focus/announcement；qualified/版本匹配，未触发其它owner effect | Vitest/typed port；展示补组件 |
| TC-PROTO-032 | 异常/边界 P0 | 同正向；每负向variant重建fixture | 1 分别注入以下失败：隐藏label/count/边不能出现在AT，失效焦点转安全区；2 执行同名flow；3 对late先推进context/slot再release旧返回 | 隐藏label/count/边不能出现在AT，失效焦点转安全区；匹配03错误/安全姿态，无越权披露/second dispatch；原slot不改为current | deferred port与负向参数集 |

本cut审查：正向与异常均有原context和effect计数观察；仅本地测试scope证据，不解除real binding blocker。

#### 6.2.17 LoadProjectList

来源：03 §7/§8 LoadProjectList；CUT-P-17。数据：FX-process；suite：process；预约证据：EV-CAND-process。

| 用例ID | 场景/优先级 | 前置 | 输入/操作 | 预期/断言 | 自动化 |
|---|---|---|---|---|---|
| TC-PROTO-033 | 正向 P0 | §6.1；FX-process当前原slots；正式合同测试scope；必要dependency已注入 | 1 建立03同名typed input；2 调用LoadProjectList；3 受控完成当前port返回；4 读root/DOM与计数 | 正式Work项目safe页与page info；qualified/版本匹配，未触发其它owner effect | Vitest/typed port；展示补组件 |
| TC-PROTO-034 | 异常/边界 P0 | 同正向；每负向variant重建fixture | 1 分别注入以下失败：空页不推项目不存在；旧搜索/页拒绝；2 执行同名flow；3 对late先推进context/slot再release旧返回 | 空页不推项目不存在；旧搜索/页拒绝；匹配03错误/安全姿态，无越权披露/second dispatch；原slot不改为current | deferred port与负向参数集 |

本cut审查：正向与异常均有原context和effect计数观察；仅本地测试scope证据，不解除real binding blocker。

#### 6.2.18 LoadProjectDetail

来源：03 §7/§8 LoadProjectDetail；CUT-P-18。数据：FX-process；suite：process；预约证据：EV-CAND-process。

| 用例ID | 场景/优先级 | 前置 | 输入/操作 | 预期/断言 | 自动化 |
|---|---|---|---|---|---|
| TC-PROTO-035 | 正向 P0 | §6.1；FX-process当前原slots；正式合同测试scope；必要dependency已注入 | 1 建立03同名typed input；2 调用LoadProjectDetail；3 受控完成当前port返回；4 读root/DOM与计数 | 五tab、各sourcesection与返回语境；qualified/版本匹配，未触发其它owner effect | Vitest/typed port；展示补组件 |
| TC-PROTO-036 | 异常/边界 P0 | 同正向；每负向variant重建fixture | 1 分别注入以下失败：顶层progress不存在，partial不混成全owner fresh；2 执行同名flow；3 对late先推进context/slot再release旧返回 | 顶层progress不存在，partial不混成全owner fresh；匹配03错误/安全姿态，无越权披露/second dispatch；原slot不改为current | deferred port与负向参数集 |

本cut审查：正向与异常均有原context和effect计数观察；仅本地测试scope证据，不解除real binding blocker。

#### 6.2.19 LoadProjectProcessFlow

来源：03 §7/§8 LoadProjectProcessFlow；CUT-P-19。数据：FX-process；suite：process；预约证据：EV-CAND-process。

| 用例ID | 场景/优先级 | 前置 | 输入/操作 | 预期/断言 | 自动化 |
|---|---|---|---|---|---|
| TC-PROTO-037 | 正向 P0 | §6.1；FX-process当前原slots；正式合同测试scope；必要dependency已注入 | 1 建立03同名typed input；2 调用LoadProjectProcessFlow；3 受控完成当前port返回；4 读root/DOM与计数 | Process整体safe topology/版本/并行gateway；qualified/版本匹配，未触发其它owner effect | Vitest/typed port；展示补组件 |
| TC-PROTO-038 | 异常/边界 P0 | 同正向；每负向variant重建fixture | 1 分别注入以下失败：从WorkItem/log/prototype补图拒绝，hidden边裁剪；2 执行同名flow；3 对late先推进context/slot再release旧返回 | 从WorkItem/log/prototype补图拒绝，hidden边裁剪；匹配03错误/安全姿态，无越权披露/second dispatch；原slot不改为current | deferred port与负向参数集 |

本cut审查：正向与异常均有原context和effect计数观察；仅本地测试scope证据，不解除real binding blocker。

#### 6.2.20 LoadStageProcessFlow

来源：03 §7/§8 LoadStageProcessFlow；CUT-P-20。数据：FX-process；suite：process；预约证据：EV-CAND-process。

| 用例ID | 场景/优先级 | 前置 | 输入/操作 | 预期/断言 | 自动化 |
|---|---|---|---|---|---|
| TC-PROTO-039 | 正向 P0 | §6.1；FX-process当前原slots；正式合同测试scope；必要dependency已注入 | 1 建立03同名typed input；2 调用LoadStageProcessFlow；3 受控完成当前port返回；4 读root/DOM与计数 | matchedparent进入独立阶段流程；qualified/版本匹配，未触发其它owner effect | Vitest/typed port；展示补组件 |
| TC-PROTO-040 | 异常/边界 P0 | 同正向；每负向variant重建fixture | 1 分别注入以下失败：父版本变化/阶段迟到清旧child，无伪汇聚；2 执行同名flow；3 对late先推进context/slot再release旧返回 | 父版本变化/阶段迟到清旧child，无伪汇聚；匹配03错误/安全姿态，无越权披露/second dispatch；原slot不改为current | deferred port与负向参数集 |

本cut审查：正向与异常均有原context和effect计数观察；仅本地测试scope证据，不解除real binding blocker。

#### 6.2.21 LoadProcessNodeDetail

来源：03 §7/§8 LoadProcessNodeDetail；CUT-P-21。数据：FX-process；suite：process；预约证据：EV-CAND-process。

| 用例ID | 场景/优先级 | 前置 | 输入/操作 | 预期/断言 | 自动化 |
|---|---|---|---|---|---|
| TC-PROTO-041 | 正向 P0 | §6.1；FX-process当前原slots；正式合同测试scope；必要dependency已注入 | 1 建立03同名typed input；2 调用LoadProcessNodeDetail；3 受控完成当前port返回；4 读root/DOM与计数 | 当前safe节点的工作/运行/工具/提交/测试/证据独立section；qualified/版本匹配，未触发其它owner effect | Vitest/typed port；展示补组件 |
| TC-PROTO-042 | 异常/边界 P0 | 同正向；每负向variant重建fixture | 1 分别注入以下失败：旧node返回拒绝；safe摘要不等验收evidence；2 执行同名flow；3 对late先推进context/slot再release旧返回 | 旧node返回拒绝；safe摘要不等验收evidence；匹配03错误/安全姿态，无越权披露/second dispatch；原slot不改为current | deferred port与负向参数集 |

本cut审查：正向与异常均有原context和effect计数观察；仅本地测试scope证据，不解除real binding blocker。

#### 6.2.22 LoadProjectConversationLinks

来源：03 §7/§8 LoadProjectConversationLinks；CUT-P-22。数据：FX-directory；suite：directory；预约证据：EV-CAND-directory。

| 用例ID | 场景/优先级 | 前置 | 输入/操作 | 预期/断言 | 自动化 |
|---|---|---|---|---|---|
| TC-PROTO-043 | 正向 P0 | §6.1；FX-directory当前原slots；正式合同测试scope；必要dependency已注入 | 1 建立03同名typed input；2 调用LoadProjectConversationLinks；3 受控完成当前port返回；4 读root/DOM与计数 | 正式关系和每个target独立access；qualified/版本匹配，未触发其它owner effect | Vitest/typed port；展示补组件 |
| TC-PROTO-044 | 异常/边界 P0 | 同正向；每负向variant重建fixture | 1 分别注入以下失败：解除/撤销/不同群成员不串权；本地不建binding；2 执行同名flow；3 对late先推进context/slot再release旧返回 | 解除/撤销/不同群成员不串权；本地不建binding；匹配03错误/安全姿态，无越权披露/second dispatch；原slot不改为current | deferred port与负向参数集 |

本cut审查：正向与异常均有原context和effect计数观察；仅本地测试scope证据，不解除real binding blocker。

#### 6.2.23 LoadCompanyDirectory

来源：03 §7/§8 LoadCompanyDirectory；CUT-P-23。数据：FX-directory；suite：directory；预约证据：EV-CAND-directory。

| 用例ID | 场景/优先级 | 前置 | 输入/操作 | 预期/断言 | 自动化 |
|---|---|---|---|---|---|
| TC-PROTO-045 | 正向 P0 | §6.1；FX-directory当前原slots；正式合同测试scope；必要dependency已注入 | 1 建立03同名typed input；2 调用LoadCompanyDirectory；3 受控完成当前port返回；4 读root/DOM与计数 | 正式provider人类/AI覆盖/搜索/分页；qualified/版本匹配，未触发其它owner effect | Vitest/typed port；展示补组件 |
| TC-PROTO-046 | 异常/边界 P0 | 同正向；每负向variant重建fixture | 1 分别注入以下失败：覆盖未知/隐藏人数/跨querypage不合并，Identity不伪全目录；2 执行同名flow；3 对late先推进context/slot再release旧返回 | 覆盖未知/隐藏人数/跨querypage不合并，Identity不伪全目录；匹配03错误/安全姿态，无越权披露/second dispatch；原slot不改为current | deferred port与负向参数集 |

本cut审查：正向与异常均有原context和effect计数观察；仅本地测试scope证据，不解除real binding blocker。

#### 6.2.24 LoadMemberContext

来源：03 §7/§8 LoadMemberContext；CUT-P-24。数据：FX-directory；suite：directory；预约证据：EV-CAND-directory。

| 用例ID | 场景/优先级 | 前置 | 输入/操作 | 预期/断言 | 自动化 |
|---|---|---|---|---|---|
| TC-PROTO-047 | 正向 P0 | §6.1；FX-directory当前原slots；正式合同测试scope；必要dependency已注入 | 1 建立03同名typed input；2 调用LoadMemberContext；3 受控完成当前port返回；4 读root/DOM与计数 | Identity/ProjectMember/Participant/presence独立；qualified/版本匹配，未触发其它owner effect | Vitest/typed port；展示补组件 |
| TC-PROTO-048 | 异常/边界 P0 | 同正向；每负向variant重建fixture | 1 分别注入以下失败：目录可见不授予DM/项目，Runtime summary不当presence；2 执行同名flow；3 对late先推进context/slot再release旧返回 | 目录可见不授予DM/项目，Runtime summary不当presence；匹配03错误/安全姿态，无越权披露/second dispatch；原slot不改为current | deferred port与负向参数集 |

本cut审查：正向与异常均有原context和effect计数观察；仅本地测试scope证据，不解除real binding blocker。

#### 6.2.25 ConsumeFormalChange

来源：03 §7/§8 ConsumeFormalChange；CUT-P-25。数据：FX-context；suite：continuity；预约证据：EV-CAND-continuity。

| 用例ID | 场景/优先级 | 前置 | 输入/操作 | 预期/断言 | 自动化 |
|---|---|---|---|---|---|
| TC-PROTO-049 | 正向 P0 | §6.1；FX-context当前原slots；正式合同测试scope；必要dependency已注入 | 1 建立03同名typed input；2 调用ConsumeFormalChange；3 受控完成当前port返回；4 读root/DOM与计数 | source-qualified change一次CAS更新slice/水位；qualified/版本匹配，未触发其它owner effect | Vitest/typed port；展示补组件 |
| TC-PROTO-050 | 异常/边界 P0 | 同正向；每负向variant重建fixture | 1 分别注入以下失败：duplicate无二次apply；gap/乱序/oldslot无fresh；2 执行同名flow；3 对late先推进context/slot再release旧返回 | duplicate无二次apply；gap/乱序/oldslot无fresh；匹配03错误/安全姿态，无越权披露/second dispatch；原slot不改为current | deferred port与负向参数集 |

本cut审查：正向与异常均有原context和effect计数观察；仅本地测试scope证据，不解除real binding blocker。

#### 6.2.26 ConsumeCommandReceiptOrResult

来源：03 §7/§8 ConsumeCommandReceiptOrResult；CUT-P-26。数据：FX-context；suite：intent；预约证据：EV-CAND-intent。

| 用例ID | 场景/优先级 | 前置 | 输入/操作 | 预期/断言 | 自动化 |
|---|---|---|---|---|---|
| TC-PROTO-051 | 正向 P0 | §6.1；FX-context当前原slots；正式合同测试scope；必要dependency已注入 | 1 建立03同名typed input；2 调用ConsumeCommandReceiptOrResult；3 受控完成当前port返回；4 读root/DOM与计数 | formalauthority/correlation后result gate；qualified/版本匹配，未触发其它owner effect | Vitest/typed port；展示补组件 |
| TC-PROTO-052 | 异常/边界 P0 | 同正向；每负向variant重建fixture | 1 分别注入以下失败：普通receipt/WS/AG-UI ACK/fake不确认真实attempt；2 执行同名flow；3 对late先推进context/slot再release旧返回 | 普通receipt/WS/AG-UI ACK/fake不确认真实attempt；匹配03错误/安全姿态，无越权披露/second dispatch；原slot不改为current | deferred port与负向参数集 |

本cut审查：正向与异常均有原context和effect计数观察；仅本地测试scope证据，不解除real binding blocker。

#### 6.2.27 ConsumeResumeResult

来源：03 §7/§8 ConsumeResumeResult；CUT-P-27。数据：FX-context；suite：continuity；预约证据：EV-CAND-continuity。

| 用例ID | 场景/优先级 | 前置 | 输入/操作 | 预期/断言 | 自动化 |
|---|---|---|---|---|---|
| TC-PROTO-053 | 正向 P0 | §6.1；FX-context当前原slots；正式合同测试scope；必要dependency已注入 | 1 建立03同名typed input；2 调用ConsumeResumeResult；3 受控完成当前port返回；4 读root/DOM与计数 | current source/recovery+completecoverage才fresh；qualified/版本匹配，未触发其它owner effect | Vitest/typed port；展示补组件 |
| TC-PROTO-054 | 异常/边界 P0 | 同正向；每负向variant重建fixture | 1 分别注入以下失败：partial/错recovery/旧slots不fresh；2 执行同名flow；3 对late先推进context/slot再release旧返回 | partial/错recovery/旧slots不fresh；匹配03错误/安全姿态，无越权披露/second dispatch；原slot不改为current | deferred port与负向参数集 |

本cut审查：正向与异常均有原context和effect计数观察；仅本地测试scope证据，不解除real binding blocker。

#### 6.2.28 ConsumeVisibilityChange

来源：03 §7/§8 ConsumeVisibilityChange；CUT-P-28。数据：FX-context；suite：continuity；预约证据：EV-CAND-continuity。

| 用例ID | 场景/优先级 | 前置 | 输入/操作 | 预期/断言 | 自动化 |
|---|---|---|---|---|---|
| TC-PROTO-055 | 正向 P0 | §6.1；FX-context当前原slots；正式合同测试scope；必要dependency已注入 | 1 建立03同名typed input；2 调用ConsumeVisibilityChange；3 受控完成当前port返回；4 读root/DOM与计数 | 当前scope/source正式revoke先隐藏失效；qualified/版本匹配，未触发其它owner effect | Vitest/typed port；展示补组件 |
| TC-PROTO-056 | 异常/边界 P0 | 同正向；每负向variant重建fixture | 1 分别注入以下失败：closed node仍被遮蔽；stop/delete失败不回滚；2 执行同名flow；3 对late先推进context/slot再release旧返回 | closed node仍被遮蔽；stop/delete失败不回滚；匹配03错误/安全姿态，无越权披露/second dispatch；原slot不改为current | deferred port与负向参数集 |

本cut审查：正向与异常均有原context和effect计数观察；仅本地测试scope证据，不解除real binding blocker。

#### 6.2.29 ConsumeMaterialRevisionChange

来源：03 §7/§8 ConsumeMaterialRevisionChange；CUT-P-29。数据：FX-context；suite：continuity；预约证据：EV-CAND-continuity。

| 用例ID | 场景/优先级 | 前置 | 输入/操作 | 预期/断言 | 自动化 |
|---|---|---|---|---|---|
| TC-PROTO-057 | 正向 P0 | §6.1；FX-context当前原slots；正式合同测试scope；必要dependency已注入 | 1 建立03同名typed input；2 调用ConsumeMaterialRevisionChange；3 受控完成当前port返回；4 读root/DOM与计数 | 仅matchedsource材料stale/parent失效；qualified/版本匹配，未触发其它owner effect | Vitest/typed port；展示补组件 |
| TC-PROTO-058 | 异常/边界 P0 | 同正向；每负向variant重建fixture | 1 分别注入以下失败：跨source不覆盖，旧revision不复活graph；2 执行同名flow；3 对late先推进context/slot再release旧返回 | 跨source不覆盖，旧revision不复活graph；匹配03错误/安全姿态，无越权披露/second dispatch；原slot不改为current | deferred port与负向参数集 |

本cut审查：正向与异常均有原context和effect计数观察；仅本地测试scope证据，不解除real binding blocker。

#### 6.2.30 ConsumeShellLifecycle

来源：03 §7/§8 ConsumeShellLifecycle；CUT-P-30。数据：FX-context；suite：continuity；预约证据：EV-CAND-continuity。

| 用例ID | 场景/优先级 | 前置 | 输入/操作 | 预期/断言 | 自动化 |
|---|---|---|---|---|---|
| TC-PROTO-059 | 正向 P0 | §6.1；FX-context当前原slots；正式合同测试scope；必要dependency已注入 | 1 建立03同名typed input；2 调用ConsumeShellLifecycle；3 受控完成当前port返回；4 读root/DOM与计数 | 可信host offline/background/closing技术消费；qualified/版本匹配，未触发其它owner effect | Vitest/typed port；展示补组件 |
| TC-PROTO-060 | 异常/边界 P0 | 同正向；每负向variant重建fixture | 1 分别注入以下失败：窗口ACK/closing不取消owner或确认业务；2 执行同名flow；3 对late先推进context/slot再release旧返回 | 窗口ACK/closing不取消owner或确认业务；匹配03错误/安全姿态，无越权披露/second dispatch；原slot不改为current | deferred port与负向参数集 |

本cut审查：正向与异常均有原context和effect计数观察；仅本地测试scope证据，不解除real binding blocker。

#### 6.2.31 ConsumeEvictionTrigger

来源：03 §7/§8 ConsumeEvictionTrigger；CUT-P-31。数据：FX-context；suite：persistence；预约证据：EV-CAND-persistence。

| 用例ID | 场景/优先级 | 前置 | 输入/操作 | 预期/断言 | 自动化 |
|---|---|---|---|---|---|
| TC-PROTO-061 | 正向 P0 | §6.1；FX-context当前原slots；正式合同测试scope；必要dependency已注入 | 1 建立03同名typed input；2 调用ConsumeEvictionTrigger；3 受控完成当前port返回；4 读root/DOM与计数 | qualifiedclearreason→先hide再repo delete；qualified/版本匹配，未触发其它owner effect | Vitest/typed port；展示补组件 |
| TC-PROTO-062 | 异常/边界 P0 | 同正向；每负向variant重建fixture | 1 分别注入以下失败：非法触发/冲突delete不能cleared；2 执行同名flow；3 对late先推进context/slot再release旧返回 | 非法触发/冲突delete不能cleared；匹配03错误/安全姿态，无越权披露/second dispatch；原slot不改为current | deferred port与负向参数集 |

本cut审查：正向与异常均有原context和effect计数观察；仅本地测试scope证据，不解除real binding blocker。

#### 6.2.32 ClientDiagnosticHandoffRequested

来源：03 §7/§8 ClientDiagnosticHandoffRequested；CUT-P-32。数据：FX-diagnostic；suite：diagnostic；预约证据：EV-CAND-diagnostic。

| 用例ID | 场景/优先级 | 前置 | 输入/操作 | 预期/断言 | 自动化 |
|---|---|---|---|---|---|
| TC-PROTO-063 | 正向 P0 | §6.1；FX-diagnostic当前原slots；正式合同测试scope；必要dependency已注入 | 1 建立03同名typed input；2 调用ClientDiagnosticHandoffRequested；3 受控完成当前port返回；4 读root/DOM与计数 | 显式current低敏六字段，合格sinkreceipt；qualified/版本匹配，未触发其它owner effect | Vitest/typed port；展示补组件 |
| TC-PROTO-064 | 异常/边界 P0 | 同正向；每负向variant重建fixture | 1 分别注入以下失败：disabled零IO/额外secret字段拒绝/unknown不重送；2 执行同名flow；3 对late先推进context/slot再release旧返回 | disabled零IO/额外secret字段拒绝/unknown不重送；匹配03错误/安全姿态，无越权披露/second dispatch；原slot不改为current | deferred port与负向参数集 |

本cut审查：正向与异常均有原context和effect计数观察；仅本地测试scope证据，不解除real binding blocker。

#### 6.2.33 ClientSupportContextRequested

来源：03 §7/§8 ClientSupportContextRequested；CUT-P-33。数据：FX-diagnostic；suite：diagnostic；预约证据：EV-CAND-diagnostic。

| 用例ID | 场景/优先级 | 前置 | 输入/操作 | 预期/断言 | 自动化 |
|---|---|---|---|---|---|
| TC-PROTO-065 | 正向 P0 | §6.1；FX-diagnostic当前原slots；正式合同测试scope；必要dependency已注入 | 1 建立03同名typed input；2 调用ClientSupportContextRequested；3 受控完成当前port返回；4 读root/DOM与计数 | 显式支持分类/有限reason构造；qualified/版本匹配，未触发其它owner effect | Vitest/typed port；展示补组件 |
| TC-PROTO-066 | 异常/边界 P0 | 同正向；每负向variant重建fixture | 1 分别注入以下失败：raw logs/query/actorref/截图不能加入payload；2 执行同名flow；3 对late先推进context/slot再release旧返回 | raw logs/query/actorref/截图不能加入payload；匹配03错误/安全姿态，无越权披露/second dispatch；原slot不改为current | deferred port与负向参数集 |

本cut审查：正向与异常均有原context和effect计数观察；仅本地测试scope证据，不解除real binding blocker。

#### 6.2.34 ResumeChangeContext

来源：03 §7/§8 ResumeChangeContext；CUT-P-34。数据：FX-context；suite：continuity；预约证据：EV-CAND-continuity。

| 用例ID | 场景/优先级 | 前置 | 输入/操作 | 预期/断言 | 自动化 |
|---|---|---|---|---|---|
| TC-PROTO-067 | 正向 P0 | §6.1；FX-context当前原slots；正式合同测试scope；必要dependency已注入 | 1 建立03同名typed input；2 调用ResumeChangeContext；3 受控完成当前port返回；4 读root/DOM与计数 | 每source single-flight resume；qualified/版本匹配，未触发其它owner effect | Vitest/typed port；展示补组件 |
| TC-PROTO-068 | 异常/边界 P0 | 同正向；每负向variant重建fixture | 1 分别注入以下失败：双resume/旧recovery/断线ACK不fresh；2 执行同名flow；3 对late先推进context/slot再release旧返回 | 双resume/旧recovery/断线ACK不fresh；匹配03错误/安全姿态，无越权披露/second dispatch；原slot不改为current | deferred port与负向参数集 |

本cut审查：正向与异常均有原context和effect计数观察；仅本地测试scope证据，不解除real binding blocker。

#### 6.2.35 RequeryAfterGap

来源：03 §7/§8 RequeryAfterGap；CUT-P-35。数据：FX-context；suite：continuity；预约证据：EV-CAND-continuity。

| 用例ID | 场景/优先级 | 前置 | 输入/操作 | 预期/断言 | 自动化 |
|---|---|---|---|---|---|
| TC-PROTO-069 | 正向 P0 | §6.1；FX-context当前原slots；正式合同测试scope；必要dependency已注入 | 1 建立03同名typed input；2 调用RequeryAfterGap；3 受控完成当前port返回；4 读root/DOM与计数 | 新qualifiedsnapshot覆盖相应source；qualified/版本匹配，未触发其它owner effect | Vitest/typed port；展示补组件 |
| TC-PROTO-070 | 异常/边界 P0 | 同正向；每负向variant重建fixture | 1 分别注入以下失败：缺coverage不能清gap/吞变更；2 执行同名flow；3 对late先推进context/slot再release旧返回 | 缺coverage不能清gap/吞变更；匹配03错误/安全姿态，无越权披露/second dispatch；原slot不改为current | deferred port与负向参数集 |

本cut审查：正向与异常均有原context和effect计数观察；仅本地测试scope证据，不解除real binding blocker。

#### 6.2.36 ResolveUnknownAttempt

来源：03 §7/§8 ResolveUnknownAttempt；CUT-P-36。数据：FX-context；suite：intent；预约证据：EV-CAND-intent。

| 用例ID | 场景/优先级 | 前置 | 输入/操作 | 预期/断言 | 自动化 |
|---|---|---|---|---|---|
| TC-PROTO-071 | 正向 P0 | §6.1；FX-context当前原slots；正式合同测试scope；必要dependency已注入 | 1 建立03同名typed input；2 调用ResolveUnknownAttempt；3 受控完成当前port返回；4 读root/DOM与计数 | 只formalprobe→合法结果轴；qualified/版本匹配，未触发其它owner effect | Vitest/typed port；展示补组件 |
| TC-PROTO-072 | 异常/边界 P0 | 同正向；每负向variant重建fixture | 1 分别注入以下失败：not_found/timeout不自动dispatch；2 执行同名flow；3 对late先推进context/slot再release旧返回 | not_found/timeout不自动dispatch；匹配03错误/安全姿态，无越权披露/second dispatch；原slot不改为current | deferred port与负向参数集 |

本cut审查：正向与异常均有原context和effect计数观察；仅本地测试scope证据，不解除real binding blocker。

#### 6.2.37 RefreshStaleMaterial

来源：03 §7/§8 RefreshStaleMaterial；CUT-P-37。数据：FX-context；suite：continuity；预约证据：EV-CAND-continuity。

| 用例ID | 场景/优先级 | 前置 | 输入/操作 | 预期/断言 | 自动化 |
|---|---|---|---|---|---|
| TC-PROTO-073 | 正向 P0 | §6.1；FX-context当前原slots；正式合同测试scope；必要dependency已注入 | 1 建立03同名typed input；2 调用RefreshStaleMaterial；3 受控完成当前port返回；4 读root/DOM与计数 | newcurrent source材料/marker；qualified/版本匹配，未触发其它owner effect | Vitest/typed port；展示补组件 |
| TC-PROTO-074 | 异常/边界 P0 | 同正向；每负向variant重建fixture | 1 分别注入以下失败：revoked旧ref不refresh恢复权限；2 执行同名flow；3 对late先推进context/slot再release旧返回 | revoked旧ref不refresh恢复权限；匹配03错误/安全姿态，无越权披露/second dispatch；原slot不改为current | deferred port与负向参数集 |

本cut审查：正向与异常均有原context和effect计数观察；仅本地测试scope证据，不解除real binding blocker。

#### 6.2.38 RestoreAfterShellRestart

来源：03 §7/§8 RestoreAfterShellRestart；CUT-P-38。数据：FX-context；suite：continuity；预约证据：EV-CAND-continuity。

| 用例ID | 场景/优先级 | 前置 | 输入/操作 | 预期/断言 | 自动化 |
|---|---|---|---|---|---|
| TC-PROTO-075 | 正向 P0 | §6.1；FX-context当前原slots；正式合同测试scope；必要dependency已注入 | 1 建立03同名typed input；2 调用RestoreAfterShellRestart；3 受控完成当前port返回；4 读root/DOM与计数 | safe locator新epoch重新入口/正式read；qualified/版本匹配，未触发其它owner effect | Vitest/typed port；展示补组件 |
| TC-PROTO-076 | 异常/边界 P0 | 同正向；每负向variant重建fixture | 1 分别注入以下失败：旧confirmed/access/handle不恢复，memory无durable承诺；2 执行同名flow；3 对late先推进context/slot再release旧返回 | 旧confirmed/access/handle不恢复，memory无durable承诺；匹配03错误/安全姿态，无越权披露/second dispatch；原slot不改为current | deferred port与负向参数集 |

本cut审查：正向与异常均有原context和effect计数观察；仅本地测试scope证据，不解除real binding blocker。

#### 6.2.39 PersistLocalProjection

来源：03 §7/§8 PersistLocalProjection；CUT-P-39。数据：FX-context；suite：persistence；预约证据：EV-CAND-persistence。

| 用例ID | 场景/优先级 | 前置 | 输入/操作 | 预期/断言 | 自动化 |
|---|---|---|---|---|---|
| TC-PROTO-077 | 正向 P0 | §6.1；FX-context当前原slots；正式合同测试scope；必要dependency已注入 | 1 建立03同名typed input；2 调用PersistLocalProjection；3 受控完成当前port返回；4 读root/DOM与计数 | 当前fence/partition/entry版memory保存；qualified/版本匹配，未触发其它owner effect | Vitest/typed port；展示补组件 |
| TC-PROTO-078 | 异常/边界 P0 | 同正向；每负向variant重建fixture | 1 分别注入以下失败：pending save-after-revoke拒绝，正文/secret不disk；2 执行同名flow；3 对late先推进context/slot再release旧返回 | pending save-after-revoke拒绝，正文/secret不disk；匹配03错误/安全姿态，无越权披露/second dispatch；原slot不改为current | deferred port与负向参数集 |

本cut审查：正向与异常均有原context和effect计数观察；仅本地测试scope证据，不解除real binding blocker。

#### 6.2.40 EvictLocalMaterial

来源：03 §7/§8 EvictLocalMaterial；CUT-P-40。数据：FX-context；suite：persistence；预约证据：EV-CAND-persistence。

| 用例ID | 场景/优先级 | 前置 | 输入/操作 | 预期/断言 | 自动化 |
|---|---|---|---|---|---|
| TC-PROTO-079 | 正向 P0 | §6.1；FX-context当前原slots；正式合同测试scope；必要dependency已注入 | 1 建立03同名typed input；2 调用EvictLocalMaterial；3 受控完成当前port返回；4 读root/DOM与计数 | deleted/already_absent→memorycleared；qualified/版本匹配，未触发其它owner effect | Vitest/typed port；展示补组件 |
| TC-PROTO-080 | 异常/边界 P0 | 同正向；每负向variant重建fixture | 1 分别注入以下失败：storage/conflict失败restricted仍隐藏；2 执行同名flow；3 对late先推进context/slot再release旧返回 | storage/conflict失败restricted仍隐藏；匹配03错误/安全姿态，无越权披露/second dispatch；原slot不改为current | deferred port与负向参数集 |

本cut审查：正向与异常均有原context和effect计数观察；仅本地测试scope证据，不解除real binding blocker。

#### 6.2.41 EmitDiagnosticHandoff

来源：03 §7/§8 EmitDiagnosticHandoff；CUT-P-41。数据：FX-diagnostic；suite：diagnostic；预约证据：EV-CAND-diagnostic。

| 用例ID | 场景/优先级 | 前置 | 输入/操作 | 预期/断言 | 自动化 |
|---|---|---|---|---|---|
| TC-PROTO-081 | 正向 P0 | §6.1；FX-diagnostic当前原slots；正式合同测试scope；必要dependency已注入 | 1 建立03同名typed input；2 调用EmitDiagnosticHandoff；3 受控完成当前port返回；4 读root/DOM与计数 | 显式approved input按mode交付；qualified/版本匹配，未触发其它owner effect | Vitest/typed port；展示补组件 |
| TC-PROTO-082 | 异常/边界 P0 | 同正向；每负向variant重建fixture | 1 分别注入以下失败：缺sinkblocked/默认disabled/unknown no resend；2 执行同名flow；3 对late先推进context/slot再release旧返回 | 缺sinkblocked/默认disabled/unknown no resend；匹配03错误/安全姿态，无越权披露/second dispatch；原slot不改为current | deferred port与负向参数集 |

本cut审查：正向与异常均有原context和effect计数观察；仅本地测试scope证据，不解除real binding blocker。

#### 6.2.42 NavigateProjectContext

来源：03 §7/§8 NavigateProjectContext；CUT-P-42。数据：FX-process；suite：process；预约证据：EV-CAND-process。

| 用例ID | 场景/优先级 | 前置 | 输入/操作 | 预期/断言 | 自动化 |
|---|---|---|---|---|---|
| TC-PROTO-083 | 正向 P0 | §6.1；FX-process当前原slots；正式合同测试scope；必要dependency已注入 | 1 建立03同名typed input；2 调用NavigateProjectContext；3 受控完成当前port返回；4 读root/DOM与计数 | 五tab和safe stage/node局部选择；qualified/版本匹配，未触发其它owner effect | Vitest/typed port；展示补组件 |
| TC-PROTO-084 | 异常/边界 P0 | 同正向；每负向variant重建fixture | 1 分别注入以下失败：旧parent/hiddennode/错误project拒绝，不能绑定群聊；2 执行同名flow；3 对late先推进context/slot再release旧返回 | 旧parent/hiddennode/错误project拒绝，不能绑定群聊；匹配03错误/安全姿态，无越权披露/second dispatch；原slot不改为current | deferred port与负向参数集 |

本cut审查：正向与异常均有原context和effect计数观察；仅本地测试scope证据，不解除real binding blocker。

#### 6.2.43 UpdateDirectorySearch

来源：03 §7/§8 UpdateDirectorySearch；CUT-P-43。数据：FX-directory；suite：directory；预约证据：EV-CAND-directory。

| 用例ID | 场景/优先级 | 前置 | 输入/操作 | 预期/断言 | 自动化 |
|---|---|---|---|---|---|
| TC-PROTO-085 | 正向 P0 | §6.1；FX-directory当前原slots；正式合同测试scope；必要dependency已注入 | 1 建立03同名typed input；2 调用UpdateDirectorySearch；3 受控完成当前port返回；4 读root/DOM与计数 | 新querygeneration登记slot并清旧page；qualified/版本匹配，未触发其它owner effect | Vitest/typed port；展示补组件 |
| TC-PROTO-086 | 异常/边界 P0 | 同正向；每负向variant重建fixture | 1 分别注入以下失败：rapidsearch late results/旧cursor不能覆写；2 执行同名flow；3 对late先推进context/slot再release旧返回 | rapidsearch late results/旧cursor不能覆写；匹配03错误/安全姿态，无越权披露/second dispatch；原slot不改为current | deferred port与负向参数集 |

本cut审查：正向与异常均有原context和effect计数观察；仅本地测试scope证据，不解除real binding blocker。

### 6.3 17状态主体全矩阵测试

冻结来源：当前03 §9，每主体保留以下合法行，不删from多值或to多值分支。参数化编译表应给每条source row稳定variant_id并展开每个合法From/To组合；“same”固定为前态，“new generation”表示新实例，不能改写旧对象。factory是构造入口而非enum值。
每行guard逐字段缺失/错误测试；权限证明字段保留原输入结构经mapper拒绝，不能让生产代码提供测试后门。非法表另以主体实际enum笛卡尔积减去合法组合，验证每项非法；不得用guard失败代替非法迁移覆盖。

#### 6.3.1 RouteContext / RoutePhase

来源：03 §9.4.1。CUT-S-01；TC-STATE-001（合法全行）/TC-STATE-002（逐guard）/TC-STATE-003（非法全行）。P0，Vitest；数据FX-state；suite navigation；预约EV-CAND-navigation。

操作/断言按本节三类执行规则；合法行具体动作、字段与副作用如下：

| From | To | 触发函数 | Step9 flow | 可落码前置条件 | 字段更新 | local/SDK副作用 | 非法错误 |
|---|---|---|---|---|---|---|---|
| factory | unresolved | RouteContextFactory.fromEntry/fromTarget | ResolveEntryAccess | LocalId/config/kind/current request generation；candidate结构有效 | entry/target候选，scope/context=null，return仅safe candidate | local新route CAS，无owner IO | invalid_input |
| factory | expired | RouteContextFactory.fromRestore | RestoreAfterShellRestart | approved RestorationHint，仅候选 | refs未恢复授权；generation新 | local route，之后resolve | dependency_unbound |
| unresolved | resolved | RouteContextFactory.applyEntryResult | ResolveEntryAccess | QualifiedEntryResolution formal registry；requestFence actor/session/route/generation匹配；readable scope，conversation/thread context必填 | scope/context/entry/target正式safe ref；phase resolved | route/access同受控CAS；无其它material导入 | authority_missing/context_changed |
| unresolved/resolved | restricted | RouteContextFactory.applyEntryResult / Access收紧协调 | ResolveEntryAccess/ConsumeVisibilityChange | formal restricted/hidden范围当前，若hidden清subject；普通error不猜正式deny | phase restricted，清不允许refs/return/context | 先hide/invalidate再stop/delete | access_denied/context_changed |
| unresolved/resolved | expired | RouteContextFactory.markExpired | ConsumeShellLifecycle/RestoreAfterShellRestart/ConsumeMaterialRevisionChange | 正式expiry或当前更严格安全期限，不用cache更新资格 | phase expired，禁止intent及旧result消费 | 收紧local，再query | invalid_transition |
| resolved/restricted/expired | unresolved | RouteContextFactory.changeScope / 新request factory | ResolveEntryAccess/NavigateProjectContext | 新generation safe integer、trusted current actor/scope候选、旧slots失效 | 清context/旧return；scope候选重新验证 | local CAS后resolve | invalid_input/context_changed |
| unresolved/resolved/restricted/expired | cleared | RouteContextFactory.clearForLogout | ConsumeVisibilityChange/ConsumeShellLifecycle/EvictLocalMaterial | current session/scope正式影响范围或trusted logout/closing | scope/entry/target/context/return=null；generation推进 | 先hide/invalidate，再释放/删除 | context_changed |
| resolved/restricted/expired/cleared | same | 读取/重复安全通知 | Load*/重复cleanup | same current identity，cleared仍refs空 | 无资格升级，phase不变 | readonly/no-op | context_changed |

非法源约束：cleared→resolved、expired→resolved绕过新generation/正式entry结果均拒绝；raw deep link与validated=true不是authority。restricted/expired重验使用新请求generation，不复活原candidate授权。 所有未列迁移invalid_transition，失败保留原值，无额外SDK调用、owner truth/trace/audit/outbox。

本cut审查：合法rowset完整；缺guard单项隔离；非法组合与新generation分离，不能凭共享enum漏掉本主体。

#### 6.3.2 AccessPosture / AccessAvailability

来源：03 §9.4.2。CUT-S-02；TC-STATE-004（合法全行）/TC-STATE-005（逐guard）/TC-STATE-006（非法全行）。P0，Vitest；数据FX-state；suite navigation；预约EV-CAND-navigation。

操作/断言按本节三类执行规则；合法行具体动作、字段与副作用如下：

| From | To | 触发函数 | Step9 flow | 可落码前置条件 | 字段更新 | local/SDK副作用 | 非法错误 |
|---|---|---|---|---|---|---|---|
| factory | blocked | AccessPostureFactory.blocked | ResolveEntryAccess/Startup | 尚无正式contract或session/visibility | fence/visibility=null、capabilityRefs=[]，finite reason | safe local启动/entry遮蔽 | invalid_input |
| blocked/unavailable/restricted | available/read_only | AccessPostureFactory.fromQualified / 正式entry mapper | ResolveEntryAccess/LoadOwnerSummary/LoadIntentCapability | formal current registry/session/source/target/visibility，fake拒绝，context checks | fence/visibility正式填齐，capabilityRefs仅正式owner能力 | qualified结果CAS；无permission本地推断 | authority_missing |
| available/read_only | available/read_only | AccessPostureFactory.fromQualified | LoadIntentCapability/ResolveEntryAccess | 新formal capability/read结果current；升级read_only→available只能正式qualification | 更新正式capability refs，保留current scope | CAS current incoming，command仍再次guard | context_changed |
| available | read_only | AccessPostureFactory.applyVisibility | ConsumeVisibilityChange | formal next=read_only同current session/scope/source，旧available资格仍可safe读 | capabilityRefs=[]；availability read_only | 立即disable intent，local CAS；不cancel owner | authority_missing |
| available/read_only/restricted/unavailable/blocked | restricted/blocked/hidden | AccessPostureFactory.restrict/applyVisibility | ConsumeVisibilityChange/ConsumeShellLifecycle/EvictLocalMaterial | 只formal或更严安全收紧；next已声明，不扩大范围猜测 | refs/capabilities按姿态清，hidden无subject fence/ref | hide→stop→delete，failure不rollback | invalid_transition |
| available/read_only | unavailable | AccessPostureFactory.markUnavailable | Load*/ProbePlatformCapability | 当前只读依赖正式暂不可用，缺contract则blocked不unavailable | 无未经验证内容/capability；safe reason | safe local error，no private fallback | invalid_input |
| hidden | new generation blocked→available/read_only | 新Access factory + 正式qualification | ResolveEntryAccess | 旧generation先clear；新session/route/access request authority | 新对象填新fence/visibility，旧refs不复活 | 新route CAS+SDK resolve只读 | context_changed |

非法源约束：任意本地角色/Participant/ProjectMember/host available/缓存命中把blocked、read_only或hidden升available均拒绝；button disabled不是server gate。AccessAvailability与CapabilityAvailability名字不同、主体不同。 所有未列迁移invalid_transition，失败保留原值，无额外SDK调用、owner truth/trace/audit/outbox。

本cut审查：合法rowset完整；缺guard单项隔离；非法组合与新generation分离，不能凭共享enum漏掉本主体。

#### 6.3.3 ClientConsumptionContext / ConsumptionContextPosture

来源：03 §9.4.3。CUT-S-03；TC-STATE-007（合法全行）/TC-STATE-008（逐guard）/TC-STATE-009（非法全行）。P0，Vitest；数据FX-state；suite navigation；预约EV-CAND-navigation。

操作/断言按本节三类执行规则；合法行具体动作、字段与副作用如下：

| From | To | 触发函数 | Step9 flow | 可落码前置条件 | 字段更新 | local/SDK副作用 | 非法错误 |
|---|---|---|---|---|---|---|---|
| factory | active | ConsumptionContextFactory.forRequest | Load*/Submit*/ResumeChangeContext/UpdateDirectorySearch | route可读；session/actor/scope/target/source/visibility正式qualified；requestGeneration新safe integer | fence/actor/scope/project/target/source/visibility完整，posture active | 先root登记slot，后SDK read/command | authority_missing/dependency_unbound |
| active | active | ConsumptionContextFactory.matches/isApplicable + matched CAS | Load*/ConsumeFormalChange/ConsumeResumeResult | 全部fence/actor/scope/project/target/source/visibility/代次等值，不跨owner版本 | context不变，业务safe slice独立更新 | CAS incoming checks，不改来包generation | context_changed |
| active | invalidated | ConsumptionContextFactory.invalidate | NavigateProjectContext/UpdateDirectorySearch/ConsumeVisibilityChange/父图版本变化 | reason session_changed/scope_changed/target_changed/source_changed/revoked当前可信 | posture invalidated；阻止来包，不自动授权新target | 先CAS/registry失效再cancel read/stop | invalid_input |
| active/invalidated | cleared | ConsumptionContextFactory.clear | ConsumeVisibilityChange/EvictLocalMaterial/ConsumeShellLifecycle | 正式范围或local cleanup，不要求old active；current session验证 | 全部外部refs/fence=null，保留local代次 | local清理；stop/delete失败仍不可应用 | context_changed |
| cleared/invalidated | new active | 新ConsumptionContextFactory.forRequest | 新Load*/新Search/新Resolve | 新slot或严格新requestGeneration；qualified来源，旧实例禁止修改 | new instance active；旧保持cleared/invalidated | 登记新slot后独立SDK | invalid_transition |

非法源约束：invalidated/cleared原实例→active非法；晚到结果即使root版本仍匹配也不可消费。scope revoke必须检查current session/scope/source，不可因node slot已失效而忽略收紧。 所有未列迁移invalid_transition，失败保留原值，无额外SDK调用、owner truth/trace/audit/outbox。

本cut审查：合法rowset完整；缺guard单项隔离；非法组合与新generation分离，不能凭共享enum漏掉本主体。

#### 6.3.4 SelectionState / SelectionPhase

来源：03 §9.5.1。CUT-S-04；TC-STATE-010（合法全行）/TC-STATE-011（逐guard）/TC-STATE-012（非法全行）。P0，Vitest；数据FX-state；suite process；预约EV-CAND-process。

操作/断言按本节三类执行规则；合法行具体动作、字段与副作用如下：

| From | To | 触发函数 | Step9 flow | 可落码前置条件 | 字段更新 | local/SDK副作用 | 非法错误 |
|---|---|---|---|---|---|---|---|
| factory | empty | SelectionFactory.empty | ResolveEntryAccess/LoadConversationSurface | 无subject refs | context/turn/gate/artifact/focus=null，expanded空 | 纯local初值 | invalid_input |
| factory | stale | SelectionFactory.fromRoute | ResolveEntryAccess | route resolved候选仍未材料重验 | safe候选而非active选择 | local only | authority_missing |
| empty/stale/selected | selected | SelectionFactory.selectContext/selectTurn | LoadConversationSurface/LoadTurnPage/local select helper | Access available/read_only；context samefence；turn在当前safe surface且disclosure可见 | 更新context/Turn、清不兼容Gate/Artifact；phase selected | local CAS，绝不read receipt/attention | access_denied/context_changed |
| selected | selected | SelectionFactory.moveFocus/setExpanded | LoadAccessibilityContext/local select helper | target当前safe region，regions有限且不泄露hidden | focus/expanded显示变化，不改owner选择 | local CAS；AT副作用非业务结果 | invalid_input |
| selected | stale | SelectionFactory.markStale | ConsumeMaterialRevisionChange/ConsumeFormalChange/父图变化 | 正式source版本变化或更严失效，旧ref只留安全候选 | phase stale，不可凭候选提交intent | local CAS/requery | context_changed |
| empty/selected/stale | cleared | SelectionFactory.clearForVisibilityChange | ConsumeVisibilityChange/EvictLocalMaterial/ConsumeShellLifecycle | 正式current范围/可信cleanup | refs/focus/expanded清 | hide先，AT图/list同裁剪 | authority_missing |
| cleared | new empty | SelectionFactory.empty新实例 | ResolveEntryAccess | 新fence/generation；旧instance不复活 | new refs空 | new local object | invalid_transition |

非法源约束：selectedContext=null时不能持Turn/Gate/Artifact；selected不已读/attention truth。cleared旧实例select非法，必须新empty；从hidden候选直接选择拒绝。 所有未列迁移invalid_transition，失败保留原值，无额外SDK调用、owner truth/trace/audit/outbox。

本cut审查：合法rowset完整；缺guard单项隔离；非法组合与新generation分离，不能凭共享enum漏掉本主体。

#### 6.3.5 ProjectNavigationState / SelectionPhase

来源：03 §9.5.2。CUT-S-05；TC-STATE-013（合法全行）/TC-STATE-014（逐guard）/TC-STATE-015（非法全行）。P0，Vitest；数据FX-state；suite process；预约EV-CAND-process。

操作/断言按本节三类执行规则；合法行具体动作、字段与副作用如下：

| From | To | 触发函数 | Step9 flow | 可落码前置条件 | 字段更新 | local/SDK副作用 | 非法错误 |
|---|---|---|---|---|---|---|---|
| factory | empty/stale | ProjectNavigationFactory.fromRoute | ResolveEntryAccess/NavigateProjectContext | null project→empty；Work正式项目候选→stale；route kind兼容 | overview、stage/node/revision=null、viewport初值、safe return | local factory，不设进度route | invalid_input |
| empty/stale/selected | selected | ProjectNavigationFactory.selectStage/selectNode | NavigateProjectContext/LoadStageProcessFlow/LoadProcessNodeDetail | 同Work项目、formal safe拓扑含获准stage/node、正式父级关系及current revision | 更新stage/node/topologyRevision，node选择清其它不兼容；activeTab进度仅local | single root CAS后Query，无Process/Work执行 | access_denied/context_changed |
| empty/stale/selected | same | ProjectNavigationFactory.selectTab/setViewport | NavigateProjectContext | 五tab有限分类、finite x/y/zoom及config范围；仅current safe instance | activeTab/viewport，不改正式scope或选中资格 | local CAS，图布局非业务truth | invalid_input |
| selected/stale | stale | ProcessDrilldownCoordinator.invalidateParent / local导航裁剪 | ConsumeFormalChange/LoadProjectProcessFlow/LoadStageProcessFlow | formal parent topology source换版，current项目 | 清stage/node/旧viewport/revision及旧return下钻refs；新parent待query | invalidate child slots先，清node details | context_changed |
| empty/stale/selected | cleared | ProjectNavigationFactory.invalidate | ConsumeVisibilityChange/EvictLocalMaterial | current正式visibility作用project/node范围；project撤销清全部 | project/stage/node/revision/return=null，selectionPosture cleared | hide/AT焦点清，后stop/delete | authority_missing |
| cleared | new empty/stale | ProjectNavigationFactory.fromRoute新对象 | ResolveEntryAccess | newroute generation+正式入口候选 | 新对象，不保留旧stage/授权 | local route+独立query | invalid_transition |

非法源约束：tab=progress不selected、不证明流程运行；工单/群聊→项目须Work正式关系与target access，不能从群成员推项目权限。ProjectNavigation没有PageLoadPosture，不发明六个page机器。 所有未列迁移invalid_transition，失败保留原值，无额外SDK调用、owner truth/trace/audit/outbox。

本cut审查：合法rowset完整；缺guard单项隔离；非法组合与新generation分离，不能凭共享enum漏掉本主体。

#### 6.3.6 ProjectDetailViewModel / PageLoadPosture

来源：03 §9.5.3。CUT-S-06；TC-STATE-016（合法全行）/TC-STATE-017（逐guard）/TC-STATE-018（非法全行）。P0，Vitest；数据FX-state；suite process；预约EV-CAND-process。

操作/断言按本节三类执行规则；合法行具体动作、字段与副作用如下：

| From | To | 触发函数 | Step9 flow | 可落码前置条件 | 字段更新 | local/SDK副作用 | 非法错误 |
|---|---|---|---|---|---|---|---|
| factory | loading | ProjectDetailFactory.forProject | LoadProjectDetail | 正式target/access/active source context满足；项目主access与各owner section独立；navigation只同root派生 | 材料初始空/null，不填缓存；loadPosture loading | 单root登记current request后SDK typed read | authority_missing/dependency_unbound |
| loading/partial/stale | ready | ProjectDetailFactory.applySection/applyWorkItems/applyEvidence/applyFlow/applyLinks | LoadProjectDetail/ConsumeFormalChange | formal qualified材料可解释且current slot/版本/visibility；所需主section齐备，独立sources不要求全局同版 | 更新projectReference、projectSummary/flowView/conversationLinks/workItems/evidenceRefs；loadPosture ready，marker分source | CAS checks覆盖各原incoming；no owner写 | context_changed/unsafe_material |
| loading/ready/stale/partial | partial | ProjectDetailFactory.applySection/applyWorkItems/applyEvidence/applyFlow/applyLinks/ProjectDetailFactory.failLoad | LoadProjectDetail/ConsumeFormalChange | 主访问仍safe可读，部分section不可用或formal coverage partial；缺完整性不得local补 | 保留获准section/marker；不允许旧未经验证引用；loadPosture partial | 分source CAS，不借父权限 | authority_missing/context_changed |
| ready/partial/loading | stale | ProjectDetailFactory.failLoad / parent/source失效协调 | LoadProjectDetail/ConsumeMaterialRevisionChange/ConsumeFormalChange | formal revision/gap不兼容或当前更严context失效；项目主access与各owner section独立；navigation只同root派生 | loadPosture stale，清不兼容关联/child/状态；safe候选不fresh | 先invalidate affected slots，再正式query | context_changed |
| loading/ready/partial/stale/unavailable | blocked | ProjectDetailFactory.restrict/ProjectDetailFactory.failLoad | LoadProjectDetail/ConsumeVisibilityChange/EvictLocalMaterial | 正式visibility收紧或dependency_unbound/authority_missing/unsafe_material，范围current | loadPosture blocked，清受影响projectReference、projectSummary/flowView/conversationLinks/workItems/evidenceRefs及焦点/return/page refs | 先hide，再stop/delete；失败不restore | authority_missing/context_changed |
| loading/ready/partial/stale | unavailable | ProjectDetailFactory.failLoad | LoadProjectDetail | 当前read明确暂不可用且没有正式missing结论，error当前slot；contract缺失必须blocked | 安全清未验证材料，loadPosture unavailable；无不存在断言 | local CAS/error UI，不private fallback | invalid_input/context_changed |
| blocked/unavailable/stale/partial/ready | new loading | ProjectDetailFactory.forProject / 新request | LoadProjectDetail | new active ConsumptionContext/current formal access；旧slot已失效，不能缓存升级 | new request/model empty safe初值，loadPosture loading | 当前root新代次，后SDK只读 | authority_missing |
| loading/ready/partial/stale/blocked/unavailable | same | 纯read/local display选择 | LoadProjectDetail/LoadAccessibilityContext | 只读current model，local选择不改变业务材料资格 | loadPosture不变；safe display派生 | read/纯local display | context_changed |

非法源约束：blocked/unavailable/旧generation直接ready且无new qualified read非法；ready非项目/Process/任务完成，partial不能隐藏source gap；aborted_read/context_changed不能失败回包覆盖新view。 所有未列迁移invalid_transition，失败保留原值，无额外SDK调用、owner truth/trace/audit/outbox。

本cut审查：合法rowset完整；缺guard单项隔离；非法组合与新generation分离，不能凭共享enum漏掉本主体。

#### 6.3.7 ProcessFlowViewModel / PageLoadPosture

来源：03 §9.5.4。CUT-S-07；TC-STATE-019（合法全行）/TC-STATE-020（逐guard）/TC-STATE-021（非法全行）。P0，Vitest；数据FX-state；suite process；预约EV-CAND-process。

操作/断言按本节三类执行规则；合法行具体动作、字段与副作用如下：

| From | To | 触发函数 | Step9 flow | 可落码前置条件 | 字段更新 | local/SDK副作用 | 非法错误 |
|---|---|---|---|---|---|---|---|
| factory | loading | ProcessFlowFactory.forContext | LoadProjectProcessFlow/LoadStageProcessFlow | 正式target/access/active source context满足；正式Process关联、拓扑/状态适用版本，fork/join/Gateway正式角色；图/list/AT同集合 | 材料初始空/null，不填缓存；loadPosture loading | 单root登记current request后SDK typed read | authority_missing/dependency_unbound |
| loading/partial/stale | ready | ProcessFlowFactory.applyTopology/applyState/applyGovernanceRefs | LoadProjectProcessFlow/LoadStageProcessFlow/ConsumeFormalChange | formal qualified材料可解释且current slot/版本/visibility；所需主section齐备，独立sources不要求全局同版 | 更新project/process/stage refs、topologyMaterial/stateMaterial、provenance/governanceRefs；loadPosture ready，marker分source | CAS checks覆盖各原incoming；no owner写 | context_changed/unsafe_material |
| loading/ready/stale/partial | partial | ProcessFlowFactory.applyTopology/applyState/applyGovernanceRefs/ProcessFlowFactory.failLoad | LoadProjectProcessFlow/LoadStageProcessFlow/ConsumeFormalChange | 主访问仍safe可读，部分section不可用或formal coverage partial；缺完整性不得local补 | 保留获准section/marker；不允许旧未经验证引用；loadPosture partial | 分source CAS，不借父权限 | authority_missing/context_changed |
| ready/partial/loading | stale | ProcessFlowFactory.failLoad / parent/source失效协调 | LoadProjectProcessFlow/LoadStageProcessFlow/ConsumeMaterialRevisionChange/ConsumeFormalChange | formal revision/gap不兼容或当前更严context失效；正式Process关联、拓扑/状态适用版本，fork/join/Gateway正式角色；图/list/AT同集合 | loadPosture stale，清不兼容关联/child/状态；safe候选不fresh | 先invalidate affected slots，再正式query | context_changed |
| loading/ready/partial/stale/unavailable | blocked | ProcessFlowFactory.restrict/ProcessFlowFactory.failLoad | LoadProjectProcessFlow/LoadStageProcessFlow/ConsumeVisibilityChange/EvictLocalMaterial | 正式visibility收紧或dependency_unbound/authority_missing/unsafe_material，范围current | loadPosture blocked，清受影响project/process/stage refs、topologyMaterial/stateMaterial、provenance/governanceRefs及焦点/return/page refs | 先hide，再stop/delete；失败不restore | authority_missing/context_changed |
| loading/ready/partial/stale | unavailable | ProcessFlowFactory.failLoad | LoadProjectProcessFlow/LoadStageProcessFlow | 当前read明确暂不可用且没有正式missing结论，error当前slot；contract缺失必须blocked | 安全清未验证材料，loadPosture unavailable；无不存在断言 | local CAS/error UI，不private fallback | invalid_input/context_changed |
| blocked/unavailable/stale/partial/ready | new loading | ProcessFlowFactory.forContext / 新request | LoadProjectProcessFlow/LoadStageProcessFlow | new active ConsumptionContext/current formal access；旧slot已失效，不能缓存升级 | new request/model empty safe初值，loadPosture loading | 当前root新代次，后SDK只读 | authority_missing |
| loading/ready/partial/stale/blocked/unavailable | same | 纯read/local display选择 | LoadProjectProcessFlow/LoadStageProcessFlow/LoadAccessibilityContext | 只读current model，local选择不改变业务材料资格 | loadPosture不变；safe display派生 | read/纯local display | context_changed |

非法源约束：blocked/unavailable/旧generation直接ready且无new qualified read非法；ready非项目/Process/任务完成，partial不能隐藏source gap；aborted_read/context_changed不能失败回包覆盖新view。 所有未列迁移invalid_transition，失败保留原值，无额外SDK调用、owner truth/trace/audit/outbox。

本cut审查：合法rowset完整；缺guard单项隔离；非法组合与新generation分离，不能凭共享enum漏掉本主体。

#### 6.3.8 ProcessNodeDetailViewModel / PageLoadPosture

来源：03 §9.5.5。CUT-S-08；TC-STATE-022（合法全行）/TC-STATE-023（逐guard）/TC-STATE-024（非法全行）。P0，Vitest；数据FX-state；suite process；预约EV-CAND-process。

操作/断言按本节三类执行规则；合法行具体动作、字段与副作用如下：

| From | To | 触发函数 | Step9 flow | 可落码前置条件 | 字段更新 | local/SDK副作用 | 非法错误 |
|---|---|---|---|---|---|---|---|
| factory | loading | NodeDetailFactory.forNode | LoadProcessNodeDetail | 正式target/access/active source context满足；current node及parentRevision、正式关联及每section独立source/access | 材料初始空/null，不填缓存；loadPosture loading | 单root登记current request后SDK typed read | authority_missing/dependency_unbound |
| loading/partial/stale | ready | NodeDetailFactory.applyAssociations/applySection | LoadProcessNodeDetail/ConsumeFormalChange | formal qualified材料可解释且current slot/版本/visibility；所需主section齐备，独立sources不要求全局同版 | 更新nodeReference/topologyRevision/associationRefs/sections；loadPosture ready，marker分source | CAS checks覆盖各原incoming；no owner写 | context_changed/unsafe_material |
| loading/ready/stale/partial | partial | NodeDetailFactory.applyAssociations/applySection/NodeDetailFactory.failLoad | LoadProcessNodeDetail/ConsumeFormalChange | 主访问仍safe可读，部分section不可用或formal coverage partial；缺完整性不得local补 | 保留获准section/marker；不允许旧未经验证引用；loadPosture partial | 分source CAS，不借父权限 | authority_missing/context_changed |
| ready/partial/loading | stale | NodeDetailFactory.failLoad / parent/source失效协调 | LoadProcessNodeDetail/ConsumeMaterialRevisionChange/ConsumeFormalChange | formal revision/gap不兼容或当前更严context失效；current node及parentRevision、正式关联及每section独立source/access | loadPosture stale，清不兼容关联/child/状态；safe候选不fresh | 先invalidate affected slots，再正式query | context_changed |
| loading/ready/partial/stale/unavailable | blocked | NodeDetailFactory.restrict/NodeDetailFactory.failLoad | LoadProcessNodeDetail/ConsumeVisibilityChange/EvictLocalMaterial | 正式visibility收紧或dependency_unbound/authority_missing/unsafe_material，范围current | loadPosture blocked，清受影响nodeReference/topologyRevision/associationRefs/sections及焦点/return/page refs | 先hide，再stop/delete；失败不restore | authority_missing/context_changed |
| loading/ready/partial/stale | unavailable | NodeDetailFactory.failLoad | LoadProcessNodeDetail | 当前read明确暂不可用且没有正式missing结论，error当前slot；contract缺失必须blocked | 安全清未验证材料，loadPosture unavailable；无不存在断言 | local CAS/error UI，不private fallback | invalid_input/context_changed |
| blocked/unavailable/stale/partial/ready | new loading | NodeDetailFactory.forNode / 新request | LoadProcessNodeDetail | new active ConsumptionContext/current formal access；旧slot已失效，不能缓存升级 | new request/model empty safe初值，loadPosture loading | 当前root新代次，后SDK只读 | authority_missing |
| loading/ready/partial/stale/blocked/unavailable | same | 纯read/local display选择 | LoadProcessNodeDetail/LoadAccessibilityContext | 只读current model，local选择不改变业务材料资格 | loadPosture不变；safe display派生 | read/纯local display | context_changed |

非法源约束：blocked/unavailable/旧generation直接ready且无new qualified read非法；ready非项目/Process/任务完成，partial不能隐藏source gap；aborted_read/context_changed不能失败回包覆盖新view。 所有未列迁移invalid_transition，失败保留原值，无额外SDK调用、owner truth/trace/audit/outbox。

本cut审查：合法rowset完整；缺guard单项隔离；非法组合与新generation分离，不能凭共享enum漏掉本主体。

#### 6.3.9 ProjectConversationLinkViewModel / PageLoadPosture

来源：03 §9.5.6。CUT-S-09；TC-STATE-025（合法全行）/TC-STATE-026（逐guard）/TC-STATE-027（非法全行）。P0，Vitest；数据FX-state；suite directory；预约EV-CAND-directory。

操作/断言按本节三类执行规则；合法行具体动作、字段与副作用如下：

| From | To | 触发函数 | Step9 flow | 可落码前置条件 | 字段更新 | local/SDK副作用 | 非法错误 |
|---|---|---|---|---|---|---|---|
| factory | loading | ProjectConversationLinkFactory.forAnchor | LoadProjectConversationLinks | 正式target/access/active source context满足；provider正式owner/version；每target独立入口资格，关系不赋目标access | 材料初始空/null，不填缓存；loadPosture loading | 单root登记current request后SDK typed read | authority_missing/dependency_unbound |
| loading/partial/stale | ready | ProjectConversationLinkFactory.applyRelationship/applyTargetAccess | LoadProjectConversationLinks/ConsumeFormalChange | formal qualified材料可解释且current slot/版本/visibility；所需主section齐备，独立sources不要求全局同版 | 更新anchorReference/relationshipMaterial/targets/provenance；loadPosture ready，marker分source | CAS checks覆盖各原incoming；no owner写 | context_changed/unsafe_material |
| loading/ready/stale/partial | partial | ProjectConversationLinkFactory.applyRelationship/applyTargetAccess/ProjectConversationLinkFactory.failLoad | LoadProjectConversationLinks/ConsumeFormalChange | 主访问仍safe可读，部分section不可用或formal coverage partial；缺完整性不得local补 | 保留获准section/marker；不允许旧未经验证引用；loadPosture partial | 分source CAS，不借父权限 | authority_missing/context_changed |
| ready/partial/loading | stale | ProjectConversationLinkFactory.failLoad / parent/source失效协调 | LoadProjectConversationLinks/ConsumeMaterialRevisionChange/ConsumeFormalChange | formal revision/gap不兼容或当前更严context失效；provider正式owner/version；每target独立入口资格，关系不赋目标access | loadPosture stale，清不兼容关联/child/状态；safe候选不fresh | 先invalidate affected slots，再正式query | context_changed |
| loading/ready/partial/stale/unavailable | blocked | ProjectConversationLinkFactory.restrict/ProjectConversationLinkFactory.failLoad | LoadProjectConversationLinks/ConsumeVisibilityChange/EvictLocalMaterial | 正式visibility收紧或dependency_unbound/authority_missing/unsafe_material，范围current | loadPosture blocked，清受影响anchorReference/relationshipMaterial/targets/provenance及焦点/return/page refs | 先hide，再stop/delete；失败不restore | authority_missing/context_changed |
| loading/ready/partial/stale | unavailable | ProjectConversationLinkFactory.failLoad | LoadProjectConversationLinks | 当前read明确暂不可用且没有正式missing结论，error当前slot；contract缺失必须blocked | 安全清未验证材料，loadPosture unavailable；无不存在断言 | local CAS/error UI，不private fallback | invalid_input/context_changed |
| blocked/unavailable/stale/partial/ready | new loading | ProjectConversationLinkFactory.forAnchor / 新request | LoadProjectConversationLinks | new active ConsumptionContext/current formal access；旧slot已失效，不能缓存升级 | new request/model empty safe初值，loadPosture loading | 当前root新代次，后SDK只读 | authority_missing |
| loading/ready/partial/stale/blocked/unavailable | same | 纯read/local display选择 | LoadProjectConversationLinks/LoadAccessibilityContext | 只读current model，local选择不改变业务材料资格 | loadPosture不变；safe display派生 | read/纯local display | context_changed |

非法源约束：blocked/unavailable/旧generation直接ready且无new qualified read非法；ready非项目/Process/任务完成，partial不能隐藏source gap；aborted_read/context_changed不能失败回包覆盖新view。 所有未列迁移invalid_transition，失败保留原值，无额外SDK调用、owner truth/trace/audit/outbox。

本cut审查：合法rowset完整；缺guard单项隔离；非法组合与新generation分离，不能凭共享enum漏掉本主体。

#### 6.3.10 CompanyDirectoryViewModel / PageLoadPosture

来源：03 §9.5.7。CUT-S-10；TC-STATE-028（合法全行）/TC-STATE-029（逐guard）/TC-STATE-030（非法全行）。P0，Vitest；数据FX-state；suite directory；预约EV-CAND-directory。

操作/断言按本节三类执行规则；合法行具体动作、字段与副作用如下：

| From | To | 触发函数 | Step9 flow | 可落码前置条件 | 字段更新 | local/SDK副作用 | 非法错误 |
|---|---|---|---|---|---|---|---|
| factory | loading | CompanyDirectoryFactory.forProvider | LoadCompanyDirectory/UpdateDirectorySearch | 正式target/access/active source context满足；formal provider/人类AIcoverage、current query代次/page lineage，nextPageRef只读派生 | 材料初始空/null，不填缓存；loadPosture loading | 单root登记current request后SDK typed read | authority_missing/dependency_unbound |
| loading/partial/stale | ready | CompanyDirectoryFactory.applyPage | LoadCompanyDirectory/UpdateDirectorySearch/ConsumeFormalChange | formal qualified材料可解释且current slot/版本/visibility；所需主section齐备，独立sources不要求全局同版 | 更新providerReference/searchState/people/pageInfo/nextPageRef/coverage；loadPosture ready，marker分source | CAS checks覆盖各原incoming；no owner写 | context_changed/unsafe_material |
| loading/ready/stale/partial | partial | CompanyDirectoryFactory.applyPage/CompanyDirectoryFactory.failLoad | LoadCompanyDirectory/UpdateDirectorySearch/ConsumeFormalChange | 主访问仍safe可读，部分section不可用或formal coverage partial；缺完整性不得local补 | 保留获准section/marker；不允许旧未经验证引用；loadPosture partial | 分source CAS，不借父权限 | authority_missing/context_changed |
| ready/partial/loading | stale | CompanyDirectoryFactory.failLoad / parent/source失效协调 | LoadCompanyDirectory/UpdateDirectorySearch/ConsumeMaterialRevisionChange/ConsumeFormalChange | formal revision/gap不兼容或当前更严context失效；formal provider/人类AIcoverage、current query代次/page lineage，nextPageRef只读派生 | loadPosture stale，清不兼容关联/child/状态；safe候选不fresh | 先invalidate affected slots，再正式query | context_changed |
| loading/ready/partial/stale/unavailable | blocked | CompanyDirectoryFactory.restrict/CompanyDirectoryFactory.failLoad | LoadCompanyDirectory/UpdateDirectorySearch/ConsumeVisibilityChange/EvictLocalMaterial | 正式visibility收紧或dependency_unbound/authority_missing/unsafe_material，范围current | loadPosture blocked，清受影响providerReference/searchState/people/pageInfo/nextPageRef/coverage及焦点/return/page refs | 先hide，再stop/delete；失败不restore | authority_missing/context_changed |
| loading/ready/partial/stale | unavailable | CompanyDirectoryFactory.failLoad | LoadCompanyDirectory/UpdateDirectorySearch | 当前read明确暂不可用且没有正式missing结论，error当前slot；contract缺失必须blocked | 安全清未验证材料，loadPosture unavailable；无不存在断言 | local CAS/error UI，不private fallback | invalid_input/context_changed |
| blocked/unavailable/stale/partial/ready | new loading | CompanyDirectoryFactory.forProvider / 新request | LoadCompanyDirectory/UpdateDirectorySearch | new active ConsumptionContext/current formal access；旧slot已失效，不能缓存升级 | new request/model empty safe初值，loadPosture loading | 当前root新代次，后SDK只读 | authority_missing |
| loading/ready/partial/stale/blocked/unavailable | same | 纯read/local display选择 | LoadCompanyDirectory/UpdateDirectorySearch/LoadAccessibilityContext | 只读current model，local选择不改变业务材料资格 | loadPosture不变；safe display派生 | read/纯local display | context_changed |

非法源约束：blocked/unavailable/旧generation直接ready且无new qualified read非法；ready非项目/Process/任务完成，partial不能隐藏source gap；aborted_read/context_changed不能失败回包覆盖新view。 所有未列迁移invalid_transition，失败保留原值，无额外SDK调用、owner truth/trace/audit/outbox。

本cut审查：合法rowset完整；缺guard单项隔离；非法组合与新generation分离，不能凭共享enum漏掉本主体。

#### 6.3.11 DraftState / DraftPhase

来源：03 §9.6.1。CUT-S-11；TC-STATE-031（合法全行）/TC-STATE-032（逐guard）/TC-STATE-033（非法全行）。P0，Vitest；数据FX-state；suite intent；预约EV-CAND-intent。

操作/断言按本节三类执行规则；合法行具体动作、字段与副作用如下：

| From | To | 触发函数 | Step9 flow | 可落码前置条件 | 字段更新 | local/SDK副作用 | 非法错误 |
|---|---|---|---|---|---|---|---|
| factory | empty | DraftFactory.empty | LoadDraft/local explicit编辑helper | current verified Conversation context；local draftId，项目目录禁止建稿 | text空/ref空/revision0/submittingIntent=null | unique root draft map，不owner写 | authority_missing |
| factory | restored | DraftFactory.restore | RestoreAfterShellRestart | 正式safe serializer/storage资格+currentaccess；本轮默认正文durable禁用 | 恢复候选revision，checkedRevision=null、issues待校验 | 本轮text恢复正向blocked，不宣称持久化 | dependency_unbound |
| empty/editing/invalid/locally_valid/restored/cleared | editing | DraftFactory.edit/attach/setReplyTarget | local composer callback/SubmitConversationIntent准备 | text/ref/reply safe当前context；newRevision=old+1 safeinteger；cleared仅新revision | safeText/ref/reply更新，validation失效、submittingIntent=null | local CAS，编辑不取消旧attempt | invalid_input/unsafe_material |
| submitting | editing | DraftFactory.edit | local composer callback/SubmitConversationIntent进行中 | 显式用户编辑，revision+1，旧attempt已reserved不得复用调用权 | 新稿保留、校验失效、清新draft.submittingIntent；旧attempt关联不删 | local CAS，不owner cancel | invalid_input |
| editing/restored/invalid/locally_valid | locally_valid | DraftFactory.validate | SubmitConversationIntent前local validate | checkedRevision=current revision；issues=[]；当前access与DraftPolicy结构条件满足 | validation当前revision、phase locally_valid | local CAS；非owner允许发送 | invalid_transition |
| editing/restored/invalid/locally_valid | invalid | DraftFactory.validate | SubmitConversationIntent前local validate | issues包含empty/too_long/unsafe_ref/context_unverified任一；有限code | checkedRevision=current、issues完整、phase invalid | local only，不prepare/dispatch | invalid_input |
| locally_valid | submitting | DraftFactory.markSubmitting | SubmitConversationIntent | expectedRevision==current，currentaccess/capability另验，intent来自local reservation | submittingIntent填当前intent、phase submitting | 与attempt reservation同root CAS，后no-effect prepare | context_changed/local_conflict |
| submitting | editing | DraftFactory.releaseSubmission | SubmitConversationIntent pre-dispatch失败/ConsumeCommandReceiptOrResult正式failed/rejected | 同draftRef/revision/submittingIntent且attempt failed/rejected；unknown/pending/confirmed拒绝 | 保留text/ref/revision，清submitting关联及旧validation，后validate才能locally_valid/invalid | local CAS，未知attempt不重发 | invalid_transition |
| empty/editing/locally_valid/invalid/submitting/restored | cleared | DraftFactory.clear | ConsumeCommandReceiptOrResult/ConsumeVisibilityChange/EvictLocalMaterial | 正式confirmed_revision只draftRef/revision完全匹配；revoke/logout只当前范围；user_discard明确 | safeText=''、refs=[]/reply=null/submitting=null；phase cleared | 单root或安全cleanup CAS；text不诊断 | context_changed |
| submitting | submitting | 重复相同revision提交读取 | SubmitConversationIntent重复点击 | 同draft/revision已有nonterminal attempt | 返回已有feedback，draft不变 | 无第二SDK调用 | invalid_transition |

非法源约束：locally_valid不server授权；validation旧revision不能submit。unknown/result timeout不清稿或自动重放。confirmed旧revision不能清编辑后的稿，cleared新编辑必须revision推进。 所有未列迁移invalid_transition，失败保留原值，无额外SDK调用、owner truth/trace/audit/outbox。

本cut审查：合法rowset完整；缺guard单项隔离；非法组合与新generation分离，不能凭共享enum漏掉本主体。

#### 6.3.12 CommandAttemptState / CommandResultPosture

来源：03 §9.6.2。CUT-S-12；TC-STATE-034（合法全行）/TC-STATE-035（逐guard）/TC-STATE-036（非法全行）。P0，Vitest；数据FX-state；suite intent；预约EV-CAND-intent。

操作/断言按本节三类执行规则；合法行具体动作、字段与副作用如下：

| From | To | 触发函数 | Step9 flow | 可落码前置条件 | 字段更新 | local/SDK副作用 | 非法错误 |
|---|---|---|---|---|---|---|---|
| factory | draft | AttemptFactory.fromDraft/fromGovernance | SubmitConversationIntent/SubmitGovernanceIntent | currentactor/fence/capability，conversation draft pair或Governance gate/action完整 | intent/kind/fence/actor及draft或Gate/action；association/receipt/result=null；dispatched=false | local reservation CAS，SDK无调用 | invalid_input/authority_missing |
| draft | draft | AttemptFactory.bindIdempotency | Submit*Intent | formal no-effect prepare返回association，sameintent/actor/fence；payload SDK冻结 | association填formal handle，dispatched仍false | CAS候选，可与调用权reservation合并 | authority_missing |
| draft | submitted | AttemptFactory.reserveDispatch | Submit*Intent | preparedRef正式registry、association非null，当前slot/capability，唯一CAS胜出 | dispatched=true、submitted、nextAction=wait；no request body | CAS后至多一次SDK.dispatch，不要等ACK再标 | context_changed/local_conflict |
| draft | failed | AttemptFactory.failBeforeDispatch | Submit*Intent | dispatched=false且确定未调用；no-effect prepare失败保证正式，无owner effect | failed/none、safe reason；保留/重验稿 | localCAS，零dispatch | invalid_transition |
| submitted | pending | AttemptFactory.applyResult/applyReceipt；CommandResultGate.evaluate/resolveUnknown | ConsumeCommandReceiptOrResult/ProbeCommandAttempt/ResolveUnknownAttempt/Submit*Intent | sameintent/fence/actor/association/current slot；formal处理中material，或正式pending receipt（unknown转pending只formal probe/result） | resultPosture=pending，result/receipt仅formal；nextAction=wait | local attempts CAS；confirmed仅同revision清稿，其他保留；不重新dispatch | authority_missing/invalid_transition/context_changed |
| submitted | confirmed | AttemptFactory.applyResult/applyReceipt；CommandResultGate.evaluate/resolveUnknown | ConsumeCommandReceiptOrResult/ProbeCommandAttempt/ResolveUnknownAttempt/Submit*Intent | sameintent/fence/actor/association/current slot；正式committed authority且effect=committed、formal resultRef或明确business-confirming receiptRef | resultPosture=confirmed，result/receipt仅formal；nextAction=none | local attempts CAS；confirmed仅同revision清稿，其他保留；不重新dispatch | authority_missing/invalid_transition/context_changed |
| submitted | rejected | AttemptFactory.applyResult/applyReceipt；CommandResultGate.evaluate/resolveUnknown | ConsumeCommandReceiptOrResult/ProbeCommandAttempt/ResolveUnknownAttempt/Submit*Intent | sameintent/fence/actor/association/current slot；正式业务拒绝material.effect=rejected且formal resultRef | resultPosture=rejected，result/receipt仅formal；nextAction=none | local attempts CAS；confirmed仅同revision清稿，其他保留；不重新dispatch | authority_missing/invalid_transition/context_changed |
| submitted | failed | AttemptFactory.applyResult/applyReceipt；CommandResultGate.evaluate/resolveUnknown | ConsumeCommandReceiptOrResult/ProbeCommandAttempt/ResolveUnknownAttempt/Submit*Intent | sameintent/fence/actor/association/current slot；正式material.effect=no_effect且关联可核对，不能仅HTTP失败/not_found | resultPosture=failed，result/receipt仅formal；nextAction=none | local attempts CAS；confirmed仅同revision清稿，其他保留；不重新dispatch | authority_missing/invalid_transition/context_changed |
| submitted | unknown | AttemptFactory.markUnknown / gate unresolved | ConsumeCommandReceiptOrResult/ProbeCommandAttempt/ResolveUnknownAttempt/Submit*Intent | sameintent/fence/actor/association/current slot；dispatched=true且副作用未能证明；非terminal | resultPosture=unknown，result/receipt仅formal；nextAction=probe | local attempts CAS；confirmed仅同revision清稿，其他保留；不重新dispatch | authority_missing/invalid_transition/context_changed |
| pending | pending | AttemptFactory.applyResult/applyReceipt；CommandResultGate.evaluate/resolveUnknown | ConsumeCommandReceiptOrResult/ProbeCommandAttempt/ResolveUnknownAttempt/Submit*Intent | sameintent/fence/actor/association/current slot；formal处理中material，或正式pending receipt（unknown转pending只formal probe/result） | resultPosture=pending，result/receipt仅formal；nextAction=wait | local attempts CAS；confirmed仅同revision清稿，其他保留；不重新dispatch | authority_missing/invalid_transition/context_changed |
| pending | confirmed | AttemptFactory.applyResult/applyReceipt；CommandResultGate.evaluate/resolveUnknown | ConsumeCommandReceiptOrResult/ProbeCommandAttempt/ResolveUnknownAttempt/Submit*Intent | sameintent/fence/actor/association/current slot；正式committed authority且effect=committed、formal resultRef或明确business-confirming receiptRef | resultPosture=confirmed，result/receipt仅formal；nextAction=none | local attempts CAS；confirmed仅同revision清稿，其他保留；不重新dispatch | authority_missing/invalid_transition/context_changed |
| pending | rejected | AttemptFactory.applyResult/applyReceipt；CommandResultGate.evaluate/resolveUnknown | ConsumeCommandReceiptOrResult/ProbeCommandAttempt/ResolveUnknownAttempt/Submit*Intent | sameintent/fence/actor/association/current slot；正式业务拒绝material.effect=rejected且formal resultRef | resultPosture=rejected，result/receipt仅formal；nextAction=none | local attempts CAS；confirmed仅同revision清稿，其他保留；不重新dispatch | authority_missing/invalid_transition/context_changed |
| pending | failed | AttemptFactory.applyResult/applyReceipt；CommandResultGate.evaluate/resolveUnknown | ConsumeCommandReceiptOrResult/ProbeCommandAttempt/ResolveUnknownAttempt/Submit*Intent | sameintent/fence/actor/association/current slot；正式material.effect=no_effect且关联可核对，不能仅HTTP失败/not_found | resultPosture=failed，result/receipt仅formal；nextAction=none | local attempts CAS；confirmed仅同revision清稿，其他保留；不重新dispatch | authority_missing/invalid_transition/context_changed |
| pending | unknown | AttemptFactory.markUnknown / gate unresolved | ConsumeCommandReceiptOrResult/ProbeCommandAttempt/ResolveUnknownAttempt/Submit*Intent | sameintent/fence/actor/association/current slot；dispatched=true且副作用未能证明；非terminal | resultPosture=unknown，result/receipt仅formal；nextAction=probe | local attempts CAS；confirmed仅同revision清稿，其他保留；不重新dispatch | authority_missing/invalid_transition/context_changed |
| unknown | pending | AttemptFactory.applyResult/applyReceipt；CommandResultGate.evaluate/resolveUnknown | ConsumeCommandReceiptOrResult/ProbeCommandAttempt/ResolveUnknownAttempt/Submit*Intent | sameintent/fence/actor/association/current slot；formal处理中material，或正式pending receipt（unknown转pending只formal probe/result） | resultPosture=pending，result/receipt仅formal；nextAction=wait | local attempts CAS；confirmed仅同revision清稿，其他保留；不重新dispatch | authority_missing/invalid_transition/context_changed |
| unknown | confirmed | AttemptFactory.applyResult/applyReceipt；CommandResultGate.evaluate/resolveUnknown | ConsumeCommandReceiptOrResult/ProbeCommandAttempt/ResolveUnknownAttempt/Submit*Intent | sameintent/fence/actor/association/current slot；正式committed authority且effect=committed、formal resultRef或明确business-confirming receiptRef | resultPosture=confirmed，result/receipt仅formal；nextAction=none | local attempts CAS；confirmed仅同revision清稿，其他保留；不重新dispatch | authority_missing/invalid_transition/context_changed |
| unknown | rejected | AttemptFactory.applyResult/applyReceipt；CommandResultGate.evaluate/resolveUnknown | ConsumeCommandReceiptOrResult/ProbeCommandAttempt/ResolveUnknownAttempt/Submit*Intent | sameintent/fence/actor/association/current slot；正式业务拒绝material.effect=rejected且formal resultRef | resultPosture=rejected，result/receipt仅formal；nextAction=none | local attempts CAS；confirmed仅同revision清稿，其他保留；不重新dispatch | authority_missing/invalid_transition/context_changed |
| unknown | failed | AttemptFactory.applyResult/applyReceipt；CommandResultGate.evaluate/resolveUnknown | ConsumeCommandReceiptOrResult/ProbeCommandAttempt/ResolveUnknownAttempt/Submit*Intent | sameintent/fence/actor/association/current slot；正式material.effect=no_effect且关联可核对，不能仅HTTP失败/not_found | resultPosture=failed，result/receipt仅formal；nextAction=none | local attempts CAS；confirmed仅同revision清稿，其他保留；不重新dispatch | authority_missing/invalid_transition/context_changed |
| unknown | unknown | AttemptFactory.markUnknown / gate unresolved | ConsumeCommandReceiptOrResult/ProbeCommandAttempt/ResolveUnknownAttempt/Submit*Intent | sameintent/fence/actor/association/current slot；dispatched=true且副作用未能证明；非terminal | resultPosture=unknown，result/receipt仅formal；nextAction=probe | local attempts CAS；confirmed仅同revision清稿，其他保留；不重新dispatch | authority_missing/invalid_transition/context_changed |
| confirmed/rejected/failed | same | 重复sameformal结果或local read | ConsumeCommandReceiptOrResult/ProbeCommandAttempt | 同correlation与同正式terminal结果identity；冲突结果不覆盖 | 终态保持，反馈只读 | no-op，零SDK业务调用 | invalid_transition |
| failed/rejected | new draft（新intent） | UserIntentCoordinator.retry + AttemptFactory factory | 显式retry helper/Submit*Intent | ExplicitRetryInput.previousIntent关联已terminal非confirmed；当前formal retryAllowed、capability、用户明确、新draftRevision/Gate/action重新验证 | 新intentId/association独立、旧保持终态 | 新logical intent完整reservation，非重放旧unknown | access_denied/invalid_transition |

非法源约束：按钮/HTTP2xx/websocket/AG-UI ACK/普通receipt、cache/fake不得confirmed；unknown不得draft/submitted重新dispatch，not_found无正式no-effect结果不能failed。terminal冲突结果拒绝，不变成第二成功；retry只新用户intent。 所有未列迁移invalid_transition，失败保留原值，无额外SDK调用、owner truth/trace/audit/outbox。

本cut审查：合法rowset完整；缺guard单项隔离；非法组合与新generation分离，不能凭共享enum漏掉本主体。

#### 6.3.13 FreshnessMarker / FreshnessState

来源：03 §9.7.1。CUT-S-13；TC-STATE-037（合法全行）/TC-STATE-038（逐guard）/TC-STATE-039（非法全行）。P0，Vitest；数据FX-state；suite continuity；预约EV-CAND-continuity。

操作/断言按本节三类执行规则；合法行具体动作、字段与副作用如下：

| From | To | 触发函数 | Step9 flow | 可落码前置条件 | 字段更新 | local/SDK副作用 | 非法错误 |
|---|---|---|---|---|---|---|---|
| factory | unknown/stale/partial/fresh | FreshnessInterpreter.fromRevision | Load*/ResumeChangeContext/ConsumeResumeResult | formal qualified source/context；fresh必须revisionRef/coverageRef非null并正式覆盖成立 | state/revisionRef/coverageRef/reason完整source-local | 随materials/surface/page CAS，无业务提交 | authority_missing |
| fresh | stale | FreshnessInterpreter.markStale | ConsumeMaterialRevisionChange/ConsumeShellLifecycle/RefreshStaleMaterial准备 | 已知source更新/gap或更严本地失效，旧access仍独立可验 | state stale，finite reason；保留最后正式revision仅候选 | local CAS/readonly refresh | context_changed |
| fresh/stale/unknown | partial | FreshnessInterpreter.fromRevision | Load*/ConsumeResumeResult | 正式coverage partial且current source资格，不以items数量推 | state partial、formal marker，原source隔离 | qualified CAS，无全局snapshot | authority_missing |
| fresh/stale/partial | unknown | 当前source资格失效的安全裁剪 | ConsumeFormalChange/ConsumeShellLifecycle | 无法解释当前revision/coverage，不能假stale=fresh | clear不能证明的coverage/revision，state unknown；不披露无资格内容 | 收紧local；requery资格不足blocked | invalid_transition |
| stale/partial/unknown | fresh | FreshnessInterpreter.fromRevision | Load*/RefreshStaleMaterial/ConsumeResumeResult | newformal current revision/coverage完整，current slot/source一致；resume正式feed边界 | state fresh、formal new marker，clear stale reason | qualified CAS，仅本source | authority_missing/context_changed |
| fresh/stale/partial/unknown | expired | FreshnessInterpreter.expire | ConsumeEvictionTrigger/EvictLocalMaterial/正式expiry变化 | formal expiry或local更严格期限，不按TTL生成fresh | expired，coverage清；正文/ref按披露收紧 | hide/cleanup；no owner expiry写 | invalid_input |
| expired | new fresh/partial/unknown | 新formal material factory/fromRevision | RefreshStaleMaterial/Load* | 新正式材料/新request qualification，旧expired版本不复活 | 新材料marker，对应正式source版本 | replace safe snapshot CAS | authority_missing |

非法源约束：cache命中、reconnect成功、HTTP200、SDK ACK、local TTL仍有效都不能fresh；Work/Runtime源fresh不证明Process/Governance源。unknown无visibility qualification不能显示正文。 所有未列迁移invalid_transition，失败保留原值，无额外SDK调用、owner truth/trace/audit/outbox。

本cut审查：合法rowset完整；缺guard单项隔离；非法组合与新generation分离，不能凭共享enum漏掉本主体。

#### 6.3.14 SafeMaterialSnapshot / DisclosurePosture

来源：03 §9.7.2。CUT-S-14；TC-STATE-040（合法全行）/TC-STATE-041（逐guard）/TC-STATE-042（非法全行）。P0，Vitest；数据FX-state；suite persistence；预约EV-CAND-persistence。

操作/断言按本节三类执行规则；合法行具体动作、字段与副作用如下：

| From | To | 触发函数 | Step9 flow | 可落码前置条件 | 字段更新 | local/SDK副作用 | 非法错误 |
|---|---|---|---|---|---|---|---|
| factory | visible/redacted | SafeMaterialFactory.fromQualified / SafeMaterialComposer.compose | LoadOwnerSummary/Load*/ConsumeFormalChange | sameowner/source/fence/current slot；formal visibility/redaction；content safe allowlist，fake隔离 | materialId local，owner/provenance/content正式safe，freshness分source | root materials/slice CAS，无body durable | unsafe_material/authority_missing |
| visible | redacted | SafeMaterialComposer.compose / Snapshot.restrict | ConsumeVisibilityChange/正式材料刷新 | 新的正式safe redaction或本地更严格裁剪，不能从原body自造所谓safe恢复 | 仅批准textTokens/references/labels，移除不获准字段 | local pure裁剪+CAS，AT同安全内容 | unsafe_material |
| visible/redacted/unavailable | restricted | SafeMaterialFactory.restrict /对应view restrict | ConsumeVisibilityChange/ConsumeShellLifecycle/EvictLocalMaterial | current安全收紧；缺访问时不保留owner label/ref等泄露信息 | content=null；subject refs/provenance按资格清；finite reason | hide先，再stop/delete | authority_missing/context_changed |
| visible/redacted/restricted | unavailable | SafeMaterialFactory.restrict /当前safe材料缺口 | Load*/RefreshStaleMaterial error | 无当前safe material或正式能力暂不可用，不存在推断 | content/ref清，safe posture unavailable | local error UI，no private body fallback | invalid_transition |
| visible/redacted/restricted/unavailable | cleared | SafeMaterialFactory.clear | ConsumeVisibilityChange/EvictLocalMaterial/ConsumeShellLifecycle | trusted current affected scope/target或local更严格清理 | ownerRef/provenance/content=null，disclosure cleared | CAS hide、后repo确认删除；memoryclear不durable证明 | context_changed |
| restricted/unavailable/cleared | new visible/redacted | SafeMaterialFactory.fromQualified新材料 | Load*/RefreshStaleMaterial | newformal registry/access/current source，不复用旧实例资格 | 新snapshot safe内容；旧cleared不复活 | qualified replace CAS | authority_missing |

非法源约束：本地展开/按钮/host capability/缓存命中不能扩大disclosure；redacted只正式安全映射，不从raw source猜脱敏。cleared旧材料不可取回原text/ref。 所有未列迁移invalid_transition，失败保留原值，无额外SDK调用、owner truth/trace/audit/outbox。

本cut审查：合法rowset完整；缺guard单项隔离；非法组合与新generation分离，不能凭共享enum漏掉本主体。

#### 6.3.15 ContinuityState / ContinuityPhase

来源：03 §9.7.3。CUT-S-15；TC-STATE-043（合法全行）/TC-STATE-044（逐guard）/TC-STATE-045（非法全行）。P0，Vitest；数据FX-state；suite continuity；预约EV-CAND-continuity。

操作/断言按本节三类执行规则；合法行具体动作、字段与副作用如下：

| From | To | 触发函数 | Step9 flow | 可落码前置条件 | 字段更新 | local/SDK副作用 | 非法错误 |
|---|---|---|---|---|---|---|---|
| factory | blocked/stale | ContinuityFactory.initial | ResolveEntryAccess/LoadResumeContext | unbound source/null context→blocked；正式source+matched active context→stale | source/消费语境当前；cursor/revision/gap/recovery为空，nextAction requery | local source map，no feed presumedfresh | authority_missing |
| factory | stale | ContinuityFactory.fromCache | RestoreAfterShellRestart | safe缓存候选，cursor须formal rebind | stale，绝不fresh，source资格独立 | local recovery候选 | dependency_unbound |
| fresh | fresh | ContinuityFactory.accept | ConsumeFormalChange | ChangeAcceptanceRecord accepted且formal连续current source；SDK明确identity/order/coverage | lastAcceptedRevision/cursor正式更新，consumed key同source CAS | 一次root payload/cursor/consumed原子；no business command | continuity_gap |
| fresh/stale/reconnecting/resuming | gap | ContinuityFactory.markGap | ConsumeFormalChange/ConsumeResumeResult | SDK明确formal gapRef，source一致；无法descriptor则blocked | gapRef填、nextAction=requery，保留最后accepted cursor | safe state CAS，后source requery | authority_missing |
| fresh | stale | source安全失效/requery policy | ConsumeMaterialRevisionChange/ConsumeShellLifecycle | 正式source变动/更严失效，不能将其他owner新版视为本source顺序 | stale/nextAction requery；不乱移cursor | local安全收紧 | context_changed |
| fresh/stale/gap | reconnecting | ContinuityFactory.markReconnecting | ConsumeShellLifecycle | 可信offline/foreground连接恢复，无current restricted/blocked | reconnecting，保持最后cursor候选 | technicalSDK/host，无fresh声明 | invalid_transition |
| stale/gap/reconnecting/blocked/needs_action | resuming | ContinuityFactory.beginResume | ResumeChangeContext/RequeryAfterGap/AcknowledgeLocalRecoveryAction | formal capability与重新验证active context；allowed action，newrecovery source一致；同source single-flight | activeRecovery必填、phase resuming，nextAction wait | localCAS后唯一只读resume/requery | authority_missing/invalid_transition |
| resuming | fresh | ContinuityFactory.applyResumeResult / requireAction | ConsumeResumeResult/ResumeChangeContext/RequeryAfterGap | samecurrent source/fence/request/recovery；status complete且formal revision+coverage+feed boundary成立 | phase=fresh；cursor/gap/revision仅formal，activeRecovery完成后清/按正式pending保留；nextAction安全选择 | root来源slice/watermark/consumed同CAS，无业务重放 | context_changed/authority_missing |
| resuming | stale | ContinuityFactory.applyResumeResult / requireAction | ConsumeResumeResult/ResumeChangeContext/RequeryAfterGap | samecurrent source/fence/request/recovery；status partial且有限覆盖 | phase=stale；cursor/gap/revision仅formal，activeRecovery完成后清/按正式pending保留；nextAction安全选择 | root来源slice/watermark/consumed同CAS，无业务重放 | context_changed/authority_missing |
| resuming | gap | ContinuityFactory.applyResumeResult / requireAction | ConsumeResumeResult/ResumeChangeContext/RequeryAfterGap | samecurrent source/fence/request/recovery；status gap且formal gapRef | phase=gap；cursor/gap/revision仅formal，activeRecovery完成后清/按正式pending保留；nextAction安全选择 | root来源slice/watermark/consumed同CAS，无业务重放 | context_changed/authority_missing |
| resuming | restricted | ContinuityFactory.applyResumeResult / requireAction | ConsumeResumeResult/ResumeChangeContext/RequeryAfterGap | samecurrent source/fence/request/recovery；status denied/正式visibility当前范围 | phase=restricted；cursor/gap/revision仅formal，activeRecovery完成后清/按正式pending保留；nextAction安全选择 | root来源slice/watermark/consumed同CAS，无业务重放 | context_changed/authority_missing |
| resuming | blocked | ContinuityFactory.applyResumeResult / requireAction | ConsumeResumeResult/ResumeChangeContext/RequeryAfterGap | samecurrent source/fence/request/recovery；status blocked/缺contract | phase=blocked；cursor/gap/revision仅formal，activeRecovery完成后清/按正式pending保留；nextAction安全选择 | root来源slice/watermark/consumed同CAS，无业务重放 | context_changed/authority_missing |
| resuming | needs_action | ContinuityFactory.applyResumeResult / requireAction | ConsumeResumeResult/ResumeChangeContext/RequeryAfterGap | samecurrent source/fence/request/recovery；正式恢复无法安全继续且finite reason/用户操作要求 | phase=needs_action；cursor/gap/revision仅formal，activeRecovery完成后清/按正式pending保留；nextAction安全选择 | root来源slice/watermark/consumed同CAS，无业务重放 | context_changed/authority_missing |
| fresh/stale/gap/reconnecting/resuming | restricted/blocked | ContinuityFactory.restrict /安全contract失效 | ConsumeVisibilityChange/ConsumeShellLifecycle | formalcurrent范围或更严contract blocked，scope revoke不依赖oldslot active | 清cursor/gap/recovery，nextAction clear/needs_action | 先hide/invalidate，后stop/delete | authority_missing |
| fresh/stale/gap/reconnecting/resuming/blocked | needs_action | ContinuityFactory.requireAction | ResumeChangeContext/RequeryAfterGap/AcknowledgeLocalRecoveryAction | 当前不能自动安全恢复，finite reason；不新增resend动作 | phase needs_action，finite safe next action | local UI/显式用户选择 | invalid_input |
| restricted/blocked/needs_action | new stale | ContinuityFactory.initial新context | ResolveEntryAccess/LoadResumeContext | newqualified current session/scope/source/visibility，旧refs已clear | 新source语境、no cursor trust，stale/requery | 新query/resume起点 | authority_missing |

非法源约束：gap/reconnecting直接fresh非法；opacity cursor/revision不排序、不从arrival推丢消息。accepted单事件不覆盖历史gap，localconsumed集合不能代SDK连续性。scope revoke先hide；受限old source不能通过resume授权復活。 所有未列迁移invalid_transition，失败保留原值，无额外SDK调用、owner truth/trace/audit/outbox。

本cut审查：合法rowset完整；缺guard单项隔离；非法组合与新generation分离，不能凭共享enum漏掉本主体。

#### 6.3.16 LocalProjectionEntry / LocalProjectionState

来源：03 §9.7.4。CUT-S-16；TC-STATE-046（合法全行）/TC-STATE-047（逐guard）/TC-STATE-048（非法全行）。P0，Vitest；数据FX-state；suite persistence；预约EV-CAND-persistence。

操作/断言按本节三类执行规则；合法行具体动作、字段与副作用如下：

| From | To | 触发函数 | Step9 flow | 可落码前置条件 | 字段更新 | local/SDK副作用 | 非法错误 |
|---|---|---|---|---|---|---|---|
| factory | absent | LocalProjectionRepository.load返回null | LoadLocalProjection/RestoreAfterShellRestart | 当前partition/key合法，本地无记录，不owner缺失 | 无实体，不创建emptypayload成功record | readonly local结果 | access_denied |
| new record/absent | cached | LocalProjectionEntry.fromRoute/fromDraft + LocalProjectionRepository.save | PersistLocalProjection | guard.canPersist允许，safe locator/schema qualified；expected=null要求不存在；fence真正save时当前 | entry key/partition/hint/payload/state cached；repo.localVersion生成 | 同JSturn memoryversion CAS/set，无durable | dependency_unbound/local_conflict |
| cached/restored/stale | cached | LocalProjectionRepository.save | PersistLocalProjection | load返回expectedVersion同entry/partition，currentfence/非evictwrite eligibility | safe payload仅批准值，version更新，cached | memory save，root不fresh | local_conflict/context_changed |
| cached/stale | restored/stale | LocalProjectionEntry.restore | RestoreAfterShellRestart | guard.canRestore及正式当前entry access；缓存仍candidate，不能fresh | restored或stale姿态，严禁恢复授权/confirmed/text durable | local受限候选，SDK resolve/probe独立 | authority_missing |
| cached/restored/stale | restricted | LocalProjectionEntry.restrict | ConsumeVisibilityChange/LoadLocalProjection/RestoreAfterShellRestart | 更严safe access/revoke/恢复未合格，当前范围 | 敏感payload/ref移除，state restricted | hide/invalidatesave资格 | context_changed |
| cached/restored/stale/restricted | evicting | LocalProjectionEntry.beginEvict | ConsumeEvictionTrigger/EvictLocalMaterial | currentreason/分区资格；先root隐藏/禁止旧pending save | payload已遮蔽，state evicting；record.deleteConfirmed=false | stop feed后versioned repo delete | access_denied |
| evicting | cleared | LocalProjectionEntry.finishEvict / CacheLifecycleRecord.finish | EvictLocalMaterial/ConsumeEvictionTrigger | DeleteResult.deleted或already_absent正式repo确认；expectedVersion配对 | payload/refs移除，record.deleteConfirmed=true、safeError=null | 本地memory删除事实，非durable/evidence | storage_unavailable |
| evicting | restricted | CacheLifecycleRecord.finish / LocalProjectionEntry.restrict | EvictLocalMaterial/ConsumeEvictionTrigger | DeleteResult.failed或localversion conflict，无法证明删除 | deleteConfirmed=false，safeError有限，保持hide | 不rollback root遮蔽；只读重查/cleanup | storage_unavailable/local_conflict |
| cleared/absent | new cached | 新generation/key guarded factory+save | PersistLocalProjection | newcurrentfence/qualification，新记录identity，不重用旧pending save | 新record版本，不恢复旧safe body | localmemoryCAS，新authority证明 | invalid_transition |

非法源约束：evicting/cleared旧generation save非法；partition/key不能从ref/actor拼，ExternalHandle token/credential/previewURL/text不得序列化。storage error不cleared；保存cached不authorized/fresh。 所有未列迁移invalid_transition，失败保留原值，无额外SDK调用、owner truth/trace/audit/outbox。

本cut审查：合法rowset完整；缺guard单项隔离；非法组合与新generation分离，不能凭共享enum漏掉本主体。

#### 6.3.17 PlatformCapabilityState / CapabilityAvailability

来源：03 §9.8.1。CUT-S-17；TC-STATE-049（合法全行）/TC-STATE-050（逐guard）/TC-STATE-051（非法全行）。P0，Vitest；数据FX-state；suite host-unit；预约EV-CAND-host-unit。

操作/断言按本节三类执行规则；合法行具体动作、字段与副作用如下：

| From | To | 触发函数 | Step9 flow | 可落码前置条件 | 字段更新 | local/SDK副作用 | 非法错误 |
|---|---|---|---|---|---|---|---|
| factory | unknown | PlatformCapabilityState.initial | ProbePlatformCapability/Startup | approvedconfig platform，V1 desktop或web_preview，mobile_reserved拒装配 | 每capability初始unknown；无批准probe结果 | local状态，不native执行 | invalid_input |
| unknown | available | PlatformCapabilityState.applyProbe | ProbePlatformCapability | PlatformProbeResult.capability/platform/hostBinding/generation当前，正式host批准能力资格完整，Web预览不得native storage/open | capabilities仅更新此kind=available；safeReason有限，不改Access/Command | currentlocal CAS；probe本身technical，无任意shell/file/network | authority_missing/context_changed/platform_unavailable |
| unknown | restricted | PlatformCapabilityState.applyProbe | ProbePlatformCapability | PlatformProbeResult.capability/platform/hostBinding/generation当前，正式host策略收紧 | capabilities仅更新此kind=restricted；safeReason有限，不改Access/Command | currentlocal CAS；probe本身technical，无任意shell/file/network | authority_missing/context_changed/platform_unavailable |
| unknown | unavailable | PlatformCapabilityState.applyProbe | ProbePlatformCapability | PlatformProbeResult.capability/platform/hostBinding/generation当前，host正式不提供/contract未bound，fail-closed | capabilities仅更新此kind=unavailable；safeReason有限，不改Access/Command | currentlocal CAS；probe本身technical，无任意shell/file/network | authority_missing/context_changed/platform_unavailable |
| unknown | needs_action | PlatformCapabilityState.applyProbe | ProbePlatformCapability | PlatformProbeResult.capability/platform/hostBinding/generation当前，host明确需要用户动作，本地不自授权限 | capabilities仅更新此kind=needs_action；safeReason有限，不改Access/Command | currentlocal CAS；probe本身technical，无任意shell/file/network | authority_missing/context_changed/platform_unavailable |
| unknown | unknown | PlatformCapabilityState.applyProbe | ProbePlatformCapability | PlatformProbeResult.capability/platform/hostBinding/generation当前，未取得可信当前probe或资格失效 | capabilities仅更新此kind=unknown；safeReason有限，不改Access/Command | currentlocal CAS；probe本身technical，无任意shell/file/network | authority_missing/context_changed/platform_unavailable |
| available | available | PlatformCapabilityState.applyProbe | ProbePlatformCapability | PlatformProbeResult.capability/platform/hostBinding/generation当前，正式host批准能力资格完整，Web预览不得native storage/open | capabilities仅更新此kind=available；safeReason有限，不改Access/Command | currentlocal CAS；probe本身technical，无任意shell/file/network | authority_missing/context_changed/platform_unavailable |
| available | restricted | PlatformCapabilityState.applyProbe | ProbePlatformCapability | PlatformProbeResult.capability/platform/hostBinding/generation当前，正式host策略收紧 | capabilities仅更新此kind=restricted；safeReason有限，不改Access/Command | currentlocal CAS；probe本身technical，无任意shell/file/network | authority_missing/context_changed/platform_unavailable |
| available | unavailable | PlatformCapabilityState.applyProbe | ProbePlatformCapability | PlatformProbeResult.capability/platform/hostBinding/generation当前，host正式不提供/contract未bound，fail-closed | capabilities仅更新此kind=unavailable；safeReason有限，不改Access/Command | currentlocal CAS；probe本身technical，无任意shell/file/network | authority_missing/context_changed/platform_unavailable |
| available | needs_action | PlatformCapabilityState.applyProbe | ProbePlatformCapability | PlatformProbeResult.capability/platform/hostBinding/generation当前，host明确需要用户动作，本地不自授权限 | capabilities仅更新此kind=needs_action；safeReason有限，不改Access/Command | currentlocal CAS；probe本身technical，无任意shell/file/network | authority_missing/context_changed/platform_unavailable |
| available | unknown | PlatformCapabilityState.applyProbe | ProbePlatformCapability | PlatformProbeResult.capability/platform/hostBinding/generation当前，未取得可信当前probe或资格失效 | capabilities仅更新此kind=unknown；safeReason有限，不改Access/Command | currentlocal CAS；probe本身technical，无任意shell/file/network | authority_missing/context_changed/platform_unavailable |
| restricted | available | PlatformCapabilityState.applyProbe | ProbePlatformCapability | PlatformProbeResult.capability/platform/hostBinding/generation当前，正式host批准能力资格完整，Web预览不得native storage/open | capabilities仅更新此kind=available；safeReason有限，不改Access/Command | currentlocal CAS；probe本身technical，无任意shell/file/network | authority_missing/context_changed/platform_unavailable |
| restricted | restricted | PlatformCapabilityState.applyProbe | ProbePlatformCapability | PlatformProbeResult.capability/platform/hostBinding/generation当前，正式host策略收紧 | capabilities仅更新此kind=restricted；safeReason有限，不改Access/Command | currentlocal CAS；probe本身technical，无任意shell/file/network | authority_missing/context_changed/platform_unavailable |
| restricted | unavailable | PlatformCapabilityState.applyProbe | ProbePlatformCapability | PlatformProbeResult.capability/platform/hostBinding/generation当前，host正式不提供/contract未bound，fail-closed | capabilities仅更新此kind=unavailable；safeReason有限，不改Access/Command | currentlocal CAS；probe本身technical，无任意shell/file/network | authority_missing/context_changed/platform_unavailable |
| restricted | needs_action | PlatformCapabilityState.applyProbe | ProbePlatformCapability | PlatformProbeResult.capability/platform/hostBinding/generation当前，host明确需要用户动作，本地不自授权限 | capabilities仅更新此kind=needs_action；safeReason有限，不改Access/Command | currentlocal CAS；probe本身technical，无任意shell/file/network | authority_missing/context_changed/platform_unavailable |
| restricted | unknown | PlatformCapabilityState.applyProbe | ProbePlatformCapability | PlatformProbeResult.capability/platform/hostBinding/generation当前，未取得可信当前probe或资格失效 | capabilities仅更新此kind=unknown；safeReason有限，不改Access/Command | currentlocal CAS；probe本身technical，无任意shell/file/network | authority_missing/context_changed/platform_unavailable |
| unavailable | available | PlatformCapabilityState.applyProbe | ProbePlatformCapability | PlatformProbeResult.capability/platform/hostBinding/generation当前，正式host批准能力资格完整，Web预览不得native storage/open | capabilities仅更新此kind=available；safeReason有限，不改Access/Command | currentlocal CAS；probe本身technical，无任意shell/file/network | authority_missing/context_changed/platform_unavailable |
| unavailable | restricted | PlatformCapabilityState.applyProbe | ProbePlatformCapability | PlatformProbeResult.capability/platform/hostBinding/generation当前，正式host策略收紧 | capabilities仅更新此kind=restricted；safeReason有限，不改Access/Command | currentlocal CAS；probe本身technical，无任意shell/file/network | authority_missing/context_changed/platform_unavailable |
| unavailable | unavailable | PlatformCapabilityState.applyProbe | ProbePlatformCapability | PlatformProbeResult.capability/platform/hostBinding/generation当前，host正式不提供/contract未bound，fail-closed | capabilities仅更新此kind=unavailable；safeReason有限，不改Access/Command | currentlocal CAS；probe本身technical，无任意shell/file/network | authority_missing/context_changed/platform_unavailable |
| unavailable | needs_action | PlatformCapabilityState.applyProbe | ProbePlatformCapability | PlatformProbeResult.capability/platform/hostBinding/generation当前，host明确需要用户动作，本地不自授权限 | capabilities仅更新此kind=needs_action；safeReason有限，不改Access/Command | currentlocal CAS；probe本身technical，无任意shell/file/network | authority_missing/context_changed/platform_unavailable |
| unavailable | unknown | PlatformCapabilityState.applyProbe | ProbePlatformCapability | PlatformProbeResult.capability/platform/hostBinding/generation当前，未取得可信当前probe或资格失效 | capabilities仅更新此kind=unknown；safeReason有限，不改Access/Command | currentlocal CAS；probe本身technical，无任意shell/file/network | authority_missing/context_changed/platform_unavailable |
| needs_action | available | PlatformCapabilityState.applyProbe | ProbePlatformCapability | PlatformProbeResult.capability/platform/hostBinding/generation当前，正式host批准能力资格完整，Web预览不得native storage/open | capabilities仅更新此kind=available；safeReason有限，不改Access/Command | currentlocal CAS；probe本身technical，无任意shell/file/network | authority_missing/context_changed/platform_unavailable |
| needs_action | restricted | PlatformCapabilityState.applyProbe | ProbePlatformCapability | PlatformProbeResult.capability/platform/hostBinding/generation当前，正式host策略收紧 | capabilities仅更新此kind=restricted；safeReason有限，不改Access/Command | currentlocal CAS；probe本身technical，无任意shell/file/network | authority_missing/context_changed/platform_unavailable |
| needs_action | unavailable | PlatformCapabilityState.applyProbe | ProbePlatformCapability | PlatformProbeResult.capability/platform/hostBinding/generation当前，host正式不提供/contract未bound，fail-closed | capabilities仅更新此kind=unavailable；safeReason有限，不改Access/Command | currentlocal CAS；probe本身technical，无任意shell/file/network | authority_missing/context_changed/platform_unavailable |
| needs_action | needs_action | PlatformCapabilityState.applyProbe | ProbePlatformCapability | PlatformProbeResult.capability/platform/hostBinding/generation当前，host明确需要用户动作，本地不自授权限 | capabilities仅更新此kind=needs_action；safeReason有限，不改Access/Command | currentlocal CAS；probe本身technical，无任意shell/file/network | authority_missing/context_changed/platform_unavailable |
| needs_action | unknown | PlatformCapabilityState.applyProbe | ProbePlatformCapability | PlatformProbeResult.capability/platform/hostBinding/generation当前，未取得可信当前probe或资格失效 | capabilities仅更新此kind=unknown；safeReason有限，不改Access/Command | currentlocal CAS；probe本身technical，无任意shell/file/network | authority_missing/context_changed/platform_unavailable |

非法源约束：fake host事件/window_id文本/用户config不能available，技术能力绝不提升业务access或result。native本轮只Lifecycle/Accessibility probe；controlled_preview/safe_storage未闭合必不可用，不添加伪handler。 所有未列迁移invalid_transition，失败保留原值，无额外SDK调用、owner truth/trace/audit/outbox。

本cut审查：合法rowset完整；缺guard单项隔离；非法组合与新generation分离，不能凭共享enum漏掉本主体。

### 6.4 配置12cut正反向

八数字以04逐字段上限为准：text 65536UTF16units、attachment64refs、cache1024entries、consumed65536identities/单source generation、contexts128、directory512UTF16units、nodes2048、edges8192。每字段独立min/max/±1/非整数/unsafeint参数；example并非production默认。edges≤nodes不是约束。

TC-CFG-005/006额外分别以LocalPageRequest.limit=1/maxCachedEntries及0/maxCachedEntries+1/非整数构造正式分页输入，断言本地guard接受或invalid_input；本地上限接受不保证SDK接受。各异步qualified协议负向参数还逐个缺/错03同名ClientRequest与Input、reply所有必填与条件字段；每variant回指源字段/guard，原始request保留不改incoming。

| ID | 场景/P0前置 | 操作 | 预期/断言 | 数据/suite/来源/自动化 |
|---|---|---|---|---|
| TC-CFG-001 | strict输入 正向；全量profile起点 | 有效strict JSON与plain-data等价；parser一次返回14字段 | 按04精确值/单位/交叉规则装配immutable；无资格升级 | FX-config / config / CUT-CFG-01 / Vitest或Rustguard |
| TC-CFG-002 | strict输入 负向；全量profile起点 | 分别nested重复键/comments/尾逗号/undefined/NaN/null/array/prototype/accessor/getter/unknown key；拒绝且getter执行计数0 | 拒绝不合法配置/资格，不保留半有效root，不输出原值；业务zero unsafe effect | FX-config / config / CUT-CFG-01 / Vitest或Rustguard |
| TC-CFG-003 | required/default 正向；全量profile起点 | 8域全量；只app.schemaVersion/memoryOnly/diagnostic.mode缺叶子分别1/true/disabled | 按04精确值/单位/交叉规则装配immutable；无资格升级 | FX-config / config / CUT-CFG-02 / Vitest或Rustguard |
| TC-CFG-004 | required/default 负向；全量profile起点 | 八域逐缺、另11叶子逐缺；显式false/坏enum/undefined不fallback | 拒绝不合法配置/资格，不保留半有效root，不输出原值；业务zero unsafe effect | FX-config / config / CUT-CFG-02 / Vitest或Rustguard |
| TC-CFG-005 | 八数字 正向；全量profile起点 | 逐字段1/04max/例值，UTF16单位含emoji与组合字符；不夹边界 | 按04精确值/单位/交叉规则装配immutable；无资格升级 | FX-config / config / CUT-CFG-03 / Vitest或Rustguard |
| TC-CFG-006 | 八数字 负向；全量profile起点 | 逐字段0/-1/max+1/1.5/unsafeint/字符串/null；文本超限保留稿零dispatch，图超限unsupported_material | 拒绝不合法配置/资格，不保留半有效root，不输出原值；业务zero unsafe effect | FX-config / config / CUT-CFG-03 / Vitest或Rustguard |
| TC-CFG-007 | profile交叉 正向；全量profile起点 | 6profile逐有效组合；desktop非空hostalias，preview显式null | 按04精确值/单位/交叉规则装配immutable；无资格升级 | FX-config / config / CUT-CFG-04 / Vitest或Rustguard |
| TC-CFG-008 | profile交叉 负向；全量profile起点 | 未知profile、外壳schema不1、desktopnull、preview非null、alias URI/path/secret/wildcard/大写/超128拒绝 | 拒绝不合法配置/资格，不保留半有效root，不输出原值；业务zero unsafe effect | FX-config / config / CUT-CFG-04 / Vitest或Rustguard |
| TC-CFG-009 | SDK绑定 正向；全量profile起点 | alias仅进入批准registry查找，存在且qualified才注入adapter | 按04精确值/单位/交叉规则装配immutable；无资格升级 | FX-config / config / CUT-CFG-05 / Vitest或Rustguard |
| TC-CFG-010 | SDK绑定 负向；全量profile起点 | alias格式合格但registry空/版本错；dependency_unbound零private fallback/IO | 拒绝不合法配置/资格，不保留半有效root，不输出原值；业务zero unsafe effect | FX-config / config / CUT-CFG-05 / Vitest或Rustguard |
| TC-CFG-011 | native资格 正向；全量profile起点 | 可信非空approved_windows/origins与kind匹配probe输出 | 按04精确值/单位/交叉规则装配immutable；无资格升级 | FX-config / host-unit / CUT-CFG-06 / Vitest或Rustguard |
| TC-CFG-012 | native资格 负向；全量profile起点 | ordinary JSON/假window/假origin/错kind/未知permission拒绝；host available不授intent | 拒绝不合法配置/资格，不保留半有效root，不输出原值；业务zero unsafe effect | FX-config / host-unit / CUT-CFG-06 / Vitest或Rustguard |
| TC-CFG-013 | composition 正向；全量profile起点 | 一次完整validate/freeze/装配才root active | 按04精确值/单位/交叉规则装配immutable；无资格升级 | FX-config / config / CUT-CFG-07 / Vitest或Rustguard |
| TC-CFG-014 | composition 负向；全量profile起点 | 中间项失败无halfroot；StrictMode双mount/重复callbacks零重复订阅/dispatch | 拒绝不合法配置/资格，不保留半有效root，不输出原值；业务zero unsafe effect | FX-config / config / CUT-CFG-07 / Vitest或Rustguard |
| TC-CFG-015 | 切换迟到 正向；全量profile起点 | 重建epoch后仅新source/slot可更新 | 按04精确值/单位/交叉规则装配immutable；无资格升级 | FX-config / config / CUT-CFG-08 / Vitest或Rustguard |
| TC-CFG-016 | 切换迟到 负向；全量profile起点 | profile切换/revoke后release旧load/result；hide先stop，旧confirmed不复活、unknown不resend | 拒绝不合法配置/资格，不保留半有效root，不输出原值；业务zero unsafe effect | FX-config / config / CUT-CFG-08 / Vitest或Rustguard |
| TC-CFG-017 | 容量/CAS 正向；全量profile起点 | cache/context/consumed各上限内接受；save同turn版与fence匹配 | 按04精确值/单位/交叉规则装配immutable；无资格升级 | FX-config / config / CUT-CFG-09 / Vitest或Rustguard |
| TC-CFG-018 | 容量/CAS 负向；全量profile起点 | capacity达到边界与+1：失效旧source/slot再重取；pending save-after-revoke无复活/无忘dedup仍fresh | 拒绝不合法配置/资格，不保留半有效root，不输出原值；业务zero unsafe effect | FX-config / config / CUT-CFG-09 / Vitest或Rustguard |
| TC-CFG-019 | 拓扑预算 正向；全量profile起点 | formal fork/branch/join/loop图与列表/ARIA安全集合一致；edges可大于nodes | 按04精确值/单位/交叉规则装配immutable；无资格升级 | FX-config / process / CUT-CFG-10 / Vitest或Rustguard |
| TC-CFG-020 | 拓扑预算 负向；全量profile起点 | nodes/edges超限不ready局部残图；hidden节点/关联边/label/count/ARIA均无泄露 | 拒绝不合法配置/资格，不保留半有效root，不输出原值；业务zero unsafe effect | FX-config / process / CUT-CFG-10 / Vitest或Rustguard |
| TC-CFG-021 | 诊断六字段 正向；全量profile起点 | formal_low_sensitivity+显式user+current六字段+qualified sink一次send | 按04精确值/单位/交叉规则装配immutable；无资格升级 | FX-config / diagnostic / CUT-CFG-11 / Vitest或Rustguard |
| TC-CFG-022 | 诊断六字段 负向；全量profile起点 | disabled零IO、extra/secret/未请求拒绝、unknown无重送，sink失败不影响业务 | 拒绝不合法配置/资格，不保留半有效root，不输出原值；业务zero unsafe effect | FX-config / diagnostic / CUT-CFG-11 / Vitest或Rustguard |
| TC-CFG-023 | rollback漂移 正向；全量profile起点 | 旧批准配置重新全量validate，新composition/profile资格重验 | 按04精确值/单位/交叉规则装配immutable；无资格升级 | FX-config / config / CUT-CFG-12 / Vitest或Rustguard |
| TC-CFG-024 | rollback漂移 负向；全量profile起点 | alias/registry/native批准变更或旧版本失效blocked；无自动LKG/恢复旧资格 | 拒绝不合法配置/资格，不保留半有效root，不输出原值；业务zero unsafe effect | FX-config / config / CUT-CFG-12 / Vitest或Rustguard |

每CFG-cut独立检查positive、不合法输入、安全副作用与fixture maturity；EV-CAND依suite预约，源04 §5～11/§12.2。

### 6.5 14并发调度

统一deferred ports控制完成順序；不靠随机sleep。每场景A→B/B→A及同microtask冲突变体独立instance。

| ID | 场景/前置P0 | 操作与断言 | suite/数据/来源 |
|---|---|---|---|
| TC-CONC-001 | 双提交；同稿revision，defer无effect prepare，Enter与按钮同turn并触发 | 先release两prepare，second CAS竞争；单winner dispatched=true/submitted先保存再唯一dispatch；loser无effect | intent/FX-concurrency/CONC-01 |
| TC-CONC-002 | 改稿；prepare pending时新编辑稿 | release旧dispatch confirmed；frozen payload仍原稿；只同revision清理，新稿保留 | intent/FX-concurrency/CONC-02 |
| TC-CONC-003 | Gate重复；同actor/fence/Gate/action多个callback | 并发prepare/reserve；复用同attempt，dispatch一次；撤销capability后零新effect | intent/FX-concurrency/CONC-03 |
| TC-CONC-004 | association；两稿不同payload错误复用association | SDK qualification拒绝不匹配，authority_missing/invalid_input；不自行生成新key绕过 | intent/FX-concurrency/CONC-04 |
| TC-CONC-005 | result/probe；同attempt正式result与probe同时返回 | 交换release顺序；terminal相同no-op，冲突authority拒绝，terminal不反转 | intent/FX-concurrency/CONC-05 |
| TC-CONC-006 | change/resume；单source patch/水位/accepted身份竞争 | 两种release顺序；一CAS全写或全不写，无双apply/丢水位；源B不受A顺序控制 | continuity/FX-concurrency/CONC-06 |
| TC-CONC-007 | late读取；两project/node/search request不同slots | 先新返回再旧返回；旧result context_changed，当前VM/选择/root版本不被旧覆写 | process/FX-concurrency/CONC-07 |
| TC-CONC-008 | 父图更新；child请求未完成，parent换正式版本 | 先invalidate旧child再release；无旧node/幽灵edge/隐藏label；需新formal read | process/FX-concurrency/CONC-08 |
| TC-CONC-009 | 撤销；当前scope/source含已关闭node缓存，与query/result竞速 | 正式revoke先hide/invalidate再stop/delete，defer失败后release旧返回；无复活/权限恢复 | continuity/FX-concurrency/CONC-09 |
| TC-CONC-010 | save/登出；memory entry版匹配，pending保存与logout/evict竞争 | 注销推进fence，save应用时同turn检查；错版/旧fence拒绝，delete失败restricted不cleared | persistence/FX-concurrency/CONC-10 |
| TC-CONC-011 | resume重入；A、B各source current recovery | A连续两resume onlysingleflight；B独立；旧A回包不改B或新A水位 | continuity/FX-concurrency/CONC-11 |
| TC-CONC-012 | 跨设备；隔离device A/B，各local root与同正式intent目标 | fixture只证各composition限制；真实server幂等由TC-REAL-004，不能宣称local CAS跨端exactlyonce | continuity/FX-concurrency/CONC-12 |
| TC-CONC-013 | 有界消费；已达consumed/context/cache limit，后续change到达 | 先失效source/slot再重取；不丢dedup继续fresh；覆盖未齐保持gap/stale | continuity/FX-concurrency/CONC-13 |
| TC-CONC-014 | dispose晚到；effect已dispatch且reply pending | 可信dispose失效root/listener，release旧reply不写新root；取消等待不cancel owner，无second dispatch | continuity/FX-concurrency/CONC-14 |

### 6.6 15错误变体

每码测试producer入口、公共safe输出、禁止retry/IO及DOM/诊断/报告串联；原SDK message/stack合成sentinel不得外泄。

retry字段严格按03 §11.1逐码：never适用invalid_input/dependency_unbound/authority_missing/access_denied/context_changed/invalid_transition/unsafe_material/unsupported_material/aborted_read；read_only适用dependency_unavailable/local_conflict/continuity_gap/storage_unavailable/platform_unavailable；effect_unknown只explicit_after_probe，不允许unknown自身resend。TC-ERROR-001～015逐项断言对应retry值及其禁止动作。

| ID | code/P0 | 触发/操作 | 预期/断言 | 来源/数据/suite |
|---|---|---|---|---|
| TC-ERROR-001 | invalid_input | 缺typed字段或非法数值 | 拒绝，安全本地code，无effect | 03 §11/FX-errors/errors/Vitest |
| TC-ERROR-002 | dependency_unbound | 缺public capability/registry | blocked零IO，不转私有API | 03 §11/FX-errors/errors/Vitest |
| TC-ERROR-003 | dependency_unavailable | 合格只读port临时失败 | unavailable不变deny，不自动effect retry | 03 §11/FX-errors/errors/Vitest |
| TC-ERROR-004 | authority_missing | 返回authority/正式关联缺失 | 拒绝升级/确认；无补造资格 | 03 §11/FX-errors/errors/Vitest |
| TC-ERROR-005 | access_denied | 当前formal不可读/可操作 | hide/disable，安全恢复，不泄露存在性 | 03 §11/FX-errors/errors/Vitest |
| TC-ERROR-006 | context_changed | actor/session/source/slot/parent/query代次错 | late结果弃置，不改current | 03 §11/FX-errors/errors/Vitest |
| TC-ERROR-007 | local_conflict | root/repo CAS错版 | 原patch全不写；纯本地重读，不second dispatch | 03 §11/FX-errors/errors/Vitest |
| TC-ERROR-008 | invalid_transition | 未列From/To | 状态原值，不非法effect | 03 §11/FX-errors/errors/Vitest |
| TC-ERROR-009 | unsafe_material | secret/raw body/未资格化展示 | 拒绝与有限code，无rawmessage | 03 §11/FX-errors/errors/Vitest |
| TC-ERROR-010 | unsupported_material | 未知Turn/协议版本/超限拓扑 | 安全不可展示，不ready残图 | 03 §11/FX-errors/errors/Vitest |
| TC-ERROR-011 | continuity_gap | cursor coverage缺口 | source gap/stale，需要formalrequery | 03 §11/FX-errors/errors/Vitest |
| TC-ERROR-012 | effect_unknown | dispatch后断线/超时 | unknown，只probe/query/wait | 03 §11/FX-errors/errors/Vitest |
| TC-ERROR-013 | storage_unavailable | memory repo删除/保存失败 | 清理失败仍hidden/restricted，不宣称cleared | 03 §11/FX-errors/errors/Vitest |
| TC-ERROR-014 | platform_unavailable | host probe/open缺能力 | unavailable/needs_action，无业务state变更 | 03 §11/FX-errors/errors/Vitest |
| TC-ERROR-015 | aborted_read | 只读等待取消 | 取消本次等待，不取消owner业务 | 03 §11/FX-errors/errors/Vitest |

### 6.7 全局安全、AT、证据与真实层用例

以下均P0；FX-real-*仅计划数据申请，不含真实credential或seed。所有真实用例当前blocked，不能由fixture通过。

| ID | suite/场景 | 前置/操作 | 预期/断言 | 来源/数据/自动化 |
|---|---|---|---|---|
| TC-SAFE-001 | boundary/禁止旁路 | 独立合成fixture当前context；AST扫描UI/host imports与fetch/bus/owner调用spy | 无owner private/source/DB/internalbus/Runtime/Tools/Observability backend依赖 | 03 §5/§6/§15 CUT-BOUNDARY/FX-boundary/Vitest/组件/Playwright候选 |
| TC-SAFE-002 | navigation/安全拒绝 | 独立合成fixture当前context；缺/冲突/撤销actor-scope-visibility分别进入各页面/动作 | DOM/ARIA/breadcrumb/search计数不泄露隐藏对象；zero unsafe effect | 00 §14.4条2/FX-context/Vitest/组件/Playwright候选 |
| TC-SAFE-003 | intent/假确认与重放 | 独立合成fixture当前context；按钮/HTTP2xx/ws/AG-UI ACK/缓存/toast/optimistic/通知分别注入，随后unknown/not_found恢复 | 不confirmed；probe/query/wait；dispatch总数不增加 | 00 §14.4条3/FX-context/Vitest/组件/Playwright候选 |
| TC-SAFE-004 | persistence/禁止内容保留 | 独立合成fixture当前context；合成secret/body/stack sentinel经unsafe input→repo/错误/诊断/日志输出边界，restart检查 | 拒绝raw payload；default memoryOnly，不序列化稿/handle/credential/正文；sentinel不出现 | 00 §11/§14.4条4/FX-redaction/Vitest/组件/Playwright候选 |
| TC-SAFE-005 | process/摘要不生成truth | 独立合成fixture当前context；fork/join未完成且Runtime/Tools/commit/test摘要显示成功，Gate仍pending；点击提交 | Process状态按正式源；Gate/审批/验收不自动成功，summary非EV | 00 §14.4条5/FX-process/Vitest/组件/Playwright候选 |
| TC-SAFE-006 | directory/未激活搜索边界 | 独立合成fixture当前context；historysearch capability缺失；目录过滤隐藏成员与分页totalunknown | 不向private索引查询；隐藏存在性/总数不披露；unknowncoverage不写全公司完整 | 00 F-E01/BR-E01/FX-directory/Vitest/组件/Playwright候选 |
| TC-SAFE-007 | host-unit/通知与平台等价 | 独立合成fixture当前context；模拟通知/托盘/快捷键/分享送达与host unavailable；重复入口 | 平台receipt不改业务结果；无intent权限补授；未激活能力blocked | 00 F-E02/E04/FX-host/Vitest/组件/Playwright候选 |
| TC-SAFE-008 | presentation/富文本引用安全 | 独立合成fixture当前context；合成script/危险URL/未授权附件ref/本地file路径，safe renderer/preview callback | 无脚本执行/拼下载URL/native open绕过；只formal safe ref；未知type不可展示 | 00 F-E03/03材料与preview/FX-material/Vitest/组件/Playwright候选 |
| TC-SAFE-009 | presentation/本地响应与owner隔离 | 独立合成fixture当前context；owner A永久defer、B unavailable；键盘导航/编辑/焦点/切tab，release C safe section | 本地交互可完成；各section明确partial/stale；不等待无关owner，不全局ready | 00 NFR001～002/005/FX-concurrency/Vitest/组件/Playwright候选 |
| TC-SAFE-010 | continuity/bounded请求放大 | 独立合成fixture当前context；一串duplicate/gap/unknown/reconnect/failedsink；fakeclock推进，记录按source调用次数 | duplicate零二次apply；resume singleflight；unknown零second dispatch；有限guards触发失效，禁止无限loop | 00 NFR003/03 §12/FX-concurrency/Vitest/组件/Playwright候选 |
| TC-AT-001 | presentation/键盘主线 | 独立合成fixture当前context；仅Tab/ShiftTab/Enter/Space/Escape到入口、五tab、三层流程、目录、draft/send/Gate/preview/恢复 | 核心目标可达，focus可见且顺序合理；无keyboard trap；revoke转安全region | 00 NFR022～023/FX-presentation/Vitest/组件/Playwright候选 |
| TC-AT-002 | presentation/ARIA等价安全 | 独立合成fixture当前context；图/list/breadcrumb对同safe拓扑，读region/label/announcement；隐藏node/边撤销 | 节点边/版本完全相同；不报hiddenlabel/count；不用颜色独传parallel/stale/Gate | 03 CUT-AT/FX-process/Vitest/组件/Playwright候选 |
| TC-AT-003 | presentation/IME/动态公告 | 独立合成fixture当前context；composition start/input/end并Enter、pending→unknown→formal result；live region观察 | IME未完成零send，完成后一次；可理解公告不含secret或错误success | 03 intent/platform/FX-presentation/Vitest/组件/Playwright候选 |
| TC-AT-004 | presentation/窄窗/缩放/动效 | 独立合成fixture当前context；候选视口1280x800与640x600、200%zoom/reducedmotion/高对比；切五tab与graph/list | 内容不重叠，关键控件可用；图有可操作等价list；视觉截图仅辅助 | 00项目NFR/03 platform/FX-presentation/Vitest/组件/Playwright候选 |
| TC-AT-005 | presentation/恢复焦点 | 独立合成fixture当前context；child/Gate/preview选中后撤销/父图换版/失败清理；重读合法新材料 | 安全region焦点与状态公告；旧不可见控件不继续可操作，不依delete成功 | 03 revoke/AT/FX-context/Vitest/组件/Playwright候选 |
| TC-REPORT-001 | report/schema失败 | 独立合成fixture当前context；报告工具输入缺字段/unknownenum/错误TC或EV孤儿/坏path/跨run/missinglog | nonzero，保留安全failure category；不补造case/pass/index | 05 §13/真相源§7/FX-report/Vitest/组件/Playwright候选 |
| TC-REPORT-002 | report/digest复核 | 独立合成fixture当前context；同JSON key换序与CRLF、改safe assertion、伪digest、自引用digest；验证字节哈希 | RFC8785+sha256稳定；改内容必失配；selfdigest仅排除自身字段，不排子digest | 05 §13/FX-report/Vitest/组件/Playwright候选 |
| TC-REPORT-003 | report/redaction拒绝 | 独立合成fixture当前context；合成token/secret/body/path/stack sentinel进入stdout/stderr/case/index/markdown候选 | 阻断发布；输出仅category与safe相对路径，不echo命中片段；隔离/清理敏感候选 | 05 §13/00条4/FX-redaction/Vitest/组件/Playwright候选 |
| TC-REPORT-004 | report/证据成熟度 | 独立合成fixture当前context；fixture passed/real blocked/skip/无run模板/最小shell尝试生成fullEV或acceptance | 不升级proof_scope/maturity；未执行不EV；blocked不pass；无06/07前不验收 | 03 §15.7/05 §13/FX-report/Vitest/组件/Playwright候选 |
| TC-REPORT-005 | report/失败产物 | 独立合成fixture当前context；suite执行真实失败/前置blocked/runner崩溃，写sanitized status/logs/category | report保留failed/blocked；无runtimecase不能伪造executed；gate nonzero；无rawstack | 05 §9/§13/FX-report/Vitest/组件/Playwright候选 |
| TC-REPORT-006 | report/路径安全 | 独立合成fixture当前context；runid含../slash、artifact-root错误/symlink逃逸、跨run引用、重用runid | 拒绝；无latest/绝对路径/覆盖旧run；安全root解析后只同run引用 | 真相源§7.2/FX-report/Vitest/组件/Playwright候选 |
| TC-REPORT-007 | report/索引完整 | 独立合成fixture当前context；已执行机器case中缺参数行/额外TC/变更manifest/有P0缺EV/fullpage | exact manifest与instance集合一致；index来源machine结果，缺材料nonzero，不静态填完成 | 真相源§7.5/05 §13/FX-report/Vitest/组件/Playwright候选 |
| TC-REAL-001 | sdk-real/正式SDK接入 | 实际批准环境+正式权限；当前blocked；批准sdkProfileRef/session/publicexports与真实query/change/resume/command/probe逐能力核对，运行43协议消费主线 | 正式资格/provenance/结果/cursor均回链；未提供任一必要能力blocked；fixture不能替代 | CHAT-UP001～009/WS-UP/FX-real-sdk/手工+正式SDK候选 |
| TC-REAL-002 | desktop-real/真实Desktop宿主 | 实际批准环境+正式权限；当前blocked；批准OS/build/origin/window/permissions下启动、切窗/重启/offline/深链/IPC guard，检查open/storage禁用 | 真实host proof与业务权分离，restart重新资格化；无approvedpolicy blocked；Web不能替代 | 03 native/04 §8/FX-real-host/手工+正式SDK候选 |
| TC-REAL-003 | at-real/真实读屏 | 实际批准环境+正式权限；当前blocked；批准OS/AT组合下实际读屏执行TC-AT001～005核心目标，记录有限检查结果与阻碍 | 每适用目标可理解/操作/恢复；fakeaxe不能抵消真实AT缺口；无环境blocked | 00 NFR022～023/FX-real-host/手工+正式SDK候选 |
| TC-REAL-004 | sdk-real/两设备正式幂等 | 实际批准环境+正式权限；当前blocked；批准两个隔离session对同owner intent重复/不同payload、结果probe与变更revoke | owner业务幂等/冲突正式结果可证；每端权限重验；无私造同步草稿；缺合同blocked | 03 CONC12/SDK业务幂等/FX-real-sdk/手工+正式SDK候选 |

### 6.8 Case分母与观察

协议86、状态51个参数case族、配置24、并发14、错误15、安全10、AT5、报告7、真实层4。每参数行独立instance，计数不是执行覆盖率。suite归属见§9，TC→EV预约映射在§13逐ID固定。boundary实现/状态row清单、guard清单和失败variant新增时，分母先同步再运行，不允许静默减少planned P0集合。


## 8. 回填草稿

正式05 §6回填本步§7全部表、步骤和schema。

## 9. 待确认事项

CHAT-UP001～009、WS-UP001～008、CHAT-BASE001、native/生产预算/版本兼容/质量仍open或blocked。真实正向不得由fixture解除。无当前测试结果、EV或readiness。

## 10. 自检与下一Step门禁

216个稳定TC族（参数化instance另计），43协议成对、17主体三类、12CFG成对、14CONC、15error、七条否决、真实SDK/native/AT均有定义；当前全部planned/真实层blocked。 本地设计gate pass_with_upstream_blockers；进入Step7，先读本产物/台账与对应SOP。
