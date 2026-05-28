# Step 6. 定义环境、部署 profile 与配置矩阵

> 本文件是 `projects/L0-core/04-配置设计.md` 的 Step 6 中间产物。
> 本步定义 L0-core 在 local、CI/test、release-like、operations replay、staging 和 prod 语境下的配置来源、依赖和差异。
> 本步不定义完整配置项清单,不新增 `CoreRuntimeConfig.runtime_profile` 字段,不写部署命令,不改变 `03-详细设计.md` 中的代码契约。

---

## 1. Step 状态

- 状态：[x] 已确认
- 对应 SOP：`standards/document/配置设计讨论流程_SOP.md` Step 6
- 回填章节：`projects/L0-core/04-配置设计.md` §6 环境、部署 profile 与配置矩阵

---

## 2. 本步输入

| 输入 | 内容 | 本步使用方式 |
|---|---|---|
| Step 5 来源优先级 | `defaults < file < env < CLI flags`,secret refs 不参与普通覆盖链 | 固定各 profile 的配置来源和 override 方式 |
| Step 4 配置分类 | P0 不支持热更新,全部启动读取 / 作业启动读取 | 固定各 profile 的生效方式 |
| `01-架构设计.md` §6 | L0-core 没有常驻在线 runtime container | 防止把 staging / prod 写成在线服务环境 |
| `03-详细设计.md` §13 | `CoreRuntimeConfig` 和 runtime builder 是配置装配入口 | 将 profile 差异映射到 runtime config 值,不新增字段 |
| `05/06` 当前草案 | 有环境矩阵方向,但仍是旧口径 | 只作为后续校准提醒,不作为配置事实源 |

已确认结论:

```text
L0-core 的 profile 是配置矩阵分类,不是新的 runtime profile 字段。
P0 profile 包括 local-dev、ci-test、release-like、operations-replay。
staging/prod 不是 L0-core 的在线服务环境;它们只在后续集成、发布或运维手册中承接具体配置。
```

---

## 3. SOP 问题回答

1. local / CI / test / staging / prod 分别是否适用?

   回答：local 适用,用于开发者本地 CLI / job 验证。CI / test 适用,用于隔离目录、确定性 fake adapter 和自动化测试。staging 不作为在线服务环境,但可以映射为 release-like / integration profile,用于接近发布的只读快照、outbox 和真实工具链演练。prod 不作为 L0-core 常驻服务环境,只表示生产运维语境下执行 CLI / job、派生快照、重建索引或 outbox relay 的配置承接;具体路径、secret 和部署命令留给部署与运维手册。

2. 每个环境配置来源是什么?

   回答：local-dev 主要使用 code defaults + project config file + CLI flags。ci-test 使用 code defaults + test config file + environment variables,必要时由 CI job 传入 CLI flags。release-like 使用 project config file + environment variables + CLI flags,并禁用未确认的在线 config center。operations-replay 使用 replay 专用 config file + env / flags 指向历史 snapshot、outbox、audit 和 idempotency root。staging / prod 具体来源后移,但仍必须遵守 P0 普通来源顺序和 secret ref 边界。

3. 每个环境依赖哪些外部服务?

   回答：P0 local-dev 和 ci-test 不依赖真实外部服务,使用文件系统 root、fake / deterministic gate、reference、blob、event publisher 和 toolchain runner。release-like 可以使用 real-like 文件系统、真实或接近真实的 validation / fingerprint / snapshot exporter,但真实 L0-bus publisher、真实 KMS/Vault、在线配置中心仍不是 P0 前置。operations-replay 依赖历史文件型状态和快照输入,不要求真实 bus 投递。

4. 敏感配置在不同环境如何处理?

   回答：local-dev 和 ci-test 不允许 raw secret,也不需要真实 secret;如需模拟,使用 fake secret ref 或 disabled real adapter。release-like 可以出现 secret ref / credential ref,但 raw secret 仍不得进入普通配置来源。operations-replay 只能读取脱敏后的历史引用或 secret ref,不得把历史 raw secret 写入配置或审计正文。staging/prod 的真实 secret material 处理留给部署与运维手册,04 只规定 secret ref 边界。

5. 哪些环境差异会影响测试和验收?

   回答：目录隔离、默认路径、fake / real-like adapter、reference resolver 行为、toolchain runner 模式、outbox relay 模式、projection rebuild 输入、audit / idempotency root 隔离、非法路径和缺失配置处理都会影响测试和验收。后续 `05-测试方案.md` 应按 local-dev、ci-test、release-like、operations-replay 四类 profile 重写环境矩阵。

---

