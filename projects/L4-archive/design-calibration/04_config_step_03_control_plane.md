# Step 3. 建立配置控制面总览

> 对应 SOP：`standards/document/配置设计讨论流程_SOP.md` Step 3
> 正式回填：`04-配置设计.md` §3
> 状态：`completed / pass_with_upstream_blockers / stop_review`（连续授权下进入 Step 4）

## 1. Step 状态与目标

| 项 | 结论 |
|---|---|
| 当前 Step | Step 3：配置控制面总览 |
| 输入 | Step 1/2、正式 03 §13～§15、DDD Step 14/15、架构依赖裁剪 |
| 输出 | 来源链、配置入口、控制面/配置域总表、停审与跨控制面审计 |
| 入口 | 仅 `crates/infra/src/config.rs` 读 raw；仅 `crates/infra/src/runtime_builder.rs` 装配 |
| 下一动作 | 更新 flow/台账，进入 Step 4 |

## 2. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 配置从哪些来源进入？ | 预览来源为显式 code declaration、一个 strict JSON 文件、allow-listed environment leaves 和 opaque secret reference；测试 fixture 只在 test assembly。最终优先级留 Step 5。 |
| 唯一装配入口是什么？ | `infra::config.rs` 负责读取、parse、形成 body-free typed candidate；`infra::runtime_builder.rs` 负责 validated refs、exact slot、handle、marker、service/facade assembly。 |
| 哪些模块可读 raw/validated config？ | 只有 infra 读 raw；builder/adapter 只消费 validated refs/parameters。contracts/domain/application/api/worker 不读文件、环境、secret 或 provider registry。 |
| 配置控制什么，不控制什么？ | 控制 profile、binding availability、预算、读取/执行边界和安全输出；不控制 truth ownership、authority、状态迁移、事务/幂等、Query no-write、closure、治理许可、恢复写权或 readiness。 |
| 应拆成哪些配置域？ | runtime assembly/profile、local store/consistency、source/authority、integrity/compatibility、storage/lifecycle、restore receivers、inbound consumers、operation/cursor codecs、budgets、observability/redaction、change/lifecycle。 |
| 是否影响 03？ | 当前只重组已有 binding，不新增代码契约；若后续需要新字段/constructor/port/error/DTO/flow，必须回写 03。 |

## 3. 配置来源链图

#### 配置来源链图: L4-archive 配置覆盖与装配链

```text
[explicit code declarations]
          |
          v
[one strict JSON document] ---> [allow-listed ENV leaves]
          |                              |
          +--------------+---------------+
                         v
                [infra::config.rs]
          parse / type / cross-field validate
                         |
              body-free typed refs + safe issues
                         v
                [infra::runtime_builder.rs]
     freeze profile + exposed surfaces + required slots
                         |
       exact handles + availability markers + budgets
              +----------+-----------+
              v                      v
      [application facades]   [worker consumer/job facades]
              |
              v
   [commands / queries / jobs / adapters]

[opaque secret references] --private resolution--> [exact infra adapter]
[test fixture override] ----test-only assembly------> [fake support]
```

关键说明：

- 图只表达来源、校验和注入关系，不表达部署命令、网络拓扑或 provider 产品。
- secret ref 不是 raw secret；解析后的秘密材料只在 infra/adapter 私有范围内。
- test fixture 不进入 production assembly；任何 required slot 缺失都保持 blocked/fail-closed。
- source-authority、状态、UoW/CAS/fence、closure、治理许可和恢复写权不受来源覆盖。

## 4. 配置控制面总表

| 控制面 | 作用 | 对应模块/入口 | P0 | 禁止控制 |
|---|---|---|---|---|
| runtime profile/config identity | 选择 profile，形成 validated config identity | `infra/config.rs`, `runtime_builder.rs` | 是 | 业务状态、truth owner、产品 readiness |
| exact adapter assembly | 绑定 11 类 `ArchiveAdapterSlot` 并冻结 required/optional set | `infra/runtime_builder.rs` | 是 | 用 marker 冒充 handle、缩短 required set |
| local store/consistency | local store、UoW/CAS/read-set/probe/fence capability ref | `infra/store_adapter.rs` | 是 | 分步提交、last-write-wins、跨仓事务 |
| source/authority/visibility | source export、current authority、visibility binding | `source_export_adapter.rs`, authority/visibility adapters | 是 | workspace 补 canonical、旧权限复用 |
| integrity/compatibility | target-specific capability binding | integrity/compatibility adapters | 是 | 选择算法/key、把 Unknown 配为 Verified |
| storage/lifecycle | archive storage placement/retrieval/action binding | archive storage/governance adapters | 是 | 生成 retention/hold/delete/risk 决定 |
| restore receiver | per-owner receiver mapping | restore receiver adapters | 是 | Bundle 跨域写权、统一 owner transaction |
| inbound consumer | 5 类 event family/schema/trust mapping | consumer adapters/worker | 条件 | ACK 当业务 commit、未知 schema 订阅 |
| operation/cursor | operation key/digest 与 public/private cursor seam | application wrappers/query boundary | 是 | debug/JSON 临时 codec、私有 cursor 出站 |
| budgets/lifecycle | page/batch/timeout/lease/retry/probe/retention schedule ref | application/worker wrappers | 是 | 零值隐式重试、schedule 授权销毁 |
| observability/redaction | safe telemetry、redaction、audit material handoff | infra hooks + `L4-observability` seam | 是 | raw body/secret、观测后端真相 |

