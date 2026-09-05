# Step 1. 确认验收输入边界

> 对应 SOP：standards/document/验收标准讨论流程_SOP.md Step 1
> 回填章节：06-验收标准.md §1
> 粒度参考：projects/L1-governance/design-calibration/06_acceptance_step_01_input_boundary.md

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 1 确认验收输入边界 |
| 当前状态 | 已完成；本轮连续授权并保留独立停审记录 |
| 输入基线 | 当前正式 00~05、验收标准 SOP / 书写规范、设计真相源闭环标准 |
| 输出文件 | projects/L2-member/design-calibration/06_acceptance_step_01_input_boundary.md |
| 测试执行 / 真实验收 | 未开始；本 Step 不生成 run、artifact、report、EV 或 verdict |

## 2. 本步目标

确认正式 06 承接哪些需求、设计、配置、测试、交付和证据输入，并把旧 06 与不稳定兄弟边界隔离为历史 / blocker。验收标准只定义裁决门禁，不重新发明需求、协议字段、实现步骤或测试结果。

## 3. 本步输入

| 输入 | 权威级别 | 本 Step 用途 | 限制 |
|---|---|---|---|
| 00-需求文档.md | 当前正式需求 | C-L2M-1~5、FR / BR / NFR、AC-L2M-001~033、VF-L2M-001~009、数据归属和非目标 | 不改写需求 |
| 01-架构设计.md | 当前正式架构 | BC01~BC07、owner、依赖裁剪、local-truth-first 和红线 | 不重选架构 |
| 02-概要设计.md | 当前正式概要 | CP01~CP07、对象 / 接口 / flow / state 骨架 | 不新增主要组成部分 |
| 03-详细设计.md | 当前正式详细设计 | 七模块、34 对象、10 Command、16 Query、14 Consumer、24 blocked candidate、5 Job、28 状态主语、UoW / replay / redaction | 不补缺失 helper 或外部 truth |
| 04-配置设计.md | 当前正式配置设计 | profile、source priority、validation、slot、degradation 和下游承接 | 不写配置执行结果 |
| 05-测试方案.md | 当前正式测试方案 | TC / DS / suite / gate / EV schema、路径、进入退出和 residual | 不把 planned 变成已执行 |
| 验收 SOP / 书写规范 | normative authority | 15 Step 顺序、证据闭环、三值结论和章节主链 | 不产生项目事实 |
| 旧 README / 旧 06 | historical material | 污染审计 | 不继承旧 persona、endpoint、AG-UI、UDS、launch token、旧 P95 或旧结论 |

## 4. SOP 问题回答

| 问题 | 回答 | 依据 |
|---|---|---|
| 本轮验收依据哪些需求和设计？ | 依据当前正式 00~05；需求和设计是唯一项目真相源，calibration 只解释收敛过程。 | 00~05 元信息与各自 flow |
| 哪些测试证据支撑裁决？ | 由 05 的 TC-L2M-*、规划 EV-L2M-* / EV-CAND-L2M-*、suite 报告和固定 artifact/report 路径支撑；当前没有证据实例。 | 05 §6、§9、§13 |
| 哪些交付、环境和数据要在后续固定？ | implementation commit / build / image、Core source ref、profile、config digest、fixture set、非 latest 的 run_id、artifact / report pair 和 acceptance handoff。 | 05 §8、§12、§13 |
| 哪些内容不应写入 06？ | 测试步骤全文、fixture 实现、CI 脚本、commit 排期、部署 runbook、具体 transport / IPC、外部 owner 内部状态和测试执行结果。 | 06 SOP §1~§15；03 非范围 |
| 当前是否有阻塞？ | 不阻塞 06 的设计级门禁编写；但 L2M-UP-001~008、L2M-DDD-001~007、scope_supersede_gap 阻塞受影响正向资格、真实证据和最终 readiness。 | 项目台账 §5 |

## 5. 当前文档问题诊断

| 材料 | 问题 | 处理 |
|---|---|---|
| 旧 06-验收标准.md | 围绕旧 persona / endpoint 和泛化 API / DB 证据，缺少当前 15 章主链 | Step 15 先删除再 full-restart 重建 |
| 05-测试方案.md | 有 planned suite / EV schema，但无真实 run | 06 只引用候选入口和固定路径，不宣称已执行 |
| 兄弟项目 | host、image、Runtime、Core/Bus member-specific seam 未全部闭合 | 作为 blocker / residual；只验本仓接缝和负向语义 |

## 6. 改动前后对比

| 项 | 改动前 | 改动后 | 理由 |
|---|---|---|---|
| 输入权威 | 旧 06 + 泛化环境 | 当前正式 00~05 + normative standards | 防止历史主线污染 |
| 证据 | API / DB / trace 等泛称 | TC / EV candidate + fixed path + raw pairing | 可复核、可落证 |
| 外部边界 | 容易把下游成功写成本仓成功 | 只接收 typed ref、safe view、attempt、gap、blocked | 保持 owner truth |

## 7. 验收裁决取舍

| 议题 | 方案 | 结论 |
|---|---|---|
| 直接修改旧 06 还是重建 | 小修旧文档 / 删除重建 | 采用删除重建，旧内容只作污染输入 |
| 当前是否填真实 run_id | 填预测值 / 留待送验固定 | 留待送验固定，不伪造 |
| 是否把测试用例全文复制进 06 | 全量复制 / 只引用 TC、EV、report | 只引用，06 保持裁决文档 |

## 8. 结构化中间产物

### 8.1 验收输入映射

```text
00 需求与 AC/VF
  -> 01 架构 owner / redline
  -> 02 CP / object / flow skeleton
  -> 03 field / protocol / state / tx / error contract
  -> 04 config / availability / redaction contract
  -> 05 TC / EV / report / residual
  -> 06 acceptance gate and decision rule
```

### 8.2 不得进入正式 06 的事实

| 类型 | 处理 |
|---|---|
| 真实测试结果、artifact、report、EV 实例 | 未生成；执行后由固定 run 提供 |
| host accepted、Runtime executed、Bus delivered、observed、image ready | 外部 truth；本仓只记录 local attempt / gap / blocked |
| LLM / plan / memory / checkpoint / tool execution / capability registry | 明确非范围 |
| transport、topic、route、IPC、credential body、固定端口 | owner contract 未闭合或不属本仓 |

## 9. 回填草稿

正式 06 §1 必须声明：承接当前正式 00~05，旧 06 仅为 historical material；06 只定义验收裁决，所有真实基线和证据必须在后续 Step 3 / 执行阶段固定。

## 10. 待确认事项

| 事项 | 影响 | 当前处理 |
|---|---|---|
| implementation / Core source ref | 影响送验基线 | 保留占位，验收前固定 |
| 上游 exact contract | 影响 P1 / selected seam | 保持 blocker，不补 schema |
| 真实 evidence | 影响最终裁决 | 只能由执行产物生成 |

## 11. 进入下一步条件

- [x] 当前正式输入与 historical material 已分层。
- [x] 06 不重新定义需求、设计、测试或实现。
- [x] blocker 的影响范围和事实等级已明确。
