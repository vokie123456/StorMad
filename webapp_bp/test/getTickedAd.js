$(function() {
    var param = { shopCode: '', goods: [], payInfo: [] };
    $('#post').on('click', function() {
        param.shopCode = $('#storeCode').val();
        $.each($('.prolist .item'), function(n, item) {
            param.goods[n] = {
                wekgrId: $(item).find('.industryId').val(),
                number: $(item).find('.purchaseNum').val(),
                code: $(item).find('.proCode').val(),
                price: $(item).find('.price').val()
            }
        });
        $.each($('.pay .item'), function(n, item) {
            param.payInfo[n] = {
                payStyle: $(item).find('.payWay').val(),
                payCode: $(item).find('.thirdNum').val(),
                businessPayCode: $(item).find('.bisNum').val(),
                payValue: $(item).find('.money').val()
            }
        });
        // JSON.stringify(param)
        $.ajax({
            type: 'POST',
            contentType:   "application/json;charset=utf-8",
            url: yonghui.contextPath + '/api/test/getTickedAd.jsp',
            dataType: 'json',
            data: JSON.stringify(param),
            success: function(res) {
                console.log(res);
                $('.resInfo').html(String(res));
            },
            error:function(res){
            	$('.resInfo').html(res);
            }
        });
    });
    $('#addPro').click(function(){
    	$('.prolist').append('<div class="item clearfix"> <div class="input-wrap"> <label>测试客组/行业ID：</label> <input class="industryId" type="text" name="" value="" placeholder=""> </div> <div class="input-wrap"> <label>购买数量：</label> <input class="purchaseNum" type="text" name="" value="" placeholder=""> </div> <div class="input-wrap"> <label>商品编码：</label> <input class="proCode" type="text" name="" value="" placeholder=""> </div> <div class="input-wrap"> <label>商品单价：</label> <input class="price" type="text" name="" value="" placeholder=""> </div> </div>');
    });
    $('#addPay').click(function(){
    	$('.pay').append('<div class="item clearfix"> <div class="input-wrap"> <label>支付方式：</label> <input class="payWay" type="text" name="" value="" placeholder=""> </div> <div class="input-wrap"> <label>第三方交易单号：</label> <input class="thirdNum" type="text" name="" value="" placeholder=""> </div> <div class="input-wrap"> <label>商户交易单号：</label> <input class="bisNum" type="text" name="" value="" placeholder=""> </div> <div class="input-wrap"> <label>支付金额：</label> <input class="money" type="text" name="" value="" placeholder=""> </div> </div>');
    });
});
