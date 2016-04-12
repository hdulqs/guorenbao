require(['api_mkt','mkt_info','cookie'], function(api_mkt,mkt_info) {

        $('.rmbxh').on('click',function(){
            $(this).addClass('bottomon');
            $('.rmbtx').removeClass('bottomon');
            $('.recharge').show();
            $('.withdraw_deposit').hide();
        });
        $('.rmbtx').on('click',function(){
            $(this).addClass('bottomon');
            $('.rmbxh').removeClass('bottomon');
            $('.recharge').hide();
            $('.withdraw_deposit').show();
            //判断有无节点
            if($('.nutOutputManager').length >0){
                $('.nut-one').hide();
                $('.nut-two').show(); 
            }else{
                $('.nut-one').show();
                $('.nut-two').hide(); 
            }
                    
        });
        //果仁提现地址管理(如果有就显示)            
        api_mkt.gopAddressMan({          
            'pageNo':1,
            'pageSize':10
        }, function(data) {
            if (data.status == 200) {
                //果仁市场添加
                $('.nut-one').hide();
                $('.nut-two').show();
                for(var i=0;i<data.data.list.length;i++){
                    //创建节点
                    var Node1 = $('<div></div>');
                    Node1.addClass('nutOutputManager');
                    var Node2 = $('<p>地址：</p>').appendTo(Node1); 
                    var Node2_1 = $('<input type="text" class="nutIdName input" value="" />').appendTo(Node2); 
                    var Node3 = $('<p class="nutIdAddress"></p>').appendTo(Node1); 
                    var Node4 = $('<span class="nutOutputManager-modify"></span>').appendTo(Node1); 
                    var Node5 = $('<span class="nutOutputManager-del"></span>').appendTo(Node1);
                    Node2_1.val(data.data.list[i].name);
                    Node3.text(data.data.list[i].address);
                    //$('.nut-two').appendBefore(Node1);
                    Node1.insertBefore($('.nutOutputManager-add'));
                    if($('.nutOutputManager').length % 2 == 0){
                        Node1.addClass('nutOutputManager-even');
                    }                   
                } 
                //再次添加果仁地址
                $('.nutOutputManager-add').click(function(){
                    $('.nut-one').show();
                    $('.nut-two').hide();
                });
                //果仁提现地址管理删除
                $('.nutOutputManager-del').click(function(){
                    $(this).parent().remove();            
                    api_mkt.gopAddressManDel({          
                        'wallet':($(this).parent().find('.nutIdAddress').text())
                    }, function(data) {
                        if (data.status == 200) {
                          window.location.href='withdraw.html?id=rmbtx';
                        } else {
                            alert(data.msg);
                        }
                    });         
                });
                //果仁提现地址修改
                $('.nutOutputManager-modify').click(function(){
                    $(this).parent().find('.nutIdName').removeClass('input');
                    var Node = $('<input type="button" value="确认修改" />');
                    Node.addClass('confirmUpdate');
                    Node.insertAfter($(this).parent().find('.nutIdName'));                    

                    $('.confirmUpdate').click(function(){
                        api_mkt.gopAddressManUpdate({          
                            'id':data.data.list[$(this).parent().parent().index()].id,
                            'name':$(this).parent().find('.nutIdName').val()
                        }, function(data) {
                            if (data.status == 200) {
                                window.location.href = 'withdraw.html?id=rmbtx';
                            } else {
                            	alert(data.msg);
                            }
                        });
                    });         
                });                
            } else {
            }
        });
        

        //twoBackOne  返回
        $('.twoBackOne').click(function(){
            /*$('.one').css('display','flex');
            $('.two').css('display','none');
            $(this).css('display','none');*/
            window.location.reload();
        });

        //点击-银行卡表单
        $('.bankIdCard-add').click(function(){
            $('.one').css('display','none');
            $('.two').css('display','flex');
            $('.newCard').hide();
        });
        //校验银行账户
        var btnConfirm = false;
        //银行账号校验-人民币提现管理
        $("#bank-idcard").blur(function(){
            var bankIdcard = $("#bank-idcard").val();
            var reg = /^(\d{16}|\d{19})$/;
            if(!bankIdcard || !reg.exec(bankIdcard)){
                btnConfrim = false;
                $('.msg-bank-idcard').show().text('请输入正确的银行账号');
            }else{
                $('.msg-bank-idcard').hide();
                btnConfrim = true;
                //接口 银行卡识别
                $.ajax({
                    type: "POST",
                    dataType: "json",
                    url: api_mkt.basePath2,
                    data: JSON.stringify({
                        'bankCard':$("#bank-idcard").val()
                    }),
                    cache: false,
                    success: function(data) {
                        //所属银行自动添加
                        if(data.data.bankName!='中国工商银行' && data.data.bankName!='中国建设银行' && data.data.bankName!='中国农业银行' 
                    		&& data.data.bankName!='交通银行' && data.data.bankName!='中国邮政储蓄银行'  && data.data.bankName!='招商银行' ){
                        	$("#bank").val('暂不支持('+data.data.bankName+')');
                    	}else{
                    		$("#bank").val(data.data.bankName);
                    	}
                    },
                    error: function() {
                        alert("提交失败");
                    }
                });
            }
        });

        //全国省市二级联动下拉选择菜单-人民币提现管理
        first("selectp","selectc","form1",0,0);
        
        //校验开户支行-人民币提现管理
        $('#subbank').blur(function(){
            var subbank = $.trim($(this).val());
            var reg = /^[\u4e00-\u9fa5]+$/;   
            if(!subbank || !reg.test(subbank)){
                btnConfirm = false;
                $('.msg-subbank').show().text('请输入正确的开户支行地址');
            }else{
                btnConfirm = true;
                $('.msg-subbank').hide();
            }
        });
        //校验支付密码-人民币提现管理
        $('.pay-pwd').blur(function(){
            var payPwd = $.trim($(".pay-pwd").val());
            var reg = /^[0-9a-zA-Z]{6,12}$/;
            if(!reg.test(payPwd) || !payPwd){
                btnConfirm = false;
                $('.msg-pay-pwd').show().text('请输入正确的支付密码');
            }else{
                btnConfirm = true;
                $('.msg-pay-pwd').hide();
            }
        });

        //校验验证码-人民币提现管理
        $('#sendCodeByLoginAfter, #nut-identifyingCode').blur(function(){
            var code = $.trim($(this).val());
            if(isNaN(code)){
                btnConfirm = false;
                $('.msg-sendCodeByLoginAfter').show().text('请输入正确的验证码');
                $('.msg-nut-identifyingCode').show().text('请输入正确的验证码');
            }else{
                btnConfirm = true;
                $('.msg-sendCodeByLoginAfter').hide();
                $('.msg-nut-identifyingCode').hide();
            }
        });
        //获取验证码-人民币提现管理
        $('#sendCodeByLoginAfterBtn, #nut-identifyingCodeBtn').click(function(){
            if(btnConfirm == false){
                alert('请完善填写信息！');
            }
            else{
                api_mkt.sendCodeByLoginAfter(function(data) {
                    if (data.status == 200) {
                        $('.msg-sendCodeByLoginAfter').text('');
                        $('.msg-nut-identifyingCode').text('');
                    } else {
                        $('.msg-sendCodeByLoginAfter').text('请输入正确的验证码');                        
                        $('.msg-nut-identifyingCode').text('请输入正确的验证码');
                    }
                });
                
                //30秒内只能发送一次
                var count = 60;
                var resend = setInterval(function(){
                        count--;
                        if(count > 0){
                            $('#sendCodeByLoginAfterBtn, #nut-identifyingCodeBtn').val(count+'s后重新发送');
                            $('#sendCodeByLoginAfterBtn, #nut-identifyingCodeBtn').attr('disabled',true).css({'cursor':'not-allowed','backgroundColor':'#eee','color':'#999'});
                        }else{
                            clearInterval(resend);
                            $('#sendCodeByLoginAfterBtn, #nut-identifyingCodeBtn').attr('disabled',false).css({'cursor':'not-allowed','backgroundColor':'#0bbeee','color':'#fff'}).val('获取验证码');
                        }
                        
                    },1000); 
            }
            
        });

        //人民币提现管理添加 点击-确认添加银行卡
        $('.confirmAdd').click(function(){
            if(btnConfirm == false || $('#sendCodeByLoginAfter').val() ==''){
                alert('请填写完整信息');
            }else{       
            	//中国工商银行，中国建设银行，中国农业银行，中国交通银行，中国邮政储蓄银行，招商银行
            	if($('#bank').val()!='中国工商银行' && $('#bank').val()!='中国建设银行' && $('#bank').val()!='中国农业银行' 
            		&& $('#bank').val()!='交通银行' && $('#bank').val()!='中国邮政储蓄银行'  && $('#bank').val()!='招商银行' ){
            		$('.msg-bank').show().text('暂不支持此银行');
            		return false;
            	}
                var auth_name = $.cookie("global_loginusername");
                api_mkt.rmbWithdrawalsManageAdd({          
                    'name':auth_name, 
                    'bank': $('#bank').val(),
                    'bankId':$('#bank-idcard').val(),
                    'bankProvince':$('.select-area').find('option:selected').text(),
                    'bankCity':$('.select-city').find('option:selected').text(),
                    'subbank':$('#subbank').val(),
                    'payPwd':$('#pay-pwd').val(),
                    'identifyingCode':$('#sendCodeByLoginAfter').val()
                }, function(data) {
                    if (data.status == 200) {  
                    	window.location.reload();
                    } else if(data.msg == '验证码错误'){
                        $('.msg-sendCodeByLoginAfter').text('验证码错误');
                    } else if(data.msg == '服务器异常'){
                        $('.msg-sendCodeByLoginAfter').text('服务器异常');
                    } else if(data.msg == '提现银行卡账户名必须与您的实名认证姓名一致'){
                        $('.msg-sendCodeByLoginAfter').text('提现银行卡账户名必须与您的实名认证姓名一致');
                    } else if(data.msg == '支付密码错误'){
                        $('.msg-pay-pwd').text('支付密码错误');
                    }              
                });
                
            }            
        });        

        //果仁提现地址备注-校验
        $('.msg-nut-name').show().html('<p style="color:#999;">果仁市场内互转即时极速到账</p>');
        $('#nut-name').blur(function(){
            var name = $(this).val();
            if(!name){
                btnConfirm = false;
                $('.msg-nut-name').show().text('请输入地址备注');
            }else{
                btnConfirm = true;
                $('.msg-nut-name').show().html('<p style="color:#999;">地址备注完成：果仁市场内互转即时极速到账</p>');
            }
        });
        //果仁提现地址-校验
        $('#nut-address').blur(function(){
            var address = $(this).val();
            if(!address){
                btnConfirm = false;
                $('.msg-nut-address').show().text('请输入正确地址');
            }else{
                btnConfirm = true;
                $('.msg-nut-address').hide();
            }
        });
        //校验支付宝密码
        $('.nut-paypwd').blur(function(){
            var nutPayPwd = $(this).val();
            if(!nutPayPwd){
                btnConfirm = false;
                $('.msg-nut-paypwd').show().text('请输入支付宝密码');
            }else{
                btnConfirm = true;
                $('.msg-nut-paypwd').hide();
            }
        });

        //果仁提现地址管理添加
        $('.gopAddressManAdd, .del').click(function(){
            if(btnConfirm == false || $('#nut-identifyingCode').val() ==''){
                alert('请填写完整信息');
            }else{
                api_mkt.gopAddressManAdd({          
                    'name':$('#nut-name').val(),
                    'paypwd': $('#nut-paypwd').val(),
                    'address':$('#nut-address').val(),
                    'identifyingCode':$('#nut-identifyingCode').val()
                }, function(data) {
                    if (data.status == 200) {
                        //果仁市场添加
                        $('.nut-one').hide();
                        $('.nut-two').show();
                        //创建节点
                        var Node1 = $('<div></div>');
                        Node1.addClass('nutOutputManager');
                        var Node2 = $('<p></p>').appendTo(Node1); 
                        var Node2_1 = $('<input type="text" class="nutIdName" style="outline:none;border:0;background-color:#FAFAFA;" value="" disabled/>').appendTo(Node2); 
                        var Node3 = $('<p class="nutIdAddress"></p>').appendTo(Node1); 
                        var Node4 = $('<span class="nutOutputManager-modify"></span>').appendTo(Node1); 
                        var Node5 = $('<span class="nutOutputManager-del"></span>').appendTo(Node1);
                        Node2_1.val($('#nut-name').val());
                        Node3.text($('#nut-address').val());
                        //$('.nut-two').appendBefore(Node1);
                        Node1.insertBefore($('.nutOutputManager-add'));
                        if($('.nutOutputManager').length % 2 == 0){
                            Node1.addClass('nutOutputManager-even');
                        }
                        for(var i=0, length=$('.nutOutputManager').length;i<length;i++){
                            $('.nutOutputManager-del').addClass('i++');
                        }
                        //再次添加果仁地址
                        $('.nutOutputManager-add').click(function(){
                            $('.nut-one').show();
                            $('.nut-two').hide();
                        }); 
//                        window.location.href='withdraw.html?id=rmbtx';                        
                        
                    } else {
                    	alert(data.msg);
                    	console.log(data);
                    }
                });
            }            
        });        
        
        //接受跳转参数
        $(function(){
            function getQueryString(name) {
                href = decodeURIComponent(location.href);
                // 如果链接没有参数，或者链接中不存在我们要获取的参数，直接返回空
                if (href.indexOf("?") == -1
                        || href.indexOf(name + '=') == -1) {
                    return '';
                }
                // 获取链接中参数部分
                var queryString = href.substring(href.indexOf("?") + 1);
                // 分离参数对 ?key=value&key2=value2
                var parameters = queryString.split("&");
                var pos, paraName, paraValue;
                for ( var i = 0; i < parameters.length; i++) {
                    // 获取等号位置
                    pos = parameters[i].indexOf('=');
                    if (pos == -1) {
                        continue;
                    }
                    // 获取name 和 value
                    paraName = parameters[i].substring(0, pos);
                    paraValue = parameters[i].substring(pos + 1);
                    // 如果查询的name等于当前name，就返回当前值，同时，将链接中的+号还原成空格
                    if (paraName == name) {
                        return unescape(paraValue.replace(/\+/g, " "));
                    }
                }
                return '';
            };

            var b = getQueryString("id");
            //console.log(b);
            if(b){
                $('.rmbtx').addClass('bottomon');
                $('.rmbxh').removeClass('bottomon');
                $('.recharge').hide();
                $('.withdraw_deposit').show();
                $('.nut-two').hide();
            }
            
        })

    //判断是否有银行卡
    api_mkt.bankList({  
        'pageNo':1,
        'pageSize' :10  
    }, function(data) {
        if (data.status == 200) {
            for(var i=0;i<data.data.list.length;i++){
                var name = data.data.list[i].name;
                var num = data.data.list[i].acnumber;  //银行卡号
                var bankName = data.data.list[i].bank;  //所属银行
                var bankIP = data.data.list[i].province + data.data.list[i].city + data.data.list[i].subbank;  //支行
                
                var node = $('<div></div>').addClass('bankIdCard addBankCard newCard');
                var nodeList =$('<section class="bankIdCard-bankLogoName bankName">'+bankName+'</section>'+
                                '<section class="bankIdCard-Code">'+'尾号：'+num.substr(num.length-4)+'</section>'+            
                                '<section class="bankIdCard-CardAndBg">储蓄卡</section>'+
                                '<section class="bankIdCard-hr"></section>'+
                                '<section class="bankIdCard-Name">'+name+'</section>'+
                                '<section class="bankIdCard-del" data-cardId="'+num+'">删除</section>'+
                                '<section class="bankIdCard-address">'+bankIP+'</section>').appendTo(node);
                node.insertBefore($('.bankIdCard-add'));
                //判断显示银行logo
                $('.bankName').filter(":contains('中国工商银行')").addClass('ICBC').text('');
                $('.bankName').filter(":contains('中国建设银行')").addClass('CBC').text('');
                $('.bankName').filter(":contains('交通银行')").addClass('BC').text('');
                $('.bankName').filter(":contains('招商银行')").addClass('CMB').text('');
                $('.bankName').filter(":contains('中国邮政储蓄银行')").addClass('PSBC').text('');
                $('.bankName').filter(":contains('中国农业银行')").addClass('ABC').text('');
            }          

            //删除银行卡
            $('.bankIdCard-del').click(function(){
                api_mkt.rmbWithdrawalsManageDel({          
                    'bankId':$(this).attr('data-cardId')
                }, function(data) {
                    if (data.status == 200) {
                        window.location.reload();
                    } else {
                    }
                });
            });
        } else {
        }
    });

	
});