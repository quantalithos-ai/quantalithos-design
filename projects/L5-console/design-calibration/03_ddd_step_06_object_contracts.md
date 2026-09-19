# Step 6. 逐模块定义对象实现契约

### 1. Step 状态

- 状态：`[x] done / step_stop_review`
- 对应 SOP：`standards/document/详细设计讨论流程_SOP.md` Step 6
- 回填章节：未来正式 `03-详细设计.md` §5 模块实现契约中的对象契约、§6 全局对象索引
- 当前批次：`6.8`（跨模块总审计、Step 7 承接与停审）
- 正式回填：未执行；正式 `03-详细设计.md` 仍为 `historical_material`；Step 19 前不得装配。
- 实现事实：目标仓 `/home/aris/Projects/quantalithos-console` 仍为 `planned / not_created`；本文所有 TypeScript 块均是设计契约，不是已存在代码。

### 2. 本步目标

在 Step 5 已固定的十个 planned TypeScript 模块下，按“模块 capability → 输入/输出/状态/副作用 → 对象 → 字段/来源 → factory/函数 → 状态变体 → 不变量”闭合对象实现契约。本文采用 `projects/L1-governance` Step 6 的粒度与逐批停审框架，但将 Rust/domain/server 形态转译为浏览器 TypeScript 客户端对象，并拒绝迁入任何治理域 truth。

本 Step 必须证明：

```text
每个 Console 模块 capability 都有对象承接。
每个对象都能回到已确认 capability，而不是从旧文档或页面名猜出。
每个字段、函数和状态都有正式来源、客户端所有权或明确的后续阻塞点。
owner-safe 映射只能读取/收紧，不能由 Console 推进 owner truth。
```

### 3. 本步输入

| 输入 | 已确认内容 | 本步使用方式 |
|---|---|---|
| `03_ddd_step_05_module_contracts_axis.md` | 十模块主轴、依赖方向、对象/port/entry 归属预告 | 决定对象所属模块和跨模块禁止方向。 |
| `02-概要设计.md` §5/§6/§9/§12 | 五个主要组成部分、对象白名单、客户端状态与 owner-safe 只读轴、03 承接规则 | 作为对象名、责任、状态和回退 authority。 |
| `02_hld_step_06_key_objects.md` | 主对象、辅助 ref/view/history/guard 候选及概要字段/函数 | 作为对象候选池；不能直接当详细 schema。 |
| `02_hld_step_09_state_machine.md` | context、visibility、snapshot、draft、request、activation、degradation/recovery 的状态集合与禁迁移 | 约束 Step 6 状态 carrier 和同名状态主语。 |
| `02_hld_step_07_api_interface_skeleton.md`、`02_hld_step_08_processing_flows.md` | Query/Command/optional invalidation 分类和九组流 | 反查对象 capability 与 Step 7+ 承接点；本 Step 不抢写协议。 |
| `03_ddd_step_03_coding_runtime_constraints.md` | TypeScript/ESM、strict、JSDoc、SDK-only、framework pending | 所有类型块使用 TypeScript/JSDoc，不机械使用 Rust/Cargo。 |
| `standards/coding/typescript.md` | readonly、具名导出、UpperCamelCase 类型、lowerCamelCase 成员、导出符号 JSDoc | 作为设计代码块书写约束。 |
| `standards/document/设计真相源闭环与可落码性标准.md` | 字段来源、support carrier、成员参数、状态/factory 和后续 port/protocol 闭环门禁 | 防止只命名二级类型或让实现者猜 schema。 |
| `projects/L1-governance/design-calibration/03_ddd_step_06_object_contracts.md` | 批次控制、shared vocabulary、逐模块对象卡、字段/状态审计、Step 7 承接 | 只借鉴深度与结构；不继承 governance 对象、repository、outbox、worker/job。 |

### 4. Step 6 写入批次状态表

| 批次 | 覆盖范围 | 写入状态 | 内容完整 | 停审状态 | 后续批次 |
|---|---|---|---|---|---|
| `6.0` | 骨架、输入、问题框架、shared vocabulary 规则、执行顺序、闭口决策 | `done` | `yes` | `pass` | `6.1` |
| `6.1` | 跨模块 shared vocabulary、typed ref、状态 union、集合和 safe payload carrier | `done` | `yes` | `pass` | `6.2` |
| `6.2` | `access` + `navigation` 对象契约，含 framework-neutral route binding | `done` | `yes` | `pass` | `6.3` |
| `6.3` | `views` 对象、read-only guard、safe payload/ref/history 契约 | `done` | `yes` | `pass` | `6.4` |
| `6.4` | `intent` 对象、草稿/请求/结果分层与 guards | `done` | `yes` | `pass` | `6.5` |
| `6.5` | `features` 对象、八类 topic/page/region 组合与 activation guards | `done` | `yes` | `pass` | `6.6` |
| `6.6` | `recovery` 对象、局部降级、恢复、a11y 与等价 guard | `done` | `yes` | `pass` | `6.7` |
| `6.7` | `entry`、`state`、`diagnostics` 对象；`adapters` defer 决策 | `done` | `yes` | `pass` | `6.8` |
| `6.8` | 跨模块字段/状态闭环、Step 7 承接、回填草稿、待确认和三层门禁 | `done` | `yes` | `pass` | Step 6 停审 |

> 写入纪律：先完成当前批次并更新本表，再进入下一批；不得以“已有骨架”代替对象卡内容，也不得预创建 Step 7 文件。

### 5. 模块执行顺序表

| 顺序 | 模块/对象组 | 模块职责 | 输入来源 | 完成后停审点 |
|---|---|---|---|---|
| 1 | shared vocabulary | 收敛本地 ref、owner opaque ref、安全标记、状态 union、set/payload 基础载体 | `02` §6/§9、Step 5 | 二级类型可逐字段落码且不复制 owner schema |
| 2 | `access` | formal context safe presentation 与 disclosure tightening | `02` §5.4/§6.2 | context 字段/状态/factory/guard 来源闭合 |
| 3 | `navigation` | entry/route selection、visibility posture、敏感选择清理 | `02` §5.4/§6.2/§9 | 选择与授权分离；route binding 不锁 framework |
| 4 | `views` | owner-safe snapshot、多轴、view/ref 和 no-write | `02` §5.5/§6.3 | safe payload、轴来源、失效与 no-write 闭合 |
| 5 | `intent` | draft/request/formal result 分层 | `02` §5.6/§6.4/§9 | receipt/result/unknown 与本地草稿边界闭合 |
| 6 | `features` | 八主题 owner 分区、activation、page/semantic region composition | `02` §5.7/§6.5 | 主题对象不吸收 owner truth；page/component 维持 framework-neutral |
| 7 | `recovery` | local degradation/recovery/a11y | `02` §5.8/§6.6/§9 | 显式恢复、局部故障和语义等价闭合 |
| 8 | `state` | bounded state record、scope binding、cleanup/invalidation | Step 5、`02` §9/§11 | medium/TTL 延后但载体边界可落码 |
| 9 | `diagnostics` | body-free diagnostic context | `02` §5.8/§6.6 | diagnostic 与 audit/evidence 分离 |
| 10 | `entry` | session shell/composition carrier | `02` §4/§8、Step 5 | 入口不实现 auth/owner rule；依赖注入留 Step 7 |
| 11 | `adapters` 闭口决策 | 判定 Step 6 必须闭哪些 adapter carrier、哪些留 Step 7 | Step 5、SDK事实 | 不把 exact owner contract 缺口藏在 adapter state |
| 12 | 跨模块审计 | 字段来源、状态闭环、重复对象、后续承接 | 全部批次 | Step 7 输入逐项命名且实现暂停条件明确 |

### 6. 非 core / boundary 模块对象闭口决策表

本项目没有 Rust `contracts/domain/application/infra/api/worker/jobs`。为适配 SOP，以下表对浏览器客户端的入口和边界模块作等价闭口裁定。

| 模块 | Step 6 是否闭口 | 本 Step 必须闭口 | defer 内容与理由 | 后续承接 |
|---|---|---|---|---|
| `entry` | 部分闭口 | `ConsoleSessionShell` 的安全字段、替换/清理能力和不变量 | bootstrap 依赖注入、异步调用链依赖 Step 7 ports 与 Step 9 flows | Step 7/9 |
| `adapters` | carrier 闭口，port/adapter defer | formal boundary 输入/输出必须引用的本地 safe carrier、adapter 不能保存的内容 | exact SDK/owner method、DTO、error/cancel/version 归 Step 7/8；上游合同仍 pending | Step 7/8/12/14 |
| `state` | 对象闭口、介质 defer | `ClientStateRecord`、`StateScopeBinding`、`InvalidationMarker`、cleanup 规则 | storage medium、TTL、migration、cross-session policy 无 authority | Step 7/11/14/04 |
| `diagnostics` | 对象闭口、sink defer | `DiagnosticContext`、redaction/emit eligibility | sink interface、envelope binding 和 telemetry vocabulary 尚未闭口 | Step 7/12/15 |
| concrete page/router/component | semantic contract 闭口，framework binding defer | `RouteBinding`、`TopicPageModel`、`SemanticRegionModel` 和 action/status/recovery region 语义 | framework/router/component library/bundler pending；不得发明 `.tsx`/Vue/Svelte 文件 | Step 7/9/14/实施 ADR |
| repository/projection/worker/job | 不适用 | 无 | 被架构明确排除，不得在后续 Step 复活 | N/A |

### 7. TypeScript 对象契约书写规则

- 导出的 type/interface/class/function 必须有中文 JSDoc；字段使用 `readonly`，状态变更函数返回新值，不原地修改。
- TypeScript 代码块是 planned contract；不代表目标仓存在、编译通过或测试通过。
- `enum` 默认使用 string literal union + discriminated union；每个变体仍必须有独立语义表、合法来源和允许去向。
- owner exact ref/schema 未闭口时，只定义 Console 可安全保存的 opaque/ref/presentation carrier；不能猜 owner 字段、path、错误码或 terminal taxonomy。
- `unknown` 只允许出现在明确的 transport intake 边界，进入任何对象前必须由 Step 7/8 adapter/schema guard 收窄；本文对象字段禁止 `any` 和裸 `unknown`。
- `SafeViewPayload`/`ClientDraftFields` 只允许结构化 client-safe scalar/ref；禁止 raw JSON、binary、credential、secret、owner hidden body、治理依据、evidence/audit/report 正文。
- local factory 的所有必填字段必须来自参数；不得在对象内部生成 ref、时间、正式资格或 owner 结果。
- 本 Step 不定义 HTTP path、SDK transport、repository、缓存产品、TTL、重试数、超时数、技术阈值或测试结果。

### 8. SOP 问题回答框架

0. **是否已先建立骨架、批次表和模块顺序？** 已建立；只有批次表从 `in_progress` 逐批更新后才能完成 Step 6。
1. **是否需要 shared vocabulary？** 需要。十个模块共享 typed local ref、owner opaque ref、safe reason/marker、状态轴和确定性集合；这些必须先于对象卡闭口，且不能成为无归属 `common` 目录。
2. **每个模块 capability、输入、输出、状态、副作用如何记录？** 每个模块先给 capability 表，再给功能到对象映射和对象能力矩阵，最后逐对象成卡。
3. **对象如何分类？** 仅分为 client interaction truth、owner-safe view/reference、guard/policy、application helper、entry/state/diagnostic carrier；不存在 Console-owned owner domain、repository/projection/outbox/worker/job。
4. **非核心模块哪些现在闭、哪些 defer？** 见 §6；稳定 carrier 在 Step 6 闭口，port/protocol/flow/config 分别交 Step 7/8/9/14/04。
5. **字段与函数如何闭口？** 每个字段写 exact TypeScript 类型、必填/可选、来源和禁止替代；每个函数写参数/返回/副作用，不允许从 opaque ref 推导隐藏字段。
6. **状态如何处理？** Console-owned 状态写 union/变体和迁移能力；`SourceStatusAxes`、`OwnerResultState` 等 owner-safe 映射标为只读，不允许本地推进。
7. **如何处理未闭上游合同？** 保留 typed opaque carrier + `pending/blocked/read_only/partial/unknown` 安全姿态；若 positive path 需要 exact schema，列入实现暂停条件，不自造字段。

<!-- STEP6_BATCH_6_1_START -->

### 9. Batch 6.1：跨模块 shared vocabulary 与 typed carrier

#### 9.1 shared vocabulary 所有权与依赖规则

Console 不建立 `common`/`shared` 顶层目录。复用类型必须由语义所属模块导出，其它模块按依赖方向引用：

| 类型组 | 正式归属（planned file） | 允许消费者 | 禁止用途 |
|---|---|---|---|
| local/formal ref primitives、construction result | `src/access/access_context.ts` | `navigation`、`views`、`intent`、`features`、`recovery`、`state`、`diagnostics`、`adapters`、`entry` | 不解析 owner opaque value，不作为权限/幂等/终态依据；作为基础类型时不得反向引用消费者 |
| safe reference set | `src/views/safe_reference_set.ts` | `intent`、`features`、`recovery`、`adapters`、`state` | 不作为权限/幂等证明，不让 `access` 反向依赖 `views` |
| source status axes | `src/views/source_status_axes.ts` | `views`、`features`、`recovery` | 不合成 health/compliance/readiness |
| safe view payload | `src/views/owner_view_model.ts` | `views`、`features`、`adapters` | 不保存 raw JSON、HTML、binary 或 hidden body |
| draft-safe scalar | `src/intent/draft_intent.ts` | `intent`、`state`、`features` | 不与 owner DTO 等同，不保存 secret/credential/evidence body |

这里把最小 ref/result 基础类型放在已有的 `access_context.ts`，不是把 `access` 升级为授权 owner，而是利用它作为正式语境边界的最底层无正文类型归属。`views` 可以依赖 `access`，`access` 不再依赖 `views`，从类型层消除循环；Step 7 若需拆出独立文件，必须先回写 Step 4/5，不能临时创建 `common` 或 `shared` 大桶。

#### 9.2 `NonEmptyOpaqueValue`

```ts
/** 经过边界校验的非空 opaque 值；业务代码不得解析其内部结构。 */
export type NonEmptyOpaqueValue = string & {
  readonly __brand: 'NonEmptyOpaqueValue';
};

/** 校验并包装 opaque 值；失败只表示本地对象不变量未满足。 */
export declare function parseNonEmptyOpaqueValue(
  value: string,
): ObjectConstructionResult<NonEmptyOpaqueValue>;
```

| 项 | 契约 |
|---|---|
| 输入来源 | SDK/formal adapter 已裁剪的 ref value，或 Console factory 调用方显式提供的本地 ref value |
| 校验 | 去除首尾空白后不得为空；不得包含 raw body、credential、secret 或可执行脚本片段 |
| 禁止替代 | 不得用页面标题、route、错误消息、owner body 摘要或随机 UI 文本代替 |
| 解析规则 | Console 不按分隔符、前缀、UUID 形态或 URL 结构解析；exact owner identity 由 owner/SDK 负责 |

#### 9.3 `OwnerKey` 与 `FormalSourceKey`

```ts
/** Console 当前允许引用的正式 truth owner。 */
export type OwnerKey =
  | 'identity'
  | 'member-service'
  | 'work'
  | 'process'
  | 'governance'
  | 'artifact'
  | 'workspace'
  | 'method-library'
  | 'capability-hub'
  | 'observability'
  | 'archive'
  | 'sandbox';

/** 可提供正式边界提示的来源；sdk 只代表边界，不成为业务 truth owner。 */
export type FormalSourceKey = OwnerKey | 'sdk';
```

| 变体组 | 来源 | 作用 | 禁止事项 |
|---|---|---|---|
| `OwnerKey` 十二个 owner 标签 | 正式 00/01/02 的依赖与主题映射 | 选择本地 adapter/owner partition，不推导能力是否 active | 不得从 route、package name 或 response body 猜 owner |
| `'sdk'` | 官方 SDK boundary | 标记 invalidation/context transport 的来源边界 | 不得把 SDK 当成员/治理/归档等 truth owner |

新增 owner 标签必须回退依赖/主题设计并更新本类型；不能以任意字符串 silent fallback。

#### 9.4 `OwnerReferenceKind` 与 `OwnerReference`

```ts
/** Console 消费侧可区分的正式引用语义；不是 owner 内部 type registry。 */
export type OwnerReferenceKind =
  | 'actor'
  | 'scope'
  | 'visibility-decision'
  | 'object'
  | 'version'
  | 'safe-field-set'
  | 'reason'
  | 'query-surface'
  | 'command-surface'
  | 'idempotency'
  | 'receipt'
  | 'result'
  | 'reconciliation'
  | 'capability'
  | 'activation'
  | 'link-target'
  | 'trace';

/** 只保存正式 owner 允许披露的 opaque 引用，不保存引用对象正文。 */
export interface OwnerReference<K extends OwnerReferenceKind = OwnerReferenceKind> {
  readonly owner: OwnerKey;
  readonly kind: K;
  readonly opaqueValue: NonEmptyOpaqueValue;
}

/** 从已验证的 adapter 输出构造 owner 引用；不允许 UI 直接构造。 */
export declare function createOwnerReference<K extends OwnerReferenceKind>(
  owner: OwnerKey,
  kind: K,
  opaqueValue: NonEmptyOpaqueValue,
): OwnerReference<K>;
```

| 字段 | 类型 | 必填 | 来源 / 约束 |
|---|---|---|---|
| `owner` | `OwnerKey` | 是 | 由已选择的 formal adapter/SDK result 明确给出；不能由 ref 字符串解析 |
| `kind` | `K` | 是 | 由 adapter mapper 的静态映射给出；不能从 response label 或 route 猜测 |
| `opaqueValue` | `NonEmptyOpaqueValue` | 是 | owner/SDK 允许披露的稳定 ref；不含正文 |

不变量：`OwnerReference` 只证明“有一个来自该 owner、用于该本地语义槽位的引用”，不证明对象存在、可见、已授权、当前、幂等或终态。owner exact typed-ref family/tag 仍由 Step 7/8 合同闭合；若无法安全映射，adapter 必须拒绝构造并使主题保持 `pending/blocked/unknown`。

#### 9.5 `LocalReferenceKind` 与 `LocalReference`

```ts
/** Console-owned 交互对象引用种类。 */
export type LocalReferenceKind =
  | 'session'
  | 'context'
  | 'navigation-entry'
  | 'view'
  | 'snapshot'
  | 'query'
  | 'draft'
  | 'request'
  | 'command-attempt'
  | 'topic'
  | 'guard'
  | 'recovery-plan'
  | 'state-record'
  | 'invalidation'
  | 'diagnostic';

/** 引用 Console-owned interaction truth；不引用 owner business truth。 */
export interface LocalReference<K extends LocalReferenceKind = LocalReferenceKind> {
  readonly kind: K;
  readonly opaqueValue: NonEmptyOpaqueValue;
}

/** 从调用方提供的稳定值构造本地引用；factory 不自行生成值。 */
export declare function createLocalReference<K extends LocalReferenceKind>(
  kind: K,
  opaqueValue: NonEmptyOpaqueValue,
): LocalReference<K>;
```

| 字段 | 类型 | 必填 | 来源 / 约束 |
|---|---|---|---|
| `kind` | `K` | 是 | 调用方静态选择；不能使用任意 string |
| `opaqueValue` | `NonEmptyOpaqueValue` | 是 | entry/state carrier 通过后续正式 ref generator/host source 提供；factory 不调用随机数或时间 |

Step 7 必须闭合本地 ref 生成 seam 或宿主来源；在此之前实现不得用数组下标、route、时间戳或展示文本拼 ref。

#### 9.6 `ReferenceValidity`

```ts
/** 描述 Console 当前能否继续消费某个安全引用；不改变 owner 对象状态。 */
export type ReferenceValidity =
  | 'current'
  | 'stale'
  | 'invalidated'
  | 'revoked'
  | 'unknown';
```

| 变体 | JSDoc 语义 | 合法来源 | 允许去向 |
|---|---|---|---|
| `current` | 正式结果在当前观察点允许消费 | 新的 owner-safe result/ref | `stale`、`invalidated`、`revoked`、`unknown` |
| `stale` | 引用可受限呈现但必须重新读取 | 正式 freshness、SDK hint 或本地失效标记 | `current`（仅新正式结果）、`invalidated`、`revoked`、`unknown` |
| `invalidated` | 旧引用不得用于正常主线 | formal invalidation 或 scope/context 清理 | `current`（仅新正式结果）、`revoked`、`unknown` |
| `revoked` | 正式来源已撤销旧引用 | owner/SDK 正式撤销 | `current`（仅新的不同/重验引用）或保持 `revoked` |
| `unknown` | 无法安全判断引用当前性 | adapter ambiguity、合同缺失、冲突 | `current/stale/revoked`（仅正式新结果） |

禁止由 cache hit、route 仍可打开、组件未卸载或本地时间自动进入 `current`。

#### 9.7 `SafeReference` 与 `SafeReferenceSet`

