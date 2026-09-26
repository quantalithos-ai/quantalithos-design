# Step 8. 设计测试环境与配置矩阵

> 对应 SOP：`standards/document/测试方案讨论流程_SOP.md` Step 8。
> 回填章节：未来正式 `05-测试方案.md` §8。
> Profile 是配置组合语境，不是已部署环境、授权、健康或 readiness；本步不创建环境实例。

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | 8 / environment_config |
| Step 状态 | `completed / stop_review` |
| gate_status | `pass_with_upstream_blockers` |
| 直接下一步 | Step 9：设计自动化与 CI/CD 门禁 |
| 持续 blocker | `SYNC-UP-001~010`、`SYNC-LOCAL-001~005` |

## 2. 本步输入

- `04-配置设计.md` §5～§12：42 leaf、来源优先级、四个 P0 profile、strict validation、activation/failure、redaction。
- Step 7 dataset classes。
- `03-详细设计.md` §13：runtime binding/capability separation、read/write graph isolation。
- Step 6 的 CLI/Command/Query/Consumer/Job 用例和 external blocker。

## 3. SOP 问题回答

| 问题 | 收口回答 |
|---|---|
| 测试环境至少要区分什么？ | `local-dev`、`ci-test`、`integration-like`、`operations-replay` 四个 P0 profile；staging/production-like 只保留 waiting/blocked 方向。 |
| 配置何时加载？ | startup/cold、job-run-start、entry-local、test harness；P0 不支持 reload/hot/config center/admin override/online LKG。 |
| source precedence 如何验证？ | `approved default < selected strict JSON < allowlisted environment`；高优先级非法值 reject，不能 fallback 到低优先级。 |
| profile 能证明什么？ | 只能证明 typed config/composition 与受控能力分类；`bound/blocked/unsupported/unknown` 不等 health/authorization/fresh/accepted/readiness。 |
| 外部依赖如何挂载？ | 仅 opaque ref + adapter capability classification；不把 ref 存在当作合同、授权或可用。 |

## 3A. 旧材料诊断与改动前后对比

| 维度 | 旧材料 | 当前环境/配置方案 |
|---|---|---|
| profile | 环境名与健康混同 | 四个 P0 组合语境；profile 不等部署/授权/readiness |
| source precedence | 允许宽松 fallback | default < selected strict JSON < allowlisted env；高优先级非法直接 reject |
| activation | 可能热加载/LKG | startup/cold、job-run-start、entry-local、test harness；hot/reload unsupported |
| fake | fake 被当真实集成 | deterministic/controlled binding 不关闭 `SYNC-UP-*` |

## 3B. 测试设计取舍

1. 先测试 strict parser、closed-section、42 leaf 和 builder fail-fast，再测试 adapter capability；避免半装配图进入业务。
2. `integration-like` 只证明 controlled seam；`operations-replay` 默认禁止新 effect，适合 unknown/recovery 负向。
3. staging/production-like 不进当前 P0 schema，避免在没有 support matrix 时把历史工具选择写成能力。

## 4. Profile 矩阵

| Profile | 目标切口 | 允许 capability | 必测禁止项 | 当前状态 |
|---|---|---|---|---|
| `local-dev` | CLI/entry local validation、negative/dirty/path、safe presentation | deterministic/local/test-capable refs；可返回 blocked/unknown | 不提供 raw secret；不 default selection；不绕过 owner checks | P0 planned |
| `ci-test` | unit/contract/flow/fault、schema/redaction、state/UoW | deterministic Clock/ID/Digest、fake/controlled refs | fake 不关闭 `SYNC-UP-*`；不声称 integration/evidence/readiness | P0 planned |
| `integration-like` | controlled adapter seam、failure mapping、availability | declared opaque refs；capability 逐项分类 | ref ≠ health/auth/fresh/clean/accepted；positive external 可 blocked | P0 planned / external waiting |
| `operations-replay` | bounded replay/recovery、unknown/probe analysis |脱敏 local carrier、read-only/recovery refs、bounded jobs | 不发新 effect、不改旧 report/attempt、不删 provenance、不推进 cursor | P0 planned |
| `staging-like` | future selected-run direction | future approved refs | 不进入当前 P0 schema；不创建实例 | P1 waiting |
| `production-like` | future release direction | approved owner/tool/store/source/review only | fake/test/replay ref 禁止；contract 未闭合不 ready | P1/P2 blocked |

## 5. 配置来源与加载测试矩阵

