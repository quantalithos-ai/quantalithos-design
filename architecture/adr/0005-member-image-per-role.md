# ADR-0005:AI Member 容器镜像按 Role 预构建

> Status: **Accepted**
> Date: 2026-05-08
> Deciders: Aris
> Consulted: 本轮 AI Member 架构讨论第 6 轮(两个仓存在意义)
> Informed: L2 `member` / `runtime` / `tools` / `member-images` / `member-service` 所有仓

---

## 1. 背景

AI Member 是运行在独立容器里的 AI 员工。**每次启动一个 Member 容器**,需要装载:

```
python:3.12-slim
+ quantalithos-member(Rust 静态二进制)
+ quantalithos-runtime(Python 包)
+ quantalithos-tools[code, git, sandbox, lsp-python, test, ...]
+ apt 级依赖(nodejs / gcc / git)
+ role 特定工具(QA 需要 pytest / coverage,Frontend 需要 npm 生态)
```

若**启动时现装**,每个 Member 冷启动约 3-5 分钟(apt + pip + npm),用户体验崩塌。

另有一个假设需要澄清:"项目成员不固定" —— 意思是**哪些 GlobalMember 参与哪个项目**不固定,**每个 Role 的运行环境**是稳定的(Role 是有限枚举)。

## 2. 决策

**`quantalithos-member-images` 仓每晚 CI 构建"一 Role 一镜像"的镜像集合**,`member-service` 启动 Member 容器时直接拉取对应 Role 镜像,不做运行时安装。

### 2.1 镜像集合

```
ai-member-base:{version}            基础层,所有 Role 共享
  └─ python:3.12-slim
  └─ quantalithos-member(Rust 静态二进制)
  └─ quantalithos-runtime 核心
  └─ supervisord 配置

ai-member-tech-lead:{version}       基于 ai-member-base
  └─ tools:代码审查 / 架构评估 / 协作协调

ai-member-backend-dev:{version}     基于 ai-member-base
  └─ tools:code / git / sandbox / lsp-python+go+rust / test / db-client

ai-member-frontend-dev:{version}    基于 ai-member-base
  └─ tools:code / git / sandbox / lsp-typescript / npm / playwright

ai-member-qa:{version}              基于 ai-member-base
  └─ tools:test-framework / coverage / pytest / vitest / e2e

ai-member-devops:{version}          基于 ai-member-base
  └─ tools:docker / kubectl / terraform / helm

ai-member-ux:{version}              基于 ai-member-base
  └─ tools:figma-export / prototype-gen / screenshot

ai-member-auditor:{version}         基于 ai-member-base(ISO 42001 内部审计)
  └─ tools:log-analyzer / evidence-collector / compliance-check

ai-member-assistant:{version}       基于 ai-member-base
  └─ tools:browse / search / docs-read
```

**命名约定**:`ai-member-<role-kebab-case>:{semver}`

### 2.2 `member-service` 启动流程

```
请求:start ProjectMember(global_member_id, project_id, role)
  1. 查身份域得 Role
  2. 查方法库得 Role 的 image_variant(默认 role 本身,可 override)
  3. docker pull ai-member-<image_variant>:<pinned_version>  (多数命中本地 cache)
  4. docker run 挂载:
     - member_id 作为 label
     - project_id 作为 env
     - launch_token 作为 secret
     - workspace volume
     - bus client config
  5. 等待容器内 Member 进程的 Register RPC 到 member-service
  6. 登记 Endpoint Registry,开始心跳
```

## 3. 理由

### 3.1 冷启动性能

| 方案 | 冷启动时间 | 镜像大小 | Docker cache 效果 |
|---|---|---|---|
| 运行时现装 | 3-5 分钟 | 基础层仅 100MB | 命中率低(每次都装) |
| **本 ADR:Role 预构建** | **2-8 秒** | 400-600 MB | 命中率高(本机已拉过 Role 镜像) |

本方案把"装"的代价推到 CI 时期,把"跑"的代价压到最低。

### 3.2 Role 是稳定枚举

