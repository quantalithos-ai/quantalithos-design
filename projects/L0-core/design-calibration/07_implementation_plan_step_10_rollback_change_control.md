## Step 10. 定义回退、暂停与变更控制

### 1. Step 状态

- 状态：[x] 已确认
- 对应 SOP：`standards/document/实施计划讨论流程_SOP.md` Step 10
- 回填章节：`07-实施计划.md` §10 回退、暂停与变更控制

### 2. 本步输入

- 上游文档：
  - `projects/L0-core/03-详细设计.md` §9 / §10 / §12 / §13 / §17
  - `projects/L0-core/04-配置设计.md` §9 / §10 / §11 / §14
  - `projects/L0-core/05-测试方案.md` §9 / §11 / §12 / §13 / §14
  - `projects/L0-core/06-验收标准.md` §10 / §11 / §12 / §13 / §14
- 已确认结论：
  - commit-01-a ~ commit-06-a 是本轮回退、review 和证据审查的最小提交边界。
  - P0 suite 失败、P0 EV 缺失、AC-BLOCKER、raw secret、禁止正文、truth / audit / outbox 半提交、失败伪成功和 release gate 缺失均不得风险接受。
  - 真实 L0-bus、L0-sdk、L1+ 不可用时，P0 可继续使用 boundary suite，但不能宣称真实外部联调成功。
  - 修改对象、接口、状态、事务、配置、测试、验收或 P0 范围时，必须回写对应上游文档。
- 依赖的前序 Step：
  - `07_implementation_plan_step_06_tasks_commits.md`
  - `07_implementation_plan_step_07_test_acceptance_gates.md`
  - `07_implementation_plan_step_08_config_environment.md`
  - `07_implementation_plan_step_09_spikes_risks.md`

### 3. SOP 问题回答

1. 哪些情况必须暂停当前阶段。

   回答：当前阶段遇到 P0 测试失败、P0 EV 缺失、AC-BLOCKER、配置 fail open、raw secret、禁止正文、truth / audit / outbox 半提交、失败伪成功、release gate 缺失、目标实现仓或 Rust toolchain 不可用、设计契约缺失或实现偏离未回写时，必须暂停。暂停不是放弃阶段，而是停止继续扩大代码范围，先保留证据并修复阻断点。

2. 哪些情况允许回退到上一个提交边界。

   回答：只有当前 commit boundary 尚未通过门禁，且上一个 commit boundary 已经验证通过、证据仍有效、回退不会破坏已发布 truth / audit / outbox / evidence 时，才允许回退。回退粒度必须对齐 commit boundary，不允许用零散文件回退替代边界回退。

3. 哪些情况必须回写详细设计或测试方案。

   回答：修改 struct、enum、trait、API、command、query、event、job、状态机、事务、幂等、安全、审计、错误恢复或外部依赖绑定时，必须回写 `03-详细设计.md`；修改 JSON key、配置来源优先级、profile、fail fast / fail closed 口径时，必须回写 `04-配置设计.md`；修改 suite、TC、EV、测试数据、环境或证据字段时，必须回写 `05-测试方案.md`；修改 AC、blocker、风险接受或 release gate 判定时，必须回写 `06-验收标准.md`。

4. 门禁失败后如何处理。

   回答：门禁失败后先停止进入下一阶段，记录失败命令、commit boundary、config profile、run_id、日志路径和失败原因；随后修复当前边界，重跑当前 suite 和受影响回归；如果修复需要改变设计契约，先回写上游设计并复核，再继续编码。不得在失败门禁未关闭时提交或进入下一阶段。

5. 外部依赖不可用时是否允许继续局部实施。

   回答：取决于依赖类型。真实 L0-bus、L0-sdk、L1+、secret provider、observability store 不可用时，允许用 boundary suite / fake / real-like adapter 继续 P0 局部实施，并登记后续风险。目标实现仓、Rust toolchain、JSON profile、状态根、fake gate、fake resolver、fake publisher、evidence root 或 release-like profile 不可用时，不允许绕过对应阶段门禁。

6. 恢复实施的条件是什么。

   回答：恢复实施必须同时满足：阻断原因已关闭或按规则降级为已接受风险；失败 suite / EV / AC 已重跑并通过；证据索引已更新；设计偏离已回写对应上游文档；当前 commit boundary 的 diff 范围仍然单一； reviewer 或实施负责人确认可以继续进入原阶段或下一个阶段。

