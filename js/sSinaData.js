var DEALEROBJ = DEALEROBJ || {};
DEALEROBJ = function (url, province, city, dealer, fillintype, furl) {

    _data = {};
    _url = '';
    provinceObj = {};
    cityObj = {};
    dealerObj = {};
    fillin = 0;
    fillinurl = '';
    this.url = url + '&callback=?';
    this.provinceObj = document.getElementById(province);
    this.cityObj = document.getElementById(city);
    this.dealerObj = document.getElementById(dealer);
    this.fillin = fillintype;
    this.fillinurl = furl;
    this.fillindata = {};
}

DEALEROBJ.prototype = {

    //执行方法
    init: function () {
        var _this = this;

        //_this.projectFillIn();
        _this.request();

    },
    //预填写
    projectFillIn: function () {
        var _this = this,
            fillindata = {};
        $.ajax({
            type: 'POST',
            url: _this.fillinurl,
            beforeSend: function(xhr) {   //beforeSend定义全局变量
                //   xhr.setRequestHeader("accept", "text/csv;charset=gb2312,*/*");
                xhr.overrideMimeType("text/csv;charset=gb2312");
            },
            dataType: 'json',
            data: { key: 'MTQ5NTk4NzIwMCYxNDk4NzUyMDAwJjNhZGNlNGVmYTYwYjZiN2QyZGFjYmE1MGJmYmFlYzg0' },
            success: function(data) {
                _this.fillInCallback(data);
            }
        });
    },
    fillInCallback: function (data) {
        var _this = this;
        //0是男 ，1是?
        if (data.code == "100000") {
            if (data.data.gender == "0") {
                $('#usersex').prop("selected", "selected")
            } else if (data.data.gender == "1") {
                $('#usersex1').prop("selected", "selected")
            }
            $("#name").prop("value", data.data.name);
            $("#mobi").prop("value", data.data.tel);
            var province = data.data.province,
                city = data.data.city;

            //省份默认
            if (province != "") {
                $("#province option").each(function (i, v) {
                    var sheng = $(this).val();
                    if (sheng == province) {
                        $(this).prop("selected", "selected");
                        return false;
                    }
                })
            }
            //城市默认
            _this.changeCity(province);
            //_this.cityObj.options[0] = new Option(city,city);
            if (city != "") {
                $("#city option").each(function (i, v) {
                    var shi = $(this).val();
                    if (shi == city) {
                        $(this).prop("selected", "selected");
                        _this.changeDealer(city);
                        $('#dealer option:eq(1)').prop('selected', 'selected');
                        return false;

                    } else {
                        $('#city option:eq(1)').prop('selected', 'selected');
                        _this.changeDealer($("#city option:eq(1)").val());
                        $('#dealer option:eq(1)').prop('selected', 'selected');

                    }

                });
                return false;
            }

        }
    },
    //发起请求,获取省份城市经销商
    request: function () {
        var _this = this;
        $.getJSON(_this.url, '',
            function (msg) {
                if (msg.ret == '200') _this._data = msg.data;
                _this.setProvince();
            });
    },
    //设置省份
    setProvince: function () {
        var _this = this,
            province = _this._data.province,
            pObj = _this.provinceObj,
            c = 1;
        pObj.innerText = '';
        pObj.options[0] = new Option('选择省份', '');
        for (var x in province) {
            pObj.options[c] = new Option(province[x], province[x]);
            c++;
        }

        //如果有预填写将预填写信息写到页面
        if (_this.fillin) {
            _this.projectFillIn();
        }
    },
    //根据选择的省份更改城市的列表
    changeCity: function (province) {
        var _this = this,
            city = _this._data.city,
            pObj = _this.provinceObj,
            cObj = _this.cityObj,
            dObj = _this.dealerObj,
            c = 1;
        if (pObj.value != '0') {

            if (typeof (city[province]) != 'undefined') {
                cObj.innerText = '';
                cObj.options.length = 0;
                cObj.options[0] = new Option('选择所在城市', '');
                for (var x in city[province]) {
                    cObj.options[c] = new Option(city[province][x], city[province][x]);
                    c++;
                }
            } else {
                cObj.innerText = '';
                cObj.options.length = 0;
                cObj.options[0] = new Option('选择所在城市', 0);
            }
        } else {
            cObj.innerText = '';
            cObj.options.length = 0;
            cObj.options[0] = new Option('选择所在城市', 0);

        }

        if (_this.series) {
            _this.dObj.innerText = '';
            _this.dObj.options.length = 0;
            _this.dObj.options[0] = new Option('选择经销商', 0);
        }
    },
    changeDealer: function (city) {
        var _this = this,
            dealer = _this._data.dealer,
            cObj = _this.cityObj,
            dObj = _this.dealerObj,
            c = 1;
        if (cObj.value != '0') {
            if (typeof (dealer[city]) != 'undefined') {
                dObj.innerText = '';
                dObj.options.length = 0;
                // dObj.options[0] = new Option('选择经销商', '');
                for (var x in dealer[city]) {
                    dObj.options[c] = new Option(dealer[city][x], dealer[city][x]);
                    c++;
                }
                $('#dealer option:eq(1)').prop('selected', 'selected');
            } else {
                cObj.innerText = '';
                cObj.options.length = 0;
                cObj.options[0] = new Option('选择经销商', 0);
            }
        } else {
            dObj.innerText = '';
            dObj.options.length = 0;
            dObj.options[0] = new Option('选择经销商', 0);
        }
    }
};
