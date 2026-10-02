# 02 Step 2：本次设计目标与范围

## 1. Step状态

开工：用户已确认01并授权全部02；Step 2 completed，formal未装配。仅当前agent。

Step内计划：P1读取输入 → P2逐题回答 → P3诊断 → P4前后比较 → P5取舍 → P6结构化 → P7回填草稿 → P8自检/停审。P1～P8已分批完成。

模块门禁：本Step独立收束后才允许下一Step。

## 2. 本步输入

当前正式00§9～16、01§6～17；本Step对应SOP与书写规范。前一Step的问题回答/诊断/取舍/待确认事项：02_hld_step_01_upstream_relation.md。旧02未作为推导依据。

## 3. SOP问题回答

1. 本次概要设计最主要要把哪些结构说清？

答：收稳七部分到Entry/Service/Domain/Port的映射，明确listing/version/review/distribution各自状态、原结果及可重建目录。

2. 这一轮概要设计应停在什么深度，才算足够支撑进入详细设计？

答：到字段/typed参数骨架、独立关键流/状态矩阵和03承接责任；不提供完整Rust签名、schema、DDL或库版本。

3. 哪些内容属于本次概要设计范围？

答：来源责任、发布/审核handoff、listing与分类、范围读取与exact选择、分发、撤回影响通知、局部审计恢复、body-free引用投影以及展示入口。

4. 哪些内容虽然相关，但当前不进入概要设计范围？

答：资产编辑、审批裁决、human账户服务、扫描/签名生产、安装激活、Billing、跨境结算、Archive export/restore与未经授权event。

5. 哪些内容应留给详细设计，而不应在本章提前展开？

答：完整字段约束/端点/codec/DTO mapping/SQL与并发锁、runtime config与库版本；05实测/06证据/07边界计划不能由02替代。

## 4. 当前文档问题诊断

01§6/11给出语义单元与技术方向，未给源码主体；00§14正向条件不能因为原型可点击而成立。全局发布CLI是入口形态，尚无独立CLI语义owner，不应遗漏也不应拆出第二后端。

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 深度 | 01架构单元与机制 | 02对象/接口/流/状态骨架 | 支撑03而不写实现 |
| 产品入口 | Web/API/Worker与全局CLI形态 | CLI复用同意图，后续交付不新truth | 防入口绕gate |
| UI | 原型示例 | 英文默认/中英、状态一致的真实消费契约 | 原型不成为证据 |

## 6. 设计取舍

首期Web/API/Worker三个承载，发布CLI只作为复用相同API的后续入口形态，不新增发布truth。选择Rust/Vue，拒绝draft React/TS绕过已确认01。

## 7. 结构化中间产物

| 目标 | 说明 | 交付给详细设计的结果 |
|---|---|---|
| 唯一市场代码语义 | 七部分非七微服务，Web/API/Worker共用业务规则 | 主体/归属/内侧port与adapter分层 |
| 完整发布与受控获取 | 固定来源申请，正式Gov决定，exact版本与当前gate | 对象/命令/后台flow和状态矩阵 |
| 可恢复的局部承诺 | 变化+安全audit+完整原结果+耐久责任同事务 | 幂等/typed save-get/unknown-probe与并发交接 |
| 安全读取与展示 | 列表/搜索/计数/提示/历史统一scope；默认英文，可切中英文 | 有界query、投影重建来源、UI状态契约 |
| 后续可落码承接 | 本地稳定结构与外部合同条件分开 | 03字段/schema/函数/事务闭环，04～07后续入口 |

| 非范围 | 留给哪一层 |
|---|---|
| Method/Role/ProcessTemplate、Registry/Adapter、Image/Artifact正文与血缘 | 各正式owner；市场只有immutable ref |
| approval、Identity truth、human认证与组织authority | Governance/Identity/待定认证授权owner |
| 签名/扫描/SBOM生产、资产包制作与格式合规判定 | 正式材料/包/合规owner，MP-UP-004/SRC-013 |
| installed/activated、payment/subscription/settlement/revenue/crossborder | receiver业务owner/Billing future，市场不产生 |
| Archive export/restore、canonical事件新增 | 正式合同缺失，future/blocked；不建active lane |
| 完整Rust/HTTP/存储schema、库版本、具体配置/测试/实施 | 03/04/05/06/07依序展开，不由02跨章实现 |

产品形态包含公开/组织目录、发布工作台、审核交接后台、分发与处置追踪；审核后台只显示/交接Governance正式决定，不提供Approve按钮产生批准。CLI若进入后续交付，必须复用相同typed意图、actor/scope/key与原结果，不能绕后台gate。当前不创建CLI代码/包/命令。

复杂度：本Step为范围结果，不画图；七部分局部设计完整不等真实集成ready。

## 8. 回填草稿

正式§2仅摘录本文件§7及已pass部分附录，不带问题/诊断/历史审计；不新增结论。

## 9. 待确认事项

MP-UP-001～008、MP-SRC-003/010/013、Q-MP-01沿01保留，仅受影响正向lane blocked；不是owner已确认或已发送请求。

## 10. 进入下一步条件

P1～P8均完成；内部stop_review/pass。范围与非范围无approval/finance/body泄漏；技术方向未被draft覆盖。 外部资格不关闭，允许进入Step 3。
