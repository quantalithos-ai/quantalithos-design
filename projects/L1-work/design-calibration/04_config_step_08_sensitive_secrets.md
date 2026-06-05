# Step 8. 定义敏感配置与密钥管理

> 本文件是 `projects/L1-work/04-配置设计.md` 的 Step 8 中间产物。
> 本步定义敏感配置、密钥引用、禁止输出和审计边界。
> 本步不新增 `WorkRuntimeConfig` 字段,不定义 secret provider 产品,不把 raw secret 写入普通配置。

## 1. Step 状态

- 状态: `[x] 已完成`
- 对应 SOP: `standards/document/配置设计讨论流程_SOP.md` Step 8
- 回填章节: `projects/L1-work/04-配置设计.md` §8 敏感配置与密钥管理

## 2. 本步输入

| 输入 | 内容 | 本步使用方式 |
|---|---|---|
| `04_config_step_07_config_items.md` | P0 28 个配置项和 `ref-only sensitive` 标注 | 识别 sensitive / secret 边界 |
| `04_config_step_05_sources_priority_conflicts.md` | secret material 不进入普通覆盖链 | 固定 JSON / env / args 只能保存 ref |
| `04_config_step_06_profiles_matrix.md` | local-dev / ci-test / integration-like / operations-replay profile | 固定不同 profile 的敏感配置处理 |
| `04_config_step_04_classification_boundaries.md` | raw secret、forbidden body、fake success 伪装 production success 禁止配置化 | 固定禁止项和违规处理 |
| `03-详细设计.md` §13 / §14 | runtime builder、adapter 注入、观测字段边界 | 确认本步不改变代码契约 |

已确认结论:

```text
Step 7 中的 ref-only sensitive 属于配置设计书写规范中的 sensitive 子类。
ref-only sensitive 允许 JSON / env / entry local args 保存稳定引用,例如 CredentialRef、SecretRef、EndpointRef、TargetRef。
secret 表示真实秘密材料,例如 password、private key、raw token、raw credential value,不得进入 L1-work 普通配置。
```

## 3. SOP 问题回答

### 3.1 哪些配置是 sensitive 或 secret?

本仓 P0 没有允许写入普通配置的 `secret` 配置项。以下配置项属于 `sensitive` 中的 `ref-only sensitive`:

| 配置项 | 原因 |
|---|---|
| `external.identity` | configured adapter 可能需要 identity endpoint ref / credential ref |
| `external.method_library` | configured adapter 可能需要 method-library endpoint ref / credential ref |
| `external.source_work` | configured adapter 可能需要 conversation / runtime / artifact / governance source ref |
| `external.evidence` | configured adapter 可能需要 evidence source ref / credential ref |
| `external.process_timebox` | configured adapter 可能需要 process endpoint ref / credential ref |
| `outbox.publisher` | configured publisher 可能需要 bus endpoint ref / credential ref |
| `handoff.trace_target` | configured handoff 可能需要 observability target ref / credential ref |
| `handoff.archive_target` | configured handoff 可能需要 archive target ref / credential ref |

以下内容是 `secret`,但不是 L1-work 配置项:

- raw password
- raw token
- private key
- client secret
- raw DSN containing credential material
- raw certificate private material
- raw external source body
- runtime reasoning body
- artifact body

### 3.2 敏感配置如何存储,是否允许明文?

`ref-only sensitive` 可以以明文形式保存“引用值”,不能保存真实秘密材料。

允许:

```json
{
  "external": {
    "identity": {
      "adapter_kind": "configured",
      "endpoint_ref": "EndpointRef(identity-local)",
      "credential_ref": "CredentialRef(identity-fixture)"
    }
  }
}
```

禁止:

```json
{
  "external": {
    "identity": {
      "token": "<raw-token>",
      "password": "<raw-password>"
    }
  }
}
```

说明:

- 上述禁止示例中的占位符只表达字段形态被禁止,不是可使用的配置值。
- JSON config file、environment variables 和 entry local args 都不得承载 raw secret。
- env 只能覆盖 ref,不能因为优先级更高而覆盖成 raw secret。

### 3.3 敏感配置如何轮换?

P0 不定义在线 secret rotation。轮换分为两层:

| 层级 | 轮换方式 | L1-work 责任 |
|---|---|---|
| secret material | 由外部 secret provider / 运维系统轮换 | 不读取、不记录、不审计 material |
| secret / credential ref | 更新 `CredentialRef` / `SecretRef` / endpoint ref / target ref | loader 校验 ref 形态,冷更新或下次 job-run-start 生效 |

