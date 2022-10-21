var CURSOR;

Math.lerp = (a, b, n) => (1 - n) * a + n * b;

const getStyle = (el, attr) => {
    try {
        return window.getComputedStyle
            ? window.getComputedStyle(el)[attr]
            : el.currentStyle[attr];
    } catch (e) {}
    return "";
};

class Cursor {
    constructor() {
        this.pos = {curr: null, prev: null};
        this.pt = [];
        this.create();
        this.init();
        this.render();
    }

    move(left, top) {
        this.cursor.style["left"] = `${left}px`;
        this.cursor.style["top"] = `${top}px`;
    }

    create() {
        if (!this.cursor) {
            this.cursor = document.createElement("div");
            this.cursor.id = "cursor";
            this.cursor.classList.add("hidden");
            document.body.append(this.cursor);
        }

        var el = document.getElementsByTagName('*');
        for (let i = 0; i < el.length; i++)
            if (getStyle(el[i], "cursor") == "pointer")
                this.pt.push(el[i].outerHTML);

        document.body.appendChild((this.scr = document.createElement("style")));
        this.scr.innerHTML = `* {cursor: url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 8' width='8px' height='8px'><circle cx='4' cy='4' r='4' opacity='.5'/></svg>") 4 4, auto}`;
    }

    refresh() {
        this.scr.remove();
        this.cursor.classList.remove("hover");
        this.cursor.classList.remove("active");
        this.pos = {curr: null, prev: null};
        this.pt = [];

        this.create();
        this.init();
        this.render();
    }

    init() {
        document.onmouseover  = e => this.pt.includes(e.target.outerHTML) && this.cursor.classList.add("hover");
        document.onmouseout   = e => this.pt.includes(e.target.outerHTML) && this.cursor.classList.remove("hover");
        document.onmousemove  = e => {(this.pos.curr == null) && this.move(e.clientX - 8, e.clientY - 8); this.pos.curr = {x: e.clientX - 8, y: e.clientY - 8}; this.cursor.classList.remove("hidden");};
        document.onmouseenter = e => this.cursor.classList.remove("hidden");
        document.onmouseleave = e => this.cursor.classList.add("hidden");
        document.onmousedown  = e => this.cursor.classList.add("active");
        document.onmouseup    = e => this.cursor.classList.remove("active");
    }

    render() {
        if (this.pos.prev) {
            this.pos.prev.x = Math.lerp(this.pos.prev.x, this.pos.curr.x, 0.15);
            this.pos.prev.y = Math.lerp(this.pos.prev.y, this.pos.curr.y, 0.15);
            this.move(this.pos.prev.x, this.pos.prev.y);
        } else {
            this.pos.prev = this.pos.curr;
        }
        requestAnimationFrame(() => this.render());
    }
}

(() => {
    CURSOR = new Cursor();
    // 需要重新获取列表时，使用 CURSOR.refresh()
})();




// 切换背景图片

// 存数据
// name：命名 data：数据
function saveData(name, data) {
    localStorage.setItem(name, JSON.stringify({ 'time': Date.now(), 'data': data }))
}

// 取数据
// name：命名 time：过期时长,单位分钟,如传入30,即加载数据时如果超出30分钟返回0,否则返回数据
function loadData(name, time) {
    let d = JSON.parse(localStorage.getItem(name));
    // 过期或有错误返回 0 否则返回数据
    if (d) {
        let t = Date.now() - d.time
        if (t < (time * 60 * 1000) && t > -1) return d.data;
    }
    return 0;
}

// 上面两个函数如果你有其他需要存取数据的功能，也可以直接使用

// 读取背景
try {
    let data = loadData('blogbg', 1440)
    if (data) changeBg(data, 1)
    else localStorage.removeItem('blogbg');
} catch (error) { localStorage.removeItem('blogbg'); }

// 切换背景函数
// 此处的flag是为了每次读取时都重新存储一次,导致过期时间不稳定
// 如果flag为0则存储,即设置背景. 为1则不存储,即每次加载自动读取背景.
function changeBg(s, flag) {
    let bg = document.getElementById('web_bg')
    let indexbg = document.getElementById('page-header')
    if (s.charAt(0) == '#') {
        bg.style.backgroundColor = s
        indexbg.style.backgroundColor = s
        bg.style.backgroundImage = 'none'
        indexbg.style.backgroundImage = 'none'

    } else{
        indexbg.style.backgroundImage = s
        bg.style.backgroundImage = s   
    } 
    if (!flag) { saveData('blogbg', s) }
}


