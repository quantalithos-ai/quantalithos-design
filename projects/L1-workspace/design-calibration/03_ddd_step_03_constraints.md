# Step 3. 收稳编码规范、语言 / runtime、仓库约束

## 1. Step 状态

- 状态：[x] 本Step校准完成；gate_status=pass；current_part=closed。
- 对应SOP：详细设计讨论流程Step3；回填：详细设计§3/16。
- 开工确认：[Step2](03_ddd_step_02_scope.md)pass；项目ledger与03 flow允许本步。
- 写入前检查：仅本项目设计；语言/目录都是planned，不创建目标仓、Cargo或源码；formal_fill_allowed=false。

### 1.1 Step 内计划

1. 读Step2、01 §7/11、02 §3/12、Rust/目录/提交规范和参考Step3。
2. 先收语言/注释/运行机制和依赖分型取舍，再输出约束表。
3. 记录只读路径与git identity检查；严格区分观察事实、planned选择和blocked来源。
4. 后置历史差异审计，回填后检查注释冲突、Cargo隔离、安全与no-write；通过才进入Step4。

## 2. 本步输入

- [Step2](03_ddd_step_02_scope.md)、[正式01](../01-架构设计.md) §7/8/11、[正式02](../02-概要设计.md) §3/7/12/13。
- `standards/coding/rust.md`：源码语言/rustdoc、命名和格式条款；不把其尚缺的error/trait/async章节当已提供规则。
- `standards/document/子项目目录与代码文件组织规范.md`；详细设计书写规范§4.3/5.3；闭环标准§2.2.2；`projects/README.md` §8.2；实施计划书写规范§4.9的git identity要求。
- `projects/L1-governance/design-calibration/03_ddd_step_03_constraints.md`与正式03 §3作粒度参考，不继承其已确认Core依赖状态。
- 只读检查：目标实现仓路径、Core根/契约crate manifests；设计仓仅读取git user.name/user.email。

## 3. SOP 问题回答

1. 语言/runtime/框架与主要依赖？选择planned Rust 2024、MSRV 1.93；领域计算保持同步无I/O，入口与adapter的异步I/O选择Tokio 1系列。Tokio不是业务runtime truth，也不进入domain。具体补丁版本/feature在Step14及07按依赖闭包锁定，不虚构已安装版本。API先为传输无关library handler，HTTP/gRPC框架暂不进入当前必需依赖；持久化产品须在Step11论证原子契约后选择，未选前无durable实现就绪。序列化/错误derive库依DTO/错误契约再收口，不复制Core全部依赖。
2. Rust规则如何影响结构？统一英文命名与所有权语义、公开类型/字段/variant文档、按rustfmt规范布局。请求、局部状态、外部ref/决定和存储行不混为一个struct；异步、错误、并发细节由后续当前项目Step定义，不声称Rust规范已经规定完整方案。
3. rustdoc要求？crate/module用`//!`，公开struct/字段/enum/每个variant/trait/函数用`///`，含语义、错误和边界；载荷variant说明payload意义。设计正文中文，直接转写Rust的注释英文。详细设计书写规范§4.3的中文注释条款与源码规范冲突，采用明确面向源码的英文规则；不能静默混用。
4. 提交和git config需读吗？必须读`projects/README.md` §8.2及实施计划书写规范的git identity；实现仓英文提交，设计仓中文主题/body、英文type、Codex footer。期望user.name为quantalithos-labs、user.email为quantalithos.ai@gmail.com。本轮只读检查设计仓值一致，不修改config，也不代表未来实现仓已配置。
5. 安全/网关哪些不做？不认证账号/签发token/裁决权限/实现全域网关，不拥有任何L1业务正文或执行truth。外层可信入口上下文也不能替代逐scope/source现时可见性核验。日志不能绕开ref/count/provenance裁剪。
6. 依赖已实现仓吗？业务上依赖owner正式查询和事件；编译上只有Core候选，现有设计未核验workspace所需exact类型导出；不能把兄弟实现仓存在当成功集成。
7. 已确认编译依赖有哪些？截至本步没有新增已启用sibling编译依赖。L0-core是唯一允许继续核验的候选，不从runtime/event/ref关系导入L1/bus/SDK crate。
8. 本地仓存在吗？目标quantalithos-workspace未发现；quantalithos-core存在，crates/contracts manifest声明package core-contracts、lib core_contracts。这里只核对唯一compile候选的位置，未扫描或使用其他runtime兄弟源码作为依赖。
9. path与中期方案？Core候选经正式schema/实现定义/export/使用范围关闭后，才可在目标根Cargo的workspace.dependencies声明相邻真实crate路径，member通过workspace继承。中期可用私有git固定tag/rev，实际值待07，不默认公开crates.io发布。
10. 哪些只能runtime/event？bus、六L1 owner、SDK/product/sync/archive；L2相邻项目只作文档参考。adapter只隔离访问，fake只验证本地合同，都不能升级为compile依赖或授权来源。

