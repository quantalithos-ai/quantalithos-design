# Step 7. 核心能力闭环

## 1. Step 状态

- 状态：`[x] 已完成并通过自检`
- 对应 SOP：`需求文档讨论流程_SOP.md` Step 7
- 回填章节：正式 `00-需求文档.md` §7
- gate_status：`pass_with_blockers`
- gate_reason：核心能力节点已命名、排序并给出进入/退出条件；外部 owner 合同仍按 AR-UP blocker 保守限制。
- next_allowed_action：进入 Step 8 用户故事，按能力节点逐个小循环。

### 1.1 Step 内计划

- [x] 读取 Step 2/4/6、draft/02~03、L1-workspace 正式 00~07 和各 owner 边界。
- [x] 先搭能力节点整体骨架。
- [x] 回答闭环成立条件、节点顺序、外围增强和失败上限问题。
- [x] 诊断旧文档按对象/供应商/项目状态组织能力的问题。
- [x] 比较“材料闭环”与“项目状态恢复”主轴。
- [x] 形成能力闭环图、节点表和跨节点红线。
- [x] 形成回填草稿并完成自检。

## 2. 本步输入

- `00_req_step_02_position_boundary.md`、`00_req_step_04_goals_non_goals.md`、`00_req_step_06_consumers_dependencies.md`
- `draft/02_功能推演.md`、`draft/03_模块划分与分层.md`
- `projects/L1-workspace/00-需求文档.md` 至 `07-实施计划.md`
- 各 L1 owner、`L1-artifact`、`L4-observability` 当前正式边界

## 3. SOP 问题回答

1. 本仓成立所需的核心能力闭环是什么？

   最小闭环是：受理有依据的归档请求 → 按 source-authority matrix 收集 owner-approved snapshot/export/ref → 形成 manifest 与内容闭包 → 记录完整性/兼容状态 → 绑定存储与生命周期执行 → 提供只读验证 → 生成 owner-specific 恢复材料并 handoff → 记录每个 owner 的结果、未知和补偿路径。

2. 核心能力节点应如何排序？

   先请求与范围，再逐 source capture；capture 后才能形成 manifest/closure；closure 后才能做 integrity/compatibility；验证后才允许 storage placement；任何已保存材料都可进入 read/verify；restore 必须在包验证和授权条件后规划、生成材料并逐 owner handoff；最后以 outcome/retry/compensation 收口。

3. 每个节点的进入和退出条件是什么？

   请求节点要求主体、范围、依据和幂等语境可解释；capture 要求 owner 返回 version/watermark/fence/coverage；closure 要求 manifest 与材料/引用集合可比对；integrity 要求正式 digest/signature/KMS 结果；storage 要求 location/迁移反馈；restore 要求目标 owner、兼容性和授权可验证；handoff 要求 owner receiver 返回可判别结果。缺失时停在 blocked/partial/unknown。

4. 哪些能力不属于核心闭环？

   跨包全文搜索、趋势/RCA、自动合规声明生成、跨区域灾备编排、一键恢复为 Active、产品 UI、SDK cache、对象存储供应商治理和实时 observability 均不属于当前核心闭环。

5. 核心闭环的统一失败上限是什么？

   不能把局部完成合并为全局成功。必须显式表达 `partial`、`stale`、`missing`、`conflicting`、`unsupported-version`、`integrity-failed`、`commit-unknown` 和 `compensation-required`；未知状态 fail-closed。

## 4. 当前文档问题诊断

| 历史位置 | 问题 | 影响 |
|---|---|---|
| README §25~§39 | 按六域、合规声明、冷存、恢复结果平铺职责 | 没有体现从请求到 handoff 的闭环和状态边界 |
| 旧 00 §132~§174 | 按项目 archived/dissolved/active 组织用例 | 把业务状态迁移误当 Archive 核心能力 |
| 旧 02/03 | 按技术对象和固定供应商展开 | 需求阶段过早落实现层，且没有 source matrix |
| draft/02 | 已有 A1~A9 候选节点，但未明确每节点门禁及跨节点不可推导关系 | 需正式收束为能力链 |

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 主轴 | “六域打包→项目恢复” | “请求→逐 source capture→closure→integrity/storage→verify→owner handoff” | 体现 Archive 自有职责 |
| 完整性 | 包上传成功即视为完成 | manifest/closure/integrity/storage 各自独立 | 避免阶段成功互相冒充 |
| 恢复 | Archive 直接恢复 active/project.restored | 生成材料并交给 owner，逐项记录结果 | 保持 owning domain 权威 |
| 失败 | 统一成功/失败 | 局部、未知、冲突、补偿显式化 | 支撑 fail-closed 与验收 |

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| A. 材料闭环 + owner-specific handoff | 能覆盖归档和恢复全过程，阶段边界清楚 | 需要多个 owner 接缝 | 采用 |
| B. 以项目状态迁移为核心 | 易于讲述“归档/恢复项目” | 越过 `L1-work` 等 owner，诱导跨域写权 | 不采用 |
| C. 以六域固定集合为核心 | 表格简单 | 各域是否纳入应由请求/授权/覆盖决定，workspace/observability 不能机械强制 | 不采用 |