```ts
/** Console 可在当前边界内保存的 body-free 引用。 */
export type SafeReference = Readonly<{
  reference: OwnerReference | LocalReference;
  validity: ReferenceValidity;
}>;

/** 确定性、安全引用集合；按 canonical key 去重并稳定排序。 */
export interface SafeReferenceSet {
  readonly items: readonly SafeReference[];
}

/** 验证引用种类、去重并按 canonical key 稳定排序。 */
export declare function createSafeReferenceSet(
  items: readonly SafeReference[],
): ObjectConstructionResult<SafeReferenceSet>;
```

| 项 | 契约 |
|---|---|
| 成员 exact kind | 只能是 §9.4 `OwnerReference` 或 §9.5 `LocalReference`；无裸 string/URL/object |
| canonical key | owner ref：`owner + kind + opaqueValue`；local ref：`kind + opaqueValue`；该 key 只用于本地确定性，不写回 owner |
| 空集合 | 允许；必须与 coverage=`missing/not-covered` 或明确的正式空结果结合解释，不能单独推导“无对象” |
| 去重 | 同 canonical key 只能出现一次；冲突 validity 取更保守值，顺序为 `revoked > invalidated > unknown > stale > current` |
| 顺序 | 构造器使用 canonical key 升序稳定排序；不得保留 transport 返回的偶然顺序作为业务优先级 |
| body-free | 成员不得携带 title、label、snippet、raw URL、owner body、credential 或 secret |

#### 9.8 `RedactionMarker`

```ts
/** 证明本地 carrier 没有保留 forbidden body，并指出安全字段集来源。 */
export interface RedactionMarker {
  readonly bodyDisposition: 'absent' | 'redacted';
  readonly safeFieldSetRef?: OwnerReference<'safe-field-set'>;
}
```

| 字段 | 类型 | 必填 | 来源 / 约束 |
|---|---|---|---|
| `bodyDisposition` | `'absent' \| 'redacted'` | 是 | adapter mapper 明确判定；不能写 `unknown` 并继续正常呈现 |
| `safeFieldSetRef` | `OwnerReference<'safe-field-set'>` | 否 | owner/SDK 提供安全字段集 ref 时保存；缺失不允许自行发明 allowlist |

当 owner result 包含无法证明安全的字段且无 safe-field contract 时，不得构造 `SafeViewPayload`；应返回 blocked/unknown/degraded 边界。`RedactionMarker` 不是合规证据或正式审计记录。

#### 9.9 `SafeScalarValue`、`SafeViewField` 与 `SafeViewPayload`

```ts
/** 已通过 adapter allowlist 的最小 scalar；不接受 object、array、HTML 或 binary。 */
export type SafeScalarValue =
  | Readonly<{ kind: 'text'; value: string }>
  | Readonly<{ kind: 'number'; value: number }>
  | Readonly<{ kind: 'boolean'; value: boolean }>
  | Readonly<{ kind: 'null' }>
  | Readonly<{ kind: 'reference'; value: SafeReference }>;

/** 单个 owner-safe 字段；field key 是 adapter contract 中的 opaque key。 */
export interface SafeViewField {
  readonly fieldKey: NonEmptyOpaqueValue;
  readonly value: SafeScalarValue;
}

/** 可进入 view model/state shadow 的结构化安全 payload。 */
export interface SafeViewPayload {
  readonly fields: readonly SafeViewField[];
  readonly redaction: RedactionMarker;
}

/** 校验字段 key 唯一、值类型安全及 redaction marker。 */
export declare function createSafeViewPayload(
  fields: readonly SafeViewField[],
  redaction: RedactionMarker,
): ObjectConstructionResult<SafeViewPayload>;
```

| 契约面 | 规则 |
|---|---|
| `text` | 必须来自 owner safe-field mapper 或允许的客户端 label；禁止 HTML、script、credential、secret、原始 evidence/audit/report body |
| `number` | 必须是有限数；不允许 `NaN`/Infinity；不把无 authority 阈值写成字段 |
| `reference` | 必须是 `SafeReference`；不能用 URL/string 绕过 typed reference |
| fields | `fieldKey` 唯一并按 key 稳定排序；空 fields 允许但必须配合 coverage/status 明确解释 |
| construction source | 仅 `adapters` safe mapper；UI component、feature flag、test mock 不能在生产路径自行构造 owner field |

#### 9.10 `ObjectConstructionViolation` 与 `ObjectConstructionResult<T>`

```ts
/** 仅表示本地对象 factory/guard 的不变量失败；不是 owner 或协议错误。 */
export type ObjectConstructionViolation =
  | Readonly<{ kind: 'empty-opaque-value'; field: string }>
  | Readonly<{ kind: 'duplicate-item'; canonicalKey: string }>
  | Readonly<{ kind: 'unsafe-field'; fieldKey?: string }>
  | Readonly<{ kind: 'missing-formal-source'; field: string }>
  | Readonly<{ kind: 'invalid-state-combination'; subject: string }>
  | Readonly<{ kind: 'forbidden-body'; subject: string }>;

/** 不抛出字符串异常的本地 factory 结果。 */
export type ObjectConstructionResult<T> =
  | Readonly<{ ok: true; value: T }>
  | Readonly<{ ok: false; violation: ObjectConstructionViolation }>;
```

| 变体 | 使用范围 | 禁止事项 |
|---|---|---|
| `empty-opaque-value` | 本地/owner ref 输入为空 | 不映射为 owner not-found |
| `duplicate-item` | deterministic set 内 canonical key 重复 | 不静默选择 transport 顺序 |
| `unsafe-field` | safe field/value 未通过 allowlist/shape | 不把原值塞进 violation |
| `missing-formal-source` | 必填 owner/ref/marker 没有正式来源 | 不用 route/config/mock 补值 |
| `invalid-state-combination` | 对象字段与状态不变量冲突 | 具体协议错误留 Step 12 映射 |
| `forbidden-body` | 检测到正文/credential/secret 等禁止载荷 | violation 只存 subject 标签，不存被拒正文 |

#### 9.11 shared vocabulary 停审记录

| 审查项 | 结论 | 后续承接 |
|---|---|---|
| public ref 是否有 exact client-side shape | 通过：owner/local ref、kind、opaque value 和 validity 已闭口 | owner exact registry/tag 映射留 Step 7/8；映射失败必须 blocked |
| ref-set 是否闭合成员/去重/排序/empty | 通过 | Step 16 验证 deterministic semantics |
| safe payload 是否允许 arbitrary object | 否；仅 discriminated scalar/reference | Step 7/8 adapter schema 与 safe-field allowlist |
| 是否有无边界 shared/common 桶 | 否；每组类型有 planned owner file | Step 4 文件拆分可在实现边界内按同模块增补，不得新增跨域 common |
| factory failure 是否冒充 protocol error | 否；只用 `ObjectConstructionViolation` | Step 12 映射为 client error/recovery posture |
| 是否复制 owner exact schema | 否；只保存 owner、消费侧 kind、opaque ref | exact contract pending 原样保留 |

Batch `6.1 = pass`。允许进入 `access`/`navigation` 对象批次；本批未创建实现文件或测试。

<!-- STEP6_BATCH_6_2_START -->

### 10. Batch 6.2：`access` 与 `navigation` 对象契约

#### 10.1 `access` capability / 功能清单

| capability | 输入 | 输出 | 状态/副作用 | 所属对象 | 后续承接 |
|---|---|---|---|---|---|
| formal context 映射 | context/actor/scope/visibility safe refs | `AccessContext` | 只更新 Console context presentation | `AccessContext`、`ActorScopeReference`、`VisibilityReference` | Step 7 context/qualification port；Step 8 schema |
| context 失效与收紧 | 现有 context、正式失效/撤销/冲突/unknown 原因 ref | 新 `AccessContext` | 清除可用姿态；不改 owner truth | `AccessContext` | Step 9 flow；Step 10 matrix；Step 11 cleanup |
| 披露上限计算 | context、formal qualification、target | `DisclosureDecision` | 只收紧；无外部写入 | `DisclosureGuard`、`QualificationBoundary` | Step 7 qualification port；Step 9 flow |
| revalidation 判定 | context lifecycle | boolean/安全恢复方向 | 无外部副作用 | `AccessContext` | Step 9/10 |

#### 10.2 `access` 功能到对象映射

| 对象 | 承接功能 | 对象类别 | 对象能力 | 不承接/禁止事项 |
|---|---|---|---|---|
| `ActorScopeReference` | actor/scope 引用绑定 | owner-safe reference | 保持 actor、scope 与 validity 同一观察边界 | 不认证、不解析 scope hierarchy |
| `VisibilityReference` | 正式 visibility 决定引用 | owner-safe reference | 保存决定 ref、validity 和最小 reason ref | 不生成 allow/deny |
| `AccessContext` | context lifecycle presentation | client interaction state | formal construct、invalidate、restrict、requires revalidation | 不签发 credential、不缓存授权证明 |
| `QualificationBoundary` | 正式资格结果消费 | owner-safe decision carrier | 保留 posture、source ref、reason ref | 不执行 Policy/Gate 或本地角色推断 |
| `DisclosureGuard` | 本地最小披露 guard | guard | 将 context+qualification 收紧为 presentation posture | 不能比正式输入更开放 |

#### 10.3 `access` 对象能力到字段/函数/状态映射

| 对象 | 能力 | 必需字段 | factory/构造入口 | 关键函数 | 状态 | 字段来源 |
|---|---|---|---|---|---|---|
| `ActorScopeReference` | 正式 actor/scope 成对绑定 | `actorRef`、`scopeRef`、`validity` | `createActorScopeReference` | `isActorScopeCurrent` | `ReferenceValidity` | formal context adapter |
| `VisibilityReference` | visibility 决定回指 | `decisionRef`、`validity`；reason 可选 | `createVisibilityReference` | `isVisibilityRestricted` | `ReferenceValidity` | qualification/visibility adapter |
| `AccessContext` | context lifecycle | 每个 discriminant 分支所列字段 | `createUnresolvedAccessContext`、`createResolvedAccessContext` | `invalidateAccessContext`、`restrictAccessContext`、`requiresContextRevalidation` | `ContextLifecycleState` | entry local ref + formal refs |
| `QualificationBoundary` | formal qualification posture | `contextRef`、`posture`；正式 source 按分支 | `createQualificationBoundary` | `tightenQualificationBoundary` | `QualificationPosture` | owner/SDK formal result |
| `DisclosureGuard` | disclosure decision | `guardRef`、`target` | `createDisclosureGuard` | `checkDisclosure` | `DisclosurePosture` | local guard ref + formal context/qualification |

#### 10.4 `ActorScopeReference`

```ts
/** 将正式 actor 与 scope 引用绑定在同一消费观察点；不构成授权证明。 */
export interface ActorScopeReference {
  readonly actorRef: OwnerReference<'actor'>;
  readonly scopeRef: OwnerReference<'scope'>;
  readonly validity: ReferenceValidity;
}

/** 校验 actor/scope owner 一致性并构造安全引用。 */
export declare function createActorScopeReference(
  actorRef: OwnerReference<'actor'>,
  scopeRef: OwnerReference<'scope'>,
  validity: ReferenceValidity,
): ObjectConstructionResult<ActorScopeReference>;

/** 仅检查当前消费有效性；不检查权限。 */
export declare function isActorScopeCurrent(
  reference: ActorScopeReference,
): boolean;
```

| 字段 | 类型 | 作用 | 约束/来源 |
|---|---|---|---|
| `actorRef` | `OwnerReference<'actor'>` | 正式 actor 安全引用 | formal context adapter；当前必须来自 `identity` 或获正式授权的等价 owner，exact matrix pending |
| `scopeRef` | `OwnerReference<'scope'>` | 正式 scope 安全引用 | 同一 formal context result；不能从 project route/tenant label 拼接 |
| `validity` | `ReferenceValidity` | 当前消费有效性 | formal result 或正式 invalidation；本地只能收紧 |

不变量：actor/scope 必须来自同一正式 context observation；owner 不一致且无正式跨-owner relation contract 时 factory 返回 `missing-formal-source`。不得保存 actor/profile/scope 正文、role 集合、credential 或 Policy/Gate 依据。

#### 10.5 `VisibilityReference`

```ts
/** 回指正式 visibility/qualification 决定；仅保留安全决定引用和当前性。 */
export interface VisibilityReference {
  readonly decisionRef: OwnerReference<'visibility-decision'>;
  readonly validity: ReferenceValidity;
  readonly reasonRef?: OwnerReference<'reason'>;
}

/** 从 formal visibility result 的安全引用构造。 */
export declare function createVisibilityReference(
  decisionRef: OwnerReference<'visibility-decision'>,
  validity: ReferenceValidity,
  reasonRef?: OwnerReference<'reason'>,
): VisibilityReference;

/** 判断该引用是否只能支持受限/阻断呈现。 */
export declare function isVisibilityRestricted(
  reference: VisibilityReference,
): boolean;
```

| 字段 | 类型 | 作用 | 约束/来源 |
|---|---|---|---|
| `decisionRef` | `OwnerReference<'visibility-decision'>` | 正式 visibility/qualification 决定引用 | owner/SDK formal result；不保存决定正文 |
| `validity` | `ReferenceValidity` | 决定当前性 | 正式结果/提示；`stale/invalidated/revoked/unknown` 均不能开放动作 |
| `reasonRef` | `OwnerReference<'reason'>`（可选） | 最小可披露原因回链 | 仅 owner 明确允许时存在；缺失不得生成本地解释 |

`isVisibilityRestricted` 只对 `current` 之外返回 true；它不读取决定正文，也不把 `current` 解释为 allow。

#### 10.6 `ContextLifecycleState` 与 `AccessContext`

```ts
/** Console-owned context presentation lifecycle；不是 identity/session owner 的认证状态。 */
export type ContextLifecycleState =
  | 'unresolved'
  | 'verified'
  | 'restricted'
  | 'expired'
  | 'revoked'
  | 'conflict'
  | 'unknown';

type AccessContextReason = OwnerReference<'reason'>;

/** 按 lifecycle discriminant 闭合状态特定必填字段。 */
export type AccessContext =
  | Readonly<{
      contextRef: LocalReference<'context'>;
      lifecycleState: 'unresolved';
      reasonRef?: AccessContextReason;
    }>
  | Readonly<{
      contextRef: LocalReference<'context'>;
      lifecycleState: 'verified' | 'restricted';
      actorScope: ActorScopeReference;
      visibility: VisibilityReference;
    }>
  | Readonly<{
      contextRef: LocalReference<'context'>;
      lifecycleState: 'expired' | 'revoked' | 'conflict' | 'unknown';
      previousActorScope?: ActorScopeReference;
      previousVisibility?: VisibilityReference;
      reasonRef?: AccessContextReason;
    }>;
```

| 状态 | JSDoc 语义 | 必填字段 | 合法来源 | 允许去向 |
|---|---|---|---|---|
| `unresolved` | 尚无可验证正式语境 | `contextRef` | session shell 初始构造或无 formal result | `verified/restricted/unknown`（正式 resolve） |
| `verified` | 正式 refs 当前可验证，仍受 visibility 上限 | context/actor/scope/visibility | formal context result | `restricted/expired/revoked/conflict/unknown` |
| `restricted` | 仅允许最小披露 | context/actor/scope/visibility | formal result 或本地 guard 收紧 | `verified`（正式新结果）及所有收紧状态 |
| `expired` | 正式 context 当前性不足 | context，可选旧 refs/reason | formal expiry/invalidation | `verified/restricted`（显式重验+新结果）或保持 |
| `revoked` | 正式来源撤销旧 context | context，可选旧 refs/reason | formal revocation | `verified/restricted`（新正式 context）或保持 |
| `conflict` | 正式材料冲突 | context，可选旧 refs/reason | formal conflict/mapper 冲突 | `verified/restricted`（新正式结果）或 `unknown` |
| `unknown` | 无法安全判定 | context，可选旧 refs/reason | contract/transport ambiguity | `verified/restricted/expired/revoked/conflict`（正式结果） |

```ts
/** 构造尚未解析的 context shell。 */
export declare function createUnresolvedAccessContext(
  contextRef: LocalReference<'context'>,
  reasonRef?: AccessContextReason,
): AccessContext;

/** 只从完整 formal refs 构造 verified/restricted context。 */
export declare function createResolvedAccessContext(
  contextRef: LocalReference<'context'>,
  lifecycleState: 'verified' | 'restricted',
  actorScope: ActorScopeReference,
  visibility: VisibilityReference,
): ObjectConstructionResult<AccessContext>;

/** 将 context 收紧到失效/不可判别状态；保留的旧 refs 不再可用于正常主线。 */
export declare function invalidateAccessContext(
  context: AccessContext,
  lifecycleState: 'expired' | 'revoked' | 'conflict' | 'unknown',
  reasonRef?: AccessContextReason,
): AccessContext;

/** 使用 formal visibility 或更保守本地结果收紧为 restricted。 */
export declare function restrictAccessContext(
  context: Extract<AccessContext, {lifecycleState: 'verified' | 'restricted'}>,
  visibility: VisibilityReference,
): AccessContext;

/** 判断是否必须显式重新向正式边界验证。 */
export declare function requiresContextRevalidation(
  context: AccessContext,
): boolean;
```

函数契约：

| 函数 | 返回/副作用 | 不变量 |
|---|---|---|
| `createUnresolvedAccessContext` | 新 immutable value | 无 formal refs 也能填满字段；不伪造 actor/scope |
| `createResolvedAccessContext` | `ObjectConstructionResult<AccessContext>` | actor/scope/visibility 必须 `current`；owner relation 无合同则拒绝，不猜测 |
| `invalidateAccessContext` | 新失效 value | 不改变 `contextRef`；旧 refs 只作为 previous 且不得用于披露/提交 |
| `restrictAccessContext` | 新 restricted value | 不得从 restricted 提升 verified；visibility 非 current 时必须改走 invalidation |
| `requiresContextRevalidation` | boolean | 只有 `verified/restricted` 且 formal refs current 时可为 false |

#### 10.7 `QualificationBoundary`

```ts
/** 正式资格结果在 Console 的最小消费姿态；不包含 Policy/Gate 规则。 */
export type QualificationPosture =
  | 'qualified'
  | 'restricted'
  | 'not-qualified'
  | 'unknown'
  | 'unavailable';

/** 把资格姿态绑定到当前 context 与正式 visibility source。 */
export type QualificationBoundary =
  | Readonly<{
      contextRef: LocalReference<'context'>;
      posture: 'qualified' | 'restricted' | 'not-qualified';
      visibility: VisibilityReference;
      reasonRef?: OwnerReference<'reason'>;
    }>
  | Readonly<{
      contextRef: LocalReference<'context'>;
      posture: 'unknown' | 'unavailable';
      visibility?: VisibilityReference;
      reasonRef?: OwnerReference<'reason'>;
    }>;

/** 从 adapter 已验证的 formal observation 构造资格边界。 */
export declare function createQualificationBoundary(
  boundary: QualificationBoundary,
): ObjectConstructionResult<QualificationBoundary>;

/** 只允许向更保守姿态收紧。 */
export declare function tightenQualificationBoundary(
  boundary: QualificationBoundary,
  posture: Exclude<QualificationPosture, 'qualified'>,
  reasonRef?: OwnerReference<'reason'>,
): QualificationBoundary;
```

| posture | 合法来源 | 可用于什么 | 禁止解释 |
|---|---|---|---|
| `qualified` | current formal visibility/qualification result | 继续由 DisclosureGuard 检查 safe-field/target | 不等于 command 已批准或 owner allow-all |
| `restricted` | formal result 或本地收紧 | minimal disclosure/read-only | 不泄露受限对象/原因正文 |
| `not-qualified` | formal result | 阻断动作；最小安全说明 | 不推导具体 Policy/Gate 规则 |
| `unknown` | contract/transport/conflict ambiguity | fail-closed、重验/退出 | 不当作 denied 或 empty |
| `unavailable` | formal surface 不可用 | 局部 unavailable/recovery | 不等于 not-qualified |

#### 10.8 `DisclosureGuard` 与 `DisclosureDecision`

```ts
/** 披露目标类别；用于选择最小呈现上限，不表示页面/组件实现。 */
export type DisclosureTarget =
  | 'navigation-entry'
  | 'owner-view'
  | 'draft-review'
  | 'command-entry'
  | 'diagnostic';

/** 本地可执行的呈现上限；名称刻意避免 authorization 语义。 */
export type DisclosurePosture =
  | 'present-safe-fields'
  | 'minimal-shell'
  | 'blocked';

/** DisclosureGuard 的 immutable 配置，只能引用正式 safe-field set。 */
export interface DisclosureGuard {
  readonly guardRef: LocalReference<'guard'>;
  readonly target: DisclosureTarget;
  readonly safeFieldSetRef?: OwnerReference<'safe-field-set'>;
}

/** guard 输出；只影响本地呈现。 */
export interface DisclosureDecision {
  readonly posture: DisclosurePosture;
  readonly safeFieldSetRef?: OwnerReference<'safe-field-set'>;
  readonly reasonRef?: OwnerReference<'reason'>;
}

/** 构造 target-bound guard；无 formal field set 时只能支持 minimal/blocked。 */
export declare function createDisclosureGuard(
  guardRef: LocalReference<'guard'>,
  target: DisclosureTarget,
  safeFieldSetRef?: OwnerReference<'safe-field-set'>,
): DisclosureGuard;

/** 基于 context 与 formal qualification 计算只收紧的呈现决定。 */
export declare function checkDisclosure(
  guard: DisclosureGuard,
  context: AccessContext,
  qualification: QualificationBoundary,
): DisclosureDecision;
```

