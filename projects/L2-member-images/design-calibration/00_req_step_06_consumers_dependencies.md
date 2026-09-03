# Step 6. 使用方与依赖

## 1. Step 状态

| 当前模块 | gate_status | gate_reason | next_allowed_action | source_files |
|---|---|---|---|---|
| `dependency_crop_and_failure_boundary` | pass | 仓际能力关系、闭环前置、失效后果、裁剪表、类型表、禁止表、ASCII 图和 path dependency 判定已闭合 | 进入 Step 7 核心能力闭环 | `00_req_step_02_position_boundary.md`;`00_req_step_05_users_roles.md`;`全局项目依赖关系与裁剪规则.md` |

### 1.1 Step 内计划

- [x] 读取需求 SOP Step 6、书写规范 §4.6 和全局依赖规则 §4~§6。
- [x] 只裁剪 `L2-member-images` 相关边,不复制 27 仓矩阵。
- [x] 区分输入依赖、输出供给、协作 ref、event 与外部 adapter。
- [x] 把 `compile/runtime/event/ref/adapter/fake` 写成不混淆的类型分类。
- [x] 对每个主链依赖给出失效后果和 fail-closed 上限。
- [x] 后置审计旧“二进制 / 包直连、CI / registry 固定、通知下游”口径。
- [x] 完成 path dependency、方向、pending 与图示自检。

## 2. 本步输入

| 输入 | 约束 |
|---|---|
| 全局矩阵 `L2-member-images` 行 | compile=`L0-core`;runtime=消费 L2 artifacts 与 method role/image mapping;event=按需消费镜像构建事件 |
| Step 2 | 本仓只拥有镜像域静态资产与供给 truth |
| Step 5 | 系统角色需转译为依赖 / 供给关系,不再作为用户角色描述 |
| method-library | mapping owner 与禁止源码依赖已正式明确 |
| artifact | 通用 Artifact truth 和正式消费引用 owner |
| member-service Step 6~8 | 只消费本仓 pinned image ref / manifest 的方向,pending only |
| draft/02 | 候选裁剪边,本 Step 独立复核后使用 |

## 3. SOP 问题回答

1. 本仓向哪些仓 / 系统提供哪些能力?

   回答:核心输出给 member-service:受控 variant 目录与 pinned 可实例化镜像入口。Artifact 是协作 owner,接收构建输出的正式化 handoff 候选并签发通用消费引用。审计 / 观测 / 归档方向只可能消费安全追溯材料,当前不形成直接主链。

2. 本仓依赖哪些仓 / 系统?

   回答:compile 候选只有 Core;运行 / ref 输入来自 method-library 与 L2 组件发布产物;event 输入经 Bus;构建与候选存储依赖 builder / registry adapter;正式适用 evidence 依赖条件型 adapter;Artifact 通过 ref / handoff 协作。

3. 哪些全局边进入主链,哪些裁剪?

   回答:Core、method mapping、L2 artifacts、入站构建事件进入;member-service 作为输出消费者进入;Artifact 作为 truth 边界协作进入;builder / registry 是外部 adapter。SDK、产品、marketplace、observability backend、capability registry 和 sandbox 当前主链均裁剪。

4. 每条主链关系属于什么类型?

   回答:Core 为 compile candidate;方法库为 runtime + ref;L2 组件为 ref;Bus 为 event;Artifact 为 ref + handoff;member-service 为 runtime + ref 供给;基础设施为 adapter。Fake 仅是后续验证 seam,不构成生产 dependency 或 readiness。

5. 哪些是闭环前置?

   回答:可验证 mapping、pinned 组件 / seed 输入、builder、registry、digest / provenance 形成能力以及正式适用 evidence gate 是受影响构建 / 发布路径前置。Artifact handoff 和 member-service exact schema 未闭口时,只能完成本地设计语义与 fail-closed,不能声称 positive handoff / launch readiness。

6. 依赖失效有什么后果?

   回答:mapping / component / seed 不可验证时装配 blocked;builder / registry 不可用时构建或发布 blocked;适用 evidence 缺失时 eligibility blocked;Artifact handoff 不可确认时不得伪造 formal Artifact ref;member-service 合同未闭口时不得声称实例化成功;Bus 失效不取消 nightly 语义,但 event-trigger lane unavailable。

