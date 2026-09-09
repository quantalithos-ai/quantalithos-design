# 01 架构 Step 8：数据所有权与一致性

## 1. Step 状态

状态：completed / stop_review；模式：full-restart；对应 SOP：架构 SOP Step 8。
开工确认：项目台账、flow、前序 Step 已读；三层门禁允许当前 Step。formal_01_write_allowed 仍关闭。

### Step 内计划

- [x] 读取输入和前序结论：见 §2。
- [x] SOP 问题回答：见 §3。
- [x] 当前材料诊断：见 §4。
- [x] 设计取舍：见 §6。
- [x] 结构化中间产物。
- [x] 复杂度判断与按单元停审。
- [x] 回填草稿。
- [x] 自检与进入下一步条件。

模块骨架：U1 -> U2 -> U3 -> U4 -> U5 -> U6。未来 Step 不创建。

## 2. 本步输入

Step 3/5/7；正式 00 §10/11/13；闭环标准 §2.7.1/3.6/6.1；artifact/governance 01 §9；共同输入：正式 00、项目台账、架构 flow 的来源复核表、架构 SOP 对应 Step、书写规范对应章节、中间产物规范和真相源闭环标准。前序产物的未闭合 seam 仍保留。

## 3. SOP 问题回答

1. 哪些 truth 本地拥有？partition、本地应用记录/游标/视图版本、局部注意力与维护世代结果。
2. 哪些只派生？跨域 summary、Inbox 和 unread 是可重建结果；owner version/visibility 只是引用语境。
3. 强一致在哪里？本地输入应用记录、cursor、projection revision/coverage 原子成立；local change 与其局部版本原子；generation current 指针及状态原子切换。
4. 最终一致在哪里？source 到本地 projection；各 owner 版本不能合成全局强一致快照。
5. 如何处理失败？重复不重复应用；同 key 不同材料冲突；无顺序证据不回退 cursor；未知提交结果先查本地记录；无 baseline/cursor 接缝不切换。
6. 权限呢？读取需要有效正式决定；数据 stale 不许可安全 stale，撤销后旧 generation 也不可展示。
7. 重建如何保护 local state？源派生部分可重算；用户 pin/mute/ReadCursor 单独保留，不从源事件恢复或被新世代覆盖。
8. 版本/分页如何解释？source version、source cursor、view revision、generation、ReadCursor、page cursor 各有主语。分页绑定同一 scope/principal 与视图语境，变化失效不静默混页。

## 4. 当前文档问题诊断

正式 00 §11 把 source cursor/watermark 都列为 consumption truth，架构应限定“本地接受到的位置”的事实；其来源顺序及完整性仍由 owner 定义。draft 把 unread 并列 local state，需要区分用户 read intent 和派生 unread。

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 当前架构主题 | 正式 01 未创建，draft 只作候选 | 由本步输入独立收束后进入 §7 | 阻止历史草稿升级为真相 |
| 外部依赖 | 00 已登记 pending/blocker | 保留 owner 和解锁条件 | 不以架构补外部合同 |

## 6. 设计取舍

| 方案 | 优点 | 代价 | 结论 |
|---|---|---|---|
| 分区内原子应用 + owner 最终一致 + 独立 local overlay | 防重复、可恢复、保留用户状态 | 无全局瞬时一致保证 | 采用 |
| cursor 与投影分别提交 | 易实现 | 崩溃后跳过或重复应用 | 拒绝 |
| 从 archive/旧投影恢复全部状态 | 重建快 | 无 owner 事实与安全证明 | 拒绝 |

## 7. 结构化中间产物


### U1 单元校准

问题：truth 与派生如何区分？本地仅拥有 分区身份、scope 绑定的局部版本，外部/派生为 GlobalMember/Project/ProjectMember ref，正式 visibility 语境。
诊断：若所有内容都称 local state，会把 身份、成员资格、授权决定 混入本仓。
取舍：采用分层所有权与以下一致性规则；不采用共享表、跨域事务或复制正文。

| 本地 truth | snapshot/projection/ref | 一致性与失败口径 | forbidden body/write |
|---|---|---|---|
| 分区身份、scope 绑定的局部版本 | GlobalMember/Project/ProjectMember ref，正式 visibility 语境 | 分区 scope 不可悄然改为另一个主体；缺解析结果不创建假 scope | 身份、成员资格、授权决定 |