`checkDisclosure` 的确定性规则：

| 条件 | 输出 |
|---|---|
| context `expired/revoked/conflict/unknown/unresolved` | `blocked`；只保留正式 reason ref（若允许） |
| context `restricted` 或 qualification `restricted` | `minimal-shell` |
| qualification `not-qualified/unknown/unavailable` | `blocked` |
| context `verified` + qualification `qualified` + guard 有 formal `safeFieldSetRef` | `present-safe-fields` |
| context `verified` + qualification `qualified` 但无 safe-field ref | `minimal-shell`，不得猜 allowlist |

该函数无网络/存储/诊断副作用；不得读取 route、local role、feature flag、cache 或 payload 内容来放宽 posture。

#### 10.9 `access` 模块停审

| 审查项 | 结论 | 后续缺口 |
|---|---|---|
| capability 是否均有对象承接 | 通过 | formal resolve/qualification port 留 Step 7 |
| 每个 lifecycle 分支必填字段是否可构造 | 通过：discriminated union 避免 unresolved/unknown 伪造 refs | local ref generator、formal result schema 留 Step 7/8 |
| 字段是否有来源 | 通过：local ref 或 formal adapter；无 route/config 派生 | owner relation matrix pending 时 positive construction blocked |
| 是否本地授权 | 否；guard 只输出 presentation posture | Step 16 必须测 no-elevation |
| 是否保存身份/规则正文 | 否 | exact safe-field/reason 可见性由 owner contract 决定 |

#### 10.10 `navigation` capability / 功能清单

| capability | 输入 | 输出 | 状态/副作用 | 所属对象 | 后续承接 |
|---|---|---|---|---|---|
| route-to-entry binding | route config/ref、topic ref | `RouteBinding` | 无业务副作用 | `RouteBinding` | Step 7 host/router adapter；Step 14 config |
| visibility presentation | formal boundary、topic ref | `TopicVisibility` | 只呈现/收紧入口 | `TopicVisibility` | Step 7 qualification adapter；Step 8 schema |
| selection/navigation | current state、binding、visibility | `NavigationState` | 本地选择/历史变化 | `NavigationState` | Step 9 flow；Step 10 matrix |
| sensitive selection cleanup | context invalidation | 新 `NavigationState` | 清除 topic/route/history | `NavigationState` | Step 11 state cleanup |

#### 10.11 `navigation` 功能到对象映射

| 对象 | 承接功能 | 类别 | 对象能力 | 禁止事项 |
|---|---|---|---|---|
| `RouteBinding` | route 与语义入口关联 | application helper | 映射 host route key 到 local entry/topic/target | 不授权、不保存 URL query/body、不中绑定 framework component |
| `TopicVisibility` | 入口/动作姿态 | owner-safe state/value | formal construct、本地收紧、revocation | 不由 route/menu/flag 提升 visible |
| `NavigationState` | 当前选择和安全返回 | client interaction truth | select、apply visibility、clear | 不由空结果推导对象不存在 |

#### 10.12 `RouteBinding`

```ts
/** framework-neutral 的语义路由目标。 */
export type RouteTargetKind =
  | 'shell'
  | 'topic'
  | 'draft-review'
  | 'request-result'
  | 'recovery';

/** 将宿主 route key 绑定到 Console local entry；不包含 URL 或组件类。 */
export interface RouteBinding {
  readonly routeKey: NonEmptyOpaqueValue;
  readonly entryRef: LocalReference<'navigation-entry'>;
  readonly targetKind: RouteTargetKind;
  readonly topicRef?: LocalReference<'topic'>;
}

/** 校验 route target 与 topicRef 的组合。 */
export declare function createRouteBinding(
  routeKey: NonEmptyOpaqueValue,
  entryRef: LocalReference<'navigation-entry'>,
  targetKind: RouteTargetKind,
  topicRef?: LocalReference<'topic'>,
): ObjectConstructionResult<RouteBinding>;
```

组合规则：`targetKind='topic'` 必须有 `topicRef`；其它 target 当前不得携带 `topicRef`。`routeKey` 来自验证后的 host/router binding 配置（Step 14），不能用 owner object ref、角色或 capability 名动态拼接。RouteBinding 仅定位语义入口，进入后仍必须执行 context/visibility/activation 查询。

#### 10.13 `TopicVisibility`

```ts
/** 主题/动作入口的消费姿态；不是正式授权状态。 */
export type VisibilityPosture =
  | 'visible'
  | 'restricted'
  | 'disabled'
  | 'unknown'
  | 'unavailable';

/** 把入口姿态绑定到 topic 与正式决定引用；unknown/unavailable 可无 source。 */
export type TopicVisibility =
  | Readonly<{
      topicRef: LocalReference<'topic'>;
      posture: 'visible' | 'restricted' | 'disabled';
      source: VisibilityReference;
      reasonRef?: OwnerReference<'reason'>;
    }>
  | Readonly<{
      topicRef: LocalReference<'topic'>;
      posture: 'unknown' | 'unavailable';
      source?: VisibilityReference;
      reasonRef?: OwnerReference<'reason'>;
    }>;

/** 只从 formal observation 构造当前姿态。 */
export declare function createTopicVisibility(
  visibility: TopicVisibility,
): ObjectConstructionResult<TopicVisibility>;

/** 本地 guard 只允许向更保守姿态变化。 */
export declare function tightenTopicVisibility(
  visibility: TopicVisibility,
  posture: Exclude<VisibilityPosture, 'visible'>,
  reasonRef?: OwnerReference<'reason'>,
): TopicVisibility;

/** 判断是否可以呈现条件化 action entry；仍不表示 owner command 可执行。 */
export declare function isTopicActionEntryPresentable(
  visibility: TopicVisibility,
): boolean;
```

| posture | JSDoc 语义 | 来源 | 允许去向 |
|---|---|---|---|
| `visible` | 正式结果允许发现入口；动作仍需独立资格/activation | current formal source | 所有更保守状态；恢复 visible 需新 formal result |
| `restricted` | 仅最小披露 | formal result 或 guard tightening | 更保守状态；visible 需新 formal result |
| `disabled` | 入口可见但动作不可发起 | formal qualification/activation result | restricted/unknown/unavailable；visible 需正式新结果 |
| `unknown` | 无法安全判断，fail-closed | contract/transport/conflict | 任意状态仅由 formal result；本地只能保持/收紧 |
| `unavailable` | formal surface 当前不可用 | adapter availability | 任意状态仅由 formal result；不等于 denied |

`isTopicActionEntryPresentable` 只有 `visible` 返回 true，但调用方仍须同时通过 `TopicActivationState.active`、`SubmissionEligibilityGuard` 和最新 AccessContext；该函数不能单独放行动作。

#### 10.14 `NavigationState`

```ts
/** Console-owned 导航选择；不保存 URL、权限或 owner object body。 */
export interface NavigationState {
  readonly selectedRoute?: RouteBinding;
  readonly selectedEntry?: LocalReference<'navigation-entry'>;
  readonly selectedTopic?: LocalReference<'topic'>;
  readonly visibility?: TopicVisibility;
  readonly backEntries: readonly LocalReference<'navigation-entry'>[];
}

/** 构造空 session 导航状态。 */
export declare function createEmptyNavigationState(): NavigationState;

/** 在 context/visibility 已检查后选择语义入口。 */
export declare function selectNavigationEntry(
  state: NavigationState,
  route: RouteBinding,
  visibility?: TopicVisibility,
): ObjectConstructionResult<NavigationState>;

/** 应用新的正式 visibility；姿态收紧时同步清理不安全 topic selection。 */
export declare function applyNavigationVisibility(
  state: NavigationState,
  visibility: TopicVisibility,
): NavigationState;

/** context 失效/撤销时清理所有敏感选择与返回历史。 */
export declare function clearSensitiveNavigation(
  state: NavigationState,
): NavigationState;
```

| 字段 | 类型 | 作用 | 来源/约束 |
|---|---|---|---|
| `selectedRoute` | `RouteBinding`（可选） | 当前 host route 的语义绑定 | route adapter；不保存 URL/query string |
| `selectedEntry` | `LocalReference<'navigation-entry'>`（可选） | 当前入口 | 必须等于 selectedRoute.entryRef |
| `selectedTopic` | `LocalReference<'topic'>`（可选） | 当前主题 | 仅 topic target 存在，且等于 route.topicRef |
| `visibility` | `TopicVisibility`（可选） | 当前主题/入口安全姿态 | formal visibility result；topic 必须匹配 selectedTopic |
| `backEntries` | readonly entry refs | 安全返回历史 | 仅本 session；去重相邻重复；不携带 owner refs/body |

函数不变量：

- `selectNavigationEntry` 对 `topic` target 要求 matching visibility；`unknown/unavailable` 只能选择 minimal shell，不能保留 topic details。
- 任何 route/entry/topic mismatch 返回 `invalid-state-combination`；不得静默修正或按字符串匹配。
- `applyNavigationVisibility` 收到 restricted/disabled/unknown/unavailable 时清除所有依赖该 topic 的敏感下钻；不能把 visibility 用作认证证明。
- `clearSensitiveNavigation` 返回 `createEmptyNavigationState()` 等价值；不通知/修改 owner。

#### 10.15 `navigation` 模块停审

| 审查项 | 结论 | 后续缺口 |
|---|---|---|
| route/page 是否已到可落码粒度 | route semantic carrier 已闭口；framework URL/router/component binding defer | Step 7 host/router port、Step 14 config、实施 ADR |
| route 是否成为权限 | 否；选择仍需 context/visibility/activation | Step 9 flow 联合 guards |
| visibility 所有状态是否可构造 | 通过；unknown/unavailable 不强造 source | Step 7/8 exact formal schema |
| navigation 字段来源是否闭合 | 通过；route adapter+formal visibility+local session | Step 11 carrier lifecycle |
| 是否泄露受限对象存在性 | 当前契约禁止；unknown/unavailable 清理敏感 selection | Step 12 error/presentation 与 Step 16 tests |

Batch `6.2 = pass`。`access` 与 `navigation` 已逐模块停审；进入 `views` 批次前无需修改 `02` 主语。

<!-- STEP6_BATCH_6_3_START -->

### 11. Batch 6.3：`views` 对象实现契约

#### 11.1 `views` capability / 功能清单

| capability | 输入 | 输出 | 状态/副作用 | 所属对象 | 后续承接 |
|---|---|---|---|---|---|
| owner-safe result 映射 | formal adapter result、current context | `OwnerViewSnapshot` | 创建/替换可失效 client shadow；不写 owner | snapshot/status/ref objects | Step 7 query port；Step 8 DTO；Step 9 flow |
| 多轴保真 | owner status markers | `SourceStatusAxes` | 只读映射/本地收紧，轴不互相覆盖 | `SourceStatusAxes` | Step 8 schema；Step 10 状态说明 |
| view composition | 同一 context 下多个 owner snapshots | `OwnerViewModel` | immutable composition/filter | `OwnerViewModel` | Step 9 query flow |
| ref collection/redaction | formal safe refs | `ReferenceSet` | 去重、撤销、redaction | `ReferenceSet` | Step 7 safe-link/query ports |
| query no-write/coverage | query intent、axes | guard decision | 只拒绝/收紧，无业务写入 | `QueryNoWriteGuard`、`CoverageGuard` | Step 9/12 |
| client query history | query ref、phase、safe outcome | `QueryInteractionRecord` | 最小 client history；非 audit | `QueryInteractionRecord` | Step 11 retention；Step 15 diagnostic |

#### 11.2 `views` 功能到对象映射

| 对象 | 承接功能 | 类别 | 对象能力 | 不承接/禁止事项 |
|---|---|---|---|---|
| `SourceStatusAxes` | 来源五轴保真（owner+四状态轴） | owner-safe read mapping | 构造、收紧、display safety | 不本地提升、不合成 readiness |
| `VersionReference` | source version/observed time | reference | 版本等值/refresh hint | 不用本地时间伪造 owner version |
| `SourceReference` | owner query/object/version binding | reference | owner match | 不含正文 |
| `OwnerViewSnapshot` | 单次 safe query result | safe snapshot | presentable、mark stale/revoke | 不成为 current truth |
| `ReferenceSet` | safe reference collection | reference object | add/remove revoked/contains | 不当权限/幂等证明 |
| `OwnerViewModel` | owner-partitioned page consumption model | view model | compose/filter/drill-down intent | 不跨 owner 合成 truth |
| `QueryNoWriteGuard` | query effect restriction | guard | reject write/reconcile/replay effects | 不触发 refresh command |
| `CoverageGuard` | coverage requirement | guard | preserve partial/missing/not-covered | 不把 partial 当 complete |
| `QueryInteractionRecord` | 最小 query interaction history | client history | create/redact | 不冒充 audit/trace evidence |

#### 11.3 `SourceStatusAxes`

```ts
/** owner result 当前性；只能由 formal result 更新为更好状态。 */
export type FreshnessState = 'fresh' | 'stale' | 'expired' | 'unknown';

/** owner result 覆盖范围；missing 与正式空结果严格分离。 */
export type CoverageState = 'complete' | 'partial' | 'missing' | 'not-covered';

/** 单个 owner surface 的可访问姿态。 */
export type AvailabilityState = 'available' | 'degraded' | 'unavailable' | 'unknown';

/** 同一 owner result 内正式材料的一致性姿态。 */
export type ConsistencyState = 'coherent' | 'conflict' | 'unknown';

/** 保留 owner、freshness、coverage、availability、consistency 五个独立轴。 */
export interface SourceStatusAxes {
  readonly owner: OwnerKey;
  readonly freshness: FreshnessState;
  readonly coverage: CoverageState;
  readonly availability: AvailabilityState;
  readonly consistency: ConsistencyState;
}

/** 从 adapter 已验证的正式状态 markers 构造；不接受 UI 推断。 */
export declare function createSourceStatusAxes(
  axes: SourceStatusAxes,
): SourceStatusAxes;

/** 只向更保守的轴值收紧；不得提升任何轴。 */
export declare function tightenSourceStatusAxes(
  axes: SourceStatusAxes,
  constraint: Partial<Omit<SourceStatusAxes, 'owner'>>,
): ObjectConstructionResult<SourceStatusAxes>;

/** 判定是否可正常展示；不等于 owner health/readiness。 */
export declare function isSafeForNormalDisplay(
  axes: SourceStatusAxes,
): boolean;
```

状态语义与次序：

| 轴 | 最开放→最保守（仅用于 tightening） | 正常展示条件 | 备注 |
|---|---|---|---|
| freshness | `fresh > stale > expired > unknown` | 仅 `fresh` | stale 可在受限 view 中呈现，不算正常 |
| coverage | `complete > partial > missing`；`not-covered` 独立 | 仅 `complete` | `not-covered` 表示不适用，不与 missing 排序；跨分支 tightening 需 formal mapping |
| availability | `available > degraded > unavailable > unknown` | 仅 `available` | 只表示此 owner surface |
| consistency | `coherent > conflict > unknown` | 仅 `coherent` | conflict 不由 Console 择优 |

`isSafeForNormalDisplay` 仅在 `fresh+complete+available+coherent` 时为 true；false 不表示整体失败，调用方必须逐轴呈现。`tightenSourceStatusAxes` 遇到 owner 变化或 `not-covered` 与其它 coverage 无正式关系时拒绝。

#### 11.4 `VersionReference` 与 `SourceReference`

```ts
/** 绑定 owner 正式版本引用和其观察时间；时间不替代版本。 */
export interface VersionReference {
  readonly versionRef: OwnerReference<'version'>;
  readonly observedAtIso: string;
}

/** 将 view/snapshot 绑定到一个正式 owner query/object surface 及可选版本。 */
export interface SourceReference {
  readonly owner: OwnerKey;
  readonly subjectRef: OwnerReference<'object'> | OwnerReference<'query-surface'>;
  readonly version?: VersionReference;
}

/** 验证 RFC 3339 observation string 与 owner 对齐。 */
export declare function createVersionReference(
  versionRef: OwnerReference<'version'>,
  observedAtIso: string,
): ObjectConstructionResult<VersionReference>;

/** 验证 owner/object/version 同源。 */
export declare function createSourceReference(
  owner: OwnerKey,
  subjectRef: OwnerReference<'object'> | OwnerReference<'query-surface'>,
  version?: VersionReference,
): ObjectConstructionResult<SourceReference>;

/** 仅比较正式 version ref；无 version 时返回 true 以要求 refresh，而非猜测。 */
export declare function requiresSourceRefresh(
  source: SourceReference,
  latestVersionRef?: OwnerReference<'version'>,
): boolean;
```

| 字段 | 来源/约束 |
|---|---|
| `observedAtIso` | SDK/formal result metadata；必须是有效 RFC 3339 字符串；不得用本地 render time 伪造 |
| `version` | owner 支持安全 version ref 时存在；缺失必须通过 freshness/unknown 表达，不能生成 latest token |
| subject kind | 单对象查询可使用 `object`；列表/集合/聚合查询必须使用正式 `query-surface` ref，不得伪造对象 ref |
| owner relation | `owner`、subjectRef.owner、versionRef.owner 必须相同；否则 factory 拒绝 |

#### 11.5 `OwnerViewSnapshot`

```ts
/** 一次 owner-safe 查询结果的最小可失效快照；不是 owner projection/current truth。 */
export interface OwnerViewSnapshot {
  readonly snapshotRef: LocalReference<'snapshot'>;
  readonly contextRef: LocalReference<'context'>;
  readonly source: SourceReference;
  readonly status: SourceStatusAxes;
  readonly payload: SafeViewPayload;
  readonly references: SafeReferenceSet;
  readonly validity: ReferenceValidity;
}

/** 从 adapter 提供的完整 safe inputs 构造 snapshot。 */
export declare function createOwnerViewSnapshot(
  snapshotRef: LocalReference<'snapshot'>,
  contextRef: LocalReference<'context'>,
  source: SourceReference,
  status: SourceStatusAxes,
  payload: SafeViewPayload,
  references: SafeReferenceSet,
  validity: ReferenceValidity,
): ObjectConstructionResult<OwnerViewSnapshot>;

/** 判断 snapshot 是否能在当前 context 和 disclosure decision 下呈现。 */
export declare function isSnapshotPresentable(
  snapshot: OwnerViewSnapshot,
  context: AccessContext,
  disclosure: DisclosureDecision,
): boolean;

/** 仅收紧 freshness/validity，不更改 payload/source。 */
export declare function markSnapshotStale(
  snapshot: OwnerViewSnapshot,
): OwnerViewSnapshot;

/** 撤除 snapshot 的正常呈现资格；不删除 owner object。 */
export declare function revokeSnapshot(
  snapshot: OwnerViewSnapshot,
  reasonRef?: OwnerReference<'reason'>,
): OwnerViewSnapshot;
```

| 不变量 | 说明 |
|---|---|
| 同 owner | source.owner 必须等于 status.owner；所有 owner refs 必须匹配或属于明确本地 ref |
| current condition | validity=`current` 且 status freshness=`fresh` 时才能进入正常主线；其它组合可受限呈现或阻断 |
| context binding | snapshot 只可在相同 contextRef 下复用；context switch 必须 invalidated/清理 |
| payload/ref safety | payload 已有 RedactionMarker，references body-free；不得二次从 opaque ref 获取正文 |
| immutable stale/revoke | 函数返回新 value；不修改 source/payload，不把 reason body 写入 snapshot |

`reasonRef` 不进入当前对象字段，以避免 snapshot 同时承担诊断/history；若需保留失效原因，交 `InvalidationMarker`/`DiagnosticContext`。

#### 11.6 `ReferenceSet`

```ts
/** 将 safe refs 绑定到 owner scope 和 redaction 上限。 */
export interface ReferenceSet {
  readonly references: SafeReferenceSet;
  readonly ownerScopeRef: OwnerReference<'scope'>;
  readonly redaction: RedactionMarker;
}

/** 构造 owner-scoped safe reference set。 */
export declare function createReferenceSet(
  references: SafeReferenceSet,
  ownerScopeRef: OwnerReference<'scope'>,
  redaction: RedactionMarker,
): ObjectConstructionResult<ReferenceSet>;

/** 加入安全引用并重新执行确定性去重/排序。 */
export declare function addSafeReference(
  set: ReferenceSet,
  reference: SafeReference,
): ObjectConstructionResult<ReferenceSet>;

/** 移除 revoked/invalidated refs。 */
export declare function removeNonCurrentReferences(
  set: ReferenceSet,
): ReferenceSet;
```

集合只能含与 `ownerScopeRef.owner` 相同的 owner refs 或 local refs；跨 owner link 必须分别留在各 owner `ReferenceSet`，不得用一个 scope 合并。

