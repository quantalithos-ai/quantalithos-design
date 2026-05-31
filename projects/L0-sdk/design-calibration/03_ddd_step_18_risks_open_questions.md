# Step 18. 风险与待确认事项

> 本文件是 `projects/L0-sdk/03-详细设计.md` 的 Step 18 中间产物。
> 本步只记录详细设计阶段仍未关闭、会影响实现或实施交付的风险与待确认事项。
> 本步不新增实现契约，不扩大 P0 范围，不替代 `04-配置设计.md`、`05-测试方案.md`、`06-验收标准.md` 或 `07-实施计划.md`。
> 正式 `03-详细设计.md` 仍在 Step 19 统一回填，本文件不替代正式详细设计。

## 1. Step 状态

- 状态：[x] 已确认
- 对应 SOP：`standards/document/详细设计讨论流程_SOP.md` Step 18
- 回填章节：`projects/L0-sdk/03-详细设计.md` §17 风险与待确认事项

---

## 2. 本步输入

| 输入 | 内容 | 本步使用方式 |
|---|---|---|
| Step 1~17 中间产物 | 已形成完整详细设计中间产物链 | 汇总仍需跟踪的风险和待确认事项 |
| Step 2 范围 | public registry、全量服务覆盖、gateway、auth、bus runtime 等不进 P0 | 防止风险项反向扩大范围 |
| Step 3 / 4 | 目标仓 `/home/aris/Projects/quantalithos-sdk` 当前未发现，core / bus contracts 为本地 path dependency | 固定实施前置风险 |
| Step 10 | 7 个正式状态集合已经收敛，`Built` 等旧名禁用 | 固定状态命名风险 |
| Step 14 | 只定义配置绑定点，完整配置 schema 后移到配置设计 | 固定配置文档风险 |
| Step 16 | 只定义最小测试切口 | 固定测试方案承接风险 |
| Step 17 | 只做实施承接，不定义 phase / commit boundary | 固定实施计划风险 |

已确认结论：

```text
风险不是新的功能需求。
待确认事项不能写成正式实现契约。
会阻塞实现的事项必须明确阻塞范围。
不阻塞 P0 的事项必须写清未确认前的保守处理方式。
```

---

## 3. SOP 问题回答

### 3.1 哪些问题仍可能影响代码实现？

| 类型 | 问题 | 影响 |
|---|---|---|
| 正式文档收口 | Step 19 尚未重建正式 `03-详细设计.md` | 不能把旧版 `03` 交给实现 agent 作为真相源 |
| 实现环境 | `/home/aris/Projects/quantalithos-sdk` 当前未发现 | 实施前需要创建或确认目标仓 |
| 编译期依赖 | `core-contracts` / `bus-contracts` 使用 sibling path dependency | 上游 contracts 版本或路径漂移会阻塞编译 |
| 配置设计 | `projects/L0-sdk/04-配置设计.md` 尚未存在 | 完整 JSON、环境变量、profile 和默认配置无法在 `03` 中脑补 |
| 测试 / 验收承接 | `05-测试方案.md` / `06-验收标准.md` 需要按新版 `03` 复核 | 测试门禁和验收证据可能与新版详细设计漂移 |
| formal / fake 验证目标 | P0 最小验证目标未锁死为某个真实服务 endpoint | candidate 验证应保守使用 fake / fixture 或 pending / unsupported |
| 三语言包工具链 | Python / TypeScript 生成、打包和 smoke 工具链细节未完全固定 | 不阻塞类型契约，但影响真实 package build / smoke |
| public registry | 公共发布不进 P0 | `Stable` 不等于公共 registry 发布，不能写入 P0 状态机 |
| 安全边界 | fake success、raw body、raw secret、unredacted evidence 是一票否决 | 若实现或测试未强制，会阻塞 P0 验收 |
| 实施计划 | `07-实施计划.md` 尚未创建 | phase、commit boundary、门禁和执行顺序不能由 Step 18 代替 |

### 3.2 哪些问题会阻塞实现，哪些只影响后续优化？

