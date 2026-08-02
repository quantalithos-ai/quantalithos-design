# Step 1. 确认测试输入边界

> 对应SOP: `standards/document/测试方案讨论流程_SOP.md` Step 1
> 书写规范: `standards/document/测试方案书写规范.md` §5.1
> 回填章节: `05-测试方案.md` §1 与上游文档的关系声明
> 生成日期: 2026-07-12
> 状态: reviewed_passed_to_step_2
> 所属流程: `05_test_plan_calibration_flow.md`
> 本Step口径: 只确认测试方案的权威输入、边界、直接测试来源、historical material和上游缺口。本步不分配TC / EV编号,不设计用例、数据、环境、suite、脚本、报告路径或通过结论,不修改旧正式`05`。

---

## 1. Step开工确认与状态

| 检查项 | 结论 |
|---|---|
| 用户是否确认正式`04`并允许进入`05` | 是。用户审查正式`04-配置设计.md`后回复“同意”,本次只放行`05` Step 1。 |
| 项目级台账是否允许进入Step 1 | 是。原恢复点为`04` Step 15 `pass_wait_user_review`;用户确认后允许创建`05` flow和Step 1。 |
| 文档级flow是否先于本文件创建 | 是。`05_test_plan_calibration_flow.md`已先创建并记录`step_01_in_progress`。 |
| 是否读取测试方案SOP和书写规范 | 是。已读取15步主链、Step 1问题、正式15章结构、用例 /证据真实性和详细设计闭环规则。 |
| 是否读取正式`00~04` | 是。正式`00~04`是唯一当前测试设计上游。 |
| 是否读取直接中间产物 | 是。已读取`03_ddd_step_16_test_cuts.md`和`04_config_step_12_downstream_handoff.md`。 |
| 是否读取historical material | 是。旧`README.md`、旧`05-测试方案.md`、旧`06-验收标准.md`已后置读取。 |
| 是否参考L1粒度 | 是。参考L1-governance / L1-artifact测试flow和Step 1结构,不继承领域对象、用例或证据。 |
| 当前状态 | 输入边界、historical隔离、evidence消费边界和上游影响判定已完成;用户已审查并允许进入Step 2 |
| 停审方式 | 用户已解除本Step门禁;当前由`05_test_plan_step_02_scope.md`接续 |
| 是否发现阻塞本Step的上游blocker | 否。正式`00~04`、详细设计test cuts和配置handoff足够启动测试范围设计。实现仓、真实产品、P05+资格和新版`06`是后置门禁。 |

---

## 2. 本步目标与非范围

本Step必须回答:

1. 当前测试方案承接哪些需求、规则、非功能目标、设计契约和配置红线。
2. 哪些概要 /详细设计章节直接决定后续测试对象与测试切口。
3. 哪些验收命题需要`05`未来提供evidence schema和真实执行证据。
4. 哪些内容不允许在测试方案中重新定义。
5. 上游是否存在会阻塞Step 2的缺口,以及后续发现缺口时如何回写。
6. 旧`README/05/06`哪些内容必须隔离为historical material。

本Step不定义:

- P0 / P1 / P2测试范围和优先级;留给Step 2。
- 完整测试对象、测试切口和测试层级;留给Step 3 / 4。
- 测试场景、TC编号、断言、fixture、数据和环境;留给Step 5~8。
- suite、脚本、CI门禁、artifact / report路径和执行命令;留给Step 9。
- 性能阈值、专项方法、缺陷分级、进出准则、证据归档和残余风险;留给Step 10~14。
- 正式`05-测试方案.md`;只允许Step 15装配。
- 真实测试执行、run_id、EV alias、report、pass / fail、验收签署、risk acceptance或release事实。

---

## 3. 本步输入

