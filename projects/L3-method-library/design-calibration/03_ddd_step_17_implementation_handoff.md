# Step 17. 收口详细设计到实施计划的承接清单

## 1. Step 状态

- 状态：[x] 已确认
- 对应 SOP：`standards/document/详细设计讨论流程_SOP.md` Step 17
- 回填章节：`03-详细设计.md` §16 详细设计到实施计划的承接清单

---

## 2. 本步输入

| 输入 | 内容 |
|---|---|
| Step 1~16 中间产物 | 已收敛输入边界、范围、实现约束、文件布局、模块、对象、port、协议、处理流、状态机、持久化、错误、并发幂等、配置、可观测性和测试切口 |
| `standards/document/详细设计书写规范.md` | §5.16 要求输出实施承接清单、实施前置阅读清单、未进入实施的待确认项 |
| `standards/document/详细设计讨论流程_SOP.md` | Step 17 要求不写开发排期、不写任务拆分 |
| `projects/README.md` §3.3 / §8.2 | 实施前必须确认 git config、阅读 00~03、语言编码规范、提交规范 |
| `standards/coding/rust.md` | Rust 命名、格式、rustdoc 注释规范 |
| 当前设计仓 git config | `user.name=quantalithos-labs`、`user.email=quantalithos.ai@gmail.com`;实际实现仓若在别的目录必须重新确认 |

已确认结论：

```text
本步不是实施计划本体,只定义 03-详细设计如何被 07-实施计划承接。
本步不写排期、不拆任务、不指定提交顺序。
实施计划应引用详细设计章节和中间产物,不能复制一份详细设计。
实施者开始编码前必须阅读 00/01/02/03、Rust 编码规范、提交规范,并确认目标代码仓 git config。
```

依赖的前序 Step：

```text
Step 1~16 已经把可进入实施计划的 P0 实现契约收敛完成。
```

---

## 3. SOP 问题回答

1. 哪些实现契约已经足够进入实施计划？

   回答：P0 范围、Rust workspace 与 crate 分层、模块职责、核心对象、repository / port / adapter、HTTP JSON / Event / Job 协议、逐接口处理流、状态机、持久化与事务、错误模型、并发幂等、配置绑定、日志指标审计、最小测试切口都已经足够进入实施计划。实施计划可以据此安排编码阶段,但不应重写这些契约。

2. 实施者需要先阅读哪些文档？

   回答：必须阅读本仓 `00-需求文档.md`、`01-架构设计.md`、`02-概要设计.md`、待回填后的 `03-详细设计.md`,以及 `standards/coding/rust.md`、`projects/README.md` 的实施门禁和提交规范。若实现开始时已有 `04-配置设计.md`、`05-测试方案.md`、`06-验收标准.md`、`07-实施计划.md`,也必须一并阅读。

3. 提交规范、git config 用户、Rust 编码规范和注释规范是否已经列入前置阅读？

   回答：是。实施前必须确认目标实现仓 `git config user.name=quantalithos-labs`、`git config user.email=quantalithos.ai@gmail.com`。提交信息遵循目标实现仓规范;无更严格规范时使用英文 commit message。公开 Rust 类型、enum variant、trait、函数、模块必须遵守英文 rustdoc 注释要求。

4. 哪些内容仍待确认，不能进入实施？

   回答：P1 `MethodPlugin / MethodConfiguration` 完整实现、work 是否直接消费 `TaskDefinition`、P1 endpoint route stub、复杂 ViewProfile 默认策略、query audit、失败 Command audit、outbox lease 字段落库形式、governance validation mode 细节、cache/marketplace、具体配置环境变量、完整测试数据和 CI 策略不能作为 P0 实施前置。它们应进入风险 / 待确认事项或后续文档。

5. 实施计划应该如何引用本文，而不是重复本文？

   回答：实施计划应按阶段引用 `03-详细设计.md` 的章节编号和契约主题,例如“阶段 1 实现 workspace / module layout,依据 §4~§5”,“阶段 2 实现 domain / contracts,依据 §5~§8”,“阶段 3 实现 persistence / application,依据 §8~§13”。实施计划只写执行顺序、交付物和验收门禁,不复制对象字段、函数签名、状态矩阵或测试表。

---

## 4. 当前文档问题诊断

