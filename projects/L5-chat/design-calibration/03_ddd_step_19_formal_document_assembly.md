# L5-chat 03 · Step 19 正式详细设计装配

## 1. Step 状态

> 当前状态：done/stopped；gate_status：pass_with_upstream_blockers；2026-10-01。
> 对应SOP Step19、详细设计书写规范18章主链；用户授权完成全部03，完成后停审，不进入04。

### 1.1 Step内计划

| 批次 | 产物 | 当前状态 |
|---|---|---|
| 19-A | 三层门禁、来源选择、正式骨架 | done |
| 19-B | 正式§1～4及模块§5/索引§6 | done |
| 19-C | 正式§7～9全协议/flow/状态 | done |
| 19-D | 正式§10～18及静态审查 | done |

单次写入≤220行；不压缩最终对象/协议/flow/状态细节。正式03在原路径更新，旧正文只污染审计材料；不产生替代正式文档或实现代码。

## 2. 本步输入

Step1～18当前独立产物/模块本地gate已通过，project_execution_ledger和03flow允许本轮装配。上游正向binding继续blocked，完整风险收口于Step18。Governance Step19作为章节/来源/停审参考，Chat正式正文保留当前完整字段、ports、43flow/17矩阵，避免只剩索引。

## 3. SOP问题回答

| 问题 | 装配约束 |
|---|---|
| 1. 主链符合规范吗 | §1～18固定；每章有具体校准来源与延伸阅读 |
| 2. §5是否模块主轴 | 十客户端module+native_host，各模块责任/能力/字段/工厂/ports/错误/测试；共享基础明确owner |
| 3. 能否互相回指 | 全量对象schema/ports/协议/flow/state正文保留；§6生成唯一索引，不替代§5 |
| 4. 闭环通过否 | Step17预审+最终静态检查；外部blocked与未来07整体审计分立 |
| 5. 能1:1实现吗 | 本地契约完整；正式SDK/host/provider正向不可实施，必须先闭合对应blocker及04～07门禁 |
| 6. 有无下游越界 | 仅配置引用、测试切口、planned脚本和承接；无生产确值/TC/EV/phase/排期/代码 |
| 7. 是否提供07审计输入 | §5～17对象/协议/flow/状态/CAS/错误/测试/风险；07仍逐boundary审正式03/05/06/07 |

## 4. 当前文档问题诊断

历史正式03有旧ChatThread/ChatReplyState、跨域采集、旧协议/状态等，不作为当前source。Step1～18部分执行记录包含“尚未授权/未来Step/不装配”，仅留calibration历史；正式正文抽取已收口内容，不能混入旧停点、SOP问题/诊断/过程门禁。

## 5. 改动前后对比

| 项 | 改前 | 改后 | 原因 |
|---|---|---|---|
| 正式03 | historical旧主语/协议 | 当前18章本地实现合同、blocked外部边界 | 承接当前00～02 |
| §5 | 旧对象主线 | 当前模块+同模块carrier/port/props/函数 | 实施不用自行拼schema |
| 协议/flow/state | 旧摘要 | 43协议、43独立flow/图、17状态主体/图 | 保留可落码粒度 |
| 证据/ready | 可能误读设计为实现 | planned/blocked/waiting，全部not_started | 不伪事实 |

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 原路径18章、模块整合、完整契约与来源 | 可直接审查，避免字段流失 | 正式正文较长 | 采用分批写入 |
| 只留摘要/外链 | 简短 | 本文不足以还原对象/逐flow | 不采用 |
| 新建替代设计或私造上游输入 | 快速绕旧文 | 双truth/越权 | 不采用 |

## 7. 结构化中间产物

### 7.1 章节与来源映射

