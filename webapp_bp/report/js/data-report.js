$(function() {

    //初始化
    var pageNo = 1;

    var reportDate = "";
    var bpName = "";
    var iName = "";
    var adTitle = "";

    //初始化报表数据
    var reportDateArr = [];
    var clickRateArr = [];
    var seriesadTitle = '';
    var showeprCount = [];
    var showclickCount = [];

    /*明细参数*/
    var bpId, iId, alId, adId, bpId0, iId0, alId0, adId0;

    list(pageNo, reportDate, bpName, iName, adTitle);

    //表达验证与提交
    layui.use('form', function() {
        var form = layui.form();

        //搜索表单提交
        form.on('submit(search)', function(data) {
            var val = data.field;
            var bpName = "";
            var iName = "";
            var adTitle = "";

            list(1, val.reportDate, val.bpName, val.iName, val.adTitle)

            return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
        });
    });
    //回车触发搜索
   /* $(".btn-bpName,.btn-iName,.btn-adTitle").keyup(function() {
        if (event.which == 13) {
            $(".search-btn").trigger("click");
        }
    });*/
    dataDetail();

    /*选择展示的档期报表*/
    $('.show_info').on('click', '.btn-radio', function() {
        bpId = $(this).attr('data-bpId');
        iId = $(this).attr('data-iId');
        alId = $(this).attr('data-alId');
        adId = $(this).attr('data-adId');
        getDetail(bpId, iId, alId, adId);

    });

    /*导出报表数据*/
    exportData();
});

/*查看明细展示*/
function dataDetail() {
    $('.show_info').on('click', 'button.data-Detail', function() {
        var detail = layer.open({
            type: 1,
            area: ['900px', 'auto'],
            title: ['广告投放明细', 'color:#666;font-size:14px;font-weight:bold;'], //自定义标题
            shadeClose: true, //点击遮罩关闭
            content: $('#dataDetail')
        });
        $('.btn-know').on('click', function() {
            parent.layer.close(detail);
        });
        bpId = $(this).attr('data-bpId');
        iId = $(this).attr('data-iId');
        alId = $(this).attr('data-alId');
        adId = $(this).attr('data-adId');

        getDetailList(bpId, iId, alId, adId);
    });

}

/*查看明细*/
function getDetailList(bpId, iId, alId, adId) {
    $.ajax({
        type: 'POST',
        url: yonghui.contextPath + '/api/report/getAdReportDetail.jsp',
        data: { 'bpId': bpId, 'iId': iId, 'alId': alId, 'adId': adId },
        dataType: 'json',
        success: function(data) {
            if (data.errCode == 0) {
                var val = data.obj;
                var htm = '';
                if (val.datas.length > 0) {
                    for (var i = 0; i < val.datas.length; i++) {
                        var clickRate = val.datas[i].clickRate;
                        htm += '<tr>';
                        htm += '<td>' + val.datas[i].reportDate + '</td><td>' + val.adTitle + '</td><td>' + val.datas[i].clickCount + '</td><td>' + val.datas[i].eprCount + '</td><td>' + (parseInt(clickRate) == clickRate ? clickRate : clickRate.toFixed(2)) + '%' + '</td>'
                    }
                    $('#detail_info').html(htm);
                }

            }
            if (data.errCode == -10000) {
                layer.open({
                    skin: 'loginTip',
                    content: '您尚未登录系统，不能进行操作！',
                    btn: '我知道了',
                    yes: function(index, layero) {
                        window.location.href = '../../ader/login.html';
                    },
                    cancel: function() {
                        window.location.href = '../../ader/login.html';
                    }
                })
            }
        },
        error: function(data) {
            console.log("失败");
        }
    });
}