#### 11.7 `OwnerViewModel`

```ts
/** owner-partitioned 页面消费模型；每个 snapshot 保持独立 source/status。 */
export interface OwnerViewModel {
  readonly viewRef: LocalReference<'view'>;
  readonly contextRef: LocalReference<'context'>;
  readonly owner: OwnerKey;
  readonly snapshots: readonly OwnerViewSnapshot[];
  readonly activeFilter?: FilterIntent;
  readonly page?: ClientPageWindow;
}

/** 只表达在已获准字段上的客户端筛选；不等同 owner Query DTO。 */
export interface FilterIntent {
  readonly fieldKey: NonEmptyOpaqueValue;
  readonly operator: 'equals' | 'contains' | 'starts-with';
  readonly value: SafeScalarValue;
}

/** 客户端当前页窗口；owner cursor/token 不在本对象中。 */
export interface ClientPageWindow {
  readonly visibleStart: number;
  readonly visibleCount: number;
}

/** 验证 context 一致、owner partition 和 deterministic snapshot order。 */
export declare function createOwnerViewModel(
  viewRef: LocalReference<'view'>,
  contextRef: LocalReference<'context'>,
  owner: OwnerKey,
  snapshots: readonly OwnerViewSnapshot[],
  activeFilter?: FilterIntent,
  page?: ClientPageWindow,
): ObjectConstructionResult<OwnerViewModel>;

/** 将一个 snapshot 追加/替换到对应 owner partition。 */
export declare function composeOwnerSnapshot(
  view: OwnerViewModel,
  snapshot: OwnerViewSnapshot,
): ObjectConstructionResult<OwnerViewModel>;

/** 只在现有 safe payload 上建立呈现 filter intent，不向 owner 写入。 */
export declare function applyClientFilter(
  view: OwnerViewModel,
  filter: FilterIntent,
): ObjectConstructionResult<OwnerViewModel>;

/** 生成 safe link navigation intent；不执行导航。 */
export declare function createDrillDownIntent(
  view: OwnerViewModel,
  link: SafeLinkReference,
): ObjectConstructionResult<SafeLinkNavigationIntent>;
```

`owner` 来自所选 formal query adapter，所有 snapshot 的 `source.owner/status.owner` 必须与其一致；空 snapshots 也仍保留 owner 分区，不能靠数组首项反推。`FilterIntent` 的 exact operator 集仅适用于本地 safe scalar 呈现；若 owner-side filtering/page 需要发送协议，Step 8 必须定义独立 DTO，不能复用/扩写此对象。snapshot 排序 canonical key 为 `source.subjectRef.kind + source.subjectRef.opaqueValue + snapshotRef.opaqueValue`；顺序不表达优先级。`ClientPageWindow.visibleStart/visibleCount` 必须是非负安全整数，窗口只作用于当前 owner 的 safe snapshots。

#### 11.8 `SafeLinkReference` 与 `SafeLinkNavigationIntent`

```ts
/** 正式安全 link target 的 body-free 引用。 */
export interface SafeLinkReference {
  readonly targetRef: OwnerReference<'link-target'>;
  readonly validity: ReferenceValidity;
}

/** 仅表达用户请求导航到安全 ref；目标方仍须重验。 */
export interface SafeLinkNavigationIntent {
  readonly link: SafeLinkReference;
  readonly sourceViewRef: LocalReference<'view'>;
  readonly contextRef: LocalReference<'context'>;
}
```

构造规则：只有 validity=`current` 的 link 可产生 navigation intent；不得携带 URL、token、owner private state 或 qualification proof。实际解析/打开由 Step 7 `SafeLinkPort` 承接，目标系统必须再次验证 context。

#### 11.9 `QueryEffectKind`、`QueryNoWriteGuard` 与 `CoverageGuard`

```ts
/** 客户端 query 计划中的效果分类。 */
export type QueryEffectKind =
  | 'read-safe-view'
  | 'local-filter'
  | 'local-page-window'
  | 'safe-link-intent'
  | 'owner-command'
  | 'result-reconciliation'
  | 'unknown-replay';

/** 描述一次 query intent 的 planned effects；不包含协议 body。 */
export interface QueryIntent {
  readonly queryRef: LocalReference<'query'>;
  readonly effects: readonly QueryEffectKind[];
}

/** 保证 query 不含业务写、reconciliation 或 replay。 */
export interface QueryNoWriteGuard {
  readonly prohibitedEffects: readonly Extract<
    QueryEffectKind,
    'owner-command' | 'result-reconciliation' | 'unknown-replay'
  >[];
}

/** 返回 violation 而非执行任何效果。 */
export declare function assertQueryReadOnly(
  guard: QueryNoWriteGuard,
  query: QueryIntent,
): ObjectConstructionResult<QueryIntent>;

/** 视图最低覆盖要求；只用于防止误报 complete。 */
export interface CoverageGuard {
  readonly required: 'complete' | 'at-least-partial';
}

/** 根据正式 coverage 返回是否满足；不改变 axes。 */
export declare function assertCoverage(
  guard: CoverageGuard,
  axes: SourceStatusAxes,
): ObjectConstructionResult<SourceStatusAxes>;
```

`QueryIntent.effects` 去重且按 union 定义顺序 canonicalize；包含任何 prohibited effect 即拒绝。`result-reconciliation` 是独立 Query API，但不能被普通 owner-safe Query 隐式触发。CoverageGuard 不把正式空结果与 missing 等同；empty 语义须由 Step 8 exact result carrier 明确提供。

#### 11.10 `QueryInteractionRecord`

```ts
/** 最小客户端 query 经历；不是 Observability audit 或正式 trace。 */
export interface QueryInteractionRecord {
  readonly queryRef: LocalReference<'query'>;
  readonly phase: 'started' | 'mapped' | 'presented' | 'degraded' | 'blocked';
  readonly outcome: 'safe-result' | 'partial' | 'unavailable' | 'conflict' | 'unknown';
  readonly owner?: OwnerKey;
  readonly diagnosticRef?: LocalReference<'diagnostic'>;
}

/** 从 body-free markers 构造最小记录。 */
export declare function createQueryInteractionRecord(
  record: QueryInteractionRecord,
): ObjectConstructionResult<QueryInteractionRecord>;
```

字段来源：queryRef 由 entry/flow 提供；phase/outcome 由 Step 9 flow 的明确分支提供；owner 来自 adapter selection；diagnosticRef 由 diagnostic factory 提供。禁止记录 query DTO、filter value、safe payload、owner error body、用户输入或 stack trace。retention/持久介质留 Step 11/04；没有 authority 时只允许 session memory。

#### 11.11 `views` 模块停审

| 审查项 | 结论 | 后续缺口/暂停条件 |
|---|---|---|
| owner-safe result 是否可构造到 snapshot/view | 通过（safe carrier 已闭口） | exact adapter result/empty/page schema 未闭口前不得实现 positive mapper |
| 多轴是否被压平 | 否；五个主语（owner+四轴）独立 | Step 10 明确轴非状态机 |
| Query 是否可能写入 | guard 显式拒绝 command/reconciliation/replay effect | Step 9 每条 flow 调用 guard；Step 16 验证 |
| ref/payload 是否 body-free | 通过 | safe-field contract 缺失时必须 blocked/minimal，不可使用 raw body |
| filter/page 是否越成协议 | 否；明确为 client-only carrier | owner-side DTO 留 Step 8 |
| history 是否成为 audit | 否；字段最小且无正文 | Step 15 仅安全 diagnostic mapping |

Batch `6.3 = pass`。`views` capability、对象、字段来源、函数、不变量和状态轴已停审；进入 `intent` 批次。

<!-- STEP6_BATCH_6_4_START -->

### 12. Batch 6.4：`intent` 对象实现契约

#### 12.1 `intent` capability / 功能清单

| capability | 输入 | 输出 | 状态/副作用 | 所属对象 | 后续承接 |
|---|---|---|---|---|---|
| local draft edit/validation | safe target、client draft fields、validation issues | `DraftIntent` | 只变更本地 draft | `DraftIntent` | Step 9 draft flow；Step 11 carrier |
| submission review | draft、current context、visibility、command surface | reviewable/blocked decision | 无 owner 写入 | `SubmissionEligibilityGuard` | Step 7 qualification/command ports；Step 9 |
| request attempt presentation | command attempt/receipt/formal result | `RequestPresentation` | 只变更 client request phase | `RequestPresentation` | Step 8 result schema；Step 9 flow；Step 10 matrix |
| formal result reference | formal result/reconciliation ref | `ResultReference` | 只读映射 | `ResultReference` | Step 7 reconciliation port；Step 8 schema |
| completion/unknown protection | request/result/formal basis | guard decision | 阻断伪完成/自动 replay | `CompletionGuard`、`UnknownReplayGuard` | Step 9/12/13 |
| submission attempt history | request/attempt phase/safe outcome | `SubmissionAttemptPresentation` | 最小 client history；非 audit | history object | Step 11/15 |

#### 12.2 `intent` 功能到对象映射

| 对象 | 承接功能 | 类别 | 对象能力 | 不承接/禁止事项 |
|---|---|---|---|---|
| `ClientDraftValue`/`ClientDraftFields` | safe draft carrier | local value | exact scalar/ref schema、deterministic field map | 不等于 owner DTO，不含 forbidden body |
| `DraftIntent` | local draft truth | interaction truth | create/edit/validate/review/discard/mark submitted | 不执行 owner validation/command |
| `CommandReference` | 正式 command surface 回指 | owner-safe ref | current/open surface check | 不表示 command 已调用/完成 |
| `ReceiptReference` | owner receipt 回指 | owner-safe ref | accepted observation | 不等于 committed/confirmed |
| `ResultReference` | owner result state/ref | owner-safe mapping | terminal/reconciliation predicates | 不本地生成 result state |
| `RequestPresentation` | request interaction lifecycle | interaction state | submitted/receipt/pending/result/unknown | 不成为 owner job/approval state |
| `SubmissionEligibilityGuard` | submit precondition | guard | context/visibility/command/draft check | 不替代 Policy/Gate |
| `CompletionGuard` | terminal proof | guard | 接受 formal result terminal | 不接受 toast/transport/cache |
| `UnknownReplayGuard` | replay safety | guard | 仅正式 reconciliation/idempotency basis 时允许交给后续策略 | 不生成幂等 key |
| `SubmissionAttemptPresentation` | client history | history | minimal phase/outcome | 非 audit/evidence |

#### 12.3 `ClientDraftValue` 与 `ClientDraftFields`

```ts
/** 允许进入本地 draft 的值；比 SafeViewPayload 多一个显式 user text 分支。 */
export type ClientDraftValue =
  | Readonly<{ kind: 'user-text'; value: string }>
  | Readonly<{ kind: 'number'; value: number }>
  | Readonly<{ kind: 'boolean'; value: boolean }>
  | Readonly<{ kind: 'reference'; value: SafeReference }>;

/** 一个 draft field；field key 必须由正式 command surface/profile 提供。 */
export interface ClientDraftField {
  readonly fieldKey: NonEmptyOpaqueValue;
  readonly value: ClientDraftValue;
}

/** 确定性 draft field map；不是 owner command DTO。 */
export interface ClientDraftFields {
  readonly fields: readonly ClientDraftField[];
  readonly safeFieldSetRef?: OwnerReference<'safe-field-set'>;
}

/** 校验字段唯一、值安全和 allowlist 来源。 */
export declare function createClientDraftFields(
  fields: readonly ClientDraftField[],
  safeFieldSetRef?: OwnerReference<'safe-field-set'>,
): ObjectConstructionResult<ClientDraftFields>;
```

| 规则 | 契约 |
|---|---|
| user text | 允许本地未提交用户输入；不能自动进入日志、诊断、URL、safe view 或 cache export |
| field key | 必须来自 owner/SDK 正式 command surface/profile；无 safe-field/command field contract 时只能保存明确允许的 Console preference，不得建立 owner draft positive path |
| deterministic | 按 fieldKey 排序、key 唯一；patch 替换同 key，不保留重复值 |
| forbidden | credential、secret、auth token、governance rationale/evidence body、raw file/binary、HTML/script、owner hidden payload |
| protocol mapping | Step 8 必须逐字段映射到 exact owner DTO；不得把 `ClientDraftFields` 作为 generic JSON 直接发送 |

#### 12.4 `DraftValidationIssue` 与 `DraftIntent`

```ts
/** 只表达客户端格式/需求级检查问题；不冒充 owner validation。 */
export type DraftValidationIssue = Readonly<{
  kind: 'required' | 'invalid-format' | 'unsafe-value' | 'stale-context' | 'unsupported-field';
  fieldKey?: NonEmptyOpaqueValue;
}>;

/** 本地 draft lifecycle。 */
export type DraftState = 'editing' | 'invalid' | 'reviewable' | 'submitted' | 'discarded';

/** Console-owned 未提交意图；状态特定字段用 discriminated union 闭口。 */
export type DraftIntent =
  | Readonly<{
      draftRef: LocalReference<'draft'>;
      targetRef: SafeReference;
      contextRef: LocalReference<'context'>;
      fields: ClientDraftFields;
      state: 'editing';
    }>
  | Readonly<{
      draftRef: LocalReference<'draft'>;
      targetRef: SafeReference;
      contextRef: LocalReference<'context'>;
      fields: ClientDraftFields;
      state: 'invalid';
      issues: readonly DraftValidationIssue[];
    }>
  | Readonly<{
      draftRef: LocalReference<'draft'>;
      targetRef: SafeReference;
      contextRef: LocalReference<'context'>;
      fields: ClientDraftFields;
      state: 'reviewable';
    }>
  | Readonly<{
      draftRef: LocalReference<'draft'>;
      targetRef: SafeReference;
      contextRef: LocalReference<'context'>;
      fields: ClientDraftFields;
      state: 'submitted';
      requestRef: LocalReference<'request'>;
    }>
  | Readonly<{
      draftRef: LocalReference<'draft'>;
      targetRef: SafeReference;
      contextRef: LocalReference<'context'>;
      fields: ClientDraftFields;
      state: 'discarded';
    }>;
```

| 状态 | JSDoc 语义 | 允许来源 | 允许去向 |
|---|---|---|---|
| `editing` | 用户正在编辑本地意图 | factory、invalid 修正 | invalid/reviewable/discarded |
| `invalid` | client-only checks 失败 | validate | editing/invalid/reviewable/discarded |
| `reviewable` | 可进入提交前复核；不等于 owner-valid/authorized | validate 无 issues | editing/invalid/submitted/discarded |
| `submitted` | 已关联一次 request attempt | formal command seam 已调用并创建 request presentation | 本对象保持 submitted；后续结果在 RequestPresentation |
| `discarded` | 用户放弃或安全清理 | explicit discard/context cleanup | 终止；不得复活提交 |

```ts
/** 创建 editing draft；所有 ref/fields 由调用方显式提供。 */
export declare function createDraftIntent(
  draftRef: LocalReference<'draft'>,
  targetRef: SafeReference,
  contextRef: LocalReference<'context'>,
  fields: ClientDraftFields,
): ObjectConstructionResult<DraftIntent>;

/** 应用 deterministic patch，返回 editing draft。 */
export declare function editDraftIntent(
  draft: Exclude<DraftIntent, {state: 'submitted' | 'discarded'}>,
  patch: ClientDraftFields,
): ObjectConstructionResult<DraftIntent>;

/** 应用 client validation issues；不调用 owner validation。 */
export declare function applyDraftValidation(
  draft: Extract<DraftIntent, {state: 'editing' | 'invalid' | 'reviewable'}>,
  issues: readonly DraftValidationIssue[],
): DraftIntent;

/** 关联正式 command attempt 的本地 request ref。 */
export declare function markDraftSubmitted(
  draft: Extract<DraftIntent, {state: 'reviewable'}>,
  requestRef: LocalReference<'request'>,
): DraftIntent;

/** 安全清理 draft；不向 owner 发出删除/撤销。 */
export declare function discardDraftIntent(
  draft: Exclude<DraftIntent, {state: 'submitted' | 'discarded'}>,
): DraftIntent;
```

factory 完整性：所有分支均拥有 draftRef/target/context/fields；invalid 强制 non-empty issues，submitted 强制 requestRef。`discarded` 的 fields 是否物理清除属于 Step 11 carrier/retention；逻辑上不得再呈现或提交。

#### 12.5 `CommandReference`、`ReceiptReference` 与 `ResultReference`

```ts
/** 指向 owner 正式 command surface；只表示 surface 当前开放姿态。 */
export interface CommandReference {
  readonly commandRef: OwnerReference<'command-surface'>;
  readonly validity: ReferenceValidity;
}

/** 指向 owner 正式受理 receipt；不表示业务完成。 */
export interface ReceiptReference {
  readonly receiptRef: OwnerReference<'receipt'>;
  readonly acceptedAtIso?: string;
}

/** owner 正式结果的只读状态映射。 */
export type OwnerResultState = 'pending' | 'confirmed' | 'rejected' | 'unknown';

/** 指向正式 result/reconciliation，并保持 owner result state。 */
export interface ResultReference {
  readonly resultRef: OwnerReference<'result'>;
  readonly state: OwnerResultState;
  readonly observedAtIso: string;
  readonly reconciliationRef?: OwnerReference<'reconciliation'>;
}
```

```ts
/** 校验 receipt 时间（若有）来自 owner metadata。 */
export declare function createReceiptReference(
  receiptRef: OwnerReference<'receipt'>,
  acceptedAtIso?: string,
): ObjectConstructionResult<ReceiptReference>;

/** 只从 formal adapter mapper 输出构造 result reference。 */
export declare function createResultReference(
  resultRef: OwnerReference<'result'>,
  state: OwnerResultState,
  observedAtIso: string,
  reconciliationRef?: OwnerReference<'reconciliation'>,
): ObjectConstructionResult<ResultReference>;

/** 只有 confirmed/rejected 是 formal terminal。 */
export declare function isFormalTerminalResult(
  result: ResultReference,
): boolean;

/** pending/unknown 且有 formal reconciliation ref 时返回 true。 */
export declare function requiresFormalReconciliation(
  result: ResultReference,
): boolean;
```

| 对象 | 字段来源 | 关键不变量 |
|---|---|---|
| `CommandReference` | owner contract/activation mapper | validity 不是 current 时不能提交；surface ref 不表示资格 |
| `ReceiptReference` | formal command receipt | acceptedAt 若无正式值则省略，不用 local time；receipt 不等于 result |
| `ResultReference` | formal result/reconciliation Query | result/ref/state/observedAt 同 owner observation；state 不由 Console 推进 |

若 owner exact result taxonomy 无法映射为四种安全上限，adapter 必须映射为 `unknown` 或拒绝；不能增加本地“success-ish”状态。

#### 12.6 `RequestPresentation`

```ts
/** Console-owned request phase；confirmed/rejected 仅呈现 owner formal terminal。 */
export type RequestPhase =
  | 'submitted'
  | 'accepted'
  | 'pending'
  | 'confirmed'
  | 'rejected'
  | 'unknown';

/** request interaction state，按 phase 约束 receipt/result 必填性。 */
export type RequestPresentation =
  | Readonly<{
      requestRef: LocalReference<'request'>;
      draftRef: LocalReference<'draft'>;
      attemptRef: LocalReference<'command-attempt'>;
      contextRef: LocalReference<'context'>;
      command: CommandReference;
      phase: 'submitted';
    }>
  | Readonly<{
      requestRef: LocalReference<'request'>;
      draftRef: LocalReference<'draft'>;
      attemptRef: LocalReference<'command-attempt'>;
      contextRef: LocalReference<'context'>;
      command: CommandReference;
      phase: 'accepted';
      receipt: ReceiptReference;
    }>
  | Readonly<{
      requestRef: LocalReference<'request'>;
      draftRef: LocalReference<'draft'>;
      attemptRef: LocalReference<'command-attempt'>;
      contextRef: LocalReference<'context'>;
      command: CommandReference;
      phase: 'pending';
      receipt?: ReceiptReference;
      result: ResultReference & {readonly state: 'pending'};
    }>
  | Readonly<{
      requestRef: LocalReference<'request'>;
      draftRef: LocalReference<'draft'>;
      attemptRef: LocalReference<'command-attempt'>;
      contextRef: LocalReference<'context'>;
      command: CommandReference;
      phase: 'confirmed' | 'rejected';
      receipt?: ReceiptReference;
      result: ResultReference & {readonly state: 'confirmed' | 'rejected'};
    }>
  | Readonly<{
      requestRef: LocalReference<'request'>;
      draftRef: LocalReference<'draft'>;
      attemptRef: LocalReference<'command-attempt'>;
      contextRef: LocalReference<'context'>;
      command: CommandReference;
      phase: 'unknown';
      receipt?: ReceiptReference;
      result?: ResultReference & {readonly state: 'unknown'};
      reconciliationRef?: OwnerReference<'reconciliation'>;
    }>;
```

