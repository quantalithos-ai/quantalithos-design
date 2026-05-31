# Step 17. 收口详细设计到实施计划的承接清单

> 本文件是 `projects/L0-sdk/03-详细设计.md` 的 Step 17 中间产物。
> 本步只收稳详细设计交给实施计划的承接项、实施前置阅读清单、跨文档一致性复核和不得交给实施者自行取舍的边界。
> 本步不写开发排期、不写任务拆分、不定义 commit boundary。
> 正式 `03-详细设计.md` 仍在 Step 19 统一回填，本文件不替代正式详细设计。

## 1. Step 状态

- 状态：[x] 已确认
- 对应 SOP：`standards/document/详细设计讨论流程_SOP.md` Step 17
- 回填章节：`projects/L0-sdk/03-详细设计.md` §16 详细设计到实施计划的承接清单

---

## 2. 本步输入

| 输入 | 内容 | 本步使用方式 |
|---|---|---|
| Step 1~16 中间产物 | 上游边界、范围、模块、对象、port、协议、处理流、状态、事务、错误、幂等、配置、观测和测试切口 | 固定实施计划承接来源 |
| `standards/document/设计文档讨论中间产物规范.md` §5.10 | 跨文档一致性复核必须覆盖字段、DTO、状态、phase、命名和冲突 | 固定复核表结构 |
| `standards/document/实施计划书写规范.md` | 实施计划负责阶段、代码批次、提交边界、门禁和 commit message | 固定本步与 `07-实施计划.md` 边界 |
| `standards/coding/rust.md` | 实现仓源码、rustdoc、注释和测试名默认英文 | 固定实施前置阅读 |
| `standards/document/子项目目录与代码文件组织规范.md` | 实现仓目录、crate、package、scripts、reports、artifacts 组织 | 固定目标仓检查项 |

已确认结论：

```text
目标实现仓路径: /home/aris/Projects/quantalithos-sdk
当前已存在 sibling repo: /home/aris/Projects/quantalithos-core、/home/aris/Projects/quantalithos-bus
当前未发现目标实现仓: /home/aris/Projects/quantalithos-sdk
Step 17 只回答“详细设计交给实施计划什么”，不回答“分几个阶段开发”。
真实实现仓不是 quantalithos-design，因此 commit message、源码标识符、rustdoc、普通注释和测试名默认使用英文。
```

---

## 3. SOP 问题回答

### 3.1 哪些实现契约已经足够进入实施计划？

| 承接项 | 已定义位置 | 实施者如何使用 |
|---|---|---|
| 上游输入和旧文档边界 | Step 1 | 只承接新版 `00/01/02`，旧 `03` 仅作诊断 |
| P0 / 非范围 | Step 2 | 防止把 SDK 写成 HTTP server、gateway、auth、bus runtime 或服务端 truth |
| 编码、runtime、仓库、提交约束 | Step 3 | 确认 Rust、三语言 package surface、源码英文和实现仓英文 commit |
| workspace 和文件布局 | Step 4 | 创建或确认 `/home/aris/Projects/quantalithos-sdk` 与 `crates/*` / `packages/*` |
| 模块实现主轴 | Step 5 | 按实现职责模块落代码，不按对象全集平铺 |
| 对象实现契约 | Step 6 | 实现 domain struct / enum / value object / service object |
| Trait / Port / Adapter | Step 7 | 定义 application ports 和 infra adapters |
| 协议契约 | Step 8 | 实现 Rust DTO、client method、CLI command、event payload 和 job input / output |
| 函数级处理流 | Step 9 | 还原调用顺序、事务边界、错误映射和副作用 |
| 状态机 | Step 10 | 实现 7 个正式状态集合和非法转换错误 |
| 持久化、事务、一致性 | Step 11 | 实现 repository、UoW、projection、artifact、outbox、idempotency |
| 错误、幂等、配置、观测、测试切口 | Step 12~16 | 实现错误映射、replay、runtime config、日志指标审计和最小门禁 |

### 3.2 实施者需要先阅读哪些文档？

