# Step 5. 模块实现契约主轴

## 1. Step状态

状态：[x] completed；gate_status=pass；current_module=closed；formal_fill_allowed=false。Step4已pass，最新授权到Step10；不装配正式03。

### Step内计划

contracts→domain→application→infra→api→worker→jobs逐模块小循环；每模块先问题/依据/诊断/取舍再职责/出口/依赖/测试承接和自检。最后矩阵/文件/历史审计，回填§5主轴。未完成前不创建Step6。

## 2. 本步输入

[Step4](03_ddd_step_04_file_layout.md)、[Step3](03_ddd_step_03_constraints.md)、[正式02](../02-概要设计.md) §4~12、[正式01](../01-架构设计.md) §7~11；项目ledger、03 flow。详细设计SOP Step5、书写规范§5.5、中间产物规范§3.5、闭环标准§2.2.1A/2.2.2。参考governance 03 Step5完整模块小节/矩阵及artifact Step5结构，不继承业务truth。

## 3. SOP问题回答

1. 模块如何拆？以Step4七role作为七实现模块，内部子模块按已有文件职责，不按七CP或六owner拆库。
2. 对应概要什么？contracts承接协议/公共局部词汇；domain承接16对象和纯规则；application承接七service/ports；infra适配/配置/组装；api、worker、jobs分别承接8/2/4入口。
3. 暴露什么？只暴露模块职责所需类型与显式构造/调用；安全输入证明不从请求字段直接反序列化成trusted值；不glob re-export内部store。
4. 允许依赖谁？沿contracts→domain→application的反向使用层级、infra实现application ports，入口调用application；api纯library不需要正常依赖infra，worker/jobs仅composition root可用infra。实际矩阵在逐模块收口后形成。
5. 对象归属？DTO/局部词汇contracts，16对象domain，service/ports及操作上下文application，技术adapter/config/builder为infra，handler/runner为入口；test fake只测试模块。

## 4. 当前文档问题诊断

| 位置 | 缺口 | 处置 |
|---|---|---|
| Step4 §7.10 | 依赖方向只有预告 | 固定正常/dev/外部候选依赖矩阵和可见性 |
| Step4 source_inputs | trusted成功载体可能有公开可写字段 | 原始输入与验证后值分开，构造入口及来源待Step6/7严格闭合 |
| Step4 api组装 | 无server却可能引入infra | api library不直接依赖infra；外部宿主/测试负责组装 |
| 02 §6/7 | 本地scope key可能误含临时resolution_ref | 稳定身份与调用时证明分离；Step6独立定义 |
| 参考governance | outbox、authorization policy等非本仓职责 | 仅复用工程分层和审查粒度 |

## 5. 改动前后对比

| 项 | 前 | 后 | 原因 |
|---|---|---|---|
| 模块边界 | 文件职责 | 出口/私有构造/调用/依赖合同 | 实现者无需猜测层间访问 |
| shared数据 | 语义槽位 | 本地词汇与owner待绑定符号分开 | 不用本地Opaque成功体补上游 |
| Query能力 | 只读原则 | 应用只读port与组装隔离 | 限制偷写的可调用面 |

## 6. 设计取舍

采用七技术模块与逐文件可见性；不采用按CP拆crate或shared/common大桶。局部ID/版本/state统一词汇，领域对象保留私有字段/工厂。Core共享符号本轮逐项核验，只有已核验子集可提出compile绑定，不把workspace专用schema也关单。

## 7. 结构化中间产物

逐模块产物按以下顺序写入：contracts、domain、application、infra、api、worker、jobs。

### 7.1 contracts模块

问题/依据：CP1~CP7的局部词汇、四协议族和安全响应，来源02 §5~12与Step4 contracts文件表。诊断：若职责只由文件名表示，contracts的调用者仍可绕过局部owner或直接操纵状态。取舍：局部enum/ID集中命名；domain不通过复制DTO产生另一套状态；trusted输入需正式验证构造；不采用无边界pub字段/全量re-export和万能service。

| 项 | 合同 |
|---|---|
| 实现单元 | crates/contracts / workspace-contracts |
| 主要责任 | CP1~CP7的局部词汇、四协议族和安全响应 |
| 文件/主体 | crates/contracts/src/下local_refs/context/commands/queries/source_inputs/operations/views/errors；每个名称对应Step4具体.rs，根lib.rs只显式导出需要的主体 |
| 对外暴露 | DTO、局部ID/version/state、受控输入与安全失败；不导出raw owner JSON或token秘密 |
| 允许依赖 | 无本仓依赖；Core核验子集候选 |
| 禁止依赖 | 其他六模块、owner/bus/SDK |
| capability → 对象/协作 | 局部enum/ID集中命名；domain不通过复制DTO产生另一套状态；trusted输入需正式验证构造 |
| 错误/测试承接 | 协议反序列化不能制造授权；协议字段与外部符号在Step6/8来源表闭合；Step6对象，Step7 ports，Step8/9协议/流，Step10状态，Step16完整测试 |

