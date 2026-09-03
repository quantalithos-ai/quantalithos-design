# Step 7. 核心能力闭环

## 1. Step 状态

| 当前模块 | gate_status | gate_reason | next_allowed_action | source_files |
|---|---|---|---|---|
| `capability_loop_definition` | pass | 5 个核心能力节点、逻辑顺序、进入 / 退出条件、owner 边界和 Step 8~14 停审清单已收敛 | 进入 Step 8 用户故事 | `00_req_step_02_position_boundary.md`;`00_req_step_04_goals_non_goals.md`;`00_req_step_06_consumers_dependencies.md` |

### 1.1 Step 内计划

- [x] 读取需求 SOP Step 7 与书写规范 §4.7。
- [x] 先回答仓存在必要性,不从 draft 功能编号反推能力。
- [x] 将 draft 6 节点校准为规范建议范围内的 5 节点闭环。
- [x] 为每个节点定义能力成立描述、逻辑前置、进入 / 退出条件和 owner 边界。
- [x] 建立 Step 8~14 固定逐节点顺序与停审条件。
- [x] 区分核心、外围增强和边界外能力。
- [x] 后置映射 draft 功能主题并完成接口 / 实现泄漏审计。

## 2. 本步输入

| 输入 | 本步使用 |
|---|---|
| Step 2 | 静态镜像资产与构建供给不可替代性 |
| Step 4 | G-MI-001~007 current outcome 与 NG-MI-001~015 |
| Step 6 | mapping、component、seed、builder、Artifact、member-service 等依赖和失效边界 |
| draft/03 | 6 节点候选与功能主题,仅作后置映射 |

## 3. SOP 问题回答

1. 没有本仓,系统缺什么不可替代能力?

   回答:缺少一个能把正式 Role 映射、多来源 pinned 静态输入、构建候选、digest / provenance / eligibility 和可实例化供给入口串成单一可归责链的 owner。

2. 本仓成立必须共同具备哪些能力?

   回答:受控定义、完整装配与派生基线、可追溯构建候选、可验证 provenance / eligibility、显式供给 / 回滚与可实例化入口五项必须共同成立。

3. 哪些能力缺一个仓就不成立?

   回答:五项均不可缺。没有定义会 hardcode;没有装配基线会输入漂移;没有构建候选会停留在模板;没有 provenance / eligibility 会无法安全发布;没有供给入口则下游无法实例化。

4. 哪些只是外围增强?

   回答:多架构、特殊收缩 variant、快速安全补丁通道、加固基础镜像和使用分析。

5. 哪些根本不属于本仓?

   回答:Role / tool / runtime / member / Artifact / container / sandbox / governance / observability / marketplace / product truth,详见 NG-MI-001~015。

6. 核心能力应拆成什么顺序?

   回答:C-MI-1 定义可识别 -> C-MI-2 装配与派生基线完整 -> C-MI-3 构建候选可追溯 -> C-MI-4 provenance 与 eligibility 可验证 -> C-MI-5 供给 / 回滚 / 入口可消费。

## 4. 当前文档问题诊断

| 候选结构 | 问题 | 当前处理 |
|---|---|---|
| draft 6 节点把“装配定义”和“镜像域版本派生”拆开 | 两者在需求层都回答候选构建基线是否完整,容易在 Step 8~14 重复故事 / 规则 | 合并为 C-MI-2“装配与派生基线完整” |
| nightly / event 作为独立能力节点 | 触发来源不是仓存在的独立能力 | 作为 C-MI-3 的进入条件 |
| Artifact handoff 作为发布步骤 | 容易把通用 Artifact 生命周期并入本仓 | 作为 C-MI-4 eligibility 可解释的条件 seam |
| manifest 查询作为单独能力 | 容易按接口而非结果拆分 | 纳入 C-MI-5 可实例化供给入口 |
| scan / sign / BOM 作为节点 | evidence kind authority 未闭合 | 纳入 C-MI-4 的“正式适用门禁”条件 |

## 5. 改动前后对比

