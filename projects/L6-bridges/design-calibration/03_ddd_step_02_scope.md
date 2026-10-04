# L6-bridges 03 Step2：实现范围与非范围

## 1. Step状态、开工确认与内计划

done / pass；full-restart / single-agent-serial；拟回填正式03§2，当前正式回填false。

| 开工项 | 记录 |
|---|---|
| 三层许可 | 用户授权至Step4；前序自检pass；只当前Step可写 |
| 通用规范 | 通则/中间产物/真相源适用纪律沿Step1已复核；本步前回读前序门禁 |
| SOP/书写 | 详细SOP Step2 / 书写§5.2已读 |
| 输入 | Step1全文及未决；正式02§2/5~12、00§9/10/11；当前用户只授权Step1~4 |
| 模块骨架 | done；具体分组见结构化前复杂度判断，未来Step未创建 |
| 写入纪律 | 先问题/诊断/取舍，后结构化/复杂度/草稿/自检；历史只后置审计 |

| 内计划 | 状态 | 产物 |
|---|---|---|
| 读取输入/前序 | done | §2 |
| SOP问题回答 | done | §3 |
| 当前材料诊断 | done | §4 |
| 设计取舍 | done | §6 |
| 结构化产物 | done | §7 |
| 复杂度判断 | done | §7 |
| 历史差异/草稿 | done | §5/8 |
| 自检/下一步 | done / pass | §10 |

## 2. 本步输入

Step1全文及未决；正式02§2/5~12、00§9/10/11；当前用户只授权Step1~4。前序问题回答、诊断、取舍、待确认均为输入，不只引用最终表。

## 3. SOP问题回答

1. 03完整目标应覆盖六U与Entry/Application/Domain/Ports/infra技术层；模块/role数量由Step4/5确定，不以六U直接生成六crate。
2. 20局部对象及243已用type必须逐项定义或绑定真实shared合同；C01~06、E01~04、Q01~04、J01~05及条件O01必须具协议承接。19请求入口各有函数级flow；17stateful主语各有矩阵，receipt/audit/view不造独立机。
3. 00的16FR均为P0保护，不能把附件、恢复、限流、安全handoff或query延后到P1来规避。后续产品多语言/plugin、broadcast、UI、商业SDK扩展没有当前来源，不新增为P1范围；本轮不允许Step5以后的执行。
4. 03只定义可编码合同/最低测试切口；配置值/profile/pin实例到04，完整TC/fixture/suite/证据到05/06，phase/commit boundary与台账到07，部署产品/运维另层。设计中允许定义必要adapter绑定要求，不虚构真实provider。
5. 完整03和后续门禁关闭后，可实现本地模型、协议、受权编排、safe ref stores、四平台差异adapter及明确blocked路径；但当前Step1~4只能交付范围/约束/文件布局，不足以编码，绝不等于四平台激活或真实发送许可。

## 4. 当前材料问题诊断

02§2非范围把完整schema/目录/DDL留03，不能据此立即实施；§12的载体待闭口是本轮完整03范围，不是可选优化。20领域对象不涵盖全部entry/helper/config/typed carrier，所以范围必须同时覆盖protocol/port/安全瞬时边界。O01是条件提交阶段传播，不是新command，也不是平台send。current user只授权四步，不能以总SOP计划已列19步绕过停点。

## 5. 改动前后及历史差异

| 位置 / 旧口径 | 当前判断 | 回填影响 |
|---|---|---|
| 旧03§2.2五对象组及§9.1载荷truth/证据链 | 废弃范围输入 | §7保持当前20对象/安全ref，private材料不进入durable对象 |
| 旧03§2.2把sync/archive/capability-hub都当入口 | 不新增依赖主线 | 只承接01裁剪；恢复和附件经真实owner port，不直接执行Tools |
| 旧03§14最小可运行闭环 | 不作为当前授权承诺 | 前四步只交组织，不宣已送达、恢复成功或可验收 |

差异在本步结构化后核读，不借历史“完整主线”扩当前P0/实施范围。

## 6. 设计取舍

采用“完整03目标全集 + 当前四步授权上限 + 未释放外部支路”三层范围。未采用按正向可联调能力删掉P0安全/拒绝路径；未采用将四平台SDK一起激活或把fake成功视为送达。工程布局可含已确认职责文件，未选产品实现仅接口/adapter合同，产品分支未配置即不可用。正式03本轮不动。

