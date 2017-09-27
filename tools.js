/*
 * @Author: ecitlm
 * @Date:   2017-09-22 23:15:16
 * @Last Modified by:   ecitlm
 * @Last Modified time: 2017-09-27 22:27:35
 */
(function(win, doc) {
	var Tools = {

		//id或class选择器$("elem") 
		$: function(strExpr) {
			var idExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/;
			var classExpr = /^(?:\s*(<[\w\W]+>)[^>]*|.([\w-]*))$/;
			if (idExpr.test(strExpr)) {
				var idMatch = idExpr.exec(strExpr);
				return document.getElementById(idMatch[2]);
			} else if (classExpr.test(strExpr)) {
				var classMatch = classExpr.exec(strExpr);
				var allElement = document.getElementsByTagName("*");
				var ClassMatch = [];
				for (var i = 0, l = allElement.length; i < l; i++) {
					if (allElement[i].className.match(new RegExp("(\\s|^)" + classMatch[2] + "(\\s|$)"))) {
						ClassMatch.push(allElement[i]);
					}
				}
				return ClassMatch;
			}
		},
		//ajax
		ajax: function() {
			var ajaxData = {
				type: arguments[0].type || "GET",
				url: arguments[0].url || "",
				async: arguments[0].async || "true",
				data: arguments[0].data || null,
				dataType: arguments[0].dataType || "text",
				contentType: arguments[0].contentType || "application/x-www-form-urlencoded",
				beforeSend: arguments[0].beforeSend || function() {},
				success: arguments[0].success || function() {},
				error: arguments[0].error || function() {}
			}
			ajaxData.beforeSend()
			var xhr = createxmlHttpRequest();
			xhr.responseType = ajaxData.dataType;
			xhr.open(ajaxData.type, ajaxData.url, ajaxData.async);
			xhr.setRequestHeader("Content-Type", ajaxData.contentType);
			xhr.send(convertData(ajaxData.data));
			xhr.onreadystatechange = function() {
				if (xhr.readyState == 4) {
					if (xhr.status == 200) {
						ajaxData.success(xhr.response)
					} else {
						ajaxData.error()
					}
				}
			}

			function createxmlHttpRequest() {
				if (window.ActiveXObject) {
					return new ActiveXObject("Microsoft.XMLHTTP");
				} else if (window.XMLHttpRequest) {
					return new XMLHttpRequest();
				}
			}

			function convertData(data) {
				if (typeof data === 'object') {
					var convertResult = "";
					for (var c in data) {
						convertResult += c + "=" + data[c] + "&";
					}
					convertResult = convertResult.substring(0, convertResult.length - 1)
					return convertResult;
				} else {
					return data;
				}
			}
		},
		//生成随机数
		getRandom: function(num) {
			var random = "";
			for (var i = 0; i < num; i++) {
				random += Math.floor(Math.random() * 10)
			}
			return random
		},
		//得到URL的参数
		getParams: function(url) {
			url = url.substring(url.indexOf('?') + 1);
			var obj = {};
			if (url) {
				arr = url.split("&");
				for (var i in arr) {
					obj[arr[i].split('=')[0]] = encodeURI(arr[i].split('=')[1].split("#")[0]);
				};
			};
			return obj;
		},

		//url 序列化
		//urlParam({a:1,b:2,c:'hello'}) //a=1&b=2&c=hello
		urlParam: function(obj) {
			var arr = [];
			for (var k in obj) {
				if (obj[k] != null && obj[k] != '') {
					arr.push(k + '=' + obj[k])
				}
			}
			return arr.join('&');
		},

		//获取当前时间戳 转化为2017-25-09 13:05:55
		FormatDate: function() {
			var date = new Date();
			var MM = date.getMonth() + 1;
			var DD = date.getDate();
			var HH = date.getHours()
			var ii = date.getMinutes();
			var ss = date.getSeconds();
			if (MM >= 1 && MM <= 9) {
				MM = "0" + MM;
			}
			if (DD >= 0 && DD <= 9) {
				DD = "0" + DD;
			}
			if (HH >= 0 && HH <= 9) {
				HH = "0" + HH;
			}
			if (ii >= 0 && ii <= 9) {
				ii = "0" + ii;
			}
			if (ss >= 0 && ss <= 9) {
				ss = "0" + ss;
			}
			var currentdate = date.getFullYear() + "-" + DD + "-" + MM + " " + HH + ":" + ii + ":" + ss;
			return currentdate;

		},
		//检查设备是安卓还是IOS还是PC
		os: function() {
			var ua = navigator.userAgent,
				isWindowsPhone = /(?:Windows Phone)/.test(ua),
				isSymbian = /(?:SymbianOS)/.test(ua) || isWindowsPhone,
				isAndroid = /(?:Android)/.test(ua),
				isFireFox = /(?:Firefox)/.test(ua),
				isChrome = /(?:Chrome|CriOS)/.test(ua),
				isTablet = /(?:iPad|PlayBook)/.test(ua) || (isAndroid && !/(?:Mobile)/.test(ua)) || (isFireFox && /(?:Tablet)/.test(ua)),
				isPhone = /(?:iPhone)/.test(ua) && !isTablet,
				isPc = !isPhone && !isAndroid && !isSymbian;
			return {
				isTablet: isTablet,
				isPhone: isPhone,
				isAndroid: isAndroid,
				isPc: isPc
			};
		},
		//检测表单验证
		checkForm: function(str, type) {
			switch (type) {
				case 'email':
					return /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/.test(str);
				case 'phone':
					return /^1[3|4|5|7|8][0-9]{9}$/.test(str);
				case 'tel':
					return /^(0\d{2,3}-\d{7,8})(-\d{1,4})?$/.test(str);
				case 'number':
					return /^[0-9]$/.test(str);
				case 'english':
					return /^[a-zA-Z]+$/.test(str);
				case 'text':
					return /^\w+$/.test(str);
				case 'chinese':
					return /^[\u4E00-\u9FA5]+$/.test(str);
				case 'lower':
					return /^[a-z]+$/.test(str);
				case 'upper':
					return /^[A-Z]+$/.test(str);
				default:
					console.error("没有匹配到要check的类型type:" + type);
					return false;
			}
		},
		//替换手机号的的 4-7位为138****8888
		replacePhone: function(phone) {
			phone = phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
			return phone;
		}

	}
	window.Tools = Tools
})(window, document)