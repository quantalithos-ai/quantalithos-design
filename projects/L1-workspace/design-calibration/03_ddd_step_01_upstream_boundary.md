# Step 1. 确认概要设计输入边界

## 1. Step 状态

- 状态：[x] 本Step校准完成；gate_status=pass；current_part=closed。
- 对应SOP：`standards/document/详细设计讨论流程_SOP.md` Step1；回填：详细设计§1/17。
- 输入门禁：正式02停审、用户最新授权至Step4；项目ledger与03 flow已同步。
- 写入前检查：只写本项目校准产物；formal_fill_allowed=false；不进入实现。

### 1.1 Step 内计划

1. 读取当前00/01/02及02 Step12/14、flow、项目ledger和03规范。
2. 回答五项问题，诊断概要槽位与具体实现合同的差别，选择承接策略。
3. 形成关系/依赖/缺口表，再查README/draft历史污染。
4. 回填§1草稿，完成owner/一致性/可落码上限自检；通过后才创建Step2。

## 2. 本步输入

- [正式00](../00-需求文档.md) §2/7~16、[正式01](../01-架构设计.md) §4/6~13/15。
- [正式02](../02-概要设计.md) §1~13；[02承接Step12](02_hld_step_12_detailed_design_handoff.md)、[02停审Step14](02_hld_step_14_formal_document_assembly.md)。
- [03 flow](03_ddd_calibration_flow.md) §3逐项目专题阅读登记；上游权威限正式设计，参考项目校准材料只用于粒度。
- 通则§1.5/1.6、中间产物规范§3.4~3.6/4、闭环标准§2.1.1/2.2.2/2.7.1、全局规则§4.1/5。

## 3. SOP 问题回答

1. 直接承接哪些概要结论？承接七CP与正交技术层、16对象、14入口及独立处理流、状态主语和异常/配置影响；02 §12逐项作为详细展开清单。
2. 代码主体框架稳定吗？稳定。CP4/CP5拆开派生与用户意图；CP1/6复用操作记录不迁移业务owner。此步不把七CP直接变crate。
3. 对象/接口/流/状态够不够？足以展开本地契约和安全失败分支；尚不足以编译或接通真实owner。终局应用、恢复终态、generation双轴和纯读语义不能重写。
4. 哪些仍是轮廓？语言/布局在Step3/4确定；字段/工厂/端口/DTO/矩阵/事务等须Step5以后依次完成。OwnerSafeReadResult、ActorContext等语义槽位不是已存在共享schema。
5. 哪些不能重新定义？上游truth/authorization/执行/归档owner、query no-write、scope resolver-first、事件接续证明、局部意图保留和下游串行窗口。缺口应待回流，不以本仓helper填上游事实。

## 4. 当前文档问题诊断

| 位置 | 问题 / 风险 | 处置 |
|---|---|---|
| 02 §6/7的外部语义类型 | 名字容易被误认成Core或owner已导出的Rust类型 | 保留语义需求，列入WS-UP；不预设可import |
| 02 §12 | 明确“设计骨架”但暂无实现单元/文件映射 | 交Step3/4；本步不提前定布局 |
| 02 §9/13 | 开放来源与已定本地状态混读，可能把blocked当空成功 | 将本地设计完成与正向接缝blocked分开 |
| project ledger旧授权 | Step10与本次Step4停点不一致 | 已在ledger/03 flow登记最新停点；旧02停审记录只作历史 |

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 输入资格 | 正式02已停审，03未开工 | 列明可承接结构和受影响阻塞路径 | 不将概要完成当实现完成 |
| 责任范围 | 已有owner红线 | 转成详细设计的不可重定义项 | 防止文件/类型设计扩权 |
| 外部合同 | 语义槽位待定 | 保留各WS-UP及关闭依据 | 禁止Opaque/任意map伪成功 |

## 6. 设计取舍

| 方案 | 收益 | 代价 | 结论 |
|---|---|---|---|
| 承接稳定本地结构，受影响exact合同维持blocked | 可继续局部设计，不虚构上游 | 不能宣称可运行集成 | 采用 |
| 等全部上游实现就绪再讨论目录 | 无未闭合依赖 | 不必要地阻塞本地责任和安全失败设计 | 不采用 |
| 按参考仓复制DTO/Outbox/授权服务 | 表面可快速铺文件 | truth、发布与授权越界 | 不采用 |

## 7. 结构化中间产物

### 7.1 上游关系映射

| 正式来源 | 已收稳输入 | 03继续展开 |
|---|---|---|
| 本项目00 §2/7~16 | Personal/Project只读视图、局部意图、FR/BR/NFR | 模块capability、类型/协议、可验证失败边界 |
| 本项目01 §6/8~13 | 六U、依赖方向、分区原子与跨域最终一致 | crate可见性、read/write port隔离、存储/运行约束 |
| 本项目02 §4/5 | CP1~CP7及跨层主体 | 文件布局与模块职责，不照业务数量拆crate |
| 本项目02 §6 | 16对象，外部槽位与本地owner分开 | 字段来源、工厂、方法、错误；尚无exact外部schema |
| 本项目02 §7/8 | 2 Command / 6 Query / 2 Consumer / 4 Operations | 逐入口协议、函数流、事务切口；CP2/4无额外公开API |
| 本项目02 §9/10 | 应用终局、coverage、局部意图、恢复/世代/响应分轴及28异常 | 转换矩阵、并发/幂等/unknown读回、安全失败 |
| 本项目02 §11/12/13 | 配置影响、后续深度、WS-UP | 配置结构和注入、测试切口、实施交接限制 |
| L0-core正式02/03 | 共享契约authority | 核验schema→实现定义→export→允许依赖，禁止shadow schema |
| L0-bus正式02/03及已登记06/07 | transport与replay preparation | 接入adapter；应用结果不等delivery ack、准备非executor |
| 六L1 owner正式02/03（路径见flow §3） | 各域truth、安全查询/事件/关系由owner供给 | 只读端口与来源绑定，未闭合path拒绝接入 |
| L0-sdk与五L2正式02/03、现有台账 | 客户端/执行/静态资产不属workspace | 消费边界及不进入本仓的主体清单 |