产品叙事里的 Role 集合是**有限的、慢变的**:Tech Lead / Backend Dev / Frontend Dev / QA / UX / DevOps / Auditor / Assistant。新增 Role 的频率以月计,不以小时计。每晚 CI 构建能轻松跟上变化速率。

### 3.3 image layer 复用

`ai-member-base` 作为底层,被 9 个 Role 镜像共享。Docker 层级缓存意味着:
- 本机拉过**任何一个** Role 镜像,再拉其他 Role 只增量几十 MB
- 每晚 CI 的增量构建通常只改动顶层一两层(不是整个镜像)

### 3.4 项目不绑定到某一套镜像

当"哪些 Member 参与项目 A"是运行时决策(由 Assistant 招聘),而不是镜像决策。所以项目不固定,但 Role 集合固定。

## 4. 不采纳的替代方案

| 替代 | 为什么不采纳 |
|---|---|
| 运行时现装 | 冷启动 3-5 分钟,不可接受 |
| 一个大镜像装所有工具 | 镜像 > 2 GB;权限隔离差(QA 不该有 DevOps 工具) |
| 一个容器一个镜像 | 没有意义,容器和镜像 1:1 但 Role 多次用同一镜像 |
| 每项目定制镜像 | 项目数可能成百上千,CI 负担爆炸;与"Role 稳定"的现实不符 |
| Nix-based reproducible env | 学习曲线和生态成本太高,YAGNI |

## 5. 后果

### 5.1 正面

- Member 冷启动 < 10 秒,符合产品体验
- 镜像是**审计证据**的一部分(固定版本 + image digest 存入归档包)
- 权限隔离天然:镜像里没有的工具,运行时也用不了
- CI 每晚跑一次,构建基础设施成熟

### 5.2 负面

- **`member-images` 仓独立存在** — 多一个仓需要维护
- **镜像与 runtime / tools 版本耦合** — 每次 runtime 或 tools 发版需要重建镜像
- **ProjectMember 的 tool_scope 只能是镜像工具的子集** — 不能在运行时动态加工具(这是刻意的,不是 bug)
- **初始镜像构建耗时** — 9 个 Role × 500 MB,首次构建约 20 分钟

### 5.3 风险缓解

- runtime / tools 发版 → 触发 member-images CI → 自动产出对应版本镜像 tag
- tool_scope 的"不能加"在产品叙事里是合理的:**Role 决定能力上限**,不应允许运行时升级权限
- 初始构建 20 分钟一次性成本可接受
- 镜像仓使用 registry + CDN,全球拉取成本可控

## 6. 约束与边界

- **本 ADR 锁定**:Role → image_variant 的映射关系在方法库中配置,不在 member-service 硬编码
- **本 ADR 锁定**:镜像版本必须 pinned,`latest` tag 禁用于生产
- **本 ADR 不锁定**:具体 9 种 Role 的工具清单(由 `domain/identity/role-catalog.md` 定稿)
- **本 ADR 不锁定**:镜像 registry 选型(由 L4 infra 决策)

## 7. 标准对齐

- **SPEM 2.0**:Role → Method Content → 镜像清单,直接映射
- **ISO 42001** A.3 Tooling Resources:镜像作为工具清单的"具象",被组织级治理
- **ISO 42001** A.6 AI System Life Cycle:镜像版本作为 Deployment 阶段的审计对象
- **`feedback_red_lines.md` 可追溯性**:镜像 digest 进审计事件,任何 Member 行为都能追溯到"哪个镜像运行的"
- **`architecture/架构设计.md` §6 演进性**:镜像和 runtime 版本独立演进,互相兼容性靠 semver

## 8. 参考

- 讨论回溯:本轮会话中 AI Member 架构的第 6 轮("member-images 和 member-service 存在意义")
- ADR-0004(GlobalMember vs ProjectMember)— Role 属于 GlobalMember,项目绑定属于 ProjectMember
- `methodology/standards-discussion/SPEM-2.0.md` — Method Content 概念
- `methodology/standards-discussion/ISO-42001.md` §4.3 A.4 资源族
- 未来:ADR-0006(Role 目录与工具清单治理机制)
