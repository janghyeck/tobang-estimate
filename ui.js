// 저장된 상태 복원
if(window.__SAVED_STATE__){
  var st=window.__SAVED_STATE__;
  g('pyeong').value=st.pyeong||60;
  g('unit-main').value=st.unitMain||'pyeong';
  if(st.chkBt){g('chk-bt').checked=true;g('body-bt').style.display='block';}
  g('bt-area').value=st.btArea||20;
  g('bt-unit').value=st.btUnit||'pyeong';
  g('bt-thick').value=st.btThick||'1.5';
  g('bt-price').value=st.btPrice||65000;
  g('bt-remi').value=st.btRemi||7000;
  g('bt-special').value=st.btSpecial||'0';
  if(st.chkCs){g('chk-cs').checked=true;g('body-cs').style.display='block';}
  g('cs-st').value=st.csSt||'2';
  g('cs-ut').value=st.csUt||'2';
  g('cs-sp').value=st.csSp||120000;
  g('cs-drain').value=st.csDrain||'0';
  if(st.chkUr){g('chk-ur').checked=true;g('body-ur').style.display='block';}
  g('ur-thick').value=st.urThick||'1.5';
  if(st.chkAdd){g('chk-add').checked=true;g('body-add').style.display='block';}
  if(st.chkFreight){g('chk-freight').checked=true;g('body-freight').style.display='block';}
  g('freight-amt').value=st.freightAmt||0;
  if(st.chkSky){g('chk-sky').checked=true;g('body-sky').style.display='block';}
  g('sky-amt').value=st.skyAmt||650000;
  if(st.chkLadder){g('chk-ladder').checked=true;g('body-ladder').style.display='block';}
  g('ladder-amt').value=st.ladderAmt||100000;
  g('f-name').value=st.fName||'방수공사';
  g('f-addr').value=st.fAddr||'';
  g('f-mgr').value=st.fMgr||'장혁|010-9864-0418';
  g('f-date').value=st.fDate||'';
  g('sh-area').checked=st.shArea!==false;
  g('sh-work').checked=st.shWork!==false;
  g('sh-bt').checked=st.shBt!==false;
  g('sh-cs').checked=st.shCs!==false;
  g('sh-ur').checked=st.shUr!==false;
  g('print-internal').checked=st.printInternal!==false;
  if(st.notes)notes=st.notes;
  if(st.settings){
    Object.keys(st.settings).forEach(function(id){
      var el=g(id);
      if(el&&el.type==='checkbox')el.checked=st.settings[id];
      else if(el)el.value=st.settings[id];
    });
    if(st.settings['nego-chk'])g('nego-body').style.display='block';
    var nt=st.settings['nego-type'];
    if(nt){g('nego-amount-row').style.display=nt==='amount'?'flex':'none';g('nego-rate-row').style.display=nt==='rate'?'flex':'none';}
  }
  if(st.extraItems)extraItems=st.extraItems;
  // 계산 자동 실행
  setTimeout(function(){
    g('calc-btn').click();
    // 저장된 입력값 복원
    setTimeout(function(){
      if(st.sValues){Object.keys(st.sValues).forEach(function(id){var el=g(id);if(el)el.value=st.sValues[id];});}
      recalcEdit();
      renderExtraRows();
      if(st.notes){notes=st.notes;usedKeys={};st.notes.forEach(function(n){if(n.key)usedKeys[n.key]=true;});renderNotes();}
      updateCover();
    },300);
  },100);
}

onAreaChange();