### 4. 当前文档问题诊断

| 位置 | 当前问题 | 影响 |
|---|---|---|
| Step 6 提交边界 | 已定义 commit boundary，但尚未定义失败时如何回退 | 实施者可能按文件回退，破坏已验证边界 |
| Step 7 门禁矩阵 | 已定义阻断门禁，但尚未定义暂停和恢复流程 | 门禁失败后可能继续扩大改动 |
| Step 8 依赖处理 | 已定义 fail fast / fail closed / pending / stale | 需要明确哪些不可用允许局部继续，哪些必须暂停 |
| Step 9 风险表 | 已分类 blocker / risk / spike / open question | 需要把风险转成实施中的变更控制规则 |
| 正式 `07-实施计划.md` | 尚未创建 | Step 13 需要把本步规则回填为 §10 |

### 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 暂停规则 | 分散在门禁、配置和风险表 | 统一列出必须暂停的触发条件 | 防止失败后继续推进 |
| 回退规则 | 只有 commit boundary | 明确只能回退到已验证提交边界 | 保护已验证阶段和证据 |
| 变更控制 | 只有“设计偏离需回写”原则 | 按 03 / 04 / 05 / 06 分配回写目标 | 避免实施计划替代设计变更 |
| 外部依赖 | fake 与真实外部依赖边界已定义 | 明确局部继续和必须暂停的分界 | 避免真实依赖不可用阻塞 P0，也避免核心依赖被绕过 |
| 恢复条件 | 尚未集中定义 | 需要测试、证据、设计回写和 diff 边界同时满足 | 保证恢复后仍可 review 和验收 |

### 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 任何失败都立即整体回退 | 简单保守 | 会丢失可保留的调查证据和局部修复机会 | 不采用 |
| 失败后继续编码，最后统一修复 | 短期推进快 | 扩大问题范围，破坏阶段门禁 | 不采用 |
| 暂停当前边界，保留证据，修复后重跑 | 定位清楚，保护阶段门禁 | 需要严格记录证据 | 采用 |
| 按文件或模块回退 | 操作灵活 | 容易留下半提交和证据错配 | 不采用 |
| 只允许回退到已验证 commit boundary | 可审查、可复验、可追溯 | 需要提前设计提交边界 | 采用 |
| 设计偏离直接在代码里修 | 编码速度快 | 上游文档失真，后续 agent 无法 1:1 还原 | 不采用 |
| 设计偏离先回写上游再继续 | 设计和实现一致 | 增加一次校准成本 | 采用 |

### 7. 结构化中间产物

#### 7.1 控制流程图

图类型：实施异常控制流

图标题：L0-core 实施暂停、回退、变更与恢复流程

```text
-------------------------+
| Current commit boundary |
| commit-xx               |
+-----------+-------------+
            |
            v
+-------------------------+
| Run required gates      |
| tests + AC + EV         |
+-----------+-------------+
            |
      +-----+------+
      |            |
      v            v
+----------+   +-------------------------+
| Pass     |   | Fail / divergence       |
+----+-----+   +-----------+-------------+
     |                     |
     v                     v
+----------+   +-------------------------+
| Commit   |   | Pause current boundary  |
| boundary |   | keep evidence           |
+----+-----+   +-----------+-------------+
     |                     |
     v                     v
+----------+   +-------------------------+
| Next PH  |   | Fix / write back design |
+----------+   | or rollback to verified |
               | boundary                |
               +-----------+-------------+
                           |
                           v
               +-------------------------+
               | Rerun affected gates    |
               +-----------+-------------+
                           |
                           v
               +-------------------------+
               | Resume or stop          |
               +-------------------------+
```

关键说明：
- 图中 `commit-xx` 表示 Step 6 已定义的 commit boundary，不表示任意 WIP 保存点。
- `Fail / divergence` 同时覆盖测试失败、验收失败、证据缺失、设计偏离和外部依赖阻断。
- 只有已验证边界可以作为 rollback 目标；未验证边界只能修复、拆批或废弃当前改动。
- 图不表达具体代码实现细节，具体对象、接口和事务规则仍以 `03-详细设计.md` 为准。

#### 7.2 暂停规则表

