# Step 2. 明确配置设计目标、范围和非范围

> 对应 SOP：`standards/document/配置设计讨论流程_SOP.md` Step 2
> 正式回填：`04-配置设计.md` §2
> 状态：`completed / pass_with_upstream_blockers / stop_review`（连续授权下进入 Step 3）

## 1. Step 状态与本步目标

| 项 | 结论 |
|---|---|
| 当前 Step | Step 2：目标、范围、非范围 |
| 输入 | Step 1 上游边界、正式 00～03、03 Step 14/15 |
| 输出 | 目标表、P0/P1/P2 分层、范围/非范围、无配置路径判定和残余风险 |
| 本步限制 | 不定义具体 key、默认值、优先级、环境值、secret 轮换或部署命令 |
| 下一动作 | 更新 flow/台账，进入 Step 3 |

本仓存在 raw config reader、runtime builder、required adapter slots、预算/codec/retention 引用和 observability/redaction seam，因此不是“无配置项目”。Step 3～13 均适用；未闭合的外部能力不因“有配置项”而变为可用。

## 2. SOP 问题回答

| 问题 | 回答 |
|---|---|
| P0 必须定义哪些配置才能运行主链？ | P0 定义 runtime profile/config identity、local store/UoW、context/authority/visibility、逐 source export、integrity/compatibility/governance/storage、per-owner receiver、inbound consumer mapping、operation/cursor binding、page/batch/worker/timeout/probe budget、result/lifecycle schedule ref、safe telemetry/redaction，以及对应的 disabled/blocked/fail-closed 语义。具体 provider 和数值仍待 authority。 |
| 哪些属于 P1/P2？ | P1 是已存在 optional seam 的 durable/real-like provider、staging-like receiver/storage、正式 observability handoff 和运维硬化；P2 是 remote config center、admin override、hot reload/online LKG、多区域/多租户、供应商专属调优和高级容量。它们不能伪装成当前 P0。 |
| 哪些细节留给部署/运维？ | 实际 config 文件路径、环境变量名、挂载、secret provider 操作、证书安装、endpoint、拓扑、告警面板、值班 runbook、发布命令和真实凭据。 |
| 哪些留给实施计划？ | 配置 schema 落地顺序、fake→durable 批次、profile 准备、commit boundary、迁移执行、回滚提交和目标仓事实检查。 |
| 哪些非范围仍有风险？ | provider/算法/schema/receiver/存储/workload 未闭合；旧 05/06 可能污染环境和验收口径；任何新增 runtime 字段或 constructor/port/error/DTO/flow 都必须回写 03。 |

## 3. 目标表

| 目标 | 说明 | 交付给下游的结果 |
|---|---|---|
| 配置入口唯一 | raw source 只进入 `infra/config.rs`，由 `runtime_builder.rs` 装配 validated refs/handles | 05 可验证 reader isolation；07 可规划 builder boundary |
| 绑定按能力拆分 | 每个 exact slot/source/owner/consumer 有独立 binding，不用泛化 registry 或 workspace fallback | 05/06 可按 slot 判定缺失与阻塞 |
| 预算显式且不伪造 | page/batch/timeout/lease/retry/probe 由 typed 参数承接，缺 authority 不填零值 | 测试和运维可识别 budget 缺失 |
| 安全与真相边界 | secret 仅 opaque ref；配置不改变 authority、状态、UoW、Query no-write 或恢复写权 | 05/06 可做负向门禁 |
| 失败可判别 | missing/invalid/unavailable/degraded/unsupported/unknown 各有处置 | 05/06/07 可承接 fail-closed |
| 演进可追溯 | schema/revision、old-work binding 和迁移/废弃策略有明确入口 | 07/运维可规划变更和回滚 |

## 4. 配置分层

| 等级 | 当前口径 | 本轮处理 |
|---|---|---|
| P0 | 能构造本地 validated assembly、暴露受限 facade、运行已定义 local/fake/blocked 负向主链；含安全校验、预算和 exact slot totality | 详细展开；不把外部成功写成默认 |
| P1 | durable store、正式 owner/receiver、真实存储/完整性/兼容性、正式观测材料交接等已存在 seam 的生产化绑定 | 定义控制面和待确认；不锁产品 |
| P2 | remote/admin/hot reload、multi-region/tenant、vendor-specific、复杂容量/SLO 和深度运营增强 | 仅记录未来触发，不生成当前 key |
| Forbidden | 改变 source-authority、项目状态、治理许可、closure、digest truth、UoW/CAS/fence、Query no-write、恢复写权或 readiness | 永不配置化 |

## 5. 范围与非范围

