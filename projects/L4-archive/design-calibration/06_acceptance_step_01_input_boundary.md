# Step 1. 确认验收输入边界

> 对应 SOP：`standards/document/验收标准讨论流程_SOP.md` Step 1\
> 正式回填：`06-验收标准.md` §1\
> 日期：2026-09-13\
> 状态：`completed / design_inputs_ready_delivery_evidence_absent / continue_authorized`

## 1. Step 状态与 Step 内计划

| 项 | 结论 |
|---|---|
| 当前 Step | Step 1：确认验收输入边界 |
| 目标 | 固定需求、设计、配置、测试、送验与证据输入，区分“可设计”与“可实际裁决” |
| gate_status | `completed / design_inputs_ready_delivery_evidence_absent` |
| gate_reason | 正式 00～05 足以设计 06；交付版本、环境、数据、fixed run、raw/report/handoff 均不存在，必须作为未来送验前置而非当前事实 |
| next_allowed_action | 按连续授权创建并完成 Step 2 |
| source_files | 正式 00～05；05 Step 5/6/12～15；验收 SOP/规范；通用中间产物、真相源、依赖裁剪标准；L1-governance/artifact/workspace 06 粒度样本 |

| 计划项 | 产物 | 状态 | 完成门禁 |
|---|---|---|---|
| 1A | 正式输入与 authority 清点 | done | 00～05 状态、分母和所有权一致 |
| 1B | 交付/环境/数据/证据输入清点 | done | 存在与不存在逐项区分 |
| 1C | historical 06 污染诊断 | done | 旧对象、阈值、角色和证据不继承 |
| 1D | 必须回答/不回答问题 | done | 06 不改需求、测试、实现或 owner truth |
| 1E | blocker 与验收影响审计 | done | 设计继续；实际送验 fail-closed |

## 2. 本步输入

| 输入 | 状态 | 本 Step 使用 | 禁止解释 |
|---|---|---|---|
| 正式 `00-需求文档.md` | formal / stop_review | A1～A9、F-AR-001～009、BR-AR-001～012、NFR、五类否决源、AR-UP-001～009 | 不把需求级方向当验收通过事实 |
| 正式 `01-架构设计.md` | formal / stop_review | 六 U、source-authority、compile/runtime/event/ref/adapter/fake、所有权和 external seam | 不修改依赖类型或选择 provider |
| 正式 `02-概要设计.md` | formal / stop_review | 六 CP、26 对象、30 logical entries、流程/状态/异常轮廓 | 不新增对象、接口或统一成功状态 |
| 正式 `03-详细设计.md` | formal / stop_review | 6 crates、8 services、7 ports、30/32 surfaces、18 states、UoW/错误/幂等/恢复 | 不补造上游 schema、port、state 或 effect |
| 正式 `04-配置设计.md` | formal / stop_review | 12 域/55 P0 keys、6 profiles、strict source、assembly 与 failure/redaction | 配置存在不等 capability ready 或通过 |
| 正式 `05-测试方案.md` | formal / stop_review | 18 CUT、102 TC、26 DS、13 suites、5 gates、14 scripts、19 EV family、报告/证据 schema | planned 项不等实现、运行或证据实例 |
| 送验 build/commit/image | absent | Step 3 定义必须固定的字段 | 不发明路径、hash、baseline 或实现仓 |
| 验收环境/配置/数据 | absent | Step 3/4 定义进入条件 | 不把文档 profile、fake 或示例当真实环境 |
| fixed run raw/report | absent | Step 3/10 定义固定路径和配对 | 不创建 `run_id`、digest、artifact/report 或 EV instance |
| acceptance handoff/veto/risk files | absent | Step 10/14 定义送验包 | planned 路径不等已生成、已审查或已签署 |

## 3. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 本轮验收依据哪些需求和设计？ | 只依据当前已停审的正式 00～05；其中 00 定义需求/红线，01～04 定义所有权、协议、状态、事务和配置，05 定义测试与证据合同。 |
| 哪些测试证据支撑裁决？ | 未来同一 fixed `<run_id>` 下 19 个 `EV-AR-*` family 的真实实例、102 TC raw、suite/gate report、redaction/dependency/report/blocked-lane checks；当前实例全部为 0。 |
| 哪些交付、环境和数据成为基线？ | 必须由未来送验明确 immutable implementation revision/build、design revision、config identity、profile、environment/target manifest、owner/provider conformance vectors、26 DS 或其真实构造身份；当前均未固定。 |
| 哪些属于 05 或 07？ | 如何测试/构造/运行/产证据归 05；实现顺序、文件/commit boundary、脚本与目标仓归 07；06 只定义裁决门禁和签署规则。 |
| 是否有阻塞 06 生成的上游缺口？ | 没有阻塞“设计 06”的新缺口；18 项持续 blocker/pending 阻塞相关 formal positive AC 和实际完整验收，不能由 06 自行关闭。 |

## 4. 当前文档问题诊断

