# Step 3. 收稳编码规范、语言 / runtime、仓库约束

## 1. Step 状态

| 字段 | 值 |
|---|---|
| 文档 | `03-详细设计.md` |
| Step | 3 / 收稳编码规范、语言 / runtime、仓库约束 |
| 状态 | `completed_with_pending_technology_decision` |
| 当前模块 | `language_runtime_repository_constraints:self_reviewed` |
| gate_status | `pass` |
| gate_reason | 已把确定约束与未获 authority 的技术选择分离：语言/runtime/repo/壳/进程/store 均明确 `blocked/pending`，依赖类型与真实 sibling facts 已核验；允许 Step 4 只做布局门禁评估，不允许选择物理 package/crate/file。 |
| technical_decision_status | `blocked_pending_authority` |
| next_allowed_action | `start_step_04_for_blocked_layout_assessment` |
| 正式正文写入 | `blocked_until_step_19` |

### 1.1 Step 内计划

- [x] 恢复项目台账、03 flow 和 Step 2 门禁。
- [x] 完整读取 `standards/coding/rust.md` 与 `子项目目录与代码文件组织规范.md`。
- [x] 核验正式 01 的技术中立结论和正式 02 的 03 交接限制。
- [x] 只读检查 `/home/aris/Projects` 的目标仓、sibling repos、Cargo/package manifests 和真实 SDK surface。
- [x] 核验全局 compile/runtime/event 分类、git identity 和提交规范存在性。
- [x] 比较 Rust、TypeScript 和历史 hybrid 候选，但不在无 authority 时选型。
- [x] 后置扫描 README/旧 03/draft 技术污染；完成结构化表、回填草稿和自检。

### 1.2 开工与写入前检查

- 项目级：Step 2 `pass`，当前只允许 Step 3。
- 文档级：Step 3 文件到达时才创建；正式旧 03 继续只读。
- Step 级：可以只读核验 sibling repo/manifests；不得创建目标仓或修改任何实现仓。
- 技术真实性：仓存在、SDK package 存在或历史 README 声称某技术，均不自动构成 Runner 选型 authority。
- 依赖真实性：只有编译期关系才可能成为 package dependency；具体 package/crate/path 还必须与已选语言和真实布局一致。

## 2. 本步输入与事实核验

| 输入 / 事实 | 核验结果 | 本步用途 |
|---|---|---|
| Step 2 | 完整 03 覆盖六部分/17 对象/接口/flow/state；本会话只到 Step 4 | 限定技术只服务已确认范围。 |
| 正式 01 §3/§7/§11/§15 | 语言、UI shell、进程、store、协议、package 均未定；Rust/Tauri/Docker 等不自动继承 | 是技术决策的正式 authority 上限。 |
| 正式 02 §3/§12～§13 | 技术中立；03 必须核验真实 repo/language/runtime；证据不足保持 blocked/abstract | 决定本步不能强行选型。 |
| `standards/coding/rust.md` | Rust 规范完整存在；真实源码标识符、普通注释、rustdoc、测试名默认英文 | 仅在 Rust 获正式采用时约束源码；不证明采用 Rust。 |
| `standards/coding/typescript.md` | TypeScript 规范存在 | 若未来采用 TypeScript，必须完整前置阅读并遵守；本步不据此选语言。 |
| 目录组织规范 | 默认实现仓名为 `/home/aris/Projects/quantalithos-runner`；Rust 支持 single-crate 或 workspace 两类默认布局 | 仓名规则可确认；Rust 内部布局规则当前条件性适用。 |
| `/home/aris/Projects/quantalithos-runner` | 不存在 | `RUN-DDD-001`；没有现存 Cargo/package/source/test/baseline 可核验。 |
| `/home/aris/Projects/quantalithos-core` | 存在 Rust workspace；真实 `crates/contracts` | 证明 Rust `core-contracts` 路径存在，不证明 Runner 采用 Rust。 |
| `/home/aris/Projects/quantalithos-sdk` | 存在；Rust workspace 有 `crates/client/contracts/...`，另有 Python/TypeScript package surface | 证明多语言 SDK 候选边界存在，不证明 Runner exact surface ready。 |
| SDK Rust client | `SdkClient/ServiceClient/EventClient` 与 generic call/read/publish/subscription surface 存在 | 没有发现 Runner 专用 Release/Sandbox/Runtime/Observability contract；`RUN-UP-008` 保持。 |
| SDK TypeScript package | `@quantalithos/sdk` v0.1.0 private ESM skeleton；service/event 参数返回仍为 `unknown` 且 host wiring 抛错 | 只能证明 package skeleton，不可据此锁 Runner schema 或 readiness。 |
| 其他 owner 实现仓 | governance/work 等部分存在；artifact/runtime/sandbox/observability/archive 未在顶层发现对应实现仓 | 存在性不改变运行期依赖分类；缺失也不能由 Runner 复制 owner 实现。 |
| git identity | `quantalithos-labs <quantalithos.ai@gmail.com>` | 未来实施前核验项；本轮不提交。 |
| 提交规范 | `standards/README.md` 标记 Git 分支/提交规范“待补”；子项目清单 R12 有 Conventional Commits 中文主题约定，但没有独立权威规范文件 | 记录为待确认，不自行补设 commit 规则；用户明确本轮不提交。 |