| 触发条件 | 动作 | 责任方 | 保留证据 | 恢复条件 |
|---|---|---|---|---|
| P0 suite 失败 | pause | 实施者 | 失败命令、日志、suite、case_id、commit boundary | 修复后重跑当前 suite 和相关回归通过 |
| P0 EV 缺失或字段不完整 | pause | 实施者 / reviewer | run_id、预期 EV、缺失字段、artifact 路径 | 补跑、补证、evidence index 更新完成 |
| AC-BLOCKER 触发 | pause | 实施者 / design owner | blocker 编号、复现步骤、影响阶段 | blocker 修复并复验通过，不得风险接受 |
| raw secret、token、credential 或禁止正文进入配置 / 日志 / EV | pause | 实施者 / reviewer | 泄露位置、扫描结果、修复记录 | 清理、修复、重跑安全扫描和相关测试 |
| truth / audit / outbox 半提交 | pause | 实施者 | transaction 日志、store diff、失败 fixture | 修复原子边界并重跑 integration / audit / outbox tests |
| gate fail、reference fail、toolchain fail 被伪成功 | pause | 实施者 | 输入、输出、错误映射、状态变化记录 | 错误映射修复，旧状态保留，失败证据可追溯 |
| release gate 缺失或失败 | pause | 实施者 / reviewer | release gate run、EV、失败原因 | release gate 重跑通过或正式判定不放行 |
| 目标实现仓路径、branch 或设计基线 commit 未确认 | pause | 实施者 | 当前路径、branch、缺失信息 | 记录绝对路径、branch、设计基线 commit |
| Rust toolchain / workspace 不可构建 | pause | 实施者 | `rustc` / `cargo` 输出、构建日志 | toolchain 和 workspace check 通过 |
| 设计契约缺失或实现偏离未回写 | pause | 实施者 / design owner | 偏离说明、受影响文件、上游章节 | 回写上游设计并复核后继续 |

#### 7.3 回退规则表

| 触发条件 | 动作 | 责任方 | 保留证据 | 恢复条件 |
|---|---|---|---|---|
| 当前 commit boundary 修复成本过高，且上一边界已验证 | rollback | 实施者 / reviewer | 当前 diff、失败证据、上一边界 EV | 回退到上一已验证边界后，重新拆分当前边界 |
| 当前边界引入不可接受的 API / schema 破坏 | rollback + change | 实施者 / design owner | 破坏性 diff、失败用例、受影响契约 | 回写 03 / 05 / 06 后重新设计边界 |
| 当前边界污染 P1 / P2 能力到 P0 | rollback | 实施者 | scope scan、污染文件、相关需求编号 | 移除污染范围，重跑 scope / redline scan |
| 当前边界无法保持单一功能边界 | rollback 或拆批 | 实施者 / reviewer | diff 范围、commit boundary 对照表 | 拆分代码批次，但仍保持 commit boundary 可审查 |
| 当前边界产生无法清理的敏感数据证据 | rollback + cleanup | 实施者 / reviewer | 泄露路径、清理记录、扫描报告 | 清理后重新生成安全证据 |

回退限制：

| 限制 | 说明 |
|---|---|
| 不回退已验证阶段 | 已通过门禁并有 EV 的阶段不得因后续边界失败被随意修改 |
| 不按零散文件回退 | 回退目标必须是已验证 commit boundary 或当前未提交工作区 |
| 不重写 truth / audit / evidence | 已形成验收证据的 truth、audit、EV 只能通过补充修复证据说明，不能静默覆盖 |
| 不用 WIP commit 作为回退点 | WIP 保存点不能作为正式回退目标 |

#### 7.4 变更控制表