如果 ref 变更后无法解析:

- runtime / adapter 启动阶段发现: fail-fast。
- job run 开始发现: 当前 job fail-fast。
- resolver 调用阶段 provider 不可用: fail-closed,或按已定义 flow 产生 explicit unresolved / failed marker。
- 不允许自动回退到旧 raw secret。
- 不允许自动切换 fake adapter 并标记 configured / production success。

### 3.4 读取和变更是否需要审计?

需要审计 ref 级行为,不得审计 material。

| 行为 | 审计要求 |
|---|---|
| 配置文件加载 | 记录 config source、profile、配置版本 / digest、ref key presence,不记录 ref target material |
| env override 生效 | 记录 key 名、来源和是否覆盖,不记录 raw value |
| configured adapter 启动 | 记录 adapter kind、endpoint ref id、credential ref id 的 redacted form |
| ref 解析失败 | 记录 ref id、adapter、错误类型和 fail-fast / fail-closed 结果 |
| fake adapter 使用 | 必须有 fake marker,不得伪装 configured success |
| job run 使用敏感 ref | job report 只记录 redacted ref 和 outcome |

### 3.5 日志、错误返回、审计中如何避免泄露?

禁止输出以下内容:

- raw secret、raw token、password、private key。
- credential material、raw DSN credential segment。
- external source body、runtime reasoning body、artifact body。
- raw payload、forbidden body、large opaque payload。
- 未脱敏的 endpoint credential query string。

允许输出:

- ref 类型和稳定 ref id 的 redacted form。
- adapter kind。
- fail-fast / fail-closed / unresolved / degraded / failed marker。
- config source kind。
- test fixture marker。

推荐 redacted form:

```text
CredentialRef(identity-fixture) -> CredentialRef(id=identity-fixture, value=<redacted>)
EndpointRef(identity-local) -> EndpointRef(id=identity-local)
```

## 4. 当前文档问题诊断

| 位置 | 当前问题 | 本步处理 |
|---|---|---|
| Step 7 `ref-only sensitive` | 标注了敏感级别,但未映射到正式 `sensitive` / `secret` 规则 | 本步定义 `ref-only sensitive` 是 `sensitive` 子类 |
| Step 5 source priority | 已禁止 secret material 进入普通覆盖链,但未列出敏感配置表 | 本步补敏感配置表和禁止输出规则 |
| Step 6 profile matrix | 已说明 fake ref / configured ref,但未说明轮换和审计 | 本步按 profile 细化 |
| `03-详细设计.md` §13 / §14 | 已有 adapter 和观测边界,但不写 secret 管理 | 本步只补配置层边界,不改代码契约 |

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 敏感级别 | Step 7 使用 `ref-only sensitive` | 明确其属于 `sensitive` 子类,不是 `secret` | 对齐配置设计书写规范 |
| 可配置内容 | 只说 configured 时条件必填 ref | 明确 JSON / env / args 只能保存 ref,不能保存 material | 防止 raw secret 进入普通来源 |
| 轮换 | 未定义 | material 由外部系统轮换,ref 变更冷更新 / job-run-start 生效 | 不引入热更新或 secret provider 字段 |
| 审计 | 未定义 | 审计 ref 级行为,不审计 material | 支撑测试验收和 redaction |
| 输出边界 | 分散在 redaction / forbidden body 规则 | 汇总为禁止输出和允许输出清单 | 防止日志、报告、artifact 泄露 |

## 6. 配置设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A: P0 只允许配置 secret / credential / endpoint ref | 与数据归属和 redaction 边界一致,可测试 | 生产 secret provider 细节后移 | 采用 |
| 方案 B: 允许 env 承载 raw token | 本地调试方便 | env、日志、CI report 容易泄露,破坏 Step 5 普通覆盖链 | 不采用 |
| 方案 C: 在 04 中新增 secret provider section | 表达更完整 | 会新增 `WorkRuntimeConfig` 字段,必须先回写 03 | 不采用 |
| 方案 D: P0 支持在线 secret rotation | 运维灵活 | 需要 reload、审计、回滚和 adapter 一致性专项 | 不采用 |

推荐方案 A。

原因:

- L1-work P0 目标是默认可验证路径,不是建设 production secret management。
- secret material 归属外部 secret provider / 运维系统,L1-work 只消费 ref。
- 保持 ref-only 能让 tests、reports 和 release gates 检查 raw secret 泄露。

## 7. 结构化中间产物

