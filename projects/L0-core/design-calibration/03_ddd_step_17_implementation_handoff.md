# Step 17. 收口详细设计到实施计划的承接清单

> 本文件是 `projects/L0-core/03-详细设计.md` 的 Step 17 中间产物。
> 本步只收稳详细设计交给实施计划的承接项、实施前置阅读清单和不得进入实施的未确认项。
> 本步不写开发排期,不写阶段任务拆分,不改写正式 `03-详细设计.md`。
> 正式 `03-详细设计.md` 仍在 Step 19 统一回填,本文件不替代正式详细设计。

## 1. Step 状态

- 状态: [x] 已确认
- 对应 SOP: `standards/document/详细设计讨论流程_SOP.md` Step 17
- 回填章节: `projects/L0-core/03-详细设计.md` §16 详细设计到实施计划的承接清单

---

## 2. 本步输入

| 输入 | 内容 | 本步使用方式 |
|---|---|---|
| Step 1 ~ Step 16 中间产物 | 已收稳上游边界、范围、模块、对象、port、协议、处理流、状态、持久化、错误、幂等、配置、观测和测试切口 | 固定实施计划可直接承接的设计契约 |
| `standards/document/实施计划书写规范.md` | 实施前置阅读、阶段化功能增量、提交边界、git config、commit 规则 | 固定实施计划不能遗漏的前置项 |
| `standards/coding/rust.md` | Rust 命名、注释、rustdoc、源码语言、rustfmt / clippy 边界 | 固定实现仓编码纪律 |
| `projects/README.md` §8.2 | design 仓与实现仓提交语言边界、固定 footer | 固定提交规范阅读要求 |
| `projects/L0-core/05-测试方案.md` | 当前测试方案 | 作为实施计划测试门禁承接来源 |
| `projects/L0-core/06-验收标准.md` | 当前验收标准 | 作为实施计划验收门禁承接来源 |

已确认结论:

```text
详细设计给实施计划的是实现契约和最小验证入口,不是任务排期。
实施计划必须引用详细设计,不能复制重写详细设计中的对象、函数、协议和伪代码。
实施者开始编码前必须阅读提交规范、git config 用户要求、Rust 编码规范和注释规范。
当前 design 仓可以使用中文提交说明;其他实现仓 commit message、源码注释、rustdoc、测试名和标识符默认必须使用英文。
```

---

## 3. 本步写作策略

本步按“承接项 -> 阅读清单 -> 不进入实施事项 -> 回填草稿”展开:

```text
先确认详细设计交付了什么 -> 再确认实施者开始前读什么 -> 再确认什么不能进入实施计划
```

写作约束:

- 只写实施计划需要承接的清单和阅读要求。
- 不写实施阶段、工期、排期、人员分配和任务拆分。
- 不复制详细设计的 struct / enum / trait / API / DDL / 伪代码正文。
- 必须包含提交规范、git config 用户、Rust 编码规范和注释规范。
- 未完成正式 `03-详细设计.md` 汇总前,不得把 Step 1 ~ Step 16 的中间产物当成已发布正式文档。

---

## 4. 分章节写入计划

| 章节 | 状态 | 主题 |
|---|---|---|
| 17.1 | [x] | 实施承接清单 |
| 17.2 | [x] | 实施前置阅读清单 |
| 17.3 | [x] | 未进入实施的待确认项 |
| 17.4 | [x] | 回填草稿 |

---

## 5. SOP 问题回答

### 5.1 哪些实现契约已经足够进入实施计划？