回填：本单元结构化结论进入本 Step 对应正式章节。
单元自检：来源、边界、一致性与非职责已核对；未新增外部合同或提前下沉 schema。
单元门禁 U1：思考 done / 写入 done / 自检 done / pass；停审后允许下一单元。


### U2 单元校准

问题：truth 与派生如何区分？本地仅拥有 本地接收/检查结果及安全失效记录，外部/派生为 owner 安全摘要、source version/watermark、visibility 决定引用。
诊断：若所有内容都称 local state，会把 源正文、raw event body、Policy 正文、credential 混入本仓。
取舍：采用分层所有权与以下一致性规则；不采用共享表、跨域事务或复制正文。

| 本地 truth | snapshot/projection/ref | 一致性与失败口径 | forbidden body/write |
|---|---|---|---|
| 本地接收/检查结果及安全失效记录 | owner 安全摘要、source version/watermark、visibility 决定引用 | 检查结果不创造 owner 不存在事实；超时不同于删除；安全语境失效禁展示 | 源正文、raw event body、Policy 正文、credential |

回填：本单元结构化结论进入本 Step 对应正式章节。
单元自检：来源、边界、一致性与非职责已核对；未新增外部合同或提前下沉 schema。
单元门禁 U2：思考 done / 写入 done / 自检 done / pass；停审后允许下一单元。


### U3 单元校准

问题：truth 与派生如何区分？本地仅拥有 application record、消费游标、view revision、coverage/gap，外部/派生为 materialized safe projection。
诊断：若所有内容都称 local state，会把 bus ack/delivery/retry/DLQ、全局事务序号 混入本仓。
取舍：采用分层所有权与以下一致性规则；不采用共享表、跨域事务或复制正文。

| 本地 truth | snapshot/projection/ref | 一致性与失败口径 | forbidden body/write |
|---|---|---|---|
| application record、消费游标、view revision、coverage/gap | materialized safe projection | 一次应用结果、幂等结论、cursor/coverage 与 revision 原子；缺口后不能伪造连续 cursor | bus ack/delivery/retry/DLQ、全局事务序号 |

回填：本单元结构化结论进入本 Step 对应正式章节。
单元自检：来源、边界、一致性与非职责已核对；未新增外部合同或提前下沉 schema。
单元门禁 U3：思考 done / 写入 done / 自检 done / pass；停审后允许下一单元。


### U4 单元校准

问题：truth 与派生如何区分？本地仅拥有 ReadCursor、pin/mute、preference、last-opened、focus 与局部版本，外部/派生为 InboxItem 与 unread 派生。
诊断：若所有内容都称 local state，会把 conversation read receipt、业务完成/优先级、通知决策 混入本仓。
取舍：采用分层所有权与以下一致性规则；不采用共享表、跨域事务或复制正文。

| 本地 truth | snapshot/projection/ref | 一致性与失败口径 | forbidden body/write |
|---|---|---|---|
| ReadCursor、pin/mute、preference、last-opened、focus 与局部版本 | InboxItem 与 unread 派生 | 局部动作原子；source duplicate 不新增 Inbox/unread；重建不重置局部动作 | conversation read receipt、业务完成/优先级、通知决策 |

回填：本单元结构化结论进入本 Step 对应正式章节。
单元自检：来源、边界、一致性与非职责已核对；未新增外部合同或提前下沉 schema。
单元门禁 U4：思考 done / 写入 done / 自检 done / pass；停审后允许下一单元。


### U5 单元校准

问题：truth 与派生如何区分？本地仅拥有 attempt、generation、候选与 current 关系、失效/切换记录，外部/派生为 owner baseline 接受结果。
诊断：若所有内容都称 local state，会把 archive snapshot/package、source repair、执行恢复 混入本仓。
取舍：采用分层所有权与以下一致性规则；不采用共享表、跨域事务或复制正文。

| 本地 truth | snapshot/projection/ref | 一致性与失败口径 | forbidden body/write |
|---|---|---|---|
| attempt、generation、候选与 current 关系、失效/切换记录 | owner baseline 接受结果 | 候选隔离；可衔接 baseline/event 且 coverage 足够才原子切换；失败保留旧安全视图或 blocked | archive snapshot/package、source repair、执行恢复 |

回填：本单元结构化结论进入本 Step 对应正式章节。
单元自检：来源、边界、一致性与非职责已核对；未新增外部合同或提前下沉 schema。
单元门禁 U5：思考 done / 写入 done / 自检 done / pass；停审后允许下一单元。

### U6 单元校准

