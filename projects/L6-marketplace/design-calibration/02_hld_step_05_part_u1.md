# Step5 U1 来源与发布责任

## 思考与诊断

来源：00§9 FR-MP-101/102/103、00§10相关BR与01§6 U1。本部分职责是核验来源与材料、绑定/解除publisher责任。输入必须为owner不可变引用、正式主体/组织/权限/材料依据，输出仅body-free资格缺口或责任关联。现有01只划责任，未给功能到对象的承接；若继承产品词会越权到认证/Identity/签名扫描生产/资产正文。

取舍：以来源与发布责任局部功能为轴，拒绝把认证/Identity/签名扫描生产/资产正文纳入本地对象。计划：功能→候选六维→边界接缝→回填→停审；当前功能表尚未写入。

## 结构化结果

| 功能 / capability | 输入 | 输出 | 状态 / 副作用 | 后续展开 |
|---|---|---|---|---|
| 来源资格核验 | owner正式type/ref/version/digest/visibility/eligibility | SourceBinding/SourceVerification Qualified或安全Blocked | 本地核验过程，缺合同不positive | §6～9；FR-MP-101；CUT-MP-1 |
| 发布责任建立/解除 | 正式主体/组织/scope/authority | PublisherRelation Bound/Released | 仅局部关系；currentauth另复核 | §6～9；FR-MP-102；CUT-MP-1 |
| 材料适用核验 | 签名/扫描/SBOM formal材料ref+kind/validity | MaterialReference或safe gap | 不产签名/扫描结果/approval | §6～9；FR-MP-103；CUT-MP-1 |

| 代码主体 / 模块 | 类型 | 作用 | 后续展开位置 |
|---|---|---|---|
| SourceResponsibilityService | Application Service | 编排本部分意图/当前依据与局部变化 | Step7/8、03函数/UoW |
| SourceGatePolicy | Domain policy | 守来源/当前资格/禁止事项，不从配置授权 | Step6/8/9 |
| MarketStorePort / OperationStorePort | inside-owned port | typed存取本部分已成立对象/原结果；不改外部truth | Step7/8、03typed方法 |

| 维度 | 候选对象 | Step 6 展开要求 |
|---|---|---|
| Truth / State | PublisherRelation、SourceVerification | 每独立carrier成卡；enum在carrier状态表，禁止全局Done |
| Policy / Invariant | SourceGatePolicy | 独立卡片，guard输入来源必须闭合 |
| Projection / Read model | SourceQualificationView | 独立typed read卡片或明确仅U7共享投影切片，不另造存储truth |
| Reference / Boundary | SourceBinding、MaterialReference | 独立binding/上下文卡片；纯ref标量列排除 |
| Audit / History | 责任与核验变化回指 | U6 MarketAuditRecord唯一承接，其余只typed关联 |

## 接缝与禁止

U1向U2交付固定资格basis，U3/U4当前核验仍重新消费正式owner。 不承担认证/Identity/签名扫描生产/资产正文。

## 回填与停审

正式§5摘录本功能/代码/候选/边界结果；Step6按候选正式化。已核对功能来源、输入输出、局部状态与证明上限；本部分P1～P8完成，internal stop_review/pass，允许下一个部分。没有创建实现或external evidence。

## 展示类型映射反查

### 可发布内容展示分类

展示分类不是上游schema枚举或市场资产正文；五类复用同一listing/application/review/version/distribution/withdrawal流程，差异仅通过qualified owner adapter和formalreceiver合同表达。

| 展示分类候选 | 正文/正式版本owner | 市场只保存 | 当前准入边界 |
|---|---|---|---|
| 方法资产 Method asset | L3-method-library | qualified immutable ref/version/digest/visibility、市场metadata | 正式方法类型/consumer材料与SDK映射按MP-UP-001核验 |
| 过程模板 ProcessTemplate | L3-method-library | qualified sourcebinding与listing/marketversion | 不复制流程正文，不把市场上架等同模板正式化 |
| 角色定义 RoleDefinition | L3-method-library | 正式角色来源组合/安全摘要 | 不由Identity Role summary或GlobalMember反造Role正文 |
| 能力组件 Capability | L3-capability-hub | Registry/Descriptor/Exposure正式safe refs与visibility来源 | registry存在或scan结果不是marketapproval，formalexposure/current资格仍需匹配 |
| Member Image | L2-member-images | pinned image/entry/provenance/eligibility正式ref与摘要 | 不造image内容/Artifact lineage/launchtruth；consumer未qualified不可声称可安装，0outbound |

桥接包、联合资产包、MK2包及任意Artifact正文不会因原型标签或全局产品愿景成为第六类可发布truth；需要正式owner/类型/版本/摘要/资格与受控范围变更，MP-SRC-013保留。


来源是当前00FR-MP-301/AC-MP-301与01的既有五展示类型，未新增ownerenum/资产种类或正文能力。
