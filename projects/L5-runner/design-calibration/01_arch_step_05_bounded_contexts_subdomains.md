# 01 架构 Step 5 · 限界上下文与子域划分

> 状态：`completed`
> 前置：`01_arch_step_03_responsibility_boundary.md`、`01_arch_step_04_system_context.md`、正式 `00` §7/§9/§11
> 回填章节：正式 `01` §6 限界上下文与子域划分

## 1. 本步问题回答与划分原则

Runner 内部按语义责任划分，而不是按源码目录或技术组件划分。核心子域承载 Runner 自身必须拥有的本地意图和安全资格组合；支撑子域承接用户可见的资源、输出和诊断体验；本地索引/投影/引用只保存外部 owner 的安全影子，不拥有外部 truth。每个单元都必须继承 Step 3 的职责红线。

## 2. 子域 / 上下文划分表

| 名称 | 类型 | 作用 | 与其他部分的关系 |
|---|---|---|---|
| 选择与资格承接 | 核心子域 | 承载可信语境、显式 immutable version、authority applicability 和本地继续资格。 | 为取得、控制和展示提供不可越权的选择前提。 |
| 本地运行意图与生命周期 | 核心子域 | 承载 Runner-owned request/control intent、generation、用户可见生命周期姿态。 | 消费选择与资格，组合 owner status/ref，但不拥有 execution truth。 |
| 资源、清理与恢复保护 | 核心子域 | 承载本地资源观察、保护姿态、reconcile 和未知副作用冻结语义。 | 围绕运行意图提供清理与恢复安全，不替代 Sandbox cleanup owner。 |
| 取得与材料资格承接 | 支撑子域 | 承载下载/cache/quarantine/完整性和平台兼容性展示姿态。 | 依附选择与资格，向运行意图提供 qualified/not-qualified 结果。 |
| 输出预览与失败诊断 | 支撑子域 | 承载 redacted preview、失败分类、下一步解释和 handoff posture。 | 消费 owner-safe refs/summaries，不拥有 raw output 或 evidence。 |
| 端侧入口与展示 | 支撑子域 | 承载 GUI/CLI/其他入口的用户交互和安全状态呈现。 | 只消费核心/支撑上下文的公开 view，不直接绕过边界。 |
| Owner 状态与来源引用影子 | 本地索引 / 投影 / 引用 | 保存 Release、Governance、Sandbox、Runtime、Observability、Archive 的安全 snapshot/ref/freshness。 | 被各上下文消费，不能反写或替代外部真相。 |
| 本地平台能力影子 | 本地索引 / 投影 / 引用 | 保存端口、路径、容量、应用生命周期等短时观察及 capability posture。 | 支撑资源冲突解释，不成为 scheduler/allocation/lease truth。 |

## 3. 上下文关系图

#### 上下文关系图

```text
                 +--------------------------+
                 | 选择与资格承接           |
                 | 核心子域                 |
                 +------------+-------------+
                              |
                              v
                 +--------------------------+
                 | 本地运行意图与生命周期   |
                 | 核心子域                 |
                 +------------+-------------+
                              |
                              v
                 +--------------------------+
                 | 资源、清理与恢复保护     |
                 | 核心子域                 |
                 +------------+-------------+
                              |
              +---------------+----------------+
              v                                v
 +--------------------------+     +--------------------------+
 | 取得与材料资格承接       |     | 输出预览与失败诊断       |
 | 支撑子域                 |     | 支撑子域                 |
 +-------------+------------+     +-------------+------------+
               |                                |
               +---------------+----------------+
                               v
                 +--------------------------+
                 | 端侧入口与展示           |
                 | 支撑子域                 |
                 +-------------+------------+
                               |
                               v
                 +--------------------------+
                 | Owner 状态/来源影子      |
                 | 本地索引/投影/引用       |
                 +--------------------------+
```

图后说明：

- 图表达 Runner 内部核心子域、支撑子域和本地影子结构的主要依附关系。
- Owner 状态/来源影子和平台能力影子不拥有外部真相，只为上层提供安全引用和 freshness。
- 图不表达对象字段、数据库表、代码模块、接口协议或运行时调用顺序。

## 4. 单上下文停审记录

| 单元 | 停审结论 |
|---|---|
| 选择与资格承接 | 核心；不批准、不修改 Release/Governance，只组合正式适用性与本地选择。通过。 |
| 本地运行意图与生命周期 | 核心；拥有意图和展示姿态，不把 owner ACK/PID 变成 running。通过。 |
| 资源、清理与恢复保护 | 核心；拥有保护/对账姿态，不拥有 Sandbox cleanup 或全局资源调度。通过。 |
| 取得与材料资格承接 | 支撑；传输完成与验证完成分离，不把 cache 当 authority。通过。 |
| 输出预览与失败诊断 | 支撑；redaction/body bound，不生成 evidence/report/verdict。通过。 |
| 端侧入口与展示 | 支撑；不直接调用外部私有实现，不保存敏感正文。通过。 |
| Owner 状态与来源引用影子 | 本地影子；不反写、不升级外部 truth。通过。 |
| 本地平台能力影子 | 本地影子；观察有 freshness，不等 allocation/lease。通过。 |

## 5. 跨上下文语义边界审计

| 审计项 | 结果 |
|---|---|
| 核心/支撑误归类 | 通过；选择、意图、资源保护为核心，其余为支撑或影子。 |
| 本地影子误作真相 | 通过；所有 owner status/ref 和平台观察均显式标 snapshot/ref/observation。 |
| 职责重叠 | 通过；入口展示不拥有意图，诊断不拥有 execution，资格不拥有 Release。 |
| 统一语言冲突 | 通过；Runner-owned intent、owner status/ref、local observation、qualified、reconcile 等术语保持分层。 |
| 待确认项 | 保留 RUN-UP-001~008，不在上下文划分中补造协议。 |

## 6. 统一语言结论

| 术语 | 架构含义 |
|---|---|
| Runner-owned intent | 用户选择、运行/控制意图及其 generation/correlation，由 Runner 拥有。 |
| owner status/ref | 来自 Artifact/Governance/Runtime/Sandbox/Observability/Archive 的安全状态或引用，不转移 ownership。 |
| local observation | 端侧 probe、平台能力和连接观察，带 freshness，不是全局 truth。 |
| qualified material | 通过正式 authority、完整性和平台资格判断的本地可用材料姿态。 |
| reconcile/manual-review | 副作用未知或 owner 状态不一致时的安全处理姿态。 |
| protected material | 受 lease/capture/handoff/retention/orphan 约束、不可直接淘汰的本地材料。 |

## 7. 回填草稿与门禁

正式 §6 回填划分表、上下文关系图、停审和统一语言。后续 Step 6 只能把这些语义单元映射为正式运行承载角色，不得把它们直接变成代码模块或容器名称。

- [x] 每个单元有职责、类型和关系。
- [x] 核心、支撑、本地影子分类通过单元停审。
- [x] 图符合架构图规则并有图后说明。
- [x] 跨单元没有 truth、职责或术语冲突。

Step 5 gate_status = pass；下一步允许进入 Step 6 容器/部署架构。