| 触发条件 | 动作 | 责任方 | 保留证据 | 恢复条件 |
|---|---|---|---|---|
| 修改 struct / enum / trait / API / command / query / event / job | change | 实施者 / design owner | 变更说明、受影响对象、测试影响 | 回写 `03-详细设计.md` 并复核 |
| 修改状态机、事务、幂等、安全、审计、错误恢复 | change | 实施者 / design owner | 状态迁移差异、失败用例、回归范围 | 回写 `03-详细设计.md`、补测试后继续 |
| 修改 JSON key、profile、配置来源优先级、fail fast / fail closed | change | 实施者 / design owner | 配置 diff、兼容性说明、负例测试 | 回写 `04-配置设计.md` 和相关测试 |
| 修改 suite、TC、EV、测试数据、环境矩阵或证据字段 | change | 实施者 / reviewer | 测试方案 diff、旧新门禁对比 | 回写 `05-测试方案.md` 后重跑相关门禁 |
| 修改 AC、blocker、风险接受或 release gate 判定 | change | 实施者 / reviewer / design owner | 验收口径差异、风险接受记录 | 回写 `06-验收标准.md` 并重新确认放行规则 |
| 把 P1 / P2 能力提升为 P0 | change | design owner | 需求、架构、概要、详细影响分析 | 回写 `00~03`，重新评估 Step 2~7 |
| 外部依赖从 fake 切到真实实现 | change | 实施者 / 相邻仓 owner | adapter 差异、失败模式、联调证据 | 回写 03 / 05 / 06 或转入相邻仓计划 |

#### 7.5 外部依赖不可用处理表

| 不可用对象 | 是否允许继续局部实施 | 允许动作 | 禁止动作 |
|---|---|---|---|
| 真实 L0-bus | 是 | 用 outbox / CloudEvent / relay boundary suite 验证 | 声称真实 bus 投递成功 |
| 真实 L0-sdk / L1+ | 是 | 提供 DTO、snapshot、package view、guide sample | 声称下游仓已完成消费联调 |
| 真实 secret provider | 是 | 使用 secret reference 和 fake resolver 验证 | 在配置或证据中写 raw secret |
| observability store | 是 | 保留 trace / evidence 字段和本地 artifact | 声称生产观测归档完成 |
| 目标实现仓 | 否 | 先确认路径、branch、设计基线 commit | 在未知仓库中开始编码 |
| Rust toolchain / workspace | 否 | 修复 toolchain 和 workspace skeleton | 跳过 fmt/lint/check |
| JSON profile / root path | 否 | 修复配置和状态根隔离 | 降级到隐式默认值继续 |
| fake gate / fake resolver / fake publisher | 否，影响对应阶段 | 修复 fake 或调整测试 fixture | 伪造成功结果 |
| evidence root / release-like profile | 否，影响 PH-06 | 修复 artifact 路径和 profile | 口头确认 release gate |

#### 7.6 恢复实施条件表

| 暂停类型 | 恢复条件 | 需要重跑 |
|---|---|---|
| 测试失败 | 失败原因修复，当前 suite 通过，受影响回归通过 | 当前 suite + 相关回归 |
| EV 缺失 | 证据补齐，字段完整，evidence index 可定位 | 对应 suite / EV check |
| 验收 blocker | blocker 修复，验收项复验通过 | blocker 对应 AC / release gate |
| 配置失败 | JSON parse、type validate、cross-field validate 通过 | config smoke + negative config |
| 事务 / outbox 失败 | 原子边界修复，旧状态无污染或有清理证据 | integration + audit + outbox |
| 安全红线 | 敏感内容清理，扫描通过，证据重生成 | security scan + 相关功能测试 |
| 设计偏离 | 上游文档回写并复核，实施计划边界仍成立 | 受影响 suite / AC / EV |
| 外部依赖不可用 | 已确认可用，或按规则转为 boundary suite / 后续风险 | 对应 boundary suite |

#### 7.7 Commit Boundary 对齐表

| 提交边界 | 暂停重点 | 可回退目标 | 必须保护的已验证内容 |
|---|---|---|---|
| commit-01-a | workspace / toolchain 不可构建 | 无上一边界，只能修复或重建当前边界 | 无 |
| commit-01-b | DTO / config / fake 失败 | commit-01-a | workspace skeleton 和 test harness |
| commit-02-a | draft domain policy 失败 | commit-01-b | DTO、config、fake ports |
| commit-02-b | command / idempotency / transaction 失败 | commit-02-a | draft domain policy |
| commit-03-a | publish / gate fail 失败 | commit-02-b | draft 写路径和 audit/outbox 边界 |
| commit-03-b | lifecycle / event 失败 | commit-03-a | publish 主线 |
| commit-04-a | query / stale projection 失败 | commit-03-b | lifecycle 和 event |
| commit-04-b | trace / consumer view / body scan 失败 | commit-04-a | basic query |
| commit-05-a | job runner 失败 | commit-04-b | query、trace、consumer view |
| commit-05-b | snapshot / fact / relay 失败 | commit-05-a | job shell 和 runner |
| commit-06-a | E2E / evidence / redline / release gate 失败 | commit-05-b | snapshot、fact、relay boundary |

