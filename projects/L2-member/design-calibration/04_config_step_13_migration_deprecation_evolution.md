# Step 13. 定义配置迁移、废弃与演进

> 对应 SOP：`standards/document/配置设计讨论流程_SOP.md` Step 13
> 回填章节：`04-配置设计.md` §13 配置迁移、废弃与演进
> 粒度参考：`projects/L1-governance/design-calibration/04_config_step_13_migration_deprecation_evolution.md`
> 状态：`completed / pass_with_upstream_and_design_blockers / stop_review`
> 日期：2026-09-03

## 1. Step 状态

| 项目 | 结论 |
|---|---|
| 当前 Step | Step 13：定义配置迁移、废弃与演进 |
| 输入 | Step 7 配置项、Step 8 sensitive、Step 9 load / activation、Step 10 rollback、Step 12 downstream handoff |
| 输出 | 当前迁移表、未来重命名 / 废弃策略、兼容窗口、移除条件、审计和跨演进审计 |
| 当前状态 | 已完成；允许进入 Step 14 |
| 首版结论 | 当前没有已发布、已批准兼容的旧 key；旧 README / 旧 `05/06` key 不自动兼容，历史名称不成为 alias |
| 未来原则 | 任何新增、重命名、类型变化、敏感级别变化或移除都必须走受控变更、兼容窗口、测试 / 验收门禁和回滚设计 |
| 持续 blocker | owner exact contract、physical product、24 candidate 等继续开放 |

## 2. 本步目标与执行边界

本 Step 定义配置 schema 如何演进，避免历史污染重新进入当前设计，并保证 key、类型、来源、生效和 sensitive 语义有可审计的兼容过程。

本 Step 不执行迁移、不修改历史配置文件、不生成实现脚本、不声明已有部署实例，也不选择 schema registry / config center 产品。当前没有已发布配置可迁移；未来迁移必须先证明旧 key 的真实发布范围和 owner。

## 3. SOP 问题回答

| 问题 | L2-member 结论 |
|---|---|
| 是否存在旧配置需要迁移？ | 当前设计基线没有核验到可继承的已发布配置；旧 README、旧正式 04 之外的历史材料和旧 05/06 不构成兼容输入，因此当前迁移表为“无已批准迁移项”。 |
| 新配置如何引入？ | 先在 04 校准中增加配置项、来源、类型、敏感级别、校验、生效、失败和下游承接，再由 03 影响判定和 07 planned implementation gate 进入实现。 |
| 旧配置如何废弃？ | 先标记 deprecated，保留明确兼容窗口与冲突规则；窗口结束后旧 key 进入 reject / fail-fast，不静默解释为新 key。敏感旧 ref 不复制 raw material。 |
| 是否需要兼容窗口？ | 只要旧 key 已真实发布或被正式 authority 引用，就必须有兼容窗口；若没有已发布证据，不创建虚构窗口，直接将历史 key 视为 unsupported。 |
| 何时允许移除？ | 新 key 已覆盖目标 profile、05 负例和 06 gate 已定义，运维材料和 rollback 已准备，兼容窗口结束且无 owner blocker 后，才允许移除。 |
| 配置迁移能否改变业务语义？ | 不能。迁移只能改变 key / representation / adapter binding；不得改变双锚、owner、state、UoW/CAS、replay、Query no-write、Unknown fence 或 24 candidate blocked 语义。 |
| 是否影响 03？ | 当前没有。若迁移需要新 carrier、builder 参数、Port、error、flow、persistent migration state 或 online reload，则必须先回开 03。 |

## 4. 当前迁移与废弃表

| 旧配置 | 新配置 | 状态 | 兼容窗口 | 迁移策略 | 移除条件 |
|---|---|---|---|---|---|
| 无已批准旧 key | 当前 Step 7 canonical keys | 当前无迁移项 | 不适用 | 旧 README / 历史 key 不自动 alias；首次采用 canonical key | 正式发布 authority 确认后再建立版本记录 |
| 历史 transport / publisher / topic / route 假设 | 无 | unsupported historical material | 不适用 | 直接拒绝；不得转译为 `handoff` 或 `publication_blocked` 配置 | 永久不进入当前 schema |
| 历史 UDS / launch token / endpoint / DB / broker key | 无 | unsupported historical material | 不适用 | 记录污染审计；不读取、不兼容、不迁移 | 永久不进入当前 schema |
| future canonical key rename | 新 canonical key | future planned | 需 authority 指定 | 双读仅限兼容窗口；新写只写 canonical；冲突按高优先级/显式 reject 规则 | 所有目标 profile 完成切换、旧 key 使用归零且 06 gate 通过 |
| future type / sensitivity change | versioned replacement key | future planned | 必须显式 | 不做隐式字符串转换；新 schema 先 reject 不兼容值 | 新 key 验证、运维 / rollback 完成 |
| future removal of optional feature key | none | future planned | deprecation window | 先 disabled / warning，再 reject；不改变核心 truth | usage / owner / test / acceptance 审查完成 |

## 5. 配置演进状态机

