# C-MP-4. 受控分发与可判别接收关系需求小循环

## 1. 能力状态与计划

`pass / stop_review`；C1～3 停审。问题/诊断/取舍 done；结构化、草稿、自检 pending。

## 2. 输入

C3 exact 版本选择、C1 正式主体/来源、C2 决定资格；MP-UP-005/006；镜像正式03 logic-only/receiver pending 与 Artifact consumption scope；用户禁止私造 payment/installed truth。

## 3. SOP 问题回答

1. 故事：消费者希望受控获取确切版本并知道进展；组织管理者希望知道目标环境接收是否确实确认。
2. 功能：获取资格消费/窄 entitlement 视图、分发意图及关系、接收结果对账。免费/组织内也需授权和 source scope，不把 payment 不可用降级为无 gate 免费获取。
3. 规则：每次新获取再校验 source、publisher、Gov、可见性与未撤回状态；既有选择不是永久资格。局部请求/派发/ACK/接收/激活五个证明层分开；版本不匹配 receipt 拒绝；unknown 不盲重试制造二次安装。
4. 数据：获取请求、局部分发关系、intent/attempt 与结果 marker 是市场事实；接收结果/entitlement 来源只引用/快照；财务与安装 truth 不保存。
5. 接口：同步受控获取、只读状态、受控 receipt 输入和对账；receiver、scope、intent、exact version 的正式合同是强前置，尚不指定 member-service 是所有类型统一安装 owner。
6. 质量：同 key 同意图 replay 原结果；不同意图 conflict；unknown 可追溯对账，局部提交与外部 side effect 分开，撤回并发先保证不新增允许分发。
7. 验收：正确 scope/资格/receiver 绑定能产生局部请求而非 installed；timeout、重复、乱序、错版本、接收未知、并发撤回保持区分；无财务 owner 不出现真实订单/订阅/支付状态。

## 4. 诊断

旧00 §5 US-002、§6 F-006/F-007 合并购买/安装/审计。draft02 entitlement 订阅词会使 Billing 成为隐性局部 truth；UI acquire history 只是演示记录。镜像 ResolveInstantiableEntry 是 logical query，不能推导一个可运行市场下载/激活 API。

## 5. 改前后

| 项 | 改前 | 改后 | 原因 |
|---|---|---|---|
| 获取 | 点击即 installed | 受控 intent/分发/接收结果分层 | 外部 receiver authority |
| entitlement | 包含付费订阅 | 仅正式获取授权来源的视图 | Billing owner 缺失 |
| 超时 | 自动重新安装 | unknown 对账原意图 | 副作用不能盲重放 |

## 6. 取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 局部分发事实与外部 receipt 来源 | 责任清楚，可恢复 | 缺 receiver 合同阻正向 | 采用 |
| 市场安装器/简单 payment | 容易闭环演示 | 越权 runtime/财务 truth | 不采用 |
| transport ACK 即成功 | 简单 | 无 receiver commit 证明 | 不采用 |

## 7. 结构化中间产物

| 编号 | 用户故事 | 类型 | 价值 | 闭环 |
|---|---|---|---|---|
| US-MP-401 | 作为消费者，我希望获取明确版本并知道处理是否成功、失败或未知，以便不会误认为已安装。 | 核心闭环 | 可靠获取 | C4 |
| US-MP-402 | 作为组织管理者，我希望分发关系能回指目标接收结果，以便追溯谁获取了什么。 | 核心闭环 | 交接责任 | C4 |

故事停审：无付款/安装执行目标。

| 功能 | 类型 | 输入→结果；失败 | 闭环 | 故事 |
|---|---|---|---|---|
| FR-MP-401 获取资格视图 | 核心闭环能力 | consumer scope 与正式授权/来源/上架版本→可获取/拒绝/未知资格；无授权、撤回、失效不放行 | C4 | 401 |
| FR-MP-402 受控分发关系 | 核心闭环能力 | exact 版本、目标 receiver、受控获取意图→请求与局部关系/交接状态；缺合同/基线冲突不派发 | C4 | 401/402 |
| FR-MP-403 接收结果对账 | 核心闭环能力 | 同意图与版本的正式接收结果→确认/失败/未知关系；错来源/错版本不采纳，未知不盲重放 | C4 | 401/402 |

| 规则 | 类型 | 内容 | 对象/功能 |
|---|---|---|---|
| BR-MP-401 | 不变量 | 新分发必须按当前正式来源、权限、市场版本及未撤回资格再核验，先前 UI 选择/缓存不授权 | 获取，FR401/402 |
| BR-MP-402 | 边界约束 | 请求/派发/ACK/接收结果不生成安装激活、付款或订阅事实 | 分发，FR402/403 |
| BR-MP-403 | 不变量 | 同意图重复只有一个局部关系与原结果；不同意图冲突，外部 unknown 先按原意图对账 | 分发恢复，FR402/403 |
| BR-MP-404 | 禁止行为 | 无 Billing owner 不接收/推断 paid/settled/subscribed，免费也不能绕授权 | entitlement，FR401 |