## 4. 当前文档问题诊断

| 位置 | 当前问题 | 影响 |
|---|---|---|
| `04-配置设计.md` §6 | 尚未存在环境 / profile 配置矩阵 | Step 7 配置项清单无法区分默认值和 profile 差异 |
| Step 5 来源优先级 | 已有全局来源顺序 | 需要落到 local / CI / release-like / replay 的具体使用方式 |
| `01-架构设计.md` §6 | 已明确无常驻在线 runtime container | 需要避免把 staging/prod 写成在线服务部署配置 |
| 当前 `05/06` | 仍有旧 shared primitive / registry 口径 | 需要后续按新版 profile 校准测试和验收 |

---

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 环境口径 | 只有 local / CI / staging / prod 的泛称 | 明确 local-dev、ci-test、release-like、operations-replay 四个 P0 profile | 更符合 L0-core CLI / job / 文件型状态的实际形态 |
| staging / prod | 容易被误解成在线服务环境 | staging 映射为 release-like / integration;prod 映射为生产运维执行语境 | 承接架构中“无常驻在线 runtime container”的结论 |
| 敏感配置 | 只有 secret ref 边界 | 按 profile 说明 fake ref、secret ref、raw secret 禁止规则 | 方便 Step 8 继续展开 |
| 测试验收承接 | 当前 05/06 旧口径 | 指定后续按四类 profile 重写矩阵 | 避免旧测试矩阵反向污染 04 |
| 03 回写 | 未判断 | profile 只是配置矩阵分类,不新增 runtime 字段 | 无需回写 03 |

---

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A：按 dev / test / staging / prod 四环境写 | 通用、易懂 | 会误导为 L0-core 有在线服务部署环境 | 不采用 |
| 方案 B：按 local-dev / ci-test / release-like / operations-replay profile 写 | 贴合 CLI / job / 文件型状态和回放主线 | 需要额外解释 staging/prod 的映射关系 | 采用 |
| 方案 C：新增 `runtime_profile` 字段承载环境 | 代码中显式 | 现在只是设计分类,过早新增字段会回写 03 | 不采用 |
| 方案 D：完全不写 staging/prod | 避免误解 | SOP 要求回答 staging/prod 是否适用,下游读者会缺口 | 不采用 |

---

## 7. 结构化中间产物

### 7.1 环境 / profile 配置矩阵

| 环境 / profile | 用途 | 配置来源 | 外部依赖 | 敏感配置处理 | 差异说明 |
|---|---|---|---|---|---|
| local-dev | 本地开发、手动 CLI / job 验证、最小主链调试 | defaults + project config file + CLI flags | 本地文件系统、fake gate / reference / blob、fake publisher、fake / local runner | 不使用 raw secret;可用 fake secret ref 或禁用真实 adapter | 允许开发者用 CLI flags 覆盖 root path;不代表验收环境 |
| ci-test | 自动化测试、隔离目录、确定性 fixture | defaults + test config file + env + CI job flags | 临时文件系统、deterministic fake adapter、fake runner、no-op publisher | 不使用 raw secret;测试 secret ref 只能是不可解析的假引用或 fixture ref | 所有 root 必须隔离;失败必须可复现 |
| release-like | 接近发布的快照派生、兼容校验、outbox 状态演练 | project config file + env + CLI flags | real-like 文件系统、real-like validation / fingerprint / snapshot runner、stub 或 real-like publisher boundary | 允许 secret ref / credential ref;raw secret 不进入普通配置 | 用于发现路径、runner、snapshot 和 outbox 问题;真实 bus 不是 P0 |
| operations-replay | replay、rebuild、recalculate、outbox relay 恢复演练 | replay config file + env + CLI flags | 历史 snapshot / audit / outbox / idempotency root、fake 或 controlled publisher | 只读取脱敏引用;不得把历史 raw secret 写入配置 | 重点验证恢复能力和配置漂移处理 |
| staging-integration | 后续跨仓集成演练 | 待部署与运维手册定义,仍遵守 P0 来源顺序 | 可能接入真实 L0-bus / toolchain / secret provider | 只允许 secret ref,真实 material 由运维注入 | P1/P2,不是当前 P0 前置 |
| production-ops | 生产运维语境下执行 CLI / job、派生快照或恢复 | 待部署与运维手册定义,仍遵守 secret ref 边界 | 真实文件系统、真实 runner、真实 publisher / secret provider | raw secret 不进 04;由安全运维负责注入和轮换 | P1/P2,04 只定义设计边界 |

### 7.2 profile 到测试验收承接表