| 状态 | 含义 | 允许行为 | 禁止行为 |
|---|---|---|---|
| `proposed` | 仅有变更提案 | 评估影响、补 calibration | 进入生产 schema 或 builder |
| `approved` | 04、03 影响、owner / security review 完成 | 进入 planned implementation / test matrix | 直接声明已部署 |
| `dual-read` | 真实旧 key 已发布且兼容窗口开始 | 读取旧 + 新，冲突显式处理；新写只 canonical | 双写 raw secret、改变业务语义 |
| `canonical-only` | 所有目标 profile 已迁移 | 只读 canonical；旧 key reject / warn 按窗口规则 | 继续接受旧 alias |
| `deprecated` | 计划移除但仍需通知 | 输出安全 warning / issue，保留 rollback | 静默删除或自动转换 |
| `removed` | 兼容窗口结束且门禁通过 | 旧 key fail-fast / unknown key reject | 从旧 key 推断新值 |
| `blocked` | owner / product / security / 03 contract 未闭合 | 保持旧已验证 snapshot 或 blocked | 以 default / fake 解除 blocker |

## 6. 未来重命名兼容规则

1. 新旧 key 必须在 04 中分别列出，不能只在实施计划或部署手册中声明 alias。
2. 兼容窗口期间若新旧 key 同时存在，必须执行显式冲突检查；不能依赖文件顺序、环境遍历顺序或“最后写入优先”。
3. 新 key 的类型、sensitivity、scope、activation 和 failure policy 必须不弱于旧 key；若语义改变，按 versioned replacement，而不是隐式转换。
4. sensitive ref 迁移只能迁移 ref identity / provider binding；禁止把旧 raw secret 复制到新普通配置。
5. 迁移不会改变 local truth、append-only history、idempotency relation、typed result、projection source 或 external Unknown；配置回滚也不撤销业务事实。
6. 旧 key 的读取审计只记录 key name、profile、redacted fingerprint、migration state 和 safe issue，不记录 raw value。

## 7. 迁移门禁与回滚矩阵

| 迁移场景 | 前置门禁 | 失败行为 | 回滚方式 |
|---|---|---|---|
| 新增非敏感 posture | schema / cross-field / 05 negative cut / 06 gate planned | reject unknown / keep old snapshot | prior verified snapshot |
| canonical key rename | authority 证明旧 key 发布、兼容窗口、双读冲突规则 | conflict / invalid value fail-fast | old canonical snapshot until window ends |
| Store / resolver / handoff ref rename | owner / scope / sensitive review、adapter compatibility | slot blocked / no-write | prior verified ref + restart |
| type or sensitivity strengthening | security review、profile matrix、redaction tests | old value reject if unsafe | remain on strict old snapshot or blocked |
| optional feature removal | usage / owner / test / acceptance review | disabled / not-available | restore prior verified posture |
| publication candidate request | `L2M-UP-005` exact contract | always reject | none; remain zero configuration |

## 8. 下游与版本承接

| 下游 | 迁移输入 | 必须保留的事实等级 |
|---|---|---|
| 05 | old/new key negative cases、dual-read conflict、sensitivity / profile matrix | planned test cases only，不能伪造 migration result |
| 06 | compatibility-window gate、removed-key rejection、rollback gate | planned acceptance conditions only |
| 07 | migration phase、dual-read / canonical-only boundary、planned ledger | planned / blocked / waiting only |
| 09 | rollout、warning、restart、secret ref rotation、retirement、rollback commands | 具体命令与实际版本由 09 承接 |

## 9. 历史污染审计

| 历史材料模式 | 是否兼容 | 处理 |
|---|---:|---|
| README 中 AG-UI / CloudEvents / UDS / launch token 名称 | 否 | 只记录历史差异；Core 当前 authority 若未来采纳需单独回开 |
| 旧固定端口、DB / broker / scheduler、P95 / SLA key | 否 | 不进入 canonical config；不设 alias |
| 旧 `05/06` 的 endpoint、CI、evidence、report、feature flag | 否 | 只作下游重建方向，不作 config migration source |
| 已正式核验的 future key | 条件兼容 | 需经过 proposed → approved → dual-read → canonical-only 状态机 |

## 10. 演进停审记录

| 演进项 | 旧 / 新边界 | 兼容策略 | rollback | 03 影响 | 结论 |
|---|---|---|---|---|---|
| current canonical keys | 无已批准旧 key | no implicit alias | prior verified snapshot | 无 | 通过 |
| future rename | 显式双读窗口 | conflict reject、new write canonical | old snapshot | 无（若无新 code contract） | 通过（future planned） |
| sensitivity strengthening | secret 不下沉 | strict reject | strict old snapshot | 无 | 通过 |
| optional feature removal | disabled → removed | safe warning / reject | restore posture | 无 | 通过（future planned） |
| 24 candidate / publication | 永不开放 | zero configuration | none | 无 | 通过 |

## 11. 跨迁移 / 废弃审计表