function list(pageNo, reportDate, bpName, iName, adTitle) {
    //分页模块
    layui.use('laypage', function() {
        var laypage = layui.laypage
        var req = { pageNo: pageNo, pageSize: yonghui.pageSize, reportDate: reportDate, bpName: bpName, iName: iName, adTitle: adTitle };
        //初始化分页参数
        $.post(yonghui.contextPath + "/api/report/findAdReportPage.jsp", req, function(data) {

            if (data.errCode == 0) {
                val = data.obj;

                laypage({
                    cont: 'pageNumber',
                    groups: yonghui.groups,
                    pages: val.pageCount,
                    skip: true,
                    jump: function(obj, first) {
                        if (first) {
                            get_info(data);
                        } else {
                            query(obj.curr);
                        }
                    }
                });
            } else if (data.errCode == -10000) {
                layer.open({
                    skin: 'loginTip',
                    content: '您尚未登录系统，不能进行操作！',
                    btn: '我知道了',
                    yes: function(index, layero) {
                        window.location.href = '../../ader/login.html';
                    },
                    cancel: function() {
                        window.location.href = '../../ader/login.html';
                    }
                })
            } else {
                layer.alert(data.errMsg)
            }
        });
    });
}

function get_info(data) {
    layui.use('laydate', function() {
        var laydate = layui.laydate;

        var val = data.obj.record;

        var htm = "";

        if (val.length > 0) {

            for (var i = 0; i < val.length; i++) {
                /*时间戳格式转换*/
                var bpStartTime = new Date(Number(val[i].bpStartTime));
                bpStartTime = bpStartTime.format('yyyy-MM-dd');
                var bpEndTime = new Date(Number(val[i].bpEndTime));
                bpEndTime = bpEndTime.format('yyyy-MM-dd');
                var clickRate = val[i].clickRate;

                bpId0 = val[0].bpId;
                iId0 = val[0].iid;
                alId0 = val[0].alId;
                adId0 = val[0].adId;


                htm += '<tr>';

                htm += '<td> <div class="checkbox"> <label class="btn-radio" data-bpId=' + val[i].bpId + ' data-iId=' + val[i].iid + ' data-alId=' + val[i].alId + ' data-adId=' + val[i].adId + '> <span class="checkbox"><input name="btnSelect" id="btn-select_' + i + '" type="radio"><i></i> </span> </label> </div> </td>';

                htm += '<td>' + val[i].bpName + '</td><td>' + bpStartTime + '至 <span id="today">' + bpEndTime + '</span></td><td>' + val[i].iname + '</td><td>' + val[i].alName + '</td><td>' + val[i].adTitle + '</td><td>' + val[i].clickCount + '</td><td>' + val[i].eprCount + '</td><td>' + (parseInt(clickRate) == clickRate ? clickRate : clickRate.toFixed(2)) + '%' + '</td><td><button type="button" class="btn btn-default data-Detail" data-bpId=' + val[i].bpId + ' data-iId=' + val[i].iid + ' data-alId=' + val[i].alId + ' data-adId=' + val[i].adId + '>查看明细</button></td>';

                htm += '</tr>';
            }

            $("#log_info").html(htm);
            /*页面默认展示列表*/
            getDetail(bpId0, iId0, alId0, adId0);
            $('#btn-select_0').attr('checked', 'checked');
            $(".no_info").hide();
            $(".show_info").show();
        } else {
            $(".no_info").show();
            $(".show_info").hide();
        }
    });
}