模块回填摘要：按本表责任/出口/允许禁止组织§5.1，不把诊断写进正文。模块自检：协议反序列化不能制造授权；协议字段与外部符号在Step6/8来源表闭合；无新owner/公开入口，gate=pass。

### 7.2 domain模块

问题/依据：16对象与InboxProjector局部不变量，来源02 §5~12与Step4 domain文件表。诊断：若职责只由文件名表示，domain的调用者仍可绕过局部owner或直接操纵状态。取舍：纯计算guard接受正式证明，不实现owner authorization policy；序列化存储需验证重建入口，不pub字段绕过；不采用无边界pub字段/全量re-export和万能service。

| 项 | 合同 |
|---|---|
| 实现单元 | crates/domain / workspace-domain |
| 主要责任 | 16对象与InboxProjector局部不变量 |
| 文件/主体 | crates/domain/src/下partition/source/projection/inbox/local_attention/operation_record/recovery/read_view/errors；每个名称对应Step4具体.rs，根lib.rs只显式导出需要的主体 |
| 对外暴露 | 只读getter、验证工厂/迁移函数、DomainError；字段私有；无可任意重写state的setter |
| 允许依赖 | contracts |
| 禁止依赖 | application/infra/api/worker/jobs、I/O/config/SDK |
| capability → 对象/协作 | 纯计算guard接受正式证明，不实现owner authorization policy；序列化存储需验证重建入口，不pub字段绕过 |
| 错误/测试承接 | 16对象每个唯一归属；源cursor、用户read和page不互换；Step6对象，Step7 ports，Step8/9协议/流，Step10状态，Step16完整测试 |

模块回填摘要：按本表责任/出口/允许禁止组织§5.2，不把诊断写进正文。模块自检：16对象每个唯一归属；源cursor、用户read和page不互换；无新owner/公开入口，gate=pass。

### 7.3 application模块

问题/依据：七service、read-only/source/transaction ports、局部操作上下文，来源02 §5~12与Step4 application文件表。诊断：若职责只由文件名表示，application的调用者仍可绕过局部owner或直接操纵状态。取舍：WorkspaceQueryService仅持有read/source/scope/visibility；原子写服务持有受限UoW；存储提交结果与领域tentative结果不同；不采用无边界pub字段/全量re-export和万能service。

| 项 | 合同 |
|---|---|
| 实现单元 | crates/application / workspace-application |
| 主要责任 | 七service、read-only/source/transaction ports、局部操作上下文 |
| 文件/主体 | crates/application/src/下七service文件、scope_ports/source_ports/store_ports/operation_context/errors；每个名称对应Step4具体.rs，根lib.rs只显式导出需要的主体 |
| 对外暴露 | 明确service方法/能力句柄、读取/原子写ports、操作上下文、ApplicationError；不公开任意写dispatcher |
| 允许依赖 | contracts、domain |
| 禁止依赖 | infra和三入口、HTTP/DB/Tokio类型 |
| capability → 对象/协作 | WorkspaceQueryService仅持有read/source/scope/visibility；原子写服务持有受限UoW；存储提交结果与领域tentative结果不同 |
| 错误/测试承接 | 14入口及内部CP2/4可回指；幂等原结果读取不是再次执行；scope解析证明不得进稳定操作key；Step6对象，Step7 ports，Step8/9协议/流，Step10状态，Step16完整测试 |

模块回填摘要：按本表责任/出口/允许禁止组织§5.3，不把诊断写进正文。模块自检：14入口及内部CP2/4可回指；幂等原结果读取不是再次执行；scope解析证明不得进稳定操作key；无新owner/公开入口，gate=pass。

### 7.4 infra模块

问题/依据：只读owner/bus接缝、本地store、配置与组装，来源02 §5~12与Step4 infra文件表。诊断：若职责只由文件名表示，infra的调用者仍可绕过局部owner或直接操纵状态。取舍：配置校验后分别构建query/command/maintenance能力；fake留tests，不允许production fallback；不采用无边界pub字段/全量re-export和万能service。