```ts
/** 创建提交尝试呈现；不表示 owner 已收到。 */
export declare function createSubmittedRequest(
  requestRef: LocalReference<'request'>,
  draftRef: LocalReference<'draft'>,
  attemptRef: LocalReference<'command-attempt'>,
  contextRef: LocalReference<'context'>,
  command: CommandReference,
): RequestPresentation;

/** 应用 formal receipt；只进入 accepted。 */
export declare function applyFormalReceipt(
  request: Extract<RequestPresentation, {phase: 'submitted' | 'unknown'}>,
  receipt: ReceiptReference,
): RequestPresentation;

/** 应用 formal result；按 result state 进入 pending/confirmed/rejected/unknown。 */
export declare function applyFormalResult(
  request: RequestPresentation,
  result: ResultReference,
): ObjectConstructionResult<RequestPresentation>;

/** transport ambiguity 或缺正式结果时进入 unknown；不重放。 */
export declare function markRequestUnknown(
  request: RequestPresentation,
  reconciliationRef?: OwnerReference<'reconciliation'>,
): RequestPresentation;
```

状态迁移边界：submitted→accepted/pending/confirmed/rejected/unknown；accepted→pending/confirmed/rejected/unknown；pending→confirmed/rejected/unknown；unknown→pending/confirmed/rejected/unknown 仅通过 formal reconciliation。terminal confirmed/rejected 不被本对象重新打开；若 owner 提供正式纠正结果，须由 Step 8/10 定义新的 observation/替代引用，而非静默改旧 presentation。

`contextRef` 从被提交的 `DraftIntent.contextRef` 复制，`command` 来自同一次 eligibility observation；所有后续 receipt/result/reconciliation mapper 必须保持 request/context/command owner 关系一致。`RequestPresentation` 只保存 command surface 的 opaque ref，不保存 command DTO、receipt/result body 或幂等材料；context 失效时由 `state`/`recovery` 收紧或清理，而不是在本对象内重新验证 owner。

#### 12.7 `SubmissionEligibilityGuard`

```ts
/** features 对正式前置作同源检查后的最小观察；不是 owner authorization。 */
export type DelegationQualificationObservation =
  | Readonly<{
      posture: 'qualified';
      contextRef: LocalReference<'context'>;
      topicRef: LocalReference<'topic'>;
      owner: OwnerKey;
      command: CommandReference;
      capabilityRef: OwnerReference<'capability'>;
    }>
  | Readonly<{
      posture: 'blocked';
      contextRef?: LocalReference<'context'>;
      reason: 'context' | 'visibility' | 'command-surface' | 'activation';
      reasonRef?: OwnerReference<'reason'>;
    }>;

/** 提交前的本地安全检查输出；只允许进入正式 command 委托。 */
export type SubmissionEligibility =
  | Readonly<{
      posture: 'eligible-for-delegation';
      contextRef: LocalReference<'context'>;
      command: CommandReference;
    }>
  | Readonly<{
      posture: 'blocked';
      reason: 'context' | 'visibility' | 'draft' | 'command-surface' | 'activation';
      reasonRef?: OwnerReference<'reason'>;
    }>;

/** 核验所有已获得的正式前置；缺一即 blocked。 */
export declare function checkSubmissionEligibility(
  draft: DraftIntent,
  qualification: DelegationQualificationObservation,
): SubmissionEligibility;
```

`features.evaluateDelegationQualification` 只有在 context.verified、visibility.visible、command.validity.current、activation.active、controlled-command 且 topic/owner/capability/context refs 同源时才可产生 `qualified`。本 guard 再要求 draft.reviewable、draft target current 且 draft.contextRef 等于 qualification.contextRef，才返回 `eligible-for-delegation`。这样 `intent` 不反向 import `navigation/features`，同时所有正式前置仍有 exact typed source。输出只允许调用 Step 7 OwnerCommandPort；不表示 owner 会接受，也不替代 Policy/Gate/业务 validation。

#### 12.8 `CompletionGuard` 与 `UnknownReplayGuard`

```ts
/** 证明 request presentation 是否有 owner formal terminal 支撑。 */
export declare function assertFormalCompletion(
  request: RequestPresentation,
): ObjectConstructionResult<Extract<RequestPresentation, {phase: 'confirmed' | 'rejected'}>>;

/** unknown 后允许的下一步种类；默认只有 reconcile/wait/exit。 */
export type UnknownNextAction = 'reconcile' | 'wait' | 'exit' | 'retry-command';

/** retry-command 所需的 owner-owned formal basis。 */
export interface FormalReplayBasis {
  readonly reconciliationRef: OwnerReference<'reconciliation'>;
  readonly idempotencyRef: OwnerReference<'idempotency'>;
}

/** unknown 请求的 replay guard；无完整 formal basis 时拒绝 retry-command。 */
export declare function checkUnknownNextAction(
  request: Extract<RequestPresentation, {phase: 'unknown'}>,
  action: UnknownNextAction,
  basis?: FormalReplayBasis,
): ObjectConstructionResult<UnknownNextAction>;
```

`assertFormalCompletion` 必须验证 phase 与 result.state 精确一致且 result formal terminal。`checkUnknownNextAction` 对 reconcile/wait/exit 可按 recovery plan 继续；retry-command 只有 owner exact contract 明确 formal reconciliation + idempotency ref 语义时才可能通过。Console 不生成 key/ref，不以 requestRef、attemptRef、时间戳或 draft digest 替代。

#### 12.9 `SubmissionAttemptPresentation`

```ts
/** 最小提交尝试经历；不保存 command/draft body，不构成业务 audit。 */
export interface SubmissionAttemptPresentation {
  readonly requestRef: LocalReference<'request'>;
  readonly attemptRef: LocalReference<'command-attempt'>;
  readonly phase: RequestPhase;
  readonly outcome: 'delegated' | 'receipt-observed' | 'formal-result-observed' | 'ambiguous' | 'blocked';
  readonly diagnosticRef?: LocalReference<'diagnostic'>;
}

/** 从 RequestPresentation 的当前分支构造最小 history。 */
export declare function createSubmissionAttemptPresentation(
  request: RequestPresentation,
  outcome: SubmissionAttemptPresentation['outcome'],
  diagnosticRef?: LocalReference<'diagnostic'>,
): ObjectConstructionResult<SubmissionAttemptPresentation>;
```

phase/outcome 对应规则由 factory 验证：submitted→delegated，accepted→receipt-observed，pending/confirmed/rejected→formal-result-observed，unknown→ambiguous；blocked 不可从已发出 request 推断，留给 pre-submit diagnostic/history seam。不得记录 fields、receipt/result body、error message、credential、idempotency material。

#### 12.10 `intent` 模块停审

| 审查项 | 结论 | 后续缺口/实现暂停条件 |
|---|---|---|
| draft field 是否 exact client shape | 通过；安全 discriminated values、unique fieldKey | owner command field contract 未闭口前不得建立 generic positive mapping |
| 每个 Draft/Request 状态是否字段完整 | 通过；discriminated union 强制 issues/request/receipt/result 分支 | Step 10 展开完整转换矩阵 |
| receipt/result 是否混同 | 否；独立类型和状态分支 | Step 8 exact DTO/result taxonomy |
| unknown 是否自动 replay | 否；formal basis 双 ref 才可讨论 retry | Step 7/8/13 exact idempotency/reconciliation contract |
| 本地 guard 是否越权 | 否；仅 eligible-for-delegation | owner 仍执行正式 auth/Policy/Gate/validation |
| history 是否保存正文 | 否 | Step 11 retention、Step 15 diagnostic mapping |

Batch `6.4 = pass`。`intent` 的 draft/request/result/ref/guard/history 已达到可由 Step 7 ports 与 Step 8 protocols 承接的粒度；进入 `features` 批次。

<!-- STEP6_BATCH_6_5_START -->

### 13. Batch 6.5：`features` 与页面/语义组件对象契约

#### 13.1 `features` capability / 功能清单

| capability | 输入 | 输出 | 状态/副作用 | 所属对象 | 后续承接 |
|---|---|---|---|---|---|
| topic catalog | 已确认八类主题、owner mapping、本地 refs | `TopicDescriptorSet` | immutable local catalog | `ManagementTopicKey`、`TopicDescriptor` | Step 14 route/config binding |
| owner capability activation | formal contract facets、current context | `TopicActivationState` | 只表达消费 posture/收紧 | `OwnerCapabilityReference`、`OwnerContractObservation`、`evaluateOwnerActivation` | Step 7 activation/query port；Step 8 DTO |
| topic view composition | topic/visibility/activation/owner views/links/actions | `TopicViewModel` | immutable composition；不写 owner | `TopicViewModel` | Step 9 flow |
| page/route/component semantics | route binding、topic view、status/action/recovery regions | `TopicPageModel` | 本地呈现模型 | `SemanticRegionModel`、`TopicPageModel` | Step 7 host adapter；Step 9 flow；framework ADR |
| owner/topic boundary | topic descriptor、owner view/capability | guard result | 拒绝跨 topic/owner 错配 | `TopicBoundaryGuard` | Step 9/12 |
| conditional action entry | visibility、activation、command ref | `ActionEntryModel` | 只显示入口；不提交 | action model | Step 9 submit flow |

#### 13.2 八类主题与 owner mapping

```ts
/** Console 当前正式支持的管理主题；新增变体必须回退需求/概要边界。 */
export type ManagementTopicKey =
  | 'member-management'
  | 'project-workspace'
  | 'method-assets'
  | 'governance-controls'
  | 'observability'
  | 'capability-hub'
  | 'archive'
  | 'sandbox';

/** 一个主题的静态本地描述；不声明 owner surface 已激活。 */
export interface TopicDescriptor {
  readonly topicRef: LocalReference<'topic'>;
  readonly key: ManagementTopicKey;
  readonly owners: readonly OwnerKey[];
}

/** 确定性主题目录；按 ManagementTopicKey 的正式顺序排列。 */
export interface TopicDescriptorSet {
  readonly topics: readonly TopicDescriptor[];
}
```

| topic key | owner 集（canonical order） | 当前正向姿态上限 | 禁止事项 |
|---|---|---|---|
| `member-management` | `identity`、`member-service` | pending；合同成立可 read-only/partial | 不维护成员生命周期/角色继承 |
| `project-workspace` | `work`、`process`、`workspace` | pending/partial | 不生成进度、workspace projection/cursor/rebuild |
| `method-assets` | `method-library` | pending；浏览可 read-only | 不维护方法 registry truth |
| `governance-controls` | `governance`、`artifact` | pending/read-only | 不生成 Gate/Decision/SoA/AIIA/Control/evidence truth |
| `observability` | `observability` | pending/read-only | 不生成 audit/metric/report truth |
| `capability-hub` | `capability-hub` | pending/blocked | 不注册能力或推导 readiness |
| `archive` | `archive` | pending/blocked | 不执行 archive/recovery/handoff |
| `sandbox` | `sandbox` | pending/blocked | 不执行 sandbox/推导运行 readiness |

```ts
/** 验证八类 key 唯一、owner exact mapping 与稳定顺序。 */
export declare function createTopicDescriptorSet(
  topics: readonly TopicDescriptor[],
): ObjectConstructionResult<TopicDescriptorSet>;
```

`TopicDescriptor.topicRef` 由 Step 7 local ref seam 提供；不得把 `ManagementTopicKey` 或 route 字符串直接强转为 ref。owner 集必须精确等于上表，不允许用配置增加 owner；配置只能隐藏/收紧，不得改 truth mapping。

#### 13.3 `OwnerCapabilityReference`

```ts
/** Console 对 capability 的消费模式；来自 owner contract，不由 Console 猜测。 */
export type CapabilityConsumptionMode = 'read-only' | 'controlled-command';

/** 回指 owner 正式 capability 及 activation observation。 */
export interface OwnerCapabilityReference {
  readonly capabilityRef: OwnerReference<'capability'>;
  readonly mode: CapabilityConsumptionMode;
  readonly validity: ReferenceValidity;
  readonly activationRef?: OwnerReference<'activation'>;
}

/** 从 formal contract/activation metadata 构造 capability reference。 */
export declare function createOwnerCapabilityReference(
  capabilityRef: OwnerReference<'capability'>,
  mode: CapabilityConsumptionMode,
  validity: ReferenceValidity,
  activationRef?: OwnerReference<'activation'>,
): ObjectConstructionResult<OwnerCapabilityReference>;
```

| 字段 | 来源 | 不变量 |
|---|---|---|
| `capabilityRef` | owner/SDK formal surface | owner 明确；不从方法名/route/feature flag 推导 |
| `mode` | owner contract metadata | `read-only` 不得出现 command action；`controlled-command` 仍需 formal qualification/result semantics |
| `validity` | formal result/invalidation | 非 current 不能 positive activate |
| `activationRef` | 正式 activation metadata（若提供） | 缺失时不能靠计划/mock/page existence 补造 active |

此对象不证明 capability readiness、测试通过或运行可用；只提供 Console consumption assessment 的正式引用输入。

#### 13.4 `OwnerContractObservation` 与 `TopicActivationState`

```ts
/** 一个正式消费前置 facet 的安全结论；不携带合同正文。 */
export type ContractFacetStatus =
  | 'satisfied'
  | 'partial'
  | 'missing'
  | 'unknown'
  | 'not-applicable';

/** activation guard 所需的 body-free formal facets。 */
export interface OwnerContractObservation {
  readonly capability: OwnerCapabilityReference;
  readonly readSurface: ContractFacetStatus;
  readonly safeFieldContract: ContractFacetStatus;
  readonly visibilityQualification: ContractFacetStatus;
  readonly commandSurface: ContractFacetStatus;
  readonly resultSemantics: ContractFacetStatus;
  readonly reconciliation: ContractFacetStatus;
}

/** capability-level Console consumption posture；不是 topic/owner readiness。 */
export type TopicActivationPosture = 'pending' | 'read-only' | 'partial' | 'active' | 'blocked';

/** 每个 owner capability 独立维护 activation posture；正向姿态强制携带 capability。 */
export type TopicActivationState =
  | Readonly<{
      topicRef: LocalReference<'topic'>;
      owner: OwnerKey;
      capability: OwnerCapabilityReference;
      posture: 'read-only' | 'partial' | 'active';
      reasonRef?: OwnerReference<'reason'>;
    }>
  | Readonly<{
      topicRef: LocalReference<'topic'>;
      owner: OwnerKey;
      capability?: OwnerCapabilityReference;
      posture: 'pending' | 'blocked';
      reasonRef?: OwnerReference<'reason'>;
    }>;
```

```ts
/** 从 formal observation 计算最开放不超过正式输入的消费 posture。 */
export declare function evaluateOwnerActivation(
  topic: TopicDescriptor,
  observation: OwnerContractObservation | undefined,
  context: AccessContext,
  reasonRef?: OwnerReference<'reason'>,
): ObjectConstructionResult<TopicActivationState>;

/** 只允许本地向 partial/blocked/pending 收紧。 */
export declare function tightenTopicActivation(
  activation: TopicActivationState,
  posture: 'partial' | 'blocked' | 'pending',
  reasonRef?: OwnerReference<'reason'>,
): TopicActivationState;
```

确定性评估矩阵：

| 条件 | posture | 说明 |
|---|---|---|
| observation 缺失、capability invalid/unknown、context 非 verified/restricted | `pending` 或 `blocked` | 无 formal surface 时 pending；正式前置失败时 blocked |
| 任一必需 facet=`unknown/missing` | `blocked` | exact reason 只有 owner ref 时呈现 |
| 任一必需 facet=`partial` | `partial` | 不由其它 satisfied facet覆盖 |
| mode=`read-only` 且 read/safe-field/visibility=`satisfied`，command/result/reconcile=`not-applicable` | `read-only` | 完整且诚实的只读闭环 |
| mode=`controlled-command` 且六个 facet 全部=`satisfied`、context verified | `active` | 仅表示此 capability 的 Console 消费面可判别 |
| mode 与 facet 组合不一致 | construction violation | 不 silent fallback |

`restricted` context 最多得到 read-only/partial，不能得到 active。当前 exact contracts 大多 pending，因此对象可落码，positive `active` mapper 仍按 owner 阻塞；不得用 fake observation 在 production 注册表中激活。

#### 13.5 `TopicBoundaryGuard`

```ts
/** 验证 owner view/capability 是否属于指定 topic；不验证 owner 业务内容。 */
export declare function assertTopicOwnerBoundary(
  topic: TopicDescriptor,
  owner: OwnerKey,
): ObjectConstructionResult<OwnerKey>;

/** 验证 activation 与 topic/capability/owner 引用一致。 */
export declare function assertActivationBoundary(
  topic: TopicDescriptor,
  activation: TopicActivationState,
): ObjectConstructionResult<TopicActivationState>;

/** 对 context/visibility/command/activation 做同源、只收紧的委托前置检查。 */
export declare function evaluateDelegationQualification(
  context: AccessContext,
  visibility: TopicVisibility,
  command: CommandReference,
  activation: TopicActivationState,
): DelegationQualificationObservation;
```

guard 只使用 `TopicDescriptor.owners`、ref.owner 和 topicRef exact equality；禁止解析 opaque refs、页面名、SDK method string 或 payload 来决定归属。

#### 13.6 `ActionEntryModel`

```ts
/** 页面可呈现的条件化动作入口；不表示 command 已受理或执行。 */
export interface ActionEntryModel {
  readonly entryRef: LocalReference<'navigation-entry'>;
  readonly presentationKey: NonEmptyOpaqueValue;
  readonly command: CommandReference;
  readonly capability: OwnerCapabilityReference;
  readonly posture: 'enabled' | 'disabled' | 'hidden';
  readonly reasonRef?: OwnerReference<'reason'>;
}

/** 依据 visibility+activation+command validity 创建动作入口。 */
export declare function createActionEntryModel(
  entryRef: LocalReference<'navigation-entry'>,
  presentationKey: NonEmptyOpaqueValue,
  command: CommandReference,
  capability: OwnerCapabilityReference,
  visibility: TopicVisibility,
  activation: TopicActivationState,
  reasonRef?: OwnerReference<'reason'>,
): ObjectConstructionResult<ActionEntryModel>;
```

只有 visibility.visible + activation.active + controlled-command + command.current 且 owner/capability/topic 一致时 posture=`enabled`；restricted/disabled/read-only/partial→`disabled` 或最小披露要求下 `hidden`；unknown/unavailable/pending/blocked→`hidden`。`presentationKey` 是本地 localization/semantic key，不是用户输入或 owner label；实际文案/locale binding 留配置/实现 ADR。

#### 13.7 `SemanticRegionModel`

```ts
/** framework-neutral 的页面语义区域；是组件契约，不是具体框架组件。 */
export type SemanticRegionKind =
  | 'context'
  | 'summary'
  | 'source-status'
  | 'collection'
  | 'details'
  | 'actions'
  | 'recovery';

/** 页面区域的可访问/显示姿态。 */
export interface SemanticRegionModel {
  readonly regionKey: NonEmptyOpaqueValue;
  readonly kind: SemanticRegionKind;
  readonly headingKey: NonEmptyOpaqueValue;
  readonly posture: 'visible' | 'minimal' | 'hidden';
  readonly labelledByKey: NonEmptyOpaqueValue;
  readonly describedByKey?: NonEmptyOpaqueValue;
  readonly owner?: OwnerKey;
  readonly viewRef?: LocalReference<'view'>;
}

/** 验证 region 必填可访问关联和 owner/view 组合。 */
export declare function createSemanticRegionModel(
  region: SemanticRegionModel,
): ObjectConstructionResult<SemanticRegionModel>;

/** 页面可访问语义绑定；视觉、键盘和辅助技术共用同一 actionKey。 */
export interface PageAccessibilityBinding {
  readonly focusRegionKey: NonEmptyOpaqueValue;
  readonly actionKey: NonEmptyOpaqueValue;
  readonly channel: 'visual' | 'keyboard' | 'assistive-technology';
  readonly triggerKey: NonEmptyOpaqueValue;
}
```

| 字段/组合 | 规则 |
|---|---|
| `regionKey` | 页面内唯一；由本地静态 page contract 提供，不从 owner object ref 拼接 |
| heading/label/description key | 是 localization/ARIA binding key，不是已渲染文本；不得携带正文 |
| owner/view | source-status/collection/details 可绑定 owner+viewRef，必须成对或按 page contract 明确；actions/context/recovery 不要求 owner |
| posture | visibility/activation/degradation 只能收紧；hidden region 不保留可聚焦 action |
| semantics | 键盘/读屏/非颜色路径与视觉区域使用同一 model；不能创建第二业务动作 |

#### 13.8 `TopicViewModel`

```ts
/** 单一管理主题的 owner-partitioned view；不合成统一 truth/readiness。 */
export interface TopicViewModel {
  readonly topic: TopicDescriptor;
  readonly contextRef: LocalReference<'context'>;
  readonly visibility: TopicVisibility;
  readonly activations: readonly TopicActivationState[];
  readonly ownerViews: readonly OwnerViewModel[];
  readonly actions: readonly ActionEntryModel[];
  readonly links: readonly SafeLinkReference[];
}

/** 验证 topic/owner/context/activation 边界并稳定排序。 */
export declare function createTopicViewModel(
  model: TopicViewModel,
): ObjectConstructionResult<TopicViewModel>;

/** 仅加入属于 topic 且 context 相同的 owner view。 */
export declare function composeTopicOwnerView(
  model: TopicViewModel,
  ownerView: OwnerViewModel,
): ObjectConstructionResult<TopicViewModel>;

/** 应用同一 owner 的正式多轴状态，只收紧其 view/actions，不改变其它 partition。 */
export declare function applyOwnerSourceStatus(
  model: TopicViewModel,
  owner: OwnerKey,
  status: SourceStatusAxes,
): ObjectConstructionResult<TopicViewModel>;
```

