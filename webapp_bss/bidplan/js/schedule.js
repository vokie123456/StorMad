$(function() {

    //初始化数据模块
    get_industry();
    get_area();
    get_regional();

    $('#sub').removeAttr('disabled').css({'background-color':'#2089ff','cursor':'pointer'});

    //重置按钮清空地理位置
    $('.reset-input').click(function() {
            $('#shops_list_icon,#shops_list,#choice_shop_icon,#div_choice_shop').hide();
            $('.regional_box,.shops_box').removeClass('active');
            $('#choice_shop_list,#show_shops_list').html('');
            $("#div_choice_time").hide();
            $("#startTime").removeAttr('lay-verify');
            $("#endTime").removeAttr('lay-verify');
        })
        //表达验证与提交
    layui.use('form', function() {
        var form = layui.form();

        //监听时间选择
        form.on('radio(choice_time)', function(data) {
            if (data.value == 1) {
                $("#div_choice_time").show();
                $("#startTime").attr('lay-verify', 'required');
                $("#endTime").attr('lay-verify', 'required');
            } else {
                $("#div_choice_time").hide();
                $("#startTime").removeAttr('lay-verify');
                $("#endTime").removeAttr('lay-verify');
            }
        });

        //提交新增表单
        form.on('submit(sub)', function(data) {
            var val = data.field;
            var url = yonghui.contextPath + '/api/bidplan/create.jsp';

            //获取行业数组
            var iids = [];
            var iidsObj = $(".industry-type :input");
            for (var i = 0; i < iidsObj.length; i++) {
                if (iidsObj[i].checked) {
                    iids.push(iidsObj[i].value);
                }
            }

            if (iids.length > 0) {
                var val_iids = iids.join(",")
            } else {
                layer.alert("请选择行业");
                return false
            }

            //获取广告位置数组
            var alIds = [];
            var alIdsObj = $(".ad_area :input");
            for (var i = 0; i < alIdsObj.length; i++) {
                if (alIdsObj[i].checked) {
                    alIds.push(alIdsObj[i].value);
                }
            }

            if (alIds.length > 0) {
                var val_alIds = alIds.join(",")
            } else {
                layer.alert("请选择广告位");
                return false
            }

            //获取投放时间
            if (val.choice_time_rdo == 1) {
                var startTime = Number(val.startTime);
                var endTime = Number(val.endTime);

                if (startTime >= endTime) {
                    layer.alert("开始时间不能大于和等于结束时间");
                    return false
                }
            } else {
                var startTime = 0;
                var endTime = 0;
            }


            //获取大区数组
            var aIds = [];
            var aIdsObj = $(".choice_region_input");
            for (var i = 0; i < aIdsObj.length; i++) {
                aIds.push(aIdsObj[i].value);
            }
            if (aIds.length > 0) {
                var val_aIds = aIds.join(",")
            } else {
                layer.alert("请选择大区");
                return false
            }

            if (val_aIds != -1) {
                //获取门店数组
                var sIds = [];
                var sIdsObj = $(".choice_shops_input");
                for (var i = 0; i < sIdsObj.length; i++) {
                    sIds.push(sIdsObj[i].value);
                }
                if (sIds.length > 0) {
                    var val_sIds = sIds.join(",")
                } else {
                    layer.alert("请选择门店");
                    return false
                }
            } else if ($('#regional_box_all').hasClass('active')){
                // 全选时传参数-1
                var val_sIds =-1;
            } else {
                var val_sIds = '';
            }

            //检查价格与底价
            if (val.basePrice <= 0) {
                layer.alert("竞拍底价必须大于0");
                return false;
            }
            if (val.incRange <= 0) {
                layer.alert("加价幅度必须大于0");
                return false;
            }

            //          console.log(val_sIds);
            //          return false;
            $.ajax({
                type: 'POST',
                url: url,
                data: { 'bpName': val.bpName, 'iids': val_iids, 'startDate': get_time(val.startDate), 'endDate': get_time(val.endDate), 'startTime': val.startTime, 'endTime': endTime, 'repeatType': val.repeatType, 'chargeType': val.chargeType, 'alIds': val_alIds, 'aIds': val_aIds, 'sIds': val_sIds, 'basePrice': val.basePrice, 'incRange': val.incRange },
                dataType: 'json',
                success: function(data) {
                    if (data.errCode == 0) {
                        layer.msg("添加成功");
                        $('#sub').attr('disabled','disabled').css({'background-color':'#ccc','cursor':'not-allowed'});
                        window.location.href = "schedule-list.html";
                    } else {
                        layer.alert(data.errMsg);
                    }
                },
                error: function(data) {
                    layer.alert('添加异常');
                }
            });

            return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
        });

        //更新表单
        form.on('submit(update)', function(data) {
            var val = data.field;
            var url = yonghui.contextPath + '/api/bidplan/update.jsp';
            var bpId = $("#update_id").val();

            //获取行业数组
            var iids = [];
            var iidsObj = $(".industry-type :input");
            for (var i = 0; i < iidsObj.length; i++) {
                if (iidsObj[i].checked) {
                    iids.push(iidsObj[i].value);
                }
            }

            if (iids.length > 0) {
                var val_iids = iids.join(",")
            } else {
                layer.alert("请选择行业");
                return false
            }

            //获取广告位置数组
            var alIds = [];
            var alIdsObj = $(".ad_area :input");
            for (var i = 0; i < alIdsObj.length; i++) {
                if (alIdsObj[i].checked) {
                    alIds.push(alIdsObj[i].value);
                }
            }

            if (alIds.length > 0) {
                var val_alIds = alIds.join(",")
            } else {
                layer.alert("请选择广告位");
                return false
            }

            //获取投放时间
            if (val.choice_time_rdo == 1) {
                var startTime = Number(val.startTime);
                var endTime = Number(val.endTime);

                if (startTime >= endTime) {
                    layer.alert("开始时间不能大于和等于结束时间");
                    return false
                }
            } else {
                var startTime = 0;
                var endTime = 0;
            }


            //获取大区数组
            var aIds = [];
            var aIdsObj = $(".choice_region_input");
            for (var i = 0; i < aIdsObj.length; i++) {
                aIds.push(aIdsObj[i].value);
            }
            if (aIds.length > 0) {
                var val_aIds = aIds.join(",")
            } else {
                layer.alert("请选择大区");
                return false
            }

            //获取门店数组
            var sIds = [];
            var sIdsObj = $(".choice_shops_input");
            for (var i = 0; i < sIdsObj.length; i++) {
                sIds.push(sIdsObj[i].value);
            }
            if (sIds.length > 0) {
                var val_sIds = sIds.join(",")
            } else {
                layer.alert("请选择门店");
                return false
            }

            //检查价格与底价
            if (val.basePrice <= 0) {
                layer.alert("竞拍底价必须大于0");
                return false;
            }
            if (val.incRange <= 0) {
                layer.alert("加价幅度必须大于0");
                return false;
            }

            //          console.log(val_sIds);
            //          return false;
            $.ajax({
                type: 'POST',
                url: url,
                data: { 'bpId': bpId, 'bpName': val.bpName, 'iids': val_iids, 'startDate': get_time(val.startDate), 'endDate': get_time(val.endDate), 'startTime': val.startTime, 'endTime': endTime, 'repeatType': val.repeatType, 'chargeType': val.chargeType, 'alIds': val_alIds, 'aIds': val_aIds, 'sIds': val_sIds, 'basePrice': val.basePrice, 'incRange': val.incRange },
                dataType: 'json',
                success: function(data) {
                    if (data.errCode == 0) {
                        layer.msg("修改成功");
                        location.reload();
                    } else {
                        layer.alert(data.errMsg);
                    }
                },
                error: function(data) {
                    layer.alert('修改异常');
                }
            });

            return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
        });
    });

    //获取id编程模块
    var id = getUrlParam("schedule_id");
    if (id) {
        get_edit_info(id);
    }
});