### 7.2 本文不再回答 / 必须回答

不再回答：需求价值、六U/七CP的owner划分、query是否写入、谁定义authorization/业务正文/执行/seed/archive truth；不改变02已确定的状态名或终态。

必须回答：Rust实现布局、模块capability与对象来源、字段/方法/工厂、端口与adapter、14入口协议及独立flow、状态矩阵、事务/并发/幂等、配置与测试切口、真实实施前置门禁。本轮授权只形成其中Step1~4输入/范围/约束/布局，后续未授权内容不提前生成。

### 7.3 依赖裁剪与缺口定位

| 关系 | 本仓角色 | 类型 / 是否主链 | 本步结论 |
|---|---|---|---|
| L0-core | 共享契约依赖方 | compile候选 / 是 | WS-UP-007未核验符号，不写已启用依赖 |
| L0-bus | 事件消费方 | event / 是 | 不编译依赖bus业务crate；WS-UP-002 |
| identity/conversation/work/process/governance/artifact | 安全输入消费方 | runtime/event/ref / 是 | 各owner独立；WS-UP-001~005 |
| SDK/product/sync/archive | read model提供方 | runtime/adapter/ref / 输出边界 | WS-UP-006；archive无反向authority |
| runtime/tools/member/member-service/member-images | 相邻责任参考 | 文档参考 / 否 | WS-UP-008/006-S；排除执行与seed truth |
| fake | 未来测试替身 | fake / 非生产 | 只能验证本地允许/拒绝，不证明上游可用 |

| 缺口 | 受影响本地设计 | 未闭合时姿态 / 关闭依据 |
|---|---|---|
| WS-UP-001 | SourceSlice/coverage/Transient/baseline | 不接受未知安全载荷；逐owner safe query/schema/version证明 |
| WS-UP-002 | 应用记录/consumer/recovery接续 | 不猜游标、不跳缺口；正式event identity/顺序/重放合同 |
| WS-UP-003 | 全部Query、source、cutover | list/空页也需决定；无法证实时fail-closed；正式owning chain |
| WS-UP-004 | InboxItem/ReadCursor | 无明示attention不派生；无稳定映射为Unknown |
| WS-UP-005 | scope/partition/operation lookup | resolver-first，缺关系不从字符串构造；identity/work正式查询 |
| WS-UP-006 | read/export外部消费 | 不承诺SDK/sync/archive协议；下游正式消费约定 |
| WS-UP-007 | contracts共享符号 | 缺schema/定义/export不import不复制；Core正式来源核验 |
| WS-UP-008 | personal执行边界 | 不以view代替执行主语；owning execution authority裁决 |
| WS-UP-006-S | 静态seed/template | live不是seed来源；member-images MI-UP-006 owner裁决 |

复杂度判断：本步是输入边界，不设计逐对象字段；关系/缺口两组表足够，无需模块附录。外部缺口不回写本仓成功结构，实际回流仍待另行授权。

## 8. 回填草稿

### 8.1 后置历史审计（不回填正式正文）

| 历史材料位置 | 旧口径 | 当前判断 | 原因 / 回填影响 |
|---|---|---|---|
| README头部与§三 | 00/01尚未校准，清单无04 | 废弃进度判断 | 当前正式00/01/02及ledger优先；不据此跳04 |
| README§二 | InboxItem visibility属于体验状态 | 限定解释 | local hide不等authorization，当前裁剪消费owner决定 |
| draft/03 §1/2/结尾 | 九职责候选、Outbox/Read Handoff | 后移/裁剪 | 七CP已由02收稳，无outbound family、不建Outbox；不按九候选建crate |
| draft/01 历史事件名 | WorkspaceProjectionUpdated等候选 | 保持非正式 | 不变为本地已授权event schema |

### 8.2 详细设计§1草稿

本文直接承接本项目正式00/01/02。02中的七CP、16对象、14入口与独立处理流及多轴状态构成实现契约展开输入，关系表使用§7.1。本文不重新定义上游truth、授权决定、执行主语或归档事实，不改变query no-write与只读投影边界。

详细设计继续落实模块/文件、类型/方法、协议/flow、状态/一致性及配置/测试切口；语义槽位不得冒充可import的共享类型。依赖分类使用§7.3；WS-UP-001~008/006-S保持开放，未获得来源证明的正向路径不启用。外部阻塞不被本地类型命名、fake成功或布局完成消除。

## 9. 待确认事项

WS-UP-001~008/006-S开放；关闭依赖owning正式合同，不因本Step自动关闭。

## 10. 进入下一步条件

已核对关系映射、七CP/16对象/14入口的承接、依赖分类、owner边界、数据所有权、局部一致性及历史污染；未新增对象、API、状态或上游truth。复杂度无需附录，结构化/历史审计/回填/静态自检均done。

gate_status=pass；next_allowed_action=create_03_step2；formal_fill_allowed=false。此pass仅指本步设计门禁，不是正式03停审或实现就绪。
