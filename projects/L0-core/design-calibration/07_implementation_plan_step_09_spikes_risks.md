## Step 9. 定义 Spike、风险与待确认事项

### 1. Step 状态

- 状态：[x] 已确认
- 对应 SOP：`standards/document/实施计划讨论流程_SOP.md` Step 9
- 回填章节：`07-实施计划.md` §9 Spike、风险与待确认事项

### 2. 本步输入

- 上游文档：
  - `projects/L0-core/03-详细设计.md` §17
  - `projects/L0-core/04-配置设计.md` §14
  - `projects/L0-core/05-测试方案.md` §14.2
  - `projects/L0-core/06-验收标准.md` §13
- 已确认结论：
  - L0-core P0 可独立实施，不以真实 L0-bus / L0-sdk / L1+ 联调为阻塞前置。
  - PH-01~PH-06 已有阶段、批次、提交边界和门禁。
  - 真实外部联调、secret provider、staging / production 配置后置。
  - P0 EV 缺失、raw secret、禁止正文、半提交、失败伪成功和 release gate 缺失不得风险接受。
- 依赖的前序 Step：
  - `07_implementation_plan_step_08_config_environment.md`

### 3. SOP 问题回答

1. 哪些技术点需要先做 Spike。

   回答：需要 Spike 的技术点包括文件型 store 的事务/原子边界、evidence index 物理归档方案、toolchain runner fake 的输入输出边界、release-like profile 的配置和证据路径、首次 NFR / nightly 是否进入 release gate。

2. 哪些风险会阻塞某个阶段。

   回答：目标实现仓路径未确认会阻塞 PH-01；workspace / toolchain 不可用会阻塞 PH-01；root path、raw secret、fail open 配置会阻塞 PH-01/PH-02；truth/audit/outbox 原子边界不成立会阻塞 PH-02；发布 gate fail 被伪成功会阻塞 PH-03；projection 反写真相会阻塞 PH-04；relay 丢事件或 event id 不稳定会阻塞 PH-05；P0 EV 或 release gate 缺失会阻塞 PH-06。

3. 哪些待确认事项会影响提交边界或验收门禁。

   回答：目标实现仓路径、CI 命令、artifact 物理路径、commit scope、crate 命名限制、NFR/nightly 是否进入 release gate 会影响提交边界和验收门禁。它们必须在对应阶段前确认，不能留到正式提交或送验时临场判断。

4. 每个 Spike 的输出是什么。

   回答：Spike 必须输出可落文的结论：实现方案片段、测试 fixture、门禁命令、证据路径示例或风险接受建议。禁止只输出“已调研”。

5. 每个风险的处理方式和截止点是什么。

   回答：每个风险绑定 PH 阶段和截止点。阻塞类风险必须在进入对应阶段前关闭；可接受风险必须在 PH-06 前形成接受记录；后续仓风险必须转入对应仓的测试方案或验收标准。

6. 哪些风险需要回写上游设计。

   回答：凡是改变 03 的对象/接口/状态/事务/配置契约、改变 04 的 P0 配置项、改变 05 的测试门禁、改变 06 的验收口径或新增 P0 范围的风险，都必须先回写上游设计并复核后才能继续。

### 4. 当前文档问题诊断

| 位置 | 当前问题 | 影响 |
|---|---|---|
| Step 8 外部依赖表 | 已列依赖和失败处理，但未形成风险 / Spike 截止点 | 实施者可能知道风险但不知道何时必须关闭 |
| `03-详细设计.md` §17 | 风险较多，但部分已被 04/05/06/Step 8 收束 | 需要过滤出仍影响实施的项 |
| `05-测试方案.md` §14.2 | 残余风险含旧口径项 | 需要以当前 06 验收标准为准重新分类 |
| `06-验收标准.md` §13 | 风险接受项完整 | 需要转成实施计划中的 owner / 截止点 / 后续动作 |
| 实现仓信息 | 路径、CI 命令、artifact 物理路径未固定 | 会影响 PH-01、PH-06 和 Step 11 |

### 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 风险表达 | 分散在 03/04/05/06 和前序 Step | 收敛为 Spike / risk / open question 三类 | 便于实施前关闭或接受 |
| 截止点 | 多数只写“后续” | 每项绑定 PH 阶段或 Step | 避免长期悬空 |
| 外部依赖风险 | 真实外部服务后置 | 明确不阻塞 P0，但必须登记后续仓风险 | 维护 L0-core 独立验收边界 |
| 阻塞项 | 未集中列出 | 把目标仓、toolchain、配置红线、EV 缺失等列为 blocker | 防止阶段推进时绕过门禁 |
| 设计回写 | 未在实施风险中集中说明 | 明确哪些变化必须回写 03/04/05/06 | 防止实施计划替代设计变更 |