| 输入 | 状态 | 本Step用途 |
|---|---|---|
| `project_execution_ledger.md` | current recovery ledger | 确认`04`已审查、`05`只允许从Step 1开始 |
| `00-需求文档.md` | current reviewed baseline | 抽取C-SBX、FR、BR、AC、VF、六类NFR、truth / data / dependency边界 |
| `01-架构设计.md` | current architecture baseline | 抽取职责、运行单元、依赖类型、数据所有权、一致性、交互和架构红线 |
| `02-概要设计.md` | current formal baseline | 抽取六个主要组成部分、关键对象、接口骨架、flow family、六组状态、异常和配置影响 |
| `03-详细设计.md` | current direct test baseline | 抽取七模块、对象、port、协议、flow、state、transaction、error、idempotency、config、observability和§15切口 |
| `03_ddd_step_16_test_cuts.md` | current explanatory direct input | 提供模块 /协议 /状态 /一致性 /幂等 /并发 /错误 /配置 /观测最小验证候选 |
| `04-配置设计.md` | current direct test baseline | 抽取source / profile / item / sensitive / load / change / failure / evolution / risk测试输入 |
| `04_config_step_12_downstream_handoff.md` | current explanatory direct input | 提供TSH / FDT / AHG / EHR planned handoff和证据成熟度 |
| `全局项目依赖关系与裁剪规则.md` | current standard | 约束compile / runtime / event / handoff测试协作方式和跨仓裁剪 |
| 测试方案SOP /书写规范 /通则 /真相源标准 | current standards | 约束Step顺序、15章、设计回指、证据真实性和可执行粒度 |
| 旧`05-测试方案.md` | historical_material | 识别旧对象、旧case、旧环境、旧suite和旧阈值污染 |
| 旧`06-验收标准.md` | historical_direction_input | 识别旧验收关注方向;不继承门禁、checkbox、签署或证据 |
| `README.md` | historical_material | 识别旧产品、目录、安全profile和性能数字污染 |
| L1-governance / L1-artifact Step 1 | granularity_reference | 参考结构与深度,不继承结论 |

---

## 4. Step内执行记录

| 序号 | 动作 | 状态 | 产物 /门禁 |
|---:|---|---|---|
| 1 | 恢复项目台账、`04` flow和Step 15 | done | 用户确认正式`04`,允许进入`05` Step 1 |
| 2 | 读取测试方案SOP和书写规范 | done | 固定15步 / 15章主链和Step 1边界 |
| 3 | 创建`05_test_plan_calibration_flow.md` | done | flow先于Step文件创建 |
| 4 | 读取正式`00~04`及直接test / config handoff | done | 形成当前权威测试输入池 |
| 5 | 后置读取旧`README/05/06`与L1参考 | done | historical冲突和粒度参考分离 |
| 6 | 回答SOP问题并形成结构化中间产物 | done | 未提前进入scope / case / evidence设计 |
| 7 | 完成影响判定、回填草稿和进入条件 | done | 当前无unresolved上游blocker |
| 8 | 更新flow和项目台账 | done | Step 1已审查,恢复点由Step 2接续 |

---

## 5. SOP问题回答

| SOP问题 | 本Step回答 |
|---|---|
| 当前测试方案要承接哪些需求、规则和非功能目标 | 承接C-SBX-1~5、US-SBX-001~016、FR-SBX-001~018、BR-SBX-001~033、AC-SBX-001~041、VF-SBX-001~010和性能 /可用性 /安全 /审计追溯 /幂等一致性 /可观测性六类NFR。FR / US的E01~E06是外围增强方向,不在本Step提前判为P0。 |
| 哪些概要 /详细设计章节直接影响测试对象 | `02` §5~§11提供六个组成部分、对象、接口、flow、六组状态、异常和配置影响。`03` §5~§15提供七模块、对象 / port、10 Command、13 Query、9 Consumer、13 Outbound Event、10 Job、函数流、状态、事务、错误、幂等、配置、观测和测试切口。 |
| 哪些验收项需要测试方案提供证据 | 正式`00` AC-SBX-001~041和VF-SBX-001~010需要后续测试证据支撑。`04` AHG-01~19和EHR-01~20是planned验收 /证据承接要求,必须在`05`展开为测试切口、场景、断言和evidence schema,但不得在本Step或设计仓伪造EV alias / run_id /结果。 |
| 哪些内容不应在测试方案中重新定义 | 不重新定义需求编号、truth ownership、架构、对象字段、DTO、port、protocol、flow、state、error、transaction、idempotency、config item、failure disposition或验收裁决。测试方案只定义如何验证正式契约。 |
| 当前上游是否存在会阻塞测试设计的缺口 | 未发现阻塞Step 2的缺口。正式`00~04`与`03` test cuts、`04` handoff足以定义目标 /范围。目标实现仓、真实suite、产品、平台资格、新版`06`和P05+证据尚未形成,但分别阻塞真实执行、激活或验收,不阻塞当前测试设计。 |

