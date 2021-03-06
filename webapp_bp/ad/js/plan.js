/**
 *
 */
$(function() {

    var queryPlans = function(pageNo) {
        $.ajax({
            type: 'POST',
            url: yonghui.contextPath + '/api/ad/spread/findSpreadPlanPage.jsp',
            data: { 'pageNo': pageNo, 'pageSize': yonghui.pageSize },
            dataType: 'json',
            success: function(data) {
                if (data.errCode == 0) {
                    fillTable(data.obj);
                } else {
                    layer.alert('查询推广计划失败!\r\n' + data.errMsg);
                }
            },
            error: function(data) {
                layer.alert('查询推广计划失败!\r\n' + data.errMsg);
            }
        });
    };

    var fillTable = function(page) {
        var tbl = '';
        var statusCN = '';
        var list = page.record;

        $('#tblPlan tbody').html('');
        for (var i = 0; i < list.length; i++) {
            tbl += '<tr>';
            tbl += '<td><div class="checkbox"><label><span class="checkbox">';
            tbl += '<input name="spId" id="' + list[i].spId + '" value="' + list[i].spId + '" type="radio"><i></i>';
            tbl += '</span></label></div></td>';
            tbl += '<td><a href="javascript:toGroups(\'' + list[i].spId + '\')">' + list[i].spName + '</a></td>';
            /*tbl += '<td>' + list[i].pv + '</td>';
            tbl += '<td>' + list[i].click + '</td>';
            tbl += '<td>' + list[i].ctr + '</td>';*/
            tbl += '<td>' + list[i].sgCount + '</td>';
            tbl += '<td>' + list[i].adCount + '</td>';
            statusCN = '推广中';
            if (list[i].spStatus == 0) {
                statusCN = '未参与';
            }
            tbl += '<td class="status">' + statusCN + '</td>';
            tbl += '<td><a class="edit-Plan" href="javascript:editPlan(\'' + list[i].spId + '\', \'' + list[i].spName + '\')">编辑</a></td>';
            tbl += '</tr>';
        }
        $('#tblPlan tbody').html(tbl);
    };

    layui.use(['laypage', 'layer'], function() {
        var laypage = layui.laypage,
            layer = layui.layer;
        var page = null;

        $.ajax({
            type: 'POST',
            url: yonghui.contextPath + '/api/ad/spread/findSpreadPlanPage.jsp',
            data: { 'pageNo': 1, 'pageSize': yonghui.pageSize },
            dataType: 'json',
            success: function(data) {
                if (data.errCode == 0) {
                    page = data.obj;
                    laypage({
                        cont: 'pageNumber',
                        groups: yonghui.groups,
                        pages: page.pageCount,
                        jump: function(obj, first) {
                            if (first) {
                                fillTable(page);
                            } else {
                                queryPlans(obj.curr);
                            }
                        }
                    });
                }
            },
            error: function(data) {
                layer.alert('查询推广计划失败!\r\n' + data.errMsg);
            }
        });
    });

    //添加推广计划
    $("#btnAdd").click(function() {
        var planId = $('#planId').val();
        if (planId == '') {
            addPlan();
        } else {
            updatePlan();
        }
    });

    //新增推廣計劃
    var addPlan = function() {
        var planName = $('#planName').val();
        if (planName == '') {
            layer.alert('请输入推广计划名称');
            $('#planName').focus();
            return;
        }

        $.ajax({
            type: 'POST',
            url: yonghui.contextPath + '/api/ad/spread/addSpreadPlan.jsp',
            data: { 'spName': planName },
            dataType: 'json',
            success: function(data) {
                if (data.errCode == -10000) {
                    layer.alert('你尚未登录系统，不能操作');
                    return;
                }
                if (data.errCode != 0) {
                    layer.alert(data.errMsg);
                    layer.closeAll('page');
                    return;
                }
                layer.msg('新增推广计划成功');
                layer.closeAll('page');
                queryPlans(1);
            },
            error: function(data) {
                layer.alert('新增推广计划失败!\r\n' + data.errMsg);
            }
        });
    };

    //更新推廣計劃
    var updatePlan = function() {
        var planName = $('#planName').val();
        var planId = $('#planId').val();

        if (planName == '') {
            layer.alert('请输入推广计划名称');
            $('#planName').focus();
            return;
        }
        if (planId == '') {
            layer.alert('未指定修改推廣計劃的ID');
            return;
        }

        $.ajax({
            type: 'POST',
            url: yonghui.contextPath + '/api/ad/spread/updateSpreadPlan.jsp',
            data: { 'spName': planName, 'spId': planId },
            dataType: 'json',
            success: function(data) {
                if (data.errCode == -10000) {
                    layer.alert('你尚未登录系统，不能操作');
                    return;
                }
                if (data.errCode != 0) {
                    layer.alert( data.errMsg );
                    layer.closeAll('page');
                    return;
                }
                $('#planId').val('');
                layer.msg('更新推广计划成功');
                layer.closeAll('page');
                queryPlans(1);
            },
            error: function(data) {
                layer.alert('编辑推广计划失败!\r\n' + data.errMsg);
            }
        });
    };

    //暂停推广计划
    $('#stop_plan').click(function() {
        if (!$(this).hasClass('btn-disabled')) {
            var spId = '';
            var count = 0;
            $('input[name="spId"]').each(function() {
                if ($(this).get(0).checked) {
                    spId = $(this).attr('value');
                    count++;
                }
            });

            if (count == 0) {
                layer.msg('请选中一个推广计划暂停');
                return;
            }
            if (count > 1) {
                layer.msg('只能选择一个推广计划暂停');
                return;
            }
            updatePlanStatus(spId, 0);
        }
    });

    //参与推广计划
    $('#join_plan').click(function() {
        if (!$(this).hasClass('btn-disabled')) {
            var spId = null;
            var count = 0;

            $('input[name="spId"]').each(function() {
                if ($(this).get(0).checked) {
                    spId = $(this).attr('value');
                    count++;
                }
            });

            if (count == 0) {
                layer.msg('请选中一个计划参与推广');
                return;
            }
            if (count > 1) {
                layer.msg('只能选择一个计划参与推广');
                return;
            }

            updatePlanStatus(spId, 1);
        }

    });

    //执行推广计划更新
    var updatePlanStatus = function(planId, status) {
        $.ajax({
            type: 'POST',
            url: yonghui.contextPath + '/api/ad/spread/updateSpStatus.jsp',
            data: { 'spStatus': status, 'spIds': planId },
            dataType: 'json',
            success: function(data) {
                if (data.errCode == -10000) {
                    layer.alert('你尚未登录系统，不能操作');
                    return;
                } else if (data.errCode != 0) {
                    layer.alert(data.errMsg);
                    return;
                } else {
                    queryPlans(1);
                    layer.alert(data.errMsg, function(index) {
                        layer.close(index);
                    });
                }
            },
            error: function(data) {
                layer.alert('编辑推广计划失败!\r\n' + data.errMsg);
            }
        });
    };

    // 选中推广计划
    $('#check_list').on('change', 'input[type="radio"]', function() {
        if ('未参与' === $(this).closest('tr').find('.status').text()) {
            $('#stop_plan').addClass('btn-disabled').attr('disabled','disabled');
            $('#join_plan').removeClass('btn-disabled').removeAttr('disabled');
        } else {
            $('#join_plan').addClass('btn-disabled').attr('disabled','disabled');
            $('#stop_plan').removeClass('btn-disabled').removeAttr('disabled');
        }
    });
});

//彈出修改推廣計劃窗口
var editPlan = function(id, name) {
    $('#planName').val(name);
    $('#planId').val(id);
    layer.open({
        type: 1,
        area: ['auto', 'auto'],
        title: ['推广计划管理', 'color:#666;font-size:14px;font-weight:bold;'], //自定义标题
        shadeClose: true, //点击遮罩关闭
        content: $('#editPlan')
    });
};

//跳转到推广组
var toGroups = function(id) {
    location.href = "plan-management.html?spId=" + id;
}