构造不变量：visibility.topicRef、topic.topicRef 精确一致；contextRef 与 owner view contextRef 一致；activations canonical key=`owner+capabilityRef` 唯一；ownerViews 按其显式 `owner` 字段分区并按 `owner+viewRef` 排序；action 关联 owner 必须属于 topic；空 ownerViews 不等于正式空结果，必须由 visibility/activation/source status/region posture 解释。`applyOwnerSourceStatus` 只消费 `views` 已保真的 formal axes，将 partial/stale/degraded/conflict/unknown 映射为更保守呈现；它不接收 `recovery.DegradationState`，从而避免 `features ↔ recovery` 双向模块依赖。

#### 13.9 `TopicPageModel`

```ts
/** 一个管理主题页面的 framework-neutral 完整 view model。 */
export interface TopicPageModel {
  readonly route: RouteBinding;
  readonly topicView: TopicViewModel;
  readonly regions: readonly SemanticRegionModel[];
  readonly accessibilityBindings: readonly PageAccessibilityBinding[];
  readonly pagePosture: 'normal' | 'restricted' | 'partial' | 'blocked';
  readonly initialFocusRegionKey: NonEmptyOpaqueValue;
}

/** 由已收稳 topic view/regions 组合页面，不读取 owner 或 route transport。 */
export declare function createTopicPageModel(
  route: RouteBinding,
  topicView: TopicViewModel,
  regions: readonly SemanticRegionModel[],
  accessibilityBindings: readonly PageAccessibilityBinding[],
  initialFocusRegionKey: NonEmptyOpaqueValue,
): ObjectConstructionResult<TopicPageModel>;
```

pagePosture 由已有输入确定：visibility unknown/unavailable 或所有 applicable activation blocked→blocked；visibility restricted→restricted；任一 owner view/activation partial/stale/degraded/conflict→partial；其余才 normal。该值只控制页面呈现，不是 global health/readiness。必须存在 `context`、`source-status` 和 `recovery` semantic region；有 action 时必须存在 `actions` region。initialFocusRegionKey 必须指向非 hidden region。每个 visible/enabled actionKey 必须有 visual、keyboard、assistive-technology 三通道绑定，且三者 triggerKey 均为本地受控语义 key；完整 focus/announcement state 仍由 `recovery.AccessibilityState` 在页面组合后建立。具体 JSX/template/widget 与 CSS/layout 不在本 Step 锁定。

#### 13.10 `features` 模块停审

| 审查项 | 结论 | 后续缺口/实现暂停条件 |
|---|---|---|
| 八类 topic/owner mapping 是否 exact | 通过；类型+表固定 | 新增/重分 owner 必须回退 00/01/02 |
| activation 是否变成 readiness | 否；per-capability consumption posture | exact owner facets 未闭口前 active mapper blocked |
| page/route/component 是否到可落码语义粒度 | 通过：TopicPageModel、RouteBinding、SemanticRegionModel、ActionEntryModel | concrete framework/binding 留 Step 7/14/实施 ADR |
| action entry 是否等于执行 | 否；只呈现条件化入口 | submit 必须进入 intent guards/OwnerCommandPort |
| owner views 是否跨域压平 | 否；保持 owner/context/status | Step 9 composition flow必须逐 owner |
| 空/partial/error 是否可解释 | 通过 pagePosture+visibility+activation+axes/regions | Step 12 presentation mapping、Step 16 a11y tests |

Batch `6.5 = pass`。管理主题、页面、路由和 framework-neutral 语义组件对象已闭口；未选择技术框架，也未宣称任何 owner capability 已 active。进入 `recovery` 批次。

<!-- STEP6_BATCH_6_6_START -->

### 14. Batch 6.6：`recovery` 与可访问交互对象契约

#### 14.1 `recovery` capability / 功能清单

| capability | 输入 | 输出 | 状态/副作用 | 所属对象 | 后续承接 |
|---|---|---|---|---|---|
| 局部故障表示 | context/owner/topic/request + status/error markers | `DegradationState` | 只改变受影响区域呈现 | `DegradationSubject`、`DegradationState` | Step 9/10/12 |
| 安全恢复选择 | degradation、request/draft/formal refs | `RecoveryPlan` | 列出 allowed/blocked；不自动执行 | `RecoveryPlan`、`RecoverySafetyGuard` | Step 7 recovery ports；Step 9 flow |
| status presentation | degradation + semantic key | `StatusPresentationView` | 本地呈现 | view object | Step 12 mapping |
| a11y focus/announcement | page regions、同一 action semantics | `AccessibilityState` | 本地焦点/播报/键盘 binding | state + equivalence guard | Step 7 host a11y adapter；Step 9/16 |
| recovery page model | plan + a11y + safe status | `RecoveryViewModel` | 本地呈现 | view model | Step 9 flow |

#### 14.2 功能到对象映射

| 对象 | 承接功能 | 类别 | 对象能力 | 不承接/禁止事项 |
|---|---|---|---|---|
| `DegradationSubject` | 局部故障归属 | typed subject | context/owner/topic/request/view 精确主语 | 不用全局 Console subject |
| `DegradationState` | 非理想多轴 posture | client presentation state | construct/tighten/formal recover | 不生成 health/compliance/readiness |
| `RecoveryPlan` | allowed/blocked actions | interaction object | derive/allow/block | 不自动 retry/replay/补偿 |
| `RecoverySafetyGuard` | action 与原因/请求一致性 | guard | validate selected action | 不放行 unknown command replay |
| `InteractionActionSemantic` | 视觉/辅助路径共同语义 | value object | shared action/eligibility/outcome/recovery | 不建立第二业务路径 |
| `AccessibilityState` | focus/announcement/keyboard | interaction state | move/announce/bind | 不改变资格、结果、恢复上限 |
| `StatusPresentationView` | 状态语义 | view | compose safe message key/posture | 不压平 source axes |
| `RecoveryViewModel` | plan + status + a11y | view | list presentable actions | 不执行 action |

#### 14.3 `DegradationSubject`

```ts
/** 局部 degradation 的精确主语；没有 global-console 变体。 */
export type DegradationSubject =
  | Readonly<{ kind: 'context'; contextRef: LocalReference<'context'> }>
  | Readonly<{ kind: 'owner'; topicRef: LocalReference<'topic'>; owner: OwnerKey }>
  | Readonly<{ kind: 'topic'; topicRef: LocalReference<'topic'> }>
  | Readonly<{ kind: 'view'; viewRef: LocalReference<'view'>; owner: OwnerKey }>
  | Readonly<{ kind: 'request'; requestRef: LocalReference<'request'> }>;
```

| variant | 合法来源 | 作用 | 禁止事项 |
|---|---|---|---|
| `context` | AccessContext resolution/invalidation | 限制 context 依赖的全部区域 | 不表示 identity service 全局故障 |
| `owner` | 指定 topic 内 owner adapter/query result | 仅隔离该 owner partition | 不扩散为 topic/global failure |
| `topic` | activation/visibility 全主题 blocked | 限制该 topic 页面 | 不影响无依赖其它 topic |
| `view` | 某 owner view stale/partial/conflict | 限制对应 view | 不反写 owner projection |
| `request` | request/result ambiguity | 限制该请求及相关 action | 不阻止无关 query/navigation |

#### 14.4 `DegradationState`

```ts
/** 局部非理想姿态使用的四个独立轴。 */
export interface DegradationAxes {
  readonly availability: AvailabilityState;
  readonly freshness: FreshnessState;
  readonly coverage: Exclude<CoverageState, 'not-covered'>;
  readonly consistency: ConsistencyState;
}

/** Console-owned 局部呈现状态；只能由正式观察恢复为更开放值。 */
export interface DegradationState {
  readonly subject: DegradationSubject;
  readonly axes: DegradationAxes;
  readonly reasonRef?: OwnerReference<'reason'>;
  readonly invalidationRef?: LocalReference<'invalidation'>;
}

/** 构造至少一个轴非正常的局部 degradation。 */
export declare function createDegradationState(
  subject: DegradationSubject,
  axes: DegradationAxes,
  reasonRef?: OwnerReference<'reason'>,
  invalidationRef?: LocalReference<'invalidation'>,
): ObjectConstructionResult<DegradationState>;

/** 只向更保守的轴收紧。 */
export declare function tightenDegradationState(
  state: DegradationState,
  axes: Partial<DegradationAxes>,
  reasonRef?: OwnerReference<'reason'>,
): ObjectConstructionResult<DegradationState>;

/** 仅用新的 formal observation 替换对应轴；不是本地“成功”按钮。 */
export declare function applyFormalRecoveryObservation(
  state: DegradationState,
  observedAxes: DegradationAxes,
): DegradationState | undefined;
```

正常组合为 available+fresh+complete+coherent；`createDegradationState` 必须拒绝该组合。`applyFormalRecoveryObservation` 若回到全正常返回 `undefined`（表示不再需要 degradation 对象），否则返回新的局部 state。新观察的 owner/topic/request 必须与 subject 对齐；本地 timer/cache/route/render success 不是 formal observation。

#### 14.5 `RecoveryAction`、`RecoveryBlockReason` 与 `RecoveryPlan`

```ts
/** Console 可以显式呈现的恢复动作；不是后台 job。 */
export type RecoveryAction =
  | 'requery'
  | 'revalidate-context'
  | 'reconcile-result'
  | 'keep-draft'
  | 'exit';

/** 本地阻断原因；不复制 owner error body。 */
export type RecoveryBlockReason =
  | 'missing-formal-surface'
  | 'missing-reconciliation-basis'
  | 'stale-context'
  | 'revoked-context'
  | 'not-applicable'
  | 'unsafe-replay';

/** 被阻断动作及其安全原因。 */
export interface BlockedRecoveryAction {
  readonly action: RecoveryAction;
  readonly reason: RecoveryBlockReason;
  readonly reasonRef?: OwnerReference<'reason'>;
}

/** 一个局部 failure/unknown 的显式恢复计划。 */
export interface RecoveryPlan {
  readonly planRef: LocalReference<'recovery-plan'>;
  readonly trigger: DegradationState;
  readonly allowedActions: readonly RecoveryAction[];
  readonly blockedActions: readonly BlockedRecoveryAction[];
  readonly preserveDraft: boolean;
}

/** 依据主语和正式 refs 构造确定性恢复计划。 */
export declare function createRecoveryPlan(
  planRef: LocalReference<'recovery-plan'>,
  trigger: DegradationState,
  request?: RequestPresentation,
  draft?: DraftIntent,
): ObjectConstructionResult<RecoveryPlan>;
```

确定性 action 矩阵：

| degradation subject/condition | 必须允许 | 必须阻断/条件 |
|---|---|---|
| context expired/unknown/conflict | `revalidate-context`、`exit` | requery/submit 直到新 context；revoked 只允许新 context/exit |
| owner/view stale/partial/degraded | `requery`、`exit` | 无 query surface 则 requery blocked |
| request unknown | `exit`，有 formal reconciliation ref 时 `reconcile-result` | command replay 不是 RecoveryAction；永远不由本计划自动执行 |
| safe draft 存在且未 submitted/discarded | `keep-draft` | context revoked 或字段不再安全时必须 blocked/清理 |
| conflict | 对适用主语允许 requery/revalidate/reconcile | Console 不提供“选择一个来源”动作 |

集合规则：allowedActions 无重复，按 `requery,revalidate-context,reconcile-result,keep-draft,exit` 排序；blockedActions 覆盖其余适用但不安全动作，同 action 不能同时 allowed/blocked。至少存在 `exit`，除非宿主无法退出的正式约束在未来另有 authority；当前不自造 retry/backoff。

#### 14.6 `RecoverySafetyGuard`

```ts
/** 验证用户选择是当前 plan 明确允许的动作。 */
export declare function assertRecoveryActionAllowed(
  plan: RecoveryPlan,
  action: RecoveryAction,
  currentContext: AccessContext,
  request?: RequestPresentation,
): ObjectConstructionResult<RecoveryAction>;
```

guard 必须检查 planRef 对应当前 trigger、context ref 未发生未处理切换、requestRef 匹配、action 在 allowedActions。它不执行 query/revalidation/reconciliation/exit；Step 9 flow 调用相应 port。unknown request 无 reconciliation ref 时不得通过 `reconcile-result`，更不存在隐式 command retry。

#### 14.7 `InteractionActionSemantic` 与 a11y binding

```ts
/** 视觉和辅助入口共享的业务动作语义。 */
export interface InteractionActionSemantic {
  readonly actionKey: NonEmptyOpaqueValue;
  readonly eligibility: 'enabled' | 'disabled' | 'hidden';
  readonly outcomeKind: 'navigation' | 'query' | 'controlled-command' | 'recovery';
  readonly recoveryLimit: 'none' | 'safe-only' | 'formal-reconciliation-required';
}

/** 某种呈现通道对共享 action semantic 的绑定。 */
export interface ActionChannelBinding {
  readonly channel: 'visual' | 'keyboard' | 'assistive-technology';
  readonly actionKey: NonEmptyOpaqueValue;
  readonly triggerKey: NonEmptyOpaqueValue;
}

/** 确保每个可见/启用视觉动作都有语义等价的键盘和辅助绑定。 */
export declare function assertActionChannelEquivalence(
  semantic: InteractionActionSemantic,
  bindings: readonly ActionChannelBinding[],
): ObjectConstructionResult<InteractionActionSemantic>;
```

等价条件：三个 channel 的 actionKey 必须相同；enabled visual action 必须同时有 keyboard 与 assistive binding；disabled/hidden 姿态及 outcomeKind/recoveryLimit 在所有 channel 共用同一 semantic，不允许辅助路径绕过 guard 或拥有额外 command/retry。

#### 14.8 `AccessibilityState`

```ts
/** 当前语义状态的非颜色分类。 */
export type SemanticStatus =
  | 'normal'
  | 'restricted'
  | 'partial'
  | 'pending'
  | 'confirmed'
  | 'rejected'
  | 'unknown'
  | 'unavailable'
  | 'conflict';

/** 待播报的 body-free message binding。 */
export interface AnnouncementBinding {
  readonly messageKey: NonEmptyOpaqueValue;
  readonly politeness: 'polite' | 'assertive';
  readonly status: SemanticStatus;
}

/** Console-owned focus/announcement/keyboard state。 */
export interface AccessibilityState {
  readonly focusRegionKey: NonEmptyOpaqueValue;
  readonly announcement?: AnnouncementBinding;
  readonly actionSemantics: readonly InteractionActionSemantic[];
  readonly channelBindings: readonly ActionChannelBinding[];
}

/** 从入口映射出的安全 region keys/channel bindings 构造 initial a11y state。 */
export declare function createAccessibilityState(
  focusRegionKey: NonEmptyOpaqueValue,
  presentableRegionKeys: readonly NonEmptyOpaqueValue[],
  actionSemantics: readonly InteractionActionSemantic[],
  channelBindings: readonly ActionChannelBinding[],
): ObjectConstructionResult<AccessibilityState>;

/** 将焦点移动到仍可见/最小呈现的 region。 */
export declare function moveAccessibilityFocus(
  state: AccessibilityState,
  focusRegionKey: NonEmptyOpaqueValue,
  presentableRegionKeys: readonly NonEmptyOpaqueValue[],
): ObjectConstructionResult<AccessibilityState>;

/** 排队一个安全 message key；不接收原始文本/owner body。 */
export declare function queueStatusAnnouncement(
  state: AccessibilityState,
  announcement: AnnouncementBinding,
): AccessibilityState;
```

`PageAccessibilityBinding` 是 `features` 拥有的无业务状态页面 binding；Step 9 的 entry/composition flow 必须把非 hidden region key 和页面 binding 显式映射为 `recovery` 的 `ActionChannelBinding`。两个模块互不反向 import，且 mapper 必须逐字段复制 action/channel/trigger key，不能从 DOM、组件实例或视觉布局猜测。`messageKey` 是本地受控文案 key；实际 localized text 与屏幕阅读器 adapter 留 Step 7/14。assertive 仅用于 context revoked、command result rejected/unknown 或关键安全阻断等未来正式映射，Step 12 必须闭合；实现不得根据 error string 自行选择。

#### 14.9 `StatusPresentationView` 与 `RecoveryViewModel`

```ts
/** 将局部状态映射到共享视觉/非视觉 semantic status。 */
export interface StatusPresentationView {
  readonly subject: DegradationSubject;
  readonly semanticStatus: SemanticStatus;
  readonly messageKey: NonEmptyOpaqueValue;
  readonly reasonRef?: OwnerReference<'reason'>;
}

/** 恢复面板的 framework-neutral view model；不执行恢复。 */
export interface RecoveryViewModel {
  readonly plan: RecoveryPlan;
  readonly status: StatusPresentationView;
  readonly accessibility: AccessibilityState;
  readonly presentableActions: readonly RecoveryAction[];
}

/** 从 degradation 确定性映射安全 status key。 */
export declare function createStatusPresentationView(
  degradation: DegradationState,
  messageKey: NonEmptyOpaqueValue,
): StatusPresentationView;

/** 组合 plan/status/a11y 并验证 action semantic equivalence。 */
export declare function createRecoveryViewModel(
  plan: RecoveryPlan,
  status: StatusPresentationView,
  accessibility: AccessibilityState,
): ObjectConstructionResult<RecoveryViewModel>;
```

semanticStatus 映射不得把 partial/stale/degraded 当 normal：conflict→conflict，unknown轴→unknown，unavailable→unavailable，partial/stale/degraded→partial；优先级只用于呈现最保守状态，不丢弃原 axes。messageKey 不能包含 owner error/body。presentableActions 必须精确等于 plan.allowedActions 且每个 action 有共享 semantic+三通道等价 binding。

#### 14.10 `recovery` 模块停审

| 审查项 | 结论 | 后续缺口/实现暂停条件 |
|---|---|---|
| degradation 是否局部 | 通过；无 global-console subject | Step 9 flow 必须按 subject 更新 |
| 多轴是否被单一 status 取代 | 否；semanticStatus 只是呈现，原 axes 保留 | Step 12 mapper、Step 16 assertions |
| recovery 是否等于 retry | 否；显式 action set，无 command retry | Step 7 ports/Step 9 flows 承接执行 |
| unknown request 是否可能自动重放 | 否；只可能 formal reconcile/wait/exit | Step 13 幂等仍由 owner authority |
| a11y 是否第二业务路径 | 否；共享 InteractionActionSemantic | host binding/support matrix 留 Step 7/05/06 |
| announcement 是否泄露正文 | 否；只存 controlled message key+safe status | localization/diagnostic mapping留后续 |

Batch `6.6 = pass`。局部降级、恢复、安全 guard、焦点/播报和多通道等价对象已闭口；进入 `state/diagnostics/entry/adapters` 边界对象批次。

<!-- STEP6_BATCH_6_7_START -->

### 15. Batch 6.7：`state`、`diagnostics`、`entry` 与 adapter carrier

#### 15.1 `state` capability / 功能清单

| capability | 输入 | 输出 | 状态/副作用 | 对象 | 后续承接 |
|---|---|---|---|---|---|
| interaction snapshot carrier | context/navigation/topic/draft/request/recovery refs | `ClientStateRecord` | 保存/替换本地 interaction truth | state record | Step 7 state port；Step 11 consistency |
| scope/context binding | session/context refs | `StateScopeBinding` | 防跨 context 复用 | binding | Step 11 lifecycle |
| invalidation | formal hint/context change/explicit cleanup | `InvalidationMarker` | 标 stale/invalidated；不刷新 owner | marker | Step 7 optional consumer；Step 9 flow |
| safe cleanup | revocation/expiry/logout/context switch/user discard | cleanup result | 清理 refs/draft/view/history | state functions | Step 11/14/04 |

#### 15.2 `StateScopeBinding`

```ts
/** 把 client state 绑定到一个 browser session 和当前 context；不是 server session。 */
export interface StateScopeBinding {
  readonly sessionRef: LocalReference<'session'>;
  readonly contextRef?: LocalReference<'context'>;
}

/** 验证 state record 是否可在给定 session/context 使用。 */
export declare function matchesStateScope(
  binding: StateScopeBinding,
  sessionRef: LocalReference<'session'>,
  contextRef?: LocalReference<'context'>,
): boolean;
```

sessionRef 来源由宿主/Step 7 local ref seam 提供，不得保存 credential/cookie/token。contextRef 缺失只允许 unresolved shell/pre-context preference；任何 safe view/draft/request 必须有 contextRef 并精确匹配。

#### 15.3 `InvalidationMarker`