| profile | 应进入测试方案的场景 | 应进入验收标准的门禁 |
|---|---|---|
| local-dev | 默认路径、CLI flag 覆盖、fake adapter、非法路径 fail fast | 本地最小主链可运行,但不能单独作为验收通过依据 |
| ci-test | 隔离 root、重复 key、非法 env、缺失配置、fake runner deterministic output | CI 必须能稳定复现配置错误和成功路径 |
| release-like | snapshot root、toolchain runner、outbox pending / failed、reference fail closed | 发布前配置矩阵无高风险缺口 |
| operations-replay | replay config、projection rebuild、audit / idempotency root 对账 | 恢复演练不产生第二套 truth,不泄露 secret |

### 7.3 profile 与 P0 / P1 / P2 映射

| profile | 优先级 | 是否阻塞 P0 | 说明 |
|---|---|---|---|
| local-dev | P0 | 是 | 开发和最小实现验证必需 |
| ci-test | P0 | 是 | 自动化测试和门禁必需 |
| release-like | P0 / P1 边界 | P0 需要最小 real-like,真实外部集成为 P1 | 支撑发布前校验,但不要求真实 bus / secret provider |
| operations-replay | P0 | 是 | 支撑恢复能力和 outbox / projection / audit 验证 |
| staging-integration | P1 | 否 | 跨仓集成后续承接 |
| production-ops | P1 / P2 | 否 | 具体生产配置留给部署与运维手册 |

---

## 8. 对详细设计的影响判定

| 配置结论 | 是否影响 03 | 影响类型 | 03 回写位置 | 处理状态 |
|---|---|---|---|---|
| profile 只是配置矩阵分类,不新增 `CoreRuntimeConfig.runtime_profile` 字段 | 否 | 无代码契约变化 | 无 | 无回写 |
| local-dev / ci-test / release-like / operations-replay 使用既有 runtime config 值表达差异 | 否 | 配置取值差异 | 无 | 无回写 |
| staging / prod 不作为 P0 在线服务环境 | 否 | 架构边界解释 | 无 | 无回写 |
| 真实 bus / secret provider / toolchain 集成仍是 P1/P2 | 否 | 范围分级 | 无 | 无回写 |

说明:

- 本步没有新增 runtime builder 参数、profile enum、adapter constructor 参数或错误枚举。
- 如果后续 Step 7 认为必须将 profile 做成正式 struct 字段,需要标记 `待回写` 并回到 `03-详细设计.md`。

---

## 9. 回填草稿

以下内容用于后续 Step 15 组装正式 `04-配置设计.md` §6。

````md
## 6. 环境、部署 profile 与配置矩阵

> 校准来源：
> - `design-calibration/04_config_step_06_profiles_matrix.md`
>
> 延伸阅读：
> - 建议继续阅读上述中间产物的“环境 / profile 配置矩阵”“profile 到测试验收承接表”“对详细设计的影响判定”和“待确认事项”小节，了解本章 profile 口径如何收敛。

L0-core 没有常驻在线 runtime container,因此本章不把 staging / prod 写成在线服务环境。P0 配置矩阵按 local-dev、ci-test、release-like、operations-replay 四类 profile 展开。profile 是配置矩阵分类,不是新的 `CoreRuntimeConfig` 字段。

local-dev 用于本地 CLI / job 验证;ci-test 用于自动化测试和隔离 fixture;release-like 用于接近发布的快照、outbox 和工具链演练;operations-replay 用于 replay、rebuild、recalculate 和恢复演练。staging-integration 与 production-ops 作为 P1/P2 承接方向,具体部署路径、secret 注入和运维命令留给部署与运维手册。

所有 profile 均遵守普通配置来源顺序 `defaults < file < env < CLI flags` 和 secret ref 边界。raw secret 不得进入普通配置来源。
````

---

## 10. 待确认事项

- 是否接受 local-dev、ci-test、release-like、operations-replay 作为 P0 配置矩阵主 profile。
- 是否接受 staging/prod 不作为 L0-core P0 在线服务环境,只作为后续集成和生产运维承接语境。
- 是否接受 profile 只是配置矩阵分类,不新增 `CoreRuntimeConfig.runtime_profile` 字段。
- 是否接受当前 `05/06` 后续需要按本 profile 矩阵重新校准。

---

## 11. 进入下一步条件

- [x] 用户确认 P0 profile 划分。
- [x] 用户确认 staging / prod 的适用口径。
- [x] 用户确认敏感配置在不同 profile 下的处理边界。
- [x] 用户确认本步无需回写 `03-详细设计.md`。
- [x] Step 6 状态从 `[~]` 更新为 `[x]`。