| 文档 | 阅读目的 | 是否阻塞编码 |
|---|---|---|
| `projects/L0-sdk/00-需求文档.md` | 理解 SDK 定位、用户故事、功能需求和非目标 | 是 |
| `projects/L0-sdk/01-架构设计.md` | 理解 SDK 与 core / bus / L1~L4 / 下游消费者的关系 | 是 |
| `projects/L0-sdk/02-概要设计.md` | 理解代码主体骨架、对象、接口、流程和状态轮廓 | 是 |
| `projects/L0-sdk/design-calibration/03_ddd_calibration_flow.md` | 找到详细设计各 Step 状态和中间产物 | 是 |
| `projects/L0-sdk/design-calibration/03_ddd_step_01_upstream_boundary.md` ~ `03_ddd_step_17_implementation_handoff.md` | 在正式 `03` 回填前追溯实现契约 | 是 |
| `projects/L0-core/00~07`、`projects/L0-bus/00~07` | 理解稳定上游和 `core-contracts` / `bus-contracts` 来源 | 是 |
| `projects/L0-sdk/05-测试方案.md`、`projects/L0-sdk/06-验收标准.md` | 理解后续测试和验收如何承接 Step 16 | 是，但需在 Step 19 后复核 |
| `standards/coding/rust.md` | 遵守 Rust 源码、rustdoc、注释、测试名和错误处理规范 | 是 |
| `standards/document/实施计划书写规范.md` | 编写 `07` 时遵守阶段、门禁、提交边界和 commit message 规则 | 是 |
| `standards/document/子项目目录与代码文件组织规范.md` | 遵守实现仓、crate、scripts、reports、artifacts 组织 | 是 |
| `standards/document/全局项目依赖关系与裁剪规则.md` | 裁剪 SDK 的编译期、运行期和事件协作依赖 | 是 |

### 3.3 提交规范、git config 用户、Rust 编码规范和注释规范是否已经列入前置阅读？

已列入，并且后续 `07-实施计划.md` 必须继续作为开工门禁。

| 前置项 | 要求 |
|---|---|
| git config | 在目标实现仓确认 `user.name=quantalithos-labs`、`user.email=quantalithos.ai@gmail.com` |
| commit message | 实现仓必须英文，标题格式 `type(scope): subject`，body 按子功能分组 |
| AI footer | AI 参与时保留 `Co-Authored-By: Codex <noreply@openai.com>`，footer 前空一行 |
| Rust 编码规范 | 源码标识符、rustdoc、普通注释、测试名默认英文 |
| 设计文档中文 Rustdoc | 只作为设计语义说明，落到真实源码时必须转写为英文 |

### 3.4 每个 Domain 必填字段是否能回指 DTO、event、派生规则、查表规则或系统生成规则？

结论：主要对象已在 Step 6 / Step 8 / Step 9 闭环。实施前仍必须按 §7.4 的字段闭环表逐项复核，尤其关注 `PayloadRef`、`ArtifactRef`、`DiagnosticRef`、`MigrationGuideRef`、`FakeBoundaryRef` 和 `FormalApiRef`，不得互相代用。

### 3.5 状态枚举、状态图、测试切口、验收口径是否使用同一套正式状态名？

结论：Step 10 和 Step 16 使用同一套正式状态名。实施计划必须禁止旧名和口语名进入代码，例如 `Built`、`redacted passed`、`public released`、`production fake success`。

### 3.6 当前 phase / commit boundary 是否误用了后续 phase 才定义的对象、结果或证据？

结论：本步不定义 phase / commit boundary。后续 `07-实施计划.md` 必须按 Step 6~16 裁剪阶段，禁止某个阶段使用后续阶段才产出的 evidence、artifact、compatibility decision 或 projection 作为前置。

---

## 4. 当前文档问题诊断

| 问题 | 影响 | 本步处理 |
|---|---|---|
| Step 1~16 文件较多 | 实施者可能跳读关键契约 | 形成承接和阅读清单 |
| 目标实现仓当前不存在 | 实施计划若假设存在会阻塞开工 | 列为实施前检查项 |
| 正式 `03` 尚未 Step 19 重建 | 不能把旧 `03` 交给实现者 | 明确 Step 19 前以中间产物为准 |
| 测试 / 验收文档需在正式 `03` 后复核 | 可能与最新详细设计切口不一致 | 列为后续复核输入 |
| 实施计划容易复制详细设计 | 会产生两套对象和状态真相源 | 规定 `07` 引用 `03`，不重写契约 |

---

## 5. 改动前后对比

| 维度 | 改动前 | 改动后 |
|---|---|---|
| 实施承接 | 分散在 Step 1~16 | 统一列出承接项、阅读清单和检查项 |
| 目标仓状态 | Step 3 / 4 提到待创建 | Step 17 明确作为实施前检查 |
| 提交纪律 | 分散在规范和 Step 3 | 作为阻塞性前置阅读再次固定 |
| 跨文档复核 | 隐含在前序 Step | 明确字段、DTO、状态、phase、命名复核表 |
| 与实施计划关系 | 容易混写任务拆分 | 明确本步不写排期、任务、commit boundary |