| 位置 | 当前问题 | 影响 |
|---|---|---|
| 当前 `03-详细设计.md` | 尚未按新版 Step 1~16 回填 | 07 实施计划还不能直接引用最终章节 |
| 旧实施相关内容 | 容易把“详细设计承接”和“开发任务拆分”混写 | 会提前进入排期和任务拆分,违反 Step 17 边界 |
| 前置阅读 | 旧文可能只提需求 / 架构 / 概要 | 实施者可能漏读 Rust 编码规范、提交规范和 git config 要求 |
| P1 / 待确认项 | 分散在多个 Step | 实施计划可能误把 P1 或待确认内容作为 P0 任务 |
| 测试承接 | Step 16 已列测试切口,但未说明测试方案如何承接 | 07 可能重复写测试细节,或遗漏转给 05 |

---

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 实施承接 | 只知道详细设计会指导开发 | 明确哪些契约可以进入实施计划 | 让 07 可以直接引用 03 |
| 前置阅读 | 散落在 README、Step 3、实施计划经验中 | 集中列出必读文档和阅读目的 | 避免实现 agent 漏读 |
| git / 提交规范 | 可能在实施计划中遗漏 | 明确目标实现仓必须确认 git config,提交格式遵守项目规范 | 防止提交不合规 |
| P1 / 待确认 | 分散记录 | 汇总为“未进入实施”清单 | 防止 P0 范围膨胀 |
| 计划边界 | 可能开始拆任务 | 明确本步不写排期、不写任务拆分 | 符合 SOP |

---

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| Step 17 直接写完整实施计划 | 一次性推进 | 会越过 07 书写规范,混入排期和任务拆分 | 不采用 |
| 只写“详设可承接实施”一句话 | 简洁 | 实施者不知道读哪些章节、哪些不能做 | 不采用 |
| 写承接清单 + 前置阅读 + 未进入实施项 | 粒度正确,能指导 07 | 后续仍需单独编写 07 实施计划 | 采用 |
| 把待确认项全部阻塞实施 | 最保守 | 会拖慢 P0,且多数是 P1/优化/后续文档事项 | 不采用 |
| 区分 P0 可实施契约与后置待确认项 | 能快速进入 P0 实现 | 需要 Step 18 继续收口风险 | 采用 |

---

## 7. 结构化中间产物

### 7.1 承接关系图

```text
00-需求文档
    |
01-架构设计
    |
02-概要设计
    |
03-详细设计
    |  provides implementation contracts
    v
07-实施计划
    |  references contracts, defines execution stages
    v
代码实现 / 提交 / 测试 / 验收
```

关键说明：

- `03-详细设计` 输出“怎么实现”的契约。
- `07-实施计划` 输出“按什么顺序实施”的计划。
- `07` 只能引用 `03`,不能复制 `03` 的对象、函数、状态机和测试表。

### 7.2 实施承接清单

| 承接项 | 已定义位置 | 实施者如何使用 |
|---|---|---|
| P0 / P1 范围与非范围 | Step 2;正式 §2 | 只实现 P0 方法定义发布同步闭环;P1 只保留边界和 feature flag |
| Rust 实现约束与注释规范 | Step 3;正式 §3;`standards/coding/rust.md` | 编写 Rust struct / enum / enum variant / trait / function 时使用英文标识符和英文 rustdoc 注释 |
| Workspace / crate / 文件布局 | Step 4;正式 §4 | 创建 `method_library_domain/contracts/application/infra/api/worker` 等实现单元 |
| 模块实现契约 | Step 5;正式 §5 | 按模块实现对象、service、port、adapter、handler、worker,不得跨层绕行 |
| 对象实现契约 | Step 6;正式 §5 / §6 | 实现 `MethodContent`、payload、lifecycle、fingerprint、ref、snapshot、outbox、projection、job 等类型 |
| Trait / Port / Adapter 契约 | Step 7;正式 §5 / §6 | 定义 application port trait,由 infra adapter 实现,测试使用 fake adapter |
| API / Command / Query / Event / Job 协议 | Step 8;正式 §7 | 实现 HTTP JSON DTO、error response、event envelope、job request / result |
| 逐接口函数级处理流 | Step 9;正式 §8 | 按每个 Command / Query / Event / Job 的调用链编写 application service 和 handler |
| 状态机与转换矩阵 | Step 10;正式 §9 | 实现 lifecycle、outbox、idempotency、job 状态 enum 和状态转换校验 |
| 持久化、事务与一致性 | Step 11;正式 §10 | 实现 repository、UnitOfWork、outbox、snapshot metadata、projection、checkpoint |
| 错误模型与恢复口径 | Step 12;正式 §11 | 实现 `MethodLibraryError`、HTTP/RPC/Event/Job 映射和恢复分支 |
| 并发、幂等与重入保护 | Step 13;正式 §12 | 实现 idempotency、revision check、unique constraint、outbox claim、checkpoint CAS |
| 配置与外部依赖绑定 | Step 14;正式 §13 | 在 api / infra / worker 装配 settings 和 adapters,domain 不读配置 |
| 可观测性与审计埋点 | Step 15;正式 §14 | 写业务 audit、structured log、metric,避免 secret 和完整 payload |
| 最小测试切口 | Step 16;正式 §15 | 为每个模块、接口、状态机、一致性/幂等契约补最小测试 |