| 承接项 | 已定义位置 | 实施者如何使用 |
|---|---|---|
| 上游边界和正式输入 | Step 1 `03_ddd_step_01_upstream_boundary.md` | 确认实现只承接新版 `00/01/02`,不复用旧详细设计口径 |
| P0 范围和非范围 | Step 2 `03_ddd_step_02_scope.md` | 避免把 HTTP server、认证授权、SDK、bus runtime 或 L1 业务真相写入实现 |
| 编码、runtime、仓库和提交约束 | Step 3 `03_ddd_step_03_coding_runtime_constraints.md` | 确认 Rust、源码英文、注释、git config 和提交纪律 |
| workspace 多 crate 与文件布局 | Step 4 `03_ddd_step_04_units_file_layout.md` | 建仓和落文件时按 crate / module / asset root 建立骨架 |
| 模块实现契约主轴 | Step 5 `03_ddd_step_05_module_contracts_axis.md` | 按实现模块组织代码,不要按对象全集平铺 |
| 对象实现契约 | Step 6 `03_ddd_step_06_object_contracts.md` | 逐模块实现 struct / enum / value object / service 函数 |
| Trait / Port / Adapter 契约 | Step 7 `03_ddd_step_07_trait_port_adapter_contracts.md` | 定义 port trait、infra adapter 和 runtime wiring |
| API / Command / Query / Event / Job 协议契约 | Step 8 `03_ddd_step_08_protocol_contracts.md` | 实现 DTO、CLI / library entry、event payload 和 job input / output |
| 函数级处理流 | Step 9 `03_ddd_step_09_function_flows.md` | 按 flow 还原调用顺序、事务边界、错误映射和副作用 |
| 状态机与转换矩阵 | Step 10 `03_ddd_step_10_state_matrix.md` | 实现 enum、合法迁移、非法迁移和错误映射 |
| 持久化、事务与一致性 | Step 11 `03_ddd_step_11_persistence_transaction_consistency.md` | 实现 repository、UoW、outbox、audit、projection、snapshot、idempotency store |
| 错误模型和恢复口径 | Step 12 `03_ddd_step_12_error_recovery.md` | 实现错误 enum、错误映射、可恢复 / 不可恢复分支 |
| 并发、幂等和重入保护 | Step 13 `03_ddd_step_13_concurrency_idempotency.md` | 实现 idempotency record、payload fingerprint、expected version 和 replay |
| 配置引用和外部依赖绑定 | Step 14 `03_ddd_step_14_config_dependencies.md` | 实现 `CoreRuntimeConfig`、`CoreInfraPorts`、`build_cli_runtime`、`build_job_runtime` |
| 可观测性与审计埋点 | Step 15 `03_ddd_step_15_observability_audit.md` | 实现 trace、日志、指标和 audit append 切口 |
| 测试切口与最小验证清单 | Step 16 `03_ddd_step_16_test_slices.md` | 为每个阶段嵌入最小测试门禁,并交给测试方案继续展开 |

### 5.2 实施者需要先阅读哪些文档？

| 文档 | 阅读目的 | 是否阻塞开始编码 |
|---|---|---|
| `projects/L0-core/00-需求文档.md` | 理解 L0-core 的目标、非目标、用户故事、功能需求和数据边界 | 是 |
| `projects/L0-core/01-架构设计.md` | 理解 L0-core 在整体系统中的位置、依赖方向、通信方式和外部边界 | 是 |
| `projects/L0-core/02-概要设计.md` | 理解代码主体框架、主要模块、关键对象、接口骨架、处理流和状态集合 | 是 |
| `projects/L0-core/design-calibration/03_ddd_calibration_flow.md` | 理解详细设计校准进度和各 Step 中间产物位置 | 是 |
| `projects/L0-core/design-calibration/03_ddd_step_01_upstream_boundary.md` ~ `03_ddd_step_16_test_slices.md` | 理解详细设计正式回填前的实现契约来源 | 是 |
| `projects/L0-core/05-测试方案.md` | 理解测试范围、测试类型和后续测试方案如何承接最小切口 | 是 |
| `projects/L0-core/06-验收标准.md` | 理解功能验收、边界验收和一票否决项 | 是 |
| `standards/coding/rust.md` | 理解真实实现仓 Rust 命名、源码语言、rustdoc、注释、rustfmt 和 clippy 约束 | 是 |
| `standards/document/实施计划书写规范.md` | 理解实施计划的阶段组织、提交边界、提交时机、git config 和 commit message 规则 | 是 |
| `projects/README.md` §8.2 | 理解当前 design 仓与其他实现仓的提交语言边界和固定 footer | 是 |
| 目标实现仓历史提交 | 对齐目标仓已有 commit 风格、scope 和提交粒度 | 是 |
| 目标实现仓 `git config user.name/user.email` | 确认项目级提交身份正确 | 是 |

