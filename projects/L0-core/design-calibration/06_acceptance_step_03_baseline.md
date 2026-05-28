# Step 3. 固定验收基线

## 1. Step 状态

- 状态：[x] 已确认
- 对应 SOP：`standards/document/验收标准讨论流程_SOP.md` Step 3
- 回填章节：`projects/L0-core/06-验收标准.md` §3

## 2. 本步输入

| 输入 | 内容 | 使用方式 |
|---|---|---|
| Step 2 验收范围 | P0/P1/P2、非范围、下游只验接缝、结论影响规则 | 确定哪些基线必须固定 |
| `00-需求文档.md` | 文档版本 v0.2.0 | 作为需求基线 |
| `01-架构设计.md` | 文档版本 v0.2.0 | 作为架构基线 |
| `02-概要设计.md` | 文档版本 v0.2.0 | 作为概要设计基线 |
| `03-详细设计.md` | 文档版本 v0.2.0 | 作为详细设计和实现契约基线 |
| `04-配置设计.md` | 文档版本 v0.1.0 | 作为配置基线 |
| `05-测试方案.md` | 文档版本 v0.2.0 | 作为测试方案、TC / EV 和证据结构基线 |
| 送验版本 / 测试 run | 当前尚未实现,没有 commit、build、run_id、artifact | 定义为实施期验收前必填基线 |

依赖的前序 Step：Step 1、Step 2 已确认。

## 3. SOP 问题回答

1. 按哪一版需求和设计验收?

   回答：按当前已校准的文档版本验收: `00-需求文档.md` v0.2.0、`01-架构设计.md` v0.2.0、`02-概要设计.md` v0.2.0、`03-详细设计.md` v0.2.0、`04-配置设计.md` v0.1.0、`05-测试方案.md` v0.2.0。不得写“按最新文档验收”。

2. 按哪一版测试方案和测试结果裁决?

   回答：测试方案按 `05-测试方案.md` v0.2.0 裁决。测试结果当前不存在,必须在实施期送验时固定 `run_id`、被测 commit、config_profile、suite summary、P0 case result、evidence artifact 路径和缺陷状态。没有真实测试 run 时,06 只能定义验收标准,不能给出通过结论。

3. 送验 build / commit / image 是什么?

   回答：当前没有代码实现仓送验 build / commit / image。本轮 06 先定义必填字段: implementation repository、commit SHA、build artifact、binary/crate version、CI run id、release candidate id。送验时这些字段必须由实施计划或送验说明补齐。

4. 环境、配置、数据和依赖是什么?

   回答：环境基线来自 `05-测试方案.md` 的 `ci-test`、`integration`、`release-like`。配置基线来自 `04-配置设计.md` 的 7 个 P0 配置项和 profile fixture。数据基线必须包含 `test_run_id`、fixture namespace、config fixture、fake / real-like adapter 选择。依赖基线明确不连接真实 L0-bus、真实下游仓库或真实 secret provider;P0 只验 outbox / CloudEvent / resolver fake / real-like file adapter 边界。

5. 基线变更如何处理?

   回答：任一需求、设计、配置或测试方案版本变化,都必须重新确认影响范围并更新验收基线。任一被测 commit、配置 profile、测试数据、证据 run 或 artifact 路径变化,都必须重新生成或重新关联证据。不得在验收过程中把基线改成“最新版本”。

## 4. 当前文档问题诊断