### 7.3 实施前置阅读清单

| 文档 | 阅读目的 |
|---|---|
| `projects/L3-method-library/00-需求文档.md` | 理解本仓要做什么、不做什么、P0 / P1 范围和成功标准 |
| `projects/L3-method-library/01-架构设计.md` | 理解 Definition / Use 边界、上下游依赖、技术选型和为什么这样设计 |
| `projects/L3-method-library/02-概要设计.md` | 理解主要组成部分、代码主体骨架、关键对象轮廓和处理流轮廓 |
| `projects/L3-method-library/03-详细设计.md` | 按正式回填后的实现契约编码 |
| `projects/L3-method-library/design-calibration/03_ddd_calibration_flow.md` | 理解 03 校准过程和各 Step 状态 |
| `projects/L3-method-library/design-calibration/03_ddd_step_01_input_boundary.md` ~ `03_ddd_step_16_test_cut.md` | 当正式 03 章节需要追溯取舍时查看中间产物 |
| `standards/coding/rust.md` | 遵守 Rust 命名、格式、英文 rustdoc 注释、错误和测试风格 |
| `standards/document/详细设计书写规范.md` | 理解详细设计中的函数签名、对象契约、流程图和表格约束 |
| `projects/README.md` §3.3 | 确认代码实施前门禁,包括 git config、00~03 阅读、语言规范和提交格式 |
| `projects/README.md` §8.2 | 理解 design 仓提交规范;目标实现仓提交信息以目标仓规范为准 |
| 目标实现仓 `git config user.name/user.email` | 确认目标仓不是设计仓时也使用项目要求的提交身份 |
| 后续 `04-配置设计.md` | 若已存在,读取环境变量、secret、连接池、topic、timeout/retry 具体值 |
| 后续 `05-测试方案.md` | 若已存在,读取测试环境、fixture、CI、覆盖率和执行策略 |
| 后续 `06-验收标准.md` | 若已存在,读取最终验收口径和交付门禁 |
| 后续 `07-实施计划.md` | 若已存在,按实施阶段和交付物执行 |

### 7.4 实施前检查清单

| 检查项 | 要求 | 当前结论 |
|---|---|---|
| 目标仓 git config | `user.name=quantalithos-labs`;`user.email=quantalithos.ai@gmail.com` | 当前设计仓符合;实现若在其他目录必须重新执行 `git config` 检查 |
| 提交信息 | 目标实现仓 commit message 使用英文;若目标仓有更严格规范则取更严格者 | 执行提交前检查 |
| 代码标识符 | 英文,Rust 命名风格 | 由 `standards/coding/rust.md` 约束 |
| Rustdoc 注释 | 公开模块、struct、enum、enum variant、trait、function 使用 `///` 或 `//!`;实际代码注释使用英文 | 由 `standards/coding/rust.md` 和 Step 3 约束 |
| P0 / P1 边界 | P1 不阻塞 P0;P1 endpoint disabled 返回 `P1_FEATURE_DISABLED` | 由 Step 2 / Step 8 / Step 14 约束 |
| Domain 依赖 | domain 不依赖 HTTP、DB、bus、object storage、config | 由 Step 4 / Step 5 / Step 14 约束 |
| Query 只读 | Query 不写 audit/outbox/idempotency | 由 Step 9 / Step 15 约束 |
| 测试最低门槛 | 实现关键契约时同步补 Step 16 对应测试切口 | 由 Step 16 约束 |

### 7.5 未进入实施的待确认项

