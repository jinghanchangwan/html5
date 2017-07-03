/*
 @Date : 2016-11-1
 调用方法：KW.x();
 此公共库内部成员修改或添加请注明_人员,日期,修改内容及注释
 */

(function (wd) {
    if (!wd.KW) {
        wd.KW = {};
    };
    wd.KW = {
        he : function(){
            console.log(this);
        },
        /*-------------------- $获取id --------------------*/
        $ : function () { //$()函数
            var elements = new Array();
            for (var i = 0; i <= arguments.length; i++) {
                var element = arguments[i];
                //如果是一个字符串那假设它是一个ID
                if (typeof element == 'string') {
                    element = document.getElementById(element);
                }
                //如果只提供了一个参数,则立即返回这个参数
                if (arguments.length == 1) {
                    return element;
                }
                //否则，将它添加到数组中
                elements.push(element);
            }
            return elements;
        },
        /*-------------------- 事件处理 --------------------*/
        addEvent : function (oTarget, oType, fnHandler) { //-----添加事件;
            var oT = typeof oTarget == "string" ? this.$(oTarget) : oTarget;
            if (!oT) {
                alert('Not found \" ' + oTarget + ' \"');
                return false
            };
            if (oT.addEventListener) { //for DOM
                oT.addEventListener(oType, fnHandler, false);
            } else if (oT.attachEvent) { //for IE
                oT.attachEvent('on' + oType, fnHandler);
            } else { //for Others
                oT['on' + oType] = fnHandler;
            }
        },
        removeEvent : function (oTarget, oType, fnHandler) { //-----移除事件;
            var oT = this.$(oTarget);
            if (!oT) {
                alert('Not found \" ' + oTarget + ' \"');
                return false
            };
            if (oT.removeEventListener) { //for DOM
                oT.removeEventListener(oType, fnHandler, false);
            } else if (oT.detachEvent) { //for IE
                oT.detachEvent('on' + oType, fnHandler);
            } else { //for Others
                oT['on' + oType] = null;
            }
        },
        /*-------------------- 常用函数及验证 --------------------*/
        stripSpace : function (oTarget) { //-----移除首位空格-----
            var re = /^\s*(.*?)\s*$/;
            return oTarget.replace(re, '$1');
        },
        isEmail : function (e) { //-----Is E-mail
            var re = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/;
            return re.test(e);
        },
        isMobile : function (e) { //-----Is Mobile 三位手机后四*或五*
            //by haimeng 20161110 start 三位手机后增加六*
            //var re = /^(\+86)*0*1[3|4|5|6|7|8|9]\d{1}(\*\*\*\*\*\d{3}|\*\*\*\*\d{4}|\d{8})$/;
            //by haimeng mod
            var re = /^(\+86)*0*1[3|4|5|6|7|8|9]\d{1}(\*\*\*\*\*\d{3}|\*\*\*\*\d{4}|\*\*\*\*\*\*\d{2}|\d{8})$/;
            //by haimeng 20161110 end 三位手机后增加六*
            return re.test(e);
        },
        /*-------------------- Cookie操作 --------------------*/
        setCookie : function (sName, sValue, oExpires, sPath, sDomain, bSecure) { //-----设置Cookie-----
            var sCookie = sName + '=' + encodeURIComponent(sValue);
            if (oExpires) {
                var date = new Date();
                date.setTime(date.getTime() + oExpires * 60 * 60 * 1000);
                sCookie += '; expires=' + date.toUTCString();
            }
            if (sPath) {
                sCookie += '; path=' + sPath;
            }
            if (sDomain) {
                sCookie += '; domain=' + sDomain;
            }
            if (bSecure) {
                sCookie += '; secure';
            }
            document.cookie = sCookie;
        },
        getCookie : function (sName) { //-----获得Cookie值-----
            var sRE = '(?:; )?' + sName + '=([^;]*)';
            var oRE = new RegExp(sRE);
            if (oRE.test(document.cookie)) {
                return decodeURIComponent(RegExp['$1']);
            } else {
                return null;
            }
        },
        deleteCookie : function (sName, sPath, sDomain) { //-----删除Cookie值-----
            this.setCookie(sName, '', new Date(0), sPath, sDomain);
        },
        clearCookie : function () { //清除所有Cookie
            var cookies = document.cookie.split(";");
            var len = cookies.length;
            for (var i = 0; i < len; i++) {
                var cookie = cookies[i];
                var eqPos = cookie.indexOf("=");
                var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
                name = name.replace(/^\s*|\s*$/, "");
                document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/"
            }
        },
        /*-------------------- 动态加载js及回调函数 --------------------*/
        loadJS : function (url,callFun) {//如需多个js依赖请单独调用模块依赖插件
            var statu = true; //初始状态
            var js = document.getElementsByTagName("script");
            var len = js.length;
            for (var i = 0; i < len; i++) {
                if (js[i].getAttribute("src") == url) {
                    statu = false; //如果已经添加，则设置为Flase，不再添加
                }
            }
            if (statu) {
                var script = document.createElement("script");
                script.type = "text/javascript";
                script.src = url;
                var header = document.getElementsByTagName("head")[0];
                header.appendChild(script);
                script.onload = function(){//onload或许出现兼容性问题
                    callFun();
                }
            }
        },
        /*-------------------- 微信sdk --------------------*/
        wx :function(wxObj){ //目前只调用分享功能
            this.loadJS("http://res.wx.qq.com/open/js/jweixin-1.0.0.js",function(){

                $.ajax({
                    url: 'http://all.vic.sina.com.cn/201602weixin/interface/getToken.php?url=' + encodeURIComponent(window.location.href),
                    type: 'get',
                    dataType: "json",
                    success: function (data) {
                        if (data.errcode == 0) {
                            console.log(data);

                            //初始化wx sdk 配置
                            wx.config({
                                debug: false,
                                appId: data.appid,
                                timestamp: data.timestamp,
                                nonceStr: data.noncestr,
                                signature: data.signature,
                                jsApiList: [
                                    'checkJsApi',
                                    'onMenuShareTimeline',
                                    'onMenuShareAppMessage',
                                    'onMenuShareQQ',
                                    'onMenuShareWeibo',
                                    'hideMenuItems',
                                    'showMenuItems',
                                    'closeWindow'
                                ]
                            });

                            //调用wx sdk 分享
                            wx.ready(function () {
                                wx.onMenuShareTimeline({
                                    title: wxObj.tit,
                                    desc: wxObj.con,
                                    link: window.location.href,
                                    imgUrl: wxObj.ImgUrl,
                                    //分享成功、失败、用户取消及Menu菜单等回调函数有需求时请扩展
                                });
                                wx.onMenuShareQQ({
                                    title: wxObj.tit,
                                    desc: wxObj.con,
                                    link: window.location.href,
                                    imgUrl: wxObj.ImgUrl,
                                });
                                wx.onMenuShareAppMessage({
                                    title: wxObj.tit,
                                    desc: wxObj.con,
                                    link: window.location.href,
                                    imgUrl: wxObj.ImgUrl,
                                });
                                wx.onMenuShareWeibo({
                                    title: wxObj.tit,
                                    desc: wxObj.con,
                                    link: window.location.href,
                                    imgUrl: wxObj.ImgUrl,
                                });

                            });

                        };
                    }
                });

            });
        },
        /*-------------------- 原生ajax 调用意义不大 --------------------*/
        ajax : function (obj) {
            if (!obj.url) {
                return false;
            };
            var method = obj.type || "GET";
            var async = obj.async || true;
            var dataType = obj.dataType;
            var XHR = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
            XHR.open(method, obj.url, async);
            XHR.setRequestHeader('If-Modified-Since', 'Thu, 06 Apr 2006 00:00: 00 GMT');
            XHR.send(null);
            if (obj.sendBefore) {
                obj.sendBefore();
            };
            XHR.onreadystatechange = function () {
                if (XHR.readyState == 4 && (XHR.status >= 200 && XHR.status < 300 || XHR.status == 304)) {

                    if (obj.success) {
                        if (dataType && dataType.toLocaleLowerCase() === "json") {
                            obj.success(eval("(" + XHR.responseText + ")"))
                        } else if (dataType && dataType.toLocaleLowerCase() === "xml") {
                            obj.success(XHR.responseXML)
                        } else {
                            obj.success(XHR.responseText);
                        }
                    };
                    if (obj.complete) {
                        obj.complete()
                    }

                } else {
                    if (obj.complete) {
                        obj.complete()
                    }
                    if (obj.error) {
                        obj.error("The XMLHttpRequest failed. status: " + XHR.status);
                    }

                }

            }
        }

    };

})(this);