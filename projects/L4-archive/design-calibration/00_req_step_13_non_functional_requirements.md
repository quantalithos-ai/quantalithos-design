# Step 13. 非功能需求

## 1. Step 状态

- 状态：`[x] 已完成并通过自检`
- 回填位置：正式 `00-需求文档.md` §13
- gate_status：`pass_with_blockers`
- gate_reason：已按性能、可用性、安全、审计/可追溯、幂等/一致性、可观测性六类收敛；无法量化的项给出判断口径，未继承旧文档无来源 SLA/容量数字。
- next_allowed_action：进入 Step 14 验收标准。

### 1.1 Step 内计划

- [x] 读取 Step 7、Step 10、Step 11、Step 12 和需求规范 §4.13。
- [x] 按六类 NFR 回答能力级与全局质量约束。
- [x] 诊断旧 README/00 的无来源耗时、容量、SLA、保留与合规数字。
- [x] 比较“判断口径 + pending 量化”与继承历史数字方案。
- [x] 形成 NFR 表和全局质量约束。
- [x] 完成能力映射、回填草稿、待确认和自检。

## 2. 本步输入

- `design-calibration/00_req_step_07_core_capability_loop.md`
- `design-calibration/00_req_step_10_business_rules_boundaries.md`
- `design-calibration/00_req_step_11_data_ownership.md`
- `design-calibration/00_req_step_12_interfaces_dependencies.md`
- `standards/document/需求文档书写规范.md` §4.13
- 旧 README 与旧 `00-需求文档.md` §7（仅作污染审计）

## 3. SOP 问题回答

1. 性能与可用性的最低判断口径是什么？

   长作业不能静默失去进度；只读查询不得触发上游写入；单一依赖失效不应抹掉已知局部结果，也不能生成全局成功。没有 workload authority 时不承诺分钟级 SLA。

2. 安全和审计/可追溯要求是什么？

   不得越权持有上游正文、密钥、授权裁决或写权；A1~A9 的关键记录必须能追溯到 source/decision/ref/adapter feedback。

3. 幂等/一致性和可观测性要求是什么？

   重复、乱序、冲突、unknown commit 不得产生歧义或重复副作用；必须按 request/slice/item 定位状态、覆盖、失败和补偿要求。

4. 哪些要求能量化？

   当前只有离散判定类别可以明确；吞吐、容量、RTO/RPO、SLA、成本和保留年限缺少 authority，保持 pending，不能继承历史数字。

5. 每项 NFR 如何被验收承接？

   Step 14 分别通过进度/失败可见、fail-closed、来源可追溯、unknown commit 处理和无伪 SLA 等条件承接。

## 4. 当前文档问题诊断

| 历史位置 | 问题 | 影响 |
|---|---|---|
| README/旧 00 | 500 WorkItem/10 Baseline、5/2 分钟、99.9% 等无当前 baseline 数字。 | 产生不可验证承诺。 |
| 旧 00 | 6/6、100%、七年等固定值混合功能、合规和质量。 | 固定集合/政策冒充 NFR authority。 |
| 旧 00/01 | 将 Redis/PostgreSQL/S3/Glacier、hash/signature 实现当 NFR。 | 技术方案替代需求判断。 |

## 5. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| A. 六类判断口径 + 量化 pending | 不伪造数字，仍可形成验收底线。 | 后续需补 workload measurement。 | 采用。 |
| B. 继承历史 SLA/容量/保留期 | 表面量化完整。 | 缺 authority 和可复现 baseline。 | 不采用。 |
| C. 只写“高性能高可用” | 简短。 | 无法判断或验收。 | 不采用。 |

## 6. 结构化中间产物

### 6.1 非功能需求表

| 非功能类别 | 要求 | 判断口径 / 目标值 |
|---|---|---|
| 性能 | 归档采集、闭包、验证和恢复材料生成不应因单一来源或大包处理而静默失去进度可见性。 | 在 workload authority 未提供基线前不承诺分钟级 SLA；必须能报告进行中、阻塞和局部结果。 |
| 性能 | 只读 manifest/provenance 查询不应回源执行不可控的业务写入或长事务。 | 查询保持只读；响应可明确 stale/partial/blocked。 |
| 可用性 | 单一 owner、存储或签名依赖失效时，已知局部结果仍可被读取，但不生成全局成功。 | 失败以 partial/blocked/unknown 暴露；不得静默降级为完整包。 |
| 可用性 | 恢复接收方不可用时，计划和材料状态仍可审查，业务状态不被 Archive 改写。 | handoff pending/commit-unknown 可查询，owner committed 不由 Archive 推断。 |
| 安全 | 本仓不得越权保存上游业务正文、密钥真相、授权裁决或跨域写权限。 | source-authority matrix 与禁止保存正文边界持续通过审查；缺授权 fail-closed。 |
| 审计 / 可追溯 | 请求、来源绑定、闭包、验证、存储/生命周期、恢复计划、交接和补偿均必须可追溯到输入 ref 或外部反馈。 | 任一关键记录缺来源时不得宣称 sealed、verified 或 restored。 |
| 幂等 / 一致性 | 同一请求、切片和 owner handoff 的重复、乱序、冲突和未知提交不得产生歧义或重复副作用。 | 结果按 request/slice/item 维度独立可判别；commit-unknown 先核对再重试。 |
| 可观测性 | 各能力节点的状态、覆盖、失败类别、依赖反馈和补偿要求必须稳定可见。 | 至少能按 A1~A9 定位 blocked、partial、stale、missing、conflicting、unsupported-version、integrity-failed、commit-unknown。 |

### 6.2 全局质量约束

- fail-closed 是默认安全姿态；未知不等于成功、完整或可信。
- 不以历史 README 的 5 分钟/2 分钟、7 年、99.9% 等无当前 authority 数字作为承诺。
- 所有质量判断必须保留证据边界和来源版本；不伪造测试、报告、digest、签名、readiness 或 signoff。

### 6.3 能力与全局映射

| NFR 主题 | 能力/范围 |
|---|---|
| 进度和依赖失效可见 | A2~A5、A8~A9 |
| 只读、最小权限、fail-closed | A1~A9，全局 |
| provenance 与动作可追溯 | A1~A9，全局 |
| request/slice/item 幂等一致性 | A1、A2、A8、A9 |
| 状态、覆盖、失败、补偿可观察 | A1~A9，全局 |

## 7. 回填草稿

Archive 的质量底线是：长作业与依赖失效保持状态可见；只读面不触发业务写入；缺 authority、完整性或 receiver feedback 时 fail-closed；所有关键记录可追溯；重复、乱序、冲突和提交未知不产生歧义或静默副作用；A1~A9 的状态、覆盖与失败类别可定位。当前不继承无 workload/policy authority 的耗时、容量、SLA、RTO/RPO 或保留年限数字。

## 8. 待确认事项

- workload、measurement authority、容量分布、RTO/RPO、SLA 与成本目标尚未闭合。
- 加密/签名、密钥、压缩、schema evolution 和 storage 能力的质量目标受 `AR-UP-004/005` 限制。

## 9. 自检与进入下一步条件

- [x] 六类非功能类别均已检查并给出适用判断。
- [x] 每项要求都有目标值或明确判断口径。
- [x] 没有写实现方案、供应商、监控平台或测试步骤。
- [x] gate_status=`pass_with_blockers`，允许进入 Step 14。
