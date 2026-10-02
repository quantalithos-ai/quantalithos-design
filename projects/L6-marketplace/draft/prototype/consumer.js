// Consumer prototype data never leaves this browser session.
const consumer = { selected: 0, query: '', type: 'all', favorites: new Set(), requests: [] };
const words = (en, zh) => state.language === 'zh' ? zh : en;
const names = ['证据驱动交付流程', '代码仓库治理工具包', '研究成员镜像'];
const types = ['流程模板', 'MCP 工具', '成员镜像'];
const assetTypes = [
  {key:'method',en:'Method asset',zh:'方法资产',owner:'L3-method-library'},
  {key:'template',en:'Process template',zh:'流程模板',owner:'L3-method-library'},
  {key:'role',en:'Role definition',zh:'角色定义',owner:'L3-method-library'},
  {key:'capability',en:'Capability asset',zh:'能力资产',owner:'L3-capability-hub'},
  {key:'image',en:'Member image',zh:'成员镜像',owner:'L2-member-images'}
];
listings[0].typeKey='template';
listings[1].typeKey='capability';
listings[2].typeKey='image';
listings.push(
  {icon:'M',title:'Evidence-driven delivery method',typeKey:'method',publisher:'Aris Collective',version:'1.0.0',status:'pending',statusLabel:'Pending review',description:'Reusable method definition referenced from Method Library.',tags:['method']},
  {icon:'R',title:'Delivery reviewer role',typeKey:'role',publisher:'Aris Collective',version:'1.1.0',status:'pending',statusLabel:'Pending review',description:'Reusable reviewer role definition, not an identity or membership.',tags:['role']},
  {icon:'P',title:'Code review process',typeKey:'template',publisher:'Northstar Labs',version:'1.0.0',status:'pending',statusLabel:'Pending review',description:'A second process template with formal review handoff pending.',tags:['review']}
);
names.push('证据驱动交付方法','交付审查角色','代码审查流程');
const descriptions=['明确评审与证据交接的流程模板。','受控环境中的仓库检查与维护工具。','等待材料补充与正式审核的成员镜像。','引用方法库中的可复用方法定义。','可复用的审查角色定义，不代表身份或成员资格。','第二个流程模板，等待正式审核交接。'];
listings.forEach((asset,i)=>{const kind=assetTypes.find(t=>t.key===asset.typeKey);asset.type=kind.en;types[i]=kind.zh;});
const typeOf = asset => assetTypes.find(t=>t.key===asset.typeKey);
const reviewLabel = asset => words(asset.statusLabel, asset.status==='public'?'公开':asset.status==='restricted'?'受限':'待审核');
const assetName = i => words(listings[i].title, names[i]);
const escapeText = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function cards(indices) {
  return indices.map(i => `<article class="listing"><div class="listing-icon">${listings[i].icon}</div><div><h3><button class="button" data-open="${i}">${assetName(i)}</button></h3><p>${words(listings[i].description, ['明确评审与证据交接的流程模板。','受控环境中的仓库检查与维护工具。','等待材料补充与正式审核的成员镜像。'][i])}</p><div class="meta">${words(listings[i].type, types[i])} · ${listings[i].publisher} · v${listings[i].version}</div></div>${status(listings[i].status, words(listings[i].statusLabel, ['公开','受限','待审核'][i]))}</article>`).join('') || `<p class="empty">${words('No matching assets', '没有匹配资产')}</p>`;
}
catalog = function() {
  const indices = listings.map((_, i) => i).filter(i => (consumer.type === 'all' || consumer.type === String(i)) && `${listings[i].title} ${names[i]} ${listings[i].publisher} ${listings[i].tags.join(' ')}`.toLowerCase().includes(consumer.query.toLowerCase()));
  return `${shell(words('Marketplace catalog','资产市场目录'), words('Browse owner-referenced releases','浏览来源可追溯的资产版本'), `<button class="button" data-consumer="profile">${words('My assets','我的资产')}</button><button class="button primary" data-action="new-application">${words('Submit application','提交发布申请')}</button>`)}<section class="panel"><div class="panel-body"><div class="filters"><input id="consumer-search" class="input" value="${escapeText(consumer.query)}" placeholder="${words('Search assets or publishers','搜索资产或发布者')}"/><select id="consumer-type" class="select"><option value="all">${words('All asset types','全部资产类型')}</option>${listings.map((x,i)=>`<option value="${i}" ${consumer.type===String(i)?'selected':''}>${words(x.type,types[i])}</option>`).join('')}</select></div><small>${indices.length} ${words('assets','个资产')}</small>${cards(indices)}</div></section>`;
};
detail = function() {
  const i = consumer.selected, asset = listings[i];
  return `${shell(assetName(i), `${words(asset.type,types[i])} · ${asset.publisher}`, `<button class="button" data-action="catalog">${words('Back to catalog','返回目录')}</button>`)}<div class="detail-layout"><section class="panel"><div class="detail-section"><h3>${words('Description','描述')}</h3><p>${words(asset.description,['带有明确评审与证据交接的流程模板。','面向受控环境的代码仓库检查与维护工具。','研究型成员镜像，审核材料尚未完整。'][i])}</p></div><div class="detail-section"><h3>${words('Source and version','来源与版本')}</h3><dl class="kv"><dt>${words('Owner','资产拥有方')}</dt><dd>${['L3-method-library','L3-capability-hub','L2-member-images'][i]}</dd><dt>${words('Version','版本')}</dt><dd>${asset.version}</dd><dt>${words('Review status','审核状态')}</dt><dd>${words(asset.statusLabel,['公开','受限','待审核'][i])}</dd></dl></div><div class="detail-section"><h3>${words('Preview reference','预览引用')}</h3><p>${words('No owner-provided preview is available.','暂无资产拥有方提供的预览材料。')}</p></div><div class="detail-section"><h3>${words('Community feedback','社区反馈')}</h3><p>${words('No feedback yet. Ratings are not a quality verdict.','暂无反馈。评分不代表资产质量裁决。')}</p></div></section><aside class="panel"><div class="panel-body stack">${status(asset.status,words(asset.statusLabel,['公开','受限','待审核'][i]))}<button class="button" data-consumer="favorite">${consumer.favorites.has(i)?words('Remove favorite','取消收藏'):words('Save favorite','收藏资产')}</button><button class="button primary" data-consumer="get" ${i!==0?'disabled':''}>${words('Request this version','请求获取此版本')}</button><p>${words('Delivery is a handoff request, not installation activation.','获取仅形成分发交接请求，不表示安装或激活成功。')}</p><p>${words('Billing unavailable','计费服务未接入')}</p></div></aside></div>`;
};
function profileView() {
  return `${shell(words('My assets','我的资产'),words('Browser-session favorites and fixture requests','本次浏览器会话的收藏与演示请求'))}<section class="panel"><div class="panel-head"><h2>${words('Favorites','我的收藏')}</h2></div><div class="panel-body">${cards([...consumer.favorites])}</div></section><section class="panel" style="margin-top:20px"><div class="panel-head"><h2>${words('Acquisition history','获取记录')}</h2></div><div class="panel-body">${consumer.requests.map(i=>`<div class="listing"><div class="listing-icon">P</div><div><strong>${assetName(i)}</strong><p>v${listings[i].version}</p></div>${status('pending',words('Handoff pending','等待分发交接'))}</div>`).join('') || words('No requests yet','暂无获取请求')}</div></section>`;
}
cards = function(indices) {
  return indices.map(i=>`<article class="listing"><div class="listing-icon">${listings[i].icon}</div><div><h3><button class="button" data-open="${i}">${assetName(i)}</button></h3><p>${words(listings[i].description,descriptions[i])}</p><div class="meta">${words(typeOf(listings[i]).en,typeOf(listings[i]).zh)} · ${listings[i].publisher} · v${listings[i].version}</div></div>${status(listings[i].status,reviewLabel(listings[i]))}</article>`).join('')||`<p class="empty">${words('No matching assets','没有匹配资产')}</p>`;
};
catalog = function() {
  const indices=listings.map((_,i)=>i).filter(i=>(consumer.type==='all'||consumer.type===listings[i].typeKey)&&`${listings[i].title} ${names[i]} ${listings[i].publisher} ${listings[i].tags.join(' ')}`.toLowerCase().includes(consumer.query.toLowerCase()));
  return `${shell(words('Marketplace catalog','资产市场目录'),words('Five owner-referenced asset types','五类来源可追溯的资产'),`<button class="button" data-consumer="profile">${words('My assets','我的资产')}</button><button class="button primary" data-action="new-application">${words('Submit application','提交发布申请')}</button>`)}<section class="panel"><div class="panel-body"><div class="filters"><input id="consumer-search" class="input" value="${escapeText(consumer.query)}" placeholder="${words('Search assets or publishers','搜索资产或发布者')}"/><select id="consumer-type" class="select"><option value="all">${words('All asset types','全部资产类型')}</option>${assetTypes.map(t=>`<option value="${t.key}" ${consumer.type===t.key?'selected':''}>${words(t.en,t.zh)}</option>`).join('')}</select></div><small>${indices.length} ${words('assets','个资产')}</small>${cards(indices)}</div></section>`;
};
detail = function() {
  const i=consumer.selected,asset=listings[i],kind=typeOf(asset);
  return `${shell(assetName(i),`${words(kind.en,kind.zh)} · ${asset.publisher}`,`<button class="button" data-action="catalog">${words('Back to catalog','返回目录')}</button>`)}<div class="detail-layout"><section class="panel"><div class="detail-section"><h3>${words('Description','描述')}</h3><p>${words(asset.description,descriptions[i])}</p></div><div class="detail-section"><h3>${words('Source and version','来源与版本')}</h3><dl class="kv"><dt>${words('Owner','资产拥有方')}</dt><dd>${kind.owner}</dd><dt>${words('Version','版本')}</dt><dd>${asset.version}</dd><dt>${words('Immutable reference','不可变引用')}</dt><dd>${words('Owner reference contract pending','资产拥有方引用合同待闭合')}</dd><dt>${words('Receiver','获取接收方')}</dt><dd>${words('Receiver contract pending','接收合同待闭合')}</dd><dt>${words('Review','审核状态')}</dt><dd>${reviewLabel(asset)}</dd></dl></div><div class="detail-section"><h3>${words('Review materials','审核材料')}</h3><p>${kind.key==='image'?words('Signature, scan and SBOM references pending','签名、扫描与软件物料清单引用待补充'):words('Owner visibility and Governance decision references pending','拥有方可见性与治理决定引用待闭合')}</p></div><div class="detail-section"><h3>${words('Preview','预览')}</h3><p>${words('No owner-provided preview available','暂无资产拥有方提供的预览')}</p></div></section><aside class="panel"><div class="panel-body stack">${status(asset.status,reviewLabel(asset))}<button class="button" data-consumer="favorite">${consumer.favorites.has(i)?words('Remove favorite','取消收藏'):words('Save favorite','收藏资产')}</button><button class="button primary" data-consumer="get" ${i!==0?'disabled':''}>${words('Request fixture version','请求获取演示版本')}</button><p>${words('Fixture only; no installation or activation result.','仅演示请求，不产生安装或激活结果。')}</p></div></aside></div>`;
};
const originalRender = render;
applicationForm = function() {
  const kind=assetTypes.find(t=>t.key===consumer.publishType)||assetTypes[0];
  return `${shell(words('Release application','发布申请'),words('Submit immutable owner references for formal review','提交资产拥有方的不可变引用，进入正式审核'))}<section class="panel"><div class="panel-body stack"><label>${words('Asset type','资产类型')}<select id="publish-type" class="input">${assetTypes.map(t=>`<option value="${t.key}" ${t.key===kind.key?'selected':''}>${words(t.en,t.zh)}</option>`).join('')}</select></label><dl class="kv"><dt>${words('Owner','资产拥有方')}</dt><dd>${kind.owner}</dd><dt>${words('Receiver','获取接收方')}</dt><dd>${words('Formal receiver contract pending','正式接收合同待闭合')}</dd></dl><label>${words('Immutable asset reference','不可变资产引用')}<input class="input" placeholder="${words('Owner-provided reference','资产拥有方提供的引用')}"/></label><label>${words('Source version','来源版本')}<input class="input" placeholder="1.0.0"/></label><label>${words('Owner-provided digest','资产拥有方提供的摘要校验值')}<input class="input"/></label><label>${words('Summary','展示摘要')}<textarea class="input"></textarea></label><label>${words('Review material references','审核材料引用')}<input class="input"/></label>${kind.key==='image'?`<p>${words('Image signature, scan and SBOM references are required inputs, not approval.','镜像签名、扫描和软件物料清单引用是审核输入，不代表审核通过。')}</p>`:''}<button class="button primary" data-action="submit-fixture">${words('Submit fixture application','提交演示申请')}</button></div></section><section class="panel" style="margin-top:20px"><div class="panel-head"><h2>${words('Not yet supported','待支持类型')}</h2></div><div class="panel-body"><p>${words('Skill packages, shared rules, UI components and applications: owner and consumption contracts pending.','技能包、共享规则、UI 组件、应用作品：拥有方及消费合同待明确。')}</p><p>${words('Asset collections group references only. Executable deployment packages require a package owner and installation contract.','资产集合只组织引用。可执行部署包须先明确包拥有方与安装合同。')}</p></div></section>`;
};
render = function() {
  if(state.view === 'profile') { main.innerHTML = profileView(); applyLanguage(); }
  else originalRender();
  document.querySelectorAll('[data-open]').forEach(button => button.addEventListener('click', () => { consumer.selected=Number(button.dataset.open);state.view='detail';syncNav();render(); }));
  document.querySelectorAll('[data-consumer]').forEach(button => button.addEventListener('click', () => {
    if(button.dataset.consumer==='profile') state.view='profile';
    else if(button.dataset.consumer==='favorite') { if(consumer.favorites.has(consumer.selected)) consumer.favorites.delete(consumer.selected);else consumer.favorites.add(consumer.selected); }
    else if(button.dataset.consumer==='get' && consumer.selected===0) { if(!consumer.requests.includes(0)) consumer.requests.push(0);toast(words('Fixture request recorded; handoff pending','演示请求已记录，等待分发交接')); }
    syncNav();render();
  }));
  const search=document.getElementById('consumer-search');
  if(search) search.addEventListener('input', () => {const caret=search.selectionStart;consumer.query=search.value;render();const replacement=document.getElementById('consumer-search');replacement.focus();replacement.setSelectionRange(caret,caret);});
  const filter=document.getElementById('consumer-type');
  if(filter) filter.addEventListener('change', () => {consumer.type=filter.value;render();});
  const publishType=document.getElementById('publish-type');
  if(publishType) publishType.addEventListener('change',()=>{consumer.publishType=publishType.value;render();});
};
render();