| 正式章节 | 来源 | 回填内容 |
|---|---|---|
| 1 上游关系 | Step1 | 当前00/01/02与owner/SDK/原型边界 |
| 2 目标范围 | Step2 | Desktop-first local实现/非范围 |
| 3 约束规范 | Step3 | TS/React/Tauri分域、SDK-only/提交读取 |
| 4 布局 | Step4/16 | 单TS app+nativehost、完整planned路径/测试脚本 |
| 5 模块实现 | Step5/6/7/12 | 每module对象/carrier/props/工厂/port/errors/test，新增read暂失效码 |
| 6 全局索引 | Step6/7/8 | 对象/port/API定位；不重定义 |
| 7 协议 | Step8 | 43独立schema、全字段/source/actor/error/幂等 |
| 8 函数流 | Step9/11～13 | 43独立flow/图/typed伪代码/局部CAS/effect/error/cut |
| 9 状态 | Step10/12/16 | 17主体/12enum合法非法图/矩阵 |
| 10 持有一致性 | Step11 | logicalstore、逐repo/CAS/source/rebuild/清理 |
| 11 错误恢复 | Step12 | 15code/安全输出/dispatch前后/清理恢复 |
| 12 并发幂等 | Step13 | 资源/43族identity/SDK业务幂等/unknown/capacity |
| 13 配置依赖 | Step14 | 14字段/装配/实际SDKpackage/blockedbinding |
| 14 诊断审计 | Step15 | 既有低敏schema、metricsblocked、owner审计 |
| 15 测试切口 | Step16 | 43协议/17主体/CAS/安全/脚本/证据成熟度 |
| 16 承接 | Step17 | 阅读/十类闭环预审/07再审/无ready |
| 17 风险 | Step18 | CHAT-UP/WS-UP/BASE/host/storage/config/quality |
| 18 参考 | 当前实际阅读规范/输入 | 不列未读来源 |

### 7.2 正式正文规则

- 本文所有实现路径均planned；localpass不等集成ready。
- 同module集成Step5职责、Step6对象与独立carrier、Step7port。source-local原§编号保留为“StepN §”定位引用，正式标题另用统一§编号，不混作formal章节。
- 所有tuple/type/enum/helper单一定义；factory纯校验不授予资格；registry正式proof不由cast/fake=false产生。
- 校准执行计划/问题回答/诊断/改前改后/停审及本地gate记录不装配。
- §7/8/9全量契约正文保留，不以通用图/总表替代逐协议/flow/状态机。
- 正式风险保留pending事实，不补API/owner/provider/默认配置/测试结果。
- 04～07当前not_started/waiting；implementationledger/skeleton仅正式07完成时创建。

### 7.3 最终审查清单

| 检查 | 当前状态 |
|---|---|
| 18章与每章来源 | pass_static_document_audit；外部能力仍blocked |
| 十module+native及全量schemas/ports | pass_static_document_audit；外部能力仍blocked |
| 43协议=43flow=43pairedcuts | pass_static_document_audit；外部能力仍blocked |
| 17状态主体/图/切口、12canonicalenum | pass_static_document_audit；外部能力仍blocked |
| 15error/14config/版本/nullable/负向一致 | pass_static_document_audit；外部能力仍blocked |
| 原路径无旧主语/旧停点/过程污染 | pass_static_document_audit；外部能力仍blocked |
| 围栏/table/heading/schema唯一 | pass_static_document_audit；外部能力仍blocked |
| 写入只本项目、无implementation/tests/commit | pass_static_document_audit；外部能力仍blocked |

## 8. 回填草稿

按§7.1先骨架，再§1～4→§5各module→§6→§7→§8→§9→§10～18分批原位装配。最终静态检查后才把本Step和项目台账标done/stopped；不能提前记装配完成。

## 9. 待确认事项

所有外部integration与后续配置/测试/证据/实施门禁继续Step18已列blocked/waiting。不能通过形式检查关闭业务合同或宣称实现/验收。

## 10. 完成条件

正式03实际装配完整，静态检查及局部闭环通过，当前状态更新为formal_stop_review并停下；没有真实run/test/evidence/commit/Handoff/readiness，未推进04。

### 10.1 实际完成记录

正式03已在原路径按18章装配，完整保留十客户端模块与native_host、原有schema/ports、六新增页面组件props、43协议与逐项对应43flow/43调用图、17状态主体/17状态图、12canonical enum、15错误码及14配置字段。静态核对类型无重复且Step6声明无遗漏，Markdown围栏/表格列一致，文件链接存在；git diff --check通过。装配顺序经内容指纹校验，未留校准历史停点。

装配前回修Step6的dependency_unavailable、native approved_origins与有限HostBoundaryError拒绝映射；Step9同步读取失败，Step4登记planned脚本职责，Step17校正协议/Query计数措辞。字段/协议/状态不靠新建替代文档修复。

以上仅静态文档审查，不是编译、应用测试、run、证据、验收或readiness。CHAT-UP001～009、WS-UP001～008、CHAT-BASE001和host/storage/config/quality仍open/blocked；04～07 waiting/not_started，implementation ledger与boundary skeleton未创建。当前停止于正式03，不提交commit。
