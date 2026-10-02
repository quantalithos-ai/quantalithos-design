# Step 5：建立需求追溯与覆盖矩阵

## 1. Step 状态

2026-10-02；full-restart / single-agent；completed / selfcheck_done / stop_review；`gate_status=pass`（候选追溯设计，不是运行覆盖率）。输入00全部104个需求编号、Step3/4、03/04；输出逐需求正反候选、证据编号分配及13CUT双向索引。

Step内计划：编号/来源核验→逐项正反候选→切口反查→孤儿/证据审计；均已完成本步设计审查。TC的具体执行断言在Step6继续；本步不产运行结果。

### Step内计划与门禁字段

| 计划项 | 状态 | 可审查产物/门禁 |
|---|---|---|
| 读取输入与前序结论 | done | §2；前序：05_test_plan_step_04_strategy_layers.md（含诊断、取舍、未确认项） |
| SOP逐问题回答 | done | §3，回答所有适用问题 |
| 当前/历史材料诊断 | done | §4，不继承historical truth |
| 设计取舍 | done | §6，采用/未采用理由 |
| 结构化产物 | done | §7；编号/字段/归属可反查 |
| 复杂度判断 | done | 主控内按表/单元组织，不需新增业务附录 |
| 回填草稿 | done | §8；只候选，正式写入等Step15 |
| 自检/下一步 | done | §9/10，外部资格不关闭 |

`gate_status=pass`；`gate_reason`=本Step设计审查完成，执行仍not-run；`next_allowed_action`=§10下一Step阅读/设计；`source_files`=§2列出的正式输入与前序文件。上述done是本Step内容事实，不是测试执行或用户/owner签核。

## 2. 本步输入

[00§9～14/16](../00-需求文档.md)、[Step3](05_test_plan_step_03_test_objects_cuts.md)、[Step4](05_test_plan_step_04_strategy_layers.md)、[03§5～15](../03-详细设计.md)、[04§5～12](../04-配置设计.md)；测试SOP Step5、书写规范§5.5。U1～7来源分别指03§6索引的同U对象/协议/flow/状态附录，跨事务/幂等/配置依据03§10～14和04，不以旧05提供truth。

## 3. SOP 问题回答

| 问题 | 回答 |
|---|---|
| P0依据？ | §7.2逐编号回到U及正式章节；BR/VETO不能被FR汇总吞掉。 |
| 至少哪些场景？ | 每行正向或受控允许分支，以及拒绝/失败/边界；否定约束的正向是合法受限行为，不造外部成功。 |
| 自动化？ | 所有本地P0均自动化候选；真实owner qualification独立blocked。 |
| 证据编号？ | §7.1为TC分配唯一EV；Step6补主suite与raw切口，Step13定义实例schema。 |
| 未覆盖？ | IF504无active event；Billing、全安装覆盖及真实owner资格见§9，不能记作通过。 |
| 每CUT对应需求？ | §7.3逐CUT回指需求、契约、TC与EV。 |
| 每P0有切口/TC/EV？ | §7.2所有行经§7.3反查；无family通配编号。 |
| 停审？ | §7.4逐覆盖类别、跨覆盖审计；只宣称候选设计完整。 |

## 4. 当前文档问题诊断

旧05围绕安装/交易；初稿仅写编号范围与family，遗漏逐BR/AC/NFR，且引用未定义STATE/REDACTION TC族。撤回/恢复不能用单happy path替代；来源auth缺口使用MP-UP-003，不误用技术栈差异MP-SRC-003。

## 5. 改动前后对比

| 前 | 后 | 原因 |
|---|---|---|
| FR族/证据族占位 | 104逐编号正反候选及唯一EV分配 | 可双向检索 |
| “覆盖完成”含义模糊 | planned coverage与real qualification分层 | 文档不等测试通过 |
| 零散红线 | BR/VETO逐项自动化反例 | 防规则遗漏 |

## 6. 测试设计取舍

采用需求→TC→EV唯一分配和CUT反查，不让每条需求复制整份用例；一个TC可支撑多个需求但EV编号只定义一次。未采用“每需求一个独立happy test”方案，因为它会掩盖共享原子性与失败窗口。正式字段/state/error仍以03为准，不由追溯表新建。

