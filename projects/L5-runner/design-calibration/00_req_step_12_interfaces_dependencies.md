# 00 需求 Step 12 · 接口与依赖

> 状态：`completed`
> 前置：`00_req_step_06_consumers_dependencies.md`、`00_req_step_09_functional_requirements.md`、`00_req_step_11_data_ownership.md`
> 回填章节：正式 `00` §12 接口与依赖
> 粒度：能力级接口，不锁协议、DTO、API 路径、事件 payload 或实现 port。

## 1. 本步目标与约束

描述 Runner 对外提供哪些端侧能力面、消费哪些上游能力面、哪些边界属于同步查询/受控变更/事件协作/后台恢复。接口名称只写用户和系统可观察的能力，不重抄 Step 6 依赖表或滑入详细设计。

## 2. 对外能力接口

| 能力节点 | 对外能力接口（需求层） | 接口类型 | 支撑功能 |
|---|---|---|---|
| `CP-RUN-01` | 提供可信运行语境读取、显式 Release/version 选择、选择有效性和可见性反馈。 | 查询接口 + 变更接口 | `FR-RUN-001~002` |
| `CP-RUN-02` | 提供取得进度/失败姿态、cache 可消费状态、完整性/兼容性资格反馈。 | 查询接口 + 后台任务接口 | `FR-RUN-003~004` |
| `CP-RUN-03` | 提供正式受控运行请求、运行生命周期展示、启停/取消意图和结果确认入口。 | 变更接口 + 查询接口 | `FR-RUN-005~007` |
| `CP-RUN-04` | 提供本地资源冲突观察、清理/保护姿态、断线/重启恢复和 reconcile 入口。 | 查询接口 + 变更接口 + 后台任务接口 | `FR-RUN-008~010` |
| `CP-RUN-05` | 提供安全输出预览、失败诊断、来源/新鲜度解释和允许的 Observability handoff。 | 查询接口 + 变更接口 | `FR-RUN-011~013` |

这些接口对外保证的是 Runner-owned 状态和 owner-safe view 的组合，不承诺 Runner 拥有 Artifact、Governance、Runtime、Sandbox、Observability 或 Archive 真相。

## 3. 外部能力输入边界

| 关联方 | Runner 消费的能力级输入 | 依赖类型 | 是否核心前置 | 失效后果 |
|---|---|---|---|---|
| `L0-core` | 共享 ref、error、trace、metadata、版本语义。 | 编译期 | 是 | 无法稳定表达请求/来源；不应本地 shadow。 |
| `L0-sdk` | actor/context、正式服务访问、错误/redaction/trace 和版本兼容语境。 | 编译期 + 运行期 | 是 | 正式访问面不可用；不得直连或 fake-ready。 |
| `L1-artifact` | Release/version/baseline 摘要、可消费 locator/manifest/integrity authority、撤销/过期状态。 | 运行期 | 是 | 选择/下载/验证 blocked。 |
| `L1-governance` | approval/decision applicability、scope、expiry/revoke/conflict 结论。 | 运行期 | 是 | 不能建立 approved/baselined 资格。 |
| `L1-work` | project/context 安全引用和可见性。 | 运行期 | 条件 | 项目语境受限；不由 Runner 推断 ProjectMember。 |
| `L2-runtime` | execution status/result/recovery 的正式安全 view。 | 运行期 | 运行观察前置 | running/terminal 不可确认，只能 unknown/unavailable。 |
| `L4-sandbox` | request、boundary、policy、lease、controlled run、capture、cleanup/reconcile 的正式能力。 | 运行期 | 运行/清理前置 | 不得启动、停止或清理；不调用私有 backend。 |
| `L4-observability` | diagnostic view、handoff readiness/receipt、visibility/freshness、retention 约束。 | 运行期 | 诊断交接前置 | 只保留本地安全摘要；不生成 evidence/verdict。 |
| `L4-archive` | archive/restore 安全引用和状态（若合同开放）。 | 运行期 | 否（外围） | 不影响核心运行；不把 archive 当成功。 |
| `L0-bus` | 由正式 SDK/事件面封装的变化通知或协作信号。 | 事件协作 | 否/条件 | 本地刷新或 cursor 停滞；不把 delivery truth 当 Runner truth。 |

## 4. 接口类型口径

| 接口类型 | Runner 需求层使用口径 |
|---|---|
| 查询接口 | 读取 Release/authority、下载/cache、运行/资源/清理、输出/诊断和恢复安全 view；查询 no-write，不触发上游 repair 或副作用。 |
| 变更接口 | 提交用户选择、运行/停止/清理意图或 handoff 请求；返回 accepted/pending/confirmed/rejected/unknown 等可解释姿态，不等于 owner committed。 |
| 事件输入 | 仅在 SDK/正式事件协作面开放时接收状态变化；本地 cursor/dedupe 不等于 bus delivery/ack。 |
| 事件输出 | 仅在正式下游需要且合同开放时输出 Runner-owned local state/diagnostic handoff 变化；不得输出伪造的 Runtime/Sandbox/Artifact truth。 |
| 后台任务接口 | 用于受限下载恢复、cache 重建、状态对账、清理候选和本地诊断整理；不得借后台任务修复上游 truth。 |

## 5. 能力边界与依赖类型映射

| 能力边界 | 输入方 | 全局依赖类型 | 当前需求口径 |
|---|---|---|---|
| 共享契约与访问封装 | `L0-core` / `L0-sdk` | 编译期、运行期 | 仅 exact formal contract 可进入 package；SDK 是默认访问入口。 |
| Release/authority/完整性 | Artifact/Governance | 运行期 | 正向合同未闭合时保持 blocked；不在 Runner 发明 locator 或 approval。 |
| 受控运行与清理 | Sandbox/Runtime | 运行期 | 只提交和消费正式边界；`accepted ≠ running`。 |
| 诊断与交接 | Observability | 运行期 | 只提交安全摘要并显示 receipt；不生成正式证据。 |
| 变化协作 | Bus/SDK | 事件协作 | 只消费已授权变化信号；不拥有 delivery/replay。 |
| 下游产品展示 | Console/Chat/Sync | 运行期/引用 | 提供安全摘要/ref；下游不能反写 Runner 或 source truth。 |

## 6. 协议与实现后置清单

以下内容不在本需求 Step 固化：API 路径、方法名、Command/Query/DTO schema、HTTP/RPC/IPC transport、事件 topic/payload、订阅组、port/adapter trait、repository、cache provider、数据库、重试算法和具体配置。它们必须在后续 `01~04` 中以当前上游正式合同为输入重新校准。

## 7. 取舍与回填草稿

正式 §12 将包含对外能力接口表、外部依赖边界表、接口/依赖类型口径和后置清单。依赖关系不再复制 Step 6 全表；只说明每个能力边界如何映射全局依赖类型。

## 8. 自检与进入下一步门禁

- [x] 每个核心功能都有能力级接口或明确的上游输入边界。
- [x] 运行期、事件协作和编译期依赖没有混写。
- [x] Query no-write、正式 owner、unknown/blocked 语义已保留。
- [x] 未写 API 路径、DTO、事件 payload、port、数据库或实现协议。

`Step 12 gate_status = pass`；下一步允许进入 `Step 13 非功能需求`。