三层写入检查：当前项目/flow/Step2允许结构化；问题/诊断/取舍done，未来Step3未创建。

## 7. 结构化中间产物与复杂度

### 设计目标

| 目标 | 说明 | 交付给实现者的结果 |
|---|---|---|
| 工程组织闭口 | 六U业务轴和技术role分离，纯核心不依赖产品 | 真实依赖映射、crate/module/file及composition root责任 |
| 全对象与支撑类型闭口 | 20对象逐卡，243carrier逐使用处定义/归属/转换 | 字段全集/variant/Rustdoc/factory/method、来源/optional/state required |
| 协议与只读面闭口 | 五类20主语含传递类型与qualified metadata | request/result/envelope/job/view/page/marker/finite error/response契约 |
| current authority闭口 | 三mapping两端定位、basis和scope不是字符串推断 | resolver输入/输出、owner读取、版本/撤销/有效期与denied/blocked分支 |
| flow/state闭口 | 19入口独立调用链、17机与六传播保持原语义 | 函数/端口/guard、非法转换、IO前后UoW/crash/recovery矩阵 |
| 幂等/持久化闭口 | scoped key与semantic effect唯一分离，query无写 | repository/CAS/UoW/dedup/result/tombstone、原op提交未知证明 |
| adapter差异闭口 | 四平台定位/ACK/变化/thread/附件/交互/限流分开 | typed平台边界与明确支持/降级/不支持；未获资格不发送 |
| private材料/secret闭口 | 瞬时来源/持有期/失效、SDK logging/retry不可穿透 | 无durable raw payload的safe carrier与输出allowlist；private句柄禁止通用Debug |
| 安全trace/handoff闭口 | 唯一producer、canonical/admission与consumer分离 | local audit/conditioned handoff合同；mandatory缺失阻对应mutation/IO |
| 下游承接 | 不写排期/证据/验收结论 | 配置绑定要求、最低测试切口、07按boundary整体可落码审计输入 |

### 六U范围承接

| 部分 | 对象集合（固定20） | 入口（固定20主语） | 后续必须闭口 |
|---|---|---|---|
| U1 | BridgeInstallation、ExternalBinding、ExternalIdentityMapping、ExternalLocationMapping、ExternalMessageMapping | C01/C02/C03/J05 | explicit basis、actor/target locator、namespace/generation/CAS与关联失效 |
| U2 | InboundHandoffRecord | E01 | 验证/ACK/source marker/loop、qualified material、owner handoff/known result |
| U3 | SafePresentationPlan、DeliveryIntent、DeliveryAttempt、PlatformReceipt | C04/E02/J01 | committed safe projection/Gate降级/附件、immutable effect与shared uniqueness、receipt/unknown |
| U4 | ExternalActionBinding、CallbackHandoffRecord | C05/E03 | source message/actor/action/target/owner version/expiry、one-use claim与原op交接 |
| U5 | DedupRecord、StreamCursor、GapRecord、DispatchLane、RecoveryRecord | C06/J02/J03 | 六dedup namespace、独立阶段cursor/comparator/coverage、bucket下界/预算/no-effect、权威同op恢复 |
| U6 | SafeAuditRecord、SafeHandoffRecord、BridgeLocalView | E04/O01/J04/Q01~04 | body-free producer/result、conditional admission、safe read完整page/visibility/degraded/no-write |

对象17机由02§9主语筛选保持；PlatformReceipt、SafeAuditRecord、BridgeLocalView无独立生命周期。scope ref/projection切片/guard候选不因文件名升级独立truth。主语ID沿02，Rust函数snake_case转换不是另造API别名。

### 契约展开范围

