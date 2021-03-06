/**
 *
 */

$(function() {
    //获取广告规格
    get_spec_type();

    //获取广告状态
    get_ad_status();

    //初始化全局变量
    var pageNo = 1;
    var adType = '';
    var aderName = '';
    var status = '';

    //初始化数据
    list(pageNo, adType, aderName, status);

    //表达验证与提交
    layui.use('form', function() {
        var form = layui.form();
        form.render('select');

        //提交审核通过数据
        form.on('submit(sub_audit)', function(data) {
            var val = data.field;
            var url = yonghui.contextPath + '/api/ad/adinfo/updateAdStatus.jsp';

            $.ajax({
                type: 'POST',
                url: url,
                data: { 'adId': val.sub_ad_id, 'adStatus': 10 },
                dataType: 'json',
                success: function(data) {
                    if (data.errCode == 0) {
                        layer.msg("操作成功");
                        location.reload();
                    } else {
                        layer.alert(data.errMsg);
                    }
                },
                error: function(data) {
                    layer.alert('操作异常');
                    layer.closeAll('page');
                }
            });

            return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
        });


        //提交审核不通过数据
        form.on('submit(sub_audit_no)', function(data) {
            var val = data.field;
            var url = yonghui.contextPath + '/api/ad/adinfo/updateAdStatus.jsp';

            $.ajax({
                type: 'POST',
                url: url,
                data: { 'adId': val.sub_ad_id, 'adStatus': 20 },
                dataType: 'json',
                success: function(data) {
                    if (data.errCode == 0) {
                        layer.msg("操作成功");
                        location.reload();
                    } else {
                        layer.alert(data.errMsg);
                    }
                },
                error: function(data) {
                    layer.alert('操作异常');
                    layer.closeAll('page');
                }
            });

            return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
        });

        //搜索表单提交
        form.on('submit(serach)', function(data) {
            var val = data.field;

            list(1, val.spec_type, val.ader_name, val.ad_status)

            return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
        });
    });

});

//关闭窗口
$("#back_list").on('click', function() {
    layer.closeAll('page');
});

//改变广告状态
function audit_status(id, stauts) {
    var url = yonghui.contextPath + '/api/ad/adinfo/updateAdStatus.jsp';

    $.ajax({
        type: 'POST',
        url: url,
        data: { 'adId': id, 'adStatus': stauts },
        dataType: 'json',
        success: function(data) {
            if (data.errCode == 0) {
                layer.msg("操作成功");
                if (stauts == 100) {
                    $("#ad_status_name_" + id).html("已启用");
                    $("#auditact_" + id).text("停用");
                    $("#auditact_" + id).attr('onclick', 'audit_status(' + id + ',101)');
                }
                if (stauts == 101) {
                    $("#ad_status_name_" + id).html("已停用");
                    $("#auditact_" + id).text("启动");
                    $("#auditact_" + id).attr('onclick', 'audit_status(' + id + ',100)');
                }
            } else {
                layer.alert(data.errMsg);
            }
        },
        error: function(data) {
            layer.alert('操作异常');
            layer.closeAll('page');
        }
    });
}

//获取列表
function list(pageNo, adType, aderName, status) {
    //分页模块
    layui.use('laypage', function() {
        var laypage = layui.laypage,
            layer = layui.layer;

        var redata = { pageNo: pageNo, pageSize: yonghui.pageSize, adType: adType, aderName: aderName, status: status };

        //初始化分页参数
        $.post(yonghui.contextPath + "/api/ad/adinfo/findAdInfoPage.jsp", redata, function(data) {
            val = data.obj;

            laypage({
                cont: 'pageNumber',
                groups: yonghui.groups,
                skip: true,
                pages: val.pageCount,
                jump: function(obj, first) {
                    if (first) {
                        get_info(val);
                    } else {
                        query(obj.curr, adType, aderName, status);
                    }
                }
            });
        });
    });
}

