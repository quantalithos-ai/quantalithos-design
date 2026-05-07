# Quarkon AI 相关标准、论文与开源项目调研

> 调研目标：检索对 Quarkon AI（AI 驱动的多 Agent 软件研发协作平台）有帮助的国际标准、学术论文、通信协议和开源项目。
> 调研时间：2026-04-24

---

## 一、ISO / IEEE 国际标准

### 直接相关（建议深入研究）

#### 1. BPMN 2.0 — ISO/IEC 19510:2013

- 链接：https://www.omg.org/spec/BPMN/2.0/
- 状态：已在使用
- 与我们的关系：quantalithos-flow 引擎的核心参考。三层流程（项目→阶段→Agent）全部用 ProcessDefinition（nodes + edges）表达。
- 建议：补充阅读 BPMN 2.0 的可执行语义部分（XML schema），确保 ProcessDefinition 模型与标准兼容，未来可以导入/导出标准 BPMN 文件，与 Camunda、Flowable 等引擎互通。

#### 2. ISO/IEC/IEEE 12207:2017 — 软件生命周期过程

- 链接：https://www.iso.org/standard/43447.html
- IEEE 最新版：https://standards.ieee.org/ieee/12207/11416 （12207-2026 正在修订中）
- 与我们的关系：定义了软件从概念到退役的全生命周期过程框架。我们的六阶段流程（启动→需求→设计→开发→验收→发布）本质上是 12207 的一个实例化。
- 价值：
  - 验证六阶段是否覆盖了关键过程（供应、开发、运维、维护）
  - 补充可能遗漏的过程（如配置管理过程、质量保证过程）
  - 为企业客户提供合规性背书

#### 3. ISO/IEC/IEEE 15288:2023 — 系统生命周期过程

- 链接：https://www.iso.org/standard/75276.html
- 与我们的关系：12207 的上层标准，面向系统级。如果 Quarkon AI 未来要管理的不只是软件项目，还包括硬件+软件的系统级项目，这个标准是必要参考。

#### 4. ISO/IEC 42001:2023 — AI 管理系统（AIMS）

- 链接：https://committee.iso.org/sites/isoorg/home/insights-news/resources/iso-42001-explained-what-it-is.html
- 与我们的关系：全球首个 AI 管理系统认证标准。
- 价值：
  - 我们的平台本身就是一个 AI 系统，需要符合这个标准的治理要求
  - 平台产出的 AI Agent 行为需要可审计、可追溯、可解释——这正是 gate + approval + audit trail 设计的标准化依据
  - 39+ 个 Annex A 控制项可以直接映射到我们的权限系统、门禁机制、工作记录
- 参考：https://securetrajectories.substack.com/p/iso-42001-coding-agents-guide

#### 5. ISO/IEC 5338:2023 — AI 系统生命周期过程

- 链接：https://www.iso.org/standard/81118.html
- 与我们的关系：专门针对 AI 系统的生命周期标准，补充了 12207/15288 中没有的 AI 特有过程（数据管理、模型验证、偏差监控等）。
- 价值：runtime 中 LLM 调用、记忆系统、工具权限校验都可以对照这个标准做合规设计。

#### 6. ISO/IEC 23053:2022 — AI 系统框架（使用机器学习）

- 链接：https://www.iso.org/standard/74438.html
- 与我们的关系：提供了 AI 系统的组件分解和术语统一。可以用来规范化我们对 Agent、LLM、工具、记忆等组件的命名和职责划分。

#### 7. ISO/IEC 25010:2023 — 软件产品质量模型（SQuaRE）

- 链接：https://www.iso.org/standard/78176.html
- 与我们的关系：定义了 9 个质量特性（功能适合性、性能效率、兼容性、交互能力、可靠性、安全性、可维护性、灵活性、安全保障）。
- 价值：我们的 NFR（非功能需求）初版收口可以直接对照这个模型做结构化，阶段 1 的 `nfr_initial_profile` 可以按 25010 的维度组织。

### 间接相关（了解即可）

#### 8. IEEE P7001 — 自主系统透明度

- 与我们的关系：Agent 行为的可解释性标准。我们的 audit trail 和 worklog 设计已经在朝这个方向走。

#### 9. IEEE P2801 — AI 数据集质量管理

- 与我们的关系：如果未来引入知识库和 RAG，数据质量管理会变得重要。

---

## 二、Agent 通信协议标准（新兴，高度相关）

#### 10. Anthropic MCP — Model Context Protocol

- 链接：https://www.anthropic.com/news/model-context-protocol
- 规范：https://spec.modelcontextprotocol.io/
- GitHub：https://github.com/modelcontextprotocol
- 与我们的关系：Anthropic 2024 年发布的开放标准，定义 AI 模型如何连接外部工具和数据源。已有 1600+ MCP Server。
- 价值：quantalithos-runtime 的工具系统应该考虑兼容 MCP，这样 Agent 可以直接使用社区已有的 MCP Server（数据库、文件系统、API 等），大幅降低工具开发成本。对工具注册和执行器设计有直接影响。

#### 11. Google A2A — Agent-to-Agent Protocol

