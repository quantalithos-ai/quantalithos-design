# L2-member-images · draft 设计稿目录

> 状态: `approved draft / historical input for 00`
> 创建日期: 2026-08-20
> 最近修订: 2026-08-21
> 设计模式: `full-restart`(旧 README 与旧正式 `00/01/02/03/05/06` 仅作 historical_material 与污染审计输入)
> 本目录回答: 本项目的作用是什么、与哪些模块交互、需要具备哪些功能、实现功能需要哪些模块、模块如何分层
> 本目录不是真相源: 正式结论以后续按 SOP 生成的 `00~07` 正式文档为准;本目录只承载进入 `00-需求文档.md` 前的定位、边界、能力与模块推演

---

## 1. 文件导航

| 文件 | 回答的问题 | 状态 |
|---|---|---|
| `01_定位与作用.md` | 本项目的作用是什么;拥有什么真相;禁止拥有什么 | approved / historical_input |
| `02_交互与依赖.md` | 与哪些模块 / 项目交互;依赖类型分级;禁止依赖;pending 输入 | approved / historical_input |
| `03_功能与能力闭环.md` | 需要具备哪些功能;核心能力闭环草案 | approved / historical_input |
| `04_模块划分与分层.md` | 实现功能需要哪些模块;模块如何分层(参考 `L1-governance` 粒度) | approved / historical_input |
| `05_旧材料差异审计与待确认.md` | 旧材料哪些保留 / 废弃 / 后移;上游 blocker 与待确认清单 | approved / historical_input |

## 2. 讨论输入

本 draft 基于以下当前输入及其台账状态(复核时点 2026-08-21):

| 输入 | 状态 | 用途 |
|---|---|---|
| `standards/document/设计文档编写通则.md` / `设计文档讨论中间产物规范.md` / `设计真相源闭环与可落码性标准.md` / `全局项目依赖关系与裁剪规则.md` | 正式标准 | 讨论纪律、依赖裁剪口径、真相源唯一 |
| `projects/L2-runtime/00~07` | 正式设计链完成,停在 07 stop review;实现未启动 | Runtime 运行边界、owner / seam 口径样板 |
| `projects/L2-tools/00~07` | 正式设计链完成,停在 07 stop review;实现 blocked / not_started | 工具契约边界;“Role extras / 具体工具库存”为其非目标 |
| `projects/L3-method-library/00~07` | 正式设计链可作设计输入;当前 implementation boundary 因 exact contract 缺口 blocked | RoleDefinition、Role -> image variant 定义来源归属;不得把实现状态写成 readiness |
| `projects/L1-artifact/00~06` + 当前 `07` | `00~06` 已完成;`07` 已装配并等待用户审查 | Artifact 正文 / 版本 / 血缘 / 基线 truth;正式 `ConsumableArtifactReference`;image handoff 用法仍 pending |
| `projects/L4-sandbox/00~07` | 设计静态审计完成;baseline 未发布、实现未激活 | 隔离执行边界;加固基础镜像为演进项输入,不声称实现 ready |
| `projects/L1-governance/00~07` | 正式完成 | 实施粒度参考(组成部分 + 实现分层) |
| `projects/L0-core/00~07` | 正式完成 | 共享契约类别 authority |
| `projects/L2-member/`、`projects/L2-member-service/` | 旧式文档,未重校准 | **pending 输入**,不得写成已闭合合同 |
| `architecture/adr/0005-member-image-per-role.md` | Accepted ADR | 一 Role 一镜像、每晚 CI、映射归方法库、版本 pinned、生产禁 `latest`;不锁定固定 Role 数量 / 工具清单与 registry 产品 |
| 本项目旧 README / 旧 `00/01/02/03/05/06` | historical_material | 仅差异审计,见 `05_旧材料差异审计与待确认.md` |

## 3. 与正式链的关系

```text
draft/(本目录: 定位 / 交互 / 功能 / 模块推演)
   |
   | 用户确认后, 作为 00 需求讨论的输入之一
   v
design-calibration/00_req_*(按需求 SOP Step 1~17 校准)
   |
   v
00-需求文档.md(full-restart 重写, 停审)
   |
   v
01 -> 02 -> 03 -> 04 -> 05 -> 06 -> 07(逐文档串行, 每文档停审)
```

- draft 中的任何结论进入正式文档前,仍必须经对应 SOP Step 的问题回答、诊断、取舍和自检,不得直接粘贴。
- draft 中标注 `pending` / `待确认` 的条目不得在正式文档中被写成已闭合结论。

## 4. 2026-08-21 修订摘要

本轮根据用户确认的审阅意见完成以下校正,但这些校正本身仍只是 pre-00 draft:

1. 恢复 ADR-0005 authority:nightly、一 Role 一镜像、映射归方法库、版本 pinned、生产禁 `latest` 不再被错误降为 historical。
2. 恢复全局事件方向:当前只确定本仓按需**消费**镜像构建事件;出站构建 / 发布事件保持 pending。
3. 收紧 Artifact 边界:本仓拥有镜像域 build / digest / eligibility / availability 绑定;Artifact 正文、版本、血缘与基线归 `L1-artifact`,只引用正式 `ConsumableArtifactReference`,精确 image handoff schema pending。
4. 将 governance 六层改为责任适用性检查,不预设每个组成部分都有常驻服务、独立 persistence 或 outbox。
5. 将 BOM / 扫描 / 签名改为待正式 policy 确权的供应链证据候选;digest / provenance 仍是任务明确的主线,未确权结论不得伪报 passed / ready。
