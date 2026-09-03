# Step 2. 本仓定位与边界

## 1. Step 状态

| 当前模块 | gate_status | gate_reason | next_allowed_action | source_files |
|---|---|---|---|---|
| `truth_ownership_boundary` | pass | 一句话定义、非职责、易混淆对象和独立成仓原因已收敛;静态资产与运行时 live state 红线明确 | 进入 Step 3 背景与问题定义 | `00_req_step_01_upstream_relation.md`;`draft/01_定位与作用.md`;相邻 owner 正式 00 |

### 1.1 Step 内计划

- [x] 读取需求 SOP Step 2 与书写规范 §4.2。
- [x] 从 Step 1 authority 重新推导一句话定位,不直接复制 draft。
- [x] 逐一核对 runtime、tools、method-library、artifact、member-service、sandbox 易混淆边界。
- [x] 区分本仓镜像域 truth、外部 ref 和禁止拥有 truth。
- [x] 后置审计旧“纯 CI 产出仓”定位。
- [x] 形成正式章节固定表、短说明和越界自检。

## 2. 本步输入

| 输入 | 已闭合结论 | 本步限制 |
|---|---|---|
| Step 1 | authority / pending / historical 已分层 | 不用低层输入覆盖 owner authority |
| ADR-0005 | 构建期预装与独立 member-images 仓成立 | 不继承固定 Role 清单、产品和数字 |
| method-library | Role -> variant 定义来源归其所有 | 本仓不得成为 mapping 定义 owner |
| artifact | 通用 Artifact truth / version / lineage / baseline 归其所有 | 本仓只拥有镜像域绑定和正式 ref |
| runtime / tools / sandbox | runtime loop、tool contract / execution、isolation truth 各有 owner | 不吸收 live state 或外部执行 truth |
| member / member-service | 被装配 / 消费方向存在但合同 pending | 不声明已闭合 manifest / IPC |

## 3. SOP 问题回答

1. 本仓一句话定义是什么?

   回答:`L2-member-images` 是 AI 成员运行层中的成员镜像资产与构建产物供给层,负责把受控 Role 映射和已固定版本的静态装配输入转化为可追溯、可发布、可回滚且可被实例化消费的镜像供给事实。

2. 为什么需要单独成仓?

   回答:构建期静态资产需要独立于 member-service 的宿主编排、runtime 的运行循环和 Artifact 的通用事实生命周期被维护;否则装配定义、输入 pin、digest / provenance 与运行时 live state 会混成多写源。

3. 本仓不是什么?

   回答:它不是成员主体、运行循环、工具执行 / registry、外部 adapter truth、live memory / checkpoint、容器生命周期、sandbox、governance、observability、marketplace 或产品入口,也不是第二个通用 Artifact 仓。

4. 最容易与哪些相邻仓或概念混淆?

   回答:与 method-library 混淆 mapping 定义 owner;与 artifact 混淆版本 / 血缘 owner;与 member-service 混淆镜像供给和容器实例化;与 runtime / member 混淆静态 seed 与 live state;与 tools 混淆工具合同和角色装配清单;与 sandbox 混淆镜像加固资产和隔离执行真相。

## 4. 当前文档问题诊断

| 旧 / 候选表述 | 问题 | 当前处理 |
|---|---|---|
| “Dockerfile + CI 脚本的纯产出仓” | 无法承载 variant、input pin、provenance、availability 和交接 truth | 升级为镜像资产与构建产物供给层 |
| “本仓拥有镜像版本” | 可能与 `ArtifactVersion` 冲突 | 限定为 variant revision / 镜像域绑定;通用 version truth 归 artifact |
| “本仓维护 Role 镜像清单” | 容易 hardcode Role / mapping truth | 只维护 variant 目录并消费方法库正式映射 |
| “本仓发布镜像供 member-service 启动” | 容易吸收容器 lifecycle 与下游选择 | 只拥有供给 availability / handoff;实例化决定归 member-service |
| “seed 进入镜像” | 容易把 live memory / workspace / policy truth 写入本仓 | 只承接模板 ref、版本与落位事实 |

## 5. 改动前后对比