//根据档期id获取信息
function get_edit_info(id) {
    layui.use('form', function() {
        var form = layui.form();

        url = yonghui.contextPath + '/api/bidplan/findById.jsp';

        $.ajax({
            type: 'POST',
            url: url,
            data: { bpId: id },
            dataType: 'json',
            success: function(data) {
                if (data.errCode == 0) {
                    var info = data.obj;
                    $('#bpName').val(info.bpName);

                    //获取默认行业
                    var indarr = info.iids.split(',');
                    for (var i = 0; i < indarr.length; i++) {
                        $('#industry_txt_' + indarr[i]).prop('checked', true);
                        form.render('checkbox');
                    }

                    //获取投放日期
                    $("#startDate").val(laydate.now(info.startDate, 'YYYY-MM-DD'));
                    $("#endDate").val(laydate.now(info.endDate, 'YYYY-MM-DD'));

                    //获取投放时间
                    if (info.startTime != 0 && info.endTime != 0) {
                        $("#add-time").find("input[value=1]").prop("checked", true);
                        $("#div_choice_time").show();
                        $("#startTime").val(info.startTime);
                        $("#endTime").val(info.endTime);
                    } else {
                        $("#add-time").find("input[value=0]").prop("checked", true);
                    }

                    //获取重复选择
                    $("#add-repeat").find('input[value=' + info.repeatedType + ']').prop("checked", true);

                    //获取广告位置
                    var areaarr = info.alIds.split(',');
                    for (var i = 0; i < areaarr.length; i++) {
                        $('#area_txt_' + areaarr[i]).prop('checked', true);
                        form.render('checkbox');
                    }

                    //获取投放大区
                    var areaCodesarr = info.areaCodes.split(',');
                    for (var i = 0; i < areaCodesarr.length; i++) {
                        $('#regional_box_' + areaCodesarr[i]).addClass('active');
                        $('#regional_box_' + areaCodesarr[i]).addClass('regional_box_checked');

                        region_hem = '<input class="choice_region_input" id="region_val_' + areaCodesarr[i] + '" type="hidden" value="' + areaCodesarr[i] + '">';
                        $("#regional_box_" + areaCodesarr[i]).find("td").append(region_hem);
                    }
                    $("#choice_shop_icon").show();
                    $("#div_choice_shop").show();

                    //获取投放门店
                    get_region_shops(id);

                    //获取竞拍底价
                    $("#basePrice").val(info.cbasePrice);

                    //获取竞拍加价幅度
                    $("#incRange").val(info.cincRange);

                    //ID插入隐藏域
                    $("#update_id").val(id);

                    //更改提交按钮为更新
                    $("#sub").attr('lay-filter', 'update');
                } else {
                    layer.alert(data.errMsg);
                }
            },
            error: function(data) {
                layer.alert('查询异常');
            }
        });
    });
}