## 3. SOP 问题回答

### 3.1 本仓使用什么语言、runtime、框架和主要依赖

当前**不能正式选择**语言、runtime、GUI/CLI shell、framework、进程模型、package manager、store 或 cache backend。

已确认的只是不变量：

- 产品形态是端侧独立运行入口，必须提供跨平台逻辑体验，但物理 shell 未定。
- 长时取得/验证/reconcile/refresh 需要可取消、有界后台承载，但线程/进程/worker 形态未定。
- 软件实际运行必须经正式 Sandbox 边界；Runner 自身不得直接执行 Release 或拥有 isolation backend。
- 跨域必须经 SDK/正式 API/公开 adapter；不能直连 owner 源码、数据库、Bus 私有 topic 或 Sandbox backend。
- 本地 store/cache 必须满足 expected-version、quarantine/promotion、protection、crash recovery 和 corruption fail-closed；技术产品未定。

### 3.2 Rust 编码规范会影响什么

若后续正式选择 Rust：

- 标识符、module/type/function/test 名和真实源码注释使用英文；类型 `UpperCamelCase`，函数/module `snake_case`。
- public struct/field/enum/variant/trait/function 使用完整 rustdoc；带载荷 variant 说明载荷语义。
- `rustfmt`、四空格、导入分组、所有权语义转换命名、避免可变全局等规则进入实现门禁。
- 详细设计中的中文 Rustdoc 风格片段是中文设计契约；真正源码必须按 Rust 规范转写英文。两者不是冲突的实现许可。
- 当前 Rust 规范已发布部分没有覆盖全部 trait/error/async/unsafe/security 章节，因此实际采用 Rust 时仍需项目级 lint、安全和依赖门禁补充，不能假装规范已全覆盖。

若未来选择 TypeScript，则 Rust struct/trait/Cargo 规则不适用，必须重新完整承接 TypeScript/JSDoc/strict/ESM 规范；不得把详细设计模板的 Rust 示例机械转成实现事实。

### 3.3 是否必须遵守 rustdoc 风格注释

- 设计文档：若使用 Rust 契约片段，按详细设计规范使用中文 Rustdoc 风格，确保字段、variant 和 public function 可审查。
- 真实 Rust 源码：使用英文 rustdoc/注释，遵守 `standards/coding/rust.md` 的源码语言约束。
- 非 Rust 实现：采用对应语言的正式 doc comment 规范；不得伪造 Rust 类型。

### 3.4 实施者开始前必须阅读哪些提交和身份要求

未来至少需阅读正式 `00~07`、相关 calibration 入口、所选语言编码规范、目录规范、真相源闭环标准和届时有效的提交规范。当前独立 Git 分支/提交规范缺失，不能把子项目清单的摘要扩写成不存在的详细规则。实施前还必须复核当时的 `git config user.name/user.email`；本次观测值仅记录现状，不成为永久身份真相。本轮 `commit_required=false`。

### 3.5 哪些安全、鉴权、网关或外部边界不应在本仓实现

- actor/session/project membership、Release/baseline、approval/decision、execution/outcome、boundary/lease/cleanup、evidence/report/verdict/signoff、archive/restore truth；
- credential 签发、签名 policy 私钥、raw Artifact/policy/output/evidence body；
- Sandbox Docker/gVisor/Firecracker 等 backend、Runtime loop、owner repository/database、Bus cursor/group truth；
- 将 role/cache/HTTP 200/ACK/PID/port/toast/local log/handoff receipt 提升为 authority/running/cleanup/evidence；
- fake adapter 作为 production fallback，或 generic JSON/`Any`/`unknown` 填补缺失 schema。

### 3.6 本仓是否依赖已实现的 Quantalithos 仓库

