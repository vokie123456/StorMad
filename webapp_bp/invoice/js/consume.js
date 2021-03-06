$(function() {

    //初始化
    var pageNo = 1;
    var bpName = "";
    var yearMonth = "";
    var invoiceStatus = "";
    var iid = "";

    get_industry();

    list(pageNo, bpName, yearMonth, invoiceStatus, iid);

    //表达验证与提交
    layui.use('form', function() {
        var form = layui.form();

        //搜索表单提交
        form.on('submit(search)', function(data) {
            var val = data.field;
            var yearMonth = "";

            list(1, val.bpName, val.yearMonth, val.invoiceStatus, val.iid)

            return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
        });
    });
    //回车触发搜索
    /*$(".btn-bpName").keyup(function() {
        if (event.which == 13) {
            $(".search-btn").trigger("click");
        }
    });*/

    getStore();
    exportData();
});

//获取行业信息
function get_industry() {
    url = yonghui.contextPath + '/api/common/getAllIndustry.jsp';

    $.post(url, function(data) {
        var htm = '';

        if (data.errCode == 0) {
            var val = data.obj;

            for (var i = 0; i < val.length; i++) {
                $("#industry_list").append('<option value="' + val[i].iid + '">' + val[i].iname + '</option>');
            }

            layui.use('form', function() {
                var form = layui.form();
                form.render('select');
            });
        } else {
            layer.alert(data.errMsg);
        }
    })
}

function list(pageNo, bpName, yearMonth, invoiceStatus, iid) {
    //分页模块
    layui.use('laypage', function() {
        var laypage = layui.laypage

        var req = { pageNo: pageNo, pageSize: yonghui.pageSize, bpName: bpName, yearMonth: yearMonth, invoiceStatus: invoiceStatus, iid: iid };

        //初始化分页参数
        $.post(yonghui.contextPath + "/api/invoice/queryPayList.jsp", req, function(data) {

            if (data.errCode == 0) {
                val = data.obj.page;
                $("#balance").text(((data.obj.balance) / 100).toFixed(2));

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
            } else {
                layer.alert(data.errMsg)
            }
        });
    });
}

/*  分页查询数据*/
function get_info(data) {
    layui.use('laydate', function() {
        var laydate = layui.laydate;

        var val = data.record;
        var htm = "";

        if (val.length > 0) {

            for (var i = 0; i < val.length; i++) {
                /*时间戳格式转换*/
                var myCrtTime = new Date(Number(val[i].crtTime));
                myCrtTime = myCrtTime.format('yyyy年MM月dd日 hh:mm:ss');
                htm += '<tr>';

                htm += '<td class="crt-time">' + myCrtTime + '</td><td>' + val[i].bpName + '</td><td>' + val[i].industryName + '</td><td>￥' + ((val[i].cash + val[i].goods) / 100).toFixed(2) + '</td>';

                htm += '<td class="cash">￥' + ((val[i].cash) / 100).toFixed(2) + '</td><td>' + val[i].invoiceStatusCN + '</td>';
                console.log(val[i].invoiceStatus == '1' || val[i].cash == '0');

                if (val[i].invoiceStatus == '0') {
                    if (val[i].cash == '0') {
                        // 可开票金额为0，不可点击
                        hrefFlag='javascript:void(0)';
                        disabledFlag = 'disabled="disabled"';
                        stylecss = 'style="background-color:#ccc;border:1px solid #ccc;';
                    } else {
                        hrefFlag='account-shipping-address.html';
                        disabledFlag = '';
                        stylecss = '';
                    }
                }
                if (val[i].invoiceStatus == '1') {
                    hrefFlag='javascript:void(0)';
                    disabledFlag = 'disabled="disabled"';
                    stylecss = 'style="background-color:#ccc;border:1px solid #ccc;';
                }
                htm += '<td><a href="'+hrefFlag+'" type="button" class="btn btn-default btn-apply" ba-id="' + val[i].baId + '" btn-index="' + i + '" ' + disabledFlag + stylecss + ' ">申请发票</a></td>';
                htm += '</tr>';
            }

            $("#consume_info").html(htm);

            $(".no_info").hide();
            $(".show_info").show();
        } else {
            $("#consume_info").html('');
            $(".no_info").show();
            $(".show_info").hide();
        }
    });
}

function query(pageNo, bpName, yearMonth, invoiceStatus, iid) {
    var curyearMonth = $('.btn-yearMonth').val();
    var curinvoiceStatus = $('.btn-invoiceStatus .layui-this').attr('lay-value');
    var curbpName = $('.btn-bpName').val();
    var curiid = $('.btn-iid .layui-this').attr('lay-value');

    var req = { pageNo: pageNo, pageSize: yonghui.pageSize, bpName: curbpName, yearMonth: curyearMonth, invoiceStatus: curinvoiceStatus, iid: curiid };
    $.post(yonghui.contextPath + "/api/invoice/queryPayList.jsp", req, function(data) {
        if (data.errCode == 0) {
            get_info(data.obj.page);
        } else {
            layer.alert('查询列表失败!\r\n' + data.errMsg);
        }
    });
};


/*存储申请发票的相关信息*/
function getStore() {
    $('.table').on('click', '.btn-apply', function() {
        var baId = $(this).attr('ba-id');
        var crtTime = $(this).parent().siblings('.crt-time').html();
        var cash = $(this).parent().siblings('.cash').html();
        sessionStorage.setItem("baId", baId);
        sessionStorage.setItem("crtTime", crtTime);
        sessionStorage.setItem("cash", cash);
    });
};

/*导出充值记录*/
function exportData() {
    $('.btn-export').click(function() {
        var expyearMonth = $('.btn-yearMonth').val();
        var expinvoiceStatus = $('.btn-invoiceStatus .layui-this').attr('lay-value');
        var expbpName = $('.btn-bpName').val();
        var expiid = $('.btn-iid .layui-this').attr('lay-value');
        window.location.href = yonghui.contextPath + '/api/money/exportPay.jsp?yearMonth=' + expyearMonth + '&invoiceStatus=' + expinvoiceStatus + '&bpName=' + expbpName + '&iid=' + expiid;
    });
}
