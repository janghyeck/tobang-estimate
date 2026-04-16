function buildIlwiPages(name,addr,mgr,date,submitSum,profit,supply,final){
  // 표지
  g('ilwi-cover-title').innerHTML=name.replace(/\n/g,'<br>')+'<br>견적서';
  g('ilwi-cover-left').innerHTML=fmtDate(date)+'<br>토방이앤지';
  var mgrArr=mgr;
  g('ilwi-cover-company').innerHTML=
    '<tr><td style="background:#1e3a5f;color:#fff;font-weight:700;width:52px;text-align:center;padding:2.5px 4px;border:0.5px solid #162d4a;">상&nbsp;&nbsp;&nbsp;호</td><td style="text-align:center;padding:2.5px 4px;border:0.5px solid #c8d0db;">(주)토방이앤지</td></tr>'+
    '<tr><td style="background:#1e3a5f;color:#fff;font-weight:700;text-align:center;padding:2.5px 4px;border:0.5px solid #162d4a;">대표이사</td><td style="text-align:center;padding:2.5px 4px;border:0.5px solid #c8d0db;">이 경 수, 장 혁</td></tr>'+
    '<tr><td style="background:#1e3a5f;color:#fff;font-weight:700;text-align:center;padding:2.5px 4px;border:0.5px solid #162d4a;">담당자</td><td style="text-align:center;padding:2.5px 4px;border:0.5px solid #c8d0db;">'+mgrArr[0]+' / '+mgrArr[1]+'</td></tr>'+
    '<tr><td style="background:#1e3a5f;color:#fff;font-weight:700;text-align:center;padding:2.5px 4px;border:0.5px solid #162d4a;">전화번호</td><td style="text-align:center;padding:2.5px 4px;border:0.5px solid #c8d0db;">1522-2761</td></tr>';

  function navyTh(text){return '<th style="color:#fff!important;background:#1e3a5f!important;-webkit-print-color-adjust:exact!important;print-color-adjust:exact!important;padding:2px 4px;border:0.5px solid #162d4a;text-align:right;">'+text+'</th>';}
  function td(text,align,bg){var b=bg?'background:'+bg+'!important;':'';return '<td style="padding:1.8px 4px;border:0.5px solid #c8d0db;text-align:'+(align||'left')+';'+b+'">'+text+'</td>';}
  function subTd(text,align){return '<td style="padding:1.8px 4px;border:0.5px solid #b8c8e8;background:#e8f0fb!important;-webkit-print-color-adjust:exact!important;print-color-adjust:exact!important;font-weight:700;color:#1e3a5f;text-align:'+(align||'left')+';">'+text+'</td>';}
  function totTd(text,align){return '<td style="padding:1.8px 4px;border:0.5px solid #162d4a;background:#1e3a5f!important;-webkit-print-color-adjust:exact!important;print-color-adjust:exact!important;font-weight:700;color:#fff!important;text-align:'+(align||'left')+';">'+text+'</td>';}
  function grpTd(text){return '<td style="padding:2px 5px;border:0.5px solid #162d4a;background:#1e3a5f!important;-webkit-print-color-adjust:exact!important;print-color-adjust:exact!important;font-weight:700;color:#fff!important;">'+text+'</td>';}

  // 설정값
  var hadoRate=sv('f-hado-rate',0.13),sangdoRate=sv('f-sangdo-rate',0.11),thinnerRate=sv('f-thinner-rate',0.0625);
  var urCoef=sv('f-ur-15',1.4),sheetArea=sv('f-sheet-area',13.5);
  var hP=sv('s-hado',52000),jP=sv('s-jungdo',57000),sP=sv('s-sangdo',75000),tP=sv('s-thinner',34000);
  var techW=sv('s-tech',250000),genW=sv('s-gen',180000);
  var bujaP=sv('s-buja',1600),mgmtP=sv('s-mgmt',5000);
  var surRate=1+sv('s-surcharge',50)/100;
  var mainV=parseFloat(g('pyeong').value)||0,mainU=g('unit-main').value;
  var mainSqm=getSqm(mainV,mainU),mainPy=getPy(mainV,mainU);

  var totalMatAmt=0,totalLaborAmt=0,totalExpAmt=0,totalAmt=0;
  var jiptRows='',naeyeokRows='',rowNo=1;

  function addJipt(name,qty,unit,matD,matA,laborD,laborA,expD,expA){
    var tot=matA+laborA+expA;
    totalMatAmt+=matA;totalLaborAmt+=laborA;totalExpAmt+=expA;totalAmt+=tot;
    var idx=parseInt(jiptRows.split('<tr').length);
    var bg=idx%2===0?'':'background:#f6f8fc;';
    jiptRows+='<tr style="height:14px;'+bg+'">'+
      td(rowNo++,'center')+td(name)+td(qty,'center')+td(unit,'center')+
      td(matD>0?n(matD):'-','right')+td(matA>0?n(matA):'-','right')+
      td(laborD>0?n(laborD):'-','right')+td(laborA>0?n(laborA):'-','right')+
      td(expD>0?n(expD):'-','right')+td(expA>0?n(expA):'-','right')+
      td(n(tot),'right')+'</tr>';
  }

  // 바탕조정
  if(g('chk-bt').checked){
    var btV=parseFloat(g('bt-area').value)||0,btU=g('bt-unit').value;
    var btSqm=getSqm(btV,btU),btPy=getPy(btV,btU);
    var thick=parseFloat(g('bt-thick').value);
    var r=getBtCalc(thick,btSqm);
    var hP2=parseFloat(g('bt-price').value)||sv('s-hyper',65000);
    var rP2=parseFloat(g('bt-remi').value)||sv('s-remi',7000);
    var hKgPm=r.hyperKg/btSqm,rKgPm=(r.remiPo*40)/btSqm;
    var hAmt1=Math.round(hKgPm*(hP2/16)*surRate),rAmt1=Math.round(rKgPm*(rP2/40));
    var sp=parseInt(g('bt-special').value);
    var tech=btPy<10?sv('f-bt-s1-t',1):btPy<20?sv('f-bt-s2-t',1):btPy<=60?sv('f-bt-s3-t',2):sv('f-bt-s4-t',2);
    var gen=btPy<10?sv('f-bt-s1-g',0):btPy<20?sv('f-bt-s2-g',1):btPy<=60?sv('f-bt-s3-g',2):sv('f-bt-s4-g',3);
    if(sp)gen+=1;
    var laborAmt1=Math.round((tech*techW+gen*genW)/btSqm);
    var unitP1=hAmt1+rAmt1+laborAmt1;
    var matTotal1=Math.round((hAmt1+rAmt1)*btSqm);
    var laborTotal1=Math.round(laborAmt1*btSqm);

    addJipt('바탕조정공사',1,'식',0,matTotal1,0,laborTotal1,0,0);

    // 내역서
    naeyeokRows+='<tr style="height:14px;background:#1e3a5f!important;-webkit-print-color-adjust:exact!important;print-color-adjust:exact!important;">'+
      '<td colspan="13" style="color:#fff!important;font-weight:700;padding:2px 5px;border:0.5px solid #162d4a;">&nbsp;바탕조정공사</td></tr>';
    naeyeokRows+='<tr style="height:14px;">'+
      td('1','center')+td('옥상','center')+td('바탕조정')+td('하이퍼 '+thick+'mm')+
      td(btSqm.toFixed(2),'right')+td('㎡','center')+
      td(n(hAmt1+rAmt1),'right')+td(n(matTotal1),'right')+
      td(n(laborAmt1),'right')+td(n(laborTotal1),'right')+
      td('-','right')+td('-','right')+
      td(n(matTotal1+laborTotal1),'right')+'</tr>';
    naeyeokRows+='<tr style="height:14px;">'+
      subTd('')+subTd('')+subTd('계','right',6)+subTd('','right')+subTd(n(matTotal1),'right')+
      subTd('','right')+subTd(n(laborTotal1),'right')+subTd('','right')+subTd('-','right')+
      subTd(n(matTotal1+laborTotal1),'right')+'</tr>';
  }

  // 우레탄
  if(g('chk-ur').checked){
    var urT=parseFloat(g('ur-thick').value);
    var jKgPm=urT*urCoef;
    var hAmt2=Math.round(hadoRate*(hP*surRate/14));
    var jAmt2=Math.round(jKgPm*(jP*surRate/20));
    var sAmt2=Math.round(sangdoRate*(sP*surRate/16));
    var tAmt2=Math.round(jKgPm*thinnerRate*(tP*surRate/17));
    var bujaAmt2=Math.round(bujaP*surRate/3.3058);
    var urBase=urT===3?sv('f-ur-base3',4):sv('f-ur-base',2);
    var urCoefL=urT===3?sv('f-ur-coef3',0.02):sv('f-ur-coef',0.02);
    var crewPm=(urBase/mainSqm)+urCoefL;
    var laborAmt2=Math.round(crewPm*techW);
    var matPerSqm=hAmt2+jAmt2+sAmt2+tAmt2+bujaAmt2;
    var matTotal2=Math.round(matPerSqm*mainSqm);
    var laborTotal2=Math.round(laborAmt2*mainSqm);

    addJipt('우레탄방수공사',1,'식',0,matTotal2,0,laborTotal2,0,0);

    naeyeokRows+='<tr style="height:14px;background:#1e3a5f!important;-webkit-print-color-adjust:exact!important;print-color-adjust:exact!important;">'+
      '<td colspan="13" style="color:#fff!important;font-weight:700;padding:2px 5px;border:0.5px solid #162d4a;">&nbsp;우레탄방수공사</td></tr>';
    naeyeokRows+='<tr style="height:14px;">'+
      td('2','center')+td('옥상','center')+td('우레탄방수')+td(urT+'mm')+
      td(mainSqm.toFixed(2),'right')+td('㎡','center')+
      td(n(matPerSqm),'right')+td(n(matTotal2),'right')+
      td(n(laborAmt2),'right')+td(n(laborTotal2),'right')+
      td('-','right')+td('-','right')+
      td(n(matTotal2+laborTotal2),'right')+'</tr>';
    naeyeokRows+='<tr style="height:14px;">'+
      subTd('')+subTd('')+subTd('계','right',6)+subTd('','right')+subTd(n(matTotal2),'right')+
      subTd('','right')+subTd(n(laborTotal2),'right')+subTd('','right')+subTd('-','right')+
      subTd(n(matTotal2+laborTotal2),'right')+'</tr>';
  }

  // 복합시트
  if(g('chk-cs').checked){
    var st2=parseFloat(g('cs-st').value),ut2=parseFloat(g('cs-ut').value);
    var csSp2=parseFloat(g('cs-sp').value)||sv('s-sheet',120000);
    var sheetPm=1/sheetArea,tapePm=sheetPm,sealPm=sheetPm*3;
    var jKgPm2=ut2*urCoef;
    var hAmt3, primerLabel, primerSpec;
    if(typeof csPrimerType !== 'undefined' && csPrimerType === 'asphalt') {
      var asphaltRate3 = 18/(8*3.3058);
      var asphaltPrice3 = sv('cs-asphalt-price',32000);
      hAmt3 = Math.round(asphaltRate3 * (asphaltPrice3*surRate/18));
      primerLabel = '아스팔트프라이머'; primerSpec = '18L/말';
    } else {
      hAmt3 = Math.round(hadoRate*(hP*surRate/14));
      primerLabel = '하도'; primerSpec = '14L/통';
    }
    var shAmt3=Math.round(sheetPm*(csSp2*surRate));
    var tapAmt3=Math.round(tapePm*5000*surRate);
    var seaAmt3=Math.round(sealPm*10000*surRate);
    var jAmt3=Math.round(jKgPm2*(jP*surRate/20));
    var sAmt3=Math.round(sangdoRate*(sP*surRate/16));
    var tAmt3=Math.round(jKgPm2*thinnerRate*(tP*surRate/17));
    var bujaAmt3=Math.round(bujaP*surRate/3.3058);
    var csCrew=sv('f-cs-sheet-crew',3),csBase=sv('f-cs-sheet-base',30);
    var urCoefL2=sv('f-ur-coef',0.02),urBase2=sv('f-ur-base',2);
    var sheetLaborPm=(csCrew/csBase)/3.3058;
    var urLaborPm=urBase2/mainSqm+urCoefL2;
    var laborAmt3=Math.round((sheetLaborPm+urLaborPm)*techW);
    var matPerSqm3=hAmt3+shAmt3+tapAmt3+seaAmt3+jAmt3+sAmt3+tAmt3+bujaAmt3;
    var matTotal3=Math.round(matPerSqm3*mainSqm);
    var laborTotal3=Math.round(laborAmt3*mainSqm);

    addJipt('복합시트방수공사',1,'식',0,matTotal3,0,laborTotal3,0,0);

    naeyeokRows+='<tr style="height:14px;background:#1e3a5f!important;-webkit-print-color-adjust:exact!important;print-color-adjust:exact!important;">'+
      '<td colspan="13" style="color:#fff!important;font-weight:700;padding:2px 5px;border:0.5px solid #162d4a;">&nbsp;복합시트방수공사</td></tr>';
    naeyeokRows+='<tr style="height:14px;">'+
      td('','center')+td('옥상','center')+td('복합시트방수')+td('시트'+st2+'mm+우레탄'+ut2+'mm')+
      td(mainSqm.toFixed(2),'right')+td('㎡','center')+
      td(n(matPerSqm3),'right')+td(n(matTotal3),'right')+
      td(n(laborAmt3),'right')+td(n(laborTotal3),'right')+
      td('-','right')+td('-','right')+
      td(n(matTotal3+laborTotal3),'right')+'</tr>';
    naeyeokRows+='<tr style="height:14px;">'+
      subTd('')+subTd('')+subTd('계','right',6)+subTd('','right')+subTd(n(matTotal3),'right')+
      subTd('','right')+subTd(n(laborTotal3),'right')+subTd('','right')+subTd('-','right')+
      subTd(n(matTotal3+laborTotal3),'right')+'</tr>';
  }

  // 현장관리
  var mgmtTotal=Math.round(mainPy*mgmtP);
  totalExpAmt+=mgmtTotal;totalAmt+=mgmtTotal;
  jiptRows+='<tr style="height:14px;">'+
    td(rowNo++,'center')+td('현장관리 및 부자재')+td(1,'center')+td('식','center')+
    td('-','right')+td('-','right')+td('-','right')+td('-','right')+
    td(n(mgmtTotal),'right')+td(n(mgmtTotal),'right')+td(n(mgmtTotal),'right')+'</tr>';

  // 추가항목
  extraItems.forEach(function(item){
    if(!item.amt)return;
    totalExpAmt+=item.amt;totalAmt+=item.amt;
    jiptRows+='<tr style="height:14px;">'+
      td(rowNo++,'center')+td(item.gong+' '+item.name)+td(item.qty,'center')+td(item.unit,'center')+
      td('-','right')+td('-','right')+td('-','right')+td('-','right')+
      td(n(item.price),'right')+td(n(item.amt),'right')+td(n(item.amt),'right')+'</tr>';
  });

  // 빈 행 채우기 (28행 기준)
  var filledRows=jiptRows.split('<tr style="height:14px').length-1;
  for(var i=filledRows;i<25;i++){
    jiptRows+='<tr style="height:14px;">'+td('')+td('')+td('')+td('')+td('')+td('')+td('')+td('')+td('')+td('')+td('')+'</tr>';
  }
  jiptRows+='<tr style="height:14px;background:#1e3a5f!important;-webkit-print-color-adjust:exact!important;print-color-adjust:exact!important;">'+
    totTd('합&nbsp;&nbsp;&nbsp;&nbsp;계','')+totTd('')+totTd('')+totTd('')+
    totTd('','right')+totTd(n(totalMatAmt),'right')+
    totTd('','right')+totTd(n(totalLaborAmt),'right')+
    totTd('','right')+totTd(n(totalExpAmt),'right')+
    totTd(n(totalAmt),'right')+'</tr>';
  g('ilwi-jipt-rows').innerHTML=jiptRows;

  // 내역서 소계
  var naeyeokFilled=naeyeokRows.split('<tr style="height:14px').length-1;
  for(var j=naeyeokFilled;j<22;j++){
    naeyeokRows+='<tr style="height:14px;">'+td('')+td('')+td('')+td('')+td('')+td('')+td('')+td('')+td('')+td('')+td('')+td('')+td('')+'</tr>';
  }
  naeyeokRows+='<tr style="height:14px;background:#1e3a5f!important;-webkit-print-color-adjust:exact!important;print-color-adjust:exact!important;">'+
    totTd('소&nbsp;&nbsp;&nbsp;계','')+totTd('')+totTd('')+totTd('')+totTd('')+totTd('')+
    totTd('','right')+totTd(n(totalMatAmt),'right')+
    totTd('','right')+totTd(n(totalLaborAmt),'right')+
    totTd('','right')+totTd(n(totalExpAmt),'right')+
    totTd(n(totalAmt),'right')+'</tr>';
  g('ilwi-naeyeok-rows').innerHTML=naeyeokRows;

  

  // 공사비 정산
  var profitRate3=sv('s-profit-rate',10)/100;
  var ilwiProfit=Math.round(totalAmt*profitRate3),ilwiSupply=totalAmt+ilwiProfit,ilwiFinal=ru(ilwiSupply);
  var negoAmt2=getNegoAmount(ilwiFinal);
  var ilwiFinalNego=ru(ilwiFinal-negoAmt2);
  var costRows2='<tbody>'+
    '<tr><td style="padding:4px 10px;border:0.5px solid #c8d0db;">공사비 합계</td><td style="padding:4px 10px;border:0.5px solid #c8d0db;text-align:right;">'+n(totalAmt)+' 원</td></tr>'+
    '<tr style="background:#f6f8fc;"><td style="padding:4px 10px;border:0.5px solid #c8d0db;">기업이윤 ('+Math.round(profitRate3*100)+'%)</td><td style="padding:4px 10px;border:0.5px solid #c8d0db;text-align:right;">'+n(ilwiProfit)+' 원</td></tr>'+
    '<tr><td style="padding:4px 10px;border:0.5px solid #c8d0db;">공급가액</td><td style="padding:4px 10px;border:0.5px solid #c8d0db;text-align:right;">'+n(ilwiSupply)+' 원</td></tr>';
  if(negoAmt2>0)costRows2+='<tr><td style="padding:4px 10px;border:0.5px solid #c8d0db;color:#dc2626;">네고 차감</td><td style="padding:4px 10px;border:0.5px solid #c8d0db;text-align:right;color:#dc2626;">- '+n(negoAmt2)+' 원</td></tr>';
  costRows2+='<tr style="background:#1e3a5f!important;-webkit-print-color-adjust:exact!important;print-color-adjust:exact!important;"><td style="padding:6px 10px;color:#fff!important;font-weight:700;font-size:10pt;">총 공사금액 (V.A.T 별도)</td><td style="padding:6px 10px;color:#fff!important;font-weight:700;font-size:10pt;text-align:right;">'+(negoAmt2>0?n(ilwiFinalNego):n(ilwiFinal))+' 원</td></tr></tbody>';
  g('ilwi-cost').innerHTML=costRows2;
  if(g('ilwi-cost-page')) g('ilwi-cost-page').style.display='block';

  var notesHTML='';notes.forEach(function(note){notesHTML+='<p style="font-size:8pt;color:#374151;padding:2px 0;">- '+note.text+'</p>';});
  g('ilwi-notes').innerHTML=notesHTML;
  g('print-ilwi').style.display='block';
}