- 链接：https://github.com/google/A2A
- 深度分析：https://justin3go.com/en/posts/2025/04/10-in-depth-research-report-google-agent2agent-a2a-protocol
- 与我们的关系：2025 年 4 月发布，已捐赠给 Linux Foundation，150+ 组织支持（AWS、Cisco、Microsoft、Salesforce、SAP 等）。定义了 Agent 之间如何发现、认证和协作。
- 核心概念：
  - Agent Card（Agent 能力描述）
  - Task（跨 Agent 任务委托）
  - HTTP + JSON-RPC + SSE 传输
- 价值：quantalithos-flow 中 Agent 之间的 NodeAssignment / NodeResult 交互模式可以参考 A2A 的 Task 模型。未来如果要支持外部 Agent 接入（比如接入第三方 AI 服务），A2A 是最有可能成为行业标准的协议。

#### 12. ACP — Agent Communication Protocol（IBM/BeeAI）

- 链接：https://agentcommunicationprotocol.dev/
- 介绍：https://medium.com/@support_94003/acp-the-protocol-standard-for-ai-agent-interoperability-395e5351d72a
- 与我们的关系：面向本地/边缘环境的 Agent 通信标准，强调低延迟和结构化消息。比 A2A 更轻量，适合我们内部 Agent 之间的通信场景。

#### 13. ANP — Agent Network Protocol

- 链接：https://agentnetworkprotocol.com/
- 白皮书：https://arxiv.org/html/2508.00007
- IETF 草案：https://www.ietf.org/archive/id/draft-zyyhl-agent-networks-framework-01.html
- 与我们的关系：去中心化 Agent 通信协议，使用 W3C DID 做身份认证。如果未来要做跨组织的 Agent 协作，这个协议值得关注。

#### 14. FIPA ACL — Foundation for Intelligent Physical Agents

- 链接：http://www.fipa.org/
- 参考：https://www.researchgate.net/publication/225131620_Standardizing_Agent_Interoperability_The_FIPA_Approach
- 与我们的关系：多 Agent 系统的经典通信标准（1996 年成立）。虽然年代较早，但其消息类型分类（inform、request、propose、accept、reject）和对话协议（Contract Net、Auction）对我们的沟通协议设计仍有参考价值。

#### 15. 协议对比综合论文

- 论文：A survey of agent interoperability protocols: MCP, ACP, A2A, and ANP
- 链接：https://arxiv.org/abs/2505.02279
- 价值：一篇论文横向对比了四个协议，提供了选型路线图。强烈建议阅读。

---

## 三、可观测性标准

#### 16. OpenTelemetry GenAI Semantic Conventions

- 链接：https://opentelemetry.io/blog/2025/ai-agent-observability/
- 详细指南：https://uptrace.dev/blog/opentelemetry-ai-systems
- 与我们的关系：OpenTelemetry 正在标准化 AI Agent 的可观测性语义约定（`gen_ai.*` 属性），包括模型名称、token 用量、完成原因等。
- 价值：quantalithos-runtime 和 quantalithos-flow 应该从第一天就按 OpenTelemetry 标准埋点，这样可以直接对接 Prometheus + Grafana + Langfuse 等监控工具，而不需要自己发明一套追踪格式。对 Phase 2 的监控告警设计有直接影响。

#### 17. W3C Trace Context

- 链接：https://www.w3.org/TR/trace-context/
- 与我们的关系：跨服务请求追踪标准。gate → platform → flow → runtime 的调用链应该使用 W3C Trace Context 传递 trace-id，实现端到端追踪。

---

## 四、身份与安全标准

#### 18. W3C DID — Decentralized Identifiers v1.1

- 链接：https://www.w3.org/TR/did/upcoming/
- 与我们的关系：如果未来要给每个 Agent 一个可验证的唯一身份（不只是内部 ID，而是跨系统可信身份），DID 是标准方案。
- 相关论文：AI Agents with Decentralized Identifiers and Verifiable Credentials — https://arxiv.org/html/2511.02841v2

#### 19. OAuth 2.0 / OIDC

- 与我们的关系：quantalithos-gate 的 JWT 认证已经在用。如果未来要支持企业 SSO 接入，需要完整实现 OIDC。

---

## 五、质量与度量标准

#### 20. DORA Metrics

- 链接：https://dora.dev/
- 与我们的关系：四个关键指标（部署频率、变更前置时间、变更失败率、恢复时间）。如果 Quarkon AI 要度量 AI 团队的交付效能，DORA 是行业标准框架。可以在阶段 5 的发布后观察中引入。

---

## 六、学术论文

### 直接对标场景

#### 21. LLM-Based Multi-Agent Systems for Software Engineering: A Survey

- 链接：https://arxiv.org/html/2404.04834v2
- 价值：直接对标我们的场景——用 LLM 多 Agent 做软件工程。综述了 ChatDev、MetaGPT、SWE-agent 等系统的架构模式，分析了角色分工、通信机制、代码生成质量等维度。

#### 22. MetaGPT: Meta Programming for a Multi-Agent Collaborative Framework

- 链接：https://arxiv.org/html/2308.00352v6
- 价值：MetaGPT 的核心论文。它的"流水线范式"（把软件开发拆成角色→按 SOP 流转）和我们的设计高度相似。区别在于 MetaGPT 是 CLI 工具，我们是可视化平台。值得对比学习它的角色定义和产物传递机制。