| 数据 | 类型 | 归属 | 生命周期 | 功能 |
|---|---|---|---|---|
| D-MP-401 获取意图/分发关系/attempt 及局部结果 | 真相 | 市场拥有自己的受控获取及交接过程事实 | 显式建立、尝试、完成/失败/未知/取消，历史保留 | FR402/403 |
| D-MP-402 正式获取授权来源/接收结果引用 | 引用 | 外部授权/receiver owns truth，市场只关联 | 变更/失效保持来源，不能修改外部状态 | FR401/403 |
| D-MP-403 窄 entitlement 与接收安全状态摘要 | 快照 | 正式来源不属于本仓，仅作受控可见摘要 | 随来源变化/未知，不形成财务或授权 truth | FR401/403 |
| D-MP-404 支付/账单/订单/订阅、安装激活、资产内容/凭据 | 禁止保存正文 | 不属于市场 truth 范围 | 不进入当前生命周期 | BR402/404 |

| 接口 | 类型 | 能力边界 | 功能 |
|---|---|---|---|
| IF-MP-401 | 变更接口 | 受控获取/取消及局部分发意图 | FR401/402 |
| IF-MP-402 | 查询接口 | 获取资格、自己/组织的关系与结果状态 | FR401～403 |
| IF-MP-403 | 变更接口/后台任务接口 | 正式接收结果映射与未知交接对账 | FR403 |
| DEP-MP-401 | 外部能力依赖，输入，不适用 | 正式获取授权来源，owner pending | FR401 |
| DEP-MP-402 | 下游消费依赖，输出，运行期候选 | 每类型明确 receiver 与可用 owner 交付引用；MP-UP-005，不假定已集成 | FR402/403 |

以上属核心。没有 Billing 接口，没有安装器接口。

| 质量 | 类别 | 要求/判断口径 |
|---|---|---|
| NFR-MP-401 | 幂等/一致性 | 同 key/scope/operation 的同 canonical 意图重放原完整结果，不产生第二关系；不同意图 conflict；外部 unknown 可对账原意图 |
| NFR-MP-402 | 可用性/审计 | 请求、attempt、外部引用、版本、consumer/receiver/scope 可追溯；失败与未知可查，局部重试不冒充外部已提交 |

| 状态主语 | 需求阶段 | 触发/依据 | 不等于 |
|---|---|---|---|
| 分发关系 | 已请求→待交接/受阻→处理中→接收确认/失败/未知/取消 | 受控意图、当前 gate、正式接收结果；取消不撤销外部已提交 | installed/activated |
| 外部接收状态视图 | 未知/确认/失败等正式来源标签 | 仅复制 qualified receiver outcome | 市场可写 receiver truth |
| entitlement 视图 | 可获取/不可获取/未知/失效 | 正式授权及适用范围来源 | purchased/subscribed |

01～03 承接：分发模块、本地 relation/intent/attempt/result、SDK/owner receiver adapter、局部 gate 与撤回并发顺序、idempotency request canonical digest/result read-back、外部调用 cut、重试/对账 callable、原子局部关系+追溯+后续派发意图。业务 accepted 与 external side effect 分层，不能跨 owner 事务。参数可控超时/重试预算/维护批量，不允许配置认定 success、放开 paywall 或绕 source/auth/Gov。真实下载 location/materialization 必须 owner 授权且防 secret 泄漏，不根据 digest 拼 URL。

| 验收 | 类别 | 条件 | 映射 |
|---|---|---|---|
| AC-MP-401 | 核心/功能 | 当前资格+exact 版本+receiver 合同有效才建立分发；撤回/无授权/来源不可用拒绝；免费/组织内同样受 gate | FR401/402，BR401/404 |
| AC-MP-402 | 规则/数据 | 仅匹配 intent/version/consumer/receiver/scope 的正式结果可映射；ACK 不显示 installed/paid；窄视图不复制授权或财务 truth | FR403，BR402，D401～404 |
| AC-MP-403 | 非功能 | duplicate 返回原结果且不重复外部副作用；different intent conflict；timeout/取消竞争/乱序保留 unknown 或实际来源结果，不能盲重试 | BR403，NFR401/402 |

VETO-MP-4：把获取/ACK 显示为安装激活，或无财务 authority 造支付/订阅结果，整体不得通过。最小测试切口：authorization/receiver fake、request intent 重放/冲突、commit-before-timeout、错 receipt、并发撤回/取消。fake 只证明局部行为，不证明真实下载、安装、支付或 receiver commit。

复杂度：局部关系与外部视图分开审查；没有统一 Installed 状态机，无需财务附录。

## 8. 回填草稿

按主题摘录上表与获取前置/unknown 要求，不写最终 enum、UoW/adapter 签名。transaction 为未开放 future，不新造空财务实体。

## 9. 待确认

MP-UP-005/003 阻对应新获取；MP-UP-006 全部 future/blocker。transaction 不开放写入口；局部获取状态不命名 paid/settled/subscribed；不能假定 receipt 表示 activated。

## 10. 能力停审

所有故事至验收有来源，资格/关系/receiver/entitlement 分开，未知对账与证明上限明确。计划 done；`pass / stop_review`，允许 C5；正向接收合同 blocked 不关闭。