---

## 6. 设计取舍

| 决策点 | 方案 A | 方案 B | 推荐 | 原因 |
|---|---|---|---|---|
| 是否在 Step 17 写实施阶段 | 写阶段和提交边界 | 只写承接清单 | B | 阶段和 commit boundary 属于 `07-实施计划.md` |
| 是否允许 `07` 复制详细设计对象 | 复制对象 / 函数 / 状态 | 只引用章节和 Step 文件 | B | 避免两套实现契约漂移 |
| Step 19 前是否能交给实现者 | 直接按旧 `03` | 等 Step 19，或明确按中间产物 | B | 旧 `03` 不再是新版真相源 |
| 目标仓不存在时是否阻塞设计 | 阻塞 Step 17 | 在实施前检查中要求创建 / 确认 | B | 设计可继续，实施前必须处理 |

---

## 7. 结构化中间产物

### 7.1 实施承接关系图

```text
00-需求文档
  |
  v
01-架构设计
  |
  v
02-概要设计
  |
  v
03-详细设计
  |
  | implementation contracts
  v
07-实施计划
  |
  | execution order + gates + commit boundaries
  v
/home/aris/Projects/quantalithos-sdk
```

关键说明：

- `03-详细设计` 输出实现契约。
- `07-实施计划` 输出执行顺序、门禁、代码批次和提交边界。
- 目标实现目录当前未发现，实施前必须创建或确认。

### 7.2 实施承接清单

| 承接项 | 已定义位置 | 实施者如何使用 |
|---|---|---|
| 输入边界和范围 | Step 1 / Step 2 | 避免沿用旧 `03` 或扩大 P0 |
| 仓库、语言、依赖 | Step 3 / Step 4 / Step 14 | 创建 workspace，绑定 `core-contracts` / `bus-contracts` path dependency |
| 模块、对象、port | Step 5 / Step 6 / Step 7 | 实现 domain、application、infra 和 runtime wiring |
| 协议与处理流 | Step 8 / Step 9 | 实现 DTO、client method、CLI command、event、job 和 flow |
| 状态、事务、错误、幂等 | Step 10 / Step 11 / Step 12 / Step 13 | 实现状态矩阵、UoW、repository、replay 和错误映射 |
| 配置、观测、测试 | Step 14 / Step 15 / Step 16 | 实现 config、logs / metrics / audit、最小测试门禁 |

### 7.3 实施前置阅读清单

| 文档 | 阅读目的 |
|---|---|
| `projects/L0-sdk/00-需求文档.md` | 理解 SDK 需求与非目标 |
| `projects/L0-sdk/01-架构设计.md` | 理解 SDK 在系统中的位置和依赖 |
| `projects/L0-sdk/02-概要设计.md` | 理解代码主体骨架 |
| `projects/L0-sdk/design-calibration/03_ddd_calibration_flow.md` | 定位详细设计 Step |
| `projects/L0-sdk/design-calibration/03_ddd_step_01_upstream_boundary.md` ~ `03_ddd_step_17_implementation_handoff.md` | 追溯实现契约来源 |
| `projects/L0-core/00~07`、`projects/L0-bus/00~07` | 理解稳定上游和编译期依赖 |
| `standards/coding/rust.md` | 遵守 Rust 编码和注释规范 |
| `standards/document/实施计划书写规范.md` | 遵守实施计划和提交规范 |
| `standards/document/子项目目录与代码文件组织规范.md` | 遵守实现仓目录和产物组织 |

### 7.4 跨文档一致性复核表

