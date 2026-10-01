# L5-chat 06 · Step 3 验收基线

## 1. Step状态

> done / pass_with_upstream_blockers；2026-10-01。这里只定义验收规则，所有TC/EV为planned预约，无实际验收结果或签署。

## 2. 本步输入

前序Step2 local gate已通过；06 SOP Step3、书写规范5.3；00实际36AC、03契约、04配置、05TC/EV和证据schema；中间产物§5.10与真相源§7。

## 3. SOP问题回答

需求/设计/测试/交付/环境/数据/run与handoff如何固定、变更怎样处理？§3.1～3逐项，静态指纹非运行证据。

## 4. 当前文档问题诊断

历史06以当前批次/最新环境代替build/run与hash；无法复查且容易混OS/scope。

## 5. 改动前后对比

| 改前 | 改后 | 原因 |
|---|---|---|
| 历史06以当前批次/最新环境代替build/run与hash；无法复查且容易混OS/scope。 | §7结构化裁决 | 保持正式contract/TC/EV与证据能力一致 |

## 6. 验收裁决取舍与复杂度

记录真实设计文件指纹，送验标识仍waiting；primary与显式run集合支持多OS且禁止跨baseline补pass。新增验收私有baseline DTO留Step10定义。

## 7. 结构化中间产物

### 3.1 设计基线（本轮静态文件指纹）

以下SHA256为2026-10-01读取的设计文件bytes指纹，只固定规则输入，不是commit/build/run或测试证据。实际送验必须重新登记**当时**批准完整baseline，若任一指纹变更，按§3.3重新评估门禁/TC/EV。

| 文档 | SHA256（完整文件bytes） | 定位 |
|---|---|---|
| 00-需求文档.md | 3a203146d26425d80ad96e0c1fb3d51f87bc7398fb90f4355664e4fd4a25ff22 | 当前停审需求，36AC |
| 01-架构设计.md | 8c9153119a31bcb6157fa2bd0f286f893119e269e57c61080b338562a47dfccd | 当前owner/依赖/平台 |
| 02-概要设计.md | 1dc2045af896bf42eed7f67cc6c2a80720334018c88e4e0304ada8c915608a46 | 当前模块/对象/入口 |
| 03-详细设计.md | 7ab053d19d62203b2d1df6335b8d79e867538bb3e9756cf3d0bd3e488e51475e | 43协议/17主体 |
| 04-配置设计.md | 6ae59433d3277e02a695951bcd9f0c718e180fe87798995b9ce511a18c48807a | 八域14字段/6profile |
| 05-测试方案.md | 37fff31333c246b4d45c661d6000e16afaee1e75eae34282c9e97e4eb14ac39f | 216TC/16suite/16EV |

### 3.2 实际送验baseline要求

| 类型 | 必须固定 | 当前 | 缺失影响 |
|---|---|---|---|
| 规则 | 批准00～06版本/bytes digest与变更差异 | 00～05静态已定位；06装配后审批另行记录 | 禁“最新文档”口头基线 |
| 交付 | 实际源码commit+dirty状态、工作树/交付build digest、SDK/npm/Rust/Tauri/host来源版本与签名批准 | waiting/not_started | 送验blocked，不造commit |
| 测试 | 05 manifest全TC/variant分母、固定primary_run_id与可列举run_ids、实际report | 无run_id或报告 | 送验blocked；无latest |
| 配置 | 04六profile批准source与validated flat14的config_digest、各run profile/版本一致性 | 示例planned | alias格式不证registrybound |
| SDK/owner | 正式public能力、session/source/visibility/cursor/result/probe/幂等合同版本safe refs | CHAT-UP/WS-UP blocked | 不能fake接通 |
| native/OS/AT | 实际approved origin/window/kind/build/OS/WebView/AT版本、适用矩阵 | blocked | Web不能替代Desktop |
| 数据 | fixture/test-scope与正式testtenant safe ref、权限/coverage/隔离/清理批准 | synthetic计划；real waiting | 不引入真实姓名/body/credential |
| 质量 | 性能/长时资源/兼容/保留ACL预算authority与实际测试scope | blocked | 无虚构阈值，release blocked |
| artifact | artifacts/test/<run_id>/meta、suites/cases、gate/redaction/index | 未生成 | schema/digest/source/分母不可复核 |
| report | reports/runs/<run_id>/summary.md、gate-results.md、redaction-check.md、redaction-final.json、evidence-index.md、suite/EVdetail | 未生成 | 无full_ev不能验产品 |
| acceptance | reports/acceptance/handoff.md、veto-checklist.md、risk-acceptance.md、open-issues.md；未来baseline.json | 未生成 | 固定入口缺失，送验交接不完整 |

primary_run_id是审阅主索引，run_ids是明确列举的批准同一交付/规则baseline证据集合，可覆盖多个真实OS/AT；**不跨run拼同一TC/variant的失败碎片成pass**。每个run保持05完整source/context/schema/digest/maturity。所有必须的profile/支持矩阵元素分别有对应run与case，未覆盖不能用另一OS passed抵消。
只采集同baseline可比的证据；实际source/dirty/build、profile差异按矩阵批准并逐run记录。源码变更重跑受影响suite及real层，不复用旧run当新版本实测。

### 3.3 变更与固定路径

固定入口不使用latest/projectsubdir。review_id标识独立验收审阅版本；固定reports/acceptance/*更新前将**实际旧文件**复制到reports/review/<review_id>/acceptance/并记录bytes digest及来源run集合，禁止覆盖历史结论。当前无文件，不创建空报告或伪archive。
设计/交付/config/SDKcontract/hostpolicy/支持矩阵变动使受影响结论失效，先更新baseline→重校准case分母→实际复验→新run/新review；风险接受不能修复版本错配或digest错误。详细baseline DTO与生成/审阅边界见§10。

## 8. 回填草稿

正式06 §3回填本步§7裁决结论/表/schema；过程停审、差异和自检留本文件，不冒充实际结果。

## 9. 待确认事项

CHAT-UP001～009/WS-UP001～008/BASE001/native/OS/AT/生产预算/精确版本/来源/发布/归档继续open/blocked。角色、build、run_id、报告、actualEV、风险接受与签署均waiting；没有当前放行或readiness。

## 10. 自检及下一Step门禁

六设计指纹来源sha256sum；没有build/run/签署值，固定paths与05一致。 本地规则设计gate pass_with_upstream_blockers；允许Step4先读取台账/flow/当前产物与对应SOP，不创建其它未来Step。
