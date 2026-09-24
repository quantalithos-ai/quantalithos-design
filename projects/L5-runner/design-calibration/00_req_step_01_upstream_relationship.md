# 00 需求 Step 1 · 与上游文档的关系声明

> 状态：`completed`
> 当前文档：`00-需求文档.md`
> 回填章节：正式 `00` §1 与上游文档的关系声明
> 本 Step 不回答 Runner 的职责、边界、功能、数据、接口或实现方案。

## 1. 本步目标

说明 `L5-runner` 需求文档从哪些正式上游主题细化而来，确认本仓需求不是重新定义产品全景、Artifact、Governance、Runtime、Sandbox 或 Observability 的 owner 语义。

## 2. 本步输入

- `product/最终目的.md`
- `product/产品矩阵.md`
- `architecture/仓库拆分方案.md`
- `standards/document/全局项目依赖关系与裁剪规则.md`
- `projects/L0-sdk/00-需求文档.md`
- `projects/L1-artifact/00-需求文档.md` 与当前正式设计文档
- `projects/L1-governance/00-需求文档.md` 与当前正式设计文档
- `projects/L1-work/00-需求文档.md` 与当前正式设计文档
- `projects/L1-workspace/draft/` 与当前正式文档可引用的只读边界
- `projects/L2-runtime/00~03-*.md`
- `projects/L4-sandbox/00~03-*.md`
- `projects/L4-observability/00~03-*.md`
- `projects/L4-archive/00~04-*.md`
- `projects/L5-runner/draft/01~03_*.md`
- `projects/L5-runner/README.md` 与旧 `00/01/02/03/05/06`（仅 historical material）

## 3. 应问的问题与回答

### 3.1 本文承接哪些上游文档？

承接产品层关于“用户运行 AI 团队产出软件”的产品主题、仓库拆分方案对 L5 Runner 的层级定位、全局依赖规则对 SDK/Artifact/Sandbox 关系的裁剪约束，以及上游正式文档对 Artifact、Governance、Runtime、Sandbox、Observability、Archive 和项目语境的 owner 结论。

### 3.2 承接的是上游哪一部分主题？

本仓只承接“端侧运行入口如何消费已获正式授权的不可变软件产物，并把准备、请求、运行展示、清理和诊断组织成产品体验”这一细化主题。上游各仓的业务事实、治理决定、运行执行、隔离执行、观测材料和归档恢复主题仍分别由其 owner 文档承接。

### 3.3 本文为什么不是重新定义这些主题？

因为 Runner 处于 L5 产品层，消费的是上游已形成或待形成的正式能力边界；它不拥有上游对象的生命周期、事实、批准、执行结果或审计结论。上游合同尚未闭合的部分只能在 Runner 需求中记录为依赖、限制或 blocker，不能由 Runner 需求文档补造。

### 3.4 本文在当前仓承担什么细化作用？

本文把产品叙事和跨仓 owner 边界细化为 Runner 可被用户感知、可被后续架构承接和可被验收判断的需求范围：显式版本选择、正式 authority 校验、下载/cache/完整性、Sandbox 请求、运行控制与清理、输出预览、失败诊断、handoff 和断线恢复。具体协议、模块、状态字段和技术选择后置到后续文档。

## 4. 诊断：历史材料与当前来源的关系

| 历史材料 | 当前处置 |
|---|---|
| `README.md` 中“运行产物入口”、旧产品叙事 | 仅证明历史产品方向，不作为当前字段、协议、阈值或技术方案来源。 |
| 旧 `00/01/02/03/05/06` 的对象名、事件名、性能数字和实现假设 | 仅作冲突扫描输入，必须由当前上游正式文档和本轮 Step 重新确认。 |
| `projects/L5-runner/draft/01~03` | 作为本仓 pre-calibration 结构输入；仍不是正式需求真相源。 |

## 5. 结构化中间产物

