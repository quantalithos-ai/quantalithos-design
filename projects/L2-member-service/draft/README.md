# L2-member-service · draft 定位讨论稿

> 目录性质: full-restart 前的系统定位讨论中间产物,不是正式 `00~07` 文档,不是设计基线。
> 生成模式: full-restart 预讨论;旧 README / 旧正式 `00/01/02/03/05/06` 仅作 historical_material 污染审计输入,不直接继承。
> 日期: 2026-08-20
> 状态: draft_reviewed_with_repairs;2026-08-21 用户同意审计结论与修复方向,不等于逐条签署正式基线。

---

## 一、本目录回答的问题

| 问题 | 文件 |
|---|---|
| 这个项目的作用是什么?边界在哪? | `01_project_role_and_boundary.md` |
| 它与哪些模块 / 项目有交互?依赖如何裁剪? | `02_interactions_and_dependencies.md` |
| 它需要具备哪些功能? | `03_capabilities.md` |
| 实现这些功能需要哪些模块?模块如何分层? | `04_module_layering.md` |

模块分层粒度参考 `projects/L1-governance/01-架构设计.md` §6(核心子域 / 支撑子域 / 本地索引投影引用层)和 `02-概要设计.md` §4/§5(代码主体框架 + 主要组成部分)。

## 二、讨论输入

正式上游(已完成校准,作为输入):

- `projects/L2-runtime/00~07`(停审):Runtime 不拥有 member host lifecycle;member 入口 surface 挂 `Q-L2R-001`。
- `projects/L4-sandbox/00~07`(停审):`MemberExecutionHost`、`SandboxBinding` 装配 truth、session / worker / health、host failure、callback material 明确归 `L2-member-service`。
- `projects/L2-tools/00~07`、`projects/L1-identity`、`projects/L1-work`、`projects/L1-governance`、`projects/L1-artifact`、`projects/L3-method-library`、`projects/L0-core` / `L0-bus` / `L0-sdk` 正式文档。
- `standards/document/全局项目依赖关系与裁剪规则.md`(Layer 3 并行窗口与依赖矩阵)。

并行兄弟(未停审,只能记 pending / contract placeholder):

- `projects/L2-member/`(旧 draft,容器内门面进程)
- `projects/L2-member-images/`(旧 draft,角色镜像构建资产)

historical_material(污染审计输入,不继承):

- 本仓旧 `README.md`、旧 `00-需求文档.md`、旧 `01-架构设计.md`、旧 `02/03/05/06`。

## 三、当前结论一句话

`L2-member-service` 是 AI 成员执行宿主与编排控制面真相仓:它把 identity / work 已成立的成员与项目事实,转化为受控的成员宿主实例(容器生命周期、注册接入、心跳健康、运行环境装配、Sandbox 绑定交接、重启恢复、宿主侧反馈),拥有 control plane 决定与 host truth,但不拥有 runtime run truth、member 主体 truth、镜像内容 truth、sandbox 隔离 truth、governance / policy truth 或任何 L1 领域真相。

## 四、后续动作

1. 按 2026-08-21 审计结论修复依赖 authority、宿主锚定和 Sandbox 执行 caller 边界。
2. `design-calibration/` 只能把本目录作为讨论输入;每个结论仍须经对应 Step 独立收敛,不得直接抄成正式结论。
3. 跨项目 pending(runtime 入口 surface、role/image 到 pinned image ref 的消费路径、policy 传递路径、launch credential owner、member / member-images 合同)在 00 的 Step 6 / Step 15 正式登记；非项目型宿主已由 Step 07 按“当前版项目型-only、未来扩展须重开”闭合范围。
