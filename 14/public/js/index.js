; (function () {
    console.time()
    var radios = Array.apply(null, document.querySelectorAll('.select__input'));
    var end = document.querySelector('.end')
    var cover = document.querySelector('.cover')
    var container1 = document.querySelector('.container__step1')
    var container2 = document.querySelector('.container__step2')
    var detail = container2.querySelector('.detail')
    var star = document.querySelector('button[name="star"]');
    var reset = document.querySelector('button[name="reset"]');
    var signArray = new Array;
    var sign;

    var cycle = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸']

    function ajaxHandler(type, url, callBack) {
        var xml = new XMLHttpRequest();
        xml.open(type, url, true);
        xml.onload = function () {
            if (xml.status >= 200 && xml.status < 400) {
                callBack(xml.responseText);
            }
            else { console.log('err'); };
        }
        xml.send();
    }

    function fadeOut(el, sec, callBack) {
        el.style.opacity = 1;
        sec = sec || 400
        var last = +new Date();
        var tick = function () {
            el.style.opacity = +el.style.opacity - (new Date() - last) / 400
            last = +new Date();
            if (+el.style.opacity > 0) {
                (window.requestAnimationFrame && requestAnimationFrame(tick)) || setTimeout(tick, 16);
            }
            else {
                el.style.opacity = 0
                el.style.display = 'none'
                callBack  && callBack.call(el)
            }
        };
        tick();
    }

    function fadeIn(el, sec, callBack) {
        el.style.opacity = 0;
        el.style.display = '';
        sec = sec || 400
        var last = +new Date();
        var tick = function () {
            el.style.opacity = +el.style.opacity + (new Date() - last) / 400;
            last = +new Date();
            if (+el.style.opacity < 1) {
                (window.requestAnimationFrame && requestAnimationFrame(tick)) || setTimeout(tick, 16);
            }
            else {
                el.style.opacity = 1
                callBack && callBack.call(el)
            }
        };
        tick();
    }

    function showSignHandler(data) {

        function hiddenHandler() {

            fadeOut(container1, 400, function () {
                this.classList.remove('active')
                container2.classList.add('active')
                fadeIn(container2, 400, function () {
                    var sign = this.querySelector('.sign')
                    var index = sign.querySelector('.sign__index')
                    var type = sign.querySelector('.sign__type')
                    var chineseIndex = sign.querySelector('.sign__chineseIndex')

                    function idCh(n) {
                        var text0, text1, index0, index1
                        index0 = Math.floor(n / cycle.length)
                        index1 = (n % cycle.length) - 1
                        index1 = index1 === -1 ? cycle.length-1 : index1
                        text0 = cycle[index0]
                        text1 = cycle[index1]  
                        return text0+text1
                    }

                    function showDetailHandler(el) {
                        
                        var header = detail.querySelector('.detail__header')
                        var content = detail.querySelector('.detail__content')
                        var explanation = detail.querySelector('.detail__explanation')
                        var description = detail.querySelector('.detail__description')
                        var explanationText = explanation.querySelector('.detail__text')
                        var descriptionText = description.querySelector('.detail__text')


                        var contentHTML = data.content.original.split(' ').join('<br>')
                        fadeOut(el, 500, function () {
                            header.innerText = '第' + data.id + '籤' + '【' + idCh(data.id) + '】' + data.type
                            content.innerHTML = contentHTML
                            explanationText.innerHTML = (function (t) {
                                var tHTML = ''
                                var tArray = t.split('　')
                                var tl = tArray.length
                                tArray.forEach(function (tt, i) {
                                    tHTML += (Math.floor(tl / 2) - 1 === i) ? tt + '<br>' : tt + '　'
                                })
                                return tHTML
                            })(data.content.explanation)
                            descriptionText.innerText = data.content.description
                            reset.addEventListener('click', resetHandler)

                            fadeIn(detail, 500, function () { this.style.display = 'flex' })
                        })
                        
                    }

                    
                    type.innerText = data.type
                    index.innerText = '第' + data.id + '籤'
                    chineseIndex.innerText = '【'+ idCh(data.id) +'】'
                    fadeIn(sign, 500, function () {
                        setTimeout(showDetailHandler, 2000, this)
                    })

                })

            })
            cover.removeEventListener('transitionend', hiddenHandler)
 
        }

        end.classList.add('end--close')
        cover.classList.add('cover--active')

        cover.addEventListener('transitionend', hiddenHandler)
    }

    function resetHandler() {
        fadeOut(detail, 500, function () {
            fadeIn(container1, 500, function () {
                end.classList.remove('end--close')
                cover.classList.remove('cover--active')
                container2.classList.remove('active')
                container1.classList.add('active')
            })
        })
        this.removeEventListener('click', resetHandler)
    }

    star.addEventListener('click', function () {
        var radioType = [];
        var able = false;
        radios.forEach(function (obj) { radioType.push(obj.checked) });
        able = radioType.some(function (obj) { return obj === true });
        
        if (able) { 
            ajaxHandler('GET', 'databace/sign.json', function (res) {
                var length, id;
                signArray = JSON.parse(res);
                length = signArray.length;
                id = Math.round(Math.random() * 39);
                sign = signArray[id];
                showSignHandler(sign)
            })
        }
    })
    console.timeEnd()
})()
