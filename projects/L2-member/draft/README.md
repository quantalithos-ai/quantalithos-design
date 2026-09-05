# L2-member draft 预推演目录

> 目录状态: `draft / pre-calibration`
> 日期: 2026-08-20
> 作用: 在进入正式 `00-需求文档.md` 校准(full-restart)之前,先把"本仓作用、交互对象、功能、模块与分层"想清楚,作为后续 `design-calibration/` Step 1~17 的讨论输入。
> 本目录不是正式设计真相源,不进入正式追溯链;正式结论以后续 `00~07` 停审版本为准。
> 本目录不声明实现、测试结果、evidence、readiness 或任何上游 blocker 已解决。

---

## 1. 阅读顺序

| 文件 | 回答的问题 |
|---|---|
| `01_项目作用与交互对象.md` | 这个项目的作用是什么;与哪些模块 / 仓交互;依赖如何分类裁剪;旧材料哪些不能继承 |
| `02_功能推演.md` | 这个项目需要具备哪些功能(能力闭环 + 候选功能清单 + 失败语义 + 非目标) |
| `03_模块划分与分层.md` | 实现这些功能需要哪些模块;模块如何分层(参考 `L1-governance` 概要设计的组成部分与实现分层) |

## 2. 本次推演的输入与状态

| 输入 | 状态 | 用法 |
|---|---|---|
| `standards/document/全局项目依赖关系与裁剪规则.md` | 正式 authority | 依赖类型(compile / runtime / event)与裁剪格式 |
| `projects/L2-runtime/00-需求文档.md` ~ `07-实施计划.md` | 正式,已停审 | Runtime loop / context / plan / outcome 消费边界的唯一来源 |
| `projects/L2-tools/00-需求文档.md` ~ `07-实施计划.md` | 正式,已停审 | 工具行动契约的 owner 边界(本仓只可能以 ref / safe view 消费) |
| `projects/L1-governance/00~07` + `02-概要设计.md` | 正式 | Policy effective / Decision 消费口径;模块分层样板 |
| `projects/L1-identity`、`projects/L1-conversation` 正式文档 | 正式 | 成员身份锚点、对话真相边界 |
| `projects/L0-core`、`projects/L0-bus`、`projects/L0-sdk` 正式文档 | 正式 | 共享契约类别、事件协作主干、下游 SDK 边界 |
| `projects/L2-member-service/00~06`(旧格式) | **pending / 未重校准** | 只作兄弟边界参考,宿主生命周期契约记 blocker,不吸收其旧结论 |
| `projects/L2-member-images/00~06`(旧格式) | **pending / 未重校准** | 只作打包边界参考,记 pending |
| 旧 `projects/L2-member/README.md`、旧 `00/01/02/03/05/06` | **historical_material** | 只作污染审计输入,逐项核对,见 `01_项目作用与交互对象.md` §6 |

## 3. 纪律

- 本目录只修改 `projects/L2-member/draft/` 下的文件,不改正式文档、不改兄弟目录、不提交 commit。
- 所有依赖必须按 compile / runtime / event / ref / adapter / fake 分类;运行期与事件协作不得伪装成 package dependency。
- 未稳定的兄弟边界(member-service、member-images)与未闭口的上游 seam 一律记 pending / blocker,不私自补真相。
- 旧 README 的 CloudEvents、AG-UI、UDS、launch_token、P95 数字、Rust / supervisord 等内容未经当前上游核验不得继承。
