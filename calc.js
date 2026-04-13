var g=function(id){return document.getElementById(id);};
function n(v){return Math.round(v).toLocaleString();}
function ru(v){return Math.round(v/10000)*10000;}
function getSqm(v,u){return u==='sqm'?v:v*3.3058;}
function getPy(v,u){return u==='pyeong'?v:v/3.3058;}
function fmtDate(s){if(!s)return '';var d=new Date(s);return d.getFullYear()+'.'+String(d.getMonth()+1).padStart(2,'0')+'.'+String(d.getDate()).padStart(2,'0');}
function fmtDateKo(s){if(!s)return '';var d=new Date(s);return d.getFullYear()+'년 '+String(d.getMonth()+1).padStart(2,'0')+'월 '+String(d.getDate()).padStart(2,'0')+'일';}

function bindChk(a,b,cb){g(a).addEventListener('change',function(){g(b).style.display=this.checked?'block':'none';if(cb)cb();});}
bindChk('chk-bt','body-bt',updateBtPreview);
bindChk('chk-cs','body-cs');
bindChk('chk-ur','body-ur');
bindChk('chk-add','body-add');
bindChk('chk-freight','body-freight');
bindChk('chk-sky','body-sky');
bindChk('chk-ladder','body-ladder');

function onAreaChange(){var v=parseFloat(g('pyeong').value)||0,u=g('unit-main').value;g('main-cv').textContent=u==='pyeong'?'= '+getSqm(v,u).toFixed(2)+' ㎡':'= '+getPy(v,u).toFixed(2)+' 평';updateBtPreview();}
g('pyeong').addEventListener('input',onAreaChange);g('unit-main').addEventListener('change',onAreaChange);

function getBtCalc(t,s){var b=t<=2,so=b?96:176,rp=b?2:4,dp=1.75*t,ar=so/dp,bt=Math.ceil(s/ar);return{batches:bt,hyperKg:bt*16,remiPo:bt*rp,isBasic:b,dopo:dp,area:ar};}
function updateBtPreview(){if(!g('body-bt')||g('body-bt').style.display==='none')return;var v=parseFloat(g('bt-area').value)||0,u=g('bt-unit').value,sqm=getSqm(v,u),py=getPy(v,u);g('bt-cv').textContent=u==='pyeong'?'= '+sqm.toFixed(2)+' ㎡':'= '+py.toFixed(2)+' 평';var t=parseFloat(g('bt-thick').value),r=getBtCalc(t,sqm);g('bt-preview').innerHTML='시공 면적: '+py.toFixed(1)+'평 ('+sqm.toFixed(2)+'㎡) / '+(r.isBasic?'기본(레미탈 2포)':'증량(레미탈 4포)')+'<br>도포량: '+r.dopo.toFixed(3)+'kg/㎡ / 배합당: '+r.area.toFixed(1)+'㎡<br>→ '+r.batches+'배합 / 하이퍼 '+r.hyperKg+'kg / 레미탈 '+r.remiPo+'포';}
g('bt-area').addEventListener('input',updateBtPreview);g('bt-unit').addEventListener('change',updateBtPreview);g('bt-thick').addEventListener('change',updateBtPreview);g('bt-price').addEventListener('input',updateBtPreview);

function switchTab(name){['internal','submit','cover'].forEach(function(t){g('tab-'+t).style.display=t===name?'block':'none';});g('tb-i').classList.toggle('active',name==='internal');g('tb-s').classList.toggle('active',name==='submit');g('tb-c').classList.toggle('active',name==='cover');}
g('tb-i').addEventListener('click',function(){switchTab('internal');});g('tb-s').addEventListener('click',function(){switchTab('submit');});g('tb-c').addEventListener('click',function(){switchTab('cover');});
g('sb1').addEventListener('click',function(){setSky(650000,this);});g('sb2').addEventListener('click',function(){setSky(400000,this);});g('sb3').addEventListener('click',function(){setSky(null,this);});
function setSky(a,btn){[g('sb1'),g('sb2'),g('sb3')].forEach(function(b){b.classList.remove('active');});btn.classList.add('active');if(a!==null)g('sky-amt').value=a;}

