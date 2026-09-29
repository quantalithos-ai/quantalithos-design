# Step 4. 目标与非目标

## 1. Step 状态

- 状态：`[x] 已完成并通过自检`
- 对应 SOP：`需求文档讨论流程_SOP.md` Step 4
- 回填章节：正式 `00-需求文档.md` §4
- gate_status：`pass`
- gate_reason：目标均有可判断结果；非目标明确指向 owning domain 或后续阶段；未固化无来源数字。
- next_allowed_action：进入 Step 5 用户与角色。

### 1.1 Step 内计划

- [x] 读取 Step 2~3、draft/02 和相关 owner 边界。
- [x] 逐项回答目标、验证方式、非目标和后续归属问题。
- [x] 诊断旧文档把功能、供应商和合规结论写成目标的问题。
- [x] 比较“可验证材料闭环”与“项目恢复成功”目标口径。
- [x] 形成目标表、非目标表和范围护栏。
- [x] 形成回填草稿并自检。

## 2. 本步输入

- `00_req_step_02_position_boundary.md`、`00_req_step_03_problem_context.md`
- `draft/02_功能推演.md`
- `L1-workspace` 正式 00~07 与专项 owner 00/01
- `README.md`、旧 `00-需求文档.md`（仅污染审计）

## 3. SOP 问题回答

1. 需求结束后应成立哪些状态、边界或能力？

   应成立：请求有明确范围和依据；每个切片有 source-authority binding；manifest 与内容/引用闭包可判定；完整性、兼容、存储和生命周期执行状态可区分；恢复计划和 owner handoff 可追溯；局部失败、未知和补偿要求不被压平。

2. 这些目标如何被验证？

   通过后续需求内的能力映射、规则、数据归属、接口类别和验收条件验证；具体运行命令、测试套件、证据文件和性能数值留到 05/06，且必须有真实 baseline 才能量化。

3. 哪些相关事项明确不纳入？

   各 L1 业务 truth、项目生命周期迁移、治理 policy/hold/delete/risk decision、Artifact 正文/血缘、observability 后端、对象存储供应商/KMS、产品 UI/SDK/cache、跨域事务和直接写上游数据库均不纳入。

4. 哪些事情交给相邻仓或后续阶段？

   业务状态由 `L1-work` 等 owner 决定；保留/法律/删除由 governance/legal owner 决定；源正文和血缘由 `L1-artifact` 决定；审计链由 `L4-observability` 决定；供应商、算法、配置和实现细节留给 01~07。

## 4. 当前文档问题诊断

| 历史位置 | 问题 | 影响 |
|---|---|---|
| README §78~§85 | 把 AV、ISO 条目和“必含声明”当成已成立目标 | 可能伪造合规 authority |
| 旧 00 §88~§105 | 用 6/6、5 分钟、2 分钟、7 年等数字定义完成 | 无 workload、policy 或 measurement 来源 |
| 旧 00 §132~§174 | 把“恢复 active”“dissolved 不可恢复”写成目标 | 越过 work owner |
| 旧 00 §218~§225 | 把 SoA/AIIA/Conformance Claim 生成为 Archive 目标 | 治理真相越界 |

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 核心完成 | 6/6 slice + 自动恢复项目 | source binding + closure + integrity + owner handoff 可判别 | 以材料闭环而非业务状态为目标 |
| 质量目标 | 固定耗时、SLA、保留年限 | 先定义可验证类别，数值待 baseline | 避免无来源承诺 |
| 合规目标 | Archive 生成声明 | Archive 保存正式 decision/evidence ref | 保持 governance authority |
| 删除目标 | 到期自动 purge | 仅执行正式授权并保留执行结果 | legal hold/delete 不归 Archive |

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| A. 目标聚焦可验证归档材料闭环与 owner handoff | 权责清楚，可在依赖未闭合时保持 blocked | 不提供一键业务恢复承诺 | 采用 |
| B. 目标聚焦项目状态自动恢复 | 用户叙事简单 | 需要跨域写权和统一状态 owner | 不采用 |
| C. 目标聚焦合规声明自动生成 | 容易做成单一指标 | 缺 governance authority 和标准 schema | 不采用 |

## 7. 结构化中间产物

