# 00 需求 Step 2 · 本仓定位与边界

> 状态：`completed`
> 前置：`00_req_step_01_upstream_relationship.md`
> 回填章节：正式 `00` §2 本仓定位与边界

## 1. 本步目标

建立 Runner 的最小仓级心智，防止后续需求把端侧运行入口误写成 Artifact/Release owner、Governance approval owner、Runtime execution owner、Sandbox enforcement owner 或 Observability evidence owner。

## 2. 输入与诊断

- Step 1 已确认的产品、架构、依赖和专项上游来源。
- `draft/01_项目作用与交互对象.md` 的定位、拥有/消费/禁止拥有表。
- `draft/02_功能推演.md` 的核心闭环方向。
- 旧 Runner `README.md` 与 `00~06` 的历史污染：Tauri/Electron、Docker/gVisor/Firecracker、`latest`、冷/热启动数字、RunnerRun 作为真相、直接 SandboxService 等。

## 3. 应问的问题与回答

### 3.1 一句话定义

`L5-runner` 是用户在端侧选择并运行一个已获正式授权、可验证且不可变的软件 Release/Artifact 版本的产品入口；它拥有本地运行请求、下载/cache、完整性验证、控制意图、展示状态、资源视图、输出预览、诊断和恢复姿态。

### 3.2 为什么需要单独成仓

Runner 必须把端侧准备和用户控制体验与服务端发布、治理、执行、隔离、观测和归档真相隔离。若没有独立 Runner，产品容易直接把下载目录、进程句柄、端口、Sandbox ACK 或本地日志误当成批准、运行成功和审计证据；若越界，则会形成第二个 Release、Execution 或 Sandbox 真相中心。

### 3.3 本仓不是什么

Runner 不是 Artifact/Release 真相仓、Governance approval/Decision 真相仓、Project/Work 真相仓、Runtime execution truth、Sandbox isolation/enforcement truth、Observability audit/evidence truth 或 Archive package/restore truth；也不是 SDK、事件总线、Sandbox 私有 backend、桌面框架或部署编排 owner。

### 3.4 最易混淆边界

| 边界对象 | Runner 的非职责结论 |
|---|---|
| 仓：`L1-artifact` | Runner 消费正式 Release/version/baseline 引用和完整性 authority，不创建、修改或冻结 Artifact truth。 |
| 仓：`L1-governance` | Runner 消费 approved/baselined authority chain，不本地推断 approval、scope、expiry 或 revoke。 |
| 仓：`L2-runtime` | Runner 保存端侧运行请求和展示，不拥有 Runtime loop、checkpoint、outcome 或 execution truth。 |
| 仓：`L4-sandbox` | Runner 发起正式 Sandbox 请求并展示结果，不直接调用私有实现，不拥有 boundary、policy、lease、cleanup 或 redline truth。 |
| 仓：`L4-observability` | Runner 可交接安全诊断摘要，不把本地日志、stdout/stderr 或 telemetry 变成 audit/evidence/report/verdict。 |
| 概念：`latest` / 默认版本 | 只能作为非权威候选提示，不能成为实际运行选择。 |
| 概念：本地 PID/端口/cache | 只能表达端侧观察和资源视图，不能表达上游运行、调度或批准真相。 |

## 4. 结构化中间产物：边界声明表

| 字段 | 结论 |
|---|---|
| 一句话定义 | Runner 是端侧已授权软件产物的运行入口与本地运行体验。 |
| 本仓不是什么 | 不是 Release/Artifact、Governance、Runtime、Sandbox、Observability、Archive 或 SDK 真相 owner。 |
| 边界对象列表 | 仓：`L1-artifact`、`L1-governance`、`L2-runtime`、`L4-sandbox`、`L4-observability`、`L4-archive`、`L0-sdk`；概念：`latest`、本地 cache、PID/端口、Sandbox ACK、本地日志。 |
| 单独成仓原因 | 端侧运行准备、控制、资源与恢复体验需要独立于服务端事实和隔离实现，避免产品状态越界成系统真相。 |

## 5. 取舍与未采用方案

- 采用“端侧产品入口 + 本地状态/意图”定位，不采用旧文档的“runtime/capability hub 运行体验层”泛化定位。
- 采用“消费 Release authority”定位，不采用 Runner 本地创建 Release、修改 Release 或把 cache 当 Release truth。
- 采用“Sandbox 公开边界消费者”定位，不采用直接管理 Docker/gVisor/Firecracker 或编译 Sandbox 私有实现。
- 采用“安全诊断摘要/hand-off 消费者”定位，不采用本地日志回传即审计证据。

## 6. 回填草稿

正式 §2 使用规范要求的“边界声明表 + 一段边界说明”。具体功能、依赖、能力闭环、规则、数据和接口全部后置，不在本章展开。

## 7. 自检与进入下一步门禁

- [x] 定义不超过 3~5 句的仓级定位。
- [x] 明确列出不拥有的相邻 truth 与概念边界。
- [x] 说明单独成仓原因，但未滑入技术选型或接口方案。
- [x] 未把依赖关系、功能清单、数据矩阵或核心闭环写成正式边界表。

`Step 2 gate_status = pass`；下一步允许进入 `Step 3 背景与问题定义`。