| 事项 | 阻塞范围 | 判断 |
|---|---|---|
| Step 19 未完成 | 阻塞正式交付实现 agent | 旧 `03` 不再可作为唯一实现依据 |
| 目标仓不存在 / git config 未确认 | 阻塞代码仓开工和提交 | 需要在 `07` 前置检查中处理 |
| `core-contracts` / `bus-contracts` path 不可用 | 阻塞真实编译 | 不允许复制类型绕过 |
| redaction / fake marker / forbidden body 测试失败 | 阻塞 P0 验收 | 属于安全和 truth 边界 |
| `04-配置设计.md` 缺失 | 不阻塞 Step 19；条件阻塞完整 config loader / profile 实施 | `03` 只保留代码绑定点 |
| formal API 真实 endpoint 未定 | 不阻塞 P0 | 用 fake / fixture / pending / unsupported 口径 |
| 三语言工具链细节未定 | 不阻塞 contracts / domain / application；会影响 package build job | 可在实施计划中设置 Spike 或保守 fake runner |
| public registry 未定 | 不阻塞 P0 | 本地 package candidate 和 evidence 足以支撑 P0 |

### 3.3 每个待确认事项需要谁确认？

| 事项 | 待确认方 |
|---|---|
| Step 19 后是否可交付实现 agent | 详细设计维护者 / 架构负责人 |
| 是否在 `07` 前补 `04-配置设计.md` | 文档维护者 / 实施计划编写者 |
| P0 最小验证目标使用哪个 fake / fixture 或 formal API | 测试方案维护者 / 架构负责人 |
| `core-contracts` / `bus-contracts` 具体 commit / version 如何固定 | L0-core / L0-bus 负责人 / 实施负责人 |
| Python / TypeScript package build 工具链 | 实施负责人 / SDK 包维护者 |
| `05` / `06` 是否需要按新版 `03` 重校准 | 测试和验收文档维护者 |
| `07-实施计划.md` 的 phase / commit boundary | 实施计划编写者 |

### 3.4 未确认前实现者应该如何处理？

| 未确认项 | 实现者处理方式 |
|---|---|
| 正式 `03` 尚未重建 | 不按旧 `03` 开工；等待 Step 19，或明确以 Step 1~18 中间产物为临时依据 |
| 目标仓不存在 | 在 `07` 中明确创建 / 初始化步骤，不在 design 仓写业务代码 |
| 配置 schema 未定 | 只按 Step 14 实现 `SdkRuntimeConfig`、loader、validator、runtime builder 最小接口 |
| formal API 未定 | 保持 capability `Pending / Unsupported / FakeOnly`，不得宣称 production supported |
| fake / fixture success | 必须保留 fake marker，不支撑 candidate `Stable` |
| package 工具链未定 | 先实现 port / job / evidence 契约，可用 fake runner 或 local runner 占位 |
| 测试方案未复核 | 先覆盖 Step 16 最小测试切口，不降低 redaction 和状态门禁 |

---

## 4. 当前文档问题诊断

| 问题 | 影响 | 本步处理 |
|---|---|---|
| 前序 Step 有大量“推荐方案已采用”的待确认项 | 如果全部搬入风险表，会把已关闭决策重新打开 | 本步只保留仍影响实现或交付的事项 |
| 正式 `03` 尚未重建 | 外部 agent 可能误读旧 `03` | 本步标注 Step 19 是正式交付前必要收口 |
| SDK 依赖上游和外部能力较多 | 实现者可能把运行期依赖写成 Cargo path dependency | 本步继续强调只允许 contracts 编译期依赖 |
| 配置、测试、验收、实施计划仍未完成新版承接 | 可能在实施阶段脑补 | 本步列为后续文档风险 |
| public registry / full service coverage 是 P1 | 可能被误写进 P0 | 本步明确不阻塞 P0，不能进入当前实现契约 |

---

## 5. 改动前后对比

| 维度 | 改动前 | 改动后 |
|---|---|---|
| 风险来源 | 分散在 Step 1~17 | 汇总为风险表和待确认事项表 |
| 阻塞范围 | 不清楚哪些阻塞正式交付、开工或验收 | 按正式交付、开工、P0 验收、P1 后续分级 |
| 未确认前处理 | 依赖实现者判断 | 每个事项给出保守处理方式 |
| 已关闭决策 | 可能被反复讨论 | 不再重开，只记录仍有影响的事项 |

---

## 6. 设计取舍