### 7.1 目标表

| ID | 目标 | 可验证结果 | 当前上限 |
|---|---|---|---|
| `G-AR-001` | 受理有依据的归档请求 | 请求范围、主体、依据和幂等语境可追溯 | 授权合同缺失时 blocked |
| `G-AR-002` | 逐 source 形成可解释快照/导出绑定 | owner、ref、version/watermark、fence、coverage、material kind 可查询 | owner 合同未统一时 partial/blocked |
| `G-AR-003` | 形成 manifest 与内容闭包 | 缺失、越界、重复、冲突均有明确结果 | 不允许缺片后补 |
| `G-AR-004` | 形成完整性与兼容性判断 | digest/signature/version 状态可区分 | 算法/KMS/演进 authority 未闭口时 unknown |
| `G-AR-005` | 记录存储和生命周期执行状态 | location/tier/迁移/hold/delete 执行可追溯 | 不承诺供应商或保留期限 |
| `G-AR-006` | 提供只读验证与恢复规划 | manifest、验证、计划和材料引用可读取 | 不替代 operational query |
| `G-AR-007` | 逐 owner 受控恢复交接 | 每个 owner item 有 handoff/outcome/retry/compensation | 不声称 owner committed/restored |

### 7.2 非目标表

| ID | 非目标 | 归属/后续 | 处理 |
|---|---|---|---|
| `NG-AR-001` | 拥有或迁移 identity/conversation/work/process/governance/artifact truth | 各 L1 owner | 禁止保存或反写 |
| `NG-AR-002` | 决定 archived/dissolved/restored | `L1-work` 及正式协作 | 只消费决定/回执 |
| `NG-AR-003` | 创建 RetentionPolicy、legal hold、delete authorization、risk acceptance | governance/legal owner | 只执行正式决定 |
| `NG-AR-004` | 生成 SoA/AIIA/Conformance Claim 等治理结论 | governance/标准 owner | 只保存 ref/evidence |
| `NG-AR-005` | 成为 Artifact 正文/血缘或 observability 后端 | `L1-artifact` / `L4-observability` | 只保存获准材料/ref |
| `NG-AR-006` | 锁定 Rust、数据库、对象存储、签名算法、KMS 或压缩产品 | 01~04 | 当前只描述能力类别 |
| `NG-AR-007` | 直接写上游数据库、发布业务恢复事件或跨域事务 | 各 owner | 通过正式 handoff |
| `NG-AR-008` | 固定性能、SLA、RTO/RPO、保留年限 | 新 workload/measurement authority | pending，不写数字 |

### 7.3 范围护栏

```text
可验证归档材料闭环 = request + source binding + manifest/closure
                      + integrity/compatibility + storage/lifecycle execution
                      + read/verify + owner-specific restore handoff

业务状态、治理决定、源正文、观测后端、供应商选择和实现细节均在闭环之外。
```

## 8. 回填草稿

本需求的目标是建立一条可验证的归档材料闭环：受理有依据的归档请求，按 source-authority matrix 收集获准快照/导出/引用，形成 Archive Bundle manifest 与内容闭包，记录完整性和版本兼容状态，绑定存储与生命周期执行结果，提供只读验证与恢复规划，并按 owner 交接恢复材料及局部结果。每一项目标都以可追溯、可判别和 fail-closed 为完成上限。

本需求不让 Archive 拥有任何 L1 业务 truth、项目 archived/dissolved/restored 状态、RetentionPolicy/legal hold/delete/risk decision、Artifact 正文/血缘、observability 后端或对象存储/KMS 产品；也不锁定实现技术、供应商、算法、保留年限和性能数字。相关事项由 owning domain 或后续设计阶段承接。

## 9. 待确认事项

- `AR-UP-001~009` 会影响目标的 exact schema、正向集成和量化验收，但不改变目标边界。
- 需要治理与 workload authority 才能决定保留期限、删除时限、RTO/RPO、容量和 SLA。

## 10. 进入下一步条件

- [x] 目标可验证且无无来源数字。
- [x] 非目标具体并指向 owner/后续阶段。
- [x] 目标没有把功能实现、供应商或业务状态迁移写成 Archive 责任。
- [x] gate_status=`pass`，允许进入 Step 5。