### 7.1 敏感配置表

| 配置项 | 敏感级别 | 存储方式 | 是否可明文 | 轮换方式 | 审计要求 |
|---|---|---|---|---|---|
| `external.identity` | sensitive / ref-only | JSON / env 只保存 endpoint ref、credential ref | ref 可明文,material 不可明文 | ref 冷更新;material 外部轮换 | adapter kind、redacted ref、解析结果 |
| `external.method_library` | sensitive / ref-only | JSON / env 只保存 endpoint ref、credential ref | ref 可明文,material 不可明文 | ref 冷更新;material 外部轮换 | adapter kind、redacted ref、解析结果 |
| `external.source_work` | sensitive / ref-only | JSON / env 只保存 source / endpoint / credential ref | ref 可明文,material 不可明文 | ref 冷更新;material 外部轮换 | source kind、redacted ref、unresolved marker |
| `external.evidence` | sensitive / ref-only | JSON / env 只保存 evidence source ref、credential ref | ref 可明文,material 不可明文 | ref 冷更新;material 外部轮换 | evidence ref、redacted credential ref、failure marker |
| `external.process_timebox` | sensitive / ref-only | JSON / env 只保存 endpoint ref、credential ref | ref 可明文,material 不可明文 | ref 冷更新;material 外部轮换 | adapter kind、redacted ref、unresolved marker |
| `outbox.publisher` | sensitive / ref-only | JSON / env 只保存 bus endpoint ref、credential ref | ref 可明文,material 不可明文 | ref 冷更新;material 外部轮换 | publisher kind、redacted ref、publish failure marker |
| `handoff.trace_target` | sensitive / ref-only | JSON / env 只保存 target ref、credential ref | ref 可明文,material 不可明文 | ref 冷更新;material 外部轮换 | handoff target、redacted ref、handoff outcome |
| `handoff.archive_target` | sensitive / ref-only | JSON / env 只保存 target ref、credential ref | ref 可明文,material 不可明文 | ref 冷更新;material 外部轮换 | archive target、redacted ref、handoff outcome |

### 7.2 profile 敏感配置矩阵

| profile | 允许的敏感配置形态 | 禁止项 | 失败策略 |
|---|---|---|---|
| local-dev | fake ref、local fixture ref | raw secret、真实 production credential | ref 格式非法 fail-fast;fake marker 必须可见 |
| ci-test | deterministic fixture ref、不可解析假引用 | raw secret、CI secret material 输出 | 配置非法 fail-fast;报告 redaction gate 失败则阻断 |
| integration-like | configured endpoint ref、credential ref | raw credential material、source body | ref 缺失 fail-fast;resolver 不可用 explicit unresolved / failed marker |
| operations-replay | historical ref、脱敏 ref、fake ref | 历史 raw secret、历史 source body | job fail-fast 或 failed report,不得修 truth |
| staging-like | 运维注入 ref,material 在外部 provider | raw material 写入 04 / 普通 JSON | P1 专项定义 |
| production-like | 运维注入 ref,material 在外部 provider | raw material 写入 04 / env / logs / reports | P1/P2 专项定义 |

### 7.3 禁止输出规则

| 输出位置 | 禁止内容 | 允许内容 | 违规处理 |
|---|---|---|---|
| logs | raw secret、raw token、raw payload、source body | redacted ref、adapter kind、error category | release redline fail |
| error response | credential material、provider response body、source body | error code、ref type、redacted ref id | fail-closed / sanitized error |
| audit / trace | raw credential、raw DSN、forbidden body | actor、operation、redacted ref、outcome | audit validation fail |
| reports / artifacts | raw secret、raw payload、runtime reasoning body、artifact body | fixture marker、redaction scan result、redacted refs | report gate fail |
| metrics | full ref value、credential value、高基数 secret-derived label | adapter kind、status、error category | metrics validation fail |
| config dump / diagnostics | full env value、raw JSON sensitive value | key presence、source kind、redacted ref | diagnostic reject |

### 7.4 敏感配置加载边界

```text
[JSON / env / entry args]
  -> [ref-only parse]
  -> [ref shape validate]
  -> [WorkRuntimeConfig]
  -> [runtime builder]
  -> [adapter resolves ref through external provider]
  -> [adapter receives material without logging it]
```

关键说明:

- `WorkRuntimeConfig` 只保存 ref,不保存 material。
- `runtime_builder` 只能把 ref 交给 adapter 或 provider binding,不得打印 material。
- fake adapter 必须带 fake marker。
- provider 不可用时不得自动切换 fake success。

