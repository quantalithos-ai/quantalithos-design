# L1-process 07 实施计划 Step 1: 确认实施输入边界

> 所属流程: `07_implementation_plan_calibration_flow.md`
> 对应正式文档: `projects/L1-process/07-实施计划.md` §1 与上游文档的关系声明
> 状态: `[x] 已完成`
> 日期: 2026-06-06

---

## 1. Step 状态

| 项 | 内容 |
|---|---|
| Step | Step 1 |
| 主题 | 确认实施输入边界 |
| 当前状态 | `[x] 已完成` |
| 是否修改正式 `07-实施计划.md` | 否 |
| 产物位置 | `projects/L1-process/design-calibration/07_implementation_plan_step_01_input_boundary.md` |

本步确认 L1-process 的 `00/01/02/03/04/05/06` 是否足以生成实施计划。本步不补详细设计字段、状态、DTO、trait、配置 schema 或测试用例。

## 2. 本步输入

| 输入 | 当前状态 | 本步使用方式 |
|---|---|---|
| `00-需求文档.md` | 已完成 | 提取 C-1~C-5、`FR-PROC-*`、`BR-PROC-*`、AC / VF 和非目标 |
| `01-架构设计.md` | 已完成 | 提取职责边界、依赖方向、唯一编译期依赖和跨仓协作红线 |
| `02-概要设计.md` | 已完成 | 提取主要组成部分、对象轮廓、接口骨架、处理流和状态集合 |
| `03-详细设计.md` | 已完成 | 作为实现契约、协议、对象、flow、状态、事务、错误、幂等和测试切口真相源 |
| `04-配置设计.md` | 已完成 | 提取 runtime config、profile、adapter binding、artifact / report root 和 redaction 规则 |
| `05-测试方案.md` | 已完成 | 提取 `TC-PROC-*`、`EV-*`、suite、fixture、gate、artifact 和 report 证据 |
| `06-验收标准.md` | 已完成 | 提取 P0 / P1 / P2、AC、VF、状态 / 事务 / no-write / evidence 红线 |
| 标准文档 | 已读取 | 约束 07 书写、讨论流程、目录、依赖裁剪、Rust 编码和可落码性复核 |

## 3. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 00~06 是否完整 | 是。当前具备需求、架构、概要、详细、配置、测试方案和验收标准。 |
| 哪些文档是本轮基线 | `projects/L1-process/00-需求文档.md` 到 `06-验收标准.md`,以及对应 `design-calibration/00~06` 中间产物。 |
| 详细设计是否足以支持实施计划 | 是。`03` 已定义 Rust 2024 workspace、7 个 crate、13 Command、11 Query、7 inbound event、10 outbound event、7 operations job、16 状态机和脚本契约。 |
| 测试方案和验收标准是否足以定义阶段门禁 | 是。`05` 给出 TC / EV / suite / artifact / report;`06` 给出 AC / VF / evidence / risk acceptance。 |
| 是否存在上游冲突 | 本步未发现阻塞 07 生成的冲突。旧 README 中 Python / PG 描述不作为本轮实现真相源。 |
| 设计闭环是否可作为开工门禁 | 是。每个 phase / commit boundary 仍必须按 `设计真相源闭环与可落码性标准.md` 复核字段、DTO、状态、idempotency、projection、artifact 和 phase boundary。 |
| 哪些缺口可继续 | 目标实现仓存在性、core baseline hash、P1 real-like adapter 可用性、性能硬阈值属于实施前置或风险项,不阻塞 07 文档生成。 |

## 4. 结构化中间产物

### 4.1 实施输入边界表

| 上游文档 | 本计划如何使用 | 状态 | 风险 |
|---|---|---|---|
| `00-需求文档.md` | 确定 C-1~C-5、功能、规则、非目标、AC / VF 方向 | 已确认 | 无阻塞 |
| `01-架构设计.md` | 确定 L1-process 边界、唯一编译期依赖、跨仓协作方式 | 已确认 | 不得采用 README 旧技术栈 |
| `02-概要设计.md` | 确定组成部分、接口骨架和状态轮廓 | 已确认 | 不替代 `03` 字段级契约 |
| `03-详细设计.md` | 作为 1:1 落码真相源 | 已确认 | phase 开工前仍需逐 boundary 复核 |
| `04-配置设计.md` | 作为 config profile、runtime builder、secret、path 和 failure mode 输入 | 已确认 | staging / production-like 不进 P0 |
| `05-测试方案.md` | 作为阶段测试门禁和证据归档输入 | 已确认 | evidence index schema 可在实现中细化,不得改 EV 语义 |
| `06-验收标准.md` | 作为完成判定、一票否决和风险接受输入 | 已确认 | 验收裁决不由 07 代替 |

### 4.2 设计闭环复核表

| 闭环复核项 | 来源 | 当前状态 | 阻塞范围 | 处理 |
|---|---|---|---|---|
| 字段闭环 | `03` Step 6 / 8 / 17 | 可制定计划 | 每个 commit boundary | 开工前复核;冲突则暂停 |
| DTO 构造闭环 | `03` Step 8 / 9 / 17 | 可制定计划 | contracts / API / worker / jobs | 开工前复核 |
| 状态闭环 | `03` Step 10、`05`、`06` | 可制定计划 | domain / service / jobs | 覆盖 16 状态机 |
| transaction / idempotency | `03` Step 11 / 13 | 可制定计划 | all writes | 每个写路径同 UoW 复核 |
| query no-write | `03` Step 9 / 11、`06` §8 | 可制定计划 | all queries / projection | Query 阶段专项门禁 |
| artifact / report | `03`、`05`、`06` | 可制定计划 | scripts / release | PH-01 建骨架,PH-10 收口 |

### 4.3 允许继续结论

当前输入足以继续制定 `07-实施计划.md`。实施计划不得修改 `00~06` 的 truth;实现阶段若发现字段、DTO、状态、测试或 phase boundary 不闭合,必须暂停对应 boundary,回写设计真相源后再继续。

## 5. 回填草稿

```markdown
## 1. 与上游文档的关系声明

> 校准来源:
> - `design-calibration/07_implementation_plan_step_01_input_boundary.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“实施输入边界表”“设计闭环复核表”和“允许继续结论”小节。

本实施计划承接 `00-需求文档.md`、`01-架构设计.md`、`02-概要设计.md`、`03-详细设计.md`、`04-配置设计.md`、`05-测试方案.md` 和 `06-验收标准.md`。其中 `03-详细设计.md` 是直接实现输入,`05-测试方案.md` 和 `06-验收标准.md` 分别定义阶段测试门禁和实施完成判定。

本文不重新定义需求、架构、对象、协议、配置 schema、测试用例或验收门禁。若实施过程中发现上游设计缺口,必须暂停对应 phase / commit boundary,回写相应文档并固定新的 design baseline 后再继续。
```

## 6. 进入下一步条件

- 上游输入基线明确。
- 未发现阻塞 07 生成的文档缺口。
- 旧 README 技术栈不作为本轮实施输入。
