# L2-tools 07 实施计划 Step 1：确认实施输入边界

## Step 状态

`accepted`

## 本步输入

| 输入 | 来源 | 状态 | 说明 |
|---|---|---|---|
| 需求基线 | `projects/L2-tools/00-需求文档.md` | 已确认 | 当前正式 full-restart 文档；旧 README/旧正文只作 historical material。 |
| 架构基线 | `projects/L2-tools/01-架构设计.md` | 已确认 | owner、依赖方向、写权和运行接缝已收口。 |
| 概要基线 | `projects/L2-tools/02-概要设计.md` | 已确认 | 六业务组成部分、41 对象、七工程模块和协议总量已收口。 |
| 详细设计基线 | `projects/L2-tools/03-详细设计.md` | 已确认 | 提供字段来源、callable、Store/Port、flow、state、事务、配置和观测入口。 |
| 配置基线 | `projects/L2-tools/04-配置设计.md` | 已确认 | ten roots、54 items、profile/source/activation/failure 口径已收口。 |
| 测试基线 | `projects/L2-tools/05-测试方案.md` | 已确认 | 234 concrete TC、11 P0 suite、11 mandatory checks、artifact/report 规则。 |
| 验收基线 | `projects/L2-tools/06-验收标准.md` | 已确认 | 39 AC、13 VF、24 evidence gate、16 residual、三维裁决和签署状态机。 |
| 实现规范 | `standards/document/实施计划讨论流程_SOP.md`、`实施计划书写规范.md` | 已确认 | 13 Step、phase/boundary、门禁、提交和 evidence 规则。 |
| 代码台账规范 | `standards/document/代码实施台账与门禁规范.md` | 已确认 | 项目级/boundary 台账 schema、状态机、planned skeleton 和 gate。 |
| 目录规范 | `standards/document/子项目目录与代码文件组织规范.md` | 已确认 | 实现仓路径、member/package/crate/binary 和 scripts/artifacts/reports。 |

## SOP 问题回答

| 问题 | 回答 | 依据 |
|---|---|---|
| 00/01/02/03/04/05/06 是否齐全？ | 齐全，且均为本轮正式文档；07 尚待本步之后装配。 | 当前目录与各文档元信息。 |
| 哪个版本是基线？ | 各文档当前 `full-restart` 版本和其 Step assembly 结论；不使用旧文件版本。 | 各正式文档“文档元信息/关系声明”。 |
| 03 是否支持 1:1 实现规划？ | 对 local、negative、blocked-aware 和 fake parity 足够；外部 positive seam 受 `L2T-UP-001~009` 限制。 | `03` §1、§16、§17。 |
| 05/06 是否能定义阶段门禁？ | 能。05 给出 concrete TC、suite、check、artifact/report schema；06 给出 AC/VF/evidence/裁决分层。 | `05` §6、§9、§13；`06` §5、§9~§14。 |
| 是否存在正式文档冲突？ | 未发现会阻塞本地实施规划的冲突；历史 README/旧正文与当前链冲突，已隔离。 | `project_execution_ledger.md` historical_material 表。 |
| 哪些缺口是 blocker？ | 外部 owner positive closure、目标实现仓、immutable design baseline 是实施启动 blocker；不是 07 设计装配 blocker。 | `L2T-UP-001~009`、`03` §16.3、代码台账规则。 |
| 是否需要补写 03/05/06？ | 当前不需要；07 只转译实施顺序和门禁，不重新定义上游 schema。 | 设计真相源标准 §9、03 handoff。 |

## 当前文档问题诊断

| 问题 | 影响 | 处理 |
|---|---|---|
| 目标实现仓不存在 | 不能运行 preflight、build、test 或生成真实 evidence。 | 在 PH-01 设为实施前置；所有执行状态保持 pending/not_created。 |
| 设计工作树未形成 immutable commit baseline | 无法给 boundary 填真实 baseline hash。 | 以 `not_fixed_until_handoff` 记录；不得从 dirty HEAD 推导。 |
| 外部 seams 未闭口 | 正向 provider/route/readiness 不能成为 P0 完成条件。 | 规划 blocked/negative/fail-closed 分支，positive 条件化。 |
| 历史 README/旧文档污染 | 可能误导技术栈、registry、executor、MCP 等范围。 | 标记 `historical_material`，不进入 allowed scope。 |

## 改动前后对比

| 项 | 改动前 | 改动后 | 理由 |
|---|---|---|---|
| 实施入口 | 只有 03 的 handoff 清单 | 07 以正式 00~06 为唯一实施输入集合 | 防止按旧 03 开工。 |
| 外部依赖 | 可能被误读为实现依赖 | 明确 compile/runtime/event/future 四类 seam | 遵守全局依赖裁剪。 |
| readiness | 设计文本容易被当作现状 | 所有实现事实分为 planned/not_created/pending | 不伪造运行事实。 |

## 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 等所有上游 positive seam 闭合后才写 07 | 实现条件最完整 | 会阻塞 local/negative 设计移交 | 不采用。 |
| 先按 local/negative/fail-closed 规划，positive 条件化 | 可交付实施路径且不越界 | 后续需重跑部分 qualification | 采用。 |
| 复制 03 全部字段到 07 | 实现者查找方便 | 形成第二真相源 | 禁止。 |

## 结构化中间产物

### 输入闭环结论

```text
00/01/02/03/04/05/06 formal truth
              |
              v
   07 phase / boundary / gate plan
              |
      +-------+--------+
      v                v
 local implementation  conditional external qualification
```

| 输入类别 | 可进入实施计划 | 不能在本计划中补写 |
|---|---|---|
| 本地 contract/domain/application | 是 | 不新增字段/状态/Port。 |
| Store/UoW/CAS/idempotency | 是 | 不选择未授权 backend。 |
| Hub/Auth/Sandbox/Bus/Obs seams | 仅 blocked-aware/fake/negative | 不写 owner positive truth。 |
| test/evidence/acceptance | 仅 planned command/path/gate | 不填 run/result/signoff。 |

## 回填草稿

正式 07 §1 应声明：本计划以当前正式 `00~06` 为输入；03 提供实现契约，05 提供测试与证据契约，06 提供验收裁决契约；目标实现仓、immutable baseline 和外部 positive seam 尚未建立，因此不构成实现已启动或已就绪的声明。

## 待确认事项

| 事项 | 影响 | 截止点 |
|---|---|---|
| `/home/aris/Projects/quantalithos-tools` 建立方式 | PH-01 激活 | 首个实现 boundary 开工前 |
| design baseline 冻结 | 全部 boundary Design Gate | 实现移交前 |
| L2T-UP-001~009 owner 闭口 | 对应 positive qualification | 各 external boundary 开工前 |

## 进入下一步条件

- [x] 正式输入集合和优先级明确。
- [x] 缺口分类为 blocker、risk 或 conditional。
- [x] 未把上游缺口转嫁给实现者。
