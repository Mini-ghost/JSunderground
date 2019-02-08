;(function(){
  console.time()
  'use strict';

  var rangeApi = 'json/airRange.json'
  var airApi = 'https://script.google.com/macros/s/AKfycbxe3Ba-MiNT5T_mHhW-mf5IixAk2xScNjX74766jThzC3sMAc0/exec?url=http://opendata2.epa.gov.tw/AQI.json'
  var pollutionApi = 'json/airPollution.json'

  var xhrAirRange = new XMLHttpRequest()
  var xhrAirApi = new XMLHttpRequest()
  var xhrPollutionApi = new XMLHttpRequest()

  var county = []
  var airData = []
  var showData = [];
  var pollution = []

  var defaultZoon = '臺中市'

  var countySelect = document.querySelector('.countySelect')
  var countyBtn = document.querySelector('.county')
  var allZoonBox = document.querySelectorAll('.allZoonBox');
  var nowCounty = document.querySelector('.nowCounty')
  var detailType = document.querySelector('.detailType')

  countyBtn.querySelector('.text').innerText = defaultZoon
  nowCounty.innerText = defaultZoon

  function loadPollution(callback,xhrObj){
    xhrPollutionApi.open('get', pollutionApi, true)
    xhrPollutionApi.onload = function(){
      if(xhrPollutionApi.status >= 200 && xhrPollutionApi.status < 400){
        pollution = JSON.parse(xhrPollutionApi.responseText)
        callback(xhrObj.responseText)
      }
      else{console.log('xhrPollutionApi err')}
    }
    xhrPollutionApi.send()
  }

  function zoonClickHandler(obj){
    var detailBoxData = showData[0]
    if(typeof obj === 'object'){detailBoxData = showData[obj.dataset.index]}

    var ulObj = document.createElement('ul')
    var status = detailBoxData.Status
    var statusClass;
      status === '良好'? statusClass = 'good' : status === '普通'? statusClass = 'moderate':
      status === '對敏感族群不健康'? statusClass = 'unhealthyForSensitiveGroups' : status === '對所有族群不健康'? statusClass = 'unhealthy':
      status === '非常不健康'?  status === 'veryUnhealthy' : status === '危害'?  statusClass = 'hazardous': '';
    var zoonObj = document.createElement('li')
    zoonObj.classList.add('zoon')
    zoonObj.innerHTML = '<div class="zoonName">'+detailBoxData.SiteName+'</div><div class="zoonAQI '+ statusClass +'">'+detailBoxData.AQI+'</div>'
    detailType.innerHTML = ''

    for(var p = 0, pl = pollution.length; p < pl; p++){
      var pObj = pollution[p]
      var liItem = document.createElement('li')
      liItem.classList.add('pollution')
      liItem.innerHTML = '<div class="title"><span class="ch">'+pObj.name+'</span>'+
                         '<span class="en">'+pObj.chemical+'</span>'+
                         '<span class="unit">('+pObj.unit+')</span></div>'+
                         '<div class="value">'+detailBoxData[pObj.key]+'</div>'
      ulObj.appendChild(liItem)
    }
    ulObj.classList.add('pollutions')
    detailType.appendChild(zoonObj)
    detailType.appendChild(ulObj)
  }
  

  function countySelector(opt){
    countyBtn.querySelector('.text').innerText = opt;
    nowCounty.innerText = opt;
    wirteAQIData(airData, opt)
  }
  
  function creatSelector(obj){
    for(var s = 0, sl = obj.length; s<sl; s++){
      var nowObj = obj[s]
      if(county.indexOf(nowObj.County) === -1){county.push(nowObj.County)}
    }
    for(var c = 0, cl = county.length; c < cl; c++){
      var obj = county[c];
      
      var countyOption = document.createElement('li');
      countyOption.classList.add('option')
      countyOption.innerText = obj;
      countyOption.dataset.zoon = obj;
      countyOption.addEventListener('click',function(){
        countySelector(this.dataset.zoon)
      })
      countySelect.appendChild(countyOption)
    }
  }

  function writeRange(xhrRes){
    var res = JSON.parse(xhrRes);
    var airRangeBox = document.querySelector('.airRangeBox');
    function tamplate(obj){
      return '<li><div class="airRangeNum '+ obj.status +'">'+
              obj.rangeMin +'~'+ obj.rangeMax
              +'</div><div class="airRangeText">'+ obj.text +'</div></li>'
    }
    for(var i = 0 , il = res.length; i<il; i++){
      var obj = res[i];
      airRangeBox.innerHTML += tamplate(obj);
    }
  }

  function loadAQIData(xhrRes){
    airData = JSON.parse(xhrRes);
    wirteAQIData(airData);
    creatSelector(airData);
  }
  
  function wirteAQIData(res,zoon){
    zoon = zoon || defaultZoon
    showData = [];
    function tamplate(index,obj,status){
      var zoonObj = document.createElement('li')
      zoonObj.classList.add('zoon')
      zoonObj.dataset.index = index
      zoonObj.innerHTML = '<div class="zoonName">'+obj.SiteName+'</div><div class="zoonAQI '+status+'">'+obj.AQI+'</div>'
      return zoonObj.outerHTML
    };
    for(var j = 0, jl = res.length; j<jl; j++){
      var obj = res[j];
      // 篩選 county 資料
      if(obj.County === zoon){ showData.push(obj) };
    }
    allZoonBox[1].innerHTML = ''
    for(var k = 0, kl = showData.length; k < kl; k++){
      var obj = showData[k];
      var status = obj.Status;
      var statusClass;
      status === '良好'? statusClass = 'good' : status === '普通'? statusClass = 'moderate':
      status === '對敏感族群不健康'? statusClass = 'unhealthyForSensitiveGroups' : status === '對所有族群不健康'? statusClass = 'unhealthy':
      status === '非常不健康'?  status === 'veryUnhealthy' : status === '危害'?  statusClass = 'hazardous': '';

      allZoonBox[1].innerHTML += tamplate(k,obj,statusClass);
    }
    zoonClickHandler()

    var allZoon = Array.apply(null,allZoonBox[1].querySelectorAll('li.zoon'))

    for(var z = 0, zl = allZoon.length; z < zl; z++){
      var zObj = allZoon[z]
      zObj.addEventListener('click', function(){
        zoonClickHandler(this)
      })
    }
  }
  xhrAirRange.open('get', rangeApi, true)
  xhrAirRange.onload = function(){
    if(xhrAirRange.status >= 200 && xhrAirRange.status < 400){writeRange(xhrAirRange.responseText)}
    else{console.log('xhrAirRange err')}
  }
  xhrAirRange.send()

  xhrAirApi.open('get', airApi, true)
  xhrAirApi.onload = function(){
    if(xhrAirApi.status >= 200 && xhrAirApi.status < 400){
      loadPollution(loadAQIData,xhrAirApi)
      // loadAQIData(xhrAirApi.responseText)
    }
    else{console.log('xhrAirApi err')}
  }
  xhrAirApi.send()

  countyBtn.addEventListener('click',function(){
    countySelect.classList.toggle('hide')
  })
  console.timeEnd()
})()