```ts
/** 失效范围；只触发本地 stale/cleanup/revalidation。 */
export type InvalidationScope =
  | Readonly<{ kind: 'context'; contextRef: LocalReference<'context'> }>
  | Readonly<{ kind: 'owner'; topicRef: LocalReference<'topic'>; owner: OwnerKey }>
  | Readonly<{ kind: 'view'; viewRef: LocalReference<'view'> }>
  | Readonly<{ kind: 'request'; requestRef: LocalReference<'request'> }>;

/** body-free 本地失效记录。 */
export interface InvalidationMarker {
  readonly invalidationRef: LocalReference<'invalidation'>;
  readonly source: FormalSourceKey | 'local-context-change' | 'explicit-user-cleanup';
  readonly scope: InvalidationScope;
  readonly observedAtIso?: string;
  readonly reasonRef?: OwnerReference<'reason'>;
}

/** 从 formal hint 或明确本地安全动作构造 marker。 */
export declare function createInvalidationMarker(
  marker: InvalidationMarker,
): ObjectConstructionResult<InvalidationMarker>;
```

`observedAtIso` 只有 formal hint metadata 提供时保存；本地 cleanup 可省略。不得保存 event id/payload/body/cursor/replay position；optional invalidation consumer 的去重/乱序语义留 Step 7/13。source=`sdk` 不等于 bus owner，且不能把 hint 当 owner state change。

#### 15.4 `ClientStateRecord`

```ts
/** 有界 client interaction truth 的 immutable snapshot；不含 owner body/credential。 */
export interface ClientStateRecord {
  readonly stateRef: LocalReference<'state-record'>;
  readonly scope: StateScopeBinding;
  readonly context: AccessContext;
  readonly navigation: NavigationState;
  readonly topicPages: readonly TopicPageModel[];
  readonly drafts: readonly DraftIntent[];
  readonly requests: readonly RequestPresentation[];
  readonly recoveries: readonly RecoveryPlan[];
  readonly accessibility: AccessibilityState;
  readonly invalidations: readonly InvalidationMarker[];
}

/** 构造 context-consistent、确定性排序的 state snapshot。 */
export declare function createClientStateRecord(
  record: ClientStateRecord,
): ObjectConstructionResult<ClientStateRecord>;

/** 应用 marker，只收紧/清理对应局部 state。 */
export declare function applyClientInvalidation(
  record: ClientStateRecord,
  marker: InvalidationMarker,
): ObjectConstructionResult<ClientStateRecord>;

/** context switch/revocation/logout 时产生安全最小 state。 */
export declare function clearClientStateForContextChange(
  record: ClientStateRecord,
  nextContext: AccessContext,
): ClientStateRecord;
```

| 集合 | canonical key/排序 | 允许保留 | 禁止保留 |
|---|---|---|---|
| topicPages | topic key | 当前 context 下 safe view/ref/semantic models | owner raw body、component instance |
| drafts | draftRef | 未提交且字段仍符合 safe contract 的 draft | submitted/discarded 或 context mismatch draft |
| requests | requestRef | request presentation/ref | command body、receipt/result body、idempotency secret |
| recoveries | planRef | 当前 subject 的 safe plan | 自动 action/retry schedule |
| invalidations | invalidationRef | body-free marker，retention 待 Step 11 | event payload/cursor |

状态介质、序列化、跨会话、加密、TTL、容量和迁移仍 pending。没有 authority 时，设计上限为当前 browser session 的 volatile carrier；不得默认为 localStorage/IndexedDB/cookie/server DB。`clearClientStateForContextChange` 必须清空 pages/requests/recoveries/invalidations 和 navigation；draft 仅在 formal policy 证明可安全跨 context 时才可保留，当前默认清空。

#### 15.5 `diagnostics` capability 与 `DiagnosticContext`

| capability | 输入 | 输出 | 状态/副作用 | 后续承接 |
|---|---|---|---|---|
| 最小关联 | phase、owner/topic/local refs、safe outcome | `DiagnosticContext` | 可发送给 sink 的 body-free carrier | Step 7 sink port；Step 15 |
| redaction gate | candidate context | eligible/blocked | 不改变业务结果 | Step 12/15 |
| sink failure isolation | sink outcome | local no-op/degraded diagnostic marker | 不改 context/result/recovery | Step 7/12 |

```ts
/** 客户端交互阶段；不是 owner trace span taxonomy。 */
export type InteractionPhase =
  | 'bootstrap'
  | 'context'
  | 'navigation'
  | 'query'
  | 'draft'
  | 'submit'
  | 'reconcile'
  | 'recovery'
  | 'accessibility';

/** 安全阶段结果；不含错误消息或业务正文。 */
export type SafeOutcomeMarker =
  | 'started'
  | 'completed-locally'
  | 'formal-result-observed'
  | 'restricted'
  | 'partial'
  | 'blocked'
  | 'unknown'
  | 'sink-failed';

/** 最小客户端诊断上下文；绝不构成 audit/evidence/report。 */
export interface DiagnosticContext {
  readonly diagnosticRef: LocalReference<'diagnostic'>;
  readonly phase: InteractionPhase;
  readonly outcome: SafeOutcomeMarker;
  readonly owner?: OwnerKey;
  readonly topicRef?: LocalReference<'topic'>;
  readonly requestRef?: LocalReference<'request'>;
  readonly traceRef?: OwnerReference<'trace'>;
  readonly redaction: RedactionMarker;
}

/** 从安全 markers 构造；不接受 arbitrary metadata map。 */
export declare function createDiagnosticContext(
  context: DiagnosticContext,
): ObjectConstructionResult<DiagnosticContext>;

/** 判定是否可进入 sink；失败时不返回被拒材料。 */
export declare function isDiagnosticSafeToEmit(
  context: DiagnosticContext,
): boolean;
```

字段约束：redaction.bodyDisposition 必须 absent/redacted；traceRef 只有正式边界返回 safe ref 时存在；owner/topic/request 只用于局部关联且必须相互一致。严禁 arbitrary attributes、user text、draft fields、safe payload、URL/query、error/stack、credential/secret、governance/evidence/audit/report body。具体 envelope/version/sink/telemetry name 留 Step 7/8/15；无 authority 时诊断可完全禁用，不能影响主链。

#### 15.6 `entry` capability 与 `ConsoleSessionShell`

| capability | 输入 | 输出 | 状态/副作用 | 对象 | 后续承接 |
|---|---|---|---|---|---|
| session shell bootstrap | session/local refs、initial context/navigation/a11y/state | shell | 本地启动姿态 | `ConsoleSessionShell` | Step 7 dependency ports；Step 9 bootstrap flow |
| page replacement | validated `TopicPageModel` | new shell | 本地呈现替换 | shell function | Step 9 |
| context invalidation | next context/clean state | new shell | 清理敏感 page/selection | shell function | Step 9/11 |
| shutdown | shell | empty/closed disposition | 清理本地 state；无 owner mutation | entry disposition | Step 9/12 |

```ts
/** 浏览器 session shell；只组合安全 client state 和当前 page。 */
export interface ConsoleSessionShell {
  readonly sessionRef: LocalReference<'session'>;
  readonly state: ClientStateRecord;
  readonly currentPage?: TopicPageModel;
  readonly disposition: 'bootstrapping' | 'presentable' | 'restricted' | 'closed';
}

/** 构造初始 shell；presentable 不能在未验证 context/page 时直接设置。 */
export declare function createConsoleSessionShell(
  sessionRef: LocalReference<'session'>,
  state: ClientStateRecord,
): ObjectConstructionResult<ConsoleSessionShell>;

/** 只有 page/context/state scope 一致时替换当前 page。 */
export declare function presentTopicPage(
  shell: ConsoleSessionShell,
  page: TopicPageModel,
): ObjectConstructionResult<ConsoleSessionShell>;

/** 应用 context change 后的已清理 state，并移除旧 page。 */
export declare function replaceShellContext(
  shell: ConsoleSessionShell,
  state: ClientStateRecord,
): ObjectConstructionResult<ConsoleSessionShell>;

/** 关闭 shell 并清空 current page；实际介质清理由 state port 承接。 */
export declare function closeConsoleSessionShell(
  shell: ConsoleSessionShell,
): ConsoleSessionShell;
```

这里的 `presentable` 只表示 session shell 可呈现至少一个安全页面/最小导航，不是系统/owner/capability readiness。对象本身不持有 SDK client、port implementation、framework component、router/store instance 或 credential；依赖注入/bootstrapping callable surface 留 Step 7/9。

#### 15.7 adapter carrier 闭口与 defer

Step 6 不定义 port/adapter 方法，但必须闭合它们可安全交付给内部对象的 carrier 上限：

```ts
/** formal adapter 在 protocol 解析后可交付给 view mapper 的安全材料。 */
export interface OwnerSafeQueryMaterial {
  readonly source: SourceReference;
  readonly status: SourceStatusAxes;
  readonly payload: SafeViewPayload;
  readonly references: SafeReferenceSet;
  readonly visibility?: VisibilityReference;
}

/** formal command adapter 可交付给 request presentation 的安全结果分支。 */
export type OwnerCommandObservation =
  | Readonly<{ kind: 'receipt'; receipt: ReceiptReference }>
  | Readonly<{ kind: 'result'; result: ResultReference }>
  | Readonly<{ kind: 'ambiguous'; reconciliationRef?: OwnerReference<'reconciliation'> }>;

/** optional invalidation adapter 的 body-free 输出。 */
export interface SdkInvalidationObservation {
  readonly source: 'sdk';
  readonly scope: InvalidationScope;
  readonly observedAtIso?: string;
  readonly reasonRef?: OwnerReference<'reason'>;
}
```

| carrier | 已闭口 | defer/暂停条件 |
|---|---|---|
| `OwnerSafeQueryMaterial` | 只含 safe source/status/payload/refs/visibility | exact owner Query/Result schema、empty/page/cursor/error 归 Step 7/8；无 safe-field mapping 时不得构造 |
| `OwnerCommandObservation` | receipt/result/ambiguous 三分支，不把 transport success 当结果 | exact Command/Receipt/Result/Idempotency contract 归 Step 7/8/13；无合同则主题 read-only/blocked |
| `SdkInvalidationObservation` | source/scope/time/reason ref；无 payload | SDK envelope/event id/dedup/order/cancel 归 Step 7/8/13；SDK 无 surface 时不激活 adapter |

Adapters 明确不能保存：SDK raw response、owner DTO/body、credential、secret、transport instance in state、private bus cursor、retry queue、Policy/Gate rule、owner repository/projection。Step 7 必须定义 port 与 fake parity；Step 8 必须定义 intake/result schema 和 unknown rejection；否则实现暂停。

#### 15.8 边界模块停审记录

| 模块 | 功能承接 | 字段来源 | 状态/生命周期 | 越界检查 | 结论 |
|---|---|---|---|---|---|
| `state` | state snapshot/scope/invalidation/cleanup 有对象 | local refs + 已验证对象 | medium/TTL defer，但 context cleanup 明确 | 无 credential/owner body | pass |
| `diagnostics` | context/redaction/emission eligibility 有对象 | safe markers/refs | 无业务 lifecycle；sink failure 隔离 | 非 audit/evidence/report | pass |
| `entry` | shell/page/context/shutdown 有对象 | local session+ClientStateRecord | bootstrapping/presentable/restricted/closed；presentable 仅 client-presentable | 无 auth/SDK/framework instance | pass |
| `adapters` | safe output carriers 已闭 | formal SDK/owner mapper | port/protocol/activation defer | 无 raw body/DB/bus/rules | pass with blockers |

Batch `6.7 = pass`。所有十个 Step 5 模块均已有对象闭口或明确的 port/protocol defer 决策；进入跨模块字段/状态审计和 Step 7 承接批次。

<!-- STEP6_BATCH_6_8_START -->

### 16. Batch 6.8：跨模块闭环审计与 Step 7 承接

本批不新增 Console 业务对象、状态变体、协议 schema 或 port 方法。目标是把 6.1～6.7 已写入的对象契约放在同一张审计面上，确认字段、状态、命名和依赖方向没有在模块边界处漂移，并把未闭合的 exact contract 逐项交给 Step 7。下文中的“通过”只表示 Step 6 的对象骨架与边界审计通过，不表示 owner 集成、运行可用性、测试、兼容性或 readiness 已发生。

#### 16.1 SOP 问题最终回答

| SOP 问题 | 最终回答 | 证据 / 限制 |
|---|---|---|
| 14. 每个模块是否完成模块内停审 | 是 | 十个 planned 模块均有 capability、对象、字段来源、状态/生命周期和越界检查；见 §16.2。 |
| 15. 高复用字段是否有稳定来源 | 是（对象层） | local/owner ref、context、source axes、safe payload、command/result、activation、a11y、state 和 diagnostic 字段均已指定来源；精确 DTO/port 读取面留 Step 7/8。 |
| 16. 对象组字段来源是否闭合 | 是（边界层） | 每个对象组都有创建输入、formal 观察或本地组合来源、后续闭合点和实现暂停条件；见 §16.4。 |
| 17. 状态闭环和 Step 7 承接是否完成 | 是（Step 6 级别） | Console-owned 状态有有限变体和安全迁移；owner-safe 轴明确不可本地推进；Step 7 契约组逐项列出；见 §16.5、§16.7。 |
| 是否仍有必须在 Step 6 继续猜造的内容 | 否 | `CON-Q-034～047` 及 exact owner schema 继续 pending，但不要求在本批发明字段；它们会阻塞后续精确契约或正向激活。 |
| 是否可以自动进入 Step 7 | 否 | 对象层技术上具备承接条件，但本项目要求每个 Step 完成后停审；必须等用户明确授权，且先读取 Step 7 SOP/书写规范。 |

#### 16.2 十模块停审总表

| 模块 | Step 6 已闭合对象 | 字段 / 输入来源 | 状态与生命周期结论 | 跨边界禁止事项 | 结论 |
|---|---|---|---|---|---|
| `access` | `AccessContext`、`ActorScopeReference`、`VisibilityReference`、`QualificationBoundary`、`DisclosureGuard` | formal context/visibility/qualification mapper；local context ref；owner opaque ref | unresolved/verified/restricted/expired/revoked/conflict/unknown；只能由正式结果提升 | 不认证、不计算 scope hierarchy、不生成 allow/deny、不保存身份正文 | pass |
| `navigation` | `RouteBinding`、`TopicVisibility`、`NavigationState` | host route binding、topic ref、formal visibility；本地返回历史 | visible/restricted/disabled/unknown/unavailable；收紧时清理敏感选择 | route/menu/flag/history 不得授权或证明存在性 | pass |
| `views` | `SourceStatusAxes`、`SourceReference`、`OwnerViewSnapshot`、`ReferenceSet`、`OwnerViewModel`、query guards | owner-safe query material、formal version/observation、safe payload/ref | freshness/coverage/availability/consistency 独立保真；snapshot 可 stale/revoked | 不合成 health/compliance/readiness，不写 owner，不把 query 当 command | pass |
| `intent` | `ClientDraftFields`、`DraftIntent`、`CommandReference`、`ReceiptReference`、`ResultReference`、`RequestPresentation`、各 guard | 用户本地 draft、formal command/receipt/result/reconciliation observation | draft 与 request 分层；confirmed/rejected 只来自 formal result；unknown 不自动 replay | 不把 transport success、toast、cache 或本地 key 当结果/幂等 | pass |
| `features` | `TopicDescriptor`、`OwnerCapabilityReference`、`OwnerContractObservation`、`TopicActivationState`、`ActionEntryModel`、`SemanticRegionModel`、`TopicViewModel`、`TopicPageModel` | 静态 topic-owner 映射、formal capability facets、owner view/status、local page contract | pending/read-only/partial/active/blocked；正向姿态带 capability；active 不是 readiness | 不复制八个 owner truth，不由 mock/flag/page existence 激活 | pass |
| `recovery` | `DegradationState`、`RecoveryPlan`、`AccessibilityState`、`StatusPresentationView`、`RecoveryViewModel` | formal status/invalidation、local safe plan、page binding 映射 | degradation 只局部；recovery action 显式且可阻断；a11y 与业务 action 共用 semantic | 不自动 retry/补偿、不改变资格/结果、不生成全局 health | pass |
| `state` | `StateScopeBinding`、`InvalidationMarker`、`ClientStateRecord` | session/context refs、formal invalidation hint、本地 cleanup | scope mismatch 清理；介质、TTL、跨会话留后续 | 不保存 owner body、credential、cursor/replay position 或 component instance | pass |
| `diagnostics` | `DiagnosticContext`、`RedactionMarker` 复用 | phase/safe outcome/local refs/formal trace ref | sink 失败隔离；可完全禁用而不改主链 | 不成为 audit/evidence/report，不收 arbitrary metadata 或正文 | pass |
| `entry` | `ConsoleSessionShell` | local session ref、`ClientStateRecord`、已校验 page | bootstrapping/presentable/restricted/closed；`presentable` 仅客户端可呈现 | 不持有 SDK client、router/store instance、credential 或 owner rule | pass |
| `adapters` | `OwnerSafeQueryMaterial`、`OwnerCommandObservation`、`SdkInvalidationObservation` | SDK/formal boundary 的已裁剪结果 | receipt/result/ambiguous 与 body-free invalidation；exact method/schema defer | 不保存 raw response、private bus、DB、retry queue、Policy/Gate 规则 | pass with blockers |

结论：每个模块都有唯一的对象归属，且每个对象都能回指至少一个 capability。`adapters` 的 blocker 是外部合同未闭合，而不是对象缺失；在合同到达前，正向主题必须保持 `pending/blocked/read-only/partial`。

#### 16.3 高复用字段来源审计

| 字段 / 字段族 | 统一类型 / 所属模块 | 允许来源 | 允许消费者 | 后续闭合点 | 禁止推导或替代 |
|---|---|---|---|---|---|
| `*Ref`（local） | `LocalReference<K>` / `access/access_context.ts` | local ref seam、entry/flow 显式传入 | 所有客户端对象 | Step 7 local-ref source；Step 9 flow | 不用数组下标、route、时间、标题或随机 UI 文本拼接 |
| `owner/kind/opaqueValue` | `OwnerReference<K>` / `access/access_context.ts` | formal adapter mapper | view/ref/intent/features/diagnostic | Step 7/8 exact typed-ref family | 不解析 opaque value，不把 owner ref 当存在性、授权、幂等或终态证明 |
| `contextRef` | local context ref | `AccessContext`、draft 创建与 formal context result | navigation/views/intent/features/state/recovery | Step 7 context port；Step 9 context-switch flow | 不从 route、tenant label、页面首项推导 |
| actor/scope/visibility/qualification ref | `ActorScopeReference`、`VisibilityReference`、`QualificationBoundary` | formal owner/SDK observation | disclosure、navigation、activation、submit guard | Step 7 resolver；Step 8 response schema | 不在 Console 复制 Policy/Gate、角色继承或 allowlist |
| `owner` partition | `OwnerKey` | topic descriptor 或 formal query adapter 选择 | `SourceStatusAxes`、`OwnerViewModel`、degradation subject | Step 7 owner mapping | 不从 `subjectRef` 字符串、route 或 payload 猜测；空集合不改变 owner |
| source/version/time | `SourceReference`、`VersionReference` | formal query metadata；版本可缺省 | snapshot/view/status/refresh predicate | Step 7 query port；Step 8 result schema | local render time 不冒充 `observedAtIso`；version 不用 cursor/TTL 替代 |
| source status axes | `SourceStatusAxes` | formal owner-safe result/invalidation mapper | views/features/recovery | Step 8 status carrier；Step 10 status explanation | 不合成为 health、compliance、audit 或 readiness |
| safe payload/redaction | `SafeViewPayload`、`RedactionMarker` | adapter safe-field mapper 或明确本地 label | views/features/diagnostics | Step 7 safe-field mapper；Step 8 schema | 不存 raw JSON/HTML/binary/credential/hidden body；无 allowlist 不放宽 |
| draft fields | `ClientDraftFields`、`ClientDraftValue` | 用户未提交输入 + formal field key | intent/state/features | Step 8 exact command DTO；Step 11 carrier | 不当 owner DTO、URL、日志、诊断或提交成功证明 |
| command/receipt/result | `CommandReference`、`ReceiptReference`、`ResultReference` | formal command/reconciliation mapper | intent/recovery/features | Step 7 command/reconcile port；Step 8 result schema；Step 13 idempotency | receipt 不等完成；transport 2xx/toast/cache 不等 result |
| request context/command | `RequestPresentation` 分支字段 | 同一次 eligibility observation + draft context | intent/state/recovery | Step 9 submit/reconcile flow | 不在 mapper 中换 owner、换 context 或重建 command ref |
| capability/activation | `OwnerCapabilityReference`、`TopicActivationState` | formal capability/activation facets | features/intent/navigation | Step 7 activation seam；Step 8 facet schema | `active` 不等 owner readiness；mock/flag 不得提升 |
| topic/page/region keys | `TopicDescriptor`、`SemanticRegionModel`、`PageAccessibilityBinding` | 静态本地 page contract | features/recovery/entry | Step 9 page composition；Step 14 host config | 不从 DOM、组件实例、owner id 或可见文本动态拼接 |
| action/channel keys | `InteractionActionSemantic`、`ActionChannelBinding` | 同一 local action semantic | recovery/features/a11y host | Step 7 host a11y seam；Step 9 mapper | 键盘/读屏不得创建第二 command 或绕过 guard |
| scope/invalidation | `StateScopeBinding`、`InvalidationMarker` | session/context change、formal SDK hint、本地 cleanup | state/views/recovery/entry | Step 7 optional consumer；Step 11 retention/cleanup；Step 13 dedup | 不保存 event payload、cursor、replay position 或把 hint 当 owner mutation |
| reason/diagnostic | `OwnerReference<'reason'>`、`DiagnosticContext` | formal safe reason ref、safe phase/outcome marker | all local presentation modules | Step 7 sink/trace seam；Step 12/15 mapping | 不把错误文本、stack、用户输入或治理依据写入诊断 |