var PRESETS=[
  {key:'extra',label:'추가 공사 별도',text:'본 견적 외 추가 공사 발생 시 별도의 추가 비용이 발생함'},
  {key:'utility',label:'용수/전기 무상',text:'공사에 필요한 용수 및 전기는 현장에서 무상 제공을 원칙으로 함'},
  {key:'dust',label:'연삭/분진/폐자재',text:'연삭 장비 사용, 분진 수거 및 폐자재 반출 비용 미포함'},
  {key:'ladder',label:'사다리차 비용',text:'사다리차 등 장비 사용 비용 미포함'},
  {key:'warranty',label:'하자이행보증',text:'서비스 공사 품목은 당사 하자이행보증 범위에서 제외됨'},
  {key:'price',label:'단가 인상',text:'최근 원자재 단가 변동이 잦아 발주 시점에 따라 자재 단가가 일부 변동될 수 있음'},
  {key:'weather',label:'날씨 조건',text:'기상 조건(강우, 강풍, 기온 5도 이하)에 따라 시공 일정이 변경될 수 있음'},
  {key:'validity',label:'견적 유지 기간',text:'본 견적서는 발행일로부터 30일간 유효하며 이후 재발행을 원칙으로 함'},
  {key:'cure',label:'양생 기간',text:'시공 후 양생 기간(최소 24시간) 동안 해당 구역 출입 및 통행을 제한함'},
  {key:'survey',label:'현장 확인 후 변동',text:'본 견적은 현장 방문 전 기준이며 실제 현장 확인 후 금액이 변동될 수 있음'},
  {key:'vat',label:'VAT 별도',text:'본 견적 금액은 부가가치세(VAT 10%)가 포함되지 않은 금액임'},
  {key:'scope',label:'공사 범위',text:'본 견적의 공사 범위는 협의 내용에 한하며 추가 범위는 별도 협의함'},
];
var DEFAULT_KEYS=['extra','utility','dust','ladder','warranty'];
var notes=[],usedKeys={};
function initNotes(){notes=DEFAULT_KEYS.map(function(k){return{key:k,text:PRESETS.filter(function(p){return p.key===k;})[0].text};});usedKeys={};DEFAULT_KEYS.forEach(function(k){usedKeys[k]=true;});renderNotes();}
function renderNotes(){g('note-list').innerHTML=notes.map(function(note,i){return '<div class="note-item"><span class="note-num">'+(i+1)+'</span><input type="text" class="note-inp" data-idx="'+i+'" value="'+note.text.replace(/"/g,'&quot;')+'"><button class="del-btn" data-del="'+i+'">×</button></div>';}).join('');g('note-list').querySelectorAll('.note-inp').forEach(function(inp){inp.addEventListener('input',function(){notes[+this.dataset.idx].text=this.value;});});g('note-list').querySelectorAll('.del-btn').forEach(function(btn){btn.addEventListener('click',function(){deleteNote(+this.dataset.del);});});g('preset-grid').innerHTML=PRESETS.map(function(p){var u=!!usedKeys[p.key];return '<button class="preset-btn'+(u?' used':'')+'" data-key="'+p.key+'">'+p.label+(u?' ✓':'')+'</button>';}).join('');g('preset-grid').querySelectorAll('.preset-btn:not(.used)').forEach(function(btn){btn.addEventListener('click',function(){addPresetNote(this.dataset.key);});});}
function deleteNote(i){var r=notes.splice(i,1)[0];if(r.key)delete usedKeys[r.key];renderNotes();}
function addPresetNote(key){if(usedKeys[key])return;notes.push({key:key,text:PRESETS.filter(function(p){return p.key===key;})[0].text});usedKeys[key]=true;renderNotes();}
function addCustomNote(){var inp=g('custom-inp');var v=inp.value.trim();if(!v)return;notes.push({key:null,text:v});inp.value='';renderNotes();}
g('custom-add-btn').addEventListener('click',addCustomNote);
g('custom-inp').addEventListener('keydown',function(e){if(e.key==='Enter')addCustomNote();});

var cvData={};
function updateCover(){var name=g('f-name').value,addr=g('f-addr').value,mgr=g('f-mgr').value.split('|'),date=g('f-date').value;g('cv-title').innerHTML=name.replace(/\n/g,'<br>')+'<br>견적서';g('cv-sub').textContent=addr||'공사 위치';g('cv-mgr').innerHTML='담당자: '+mgr[0]+'<br>'+mgr[1];g('cv-date').innerHTML=(fmtDate(date)||'2026.04.08')+'<br>토방이앤지';var rows=[];rows.push({lbl:'공 사 명',val:name});if(addr)rows.push({lbl:'위\u00a0\u00a0\u00a0\u00a0치',val:addr});if(g('sh-area').checked&&cvData.area)rows.push({lbl:'면\u00a0\u00a0\u00a0\u00a0적',val:cvData.area});if(g('sh-work').checked&&cvData.work)rows.push({lbl:'공\u00a0\u00a0\u00a0\u00a0정',val:cvData.work});if(g('sh-bt').checked&&cvData.bt)rows.push({lbl:'바탕조정',val:cvData.bt});if(g('sh-cs').checked&&cvData.cs)rows.push({lbl:'복합시트',val:cvData.cs});if(g('sh-ur').checked&&cvData.ur)rows.push({lbl:'우레탄방수',val:cvData.ur});g('cv-rows').innerHTML=rows.map(function(r){return '<div class="cv-row"><span class="cv-lbl">'+r.lbl+'</span><span class="cv-val">'+r.val+'</span></div>';}).join('');}
['f-name','f-addr','f-date'].forEach(function(id){g(id).addEventListener('input',updateCover);g(id).addEventListener('change',updateCover);});
g('f-mgr').addEventListener('change',updateCover);
['sh-area','sh-work','sh-bt','sh-cs','sh-ur'].forEach(function(id){g(id).addEventListener('change',updateCover);});

var iMatRows=[],iLaborRows=[],sRows=[];

// 설정값 읽기 헬퍼
function sv(id,def){var el=g(id);return el?(parseFloat(el.value)||def):def;}

// 설정값 기본값
var DEFAULTS={
  'hyper':65000,'remi':7000,'hado':52000,'jungdo':57000,'sangdo':75000,
  'thinner':34000,'sheet':120000,'tape':5000,'sealant':10000,
  'tech':250000,'gen':180000,'buja':1600,'mgmt':5000,
  'profit-rate':10,'surcharge':50,
  'hado-rate':0.13,'sangdo-rate':0.11,'thinner-rate':0.0625,'ur-15':1.4,
  'sheet-area':13.5,
  'bt-s1-t':1,'bt-s1-g':0,'bt-s2-t':1,'bt-s2-g':1,
  'bt-s3-t':2,'bt-s3-g':2,'bt-s4-t':2,'bt-s4-g':3,
  'ur-base':2,'ur-coef':0.02,'ur-base3':4,'ur-coef3':0.02,
  'cs-sheet-crew':3,'cs-sheet-base':30
};

function getSV(key){return sv('s-'+key,DEFAULTS[key])||sv('f-'+key,DEFAULTS[key]);}

// 설정 패널 토글
if(g('settings-toggle-btn'))g('settings-toggle-btn').addEventListener('click',function(){
  var p=g('settings-panel');
  p.classList.toggle('open');
  this.textContent=p.classList.contains('open')?'✕ 설정 닫기':'⚙ 단가/계산식 설정';
});

// 설정 탭
document.querySelectorAll('.settings-tab').forEach(function(btn){
  btn.addEventListener('click',function(){
    document.querySelectorAll('.settings-tab').forEach(function(b){b.classList.remove('active');});
    document.querySelectorAll('.settings-sec').forEach(function(s){s.classList.remove('active');});
    this.classList.add('active');
    g('stab-'+this.dataset.stab).classList.add('active');
  });
});

// 기본값 초기화
if(g('settings-reset-btn'))g('settings-reset-btn').addEventListener('click',function(){
  Object.keys(DEFAULTS).forEach(function(key){
    var el=g('s-'+key)||g('f-'+key);
    if(el)el.value=DEFAULTS[key];
  });
  if(g('nego-chk')){g('nego-chk').checked=false;}
  if(g('nego-body')){g('nego-body').style.display='none';}
  if(g('nego-amount')){g('nego-amount').value=0;}
  if(g('nego-rate')){g('nego-rate').value=0;}
  updateNegoResult();
  
});

// 설정 변경 시 바탕조정 단가 자동 반영
document.querySelectorAll('[id^="s-"],[id^="f-"]').forEach(function(inp){
  inp.addEventListener('input',function(){
    if(g('result-wrap').classList.contains('show')) recalcEdit();
    updateBtPreview();
    updateNegoResult();
  });
});

// 네고 (제출용 탭에 있으므로 null 체크)
// 견적서 형식 선택
var estimateFormat = 'normal';
function bindFormatBtns(){
  var btnN=g('fmt-normal'), btnI=g('fmt-ilwi');
  if(!btnN||!btnI) return;
  btnN.addEventListener('click',function(){
    estimateFormat='normal';
    btnN.style.background='#2563eb';btnN.style.color='#fff';btnN.style.borderColor='#2563eb';
    btnI.style.background='#fff';btnI.style.color='#6b7280';btnI.style.borderColor='#d1d5db';
    if(g('ilwi-notice')) g('ilwi-notice').style.display='none';
  });
  btnI.addEventListener('click',function(){
    estimateFormat='ilwi';
    btnI.style.background='#2563eb';btnI.style.color='#fff';btnI.style.borderColor='#2563eb';
    btnN.style.background='#fff';btnN.style.color='#6b7280';btnN.style.borderColor='#d1d5db';
    if(g('ilwi-notice')) g('ilwi-notice').style.display='block';
  });
}
bindFormatBtns();

// 갑지 체크박스 - 미리보기 토글




function bindNego(){
  var chk=g('nego-chk');
  if(!chk)return;
  chk.addEventListener('change',function(){
    g('nego-body').style.display=this.checked?'block':'none';
    updateNegoResult();
  });
  var nt=g('nego-type');
  if(nt)nt.addEventListener('change',function(){
    g('nego-amount-row').style.display=this.value==='amount'?'flex':'none';
    g('nego-rate-row').style.display=this.value==='rate'?'flex':'none';
    updateNegoResult();
  });
  var na=g('nego-amount');if(na)na.addEventListener('input',updateNegoResult);
  var nr=g('nego-rate');if(nr)nr.addEventListener('input',updateNegoResult);
}
bindNego();

function getNegoAmount(total){
  if(!g('nego-chk')||!g('nego-chk').checked)return 0;
  if(g('nego-type')&&g('nego-type').value==='amount') return parseFloat(g('nego-amount').value)||0;
  return Math.round(total*(parseFloat(g('nego-rate')?g('nego-rate').value:0)||0)/100);
}

function updateNegoResult(){
  if(!g('nego-chk')||!g('nego-result'))return;
  if(!g('nego-chk').checked){g('nego-result').innerHTML='네고 미적용';return;}
  var totalEl=g('s-total');
  if(!totalEl||totalEl.textContent==='-'){g('nego-result').innerHTML='견적 계산 후 적용됩니다.';return;}
  var totalStr=totalEl.textContent.replace(/[^0-9]/g,'');
  var total=parseFloat(totalStr)||0;
  var nego=getNegoAmount(total);
  var final=ru(total-nego);
  g('nego-result').innerHTML=
    '<div style="display:flex;justify-content:space-between;margin-bottom:4px;"><span style="color:#6b7280;">공사금액</span><span>'+n(total)+' 원</span></div>'+
    '<div style="display:flex;justify-content:space-between;margin-bottom:4px;"><span style="color:#dc2626;">네고 차감</span><span style="color:#dc2626;">- '+n(nego)+' 원</span></div>'+
    '<div style="display:flex;justify-content:space-between;font-weight:700;font-size:14px;border-top:1px solid #e5e7eb;padding-top:6px;"><span>최종 공사금액</span><span style="color:#2563eb;">'+n(final)+' 원</span></div>';
}
var extraItems=[];
function addMatRow(공정,항목,규격,theory,qty,ul,price,surcharge){var id='mp_'+iMatRows.length;iMatRows.push({id:id,qty:qty});var surRate=1+(sv('s-surcharge',50)/100);var amt=qty*price,sp=Math.round(price*(surcharge?surRate:1));sRows.push({공정:공정,항목:항목,규격:규격,qty:qty,ul:ul,단가:sp,amt:qty*sp,type:'mat',id:'s_'+sRows.length});return '<tr><td>'+공정+'</td><td>'+항목+'</td><td>'+규격+'</td><td class="r">'+theory+'</td><td class="r">'+qty+ul+'</td><td class="r"><input type="number" class="amt-inp" id="'+id+'" data-qty="'+qty+'" value="'+price+'"></td><td class="r" id="'+id+'_a">'+n(amt)+'</td></tr>';}
function addLaborRow(공정,기준,count,price){var id='lp_'+iLaborRows.length;iLaborRows.push({id:id,count:count});var amt=count*price;sRows.push({공정:공정,항목:'시공비',규격:'-',qty:1,ul:'식',단가:0,amt:amt,type:'labor',id:'s_'+sRows.length});return '<tr><td>'+공정+'</td><td>'+기준+'</td><td class="r">'+count+'인</td><td class="r"><input type="number" class="amt-inp" id="'+id+'" data-qty="'+count+'" value="'+price+'"></td><td class="r" id="'+id+'_a">'+n(amt)+'</td></tr>';}

function calc(){
  iMatRows=[];iLaborRows=[];sRows=[];
  var mainV=parseFloat(g('pyeong').value)||0,mainU=g('unit-main').value,mainSqm=getSqm(mainV,mainU),mainPy=getPy(mainV,mainU);
  var iMatHTML='',iLaborHTML='';
  cvData={area:mainPy.toFixed(0)+'평 ('+mainSqm.toFixed(2)+'㎡)'};
  var workParts=[];

  if(g('chk-bt').checked){
    var btV=parseFloat(g('bt-area').value)||0,btU=g('bt-unit').value,btSqm=getSqm(btV,btU),btPy=getPy(btV,btU);
    var thick=parseFloat(g('bt-thick').value),hP=parseFloat(g('bt-price').value)||getSV('hyper'),rP=parseFloat(g('bt-remi').value)||getSV('remi');
    var sp=parseInt(g('bt-special').value),r=getBtCalc(thick,btSqm);
    iMatHTML+=addMatRow('바탕조정','하이퍼','16kg/말',r.hyperKg+'kg',r.batches,'말',hP,true);
    iMatHTML+=addMatRow('바탕조정','레미탈','40kg/포',(r.remiPo*40)+'kg',r.remiPo,'포',rP,false);
    var tech=0,gen=0;
    var s1t=sv('f-bt-s1-t',1),s1g=sv('f-bt-s1-g',0),s2t=sv('f-bt-s2-t',1),s2g=sv('f-bt-s2-g',1);
    var s3t=sv('f-bt-s3-t',2),s3g=sv('f-bt-s3-g',2),s4t=sv('f-bt-s4-t',2),s4g=sv('f-bt-s4-g',3);
    if(btPy<10){tech=s1t;gen=s1g;}else if(btPy<20){tech=s2t;gen=s2g;}else if(btPy<=60){tech=s3t;gen=s3g;}else{tech=s4t;gen=s4g;}
    if(sp)gen+=1;
    var techWage=sv('s-tech',250000),genWage=sv('s-gen',180000);
    iLaborHTML+=addLaborRow('바탕조정','기술자 ('+btPy.toFixed(1)+'평)',tech,techWage);
    if(gen>0)iLaborHTML+=addLaborRow('바탕조정','일반공',gen,genWage);
    workParts.push('바탕조정');cvData.bt=btPy.toFixed(0)+'평 / '+thick+'mm';
  }

  if(g('chk-cs').checked){
    var st=parseFloat(g('cs-st').value),ut=parseFloat(g('cs-ut').value);
    var csSp=parseFloat(g('cs-sp').value)||sv('s-sheet',120000),drain=parseInt(g('cs-drain').value);
    var hadoRate=sv('f-hado-rate',0.13),sangdoRate=sv('f-sangdo-rate',0.11),thinnerRate=sv('f-thinner-rate',0.0625);
    var sheetArea=sv('f-sheet-area',13.5),urCoef=sv('f-ur-15',1.4);
    var ureKg=mainSqm*ut*urCoef;
    var hadoQ=Math.ceil(mainSqm*hadoRate/14),sheetQ=Math.ceil(mainSqm/sheetArea)+drain;
    var jKg=ureKg,jQ=Math.ceil(jKg/20),sQ=Math.ceil(mainSqm*sangdoRate/16),snQ=Math.ceil(jKg*thinnerRate/17);
    var buja=Math.round(mainPy*sv('s-buja',1600));
    var hPrice=sv('s-hado',52000),jPrice=sv('s-jungdo',57000),sPrice=sv('s-sangdo',75000),tPrice=sv('s-thinner',34000);
    var tapePrice=sv('s-tape',5000),sealPrice=sv('s-sealant',10000);
    iMatHTML+=addMatRow('복합시트','하도','14L/통',(mainSqm*hadoRate).toFixed(1)+'L',hadoQ,'통',hPrice,true);
    iMatHTML+=addMatRow('복합시트','시트('+st+'mm)','15m롤',(mainSqm/sheetArea).toFixed(2)+'롤',sheetQ,'롤',csSp,true);
    iMatHTML+=addMatRow('복합시트','망사테이프','개','-',sheetQ,'개',tapePrice,true);
    iMatHTML+=addMatRow('복합시트','실란트','개','-',sheetQ*3,'개',sealPrice,true);
    iMatHTML+=addMatRow('복합시트','중도('+ut+'mm)','20kg/세트',jKg.toFixed(1)+'kg',jQ,'세트',jPrice,true);
    iMatHTML+=addMatRow('복합시트','상도','16kg/통',(mainSqm*sangdoRate).toFixed(1)+'kg',sQ,'통',sPrice,true);
    iMatHTML+=addMatRow('복합시트','신나','17L/통',(jKg*thinnerRate).toFixed(1)+'L',snQ,'통',tPrice,true);
    var bid='mp_cs_buja';
    iMatHTML+='<tr><td>복합시트</td><td>부자재</td><td>'+mainPy.toFixed(0)+'평×'+sv('s-buja',1600)+'</td><td class="r">-</td><td class="r">1식</td><td class="r"><input type="number" class="amt-inp" id="'+bid+'" data-qty="1" value="'+buja+'"></td><td class="r" id="'+bid+'_a">'+n(buja)+'</td></tr>';
    iMatRows.push({id:bid,qty:1});sRows.push({공정:'복합시트',항목:'부자재',규격:'-',qty:1,ul:'식',단가:buja,amt:buja,type:'mat',id:'s_cs_buja'});
    var csCrewBase=sv('f-cs-sheet-base',30),csCrew=sv('f-cs-sheet-crew',3);
    var urBase=sv('f-ur-base',2),urCoefL=sv('f-ur-coef',0.02);
    var techWage=sv('s-tech',250000);
    iLaborHTML+=addLaborRow('복합시트','시트 시공',Math.ceil(mainPy/csCrewBase)*csCrew,techWage);
    iLaborHTML+=addLaborRow('복합시트','우레탄 방수',Math.ceil(urBase+mainSqm*urCoefL),techWage);
    workParts.push('복합시트방수');cvData.cs=mainPy.toFixed(0)+'평 / 시트 '+st+'mm + 우레탄 '+ut+'mm';
  }

  if(g('chk-ur').checked){
    var urT=parseFloat(g('ur-thick').value);
    var hadoRate2=sv('f-hado-rate',0.13),sangdoRate2=sv('f-sangdo-rate',0.11),thinnerRate2=sv('f-thinner-rate',0.0625);
    var urCoef2=sv('f-ur-15',1.4);
    var jKg2=mainSqm*urT*urCoef2;
    var hadoQ2=Math.ceil(mainSqm*hadoRate2/14),jQ2=Math.ceil(jKg2/20),sQ2=Math.ceil(mainSqm*sangdoRate2/16),snQ2=Math.ceil(jKg2*thinnerRate2/17);
    var buja2=Math.round(mainPy*sv('s-buja',1600));
    var hPrice2=sv('s-hado',52000),jPrice2=sv('s-jungdo',57000),sPrice2=sv('s-sangdo',75000),tPrice2=sv('s-thinner',34000);
    var techWage2=sv('s-tech',250000);
    iMatHTML+=addMatRow('우레탄','하도','14L/통',(mainSqm*hadoRate2).toFixed(1)+'L',hadoQ2,'통',hPrice2,true);
    iMatHTML+=addMatRow('우레탄','중도('+urT+'mm)','20kg/세트',jKg2.toFixed(1)+'kg',jQ2,'세트',jPrice2,true);
    iMatHTML+=addMatRow('우레탄','상도','16kg/통',(mainSqm*sangdoRate2).toFixed(1)+'kg',sQ2,'통',sPrice2,true);
    iMatHTML+=addMatRow('우레탄','신나','17L/통',(jKg2*thinnerRate2).toFixed(1)+'L',snQ2,'통',tPrice2,true);
    var bid2='mp_ur_buja';
    iMatHTML+='<tr><td>우레탄</td><td>부자재</td><td>'+mainPy.toFixed(0)+'평×'+sv('s-buja',1600)+'</td><td class="r">-</td><td class="r">1식</td><td class="r"><input type="number" class="amt-inp" id="'+bid2+'" data-qty="1" value="'+buja2+'"></td><td class="r" id="'+bid2+'_a">'+n(buja2)+'</td></tr>';
    iMatRows.push({id:bid2,qty:1});sRows.push({공정:'우레탄',항목:'부자재',규격:'-',qty:1,ul:'식',단가:buja2,amt:buja2,type:'mat',id:'s_ur_buja'});
    var urBase2=urT===3?sv('f-ur-base3',4):sv('f-ur-base',2);
    var urCoefL2=urT===3?sv('f-ur-coef3',0.02):sv('f-ur-coef',0.02);
    var cnt=Math.ceil(urBase2+mainSqm*urCoefL2);
    var cntLabel='ROUNDUP('+urBase2+'+㎡×'+urCoefL2+')';
    iLaborHTML+=addLaborRow('우레탄',cntLabel,cnt,techWage2);
    workParts.push('우레탄방수');cvData.ur=mainPy.toFixed(0)+'평 / '+urT+'mm';
  }
  cvData.work=workParts.join(' + ');

  var sHTML='<tr><td>공통</td><td>바탕면 정리</td><td>-</td><td class="r">1식</td><td class="r">-</td><td class="r">-</td></tr>';
  var seen={};sRows.forEach(function(r){seen[r.공정]=true;});
  Object.keys(seen).forEach(function(공정){sRows.filter(function(r){return r.공정===공정&&r.type==='mat';}).forEach(function(r){sHTML+='<tr><td>'+r.공정+'</td><td>'+r.항목+'</td><td>'+r.규격+'</td><td class="r">'+r.qty+r.ul+'</td><td class="r">'+(r.단가>0?n(r.단가):'-')+'</td><td class="r"><input type="number" class="amt-inp" id="'+r.id+'" value="'+r.amt+'"></td></tr>';});var lt=sRows.filter(function(r){return r.공정===공정&&r.type==='labor';}).reduce(function(s,r){return s+r.amt;},0);if(lt>0)sHTML+='<tr><td>'+공정+'</td><td>시공비</td><td>-</td><td class="r">1식</td><td class="r">-</td><td class="r"><input type="number" class="amt-inp" id="s_labor_'+공정+'" value="'+lt+'"></td></tr>';});
  var mgmt=Math.round(mainPy*sv('s-mgmt',5000));sHTML+='<tr><td>공통</td><td>현장관리 및 부자재</td><td>-</td><td class="r">1식</td><td class="r">-</td><td class="r"><input type="number" class="amt-inp" id="s_mgmt" value="'+mgmt+'"></td></tr>';

  var addHTML='',addTotal=0,hasAdd=false;
  if(g('chk-freight').checked){var a=parseFloat(g('freight-amt').value)||0;addTotal+=a;hasAdd=true;addHTML+='<tr><td>운임</td><td class="r"><input type="number" class="amt-inp" id="add_freight" value="'+a+'"></td></tr>';sHTML+='<tr><td>추가항목</td><td>운임</td><td>-</td><td class="r">1식</td><td class="r">-</td><td class="r"><input type="number" class="amt-inp" id="s_freight" value="'+a+'"></td></tr>';}
  if(g('chk-sky').checked){var a2=parseFloat(g('sky-amt').value)||0;addTotal+=a2;hasAdd=true;addHTML+='<tr><td>스카이 장비</td><td class="r"><input type="number" class="amt-inp" id="add_sky" value="'+a2+'"></td></tr>';sHTML+='<tr><td>추가항목</td><td>스카이 장비</td><td>-</td><td class="r">1식</td><td class="r">-</td><td class="r"><input type="number" class="amt-inp" id="s_sky" value="'+a2+'"></td></tr>';}
  if(g('chk-ladder').checked){var a3=parseFloat(g('ladder-amt').value)||0;addTotal+=a3;hasAdd=true;addHTML+='<tr><td>사다리차</td><td class="r"><input type="number" class="amt-inp" id="add_ladder" value="'+a3+'"></td></tr>';sHTML+='<tr><td>추가항목</td><td>사다리차</td><td>-</td><td class="r">1식</td><td class="r">-</td><td class="r"><input type="number" class="amt-inp" id="s_ladder" value="'+a3+'"></td></tr>';}

  g('i-add-sec').style.display=hasAdd?'block':'none';g('i-add-row').style.display=hasAdd?'table-row':'none';
  g('i-add-body').innerHTML=addHTML;g('i-add-total').textContent=n(addTotal);g('i-add-sum').textContent=n(addTotal);
  g('i-mat-body').innerHTML=iMatHTML||'<tr><td colspan="7" style="text-align:center;padding:12px;color:#9ca3af;">선택된 공정 없음</td></tr>';
  g('i-labor-body').innerHTML=iLaborHTML||'<tr><td colspan="5" style="text-align:center;padding:12px;color:#9ca3af;">선택된 공정 없음</td></tr>';
  g('s-body').innerHTML=sHTML;
  document.addEventListener('input',function(e){if(e.target.classList.contains('amt-inp'))recalcEdit();});
  g('f-name').value='방수공사';g('f-date').value=new Date().toISOString().split('T')[0];
  initNotes();updateCover();g('result-wrap').classList.add('show');recalcEdit();bindNego();bindFormatBtns();
}
g('calc-btn').addEventListener('click',calc);

function recalcEdit(){
  var matSum=0;document.querySelectorAll('.amt-inp[id^="mp_"]').forEach(function(inp){var q=parseFloat(inp.dataset.qty)||0,p=parseFloat(inp.value)||0,a=q*p;matSum+=a;var el=g(inp.id+'_a');if(el)el.textContent=n(a);});
  g('i-mat-total').textContent=n(matSum);g('i-mat-sum').textContent=n(matSum);
  var laborSum=0;document.querySelectorAll('.amt-inp[id^="lp_"]').forEach(function(inp){var q=parseFloat(inp.dataset.qty)||0,p=parseFloat(inp.value)||0,a=q*p;laborSum+=a;var el=g(inp.id+'_a');if(el)el.textContent=n(a);});
  g('i-labor-total').textContent=n(laborSum);g('i-labor-sum').textContent=n(laborSum);
  var addSum=0;document.querySelectorAll('.amt-inp[id^="add_"]').forEach(function(inp){addSum+=parseFloat(inp.value)||0;});
  g('i-add-total').textContent=n(addSum);g('i-add-sum').textContent=n(addSum);g('i-grand').textContent=n(matSum+laborSum+addSum);
  var submitSum=0;
  document.querySelectorAll('.amt-inp[id^="s_"]').forEach(function(inp){submitSum+=parseFloat(inp.value)||0;});
  extraItems.forEach(function(item){submitSum+=item.amt||0;});
  var profitRate=sv('s-profit-rate',10)/100;
  var profit=Math.round(submitSum*profitRate),supply=submitSum+profit,final=ru(supply);
  g('s-cost').textContent=n(submitSum);g('s-profit').textContent=n(profit);g('s-supply').textContent=n(supply);g('s-total').textContent=n(final)+'원';
  g('c-mat').textContent=n(matSum);g('c-labor').textContent=n(laborSum);g('c-total').textContent=n(final)+'원';
  updateNegoResult();
  
}


function renderExtraRows(){
  var tbody=g('extra-rows');
  if(!tbody)return;
  tbody.innerHTML=extraItems.map(function(item,i){
    var amt=(parseFloat(item.qty)||0)*(parseFloat(item.price)||0);
    extraItems[i].amt=amt;
    return '<tr>'
      +'<td style="padding:3px 4px;border-bottom:0.5px solid #f3f4f6;"><input style="width:60px;height:24px;border:0.5px solid #d1d5db;border-radius:4px;padding:0 4px;font-size:11px;" value="'+item.gong+'" data-idx="'+i+'" data-field="gong" class="extra-inp"></td>'
      +'<td style="padding:3px 4px;border-bottom:0.5px solid #f3f4f6;"><input style="width:80px;height:24px;border:0.5px solid #d1d5db;border-radius:4px;padding:0 4px;font-size:11px;" value="'+item.name+'" data-idx="'+i+'" data-field="name" class="extra-inp"></td>'
      +'<td style="padding:3px 4px;border-bottom:0.5px solid #f3f4f6;"><input style="width:70px;height:24px;border:0.5px solid #d1d5db;border-radius:4px;padding:0 4px;font-size:11px;" value="'+item.spec+'" data-idx="'+i+'" data-field="spec" class="extra-inp"></td>'
      +'<td style="padding:3px 4px;border-bottom:0.5px solid #f3f4f6;"><input type="number" style="width:50px;height:24px;border:0.5px solid #d1d5db;border-radius:4px;padding:0 4px;font-size:11px;text-align:right;" value="'+item.qty+'" data-idx="'+i+'" data-field="qty" class="extra-inp extra-calc"></td>'
      +'<td style="padding:3px 4px;border-bottom:0.5px solid #f3f4f6;"><input style="width:36px;height:24px;border:0.5px solid #d1d5db;border-radius:4px;padding:0 4px;font-size:11px;" value="'+item.unit+'" data-idx="'+i+'" data-field="unit" class="extra-inp"></td>'
      +'<td style="padding:3px 4px;border-bottom:0.5px solid #f3f4f6;"><input type="number" style="width:70px;height:24px;border:0.5px solid #d1d5db;border-radius:4px;padding:0 4px;font-size:11px;text-align:right;" value="'+item.price+'" data-idx="'+i+'" data-field="price" class="extra-inp extra-calc"></td>'
      +'<td style="padding:3px 4px;border-bottom:0.5px solid #f3f4f6;text-align:right;font-size:11px;color:#1a1a2e;">'+n(amt)+'</td>'
      +'<button style="width:20px;height:20px;border:0.5px solid #d1d5db;border-radius:4px;background:#fff;color:#9ca3af;font-size:12px;cursor:pointer;line-height:1;" data-del="'+i+'" class="extra-del">×</button>'
      +'</tr>';
  }).join('');
  tbody.querySelectorAll('.extra-inp').forEach(function(inp){
    inp.addEventListener('input',function(){
      var idx=+this.dataset.idx,field=this.dataset.field;
      extraItems[idx][field]=this.value;
      if(field==='qty'||field==='price'){
        var amt=(parseFloat(extraItems[idx].qty)||0)*(parseFloat(extraItems[idx].price)||0);
        extraItems[idx].amt=amt;
        var tr=this.closest('tr');
        if(tr)tr.querySelectorAll('td')[6].textContent=n(amt);
        recalcEdit();
      }
    });
  });
  tbody.querySelectorAll('.extra-del').forEach(function(btn){
    btn.addEventListener('click',function(){extraItems.splice(+this.dataset.del,1);renderExtraRows();recalcEdit();});
  });
}

g('extra-add-btn').addEventListener('click',function(){
  extraItems.push({gong:'기타',name:'',spec:'-',qty:0,unit:'식',price:0,amt:0});
  renderExtraRows();
});

g('save-btn').addEventListener('click',function(){
  // 현재 상태 수집
  var state = {
    pyeong: g('pyeong').value,
    unitMain: g('unit-main').value,
    chkBt: g('chk-bt').checked,
    btArea: g('bt-area').value,
    btUnit: g('bt-unit').value,
    btThick: g('bt-thick').value,
    btPrice: g('bt-price').value,
    btRemi: g('bt-remi').value,
    btSpecial: g('bt-special').value,
    chkCs: g('chk-cs').checked,
    csSt: g('cs-st').value,
    csUt: g('cs-ut').value,
    csSp: g('cs-sp').value,
    csDrain: g('cs-drain').value,
    chkUr: g('chk-ur').checked,
    urThick: g('ur-thick').value,
    chkAdd: g('chk-add').checked,
    chkFreight: g('chk-freight').checked,
    freightAmt: g('freight-amt').value,
    chkSky: g('chk-sky').checked,
    skyAmt: g('sky-amt').value,
    chkLadder: g('chk-ladder').checked,
    ladderAmt: g('ladder-amt').value,
    fName: g('f-name').value,
    fAddr: g('f-addr').value,
    fMgr: g('f-mgr').value,
    fDate: g('f-date').value,
    shArea: g('sh-area').checked,
    shWork: g('sh-work').checked,
    shBt: g('sh-bt').checked,
    shCs: g('sh-cs').checked,
    shUr: g('sh-ur').checked,
    printInternal: g('print-internal').checked,
    notes: notes,
    settings: (function(){
      var s={};
      document.querySelectorAll('[id^="s-"],[id^="f-"]').forEach(function(el){if(el.id)s[el.id]=el.value;});
      s['nego-chk']=g('nego-chk').checked;
      s['nego-type']=g('nego-type').value;
      s['nego-amount']=g('nego-amount').value;
      s['nego-rate']=g('nego-rate').value;
      return s;
    })(),
    extraItems: extraItems,
    // 계산된 s_ 입력값들
    sValues: {}
  };
  document.querySelectorAll('.amt-inp[id^="s_"]').forEach(function(inp){state.sValues[inp.id]=inp.value;});
  document.querySelectorAll('.amt-inp[id^="mp_"]').forEach(function(inp){state.sValues[inp.id]=inp.value;});
  document.querySelectorAll('.amt-inp[id^="lp_"]').forEach(function(inp){state.sValues[inp.id]=inp.value;});

  // 현재 HTML에 상태 주입해서 저장
  var html = document.documentElement.outerHTML;
  // 스크립트 태그 끝에 복원 스크립트 삽입
  var restoreScript = '<script>window.__SAVED_STATE__=' + JSON.stringify(state) + ';<\/script>';
  html = html.replace('</body>', restoreScript + '</body>');

  var blob = new Blob([html], {type:'text/html;charset=utf-8'});
  var url = URL.createObjectURL(blob);
  var a = document.createElement('a');
  var name = (g('f-name').value||'방수공사').replace(/\n/g,'_').replace(/[\s]+/g,'_');
  a.href = url;
  a.download = name + '_견적_' + new Date().toISOString().slice(0,10) + '.html';
  a.click();
  URL.revokeObjectURL(url);
});

g('pdf-btn').addEventListener('click',function(){buildPrintPages();setTimeout(function(){window.print();},400);});

onAreaChange();