问题：truth 与派生如何区分？本地仅拥有 无查询写入 truth；仅读取结果的版本语境，外部/派生为 组合的 Personal/Project view 及引用集合。
诊断：若所有内容都称 local state，会把 SDK/client cache、sync cursor、archive acceptance 混入本仓。
取舍：采用分层所有权与以下一致性规则；不采用共享表、跨域事务或复制正文。

| 本地 truth | snapshot/projection/ref | 一致性与失败口径 | forbidden body/write |
|---|---|---|---|
| 无查询写入 truth；仅读取结果的版本语境 | 组合的 Personal/Project view 及引用集合 | 固定 generation/revision/局部 overlay 语境；无法稳定跨页则显式失效重取；权限每次仍校验 | SDK/client cache、sync cursor、archive acceptance |

回填：本单元结构化结论进入本 Step 对应正式章节。
单元自检：来源、边界、一致性与非职责已核对；未新增外部合同或提前下沉 schema。
单元门禁 U6：思考 done / 写入 done / 自检 done / pass；停审后允许下一单元。

### 7.7 数据所有权总表

| 数据项 | 数据类型 | 归属说明 | 边界说明 |
|---|---|---|---|
| WorkspacePartition / scope binding | 局部真相 | U1 | 不创建身份/项目/membership。 |
| source checking / safety invalidation record | 局部维护状态 | U2 | 记录本地检查/失效，不把调用失败写成 owner 删除。 |
| SourceApplicationRecord / applied cursor / view revision / coverage / gap | 局部维护真相 | U3 | “已应用”归本仓；原事件顺序和水位 authority 归 owner。 |
| pin/mute/preference/ReadCursor/last-opened/focus | 局部真相 | U4 | 必须由显式局部动作变化，不能反写 source。 |
| generation / rebuild attempt / invalidation / cutover | 局部维护真相 | U5 | 不拥有 archive 恢复或 source repair。 |
| safe summary、Inbox、unread、跨域 read model | 快照/投影 | U2/U3/U4/U6 | 可重建，不能修正 owner 事实。 |
| source ref/version/watermark、visibility decision/ref | 引用/安全语境快照 | owner；本地保存消费绑定 | 决定的权威、适用范围和有效期不由 workspace 发明。 |
| L1 正文、policy body、runtime/tool body、secret、sandbox/live seed、archive package、SDK/UI state | 禁止保存的正文/外部状态 | 外部 owner | 不进入存储、幂等材料、日志、导出或诊断。 |

缺失的 partition/projection 与经过完整读取证明的空集合不同：前者只能返回安全的 missing/unavailable/blocked 姿态，不由 query 初始化分区；后者才可在明确 coverage 下表达 empty。被权限裁剪的不存在性和条目数不得暴露。

### 7.8 版本与游标角色

| 类别 | 主语 / authority | 不可替代 |
|---|---|---|
| source version | owner 对象变化顺序 | 不同源之间不可直接比较 |
| source watermark | owner 对来源覆盖的证明 | 不能由 received_at 或 bus offset 推断 |
| source cursor | workspace 某来源序列已应用位置 | 不等于 delivery ack 或用户已读 |
| view revision | 同一 workspace 分区已提交投影结果 | 不代表全部 owner 同时最新 |
| generation | 同一分区的重建世代 | 不替代 source version 或局部注意力版本 |
| local-state revision / ReadCursor | 用户局部动作版本 / 注意力位置 | 不替代 conversation receipt |
| page cursor | 同一查询条件下的继续读取语境 | 不作为授权凭证、source offset 或 archive cursor |

page cursor 需绑定 principal、scope、过滤/排序和稳定视图语境；不可仅以 offset 或字符串推断范围。缺少绑定、视图不再可服务或权限变化时显式要求重新读取，不静默切换世代或跨用户复用。最终 schema 留给 02/03，当前没有公开 DTO 承诺。

幂等判断必须有来源、分区与世代语境，不能只凭不同 owner 可能重用的裸事件 ID 去重。来源 cursor 的比较规则由该来源正式合同决定；未保证连续整数时不得用序号加一自行认定缺口。版本缺失、cursor 已失效或不兼容时挂起对应来源，不以时间戳或接收顺序补齐。

### 7.9 一致性策略