### 7.5 敏感配置 JSON demo

严格 JSON demo,只展示 ref 形态:

```json
{
  "external": {
    "identity": {
      "adapter_kind": "configured",
      "endpoint_ref": "EndpointRef(identity-local)",
      "credential_ref": "CredentialRef(identity-fixture)"
    }
  },
  "outbox": {
    "publisher": {
      "adapter_kind": "configured",
      "endpoint_ref": "EndpointRef(bus-local)",
      "credential_ref": "CredentialRef(bus-fixture)"
    }
  },
  "handoff": {
    "trace_target": {
      "adapter_kind": "configured",
      "target_ref": "HandoffTargetRef(trace-local)",
      "credential_ref": "CredentialRef(trace-fixture)"
    }
  }
}
```

说明:

- 本 demo 中 `endpoint_ref`、`credential_ref`、`target_ref` 是 adapter 子字段示例,不是新增 `WorkRuntimeConfig` top-level section。
- adapter 子字段全集仍由后续 durable / configured adapter 专项和实施计划承接。
- 如果需要把这些子字段提升为正式 Rust struct 字段,必须回写 `03-详细设计.md`。

## 8. 对详细设计的影响判定

| 配置结论 | 是否影响 03 | 影响类型 | 03 回写位置 | 处理状态 |
|---|---|---|---|---|
| `ref-only sensitive` 明确为 `sensitive` 子类,raw material 属于禁止进入普通配置的 `secret` | 否 | 配置安全语义,不改变 Rust schema | 无 | 无回写 |
| JSON / env / entry local args 只能保存 endpoint / credential / target ref | 否 | 来源边界规则 | 无 | 无回写 |
| P0 不新增 secret provider / redaction profile / reports root 配置字段 | 否 | 保持 `WorkRuntimeConfig` 不变 | 无 | 无回写 |
| configured adapter 子字段示例只作为 ref 形态说明,不定义字段全集 | 否 | 文档示例,非代码契约 | 无 | 无回写 |

说明:

```text
本步没有新增 `WorkRuntimeConfig` 字段、adapter constructor 参数、ConfigError 枚举、runtime profile enum 或函数流。
如果 Step 9 需要把 secret provider、redaction profile 或 reports root 固化为配置字段,必须先回写 `03-详细设计.md`。
```

## 9. 回填草稿

正式 `04-配置设计.md` §8 建议采用以下结构:

```text
8. 敏感配置与密钥管理
  8.1 敏感级别定义
  8.2 敏感配置表
  8.3 profile 敏感配置矩阵
  8.4 禁止输出规则
  8.5 敏感配置加载边界
  8.6 敏感配置 JSON demo
  8.7 对 03-详细设计的影响判定
```

必须引用:

| 正式章节 | 引用来源 |
|---|---|
| §8.1 | `design-calibration/04_config_step_08_sensitive_secrets.md` §2 / §3.1 |
| §8.2 | `design-calibration/04_config_step_08_sensitive_secrets.md` §7.1 |
| §8.3 | `design-calibration/04_config_step_08_sensitive_secrets.md` §7.2 |
| §8.4 | `design-calibration/04_config_step_08_sensitive_secrets.md` §7.3 |
| §8.5 | `design-calibration/04_config_step_08_sensitive_secrets.md` §7.4 |
| §8.6 | `design-calibration/04_config_step_08_sensitive_secrets.md` §7.5 |
| §8.7 | `design-calibration/04_config_step_08_sensitive_secrets.md` §8 |

## 10. 待确认事项

无阻塞进入 Step 9 的待确认事项。

后续 Step 必须继续收口:

- Step 9 定义 ref shape validation、env override key、cross-field validation 和 fail-fast / fail-closed 入口。
- Step 11 把 provider 不可用、ref 不可解析、fake marker 缺失和 redaction gate failure 映射为失效模式。
- Step 12 把 raw secret 不得进入 logs / reports / artifacts 写入测试和验收承接。

## 11. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| sensitive / secret 边界已明确 | 通过 | §3.1 / §7.1 |
| 敏感配置存储和明文规则已明确 | 通过 | §3.2 / §7.1 |
| 轮换和审计口径已明确 | 通过 | §3.3 / §3.4 |
| 禁止输出规则已明确 | 通过 | §3.5 / §7.3 |
| 对 03 影响已有判定 | 通过 | §8 当前无回写 |
| 可以进入 Step 9 | 通过 | 下一步定义配置加载、校验与生效机制 |