| 位置 | 问题 | 影响 |
|---|---|---|
| `06-验收标准.md` §2 | 需求 / 设计 / 测试基线只写文件路径,没有文档版本 | 无法复查到底按哪版裁决 |
| `06-验收标准.md` §2 | 版本基线写“当前文档批次” | 不可定位,违反不得使用“最新版本”类口径 |
| `06-验收标准.md` §2 | 环境基线仍是 test / staging 级 shared primitive 接缝环境 | 与新版 `ci-test` / `integration` / `release-like` 不一致 |
| `06-验收标准.md` §2 | 没有送验 commit、run_id、config_profile、artifact、test_run_id 字段 | 未来无法把验收结论和证据绑定到具体交付 |
| `06-验收标准.md` 全文 | 没有基线变更处理规则 | 验收过程中可能漂移 |

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 文档基线 | 文件路径或当前文档批次 | 明确 00 v0.2.0、01 v0.2.0、02 v0.2.0、03 v0.2.0、04 v0.1.0、05 v0.2.0 | 可定位、可复查 |
| 交付基线 | 未定义 | implementation repo、commit SHA、build artifact、binary/crate version、CI run id、release candidate id | 验收必须绑定具体交付 |
| 测试基线 | 未定义 run | `run_id`、suite summary、P0 result、EV artifact、defect state | 验收必须绑定证据 |
| 环境配置 | test / staging 旧口径 | `ci-test` / `integration` / `release-like` + 7 个 P0 配置项 | 对齐 04 / 05 |
| 基线变更 | 未定义 | 文档、commit、profile、run、artifact 任一变化均需重判影响 | 防止漂移 |

## 6. 验收裁决取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| A. 当前先不写基线,等实现后补 | 避免占位 | 实施期不知道必须准备哪些字段 | 不采用 |
| B. 使用“最新版本 / 当前 commit / 当前 CI” | 简短 | 不可复查,违反 SOP | 不采用 |
| C. 文档基线先固定版本,实施基线列必填字段并在送验时补齐 | 可指导实施,也不伪造结果 | 需要后续补真实值 | 采用 |

## 7. 结构化中间产物

### 7.1 验收基线表

| 基线类型 | 基线内容 | 版本 / 标识 | 说明 |
|---|---|---|---|
| 需求基线 | `projects/L0-core/00-需求文档.md` | v0.2.0 | 验收目标、功能需求、业务规则、非功能和一票否决来源 |
| 架构基线 | `projects/L0-core/01-架构设计.md` | v0.2.0 | 系统边界、数据所有权、一致性和横切关注点来源 |
| 概要设计基线 | `projects/L0-core/02-概要设计.md` | v0.2.0 | 主要组成部分、对象、接口、流程和状态来源 |
| 详细设计基线 | `projects/L0-core/03-详细设计.md` | v0.2.0 | Rust 实现契约、协议、状态机、事务、错误、幂等、观测和测试切口来源 |
| 配置设计基线 | `projects/L0-core/04-配置设计.md` | v0.1.0 | 7 个 P0 配置项、profile、敏感边界和失效模式来源 |
| 测试方案基线 | `projects/L0-core/05-测试方案.md` | v0.2.0 | TC / EV、测试环境、进入退出准则、残余风险来源 |
| 校准中间产物基线 | `projects/L0-core/design-calibration/06_acceptance_step_01~15*.md` | 送验时固定 | 06 逐步收敛依据 |
| 实现仓基线 | implementation repository + commit SHA | 待送验补齐 | 不得使用“当前 HEAD”或“最新提交” |
| 构建产物基线 | crate version / binary path / build artifact | 待送验补齐 | 如果无二进制,也必须说明只验 library artifact |
| 测试执行基线 | CI run id / test `run_id` / suite summary | 待测试执行补齐 | 必须能定位 EV 证据 |
| 配置运行基线 | config_profile + config artifact fingerprint | 待测试执行补齐 | profile 必须来自 `ci-test` / `integration` / `release-like` |
| 测试数据基线 | `test_run_id` + fixture namespace | 待测试执行补齐 | 必须与证据和报告一致 |
| 证据归档基线 | `artifacts/test/l0-core/<run_id>/...` | 待测试执行补齐 | 物理 artifact 存储由实施期固定 |
| 缺陷基线 | S/A/B/C 缺陷清单 | 待送验补齐 | S/A 必须为 0 才能退出验收 |

