# 01 架构 Step 9：关键交互与通信方式

## 1. Step 状态

状态：completed / stop_review；模式：full-restart；对应 SOP：架构 SOP Step 9。
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

Step 4/6/8；SOP Step 9；正式 00 FR-WS-001~010；共同输入：正式 00、项目台账、架构 flow 的来源复核表、架构 SOP 对应 Step、书写规范对应章节、中间产物规范和真相源闭环标准。前序产物的未闭合 seam 仍保留。

## 3. SOP 问题回答

1. 哪些同步？scope/visibility 正式解析、read/export、local change 结果，以及供查询聚合的 owner safe query。
2. 哪些异步？owner 经 bus 的事实变化输入；异步到达不证明授权仍有效或本地已提交。
3. 哪些后台？显式 refresh/rebuild、缺口核对、恢复及受控清理，不能由 query 隐式触发。
4. 哪些必须经正式边界？所有 source、visibility、event 和下游消费，不穿透 owner 表或 bus backend。
5. 依赖失效怎么办？数据、覆盖和安全独立判定；读取只算返回姿态不写维护状态；维护单元可显式记录失败。
6. 跨单元是否有补偿？局部失败只在 workspace 内重试/重建，不发 owner 补偿命令；未知提交结果读取本地结果再处理。
7. direct aggregation 和 materialized query 如何共存？默认读已提交 projection；允许显式只读聚合时不保存输入，声明该响应来源版本，不能为临时结果伪造已提交 revision。

## 4. 当前文档问题诊断

draft/03 §1 图中 source query 后接 projection maintenance 是维护路径，不应被误读为所有查询必写投影；正式 00 的 query no-write 同时涵盖临时跨域读取和稳定 read model。

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 当前架构主题 | 正式 01 未创建，draft 只作候选 | 由本步输入独立收束后进入 §7 | 阻止历史草稿升级为真相 |
| 外部依赖 | 00 已登记 pending/blocker | 保留 owner 和解锁条件 | 不以架构补外部合同 |

## 6. 设计取舍

| 方案 | 优点 | 代价 | 结论 |
|---|---|---|---|
| 同步读/局部变更 + 异步事件 + 显式后台维护 | 与三种写权限匹配 | 调用者需识别各自结果 | 采用 |
| read-through 自动刷新/标记已读 | 体验方便 | 查询引起状态变化 | 拒绝 |
| 业务补偿命令修复不一致 | 可追赶 source | workspace 越权 | 禁止 |

## 7. 结构化中间产物


### U1 单元校准

问题：选什么通信方式？同步正式 scope/visibility resolution，对应 Step 8 的局部/外部一致性边界。
诊断：直接解析 id 或用投影反推权限 会混淆读写或事实确认。
取舍：采用正式边界；不采用上述隐式路径。

| 方式 | 失败/补偿与边界 | 不采用 |
|---|---|---|
| 同步正式 scope/visibility resolution | 查询仅使用返回语境；缺失/冲突拒绝，不默认 scope | 直接解析 id 或用投影反推权限 |

回填：本单元结构化结论进入本 Step 对应正式章节。
单元自检：来源、边界、一致性与非职责已核对；未新增外部合同或提前下沉 schema。
单元门禁 U1：思考 done / 写入 done / 自检 done / pass；停审后允许下一单元。


### U2 单元校准

问题：选什么通信方式？同步 no-write source query；维护场景可后台获取，对应 Step 8 的局部/外部一致性边界。
诊断：所有 source 调用都触发物化 会混淆读写或事实确认。
取舍：采用正式边界；不采用上述隐式路径。

| 方式 | 失败/补偿与边界 | 不采用 |
|---|---|---|
| 同步 no-write source query；维护场景可后台获取 | 临时聚合不落地；维护可接受并应用；超时不等于删除 | 所有 source 调用都触发物化 |

回填：本单元结构化结论进入本 Step 对应正式章节。
单元自检：来源、边界、一致性与非职责已核对；未新增外部合同或提前下沉 schema。
单元门禁 U2：思考 done / 写入 done / 自检 done / pass；停审后允许下一单元。


### U3 单元校准