### 5.3 提交规范、git config 用户、Rust 编码规范和注释规范是否已经列入前置阅读？

已列入。实施计划必须继续保留以下硬性前置项:

| 前置项 | 来源 | 实施计划中的处理方式 |
|---|---|---|
| 提交规范 | `projects/README.md` §8.2、`standards/document/实施计划书写规范.md` §4.9 / §5.11 | 在实施前置阅读和提交纪律章节重复引用,但不重写为另一套规则 |
| git config 用户 | `standards/document/实施计划书写规范.md`、目标仓实际配置 | 要求在目标实现仓运行 `git config user.name` 和 `git config user.email` 检查 |
| Rust 编码规范 | `standards/coding/rust.md` | 要求真实源码标识符、普通注释、rustdoc、测试名默认英文 |
| 注释规范 | `standards/coding/rust.md` rustdoc 章节、Step 3 | 设计文档中文 Rustdoc 只作为设计说明,实现时必须转写为英文源码注释 |
| commit footer | `standards/document/实施计划书写规范.md`、`projects/README.md` §8.2 | 如有 AI 参与,footer 使用 `Co-Authored-By: Codex <noreply@openai.com>` |

### 5.4 哪些内容仍待确认，不能进入实施？

| 内容 | 当前状态 | 未确认前的处理方式 |
|---|---|---|
| 正式 `03-详细设计.md` 汇总 | 尚未执行 Step 19 | 实施计划只能引用 Step 1 ~ Step 16 中间产物;不能宣称正式详细设计已发布 |
| `07-实施计划.md` | 尚未创建 | Step 17 只交付承接清单;正式实施计划后续单独按 SOP 生成 |
| 配置文件完整 schema、环境变量名和 CLI flag 细节 | Step 14 明确留给配置设计文档 | 实施计划只能列为前置准备或待补配置设计,不能在详细设计中脑补 |
| L0-bus 运行时投递、ack、retry、dead-letter | L0-core 非范围 | 实现时只保留 `EventPublisherPort` / outbox 边界,不得实现 bus runtime |
| HTTP / gRPC online server | P0 非范围 | 不进入 L0-core 实施计划;如后续需要,另开架构和需求变更 |
| 完整测试策略、覆盖率目标和环境矩阵 | Step 16 留给测试方案 | 实施计划只嵌入测试门禁,不替代测试方案 |
| P1 包管理写协议和扩展入口 | Step 10 标注为 P1 / 待回补 | P0 实施只保留数据结构和不可破坏边界,不实现外部写入口 |

### 5.5 实施计划应该如何引用本文，而不是重复本文？

| 正确引用方式 | 错误引用方式 |
|---|---|
| 在实施计划每个阶段引用详细设计 Step 文件和正式章节位置 | 把 Step 6 的全部 struct / enum 复制进实施计划 |
| 阶段任务写“实现 `ContractChangeService` 纵切,契约见 Step 6 / 9 / 11” | 在实施计划重新定义 `ContractChangeService` 字段和函数 |
| 测试门禁引用 Step 16 的测试切口和 `05-测试方案.md` | 在实施计划重写完整测试矩阵 |
| 提交纪律引用 `standards/document/实施计划书写规范.md` 和目标仓历史提交 | 在实施计划发明另一套 commit message 规则 |
| 待确认项引用 Step 18 风险清单 | 把未确认项写成正式实现任务 |

---

## 6. 当前问题诊断

