/*获得账户名称和余额*/
var acctName, balance;

function getBalance() {
    $.ajax({
        type: 'POST',
        url: yonghui.contextPath + '/api/money/getBalance.jsp',
        data: '',
        dataType: 'json',
        success: function(data) {
            if (data.errCode == 0) {
                getUser(data);
            }
        },
        error: function(data) {
            console.log("失败");
        }
    });
}

function getUser(data) {
    var data = eval(data.obj);
    acctName = data.acctName;
    balance = (data.balance / 100).toFixed(2);
    $('.info .name').html(acctName);
    $('.info .balance').html("￥" + balance);
    /*充值成功后的账户余额*/
    $('.account .recharge-ok .balance').html('￥' + (balance * 1).toFixed(2));
}
/*金额输入框限制两位小数验证*/
function moneyTest() {
    $(".money").keyup(function() {
        var moneyTest = $(".money").val();
        if (moneyTest.toString().indexOf(".") == -1 || moneyTest.toString().indexOf(".") == null) {
            return;
        }
        moneyTest = moneyTest.toString().substring(0, moneyTest.toString().indexOf(".") + 3);
        $(".money").val(moneyTest);
    })
}
/*点击下一步按钮，跳转*/
var money, mode;
var tradeno, wxUrl, dsno;
$('.btn-next').click(function() {
    money = $('.money').val();
    /*if (money >= 1000 && money <= 100000) {
        $('.account .option p').removeClass('error-tip');
        if ($('#pay-wechat').is(':checked') == true) {
            mode = '100';
        } else if ($('#pay-ali').is(':checked') == true) {
            mode = '200';
        } else {
            mode = '300';
        }
        payWay();
    } else if(money==""){
        layer.msg("请输入充值金额");
    }else {
        $('.account .option p').addClass('error-tip');
    }*/
    /*微信测试*/
    if (money == "") {
        layer.msg("请输入充值金额");
    } else {
        $('.account .option p').removeClass('error-tip');
        if ($('#pay-wechat').is(':checked') == true) {
            mode = '100';
        } else if ($('#pay-ali').is(':checked') == true) {
            mode = '200';
        } else {
            mode = '300';
        }
    }
    payWay();
});

/*获得充值单号，判断充值方式，并跳转*/

function payWay() {
    $.ajax({
        type: 'POST',
        url: yonghui.contextPath + '/api/money/recharge.jsp',
        data: { 'money': money, 'mode': mode },
        dataType: 'json',
        success: function(data) {
            if (data.errCode == 0) {
                tradeno = data.obj;
                dsno = data.obj;
                storeVal();
                if (mode == '100') {
                    window.open('http://testbp.stormad.cn/invoice/account-wechat-pay.html');
                } else if (mode == '200') {
                    window.open('http://testbp.stormad.cn/alipay/deposit/deposit.jsp?tradeno=' + tradeno);
                } else if (mode == '300') {
                    window.open('http://testbp.stormad.cn/unionpay/deposit/deposit.jsp?tradeno=' + tradeno);
                }
            }
        },
        error: function(data) {
            console.log("失败");
        }
    });
}
/*判断微信支付状态*/
var finishTime, name, status;

function judgeState() {
    $.ajax({
        type: 'POST',
        url: yonghui.contextPath + '/api/money/getDepositStatus.jsp',
        data: { 'dsno': dsno },
        dataType: 'json',
        success: function(data) {
            if (data.errCode == 0) {
                var data = data.obj;
                finishTime = data.finishTime;
                name = data.name;
                // alert(status);
                status = data.status;
                console.log(status);
                if (name=="支付完成") {
                    window.location.href = "http://testbp.stormad.cn/invoice/account-pay-status.html";
                    sessionStorage.setItem('finishTime', finishTime);
                    sessionStorage.setItem('status', status);
                    sessionStorage.setItem('from', 'account-wechat-pay');
                } else if(name=="未支付完成"){
                    console.log('未支付完成');
                }
            }
        },
        error: function(data) {
            console.log("失败");
        }
    });
}
/*存储参数*/
function storeVal() {
    wxUrl = 'http://testbp.stormad.cn/wxpay/qrcode/deposit.jsp?tradeno=' + tradeno + '&width=180&height=180';
    sessionStorage.setItem("tradeno", tradeno);
    sessionStorage.setItem("money", money);
    sessionStorage.setItem("wxUrl", wxUrl);
    sessionStorage.setItem("acctName", acctName);
    sessionStorage.setItem("balance", balance);
}
/*判断是否从状态页中跳转--充值成功时间*/
function judgeFromState() {
    var fromState = sessionStorage.getItem("fromState");
    if (fromState == "fromPayState") {
        sessionStorage.setItem('status', 0);
    }
}

$(document).ready(function() {
    moneyTest();
    getBalance();
});