#### 23. ChatDev 2.0: Multi-Agent Software Development through Cross-Team Collaboration

- 链接：https://arxiv.org/html/2406.08979v1
- 价值：ChatDev 的跨团队协作论文。它引入了"经验池"让 Agent 从历史项目中学习，这对我们的知识库和记忆系统设计有启发。

### 架构与工程

#### 24. Towards Engineering Multi-Agent LLMs

- 链接：https://arxiv.org/html/2510.12120
- 价值：指出当前多 Agent 系统的三个核心缺陷：under-specification（规格不足）、coordination failure（协调失败）、evaluation gap（评估缺口）。这三个问题我们的设计已经在解决（工作流模板解决规格、daemon 解决协调、verification-before-completion 解决评估），但这篇论文能帮我们更系统地思考。

#### 25. A Communication-Centric Survey of LLM-Based Multi-Agent Systems

- 链接：https://arxiv.org/html/2502.14321v1
- 价值：从通信视角分析多 Agent 系统，包括架构设计、通信目标、消息格式。对我们的沟通协议和消息路由设计有直接参考价值。

#### 26. A Survey on the Technological Aspects of Building Effective LLM-Based Multi Agent Systems

- 链接：https://arxiv.org/html/2504.01963v1
- 价值：2025 年的综合技术调研，覆盖了构建多 Agent 系统的基础技术：记忆、规划、工具使用、通信、评估。可以作为我们技术选型的交叉验证。

#### 27. The Landscape of Emerging AI Agent Architectures for Reasoning, Planning, and Tool Calling

- 链接：https://arxiv.org/html/2404.11584v1
- 价值：Agent 架构全景综述，分析了 ReAct、Plan-and-Execute、Reflexion 等模式。我们的 think→act 循环可以对照这篇论文做优化。

#### 28. A Large-Scale Study on the Development and Issues of Multi-Agent AI Systems

- 链接：https://arxiv.org/html/2601.07136v1
- 价值：大规模实证研究，分析了 LangChain、CrewAI、AutoGen 等框架在实际开发中遇到的问题。可以帮我们提前规避常见陷阱。

### BPMN + AI 交叉

#### 29. Modeling Human-Agent Collaborative Workflows: Extending BPMN

- 链接：https://modeling-languages.com/modeling-human-agent-collaborative-workflows-extending-bpmn/
- 价值：讨论如何扩展 BPMN 来建模人-Agent 协作工作流。我们的 flow 引擎正在做的事情——在 BPMN 基础上加 session（协作会议）、gate（人工门禁）——和这篇文章的方向完全一致。

#### 30. Translating Business Workflows for AI Planning: BPMN to PDDL

- 链接：https://arxiv.org/html/2511.18171
- 价值：把 BPMN 流程图转换成 AI 规划语言（PDDL）。如果未来要让 Tech Lead Agent 自动提议流程（流程模型与动态编排抽象中讨论的 WorkflowProposal），这个转换思路很有价值。

#### 31. BPMN.AI Patterns — viadee

- 链接：https://github.com/viadee/bpmn.ai-patterns
- 价值：BPMN 与 AI 集成的设计模式集合。可以作为 quantalithos-flow 设计的模式参考。

### Agent 身份

#### 32. AI Agents with Decentralized Identifiers and Verifiable Credentials

- 链接：https://arxiv.org/html/2511.02841v2
- 价值：用 W3C DID 给 AI Agent 做身份认证的原型系统。如果未来要做 Agent 身份的正式化（每个 Agent 有唯一可验证身份），这篇论文是直接参考。

### 协议架构

#### 33. A Layered Protocol Architecture for the Internet of Agents

- 链接：https://arxiv.org/html/2511.19699v3
- 价值：提出了 Agent 互联网的分层协议架构，类似 TCP/IP 的分层思想。对我们理解 Agent 通信的分层（传输层→消息层→协作层→应用层）有架构级启发。

#### 34. Orchestrated Multi-Agent Systems: Architectures, Protocols, and Enterprise Adoption

- 链接：https://arxiv.org/html/2601.13671v1
- 价值：面向企业级多 Agent 系统的架构和协议综述。直接对标我们的企业级定位。

#### 35. Agentic AI: Architectures, Protocols, and Design Challenges

- 链接：https://arxiv.org/html/2508.10146v1
- 价值：Agentic AI 的架构与设计挑战综述，覆盖了自主性、上下文推理、协议设计等维度。

---

## 七、开源项目（竞品/参考）

#### 36. MetaGPT

- GitHub：https://github.com/geekan/MetaGPT （⭐ 50k+）
- 与我们的关系："First AI Software Company"。角色分工 + SOP 流转 + 结构化产物。和我们最像的开源项目。
- 区别：MetaGPT 是 CLI 工具，没有可视化群聊界面，没有 daemon 编排，没有门禁机制，没有项目级状态持久化。

#### 37. ChatDev

- GitHub：https://github.com/OpenBMB/ChatDev （⭐ 26k+）
- 与我们的关系：模拟软件公司的多 Agent 对话系统。它的"聊天链"（Chat Chain）概念和我们的阶段内工作流模板类似。ChatDev 2.0 引入了跨团队协作和经验池。