问题：选什么通信方式？异步 owner 事件经 bus 输入，对应 Step 8 的局部/外部一致性边界。
诊断：bus 已传递就视为 projection 已应用 会混淆读写或事实确认。
取舍：采用正式边界；不采用上述隐式路径。

| 方式 | 失败/补偿与边界 | 不采用 |
|---|---|---|
| 异步 owner 事件经 bus 输入 | 完成本地原子应用后才报告本地结果；反馈含义服从 bus 合同 | bus 已传递就视为 projection 已应用 |

回填：本单元结构化结论进入本 Step 对应正式章节。
单元自检：来源、边界、一致性与非职责已核对；未新增外部合同或提前下沉 schema。
单元门禁 U3：思考 done / 写入 done / 自检 done / pass；停审后允许下一单元。


### U4 单元校准

问题：选什么通信方式？显式同步 local change；attention 经正式输入派生，对应 Step 8 的局部/外部一致性边界。
诊断：上游完成/通知裁决与本地动作合并 会混淆读写或事实确认。
取舍：采用正式边界；不采用上述隐式路径。

| 方式 | 失败/补偿与边界 | 不采用 |
|---|---|---|
| 显式同步 local change；attention 经正式输入派生 | 读列表不标记已读；重复变化不新增未读；不发 source receipt | 上游完成/通知裁决与本地动作合并 |

回填：本单元结构化结论进入本 Step 对应正式章节。
单元自检：来源、边界、一致性与非职责已核对；未新增外部合同或提前下沉 schema。
单元门禁 U4：思考 done / 写入 done / 自检 done / pass；停审后允许下一单元。


### U5 单元校准

问题：选什么通信方式？显式后台 refresh/rebuild/失效与核对，对应 Step 8 的局部/外部一致性边界。
诊断：从读取触发修复或调用上游补偿 会混淆读写或事实确认。
取舍：采用正式边界；不采用上述隐式路径。

| 方式 | 失败/补偿与边界 | 不采用 |
|---|---|---|
| 显式后台 refresh/rebuild/失效与核对 | 候选隔离，切换前核对覆盖、安全及当前版本；失败可保留安全旧视图 | 从读取触发修复或调用上游补偿 |

回填：本单元结构化结论进入本 Step 对应正式章节。
单元自检：来源、边界、一致性与非职责已核对；未新增外部合同或提前下沉 schema。
单元门禁 U5：思考 done / 写入 done / 自检 done / pass；停审后允许下一单元。

### U6 单元校准

问题：选什么通信方式？同步 read/export；分页只读，对应 Step 8 的局部/外部一致性边界。
诊断：下游 ack 回写当前事实或查询推进 page state 会混淆读写或事实确认。
取舍：采用正式边界；不采用上述隐式路径。

| 方式 | 失败/补偿与边界 | 不采用 |
|---|---|---|
| 同步 read/export；分页只读 | 返回来源与维护姿态；对未验证内容和敏感 count/ref 一并裁剪 | 下游 ack 回写当前事实或查询推进 page state |

回填：本单元结构化结论进入本 Step 对应正式章节。
单元自检：来源、边界、一致性与非职责已核对；未新增外部合同或提前下沉 schema。
单元门禁 U6：思考 done / 写入 done / 自检 done / pass；停审后允许下一单元。

### 7.7 关键交互表