| 范围 | 本轮必须给出的结果 |
|---|---|
| runtime/profile | profile identity、schema/revision、assembly posture、required/optional exact slot 规则 |
| stores/consistency | local store、transaction/UoW/CAS/read-set/probe 能力引用；缺失 fail-closed |
| source/authority | 每类 source 的 binding、版本/fence/coverage contract 引用；workspace 永为 Auxiliary |
| integrity/compatibility | capability/binding ref、Unknown/Unsupported/IntegrityFailed 处置；不选算法/key |
| storage/lifecycle | storage target、tier/location/action schedule ref 和 commit-unknown 处置；不授权 retention/delete |
| restore | per-owner receiver binding、material/plan target、probe/compensation reference |
| inbound/observability | exact consumer mapping、schema/trust、safe telemetry/redaction 语义 |
| budgets/codecs | typed page/batch/timeout/retry/probe/lease 与 operation/cursor codec ref；缺闭合则 blocked |

| 非范围 | 唯一承接位置 |
|---|---|
| 需求目标、业务规则、项目状态与治理决定 | 正式 00、各 owning project、未来 06 |
| 详细设计对象、trait/port、DTO、状态、错误、函数流和 builder 签名 | 正式 03；发现影响先回写 03 |
| 数据库/对象存储/Bus/KMS/签名/压缩/schema provider 选型 | owner ADR、基础设施和实施计划 |
| 实际 endpoint、DSN、secret material、挂载和命令 | 部署/运维与安全资料 |
| 完整测试用例、run、artifact、report、evidence、验收 verdict | 05/06；本轮不生成 |
| phase、commit、目标仓和代码 | 07；本轮不创建 |
| 产品 UI、SDK client/cache、runtime/tools/sandbox/marketplace | 相应 owning project |

## 6. 无配置路径判定

| 判断项 | 结论 | 依据 |
|---|---|---|
| 是否有 config reader/runtime builder | 是 | 03 §13、Step 14 |
| 是否有 exact adapter/store/receiver binding | 是 | 11 类 `ArchiveAdapterSlot` |
| 是否有预算、codec、retention、redaction 引用 | 是 | 03 §12～§15、Step 14/15 |
| 是否可仅生成“无配置说明” | 否 | 主链装配和安全边界需要配置语义 |

## 7. 取舍与历史差异

| 议题 | 采用方案 | 理由 |
|---|---|---|
| 是否直接继承旧 05/06 | 否，仅作方向/污染审计 | 旧对象、StorageTier、RetentionClass、数字和流程与当前 03 不同 |
| 是否锁定真实 provider | 否，product-neutral typed ref + blocked/fail-closed | owner/安全/基础设施合同未闭合 |
| 是否把每个外部能力做成必选 | 按 exposed surface 和 frozen target conditional required | 避免未请求 source/owner 阻塞无关 query，同时不缩短 required set |
| 是否支持 hot reload/remote override | 当前不支持；startup/new assembly 或 job-run-start 固化 | 避免旧 intent 使用 current config、半切换和未审计 override |
| 是否把 P1/P2 写成当前可用 | 否，作为 future/pending | 防止形成虚假 readiness |

## 8. 对 03 的影响判定

| 配置结论 | 是否影响 03 | 影响类型 | 03 回写位置 | 处理状态 |
|---|---|---|---|---|
| 本仓为有配置项目，承接既有 config/builder/slot binding | 否 | 范围确认 | 不适用 | 无回写 |
| P0/P1/P2/Forbidden 分层只重组既有绑定点 | 否 | 配置语义分层 | 不适用 | 无回写 |
| 当前不支持 hot reload、remote override、online LKG | 否 | 生命周期边界 | 不适用 | 无回写 |
| future 若新增 runtime config 字段、builder lifecycle、adapter constructor、port、error、DTO 或 flow | 是（未来触发） | 代码契约变化 | 03 §4～§15 与对应 Step | 无回写（未来触发前暂停并回写） |

## 9. 回填草稿

> 校准来源：`design-calibration/04_config_step_02_scope.md`

正式 §2 应写明：本仓不是无配置项目；配置设计以 runtime/profile、exact binding、预算与安全控制面为 P0，以未锁定 provider 的产品化接缝为 P1，以 remote/admin/hot/multi-region 等为 P2；禁止用配置改变 truth ownership、状态、治理许可、事务/幂等、Query no-write、source matrix、恢复写权或 readiness。部署命令、真实凭据、测试证据和实施边界不属于本章。

## 10. 待确认与进入下一步条件

| 待确认事项 | 影响 | 未确认前处理 |
|---|---|---|
| P1 provider/算法/存储/receiver 合同 | 影响正向 adapter | exact slot `Blocked`/`Unknown`；不造默认 |
| workload/容量/恢复目标 | 影响预算数值 | 不填未经 authority 的数字 |
| 旧 05/06 重写时间 | 影响下游矩阵 | 只提供承接方向 |

| 进入 Step 3 条件 | 状态 |
|---|---|
| 目标、范围、非范围和 P0/P1/P2 已收稳 | 通过 |
| 无配置路径已判定 | 通过；本仓有配置 |
| 03 影响判定已记录 | 通过；当前无立即回写 |
| Step 2 产物/flow/项目台账待同步 | 通过后进入 Step 3 |
