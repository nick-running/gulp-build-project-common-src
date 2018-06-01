
(function($, owner) {
	/**
	 * 用户登录
	 **/
	owner.login = function(loginInfo, callback) {
		callback = callback || $.noop;
		loginInfo = loginInfo || {};
		loginInfo.phoneNumber = loginInfo.phoneNumber || '';
		loginInfo.captch = loginInfo.captch || '';
        var phone_pattern = /^1[3|4|5|7|8][0-9]{9}$/;
        if (!phone_pattern.test(loginInfo.phoneNumber)) {
			return callback('请输入正确的手机号');
        }
		if (loginInfo.captch.length < 5) {
			return callback('请输入6位的验证码');
		}
		// var users = JSON.parse(localStorage.getItem('$users') || '[]');
		// var authed = users.some(function(user) {
		// 	return loginInfo.phoneNumber == user.phoneNumber && loginInfo.captch == user.captch;
		// });
		// if (authed) {
		// 	return owner.createState(loginInfo.phoneNumber, callback);
		// } else {
		// 	return callback('用户名或密码错误');
		// }
        return callback()
	};

    owner.captchCountDown = function (ele) {
        var cacheText = ele.innerText
        ele.disabled = true
        var counter = 60
        var interval = setInterval(function () {
            ele.innerText = '已发送('+counter+'s)'
            counter--
            if(counter<=0) {
                clearInterval(interval)
                ele.innerText = cacheText
                ele.disabled = false
            }
        }, 1000)
    }
    owner.createState = function(name, callback) {
        var state = owner.getState();
        state.account = name;
        state.token = "token123456789";
        owner.setState(state);
        return callback();
    };
    /**
     * 获取当前状态
     **/
    owner.getState = function() {
        var stateText = localStorage.getItem('$state') || "{}";
        return JSON.parse(stateText);
    };

    /**
     * 设置当前状态
     **/
    owner.setState = function(state) {
        state = state || {};
        localStorage.setItem('$state', JSON.stringify(state));
        //var settings = owner.getSettings();
        //settings.gestures = '';
        //owner.setSettings(settings);
    };
}(mui, window.app = {}));