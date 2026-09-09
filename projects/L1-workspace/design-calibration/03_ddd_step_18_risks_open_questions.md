# Step 18. 风险与待确认事项

> SOP Step18；书写规范§5.17；回填正式03 §17。唯一执行agent；不进行owning项目写入。

## 1. Step 状态

completed / pass_with_external_slots。Step17补审完成后恢复本步，已撤销初稿的过早完成结论并逐项补审；此处通过仅表示风险登记完整，不代表外部合同或实现通过。

## 2. 本步输入

项目台账、03 flow、正式00/01/02、03 Step1~17及Step6三附录；详细设计SOP Step18/书写规范§5.17；全局依赖规则§4.1；01 Step14 §7.4的owning回流登记。使用前序已登记上游正式文档/flow及最近member/member-images缺口复核，不声称重新逐行阅读全部14项目00~07。

## 3. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 哪些问题影响代码实现？ | 九项WS-UP涉及exact外部输入；三项WS-LOCAL涉及durable提交、配置绑定和密码学实现。范围分别列于§7.2/7.3。 |
| 哪些阻塞，哪些仅优化？ | 权限、scope、外部schema、事务终局、配置与secret均是受影响路径的硬门禁，不是优化；性能调优和保留期扩展可以后续讨论，但不能突破当前有界限额/不GC约束。 |
| 谁确认？ | owning domain关闭其truth；本项目后续04~07关闭本地设计；实施期真实driver/测试确认运行事实。 |
| 未确认怎么处理？ | 只允许明确blocked/unavailable/未知结果；不可用String/JSON/fake allow/默认Bound冒充闭合。 |

## 4. 当前文档问题诊断

初稿把006与006-S、007与008合并，未区分外部authority和本地工程风险，无法判断哪条路径可继续；driver终局证明只有泛化一行。现在独立登记每项、读取入口、关闭证明与禁止行为。Step17字段复核中的缩写已改回Step6-B正式字段名，SourceSlice不再误列coverage字段。

## 5. 改动前后对比

| 初稿 | 补审后 |
|---|---|
| 八行混合风险，四段中间产物 | 十段结构，独立风险/待确认/本地前置/关闭流程 |
| “可落码”与“等待上游”混用 | 本地确定合同可被后续设计承接；涉及开放slot的正向实现明确blocked |
| 未区分回流和登记 | 仅登记待回流；未修改owning flow/ledger、未通知、未获owner确认 |
| 完成标记早于审计 | Step17通过后补审，Step19和正式03必须另行装配审计 |

## 6. 设计取舍

不通过删去缺口获得“完整实现就绪”；也不把外部缺口升级为workspace新职责。详细设计可完成已授权局部合同和失败姿态，正向接入须按影响范围关门。参考governance的风险、实施前置和closure granularity，裁剪其业务truth、publisher、archive handoff。

## 7. 结构化中间产物

### 7.1 风险表

| 风险 | 影响 | 缓解方式 | 负责人 / 待确认方 |
|---|---|---|---|
| 来源覆盖与现时权限混同 | 泄露内容、条目存在性或隐藏计数 | scope可公开先行；每次读消费owner现时决定；stale/partial不越权 | 各L1 owner；WS-UP-001/003/005 |
| source cursor、delivery和local revision混用 | 错误去重、吞缺口、错误fresh | 独立typed轴；Ksrc同事务；Gap不落terminal source record | owner+L0-bus；002 |
| attention被投影/局部意图反造 | Inbox或业务完成truth污染 | 明示attention输入；read_cursors按stream；无关系Unknown | owning attention；004 |
| unknown commit被当rollback | 双写、错误恢复、结果不一致 | authoritative resolve；缺行/超时/进程死仅Pending | 本地durable adapter；LOCAL-001 |
| cutover与撤权竞争 | 安全失效候选被提升 | partition串行化、invalidation栅栏、现时owner proof；SafetyBlocked不复活 | application/infra+owner；003/LOCAL-001 |
| token/日志形成旁路泄露 | scope/身份/页位置暴露、可重放泄露 | AEAD全绑定、现时授权、固定类别日志；不得记录业务ID/secret | 本地04/05；LOCAL-002/003 |
| 下游反向定义或执行身份扩张 | workspace吞SDK/cache/archive/runtime/seed | export只读、下游接缝pending；workspace→archive串行 | 下游owners/架构；006/006-S/008 |
| 共享schema和fake成功被伪确认 | 编译/联调无法还原 | Core exact subset≠专用schema闭合；外部typed slot拒绝占位成功 | L0-core/各owner；007及001~005 |
| 初稿进度与正式门禁不一致 | 跳步、读者误以为已完成03/实现 | 保留偏差记录、顺序补审、正式文件真实存在且静态审计后停审 | 本项目设计；Step19 |
| 无限快照/事务/保留增长 | 内存/锁竞争、恢复不可完成 | 有界limits，超限不截断为Complete；当前不做TTL/GC；容量不足停止受影响操作 | 本项目04/05/07；LOCAL-001/002 |

### 7.2 上游待确认事项（全部open）