## 4. 当前文档问题诊断

| 旧 / 候选口径 | 问题 | 当前处理 |
|---|---|---|
| runtime / tools / member 作为源码 / 包依赖 | 全局矩阵只说消费 artifacts | 改为发布产物 ref,不是 sibling package dependency |
| method-library 作为构建脚本直接读取目录 | 违反其禁止源码依赖 | 改为 runtime / ref + pinned snapshot seam |
| 本仓拥有 registry / CI | 吞并基础设施产品 truth | 降为 adapter |
| 构建完成后发布事件通知 member-service | 无出站 event authority | 删除正向事件合同;保留 ref 供给方向 |
| artifact 只是归档附属 | 无法处理通用 version / lineage owner | 加入正式 ref / handoff 边界,pending exact image 条件 |
| sandbox 是镜像构建依赖 | sandbox 正式文档明确排除供应链构建 | 当前裁剪,加固基础镜像只作 future ref 消费方向 |

## 5. 改动前后对比

| 主题 | 旧口径 | 当前口径 |
|---|---|---|
| 编译依赖 | 多个 L2 sibling 直接依赖 | 只有 verified Core candidate |
| 映射 | 本地配置 / 目录读取 | 方法库 runtime / ref 输入,pinned 且不可 hardcode |
| 组件 | 二进制 / 包路径 | 正式发布产物 ref;exact shape pending |
| 事件 | 构建 / 发布双向事件默认存在 | 当前仅入站消费方向有矩阵 authority |
| Artifact | 本地 image release 全栈 | 镜像域 binding + Artifact 正式 ref / handoff |
| 下游 | 调用 / 通知流程已定 | pinned manifest / ref 供给方向,exact contract pending |

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 所有 sibling 作为 package dependency | 实现直观 | 违反全局矩阵,耦合 owner 实现 | 不采用 |
| 所有关系都写 runtime API | 统一 | Artifact / component / event / adapter 语义被压平 | 不采用 |
| 按 compile/runtime/event/ref/adapter/fake 分类 | owner 与失效边界清楚 | 后续需分别闭合合同 | 采用 |

## 7. 结构化中间产物

### 7.1 仓际能力关系

| 方向 | 关联方 | 关系主题 | 当前状态 |
|---|---|---|---|
| 输入 | `L3-method-library` | Role -> image variant 正式定义来源 | owner closed;surface pending |
| 输入 | `L2-runtime` / `L2-tools` / `L2-member` | 受控组件发布产物 | runtime/tools boundary closed;release ref / member shape pending |
| 输入 | seed 来源 owner | policy / memory / workspace seed 模板 | owner / contract pending |
| 输入 | `L0-bus` | 按需消费镜像构建事件 | direction closed;family/schema pending |
| 协作 | `L1-artifact` | 构建输出正式化与消费引用 | owner closed;image handoff pending |
| 输出 | `L2-member-service` | pinned manifest / variant / ref 可实例化入口 | direction pending sibling;exact contract pending |
| 外部能力 | builder / registry / evidence backends | 构建、候选存储、适用证据结果 | adapter only;product/readiness pending |

### 7.2 本仓依赖裁剪表