#### 38. SWE-agent

- GitHub：https://github.com/SWE-agent/SWE-agent （NeurIPS 2024）
- 与我们的关系：单 Agent 自动修 Bug。虽然是单 Agent，但它的 Agent-Computer Interface（ACI）设计——如何让 Agent 高效操作代码仓库——对我们的工具系统设计有参考价值。

#### 39. OpenHands (原 OpenDevin)

- GitHub：https://github.com/All-Hands-AI/OpenHands （⭐ 50k+）
- 与我们的关系：开源版 Devin。自主软件工程 Agent，支持浏览器、终端、代码编辑器。它的沙箱执行环境设计对我们的 runtime 沙箱有参考价值。

#### 40. Flowable

- 链接：https://www.flowable.com/
- 文档：https://documentation.flowable.com/latest/ai/ai-orchestration
- 与我们的关系：成熟的 BPMN/CMMN 流程引擎，已经开始支持 Multi-agent Orchestration。可以作为 quantalithos-flow 的工程实现参考，特别是 BPMN 解析、节点调度、流程持久化等底层能力。

#### 41. Camunda

- 链接：https://camunda.com/
- 参考：https://computerweekly.com/blog/CW-Developer-Network/AI-workflows-Camunda-BPMN-as-a-tool-for-creating-orchestrating-AI-workflows
- 与我们的关系：另一个成熟的 BPMN 引擎，正在探索 AI 工作流编排。它的 Zeebe 分布式引擎对我们 Phase 2 的扩展有参考价值。

#### 42. Devin / Cognition Labs

- 链接：https://devin.ai/
- 与我们的关系：商业化的自主 AI 软件工程师。单 Agent 模式，强调端到端自主执行。我们的差异化在于多 Agent 协作 + 可视化 + 门禁控制 + 流程管控。

#### 43. Coral Protocol

- 论文：https://arxiv.org/html/2505.00749v1
- 与我们的关系：开放去中心化的 Agent 协作基础设施，支持通信、协调、信任和支付。长期来看，如果 Quarkon AI 要接入外部 Agent 生态，Coral Protocol 是一个值得关注的基础设施层。

---

## 八、行业框架

#### 44. AADLC — Agent & Automation Development Lifecycle（Miro）

- 链接：https://miro.com/blog/agent-automation-development-lifecycle/
- 与我们的关系：Miro 提出的 Agent 开发生命周期框架，覆盖文档化、评估、构建、发布。可以作为我们平台自身开发流程的参考。

#### 45. Infosys SDLC Agent Framework

- 链接：https://www.infosys.com/iki/techcompass/sdlc-agent-framework.html
- 与我们的关系：Infosys 的 SDLC Agent 框架，展示了企业级 AI Agent 在软件开发各阶段的应用模式。

---

## 九、优先级建议

### 第一优先级（立即研究，对当前设计有直接影响）

| # | 项目 | 原因 |
|---|------|------|
| 10 | MCP | runtime 工具系统兼容性 |
| 11 | A2A | Agent 间通信标准化 |
| 15 | 协议对比论文 | 选型决策依据 |
| 16 | OpenTelemetry GenAI | 可观测性从第一天就做对 |
| 21 | LLM-MAS for SE Survey | 直接对标场景的综述 |
| 22 | MetaGPT 论文 | 最相似系统的设计对比 |

### 第二优先级（Phase 1 期间研究，影响架构决策）

| # | 项目 | 原因 |
|---|------|------|
| 2 | ISO 12207 | 六阶段流程的合规性验证 |
| 4 | ISO 42001 | AI 治理合规 |
| 7 | ISO 25010 | NFR 结构化 |
| 24 | Engineering MAS 论文 | 规避常见缺陷 |
| 29 | BPMN + Agent 扩展 | flow 引擎设计验证 |
| 40 | Flowable | BPMN 引擎工程参考 |

### 第三优先级（Phase 2+ 研究，影响扩展能力）

| # | 项目 | 原因 |
|---|------|------|
| 5 | ISO 5338 | AI 系统生命周期合规 |
| 13 | ANP | 跨组织 Agent 协作 |
| 18 | W3C DID | Agent 身份正式化 |
| 30 | BPMN to PDDL | 动态流程编排 |
| 33 | Internet of Agents | 长期架构愿景 |

---
---

# 第二轮补充调研：关键研究方向

> 第一轮调研侧重"有哪些标准和项目可以参考"。
> 第二轮调研侧重"有哪些活跃研究方向，其成果可以直接解决我们的工程难题"。
> 调研时间：2026-04-24

---

## 研究方向一：多 Agent 失败模式与错误级联

这是对我们项目影响最大的研究方向。多 Agent 协作中，一个 Agent 的小错误会沿着流水线放大，最终导致整个项目产出不可用。我们的 daemon + 门禁 + verification-before-completion 设计正是为了解决这个问题，但学术界已经有了更系统的分析。

#### 46. Why Do Multi-Agent LLM Systems Fail?