## 7. 结构化中间产物

### 7.1 核心能力闭环图

#### 能力闭环图: L4-archive

```text
[A1 request + scope + authority ref]
              |
              v
[A2 per-source capture + fence/version/coverage]
              |
              v
[A3 manifest + slice binding + content closure]
              |
              v
[A4 integrity + compatibility assessment]
              |
              v
[A5 storage placement + lifecycle execution seam]
              |
              +------> [A6 read / verify / audit-safe query]
              |
              v
[A7 restore request + validation + plan]
              |
              v
[A8 owner-specific material + handoff]
              |
              v
[A9 item outcome + retry / compensation / unknown]
```

图示说明：箭头表达能力依赖，不表示跨仓事务；A6 可在 A5 后独立读取；任何节点都可能产生 blocked/partial/unknown，不得跳过前置条件宣称 sealed/completed。

### 7.2 能力节点表

| 节点 | 能力 | Archive 拥有 | 进入条件 | 退出条件 | 失败上限 |
|---|---|---|---|---|---|
| `A1` | 请求与范围 | request、scope、authority ref、幂等语境、job 初始状态 | 主体/范围/依据可解释 | request accepted 或 rejected/blocked | rejected/blocked |
| `A2` | source capture/fence | source binding、capture attempt、coverage | owner-safe snapshot/export/ref 可调用 | 每 source 有 version/fence/coverage 结果 | partial/stale/missing/conflicting |
| `A3` | manifest/closure | Bundle、manifest、slice inventory、closure result | capture 结果可比对 | manifest 与材料/引用闭包一致 | incomplete/overfull/invalid |
| `A4` | integrity/compatibility | verification result、兼容状态、失败历史 | 正式验证输入存在 | digest/signature/version 结论可解释 | integrity-failed/unsupported-version/unknown |
| `A5` | storage/lifecycle execution | location、tier、迁移、取回、decision 执行记录 | A3/A4 达到允许保存条件且有外部反馈 | 可取回状态和治理执行结果可查询 | storage-pending/unavailable/commit-unknown/blocked |
| `A6` | read/verify | manifest、来源、coverage、验证和安全审计结果只读面 | 有 Archive local material | 返回带 provenance/status 的结果 | stale/partial/blocked |
| `A7` | restore planning | restore request、兼容验证、owner plan | 包验证、权限和目标 owner 可解释 | 形成 per-owner restore plan | rejected/blocked/unsupported-version |
| `A8` | materialization/handoff | owner-specific material、handoff record | plan 和 source binding 可用 | receiver 返回 handoff 状态 | partial/commit-unknown |
| `A9` | outcome/recovery | item outcome、retry、compensation、冲突记录 | A8 有结果或未知 | 每项结果可追溯，不压平 | conflicting/compensation-required/failed |

### 7.3 跨节点红线

| 红线 | 约束 |
|---|---|
| `sealed` | 只表示 Archive 本地 closure/integrity 等条件满足，不表示项目 archived 或 owner committed。 |
| `eligible` | 只表示收到可解释 decision ref，不表示 Archive 拥有销毁权。 |
| `material-ready` | 只表示材料可交接，不表示 owner 已接受或提交。 |
| `commit-unknown` | 不得通过重复副作用“解决”；必须先 query/verify 或受控补偿。 |
| `partial` | 只按 slice/owner item 暴露，不得聚合为全局 complete。 |

## 8. 回填草稿

Archive 的核心能力闭环由九个节点组成：受理有依据的归档请求与范围；按 source-authority matrix 逐一收集 owner-approved snapshot/export/ref 和版本/fence/coverage；形成 Archive Bundle manifest、切片绑定与内容闭包；记录完整性和版本兼容判断；绑定存储位置、层级和生命周期执行结果；提供只读验证和审计安全查询；接收恢复申请并生成逐 owner 计划；生成 source-specific 恢复材料并通过正式 handoff 交给各 owning domain；记录每个 item 的 accepted/rejected/partial/commit-unknown、重试和补偿结果。

上述节点是能力依赖链而非跨仓事务。`sealed`、`eligible`、`material-ready` 只表达 Archive 自有或交接阶段状态，不能推导项目 archived/dissolved/restored、治理批准、owner committed 或全局恢复成功。跨包搜索、自动合规声明、灾备编排、一键恢复 Active 等均为外围或边界外能力。

## 9. 待确认事项

- `AR-UP-001~009` 继续限制 A2、A4、A5、A7、A8 的正向闭环；保持 blocked/unknown 上限。
- 各能力节点是否纳入特定 slice 由请求声明、owner authorization 和 source matrix 决定，不采用固定“六域”分母。

## 10. 进入下一步条件

- [x] 能力节点已命名、排序并给出进入/退出条件。
- [x] 每个节点有明确 Archive-owned 结果与失败上限。
- [x] 能力闭环没有把项目状态、治理决定或 owner committed 写成 Archive 结果。
- [x] 外围增强与边界外能力已分离。
- [x] gate_status=`pass_with_blockers`，允许进入 Step 8。
