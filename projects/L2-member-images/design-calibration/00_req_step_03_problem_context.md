# Step 3. 背景与问题定义

## 1. Step 状态

| 当前模块 | gate_status | gate_reason | next_allowed_action | source_files |
|---|---|---|---|---|
| `problem_classification` | pass | 业务、治理与技术问题已分层;问题描述未夹带实现方案或无 authority 数字 | 进入 Step 4 目标与非目标 | `00_req_step_02_position_boundary.md`;ADR-0005;`draft/05_旧材料差异审计与待确认.md` |

### 1.1 Step 内计划

- [x] 读取需求 SOP Step 3 与书写规范 §4.3。
- [x] 从仓定位推导“没有本仓会发生什么”,不从旧功能清单反推问题。
- [x] 区分业务问题、治理 / 归属问题和技术一致性问题。
- [x] 删除旧冷启动、镜像大小、成功率、时限等无 current measurement authority 数字。
- [x] 形成问题表、因果关系、回填草稿和方案泄漏审计。

## 2. 本步输入

| 输入 | 对问题定义的贡献 |
|---|---|
| Step 2 定位 | 静态镜像资产 / 供给事实必须与运行态和通用 Artifact truth 分离 |
| ADR-0005 | 运行时现装不是目标路径;Role 环境须在构建期预置 |
| method-library / tools / runtime 正式边界 | 映射、工具合同、运行循环已有 owner,镜像仓只能消费 |
| artifact 正式边界 | 构建产物可追溯不能靠复制 Artifact version / lineage truth |
| member-service pending 输入 | 下游需要正式 pinned image ref / manifest,但 exact contract 未闭合 |
| historical audit | 旧文档存在固定 Role / 工具 / 产品 / 数字污染 |

## 3. SOP 问题回答

1. 当前业务背景是什么?

   回答:AI Member 以 Role 对应的受控运行环境启动。运行环境由 member、runtime、tools、角色 extras 与 seed 模板等静态输入共同组成,且必须在成员实例化前形成可消费的 pinned 镜像入口。

2. 当前主要痛点或机会点是什么?

   回答:若没有独立 truth,Role 映射、组件版本、seed 落位、构建输入、输出 digest、provenance 和发布可用性会散落在脚本、registry 或下游编排中,导致无法证明“某个实例化入口由哪些受控输入派生”。

3. 问题能否量化?

   回答:当前只有 ADR 对构建期预装方向的裁决,没有可复用的 current measurement baseline。需求阶段用“每个可供给镜像必须有完整 pinned 输入与 digest / provenance 绑定”“任何未验证前置必须 fail closed”等可判定口径,不继承旧时延、大小、成功率或保留天数。

4. 哪些是业务问题,哪些是技术问题?

   回答:业务问题是成员环境无法稳定实例化和升级 / 回滚不可解释;治理问题是 Role 能力上限、供应链证据和 owner 边界无法归责;技术一致性问题是映射漂移、mutable input、构建结果与 digest / provenance 脱节以及 downstream ref 不可验证。

## 4. 当前文档问题诊断

| 旧问题表达 | 诊断 | 当前处理 |
|---|---|---|
| “冷启动必须达到某秒数” | ADR 中历史比较不是 current measurement contract | 保留“禁止运行时现装”方向,删除未复测数字 |
| “每天构建 9/9 Role 且 100% 成功” | nightly 有 authority,固定 9 和 100% 没有 | 问题改为 mapping 覆盖与失败可解释 |
| “需要 GitHub Actions / buildx / registry” | 把方案当问题 | 只描述构建输入输出与外部后端 seam |
| “需要扫描、签名、BOM” | 具体 evidence kind authority 未闭合 | 问题聚焦正式适用门禁证据不可缺失;种类 pending |
| “通知 member-service” | 假设出站事件和下游合同 | 问题聚焦可实例化入口不可验证;交付形态 pending |

## 5. 改动前后对比

| 维度 | 旧口径 | 当前口径 |
|---|---|---|
| 性能问题 | 固定时延 / 大小比较 | 构建期预装是 Accepted 方向;具体测量后移并需 evidence |
| 覆盖问题 | 固定 Role 数量 | 当前正式 mapping 集合与 variant 覆盖关系必须可解释 |
| 供应链问题 | 固定 scan / sign 步骤 | digest / provenance 主线 + 正式适用 evidence gate |
| 发布问题 | push / notify 步骤 | eligibility / availability / consumer ref 可解释 |
| 归属问题 | 本仓独立管理全部 image metadata | 镜像域 truth 与 Artifact / mapping / runtime owner 分层 |

## 6. 设计取舍