| 实现面 | 完整03必须交付 | 当前前四步交付程度 |
|---|---|---|
| 业务/工程映射 | 模块capability/对象能力/文件/contracts与层依赖 | Step4只收稳工程归属，Step5后逐模块 |
| Command | 六入口schema、metadata、result、幂等/当前basis与异常 | 只承接清单，不在本轮编写完整DTO |
| Consumer | 四入口安全envelope/context/ACK与已知结果 | 只明确来源/职责；private transport不冒充业务接纳 |
| Query | 四view/page/marker、authorized read、denied/unavailable | 只明确只读职责；不写audit/refresh/probe |
| Job | 五input/output/current subject、trusted context、受限处理 | 只明确入口文件；不创建真实job_run_id/平台响应 |
| O01 | 仅有真实schema/准入的mutation产生canonical安全阶段 | 条件文件归属，不发明通用outbox或新producer |
| Persistence | local truth/ref/结果/audit的同UoW、CAS、唯一、提交未知probe | 只责任与抽象seam，driver可执行证明后续闭口 |
| Config/secret | loader/validator/builder、secret handle生命周期/失败 | Step3/4决定边界/路径，不给key值/env/token/pin实例 |
| Tests | typed fake/source拒绝/幂等/未知/crash/泄漏切口 | Step4给计划测试发现文件，不编写/运行测试 |

### 非范围与责任

| 非范围 | 留给哪一层 / 文档 | 当前处理 |
|---|---|---|
| 新增需求、BC/owner/ADR、20主语/17机改义 | 00/01/02 owning校准 | 命中则回源重审，不在03暗改 |
| 内部Conversation/Turn/Identity/Gate/Decision/Artifact/Workspace truth | 对应owner | 只消费正式ref/qualified safe input，不造实体或owner mirror |
| 四平台账号/安装/消息/渠道truth及human认证 | 外部平台/正式身份入口 | 验证来源、授权关系和adapter-local记录，不自动GlobalMember |
| 未获owner资格的positive branch | BR-UP owning合同 | 设计blocked/unsupported/unknown面，不造fake permission/no-effect proof |
| SDK覆盖所有服务、平台SDK/OAuth/KMS/router具体实现选型 | 03后续seam资格核验 + 04绑定 | 前四步不指定产品/实例；SDK泛型client存在只说明候选入口 |
| 多语言产品/plugin/UI/Chat固定入口或跨平台广播 | 需新产品范围/架构裁剪 | 当前无正式输入，不以P1代称已计划能力 |
| 完整环境/profile/default/env/secret ref填写与pin部署矩阵 | 04 | 03只binding类型/装配/validator合同；不得填真实secret |
| TC/fixture/suite/自动化脚本与证据目录完整方案 | 05/06/07 | 03只最小切口；未定义脚本不写空目录或伪报告 |
| phase/commit boundary/实施台账/skeleton/排期 | 07正式完成阶段 | 前四步不创建，保持无实施授权 |
| 实现仓创建、code/config/script/test写入和真实运行/提交 | 后续明确授权的实施流程 | 当前仓路径不存在，不做mkdir/git init/Cargo初始化 |

### 优先级与授权边界

16FR保护均保P0，不把pending变P1。没有新的P1/P2实现面可由当前材料推导，因此不列“future支持”来扩大任务。当前授权完成Step4后必须停止；SOP未来Step只是总计划，未授权部分无文件。

复杂度：范围是同一承接单组，六U与技术层矩阵足以反查，不拆附录；本章禁止图，不画图。完整对象/protocol/flow仍按后续模块小循环，不能以本表代替。

## 8. 回填草稿

正式§2摘录§7设计目标/六U承接/契约展开和非范围。必须同时写明完整03目标与当前Step1~4完成程度：当前只能提供组织输入，不能移交代码。O01保条件，不恢复旧payload/timeout自动replay或new success。草稿不新增结论，正式03仍不写。

## 9. 待确认事项

BR-UP-001~009=open，010=reference_only；本地待展开与实际运行资格分开。

## 10. 自检及进入下一步条件

| 自检项 | 结论 | 依据 |
|---|---|---|
| 固定全集覆盖 | pass | 六U恰20对象/20主语；19入口流、17机和243类型索引有承接 |
| P0与授权不混同 | pass | 16FR不后移；Step4之后无执行许可，未写未来Step |
| 非范围明确 | pass | 04值/profile、05/06证据、07计划、owner/platform truth各有归属 |
| 安全边界 | pass | mandatory admission、same effect、query no-write、body-free未删减 |
| 取舍/历史/草稿一致 | pass | 本地计划不是实现成功；历史后置、正式未污染 |

gate_status=pass；gate_reason=full03_scope_and_current_step04_limit_closed；next_allowed_action=read_step03_coding_runtime_dependency_sources；source_files=Step1/§2/正式02§2/12；formal_backfill_allowed=false；commit_required=false。