## 7. 结构化中间产物

### 7.1 唯一编号分配规则（计划）

以下是连续闭区间的逐序号双射，非运行evidence。例：SOURCE-002→EV-DOMAIN-002；REVIEW-002→EV-DOMAIN-008。EV实例的`tc_refs`必须显式数组，不能写区间/通配符；Step13索引验证枚举后唯一性。

| TC前缀/序号 | EV前缀/序号 | 规则 |
|---|---|---|
| TC-SOURCE / 001～006 | EV-DOMAIN / 001～006 | 同序号 |
| TC-REVIEW / 001～010 | EV-DOMAIN / 007～016 | 序号+6 |
| TC-CATALOG / 001～010 | EV-PG / 001～010 | 同序号 |
| TC-DISTRIBUTION / 001～010 | EV-WORKER / 001～010 | 同序号 |
| TC-WITHDRAWAL / 001～010 | EV-DOMAIN / 017～026 | 序号+16 |
| TC-RECOVERY / 001～011 | EV-RECOVERY / 001～011 | 同序号 |
| TC-REFERENCE / 001～006 | EV-PG / 011～016 | 序号+10 |
| TC-CONFIG / 001～012 | EV-CONFIG / 001～012 | 同序号 |

| TC-CROSS序号 | 001 | 002 | 003 | 004 | 005 | 006 | 007 | 008 | 009 | 010 | 011 | 012 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| EV | UNIT-001 | UNIT-002 | PG-017 | PG-018 | API-001 | REDACTION-001 | API-002 | WEB-001 | CONFIG-013 | RELEASE-001 | UNIT-003 | DOMAIN-027 |

| TC-CROSS序号 | 013 | 014 | 015 | 016 | 017 | 018 | 019 | 020 | 021 | 022 | 023 |
|---|---|---|---|---|---|---|---|---|---|---|---|
| EV | DOMAIN-028 | UNIT-004 | PG-019 | PG-020 | PG-021 | API-003 | WORKER-021 | UNIT-005 | WEB-002 | CONFIG-014 | RELEASE-002 |

CROSS表EV单元格均省略固定`EV-`，没有另一套编号。

### 7.2 逐需求覆盖矩阵

每行TC单元格省略固定`TC-`；按§7.1精确查EV。所有行“自动化=是，覆盖状态=planned（本地）”，DEP真实positive另为blocked。正/反表示可执行候选，不意味着pass。来源列U覆盖03§5～9的同U规范性附录，`TX`=03§10，`IDEM`=03§12，`SEC`=03§14，`CFG`=04；其具体字段将在Step6索引逐入口绑定。

