# 01 架构 Step 10：关键技术选型

## 1. Step 状态

状态：completed / stop_review；模式：full-restart；对应 SOP：架构 SOP Step 10。
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

模块骨架：not_applicable。未来 Step 不创建。

## 2. 本步输入

Step 2、7~9；书写规范 §4.11；共同输入：正式 00、项目台账、架构 flow 的来源复核表、架构 SOP 对应 Step、书写规范对应章节、中间产物规范和真相源闭环标准。前序产物的未闭合 seam 仍保留。

## 3. SOP 问题回答

1. 必要机制？局部读写分离、物化投影、来源防腐边界、分区内原子提交、版本幂等、候选世代切换、resolver-first 安全裁剪。
2. 解决什么？读无副作用、跨域隔离、恢复无重复/跳过、可解释安全边界。
3. 为什么不用更简单方案？纯实时 fanout 不能保存局部状态或说明恢复进度；全局 event-sourcing 不能以未完整事件流重建业务真相。
4. 代价？投影延迟、维护存储、迁移、cursor 管理和安全检查成本。
5. 暂不引入什么？数据库/transport/调度后端产品、分布式事务、全仓 event sourcing、自动 outbound family、缓存 TTL/硬 SLO；这些没有当前正式条件。

## 4. 当前文档问题诊断

draft/03 的实现分层可作为边界线索，但 01 不确认 Rust struct、crate、存储表或总线后端；上游用 Rust 不等于本轮已选择 workspace 实现包。

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 当前架构主题 | 正式 01 未创建，draft 只作候选 | 由本步输入独立收束后进入 §7 | 阻止历史草稿升级为真相 |
| 外部依赖 | 00 已登记 pending/blocker | 保留 owner 和解锁条件 | 不以架构补外部合同 |

## 6. 设计取舍

| 方案 | 优点 | 代价 | 结论 |
|---|---|---|---|
| 机制级选型 + 可替换边界 | 先保护架构不变量 | 后续需 schema/adapter 设计 | 采用 |
| 复制参考项目完整栈 | 写作省事 | 缺 workload 与本仓论证 | 不采用 |

## 7. 结构化中间产物

### 7.1 关键技术机制

| 技术机制 | 解决的问题 | 采用理由 | 代价 / 约束 | 说明 |
|---|---|---|---|---|
| 局部读写分离 | 查询副作用与业务代写 | 对应 BR-WS-002/011 | 读、local change、维护入口分开 | 不等于全平台 CQRS 改造。 |
| materialized read model + 显式只读聚合 | 各消费者重复跨域拼装 | 稳定结果可复用、可重建 | 需 provenance/coverage，临时聚合不可伪造持久 revision | 对应 U3/U6。 |
| owner adapter / 防腐边界 | 外部 schema 与 truth 泄漏 | 各 owner 独立演进 | exact seam 未闭合时 blocked | 不复制外部领域模型。 |
| 分区内原子提交 | cursor 与 projection 分裂 | 一次应用拥有可查结果 | 状态承载需满足原子与并发控制 | 无跨仓事务。 |
| 版本/幂等保护 | 重复与乱序造成 unread 膨胀 | 本地 application identity 与源版本分层 | 去重窗口不能小于允许 replay 范围而无补充策略 | exact identity/保留期仍待后续闭合。 |
| generation 隔离与原子 cutover | 重建期间混读和回退 | 不覆盖 current 直写新基线 | 候选占资源，切换需覆盖及安全证明 | local attention 独立保留。 |
| resolver-first / fail-closed | 无 scope 的越权读取 | 正式 owner resolution 先于展示 | 权限依赖故障会降低可用性 | 不建立本地 authorization truth。 |
| 独立 local-state overlay | 重建丢失用户动作 | 本地体验不是 source 投影 | revision 与 Inbox 稳定引用需协调 | 不回写对话/任务。 |
| 适配边界替身 | 后续验证本地失败语义 | 可验证幂等、缺口与 no-write | fake 仅覆盖已定义部分 | 不能证明 owner 已就绪。 |

### 7.2 当前不采用

不引入共享 owner 数据库、分布式强事务、以所有域事件为 source-of-truth 的 event sourcing、通用上游命令转发、自动授权 allowlist 或 archive 恢复源。存储产品、索引技术、传输协议、语言版本、调度器及具体部署参数不在本架构锁定，需 02/03/04 在闭合合同和负载约束下判断。

机制选型不代表已有代码、已发布契约或测试可用；core shared type 必须后续检索核验，不能依据名字相似视为同一类型。

## 8. 回填草稿

正式 §11 承接 §7 已收束的表、图和结论；图注随图一起回填。不复制 §3~6 的讨论过程。

复杂度判断：机制表逐项给理由、成本与边界，不拆实现对象；备选路径整体比较在 Step 11。

## 9. 待确认事项

WS-UP-001~008 仍保持 open；exact query/event/ref/visibility/cursor/export 和共享 schema 必须由 owner 关闭，不由本 Step 补全。

## 10. 进入下一步条件

每个机制有需求和单元来源；未新增产品/协议细节；无全局 event-source 或强事务承诺。

写入前检查：模块思考已完成，结构化结论仅整理 §3/6；正式回填草稿无新增协议。
思考记录 = done；写入记录 = done；自检状态 = done；gate_status = pass；gate_reason = 本步架构结论可引用，未闭合外部能力已隔离为 blocker；next_allowed_action = 进入 Step 11。
本 pass 只指设计静态自检，不是测试、集成、证据、用户 signoff 或 readiness。