| 项 | 合同 |
|---|---|
| 实现单元 | crates/infra / workspace-infra |
| 主要责任 | 只读owner/bus接缝、本地store、配置与组装 |
| 文件/主体 | crates/infra/src/下store_adapter/scope_adapter/owner_source_adapter/visibility_adapter/recovery_source_adapter/bus_subscription/config/runtime_builder/errors；每个名称对应Step4具体.rs，根lib.rs只显式导出需要的主体 |
| 对外暴露 | builder、安全只读/写能力句柄；具体store/连接字段private，adapter构造只给获准composition root |
| 允许依赖 | contracts、domain、application；Tokio运行边界 |
| 禁止依赖 | api/worker/jobs正常依赖及所有owner业务crate |
| capability → 对象/协作 | 配置校验后分别构建query/command/maintenance能力；fake留tests，不允许production fallback |
| 错误/测试承接 | backend/owner正向adapter保持blocked但本地故障分类必须可测；test dev可引用入口，不构成正常依赖环；Step6对象，Step7 ports，Step8/9协议/流，Step10状态，Step16完整测试 |

模块回填摘要：按本表责任/出口/允许禁止组织§5.4，不把诊断写进正文。模块自检：backend/owner正向adapter保持blocked但本地故障分类必须可测；test dev可引用入口，不构成正常依赖环；无新owner/公开入口，gate=pass。

### 7.5 api模块

问题/依据：两Command、六Query传输无关入口，来源02 §5~12与Step4 api文件表。诊断：若职责只由文件名表示，api的调用者仍可绕过局部owner或直接操纵状态。取舍：薄映射保留typed input/output和SafeReadFailure；不据HTTP状态、route字符串决定授权或用例；不采用无边界pub字段/全量re-export和万能service。

| 项 | 合同 |
|---|---|
| 实现单元 | crates/api / workspace-api |
| 主要责任 | 两Command、六Query传输无关入口 |
| 文件/主体 | crates/api/src/下command_handlers/query_handlers/errors；每个名称对应Step4具体.rs，根lib.rs只显式导出需要的主体 |
| 对外暴露 | CommandHandlers、QueryHandlers的具名调用；无route/server、无任意资源controller |
| 允许依赖 | contracts、application；不需要infra |
| 禁止依赖 | domain/infra/worker/jobs |
| capability → 对象/协作 | 薄映射保留typed input/output和SafeReadFailure；不据HTTP状态、route字符串决定授权或用例 |
| 错误/测试承接 | 所有Query包括export/status调用同一安全组合；handler无store字段；Step6对象，Step7 ports，Step8/9协议/流，Step10状态，Step16完整测试 |

模块回填摘要：按本表责任/出口/允许禁止组织§5.5，不把诊断写进正文。模块自检：所有Query包括export/status调用同一安全组合；handler无store字段；无新owner/公开入口，gate=pass。

### 7.6 worker模块

问题/依据：两owner入站Consumer及常驻消费loop，来源02 §5~12与Step4 worker文件表。诊断：若职责只由文件名表示，worker的调用者仍可绕过局部owner或直接操纵状态。取舍：只消费正式bus输入；应用结果与transport receipt分离；无outbound publisher，无recovery loop；不采用无边界pub字段/全量re-export和万能service。

| 项 | 合同 |
|---|---|
| 实现单元 | crates/worker / workspace-worker |
| 主要责任 | 两owner入站Consumer及常驻消费loop |
| 文件/主体 | crates/worker/src/下source_change_consumer/source_invalidation_consumer/consumer_loop/main；每个名称对应Step4具体.rs，根lib.rs只显式导出需要的主体 |
| 对外暴露 | SourceChangeConsumer、SourceInvalidationConsumer和受控loop；main是装配入口非业务API |
| 允许依赖 | contracts、application；infra仅main/装配 |
| 禁止依赖 | domain直接调用、api/jobs |
| capability → 对象/协作 | 只消费正式bus输入；应用结果与transport receipt分离；无outbound publisher，无recovery loop |
| 错误/测试承接 | 同来源普通change与明确失效不可双写同一效果；bus ack映射未闭合保持blocked；Step6对象，Step7 ports，Step8/9协议/流，Step10状态，Step16完整测试 |

模块回填摘要：按本表责任/出口/允许禁止组织§5.6，不把诊断写进正文。模块自检：同来源普通change与明确失效不可双写同一效果；bus ack映射未闭合保持blocked；无新owner/公开入口，gate=pass。

### 7.7 jobs模块

问题/依据：四个Operations一次有界维护调用，来源02 §5~12与Step4 jobs文件表。诊断：若职责只由文件名表示，jobs的调用者仍可绕过局部owner或直接操纵状态。取舍：不由参数ref猜scope/权限，不循环自动完成attempt，不产生archive accepted；不采用无边界pub字段/全量re-export和万能service。