| 问题 | 影响 | 本步修正 |
|---|---|---|
| Step 1 ~ Step 16 产物已经很多,实施计划容易不知道从哪里读 | 实施者可能跳过关键中间产物,直接按旧 `03-详细设计.md` 开发 | 本步把全部承接项和阅读顺序列清 |
| 提交规范、git config、源码语言和注释规范容易被遗漏 | 目标实现仓可能出现中文源码注释、错误提交身份或不合格 commit | 本步把这些作为阻塞性前置阅读 |
| 实施计划容易重复详细设计内容 | 造成两套对象、函数、协议和状态机口径 | 本步明确实施计划只引用详细设计,不复制重写 |
| 部分内容仍留给配置 / 测试 / 实施计划 | 实施者可能在详细设计阶段脑补 | 本步列出不能进入实施的待确认项 |

---

## 7. 改动前后对比

| 维度 | 改动前 | 改动后 |
|---|---|---|
| 实施承接 | 只有 Step 1 ~ Step 16 分散中间产物 | 有统一承接清单,可直接交给 `07-实施计划.md` |
| 阅读清单 | 分散在 Step 3 和规范文档中 | 集中列出设计、测试、验收、编码、提交和 git config 前置阅读 |
| 提交纪律 | 只在规范和 Step 3 中出现 | 明确成为实施前置阻塞项 |
| 未确认项 | 分散在各 Step 的待确认表 | 收敛为不得进入实施的边界清单 |
| 与实施计划关系 | 容易复制详细设计 | 明确实施计划引用本文,不重写本文 |

---

## 8. 设计取舍

| 决策点 | 方案 A | 方案 B | 推荐 | 原因 |
|---|---|---|---|---|
| 是否在本步写实施阶段 | 写阶段和排期 | 只写承接清单 | B | 阶段任务拆分属于 `07-实施计划.md`,不是详细设计 Step 17 |
| 是否复制对象和协议定义到实施计划 | 复制 | 只引用详细设计位置 | B | 避免两套实现契约漂移 |
| 是否把提交规范简写为“按规范提交” | 简写 | 列出必须阅读的提交规范、git config 和语言边界 | B | 这是实施前置门禁,不能省略 |
| 是否允许在正式 `03` 未汇总前启动实现 | 允许 | 不建议;至少必须明确仍以中间产物为来源 | B | Step 19 尚未完成前,正式详细设计还未统一校对 |

---

## 9. 结构化中间产物

### 9.1 实施承接清单

| 承接项 | 已定义位置 | 实施者如何使用 |
|---|---|---|
| 范围与非范围 | Step 1 / Step 2 | 确认只实现 L0-core P0 |
| 编码与提交约束 | Step 3 | 确认源码英文、Rust 规范、git config 和 commit 规则 |
| 文件布局和模块主轴 | Step 4 / Step 5 | 建立 workspace、crate、module 和 asset root |
| 对象、trait、port、adapter | Step 6 / Step 7 | 实现 domain、application、infra 和 runtime wiring |
| 协议和处理流 | Step 8 / Step 9 | 实现 Command / Query / Event / Job 和 flow |
| 状态、持久化、错误、幂等 | Step 10 / Step 11 / Step 12 / Step 13 | 实现状态矩阵、事务、一致性、错误恢复和 replay |
| 配置、观测、测试切口 | Step 14 / Step 15 / Step 16 | 实现 config、日志 / 指标 / 审计和最小测试门禁 |

### 9.2 实施前置阅读清单