- 链接：https://arxiv.org/abs/2503.13657
- 核心发现：分析了 7 个主流 MAS 框架、200+ 任务，由 6 名专家标注，识别出 14 种独立失败模式，归为 3 大类：
  - 规格与系统设计失败（任务定义不清、角色边界模糊）
  - Agent 间协调失败（信息丢失、冲突决策、死锁）
  - 任务验证与终止失败（过早宣称完成、无法检测错误）
- 对我们的价值：这 14 种失败模式可以直接作为我们系统设计的 checklist——逐一检查我们的架构是否已经覆盖了每种失败的防御机制。

#### 47. Modeling and Mitigating Error Cascades in LLM-Based Multi-Agent Collaboration

- 链接：https://arxiv.org/abs/2603.04474
- 核心发现：小错误在多 Agent 流水线中会"固化"并逐步放大，后续 Agent 倾向于信任前序 Agent 的错误输出而不是质疑它。
- 对我们的价值：直接影响我们的代码审查（requesting-code-review）和两阶段质量门设计。论文建议引入"怀疑机制"——后续 Agent 应该被显式提示"前序产物可能有错"，而不是默认信任。

#### 48. A Full-Stack Framework for Reliable LLM Multi-Agent Systems under Instruction Conflicts

- 链接：https://arxiv.org/abs/2509.23188
- 核心发现：当系统级指令（shared_rules）和用户级指令（项目需求）冲突时，Agent 经常错误地优先执行用户指令而忽略系统约束。
- 对我们的价值：直接影响我们的三层 prompt 组装（shared_rules + role identity + context）。需要确保 shared_rules 中的硬约束不会被项目级 prompt 覆盖。

#### 49. Traceability and Accountability in Role-Specialized Multi-Agent LLM Pipelines

- 链接：https://arxiv.org/html/2510.07614
- 核心发现：在角色分工的多 Agent 流水线中，错误会"静默传递"——没有明确的责任归属机制，出了问题不知道是哪个 Agent 的哪一步导致的。
- 对我们的价值：直接影响我们的 audit trail 和 worklog 设计。建议每个 NodeResult 不仅记录产出，还要记录推理链和决策依据，形成可追溯的责任链。

#### 50. Intervention-Driven Auto Debugging for LLM Multi-Agent Systems

- 链接：https://arxiv.org/html/2512.06749
- 核心发现：多 Agent 系统的调试极其困难，因为失败往往来自长而分叉的交互轨迹。提出了基于干预的自动调试方法。
- 对我们的价值：对我们的 systematic-debugging 技能和 BUG_REPORT 结构化设计有参考价值。

---

## 研究方向二：Agent 记忆架构

我们的 runtime 设计了分层记忆（Phase 1 内存、Phase 2 数据库、Phase 3 向量库），但学术界在这个方向上已经有了更精细的架构。

#### 51. Hierarchical Memory for High-Efficiency Long-Term Reasoning in LLM Agents

- 链接：https://arxiv.org/html/2507.22925v1
- 核心发现：提出分层记忆架构——工作记忆（当前任务）、短期记忆（近期交互）、长期记忆（跨项目经验），每层有不同的压缩和检索策略。
- 对我们的价值：直接对标我们的记忆系统设计。建议在 Phase 2 实现时参考这个三层架构，特别是"跨项目经验"对应我们的持久 Agent 记忆积累。

#### 52. Heterogeneous Multi-Agent LLM Systems through Structured Contextual Memory

- 链接：https://arxiv.org/html/2508.08997v1
- 核心发现：异构多 Agent 系统（不同角色、不同能力的 Agent）需要结构化的上下文记忆，而不是简单的对话历史。
- 对我们的价值：我们的 Agent 团队正是异构的（Tech Lead、开发、测试、DevOps），每个角色需要的上下文不同。这篇论文的结构化记忆方案可以优化我们的 NodeAssignment 上下文注入。

#### 53. Autonomous Memory Management in LLM Agents

- 链接：https://arxiv.org/html/2601.07190
- 核心发现：长时间软件工程任务中的"上下文膨胀"（Context Bloat）问题——交互历史越来越长，计算成本爆炸，延迟增加，推理质量下降。
- 对我们的价值：我们的 Agent 在阶段 3 迭代开发中会执行大量任务，上下文膨胀是必然问题。这篇论文的自主记忆管理方案（自动决定保留/压缩/丢弃哪些上下文）对 runtime 的记忆压缩模块有直接参考价值。

#### 54. Context Management for Long-Horizon SWE-Agents

- 链接：https://arxiv.org/html/2512.22087v1
- 核心发现：提出 Cat 框架——把上下文分为稳定任务语义、压缩长期记忆、高保真短期交互三层，Agent 主动压缩历史而不是被动截断。
- 对我们的价值：直接对标我们的场景（长周期软件工程任务）。建议 runtime 的记忆系统参考 Cat 的三层分区策略。

#### 55. Memory Retrieval via Reflective Reasoning for LLM Agents

- 链接：https://arxiv.org/html/2512.20237v1
- 核心发现：现有记忆系统主要优化存储和压缩，但检索质量被忽视。提出"反思式检索"——Agent 在检索记忆时先反思"我需要什么信息"，再做针对性检索。
- 对我们的价值：对我们 Phase 3 的向量库记忆检索有参考价值。

---