| 旧正式 06 内容 | 问题 | 本轮处置 |
|---|---|---|
| `ArchivedSnapshot`、`ArchiveRecord`、`ArchiveIndex`、timeline/RCA 主线 | 与正式 request/job、source binding、Bundle/manifest、assessment、placement/lifecycle、restore handoff 对象不一致 | 全部作为 historical vocabulary 删除，不保留 alias |
| hot/warm/cold storage、test/staging 环境已具备 | provider、tier 和环境均未确认 | 改为 future exact target manifest；当前 absent/blocked |
| 100%、P95 `<3s`、成功率/可用率 | 无 workload、方法、窗口、owner authority | 删除固定数字；结构性 P0 与 measured P2 分开 |
| API/DB/log/digest 即证据 | 没有 fixed run、TC/EV、raw/report pairing 或 qualification | 只接受 05 §13 定义的真实证据链 |
| Owner/TL/QA/SRE 泛化签署 | 未定义职责、authority、scope 或风险接受边界 | Step 14 定义责任角色；当前姓名/签署均 unset |
| “A 视情况放行” | 可能让 P0/红线绕过 | Step 12/13 按 VETO、S/A/B/R 和完整证据严格裁决 |

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 理由 |
|---|---|---|---|
| 验收主语 | snapshot/index/ticket/review | A1～A9、F1～F9 与六 CP | 对齐正式需求与设计 |
| 输入 | 02/03/05 松散引用 | 00～05 + delivery/env/data/run/handoff 六类基线 | 裁决必须可重放 |
| 证据 | API/DB/log/compare | exact TC→raw→suite→EV→report→AC | 防口头/静态造证据 |
| 缺口 | “待定”但仍可打勾 | required P0 lane=`blocked`，实际送验不可进入/退出 | 保持 fail-closed |
| 结论 | `[待评审]` 单格 | 三值规则 + pre-entry `not_entered`（非 verdict） | 区分设计与裁决实例 |

## 6. 验收裁决取舍

| 议题 | 采用方案 | 未采用方案 | 理由 |
|---|---|---|---|
| 06 是否创建新测试用例 | 只消费 102 TC 和 19 EV | 为 AC 另建测试编号 | 05 是测试真相源 |
| external blocker 如何处理 | AC 保留 required，formal positive blocked；negative 边界仍验 | 删除、P1 化或 fake 替代 | 缺接缝不降低 P0 requiredness |
| 文档完成后的当前结论 | `acceptance_execution=not_entered`，无 verdict | 自动写“不通过”或“有条件通过” | 尚无送验对象，不能伪造裁决 |
| owner truth 如何验 | 验 Archive seam、ref、分类、无反写和正式 receiver result | 验 owner 内部实现或由 Archive 推断成功 | 不扩大本项目范围 |

## 7. 结构化中间产物

### 7.1 验收输入映射表

| 来源文档 | 验收输入 | 本文如何裁决 |
|---|---|---|
| 正式 00 | A1～A9、F1～F9、BR1～BR12、NFR、五类否决源 | §2/5/6/9/11 固定范围、功能、红线、NFR 和 VETO |
| 正式 01 | 六 U、authority、依赖类型、external seam、风险 | §6/7/13 裁决所有权、依赖、formal seam 与 residual |
| 正式 02 | 六 CP、26 对象、30 logical entries、流程/异常 | §5/7/8 固定能力、协议与 phase 分母 |
| 正式 03 | 6 crates、8 services、7 ports、32 methods、18 states、UoW/幂等/effect | §5～§9 将代码契约转为 AC 的通过/失败条件 |
| 正式 04 | 12 配置域、55 P0 keys、profile/binding/failure | §3/4/9 裁决 config identity、P0 capability 与 fail-closed |
| 正式 05 | 102 TC、19 EV、固定路径、entry/exit、defect/regression | §3～§14 固定证据、VETO、缺陷、风险和结论聚合 |
| delivery/env/data/run/handoff | future actual input | 缺任一 required baseline 则不可进入或不得通过 |

### 7.2 本文必须回答与不再回答

| 类别 | 06 必须回答 | 06 不回答 |
|---|---|---|
| 裁决 | 每个 P0 AC 的 pass/fail、VETO、三值聚合 | 需求是否应存在、实现怎么写、测试怎么执行 |
| 证据 | exact TC/EV/report/raw 路径和真实性条件 | 生成脚本实现、真实运行结果 |
| 风险 | 哪些可接受、authority/字段/期限要求 | Archive 自行接受治理/安全/owner 风险 |
| 签署 | 哪些职责必须确认、签署代表什么 | 预填姓名、日期、结论或 readiness |

### 7.3 当前事实表

```text
delivery_baseline = 0
environment_baseline = 0
data_baseline = 0
test_run = 0
test_artifact = 0
test_report = 0
evidence_instance = 0
defect_instance = 0
acceptance_verdict = 0
risk_acceptance = 0
signoff = 0
readiness = 0
```

## 8. 复杂度判断

Step 1 涉及六份正式项目文档、外部送验输入和旧 06 污染，但不需要拆附属文件。后续 Step 5～11 将按验收项小循环展开；本 Step 不提前分配 AC/VETO 编号。

## 9. 回填草稿

正式 §1 应列出 00～05 如何分别进入裁决，明确 delivery/env/data/run/handoff 仍是未来输入，说明 06 不重定义需求、设计、测试、owner truth 或实施任务；旧 06/README/draft 仅为 historical material。正文必须声明当前没有验收实例或三值结论。

## 10. 对上游影响与待确认事项

| 项 | 结论 |
|---|---|
| 00～05 回写 | 无；本 Step 未发现正式命名、分母或证据 schema 冲突 |
| 新 owning-project blocker | 无 |
| 持续 blocker/pending | `AR-UP-001～009`、`AR-ARCH-001`、`AR-HLD-Q-001～002`、`AR-03-LOCAL-001～006` |
| future actual inputs | implementation revision/build、env/config/data identity、formal vectors、fixed run、acceptance package、signatories |

## 11. 进入 Step 2 条件

- [x] 正式输入与 historical material 已分离。
- [x] 设计输入可用、实际送验输入不存在的状态已显式记录。
- [x] 06 必须回答和不得回答的问题可判定。
- [x] 持续 blocker 已转为验收影响，不由本 Step 关闭。
- [x] 未生成 run、证据、结论、风险接受或签署事实。

当前 `gate_status`：`completed / design_inputs_ready_delivery_evidence_absent`。

`next_allowed_action`：按连续授权创建并完成 Step 2。
