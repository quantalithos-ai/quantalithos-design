# L5-chat 05 · Step 10 专项测试与非功能验证

## 1. Step状态

> done / pass_with_upstream_blockers；2026-10-01。全部用例/证据/路径均planned，未执行。

## 2. 本步输入

已通过Step9；05 SOP Step10与书写规范5.10；03 Step16、04 §12；真相源§2.15/§7。复杂cut逐个收口，前序gate成立才创建本文件。

## 3. SOP问题回答

性能、可用性、安全、审计、一致性、可观测与AT如何验证？§10.1～3可执行方法；预算未知不伪造值。

## 4. 当前文档问题诊断

历史2s/99.9%/500+等没有authority，图测试只靠颜色/截图不能验证safe拓扑或读屏。

## 5. 改动前后对比

| 改前 | 改后 | 原因 |
|---|---|---|
| 历史2s/99.9%/500+等没有authority，图测试只靠颜色/截图不能验证safe拓扑或读屏。 | 本步§7结构化结论 | 防止历史设计与当前owner合同分叉 |

## 6. 设计取舍与复杂度

行为义务现在明确，性能阈值按测量+批准门禁等待；真实AT手工与自动axe分别举证。各专项小表串行核对TC。

## 7. 结构化中间产物

### 10.1 非功能专项

| 专项 | planned TC/方法 | 行为判据 | 数值/外部边界 |
|---|---|---|---|
| 本地响应/owner局部隔离 | TC-SAFE-009；永久defer无关owner，操作route/draft/focus/五tab | 不等待无关owner，局部section保持partial/unavailable | 不杜撰响应ms/P95/ownerSLA |
| 请求放大/幂等 | TC-SAFE-010、CONC01/03/11/13、PROTO072 | duplicate无二apply、source singleflight、unknown不second dispatch | retry/window依SDK正式合同 |
| 资源有界 | TC-CFG005/006、017～020、CONC13 | 04guardmin/max；不得忘dedup仍fresh；超图unsupported_material | guardmax不是生产容量批准 |
| fail-closed/安全 | TC-SAFE001～005、PROTO056、CFG011/012 | source/actor/visibility缺失或撤销立即隐藏；无rawsecret/正文保留 | nativepolicy/runtime能力仍blocked |
| 连续性/跨端 | CONC06/09/12/14、PROTO049～060/067～080、REAL004 | opaque cursor、不跨owner原子、gap覆盖完整才fresh、restart新资格 | formalSDK仍blocked，memory稿无跨端sync |
| 来源追溯 | PROTO015/016/052、REPORT001～007 | safe view/source/version/result关联；报告machine来源 | summary/点击/ACK非EV或批准 |
| 诊断 | PROTO063～066/081～082、CFG021/022 | 明确用户+六字段+qualifiedsink；默认disabled、unknown无重送 | 无自动metrics/backend |
| AT/多端体验 | TC-AT001～005、REAL002/003 | 核心目标键盘/读屏可操作、安全恢复，图/list同safe集合 | 支持OS/AT/版本待批准，axe不是真实读屏 |

上述TC简写在正式引用时按§6完整ID解析；例PROTO072=TC-PROTO-072，CONC13=TC-CONC-013。非功能对应00 NFR001～024与七个实际AC-NFR，BASE001不以新增验收号修补。

### 10.2 生产预算测量计划

每六profile候选分别记录批准版本/设备safe类别、graph节点/边/目录页大小与source context数（只合成计数）、重复试验方法；在实际native与Web分别测输入到安全反馈、render完成、峰值内存与bounded consumption，报告有限duration/resource数据，不记录正文。
测试负责人提出预算，产品/技术/安全与平台负责人审核批准后回校准00/03/04/05/06/07。当前未测量、无批准值，release质量gate blocked；不能拿04示例4096/128/2048或硬上限当性能通过条件。
边界变体先1/max/max+1，再稳定重复/长期运行观察memory/context/监听器清理；leak测试对dispose后listener/timer/pending集合归零与material无复活，不声称未实测heap零泄漏。

### 10.3 AT真实手工操作

1. 获批准OS/AT/build/safe fixture与正式权限，记录版本safe refs；缺任一blocked。
2. 仅键盘与读屏完成入口、阅读Turn、编辑/发送、Gate受控动作、Artifact不可用/预览、五tab、整体→stage→node、群聊↔项目、目录、unknown恢复。
3. 在并行fork/branch/join下朗读节点类型、当前状态、来源/新鲜度与GovernanceGate区别；用list替代图也要相同safe节点/边。
4. 触发revoke/父图换版/断线/清理失败；验证焦点移安全region，隐藏内容不再朗读，未知结果不公告成功。
5. 每目标记录pass/fail/not_checked、操作variant和safe阻碍code；实际case与报告按§13。截图默认不用正文/secret，必要证明只批准合成画面。人工结果须审查者safe ref；当前没有手工执行或结论。


## 8. 回填草稿

正式05 §10回填本步§7全部表、步骤和schema。

## 9. 待确认事项

CHAT-UP001～009、WS-UP001～008、CHAT-BASE001、native/生产预算/版本兼容/质量仍open或blocked。真实正向不得由fixture解除。无当前测试结果、EV或readiness。

## 10. 自检与下一Step门禁

24NFR均有行为方法与层，numeric guards来自04，真实质量/OS/AT继续blocked。 本地设计gate pass_with_upstream_blockers；进入Step11，先读本产物/台账与对应SOP。
