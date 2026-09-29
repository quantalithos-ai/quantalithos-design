# Step 2. 本仓定位与边界

## 1. Step 状态

- 状态：`[x] 已完成并通过自检`
- 对应 SOP：`需求文档讨论流程_SOP.md` Step 2
- 回填章节：正式 `00-需求文档.md` §2
- gate_status：`pass`
- gate_reason：已能用一句话和边界表说明 Archive 的唯一职责，并区分所有相邻 owner。
- next_allowed_action：进入 Step 3 背景与问题定义。

### 1.1 Step 内计划

- [x] 读取 Step 1、draft/01、L1-workspace 正式边界及指定 owner 文档。
- [x] 回答一句话定义、单独成仓原因、非职责和易混淆对象。
- [x] 诊断旧 L4 对项目状态、治理和技术设施的越界。
- [x] 比较“归档专属边界”与“跨域总管”方案。
- [x] 形成拥有/消费/禁止拥有矩阵。
- [x] 判断复杂度：需要一张边界矩阵，不拆模块。
- [x] 形成回填草稿并完成自检。

## 2. 本步输入

- `design-calibration/00_req_step_01_upstream_relation.md`
- `projects/L4-archive/draft/01_项目作用与交互对象.md`
- `projects/L1-workspace/00-需求文档.md`、`01-架构设计.md`、`07-实施计划.md`
- 六个 L1 truth owner、`L1-artifact`、`L4-observability`、L0 当前正式文档
- `projects/L4-archive/README.md` 与旧正式 00/01/02/03/05/06（仅污染审计）

## 3. SOP 问题回答

1. 本仓一句话定义是什么？

   `L4-archive` 是受控的跨域归档与恢复材料边界：它在来源 owner 授权和可验证输入的前提下，管理 Archive Bundle、manifest、内容闭包、完整性/存储状态、归档生命周期执行记录、恢复计划、恢复材料和 owner handoff 结果。

2. 为什么需要单独成仓？

   归档材料需要独立于活跃业务 truth 的封装、长期保存、验证、取回和交接语义；若由各 L1 owner 或产品各自实现，包格式、来源绑定、完整性和恢复交接会分裂，且容易把副本误当真相。

3. 本仓不是什么？

   不是任何 L1 业务 truth owner，不是项目生命周期或治理决策中心，不是 Artifact 正文/血缘仓，不是 Observability 后端，不是对象存储供应商、KMS、密钥或压缩产品，也不是 SDK、Console、Sync、runtime、tools、sandbox 或跨域写入网关。

4. 最容易与哪些对象混淆？

   与 `L1-work` 的项目状态、`L1-workspace` 的只读 projection、`L1-artifact` 的正文/血缘、`L4-observability` 的审计链、`L1-governance` 的 retention/legal hold/delete 决策，以及对象存储/签名服务的基础设施边界最易混淆。

## 4. 当前文档问题诊断

| 历史位置 | 问题 | 影响 |
|---|---|---|
| README §25~§39 | 把“六域打包、合规声明、项目恢复、保留策略”统称为 Archive 自有职责 | 把 owner 决策和外部服务误收为本仓真相 |
| 旧 00 §2/§3 | 直接规定 archived/dissolved 的业务语义和恢复到 active | 越过 `L1-work` 生命周期 owner |
| 旧 00 §7/§10 | 把 7 年、冷热层和 SLA 写成硬要求 | 没有治理/工作负载/测量来源 |
| 旧 02/03 | 预先定义 `ArchiveRecord`、`RetentionClass`、`project.restored` 等实现对象/事件 | 需求与详细设计倒置，形成第二真相源 |
| draft/01 | 已区分 owned / consumed / forbidden，但仍标注候选 | 需在当前需求 Step 中正式收口 |

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 本仓主语 | “跨六域项目归档中心” | “归档材料与恢复交接边界” | 防止把业务状态和 owner 决策纳入 Archive |
| Archive-owned truth | 包、索引、保留策略、合规声明、恢复状态混合 | 请求/作业、Bundle/manifest、slice binding、closure、完整性/存储/恢复计划/handoff 记录 | 只保留归档专属事实 |
| workspace 地位 | 可能被视作第七个 canonical slice | 只能作为明确标注的只读 projection/ref | projection 不具备 L1 truth authority |
| lifecycle 权限 | Archive 可决定 archived/dissolved/删除 | Archive 仅执行正式 decision 并记录结果 | governance/work owner 保持权威 |
| 技术设施 | 在需求中固定 Rust、S3、PG、Glacier | 在需求层只描述外部能力类别 | 避免方案提前锁定 |

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| A. 归档专属边界 + owner-specific handoff | 权责清楚，支持逐 slice fail-closed 和恢复审计 | 依赖多个 owner 接缝，不能给出“一键成功”承诺 | 采用 |
| B. Archive 作为跨域业务总管，直接改各域 | 流程表面简单 | 需要共享数据库/跨域写权限，破坏 owner truth | 不采用 |
| C. 只保存 workspace/observability 聚合视图 | 接入成本低 | projection/观察材料不能证明 canonical coverage | 不采用 |