全局矩阵确认 Runner 对 `L0-core` 和 `L0-sdk` 有编译期关系，对 Sandbox 等 owner 有运行期关系，并按需经 SDK 消费状态。真实 Core/SDK sibling repo 存在；但目标 Runner 仓和实现语言不存在/未定，因此当前只能确认**关系类别**，不能确认 Runner manifest 中的具体 package dependency。

### 3.7 哪些是已确认的编译期依赖

| 关系层次 | 当前结论 |
|---|---|
| 全局项目关系 | `L0-core` / `L0-sdk` 是 Runner 的编译期依赖类别，来源为全局依赖矩阵。 |
| 具体 Rust crate | `core-contracts`、`sdk-client`、`sdk-contracts` 等真实存在，但 Runner 是否引用、引用哪个组合尚未获语言与 exact surface authority。 |
| 具体 TypeScript package | `@quantalithos/sdk` skeleton 真实存在；Core 的可消费 TS binding 与 Runner exact owner types 未证实。 |
| 当前 manifest 声明 | 无；Runner 仓不存在，不得创建或虚构 Cargo/package declaration。 |

因此“编译期关系已确认”不等于“Cargo path dependency 已确认”。

### 3.8 依赖仓库在 `/home/aris/Projects` 下是否存在

```text
/home/aris/Projects/quantalithos-runner       absent
/home/aris/Projects/quantalithos-core         present: Rust workspace
/home/aris/Projects/quantalithos-sdk          present: Rust workspace + Python/TypeScript surfaces
/home/aris/Projects/quantalithos-governance   present: runtime owner repo, not Runner source dependency
/home/aris/Projects/quantalithos-work         present: runtime owner repo, not Runner source dependency
```

Artifact、Runtime、Sandbox、Observability、Archive 等名称对应实现仓未在顶层清单中发现；这只说明本机现状，不授权 Runner 内嵌它们。

### 3.9 当前是否采用本地 path dependency，中期如何处理

当前不采用任何 Runner dependency declaration，因为目标 manifest 不存在且语言未定：

- 若未来正式选择 Rust，需再次核验 `../quantalithos-core/crates/contracts` 与 `../quantalithos-sdk/crates/<actual-public-crate>`，只引用获准 public crate，并确认不会把 SDK 内部 application/infra truth 变成 Runner ownership。
- 若未来正式选择 TypeScript，需确认 approved package/workspace/registry/private git binding；不能把 Rust path 机械翻译成 package 依赖。
- 中期 private git tag/rev 只能在具体 package/crate 与版本策略闭口后记录；当前不伪造 tag/rev。
- 公共 crates.io/npm 发布不是当前默认前置条件。

### 3.10 哪些关系只是运行期或事件协作依赖

Artifact、Governance、Work/Workspace、Runtime、Sandbox、Observability、Archive 全部通过 SDK/正式 API/adapter 运行期消费；owner event 只经正式 SDK/event seam 条件消费。`L0-bus` 不得成为 Runner 直连 broker/package 依赖。Sandbox backend、操作系统 API、本地 store/cache provider 只在 adapter/binding 章节出现，不成为跨仓 owner source dependency。

## 4. 当前文档问题诊断

| 历史/现实问题 | 风险 | 当前处置 |
|---|---|---|
| README 声称 Rust + Tauri + CLI | 无 authority 地锁语言、shell 和 multi-entry 布局 | historical only；`RUN-DDD-002`。 |
| README 声称 SDK Rust 与共享 Sandbox 实现 | 可能直接编译 SDK/Sandbox 私有实现 | 只允许 public SDK package/crate；Sandbox 仅 runtime seam。 |
| 旧正式 03 写 Rust struct 和 `src/application/domain/infra` | 在仓/语言不存在时制造落码假象 | 不继承；Step 4 不生成 Rust 文件树。 |
| Core/SDK Rust workspace 真实存在 | 容易把“可见 crate”误认为“Runner 应依赖 crate” | 区分全局关系、具体 binding 与 actual manifest 三层。 |
| SDK TS package 的方法使用 `unknown` 且无 runtime wiring | 容易把 skeleton 当 exact client | 保持 `RUN-UP-008`，不作为正向 adapter readiness。 |
| Rust 规范与 DDD 中文注释要求表面冲突 | 可能把中文设计注释直接复制到源码 | 设计契约中文、真实源码英文，明确转换门禁。 |
| 独立提交规范缺失 | 实施者可能自行发明格式/author | 07 前保持待确认；本轮不 commit。 |

## 5. 改动前后对比