//根据档期ID获取大区门店
function get_region_shops(id) {
    url = yonghui.contextPath + '/api/bidplan/query.jsp';

    $.post(url, { op: 1, bpId: id }, function(data) {
        if (data.errCode == 0) {
            var info = data.obj.shops;
            var htm = '';

            for (var i = 0; i < info.length; i++) {
                if (!$("#div_choice_shop").find('tr[id=tr_choice_shops_' + info[i].shopCode + ']').length) {
                    htm += '<tr id="tr_choice_shops_' + info[i].shopCode + '" class="choice_shops_box" value="' + info[i].shopCode + '" areaCode="' + info[i].areaCode + '" >'
                    htm += '<td>' + info[i].shopName + '<input type="hidden" class="choice_shops_input" value="' + info[i].shopCode + '"></td>';
                    htm += '</tr>';
                }
            }

            $('#choice_shop_list').append(htm);
        } else {
            layer.alert(data.errMsg);
        }
    })
}

/**
 * [获取url参数值]
 * @param  name [参数名称]
 * @return [参数值]
 */
function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"),
        r = window.location.search.substr(1).match(reg);
    return null != r ? unescape(r[2]) : null;
}

//门店批量选择
$("body").on('click', '.shops_box', function() {
    var is_chcek = $(this).hasClass('active');

    if (!is_chcek) {
        $(this).addClass('active');
    } else {
        $(this).removeClass('active');
    }
})