### 7.2 基线变更规则

| 变更类型 | 处理规则 | 是否需要重验 |
|---|---|---|
| 00~05 任一文档版本变化 | 重新确认影响范围,更新验收基线和对应门禁 | 视影响范围 |
| 实现 commit 变化 | 重新绑定 build artifact 和测试 run | 是 |
| config_profile 或配置 artifact 变化 | 重跑配置相关用例和受影响主线 | 是 |
| test_run_id 变化 | 更新证据归档基线和测试结果引用 | 是 |
| EV 证据路径变化 | 更新证据索引,确认 redaction 和完整性 | 视证据内容 |
| S/A 缺陷状态变化 | 重跑对应复验用例和 release gate | 是 |

### 7.3 不可接受基线写法

| 禁止写法 | 原因 |
|---|---|
| 最新版本 | 不可复查 |
| 当前 commit | 验收后会漂移 |
| 当前 CI | 无法定位 run |
| 当前配置 | 无法复现 |
| 测试通过的那一版 | 循环定义,不能作为裁决基线 |

## 8. 回填草稿

```md
## 3. 验收基线

> 校准来源：
> - `design-calibration/06_acceptance_step_03_baseline.md`
>
> 延伸阅读：
> - 建议继续阅读上述中间产物的“验收基线表”“基线变更规则”和“不可接受基线写法”小节,了解本章如何避免“最新版本”式不可复查基线。

本轮验收不得使用“最新版本”“当前 commit”“当前 CI”作为基线。验收基线必须可定位、可复查、可复现。

| 基线类型 | 基线内容 | 版本 / 标识 | 说明 |
|---|---|---|---|
| 需求基线 | `projects/L0-core/00-需求文档.md` | v0.2.0 | 验收目标、功能需求、业务规则、非功能和一票否决来源 |
| 架构基线 | `projects/L0-core/01-架构设计.md` | v0.2.0 | 系统边界、数据所有权、一致性和横切关注点来源 |
| 概要设计基线 | `projects/L0-core/02-概要设计.md` | v0.2.0 | 主要组成部分、对象、接口、流程和状态来源 |
| 详细设计基线 | `projects/L0-core/03-详细设计.md` | v0.2.0 | Rust 实现契约、协议、状态机、事务、错误、幂等、观测和测试切口来源 |
| 配置设计基线 | `projects/L0-core/04-配置设计.md` | v0.1.0 | 7 个 P0 配置项、profile、敏感边界和失效模式来源 |
| 测试方案基线 | `projects/L0-core/05-测试方案.md` | v0.2.0 | TC / EV、测试环境、进入退出准则、残余风险来源 |
| 实现仓基线 | implementation repository + commit SHA | 待送验补齐 | 不得使用“当前 HEAD”或“最新提交” |
| 测试执行基线 | CI run id / test `run_id` / suite summary | 待测试执行补齐 | 必须能定位 EV 证据 |
| 配置运行基线 | config_profile + config artifact fingerprint | 待测试执行补齐 | profile 必须来自 `ci-test` / `integration` / `release-like` |
| 证据归档基线 | `artifacts/test/l0-core/<run_id>/...` | 待测试执行补齐 | 物理 artifact 存储由实施期固定 |
```

## 9. 待确认事项

- 是否接受文档基线先固定版本,实现仓 commit / build / run_id 在送验时补齐。
- 是否接受无真实测试 run 时,06 只定义验收标准,不得形成通过结论。
- 是否接受任一送验 commit 或配置 profile 变化都必须重新绑定证据并视影响重验。

## 10. 进入下一步条件

- [x] 基线可定位、可复查。
- [x] 已明确哪些基线当前可固定,哪些必须实施期补齐。
- [x] 已排除“最新版本 / 当前 commit / 当前 CI”写法。
- [x] 可以进入 Step 4 定义进入条件与退出条件。