| 决策点 | 方案 A | 方案 B | 推荐 | 原因 |
|---|---|---|---|---|
| 是否重开所有前序待确认项 | 全部重开 | 只保留仍影响实现或交付的事项 | B | 避免重复讨论，保留真实风险 |
| 是否把 `04-配置设计.md` 缺失作为 Step 19 阻塞 | 阻塞 Step 19 | 不阻塞 Step 19，但阻塞完整配置实施 | B | 详细设计只写代码绑定点 |
| 是否把真实 formal API 作为 P0 必须目标 | 必须真实服务 | 允许 fake / fixture / pending / unsupported | B | 架构未锁定具体服务，fake 不能伪装 production |
| 是否把 public registry 纳入 P0 | 纳入 | 不纳入，只保留本地 candidate | B | P0 是可验证 package candidate，不是公共发布 |
| 是否允许实现仓沿用 design 仓中文提交 | 允许 | 不允许，实现仓英文 commit / 英文源码 | B | 已由实施计划规范固定 |

---

## 7. 结构化中间产物

### 7.1 已按当前方案关闭的前序决策

| 决策 | 当前关闭口径 | 来源 |
|---|---|---|
| SDK 是否是 HTTP / RPC server | P0 不是 server；同步入口是 Rust DTO + client method / CLI command | Step 2 / Step 8 |
| 是否实现 bus runtime truth | 不实现，只提供 event client view 和 bus boundary adapter | Step 2 / Step 9 / Step 14 |
| 是否依赖 L1~L4 服务仓源码 | 不依赖，运行期通过 formal API / fake / fixture / projection | Step 3 / Step 14 |
| 是否依赖 core / bus domain crate | 不依赖，只依赖 `core-contracts` / `bus-contracts` | Step 3 / Step 4 / Step 14 |
| fake success 是否可作为 production success | 不可；fake marker 必须保留 | Step 10 / Step 14 / Step 16 |
| `Built` 是否是 candidate 状态 | 不是；artifact attached 是条件，不是 enum variant | Step 10 |
| `Redacted` 是否等于 `Passed` | 不等；`EvidenceResult` 与 `EvidenceRedactionStatus` 分离 | Step 10 |
| `Stable` 是否等于 public registry publish | 不等；公共发布后移 | Step 2 / Step 10 |

### 7.2 风险表

| 风险 | 影响 | 缓解方式 | 负责人 / 待确认方 |
|---|---|---|---|
| 正式 `03-详细设计.md` 尚未 Step 19 重建 | 阻塞正式交付实现 agent | 先完成 Step 19，删除旧 `03` 后按新标准重建 | 详细设计维护者 |
| `/home/aris/Projects/quantalithos-sdk` 当前未发现 | 阻塞目标仓开工 | `07` 前置检查中创建或确认目标仓 | 实施负责人 |
| `core-contracts` / `bus-contracts` path 或版本漂移 | 阻塞编译或造成契约不一致 | 实施前确认 sibling repo 和 contracts crate，记录 commit / version | L0-core / L0-bus 负责人 |
| `04-配置设计.md` 尚未存在 | 完整 JSON、env、profile 可能被实施阶段脑补 | Step 19 后补配置设计；`07` 不得发明完整 schema | 配置文档维护者 |
| `05-测试方案.md` / `06-验收标准.md` 需按新版 `03` 复核 | 测试和验收可能覆盖旧口径 | 正式 `03` 完成后复核 `05/06` | 测试 / 验收维护者 |
| P0 formal API / fake 验证目标未最终指定 | candidate 验证目标可能不一致 | 未确认前使用 fake / fixture explicit profile 或标记 pending / unsupported | 测试方案维护者 |
| 三语言 package build / smoke 工具链未完全固定 | 影响 package build job 和 smoke job | 先实现 port、job、evidence 契约；真实工具链在 `07` 或 Spike 中确认 | SDK 包维护者 |
| redaction、credential、fake marker 未自动 gate | 安全边界可能只靠人工 review | Step 16 redaction check 必须进入最小测试门禁 | 实施 / 测试负责人 |
| `07-实施计划.md` 尚未创建 | phase、commit boundary 和门禁未定义 | Step 19 后按实施计划 SOP 生成 | 实施计划编写者 |

### 7.3 待确认事项表