| 维度 | 历史材料 | 当前结论 |
|---|---|---|
| 语言 | Rust 已定 | `blocked/pending`；Rust/TS 都只有候选证据。 |
| shell | Tauri 主、CLI 后备 | `blocked/pending`；只确认多入口共享语义门禁。 |
| Sandbox | 共享实现 / Docker daemon | runtime public seam only；禁止 source/private backend dependency。 |
| SDK | `@quantalithos/sdk-rust` 已可用 | real Rust/TS surfaces 存在，但 Runner exact capabilities pending。 |
| store | Rust repo/projection 默认 | required guarantees only；backend/schema pending。 |
| repo/layout | Cargo + `src-tauri/src/web/cli` | target repo absent；不得声明 manifest/package/file。 |
| commit | 历史作者/格式可沿用 | no commit；正式规则缺口与当前 git identity 分开记录。 |

## 6. 设计取舍

| 候选 | 支持证据 | 缺失 / 风险 | 当前结论 |
|---|---|---|---|
| Rust native application | real Core/SDK Rust crates；系统资源/cache/CLI 能力匹配候选 | 正式 01 未选 Rust；GUI shell、Runner exact SDK、target repo 未定 | 不采用为结论；保持 candidate。 |
| TypeScript/browser-or-desktop host | real `@quantalithos/sdk` ESM skeleton；可承载 UI | exact methods 为 unknown、host wiring 缺失；本地资源/长时后台/shell 未定 | 不采用为结论；保持 candidate。 |
| Rust + Tauri + web frontend | README 历史叙事 | 双语言/build/package/process 边界无 authority；容易继承旧目录 | 排除为当前结论。 |
| CLI-only Rust | 可减少 GUI 复杂度 | 不足以证明满足用户端跨平台产品体验；产品入口 authority 未定 | 不采用。 |
| 技术选择暂缓、只固定硬约束 | 完全符合正式 01/02 与真实仓现状 | Step 4 不能给物理文件路径 | 采用；如实阻塞布局。 |

不画图：本步规范要求表格收稳约束且章节禁止画图；依赖方向已由表格清楚表达。

## 7. 结构化中间产物

### 7.1 编码规范承接表

| 规范来源 | 必须遵守的内容 | 对本文的影响 |
|---|---|---|
| `standards/document/详细设计书写规范.md` | module 主轴、typed 字段/函数/schema/state/error/test、正式来源追溯 | 技术未定不能降低最终实现契约粒度，只能阻塞物理落点。 |
| `standards/document/详细设计讨论流程_SOP.md` | Step 3 事实核验、compile/runtime 分类、真实 sibling 路径 | 当前完成约束核验，不把 pending 写成已选。 |
| `standards/document/设计真相源闭环与可落码性标准.md` | 单一 truth、字段/DTO/state/metadata/phase 闭环 | SDK unknown/generic surface 不能替代 exact schema。 |
| `standards/document/子项目目录与代码文件组织规范.md` | 实现仓 `quantalithos-runner`；Rust 目录/package/crate 规则 | 仓名可确认；Rust 内部布局条件性，不得提前套用。 |
| `standards/coding/rust.md` | 英文源码、rustdoc、命名、格式和语言级规则 | 仅在 Rust 正式采用时适用；设计片段与源码语言分开。 |
| `standards/coding/typescript.md` | TypeScript 命名、JSDoc、严格类型等 | 若 TS 正式采用，Step 3 必须重开并完整承接。 |
| `standards/README.md` / 子项目清单 | 三条横切红线；提交规则现状与摘要约定 | audit/trace/tailoring 不得被本地日志伪装；commit 细则待补。 |

### 7.2 实现约束表

| 约束 | 说明 | 影响的模块 / 接口 |
|---|---|---|
| Language/runtime unresolved | 不生成语言特有 struct/trait/class/async/file contract | 全部 implementation units。 |
| Target repo absent | 不声称已有 manifest/source/test/build/baseline | Step 4、07、未来实施。 |
| SDK/public-boundary only | Core/SDK 只消费获准 public binding；owner 经 SDK/API | 全部 required ports/adapters。 |
| Sandbox runtime only | 不引用或编译 Sandbox backend/source | Run/control/resource/cleanup。 |
| Exact immutable selection | 技术/配置不能启用 latest/default/mutable tag | Selection/material/run。 |
| Multi-axis state | 类型和 UI 不得压成单一 success/status | Domain/projection/presentation。 |
| Unknown freeze | transport timeout/ambiguous outcome 不自动 replay | Commands/jobs/recovery。 |
| Query/render no-write | read surface 不 refresh/repair/launch | Queries/presenters/connectivity。 |
| Protected material first | unknown/active guard 禁止 delete/evict | Cache/cleanup/recovery。 |
| Redaction/evidence separation | raw body/secret 不进普通 store/log；local diagnostics 非 evidence | Preview/diagnosis/handoff/telemetry。 |
| Cross-platform degradation | unsupported/permission/unknown 显式；不以 local probe 覆盖 owner truth | Platform/resource/presentation。 |
| No unauthoritative numbers | timeout/retry/concurrency/capacity/retention 不用 README 数字 | Jobs/config/store/UI。 |