/*点击展示报表*/
function getDetail(bpId, iId, alId, adId) {
    $.ajax({
        type: 'POST',
        url: yonghui.contextPath + '/api/report/getAdReportDetail.jsp',
        data: { 'bpId': bpId, 'iId': iId, 'alId': alId, 'adId': adId },
        dataType: 'json',
        success: function(data) {
            if (data.errCode == 0) {
                var val = data.obj;
                var htm = '';
                var bpStartTime, bpEndTime;
                //初始化数组
                showeprCount = [];
                showclickCount = [];
                reportDateArr = [];
                clickRateArr = [];
                if (val.datas.length > 0) {
                    for (var i = 0; i < val.datas.length; i++) {
                        seriesadTitle = val.adTitle;
                        showeprCount.push(val.datas[i].eprCount);
                        showclickCount.push(val.datas[i].clickCount);
                        reportDateArr.push(val.datas[i].reportDate);
                        clickRateArr.push(val.datas[i].clickRate);
                    }
                    showCharts(data);
                }
            }
            if (data.errCode == -10000) {
                layer.open({
                    skin: 'loginTip',
                    content: '您尚未登录系统，不能进行操作！',
                    btn: '我知道了',
                    yes: function(index, layero) {
                        window.location.href = '../../ader/login.html';
                    },
                    cancel: function() {
                        window.location.href = '../../ader/login.html';
                    }
                })
            }
        },
        error: function(data) {
            console.log("失败");
        }
    });
}

function query(pageNo, opTime, content) {
    var curreportDate = $('.btn-reportDate').val();
    var curbpName = $('.btn-bpName').val();
    var curiName = $('.btn-iName').val();
    var curadTitle = $('.btn-adTitle').val();
    var req = { pageNo: pageNo, pageSize: yonghui.pageSize, reportDate: curreportDate, bpName: curbpName, iName: curiName, adTitle: curadTitle };
    $.post(yonghui.contextPath + "/api/report/findAdReportPage.jsp", req, function(data) {
        if (data.errCode == 0) {
            get_info(data);
        } else {
            layer.alert('查询列表失败!\r\n' + data.errMsg);
        }
    });
};

/*报表展示*/
function showCharts(data) {
    Highcharts.setOptions({
        colors: ['#705758']
    });
    $('#container').highcharts({
        /*chart: {
            borderColor: '#e6614f',
            borderWidth: 1,
            type: 'line'
        },*/
        title: {
            text: '广告投放效果趋势图',
            align: 'left',
            style: {
                color: '#664545',
                fontWeight: 'bold',
                fontSize: 14
            },
            floating: false,
            x: 20,
            y: 10,
        },
        subtitle: {
            text: '日期：点击率（点击量/展现量）',
            align: 'left',
            style: {
                color: '#e6614f',
                fontSize: 12
            },
            floating: false,
            x: 180,
            y: 10,
        },
        xAxis: {
            title: {
                text: '日期',
            },
            labels: {
                align: 'center'
            },
            categories: reportDateArr
        },
        yAxis: {
            title: {
                text: '点击率（%）',
            },
            plotLines: [{
                value: 0,
                width: 1,
                color: '#808080'
            }]
        },
        tooltip: {
            backgroundColor: '#e6614f',
            borderColor: '#c74545',
            borderRadius: 3,
            valueSuffix: '%',
            shadow: false,
            style: {
                color: '#fff',
                fontSize: '12px',
                padding: '8px'
            },
            formatter: function() {
                var i = this.point.index;
                return this.x + '：' + this.y + '%' + '（' + showclickCount[i] + '/' + showeprCount[i] + '）';
            }
        },
        legend: {
            style: {
                color: '#664545',
                fontSize: 14
            },
            layout: 'vertical',
            align: 'center',
            verticalAlign: 'top',
            x: 0,
            y: 10
        },
        plotOptions: {
            series: {
                events: {
                    legendItemClick: function(event) {
                        return false;
                    }
                }
            }
        },
        series: [{
            name: seriesadTitle,
            data: clickRateArr
        }]
    });
}

/*导出报表数据*/
function exportData() {
    $('.btn-export').click(function() {
        var expreportDate = $('.btn-reportDate').val();
        var expbpName = $('.btn-bpName').val();
        var expiName = $('.btn-iName').val();
        var expadTitle = $('.btn-adTitle').val();
        window.location.href = yonghui.contextPath + "/api/report/exportAdReportExcel.jsp?reportDate="+expreportDate+'&bpName='+expbpName+'&iName'+expiName+'&adTitle='+expadTitle;
    });
}
