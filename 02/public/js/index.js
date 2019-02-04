;(function(){
  'use strict';
  var clockFace = document.querySelector('.clockFace');
  var hrHandler = document.querySelector('.hrHandler');
  var minHandler = document.querySelector('.minHandler');
  var secHandler = document.querySelector('.secHandler');
  for(var i = 0; i < 60; i++){
    var timePoint = document.createElement('div');
    (i % 5 === 0)? timePoint.classList.add('line') : timePoint.classList.add('point') ;
    timePoint.style.transform = 'translate(-50%) rotate(' + i*6 + 'deg)';
    clockFace.appendChild(timePoint);
  }
  for(var i = 0; i < 12; i++){
    var amNum = document.createElement('div');
    var amNumText = document.createElement('span');
    var pmNum= document.createElement('div');
    var pmNumText = document.createElement('span');
    amNum.classList.add('amNum');
    pmNum.classList.add('pmNum');
    (i === 0)? amNumText.innerText = 12 : amNumText.innerText = i;
    (i === 0)? pmNumText.innerText = 24 : pmNumText.innerText = i+12;
    amNumText.style.transform = 'rotate(' + (-i*30) + 'deg)'
    pmNumText.style.transform = 'rotate(' + (-i*30) + 'deg)'
    amNum.appendChild(amNumText);
    pmNum.appendChild(pmNumText);
    amNum.style.transform = 'translate(-50%) rotate(' + i*30 + 'deg)';
    pmNum.style.transform = 'translate(-50%) rotate(' + i*30 + 'deg)';
    clockFace.appendChild(amNum);
    clockFace.appendChild(pmNum);
  }
  function showTime(){
    var timeData = new Date();
    var hr = timeData.getHours();
    var min = timeData.getMinutes();
    var sec = timeData.getSeconds();
    var secMillis = timeData.getMilliseconds();
    var secRotate = sec*6 + secMillis*0.006 + 180;
    var minRotate = min*6 + sec*0.1 + 180 ;
    var hrRotate = hr*30 + min*0.5 + 180;
    secHandler.setAttribute('style','transform: translateX(-50%) rotate(' + secRotate + 'deg)');
    minHandler.setAttribute('style','transform: translateX(-50%) rotate(' + minRotate + 'deg)');
    hrHandler.setAttribute('style','transform: translateX(-50%) rotate(' + hrRotate + 'deg)');
    window.requestAnimationFrame(showTime);
  }
  window.requestAnimationFrame(showTime);
})()