| 关联项目 | 全局关系 | 本仓角色 | 依赖类型 | 是否进入当前文档主链 | 裁剪理由 |
|---|---|---|---|---|---|
| `L0-core` | 全平台共享契约来源 | 依赖方 | 编译期候选 | 是 | 只消费已核验 shared contract;image-specific schema 未认定时不得 shadow |
| `L3-method-library` | 本仓运行期消费 role/image mapping | 依赖方 | 运行期 + ref | 是 | 映射定义 owner;必须受控消费,不得 hardcode 或源码依赖 |
| `L2-runtime` | 本仓消费 L2 artifacts | 依赖方 | ref | 是 | 只消费正式 runtime 发布产物,不消费 loop / live state |
| `L2-tools` | 本仓消费 L2 artifacts | 依赖方 | ref | 是 | 只消费工具组件产物;工具合同仍归 tools |
| `L2-member` | 本仓消费 L2 artifacts | 依赖方 | ref | 是,pending | member 产物形态尚未闭合;缺失时受影响装配 blocked |
| `L2-member-service` | 启动成员容器并消费镜像 | 被依赖方 | 运行期 + ref | 是,pending | 本仓供给 pinned 入口;下游不直接解析 mapping;exact contract 未停审 |
| `L1-artifact` | Artifact 正文 / 血缘 truth owner | 协作方 | ref + handoff | 是,边界 | 本仓不得建立第二套 Artifact version / lineage;image handoff 条件 pending |
| `L0-bus` | 全平台事件主干 | 事件消费方 | 事件协作 | 是,条件型 | 当前 authority 只固定按需消费构建事件;schema 未闭口时 event lane unavailable |
| `L1-governance` / seed owner | policy / template truth 候选来源 | 条件协作方 | ref | 条件型 | 本仓只承接正式 seed / policy ref,owner 未裁定时不建直边 |
| `L4-sandbox` | 隔离基础仓 | 潜在被依赖 / 输入方向 | ref | 否,未来 | 加固基础镜像为演进项;sandbox 不拥有 image build truth |
| `L3-capability-hub` | capability registry / external adapter truth | 无直接关系 | 裁剪 | 否 | 本仓不得拥有或直接消费 registry 作为镜像 truth |
| `L4-observability` | 观测 backend | 潜在下游 | 安全材料 handoff 候选 | 否,当前 | 不形成当前核心依赖,Observed 不反写本仓 |
| `L0-sdk` / L5 / L6 | 客户端、产品与生态 | 下游候选 | 裁剪 | 否 | 不反向进入静态资产主链 |

### 7.3 本仓依赖类型分类表

| 依赖类型 | 关联项目 | 本仓如何使用 / 提供能力 | 后续文档落点 |
|---|---|---|---|
| 编译期依赖 | `L0-core` | 只使用经核验的 shared contract 类别 | 01 / 03 / 07 |
| 运行期依赖 | `L3-method-library`;`L2-member-service` | 消费 mapping;提供可实例化入口 | 01 / 03 / 05 |
| 事件协作依赖 | `L0-bus` | 按需消费已验证镜像构建事件 | 01 / 03 / 04 / 05 |
| ref 依赖 | L2 组件、seed owner、`L1-artifact` | 消费 pinned inputs / 正式引用;不复制正文 | 00 / 01 / 02 / 03 |
| adapter 依赖 | builder / registry / policy-required evidence backends | 产品中立地交接构建、存储和证据检查 | 01 / 03 / 04 / 05 |
| fake seam | 所有未就绪 runtime / ref / adapter boundary | 后续只用于隔离验证 negative / parity 语义 | 03 / 05 / 07;fake 不证明 readiness |

### 7.4 本仓禁止依赖表

| 禁止依赖 | 禁止原因 | 正确协作方式 |
|---|---|---|
| `L2-member-images -> L3-method-library` 源码 / path dependency | mapping 是运行期定义来源,源码耦合会绕过正式边界 | runtime / ref / pinned snapshot |
| `L2-member-images -> L2-runtime/tools/member` 源码依赖 | 本仓消费发布产物,不吸收 sibling 实现 | component release ref |
| `L2-member-images -> L2-member-service` 源码依赖 | 下游不应反向定义本仓供给 truth | runtime / ref supply contract |
| 本仓本地定义 `ArtifactVersion` / lineage / baseline | 形成第二 Artifact truth | `ConsumableArtifactReference` + pending formal handoff |
| 本仓本地 capability / tool registry | 破坏 tools / hub owner | 受控 component / capability refs |
| Bus 事件承载镜像 truth 或默认出站事件 | event carrier 不是 truth;无 outbound authority | 本地 accepted truth + 仅已授权 event boundary |
| registry / builder / scanner / signer SDK 进入 domain truth | 产品反向定义业务语义 | port / adapter + 04 配置绑定 |
| 本仓写入 runtime / member-service / sandbox / governance / observability truth | owner 越界 | ref / handoff / safe conclusion |
| fake 进入 production composition 或作为 readiness 证据 | fake 只验证隔离语义 | 正式 adapter + 真实 qualification |