function buildPrintPages(){
  var name=g('f-name').value||'방수공사',addr=g('f-addr').value||'',mgr=g('f-mgr').value.split('|'),date=g('f-date').value,printInternal=g('print-internal').checked;
  g('pc-title').innerHTML=name.replace(/\n/g,'<br>')+'<br>견적서';
  var cvRows='';
  cvRows+='<tr><td style="color:#111827;font-size:10.5pt;width:90px;padding:9px 0;border-bottom:1px solid #9ca3af;font-weight:700;">공 사 명</td><td style="font-size:10.5pt;padding:9px 0;border-bottom:1px solid #9ca3af;color:#111827;font-weight:500;">'+name+'</td></tr>';
  if(addr)cvRows+='<tr><td style="color:#111827;font-size:10.5pt;padding:9px 0;border-bottom:1px solid #9ca3af;font-weight:700;">위\u00a0\u00a0\u00a0\u00a0치</td><td style="font-size:10.5pt;padding:9px 0;border-bottom:1px solid #9ca3af;color:#111827;font-weight:500;">'+addr+'</td></tr>';
  if(g('sh-area').checked&&cvData.area)cvRows+='<tr><td style="color:#111827;font-size:10.5pt;padding:9px 0;border-bottom:1px solid #9ca3af;font-weight:700;">면\u00a0\u00a0\u00a0\u00a0적</td><td style="font-size:10.5pt;padding:9px 0;border-bottom:1px solid #9ca3af;color:#111827;font-weight:500;">'+cvData.area+'</td></tr>';
  if(g('sh-work').checked&&cvData.work)cvRows+='<tr><td style="color:#111827;font-size:10.5pt;padding:9px 0;border-bottom:1px solid #9ca3af;font-weight:700;">공\u00a0\u00a0\u00a0\u00a0정</td><td style="font-size:10.5pt;padding:9px 0;border-bottom:1px solid #9ca3af;color:#111827;font-weight:500;">'+cvData.work+'</td></tr>';
  if(g('sh-bt').checked&&cvData.bt)cvRows+='<tr><td style="color:#111827;font-size:10.5pt;padding:9px 0;border-bottom:1px solid #9ca3af;font-weight:700;">바탕조정</td><td style="font-size:10.5pt;padding:9px 0;border-bottom:1px solid #9ca3af;color:#111827;font-weight:500;">'+cvData.bt+'</td></tr>';
  if(g('sh-cs').checked&&cvData.cs)cvRows+='<tr><td style="color:#111827;font-size:10.5pt;padding:9px 0;border-bottom:1px solid #9ca3af;font-weight:700;">복합시트</td><td style="font-size:10.5pt;padding:9px 0;border-bottom:1px solid #9ca3af;color:#111827;font-weight:500;">'+cvData.cs+'</td></tr>';
  if(g('sh-ur').checked&&cvData.ur)cvRows+='<tr><td style="color:#111827;font-size:10.5pt;padding:9px 0;border-bottom:1px solid #9ca3af;font-weight:700;">우레탄방수</td><td style="font-size:10.5pt;padding:9px 0;border-bottom:1px solid #9ca3af;color:#111827;font-weight:500;">'+cvData.ur+'</td></tr>';
  g('pc-table').innerHTML=cvRows;
  g('pc-mgr').innerHTML='<span style="font-size:11pt;color:#111827;font-weight:600;">'+mgr[0]+'</span><br><span style="font-size:11pt;color:#111827;font-weight:600;">'+mgr[1]+'</span>';
  g('pc-date').innerHTML='<span style="font-size:11pt;color:#111827;font-weight:600;">'+(fmtDate(date)||'')+'</span><br><span style="font-size:11pt;color:#111827;font-weight:600;">토방이앤지</span>';

  if(printInternal){
    var matSum=0,laborSum=0,piMatHTML='';
    document.querySelectorAll('#i-mat-body tr').forEach(function(tr,idx){var tds=tr.querySelectorAll('td');if(tds.length<7)return;var inp=tds[5].querySelector('input'),price=inp?parseFloat(inp.value)||0:0,qty=parseFloat(tds[4].textContent)||0,amt=qty*price;matSum+=amt;var bg=idx%2===0?'#fff':'#f8fafc';piMatHTML+='<tr style="background:'+bg+'"><td style="padding:4px 7px;border:0.5px solid #d1d5db;">'+tds[0].textContent+'</td><td style="padding:4px 7px;border:0.5px solid #d1d5db;">'+tds[1].textContent+'</td><td style="padding:4px 7px;border:0.5px solid #d1d5db;">'+tds[2].textContent+'</td><td style="padding:4px 7px;border:0.5px solid #d1d5db;text-align:right;">'+tds[3].textContent+'</td><td style="padding:4px 7px;border:0.5px solid #d1d5db;text-align:right;">'+tds[4].textContent+'</td><td style="padding:4px 7px;border:0.5px solid #d1d5db;text-align:right;">'+n(price)+'</td><td style="padding:4px 7px;border:0.5px solid #d1d5db;text-align:right;">'+n(amt)+'</td></tr>';});
    g('pi-mat-rows').innerHTML=piMatHTML;g('pi-mat-total').textContent=n(matSum);
    var piLaborHTML='';
    document.querySelectorAll('#i-labor-body tr').forEach(function(tr,idx){var tds=tr.querySelectorAll('td');if(tds.length<5)return;var inp=tds[3].querySelector('input'),price=inp?parseFloat(inp.value)||0:0,count=parseFloat(tds[2].textContent)||0,amt=count*price;laborSum+=amt;var bg=idx%2===0?'#fff':'#f8fafc';piLaborHTML+='<tr style="background:'+bg+'"><td style="padding:4px 7px;border:0.5px solid #d1d5db;">'+tds[0].textContent+'</td><td style="padding:4px 7px;border:0.5px solid #d1d5db;">'+tds[1].textContent+'</td><td style="padding:4px 7px;border:0.5px solid #d1d5db;text-align:right;">'+tds[2].textContent+'</td><td style="padding:4px 7px;border:0.5px solid #d1d5db;text-align:right;">'+n(price)+'</td><td style="padding:4px 7px;border:0.5px solid #d1d5db;text-align:right;">'+n(amt)+'</td></tr>';});
    g('pi-labor-rows').innerHTML=piLaborHTML;g('pi-labor-total').textContent=n(laborSum);
    g('pi-sum').innerHTML='<tbody><tr><td style="padding:5px 10px;border:0.5px solid #d1d5db;font-size:9pt;">자재비</td><td style="padding:5px 10px;border:0.5px solid #d1d5db;text-align:right;font-size:9pt;">'+n(matSum)+' 원</td></tr><tr style="background:#f8fafc"><td style="padding:5px 10px;border:0.5px solid #d1d5db;font-size:9pt;">노무비</td><td style="padding:5px 10px;border:0.5px solid #d1d5db;text-align:right;font-size:9pt;">'+n(laborSum)+' 원</td></tr><tr style="background:#2563eb!important;-webkit-print-color-adjust:exact!important;print-color-adjust:exact!important;"><td style="padding:8px 10px;color:#fff!important;font-weight:700;font-size:11pt;">내부검토 합계</td><td style="padding:8px 10px;color:#fff!important;font-weight:700;font-size:11pt;text-align:right;">'+n(matSum+laborSum)+' 원</td></tr></tbody>';
    // 추가항목 내부검토용에도 추가
    if(extraItems.length>0){
      var piExtraHTML='';
      extraItems.forEach(function(item,idx){
        var bg=idx%2===0?'#fff':'#f8fafc';
        piExtraHTML+='<tr style="background:'+bg+'"><td style="padding:4px 7px;border:0.5px solid #d1d5db;">'+item.gong+'</td><td style="padding:4px 7px;border:0.5px solid #d1d5db;">'+item.name+'</td><td style="padding:4px 7px;border:0.5px solid #d1d5db;">'+item.spec+'</td><td style="padding:4px 7px;border:0.5px solid #d1d5db;text-align:right;">-</td><td style="padding:4px 7px;border:0.5px solid #d1d5db;text-align:right;">'+item.qty+item.unit+'</td><td style="padding:4px 7px;border:0.5px solid #d1d5db;text-align:right;">'+n(item.price)+'</td><td style="padding:4px 7px;border:0.5px solid #d1d5db;text-align:right;">'+n(item.amt)+'</td></tr>';
        matSum+=item.amt;
      });
      g('pi-mat-rows').innerHTML+=piExtraHTML;
      g('pi-mat-total').textContent=n(matSum);
    }
    g('print-internal-page').style.display='block';
  } else {g('print-internal-page').style.display='none';}

  var psInfoHTML='<tbody><tr><td style="padding:5px 8px;border:0.5px solid #d1d5db;background:#f3f4f6;font-weight:700;width:28%;font-size:9pt;">공 사 명</td><td style="padding:5px 8px;border:0.5px solid #d1d5db;font-size:9pt;">'+name+'</td></tr>';
  if(addr)psInfoHTML+='<tr><td style="padding:5px 8px;border:0.5px solid #d1d5db;background:#f3f4f6;font-weight:700;font-size:9pt;">위\u00a0\u00a0\u00a0\u00a0치</td><td style="padding:5px 8px;border:0.5px solid #d1d5db;font-size:9pt;">'+addr+'</td></tr>';
  psInfoHTML+='<tr><td style="padding:5px 8px;border:0.5px solid #d1d5db;background:#f3f4f6;font-weight:700;font-size:9pt;">담 당 자</td><td style="padding:5px 8px;border:0.5px solid #d1d5db;font-size:9pt;">'+mgr[0]+' / '+mgr[1]+'</td></tr><tr><td style="padding:5px 8px;border:0.5px solid #d1d5db;background:#f3f4f6;font-weight:700;font-size:9pt;">제 출 일</td><td style="padding:5px 8px;border:0.5px solid #d1d5db;font-size:9pt;">'+fmtDateKo(date)+'</td></tr></tbody>';
  g('ps-info').innerHTML=psInfoHTML;

  var psRowsHTML='',rowIdx=0;
  document.querySelectorAll('#s-body tr').forEach(function(tr){var tds=tr.querySelectorAll('td');if(tds.length<6)return;var inp=tds[5].querySelector('input'),amt=inp?parseFloat(inp.value)||0:0,amtStr=inp?n(amt):tds[5].textContent,bg=rowIdx%2===0?'#fff':'#f8fafc';psRowsHTML+='<tr style="background:'+bg+'"><td style="padding:4px 7px;border:0.5px solid #d1d5db;">'+tds[0].textContent+'</td><td style="padding:4px 7px;border:0.5px solid #d1d5db;">'+tds[1].textContent+'</td><td style="padding:4px 7px;border:0.5px solid #d1d5db;">'+tds[2].textContent+'</td><td style="padding:4px 7px;border:0.5px solid #d1d5db;text-align:right;">'+tds[3].textContent+'</td><td style="padding:4px 7px;border:0.5px solid #d1d5db;text-align:right;">'+tds[4].textContent+'</td><td style="padding:4px 7px;border:0.5px solid #d1d5db;text-align:right;">'+amtStr+'</td></tr>';rowIdx++;});
  // 추가항목 제출용에 추가 (50% 할증 없이 그대로)
  extraItems.forEach(function(item,idx){
    var bg=(rowIdx+idx)%2===0?'#fff':'#f8fafc';
    psRowsHTML+='<tr style="background:'+bg+'"><td style="padding:4px 7px;border:0.5px solid #d1d5db;">'+item.gong+'</td><td style="padding:4px 7px;border:0.5px solid #d1d5db;">'+item.name+'</td><td style="padding:4px 7px;border:0.5px solid #d1d5db;">'+item.spec+'</td><td style="padding:4px 7px;border:0.5px solid #d1d5db;text-align:right;">'+item.qty+item.unit+'</td><td style="padding:4px 7px;border:0.5px solid #d1d5db;text-align:right;">'+n(item.price)+'</td><td style="padding:4px 7px;border:0.5px solid #d1d5db;text-align:right;">'+n(item.amt)+'</td></tr>';
  });
  g('ps-rows').innerHTML=psRowsHTML;

  var submitSum=0;document.querySelectorAll('.amt-inp[id^="s_"]').forEach(function(inp){submitSum+=parseFloat(inp.value)||0;});
  extraItems.forEach(function(item){submitSum+=item.amt||0;});
  var profitRate2=sv('s-profit-rate',10)/100;
  var profit=Math.round(submitSum*profitRate2),supply=submitSum+profit,final=ru(supply);
  var negoAmt=getNegoAmount(final);
  var finalNego=ru(final-negoAmt);
  var costRows='<tbody><tr><td style="padding:5px 10px;border:0.5px solid #d1d5db;font-size:9pt;">공사비 합계</td><td style="padding:5px 10px;border:0.5px solid #d1d5db;text-align:right;font-size:9pt;">'+n(submitSum)+' 원</td></tr><tr style="background:#f8fafc"><td style="padding:5px 10px;border:0.5px solid #d1d5db;font-size:9pt;">기업이윤 ('+Math.round(profitRate2*100)+'%)</td><td style="padding:5px 10px;border:0.5px solid #d1d5db;text-align:right;font-size:9pt;">'+n(profit)+' 원</td></tr><tr><td style="padding:5px 10px;border:0.5px solid #d1d5db;font-size:9pt;">공급가액</td><td style="padding:5px 10px;border:0.5px solid #d1d5db;text-align:right;font-size:9pt;">'+n(supply)+' 원</td></tr>';
  if(negoAmt>0){
    costRows+='<tr><td style="padding:5px 10px;border:0.5px solid #d1d5db;font-size:9pt;color:#dc2626;">네고 차감</td><td style="padding:5px 10px;border:0.5px solid #d1d5db;text-align:right;font-size:9pt;color:#dc2626;">- '+n(negoAmt)+' 원</td></tr>';
  }
  costRows+='<tr style="background:#2563eb!important;-webkit-print-color-adjust:exact!important;print-color-adjust:exact!important;"><td style="padding:8px 10px;color:#fff!important;font-weight:700;font-size:11pt;">총 공사금액 (V.A.T 별도)</td><td style="padding:8px 10px;color:#fff!important;font-weight:700;font-size:11pt;text-align:right;">'+(negoAmt>0?n(finalNego):n(final))+' 원</td></tr></tbody>';
  g('ps-cost').innerHTML=costRows;

  var notesHTML='';notes.forEach(function(note){notesHTML+='<p style="font-size:8.5pt;color:#374151;padding:2px 0;">- '+note.text+'</p>';});
  g('ps-notes').innerHTML=notesHTML;

  // 모든 인쇄 페이지 먼저 전부 숨김
  ['print-cover','print-submit','print-internal-page','print-ilwi'].forEach(function(id){
    if(g(id)) g(id).style.display='none';
  });
  if(g('ilwi-cost-page')) g('ilwi-cost-page').style.display='none';

  // @page 스타일 설정
  var styleEl=document.getElementById('print-orientation-style');
  if(!styleEl){styleEl=document.createElement('style');styleEl.id='print-orientation-style';document.head.appendChild(styleEl);}

  if(estimateFormat==='ilwi'){
    // 가로 A4 - 일반 견적 페이지 전부 강제 숨김
    ['print-cover','print-submit','print-internal-page','ilwi-cost-page'].forEach(function(id){
      var el=g(id); if(el) el.style.cssText='display:none!important;';
    });
    styleEl.textContent='@media print{@page{size:A4 landscape;margin:9mm 10mm;} .container{display:none!important;} #print-cover,#print-internal-page,#print-submit{display:none!important;} #ilwi-cost-page{display:block!important;} #print-ilwi,#ilwi-cover-page,#ilwi-summary-page,#ilwi-detail-page{display:block!important;} table{width:100%!important;table-layout:fixed!important;} thead th,thead tr{-webkit-print-color-adjust:exact!important;print-color-adjust:exact!important;} #ilwi-summary-page,#ilwi-detail-page,#ilwi-cost-page{width:277mm!important;max-width:277mm!important;box-sizing:border-box!important;overflow:visible!important;}}';
    buildIlwiPages(name,addr,mgr,date,submitSum,profit,supply,final);
  } else {
    // 세로 A4
    styleEl.textContent='@media print{@page{size:A4 portrait;margin:8mm 8mm;} .container{display:none!important;} #print-ilwi,#ilwi-cost-page{display:none!important;} table{width:100%!important;table-layout:fixed!important;} thead th,thead tr{-webkit-print-color-adjust:exact!important;print-color-adjust:exact!important;} #print-cover,#print-internal-page,#print-submit{width:194mm!important;max-width:194mm!important;box-sizing:border-box!important;}}';
    // 표지
    if(g('print-cover')) g('print-cover').style.display='block';
    // 내부검토용
    if(printInternal && g('print-internal-page')) g('print-internal-page').style.display='block';
    // 갑지
    
    // 견적서
    if(g('print-submit')) g('print-submit').style.display='block';
  }

  window.addEventListener('afterprint',function(){
    ['print-cover','print-submit','print-internal-page','print-ilwi'].forEach(function(id){
      if(g(id)) g(id).style.display='none';
    });
    if(g('ilwi-cost-page')) g('ilwi-cost-page').style.display='none';
  },{once:true});
}