function choice_right() {
    var htm = '';
    var allLength = $('#choice_shop_list #choice_shop_all').length;
    if (allLength < 1) {

        htm += '<tr id="choice_shop_all"  class="choice_shops_box " value="-1">';

        htm += '<td>全选</td>'

        htm += '</tr>';
    }

    var shop_dom = $('.shops_box');

    shop_dom.each(function() {
        var code = $(this).attr('value');
        if (code != -1 && $(this).hasClass('active')) {
            var val = $(this).attr('value');
            var txt = $(this).find('td').text();
            $(this).removeClass('shops_box');
            var area_code = $(this).attr('area_code');

            $("#regional_box_" + area_code).addClass('regional_box_checked');

            if (!$("#div_choice_shop").find('tr[id=tr_choice_shops_' + val + ']').length) {

                htm += '<tr id="tr_choice_shops_' + val + '" class="choice_shops_box" value="' + val + '" area_code="' + area_code + '">'
                htm += '<td>' + txt + '<input type="hidden" class="choice_shops_input" value="' + val + '"></td>';
                htm += '</tr>';

                if (!$("#regional_box_" + area_code).find('input[id=region_val_' + area_code + ']').length) {
                    region_hem = '<input class="choice_region_input" id="region_val_' + area_code + '" type="hidden" value="' + area_code + '">';
                    $("#regional_box_" + area_code).find("td").append(region_hem);
                }
            }
        }
    })

    $('#choice_shop_list').append(htm);

}

//门店批量取消
$("body").on('click', '.choice_shops_box', function() {

    var is_chcek = $(this).hasClass('active');

    if (!is_chcek) {
        $(this).addClass('active');

    } else {
        $(this).removeClass('active');
    }
})

function choice_left() {
    var shop_dom = $('.choice_shops_box');
    shop_dom.each(function() {
        if ($(this).hasClass('active')) {
            var shopsCode = $(this).attr('value');
            var area_code = $(this).attr('area_code');
            $("#shops_box_" + shopsCode).addClass('shops_box');
            $("#shops_box_" + shopsCode).removeClass('active');
            $(this).remove();

            //检查如果没有属于此大区的门店就删除大区的隐藏域
            if (!$('#choice_shop_list').find('tr[area_code=' + area_code + ']').length) {
                $("#regional_box_" + area_code).removeClass('regional_box_checked');
                $("#regional_box_" + area_code).removeClass('active');
                $("#region_val_" + area_code).remove();
            }
            //去除全选active
            $('#shop_box_all').removeClass('active');
            var choiceL = $('.choice_shops_box').length;
            if (choiceL <= 1) {
                $('#choice_shop_all').remove();
            }
        }
    })
}

$("body").on('click', '.regional_box', function() {
    // $(this).siblings().removeClass('active');
    var code = $(this).attr('value');
    var is_chcek = $(this).hasClass('active');
    var is_check_shops = $(this).hasClass('regional_box_checked'); //已经选有门店的。不取消选择样式

    if (code == -1 && !is_chcek) {
        $(".regional_box").addClass('active');
        $("#shops_list_icon").hide();
        $("#shops_list").hide();
        $("#choice_shop_icon").hide();
        $("#div_choice_shop").hide();

        $(".choice_shops_box").remove();
        $(".choice_region_input").remove();
        $(".regional_box").removeClass('regional_box_checked');

        var region_hem = '<input class="choice_region_input" id="region_val_all" type="hidden" value="-1">';
        $("#regional_box_all").find("td").append(region_hem);
    }
    if (code == -1 && is_chcek) {
        $(".regional_box").removeClass('active');
    }

    if (code != -1) {
        if (!is_chcek) {
            $(this).addClass('active');
            get_shops(code);
        } else {
            if (!is_check_shops) {
                if ($('.regional_box[value=-1]').hasClass('active')) {
                    $(this).addClass('active').siblings().removeClass('active');
                    get_shops(code);
                } else {
                    $(this).removeClass('active');
                }
            } else {
                get_shops(code);
            }
        }
    }
})