function whenDOMReady() {
    // 背景localstorage
    try {
        let data = loadData('blogbg', 1440)
        if (data) changeBg(data, 1)
        else localStorage.removeItem('blogbg');
    } catch (error) { localStorage.removeItem('blogbg'); }
}
whenDOMReady()
document.addEventListener("pjax:success", whenDOMReady)



// 以下为2.0新增内容

// 创建窗口
var winbox = ''

function createWinbox() {
    let div = document.createElement('div')
    document.body.appendChild(div)
    winbox = WinBox({
        id: 'changeBgBox',
        index: 999,
        title: "一些设置",
        x: "center",
        y: "center",
        minwidth: '300px',
        height: "60%",
        background: 'var(--leonus-blue)',
        onmaximize: () => { div.innerHTML = `<style>body::-webkit-scrollbar {display: none;}div#changeBgBox {width: 100% !important;}</style>` },
        onrestore: () => { div.innerHTML = '' }
    });
    winResize();
    window.addEventListener('resize', winResize)

    winbox.body.innerHTML = `
    
    <div id="article-container" style="padding:15px;">
    \n<br>\n<center><p><button onclick="reset()" style="background:linear-gradient(to right, #114357, #f29492);display:block;width:40%;padding: 15px 0;border-radius:6px;color:white;"><i class="fa-solid fa-arrows-rotate"></i>点这里恢复默认设置</button></p></center>\n\n
    <h2>一、字体设置</h2>\n
    <div class="note warning simple"><p>注意：非商免字体未经授权只能个人使用。本站为完全非商业、非盈利性质的网站，平时用于个人学习交流，站长不会由此获利一分钱，如涉及侵权请联系站长删除，谢谢！ —— 致版权方</p>
    \n</div>\n<p id="swfs">\n<a class="swf" href="javascript:;" rel="noopener external nofollow" 
    style="font-family:\'ZhuZiAWan\'!important;color:black" 
    onclick="setFont(\'ZhuZiAWan_light\')">筑紫A丸ゴシック</a>
    \n<a class="swf" href="javascript:;" rel="noopener external nofollow" 
    style="font-family:\'HYTMR\'!important;color:black" 
    onclick="setFont(\'HYTMR\')">汉仪唐美人</a>\n<a class="swf" 
    href="javascript:;" rel="noopener external nofollow" 
    style="font-family:\'LXGW\'!important;color:black" 
    onclick="setFont(\'LXGW\')">霞鹜文楷</a>\n<a class="swf" 
    href="javascript:;" rel="noopener external nofollow" 
    style="font-family:\'TTQHB\'!important;color:black" 
    onclick="setFont(\'TTQHB\')">甜甜圈海报</a>\n<a class="swf" 
    href="javascript:;" rel="noopener external nofollow" 
    style="font-family:\'YSHST\'!important;color:black" 
    onclick="setFont(\'YSHST\')">优设好身体</a>\n<a class="swf" 
    href="javascript:;" rel="noopener external nofollow" 
    style="font-family:\'MiSans\'!important;color:black" 
    onclick="setFont(\'MiSans\')">MiSans</a>\n<a class="swf" 
    href="javascript:;" rel="noopener external nofollow" 
    style="font-family:-apple-system, IBM Plex Mono ,monosapce,\'微软雅黑\', 
    sans-serif;!important;color:black" onclick="setFont(\'main\')">系统默认</a>\n</p>


    <h2>二、背景设置</h2>\n
<div class="note info flat"><p>点击对应图片就可实现背景切换，自定义背景会保留一天，一天后自动恢复为默认背景！</p>
</div>

<center><p><button onclick="localStorage.removeItem('blogbg');location.reload();"
 style="background:linear-gradient(to left, skyblue,orange);
 display:block;width:60%;padding: 15px 0;border-radius:6px;color:white;">
 <i class="fa-solid fa-arrows-rotate"></i>
 点我恢复默认背景</button>
 </p>
 </center>
<h2>二次元</h2>
<details class="folding-tag" blue="" open=""><summary> 查看二次元背景 </summary>
              <div class="content">

              <div class="bgbox">

              <a href="javascript:;" rel="noopener external nofollow" 
               style="background-image:url(https://gitee.com/lin-xugeng/md-img/raw/master/img/dm6.webp)"
                class="imgbox" onclick="changeBg('url(https://gitee.com/lin-xugeng/md-img/raw/master/img/dm6.webp)')">
                </a>

                <a href="javascript:;" rel="noopener external nofollow" 
                style="background-image:url(https://gitee.com/lin-xugeng/md-img/raw/master/img/dm7.webp)"
                 class="imgbox" onclick="changeBg('url(https://gitee.com/lin-xugeng/md-img/raw/master/img/dm7.webp)')">
                 </a>

                 <a href="javascript:;" rel="noopener external nofollow"
                  style="background-image:url(https://gitee.com/lin-xugeng/md-img/raw/master/img/dm11.webp)"
                   class="imgbox" onclick="changeBg('url(https://gitee.com/lin-xugeng/md-img/raw/master/img/dm11.webp)')">
                   </a>

                   <a href="javascript:;" rel="noopener external nofollow" 
                   style="background-image:url(https://gitee.com/lin-xugeng/md-img/raw/master/img/dm12.webp)"
                    class="imgbox" onclick="changeBg('url(https://gitee.com/lin-xugeng/md-img/raw/master/img/dm12.webp)')">
                    </a>
                    
                    <a href="javascript:;" rel="noopener external nofollow"
                     style="background-image:url(https://gitee.com/lin-xugeng/md-img/raw/master/img/dm2.webp)" 
                     class="imgbox" onclick="changeBg('url(https://gitee.com/lin-xugeng/md-img/raw/master/img/dm2.webp)')">
                     </a>
                     
                     <a href="javascript:;" rel="noopener external nofollow" 
                     style="background-image:url(https://gitee.com/lin-xugeng/md-img/raw/master/img/dm3.webp)" 
                     class="imgbox" onclick="changeBg('url(https://gitee.com/lin-xugeng/md-img/raw/master/img/dm3.webp)')">
                     </a>
                     
                     <a href="javascript:;" rel="noopener external nofollow" 
                     style="background-image:url(https://gitee.com/lin-xugeng/md-img/raw/master/img/dm4.webp)" 
                     class="imgbox" onclick="changeBg('url(https://gitee.com/lin-xugeng/md-img/raw/master/img/dm4.webp)')">
                     </a>

                     <a href="javascript:;" rel="noopener external nofollow"
                      style="background-image:url(https://gitee.com/lin-xugeng/md-img/raw/master/img/dm5.webp)"
                       class="imgbox" onclick="changeBg('url(https://gitee.com/lin-xugeng/md-img/raw/master/img/dm5.webp)')">
                       </a>

                    </div>

              </div>
            </details>


<h2>风景</h2>

<details class="folding-tag" blue=""><summary> 查看风景背景 </summary>
              <div class="content">
              <div class="bgbox">

              <a href="javascript:;" rel="noopener external nofollow" 
              style="background-image:url(https://source.fomal.cc/img/fj1.webp)" 
              class="imgbox" onclick="changeBg('url(https://source.fomal.cc/img/fj1.webp)')"></a>
              
              <a href="javascript:;" rel="noopener external nofollow" 
              style="background-image:url(https://source.fomal.cc/img/fj2.webp)" 
              class="imgbox" onclick="changeBg('url(https://source.fomal.cc/img/fj2.webp)')">
              </a>
              
              <a href="javascript:;" rel="noopener external nofollow"
               style="background-image:url(https://source.fomal.cc/img/fj3.webp)"
                class="imgbox" onclick="changeBg('url(https://source.fomal.cc/img/fj3.webp)')"></a>
                
                <a href="javascript:;" rel="noopener external nofollow" 
                style="background-image:url(https://source.fomal.cc/img/fj4.webp)" 
                class="imgbox" onclick="changeBg('url(https://source.fomal.cc/img/fj4.webp)')"></a>
                
                <a href="javascript:;" rel="noopener external nofollow" 
                style="background-image:url(https://source.fomal.cc/img/fj5.webp)" 
                class="imgbox" onclick="changeBg('url(https://source.fomal.cc/img/fj5.webp)')"></a>
                
                <a href="javascript:;" rel="noopener external nofollow" 
                style="background-image:url(https://source.fomal.cc/img/fj6.webp)" 
                class="imgbox" onclick="changeBg('url(https://source.fomal.cc/img/fj6.webp)')"></a>
                
                <a href="javascript:;" rel="noopener external nofollow" 
                style="background-image:url(https://source.fomal.cc/img/fj7.webp)" 
                class="imgbox" onclick="changeBg('url(https://source.fomal.cc/img/fj7.webp)')"></a>
                
                <a href="javascript:;" rel="noopener external nofollow" 
                style="background-image:url(https://source.fomal.cc/img/fj8.webp)" 
                class="imgbox" onclick="changeBg('url(https://source.fomal.cc/img/fj8.webp)')"></a>
                
                </div>
              </div>
            </details>


<h2>渐变色</h2>
<details class="folding-tag" blue=""><summary> 查看渐变色背景 </summary>
              <div class="content">
              <div class="bgbox">
              
              <a href="javascript:;" rel="noopener external nofollow" 
              class="box" style="background: linear-gradient(to right, #544a7d, #ffd452)" 
              onclick="changeBg('linear-gradient(to right, #544a7d, #ffd452)')"></a>
              
              <a href="javascript:;" rel="noopener external nofollow" class="box" 
              style="background: linear-gradient(to bottom, #7f7fd5, #86a8e7, #91eae4)" 
              onclick="changeBg('linear-gradient(to bottom, #7f7fd5, #86a8e7, #91eae4)')"></a>
              
              <a href="javascript:;" rel="noopener external nofollow" class="box" 
              style="background: linear-gradient(to left, #654ea3, #eaafc8)" 
              onclick="changeBg('linear-gradient(to left, #654ea3, #eaafc8)')"></a>
              
              <a href="javascript:;" rel="noopener external nofollow" class="box" 
              style="background: linear-gradient(to top, #feac5e, #c779d0, #4bc0c8)" 
              onclick="changeBg('linear-gradient(to top, #feac5e, #c779d0, #4bc0c8)')"></a>
              
              <a href="javascript:;" rel="noopener external nofollow" class="box" 
              style="background: linear-gradient(to top, #d3959b, #bfe6ba)" 
              onclick="changeBg('linear-gradient(to top, #d3959b, #bfe6ba)')"></a>
              
              <a href="javascript:;" rel="noopener external nofollow" class="box" 
              style="background: linear-gradient(to top, #8360c3, #2ebf91)" 
              onclick="changeBg('linear-gradient(to top, #8360c3, #2ebf91)')"></a>
              
              <a href="javascript:;" rel="noopener external nofollow" 
              class="box" style="background: linear-gradient(to top, #108dc7, #ef8e38)" 
              onclick="changeBg('linear-gradient(to top, #108dc7, #ef8e38)')"></a>
              
              <a href="javascript:;" rel="noopener external nofollow" class="box" 
              style="background: linear-gradient(to top, #355c7d, #6c5b7b, #c06c84)" 
              onclick="changeBg('linear-gradient(to top, #355c7d, #6c5b7b, #c06c84)')"></a>
              
              </div>
              </div>
            </details>


<h2>纯色</h2>
<details class="folding-tag" blue=""><summary> 查看纯色背景 </summary>
              <div class="content">
              <div class="bgbox">
              
              <a href="javascript:;" rel="noopener external nofollow" 
              class="box" style="background: #7D9D9C" onclick="changeBg('#7D9D9C')"></a> 
              
              <a href="javascript:;" rel="noopener external nofollow" class="box" 
              style="background: #ecb1b1" onclick="changeBg('#ecb1b1')"></a> 
              
              <a href="javascript:;" rel="noopener external nofollow" class="box" 
              style="background: #d3ebac" onclick="changeBg('#d3ebac')"></a> 
              
              <a href="javascript:;" rel="noopener external nofollow" class="box" 
              style="background: #ace9ce" onclick="changeBg('#ace9ce')"></a>
              
              <a href="javascript:;" rel="noopener external nofollow" class="box" 
              style="background: #c1ebea" onclick="changeBg('#c1ebea')"></a> 
              
              <a href="javascript:;" rel="noopener external nofollow" class="box" 
              style="background: #dee7f1" onclick="changeBg('#dee7f1')"></a> 
              
              <a href="javascript:;" rel="noopener external nofollow" class="box" 
              style="background: #e9e3f2" onclick="changeBg('#e9e3f2')"></a> 
              
              <a href="javascript:;" rel="noopener external nofollow" class="box" 
              style="background: #f7eff5" onclick="changeBg('#f7eff5')"></a>  
              
              </div>
              </div>
            </details>



<h2>手机专用</h2>
<details class="folding-tag" blue=""><summary> 查看适配手机的背景 </summary>
              <div class="content">
              <div class="bgbox">
              <a href="javascript:;" rel="noopener external nofollow" 
              style="background-image:url(https://gitee.com/lin-xugeng/md-img/raw/master/img/mb16.webp)" 
              class="pimgbox" onclick="changeBg('url(https://gitee.com/lin-xugeng/md-img/raw/master/img/mb16.webp)')"></a>
              
              <a href="javascript:;" rel="noopener external nofollow" 
              style="background-image:url(https://gitee.com/lin-xugeng/md-img/raw/master/img/mb8.webp)" class="pimgbox" 
              onclick="changeBg('url(https://gitee.com/lin-xugeng/md-img/raw/master/img/mb8.webp)')"></a>
              
              <a href="javascript:;" rel="noopener external nofollow" 
              style="background-image:url(https://gitee.com/lin-xugeng/md-img/raw/master/img/mb7.webp)" class="pimgbox" 
              onclick="changeBg('url(https://gitee.com/lin-xugeng/md-img/raw/master/img/mb7.webp)')"></a>
              
              <a href="javascript:;" rel="noopener external nofollow" 
              style="background-image:url(https://gitee.com/lin-xugeng/md-img/raw/master/img/mb15.webp)" 
              class="pimgbox" onclick="changeBg('url(https://gitee.com/lin-xugeng/md-img/raw/master/img/mb15.webp)')"></a>
              
              <a href="javascript:;" rel="noopener external nofollow" 
              style="background-image:url(https://gitee.com/lin-xugeng/md-img/raw/master/img/mb19.webp)" class="pimgbox" 
              onclick="changeBg('url(https://gitee.com/lin-xugeng/md-img/raw/master/img/mb19.webp)')"></a>
              
              <a href="javascript:;" rel="noopener external nofollow" 
              style="background-image:url(https://gitee.com/lin-xugeng/md-img/raw/master/img/mb17.webp)" class="pimgbox" 
              onclick="changeBg('url(https://gitee.com/lin-xugeng/md-img/raw/master/img/mb17.webp)')"></a>
              
              <a href="javascript:;" rel="noopener external nofollow" 
              style="background-image:url(https://gitee.com/lin-xugeng/md-img/raw/master/img/mb1.webp)" 
              class="pimgbox" onclick="changeBg('url(https://gitee.com/lin-xugeng/md-img/raw/master/img/mb1.webp)')"></a>
              
              <a href="javascript:;" rel="noopener external nofollow" 
              style="background-image:url(https://gitee.com/lin-xugeng/md-img/raw/master/img/mb4.webp)" class="pimgbox" 
              onclick="changeBg('url(https://gitee.com/lin-xugeng/md-img/raw/master/img/mb4.webp)')"></a>
              
              </div>
              </div>
            </details>


<h2>自定义背景</h2>
<p></p><center>

<input type="text" id="pic-link" size="70%" maxlength="1000" 
style="padding: 5px 5px 5px 5px;border-radius:6px;line-height:2;" 
placeholder="请输入完整图片链接，建议使用在线图床，如 https://source.fomal.cc/img/home_bg.webp">

</center><p></p>

<p></p><center>

<button type="button" onclick="getPicture()" 
style="background:linear-gradient(to right, #114357, #f29492);width:30%;padding: 5px 0px 5px 0px;
border-radius:6px;color:white;line-height:2.5;">🌈切换链接背景🌈
</button>

</center><p></p>

<br>

</div>`;
}

// 适应窗口大小
function winResize() {
    var offsetWid = document.documentElement.clientWidth;
    if (offsetWid <= 768) {
        winbox.resize(offsetWid * 0.95 + "px", "90%").move("center", "center");
    } else {
        winbox.resize(offsetWid * 0.6 + "px", "70%").move("center", "center");
    }
}

// 切换状态，窗口已创建则控制窗口显示和隐藏，没窗口则创建窗口
function toggleWinbox() {
    if (document.querySelector('#changeBgBox')) winbox.toggleClass('hide');
    else createWinbox();
}






// 网页标题栏
 var OriginTitle = document.title;
 var titleTime;
 document.addEventListener('visibilitychange', function () {
     if (document.hidden) {
         $('[rel="icon"]').attr('href', "/img/trhx2.png");
         document.title = 'ヽ(●-`Д´-)ノ你走吧呜呜呜！';
         clearTimeout(titleTime);
     }
     else {
         $('[rel="icon"]').attr('href', "/img/trhx2.png");
         document.title = 'ヾ(Ő∀Ő3)ノ我就知道你会回来！' + OriginTitle;
         titleTime = setTimeout(function () {
             document.title = OriginTitle;
         }, 2000);
     }
 });