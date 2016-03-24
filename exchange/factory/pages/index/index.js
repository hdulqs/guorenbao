require(['api_mkt', 'mkt_info', 'mkt_trade', 'cookie'], function(api_mkt, mkt_info, mkt_trade) {
    mkt_info.get();
    mkt_trade.get();
    var exchangeToken = $.cookie('exchangeToken');
    console.log(exchangeToken);
    var global_loginuserphone = $.cookie("global_loginuserphone");
    var global_loginusername = $.cookie("global_loginusername");
    var global_loginuseruid = $.cookie("global_loginuseruid");

    var totalAssets = $.cookie("totalAssets");
    var totalNuts = $.cookie("totalNuts");

    var mine_one = $.cookie("mine_one");
    var mine_two = $.cookie("mine_two");
    var mine_three = $.cookie("mine_three");
    var mine_four = $.cookie("mine_four");


    var whether_auth = false;
    if (!exchangeToken) {
        $(".login_regist").show(); //显示登录注册按钮
        $('.loginarea').show();
        
    } else {
        $(".login_regist").hide();
        $(".login_header").show();
        $(".loginarea").hide();
        $(".afterlogin").show();
        $(".top_em").html(global_loginuserphone.substr(0,3)+'****'+global_loginuserphone.substr(7,4));

        console.log("------index-------"+global_loginuserphone);
        console.log("------index-------"+global_loginusername);
        console.log("------index-------"+global_loginuseruid);

        $(".lf_asset_center").html(totalAssets);  //总资产
        $(".rg_asset_center").html(totalNuts);    //总果仁

        api_mkt.realAuth({
        }, function(data) {
            if (data.status == 200) {
                //alert(data.msg);
                whether_auth = true;
            } else if (data.status == 305) {
                //alert(data.msg);
            } else if(data.status == 400){
                //alert(data.msg);
                whether_auth = false;
            } else {
                //alert(data.msg);
            }
        });
        if(global_loginusername!=""&&global_loginusername){
            $("#logined_username").html(global_loginusername);
        } else {
            $("#logined_username").html(global_loginuserphone);
        }
        $("#uidval").html(global_loginuseruid);
        var whether_auth_val = "";
        if(whether_auth){
            whether_auth_val = global_loginusername;
            $(".bottom_em_i")[0].style.background = "url(./images/index_already_authentication.png)";
        } else {
            whether_auth_val = '未认证';
            $(".bottom_em_i")[0].style.background = "url(./images/index_no_auth.png)";
        }
        $("#whether_auth").html(whether_auth_val); //是否实名认证的标识
        $(".popDiv").hide();
        $(".bg").hide();
    }

    $(".bg").width($(document).width());
    $('.bg').height($(document).height());
    $('.bg').css('left', 0);
    $('.bg').css('top', 0);
    var swiper = new Swiper('.swiper-container', {
        pagination: '.swiper-pagination',
        paginationClickable: true
    });
    var ohlc = [];
    var volume = [];
    // set the allowed units for data grouping
    var groupingUnits = [
        [
            '周', // unit name
            [1] // allowed multiples
        ],
        [
            '月', [1, 2, 3, 4, 6]
        ]
    ];
    var on_page_load = false;
    var onem;
    var fivem;
    var fifteenm;
    var thirtym;
    var sixtym;
    var oned;
    var klineapply = function(data) {
        console.log(".....klineapply.....")
        console.log(data);
        onem = JSON.parse(data['1m']);
        fivem = JSON.parse(data['5m']);
        fifteenm = JSON.parse(data['15m']);
        thirtym = JSON.parse(data['30m']);
        sixtym = JSON.parse(data['60m']);
        oned = JSON.parse(data['1d']);
        if(!on_page_load){
            $(".fivteenminute").click();
            on_page_load = true;
        }
    }
    var highcharts_Rendering = function(whichday, groupingUnits) {
        Highcharts.theme = {
            colors: ["#ee6259", "#bee8d0", "#ED561B", "#DDDF00", "#24CBE5", "#64E572", "#FF9655", "#FFF263", "#6AF9C4"],
            chart: { borderColor: "#DDD", plotShadow: !0, plotBorderWidth: 1 },
            title: { style: { color: "#000", font: 'bold 16px "Trebuchet MS", Verdana, sans-serif' } },
            subtitle: { style: { color: "#666666", font: 'bold 12px "Trebuchet MS", Verdana, sans-serif' } },
            legend: { itemStyle: { font: "9pt Trebuchet MS, Verdana, sans-serif", color: "black" }, itemHoverStyle: { color: "#039" }, itemHiddenStyle: { color: "gray" } },
            labels: { style: { color: "#99b" } },
            navigation: { buttonOptions: { theme: { stroke: "#CCCCCC" } } }
        };
        //图表设置
        Highcharts.setOptions({
            colors: ['#DD1111', '#FF0000', '#DDDF0D', '#7798BF', '#55BF3B', '#DF5353', '#aaeeee', '#ff0066', '#eeaaee', '#55BF3B', '#DF5353', '#7798BF', '#aaeeee'],
            lang: {
                loading: 'Loading...',
                months: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
                shortMonths: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
                weekdays: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
                decimalPoint: '.',
                numericSymbols: ['k', 'M', 'G', 'T', 'P', 'E'],
                resetZoom: 'Reset zoom',
                resetZoomTitle: 'Reset zoom level 1:1',
                thousandsSep: ','
            },
            credits: { enabled: false }
        });
        ohlc = [];
        volume = [];
        if (whichday == "one") {
            for (var i = 0; i < onem.length; i++) {
                ohlc.push([onem[i][0], onem[i][2], onem[i][3], onem[i][4], onem[i][5]]);
                //volume.push([onem[i][0], onem[i][1]]);
            }
        } else if (whichday == "five") {
            for (var i = 0; i < fivem.length; i++) {
                ohlc.push([fivem[i][0], fivem[i][2], fivem[i][3], fivem[i][4], fivem[i][5]]);
                //volume.push([fivem[i][0], fivem[i][1]]);
            }
        } else if (whichday == "fivteen") {
            for (var i = 0; i < fifteenm.length; i++) {
                //ohlc.push([fifteenm[i][0], fifteenm[i][2], fifteenm[i][3], fifteenm[i][4], fifteenm[i][5]]);
                //volume.push([fifteenm[i][0], fifteenm[i][1]]);
                //
                ohlc.push([1458511800000, 5,6,7,8,10]);
                volume.push([1458511800000, 80]);
            }
        } else if (whichday == "thirty") {
            for (var i = 0; i < thirtym.length; i++) {
                ohlc.push([thirtym[i][0], thirtym[i][2], thirtym[i][3], thirtym[i][4], thirtym[i][5]]);
                //volume.push([thirtym[i][0], thirtym[i][1]]);
            }
        } else if (whichday == "sixty") {
            for (var i = 0; i < sixtym.length; i++) {
                ohlc.push([sixtym[i][0], sixtym[i][2], sixtym[i][3], sixtym[i][4], sixtym[i][5]]);
                console.log(sixtym[i][1]);
                //volume.push([sixtym[i][0], sixtym[i][1]]);
            }
        } else if (whichday == "oneday") {
            for (var i = 0; i < oned.length; i++) {
                ohlc.push([oned[i][0], oned[i][2], oned[i][3], oned[i][4], oned[i][5]]);
                //volume.push([oned[i][0], oned[i][1]]);
            }
        }
        //console.log(ohlc);
        //console.log(volume);
        $('#container').highcharts('StockChart', {
            rangeSelector: {buttons: [{type: 'minute', count: 60, text: '1h'},{type: 'minute', count: 120, text: '2h'},{type: 'minute', count: 360, text: '6h'},{type: 'minute', count: 720, text: '12h'},{type: 'day', count: 1, text: '1d'},{type: 'week', count: 1, text: '1w'},{type: 'all', text: '所有'}],selected:2, inputEnabled:false},
            global: {
                useUTC: true
            },
            credits: { enabled: false },
            colors: ['#000000', '#0000ff', '#ff00ff', '#f7a35c', '#8085e9'],
            title: {
                text: '果仁市场K线图'
            },
            xAxis: {
                type: 'dataTime'
            },
            exporting: { enabled: false, buttons: { exportButton: { enabled: false }, printButton: { enabled: true } } },
            tooltip: { xDateFormat: '%Y-%m-%d %H:%M %A', color: '#f0f', changeDecimals: 4, borderColor: '#058dc7' },
            plotOptions: { candlestick: { color: '#e55600', upColor: '#669900' } },
            yAxis: [
                { labels: { style: { color: '#e55600' } }, title: { text: '价格 [RMB]', style: { color: '#e55600' } }, height: 160, lineWidth: 2, gridLineDashStyle: 'Dash', showLastLabel: true },
                { labels: { style: { color: '#4572A7' } }, title: { text: '成交量 [GOP]', style: { color: '#4572A7' } }, offset: 0, top: 280, height: 34, lineWidth: 2, gridLineDashStyle: 'Dash', showLastLabel: true }
            ],
            /*tooltip: { xDateFormat: '%Y-%m-%d %H:%M %A', color: '#f0f', changeDecimals: 4, borderColor: '#058dc7' },*/
            tooltip: {
                formatter: function() {
                    // console.log(this.points[0]);
                    console.log("points:------------"+this.points[0].point)
                    var s = Highcharts.dateFormat('<span> %Y-%m-%d %H:%M:%S</span>', this.x);
                    s += "成交数量"+this.points[0].total;
                    s += '<br />开盘:<b>' + this.points[0].point.open + '</b><br />最高:<b>' + this.points[0].point.high + '</b><br />最低:<b>' + this.points[0].point.low + '</b><br />收盘:<b>' + this.points[0].point.close + '</b>';
                    return s;
                },
                shared: true,
                useHTML: true,
                valueDecimals: 2, //有多少位数显示在每个系列的y值
                crosshairs: [{
                    color: '#b9b9b0'
                }, {
                    color: '#b9b9b0'
                }]
            },
            scrollbar: {
                enabled: true
            },
            series: [
                { animation: false, name: '成交量 [GOP]', type: 'column', color: '#4572A7', dataGrouping: { units: groupingUnits, enabled: false }, yAxis: 1, data: volume },
                { animation: false, name: '价格 [RMB]', type: 'candlestick', dataGrouping: { units: groupingUnits, enabled: false }, data: ohlc }
            ]
        });
    }

    $(".close_btn").on("click",function(){
        $(".popDiv").hide();
        $(".bg").hide();
    });

    $(".timebar").on("click", function() {
        console.log("timebar");
        $(this).addClass("btn_choosed");
        $(this).siblings().removeClass("btn_choosed");
        if ($(this).hasClass("oneminute")) {
            highcharts_Rendering("one", groupingUnits);
        } else if ($(this).hasClass("fiveminute")) {
            highcharts_Rendering("five", groupingUnits);
        } else if ($(this).hasClass("fivteenminute")) {
            highcharts_Rendering("fivteen", groupingUnits);
        } else if ($(this).hasClass("thirtyminute")) {
            highcharts_Rendering("thirty", groupingUnits);
        } else if ($(this).hasClass("sixtyminute")) {
            highcharts_Rendering("sixty", groupingUnits);
        } else if ($(this).hasClass("onedayminute")) {
            highcharts_Rendering("oneday", groupingUnits);
        }
    });
    
    api_mkt.homepagekline(function(data) {
        klineapply(data);
    });
    var flag = true;
    $('.messagenum_area').on("click", function() {
        if (flag) {
            flag = false;
            $(this).css("background-color", "#ffffff");
            $(".popup_message_box").show("100");
            $(".messagenum_area em").css("color", "#333333");
            $(".msg_num").css("color", "#333333");
        } else {
            flag = true;
            $(this).css("background-color", "#282828");
            $(".popup_message_box").hide("100");
            $(".messagenum_area em").css("color", "#cccccc");
            $(".msg_num").css("color", "#cccccc");
        }
    });

    var isSubmit = function() {
        var objArr = $(".main input");
        var obj = "";
        var verEnd = "";
        for (var i = 0, l = objArr.length; i < l; i++) {
            obj = $(objArr[i]);
            if (obj.val() || i === l - 1) {
                //薪资字段为选填字段
                if (i === l - 1 && !obj.val()) {
                    return true;
                }
                verEnd = verify(obj.val(), obj.attr("id"));
                if (verEnd === true) {
                    if (i === l - 1) {
                        return true;
                    }
                } else {
                    showWarnWin(verEnd, 1000);
                    return false;
                }

            } else {
                showWarnWin("请输入" + obj.attr("placeholder"), 1000);
                return false;
            }
        }
    };
    var verify = function(inputData, dataType) {
        var reg = "";
        var varMes = '';
        if (dataType === "name") {
            reg = /^[\u4E00-\u9FA5]{2,5}$/;
            varMes = "姓名请输入2~5个汉字";
        } else if (dataType === "tel") {
            reg = /^(13[0-9]|15[012356789]|17[0-9]|18[0-9]|14[57])[0-9]{8}$/;
            varMes = "请输入正确的手机号码";
        } else if (dataType === "salary") {
            reg = /^[1-9]\d{1,4}$/;
            varMes = "薪资请输入3~5位数字";
        } else if (dataType === "verCode") {
            reg = /^\d{6}$/;
            varMes = "验证码不正确";
        } else {
            reg = /^.*$/;
        }
        //如果输入数据不为空则去掉收尾空格
        if (inputData) {
            inputData = inputData.trim();
        }
        return reg.test(inputData) ? reg.test(inputData) : varMes;
    };
    String.prototype.trim = function() {
        return this.replace(/(^\s*)|(\s*$)/g, '');
    };
    var login_area_times = 0;
    $(".indexpage_loginarea_btn").on("click", function() {
        var phone = $(".phone_loginarea").val();
        var password = $(".password_loginarea").val();
        var flag = verify(phone, "tel");
        if(flag=="请输入正确的手机号码"){
            $(".error_tips_index").show().html("请输入正确的手机号码");
            return;
        }
        if(password==""){
            $(".error_tips_index").show().html("请输入密码");
            return;
        } else if(password.length>12||password.length<6){
            $(".error_tips_index").show().html("请输入6~12位密码");
            return;
        }
        if(flag==true&&password!=""&&password.length>=6&&password.length<=12){
            $(".error_tips_index").hide();
            console.log("error_tips_index...");
            api_mkt.login({
                phone: phone,
                password: password
            }, function(data) {
                if (data.status == 200) {
                    $.cookie('exchangeToken', 'logined');
                    console.log(data.msg);
                    $(".login_regist").hide();
                    $(".login_header").show();
                    $(".popDiv").hide();
                    $(".bg").hide();
                    global_loginuserphone = data.data.phone;
                    global_loginusername = data.data.username;
                    global_loginuseruid = data.data.uid;
                    console.log(global_loginuserphone);
                    console.log(global_loginusername);
                    $.cookie("global_loginuserphone",global_loginuserphone);
                    $.cookie("global_loginusername",global_loginusername);
                    $.cookie("global_loginuseruid",global_loginuseruid);


                    $("#logined_username").html(data.data.phone);
                    $(".top_em").html(data.data.phone.substr(0,3)+'****'+data.data.phone.substr(7,4));
                    $("#uidval").html(global_loginuseruid);  //首页uid赋值

                    api_mkt.totalAssets({
                    }, function(data) {
                        if (data.status == 200) {
                            var totalAssets = data.data.gopBalance + data.data.gopLock;
                            var totalNuts = data.data.cnyBalance + data.data.cnyLock;
                            $.cookie("totalAssets",totalAssets);
                            $.cookie("totalNuts",totalNuts);
                            $.cookie("mine_one",data.data.cnyBalance);
                            $.cookie("mine_two",data.data.gopBalance);
                            $.cookie("mine_three",data.data.cnyLock);
                            $.cookie("mine_four",data.data.gopLock);

                            $('.lf_asset_center').html(totalAssets);//总资产
                            $('.rg_asset_center').html(totalNuts);//总果仁
                        } else if (data.status == 305) {
                            
                        } else if(data.status == 400){
                            
                        } else {
                            
                        }
                    });
                    var whether_auth_val = "";
                    if(whether_auth){
                        whether_auth_val = global_loginusername;
                        $(".bottom_em_i")[0].style.background = "url(./images/index_already_authentication.png)";
                    } else {
                        whether_auth_val = '未认证';
                        $(".bottom_em_i")[0].style.background = "url(./images/index_no_auth.png)";
                    }
                    $("#whether_auth").html(whether_auth_val); //是否实名认证的标识

                    $(".loginarea").hide();
                    $(".afterlogin").show();
                } else if (data.status == 305) {
                    alert(data.msg);
                    login_area_times++;
                } else {
                    login_area_times++;
                    $(".error_tips_index").show().html(data.msg);
                }
            });
        }
        if (login_area_times > 3) {
            $("#authcode_page").show();
            $(".indexpage_loginarea_btn").css("top", "244px");
            $(".index_bottom_btna").css("top", "280px");
        } else {
            $(".indexpage_loginarea_btn").css("top", "180px");
            $(".index_bottom_btna").css("top", "216px");
        }
    });


    $(".recharge").on("click",function(){
        alert("充值")
        location.href = "./cnydepositswithdrawal.html";
    });

    $(".withdraw").on("click",function(){
        alert("提现");
        //location.href = "";
    });
    
    var fflat = true;
    $(".eye_i").on("click",function(){
        if(fflat){
            $(this)[0].style.background = "url(./images/index_no_eye.png)";
            fflat = false;
            $(".lf_asset_center").hide();
            $(".lf_asset_center_none").show();
            $(".rg_asset_center").hide();
            $(".rg_asset_center_none").show();
        } else {
            $(this)[0].style.background = "url(./images/index_eye_visible.png)";
            fflat = true;
            $(".lf_asset_center").show();
            $(".lf_asset_center_none").hide();
            $(".rg_asset_center").show();
            $(".rg_asset_center_none").hide();
        }
    });

    $(".loginout").on("click", function() {
        $.cookie('exchangeToken', '');
        $.cookie("global_loginuserphone",'');
        $.cookie("global_loginusername",'');
        $.cookie("global_loginuseruid",'');

        $.cookie("totalAssets","");
        $.cookie("totalNuts","");
        $.cookie("mine_one","");
        $.cookie("mine_two","");
        $.cookie("mine_three","");
        $.cookie("mine_four","");

        //退出登录
        api_mkt.userlogout({
        }, function(data) {
            if (data.status == 200) {
                alert(data.msg);
            } else if (data.status == 305) {
                alert(data.msg);
            } else {
                alert(data.msg);
            }
        });
        setTimeout(function(){
            location.reload(true);
        },100);
    });

});
