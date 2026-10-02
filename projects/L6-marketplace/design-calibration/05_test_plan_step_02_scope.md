# Step 2：明确测试目标、范围与非范围

> 对应 SOP：测试方案讨论流程 Step 2
> 回填章节：`05-测试方案.md` §2

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 2 测试目标、范围与非范围 |
| 当前状态 | completed / stop_review |
| 输入 | Step 1、00～04、03 Step16 |
| 输出 | P0/P1/P2 目标、范围、非范围和一票否决 |

### Step内计划与门禁字段

| 计划项 | 状态 | 可审查产物/门禁 |
|---|---|---|
| 读取输入与前序结论 | done | §2；前序：05_test_plan_step_01_input_boundary.md（含诊断、取舍、未确认项） |
| SOP逐问题回答 | done | §3，回答所有适用问题 |
| 当前/历史材料诊断 | done | §4，不继承historical truth |
| 设计取舍 | done | §6，采用/未采用理由 |
| 结构化产物 | done | §7；编号/字段/归属可反查 |
| 复杂度判断 | done | 主控内按表/单元组织，不需新增业务附录 |
| 回填草稿 | done | §8；只候选，正式写入等Step15 |
| 自检/下一步 | done | §9/10，外部资格不关闭 |

`gate_status=pass`；`gate_reason`=本Step设计审查完成，执行仍not-run；`next_allowed_action`=§10下一Step阅读/设计；`source_files`=§2列出的正式输入与前序文件。上述done是本Step内容事实，不是测试执行或用户/owner签核。

## 2. 本步输入与目标

输入：Step1已回核输入权威表；正式00§4/9～14、03§15/17、04§6/12；SOP Step2和书写规范§5.2。输出：测试目标、P0/P1/P2、非范围责任、VETO映射。当前只授权05，不提前执行06/07。

## 3. SOP 问题回答

| 问题 | 回答 |
|---|---|
| P0主链须证明什么？ | 七U全部入口、状态、原子写集、current disclosure、Unknown/probe、原完整结果、配置安全；controlled positive只证明本地映射。 |
| P1/P2怎样处理？ | 实际owner exact合同未就绪的正向集成blocked；容量/长期保留future，不以P0文档自检关闭。 |
| 哪些下游只测接缝？ | Source/Publisher/Material/Governance/Scope/Receiver/Notice/Observation八slot，测试不实现owner内部。 |
| 非范围风险归谁？ | 资产正文/身份/审批/安装/财务分别归owner；容量归产品/平台；残余风险接收角色待06明确。 |
| 哪些关联VETO？ | 复制truth/secret、自行批准、scope绕过、ACK安装/财务、撤回后新分发与伪恢复均P0。 |

## 4. 当前文档问题诊断

旧05§1/§2的commerce/install对象范围与正式00非目标不一致；现有05初稿用`STATE/OBSERVABILITY/REDACTION`作TC族但flow只允许九族，须在Step5/6统一到`CROSS/RECOVERY/CONFIG`，证据层级可保留REDACTION。

## 5. 改动前后对比

| 项 | 前 | 后 | 原因 |
|---|---|---|---|
| 集成范围 | fake/真实资格可能混合 | P0本地、P1 exact integration、P2容量分别标记 | 不从拒绝测试推导核心集成成立 |
| TC族 | 未定义STATE等族 | 固定九族；carrier测试由CROSS承担 | 编号可唯一审计 |

## 6. 测试设计取舍

| 方案 | 优点 / 代价 | 结论 |
|---|---|---|
| 分层证明，外部positive blocked显式保留 | 能推进本地设计；不宣称可部署 | 采用 |
| 等待所有owner就绪后才写任何case | 无误判风险但阻塞可定义的负向/本地验证 | 不采用 |
| 将集成资格缺失作为可风险接受的普通缺陷 | 易完成门禁但会绕过authority | 禁止 |

## 7. 结构化中间产物

测试应证明 Marketplace 的局部事实、边界和失败语义可以按正式设计落码，而不是证明外部 owner 已经 ready。P0 聚焦本仓可控制的契约、状态、事务、幂等、配置和安全；P1/P2 只在正式依赖可用时追加，不得成为伪造 P0 pass 的理由。

### 7.1 测试目标表

| 目标 | 测试问题 | 优先级 |
|---|---|---:|
| T-MP-1 责任边界 | publisher/source/material 引用是否不可变、可追溯且不复制正文？ | P0 |
| T-MP-2 审核 handoff | 申请、review handoff、正式 Governance 决定和 market version 是否严格绑定？ | P0 |
| T-MP-3 目录与版本 | 搜索、分类、详情、版本选择是否受 current scope/visibility/withdrawal 约束？ | P0 |
| T-MP-4 分发局部状态 | intent/relation/attempt/receiver outcome 是否区分，ACK 是否不等安装/支付？ | P0 |
| T-MP-5 撤回通知 | withdrawal、impact、notice、Unknown 和恢复是否保留局部责任？ | P0 |
| T-MP-6 一致性与幂等 | 21C/12J 原结果、canonical fingerprint、A/B fault、PG frame/CAS 是否稳定？ | P0 |
| T-MP-7 读模型安全 | Query/replay/projection 是否 no-write、同谓词分页、manifest 完整且不泄漏？ | P0 |
| T-MP-8 配置与安全 | 04 的七字段、八 slot、四 profile、secret redaction、fail-fast 是否可测？ | P0 |
| T-MP-9 Web/entry 语义 | API/Worker/Web 映射、EN/ZH、loading/blocked/unknown 等状态是否不改变事实？ | P0 |
| T-MP-10 外部正向资格 | 正式 owner/SDK/provider/receiver/notice/observation 是否已通过真实合同？ | P1/blocked |
| T-MP-11 容量与真实产品 | 具体 PG/网络/供应商的性能、SLO、长期保留是否成立？ | P2/future |