---

## 6. 当前文档问题诊断

| 位置 | 当前问题 | 本Step处理 |
|---|---|---|
| 旧`05-测试方案.md`结构 | 只有13章,缺当前15章主链、逐章calibration来源、测试对象 /切口独立章节和证据真实性闭环 | 标记historical;Step 1~14重建输入,Step 15整体替换 |
| 旧`05`对象主线 | 使用`SandboxExecution / SandboxSession / SandboxCommand / SandboxOutput`、五个旧主要部分和旧service动作 | 不继承;后续只从正式`02/03`的当前对象、协议、状态和flow抽取 |
| 旧`05`用例 | 预置`TC-001~012`,断言CreateSession、RunCommand、ReplayExecution等旧协议 | 不复用编号或语义;Step 5 / 6后按当前切口重新分配 |
| 旧`05`环境 | 写入dev / test / staging、local host runtime、cleanup disabled、replay enabled和real-like host | 不作为当前环境事实;Step 8从`04` PROFILE-01~07与依赖裁剪规则重建 |
| 旧`05`产品 /阈值 | 固化capability allowlist、artifact / observability consumer和100%回收 /留痕等旧口径 | 产品降级为historical;正式零容忍只承接`00` VF / NFR,其他阈值在Step 10重新判定 |
| 旧`06-验收标准.md` | 继承旧五主线、旧对象、旧环境和空checkbox | 仅作方向输入;新版`06`必须在正式`05`后full-restart |
| `README.md` | 固化Docker + gVisor、Firecracker、旧目录、旧审计事件和启动 /销毁 /网络开销数字 | 只记录历史污染风险,不得成为测试产品或阈值真相 |
| 当前实现 /执行事实 | 目标实现仓、suite、脚本、CI、run和evidence尚未形成 | 不阻塞设计;任何实际结果必须由后续实现和执行形成 |

---

## 7. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 测试校准入口 | 缺`05_test_plan_calibration_flow.md` | 已先创建当前full-restart flow | 满足中间产物先行 |
| 正式输入 | 旧`05/06/README`可能与`00~04`混读 | 正式`00~04`唯一权威;direct Step输入只作解释 | 防止历史口径覆盖当前设计 |
| 测试对象来源 | 旧五主线和旧对象 | `02`六组成部分、`03`七模块 /当前协议 /状态 /切口 | 保证后续可回指 |
| 配置测试来源 | 旧环境flag和cleanup disabled | `04` PROFILE、I001~I101、TSH / FDT和failure disposition | 保持配置真相唯一 |
| 验收 /证据 | 旧`06`空checkbox和设计handoff可能被误当结果 | AC / VF、AHG / EHR只作为待证明命题;真实证据尚不存在 | 防止伪造 |
| 上游缺口处理 | 测试方案可能自行补schema /状态 /错误 | 不可验证即登记blocker并回写`00/03/04` | 测试不替代设计 |

---

## 8. 测试设计取舍

| 议题 | 方案 | 取舍 |
|---|---|---|
| 是否直接重写正式`05` | A. 直接改旧文档;B. 先走Step 1~14 | 采用B。正式文档只在Step 15装配。 |
| 是否继承旧TC | A. 沿用TC-001~012;B. 后续按当前切口重新编号 | 采用B。旧协议与当前正式`03`不一致。 |
| 是否等待目标实现仓 | A. 等实现后再设计;B. 先定义product-neutral验证契约 | 采用B。实现缺失阻塞执行,不阻塞测试设计。 |
| 是否等待新版`06` | A. 等`06`;B. 先由`05`定义证据产出面 | 采用B。`06`后续消费并裁决,不能反向定义测试范围。 |
| 是否把TSH / FDT当case | A. 直接改名为TC;B. 保持handoff并在Step 3~6展开 | 采用B。handoff不是可执行case。 |
| 是否把EHR当EV evidence | A. 预分配真实EV;B. 只保留planned requirement | 采用B。真实alias / run /文件 /结果必须由执行形成。 |
| 是否锁定backend / provider | A. 当前锁定;B. 按fake / controlled / candidate / real-like资格分层 | 采用B。保持产品中立和P05+资格门禁。 |