| 来源文档 | 上游章节 / 模块 | 承接主题 |
|---|---|---|
| `product/最终目的.md` | §一“一句话定位” | 平台让用户以管理者身份使用 AI 协作产出的可运行交付物。 |
| `product/最终目的.md` | §五“核心体验” | 从产出、验收、发布到运行的端到端产品语境。 |
| `product/产品矩阵.md` | §3.2 “Runner — 运行产出” | Runner 作为独立 L5 产品、主要用户、窄域消费和运行入口主题。 |
| `product/产品矩阵.md` | §九 / §十“产品协同与阶段” | Runner 与 SDK、Server、Artifact、Sandbox 的产品协同背景。 |
| `architecture/仓库拆分方案.md` | §八 “L5 · UI 层 / quantalithos-runner” | Runner 的仓级定位与 L5 层归属。 |
| `standards/document/全局项目依赖关系与裁剪规则.md` | §2、§4、§5、§6 | 编译期、运行期、事件协作依赖的分类及本仓裁剪要求。 |
| `projects/L0-sdk/00-需求文档.md` | §2、§6、§12 | SDK 作为官方客户端/服务访问封装，不拥有业务或运行真相。 |
| `projects/L1-artifact/00-需求文档.md` | §2、§7、§11、§12 | Artifact fact/version/lineage/baseline 与消费引用的 owner 边界。 |
| `projects/L1-governance/00-需求文档.md` | 治理事实与边界章节 | Policy、Gate、Decision、Approval、Control 的正式治理 owner 语境。 |
| `projects/L1-work/00-需求文档.md` | Project / ProjectMember / WorkItem 章节 | 项目与工作事实的 owner 边界，以及 Runner 仅消费项目语境的依据。 |
| `projects/L1-workspace/draft/01~03_*.md` | 定位、功能、分层 | 只读 view、projection-cache、safe summary/reference、query no-write 的可借鉴结构。 |
| `projects/L2-runtime/00~03-*.md` | Runtime truth、control、outcome、recovery | Runtime execution truth 不归 Runner，以及状态/结果只能通过正式 read surface 消费。 |
| `projects/L4-sandbox/00~03-*.md` | controlled execution、lease、cleanup、capture、handoff | Sandbox boundary/lease/cleanup owner、`accepted` 不等于 `running` 的边界。 |
| `projects/L4-observability/00~03-*.md` | diagnostic、audit projection、handoff、retention | 本地诊断不能成为正式 evidence/report/verdict 的边界。 |
| `projects/L4-archive/00~04-*.md` | archive/restore/handoff | Archive 不反向定义 Runner 运行成功，正向合同保持条件性。 |

## 6. 取舍与未采用方案

- 采用“产品叙事 + owner 正式文档 + 全局依赖规则”三类来源联合收束，不采用旧 Runner 文档单独作为需求来源。
- 采用“Runner 消费上游能力”作为本文主题，不采用“Runner 重新定义 Release、Sandbox 或 Runtime”的方案。
- 对尚未闭合的 Release locator、Governance authority、Sandbox adapter、Observability handoff 等主题只登记为后续 blocker，不在 Step 1 提前假定协议。

## 7. 回填草稿

正式 `00` §1 将使用“来源映射表 + 一段收束说明 + historical material 处置说明”结构。正文只表达来源与承接范围，不写 Runner 具体边界、功能编号、接口名或实现组件。

## 8. 自检与进入下一步门禁

- [x] 来源映射逐项列出，没有把多个无关主题压成一个模糊来源。
- [x] 承接内容只写主题，不写接口、字段、实现或验收细节。
- [x] 已明确本文是 Runner 需求层细化，不重新定义上游 owner truth。
- [x] README/旧文档被标为 historical material，没有继承旧技术和指标。
- [x] Step 1 已具备回填正式 §1 的材料。

`Step 1 gate_status = pass`；下一步允许进入 `Step 2 本仓定位与边界`。
