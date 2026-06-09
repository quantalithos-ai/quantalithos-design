# L1-process 07 实施计划 Step 9: Spike、风险与待确认事项

> 所属流程: `07_implementation_plan_calibration_flow.md`
> 对应正式文档: `projects/L1-process/07-实施计划.md` §9 Spike、风险与待确认事项
> 状态: `[x] 已完成`
> 日期: 2026-06-06

---

## 1. Step 状态

| 项 | 内容 |
|---|---|
| Step | Step 9 |
| 主题 | Spike、风险与待确认事项 |
| 当前状态 | `[x] 已完成` |
| 是否修改正式 `07-实施计划.md` | 否 |
| 产物位置 | `projects/L1-process/design-calibration/07_implementation_plan_step_09_spikes_risks.md` |

本步把实施中可能导致返工、暂停或验收失败的不确定性提前分类。本步不改变 PH-01~PH-10 阶段顺序,不改变 commit boundary。

## 2. 本步输入

| 输入 | 当前状态 | 本步使用方式 |
|---|---|---|
| Step 1~8 中间产物 | 已确认 | 继承输入边界、范围、阶段、提交边界、测试门禁和配置依赖 |
| `03-详细设计.md` | 已完成 | 提取实现风险、状态 / 事务 / 幂等 / job / report 红线 |
| `04-配置设计.md` | 已完成 | 提取 profile、adapter、secret、failure mode 和 P1/P2 风险 |
| `05-测试方案.md` | 已完成 | 提取 defect、retest、artifact、report 和 residual risk |
| `06-验收标准.md` | 已完成 | 提取 VF、risk acceptance、最终结论和不可接受风险 |

## 3. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 哪些技术点需要 Spike | 目标仓 scaffold、core contracts 编译、scripts/report path、operation result replay fake、fake adapter failure semantics、integration-like no fake fallback。 |
| 哪些风险会阻塞阶段 | design baseline 未固定、core contracts 不可用、字段 / DTO / 状态 / phase boundary 无法 1:1 落码、P0 gate / VF / redaction / evidence path 失败。 |
| 哪些不影响 P0 但要记录 | production DB / MQ / search / trace / archive、真实 sibling adapter、capacity hard threshold、deployment / on-call runbook。 |
| Spike 输出是什么 | 必须输出可审查命令结果、fixture、script dry-run、report sample 或 test list,不能只输出口头结论。 |
| 设计冲突如何处理 | 暂停当前 boundary,回写 design repo,提交新 baseline 后再继续。 |

## 4. 结构化中间产物

### 4.1 Spike 表

| 编号 | 类型 | 描述 | 影响阶段 | 输出 | 截止点 |
|---|---|---|---|---|---|
| SP-PROC-001 | spike | 验证目标仓 scaffold、7 crate workspace、package / crate / binary 命名和 Rust 2024 可编译 | PH-01 | `cargo check` / `cargo metadata` 输出;workspace tree summary | commit-01-a 前 |
| SP-PROC-002 | spike | 验证 `core-contracts` path dependency 与当前 toolchain / edition 可编译 | PH-01 | fixed core commit hash;`cargo check` 输出 | commit-01-a 前 |
| SP-PROC-003 | spike | 验证 gate / report / redaction scripts 的参数、固定 path shape 和 failure semantics | PH-01 / PH-10 | dry-run artifact tree;report sample;path check result | commit-01-b 前先建壳;commit-10-a 前完成 |
| SP-PROC-004 | spike | 验证 operation result store 能支撑 same key same digest duplicate replay 和 result missing surface | PH-02~PH-05 | fake store fixture;duplicate / result missing test list | commit-02-b 前 |
| SP-PROC-005 | spike | 验证 resolver / publisher / handoff fake 的 retryable、permanent、unavailable、partial failure 语义 | PH-07~PH-09 | fake adapter scripted fixture;failure matrix | 对应 phase 开工前 |
| SP-PROC-006 | spike | 验证 report generator 可从 partial artifacts 渲染最小 evidence index 壳,最终再渲染 EV detail / acceptance handoff | PH-10 | sample `reports/runs/<run_id>`;missing evidence failure sample | commit-10-a 前 |

### 4.2 风险表