| ID / 事项 | 当前影响 / 阻塞范围 | 需要谁确认 / 正式读取入口 | 关闭所需证明 | 未确认前处理 |
|---|---|---|---|---|
| WS-UP-001 safe query/summary/version/coverage | SourceRead、safe DTO、source apply、fresh与baseline正向读取 | identity/conversation/work/process/governance/artifact当前正式02/03及flow | 每来源精确schema、typed摘要/ref、版本比较、水位/coverage、no-write和安全读取错误 | 对应Source/Owner slot blocked；不截断完整性、不拷正文 |
| WS-UP-002 event/cursor/baseline/replay | 两consumer与recovery接续 | 各来源正式03事件/游标；L0-bus正式06 AC-FUNC-005、07 PH-06及flow | 事件身份/顺序/重复/缺口、baseline切点和接续范围、真实可用replay能力边界 | Gap/Unknown/blocked；bus preparation不能作为executor或ACK证明 |
| WS-UP-003 visibility/validity/revocation | 所有包含受保护内容、ref或元信息的响应与切换 | 各owning domain正式查询/决定及flow | principal/scope/subject绑定、有效性、撤销、读取与提交时适用性证明 | fail-closed；不设workspace authorization truth，不默认governance统一授权 |
| WS-UP-004 attention identity/lifecycle/read relation | Inbox、read分类、本地意图验证 | conversation/work/process等实际attention owner正式03及flow | 明示输入、稳定identity、生命周期、跨generation身份与同stream读关系 | 不生成业务attention；无relation读分类Unknown；不做跨stream比较 |
| WS-UP-005 Personal/Project refs | scope解析、partition provision及各入口主体范围 | identity与work正式02/03及flow | GlobalMember/Project/ProjectMember safe ref/query及membership/scope有效性 | resolver blocked；不从projection/string猜scope或执行主语 |
| WS-UP-006 read/export消费者 | SDK/product/sync/archive正式接入与归档承诺 | L0-sdk正式访问边界；全局§4.1；后续消费者自己的正式文档 | 读取/分页/版本/可见性消费合同；archive自行定义其truth与接收 | Export仅workspace read response；不定义归档包/accepted/export artifact |
| WS-UP-006-S static workspace seed | member-images静态输入 | member-images正式02/03 MI-UP-006及project ledger | seed/template owner正式裁决与live view隔离 | owner-neutral；不得默认live workspace提供镜像seed |
| WS-UP-007 workspace专用Core schema | 外部共享类型/错误/事件公开面落码 | L0-core正式00/02/03及现有flow、actual契约exports | 是否纳入Core、exact符号/版本/导出、职责和兼容性裁决 | 仅Actor/metadata已核验子集可引用；不复制schema，不新发workspace事件 |
| WS-UP-008 personal execution subject | 无项目执行入口/宿主扩展 | member 03 L2M-UP-008及ledger；member-service正式00/01及ledger | execution owning authority正式主语与范围定义 | 仅Personal视图；不产生第三执行主语，不接入runtime执行 |

逐来源关闭，不能一次“owner已完成00~07”便关闭整项。没有exact query/事件证明的来源仍blocked。WS-UP-006/006-S/008是范围/下游门禁，不应误作本地只读模型无条件启动依赖。

### 7.3 本地待确认与后续前置

| ID / 事项 | 当前影响 | 需要谁确认 / 关闭材料 | 未确认前处理 |
|---|---|---|---|
| WS-LOCAL-001 durable driver终局与快照隔离 | commit/resolve、partition串行化、原子cutover、重启恢复、MVCC快照 | 04选driver/隔离/重启策略；05/06定义用例/判据；实施期真实终局证明与并发故障验证 | 不宣称driver可用；resolve缺行仍Pending；无终局不可换key自动重做 |
| WS-LOCAL-002 配置与外部绑定全量schema | limits数值、端点、transport、driver、secret装载和停机 | 04正式schema、来源/优先级、校验、必填值和capability-specific绑定；05负例 | Step14仅typed消费合同，无默认值和可配置Bound；缺required slot拒绝相应分支 |
| WS-LOCAL-003 crypto/UUID/CSPRNG与依赖pins | token codec、nonce唯一性、ID碰撞、兼容性/编译 | 04绑定；后续依赖选择、MSRV1.93/feature验证、加解密与随机性设计复核和测试 | 算法合同不等实现；不采用自制密码学、固定nonce或伪随机fixture作生产证明 |
| 后续正式04~07 | 量化配置、测试方案、验收标准与可执行boundary移交 | 每份文档按SOP并逐文档停审；07整体闭环审计和全部planned skeleton | 当前不创建后续文档/implementation ledger；不编造AC/EV/PH/commit或基线 |
| 实施环境与真实运行 | 实现仓、依赖、工具链、driver与集成证明均未建立 | 用户另行授权实施，按届时07逐boundary执行 | 77文件仅计划；不伪造run_id、artifact、report、verdict、signoff、readiness |

### 7.4 关闭与待回流规则

1. 待回流目标以[01 Step14 §7.4](01_arch_step_14_risks_open_questions.md#74-owning-项目待回流登记未执行外部写入)登记为准；当前权限只允许本项目，不执行跨项目回写。
2. owner正式变更后读取其正文和flow/ledger，记录exact章节/符号/版本与影响范围；仅关闭有证明的子范围。
3. 在本项目重新校准Step6 typed slot、Step7 adapter、Step8协议、Step9 flow、Step10状态和Step11事务，联动04~07；只改风险状态不足以闭合。
4. schema、DTO、权限、游标或事务出现本地冲突必须先回源修正，正式装配不能用“更晚章节优先”掩盖。
5. 本步未新增owning blocker、未关闭已有九项；三个WS-LOCAL为前序技术前置的明确登记，不是新的上游职责。

## 8. 回填草稿

正式§17分别呈现风险表、九项上游待确认、本地三项与后续前置；保留阻塞范围、确认方和未确认姿态。正式03可供后续设计和实现审查读取，不等于所有14正向入口均已具备真实可落码外部合同。

## 9. 待确认事项

§7.2/7.3全部保留。未产生真实测试、实现、提交、证据或owner确认；未推进L4-archive或产品窗口。

## 10. 进入下一步条件

风险与待确认分列、每项有owner/范围/关闭证明/保守姿态、与Step17/台账一致。静态复核通过，允许进入Step19创建真实正式03并逐章审计；Step19未完成前不得标03 formal_stop_review。