---

## 9. 结构化中间产物

### 9.1 上游权威顺序

```text
current formal truth
  00 requirements
    -> 01 architecture
      -> 02 high-level design
        -> 03 detailed contracts + formal test cuts
          -> 04 configuration contracts + planned test handoff
            -> 05 test design

historical README / 05 / 06
  -> pollution-risk and direction audit only
  -> never overrides current 00~04
```

关键说明:

- 正式文档优先于同阶段calibration解释产物;calibration用于追溯推导细节。
- `03_ddd_step_16_test_cuts.md`和`04_config_step_12_downstream_handoff.md`只能解释正式`03/04`,不能增加新契约。
- 旧`05/06`没有因文件名更接近测试 /验收而获得更高权威。
- 上游sibling文档只用于核对runtime / event / handoff接缝;不得把tools semantics、runtime agent loop或member lifecycle变成sandbox测试对象。

### 9.2 上游输入映射表

| 来源文档 | 测试输入 | 预计回填章节 |
|---|---|---|
| `00-需求文档.md` | C-SBX-1~5;US-SBX-001~016;FR-SBX-001~018;BR-SBX-001~033;AC-SBX-001~041;VF-SBX-001~010;六类NFR;truth / snapshot / ref / forbidden-body边界 | `05` §1 / §2 / §5 / §10 / §12~§14 |
| `01-架构设计.md` | 职责 /非职责;上下游;运行单元;依赖类型;数据所有权;一致性;通信;产品中立;no weak fallback;横切红线 | `05` §1 / §3 / §4 / §8 / §10 / §14 |
| `02-概要设计.md` | 六个主要组成部分;关键对象;Command / Query / Consumer / Event / Job / Port骨架;flow family;六组状态;异常;配置影响 | `05` §1 / §3 / §4 / §6 / §8 |
| `03-详细设计.md` | 七模块;对象 / trait / port;10 Command;13 Query;9 Consumer;13 Outbound Event;10 Job;flow;state;transaction;error;idempotency;config;observability;§15最小切口 | `05` §1 / §3~§7 / §9~§11 / §14 |
| `03_ddd_step_16_test_cuts.md` | 模块 /协议 /状态 /一致性 /幂等 /并发 /错误 /配置 /观测切口和script contract候选 | `05` §3 / §4 / §6 / §9 / §10 |
| `04-配置设计.md` | S00~S08;ENV-01~07;PROFILE-01~07;I001~I101;40配置组;D01~D44;sensitive 40;load /change /failure /risk | `05` §1~§3 / §5~§10 / §12~§14 |
| `04_config_step_12_downstream_handoff.md` | TSH-01~20;FDT-01~30;AHG-01~19;EHR-01~20;planned evidence成熟度;profile /控制面 /40组 /44域下游责任 | `05` §3 / §5 / §6 / §8~§10 / §12~§14 |
| L2-tools / L2-runtime / L2-member-service正式设计 | sandbox调用方runtime seam、请求 /结果 /失败和事件协作方向 | 只通过本仓正式`00/01/03`锚定;Step 3 / 8按需核对,不直接扩张范围 |
| L1-identity / L1-work正式设计 | actor / member / project / work refs与责任语境方向 | 只验证ref / summary / fail-closed接缝,不测试其内部lifecycle |
| 旧`05-测试方案.md` | 旧五主线、TC-001~012、旧环境 / suite / evidence方向 | historical diagnosis only;不直接回填 |
| 旧`06-验收标准.md` | 旧功能 /安全 /三红线方向 | historical direction only;不直接回填 |
| `README.md` | 旧产品、目录、安全profile和候选性能目标 | historical pollution audit only |

### 9.3 当前正式输入清点

