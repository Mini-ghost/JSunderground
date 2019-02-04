;(function(){
  'use strict';
  var fun = document.querySelector('.fun');
  var ans = document.querySelector('.ans');
  var calcNum = document.getElementsByClassName('calcBtn');

  var funText = '';
  var ansText = '0';
  var isOpe = false;
  var lastInput = '';
  var beforeInput = [];
  var opeInput = [];
  var isEqual = false

  function addCommas(val) {
    return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  function plusFun(ancNum,nowNum){
    ancNum = (ancNum + nowNum).toFixed(10)
    return Number(ancNum)
  }
  function minusFun(ancNum,nowNum){
    ancNum = (ancNum - nowNum).toFixed(10)
    return Number(ancNum)
  }
  function mulFun(ancNum,nowNum){
    ancNum = (ancNum * nowNum).toFixed(10)
    return Number(ancNum)
  }
  function divFun(ancNum,nowNum){
    ancNum = (ancNum / nowNum).toFixed(10)
    return Number(ancNum)
  }
  function calcHandler(obj){
    var objContet = obj.dataset.item
    var nowAnsText = ans.innerText
    if(obj.classList.contains('del')){
      ansText = ansText.toString();
      (ansText.length !== 1)?  ansText = ansText.substr(0, ansText.length-1) : ansText = 0;
      if(isEqual){
        funText = '';
        beforeInput = [];
        opeInput = [];
      }
    }
    if(isOpe && obj.classList.contains('ope')){
      opeInput[opeInput.length-1] = objContet;
      var textArray = funText.split('');
      textArray[textArray.length-1] = objContet;
      funText = textArray.join('');
      fun.innerText = funText;
      return;
    };
    if(isOpe){nowAnsText = '0'};
    obj.classList.contains('ope')? '': isOpe = false;
    if(objContet === '.'){
      if(nowAnsText === '0'){ ansText = '0.' }
      else if(nowAnsText.indexOf('.') === -1){ansText += objContet;}
    }
    else if(obj.classList.contains('num')){
      if(nowAnsText === '0'){ ansText = Number(objContet) }
      else{ ansText += objContet }
    }
    else if(obj.classList.contains('ope')){
      isEqual?  '' : beforeInput.push(ansText);
      isEqual? opeInput = [objContet] : opeInput.push(objContet);
      isEqual? funText = funText + objContet : funText = funText + nowAnsText + objContet;
      isOpe = true;
      isEqual = false;
    }
    else if(obj.classList.contains('ac')){
      funText = '';
      ansText = '0';
      isOpe = false;
      beforeInput = [];
      opeInput = [];
      isEqual = false;
    }
    else if(obj.classList.contains('equal')){  
      isEqual? beforeInput.push(lastInput) : beforeInput.push(ansText)
      var ancNum = Number(beforeInput[0])
      var i = 1
      var il = beforeInput.length
      for(; i<il ; i++){
        var nowNum = Number(beforeInput[i])
        var nowOpe = opeInput[i-1]
        nowOpe === '+'? ancNum = plusFun(ancNum,nowNum) : '';
        nowOpe === '-'? ancNum = minusFun(ancNum,nowNum) : '';
        nowOpe === '×'? ancNum = mulFun(ancNum,nowNum) : '';
        nowOpe === '÷'? ancNum = divFun(ancNum,nowNum) : '';
      }
      ansText = ancNum
      funText = '';
      beforeInput = [ancNum]
      isEqual = true
    }
    isEqual?  '' : lastInput = ansText;
    ans.innerText = addCommas(ansText);
    fun.innerText = funText;
  }
  for(var i = 0, l = calcNum.length; i < l; i++){
    var obj = calcNum[i];
    obj.addEventListener('click',function(){calcHandler(this);})
  }
})()