| 审计项 | 结果 | 缺口 / 修正 |
|---|---|---|
| 是否误把历史 key 当现行兼容 | 通过 | 无已批准旧 key；历史名称不自动 alias |
| 是否允许无兼容窗口删除真实已发布 key | 通过 | 真实发布后必须 proposed / approved / dual-read / canonical-only |
| 新旧 key 冲突是否可判定 | 通过 | 显式 conflict reject；不使用顺序覆盖 |
| 迁移是否复制 raw secret | 通过 | 只迁移 opaque ref / provider binding |
| 迁移是否改变业务 truth | 通过 | 禁止改变 owner、state、UoW/CAS、replay、no-write、Unknown |
| 下游是否会伪造迁移事实 | 通过 | 05/06/07/09 只收 planned input，实际事实留后续执行 |
| 24 candidate 是否借迁移开放 | 通过 | 永久 zero configuration，待 `L2M-UP-005` 定向重开 |
| 是否需要新 03 contract | 未发现 | 当前没有实际迁移项；未来触发器需回开 03 |

## 12. 对详细设计的影响判定

| 配置结论 | 是否影响 03 | 影响类型 | 03 回写位置 | 处理状态 |
|---|---:|---|---|---|
| 当前无已批准旧 key，不自动兼容历史材料 | 否 | schema / history 范围 | `03 §13` 已有 config boundary | 无回写 |
| future rename 使用显式兼容窗口和 canonical-only | 否 | 配置演进语义 | 不改变现有 carrier | 无回写 |
| sensitive ref 只迁移 opaque identity / provider binding | 否 | 安全边界细化 | `03 §13/§14` 已有 | 无回写 |
| 未来 dual-read / online migration 需要新 state、Port、builder API 或 persistent ledger | 是 | 代码 / persistence 契约变化 | `03 §4～§14` 与 owning Step | 已回写（03 已有回开规则；未来触发器当前未触发） |

当前不存在实际“待回写”或“阻塞待确认”项。

## 13. 回填草稿：正式 `04-配置设计.md` §13

> 校准来源：
> - `design-calibration/04_config_step_13_migration_deprecation_evolution.md`
>
> 延伸阅读：
> - 建议继续阅读本文件的“当前迁移与废弃表”“配置演进状态机”“未来重命名兼容规则”“迁移门禁与回滚矩阵”和“历史污染审计”。

正式 §13 应收口为：

1. 当前没有已批准、已发布且需要兼容的旧 key；旧 README / 旧 05/06 的 transport、endpoint、DB、broker、launch token、固定端口和指标假设不自动 alias。
2. 未来新增、重命名、类型 / sensitivity 变化或移除必须经过 proposed → approved →（必要时）dual-read → canonical-only → deprecated → removed 状态机，并由 05/06/07/09 分别承接测试、验收、实施和运维动作。
3. 新旧 key 同时存在时必须显式冲突拒绝；新写只写 canonical；sensitive 迁移只迁移 opaque ref / provider binding，不复制 raw secret。
4. 配置迁移不得改变双锚、truth owner、状态、UoW/CAS、typed replay、Query no-write、Unknown fence、local / external truth 或 24 candidate zero-configuration。
5. 未满足 owner / product / security / 03 contract 时保持 `blocked`；不得用默认值、fake 或在线 LKG 越过门禁。

## 14. 待确认事项与 blocker

| 事项 | 影响 | 未确认前处理 |
|---|---|---|
| 是否存在真实已发布旧 key | 决定是否需要兼容窗口 | 当前按无已批准迁移项处理；需正式发布 authority 证明后重开 |
| future schema registry / config center | 影响 dual-read / versioning 实现 | 当前不支持；只保留文档状态机 |
| owner / credential / endpoint ref 变化 | sensitive migration | opaque ref + restart / new job；不迁移 raw secret |
| physical Store / audit ledger | 迁移审计承载 | product-neutral；留 07 / 09 |
| `L2M-UP-005` event contract | publication key 是否存在 | 永久 zero config，待正式契约后定向重审 |

## 15. 进入 Step 14 的条件与停审结论

| 门禁 | 结果 | 依据 |
|---|---|---|
| 当前迁移项状态明确 | 通过 | §4 |
| 新增 / 重命名 / 废弃 / 移除流程明确 | 通过 | §5～§7 |
| 兼容窗口和冲突规则明确 | 通过 | §6 |
| sensitive migration 不复制 raw secret | 通过 | §6、§11 |
| 历史污染不自动兼容 | 通过 | §9、§11 |
| 下游承接与事实等级明确 | 通过 | §8 |
| 对 03 的影响已判定，无当前回写项 | 通过 | §12 |
| 正式 `04` 未提前创建 | 通过 | 遵守 Step 15 后置装配纪律 |

Step 13 完成。下一步允许创建 `04_config_step_14_risks_open_questions.md`，汇总所有 blocker、风险、待确认事项和 03 回写清单，并确认不存在当前未处理的“待回写 / 阻塞待确认”项。

```text
step_13 = completed
gate_status = pass_with_upstream_and_design_blockers / stop_review
next_allowed_action = create_step_14_risks_open_questions
formal_04_write_allowed = false_until_step_15
implementation_repo_write_allowed = false
test_execution_allowed = false
commit_required = false
```
