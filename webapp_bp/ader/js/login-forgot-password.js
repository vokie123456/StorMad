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
    }
};
var api = new API();

function Password() {
    this.loginName = '';
    this.time = '';
    this.code = '';
    this.init();
};
Password.prototype = {
    /**
     * [获取手机验证码]
     */
    getCode: function() {
        var self = this;
        api.post('/api/ader/forgetPwd.jsp', {
            loginName: self.loginName
        }, function(res) {
            if((0 === res.errCode) && res.obj){
                self.countDown(60);
            }else{
                layui.use('layer', function() {
                    var layer = layui.layer;
                    layer.msg(res.errMsg);
                });
            }
        });
    },
    /**
     * 获取验证码倒计时
     * @param  {int} second 时间
     */
    countDown: function(second) {
        var self = this;
        second = parseInt(second);
        $('#btnCode').html(second).addClass('disabled');
        self.time = setTimeout(function() {
            if (second === 1) {
                $('#btnCode').html('获取验证码').removeClass('disabled');
            } else {
                $('#btnCode').html(second);
                second--;
                self.countDown(second);
            }
        }, 1000)
    },
    /**
     * [用户名验证码格式验证]
     */
    verify: function() {
        if ('' === $.trim($('#user').val())) {
            $('.step1 .tips-box p').html('<i class="exclamation-icon"></i>请输入用户名');
            $('#user').focus();
        } else if ('' === $.trim($('#code').val())) {
            $('.step1 .tips-box p').html('<i class="exclamation-icon"></i>请输入验证码');
            $('#code').focus();
        } else {
            this.loginName = $('#user').val();
            this.code = $('#code').val();
            this.verifyCode();
        }
    },
    /**
     * [验证码提交验证]
     */
    verifyCode: function() {
        api.post('/api/ader/verifyCode.jsp', {
            loginName: this.loginName,
            vCode: this.code
        }, function(res) {
            if (0 === res.errCode) {
                $('.step1').hide();
                $('.step2').show();
            } else {
                $('.step1 .tips-box p').html('<i class="exclamation-icon"></i>' + res.errMsg);
                /*layui.use('layer', function() {
                    var layer = layui.layer();
                    layer.msg(res.errMsg);
                });*/
            }
        });
    },
    /**
     * [密码格式校验]
     */
    verifyPwd: function() {
        if ('' === $.trim($('#password').val())) {
            $('.step2 .tips-box p').html('<i class="exclamation-icon"></i>请输入新密码');
            $('#password').focus();
        } else if ('' === $.trim($('#passwordConfirm').val())) {
            $('.step2 .tips-box p').html('<i class="exclamation-icon"></i>请再次输入密码');
            $('#passwordConfirm').focus();
        } else if (!/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/.test($('#password').val())) {
            $('.step2 .tips-box p').html('<i class="exclamation-icon"></i>请输入6-20位数字和字母的组合');
            $('#password').focus();
        } else if ($('#password').val() !== $('#passwordConfirm').val()) {
            $('.step2 .tips-box p').html('<i class="exclamation-icon"></i>两次输入的密码不一致');
        } else {
            this.resetPwd($('#password').val());
        }
    },
    /**
     * [重置密码提交]
     */
    resetPwd: function(pwd) {
        api.post('/api/ader/resetPwd.jsp', {
            loginName: this.loginName,
            password: pwd,
            vCode: this.code
        }, function(res) {
            if (0 === res.errCode) {
                $('.step1,.step2').remove();
                $('.step3').show();
            } else {
                layui.use('layer', function() {
                    var layer = layui.layer();
                    layer.msg(res.errMsg);
                });
            }
        });
    },
    bindEvent: function() {
        var self = this;
        $('.step1').on('click', '#btnCode:not(.disabled)', function() {
            if ('' === $.trim($('#user').val())) {
                $('.step1 .tips-box p').html('<i class="exclamation-icon"></i>请输入用户名');
                $('#user').focus();
            } else {
                self.loginName = $('#user').val();
                self.getCode();
            }
        }).on('click', '#btnNext', function() {
            self.verify();
        });
        $('#btnSubmit').on('click', function() {
            self.verifyPwd();
        });
        $('.btn-reLogin').on('click', function() {
            window.location.href = 'login.html';
        });
        $('.btn-return').on('click', function() {
            $('.forgot-password').hide();
            $('.step1').show();
        });
    },
    init: function() {
        this.bindEvent();
    }
};

$(function() {
    new Password();
});