/*获取广告状态*/
function get_ad_status() {
    $.ajax({
        type: 'POST',
        url: yonghui.contextPath + "/api/ad/adinfo/getAllAdStatus.jsp",
        dataType: 'json',
        success: function(data) {
            if (data.errCode == 0) {
                var val = data.obj;

                if (val.length > 0) {
                    for (var i = 0; i < val.length; i++) {
                        $("#ad_status").append("<option value=" + val[i].first + ">" + val[i].second + "</option>");
                    }
                }

                layui.use('form', function() {
                    var form = layui.form();
                    form.render('select');
                });
            } else {
                layer.alert(data.errMsg);
                return false
            }
        },
        error: function(data) {
            layer.alert('广告状态获取异常');
        }
    });
}

/*获取广告规格类型*/
function get_spec_type() {
    $.ajax({
        type: 'POST',
        url: yonghui.contextPath + "/api/ad/getAllAdType.jsp",
        dataType: 'json',
        success: function(data) {
            if (data.errCode == 0) {
                var val = data.obj;

                if (val.length > 0) {
                    for (var i = 0; i < val.length; i++) {
                        $("#spec_type").append("<option value=" + val[i].first + ">" + val[i].second + "</option>");
                    }
                }

                layui.use('form', function() {
                    var form = layui.form();
                    form.render('select');
                });
            } else {
                layer.alert(data.errMsg);
                return false
            }
        },
        error: function(data) {
            layer.alert('广告类型获取异常');
        }
    });
}

//弹出广告预览
$("body").on('click', '.show_view', function() {

    var adtype = $(this).attr('adtype');
    var link = $(this).attr('link');
    var content = $(this).attr('content');
    var imgUrl = $(this).data('imgurl');
    var height = 'auto';

    if (adtype == 1) {
        // height='440px';
        $("#view_title").hide();
        $("#view_img").show().attr("href", link);
        $("#view_img").find('img').attr("src", imgUrl);
    } else if (adtype == 2) {
        $("#view_img").hide();
        $("#view_title").show().html('<a href="javascript:void(0)">' + content + '</a>');
    } else if (adtype == 3) {
        $("#view_img").hide();
        $("#view_title").show().html('<a href="'+link+'" target="_blank">' + content + '</a>');
    } else if (adtype == 4) {
        $("#view_img").show().attr("href", link).children('img').attr('max-height', '380px');;
        $("#view_img").find('img').attr("src", imgUrl);
        $("#view_title").show().html('<a href="' + link + '" target="_blank">' + content + '</a>');
    }

    layer.open({
        type: 1,
        area: ['auto', height],
        title: false, //隐藏默认标题
        shadeClose: true, //点击遮罩关闭
        closeBtn: 1,
        content: $('#adPreview')
    });
})


/*  分页查询数据*/
function get_info(data) {
    var val = data.record;

    var htm = "";

    if (val.length > 0) {

        for (var i = 0; i < val.length; i++) {
            htm += '<tr>';

            //格式化规格
            var adSizeobj = val[i].adSize;
            var adTypeobj = adSizeobj.adType.split(",");
            var adtype = adTypeobj[0];
            var adtypename = adTypeobj[1];

            //格式化审核状态
            var adStatusobj = val[i].adStatus.split(",");
            var adStatusid = adStatusobj[0];
            var adStatusname = adStatusobj[1];

            htm += '<td>' + val[i].adId + '</td><td><p><span>' + val[i].title + '</span><i class="ad-preview-icon show_view" adtype="' + adtype + '" content="' + val[i].content + '" link="' + val[i].link + '" data-imgurl="' + val[i].imgUrl + '" ></i></p></td>';

            if (adtype == 1) {
                htm += '<td>' + adtypename + '(宽：' + adSizeobj.width + 'px&nbsp;高' + adSizeobj.height + 'px)</td>';
            }
            if (adtype == 2) {
                htm += '<td>' + adtypename + '(' + adSizeobj.textMaxLength + ')</td>';
            }
            if (adtype == 3) {
                htm += '<td>' + adtypename + '(' + adSizeobj.textMaxLength + ')</td>';
            }
            if (adtype == 4) {
                htm += '<td>' + adtypename + '(宽：' + adSizeobj.width + 'px&nbsp;高' + adSizeobj.height + 'px ' + adSizeobj.textMaxLength + ')</td>';
            }

            htm += '<td>' + val[i].aderName + '</td><td id="ad_status_name_' + val[i].adId + '">' + adStatusname + '</td>';

            //初始化操作数据
            var auditcss = '';
            var audittxt = "启动";
            var auditact = '';
            var auditshow = '';
            var auditactcss = '';

            if (adStatusid != 0) {
                auditcss = 'active-status';
                auditshow = '';
            } else {
                auditcss = '';
                auditshow = 'onclick="show_audit(' + val[i].adId + ')"';
            }

            if (adStatusid == 10 || adStatusid == 101) {
                audittxt = "启动";
                auditact = 'onclick="audit_status(' + val[i].adId + ',100)"';
                auditactcss = '';
            } else if (adStatusid == 100) {
                audittxt = "停用";
                auditact = 'onclick="audit_status(' + val[i].adId + ',101)"';
                auditactcss = '';
            } else {
                auditactcss = 'active-status';
                auditact = '';
            }

            htm += '<td><a class="ad-Review-Pass ' + auditcss + '" href="javascript:void(0)" ' + auditshow + ' >审核</a> | <a class="ad-Stop ' + auditactcss + ' " href="javascript:void(0)" ' + auditact + ' id="auditact_' + val[i].adId + '" >' + audittxt + '</a></td>';

            htm += '</tr>';
        }

        $("#ad_info").html(htm);
        $(".no_info").hide();
        $(".show_info").show();
    } else {
        $(".no_info").show();
        $(".show_info").hide();
    }
}