| 需求ID | 来源 | 正向/允许候选 | 负向/边界候选 |
|---|---|---|---|
| FR-MP-101 | U1/U7 | SOURCE-003 | SOURCE-004 |
| FR-MP-102 | U1 | SOURCE-001 | SOURCE-005 |
| FR-MP-103 | U1 | SOURCE-003 | SOURCE-004 |
| FR-MP-201 | U2 | REVIEW-003 | REVIEW-004 |
| FR-MP-202 | U2 | REVIEW-007 | REVIEW-008 |
| FR-MP-203 | U3/U5 | CATALOG-005 | CATALOG-006 |
| FR-MP-301 | U3 | CATALOG-007 | CATALOG-008 |
| FR-MP-302 | U3/U7 | CATALOG-010 | REFERENCE-002 |
| FR-MP-303 | U3 | CATALOG-009 | CATALOG-008 |
| FR-MP-401 | U4 | DISTRIBUTION-001 | DISTRIBUTION-009 |
| FR-MP-402 | U4 | DISTRIBUTION-002 | DISTRIBUTION-008 |
| FR-MP-403 | U4 | DISTRIBUTION-005 | DISTRIBUTION-006 |
| FR-MP-501 | U5 | WITHDRAWAL-002 | WITHDRAWAL-003 |
| FR-MP-502 | U5 | WITHDRAWAL-004 | WITHDRAWAL-005 |
| FR-MP-503 | U6/SEC | RECOVERY-007 | RECOVERY-008 |
| FR-MP-504 | U6 | RECOVERY-003 | RECOVERY-005 |
| BR-MP-101 | U1 | SOURCE-003 | SOURCE-004 |
| BR-MP-102 | U1/SEC | SOURCE-001 | SOURCE-005 |
| BR-MP-103 | U1/U2 | REVIEW-007 | REVIEW-008 |
| BR-MP-104 | U1/U2 | REVIEW-002 | REVIEW-004 |
| BR-MP-201 | U2/U3 | CATALOG-005 | CATALOG-006 |
| BR-MP-202 | U2 | REVIEW-003 | REVIEW-004 |
| BR-MP-203 | U3/U5 | WITHDRAWAL-001 | CROSS-005 |
| BR-MP-204 | U2 | REVIEW-007 | REVIEW-008 |
| BR-MP-301 | U3/SEC | CATALOG-007 | CATALOG-008 |
| BR-MP-302 | U3/U7 | CATALOG-010 | CROSS-005 |
| BR-MP-303 | U3 | CATALOG-004 | CATALOG-009 |
| BR-MP-304 | U3 | CATALOG-002 | CROSS-020 |
| BR-MP-401 | U4/U5 | DISTRIBUTION-001 | DISTRIBUTION-009 |
| BR-MP-402 | U4 | DISTRIBUTION-005 | DISTRIBUTION-006 |
| BR-MP-403 | U4/IDEM | DISTRIBUTION-003 | DISTRIBUTION-004 |
| BR-MP-404 | U4/CFG | DISTRIBUTION-001 | CONFIG-012 |
| BR-MP-501 | U5 | WITHDRAWAL-001 | WITHDRAWAL-003 |
| BR-MP-502 | U5/TX | WITHDRAWAL-004 | WITHDRAWAL-005 |
| BR-MP-503 | U5 | WITHDRAWAL-007 | WITHDRAWAL-009 |
| BR-MP-504 | U6/SEC | RECOVERY-007 | CROSS-006 |
| BR-MP-505 | U6/U7 | RECOVERY-003 | RECOVERY-004 |
| NFR-MP-101 | U1/SEC | SOURCE-003 | CROSS-006 |
| NFR-MP-102 | U1/IDEM | SOURCE-001 | RECOVERY-002 |
| NFR-MP-103 | U1/U7 | SOURCE-006 | REFERENCE-002 |
| NFR-MP-201 | U2/U3/TX | REVIEW-003 | CROSS-016 |
| NFR-MP-202 | U2/U6 | REVIEW-010 | REVIEW-006 |
| NFR-MP-301 | U3/IDEM | CATALOG-007 | CROSS-017 |
| NFR-MP-302 | U3/U7/SEC | CATALOG-010 | CATALOG-008 |
| NFR-MP-303 | U3/U7 | REFERENCE-006 | REFERENCE-004 |
| NFR-MP-401 | U4/IDEM | DISTRIBUTION-003 | DISTRIBUTION-004 |
| NFR-MP-402 | U4 | DISTRIBUTION-005 | DISTRIBUTION-010 |
| NFR-MP-501 | U5/TX | WITHDRAWAL-004 | WITHDRAWAL-008 |
| NFR-MP-502 | U5/U6/SEC | RECOVERY-007 | WITHDRAWAL-010 |
| NFR-MP-503 | U5/U6 | RECOVERY-006 | RECOVERY-010 |
| NFR-MP-G01 | SEC/CFG | CROSS-007 | CONFIG-012 |
| NFR-MP-G02 | TX/IDEM | CROSS-015 | CROSS-003 |
| NFR-MP-G03 | U3/U5/TX | CROSS-017 | CROSS-019 |
| NFR-MP-G04 | Web/CFG | CROSS-008 | CROSS-021 |
| AC-MP-101 | U1 | SOURCE-001 | SOURCE-005 |
| AC-MP-102 | U1/U2 | SOURCE-003 | SOURCE-004 |
| AC-MP-103 | U1/IDEM | SOURCE-006 | RECOVERY-002 |
| AC-MP-201 | U2/U3 | CATALOG-005 | CATALOG-006 |
| AC-MP-202 | U2 | REVIEW-007 | REVIEW-008 |
| AC-MP-203 | U2/U3/U5 | REVIEW-010 | CROSS-016 |
| AC-MP-301 | U3 | CATALOG-007 | CROSS-004 |
| AC-MP-302 | U3/U7/SEC | CATALOG-010 | CROSS-005 |
| AC-MP-303 | U3/IDEM | CATALOG-009 | CROSS-017 |
| AC-MP-401 | U4 | DISTRIBUTION-002 | DISTRIBUTION-009 |
| AC-MP-402 | U4 | DISTRIBUTION-005 | DISTRIBUTION-008 |
| AC-MP-403 | U4 | DISTRIBUTION-003 | DISTRIBUTION-007 |
| AC-MP-501 | U5 | WITHDRAWAL-002 | WITHDRAWAL-008 |
| AC-MP-502 | U5/TX | WITHDRAWAL-004 | WITHDRAWAL-005 |
| AC-MP-503 | U6/SEC | RECOVERY-007 | RECOVERY-009 |
| AC-MP-504 | U6/U7 | RECOVERY-006 | RECOVERY-005 |
| AC-MP-G01 | SEC/CFG | CROSS-007 | CROSS-006 |
| AC-MP-G02 | TX/IDEM | CROSS-015 | CROSS-003 |
| AC-MP-G03 | U3/U5/TX | CROSS-017 | CROSS-019 |
| AC-MP-G04 | Web/SEC | CROSS-008 | CROSS-021 |
| IF-MP-101 | U1 | SOURCE-001 | SOURCE-004 |
| IF-MP-102 | U1 | SOURCE-006 | SOURCE-005 |
| IF-MP-201 | U2/U3 | REVIEW-003 | CATALOG-006 |
| IF-MP-202 | U2 | REVIEW-010 | REVIEW-008 |
| IF-MP-301 | U3 | CATALOG-007 | CATALOG-008 |
| IF-MP-302 | U3 | CATALOG-009 | CATALOG-008 |
| IF-MP-303 | U7 | REFERENCE-003 | REFERENCE-004 |
| IF-MP-401 | U4 | DISTRIBUTION-002 | DISTRIBUTION-007 |
| IF-MP-402 | U4 | DISTRIBUTION-001 | DISTRIBUTION-010 |
| IF-MP-403 | U4 | DISTRIBUTION-005 | DISTRIBUTION-008 |
| IF-MP-501 | U5 | WITHDRAWAL-002 | WITHDRAWAL-003 |
| IF-MP-502 | U5/U6 | RECOVERY-011 | WITHDRAWAL-010 |
| IF-MP-503 | U5/U6 | RECOVERY-006 | RECOVERY-005 |
| IF-MP-504 | 01依赖裁剪/03§7 | CROSS-020 | CROSS-020 |
| DEP-MP-101 | U1/U7/CFG | SOURCE-003 | REFERENCE-002 |
| DEP-MP-102 | U1/CFG | SOURCE-001 | SOURCE-005 |
| DEP-MP-201 | U2/CFG | REVIEW-007 | REVIEW-008 |
| DEP-MP-202 | U2/CFG | REVIEW-005 | REVIEW-006 |
| DEP-MP-301 | U3/U7/CFG | REFERENCE-001 | REFERENCE-002 |
| DEP-MP-302 | U3/CFG | CATALOG-007 | CATALOG-008 |
| DEP-MP-401 | U4/CFG | DISTRIBUTION-001 | DISTRIBUTION-009 |
| DEP-MP-402 | U4/CFG | DISTRIBUTION-005 | DISTRIBUTION-006 |
| DEP-MP-501 | U5/CFG | WITHDRAWAL-001 | WITHDRAWAL-003 |
| DEP-MP-502 | U5/CFG | WITHDRAWAL-007 | WITHDRAWAL-008 |
| DEP-MP-503 | U6/CFG | RECOVERY-008 | RECOVERY-009 |
| VETO-MP-1 | U1/SEC | SOURCE-003 | CROSS-006 |
| VETO-MP-2 | U2/U3 | CATALOG-005 | REVIEW-008 |
| VETO-MP-3 | U3/U4/SEC | CATALOG-007 | CROSS-017 |
| VETO-MP-4 | U4/CFG | DISTRIBUTION-005 | CONFIG-012 |
| VETO-MP-5 | U5/U6 | WITHDRAWAL-002 | CROSS-016 |

