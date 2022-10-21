function setFont(e){
    localStorage.setItem("font",e),
    "main"==e?(document.body.style.fontFamily="-apple-system, Consolas_1, BlinkMacSystemFont,'Segoe UI' , 'Helvetica Neue' , Lato, Roboto, 'PingFang SC' , 'Microsoft JhengHei' , 'Microsoft YaHei' , sans-serif",
    document.documentElement.style.setProperty("--global-font","-apple-system")):(document.body.style.fontFamily="var(--global-font),-apple-system, IBM Plex Mono ,monosapce,'微软雅黑', sans-serif",
    document.documentElement.style.setProperty("--global-font",e))}
    
    function setColor(e){document.getElementById("themeColor").innerText=`:root{--theme-color:var(--color-${e})!important}`,
    localStorage.setItem("themeColor",e)}function saveData(e,o){localStorage.setItem(e,JSON.stringify({time:Date.now(),data:o}))}
    
    function loadData(e,o){let a=JSON.parse(localStorage.getItem(e));
        if(a){let e=Date.now()-a.time;if(e<60*o*1e3&&e>-1)return a.data}return 0}null==localStorage.getItem("font")&&localStorage.setItem("font","ZhuZiAWan_light"),
        setFont(localStorage.getItem("font")),null==localStorage.getItem("themeColor")&&localStorage.setItem("themeColor","green"),setColor(localStorage.getItem("themeColor"));
        try{let e=loadData("blogbg",1440);e?changeBg(e,1):localStorage.removeItem("blogbg")}catch(e){localStorage.removeItem("blogbg")}
        
        function changeBg(e,o){let a=document.getElementById("web_bg");
        "#"==e.charAt(0)?(a.style.backgroundColor=e,a.style.backgroundImage="none"):a.style.backgroundImage=e,o||saveData("blogbg",e)}
        
        function getPicture(){let e=document.getElementById("web_bg");
        if(""!=document.getElementById("pic-link").value){var o="url("+document.getElementById("pic-link").value+")";e.style.backgroundImage=o,saveData("blogbg",o)}}
        
        function reset(){localStorage.clear(),window.location.reload()}


// 创建窗口
// var winbox = ''

// function createWinbox() {
//     let div = document.createElement('div')
//     document.body.appendChild(div)
//     winbox = WinBox({
//         id: 'changeBgBox',
//         index: 999,
//         title: "切换背景",
//         x: "center",
//         y: "center",
//         minwidth: '300px',
//         height: "60%",
//         background: 'var(--leonus-blue)',
//         onmaximize: () => { div.innerHTML = `<style>body::-webkit-scrollbar {display: none;}div#changeBgBox {width: 100% !important;}</style>` },
//         onrestore: () => { div.innerHTML = '' }
//     });
//     winResize();
//     window.addEventListener('resize', winResize)

//     winbox.body.innerHTML = `<h2>一、字体设置</h2>\n
//     <div class="note warning simple"><p>注意：非商免字体未经授权只能个人使用。本站为完全非商业、非盈利性质的网站，平时用于个人学习交流，站长不会由此获利一分钱，如涉及侵权请联系站长删除，谢谢！ —— 致版权方</p>
//     \n</div>\n<p id="swfs">\n<a class="swf" href="javascript:;" rel="noopener external nofollow" 
//     style="font-family:\'ZhuZiAWan\'!important;color:black" 
//     onclick="setFont(\'ZhuZiAWan_light\')">筑紫A丸ゴシック</a>
//     \n<a class="swf" href="javascript:;" rel="noopener external nofollow" 
//     style="font-family:\'HYTMR\'!important;color:black" 
//     onclick="setFont(\'HYTMR\')">汉仪唐美人</a>\n<a class="swf" 
//     href="javascript:;" rel="noopener external nofollow" 
//     style="font-family:\'LXGW\'!important;color:black" 
//     onclick="setFont(\'LXGW\')">霞鹜文楷</a>\n<a class="swf" 
//     href="javascript:;" rel="noopener external nofollow" 
//     style="font-family:\'TTQHB\'!important;color:black" 
//     onclick="setFont(\'TTQHB\')">甜甜圈海报</a>\n<a class="swf" 
//     href="javascript:;" rel="noopener external nofollow" 
//     style="font-family:\'YSHST\'!important;color:black" 
//     onclick="setFont(\'YSHST\')">优设好身体</a>\n<a class="swf" 
//     href="javascript:;" rel="noopener external nofollow" 
//     style="font-family:\'MiSans\'!important;color:black" 
//     onclick="setFont(\'MiSans\')">MiSans</a>\n<a class="swf" 
//     href="javascript:;" rel="noopener external nofollow" 
//     style="font-family:-apple-system, IBM Plex Mono ,monosapce,\'微软雅黑\', 
//     sans-serif;!important;color:black" onclick="setFont(\'main\')">系统默认</a>\n</p>`;
// }