/*可选门店全选*/
$("body").on('click', '.shops_box', function() {
        var code = $(this).attr('value');
        var is_chcek = $(this).hasClass('active');
        if (code == -1 && !is_chcek) {
            $('.shops_box').removeClass('active');
        }
        if (code == -1 && is_chcek) {
            $('.shops_box').addClass('active');
        }
    })
    /*已选位置全选*/
$("body").on('click', '.choice_shops_box', function() {
    var code = $(this).attr('value');
    var is_chcek = $(this).hasClass('active');
    if (code == -1 && !is_chcek) {
        $('.choice_shops_box').removeClass('active');
    }
    if (code == -1 && is_chcek) {
        $('.choice_shops_box').addClass('active');
    }
})

function get_shops(code) {
    url = yonghui.contextPath + '/api/common/getBaseShopsByAreaCodes.jsp';

    $.post(url, { areaCodes: code }, function(data) {
        var htm = '';

        if (data.errCode == 0) {
            var val = data.obj;
            if (val.length > 0) {
                $("#shops_list_icon").show();
                $("#shops_list").show();
                $("#choice_shop_icon").show();
                $("#div_choice_shop").show();
                htm += '<tr id="shop_box_all"  class="shops_box" value="-1">';

                htm += '<td>全选</td>'

                htm += '</tr>';
                for (var i = 0; i < val.length; i++) {
                    if ($('#choice_shop_list').find('tr[value=' + val[i].shopCode + ']').length) {
                        var classval = "active";
                    } else {
                        var classval = "shops_box";
                    }

                    htm += '<tr  id="shops_box_' + val[i].shopCode + '" area_code="' + code + '" class="' + classval + '" value="' + val[i].shopCode + '">';

                    htm += '<td>' + val[i].shopName + '</td>'

                    htm += '</tr>';
                }

                $('#show_shops_list').html(htm);
            }
        } else if (data.errCode == -10000) {
            layer.open({
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
            layer.alert(data.errMsg);
        }
    })
}

//获取大区
function get_regional() {
    url = yonghui.contextPath + '/api/common/getAllArea.jsp';

    $.post(url, function(data) {
        var htm = '';

        if (data.errCode == 0) {
            var val = data.obj;

            htm += '<tr id="regional_box_all"  class="regional_box" value="-1">';

            htm += '<td>全选</td>'

            htm += '</tr>';

            for (var i = 0; i < val.length; i++) {
                htm += '<tr id="regional_box_' + val[i].areaCode + '" class="regional_box" value="' + val[i].areaCode + '">';

                htm += '<td>' + val[i].areaName + '</td>'

                htm += '</tr>';
            }


            $('#check_list').html(htm);
        } else {
            layer.alert(data.errMsg);
        }
    })
}

//获取行业信息
function get_industry() {
    url = yonghui.contextPath + '/api/common/getAllIndustry.jsp';

    $.post(url, function(data) {
        var htm = '';

        if (data.errCode == 0) {
            var val = data.obj;

            for (var i = 0; i < val.length; i++) {
                htm += '<input id="industry_txt_' + val[i].iid + '" value="' + val[i].iid + '" title="' + val[i].iname + '" type="checkbox">';
            }

            $('.industry-type').html(htm);

            layui.use('form', function() {
                var form = layui.form();
                form.render('checkbox');
            });
        } else {
            layer.alert(data.errMsg);
        }
    })
}

//获取广告位信息
function get_area() {
    url = yonghui.contextPath + '/api/ad/adlocation/getAllBaseAdLocation.jsp';

    $.post(url, function(data) {
        var htm = '';

        if (data.errCode == 0) {
            var val = data.obj;

            for (var i = 0; i < val.length; i++) {
                htm += '<input id="area_txt_' + val[i].first + '" value="' + val[i].first + '" title="' + val[i].second + '" type="checkbox">';
            }

            $('.ad_area').html(htm);

            layui.use('form', function() {
                var form = layui.form();
                form.render('checkbox');
            });
        } else {
            layer.alert(data.errMsg);
        }
    })
}

//时间转换为时间戳  毫秒
function get_time(time) {
    return Date.parse(new Date(time));
}
