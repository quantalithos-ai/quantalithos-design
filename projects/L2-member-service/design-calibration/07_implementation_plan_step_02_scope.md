# Step 2. 明确实施目标、范围和非范围

> 对应 SOP：`standards/document/实施计划讨论流程_SOP.md` Step 2
> 本步状态：`completed / pass_with_upstream_blockers`
> 回填目标：正式 `07-实施计划.md` §2

## Step 状态

| 项 | 结论 |
|---|---|
| gate_status | completed / pass_with_upstream_blockers |
| current_module | scope |
| next_allowed_action | Step 3 prerequisites |
| implementation_allowed | false |

## 本步输入

- Step 1 的输入边界和 blocker 分类。
- 正式 `00` 的 C-MS-1~C-MS-5、FR-MS 功能分母和非功能方向。
- 正式 `03` 的 7 模块、29 对象、10 Command、6 Query、5 Consumer、1 material helper、7 Job。
- 正式 `05` 的 suite / TC / EV 计划与正式 `06` 的 AC-MS-001~039、VF-MS-001~009。

## SOP 问题回答

1. 最小交付结果是一个按 Host Truth 控制面可验证纵切组织的 Rust workspace 实施路径，而非在设计仓实现代码。
2. P0 覆盖 C-MS-1~C-MS-5、AC-MS-001~017、AC-MS-022~039 以及相关 VF；AC-MS-018~021 作为 P1/P2 后置边界。
3. 必须落地 03 §4~§15 的模块、对象、协议、flow、状态、UoW、错误、幂等、配置和观测契约。
4. 每个阶段至少绑定一组 05 suite、AC 与 VETO 风险；真实判定留到 future run。
5. 真实 sibling、broker、durable store、observability backend、生产部署不在设计期交付。
6. P1/P2 优化不能反向改变 Host Truth、readiness、handoff 或 Job 授权边界。

## 当前文档问题诊断

旧材料容易把“宿主能运行”扩大为 runtime / member / images / sandbox 的全链路完成，也容易把 P1 的性能、预热、容量优化写进 P0。正式 07 必须以可验证功能增量组织，并把 unavailable / waiting 作为合法交付状态。

## 改动前后对比

| 方面 | 旧风险 | 本步收口 |
|---|---|---|
| 主线 | “完成后端”式宽泛目标 | 5 个核心闭环 + 7 模块 + 协议分母 |
| 依赖 | sibling 正向默认可用 | typed seam，未闭合即 blocked |
| 证据 | 计划容易写成已通过 | 只规划 future artifact/report/evidence |
| P1/P2 | 可能混入 P0 | 单列后置，不能阻断或伪造 P0 |

## 设计取舍

- 以功能闭环而非对象数量作为 phase 组织轴。
- 将 `HostFactMaterialEventCandidate` 保留为唯一 outbound material helper，避免伪造 event family。
- 将“实施完成”定义为未来真实交付的判定，不在本轮给出完成 verdict。

## 结构化中间产物

### 实施目标表

| 目标 | 来源 | 本轮 | 目标状态 |
|---|---|---:|---|
| 意图 / 决定受理 | C-MS-1、03 §7~§8 | 是 | local Host Truth 可验证 |
| 资格 / 装配 / readiness | C-MS-2、03 §8~§9 | 是 | 分项、同代、fresh、fail-closed |
| registration / session | C-MS-3 | 是 | safe shell；exact member/runtime mapper pending |
| health / recovery | C-MS-4 | 是 | 四层分离、显式 decision |
| closure / reconciliation / handoff | C-MS-5 | 是 | local closure + immutable material |
| P1 容量 / 预热 / forensic | 00 E 类 | 否（后置） | residual / future |

### 实施范围表

| 范围项 | 固定分母 | 实施说明 |
|---|---|---|
| workspace | 7 模块 | 先 contracts/domain，再 application/infra，再 entry |
| protocol | 10/6/5/1/7 | 每类都有 contract、negative、replay 口径 |
| quality | 39 AC、9 VF | 绑定 phase/boundary；不生成真实结论 |
| evidence | 14 EV 实例 | 只定义路径和来源，不填 run |

### 非范围表

| 非范围 | owner | 防误入规则 |
|---|---|---|
| LLM loop、goal/plan、memory/checkpoint、tool execution | `L2-runtime` / `L2-tools` | 仅 ref / seam |
| member 主体与镜像内容 / 构建 | `L2-member` / `L2-member-images` | 不复制正文、不解析 role→image |
| sandbox backend / policy、governance approval | `L4-sandbox` / `L1-governance` | 只消费正式结果 / binding |
| identity / work / L1 领域 truth | `L1-identity` / `L1-work` | ref / safe summary / event |
| broker、数据库、观测后端、容器平台产品语义 | 基础设施 owner | adapter / fake，产品后置 |

## 回填草稿

正式 §2 应写明 P0 是宿主控制面和接缝的可验证实现路径，固定 7/29/10/6/5/1/7 分母和 39/9 门禁分母；未闭合 sibling 正向能力只能进入 blocked / residual，不得写成 ready。

## 待确认事项

- 是否在未来纳入非 ProjectMember-scoped host（当前版本保持 fail-closed）。
- policy 传递路径 owner（`MSVC-UP-005`）。
- P1 selected-run 的 workload、容量和观测 authority。

## 进入下一步条件

实施目标、P0/P1/P2 范围和非范围已锁定，允许进入 Step 3 前置条件与阅读矩阵。
