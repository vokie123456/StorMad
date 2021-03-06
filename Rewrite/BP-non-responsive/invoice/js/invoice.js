$(function() {

    //初始化
    var pageNo = 1;
    var yearMonth = "";
    var money = "";
    var status = "";

    get_status();

    list(pageNo, yearMonth, money, status);

    //表达验证与提交
    layui.use('form', function() {
        var form = layui.form();

        //搜索表单提交
        form.on('submit(search)', function(data) {
            var val = data.field;
            var yearMonth = "";

            list(1, val.yearMonth, val.money, val.status);
            return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
        });
    });

});

/*获取发票审核状态*/
function get_status() {
    url = yonghui.contextPath + "/api/invoice/query.jsp";

    $.post(url, { op: 1 }, function(data) {
        if (data.errCode == 0) {
            var val = data.obj;

            for (var key in val) {
                $("#status").append("<option value=" + key + ">" + val[key] + "</option>");
            }

            layui.use('form', function() {
                var form = layui.form();
                form.render('select');
            });
        } else {
            layer.alert(data.errMsg);
            return false
        }
    });
}

function list(pageNo, yearMonth, money, status) {
    //分页模块
    layui.use('laypage', function() {
        var laypage = layui.laypage

        var req = { pageNo: pageNo, pageSize: yonghui.pageSize, yearMonth: yearMonth, money: money, status: status };

        //初始化分页参数
        $.post(yonghui.contextPath + "/api/invoice/query.jsp", req, function(data) {

            if (data.errCode == 0) {
                val = data.obj;

                laypage({
                    cont: 'pageNumber',
                    groups: yonghui.groups,
                    pages: val.pageCount,
                    skip: true,
                    jump: function(obj, first) {
                        if (first) {
                            get_info(val);
                        } else {
                            query(obj.curr);
                        }
                    }
                });
                $(".no_info").hide();
                $(".show_info").show();
            } else {
                $(".no_info").show();
                $(".show_info").hide();
                // layer.alert(data.errMg)
            }
        });
    });
}

//关闭详情窗口
$('body').on('click', '.close-status-info', function() {
    layer.closeAll('page');
})

//发票申请审核状态 
function show_invoice(id) {
    layer.open({
        type: 1,
        area: ['680px', 'auto'],
        //offset: 'rb', //弹窗右下角
        title: false, //隐藏默认标题
        title: ['发票申请审核状态', 'color:#666;font-size:14px;font-weight:bold;'], //自定义标题
        shadeClose: true, //点击遮罩关闭
        content: $('#invoiceCheck')
    });

    layui.use('laydate', function() {
        var laydate = layui.laydate;

        var status_txt = '';
        var status_tips = '';

        var url = yonghui.contextPath + '/api/invoice/findById.jsp';

        $.post(url, { ivId: id }, function(data) {
            var val = data.obj;
            /*时间格式转换*/
            var myAccPeriod = new Date(Number(val.acctPeriod));
            var myApplyTime = new Date(Number(val.applyTime));
            myAccPeriod = myAccPeriod.format('yyyy年MM月dd日 hh:mm:ss');
            myApplyTime = myApplyTime.format('yyyy年MM月dd日 hh:mm:ss');

            $("#inv_acctperiod").html(myAccPeriod);
            $("#inv_title").html(val.title);
            $("#inv_money").html('￥' + ((val.money) / 100).toFixed(2) + '元');
            $("#inv_corporation").html(val.corporation);
            $("#inv_applytime").html(myApplyTime);
            if (val.status == 0) {
                status_txt = '审核中(.•˘_˘•.)...';
                status_tips = '（提示：预计在3个工作日内审核完毕）';
            }
            if (val.status == 10) {
                status_txt = '审核不通过(┬＿┬)';
                // status_tips = '（提示：您的发票申请已撤销，请根据实际需求再次提交申请）';
                status_tips = '（提示：请您联系客服:0591-86290888）';

            }
            if (val.status == 20) {
                status_txt = '审核通过╰(￣▽￣)╮';
                status_tips = '（提示：发票将于5个工作日内寄出，请留意快递信息）';
            }

            $("#status_txt").html(status_txt);
            $("#status_tips").html(status_tips);
        })
    })
}

/*  分页查询数据*/
var val;

function get_info(data) {
    layui.use('laydate', function() {
        var laydate = layui.laydate;

        val = data.record;

        var htm = "";

        if (val.length > 0) {
            for (var i = 0; i < val.length; i++) {
                var statusarr = val[i].status.split(",");
                var statuscode = statusarr[0];
                var statusname = statusarr[1];

                htm += '<tr>';

                htm += '<td>' + laydate.now(val[i].applyTime, "YYYY-MM-DD hh:mm:ss") + '</td>';

                htm += '<td>' + val[i].title + '</td><td>' + val[i].invoiceNo + '</td><td>￥' + ((val[i].money) / 100).toFixed(2) + '</td>';

                htm += '<td>' + statusname + '</td><td>' + val[i].expressNo + '</td>';

                htm += '<td><a class="invoice-Check" href="javascript:void(0)" onclick="show_invoice(' + val[i].ivId + ',' + statuscode + ')">查看</a>';

                if (statuscode == 0) {
                    htm += '<a class="invoice-Cancel" href="javascript:void(0)" onclick="cancel_invoice(' + val[i].ivId + ')">撤销</a>';
                }

                htm += '</td></tr>';
            }

            $("#invoice_info").html(htm);

            $(".no_info").hide();
            $(".show_info").show();
        } else {
            $(".no_info").show();
            $(".show_info").hide();
        }
    });
}

function query(pageNo, yearMonth, money, status) {

    var req = { pageNo: pageNo, pageSize: yonghui.pageSize, yearMonth: yearMonth, money: money, status: status };

    $.post(yonghui.contextPath + "/api/invoice/query.jsp", req, function(data) {
        if (data.errCode == 0) {
            get_info(data.obj);
        } else {
            layer.alert('查询列表失败!\r\n' + data.errMsg);
        }
    });
};

/*获取url参数*/
function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}

/*发票撤销*/
function cancel_invoice(ivId) {
    var cancelPop = layer.open({
        type: 1,
        area: ['680px', 'auto'],
        //offset: 'rb', //弹窗右下角
        title: false, //隐藏默认标题
        title: ['发票申请审核状态', 'color:#666;font-size:14px;font-weight:bold;'], //自定义标题
        shadeClose: true, //点击遮罩关闭
        content: $('#invoiceCancel')
    });
    /*取消撤销*/
    $('#btn-cancel').click(function() {
        parent.layer.close(cancelPop);
    });
    /*确定撤销*/
    $('#btn-submit').click(function() {
        console.log(ivId);
        $.ajax({
            type: 'POST',
            url: yonghui.contextPath + '/api/invoice/cancel.jsp',
            data: { 'ivId': ivId },
            dataType: 'json',
            success: function(data) {
                if (data.errCode == 0) {
                    parent.layer.close(cancelPop);
                } else {
                    parent.layer.close(cancelPop);
                    layer.alert(data.errMsg);
                }
            },
            error: function(data) {
                console.log("失败");
            }
        });
    });
}
