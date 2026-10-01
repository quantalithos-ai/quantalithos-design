# L5-chat 05 · Step 11 缺陷管理与复验规则

## 1. Step状态

> done / pass_with_upstream_blockers；2026-10-01。全部用例/证据/路径均planned，未执行。

## 2. 本步输入

已通过Step10；05 SOP Step11与书写规范5.11；03 Step16、04 §12；真相源§2.15/§7。复杂cut逐个收口，前序gate成立才创建本文件。

## 3. SOP问题回答

如何分类、报告、归属、状态流转与复验？§11.1/2；P0需真实同层新证据，外部blocked不关单。

## 4. 当前文档问题诊断

没有复验层与阻塞状态容易把上游缺能力登记成已解决，raw失败材料会产生二次泄露。

## 5. 改动前后对比

| 改前 | 改后 | 原因 |
|---|---|---|
| 没有复验层与阻塞状态容易把上游缺能力登记成已解决，raw失败材料会产生二次泄露。 | 本步§7结构化结论 | 防止历史设计与当前owner合同分叉 |

## 6. 设计取舍与复杂度

测试管理记录独立于17客户端状态主体；可逆workflow、按风险复验。避免创造实现的Bug domain/API。

## 7. 结构化中间产物

### 11.1 缺陷分类与状态

此处是测试管理记录，不创建Chat业务对象或新客户端enum。记录字段：defect_id（测试管理safe id）、TC/variant、suite、proof_scope、source章节、预期/实际finite断言差异、severity、status、affected_versions安全引用、责任角色、复验scope、artifact_ref（真实run存在才填）。
禁止在issue正文附raw secret/正文、原SDK异常/stack或受保护成员/流程标题。

| 测试管理severity | 判定 | 处置 |
|---|---|---|
| blocker | 00七否决、credential披露、权限/结果伪造、second dispatch、P0真实层缺失 | 阻断相关gate与release，不能普通risk waiver |
| major | 核心路径失败、数据/source/状态不一致、安全恢复/AT不可用 | P0阻断，修复后完整相关层复验 |
| minor | 不影响安全与核心的视觉/文案问题 | P1，评审后有限延期；不抵消P0 |

status集合仅测试台账：open→triaged→fix_planned→ready_for_retest→verified→closed；复验失败reopened→triaged。blocked_external表示上游阻塞，不能verified/closed代表修复；任何跳过复验的closed拒绝。

### 11.2 复验规则

| 改动/缺陷 | 最小复验 | 扩展 |
|---|---|---|
| authority/result/unknown | intent全suite+CONC01～05/09/14+正式SDK两端 | 所有Gate/发送/断线/恢复 |
| revoke/CAS/source | navigation/continuity/persistence/状态原slot与各pages | 全43协议late与safeDOM/AT |
| parent/process/目录 | process/directory+父子旧版/隐藏计数/graphlist | 正式Process/relationship/provider层 |
| config/host | config/host-unit/native-real，六profiles | 全初始化/切换/rollback及secret检查 |
| evidence/redaction | report全suite与本次machineartifact重建 | 全run schema/digest/index与原缺陷TC |

复验必同TC/variant+导致回归相邻case，记录新真实run和修复版本ref，旧失败保留安全材料，不覆盖旧run。unit复验不解除formalSDK/native失败。真实证据缺失、故障不可重现或上游未修复仍open/blocked；不把“看起来好了”当verified。
缺陷归属：本地guard/UI/CAS由Chat实现者；publicsurface由SDK/owner；OS/AT与批准来源由环境/平台；P0延期由未来06门禁判定，当前不接受风险、不签字。


## 8. 回填草稿

正式05 §11回填本步§7全部表、步骤和schema。

## 9. 待确认事项

CHAT-UP001～009、WS-UP001～008、CHAT-BASE001、native/生产预算/版本兼容/质量仍open或blocked。真实正向不得由fixture解除。无当前测试结果、EV或readiness。

## 10. 自检与下一Step门禁

severity/status作用域明确，复验集合与TC/suite闭口，无当前缺陷结果或风险签收。 本地设计gate pass_with_upstream_blockers；进入Step12，先读本产物/台账与对应SOP。
