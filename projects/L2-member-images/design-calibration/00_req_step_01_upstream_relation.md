# Step 1. 与上游文档的关系声明

## 1. Step 状态

| 当前模块 | gate_status | gate_reason | next_allowed_action | source_files |
|---|---|---|---|---|
| `source_authority_classification` | pass | normative authority、direct authority、pending sibling/input、historical material 已分层;冲突优先级和不可继承内容已明确 | 进入 Step 2 本仓定位与边界 | `00_requirements_calibration_flow.md`;本文件 §2;`draft/05_旧材料差异审计与待确认.md` |

### 1.1 Step 内计划

- [x] 读取需求 SOP Step 1、书写规范 §4.1 与项目 / 文档级台账。
- [x] 复核六份启动标准、全局依赖矩阵和 Accepted ADR-0005。
- [x] 复核 runtime、tools、method-library、artifact、sandbox、core、governance 正式链及台账状态。
- [x] 复核 member / member-service 当前校准材料,标记为 pending sibling input。
- [x] 复核 approved draft,但不直接继承结论。
- [x] 在独立判断形成后审计旧 README / 旧正式 00~06 的来源污染。
- [x] 形成来源映射、冲突优先级、回填草稿和自检。

## 2. 本步输入

| 输入组 | 具体输入 | 本步用途 |
|---|---|---|
| 写作 authority | 六份启动标准 | 决定 full-restart、Step 顺序、真相唯一、依赖裁剪和正式章节结构 |
| 架构 authority | 全局依赖矩阵、ADR-0005、仓库拆分方案相关条目 | 决定本仓在 Layer 3 的位置以及被明确裁决的镜像策略 |
| 已停审上游设计 | runtime 00~07、tools 00~07、sandbox 00~07 | 排除 runtime / tool / sandbox truth,限定静态资产边界 |
| 当前正式定义输入 | method-library 00~07、artifact 00~07、core 00~07 | 确认 Role mapping owner、Artifact owner 和 shared contract 类别 |
| 粒度参考 | governance 00~07,重点 02 §4~§5 | 只借鉴职责组成与分层检查方法 |
| pending sibling | member、member-service 当前 ledger / calibration | 记录方向和 blocker,不形成 exact contract |
| approved pre-00 input | draft/README 与 01~05 | 作为待重新验证的定位 / 能力假设 |
| historical material | 本仓旧 README、旧 00/01/02/03/05/06 | 后置差异审计,不得反推正式结论 |

## 3. SOP 问题回答

1. 本文基于哪些上游材料?

   回答:基于正式写作标准、全局依赖矩阵、ADR-0005、已完成或当前可引用的 runtime / tools / method-library / artifact / sandbox / core 正式设计链。governance 只提供粒度参考;member / member-service 未完成正式 00,只能作为 pending 输入。

2. 每份材料提供什么约束?

   回答:ADR 固定 nightly、一 Role 一镜像、映射归方法库、版本 pinned 和生产禁 `latest`;方法库固定 Role -> image variant 的定义 owner;Artifact 固定通用 Artifact truth / version / lineage / baseline / consumption ref owner;runtime / tools / sandbox 明确哪些运行、执行和隔离真相不归本仓;全局矩阵固定 compile / runtime / event 大方向。

3. 哪些内容可以直接承接,哪些必须重新推导?

   回答:只直接承接正式 authority 的 owner、依赖方向和 Accepted 裁决。具体 Role 清单、工具清单、CI / registry 产品、协议字段、性能数字、测试结果、实现状态均须重新推导或保持 pending。

4. 上游之间存在什么张力?

   回答:方法库已关闭 mapping owner,但 exact consumer surface 未闭合;Artifact 已定义通用消费引用,但 image handoff 条件未闭合;全局矩阵只授权消费镜像构建事件,没有授权本仓发布构建 / 发布事件;兄弟仓只给出 pinned manifest 消费方向,没有正式字段合同。

5. 旧材料与当前 authority 冲突时如何处理?

   回答:按“规范 / Accepted ADR / 当前正式 owner 文档 > pending sibling > approved draft > historical material”处理。旧材料不得覆盖较高层 authority,无 authority 的具体数字和技术选型一律不继承。

6. 未闭合输入是否阻塞需求文档?

   回答:不阻塞本仓定位、能力、fail-closed 行为和待确认项成文;会阻塞对应 positive contract、字段、协议、适配、联调、测试执行与 readiness 声明。

## 4. 当前文档问题诊断

| 问题 | 风险 | 本 Step 处置 |
|---|---|---|
| 旧 00 以上游旧版文档为前置 | 把已失效接口和数字当 current authority | 整体降为 historical,重建来源表 |
| draft 已获用户确认 | 容易误解为正式 truth 已闭合 | 明确只是 approved historical input,逐 Step 复核 |
| method-library 03 / 07 当前有工作区改动 | 把 dirty workspace 写成 immutable baseline / readiness | 只引用 formal owner 方向,不声明 baseline 或 readiness |
| artifact 07 尚待审 | 把 planned implementation 当已实现 | 只引用已形成的 owner / consumption ref 设计,实现事实保持未知 |
| member / member-service 同窗口推进 | 相互反向定义 exact contract | 只记录 pending 方向与 blocker ID |
| ADR 同时包含正式裁决和历史假设 | 固定 Role 数、工具清单、时延 / 大小数字回流 | 只继承 §2 / §6 可识别的 Accepted 约束 |

## 5. 改动前后对比