## 研究方向三：Agent 安全与沙箱隔离

我们的 runtime 设计了工具权限校验和沙箱执行，但 Agent 安全是一个快速演进的领域。

#### 56. Fault-Tolerant Sandboxing for AI Coding Agents

- 链接：https://arxiv.org/abs/2512.12806
- 核心发现：提出事务性沙箱——Agent 的代码执行被包装成事务，如果执行结果不符合预期可以自动回滚，而不是让错误持久化。
- 对我们的价值：直接影响 runtime 的沙箱设计。当前设计是 Docker/subprocess 隔离，但缺少事务性回滚能力。

#### 57. Quantifying Frontier LLM Capabilities for Container Sandbox Escape

- 链接：https://arxiv.org/abs/2603.02277
- 核心发现：前沿 LLM 已经能够可靠地逃逸常见的容器沙箱弱点。大模型之间的逃逸能力差距很大。
- 对我们的价值：警示——我们的 Docker 沙箱可能不够安全。需要关注沙箱加固策略。

#### 58. Securing AI Agents Against Prompt Injection Attacks

- 链接：https://arxiv.org/html/2511.15759
- 核心发现：组合防御框架可以将攻击成功率从 73.2% 降到 8.7%，同时保持 94.3% 的任务性能。
- 对我们的价值：我们的 Agent 会处理用户输入（需求描述、审批意见），这些输入可能包含 prompt injection。需要在 runtime 的 prompt 组装层加入防御机制。

#### 59. A Systematic Analysis of Vulnerabilities in Skills, Tools, and Protocol Ecosystems

- 链接：https://arxiv.org/abs/2601.17548
- 核心发现：对 78 篇研究的元分析显示，针对最先进防御的自适应攻击成功率超过 85%。工具生态（MCP Server 等）是新的攻击面。
- 对我们的价值：如果我们兼容 MCP，就需要考虑第三方 MCP Server 的安全风险。建议引入工具调用的安全审计层。

#### 60. System-level Security for Computer Use Agents

- 链接：https://arxiv.org/html/2601.09923
- 核心发现：Agent 安全的唯一已知鲁棒防御是架构级隔离——不是在 prompt 层防御，而是在系统架构层隔离。
- 对我们的价值：验证了我们"两层权限校验"设计的方向——角色级权限 + step 级动态权限，而不是只靠 prompt 约束。

---

## 研究方向四：人在回路与自主性分级

我们的门禁机制（硬门禁/软门禁）是 Human-in-the-Loop 的实现，但学术界正在研究更精细的自主性分级。

#### 61. Levels of Autonomy for AI Agents

- 链接：https://arxiv.org/html/2506.12469v1
- 核心发现：定义了 5 级 Agent 自主性——操作者（operator）、协作者（collaborator）、顾问（consultant）、审批者（approver）、观察者（observer）。
- 对我们的价值：我们当前只有两级（硬门禁 = 审批者、软门禁 = 观察者）。这个 5 级模型可以让我们的门禁机制更精细——比如某些步骤用户是"顾问"（AI 做完后通知，用户可以干预但不阻塞），而不是非黑即白的"必须审批"或"完全自动"。

#### 62. Agent-Gated Shared Autonomy (AGSA)

- 链接：https://openreview.net/forum?id=LfekK1E0QE
- 核心发现：提出 Agent 自己决定何时请求人类帮助的框架——不是预设固定的审批点，而是 Agent 根据自身置信度动态决定是否需要人类介入。
- 对我们的价值：长期来看，我们的门禁可以从"固定位置"演进为"动态触发"——Agent 在执行过程中如果遇到不确定性，主动请求人类确认。

---

## 研究方向五：Agent 自我反思与纠错

我们的 systematic-debugging 技能和 verification-before-completion 已经在做这件事，但学术界有更系统的方法。

#### 63. Agent-R: Training Language Model Agents to Reflect via Iterative Self-Training

- 链接：https://arxiv.org/html/2501.11425v3
- 核心发现：用 MCTS（蒙特卡洛树搜索）训练 Agent 识别和纠正错误动作，在交互环境中实时自我修正。
- 对我们的价值：对 runtime 的 think→act 循环有参考价值。当前循环是线性的（think→act→observe→think），可以引入反思步骤（think→act→observe→reflect→correct→think）。

#### 64. Generator-Assistant Stepwise Rollback Framework for LLM Agent

- 链接：https://arxiv.org/html/2503.02519v4
- 核心发现：提出逐步回滚框架——当 Agent 检测到错误时，不是从头重来，而是回滚到最近的正确步骤重新执行。
- 对我们的价值：直接影响我们的任务级回退设计。当前阶段 3 的回退是阶段级的（回退到阶段 2），但任务内部的步骤级回滚还没有设计。

#### 65. Where LLM Agents Fail and How They Can Learn From Failures

- 链接：https://arxiv.org/abs/2509.25370
- 核心发现：Agent 的失败经验比成功经验更有学习价值。提出从失败轨迹中提取教训并注入后续执行的方法。
- 对我们的价值：对我们的知识库和持久 Agent 记忆设计有启发——Agent 不仅应该记住成功经验，更应该记住失败教训。

---

## 研究方向六：上下文管理与成本优化

