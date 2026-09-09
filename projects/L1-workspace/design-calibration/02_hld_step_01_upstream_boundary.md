# Step 1. 确认上游输入边界

## 1. Step 状态与计划

- 模式：full-restart / single-agent-serial；输入门禁 pass；思考记录、结构化、回填、自检 done。
- gate_status=pass；gate_reason=本Step静态自检完成；next_allowed_action=由flow串行推进；formal_fill_allowed=step14_only。
- source_files：00/01；上游正式设计与台账；项目台账；02 flow；概要SOP对应Step与概要规范对应章节。
- 写入前检查：本项目/本文档授权有效；无正式正文污染；分批规模不限制最终完整性。

### Step 内计划

1. 已读取三层台账、前序及规范。
2. 问题回答、诊断、取舍见§3~6。
3. 输入关系、依赖分类、未闭合影响独立成表；不拆对象
4. 结构化后后置历史审计；从§7摘录回填。
5. 自检通过后更新flow，不把上游pending改为闭合。

## 2. 本步输入

00/01；上游正式设计与台账；00 FR-WS-001~010/BR-WS-001~012；01 §6/8/9/10/13/15。前步的问题回答、诊断、取舍、待确认均承接，具体依赖见flow §3。

## 3. SOP 问题回答

1. 承接00六能力、FR/BR与局部数据、安全失败要求。2. 承接01 U1~U6、三运行角色、分区原子与owner输入。3. 稳定：owner/no-write/多轴状态/overlay与依赖分类。4. 不稳定：各域safe query、visibility有效性、attention identity、event/baseline接续、Core exact和export，不能写成可执行合同。5. 02回答主体与骨架，不重开ownership、实现栈或量化指标。

## 4. 当前文档问题诊断

磁盘没有02；不能以对话进度替代文件。上游业务query存在不等于workspace scope、coverage与撤销接缝闭合。部分上游无project ledger，以现有flow辅助，不据此推测实现状态。

## 5. 改动前后对比

| 改动前 | 改动后 |
|---|---|
| 尚无本Step正式校准；01只有架构约束 | 本Step将已核验边界转为确认上游输入边界，不补上游schema |

## 6. 设计取舍

采用当前00/01与逐域正式边界；不复制旧draft，不把governance授权推广为六域统一授权。参考项目只提供粒度。

## 7. 结构化中间产物

### 7.1 上游关系映射

| 来源文档 | 承接内容 | 本文继续展开什么 |
|---|---|---|
| 本项目00 §7~16 | 能力、局部数据、FR/BR/NFR | 组成部分、接口、异常与交接 |
| 本项目01 §6~13 | U1~U6、依赖、原子性、只读聚合 | 双轴代码主体、对象/flow/state |
| L0-core正式02/03 | 共享契约authority | Actor/metadata/ref仅核验后复用 |
| L0-bus正式02 §7~9 | delivery与replay preparation | 本地application record不代表ack，恢复不假定executor |
| L0-sdk正式02 §3 | 正式服务客户端消费 | read/export服务面不等于客户端缓存 |
| L1-identity正式02/03；L1-work正式02/03 | GlobalMember与Project/ProjectMember不同owner | Personal/Project scope resolver输入，不解析字符串 |
| L1-conversation正式02 §3；L1-process正式02 §5 | 对话/过程truth及授权查询 | 来源summary/ref和attention，不生成receipt或过程进度truth |
| L1-governance正式02/03；L1-artifact正式02/03 | 治理/制品truth、resolver与对象卡片粒度 | owner决定消费、安全摘要、无正文投影 |
| L2-runtime/tools正式02及项目台账 | execution/tool独立、07停审 | 排除执行状态，不建立运行依赖 |
| L2-member/service/images正式02及项目台账 | 双锚执行、静态seed与live分开 | WS-UP-008/006-S保留，不造第三执行主语 |

### 7.2 本文不再回答 / 必须回答

不再回答：需求价值、owner划分、子域/容器架构和技术机制论证；不定义上游授权、执行、归档真相。
必须回答：主要组成部分如何落实为代码主体；对象有何有类型的字段/行为；API如何分读写；投影应用/失效/恢复/分页如何衔接；哪些结构可交03、哪些正向接缝必须阻塞。

### 7.3 依赖裁剪核对

| 关联项目 | 全局关系 | 本仓角色 | 依赖类型 | 主链 | 裁剪理由 |
|---|---|---|---|---|---|
| L0-core | 共享契约 | 依赖方 | compile候选 | 是 | 专用契约WS-UP-007 |
| L0-bus | 事件主干 | 消费方 | event | 是 | 不定义delivery |
| 六L1 owner | 只读输入 | 消费方 | runtime/event/ref | 是 | 逐域safe contract闭合后开放 |
| SDK/product/sync | 下游访问 | 提供方 | runtime/adapter/ref | 输出边界 | 不依赖client/cache |
| L4-archive | 后续消费者 | 提供方 | runtime/ref | 非当前输入 | 不能反向定义workspace |
| 五L2项目 | 相邻职责 | 参考 | 文档参考 | 否 | 不消费execution/static truth |
| fake | 验证替身 | 后续测试 | fake | 否 | 不证明真实接缝 |

| 依赖类型 | 使用/后续落点 | 禁止替代 |
|---|---|---|
| compile | 03核验Core符号，07查实际路径/基线 | runtime/event不能变path |
| runtime/event/ref | 02 port骨架、03协议和来源、05故障 | 不共享owner数据库或反写 |
| adapter/fake | 机制隔离与负向测试 | 不创造授权或replay证明 |

### 7.4 完成上限

WS-UP-001/002阻塞source safe fields、覆盖/顺序/接续；003/005阻塞可见性与scope正向解析；004阻塞Inbox正向输入；006/006-S阻塞消费者/seed承诺；007阻塞共享schema；008排除执行扩张。
这些是受影响路径blocker，不是本地边界未收稳。正式02完成仍非实现交付许可。

## 8. 回填草稿

正式§1摘录本文件§7的结论表/图；模块附录只摘录已停审结论，不复制讨论过程。详细字段不越过概要粒度。

## 9. 待确认事项

WS-UP-001~008/006-S持续开放；仅允许本地骨架与负向边界收口，受影响正向合同不能交实现。

## 10. 进入下一步条件

已核对14个指定上游专题正式边界与现有台账/flow；未确认能力隔离。映射表未提前展开对象/API，无ownership冲突。
自检仅为文档静态审查，不是测试执行或上游签署。gate_status=pass；允许进入Step 2。