### 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 把全部风险都当 blocker | 最保守 | 会让真实外部联调、NFR 阈值等后置事项阻塞 P0 | 不采用 |
| 把真实外部联调全部风险接受 | 推进最快 | 可能掩盖 boundary suite 缺失或接缝不可消费 | 不采用 |
| blocker / risk / spike / open question 分类处理 | 推进与质量平衡 | 需要维护截止点和责任归属 | 采用 |
| Spike 只写调研结论 | 文档轻 | 不能指导实施或回写设计 | 不采用 |
| Spike 必须输出方案、fixture、命令或决策 | 可执行、可复核 | 前期工作量增加 | 采用 |

### 7. 结构化中间产物

#### 7.1 Spike 表

| 编号 | 类型 | 描述 | 影响阶段 | 处理方式 | 截止点 |
|---|---|---|---|---|---|
| SP-001 | spike | 文件型 store 的 transaction / atomic write 方案验证 | PH-02 | 输出 repo/audit/outbox 原子提交实现方案和 failure fixture | commit-02-b 前 |
| SP-002 | spike | Evidence index 物理路径与字段样例 | PH-06 / Step 11 | 输出 `artifacts/test/l0-core/<run_id>/...` 实例和 index 字段样例 | Step 11 前 |
| SP-003 | spike | Toolchain runner fake 输入输出边界 | PH-05 | 输出 validate/fingerprint/snapshot fake runner fixture 和错误映射 | commit-05-a 前 |
| SP-004 | spike | release-like profile 的最小闭环配置 | PH-06 | 输出 release-like JSON fixture、clean runtime fixture 和 config failure gate 方案 | PH-06 前 |
| SP-005 | spike | EV-NFR / EV-NIGHTLY 是否进入 release gate | PH-06 / Step 12 | 输出是否标记为 release gate 必需项的建议和风险接受草案 | Step 12 前 |

#### 7.2 风险表

| 编号 | 类型 | 描述 | 影响阶段 | 处理方式 | 截止点 |
|---|---|---|---|---|---|
| R-001 | blocker | 目标实现仓路径 `<l0-core-code-root>` 未确认 | PH-01 | 实施者开工前记录绝对路径、branch、设计基线 commit | PH-01 开始前 |
| R-002 | blocker | Rust toolchain / workspace 无法构建 | PH-01 | 先修复 toolchain 或 workspace skeleton，再进入后续阶段 | commit-01-a 前 |
| R-003 | blocker | P0 配置 root path 冲突、raw secret 或 fail open | PH-01~PH-02 | fail fast / fail closed，补 config negative tests | commit-01-b 前 |
| R-004 | blocker | truth + audit + outbox 半提交 | PH-02 | 通过 SP-001 和 integration test 修复原子边界 | commit-02-b 前 |
| R-005 | blocker | gate fail、reference fail 或 toolchain fail 被伪成功 | PH-03~PH-05 | 错误映射必须返回失败并保留旧状态 / 失败证据 | 对应 commit 前 |
| R-006 | blocker | query / projection / snapshot 反写真相 | PH-04~PH-05 | projection 和 snapshot 只读 truth，不得覆盖 truth | commit-04-a / commit-05-b 前 |
| R-007 | blocker | P0 EV、evidence index 或 release gate 缺失 | PH-06 | 补跑、补证、更新 evidence index；不得口头确认 | commit-06-a 前 |
| R-008 | risk | 真实 L0-bus 投递未覆盖 | PH-05~PH-06 | P0 用 outbox / CloudEvent / relay boundary 验证，转入 L0-bus 仓 | L0-bus 验收前 |
| R-009 | risk | 真实 L0-sdk / L1+ 消费联调未覆盖 | PH-04~PH-06 | P0 提供 DTO / package view / guide sample / snapshot，转入下游仓 | 对应下游仓验收前 |
| R-010 | risk | 完整性能容量压测无基线 | PH-06 | 首次实现形成 benchmark baseline；是否阻断由 SP-005 决策 | Step 12 前 |
| R-011 | risk | DTO / view / job 批次超过 300 行 | PH-01 / PH-04 / PH-05 | 实施时拆子批次，不改变 commit boundary | 对应批次开始前 |
| R-012 | risk | P1 能力污染 P0 config / schema / command | PH-01~PH-06 | API surface scan + scope/redline review | 每阶段提交前 |

#### 7.3 待确认事项表

