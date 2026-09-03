# L2-member-images 05 测试方案 Step 8：测试环境与配置矩阵

> 状态：`completed`
> 对应 SOP：`standards/document/测试方案讨论流程_SOP.md` Step 8
> 回填位置：正式 `05-测试方案.md` 第 8 章

## 0. Step 状态与输入

| 项目 | 记录 |
|---|---|
| 本步目标 | 规定每个测试层级的环境、profile、依赖类型、协作方式和配置边界，不把 ref/runtime/event 关系写成 compile dependency。 |
| 本步输入 | Step 7 数据；04 §3~§12 五域 21 key/profile/fail-closed；01/03 依赖裁剪。 |
| 本步输出 | 环境矩阵、依赖类型矩阵、拓扑图、profile 测试承接。 |
| gate_status | `pass_with_explicit_blockers` |

## 1. 环境矩阵

| 环境/profile | 用途 | 依赖服务/协作 | 依赖类型 | 关键配置 | 数据策略 | 风险 |
|---|---|---|---|---|---|---|
| `local-dev` | strict parse、domain/unit、local composition 设计验证 | local store；外部 ref 以 unavailable/controlled seam | `ref`/`adapter`，active sibling compile dependency 为零 | safe absence + project JSON + allowlisted selector | `DS-*` 独立 namespace | 缺 owner 时只能 blocked |
| `ci-test` | deterministic contract/service/config/redaction | isolated store、TestOnly fake、fault injector | `fake`/`runtime`；不新增 sibling path dependency | explicit test JSON、`test_only` fixture 仅此 profile | 每 job 独立 namespace | fake 不能伪造真实成功 |
| `integration-like` | controlled adapter/UoW/projection failure mapping | controlled resolver/builder/Artifact/consumer seam | `runtime`/`adapter`/`event` | no raw secret/body；opaque selector | deterministic seed + disposable store | 正向 owner contract 仍 pending |
| `staging-like` | future owner-closed smoke | approved real-like adapter（尚未授权） | `runtime`/`event`/`ref` | approved startup config | isolated release candidate | 当前不得列为 must-pass |
| `production-like` | future release gate | approved production adapters（未闭合） | `runtime`/`event`/`ref` | explicit production mode；禁止 fake | governed namespace | 无 baseline/批准，保持 blocked |

## 2. 环境拓扑图

#### 环境拓扑图: 测试入口与受控边界

```text
[contracts/domain unit]
          | in-process
          v
[application service + ports]
          | [fake] / [runtime] controlled seam
          v
[infra store + config + adapter]
          | [ref] [event] pending owner boundary
          v
[worker/api/jobs logical entry]
          | evidence only
          v
[scripts/gates -> artifacts/test/<run_id>/]
```

关键说明:

- `[compile]` 仅可用于正式获准的 shared carrier；当前 active sibling compile dependency 为零。
- `[runtime]`、`[event]`、`[ref]`、`[adapter]` 不允许在测试环境表中改写为源码 path dependency。
- 图不表示真实 bus、registry、container、scheduler 或已运行的环境。

## 3. 配置测试矩阵

| 配置面 | 正向设计 | 负向门禁 | 结果上限 |
|---|---|---|---|
| strict JSON/schema | 合法五域配置可解析 | duplicate/unknown/comment/trailing comma/错误 shape reject | typed binding 或 `Blocked` |
| source priority | safe absence < JSON < allowlisted env | 高优先级非法不得回退 JSON/null | reject whole effective config |
| profile/fake | `ci-test` explicit fixture | fake 与 production 混用 reject | `Blocked`/fail-fast |
| sensitive/redaction | opaque selector 通过 | raw secret/body/URL/credential reject | 不输出敏感材料 |
| startup-only | builder 前冻结 | reload/LKG/online override reject | restart required；不宣称 hot reload |

## 4. 回填草稿、待确认事项与进入下一步条件

正式 §8 回填环境矩阵、拓扑图和配置矩阵。staging/production 的真实服务、拓扑、阈值和批准人待 owner 闭合；在此之前只能保留 blocked。进入 Step 9 的条件是每个 P0 套件有环境/profile、依赖类型、协作方式和数据策略。