| 项 | 合同 |
|---|---|
| 实现单元 | crates/jobs / workspace-jobs |
| 主要责任 | 四个Operations一次有界维护调用 |
| 文件/主体 | crates/jobs/src/下recovery_handlers/invalidation_handler及四bin；每个名称对应Step4具体.rs，根lib.rs只显式导出需要的主体 |
| 对外暴露 | RecoveryHandlers、InvalidationHandler；薄binary仅调用对应方法 |
| 允许依赖 | contracts、application；infra仅bin/装配 |
| 禁止依赖 | domain直接调用、api/worker |
| capability → 对象/协作 | 不由参数ref猜scope/权限，不循环自动完成attempt，不产生archive accepted |
| 错误/测试承接 | Request/Advance/Supersede/Invalidate均有caller surface，export不归jobs；Step6对象，Step7 ports，Step8/9协议/流，Step10状态，Step16完整测试 |

模块回填摘要：按本表责任/出口/允许禁止组织§5.7，不把诊断写进正文。模块自检：Request/Advance/Supersede/Invalidate均有caller surface，export不归jobs；无新owner/公开入口，gate=pass。

### 7.8 模块总览与依赖矩阵

行依赖列；Y为正常依赖，C仅composition root，D仅dev，—禁止；self略。该矩阵不表示网络调用。

| from/to | contracts | domain | application | infra | api | worker | jobs |
|---|---|---|---|---|---|---|---|
| contracts | self | — | — | — | — | — | — |
| domain | Y | self | — | — | — | — | — |
| application | Y | Y | self | — | — | — | — |
| infra | Y | Y | Y | self | D | D | D |
| api | Y | — | Y | — | self | — | — |
| worker | Y | — | Y | C | — | self | — |
| jobs | Y | — | Y | C | — | — | self |

```text
api ----------> application ------> domain ------> contracts
worker -------> application ---------------------> contracts
jobs ---------> application
infra --------> application ports + domain + contracts
worker/main --C--> infra
jobs/bin -----C--> infra
infra/tests --D--> api / worker / jobs
```

节点与模块名一致；箭头为代码依赖/使用，不是flow。测试dev环不能变正常环；api不依赖infra，缩小Step4允许上限无需增文件。infra builder只创建application主体，不返回api/worker/jobs对象，避免依赖反转。

| 类别 | 唯一归属 | 规则 |
|---|---|---|
| 本地ID/版本/公开state/reason、四族协议DTO | contracts | 不复制owner/Core共享schema |
| 16局部领域对象/纯InboxProjector | domain | 不直接Serialize/Deserialize可信状态；存储rehydrate须校验 |
| 七service、五既有port家族的能力细分、操作上下文 | application | 无具体adapter；读/写句柄分开 |
| store/owner/bus adapter、builder/config | infra | 技术实现，不拥有允许决定 |
| handler/loop/一次性runner | api/worker/jobs | only application调用；不直连repository |

对外Core仍唯一compile候选：本轮已开始逐symbol核验，后续Step6只在证明正式schema/实现定义/export一致时允许复用子集；不整体关闭WS-UP-007。runtime/event/ref/adapter/fake分类沿Step1，无其他sibling path。

复杂度：七模块独立小节和矩阵足够，不拆附录。77文件均能归属上述模块；后续基础词汇增文件须先修Step4。

## 8. 回填草稿

历史对照：draft/03 §2的Outbox/Read Handoff只为候选，本轮无publisher/outbox；scope visibility gateway不能变授权引擎；governance的多层工程组织可参考，其业务policy/trace/archive/external GRC不可继承。

§5草稿：本仓以contracts/domain/application/infra/api/worker/jobs为实现主轴，模块责任/文件/出口/依赖采用§7.1~7.7，代码依赖按§7.8。领域对象保护局部不变量，应用层定义ports与只读/原子写能力，infra不反向依赖入口。Query无写存储能力，trusted输入不能由外部请求字段自动取得可信资格；字段与构造面须在Step6/7闭合。所有来源缺口保留blocked，不等同实现就绪。

## 9. 待确认事项

WS-UP-001~008/006-S开放；不阻塞模块职责，但阻塞相应正向来源合同和实现就绪。

## 10. 下一步门禁

七模块小循环、允许/禁止/dev矩阵、文件/对象归属、历史对照与回填完成。无孤儿主体/新truth、无反向正常依赖；api正常依赖infra被裁掉，未增文件。gate_status=pass；next_allowed_action=step6；仅文档静态审计，不是测试或签署。