### 7.3 切口→需求/契约/TC/EV反向索引

此处列代表，完整TC归属见Step6；EV按§7.1精确双射。

| CUT-MP | 需求/规则代表 | 正式依据 | TC代表 |
|---|---|---|---|
| 01 | NFR-MP-G01、AC-MP-G04 | 03 Step8全部schema | CROSS-011 |
| 02 | BR-MP-202、VETO-MP-5 | 03 Step6/10全部对象/pair | CROSS-012、CROSS-013 |
| 03 | FR-MP-101、FR-MP-504 | 03 Step7/9全部ports/flow | CROSS-014 |
| 04 | NFR-MP-G02、AC-MP-G02 | 03§10/Step11 | CROSS-015 |
| 05 | FR-MP-202、FR-MP-403 | 03 Step9Job/12 | REVIEW-006、RECOVERY-005 |
| 06 | BR-MP-403、NFR-MP-401 | 03§12 | CROSS-001、DISTRIBUTION-004 |
| 07 | BR-MP-301、AC-MP-303 | 03 Step7/13 PageReadContext | CROSS-017 |
| 08 | BR-MP-501、AC-MP-203 | 03§10/12 | CROSS-016 |
| 09 | FR-MP-301、NFR-MP-303 | 03§10.3/10.4 | REFERENCE-003、CROSS-004 |
| 10 | NFR-MP-G01、VETO-MP-4 | 04§5～11 | CONFIG-001、CONFIG-012 |
| 11 | FR-MP-503、VETO-MP-1 | 03§14/Step15 | CROSS-006、RECOVERY-008 |
| 12 | BR-MP-302、NFR-MP-401 | 03§8.4/12 | CROSS-005 |
| 13 | NFR-MP-G04、AC-MP-G04 | 03Web/04locale | CROSS-008、CROSS-021 |