### 7.3 本地多仓依赖约束表

| 依赖仓库 | 全局依赖类型 | 本地默认路径 / 真实事实 | 当前引用方式 | 中期引用方式 | 影响的实现单元 |
|---|---|---|---|---|---|
| `quantalithos-core` | 编译期 | `/home/aris/Projects/quantalithos-core`; Rust `crates/contracts` 存在 | 无 Runner manifest；具体 binding pending | 选定语言后 local path/workspace 或 private git tag/rev | shared refs/metadata/error 候选 |
| `quantalithos-sdk` | 编译期 + 运行期边界 | `/home/aris/Projects/quantalithos-sdk`; Rust crates + Python/TS surfaces 存在 | 无 Runner manifest；Runner exact surface `RUN-UP-008` | 选定 public package/crate 后 local binding 或 private git tag/rev | all external adapters/context/error/trace |
| Artifact/Governance/Work/Workspace | 运行期 | 部分 sibling repo 存在，不改变分类 | SDK/formal API required seams only | versioned formal API/SDK | context/selection/material |
| Runtime/Sandbox/Observability/Archive | 运行期 | 对应真实实现仓不全；不得内嵌 | SDK/formal API required seams only | versioned formal API/SDK | lifecycle/resource/diagnosis/handoff |
| `L0-bus` | 条件事件协作 | 不直接消费 broker/topic | 仅经正式 SDK event seam；当前 consumers disabled/blocked | 合同闭合后 versioned SDK event surface | planned consumers/reconcile |

当前不存在可写入 Runner Cargo/package manifest 的 path dependency 表。所有具体声明均为 `not_applicable_until_language_and_manifest_exist`。

### 7.4 技术决定状态表

| 决定项 | 状态 | 关闭所需 authority | 未关闭影响 |
|---|---|---|---|
| 实现语言 | blocked/pending | 正式架构/用户技术决定 + 真实目标仓 | 禁止语言特有布局。 |
| GUI/CLI/product shell | blocked/pending | 产品入口与跨平台 packaging 决定 | 禁止 Tauri/Electron/Web/CLI-only 目录。 |
| runtime/process/worker | blocked/pending | lifecycle/后台/packaging 决定 | 禁止 main/daemon/worker binary。 |
| local store/cache/files | blocked/pending | platform/security/crash consistency 决定 | 禁止 DB/schema/migration/path。 |
| Core/SDK concrete binding | blocked/pending | 语言决定 + exact public Runner surface | 禁止 Cargo/npm/path/version 声明。 |
| owner adapters/events | blocked by `RUN-UP-001~008` | owner + SDK contracts | 只允许 semantic ports/disabled consumers。 |

## 8. 回填草稿

未来正式 §3 应使用 §7.1～§7.4，明确“硬约束已收稳、技术产品未选择”。如果语言/runtime 在正式 03 装配前仍未关闭，则正式 03 不能满足 1:1 实现标准，必须保持 blocked 而不能用抽象伪代码掩盖。当前不回填旧正式 03。

## 9. 待确认事项

- `RUN-DDD-001`：目标仓创建与现有布局 authority。
- `RUN-DDD-002`：语言、runtime、shell、process、package manager。
- `RUN-DDD-003`：store/cache/filesystem/locking/migration/corruption 技术。
- `RUN-UP-008`：Core/SDK exact Runner-facing public binding、version、error/redaction/trace。
- 独立 Git 分支/提交规范：当前标准总纲仍标待补；未来实施前需明确。

## 10. 进入下一步条件

- [x] 已点名 Rust 规范、源码注释和 rustdoc 转写边界。
- [x] 已点名提交规范缺口和当前 git identity；本轮不提交。
- [x] 已只读核验目标仓不存在、Core/SDK 真实 repo/manifests/surfaces。
- [x] compile/runtime/event 关系未混写，owner repos 未变 path dependency。
- [x] Rust/Tauri/Docker 等历史技术没有被继承。
- [x] 每个未决技术项均有状态、authority 和未关闭影响。

结论：Step 3 工作已完成，`gate_status=pass` 仅表示可以进入 Step 4 做**布局门禁评估**；`technical_decision_status=blocked_pending_authority`，不允许 Step 4 创建物理 package/crate/binary/file 契约。
