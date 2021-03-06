function API() {}
API.prototype = {
    /**
     * [API接口调用]
     * @param {[type]}   type [请求类型]
     * @param {[type]}   _url [url]
     * @param {[type]}   data [参数]
     * @param {Function} cb   [回调函数]
     */
    APImethod: function(type, url, data, cb) {
        $.ajax({
            type: type,
            url: yonghui.contextPath + url,
            dataType: 'json',
            data: data,
            success: cb
        });
    },
    post: function(url, data, cb) {
        return this.APImethod('POST', url, data, cb)
    },
    get: function(url, data, cb) {
        return this.APImethod('GET', url, data, cb)
    },
    simple: function(str, obj) {
        return str.replace(/\$\w+\$/gi, function(matchs) {
            var returns = obj[matchs.replace(/\$/g, "")];
            return typeof returns === "undefined" ? "" : returns;
        });
    },
    /**
     * [获取url参数值]
     * @param  {[type]} name [参数名称]
     * @return {[type]}      [参数值]
     */
    getUrlParam: function(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"),
            r = window.location.search.substr(1).match(reg);
        return null != r ? unescape(r[2]) : null;
    }
};
var api = new API();

function Ader() {
    this.adUin = api.getUrlParam('aduin');
    this.init();
}
Ader.prototype = {
    /**
     * [请求接口]
     */
    getData: function() {
        var self = this;
        api.post('/api/ader/findById.jsp', {
            adUin: self.adUin
        }, function(res) {
            if (0 === res.errCode) {
                self.setAderInfo(res.obj);
            } else {
                layui.use('layer', function() {
                    var layer = layui.layer;

                    layer.msg(res.errMsg);
                });
            }
        })
    },
    /**
     * [图片展示]
     * @param  {[type]} obj [DOM节点]
     * @param  {[type]} url [图片url]
     */
    showImg: function(obj, url) {
        $(obj).closest('.upload').find('img').attr('src', url);
    },
    /**
     * [接口返回的信息填充]
     * @param {[type]} obj [接口返回的json串]
     */
    setAderInfo: function(obj) {
        $('#corporation').val(obj.corporation);
        $('#address').val(obj.address);
        $('#legalPerson').val(obj.legalPerson);
        $('#legalIdcard').val(obj.legalIdcard);
        $('#bank').val(obj.bank);
        $('#accountName').val(obj.accountName);
        $('#cardNo').val(obj.cardNo);
        $('#loginName').val(obj.loginName);
        $('#password').val(obj.password);
        $('#contact').val(obj.contact);
        $('#email').val(obj.email);
        $('#phone').val(obj.phone);
        $('#orgCode').val(obj.orgCode);
        $('#busiRegNo').val(obj.busiRegNo);
        $("#province").find('option[value="' + obj.province + '"]').attr("selected", true);
        $("#city").find('option[value="' + obj.city + '"]').attr("selected", true);
        $("#district").find('option[value="' + obj.district + '"]').attr("selected", true);
        this.showImg('#logoUrl', obj.logoUrl);
        this.showImg('#busiLicenseUrl', obj.busiLicenseUrl);
        this.showImg('#taxCertifyUrl', obj.taxCertifyUrl);
        this.selAddr(obj.province, obj.city, obj.district);
        // $('#province').find('option[value="' + '广东' + '"]').trigger('click');
    },
    /**
     * 数据格式验证
     * @param  {object} obj js节点
     */
    validate: function(obj) {
        if ('address' === obj.name) {
            if ('' === $('#province').val()) {
                this.setErrorMsg(obj, '请选择省份');
            } else if ('' === $('#city').val()) {
                this.setErrorMsg(obj, '请选择市');
            } else if ('' === $('#district').val()) {
                this.setErrorMsg(obj, '请选择县');
            } else if ('' === $.trim(obj.value)) {
                this.setErrorMsg(obj, '请输入' + $(obj).closest('.form-group').find('.control-label').text().split('：')[0]);
            }
        } else {
            if ('' === $.trim(obj.value)) {
                this.setErrorMsg(obj, '请输入' + $(obj).closest('.form-group').find('.control-label').text().split('：')[0]);
            } else {
                var name = obj.name,
                    val = obj.value;
                if ((name === 'legalIdcard') && !IdCardValidate(val)) {
                    this.setErrorMsg(obj, '身份证格式错误');
                } else if ((name === 'password') && !/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/.test(val)) {
                    this.setErrorMsg(obj, '请输入6-20位数字和字母的组合');
                } else if (name === 'email' && !/^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/.test(val)) {
                    this.setErrorMsg(obj, '联系人邮箱格式错误');
                } else if ((name === 'phone') && !/^1[34578]\d{9}$/.test(val)) {
                    this.setErrorMsg(obj, '手机号码格式错误');
                } else if ((name === 'orgCode') && !/^[\s\S]+$/.test(val)) {
                    this.setErrorMsg(obj, '组织机构代码格式错误');
                } else if (name === 'busiRegNo' && !/^[\s\S]+$/.test(val)) {
                    this.setErrorMsg(obj, '工商注册号格式错误');
                } else if (name === 'accountName' && (val !== $('input[name="corporation"]').val())) {
                    this.setErrorMsg(obj, '开户账户与企业名称不一致');
                } else if (name === 'loginName' && !/^[A-Za-z0-9\u4e00-\u9fa5]+$/.test(val)) {
                    this.setErrorMsg(obj, '请输入1-10位数字文字和字母的组合');
                } else if (name === 'cardNo' && !(/^\d{16}$/.test(val) || /^\d{19}$/.test(val))) {
                    this.setErrorMsg(obj, '账号格式错误');
                } else if(((name === 'legalPerson') || (name === 'contact')) && !/^[\u4e00-\u9fa5]{2,10}$/.test(val)) {
                    this.setErrorMsg(obj, '姓名格式错误');
                }
            }
        }
        /*if ('' === $.trim(obj.value)) {
            this.setErrorMsg(obj, '请输入' + $(obj).closest('.form-group').find('.control-label').text().split('：')[0]);
        } else {
            var name = obj.name,
                val = obj.value;
            if ((name === 'legalIdcard') && !IdCardValidate(val)) {
                this.setErrorMsg(obj, '身份证格式错误');
            } else if ((name === 'password') && !/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/.test(val)) {
                this.setErrorMsg(obj, '请输入6-20位数字和字母的组合');
            } else if (name === 'email' && !/^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/.test(val)) {
                this.setErrorMsg(obj, '联系人邮箱格式错误');
            } else if ((name === 'phone') && !/^1[34578]\d{9}$/.test(val)) {
                this.setErrorMsg(obj, '手机号码格式错误');
            } else if ((name === 'orgCode') && !/^\d{9}$/.test(val)) {
                this.setErrorMsg(obj, '组织机构代码格式错误');
            } else if (name === 'busiRegNo' && !/^.{15}$/.test(val)) {
                this.setErrorMsg(obj, '工商注册号格式错误');
            } else if (name === 'accountName' && (val !== $('input[name="corporation"]').val())) {
                this.setErrorMsg(obj, '开户账户与企业名称不一致');
            } else if (name === 'loginName' && !/^[A-Za-z0-9\u4e00-\u9fa5]+$/.test(val)) {
                this.setErrorMsg(obj, '用户名格式错误');
            } else if (name === 'cardNo' && !(/^\d{16}$/.test(val) || /^\d{19}$/.test(val))) {
                this.setErrorMsg(obj, '账号格式错误');
            }
        }*/
    },
    /**
     * 设置错误提示信息
     * @param {object} obj js节点
     * @param {String} msg 错误提示信息
     */
    setErrorMsg: function(obj, msg) {
        $(obj).closest('.form-group').find('.tips').html('<i class="fa fa-exclamation" aria-hidden="true"></i>' + msg);
    },
    /**
     * [保存用户信息修改]
     */
    updateAderInfo: function() {
        var dataPram = this.ARRAY2JSON($(".form-horizontal").serializeArray());
        var logoUrl = $('#logo').attr('src'),
            busiLicenseUrl = $('#busiLicense').attr('src'),
            taxCertifyUrl = $('#taxCertify').attr('src');
        dataPram.logoUrl = (logoUrl.indexOf('key=') === -1) ? logoUrl : this.urlParam('key', logoUrl);
        dataPram.busiLicenseUrl = (busiLicenseUrl.indexOf('key=') === -1) ? busiLicenseUrl : this.urlParam('key', busiLicenseUrl);
        dataPram.taxCertifyUrl = (taxCertifyUrl.indexOf('key=') === -1) ? taxCertifyUrl : this.urlParam('key', taxCertifyUrl);
        $('#logo').attr('src') || this.setErrorMsg('#logo', '请上传品牌logo');
        $('#busiLicense').attr('src') || this.setErrorMsg('#busiLicense', '请上传营业执照/税务登记证');
        $('#taxCertify').attr('src') || this.setErrorMsg('#taxCertify', '请上传一般纳税人资格认定资料');
        /*dataPram.logoUrl = this.urlParam('key', $('#logo').attr('src'));
        dataPram.busiLicenseUrl = this.urlParam('key', $('#busiLicense').attr('src'));
        dataPram.taxCertifyUrl = this.urlParam('key', $('#taxCertify').attr('src'));*/
        dataPram.tuin = this.adUin;

        $('input[type="text"],input[type="password"],input[type="email"]').trigger('blur');
        if (!$('.fa-exclamation').length) {
            api.post('/api/ader/update.jsp', dataPram, function(data) {
                if (data.errCode === 0) {
                    layer.msg('修改成功', {
                        time: 800
                    });
                    setTimeout(function() {
                        window.location.href = history.go(-1);
                    }, 800);
                } else {
                    layer.msg(data.errMsg);
                }
            });
        } else {
            $(window).scrollTop($('.fa-exclamation:first').offset().top - 120);
        }
    },
    /**
     * [url参数获取]
     * @param  {[type]} name [参数名]
     * @param  {[type]} url  [url]
     */
    urlParam: function(name, url) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = null;
        if (url) {
            var r = url.split('.jsp')[1].substr(1).match(reg);
        }
        return null != r ? unescape(r[2]) : null;
    },
    /**
     * [数组转json]
     * @param {[type]} arr [参数数组]
     */
    ARRAY2JSON: function(arr) {
        if (!arr || arr.length === 0) return {}
        var json = {}

        for (var i = 0; i < arr.length; i++) {
            json[arr[i].name] = arr[i].value;
        };

        return json;
    },
    /**
     * [输入位数控制]
     * @param  {[type]} obj [选择器]
     * @param  {[type]} num [位数]
     * @param  {[type]} msg [提示信息]
     */
    inputCtrl: function(obj, num, msg) {
        var $obj = $(obj);
        $obj.on('keydown input', function() {
            if ($obj.val().length > num) {
                $obj.val($obj.val().substr(0, num));
                if (msg) {
                    layer.msg(msg, {
                        time: 800
                    });
                } else {
                    layer.msg('最多输入' + num + '位', {
                        time: 800
                    });
                }
            }
        });
    },
    /**
     * [省市区]
     * @param  {[type]} provinceVal [省]
     * @param  {[type]} cityVal     [市]
     * @param  {[type]} districtVal [县]
     */
    selAddr: function(provinceVal, cityVal, districtVal) {
        if (provinceVal[provinceVal.length - 1] === '省') {
            provinceVal = provinceVal.substr(0, provinceVal.length - 1);
        }
        if (cityVal[cityVal.length - 1] === '市') {
            cityVal = cityVal.substr(0, cityVal.length - 1);
        }
        var region = {};
        $.ajax({
            url: yonghui.contextPath + '/ad/js/region.json',
            type: 'POST',
            dataType: 'json',
            async: false,
            success: function(res) {
                region = res.region;
            }
        });
        var province = '<option value="">请选择省</option>';
        provinceVal && $.each(region, function(n, item) {
            province += '<option value="' + item.name + '">' + item.name + '</option>';
        });
        $('#province').html(province);

        $('#province').find('option[value="' + provinceVal + '"]').attr('selected', true);
        var city = '<option value="">请选择市</option>';
        var cityObj = region[$('#province').get(0).selectedIndex - 1].city;
        cityVal && $.each(cityObj, function(n, item) {
            city += '<option value="' + item.name + '">' + item.name + '</option>';
        });
        $('#city').html(city);
        $('#city').find('option[value="' + cityVal + '"]').attr('selected', true);

        var district = '<option value="">请选择县/区</option>';
        districtVal && $.each(cityObj[$('#city').get(0).selectedIndex - 1].area, function(i, value) {
            district += '<option value="' + value + '">' + value + '</option>'
        });
        $('#district').html(district);
        $('#district').find('option[value="' + districtVal + '"]').attr('selected', true);

        layui.use('form', function() {
            var form = layui.form();
            var cityObj = {};
            form.render('select');
            form.on('select(province)', function(data) {
                var city = '<option value="">请选择市</option>';
                cityObj = region[$(data.elem).get(0).selectedIndex - 1].city;
                $.each(cityObj, function(n, item) {
                    city += '<option value="' + item.name + '">' + item.name + '</option>';
                });
                $('#city').html(city);
                $('#district').html('<option value="">请选择县/区</option>');
                form.render('select');
            });
            form.on('select(city)', function(data) {
                var district = '<option value="">请选择县/区</option>';
                $.each(cityObj[$(data.elem).get(0).selectedIndex - 1].area, function(i, value) {
                    district += '<option value="' + value + '">' + value + '</option>'
                });
                $('#district').html(district);
                form.render('select');
            });
            $('body').on('click', '.city-wrap', function() {
                if ('' === $('#province').val()) {
                    layer.msg('请先选择省份', {
                        time: 700
                    });
                }
            }).on('click', '.district-wrap', function() {
                if ('' === $('#province').val()) {
                    layer.msg('请先选择省份', {
                        time: 700
                    });
                } else if ('' === $('#city').val()) {
                    layer.msg('请先选择市', {
                        time: 700
                    });
                }
            });
        });
    },
    /**
     * [事件]
     */
    bindEvent: function() {
        var self = this;

        $('input[type="text"],input[type="password"],input[type="email"]').on('blur', function() {
            self.validate(this);
        }).on('focus', function() {
            $(this).closest('.form-group').find('.tips').html('')
        });

        self.inputCtrl('#legalIdcard', 18);
        self.inputCtrl('#phone', 11);
        self.inputCtrl('#orgCode');
        self.inputCtrl('#busiRegNo');
        self.inputCtrl('#vcode', 6);
        self.inputCtrl('#password', 20);
        self.inputCtrl('#loginName', 10, '请输入1-10位任意组合用户名');
        self.inputCtrl('#cardNo', 19);
        self.inputCtrl('#legalPerson', 10);
        self.inputCtrl('#contact', 10);

        $('.content').on('click', '#btnSave', function() {
            self.updateAderInfo();
        });
    },
    init: function() {
        this.getData();
        this.bindEvent();
    }
}

$(function() {
    new Ader();
    /**
     * 图片上传
     */
    layui.use('upload', function() {
        layui.upload({
            url: yonghui.contextPath + '/api/ader/upload.jsp' //上传接口
                ,
            success: function(res, input) { //上传成功后的回调
                if (res.errCode === 0) {
                    $(input).closest('.form-group').find('.tips').empty();
                    $(input).parents('.upbar').siblings('img').attr('src', yonghui.contextPath + '/api/showTempImg.jsp?key=' + res.obj);
                } else {
                    alert(res.errMsg);
                }
            }
        });
    });
});
