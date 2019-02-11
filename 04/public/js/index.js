;(function(){
  console.time()
  'use strict';
  var year, month, date, hour, min
  var countryList = [
    {name: 'NEW YORK', zone: 'America/New_York'},
    {name: 'LONDON', zone: 'Europe/London'},
    {name: 'BANGKOK', zone: 'Asia/Bangkok'},
    {name: 'TAIWAN', zone: 'Asia/Taipei'},
    {name: 'SYDNEY', zone: 'Australia/Sydney'},
  ];
  var monthkText = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

  var timeBox = document.querySelector('.timeBox');

  function resetTime(obj,i){
    var dateText = new Date().toLocaleString('en-US', {timeZone: countryList[i].zone});
        dateText = new Date(dateText);
    year = dateText.getFullYear() ;
    month = monthkText[dateText.getMonth()];
    date = dateText.getDate();
    hour = dateText.getHours();
    min = dateText.getMinutes();
    (hour < 10)? hour = '0' + hour : '';
    (min < 10)? min = '0' + min : '';

    var thisName = obj.querySelector('.countryName')
    var thisDate = obj.querySelector('.countryDate')
    var thisTime = obj.querySelector('.countryTime')

    Number(hour) > 17 || Number(hour) < 6 ? obj.classList.add('pm') : obj.classList.add('am')
    thisName.innerText = countryList[i].name;
    thisDate.innerText = date + ' ' + month + ' ' + year;
    thisTime.innerText = hour + ':' + min;
  }
  function writeData(){
    
    for(var i = 0, 
      l = countryList.length,
      obj = document.getElementsByClassName('countryBox'); i<l; i++){
        resetTime(obj[i],i);
    };

    setTimeout(writeData, 1000)
  }

  for(var i = 0, l = countryList.length; i<l; i++){
    var countryBox = document.createElement('div');
    var countryName = document.createElement('div');
    var countryDate = document.createElement('div');
    var countryTime = document.createElement('div');
    var leftBox = document.createElement('div');
    countryBox.classList.add('countryBox');
    countryName.classList.add('countryName');
    countryDate.classList.add('countryDate');
    countryTime.classList.add('countryTime');
    leftBox.classList.add('leftBox');
    leftBox.appendChild(countryName);
    leftBox.appendChild(countryDate);
    countryBox.appendChild(leftBox);
    countryBox.appendChild(countryTime);
    timeBox.appendChild(countryBox);
  };

  writeData();
  console.timeEnd()
})()