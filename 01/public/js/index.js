(function(){
  'use strict';
  var item = Array.apply(null,document.getElementsByClassName('multiplyItem'));
  for(var i = 0, l = item.length; i < l; i++){
    var obj = item[i];
    var title = document.createElement('h2');
    var itemBox = document.createElement('div');
    var multiplicand = obj.dataset.num;
    var numStar = obj.dataset.star;
    var numEnd = obj.dataset.end;
    itemBox.classList.add('itemBox');
    title.innerText = multiplicand;
    itemBox.appendChild(title);
    for(;numStar <= numEnd; numStar++){
      var listItem = document.createElement('div');
      listItem.classList.add('listItem');
      listItem.innerText = multiplicand + '×' + numStar + '=' + multiplicand*numStar;
      itemBox.appendChild(listItem);
    }
    obj.appendChild(itemBox);
  };
})()