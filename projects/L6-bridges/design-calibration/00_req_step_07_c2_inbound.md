# C-BR-2：可解释入站交接成立

> 00 Step7当前单元；design_self_review=pass；C1已停审；非用户/owner signoff。

## 1. 来源与职责

C1、Conversation03 §7.4/8/12、PS-01/02/05/08/09/10/11/12。拥有局部verification/disposition/dedup/mapping记录，不拥有外部原始消息或内部Turn。

## 2. 问题、诊断与取舍

需要证明外部来源可信、目标受权且结果可解释。旧“收到即写Turn”忽略owner接纳和正文边界；采用平台私有验证与正式owner交接，不采用通用提交Turn、raw消息归档或metadata伪装已提交。

## 3. 故事目标与能力主题

参与者需要同一次外部交互只有一个可解释内部结果，编辑/删除/线程变化不被冒称等价；调用方需要ACK与业务结果分开。主题：验证与受控接管、owner交接、消息差异及来源映射。平台事件不包含可靠operationidentity时拒绝可重放副作用，不能用正文hash充当公开幂等证据。

## 4. 输入、输出、状态与数据边界

输入：瞬时平台原始请求、verified source、installation/binding generation、identity/location关系、source event/operation/version、safe material ref及owner admission依据。输出：transport ACK结果与owner accepted/rejected/pending/indeterminate结果分别记录；映射accepted fact/manifestation ref，不宣称Turn存在或执行完成。

语义路径：received -> verified或rejected -> authorized或blocked -> owner_handoff -> accepted/rejected/pending/indeterminate；duplicate返回既有结果，conflict/quarantined不提交。Conversation的target mode必须显式区分AppendFact/ManifestExternalFact；append遵守Integration actor、BridgeMapped kind和digest等正式输入约束。来源integration证明与人类责任链不能互相替代。

原始body只在adapter瞬时验签/转换；重放必须有正式owner管理的可重解析ref或获准platformsource，不能持久化原始body补恢复。安全材料owner、准入和ref合同缺失时blocked；digest不提供存储/读取权限。

## 5. 编辑、删除、线程与幂等

create/edit/delete是不同operation identity；每次变化指向原消息mapping和source version。不能把重复event当新内容，也不能把edit伪装新普通发言。原映射不存在或版本不可比时quarantined/gap；外部delete不能物理删除内部truth，只向owner交接获准变化，owner决定retraction/manifestation语义。thread/topic映射不同于内部Conversation创建授权，不支持时显式unsupported/degraded，不默默扁平化或换频道。

入站namespace最少包含platform+installation+source stream/epoch+operation identity；不可用message locator代替edit事件ID而吞变化。先安全记录接管/拒绝disposition，再按平台合同ACK；ACK前若无可恢复ref且尚未owner接纳，不能声称可靠接管。协议resume位置和owner处理cursor分离，不能因ACK推进业务complete。

## 6. 质量与验收语义

切口：bad signature、过期/重放、tenant冲突、重复/同ID变义、ACK早于owner、内部提交结果未知、edit/delete乱序与缺映射、thread不支持、无safe ref、digest mismatch。否决：平台ACK当commit、自动建身份、持久化raw body、重试未知提交时更换operationidentity、外部delete抹内部truth。证据仅ref、有限结果类别、来源版本与处理缺口，不含正文。

## 7. blocker与进入/退出

BR-UP-001/002/003/004/008/009。进入需C1有效、平台验证与材料合同；退出是明确accepted ref或拒绝/待定/未知及局部disposition。未知保留待对账，不借新请求ID盲重交。

## 8. 停审

平台接管、owner接纳与内部fact/Turn已分开；target mode引用正式来源；正文owner缺口未遮蔽；变化差异与幂等有反例。允许C3，不宣称实际入站已运行。