| 输入族 | 已收稳集合 | Step 1结论 | 后续owner |
|---|---|---|---|
| 核心能力 | C-SBX-1~5 | 必须形成端到端可验证闭环,但具体P0分层由Step 2决定 | Step 2 / 5 |
| 用户故事 | US-SBX-001~016;E01~E06 | 核心故事进入覆盖候选;增强故事不自动成为P0 | Step 2 / 5 |
| 功能需求 | FR-SBX-001~018;E01~E06 | 18条核心功能必须有测试去向;增强项按范围判定 | Step 2 / 5 |
| 业务规则 | BR-SBX-001~033 | 不变量、禁止行为、显式变化、边界和审计约束均进入负向 /边界候选 | Step 3 / 5 / 6 |
| 验收命题 | AC-SBX-001~041 | `05`提供证据生产契约,不做最终裁决 | Step 5 / 12 / 13 |
| 一票否决 | VF-SBX-001~010 | 每项必须有可执行负向 /边界测试去向 | Step 2 / 5 / 6 / 10 |
| 非功能 | 性能、可用性、安全、审计追溯、幂等一致性、可观测性 | 正式零容忍命题与候选性能数字必须分离 | Step 10 |
| 模块 | contracts / domain / application / infra / api / worker / jobs | 七模块均有最小验证入口 | Step 3 / 4 |
| 协议 | 10 Command / 13 Query / 9 Consumer / 13 Outbound Event / 10 Job | 后续逐协议族抽切口;当前不分配TC | Step 3 / 6 |
| 状态 | 六组并行状态主题 | 合法 /非法转换、传播与read-side no-write均需验证 | Step 3 / 6 |
| 一致性 | UoW、version、cursor、rollback visibility、stored replay、dedup、race | 必须验证fake / durable语义和no-repair / no-rollback | Step 3 / 6 / 10 |
| 配置 | 101 item、40 group、44 domain、9 source、7 profile | TSH / FDT必须展开为测试对象和可执行case | Step 3 / 5 / 6 / 8~10 |
| 敏感配置 | 23 material-capable / 15 reference-only / 2 test-only | carrier、resolve、lease、rotation、revocation和no-output均需验证 | Step 3 / 6~10 |
| planned handoff | TSH-01~20、FDT-01~30、AHG-01~19、EHR-01~20 | 保持planned requirement;不得直接改名为TC / EV | Step 3 / 5 / 6 / 13 |

### 9.4 用户重点边界到测试输入追溯

| 重点边界 | 正式测试输入 | 后续必须证明 | 不得混入 |
|---|---|---|---|
| execution environment identity | C-SBX-1;FR-SBX-001~003;BR-SBX-001~005;`ControlledExecutionContext` / `ExecutionEnvironmentIdentity` | 来源、actor / responsibility / refs、accepted / rejected与跨调用方一致 | identity / work / runtime正文或默认匿名语境 |
| resource limits | C-SBX-2;FR-SBX-004~006;BR-SBX-006~010;`CoherentBoundary` | limit可落实、边界整体成立、unsupported显式拒绝 | silent ignore、clamp或host fallback |
| filesystem boundary | BR-SBX-007~010;boundary profile / template;NCFG / XVAL | filesystem requirement与其他三维同generation生效 | debug / local放宽、raw host path正文 |
| network boundary | BR-SBX-007~017;policy / boundary summary | deny-by-default、policy缺失 / stale / conflicted fail-closed | sandbox定义allowlist truth |
| process boundary | coherent boundary;backend capability;redline | process / privilege requirement可验证,弱承载不得启动 | host-run、best-effort process guard |
| tool / runtime launch policy | C-SBX-3;FR-SBX-007~010;policy协议 / flow | 只消费给定summary,missing / unauthorized / unsupported阻断 | tools semantic execution、runtime agent loop |
| artifact capture | C-SBX-4;FR-SBX-011~014;`CaptureFact` / `HandoffFact` | capture / handoff分层、candidate不升格truth、failure不伪success | artifact formalization内部流程 |
| observability hooks | usage / audit / trace / metric material;safe carrier | safe字段、低基数、formal audit独立、handoff failure显式 | observability store truth / raw body |
| failure classification | C-SBX-5;FR-SBX-015~017;error / state / FDT | deny / timeout / backend / capture / orphan / redline分类稳定 | raw error string推断domain state |
| cleanup / lease / reaper | FR-SBX-017~018;BR-SBX-027~032;cleanup / lease / orphan状态 | guard先于删除、expiry / orphan保守收束、重复signal一致 | runtime recover、business replay、force-clean |
| security redlines | FR-SBX-016;BR-SBX-026/033;VF-SBX-007~010 | detected -> contained、调查交接、no advisory-only、no leak | risk acceptance绕过或普通feature flag关闭 |

