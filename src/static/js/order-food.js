/**
 * Created by Administrator on 2017/11/26.
 */
console.log('localstorage is:');
console.log(localStorage.getItem('token'));
// mui.get('/classify/index',function(data){
//         assemble(data.classifyList)
//     },'json'
// );
mui.ajax('/classify/index',{
    dataType:'json',//服务器返回json格式数据
    type:'post',//HTTP请求类型
    timeout:10000,//超时时间设置为10秒；
    headers: {Authorization: 'Bearer ' + localStorage.getItem('token')},
    success:function(data){
        assemble(data.classifyList)
    },
    error:function(xhr,type,errorThrown){
        console.log(type);
    }
});
function assemble(classifys) {
    var controls = document.getElementById("segmentedControls");
    var contents = document.getElementById("segmentedControlContents");
    var minimumPrice = 1
    var html = [];
    var i = 1,
        // j = 1,
        m = classifys.length, //左侧选项卡数量+1
        n = 21; //每个选项卡列表数量+1

    for(var cIdx=0;cIdx<classifys.length;cIdx++) {
        html.push('<a class="mui-control-item" data-index="' + (cIdx) + '" href="#content' + cIdx + '">' + classifys[cIdx].name + '</a>');
    }
    // for (; i < m; i++) {
    //     html.push('<a class="mui-control-item" data-index="' + (i - 1) + '" href="#content' + i + '">选项' + i + '</a>');
    // }
    controls.innerHTML = html.join('');

    // 内容填充
    html = [];
    for (var cIdx=0;cIdx<classifys.length;cIdx++) {
        var classify = classifys[cIdx]
        html.push('<div id="content' + cIdx + '" class="mui-control-content">' +
            '<h3>'+classify.name+'</h3>'+
            '<ul class="mui-table-view">');
        var products = classify.product
        if(products.length) {
            for (var j = 0; j < products.length; j++) {
                html.push('<li class="mui-table-view-cell">' +
                    '<div class="opt-box" data-id="'+ products[j].id +'" data-price="'+ products[j].price +'">' +
                        '<div class="mui-btn mui-btn-primary opt-btn minus">-</div>' +
                        '<span class="num-show">0</span>' +
                        '<div class="mui-btn mui-btn-primary opt-btn add">+</div>' +
                    '</div>' +
                    products[j].name +
                    '<div class="price">  ￥'+ products[j].price + '</div>'+
                    '</li>');
            }
        }else{
            html.push('<li class="mui-table-view-cell">没有数据</li>');
        }
        html.push('</ul></div>');
    }
    contents.innerHTML = html.join('');
//默认选中第一个
    controls.querySelector('.mui-control-item').classList.add('mui-active');
    // 事件操作
    (function () {
        var orderFoods = []
        calcPrice()
        mui('#cartBox').on('tap', '#submitBtn', function () {
            console.log(orderFoods);

        })
        mui('.opt-box').on('tap', '.opt-btn.add', function () {
            var numShow = this.previousSibling
            var minusBtn = numShow.previousSibling
            numShow.className = numShow.className + ' active'
            minusBtn.className = minusBtn.className + ' active'
            numShow.innerText = parseInt(numShow.innerText) + 1
            calcPrice()
        })
        mui('.opt-box').on('tap', '.opt-btn.minus', function () {
            var numShow = this.nextSibling
            console.log(numShow.innerText=='1');
            var numVal = numShow.innerText
            if(numVal>0) {
                numShow.innerText = numVal - 1
                if(numShow.innerText==0) {
                    numShow.className = 'num-show'
                    this.className = this.className.substr(0, this.className.indexOf(' active'))
                }
            }
            calcPrice()
        })
        function calcPrice() {
            orderFoods = []
            var optBoxTags = document.getElementsByClassName('opt-box')
            var totalPrice = 0, nums = 0
            for(var i=0;i<optBoxTags.length;i++) {
                var children = optBoxTags[i].childNodes
                var dataPrice = optBoxTags[i].getAttribute('data-price')
                var dataId = optBoxTags[i].getAttribute('data-id')
                for(var j=0;j<children.length;j++) {
                    if((children[j].className.indexOf('num-show')!=-1)&&(children[j].className.indexOf('active')!=-1)){
                        // console.log('price is:'+dataPrice);
                        var times = parseInt(children[j].innerText)
                        nums += times
                        totalPrice += dataPrice*times
                        orderFoods.push({pid: dataId, price: dataPrice, nums: times})
                    }
                }
            }
            var howMany = document.getElementById('howMany')
            document.getElementById('totalPrice').innerText = totalPrice
            var submitBtn = document.getElementById('submitBtn')

            howMany.innerText = nums
            howMany.className = howMany.className + ' active'
            setTimeout(function () {
                howMany.className = ''
            },200)
            if(totalPrice>=minimumPrice) {
                submitBtn.disabled = false
                submitBtn.innerText = '选好了'
            }else{
                submitBtn.disabled = true
                // submitBtn.innerText = '￥'+minimumPrice+'起送'
                submitBtn.innerText = '请选菜'
            }
        }
    })();
//			contents.querySelector('.mui-control-content').classList.add('mui-active');
    (function() {
        var controlsElem = document.getElementById("segmentedControls");
        var contentsElem = document.getElementById("segmentedControlContents");
        var controlListElem = controlsElem.querySelectorAll('.mui-control-item');
        var contentListElem = contentsElem.querySelectorAll('.mui-control-content');
        var controlWrapperElem = controlsElem.parentNode;
        var controlWrapperHeight = controlWrapperElem.offsetHeight;
        var controlMaxScroll = controlWrapperElem.scrollHeight - controlWrapperHeight;//左侧类别最大可滚动高度
        var maxScroll = contentsElem.scrollHeight - contentsElem.offsetHeight;//右侧内容最大可滚动高度
        var controlHeight = controlListElem[0].offsetHeight;//左侧类别每一项的高度
        var controlTops = []; //存储control的scrollTop值
        var contentTops = [0]; //存储content的scrollTop值
        var length = contentListElem.length;
        for (var i = 0; i < length; i++) {
            controlTops.push(controlListElem[i].offsetTop + controlHeight);
        }
        for (var i = 1; i < length; i++) {
            var offsetTop = contentListElem[i].offsetTop;
            if (offsetTop + 100 >= maxScroll) {
                var height = Math.max(offsetTop + 100 - maxScroll, 100);
                var totalHeight = 0;
                var heights = [];
                for (var j = i; j < length; j++) {
                    var offsetHeight = contentListElem[j].offsetHeight;
                    totalHeight += offsetHeight;
                    heights.push(totalHeight);
                }
                for (var m = 0, len = heights.length; m < len; m++) {
                    contentTops.push(parseInt(maxScroll - (height - heights[m] / totalHeight * height)));
                }
                break;
            } else {
                contentTops.push(parseInt(offsetTop));
            }
        }
        contentsElem.addEventListener('scroll', function() {
            var scrollTop = contentsElem.scrollTop;
            for (var i = 0; i < length; i++) {
                var offsetTop = contentTops[i];
                var offset = Math.abs(offsetTop - scrollTop);
//						console.log("i:"+i+",scrollTop:"+scrollTop+",offsetTop:"+offsetTop+",offset:"+offset);
                if (scrollTop < offsetTop) {
                    if (scrollTop >= maxScroll) {
                        onScroll(length - 1);
                    } else {
                        onScroll(i - 1);
                    }
                    break;
                } else if (offset < 20) {
                    onScroll(i);
                    break;
                }else if(scrollTop >= maxScroll){
                    onScroll(length - 1);
                    break;
                }
            }
        });
        var lastIndex = 0;
        //监听content滚动
        var onScroll = function(index) {
            if (lastIndex !== index) {
                lastIndex = index;
                var lastActiveElem = controlsElem.querySelector('.mui-active');
                lastActiveElem && (lastActiveElem.classList.remove('mui-active'));
                var currentElem = controlsElem.querySelector('.mui-control-item:nth-child(' + (index + 1) + ')');
                currentElem.classList.add('mui-active');
                //简单处理左侧分类滚动，要么滚动到底，要么滚动到顶
                var controlScrollTop = controlWrapperElem.scrollTop;
                if (controlScrollTop + controlWrapperHeight < controlTops[index]) {
                    controlWrapperElem.scrollTop = controlMaxScroll;
                } else if (controlScrollTop > controlTops[index] - controlHeight) {
                    controlWrapperElem.scrollTop = 0;
                }
            }
        };
        //滚动到指定content
        var scrollTo = function(index) {
            contentsElem.scrollTop = contentTops[index];
        };
        mui(controlsElem).on('tap', '.mui-control-item', function(e) {
            scrollTo(this.getAttribute('data-index'));
            return false;
        });
    })();
}