LLM 调用是我们最大的运行成本。学术界在成本优化方面有大量研究。

#### 66. Solving Context Window Overflow in AI Agents

- 链接：https://arxiv.org/html/2511.22729v1
- 核心发现：现有的截断和摘要方法会丢失完整输出，不适合需要完整数据的工作流。提出了保留完整输出的上下文管理方法。
- 对我们的价值：我们的 Agent 在阶段 3 会产出大量代码和文档，简单截断会丢失关键信息。

#### 67. Cost-Aware LLM Orchestration via Reinforcement Learning (xRouter)

- 链接：https://arxiv.org/html/2510.08439
- 核心发现：用强化学习训练路由器，根据任务复杂度自动选择合适的模型（简单任务用小模型，复杂任务用大模型），在预算约束下最大化质量。
- 对我们的价值：直接影响 runtime 的 LLM 调用封装。不是所有 Agent 动作都需要最强模型——代码审查可能需要 Claude Opus，但简单的状态更新用 Haiku 就够了。

#### 68. Adaptive LLM Routing under Budget Constraints

- 链接：https://arxiv.org/html/2508.21141v1
- 核心发现：在预算约束下动态路由 LLM 请求，平衡质量和成本。
- 对我们的价值：我们的 LLM 调用封装层应该支持按任务类型自动选择模型，而不是所有调用都用同一个模型。

---

## 研究方向七：任务分解与层级委派

我们的 Tech Lead 负责任务拆解，daemon 负责任务调度。学术界在这个方向上有新的研究。

#### 69. Agent-Oriented Planning in Multi-Agent Systems

- 链接：https://arxiv.org/html/2410.02189v1
- 核心发现：提出快速任务分解 + 有效评估反馈的框架。关键洞察：任务分解不应该是一次性的，而应该在执行过程中根据反馈动态调整。
- 对我们的价值：我们当前的任务拆解是阶段 2 一次性完成的。这篇论文建议在阶段 3 执行过程中也允许动态调整任务拆解。

#### 70. Intelligent AI Delegation

- 链接：https://arxiv.org/html/2602.11865v1
- 核心发现：AI Agent 需要能够有意义地分解问题并安全地委派子任务。提出了委派的安全边界和回退机制。
- 对我们的价值：直接对标我们的 Tech Lead → 开发工程师的任务委派模式。

#### 71. Hierarchical Multi-Agent Systems: Design Patterns, Coordination Mechanisms

- 链接：https://arxiv.org/html/2508.12683
- 核心发现：层级式多 Agent 系统的设计模式和协调机制综述。分析了层级结构如何简化协调，但也可能引入瓶颈。
- 对我们的价值：我们的架构是层级式的（daemon → Tech Lead → 开发/测试），这篇论文的设计模式可以帮我们优化层级间的通信效率。

---

## 研究方向八：Agent-用户交互协议

我们的 chat 前端是用户与 Agent 团队的唯一入口。学术界和工业界正在标准化这一层。

#### 72. AG-UI — Agent-User Interaction Protocol

- 链接：https://docs.copilotkit.ai/ag-ui-protocol
- 介绍：https://www.copilotkit.ai/blog/introducing-ag-ui-the-protocol-where-agents-meet-users/
- 核心：CopilotKit 发布的开放协议，定义了 Agent 与用户界面之间的 17 种事件类型（消息流、工具调用、状态补丁、生命周期信号等）。LangGraph 和 CrewAI 已经接入，Oracle 已采纳，Microsoft Agent Framework 已集成。
- 对我们的价值：quantalithos-chat 与 runtime/flow 之间的实时通信可以参考 AG-UI 的事件模型。特别是：
  - 消息流式传输（Agent 正在思考/执行的实时反馈）
  - 状态补丁（项目进度、任务状态的增量更新）
  - 工具调用可视化（用户看到 Agent 正在调用什么工具）
  - 生命周期事件（Agent 启动/完成/失败的通知）

#### 73. LLM-Based Human-Agent Collaboration and Interaction Systems

- 链接：https://arxiv.org/abs/2505.00753
- 核心发现：综述了 LLM 驱动的人-Agent 协作系统的交互模式。
- 对我们的价值：对 chat 前端的交互设计有参考价值。

---

## 研究方向九：流程挖掘与 Agent BPM

我们用 BPMN 定义流程，但学术界正在研究如何让 AI Agent 自动优化流程。

#### 74. Agentic Business Process Management Systems

- 链接：https://arxiv.org/html/2601.18833v1
- 核心发现：2025 年 AI for BPM Workshop 的主旨论文。提出流程挖掘为 Agent 提供了感知流程状态、推理改进方向、自主优化流程的基础。
- 对我们的价值：长期来看，我们的 daemon 不仅可以执行流程，还可以通过分析历史执行数据来优化流程模板。这对应我们"流程模型与动态编排抽象"中讨论的 WorkflowFactory。

#### 75. Re-Thinking Process Mining in the AI-Based Agents Era

- 链接：https://arxiv.org/html/2408.07720
- 核心发现：用 Agent 工作流范式增强流程挖掘——把复杂的流程分析任务分解成多个 Agent 协作完成。
- 对我们的价值：如果未来要做"项目复盘"功能（分析一个项目的执行过程，找出瓶颈和改进点），流程挖掘 + Agent 分析是一个可行方案。