| 事项 | 当前影响 | 需要谁确认 | 未确认前的处理方式 |
|---|---|---|---|
| Step 19 是否完成后再交付实现 agent | 影响实现输入是否正式 | 详细设计维护者 / 架构负责人 | 推荐完成 Step 19 后交付；紧急时注明以 Step 1~18 为临时依据 |
| 是否在 `07` 前补 `04-配置设计.md` | 影响 config loader、JSON 示例、env 和 profile 实施 | 文档维护者 / 实施计划编写者 | 推荐 Step 19 后补 `04`，`07` 不得脑补完整配置 |
| `05-测试方案.md` 是否按 Step 16 重校准 | 影响测试门禁完整度 | 测试方案维护者 | 未确认前，实施不得低于 Step 16 最小切口 |
| `06-验收标准.md` 是否按新版 `03` 重校准 | 影响最终验收 | 验收标准维护者 | 未确认前，验收不得低于 redaction / fake marker / 状态门禁 |
| SDK P0 最小验证目标 | 影响 smoke / docs / boundary evidence | 测试方案维护者 / 架构负责人 | 使用 fake / fixture explicit profile，不宣称 production supported |
| Python / TypeScript 工具链 | 影响 package surface 真实构建 | SDK 包维护者 / 实施负责人 | 先实现 port 和 job 契约，真实工具链可后续 Spike |
| public registry 发布何时设计 | 影响生态发布 | 产品 / 架构负责人 | P0 不实现公共发布，只保留 artifact ref 和 candidate stable |
| `07` 的 phase / commit boundary | 影响开发执行顺序 | 实施计划编写者 | Step 18 不定义，后续按实施计划 SOP 生成 |

### 7.4 阻塞级别汇总

| 级别 | 事项 | 处理 |
|---|---|---|
| 必须先完成 | Step 19 正式 `03` 重建 | 完成后才能正式交付实现 agent |
| 开工前必须确认 | 目标仓、git config、contracts path | 写入 `07` 前置检查 |
| P0 验收必须通过 | redaction、fake marker、forbidden body、Step 16 最小测试切口 | 写入测试 / 验收门禁 |
| 建议在 `07` 前完成 | `04-配置设计.md`、`05/06` 对齐复核 | 避免实施计划脑补配置、测试和验收 |
| 不阻塞 P0 | public registry、全量服务覆盖、production endpoint matrix、完整 gateway / REPL / cache | P1 / 后续专项 |

---

## 8. 回填草稿

正式 `03-详细设计.md` §17 建议按以下结构回填：

```text
17. 风险与待确认事项
  17.1 已按当前方案关闭的前序决策
  17.2 风险表
  17.3 待确认事项表
  17.4 阻塞级别汇总
```

说明：

- §17 不重开已经在前序 Step 中关闭的设计决策。
- §17 必须明确哪些事项阻塞正式交付、开工、P0 验收或只影响 P1。
- Step 19 整理正式文档时，不能把这些待确认事项改写成已确认实现事实。

---

## 9. 待确认事项

| 待确认项 | 备选方案 | 推荐方案 | 推荐理由 | 当前状态 |
|---|---|---|---|---|
| 是否把所有前序待确认项重开 | A. 全部重开；B. 只保留仍影响实现 / 交付的事项 | B | 避免重复讨论，同时保留真实风险 | 已按 B 写入 |
| `04-配置设计.md` 缺失是否阻塞 Step 19 | A. 阻塞；B. 不阻塞 Step 19，但建议在 `07` 前补齐 | B | `03` 只写代码绑定点，配置手册可后续补 | 已按 B 写入 |
| 真实 formal API 是否作为 P0 必选 | A. 必选；B. 可用 fake / fixture 或 pending / unsupported | B | 架构层未锁具体服务，fake 不可伪装生产 | 已按 B 写入 |
| public registry 是否进入 P0 | A. 进入；B. 不进入 | B | P0 是本地 candidate 验证闭环 | 已按 B 写入 |
| 实现 agent 是否可直接读旧 `03` | A. 可以；B. 不可以 | B | 旧 `03` 与新版中间产物不一致 | 已按 B 写入 |

---

## 10. 进入下一步条件

进入 Step 19 前必须满足：

- 所有未关闭事项都有记录、影响范围和未确认前处理方式。
- 已关闭的前序决策不会被重新误写成风险。
- 阻塞正式交付、开工前检查、P0 验收和 P1 后续事项已经分级。
- 不确定项没有被写成正式实现契约。
- 可以进入 Step 19 “整理正式详细设计文档”。