| 交互场景 | 推荐通信方式 | 不宜采用的方式 | 失败处理口径 | 说明 |
|---|---|---|---|---|
| scope/visibility 解析 | 同步正式读取 | 从 id/projection 猜授权 | missing/conflict/stale 决定 fail-closed | 各 owning chain 独立成立。 |
| 读取已提交 read model | 同步只读 | read-through 写投影 | stale/partial/blocked 或安全拒绝 | 不标记已读，不自动创建 partition。 |
| 按请求跨域聚合 | 同步 no-write source query | 一边查询一边保存快照/调度任务 | 带每源版本/coverage；不伪造 durable revision | 是否暴露独立模式由后续协议明确。 |
| owner 变化输入 | 异步事件 via bus | 直接订阅内部存储日志 | duplicate/late/conflict/gap 可解释 | 输入不等于应用，不等于授权。 |
| local attention 更新 | 显式同步局部变更 | 以读取副作用改变 local state | conflict/unauthorized；保持原状态 | 不调用源域命令。 |
| refresh/rebuild | 显式后台任务 | query 暗中启动、全量覆盖 current | candidate blocked/failed；安全旧视图可 stale | 缺 baseline/cursor seam 不切换。 |
| 失效与撤销 | 正式信号或显式维护 | 等待下次重建才安全裁剪 | 所有 generation/分页均重新受安全约束 | 不把业务 stale 当权限宽限。 |
| 诊断、trace 读取 | 同步 no-write | 调用诊断自动修复 | 权限缺失不泄露 count/ref/原因细节 | 技术观测不改变业务状态。 |
| downstream read/export | 正式只读交接 | 把消费者接收作为源事实成功 | 未闭合 export 保持 pending | 无 archive accept/freeze 保证。 |
| 本地提交结果未知 | 只读核对结果后显式重试 | 重复无条件 apply | unresolved 时停写 | 不以 timeout 宣告 rollback。 |

### 7.8 数据、覆盖、安全姿态

| 姿态 | 成立条件 | 可返回内容 | 不允许推断 |
|---|---|---|---|
| stale | 已知数据时效不足，且现时授权仍可验证 | 标记版本/来源的安全旧结果 | 不能声称 fresh；不能借 stale 复用失效授权 |
| partial | 请求覆盖集合中部分来源缺失或被安全裁剪 | 仅能证明可见的部分，缺失元信息也要裁剪 | 不把缺域当空集合或完整 count |
| blocked | 请求必需来源/版本/barrier/契约无法满足 | 安全且不泄露的状态和可用范围说明 | 不伪造结果或自动写入修复 |
| fail-closed | scope/permission/决定无效、撤销或不可验证 | 受影响内容、ref、count、provenance 均不暴露 | 不回退 allow；不可暴露隐藏实体是否存在 |
| fresh（有条件） | 针对声明的 source coverage 有足够版本证明且授权有效 | 被证明范围内的结果 | 不意味着六域全局同时最新 |

这些姿态是不同维度，不强压为单一全局状态机。安全拒绝优先于可用性；一页可对允许分区 stale 且 partial，但受拒分区不可因 partial 被回传。查询可以从当前输入计算姿态；持久化失效/失败由显式维护或输入处理承担。

### 7.9 补偿与跨交互审计

仅补偿 workspace 本地应用/维护，不触发上游业务回滚。事件处理失败不等于 bus delivery 失败已确认；投影应用与正式反馈解耦，任何重投仍依赖局部幂等保护。无法确认反馈合同的路径保持 WS-UP-002，不能本地定义 ack 协议。

不画时序图：本 Step 只确定 sync/event/background 选择，具体调用顺序与 DTO 在 03 展开。跨交互审计确认 U1/U2/U6 读路径无写；U3/U5 只改变投影/维护；U4 只改变局部注意力；异步与同步无相互代替的成功语义。

## 8. 回填草稿

正式 §10 承接 §7 已收束的表、图和结论；图注随图一起回填。不复制 §3~6 的讨论过程。

复杂度判断：六单元逐一校准，独立列交互表及姿态矩阵；避免无来源时序和协议名。

## 9. 待确认事项

WS-UP-001~008 仍保持 open；exact query/event/ref/visibility/cursor/export 和共享 schema 必须由 owner 关闭，不由本 Step 补全。

## 10. 进入下一步条件

全部 query no-write；失败/补偿范围不跨 owner；临时聚合没有伪造 durable revision；安全优先且覆盖所有输出元信息。

写入前检查：模块思考已完成，结构化结论仅整理 §3/6；正式回填草稿无新增协议。
思考记录 = done；写入记录 = done；自检状态 = done；gate_status = pass；gate_reason = 本步架构结论可引用，未闭合外部能力已隔离为 blocker；next_allowed_action = 进入 Step 10。
本 pass 只指设计静态自检，不是测试、集成、证据、用户 signoff 或 readiness。