| 编号 | 类型 | 描述 | 影响阶段 | 处理方式 | 截止点 |
|---|---|---|---|---|---|
| R-PROC-001 | risk | design repo 未提交固定 L1-process `00~07` baseline | 实现交接 | 交接前提交 design repo 并提供完整 commit hash | 实现交接前 |
| R-PROC-002 | risk | 目标实现仓不存在或已有冲突内容 | PH-01 | PH-01 创建;若目录冲突则暂停确认 | commit-01-a 前 |
| R-PROC-003 | blocker | `core-contracts` path dependency 缺失、不可编译或类型不匹配 | PH-01+ | 暂停;修复 core 或回写设计,不得复制 core 类型 | 首次 `cargo check` 前 |
| R-PROC-004 | blocker | 字段、DTO、状态、flow、AC 或 phase boundary 无法 1:1 落码 | 任意 PH | 暂停当前 boundary,回写 design repo | 发现时立即 |
| R-PROC-005 | blocker | Process 保存 method / work / governance / artifact / runtime / conversation / observability / archive 正文 | PH-02+ | 阻断;修复并重跑 redaction 和相关 TC | 发现时立即 |
| R-PROC-006 | blocker | Query、projection、report、reconciliation、job 隐式推进 Process truth | PH-06 / PH-09 | 阻断;修复 no-write / no truth repair 并重跑 suite | 发现时立即 |
| R-PROC-007 | blocker | recovery / commit unknown / maintenance 产生第二份 Process truth | PH-04 / PH-09 | 阻断;修复恢复连续性并重跑 recovery suite | 发现时立即 |
| R-PROC-008 | blocker | 非 core sibling repo 成为 Cargo path dependency | PH-01+ | 阻断;移除依赖,改为 port / fake / event seam | 发现时立即 |
| R-PROC-009 | risk | 真实 DB / broker / search / trace / archive / sibling adapter 未验证 | PH-07~PH-10 | P0 使用 fake / controlled seam;写入 risk acceptance / open issues | PH-10 acceptance |
| R-PROC-010 | risk | production capacity hard threshold 未定义 | PH-10 | 生成 performance sample;不写硬阈值 | PH-10 risk acceptance |
| R-PROC-011 | blocker | configured adapter unavailable 时 fallback fake 伪成功 | PH-07~PH-09 | 阻断;改为 fail-fast / delayed / retry / failed / partial | 发现时立即 |
| R-PROC-012 | risk | 旧 README Python / PG 技术栈被误用 | PH-01 | 以正式 `03` Rust workspace 为准;发现即修正 | commit-01-a 前 |

### 4.3 阻塞事项表

| blocker | 触发条件 | 阻塞阶段 | 立即动作 | 恢复条件 |
|---|---|---|---|---|
| BLK-PROC-001 | design baseline 未固定却要求实现开工 | 实现交接 | 暂停交接 | design repo 提交完成并给出完整 hash |
| BLK-PROC-002 | `core-contracts` 不可读 / 不可编译 | PH-01+ | 暂停当前 boundary | core 修复或设计改口径;重跑 `cargo check` |
| BLK-PROC-003 | 字段 / DTO / 状态 / flow / phase boundary 不闭合 | 任意 PH | 记录文件、行号、影响范围并回写设计 | 新 design baseline 提交,当前 boundary 复核通过 |
| BLK-PROC-004 | P0 TC、redaction、VF 或 evidence path 失败 | PH-02~PH-10 | 阻断进入下一阶段 | 修复并重跑直接 TC、同组 TC、相关 suite |
| BLK-PROC-005 | fake-as-production 或 configured unavailable silent success | PH-07~PH-10 | 阻断 | 修正 config marker / report wording / failure surface |

### 4.4 待确认事项表

| 编号 | 事项 | 当前影响 | 推荐方案 | 截止点 |
|---|---|---|---|---|
| Q-PROC-001 | real event bus endpoint / credential 是否进入 P0 | 不影响 P0 | P0 只证明 outbox / publisher 语义,真实 bus 后续专项 | PH-10 risk acceptance |
| Q-PROC-002 | durable DB / search 产品字段全集是否进入 P0 | 不影响 P0 | P0 in-memory / fake, durable adapter 后续专项 | PH-10 open issues |
| Q-PROC-003 | real method / work / governance / artifact / runtime / conversation adapter 是否 P0 必填 | 不影响 P0 | P0 使用 fake / controlled resolver,真实 adapter P1 | 对应 consumer phase 开工前 |
| Q-PROC-004 | observability / archive production handoff 是否 P0 必填 | 不影响 P0 | P0 fake handoff + receipt / report,真实 endpoint P1 | PH-09 开工前 |
| Q-PROC-005 | production capacity / SLO 是否追加为后续增强基线 | 不影响 P0 | 当前 P0 只要求 performance sample;后续 capacity / SLO 基线作为增强项另行定义 | PH-10 open issues |

### 4.5 风险接受边界

| 风险类型 | 是否可接受 | 处理 |
|---|---|---|
| `VF-PROC-*` | 否 | 修复后重验,不得风险接受 |
| S0 / S1、P0 TC failure、redaction violation、P0 EV 缺失 | 否 | 阻断完成 |
| 字段 / DTO / 状态 / phase boundary 冲突 | 否 | 回写 design repo 后恢复 |
| P1 / P2 非范围缺口 | 是 | 写入 `risk-acceptance.md` 或 `open-issues.md`,不得声明 production-ready |
| real-like smoke 失败 | 有条件 | 不影响 P0 truth 时可风险接受,但需明确影响 |

## 5. 回填草稿

```markdown
## 9. Spike、风险与待确认事项

> 校准来源:
> - `design-calibration/07_implementation_plan_step_09_spikes_risks.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“Spike 表”“风险表”“阻塞事项表”“待确认事项表”和“风险接受边界”小节。

字段、DTO、状态、flow、AC 或 phase boundary 冲突属于 blocker,不得由实现者自行选边。真实生产 adapter、capacity hard threshold 和 deployment / runbook 属于 P1/P2 或风险接受范围,不得写成 P0 已完成。
```

## 6. 进入下一步条件

- Spike、风险、blocker 和待确认事项已分类。
- 每项均绑定影响阶段、输出或处理方式。
- 后续 Step 10 可以定义暂停、回退和变更控制。