### 8. 回填草稿

以下内容回填到正式 `07-实施计划.md` §10。

```md
## 10. 回退、暂停与变更控制

> 校准来源：
> - `design-calibration/07_implementation_plan_step_10_rollback_change_control.md`
>
> 延伸阅读：
> - 建议继续阅读上述中间产物的“控制流程图”“暂停规则表”“回退规则表”“变更控制表”“外部依赖不可用处理表”和“Commit Boundary 对齐表”小节，了解实施异常如何暂停、回退、回写和恢复。

实施过程中遇到 P0 suite 失败、P0 EV 缺失、AC-BLOCKER、raw secret、禁止正文、truth / audit / outbox 半提交、失败伪成功、release gate 缺失、目标实现仓或 Rust toolchain 不可用、设计契约缺失或实现偏离未回写时，必须暂停当前阶段。

回退只能发生在当前 commit boundary 尚未通过门禁，且上一 commit boundary 已经验证通过、证据仍有效、回退不会破坏已验证 truth / audit / outbox / evidence 的情况下。回退目标必须是已验证 commit boundary，不允许按零散文件回退，也不允许把 WIP commit 作为正式回退点。

| 触发条件 | 动作 | 责任方 | 保留证据 | 恢复条件 |
|---|---|---|---|---|
| P0 suite 失败 | pause | 实施者 | 失败命令、日志、suite、case_id、commit boundary | 修复后重跑当前 suite 和相关回归通过 |
| P0 EV 缺失 | pause | 实施者 / reviewer | run_id、预期 EV、缺失字段、artifact 路径 | 补跑、补证、evidence index 更新完成 |
| AC-BLOCKER 触发 | pause | 实施者 / design owner | blocker 编号、复现步骤、影响阶段 | blocker 修复并复验通过 |
| 当前边界修复成本过高且上一边界已验证 | rollback | 实施者 / reviewer | 当前 diff、失败证据、上一边界 EV | 回退到上一已验证边界后重新拆分当前边界 |
| 修改对象、接口、状态、事务、配置、测试或验收口径 | change | 实施者 / design owner | 变更说明、受影响章节、测试影响 | 回写对应上游文档并复核 |

修改 struct / enum / trait / API / command / query / event / job、状态机、事务、幂等、安全、审计或错误恢复时，必须回写 `03-详细设计.md`；修改配置项、profile 或配置失败策略时，必须回写 `04-配置设计.md`；修改 suite、TC、EV 或证据字段时，必须回写 `05-测试方案.md`；修改 AC、blocker、风险接受或 release gate 判定时，必须回写 `06-验收标准.md`。

真实 L0-bus、L0-sdk、L1+、secret provider 或 observability store 不可用时，允许使用 boundary suite / fake / real-like adapter 继续 P0 局部实施，但必须登记后续风险，且不得宣称真实外部联调成功。目标实现仓、Rust toolchain、JSON profile、状态根、fake gate、fake resolver、fake publisher、evidence root 或 release-like profile 不可用时，必须暂停受影响阶段。
```

### 9. 待确认事项

- 当前建议接受“只能回退到已验证 commit boundary”的规则。原因是 L0-core 的 truth、audit、outbox 和 evidence 都需要可追溯，按文件回退会破坏阶段证据。
- 当前建议把真实 L0-bus / L0-sdk / L1+ 不可用定义为可继续局部实施的后续风险，而不是 P0 暂停条件。原因是 L0-core 是底座仓，本轮 P0 只需证明 boundary suite 可消费。
- 当前建议把设计偏离统一纳入 change 控制，而不是在实现仓直接修。原因是其他 agent 需要能按 design 文档 1:1 还原实现。

### 10. 进入下一步条件

- 暂停、回退、变更和恢复条件已明确。
- 规则与 Step 6 的 commit boundary 一致。
- 规则与 Step 7 的测试 / 验收门禁一致。
- 规则与 Step 8 的外部依赖处理一致。
- 规则与 Step 9 的 blocker / risk / spike / open question 分类一致。
- 可以进入 Step 11，继续定义提交、评审与交付纪律。