| 数据关系 / 场景 | 关联数据类型 | 一致性口径 | 失败处理口径 | 说明 |
|---|---|---|---|---|
| 输入应用与本地可见结果 | application/projection/cursor/revision | 分区内强一致 | 全部提交或全部不推进 | 单独写 cursor 会造成不可恢复跳过。 |
| 重复输入 | application identity | 幂等 | 同 key 同内容返回既有结果，不新增 Inbox/unread | 同 key 不同内容 conflict/quarantine。 |
| 迟到/乱序 | source version/cursor/gap | owner 顺序约束 | 已证明过时可忽略；未知顺序保留 gap/conflict | 不按时间戳猜顺序或倒退游标。 |
| 来源缺口 | coverage/cursor | 连续性约束 | 保留最后可证明位置；显式 stale/partial/blocked | 禁止静默跨过缺失输入。 |
| 提交结果未知 | local application/operation result | 本地判定优先 | 先查询提交记录；不可证明则停写，不盲重放副作用 | 不以 timeout 当 rollback。 |
| owner 事实到 read model | source/projection | 最终一致 | 返回来源版本集合与降级 | 不承诺跨域强事务。 |
| local change | attention/local revision | 本地强一致 | 同 principal/scope 下版本冲突可判别 | read query 不创建 local change。 |
| unread 重算 | Inbox/read intent | 派生一致 | 重复不累加，无法映射旧 read intent 不猜“已读” | 不创建 source receipt。 |
| baseline 到事件接续 | baseline/cursor/generation | 来源闭合 + 原子切换 | 无正式衔接点则候选 blocked | bus preparation 不证明 replay 可执行。 |
| generation cutover | candidate/current/application state | 分区内强一致 | 并发版本变化时拒绝切换或重做核对 | 不混世代条目/游标/coverage。 |
| local state 与 rebuild | 用户局部事实/派生状态 | 独立保护 | 保留用户动作；按稳定引用关联，不覆盖为默认值 | 新世代不是新用户状态。 |
| visibility 与输出 | 决定引用/内容/元信息 | 安全约束一致 | 不可验证即 fail-closed | 不能以“最终一致”宽限授权。 |

### 7.10 恢复与失效边界

每个分区的 rebuild truth source 必须是 owning domain 可证明的 baseline/枚举读取及其允许的变化接续；旧 projection、SDK cache、mirror seed 或 archive 包都不是默认 rebuild source。全局 complete 只能指请求明确要求的来源集合全部具备证明，不意味着所有域同一时间快照。

删除/撤销只有正式 owner 输入可确认；网络失败不能自行生成 source tombstone。收到可验证撤销后旧 generation 同样不能继续泄露；重放旧允许事件不能覆盖更新的撤销语境。底层清理和保留期在 04/05 收口，对已知失效的当前查询按安全约束拒绝，不等待物理删除。

可见性保证仅成立于 owner 正式合同定义的有效性/撤销边界；workspace 不承诺在未收到撤销且无 freshness 证明时仍能安全展示。组装期间若不能证明决定仍适用于返回内容/版本，则不返回受影响内容。确切时效和并发屏障仍为 WS-UP-003，不能用本地 TTL 填空。

跨单元审计：外部 truth 无双 owner；本地原子边界不跨仓；U3 与 U5 共享应用不变量而非各自写 current；U4 用户事实不从 owner event 重算；U6 完全 no-write。不画额外数据图：所有权与一致性两张矩阵已完整表达，无新增结构关系。

## 8. 回填草稿

正式 §9 承接 §7 已收束的表、图和结论；图注随图一起回填。不复制 §3~6 的讨论过程。

复杂度判断：六单元校准后分开数据归属、版本角色、一致性与重建来源；不写 DDL 或字段类型。

## 9. 待确认事项

WS-UP-001/002 阻塞逐来源版本比较、baseline 衔接和任意 replay；WS-UP-003 阻塞有效性与撤销证明；WS-UP-004/005 阻塞 attention identity 和 scope 精确合同。架构中的身份、版本和 cursor 是语义类别，不是已发布 schema。

## 10. 进入下一步条件

数据类型与 forbidden write 全覆盖；重复/乱序/缺口/重放/重建/失效均有结果；安全与数据时效分离；局部状态不会被重建覆盖。

写入前检查：模块思考已完成，结构化结论仅整理 §3/6；正式回填草稿无新增协议。
思考记录 = done；写入记录 = done；自检状态 = done；gate_status = pass；gate_reason = 本步架构结论可引用，未闭合外部能力已隔离为 blocker；next_allowed_action = 进入 Step 9。
本 pass 只指设计静态自检，不是测试、集成、证据、用户 signoff 或 readiness。