| 待确认项 | 当前处理 | 为什么不能进入 P0 实施 |
|---|---|---|
| P1 `MethodPlugin / MethodConfiguration` 完整协议、状态机和持久化 | 只保留边界和后置索引 | P1 后置,不阻塞 P0 发布同步闭环 |
| P1 endpoint 是否创建 route stub | 当前建议仅索引,不作为 P0 必建 | 避免 P1 污染 P0 实现 |
| work 是否直接消费 `TaskDefinition` | 保持 P1 / 待 L1-work 校准 | L1-work 边界尚未确认 |
| `ResolveViewProfile` 无匹配时返回空视图还是错误 | 暂保留受控空结果或错误 | Query 语义需正式回填前统一 |
| `RetireMethodContent` 对已 retired 重复请求返回幂等结果还是冲突 | 暂待错误模型收口 | 会影响测试断言,但不影响主结构 |
| Query audit 是否启用 | 第一版不启用 | Query 只读边界优先 |
| 失败 Command 是否写 `AuditRecord(result=failed)` | 第一版不强制,必须写 log/metric | 避免失败污染业务事实 |
| outbox claim 是否显式落 `worker_id / lease_until` | 保留 lease 语义,实现可等价表达 | 字段细节可在实现 / 配置设计中确定 |
| governance `validation_mode` 远程 / 投影 / ref-only 细节 | P0 publish 必须校验 approved gate,具体模式由配置决定 | 属于配置 / governance 对接细节 |
| 完整环境变量、secret、TLS、retry 曲线 | 留给 `04-配置设计.md` | 不属于详细设计实现契约 |
| 完整测试 fixture、CI、覆盖率目标 | 留给 `05-测试方案.md` | 不属于详细设计最小测试切口 |
| 告警阈值、dashboard、on-call runbook | 留给运维手册 / 可观测性设计 | 不属于代码实现契约 |

### 7.6 实施计划引用方式

| 实施计划内容 | 应引用详细设计 | 不应复制 |
|---|---|---|
| 实现阶段 | 引用 §4~§5 的 crate / module 结构 | 不复制完整文件树 |
| Domain / contracts 实现 | 引用 §5~§8 的对象与协议契约 | 不复制每个字段表 |
| Application / persistence 实现 | 引用 §8~§13 的处理流、事务、错误、并发 | 不复制伪代码和状态矩阵 |
| API / worker 实现 | 引用 §7~§14 的协议、worker、配置、观测切口 | 不复制所有 DTO JSON 示例 |
| 测试安排 | 引用 §15 测试切口和 `05-测试方案.md` | 不在 07 中写完整测试矩阵 |

---

## 8. 回填草稿

可直接回填到 `03-详细设计.md` 的起草结构：

````md
## 16. 详细设计到实施计划的承接清单

### 16.1 承接关系

```text
00 -> 01 -> 02 -> 03 -> 07 -> code / test / acceptance
```

### 16.2 实施承接清单

| 承接项 | 已定义位置 | 实施者如何使用 |
|---|---|---|

### 16.3 实施前置阅读清单

| 文档 | 阅读目的 |
|---|---|

### 16.4 实施前检查清单

| 检查项 | 要求 | 当前结论 |
|---|---|---|

### 16.5 未进入实施的待确认项

| 待确认项 | 当前处理 | 为什么不能进入 P0 实施 |
|---|---|---|

### 16.6 实施计划引用方式

| 实施计划内容 | 应引用详细设计 | 不应复制 |
|---|---|---|
````

---

## 9. 待确认事项

- 正式 `03-详细设计.md` 回填完成前,`07-实施计划.md` 只能引用中间产物,不能引用尚未存在的正式章节。
- 当前设计仓 git config 已符合要求,但实现可能发生在其他目录;实施计划必须要求在目标实现仓重新确认。
- Co-Authored-By 的固定内容以项目当前提交规范为准;本步只要求实施者阅读并遵守 `projects/README.md` §8.2。
- Step 18 仍需要把风险与待确认事项正式归档,本步只列出不能进入 P0 实施的待确认项。

---

## 10. 进入下一步条件

- 实施承接清单已经覆盖 Step 1~16 的 P0 实现契约。
- 实施前置阅读清单已经包含 00/01/02/03、Rust 编码规范、提交规范、git config 用户和注释规范。
- 未进入实施的待确认项已经明确,不会被误写成 P0 任务。
- 实施计划如何引用详细设计已经明确。
- 可以进入 Step 18 风险与待确认事项。