### 7.2 范围与非范围

| 范围 | 本轮处理 |
|---|---|
| 领域/协议 | U1～U7 全部 43 对象、21 Command、16 Query、12 Job、49 独立 flow |
| 状态 | 14 carrier 的合法/非法/terminal/Unknown/late 转换 |
| 持久化 | unique/FK/CAS/revision、frame/upper/as-of、原子写集、rollback/commit unknown |
| 依赖接缝 | typed owner adapter、SDK qualification、controlled fake、scope/receiver/notice/observation blocked |
| API/Worker/Web | trusted metadata、HTTP mapping、worker A/B/fence/shutdown、runtime DTO、EN/ZH workflow |
| 配置/证据 | 04 六域/七字段/八 slot/四 profile、redaction、future evidence schema |

| 非范围 | 原因 |
|---|---|
| Method/Role/ProcessTemplate/Capability Registry/Adapter/Member Image/Artifact 正文与血缘 | owner truth，不由市场复制 |
| Identity truth、publisher 人类/组织认证、Governance approval | 外部 authority，不由测试方案生成 |
| 安装、激活、付款、订阅、收入分成、跨境交易、Billing ledger | 当前无正式 owner，future/blocker |
| Archive export/restore、active event/outbox、外部审计完成 | 当前无正式 lane/schema |
| 推荐、评分、评论、收藏、高级 analytics | 00 非核心增强 |
| 具体产品性能、真实网络送达、生产容量和合规认证 | 选型/基线未闭合，只保留 candidate |

### 7.3 P0/P1/P2 与一票否决

| 层级 | 处理 | 不得宣称 |
|---|---|---|
| P0 | 本地纯逻辑、controlled/fake seam、PG contract/integration、API/Worker/Web、配置和 redaction | 真实 owner、安装、支付、通知送达或 ready |
| P1 | owner/SDK/receiver/notice/observation exact contract 可用时 selected run | 没有 qualification 时不得写 passed |
| P2 | 真实产品容量、长期归档、外部认证和增强体验 | 不阻断 P0，但进入 residual/future |

`VETO-MP-1` 复制/伪造外部 truth；`VETO-MP-2` 本地生成 approval；`VETO-MP-3` 绕 scope/visibility/withdrawal；`VETO-MP-4` ACK=installed 或无 Billing 造 paid；`VETO-MP-5` 撤回后新分发、Unknown 当成功、篡历史或泄漏证据。命中任一项不得风险接受。

### 7.4 范围决策摘要

| 议题 | 取舍 |
|---|---|
| 是否以旧安装/交易故事为主 | 否，按 U/契约/状态/事务组织 |
| 是否要求所有外部系统先可用 | 否，P0 用 controlled seam；positive 资格单独 blocked |
| 是否把性能阈值写死 | 否，当前只定义测量方法和趋势，数值转入 06 |
| 是否测试 UI 点击等于业务结果 | 否，UI 只验证 DTO/状态呈现和不误导 |

### 7.5 核心能力范围矩阵

| C-MP | 主要测试族 | 直接来源 |
|---|---|---|
| C1 来源与责任 | `SOURCE`、`CONFIG`、`CROSS` | FR101～103、BR101～104、AC101～103 |
| C2 审核与上架 | `REVIEW`、`CROSS`、`RECOVERY` | FR201～203、BR201～204、AC201～203 |
| C3 目录与选择 | `CATALOG`、`REFERENCE`、`CROSS` | FR301～303、BR301～304、AC301～303 |
| C4 分发 | `DISTRIBUTION`、`CROSS`、`RECOVERY` | FR401～403、BR401～404、AC401～403 |
| C5 撤回与恢复 | `WITHDRAWAL`、`RECOVERY`、`CROSS` | FR501～504、BR501～505、AC501～504 |

## 8. 回填草稿

正式 §2 应采用上述目标/范围表；`MP-UP-001～008`、`MP-SRC-003/010/013`、`Q-MP-01` 仍是资格/容量 blocker。进入 Step3 的条件是每个目标都能回指 03 对象或 04 配置，不需要在用例阶段创造业务字段。

## 9. 待确认事项与详细设计影响判定

外部positive资格和容量输入见03§17；`MP-SRC-003`沿03是技术栈差异，不是publisher/auth，后者为MP-UP-003。无新增对象、状态或配置项，不回写03；TC命名修正只影响05。

## 10. 进入下一步条件

目标/非范围、九族、风险归属已文档自检；`gate_status=pass`，允许读取SOP Step3/规范§5.3与03 Step16并进入对象切口。正式回填等Step15；不代表运行通过，无需commit。