| 维度 | draft 候选 | 当前正式 Step 7 结论 |
|---|---|---|
| 核心节点数 | 6 | 5,符合需求规范建议并去除重复语义 |
| C2 / C3 | 装配与版本派生分开 | 合并为完整、pinned、不可原地改写的装配 / 派生基线 |
| 触发 | 独立构建动作倾向 | C3 的进入来源,不等于能力本身 |
| 证据 | digest/provenance + pending kinds | 保持,但只正式适用 gate 才进入 eligibility |
| 供给 | publish / rollback / manifest | 统一为 C5 的 availability 与 instantiability 结果 |

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 按 CI pipeline 步骤拆 7~10 节点 | 操作直观 | 混入实现与具体 evidence 工具 | 不采用 |
| 保留 draft 6 节点 | 方向完整 | C2 / C3 在需求小循环中重复 | 不采用 |
| 5 节点资产供给闭环 | 每节点有独立成立条件,可驱动 Step 8~14 | 后续架构仍需细拆模块 | 采用 |

## 7. 结构化中间产物

### 7.1 仓存在必要性

`L2-member-images` 的不可替代性不在于“执行一次容器构建”,而在于让一个 Role 的静态运行环境从定义来源、pinned 装配、构建候选、digest / provenance / eligibility 到可实例化供给入口保持同一条可归责链。任何一段缺失,本仓都会退化为脚本集合、registry 标签目录、下游私有映射或通用 Artifact 的影子仓。

### 7.2 核心能力闭环定义

五个能力必须共同成立:镜像资产先有受控且不 hardcode 的 variant / persona 定义;随后形成完整、pinned、与 live state 隔离的装配与派生基线;基于该基线形成带完整输入快照和明确结果的构建候选;候选输出具备 digest / provenance 和正式适用 eligibility 解释;最后才能形成显式可用性、回滚 / retire 语义和下游可验证的 pinned 入口。

### 7.3 核心能力闭环图

```text
[C-MI-1] 镜像 variant / persona 定义能够受控成立
  -> [C-MI-2] 静态装配与派生基线能够完整、pinned 且可归责
  -> [C-MI-3] 构建候选能够由确定输入形成并保留可追溯结果
  -> [C-MI-4] 候选输出的 digest / provenance / eligibility 能够被验证
  -> [C-MI-5] 供给可用性、回滚与可实例化入口能够显式成立
```

本图只表示能力成立的逻辑依赖关系,不表示 API 时序、事件传播、CI 步骤或实施顺序。

### 7.4 能力节点定义

| 节点 | 能力成立描述 | 进入条件 | 退出条件 | 本仓 owner | 外部 owner / pending |
|---|---|---|---|---|---|
| `C-MI-1` 受控定义 | image family / variant 与 persona 装配身份可被稳定识别,并回指正式 Role mapping 来源 | mapping 来源存在且可验证 | variant 定义明确、来源 resolved;missing / stale / conflict 显式 | variant / persona 镜像域定义与 mapping 消费状态 | RoleDefinition / mapping definition 归 method;exact surface `MI-UP-003` |
| `C-MI-2` 装配与派生基线 | member / runtime / tools / extras / seed 的静态输入全部 pinned,base -> variant 派生和修订历史可解释 | C1 有效 variant;所需 refs 可解析 | 完整装配基线成立;缺失 / mutable / live-state input 被拒绝 | 装配清单、pin、seed placement、variant revision / derivation | 组件发布 / seed 正文 / Artifact truth 外置;`MI-UP-002/006/007` |
| `C-MI-3` 构建候选 | nightly 或获准输入形成唯一构建意图,每次 attempt 有完整输入快照和候选输出 / 失败 / unknown | C2 基线完整;触发来源获准 | 候选 digest/ref 或明确失败状态可追溯;无伪造输出 | build intent / attempt / input snapshot / candidate binding | scheduler / builder / registry truth 外置;event schema `MI-UP-005` |
| `C-MI-4` provenance 与 eligibility | 候选 digest 与完整输入 provenance 绑定,正式适用证据和 Artifact handoff 状态可解释 | C3 有候选输出 | eligibility eligible / blocked / pending 有充分来源;门禁不可绕过 | digest / provenance binding、镜像域 eligibility 判定 | evidence body / policy / Artifact truth 外置;`Q-MI-004`,`MI-UP-007` |
| `C-MI-5` 供给与实例化入口 | 只有符合 C4 条件的版本进入 availability;publish / rollback / retire 显式;提供 pinned 入口 | C4 eligibility 满足;consumer seam 可判定 | availability 与 manifest / variant / ref 一致;下游决定不反写 | 镜像供给 availability、rollback / retire、入口语义 | member-service lifecycle 外置;exact contract `MI-UP-001`;outbound event `MI-UP-009` |

