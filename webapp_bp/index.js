function API() {}
API.prototype = {
    post: function(url, data, cb) {
        $.ajax({
            type: 'POST',
            url: yonghui.contextPath + url,
            dataType: 'json',
            data: data,
            success: cb
        });
    },
    simple: function(str, obj) {
        return str.replace(/\$\w+\$/gi, function(matchs) {
            var returns = obj[matchs.replace(/\$/g, "")];
            return typeof returns === "undefined" ? "" : returns;
        });
    }
};
var api = new API();

/**
 * [选择档期]
 */
function Bidplan() {
    this.pageNo = 1;
    this.pageSize = yonghui.pageSize;
    this.pageNumFlag = true;
    this.bpid = ''; // 档期id
    this.iid = ''; // 行业id
    this.cstartTime = []; // 所有档期竞拍开始时间
    this.cendTime = []; // 所有档期竞拍结束时间
    this.bidTime = { bidStartTime: '', bidEndTime: '' }; // 选中档期的竞拍开始时间和结束时间
    this.lowestMoney = 0; // 竞拍当前最低价
    this.cincRange = 0; // 加价幅度
    this.shop = []; // 出价竞拍--查看门店

    this.resultPageNo = 1; //竞拍结果--分页--当前页
    this.resultPageNumFlag = true;

    this.nextBpid = ''; // 继续竞拍的档期id
    this.nextIid = ''; // 继续竞拍的行业id

    this.filter = { iid: '' }; // 条件搜索

    this.time = null; // 计时器
    this.init();
}
Bidplan.prototype = {
    /**
     * [获取档期列表]
     */
    getData: function(iid) {
        var self = this;
    
        self.cstartTime = [];
        self.cendTime = [];
        api.post('/api/bidplan/query.jsp', {
            iid: iid ? iid : '',
            pageNo: self.pageNo,
            pageSize: self.pageSize
        }, function(res) {
            if (0 === res.errCode) {
                if (self.pageNumFlag) {
                    self.pageNumFlag = false;
                    self.setPageNumber(res.obj.pageCount /*, iid*/ );
                }
                var bigPlanTab = '',
                    count = 0;
                var bigPlanItem = '<tr data-bpid="$bpId$" data-index="$count$"><td><div class="checkbox"><label><span class="checkbox"><input type="radio" name="plan"><i></i></span></label></div></td><td>$bpName$</td><td>$time$</td><td><span class="status-tips ad-Preview"><a href="javascript:void(0)">点击查看</a></span></td><td><span class="status-tips store-List"><a href="javascript:void(0);">查看门店</a></span></td><td>$chargeCN$</td><td>￥$cbasePrice$</td><td class="status">$statusCN$</td></tr>';
                if (res.obj.record && res.obj.record.length) {
                    $('#choice .empty-tips').hide();
                    $(".auction .nav-tabs li:nth-child(2)").removeClass('disabled');
                    $.each(res.obj.record, function(n, item) {
                        if (item.startTime == 0 && item.endTime == 86399999) {
                            var cTime = "";
                        } else {
                            var cTime = item.startTime / 1000 / 3600 + '时&nbsp;至&nbsp;' + item.endTime / 1000 / 3600 + '时';
                        }
                        bigPlanTab += api.simple(bigPlanItem, {
                            bpId: item.bpId,
                            count: count++,
                            bpName: item.bpName,
                            time: self.formatDate(item.startDate) + '至' + self.formatDate(item.endDate) + '&nbsp;&nbsp;' + cTime,
                            chargeCN: item.chargeCN,
                            cbasePrice: (item.cbasePrice / 100).toFixed(2),
                            statusCN: item.bidStatusCN
                        });
                        self.cstartTime.push(item.cstartTime);
                        self.cendTime.push(item.cendTime);
                    });
                } else {
                    $('#choice .empty-tips').show();
                    $(".auction .nav-tabs li:nth-child(2)").addClass('disabled');
                }
                $('#check_list').html(bigPlanTab);
                $('#check_list tr:first input[type="radio"]').trigger('change');
                self.bpid = $('#check_list tr:first').data('bpid');
            } else {
                layui.use('layer', function() {
                    var layer = layui.layer;
                    layer.msg(res.errMsg);
                });
            }
        });
    },
    /**
     * [分页]
     * @param {[type]} pageCount [总页数]
     * @param {[type]} isBidResult [竞拍结果分页]
     */
    setPageNumber: function(pageCount, isBidResult) {
        var self = this;
        layui.use(['laypage'], function() {
            var laypage = layui.laypage,
                layer = layui.layer;
            if (isBidResult) {
                laypage({
                    cont: 'result-pageNumber',
                    pages: pageCount,
                    skin: '#e6614f',
                    skip: true,
                    groups: yonghui.groups,
                    jump: function(obj, first) {
                        //得到了当前页，用于向服务端请求对应数据
                        if (!first) {
                            self.resultPageNo = obj.curr;
                            self.getBidResult();
                        }
                    }
                });
            } else {
                laypage({
                    cont: 'pageNumber',
                    pages: pageCount,
                    skin: '#e6614f',
                    skip: true,
                    groups: yonghui.groups,
                    jump: function(obj, first) {
                        //得到了当前页，用于向服务端请求对应数据
                        if (!first) {
                            self.pageNo = obj.curr;
                            self.getData(self.filter.iid);
                        }
                    }
                });
            }


        });
    },
    /**
     * [设置竞拍热度星星展示]
     * @param {[type]} ele [节点]
     * @param {[type]} num [星星数量]
     */
    setStar: function(ele, num) {
        ele.removeClass('disabled');
        $.each(ele, function(index, val) {
            if (index >= num) {
                $(val).addClass('disabled');
            }
        });

    },
    /**
     * [把毫秒数转化成日期格式yy-mm-dd]
     * @param  {[type]} time [毫秒数]
     * @param  {[type]} format [日期格式，包含：YYYY-MM-DD HH:MM:SS,YYYY-MM-DD(默认格式)]
     * @return {[type]}      [格式为format的日期]
     */
    formatDate: function(time, format) {
        var date = new Date(time),
            formatDate = [date.getFullYear(), (date.getMonth() + 1 + '').replace(/^(\d)$/, "0$1"), (date.getDate() + '').replace(/^(\d)$/, "0$1")].join('-');
        if (format && format === 'YYYY-MM-DD HH:MM:SS') {
            return formatDate + ' ' + (date.getHours() + '').replace(/^(\d)$/, "0$1") + ':' + (date.getMinutes() + '').replace(/^(\d)$/, "0$1") + ':' + (date.getSeconds() + '').replace(/^(\d)$/, "0$1");
        } else {
            return formatDate;
        }
    },
    /**
     * [查看门店]
     * @param  {[type]} bpId [档期ID]
     */
    seeStore: function(bpId) {
        api.post('/api/bidplan/query.jsp', {
            op: 1,
            bpId: bpId
        }, function(res) {
            if (0 === res.errCode) {
                var storeList = '';
                res.obj.shops && res.obj.shops.length > 0 && $.each(res.obj.shops, function(n, item) {
                    storeList += '<li>' + item.shopName + '</li>'
                });
                layer.open({
                    type: 1,
                    area: ['340px', 'auto'],
                    title: '该档期投放门店',
                    shadeClose: true,
                    // closeBtn: 0,
                    content: '<div class="frame-content"><div class="frame-body store-list"><ul>' + storeList + '</ul></div></div>'
                });
            } else {
                layer.msg(res.errMsg);
            }
        });
    },
    /**
     * [查看广告位置]
     * @param  {[type]} bpId [档期ID]
     */
    seeAdPos: function(bpId) {
        api.post('/api/bidplan/query.jsp', {
            op: 1,
            bpId: bpId
        }, function(res) {
            if (0 === res.errCode) {
                var adPosList = '';
                res.obj.locations && res.obj.locations.length && $.each(res.obj.locations, function(n, item) {
                    adPosList += '<a class="adGroup" href="' + item.sketchMap + '" title="' + item.alName + '"></a>';
                });

                $('#adPopup').html(adPosList);
                $(".adGroup").colorbox({
                    rel: 'adGroup',
                    transition: 'elastic',
                    current: '{current} / {total}',
                    opacity: 0.6,
                    maxHeight: "90%"
                });
                $('#adPopup a:first').click();
            }
        });
    },
    /**
     * [行业信息]
     * @param  {[type]} bpId [档期ID]
     * @param  {[type]} $ele [当前档期节点]
     */
    getIndustry: function(bpId, $ele) {
        var self = this;
        if (!$ele.next('tr').hasClass('extend')) {
            api.post('/api/bidplan/query.jsp', {
                op: 1,
                bpId: bpId
            }, function(res) {
                if (0 === res.errCode) {
                    var industry = '',
                        buttons = '';
                        btnAuction='';
                    res.obj.industries && res.obj.industries.length > 0 && $.each(res.obj.industries, function(n, item) {
                        buttons += '<button type="button" data-iid="' + item.iid + '">' + item.iname + '</button>';
                    });
                    industry = '<tr class="extend"><td colspan="8"><div class="row"><div class="col-xs-1 choice-title">选择行业：</div><div class="col-xs-7 industry">' + buttons + '</div><div class="col-xs-4 perfunctory"><p><span class="industry-Type"></span>行业竞拍热度：<i class="fa fa-star" aria-hidden="true"></i><i class="fa fa-star" aria-hidden="true"></i><i class="fa fa-star" aria-hidden="true"></i><i class="fa fa-star" aria-hidden="true"></i><i class="fa fa-star disabled" aria-hidden="true"></i></p><button type="button" class="btn btn-default btn-auction ' + ($ele.find('.status').text() === '竞拍中' ? '' : 'btn-disabled') +'" '+($ele.find('.status').text() === '竞拍中' ? '' : 'disabled="disabled"')+'>竞拍</button></div></div></td></tr>';
                    /*industry = '<tr class="extend"><td colspan="8"><div class="row"><div class="col-xs-1 choice-title">选择行业：</div><div class="col-xs-7 industry">' + buttons + '</div><div class="col-xs-4 perfunctory"><p><span class="industry-Type"></span>行业竞拍热度：<i class="fa fa-star" aria-hidden="true"></i><i class="fa fa-star" aria-hidden="true"></i><i class="fa fa-star" aria-hidden="true"></i><i class="fa fa-star" aria-hidden="true"></i><i class="fa fa-star disabled" aria-hidden="true"></i></p><button type="button" class="btn btn-default btn-auction ' + ($ele.find('.status').text() === '竞拍中' ? '' : 'disabled') +'">竞拍</button></div></div></td></tr>';*/
                    $ele.find('.status').text() === '竞拍中' ? $(".auction .nav-tabs li:nth-child(2)").removeClass('disabled') : $(".auction .nav-tabs li:nth-child(2)").addClass('disabled');
                    $ele.after(industry);
                    $ele.next('.extend').find('button:first').trigger('click');
                    self.iid = $ele.next('.extend').find('button:first').data('iid');
                } else {
                    layer.msg(res.errMsg);
                }
            });
        } else {
            $ele.next('.extend').show();
            $ele.next('.extend').find('button:first').trigger('click');
            self.iid = $ele.next('.extend').find('button:first').data('iid');
        }
    },
    /**
     * [获取所有的行业]
     */
    getAllIndustry: function() {
        api.post('/api/common/getAllIndustry.jsp', {}, function(res) {
            if (0 === res.errCode) {
                var options = '<option value="" selected="">请选择行业</option><option value="">全部</option>';
                $.each(res.obj, function(n, item) {
                    options += '<option value="' + item.iid + '">' + item.iname + '</option>';
                });
                $('#industrySel').html(options);
                layui.use('form', function() {
                    var form = layui.form();
                    form.render('select');
                });
            }
        });
    },
    /**
     * [出价竞拍档期信息]
     */
    getBid: function(currBpid, currIid) {
        var self = this;
        api.post('/api/bid/getMaxBidLog.jsp', {
            bpId: ('' === self.nextBpid) ? self.bpid : self.nextBpid,
            iId: ('' === self.nextIid) ? self.iid : self.nextIid
        }, function(res) {
            if (0 === res.errCode) {
                var obj = res.obj;
                self.lowestMoney = (obj.maxMoney === 0) ? (obj.cbasePrice / 100).toFixed(2) : ((obj.maxMoney > obj.cbasePrice) ? (obj.maxMoney + obj.cincRange) / 100 : (obj.cbasePrice + obj.cincRange) / 100);

                var imgList = '';
                $.each(obj.alList, function(n, item) {
                    imgList += '<img layer-pid="" layer-src="' + item.sketchMap + '" src="http://placehold.it/600x600" alt="' + item.alName + '" layer-index="' + n + '">';
                });
                $('#ad-photos').html(imgList);
                self.shop = obj.shops;
                self.cincRange = obj.cincRange;
                $('#bpName').html(obj.bpName);
                $('#cbasePrice').html('￥' + (obj.cbasePrice / 100).toFixed(2));
                $('#bidName').html(obj.bidName);
                $('#maxMoney').html((obj.maxMoney === 0) ? '无' : ('￥' + (obj.maxMoney / 100).toFixed(2)));
                $('#iname').html(obj.iname);
                $('#cincRange').html('￥' + (obj.cincRange / 100).toFixed(2));
                $('#money').html(obj.money === 0 ? '无' : '￥' + (obj.money / 100).toFixed(2));
                $('#chargeType').html(obj.chargeTypeName);
                $('#currentBidMoney').val((self.lowestMoney));
                $('#bidTime').html(self.formatDate(obj.bidStartTime) + '至' + self.formatDate(obj.bidEndTime));
                self.descDisabled();
                $('.auction-detail').attr({ 'data-bpid': obj.bpId, 'data-iid': obj.iid });
            }
        });
    },
    /**
     * [出价竞拍]
     */
    bidding: function() {
        var self = this;
        api.post('/api/bid/bid.jsp', {
            bpId: ('' === self.nextBpid) ? self.bpid : self.nextBpid,
            iId: ('' === self.nextIid) ? self.iid : self.nextIid,
            money: Math.round($('#currentBidMoney').val() * 100)
        }, function(res) {
            if (0 === res.errCode && true === res.obj) {
                layer.closeAll();
                layer.open({
                    type: 1,
                    area: ['580px', 'auto'],
                    title: false,
                    title: ['竞拍结果', 'color:#666;font-size:14px;font-weight:bold;'],
                    shadeClose: true,
                    content: '<div id="payTips" class="frame-content"><div class="frame-body pay-tips pay-tips-status"><div class="top"><p class="warning">恭喜您出价成功╰(￣▽￣)╮</p><p>您的出价：<span>￥' + $('#currentBidMoney').val() + '</span></p></div><div class="bottom"><button type="button" class="btn btn-default" id="btnBidSuccess">查看竞拍结果</button></div></div></div>',
                    end: function() {
                        self.resultPageNumFlag = true;
                        self.getBidResult();
                        $('.nav-tabs li:eq(2) a').tab('show').trigger('click');
                    }
                });
            } else {
                layer.closeAll();
                var tips = '';
                /*tips = (5005 === res.errCode ? '<div id="payTips" class="frame-content"><div class="frame-body pay-tips-02"><div class="top"><p class="warning">很遗憾，由于您余额不足，此次竞拍失败 ⊙﹏⊙‖∣</p><p>若想继续参与竞拍，请确保您的账户余额充足！<span><a href="/ad/account.html">立即充值</a></span></p></div><div class="bottom"><button type="button" class="btn btn-default" id="btnBidFail">我知道了</button></div></div></div>' : '<div id="payTips" class="frame-content"><div class="frame-body pay-tips-02"><div class="top"><p class="warning">出价失败⊙﹏⊙‖∣</p><p>' + res.errMsg + '</p></div><div class="bottom"><button type="button" class="btn btn-default" id="btnBidFail">我知道了</button></div></div></div>');*/
                tips = (5005 === res.errCode ? '<div id="payTips" class="frame-content"><div class="frame-body pay-tips pay-tips-status"><div class="top"><p class="warning">很遗憾，由于您余额不足，此次竞拍失败 ⊙﹏⊙‖∣</p><p>若想继续参与竞拍，请确保您的账户余额充足！</p></div><div class="bottom"><button type="button" class="btn btn-default" id="btnBidFail">立即充值</button></div></div></div>' : '<div id="payTips" class="frame-content"><div class="frame-body pay-tips-02"><div class="top"><p class="warning">出价失败⊙﹏⊙‖∣</p><p>' + res.errMsg + '</p></div><div class="bottom"><button type="button" class="btn btn-default" id="btnBidFail">立即充值</button></div></div></div>');
                layer.open({
                    type: 1,
                    area: ['580px', 'auto'],
                    title: false,
                    title: ['竞拍结果', 'color:#666;font-size:14px;font-weight:bold;'],
                    shadeClose: true,
                    content: tips
                });
            }
        });
    },
    /**
     * [出价"减"按钮设置不可减]
     */
    descDisabled: function() {
        console.log(typeof(Number($('#currentBidMoney').val())));
        console.log(typeof(Number(this.lowestMoney )));
        console.log(Number($('#currentBidMoney').val()) <= Number(this.lowestMoney ));
        Number($('#currentBidMoney').val()) <= Number(this.lowestMoney )? $('.desc').addClass('disabled') : $('.desc').removeClass('disabled');
    },

    /**
     * [获取竞拍结果]
     */
    getBidResult: function() {
        var self = this;
        api.post('/api/bid/getBidLogs.jsp', {
            pageNo: self.resultPageNo,
            pageSize: self.pageSize,
            bpId: self.bpid,
            iId: self.iid
        }, function(res) {
            if (0 === res.errCode) {
                if (self.resultPageNumFlag) {
                    self.resultPageNumFlag = false;
                    self.setPageNumber(res.obj.pageCount, 'isBidResult');
                }
            
                var resultList = '';
                var resultItem = '<tr data-bpid="$bpid$" data-iid="$iid$"><td>$bidTime$</td><td>$bpName$</td><td>$time$</td><td><span class="status-tips ad-Preview"><a href="javascript:void(0);">点击查看</a></span></td><td><span class="status-tips store-List"><a href="javascript:void(0);">查看门店</a></span></td><td>$iname$</td><td>￥$money$</td><td>$status$</td><td class="go-on $btnClass$">$btnOp$</td></tr>';
                if (res.obj.record && res.obj.record.length) {
                    $('#result .empty-tips').hide();
                    $.each(res.obj.record, function(n, item) {
                        if (item.cstartTime == 0 && item.cendTime == 86399999) {
                            var cTime = "";
                        } else {
                            var cTime = item.cstartTime / 1000 / 3600 + '时&nbsp;至&nbsp;' + item.cendTime / 1000 / 3600 + '时';
                        }
                        resultList += api.simple(resultItem, {
                            bpid: item.bpId,
                            iid: item.iid,
                            bidTime: self.formatDate(item.bidTime),
                            bpName: item.bpName,
                            time: self.formatDate(item.cstartDate) + '至' + self.formatDate(item.cendDate)+'&nbsp;&nbsp;'+cTime,
                            iname: item.iname,
                            money: (item.money / 100).toFixed(2),
                            status: item.status.substr(2),
                            btnOp: item.bpStatus === 1 ? '<button type="button" class="btn btn-default" id="btnBidContinue">继续竞拍</button>' : ((item.status[0] === '3') && (item.bpStatus === 2) ? '<button type="button" class="btn btn-default" id="adBind">广告绑定</button>' : '<button type="button" class="btn btn-default layui-btn-disabled">竞拍已结束</button>'),
                            btnClass: item.bpStatus === 1 ? '' : ((item.status[0] === '3') && (item.bpStatus === 2) ? 'locked' : 'over')
                        });
                    });
                    $('#bidResult').html(resultList);
                } else {
                    $('#result .empty-tips').show();
                }

            } else {
                layer.msg(res.errMsg);
            }
        })
    },
    /**
     * [竞拍结果]
     */
    getBidRecord: function() {
        var self = this;
        api.post('/api/bid/getSimpleBidLogs.jsp', {
            bpId: (self.nextBpid === '') ? self.bpid : self.nextBpid,
            iId: (self.nextIid === '') ? self.iid : self.nextIid
        }, function(res) {
            if (0 === res.errCode) {
                var recordList = '';
                var recordItem = '<tr><td>$date$</td><td>￥$money$</td></tr>';
                $.each(res.obj, function(n, item) {
                    recordList += api.simple(recordItem, {
                        date: item.date,
                        money: item.money / 100
                    })
                });
                $('#bidRecord').html(recordList);
            } else {
                layer.msg(res.errMsg);
            }
        });
    },
    /**
     * [获取档期倒计时时间]
     */
    getRemainTime: function() {
        var self = this;
        var time;
        self.time && clearInterval(self.time);
        api.post('/api/bidplan/countDown.jsp', {
            bpId: self.bpid
        }, function(res) {
            if ((0 === res.errCode) && (res.obj.freeTime > 0)) {
                $('.endCountDown').show();
                var remainTime = Math.floor(res.obj.freeTime / 1000);
                self.time = setInterval(function() {
                    $('#countdown').html(self.countdown(remainTime--));
                }, 1000);
            } else {
                $('.endCountDown').hide();
                self.time = null;
                clearInterval(self.time);
            }
        });
    },
    /**
     * [倒计时]
     * @param  {[type]} time [距离竞拍结束时间]
     */
    countdown: function(time) {
        if (time === 0) {
            location.reload();
        }
        if (time < 60) {
            return time + '秒';
        }
        if (time > 86400) {
            return Math.floor(time / 86400) + '天' + Math.floor(time % 86400 / 3600) + '时' + Math.floor(time % 86400 % 3600 / 60) + '分' + (time % 86400 % 3600 % 60) + '秒';
        }
        if (time > 3600) {
            return Math.floor(time / 3600) + '时' + Math.floor(time % 3600 / 60) + '分' + (time % 3600 % 60) + '秒';
        }
        if (time > 60) {
            return Math.floor(time / 60) + '分' + (time % 60) + '秒';
        }
    },
    /**
     * [获取热度并设置星星]
     * @param  {[type]} $perfunctory [热度——星星DOM节点]
     * @param  {[type]} iid          [行业id]
     */
    getStarNum: function($perfunctory, iid) {
        var self = this;
        api.post('/api/bidplan/bidHot.jsp', {
            iid: iid
        }, function(res) {
            if (0 === res.errCode) {
                self.setStar($perfunctory.find('.fa-star'), res.obj);
            }
        });
    },
    /**
     * [获取开启竞拍提醒的手机号]
     */
    setAderPhone: function() {
        var self = this;
        $.ajax({
            url: yonghui.contextPath + '/api/ader/getNotifyPhone.jsp',
            type: 'POST',
            data: {},
            dataType: 'json',
            success: function(res) {
                if (0 === res.errCode) {
                    $('#remindTel').html(res.obj.phone);
                    if (res.obj.openNotify === 1) {
                        $('#openNotify').attr('checked', 'true');
                        layui.use('form', function() {
                            var form = layui.form();
                            form.render('checkbox');
                        });
                        $('.remind-window').addClass('hide');
                    }
                }
            }
        });
    },
    /**
     * [开启关闭实时提醒]
     * @param  {[type]} openVal [开启：1,关闭：0]
     */
    openNotify: function(openVal) {
        api.post('/api/ader/openNotify.jsp', {
            open: openVal
        }, function(res) {
            if (0 !== res.errCode) {
                layer.alert(res.errMsg);
            }
        });
    },
    /**
     * [事件]
     */
    bindEvent: function() {
        var self = this;
        // 选择档期--根据行业选择档期
        layui.use('form', function() {
            var form = layui.form();
            form.on('select(industrySel)', function(data) {
                self.pageNo = 1;
                self.pageNumFlag = true;
                self.filter.iid = data.value;
                self.getData(data.value);
            });
        });

        // var time; // 计时器
        $('#check_list').on('click', '.store-List', function() {
            // 选择档期--门店列表弹窗
            self.seeStore($(this).closest('tr').data('bpid'));
        }).on('change', 'input[type="radio"]', function() {
            // 选择档期--单选按钮
            $(this).attr('checked', true);
            $('tr.extend').hide();
            var $tr = $(this).closest('tr');
            if ($(this).is(':checked')) {
                $tr.addClass('active').siblings('tr').removeClass('active');
                self.bpid = $tr.data('bpid');
                self.getIndustry($tr.data('bpid'), $tr);
                self.bidTime.bidStartTime = self.cstartTime[$tr.data('index')];
                self.bidTime.bidEndTime = self.cendTime[$tr.data('index')];
                $('#startTime').html(self.formatDate(self.bidTime.bidStartTime, 'YYYY-MM-DD HH:MM:SS'));
                $('#endTime').html(self.formatDate(self.bidTime.bidEndTime, 'YYYY-MM-DD HH:MM:SS'));
                if ('竞拍中' === $tr.find('.status').text()) {
                    $(".auction .nav-tabs li:nth-child(2)").removeClass('disabled');
                } else {
                    $(".auction .nav-tabs li:nth-child(2)").addClass('disabled');
                }
                // 倒计时
                self.getRemainTime(self.bpid);
            } else {
                if ($tr.next().hasClass('extend')) {
                    $tr.next('.extend').hide();
                }
            }
        }).on('click', '.industry button', function() {
            // 选择档期--行业选择按钮
            var $perfunctory = $(this).closest('.industry').siblings('.perfunctory');
            $(this).addClass('active').siblings('button').removeClass('active');
            $perfunctory.find('.industry-Type').html($(this).text());
            self.getStarNum($perfunctory, $(this).data('iid'));
            self.iid = $(this).data('iid');
        }).on('click', '.btn-auction:not(.disabled)', function() {
            self.bpid = $(this).closest('.extend').prev('tr').data('bpid');
            self.iid = $(this).closest('.extend').find('button.active').data('iid');
            $('.nav-tabs li:eq(1) a').tab('show').trigger('click');
        }).on('click', 'span.ad-Preview', function() {
            // 选择档期--查看广告位置
            self.seeAdPos($(this).closest('tr').data('bpid'));
        });
        // 出价竞拍-出价加减
        $('.add-delete').on('click', '.desc:not(.disabled)', function() {
            $('#currentBidMoney').val((($('#currentBidMoney').val() * 100 - self.cincRange) / 100).toFixed(2));
            self.descDisabled();
        }).on('click', '.add', function() {
            $('#currentBidMoney').val((($('#currentBidMoney').val() * 100 + self.cincRange) / 100).toFixed(2));
            self.descDisabled();
        });

        // 出价竞拍--广告位置预览弹窗
        $('.auction-detail span.ad-Preview').on('click', function() {
            self.seeAdPos($('.auction-detail').data('bpid'));
        });

        // 出价竞拍--门店列表弹窗
        $('#offer').on('click', '.store-List', function() {
            self.seeStore($('.auction-detail').data('bpid'));
        }).on('click', '#btnBid', function() {
            // 出价竞拍--出价
            layer.open({
                type: 1,
                area: ['580px', 'auto'],
                title: false,
                title: ['竞拍结果', 'color:#666;font-size:14px;font-weight:bold;'], //自定义标题
                shadeClose: true,
                content: '<div id="payTips" class="frame-content"><div class="frame-body pay-tips-01"><div class="top"><p>竞拍档期：<span>' + $('#bpName').text() + '</span></p><p>您的出价：<span>￥' + $('#currentBidMoney').val() + '</span></p>' + (($('#maxMoney').text() !== '无' && ($('#maxMoney').text() === $('#money').text())) ? '<p style="color: #E6614F;">温馨提示：当前您的出价已为最高出价，请确认是否继续出价。</p >' : '') + '</div><p class="read">1、出价成功后，系统将暂时冻结您账户中对应的余额，余额不足则出价失败。<br />2、请保持关注，若有同行出价高于您的出价，则系统会即时解冻您被冻结的余额。 </p><div class="bottom"><button type="button" class="btn btn-default" id="btnConfirmBid">确认出价</button></div></div></div>'
            });
        });
        $('body').on('click', '#btnConfirmBid', function() {
            // 出价竞拍--确认出价
            self.bidding();
        }).on('click', '#btnBidSuccess', function() {
            // 出价成功
            layer.closeAll();
        }).on('click', '#btnBidFail', function() {
            // 出价成功
            layer.closeAll();
            window.location.href='/ad/account.html';
            self.getBid();
        }).on('click', '.pop-filter,.exit', function() {
            // 广告位置——单机弹窗关闭
            $('.pop-filter,.popup-ad').hide();
        });
        // 显示隐藏本期竞拍记录
        $(".record-show").click(function() {
            if ($('.record-list').hasClass('hide')) {
                self.getBidRecord();
            }
            if ($(".record-list").hasClass("hide")) {
                $(".record-list").removeClass("hide");
                $(".record-show").animate({
                    left: 0
                }, 0);
            } else {
                $(".record-list").addClass("hide");
                $(".record-show").animate({
                    left: 348
                }, 0);
            }
        });

        $('#bidResult').on('click', '.store-List', function() {
            // 竞拍结果--门店弹窗
            self.seeStore($(this).closest('tr').data('bpid'));
        }).on('click', '.ad-Preview', function() {
            // 竞拍结果--广告位置预览弹窗
            self.seeAdPos($(this).closest('tr').data('bpid'));
        }).on('click', '#btnBidContinue', function() {
            $('.nav-tabs li:eq(1) a').tab('show');
            $(".auction .nav-tabs").css("background-position-y", "-50px");
            $("div#auction-record").removeClass("hide");
            var $tr = $(this).closest('tr');
            self.nextBpid = $tr.data('bpid');
            self.nextIid = $tr.data('iid');
            self.getBid();
        }).on('click', '#adBind', function() {
            window.location.href = 'ad/ad-management.html';
        });
        // 选项卡切换
        $(".auction .nav-tabs li:nth-child(1)").click(function() {
            $(".auction .nav-tabs").css("background-position-y", "0");
            $("div#auction-record").addClass("hide");
            $(".record-list").addClass("hide");
            $(".record-show").animate({
                left: 348
            }, 0);
        });
        $('.auction .nav-tabs li.disabled a').on('show.bs.tab', function(e) {
            e.preventDefault();
        });
        $(".auction .nav-tabs li:nth-child(2)").click(function() {
            if (!$(this).hasClass('disabled')) {
                $(this).find('a').attr({ 'href': '#offer', 'role': 'tab', 'data-toggle': 'tab' });
                $(".auction .nav-tabs").css("background-position-y", "-50px");
                $("div#auction-record").removeClass("hide");
                self.nextBpid = '';
                self.nextIid = '';
                self.getBid();
            } else {
                $(this).find('a[href="#offer"]').attr({ 'href': 'javascript:void(0)', 'role': '', 'data-toggle': '' });
            }
        });
        $(".auction .nav-tabs li:nth-child(3)").click(function() {
            $(".auction .nav-tabs").css("background-position-y", "-100px");
            $("div#auction-record").addClass("hide");
            $(".record-list").addClass("hide");
            $(".record-show").animate({
                left: 348
            }, 0);
            self.getBidResult();
        });
        // 竞拍实时提醒
        layui.use('form', function() {
            var form = layui.form();
            form.on('switch(switchTest)', function(data) {
                if (data.elem.checked) {
                    self.openNotify(1);
                    $('.remind-window').removeClass('hide');
                } else {
                    self.openNotify(0);
                    $('.remind-window').addClass('hide');
                }
            });
        });
        $('.remind-window .btn-default').click(function() {
            $('.remind-window').addClass('hide');
        });
    },
    init: function() {
        this.bindEvent();
        this.getAllIndustry();
        this.getData();
        this.setAderPhone();
    }
}

