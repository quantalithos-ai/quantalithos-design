# Step 1. 与上游文档的关系声明

## 1. Step 状态

- 状态：`[x] 已完成并通过自检`
- 对应 SOP：`需求文档讨论流程_SOP.md` Step 1
- 回填章节：正式 `00-需求文档.md` §1
- gate_status：`pass`
- gate_reason：来源层级、承接主题、非重定义边界和历史材料处置均已明确。
- next_allowed_action：进入 Step 2 本仓定位与边界。

### 1.1 Step 开工确认

| 项目 | 记录 |
|---|---|
| 通用规范 | 已读取 `设计文档编写通则.md`、`设计文档讨论中间产物规范.md`、`设计真相源闭环与可落码性标准.md` |
| 文档规范 | 已读取 `需求文档讨论流程_SOP.md`、`需求文档书写规范.md` |
| 顺序规范 | 已读取 `全局项目依赖关系与裁剪规则.md` §2/§4/§4.1 |
| 正式上游 | 已读取 `L1-workspace` 正式 00~07 及项目 ledger；已读取指定 L0/L1/L4 owner 当前正式文档与可用台账 |
| 历史输入 | L4 README、旧正式 00/01/02/03/05/06 和 draft 仅作后置审计 |
| 当前模式 | `full-restart` |

#### 1.2 Step 内计划

- [x] 读取输入和正式上游。
- [x] 逐项回答 SOP 问题。
- [x] 独立形成来源层级和承接边界。
- [x] 后置审计旧 L4 材料。
- [x] 记录备选方案与取舍。
- [x] 形成来源映射和权威顺序。
- [x] 判断复杂度：单文件足够，无需附录。
- [x] 形成正式回填草稿。
- [x] 完成来源、边界、污染和门禁自检。

## 2. 本步输入

### 2.1 规范输入

- `standards/document/设计文档编写通则.md`
- `standards/document/设计文档讨论中间产物规范.md`
- `standards/document/设计真相源闭环与可落码性标准.md`
- `standards/document/全局项目依赖关系与裁剪规则.md`
- `standards/document/需求文档讨论流程_SOP.md`
- `standards/document/需求文档书写规范.md`

### 2.2 正式上游输入

- `projects/L1-workspace/00-需求文档.md` 至 `07-实施计划.md`
- `projects/L1-workspace/design-calibration/project_execution_ledger.md`
- `projects/L1-identity/`、`L1-conversation/`、`L1-work/`、`L1-process/`、`L1-governance/`、`L1-artifact/` 当前正式文档
- `projects/L4-observability/` 当前正式文档与项目台账
- `projects/L0-core/`、`L0-bus/`、`L0-sdk/` 当前正式文档

### 2.3 非权威输入

- `projects/L4-archive/draft/01_项目作用与交互对象.md` 至 `03_模块划分与分层.md`
- `projects/L4-archive/README.md` 和旧正式 00/01/02/03/05/06

## 3. SOP 问题回答

1. 本文承接哪些上游文档？

   承接全局依赖和讨论顺序标准、已停审 `L1-workspace` 的正式 00~07、六个 L1 truth owner 的正式边界、`L1-artifact` 的制品/版本/血缘 authority、`L4-observability` 的审计/观测 authority，以及 L0 共享契约、事件传递和 SDK 访问边界。

2. 承接上游哪一部分主题？

   承接各 owner 对业务 truth、可消费 ref/snapshot/export、visibility/decision、版本/水位和恢复接收权的归属；承接 workspace projection 只是只读消费视图；承接 bus 只拥有 delivery/retry/replay carrier truth；承接 archive 位于 workspace 之后的强串行位置。

3. 本文为什么不是重新定义该主题？

   Archive 只定义自身归档请求/作业、Bundle/manifest、内容闭包、完整性/存储状态、恢复计划/材料及 handoff 记录。它不重新定义源域对象、项目状态、保留政策、legal hold、销毁授权、Artifact 正文/血缘、审计链或 SDK/product 行为。

4. 本文在当前仓承担什么细化作用？

   把“跨域材料如何在明确授权和来源绑定下形成可验证归档包，并在恢复时安全交回各 truth owner”细化为需求边界、能力闭环、失败姿态、数据归属、依赖分类和验收口径。

## 4. 当前文档问题诊断