### 7.5 依赖裁剪图: L2-member-images

```text
                         [runtime/ref]
                 +------------------------+
                 | L3-method-library      |
                 | Role -> image variant  |
                 +-----------+------------+
                             |
                             v
[ref] L2 component ----> +---------------------+ ----[runtime/ref]----> L2-member-service
     release artifacts   | L2-member-images    |                       (contract pending)
[ref] seed templates --->| image asset / supply|
                         +----+-----------+----+
                              |           |
                  [ref/handoff]|           |[adapter]
                              v           v
                       L1-artifact     builder / registry /
                       (pending)       applicable evidence

L0-core --------[compile candidate]--------> L2-member-images
L0-bus ---------[event input, schema pending]--> L2-member-images
```

图示说明:

- 本图只展示本仓相关边,不展示全 27 仓。
- `[compile]` 只有 `L0-core` 候选;`runtime`、`event`、`ref`、`adapter` 均不得变成 sibling package dependency。
- 箭头表示消费 / 供给 / 协作方向,不表达构建步骤或调用时序。
- pending 边只允许 fail-closed 需求语义,不表示接口、adapter 或下游已经 ready。

### 7.6 依赖失效后果

| 依赖 / seam | 失效 / 未闭口 | 当前后果 |
|---|---|---|
| mapping | missing / stale / conflict / unverifiable | 受影响 variant / build blocked,不得本地 fallback |
| component / seed ref | missing / mutable / unverifiable | assembly incomplete;不得猜版本或使用 `latest` |
| builder | unavailable / failed / unknown | 无候选输出;保留明确失败 / unknown,不得伪造 digest |
| registry | unavailable / inconsistent ref | publish / resolve blocked;既有本地 truth 不被外部状态改写 |
| applicable evidence | missing / failed / unverifiable | eligibility blocked;未适用 evidence 不得伪报 pass |
| Artifact handoff | pending / rejected / unavailable | 不得声明 formal Artifact ref / version / baseline 已成立 |
| member-service contract | pending / rejected | 可定义本仓供给候选,不得声明 launch / upgrade / consumption 成功 |
| Bus event lane | schema unsupported / unavailable | event-trigger lane rejected / unavailable;nightly authority不被替代 |

### 7.7 Path dependency 判定

```text
allowed_candidate = verified L0-core shared contract only
forbidden = every non-Core sibling source/path/package dependency
runtime/event/ref/adapter/fake != compile dependency
```

## 8. 回填草稿

正式 00 §6 应保留仓际能力关系、全局固定格式的裁剪表 / 类型表 / 禁止表、ASCII 图和失效后果摘要。需求正文不写 API / event 名、schema 字段、Cargo 配置或后端产品。

## 9. 待确认事项

| ID | 影响边 | 当前限制 |
|---|---|---|
| `MI-UP-001` | member-service runtime / ref output | exact contract pending;不声明 launch readiness |
| `MI-UP-002` | member component ref | shape / compatibility pending |
| `MI-UP-003` | method runtime / ref | exact consumption surface pending |
| `MI-UP-004/005` | Core / Bus | image schema / inbound event schema pending |
| `MI-UP-006/007` | seed / Artifact | owner / handoff pending |
| `MI-UP-009` | outbound event | 无 authority,不进入当前依赖表 |

## 10. 进入下一步条件

| 检查项 | 结果 |
|---|---|
| 是否裁剪而非复制总矩阵 | pass |
| 裁剪表 / 类型表 / 禁止表 / ASCII 图是否齐全 | pass |
| compile/runtime/event/ref/adapter/fake 是否分开 | pass |
| 每个核心依赖是否有失效后果 | pass |
| 是否把 runtime / event / ref 写成 package dependency | no |
| 是否私造 outbound event 或 positive readiness | no |

`gate_status = pass`;允许创建 Step 7,不得跳到 Step 8 或修改正式 00。