## 5. 配置域与功能模块总表

| 配置域 | 允许配置能力 | 关联详细设计 | 不允许控制 |
|---|---|---|---|
| `profile` | 选择已验证 runtime profile | `ArchiveRuntimeProfileRef` | 改状态/权限 |
| `assembly` | exposed surface、required/optional exact slots | `ArchiveRuntimeAssembly` | required slot 失败后削减 |
| `stores` | local store/UoW/transaction binding ref | `ArchiveStoreBindingRef` | schema/ordering/atomicity |
| `sources` | per-`SourceClass` export binding | `SourceExport(SourceClass)` | Canonical/Conditional/Auxiliary 分类 |
| `authority_visibility` | authority/visibility capability binding | exact slots | allow/deny 结果、Query no-write |
| `integrity_compatibility` | capability refs and target mapping | exact slots | algorithm/key/schema authority |
| `storage_lifecycle` | storage target and schedule reference | `ArchiveStorage`, `GovernanceDecision` | policy、hold、delete许可 |
| `restore_receivers` | per-owner receiver binding | `RestoreReceiver(owner)` | owner DB write / project restored |
| `inbound` | five family mapping and availability | `InboundConsumer(family)` | event arrival=commit |
| `operation_cursor` | codec/mapping refs | operation/cursor wrappers | digest fabrication/private cursor |
| `budgets` | validated typed bounds | API/application/worker wrappers | 截断后 Complete、blind retry |
| `observability` | safe sink/redaction binding | Step 15 safe telemetry | audit backend truth/evidence |

## 6. 配置域停审与跨控制面审计

| 配置域 | 来源清楚 | 允许/禁止清楚 | 03 影响 | 结论 |
|---|---|---|---|---|
| profile/assembly | 是 | 是 | 无新增 | 通过 |
| stores/sources/authority | 是 | 是 | 无新增 | 通过；外部合同保持 blocked |
| integrity/storage/restore | 是 | 是 | 无新增 | 通过；不选 provider/algorithm |
| inbound/codec/budgets | 是 | 是 | 无新增 | 通过；未闭合项留 pending |
| observability | 是 | 是 | 无新增 | 通过；不建 backend |

| 跨控制面审计项 | 结论 | 缺口/修正 |
|---|---|---|
| 是否覆盖 Step 2 P0 范围 | 通过 | runtime、store、source、external、restore、inbound、budget、safety 全覆盖 |
| 是否存在控制面重叠 | 未发现 | `stores` 只负责 local persistence；`storage_lifecycle` 只负责 external effect |
| 是否把 workspace projection 当 canonical | 否 | `sources` 明确 `WorkspaceProjection=Auxiliary` |
| 是否为 outbound 建控制面 | 否 | `AR-HLD-Q-001` 未闭合，publisher/topic/outbox 不创建 |
| 是否有隐式配置读取 | 否 | 只允许 infra reader/builder |
| 是否引入 sibling compile dependency | 否 | 仅 `core-contracts` candidate；其他为 runtime/event/ref/adapter/fake |

## 7. 对 03 的影响判定

| 配置结论 | 是否影响 03 | 影响类型 | 03 回写位置 | 处理状态 |
|---|---|---|---|---|
| 配置入口固定为 `infra/config.rs` → `runtime_builder.rs` | 否 | 既有边界承接 | 不适用 | 无回写 |
| 控制面按功能域重组既有 03 binding/slot | 否 | 配置视图整理 | 不适用 | 无回写 |
| outbound 控制面继续 blocked | 否 | 既有 blocker 维护 | 不适用 | 无回写 |
| 若新增 config field/builder/adapter/port/error/DTO/flow | 是（未来触发） | 代码契约变更 | 03 §4～§15 与对应 Step | 无回写（未来触发前暂停并回写） |

## 8. 回填草稿、待确认与门禁

正式 §3 应回填本步来源链图、控制面总表、配置域表和禁止控制说明；不写具体 key、默认值、endpoint、secret 名、产品或部署命令。

| 待确认 | 未确认前处理 |
|---|---|
| source/receiver/storage/integrity/provider 合同 | exact slot `Blocked/Unknown/Unsupported` |
| operation/cursor codec 与预算数值 | binding ref；缺失则 mutation/continuation/runner blocked |
| outbound event family | 不创建 publisher/topic/outbox 配置 |

进入 Step 4 条件：来源链可追踪、配置入口唯一、每个配置域已停审、跨控制面无 unresolved 冲突；本 Step 已满足。