---

## 研究方向十：持久执行与崩溃恢复

我们的快照机制（Agent 快照 + 流程快照）是为了支持恢复，但工业界正在推动"持久执行"成为标准能力。

#### 76. Durable Execution for AI Agents（工业实践）

- Inngest 分析：https://www.inngest.com/blog/durable-execution-key-to-harnessing-ai-agents
- Diagrid 对比：https://www.diagrid.io/blog/checkpoints-are-not-durable-execution-why-langgraph-crewai-google-adk-and-others-fall-short-for-production-agent-workflows
- Temporal + Vercel：https://temporal.io/blog/building-durable-agents-with-temporal-and-ai-sdk-by-vercel
- 核心观点：Checkpoint ≠ 持久执行。LangGraph、CrewAI 等框架的 checkpoint 只是"保存状态"，真正的持久执行需要运行时本身保证工作流执行到完成、自动从失败中恢复、永不丢失进度。
- 对我们的价值：我们的 flow daemon 需要具备持久执行能力——如果 daemon 进程崩溃重启，应该能从上次的精确位置继续执行，而不是重新开始。当前的快照机制是手动的（阶段切换时保存），需要升级为自动的、每步持久化的。

---

## 研究方向十一：评估基准

如何衡量我们的 AI 团队是否真的比单 Agent 更好？

#### 77. SWE-Bench Pro: Long-Horizon Software Engineering Tasks

- 链接：https://arxiv.org/abs/2509.16941
- 排行榜：https://www.swebench.com/
- 核心发现：扩展了 SWE-Bench，专门评估长周期、复杂的软件工程任务（不只是修 Bug，还包括新功能开发、重构等）。
- 对我们的价值：可以用 SWE-Bench Pro 的任务集来评估我们的多 Agent 团队 vs 单 Agent 的效果差异。

#### 78. Benchmarks Evaluating LLM Agents for Software Development（综述）

- 链接：https://symflower.com/en/company/blog/2025/benchmarks-llm-agents/
- 对我们的价值：梳理了所有主流评估基准，帮我们选择合适的基准来衡量平台效果。

---

## 更新后的优先级建议

### 第一优先级（立即研究，对当前设计有直接影响）

| # | 项目 | 原因 |
|---|------|------|
| 10 | MCP | runtime 工具系统兼容性 |
| 11 | A2A | Agent 间通信标准化 |
| 15 | 协议对比论文 | 选型决策依据 |
| 16 | OpenTelemetry GenAI | 可观测性从第一天就做对 |
| 21 | LLM-MAS for SE Survey | 直接对标场景的综述 |
| 22 | MetaGPT 论文 | 最相似系统的设计对比 |
| **46** | **Why Do MAS Fail** | **14 种失败模式作为设计 checklist** |
| **47** | **Error Cascades** | **直接影响代码审查和质量门设计** |
| **56** | **Fault-Tolerant Sandbox** | **事务性沙箱，影响 runtime 沙箱设计** |
| **72** | **AG-UI** | **chat 前端与 Agent 的实时通信协议** |

### 第二优先级（Phase 1 期间研究，影响架构决策）

| # | 项目 | 原因 |
|---|------|------|
| 2 | ISO 12207 | 六阶段流程的合规性验证 |
| 4 | ISO 42001 | AI 治理合规 |
| 7 | ISO 25010 | NFR 结构化 |
| 24 | Engineering MAS 论文 | 规避常见缺陷 |
| 29 | BPMN + Agent 扩展 | flow 引擎设计验证 |
| 40 | Flowable | BPMN 引擎工程参考 |
| **48** | **Instruction Conflicts** | **三层 prompt 组装的优先级冲突** |
| **51** | **Hierarchical Memory** | **记忆系统三层架构** |
| **53** | **Context Bloat** | **长周期任务的上下文膨胀** |
| **58** | **Prompt Injection Defense** | **用户输入的安全防御** |
| **61** | **Levels of Autonomy** | **门禁机制精细化（5 级自主性）** |
| **67** | **Cost-Aware LLM Routing** | **按任务复杂度选择模型** |
| **76** | **Durable Execution** | **daemon 持久执行能力** |

### 第三优先级（Phase 2+ 研究，影响扩展能力）

| # | 项目 | 原因 |
|---|------|------|
| 5 | ISO 5338 | AI 系统生命周期合规 |
| 13 | ANP | 跨组织 Agent 协作 |
| 18 | W3C DID | Agent 身份正式化 |
| 30 | BPMN to PDDL | 动态流程编排 |
| 33 | Internet of Agents | 长期架构愿景 |
| **62** | **Agent-Gated Shared Autonomy** | **动态门禁触发** |
| **63** | **Agent-R Self-Reflection** | **think→act 循环加入反思步骤** |
| **64** | **Stepwise Rollback** | **任务内步骤级回滚** |
| **65** | **Learn From Failures** | **失败经验注入知识库** |
| **74** | **Agentic BPM** | **流程自动优化** |
| **77** | **SWE-Bench Pro** | **多 Agent vs 单 Agent 效果评估** |