### 9.5 测试方案不再回答的问题

- 不重新定义sandbox是否拥有execution isolation truth。
- 不重新定义C-SBX / FR / BR / AC / VF语义、架构依赖方向或数据所有权。
- 不重新定义`03`对象字段、enum、DTO、trait / port、protocol、flow、transaction、error、idempotency key或public surface。
- 不重新定义`04` source priority、profile资格、I001~I101、40组 /44域、sensitive分类、加载、变更、failure disposition或veto。
- 不测试tools semantic execution、runtime agent loop、member lifecycle orchestration、artifact formalization或observability storage的完整内部实现。
- 不选择Docker / gVisor / Firecracker、store、bus、provider、scheduler、sink、CI或报告产品。
- 不声明实现、测试、evidence、qualification、验收、发布或迁移已经发生。
- 不制定implementation phase / commit boundary、部署命令、runbook或SLO。

### 9.6 测试方案必须回答的问题

- P0 / P1 / P2和非范围如何从正式需求、VF、设计风险及profile资格推导。
- 每个模块、对象、协议、状态、事务、一致性、幂等、错误、配置和观测契约对应什么测试切口。
- 每个P0切口在哪一层发现风险,以及为何不能推迟到E2E。
- C-SBX、FR、BR、AC、VF、TSH、FDT如何双向追溯到场景、用例候选和evidence requirement。
- 正向、负向、边界、非法转换、并发、rollback、依赖失败、retry / replay / recovery场景如何构造和断言。
- 测试数据如何可重复、隔离、清理,且不保存真实secret、外部正文或下游truth。
- PROFILE-01~07、fake / controlled / candidate / real-like如何进入环境矩阵,且不伪造资格。
- 哪些suite进入PR / CI / nightly / staging / release gate,失败是否阻断,输出什么schema。
- AC / VF和AHG / EHR需要何种真实evidence,如何归档、脱敏和交给新版`06`裁决。
- 哪些未覆盖风险触发上游回写、回归或后续阻塞。

### 9.7 初始测试输入候选表

| 候选输入 | 来源 | 当前成熟度 | Step 1处理 | 后续Step |
|---|---|---|---|---|
| 五节点核心闭环 | `00` C-SBX-1~5 | current formal | 进入目标 /范围候选 | 2 / 5 |
| 18核心功能 + 33规则 | `00` FR / BR | current formal | 进入对象 /覆盖 /负向候选 | 2 / 3 / 5 / 6 |
| 41 AC + 10 VF | `00` | current formal requirement | 进入evidence / veto测试方向,不做裁决 | 2 / 5 / 6 / 10 / 12 / 13 |
| 六组成部分 /六状态组 | `02` | current formal | 进入对象 /flow /状态切口候选 | 3 / 4 / 6 |
| 七模块与五类协议 | `03` | current formal | 进入模块 /协议测试候选 | 3 / 4 / 6 |
| transaction / idempotency / race | `03` §10~§12 | current formal | 进入一致性 /并发 /恢复候选 | 3 / 6 / 10 |
| config / observability contracts | `03` §13~§15 | current formal | 进入配置 /观测 /脚本候选 | 3 / 6 / 9 / 10 |
| TSH-01~20 / FDT-01~30 | `04` Step 12 | planned handoff | 必须展开,不能直接当case | 3 / 5 / 6 / 8~10 |
| AHG-01~19 / EHR-01~20 | `04` Step 12 | planned acceptance / evidence requirement | 保留待证明命题,不生成EV | 5 / 12 / 13 |
| 40配置组 / 44域 / sensitive 40 | `04` | current formal config | 进入配置专项与环境候选 | 3 / 5 / 6 / 8~10 |
| 旧TC-001~012 /旧五主线 | 旧`05` | historical only | 不继承编号、对象和断言 | 后置差异审计 |
| 旧门禁 / checkbox /签署 | 旧`06` | historical only | 不作为acceptance或result | 后续`06`重建 |

### 9.8 Evidence与验收消费边界