layui.use('form', 'upload', 'layedit', 'laydate', 'laypage', 'layer', function() {
    var form = layui.form(),
        layer = layui.layer,
        laypage = layui.laypage,
        layedit = layui.layedit,
        laydate = layui.laydate;
});
$(function() {
    new Bidplan();
    /**
     * [站内提醒]
     */
    var getBidResult = function() {
        api.post('/api/bid/getBidNotify.jsp', {}, function(res) {
            if (0 === res.errCode && res.obj != null) {
                layui.use('layer', function() {
                    var layer = layui.layer;
                    layer.open({
                        type: 1,
                        area: ['420px', 'auto'],
                        offset: 'rb', //弹窗右下角
                        shade: 0,
                        move: false,
                        title: ['本期竞拍结果', 'font-size:12px;font-weight:bold;'], //自定义标题
                        shadeClose: true, //点击遮罩关闭
                        content: '<div id="resultTips " class="frame-content"><div class="frame-body result-tips "><div class="top "><h2>竞拍档期信息：<span class="name ">' + res.obj.bpName + '</span>-<span class="industry ">' + res.obj.iname + '</span></h2><p class="warning ">由于同行出价高于您的出价，此次竞拍失败， <br />金额将立即返回！╮（﹀＿﹀）╭</p><p>可继续参与竞拍，为确保您的账户余额充足！<span><a href="ad/account.html ">立即充值</a></span></p></div><div class="bottom ">' + (res.obj.next === 1 ? '<button type="button " class="btn btn-default btn-next" id="btnNext">查看下一条</button>' : '<button type="button " class="btn btn-default" id="btnKnow">我知道了</button>') + '</div></div></div>',
                        end: function() {
                            getBidResult();
                        }
                    });
                });

            }
        });
    };
    $('body').on('click', '#btnNext', function() {
        /**
         * [查看下一条]
         */
        $('.layui-layer-close').trigger('click');
    }).on('click', '#btnKnow', function() {
        /**
         * [我知道了]
         */
        $('.layui-layer-close').trigger('click');
    });
    getBidResult();
});