### 7.5 Step 8~14 固定执行顺序与停审清单

| 顺序 | 节点 | 每个后续 Step 的能力级停审必须证明 |
|---:|---|---|
| 1 | C-MI-1 | 故事 / 功能 / 规则 / 数据 / 接口 / NFR / AC 只围绕受控定义,不吸收 mapping truth |
| 2 | C-MI-2 | 静态装配、pin、seed placement、revision / derivation 完整,不混 live state / Artifact truth |
| 3 | C-MI-3 | trigger、input snapshot、candidate / failure / unknown 可区分,不拥有 builder truth |
| 4 | C-MI-4 | digest / provenance、适用 evidence、eligibility 可追溯,不伪造 evidence / Artifact result |
| 5 | C-MI-5 | availability / rollback / retire / pinned entry 成立,不声明容器或下游 observed truth |

执行纪律:Step 8~14 的每个文件均按 C-MI-1 -> C-MI-5 顺序逐节点记录停审;全部节点完成后再做当前 Step 的跨节点审计。

### 7.6 能力层级划分

| 分类 | 内容 |
|---|---|
| 核心能力闭环 | C-MI-1 受控定义;C-MI-2 装配与派生基线;C-MI-3 构建候选;C-MI-4 provenance / eligibility;C-MI-5 供给与可实例化入口 |
| 外围增强能力 | 多架构 variant、特殊收缩 variant、安全补丁快速通道、加固基础镜像、只读使用分析 |
| 边界外能力 | Role / tool / runtime / member / Artifact / container / sandbox / governance / observability / marketplace / product truth 与 infrastructure product 本体 |

### 7.7 draft 功能主题回填映射

| 当前节点 | draft 功能主题 | 处理 |
|---|---|---|
| C-MI-1 | variant 目录、mapping 消费、persona 装配身份 | 保留方向,Step 9 重新编号 |
| C-MI-2 | component pin、extras、seed、revision / derivation | 合并重复节点,Step 9 重新拆外部可见行为 |
| C-MI-3 | nightly / event trigger、build handoff / record、compatibility gate candidate | compatibility owner pending,不预设 positive |
| C-MI-4 | digest / provenance、policy-required evidence、Artifact handoff | evidence kind / image handoff 保持 conditional |
| C-MI-5 | publish / rollback / retire、manifest / variant / ref supply | exact consumer / outbound event 保持 pending |

## 8. 回填草稿

正式 00 §7 使用闭环定义短文、5 节点 ASCII 图和能力层级表。节点定义表可保留 owner / pending 摘要;功能主题映射只留在校准材料,不提前进入正式能力章节。

## 9. 待确认事项

| ID | 所属节点 | 当前限制 |
|---|---|---|
| `MI-UP-003` | C1 | exact mapping surface pending |
| `MI-UP-002/006/007` | C2 | component / seed / Artifact handoff pending |
| `MI-UP-005` | C3 | event schema pending;nightly 不受影响 |
| `Q-MI-004` | C4 | evidence kinds conditional;digest / provenance current |
| `MI-UP-001/009` | C5 | consumer contract / outbound event authority pending |

## 10. 进入下一步条件

| 检查项 | 结果 |
|---|---|
| 是否说明仓存在必要性 | pass |
| 核心节点是否在规范建议 3~5 个范围 | pass;5 个 |
| 每节点是否有进入 / 退出条件和 owner 边界 | pass |
| 是否预留 Step 8~14 逐节点停审 | pass |
| 是否混入接口、事件名、字段、CI 步骤或实施顺序 | no |
| 外围与边界外能力是否移出主图 | pass |

`gate_status = pass`;允许创建 Step 8,不得跳到 Step 9 或修改正式 00。