| 单元 | 当前含义 | `05`可做 | `05`不可做 | 下游owner |
|---|---|---|---|---|
| AC-SBX / VF-SBX | 正式需求层验收命题 /否决项 | 建立测试覆盖和证据生产要求 | 宣布通过、否决或risk acceptance | 新版`06` |
| AHG | 配置设计的planned acceptance handoff | 转成测试场景和future evidence class | 直接分配正式AC或填pass | 新版`06` |
| EHR | Evidence Handoff Requirement | 定义producer、schema、redaction、traceability | 当作EV alias、文件、digest或结果 | Step 13 +真实执行 |
| TSH | Test Strategy Handoff | 转成切口、层级、环境、断言和风险 | 直接当作用例 | Step 3~10 |
| FDT | Failure Design Test cut | 至少映射到一个可执行case候选 | 以“集成测试覆盖”省略正式断言 | Step 5 / 6 |
| TC | 未来测试用例ID | Step 5 / 6按规范分配planned ID | 本Step提前分配或声称执行 | Step 5 / 6 |
| EV | 真实或planned evidence alias | Step 13定义命名 / schema规则 | 当前生成真实alias、run_id或pass结果 | test execution + `06` |

### 9.9 Historical Material与Blocker记录

| ID | 材料 /缺口 | 状态 | 风险 | 当前处理 |
|---|---|---|---|---|
| SBX-TEST-HIST-README-001 | `README.md` | contained_as_historical_material | Docker + gVisor、Firecracker、旧目录 /事件 /安全profile /时延数字回流 | 只保留污染风险;产品与阈值后续重新判定 |
| SBX-TEST-HIST-PLAN-001 | 旧`05-测试方案.md` | contained_as_historical_material | 旧对象、旧五主线、TC-001~012、host runtime、cleanup disabled和旧suite回流 | 不继承结构、编号、对象、环境、断言或结果 |
| SBX-TEST-HIST-ACCEPT-001 | 旧`06-验收标准.md` | contained_as_historical_direction | 旧五主线、旧证据、空checkbox和签署结构被误当当前门禁 | 只保留安全 /边界方向;新版`06`后续重建 |
| SBX-TEST-INPUT-001 | 正式输入映射 | resolved_for_test_step_1 | `00~04`测试输入此前未统一 | §9.1~§9.8已收稳 |
| SBX-TEST-EXECUTION-001 | 目标实现仓 /真实suite | open_for_execution_and_07 | 无法当前执行测试或生成真实evidence | 不阻塞Step 2;阻塞执行与证据事实 |
| SBX-TEST-ACCEPT-001 | 新版`06`未重建 | open_for_06_full_restart | 最终证据消费 /裁决尚未形成 | `05`先定义evidence生产面,不预判裁决 |
| SBX-TEST-PROFILE-001 | P05+资格 | open_for_activation | backend / provider / platform / durable parity未验证 | P05/P06 unqualified,P07 inactive |
| SBX-TEST-DESIGN-REOPEN-001 | future testability gap | blocker_if_triggered | 后续切口无法落到稳定对象、字段、状态、错误或配置 | 立即停止相关切口并回写`00/03/04` |

---

## 10. 对上游设计的影响判定

| 测试输入结论 | 是否影响上游 | 影响类型 | 回写位置 | 处理状态 |
|---|---:|---|---|---|
| 正式`00~04`足以启动测试目标 /范围设计 | 否 | 测试进入条件确认 | 不适用 | 无回写 |
| `03` §15与Step 16是测试切口直接输入 | 否 | 已有详细设计承接 | 不适用 | 无回写 |
| `04` TSH / FDT / AHG / EHR保持planned handoff | 否 | 已有配置下游承接 | 不适用 | 无回写 |
| 旧`README/05/06`只作historical /方向输入 | 否 | 文档权威降级 | 不适用 | 无回写 |
| 目标实现仓、产品和P05+资格尚未形成 | 否 | 后置执行 /激活门禁 | `07/09`及未来执行 | 当前不回写 |
| 后续发现正式需求 /设计 /配置命题无稳定测试对象或断言 | 否（当前范围） | 可验证性触发器 | 对应`00/02/03/04`章节 | 触发时转阻塞待确认并先回写 |
| 后续发现`03`协议 /状态 /flow与`04`配置门禁冲突 | 否（当前范围） | 跨文档一致性触发器 | `03` §7~§15 / `04`对应Step | 触发时转阻塞待确认并先回写 |