审计结论：高复用字段已有唯一语义归属，且“来源”与“消费者”分开记录。Step 7/8 未补齐 exact reading/schema 时，实施侧必须停在 adapter mapper，不得在模块内部偷偷新增字段。

#### 16.4 对象组字段来源审计

| 对象组 | 代表对象 | Step 6 已闭合的构造输入 | 后续 Step 必须闭合 | 实现暂停条件 |
|---|---|---|---|---|
| context / disclosure | `AccessContext`、`QualificationBoundary`、`DisclosureGuard` | local context ref + formal actor/scope/visibility/qualification refs；guard 只保存 safe-field ref | Step 7 context/qualification resolver；Step 8 formal response/error mapping | 没有 formal scope/visibility/qualification source 仍试图构造 verified/qualified 或 safe-field 展示 |
| route / navigation | `RouteBinding`、`TopicVisibility`、`NavigationState` | host route key、local entry/topic refs、formal visibility observation | Step 7 host/router seam；Step 9 selection/cleanup flow；Step 14 route binding config | 用 route/menu/flag 直接设 visible，或 topic/entry mismatch 被静默修正 |
| source / view | `SourceReference`、`OwnerViewSnapshot`、`OwnerViewModel`、`ReferenceSet` | formal query material、source/status/version、safe payload/ref、显式 owner partition | Step 7 query port；Step 8 empty/page/error carrier；Step 11 state lifecycle | 把列表/聚合伪装成 object ref，或以 empty/missing 推导“不存在” |
| draft / request / result | `DraftIntent`、`RequestPresentation`、`ResultReference` | local draft fields、同源 context/command ref、formal receipt/result/reconcile ref | Step 7 command/reconcile port；Step 8 DTO；Step 9 submit/reconcile；Step 13 idempotency | 缺 result 仍标 confirmed，unknown 通过本地 retry/key 变成成功 |
| topic / activation / action | `TopicDescriptor`、`TopicActivationState`、`ActionEntryModel`、`TopicViewModel` | 静态 owner mapping、formal capability facets、owner view/status、visibility | Step 7 activation/owner query seam；Step 8 facet schema；Step 9 composition | 只因页面存在、feature flag 或 fake observation 进入 active/enabled |
| page / semantic / a11y | `SemanticRegionModel`、`TopicPageModel`、`AccessibilityState` | local region/action/trigger keys、topic view、explicit page bindings | Step 7 host a11y adapter；Step 9 page-to-action mapping；Step 14 locale/support config | 从 DOM/视觉快照推断可聚焦性、用颜色替代 status、a11y 路径绕过 action guard |
| degradation / recovery | `DegradationState`、`RecoveryPlan`、`RecoveryViewModel` | formal status axes/invalidation、局部 subject、local allowed/blocked actions | Step 9 recovery flow；Step 12 error mapper；Step 13 replay/idempotency | timer/cache/render success 被当 formal recovery，或恢复计划携带 retry schedule |
| bounded client state | `StateScopeBinding`、`ClientStateRecord`、`InvalidationMarker` | session/context refs、validated client objects、body-free marker | Step 7 state/invalidation seam；Step 11 carrier/cleanup；Step 14 medium binding | 介质未定却承诺跨设备/离线，或 context change 后保留敏感 pages/requests |
| diagnostics / entry shell | `DiagnosticContext`、`ConsoleSessionShell` | safe phase/outcome/ref、session ref、`ClientStateRecord`、validated page | Step 7 sink/bootstrap seams；Step 9 entry flow；Step 12 redaction | 将 shell/diagnostic 当系统健康、owner audit 或 auth session，或保存 raw error |
| adapter carriers | `OwnerSafeQueryMaterial`、`OwnerCommandObservation`、`SdkInvalidationObservation` | formal boundary 已裁剪 carrier | Step 7 exact port/adapter；Step 8 intake/result；Step 13 cancel/dedup | raw SDK response、owner DTO、private bus cursor、retry queue 或 DB handle 进入 state |

对象组结论：所有组均有“本地构造输入”或“formal observation 输入”；没有对象依赖 UI 猜测、owner 正文或隐藏 transport。缺少后续读取面时，必须以 `pending/blocked/unknown` 或受限呈现停住。

#### 16.5 状态闭环审计

| 状态主语 | 所属对象 | 初始 / 来源 | 合法迁移或更新 owner | 终态 / 特殊姿态 | 禁止混同 | Step 10 承接 |
|---|---|---|---|---|---|---|
| context lifecycle | `AccessContext` | unresolved shell 或 formal context result | formal resolve、formal invalidation、guard tightening | expired/revoked/conflict/unknown 需重验；无全局 auth state | verified 不等永久认证；unknown 不等 denied | context transition matrix |
| navigation visibility | `TopicVisibility` | formal visibility observation | formal refresh 或本地只收紧 | unknown/unavailable fail-closed；清理敏感 selection | visible 不等 command eligible | visibility/selection matrix |
| reference validity | `OwnerViewSnapshot`、`SafeReference`、`CommandReference` | formal result/invalidation | 新 formal result 可回 current；本地只能 stale/invalidated/revoked/unknown | revoked/invalidated 不得正常使用 | cache hit、route 可开、组件未卸载不等 current | validity propagation matrix |
| source axes | `SourceStatusAxes`、`DegradationAxes` | owner-safe query/status mapper | `views` 只读；`recovery` 只收紧或以新 formal observation 替换 | stale/partial/degraded/conflict/unknown 需解释 | 不压成单一 health/readiness | axes-to-presentation matrix |
| draft lifecycle | `DraftIntent` | create editing | edit、client validation、submit linkage、discard | submitted/discarded 逻辑终止；discarded 不复活 | reviewable 不等 authorized/owner-valid | draft transition matrix |
| request phase | `RequestPresentation` | submitted | formal receipt/result/reconciliation mapper | confirmed/rejected 仅 formal terminal；unknown 需回查/退出 | accepted/pending 不等成功；unknown 不自动 replay | request/result matrix |
| owner result state | `ResultReference` | formal result/reconciliation | 只能由 owner-safe observation 更新 | confirmed/rejected 是只读映射，不是本地业务终态 | 不由 request phase、toast 或 cache 推进 | owner-result mapping |
| topic activation | `TopicActivationState` | 缺 observation 时 pending | formal facets 评估；本地只收紧 | blocked/pending 可无 capability；read-only/partial/active 必须带 capability | active 不等 capability/owner readiness | activation matrix |
| local degradation | `DegradationState` | 非正常 formal axes/invalidation | formal observation 更新；RecoveryPlan 只给动作上限 | 正常四轴时 degradation 可移除；无 global-console variant | recovery action 不等已执行/已恢复 | degradation/recovery matrix |
| recovery plan | `RecoveryPlan` | degradation trigger | user chooses allowed action，经 guard 后交 Step 9 执行 | blocked action 保留原因；无隐式 retry | plan 不持有 schedule、job 或 command replay | recovery action matrix |
| a11y interaction | `AccessibilityState` | page binding 映射 | focus/announcement/channel binding 更新 | 无业务终态；关闭/换页时重建 | focus/announcement 不改变资格或结果 | a11y semantic matrix |
| client state scope | `ClientStateRecord` | session + optional pre-context scope | invalidation/context switch/cleanup | context change 产生最小安全 state；介质未定 | 不等 server session、owner snapshot store 或 persistence truth | cleanup/invalidation matrix |
| session shell disposition | `ConsoleSessionShell` | bootstrapping | validated page replacement、restriction、close | closed 清空 current page；`presentable` 仅客户端可呈现 | 不等系统/owner/capability readiness | entry disposition matrix |

状态审计结论：所有“正向”词都带有明确主语；`active`、`confirmed`、`current`、`fresh`、`complete` 不得由 UI、route、cache、toast、mock 或本地 flag 推导。Step 10 必须把本表转换为逐状态转换矩阵；若某迁移没有 formal 输入或显式本地动作，实现暂停。

#### 16.6 重复对象、命名和依赖方向审计

| 审计项 | 结论 | 具体校准 |
|---|---|---|
| local/owner ref 是否重复定义 | pass | local/formal ref primitives 只归 `access/access_context.ts`；`SafeReferenceSet` 归 `views`；不新增 `common/shared` 大桶。 |
| object reference 语义 | pass | `SourceReference.subjectRef` 只允许 `object | query-surface`；列表/聚合不伪造 object ref。 |
| owner partition | pass | `OwnerViewModel.owner` 为显式必填；空 snapshot 仍保留 owner 分区，禁止从首项推断。 |
| request 同源关系 | pass | 每个 `RequestPresentation` 分支都含 `contextRef` 与 `command`；command/context/request/result 不得换源。 |
| qualification 输入 | pass | `SubmissionEligibilityGuard` 消费 `DelegationQualificationObservation`，不直接拼 navigation/features 类型组合。 |
| activation 状态 | pass | positive posture 的 `TopicActivationState` 分支强制 capability；`active` 只表示消费面可判别。 |
| degradation 依赖 | pass | `features.applyOwnerSourceStatus` 消费 `SourceStatusAxes`，不接收 `recovery.DegradationState`；无 `features ↔ recovery` 类型循环。 |
| a11y binding | pass | `PageAccessibilityBinding` 在 `features`，Step 9 显式映射为 `recovery.ActionChannelBinding`；不从 DOM 猜测。 |
| shell disposition 命名 | pass | `ConsoleSessionShell.disposition` 使用 `presentable`，不把客户端可呈现姿态写成系统或 owner 就绪语义。 |
| 旧/未授权命名 | pass | 未引入历史对象引用别名、主题降级旧函数名或未授权激活 guard；不存在 `Provider Contract`、固定控制项数量或框架名作为契约。 |
| 依赖方向 | pass | `entry` 为组合根；`access → navigation/views`；`views → features`；`intent → state`；`recovery` 消费公开安全类型；`adapters` 是唯一 SDK boundary；`state/diagnostics` 不反向拥有业务 truth。 |
| owner truth 污染 | pass | 未引入成员、项目、流程、治理、制品、Workspace、能力、观测、归档或 sandbox 的 domain/projection/repository 状态。 |
| implementation fact | pass | 未创建实现仓、源码、package、测试、baseline、run、artifact、report、evidence、verdict、signoff 或 readiness。 |

依赖结论：模块依赖只向已声明的公开 carrier 流动；跨模块组合不改变对象所有权。若 Step 7 发现需要新增字段、状态或 helper，应先回退本批或 Step 5/6，而不是在 port 中隐式补口。

#### 16.7 Step 7 承接清单（仅记录，不创建 Step 7 文件）

| Step 7 契约组 | 必须承接的 Step 6 输入 | Step 7 需要输出 | 未承接时的实现 blocker |
|---|---|---|---|
| local ref / construction source | `LocalReference`、`NonEmptyOpaqueValue`、`ObjectConstructionResult` | local ref source/allocator seam、construction error mapping | 实现无法合法生成 local refs，只能拼字符串或时间 |
| access/context resolver | `AccessContext`、`ActorScopeReference`、`VisibilityReference`、`QualificationBoundary` | formal context/visibility/qualification port 与 unknown/revoked mapping | verified/qualified 字段无正式来源，必须保持 unresolved/blocked |
| host route / navigation | `RouteBinding`、`TopicVisibility`、`NavigationState` | framework-neutral host binding、visibility intake、selection cleanup seam | route path 被误当授权或 topic identity |
| owner-safe query | `OwnerSafeQueryMaterial`、`SourceReference`、`SourceStatusAxes`、`OwnerViewSnapshot` | query port、safe mapper、empty/page/error/partial carrier | query 需要 raw DTO、未分类对象引用或隐式写入 |
| safe-field / disclosure | `SafeViewPayload`、`RedactionMarker`、`DisclosureGuard` | per-owner safe-field mapper、redaction/error boundary | 无 allowlist 时无法构造正常 payload，必须 minimal/blocked |
| controlled command | `CommandReference`、`DelegationQualificationObservation`、`SubmissionEligibility` | command port、qualification intake、cancellation/unknown outcome | transport success 被误当 accepted/confirmed |
| receipt/result/reconciliation | `ReceiptReference`、`ResultReference`、`RequestPresentation`、`FormalReplayBasis` | result/reconcile port、unknown mapping、stored result/idempotency handoff | unknown 只能保留，禁止自动重放 |
| topic activation | `TopicDescriptor`、`OwnerCapabilityReference`、`OwnerContractObservation`、`TopicActivationState` | activation facet port、per-owner capability mapper | mock/flag/page existence 伪造 active |
| state/invalidation | `StateScopeBinding`、`ClientStateRecord`、`InvalidationMarker` | optional SDK invalidation consumer、cleanup/carrier seam | event id/payload/cursor/dedup 语义未闭合时不得持久化或回放 |
| page/a11y host | `TopicPageModel.accessibilityBindings`、`InteractionActionSemantic` | region/channel mapper、host focus/announcement seam | DOM/视觉实现绕过语义 action 或产生第二路径 |
| diagnostic sink | `DiagnosticContext`、`RedactionMarker` | optional body-free sink port、failure isolation mapping | sink 需要 arbitrary metadata 或正文时必须拒绝 |
| fake parity | 上述所有 safe carriers 与 blocked/unknown 分支 | fake 与 formal adapter 同一输入/输出/错误语义 | fake 默认 opaque ref 有效或直接返回 success |

Step 7 的启动红线：不得在 port 中新增对象字段、state variant、owner DTO、private cursor、repository、DB、BFF、worker/job 或 bus 语义；不得把本表的“需要输出”写成当前已存在的实现事实。Step 7 开始前必须重新读取 `详细设计讨论流程_SOP.md` Step 7 与对应书写规范，并确认用户授权。

#### 16.8 正式 `03` §5 / §6 回填草稿

以下内容仅作为未来 Step 19 的装配草稿，不修改正式 `projects/L5-console/03-详细设计.md`。

**§5 模块实现契约摘要**

> L5-console 是 framework-neutral 的 TypeScript 浏览器客户端。模块主轴为 `entry`、`access`、`navigation`、`views`、`intent`、`features`、`recovery`、`adapters`、`state`、`diagnostics`。`adapters` 是唯一 SDK/formal service boundary；`access`/`navigation` 只处理 context、visibility 与入口选择；`views` 只消费 owner-safe snapshot/ref 与来源多轴；`intent` 只保存本地 draft、request 经历和 formal result 引用；`features` 只组合八类主题的 owner 分区页面；`recovery` 只负责局部 degradation、显式恢复和 a11y 语义；`state` 只承载有界客户端交互事实；`diagnostics` 只承载去正文诊断上下文；`entry` 只负责 session shell 组合。不得引入数据库、repository、projection、BFF、worker、operations job、私有 bus 或 owner domain。

| 模块 | §5 应装配的对象契约 | 关键边界 |
|---|---|---|
| `access` | `LocalReference`、`OwnerReference`、`AccessContext`、`QualificationBoundary`、`DisclosureGuard` | formal refs 只读；本地只收紧 |
| `navigation` | `RouteBinding`、`TopicVisibility`、`NavigationState` | route 不授权；敏感选择可清理 |
| `views` | `SourceStatusAxes`、`SourceReference`、`OwnerViewSnapshot`、`OwnerViewModel`、`ReferenceSet`、query guards | owner 分区、safe payload、query no-write |
| `intent` | `DraftIntent`、`RequestPresentation`、`ReceiptReference`、`ResultReference`、completion/unknown guards | receipt/result/unknown 分层；不拥有幂等 |
| `features` | `TopicDescriptor`、`TopicActivationState`、`TopicViewModel`、`TopicPageModel`、action/region models | active 不等 readiness；不复制 owner truth |
| `recovery` | `DegradationState`、`RecoveryPlan`、`AccessibilityState`、recovery views | 局部、显式、语义等价 |
| `state` | `StateScopeBinding`、`InvalidationMarker`、`ClientStateRecord` | bounded carrier；介质/TTL 后置 |
| `diagnostics` | `DiagnosticContext`、redaction gate | body-free、sink failure 隔离 |
| `entry` | `ConsoleSessionShell` | `presentable` 只表示客户端可呈现 |
| `adapters` | safe query/command/invalidation carriers | exact port/schema 由 Step 7/8 闭合 |

**§6 全局对象索引摘要**

全局索引必须逐名列出上述十模块的 public type/interface/function，并标注“对象定义位置、主要消费者、来源类型、后续 Step”。索引中至少覆盖：`LocalReference` / `OwnerReference` / `SafeReferenceSet`、`AccessContext` / `NavigationState`、`SourceStatusAxes` / `OwnerViewSnapshot` / `OwnerViewModel`、`DraftIntent` / `RequestPresentation` / `ResultReference`、`TopicActivationState` / `TopicViewModel` / `TopicPageModel`、`DegradationState` / `RecoveryPlan` / `AccessibilityState`、`ClientStateRecord` / `DiagnosticContext` / `ConsoleSessionShell` 及 adapter carriers。索引不得把 owner domain、repository、projection、worker/job 或 framework component 列为 Console 对象。

正式装配时必须保留字段类型、factory/函数签名、状态变体、禁止事项和 Step 7+ 承接点；本批的过程性审计表、待确认列表和停审记录留在 calibration。

#### 16.9 待确认与实现暂停条件

| 待确认类别 | 当前姿态 | 影响 | 暂停条件 |
|---|---|---|---|
| `CON-Q-034` owner exact Query/Command/Result/Ref 与 activation | open/pending | adapters/views/intent/features | 没有 exact surface 不实现 positive mapper，不声称 active |
| `CON-Q-035～037` scope、visibility、qualification、safe-field/redaction、五轴 | open/pending | access/navigation/views/features/recovery | 无 formal source 只能 unresolved/restricted/minimal/blocked |
| `CON-Q-038` unknown reconciliation、幂等、重复风险 | open/pending | intent/recovery/adapters/state | 无 formal basis 不 replay、不标 confirmed |
| `CON-Q-039～043` Workspace/Method/Capability/Observability/Archive/Sandbox seams | open/pending | features/adapters | 只保留 owner-partitioned read-only/partial/blocked；不复制 owner 状态 |
| `CON-Q-044` state carrier、cache、TTL、跨会话/设备 | open/pending | state/entry/intent/views | 不承诺持久化/离线/跨设备；介质未定不写实现 |
| `CON-Q-045～046` 性能、负载、浏览器/a11y/诊断支持矩阵 | open/pending | all modules、05/06 | 不写数值或已验证兼容；只保留结构性边界 |
| `CON-Q-047` 未停审 L5/L6 link/ref | open/pending | features/navigation | 不进入主链、不消费相邻私有状态 |
| framework/bundler/package manager | open/pending | entry/host binding | 不生成 JSX/template、构建配置或框架专属实现 |

下列情况必须回退 Step 6 或更早，而不是由实现者补洞：新增对象或状态主语；改变 `OwnerViewModel.owner`、`RequestPresentation.contextRef/command`、`TopicActivationState` 分支；让 a11y binding 与 action semantic 不同源；把 `presentable`、`active`、`confirmed`、`current`、`fresh`、`complete` 从本地信号推导；或让任一模块持有 owner 正文、凭据、DB/repository/private bus/worker/job。

#### 16.10 三层门禁与 Step 6 结论

| 门禁层 | 结果 | 说明 |
|---|---|---|
| Step / 模块级 | `pass / self_reviewed` | 6.0～6.8 全部完成；十模块均有对象闭口或明确 defer；字段、状态、命名、依赖审计通过。 |
| 文档级 | `step_stop_review` | `03_ddd_step_06_object_contracts.md` 已完成；正式 `03-详细设计.md` 未修改，Step 7 文件未创建。 |
| 项目级 | `step_stop_review` | flow 与 `project_execution_ledger.md` 将恢复点切换为等待用户授权 Step 7；持续 blocker 原样传递。 |

本 Step 的技术结论是：对象实现契约已达到可被 Step 7 逐模块承接的粒度；本项目流程结论是：Step 6 现在停审，未经用户明确授权不得进入 Step 7。所有 TypeScript 片段仍是 planned contract，不代表编译、运行、测试或集成事实；本轮不运行测试、不创建实现仓、不提交 commit。

<!-- STEP6_BATCH_6_8_END -->