| 场景 | 输入 | 期望 | 负向变体 |
|---|---|---|---|
| approved default | schema-approved baseline candidate | 仅形成 transient candidate；仍需 strict parse/validate | missing required / default forbidden |
| selected strict JSON | explicit file/fixture candidate | 选择优先于 default；duplicate/alias/unknown/JSONC reject | malformed/truncated/trailing comma |
| allowlisted environment | allowlisted leaf override | 仅允许覆盖相应 leaf；高优先级非法直接 reject | unallowlisted key/raw secret/empty-as-null |
| conflict | same leaf from multiple sources | deterministic precedence或whole-candidate conflict（按 04） | fallback to stale/default/cache 禁止 |
| startup/cold | complete 42-leaf candidate | immutable typed config + snapshot + graph/facade | builder partial failure 不暴露 mutation facade |
| job-run-start | bounded job budget/input | pin current run config; old report 不改 | broaden scope / non-null operations absent |
| entry-local | selector/target/path/scope/resume | only current entry context | write back global config/hot reload |
| test harness | synthetic deterministic refs/faults | isolated composition | test ref 进入 production-like registry |

## 6. 42 leaf 测试分组

| 配置组 | leaf 数量/形态 | 主要断言 |
|---|---:|---|
| identity/boundary/execution | 选择、权限、scope、并发/预算等 required leaf | required、positive integer、cross-field、explicit selector；不 default allow |
| jobs | bounded batch/concurrency/schedule-like slots | 4 operations slot 仅 `null` 或 canonical ref；null 不注册 runner |
| metadata | store/UoW/lock/snapshot/migration refs | 独立 capability；同 ref 不自动推出所有能力；physical schema 不由 config 猜 |
| sdk | owner/source/handoff/Decision/probe refs | per-capability classification；owner success 不推出 source/handoff |
| localTools | observation/apply/root/non-overwrite refs | root/path/symlink/dirty guard；LFS/shallow/GUI/remote/shell 不入 schema |
| support/operations | digest/redaction/diagnostic and bounded operation refs | redaction 只能收紧；operations null/contract absent 不启动 |

## 7. 配置负向矩阵

| 负向组 | 示例 | 期望 |
|---|---|---|
| syntax | JSONC、尾逗号、截断、duplicate key | strict parser reject；不 fallback |
| structure | unknown key、alias key、forbidden section、missing closed section | whole-candidate reject；issue surface safe |
| required/nullability | required missing、empty string、operations null/invalid ref | required fail；nullable 只接受 canonical null/ref |
| type/range/unit | bool/string/number 混用、NaN/float/zero/overflow、ms/items/paths 混单位 | typed validation fail；不 clamp/无限化 |
| cross-field | maxBatch>scope、parallel>concurrent、selector conflict、incompatible adapter | fail-fast；不让半 graph 暴露 |
| sensitive | inline secret/body/path/credential/full ref | reject或裁剪；敏感值不进入 issue/log/report |
| activation | reload/hot/admin override/online LKG candidate | unsupported whole request；current composition unchanged |

## 8. 环境隔离与能力边界

1. 每个 profile 使用独立 logical namespace、clock/id/digest、metadata UoW 和 capability snapshot；不共享 mutable cache。
2. `integration-like` 可以注入 unavailable/unknown/blocked adapter；不能以 deterministic fake 把 external success 变成事实。
3. `operations-replay` 只读旧 carrier，禁止新 handoff/submit、cursor advance、workspace overwrite、provenance deletion。
4. 真实 Git/FS、SDK/source/review、physical metadata 测试必须具备 exact contract、fixture、工具支持矩阵和安全隔离，否则保持 blocked/waiting。

## 9. 回填草稿（未来正式 §8）

测试环境以四个 P0 profile 建立确定性和受控接缝：local-dev、ci-test、integration-like、operations-replay。每个 profile 使用同一 42-leaf strict schema、source precedence、sensitive/no-output 和 activation/failure 规则；通过 startup/cold、job-run-start、entry-local、test harness 作用域验证。staging-like/production-like 仅作为 future direction，未闭合 owner/tool/store 合同前不得声明可用或 ready。

## 10. 待确认事项

| 事项 | 处理 |
|---|---|
| package/test runner、environment launcher | `SYNC-LOCAL-002/004`；05 不写命令。 |
| real secret provider/rotation | 由 09/上游确认；05 只测 ref-only/no-output。 |
| Git tool support、LFS/shallow/GUI | `SYNC-UP-009/010`；不创建 capability profile。 |
| production-like approval | 需 owner contract、fixture、权限、数据隔离和 06/07 gate；当前 blocked。 |

## 11. Step 自检与进入下一步门禁

| 检查项 | 结果 |
|---|---|
| 4 个 P0 profile 与生效面完整列出 | pass |
| 42 leaf、strict source、failure/redaction 规则有负向覆盖 | pass |
| profile 未被解释为环境健康/授权/readiness | pass |
| 未创建环境实例或真实配置值 | pass |
| 允许进入 Step 9 | pass |

## 12. 下一步门禁

Step 9 必须定义 semantic suite、gate 顺序、自动化候选和 CI/CD 阻断规则，且分别保留 P0 planned、P1 blocked/waiting、P2 deferred；不得填写真实 run 或测试结果。