当前不存在阻塞Step 2的上游回写项。Future trigger进入current scope时必须重新判定,不得引用本句跳过回写。

---

## 11. 回填草稿

> 校准来源:
> - `design-calibration/05_test_plan_step_01_input_boundary.md`
>
> 延伸阅读:
> - 建议继续阅读本文件“上游权威顺序”“输入映射”“测试方案不再回答 /必须回答”“Evidence与验收消费边界”“Historical Material与Blocker”和“上游影响判定”,确认测试输入如何从正式`00~04`收敛。

正式`05-测试方案.md` §1应回填:

1. 本测试方案直接承接正式`00-需求文档.md`、`01-架构设计.md`、`02-概要设计.md`、`03-详细设计.md`和`04-配置设计.md`。
2. `03` §15与`03_ddd_step_16_test_cuts.md`提供测试对象 /切口的直接输入;冲突时以正式`03`为准。
3. `04` §12及`04_config_step_12_downstream_handoff.md`提供TSH / FDT / AHG / EHR planned handoff;它们不是实际case / evidence。
4. 旧`README.md`、旧`05-测试方案.md`和旧`06-验收标准.md`只作historical material /方向输入,不得覆盖当前`00~04`。
5. 测试方案只定义如何验证正式需求、设计和配置契约,不重新定义对象、状态、错误、配置、产品或最终验收裁决。
6. 当前无阻塞进入Step 2的输入缺口;实现、真实执行、P05+资格和新版`06`均有明确后置门禁。

---

## 12. 待确认事项

| 待确认事项 | 当前状态 | 是否阻塞Step 2 | 后续owner /处理 |
|---|---|---:|---|
| P0 / P1 / P2如何分配 | not_decided_in_step_1 | 否 | Step 2按C-SBX / FR / VF、profile和风险收敛 |
| 目标实现仓与shared type何时确认 | open_for_07_precheck | 否 | 阻塞真实执行;正式`07` precheck |
| backend / provider / durable store / event bus产品 | open_for_p05_plus | 否 | Step 8 / 10定义资格测试,ADR / `07/09`选型 |
| 新版`06-验收标准.md`何时形成 | open_for_06_full_restart | 否 | 正式`05`审查后按验收SOP重建 |
| TC / EV规模和命名 | not_started | 否 | Step 5 / 6 / 13按测试切口分批收敛 |
| 旧`05`何时被替换 | historical_file_until_step_15 | 否 | Step 15由确认的Step 1~14整体重建 |

---

## 13. 进入下一步条件

| 条件 | 结果 | 说明 |
|---|---|---|
| 用户已确认正式`04` | 通过 | 本次只放行`05` Step 1 |
| 测试flow先于Step产物创建 | 通过 | `05_test_plan_calibration_flow.md` |
| 输入文档清单与权威顺序明确 | 通过 | §3 / §9.1 / §9.2 |
| 测试方案不再回答 /必须回答明确 | 通过 | §9.5 / §9.6 |
| 需求 /设计 /配置 /验收方向输入已清点 | 通过 | §9.3 / §9.7 / §9.8 |
| 用户重点边界均有测试输入来源 | 通过 | §9.4 |
| 旧`README/05/06`未回流 | 通过 | §6 / §9.9 |
| 当前上游影响已判定 | 通过 | §10;无当前待回写 |
| 未分配TC / EV或伪造测试结果 | 通过 | 本Step只有输入候选和planned handoff |
| 未修改正式`05` | 通过 | 旧文件保持historical原状 |
| 可进入Step 2 | `passed_to_step_2` | 用户已明确确认,Step 2范围产物已接续 |

```text
current_document = `05-测试方案.md`
current_step = Step 1 `确认测试输入边界`
gate_status = passed_to_step_2
next_allowed_action = 用户已确认Step 1;由`05_test_plan_step_02_scope.md`接续
formal_document_write = not_started_historical_file_untouched
real_test_execution = not_started
real_evidence_created = no
implementation_ledger_created = no
planned_boundary_skeleton_created = no
commit_required = no
```