## 4. 当前文档问题诊断

| 位置 | 冲突 / 缺口 | 本步处理 |
|---|---|---|
| 02 §2.3/12 | 语言尚未选定 | 按规范和参考生态选择Rust2024，MSRV planned 1.93 |
| 01 §7.3 | 三逻辑角色允许同进程 | runtime选择不强制三独立部署，资源/停机/写栅栏不弱化 |
| 详细书写§4.3 vs Rust源码语言条款 | 中文/英文注释冲突 | 设计中文，源码及可转写代码块英文；记录偏差 |
| Rust命名表 vs 专门目录规范 | crate/package笼统snake_case建议 | package用workspace-<role>，Rust crate用workspace_<role>，遵循专门规范 |
| governance Step3 Core判断 | 参考仓已确认不等本仓已确认 | 保持WS-UP-007候选，禁止直接落依赖声明 |
| 目标仓缺失 | 无实际Cargo/运行环境 | 标本地实施前置pending，不冒充上游blocker或已建仓 |

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 代码语言/运行机制 | 概要留待03 | planned Rust2024/1.93，异步边界Tokio，domain同步 | 支持typed contract与运行隔离 |
| 注释语言 | 规范冲突未在本仓处理 | 中文设计+英文源码/rustdoc | 可直接转写且遵守源码标准 |
| path判断 | compile候选 | 真实路径已观察、符号未核验、依赖未启用 | 位置不等于契约闭合 |
| 具体HTTP/DB产品 | 尚未确定 | 传输无关API library；durable driver前置阻塞明确 | 不在目录中列未定路由/数据库占位 |

## 6. 设计取舍

| 方案 | 优点 | 代价 | 结论 |
|---|---|---|---|
| Rust2024 + 同步domain + 异步边界Tokio | typed边界与生态一致，领域逻辑不绑定executor | 后续必须明确Send/Sync/cancel/timeout和阻塞I/O隔离 | 采用planned |
| 整仓同步阻塞网络/存储调用 | 简单 | 查询扇出与消费/恢复容易相互占用，需额外线程机制 | 不作为默认 |
| 现在锁Web框架与DB并铺routes/migrations | 目录看似完整 | 传输/事务尚未到对应Step，伪造产品约束 | 不采用；Step8/11/14闭口 |
| Core路径可读即声明所有crate依赖 | 省略符号核验 | WS-UP-007被掩盖 | 不采用 |

## 7. 结构化中间产物

### 7.1 编码规范承接

| 规范来源 | 必须遵守的内容 | 对实现形态的影响 |
|---|---|---|
| Rust源码语言/rustdoc | 英文标识符/普通注释/rustdoc/测试名；公开variant逐项文档 | 设计中文，代码注释英文；公开字段说明来源/边界 |
| Rust命名/格式 | 类型UpperCamelCase、函数/module/file snake_case、rustfmt | 02的用例名保持索引名，方法名按Rust命名；不为getter机械加get_ |
| 专门目录规范 | 仓slug与role目录、package/crate分开 | project slug=workspace，目录不带L1或重复项目前缀 |
| 详细书写规范/闭环标准 | 实现前类型/port/DTO/flow/状态必须来源闭合 | 不让任意String/JSON/Opaque成功体藏pending |
| projects/README §8.2、实施计划规范git条款 | 设计中文提交、实现英文提交，指定git identity与Codex footer | 开工前只读复核；本轮不写config、不commit |

### 7.2 实现约束表

| 约束 | 选择 / 状态 | 影响的主体 |
|---|---|---|
| 语言/toolchain | Rust edition2024、rust-version 1.93 planned；不是已安装或编译通过证明 | 所有目标crate |
| executor | Tokio 1系列只在运行入口/infra；精确版本/feature后续闭口 | API宿主/worker/jobs/adapter，domain不依赖 |
| domain运行模型 | 同步局部计算、typed输入，无网络/DB/bus/运行任务调度 | CP1~7领域值/状态与派生 |
| 异步应用边界 | 应用可定义异步I/O port但不import具体Tokio/HTTP/DB；取消不等rollback | Step7/9/11/13需闭合future/事务/unknown |
| 运行角色 | 同步入口、事件消费、显式恢复逻辑隔离；允许同部署/同进程 | 不强制微服务，预算隔离与受控停机必须保留 |
| API框架 | 当前只固定传输无关library handler，不选HTTP/gRPC路由 | Step4不列routes占位；新增host需Step8/14回查布局 |
| 持久化 | 一个分区原子边界；query只拿read capability；driver未选择 | Step11必须证明事务/索引/冲突/unknown及durable语义，未闭口不实现 |
| 安全 | resolver-first、现时决定、全输出裁剪、不可证明即fail-closed | Query/source/cutover和诊断；stale不是授权豁免 |
| 查询 | 不建分区/保存快照/标已读/更新last-opened/调度恢复 | 所有Query、source query、export |
| 版本与恢复 | 不可比较cursor不猜序；application终局与projection同原子；candidate不能覆盖local intent | CP3/4/5/6/7 |
| 外部绑定 | 来源schema、scope、visibility、baseline未闭合即拒绝受影响正向路径 | infra/source/bus/recovery绑定 |
| third-party选择上限 | 只确认Tokio主系列和语言；DTO序列化/错误derive/driver/精确pin需后续契约 | Step8/11/12/14及07，禁止在本轮宣称完整dependency lock |