| 文档 | 阅读目的 |
|---|---|
| `projects/L0-core/00-需求文档.md` | 理解需求边界 |
| `projects/L0-core/01-架构设计.md` | 理解架构边界 |
| `projects/L0-core/02-概要设计.md` | 理解代码主体骨架 |
| `projects/L0-core/design-calibration/03_ddd_calibration_flow.md` | 找到详细设计中间产物 |
| `projects/L0-core/design-calibration/03_ddd_step_01_upstream_boundary.md` ~ `03_ddd_step_16_test_slices.md` | 理解实现契约来源 |
| `projects/L0-core/05-测试方案.md` | 理解测试方案承接方式 |
| `projects/L0-core/06-验收标准.md` | 理解验收门禁 |
| `standards/coding/rust.md` | 理解 Rust 编码和注释规范 |
| `standards/document/实施计划书写规范.md` | 理解实施计划、提交边界和提交纪律 |
| `projects/README.md` §8.2 | 理解提交语言和固定 footer |
| 目标实现仓历史提交 | 对齐目标仓 commit 风格 |
| 目标实现仓 `git config user.name/user.email` | 确认提交身份 |

### 9.3 未进入实施的待确认项

| 待确认项 | 当前影响 | 需要谁确认 | 未确认前的处理方式 |
|---|---|---|---|
| 正式 `03-详细设计.md` 尚未汇总 | 不能把中间产物当作正式发布文档 | 本文档维护者 | Step 19 前只引用中间产物 |
| `07-实施计划.md` 尚未创建 | 还没有阶段任务、提交边界和门禁嵌入 | 实施计划编写者 | 后续按实施计划 SOP 单独生成 |
| 配置文件完整 schema | runtime 配置细节未完全落地 | 配置设计负责人 | 只按 Step 14 的 config entry 实现接口 |
| L0-bus 运行时能力 | L0-core 只定义事件边界 | L0-bus 负责人 | 只实现 outbox 和 publisher port |
| P1 包管理写入口 | P0 不实现外部写协议 | 产品 / 架构负责人 | 保留扩展边界,不进入 P0 |

---

## 10. 回填草稿

正式 `03-详细设计.md` 回填时应遵守:

```text
1. §16 只写实施承接清单、实施前置阅读清单和未进入实施的待确认项。
2. 不写实施阶段、任务拆分、工期和人员安排。
3. 不复制详细设计前文的对象、函数、协议和伪代码正文。
4. 必须包含提交规范、git config 用户、Rust 编码规范和注释规范。
5. 必须说明正式 `07-实施计划.md` 后续应引用本文,而不是重写本文。
```

建议正式文档 §16 结构:

| 正式章节位置 | 回填内容 |
|---|---|
| `16.1 实施承接清单` | Step 1 ~ Step 16 已交付给实施计划的契约 |
| `16.2 实施前置阅读清单` | 实施者开始编码前必须阅读的设计、测试、验收、编码和提交规范 |
| `16.3 未进入实施的待确认项` | 不能在实施计划中脑补的事项 |

---

## 11. 待确认事项

| 待确认项 | 备选方案 | 推荐方案 | 推荐理由 | 当前状态 |
|---|---|---|---|---|
| 是否在 Step 17 写实施阶段 | A. 写; B. 不写 | B | 实施阶段属于 `07-实施计划.md`,本步只做承接 | 已按 B 作为本轮口径 |
| 是否允许实施计划复制详细设计对象 | A. 允许; B. 不允许,只引用位置 | B | 避免详细设计和实施计划产生两套契约 | 已按 B 作为本轮口径 |
| 是否把提交规范列为阻塞性前置阅读 | A. 否; B. 是 | B | 目标实现仓必须遵守英文 commit / 英文源码注释等边界 | 已按 B 作为本轮口径 |
| Step 19 前是否可以直接启动实现 | A. 可以; B. 不建议,除非明确以中间产物为来源 | B | 正式详细设计尚未统一校对 | 已按 B 作为本轮口径 |

---

## 12. 进入下一步条件

Step 17 完成后必须满足:

- 实施计划可以直接承接 Step 1 ~ Step 16 的实现契约。
- 实施者开始编码前必须阅读的材料已经明确。
- 提交规范、git config 用户、Rust 编码规范和注释规范已经列入前置阅读。
- 未进入实施的待确认项没有被写成正式实现契约。
- 可以进入 Step 18 “风险与待确认事项”。