| 位置 | 历史问题 | 影响 |
|---|---|---|
| 旧 00 §1 | 来源主要回指 README、产品片段和旧文档，未把当前正式 owner 作为 authority | 归档可能反向定义 L1 truth |
| 旧 00 §2~§6 | 把固定六域、合规声明、项目状态和恢复结果写成 Archive 自有结论 | owner 权限越界 |
| README §11/§43 | 固定 Rust、S3/MinIO/Glacier、PG 和上游关系 | 需求层提前锁实现与依赖 |
| 旧 01~06 | 旧详细对象、状态和验收反推需求 | full-restart 顺序倒置 |
| draft | 已给出正确边界方向但仍是 pre-calibration | 必须重新通过当前 Step 门禁 |

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 需求来源 | README/旧 L4 自述为主 | 标准 + 当前正式 owner + 已停审 workspace 为主 | 确保 authority 可追溯 |
| 归档主题 | “跨六域打包并恢复项目” | “封装获准材料并向 owner 交接恢复材料” | Archive 无跨域业务写权 |
| workspace 地位 | 可被理解为跨域快照 | 明确为只读 projection 辅助输入 | projection 不能冒充 canonical truth |
| 治理材料 | Archive 生成或解释合规/保留结论 | Archive 只消费正式 decision/ref 并执行 | 保持 governance authority |
| 历史文档 | 直接继承 | 后置污染审计 | 遵守 full-restart |

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| A. 以各正式 owner 为来源，Archive 只定义 preservation/handoff truth | 权威唯一、可审计、可逐 source fail-closed | 需要保留多个上游 blocker | 采用 |
| B. 以 workspace 聚合视图作为统一快照来源 | 接入看似简单 | projection 冒充 truth，覆盖和版本不可证明 | 不采用 |
| C. 以旧 L4 文档作为完整需求基线 | 写作快 | 继承固定选型、越权状态和伪量化 | 不采用 |

## 7. 结构化中间产物

### 7.1 来源映射表

| 来源 | 权威主题 | Archive 承接 | Archive 不得推导 |
|---|---|---|---|
| 全局依赖规则 | 讨论顺序与依赖类型 | 当前轮次和 compile/runtime/event/ref/adapter/fake 分类 | 不自行改变全局顺序 |
| `L0-core` | 正式共享契约 | 仅消费经核验共享类型 | 不本地 shadow 未发布 schema |
| `L0-bus` | delivery/ack/retry/replay carrier | 事件触发和协作 | 不拥有投递真相或 event schema |
| 六个 L1 owner | 各自业务 truth | owner-approved snapshot/export/ref 与恢复接收结果 | 不拥有或反写业务 truth |
| `L1-workspace` | read-model/projection/local state | 明确标注的辅助 projection/ref | 不作任何 L1 canonical snapshot |
| `L1-artifact` | Artifact 正文、版本、血缘、baseline | artifact ref、获准材料和来源摘要 | 不把 manifest 变成 Artifact truth |
| `L1-governance` | policy/gate/decision/risk acceptance | retention/hold/delete decision ref | 不解释或创设治理决定 |
| `L4-observability` | audit/telemetry material 和后端 | 获准、脱敏的 audit/evidence material/ref | 不拥有审计链或观测后端 |
| `L0-sdk` / 产品 | 客户端和消费体验 | 只定义 Archive 输出的消费边界 | 不合并 SDK client/cache/UI |

### 7.2 权威顺序

```text
standards + current stopped formal upstream
  > current L4 formal 00 after this full-restart
  > current L4 design-calibration explanation
  > pre-calibration draft
  > old L4 README/formal documents
```

### 7.3 持续 blocker 承接

`AR-UP-001~009` 不阻塞需求层定义 owner、能力、失败姿态和数据类别；它们阻塞 exact schema、真实集成、算法/供应商选择、量化承诺、restore success 和 readiness。

## 8. 回填草稿

本文承接全局依赖与讨论顺序、已停审 `L1-workspace` 正式 00~07、六个 L1 truth owner、`L1-artifact`、`L4-observability` 与 L0 基础能力的当前正式边界。Archive 只把这些上游允许归档的 snapshot/export/ref、治理决定和审计材料细化为归档请求与作业、Archive Bundle/manifest、内容闭包、完整性与存储状态、恢复计划/材料及 owner handoff 记录；不重新定义任何源域 truth、项目状态、治理政策、Artifact truth 或审计链。

## 9. 待确认事项

- `AR-UP-001~009` 保持开放，详见项目执行台账。
- 全局矩阵中的 `L0-sdk` 编译期关系尚不能证明 Archive 当前存在可直接引用的 SDK surface；在架构阶段核验前只保留 candidate，不写为已成立 package dependency。

## 10. 进入下一步条件

- [x] 来源文档具体可定位。
- [x] 承接主题与非重定义边界清楚。
- [x] current formal 与 historical material 已分层。
- [x] blocker 没有被写成已闭合结论。
- [x] gate_status=`pass`，允许进入 Step 2。