### 7.4 停审与跨覆盖审计

| 覆盖单元 | 停审结果（设计） | 修正/上限 |
|---|---|---|
| FR16 | pass | 五能力逐编号正反；不把Draft/create listing等同批准 |
| BR21 | pass | 不变量及禁止项逐编号；未新增TC族 |
| NFR17 | pass | 性能只有有界行为与candidate测量，无编造SLO |
| AC20/VETO5 | pass | 每一红线有自动化负例；06仍负责裁决 |
| IF14/DEP11 | pass with external risk | IF504仅验证未启用；DEP受控映射不关闭真实资格 |
| 13CUT反查 | pass | 无孤儿CUT；共享多需求证据只分配一个EV定义 |

跨项审计：104唯一需求ID；FR16/BR21/NFR17/AC20/IF14/DEP11/VETO5与00库存相等；TC九族，预留98个唯一TC/EV。后续Step6若修改编号必须同步本表；无未披露的本地P0空洞，真实positive阻塞显式保留。

## 8. 回填草稿

正式§5收录§7.1～7.3及未覆盖边界；逐覆盖项停审过程留calibration。本矩阵是规范性追溯附录，不能把“planned”删成“已测试”。

## 9. 待确认事项

MP-UP-001～008、MP-SRC-003/010/013、Q-MP-01及受影响owner/SDK资格不关闭。真实publisher/授权/决定/材料/receiver/probe/notice/producer正向、PG平台资格和容量profile保持blocked/pending。Billing/支付/订阅/分成/跨境为future；真实安装/激活/阅读不属本仓truth。IF504未激活，不存在Event用例正向成功。详细设计影响判定：当前无新增字段/入口/state需求，若真实consumer不能绑定须回03，不由05补口。

## 10. 进入下一步条件

逐需求与CUT都有候选TC及唯一EV分配规则，未覆盖正式positive已入风险；本步候选追溯门禁pass。下一读SOP Step6、书写规范§5.6、03七U Request/flow/状态/error，完成具体断言与主suite绑定；不提交commit。