function query(pageNo, adType, aderName, status) {

    var redata = { pageNo: pageNo, pageSize: yonghui.pageSize, adType: adType, aderName: aderName, status: status };

    $.post(yonghui.contextPath + "/api/ad/adinfo/findAdInfoPage.jsp", redata, function(data) {
        if (data.errCode == 0) {
            get_info(data.obj);
        } else {
            layer.alert('查询列表失败!\r\n' + data.errMsg);
        }
    });
};

function show_audit(id) {
    layer.open({
        type: 1,
        area: ['auto', 'auto'],
        title: ['广告审核详情', 'color:#666;font-size:14px;font-weight:bold;'], //自定义标题
        shadeClose: true, //点击遮罩关闭
        content: $('#adReviewPass')
    });

    var url = yonghui.contextPath + "/api/ad/adinfo/getOneAdInfo.jsp";

    $.post(url, { adId: id }, function(data) {
        if (data.errCode == 0) {
            var info = data.obj;

            //格式化规格
            var adSizeobj = info.adSize;
            var adTypeobj = adSizeobj.adType.split(",");
            var adtype = adTypeobj[0];
            var adtypename = adTypeobj[1];

            //格式化审核状态
            var adStatusobj = info.adStatus.split(",");
            var adStatusid = adStatusobj[0];
            var adStatusname = adStatusobj[1];

            $("#ad_id").html(info.adId);
            $("#ad_title").html(info.title);
            $("#sub_ad_id").val(info.adId);

            if (adtype == 1) {
                $("#ad_spec").html(adtypename + '(宽：' + adSizeobj.width + 'px&nbsp;高' + adSizeobj.height + 'px');
                $("#ad_material_img").attr('href', info.link);
                $("#material_img").attr('src', info.content);
            }
            if (adtype == 2) {
                $("#ad_spec").html(adtypename + '(' + adSizeobj.textMaxLength + ')');
                $("#ad_material_img").hide();
            }
            if (adtype == 3) {
                $("#ad_spec").html(adtypename + '(' + adSizeobj.textMaxLength + ')');
                $("#ad_material_img").hide();
            }
            if (adtype == 4) {
                $("#ad_spec").html(adtypename + '(宽：' + adSizeobj.width + 'px&nbsp;高' + adSizeobj.height + 'px)');
                $("#ad_material_img").show();
                $("#material_img").attr('src', info.imgUrl);
            }
            $("#ad_detail").attr('href', info.link);

            if (adStatusid == 0) {
                $("#sub_audit").show();
                $("#sub_audit_no").show();
            }
            if (adStatusid == 20) {
                $("#sub_audit_no").hide();
            }
            if (adStatusid == 10) {
                $("#sub_audit_no").show();
                $("#sub_audit").hide();
            }
        } else {
            layer.alert(data.errMsg);
        }
    })


}

//格式化时间戳
function getLocalTime(nS) {
    return new Date(parseInt(nS)).toLocaleString().replace(/年|月/g, "-").replace(/日/g, " ").replace(/下午/g, " ");
}