| 编号 | 事项 | 影响阶段 | 可选方案 | 推荐方案 | 截止点 |
|---|---|---|---|---|---|
| Q-001 | 目标实现仓真实路径 | PH-01 | A: 当前 design 仓内实现；B: 本机其他实现仓 | 推荐 B，由实施者填写绝对路径 | PH-01 前 |
| Q-002 | 实现仓 CI / 测试命令 | PH-01~PH-06 | A: 使用 cargo 默认命令；B: 使用目标仓自定义脚本 | 推荐先用 cargo 默认，若目标仓更严格则叠加 | Step 11 前 |
| Q-003 | Artifact 物理归档路径 | PH-06 | A: 使用逻辑路径；B: 绑定 CI artifact 目录 | 推荐 B，逻辑路径映射到 CI artifact | Step 11 前 |
| Q-004 | commit scope 列表 | Step 11 | A: 使用阶段 scope；B: 使用 crate / feature scope | 推荐 A+B：阶段边界为主，scope 使用功能名 | Step 11 前 |
| Q-005 | EV-NFR / EV-NIGHTLY 是否阻断 release gate | PH-06 | A: P0 阻断；B: 只形成风险证据 | 推荐 B，除非实施期已有明确阈值 | Step 12 前 |
| Q-006 | 真实 staging / production 配置是否提前设计 | PH-06 后 | A: 放入 07；B: 后续 09 部署运维承接 | 推荐 B，07 只写 P0 profile | 07 正式文档冻结前 |

#### 7.4 需要回写上游设计的触发条件

| 触发条件 | 回写目标 |
|---|---|
| 新增或修改 struct / enum / trait / API / command / query / event / job 契约 | `03-详细设计.md` |
| 新增 P0 配置项、修改 JSON key、修改来源优先级或 fail fast / fail closed 口径 | `04-配置设计.md` |
| 新增、删除或改变 P0 suite / TC / EV | `05-测试方案.md` |
| 改变 AC、blocker、风险接受或 release gate 判定口径 | `06-验收标准.md` |
| 把 P1/P2 能力提升为 P0 | `00-需求文档.md`、`01-架构设计.md`、`02-概要设计.md`、`03-详细设计.md` |

### 8. 回填草稿

以下内容回填到正式 `07-实施计划.md` §9。

```md
## 9. Spike、风险与待确认事项

> 校准来源：
> - `design-calibration/07_implementation_plan_step_09_spikes_risks.md`
>
> 延伸阅读：
> - 建议继续阅读上述中间产物的“Spike 表”“风险表”“待确认事项表”和“需要回写上游设计的触发条件”小节，了解实施中哪些问题必须前置验证、关闭或风险接受。

本轮风险按 blocker、risk、spike 和 open question 分类处理。blocker 必须在对应阶段前关闭；risk 必须有接受理由、后续动作和截止点；Spike 必须输出可复核的方案、fixture、命令或决策，不允许只写“已调研”。

| 编号 | 类型 | 描述 | 影响阶段 | 处理方式 | 截止点 |
|---|---|---|---|---|---|
| SP-001 | spike | 文件型 store 的 transaction / atomic write 方案验证 | PH-02 | 输出原子提交方案和 failure fixture | commit-02-b 前 |
| SP-002 | spike | Evidence index 物理路径与字段样例 | PH-06 / Step 11 | 输出 artifact 路径和 index 字段样例 | Step 11 前 |
| SP-003 | spike | Toolchain runner fake 输入输出边界 | PH-05 | 输出 fake runner fixture 和错误映射 | commit-05-a 前 |
| R-001 | blocker | 目标实现仓路径未确认 | PH-01 | 记录绝对路径、branch、设计基线 commit | PH-01 开始前 |
| R-004 | blocker | truth + audit + outbox 半提交 | PH-02 | 修复事务边界并重跑 integration / audit / outbox tests | commit-02-b 前 |
| R-007 | blocker | P0 EV、evidence index 或 release gate 缺失 | PH-06 | 补跑、补证、更新 evidence index | commit-06-a 前 |
| R-008 | risk | 真实 L0-bus 投递未覆盖 | PH-05~PH-06 | P0 用 boundary suite，转入 L0-bus 仓 | L0-bus 验收前 |
| R-010 | risk | 完整性能容量压测无基线 | PH-06 | 首次实现形成 baseline；是否阻断由 Step 12 决定 | Step 12 前 |

凡是改变 03 的对象 / 接口 / 状态 / 事务 / 配置契约、改变 04 的 P0 配置项、改变 05 的测试门禁、改变 06 的验收口径或新增 P0 范围的风险，都必须先回写上游设计并复核后才能继续。
```

### 9. 待确认事项

- 目标实现仓路径、CI 命令、artifact 物理路径、commit scope 和 EV-NFR / EV-NIGHTLY 放行口径仍需在 Step 10~12 继续收束。
- 当前建议接受真实 L0-bus / L0-sdk / L1+ 联调后置，不作为 L0-core P0 blocker。
- 当前建议把 staging / production 配置转入后续部署与运维文档，不写入 07 的 P0 门禁。

建议方案：接受当前风险分类。原因是它把真正阻塞 P0 的问题前置关闭，同时把真实外部联调、容量阈值和生产配置放到正确的后续承接位置。

### 10. 进入下一步条件

- 风险、Spike 和待确认事项均已分类。
- 会阻塞实施的事项已明确为 blocker。
- 每个 Spike 都有输出和截止点。
- 每个待确认事项都有推荐方案和截止点。
- 可以进入 Step 10，继续定义回退、暂停与变更控制。