## 7. 结构化中间产物

### 7.1 拥有、消费、禁止拥有矩阵

| 主题 | Archive 拥有 | Archive 只消费 | 明确禁止 |
|---|---|---|---|
| 归档请求/作业 | request、scope、attempt、阶段、结果、重试记录 | 归档触发、批准/授权引用 | 以请求推断批准或项目状态迁移 |
| Bundle | Bundle、manifest、slice inventory、source binding、closure | owner-approved snapshot/export/ref | 复制未授权正文或把 projection 当 truth |
| 完整性 | 验证状态、摘要/签名引用、失败历史 | digest/signature/KMS 服务结果 | 私造算法、密钥、成功结论 |
| 存储 | location ref、tier/迁移/取回状态 | 外部存储能力与结果 | 成为对象存储供应商或备份平台本体 |
| 生命周期 | 执行记录、阻断原因、decision ref | retention/legal hold/delete decision | 创建/解释 policy、hold、销毁授权、风险接受 |
| 恢复 | restore request/plan/material/handoff/outcome | owner receiver/import/restore/command 接缝 | 直接写上游数据库或发布业务 restored 事实 |
| 观测/审计 | 归档作业的安全 audit ref | `L4-observability` approved material/ref | 接管审计链或 telemetry backend |

### 7.2 相邻仓边界

| 相邻仓/能力 | 其真相 | Archive 的关系 | 越界红线 |
|---|---|---|---|
| `L1-work` | Project、ProjectMember、WorkItem、项目生命周期 | 读取批准状态/快照，恢复时 handoff | 不改变 archived/dissolved/restored |
| `L1-identity` | GlobalMember 身份 | 接收身份 snapshot/ref | 不拥有身份正文或生命周期 |
| `L1-conversation` | Conversation/Turn/Participant | 接收允许归档的 slice | 不定义参与者、可见性或对话历史 |
| `L1-process` | ProcessInstance/Activity/checkpoint | 接收过程快照/ref | 不推进/回滚过程 |
| `L1-governance` | Policy/Gate/Decision/hold/delete/risk | 接收正式 decision/ref | 不批准、延长保留或释放 hold |
| `L1-artifact` | Artifact 正文、版本、血缘、baseline | 接收 artifact ref/获准材料 | 不成为 Artifact baseline/血缘 owner |
| `L1-workspace` | 只读 projection/local state | 受限消费 projection/ref | 不把 projection 变成 canonical snapshot |
| `L4-observability` | audit chain、telemetry、观测后端 | 接收批准且脱敏的材料/ref | 不冒充实时审计流 |
| `L0-bus` | delivery、ack、retry、replay carrier | 事件协作输入 | 不拥有 delivery truth |
| 对象存储/KMS/签名 | 基础设施与密钥 authority | runtime/adapter seam | 不把供应商或密钥写成业务真相 |

## 8. 回填草稿

| 字段 | 结论 |
|---|---|
| 一句话定义 | `L4-archive` 是受控的跨域归档与恢复材料边界，管理归档请求/作业、Archive Bundle、来源绑定、内容闭包、完整性/存储状态、生命周期执行记录、恢复计划/材料及 owner handoff。 |
| 单独成仓原因 | 让长期保存、验证、取回和恢复交接独立于活跃业务 truth，并提供统一可追溯包边界。 |
| 不是什么 | 不是 L1 truth、治理决策、Artifact 正文/血缘、observability 后端、对象存储/KMS 产品、UI/SDK/runtime/tools 或跨域写网关。 |

## 9. 待确认事项

- 各 owner 的 snapshot/export/restore receiver 合同仍受 `AR-UP-001/002/006/007/009` 影响。
- `L1-workspace` projection 是否允许作为某类辅助切片输入由 `AR-UP-008` 约束；未闭合前不纳入 canonical 集合。

## 10. 进入下一步条件

- [x] 一句话定义可独立复述。
- [x] 拥有、消费、禁止拥有边界已分离。
- [x] 相邻仓责任可逐项指向 owner。
- [x] 旧技术选型和越权状态未进入当前结论。
- [x] gate_status=`pass`，允许进入 Step 3。