| 主题 | 旧 / 未校准口径 | 当前口径 |
|---|---|---|
| 上游集合 | 引用 2026-05 期旧文档 | 引用当前正式链与 current ledgers |
| sibling 合同 | 把旧 member-service 流程视作已定 | 仅保留 pinned manifest 消费方向,exact contract pending |
| Role 清单 | 固定 9 Role | 不在本仓固化枚举;只消费方法库映射 |
| Artifact | 本仓自有镜像版本 / BOM / release 体系 | 镜像域绑定归本仓;通用 Artifact truth 归 artifact,只持正式引用 |
| Bus | 默认通知下游 | 当前只确认入站事件消费;出站事件无 authority |
| 实现状态 | 文档叙事容易暗示已有 CI / registry | 全部实现、run、digest、evidence、readiness 均不作事实 |

## 6. 设计取舍

| 方案 | 优点 | 风险 / 缺点 | 结论 |
|---|---|---|---|
| 以旧正式 00 为 baseline 增量修补 | 工作量小 | 上游、对象、数字和实现假设污染严重 | 不采用 |
| 以 draft 直接生成正式 00 | draft 已收敛主要方向 | 跳过 SOP 独立验证,无法证明追溯 | 不采用 |
| full-restart,只把 draft / 旧文档作为后置审计输入 | 来源、owner、pending 和正式结论可分离 | 需要完整执行 17 Step | 采用 |

## 7. 结构化中间产物

### 7.1 来源分层表

| 层级 | 来源 | 可形成的正式结论 | 禁止推导 |
|---|---|---|---|
| normative authority | 六份标准、全局依赖规则 | 流程、依赖类型、truth / pending / blocker 纪律 | 具体业务 schema 或产品选型 |
| accepted architecture authority | ADR-0005 | nightly、一 Role 一镜像、方法库映射、pinned、生产禁 `latest` | 固定 Role 数 / 清单、具体工具清单、时延 / 大小、registry / CI 产品 |
| direct owner design | method-library、artifact、runtime、tools、sandbox、core 正式链 | owner / non-owner、消费方向、正式 reference 类别 | 对方实现 readiness、未闭口字段、产品 adapter |
| pending sibling input | member、member-service current calibration | 供给 / 装配方向与 fail-closed blocker | exact manifest / IPC / readiness 合同 |
| granularity reference | governance 正式 02 等 | 组成部分粒度与分层检查方法 | governance 对象、状态和部署形态 |
| approved pre-00 input | 本仓 draft | 待 Step 验证的候选定位 / 能力 / 模块 | 自动进入正式正文 |
| historical material | 本仓旧 README / 00~06 | 污染样本与遗漏线索 | current requirement、实现事实、验收事实 |

### 7.2 上游约束承接表

| 来源 | 本仓承接 | 当前限制 |
|---|---|---|
| ADR-0005 | 构建期预装、nightly、一 Role 一镜像、版本 pin、禁生产 `latest` | 不锁 Role 枚举 / 工具清单 / 产品 / 数字 |
| method-library 00 / 01 / 03 | RoleDefinition 与 Role -> variant 定义来源;运行期 / ref 消费;无源码依赖 | exact query / snapshot schema pending (`MI-UP-003`) |
| artifact 00~03 | Artifact fact / version / lineage / baseline owner;正式 `ConsumableArtifactReference` | image handoff 条件 pending (`MI-UP-007`) |
| runtime 00~07 | runtime loop、run、checkpoint、recovery、live memory 不归本仓 | 只消费未来发布产物 ref |
| tools 00~07 | tool identity / contract / invocation 不归本仓;具体 inventory / Role extras 不归 tools | 本仓只拥有 extras 装配清单,输入 ref 形态 pending |
| sandbox 00 / 01 | 镜像构建、供应链 provenance 不归 sandbox | 加固基础镜像仅未来项 |
| core 00~07 | shared contract category authority | image-specific shared schema 未确认 (`MI-UP-004`) |
| member-service Step 6~8 | 下游只消费本仓正式 pinned image ref / manifest,不直接解析 method mapping | 正式 00 与字段合同未闭合 (`MI-UP-001`) |

### 7.3 冲突处理优先级

```text
normative standard / accepted ADR
  -> current formal owner boundary
  -> current pending sibling input (只能产生 pending)
  -> approved pre-00 draft (待重新验证)
  -> historical material (只作污染审计)
```

任何较低层输入与较高层 authority 冲突时,低层输入失效;任何输入缺 exact owner / contract 时,受影响正向路径标记 `pending` / `blocked`,不得由本仓补定义。

## 8. 回填草稿

正式 00 §1 应说明:

- 本文依据的 normative / architecture / owner 正式输入;
- 直接承接的五项 ADR 裁决和相邻 owner 边界;
- member / member-service、exact mapping surface、image Artifact handoff、event schema 等 pending 输入;
- 旧 README 与旧正式文档仅为 historical material;
- 设计结论不代表实现、测试、digest、发布、验收或 readiness 已发生。

## 9. 待确认事项

| ID | 事项 | 当前处理 |
|---|---|---|
| `MI-UP-001~009` | 上游 / sibling exact contract 缺口 | 原样带入后续 Step,受影响 positive lane fail closed |
| `Q-MI-001~004` | 特殊 variant、多架构、产品选择、evidence kind | 不在 Step 1 决定;分别进入范围 / NFR / 风险讨论 |

## 10. 进入下一步条件

| 检查项 | 结果 |
|---|---|
| authority / pending / historical 是否分层 | pass |
| 是否把 sibling 草稿写成正式合同 | no |
| 是否继承旧固定 Role、技术栈或数字 | no |
| 是否声明实现 / digest / evidence / readiness | no |
| 是否提前展开定位、功能或 schema | no;只记录来源约束 |

`gate_status = pass`;允许创建 Step 2,不得跳到 Step 3 或修改正式 00。