| 方案 | 结果 | 结论 |
|---|---|---|
| 以旧指标作为问题证明 | 看似可量化,但无 current run / baseline | 不采用 |
| 只描述 CI 故障 | 忽略 truth、owner 和下游可消费性 | 不采用 |
| 以“静态资产可归责、构建可追溯、供给可验证”为问题主轴 | 能支撑后续目标 / 能力 / 验收且不锁实现 | 采用 |

## 7. 结构化中间产物

### 7.1 背景结论

平台需要让一个 Role 对应的成员运行环境在实例化前完成受控装配。该环境不是单一二进制,而是多来源静态资产的组合;其选择、构建和供给必须可重复解释,同时不得把运行时 live state 或相邻仓 truth 固化为本仓正文。

### 7.2 问题清单

| ID | 类型 | 问题 | 影响 | 当前可判断边界 |
|---|---|---|---|---|
| `P-MI-001` | 业务 | 缺少唯一的成员镜像资产与供给 owner | 下游无法稳定判断哪个入口可实例化 | 必须有单一镜像域 truth,不由 CI / registry / member-service 拼接 |
| `P-MI-002` | 治理 | Role -> variant 映射可能在构建仓或下游被 hardcode | 定义漂移并形成第二映射真相 | 只能消费方法库正式映射;不可验证时阻断受影响路径 |
| `P-MI-003` | 技术一致性 | member / runtime / tools / extras 输入版本可能未固定或互相不兼容 | 同名镜像不可复现,权限上限不可解释 | 所有构建输入必须 pinned;兼容结果缺失时显式 pending / blocked |
| `P-MI-004` | 边界 | seed 模板与 live memory / workspace / policy truth 容易混写 | 静态镜像反向拥有运行态或治理 truth | 只承接模板 ref、版本与落位,不承载运行态 |
| `P-MI-005` | 供应链 | 构建输入、候选输出 digest 和 provenance 未形成稳定绑定 | 无法证明输出来自哪些受控输入 | 每个候选输出必须能回指完整输入快照和 digest / provenance |
| `P-MI-006` | 归属 | 镜像域修订 / availability 与 Artifact version / lineage / baseline 容易重复定义 | 出现通用制品双写源 | 本仓只持 Artifact 正式消费引用;image handoff 缺口显式 pending |
| `P-MI-007` | 下游协作 | 可实例化 manifest / variant / ref 缺少正式消费合同 | member-service 可能自行解析 mapping 或使用不可验证引用 | 只提供 pinned、可验证的正式入口;合同缺失时 launch 保守阻断 |
| `P-MI-008` | 运行可靠性 | nightly、变化输入、事件触发和构建失败语义可能被压成单一成功 / 失败 | 重复构建、未知结果或部分成功被误报 ready | 各触发来源和失败类别必须可区分;不可验证结果不进入 availability |
| `P-MI-009` | 事件边界 | 入站构建事件 schema 与出站事件 authority 均未闭合 | 事件可能被误当 truth 或反向创建无授权合同 | 只承接已验证入站意图;不定义无 authority 出站事件 |

### 7.3 问题因果关系

```text
多来源静态输入 + mapping / version / seed owner 分散
  -> 若无独立镜像域 truth
  -> 装配定义与构建输入不可稳定解释
  -> digest / provenance / eligibility 断链
  -> 下游只能猜测或自行解析可实例化入口
  -> 运行环境漂移、权限上限失真、回滚与审计不可归责
```

## 8. 回填草稿

正式 00 §3 先说明构建期预装背景,再以 `P-MI-001~009` 表描述业务、治理和技术一致性问题。正文明确当前没有 authority 支持旧固定时延 / 大小 / 成功率数字;问题的判断口径以完整 pin、owner 单一、digest / provenance 可回链和 fail-closed 为主。

## 9. 待确认事项

| ID | 对问题定义的影响 | 当前口径 |
|---|---|---|
| `Q-MI-002` 多架构 | 可能增加 variant / build 输入维度 | 不改变 P-MI-001~009 主问题,后续范围确认 |
| `Q-MI-004` evidence kinds | 影响具体供应链缺口分类 | 不改变 digest / provenance 断链问题 |
| `MI-UP-001/003/005/007` | 影响 exact consumer / event / handoff 验证 | 作为正向合同 blocker 保留 |

## 10. 进入下一步条件

| 检查项 | 结果 |
|---|---|
| 背景是否说明为什么值得做 | pass |
| 问题是否区分业务 / 治理 / 技术 | pass |
| 是否把解决方案写成问题 | no |
| 是否使用无 authority 数字 | no |
| 每个问题能否由后续目标 / 验收承接 | pass |

`gate_status = pass`;允许创建 Step 4,不得跳到 Step 5 或修改正式 00。
