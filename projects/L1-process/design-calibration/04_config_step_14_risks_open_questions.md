# Step 14. 定义风险与待确认事项

> 本文件是 `projects/L1-process/04-配置设计.md` 的 Step 14 中间产物。
> 本步汇总配置设计风险、待确认事项和进入正式装配前门禁。

## 1. Step 状态

- 状态: `[x] 已完成`
- 对应 SOP: `standards/document/配置设计讨论流程_SOP.md` Step 14
- 回填章节: `projects/L1-process/04-配置设计.md` §14 风险与待确认事项

## 2. 本步输入

| 输入 | 用途 | 结论 |
|---|---|---|
| Step 1~13 | 风险汇总 | 无阻塞 Step 15 的 `待回写` 或 `阻塞待确认` |
| `03` §17 | 未确认项承接 | `05/06/07` 同步、目标实现仓、production integrations 仍为后续风险 |
| Step 12 | 下游承接 | 04 完成后需继续测试 / 验收 / 实施计划同步 |

## 3. 风险表

| 编号 | 风险 | 当前口径 | 影响 | 处理方式 |
|---|---|---|---|---|
| CFG14-RISK-001 | production durable store / bus / resolver / handoff / secret provider 产品字段未定 | P0 使用 fake / in-memory / deterministic default,只保留 ref / adapter 接缝 | 阻塞生产化,不阻塞 P0 | P1/P2 重新打开 `03/04` |
| CFG14-RISK-002 | `05-测试方案.md` / `06-验收标准.md` 仍需同步新版 `03/04` | 当前不得引用旧测试 / 验收口径作为配置门禁 | 阻塞正式测试 / 验收移交 | 后续按测试 / 验收 SOP 同步 |
| CFG14-RISK-003 | `07-实施计划.md` 尚未生成 | phase / commit boundary 未定义 | 阻塞实现 agent 正式开工 | 后续按实施计划 SOP 生成 |
| CFG14-RISK-004 | 目标实现仓 `/home/aris/Projects/quantalithos-process` 未发现 | 设计可继续,代码写入需先确认或创建仓 | 阻塞代码落地 | `07` PH-01 前置检查 |
| CFG14-RISK-005 | config center / hot reload / admin override 未进入 P0 | P0 不支持,启用即 fail-fast | 阻塞动态配置能力 | P2 专项 |
| CFG14-RISK-006 | topic map breaking change 可能与 Step 8 topic 冲突 | 默认使用 Step 8 `.v1` topics;breaking change 需新 suffix 和设计回写 | 阻塞协议升级 | 协议变更流程 |

## 4. 待确认事项表

| 编号 | 待确认事项 | 当前不确认时的规则 | 影响 |
|---|---|---|---|
| CFG14-OPEN-001 | production durable store 产品和字段 | 不实现真实 durable adapter;P0 使用 in-memory / fake | 生产化后移 |
| CFG14-OPEN-002 | real bus / resolver / handoff endpoint 产品 | 不写 raw endpoint / credential;只用 ref | 集成后移 |
| CFG14-OPEN-003 | secret provider / KMS / Vault 产品 | 不保存 raw secret;只用 ref-only sensitive | 安全运维后移 |
| CFG14-OPEN-004 | `05/06/07` 文档同步 | 不把旧下游文档交给实现者作为新版门禁 | 测试 / 验收 / 实施后移 |
| CFG14-OPEN-005 | target implementation repo | 不写代码到不存在仓 | 实现前置检查 |

## 5. Step 1~13 详细设计影响门禁

| 检查项 | 结果 | 说明 |
|---|---|---|
| 是否存在 `待回写` | 否 | Step 1~13 均为无回写 |
| 是否存在 `阻塞待确认` | 否 | 未确认项均为 P1/P2 或下游同步,不阻塞 Step 15 |
| 是否新增 `ProcessRuntimeConfig` 字段 | 否 | Step 7 只展开 `03_ddd_step_14` 既有字段 |
| 是否改变 runtime builder / adapter trait | 否 | 只定义配置来源、默认、校验和失败策略 |
| 是否新增 DTO / protocol / state | 否 | topic map 默认来自 Step 8;未新增协议 |
| 是否引入 production 产品字段 | 否 | 全部后移 |

## 6. 对详细设计的影响判定

| 配置结论 | 是否影响 03 | 影响类型 | 03 回写位置 | 处理状态 |
|---|---|---|---|---|
| Step 1~13 无 `待回写` 或 `阻塞待确认` 项 | 否 | 风险收口 | 无 | 无回写 |
| 未确认 production integration 不进入 P0 配置项 | 否 | 范围裁剪 | 无 | 无回写 |
| `05/06/07` 同步后移 | 否 | 下游文档风险 | 无 | 无回写 |

## 7. 回填草稿

`04-配置设计.md` §14 应汇总 P1/P2 production integration、下游测试 / 验收 / 实施同步、目标实现仓、config center / hot reload 和 topic map breaking change 等风险。未确认前实现者不得自行新增 production config 字段、启用 remote config、引入 raw secret、绕过 Step 8 topic map 或把 fake success 伪装为 production success。

## 8. 进入下一步条件

- 无 `待回写` 或 `阻塞待确认` 的详细设计影响项。
- 风险和待确认事项已记录。
- 可以进入 Step 15 装配正式 `04-配置设计.md`。
