# L6-bridges 01 Step 10：关键技术选型与 seam 机制

> full-restart；done / pass；正式01不写。

## 1. 状态与 Step 内计划

开工：Step2、Step7、Step8、Step9 pass；已读架构SOP Step10、规范§4.11、00平台来源附录和BR-UP-007~009。先区分架构层机制与实现载体，再逐项说明问题、采用理由、代价和资格 seam；不把SDK、OAuth、API Key、KMS、消息中间件、数据库或路由产品写成已选事实。

| 讨论面 | 思考 | 写入 | 自检 | gate_status / 下一动作 |
|---|---|---|---|---|
| 外部协议隔离与adapter seam | done | done | done | pass / adapter_mechanisms_stopped |
| 状态、效果、连续性与恢复机制 | done | done | done | pass / continuity_mechanisms_stopped |
| secret、材料和安全读取机制 | done | done | done | pass / safety_mechanisms_stopped |
| 未选产品/载体与资格边界 | done | done | done | pass / product_boundary_stopped |

## 2. 输入与问题回答

| SOP问题 | 当前回答 |
|---|---|
| 哪些机制已上升为架构决定？ | typed adapter反腐、逐安装能力资格、body-free引用、阶段/效果分离、命名空间幂等、比较器约束cursor、受控后台恢复、opaque secret private seam、外显前治理预检和只读安全视图。 |
| 每项解决什么问题？ | 分别保护平台差异、能力误报、正文/凭证泄露、阶段伪造、重复效果、跨流乱序、未知恢复、secret扩散、未授权外显和读取副作用。 |
| 为什么当前值得采用？ | 这些机制同时改变边界保护、一致性方式、关键交互承接或外部差异隔离，属于本仓存在的结构压力，不是局部编码偏好。 |
| 代价是什么？ | 增加adapter合同、版本快照、引用解析、状态解释、人工对账、平台逐安装核验和后续详细设计负担；部分能力会保持blocked/unsupported。 |
| 哪些暂不引入？ | 不选定具体SDK/API client、OAuth授权流、PAT/bot token/API key供应方式、KMS/secret provider、消息总线/队列、数据库/缓存、路由或部署产品。 |

## 3. 当前材料诊断与总取舍

旧 `01-架构设计.md` 以Python/TypeScript、具体SDK、队列和数据库候选作为架构结论，却没有说明这些载体如何保护真相、授权和未知效果；相反，需求和Step7~9已经收稳了更高层的结构压力。当前采用机制先于产品：先规定所有产品必须满足的adapter、引用、效果连续性、恢复和安全边界，再把实际SDK/provider/router留到真实版本、scope、环境和配置合同核验。这样会牺牲“立即给出一套技术栈”的完整感，却避免把公开平台资料、默认SDK行为或未建立的secret能力伪装成可落码事实。

## 4. 关键技术机制表