| 维度 | 旧定位 | 当前定位 |
|---|---|---|
| 核心主体 | CI 文件集合 | 镜像域静态资产 truth + 构建产物供给语义 |
| Role 关系 | 本仓固定 Role 列表 | 方法库定义映射,本仓受控消费 |
| 版本 / 血缘 | 本地 release 概念未分层 | 镜像域 revision / binding 与 Artifact 通用 truth 分层 |
| 下游关系 | 构建后通知并由服务启动 | 本仓只供给可实例化入口;容器生命周期归下游 |
| 状态边界 | 未区分静态与运行态 | template / seed / build output 与 live state 严格隔离 |

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 纯 CI 仓 | 简单 | truth 散落在脚本 / registry;无法解释派生、门禁、回滚 | 不采用 |
| 合并到 member-service | 仓少 | 混合静态供应与容器生命周期,形成职责冲突 | 不采用 |
| 镜像资产 truth + 构建产物供给层,通用 Artifact 走正式 ref | owner 清晰,可审计,不复制 Artifact truth | 后续需闭合多个 ref / adapter seam | 采用 |

## 7. 结构化中间产物

### 7.1 边界声明表

| 字段 | 内容 |
|---|---|
| 一句话定义 | `L2-member-images` 是 AI 成员运行层中的成员镜像资产与构建产物供给层。 |
| 本仓不是什么 | 它不是成员主体、runtime loop、tool execution / capability registry、外部 adapter truth、live state、容器 lifecycle、sandbox / governance / observability truth、marketplace、产品入口或通用 Artifact truth 仓。 |
| 边界对象列表 | 仓:`L3-method-library`;仓:`L1-artifact`;仓:`L2-runtime`;仓:`L2-tools`;仓:`L2-member`;仓:`L2-member-service`;仓:`L4-sandbox`;概念:template / seed / build output;概念:runtime live state。 |
| 单独成仓原因 | 平台需要把 Role 运行环境的构建期静态装配与供给事实从运行编排、运行内容和通用制品生命周期中独立出来。 |

### 7.2 Truth 边界摘要

| 归类 | 需求层结论 |
|---|---|
| 本仓拥有 | image family / variant 与 persona 装配定义、组件 / extras / seed 落位绑定、variant revision / 派生、build input-output / digest / provenance 绑定、镜像供给 eligibility / availability / rollback / retire 语义 |
| 本仓只消费 / 引用 | RoleDefinition 与 Role mapping、组件发布产物、seed 模板来源、正式 Artifact 消费引用、外部构建 / registry / evidence 结果 |
| 本仓禁止拥有 | 相邻仓正文和生命周期、运行时 live state、实际容器 / sandbox / tool execution、approval / observed / marketplace / product truth |

### 7.3 静态资产与 live state 红线

```text
template / seed / pinned component / build input
  -> 本仓可承接其静态身份、版本、落位和构建绑定

container / run / turn / live memory / checkpoint / heartbeat / execution result
  -> 永远属于运行期 owner,不得进入本仓 truth
```

## 8. 回填草稿

正式 00 §2 固定使用 §7.1 的四行边界声明表,随后用一段短文字说明:本仓单独存在是为了让构建期静态资产与 runtime / member-service live truth 分开;它与方法库、Artifact 和下游编排的边界必须保持单一 owner。正式章节不展开 §7.2 的详细数据归属,该内容后移 Step 11。

## 9. 待确认事项

| ID | 事项 | 是否影响定位 |
|---|---|---|
| `MI-UP-001/003/007` | 下游 manifest、mapping 消费面、Artifact handoff exact contract | 否;影响后续接口 / readiness,不改变本仓定位 |
| `MI-UP-006` | seed 定义来源 owner | 否;本仓始终只承接模板,不拥有正文 |
| `Q-MI-003/004` | adapter 产品与 evidence kind | 否;不影响产品中立的供给层定位 |

## 10. 进入下一步条件

| 检查项 | 结果 |
|---|---|
| 3~5 句话能否说明定位 | pass |
| 是否至少识别两个易混淆边界 | pass;已覆盖六个相邻 owner 与两个概念 |
| 是否严格区分静态资产与 live state | pass |
| 是否提前写依赖、功能、接口或 schema | no |
| 是否形成第二套 Artifact truth | no |

`gate_status = pass`;允许创建 Step 3,不得跳到 Step 4 或修改正式 00。