### 7.3 本地多仓与编译候选检查

观察日期2026-09-07；本地检查只读，不对应commit/tag/test baseline。

| 对象 | 全局类型 | 本地默认路径 / 观察 | 当前引用方式 | 中期方式 | 影响单元 |
|---|---|---|---|---|---|
| 目标workspace仓 | 本项目实现目标 | /home/aris/Projects/quantalithos-workspace：目录未发现 | 无Cargo、无源码 | 07开工门禁核对后由获准实施建立 | 全部planned |
| Core contracts | compile候选，尚未启用 | /home/aris/Projects/quantalithos-core/crates/contracts：存在 | 只观察package=core-contracts、lib=core_contracts；WS-UP-007未闭合 | 契约核验后本地path，后续可private git固定tag/rev | 首先contracts，其他单元按Step5最小必要性核对 |

Core根manifest当前edition2024、rust-version1.93、resolver2；本项目只借鉴语言兼容线索，不复制其resolver、license、版本或依赖全集。路径存在不能证明ActorContext等02语义槽位可import；本步未完成符号定义/export/版本闭环，因此**已启用sibling path依赖集合为空**。未启用前不输出可直接抄入Cargo的依赖声明。

runtime/event/ref关系与fake不进入上表的可启用path清单；具体项目分类见Step1 §7.3。不得读取owner DB代替查询，不能引入SDK cache作为恢复源。

### 7.4 提交与执行事实

| 检查 | 实际观察 | 不代表 |
|---|---|---|
| 设计仓git user.name | quantalithos-labs | 目标实现仓已配置 |
| 设计仓git user.email | quantalithos.ai@gmail.com | 授权修改git config或提交 |
| Rust/toolchain/driver | 未运行cargo/rustc/项目测试 | 构建、依赖下载、集成通过 |
| Core manifests | 只读实际文件 | 共享symbol已可用或commit baseline已冻结 |

复杂度判断：本步是全仓约束小循环，规范/运行/依赖/事实四表足够；逐port异步签名和事务实现留各自Step，不先写对象契约。

## 8. 回填草稿

### 8.1 后置差异审计

| 材料 | 对照结果 | 处置 |
|---|---|---|
| draft/02 §4 NG-WS-010 | 不在draft锁框架/DB/Rust版本 | 此次按正式Step3独立确定语言/运行机制；不把draft当实现约束 |
| README“上下文层” | 易扩成runtime context | 仅workspace视图与局部focus，不引入execution/context owner |
| governance Step3、artifact正式03 §3 | 多crate/Rust/英文源码与本项目相容 | 参考表达粒度；Core已确认、outbox/handoff和具体依赖不继承 |
| 详细书写布局示例 | 示例中重复项目前缀目录与专门目录规则不同 | 用crates/<role>，不照抄旧示例 |

### 8.2 详细设计§3草稿

目标实现采用planned Rust2024/MSRV1.93；领域模型同步且不依赖I/O executor，异步运行边界使用Tokio 1系列，精确pin与feature须后续设计闭口。API为传输无关handler library，存储driver需先满足分区原子性和unknown结果读回；不得凭目录规划宣称durable adapter完成。

源码及可转写Rust代码块的标识符/注释/rustdoc/错误说明/测试名采用英文，设计正文中文；公开struct/字段/enum/variant/trait/函数文档要求按§7.1执行。命名、运行与安全约束使用§7.2；本地依赖与事实边界使用§7.3/7.4。Core仍compile候选，其他owner/bus/SDK只能通过已裁剪外部接缝协作。实施前必须复核项目git identity与提交规范，本轮不提交。

## 9. 待确认事项

外部WS-UP全部保留；Rust工具链/第三方版本与feature尚未实测；传输框架和存储driver为后续详细设计决策，不能遗留给实现者自由补设。

## 10. 进入下一步条件

语言/runtime职责、命名/注释/提交、路径观察/依赖候选与真实事实边界均完成；no-write、安全owner、局部原子和部署约束与00~02一致。未定driver/framework不进入当前必建具体产品文件，后续必须回查布局，不能视为已选。

结构化/历史审计/回填/静态自检done。gate_status=pass；next_allowed_action=create_03_step4；formal_fill_allowed=false。通过的是本步约束深度，不是完整实现环境或外部合同就绪。