| 技术机制 | 解决的问题 | 采用理由 | 代价 / 约束 | 说明 |
|---|---|---|---|---|
| typed adapter反腐接缝 | 平台原始对象、签名、回调、线程和错误语义穿透核心 | 所有四平台都存在入口、变化、能力和效果差异，必须在外边界归一为带来源/版本/主体kind的局部语义 | 每个平台需要独立合同、能力核验和差异测试；不能用一个“通用消息”抹平差异 | 该机制决定外部语义如何进入U1~U4，属于边界结构而非局部转换函数。 |
| 按installation的能力/版本资格快照 | 把公开协议或配置接受误报为已安装、可用、等价能力 | 安装scope、版本、入口、线程/编辑/删除/限流能力必须逐安装核验；snapshot带来源/版本但不替代owner授权 | snapshot会过期，需要失效、重核和blocked/stale解释；不能声明四平台4/4可用 | 该机制影响哪些路径能激活、哪些只能degraded/unsupported，属于架构资格门。 |
| typed mapping与binding generation | external ID、显示名或同名位置导致跨安装/主体/target串绑 | 映射必须携带platform/installation/kind、typed target、generation和basis/version引用，撤销可阻新操作 | 映射关系维度更多，变更和迁移须显式管理；旧mapping不能静默改义 | 该机制保护本仓局部relation并隔离外部实体，不是数据库字段偏好。 |
| body-free reference与安全材料seam | 原消息、附件、敏感Gate和私有URL进入durable、日志或证据 | 正式owner保有正文/材料，本仓只在瞬时转换中使用并保存获准ref、版本和有限reason | 可靠回放依赖owner读取/重解析合同；材料缺失时必须blocked，不能用缓存正文补齐 | 该机制同时约束数据所有权、恢复和观察出口，是跨单元结构手段。 |
| 阶段结果与stable effect分离 | ACK、owner接纳、平台效果和consumer接受互相冒称 | 每个阶段有独立owner和可解释结果；delivery intent固定source/target/version/effect，attempt追加观察 | 状态更多、查询解释更复杂，unknown必须长期可见；不能用单一success字段简化 | 该机制决定核心交互和恢复的语义形状，不是局部状态枚举。 |
| 命名空间幂等与effect连续性 | 重放、回调重复、租户混淆或超时造成重复业务效果 | management/inbound/callback/outbound/recovery-handoff分namespace；同义复用结果，变义隔离 | 需要稳定operation identity、语义版本和冲突处理；dedup窗口不足时不能自动重放 | 该机制保护跨adapter、后台和恢复的共同不变量，必须由后续03闭合编码。 |
| comparator约束的cursor/epoch/gap | 把时间戳、裸ID或跨session位置当作完整水位，吞掉变化或越过缺口 | cursor区分protocol/owner/effect位置，并要求stream/epoch/comparator可比；gap只有权威覆盖才关闭 | 每个平台、安装和入口可能需要不同比较器；不可比就会降为gap/manual | 该机制决定连续性和回放边界，不能被普通队列offset或数据库自增替代。 |
| 受控后台承接与局部恢复 | 限流、延迟、未知效果和材料重解析无法在同步边界即时完成 | 后台只推进已有intent/effect、更新局部记录或重建派生view；任务状态不升级外部结果 | 需要预算、顺序、lease/fence和人工处理口径；后台不能保证外部效果或无限重试 | 这是运行交互与一致性的架构承接方式，不是某个worker实现。 |
| opaque secret reference与private resolution seam | token、OAuth code、PAT/API key、签名材料扩散到配置、日志或消息 | 本地只保存provider ref/version和资格状态，raw值仅在私有接缝短暂解析使用 | 依赖secret provider、轮换、scope和审计合同；provider未选时相关路径必须waiting/blocked | 该机制约束配置、adapter和证据边界，不能用环境变量或默认token替代资格。 |
| 外显前治理/可见性预检 | 内部commit或低敏感提示被误作可公开、可操作内容 | U3/U4在形成intent或owner action前重新验证当前binding、visibility、Policy/Gate、material和action basis | 每次变化都可能使intent失效；需要最小外显和明确降级，不得缓存无限期授权 | 该机制连接治理owner与adapter边界，不是本仓自建Policy/Gate。 |
| body-free只读安全视图 | 查询、观察和审计读取触发维护或泄露高基数/敏感材料 | view由局部truth派生，按scope/visibility裁剪，denied/unavailable与空结果分开，query no-write | 视图可能stale，重建需后台预算；Observability消费仍是外部结果 | 该机制决定安全读取和观察交接的结构，不是某个查询框架选择。 |

## 5. 技术边界说明

这些机制之所以进入架构主线，是因为它们共同决定外部能力如何被承接、局部状态如何保持连续，以及未知和敏感材料如何被安全解释。具体SDK、HTTP/Gateway/polling入口、队列、数据库、缓存、KMS和部署形态只是这些机制的潜在载体，尚未构成当前架构事实。后续文档可以在真实版本和环境合同成立后选择载体，但不得降低typed mapping、body-free、effect continuity、unknown保留或no-write读取约束。

## 6. 采用 / 不采用轻量对照

| 当前采用的架构机制 | 当前不采用的相邻思路 | 不采用原因 |
|---|---|---|
| typed adapter + per-installation capability gate | 一个跨平台通用消息/能力层直接承诺等价 | 会抹平线程、回调、限流、scope和版本差异，形成虚假兼容。 |
| body-free ref + owner materialization seam | 在Bridges缓存完整消息/附件以保证回放 | 形成第二truth并扩大敏感正文、secret和链接泄露面。 |
| stable effect + unknown/manual对账 | 超时后默认失败并再次发送 | 无法证明无副作用，会制造重复外部效果。 |
| comparator-scoped cursor + explicit gap | 用时间戳、裸external_id或全局offset统一排序 | 跨安装、session、stream不可比，可能吞变化或错误关闭gap。 |
| opaque secret ref + private resolution | 在配置或日志中保存token/API key/回调私钥 | 无法满足最小暴露、轮换和证据边界。 |
| query no-write safe view | 读取时顺手刷新、repair、replay或补权限 | 混淆读取与维护，破坏阶段解释和审计可追溯性。 |

## 7. 产品、协议和provider资格边界

