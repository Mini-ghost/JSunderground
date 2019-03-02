;(function(){
  console.time()
  'use strict';

  function ajaxHandler(ajax,callBack){
    var xml = new XMLHttpRequest()
    xml.open('GET', ajax.url, true)
    xml.onload = function(){
      if(xml.status >= 200 && xml.status < 400){
        ajax.res = xml.responseText
        callBack()
      }
      else{console.log('err')}
    }
    xml.send()
  }

  function opeRandom(){
    return ope[parseInt(Math.random()*4)]
  }

  function numRandom(n){
    minNum = Math.pow(10, n-1 || 0)
    var num;
    do { num = parseInt(Math.random()*minNum*10) }
    while(num === 0 || num <= minNum)
    return num
  }

  function  starBtnHandler(e){
    if(starDOM.classList.contains('hidden') && e.propertyName === 'opacity'){
      starDOM.classList.add('none')
      starDOM.classList.remove('hidden')
      ajaxHandler(playPage, function(){
        playingDOM = document.createElement('section')
        playingDOM.setAttribute('id', 'playing')
        playingDOM.innerHTML = playPage.res
        document.body.appendChild(playingDOM)
        playHandler(playingDOM)
      })
    }
  }

  function playHandler(el){

    var countdown = el.querySelector('.countdown');
    var num1 = el.querySelector('.num1');
    var num2 = el.querySelector('.num2');
    var ope = el.querySelector('.ope');
    var score = el.querySelector('.scoreNum');
    var ansInput = el.querySelector('input[type="text"]')
    var n1, n2, ans, countSec = s, n=1, level;

    function newQuestion(n){
      num1.innerText = n1 = numRandom(n)
      num2.innerText = n2 = numRandom(n)
      ope.innerText = opeRandom()

      level = n;
  
      switch(ope.innerText.trim()){
        case '+':
          ans = n1 + n2
          break;
        case '-':
          ans = n1 - n2
          break;
        case '×':
          ans = n1 * n2
          break;
        case '÷':
          while (parseFloat((n1/n2).toFixed(3)) !== n1/n2) {
            num1.innerText = n1 = numRandom(level)
            num2.innerText = n2 = numRandom(level)
          }
          ans = n1 / n2
          break;
      }
    }

    function newTime(){

      var min = parseInt(countSec / 60);
      var sec = countSec - 60*min;
      min = (min < 10)? '0' + min : min;
      sec = (sec < 10)? '0' + sec : sec;
      countdown.innerText = min + ':' + sec;
  
      n = (countSec < 20)? 3 : (countSec < 40)? 2 : 1; 
      countSec !== 0 && countSec-- && setTimeout(newTime,1000) || endHandler(el,scoreNum) ;
    }

    newQuestion(n)
    newTime()

    score.innerText = '000'
    scoreNum = 0

    ansInput.addEventListener('keyup', function(e){
      var ansNum = this.value = this.value.trim()
      if(e.keyCode === 13 && ansNum.length !==  0){
        ansNum = parseFloat(ansNum)
        if(ansNum === ans){
          scoreNum = (level === 1)? scoreNum + 1 : scoreNum + 5
          score.innerText = (scoreNum < 10)? '00'+scoreNum : (scoreNum < 100)? '0'+ scoreNum : scoreNum
          this.value = ''
          newQuestion(n)
        }
        else{
          scoreNum = (scoreNum === 0)? scoreNum : scoreNum - 1
          score.innerText = (scoreNum < 10)? '00'+scoreNum : (scoreNum < 100)? '0'+ scoreNum : scoreNum
          this.value = ''
          newQuestion(n)
        }
      }
    })

  }

  function endHandler(el,scoreNum){
    ajaxHandler(endPage, function(){

      function runScore(){
        endScore.innerText = starNum;
        (starNum !== scoreNum)? setTimeout(runScore,(scoreNum!==0)? 1000/scoreNum : 0) : againBtn.classList.remove('hidden') ;
        starNum++;
      }

      endDOM = document.createElement('section')
      endDOM.setAttribute('id', 'end')
      endDOM.innerHTML = endPage.res

      var endScore = endDOM.querySelector('.scoreNum')
      var againBtn = endDOM.querySelector('button[name="again"]')
      var starNum = 0

      el.parentNode.removeChild(el)
      againBtn.classList.add('hidden')
      document.body.appendChild(endDOM)

      runScore()

      againBtn.addEventListener('click', function(){
        scoreNum = 0
        endDOM.classList.add('hidden')
      })
      endDOM.addEventListener('transitionend', function(e){
        if(endDOM.classList.contains('hidden') && e.propertyName === 'opacity'){
          endDOM.parentNode.removeChild(endDOM)
          var playing = document.createElement('section')
          playing.setAttribute('id', 'playing')
          playing.innerHTML = playPage.res
          document.body.appendChild(playing)
          playHandler(playing)
        }
      })

    })
  }


  var playPage = {
    url: 'database/playing.html',
    res: ''
  }

  var endPage = {
    url: 'database/end.html',
    res: ''
  }

  // init
  var playingDOM, endDOM
  var starDOM = document.getElementById('star');
  var starBtn = star.querySelector('button[name="start"]');
  var ope = ['+','-','×','÷']
  var scoreNum = 0
  var s = 60;

  // event
  starBtn.addEventListener('click', function(){star.classList.add('hidden')})
  starDOM.addEventListener('transitionend', starBtnHandler)

  console.timeEnd()
})()