| 复核项 | 设计位置 | 下游位置 | 结论 | 未关闭问题 |
|---|---|---|---|---|
| 字段闭环 | Step 6 / Step 8 / Step 9 | Step 16 / 后续 05 / 06 / 07 | 通过，关键字段有来源和缺失处理 | 05 / 06 需在 Step 19 后复核 |
| DTO 构造闭环 | Step 8 / Step 9 | Step 16 / 后续 07 | 通过，Command / Event / Job 可构造目标对象或明确缺失处理 | 07 不得重定义 DTO |
| 状态闭环 | Step 10 / Step 16 | 后续 05 / 06 / 07 | 通过，7 个状态集合名称已收敛 | 禁止 `Built` 等旧名进入代码 |
| 处理流闭环 | Step 9 / Step 11 / Step 12 / Step 13 | Step 16 / 后续 07 | 通过，事务、错误和幂等已接上 | 07 需按阶段裁剪 |
| phase boundary | 本文件 / 后续 07 | `07-实施计划.md` | 待后续实施计划定义 | 不得在 Step 17 脑补 commit boundary |
| 命名一致性 | Step 4 / Step 5 / Step 10 / Step 14 | 后续代码仓 | 通过，仓内目录不使用 `L0` 前缀 | 目标仓创建时需检查 |

### 7.5 命名一致性表

| 名称类型 | 正式名称 | 禁用旧名 / 口语名 | 修正要求 |
|---|---|---|---|
| 实现仓 | `quantalithos-sdk` | `L0-sdk`、`l0_sdk`、`quantalithos-l0-sdk` | 代码仓和 package 不带架构层级 |
| 编译期依赖 | `core-contracts` / `bus-contracts` | `core-domain`、`bus-domain`、复制类型 | 只依赖 contracts crate |
| Candidate 状态 | `Draft / NotVerified / Failed / Verified / Stable / Superseded` | `Built`、`Published` | built 是 artifact 条件，不是状态 |
| Evidence 状态 | `EvidenceResult` + `EvidenceRedactionStatus` | `redacted passed` | result 与 redaction 必须拆分 |
| runtime boundary | `FormalApiBoundaryPort` / `FakeFixtureEndpointPort` / `BusEventBoundaryPort` | service repo path dependency、bus runtime truth | 运行期依赖只走 port / adapter |

### 7.6 实施前检查清单

| 检查项 | 要求 | 失败处理 |
|---|---|---|
| 目标目录 | `/home/aris/Projects/quantalithos-sdk` 存在或可创建 | 暂停实施并确认目录 |
| sibling repo | `/home/aris/Projects/quantalithos-core`、`/home/aris/Projects/quantalithos-bus` 存在 | 暂停真实编译依赖阶段 |
| path dependency | `../quantalithos-core/crates/contracts`、`../quantalithos-bus/crates/contracts` | 不得复制类型或扩大依赖 |
| git config | `quantalithos-labs` / `quantalithos.ai@gmail.com` | 修正项目级配置后再提交 |
| 源码语言 | 实现仓英文源码、英文 rustdoc、英文测试名 | 发现中文源码注释则修正 |
| 设计来源 | Step 19 前用中间产物，Step 19 后用正式 `03` | 不得按旧 `03` 实施 |

---

## 8. 回填草稿

正式 `03-详细设计.md` §16 建议按以下结构回填：

```text
16. 详细设计到实施计划的承接清单
  16.1 实施承接关系图
  16.2 实施承接清单
  16.3 实施前置阅读清单
  16.4 跨文档一致性复核表
  16.5 命名一致性表
  16.6 实施前检查清单
```

如果正式文档完全引用本文件 §7 的表格和图，Step 19 直接摘录即可，本节不重复粘贴。

---

## 9. 待确认事项

| 待确认项 | 备选方案 | 推荐方案 | 推荐理由 | 当前状态 |
|---|---|---|---|---|
| 是否等 Step 19 后交给实现 agent | A. 现在按中间产物；B. Step 19 后交付；C. 按旧 `03` | B | 正式详细设计统一校对后最稳 | 已按 B 写入 |
| 目标实现仓不存在如何处理 | A. 设计阻塞；B. 实施前创建 / 确认；C. 在 design 仓写代码 | B | 设计可继续，代码必须在实现仓 | 已按 B 写入 |
| `07` 是否复制详细设计对象 | A. 复制；B. 只引用章节和 Step | B | 避免两套契约漂移 | 已按 B 写入 |
| phase / commit boundary 是否现在定义 | A. 现在定义；B. 留给 `07-实施计划.md` | B | Step 17 不是实施计划 | 已按 B 写入 |

---

## 10. 进入下一步条件

进入 Step 18 前必须满足：

- 实施计划可以直接承接 Step 1~16 的实现契约。
- 实施者开始编码前必须阅读的材料和检查项已经明确。
- 提交规范、git config 用户、Rust 编码规范和注释规范已经列入前置阅读。
- 字段、DTO、状态、命名和 phase boundary 复核已有明确结论。
- 本步没有写开发排期、任务拆分或 commit boundary。