| 选择面 | 当前架构只规定 | 当前状态 / 后续核验 |
|---|---|---|
| 平台SDK或直接API | 必须实现typed adapter、来源验证、能力版本、结果解析和安全材料边界 | `not_selected`；按平台/部署版本/安装scope在02~04重核。 |
| Slack安装与OAuth、Mattermost PAT/plugin、Telegram bot入口、Discord HTTP/Gateway/OAuth | 只作为可能的adapter能力分支，不把任一授权流视为默认 | `not_established`；公开来源只证明部分语义，Telegram官网读取仍待核，四平台不宣称正向通过。 |
| API key / bot token / OAuth token / interaction token | 只允许opaque provider ref/version，经private seam解析 | provider、scope、rotation、撤销和审计合同未建立；raw secret禁止落盘。 |
| KMS/secret manager | 只作为可替换的secret resolution边界 | 产品未选；没有有效provider/ref时对应配置不能激活。 |
| Bus/queue/router | 只承接已确定的异步事实、后台任务和边界隔离，不拥有业务truth | 产品与拓扑未选；不得把transport ACK当owner/platform结果。 |
| database/cache/storage | 只需承载本仓局部truth和可重建view，不能保存禁止body或共享owner表 | 产品/分片/缓存策略未选，留待02/03/04/实施前真实核验。 |

## 8. adapter/config/secret seam最低资格

| seam | 必须可证明 | 缺口姿态 |
|---|---|---|
| adapter seam | installation/平台kind、来源验证、mapping kind、变化/线程能力、业务结果和限流语义可版本化 | 任一关键维度不可比则unsupported/degraded或blocked，不用默认兼容。 |
| config seam | binding generation、direction/action、route policy、capability revision、有效期/撤销和稳定引用可审计 | 配置接受不等激活；缺scope/basis/version保持waiting。 |
| secret seam | opaque ref、provider/version、scope、轮换/撤销状态和private读取资格可验证 | raw值只在private seam瞬时解析使用，不向durable/日志/证据输出；provider未知或解析失败停止受影响操作。 |
| recovery seam | 原operation/effect、权威probe或覆盖、cursor comparator、预算和人工出口可解释 | unknown/gap/manual保留；不以默认retry或新effect补齐。 |
| evidence seam | 仅输出安全ref/版本/阶段/有限reason/位置摘要和真实handoff状态 | 不输出body、secret、私有URL、敏感Gate或虚构report/evidence/verdict。 |

## 9. 跨机制审计与后续承接

| 审计面 | 结果 |
|---|---|
| 与Step7依赖一致 | adapter/provider只在外部接缝，核心只依赖typed boundary；runtime/event未误写compile/package。 |
| 与Step8数据一致 | body-free/ref、局部truth、可重建view和unknown保留未被任何产品选择放宽。 |
| 与Step9交互一致 | 同步资格、异步事实、后台恢复和补偿机制有明确载体约束，不把产品名当通信方式。 |
| 与需求来源一致 | FR001~016、BR001~024、DR001~020和NFR001~016的技术保护口径可回链；BR-UP-001~009仍open。 |
| 可落码边界 | 机制已具体到adapter、mapping、effect、cursor、secret和view资格；字段/DTO/函数/部署仍留02~04闭合。 |
| 事实安全 | 未声称账号、grant、token、SDK版本、provider、运行、测试、投递、evidence或ready已存在。 |

## 10. 回填草稿、门禁与来源

正式 `01-架构设计.md §11` 计划摘录：§4机制表、§5边界说明、§6轻量对照、§7未选产品/资格边界和§8 seam最低资格；不将其扩展为产品横评。完整备选路径进入Step11，配置/版本/环境合同进入后续文档。

来源：`01_arch_step_02_goals_constraints.md`、`01_arch_step_07_dependencies.md`、`01_arch_step_08_data_consistency.md`、`01_arch_step_09_interactions.md`、`00_req_step_05_platform_source_verification.md`、`00-需求文档.md` §9~§14、架构SOP Step10、架构设计书写规范§4.11。

自检：已逐项说明机制的问题、理由、代价、架构资格与未选边界；未滑入技术栈清单、产品横评、部署参数或实现细节。当前agent设计自检通过。

Step16全文复核将§8“不读raw secret”的省略表述按§4/§7修正为private瞬时解析、raw值不出私有边界；没有选定provider或建立真实secret资格。

`gate_status=pass`；`gate_reason=architecture_mechanisms_and_unselected_product_boundaries_audited`；`next_allowed_action=read_step_11_then_create`；`formal_backfill_allowed=after_step_16_three_level_gate`；`commit_required=false`。
